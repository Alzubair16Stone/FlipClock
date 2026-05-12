import { useState, useRef, useCallback, useEffect } from 'preact/hooks';
import { animate } from 'motion';

interface Props {
  onClose: () => void;
}

export default function MusicPlayer({ onClose }: Props) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [trackName, setTrackName] = useState('');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [loop, setLoop] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loopRef = useRef(false);
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

  const syncLoop = useCallback((val: boolean) => {
    loopRef.current = val;
    if (audioRef.current) audioRef.current.loop = val;
  }, []);

  const handleUpload = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (audioSrc) URL.revokeObjectURL(audioSrc);
    setAudioSrc(url);
    setTrackName(file.name);
    setPlaying(true);
    setLoop(false);
    syncLoop(false);
    (e.target as HTMLInputElement).value = '';
  }, [audioSrc, syncLoop]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !audioSrc) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, audioSrc]);

  const handleVolumeChange = useCallback((e: Event) => {
    const val = Number((e.target as HTMLInputElement).value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val / 100;
  }, []);

  const handleLoopToggle = useCallback(() => {
    setLoop(l => {
      const newLoop = !l;
      syncLoop(newLoop);
      return newLoop;
    });
  }, [syncLoop]);

  const handleEnded = useCallback(() => {
    if (!loopRef.current) setPlaying(false);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;
    audio.volume = volume / 100;
    audio.loop = loop;
    if (playing) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [audioSrc]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={panelRef}
        className="fixed right-2 sm:right-4 top-16 w-[calc(100%-16px)] sm:w-[260px] z-50 rounded-xl p-5 flex flex-col gap-4 shadow-2xl"
        style={{ background: '#2a2a2b', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold">Background Music</span>
          <button onClick={onClose} className="text-sm opacity-60 hover:opacity-100 cursor-pointer transition-opacity" style={{ color: '#fff' }} aria-label="Close panel">✕</button>
        </div>

        <button
          onClick={handleUpload}
          className="w-full py-[10px] rounded-lg text-center cursor-pointer text-[12px] transition-all duration-200 hover:opacity-80 hover:scale-[1.02]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.3)', color: '#fff' }}
        >
          + Upload Audio File
        </button>

        {trackName && (
          <div className="text-[12px] text-center truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {trackName}
          </div>
        )}

        {audioSrc && (
          <>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleLoopToggle}
                className="px-[10px] py-[6px] rounded-md text-[11px] cursor-pointer transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: loop ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.3)',
                  color: loop ? '#fff' : 'rgba(255,255,255,0.6)',
                }}
              >
                ↺ Loop
              </button>
              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-full flex items-center justify-center text-[18px] cursor-pointer border-0 transition-all duration-200 hover:scale-110 hover:shadow-lg"
                style={{ background: '#fff', color: '#1A1A1B' }}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? '⏸' : '▶'}
              </button>
            </div>

            <div className="flex items-center gap-[10px] text-[12px]">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>🔈</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onInput={handleVolumeChange}
                className="flex-1 h-1 cursor-pointer"
                style={{ accentColor: '#fff' }}
                aria-label="Volume"
              />
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>🔊</span>
            </div>
          </>
        )}

        <audio
          ref={audioRef}
          src={audioSrc || undefined}
          onEnded={handleEnded}
        />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
