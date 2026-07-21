package az.mizan.product.service;

import az.mizan.product.dto.PublicShopDto;
import az.mizan.product.dto.ShopAuthorizationDto;
import az.mizan.product.exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ShopAccessClient {

    private final RestClient restClient;

    public ShopAccessClient(RestClient.Builder builder, @Value("${application.services.shop-url}") String shopUrl) {
        this.restClient = builder.baseUrl(shopUrl).build();
    }

    public void require(Long shopId, String permission, String bearerToken) {
        ShopAuthorizationDto authorization = restClient.get()
                .uri("/api/shops/{shopId}/authorization?permission={permission}", shopId, permission)
                .header(HttpHeaders.AUTHORIZATION, bearerToken)
                .retrieve()
                .body(ShopAuthorizationDto.class);
        if (authorization == null || !authorization.allowed()) {
            throw new ForbiddenException("Aktiv mağaza və uyğun səlahiyyət tələb olunur.");
        }
    }

    public boolean isActive(Long shopId) {
        try {
            PublicShopDto shop = restClient.get()
                    .uri("/api/shops/{shopId}/public", shopId)
                    .retrieve()
                    .body(PublicShopDto.class);
            return shop != null && shop.active();
        } catch (RuntimeException exception) {
            return false;
        }
    }
}
