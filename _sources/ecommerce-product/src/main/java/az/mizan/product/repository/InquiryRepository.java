package az.mizan.product.repository;

import az.mizan.product.domain.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findAllByBuyerUserIdOrderByCreatedAtDesc(Long buyerUserId);
    List<Inquiry> findAllByShopIdOrderByCreatedAtDesc(Long shopId);
}
