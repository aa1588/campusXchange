-- V2__Create_answers_table.sql
CREATE TABLE answers (
   id SERIAL PRIMARY KEY,
   answer_text TEXT NOT NULL,
   question_id INTEGER NOT NULL,
   user_id INTEGER NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT fk_answer_question
   FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,

   CONSTRAINT fk_answer_user
   FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
