"use client";
import React, { useEffect, useRef } from "react";

const SNOW_COUNT = 100; 

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const SnowParticles: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const snowflakes: HTMLDivElement[] = [];
    const parent = ref.current;
    if (!parent) return;

    // Remove old flakes if any
    parent.innerHTML = "";

    for (let i = 0; i < SNOW_COUNT; i++) {
      const flake = document.createElement("div");
      flake.className = "snow-flake";

      // Randomize properties for natural, varied snowfall
      const size = randomBetween(2, 5); // Tiny particles: 2-5px
      const left = randomBetween(0, 100);
      const duration = randomBetween(8, 20); // Slower fall for gentle effect
      const delay = randomBetween(0, 15);
      const opacity = randomBetween(0.4, 0.9);
      const horizontalDrift = randomBetween(-20, 20); // Slight horizontal movement

      flake.style.left = `${left}vw`;
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.borderRadius = "50%";
      flake.style.backgroundColor = "#ffffff";
      flake.style.animationDuration = `${duration}s`;
      flake.style.opacity = `${opacity}`;
      flake.style.animationDelay = `${delay}s`;
      flake.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.8})`;
      
      // Add horizontal drift animation
      flake.style.setProperty("--drift", `${horizontalDrift}px`);
      
      parent.appendChild(flake);
      snowflakes.push(flake);
    }

    return () => {
      snowflakes.forEach(flake => {
        if (flake.parentNode) {
          flake.parentNode.removeChild(flake);
        }
      });
    };
  }, []);

  // Prevent pointer events to underlying elements
  return (
    <div
      aria-hidden="true"
      ref={ref}
      className="snow-particles"
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 9999 }}
    />
  );
};

export default SnowParticles;

