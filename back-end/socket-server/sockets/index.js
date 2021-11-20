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
      avatarSrcPosition: s._position.avatarSrcPosition,
      avatarIdx: s.avatarIdx,
    }));
  };

  namespace.on("connection", async (socket) => {
    initChatSocket(namespace, socket);
    initGameSocket(io, namespace, socket);
    initTimerSocket(namespace, socket);
    socket._position = { x: 100, y: 120, avatarSrcPosition: 0 };

    socket.on("set userInfo", async (userInfo) => {
      socket.nickname = userInfo.nickname;
      socket.avatarIdx = userInfo.avatarIdx;
      socket.emit("set userInfo fulfilled", userInfo);
      namespace.emit("user list", await updateUserList());
    });

    socket.on("user position update", async ({ x, y, avatarSrcPosition }) => {
      socket._position.x = x;
      socket._position.y = y;
      socket._position.avatarSrcPosition = avatarSrcPosition;

      namespace.emit("user list", await updateUserList());
    });

    socket.on("apply fight", (enemyID) => {
      socket.to(enemyID).emit("will fight", socket.id);
    });

    socket.on("reject fight", (id) => {
      socket.to(id).emit("reject your fight", socket.nickname);
    });

    socket.on("init fight", async (enemyID) => {
      const roomID = randomUUID();
      const socketList = await namespace.fetchSockets();

      socket.join(roomID);
      socketList.find((s) => s.id === enemyID).join(roomID);

      namespace.to(roomID).emit("room created", {
        members: socketList
          .filter((s) =>
            [...namespace.adapter.rooms.get(roomID)].includes(s.id)
          )
          .map((s) => ({
            id: s.id,
            x: s._position.x,
            y: s._position.y,
            nickname: s.nickname,
            avatarIdx: s.avatarIdx,
          })),
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
