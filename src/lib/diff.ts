export interface LineDiffResult {
  leftLines: string[];
  rightLines: string[];
  leftChanged: Set<number>;
  rightChanged: Set<number>;
  changedCount: number;
}

export function buildLineDiff(leftText: string, rightText: string): LineDiffResult {
  const leftLines = leftText.split('\n');
  const rightLines = rightText.split('\n');
  const leftChanged = new Set<number>();
  const rightChanged = new Set<number>();

  const max = Math.max(leftLines.length, rightLines.length);

  for (let index = 0; index < max; index += 1) {
    const left = leftLines[index] ?? '';
    const right = rightLines[index] ?? '';

    if (left !== right) {
      if (index < leftLines.length) {
        leftChanged.add(index);
      }
      if (index < rightLines.length) {
        rightChanged.add(index);
      }
    }
  }

  return {
    leftLines,
    rightLines,
    leftChanged,
    rightChanged,
    changedCount: Math.max(leftChanged.size, rightChanged.size),
  };
}
