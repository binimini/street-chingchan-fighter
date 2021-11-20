import React from "react";
import "./style.scss";

export default function Button({ onClick, title }) {
  return (
    <div className="button">
      <div className="button__text" onClick={onClick}>
        {title}
      </div>
    </div>
  );
}
