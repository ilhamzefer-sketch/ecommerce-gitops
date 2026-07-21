package az.mizan.shop.service;

import az.mizan.shop.domain.Shop;
import az.mizan.shop.domain.ShopDecision;
import az.mizan.shop.domain.ShopStatus;
import az.mizan.shop.dto.AdminDecisionDto;
import az.mizan.shop.repository.ShopRepository;
import az.mizan.shop.repository.ShopStatusAuditRepository;
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
class ShopAdminServiceTest {

    @Mock
    private ShopRepository shopRepository;
    @Mock
    private ShopStatusAuditRepository auditRepository;
    private ShopAdminService service;
    private Shop shop;

    @BeforeEach
    void setUp() {
        service = new ShopAdminService(shopRepository, auditRepository, new ShopMapper());
        shop = new Shop();
        shop.setId(5L);
        shop.setStatus(ShopStatus.PENDING_REVIEW);
        when(shopRepository.findById(5L)).thenReturn(Optional.of(shop));
    }

    @Test
    void approveActivatesPendingShopAndWritesAudit() {
        service.decide(99L, 5L, new AdminDecisionDto(ShopDecision.APPROVE, null));

        assertEquals(ShopStatus.ACTIVE, shop.getStatus());
        verify(auditRepository).save(any());
    }

    @Test
    void rejectRequiresReason() {
        assertThrows(
                IllegalArgumentException.class,
                () -> service.decide(99L, 5L, new AdminDecisionDto(ShopDecision.REJECT, " "))
        );
    }
}
