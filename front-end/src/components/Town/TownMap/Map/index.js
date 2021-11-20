import { useEffect } from "react";
import { useSocket, useSocketData } from "../../../../context/SocketContext";
import { drawAvatar } from "../../utils";
import Avatar from "./Avatar";
import Pedestrian from "./Pedestrian";

import "./style.scss";

const drawMap = () => {
  const mapCanvas = document.getElementById("map-canvas");
  const ctx = mapCanvas.getContext("2d");
  const img = new Image();

  img.src = "/images/map/map.png";
  img.onload = function () {
    mapCanvas.width = img.naturalWidth;
    mapCanvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };
};

const Map = () => {
  const { userList } = useSocketData();
  const socketClient = useSocket();

  useEffect(() => {
    drawMap();
  }, []);

  return (
    <>
      <div className={"map-container"}>
        <canvas id="map-canvas"></canvas>
        <Avatar />
        {userList
          .filter((u) => u.id !== socketClient.id && u.nickname)
          .map((u) => (
            <Pedestrian key={u.id} {...u} />
          ))}
      </div>
    </>
  );
};

export default Map;
