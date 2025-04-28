import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
from tensorflow.keras.models import load_model

# Load model
model_path = "C:/Users/parik/Downloads/WordsDetection/Model1/keras_model.h5"
labels_path = "C:/Users/parik/Downloads/WordsDetection/Model1/labels.txt"
model = load_model(model_path)
print("✅ Model loaded successfully!")

# Try all camera indexes until one works
cap = None
for i in range(4):
    temp_cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)  # CAP_DSHOW is for Windows
    if temp_cap.isOpened():
        cap = temp_cap
        print(f"✅ Camera opened at index {i}")
        break
if cap is None:
    print("❌ No working camera found.")
    exit()

# Initialize modules
detector = HandDetector(maxHands=1)
classifier = Classifier(model_path, labels_path)

# Settings
imgSize = 300
offset = 20

# Labels
labels = ["Bye", "Night", "Afternoon", "Morning", "Eat", "She", "He", "Pray", "Work",
          "Study", "Truth", "Small", "Congratulations", "Sleep", "Water", "Need", "You",
          "I", "Good", "Hate", "Hello", "Hurts a lot", "I Love You", "Love", "Receive",
          "Thank you", "Call Me", "Crime", "Peace", "Happy", "Promise"]

while True:
    success, img = cap.read()
    if not success:
        print("❌ Error: Could not read image from camera.")
        continue

    imgOutput = img.copy()
    hands, img = detector.findHands(img)

    if hands:
        hand = hands[0]
        x, y, w, h = hand['bbox']
        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255

        # Crop with offset and boundaries
        y_start = max(0, y - offset)
        y_end = min(img.shape[0], y + h + offset)
        x_start = max(0, x - offset)
        x_end = min(img.shape[1], x + w + offset)
        imgCrop = img[y_start:y_end, x_start:x_end]

        if imgCrop.size == 0:
            print("⚠️ Skipped: Empty imgCrop")
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

        # Draw predictions
        cv2.rectangle(imgOutput, (x - offset, y - offset - 70), (x + 400, y - offset - 20), (0, 255, 0), cv2.FILLED)
        cv2.putText(imgOutput, labels[index], (x, y - 30), cv2.FONT_HERSHEY_COMPLEX, 2, (0, 0, 0), 2)
        cv2.rectangle(imgOutput, (x - offset, y - offset), (x + w + offset, y + h + offset), (0, 255, 0), 4)

        # Show cropped and white images
        cv2.imshow('ImageCrop', imgCrop)
        cv2.imshow('ImageWhite', imgWhite)

    cv2.imshow('Image', imgOutput)

    # Exit with 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Clean exit
cap.release()
cv2.destroyAllWindows()
