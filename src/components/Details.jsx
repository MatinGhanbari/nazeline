import { details } from '../data.js';

export default function Details({ detailsRef }) {
  return (
    <section className="details" id="details" aria-label="جزئیات مجموعه" ref={detailsRef}>
      <div className="details__grid">
        {details.map((cell) => (
          <div className="details__cell" key={cell.k}>
            <div className="details__k">{cell.k}</div>
            <div className="details__v">
              {cell.v.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 ? <br /> : null}
                  {line === 'Luna Bianco' ? (
                    <>
                      Luna&nbsp;Bianco
                    </>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="details__hero">
        <div className="details__quote">
          <span className="serif it">«</span>
          <span>ما به لباسی فکر می‌کنیم که بعد از پوشیدن، آرامش را فراموش نکند.</span>
          <span className="serif it">»</span>
        </div>
        <div className="details__sign">— از دفتر طراحی لونا</div>
      </div>
    </section>
  );
}
