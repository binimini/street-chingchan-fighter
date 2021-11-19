import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import TownMap from "./TownMap";

import './style.scss';

const Town = () => {
  return (
    <>
      <div className={'town-map'}>
        <TownMap />
      </div>
    </>
  )
};

export default Town;
