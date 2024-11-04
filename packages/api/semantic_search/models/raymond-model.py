import faiss
import json
from sentence_transformers import SentenceTransformer

index = faiss.read_index("semantic_search/models/raymond_index_file.index")

with open("semantic_search/models/raymond_course_metadata.json", "r") as f:
    courses = json.load(f)

courses = courses["data"]["courseList"]

model = SentenceTransformer("paraphrase-mpnet-base-v2")


def getCourses(query: str, topK: int):
    try:
        embedding = (
            model.encode(query, convert_to_tensor=True).cpu().numpy().reshape(1, -1)
        )

        distances, indices = index.search(embedding, topK)

        course_results = []

        for idx, dist in zip(indices[0], distances[0]):
            course = courses[idx]

            course_result = {
                "subject": course["subject"],
                "number": course["number"],
                "score": float(dist),
            }

            course_results.append(course_result)

        return course_results
    except Exception as e:
        print(e)
        return []
