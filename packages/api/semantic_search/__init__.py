from flask import Flask, jsonify, request
import importlib
import os
import random
from waitress import serve
from flask_cors import CORS
import random
from semantic_search.elo import Model, Outcome
import json

app = Flask(__name__)
CORS(app)

loaded_models = {
    # "model_name": model
}

for file in os.listdir("semantic_search/models"):
    if file.endswith(".py"):
        model_name = file.replace(".py", "")
        model = importlib.import_module(f"semantic_search.models.{model_name}")
        loaded_models[model_name] = model

def get_model_results(models, query, topK=5):
    results = []
    for model_name in models:
        courses = loaded_models[model_name].getCourses(query, topK)
        result = {
            "model": model_name,
            "courses": courses
        }
        results.append(result)
    return results

# Routes
@app.route("/models", methods=["GET"])
def get_models():
    return jsonify(list(loaded_models.keys()))

queries = [
    'What are the best courses for learning Python?',
    'computer science',
    'easy english classes',
    'us history',
    'business classes',
]

@app.route("/pick", methods=["GET"])
def pick_models():
    # query = request.args.get("query", type=str)
    query = random.choice(queries)
    if not query:
        return jsonify("Missing query"), 400

    # Select two random models
    model_names = list(loaded_models.keys())
    if len(model_names) < 2:
        return jsonify("Not enough models available to choose from"), 400

    chosen_models = random.sample(model_names, 2)
    results = get_model_results(chosen_models, query)
    results['query'] = query

    return jsonify(results)

@app.route("/compare", methods=["GET"])
def compare_models():
    outcome_map = {
        1: Outcome.WIN,
        2: Outcome.LOSS,
        0: Outcome.TIE,
        -1: Outcome.BOTH_BAD
    }

    # get query, two models, and user's choice
    query = request.args.get("query", type=str)
    model1 = request.args.get("model1", type=str)
    model2 = request.args.get("model2", type=str)
    choice = request.args.get("choice", type=int)
    outcome = outcome_map[choice]

    # append comparison to log.json
    with open('semantic_search/log.json', 'r') as f:
        log = json.load(f)

    log.append({
        'query': query,
        'model1': model1,
        'model2': model2,
        'choice': choice,
    })

    with open('semantic_search/log.json', 'w') as f:
        json.dump(log, f, indent=2)

    # read in current elo scores from scores.json. if its not there, create a new model
    with open(r'semantic_search/scores.json', 'r') as f:
        scores = json.load(f)

    if model1 not in scores:
        model1 = Model(model1)
    else:
        model1 = Model(model1, scores[model1]['elo'])

    if model2 not in scores:
        model2 = Model(model2)
    else:
        model2 = Model(model2, scores[model2]['elo'])

    # update elo scores
    model1.update(model2, outcome)

    scores[model1.name] = {'elo': model1.elo}
    scores[model2.name] = {'elo': model2.elo}
    with open('semantic_search/scores.json', 'w') as f:
        json.dump(scores, f, indent=2)

    return jsonify({
        'model1': model1.name,
        'model2': model2.name,
        'elo1': model1.elo,
        'elo2': model2.elo,
    })

@app.route("/courses", methods=["GET"])
def get_items():
    query = request.args.get("query", type=str)
    input_models = request.args.get("model", type=str)
    topK = request.args.get("topK", default=5, type=int)

    # Check if a query was provided
    if query is None:
        return jsonify("Missing query"), 400

    # Limit topK to 100
    topK = min(topK, 100)

    selected_models = [] if input_models is not None else list(loaded_models.keys())

    # Filter the input models
    if input_models is not None:
        for model_name in input_models.split(","):
            if model_name in loaded_models:
                selected_models.append(model_name)
            else:
                return jsonify(f"Model {model_name} not found"), 400

    results = get_model_results(selected_models, query, topK)

    return jsonify(results)

def dev():
    app.run(port=8000, debug=True)

def prod():
    serve(app, listen="*:8080")
