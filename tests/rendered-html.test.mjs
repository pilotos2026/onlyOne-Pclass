import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the PClass event landing with approved P0 copy", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /PClass/);
  assert.match(html, /Experience OnlyOne/i);
  assert.match(html, /Solucionario UNCP 2026-II/);
  assert.match(html, /Solucionario/);
  assert.match(html, /Ver transmisión en vivo/);
  assert.match(html, /Registrarme gratis/);
  assert.match(html, /Todo ocurre dentro de PClass/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Phoenix/);
});

test("renders every public P0 route and the Control Room shell", async () => {
  const routes = [
    ["/uncp-2026-ii/live", /Live \+ participación/],
    ["/uncp-2026-ii/solucionario", /Solucionario validado/],
    ["/uncp-2026-ii/recursos", /Todo lo que necesitas/],
    ["/uncp-2026-ii/resultados", /Resultados oficiales/],
    ["/uncp-2026-ii/orientacion", /Orientación Personal Class/],
    ["/uncp-2026-ii/registro", /Completa tu información/],
    ["/uncp-2026-ii/mi-pclass", /Tu espacio PClass/],
    ["/control-room", /Sin datos de captación/],
    ["/control-room/login", /Acceso del equipo/],
  ];

  for (const [path, expected] of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, expected, path);
  }
});

test("removes all temporary starter assets and metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /EventLanding/);
  assert.match(layout, /PClass \| Experience OnlyOne/);
  assert.doesNotMatch(layout, /next\/font\/google/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
