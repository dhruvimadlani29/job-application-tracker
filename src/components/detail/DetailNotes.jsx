// src/components/detail/DetailNotes.jsx
function DetailNotes({ notes }) {
  if (!notes) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
        📝 Notes
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{notes}</p>
    </div>
  );
}

export default DetailNotes;
