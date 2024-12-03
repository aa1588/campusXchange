-- Migration script to create Offer table

CREATE TABLE offers (
       id SERIAL PRIMARY KEY,
       amount DECIMAL(10, 2) NOT NULL,
       offered_by INTEGER NOT NULL, -- Foreign key referencing users(id)
       item_id INTEGER NOT NULL, -- Foreign key referencing items(id)
       status VARCHAR(50) NOT NULL, -- Possible values: PENDING, ACCEPTED, REJECTED, etc.
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT fk_user FOREIGN KEY (offered_by) REFERENCES users(id) ON DELETE CASCADE,
       CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    );


