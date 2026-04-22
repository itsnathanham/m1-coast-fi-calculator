// Variant B — "Projection" (updated)
// Hero number + projection chart  →  compact milestone band  →  inputs
// CTA: soft Pie-first (from A). When user is far behind, swap to
// small-steps framing: tiny achievable amount, gentle copy.

function VariantB() {
  const [age, setAge] = React.useState(34);
  const [retireAge, setRetireAge] = React.useState(60);
  const [income, setIncome] = React.useState(150000);
  const [invested, setInvested] = React.useState(410000);
  const [growth, setGrowth] = React.useState(7);

  const { years, target, coastFi, gap, progress } = coastFiMath({
    currentAge: age, retireAge, annualIncome: income,
    growthPct: growth, invested,
  });

  const pastCoast = invested >= coastFi;
  // "far behind" = under 1/4 of Coast FI. We lead with small, encouraging
  // steps rather than the number-to-close-the-gap, which can feel defeating.
  const farBehind = !pastCoast && progress < 0.25;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: M1.page,
      color: M1.text, fontFamily: M1.font,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <ModalHeader title="Coast FI Calculator" onClose={() => {}} />

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '0 18px 120px',
      }}>
        <HeroProjection
          coastFi={coastFi}
          invested={invested}
          target={target}
          years={years}
          growth={growth}
          pastCoast={pastCoast}
          retireAge={retireAge}
          age={age}
        />

        {/* Compact milestone band — between chart and inputs */}
        <MilestoneBand
          invested={invested}
          coastFi={coastFi}
          progress={progress}
          pastCoast={pastCoast}
        />

        <div style={{ marginTop: 24 }}>
          <SectionLabel>Inputs</SectionLabel>
          <Card padding={0} style={{ padding: '4px 16px' }}>
            <Stepper label="Current age" value={age} onChange={setAge} min={18} max={75} />
            <Stepper label="Retirement age" value={retireAge} onChange={setRetireAge} min={Math.max(age + 1, 40)} max={85} />
            <CurrencyInput
              label="Annual retirement income"
              value={income}
              onChange={setIncome}
              subtext={`Target at 4% rule: ${fmtUSD(income * 25, { compact: true })}`}
            />
            <CurrencyInput
              label="Currently invested"
              value={invested}
              onChange={setInvested}
              connected
            />
          </Card>
          <Assumptions growth={growth} setGrowth={setGrowth} withdrawal={4} />
        </div>

        {/* Pie-first CTA (from A) with adaptive framing */}
        <PieCTA
          pastCoast={pastCoast}
          farBehind={farBehind}
          years={years}
          progress={progress}
        />
      </div>

      <TabBar active="invest" />
    </div>
  );
}

// ─── Hero: big number + projection chart ──────────────────────
function HeroProjection({ coastFi, invested, target, years, growth, pastCoast, retireAge, age }) {
  return (
    <div style={{ padding: '12px 0 4px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4,
      }}>
        <span style={{ fontSize: 13, color: M1.textMuted, fontWeight: 500 }}>
          YOUR COAST FI NUMBER
        </span>
        {Icon.info(13)}
      </div>
      <div style={{
        fontSize: 46, fontWeight: 700, letterSpacing: '-0.035em',
        lineHeight: 1.05, fontVariantNumeric: 'tabular-nums',
      }}>
        {fmtUSD(coastFi, { cents: false })}
      </div>
      {pastCoast ? (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: M1.green, fontSize: 14, fontWeight: 500, marginTop: 10,
          background: M1.greenDim, padding: '5px 11px', borderRadius: 9999,
        }}>
          {Icon.sparkle(14, M1.green)} You've passed Coast FI
        </div>
      ) : (
        <div style={{
          color: M1.textMuted, fontSize: 14, marginTop: 8, lineHeight: 1.5, textWrap: 'pretty',
        }}>
          Invest this today, never add another dollar, and compound growth gets you to{' '}
          <span style={{ color: M1.text, fontWeight: 500 }}>{fmtUSD(target, {compact:true})}</span>{' '}
          by age {retireAge}.
        </div>
      )}

      <ProjectionChart
        invested={invested}
        coastFi={coastFi}
        target={target}
        years={years}
        growth={growth}
        pastCoast={pastCoast}
        age={age}
        retireAge={retireAge}
      />
    </div>
  );
}

