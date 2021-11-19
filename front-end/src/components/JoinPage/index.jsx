import { useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import MessageBox from "../MessageBox";
import "./style.scss";

function JoinPage() {
  const nickNameRef = useRef();
  const socketClient = useSocket();
  const handleNicknameInput = (e) => {
    if (e.key === "Enter") {
      socketClient.emit("set nickname", nickNameRef.current.value);
    }
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
        <div style={{ textAlign: "center" }}>"해줘"</div>

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
