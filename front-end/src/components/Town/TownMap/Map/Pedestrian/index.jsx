import { useEffect, useRef } from "react";
import { useSocket } from "../../../../../context/SocketContext";
import { drawAvatar } from "../../../utils";

function Pedestrian({ id, nickname, avatarIdx, avatarSrcPosition, x, y }) {
  const socketClient = useSocket();
  const canvasRef = useRef();

  console.log(x, y, nickname);

  useEffect(() => {
    if (!nickname) return;

    const avatarCanvas = canvasRef.current;
    const ctx = avatarCanvas.getContext("2d");
    const img = new Image();

    img.src = `/images/avatar/avatar${avatarIdx}.png`;
    img.onload = () => {
      avatarCanvas.width = img.naturalWidth / 16 + 20;
      avatarCanvas.height = img.naturalHeight + 20;

      avatarCanvas.closest("div").style.transform = `translate(${x}px,${y}px)`;
      drawAvatar(
        ctx,
        img,
        avatarSrcPosition,
        avatarCanvas.width,
        avatarCanvas.height
      );
    };
  }, [avatarIdx, avatarSrcPosition, id, nickname, socketClient.id, x, y]);
  return (
    <div className="avatar" key={id}>
      <canvas id={id} ref={canvasRef}></canvas>
      <p>{nickname}</p>
    </div>
  );
}

export default Pedestrian;
