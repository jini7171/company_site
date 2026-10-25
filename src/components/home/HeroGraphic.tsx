import type { CSSProperties } from "react";

/**
 * Abstract City System Graphic
 * Infrastructure → Data → AI → Service 4개 Layer를 등각(Isometric) 평면으로 쌓아 표현합니다.
 * 세 개의 수직 연결선은 모든 Layer의 같은 좌표를 관통해 "하나의 도시 시스템"임을 보여줍니다.
 */

export type HeroLayer = "infra" | "data" | "ai" | "service";

const CX = 250;

/** 남색 Hero 배경 기준 색상 */
const NIGHT = "#0B1220";
const NIGHT_800 = "#111A2E";
const BLUE = "#4F84EC";
const LAYERS: { key: HeroLayer; ty: number; index: string; label: string }[] = [
  { key: "service", ty: 30, index: "04", label: "SERVICE" },
  { key: "ai", ty: 165, index: "03", label: "AI" },
  { key: "data", ty: 300, index: "02", label: "DATA" },
  { key: "infra", ty: 435, index: "01", label: "INFRASTRUCTURE" },
];

/** 모든 Layer를 관통하는 공통 Anchor 좌표 (평면 Local 좌표) */
const ANCHORS = [
  [60, 60],
  [180, 90],
  [90, 180],
] as const;

const iso = (ty: number) => `matrix(0.866 0.5 -0.866 0.5 ${CX} ${ty})`;
const toScreen = (x: number, y: number, ty: number) => [CX + 0.866 * (x - y), ty + 0.5 * (x + y)] as const;

const ROADS_V = [48, 104, 168, 212];
const ROADS_H = [36, 92, 150, 204];
const BLOCKS = [
  [6, 6, 36, 24],
  [54, 44, 42, 42],
  [112, 6, 50, 24],
  [176, 100, 30, 44],
  [6, 160, 36, 36],
  [116, 158, 44, 38],
  [54, 100, 42, 44],
  [176, 158, 30, 40],
  [218, 44, 18, 42],
  [112, 44, 50, 42],
  [218, 212, 18, 24],
  [54, 212, 42, 24],
];

const AI_NODES = [
  [60, 60],
  [130, 36],
  [212, 40],
  [140, 130],
  [180, 90],
  [212, 172],
  [40, 132],
  [90, 180],
  [160, 212],
] as const;

const AI_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [0, 3],
  [3, 4],
  [4, 2],
  [4, 5],
  [3, 7],
  [7, 6],
  [6, 0],
  [7, 8],
  [8, 5],
  [3, 5],
];

const SENSORS = [
  [60, 60],
  [180, 90],
  [90, 180],
  [140, 30],
  [210, 210],
  [30, 130],
];

type HeroGraphicProps = {
  active: HeroLayer[];
};

