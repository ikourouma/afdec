// Internal link crawler: breadth-first over server-rendered HTML. Usage: node scripts/crawl-links.mjs http://localhost:3055
const base = process.argv[2] || "http://localhost:3055";
const seen = new Map(); // path -> status
const referrers = new Map();
const queue = ["/"];
const SKIP = /^\/(_next|api)\b|\.(png|jpe?g|svg|ico|webp|pdf|css|js|xml|txt)$/i;

async function visit(path) {
  let res;
  try {
    res = await fetch(base + path, { redirect: "manual" });
  } catch (e) {
    seen.set(path, "ERR " + e.message);
    return;
  }
  seen.set(path, res.status);
  if (res.status !== 200) return;
  const html = await res.text();
  for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const p = m[1].replace(/\/$/, "") || "/";
    if (SKIP.test(p)) continue;
    if (!referrers.has(p)) referrers.set(p, new Set());
    referrers.get(p).add(path);
    if (!seen.has(p) && !queue.includes(p)) queue.push(p);
  }
}

while (queue.length) {
  const batch = queue.splice(0, 8);
  await Promise.all(batch.map((p) => (seen.has(p) ? null : visit(p))));
}

const rows = [...seen.entries()].sort();
const bad = rows.filter(([, s]) => s !== 200);
console.log(`crawled ${rows.length} internal URLs`);
const redirects = bad.filter(([, s]) => s >= 300 && s < 400);
const errors = bad.filter(([, s]) => !(s >= 300 && s < 400));
console.log(`redirects (expected for gated pages): ${redirects.length}`);
redirects.forEach(([p, s]) => console.log("  ", s, p));
console.log(`errors: ${errors.length}`);
errors.forEach(([p, s]) => console.log("  ", s, p, "<-", [...(referrers.get(p) ?? [])].slice(0, 3).join(", ")));
