import { readTxtFile } from "../utils/utils.ts";

type Equation = {
  testValue: number;
  numbers: number[];
};

function parseInput(inputData: string): Equation[] {
  const equations: Equation[] = [];
  const lines = inputData.trim().split("\n");

  for (const line of lines) {
    const [testValue, numbers] = line.split(":");
    const parsedTestValue = parseInt(testValue.trim(), 10);
    const parsedNumbers = numbers.trim().split(" ").map(Number);
    equations.push({ testValue: parsedTestValue, numbers: parsedNumbers });
  }

  return equations;
}

function evaluateExpression(numbers: number[], operators: string[]): number {
  let result = numbers[0];

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "+") {
      result += numbers[i + 1];
    } else if (operators[i] === "*") {
      result *= numbers[i + 1];
    }
  }

  return result;
}

function canMatchTestValue(testValue: number, numbers: number[]): boolean {
  const operatorCount = numbers.length - 1;
  const operatorCombos = generateCombinations(["+", "*"], operatorCount);

  for (const operators of operatorCombos) {
    if (evaluateExpression(numbers, operators) === testValue) {
      return true;
    }
  }

  return false;
}

function generateCombinations(items: string[], length: number): string[][] {
  if (length === 0) return [[]];

  const smallerCombos = generateCombinations(items, length - 1);
  const combos: string[][] = [];

  for (const combo of smallerCombos) {
    for (const item of items) {
      combos.push([...combo, item]);
    }
  }

  return combos;
}

function calculateCalibrationSum(equations: Equation[]): number {
  let totalSum = 0;

  for (const { testValue, numbers } of equations) {
    if (canMatchTestValue(testValue, numbers)) {
      totalSum += testValue;
    }
  }

  return totalSum;
}

function evaluateExpressionWithConcat(
  numbers: number[],
  operators: string[]
): number {
  let result = numbers[0];

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "+") {
      result += numbers[i + 1];
    } else if (operators[i] === "*") {
      result *= numbers[i + 1];
    } else if (operators[i] === "||") {
      result = parseInt(result.toString() + numbers[i + 1].toString(), 10);
    }
  }

  return result;
}

function canMatchTestValueWithConcat(
  testValue: number,
  numbers: number[]
): boolean {
  const operatorCount = numbers.length - 1;
  const operatorCombos = generateCombinations(["+", "*", "||"], operatorCount);

  for (const operators of operatorCombos) {
    if (evaluateExpressionWithConcat(numbers, operators) === testValue) {
      return true;
    }
  }

  return false;
}

function calculateCalibrationSumWithConcat(equations: Equation[]): number {
  let totalSum = 0;

  for (const { testValue, numbers } of equations) {
    if (
      canMatchTestValue(testValue, numbers) ||
      canMatchTestValueWithConcat(testValue, numbers)
    ) {
      totalSum += testValue;
    }
  }

  return totalSum;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const filename = Deno.args[0] || "input.txt";

  readTxtFile(filename)
    .then((input) => {
      // console.log(`Input:\n${input}`);

      // Part 1
      const equations = parseInput(input);
      const calibrationResult = calculateCalibrationSum(equations);

      console.log(`Part 1 Result: ${calibrationResult}`);

      // Part 2
      const calibrationResultWithConcat =
        calculateCalibrationSumWithConcat(equations);
      console.log(`Part 2 Result: ${calibrationResultWithConcat}`);
    })
    .catch((err) => {
      console.error(err);
    });
}
