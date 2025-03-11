import json
import os

FILE_PATH = "stored_documents.json"

def save_documents(user, documents):
    with open(FILE_PATH, "w") as file:
        json.dump({user: documents}, file)

def load_documents(user):
    try:
        with open(FILE_PATH, "r") as file:
            data = json.load(file)
        return data.get(user, {})
    except (FileNotFoundError, json.JSONDecodeError):
        return {}
