# 🤝 SignWave - Smart Hindi Sign Language Recognization

Welcome to **SignWave**, a cutting-edge sign language interpreter designed to break communication barriers. This project enables real-time detection of sign language alphabets (A–Z, 1–9) and words in both English and Hindi, with an added feature of 🤖 LLM-based sentence suggestions. Users can form words from detected alphabets and leverage our suite of tools to master Hindi sign language.

---

## 📌 Project Overview

This project was developed as a 1-year academic project during Semester 5 and 6 by our team. It consists of three main components:

- 🧠 **AlphaBetDetection**: Detects individual sign language alphabets (A–Z) and numbers (1–9) in real-time, trained on a dataset of 1000 images per character.
- 💬 **WordsDetection**: Recognizes 30 basic sign language words and uses an LLM to suggest sentences based on detected words.
- 🌐 **Frontend**: Provides an interactive user interface built with modern web technologies.

---

## ✨ Features

- 🔤 **Real-time Alphabet Detection**: Identifies sign language alphabets (A–Z) and numbers (1–9) with support for English and Hindi. Users can form words by combining detected alphabets.
- 🗣️ **Real-time Words Detection**: Recognizes 30 basic sign language words (e.g., "Love", "Thank You") in English and Hindi.
- 🔊 **Voice Icon Support**: Includes voice feedback for detected alphabets, numbers, and words in both English and Hindi.
- 🤖 **LLM-based Sentence Suggestion**: Leverages a language model to suggest sentences in words detection mode, enhancing communication.

---

## 📂 Dataset Details

### 🔡 Alphabet Detection Dataset:
- Covers A–Z (26 alphabets) and 1–9 (9 numbers)
- Each character has approximately 1000 images for training
- Stored in `AlphaBetDetection/images/Data/` (excluded in `.gitignore` due to large size)

### 🧾 Words Detection Dataset:
  - Contains 30 basic words: `Bye`, `Night`, `Afternoon`, `Morning`, `Eat`, `She`, `He`, `Pray`, `Work`, `Study`, `Truth`, `Small`, `Congratulations`, `Sleep`, `Water`, `Need`, `You`, `I`, `Good`, `Hate`, `Hello`, `Hurts a lot`, `I Love You`, `Love`, `Receive`, `Thank you`, `Call Me`, `Crime`, `Peace`, `Happy`, `Promise`.
  - Stored in `WordsDetection/Data/` (excluded in `.gitignore` due to large size).


## 📁 Folder Structure

```
Smart-Hindi-Sign-Language-Interpreter-using-NLP-project/
├── AlphaBetDetection/
│   ├── images/Data/
│   ├── static/
│   ├── templates/
│   ├── .gitignore
│   ├── ISL_classifier.ipynb
│   ├── app.py
│   ├── dataset_keypoint_generation.py
│   ├── ISL_detection.py
│   ├── keypoint.csv
│   ├── requirements.txt
│   └── model.h5
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── .gitattributes
│   ├── .gitignore
│   ├── counter.js
│   ├── index.html
│   ├── javascript.svg
│   ├── main.js
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── style.css
│   └── tailwind.config.js
├── WordsDetection/
│   ├── Data/
│   ├── static/
│   ├── templates/
│   ├── .gitignore
│   ├── app_word.py
│   ├── datacollection.py
│   └── test.py
├── Document/
│   └── Report.pdf
├── Screenshots/
│   ├── Alphabet_image.jpeg
│   ├── Alphbet_detection.jpeg
│   ├── Words_detection.jpeg
│   ├── Words_image.jpeg
│   ├── dashboard.png
│   ├── home_page(dark).png
│   └── home_page.png
└── README.md
```

## ⚙️ Setup Instructions

### 📌 Prerequisites
- 🐍 Python 3.x
- 🌐 Node.js and npm
- 🧾 Git

### 🛠 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/preeyankaa/Smart-Hindi-Sign-Language-Interpreter-using-NLP-project.git
   cd Smart-Hindi-Sign-Language-Interpreter-using-NLP-project
   ```

2. **Set Up AlphaBetDetection and WordsDetection**  
Navigate to each directory:
   ```bash
   cd AlphaBetDetection
   pip install -r requirements.txt
   cd ../WordsDetection
   # Install required packages manually
   pip install tensorflow mediapipe cvzone opencv-contrib-python
   ```

3. **Run the applications:**
   ```bash
   python app.py  # For AlphaBetDetection
   python app_word.py  # For WordsDetection
   ```

4. **Set Up Frontend**  
Navigate to the Frontend directory:
   ```bash
   cd Frontend
   npm install vite react react-dom
   npm run dev
   ```

5. **Configure Environment**  
Ensure all dependencies are installed as per requirements.txt and package.json.  


## 🚀 Usage

- Access the frontend via the browser (as specified by the frontend build).
- Use the webcam to perform real-time sign detection for alphabets (A-Z, 1-9) or words.
- Click the voice icon to hear the detected alphabet, number, or word in English or Hindi.
- View suggested sentences based on detected words or formed words from alphabets, powered by the LLM.


## 🖼 Screenshots
> Note: For privacy reasons, personal faces in some screenshots have been blurred or hidden intentionally.

### 🏠 Home Page (Light Mode)
![Home Page](https://github.com/preeyankaa/Smart-Hindi-Sign-Language-Interpreter-using-NLP-project/blob/master/screenshots/home_page.png)

### 📊 Dashboard
![Dashboard](https://github.com/preeyankaa/Smart-Hindi-Sign-Language-Interpreter-using-NLP-project/blob/master/screenshots/dashboard.png)

### 🧾 Words Detection Output
![Words Detection](https://github.com/preeyankaa/Smart-Hindi-Sign-Language-Interpreter-using-NLP-project/blob/master/screenshots/Words_detection.jpeg)



## 👩‍💻Team

This project was developed as part of our Semester 5 and 6 academic curriculum, spanning 1 year. We are a team of dedicated students passionate about leveraging technology to bridge communication gaps:

- **👩‍💻 [Priyanka Bhandari]** – Worked on Words and Alphabet Detection models along with their UI development.
- **👩‍💻 [Pratik Avhad]** – Responsible for Documentation and assisting in Data Collection and Creation.
- **👩‍💻 [Swarup Kakade]** – Developed the complete Frontend, integrated all modules, and added LLM-based sentence generation feature in Words Detection.


## Contributing

Contributions are welcome!  
Please fork the repository and submit pull requests for any enhancements or bug fixes.


## 📄 License

© 2025 **SignWave**. All rights reserved.


## 📬 Contact

For any queries, reach out to **priyaka.224657201@vcet.edu.in**.
