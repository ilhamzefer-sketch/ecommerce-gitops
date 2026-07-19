package az.ilham.ecommerceauth.user.service;

import az.ilham.ecommerceauth.auth.service.RefreshTokenService;
import az.ilham.ecommerceauth.common.exception.ResourceNotFoundException;
import az.ilham.ecommerceauth.dto.user.RolePermissionsResponse;
import az.ilham.ecommerceauth.dto.user.UpdateRolePermissionsRequest;
import az.ilham.ecommerceauth.security.audit.AuthorizationAuditService;
import az.ilham.ecommerceauth.user.entity.Permission;
import az.ilham.ecommerceauth.user.entity.Role;
import az.ilham.ecommerceauth.user.repository.PermissionRepository;
import az.ilham.ecommerceauth.user.repository.RoleRepository;
import az.ilham.ecommerceauth.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleAdminService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final AuthorizationAuditService authorizationAuditService;

    @Transactional(readOnly = true)
    public List<RolePermissionsResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .sorted((left, right) -> left.getName().compareToIgnoreCase(right.getName()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RolePermissionsResponse getRoleByName(String roleName) {
        return toResponse(findRole(roleName));
    }

    @Transactional
    public RolePermissionsResponse updateRolePermissions(String roleName, UpdateRolePermissionsRequest request) {
        Role role = findRole(roleName);
        Set<String> permissionNames = request.getPermissions() == null
                ? Set.of()
                : new LinkedHashSet<>(request.getPermissions());

        Set<Permission> permissions = permissionNames.stream()
                .map(permissionName -> permissionRepository.findByName(permissionName)
                        .orElseThrow(() -> new IllegalArgumentException("Unknown permission: " + permissionName)))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        role.setPermissions(permissions);
        roleRepository.save(role);
        List<az.ilham.ecommerceauth.user.entity.User> affectedUsers = userRepository.findDistinctByRoles_Name(role.getName());
        affectedUsers.forEach(user -> {
            user.setAuthorizationVersion(user.getAuthorizationVersion() + 1);
            userRepository.save(user);
            refreshTokenService.revokeAllUserTokens(user);
        });
        log.info("Permissions updated for role={} permissions={} affectedUsers={}",
                role.getName(), permissionNames, affectedUsers.size());
        authorizationAuditService.log(
                "ROLE_PERMISSION_UPDATE",
                "ROLE",
                role.getName(),
                "Assigned permissions=" + permissionNames + ", affectedUsers=" + affectedUsers.size()
        );
        return toResponse(role);
    }

    private Role findRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
    }

    private RolePermissionsResponse toResponse(Role role) {
        return RolePermissionsResponse.builder()
                .roleName(role.getName())
                .permissions(role.getPermissions().stream()
                        .map(Permission::getName)
                        .sorted()
                        .collect(Collectors.toCollection(LinkedHashSet::new)))
                .build();
    }
}
