import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { SparklineChart } from './SparklineChart';

export interface StatCardProps {
  title: string;
  value: number | string;
  delta?: number;
  prefix?: string;
  suffix?: string;
  sparkline?: number[];
  /** Hex or CSS color for stroke + gradient */
  sparklineColor?: string;
  animateCount?: boolean;
  formatter?: (n: number) => string;
}

function CountUp({
  target,
  formatter,
}: {
  target: number;
  formatter?: (n: number) => string;
}) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1200, bounce: 0 });
  const display = useTransform(spring, (latest) =>
    formatter ? formatter(latest) : Math.round(latest).toLocaleString('en-PK'),
  );

  useEffect(() => {
    mv.set(target);
  }, [mv, target]);

  return <motion.span>{display}</motion.span>;
}

export function StatCard({
  title,
  value,
  delta,
  prefix,
  suffix,
  sparkline,
  sparklineColor = '#3B82F6',
  animateCount = true,
  formatter,
}: StatCardProps) {
  const numeric = typeof value === 'number' ? value : null;
  const deltaPositive = delta !== undefined && delta >= 0;
  const flat = delta === 0;

  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
    >
      <div className="stat-card-top">
        <span className="stat-card-label">{title}</span>
        {delta !== undefined && (
          <span
            className={`stat-delta ${
              flat ? 'flat' : deltaPositive ? 'up' : 'down'
            }`}
          >
            {deltaPositive ? '+' : ''}
            {delta.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="stat-card-value">
        {prefix}
        {numeric !== null && animateCount ? (
          <CountUp target={numeric} formatter={formatter} />
        ) : (
          value
        )}
        {suffix}
      </div>
      {sparkline && sparkline.length > 1 && (
        <SparklineChart data={sparkline} color={sparklineColor} height={52} />
      )}
    </motion.div>
  );
}
