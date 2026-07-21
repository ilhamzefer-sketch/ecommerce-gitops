package az.mizan.shop.security;

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

    public ShopPrincipal parse(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        Long userId = Long.valueOf(claims.getSubject());
        String username = claims.get("username", String.class);
        List<?> roles = claims.get("roles", List.class);
        List<SimpleGrantedAuthority> authorities = roles == null
                ? List.of()
                : roles.stream().map(String::valueOf).map(SimpleGrantedAuthority::new).toList();
        return new ShopPrincipal(userId, username, authorities);
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
}
