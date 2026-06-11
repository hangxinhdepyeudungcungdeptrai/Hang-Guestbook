import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { supabase, hasSupabase } from "../lib/supabase";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

// Prefilled initial messages to populate our memory book initially (empty for production)
const INITIAL_ENTRIES: GuestbookEntry[] = [];

// Helper to fit headline font size exactly like in Section 2
function FitText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [style, setStyle] = useState<any>({
    fontSize: "3rem",
    lineHeight: "1.2",
    visibility: "hidden",
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const adjustSize = () => {
      const parent = el.parentElement;
      if (!parent) return;

      const layoutContainer = el.parentElement?.parentElement || parent;
      const parentWidth = layoutContainer.getBoundingClientRect().width;
      const maxAvailableWidth = Math.max(280, parentWidth - 48);

      let size = 48; // Peak size
      el.style.fontSize = `${size}px`;
      el.style.display = "inline-block";
      el.style.whiteSpace = "nowrap";

      while (el.scrollWidth > maxAvailableWidth && size > 16) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }

      setStyle({
        fontSize: `${size}px`,
        lineHeight: "1.2",
        visibility: "visible",
      });
    };

    adjustSize();
    window.addEventListener("resize", adjustSize);
    const observer = new ResizeObserver(adjustSize);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }

    return () => {
      window.removeEventListener("resize", adjustSize);
      observer.disconnect();
    };
  }, [text]);

  return (
    <div className="filter drop-shadow-[0_2px_8px_rgba(140,109,79,0.15)] inline-block max-w-full">
      <h2
        ref={containerRef}
        className={`font-luxury italic tracking-[0.03em] font-medium text-center mx-auto select-none inline-block max-w-[95vw] sm:max-w-full py-1 ${className || ""}`}
        style={style}
      >
        {text}
      </h2>
    </div>
  );
}

// Flower components removed as requested

// Helper to determine random star coordinates deterministically based on guestbook message ID
function getDeterministicCoords(id: string) {
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < id.length; i++) {
    hash1 = id.charCodeAt(i) + ((hash1 << 5) - hash1);
    hash2 = id.charCodeAt(i) * 31 + ((hash2 << 7) - hash2);
  }
  // Map x coordinate within safe center sky region: 8% to 92%
  const x = 8 + (Math.abs(hash1) % 84);
  // Map y coordinate within safe top-half/middle sky region: 8% to 82%
  const y = 8 + (Math.abs(hash2) % 74);
  // size between 3px to 6px
  const size = 3.5 + (Math.abs(hash1 + hash2) % 3);
  return { x, y, size };
}

