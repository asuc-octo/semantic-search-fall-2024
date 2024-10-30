from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import dotenv_values

config = dotenv_values(".env")

pc = Pinecone(api_key=config["PINECONE_API_KEY"])

index = pc.Index("test")

model = SentenceTransformer("all-MiniLM-L6-v2")


def getCourses(query: str, topK: int):
    try:
        # Tokenize the query
        vector = model.encode(
            query,
            normalize_embeddings=True,
        )

        # Perform the query on the Pinecone index
        results = index.query(vector=vector.tolist(), top_k=topK, include_values=False)

        courses = []

        for match in results["matches"]:
            identifiers = match["id"].split()

            course = {
                "subject": " ".join(identifiers[:-1]),
                "number": identifiers[-1],
                "score": match["score"],
            }

            courses.append(course)

        return courses
    except Exception as e:
        print(e)

        return []
