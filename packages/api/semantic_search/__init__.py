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

# TODO: Load queries from a file
queries = [
    "What are the best courses for learning Python?",
    "computer science",
    "easy english classes",
    "us history",
    "business classes",
]

# Load all models
loaded_models = {
    # "model_name": model
}

for file in os.listdir("semantic_search/models"):
    if file.endswith(".py"):
        model_name = file.replace(".py", "")
        model = importlib.import_module(f"semantic_search.models.{model_name}")
        loaded_models[model_name] = model


# Query models
def get_model_results(models, query, topK=5):
    results = []

    for model_name in models:
        courses = loaded_models[model_name].getCourses(query, topK)
        result = {"model": model_name, "courses": courses}
        results.append(result)

    return {"results": results, "query": query}


# Routes
@app.route("/models", methods=["GET"])
def get_models():
    return jsonify(list(loaded_models.keys()))


@app.route("/sample", methods=["GET"])
def pick_models():
    # Select a random query
    query = random.choice(queries)

    if not query:
        return jsonify("No queries available"), 400

    # Select two random models
    model_names = list(loaded_models.keys())

    if len(model_names) < 2:
        return jsonify("Less than two models available"), 400

    chosen_models = random.sample(model_names, 2)

    # Get results for the query
    results = get_model_results(chosen_models, query)

    return jsonify(results)


outcomes = {
    1: Outcome.WIN,
    2: Outcome.LOSS,
    0: Outcome.TIE,
    -1: Outcome.BOTH_BAD,
}


@app.route("/outcome", methods=["GET"])
def compare_models():
    query = request.args.get("query", type=str)
    model1 = request.args.get("firstModel", type=str)
    model2 = request.args.get("secondModel", type=str)
    choice = request.args.get("choice", type=int)

    if query is None or model1 is None or model2 is None or choice is None:
        return jsonify("Missing parameters"), 400

    outcome = outcomes[choice]

    # Log the comparison
    with open("semantic_search/log.json", "r") as file:
        log = json.load(file)

    log.append(
        {
            "query": query,
            "model1": model1,
            "model2": model2,
            "choice": choice,
        }
    )

    with open("semantic_search/log.json", "w") as file:
        json.dump(log, file, indent=2)

    # Update the ELO for each model
    with open(r"semantic_search/scores.json", "r") as file:
        scores = json.load(file)

    if model1 not in scores:
        model1 = Model(model1)
    else:
        model1 = Model(model1, scores[model1]["elo"])

    if model2 not in scores:
        model2 = Model(model2)
    else:
        model2 = Model(model2, scores[model2]["elo"])

    model1.update(model2, outcome)

    scores[model1.name] = {"elo": model1.elo}
    scores[model2.name] = {"elo": model2.elo}

    with open("semantic_search/scores.json", "w") as f:
        json.dump(scores, f, indent=2)

    # Return the updated ELO for each model
    return jsonify(
        [
            {
                "model": model1.name,
                "elo": model1.elo,
            },
            {
                "model": model2.name,
                "elo": model2.elo,
            },
        ]
    )


@app.route("/courses", methods=["GET"])
def get_items():
    query = request.args.get("query", type=str)
    input_models = request.args.get("model", type=str)
    topK = request.args.get("topK", default=5, type=int)

    if query is None:
        return jsonify("Missing query"), 400

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
