import { readTxtFile } from "../utils/utils.ts";

const directions: [number, number][] = [
  [0, 1], // Left to Right
  [0, -1], // Right to Left
  [1, 0], // Top to Bottom
  [-1, 0], // Bottom to Top
  [1, 1], // Top-Left to Bottom-Right
  [-1, -1], // Bottom-Right to Top-Left
  [1, -1], // Top-Right to Bottom-Left
  [-1, 1], // Bottom-Left to Top-Right
];

function countWordOccurrences(grid: string[][], word: string): number {
  const wordLength = word.length;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < rows && y >= 0 && y < cols;
  }

  function search(x: number, y: number, dx: number, dy: number): boolean {
    for (let i = 0; i < wordLength; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;
      if (!isInBounds(nx, ny) || grid[nx][ny] !== word[i]) {
        return false;
      }
    }
    return true;
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (grid[x][y] === word[0]) {
        for (const [dx, dy] of directions) {
          if (search(x, y, dx, dy)) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

function countXMAS(grid: string[][]): number {
  let count = 0;

  grid.forEach((row, i, a) => {
    row.forEach((char, j) => {
      if (char === "A" && isXMAS(a, i, j)) {
        count++;
      }
    });
  });

  function isXMAS(a: string[][], i: number, j: number): boolean {
    const LTR = [a[i - 1]?.[j - 1], a[i + 1]?.[j + 1]].sort().join("") === "MS";
    const RTL = [a[i - 1]?.[j + 1], a[i + 1]?.[j - 1]].sort().join("") === "MS";
    return LTR && RTL;
  }

  return count;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const filename = Deno.args[0] || "input.txt";

  readTxtFile(filename)
    .then((input) => {
      console.log(`Input:\n${input}`);

      // Part 1

      const word = Deno.args[1] || "XMAS";
      const grid = input.split("\n").map((line) => line.split(""));

      const totalOccurrences = countWordOccurrences(grid, word);
      console.log(`Part 1 Result:\n${totalOccurrences}`);

      // Part 2
      const totalXMAS = countXMAS(grid);
      console.log(`Part 2 Result:\n${totalXMAS}`);
    })
    .catch((err) => {
      console.error(err);
    });
}
