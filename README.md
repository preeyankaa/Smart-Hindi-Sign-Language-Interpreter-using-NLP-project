# SignWave - Smart Hindi Sign Language Interpreter using NLP

Welcome to **SignWave**, a cutting-edge 3D sign language interpreter designed to break communication barriers. This project enables real-time detection of sign language alphabets (A-Z, 1-9) and words in both English and Hindi, with an added feature of LLM-based sentence suggestions. Users can form words from detected alphabets and leverage our suite of tools to master Hindi sign language.

## Project Overview

This project was developed as a 1-year academic project during Semester 5 and 6 by a team of students. It consists of three main components:

- **AlphaBetDetection**: Detects individual sign language alphabets (A-Z) and numbers (1-9) in real-time, trained on a dataset of 1000 images per character.
- **WordsDetection**: Recognizes 30 basic sign language words and uses an LLM to suggest sentences based on detected words.
- **Frontend**: Provides an interactive user interface built with modern web technologies.

## Features

- **Real-time Alphabet Detection**: Identifies sign language alphabets (A-Z) and numbers (1-9) with support for English and Hindi. Users can form words by combining detected alphabets.
- **Real-time Words Detection**: Recognizes 30 basic sign language words (e.g., "Love", "Thank You") in English and Hindi.
- **Voice Icon Support**: Includes voice feedback for detected alphabets, numbers, and words in both English and Hindi.
- **LLM-based Sentence Suggestion**: Leverages a language model to suggest sentences in both alphabet and words detection modes, enhancing communication.

## Dataset Details

- **Alphabet Detection Dataset**:
  - Covers A-Z (26 alphabets) and 1-9 (9 numbers).
  - Each character has approximately 1000 images for training.
  - Stored in `AlphaBetDetection/images/Data/` (excluded in `.gitignore` due to large size).

- **Words Detection Dataset**:
  - Contains 30 basic words: `Bye`, `Night`, `Afternoon`, `Morning`, `Eat`, `She`, `He`, `Pray`, `Work`, `Study`, `Truth`, `Small`, `Congratulations`, `Sleep`, `Water`, `Need`, `You`, `I`, `Good`, `Hate`, `Hello`, `Hurts a lot`, `I Love You`, `Love`, `Receive`, `Thank you`, `Call Me`, `Crime`, `Peace`, `Happy`, `Promise`.
  - Stored in `WordsDetection/Data/` (excluded in `.gitignore` due to large size).

### Prerequisites
- Python 3.x
- Node.js and npm
- Git

### Installation
