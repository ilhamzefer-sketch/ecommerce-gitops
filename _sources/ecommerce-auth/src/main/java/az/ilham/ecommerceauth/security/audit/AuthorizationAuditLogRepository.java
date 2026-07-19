package az.ilham.ecommerceauth.security.audit;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorizationAuditLogRepository extends JpaRepository<AuthorizationAuditLog, Long> {
}
