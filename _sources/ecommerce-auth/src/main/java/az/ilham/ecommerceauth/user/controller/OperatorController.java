package az.ilham.ecommerceauth.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/operator")
@Tag(name = "Operator İş Sahəsi", description = "Back-office interfeysi üçün operator, moderator və admin girişi nümunələri.")
@SecurityRequirement(name = "bearerAuth")
public class OperatorController {

    @GetMapping("/workspace")
    @PreAuthorize("hasAuthority('operator.portal.access')")
    @Operation(summary = "Nümunə operator iş sahəsi məlumatlarını gətir")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Operator iş sahəsi məlumatları uğurla qaytarıldı"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "403", description = "İstifadəçinin operator səviyyəli giriş icazəsi yoxdur")
    })
    public ResponseEntity<Map<String, Object>> getWorkspace() {
        return ResponseEntity.ok(Map.of(
                "queueName", "listing-review",
                "allowedRoles", new String[]{"ROLE_OPERATOR", "ROLE_MODERATOR", "ROLE_ADMIN"},
                "message", "This area is available to operator-level accounts."
        ));
    }
}
