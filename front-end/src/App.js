import "./App.css";
import SelectionList from "./container/SelectionList";
import Town from "./components/Town/index";
import SocketProvider from "./context/SocketContext";

const lst = ['1','2','3','4'];

const App = () => {
  
  return (
    <div className="App">
      <SocketProvider>
        <Town />
        <SelectionList praiseList={lst}/>
      </SocketProvider>
    </div>
  );
};

export default App;
