package az.ilham.ecommerceauth.user.controller;

import az.ilham.ecommerceauth.dto.user.RolePermissionsResponse;
import az.ilham.ecommerceauth.dto.user.UserSummaryResponse;
import az.ilham.ecommerceauth.user.entity.PermissionName;
import az.ilham.ecommerceauth.security.JwtAuthenticationFilter;
import az.ilham.ecommerceauth.user.service.RoleAdminService;
import az.ilham.ecommerceauth.user.service.UserAdminService;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AdminController.class, OperatorController.class})
@Import(TestSecurityConfig.class)
class AdminControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserAdminService userAdminService;

    @MockBean
    private RoleAdminService roleAdminService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @WithMockUser(authorities = {"users.read"})
    void getUsers_WithPermission_ShouldReturnOk() throws Exception {
        when(userAdminService.getAllUsers()).thenReturn(List.of(
                UserSummaryResponse.builder().id(1L).username("demo").roles(Set.of("ROLE_USER")).build()
        ));

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void getUsers_WithoutUsersReadPermission_ShouldReturnForbidden() throws Exception {
        PreAuthorize preAuthorize = AdminController.class.getMethod("getUsers").getAnnotation(PreAuthorize.class);
        assertTrue(preAuthorize != null);
        assertEquals("hasAuthority('users.read')", preAuthorize.value());
    }

    @Test
    @WithMockUser(authorities = {"roles.permission.update"})
    void updateRolePermissions_WithPermission_ShouldReturnOk() throws Exception {
        when(roleAdminService.updateRolePermissions(org.mockito.ArgumentMatchers.eq("ROLE_ADMIN"), org.mockito.ArgumentMatchers.any()))
                .thenReturn(RolePermissionsResponse.builder().roleName("ROLE_ADMIN").permissions(Set.of("users.read")).build());

        mockMvc.perform(patch("/api/admin/roles/ROLE_ADMIN/permissions")
                        .with(csrf())
                        .contentType("application/json")
                        .content("{\"permissions\":[\"users.read\"]}"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_OPERATOR"})
    void operatorWorkspace_WithoutPermission_ShouldReturnForbidden() throws Exception {
        PreAuthorize preAuthorize = OperatorController.class.getMethod("getWorkspace").getAnnotation(PreAuthorize.class);
        assertTrue(preAuthorize != null);
        assertEquals("hasAuthority('" + PermissionName.OPERATOR_PORTAL_ACCESS + "')", preAuthorize.value());
    }

    @Test
    @WithMockUser(authorities = {"operator.portal.access"})
    void operatorWorkspace_WithPermission_ShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/operator/workspace"))
                .andExpect(status().isOk());
    }
}
