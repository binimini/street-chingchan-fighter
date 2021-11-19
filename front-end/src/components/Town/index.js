import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import TownMap from "./TownMap";

import './style.scss';

const Town = () => {
  const socketClient = useSocket();
  useEffect(() => {
    if (socketClient) {
      socketClient.emit("hello");
    }
  }, [socketClient]);

  return (
    <>
      <div className={'town-map'}>
        <TownMap />
      </div>
    </>
  )
};

export default Town;
