function Message({ message }) {

  return (
    <div className="message">

      <img
        src={message.photoURL}
        alt=""
        width="40"
      />

      <div>

        <strong>
          {message.name}
        </strong>

        {message.text && (
          <p>{message.text}</p>
        )}

        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt=""
            width="200"
          />
        )}

      </div>

    </div>
  );
}

export default Message;