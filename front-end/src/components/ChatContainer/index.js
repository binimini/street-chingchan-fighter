import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSocket, useSocketData } from "../../context/SocketContext";
import Chat from "../Chat";
import Stage from "../Stage";
import "./style.scss";

function ChatContainer() {
  const socketClient = useSocket();
  const { nickname } = useSocketData();
  const scrollRef = useRef();
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const handleKeyPress = useCallback(
    (event) => {
      if (!socketClient) return;
      if (event.key !== "Enter") return;
      socketClient.emit("chat", { userName: nickname, msg: input });
      setInput("");
      event.preventDefault();
    },
    [input, nickname, socketClient]
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

  const chatUnfold = useRef();
  const chatFold = useRef();

  const chatFoldFunction = (e) => {
    chatUnfold.current.className = "sidebar-hidden";
    chatFold.current.className = "chatContainerWrapper";
  };

  const chatUnfoldFunction = (e) => {
    chatUnfold.current.className = "sidebar__unfolded";
    chatFold.current.className = "sidebar-hidden";
  };

  return (
    <div className="chat__container__root">
      <div
        className="sidebar__unfolded"
        ref={chatUnfold}
        onClick={chatFoldFunction}
      >
        채팅
      </div>
      <div
        className="sidebar-hidden"
        ref={chatFold}
        onClick={chatUnfoldFunction}
      >
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
          onClick={(e) => {
            e.stopPropagation();
          }}
          value={input}
        />
      </div>
      <Stage />
    </div>
  );
}

export default ChatContainer;
