// M1 Coast FI — shared input controls (used by both variants)

// ─── Stepper row (age, growth %) ──────────────────────────────
function Stepper({ label, value, onChange, min, max, step = 1, suffix }) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(1)));
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(1)));
  const btn = {
    width: 36, height: 36, borderRadius: 9999,
    background: M1.surface,
    border: `1px solid ${M1.dividerStrong}`,
    color: M1.text, fontSize: 20, fontWeight: 400,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0, lineHeight: 1, fontFamily: M1.font,
  };
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 4px',
      borderBottom: `1px solid ${M1.divider}`,
    }}>
      <span style={{ color: M1.text, fontSize: 15, fontWeight: 400 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={dec} style={btn}>−</button>
        <span style={{
          color: M1.text, fontSize: 17, fontWeight: 600,
          minWidth: 62, textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}>{value}{suffix || ''}</span>
        <button onClick={inc} style={btn}>+</button>
      </div>
    </div>
  );
}

// ─── Currency input ───────────────────────────────────────────
function CurrencyInput({ label, value, onChange, subtext, connected }) {
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    onChange(raw === '' ? 0 : parseInt(raw, 10));
  };

  return (
    <div style={{ padding: '14px 4px 16px', borderBottom: `1px solid ${M1.divider}` }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 8,
      }}>
        <span style={{ color: M1.text, fontSize: 15 }}>{label}</span>
        {connected && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 500, color: M1.teal,
            background: M1.tealDim, borderRadius: 9999,
            padding: '3px 9px',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 9999, background: M1.teal,
            }}/>
            From your M1 account
          </span>
        )}
      </div>
      <div
        onClick={() => ref.current?.focus()}
        style={{
          display: 'flex', alignItems: 'center',
          background: M1.surface,
          border: `1px solid ${focused ? M1.teal : M1.dividerStrong}`,
          borderRadius: M1.r.md,
          padding: '12px 14px',
          transition: 'border-color .15s',
          cursor: 'text',
        }}>
        <span style={{
          color: focused || value > 0 ? M1.text : M1.textDim,
          fontSize: 22, fontWeight: 600, marginRight: 2,
        }}>$</span>
        <input
          ref={ref}
          value={value > 0 ? value.toLocaleString('en-US') : ''}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="0"
          inputMode="numeric"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: M1.text, fontSize: 22, fontWeight: 600,
            fontFamily: M1.font, fontVariantNumeric: 'tabular-nums',
            padding: 0,
          }}
        />
      </div>
      {subtext && (
        <div style={{
          color: M1.textMuted, fontSize: 12, marginTop: 8, paddingLeft: 2,
        }}>{subtext}</div>
      )}
    </div>
  );
}

// ─── Assumptions disclosure (expandable) ──────────────────────
function Assumptions({ growth, setGrowth, withdrawal }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{
      background: M1.cardSoft,
      borderRadius: M1.r.md,
      border: `1px solid ${M1.divider}`,
      marginTop: 4,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '14px 16px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: M1.font,
        }}>
        <span style={{ color: M1.text, fontSize: 14, fontWeight: 500 }}>
          Assumptions
        </span>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: M1.textMuted, fontSize: 13,
        }}>
          {growth}% return · 4% rule
          <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
            {Icon.chevronDown(14, M1.textMuted)}
          </span>
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 12px' }}>
          <Stepper label="Expected annual return" value={growth}
            onChange={setGrowth} min={3} max={12} step={0.5} suffix="%" />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '14px 4px 8px', color: M1.textMuted, fontSize: 13,
          }}>
            <span>Safe withdrawal rate</span>
            <span style={{ color: M1.text, fontWeight: 500 }}>{withdrawal}% (25× rule)</span>
          </div>
          <div style={{
            color: M1.textFaint, fontSize: 11, lineHeight: 1.5, paddingTop: 4,
          }}>
            Projections use historical S&P 500 average returns. Past performance doesn't guarantee future results.
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Stepper, CurrencyInput, Assumptions });
