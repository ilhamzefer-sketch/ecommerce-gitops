package az.mizan.product.dto;

import az.mizan.product.domain.InquiryStatus;
import jakarta.validation.constraints.NotNull;

public record InquiryStatusDto(@NotNull InquiryStatus status) {
}
