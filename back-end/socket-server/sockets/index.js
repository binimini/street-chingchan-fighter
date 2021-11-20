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

  const updateUserList = async () => {
    const socketList = await namespace.fetchSockets();

    return socketList.map((s) => ({
      id: s.id,
      x: s._position.x,
      y: s._position.y,
      nickname: s.nickname,
      avatarSrcPosition: s._position.avatarSrcPosition
    }));
  };

  namespace.on("connection", async (socket) => {
    initChatSocket(namespace, socket);
    initGameSocket(namespace, socket);
    initTimerSocket(namespace, socket);
    socket._position = { x: 0, y: 0, avatarSrcPosition: 0 };

    socket.on("set nickname", (nickname) => {
      socket.nickname = nickname;
      socket.emit("set nickname fulfilled", nickname);
    });

    socket.on("user position update", async ({ x, y, avatarSrcPosition }) => {
      socket._position.x = x;
      socket._position.y = y;
      socket._position.avatarSrcPosition = avatarSrcPosition;

      namespace.emit("user list", await updateUserList());
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

    socket.on("disconnect", async () => {
      namespace.emit("user list", await updateUserList());
    });

    namespace.emit("user list", await updateUserList());
  });
};

module.exports = initSocket;
