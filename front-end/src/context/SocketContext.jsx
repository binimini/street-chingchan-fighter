import { createContext, useContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";

const SocketContext = createContext();
function SocketProvider({ children }) {
  const [socketClient, setSocketClient] = useState(null);

  useEffect(() => {
    const socketConnection = io("/", {
      transports: ["websocket"],
      path: "/socket.io",
      secure: true,
    });
    socketConnection.on("connect", () => {
      setSocketClient(socketConnection);
    });
  }, []);
  return (
    <SocketContext.Provider value={socketClient}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 *
 * @returns {Socket}
 */
export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
