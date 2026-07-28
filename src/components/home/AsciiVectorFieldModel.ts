export const ASCII_KAOMOJI = ["(˶>⩊<˶)", "(˶ˆᗜˆ˵)", "(˶˃𐃷˂˶)"] as const;

export const ASCII_STREAM_SNIPPETS = [
  ' git commit -m "ship it" && git push ',
  " try { build(); } catch { learn(); } ",
  " const coffee = await brew(); ",
  " if (tests.pass) deploy(); ",
  " // TODO: ask future_me ",
  " 404: sleep_not_found "
] as const;

export interface AsciiFieldSample {
  x: number;
  y: number;
  glyph: string;
  alpha: number;
  tone: "blue" | "green" | "warm" | "neutral";
  layer: "flow" | "stream";
  kind: "syntax" | "kaomoji" | "trace";
  tokenStart?: boolean;
}

interface SampleAsciiFieldCellOptions {
  column: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
  time: number;
  compact?: boolean;
}

interface StreamTapeCell {
  glyph: string;
  kind: "syntax" | "kaomoji";
  tokenStart?: boolean;
  tokenOffset?: number;
  tokenLength?: number;
}

interface Lane {
  id: number;
  ordinal: number;
  primary: boolean;
}

const TAU = Math.PI * 2;
function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function smoothstep(minimum: number, maximum: number, value: number) {
  const progress = clamp((value - minimum) / (maximum - minimum), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function cellHash(column: number, row: number) {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function appendTapeText(
  cells: StreamTapeCell[],
  text: string,
  kind: StreamTapeCell["kind"]
) {
  const glyphs = Array.from(text);
  glyphs.forEach((glyph, index) => {
    cells.push({
      glyph,
      kind,
      tokenStart: kind === "kaomoji" && index === 0 ? true : undefined,
      tokenOffset: kind === "kaomoji" ? index : undefined,
      tokenLength: kind === "kaomoji" ? glyphs.length : undefined
    });
  });
}

function buildTape(variant: number, face?: (typeof ASCII_KAOMOJI)[number]) {
  const cells: StreamTapeCell[] = [];

  for (let offset = 0; offset < 4; offset += 1) {
    appendTapeText(
      cells,
      ASCII_STREAM_SNIPPETS[(variant + offset) % ASCII_STREAM_SNIPPETS.length],
      "syntax"
    );
    appendTapeText(cells, "   ", "syntax");

    if (face && offset === 1) {
      appendTapeText(cells, face, "kaomoji");
      appendTapeText(cells, "    ", "syntax");
    }
  }

  return cells;
}

const syntaxTapes = ASCII_STREAM_SNIPPETS.map((_, index) => buildTape(index));
const kaomojiTapes = ASCII_KAOMOJI.map((face, index) => buildTape(index, face));

function sampleFlow(normalizedX: number, normalizedY: number, time: number) {
  const phase = normalizedX * TAU;
  const firstPath =
    0.2 +
    Math.sin(phase * 1.16 - time * 0.34) * 0.065 +
    Math.sin(phase * 3.7 + time * 0.13) * 0.018;
  const secondPath =
    0.48 +
    Math.sin(phase * 0.92 - time * 0.27 + 1.7) * 0.09 +
    Math.cos(phase * 3.1 + time * 0.16) * 0.022;
  const thirdPath =
    0.76 +
    Math.sin(phase * 1.08 - time * 0.31 + 3.2) * 0.072 +
    Math.sin(phase * 4.3 - time * 0.11) * 0.016;
  const distances = [
    Math.abs(normalizedY - firstPath),
    Math.abs(normalizedY - secondPath),
    Math.abs(normalizedY - thirdPath)
  ];
  const nearestDistance = Math.min(...distances);
  const nearestIndex = distances.indexOf(nearestDistance);
  const width = 0.011 + Math.sin(phase * 2.4 + time * 0.17) * 0.002;
  const distanceRatio = nearestDistance / width;
  const intensity = Math.exp(-(distanceRatio * distanceRatio));
  const slope =
    Math.cos(phase * (1.16 - nearestIndex * 0.1) - time * 0.31) *
    (0.35 + nearestIndex * 0.08);

  return { intensity, slope };
}

function getLane(row: number, compact: boolean): Lane | null {
  const step = compact ? 6 : 3;
  const primaryOffset = 1;
  const secondaryOffset = compact ? 4 : 2;
  const offset = modulo(row, step);

  if (offset === primaryOffset) {
    return {
      id: Math.floor(row / step) * 2,
      ordinal: Math.floor(row / step),
      primary: true
    };
  }

  if (offset === secondaryOffset) {
    return {
      id: Math.floor(row / step) * 2 + 1,
      ordinal: Math.floor(row / step),
      primary: false
    };
  }

  return null;
}

function getTape(lane: Lane, compact: boolean) {
  const carriesFace =
    lane.primary &&
    (compact ? lane.ordinal === 1 : lane.ordinal === 1 || lane.ordinal === 4);

  if (carriesFace) {
    return kaomojiTapes[(lane.ordinal * 2) % kaomojiTapes.length];
  }

  return syntaxTapes[lane.id % syntaxTapes.length];
}

function getStreamAlpha(
  normalizedX: number,
  width: number,
  time: number,
  lane: Lane,
  compact: boolean
) {
  const emphasis =
    0.08 + smoothstep(compact ? 0.28 : 0.4, compact ? 0.82 : 0.88, normalizedX) * 0.92;
  const copySafeFade = compact
    ? 0.28 + smoothstep(0.36, 0.9, normalizedX) * 0.72
    : 0.18 + smoothstep(0.62, 0.9, normalizedX) * 0.82;
  const pulse =
    0.84 + Math.sin(time * 0.22 + lane.id * 1.7 + normalizedX * TAU * 1.4) * 0.16;
  const baseAlpha = lane.primary ? 0.72 : 0.54;
  const copyEnd = Math.min(width, (compact ? 92 : 140) + 576);
  const recoveryStart = copyEnd / width;
  const recoveryEnd = Math.min(1, recoveryStart + 64 / width);
  const fullStrengthRecovery =
    compact || recoveryStart >= 1
      ? 0
      : smoothstep(recoveryStart, recoveryEnd, normalizedX);
  const alphaCap = compact ? 0.36 : 0.42 + fullStrengthRecovery * 0.34;

  return Math.min(baseAlpha * (0.24 + emphasis * 0.76) * copySafeFade * pulse, alphaCap);
}

function getStreamTone(
  cell: StreamTapeCell,
  column: number,
  row: number,
  lane: Lane
): AsciiFieldSample["tone"] {
  if (cell.kind === "kaomoji") {
    return "warm";
  }

  const hash = cellHash(column + lane.id * 3, row);
  if (/[{}[\]<>]/u.test(cell.glyph) || hash > 0.88) {
    return "green";
  }
  if (/[A-Za-z0-9]/u.test(cell.glyph) || hash > 0.42) {
    return "blue";
  }

  return "neutral";
}

export function sampleAsciiFieldCell(
  options: SampleAsciiFieldCellOptions
): AsciiFieldSample | null {
  const { column, row, x, y, width, height, time, compact = false } = options;

  if (width <= 0 || height <= 0) {
    return null;
  }

  const normalizedX = x / width;
  const normalizedY = y / height;
  const lane = getLane(row, compact);
  const laneActive =
    lane !== null && (lane.primary || normalizedX > (compact ? 0.48 : 0.42));

  if (lane && laneActive) {
    const tape = getTape(lane, compact);
    const cellWidth = x / (column + 0.5);
    const speed = (compact ? 0.3 : 0.42) + (lane.id % 4) * 0.055;
    const travel = time * speed;
    const wholeCellTravel = Math.floor(travel);
    const fractionalTravel = travel - wholeCellTravel;
    const tapeIndex = modulo(column + wholeCellTravel + lane.id * 19, tape.length);
    const cell = tape[tapeIndex];

    if (
      cell.kind === "kaomoji" &&
      cell.tokenOffset !== undefined &&
      cell.tokenLength !== undefined
    ) {
      const tokenStartX = x - fractionalTravel * cellWidth - cell.tokenOffset * cellWidth;
      const tokenEndX = tokenStartX + (cell.tokenLength - 1) * cellWidth;
      const glyphHalfWidth = cellWidth / 2;

      if (tokenStartX - glyphHalfWidth < 0 || tokenEndX + glyphHalfWidth > width) {
        return null;
      }
    }

    if (cell.glyph.trim()) {
      return {
        x: x - fractionalTravel * cellWidth,
        y,
        glyph: cell.glyph,
        alpha: getStreamAlpha(normalizedX, width, time, lane, compact),
        tone: getStreamTone(cell, column, row, lane),
        layer: "stream",
        kind: cell.kind,
        tokenStart: cell.tokenStart
      };
    }
  }

  const hash = cellHash(column, row);
  const flow = sampleFlow(normalizedX, normalizedY, time);
  if (flow.intensity <= 0.28 + hash * 0.58) {
    return null;
  }

  const emphasis =
    0.06 + smoothstep(compact ? 0.24 : 0.38, compact ? 0.78 : 0.82, normalizedX) * 0.94;

  return {
    x,
    y,
    glyph: Math.abs(flow.slope) < 0.08 ? "-" : flow.slope > 0 ? "/" : "\\",
    alpha: clamp((0.13 + flow.intensity * 0.28) * (0.24 + emphasis * 0.76), 0, 0.42),
    tone: hash > 0.54 ? "blue" : "neutral",
    layer: "flow",
    kind: "trace"
  };
}
