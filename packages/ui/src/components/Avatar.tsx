import { colorFromName, initialsFromName } from '../utils/color';

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
}

export function Avatar({ name, src, size = 40 }: AvatarProps) {
  const bg = colorFromName(name);
  const initials = initialsFromName(name);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: src ? 'transparent' : bg,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size * 0.38,
        flexShrink: 0,
        overflow: 'hidden',
        lineHeight: 1,
        fontFamily: 'var(--font-heading)',
      }}
      aria-label={name}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        initials
      )}
    </div>
  );
}
