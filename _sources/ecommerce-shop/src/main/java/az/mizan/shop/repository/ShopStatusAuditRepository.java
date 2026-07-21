package az.mizan.shop.repository;

import az.mizan.shop.domain.ShopStatusAudit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopStatusAuditRepository extends JpaRepository<ShopStatusAudit, Long> {
}
