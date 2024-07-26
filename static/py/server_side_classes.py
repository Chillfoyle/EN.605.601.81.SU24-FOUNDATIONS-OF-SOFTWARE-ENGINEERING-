
class GameStateManager:
    # Class controlling the state of the game on the server side

    def __init__(self, playerList, categoryList):
        self.players = playerList
        self.categoryColors = ["red", "yellow", "green", "blue"]
        self.categories = {k: v for k, v in zip(self.categoryColors, categoryList)}

    def __repr__(self):
        return f"GameStateManager(players={self.players}, categories={self.categories})"


class Player:
    # Class representing the information and operations of a game player
    playerCount = 1

    def __init__(self, name, tokenColor):
        self.playerId = Player.playerCount  # ID # 0-3
        self.name = name  # Player name (user input)
        self.tokenColor = tokenColor  # Player token color (user input)
        Player.playerCount += 1  # Keep running track of next ID to assign

    def __repr__(self):
        return str({"id": self.playerId, "name": self.name,
                    "color": self.tokenColor})


class GameCategory:
    # Class representing a category being used during the game
    def __init__(self, catId, name):
        self.catId = catId  # Category ID (from database)
        self.name = name  # Category name (from database)

    def __repr__(self):
        return str({"id": self.catId, "name": self.name})
