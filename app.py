from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3
import os
import random


app = Flask(__name__)


# Define path to the database
DATABASE = os.path.join(os.path.dirname(__file__), 'trivial_compute.db')

trivia_questions = {
    "yellow": [
        {"question": "Which country is the world's greatest producer of wine?", "answer": "Italy"},
    ],
    "green": [
        {"question": "The first National Basketball Association game was played in which of these years?", "answer": "1946"},
    ],
    "red": [
        {"question": "Which of these countries U.S. , Canada, Russia or Australia has the world's longest coastline?", "answer": "Canada"},
    ],
    "blue": [
        {"question": "What is the largest ocean?", "answer": "Pacific Ocean"},
    ]
}

players = []
max_players = 4
current_player = 0
numquest = 0

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

# Routes
@app.route('/')
def index():
   return render_template('index.html')

@app.route('/game')
def game():
    # Retrieve game state from database
    game_state = {
        'categories': ['History', 'Science', 'Geography', 'Art'],
        'players': [{'name': 'Player 1', 'score': 0}, {'name': 'Player 2', 'score': 0}],
        'current_player': 'Player 1',
        'current_question': 'What is the capital of France?',
        'answers': ['Paris', 'London', 'Berlin', 'Madrid']
    }
    return render_template('game.html', game_state=game_state)

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
        db.execute("INSERT INTO questions (name, question_text, correct_answer) VALUES (?, ?, ?)",
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
    
    # Queries categories from database
    db = get_db()
    table = db.execute("SELECT * from questions").fetchall()
    db.commit()
    db.close()
    return render_template('create_question.html', table=table)

@app.route('/get_question', methods=['GET'])
def get_question():
    category = request.args.get('category', None)
    if category:
        questions = trivia_questions.get(category, [])
    if questions:
        random_question = random.choice(questions)
        return jsonify(random_question)
    else:
        return jsonify({"question": "", "answer": ""})

@app.route('/add_question', methods=['POST'])
def add_question():
    data = request.get_json()
    category = data['category']
    new_question = {"question": data['question'], "answer": data['answer']}
    trivia_questions[category].append(new_question)
    return jsonify({"message": "Question added successfully!"})

@app.route('/add_player', methods=['POST'])
def add_player():
    global players
    if len(players) < max_players:
        player_name = request.get_json()['name']
        players.append({"name": player_name, "score": 0})
        return jsonify({"message": f"Player '{player_name}' added successfully!"})
    else:
        return jsonify({"message": f"Cannot add more than {max_players} players."})

@app.route('/next_player', methods=['GET'])
def next_player():
    global current_player, players
    current_player = (current_player + 1) % len(players)
    return jsonify({"current_player": players[current_player]['name']})

if __name__ == '__main__':
    app.run(debug=True)
