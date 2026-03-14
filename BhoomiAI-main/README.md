🌾 BhoomiAI

AI-Powered Smart Agriculture Platform

BhoomiAI is an intelligent agriculture decision-support platform built using Artificial Intelligence, Machine Learning, and multilingual conversational assistance. It empowers farmers and users to make data-driven crop decisions through AI advisory, disease detection, and digital twin simulation technology.

---

🚀 Live Deployment
🌐 Frontend (User Interface)

👉 https://bhoomi-frontend.onrender.com

🔗 Backend API

👉 https://bhoomi-backend-7hlj.onrender.com

---

🎯 Core Features

🤖 AI Agriculture Expert (Powered by Ollama)

Intelligent farming advisory system

AI-generated agricultural recommendations

Context-aware soil and crop analysis

Multilingual support (English, Hindi, Telugu)

Uses locally hosted Ollama model for AI generation (development mode)

🛰 Digital Twin Simulation

Simulated crop decision preview

Explore different farming scenarios

Smart planning support before real-world implementation

🌱 Crop Disease Detection

Image-based tomato leaf disease detection

Supports detection of:

Tomato Target Spot

Tomato Mosaic Virus

Tomato Yellow Leaf Curl Virus

Healthy Leaf Classification

Confidence score output

Smart recommendation rotation system

Simulation fallback mode if ML model is unavailable

---

🛠️ Technology Stack

🖥 Frontend

React (Vite)

Tailwind CSS

JavaScript (ES6+)

Responsive UI Design

⚙ Backend

Python

Flask

Flask-CORS

Gunicorn (Production Server)

Deep Translator (Multilingual Support)

Ollama (AI Advisory Logic)

TensorFlow / Keras (ML Model Loading)

NumPy

Scikit-Learn

☁ Deployment

Render (Static Site – Frontend)

Render (Web Service – Backend)

---

🔥 Ollama Integration

🔹 Local Development

Ollama is used for AI-based text generation

Model: llama3.2:1b

Generates intelligent agriculture advisory responses

🔹 Production Deployment (Render)

Ollama is conditionally disabled

Application remains stable without runtime crashes

Clean fallback messages are returned when AI is unavailable


This hybrid approach ensures:

Full AI capabilities during development

Production-safe deployment without system failure
