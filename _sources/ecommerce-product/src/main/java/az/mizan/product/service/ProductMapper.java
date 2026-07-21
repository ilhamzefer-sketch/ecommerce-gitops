package az.mizan.product.service;

import az.mizan.product.domain.Inquiry;
import az.mizan.product.domain.Product;
import az.mizan.product.dto.InquiryDto;
import az.mizan.product.dto.ProductDto;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDto toDto(Product product) {
        return new ProductDto(
                product.getId(), product.getShopId(), product.getName(), product.getSlug(),
                product.getDescription(), product.getCategory(), product.getPrice(), product.getCurrency(),
                product.getConditionLabel(), product.getStockNote(), product.getImageUrl(),
                product.getDeliveryNote(), product.getStatus(), product.getCreatedAt(), product.getUpdatedAt()
        );
    }

    public InquiryDto toDto(Inquiry inquiry) {
        return new InquiryDto(
                inquiry.getId(), inquiry.getProductId(), inquiry.getShopId(), inquiry.getBuyerUserId(),
                inquiry.getMessage(), inquiry.getPreferredContact(), inquiry.getStatus(),
                inquiry.getCreatedAt(), inquiry.getUpdatedAt()
        );
    }
}
