# Quiz App

## 📌 Project Description
This is a responsive, single-page **Quiz Application** built with **React + Vite**, styled using **Tailwind CSS**.  
The app assesses front-end fundamentals by demonstrating **state management, API integration, and a clean, user-friendly interface**.

The application presents multiple-choice questions fetched from the **Open Trivia Database API**, tracks the user's score, and displays a summary of the results at the end.  
It also includes a **timer for each question** and a **persistent high-score feature**.

---

## ✨ Features
- **Quiz Page**: Displays one question at a time with four shuffled answer options.  
- **API Integration**: Fetches questions dynamically from the Open Trivia DB API (with local fallback for offline use).  
- **Responsive UI**: Clean and modern layout for both desktop and mobile devices.  
- **State Management**: Uses React hooks (`useState`, `useEffect`) to manage quiz flow.  
- **Scoring & Results**: Tracks correct answers and shows a final score summary with review.  
- **Timer**: 30-second timer per question (auto-locks when time runs out).  
- **Difficulty Levels**: Choose between easy, medium, and hard.  
- **High Scores**: Persists top 5 scores in browser local storage.  
- **Restart**: "Take Quiz Again" button to restart and attempt a new challenge.  

---

## 🚀 How to Run the Project Locally

### 🔹 Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)  
- npm (comes with Node.js)  

### 🔹 Installation
Clone the repository:
```bash
git clone https://github.com/sourav-pandey-dev/my-quiz-app.git

Navigate into the project folder:

cd my-quiz-app

Install required dependencies:
npm install
Install Tailwind CSS dependencies:


npm install -D tailwindcss@3.4.17 postcss autoprefixer
Initialize Tailwind configuration:


npx tailwindcss init -p
Update your tailwind.config.js to scan source files:

js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
Add Tailwind directives to your main CSS file (src/index.css):

css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
🔹 Running the App
Start the development server:

bash
npm run dev
Open the app in your browser:
👉 http://localhost:5173

📷 Screenshots (Optional)
Add some UI screenshots here once the app runs locally.

📄 License
This project is licensed under the MIT License.
Feel free to use and modify it for your own purposes.

