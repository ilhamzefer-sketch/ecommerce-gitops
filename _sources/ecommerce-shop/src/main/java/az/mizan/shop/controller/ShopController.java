package az.mizan.shop.controller;

import az.mizan.shop.dto.PublicShopDto;
import az.mizan.shop.dto.SellerContextDto;
import az.mizan.shop.dto.ShopApplicationDto;
import az.mizan.shop.dto.ShopAuthorizationDto;
import az.mizan.shop.dto.ShopDto;
import az.mizan.shop.security.ShopPrincipal;
import az.mizan.shop.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/me/context")
    SellerContextDto context(@AuthenticationPrincipal ShopPrincipal principal) {
        return shopService.sellerContext(principal.userId());
    }

    @PostMapping
    ResponseEntity<ShopDto> create(
            @AuthenticationPrincipal ShopPrincipal principal,
            @Valid @RequestBody ShopApplicationDto application
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shopService.create(principal.userId(), application));
    }

    @PutMapping("/{shopId}/application")
    ShopDto update(
            @AuthenticationPrincipal ShopPrincipal principal,
            @PathVariable Long shopId,
            @Valid @RequestBody ShopApplicationDto application
    ) {
        return shopService.update(principal.userId(), shopId, application);
    }

    @PostMapping("/{shopId}/submit")
    ShopDto submit(@AuthenticationPrincipal ShopPrincipal principal, @PathVariable Long shopId) {
        return shopService.submit(principal.userId(), shopId);
    }

    @GetMapping("/{shopId}")
    ShopDto getOwned(@AuthenticationPrincipal ShopPrincipal principal, @PathVariable Long shopId) {
        return shopService.getOwned(principal.userId(), shopId);
    }

    @GetMapping("/{shopId}/authorization")
    ShopAuthorizationDto authorize(
            @AuthenticationPrincipal ShopPrincipal principal,
            @PathVariable Long shopId,
            @RequestParam String permission
    ) {
        return shopService.authorize(principal.userId(), shopId, permission);
    }

    @GetMapping("/{shopId}/public")
    PublicShopDto publicShop(@PathVariable Long shopId) {
        return shopService.publicShop(shopId);
    }
}
