package az.mizan.shop.service;

import az.mizan.shop.domain.Shop;
import az.mizan.shop.domain.ShopDecision;
import az.mizan.shop.domain.ShopStatus;
import az.mizan.shop.domain.ShopStatusAudit;
import az.mizan.shop.dto.AdminDecisionDto;
import az.mizan.shop.dto.ShopDto;
import az.mizan.shop.exception.NotFoundException;
import az.mizan.shop.repository.ShopRepository;
import az.mizan.shop.repository.ShopStatusAuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopAdminService {

    private final ShopRepository shopRepository;
    private final ShopStatusAuditRepository auditRepository;
    private final ShopMapper shopMapper;

    @Transactional(readOnly = true)
    public List<ShopDto> list(ShopStatus status) {
        List<Shop> shops = status == null
                ? shopRepository.findAll()
                : shopRepository.findAllByStatusOrderBySubmittedAtAsc(status);
        return shops.stream().map(shopMapper::toDto).toList();
    }

    @Transactional
    public ShopDto decide(Long adminUserId, Long shopId, AdminDecisionDto request) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new NotFoundException("Mağaza tapılmadı."));
        ShopStatus oldStatus = shop.getStatus();
        ShopStatus newStatus = transition(oldStatus, request.decision());
        requireReason(request);

        LocalDateTime now = LocalDateTime.now();
        shop.setStatus(newStatus);
        shop.setReviewedAt(now);
        shop.setUpdatedAt(now);
        shop.setRejectionReason(newStatus == ShopStatus.REJECTED || newStatus == ShopStatus.SUSPENDED
                ? request.reason().trim()
                : null);
        shopRepository.save(shop);

        ShopStatusAudit audit = new ShopStatusAudit();
        audit.setShopId(shopId);
        audit.setAdminUserId(adminUserId);
        audit.setOldStatus(oldStatus);
        audit.setNewStatus(newStatus);
        audit.setReason(blankToNull(request.reason()));
        audit.setCreatedAt(now);
        auditRepository.save(audit);
        return shopMapper.toDto(shop);
    }

    private ShopStatus transition(ShopStatus current, ShopDecision decision) {
        return switch (decision) {
            case APPROVE -> current == ShopStatus.PENDING_REVIEW
                    ? ShopStatus.ACTIVE : invalid(current, decision);
            case REJECT -> current == ShopStatus.PENDING_REVIEW
                    ? ShopStatus.REJECTED : invalid(current, decision);
            case SUSPEND -> current == ShopStatus.ACTIVE
                    ? ShopStatus.SUSPENDED : invalid(current, decision);
            case REACTIVATE -> current == ShopStatus.SUSPENDED
                    ? ShopStatus.ACTIVE : invalid(current, decision);
            case CLOSE -> current == ShopStatus.ACTIVE
                    ? ShopStatus.CLOSED : invalid(current, decision);
        };
    }

    private ShopStatus invalid(ShopStatus current, ShopDecision decision) {
        throw new IllegalStateException(current + " statusunda " + decision + " qərarı mümkün deyil.");
    }

    private void requireReason(AdminDecisionDto request) {
        if ((request.decision() == ShopDecision.REJECT || request.decision() == ShopDecision.SUSPEND)
                && blankToNull(request.reason()) == null) {
            throw new IllegalArgumentException("Bu qərar üçün səbəb məcburidir.");
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
