package az.ilham.ecommerceauth.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class SecurityUserPrincipal extends User {

    private final long authorizationVersion;

    public SecurityUserPrincipal(
            String username,
            String password,
            boolean enabled,
            boolean accountNonLocked,
            Collection<? extends GrantedAuthority> authorities,
            long authorizationVersion
    ) {
        super(username, password, enabled, true, true, accountNonLocked, authorities);
        this.authorizationVersion = authorizationVersion;
    }

    public long authorizationVersion() {
        return authorizationVersion;
    }
}
