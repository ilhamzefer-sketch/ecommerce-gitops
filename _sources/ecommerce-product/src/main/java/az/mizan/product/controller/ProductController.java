package az.mizan.product.controller;

import az.mizan.product.dto.ProductDto;
import az.mizan.product.dto.ProductUpsertDto;
import az.mizan.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    List<ProductDto> catalog() {
        return productService.catalog();
    }

    @GetMapping("/{slug}")
    ProductDto product(@PathVariable String slug) {
        return productService.publicProduct(slug);
    }

    @GetMapping("/seller/list")
    List<ProductDto> shopProducts(
            @RequestParam Long shopId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken
    ) {
        return productService.shopProducts(shopId, bearerToken);
    }

    @PostMapping
    ResponseEntity<ProductDto> create(
            @Valid @RequestBody ProductUpsertDto request,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request, bearerToken));
    }

    @PutMapping("/{productId}")
    ProductDto update(
            @PathVariable Long productId,
            @Valid @RequestBody ProductUpsertDto request,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken
    ) {
        return productService.update(productId, request, bearerToken);
    }

    @PostMapping("/{productId}/publish")
    ProductDto publish(
            @PathVariable Long productId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken
    ) {
        return productService.publish(productId, bearerToken);
    }

    @PostMapping("/{productId}/archive")
    ProductDto archive(
            @PathVariable Long productId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String bearerToken
    ) {
        return productService.archive(productId, bearerToken);
    }
}
