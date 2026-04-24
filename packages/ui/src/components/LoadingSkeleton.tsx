import type { CSSProperties } from 'react';

export interface LoadingSkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  style?: CSSProperties;
}

export function LoadingSkeleton({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}: LoadingSkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          'linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)',
        backgroundSize: '200% 100%',
        animation: 'ep-shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes ep-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
