-- V3__Create_Wishlist_Items.sql
CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE,
    CONSTRAINT fk_item
    FOREIGN KEY (item_id)
    REFERENCES items (id)
    ON DELETE CASCADE
);