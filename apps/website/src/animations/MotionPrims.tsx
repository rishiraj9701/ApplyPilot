import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';

// --- FADE IN WITH DIRECTION & SPRING PHYSICS ---
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  viewportOnce?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = '',
  viewportOnce = true,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = 28;
  const initialVariants = {
    up: { opacity: 0, y: offset },
    down: { opacity: 0, y: -offset },
    left: { opacity: 0, x: offset },
    right: { opacity: 0, x: -offset },
    none: { opacity: 0 },
  };

  return (
    <motion.div
      initial={initialVariants[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: viewportOnce, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- MAGNETIC BUTTON WITH FLUID CURSOR ATTRACTION ---
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 24,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * (strength / 100);
    const y = (clientY - (top + height / 2)) * (strength / 100);
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.15 }}
      className={`inline-block ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// --- SCRAMBLE TEXT (DESIGNBOOKMARK KINETIC PATTERN) ---
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

export function ScrambleText({
  text,
  className = '',
  triggerOnHover = false,
}: {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const scramble = () => {
    if (shouldReduceMotion || isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }

      iteration += 1 / 2;
    }, 28);
  };

  useEffect(() => {
    scramble();
  }, [text]);

  return (
    <span
      className={`font-mono inline-block ${className}`}
      onMouseEnter={triggerOnHover ? scramble : undefined}
    >
      {displayText}
    </span>
  );
}

// --- STREAMING TEXT (AI TOKEN EMISSION SIMULATOR) ---
export function StreamingText({
  text,
  speed = 18,
  className = '',
  onComplete,
  isStreaming = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  isStreaming?: boolean;
}) {
  const [displayed, setDisplayed] = useState('');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || !isStreaming) {
      setDisplayed(text);
      if (onComplete) onComplete();
      return;
    }

    setDisplayed('');
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayed(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, isStreaming, shouldReduceMotion]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && isStreaming && (
        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
}

// --- ROLL LINK (3D FLIP ON HOVER) ---
export function RollLink({
  text,
  href,
  className = '',
  onClick,
}: {
  text: string;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {text}
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`relative inline-block overflow-hidden group h-[1.35em] ${className}`}
    >
      <div className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2">
        <span className="block leading-[1.35em] text-slate-300 group-hover:text-emerald-400 transition-colors">
          {text}
        </span>
        <span className="block leading-[1.35em] text-emerald-400 font-semibold">
          {text}
        </span>
      </div>
    </a>
  );
}

// --- HOLD BUTTON (HOLD-TO-SIMULATE WITH SVG PROGRESS) ---
export function HoldButton({
  label,
  holdDuration = 1200,
  onTrigger,
  className = '',
}: {
  label: string;
  holdDuration?: number;
  onTrigger: () => void;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    setIsHolding(true);
    const step = 40;
    const increment = 100 / (holdDuration / step);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          setIsHolding(false);
          onTrigger();
          return 0;
        }
        return prev + increment;
      });
    }, step);
  };

  const cancelHold = () => {
    setIsHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onClick={() => {
        // Quick click triggers immediately if not holding
        if (progress === 0) onTrigger();
      }}
      className={`relative overflow-hidden select-none cursor-pointer group ${className}`}
    >
      {/* Background progress fill */}
      <div
        className="absolute inset-0 bg-emerald-400/25 transition-all"
        style={{ width: `${progress}%` }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {label}
        <span className="text-[10px] font-mono opacity-60">
          {isHolding ? `${Math.round(progress)}%` : '(Hold / Click)'}
        </span>
      </span>
    </button>
  );
}

// --- CARD GLOW BORDER ---
export function CardGlowBorder({
  children,
  className = '',
  active = false,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl border border-slate-800 bg-[#0c0e14] overflow-hidden transition-all duration-300 ${
        active ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/20' : 'hover:border-slate-700'
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl"
        style={{
          opacity: isHovered || active ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.12), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}
