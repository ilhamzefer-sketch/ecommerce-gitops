package az.mizan.product.dto;

import az.mizan.product.domain.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductDto(
        Long id,
        Long shopId,
        String name,
        String slug,
        String description,
        String category,
        BigDecimal price,
        String currency,
        String conditionLabel,
        String stockNote,
        String imageUrl,
        String deliveryNote,
        ProductStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
