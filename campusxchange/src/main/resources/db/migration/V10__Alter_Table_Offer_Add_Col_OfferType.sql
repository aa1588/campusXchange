-- add offer_type column to existing offers table
ALTER TABLE offers ADD COLUMN offer_type VARCHAR(50) NOT NULL DEFAULT 'OFFER';