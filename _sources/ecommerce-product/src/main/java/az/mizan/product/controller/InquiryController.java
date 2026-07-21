package az.mizan.product.controller;

import az.mizan.product.dto.InquiryCreateDto;
import az.mizan.product.dto.InquiryDto;
import az.mizan.product.dto.InquiryStatusDto;
import az.mizan.product.security.ProductPrincipal;
import az.mizan.product.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    ResponseEntity<InquiryDto> create(
            @AuthenticationPrincipal ProductPrincipal principal,
            @Valid @RequestBody InquiryCreateDto request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inquiryService.create(principal.userId(), request));
    }

    @GetMapping("/mine")
    List<InquiryDto> mine(@AuthenticationPrincipal ProductPrincipal principal) {
        return inquiryService.buyerInquiries(principal.userId());
    }

    @GetMapping("/shop/{shopId}")
    List<InquiryDto> shop(
            @PathVariable Long shopId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken
    ) {
        return inquiryService.shopInquiries(shopId, bearerToken);
    }

    @PatchMapping("/{inquiryId}/status")
    InquiryDto changeStatus(
            @PathVariable Long inquiryId,
            @Valid @RequestBody InquiryStatusDto request,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken
    ) {
        return inquiryService.changeStatus(inquiryId, request.status(), bearerToken);
    }
}
