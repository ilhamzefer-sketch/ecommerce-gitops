package az.mizan.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductUpsertDto(
        @NotNull Long shopId,
        @NotBlank @Size(max = 160) String name,
        @NotBlank @Size(min = 30, max = 3000) String description,
        @NotBlank @Size(max = 80) String category,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @NotBlank @Pattern(regexp = "^[A-Z]{3}$") String currency,
        @NotBlank @Size(max = 40) String conditionLabel,
        @Size(max = 120) String stockNote,
        @NotBlank @Size(max = 500) String imageUrl,
        @Size(max = 240) String deliveryNote
) {
}
