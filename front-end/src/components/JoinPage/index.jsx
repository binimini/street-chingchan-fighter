import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import MessageBox from "../MessageBox";
import "./style.scss";

function JoinPage() {
  const [avatarIdx, setAvatarId] = useState(0);
  const nickNameRef = useRef();
  const canvasContainer = useRef();
  const MAX_AVATARIDX = 5;

  const socketClient = useSocket();
  const handleNicknameInput = (e) => {
    if (e.key === "Enter" && `${nickNameRef.current.value}`.trim().length > 0) {
      socketClient.emit("set nickname", nickNameRef.current.value);
    }
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
    <div className="join__page--bg">
      <div className="join__page__appbar">* 스트릿 칭찬 파이터 *</div>
      <div className="join__page__content">
        <div className="message__box__container">
          <MessageBox variant="md">
            <p>스트릿 칭찬 파이터님!</p>
            <p>“칭찬 배틀” 하러 떠나볼까요?</p>
            <p>☜(ﾟヮﾟ☜)</p>
          </MessageBox>
        </div>
        <div className="join__image__container">
          <div
            className="join__image__arrow"
            onClick={() => changeAvartarId(-1)}
          >{`<`}</div>
          <div className="join__image">
            <canvas width="32" height="32" ref={canvasContainer}></canvas>
          </div>
          <div
            className="join__image__arrow"
            onClick={() => changeAvartarId(1)}
          >{`>`}</div>
        </div>
        <div className="input__container">
          <input
            className="nickname__input"
            type="text"
            placeholder="닉네임을 입력해주세요."
            onKeyDown={handleNicknameInput}
            ref={nickNameRef}
          />
        </div>
      </div>
    </div>
  );
}

export default JoinPage;
