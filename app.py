from flask import Flask, request, jsonify, render_template
import joblib

app = Flask(__name__)

# Load the trained models
try:
    model = joblib.load('model.pkl')
    vectorizer = joblib.load('vectorizer.pkl')
except Exception as e:
    print(f"Error loading models: {e}")
    model = None
    vectorizer = None

@app.after_request
def add_header(response):
    if request.path.endswith('.css'):
        response.headers['Content-Type'] = 'text/css'
    return response

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or vectorizer is None:
        return jsonify({'error': 'Models are not loaded on the server.'}), 500

    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'Please provide some text to classify.'}), 400
            
        # Vectorize the text
        vectorized_text = vectorizer.transform([text])
        
        # Predict (1 = Spam, 0 = Ham based on the dataset mapping)
        prediction = model.predict(vectorized_text)[0]
        
        is_spam = bool(prediction == 1)
        
        return jsonify({
            'prediction': 'Spam' if is_spam else 'Not Spam',
            'is_spam': is_spam
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
