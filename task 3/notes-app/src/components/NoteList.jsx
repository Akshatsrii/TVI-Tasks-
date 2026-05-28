import NoteItem from "./NoteItem";

function NoteList({
  notes,
  deleteNote,
  updateNote
}) {
  return (
    <div>

      {
        notes.map((item) => (
          <NoteItem
            key={item.id}
            item={item}
            deleteNote={deleteNote}
            updateNote={updateNote}
          />
        ))
      }

    </div>
  );
}

export default NoteList;