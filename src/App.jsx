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

  const wrongSoundRef = useRef(new Audio("/wrongSound.mp3")); // place wrongSound.mp3 in public/

  // Hiragana categories
  const hiraganaSets = {
    basic: { あ: "a", い: "i", う: "u", え: "e", お: "o" },
    youon: { きゃ: "kya", きゅ: "kyu", きょ: "kyo" },
    dakouon: { が: "ga", ぎ: "gi", ぐ: "gu" },
    handakouon: { ぱ: "pa", ぴ: "pi", ぷ: "pu" },
  };

  const allChars = Object.entries({
    ...hiraganaSets.basic,
    ...hiraganaSets.youon,
    ...hiraganaSets.dakouon,
    ...hiraganaSets.handakouon,
  });

  const startQuiz = (type = "all") => {
    let selected;
    if (type === "all") selected = allChars;
    else selected = Object.entries(hiraganaSets[type] || {});
    if (!selected.length) return alert("No characters selected!");

    setQuizSet(selected.sort(() => Math.random() - 0.5));
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
    setShowCorrect("");
    setScreen("quiz");
  };

  const checkAnswer = () => {
    if (!quizSet.length) return;

    const [char, correct] = quizSet[current];
    const isCorrect = answer.trim().toLowerCase() === correct;

    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setShowCorrect(correct);
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

  // MENU SCREEN
  if (screen === "menu") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
        <h1 className="text-4xl font-bold mb-6 text-red-600">Hiragana Quiz</h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => startQuiz("basic")}
            className="px-6 py-3 bg-red-500 text-white rounded text-xl"
          >
            Basic
          </button>
          <button
            onClick={() => startQuiz("youon")}
            className="px-6 py-3 bg-blue-500 text-white rounded text-xl"
          >
            Youon
          </button>
          <button
            onClick={() => startQuiz("dakouon")}
            className="px-6 py-3 bg-green-500 text-white rounded text-xl"
          >
            Dakouon
          </button>
          <button
            onClick={() => startQuiz("handakouon")}
            className="px-6 py-3 bg-purple-500 text-white rounded text-xl"
          >
            Handakouon
          </button>
          <button
            onClick={() => startQuiz("all")}
            className="px-6 py-3 bg-yellow-600 text-white rounded text-xl"
          >
            All Characters
          </button>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (screen === "quiz") {
    const [char] = quizSet[current];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-6">
        <div className="text-center">
          <div className="text-8xl text-red-600 mb-6">{char}</div>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type romaji and press Enter"
            className={`border-4 p-3 text-2xl rounded text-center mb-4 focus:outline-none ${
              feedback === "correct"
                ? "border-green-500 bg-green-100"
                : feedback === "wrong"
                ? "border-red-500 bg-red-100"
                : "border-red-500"
            }`}
            autoFocus
          />
          <div className="flex gap-4 justify-center mb-3">
            <button
              onClick={checkAnswer}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Submit
            </button>
            <button
              onClick={() => setScreen("menu")}
              className="px-4 py-2 bg-blue-400 text-white rounded"
            >
              Quit
            </button>
          </div>
          {feedback === "wrong" && (
            <div className="text-red-600 mb-2">❌ Correct: {showCorrect}</div>
          )}
          <div className="text-blue-700">
            Question {current + 1} / {quizSet.length} — Score: {score}
          </div>
        </div>
      </div>
    );
  }

  // FINISHED SCREEN
  if (screen === "finished") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
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

