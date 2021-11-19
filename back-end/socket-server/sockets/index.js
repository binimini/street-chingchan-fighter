const { Server } = require("socket.io");
const { randomUUID } = require("crypto");

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
    socket.on("hello", () => {
      // console.log("world");
    });
    socket.on("init fight", async (enemyID) => {
      const roomID = randomUUID();
      const socketList = await namespace.fetchSockets();

      socket.join(roomID);
      socketList.find((s) => s.id === enemyID).join(roomID);

      namespace.to(roomID).emit("room created", {
        members: [...namespace.adapter.rooms.get(roomID)],
        roomID,
      });
    });

    namespace.emit("user list", [...namespace.adapter.sids]);

    socket.on("disconnect", () => {
      namespace.emit("user list", [...namespace.adapter.sids]);
    });
    initTimerSocket(namespace, socket);
  });
  initChatSocket(namespace);
  initGameSocket(socket);
};

module.exports = initSocket;
