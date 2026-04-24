import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { Card } from './Card';
import { SparklineChart } from './SparklineChart';
import { Badge } from './Badge';

export interface StatCardProps {
  title: string;
  value: number | string;
  delta?: number;
  prefix?: string;
  suffix?: string;
  sparkline?: number[];
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
  sparklineColor = 'var(--color-primary)',
  animateCount = true,
  formatter,
}: StatCardProps) {
  const numeric = typeof value === 'number' ? value : null;
  const deltaPositive = delta !== undefined && delta >= 0;

  return (
    <Card padding="md" interactive>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
            }}
          >
            {title}
          </div>
          {delta !== undefined && (
            <Badge variant={deltaPositive ? 'success' : 'danger'}>
              {deltaPositive ? '+' : ''}
              {delta.toFixed(1)}%
            </Badge>
          )}
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.1,
            color: 'var(--color-text-primary)',
          }}
        >
          {prefix}
          {numeric !== null && animateCount ? (
            <CountUp target={numeric} formatter={formatter} />
          ) : (
            value
          )}
          {suffix}
        </div>

        {sparkline && sparkline.length > 1 && (
          <SparklineChart data={sparkline} color={sparklineColor} height={40} />
        )}
      </div>
    </Card>
  );
}
