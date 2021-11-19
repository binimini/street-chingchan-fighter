import { createContext, useContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";

const SocketContext = createContext();
const SocketDataContext = createContext();

function SocketProvider({ children }) {
  const [socketClient, setSocketClient] = useState(null);
  const [userList, setUserList] = useState([]);
  const [roomMembers, setRoomMembers] = useState([]);
  const [roomID, setroomID] = useState("");
  const [canStart, setCanStart] = useState(false);
  const [roomTime, setRoomTime] = useState(0);
  const [nickname, setNickname] = useState(null);

  useEffect(() => {
    const socketConnection = io("/", {
      protocols: ["http"],
      transports: ["websocket"],
      path: "/socket.io",
      secure: true,
    });
    socketConnection.on("connect", () => {
      setSocketClient(socketConnection);
    });
  }, []);

  useEffect(() => {
    if (socketClient) {
      socketClient.on("set nickname fulfilled", (nickname) => {
        setNickname(nickname);
      });
      socketClient.on("user list", (list) => {
        setUserList(list);
      });
      socketClient.on("room created", ({ members, roomID }) => {
        setRoomMembers(members);
        setroomID(roomID);
        setCanStart(true);
        setRoomTime(0);
      });
      socketClient.on("fight started", () => {
        setCanStart(false);
      });
      socketClient.on("time update", (newTime) => {
        setRoomTime(newTime);
      });
    }
  }, [socketClient]);

  return (
    <SocketContext.Provider value={socketClient}>
      <SocketDataContext.Provider
        value={{ userList, roomMembers, roomID, canStart, roomTime, nickname }}
      >
        {children}
      </SocketDataContext.Provider>
    </SocketContext.Provider>
  );
}

/**
 *
 * @returns {Socket}
 */
export const useSocket = () => useContext(SocketContext);

/**
 *
 * @returns {{userList: [], roomMembers: [], roomID: string, canStart: boolean, roomTime: number, nickname: string}}
 */
export const useSocketData = () => useContext(SocketDataContext);

export default SocketProvider;
