package az.mizan.product.dto;

import az.mizan.product.domain.ContactChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InquiryCreateDto(
        @NotNull Long productId,
        @NotBlank @Size(min = 10, max = 1200) String message,
        @NotNull ContactChannel preferredContact
) {
}
