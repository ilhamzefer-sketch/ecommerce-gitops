package az.mizan.shop.repository;

import az.mizan.shop.domain.ShopMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShopMemberRepository extends JpaRepository<ShopMember, Long> {
    Optional<ShopMember> findByShopIdAndUserIdAndActiveTrue(Long shopId, Long userId);
}
