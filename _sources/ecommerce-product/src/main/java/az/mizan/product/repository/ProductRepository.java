package az.mizan.product.repository;

import az.mizan.product.domain.Product;
import az.mizan.product.domain.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlugAndStatus(String slug, ProductStatus status);
    List<Product> findAllByStatusOrderByCreatedAtDesc(ProductStatus status);
    List<Product> findAllByShopIdOrderByUpdatedAtDesc(Long shopId);
    boolean existsBySlug(String slug);
}
