import { readTxtFile } from "../utils/utils.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const filename = Deno.args[0] || "input.txt";

  readTxtFile(filename)
    .then((input) => {
      // console.log(`Input:\n${input}`);

      // Part 1
      const removeCorruptedCode = (input: string): [number, number][] => {
        const regex = /mul\((\d+),(\d+)\)/g;
        const matches = input.matchAll(regex);
        const result: [number, number][] = [];

        for (const match of matches) {
          const x = parseInt(match[1], 10);
          const y = parseInt(match[2], 10);
          result.push([x, y]);
        }

        return result;
      };

      const removed = removeCorruptedCode(input);
      const result = removed
        .map(([x, y]) => x * y)
        .reduce((acc, curr) => acc + curr, 0);

      console.log(`Part 1 Result:\n${result}`);

      // Part 2
      const removeCorruptedCodeWithConditions = (
        input: string
      ): [number, number][] => {
        const regex = /mul\((\d+),(\d+)\)/g;
        const result: [number, number][] = [];
        let dontFlag = false;

        const parts = input.split(/(don't|do)/);
        // console.log("Parts:");
        // console.log(parts);

        for (const part of parts) {
          if (part === "don't") {
            dontFlag = true;
          } else if (part === "do") {
            dontFlag = false;
          } else if (!dontFlag) {
            const matches = part.matchAll(regex);
            for (const match of matches) {
              const x = parseInt(match[1], 10);
              const y = parseInt(match[2], 10);
              result.push([x, y]);
            }
          }
        }

        return result;
      };

      const removedWithConditions = removeCorruptedCodeWithConditions(input);

      const resultWithConditions = removedWithConditions
        .map(([x, y]) => x * y)
        .reduce((acc, curr) => acc + curr, 0);

      console.log(`Part 2 Result:\n${resultWithConditions}`);
    })
    .catch((err) => {
      console.error(err);
    });
}
