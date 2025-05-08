import React, { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createLantern = () => {
      if (!wrapperRef.current) return;
      
      const lantern = document.createElement('div');
      lantern.className = 'lantern';
      
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight;
      lantern.style.left = `${startX}px`;
      lantern.style.bottom = `${startY}px`;
      
      // Increased duration for slower animation
      const duration = 50 + Math.random() * 6;
      lantern.style.animationDuration = `${duration}s`;
      
      wrapperRef.current.appendChild(lantern);
      
      setTimeout(() => {
        lantern.remove();
      }, duration * 1000);
    };

    const interval = setInterval(createLantern, 300);
    return () => clearInterval(interval);
  }, []);

  return <div ref={wrapperRef} className="animation-wrapper" />;
}