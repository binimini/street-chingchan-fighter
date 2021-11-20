const PICK_PRAISE = "pick praise";
const SEND_ANSWER = "send answer";
const PUBLISH_RESULT = "publish result";

let instance = {};
class RoomStore {
  constructor() {
    if (instance) return instance;
    instance = this;
  }
}

const initGameSocket = (namespace, socket) => {
  const roomStore = new RoomStore();
  socket.on(PICK_PRAISE, (pick) => {
    const { roomId, praiseId } = pick;
    if (!roomStore[roomId]) {
      roomStore[roomId] = {
        user1: { id: socket.id, pick: praiseId },
        user2: "",
      };
    } else {
      roomStore[roomId].user2 = { id: socket.id, pick: praiseId };
    }
    // console.log(roomStore);
  });

  socket.on(SEND_ANSWER, (pick) => {
    sendResult(socket, pick);
  });
};

const sendResult = (socket, pick) => {
  const roomStore = new RoomStore();
  const { roomId, praiseId } = pick;
  const roomData = roomStore[roomId];
  if (socket.id === roomData.user1.id) {
    socket.emit(PUBLISH_RESULT, roomData.user2.pick === praiseId);
  } else {
    socket.emit(PUBLISH_RESULT, roomData.user1.pick === praiseId);
  }
};

module.exports = initGameSocket;
