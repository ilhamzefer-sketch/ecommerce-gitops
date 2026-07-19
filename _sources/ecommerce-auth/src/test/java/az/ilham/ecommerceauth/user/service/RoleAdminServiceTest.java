package az.ilham.ecommerceauth.user.service;

import az.ilham.ecommerceauth.dto.user.RolePermissionsResponse;
import az.ilham.ecommerceauth.dto.user.UpdateRolePermissionsRequest;
import az.ilham.ecommerceauth.user.entity.Permission;
import az.ilham.ecommerceauth.user.entity.PermissionName;
import az.ilham.ecommerceauth.user.entity.Role;
import az.ilham.ecommerceauth.user.entity.RoleName;
import az.ilham.ecommerceauth.user.entity.User;
import az.ilham.ecommerceauth.user.repository.PermissionRepository;
import az.ilham.ecommerceauth.user.repository.RoleRepository;
import az.ilham.ecommerceauth.user.repository.UserRepository;
import az.ilham.ecommerceauth.auth.service.RefreshTokenService;
import az.ilham.ecommerceauth.security.audit.AuthorizationAuditService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoleAdminServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private AuthorizationAuditService authorizationAuditService;

    @InjectMocks
    private RoleAdminService roleAdminService;

    private Role adminRole;

    @BeforeEach
    void setUp() {
        adminRole = Role.builder()
                .id(1L)
                .name(RoleName.ADMIN)
                .permissions(new LinkedHashSet<>(Set.of(
                        Permission.builder().id(10L).name(PermissionName.ADMIN_DASHBOARD_READ).build()
                )))
                .build();
    }

    @Test
    void getAllRoles_ShouldReturnSortedRoleList() {
        Role userRole = Role.builder().id(2L).name(RoleName.USER).permissions(new LinkedHashSet<>()).build();
        when(roleRepository.findAll()).thenReturn(List.of(userRole, adminRole));

        List<RolePermissionsResponse> response = roleAdminService.getAllRoles();

        assertEquals(RoleName.ADMIN, response.getFirst().getRoleName());
        assertEquals(RoleName.USER, response.get(1).getRoleName());
    }

    @Test
    void updateRolePermissions_ShouldReplacePermissions() {
        UpdateRolePermissionsRequest request = UpdateRolePermissionsRequest.builder()
                .permissions(Set.of(PermissionName.USERS_READ, PermissionName.USERS_ROLE_UPDATE))
                .build();

        when(roleRepository.findByName(RoleName.ADMIN)).thenReturn(Optional.of(adminRole));
        when(permissionRepository.findByName(PermissionName.USERS_READ))
                .thenReturn(Optional.of(Permission.builder().id(11L).name(PermissionName.USERS_READ).build()));
        when(permissionRepository.findByName(PermissionName.USERS_ROLE_UPDATE))
                .thenReturn(Optional.of(Permission.builder().id(12L).name(PermissionName.USERS_ROLE_UPDATE).build()));
        when(userRepository.findDistinctByRoles_Name(RoleName.ADMIN))
                .thenReturn(List.of(User.builder().id(7L).username("admin-user").authorizationVersion(2L).build()));
        when(roleRepository.save(any(Role.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RolePermissionsResponse response = roleAdminService.updateRolePermissions(RoleName.ADMIN, request);

        assertTrue(response.getPermissions().contains(PermissionName.USERS_READ));
        assertTrue(response.getPermissions().contains(PermissionName.USERS_ROLE_UPDATE));
        assertEquals(2, response.getPermissions().size());
        verify(roleRepository).save(any(Role.class));
        verify(refreshTokenService, times(1)).revokeAllUserTokens(any(User.class));
        verify(authorizationAuditService).log(any(), any(), any(), any());
    }
}
