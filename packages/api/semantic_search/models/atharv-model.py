import os
import faiss
import json
from sentence_transformers import SentenceTransformer

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

index = faiss.read_index("semantic_search/models/atharv-naidu-index.index")

with open("semantic_search/models/atharv-naidu-metadata.json", "r") as f:
    courses = json.load(f)

# Load the SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")


# Function to get embeddings for query
def get_embeddings(text):
    return model.encode(text, convert_to_tensor=True).cpu().numpy().reshape(1, -1)


# Function to search courses and return them in the specified format
def getCourses(query: str, topK: int):
    query_embedding = get_embeddings(query)
    print(f"Query embedding shape: {query_embedding.shape}")
    print(f"FAISS index embedding dimension: {index.d}")

    distances, indices = index.search(query_embedding, topK)

    results = []
    for idx, dist in zip(indices[0], distances[0]):
        course = courses[idx]

        course_result = {
            "subject": course["subject"],
            "number": course["number"],
            "score": float(dist),
        }
        results.append(course_result)

    return results
