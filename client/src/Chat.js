import { useState } from 'react';

export function Chat({ currentUser, messages, onSendMessage, onLogout }) {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e) => {
    if (e.key !== 'Enter' || inputValue.trim().length === 0) return;

    const newMessage = { author: currentUser, body: inputValue.trim() };
    onSendMessage(newMessage);
    setInputValue('');
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <span>Nest Chat App</span>
        <button className="button" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="chat-message-list">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              currentUser === message.author ? "outgoing" : ""
            }`}
          >
            <div className="chat-message-wrapper">
              <span className="chat-message-author">{message.author}</span>
              <div className="chat-message-bubble">
                <span className="chat-message-body">{message.body}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-composer">
        <input
          className="chat-composer-input"
          placeholder="Type message here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  );
}
