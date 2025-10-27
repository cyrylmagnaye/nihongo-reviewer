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
