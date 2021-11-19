import React from "react";
import "./style.scss";

function Chat({ userName, msg }) {
  return (
    <div className="chatWrapper">
      <div>{userName}</div>
      <div>{msg}</div>
    </div>
  );
}

export default Chat;
