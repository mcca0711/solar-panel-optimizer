from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__, template_folder='../frontend', static_folder='../static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    location = data.get('location', '')
    
    # Simple, random selection logic for solar panel outlook
    outlook = determine_solar_outlook(location)
    
    return jsonify({
        'location': location,
        'outlook': outlook
    })

def determine_solar_outlook(location):
    # This is a placeholder function that uses simple logic and randomness
    # to determine the solar panel outlook.
    
    # Use the first character of the location string to seed the random number generator
    # This ensures that the same location always gets the same result
    seed = ord(location[0].lower()) if location else 0
    random.seed(seed)
    
    # Generate a random number between 0 and 1
    rand_val = random.random()
    
    # Determine outlook based on the random value
    if rand_val < 0.33:
        return 'low'
    elif rand_val < 0.66:
        return 'moderate'
    else:
        return 'high'

if __name__ == '__main__':
    app.run(debug=True)
