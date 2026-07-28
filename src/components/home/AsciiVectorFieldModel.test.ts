import { describe, expect, it } from "vitest";
import {
  ASCII_KAOMOJI,
  ASCII_STREAM_SNIPPETS,
  sampleAsciiFieldCell,
  type AsciiFieldSample
} from "./AsciiVectorFieldModel";

interface FrameOptions {
  width?: number;
  height?: number;
  compact?: boolean;
  cellWidth?: number;
  cellHeight?: number;
}

function sampleFrame(time: number, options: FrameOptions = {}) {
  const width = options.width ?? 900;
  const height = options.height ?? 300;
  const compact = options.compact ?? false;
  const cellWidth = options.cellWidth ?? 12;
  const cellHeight = options.cellHeight ?? 15;
  const samples: AsciiFieldSample[] = [];

  for (let row = 0; row < Math.max(1, Math.floor(height / cellHeight)); row += 1) {
    for (
      let column = 0;
      column < Math.max(1, Math.ceil(width / cellWidth) + 1);
      column += 1
    ) {
      const sample = sampleAsciiFieldCell({
        column,
        row,
        x: column * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2,
        width,
        height,
        time,
        compact
      });

      if (sample && sample.x >= 0 && sample.x <= width) {
        samples.push(sample);
      }
    }
  }

  return samples;
}

function streamRows(samples: AsciiFieldSample[], cellHeight: number) {
  return new Set(
    samples
      .filter((sample) => sample.layer === "stream")
      .map((sample) => Math.round(sample.y / cellHeight))
  );
}

function visibleKaomojiRuns(samples: AsciiFieldSample[], cellWidth: number) {
  const groups = new Map<number, AsciiFieldSample[]>();

  for (const sample of samples.filter((candidate) => candidate.kind === "kaomoji")) {
    const row = Math.round(sample.y);
    groups.set(row, [...(groups.get(row) ?? []), sample]);
  }

  const runs: string[] = [];
  for (const rowSamples of groups.values()) {
    const ordered = rowSamples.toSorted((first, second) => first.x - second.x);
    let run = "";
    let previousX: number | undefined;

    for (const sample of ordered) {
      if (previousX !== undefined && sample.x - previousX > cellWidth * 1.2) {
        runs.push(run);
        run = "";
      }

      run += sample.glyph;
      previousX = sample.x;
    }

    if (run) {
      runs.push(run);
    }
  }

  return runs;
}

function visibleStreamLines(samples: AsciiFieldSample[], cellWidth: number) {
  const groups = new Map<number, AsciiFieldSample[]>();

  for (const sample of samples.filter((candidate) => candidate.layer === "stream")) {
    const row = Math.round(sample.y);
    groups.set(row, [...(groups.get(row) ?? []), sample]);
  }

  return [...groups.values()].map((rowSamples) => {
    const ordered = rowSamples.toSorted((first, second) => first.x - second.x);
    let line = "";
    let previousX: number | undefined;

    for (const sample of ordered) {
      if (previousX !== undefined) {
        line += " ".repeat(
          Math.max(0, Math.round((sample.x - previousX) / cellWidth) - 1)
        );
      }

      line += sample.glyph;
      previousX = sample.x;
    }

    return line;
  });
}

