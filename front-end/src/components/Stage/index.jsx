import { useEffect } from "react";
import { useSocket, useSocketData } from "../../context/SocketContext";

function Stage() {
  const socketClient = useSocket();
  const { userList, roomMembers, roomID, canStart, roomTime } = useSocketData();
  useEffect(() => {
    if (socketClient) {
      socketClient.emit("hello");
    }
  }, [socketClient]);

  const initFight = (id) => {
    socketClient.emit("init fight", id);
  };

  const handleFightStart = () => {
    socketClient.emit("fight start", roomID);
  };

  if (!socketClient) {
    return <div>loading...</div>;
  }
  return (
    <>
      {userList.map(({ id }) => (
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
      ))}
      <div
        className="room__container"
        style={{
          width: "500px",
        }}
      >
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
    </>
  );
}

export default Stage;
