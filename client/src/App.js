import { useState } from "react";

import { Chat } from "./Chat";
import { Login } from "./Login";

const data = [
  {
    id: 1,
    body: 'Welcome to nest chat app',
    author: 'Bot',
  },
  {
    id: 2,
    body: 'Hello',
    author: 'Aidana',
  },
  {
    id: 3,
    body: 'Hello',
    author: 'Aidana',
  }
]

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState(data);

  return (
    <div className="app">
      {currentUser ? (
        <Chat currentUser={currentUser} messages={messages} />
      ) : (
        <Login onLogin={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
