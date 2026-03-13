// src/pages/Resumes.jsx
function Resumes() {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">
        Upload different resume versions for different job types.
        Coming in Week 3 with AWS S3 storage.
      </p>
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
        <div className="text-4xl mb-3">📄</div>
        <p className="font-semibold text-gray-600 mb-1">Resume uploads coming soon</p>
        <p className="text-sm text-gray-400">We will connect this to AWS S3</p>
      </div>
    </div>
  )
}

export default Resumes