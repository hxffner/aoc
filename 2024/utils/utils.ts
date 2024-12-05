export function readTxtFile(filePath: string) {
  return Deno.readTextFile(filePath);
}
