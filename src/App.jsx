import React, { useState, useEffect } from "react";

export default function HiraganaQuizApp() {
  // App modes: modeSelect -> menu -> custom -> quiz -> finished -> review -> read -> write
  const [screen, setScreen] = useState("modeSelect");
  const [quizSet, setQuizSet] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showCorrect, setShowCorrect] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [results, setResults] = useState([]);
  const [customSelection, setCustomSelection] = useState({});

  // Read mode controls
  const [readFilter, setReadFilter] = useState("all");
  const [readQuery, setReadQuery] = useState("");

  // small sounds (placeholder URLs, you can replace with local files)
  const correctSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_0a3b4b2a32.mp3?filename=koto-ding.mp3");
  const wrongSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_3c12e76b45.mp3?filename=woodblock-hit.mp3");

  // Hiragana data: romaji + temporary mnemonic placeholder
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
    dakouon: { が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go", ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo", だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do", ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo" },
    handakouon: { ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po" }
  };

  // build full list helpers
  const allChars = Object.entries({ ...hiraganaSets.basic, ...hiraganaSets.youon, ...hiraganaSets.dakouon, ...hiraganaSets.handakouon });

  // temporary mnemonic placeholders (include romaji in hint)
  const mnemonics = {};
  allChars.forEach(([k, v]) => {
    mnemonics[k] = `Hint for ${k} (${v})`;
  });

  // Utility: start quiz with type or custom list
  const startQuiz = (type, customList = null) => {
    let selected;
    if (type === "custom") {
      selected = Object.entries(customSelection);
    } else if (type === "review" && customList) {
      selected = Object.entries(customList);
    } else {
      selected = Object.entries(hiraganaSets[type] || {});
    }
    if (selected.length === 0) return alert("Please select some characters first.");
    setQuizSet(selected.sort(() => Math.random() - 0.5));
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
    setShowCorrect("");
    setResults([]);
    setScreen("quiz");
  };

  // keyboard submit in quiz: handled by onKeyDown on input
  const checkAnswer = () => {
    if (!quizSet.length) return;
    const correct = quizSet[current][1];
    const char = quizSet[current][0];
    const isCorrect = answer.trim().toLowerCase() === correct;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("correct");
      if (soundEnabled) correctSound.play();
    } else {
      setFeedback("wrong");
      setShowCorrect(correct);
      if (soundEnabled) wrongSound.play();
    }
    setResults((prev) => [...prev, { char, user: answer.trim().toLowerCase(), correct, isCorrect }]);
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
    }, 1500);
  };

  const toggleCharacter = (char, romaji) => {
    setCustomSelection((prev) => {
      const updated = { ...prev };
      if (updated[char]) delete updated[char];
      else updated[char] = romaji;
      return updated;
    });
  };

  const resetToMenu = () => {
    setScreen("menu");
    setQuizSet([]);
    setAnswer("");
    setFeedback(null);
    setShowCorrect("");
    setResults([]);
    setCustomSelection({});
  };

  // Read mode helpers: filter and search
  const readData = () => {
    let entries = Object.entries({ ...hiraganaSets.basic, ...hiraganaSets.youon, ...hiraganaSets.dakouon, ...hiraganaSets.handakouon });
    if (readFilter && readFilter !== "all") {
      entries = Object.entries(hiraganaSets[readFilter] || {});
    }
    if (readQuery && readQuery.trim()) {
      const q = readQuery.trim().toLowerCase();
      entries = entries.filter(([ch, rom]) => ch.includes(q) || rom.includes(q));
    }
    return entries;
  };

  // Results derived
  const wrongAnswers = results.filter((r) => !r.isCorrect);
  const wrongSet = Object.fromEntries(wrongAnswers.map((r) => [r.char, r.correct]));

  // Enter key handler for quiz input
  const handleQuizKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  };

  // Mode selection screen (before menu)
  if (screen === "modeSelect") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <h1 className="text-5xl font-bold mb-6 text-red-600 text-center">Choose Learning Mode</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => setScreen("readMode")}
              className="p-6 rounded-2xl bg-yellow-100 border-2 border-red-400 shadow hover:scale-105 transition">
              <div className="text-2xl font-semibold mb-2">🔎 Read / Review</div>
              <div className="text-sm">Study characters with hints and quick search.</div>
            </button>

            <button onClick={() => setScreen("menu")}
              className="p-6 rounded-2xl bg-white border-2 border-blue-400 shadow hover:scale-105 transition">
              <div className="text-2xl font-semibold mb-2">🧠 Quiz Mode</div>
              <div className="text-sm">Take quizzes (basic / custom / wrong-only).</div>
            </button>

            <button onClick={() => setScreen("writeMode")}
              className="p-6 rounded-2xl bg-blue-100 border-2 border-blue-500 shadow hover:scale-105 transition">
              <div className="text-2xl font-semibold mb-2">✍️ Write Mode</div>
              <div className="text-sm">Practice stroke order & tracing (coming next).</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Read / Review Mode screen
  if (screen === "readMode") {
    const entries = readData();
    return (
      <div className="min-h-screen bg-[#FFF8F0] p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScreen("modeSelect")} className="px-4 py-2 bg-blue-400 text-white rounded">← Back</button>
            <h1 className="text-3xl font-bold text-red-600">ひらがな学習モード — Read / Review</h1>
            <div />
          </div>

          <div className="flex gap-3 items-center mb-4">
            <div className="flex space-x-2">
              {['all','basic','youon','dakouon','handakouon'].map(tab => (
                <button key={tab} onClick={() => setReadFilter(tab)} className={`px-3 py-2 rounded ${readFilter===tab? 'bg-red-600 text-white' : 'bg-yellow-100 text-red-700'}`}>
                  {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase()+tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <input value={readQuery} onChange={(e)=>setReadQuery(e.target.value)} placeholder="Search Hiragana or Romaji... (e.g., か or ka)" className="px-3 py-2 rounded border" />
              <button onClick={()=>{setReadQuery(''); setReadFilter('all');}} className="px-3 py-2 bg-blue-200 rounded">Reset</button>
            </div>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="p-3 border">Hiragana</th>
                  <th className="p-3 border">Romaji</th>
                  <th className="p-3 border">Mnemonic Hint</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([ch, ro]) => (
                  <tr key={ch} className="hover:bg-blue-50 transition">
                    <td className="p-3 border text-2xl text-red-600">{ch}</td>
                    <td className="p-3 border text-blue-700">{ro}</td>
                    <td className="p-3 border text-yellow-800">{mnemonics[ch]} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={()=>setScreen('modeSelect')} className="px-4 py-2 bg-red-500 text-white rounded">Back</button>
            <button onClick={()=>startQuiz('basic')} className="px-4 py-2 bg-blue-600 text-white rounded">Quiz Basic</button>
          </div>
        </div>
      </div>
    );
  }

  // Main menu for quiz options
  if (screen === "menu") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl font-bold mb-6 text-red-600">Hiragana Quiz — Choose Category</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.keys(hiraganaSets).map((set) => (
              <button key={set} onClick={() => startQuiz(set)} className="py-3 rounded-lg bg-yellow-100 border-2 border-red-400">{set.charAt(0).toUpperCase()+set.slice(1)}</button>
            ))}
            <button onClick={() => setScreen('custom')} className="py-3 rounded-lg bg-blue-100 border-2 border-blue-400 col-span-2">Customized</button>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={()=>setScreen('modeSelect')} className="px-4 py-2 rounded bg-red-500 text-white">Back</button>
          </div>
        </div>
      </div>
    );
  }

  // Custom selection screen
  if (screen === "custom") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl text-red-600 font-bold mb-4">Select Characters for Custom Quiz</h2>
          <div className="grid grid-cols-10 gap-2 bg-white border-2 border-blue-500 p-4 rounded-lg shadow-inner mb-4 max-h-96 overflow-y-auto">
            {allChars.map(([char, rom]) => (
              <div key={char} onClick={() => toggleCharacter(char, rom)} className={`p-2 rounded text-xl cursor-pointer border ${customSelection[char] ? 'bg-red-300 border-red-500 text-white' : 'bg-yellow-50 border-red-300 text-red-700 hover:bg-yellow-100'}`}>
                {char}
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={()=>startQuiz('custom')} className="px-4 py-2 bg-red-500 text-white rounded">Start Custom Quiz</button>
            <button onClick={()=>setScreen('menu')} className="px-4 py-2 bg-blue-400 text-white rounded">Back</button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  if (screen === "quiz") {
    const item = quizSet[current];
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-8xl text-red-600 font-bold mb-6">{item[0]}</div>

          <input
            value={answer}
            onChange={(e)=>setAnswer(e.target.value)}
            onKeyDown={handleQuizKey}
            className={`border-4 text-2xl p-3 rounded-xl text-center w-56 mb-4 focus:outline-none transition ${feedback === 'correct' ? 'border-green-500 bg-green-100' : feedback === 'wrong' ? 'border-red-500 bg-red-100' : 'border-red-500'}`}
            placeholder="type romaji and press Enter"
            autoFocus
          />

          <div className="flex gap-3 justify-center mb-3">
            <button onClick={checkAnswer} className="px-4 py-2 bg-red-500 text-white rounded">Submit</button>
            <button onClick={resetToMenu} className="px-4 py-2 bg-blue-400 text-white rounded">Quit</button>
          </div>

          {feedback === 'wrong' && <div className="text-red-600 mb-2">❌ Correct answer: {showCorrect}</div>}
          <div className="text-yellow-700">Question {current+1} of {quizSet.length} — Score: {score}</div>
        </div>
      </div>
    );
  }

  // Finished screen with review options
  if (screen === "finished") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-4xl text-red-600 font-bold mb-4">Quiz Finished!</h2>
          <p className="text-2xl text-blue-700 mb-6">Your score: {score} / {quizSet.length}</p>

          <div className="bg-white border p-4 rounded mb-6">
            <h3 className="text-lg font-semibold mb-2">Results Summary</h3>
            <ul className="text-left max-h-48 overflow-y-auto space-y-2">
              {results.map((r,i) => (
                <li key={i} className={r.isCorrect ? 'text-green-600' : 'text-red-600'}>{r.char} → {r.user || '(blank)'} {r.isCorrect ? '✅' : `❌ (Correct: ${r.correct})`}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 justify-center mb-4">
            <button onClick={()=>setScreen('readMode')} className="px-4 py-2 bg-yellow-300 text-red-800 rounded">Review All</button>
            {results.some(r=>!r.isCorrect) && <button onClick={()=>{setScreen('readMode'); setReadFilter('all');}} className="px-4 py-2 bg-blue-400 text-white rounded">View Read Mode</button>}
            {results.some(r=>!r.isCorrect) && <button onClick={()=>startQuiz('review', wrongSet)} className="px-4 py-2 bg-red-500 text-white rounded">Quiz Wrong Only</button>}
          </div>

          <div className="flex justify-center gap-3">
            <button onClick={resetToMenu} className="px-4 py-2 bg-red-500 text-white rounded">Back to Menu</button>
            <button onClick={()=>setScreen('modeSelect')} className="px-4 py-2 bg-blue-400 text-white rounded">Change Mode</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
