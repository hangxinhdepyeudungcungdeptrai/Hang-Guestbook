import { motion } from "motion/react";
import { useEffect } from "react";

interface ShatteredSealProps {
  onAnimationComplete: () => void;
  x: number;
  y: number;
}

interface SealFragment {
  id: number;
  path: string;
  targetX: number;
  targetY: number;
  targetRotate: number;
  targetRotateX: number;
  targetRotateY: number;
  width: number;
  height: number;
}

export default function ShatteredSeal({ onAnimationComplete, x, y }: ShatteredSealProps) {
  // Generate a set of 14 distinct jagged shard definitions representing a complete 3D gold coin fracture
  const fragments: SealFragment[] = [
    {
      id: 1,
      // Large top-left chunk
      path: "M 40 40 L 0 0 C 15 -15, 35 -10, 50 -5 L 50 50 Z",
      targetX: -220,
      targetY: 80,
      targetRotate: -480,
      targetRotateX: 360,
      targetRotateY: -720,
      width: 90,
      height: 90,
    },
    {
      id: 2,
      // Large top-right chunk
      path: "M 10 40 L 50 0 C 65 -10, 85 -5, 95 15 L 50 50 Z",
      targetX: 240,
      targetY: 60,
      targetRotate: 520,
      targetRotateX: -540,
      targetRotateY: 640,
      width: 95,
      height: 90,
    },
    {
      id: 3,
      // Large bottom-left wedge
      path: "M 40 10 L 0 50 C -15 35, -5 15, 15 0 L 50 50 Z",
      targetX: -250,
      targetY: 220,
      targetRotate: -640,
      targetRotateX: 720,
      targetRotateY: -360,
      width: 90,
      height: 90,
    },
    {
      id: 4,
      // Large bottom-right wedge
      path: "M 10 10 L 50 50 C 65 35, 60 15, 40 0 L 0 50 Z",
      targetX: 260,
      targetY: 240,
      targetRotate: 600,
      targetRotateX: -360,
      targetRotateY: 720,
      width: 90,
      height: 90,
    },
    {
      id: 5,
      // Sharp left center splinter
      path: "M 30 20 L 0 15 C 5 5, 20 -5, 35 5 L 30 20 Z",
      targetX: -180,
      targetY: -40,
      targetRotate: -720,
      targetRotateX: 480,
      targetRotateY: -480,
      width: 60,
      height: 60,
    },
    {
      id: 6,
      // Sharp right center splinter
      path: "M 10 20 L 40 15 C 35 5, 20 -5, 5 5 L 10 20 Z",
      targetX: 190,
      targetY: -50,
      targetRotate: 720,
      targetRotateX: -480,
      targetRotateY: 480,
      width: 60,
      height: 60,
    },
    {
      id: 7,
      // Outer rim sliver top
      path: "M 20 25 L 20 0 C 10 5, -5 15, 5 30 L 20 25 Z",
      targetX: -80,
      targetY: -260,
      targetRotate: -380,
      targetRotateX: 360,
      targetRotateY: -360,
      width: 50,
      height: 50,
    },
    {
      id: 8,
      // Outer rim sliver bottom
      path: "M 20 10 L 20 40 C 30 35, 35 20, 25 5 L 20 10 Z",
      targetX: 90,
      targetY: 340,
      targetRotate: 840,
      targetRotateX: -720,
      targetRotateY: 540,
      width: 55,
      height: 55,
    },
    {
      id: 9,
      // Jagged center splinter
      path: "M 15 15 L 30 5 L 25 30 Z",
      targetX: -120,
      targetY: 130,
      targetRotate: -900,
      targetRotateX: 600,
      targetRotateY: -600,
      width: 40,
      height: 40,
    },
    {
      id: 10,
      // Tiny gold splinter 1 (flies high left)
      path: "M 10 10 L 20 0 L 25 15 Z",
      targetX: -290,
      targetY: -110,
      targetRotate: -1080,
      targetRotateX: 900,
      targetRotateY: -900,
      width: 30,
      height: 30,
    },
    {
      id: 11,
      // Tiny gold splinter 2 (flies high right)
      path: "M 15 10 L 5 0 L 20 20 Z",
      targetX: 300,
      targetY: -130,
      targetRotate: 1200,
      targetRotateX: -900,
      targetRotateY: 900,
      width: 30,
      height: 30,
    },
    {
      id: 12,
      // Tiny gold dust fleck 3 (vertical downward blast)
      path: "M 5 5 L 15 10 L 8 15 Z",
      targetX: -30,
      targetY: 420,
      targetRotate: -1400,
      targetRotateX: 1000,
      targetRotateY: -1000,
      width: 24,
      height: 24,
    },
    {
      id: 13,
      // Edge rim slice left
      path: "M 0 10 L 30 20 L 15 35 Z",
      targetX: -320,
      targetY: 40,
      targetRotate: -810,
      targetRotateX: 450,
      targetRotateY: -450,
      width: 45,
      height: 45,
    },
    {
      id: 14,
      // Edge rim slice right
      path: "M 30 10 L 0 20 L 15 35 Z",
      targetX: 330,
      targetY: 50,
      targetRotate: 980,
      targetRotateX: -450,
      targetRotateY: 450,
      width: 45,
      height: 45,
    },
  ];

  // Call completion after the shatter animation runs (0.9 seconds duration to fit dramatic feel)
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 950);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {fragments.map((frag) => (
        <motion.div
          key={frag.id}
          className="absolute"
          style={{
            width: frag.width,
            height: frag.height,
            transformOrigin: "center",
            perspective: "800px",
            transformStyle: "preserve-3d",
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: frag.targetX,
            // Realistic gravity parabola curve using 3 keyframes
            y: [0, frag.targetY - 80, frag.targetY + 400],
            rotate: frag.targetRotate,
            rotateX: frag.targetRotateX,
            rotateY: frag.targetRotateY,
            scale: [1, 0.75, 0],
            opacity: [1, 0.9, 0],
          }}
          transition={{
            duration: 0.9,
            times: [0, 0.35, 1],
            ease: "easeOut",
          }}
        >
          <svg
            className="w-full h-full filter drop-shadow-[2px_4px_8px_rgba(0,0,0,0.4)]"
            viewBox={`0 0 ${frag.width} ${frag.height}`}
            fill="none"
          >
            {/* Solid wax shard base - Royal Antique Gold Gradient */}
            <path
              d={frag.path}
              fill="url(#goldShatterGrad)"
              stroke="#513f1d"
              strokeWidth="0.8"
            />
            {/* Bright highlight on broken edge */}
            <path
              d={frag.path}
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.8"
              className="mix-blend-overlay"
            />
            
            <defs>
              <linearGradient id="goldShatterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAECC8" />
                <stop offset="25%" stopColor="#D5B978" />
                <stop offset="60%" stopColor="#947738" />
                <stop offset="100%" stopColor="#453613" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
