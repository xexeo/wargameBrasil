import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
const bundled = await build({
  entryPoints: ["app.ts"],
  bundle: true,
  write: false,
  format: "iife",
  target: "es2022",
  minify: true,
});
const font = await readFile(
  "assets/fonts/barlow-condensed-latin-600-normal.woff2",
);
const fontLicense = await readFile("assets/fonts/OFL.txt", "utf8");
const css =
  `/* Barlow Condensed — included font license:\n${fontLicense}\n*/\n` +
  (await readFile("style.css", "utf8")).replace(
    'url("assets/fonts/barlow-condensed-latin-600-normal.woff2")',
    () => `url("data:font/woff2;base64,${font.toString("base64")}")`,
  );
const html = (await readFile("template.html", "utf8"))
  .replace(
    /<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?>/,
    () => `<style>${css}</style>`,
  )
  .replace(
    '<script type="module" src="dist/app.js"></script>',
    () =>
      `<script>${bundled.outputFiles[0].text.replace(/<\/script/gi, "<\\/script")}</script>`,
  );
if (html.includes('href="style.css"') || html.includes('src="dist/app.js"')) {
  throw new Error("Falha ao incorporar os recursos do jogo standalone.");
}
await writeFile("jogo.html", html);
await writeFile("index.html", html);
console.log(
  "jogo.html gerado: HTML, CSS e JavaScript embutidos; funciona sem servidor.",
);
