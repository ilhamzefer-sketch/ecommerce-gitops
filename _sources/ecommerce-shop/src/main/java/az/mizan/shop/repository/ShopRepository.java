package az.mizan.shop.repository;

import az.mizan.shop.domain.Shop;
import az.mizan.shop.domain.ShopStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByOwnerUserId(Long ownerUserId);
    boolean existsByOwnerUserId(Long ownerUserId);
    boolean existsBySlugIgnoreCase(String slug);
    List<Shop> findAllByStatusOrderBySubmittedAtAsc(ShopStatus status);
}
