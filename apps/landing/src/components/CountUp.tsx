import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export function CountUp({
  to,
  suffix = '',
  prefix = '',
  duration = 1400,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration, bounce: 0 });
  const display = useTransform(spring, (v) =>
    `${prefix}${Math.round(v).toLocaleString('en-PK')}${suffix}`,
  );

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  return (
    <motion.span ref={ref}>{display}</motion.span>
  );
}
