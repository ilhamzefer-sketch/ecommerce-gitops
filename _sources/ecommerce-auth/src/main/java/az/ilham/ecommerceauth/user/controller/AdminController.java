package az.ilham.ecommerceauth.user.controller;

import az.ilham.ecommerceauth.dto.user.UpdateUserRolesRequest;
import az.ilham.ecommerceauth.dto.user.RolePermissionsResponse;
import az.ilham.ecommerceauth.dto.user.UpdateRolePermissionsRequest;
import az.ilham.ecommerceauth.dto.user.UserSummaryResponse;
import az.ilham.ecommerceauth.user.service.RoleAdminService;
import az.ilham.ecommerceauth.user.service.UserAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin İdarəetməsi", description = "Sistem istifadəçiləri, rollar və icazələrin idarəsi üçün yalnız adminə açıq endpoint-lər.")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class AdminController {

    private final UserAdminService userAdminService;
    private final RoleAdminService roleAdminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('admin.dashboard.read')")
    @Operation(summary = "Admin panelinin əsas məlumatlarını gətir")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Admin panel məlumatları uğurla qaytarıldı"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "403", description = "İstifadəçidə ROLE_ADMIN yoxdur")
    })
    public ResponseEntity<Map<String, String>> getAdminDashboard() {
        return ResponseEntity.ok(Map.of(
                "title", "Admin Dashboard",
                "message", "This information is only visible to admins",
                "status", "Healthy"
        ));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('users.read')")
    @Operation(summary = "Bütün istifadəçiləri mövcud sistem rolları ilə birlikdə siyahıla")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "İstifadəçilər uğurla qaytarıldı",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserSummaryResponse.class)))
            ),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "403", description = "İstifadəçidə ROLE_ADMIN yoxdur")
    })
    public ResponseEntity<List<UserSummaryResponse>> getUsers() {
        return ResponseEntity.ok(userAdminService.getAllUsers());
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('users.read')")
    @Operation(summary = "Bir istifadəçini mövcud sistem rolları ilə birlikdə gətir")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "İstifadəçi uğurla qaytarıldı",
                    content = @Content(schema = @Schema(implementation = UserSummaryResponse.class))
            ),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "403", description = "İstifadəçidə ROLE_ADMIN yoxdur"),
            @ApiResponse(responseCode = "404", description = "İstifadəçi tapılmadı")
    })
    public ResponseEntity<UserSummaryResponse> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userAdminService.getUserById(userId));
    }

    @PatchMapping("/users/{userId}/roles")
    @PreAuthorize("hasAuthority('users.role.update')")
    @Operation(summary = "İstifadəçiyə sistem rolları təyin et")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "İstifadəçi rolları uğurla yeniləndi",
                    content = @Content(schema = @Schema(implementation = UserSummaryResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Naməlum rol adı və ya sorğu yanlışdır"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "403", description = "İstifadəçidə ROLE_ADMIN yoxdur"),
            @ApiResponse(responseCode = "404", description = "İstifadəçi tapılmadı")
    })
    public ResponseEntity<UserSummaryResponse> updateRoles(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRolesRequest request
    ) {
        return ResponseEntity.ok(userAdminService.updateUserRoles(userId, request));
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('roles.read')")
    @Operation(summary = "Bütün sistem rollarını mövcud icazələri ilə birlikdə siyahıla")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Rollar uğurla qaytarıldı",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = RolePermissionsResponse.class)))
            ),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "403", description = "İstifadəçidə ROLE_ADMIN yoxdur")
    })
    public ResponseEntity<List<RolePermissionsResponse>> getRoles() {
        return ResponseEntity.ok(roleAdminService.getAllRoles());
    }

    @GetMapping("/roles/{roleName}")
    @PreAuthorize("hasAuthority('roles.read')")
    @Operation(summary = "Bir sistem rolunu mövcud icazələri ilə birlikdə gətir")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Rol uğurla qaytarıldı",
                    content = @Content(schema = @Schema(implementation = RolePermissionsResponse.class))
            ),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "403", description = "İstifadəçidə ROLE_ADMIN yoxdur"),
            @ApiResponse(responseCode = "404", description = "Rol tapılmadı")
    })
    public ResponseEntity<RolePermissionsResponse> getRole(@PathVariable String roleName) {
        return ResponseEntity.ok(roleAdminService.getRoleByName(roleName));
    }

    @PatchMapping("/roles/{roleName}/permissions")
    @PreAuthorize("hasAuthority('roles.permission.update')")
    @Operation(summary = "Sistem roluna icazələr təyin et")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Rol icazələri uğurla yeniləndi",
                    content = @Content(schema = @Schema(implementation = RolePermissionsResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Naməlum icazə adı və ya sorğu yanlışdır"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "403", description = "İstifadəçidə ROLE_ADMIN yoxdur"),
            @ApiResponse(responseCode = "404", description = "Rol tapılmadı")
    })
    public ResponseEntity<RolePermissionsResponse> updateRolePermissions(
            @PathVariable String roleName,
            @Valid @RequestBody UpdateRolePermissionsRequest request
    ) {
        return ResponseEntity.ok(roleAdminService.updateRolePermissions(roleName, request));
    }
}
