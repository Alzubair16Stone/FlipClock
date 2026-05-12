import { useState, useEffect, useRef } from 'preact/hooks';
import { animate } from 'motion';
import FlipCard from './FlipCard';

interface Props {
  digitColor: string;
  cardBgColor: string;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function to12(h: number): { hour: number; ampm: string } {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return { hour, ampm };
}

export default function ClockDisplay({ digitColor, cardBgColor }: Props) {
  const [time, setTime] = useState(() => {
    const now = new Date();
    const { hour, ampm } = to12(now.getHours());
    return {
      hours: pad(hour),
      minutes: pad(now.getMinutes()),
      seconds: pad(now.getSeconds()),
      ampm,
    };
  });

  const clockRef = useRef<HTMLDivElement>(null);
  const sep1Ref = useRef<HTMLSpanElement>(null);
  const sep2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const { hour, ampm } = to12(now.getHours());
      setTime({
        hours: pad(hour),
        minutes: pad(now.getMinutes()),
        seconds: pad(now.getSeconds()),
        ampm,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = clockRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.85)';
    const anim = (animate as any)(
      el,
      { opacity: [0, 1], transform: ['scale(0.85)', 'scale(1)'] },
      { duration: 0.8, easing: [0.16, 1, 0.3, 1], fill: 'forwards' }
    );
    return () => anim.stop();
  }, []);

  useEffect(() => {
    const anims: (() => void)[] = [];
    [sep1Ref, sep2Ref].forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      const anim = (animate as any)(
        el,
        { opacity: [1, 0.25, 1] },
        { duration: 1.5, easing: 'ease-in-out', repeat: Infinity }
      );
      anims.push(() => anim.stop());
    });
    return () => anims.forEach((stop) => stop());
  }, []);

  return (
    <div ref={clockRef} className="flex items-center clock-gap">
      <div className="flex flex-col items-center">
        <div className="flex gap-[4px] sm:gap-[6px]">
          <FlipCard value={Number(time.hours[0])} digitColor={digitColor} cardBgColor={cardBgColor} />
          <FlipCard value={Number(time.hours[1])} digitColor={digitColor} cardBgColor={cardBgColor} />
        </div>
        <span className="clock-label tracking-[2px] mt-[4px] sm:mt-[6px]" style={{ color: digitColor + '66' }}>HOURS</span>
      </div>

      <span ref={sep1Ref} className="clock-sep font-bold mb-6 sm:mb-7 lg:mb-8 select-none" style={{ color: digitColor }}>:</span>

      <div className="flex flex-col items-center">
        <div className="flex gap-[4px] sm:gap-[6px]">
          <FlipCard value={Number(time.minutes[0])} digitColor={digitColor} cardBgColor={cardBgColor} />
          <FlipCard value={Number(time.minutes[1])} digitColor={digitColor} cardBgColor={cardBgColor} />
        </div>
        <span className="clock-label tracking-[2px] mt-[4px] sm:mt-[6px]" style={{ color: digitColor + '66' }}>MINUTES</span>
      </div>

      <span ref={sep2Ref} className="clock-sep font-bold mb-6 sm:mb-7 lg:mb-8 select-none" style={{ color: digitColor }}>:</span>

      <div className="flex flex-col items-center">
        <div className="flex gap-[4px] sm:gap-[6px]">
          <FlipCard value={Number(time.seconds[0])} digitColor={digitColor} cardBgColor={cardBgColor} />
          <FlipCard value={Number(time.seconds[1])} digitColor={digitColor} cardBgColor={cardBgColor} />
        </div>
        <span className="clock-label tracking-[2px] mt-[4px] sm:mt-[6px]" style={{ color: digitColor + '66' }}>SECONDS</span>
      </div>

      <div className="flex flex-col items-center justify-center ml-1 sm:ml-2 mb-6 sm:mb-7 lg:mb-8">
        <span className="ampm-text font-bold tracking-[2px]" style={{ color: digitColor }}>{time.ampm}</span>
      </div>
    </div>
  );
}
