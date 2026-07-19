package az.ilham.ecommerceauth.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Rola bağlı icazələri yeniləmək üçün sorğu payload-u.")
public class UpdateRolePermissionsRequest {

    @NotNull(message = "Permissions must be provided")
    @Schema(
            description = "Rola təyin ediləcək icazə adları. Bütün icazələri silmək üçün boş massiv göndərin.",
            example = "[\"users.read\", \"users.role.update\"]"
    )
    private Set<String> permissions;
}
