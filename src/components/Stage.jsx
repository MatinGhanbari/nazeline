import { captions } from '../data.js';

export default function Stage({ stageRef, mediaRef, canvasRef, timeNowRef, timeDurRef }) {
  return (
    <>
      <section className="stage" id="stage" aria-label="نمایش محصول" ref={stageRef}>
        <div className="stage__media" id="stageMedia" ref={mediaRef}>
          <div className="stage__vid">
            <canvas
              id="seq"
              className="stage__seq"
              ref={canvasRef}
              width={960}
              height={540}
              role="img"
              aria-label="نمایش محصول"
            />
          </div>
        </div>

        <div className="stage__chrome" aria-hidden="true">
          <div className="stage__hud">
            <span className="hud__dot"></span>
            <span className="hud__label">F/W ۲۰۲۶ · CREAM</span>
          </div>
          <div className="stage__time">
            <span ref={timeNowRef}>۰۰:۰۰</span>
            <span className="stage__time-sep">/</span>
            <span ref={timeDurRef}>۰۰:۱۰</span>
          </div>
        </div>

        <div className="stage__load" aria-hidden="true"></div>

        <div className="stage__captions" dir="rtl">
          {captions.map((cap) => (
            <article
              key={cap.i}
              className={`cap cap--${cap.side}`}
              data-i={cap.i}
            >
              <div className="cap__no">
                <span>{cap.no}</span>
                <span className="cap__line"></span>
              </div>
              <h3 className="cap__t">{cap.title}</h3>
              <p className="cap__p">{cap.body}</p>
            </article>
          ))}
        </div>

        <div className="stage__rail" aria-hidden="true">
          <div className="stage__rail-track" id="railTrack">
            {captions.map((cap) => (
              <span key={cap.i}></span>
            ))}
          </div>
        </div>
      </section>
      <div className="stage__pin-space" aria-hidden="true"></div>
    </>
  );
}
