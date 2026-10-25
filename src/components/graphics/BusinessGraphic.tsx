import type { BusinessGraphicKind } from "@/content/types";

/**
 * 사업 분야별 추상 Line Graphic (viewBox 400×300)
 * 실제 이미지 Asset으로 교체할 경우 이 컴포넌트 대신 next/image를 사용하세요.
 */
export function BusinessGraphic({ kind, className = "" }: { kind: BusinessGraphicKind; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" className={className} fill="none" preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {kind === "urban" && <Urban />}
        {kind === "safety" && <Safety />}
        {kind === "global" && <Global />}
        {kind === "geospatial" && <Geospatial />}
        {kind === "road" && <Road />}
      </g>
    </svg>
  );
}

const ACCENT = "#185ADB";
const CYAN = "#0EA5C6";

function Urban() {
  const cols = [0, 44, 120, 176, 248, 300, 352, 400];
  const rows = [0, 52, 104, 168, 220, 300];
  const nodes = [
    [44, 168],
    [120, 104],
    [248, 52],
    [352, 104],
    [300, 168],
    [176, 220],
  ];
  return (
    <>
      {cols.map((x) => (
        <line key={`c${x}`} x1={x} y1="0" x2={x} y2="300" strokeOpacity="0.18" />
      ))}
      {rows.map((y) => (
        <line key={`r${y}`} x1="0" y1={y} x2="400" y2={y} strokeOpacity="0.18" />
      ))}
      {[
        [52, 60, 60, 36],
        [128, 8, 40, 88],
        [184, 112, 56, 48],
        [256, 176, 36, 36],
        [308, 60, 36, 36],
        [8, 176, 28, 36],
        [128, 228, 40, 64],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="currentColor" fillOpacity="0.05" strokeOpacity="0.35" />
      ))}
      <rect x="176" y="104" width="124" height="116" stroke={ACCENT} strokeDasharray="4 4" />
      {/* 도시 거점을 잇는 순환 Network + 중심 연결 */}
      <polygon points="44,168 120,104 248,52 352,104 300,168 176,220" stroke={ACCENT} strokeOpacity="0.8" strokeWidth="1.2" />
      <line x1="120" y1="104" x2="300" y2="168" stroke={ACCENT} strokeOpacity="0.45" strokeDasharray="3 4" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" stroke={ACCENT} strokeOpacity="0.3" />
          <circle cx={x} cy={y} r="3.5" fill="white" stroke={ACCENT} strokeWidth="1.5" />
        </g>
      ))}
      <text x="184" y="98" fill={ACCENT} stroke="none" fontSize="9" letterSpacing="1.2" className="font-en">
        DISTRICT 04
      </text>
    </>
  );
}

function Safety() {
  return (
    <>
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="300" strokeOpacity="0.1" />
      ))}
      {[40, 80, 120, 160].map((r) => (
        <circle key={r} cx="200" cy="150" r={r} strokeOpacity={0.4 - r / 600} />
      ))}
      <line x1="200" y1="150" x2="340" y2="80" stroke={ACCENT} strokeWidth="1.4" />
      <path d="M200 150 L340 80 A156 156 0 0 1 356 150 Z" fill={ACCENT} fillOpacity="0.07" stroke="none" />
      <line x1="40" y1="150" x2="360" y2="150" strokeOpacity="0.3" strokeDasharray="2 4" />
      <line x1="200" y1="0" x2="200" y2="300" strokeOpacity="0.3" strokeDasharray="2 4" />
      {[
        [290, 104],
        [128, 210],
        [250, 236],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 6} y={y - 6} width="12" height="12" stroke={i === 0 ? CYAN : ACCENT} strokeWidth="1.5" transform={`rotate(45 ${x} ${y})`} />
          <circle cx={x} cy={y} r="2" fill={i === 0 ? CYAN : ACCENT} stroke="none" />
        </g>
      ))}
      <circle cx="200" cy="150" r="4" fill={ACCENT} stroke="none" />
    </>
  );
}

