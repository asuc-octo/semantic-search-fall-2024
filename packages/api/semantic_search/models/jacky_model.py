import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

with open("semantic_search/models/jacky_course_metadata.json", "r") as f:
    courses = json.load(f)

# course_texts = []
# for course in courses:
#     text = f"{course.get('title', '')} {course.get('description', '')}"
#     course_texts.append(text)

model = SentenceTransformer("all-mpnet-base-v2")
# course_embeddings = model.encode(course_texts, convert_to_tensor=False)
# course_embeddings = np.array(course_embeddings).astype("float32")

# embedding_dim = course_embeddings.shape[1]
# index = faiss.IndexFlatIP(embedding_dim)
# faiss.normalize_L2(course_embeddings)
# index.add(course_embeddings)
# faiss.write_index(index, 'courses.index')
index = faiss.read_index("semantic_search/models/jacky_index.index")


def getCourses(query: str, topK: int):
    query_embedding = model.encode([query], convert_to_tensor=False)
    query_embedding = np.array(query_embedding).astype("float32")

    faiss.normalize_L2(query_embedding)

    distances, indices = index.search(query_embedding, topK)

    results = []

    for dist, idx in zip(distances[0], indices[0]):
        course = courses[idx]

        print(course)

        result = {
            "subject": course.get("subject", ""),
            "number": course.get("number", ""),
            "score": float(dist),
        }

        results.append(result)

    return results
