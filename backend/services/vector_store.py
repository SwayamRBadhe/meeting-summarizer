import chromadb
from sentence_transformers import SentenceTransformer

# Load embedding model once
# This converts text to vectors (numbers)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Create ChromaDB client
# This stores our vectors locally in a folder
client = chromadb.PersistentClient(path="./chroma_db")

def store_in_chromadb(session_id: str, sentences: list, classified: list):
    """
    Convert sentences to vectors and store in ChromaDB
    """
    # Create a collection for this session
    collection = client.get_or_create_collection(
        name=f"session_{session_id}"
    )

    # Generate embeddings for all sentences
    embeddings = model.encode(sentences).tolist()

    # Store in ChromaDB
    collection.add(
        documents=sentences,
        embeddings=embeddings,
        metadatas=[{"label": c["label"]} for c in classified],
        ids=[f"seg_{i}" for i in range(len(sentences))]
    )

    return collection


def search_chromadb(session_id: str, query: str, n_results: int = 3):
    """
    Search for most relevant sentences for a query
    """
    # Get the collection for this session
    collection = client.get_or_create_collection(
        name=f"session_{session_id}"
    )

    # Convert query to vector
    query_embedding = model.encode([query]).tolist()

    # Search for similar sentences
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=n_results
    )

    return results["documents"][0]