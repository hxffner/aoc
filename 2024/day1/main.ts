import { readTxtFile } from "../utils/utils.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const filename = Deno.args[0] || "input.txt";

  readTxtFile(filename)
    .then((input) => {
      // console.log(`Input:\n${input}`);
      const left: number[] = [];
      const right: number[] = [];

      const lines = input.split("\n");

      lines.map((line) => {
        const [l, r] = line.split(/\s+/).map(Number);
        left.push(l);
        right.push(r);
      });

      // Part 1
      const sorted = {
        left: [...left].sort((a, b) => a - b),
        right: [...right].sort((a, b) => a - b),
      };
      // console.log(`Sorted:\nLeft: ${sorted.left}\nRight: ${sorted.right}`);

      const pairs = sorted.left.map((l, i) => [l, sorted.right[i]]);
      // pairs.forEach((pair) => {
      //   console.log(`Pair: ${pair}`);
      // });

      const distances = pairs.map(([l, r]) => Math.abs(r - l));
      const distanceSum = distances.reduce((acc, curr) => acc + curr, 0);

      console.log(`Part 1 Result: ${distanceSum}`);

      // Part 2
      const appearance = left.map((l) => {
        return right.filter((r) => r === l).length;
      });

      const similarityScore = left.map((l, i) => {
        return l * appearance[i];
      });

      const similarityScoreSum = similarityScore.reduce((acc, curr) => acc + curr, 0);
      console.log(`Part 2 Result: ${similarityScoreSum}`);
    })
    .catch((err) => {
      console.error(err);
    });
}
