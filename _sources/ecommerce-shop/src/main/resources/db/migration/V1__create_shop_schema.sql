CREATE TABLE shops (
    id BIGSERIAL PRIMARY KEY,
    owner_user_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(120),
    address VARCHAR(240),
    city VARCHAR(80),
    category VARCHAR(80),
    company_name VARCHAR(160),
    tax_id VARCHAR(40),
    terms_accepted_at TIMESTAMP,
    status VARCHAR(30) NOT NULL,
    rejection_reason TEXT,
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE shop_members (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    member_role VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_shop_members_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    CONSTRAINT uk_shop_members_user UNIQUE (shop_id, user_id)
);

CREATE TABLE shop_status_audit (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT NOT NULL,
    admin_user_id BIGINT NOT NULL,
    old_status VARCHAR(30) NOT NULL,
    new_status VARCHAR(30) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_shop_audit_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

CREATE INDEX idx_shops_status ON shops(status);
CREATE INDEX idx_shop_members_user ON shop_members(user_id);
CREATE INDEX idx_shop_audit_shop ON shop_status_audit(shop_id);
