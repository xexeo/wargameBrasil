import { geography } from "./geography-data.js";
export { geography };
export const geographicCell = (q: number, r: number) =>
  geography.cells[r * 9 + q];
export const altitude = (q: number, r: number): number =>
  geographicCell(q, r)?.altitude ?? 0;
export function terrainLevel(q: number, r: number): number {
  const h = altitude(q, r);
  return h < 780 ? 1 : h < 850 ? 2 : h < 920 ? 3 : 4;
}
export const geographicTerrain = (q: number, r: number): string =>
  geographicCell(q, r)?.terrain ?? "plain";
