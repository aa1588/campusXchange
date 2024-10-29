-- V1__Create_questions_table.sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT fk_question_item
   FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE,

   CONSTRAINT fk_question_user
   FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
