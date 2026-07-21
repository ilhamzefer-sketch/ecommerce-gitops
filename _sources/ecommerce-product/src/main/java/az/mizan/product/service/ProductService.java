package az.mizan.product.service;

import az.mizan.product.domain.Product;
import az.mizan.product.domain.ProductStatus;
import az.mizan.product.dto.ProductDto;
import az.mizan.product.dto.ProductUpsertDto;
import az.mizan.product.exception.ForbiddenException;
import az.mizan.product.exception.NotFoundException;
import az.mizan.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductSlugService slugService;
    private final ShopAccessClient shopAccessClient;

    public List<ProductDto> catalog() {
        return productRepository.findAllByStatusOrderByCreatedAtDesc(ProductStatus.PUBLISHED).stream()
                .filter(product -> shopAccessClient.isActive(product.getShopId()))
                .map(productMapper::toDto)
                .toList();
    }

    public ProductDto publicProduct(String slug) {
        Product product = productRepository.findBySlugAndStatus(slug, ProductStatus.PUBLISHED)
                .orElseThrow(() -> new NotFoundException("Məhsul tapılmadı."));
        if (!shopAccessClient.isActive(product.getShopId())) {
            throw new NotFoundException("Məhsul hazırda əlçatan deyil.");
        }
        return productMapper.toDto(product);
    }

    public ProductDto productById(Long productId) {
        return productMapper.toDto(find(productId));
    }

    public List<ProductDto> shopProducts(Long shopId, String bearerToken) {
        shopAccessClient.require(shopId, "MANAGE_PRODUCTS", bearerToken);
        return productRepository.findAllByShopIdOrderByUpdatedAtDesc(shopId).stream()
                .map(productMapper::toDto).toList();
    }

    public ProductDto create(ProductUpsertDto request, String bearerToken) {
        shopAccessClient.require(request.shopId(), "MANAGE_PRODUCTS", bearerToken);
        LocalDateTime now = LocalDateTime.now();
        Product product = new Product();
        product.setShopId(request.shopId());
        product.setSlug(slugService.unique(request.name()));
        product.setStatus(ProductStatus.DRAFT);
        product.setCreatedAt(now);
        apply(product, request, now);
        return productMapper.toDto(productRepository.save(product));
    }

    public ProductDto update(Long productId, ProductUpsertDto request, String bearerToken) {
        Product product = find(productId);
        if (!product.getShopId().equals(request.shopId())) {
            throw new ForbiddenException("Məhsul başqa mağazaya köçürülə bilməz.");
        }
        shopAccessClient.require(product.getShopId(), "MANAGE_PRODUCTS", bearerToken);
        if (product.getStatus() == ProductStatus.ARCHIVED) {
            throw new IllegalStateException("Arxivlənmiş məhsul dəyişdirilə bilməz.");
        }
        apply(product, request, LocalDateTime.now());
        return productMapper.toDto(productRepository.save(product));
    }

    public ProductDto publish(Long productId, String bearerToken) {
        Product product = find(productId);
        shopAccessClient.require(product.getShopId(), "MANAGE_PRODUCTS", bearerToken);
        if (product.getStatus() == ProductStatus.ARCHIVED) {
            throw new IllegalStateException("Arxivlənmiş məhsul yayımlana bilməz.");
        }
        product.setStatus(ProductStatus.PUBLISHED);
        product.setUpdatedAt(LocalDateTime.now());
        return productMapper.toDto(productRepository.save(product));
    }

    public ProductDto archive(Long productId, String bearerToken) {
        Product product = find(productId);
        shopAccessClient.require(product.getShopId(), "MANAGE_PRODUCTS", bearerToken);
        product.setStatus(ProductStatus.ARCHIVED);
        product.setUpdatedAt(LocalDateTime.now());
        return productMapper.toDto(productRepository.save(product));
    }

    private Product find(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Məhsul tapılmadı."));
    }

    private void apply(Product product, ProductUpsertDto request, LocalDateTime now) {
        product.setName(request.name().trim());
        product.setDescription(request.description().trim());
        product.setCategory(request.category().trim());
        product.setPrice(request.price());
        product.setCurrency(request.currency());
        product.setConditionLabel(request.conditionLabel().trim());
        product.setStockNote(blankToNull(request.stockNote()));
        product.setImageUrl(request.imageUrl().trim());
        product.setDeliveryNote(blankToNull(request.deliveryNote()));
        product.setUpdatedAt(now);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
