package az.mizan.shop.dto;

import az.mizan.shop.domain.ShopStatus;
import az.mizan.shop.domain.ShopType;

import java.time.LocalDateTime;

public record ShopDto(
        Long id,
        String name,
        String slug,
        ShopType type,
        String description,
        String contactPhone,
        String contactEmail,
        String address,
        String city,
        String category,
        String companyName,
        String taxId,
        ShopStatus status,
        String rejectionReason,
        LocalDateTime submittedAt,
        LocalDateTime reviewedAt
) {
}
