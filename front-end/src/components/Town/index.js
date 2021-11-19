import ChatContainer from "../ChatContainer";
import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";

const Town = () => {
  const socketClient = useSocket();
  useEffect(() => {
    if (socketClient) {
      socketClient.emit("hello");
    }
  }, [socketClient]);
  return (
    <div>
      <ChatContainer />
    </div>
  );
};

export default Town;
