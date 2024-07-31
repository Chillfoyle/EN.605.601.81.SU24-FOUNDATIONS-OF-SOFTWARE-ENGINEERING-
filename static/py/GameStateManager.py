from static.py.GameCategory import GameCategory
from static.py.Player import Player
from static.py.MoveCalculator import MoveCalculator


class GameStateManager:
    """Class controlling the state of the game on the server side"""

    def __init__(self, player_inputs, category_ids):
        """Constructor"""

        self.current_player_idx = 0
        self.winning_category_set = category_ids
        self.category_colors = ["red", "yellow", "green", "blue"]
        self.start_loc = (4, 4)

        # Initialize Players
        self.player_list = []
        for player in player_inputs:
            new_player = Player(player["name"], player["tokenColor"],
                                self.start_loc)
            self.player_list.append(new_player)

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

        self.move_calculator = MoveCalculator(self.game_board)

    def all_categories_earned(self):
        return self.player_list[self.current_player_idx].get_colors_earned() == set(self.category_colors)

    def get_category_colors(self):
        return [(category.get_color(), category.get_name()) for category in self.category_list]

    def get_players_info(self):
        return [{"name": player.get_name(),
                 "token_color": player.get_token_color(),
                 "token_location": player.get_token_location()}
                for player in self.player_list]

    def get_current_player_info(self):
        player = self.player_list[self.current_player_idx]
        return {"name": player.get_name(),
                "token_color": player.get_token_color(),
                "token_location": player.get_token_location(),
                "colors_earned": list(player.get_colors_earned())}

    def get_valid_destinations(self, player_loc, num_steps):
        return self.move_calculator.get_valid_destinations(player_loc, num_steps)

    def update_current_player_location(self, new_location):
        self.player_list[self.current_player_idx].token_location = tuple(new_location)
        return self.get_next_action(new_location)

    def update_current_player(self):
        self.current_player_idx = (self.current_player_idx + 1) % len(self.player_list)
        return self.get_current_player_info()

    def get_next_action(self, player_loc):
        category_color = None
        row, col = player_loc
        new_square = self.game_board[row][col]
        if new_square == "O":
            self.update_current_player()
            return "next player turn", None
        elif new_square == -2:
            return "roll again", None
        else:
            if new_square in range(0, 4):
                category_color = self.category_colors[new_square]
                next_action = "ask question hq"
            elif new_square == -1:
                if self.all_categories_earned():
                    next_action = "ask winning question"
                else:
                    next_action = "ask question center"
            return next_action, category_color

    def update_player_colors_earned(self, new_color):
        current_player = self.player_list[self.current_player_idx]
        current_player.update_colors_earned(new_color)
        return current_player.get_colors_earned() == set(self.category_colors)

    def __repr__(self):
        """Return string representation of GSM information"""
        return f"GSM(player={self.player_list}, category={self.category_list})"