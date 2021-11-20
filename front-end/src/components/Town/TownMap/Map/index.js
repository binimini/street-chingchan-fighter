import { useEffect } from "react";
import { useSocket, useSocketData } from "../../../../context/SocketContext";
import Avatar from "./Avatar";

import "./style.scss";

const drawMap = () => {
  const mapCanvas = document.getElementById("map-canvas");
  const ctx = mapCanvas.getContext("2d");

  const img = new Image();
  img.onload = function () {
    mapCanvas.width = img.naturalWidth;
    mapCanvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  img.src = "/images/map/map.png";
};

const drawAvatar = (ctx, img, src_x_pos, width, height) => {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(
    img,
    src_x_pos,
    0,
    img.naturalWidth / 16,
    img.naturalHeight,
    0,
    0,
    width,
    height
  );
};

const Map = () => {
  const { userList } = useSocketData();
  const socketClient = useSocket();

  useEffect(() => {
    drawMap();
  }, []);

  useEffect(() => {
    if(!userList) return;

    userList.forEach((u) => {
      if(!u.nickname) return;
      if(u.id === socketClient.id) return;

      const avatarCanvas = document.querySelector(`#${u.id}`);
      const ctx = avatarCanvas.getContext('2d');
      const img = new Image();

      img.src = `/images/avatars/light_formaldress_red_brown.png`;
      img.onload = () => {
        avatarCanvas.width = img.naturalWidth / 16 + 20;
        avatarCanvas.height = img.naturalHeight + 20;

        avatarCanvas.closest('div').style.transform = `translate(${u.x}px,${u.y}px)`;
        drawAvatar(ctx, img, u.avatarSrcPosition, avatarCanvas.width, avatarCanvas.height);
      }
    });

  }, [userList])

  return (
    <>
      <div className={"map-container"}>
        <canvas id="map-canvas"></canvas>
        <Avatar />
        {userList.map((u) => {
          if(!u.nickname) return;
          if(u.id === socketClient.id) return;
          
          return (
            <div className="avatar" key={u.id}>
              <canvas id={u.id}></canvas>
              <p>{u.nickname}</p>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default Map;
