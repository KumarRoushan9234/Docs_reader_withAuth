from langchain.chat_models import init_chat_model

def init_chat_model(model_id, model_provider):
    return init_chat_model(model_id, model_provider=model_provider)
