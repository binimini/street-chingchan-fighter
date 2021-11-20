import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSocket, useSocketData } from "../../context/SocketContext";
import Chat from "../Chat";
import "./style.scss";

function ChatContainer() {
  const socketClient = useSocket();
  const { nickname } = useSocketData();
  const scrollRef = useRef();
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [fight, setFight] = useState("notFight");

  const smallChatState = {
    fight: "sidebar-hidden",
    notFight: "",
  };

  const bigChatState = {
    fight: "",
    notFight: "sidebar-hidden",
  };

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
    //싸움이 시작 된 경우 (이벤트 이름 아직 )
    /*
    socketClient.on("fight started", () => {
      setFight("fight");
    });*/
    //싸움이 끝난 경우 (이벤트 이름 아직 )
    /*
    socketClient.on("fight ended", () => {
      setFight("notFight");
    });*/
    return () => {
      socketClient.off("publish chat");
      //싸움이 시작 된 경우 (이벤트 이름 아직 ) >> socketClient.off("fight started")
      //싸움이 끝난 경우 (이벤트 이름 아직 ) >> socketClient.off("fight ended")
    };
  }, [socketClient]);

  const chatUnfold = useRef();
  const chatFold = useRef();

  const chatFoldFunction = (e) => {
    chatUnfold.current.className = "sidebar-hidden";
    chatFold.current.className = "chatContainerWrapper";
  };

  const chatUnfoldFunction = (e) => {
    if (fight === "fight") {
      return;
    }
    chatUnfold.current.className = "sidebar__unfolded";
    chatFold.current.className = "sidebar-hidden";
  };

  return (
    <>
      <div
        className={"sidebar__unfolded " + smallChatState.fight}
        ref={chatUnfold}
        onClick={chatFoldFunction}
      >
        채팅
      </div>
      <div
        className={"sidebar-hidden " + bigChatState.fight}
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
    </>
  );
}

export default ChatContainer;
