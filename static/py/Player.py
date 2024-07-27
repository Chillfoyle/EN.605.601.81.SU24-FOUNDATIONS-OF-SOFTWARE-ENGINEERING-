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
