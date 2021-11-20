import { useSocket, useSocketData } from "../../context/SocketContext";

const PICK_PRAISE = 'pick praise';
const SEND_ANSWER = 'send answer';

const useSelection = (praise) => {
    const socketClient = useSocket();
    const {roomID} = useSocketData();

  const handleClickBeforeGame = () => {
    if (socketClient) {
    socketClient.emit(PICK_PRAISE, {
      roomId: roomID,
      socketId: socketClient.id,
      praiseId: praise.id
    });
  }
  }
  const handleClick = () => {
    if (socketClient) {
    socketClient.emit(SEND_ANSWER, {
      roomId: roomID,
      socketId: socketClient.id,
      praiseId: praise.id
    });
  }
  }

  return {handleClickBeforeGame, handleClick}
}

export default useSelection;