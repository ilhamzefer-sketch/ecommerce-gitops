package az.mizan.product.dto;

public record ShopAuthorizationDto(Long shopId, boolean active, boolean allowed, String role) {
}
