package az.mizan.shop.service;

import az.mizan.shop.domain.Shop;
import az.mizan.shop.dto.PublicShopDto;
import az.mizan.shop.dto.ShopDto;
import org.springframework.stereotype.Component;

@Component
public class ShopMapper {

    public ShopDto toDto(Shop shop) {
        return new ShopDto(
                shop.getId(),
                shop.getName(),
                shop.getSlug(),
                shop.getType(),
                shop.getDescription(),
                shop.getContactPhone(),
                shop.getContactEmail(),
                shop.getAddress(),
                shop.getCity(),
                shop.getCategory(),
                shop.getCompanyName(),
                shop.getTaxId(),
                shop.getStatus(),
                shop.getRejectionReason(),
                shop.getSubmittedAt(),
                shop.getReviewedAt()
        );
    }

    public PublicShopDto toPublicDto(Shop shop) {
        return new PublicShopDto(
                shop.getId(),
                shop.getName(),
                shop.getSlug(),
                shop.getStatus() == az.mizan.shop.domain.ShopStatus.ACTIVE,
                shop.getCity(),
                shop.getCategory()
        );
    }
}
