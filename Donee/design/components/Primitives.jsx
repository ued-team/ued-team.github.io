// Shared UI primitives for KKday order detail (mobile)
// All styles inline or via the kk-* classes pulled in from ../../colors_and_type.css + ../../kit.css

// Icon from KKday icon set — currentColor via CSS mask so we can tint
const KKIcon = ({ name, size = 20, color, style }) => (
  <span
    role="img"
    aria-label={name}
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      background: color || 'currentColor',
      WebkitMask: `url("assets/icons/${name}.svg") center/contain no-repeat`,
      mask: `url("assets/icons/${name}.svg") center/contain no-repeat`,
      flexShrink: 0,
      ...style,
    }}
  />
);

// Rounded pill / chip
const KKChip = ({ children, kind = 'neutral', size = 'sm', style }) => {
  const palettes = {
    brand:    { bg: 'var(--bg-brand-soft)', fg: 'var(--kk-color-cyan-10)' },
    success:  { bg: '#DCFAEB', fg: '#048C66' },
    warning:  { bg: '#FFF8E1', fg: '#E78F37' },
    critical: { bg: 'var(--kk-color-red-2)', fg: 'var(--kk-color-red-9)' },
    neutral:  { bg: 'var(--bg3)', fg: 'var(--fg2)' },
    dark:     { bg: 'rgba(33,33,33,.92)', fg: '#fff' },
  };
  const p = palettes[kind] || palettes.neutral;
  const pad = size === 'lg' ? '6px 12px' : size === 'md' ? '4px 10px' : '2px 8px';
  const fs  = size === 'lg' ? 13 : size === 'md' ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: p.bg, color: p.fg,
      padding: pad, borderRadius: 999,
      fontSize: fs, fontWeight: 500, lineHeight: 1.2,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  );
};

// Button — primary / secondary / ghost
const KKButton = ({ children, kind = 'primary', size = 'md', block, onClick, icon, style }) => {
  const kinds = {
    primary:   { bg: 'var(--bg-brand)', fg: '#fff', bd: 'transparent' },
    secondary: { bg: '#fff', fg: 'var(--kk-color-cyan-9)', bd: 'var(--kk-color-cyan-6)' },
    ghost:     { bg: 'transparent', fg: 'var(--fg1)', bd: 'var(--border1)' },
    dark:      { bg: 'var(--fg1)', fg: '#fff', bd: 'transparent' },
  };
  const k = kinds[kind];
  const pad = size === 'lg' ? '12px 20px' : size === 'sm' ? '6px 12px' : '10px 16px';
  const fs  = size === 'lg' ? 15 : size === 'sm' ? 13 : 14;
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      background: k.bg, color: k.fg, border: `1px solid ${k.bd}`,
      padding: pad, borderRadius: 8, fontSize: fs, fontWeight: 500,
      lineHeight: 1.2, cursor: 'pointer', width: block ? '100%' : 'auto',
      fontFamily: 'inherit',
      ...style,
    }}>
      {icon && <KKIcon name={icon} size={fs + 2} />}
      {children}
    </button>
  );
};

// Mobile app status bar (fake, for mWeb "in-app browser" illusion we use the iOS frame)
const MobileTopBar = ({ title, onBack, showDots = true }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 30,
    background: '#fff',
    borderBottom: '1px solid var(--border1)',
    padding: '10px 12px',
    display: 'flex', alignItems: 'center', gap: 8,
  }}>
    <button onClick={onBack} style={{
      background: 'transparent', border: 0, padding: 6,
      display: 'flex', alignItems: 'center', cursor: 'pointer',
      color: 'var(--fg1)',
    }}>
      <KKIcon name="arrowLeft_line" size={20} />
    </button>
    <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: 'var(--fg1)' }}>{title}</div>
    {showDots && <KKIcon name="dotsThree_line" size={22} style={{ opacity: .6 }} />}
  </div>
);

