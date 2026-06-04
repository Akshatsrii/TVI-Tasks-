function NoteForm({
  title,
  setTitle,
  body,
  setBody,
  addNote
}) {

  return (
    <div className="bg-[#111] border border-yellow-500 p-8 rounded-3xl mb-10">

      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        className="w-full p-4 bg-[#222] rounded-xl mb-4 outline-none"
      />

      <textarea
        placeholder="Write note..."
        value={body}
        onChange={(e)=>setBody(e.target.value)}
        className="w-full h-[200px] bg-[#222] rounded-xl p-4 outline-none"
      />

      <button
        onClick={addNote}
        className="w-full bg-yellow-500 text-black p-4 rounded-xl mt-6 font-bold"
      >
        Add Note
      </button>

    </div>
  );
}

export default NoteForm;