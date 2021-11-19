const initChatSocket = (namespace, socket) => {
  socket.on("chat", ({ userName, msg }) => {
    namespace.emit("publish chat", { userName, msg });
  });

  socket.on("game chat", (userName, msg, roomId) => {
    namespace.to(roomId).emit("publish chat", { userName, msg });
  });
};

module.exports = initChatSocket;
