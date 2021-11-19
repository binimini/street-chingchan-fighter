import "./App.css";
import ChatContainer from "./components/ChatContainer";
import Town from "./components/Town/index";
import SocketProvider from "./context/SocketContext";

const App = () => {
  return (
    <div className="App">
      <SocketProvider>
        <ChatContainer />
        <Town />
      </SocketProvider>
    </div>
  );
};

export default App;
