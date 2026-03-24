from langchain.prompts import PromptTemplate
#from config import PARAMETERS, LLAMA_MODEL_ID
from langchain_ollama import ChatOllama
from pydantic import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser

def initialize_model(model_id):
    return ChatOllama(model=model_id, format='json')

class ai_response(BaseModel):
    summary: str = Field(description="Summmary of the user's message")
    sentiment: str = Field(description= "Sentiment score from 0 (negative) to 100 (positive)")
    response: str = Field(description="Suggested response to the user")

json_parser = JsonOutputParser(pydantic_object = ai_response)

llama_template = PromptTemplate(
    template = '''<|begin_of_text|>
    <|start_header_id|>system<|end_header_id|>
    {system_prompt}
    {format_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>
    {user_prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
    ''',
    input_variables = ["system_prompt", "user_prompt", "format_prompt"]
)


def get_custom_format_instructions(pydantic_cls):
    schema = pydantic_cls.schema()
    keys_desc = "\n".join([f'- "{k}" ({v.get("description", "")})' for k, v in schema["properties"].items()])
    return f"Please output your response STRICTLY as a JSON object with EXACTLY these keys:\n{keys_desc}\nDO NOT output anything else. Just the JSON object."

def get_ai_response(model, template, system_prompt, user_prompt):
    chain = template | model | json_parser
    custom_format = get_custom_format_instructions(ai_response)
    return chain.invoke({'system_prompt':system_prompt,
    'user_prompt':user_prompt, 'format_prompt': custom_format})

local_llama = initialize_model('llama3.2')

def llama_response(system_prompt, user_prompt):
    return get_ai_response(local_llama, llama_template, system_prompt, user_prompt)