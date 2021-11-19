import "./App.css";
import SelectionList from "./container/SelectionList";
import Town from "./components/Town/index";
import SocketProvider from "./context/SocketContext";
import {praiseList} from "./dummy.json";

const App = () => {
  return (
    <div className="App">
      <SocketProvider>
        <Town />
        <SelectionList praiseList={praiseList}/>
      </SocketProvider>
    </div>
  );
};

export default App;
