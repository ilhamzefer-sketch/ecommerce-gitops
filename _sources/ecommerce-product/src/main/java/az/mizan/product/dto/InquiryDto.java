package az.mizan.product.dto;

import az.mizan.product.domain.ContactChannel;
import az.mizan.product.domain.InquiryStatus;

import java.time.LocalDateTime;

public record InquiryDto(
        Long id,
        Long productId,
        Long shopId,
        Long buyerUserId,
        String message,
        ContactChannel preferredContact,
        InquiryStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
