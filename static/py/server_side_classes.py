class DatabaseManager:
    # TODO: Design this class
    pass


class GameStateManager:
    """Class controlling the state of the game on the server side"""

    def __init__(self, player_inputs, category_ids):
        """Constructor"""

        self.current_player = 0
        self.winning_category_set = category_ids
        self.category_colors = ["red", "yellow", "green", "blue"]
        self.start_loc = (4, 4)

        # Initialize Players
        self.player_list = []
        for name, token_color in player_inputs:
            self.player_list.append(Player(name, token_color, self.start_loc))

        # Initialize GameCategories
        self.category_list = []
        for i in range(len(category_ids)):
            new_cat = GameCategory(category_ids[i], self.category_colors[i])
            self.category_list.append(new_cat)

        # Initialize game board information
        row8 = [-2, "O", "O", "O", 0, "O", "O", "O", -2]
        row7 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row6 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row5 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row4 = [1, "O", "O", "O", -1, "O", "O", "O", 2]
        row3 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row2 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row1 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row0 = [-2, "O", "O", "O", 3, "O", "O", "O", -2]

        self.game_board = [row0, row1, row2, row3, row4, row5,
                           row6, row7, row8]

    # TODO: Add other functions

    def __repr__(self):
        """Return string representation of GSM information"""
        return f"GSM(player={self.player_list}, category={self.category_list})"


class Player:
    """Class representing a player in the game"""

    def __init__(self, name, token_color, starting_location):
        """Constructor"""
        self.name = name  # Player name (user input)
        self.token_name = token_color + "_token"  # Token color (user input)
        self.categories_earned = set()
        self.token_location = starting_location

    def get_name(self):
        """Return name"""
        return self.name

    def get_token_name(self):
        """Return token name"""
        return self.token_name

    def get_token_location(self):
        """Return token location"""
        return self.token_location

    def set_token_location(self, new_token_location):
        """Update token location"""
        self.token_location = new_token_location

    def get_categories_earned(self):
        """Return categories earned"""
        return self.categories_earned

    def update_categories_earned(self, new_category):
        """Add category to categories_earned"""
        self.categories_earned.update(new_category)

    def __repr__(self):
        """Return a string representation of the Player object"""
        return str({"name": self.name, "token_name": self.token_name})


class GameCategory:
    """Class representing a category being used during the game"""

    def __init__(self, cat_id, color):
        """Constructor"""
        self.cat_id = cat_id  # Category ID (from database)
        self.name = self.retrieve_name(cat_id)  # Category name (from database)
        self.color = color  # From GSM
        self.question_list = []
        self.current_question = 0

    # TODO: Complete
    def retrieve_name(self, cat_id):
        """Get name from database"""
        pass

    def get_name(self):
        """Return name"""
        return self.name

    def get_color(self):
        """Return color"""
        return self.color

    # TODO: Complete
    def retrieve_cat_questions(self):
        """Get list of questions from the database"""
        pass

    def get_next_question(self):
        """Return next question in question_list"""
        next_q = self.question_list[self.current_question]
        self.current_question += 1
        return next_q

    def __repr__(self):
        """Return a string representation of the GameCategory object"""
        return str({"id": self.cat_id, "name": self.name, "color": self.color})


class MoveCalculator:
    """Class that calculates valid destinations for a player"""

    def __init__(self, game_board):
        """Constructor"""

        self.valid_squares = set()

        for i in range(len(game_board)):  # Create set of all valid coordinates
            for j in range(len(game_board[i])):
                if game_board[i][j] != "X":
                    self.valid_squares.update([(i, j)])

    def get_valid_destinations(self, current_location, num_steps,
                               valid_destinations=None):
        """Compile a list of all possible valid destinations from a player's
        current location given their available number of steps"""

        current_row, current_col = current_location

        if valid_destinations is None:
            valid_destinations = set()

        if num_steps == 0:  # No more steps; location is destination
            valid_destinations.update([(current_row, current_col)])
        else:  # Calculate possible moves one step from current location
            possible_moves = [(current_row - 1, current_col),  # down
                              (current_row + 1, current_col),  # up
                              (current_row, current_col - 1),  # left
                              (current_row, current_col + 1)]  # right

            for new_row, new_col in possible_moves:
                if (new_row, new_col) in self.valid_squares:
                    valid_destinations.update(
                        self.get_valid_destinations((new_row, new_col),
                                                    num_steps - 1,
                                                    valid_destinations))
        return valid_destinations
