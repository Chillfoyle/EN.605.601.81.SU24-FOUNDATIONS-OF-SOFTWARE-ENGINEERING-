class Player:
    """Class representing a player in the game"""

    def __init__(self, name, token_color, starting_location):
        """Constructor"""
        self.name = name  # Player name (user input)
        self.token_color = token_color  # Token color (user input)
        self.colors_earned = set()
        self.token_location = starting_location

    def get_name(self):
        """Return name"""
        return self.name

    def get_token_color(self):
        """Return token name"""
        return self.token_color

    def get_token_location(self):
        """Return token location"""
        return self.token_location

    def set_token_location(self, new_token_location):
        """Update token location"""
        self.token_location = new_token_location

    def get_colors_earned(self):
        """Return colors earned"""
        return self.colors_earned

    def update_colors_earned(self, new_category):
        """Add color to colors_earned"""
        self.colors_earned.update([new_category])

    def reset_colors_earned(self):
        """Resets player's score"""
        self.colors_earned = set()

    def __repr__(self):
        """Return a string representation of the Player object"""
        return str({"name": self.name, "token_color": self.token_color})