describe("AsciiVectorFieldModel", () => {
  it("renders structured syntax lanes with stronger presence on the right", () => {
    const samples = sampleFrame(0);
    const leftPresence = samples
      .filter((sample) => sample.x < 300)
      .reduce((total, sample) => total + sample.alpha, 0);
    const rightPresence = samples
      .filter((sample) => sample.x > 600)
      .reduce((total, sample) => total + sample.alpha, 0);
    const syntax = samples.filter(
      (sample) => sample.layer === "stream" && sample.kind === "syntax"
    );

    expect(streamRows(samples, 15).size).toBeGreaterThanOrEqual(6);
    expect(rightPresence).toBeGreaterThan(leftPresence * 3);
    expect(syntax.length).toBeGreaterThan(70);
    expect(syntax.some((sample) => /[A-Za-z0-9{}()[\]=>:#/\\]/u.test(sample.glyph))).toBe(
      true
    );
  });

  it("moves lane content horizontally over time without changing its row system", () => {
    const firstFrame = sampleFrame(0);
    const laterFrame = sampleFrame(4);
    const signature = (samples: AsciiFieldSample[]) =>
      samples
        .filter((sample) => sample.layer === "stream")
        .map((sample) => `${sample.x.toFixed(2)}:${sample.y.toFixed(2)}:${sample.glyph}`);

    expect(signature(laterFrame)).not.toEqual(signature(firstFrame));
    expect(streamRows(laterFrame, 15)).toEqual(streamRows(firstFrame, 15));
  });

  it("keeps kaomoji complete and sparse across animation phases", () => {
    let observedFace = false;

    for (let time = 0; time <= 120; time += 2) {
      const samples = sampleFrame(time);
      const starts = samples.filter(
        (sample) => sample.kind === "kaomoji" && sample.tokenStart
      );
      const faceCells = samples.filter((sample) => sample.kind === "kaomoji");
      const runs = visibleKaomojiRuns(samples, 12);

      expect(starts.length).toBeLessThanOrEqual(2);
      expect(runs.length).toBeLessThanOrEqual(2);
      expect(faceCells.every((sample) => sample.x >= 6 && sample.x <= 894)).toBe(true);
      expect(
        runs.every((run) => ASCII_KAOMOJI.includes(run as (typeof ASCII_KAOMOJI)[number]))
      ).toBe(true);
      observedFace ||= runs.some((run) =>
        ASCII_KAOMOJI.includes(run as (typeof ASCII_KAOMOJI)[number])
      );
    }

    expect(observedFace).toBe(true);
  });

  it("uses only the approved expressive kaomoji", () => {
    expect(ASCII_KAOMOJI).toEqual(["(˶>⩊<˶)", "(˶ˆᗜˆ˵)", "(˶˃𐃷˂˶)"]);
  });

  it("streams recognizable developer snippets instead of random token noise", () => {
    let observedSnippet = false;

    for (let time = 0; time <= 60; time += 4) {
      const lines = visibleStreamLines(sampleFrame(time), 12);
      observedSnippet ||= lines.some((line) =>
        ASCII_STREAM_SNIPPETS.some((snippet) => line.includes(snippet.trim()))
      );
    }

    expect(observedSnippet).toBe(true);
  });

  it("simplifies lane density and kaomoji use on compact screens", () => {
    const dimensions = {
      width: 360,
      height: 300,
      cellWidth: 15,
      cellHeight: 18
    };
    const desktop = sampleFrame(0, dimensions);
    const compact = sampleFrame(0, { ...dimensions, compact: true });

    expect(streamRows(compact, 18).size).toBeGreaterThanOrEqual(3);
    expect(streamRows(compact, 18).size).toBeLessThan(streamRows(desktop, 18).size);
    expect(compact.filter((sample) => sample.layer === "stream").length).toBeLessThan(
      desktop.filter((sample) => sample.layer === "stream").length
    );

    for (let time = 0; time <= 120; time += 0.25) {
      const runs = visibleKaomojiRuns(
        sampleFrame(time, { ...dimensions, compact: true }),
        dimensions.cellWidth
      );
      const faceCells = sampleFrame(time, {
        ...dimensions,
        compact: true
      }).filter((sample) => sample.kind === "kaomoji");

      expect(runs.length).toBeLessThanOrEqual(1);
      expect(
        faceCells.every(
          (sample) =>
            sample.x >= dimensions.cellWidth / 2 &&
            sample.x <= dimensions.width - dimensions.cellWidth / 2
        ),
        `clipped compact kaomoji at t=${time}`
      ).toBe(true);
      expect(
        runs.every((run) =>
          ASCII_KAOMOJI.includes(run as (typeof ASCII_KAOMOJI)[number])
        ),
        `partial compact kaomoji at t=${time}: ${runs.join(", ")}`
      ).toBe(true);
    }
  });

  it("limits stream opacity across representative copy widths", () => {
    const wideOverlap = sampleFrame(0, { width: 896 }).filter(
      (sample) => sample.layer === "stream" && sample.x <= 716
    );
    const boundaryOverlap = sampleFrame(0, { width: 800 }).filter(
      (sample) => sample.layer === "stream" && sample.x <= 716
    );
    const mediumOverlap = sampleFrame(0, { width: 700 }).filter(
      (sample) => sample.layer === "stream"
    );

    expect(Math.max(...wideOverlap.map((sample) => sample.alpha))).toBeLessThanOrEqual(
      0.42
    );
    expect(
      Math.max(...boundaryOverlap.map((sample) => sample.alpha))
    ).toBeLessThanOrEqual(0.42);
    expect(Math.max(...mediumOverlap.map((sample) => sample.alpha))).toBeLessThanOrEqual(
      0.42
    );
  });

  it("returns the same composition for the same dimensions and time", () => {
    expect(sampleFrame(2.5)).toEqual(sampleFrame(2.5));
  });
});
