package az.mizan.shop.service;

import az.mizan.shop.domain.Shop;
import az.mizan.shop.domain.ShopMember;
import az.mizan.shop.domain.ShopMemberRole;
import az.mizan.shop.domain.ShopStatus;
import az.mizan.shop.domain.ShopType;
import az.mizan.shop.dto.PublicShopDto;
import az.mizan.shop.dto.SellerContextDto;
import az.mizan.shop.dto.ShopApplicationDto;
import az.mizan.shop.dto.ShopAuthorizationDto;
import az.mizan.shop.dto.ShopDto;
import az.mizan.shop.exception.ConflictException;
import az.mizan.shop.exception.ForbiddenException;
import az.mizan.shop.exception.NotFoundException;
import az.mizan.shop.repository.ShopMemberRepository;
import az.mizan.shop.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final ShopMemberRepository shopMemberRepository;
    private final ShopMapper shopMapper;
    private final SlugService slugService;

    @Transactional
    public ShopDto create(Long userId, ShopApplicationDto application) {
        if (shopRepository.existsByOwnerUserId(userId)) {
            throw new ConflictException("Bir istifadəçi yalnız bir mağazanın sahibi ola bilər.");
        }
        validateBusinessFields(application);
        LocalDateTime now = LocalDateTime.now();
        Shop shop = new Shop();
        shop.setOwnerUserId(userId);
        shop.setSlug(slugService.uniqueSlug(application.name()));
        shop.setStatus(ShopStatus.DRAFT);
        shop.setCreatedAt(now);
        apply(shop, application, now);
        Shop saved = shopRepository.save(shop);

        ShopMember owner = new ShopMember();
        owner.setShopId(saved.getId());
        owner.setUserId(userId);
        owner.setMemberRole(ShopMemberRole.OWNER);
        owner.setActive(true);
        owner.setCreatedAt(now);
        shopMemberRepository.save(owner);
        return shopMapper.toDto(saved);
    }

    @Transactional
    public ShopDto update(Long userId, Long shopId, ShopApplicationDto application) {
        Shop shop = ownedShop(userId, shopId);
        if (shop.getStatus() != ShopStatus.DRAFT && shop.getStatus() != ShopStatus.REJECTED) {
            throw new IllegalStateException("Bu statusda müraciət dəyişdirilə bilməz.");
        }
        validateBusinessFields(application);
        apply(shop, application, LocalDateTime.now());
        if (shop.getStatus() == ShopStatus.REJECTED) {
            shop.setStatus(ShopStatus.DRAFT);
            shop.setRejectionReason(null);
        }
        return shopMapper.toDto(shopRepository.save(shop));
    }

    @Transactional
    public ShopDto submit(Long userId, Long shopId) {
        Shop shop = ownedShop(userId, shopId);
        if (shop.getStatus() != ShopStatus.DRAFT) {
            throw new IllegalStateException("Yalnız draft müraciət baxışa göndərilə bilər.");
        }
        shop.setStatus(ShopStatus.PENDING_REVIEW);
        shop.setSubmittedAt(LocalDateTime.now());
        shop.setUpdatedAt(LocalDateTime.now());
        return shopMapper.toDto(shopRepository.save(shop));
    }

    @Transactional(readOnly = true)
    public SellerContextDto sellerContext(Long userId) {
        return shopRepository.findByOwnerUserId(userId)
                .map(this::context)
                .orElse(new SellerContextDto(false, null, null, null, "CREATE_SHOP", null));
    }

    @Transactional(readOnly = true)
    public ShopDto getOwned(Long userId, Long shopId) {
        return shopMapper.toDto(ownedShop(userId, shopId));
    }

    @Transactional(readOnly = true)
    public PublicShopDto publicShop(Long shopId) {
        return shopMapper.toPublicDto(findShop(shopId));
    }

    @Transactional(readOnly = true)
    public ShopAuthorizationDto authorize(Long userId, Long shopId, String permission) {
        Shop shop = findShop(shopId);
        ShopMember member = shopMemberRepository.findByShopIdAndUserIdAndActiveTrue(shopId, userId)
                .orElseThrow(() -> new ForbiddenException("Mağaza üzvlüyü yoxdur."));
        boolean roleAllowed = switch (permission) {
            case "MANAGE_PRODUCTS" -> member.getMemberRole() == ShopMemberRole.OWNER
                    || member.getMemberRole() == ShopMemberRole.MANAGER
                    || member.getMemberRole() == ShopMemberRole.LISTING_MANAGER;
            case "VIEW_INQUIRIES" -> member.getMemberRole() != ShopMemberRole.LISTING_MANAGER;
            default -> false;
        };
        boolean active = shop.getStatus() == ShopStatus.ACTIVE;
        return new ShopAuthorizationDto(shopId, active, active && roleAllowed, member.getMemberRole().name());
    }

    private Shop ownedShop(Long userId, Long shopId) {
        Shop shop = findShop(shopId);
        if (!shop.getOwnerUserId().equals(userId)) {
            throw new ForbiddenException("Bu mağaza sizə məxsus deyil.");
        }
        return shop;
    }

    private Shop findShop(Long shopId) {
        return shopRepository.findById(shopId)
                .orElseThrow(() -> new NotFoundException("Mağaza tapılmadı."));
    }

    private void apply(Shop shop, ShopApplicationDto application, LocalDateTime now) {
        shop.setName(application.name().trim());
        shop.setType(application.type());
        shop.setDescription(application.description().trim());
        shop.setContactPhone(application.contactPhone().trim());
        shop.setContactEmail(application.contactEmail().trim().toLowerCase());
        shop.setAddress(application.address().trim());
        shop.setCity(application.city().trim());
        shop.setCategory(application.category().trim());
        shop.setCompanyName(blankToNull(application.companyName()));
        shop.setTaxId(blankToNull(application.taxId()));
        shop.setTermsAcceptedAt(now);
        shop.setUpdatedAt(now);
    }

    private void validateBusinessFields(ShopApplicationDto application) {
        if (application.type() == ShopType.BUSINESS
                && (blankToNull(application.companyName()) == null || blankToNull(application.taxId()) == null)) {
            throw new IllegalArgumentException("Biznes mağazası üçün şirkət adı və VÖEN tələb olunur.");
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private SellerContextDto context(Shop shop) {
        String action = switch (shop.getStatus()) {
            case DRAFT -> "COMPLETE_APPLICATION";
            case PENDING_REVIEW -> "VIEW_REVIEW_STATUS";
            case ACTIVE -> "OPEN_SELLER_DASHBOARD";
            case REJECTED -> "FIX_APPLICATION";
            case SUSPENDED, CLOSED -> "VIEW_STATUS";
        };
        return new SellerContextDto(
                true,
                shop.getId(),
                shop.getName(),
                shop.getStatus(),
                action,
                shop.getRejectionReason()
        );
    }
}
