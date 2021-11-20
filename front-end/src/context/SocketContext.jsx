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
  const [isFinished, setIsFinished] = useState(false);
  const [roomTime, setRoomTime] = useState(0);
  const [nickname, setNickname] = useState(null);
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [gameResult, setGameResult] = useState({
    user1: {
      id: 1234,
      pick: "asdf",
      guess: "ffdf",
    },
    user2: {
      id: 4321,
      pick: "123123",
      guess: "545545",
    },
  });

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
      socketClient.on("set userInfo fulfilled", (userInfo) => {
        setNickname(userInfo.nickname);
        setAvatarIdx(userInfo.avatarIdx);
      });
      socketClient.on("user list", (list) => {
        setUserList(list);
      });
      socketClient.on("room created", ({ members, roomID }) => {
        setRoomMembers(members);
        setroomID(roomID);
        setIsFinished(false);
        setCanStart(true);
        setRoomTime(0);
      });
      socketClient.on("fight ready", ({ roomID }) => {
        socketClient.emit("fight start", roomID);
      });
      socketClient.on("fight started", () => {
        setCanStart(false);
      });
      socketClient.on("time update", (newTime) => {
        setRoomTime(newTime);
      });
      socketClient.on("fight timeout", () => {
        setRoomTime(0);
        setIsFinished(true);
      });
      socketClient.on("game result", (result) => {
        setRoomTime(0);
        setIsFinished(true);
        // console.log(result);
        // setGameResult({ ...result });
      });

      socketClient.on("left room", () => {
        setroomID(null);
      });
    }
  }, [socketClient]);

  return (
    <SocketContext.Provider value={socketClient}>
      <SocketDataContext.Provider
        value={{
          userList,
          roomMembers,
          roomID,
          canStart,
          roomTime,
          nickname,
          avatarIdx,
          isFinished,
          gameResult,
        }}
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
 * @returns {{userList: [], roomMembers: [], roomID: string,
 * canStart: boolean,
 * roomTime: number,
 * nickname: string,
 * isFinished: boolean,
 * gameResult: {}}}
 */
export const useSocketData = () => useContext(SocketDataContext);

export default SocketProvider;
