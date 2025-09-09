import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import AuthModal from "./components/AuthModel.jsx";  // 👈 use AuthModal instead

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [user, setUser] = useState(null);  // 👈 authentication user

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    user, setUser
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        {user ? (
          <>
            <Sidebar />
            <ChatWindow />
          </>
        ) : (
          <AuthModal />  // 👈 always show modal if no user
        )}
      </MyContext.Provider>
    </div>
  );
}

export default App;
