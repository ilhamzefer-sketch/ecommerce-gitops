package az.mizan.product.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.List;

@Service
public class JwtTokenService {

    @Value("${application.security.jwt-secret}")
    private String secretKey;

    public ProductPrincipal parse(String token) {
        Claims claims = Jwts.parser().verifyWith(signingKey()).build()
                .parseSignedClaims(token).getPayload();
        List<?> roles = claims.get("roles", List.class);
        List<SimpleGrantedAuthority> authorities = roles == null
                ? List.of()
                : roles.stream().map(String::valueOf).map(SimpleGrantedAuthority::new).toList();
        return new ProductPrincipal(
                Long.valueOf(claims.getSubject()),
                claims.get("username", String.class),
                authorities
        );
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
}
