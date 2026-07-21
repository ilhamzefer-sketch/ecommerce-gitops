package az.mizan.shop.dto;

import az.mizan.shop.domain.ShopDecision;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminDecisionDto(
        @NotNull ShopDecision decision,
        @Size(max = 1000) String reason
) {
}
