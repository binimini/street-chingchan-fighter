const PICK_PRAISE = 'pick praise';
const SEND_ANSWER = 'send answer';
const GET_ANSWER = 'get answer';
const PUBLISH_RESULT = 'publish result';

const tempId = 'abc';

let instance = {};

class RoomStore {
  constructor() {
    if (instance) return instance;
    instance = this;
  }
}

const initGameSocket = (io, socket) => {
    const roomStore = new RoomStore();
    socket.on(PICK_PRAISE,(pick) => {
        const {roomId, praiseId } = pick;
        if(!roomStore[roomId]) {
            roomStore[roomId] = {user1: {id: socket.id, pick: praiseId}, user2: {id: null, pick: null}};
        }
        else{
            roomStore[roomId].user2 = {id: socket.id, pick: praiseId};
            sendAnswer(io, roomId);
        }
        console.log(roomStore[roomId])
    });

    socket.on(SEND_ANSWER, ({roomId, praiseId}) => {
        sendResult(io, {roomId, praiseId});
    })
};

const sendAnswer = (io, roomId) => {
    const roomStore = new RoomStore();
    const roomData = roomStore[roomId];
    io.to(roomData.user1.id).emit(GET_ANSWER, roomData.user2.pick);
    io.to(roomData.user2.id).emit(GET_ANSWER, roomData.user1.pick);
}

const sendResult = (io, pick) => {
    const roomStore = new RoomStore();
    const {roomId, praiseId} = pick;
    const roomData = roomStore[roomId];
    if(socket.id === roomData.user1.id){
        io.to(roomData.user1.id).emit(PUBLISH_RESULT, roomData.user2.pick === praiseId);
    }
    else{
        io.to(roomData.user2.id).emit(PUBLISH_RESULT, roomData.user1.pick === praiseId);
    }
}

module.exports = initGameSocket;
