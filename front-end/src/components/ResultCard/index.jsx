import "./style.scss";

function ResultCard({ title, content }) {
  return (
    <div className="card__container">
      <h2 className="card__title">{title}</h2>
      <div className="card__content">
        <div className="content__text">{content}</div>
      </div>
    </div>
  );
}

export default ResultCard;
