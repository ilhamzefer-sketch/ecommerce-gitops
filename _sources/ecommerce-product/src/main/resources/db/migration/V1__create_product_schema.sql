CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT NOT NULL,
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(190) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    condition_label VARCHAR(40) NOT NULL,
    stock_note VARCHAR(120),
    image_url VARCHAR(500) NOT NULL,
    delivery_note VARCHAR(240),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE inquiries (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    shop_id BIGINT NOT NULL,
    buyer_user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    preferred_contact VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_inquiry_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_products_shop ON products(shop_id);
CREATE INDEX idx_products_catalog ON products(status, category);
CREATE INDEX idx_inquiries_shop ON inquiries(shop_id, status);
CREATE INDEX idx_inquiries_buyer ON inquiries(buyer_user_id);
