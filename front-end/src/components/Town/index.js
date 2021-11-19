import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";

const Town = () => {
  const socketClient = useSocket();
  useEffect(() => {
    if (socketClient) {
      socketClient.emit("hello");
    }
  }, [socketClient]);

  return <div>hello</div>;
};

export default Town;
