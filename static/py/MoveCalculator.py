class MoveCalculator:
    """Class that calculates valid destinations for a player"""

    def __init__(self, game_board):
        """Constructor"""

        self.valid_squares = set()

        for i in range(len(game_board)):  # Create set of all valid coordinates
            for j in range(len(game_board[i])):
                if game_board[i][j] != "X":
                    self.valid_squares.update([(i, j)])

        print(f"All valid squares: {self.valid_squares}")

    def get_valid_destinations(self, current_location, num_steps,
                               valid_destinations=None, last_move=""):
        """Compile a list of all possible valid destinations from a player's
        current location given their available number of steps"""

        current_row, current_col = current_location

        if valid_destinations is None:
            valid_destinations = set()

        if num_steps == 0:  # No more steps; location is destination
            valid_destinations.update([(current_row, current_col)])
        else:  # Calculate moves one step from current location (no moving back)
            possible_moves = []
            if last_move != "D":
                possible_moves += [(current_row + 1, current_col, "U")]  # up
            if last_move != "U":
                possible_moves += [(current_row - 1, current_col, "D")]  # down
            if last_move != "R":
                possible_moves += [(current_row, current_col - 1, "L")]  # left
            if last_move != "L":
                possible_moves += [(current_row, current_col + 1, "R")]  # right

            for new_row, new_col, last_move in possible_moves:
                if (new_row, new_col) in self.valid_squares:
                    self.get_valid_destinations((new_row, new_col),
                                                num_steps - 1,
                                                valid_destinations,
                                                last_move)

        return valid_destinations
