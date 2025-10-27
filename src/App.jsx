import React, { useState, useRef } from "react";

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
  const [results, setResults] = useState([]);
  const [customSelection, setCustomSelection] = useState({});

  // Read mode controls
  const [readFilter, setReadFilter] = useState("all");
  const [readQuery, setReadQuery] = useState("");

  const wrongSoundRef = useRef(new Audio("/wrongSound.mp3")); // place wrongSound.mp3 in public/

  // Hiragana data: romaji + temporary mnemonic placeholder
  const hiraganaSets = {
    basic: { あ: "a", い: "i", う: "u", え: "e", お: "o", か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
      さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
      た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
      な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
      は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
      ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
      や: "ya", ゆ: "yu", よ: "yo",
      ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
      わ: "wa", を: "wo", ん: "n"
    },
    youon: { きゃ: "kya", きゅ: "kyu", きょ: "kyo",
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

  const allChars = Object.entries({ ...hiraganaSets.basic, ...hiraganaSets.youon, ...hiraganaSets.dakouon, ...hiraganaSets.handakouon });

  const mnemonics = {};
  allChars.forEach(([k, v]) => {
    mnemonics[k] = `Hint for ${k} (${v})`;
  });

  const startQuiz = (type, customList = null) => {
    let selected;
    if (type === "custom") selected = Object.entries(customSelection);
    else if (type === "review" && customList) selected = Object.entries(customList);
    else selected = Object.entries(hiraganaSets[type] || {});

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

  const checkAnswer = () => {
    if (!quizSet.length) return;

    const correct = quizSet[current][1];
    const char = quizSet[current][0];
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

  // ...rest of your component (modeSelect, readMode, menu, custom, quiz, finished screens)
  // unchanged
  return null;
}
