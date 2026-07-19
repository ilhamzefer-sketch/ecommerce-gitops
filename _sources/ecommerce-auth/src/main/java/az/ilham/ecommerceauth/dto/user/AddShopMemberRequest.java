package az.ilham.ecommerceauth.dto.user;

import az.ilham.ecommerceauth.user.entity.ShopMemberRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "İstifadəçini mağazaya əlavə etmək üçün sorğu payload-u.")
public class AddShopMemberRequest {

    @NotBlank(message = "Member identifier is required")
    @Schema(description = "Əlavə olunacaq istifadəçinin username-i və ya e-poçtu.", example = "demo-user")
    private String memberIdentifier;

    @NotNull(message = "Membership role is required")
    private ShopMemberRole membershipRole;
}
