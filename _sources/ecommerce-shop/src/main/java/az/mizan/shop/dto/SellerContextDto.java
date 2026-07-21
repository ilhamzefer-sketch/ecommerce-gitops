package az.mizan.shop.dto;

import az.mizan.shop.domain.ShopStatus;

public record SellerContextDto(
        boolean hasShop,
        Long shopId,
        String shopName,
        ShopStatus status,
        String action,
        String reason
) {
}
