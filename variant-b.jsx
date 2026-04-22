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

      <div
        onWheel={(e) => e.stopPropagation()}
        style={{
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

        {/* AI Advisor primary CTA + self-direct disclosure */}
        <AICta
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

// ─── AI Advisor icon ──────────────────────────────────────────
const AIAdvisorIcon = (s = 24) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="url(#aiGrad)" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4" fill="url(#aiGrad)" opacity="0.9"/>
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M16.9 16.9l1.4 1.4M5.6 18.4l1.4-1.4M16.9 7.1l1.4-1.4"
      stroke="url(#aiGrad)" strokeWidth="1.3" strokeLinecap="round"/>
    <defs>
      <linearGradient id="aiGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A78BFA"/>
        <stop offset="100%" stopColor="#6DCFF6"/>
      </linearGradient>
    </defs>
  </svg>
);

// ─── AI Advisor CTA (primary) + Pie self-direct (collapsed) ───
// Primary: M1 AI Advisor card, copy adapts to Coast FI state.
// Secondary: "Prefer to self-direct?" disclosure expands inline
//   to show the Pie card, keeping it available but out of the way.
function AICta({ pastCoast, farBehind, years, progress }) {
  const [pieOpen, setPieOpen] = React.useState(false);

  let aiHeadline, aiBody;
  if (pastCoast) {
    aiHeadline = "You've hit Coast FI. Now let's optimize it.";
    aiBody = 'Your money is working — M1 AI Advisor can help you map out Roth conversions, tax strategy, and your path to Fat FI.';
  } else if (farBehind) {
    aiHeadline = 'Start with a plan that fits where you are.';
    aiBody = "You don't need to close the gap all at once. M1 AI Advisor will build a step-by-step plan around your life, not just your number.";
  } else {
    const pct = Math.round(progress * 100);
    aiHeadline = `You're ${pct}% there. Let's close the gap.`;
    aiBody = 'M1 AI Advisor can turn your Coast FI number into a concrete action plan — contributions, timeline, and the right accounts.';
  }

  // Pie card content (same adaptive logic as before)
  let pieHeadline, pieBody, returnLabel, microCopy;
  if (pastCoast) {
    pieHeadline = 'Optimize for tax-advantaged growth';
    pieBody = 'Explore a Roth IRA conversion Pie designed for the coasting phase — or a Fat FI acceleration Pie.';
    returnLabel = '6.8%';
    microCopy = null;
  } else if (farBehind) {
    pieHeadline = 'Start small. Start today.';
    pieBody = "You're building the habit, not closing the gap overnight. Even $50 a month compounded for decades is meaningful.";
    returnLabel = '7.2%';
    microCopy = 'Auto-invest as little as $50/mo';
  } else {
    pieHeadline = `A ${years}-year Coast FI Pie`;
    pieBody = `Long-horizon and diversified. Built to match your ${years}-year timeline with 80/20 equity/bond weighting.`;
    returnLabel = '7.2%';
    microCopy = null;
  }

  return (
    <div style={{ marginTop: 32 }}>
      <SectionLabel>Your next step</SectionLabel>

      {/* ── AI Advisor card (primary) ── */}
      <Card style={{
        background: `linear-gradient(140deg, #130d2a 0%, #0e1a30 60%, rgba(109,207,246,0.06) 100%)`,
        border: '1px solid rgba(167,139,250,0.22)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle shimmer layer */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: M1.r.lg,
          background: 'radial-gradient(ellipse at 80% 0%, rgba(167,139,250,0.10) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}/>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
          <div style={{
            width: 48, height: 48, borderRadius: M1.r.md, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(167,139,250,0.22) 0%, rgba(109,207,246,0.14) 100%)',
            border: '1px solid rgba(167,139,250,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{AIAdvisorIcon(26)}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
              color: '#A78BFA', marginBottom: 7,
              background: 'rgba(167,139,250,0.12)',
              padding: '3px 8px', borderRadius: 9999,
            }}>
              {Icon.sparkle(10, '#A78BFA')} M1 AI ADVISOR
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              {aiHeadline}
            </div>
            <div style={{ fontSize: 13, color: M1.textMuted, marginTop: 7, lineHeight: 1.55, textWrap: 'pretty' }}>
              {aiBody}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, position: 'relative' }}>
          <PrimaryPill style={{
            background: 'linear-gradient(90deg, #7C3AED 0%, #2563EB 100%)',
            color: '#fff',
          }}>
            {AIAdvisorIcon(18)} Chat with M1 AI Advisor
          </PrimaryPill>
        </div>
      </Card>

      {/* ── Self-direct disclosure (secondary) ── */}
      <div style={{ marginTop: 4 }}>
        <button
          onClick={() => setPieOpen(o => !o)}
          style={{
            width: '100%', padding: '13px 4px',
            background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', fontFamily: M1.font,
          }}>
          <span style={{ fontSize: 13, color: M1.textDim, fontWeight: 400 }}>
            Prefer to self-direct?
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: M1.textDim, fontSize: 13 }}>
            Choose a Pie
            <span style={{ transform: pieOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', display: 'flex' }}>
              {Icon.chevronDown(14, M1.textDim)}
            </span>
          </span>
        </button>

        {pieOpen && (
          <Card style={{
            background: `linear-gradient(140deg, ${M1.card} 0%, rgba(109,207,246,0.06) 100%)`,
            border: `1px solid ${M1.divider}`,
            marginBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: M1.r.md, flexShrink: 0,
                background: M1.tealDim,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{Icon.pieIcon(22, M1.teal)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                  {pieHeadline}
                </div>
                <div style={{ fontSize: 12, color: M1.textMuted, marginTop: 5, lineHeight: 1.5, textWrap: 'pretty' }}>
                  {pieBody}
                </div>
                {microCopy && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    marginTop: 8, fontSize: 11, fontWeight: 500,
                    color: M1.teal, background: M1.tealDim,
                    padding: '3px 9px', borderRadius: 9999,
                  }}>{microCopy}</div>
                )}
              </div>
            </div>
            <div style={{
              marginTop: 14, paddingTop: 14, borderTop: `1px solid ${M1.divider}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: 13, color: M1.textMuted }}>
                Est. return <span style={{ color: M1.green, fontWeight: 600 }}>{returnLabel}/yr</span>
              </div>
              <SecondaryPill style={{ height: 36, fontSize: 13 }}>
                Explore Pie {Icon.chevronRight(13, M1.teal)}
              </SecondaryPill>
            </div>
          </Card>
        )}
      </div>

      <button style={{
        width: '100%', marginTop: 6, padding: 12,
        background: 'transparent', border: 'none',
        color: M1.teal, fontSize: 13, fontWeight: 500,
        fontFamily: M1.font, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        {Icon.share(15)} Share your Coast FI number
      </button>
    </div>
  );
}

Object.assign(window, { VariantB });
