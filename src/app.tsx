import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { animate } from 'motion';
import { getPaletteSync } from 'colorthief';
import ClockDisplay from './components/ClockDisplay';
import ControlBar from './components/ControlBar';
import ThemePanel from './components/ThemePanel';
import type { ThemeName, ThemeColors } from './types';

const THEMES: Record<Exclude<ThemeName, 'custom'>, ThemeColors> = {
  classicDark: { pageBg: '#1A1A1B', digitColor: '#FFFFFF', cardBg: '#2a2a2b' },
  softLight: { pageBg: '#F8F9FA', digitColor: '#212529', cardBg: '#ffffff' },
  deepNavy: { pageBg: '#001F3F', digitColor: '#FFD700', cardBg: 'rgba(0,20,50,0.85)' },
};

function loadStr(key: string, fallback: string): string {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function App() {
  const [theme, setTheme] = useState<ThemeName>(() => loadStr('fc-theme', 'classicDark') as ThemeName);
  const [digitColor, setDigitColor] = useState(() => loadStr('fc-digit', '#FFFFFF'));
  const [cardBgColor, setCardBgColor] = useState(() => loadStr('fc-cardbg', '#2a2a2b'));
  const [bgImage, setBgImage] = useState<string | null>(() => {
    try { const v = localStorage.getItem('fc-bg'); return v ? JSON.parse(v) : null; }
    catch { return null; }
  });
  const [palette, setPalette] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<'theme' | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem('fc-theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('fc-digit', JSON.stringify(digitColor)); }, [digitColor]);
  useEffect(() => { localStorage.setItem('fc-cardbg', JSON.stringify(cardBgColor)); }, [cardBgColor]);
  useEffect(() => { localStorage.setItem('fc-bg', JSON.stringify(bgImage)); }, [bgImage]);

  useEffect(() => {
    const el = bgRef.current;
    if (!el || bgImage) return;
    el.style.backgroundPosition = '0% 50%';
    const anim = (animate as any)(
      el,
      { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] },
      { duration: 12, easing: 'ease-in-out', repeat: Infinity }
    );
    return () => anim.stop();
  }, [bgImage]);

  const isCustomTheme = theme === 'custom' || !!bgImage;
  const currentTheme = isCustomTheme
    ? { pageBg: '#1A1A1B', digitColor, cardBg: cardBgColor }
    : THEMES[theme as Exclude<ThemeName, 'custom'>];

  const handleSelectTheme = useCallback((t: ThemeName) => {
    setTheme(t);
    if (t !== 'custom' && THEMES[t as Exclude<ThemeName, 'custom'>]) {
      const th = THEMES[t as Exclude<ThemeName, 'custom'>];
      setDigitColor(th.digitColor);
      setCardBgColor(th.cardBg);
    }
  }, []);

  const handleImageUpload = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setBgImage(base64);
      setTheme('custom');

      const img = new Image();
      img.onload = () => {
        try {
          const colors = getPaletteSync(img, { colorCount: 5, quality: 10 });
          if (colors) setPalette(colors.map(c => c.hex()));
          else setPalette([]);
        } catch {
          setPalette([]);
        }
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
    (e.target as HTMLInputElement).value = '';
  }, []);

  const handleClearImage = useCallback(() => {
    setBgImage(null);
    setPalette([]);
    setTheme('classicDark');
    setDigitColor(THEMES.classicDark.digitColor);
    setCardBgColor(THEMES.classicDark.cardBg);
  }, []);

  const handleSelectDigitColor = useCallback((color: string) => {
    setDigitColor(color);
    setTheme('custom');
  }, []);

  const handleSelectCardBgColor = useCallback((color: string) => {
    setCardBgColor(color);
    setTheme('custom');
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      ref={bgRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: bgImage ? undefined : currentTheme.pageBg,
        backgroundImage: bgImage
          ? `url(${bgImage})`
          : `radial-gradient(ellipse at center, ${currentTheme.pageBg}, #000)`,
        backgroundSize: bgImage ? 'cover' : '200% 200%',
        backgroundPosition: 'center',
        transition: 'background-color 0.5s ease',
      }}
    >
      {bgImage && (
        <div className="absolute inset-0 transition-all duration-500" style={{ backgroundColor: currentTheme.pageBg, opacity: 0.45 }} />
      )}

      <div className="relative z-10 px-2 sm:px-4">
        <ClockDisplay
          digitColor={currentTheme.digitColor}
          cardBgColor={currentTheme.cardBg}
        />
      </div>

      <ControlBar
        onThemeClick={() => setActivePanel(p => p === 'theme' ? null : 'theme')}
        onImageClick={handleImageUpload}
      />

      {activePanel === 'theme' && (
        <ThemePanel
          theme={theme}
          digitColor={currentTheme.digitColor}
          cardBgColor={currentTheme.cardBg}
          palette={palette}
          hasImage={!!bgImage}
          onSelectTheme={handleSelectTheme}
          onSelectDigitColor={handleSelectDigitColor}
          onSelectCardBgColor={handleSelectCardBgColor}
          onUploadImage={handleImageUpload}
          onClearImage={handleClearImage}
          onClose={() => setActivePanel(null)}
        />
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
