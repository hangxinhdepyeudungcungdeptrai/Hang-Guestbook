import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BackgroundFrame from "./components/BackgroundFrame";
import Envelope from "./components/Envelope";
import ShatteredSeal from "./components/ShatteredSeal";
import BotanicalGarden from "./components/BotanicalGarden";

type AppScene = "envelope" | "garden";

export default function App() {
  const [scene, setScene] = useState<AppScene>("envelope");
  const [isShattered, setIsShattered] = useState(false);
  const [shatterCoords, setShatterCoords] = useState<{ x: number; y: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Trigger the shattering explosion at exact click coordinates
  const handleSealShatter = (clientX: number, clientY: number) => {
    setShatterCoords({ x: clientX, y: clientY });
    setIsShattered(true);
  };

  // Move from envelope page to botanical sanctuary scene
  const handleTransitionScene = () => {
    setIsTransitioning(true);
    // Let the envelope and background frame fade out completely over 1.2 seconds,
    // then swap the active scene.
    setTimeout(() => {
      setScene("garden");
      setIsTransitioning(false);
    }, 1250);
  };

  // Replay utility (fades out current garden, resets all states, and fades in clean sealed mailing envelope)
  const handleReplayActive = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShatterCoords(null);
      setIsShattered(false);
      setScene("envelope");
      setIsTransitioning(false);
    }, 1000);
  };

  return (
    <div className={`relative w-full min-h-[100dvh] select-none overflow-x-hidden transition-colors duration-1000 ${scene === "envelope" ? "bg-[#FAF9F5]" : "animate-warm-gradient"}`}>
      {/* Background Frame with elegant botanical branches in corners */}
      <BackgroundFrame isGardenScene={scene === "garden"} />

      {/* Render the Shattered Seal Explosion on the top-most overlay layer */}
      {isShattered && shatterCoords && (
        <ShatteredSeal
          x={shatterCoords.x}
          y={shatterCoords.y}
          onAnimationComplete={() => {
            // Keep fragments in state but clean up coordinates or allow overlay to finish
          }}
        />
      )}

      {/* Primary Scenic Router wrapped in Framer Motion Transition Managers */}
      <AnimatePresence mode="wait">
        {scene === "envelope" ? (
          <motion.div
            key="envelope-scene"
            id="envelope-container"
            initial={{ opacity: 1, scale: 1 }}
            animate={
              isTransitioning
                ? { opacity: 0, scale: 0.95, filter: "blur(12px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full min-h-[100dvh] flex items-center justify-center p-6 md:p-12 z-10"
          >
            <Envelope
              onShatter={handleSealShatter}
              onTransitionScene={handleTransitionScene}
              isShattered={isShattered}
            />
          </motion.div>
        ) : (
          <motion.div
            key="garden-scene"
            id="garden-container"
            initial={{ opacity: 0, filter: "blur(15px)" }}
            animate={
              isTransitioning
                ? { opacity: 0, filter: "blur(15px)" }
                : { opacity: 1, filter: "blur(0px)" }
            }
            exit={{ opacity: 0, filter: "blur(15px)" }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="relative w-full min-h-[100dvh] z-10"
          >
            <BotanicalGarden onReplay={handleReplayActive} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
