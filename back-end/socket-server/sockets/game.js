const praises = require("../constants/index");

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
const INIT_PRAISE = "init praise";

const initGameSocket = (namespace, socket) => {
  const roomStore = new RoomStore();
  socket.on(INIT_PRAISE, () => socket.emit(INIT_PRAISE, praises));

  socket.on(PICK_PRAISE, (pick) => {
    const { roomId, praiseId } = pick;
    if (!roomStore[roomId]) {
      roomStore[roomId] = {
        user1: { id: socket.id, pick: praiseId },
        user2: "",
      };
    } else {
      if (roomStore[roomId].user1.id == socket.id) {
        roomStore[roomId].user1.pick = praiseId;
      } else {
        roomStore[roomId].user2 = { id: socket.id, pick: praiseId };
      }
    }
    namespace.to(roomId).emit("fight ready", { roomID: roomId });
  });

  socket.on(SEND_ANSWER, ({ roomId, praiseId }) => {
    sendResult(io, { roomId, praiseId });
  });
};

const sendAnswer = (io, roomId) => {
  const roomStore = new RoomStore();
  const roomData = roomStore[roomId];
  io.to(roomData.user1.id).emit(GET_ANSWER, roomData.user2.pick);
  io.to(roomData.user2.id).emit(GET_ANSWER, roomData.user1.pick);
};

const sendResult = (io, pick) => {
  const roomStore = new RoomStore();
  const { roomId, praiseId } = pick;
  const roomData = roomStore[roomId];
  if (socket.id === roomData.user1.id) {
    io.to(roomData.user1.id).emit(
      PUBLISH_RESULT,
      roomData.user2.pick === praiseId
    );
  } else {
    io.to(roomData.user2.id).emit(
      PUBLISH_RESULT,
      roomData.user1.pick === praiseId
    );
  }
};

module.exports = initGameSocket;
