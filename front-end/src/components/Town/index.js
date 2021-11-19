import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import TownMap from "./TownMap";

const Town = () => {
  const socketClient = useSocket();
  useEffect(() => {
    if (socketClient) {
      socketClient.emit("hello");
    }
  }, [socketClient]);

  return (
    <>
      <div>
        <TownMap />
      </div>
    </>
  )
};

export default Town;
