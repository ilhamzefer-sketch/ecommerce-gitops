package az.ilham.ecommerceauth.dto.user;

import az.ilham.ecommerceauth.user.entity.ShopInviteStatus;
import az.ilham.ecommerceauth.user.entity.ShopMemberRole;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Frontend-də dəvət idarəsi üçün mağaza dəvəti məlumatları.")
public class ShopInviteResponse {

    private Long id;
    private Long shopId;
    private String shopName;
    private String invitedEmail;
    private ShopMemberRole membershipRole;
    private ShopInviteStatus status;
    private String token;
    private Set<String> allowedActions;
    private LocalDateTime expiresAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime createdAt;
}
