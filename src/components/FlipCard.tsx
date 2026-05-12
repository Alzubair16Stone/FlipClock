import { useState, useEffect, useRef } from 'preact/hooks';
import { animate } from 'motion';

interface Props {
  value: number;
  digitColor: string;
  cardBgColor: string;
}

export default function FlipCard({ value, digitColor, cardBgColor }: Props) {
  const [flipping, setFlipping] = useState(false);
  const [prevVal, setPrevVal] = useState(value);
  const prevRef = useRef(value);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== prevRef.current) {
      setPrevVal(prevRef.current);
      setFlipping(true);
      prevRef.current = value;
      const timer = setTimeout(() => setFlipping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  useEffect(() => {
    if (!flipping || !topRef.current || !bottomRef.current) return;
    const easing = [0.4, 0, 0.2, 1];
    const top = (animate as any)(
      topRef.current,
      { transform: ['rotateX(0deg)', 'rotateX(-90deg)'] },
      { duration: 0.15, easing, fill: 'forwards' }
    );
    const bottom = (animate as any)(
      bottomRef.current,
      { transform: ['rotateX(90deg)', 'rotateX(0deg)'] },
      { duration: 0.15, easing, delay: 0.15, fill: 'forwards' }
    );
    return () => { top.stop(); bottom.stop(); };
  }, [flipping]);

  return (
    <div className="flip-card-inner relative" style={{ perspective: '300px' }}>
      <div className="absolute inset-0 rounded-xl shadow-lg overflow-hidden" style={{ background: cardBgColor, willChange: 'background-color' }}>
        <div className="absolute top-0 left-0 right-0 flip-half overflow-hidden flex items-start justify-center">
          <span className="flip-card-text block text-center font-bold select-none" style={{ color: digitColor }}>{value}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flip-half overflow-hidden flex items-end justify-center">
          <span className="flip-card-text block text-center font-bold select-none" style={{ color: digitColor }}>{value}</span>
        </div>
        <div className="absolute left-0 right-0 z-10" style={{ top: '50%', height: '1px', background: 'rgba(0,0,0,0.4)' }} />
      </div>

      {flipping && (
        <>
          <div
            ref={topRef}
            className="absolute top-0 left-0 right-0 flip-half overflow-hidden z-20"
            style={{
              transformOrigin: 'bottom',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              background: cardBgColor,
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }}
          >
            <span className="flip-card-text block text-center font-bold select-none" style={{ color: digitColor }}>{prevVal}</span>
          </div>
          <div
            ref={bottomRef}
            className="absolute bottom-0 left-0 right-0 flip-half overflow-hidden z-20"
            style={{
              transformOrigin: 'top',
              transform: 'rotateX(90deg)',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              background: cardBgColor,
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
            }}
          >
            <span className="flip-card-text block text-center font-bold select-none" style={{ color: digitColor }}>{value}</span>
          </div>
        </>
      )}
    </div>
  );
}
