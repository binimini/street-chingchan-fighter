import { useCallback, useEffect } from "react";
import { useSocket, useSocketData } from "../../context/SocketContext";
import "./style.scss";

function Stage() {
  const socketClient = useSocket();
  const { userList, roomMembers, roomID, canStart, roomTime } = useSocketData();

  const initFight = (id) => {
    socketClient.emit("init fight", id);
  };

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

  if (!socketClient) {
    return <div>loading...</div>;
  }

  return (
    <>
      {!roomID ? (
        <div></div>
      ) : (
        <div className="room__container">
          {roomMembers.length > 0 &&
            roomMembers.map((id) => <div key={id}>{id}</div>)}

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
      )}
      {/* {userList.map(({ id }) => (
        <div
          key={id}
          className={id === socketClient.id ? "me" : ""}
          onClick={() => {
            if (id !== socketClient.id) {
              initFight(id);
            }
          }}
        >
          {id}
        </div>
      ))} */}
    </>
  );
}

export default Stage;
