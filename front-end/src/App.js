import "./App.css";
import ChatContainer from "./components/ChatContainer";
import JoinPage from "./components/JoinPage";
import { useSocketData } from "./context/SocketContext";

const App = () => {
  const { nickname } = useSocketData();
  return (
    <div className="App">
      <div className="appbar">
        <img src="/logo.png" alt="" />
      </div>
      {!nickname ? (
        <JoinPage />
      ) : (
        <>
          <ChatContainer />
        </>
      )}
    </div>
  );
};

export default App;
