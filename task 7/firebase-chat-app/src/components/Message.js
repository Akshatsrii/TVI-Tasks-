function Message({ message, isOwn = false }) {
  if (!message) return null;
  const { name, photoURL, text, imageUrl, imageAlt, timestamp, reactions = [] } = message;

  return (
    <article className={`message ${isOwn ? "own" : ""}`}>
      <div className="avatar-wrap">
        <img
          className="avatar"
          src={photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt={name}
        />
        {message.isOnline && <span className="online-dot" aria-label="Online" />}
      </div>

      <div className="message-body">
        <div className="message-header">
          <span className="username">{name}</span>
          {timestamp && <time className="timestamp">{timestamp}</time>}
        </div>

        <div className="bubble">
          {text && <p className="message-text">{text}</p>}
          {imageUrl && (
            <img
              className="message-image"
              src={imageUrl}
              alt={imageAlt || `Image shared by ${name}`}
            />
          )}
        </div>

        {reactions.length > 0 && (
          <div className="reactions">
            {reactions.map((r) => (
              <span key={r.emoji} className={`reaction ${r.active ? "active" : ""}`}>
                {r.emoji} <span className="count">{r.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}