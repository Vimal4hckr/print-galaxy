import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-flex"
    >
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
          onClick={onClick}
          className={className}
        >
          {children}
        </a>
      ) : (
        <button
          type={type}
          disabled={disabled}
          aria-label={ariaLabel}
          onClick={onClick}
          className={className}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
}
