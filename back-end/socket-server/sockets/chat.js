const initChatSocket = (namespace) => {
  namespace.on("chat", ({ userName, msg }) => {
    console.log(userName, msg);
    namespace.emit("publish chat", (userName, msg));
  });

  namespace.on("game chat", (userName, msg, roomId) => {
    namespace.to(roomId).emit("publish chat", (userName, msg));
  });
};

module.exports = initChatSocket;
