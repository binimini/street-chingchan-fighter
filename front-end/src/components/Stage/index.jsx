import { useCallback, useEffect, useState } from "react";
import { useSocket, useSocketData } from "../../context/SocketContext";
import MessageBox from "../MessageBox";
import SelectionList from "../../container/SelectionList";

import "./style.scss";

const FIGHT_READY = "fight ready";

function Stage() {
  const socketClient = useSocket();
  const { userList, roomMembers, roomID, canStart, roomTime } = useSocketData();
  const [title, setTitle] = useState('* 받고싶은 칭찬을 골라주세요 *');
  const [content, setContent] = useState(null);

  const handleFightStart = () => {
    socketClient.emit("fight start", roomID);
  };

  const gameTriggerHandler = useCallback(
    (e) => {
      if (e.key === " ") {
        console.log("start");
        const [target] = userList.filter((u) => u.id !== socketClient.id);
        socketClient.emit("init fight", target.id);
      }
    },
    [socketClient, userList]
  );

  useEffect(() => {
    window.addEventListener("keydown", gameTriggerHandler);

    return () => {
      window.removeEventListener("keydown", gameTriggerHandler);
    };
  }, [gameTriggerHandler]);

  useEffect(()=>{
    if(!socketClient) return;
    socketClient.on(FIGHT_READY, ()=>{
      setTitle('* 상대방을 위한 칭찬을 골라주세요 *');
      setContent("어떤 칭찬을 건내줄까요?");
    })
  },[socketClient])

  if (!socketClient) {
    return <div>loading...</div>;
  }

  return (
    <>
      {!roomID ? (
        <div></div>
      ) : (
        <div className="room__container">
          <div className="room__title">{title}</div>
          <div className="room__content">
            <div className="message_box__container">
              <MessageBox variant="lg">
                { content? <p>
                  어떤 칭찬이{" "}
                  {
                    roomMembers.filter(({ id }) => id !== socketClient.id)[0]
                      .nickname
                  }
                  님을 행복하게 만들까요?
                </p> :
                  <p>
                  어떤 칭찬이{" "}
                  {
                    roomMembers.filter(({ id }) => id === socketClient.id)[0]
                      .nickname
                  }
                  님을 행복하게 만들까요?
                </p>}
                <p>ヽ(✿ﾟ▽ﾟ)ノ</p>
              </MessageBox>
            </div>
            <div className="selection__container">
              <SelectionList/>
            </div>

            {roomMembers.length > 0 &&
              roomMembers.map(({ id, nickname }) => (
                <div key={id}>
                  {id} {nickname}
                </div>
              ))}

            <button
              className="room__start_btn"
              disabled={!canStart}
              onClick={handleFightStart}
            >
              Start
            </button>
            <div>시간 : {roomTime}</div>
            <div>room# : {roomID}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Stage;
