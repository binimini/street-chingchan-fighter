import "./style.scss";
import useSelection from "./useSelection";

const Selection = ({ praise, isGame }) => {
  const { handleClickBeforeGame, handleClick } = useSelection(praise);

  return (
    <button
      className="selectionWrapper"
      onClick={
        isGame ? () => handleClick(praise) : () => handleClickBeforeGame(praise)
      }
    >
      <div className="selectionText">{praise.text}</div>
    </button>
  );
};

export default Selection;
