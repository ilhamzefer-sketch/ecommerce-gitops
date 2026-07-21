package az.mizan.product.service;

import az.mizan.product.domain.Inquiry;
import az.mizan.product.domain.InquiryStatus;
import az.mizan.product.domain.Product;
import az.mizan.product.domain.ProductStatus;
import az.mizan.product.dto.InquiryCreateDto;
import az.mizan.product.dto.InquiryDto;
import az.mizan.product.exception.NotFoundException;
import az.mizan.product.repository.InquiryRepository;
import az.mizan.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ShopAccessClient shopAccessClient;

    public InquiryDto create(Long buyerUserId, InquiryCreateDto request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("Məhsul tapılmadı."));
        if (product.getStatus() != ProductStatus.PUBLISHED || !shopAccessClient.isActive(product.getShopId())) {
            throw new NotFoundException("Məhsul hazırda əlçatan deyil.");
        }
        LocalDateTime now = LocalDateTime.now();
        Inquiry inquiry = new Inquiry();
        inquiry.setProductId(product.getId());
        inquiry.setShopId(product.getShopId());
        inquiry.setBuyerUserId(buyerUserId);
        inquiry.setMessage(request.message().trim());
        inquiry.setPreferredContact(request.preferredContact());
        inquiry.setStatus(InquiryStatus.OPEN);
        inquiry.setCreatedAt(now);
        inquiry.setUpdatedAt(now);
        return productMapper.toDto(inquiryRepository.save(inquiry));
    }

    public List<InquiryDto> buyerInquiries(Long buyerUserId) {
        return inquiryRepository.findAllByBuyerUserIdOrderByCreatedAtDesc(buyerUserId).stream()
                .map(productMapper::toDto).toList();
    }

    public List<InquiryDto> shopInquiries(Long shopId, String bearerToken) {
        shopAccessClient.require(shopId, "VIEW_INQUIRIES", bearerToken);
        return inquiryRepository.findAllByShopIdOrderByCreatedAtDesc(shopId).stream()
                .map(productMapper::toDto).toList();
    }

    public InquiryDto changeStatus(Long inquiryId, InquiryStatus status, String bearerToken) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new NotFoundException("Sorğu tapılmadı."));
        shopAccessClient.require(inquiry.getShopId(), "VIEW_INQUIRIES", bearerToken);
        inquiry.setStatus(status);
        inquiry.setUpdatedAt(LocalDateTime.now());
        return productMapper.toDto(inquiryRepository.save(inquiry));
    }
}
