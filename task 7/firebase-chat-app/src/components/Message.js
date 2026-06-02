function Message({ message }) {
  return (
    <div className="message">

      <img
        className="avatar"
        src={
          message.photoURL ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt={message.name}
      />

      <div className="message-content">

        <strong className="username">
          {message.name}
        </strong>

        {message.text && (
          <p className="message-text">
            {message.text}
          </p>
        )}

        {message.imageUrl && (
          <img
            className="message-image"
            src={message.imageUrl}
            alt="uploaded"
          />
        )}

      </div>

    </div>
  );
}

export default Message;