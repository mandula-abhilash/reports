"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

export function Confetti({ duration = 3000 }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setWindowDimensions({ width, height });

    const timeout = setTimeout(() => {
      setShowConfetti(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
      colors={["#F09C00", "#3D9BE9", "#ABD03E", "#FFD700", "#FF69B4"]}
    />
  );
}
