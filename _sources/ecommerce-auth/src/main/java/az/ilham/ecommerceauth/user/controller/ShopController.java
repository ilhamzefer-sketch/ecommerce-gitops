package az.ilham.ecommerceauth.user.controller;

import az.ilham.ecommerceauth.dto.user.AddShopMemberRequest;
import az.ilham.ecommerceauth.dto.user.AcceptShopInviteRequest;
import az.ilham.ecommerceauth.dto.user.CreateShopRequest;
import az.ilham.ecommerceauth.dto.user.CreateShopInviteRequest;
import az.ilham.ecommerceauth.dto.user.ShopMemberResponse;
import az.ilham.ecommerceauth.dto.user.ShopInviteResponse;
import az.ilham.ecommerceauth.dto.user.ShopResponse;
import az.ilham.ecommerceauth.dto.user.TransferShopOwnershipRequest;
import az.ilham.ecommerceauth.dto.user.UpdateShopMemberRoleRequest;
import az.ilham.ecommerceauth.user.service.ShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@Tag(name = "Mağaza Üzvlüyü", description = "Autentifikasiya olunmuş istifadəçilər üçün mağaza yaratma və komanda üzvlüyü endpoint-ləri.")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping
    @Operation(summary = "Yeni mağaza yarat və cari istifadəçini OWNER kimi təyin et")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza uğurla yaradıldı",
                    content = @Content(schema = @Schema(implementation = ShopResponse.class))),
            @ApiResponse(responseCode = "400", description = "Sorğu yanlışdır və ya slug artıq istifadə olunur"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib")
    })
    public ResponseEntity<ShopResponse> createShop(
            @Valid @RequestBody CreateShopRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.createShop(request, userDetails.getUsername()));
    }

    @GetMapping("/mine")
    @Operation(summary = "Cari istifadəçinin üzv olduğu mağazaları siyahıla")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza siyahısı uğurla qaytarıldı",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = ShopResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib")
    })
    public ResponseEntity<List<ShopResponse>> getMyShops(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(shopService.getMyShops(userDetails.getUsername()));
    }

    @GetMapping("/{shopId}")
    @Operation(summary = "Cari üzvə görünən mağaza məlumatını gətir")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza uğurla qaytarıldı",
                    content = @Content(schema = @Schema(implementation = ShopResponse.class))),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza və ya üzvlük tapılmadı")
    })
    public ResponseEntity<ShopResponse> getShop(
            @PathVariable Long shopId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.getShop(shopId, userDetails.getUsername()));
    }

    @GetMapping("/{shopId}/members")
    @Operation(summary = "Cari istifadəçinin üzv olduğu mağazanın üzvlərini gətir")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza üzvləri uğurla qaytarıldı",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = ShopMemberResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza və ya üzvlük tapılmadı")
    })
    public ResponseEntity<List<ShopMemberResponse>> getShopMembers(
            @PathVariable Long shopId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.getShopMembers(shopId, userDetails.getUsername()));
    }

    @PostMapping("/{shopId}/members")
    @Operation(summary = "İstifadəçi adı və ya e-poçt ilə mağaza üzvü əlavə et və ya yenidən aktiv et")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza üzvü uğurla yadda saxlanıldı",
                    content = @Content(schema = @Schema(implementation = ShopMemberResponse.class))),
            @ApiResponse(responseCode = "400", description = "Cari istifadəçi üzvləri idarə edə bilmir və ya sorğu yanlışdır"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza, üzvlük və ya hədəf istifadəçi tapılmadı")
    })
    public ResponseEntity<ShopMemberResponse> addShopMember(
            @PathVariable Long shopId,
            @Valid @RequestBody AddShopMemberRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.addShopMember(shopId, request, userDetails.getUsername()));
    }

    @PatchMapping("/{shopId}/members/{memberUserId}")
    @Operation(summary = "Mağaza üzvünün rolunu yenilə")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza üzvünün rolu uğurla yeniləndi",
                    content = @Content(schema = @Schema(implementation = ShopMemberResponse.class))),
            @ApiResponse(responseCode = "400", description = "Cari istifadəçi üzvləri idarə edə bilmir və ya sorğu yanlışdır"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza, üzvlük və ya hədəf istifadəçi tapılmadı")
    })
    public ResponseEntity<ShopMemberResponse> updateMemberRole(
            @PathVariable Long shopId,
            @PathVariable Long memberUserId,
            @Valid @RequestBody UpdateShopMemberRoleRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.updateShopMemberRole(
                shopId,
                memberUserId,
                request,
                userDetails.getUsername()
        ));
    }

    @DeleteMapping("/{shopId}/members/{memberUserId}")
    @Operation(summary = "Mağaza üzvünü deaktiv et")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Mağaza üzvü uğurla deaktiv edildi"),
            @ApiResponse(responseCode = "400", description = "Cari istifadəçi üzvləri idarə edə bilmir və ya hədəf deaktiv edilə bilməz"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza, üzvlük və ya hədəf istifadəçi tapılmadı")
    })
    public ResponseEntity<Void> deactivateMember(
            @PathVariable Long shopId,
            @PathVariable Long memberUserId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        shopService.deactivateShopMember(shopId, memberUserId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{shopId}/invites")
    @Operation(summary = "E-poçt ünvanı üçün mağaza dəvəti yarat")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza dəvəti uğurla yaradıldı",
                    content = @Content(schema = @Schema(implementation = ShopInviteResponse.class))),
            @ApiResponse(responseCode = "400", description = "Cari istifadəçi dəvətləri idarə edə bilmir və ya sorğu yanlışdır"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza və ya üzvlük tapılmadı")
    })
    public ResponseEntity<ShopInviteResponse> createInvite(
            @PathVariable Long shopId,
            @Valid @RequestBody CreateShopInviteRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.createInvite(shopId, request, userDetails.getUsername()));
    }

    @GetMapping("/{shopId}/invites")
    @Operation(summary = "Cari istifadəçinin üzv olduğu mağazanın dəvətlərini siyahıla")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza dəvətləri uğurla qaytarıldı",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = ShopInviteResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza və ya üzvlük tapılmadı")
    })
    public ResponseEntity<List<ShopInviteResponse>> getInvites(
            @PathVariable Long shopId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.getShopInvites(shopId, userDetails.getUsername()));
    }

    @GetMapping("/invites/mine")
    @Operation(summary = "Cari istifadəçi üçün aktiv və keçmiş mağaza dəvətlərini siyahıla")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cari istifadəçinin dəvətləri uğurla qaytarıldı",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = ShopInviteResponse.class)))),
            @ApiResponse(responseCode = "400", description = "E-poçt təsdiqi tələb olunur"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib")
    })
    public ResponseEntity<List<ShopInviteResponse>> getMyInvites(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(shopService.getMyPendingInvites(userDetails.getUsername()));
    }

    @PostMapping("/invites/accept")
    @Operation(summary = "Token vasitəsilə mağaza dəvətini qəbul et")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mağaza dəvəti uğurla qəbul edildi",
                    content = @Content(schema = @Schema(implementation = ShopResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dəvət etibarsızdır, vaxtı bitib və ya e-poçt uyğun gəlmir"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Dəvət və ya istifadəçi tapılmadı")
    })
    public ResponseEntity<ShopResponse> acceptInvite(
            @Valid @RequestBody AcceptShopInviteRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.acceptInvite(request, userDetails.getUsername()));
    }

    @DeleteMapping("/{shopId}/members/me")
    @Operation(summary = "Cari autentifikasiya olunmuş üzv kimi mağazadan ayrıl")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Cari istifadəçi mağazadan uğurla ayrıldı"),
            @ApiResponse(responseCode = "400", description = "Owner ownership transfer etmədən mağazadan ayrıla bilməz"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza və ya üzvlük tapılmadı")
    })
    public ResponseEntity<Void> leaveShop(
            @PathVariable Long shopId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        shopService.leaveShop(shopId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{shopId}/invites/{inviteId}/cancel")
    @Operation(summary = "Gözləmədə olan mağaza dəvətini ləğv et")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Dəvət uğurla ləğv edildi",
                    content = @Content(schema = @Schema(implementation = ShopInviteResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dəvət ləğv edilə bilməz və ya bu mağazaya aid deyil"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza, üzvlük və ya dəvət tapılmadı")
    })
    public ResponseEntity<ShopInviteResponse> cancelInvite(
            @PathVariable Long shopId,
            @PathVariable Long inviteId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.cancelInvite(shopId, inviteId, userDetails.getUsername()));
    }

    @PatchMapping("/{shopId}/invites/{inviteId}/resend")
    @Operation(summary = "Yeni token və son tarix yaradaraq mağaza dəvətini yenidən göndər")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Dəvət uğurla yenidən göndərildi",
                    content = @Content(schema = @Schema(implementation = ShopInviteResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dəvət yenidən göndərilə bilməz və ya bu mağazaya aid deyil"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza, üzvlük və ya dəvət tapılmadı")
    })
    public ResponseEntity<ShopInviteResponse> resendInvite(
            @PathVariable Long shopId,
            @PathVariable Long inviteId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.resendInvite(shopId, inviteId, userDetails.getUsername()));
    }

    @PatchMapping("/{shopId}/ownership-transfer")
    @Operation(summary = "Mağaza sahibliyini başqa aktiv üzvə ötür")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sahiblik uğurla ötürüldü",
                    content = @Content(schema = @Schema(implementation = ShopResponse.class))),
            @ApiResponse(responseCode = "400", description = "Sahibliyi yalnız cari owner ötürə bilər və ya hədəf yanlışdır"),
            @ApiResponse(responseCode = "401", description = "Access token yoxdur, etibarsızdır və ya müddəti bitib"),
            @ApiResponse(responseCode = "404", description = "Mağaza, üzvlük və ya hədəf üzv tapılmadı")
    })
    public ResponseEntity<ShopResponse> transferOwnership(
            @PathVariable Long shopId,
            @Valid @RequestBody TransferShopOwnershipRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.transferOwnership(shopId, request, userDetails.getUsername()));
    }
}
