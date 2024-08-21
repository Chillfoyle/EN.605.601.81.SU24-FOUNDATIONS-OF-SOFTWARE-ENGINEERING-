from flask import Flask, render_template, request, jsonify
import sqlite3
import os
from static.py.GameStateManager import GameStateManager

app = Flask(__name__)

# Define path to the database
DATABASE = os.path.join(os.path.dirname(__file__), 'trivial_compute.db')

global game_state_manager

# TODO: Remove
trivia_questions = [
    {"question": "Which country is the world's greatest producer of wine?", "answer": "Italy"},
    {"question": "The first National Basketball Association game was played in which of these years?",
     "answer": "1946"},
    {"question": "Which of these countries U.S. , Canada, Russia or Australia has the world's longest coastline?",
     "answer": "Canada"},
    {"question": "What is the largest ocean?", "answer": "Pacific Ocean"}]


# Utility function to initialize database
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('create_db.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


# Utility function for database operations
def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db


# Initialize database if not exists
if not os.path.exists(DATABASE):
    init_db()


# Page routes

@app.route('/')
def index():
    return render_template('index.html')


@app.route("/start_game", methods=["POST"])
def start_game():
    global game_state_manager

    # Get JSON data from the request
    data = request.get_json()

    # Extract players and categories from the data
    players = data.get('players', [])
    categories = data.get('categories', [])

    # Create a new GameStateManager instance
    game_state_manager = GameStateManager(players, categories, DATABASE)

    # Return a success response
    return jsonify({"message": "Game started successfully",
                    "game_state": str(game_state_manager)})


@app.route('/game')
def game():
    return render_template('game.html')


@app.route('/instructions')
def instructions():
    return render_template('instructions.html')


@app.route('/setup_screen')
def setup_screen():
    return render_template('setup_screen.html')


# Retrieval routes

@app.route('/get_players', methods=['GET'])
def get_players():
    game_state_manager.reset_player_colors_earned()
    players_info = game_state_manager.get_players_info()
    print(f"Players' Info {players_info}")
    return jsonify(players_info)


@app.route('/get_valid_destinations', methods=['POST'])
def get_valid_destinations():
    data = request.json
    player_loc = data["location"]
    num_steps = data["dieVal"]
    print(f"player location is {player_loc}, num_steps is {num_steps}")
    valid_destinations = game_state_manager.get_valid_destinations(player_loc,
                                                                   num_steps)
    print(f"Valid Destinations: {valid_destinations}")
    return jsonify([list(dest) for dest in valid_destinations])


@app.route('/get_token_path', methods=['POST'])
def get_token_path():
    data = request.json
    print(data)
    start_loc = data["startLoc"]
    dest_loc = data["destLoc"]
    path = game_state_manager.get_token_path(tuple(dest_loc), tuple(start_loc))
    print(f"Path to Destination: {path}")
    return jsonify([list(square) for square in path])


@app.route('/get_categories', methods=['GET'])
def get_categories():
    db = get_db()
    categories = db.execute("SELECT name FROM categories").fetchall()
    categories = [row[0] for row in categories]
    db.close()
    return jsonify(categories)


@app.route('/get_category_colors', methods=['GET'])
def get_category_colors():
    colors = game_state_manager.get_category_colors()
    return jsonify(colors)


@app.route('/get_category_names', methods=['GET'])
def get_category_names():
    names = game_state_manager.get_category_names()
    return jsonify(names)


@app.route('/get_question', methods=['POST'])
def get_question():
    color = request.get_json().get("color", None)
    question, answer = game_state_manager.get_question_from_cat(color)
    print(f"Question: {question}, Answer: {answer}")
    return jsonify({"question": question, "answer": answer})


@app.route('/get_current_player', methods=['GET'])
def get_current_player():
    current_player_info = game_state_manager.get_current_player_info()
    return jsonify(current_player_info)


@app.route('/get_all_categories_earned', methods=['GET'])
def get_all_categories_earned():
    return jsonify(game_state_manager.get_all_categories_earned())


@app.route('/get_next_action', methods=['POST'])
def get_next_action():
    data = request.json
    next_action, category_color = game_state_manager.get_next_action(data)
    return jsonify({'next_action': next_action, "color": category_color})


# Update routes

@app.route('/update_current_player', methods=['POST'])
def update_current_player():
    game_state_manager.update_current_player()
    return jsonify({'current_player': game_state_manager.get_current_player_info()})


@app.route('/update_current_player_location', methods=['POST'])
def update_current_player_location():
    data = request.json
    print(f"next location is {data['nextLocation']}")
    game_state_manager.update_current_player_location(data["nextLocation"])
    return jsonify({"response": "success"})


@app.route('/update_player_score', methods=['POST'])
def update_player_score():
    data = request.json
    game_state_manager.update_player_colors_earned(data["color"])
    return jsonify({'all_colors': game_state_manager.get_all_categories_earned()})


@app.route('/reset_game', methods=['POST'])
def reset_game():
    game_state_manager.reset_player_colors_earned()
    return jsonify({"response": "success"})


# Database routes

@app.route('/create_category', methods=['GET', 'POST'])
def create_category():
    if request.method == 'POST':
        category_name = request.form['category_name']

        # Insert category into database
        db = get_db()
        db.execute("INSERT INTO categories VALUES (?)", (category_name,))
        db.commit()
        db.close()
    
    # Queries categories from database
    db = get_db()
    table = db.execute("SELECT * from categories").fetchall()
    db.commit()
    db.close()
    return render_template('create_category.html', table=table)


@app.route('/delete_category', methods=['POST'])
def delete_category():
    if request.method == 'POST':
        delete_name = request.form['delete_name']
        print(f"{delete_name}")
        if delete_name != "":
            
            db = get_db()
            db.execute("DELETE from categories where name=?", (delete_name,))
            db.commit()
            db.close()
    
    # Queries categories from database
    db = get_db()
    table = db.execute("SELECT * from categories").fetchall()
    db.commit()
    db.close()
    return render_template('create_category.html', table=table)


@app.route('/create_question', methods=['GET', 'POST'])
def create_question():
    if request.method == 'POST':
        name = request.form['name']
        question_text = request.form['question_text']
        correct_answer = request.form['correct_answer']
        # Insert question into database
        
        db = get_db()
        db.execute(
            "INSERT INTO questions (name, question_text, correct_answer) VALUES (?, ?, ?)",
            (name, question_text, correct_answer))
        db.commit()
        db.close()

    # Retrieve categories from database for dropdown
    db = get_db()
    categories = db.execute("SELECT * FROM categories").fetchall()
    db.close()

    # Queries questions from database
    db = get_db()
    table = db.execute("SELECT * from questions").fetchall()
    db.commit()
    db.close()
    return render_template('create_question.html', categories=categories, table=table)


@app.route('/delete_question', methods=['POST'])
def delete_question():
    if request.method == 'POST':
        delete_id = request.form['delete_id']
        print(f"{delete_id}")
        if delete_id != "":
            db = get_db()
            db.execute("DELETE from questions where id=?", (delete_id,))
            db.commit()
            db.close()

    # Retrieve categories from database for dropdown
    db = get_db()
    categories = db.execute("SELECT * FROM categories").fetchall()
    db.close()

    # Queries categories from database
    db = get_db()
    table = db.execute("SELECT * from questions").fetchall()
    db.commit()
    db.close()
    return render_template('create_question.html', categories=categories, table=table)


# TODO: Not sure if we still need this...
# This helper fetches questions/answer from the database
def update_dict(chosen_categories):
    db = get_db()
    net_quest_lst = []

    for cate in chosen_categories:
        data = db.execute("SELECT * FROM questions where name=?", (cate,)).fetchall()
        sublst = []
        for row in data:
            qa = {"question": row['question_text'], "answer": row['correct_answer']}
            sublst.append(qa)
        net_quest_lst.append(sublst)

    trivia_questions = {
        "yellow": net_quest_lst[0],
        "green": net_quest_lst[1],
        "red": net_quest_lst[2],
        "blue": net_quest_lst[3]
    }
    db.close()
    return trivia_questions


@app.route('/add_question', methods=['POST'])
def add_question():
    data = request.get_json()
    category = data['category']
    new_question = {"question": data['question'], "answer": data['answer']}
    trivia_questions[category].append(new_question)
    return jsonify({"message": "Question added successfully!"})


if __name__ == '__main__':
    app.run(debug=True)
