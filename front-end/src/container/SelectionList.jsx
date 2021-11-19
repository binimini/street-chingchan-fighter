import Selection from "../components/Selection/Selection";

const SelectionList = ({praiseList}) => {
  const isResult = false;
  return (
        <>
        {praiseList.map((praise) => 
            <Selection key={Date.now().toString()+praise} praise={praise} isResult={isResult}/>
        )}
        </>
  );
}

export default SelectionList;