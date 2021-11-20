import { useEffect } from "react";
import { useSocket, useSocketData } from "../../../../../context/SocketContext";
import { drawAvatar } from "../../../utils";
import * as TOWN from '../../../../../constants/index';

import "./style.scss";

const keyDownHandler = (event, canvas, ctx, img, MAP, sendCharPos) => {
  const [beforeX, beforeY, beforeSrc] = [TOWN.MY_AVATAR.x, TOWN.MY_AVATAR.y, TOWN.MY_AVATAR.avatarSrcPosition];

  switch (event.key) {
    case "ArrowLeft":
      TOWN.MY_AVATAR.x -= TOWN.STRIDE;
      TOWN.MY_AVATAR.avatarSrcPosition = 
      TOWN.MY_AVATAR.avatarSrcPosition === TOWN.LEFT_POS ? TOWN.LEFT_POS + TOWN.NEXT_POS : TOWN.LEFT_POS;
      break;
    case "ArrowUp":
      TOWN.MY_AVATAR.y -= TOWN.STRIDE;
      TOWN.MY_AVATAR.avatarSrcPosition =
      TOWN.MY_AVATAR.avatarSrcPosition === TOWN.UP_POS ? TOWN.UP_POS + TOWN.NEXT_POS : TOWN.UP_POS;
      break;
    case "ArrowRight":
      TOWN.MY_AVATAR.x += TOWN.STRIDE;
      TOWN.MY_AVATAR.avatarSrcPosition =
      TOWN.MY_AVATAR.avatarSrcPosition !== TOWN.RIGHT_POS ? TOWN.RIGHT_POS : TOWN.RIGHT_POS + TOWN.NEXT_POS;
      break;
    case "ArrowDown":
      TOWN.MY_AVATAR.y += TOWN.STRIDE;
      TOWN.MY_AVATAR.avatarSrcPosition =
      TOWN.MY_AVATAR.avatarSrcPosition !== TOWN.DOWN_POS ? TOWN.DOWN_POS : TOWN.DOWN_POS + TOWN.NEXT_POS;
      break;
    default:
      break;
  }

  if (
    !avatarConflictCheck(
      MAP,
      beforeX,
      beforeY,
      TOWN.MY_AVATAR.x,
      TOWN.MY_AVATAR.y
    )
  ) {
    [TOWN.MY_AVATAR.x,TOWN.MY_AVATAR.y, TOWN.MY_AVATAR.avatarSrcPosition] = [beforeX, beforeY, beforeSrc];
    return;
  }

  canvas.closest(
    "div"
  ).style.transform = `translate(${TOWN.MY_AVATAR.x}px,${TOWN.MY_AVATAR.y}px)`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAvatar(ctx, img, TOWN.MY_AVATAR.avatarSrcPosition, canvas.width, canvas.height);

  const user_window_middle_width = window.innerWidth / 2;
  const user_window_middle_height = window.innerHeight / 2;
  const avatar_window_left = canvas.getBoundingClientRect().x;
  const avatar_window_top = canvas.getBoundingClientRect().y;
  const container = document.querySelector(".map-container");

  if (
    avatar_window_left >= user_window_middle_width &&
    event.key === "ArrowRight"
  ) {
    container.scroll(container.scrollLeft + TOWN.STRIDE, container.scrollTop);
  } else if (
    avatar_window_top >= user_window_middle_height &&
    event.key === "ArrowDown"
  ) {
    container.scroll(container.scrollLeft, container.scrollTop + TOWN.STRIDE);
  } else if (
    avatar_window_left < user_window_middle_width &&
    event.key === "ArrowLeft"
  ) {
    container.scroll(container.scrollLeft - TOWN.STRIDE, container.scrollTop);
  } else if (
    avatar_window_top < user_window_middle_height &&
    event.key === "ArrowUp"
  ) {
    container.scroll(container.scrollLeft, container.scrollTop - TOWN.STRIDE);
  }

  sendCharPos(TOWN.MY_AVATAR);
};

const avatarConflictCheck = (MAP, sX, sY, dX, dY) => {
  let tmpsX = sX < dX ? sX : dX;
  let tmpdX = sX > dX ? sX : dX;
  let tmpsY = sY < dY ? sY : dY;
  let tmpdY = sY > dY ? sY : dY;

  if (
    !(
      0 <= tmpdX &&
      tmpdX < MAP[0].length &&
      0 <= tmpdY &&
      tmpdY < MAP.length
    )
  )
    return false;

  for (let i = tmpsX; i < tmpdX; i++) {
    for (let j = tmpsY; j < tmpdY; j++) {
      if (MAP[i][j] !== 0) {
        return false;
      }
    }
  }

  return true;
};

const Avatar = () => {
  const { nickname, avatarIdx } = useSocketData();
  const socketClient = useSocket();

  useEffect(() => {
    if(!socketClient) return;
    const avatarCanvas = document.getElementById('my-avatar');
    const ctx = avatarCanvas.getContext("2d");
    const img = new Image();

    img.src = `/images/avatar/avatar${avatarIdx}.png`;
    img.onload = function () {
      avatarCanvas.width = img.naturalWidth / 16 + 20;
      avatarCanvas.height = img.naturalHeight + 20;

      avatarCanvas.closest(
        "div"
      ).style.transform = `translate(${TOWN.MY_AVATAR.x}px,${TOWN.MY_AVATAR.y}px)`;
      drawAvatar(ctx, img, TOWN.MY_AVATAR.avatarSrcPosition, avatarCanvas.width, avatarCanvas.height);
    };

    const throttle = (callback, delay) => {
      let timerId;
      return (event) => {
        if (timerId) return;
        timerId = setTimeout(
          () => {
            callback(event);
            timerId = null;
          },
          delay,
          event
        );
      };
    };
    
    const sendCharPos = () => {
      if (socketClient) {
        socketClient.emit("user position update", TOWN.MY_AVATAR);
      }
    };

    const keyDownEventListener = (event) => {
      keyDownHandler(event, avatarCanvas, ctx, img, TOWN.MAP, sendCharPos);
    };

    const throttledKeydown = throttle(keyDownEventListener, 75);
    if (nickname) {
      window.addEventListener("keydown", throttledKeydown);
    }

    return () => {
      window.removeEventListener("keydown", throttledKeydown);
    };
  }, [nickname, avatarIdx]);
  return (
    <>
      <div className={"avatar"}>
        <canvas id='my-avatar'></canvas>
        <p>{nickname}</p>
      </div>
    </>
  );
};

export default Avatar;
