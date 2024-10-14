-- Migration script to create the item and item_images tables

-- Create the item table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    quantity INTEGER NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR,
    listed_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Create the item_images table
CREATE TABLE item_images (
    item_id INTEGER NOT NULL,
    image_url VARCHAR NOT NULL,
    PRIMARY KEY (item_id, image_url),
    FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
);