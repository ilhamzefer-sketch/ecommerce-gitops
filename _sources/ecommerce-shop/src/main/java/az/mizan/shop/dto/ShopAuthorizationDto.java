package az.mizan.shop.dto;

public record ShopAuthorizationDto(
        Long shopId,
        boolean active,
        boolean allowed,
        String role
) {
}
