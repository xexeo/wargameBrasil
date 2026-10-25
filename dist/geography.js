import { geography } from "./geography-data.js";
export { geography };
export const geographicCell = (q, r) => geography.cells[r * 9 + q];
export const altitude = (q, r) => geographicCell(q, r)?.altitude ?? 0;
export function terrainLevel(q, r) {
    const h = altitude(q, r);
    return h < 780 ? 1 : h < 850 ? 2 : h < 920 ? 3 : 4;
}
export const geographicTerrain = (q, r) => geographicCell(q, r)?.terrain ?? "plain";
//# sourceMappingURL=geography.js.map