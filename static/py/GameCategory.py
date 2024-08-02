import random
import sqlite3


class GameCategory:
    """Class representing a category being used during the game"""

    def __init__(self, name, color, DATABASE):
        """Constructor"""
        self.name = name
        self.color = color  # From GSM
        self.current_question = 0
        self.question_list = []
        self.fetch_questions(DATABASE)

    def get_name(self):
        """Return name"""
        return self.name

    def get_color(self):
        """Return color"""
        return self.color

    def fetch_questions(self, DATABASE):
        db = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
        data = db.execute("SELECT * FROM questions where name=?",
                          (self.name,)).fetchall()

        for row in data:
            qa = {"question": row['question_text'],
                  "answer": row['correct_answer']}
            self.question_list.append(qa)

        random.shuffle(self.question_list)
        db.close()

    def get_next_question(self):
        """Return next question and answer in question_list"""
        next_q = self.question_list[self.current_question]
        self.current_question = (self.current_question + 1) % len(self.question_list)
        return next_q["question"], next_q["answer"]

    def __repr__(self):
        """Return a string representation of the GameCategory object"""
        return str({"name": self.name, "color": self.color})
