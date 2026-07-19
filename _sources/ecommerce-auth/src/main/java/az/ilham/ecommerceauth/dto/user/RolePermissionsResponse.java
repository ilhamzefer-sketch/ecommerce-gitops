package az.ilham.ecommerceauth.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Bir sistem rolunun və ona bağlı icazələrin admin görünüşü.")
public class RolePermissionsResponse {

    private String roleName;
    private Set<String> permissions;
}
