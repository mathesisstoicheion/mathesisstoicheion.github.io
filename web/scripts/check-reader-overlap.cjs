// usage: node web/scripts/check-reader-overlap.cjs [base-url]   (the owner, 2026-11-09: "Translation" ran under its menu in Text)
// Opens the foot bar, Text, Study, More, Go to and the notes on Plato's Republic at 1440, 1024, 390 and 320 px, and lists any text that runs
// out of its own box or lies over a button, menu or field beside it. Exits with 1 on a problem.
// Finds text that runs out of its own box (into a neighbour) in every reader menu, at a computer's and a phone's width.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' }, args: ['--ignore-certificate-errors'] } : {});
  let bad = 0;
  for (const [name, vp] of [['pc', { width: 1440, height: 900 }], ['tablet', { width: 1024, height: 768 }], ['phone', { width: 390, height: 844 }], ['small', { width: 320, height: 640 }]]) {
    const ctx = await b.newContext({ viewport: vp, hasTouch: name !== 'pc' && name !== 'tablet', isMobile: name === 'phone' || name === 'small' });
    const p = await ctx.newPage();
    await p.goto((process.argv[2] || 'http://localhost:3100') + '/read?w=tlg0059.tlg030&tr=perseus-eng1');
    await p.waitForSelector('article [data-w]', { timeout: 120000 }); await p.waitForTimeout(1200);
    const scan = async (what) => {
      const found = await p.evaluate(() => {
        const out = [];
        const scope = [...document.querySelectorAll('[data-foot-bar], [data-overlay]:not([hidden]), [data-notes-fab]')];
        for (const s of scope) {
          const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
          for (let t = w.nextNode(); t; t = w.nextNode()) {
            if (!t.textContent.trim()) continue;
            const el = t.parentElement; if (!el || !el.getClientRects().length) continue;
            if (el.closest('.visually-hidden, [hidden], option, select')) continue;
            const r = document.createRange(); r.selectNodeContents(t); const tr = r.getBoundingClientRect();
            if (!tr.width) continue;
            // the text against its nearest box that is laid out as a block or a cell
            let box = el; while (box && getComputedStyle(box).display === 'inline') box = box.parentElement;
            const br = box.getBoundingClientRect();
            if (getComputedStyle(box).textOverflow !== 'ellipsis' && tr.right > br.right + 1.5 || tr.left < br.left - 1.5) out.push(`"${t.textContent.trim().slice(0, 30)}" runs out of its box by ${Math.round(Math.max(tr.right - br.right, br.left - tr.left))} px`);
            // and against any control it touches
            for (const c of s.querySelectorAll('select, input, button')) {
              if (c.contains(el)) continue;
              if (c.closest('[data-overlay]') !== el.closest('[data-overlay]')) continue;   // a menu standing over the bar
              const cr = c.getBoundingClientRect(); if (!cr.width) continue;
              if (tr.right > cr.left + 1 && tr.left < cr.right - 1 && tr.bottom > cr.top + 1 && tr.top < cr.bottom - 1) out.push(`"${t.textContent.trim().slice(0, 30)}" lies over a ${c.tagName.toLowerCase()} ("${(c.getAttribute('aria-label') || c.textContent).trim().slice(0, 20)}")`);
            }
          }
        }
        return [...new Set(out)];
      });
      for (const f of found) { bad++; console.log(`✗ ${name} ${what}: ${f}`); }
    };
    await scan('bar');
    for (const label of ['Text', 'Study', 'More']) {
      await p.locator(`[data-foot-bar] button`, { hasText: label }).first().click(); await p.waitForTimeout(600);
      // open every folded group and fold
      await p.evaluate(() => document.querySelectorAll('[data-overlay]:not([hidden]) [aria-expanded="false"]').forEach((b) => b.closest('[data-tool="keys"]') || b.click()));
      await p.waitForTimeout(400);
      await scan(label); await p.reload(); await p.waitForSelector('article [data-w]', { timeout: 120000 }); await p.waitForTimeout(800);
    }
    await p.locator('[data-foot-bar] button[aria-controls$="-goto"]').click().catch(() => {}); await p.waitForTimeout(500); await scan('Go to'); await p.reload(); await p.waitForSelector('article [data-w]', { timeout: 120000 }); await p.waitForTimeout(300);
    await p.evaluate(() => { scrollTo(0, 0); dispatchEvent(new CustomEvent('mathesis:foot', { detail: false })); }); await p.waitForTimeout(600);
    await p.locator('[data-notes-fab] button').first().click({ force: true }); await p.waitForTimeout(500); await scan('Notes');
    await ctx.close();
  }
  await b.close();
  console.log(bad ? `${bad} problem(s)` : 'no text out of its box');
  process.exit(bad ? 1 : 0);
})();
