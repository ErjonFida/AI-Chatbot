# GenAI Flask App

A lightweight, local Generative AI chatbot built with Python (Flask) on the backend and an embedded React frontend.

## Features
- **Local AI execution**: Powered by a locally installed Llama 3.2 model via `langchain-ollama` and `Ollama`.
- **JSON Structured Output**: Uses `pydantic` and `langchain` prompt templates to strictly format the AI responses as JSON objects before parsing them.
- **Modern React Frontend**: The interactive chat UI is built using React components (handled via in-browser Babel transpilation), featuring an auto-scaling text area, real-time message history, and UI loading states.

## Requirements
Ensure you have the following installed:
1. **Ollama**: Must be running locally with the `llama3.2` model downloaded (`ollama pull llama3.2`).
2. **Python Dependencies**:
   ```bash
   pip install flask langchain langchain-ollama pydantic
   ```

## Getting Started
1. Start the Flask development server:
   ```bash
   python app.py
   ```
2. Open your web browser and navigate to the local server address (usually `http://127.0.0.1:5000`).

## Project Structure
- `app.py`: The main Flask routing server handling the `/generate` endpoint.
- `model.py`: Connects to `ChatOllama` using LangChain to invoke the model.
- `templates/index.html`: The main structural layout injecting React + Babel.
- `static/script.js`: The React components representing the Chat interface (`ChatApp`).
- `static/styles.css`: Styling for the interface using the IBM Plex Sans font.
