import os
import faiss
import json
import torch
from transformers import BertTokenizer, BertModel
import numpy as np

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

index = faiss.read_index('semantic_search/models/subhash_course_faiss_index.index')

with open('semantic_search/models/subhash_course_metadata.json', 'r') as f:
    courses = json.load(f)

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')# .to('cuda' if torch.cuda.is_available() else 'cpu')

# Function to get embeddings for query
def get_embeddings(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True).to('cuda' if torch.cuda.is_available() else 'cpu')
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze()

# Function to search courses and return them in the specified format
def getCourses(query: str, topK: int):
    try:
        query_embedding = get_embeddings(query).cpu().numpy().reshape(1, -1)

        distances, indices = index.search(query_embedding, topK)

        results = []
        for idx, dist in zip(indices[0], distances[0]):
            course = courses[idx]
            
            course_result = {
                "subject": course["subject"],  # Access subject
                "number": course["number"],    # Access number
                "score": float(dist),          # FAISS distance as score
            }
            results.append(course_result)

        return results
    except Exception as e:
        print(e)
        return []

# Example query
user_query = "find me courses that are at the intersection of computer science and marine biology"
matched_courses = getCourses(user_query, topK=5)

for course in matched_courses:
    print(course)
