from flask import Flask, render_template, Response, jsonify
import cv2
import numpy as np
import copy
import itertools
import string
import pandas as pd
import mediapipe as mp
import tensorflow as tf
import threading
import queue
import time

app = Flask(__name__)

# Load the model
model = tf.keras.models.load_model('model.h5')

# MediaPipe setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Initialize MediaPipe Hands with strict settings
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    model_complexity=1,
    min_detection_confidence=0.8,    # Increased for better accuracy
    min_tracking_confidence=0.8      # Increased for better accuracy
)

# Alphabet mapping
alphabet = ['1','2','3','4','5','6','7','8','9']
alphabet += list(string.ascii_uppercase)

# Hindi translation dictionary
hindi_translation = {
    # Digits → Hindi words
    '1': 'एक',
    '2': 'दो',
    '3': 'तीन',
    '4': 'चार',
    '5': 'पाँच',
    '6': 'छह',
    '7': 'सात',
    '8': 'आठ',
    '9': 'नौ',

    # Upper‑case letters → Hindi letter‑names
    'A': 'ए',
    'B': 'बी',
    'C': 'सी',
    'D': 'डी',
    'E': 'ई',
    'F': 'एफ़',
    'G': 'जी',
    'H': 'एच्च',
    'I': 'आई',
    'J': 'जे',
    'K': 'के',
    'L': 'एल',
    'M': 'एम',
    'N': 'एन',
    'O': 'ओ',
    'P': 'पी',
    'Q': 'क्यू',
    'R': 'आर',
    'S': 'एस',
    'T': 'टी',
    'U': 'यू',
    'V': 'वी',
    'W': 'डबल्यू',
    'X': 'एक्स',
    'Y': 'वाय',
    'Z': 'ज़ेड',

    # Space
    ' ': ' '
}

# OpenCV VideoCapture
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cap.set(cv2.CAP_PROP_FPS, 30)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

# Detection variables
last_prediction_time = 0
DEBOUNCE_DELAY = 2.0  # Increased delay for more accurate detection
last_predicted_label = None
prediction_confidence_threshold = 0.90  # Very high confidence required
consecutive_same_predictions = 0
REQUIRED_CONSECUTIVE_PREDICTIONS = 4  # Need more consecutive predictions
last_added_text = None

def calc_landmark_list(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]
    landmark_point = []
    for _, landmark in enumerate(landmarks.landmark):
        landmark_x = min(int(landmark.x * image_width), image_width - 1)
        landmark_y = min(int(landmark.y * image_height), image_height - 1)
        landmark_point.append([landmark_x, landmark_y])
    return landmark_point

def pre_process_landmark(landmark_list):
    temp_landmark_list = copy.deepcopy(landmark_list)
    base_x, base_y = temp_landmark_list[0][0], temp_landmark_list[0][1]
    for index, point in enumerate(temp_landmark_list):
        temp_landmark_list[index][0] -= base_x
        temp_landmark_list[index][1] -= base_y
    temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))
    max_value = max(list(map(abs, temp_landmark_list))) or 1
    temp_landmark_list = [n / max_value for n in temp_landmark_list]
    return temp_landmark_list

def translate_to_hindi(text):
    translated = []
    for char in text:
        translated.append(hindi_translation.get(char, char))
    return ''.join(translated)

def process_frame(frame):
    global detected_text, last_prediction_time, last_predicted_label, consecutive_same_predictions, last_added_text
    
    if frame is None:
        return frame

    current_time = time.time()
    
    # Convert to RGB for MediaPipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)
    
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw landmarks
            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style()
            )
            
            # Only predict if enough time has passed
            if current_time - last_prediction_time >= DEBOUNCE_DELAY:
                landmark_list = calc_landmark_list(frame, hand_landmarks)
                if len(landmark_list) == 21:
                    pre_processed = pre_process_landmark(landmark_list)
                    df = pd.DataFrame([pre_processed])
                    try:
                        predictions = model.predict(df, verbose=0)
                        max_confidence = np.max(predictions)
                        predicted_class = np.argmax(predictions)
                        current_prediction = alphabet[predicted_class]
                        
                        # Check for high confidence prediction
                        if max_confidence >= prediction_confidence_threshold:
                            if current_prediction == last_predicted_label:
                                consecutive_same_predictions += 1
                            else:
                                consecutive_same_predictions = 1
                                last_predicted_label = current_prediction
                            
                            # Add prediction if we have enough consecutive matches
                            if consecutive_same_predictions >= REQUIRED_CONSECUTIVE_PREDICTIONS:
                                if current_prediction != last_added_text:  # Prevent repetition
                                    detected_text += current_prediction + " "
                                    last_added_text = current_prediction
                                    last_prediction_time = current_time
                                consecutive_same_predictions = 0
                                
                    except Exception as e:
                        print(f"Prediction error: {e}")
    else:
        # Reset prediction tracking if no hand detected
        consecutive_same_predictions = 0
        last_predicted_label = None
    
    return frame

def gen_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
            
        frame = cv2.flip(frame, 1)
        processed_frame = process_frame(frame)
        
        if processed_frame is not None:
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            if ret:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

# Global variables
detected_text = ""
hindi_text = ""

@app.route('/')
def index():
    return render_template('index.html', detected_text=detected_text, hindi_text=hindi_text)

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_text')
def get_text():
    global detected_text, hindi_text
    hindi_text = translate_to_hindi(detected_text)
    return jsonify({
        'text': detected_text,
        'hindi': hindi_text
    })

@app.route('/clear_text', methods=['POST'])
def clear_text():
    global detected_text, hindi_text, last_predicted_label, consecutive_same_predictions, last_added_text
    detected_text = ""
    hindi_text = ""
    last_predicted_label = None
    consecutive_same_predictions = 0
    last_added_text = None
    return jsonify({'status': 'Cleared'})

@app.route('/add_space', methods=['POST'])
def add_space():
    global detected_text, hindi_text
    detected_text += " "
    hindi_text = translate_to_hindi(detected_text)
    return jsonify({'status': 'Space added'})

# @app.route('/quit', methods=['POST'])
# def quit():
#     cap.release()
#     cv2.destroyAllWindows()
#     return jsonify({'status': 'Quit'})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)

@app.route('/alphabet-detection')
def alphabet_detection():
    return render_template('index.html', detected_text=detected_text, hindi_text=hindi_text)


from flask_cors import CORS
app = Flask(__name__)
CORS(app)