// Map illustration — stylized, since we have no real map. Cyan-tinted.
const MapThumb = ({ height = 140, pin = '集合點', interactive = true, onClick }) => (
  <div
    onClick={onClick}
    style={{
      position: 'relative',
      height,
      borderRadius: 12,
      overflow: 'hidden',
      cursor: interactive ? 'pointer' : 'default',
      background: '#E8F3F3',
      border: '1px solid var(--border1)',
    }}
  >
    {/* stylized map */}
    <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="mapgrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CEE8EB" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="400" height="180" fill="#E8F3F3"/>
      <rect width="400" height="180" fill="url(#mapgrid)"/>
      {/* roads */}
      <path d="M 0 90 Q 100 70 200 92 T 400 85" stroke="#fff" strokeWidth="10" fill="none"/>
      <path d="M 0 90 Q 100 70 200 92 T 400 85" stroke="#D5E6E6" strokeWidth="1" fill="none"/>
      <path d="M 180 0 L 200 180" stroke="#fff" strokeWidth="8" fill="none"/>
      <path d="M 180 0 L 200 180" stroke="#D5E6E6" strokeWidth="1" fill="none"/>
      <path d="M 50 180 Q 80 120 120 100 T 240 60" stroke="#fff" strokeWidth="5" fill="none" opacity=".7"/>
      {/* park blobs */}
      <ellipse cx="80" cy="50" rx="45" ry="22" fill="#D3EDCB" opacity=".8"/>
      <ellipse cx="320" cy="140" rx="55" ry="28" fill="#D3EDCB" opacity=".7"/>
      {/* building blocks */}
      <rect x="250" y="30" width="30" height="25" fill="#fff" opacity=".8" rx="2"/>
      <rect x="285" y="35" width="20" height="18" fill="#fff" opacity=".8" rx="2"/>
      <rect x="60" y="130" width="28" height="22" fill="#fff" opacity=".8" rx="2"/>
      <rect x="120" y="140" width="30" height="20" fill="#fff" opacity=".8" rx="2"/>
    </svg>
    {/* pin */}
    <div style={{
      position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    }}>
      <div style={{
        background: 'var(--bg-brand)', color: '#fff',
        padding: '4px 10px', borderRadius: 999,
        fontSize: 11, fontWeight: 700,
        boxShadow: '0 2px 8px rgba(0,0,0,.2)',
        whiteSpace: 'nowrap',
      }}>📍 {pin}</div>
      <svg width="14" height="10" viewBox="0 0 14 10">
        <path d="M 0 0 L 7 10 L 14 0 Z" fill="var(--bg-brand)" />
      </svg>
    </div>
    {/* attribution-ish */}
    <div style={{
      position: 'absolute', right: 6, bottom: 4,
      fontSize: 9, color: 'var(--fg3)',
    }}>Map preview</div>
    {interactive && (
      <div style={{
        position: 'absolute', right: 10, top: 10,
        background: '#fff', borderRadius: 8,
        padding: '6px 10px', fontSize: 11, fontWeight: 600,
        color: 'var(--kk-color-cyan-9)',
        boxShadow: '0 1px 4px rgba(0,0,0,.12)',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <KKIcon name="map_line" size={13} /> 開啟導航
      </div>
    )}
  </div>
);

// Countdown hook — tick every second
const useCountdown = (iso) => {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  // We fake a "now" that's T0-1 → show ~18h countdown by default
  const fakeNow = React.useMemo(() => {
    const target = new Date(iso).getTime();
    return target - (18 * 3600 + 23 * 60) * 1000; // ~18h 23m to go
  }, [iso]);
  const diff = Math.max(0, new Date(iso).getTime() - (fakeNow + (now - (window.__cdT0 ||= now))));
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, total: diff };
};

Object.assign(window, { KKIcon, KKChip, KKButton, MobileTopBar, MapThumb, useCountdown });
