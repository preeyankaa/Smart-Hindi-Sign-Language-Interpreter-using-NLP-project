from flask import Flask, render_template, Response, jsonify
import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
import time

app = Flask(__name__)

# Load model and initialize
detector = HandDetector(maxHands=1)
classifier = Classifier("C:/Users/parik/Downloads/WordsDetection/Model1/keras_model.h5", "C:/Users/parik/Downloads/WordsDetection/Model1/labels.txt")

# Labels
labels = ["Bye", "Night", "Afternoon", "Morning", "Eat", "She", "He",
           "Pray", "Work","Study", "Truth", "Small", 
           "Congratulations", "Sleep", "Water","Need", "You",
             "I", "Good", "Hate", "Hello", "Hurts a lot",
          "I Love You", "Love", "Receive", "Thank you",
            "Call Me", "Crime", "Peace", "Happy", "Promise"]

# Hindi translation dictionary
hindi_translation = {
    "Bye": "अलविदा",
    "Night": "रात",
    "Afternoon": "दोपहर",
    "Morning": "सुबह",
    "Eat": "खाना",
    "She": "वह(लड़की)",
    "He": "वह(लड़का)",
    "Pray": "प्रार्थना",
    "Work": "काम",
    "Study": "पढ़ाई",
    "Truth": "सच",
    "Small": "छोटा",
    "Congratulations": "बधाई",
    "Sleep": "सोना",
    "Water": "पानी",
    "Need": "जरूरत",
    "You": "आप",
    "I": "मैं",
    "Good": "अच्छी",
    "Hate": "नफरत",
    "Hello": "नमस्ते",
    "Hurts a lot": "बहुत दर्द होता है",
    "I Love You": "मैं तुमसे प्यार करता हूँ",
    "Love": "प्यार",
    "Receive": "प्राप्त करना",
    "Thank you": "धन्यवाद",
    "Call Me": "मुझे कॉल करें",
    "Crime": "अपराध",
    "Peace": "शांति",
    "Happy": "खुश",
    "Promise": "वादा"
}

# OpenCV VideoCapture
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cap.set(cv2.CAP_PROP_FPS, 30)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

imgSize = 300
offset = 20
last_prediction_time = 0
DEBOUNCE_DELAY = 1.0  # Reduced delay for faster response
last_predicted_label = None
detected_text = ""
detected_hindi = ""

def gen_frames():
    global detected_text, detected_hindi, last_prediction_time, last_predicted_label
    while True:
        success, img = cap.read()
        if not success:
            continue
        
        imgOutput = img.copy()
        hands, img = detector.findHands(img)
        
        if hands:
            hand = hands[0]
            x, y, w, h = hand['bbox']

            imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255

            y_start = max(0, y - offset)
            y_end = min(img.shape[0], y + h + offset)
            x_start = max(0, x - offset)
            x_end = min(img.shape[1], x + w + offset)

            imgCrop = img[y_start:y_end, x_start:x_end]

            if imgCrop.size == 0:
                continue

            aspectRatio = h / w

            if aspectRatio > 1:
                k = imgSize / h
                wCal = math.ceil(k * w)
                imgResize = cv2.resize(imgCrop, (wCal, imgSize))
                wGap = math.ceil((imgSize - wCal) / 2)
                imgWhite[:, wGap:wCal + wGap] = imgResize
            else:
                k = imgSize / w
                hCal = math.ceil(k * h)
                imgResize = cv2.resize(imgCrop, (imgSize, hCal))
                hGap = math.ceil((imgSize - hCal) / 2)
                imgWhite[hGap:hCal + hGap, :] = imgResize

            prediction, index = classifier.getPrediction(imgWhite, draw=False)
            current_time = time.time()

            if current_time - last_prediction_time >= DEBOUNCE_DELAY:
                if prediction[index] > 0.9:  # High confidence threshold
                    current_label = labels[index]
                    if current_label != last_predicted_label:  # Prevent repetition of the same sign
                        detected_text += current_label + " "
                        detected_hindi = " ".join(hindi_translation.get(word, word) for word in detected_text.split())
                        last_predicted_label = current_label
                        last_prediction_time = current_time

        ret, buffer = cv2.imencode('.jpg', imgOutput)
        if ret:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/')
def index():
    return render_template('index_word.html', detected_text=detected_text, detected_hindi=detected_hindi)

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_text')
def get_text():
    return jsonify({
        'text': detected_text,
        'hindi': detected_hindi
    })

@app.route('/clear_text', methods=['POST'])
def clear_text():
    global detected_text, detected_hindi, last_predicted_label
    detected_text = ""
    detected_hindi = ""
    last_predicted_label = None
    return jsonify({'status': 'Cleared'})

@app.route('/add_space', methods=['POST'])
def add_space():
    global detected_text, detected_hindi
    detected_text += " "
    detected_hindi = " ".join(hindi_translation.get(word, word) for word in detected_text.split())
    return jsonify({'status': 'Space added'})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)