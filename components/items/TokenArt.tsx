import { useId } from "react";

type TokenArtProps = {
  side: "front" | "edge";
  digit: string;
  isDigitFound: boolean;
};

const TICK_ANGLES = Array.from({ length: 16 }, (_, index) => index * 22.5);

/** Starý mosadzný žetón nultého kilometra, nakreslený v SVG. */
export function TokenArt({ side, digit, isDigitFound }: TokenArtProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const faceGradientId = `token-face-${id}`;
  const edgeGradientId = `token-edge-${id}`;

  return (
    <svg
      viewBox="0 0 240 240"
      className="h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={faceGradientId} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#f8e3a1" />
          <stop offset="0.45" stopColor="#d1a14a" />
          <stop offset="1" stopColor="#6f4b16" />
        </radialGradient>

        <linearGradient id={edgeGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d28a" />
          <stop offset="0.5" stopColor="#b9853a" />
          <stop offset="1" stopColor="#5e4113" />
        </linearGradient>
      </defs>

      {side === "front" ? (
        <g>
          <circle cx="120" cy="124" r="104" fill="#2a1c07" opacity="0.6" />
          <circle
            cx="120"
            cy="120"
            r="100"
            fill={`url(#${faceGradientId})`}
            stroke="#5c3f12"
            strokeWidth="3"
          />
          <circle
            cx="120"
            cy="120"
            r="86"
            fill="none"
            stroke="#8a6224"
            strokeWidth="2"
            strokeDasharray="2 4"
          />

          {TICK_ANGLES.map((angle) => (
            <line
              key={angle}
              x1="120"
              y1="36"
              x2="120"
              y2={angle % 90 === 0 ? "50" : "44"}
              stroke="#5c3f12"
              strokeWidth={angle % 90 === 0 ? 3 : 1.5}
              transform={`rotate(${angle} 120 120)`}
            />
          ))}

          {/* Veterná ružica */}
          <polygon
            points="120,58 130,110 182,120 130,130 120,182 110,130 58,120 110,110"
            fill="#7a5418"
            opacity="0.85"
          />
          <polygon
            points="120,84 126,114 156,120 126,126 120,156 114,126 84,120 114,114"
            fill="#f2d48c"
            opacity="0.9"
            transform="rotate(45 120 120)"
          />
          <circle cx="120" cy="120" r="6" fill="#4a320c" />

          <text
            x="120"
            y="78"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="11"
            letterSpacing="3"
            fill="#4a320c"
          >
            BRATISLAVA
          </text>
          <text
            x="120"
            y="172"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="14"
            fontWeight="700"
            letterSpacing="2"
            fill="#4a320c"
          >
            0 KM
          </text>
        </g>
      ) : (
        <g>
          <rect
            x="16"
            y="100"
            width="208"
            height="48"
            rx="10"
            fill="#2a1c07"
            opacity="0.6"
          />
          <rect
            x="16"
            y="96"
            width="208"
            height="48"
            rx="10"
            fill={`url(#${edgeGradientId})`}
            stroke="#4a320c"
            strokeWidth="3"
          />

          {/* Ryhovanie hrany, okrem hladkého miesta s číslicou */}
          {Array.from({ length: 24 }, (_, index) => 26 + index * 8)
            .filter((x) => x < 96 || x > 144)
            .map((x) => (
              <line
                key={x}
                x1={x}
                y1="101"
                x2={x}
                y2="139"
                stroke="#6e4c18"
                strokeWidth="2"
                opacity="0.55"
              />
            ))}

          {/* Vyrytá číslica */}
          <text
            x="121"
            y="132"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="30"
            fontWeight="700"
            fill="#f6dc9c"
            opacity="0.5"
          >
            {digit}
          </text>
          <text
            x="120"
            y="131"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="30"
            fontWeight="700"
            fill={isDigitFound ? "#fff1c1" : "#5a3d10"}
          >
            {digit}
          </text>
        </g>
      )}
    </svg>
  );
}
