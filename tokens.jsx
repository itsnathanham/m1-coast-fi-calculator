// M1 Design Tokens — extracted from provided app screenshots
// (dark theme, navy-forward, teal accent, muted-blue primary action)

const M1 = {
  // surfaces
  bgTop: '#0B1830',      // header gradient top
  bgBottom: '#070D1A',   // deep page
  page: '#080E1C',
  card: '#111A2E',
  cardSoft: '#0F1828',
  surface: '#182238',
  surfaceHi: '#1E2A42',
  divider: 'rgba(255,255,255,0.08)',
  dividerStrong: 'rgba(255,255,255,0.12)',

  // text
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.62)',
  textDim: 'rgba(255,255,255,0.42)',
  textFaint: 'rgba(255,255,255,0.28)',

  // brand + action
  teal: '#6DCFF6',          // links / active tab / accent
  tealDim: 'rgba(109,207,246,0.18)',
  primary: '#9FC9DA',       // "Add to Pie" pill
  primaryHi: '#B6D5E2',
  primaryText: '#0A1524',   // dark text on primary pill

  // semantic
  green: '#4ADE80',
  greenDim: 'rgba(74,222,128,0.14)',
  amber: '#F5B544',
  red: '#F87171',

  // type
  font: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif',

  // radius
  r: {
    pill: 9999,
    lg: 20,
    md: 14,
    sm: 10,
    xs: 6,
  },
};

// Number formatters
const fmtUSD = (n, opts = {}) => {
  const { cents = false, compact = false } = opts;
  if (compact) {
    const abs = Math.abs(n);
    if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  }
  return n.toLocaleString('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
};

const fmtPct = (n, d = 0) => `${n.toFixed(d)}%`;

// Coast FI math
// coast_fi = target / (1 + r)^years_to_retirement
// target   = annual_income * 25 (4% rule)
function coastFiMath({ currentAge, retireAge, annualIncome, growthPct, invested }) {
  const years = Math.max(0, retireAge - currentAge);
  const target = annualIncome * 25;
  const r = growthPct / 100;
  const coastFi = target / Math.pow(1 + r, years);
  const gap = Math.max(0, coastFi - invested);
  const progress = Math.min(1, invested / coastFi);
  // At what age (if ever) does the user hit Coast FI if they simply grow at r
  // NEVER contributing another dollar? They never do — coast FI is today's
  // number. But we can show: if they keep investing $X/mo, when do they hit it?
  // For projection chart: show both "coasting" (no new contributions) and
  // "target" curves.
  return { years, target, coastFi, gap, progress };
}

Object.assign(window, { M1, fmtUSD, fmtPct, coastFiMath });
