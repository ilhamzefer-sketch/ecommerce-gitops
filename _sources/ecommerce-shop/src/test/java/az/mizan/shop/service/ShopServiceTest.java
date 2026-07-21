package az.mizan.shop.service;

import az.mizan.shop.domain.Shop;
import az.mizan.shop.domain.ShopStatus;
import az.mizan.shop.domain.ShopType;
import az.mizan.shop.dto.ShopApplicationDto;
import az.mizan.shop.dto.ShopDto;
import az.mizan.shop.exception.ConflictException;
import az.mizan.shop.repository.ShopMemberRepository;
import az.mizan.shop.repository.ShopRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShopServiceTest {

    @Mock
    private ShopRepository shopRepository;
    @Mock
    private ShopMemberRepository shopMemberRepository;

    private ShopService shopService;

    @BeforeEach
    void setUp() {
        ShopMapper mapper = new ShopMapper();
        shopService = new ShopService(shopRepository, shopMemberRepository, mapper, new SlugService(shopRepository));
    }

    @Test
    void createKeepsShopInDraftUntilSubmission() {
        when(shopRepository.save(any(Shop.class))).thenAnswer(invocation -> {
            Shop shop = invocation.getArgument(0);
            shop.setId(41L);
            return shop;
        });
        ShopDto result = shopService.create(7L, application());

        assertEquals(ShopStatus.DRAFT, result.status());
        verify(shopMemberRepository).save(any());
    }

    @Test
    void createRejectsSecondOwnedShop() {
        when(shopRepository.existsByOwnerUserId(7L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> shopService.create(7L, application()));
    }

    @Test
    void submitMovesOwnedDraftToPendingReview() {
        Shop shop = new Shop();
        shop.setId(41L);
        shop.setOwnerUserId(7L);
        shop.setStatus(ShopStatus.DRAFT);
        when(shopRepository.findById(41L)).thenReturn(Optional.of(shop));
        when(shopRepository.save(shop)).thenReturn(shop);

        ShopDto result = shopService.submit(7L, 41L);

        assertEquals(ShopStatus.PENDING_REVIEW, result.status());
    }

    private ShopApplicationDto application() {
        return new ShopApplicationDto(
                "Mizan Studio", ShopType.INDIVIDUAL,
                "Əl işi və gündəlik istifadə üçün seçilmiş keyfiyyətli məhsullar təqdim edirik.",
                "+994501112233", "shop@example.com", "Nizami küçəsi 10", "Bakı",
                "Ev və yaşam", null, null, true
        );
    }
}