// ─── Projection chart ─────────────────────────────────────────
function ProjectionChart({ invested, coastFi, target, years, growth, pastCoast, age, retireAge }) {
  const W = 340, H = 180, padL = 0, padR = 0, padT = 24, padB = 32;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  const steps = 48;
  const pts = [];
  const r = growth / 100;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * years;
    pts.push({ t, v: invested * Math.pow(1 + r, t) });
  }
  const maxV = Math.max(target * 1.05, pts[pts.length - 1].v * 1.05);
  const x = (t) => padL + (t / years) * innerW;
  const y = (v) => padT + innerH - (v / maxV) * innerH;

  const linePath = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${x(years).toFixed(1)},${(padT+innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT+innerH).toFixed(1)} Z`;

  const targetY = y(target);
  const hitT = Math.log(target / invested) / Math.log(1 + r);
  const crossesTarget = hitT >= 0 && hitT <= years;

  return (
    <div style={{ marginTop: 20, width: '100%', overflow: 'hidden' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={M1.teal} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={M1.teal} stopOpacity="0"/>
          </linearGradient>
        </defs>

        <line x1={padL} x2={padL + innerW} y1={targetY} y2={targetY}
          stroke={M1.dividerStrong} strokeWidth="1" strokeDasharray="3 3"/>
        <text x={padL + innerW - 4} y={targetY - 6}
          fontSize="10" fill={M1.textMuted} textAnchor="end" fontFamily={M1.font}>
          {fmtUSD(target, {compact:true})} target
        </text>

        <path d={areaPath} fill="url(#areaGrad)"/>
        <path d={linePath} stroke={pastCoast ? M1.green : M1.teal} strokeWidth="2.5" fill="none" strokeLinecap="round"/>

        <circle cx={x(0)} cy={y(invested)} r="5"
          fill={M1.page} stroke={pastCoast ? M1.green : M1.teal} strokeWidth="2"/>
        <circle cx={x(years)} cy={y(pts[pts.length-1].v)} r="5"
          fill={pastCoast ? M1.green : M1.teal}/>

        <text x={x(0)} y={padT + innerH + 16}
          fontSize="10" fill={M1.textMuted} textAnchor="start" fontFamily={M1.font}>
          Today · {fmtUSD(invested, {compact:true})}
        </text>
        <text x={x(years) - 4} y={padT + innerH + 16}
          fontSize="10" fill={M1.textMuted} textAnchor="end" fontFamily={M1.font}>
          Age {retireAge} · {fmtUSD(pts[pts.length-1].v, {compact:true})}
        </text>

        {crossesTarget && (
          <g>
            <circle cx={x(hitT)} cy={y(target)} r="4" fill={M1.amber}/>
          </g>
        )}
      </svg>
    </div>
  );
}

// ─── Compact milestone band ───────────────────────────────────
// Single segmented bar with ticks at 1/4, 1/2, 3/4, Coast FI.
// "You are here" marker floats above the bar with dollar label.
// Deliberately NO gap number — reframes via nearest milestone.
function MilestoneBand({ invested, coastFi, progress, pastCoast }) {
  const ticks = [
    { at: 0.25, label: '25%' },
    { at: 0.5,  label: '50%' },
    { at: 0.75, label: '75%' },
    { at: 1,    label: 'Coast FI' },
  ];
  const clamped = Math.min(1, progress);
  // Find next unhit milestone for the encouraging label
  const next = ticks.find(t => progress < t.at);

  return (
    <div style={{ marginTop: 22 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        padding: '0 2px 12px',
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: M1.textMuted, letterSpacing: '0.02em' }}>
          MILESTONES
        </span>
        <span style={{ fontSize: 12, color: pastCoast ? M1.green : M1.teal, fontWeight: 500 }}>
          {pastCoast
            ? 'All cleared'
            : next
              ? `Next: ${next.label === 'Coast FI' ? 'Coast FI' : next.label}`
              : ''}
        </span>
      </div>

      {/* Bar with "you are here" dot */}
      <div style={{ position: 'relative', padding: '22px 0 6px' }}>
        {/* You-are-here pill floating above */}
        <div style={{
          position: 'absolute', left: `${clamped * 100}%`, top: -2,
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: M1.text,
            background: M1.surfaceHi,
            border: `1px solid ${pastCoast ? M1.green : M1.teal}`,
            borderRadius: 9999, padding: '3px 9px',
            whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
          }}>
            {fmtUSD(invested, { compact: true })}
          </div>
          <div style={{
            width: 2, height: 8,
            background: pastCoast ? M1.green : M1.teal,
            marginTop: 2,
          }}/>
        </div>

        {/* Track */}
        <div style={{
          position: 'relative', height: 10, borderRadius: 9999,
          background: M1.surface,
          border: `1px solid ${M1.divider}`,
          overflow: 'hidden',
        }}>
          {/* Fill */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${clamped * 100}%`,
            background: pastCoast
              ? `linear-gradient(90deg, ${M1.green} 0%, #22C55E 100%)`
              : `linear-gradient(90deg, ${M1.teal} 0%, #5FB8E0 100%)`,
            borderRadius: 9999,
            transition: 'width .5s cubic-bezier(.2,.7,.2,1)',
          }}/>
          {/* Ticks on track */}
          {ticks.map(t => (
            <div key={t.at} style={{
              position: 'absolute', left: `${t.at * 100}%`, top: 0, bottom: 0,
              width: 2, marginLeft: -1,
              background: progress >= t.at
                ? 'rgba(255,255,255,0.55)'
                : 'rgba(255,255,255,0.22)',
            }}/>
          ))}
        </div>

        {/* Tick labels */}
        <div style={{ position: 'relative', height: 18, marginTop: 8 }}>
          {ticks.map(t => (
            <div key={t.at} style={{
              position: 'absolute',
              left: `${t.at * 100}%`,
              transform: t.at === 1 ? 'translateX(-100%)' : (t.at === 0 ? 'none' : 'translateX(-50%)'),
              fontSize: 11,
              fontWeight: progress >= t.at ? 600 : 400,
              color: progress >= t.at ? M1.text : M1.textDim,
              whiteSpace: 'nowrap',
            }}>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Pie-first CTA (adaptive) ─────────────────────────────────
// • pastCoast → celebratory, "optimize" framing
// • farBehind → small-steps, gentle encouragement ("start with $50/mo")
// • default  → recommended Coast FI Pie for their timeline
function PieCTA({ pastCoast, farBehind, years, progress }) {
  let headline, body, pieLabel, returnLabel, microCopy;

  if (pastCoast) {
    headline = 'Optimize for tax-advantaged growth';
    body = 'Explore a Roth IRA conversion Pie designed for the coasting phase — or a Fat FI acceleration Pie.';
    pieLabel = 'Coasting Pies';
    returnLabel = '6.8%';
    microCopy = null;
  } else if (farBehind) {
    headline = 'Start small. Start today.';
    body = "You're building the habit, not closing the gap overnight. Even $50 a month compounded for decades is meaningful.";
    pieLabel = `Starter Retirement Pie`;
    returnLabel = '7.2%';
    microCopy = 'Auto-invest as little as $50/mo';
  } else {
    headline = `A ${years}-year Coast FI Pie`;
    body = `Long-horizon and diversified. Built to match your ${years}-year timeline with 80/20 equity/bond weighting.`;
    pieLabel = `Coast FI · ${years}yr`;
    returnLabel = '7.2%';
    microCopy = null;
  }

  return (
    <div style={{ marginTop: 32 }}>
      <SectionLabel>Suggested for you</SectionLabel>
      <Card style={{
        background: `linear-gradient(140deg, ${M1.card} 0%, rgba(109,207,246,0.08) 100%)`,
        border: `1px solid ${M1.tealDim}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: M1.r.md,
            background: M1.tealDim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{Icon.pieIcon(26, M1.teal)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
              {headline}
            </div>
            <div style={{ fontSize: 13, color: M1.textMuted, marginTop: 6, lineHeight: 1.5, textWrap: 'pretty' }}>
              {body}
            </div>
            {microCopy && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                marginTop: 10, fontSize: 12, fontWeight: 500,
                color: M1.teal, background: M1.tealDim,
                padding: '4px 10px', borderRadius: 9999,
              }}>
                {microCopy}
              </div>
            )}
          </div>
        </div>

        <div style={{
          marginTop: 18, paddingTop: 18, borderTop: `1px solid ${M1.divider}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: M1.textMuted, letterSpacing: '0.02em' }}>
              EXPECTED RETURN
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2, color: M1.green }}>
              {returnLabel}<span style={{ color: M1.textMuted, fontSize: 13, fontWeight: 400 }}> / yr</span>
            </div>
          </div>
          <SecondaryPill>
            Explore Pie {Icon.chevronRight(14, M1.teal)}
          </SecondaryPill>
        </div>
      </Card>

      <button style={{
        width: '100%', marginTop: 14, padding: 14,
        background: 'transparent', border: 'none',
        color: M1.teal, fontSize: 14, fontWeight: 500,
        fontFamily: M1.font, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        {Icon.share(16)} Share your Coast FI number
      </button>
    </div>
  );
}

Object.assign(window, { VariantB });
