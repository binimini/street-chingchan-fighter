const PICK_PRAISE = 'pick praise';
const SEND_ANSWER = 'send answer';
const GET_ANSWER = 'get answer';
const PUBLISH_RESULT = 'publish result';
const FINISH = 'finish';

const tempId = 'abc';

let instance = {};
class RoomStore {
    constructor() {
        if(instance) return instance;
        instance = this;
    }
}

const initGameSocket = (io, socket) => {
    const roomStore = new RoomStore();
    socket.on(PICK_PRAISE,(pick) => {
        const {socketId, praiseId } = pick;
        const roomId = tempId; //임시
        if(!roomStore[roomId]) {
            roomStore[roomId] = {user1: {id: socketId, pick: praiseId}, user2: {id: null, pick: null}};
        }
        else{
            roomStore[roomId].user2 = {id: socketId, pick: praiseId};
            sendAnswer(io, roomId);
        }
        console.log(roomStore[roomId])
    });

    socket.on(SEND_ANSWER, ({roomId, socketId, praiseId}) => {
        sendResult(io, {roomId: tempId, socketId, praiseId});
    })
};

const sendAnswer = (io, roomId) => {
    const roomStore = new RoomStore();
    roomId = tempId;
    const roomData = roomStore[roomId];
    io.to(roomData.user1.id).emit(GET_ANSWER, roomData.user2.pick);
    io.to(roomData.user2.id).emit(GET_ANSWER, roomData.user1.pick);
}

const sendResult = (io, pick) => {
    const roomStore = new RoomStore();
    const {socketId, praiseId} = pick;
    const roomId = tempId;
    const roomData = roomStore[roomId];
    if(socketId === roomData.user1.id){
        io.to(socketId).emit(PUBLISH_RESULT, roomData.user2.pick === praiseId);
    }
    else{
        io.to(socketId).emit(PUBLISH_RESULT, roomData.user1.pick === praiseId);
    }
}

module.exports = initGameSocket;
