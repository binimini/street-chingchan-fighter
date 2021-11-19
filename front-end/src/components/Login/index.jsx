import React, { useState } from "react";
import "./style.scss";

export default function Login() {
  const [avatarIdx, setAvatarId] = useState(0);
  const MAX_AVATARIDX = 5;

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
          <canvas width="100" height="130"></canvas>
        </div>
        <div
          className="login__image__arrow"
          onClick={() => changeAvartarId(1)}
        >{`>`}</div>
      </div>
      <div className="login__nickname__container">
        <input
          className="login__nickname__input"
          placeholder="닉네임을 입력해주세요."
        />
      </div>
    </div>
  );
}
