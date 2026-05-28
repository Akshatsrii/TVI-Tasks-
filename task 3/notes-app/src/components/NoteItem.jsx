function NoteItem({
  item,
  deleteNote,
  updateNote
}) {
  return (
    <div>

      <h3>{item.title}</h3>

      <button
        onClick={() =>
          updateNote(item.id)
        }
      >
        Update
      </button>

      <button
        onClick={() =>
          deleteNote(item.id)
        }
      >
        Delete
      </button>

    </div>
  );
}

export default NoteItem;