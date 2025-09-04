Quiz App
Project Description
This is a responsive, single-page quiz application built with React and Vite, and styled using Tailwind CSS. The app assesses front-end fundamentals by demonstrating state management, API integration, and a clean, user-friendly interface.

The application presents a series of multiple-choice questions fetched from the Open Trivia Database API, tracks the user's score, and displays a summary of the results at the end. It also includes a timer for each question and a persistent high-score feature.

Features
Quiz Page: Displays one question at a time with four shuffled answer options.

API Integration: Fetches questions dynamically from the Open Trivia DB API. Includes a local fallback for offline use.

Responsive UI: A clean and modern layout that works seamlessly on both desktop and mobile devices.

State Management: Uses React hooks (useState, useEffect) to manage the quiz flow, from questions to results.

Scoring & Results: Tracks correct answers and displays a final score summary, including a review of all answered questions.

Timer: A 30-second timer for each question. The answer is locked in when the time runs out.

Difficulty Levels: Users can select between easy, medium, and hard difficulty levels.

High Scores: Persists the top 5 scores in the browser's local storage.

Restart: A "Take Quiz Again" button to easily restart the quiz and attempt a new challenge.

How to Run the Project Locally
Follow these steps to get the quiz app up and running on your local machine.

Prerequisites
Node.js (version 14 or higher recommended)

npm (comes with Node.js)

Installation
Clone the repository to your local machine:

git clone [https://github.com/sourav-pandey-dev/my-quiz-app.git](https://github.com/sourav-pandey-dev/my-quiz-app.git)


Navigate into the project directory:

cd my-quiz-app


Install the required dependencies:

npm install


Install the necessary Tailwind CSS dependencies:

npm install -D tailwindcss@3.4.17 postcss autoprefixer


Initialize the Tailwind CSS configuration files:

npx tailwindcss init -p


Ensure your tailwind.config.js file is configured to scan your source files:

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


Add the Tailwind directives to your main CSS file (src/index.css):

/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;


Running the App
Once all dependencies are installed and configured, you can start the development server:

npm run dev


The app will be available in your browser at http://localhost:5173.