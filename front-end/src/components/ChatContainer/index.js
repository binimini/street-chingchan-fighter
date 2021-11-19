import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../../context/SocketContext";
import Chat from "../Chat";
import "./style.scss";

function ChatContainer() {
  const socketClient = useSocket();
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const handleKeyPress = useCallback(
    (event) => {
      console.log(event.key);
      if (!socketClient) return;
      if (event.key !== "Enter") return;
      socketClient.emit("chat", { userName: "test", msg: input });
      event.preventDefault();
    },
    [input, socketClient]
  );

  useEffect(() => {
    console.log(socketClient);
    if (!socketClient) return;
    console.log(socketClient);
    socketClient.on("publish chat", (chat) =>
      setChats((prev) => [...prev, chat])
    );
    return () => {
      socketClient.off("publish chat");
    };
  }, [socketClient]);

  useEffect(() => console.log(input), [input]);

  return (
    <div className="chatContainerWrapper">
      <div></div>
      {chats.map(({ userName, msg }, idx) => (
        <Chat key={idx} userName={userName} msg={msg} />
      ))}
      <input
        className="chatInput"
        onChange={({ target }) => setInput(target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default ChatContainer;
