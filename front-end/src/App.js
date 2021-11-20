import "./App.css";
import ChatContainer from "./components/ChatContainer";
import Town from "./components/Town/index";
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
          <Town />
        </>
      )}
    </div>
  );
};

export default App;
