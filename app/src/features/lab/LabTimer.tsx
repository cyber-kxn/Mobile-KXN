import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export function LabTimer({ expiresAt }: { expiresAt: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const left = Math.max(0, Math.floor((expiresAt - now) / 1000));
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const low = left < 300;
  return (
    <span className={`chip border font-mono ${low ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-white/10 bg-white/5 text-slate-300'}`}>
      <Icon name="clock" size={13} /> {mm}:{ss}
    </span>
  );
}
