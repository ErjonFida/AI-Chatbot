from flask import Flask, request, jsonify, render_template
from model import llama_response
import time

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def index():
    return render_template('index.html')



@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Missing message"}), 400

    system_prompt = "You are an AI assistant helping with customer inquiries. Provide a helpful and concise response."

    start_time = time.time()
    try:
        result = llama_response(system_prompt, user_message)
        
        result['duration'] = time.time() - start_time
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # This is where we'll add our AI logic later
    #return jsonify({"message": "AI response will be generated here"})

if __name__ == '__main__':
    app.run(debug=True)