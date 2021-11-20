import { useCallback, useEffect, useState } from "react";
import { useSocket, useSocketData } from "../../context/SocketContext";
import MessageBox from "../MessageBox";
import SelectionList from "../../container/SelectionList";

import "./style.scss";
import ResultCard from "../ResultCard";
import Button from "../Button";

const FIGHT_READY = "fight ready";

function Stage() {
  const socketClient = useSocket();
  const [title, setTitle] = useState("* 받고싶은 칭찬을 골라주세요 *");
  const [content, setContent] = useState(null);
  const {
    userList,
    roomMembers,
    roomID,
    canStart,
    roomTime,
    isFinished,
    gameResult,
  } = useSocketData();
  const [results, setResults] = useState([]);

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

  useEffect(() => {
    if (!socketClient) return;
    socketClient.on(FIGHT_READY, () => {
      setTitle("* 상대방을 위한 칭찬을 골라주세요 *");
      setContent("어떤 칭찬을 건내줄까요?");
    });

    socketClient.on("game result", (gameResult) => {
      setTitle("* 칭찬 배틀 결과 *");
      setResults([
        {
          title: `${gameResult.user1.nickname}님이 선택한 칭찬`,
          content: gameResult.user1.guess,
        },
        {
          title: `${gameResult.user2.nickname}님이 선택한 칭찬`,
          content: gameResult.user2.guess,
        },
        {
          title: `${gameResult.user2.nickname}님이 듣고 싶었던 칭찬`,
          content: gameResult.user2.pick,
        },
        {
          title: `${gameResult.user1.nickname}님이 듣고 싶었던 칭찬`,
          content: gameResult.user1.pick,
        },
      ]);
    });
  }, [roomMembers, socketClient]);

  const handleLeave = () => {
    console.log("leave");
    socketClient.emit("leave room", roomID);
  };
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
            {!isFinished ? (
              <>
                <div className="message_box__container">
                  <MessageBox variant="lg">
                    {content ? (
                      <p>
                        어떤 칭찬이{" "}
                        {
                          roomMembers.filter(
                            ({ id }) => id !== socketClient.id
                          )[0].nickname
                        }
                        님을 행복하게 만들까요?
                      </p>
                    ) : (
                      <p>
                        어떤 칭찬이{" "}
                        {
                          roomMembers.filter(
                            ({ id }) => id === socketClient.id
                          )[0].nickname
                        }
                        님을 행복하게 만들까요?
                      </p>
                    )}
                    <p>ヽ(✿ﾟ▽ﾟ)ノ</p>
                  </MessageBox>
                </div>
                <div className="selection__container">
                  <SelectionList isGame={false} />
                </div>
              </>
            ) : (
              <>
                <div className="result__container">
                  {results.map((r) => (
                    <ResultCard key={r.title} {...r} />
                  ))}
                </div>

                <Button title={"나가기"} onClick={handleLeave} />
              </>
            )}

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
