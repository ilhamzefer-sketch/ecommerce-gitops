package az.mizan.shop.dto;

public record PublicShopDto(
        Long id,
        String name,
        String slug,
        boolean active,
        String city,
        String category
) {
}
