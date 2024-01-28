export function Chat({ currentUser, messages }) {
  return (
    <div className="chat">
      <div className="chat-header">
        <span>Nest Chat App</span>
      </div>
      <div className="chat-message-list">
        {messages.map((message, idx) => (
          <div key={idx} className="chat-message">
            <div className="chat-message-wrapper">
              <span className="chat-message-author">{message.author}</span>
              <div className="chat-message-bubble">
                <span className="chat-message-body">{message.body}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
