package az.mizan.shop.dto;

import az.mizan.shop.domain.ShopType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ShopApplicationDto(
        @NotBlank @Size(max = 120) String name,
        @NotNull ShopType type,
        @NotBlank @Size(min = 40, max = 1200) String description,
        @NotBlank @Size(max = 20) String contactPhone,
        @NotBlank @Email @Size(max = 120) String contactEmail,
        @NotBlank @Size(max = 240) String address,
        @NotBlank @Size(max = 80) String city,
        @NotBlank @Size(max = 80) String category,
        @Size(max = 160) String companyName,
        @Size(max = 40) String taxId,
        @AssertTrue boolean termsAccepted
) {
}
