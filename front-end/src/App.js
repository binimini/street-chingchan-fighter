import "./App.css";
import SelectionList from "./container/SelectionList";
import Town from "./components/Town/index";
import SocketProvider from "./context/SocketContext";

const App = () => {
  return (
    <div className="App">
      <SocketProvider>
        <Town />
        <SelectionList isGame={false}/>
      </SocketProvider>
    </div>
  );
};

export default App;
