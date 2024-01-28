import { useState } from "react";

import { Chat } from "./Chat";
import { Login } from "./Login";

const data = [
  {
    id: 1,
    body: "Welcome to nest chat app",
    author: "Bot",
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState(data);

  const onSendMessage = (newMessage) => {
    const updatedMessages = messages.concat(newMessage);
    setMessages(updatedMessages);
  }

  const onLogout = () => {
    setCurrentUser(null);
    setMessages(data);
  }

  return (
    <div className="app">
      {currentUser ? (
        <Chat
          currentUser={currentUser}
          messages={messages}
          onLogout={onLogout}
          onSendMessage={onSendMessage}
        />
      ) : (
        <Login onLogin={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
