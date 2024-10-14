from flask import Flask, jsonify, request
import importlib
import os
from waitress import serve

app = Flask(__name__)

loaded_models = {
    # "model_name": model
}

for file in os.listdir("semantic_search/models"):
    if file.endswith(".py"):
        model_name = file.replace(".py", "")
        model = importlib.import_module(f"semantic_search.models.{model_name}")
        loaded_models[model_name] = model


# Routes
@app.route("/models", methods=["GET"])
def get_models():
    return jsonify(list(loaded_models.keys()))


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

    results = []

    for model_name in selected_models:
        result = {
            "model": model_name,
            "courses": loaded_models[model_name].getCourses(query, topK),
        }

        results.append(result)

    return jsonify(results)


def dev():
    app.run(debug=True)


def prod():
    serve(app, listen="*:8080")
