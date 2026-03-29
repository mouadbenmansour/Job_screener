const BASE_URL = 'http://localhost:8000'

export async function analyseResume(cvFile, jobDescription) {
  const formData = new FormData()
  formData.append('cv', cvFile)
  formData.append('job_description', jobDescription)

  const response = await fetch(`${BASE_URL}/analyse`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Analysis failed')
  }

  return response.json()
}