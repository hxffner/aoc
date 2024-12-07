import { readTxtFile } from "../utils/utils.ts";

type Direction = "^" | ">" | "v" | "<";
type Position = { x: number; y: number };

function findDirection(
  matrix: string[][],
  direction: Direction
): Position | null {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === direction) {
        return { x, y };
      }
    }
  }
  return null;
}

function move(position: Position, direction: Direction): Position {
  switch (direction) {
    case "^":
      return { x: position.x, y: position.y - 1 };
    case ">":
      return { x: position.x + 1, y: position.y };
    case "v":
      return { x: position.x, y: position.y + 1 };
    case "<":
      return { x: position.x - 1, y: position.y };
  }
}

function turnRight(direction: Direction): Direction {
  switch (direction) {
    case "^":
      return ">";
    case ">":
      return "v";
    case "v":
      return "<";
    case "<":
      return "^";
  }
}

function isOnMatrix(matrix: string[][], position: Position): boolean {
  return (
    position.y >= 0 &&
    position.y < matrix.length &&
    position.x >= 0 &&
    position.x < matrix[position.y].length
  );
}

function isObstacle(matrix: string[][], position: Position): boolean {
  return isOnMatrix(matrix, position) && matrix[position.y][position.x] === "#";
}

function simulateGuard(
  matrix: string[][],
  start: Position,
  direction: Direction
): boolean {
  const visited = new Set<string>();
  let position = { ...start };
  let currentDirection = direction;

  while (isOnMatrix(matrix, position)) {
    const key = `${position.x},${position.y},${currentDirection}`;
    if (visited.has(key)) {
      return true; // Loop detected
    }
    visited.add(key);

    const nextPosition = move(position, currentDirection);
    if (
      isOnMatrix(matrix, nextPosition) &&
      matrix[nextPosition.y][nextPosition.x] === "#"
    ) {
      currentDirection = turnRight(currentDirection);
    } else if (isOnMatrix(matrix, nextPosition)) {
      position = nextPosition;
    } else {
      break;
    }
  }
  return false;
}

function findObstructionLoopPositions(matrix: string[][]): number {
  const loopPositions = new Set<string>();

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === ".") {
        const testMatrix = matrix.map((row) => [...row]);
        testMatrix[y][x] = "#";

        const start = findDirection(testMatrix, "^");
        if (!start) continue;

        if (simulateGuard(testMatrix, start, "^")) {
          loopPositions.add(`${x},${y}`);
        }
      }
    }
  }

  return loopPositions.size;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const filename = Deno.args[0] || "input.txt";

  readTxtFile(filename)
    .then((input) => {
      // console.log(`Input:\n${input}`);

      const matrix = input.split("\n").map((line) => line.split(""));
      let direction: Direction = "^";
      const position = findDirection(matrix, direction);

      if (!position) {
        console.error("Initial guard position not found!");
        return;
      }

      // Part 1
      const visited = new Set<string>();
      visited.add(`${position.x},${position.y}`);
      matrix[position.y][position.x] = "X";

      while (isOnMatrix(matrix, position)) {
        const nextPosition = move(position, direction);

        if (isObstacle(matrix, nextPosition)) {
          direction = turnRight(direction);
        } else if (isOnMatrix(matrix, nextPosition)) {
          position.x = nextPosition.x;
          position.y = nextPosition.y;
          visited.add(`${position.x},${position.y}`);
          matrix[position.y][position.x] = "X";
        } else {
          break;
        }
      }

      console.log("Final Matrix:");
      console.log(matrix.map((row) => row.join("")).join("\n"));
      console.log("Distinct positions visited:", visited.size);

      // Part 2
      // TODO - Its not working :(
      const loopPositions = findObstructionLoopPositions(matrix);
      console.log("Number of positions to cause a loop:", loopPositions);
    })
    .catch((err) => {
      console.error(err);
    });
}
