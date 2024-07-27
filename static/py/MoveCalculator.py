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
