import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, RotateCcw, Play } from 'lucide-react';

const QuizApp = () => {
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [quizStarted, setQuizStarted] = useState(false);
  const [highScores, setHighScores] = useState([]);

  // Load high scores from memory on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage?.getItem('quizHighScores') || '[]');
    setHighScores(saved);
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      handleTimeUp();
    }
  }, [timeLeft, timerActive]);

  // Fetch questions from Open Trivia DB
  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`
      );
      
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const formattedQuestions = data.results.map((q, index) => ({
          id: index + 1,
          question: decodeHtml(q.question),
          correctAnswer: decodeHtml(q.correct_answer),
          options: shuffleArray([
            decodeHtml(q.correct_answer),
            ...q.incorrect_answers.map(decodeHtml)
          ])
        }));
        setQuestions(formattedQuestions);
        setQuizStarted(true);
        setTimerActive(true);
      } else {
        throw new Error('No questions received');
      }
    } catch (err) {
      setError(`Failed to load questions: ${err.message}`);
      // Fallback to local questions
      loadLocalQuestions();
    } finally {
      setLoading(false);
    }
  };

  // Fallback local questions
  const loadLocalQuestions = () => {
    const localQuestions = [
      {
        id: 1,
        question: "What is the capital of France?",
        correctAnswer: "Paris",
        options: ["London", "Berlin", "Paris", "Madrid"]
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        correctAnswer: "Mars",
        options: ["Venus", "Mars", "Jupiter", "Saturn"]
      },
      {
        id: 3,
        question: "What is 2 + 2?",
        correctAnswer: "4",
        options: ["3", "4", "5", "6"]
      },
      {
        id: 4,
        question: "Who painted the Mona Lisa?",
        correctAnswer: "Leonardo da Vinci",
        options: ["Michelangelo", "Leonardo da Vinci", "Picasso", "Van Gogh"]
      },
      {
        id: 5,
        question: "What is the largest ocean on Earth?",
        correctAnswer: "Pacific Ocean",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"]
      }
    ];
    setQuestions(localQuestions);
    setQuizStarted(true);
    setTimerActive(true);
  };

  // Utility functions
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handler functions
  const handleAnswerSelect = (answer) => {
    if (!timerActive) return;
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;
    
    const newAnswer = {
      questionId: questions[currentQuestionIndex].id,
      question: questions[currentQuestionIndex].question,
      selectedAnswer,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect: selectedAnswer === questions[currentQuestionIndex].correctAnswer
    };
    
    setUserAnswers([...userAnswers, newAnswer]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setTimeLeft(30);
    } else {
      finishQuiz([...userAnswers, newAnswer]);
    }
  };

  const handleTimeUp = () => {
    const newAnswer = {
      questionId: questions[currentQuestionIndex].id,
      question: questions[currentQuestionIndex].question,
      selectedAnswer: selectedAnswer || 'No answer',
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect: false
    };
    
    setUserAnswers([...userAnswers, newAnswer]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setTimeLeft(30);
    } else {
      finishQuiz([...userAnswers, newAnswer]);
    }
  };

  const finishQuiz = (allAnswers) => {
    setTimerActive(false);
    setShowResults(true);
    
    const score = allAnswers.filter(answer => answer.isCorrect).length;
    const newHighScore = {
      score,
      total: questions.length,
      date: new Date().toLocaleDateString(),
      difficulty
    };
    
    const updatedHighScores = [...highScores, newHighScore]
      .sort((a, b) => (b.score / b.total) - (a.score / a.total))
      .slice(0, 5);
    
    setHighScores(updatedHighScores);
    // Store in memory (simulating localStorage)
    try {
      localStorage?.setItem('quizHighScores', JSON.stringify(updatedHighScores));
    } catch (e) {
      // Fallback if localStorage is not available
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setUserAnswers([]);
    setShowResults(false);
    setTimeLeft(30);
    setTimerActive(false);
    setQuizStarted(false);
    setQuestions([]);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const score = userAnswers.filter(answer => answer.isCorrect).length;

  // Start screen
  if (!quizStarted && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 h-screen w-screen">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-10 h-10 text-indigo-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Challenge</h1>
              <p className="text-gray-600 text-lg">Test your knowledge with our interactive quiz!</p>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Difficulty Level
              </label>
              <div className="flex justify-center gap-4 flex-wrap">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      difficulty === level
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {highScores.length > 0 && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">High Scores</h3>
                <div className="space-y-2">
                  {highScores.slice(0, 3).map((score, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {score.date} ({score.difficulty})
                      </span>
                      <span className="font-medium text-gray-800">
                        {score.score}/{score.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700">{error}</p>
                <p className="text-sm text-red-600 mt-1">Falling back to offline questions...</p>
              </div>
            )}

            <button
              onClick={fetchQuestions}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading Quiz...
                </span>
              ) : (
                'Start Quiz'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {percentage >= 70 ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
              <p className="text-2xl font-semibold text-indigo-600">
                You scored {score}/{questions.length} ({percentage}%)
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Your Answers</h2>
              {userAnswers.map((answer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      answer.isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Question {index + 1}: {answer.question}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium text-gray-600">Your answer:</span>{' '}
                          <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {answer.selectedAnswer}
                          </span>
                        </p>
                        {!answer.isCorrect && (
                          <p>
                            <span className="font-medium text-gray-600">Correct answer:</span>{' '}
                            <span className="text-green-700">{answer.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={restartQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-gray-600">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              <span className={`text-xs sm:text-sm font-medium ${
                timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div
              className="bg-indigo-600 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight" 
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}>
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!timerActive}
                  className={`w-full p-3 sm:p-4 text-left border-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                    selectedAnswer === option
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                  } ${!timerActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      selectedAnswer === option
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="break-words">{option}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
              Score: {score}/{currentQuestionIndex}
            </div>
            <button
              onClick={handleNext}
              disabled={!selectedAnswer || !timerActive}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base order-1 sm:order-2"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;