import useSelection from "./useSelection";

const Selection = ({praise, isGame}) => {
  const {handleClickBeforeGame, handleClick} = useSelection(praise); 

  return (
    <button onClick={isGame ? handleClick : handleClickBeforeGame}>{praise.text}</button>
  );
}

export default Selection;