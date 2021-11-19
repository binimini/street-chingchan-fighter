import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import Chat from "../Chat";
import "./style.scss";

function ChatContainer() {
  const socketClient = useSocket();
  const scrollRef = useRef();
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const handleKeyPress = useCallback(
    (event) => {
      if (!socketClient) return;
      if (event.key !== "Enter") return;
      socketClient.emit("chat", { userName: "test", msg: input });
      setInput("");
      event.preventDefault();
    },
    [input, socketClient]
  );

  useEffect(() => {
    if (!socketClient) return;
    socketClient.on("publish chat", (chat) => {
      setChats((prev) => [...prev, chat]);
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
    return () => {
      socketClient.off("publish chat");
    };
  }, [socketClient]);

  useEffect(() => console.log(input), [input]);

  return (
    <div className="chatContainerWrapper">
      <div className="chatContainerText">* Chat</div>
      <div className="chatContainerScroll" ref={scrollRef}>
        {chats.map(({ userName, msg }, idx) => (
          <Chat key={idx} userName={userName} msg={msg} />
        ))}
      </div>
      <input
        className="chatInput"
        onChange={({ target }) => setInput(target.value)}
        onKeyPress={handleKeyPress}
        value={input}
      />
    </div>
  );
}

export default ChatContainer;
