function NoteForm({
  note,
  setNote,
  addNote
}) {
  return (
    <div>

      <input
        type="text"
        placeholder="Enter note"
        value={note}
        onChange={(e) =>
          setNote(e.target.value)
        }
      />

      <button onClick={addNote}>
        Add Note
      </button>

    </div>
  );
}

export default NoteForm;