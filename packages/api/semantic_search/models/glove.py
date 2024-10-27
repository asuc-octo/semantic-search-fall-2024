import re
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import gdown
import os


def get_glove_embedding(text, embedding_dict, vector_size=100):
    embeddings = [embedding_dict[word] for word in text if word in embedding_dict]

    if embeddings:
        return np.mean(embeddings, axis=0)

    return np.zeros(vector_size)


if not (os.path.exists("semantic_search/models/models/embeddings_dictionary.pkl")):
    url = "https://drive.google.com/uc?id=1mnp3BjK7lcnRepXsRwRwR-1ILrdnkqxU"
    output = "semantic_search/models/models/embeddings_dictionary.pkl"
    gdown.download(url, output, quiet=False)

if not (os.path.exists("semantic_search/models/models/glove_embeddings.pkl")):
    url = "https://drive.google.com/uc?id=1S_aXOiDScNgNArsIgu9xWzmXQo9q-0RC"
    output = "semantic_search/models/models/glove_embeddings.pkl"
    gdown.download(url, output, quiet=False)

courses = pd.read_pickle("semantic_search/models/models/glove_embeddings.pkl")

embeddings_dictionary = pickle.load(
    open("semantic_search/models/models/embeddings_dictionary.pkl", "rb")
)


# Function to retrieve top K courses from Pinecone based on GloVe similarity
def getCourses(query: str, topK: int):
    query_processed = re.sub(r"[^a-z0-9\s]", "", query.lower()).split()

    query_embedding = get_glove_embedding(
        query_processed, embeddings_dictionary
    ).reshape(1, -1)

    courses["similarity"] = cosine_similarity(
        courses["embedding"].tolist(), query_embedding
    ).flatten()

    top_courses = courses.sort_values("similarity", ascending=False).head(topK)

    return top_courses[["subject", "number"]].to_dict("records")
