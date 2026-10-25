import { readFile, writeFile } from "node:fs/promises";
const osm = JSON.parse(
  await readFile("docs/geography/osm-source.json", "utf8"),
);
const locations = JSON.parse(
  await readFile("docs/geography/locations.json", "utf8"),
);
const dem = JSON.parse(
  await readFile("docs/geography/elevation-source.json", "utf8"),
);
const nodeMap = new Map(
  osm.elements.filter((e) => e.type === "node").map((e) => [e.id, e]),
);
const wayMap = new Map(
  osm.elements.filter((e) => e.type === "way").map((e) => [e.id, e]),
);
function project(lat, lon) {
  return {
    x:
      417 +
      ((lon - locations.peak.longitude) *
        111320 *
        Math.cos((locations.peak.latitude * Math.PI) / 180)) /
        locations.metersPerPixel,
    y:
      119 -
      ((lat - locations.peak.latitude) * 111320) / locations.metersPerPixel,
  };
}
const point = (n) => project(n.lat, n.lon);
const points = (w) =>
  w.nodes
    .map((id) => nodeMap.get(id))
    .filter(Boolean)
    .map(point);
function distance(p, a, b) {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    t = Math.max(
      0,
      Math.min(
        1,
        ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1),
      ),
    );
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}
function simplify(p, tolerance = 2) {
  if (p.length <= 2) return p;
  let max = 0,
    index = 0;
  for (let i = 1; i < p.length - 1; i++) {
    const d = distance(p[i], p[0], p.at(-1));
    if (d > max) {
      max = d;
      index = i;
    }
  }
  return max > tolerance
    ? [
        ...simplify(p.slice(0, index + 1), tolerance).slice(0, -1),
        ...simplify(p.slice(index), tolerance),
      ]
    : [p[0], p.at(-1)];
}
const isForest = (t) => t?.natural === "wood" || t?.landuse === "forest";
const woods = [...wayMap.values()]
  .filter((w) => isForest(w.tags) && w.nodes[0] === w.nodes.at(-1))
  .map(points);
for (const rel of osm.elements.filter(
  (e) => e.type === "relation" && isForest(e.tags),
)) {
  const parts = rel.members
    .filter((m) => m.type === "way" && m.role === "outer" && wayMap.has(m.ref))
    .map((m) => [...wayMap.get(m.ref).nodes]);
  while (parts.length) {
    let chain = parts.shift(),
      changed = true;
    while (changed && chain[0] !== chain.at(-1)) {
      changed = false;
      for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        if (part.at(-1) === chain.at(-1)) part = [...part].reverse();
        if (part[0] === chain.at(-1)) {
          chain.push(...part.slice(1));
          parts.splice(i, 1);
          changed = true;
          break;
        }
      }
    }
    if (chain[0] === chain.at(-1))
      woods.push(
        chain
          .map((id) => nodeMap.get(id))
          .filter(Boolean)
          .map(point),
      );
  }
}
function contains(p, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i],
      b = polygon[j];
    if (
      a.y > p.y !== b.y > p.y &&
      p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
    )
      inside = !inside;
  }
  return inside;
}
const roadTypes = [
  "primary",
  "secondary",
  "tertiary",
  "unclassified",
  "residential",
  "service",
  "track",
  "path",
  "footway",
];
const roads = [...wayMap.values()]
  .filter((w) => roadTypes.includes(w.tags?.highway))
  .map((w) => ({
    id: w.id,
    name: w.tags.name ?? "",
    type: w.tags.highway,
    points: simplify(points(w)),
  }))
  .filter((w) => w.points.length > 1);
const cells = locations.cells.map((c, i) => {
  const p = project(c.latitude, c.longitude),
    forest = woods.some((w) => contains(p, w)),
    road = roads.some((w) =>
      w.points.some((b, j) => j > 0 && distance(p, w.points[j - 1], b) < 11),
    );
  return {
    ...c,
    altitude: dem.elevation[i],
    terrain: road ? "road" : forest ? "forest" : "plain",
  };
});
const settlements = osm.elements
  .filter((e) => e.type === "node" && e.tags?.place && e.tags?.name)
  .map((e) => ({ name: e.tags.name, ...point(e) }));
const buildings = [...wayMap.values()]
  .filter((w) => w.tags?.building && w.nodes[0] === w.nodes.at(-1))
  .map((w) => simplify(points(w), 0.3));
const round = (p) => ({
  x: Math.round(p.x * 10) / 10,
  y: Math.round(p.y * 10) / 10,
});
const data = {
  peak: { ...locations.peak, documentedAltitude: 977, osmNode: 5245929042 },
  metersPerPixel: locations.metersPerPixel,
  cells,
  roads: roads.map((w) => ({ ...w, points: w.points.map(round) })),
  woods: woods.map((w) => simplify(w, 2).map(round)),
  buildings: buildings.map((w) => w.map(round)),
  settlements: settlements.map((s) => ({ ...s, ...round(s) })),
};
await writeFile(
  "geography-data.ts",
  `// Geographical data, not a surveyed 1945 order of battle. OSM data: ODbL; DEM: Copernicus GLO-90 via Open-Meteo.\nexport const geography=${JSON.stringify(data)};\n`,
);
console.log({
  cells: cells.length,
  terrain: cells.reduce(
    (a, c) => ((a[c.terrain] = (a[c.terrain] ?? 0) + 1), a),
    {},
  ),
  roads: roads.length,
  woodPolygons: woods.length,
  buildings: buildings.length,
  settlements: settlements.length,
  minAltitude: Math.min(...cells.map((c) => c.altitude)),
  maxAltitude: Math.max(...cells.map((c) => c.altitude)),
});