export function HeroGraphic({ active }: HeroGraphicProps) {
  const isActive = (key: HeroLayer) => active.includes(key);
  const layerTone = (key: HeroLayer) =>
    `transition-[color,opacity] duration-700 ${isActive(key) ? "text-brand-400 opacity-100" : "text-white opacity-40"}`;

  return (
    <svg
      viewBox="0 0 640 700"
      role="img"
      aria-label="도시 인프라에서 데이터, AI, 서비스로 이어지는 ESE의 도시 시스템을 표현한 추상 그래픽"
      className="h-auto w-full overflow-visible"
    >
      {/* Layer 평면 */}
      {LAYERS.map((layer, i) => (
        <g key={layer.key} className={layerTone(layer.key)}>
          <g transform={iso(layer.ty)}>
            <rect
              x="0"
              y="0"
              width="240"
              height="240"
              fill={layer.key === "infra" ? NIGHT_800 : NIGHT}
              fillOpacity={layer.key === "infra" ? 1 : 0.72}
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="0.9"
              strokeDasharray={layer.key === "service" ? "3 4" : undefined}
              vectorEffect="non-scaling-stroke"
            />
            {layer.key === "infra" && <InfraLayer />}
            {layer.key === "data" && <DataLayer />}
            {layer.key === "ai" && <AiLayer />}
            {layer.key === "service" && <ServiceLayer />}
          </g>

          {/* Layer Label */}
          <line
            x1={CX + 207.8 + 6}
            y1={layer.ty + 120}
            x2={CX + 260}
            y2={layer.ty + 120}
            stroke="currentColor"
            strokeOpacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={CX + 268}
            y={layer.ty + 116}
            className="fill-current font-en"
            fontSize="10"
            letterSpacing="1.5"
            opacity="0.7"
          >
            {layer.index}
          </text>
          <text
            x={CX + 268}
            y={layer.ty + 131}
            className="fill-current font-en"
            fontSize="12.5"
            fontWeight="600"
            letterSpacing="1.6"
            style={{ animationDelay: `${0.4 + i * 0.12}s` }}
          >
            {layer.label}
          </text>
        </g>
      ))}

      {/* Layer 관통 수직 연결선 + 상승하는 Data Pulse */}
      {ANCHORS.map(([x, y], i) => {
        const [sx, bottom] = toScreen(x, y, 435);
        const [, top] = toScreen(x, y, 30);
        return (
          <g key={i}>
            <line
              x1={sx}
              y1={bottom}
              x2={sx}
              y2={top}
              stroke={BLUE}
              strokeOpacity="0.5"
              strokeDasharray="2 4"
            />
            <line
              x1={sx}
              y1={bottom}
              x2={sx}
              y2={top}
              stroke="#0EA5C6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="10 110"
              className="motion-safe:animate-flow"
              style={{ animationDelay: `${i * -2}s` }}
            />
            {LAYERS.map((layer) => {
              const [px, py] = toScreen(x, y, layer.ty);
              return <circle key={layer.key} cx={px} cy={py} r="2.6" fill={BLUE} />;
            })}
          </g>
        );
      })}

      {/* Figure Caption */}
      <text x="0" y="694" className="fill-white/40 font-en" fontSize="10" letterSpacing="1.6">
        FIG. 01 — ABSTRACT CITY SYSTEM
      </text>
    </svg>
  );
}

function InfraLayer() {
  return (
    <g stroke="currentColor" vectorEffect="non-scaling-stroke">
      {BLOCKS.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="currentColor" fillOpacity="0.06" strokeOpacity="0.3" strokeWidth="0.6" />
      ))}
      {ROADS_V.map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="240" strokeOpacity={x === 104 ? 0.7 : 0.35} strokeWidth={x === 104 ? 1.6 : 0.7} />
      ))}
      {ROADS_H.map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="240" y2={y} strokeOpacity={y === 150 ? 0.7 : 0.35} strokeWidth={y === 150 ? 1.6 : 0.7} />
      ))}
      <line x1="0" y1="240" x2="104" y2="150" strokeOpacity="0.5" strokeWidth="1" />
    </g>
  );
}

function DataLayer() {
  const dots = [];
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      dots.push(<circle key={`${i}-${j}`} cx={10 + i * 20} cy={10 + j * 20} r="1.3" fill="currentColor" fillOpacity="0.35" />);
    }
  }
  return (
    <g>
      {dots}
      {SENSORS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="none" stroke="#0EA5C6" strokeOpacity="0.6" strokeWidth="0.8" />
          <circle
            cx={x}
            cy={y}
            r="3.4"
            fill="#0EA5C6"
            className="motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 0.5}s`, transformBox: "fill-box", transformOrigin: "center" }}
          />
        </g>
      ))}
    </g>
  );
}

function AiLayer() {
  return (
    <g className="hero-ai-layer">
      {AI_EDGES.map(([a, b], i) => {
        const [x1, y1] = AI_NODES[a];
        const [x2, y2] = AI_NODES[b];
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            pathLength={1}
            stroke="currentColor"
            strokeOpacity="0.75"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="motion-safe:animate-draw"
            style={{ "--dash": 1, strokeDasharray: 1, animationDelay: `${0.5 + i * 0.12}s` } as CSSProperties}
          />
        );
      })}
      {AI_NODES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 3 ? 7 : 4.5}
          fill={NIGHT}
          stroke="currentColor"
          strokeWidth={i === 3 ? 2 : 1.4}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <circle cx="140" cy="130" r="2.6" fill="currentColor" />
    </g>
  );
}

function ServiceLayer() {
  return (
    <g fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
      {ANCHORS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="12" strokeOpacity="0.8" strokeWidth="1.2" />
          <circle cx={x} cy={y} r="24" strokeOpacity="0.35" strokeWidth="0.8" />
        </g>
      ))}
      <path d="M60 60 L180 90 L90 180 Z" strokeOpacity="0.4" strokeDasharray="4 4" />
    </g>
  );
}
