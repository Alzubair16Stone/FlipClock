import { Palette, Image } from 'lucide-react';

interface Props {
  onThemeClick: () => void;
  onImageClick: () => void;
}

const btnClass = "flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/10";

export default function ControlBar({ onThemeClick, onImageClick }: Props) {
  return (
    <div className="absolute top-4 right-4 flex gap-[10px] z-30">
      <button
        onClick={onImageClick}
        className={btnClass}
        aria-label="Upload background image"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
      >
        <Image size={18} />
      </button>
      <button
        onClick={onThemeClick}
        className={btnClass}
        aria-label="Theme settings"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
      >
        <Palette size={18} />
      </button>
    </div>
  );
}
