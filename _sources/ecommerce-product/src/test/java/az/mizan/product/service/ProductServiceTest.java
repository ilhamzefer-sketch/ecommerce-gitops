package az.mizan.product.service;

import az.mizan.product.domain.Product;
import az.mizan.product.domain.ProductStatus;
import az.mizan.product.dto.ProductDto;
import az.mizan.product.dto.ProductUpsertDto;
import az.mizan.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private ShopAccessClient shopAccessClient;
    private ProductService service;

    @BeforeEach
    void setUp() {
        service = new ProductService(
                productRepository,
                new ProductMapper(),
                new ProductSlugService(productRepository),
                shopAccessClient
        );
    }

    @Test
    void createStartsAsDraftAndChecksShopPermission() {
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(8L);
            return product;
        });

        ProductDto result = service.create(request(), "Bearer token");

        assertEquals(ProductStatus.DRAFT, result.status());
        verify(shopAccessClient).require(12L, "MANAGE_PRODUCTS", "Bearer token");
    }

    @Test
    void catalogHidesProductsFromInactiveShops() {
        Product active = product(1L, 12L);
        Product suspended = product(2L, 13L);
        when(productRepository.findAllByStatusOrderByCreatedAtDesc(ProductStatus.PUBLISHED))
                .thenReturn(List.of(active, suspended));
        when(shopAccessClient.isActive(12L)).thenReturn(true);
        when(shopAccessClient.isActive(13L)).thenReturn(false);

        List<ProductDto> result = service.catalog();

        assertEquals(List.of(1L), result.stream().map(ProductDto::id).toList());
    }

    private ProductUpsertDto request() {
        return new ProductUpsertDto(
                12L, "Taxta masa lampası", "Təbii materialdan hazırlanmış əl işi masa lampasıdır.",
                "Ev və yaşam", new BigDecimal("79.00"), "AZN", "Yeni", "Mövcuddur",
                "https://example.com/lamp.jpg", "Bakı daxilində razılaşma ilə"
        );
    }

    private Product product(Long id, Long shopId) {
        Product product = new Product();
        product.setId(id);
        product.setShopId(shopId);
        product.setName("Məhsul");
        product.setSlug("mehsul-" + id);
        product.setDescription("Təsvir");
        product.setCategory("Kateqoriya");
        product.setPrice(BigDecimal.ONE);
        product.setCurrency("AZN");
        product.setConditionLabel("Yeni");
        product.setImageUrl("https://example.com/product.jpg");
        product.setStatus(ProductStatus.PUBLISHED);
        return product;
    }
}
