package az.ilham.ecommerceauth.dto.user;

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
@Schema(description = "Mağaza sahibliyini başqa aktiv üzvə ötürmək üçün sorğu payload-u.")
public class TransferShopOwnershipRequest {

    @NotNull(message = "New owner user id is required")
    private Long newOwnerUserId;
}
