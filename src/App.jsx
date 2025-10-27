import React, { useState, useRef } from "react";

export default function HiraganaQuizApp() {
  const [screen, setScreen] = useState("menu");
  const [quizSet, setQuizSet] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showCorrect, setShowCorrect] = useState("");

  // Hiragana basic set
  const hiraganaSet = { あ: "a", い: "i", う: "u", え: "e", お: "o" };

  const allChars = Object.entries(hiraganaSet);

  // Ref for wrong answer sound
  const wrongSoundRef = useRef(new Audio("/wrongSound.mp3")); // Place wrongSound.mp3 in public folder

  const startQuiz = () => {
    setQuizSet(allChars.sort(() => Math.random() - 0.5));
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
    setShowCorrect("");
    setScreen("quiz");
  };

  const checkAnswer = () => {
    if (!quizSet.length) return;

    const correct = quizSet[current][1];
    const char = quizSet[current][0];
    const isCorrect = answer.trim().toLowerCase() === correct;

    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setShowCorrect(correct);
      // Play wrong sound
      try {
        wrongSoundRef.current.pause();
        wrongSoundRef.current.currentTime = 0;
        wrongSoundRef.current.play();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }

    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      if (current + 1 < quizSet.length) {
        setCurrent((c) => c + 1);
        setAnswer("");
        setFeedback(null);
        setShowCorrect("");
      } else {
        setFinished(true);
        setScreen("finished");
      }
    }, 1000);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") checkAnswer();
  };

  // MENU
  if (screen === "menu") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Hiragana Quiz</h1>
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-red-500 text-white rounded text-xl"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // QUIZ
  if (screen === "quiz") {
    const item = quizSet[current];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="text-8xl text-red-600 mb-6">{item[0]}</div>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type romaji and press Enter"
            className="border-4 border-red-500 p-3 text-2xl rounded text-center mb-4"
            autoFocus
          />
          <div className="flex gap-4 justify-center mb-3">
            <button
              onClick={checkAnswer}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Submit
            </button>
          </div>
          {feedback === "wrong" && (
            <div className="text-red-600 mb-2">
              ❌ Correct answer: {showCorrect}
            </div>
          )}
          <div className="text-blue-700">
            Question {current + 1} / {quizSet.length} — Score: {score}
          </div>
        </div>
      </div>
    );
  }

  // FINISHED
  if (screen === "finished") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100">
        <h2 className="text-4xl mb-4 text-red-600">Quiz Finished!</h2>
        <p className="text-2xl text-blue-700 mb-6">
          Your score: {score} / {quizSet.length}
        </p>
        <button
          onClick={() => setScreen("menu")}
          className="px-6 py-3 bg-red-500 text-white rounded text-xl"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return null;
}

