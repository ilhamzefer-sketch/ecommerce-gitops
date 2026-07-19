package az.ilham.ecommerceauth.security;

import az.ilham.ecommerceauth.user.entity.User;
import az.ilham.ecommerceauth.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = loadDomainUserByUsername(usernameOrEmail);

        List<SimpleGrantedAuthority> authorities = Stream.concat(
                        user.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority(role.getName())),
                        user.getRoles().stream()
                                .flatMap(role -> role.getPermissions().stream())
                                .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                )
                .collect(Collectors.toList());

        return new SecurityUserPrincipal(
                user.getUsername(),
                user.getPasswordHash(),
                user.isEnabled(),
                user.isAccountNonLocked(),
                authorities,
                user.getAuthorizationVersion()
        );
    }

    @Transactional(readOnly = true)
    public User loadDomainUserByUsername(String usernameOrEmail) {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));
    }
}
