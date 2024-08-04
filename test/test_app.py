import app


def test_get_db_0():
    assert app.get_db() is not None


def test_index_0():
    assert app.index() is not None


def test_start_game_0():
    assert app.start_game() is not None


def test_game_0():
    assert app.game() is not None


def test_setup_screen_0():
    assert app.setup_screen() is not None


def test_get_players_0():
    assert app.get_players() is not None


def test_get_valid_destinations_0():
    assert app.get_valid_destinations() is not None


def test_get_categories_0():
    assert app.get_categories() is not None


def test_get_category_colors_0():
    assert app.get_category_colors() is not None


def test_get_category_names_0():
    assert app.get_category_names() is not None


def test_get_question_0():
    assert app.get_question() is not None


def test_get_current_player_0():
    assert app.get_current_player() is not None


def test_get_all_categories_earned_0():
    assert app.get_all_categories_earned() is not None


def test_update_current_player_0():
    assert app.update_current_player() is not None


def test_update_current_player_location_0():
    assert app.update_current_player_location() is not None


def test_update_player_score_0():
    assert app.update_player_score() is not None


def test_create_category_0():
    assert app.create_category() is not None


def test_delete_category_0():
    assert app.delete_category() is not None


def test_create_question_0():
    assert app.create_question() is not None


def test_delete_question_0():
    assert app.delete_question() is not None


def test_add_question_0():
    assert app.add_question() is not None
