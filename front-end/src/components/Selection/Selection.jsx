import { useEffect } from "react";
import { useSocket, useSocketData } from "../../context/SocketContext";
const PICK_PRAISE = 'pick praise';
const SEND_ANSWER = 'send answer';
const PUBLISH_RESULT = 'publish result';

const Selection = ({praise, isResult}) => {
  const socketClient = useSocket();
  const {roomID} = useSocketData();

  const handleClickBeforeGame = (praise) => {
    socketClient.emit(PICK_PRAISE, {
      roomId: roomID,
      socketId: socketClient.id,
      praiseId: praise.id
    });
  }
  const handleClickAfterGame = (praise) => {
    socketClient.emit(SEND_ANSWER, {
      roomId: roomID,
      socketId: socketClient.id,
      praiseId: praise.id
    });
  }

  return (
    <button onClick={isResult ? handleClickAfterGame(praise) : handleClickBeforeGame(praise)}>{praise.text}</button>
  );
}

export default Selection;