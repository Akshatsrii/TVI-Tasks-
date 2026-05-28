import NoteCard from "./NoteCard";

function NotesList({
  notes,
  deleteNote,
  updateNote,
  currentUser
}) {

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {
        notes.map((note)=>(

          <NoteCard
            key={note.id}
            note={note}
            deleteNote={deleteNote}
            updateNote={updateNote}
            currentUser={currentUser}
          />

        ))
      }

    </div>
  );
}

export default NotesList;