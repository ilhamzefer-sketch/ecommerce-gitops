package az.ilham.ecommerceauth.dto.user;

import az.ilham.ecommerceauth.user.entity.ShopMemberRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Mağaza üzvünün rolunu yeniləmək üçün sorğu payload-u.")
public class UpdateShopMemberRoleRequest {

    @NotNull(message = "Membership role is required")
    private ShopMemberRole membershipRole;
}
