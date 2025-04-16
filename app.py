# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import crud

app = Flask(__name__)
CORS(app)  # Per permettere le richieste cross-origin dal frontend

# Endpoint di autenticazione
@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    result = crud.sign_up(data['email'], data['password'])
    return jsonify(result)

@app.route('/auth/signin', methods=['POST'])
def signin():
    data = request.json
    result = crud.sign_in(data['email'], data['password'])
    return jsonify(result)

@app.route('/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    result = crud.reset_password(data['email'])
    return jsonify(result)

# Endpoint per i valori
@app.route('/values', methods=['GET'])
def get_values():
    user_id = request.args.get('user_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    result = crud.get_values(user_id, start_date, end_date)
    return jsonify(result)

@app.route('/values', methods=['POST'])
def add_value():
    data = request.json
    result = crud.add_value(
        data['user_id'],
        data['date'],
        data['numeric_value'],
        data['family_id'],
        data['class_id'],
        data['unit_id']
    )
    return jsonify(result)

# Implementa gli altri endpoint per aggiornamento e cancellazione

# Endpoint per gli eventi
@app.route('/events', methods=['GET'])
def get_events():
    user_id = request.args.get('user_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    result = crud.get_events(user_id, start_date, end_date)
    return jsonify(result)

@app.route('/events', methods=['POST'])
def add_event():
    data = request.json
    result = crud.add_event(
        data['user_id'],
        data['date'],
        data['description']
    )
    return jsonify(result)

# Endpoint per i dati di riferimento
@app.route('/families', methods=['GET'])
def get_families():
    result = crud.get_families()
    return jsonify(result)

@app.route('/classes', methods=['GET'])
def get_classes():
    family_id = request.args.get('family_id')
    result = crud.get_classes(family_id)
    return jsonify(result)

@app.route('/units', methods=['GET'])
def get_units():
    result = crud.get_units()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)