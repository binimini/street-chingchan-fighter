import TownMap from "./TownMap";
import { useSocket, useSocketData } from "../../context/SocketContext";
import "./style.scss";
import { useEffect } from "react";

const Town = () => {
  const socketClient = useSocket();
  const { userList } = useSocketData();

  const gameApplyHandler = (e) => {
    const target = e.target;

    if(!target.closest('.avatar')) return;
    if(target.id === 'my-avatar') {
      alert('자신에게 칭찬 배틀을 신청할 수 없습니다.');
      return;
    }
    
    const battleTarget = userList.find((u) => u.id === target.id);

    if(window.confirm(`${battleTarget.nickname}님께 칭찬 배틀을 신청하시겠습니까?`)) {
      alert('상대방이 수락하면 칭찬 배틀이 시작됩니다.');
      socketClient.emit("apply fight", battleTarget.id);
    }
  }

  useEffect(() => {
    socketClient.on("will fight", (id) => {
      const target = userList.find((u) => u.id === id);

      if(window.confirm(`${target.nickname}님께서 칭찬 배틀을 신청하셨습니다. 수락하시겠습니까?`)) {
        socketClient.emit("init fight", id);
      }
      else {
        socketClient.emit("reject fight", id);
      }
    });

    socketClient.on("reject your fight", (nickname) => {
      alert(`${nickname}님이 칭찬 배틀을 거절하셨습니다. 다음에 다시 도전해보세요!!`);
    });
  }, []);

  return (
    <>
      <div className={"town-map"} onClick={gameApplyHandler}>
        <TownMap />
      </div>
    </>
  );
};

export default Town;
