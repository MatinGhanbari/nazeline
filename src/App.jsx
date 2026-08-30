import { useMemo, useRef } from 'react';
import Topbar from './components/Topbar.jsx';
import Hero from './components/Hero.jsx';
import Stage from './components/Stage.jsx';
import Details from './components/Details.jsx';
import Footer from './components/Footer.jsx';
import { useStage } from './hooks/useStage.js';

export default function App() {
  const stageRef = useRef(null);
  const mediaRef = useRef(null);
  const canvasRef = useRef(null);
  const timeNowRef = useRef(null);
  const timeDurRef = useRef(null);
  const detailsRef = useRef(null);

  const refs = useMemo(
    () => ({
      stage: stageRef,
      media: mediaRef,
      canvas: canvasRef,
      timeNow: timeNowRef,
      timeDur: timeDurRef,
      details: detailsRef,
    }),
    [],
  );

  useStage(refs);

  return (
    <>
      <Topbar />
      <Hero />
      <Stage
        stageRef={stageRef}
        mediaRef={mediaRef}
        canvasRef={canvasRef}
        timeNowRef={timeNowRef}
        timeDurRef={timeDurRef}
      />
      <Details detailsRef={detailsRef} />
      <Footer />
      <noscript>
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'serif' }}>
          برای دیدن تجربه‌ی کامل، JavaScript را فعال کنید.
        </div>
      </noscript>
    </>
  );
}
