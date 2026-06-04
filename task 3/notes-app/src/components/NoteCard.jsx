function NoteCard({
  note,
  deleteNote,
  updateNote,
  currentUser
}) {

  return (
    <div className="bg-[#111] border border-yellow-500 rounded-3xl p-6">

      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        {note.title}
      </h1>

      <p className="text-gray-300 mb-8">
        {note.body}
      </p>

      {
        note.uid === currentUser.uid && (

          <div className="flex gap-4">

            <button
              onClick={()=>updateNote(note.id)}
              className="bg-yellow-500 text-black px-5 py-3 rounded-xl w-full font-bold"
            >
              Edit
            </button>

            <button
              onClick={()=>deleteNote(note.id)}
              className="bg-red-500 px-5 py-3 rounded-xl w-full"
            >
              Delete
            </button>

          </div>

        )
      }

    </div>
  );
}

export default NoteCard;