import "./style.scss";

function MessageBox({ variant = "md", ...props }) {
  return (
    <div className={`message_box__root message_box__root--${variant}`}>
      {props.children}
    </div>
  );
}

export default MessageBox;
