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

  const wrongSoundRef = useRef(new Audio("/wrongSound.mp3")); // place in public/

  // Full Hiragana sets
  const hiraganaSets = {
    basic: {
      あ: "a", い: "i", う: "u", え: "e", お: "o",
      か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
      さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
      た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
      な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
      は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
      ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
      や: "ya", ゆ: "yu", よ: "yo",
      ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
      わ: "wa", を: "wo", ん: "n"
    },
    youon: {
      きゃ: "kya", きゅ: "kyu", きょ: "kyo",
      しゃ: "sha", しゅ: "shu", しょ: "sho",
      ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
      にゃ: "nya", にゅ: "nyu", にょ: "nyo",
      ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
      みゃ: "mya", みゅ: "myu", みょ: "myo",
      りゃ: "rya", りゅ: "ryu", りょ: "ryo",
      ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
      じゃ: "ja", じゅ: "ju", じょ: "jo",
      びゃ: "bya", びゅ: "byu", びょ: "byo",
      ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo"
    },
    dakouon: {
      が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
      ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
      だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
      ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo"
    },
    handakouon: {
      ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po"
    }
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

    if (isCorrect) setScore((s) => s + 1);
    else {
      setShowCorrect(correct);
      try {
        wrongSoundRef.current.pause();
        wrongSoundRef.current.currentTime = 0;
        wrongSoundRef.current.play();
      } catch (err) {
        console.error("Audio failed:", err);
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
          {["basic", "youon", "dakouon", "handakouon", "all"].map((cat) => (
            <button
              key={cat}
              onClick={() => startQuiz(cat)}
              className={`px-6 py-3 rounded text-xl text-white ${
                cat === "basic"
                  ? "bg-red-500"
                  : cat === "youon"
                  ? "bg-blue-500"
                  : cat === "dakouon"
                  ? "bg-green-500"
                  : cat === "handakouon"
                  ? "bg-purple-500"
                  : "bg-yellow-600"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
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
