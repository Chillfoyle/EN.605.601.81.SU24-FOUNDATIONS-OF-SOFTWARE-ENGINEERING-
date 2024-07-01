CREATE TABLE IF NOT EXISTS categories (
   id INTEGER PRIMARY KEY,
   name TEXT NOT NULL,
   color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
   id INTEGER PRIMARY KEY,
   category_id INTEGER NOT NULL,
   question_text TEXT NOT NULL,
   correct_answer TEXT NOT NULL,
   FOREIGN KEY (category_id) REFERENCES categories (id)
);
