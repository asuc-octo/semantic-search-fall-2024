from pinecone import Pinecone
from transformers import AutoTokenizer, AutoModel
import torch

pc = Pinecone(api_key="...")

index = pc.Index("test")


def getCourses(query, topK):
    # Load the tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained("Xenova/all-MiniLM-L6-v2")
    model = AutoModel.from_pretrained("Xenova/all-MiniLM-L6-v2")

    # Tokenize the query
    inputs = tokenizer(
        query,
        return_tensors="pt",
    )

    # Get the embeddings
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1).squeeze().tolist()

    # Perform the query on the Pinecone index
    results = index.query(embeddings, top_k=topK, include_values=False)

    # Extract the topK results
    courses = [result["id"] for result in results["matches"]]

    return courses
