class GameCategory:
    """Class representing a category being used during the game"""

    def __init__(self, cat_id, color):
        """Constructor"""
        self.cat_id = cat_id  # Category ID (from database)
        self.name = "" # self.fetch_name(cat_id)  # Category name (from database)
        self.color = color  # From GSM
        self.question_list = []
        self.current_question = 0

    # TODO: Complete
    def fetch_name(self, cat_id):
        """Get name from database"""
        pass

    def get_name(self):
        """Return name"""
        return self.name

    def get_color(self):
        """Return color"""
        return self.color

    # TODO: Complete
    def fetch_cat_questions(self):
        """Get list of questions from the database"""
        pass

    def get_next_question(self):
        """Return next question and answer in question_list"""
        next_q = self.question_list[self.current_question]
        self.current_question += 1
        return next_q.question_text, next_q.answer_text

    def __repr__(self):
        """Return a string representation of the GameCategory object"""
        return str({"id": self.cat_id, "name": self.name, "color": self.color})
