const { Server } = require("socket.io");

const initChatSocket = require("./chat");
const initGameSocket = require("./game");
const initTimerSocket = require("./timer");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    /* options */
    cors: {
      origin: "*",
    },
  });
  const namespace = io.of("/");
  namespace.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("hello", () => {
      console.log("world");
    });
  });
  initChatSocket(namespace);
  initGameSocket(namespace);
  initTimerSocket(namespace);
};

module.exports = initSocket;
