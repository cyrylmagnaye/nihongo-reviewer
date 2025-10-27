import React, { useState, useEffect } from "react";

export default function HiraganaQuizApp() {
  // App modes: modeSelect -> menu -> custom -> quiz -> finished -> review -> read -> write
  const [screen, setScreen] = useState("modeSelect");
  const [quizSet, setQuizSet] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showCorrect, setShowCorrect] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [customSet, setCustomSet] = useState([]);
  const [selectedChars, setSelectedChars] = useState([]);
  const [allChars, setAllChars] = useState([]);
  const [readFilter, setReadFilter] = useState("");

  // Sound effects
  const correctSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_f8bb7b0ed5.mp3?filename=correct-answer.mp3");
  const wrongSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b2373b6ef.mp3?filename=wrong-answer.mp3");
  const buttonSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_2f0dd69ed1.mp3?filename=button-click.mp3");

  const playButtonSound = () => {
    buttonSound.currentTime = 0;
    buttonSound.play();
  };

  useEffect(() => {
    const chars = [
      ["あ", "a"], ["い", "i"], ["う", "u"], ["え", "e"], ["お", "o"],
      ["か", "ka"], ["き", "ki"], ["く", "ku"], ["け", "ke"], ["こ", "ko"],
      ["さ", "sa"], ["し", "shi"], ["す", "su"], ["せ", "se"], ["そ", "so"],
      ["た", "ta"], ["ち", "chi"], ["つ", "tsu"], ["て", "te"], ["と", "to"],
      ["な", "na"], ["に", "ni"], ["ぬ", "nu"], ["ね", "ne"], ["の", "no"],
      ["は", "ha"], ["ひ", "hi"], ["ふ", "fu"], ["へ", "he"], ["ほ", "ho"],
      ["ま", "ma"], ["み", "mi"], ["む", "mu"], ["め", "me"], ["も", "mo"],
      ["や", "ya"], ["ゆ", "yu"], ["よ", "yo"],
      ["ら", "ra"], ["り", "ri"], ["る", "ru"], ["れ", "re"], ["ろ", "ro"],
      ["わ", "wa"], ["を", "wo"], ["ん", "n"],
    ];
    setAllChars(chars);
  }, []);

  const startQuiz = (type) => {
    playButtonSound();
    let set = [];

    if (type === "basic") set = allChars;
    else if (type === "custom") set = customSet.length ? customSet : allChars;
    else if (type === "wrong") set = wrongAnswers.map(w => [w.char, w.correct]);

    set = [...set].sort(() => Math.random() - 0.5);
    setQuizSet(set);
    setScore(0);
    setCurrent(0);
    setAnswer("");
    setFeedback("");
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
      setFeedback("correct");
      correctSound.play();
    } else {
      setFeedback("wrong");
      setShowCorrect(correct);
      wrongSound.play();
      setWrongAnswers((prev) => [...prev, { char, correct }]);
    }
  };

  const nextQuestion = () => {
    playButtonSound();
    if (current + 1 < quizSet.length) {
      setCurrent((c) => c + 1);
      setAnswer("");
      setFeedback("");
      setShowCorrect("");
    } else {
      setScreen("finished");
    }
  };

  const resetToMenu = () => {
    playButtonSound();
    setScreen("menu");
    setFeedback("");
    setShowCorrect("");
    setAnswer("");
  };

  const toggleSelection = (char) => {
    playButtonSound();
    setSelectedChars((prev) =>
      prev.includes(char)
        ? prev.filter((c) => c !== char)
        : [...prev, char]
    );
  };

  const createCustomSet = () => {
    playButtonSound();
    const set = allChars.filter(([char]) => selectedChars.includes(char));
    setCustomSet(set);
    setScreen("menu");
  };

  const filteredChars = allChars.filter(([char, romaji]) =>
    char.includes(readFilter) || romaji.includes(readFilter)
  );

  // --- Screen 1: Mode Select ---
  if (screen === "modeSelect") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <h1 className="text-5xl font-bold mb-6 text-red-600 text-center">Choose Learning Mode</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => { playButtonSound(); setScreen("readMode"); }} className="p-6 rounded-2xl bg-yellow-100 border-2 border-red-400 shadow hover:scale-105 transition">
              <div className="text-2xl font-semibold mb-2">Read / Review</div>
              <div className="text-sm">Study characters with hints and quick search.</div>
            </button>
            <button onClick={() => { playButtonSound(); setScreen("menu"); }} className="p-6 rounded-2xl bg-white border-2 border-blue-400 shadow hover:scale-105 transition">
              <div className="text-2xl font-semibold mb-2">Quiz Mode</div>
              <div className="text-sm">Take quizzes (basic / custom / wrong-only).</div>
            </button>
            <button onClick={() => { playButtonSound(); setScreen("writeMode"); }} className="p-6 rounded-2xl bg-blue-100 border-2 border-blue-500 shadow hover:scale-105 transition">
              <div className="text-2xl font-semibold mb-2">Writing Practice</div>
              <div className="text-sm">Practice stroke order & tracing (coming soon).</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Screen 2: Menu ---
  if (screen === "menu") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0]">
        <h2 className="text-4xl font-bold text-red-600 mb-6">Quiz Options</h2>
        <div className="space-y-4">
          <button onClick={() => startQuiz("basic")} className="px-8 py-4 rounded-xl bg-green-200 hover:bg-green-300 transition">Basic Quiz</button>
          <button onClick={() => { playButtonSound(); setScreen("custom"); }} className="px-8 py-4 rounded-xl bg-blue-200 hover:bg-blue-300 transition">Custom Quiz</button>
          <button onClick={() => startQuiz("wrong")} className="px-8 py-4 rounded-xl bg-yellow-200 hover:bg-yellow-300 transition">Wrong Answers Only</button>
          <button onClick={() => { playButtonSound(); setScreen("modeSelect"); }} className="px-8 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 transition">Back</button>
        </div>
      </div>
    );
  }

  // --- Screen 3: Custom Set Selection ---
  if (screen === "custom") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] p-6">
        <h2 className="text-3xl font-bold mb-4 text-red-600">Select Characters for Custom Quiz</h2>
        <div className="grid grid-cols-6 gap-4">
          {allChars.map(([char]) => (
            <button
              key={char}
              onClick={() => toggleSelection(char)}
              className={`p-4 text-2xl rounded-xl border-2 ${selectedChars.includes(char) ? "bg-green-300 border-green-500" : "bg-white border-gray-300"}`}
            >
              {char}
            </button>
          ))}
        </div>
        <div className="flex justify-center mt-6 gap-4">
          <button onClick={createCustomSet} className="px-8 py-3 rounded-xl bg-blue-200 hover:bg-blue-300 transition">Save Set</button>
          <button onClick={() => { playButtonSound(); setScreen("menu"); }} className="px-8 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition">Cancel</button>
        </div>
      </div>
    );
  }

  // --- Screen 4: Quiz ---
  if (screen === "quiz") {
    const [char, correct] = quizSet[current] || ["", ""];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] p-6">
        <div className="text-6xl mb-4">{char}</div>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          className="border-2 border-gray-400 rounded-xl px-4 py-2 text-lg text-center mb-4"
          placeholder="Type romaji..."
        />
        {feedback === "correct" && <p className="text-green-600 font-bold mb-2">✅ Correct!</p>}
        {feedback === "wrong" && <p className="text-red-600 font-bold mb-2">❌ Wrong! Correct: {showCorrect}</p>}
        <div className="flex gap-4 mt-4">
          <button onClick={checkAnswer} className="px-6 py-3 bg-green-200 hover:bg-green-300 rounded-xl transition">Check</button>
          <button onClick={nextQuestion} className="px-6 py-3 bg-blue-200 hover:bg-blue-300 rounded-xl transition">Next</button>
          <button onClick={resetToMenu} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition">Exit</button>
        </div>
      </div>
    );
  }

  // --- Screen 5: Finished ---
  if (screen === "finished") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0]">
        <h2 className="text-4xl font-bold text-red-600 mb-4">Quiz Finished!</h2>
        <p className="text-xl mb-6">Score: {score} / {quizSet.length}</p>
        <div className="flex gap-4">
          <button onClick={() => { playButtonSound(); startQuiz("basic"); }} className="px-8 py-4 rounded-xl bg-green-200 hover:bg-green-300 transition">Retry</button>
          <button onClick={() => { playButtonSound(); setScreen("review"); }} className="px-8 py-4 rounded-xl bg-yellow-200 hover:bg-yellow-300 transition">Review</button>
          <button onClick={() => { playButtonSound(); setScreen("modeSelect"); }} className="px-8 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 transition">Main Menu</button>
        </div>
      </div>
    );
  }

  // --- Screen 6: Review Mode ---
  if (screen === "review") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] p-6">
        <h2 className="text-3xl font-bold text-red-600 mb-6">Review Wrong Answers</h2>
        {wrongAnswers.length === 0 ? (
          <p>No mistakes yet! 🎉</p>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {wrongAnswers.map((w, i) => (
              <div key={i} className="p-4 bg-white border rounded-xl text-center">
                <p className="text-3xl">{w.char}</p>
                <p className="text-gray-600 text-sm">{w.correct}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { playButtonSound(); setScreen("modeSelect"); }} className="mt-6 px-8 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">Back</button>
      </div>
    );
  }

  // --- Screen 7: Read Mode ---
  if (screen === "readMode") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] p-6">
        <h2 className="text-3xl font-bold text-red-600 mb-6">Hiragana Chart</h2>
        <input
          type="text"
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value)}
          placeholder="Search by character or romaji..."
          className="border-2 border-gray-400 rounded-xl px-4 py-2 mb-6 w-full"
        />
        <div className="grid grid-cols-6 gap-4">
          {filteredChars.map(([char, romaji]) => (
            <div key={char} className="p-4 bg-white rounded-xl border text-center">
              <p className="text-3xl">{char}</p>
              <p className="text-sm text-gray-500">{romaji}</p>
            </div>
          ))}
        </div>
        <button onClick={() => { playButtonSound(); setScreen("modeSelect"); }} className="mt-6 px-8 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">Back</button>
      </div>
    );
  }

  // --- Placeholder for Write Mode ---
  if (screen === "writeMode") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0]">
        <h2 className="text-4xl font-bold text-red-600 mb-4">Writing Practice</h2>
        <p className="text-lg mb-6">Coming soon!</p>
        <button onClick={() => { playButtonSound(); setScreen("modeSelect"); }} className="px-8 py-4 bg-gray-200 rounded-xl hover:bg-gray-300 transition">Back</button>
      </div>
    );
  }

  return null;
}
