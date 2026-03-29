import { useState, useRef } from 'react'
import ScoreModal from './components/ScoreModal'
import { analyseResume } from './services/api'

export default function App() {
  const [cvFile, setCvFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setCvFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setCvFile(file)
  }

  const handleSubmit = async () => {
    if (!cvFile || !jobDescription.trim()) {
      setError('Please upload your CV and paste a job description.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data = await analyseResume(cvFile, jobDescription)
      setResult(data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-[#e8e6df] font-['Outfit',sans-serif]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#16161d] border-b border-[#2a2a38] px-10 py-4 flex items-center justify-between">
        <span className="font-['DM_Serif_Display',serif] text-2xl text-[#c8a96e] tracking-wide">
          Resume Screener
        </span>
        <span className="text-[#7a7a8c] text-sm font-['DM_Mono',monospace] tracking-widest uppercase">
          AI Powered
        </span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="font-['DM_Serif_Display',serif] text-5xl font-normal text-[#e8e6df] mb-4 leading-tight">
            How well does your CV<br />
            <span className="text-[#c8a96e] italic">actually match?</span>
          </h1>
          <p className="text-[#7a7a8c] text-base max-w-md mx-auto leading-relaxed">
            Upload your CV and paste a job description. We'll score the match and tell you exactly what to improve.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-[#16161d] border border-[#2a2a38] rounded-2xl p-8 mb-6">

          {/* CV Upload */}
          <div className="mb-7">
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-[#7a7a8c] font-['DM_Mono',monospace] mb-3">
              Your CV
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                ${dragging ? 'border-[#c8a96e] bg-[rgba(200,169,110,0.06)]' : 'border-[#2a2a38] hover:border-[#c8a96e] hover:bg-[rgba(200,169,110,0.04)]'}
                ${cvFile ? 'border-[#3ecf8e] bg-[rgba(62,207,142,0.04)]' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {cvFile ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[#3ecf8e] text-lg">✓</span>
                  <span className="text-[#e8e6df] text-sm font-medium">{cvFile.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCvFile(null) }}
                    className="text-[#7a7a8c] hover:text-[#f05252] text-xs ml-2 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-3 text-[#2a2a38]">⬆</div>
                  <p className="text-[#7a7a8c] text-sm">Drop your CV here or <span className="text-[#c8a96e]">browse</span></p>
                  <p className="text-[#7a7a8c] text-xs mt-1 font-['DM_Mono',monospace]">PDF or DOCX</p>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-7">
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-[#7a7a8c] font-['DM_Mono',monospace] mb-3">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              className="w-full bg-[#0f0f13] border border-[#2a2a38] rounded-xl px-4 py-3 text-[#e8e6df] text-sm font-['Outfit',sans-serif] resize-none outline-none transition-all duration-200 focus:border-[#c8a96e] focus:shadow-[0_0_0_3px_rgba(200,169,110,0.12)] placeholder-[#3a3a4a] leading-relaxed"
            />
            
          </div>

          {/* Error */}
          {error && (
            <p className="text-[#f05252] text-sm mb-5 font-['DM_Mono',monospace] bg-[rgba(240,82,82,0.08)] border border-[rgba(240,82,82,0.2)] rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#c8a96e] hover:bg-[#d4b97e] disabled:opacity-50 disabled:cursor-not-allowed text-[#0f0f13] font-semibold text-sm rounded-xl py-4 transition-all duration-200 hover:-translate-y-0.5 tracking-wide"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-[#0f0f13] border-t-transparent rounded-full animate-spin" />
                Analysing...
              </span>
            ) : (
              'Analyse Match →'
            )}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-[#3a3a4a] text-xs font-['DM_Mono',monospace] tracking-wide">
          Powered by sentence-transformers + Groq LLM
        </p>

      </main>

      {/* Modal */}
      {result && (
        <ScoreModal
          result={result}
          onClose={() => setResult(null)}
        />
      )}

    </div>
  )
}