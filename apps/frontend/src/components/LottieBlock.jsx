'use client';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export default function LottieBlock({ src, className = '', loop = true }) {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(src)
      .then(r => r.json())
      .then(d => { if (mounted) setJsonData(d); })
      .catch(() => {});
    return () => { mounted = false; };
  }, [src]);

  // Respeta usuarios con reduce motion
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!jsonData) return <div className={`w-full h-[220px] bg-slate-100 rounded-xl ${className}`} />;

  return (
    <Lottie
      animationData={jsonData}
      loop={loop && !prefersReduced}
      autoplay={!prefersReduced}
      className={className}
      style={{ outline: 'none' }}
    />
  );
}
