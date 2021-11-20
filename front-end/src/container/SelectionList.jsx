import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import Selection from "../components/Selection/Selection";
import { praiseList } from "../dummy.json";

const GET_ANSWER = "get answer";
const PUBLISH_RESULT = "publish result";
const INIT_PRAISE = "init praise";
const FIGHT_READY = "fight ready";
const GAME_RESULT = "game result";
const SELECTION_COUNT = 3;


const SelectionList = () => {
  const socketClient = useSocket();
  const [answerID, setAnswerID] = useState(0);
  const [isGame, setIsGame] = useState(false);
  const [praises, setPraises] = useState([]);

  useEffect(() => {
    socketClient.on(INIT_PRAISE, (praises) => setPraises(praises));
    socketClient.emit(INIT_PRAISE);
    return () => {
      socketClient.off(INIT_PRAISE);
    };
  }, [socketClient]);

  useEffect(() => {
    if (socketClient) {
      socketClient.on(FIGHT_READY, ({roomId, praises}) => {
        setPraises(praises);
        setIsGame(true);
      });

      socketClient.on(PUBLISH_RESULT, (win) => {
        console.log(win);
      });
      socketClient.on(INIT_PRAISE, (praises) => setPraises(praises));
      socketClient.emit(INIT_PRAISE);
      socketClient.on(GAME_RESULT, (data) => {console.log(data)})
    }
    return () => {
      socketClient.off(INIT_PRAISE);
      socketClient.off(PUBLISH_RESULT);
      socketClient.off(GET_ANSWER);
    };
  }, [socketClient]);

  return (
    <>
      {isGame
        ? praises.map((praise) => (
            <Selection
              key={`${praise.id}${isGame}${Date.now()}`}
              praise={praise}
              isGame={isGame}
            />
          ))
        : praises.map((praise) => (
            <Selection
              key={`${praise.id}${isGame}${Date.now()}`}
              praise={praise}
              isGame={isGame}
            />
          ))}
    </>
  );
};

export default SelectionList;
