export function parseCSV(text) {
  return text.split("\n").map(row => row.split(","));
}