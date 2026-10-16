const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.split('\n')[0]));
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.evaluate(() => document.getElementById('btn-w-vet').click());
  await new Promise(r => setTimeout(r, 1000));
  const r = await page.evaluate(() => {
    if (typeof Game === "undefined" || typeof makeMech === "undefined") return { no: true };
    // Build a mech directly and damage limbs, draw on a test canvas
    const m = makeMech("player", "TEST", { armor:"medium", armL:"rifle", armR:"blade" });
    m.limbs.armL.hp = Math.floor(m.limbs.armL.max * 0.4);
    m.limbs.legR.hp = 0; m.limbs.legR.destroyed = true;
    m.limbs.torso.hp = Math.floor(m.limbs.torso.max * 0.7);
    const cv = document.createElement('canvas');
    cv.width = 200; cv.height = 220;
    cv.style.cssText = 'position:fixed;top:10px;left:95px;z-index:9999;background:#111;border:2px solid #0ff';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    drawMech(ctx, m, 40, 10, 120, 200, {});
    return { drawn: true };
  });
  console.log(JSON.stringify(r));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/tmp/limb-indicators.png' });
  await browser.close();
})();
