package az.mizan.shop.controller;

import az.mizan.shop.domain.ShopStatus;
import az.mizan.shop.dto.AdminDecisionDto;
import az.mizan.shop.dto.ShopDto;
import az.mizan.shop.security.ShopPrincipal;
import az.mizan.shop.service.ShopAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/shops")
@RequiredArgsConstructor
public class ShopAdminController {

    private final ShopAdminService shopAdminService;

    @GetMapping
    List<ShopDto> list(@RequestParam(required = false) ShopStatus status) {
        return shopAdminService.list(status);
    }

    @PostMapping("/{shopId}/decision")
    ShopDto decide(
            @AuthenticationPrincipal ShopPrincipal principal,
            @PathVariable Long shopId,
            @Valid @RequestBody AdminDecisionDto decision
    ) {
        return shopAdminService.decide(principal.userId(), shopId, decision);
    }
}
