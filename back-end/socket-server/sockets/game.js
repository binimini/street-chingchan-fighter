const praises = require("../constants/index");

const PICK_PRAISE = "pick praise";
const SEND_ANSWER = "send answer";
const PUBLISH_RESULT = "publish result";
const GAME_RESULT = "game result";
const GUESS_PRAISE = "guess praise";

let instance = {};

class RoomStore {
  constructor() {
    if (instance) return instance;
    instance = this;
  }
}
const INIT_PRAISE = "init praise";

const initGameSocket = (io, namespace, socket) => {
  const roomStore = new RoomStore();
  socket.on(INIT_PRAISE, () => socket.emit(INIT_PRAISE, praises));

  socket.on(PICK_PRAISE, (pick) => {
    const { roomId, praiseId } = pick;
    if (!roomStore[roomId]) {
      roomStore[roomId] = {
        user1: { id: socket.id, pick: praiseId, nickname: socket.nickname },
        user2: "",
      };
    } else {
      if (roomStore[roomId].user1.id == socket.id) {
        roomStore[roomId].user1.pick = praiseId;
      } else {
        roomStore[roomId].user2 = {
          id: socket.id,
          pick: praiseId,
          nickname: socket.nickname,
        };
      }
    }
    if (roomStore[roomId].user1.pick && roomStore[roomId].user2.pick) {
      io.to(roomStore[roomId].user1.id).emit("fight ready", {
        roomID: roomId,
        praises: getRamdomPraiseList(3, roomStore[roomId].user2.pick),
        other: roomStore[roomId].user2.id,
      });
      io.to(roomStore[roomId].user2.id).emit("fight ready", {
        roomID: roomId,
        praises: getRamdomPraiseList(3, roomStore[roomId].user1.pick),
        other: roomStore[roomId].user1.id,
      });
    }
  });

  socket.on(GUESS_PRAISE, ({ roomId, praiseId }) => {
    if (roomStore[roomId].user1.id == socket.id) {
      roomStore[roomId].user2.guess = praiseId;
    } else {
      roomStore[roomId].user1.guess = praiseId;
    }
    if (roomStore[roomId].user1.guess && roomStore[roomId].user2.guess) {
      console.log(roomStore);
      const user1 = roomStore[roomId].user1;
      const user2 = roomStore[roomId].user2;
      namespace.to(roomId).emit(GAME_RESULT, {
        user1: {
          id: user1.id,
          pick: praises[user1.pick].text,
          guess: praises[user1.guess].text,
          result: user1.pick == user1.guess,
          nickname: user1.nickname,
        },
        user2: {
          id: user2.id,
          pick: praises[user2.pick].text,
          guess: praises[user2.guess].text,
          result: user2.pick == user2.guess,
          nickname: user2.nickname,
        },
      });
    }
  });
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getAnswerIndex = (answerID) => {
  let answerIdx = -1;
  praises.forEach((el, idx) => {
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
    const randInt = getRandomInt(0, praises.length);
    if (!arr.includes(randInt) && randInt !== answerIdx) {
      arr.push(randInt);
    }
  }
  arr.push(answerIdx);
  return shuffle(arr.map((idx) => praises[idx]));
};

module.exports = initGameSocket;
