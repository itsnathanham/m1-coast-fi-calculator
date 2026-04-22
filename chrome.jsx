// M1 App Chrome — shared pieces that wrap every calculator variant.
// Keeps both variants anchored in the same native app shell so they feel
// like they live inside M1, not bolted on.

// ─── Icons ────────────────────────────────────────────────────
const Icon = {
  close: (s = 20, c = '#fff') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  chevronRight: (s = 16, c = M1.textMuted) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevronDown: (s = 16, c = M1.textMuted) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  info: (s = 14, c = M1.teal) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={c} strokeWidth="1.5"/>
      <path d="M12 11v6M12 7.5v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  sparkle: (s = 16, c = M1.teal) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z" fill={c}/>
    </svg>
  ),
  check: (s = 16, c = '#0A1524') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pieIcon: (s = 22, c = M1.teal) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.6"/>
      <path d="M12 3v9l7.8 4.5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  home: (s = 22, c = M1.textMuted) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9.5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  earn: (s = 22, c = M1.textMuted) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="6.5" width="17" height="12" rx="2" stroke={c} strokeWidth="1.6"/>
      <path d="M3.5 10.5h17" stroke={c} strokeWidth="1.6"/>
    </svg>
  ),
  invest: (s = 22, c = M1.textMuted) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth="1.6"/>
      <path d="M12 3.5v8.5l7.5 4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  borrow: (s = 22, c = M1.textMuted) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M3 16c2-4 5-4 8-2s6 2 8-2" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="17.5" cy="9.5" r="2.5" stroke={c} strokeWidth="1.6"/>
    </svg>
  ),
  share: (s = 18, c = M1.teal) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12M12 3l-4 4M12 3l4 4M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  reset: (s = 16, c = M1.teal) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// ─── Modal Header (X · Title · placeholder) ───────────────────
function ModalHeader({ title, onClose, rightText, onRight }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '56px 1fr 56px',
      alignItems: 'center', padding: '8px 16px 14px',
    }}>
      <button onClick={onClose} style={{
        width: 36, height: 36, borderRadius: 9999,
        background: 'rgba(255,255,255,0.06)',
        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
      }}>{Icon.close(18)}</button>
      <div style={{
        textAlign: 'center', color: M1.text, fontSize: 17,
        fontWeight: 600, letterSpacing: '-0.01em',
      }}>{title}</div>
      <div style={{ textAlign: 'right' }}>
        {rightText && (
          <button onClick={onRight} style={{
            background: 'none', border: 'none', color: M1.teal,
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
            fontFamily: M1.font, padding: '8px 4px',
          }}>{rightText}</button>
        )}
      </div>
    </div>
  );
}

// ─── Tab Bar (floating pill, like M1) ─────────────────────────
function TabBar({ active = 'invest' }) {
  const tabs = [
    { id: 'home',   label: 'Home',   icon: Icon.home },
    { id: 'earn',   label: 'Earn',   icon: Icon.earn },
    { id: 'invest', label: 'Invest', icon: Icon.invest },
    { id: 'borrow', label: 'Borrow', icon: Icon.borrow },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: 16, right: 16,
      height: 64, borderRadius: 9999,
      background: 'rgba(18,26,44,0.88)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      border: `1px solid ${M1.dividerStrong}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px', zIndex: 50,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <div key={t.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '6px 14px', borderRadius: 9999,
            background: isActive ? 'rgba(109,207,246,0.08)' : 'transparent',
          }}>
            {t.icon(22, isActive ? M1.teal : M1.textMuted)}
            <span style={{
              fontSize: 10, fontWeight: 500,
              color: isActive ? M1.teal : M1.textMuted,
              fontFamily: M1.font,
            }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Section label (all caps, muted) ──────────────────────────
function SectionLabel({ children, right }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 4px 10px', color: M1.textMuted,
    }}>
      <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.02em' }}>{children}</span>
      {right}
    </div>
  );
}

// ─── Primary pill button (M1's muted-blue CTA) ────────────────
function PrimaryPill({ children, onClick, style = {}, leftIcon }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', height: 56, borderRadius: 9999,
        border: 'none', cursor: 'pointer',
        background: hover ? M1.primaryHi : M1.primary,
        color: M1.primaryText, fontSize: 17, fontWeight: 600,
        fontFamily: M1.font, letterSpacing: '-0.01em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'background .15s',
        ...style,
      }}>
      {leftIcon}{children}
    </button>
  );
}

// ─── Secondary pill (outlined teal) ───────────────────────────
function SecondaryPill({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      height: 44, padding: '0 22px', borderRadius: 9999,
      background: 'transparent',
      border: `1.5px solid ${M1.teal}`,
      color: M1.teal, fontSize: 15, fontWeight: 500,
      fontFamily: M1.font, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      ...style,
    }}>{children}</button>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────
function Card({ children, style = {}, padding = 20 }) {
  return (
    <div style={{
      background: M1.card,
      borderRadius: M1.r.lg,
      padding,
      border: `1px solid ${M1.divider}`,
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, {
  Icon, ModalHeader, TabBar, SectionLabel,
  PrimaryPill, SecondaryPill, Card,
});
