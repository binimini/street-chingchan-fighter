import { useSocket, useSocketData } from "../../context/SocketContext";

const PICK_PRAISE = "pick praise";
const SEND_ANSWER = "send answer";
const GAME_RESULT = "game result";
const GUESS_PRAISE = "guess praise";

const useSelection = (praise) => {
  const socketClient = useSocket();
  const { roomID } = useSocketData();

  const handleClickBeforeGame = () => {
    if (socketClient) {
      socketClient.emit(PICK_PRAISE, {
        roomId: roomID,
        praiseId: praise.id,
      });
    }
  };
  const handleClick = () => {
    if (socketClient) {
      socketClient.emit(GUESS_PRAISE, {
        roomId: roomID,
        praiseId: praise.id,
      });
    }
  };

  return { handleClickBeforeGame, handleClick };
};

export default useSelection;
