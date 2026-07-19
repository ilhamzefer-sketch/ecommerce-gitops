package az.ilham.ecommerceauth.security.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthorizationAuditService {

    private final AuthorizationAuditLogRepository authorizationAuditLogRepository;

    @Transactional
    public void log(String actionType, String targetType, String targetIdentifier, String details) {
        authorizationAuditLogRepository.save(AuthorizationAuditLog.builder()
                .actionType(actionType)
                .actorUsername(resolveActorUsername())
                .targetType(targetType)
                .targetIdentifier(targetIdentifier)
                .details(details)
                .build());
    }

    private String resolveActorUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return "system";
        }
        return authentication.getName();
    }
}
