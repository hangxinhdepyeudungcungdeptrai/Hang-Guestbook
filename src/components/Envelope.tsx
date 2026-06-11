import { motion } from "motion/react";
import { useState, useRef } from "react";

interface EnvelopeProps {
  onShatter: (x: number, y: number) => void;
  onTransitionScene: () => void;
  isShattered: boolean;
}

export default function Envelope({ onShatter, onTransitionScene, isShattered }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [letterRevealed, setLetterRevealed] = useState(false);
  const sealRef = useRef<HTMLButtonElement>(null);

  const handleSealClick = () => {
    if (isShattered || isOpen) return;

    // Get exact seal screen coordinates to feed the shattering pieces
    if (sealRef.current) {
      const rect = sealRef.current.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2;
      const clientY = rect.top + rect.height / 2;
      onShatter(clientX, clientY);
    }

    // Progression timeline:
    // 1. Instantly trigger shattering explosion (happens via prop trigger)
    // 2. Open top lid flap after 250ms
    setTimeout(() => {
      setIsOpen(true);
    }, 250);

    // 3. Slide up the letter card after 850ms
    setTimeout(() => {
      setLetterRevealed(true);
    }, 850);

    // 4. Fade out everything to transform into botanical garden after 2100ms
    setTimeout(() => {
      onTransitionScene();
    }, 2400);
  };

  return (
    <div className="relative w-full max-w-[420px] md:max-w-[660px] aspect-[1.6] perspective-[2500px] select-none z-10 transition-all duration-500">
      {/* 1. Base Shell of the Envelope (Dark Inner Pocket Background) */}
      <div className="absolute inset-x-0 bottom-0 top-0 bg-[#4f0407] rounded-lg shadow-[0_25px_60px_rgba(40,2,2,0.5)] pointer-events-none" />

      {/* 2. Hidden Letter Card with Elegant Gold Motif Letter "H" (Slides Up) */}
      <motion.div
        initial={{ y: 0, zIndex: 1, scale: 0.98 }}
        animate={
          letterRevealed
            ? { y: "-58%", zIndex: 3, scale: 1.02 }
            : { y: 0, zIndex: 1, scale: 0.98 }
        }
        transition={{
          y: { duration: 1.25, ease: [0.16, 1, 0.3, 1] }, // Ultra-smooth exponential deceleration
          scale: { duration: 1.25, ease: [0.16, 1, 0.3, 1] },
        }}
        className="absolute left-[4%] top-[4%] w-[92%] h-[92%] bg-[#FAF9F5] rounded border border-[#eee2cc] p-4 md:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.1)] cursor-default select-none pointer-events-auto"
      >
        {/* Intricate golden double border inside the letter */}
        <div className="w-full h-full border border-[#e6dcc5]/60 rounded flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Subtle design corners inside the letter back */}
          <div className="absolute inset-1 border border-dashed border-[#8F9E8B]/10 rounded" />
          
          {/* Majestic Royal Serif Capital "H" with Elegant Traditional Footings */}
          <svg
            className="w-28 h-28 md:w-44 md:h-44 text-[#a3803b] filter drop-shadow-[2px_3px_5px_rgba(0,0,0,0.22)] drop-shadow-[-1px_-1px_1px_rgba(255,255,255,0.8)]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <defs>
              {/* Metallic Antique Gold Gradient for the Letter 'H' */}
              <linearGradient id="royalHGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef0cc" />
                <stop offset="25%" stopColor="#dac182" />
                <stop offset="50%" stopColor="#967936" />
                <stop offset="75%" stopColor="#dfc785" />
                <stop offset="100%" stopColor="#67501a" />
              </linearGradient>
            </defs>

            {/* Majestic Traditional Roman Serif Capital H */}
            <g fill="url(#royalHGold)" stroke="#574213" strokeWidth="0.4">
              {/* Left Pillar with precise classical serifs */}
              <path d="M 21 24 L 43 24 L 38 31 L 35 31 L 35 69 L 38 69 L 43 76 L 21 76 L 26 69 L 29 69 L 29 31 L 26 31 Z" />
              
              {/* Right Pillar with precise classical serifs */}
              <path d="M 57 24 L 79 24 L 74 31 L 71 31 L 71 69 L 74 69 L 79 76 L 57 76 L 62 69 L 65 69 L 65 31 L 62 31 Z" />
              
              {/* Central Crossbar bridge */}
              <path d="M 35 46.5 L 65 46.5 L 65 53.5 L 35 53.5 Z" strokeLinejoin="miter" />
            </g>

            {/* Inner elegant hairline highlight inside the letter 'H' to feel hand-crafted */}
            <g stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" strokeLinecap="round">
              <line x1="32" y1="33" x2="32" y2="67" />
              <line x1="68" y1="33" x2="68" y2="67" />
              <line x1="38" y1="50" x2="62" y2="50" />
            </g>

            {/* Subtle luxury corner framing dots */}
            <circle cx="50" cy="15" r="1.5" fill="#dac182" />
            <circle cx="50" cy="85" r="1.5" fill="#dac182" />
          </svg>
          
        </div>
      </motion.div>

      {/* 3. Front Flaps & Pocket (Left, Right, Bottom Panels) */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none">
        <svg
          className="w-full h-full filter drop-shadow-[0_-5px_15px_rgba(0,0,0,0.18)]"
          viewBox="0 0 480 300"
          fill="none"
        >
          {/* Left Flap */}
          <path d="M 0 0 L 240 150 L 0 300 Z" fill="#75080c" />
          {/* Right Flap */}
          <path d="M 480 0 L 240 150 L 480 300 Z" fill="#75080c" />
          {/* Bottom Flap */}
          <path d="M 0 300 L 240 150 L 480 300 Z" fill="#8c1015" />
          {/* Pocket border lines to emphasize 3D edge contours */}
          <path d="M 0 300 L 240 150 L 480 300" stroke="#630408" strokeWidth="1.2" />
        </svg>
      </div>

      {/* 4. Folding Top Flap Lid (Attached to top, rotates in 3D space) */}
      <motion.div
        style={{
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: isOpen ? -180 : 0,
          zIndex: isOpen ? 0 : 20,
        }}
        transition={{
          duration: 1.15,
          ease: [0.25, 1, 0.5, 1], // Vintage slow acceleration
        }}
        className="absolute top-0 left-0 w-full h-[60%] origin-top transform-style-preserve-3d"
      >
        <svg
          className="w-full h-full filter drop-shadow-[0_8px_10px_rgba(20,1,1,0.35)]"
          style={{ backfaceVisibility: "visible" }}
          viewBox="0 0 480 180"
          fill="none"
        >
          {/* Double-sided triangular flap */}
          <path d="M 0 0 L 240 180 L 480 0 Z" fill="#9e1318" />
          <path d="M 0 0 L 240 178 L 480 0" stroke="#71050a" strokeWidth="1.2" />
        </svg>

        {/* 5. Gold Metallic Embossed Wax Seal (Màu vàng trầm) */}
        {!isOpen && !isShattered && (
          <motion.button
            id="wax-seal"
            ref={sealRef}
            onClick={(e) => {
              e.stopPropagation();
              handleSealClick();
            }}
            whileHover={{ scale: 1.08, rotate: 1.5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.92 }}
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-30 cursor-pointer focus:outline-none select-none"
          >
            {/* Irregular vintage wax contour simulating heavy cast antique gold */}
            <div className="relative w-20 h-20 md:w-26 md:h-26 rounded-full bg-gradient-to-br from-[#EADAA3] via-[#a38541] to-[#453613] shadow-[0_8px_25px_rgba(25,12,3,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center border border-[#FAECC8]/35">
              {/* Extra outer metallic gold squeeze ring */}
              <div className="absolute -inset-[3px] rounded-full border border-[#D5B978]/30 filter blur-[0.5px] opacity-75 pointer-events-none" />
              
              {/* Embossed Inner stamp recess (Thập niên cổ điển, nhám dập nổi) */}
              <div className="w-[84%] h-[84%] rounded-full border border-[#4d3b10]/40 bg-gradient-to-br from-[#dfc88a] via-[#947738] to-[#51401a] flex items-center justify-center shadow-[inset_0_4px_6px_rgba(0,0,0,0.45),0_1.5px_2.5px_rgba(255,255,255,0.25)] relative overflow-hidden">
                
                {/* 3D Highlight Shine Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                {/* Highly embossed botanical branch with distinct top-light and bottom-shadow paths to feel like real carved gold */}
                <div className="relative w-[62%] h-[62%]">
                  {/* Embossed Dark Drop-Shadow underneath for heavy metallic depth */}
                  <svg
                    className="absolute inset-0 text-[#2b2005] translate-x-[0.8px] translate-y-[1px] opacity-80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22V10" />
                    <path d="M12 12c2.5-1.5 4-4 4-7" />
                    <path d="M12 15c-2.5-1.5-4-4-4-7" />
                    <path d="M12 18c3-1 5-3 5-5" />
                    <path d="M12 20c-3-1-5-3-5-5" />
                    <path d="M15.5 5c0.8-1.2 1.5-1.8 1.5-1.8" />
                    <path d="M8.5 5c-0.8-1.2-1.5-1.8-1.5-1.8" />
                  </svg>

                  {/* Embossed Bright Gold Highlight shifted slightly up-left */}
                  <svg
                    className="absolute inset-0 text-[#FFFAA3] -translate-x-[0.5px] -translate-y-[0.6px] opacity-45"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22V10" />
                    <path d="M12 12c2.5-1.5 4-4 4-7" />
                    <path d="M12 15c-2.5-1.5-4-4-4-7" />
                    <path d="M12 18c3-1 5-3 5-5" />
                    <path d="M12 20c-3-1-5-3-5-5" />
                    <path d="M15.5 5c0.8-1.2 1.5-1.8 1.5-1.8" />
                    <path d="M8.5 5c-0.8-1.2-1.5-1.8-1.5-1.8" />
                  </svg>

                  {/* Core Embossed Gold Stroke */}
                  <svg
                    className="absolute inset-0 text-[#FCE19B]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22V10" />
                    <path d="M12 12c2.5-1.5 4-4 4-7" />
                    <path d="M12 15c-2.5-1.5-4-4-4-7" />
                    <path d="M12 18c3-1 5-3 5-5" />
                    <path d="M12 20c-3-1-5-3-5-5" />
                    <path d="M15.5 5c0.8-1.2 1.5-1.8 1.5-1.8" />
                    <path d="M8.5 5c-0.8-1.2-1.5-1.8-1.5-1.8" />
                  </svg>
                </div>

              </div>
            </div>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
