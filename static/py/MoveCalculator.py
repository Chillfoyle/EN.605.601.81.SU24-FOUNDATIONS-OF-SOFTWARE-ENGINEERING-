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

    def get_neighbors(self, current_row, current_col):
        """Returns all valid neighboring squares from a given square.
        Implement this based on your board's specific structure"""
        return {"D": (current_row + 1, current_col),
                "U": (current_row - 1, current_col),
                "L": (current_row, current_col - 1),
                "R": (current_row, current_col + 1)}

    def get_token_path(self, start, destination):
        """Get dictionary storing the optimal path to each square from
        the destination"""
        came_from = {destination: None}
        frontier = [destination]  # Start from the destination and work backwards

        while frontier:
            current = frontier.pop(0)

            for neighbor in self.get_neighbors(current[0], current[1]).values():
                if neighbor not in came_from and neighbor in self.valid_squares:
                    frontier.append(neighbor)
                    came_from[neighbor] = current

                    # Stop once we reach the start
                    if neighbor == start:
                        path = []
                        while neighbor:
                            path.append(neighbor)
                            neighbor = came_from[neighbor]
                        return path[::-1]  # Return the path in the correct order

        return []  # If no path is found, return an empty list

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
            neighbors = self.get_neighbors(current_row, current_col)

            if last_move != "D":
                possible_moves.append((neighbors["U"][0], neighbors["U"][1], "U"))  # up
            if last_move != "U":
                possible_moves.append((neighbors["D"][0], neighbors["D"][1], "D"))  # down
            if last_move != "R":
                possible_moves.append((neighbors["L"][0], neighbors["L"][1], "L"))  # left
            if last_move != "L":
                possible_moves.append((neighbors["R"][0], neighbors["R"][1], "R"))  # right

            for next_row, next_col, last_move in possible_moves:
                if (next_row, next_col) in self.valid_squares:
                    self.get_valid_destinations((next_row, next_col),
                                                num_steps - 1,
                                                valid_destinations,
                                                last_move)

        return valid_destinations