function Global() {
  const points = [
    [70, 120],
    [178, 92],
    [262, 168],
    [334, 110],
  ];
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`lat${i}`} x1="0" y1={30 + i * 40} x2="400" y2={30 + i * 40} strokeOpacity="0.14" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`lon${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" strokeOpacity="0.14" />
      ))}
      {/* Dot 패턴으로 표현한 추상 대륙 조각 */}
      {Array.from({ length: 18 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => {
          const x = 40 + i * 18;
          const y = 70 + j * 18;
          const inside = Math.sin(i * 0.7) + Math.cos(j * 0.9 + i * 0.25) > 0.2;
          return inside ? <circle key={`${i}-${j}`} cx={x} cy={y} r="1.6" fill="currentColor" fillOpacity="0.3" stroke="none" /> : null;
        }),
      )}
      {points.slice(1).map(([x, y], i) => {
        const [sx, sy] = points[0];
        const mx = (sx + x) / 2;
        const my = Math.min(sy, y) - 50 - i * 12;
        return <path key={i} d={`M${sx} ${sy} Q${mx} ${my} ${x} ${y}`} stroke={ACCENT} strokeWidth="1.3" strokeDasharray={i === 2 ? "4 4" : undefined} />;
      })}
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 0 ? 10 : 7} stroke={i === 0 ? ACCENT : CYAN} strokeOpacity="0.5" />
          <circle cx={x} cy={y} r="3" fill={i === 0 ? ACCENT : CYAN} stroke="none" />
        </g>
      ))}
    </>
  );
}

function Geospatial() {
  const contours = [
    "M90 160 C 100 90, 220 60, 290 110 S 330 230, 230 240 S 80 230, 90 160 Z",
    "M120 160 C 128 108, 214 88, 266 122 S 292 212, 226 218 S 112 206, 120 160 Z",
    "M150 160 C 156 126, 210 114, 242 136 S 256 194, 220 196 S 144 190, 150 160 Z",
    "M178 160 C 182 142, 208 136, 222 148 S 226 178, 210 178 S 174 176, 178 160 Z",
  ];
  return (
    <>
      {Array.from({ length: 21 }, (_, i) => (
        <line key={i} x1={i * 20} y1="290" x2={i * 20} y2={i % 5 === 0 ? 278 : 284} strokeOpacity="0.4" />
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <line key={`y${i}`} x1="10" y1={i * 20} x2={i % 5 === 0 ? 22 : 16} y2={i * 20} strokeOpacity="0.4" />
      ))}
      {contours.map((d, i) => (
        <path key={i} d={d} strokeOpacity={0.25 + i * 0.15} stroke={i === 3 ? ACCENT : "currentColor"} />
      ))}
      <line x1="200" y1="20" x2="200" y2="270" stroke={ACCENT} strokeOpacity="0.5" strokeDasharray="3 5" />
      <line x1="30" y1="160" x2="390" y2="160" stroke={ACCENT} strokeOpacity="0.5" strokeDasharray="3 5" />
      <circle cx="200" cy="160" r="5" stroke={ACCENT} strokeWidth="1.5" fill="white" />
      <text x="208" y="152" fill={ACCENT} stroke="none" fontSize="9" letterSpacing="1" className="font-en">
        X 200 / Y 160
      </text>
    </>
  );
}

function Road() {
  return (
    <>
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="300" strokeOpacity="0.08" />
      ))}
      <path d="M0 200 C 120 200, 160 120, 400 110" strokeOpacity="0.35" strokeWidth="14" />
      <path d="M0 200 C 120 200, 160 120, 400 110" stroke="white" strokeWidth="1" strokeDasharray="8 8" />
      <path d="M220 0 L220 300" strokeOpacity="0.35" strokeWidth="14" />
      <path d="M220 0 L220 300" stroke="white" strokeWidth="1" strokeDasharray="8 8" />
      <path d="M40 0 C 60 90, 140 120, 220 140" strokeOpacity="0.2" strokeWidth="6" />
      <path
        d="M0 200 C 120 200, 160 120, 400 110"
        stroke={CYAN}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="14 46"
        className="motion-safe:animate-flow"
      />
      <path
        d="M220 300 L220 0"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="14 46"
        className="motion-safe:animate-flow"
        style={{ animationDelay: "-3s" }}
      />
      <rect x="204" y="118" width="32" height="32" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="3 3" />
      {[
        [120, 182],
        [320, 112],
        [220, 60],
        [220, 250],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="white" stroke={ACCENT} strokeWidth="1.5" />
      ))}
    </>
  );
}
