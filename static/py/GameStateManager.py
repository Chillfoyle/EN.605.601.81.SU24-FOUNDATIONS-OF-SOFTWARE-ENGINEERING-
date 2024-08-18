from static.py.GameCategory import GameCategory
from static.py.Player import Player
from static.py.MoveCalculator import MoveCalculator


class GameStateManager:
    """Class controlling the state of the game on the server side"""

    def __init__(self, player_inputs, category_ids, DATABASE):
        """Constructor"""
        print("game state manager initialized")
        self.current_player_idx = 0
        self.category_colors = ["red", "yellow", "green", "blue"]
        self.start_loc = (4, 4)

        # Initialize Players
        self.player_list = []
        for player in player_inputs:
            new_player = Player(player["name"], player["tokenColor"],
                                self.start_loc)
            self.player_list.append(new_player)

        # Initialize GameCategories
        self.category_dict = {}
        for i in range(len(category_ids)):
            new_cat = GameCategory(category_ids[i], self.category_colors[i], DATABASE)
            self.category_dict[self.category_colors[i]] = new_cat

        # Initialize game board information
        row8 = [-2, "O", "O", "O", 3, "O", "O", "O", -2]
        row7 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row6 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row5 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row4 = [1, "O", "O", "O", -1, "O", "O", "O", 2]
        row3 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row2 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row1 = ["O", "X", "X", "X", "O", "X", "X", "X", "O"]
        row0 = [-2, "O", "O", "O", 0, "O", "O", "O", -2]

        self.game_board = [row0, row1, row2, row3, row4, row5,
                           row6, row7, row8]

        self.move_calculator = MoveCalculator(self.game_board)

    def get_all_categories_earned(self):
        """Return True if current player has all colors earned; otherwise, False"""
        return self.player_list[self.current_player_idx].get_colors_earned() == set(self.category_colors)

    def get_category_colors(self):
        """Return the set of category names and their assigned colors"""
        return [(category.get_color(), category.get_name()) for category in self.category_dict.values()]

    def get_category_names(self):
        """Return the set of category names"""
        return [category.get_name() for category in self.category_dict.values()]

    def get_players_info(self):
        """Get players' names, token colors, and token locations"""
        # Verify player scores
        print([player.get_colors_earned() for player in self.player_list])

        return [{"name": player.get_name(),
                 "token_color": player.get_token_color(),
                 "token_location": player.get_token_location()}
                for player in self.player_list]

    def get_current_player_info(self):
        """Get name, token color, token location for current player and
        whether they have all colors earned"""
        player = self.player_list[self.current_player_idx]
        return {"name": player.get_name(),
                "token_color": player.get_token_color(),
                "token_location": player.get_token_location(),
                "all_colors_earned": self.get_all_categories_earned()}

    def get_valid_destinations(self, player_loc, num_steps):
        """Return set of valid destinations based on token location and die"""
        return self.move_calculator.get_valid_destinations(player_loc, num_steps)

    def update_current_player_location(self, new_location):
        """Update current player's stored token location"""
        self.player_list[self.current_player_idx].set_token_location(tuple(new_location))
        print(f"Current player new location: {tuple(new_location)}")

    def update_current_player(self):
        """Move to the next player in the turn sequence"""
        self.current_player_idx = (self.current_player_idx + 1) % len(self.player_list)
        return self.get_current_player_info()

    def get_next_action(self, player_loc):
        """Based on player token location, return what logic should execute"""
        category_color = None
        next_action = None
        row, col = player_loc
        new_square = self.game_board[row][col]
        print(f"Square at coordinates {(row, col)} has value {new_square}")

        if new_square == "O":  # No logic
            self.update_current_player()
            return "next player turn", None
        elif new_square == -2:  # Roll Again square
            return "roll again", None
        else:
            if new_square in range(0, 4):  # Category HQ square
                category_color = self.category_colors[new_square]
                print(f"Category color: {self.category_colors[new_square]}")
                next_action = "ask question from category"
            elif new_square == -1:  # Center square
                if self.get_all_categories_earned():
                    next_action = "ask winning question"
                else:
                    next_action = "ask question center"

            return next_action, category_color

    def update_player_colors_earned(self, new_color):
        """Update player's score by adding a color"""
        current_player = self.player_list[self.current_player_idx]
        current_player.update_colors_earned(new_color)
        print(f"Updated Score: {current_player.get_colors_earned()}")

    def reset_player_colors_earned(self):
        """Reset score for all players"""
        for player in self.player_list:
            player.reset_colors_earned()
            print(f"Updated Score: {player.get_colors_earned()}")

    def get_question_from_cat(self, color):
        """Return question from category with assigned color"""
        return self.category_dict[color].get_next_question()

    def get_token_path(self, curr_loc, dest_loc):
        """Get sequence of squares on path from current location to destination"""
        return self.move_calculator.get_token_path(curr_loc, dest_loc)

    def __repr__(self):
        """Return string representation of GSM information"""
        return f"GSM(player={self.player_list}, category={self.category_dict})"
