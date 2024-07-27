from static.py.GameCategory import GameCategory
from static.py.Player import Player


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

    def get_players_info(self):
        return [{"name": player.name, "token_color": player.token_color} for
                player in self.player_list]

    # TODO: Add other functions

    def __repr__(self):
        """Return string representation of GSM information"""
        return f"GSM(player={self.player_list}, category={self.category_list})"