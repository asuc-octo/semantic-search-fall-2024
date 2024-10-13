from flask import Flask, jsonify, request

app = Flask(__name__)

# Models
models = ["model1", "model2"]
# TODO: Dyanmically import modules from models folder


# Routes
@app.route("/models", methods=["GET"])
def get_models():
    return jsonify(models)


@app.route("/courses", methods=["GET"])
def get_items():
    query = request.args.get("query", type=str)
    model = request.args.get("model", type=str)
    topK = request.args.get("topK", default=5, type=int)

    # Check if a valid model was provided
    if model not in models:
        return jsonify("Invalid model"), 400

    # Check if a query was provided
    if query is None:
        return jsonify("Missing query"), 400

    # Limit topK to 100
    topK = min(topK, 100)

    # TODO: Call the model to get the results

    return jsonify(None)


if __name__ == "__main__":
    app.run(debug=True)
