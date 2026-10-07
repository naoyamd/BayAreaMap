import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const metadata = new Map([...html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"\s*\/>/g)]
  .map((match) => [match[1], match[2]]));

test("social previews have static Japanese metadata and a public image included in Pages", () => {
  const base = "https://map.nightly.dedyn.io/";
  assert.equal(metadata.get("og:type"), "website");
  assert.equal(metadata.get("og:url"), base);
  assert.ok(html.includes(`<link rel="canonical" href="${base}"`));
  assert.match(metadata.get("og:title"), /ベイエリア企業マップ/);
  assert.match(metadata.get("og:description"), /企業.*地図/);
  assert.equal(metadata.get("description"), metadata.get("og:description"));
  assert.equal(metadata.get("twitter:card"), "summary_large_image");
  for (const key of ["title", "description", "image", "image:alt"]) {
    assert.equal(metadata.get(`twitter:${key}`), metadata.get(`og:${key}`));
  }
  const url = new URL(metadata.get("og:image"));
  assert.equal(url.origin, new URL(base).origin);
  assert.equal(url.pathname, "/assets/og-bay-area-v1.jpg");
  assert.equal(metadata.get("og:image:type"), "image/jpeg");
  assert.match(metadata.get("og:image:alt"), /地図/);
  const workflow = readFileSync(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8");
  assert.match(workflow, /cp -r assets _site\//);
});

test("the actual social image is a 1200 by 630 JPEG matching its metadata", () => {
  const jpeg = readFileSync(new URL("../assets/og-bay-area-v1.jpg", import.meta.url));
  assert.equal(jpeg.readUInt16BE(0), 0xffd8, "JPEG signature");
  let dimensions;
  for (let offset = 2; offset < jpeg.length;) {
    assert.equal(jpeg[offset++], 0xff);
    const marker = jpeg[offset++];
    const length = jpeg.readUInt16BE(offset);
    if (marker === 0xc0 || marker === 0xc2) {
      dimensions = [jpeg.readUInt16BE(offset + 5), jpeg.readUInt16BE(offset + 3)];
      break;
    }
    offset += length;
  }
  assert.deepEqual(dimensions, [1200, 630]);
  assert.deepEqual(dimensions, [Number(metadata.get("og:image:width")), Number(metadata.get("og:image:height"))]);
  assert.ok(jpeg.length < 500_000, "keep the card quick to download");
});
