import { useState, useEffect } from 'react'

export default function ScoreModal({ result, onClose }) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [animatedScore, setAnimatedScore] = useState(0)

  // Animate score counting up
  useEffect(() => {
    const target = result.score
    const duration = 1200
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setAnimatedScore(target)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [result.score])

  const scoreColor =
    result.score >= 75 ? '#3ecf8e' :
    result.score >= 50 ? '#f0a500' :
    '#f05252'

  const scoreLabel =
    result.score >= 75 ? 'Strong Match' : result.score >= 50 ? 'Moderate Match' :'Weak Match'

    const emoji = 
        result.score >= 75? "🔥": result.score>=50? "✅": "🤔"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[#16161d] border border-[#2a2a38] rounded-2xl w-full max-w-lg mx-4 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.25s_ease] relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1e1e28] border border-[#2a2a38] text-[#7a7a8c] hover:text-[#e8e6df] hover:border-[#c8a96e] transition-all flex items-center justify-center text-sm"
        >
          ✕
        </button>

        {/* Score */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#7a7a8c] font-['DM_Mono',monospace] mb-4">
            Match Score
          </p>
          <div
            className="font-['DM_Serif_Display',serif] text-8xl font-normal mb-2 transition-all duration-100"
            style={{ color: scoreColor }}
          >
            {animatedScore}
            <span className="text-4xl">%</span>
          </div>
          <span
            className="inline-block text-xs font-semibold tracking-[0.1em] uppercase font-['DM_Mono',monospace] px-3 py-1 rounded-full"
            style={{ color: scoreColor, background: `${scoreColor}18` }}
          >
            {emoji}+ {scoreLabel}
          </span>
        </div>

        {/* Score bar */}
        <div className="w-full bg-[#0f0f13] rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-[1200ms] ease-out"
            style={{ width: `${animatedScore}%`, background: scoreColor }}
          />
        </div>

        {/* Feedback section */}
        {!showFeedback ? (
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full bg-[#c8a96e] hover:bg-[#d4b97e] text-[#0f0f13] font-semibold text-sm rounded-xl py-3.5 transition-all duration-200 hover:-translate-y-0.5 tracking-wide"
          >
            Show Feedback →
          </button>
        ) : (
          <div className="animate-[fadeIn_0.3s_ease]">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#7a7a8c] font-['DM_Mono',monospace] mb-3">
              AI Feedback
            </p>
            <div className="bg-[#0f0f13] border border-[#2a2a38] rounded-xl p-5 text-sm text-[#7a7a8c] leading-relaxed max-h-52 overflow-y-auto">
              {result.feedback}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}