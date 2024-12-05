import { readTxtFile } from "../utils/utils.ts";

function isIncreasingOrDecreasing(numbers: number[]): boolean {
  let increasing = true;
  let decreasing = true;

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] <= numbers[i - 1]) {
      increasing = false;
    }
    if (numbers[i] >= numbers[i - 1]) {
      decreasing = false;
    }
    if (
      Math.abs(numbers[i] - numbers[i - 1]) < 1 ||
      Math.abs(numbers[i] - numbers[i - 1]) > 3
    ) {
      return false;
    }
  }

  return increasing || decreasing;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const filename = Deno.args[0] || "input.txt";

  readTxtFile(filename)
    .then((input) => {
      // console.log(`Input:\n${input}`);

      const lines = input.trim().split("\n");

      // Part 1
      const safeLines = lines.filter((line) => {
        const numbers = line.split(" ").map(Number);
        return isIncreasingOrDecreasing(numbers);
      });
      console.log(`Safe Lines Without Dampener:\n${safeLines.length}`);

      // Part 2
      const safeLinesWithDampener = lines.filter((line) => {
        const numbers = line.split(" ").map(Number);
        if (isIncreasingOrDecreasing(numbers)) return true;

        return numbers.some((_, i) => {
          const dampenedNumbers = [
            ...numbers.slice(0, i),
            ...numbers.slice(i + 1),
          ];
          return isIncreasingOrDecreasing(dampenedNumbers);
        });
      });
      console.log(`Safe Lines With Dampener:\n${safeLinesWithDampener.length}`);
    })
    .catch((err) => {
      console.error(err);
    });
}
