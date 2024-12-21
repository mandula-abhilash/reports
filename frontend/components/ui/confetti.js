"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

export function Confetti({ duration = 5000 }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setWindowDimensions({ width, height });

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    const timeout = setTimeout(() => {
      setShowConfetti(false);
    }, duration);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [duration]);

  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      <ReactConfetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.15}
        initialVelocityY={10}
        tweenDuration={5000}
        colors={["#F09C00", "#3D9BE9", "#ABD03E", "#FFD700", "#FF69B4"]}
      />
    </div>
  );
}
