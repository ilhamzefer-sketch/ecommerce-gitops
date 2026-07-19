ALTER TABLE users
ADD COLUMN authorization_version BIGINT NOT NULL DEFAULT 0;

CREATE TABLE authorization_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL,
    actor_username VARCHAR(100) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_identifier VARCHAR(150) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_authorization_audit_logs_created_at ON authorization_audit_logs(created_at);
CREATE INDEX idx_authorization_audit_logs_target ON authorization_audit_logs(target_type, target_identifier);
