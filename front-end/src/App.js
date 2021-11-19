import "./App.css";
import Town from "./components/Town/index";
import SocketProvider from "./context/SocketContext";

const App = () => {
  return (
    <div className="App">
      <SocketProvider>
        <Town />
      </SocketProvider>
    </div>
  );
};

export default App;
