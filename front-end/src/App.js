import "./App.css";
import ChatContainer from "./components/ChatContainer";
import SelectionList from "./container/SelectionList";
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
          <SelectionList isGame={false} />
        </>
      )}
    </div>
  );
};

export default App;
