import { useRef, useEffect } from 'preact/hooks';
import { animate } from 'motion';
import type { ThemeName } from '../types';

interface Props {
  theme: ThemeName;
  digitColor: string;
  cardBgColor: string;
  palette: string[];
  hasImage: boolean;
  onSelectTheme: (t: ThemeName) => void;
  onSelectDigitColor: (c: string) => void;
  onSelectCardBgColor: (c: string) => void;
  onUploadImage: () => void;
  onClearImage: () => void;
  onClose: () => void;
}

const THEMES: { name: ThemeName; label: string; bg: string; fg: string }[] = [
  { name: 'classicDark', label: 'Dark', bg: '#1A1A1B', fg: '#FFFFFF' },
  { name: 'softLight', label: 'Light', bg: '#F8F9FA', fg: '#212529' },
  { name: 'deepNavy', label: 'Navy', bg: '#001F3F', fg: '#FFD700' },
];

export default function ThemePanel({
  theme, digitColor, cardBgColor, palette, hasImage,
  onSelectTheme, onSelectDigitColor, onSelectCardBgColor,
  onUploadImage, onClearImage, onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    el.style.transform = 'translateX(100%)';
    const anim = (animate as any)(
      el,
      { transform: ['translateX(100%)', 'translateX(0)'] },
      { duration: 0.3, easing: [0.16, 1, 0.3, 1], fill: 'forwards' }
    );
    return () => anim.stop();
  }, []);

  const handleSwatchClick = (color: string) => {
    if (digitColor === color) {
      onSelectCardBgColor(color);
    } else {
      onSelectDigitColor(color);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[280px] z-50 overflow-y-auto p-6 border-l shadow-2xl"
        style={{ background: '#2a2a2b', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-[16px] font-bold tracking-[1px]">Customize</span>
          <button onClick={onClose} className="text-sm opacity-60 hover:opacity-100 cursor-pointer transition-opacity" style={{ color: '#fff' }} aria-label="Close panel">✕</button>
        </div>

        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-[2px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Built-in Themes</div>
          <div className="flex gap-[10px]">
            {THEMES.map(t => (
              <button
                key={t.name}
                onClick={() => onSelectTheme(t.name)}
                className="w-[72px] h-[52px] rounded-lg border-2 font-bold text-[10px] flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
                style={{
                  background: t.bg,
                  color: t.fg,
                  borderColor: theme === t.name ? '#fff' : 'transparent',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[1px] my-6" style={{ background: 'rgba(255,255,255,0.1)' }} />

        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-[2px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Background Image</div>
          <button
            onClick={onUploadImage}
            className="w-full py-3 rounded-lg text-center cursor-pointer text-[13px] transition-all duration-200 hover:opacity-80 hover:scale-[1.02]"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px dashed rgba(255,255,255,0.3)',
              color: '#fff',
            }}
          >
            + Upload Image from Computer
          </button>
          {hasImage && (
            <button
              onClick={onClearImage}
              className="w-full mt-2 py-2 rounded-lg text-center cursor-pointer text-[12px] transition-all duration-200 hover:opacity-80"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,100,100,0.4)',
                color: 'rgba(255,100,100,0.8)',
              }}
            >
              ✕ Remove Image
            </button>
          )}
        </div>

        <div className="h-[1px] my-6" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {palette.length > 0 && (
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[2px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Colors from Image</div>
            <div className="flex gap-2 flex-wrap">
              {palette.map((color, i) => (
                <button
                  key={i}
                  onClick={() => handleSwatchClick(color)}
                  className="w-9 h-9 rounded-full cursor-pointer transition-all duration-200 hover:scale-125"
                  style={{
                    background: color,
                    border: color === digitColor || color === cardBgColor ? '3px solid #fff' : '2px solid rgba(255,255,255,0.2)',
                  }}
                  title={`${color}`}
                  aria-label={`Color swatch ${color}`}
                />
              ))}
            </div>
            <div className="text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              1st click = digit color · 2nd click = card background
            </div>
          </div>
        )}
      </div>
    </>
  );
}
