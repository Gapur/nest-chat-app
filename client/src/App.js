import { useState } from "react";

import { Chat } from "./Chat";
import { Login } from "./Login";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const onLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="app">
      {currentUser ? (
        <Chat currentUser={currentUser} onLogout={onLogout} />
      ) : (
        <Login onLogin={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
