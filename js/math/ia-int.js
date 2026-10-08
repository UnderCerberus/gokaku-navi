/* 数I・A — 整数の性質: 最大公約数・最小公倍数 / 素因数分解と約数 / 1 次不定方程式 / n 進法 / 余りの計算（合同式）
   ※ 大きな積（最小公倍数・検算）は BigInt で厳密に計算する。 */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const CE = (msg) => new JK.CalcError(msg);

  /* ================= 共通の道具 ================= */

  // 10 桁以上の整数は 3 桁ごとに細い空白を入れる（BigInt / Number）
  function bt(b) {
    b = BigInt(b);
    let s = (b < 0n ? -b : b).toString();
    if (s.length >= 10) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, R`\,`);
    return (b < 0n ? '-' : '') + s;
  }
  const nt = (x) => bt(x);
  // 負の数はかっこで囲む
  const par = (x) => (x < 0 ? R`\left(` + nt(x) + R`\right)` : nt(x));
  // 符号つきの項: + 3 / - 2
  const sgn = (x) => (x < 0 ? '- ' + nt(-x) : '+ ' + nt(x));
  // 累乗の TeX（指数 1 は省略）
  const pw = (p, e) => (e === 1 ? String(p) : p + '^{' + e + '}');
  // 素因数分解の TeX: 2^{3} \times 3^{2} \times 5
  const facTex = (pf) => (pf.length ? pf.map((x) => pw(x[0], x[1])).join(R` \times `) : '1');
  const chunk = (items, per) => { const out = []; for (let i = 0; i < items.length; i += per) out.push(items.slice(i, i + per)); return out; };

  function textW(s) {
    let w = 0;
    for (const ch of String(s)) w += ch.charCodeAt(0) > 0x2E7F ? 12 : 7;
    return w;
  }
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const supText = (base, k) => base + String(k).split('').map((c) => SUP.charAt(Number(c))).join('');

  // ユークリッドの互除法の割り算（x ≥ y > 0）
  function euclidRows(x, y) {
    const rows = [];
    while (y > 0) { const q = Math.floor(x / y), r = x - q * y; rows.push({ x: x, y: y, q: q, r: r }); x = y; y = r; }
    return rows;
  }

  /* ================= 図（SVG） ================= */

  function tableSvg(head, rows, foot) {
    const all = [head].concat(rows, foot ? [foot] : []);
    const nc = head.length, rh = 22, pad = 9;
    const cw = [];
    for (let j = 0; j < nc; j++) cw.push(Math.max.apply(null, all.map((r) => textW(r[j]))) + pad * 2);
    const W = cw.reduce((s, x) => s + x, 0) + 2, H = rh * all.length + 2;
    const d = JK.plot.draw(Math.ceil(W), H);
    d.rect(1, 1, W - 2, rh, { cls: 'dim', fill: 'f1', w: 1 });
    d.rect(1, 1, W - 2, H - 2, { cls: 'dim', w: 1 });
    let y = 1;
    for (let i = 0; i < all.length; i++) {
      if (i > 0) d.line(1, y, W - 1, y, { cls: 'dim', w: (i === 1 || (foot && i === all.length - 1)) ? 1.4 : 0.6 });
      let x = 1;
      for (let j = 0; j < nc; j++) {
        d.text(x + cw[j] / 2, y + rh / 2 + 4, all[i][j], { size: 12, bold: i === 0 || !!(foot && i === all.length - 1) });
        x += cw[j];
      }
      y += rh;
    }
    let x = 1;
    for (let j = 0; j < nc - 1; j++) { x += cw[j]; d.line(x, 1, x, H - 1, { cls: 'dim', w: 0.6 }); }
    return d.svg();
  }

  // 割り算のはしご: rows = [{ div, num, rem? }]（最後の行は div なし）
  function ladderSvg(rows, caption, readUp) {
    const rowH = rows.length > 14 ? 20 : 26;
    const divW = Math.max.apply(null, rows.map((r) => (r.div == null ? 0 : textW(r.div)))), numW = Math.max.apply(null, rows.map((r) => textW(r.num)));
    const hasRem = rows.some((r) => r.rem != null);
    const x0 = 18, vx = x0 + divW + 12, xr = vx + 12 + numW;
    const W = Math.max(220, xr + (hasRem ? 90 : 30)), H = 14 + rows.length * rowH + (caption ? 24 : 8);
    const d = JK.plot.draw(Math.ceil(W), H);
    const nDiv = rows.filter((r) => r.div != null).length;
    d.line(vx, 12, vx, 12 + nDiv * rowH, { cls: 'fg', w: 1.6 });
    rows.forEach((r, i) => {
      const yTop = 12 + i * rowH, yb = yTop + rowH - 7;
      if (r.div != null) {
        d.line(vx, yTop, xr + 8, yTop, { cls: 'fg', w: 1.6 });
        d.text(vx - 8, yb, r.div, { size: 14, anchor: 'end', bold: true });
      }
      d.text(xr, yb, r.num, { size: 14, anchor: 'end' });
      if (r.rem != null) d.text(xr + 20, yb, '… ' + r.rem, { size: 13, anchor: 'start', bold: true });
    });
    if (readUp && nDiv > 0) d.arrow(xr + 70, 12 + (nDiv + 0.5) * rowH - 6, xr + 70, 16, { cls: 'c3', w: 2 });
    if (caption) d.text(W / 2, H - 8, caption, { size: 11, cls: 'dim' });
    return d.svg();
  }

  // 長方形をできるだけ大きな正方形で敷きつめる（互除法の図）。多すぎるときは null
  function tilesSvg(A, B, rows) {
    const count = rows.reduce((s, r) => s + r.q, 0);
    if (count > 36) return null;
    const W = 340, H = 220, m = 14;
    const sc = Math.min((W - 2 * m) / A, (H - 2 * m - 18) / B);
    const g = rows[rows.length - 1].y;
    if (sc * g < 7) return null;
    const d = JK.plot.draw(W, H);
    const fills = ['f1', 'f2', 'f3', 'f4'], strokes = ['c1', 'c2', 'c3', 'c4'];
    let x = 0, y = 0, w = A, h = B, step = 0;
    while (w > 0 && h > 0 && step < 60) {
      const ci = step % 4;
      if (w >= h) {
        const k = Math.floor(w / h);
        for (let i = 0; i < k; i++) tile(x + i * h, y, h, ci);
        x += k * h; w -= k * h;
      } else {
        const k = Math.floor(h / w);
        for (let i = 0; i < k; i++) tile(x, y + i * w, w, ci);
        y += k * w; h -= k * w;
      }
      step++;
    }
    function tile(tx, ty, s, ci) {
      d.rect(m + tx * sc, m + ty * sc, s * sc, s * sc, { cls: strokes[ci], fill: fills[ci], w: 1.4 });
      if (s * sc >= 15) d.text(m + (tx + s / 2) * sc, m + (ty + s / 2) * sc + 4.5, String(s), { size: s * sc >= 26 ? 13 : 11, bold: true });
    }
    d.text(W / 2, H - 6, A + ' × ' + B + ' の長方形を正方形で敷きつめる → 最小の正方形の 1 辺が最大公約数 ' + g, { size: 10.5, cls: 'dim' });
    return d.svg();
  }

  /* ================= ia-gcd: 最大公約数・最小公倍数 ================= */

  JK.registerCalc({
    id: 'ia-gcd',
    course: 'IA',
    unit: 'm-int',
    group: '整数の性質',
    title: '最大公約数・最小公倍数',
    desc: R`2 つの正の整数の最大公約数をユークリッドの互除法で、最小公倍数を $\dfrac{ab}{\mathrm{gcd}}$ で求めます。素因数分解による方法も示します。`,
    form: [R`\mathrm{gcd}(a,\,b) = \mathrm{gcd}(b,\,r)\quad (a = bq + r)`, R`\mathrm{lcm}(a,\,b) = \frac{a\,b}{\mathrm{gcd}(a,\,b)}`],
    inputs: [
      { key: 'a', label: R`$a$`, type: 'int', def: '1071', min: 1, max: 1000000000 },
      { key: 'b', label: R`$b$`, type: 'int', def: '462', min: 1, max: 1000000000 }
    ],
    examples: [
      { label: '教科書の定番（1071 と 462）', v: { a: '1071', b: '462' } },
      { label: '互いに素（17 と 5）', v: { a: '17', b: '5' } },
      { label: '片方がもう一方の倍数', v: { a: '84', b: '12' } },
      { label: '大きな数', v: { a: '123456789', b: '987654321' } }
    ],
    intro: {
      easy: R`たとえば 12 と 18 を考えます。
・12 の約数は 1, 2, 3, 4, 6, 12。18 の約数は 1, 2, 3, 6, 9, 18。
・両方に共通する約数（**公約数**）は 1, 2, 3, 6 で、そのうち最大の 6 が**最大公約数**です。
・12 の倍数 12, 24, 36, … と 18 の倍数 18, 36, … に共通する倍数（**公倍数**）のうち最小の 36 が**最小公倍数**です。
数が大きいと約数をすべて書き出すのは大変です。そこで、**わり算の余りに注目して少しずつ小さくしていく**ユークリッドの互除法を使います。`,
      normal: R`互除法は $a=bq+r$ のとき $\mathrm{gcd}(a,b)=\mathrm{gcd}(b,r)$ を、余りが $0$ になるまで繰り返します。最小公倍数は $\mathrm{lcm}=\dfrac{ab}{\mathrm{gcd}}$（$a=ga',\,b=gb'$ とすると $\mathrm{lcm}=ga'b'$）。`,
      pro: R`互除法は $\log$ のオーダーで速い。互いに素かどうかの判定（$\mathrm{gcd}=1$）や、$\mathrm{gcd}\times\mathrm{lcm}=ab$ の関係を使った問題が頻出です。`
    },
    compute(v) {
      const A = Math.max(v.a, v.b), B = Math.min(v.a, v.b);
      const rows = euclidRows(A, B), g = rows[rows.length - 1].y;
      const lcmB = BigInt(A / g) * BigInt(B), prodB = BigInt(A) * BigInt(B);
      const pfA = U.primeFactors(A), pfB = U.primeFactors(B);
      const primes = Array.from(new Set(pfA.map((x) => x[0]).concat(pfB.map((x) => x[0])))).sort((x, y) => x - y);
      const ex = (pf, p) => { const f = pf.filter((x) => x[0] === p)[0]; return f ? f[1] : 0; };
      const gcdPf = [], lcmPf = [];
      primes.forEach((p) => {
        const ea = ex(pfA, p), eb = ex(pfB, p);
        if (Math.min(ea, eb) > 0) gcdPf.push([p, Math.min(ea, eb)]);
        lcmPf.push([p, Math.max(ea, eb)]);
      });
      const coprime = g === 1;

      const steps = [];
      steps.push({
        t: '最大公約数・最小公倍数とは',
        n: R`**公約数**は 2 つの数に共通する約数、**最大公約数**はそのうち最大のもの（$\mathrm{gcd}$）です。**公倍数**は共通する倍数、**最小公倍数**はそのうち最小のもの（$\mathrm{lcm}$）です。最大公約数が $1$ のとき、2 つの数は**互いに素**といいます。`,
        easy: R`たとえば 12 と 18 なら、公約数は 1, 2, 3, 6 で、最大公約数は 6。公倍数は 36, 72, … で、最小公倍数は 36 です。このように、まず約数や倍数を書き出して考えるのが基本ですが、数が大きいときは次の互除法を使います。`,
        lv: 3
      });
      steps.push({
        t: 'なぜ互除法で最大公約数が求まるのか',
        m: [R`a = bq + r \quad\Longrightarrow\quad \mathrm{gcd}(a,\,b) = \mathrm{gcd}(b,\,r)`],
        n: R`$a$ と $b$ の公約数 $d$ は、$r=a-bq$ も割り切るので $b$ と $r$ の公約数でもあります。逆に $b$ と $r$ の公約数は $a=bq+r$ も割り切ります。公約数の集まりがまったく同じなので、最大公約数も同じです。`,
        easy: R`たとえば 18 と 12 の公約数は 1, 2, 3, 6。18 を 12 でわった余りは 6 で、12 と 6 の公約数も 1, 2, 3, 6 と**まったく同じ**です。大きい数を小さい数でわった余りにおきかえても、最大公約数は変わらないので、数を小さくしていけます。`,
        lv: 3
      });
      steps.push({
        t: '互除法: わり算を 1 行ずつ行う',
        m: rows.map((r) => R`${nt(r.x)} = ${nt(r.y)} \times ${nt(r.q)} + ${nt(r.r)}`).concat([
          rows.map((r) => R`\mathrm{gcd}(${nt(r.x)},\,${nt(r.y)})`).join(' = ') + R` = \mathrm{gcd}(${nt(g)},\,0) = ${nt(g)}`
        ]),
        n: R`大きい方 $${nt(A)}$ を小さい方 $${nt(B)}$ でわり、その余りで次の割り算を行います。これを**余りが $0$ になるまで**くり返し、最後の割る数が最大公約数です。`,
        easy: R`「大きい数 ÷ 小さい数」の余りを求め、次は「さっきの割る数 ÷ 余り」をくり返します。余りがだんだん小さくなり、いつか $0$ になります。そのとき割っていた数が、最初の 2 数の最大公約数です。`,
        pro: R`互除法の回数は多くても桁数の数倍。暗算では商を気にせず余りだけ追えばよい。`
      });
      steps.push({
        t: '最大公約数',
        m: [R`\mathrm{gcd}(${nt(v.a)},\,${nt(v.b)}) = ${nt(g)}`],
        n: coprime
          ? R`最大公約数は $1$ なので、$${nt(v.a)}$ と $${nt(v.b)}$ は**互いに素**です。`
          : R`余りが $0$ になったときの割る数 $${nt(g)}$ が最大公約数です。`,
        easy: R`最後の式 $${nt(rows[rows.length - 1].x)}=${nt(rows[rows.length - 1].y)}\times ${nt(rows[rows.length - 1].q)}+0$ で割り切れたので、割る数 $${nt(g)}$ がこの 2 数の最大公約数です。`
      });
      steps.push({
        t: '最小公倍数',
        m: [
          R`\mathrm{lcm}(a,\,b) = \frac{a \times b}{\mathrm{gcd}(a,\,b)}`,
          R`= \frac{${nt(v.a)} \times ${nt(v.b)}}{${nt(g)}} = (${nt(v.a)} \div ${nt(g)}) \times ${nt(v.b)} = ${nt(v.a / g)} \times ${nt(v.b)} = ${bt(BigInt(v.a / g) * BigInt(v.b))}`
        ],
        n: R`$a=ga',\ b=gb'$（$a',\,b'$ は互いに素）とおくと、$\mathrm{lcm}=ga'b'=\dfrac{ab}{g}$ です。先に $g$ でわってから掛けると、計算する数が小さくなります。`,
        easy: R`最小公倍数は「2 つの数の積 ÷ 最大公約数」で求まります。2 つの数の積には、共通の約数 $g$ が **2 回** ふくまれているので、1 回ぶんの $g$ を取りのぞく、というイメージです。`,
        pro: R`$\mathrm{gcd}\times\mathrm{lcm}=ab$。「$a,\,b$ の最大公約数が $g$ で最小公倍数が $l$」という条件の問題では $a=ga',\ b=gb',\ l=ga'b'$ とおくのが定石です。`
      });
      steps.push({
        t: '素因数分解による方法',
        m: [
          R`${nt(A)} = ${facTex(pfA)}`,
          R`${nt(B)} = ${facTex(pfB)}`
        ].concat(primes.map((p) => R`${p}\ \text{の指数}:\ ${ex(pfA, p)},\ ${ex(pfB, p)} \;\Rightarrow\; \min = ${Math.min(ex(pfA, p), ex(pfB, p))},\ \max = ${Math.max(ex(pfA, p), ex(pfB, p))}`)).concat([
          R`\mathrm{gcd} = ${facTex(gcdPf)} = ${nt(g)}\qquad (\text{指数の小さい方})`,
          R`\mathrm{lcm} = ${facTex(lcmPf)} = ${bt(lcmB)}\qquad (\text{指数の大きい方})`
        ]),
        n: R`それぞれを素因数分解し、素数ごとに指数を比べます。**最大公約数は指数の小さい方**、**最小公倍数は指数の大きい方**をとって掛けます。`,
        easy: R`たとえば $12=2^{2}\times 3$、$18=2\times 3^{2}$。共通して使える部分は $2^{1}\times 3^{1}=6$（最大公約数）。すべてをカバーできる部分は $2^{2}\times 3^{2}=36$（最小公倍数）です。`,
        lv: 2
      });
      steps.push({
        t: '検算（積の関係）',
        m: [R`a \times b = \mathrm{gcd} \times \mathrm{lcm}`, R`${nt(v.a)} \times ${nt(v.b)} = ${bt(prodB)},\qquad ${nt(g)} \times ${bt(lcmB)} = ${bt(BigInt(g) * lcmB)}`],
        n: prodB === BigInt(g) * lcmB ? R`両辺が一致しました。` : R`一致しません。`,
        easy: R`2 つの数の積は、最大公約数と最小公倍数の積に等しくなります。これを使うと、答えが合っているか確かめられます。`,
        lv: 2
      });

      return {
        result: [
          { label: '最大公約数', tex: R`\mathrm{gcd}(${nt(v.a)},\,${nt(v.b)}) = ${nt(g)}` },
          { label: '最小公倍数', tex: R`\mathrm{lcm}(${nt(v.a)},\,${nt(v.b)}) = ${bt(lcmB)}` },
          { label: '互いに素か', tex: coprime ? R`\text{互いに素}\ (\mathrm{gcd}=1)` : R`\text{互いに素ではない}\ (\mathrm{gcd}=${nt(g)})` }
        ],
        steps: steps,
        fig: tilesSvg(A, B, rows) || undefined
      };
    }
  });

  /* ================= ia-factorize: 素因数分解と約数 ================= */

  JK.registerCalc({
    id: 'ia-factorize',
    course: 'IA',
    unit: 'm-int',
    group: '整数の性質',
    title: '素因数分解・約数の個数と総和',
    desc: R`整数を小さい素数で順にわって素因数分解し、約数の個数 $(e_{1}+1)(e_{2}+1)\cdots$ と約数の総和を求めます。`,
    form: [R`n = p_{1}^{e_{1}}\,p_{2}^{e_{2}}\cdots p_{k}^{e_{k}}`, R`\text{個数 } (e_{1}+1)(e_{2}+1)\cdots(e_{k}+1)`, R`\text{総和 } \prod \left(1+p+\cdots+p^{e}\right)`],
    inputs: [
      { key: 'n', label: R`整数 $n$`, type: 'int', def: '360', min: 2, max: 1000000000, hint: '2 以上 10 億以下' }
    ],
    examples: [
      { label: '360', v: { n: '360' } },
      { label: '素数（97）', v: { n: '97' } },
      { label: '平方数（144）', v: { n: '144' } },
      { label: '大きな数（999999）', v: { n: '999999' } }
    ],
    intro: {
      easy: R`**素数**とは、$1$ と自分自身でしか割り切れない $2$ 以上の整数（2, 3, 5, 7, 11, 13, …）です。どんな整数も、素数だけの積で表せます（たとえば $12=2\times 2\times 3$）。これを**素因数分解**といいます。
素因数分解ができると、その数の**約数がいくつあるか**、**約数をすべて足すといくつか**まで、かけ算だけで求められます。`,
      normal: R`$n=p_{1}^{e_{1}}\cdots p_{k}^{e_{k}}$ のとき、約数の個数は $(e_{1}+1)\cdots(e_{k}+1)$、約数の総和は $(1+p_{1}+\cdots+p_{1}^{e_{1}})\cdots(1+p_{k}+\cdots+p_{k}^{e_{k}})$。`,
      pro: R`約数の個数が奇数 $\Leftrightarrow$ 平方数。素因数分解は小さい素数から順に試し、$\sqrt{n}$ まで調べれば十分。「約数が○個の自然数」型の問題は、指数の組を場合分けして解きます。`
    },
    compute(v) {
      const n = v.n;
      const pf = U.primeFactors(n);
      const flat = []; pf.forEach((x) => { for (let i = 0; i < x[1]; i++) flat.push(x[0]); });
      const isPrime = flat.length === 1;
      // はしご（最後の素数は割らずに残す）
      const rows = []; let cur = n;
      for (let i = 0; i < flat.length - 1; i++) { rows.push({ div: String(flat[i]), num: String(cur) }); cur /= flat[i]; }
      rows.push({ num: String(cur) });
      const count = pf.reduce((s, x) => s * (x[1] + 1), 1);
      const sums = pf.map((x) => { let s = 0, p = 1; for (let i = 0; i <= x[1]; i++) { s += p; p *= x[0]; } return s; });
      const total = sums.reduce((s, x) => s * x, 1);
      // 約数の一覧
      let divs = [1];
      pf.forEach((x) => { const nd = []; let p = 1; for (let i = 0; i <= x[1]; i++) { divs.forEach((d) => nd.push(d * p)); p *= x[0]; } divs = nd; });
      divs.sort((a, b) => a - b);
      const showList = divs.length <= 48;
      const last = flat[flat.length - 1];
      const smallPrimes = []; for (let p = 2; p * p <= last && smallPrimes.length < 12; p++) { let ok = true; for (let q = 2; q * q <= p; q++) if (p % q === 0) { ok = false; break; } if (ok) smallPrimes.push(p); }
      const checkSmall = Math.floor(Math.sqrt(last)) < 40;

      const steps = [];
      steps.push({
        t: '素数と素因数分解とは',
        n: R`**素数**は $1$ と自分自身以外に約数をもたない $2$ 以上の整数です。整数を素数の積の形に表すことを**素因数分解**といいます。素因数分解の結果の並べ方（順序）を除けば、どんな整数でもただ 1 通りに表せます。`,
        easy: R`素数は 2, 3, 5, 7, 11, 13, …（1 は素数ではありません）。たとえば 12 は $2\times 6$ とも書けますが、6 はまだ $2\times 3$ と分けられるので、$12=2\times 2\times 3$ まで分けて、**これ以上分けられない素数**だけにします。これが素因数分解です。`,
        lv: 3
      });
      steps.push({
        t: '小さい素数から順にわっていく',
        m: rows.slice(0, -1).map((r) => R`${nt(Number(r.num))} \div ${r.div} = ${nt(Number(r.num) / Number(r.div))}`).concat(isPrime ? [R`${nt(n)}\ \text{は素数}`] : [R`\text{残った } ${nt(last)}\ \text{は素数}`]),
        n: (isPrime
          ? R`$2$ から順に素数で試しても割り切れる数がないので、$${nt(n)}$ 自身が素数です。`
          : R`$2,\,3,\,5,\,7,\dots$ と小さい素数から順に、割り切れるあいだ何度でも割ります。割り切れなくなったら次の素数に進み、商が素数になったら終わりです。`) +
          (checkSmall ? R`（$${nt(last)}$ は $${smallPrimes.join(',\\ ') || '2'}$ のどれでも割り切れないので素数です。）` : R`（$\sqrt{${nt(last)}}$ 以下のすべての素数で割り切れないので素数です。）`),
        easy: R`わり算の筆算のように、左にわる素数、右にわられる数を書いて、割り切れる素数で次々にわっていきます。まず 2 でわれるだけわり、次に 3、5、7、… と進めます。商が $1$ 以外の素数になったらストップです。`,
        pro: R`$\sqrt{n}$ 以下の素数で割れなければ素数。$2,3,5,7$ の倍数判定（末尾・各位の和など）を暗算で行う。`
      });
      steps.push({
        t: '素因数分解の結果',
        m: [R`${nt(n)} = ${flat.map((p) => p).join(R` \times `)}`, R`${nt(n)} = ${facTex(pf)}`],
        n: isPrime ? R`$${nt(n)}$ は素数です（素因数分解は $${nt(n)}$ 自身のみ）。` : R`同じ素数は**累乗**でまとめます。`,
        easy: R`同じ素数がいくつか並ぶときは、$2\times 2\times 2=2^{3}$ のように指数でまとめます。`
      });
      steps.push({
        t: '約数の個数',
        m: [
          R`\text{個数} = (e_{1}+1)(e_{2}+1)\cdots(e_{k}+1)`,
          R`= ${pf.map((x) => R`(${x[1]}+1)`).join('')} = ${pf.map((x) => x[1] + 1).join(R` \times `)} = ${count}`
        ],
        n: R`各素数の指数に $1$ を足してかけます。素数 $p$ の指数が $e$ なら、約数にふくまれる $p$ の個数は $0,1,\dots,e$ の $e+1$ 通りあるからです。`,
        easy: R`たとえば $12=2^{2}\times 3$ の約数は、$2^{a}\times 3^{b}$ の形で、$a=0,1,2$（3 通り）と $b=0,1$（2 通り）を自由に選べます。組み合わせは $3\times 2=6$ 通り（1, 2, 4, 3, 6, 12）です。このように、素数ごとの選び方の数をかけ算します（**積の法則**）。`,
        pro: R`約数の個数が**奇数**になるのは、すべての指数が偶数のとき（= 平方数）に限る。${count % 2 === 1 ? R`今回の個数 $${count}$ は奇数なので、$${nt(n)}$ は平方数です。` : R`今回の個数 $${count}$ は偶数なので、$${nt(n)}$ は平方数ではありません。`}`
      });
      steps.push({
        t: '約数の総和',
        m: [
          R`\text{総和} = (1+p_{1}+\cdots+p_{1}^{e_{1}})(1+p_{2}+\cdots+p_{2}^{e_{2}})\cdots`,
          R`= ${pf.map((x) => '(' + (x[1] <= 5 ? Array.from({ length: x[1] + 1 }, (_, i) => nt(Math.pow(x[0], i))).join(' + ') : R`1 + ${x[0]} + \cdots + ${nt(Math.pow(x[0], x[1]))}`) + ')').join('')}`,
          R`= ${sums.map(nt).join(R` \times `)} = ${nt(total)}`
        ],
        n: R`素数ごとに「$1+p+p^{2}+\cdots+p^{e}$」を計算し、それらをかけます。この積を展開すると、約数が 1 回ずつすべて現れるので、総和になります。`,
        easy: R`$12=2^{2}\times 3$ なら $(1+2+4)(1+3)=7\times 4=28$ です。実際に約数 1, 2, 3, 4, 6, 12 を足すと 28 になります。かっこの中は「その素数を $0$ 個, $1$ 個, … 使った値」、かけ算を展開すると約数が全部 1 回ずつ出てくるからです。`,
        pro: R`各項は $\dfrac{p^{e+1}-1}{p-1}$ と計算できる（等比数列の和）。`
      });
      if (showList) {
        steps.push({
          t: '約数の一覧で確かめる',
          m: chunk(divs, 12).map((c, i, all) => c.map(nt).join(R`,\ `) + (i < all.length - 1 ? ',' : '')).concat([R`\text{個数 } ${divs.length}\text{ 個,\quad 総和 } ${nt(divs.reduce((s, x) => s + x, 0))}`]),
          n: divs.length === count && divs.reduce((s, x) => s + x, 0) === total ? R`書き出した約数の個数・総和は、公式で求めた値と一致しました。` : R`公式の値と一致しません。`,
          easy: R`約数を小さい順に全部書き出し、個数と合計を数えて、公式の結果と同じになるか確かめます。`,
          lv: 2
        });
      }

      const result = [
        { label: '素因数分解', tex: isPrime ? R`${nt(n)}\ (\text{素数})` : R`${nt(n)} = ${facTex(pf)}` },
        { label: '約数の個数', tex: R`${count}\ \text{個}` },
        { label: '約数の総和', tex: nt(total) }
      ];
      if (showList) result.push({ label: '約数の一覧', tex: divs.map(nt).join(R`,\ `) });
      return { result: result, steps: steps, fig: ladderSvg(rows, isPrime ? nt(n) + ' は素数' : '小さい素数から順にわる', false) };
    }
  });

  /* ================= ia-diophantine: 1 次不定方程式 ================= */

  function linTerm(c, x) { return c < 0n ? '(' + c + ') \\times ' + x : c + ' \\times ' + x; }
  const bgcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { const t = a % b; a = b; b = t; } return a; };
  const bmod = (a, m) => ((a % m) + m) % m;

  // x = x0 + p k の TeX（p は符号つきの傾き）: 4 + 5k / -6 - 17k / 3
  function kForm(c0, p, name) {
    const ap = p < 0n ? -p : p;
    const k = ap === 1n ? 'k' : ap + 'k';
    if (p === 0n) return String(c0);
    if (c0 === 0n) return (p < 0n ? '-' : '') + k;
    return c0 + (p < 0n ? ' - ' : ' + ') + k;
  }

  JK.registerCalc({
    id: 'ia-diophantine',
    course: 'IA',
    unit: 'm-int',
    group: '整数の性質',
    title: '1 次不定方程式 ax + by = c',
    desc: R`整数解をもつかどうかを最大公約数で判定し、互除法を逆にたどって特殊解を求め、一般解を $x=x_{0}+\dfrac{b}{g}k,\ y=y_{0}-\dfrac{a}{g}k$ の形で示します。`,
    form: [R`ax + by = c`, R`x = x_{0} + \frac{b}{g}k,\quad y = y_{0} - \frac{a}{g}k\quad (k\text{ は整数})`],
    inputs: [
      { key: 'a', label: R`$a$`, type: 'int', def: '17', min: -100000, max: 100000, hint: '0 以外の整数（負でもよい）' },
      { key: 'b', label: R`$b$`, type: 'int', def: '5', min: -100000, max: 100000, hint: '0 以外の整数（負でもよい）' },
      { key: 'c', label: R`$c$`, type: 'int', def: '3', min: -1000000000, max: 1000000000 }
    ],
    examples: [
      { label: '17x + 5y = 3', v: { a: '17', b: '5', c: '3' } },
      { label: '正の整数解を求める（5x + 7y = 100）', v: { a: '5', b: '7', c: '100' } },
      { label: '係数に公約数あり（12x + 18y = 30）', v: { a: '12', b: '18', c: '30' } },
      { label: '解なし（6x + 9y = 10）', v: { a: '6', b: '9', c: '10' } },
      { label: '係数が負（7x - 5y = 3）', v: { a: '7', b: '-5', c: '3' } }
    ],
    intro: {
      easy: R`$ax+by=c$ のように、未知数が 2 つで式が 1 つの方程式は、答えが 1 組に決まらず、条件に合う整数の組が**たくさん（または 1 つもない）**あります。これを**1 次不定方程式**といい、ここでは整数の解 $(x,\ y)$ を求めます。
考え方は 3 ステップです。
① **解があるか**を調べる … $a$ と $b$ の最大公約数 $g$ が $c$ をわり切るなら解がある
② **1 組の解**を見つける … ユークリッドの互除法を逆にたどる
③ **すべての解**を式で表す … 1 組見つかれば、残りは「$x$ を $\dfrac{b}{g}$ ずつ、$y$ を $\dfrac{a}{g}$ ずつずらす」だけでよい`,
      normal: R`$g=\mathrm{gcd}(a,b)$ が $c$ の約数でなければ整数解なし。あれば両辺を $g$ でわって $a'x+b'y=c'$（$a',b'$ は互いに素）とし、互除法で $a's+b't=1$ を見つけて $x_{0}=c's,\ y_{0}=c't$。一般解は $x=x_{0}+b'k,\ y=y_{0}-a'k$。`,
      pro: R`係数が小さければ**見つけ打ち**（$x$ に $0,1,2,\dots$ を代入して $y$ が整数になるものを探す）が速い。「正の整数解の個数」は一般解を $x>0,\ y>0$ に代入して $k$ の範囲を求めます。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c;
      if (a === 0 || b === 0) throw CE('a, b は 0 以外の整数にしてください（0 だと 1 次不定方程式になりません）');
      const A = Math.abs(a), B = Math.abs(b), g = U.gcd(A, B);
      const eq = R`${a === 1 ? '' : (a === -1 ? '-' : nt(a))}x ${b < 0 ? '- ' : '+ '}${Math.abs(b) === 1 ? '' : nt(Math.abs(b))}y = ${nt(c)}`;
      const euc = euclidRows(Math.max(A, B), Math.min(A, B));
      const eucLines = euc.map((r) => R`${nt(r.x)} = ${nt(r.y)} \times ${nt(r.q)} + ${nt(r.r)}`);
      const steps = [];

      steps.push({
        t: '整数解があるかどうかの判定',
        m: [
          R`\text{方程式}:\quad ${eq}`,
          R`g = \mathrm{gcd}(${nt(A)},\,${nt(B)}) = ${nt(g)}`
        ],
        n: R`$ax+by$ は $a$ と $b$ の最大公約数 $g$ の**倍数**にしかなりません（$a,\,b$ がどちらも $g$ の倍数だから）。だから、**$c$ が $g$ の倍数でなければ整数解はありません**。倍数ならば必ず整数解があります。`,
        easy: R`たとえば $6x+9y=10$ を考えます。$6x$ も $9y$ も 3 の倍数なので、足した $6x+9y$ は**必ず 3 の倍数**になります。ところが右辺の $10$ は 3 の倍数ではないので、どんな整数 $x,\,y$ を入れても等号は成り立ちません。つまり**解なし**です。`,
        pro: R`存在条件は「$g\mid c$」の 1 行で判定できる。$g$ は互除法で求める。`
      });
      steps.push({
        t: R`最大公約数 $g$ を互除法で求める`,
        m: eucLines.concat([R`g = ${nt(g)}`]),
        n: c % g === 0
          ? R`$c=${nt(c)}$ は $g=${nt(g)}$ で割り切れる（$${nt(c)}=${nt(g)}\times ${nt(c / g)}$）ので、**整数解があります**。`
          : R`$c=${nt(c)}$ を $g=${nt(g)}$ でわると余りが出る（$${nt(c)}\div ${nt(g)}$ は割り切れない）ので、**整数解はありません**。`,
        easy: R`互除法でわり算をくり返し、最後に割り切れたときの割る数が最大公約数 $g$ です。その $g$ で $c$ がわり切れるかを確かめます。`,
        lv: 2
      });

      if (c % g !== 0) {
        return {
          result: [
            { label: '整数解', tex: R`\text{なし}` },
            { label: '最大公約数 g', tex: R`g = ${nt(g)}` },
            { label: 'c ÷ g', tex: R`${nt(c)} \div ${nt(g)}\ \text{は割り切れない}` }
          ],
          steps: steps.concat([{
            t: '結論',
            m: [R`${nt(g)} \nmid ${nt(c)}`.replace(/\\nmid/, R`\ \text{は}\ `) + R`\ \text{の約数ではない}`],
            n: R`$${nt(g)}$ は $${nt(c)}$ の約数ではないので、方程式 $${eq}$ を満たす整数 $x,\,y$ は**存在しません**。`
          }])
        };
      }

      const ap = a / g, bp = b / g, cp = c / g;                       // 両辺を g でわる
      const sa = a < 0 ? -1 : 1, sb = b < 0 ? -1 : 1, Ap = Math.abs(ap), Bp = Math.abs(bp);
      if (g > 1) {
        steps.push({
          t: R`両辺を $g$ でわる`,
          m: [R`${nt(a)}x ${sgn(b)}y = ${nt(c)} \;\Longrightarrow\; ${nt(ap)}x ${sgn(bp)}y = ${nt(cp)}`],
          n: R`$a,\,b,\,c$ をすべて $g=${nt(g)}$ でわっても同じ方程式です。$${nt(ap)}$ と $${nt(bp)}$ は互いに素になります。`,
          easy: R`係数に公約数があるときは、先に両辺をその数でわって簡単にします。たとえば $12x+18y=30$ は 6 でわると $2x+3y=5$ です。こうすると係数が互いに素になり、次の手順が使えます。`
        });
      }
      if (a < 0 || b < 0) {
        steps.push({
          t: '係数の符号をそろえる',
          m: [R`X = ${sa < 0 ? '-' : ''}x,\quad Y = ${sb < 0 ? '-' : ''}y\;\Longrightarrow\; ${nt(Ap)}X + ${nt(Bp)}Y = ${nt(cp)}`],
          n: R`負の係数は、$x$ や $y$ の符号を変えた新しい文字 $X,\,Y$ に置きかえて、係数を正にします。最後に符号をもどします。`,
          easy: R`たとえば $7x-5y=3$ は、$Y=-y$ とおくと $7x+5Y=3$ で、係数がすべて正になります。解を求めたあと、$y=-Y$ にもどします。`,
          lv: 2
        });
      }

      // ユークリッドの互除法（互いに素な Ap, Bp）と、逆にたどる計算
      const swapped = Ap < Bp, P = Math.max(Ap, Bp), Qn = Math.min(Ap, Bp);
      const rows = euclidRows(P, Qn);                                   // 最後の行の割る数が 1
      const backLines = [];
      let cx, cy;                                                       // 1 = cx * x_i + cy * y_i
      if (rows.length === 1) { cx = 0; cy = 1; backLines.push(R`1 = ${nt(Qn)}\qquad (${nt(P)} = ${nt(Qn)} \times ${nt(rows[0].q)} + 0\ \text{より})`); }
      else {
        const lastRow = rows[rows.length - 2];                          // 余りが 1 になる式
        backLines.push(R`1 = ${nt(lastRow.x)} - ${nt(lastRow.y)} \times ${nt(lastRow.q)}\qquad (${nt(lastRow.x)} = ${nt(lastRow.y)} \times ${nt(lastRow.q)} + 1\ \text{より})`);
        cx = 1; cy = -lastRow.q;
        for (let i = rows.length - 3; i >= 0; i--) {
          const rw = rows[i];                                           // rw: x_i = y_i q_i + r_i,  r_i は 1 つ前の式の「y」
          backLines.push(R`= ${linTerm(BigInt(cx), nt(rw.y))} + ${linTerm(BigInt(cy), '(' + nt(rw.x) + ' - ' + nt(rw.q) + ' \\times ' + nt(rw.y) + ')')}`);
          const ncx = cy, ncy = cx - cy * rw.q;
          cx = ncx; cy = ncy;
          backLines.push(R`= ${linTerm(BigInt(cx), nt(rw.x))} + ${linTerm(BigInt(cy), nt(rw.y))}`);
        }
      }
      // cx * P + cy * Qn = 1 → Ap * s + Bp * t = 1
      const s = swapped ? cy : cx, t = swapped ? cx : cy;
      if (Ap * s + Bp * t !== 1) throw CE('内部エラー: 互除法の逆算が一致しません');

      steps.push({
        t: '互除法を逆にたどる（特殊解を見つける）',
        m: (g > 1 ? [R`\text{互いに素な数での互除法}:\ ${nt(P)}\ \text{と}\ ${nt(Qn)}`] : []).concat(rows.map((r) => R`${nt(r.x)} = ${nt(r.y)} \times ${nt(r.q)} + ${nt(r.r)}`)).concat([R`\text{余りが } 1\text{ になる式から、逆にたどる}`]).concat(backLines).concat([
          R`\therefore\ ${nt(Ap)} \times ${par(s)} + ${nt(Bp)} \times ${par(t)} = 1`
        ]),
        n: R`互除法の式を「余り $=\ldots$」の形に直し、$1$ を $${nt(P)}$ と $${nt(Qn)}$ の 1 次式で表します。余りが $1$ になる式から出発して、順に前の式を代入していきます（**逆にたどる**）。結果として $${nt(Ap)}s+${nt(Bp)}t=1$ を満たす整数 $s,\,t$ が見つかります。`,
        easy: R`互除法は「大きい数を小さい数でわる」を重ねて、最後に余り $1$ を作る方法です。その過程を**逆向き**に書き直すと、$1$ を元の 2 数のかけ算と足し算で表せます。たとえば $17=5\times 3+2$、$5=2\times 2+1$ なら、$1=5-2\times 2=5-2\times(17-5\times 3)=7\times 5-2\times 17$ です。ここで見つかった「$1=\cdots$」の式の両辺を $c'$ 倍すると、右辺が $c'$ の方程式の解になります。`,
        pro: R`係数が小さければ、互除法を使わずに**目で見つける**方が速いこともあります（例: $17\times 1-5\times 3=2$ をうまく使うなど）。`
      });

      // 特殊解（元の方程式の解）
      const X0 = BigInt(s) * BigInt(cp), Y0 = BigInt(t) * BigInt(cp);
      const x0 = BigInt(sa) * X0, y0 = BigInt(sb) * Y0;
      const aB = BigInt(a), bB = BigInt(b), cB = BigInt(c);
      if (aB * x0 + bB * y0 !== cB) throw CE('内部エラー: 特殊解が方程式を満たしません');
      steps.push({
        t: '特殊解を求める',
        m: [
          R`${nt(Ap)} \times ${par(s)} + ${nt(Bp)} \times ${par(t)} = 1\ \text{の両辺を}\ ${par(cp)}\ \text{倍する}`,
          R`${nt(Ap)} \times ${par(BigInt(s) * BigInt(cp))} + ${nt(Bp)} \times ${par(BigInt(t) * BigInt(cp))} = ${nt(cp)}`
        ].concat(sa < 0 || sb < 0 ? [R`x = ${sa < 0 ? '-' : ''}X,\ y = ${sb < 0 ? '-' : ''}Y\ \text{にもどす}`] : []).concat([
          R`(x_{0},\ y_{0}) = (${nt(x0)},\ ${nt(y0)})`
        ]),
        n: R`両辺を $c'=${nt(cp)}$ 倍すると、$x=${nt(x0)},\ y=${nt(y0)}$ が元の方程式を満たす**特殊解**になります（確かめ: $${nt(a)}\times ${par(x0)}+${nt(b)}\times ${par(y0)}=${nt(aB * x0 + bB * y0)}$）。`,
        easy: R`方程式を満たす整数の組を 1 つだけ見つけたものが**特殊解**です。ここでは、$1$ をつくる式（$${nt(Ap)}s+${nt(Bp)}t=1$）の両辺を $c'$ 倍して作りました。右辺が方程式の $c$（を $g$ でわった $c'$）にちょうど一致します。`
      });

      // 一般解
      const xn = bmod(x0, BigInt(Bp)), kShift = (xn - x0) / BigInt(bp), yn = y0 - BigInt(ap) * kShift;
      const simple = xn !== x0;
      steps.push({
        t: '一般解を求める',
        m: [
          R`x = x_{0} + \frac{b}{g}k,\qquad y = y_{0} - \frac{a}{g}k`,
          R`x = ${nt(x0)} ${sgn(bp)}k,\qquad y = ${nt(y0)} ${sgn(-ap)}k\qquad (k\text{ は整数})`
        ],
        n: R`特殊解 $(x_{0},\,y_{0})$ から、$x$ を $\dfrac{b}{g}=${nt(bp)}$ ずつ、$y$ を $-\dfrac{a}{g}=${nt(-ap)}$ ずつ動かしたものがすべての整数解です。`,
        easy: R`1 組の解 $(x_{0},\,y_{0})$ が見つかれば、他の解は、「$x$ を $${nt(bp)}$ 増やすたびに、$y$ を $${nt(ap)}$ だけ減らす」ようにずらしたものです（$a\times${nt(bp)}$ と $b\times${nt(ap)}$ が打ち消し合うため、$ax+by$ が変わらない）。ずらす回数が整数 $k$ です。`,
        pro: R`なぜすべての解が尽くされるのか: $a(x-x_{0})=-b(y-y_{0})$ から $a'(x-x_{0})=-b'(y-y_{0})$。$a',\,b'$ が互いに素なので $x-x_{0}$ は $b'$ の倍数になる。`
      });
      if (simple) {
        steps.push({
          t: '見やすい形にする（$k$ をずらす）',
          m: [
            R`k \to k ${kShift < 0n ? '+' : '-'} ${(kShift < 0n ? -kShift : kShift)}\ \text{とおきかえる}`,
            R`x = ${kForm(xn, BigInt(bp))},\qquad y = ${kForm(yn, BigInt(-ap))}\qquad (k\text{ は整数})`
          ],
          n: R`$k$ は整数全体を動くので、$k$ を $k+(\text{整数})$ におきかえても解の集まりは同じです。$x$ の定数項が $0$ 以上で最小になるようにずらすと、簡単な形になります。`,
          easy: R`同じ解の集まりを、見た目がすっきりする形で書き直します。たとえば「$x=-6+5k$」と「$x=4+5k$」は、$k$ のとり方が違うだけで、どちらも $\cdots,-6,-1,4,9,\cdots$ という同じ数の並びです。`,
          lv: 2
        });
      }
      // 検算
      const chk = [0n, 1n, -1n].map((k) => {
        const xx = xn + BigInt(bp) * k, yy = yn - BigInt(ap) * k;
        return R`k = ${nt(k)}:\quad ${nt(a)} \times ${par(xx)} ${sgn(b)} \times ${par(yy)} = ${nt(aB * xx + bB * yy)}`;
      });
      steps.push({
        t: '検算',
        m: chk,
        n: R`$k=0,\,1,\,-1$ を代入して、どれも左辺が $${nt(c)}$ になることを確かめます。`,
        easy: R`求めた式に $k$ の値を代入して、実際に元の方程式の左辺を計算し、右辺 $${nt(c)}$ と一致するか確かめます。`,
        lv: 2
      });
      // 正の整数解
      let posText = null, posList = [];
      if (a > 0 && b > 0 && c > 0) {
        // x = xn + bp k > 0, y = yn - ap k > 0
        for (let k = -((Number(xn) / bp) | 0) - 2; ; k++) {
          const xx = xn + BigInt(bp) * BigInt(k), yy = yn - BigInt(ap) * BigInt(k);
          if (yy <= 0n) { if (xx > 0n) break; else if (k > 100000) break; else continue; }
          if (xx > 0n && yy > 0n) posList.push([xx, yy]);
          if (posList.length > 200) break;
        }
        // 範囲の端を確実に拾うため、k を広めに走査し直す
        posList = [];
        const kLo = Math.floor(-Number(xn) / bp) - 1, kHi = Math.ceil(Number(yn) / ap) + 1;
        for (let k = kLo; k <= kHi && posList.length <= 200; k++) {
          const xx = xn + BigInt(bp) * BigInt(k), yy = yn - BigInt(ap) * BigInt(k);
          if (xx > 0n && yy > 0n) posList.push([xx, yy]);
        }
        const shown = posList.slice(0, 8).map((p) => R`(${nt(p[0])},\ ${nt(p[1])})`).join(R`,\ `) + (posList.length > 8 ? R`,\ \cdots` : '');
        steps.push({
          t: '正の整数解',
          m: posList.length
            ? [R`x > 0,\ y > 0 \;\Longrightarrow\; ${nt(xn)} ${sgn(bp)}k > 0,\ \ ${nt(yn)} ${sgn(-ap)}k > 0`, R`\text{正の整数解}:\ ${shown}\qquad (${posList.length}\text{ 組})`]
            : [R`x > 0,\ y > 0 \;\Longrightarrow\; ${nt(xn)} ${sgn(bp)}k > 0,\ \ ${nt(yn)} ${sgn(-ap)}k > 0`, R`\text{これを満たす整数 } k \text{ は存在しない}`],
          n: posList.length
            ? R`一般解を $x>0,\ y>0$ に代入して、$k$ の範囲を求めます。その範囲の整数 $k$ を 1 つずつ代入すると、正の整数解の組がすべて出ます。`
            : R`$x>0$ かつ $y>0$ を満たす整数 $k$ がないので、正の整数解はありません。`,
          easy: R`問題文で「正の整数解」とあるときは、一般解の $x,\,y$ が両方とも $0$ より大きくなる $k$ を探します。不等式を $k$ について解くと範囲が出ます。`,
          pro: R`「正の整数解の個数」は、一般解を $x>0,\ y>0$ に代入して得られる $k$ の範囲に入る整数の個数。範囲の端（等号の有無）に注意します。`,
          lv: 2
        });
        posText = posList.length ? posList.map((p) => R`(${nt(p[0])},\ ${nt(p[1])})`).join(R`,\ `) : R`\text{なし}`;
      }

      // 図: 直線と格子点
      const pts = [];
      for (let k = -2; k <= 2; k++) pts.push({ x: Number(xn) + bp * k, y: Number(yn) - ap * k });
      const xmin = Math.min.apply(null, pts.map((p) => p.x)), xmax = Math.max.apply(null, pts.map((p) => p.x));
      const padx = Math.abs(bp) / 2 || 1;
      const fig = JK.plot.graph({
        w: 340, h: 260, x: [xmin - padx, xmax + padx],
        curves: [{ f: (x) => (c - a * x) / b, cls: 'c1' }],
        points: pts.map((p, i) => ({ x: p.x, y: p.y, cls: i === 2 ? 'c3' : 'c2', label: '(' + U.fmt(p.x) + ', ' + U.fmt(p.y) + ')', pos: i % 2 ? 'bl' : 'tr' })),
        axis: ['x', 'y']
      });

      const res = [
        { label: '整数解の存在', tex: R`\mathrm{gcd}(${nt(A)},\,${nt(B)}) = ${nt(g)}\ \text{は}\ ${nt(c)}\ \text{の約数}\ \Rightarrow\ \text{解あり}` },
        { label: '特殊解', tex: R`(x,\ y) = (${nt(xn)},\ ${nt(yn)})` },
        { label: '一般解（x）', tex: R`x = ${kForm(xn, BigInt(bp))}` },
        { label: '一般解（y）', tex: R`y = ${kForm(yn, BigInt(-ap))}` }
      ];
      if (posText !== null) res.push({ label: '正の整数解', tex: posText });
      return { result: res, steps: steps, fig: fig };
    }
  });

  /* ================= ia-base: n 進法 ================= */

  const DIGITS = '0123456789ABCDEF';

  JK.registerCalc({
    id: 'ia-base',
    course: 'IA',
    unit: 'm-int',
    group: '整数の性質',
    title: 'n 進法の変換',
    desc: R`10 進法の整数を $n$ 進法（2〜16 進法）に、または $n$ 進法の数を 10 進法に直します。割り算の余りを下から読む過程、位取りの展開を示します。`,
    form: [R`N = a_{k}n^{k} + \cdots + a_{1}n + a_{0}\ \Longleftrightarrow\ N = \left(a_{k}\cdots a_{1}a_{0}\right)_{(n)}`],
    inputs: [
      { key: 'mode', label: '変換の向き', type: 'select', def: 'to', options: [['to', '10 進法 → n 進法'], ['from', 'n 進法 → 10 進法']] },
      { key: 'n', label: R`$n$（何進法か）`, type: 'int', def: '2', min: 2, max: 16, hint: '2〜16' },
      { key: 'N', label: R`10 進法の整数`, type: 'int', def: '100', min: 0, max: 1000000000, show: (raw) => raw.mode !== 'from', hint: '0 以上 10 億以下' },
      { key: 's', label: R`$n$ 進法の数`, type: 'text', def: '1101', show: (raw) => raw.mode === 'from', hint: '数字だけを書きます。11 以上の数字は A=10, B=11, …, F=15' }
    ],
    examples: [
      { label: '100 を 2 進法に', v: { mode: 'to', n: '2', N: '100' } },
      { label: '255 を 16 進法に', v: { mode: 'to', n: '16', N: '255' } },
      { label: '2 進法 1101 を 10 進法に', v: { mode: 'from', n: '2', s: '1101' } },
      { label: '3 進法 2102 を 10 進法に', v: { mode: 'from', n: '3', s: '2102' } },
      { label: '16 進法 3F を 10 進法に', v: { mode: 'from', n: '16', s: '3F' } }
    ],
    intro: {
      easy: R`ふだん使っている 10 進法は、**10 ごとに位が上がる**数の表し方です。たとえば $345=3\times 100+4\times 10+5\times 1$ のように、位ごとに 1, 10, 100 の何個分かを数えます。
**$n$ 進法**は、**$n$ ごとに位が上がる**表し方です。たとえば 2 進法では、位の大きさが $1,\ 2,\ 4,\ 8,\ 16,\dots$ になり、使う数字は 0 と 1 だけです。$n$ 進法で書いた数は、$\left(1101\right)_{(2)}$ のように右下に $(n)$ をつけて区別します。
・**10 進法 → $n$ 進法**: $n$ でわり算をくり返し、余りを**下から**読みます。
・**$n$ 進法 → 10 進法**: 位の大きさ（$n$ のべき乗）を掛けて足します。`,
      normal: R`$N=a_{k}n^{k}+\cdots+a_{1}n+a_{0}$（$0\le a_{i}<n$）のとき $N=(a_{k}\cdots a_{1}a_{0})_{(n)}$。10 進 → $n$ 進は $n$ で割った余りを下から並べる、$n$ 進 → 10 進は位取りの展開です。`,
      pro: R`2 進 ↔ 8 進・16 進は 3 桁・4 桁ごとにまとめれば暗算できます。「$n$ 進法で 3 桁の数」は $n^{2}\le N<n^{3}$ で範囲が決まる、という使い方も頻出です。`
    },
    compute(v) {
      const n = v.n;
      const steps = [];
      if (v.mode === 'from') {
        const raw = String(v.s).replace(/[\s_,]/g, '').toUpperCase();
        if (!raw) throw CE('n 進法の数を入力してください');
        if (raw.length > 30) throw CE('桁数は 30 桁以内にしてください');
        const ds = raw.split('').map((ch) => {
          const k = DIGITS.indexOf(ch);
          if (k < 0 || k >= n) throw CE(n + ' 進法で使える数字は 0〜' + DIGITS.charAt(n - 1) + ' です（「' + ch + '」は使えません）');
          return k;
        });
        const L = ds.length;
        const pows = ds.map((d, i) => BigInt(n) ** BigInt(L - 1 - i));
        const terms = ds.map((d, i) => BigInt(d) * pows[i]);
        const value = terms.reduce((s, x) => s + x, 0n);
        const hasLetter = ds.some((d) => d >= 10);
        const numTex = R`\mathrm{${raw}}_{(${n})}`;
        steps.push({
          t: '位取りの考え方',
          m: [R`\left(a_{k}\cdots a_{1}a_{0}\right)_{(${n})} = a_{k} \times ${n}^{k} + \cdots + a_{1} \times ${n} + a_{0}`],
          n: R`$${n}$ 進法では、右から順に $${n}^{0}=1$、$${n}^{1}=${n}$、$${n}^{2}=${n * n}$、… の位です。各位の数字に位の大きさをかけて足すと、10 進法の値になります。`,
          easy: R`10 進法の $345$ は $3\times 100+4\times 10+5\times 1$ と書けます。$${n}$ 進法も同じで、位の大きさが $1,\ ${n},\ ${n}^{2},\ \dots$ になるだけです。たとえば $\left(${raw}\right)_{(${n})}$ なら、右端が $1$ の位、その左が $${n}$ の位、…と数えます。`
        });
        if (hasLetter) {
          steps.push({
            t: '16 進法などで使う文字',
            m: [R`\mathrm{A}=10,\ \mathrm{B}=11,\ \mathrm{C}=12,\ \mathrm{D}=13,\ \mathrm{E}=14,\ \mathrm{F}=15`],
            n: R`10 以上の数字は 1 文字で表せないので、アルファベットで代用します。今回の数字をおきかえると $${ds.map((d) => d).join(',\\ ')}$ です。`,
            easy: R`16 進法では、1 つの位に 0 から 15 まで入ります。10 以上は 2 桁になってしまうので、A（10）から F（15）の文字を使うきまりです。`,
            lv: 3
          });
        }
        steps.push({
          t: '位取りの展開',
          m: [
            R`${numTex} = ${ds.map((d, i) => `${d} \\times ${pw(n, L - 1 - i)}`).join(' + ')}`,
            R`= ${ds.map((d, i) => `${d} \\times ${nt(pows[i])}`).join(' + ')}`
          ],
          n: R`各位の数字に、その位の大きさ（$${n}$ の累乗）をかけます。`,
          easy: R`左から順に、「その位の数字 × 位の大きさ」を書き並べます。位の大きさは、右端が $${n}^{0}=1$、その左が $${n}^{1}=${n}$、…と、左へ行くほど $${n}$ 倍になります。`
        });
        steps.push({
          t: '計算して 10 進法の値を求める',
          m: [
            R`= ${terms.map(nt).join(' + ')}`,
            R`= ${bt(value)}`
          ],
          n: R`$${numTex} = ${bt(value)}$（10 進法）です。`,
          pro: R`大きな数のときは**ホーナー法**（$((a_{k}n+a_{k-1})n+\cdots)n+a_{0}$）が速く、暗算でも楽です。`
        });
        // 検算: 10 進 → n 進へもどす
        const back = []; let cur = value;
        while (cur > 0n) { back.push({ x: cur, q: cur / BigInt(n), r: Number(cur % BigInt(n)) }); cur /= BigInt(n); }
        const backStr = back.length ? back.map((b) => DIGITS.charAt(b.r)).reverse().join('') : '0';
        steps.push({
          t: '検算（n 進法にもどす）',
          m: back.slice(0, 12).map((b) => R`${bt(b.x)} = ${n} \times ${bt(b.q)} + ${b.r}`).concat(back.length > 12 ? [R`\cdots`] : []).concat([R`\text{余りを下から読む}\ \Rightarrow\ ${backStr}_{(${n})}`]),
          n: backStr === raw.replace(/^0+(?=.)/, '') ? R`もとの数 $${raw}$ にもどりました。` : R`もとの数にもどりません。`,
          easy: R`求めた 10 進法の値を、こんどは $${n}$ でわり算して $${n}$ 進法にもどし、最初の数と同じになるか確かめます。`,
          lv: 2
        });
        const head = ['位', ...ds.map((d, i) => supText(String(n), L - 1 - i)), '合計'];
        const fig = tableSvg(head, [['位の大きさ', ...pows.map((p) => p.toString()), ''], ['数字', ...ds.map((d) => DIGITS.charAt(d)), '']], ['数字 × 位', ...terms.map((x) => x.toString()), value.toString()]);
        return {
          result: [
            { label: n + ' 進法の数', tex: numTex },
            { label: '10 進法に直すと', tex: R`${numTex} = ${bt(value)}` },
            { label: '位の数', tex: R`${L}\ \text{桁}` }
          ],
          steps: steps,
          fig: fig
        };
      }
      // 10 進法 → n 進法
      const N = v.N;
      const rows = []; let cur = N;
      while (cur > 0) { rows.push({ x: cur, q: Math.floor(cur / n), r: cur % n }); cur = Math.floor(cur / n); }
      const digs = rows.map((r) => DIGITS.charAt(r.r)).reverse().join('') || '0';
      const resTex = R`\mathrm{${digs}}_{(${n})}`;
      steps.push({
        t: 'n 進法とは',
        m: [R`N = a_{k}n^{k} + \cdots + a_{1}n + a_{0}\ \Longrightarrow\ N = \left(a_{k}\cdots a_{1}a_{0}\right)_{(n)}`],
        n: R`$${n}$ 進法では、$${n}$ のべき乗の位ごとに $0$ 〜 $${n - 1}$ の数字で表します。10 進法の整数を $${n}$ 進法に直すには、**$${n}$ でわった余りを下から読みます**。`,
        easy: R`10 進法は「10 個で 1 つ位が上がる」数え方、$${n}$ 進法は「$${n}$ 個で 1 つ位が上がる」数え方です。たとえば 2 進法の $\left(101\right)_{(2)}$ は「4 が 1 個、2 が 0 個、1 が 1 個」で、10 進法の 5 を表します。`,
        lv: 2
      });
      if (N === 0) {
        steps.push({ t: '値を求める', m: [R`0 = \left(0\right)_{(${n})}`], n: R`$0$ は何進法でも $0$ です。` });
      } else {
        steps.push({
          t: R`$${n}$ でわり算をくり返す（商が $0$ になるまで）`,
          m: rows.map((r) => R`${nt(r.x)} = ${n} \times ${nt(r.q)} + ${r.r}`),
          n: R`$${nt(N)}$ を $${n}$ でわった商と余りを求め、**商**をさらに $${n}$ でわります。商が $0$ になるまでくり返します。`,
          easy: R`「$${n}$ でわって、余りをメモし、商をまた $${n}$ でわる」をくり返します。商が $0$ になったらおしまいです。最初に出た余りが 1 の位、2 回目の余りが $${n}$ の位、…を表しています。`,
          pro: R`余りの代わりに、$${n}$ のべき乗（$${n}^{k}$）の大きい方から引いていく方法でも求まる。`
        });
        steps.push({
          t: 'なぜ余りを下から読むのか',
          m: [R`N = ${n}q_{1} + r_{0},\quad q_{1} = ${n}q_{2} + r_{1},\ \dots`, R`N = ${n}^{2}q_{2} + ${n}r_{1} + r_{0} = \cdots = r_{k}\,${n}^{k} + \cdots + r_{1}\,${n} + r_{0}`],
          n: R`1 回目の余り $r_{0}$ は 1 の位の数字、2 回目の余り $r_{1}$ は $${n}$ の位の数字、…です。最後に出た余りが最上位の数字になるので、**下から上へ**読みます。`,
          easy: R`わり算を式にして代入していくと、$N=r_{k}\times${n}^{k}+\cdots+r_{1}\times${n}+r_{0}$ の形になります。これがまさに $${n}$ 進法の位取りの展開で、$r_{0}$（最初の余り）が右端の数字です。だから最後の余りが左端（先頭）になります。`,
          lv: 3
        });
        steps.push({
          t: '余りを下から読む',
          m: [R`\text{余りを下から並べると}\quad ${rows.map((r) => r.r).reverse().join(',\\ ')}` + (digs.length === rows.length && rows.some((r) => r.r >= 10) ? R`\ \Rightarrow\ ${digs}` : ''), R`${nt(N)} = ${resTex}`],
          n: rows.some((r) => r.r >= 10) ? R`10 以上の余りは A=10, B=11, …, F=15 の文字で書きます。` : R`${n} 進法の数 $${resTex}$ になりました。`,
          easy: R`最後のわり算の余りから順に、下から上へ並べると、$${n}$ 進法の数になります。`
        });
        const exp = rows.map((r, i) => ({ d: r.r, e: i })).reverse();
        const vals = exp.map((x) => BigInt(x.d) * BigInt(n) ** BigInt(x.e));
        steps.push({
          t: '検算（位取りの展開）',
          m: [
            R`${resTex} = ${exp.map((x) => `${x.d} \\times ${pw(n, x.e)}`).join(' + ')}`,
            R`= ${vals.map(bt).join(' + ')} = ${bt(vals.reduce((s, x) => s + x, 0n))}`
          ],
          n: vals.reduce((s, x) => s + x, 0n) === BigInt(N) ? R`もとの $${nt(N)}$ にもどりました。` : R`もとの数にもどりません。`,
          easy: R`求めた $${n}$ 進法の数を、位取りの展開で 10 進法にもどして、最初の数と同じになるか確かめます。`,
          lv: 2
        });
      }
      return {
        result: [
          { label: n + ' 進法で表すと', tex: R`${nt(N)} = ${resTex}` },
          { label: '桁数', tex: R`${digs.length}\ \text{桁}` }
        ],
        steps: steps,
        fig: N > 0 ? ladderSvg(rows.map((r) => ({ div: String(n), num: String(r.x), rem: String(DIGITS.charAt(r.r)) })).concat([{ num: '0' }]), 'あまりを下から上へ読む', true) : undefined
      };
    }
  });

  /* ================= ia-mod: 余りの計算（合同式） ================= */

  function powMod(a, e, m) {                  // BigInt
    let r = 1n % m, b = a % m;
    while (e > 0n) { if (e & 1n) r = r * b % m; b = b * b % m; e >>= 1n; }
    return r;
  }

  function stripSvg(terms, j, L, idx, a) {
    const per = 12, cw = 26, W = Math.max(260, per * cw + 30), rows = Math.ceil(terms.length / per), H = 36 + rows * 54 + 8;
    const d = JK.plot.draw(W, H);
    d.text(W / 2, 14, a + ' のべき乗を m でわった余り（上段: 指数 k、下段: 余り）', { size: 11 });
    terms.forEach((r, i) => {
      const k = i + 1, row = Math.floor(i / per), col = i % per;
      const x = 15 + col * cw, y = 26 + row * 54;
      const inCycle = k >= j && k < L;
      const hit = idx != null && k === idx;
      d.rect(x, y + 14, cw - 2, 26, { cls: hit ? 'c3' : (inCycle ? 'c1' : 'dim'), fill: hit ? 'f3' : (inCycle ? 'f1' : 'f0'), rx: 3, w: hit ? 2 : 1.2 });
      d.text(x + (cw - 2) / 2, y + 10, String(k), { size: 10, cls: 'dim' });
      d.text(x + (cw - 2) / 2, y + 32, String(r), { size: 12, bold: true });
    });
    return d.svg();
  }

  JK.registerCalc({
    id: 'ia-mod',
    course: 'IA',
    unit: 'm-int',
    group: '整数の性質',
    title: '余りの計算（合同式）',
    desc: R`$a^{n}$ を $m$ でわった余りを、余りの周期を見つける方法（周期が長いときは反復 2 乗法）で求めます。`,
    form: [R`a \equiv b\ (\text{mod } m)\ \Longleftrightarrow\ a-b\ \text{が}\ m\ \text{の倍数}`, R`a^{n}\ \text{を}\ m\ \text{でわった余り}`],
    inputs: [
      { key: 'a', label: R`底 $a$`, type: 'int', def: '3', min: -1000000000, max: 1000000000 },
      { key: 'n', label: R`指数 $n$`, type: 'int', def: '100', min: 1, max: 1000000000000 },
      { key: 'm', label: R`わる数 $m$`, type: 'int', def: '7', min: 2, max: 1000 }
    ],
    examples: [
      { label: '3^100 を 7 でわる', v: { a: '3', n: '100', m: '7' } },
      { label: '2^100 を 5 でわる', v: { a: '2', n: '100', m: '5' } },
      { label: '7^2024 の下 2 桁（m = 100）', v: { a: '7', n: '2024', m: '100' } },
      { label: '負の底（-2）', v: { a: '-2', n: '99', m: '9' } },
      { label: '周期が長い（2^1000 を 101 で）', v: { a: '2', n: '1000', m: '101' } }
    ],
    intro: {
      easy: R`たとえば $3^{100}$ のような巨大な数を $7$ でわった余りを、計算機なしで求めたいときがあります。そこで、**$3^{1},\,3^{2},\,3^{3},\dots$ を 7 でわった余りを順に書いていく**と、不思議なことに余りが**同じパターンをくり返す**ことに気づきます（3, 2, 6, 4, 5, 1, 3, 2, 6, …）。このくり返し（**周期**）を見つければ、100 乗の余りも、周期を使って簡単に分かります。
$a-b$ が $m$ の倍数であることを $a\equiv b\ (\text{mod } m)$（**合同**）と書きます。「$m$ でわった余りが等しい」と同じ意味です。`,
      normal: R`$a^{k}$ を $m$ でわった余りを順に求め、余りが前に出た値にもどったところから周期とします。$a^{n}$ の余りは、$n$ を周期でわった余りで決まります（互いに素のとき $a^{p}\equiv 1$）。周期が長いときは反復 2 乗法です。`,
      pro: R`$m$ が素数で $a$ と互いに素なら、フェルマーの小定理 $a^{m-1}\equiv 1$ が周期の上限（約数）を与える。合同式は和・差・積・累乗で両辺に同じ操作ができる（割り算は注意）。`
    },
    compute(v) {
      const a = v.a, n = v.n, m = v.m;
      const a0 = ((a % m) + m) % m;
      const base = a < 0 ? R`\left(${nt(a)}\right)` : nt(a);
      const modTex = R`\ (\text{mod } ${m})`;
      // 余りの列 r_1, r_2, ... を最初に繰り返すまで
      const seq = [], first = {};
      let r = 1 % m, L = 0, j = 0;
      for (let k = 1; k <= m + 1; k++) {
        r = (r * a0) % m;
        if (first[r] !== undefined) { L = k; j = first[r]; break; }
        first[r] = k;
        seq.push(r);
      }
      const p = L - j;
      const ans = Number(powMod(BigInt(a0), BigInt(n), BigInt(m)));
      const steps = [];

      steps.push({
        t: '合同式とは',
        m: [R`a \equiv b\ (\text{mod } m)\ \Longleftrightarrow\ a - b\ \text{は}\ m\ \text{の倍数}`, R`\text{例}:\ 17 \equiv 2\ (\text{mod } 5)\quad (17-2=15=5\times 3)`],
        n: R`$a$ と $b$ を $m$ でわった余りが等しいとき、$a\equiv b\ (\text{mod } m)$ と書きます。合同式では、足し算・引き算・かけ算・累乗を、余りに置きかえたまま計算できます。`,
        easy: R`時計を例にします。時計は 12 時間で 1 周するので、15 時は 3 時と同じです（$15\equiv 3$ mod 12）。「$m$ でわった余りだけを気にする」考え方が合同式です。かけ算も、先に余りにしてから行って構いません（たとえば $7\times 8$ の下 1 桁は、$7\times 8=56$ から 6、つまり「10 でわった余り」だけを追う）。`,
        lv: 3
      });
      if (a0 !== a) {
        steps.push({
          t: R`底 $a$ を $m$ でわった余りにおきかえる`,
          m: [R`${nt(a)} \equiv ${a0}${modTex}`, R`\therefore\ ${base}^{k} \equiv ${a0}^{k}${modTex}`],
          n: R`$${nt(a)}$ を $${m}$ でわった余りは $${a0}$ なので、$${nt(a)}^{k}\equiv ${a0}^{k}$ としてかまいません。以後は余り $${a0}$ で計算します。`,
          easy: R`大きな（または負の）底は、先に $${m}$ でわった余り $${a0}$ におきかえると計算が小さくなります。負の数でも、$-1\equiv ${m - 1}$（$-1$ と $${m - 1}$ の差が $${m}$ の倍数）のように 0 以上の余りにそろえます。`
        });
      }
      if (L <= 40) {
        const lines = seq.map((rv, i) => {
          const k = i + 1;
          if (k === 1) return R`${base}^{1} \equiv ${rv}${modTex}`;
          const prod = seq[i - 1] * a0;
          return R`${base}^{${k}} \equiv ${seq[i - 1]} \times ${a0} = ${prod}` + (prod === rv ? '' : R` \equiv ${rv}`) + modTex;
        });
        const prodL = seq[seq.length - 1] * a0;
        lines.push(R`${base}^{${L}} \equiv ${seq[seq.length - 1]} \times ${a0} = ${prodL}` + (prodL === seq[j - 1] ? '' : R` \equiv ${seq[j - 1]}`) + modTex + R`\quad (= ${base}^{${j}}\ \text{と同じ余り})`);
        steps.push({
          t: R`$${base}^{k}$ を $${m}$ でわった余りを順に求める`,
          m: lines,
          n: R`$${base}^{k}$ の余りは、前の余りに $${a0}$ をかけて $${m}$ でわった余りです（$a^{k}=a^{k-1}\times a$）。同じ余りが現れたら、その先は同じパターンのくり返しになります。`,
          easy: R`いきなり巨大な数を計算せず、「**前の余り × ${a0} をして、$${m}$ でわった余り**」だけを順に追います。たとえば次の余りは、前の余りを $${a0}$ 倍して、$${m}$ 以上なら $${m}$ でわった余りにするだけです。こうすると、数がいつも $${m}$ より小さいままで済みます。`,
          pro: R`余りの列は $a^{k}$ の周期性そのもの。$a$ と $m$ が互いに素なら、最初にもどるのは $1$（$a^{p}\equiv 1$）。`
        });
        steps.push({
          t: '周期をつかむ',
          m: [
            R`\text{余りの列}:\ ${seq.map(String).join(R`,\ `)},\ \underline{${seq[j - 1]}}\ \cdots`,
            j === 1 ? R`\text{周期}\ p = ${p}\ \ (k = 1 \text{ から } ${p} \text{ 個ずつくり返す})` : R`\text{周期}\ p = ${p}\ \ (k \ge ${j}\ \text{から}\ ${p}\ \text{個ずつくり返す})`
          ],
          n: j === 1
            ? R`$${base}^{${L}}$ の余りが $${base}^{1}$ の余り $${seq[0]}$ と一致したので、$${p}$ 個の余り $${seq.slice(0, p).join(',\\ ')}$ をくり返します。`
            : R`$${base}^{${L}}$ の余りが $${base}^{${j}}$ の余りと一致したので、$k\ge ${j}$ では $${p}$ 個の余り $${seq.slice(j - 1).join(',\\ ')}$ をくり返します（最初の $${j - 1}$ 個は周期に入りません）。`,
          easy: R`余りの列に、すでに出てきた値がもう一度現れたら、そこからは**まったく同じ並びがくり返される**ので、計算をやめてよいのです（次の余りは今の余りだけで決まるから）。くり返しの 1 まわり分の長さが**周期**です。`
        });
        let sExpl;
        if (n < L) {
          sExpl = R`$n=${nt(n)}$ は $${L}$ より小さいので、余りの列から $k=${nt(n)}$ の値を直接読みます。`;
        } else {
          sExpl = R`$k\ge ${j}$ では周期 $${p}$ でくり返すので、$(n-${j})$ を $${p}$ でわった余りから、対応する位置が決まります。`;
        }
        const idx = n < L ? n : j + ((n - j) % p);
        steps.push({
          t: R`指数 $n=${nt(n)}$ を周期で処理する`,
          m: n < L
            ? [R`n = ${nt(n)} < ${L}\ \Rightarrow\ ${base}^{${nt(n)}} \equiv ${ans}${modTex}`]
            : [
              R`n - ${j} = ${nt(n - j)} = ${p} \times ${nt(Math.floor((n - j) / p))} + ${(n - j) % p}`,
              R`\therefore\ ${base}^{${nt(n)}} \equiv ${base}^{${j + ((n - j) % p)}} \equiv ${ans}${modTex}`
            ],
          n: sExpl,
          easy: n < L ? R`指数がまだ周期の途中なので、順に求めた余りの列からそのまま読めます。` : R`たとえば周期が 6 で、100 乗なら、$100$ を 6 でわった余りが 4 なので、$a^{100}$ の余りは $a^{4}$ の余りと同じです（6 個で 1 まわりして元にもどるから）。${j === 1 ? R`ここでは、$k=1$ から数えているので $(n-1)$ を周期でわった余りに $1$ を足した位置を使います。` : ''}`,
          pro: j === 1 && seq[p - 1] === 1 % m
            ? R`この場合 $a^{${p}}\equiv 1$ なので、$a^{n}=(a^{${p}})^{q}a^{s}\equiv a^{s}$（$n=${p}q+s$）と書けます。**周期で割った余り**だけを見ればよいのです。`
            : R`周期に入る前の項（${j - 1} 個）があるときは、その分だけずらして考えます。`
        });
        steps.push({
          t: '結論',
          m: [R`${base}^{${nt(n)}} \equiv ${ans}${modTex}`],
          n: R`$${base}^{${nt(n)}}$ を $${m}$ でわった余りは $${ans}$ です。`,
          easy: R`巨大な $${base}^{${nt(n)}}$ を実際に計算しなくても、余りが $${ans}$ だと分かりました。`
        });
        return {
          result: [
            { label: R`余り`.replace(/\\/g, ''), tex: R`${base}^{${nt(n)}} \equiv ${ans}${modTex}` },
            { label: '周期', tex: R`p = ${p}` + (j > 1 ? R`\ (k \ge ${j})` : '') },
            { label: '余りの列', tex: seq.join(R`,\ `) + R`,\ \cdots` }
          ],
          steps: steps,
          fig: stripSvg(seq, j, L, idx <= seq.length ? idx : null, a)
        };
      }
      // 周期が長いとき: 反復 2 乗法
      const bits = n.toString(2).split('').reverse().map(Number), top = bits.length - 1;
      const sq = [a0 % m];
      for (let i = 1; i <= top; i++) sq.push((sq[i - 1] * sq[i - 1]) % m);
      const used = []; bits.forEach((bt2, i) => { if (bt2) used.push(i); });
      steps.push({
        t: '周期が長いので、2 乗をくり返す方法（反復 2 乗法）を使う',
        m: [R`${nt(n)} = ${used.slice().reverse().map((i) => `2^{${i}}`).join(' + ')}`, R`${base}^{${nt(n)}} = ${used.slice().reverse().map((i) => `${base}^{${nt(Math.pow(2, i))}}`).join(R` \times `)}`],
        n: R`余りの列は長く（周期が $${p}$ 以上）、書き出すのは大変です。指数 $n$ を 2 の累乗の和（2 進法）に分け、$a^{1},\,a^{2},\,a^{4},\,a^{8},\dots$ の余りを「2 乗してはわる」をくり返して求めます。`,
        easy: R`たとえば $a^{13}=a^{8}\times a^{4}\times a^{1}$（$13=8+4+1$）のように、指数を 2 のべき乗に分けると、必要な $a^{1},a^{2},a^{4},a^{8}$ は「直前の値を 2 乗する」だけで求まります。2 乗のたびに $${m}$ でわった余りにすれば、数が小さいままです。`,
        pro: R`この方法は $\log_{2}n$ 回の計算で済み、$n$ が巨大でも使える（暗号の計算にも使われる）。`
      });
      steps.push({
        t: R`$a^{2^{i}}$ の余りを順に求める`,
        m: sq.map((rv, i) => (i === 0
          ? R`${base}^{1} \equiv ${rv}${modTex}`
          : R`${base}^{${nt(Math.pow(2, i))}} \equiv (${base}^{${nt(Math.pow(2, i - 1))}})^{2} \equiv ${sq[i - 1]}^{2} = ${sq[i - 1] * sq[i - 1]}` + (sq[i - 1] * sq[i - 1] === rv ? '' : R` \equiv ${rv}`) + modTex)),
        n: R`直前の余りを 2 乗して $${m}$ でわった余りを、$a^{2^{i}}$ の余りとします。`,
        easy: R`$a^{2}$ の余り → それを 2 乗して $a^{4}$ の余り → それを 2 乗して $a^{8}$ の余り、と順に進みます。余りを 2 乗するだけなので、数が大きくなりません。`
      });
      let acc = 1;
      const mulLines = [];
      used.slice().reverse().forEach((i, t2) => {
        const nx = (acc * sq[i]) % m;
        mulLines.push(t2 === 0 ? R`${sq[i]}` : R`${acc} \times ${sq[i]} = ${acc * sq[i]}` + (acc * sq[i] === nx ? '' : R` \equiv ${nx}`));
        acc = nx;
      });
      steps.push({
        t: '必要な余りをかけ合わせる',
        m: [R`${base}^{${nt(n)}} \equiv ` + used.slice().reverse().map((i) => sq[i]).join(R` \times `) + modTex].concat(mulLines.slice(1).length ? mulLines.slice(1).map((s2) => '= ' + s2) : []).concat([R`\therefore\ ${base}^{${nt(n)}} \equiv ${ans}${modTex}`]),
        n: R`2 進法の各桁で $1$ になっている項の余りをかけ、そのたびに $${m}$ でわった余りにします。最終的な余りは $${ans}$ です。`,
        easy: R`必要な項だけを選んでかけ合わせます。ここでも 1 回かけるごとに $${m}$ でわった余りにして、数を小さく保ちます。`
      });
      return {
        result: [
          { label: '余り', tex: R`${base}^{${nt(n)}} \equiv ${ans}${modTex}` },
          { label: '周期', tex: R`p = ${p}` + (j > 1 ? R`\ (k \ge ${j})` : '') }
        ],
        steps: steps
      };
    }
  });
})();
