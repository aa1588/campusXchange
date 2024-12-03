
CREATE TABLE offer_items (
     id SERIAL PRIMARY KEY,
     offer_id INTEGER NOT NULL,
     item_id INTEGER NOT NULL,
     quantity INTEGER NOT NULL,
     CONSTRAINT fk_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
     CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);
