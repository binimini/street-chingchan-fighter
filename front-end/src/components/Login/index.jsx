import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

export default function Login() {
  const [avatarIdx, setAvatarId] = useState(0);
  const MAX_AVATARIDX = 5;
  const canvasContainer = useRef();
  const nickNameRef = useRef();

  const submit = () => {
    console.log(nickNameRef.current.value);
    //
  };

  useEffect(() => {
    const canvas = canvasContainer.current;
    const ctx = canvas.getContext("2d");
    const player = new Image();
    player.src = `/images/avatar/avatar${avatarIdx + 1}.png`;
    ctx.clearRect(0, 0, 32, 32);
    player.onload = () => {
      ctx.drawImage(player, 0, 0, 32, 32, 0, 0, 32, 32);
    };
    return () => {};
  }, [avatarIdx]);

  const changeAvartarId = (diff) => {
    const nowIdx = avatarIdx + diff;
    if (nowIdx < 0) setAvatarId((nowIdx % MAX_AVATARIDX) + MAX_AVATARIDX);
    else if (nowIdx >= MAX_AVATARIDX) setAvatarId(nowIdx % MAX_AVATARIDX);
    else setAvatarId(nowIdx);
  };

  return (
    <div className="login__container">
      <div className="login__header">{`* 스트릿 칭찬 파이터 *`}</div>
      <div className="login__text">{`스트릿 칭찬 파이터님!\n“칭찬 배틀” 하러 떠나볼까요?\n☜(ﾟヮﾟ☜)`}</div>
      <div className="login__image__container">
        <div
          className="login__image__arrow"
          onClick={() => changeAvartarId(-1)}
        >{`<`}</div>
        <div className="login__image">
          <canvas width="32" height="32" ref={canvasContainer}></canvas>
        </div>
        <div
          className="login__image__arrow"
          onClick={() => changeAvartarId(1)}
        >{`>`}</div>
      </div>
      <div className="login__nickname__container">
        <input
          ref={nickNameRef}
          className="login__nickname__input"
          placeholder="닉네임을 입력해주세요."
        />
      </div>
      <button className="login__button" onClick={submit}>
        배틀장 입장
      </button>
    </div>
  );
}
