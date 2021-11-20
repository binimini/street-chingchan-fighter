import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import Selection from "../components/Selection/Selection";
import { praiseList } from "../dummy.json";

const GET_ANSWER = "get answer";
const PUBLISH_RESULT = "publish result";
const SELECTION_COUNT = 3;
const INIT_PRAISE = "init praise";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getAnswerIndex = (answerID) => {
  let answerIdx = -1;
  praiseList.forEach((el, idx) => {
    if (el.id === answerID) {
      answerIdx = idx;
      return;
    }
  });
  return answerIdx;
};

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

const getRamdomPraiseList = (cnt, answerId) => {
  const arr = [];
  const answerIdx = getAnswerIndex(answerId);
  while (arr.length < cnt - 1) {
    const randInt = getRandomInt(0, praiseList.length);
    if (!arr.includes(randInt) && randInt !== answerIdx) {
      arr.push(randInt);
    }
  }
  arr.push(answerIdx);
  return shuffle(arr.map((idx) => praiseList[idx]));
};

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
      socketClient.on(GET_ANSWER, (praiseId) => {
        setAnswerID(praiseId);
        setIsGame(true);
      });

      socketClient.on(PUBLISH_RESULT, (win) => {
        console.log(win);
      });
      socketClient.on(INIT_PRAISE, (praises) => setPraises(praises));
      socketClient.emit(INIT_PRAISE);
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
        ? getRamdomPraiseList(SELECTION_COUNT, answerID).map((praise) => (
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
