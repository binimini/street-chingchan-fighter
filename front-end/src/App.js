import "./App.css";
import ChatContainer from "./components/ChatContainer";
import SelectionList from "./container/SelectionList";
import Town from "./components/Town/index";
import { praiseList } from "./dummy.json";
import JoinPage from "./components/JoinPage";
import { useSocketData } from "./context/SocketContext";

const App = () => {
  const { nickname } = useSocketData();
  return (
    <div className="App">
      {!nickname && <JoinPage />}
      <ChatContainer />
      <Town />
      <SelectionList praiseList={praiseList} />
    </div>
  );
};

export default App;
