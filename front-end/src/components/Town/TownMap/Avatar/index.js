import { useEffect } from "react";

import './style.scss';

const MY_AVATAR = {
  x: 0,
  y: 0
}

const LEFT_POS = 128;
const RIGHT_POS = 320;
const UP_POS = 224;
const DOWN_POS = 32;
const NEXT_POS = 32;
const STRIDE = 52;

let avatarSrcPosition = 0;

const drawAvatar = (ctx, img, src_x_pos, width, height) => {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, src_x_pos, 0, img.naturalWidth / 16, img.naturalHeight, 0, 0, width, height);
};

const keyDownHandler = (event, canvas, ctx, img) => {
  switch (event.key) {
    case 'ArrowLeft':
      MY_AVATAR.x -= STRIDE;
      avatarSrcPosition = avatarSrcPosition === LEFT_POS ? LEFT_POS + NEXT_POS : LEFT_POS;
      break;
    case 'ArrowUp':
      MY_AVATAR.y -= STRIDE;
      avatarSrcPosition = avatarSrcPosition === UP_POS ? UP_POS + NEXT_POS : UP_POS;
      break;  
    case 'ArrowRight':
      MY_AVATAR.x += STRIDE;
      avatarSrcPosition = avatarSrcPosition !== RIGHT_POS ? RIGHT_POS : RIGHT_POS + NEXT_POS;
      break;
    case 'ArrowDown':
      MY_AVATAR.y += STRIDE;
      avatarSrcPosition = avatarSrcPosition !== DOWN_POS ? DOWN_POS : DOWN_POS + NEXT_POS;
      break;
    default:
      break;
  }

  canvas.closest("div").style.transform = `translate(${MY_AVATAR.x}px,${MY_AVATAR.y}px)`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAvatar(ctx, img, avatarSrcPosition, canvas.width, canvas.height);
}

const Avatar = () => {
  useEffect(() => {
    const avatarCanvas = document.getElementById('test-id');
    const ctx = avatarCanvas.getContext("2d");
    const img = new Image();

    img.src = `/images/avatars/light_formaldress_red_brown.png`;
    img.onload = function () {
      avatarCanvas.width = img.naturalWidth / 16 + 20;
      avatarCanvas.height = img.naturalHeight + 20;

      avatarCanvas.closest("div").style.transform = `translate(${MY_AVATAR.x}px,${MY_AVATAR.y}px)`;
      drawAvatar(ctx, img, 0, avatarCanvas.width, avatarCanvas.height);
    };

    //img.src = `/images/avatars/${AVATAR_IMAGES[+avater_index]}`;

    const keyDownEventListener = (event) => {
      //keyDownHandler(event, avatar, avatar_canvas, ctx, img, main_map_arr, sendCharPos);
      keyDownHandler(event, avatarCanvas, ctx, img);
    }

    window.addEventListener('keydown', keyDownEventListener);

    return () => {
      window.removeEventListener('keydown', keyDownEventListener);
    }
  }, [])
  return (
    <>
      <div className={'avatar'}>
        <canvas id="test-id"></canvas>
        <p>test-id</p>
      </div>
    </>
  )
}

export default Avatar;