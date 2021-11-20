import { useEffect } from "react";
import { useSocket, useSocketData } from "../../../../../context/SocketContext";

import "./style.scss";

const makeMapArray = (width, height) => {
  return Array(height)
    .fill(0)
    .map((_, row_idx, row_arr) =>
      Array(width)
        .fill(1)
        .map((_, col_idx, col_arr) => {
          if (
            row_idx === 0 ||
            row_idx === row_arr.length - 1 ||
            col_idx === 0 ||
            col_idx === col_arr.length - 1
          )
            return 1;
          return 0;
        })
    );
};

const main_map_arr = makeMapArray(2448, 2144);

const MY_AVATAR = {
  x: 0,
  y: 0,
  avatarSrcPosition: 0,
};

const LEFT_POS = 128;
const RIGHT_POS = 320;
const UP_POS = 224;
const DOWN_POS = 32;
const NEXT_POS = 32;
const STRIDE = 52;

let avatarSrcPosition = 0;

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

const keyDownHandler = (event, canvas, ctx, img, main_map_arr, sendCharPos) => {
  const [beforeX, beforeY] = [MY_AVATAR.x, MY_AVATAR.y];

  switch (event.key) {
    case "ArrowLeft":
      MY_AVATAR.x -= STRIDE;
      avatarSrcPosition =
        avatarSrcPosition === LEFT_POS ? LEFT_POS + NEXT_POS : LEFT_POS;
      break;
    case "ArrowUp":
      MY_AVATAR.y -= STRIDE;
      avatarSrcPosition =
        avatarSrcPosition === UP_POS ? UP_POS + NEXT_POS : UP_POS;
      break;
    case "ArrowRight":
      MY_AVATAR.x += STRIDE;
      avatarSrcPosition =
        avatarSrcPosition !== RIGHT_POS ? RIGHT_POS : RIGHT_POS + NEXT_POS;
      break;
    case "ArrowDown":
      MY_AVATAR.y += STRIDE;
      avatarSrcPosition =
        avatarSrcPosition !== DOWN_POS ? DOWN_POS : DOWN_POS + NEXT_POS;
      break;
    default:
      break;
  }

  if (
    !avatarConflictCheck(
      main_map_arr,
      beforeX,
      beforeY,
      MY_AVATAR.x,
      MY_AVATAR.y
    )
  ) {
    [MY_AVATAR.x, MY_AVATAR.y] = [beforeX, beforeY];
    return;
  }

  canvas.closest(
    "div"
  ).style.transform = `translate(${MY_AVATAR.x}px,${MY_AVATAR.y}px)`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAvatar(ctx, img, avatarSrcPosition, canvas.width, canvas.height);

  const user_window_middle_width = window.innerWidth / 2;
  const user_window_middle_height = window.innerHeight / 2;
  const avatar_window_left = canvas.getBoundingClientRect().x;
  const avatar_window_top = canvas.getBoundingClientRect().y;
  const container = document.querySelector(".map-container");

  if (
    avatar_window_left >= user_window_middle_width &&
    event.key === "ArrowRight"
  ) {
    container.scroll(container.scrollLeft + STRIDE, container.scrollTop);
  } else if (
    avatar_window_top >= user_window_middle_height &&
    event.key === "ArrowDown"
  ) {
    container.scroll(container.scrollLeft, container.scrollTop + STRIDE);
  } else if (
    avatar_window_left < user_window_middle_width &&
    event.key === "ArrowLeft"
  ) {
    container.scroll(container.scrollLeft - STRIDE, container.scrollTop);
  } else if (
    avatar_window_top < user_window_middle_height &&
    event.key === "ArrowUp"
  ) {
    container.scroll(container.scrollLeft, container.scrollTop - STRIDE);
  }

  MY_AVATAR.avatarSrcPosition = avatarSrcPosition;
  sendCharPos(MY_AVATAR);
};

const avatarConflictCheck = (main_map_arr, sX, sY, dX, dY) => {
  let tmpsX = sX < dX ? sX : dX;
  let tmpdX = sX > dX ? sX : dX;
  let tmpsY = sY < dY ? sY : dY;
  let tmpdY = sY > dY ? sY : dY;

  if (
    !(
      0 <= tmpdX &&
      tmpdX < main_map_arr[0].length &&
      0 <= tmpdY &&
      tmpdY < main_map_arr.length
    )
  )
    return false;

  for (let i = tmpsX; i < tmpdX; i++) {
    for (let j = tmpsY; j < tmpdY; j++) {
      if (main_map_arr[i][j] !== 0) {
        return false;
      }
    }
  }

  return true;
};

const Avatar = () => {
  const { nickname } = useSocketData();
  const socketClient = useSocket();

  useEffect(() => {
    if(!socketClient) return;
    const avatarCanvas = document.getElementById('#my-avatar');
    const ctx = avatarCanvas.getContext("2d");
    const img = new Image();

    img.src = `/images/avatars/light_formaldress_red_brown.png`;
    img.onload = function () {
      avatarCanvas.width = img.naturalWidth / 16 + 20;
      avatarCanvas.height = img.naturalHeight + 20;

      avatarCanvas.closest(
        "div"
      ).style.transform = `translate(${MY_AVATAR.x}px,${MY_AVATAR.y}px)`;
      drawAvatar(ctx, img, 0, avatarCanvas.width, avatarCanvas.height);
    };

    //img.src = `/images/avatars/${AVATAR_IMAGES[+avater_index]}`;

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
        socketClient.emit("user position update", MY_AVATAR);
      }
    };

    const keyDownEventListener = (event) => {
      keyDownHandler(event, avatarCanvas, ctx, img, main_map_arr, sendCharPos);
    };

    const throttledKeydown = throttle(keyDownEventListener, 75);
    if (nickname) {
      window.addEventListener("keydown", throttledKeydown);
    }

    return () => {
      window.removeEventListener("keydown", throttledKeydown);
    };
  }, [nickname]);
  return (
    <>
      <div className={"avatar"}>
        <canvas id='#my-avatar'></canvas>
        <p>{nickname}</p>
      </div>
    </>
  );
};

export default Avatar;
