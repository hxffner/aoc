import { readTxtFile } from "../utils/utils.ts";

function parseRules(rules: string): Map<number, Set<number>> {
  const orderDict = new Map<number, Set<number>>();
  const ruleLines = rules.trim().split("\n");

  for (const rule of ruleLines) {
    const [x, y] = rule.split("|").map(Number);
    if (!orderDict.has(x)) {
      orderDict.set(x, new Set());
    }
    orderDict.get(x)?.add(y);
  }
  return orderDict;
}

function checkUpdate(
  update: number[],
  orderDict: Map<number, Set<number>>
): boolean {
  const pagePosition = new Map<number, number>();
  update.forEach((page, index) => pagePosition.set(page, index));

  for (const [x, nextPages] of orderDict) {
    for (const y of nextPages) {
      if (pagePosition.has(x) && pagePosition.has(y)) {
        if (pagePosition.get(x)! > pagePosition.get(y)!) {
          return false;
        }
      }
    }
  }
  return true;
}

function sortUpdate(
  update: number[],
  orderDict: Map<number, Set<number>>
): number[] {
  const sortedUpdate = [...update];

  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 0; i < sortedUpdate.length - 1; i++) {
      for (let j = i + 1; j < sortedUpdate.length; j++) {
        const x = sortedUpdate[i];
        const y = sortedUpdate[j];

        if (orderDict.has(x) && orderDict.get(x)?.has(y)) {
          [sortedUpdate[i], sortedUpdate[j]] = [
            sortedUpdate[j],
            sortedUpdate[i],
          ];
          sorted = false;
        }
      }
    }
  }

  return sortedUpdate;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const filename = Deno.args[0] || "input.txt";

  readTxtFile(filename)
    .then((input) => {
      // console.log(`Input:\n${input}`);

      const lines = input.trim().split("\n");
      const updateStartIndex = lines.findIndex((line) => line.includes(","));

      const pageOrderingRules = lines.slice(0, updateStartIndex).join("\n");
      const update = lines.slice(updateStartIndex).join("\n");

      // console.log(`Page Ordering Rules:\n${pageOrderingRules}`);
      // console.log(`Update:\n${update}`);

      const orderDict = parseRules(pageOrderingRules);

      const updates = update
        .trim()
        .split("\n")
        .map((line) => line.split(",").map(Number));
      let middlePageSum = 0;
      let middlePageCorrectedSum = 0;

      updates.forEach((updatePages) => {
        const isValid = checkUpdate(updatePages, orderDict);
        if (isValid) {
          // Part 1
          const middleIndex = Math.floor(updatePages.length / 2);
          const middlePage = updatePages[middleIndex];
          middlePageSum += middlePage;
        } else {
          // Part 2
          const correctedUpdate = sortUpdate(updatePages, orderDict);
          const middleIndex = Math.floor(correctedUpdate.length / 2);
          const middlePage = correctedUpdate[middleIndex];

          middlePageCorrectedSum += middlePage;
        }
      });

      console.log(`Part 1 Result: ${middlePageSum}`);
      console.log(`Part 2 Result: ${middlePageCorrectedSum}`);
    })
    .catch((err) => {
      console.error(err);
    });
}
