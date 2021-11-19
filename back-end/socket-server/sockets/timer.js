const { Namespace, Socket } = require("socket.io");

const rooms = [];

/**
 *
 * @param {Namespace} namespace
 * @param {Socket} socket
 */
const initTimerSocket = (namespace, socket) => {
  socket.on("fight start", (roomID) => {
    namespace.to(roomID).emit("fight started");
    let time = 0;
    const gameInterval = setInterval(() => {
      namespace.to(roomID).emit("time update", ++time);
    }, 1000);
  });
};

module.exports = initTimerSocket;
