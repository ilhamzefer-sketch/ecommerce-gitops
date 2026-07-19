package az.ilham.ecommerceauth.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "İstifadəçinin sistem rollarını yeniləmək üçün sorğu payload-u.")
public class UpdateUserRolesRequest {

    @NotEmpty(message = "At least one role must be provided")
    @Schema(
            description = "Təyin olunacaq rol adları. ROLE_USER həmişə avtomatik qorunur.",
            example = "[\"ROLE_USER\", \"ROLE_OPERATOR\"]"
    )
    private Set<String> roles;
}