export default function GuestbookSection() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFolding, setIsFolding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Dynamic real-time date that updates client side immediately
  const [currentDateString, setCurrentDateString] = useState("");

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    setCurrentDateString(formatted);
  }, []);

  const loadLocalStorageFallback = () => {
    const stored = localStorage.getItem("spbgs_guestbook_entries");
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        setEntries(INITIAL_ENTRIES);
      }
    } else {
      setEntries(INITIAL_ENTRIES);
      localStorage.setItem("spbgs_guestbook_entries", JSON.stringify(INITIAL_ENTRIES));
    }
  };

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formatted: GuestbookEntry[] = data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          message: item.message,
          timestamp: new Date(item.created_at).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        }));
        setEntries(formatted);
        localStorage.setItem("spbgs_guestbook_entries", JSON.stringify(formatted));
      } else {
        setEntries(INITIAL_ENTRIES);
      }
    } catch (err) {
      console.error("Error fetching from Supabase, falling back to localStorage:", err);
      loadLocalStorageFallback();
    }
  };

  // Initialize guestbook and listen for real-time changes
  useEffect(() => {
    if (!hasSupabase) {
      loadLocalStorageFallback();
      return;
    }

    fetchEntries();

    // Subscribe to real-time INSERT events
    const channel = supabase
      .channel("public-guestbook-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guestbook" },
        (payload) => {
          const newItem = payload.new;
          const formattedEntry: GuestbookEntry = {
            id: newItem.id.toString(),
            name: newItem.name,
            message: newItem.message,
            timestamp: new Date(newItem.created_at).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          };

          setEntries((prev) => {
            if (prev.some((entry) => entry.id === formattedEntry.id)) {
              return prev;
            }
            const updated = [formattedEntry, ...prev];
            localStorage.setItem("spbgs_guestbook_entries", JSON.stringify(updated));
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Calligraphy / writing period simulation
    setTimeout(async () => {
      // Begin folding + flight trajectory animation
      setIsFolding(true);

      let insertFailed = false;
      let insertedEntry: GuestbookEntry | null = null;

      if (hasSupabase) {
        try {
          const { data, error } = await supabase
            .from("guestbook")
            .insert([
              {
                name: name.trim(),
                message: message.trim(),
              }
            ])
            .select();

          if (error) throw error;

          if (data && data[0]) {
            const newItem = data[0];
            insertedEntry = {
              id: newItem.id.toString(),
              name: newItem.name,
              message: newItem.message,
              timestamp: new Date(newItem.created_at).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
            };
          }
        } catch (err) {
          console.error("Error writing to Supabase, falling back to localStorage:", err);
          insertFailed = true;
        }
      }

      setTimeout(() => {
        if (!hasSupabase || insertFailed) {
          const newEntry: GuestbookEntry = {
            id: `user-${Date.now()}`,
            name: name.trim(),
            message: message.trim(),
            timestamp: new Date().toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })
          };

          setEntries((prev) => {
            const updated = [newEntry, ...prev];
            localStorage.setItem("spbgs_guestbook_entries", JSON.stringify(updated));
            return updated;
          });
        } else if (insertedEntry) {
          setEntries((prev) => {
            if (prev.some((entry) => entry.id === insertedEntry!.id)) {
              return prev;
            }
            const updated = [insertedEntry!, ...prev];
            localStorage.setItem("spbgs_guestbook_entries", JSON.stringify(updated));
            return updated;
          });
        }

        // Reset inputs and stage states
        setName("");
        setMessage("");
        setIsSubmitting(false);
        setIsFolding(false);
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 4500);
      }, 1400); // matching framer-motion flight curve duration
    }, 1000);
  };

  return (
    <div id="section-guestbook" className="relative w-full max-w-6xl mx-auto py-16 px-8 xs:px-10 sm:px-12 md:px-14 flex flex-col items-center z-20">
      
      {/* Header Block with headline font size matching TimelineSection */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center mb-10 w-full max-w-full overflow-hidden"
      >
        <span className="text-[#8C6D4F]/80 text-[10px] md:text-xs tracking-[0.4em] uppercase font-serif mb-4 block">
          Lưu Bút Hồi Ức
        </span>
        <div id="guestbook-heading-container" className="mb-4">
          {/* Mobile version matches Section 2 title style exactly */}
          <div className="sm:hidden flex flex-col items-center justify-center gap-1.5 px-3 py-1">
            <span className="font-luxury italic text-[24px] xs:text-[28px] gold-lux-text text-center font-bold tracking-wide leading-snug">
              Classes end, but
            </span>
            <span className="font-luxury italic text-[24px] xs:text-[28px] gold-lux-text text-center font-bold tracking-wide leading-snug">
              never a friend.
            </span>
          </div>

          {/* Desktop version uses FitText matches Section 2 title size exactly */}
          <div className="hidden sm:block">
            <FitText text="Classes end, but never a friend" className="gold-lux-text font-bold" />
          </div>
        </div>
        <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#8C6D4F]/30 to-transparent mx-auto" />
      </motion.div>

      {/* ========================================================
          ELEGANT BOTANICAL OVERLAYS
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-85">
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[90%] h-[55%] bg-[#DFD5C2]/15 rounded-full filter blur-[100px]" />
      </div>

      {/* Grid container: Left celestial sky painting, and Right stationery card sheet */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mt-2 z-10">
        
        {/* LEFT COLUMN: THE GORGEOUS CELESTIAL SKY PAINTING FRAME (Col span 5) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col h-full min-h-[380px] w-full max-w-[480px] lg:max-w-none mx-auto"
        >
          <div className="relative flex-1 rounded-[12px] p-2 bg-[#2D1F15] border-[6px] border-[#3E2D22] shadow-[0_12px_24px_rgba(0,0,0,0.35)] flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0.5 border border-[#D4AF37]/30 pointer-events-none rounded-[6px]" />
            
            <div className="relative flex-1 rounded-[4px] bg-gradient-to-b from-[#0A0C16] via-[#10142C] to-[#040508] overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              <div className="absolute top-[10%] left-[20%] w-[160px] h-[160px] rounded-full bg-violet-900/25 filter blur-[35px] pointer-events-none" />
              <div className="absolute bottom-[15%] right-[10%] w-[200px] h-[200px] rounded-full bg-[#1A1A40]/30 filter blur-[40px] pointer-events-none" />

              {/* Milky Way (Dải ngân hà) diagonal glowing trail with dust stars */}
              <div className="absolute inset-x-0 top-[20%] bottom-[20%] select-none pointer-events-none opacity-45 transform rotate-[-25deg] scale-125">
                {/* Core gradient tube */}
                <div className="absolute inset-x-[-20%] top-1/2 -translate-y-1/2 h-16 bg-gradient-to-r from-transparent via-violet-500/20 via-indigo-400/25 via-amber-200/10 to-transparent blur-[20px]" />
                <div className="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 h-6 bg-gradient-to-r from-transparent via-fuchsia-400/15 via-pink-400/20 via-amber-100/15 to-transparent blur-[12px]" />
                
                {/* Galactic dust particles (small delicate glittering points) */}
                <svg className="absolute inset-0 w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
                  <g fill="#FFF" opacity="0.65">
                    <circle cx="30" cy="40" r="1" />
                    <circle cx="80" cy="55" r="1.5" className="animate-pulse" />
                    <circle cx="120" cy="35" r="0.8" />
                    <circle cx="160" cy="65" r="1.2" />
                    <circle cx="210" cy="45" r="1" />
                    <circle cx="250" cy="50" r="1.5" className="animate-pulse" />
                    <circle cx="290" cy="30" r="0.8" />
                    <circle cx="340" cy="70" r="1.3" />
                  </g>
                  <g fill="#FFEAAA" opacity="0.5">
                    <circle cx="50" cy="60" r="1.2" />
                    <circle cx="100" cy="42" r="0.9" />
                    <circle cx="140" cy="58" r="1.5" />
                    <circle cx="180" cy="38" r="0.7" />
                    <circle cx="230" cy="62" r="1.2" className="animate-pulse" />
                    <circle cx="270" cy="48" r="1" />
                    <circle cx="310" cy="66" r="1.4" />
                  </g>
                </svg>
              </div>

              {/* Exquisite Moonlight and Glowing Crescent Moon Halo */}
              <div className="absolute top-6 right-6 select-none pointer-events-none flex items-center justify-center">
                {/* Glowing lunar rings for atmospheric halo */}
                <div className="absolute w-16 h-16 rounded-full bg-amber-100/5 blur-[8px] animate-pulse" />
                <div className="absolute w-12 h-12 rounded-full bg-[#FFEAAA]/10 blur-[4px]" />
                <div className="absolute w-8 h-8 rounded-full bg-[#FFEAAA]/15 blur-[2px]" />

                {/* Exquisite Crescent Moon with fine detailing */}
                <svg className="w-10 h-10 text-[#FFF3CC] filter drop-shadow-[0_0_12px_rgba(255,243,204,0.8)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Subtle full moon shadow background */}
                  <circle cx="12" cy="12" r="9" fill="url(#lunarShadowGrad)" opacity="0.15" />
                  {/* Radiant crescent shape */}
                  <path
                    d="M12.3 21h-.1c-4.9 0-9-3.9-9-9 0-4.3 3.1-8 7.3-8.8.4-.1.8.2.9.6.1.4-.1.8-.5 1-3.2 1.6-5.1 5-4.6 8.6.5 3.6 3.5 6.4 7.2 6.5.9.1 1.8 0 2.7-.3.4-.2.8 0 1 .4.2.4 0 .9-.4 1.1-1.5.5-3.1.6-4.7.5z"
                    fill="url(#lunarGoldGrad)"
                  />
                  {/* Outer delicate lunar glow accent line */}
                  <path
                    d="M12.1 3.1C7.7 3.6 4.2 7.1 3.1 11.5"
                    stroke="#FFFDF5"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <defs>
                    <radialGradient id="lunarShadowGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF3CC" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <linearGradient id="lunarGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="40%" stopColor="#FFF5D6" />
                      <stop offset="75%" stopColor="#FADF9E" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Render stars representing the memories submitted */}
              <AnimatePresence>
                {entries.map((entry) => {
                  const { x, y, size } = getDeterministicCoords(entry.id);
                  return (
                    <motion.div
                      key={`star-${entry.id}`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-help z-10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 85, damping: 13 }}
                    >
                      {/* Glowing golden circular core */}
                      <div 
                        style={{ width: `${size}px`, height: `${size}px` }}
                        className="rounded-full bg-amber-100 shadow-[0_0_6px_rgba(255,229,143,0.9),0_0_12px_rgba(255,229,143,0.7)]" 
                      />
                      <div className="absolute inset-0 scale-[2.2] bg-amber-200/15 rounded-full blur-[0.5px] transition-transform duration-500 group-hover:scale-[3.8] group-hover:bg-amber-100/25" />

                      {/* Tooltip with sender name */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-35 pointer-events-none whitespace-nowrap bg-[#18110D]/95 border border-[#D4AF37]/50 text-[#FCFAF7] px-2.5 py-1 rounded text-[10px] font-serif shadow-xl">
                        <span className="text-[#D4AF37] mr-1">✦</span> Lời chúc của <span className="font-bold text-amber-200">{entry.name}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Text trong bức tranh chỉ hiện mỗi: Wishes Sky */}
              <div className="relative z-10 pointer-events-none text-center pb-3 pt-6 flex-grow flex flex-col justify-end items-center h-full">
                <span className="font-luxury text-[13px] sm:text-[15px] tracking-[0.28em] text-[#FFEAAA]/80 text-center block leading-loose font-bold drop-shadow-[0_0_8px_rgba(255,234,170,0.55)] uppercase">
                  Wishes Sky
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: THE COMPACT STATIONERY CARD FOR WRITING (Col span 7) */}
        <div className="lg:col-span-7 relative flex justify-center items-center">
          
          {/* Grounding page shadows */}
          <div className="absolute inset-x-8 -bottom-1 top-6 bg-black/12 blur-[16px] rounded-[10px] pointer-events-none" />

          <motion.div
            animate={
              isFolding
                ? {
                    scale: [1, 0.75, 0.35, 0.01],
                    x: [0, -120, -320, -480], // fly directly leftwards to the sky frame!
                    y: [0, -30, 20, -120], // curved physical trajectory
                    rotate: [0, 45, 120, 220],
                    opacity: [1, 0.9, 0.5, 0],
                  }
                : { scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 }
            }
            transition={{ duration: 1.4, ease: [0.25, 1, 0.4, 1] }}
            className="relative w-full max-w-[480px] sm:max-w-[550px] z-10 mx-auto"
          >
            {/* Scalloped paper stationery card container */}
            <div className="relative w-full rounded-[4px] bg-[#FCF8F2] border border-[#DECFBE] p-8 sm:p-11 pb-7 sm:pb-9 overflow-hidden flex flex-col">
              
              {/* STAMP SCALLOP OVERLAYS (Postage stamp look based on the illustration) */}
              <div className="absolute -top-[11px] left-4 right-4 flex justify-between h-[22px] pointer-events-none select-none z-20 overflow-hidden">
                {Array.from({ length: 17 }).map((_, i) => (
                  <div key={i} className="w-[22px] h-[22px] rounded-full bg-[#FAF8F5] flex-shrink-0" />
                ))}
              </div>

              <div className="absolute -bottom-[11px] left-4 right-4 flex justify-between h-[22px] pointer-events-none select-none z-20 overflow-hidden">
                {Array.from({ length: 17 }).map((_, i) => (
                  <div key={i} className="w-[22px] h-[22px] rounded-full bg-[#FAF8F5] flex-shrink-0" />
                ))}
              </div>

              <div className="absolute -left-[11px] top-4 bottom-4 flex flex-col justify-between w-[22px] pointer-events-none select-none z-20 overflow-hidden">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} className="w-[22px] h-[22px] rounded-full bg-[#FAF8F5] flex-shrink-0" />
                ))}
              </div>

              <div className="absolute -right-[11px] top-4 bottom-4 flex flex-col justify-between w-[22px] pointer-events-none select-none z-20 overflow-hidden">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} className="w-[22px] h-[22px] rounded-full bg-[#FAF8F5] flex-shrink-0" />
                ))}
              </div>

              {/* Elegant Classical Inner Lines Frame */}
              <div className="absolute inset-[15px] sm:inset-[20px] md:inset-[24px] border border-[#8B3E36]/30 rounded-sm pointer-events-none z-10 select-none">
                <div className="absolute inset-[3px] border border-dashed border-[#8B3E36]/15 rounded-sm" />
                <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-1.5 border-l-1.5 border-[#8B3E36]/50" />
                <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-1.5 border-r-1.5 border-[#8B3E36]/50" />
                <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-1.5 border-l-1.5 border-[#8B3E36]/50" />
                <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-1.5 border-r-1.5 border-[#8B3E36]/50" />
                <span className="absolute top-1 left-1.5 text-[8px] text-[#8B3E36]/40">❦</span>
                <span className="absolute top-1 right-1.5 text-[8px] text-[#8B3E36]/40">❦</span>
                <span className="absolute bottom-1 left-1.5 text-[8px] text-[#8B3E36]/40">❦</span>
                <span className="absolute bottom-1 right-1.5 text-[8px] text-[#8B3E36]/40">❦</span>
              </div>

              {/* Top Right Vintage Stamps Cluster - Absolutely positioned to avoid layout and overlap issues */}
              <div className="absolute right-4 top-4 sm:right-7 sm:top-7 z-20 pointer-events-none select-none opacity-95 rotate-[6deg] flex gap-1.5 scale-[0.65] sm:scale-100 origin-top-right">
                {/* Dark Heart Stamp */}
                <div className="relative w-11 h-13 bg-[#8B3E2F]/90 text-[#FDFBF7] p-1 shadow-md transform -rotate-[14deg] flex flex-col justify-between items-center border border-[#FAF6EE] rounded-[1px]">
                  <div className="absolute inset-0.5 border border-dashed border-[#FDFBF7]/30" />
                  <span className="text-[5px] font-mono tracking-widest text-[#FDFBF7]/80 mt-0.5 relative z-10">LOVE</span>
                  <svg className="w-5 h-5 text-[#FDFBF7] relative z-10 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="text-[5px] font-serif font-bold mb-0.5 relative z-10">10¢</span>
                </div>
                {/* Coral Stamp */}
                <div className="relative w-10 h-12 bg-[#C25953]/90 text-[#FDFBF7] p-1 shadow-md transform rotate-6 flex flex-col justify-between items-center border border-[#FAF6EE] rounded-[1px]">
                  <div className="absolute inset-0.5 border border-dashed border-[#FDFBF7]/30" />
                  <span className="text-[4px] font-mono tracking-widest text-[#FDFBF7]/80 mt-0.5 relative z-10">FAITH</span>
                  <svg className="w-4 h-4 text-[#FDFBF7]/90 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="text-[5px] font-serif font-bold mb-0.5 relative z-10">5¢</span>
                </div>
              </div>

              {/* CARD BODY: Unified & Balanced spaces */}
              <div className="relative z-10 flex flex-col justify-between flex-grow mt-10 sm:mt-14 md:mt-[60px] w-full">
                <div>
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-2.5 bg-[#FAF1EE] border border-[#D5B5B2] text-[#8B3E36] rounded text-[11px] text-center font-serif italic shadow-inner w-full"
                      >
                        ✦ Lời nhắn hồi ức đã hóa thành ngôi sao sáng lấp lánh trên bầu trời của tụi mình!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-1.5 sm:px-4 w-full">
                    
                    {/* Date clean line with identical font styles */}
                    <div className="flex items-end gap-2 text-[#8B3E36]/80 whitespace-nowrap pr-14 sm:pr-24 w-full">
                      <span className="font-serif font-bold text-[12px] tracking-widest uppercase mb-1">Date:</span>
                      <span className="font-handwritten text-[#5A4535] text-[20px] sm:text-[23.5px] select-text ml-1 border-b border-dashed border-[#8B3E36]/40 pb-0.5 flex-1 min-w-0 tracking-wide">
                        {currentDateString || "11/06/2026"}
                      </span>
                    </div>

                    {/* To: segment with identical font styles */}
                    <div className="flex items-end gap-2 text-[#8B3E36]/80 whitespace-nowrap pr-14 sm:pr-24 w-full">
                      <span className="font-serif font-bold text-[12px] tracking-widest uppercase mb-1">To:</span>
                      <span className="font-handwritten text-[#5A4535] text-[20px] sm:text-[23.5px] select-text ml-1 border-b border-dashed border-[#8B3E36]/40 pb-0.5 flex-1 min-w-0 tracking-wide">
                        Me
                      </span>
                    </div>

                    {/* From: segment with identical font styles and matching baseline spacing */}
                    <div className="flex items-end gap-2 text-[#8B3E36]/80 whitespace-nowrap w-full min-w-0 pr-3 sm:pr-6">
                      <span className="font-serif font-bold text-[12px] tracking-widest uppercase mb-1.5">From:</span>
                      <input
                        id="guestbook-name"
                        type="text"
                        required
                        maxLength={32}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder=""
                        className="flex-1 min-w-0 bg-transparent border-b border-dashed border-[#8B3E36]/40 focus:border-[#8B3E36] focus:outline-none text-[#5A4535] font-handwritten text-[20px] sm:text-[23.5px] px-1 pb-[2px] tracking-wide transition-colors duration-300"
                      />
                    </div>

                    {/* Textarea matching line-height exactly */}
                    <div className="relative h-[160px] sm:h-[192px] mt-1 w-full pr-3 sm:pr-6">
                      <textarea
                        id="guestbook-message"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder=""
                        style={{ 
                          lineHeight: '32px', 
                          backgroundImage: 'linear-gradient(rgba(139, 62, 54, 0.08) 1px, transparent 1px)', 
                          backgroundSize: '100% 32px',
                          backgroundAttachment: 'local',
                        }}
                        className="w-full h-full bg-transparent border-none focus:outline-none text-[#3E2D22] font-handwritten text-[19px] sm:text-[22px] leading-[32px] px-2 py-0 resize-none z-10 relative overflow-y-auto custom-scrollbar tracking-wide"
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      id="btn-submit-wish"
                      type="submit"
                      disabled={isSubmitting || !name.trim() || !message.trim()}
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 22px rgba(197, 59, 43, 0.45)" }}
                      whileTap={{ scale: 0.98 }}
                      className="relative w-full py-4 px-5 overflow-hidden rounded-[8px] border border-[#FF9185]/55 font-luxury font-bold text-[13px] sm:text-[14px] uppercase tracking-[0.24em] text-white shadow-[0_5px_15px_rgba(197,59,43,0.3)] disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_25px_rgba(197,59,43,0.5)] transition-all duration-300 flex items-center justify-center z-10 cursor-pointer mt-1"
                      style={{
                        background: "linear-gradient(135deg, #9C1F16 0%, #D83C2C 25%, #FFB653 50%, #D83C2C 75%, #9C1F16 100%)",
                        backgroundSize: "200% auto",
                      }}
                      animate={{
                        backgroundPosition: ["0% center", "200% center"],
                      }}
                      transition={{
                        backgroundPosition: {
                          repeat: Infinity,
                          duration: 4,
                          ease: "linear"
                        }
                      }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.3),_transparent_55%)] mix-blend-overlay pointer-events-none" />
                      
                      {/* Animated light sweep */}
                      <motion.div 
                        className="absolute inset-y-0 -inset-x-16 w-16 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-15deg]"
                        animate={{
                          x: ["-100%", "280%"]
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatDelay: 2.5,
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      />

                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="font-bold drop-shadow-md tracking-[0.2em]">Đang gửi...</span>
                        </div>
                      ) : (
                        <motion.div 
                          className="tracking-[0.24em] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)] flex items-center justify-center"
                          initial={{ letterSpacing: "0.24em" }}
                          whileHover={{ letterSpacing: "0.28em" }}
                          transition={{ duration: 0.3 }}
                        >
                          Lưu bút
                        </motion.div>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
