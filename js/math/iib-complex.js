/* 数II・B — 複素数と方程式: 複素数の四則 / 2次方程式の複素数解 / 剰余の定理・因数定理 / 3次方程式の解と係数の関係
   構成は ia-quad.js に準拠（intro → result → steps(easy / pro / lv) → fig）。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;
  const MINUS = '−';

  /* ---------- 共通ヘルパ ---------- */

  // 底 q の k 乗（負数・分数は括弧で包む）
  function pw(q, k) {
    const base = (q.isInt() && q.sign() >= 0) ? q.tex() : R`\left(` + q.tex() + R`\right)`;
    return base + '^{' + k + '}';
  }
  function par(t) { return /\\frac|\\sqrt/.test(t) ? R`\left(` + t + R`\right)` : '(' + t + ')'; }
  const ptex = (p) => P.tex(p, 'x');
  // 一次結合 Σ c·s（係数 0 は省略、±1 は符号だけ。s が空なら定数項）
  function lc(terms) {
    let out = '';
    terms.forEach((t) => {
      const c = t[0], s = t[1];
      if (c.isZero()) return;
      const neg = c.sign() < 0, ab = c.abs();
      const body = s === '' ? ab.tex() : (ab.eq(1) ? '' : ab.tex()) + s;
      out += out === '' ? (neg ? '-' : '') + body : (neg ? ' - ' : ' + ') + body;
    });
    return out === '' ? '0' : out;
  }
  // 複素数 re + im·i の TeX
  function cx(re, im) { return lc([[re, ''], [im, 'i']]); }
  // 数の列を符号つきで連結
  function sumTex(list) {
    let out = '';
    list.forEach((q, i) => { out += i === 0 ? q.tex() : ' ' + U.signed(q); });
    return out;
  }
  // x - r の TeX
  function shiftTex(r) {
    if (r.isZero()) return 'x';
    return r.sign() > 0 ? 'x - ' + r.tex() : 'x + ' + r.neg().tex();
  }
  // 根号を含むときだけ近似値を付ける
  function withApprox(tex, val, d) {
    return /\\sqrt/.test(tex) ? tex + R` \approx ` + U.fmt(val, d == null ? 4 : d) : tex;
  }
  // Q の配列を整数にそろえる: k·(元の係数) = ints（gcd = 1・最初の非零が正）
  function intScale(list) {
    let L = 1;
    list.forEach((q) => { L = U.lcm(L, q.d); });
    let ints = list.map((q) => q.n * (L / q.d));
    const g = ints.reduce((s, x) => U.gcd(s, x), 0) || 1;
    ints = ints.map((x) => x / g);
    let k = L / g;
    const lead = ints.find((x) => x !== 0);
    if (lead < 0) { ints = ints.map((x) => -x); k = -k; }
    return { ints: ints, k: k };
  }

  /* ---------- 2次方程式 Ax^2 + Bx + C = 0（整数係数・A > 0）の解 ---------- */
  function quadSolve(A, B, C) {
    const D = B * B - 4 * A * C;
    if (D === 0) return { kind: 'double', D: D, x: Q(-B, 2 * A) };
    const imag = D < 0, s = U.sqrtSimplify(Math.abs(D));
    if (!imag && s.in === 1) return { kind: 'rat', D: D, s: s, x1: Q(-B + s.out, 2 * A), x2: Q(-B - s.out, 2 * A) };
    const g = U.gcd(U.gcd(Math.abs(B), s.out), 2 * A) || 1;
    return { kind: imag ? 'imag' : 'irr', D: D, s: s, imag: imag, B0: -B, out0: s.out, den0: 2 * A, B1: -B / g, out1: s.out / g, den1: 2 * A / g, g: g };
  }
  // out√in（imag なら i 付き）の TeX
  function radTex(out, inn, imag) {
    return (out === 1 && (inn > 1 || imag) ? '' : String(out)) + (inn > 1 ? '\\sqrt{' + inn + '}' : '') + (imag ? (inn > 1 ? '\\,i' : 'i') : '');
  }
  // (B ± out√in)/den の TeX。which = 'pm' | 'plus' | 'minus'
  function surdTex(B, out, inn, imag, den, which) {
    const rad = radTex(out, inn, imag);
    const op = which === 'pm' ? R`\pm ` : (which === 'plus' ? '+ ' : '- ');
    let num;
    if (B === 0) num = (which === 'plus' ? '' : (which === 'pm' ? R`\pm ` : '-')) + rad;
    else num = B + ' ' + op + rad;
    return den === 1 ? num : R`\frac{` + num + '}{' + den + '}';
  }
  // 解の値（複素数）: kind ごとに [ {re, im} ... ]
  function quadValues(sol) {
    if (sol.kind === 'double') return [{ re: sol.x.val(), im: 0 }, { re: sol.x.val(), im: 0 }];
    if (sol.kind === 'rat') return [{ re: sol.x1.val(), im: 0 }, { re: sol.x2.val(), im: 0 }];
    const r = sol.B1 / sol.den1, m = sol.out1 * Math.sqrt(sol.s.in) / sol.den1;
    return sol.imag ? [{ re: r, im: m }, { re: r, im: -m }] : [{ re: r + m, im: 0 }, { re: r - m, im: 0 }];
  }
  // 解の表示（± まとめ）
  function quadSolTex(sol) {
    if (sol.kind === 'double') return sol.x.tex();
    if (sol.kind === 'rat') return sol.x2.tex() + R`,\ ` + sol.x1.tex();          // x2 < x1（小さい順）
    return surdTex(sol.B1, sol.out1, sol.s.in, sol.imag, sol.den1, 'pm');
  }

  /* ---------- 数値解（Durand–Kerner 法）: 図と「有理数解なし」の近似表示用 ---------- */
  function numRoots(coefsAsc) {
    const n = coefsAsc.length - 1;
    if (n < 1) return [];
    const a = coefsAsc.map((c) => c / coefsAsc[n]);
    const cmul = (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
    const csub = (x, y) => [x[0] - y[0], x[1] - y[1]];
    const cdiv = (x, y) => { const d = y[0] * y[0] + y[1] * y[1] || 1e-300; return [(x[0] * y[0] + x[1] * y[1]) / d, (x[1] * y[0] - x[0] * y[1]) / d]; };
    const pev = (z) => { let r = [1, 0]; for (let i = n - 1; i >= 0; i--) r = [r[0] * z[0] - r[1] * z[1] + a[i], r[0] * z[1] + r[1] * z[0]]; return r; };
    const z = [];
    let w = [1, 0];
    for (let i = 0; i < n; i++) { z.push(w); w = cmul(w, [0.4, 0.9]); }
    for (let it = 0; it < 800; it++) {
      let delta = 0;
      for (let i = 0; i < n; i++) {
        let den = [1, 0];
        for (let j = 0; j < n; j++) if (j !== i) den = cmul(den, csub(z[i], z[j]));
        const dz = cdiv(pev(z[i]), den);
        z[i] = csub(z[i], dz);
        delta = Math.max(delta, Math.hypot(dz[0], dz[1]));
      }
      if (delta < 1e-13) break;
    }
    return z.map((c) => ({ re: Math.abs(c[0]) < 1e-9 ? 0 : c[0], im: Math.abs(c[1]) < 1e-7 ? 0 : c[1] }));
  }
  function numRootTex(z) {
    if (z.im === 0) return U.fmt(z.re, 4);
    const imv = U.fmt(Math.abs(z.im), 4);
    const im = (imv === '1' ? '' : imv) + 'i';
    if (Math.abs(z.re) < 1e-9) return (z.im < 0 ? '-' : '') + im;
    return U.fmt(z.re, 4) + (z.im < 0 ? ' - ' : ' + ') + im;
  }

  /* ---------- 代入計算 P(c) の途中式 ---------- */
  function substLine(p, c) {
    let out = '';
    for (let k = p.length - 1; k >= 0; k--) {
      const co = p[k];
      if (co.isZero()) continue;
      const neg = co.sign() < 0, ab = co.abs();
      const power = k === 0 ? '' : (k === 1 ? U.paren(c) : pw(c, k));
      const body = k === 0 ? ab.tex() : (ab.eq(1) ? '' : ab.tex() + R` \cdot `) + power;
      out += out === '' ? (neg ? '-' : '') + body : (neg ? ' - ' : ' + ') + body;
    }
    return out || '0';
  }
  function termValues(p, c) {
    const vals = [];
    for (let k = p.length - 1; k >= 0; k--) if (!p[k].isZero()) vals.push(p[k].mul(c.pow(k)));
    return vals;
  }
  // P(c) = （代入）= （各項の値）= 結果 の 3 行
  function evalLines(p, c, name) {
    name = name || 'P';
    const head = name + '(' + c.tex() + ') = ';
    const vals = termValues(p, c), total = P.eval(p, c);
    return [head + substLine(p, c), '= ' + sumTex(vals.length ? vals : [Q(0)]), '= ' + total.tex()];
  }

  /* ---------- 組立除法（x - r で割る）---------- */
  function synth(p, r) {
    const d = P.deg(p);
    const co = [];
    for (let k = d; k >= 0; k--) co.push(p[k]);                 // 降べき
    const sums = [co[0]], prods = [null];
    for (let i = 1; i < co.length; i++) {
      const pr = sums[i - 1].mul(r);
      prods.push(pr);
      sums.push(co[i].add(pr));
    }
    const rem = sums[sums.length - 1];
    const quot = sums.slice(0, sums.length - 1).reverse();       // 昇べき
    return { co: co, prods: prods, sums: sums, rem: rem, quot: P.of(quot.length ? quot : [Q(0)]) };
  }
  const qs = (q) => q.toString().replace('-', MINUS);
  function synthFig(r, sy) {
    const n = sy.co.length;
    let maxLen = 2;
    sy.co.forEach((c) => { maxLen = Math.max(maxLen, qs(c).length); });
    sy.prods.forEach((c) => { if (c) maxLen = Math.max(maxLen, qs(c).length); });
    sy.sums.forEach((c) => { maxLen = Math.max(maxLen, qs(c).length); });
    maxLen = Math.max(maxLen, qs(r).length);
    const cw = Math.max(40, Math.min(66, maxLen * 8 + 14));
    const W = Math.round(16 + cw * (n + 1) + 10), H = 134;
    if (W > 440) return null;
    const d = JK.plot.draw(W, H);
    const x = (i) => 10 + cw * (i + 0.5);                          // i = 0 が r の列
    const y1 = 38, y2 = 72, y3 = 112;
    d.text(W / 2, 14, '組立除法（x − a で割る）', { size: 11, cls: 'dim' });
    d.rect(x(n) - cw / 2 + 3, y3 - 16, cw - 6, 22, { cls: 'c3', fill: 'f3', rx: 6 });
    d.line(10 + cw, y1 - 18, 10 + cw, y3 + 8, { cls: 'fg', w: 1.4 });
    d.line(10 + cw, y2 + 12, 10 + cw * (n + 1), y2 + 12, { cls: 'fg', w: 1.4 });
    d.text(x(0), y1, qs(r), { size: 13, bold: true });
    for (let i = 0; i < n; i++) {
      d.text(x(i + 1), y1, qs(sy.co[i]), { size: 13 });
      if (i > 0) d.text(x(i + 1), y2, qs(sy.prods[i]), { size: 12, cls: 'dim' });
      d.text(x(i + 1), y3, qs(sy.sums[i]), { size: 13, bold: i === n - 1 });
      if (i < n - 1) d.arrow(x(i + 1) + 7, y3 - 18, x(i + 2) - 7, y2 + 3, { cls: 'c3', w: 1 });
    }
    return d.svg();
  }
  // 数のグラフ用ガード
  function bigGuard(ints, limit) {
    if (ints.some((c) => Math.abs(c) > limit)) throw new JK.CalcError('係数が大きすぎます（整数にそろえたとき絶対値 ' + limit + ' 以下の式にしてください）');
  }

  /* ================= 複素数の四則 ================= */

  // (A+Bi)(C+Di) の展開の途中式（数値）
  function mulLines(A, B, C, D) {
    const ac = A.mul(C), ad = A.mul(D), bc = B.mul(C), bd = B.mul(D);
    const re = ac.sub(bd), im = ad.add(bc);
    return {
      lines: [
        R`(` + cx(A, B) + R`)(` + cx(C, D) + ') = ' + lc([[ac, ''], [ad, 'i'], [bc, 'i'], [bd, 'i^{2}']]),
        '= ' + lc([[ac, ''], [ad, 'i'], [bc, 'i'], [bd.neg(), '']]) + R`\quad (i^{2} = -1)`,
        '= ' + cx(re, im)
      ],
      re: re, im: im
    };
  }

  function argandFig(a, b, c, d) {
    const av = a.val(), bv = b.val(), cv = c.val(), dv = d.val();
    const xs = [0, av, cv, av + cv], ys = [0, bv, dv, bv + dv, -bv];
    const lo = (arr) => Math.min.apply(null, arr), hi = (arr) => Math.max.apply(null, arr);
    const padx = Math.max(1, (hi(xs) - lo(xs)) * 0.18), pady = Math.max(1, (hi(ys) - lo(ys)) * 0.18);
    return JK.plot.graph({
      w: 340, h: 300, equal: true, axis: ['実部', '虚部'],
      x: [Math.min(lo(xs) - padx, -0.5), Math.max(hi(xs) + padx, 0.5)],
      y: [Math.min(lo(ys) - pady, -0.5), Math.max(hi(ys) + pady, 0.5)],
      segs: [
        { x1: av, y1: bv, x2: av + cv, y2: bv + dv, cls: 'c2', dash: true },
        { x1: cv, y1: dv, x2: av + cv, y2: bv + dv, cls: 'c1', dash: true },
        { x1: av, y1: bv, x2: av, y2: -bv, cls: 'dim', dash: true },
        { x1: 0, y1: 0, x2: av, y2: bv, cls: 'c1', arrow: true, label: 'z₁' },
        { x1: 0, y1: 0, x2: cv, y2: dv, cls: 'c2', arrow: true, label: 'z₂' },
        { x1: 0, y1: 0, x2: av + cv, y2: bv + dv, cls: 'c3', arrow: true, label: 'z₁+z₂' }
      ],
      points: [{ x: av, y: -bv, cls: 'c4', label: 'z₁の共役', pos: (Math.abs(cv) < 1.6 && Math.abs(-bv - (bv + dv)) < 1 && cv > 0) ? 'bl' : 'br' }]
    });
  }

  JK.registerCalc({
    id: 'iib-complex-arith',
    course: 'IIB',
    unit: 'm-complex',
    group: '複素数と方程式',
    title: '複素数の四則・共役・絶対値',
    desc: R`2 つの複素数 $z_{1} = a+bi,\ z_{2} = c+di$ の和・差・積・商と、共役複素数・絶対値を、途中式つきで計算します。`,
    form: [R`(a+bi)(c+di) = (ac-bd) + (ad+bc)i`, R`\frac{a+bi}{c+di} = \frac{(a+bi)(c-di)}{(c+di)(c-di)} = \frac{(ac+bd) + (bc-ad)i}{c^{2}+d^{2}}`],
    inputs: [
      { key: 'a', label: R`$a$（$z_{1}$ の実部）`, type: 'q', def: '3' },
      { key: 'b', label: R`$b$（$z_{1}$ の虚部）`, type: 'q', def: '2' },
      { key: 'c', label: R`$c$（$z_{2}$ の実部）`, type: 'q', def: '1' },
      { key: 'd', label: R`$d$（$z_{2}$ の虚部）`, type: 'q', def: '-4' }
    ],
    examples: [
      { label: '(3+2i), (1−4i)', v: { a: '3', b: '2', c: '1', d: '-4' } },
      { label: '(2−i)/(1+i)', v: { a: '2', b: '-1', c: '1', d: '1' } },
      { label: '分数を含む', v: { a: '1/2', b: '3', c: '-2', d: '1/3' } },
      { label: '実数との計算', v: { a: '5', b: '0', c: '0', d: '2' } }
    ],
    intro: {
      easy: R`2 乗すると $-1$ になる数を新しく考え、**虚数単位** $i$ と名づけます（$i^{2} = -1$）。$a + bi$（$a,\ b$ は実数）の形の数を**複素数**といい、$a$ を**実部**、$b$ を**虚部**といいます。
計算のルールは簡単で、**$i$ を文字 $x$ のように扱って計算し、$i^{2}$ が出てきたら $-1$ に置き換える**だけです。割り算は、分母の $i$ を消すために「分母の**共役複素数**（虚部の符号を変えた数）」を分母・分子に掛けます。これは $\dfrac{1}{\sqrt{2}}$ の分母を有理化するのと同じ考え方です。`,
      normal: R`和・差は実部どうし・虚部どうし。積は展開して $i^{2} = -1$。商は分母の共役を掛けて分母を実数にします。共役 $\overline{z}$ は虚部の符号を変えたもので、$z\overline{z} = |z|^{2}$ です。`,
      pro: R`$(a+bi)(a-bi) = a^{2}+b^{2}$ が頂点です。割り算は「分母の共役を掛ける」を機械的に。$|z_{1}z_{2}| = |z_{1}||z_{2}|$、$\overline{z_{1}z_{2}} = \overline{z_{1}}\,\overline{z_{2}}$ などの性質は検算に使えます。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c, d = v.d;
      if (c.isZero() && d.isZero()) throw new JK.CalcError('z₂ = c + di が 0 のとき、割り算 z₁ ÷ z₂ は定義されません。c, d の少なくとも一方を 0 以外にしてください');
      const z1 = cx(a, b), z2 = cx(c, d);
      const sum = [a.add(c), b.add(d)], dif = [a.sub(c), b.sub(d)];
      const mul = mulLines(a, b, c, d);
      const den = c.mul(c).add(d.mul(d));
      const mc = mulLines(a, b, c, d.neg());           // 分子: (a+bi)(c-di)
      const qre = mc.re.div(den), qim = mc.im.div(den);
      const abs1 = a.mul(a).add(b.mul(b)), abs2 = c.mul(c).add(d.mul(d));
      const a1t = U.sqrtTex(abs1), a2t = U.sqrtTex(abs2);

      const steps = [
        {
          t: R`虚数単位 $i$ と複素数`,
          m: [R`i^{2} = -1`, R`z = a + bi \quad (a,\ b \text{ は実数})`],
          n: R`$a$ を実部、$b$ を虚部といいます。計算では $i$ を文字のように扱い、$i^{2}$ を $-1$ に置き換えます。`,
          easy: R`実数の範囲では「2 乗して $-1$ になる数」はありません。そこで、そのような数を $i$ と決めた、と考えます。$z = 3 + 2i$ なら、実部は 3、虚部は 2 です。数直線は 1 本ですが、複素数は「実部」と「虚部」の 2 つの数で決まるので、座標平面上の点 $(3,\ 2)$ のように表せます（右の図）。`
        },
        {
          t: '和・差: 実部どうし、虚部どうしを計算',
          m: [
            R`z_{1} + z_{2} = (` + z1 + R`) + (` + z2 + ') = (' + a.tex() + ' ' + U.signed(c) + ') + (' + b.tex() + ' ' + U.signed(d) + R`)i = ` + cx(sum[0], sum[1]),
            R`z_{1} - z_{2} = (` + z1 + R`) - (` + z2 + ') = (' + a.tex() + ' - ' + U.paren(c) + ') + (' + b.tex() + ' - ' + U.paren(d) + R`)i = ` + cx(dif[0], dif[1])
          ],
          n: R`$(a+bi) \pm (c+di) = (a \pm c) + (b \pm d)i$。引き算では、引く数の符号に注意します。`,
          easy: R`$i$ を $x$ と同じ文字と考えると、「$2x + 3x = 5x$」と同じ計算です。実部は実部どうし、$i$ のついた虚部は虚部どうしで足し引きします。図では、ベクトルを足すように平行四辺形の対角線が和になります。`
        },
        {
          t: '積: 展開して $i^{2} = -1$ を使う',
          m: [R`(a+bi)(c+di) = ac + adi + bci + bdi^{2} = (ac - bd) + (ad + bc)i`].concat(mul.lines),
          n: R`分配法則で 4 つの項に展開し、$i^{2}$ を $-1$ に置き換えてから、実部と虚部にまとめます。`,
          easy: R`$(x+2)(x+3)$ を展開するときと同じで、すべての組み合わせを掛けます。違うのは、$i \times i = i^{2}$ が出てきたら $-1$ に直すことだけです。`,
          lv: 1
        },
        {
          t: R`分母の共役複素数 $\overline{z_{2}} = c - di$ を求める`,
          m: [R`\overline{c + di} = c - di`, R`\overline{z_{2}} = ` + cx(c, d.neg())],
          n: R`共役複素数は、虚部の符号だけを変えた数です。`,
          easy: R`共役は、座標平面で「実軸（横軸）について反対側に折り返した点」にあたります。$c + di$ と $c - di$ を掛けると、$i$ が消えて実数になるのが共役のすごいところです。`,
          lv: 2
        },
        {
          t: '分母を実数にする',
          m: [
            R`(c+di)(c-di) = c^{2} - (di)^{2} = c^{2} + d^{2}`,
            R`(` + z2 + R`)(` + cx(c, d.neg()) + ') = ' + pw(c, 2) + ' + ' + pw(d, 2) + ' = ' + den.tex()
          ],
          n: R`$(p+q)(p-q) = p^{2} - q^{2}$ の形です。$(di)^{2} = d^{2}i^{2} = -d^{2}$ なので、$c^{2} + d^{2}$ という実数になります。`,
          easy: R`$\sqrt{2}$ を含む分母 $\dfrac{1}{1+\sqrt{2}}$ を有理化するとき、$(1+\sqrt{2})(1-\sqrt{2}) = 1 - 2$ を使いました。それと同じ「和と差の積」の公式です。$i^{2} = -1$ なので、符号が $+$ になって実数 $c^{2}+d^{2}$ が残ります。`
        },
        {
          t: '商: 分子にも共役を掛ける',
          m: [
            R`\frac{z_{1}}{z_{2}} = \frac{(` + z1 + R`)(` + cx(c, d.neg()) + R`)}{(` + z2 + R`)(` + cx(c, d.neg()) + R`)}`
          ].concat(mc.lines.map((l, i) => i === 0 ? R`\text{分子: } ` + l : l)).concat([
            R`\frac{z_{1}}{z_{2}} = \frac{` + cx(mc.re, mc.im) + '}{' + den.tex() + '} = ' + cx(qre, qim)
          ]),
          n: R`分母と分子の両方に $\overline{z_{2}}$ を掛けます（値は変わりません）。分母は実数 $c^{2}+d^{2} = ` + den.tex() + R`$ になり、分子を展開して実部と虚部に分けます。`,
          easy: R`分数は「分母と分子に同じ数を掛けても値が変わらない」ので、分母が実数になるような数（分母の共役）を掛けます。分母が実数になれば、分子を実部と虚部に分けて、それぞれ分母で割るだけです。`,
          pro: R`商は $\dfrac{(ac+bd) + (bc-ad)i}{c^{2}+d^{2}}$ と結果を覚えておくと速いですが、途中の式は毎回自分で作れるようにしておきます。`
        },
        {
          t: '共役複素数と絶対値',
          m: [
            R`\overline{z_{1}} = ` + cx(a, b.neg()) + R`,\quad \overline{z_{2}} = ` + cx(c, d.neg()),
            R`|z_{1}| = \sqrt{a^{2} + b^{2}} = \sqrt{` + pw(a, 2) + ' + ' + pw(b, 2) + '} = ' + (a1t === R`\sqrt{` + abs1.tex() + '}' ? '' : R`\sqrt{` + abs1.tex() + '} = ') + withApprox(a1t, Math.sqrt(abs1.val())),
            R`|z_{2}| = \sqrt{c^{2} + d^{2}} = \sqrt{` + pw(c, 2) + ' + ' + pw(d, 2) + '} = ' + (a2t === R`\sqrt{` + abs2.tex() + '}' ? '' : R`\sqrt{` + abs2.tex() + '} = ') + withApprox(a2t, Math.sqrt(abs2.val())),
            R`z_{1}\overline{z_{1}} = a^{2} + b^{2} = ` + abs1.tex() + R` = |z_{1}|^{2}`
          ],
          n: R`絶対値 $|a+bi| = \sqrt{a^{2}+b^{2}}$ は、原点から点 $(a,\ b)$ までの距離です。$z\overline{z} = |z|^{2}$ は実数になります。`,
          easy: R`絶対値は「原点からの距離」で、座標平面で $(a,\ b)$ に直角三角形をつくれば**三平方の定理**そのものです（横 $a$、縦 $b$ なら斜辺 $\sqrt{a^{2}+b^{2}}$）。また $z$ と共役 $\overline{z}$ の積 $a^{2}+b^{2}$ は、絶対値の 2 乗になります。`,
          lv: 2
        }
      ];

      return {
        result: [
          { label: '和 z₁ + z₂', tex: cx(sum[0], sum[1]) },
          { label: '差 z₁ − z₂', tex: cx(dif[0], dif[1]) },
          { label: '積 z₁ z₂', tex: cx(mul.re, mul.im) },
          { label: '商 z₁ ÷ z₂', tex: cx(qre, qim) },
          { label: '共役と絶対値（z₁）', tex: R`\overline{z_{1}} = ` + cx(a, b.neg()) + R`,\quad |z_{1}| = ` + withApprox(a1t, Math.sqrt(abs1.val())) }
        ],
        steps: steps,
        fig: argandFig(a, b, c, d)
      };
    }
  });

  /* ================= 2次方程式の複素数解 ================= */

  function parabolaFig(a, b, c, vals) {
    const av = a.val(), bv = b.val(), cv = c.val();
    const x0 = -bv / (2 * av), y0 = av * x0 * x0 + bv * x0 + cv;
    const reals = vals.filter((z) => z.im === 0).map((z) => z.re);
    const lo = Math.min.apply(null, reals.concat([x0])) - 2, hi = Math.max.apply(null, reals.concat([x0])) + 2;
    const mid = (lo + hi) / 2, half = Math.max(3, (hi - lo) / 2);
    const fn = (x) => av * x * x + bv * x + cv;
    const o = {
      w: 340, h: 250, x: [mid - half, mid + half],
      curves: [{ f: fn, cls: 'c1' }],
      vlines: [{ x: x0 }],
      points: [{ x: x0, y: y0, label: '頂点(' + U.fmt(x0, 3) + ', ' + U.fmt(y0, 3) + ')', cls: 'c3', pos: av > 0 ? 'br' : 'tr' }]
    };
    const uniq = [];
    reals.forEach((r) => { if (!uniq.some((u) => Math.abs(u - r) < 1e-9)) uniq.push(r); });
    uniq.forEach((r, i) => o.points.push({ x: r, y: 0, label: 'x=' + U.fmt(r, 3), cls: 'c2', pos: i % 2 ? 'tr' : 'tl' }));
    return JK.plot.graph(o);
  }

  JK.registerCalc({
    id: 'iib-quad-complex',
    course: 'IIB',
    unit: 'm-complex',
    group: '複素数と方程式',
    title: '2次方程式の解（虚数解）と解と係数の関係',
    desc: R`2 次方程式 $ax^{2}+bx+c = 0$ を判別式で分類して解き、虚数解は $\sqrt{-k} = \sqrt{k}\,i$ で表します。解と係数の関係と、$\alpha^{2}+\beta^{2}$ などの対称式の値も求めます。`,
    form: [R`D = b^{2} - 4ac`, R`x = \frac{-b \pm \sqrt{D}}{2a}`, R`\alpha + \beta = -\frac{b}{a},\quad \alpha\beta = \frac{c}{a}`],
    inputs: [
      { key: 'a', label: R`$a$`, type: 'q', def: '1' },
      { key: 'b', label: R`$b$`, type: 'q', def: '2' },
      { key: 'c', label: R`$c$`, type: 'q', def: '4' }
    ],
    examples: [
      { label: '虚数解', v: { a: '1', b: '2', c: '4' } },
      { label: '実数解（無理数）', v: { a: '1', b: '-3', c: '1' } },
      { label: '重解', v: { a: '4', b: '-4', c: '1' } },
      { label: '係数が分数', v: { a: '1/2', b: '3', c: '-1' } },
      { label: '純虚数解', v: { a: '1', b: '0', c: '9' } }
    ],
    intro: {
      easy: R`2 次方程式の解の公式 $x = \dfrac{-b \pm \sqrt{b^{2}-4ac}}{2a}$ の根号の中身 $D = b^{2}-4ac$（**判別式**）が負になると、実数の範囲では $\sqrt{D}$ が作れず「解なし」でした。そこで $i^{2} = -1$ となる**虚数単位** $i$ を使い、$\sqrt{-k} = \sqrt{k}\,i$（$k>0$）と決めると、解が複素数として書けます（**虚数解**）。
グラフでいうと、$y = ax^{2}+bx+c$ が $x$ 軸と交わる点が実数解です。$D > 0$ なら 2 点で交わり、$D = 0$ なら 1 点で接し（重解）、$D < 0$ なら交わらず、そのかわりに虚数解（$p \pm qi$ の形の 2 つの解）をもちます。`,
      normal: R`判別式 $D$ の符号で解の種類が決まります。$D<0$ のとき $\sqrt{D} = \sqrt{-D}\,i$ として解の公式を使います。2 解 $\alpha,\ \beta$ は $\alpha+\beta = -\dfrac{b}{a},\ \alpha\beta = \dfrac{c}{a}$ を満たし、対称式はこの 2 つで表せます。`,
      pro: R`虚数解は互いに共役（$p \pm qi$）。$\alpha^{2}+\beta^{2} = (\alpha+\beta)^{2} - 2\alpha\beta$、$\alpha^{3}+\beta^{3} = (\alpha+\beta)^{3} - 3\alpha\beta(\alpha+\beta)$ は解を求めずに値を出す定石です。$D = a^{2}(\alpha-\beta)^{2}$ という関係も押さえておきます。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c;
      if (a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（a = 0 だと 2 次方程式になりません）');
      const sc = intScale([a, b, c]);
      const A = sc.ints[0], B = sc.ints[1], C = sc.ints[2];
      if (Math.max(Math.abs(A), Math.abs(B), Math.abs(C)) > 1e7) throw new JK.CalcError('係数が大きすぎます（整数にそろえたとき 1000 万以下にしてください）');
      const qA = Q(A), qB = Q(B), qC = Q(C), kq = Q(sc.k);
      const scaled = !(sc.k === 1);
      const sol = quadSolve(A, B, C), D = sol.D, vals = quadValues(sol);
      const sSum = qB.neg().div(qA), sProd = qC.div(qA);      // α+β, αβ
      const p2 = sSum.mul(sSum).sub(sProd.mul(2));              // α²+β²
      const p3 = sSum.mul(sSum).mul(sSum).sub(sProd.mul(sSum).mul(3));   // α³+β³
      const diff2 = sSum.mul(sSum).sub(sProd.mul(4));           // (α-β)²
      const kindName = D > 0 ? (sol.kind === 'rat' ? '異なる 2 つの実数解（有理数）' : '異なる 2 つの実数解') : (D === 0 ? '重解（実数）' : '異なる 2 つの虚数解（互いに共役）');
      const eqTex = ptex([qC, qB, qA]) + ' = 0';

      const steps = [
        {
          t: R`虚数単位 $i$ と $\sqrt{-k}$`,
          m: [R`i^{2} = -1`, R`\sqrt{-k} = \sqrt{k}\,i \quad (k > 0)`, R`\text{例: } \sqrt{-9} = 3i,\quad \sqrt{-12} = 2\sqrt{3}\,i`],
          n: R`負の数の平方根は、$i$ を使って $\sqrt{-k} = \sqrt{k}\,i$ と表します。`,
          easy: R`実数の範囲では、2 乗して負になる数はありません。そこで「2 乗すると $-1$ になる数」を $i$ と決めます。すると $(\sqrt{k}\,i)^{2} = k \cdot i^{2} = -k$ なので、$\sqrt{k}\,i$ は「2 乗して $-k$ になる数」、つまり $\sqrt{-k}$ と書けます。`,
          lv: 2
        }
      ];
      if (scaled) {
        steps.push({
          t: '整数係数にそろえる',
          m: [R`\left(` + ptex([c, b, a]) + R`\right) \times ` + U.paren(kq) + R` \;\Rightarrow\; ` + eqTex],
          n: R`係数が分数や、共通の約数をもつ・最高次の係数が負のときは、両辺に ` + kq.tex() + R` を掛けて整数係数（$a > 0$）にそろえると、あとの計算が楽になります（解は変わりません）。以降は $a = ` + A + R`,\ b = ` + B + R`,\ c = ` + C + R`$ として計算します。`,
          easy: R`方程式は、両辺に同じ（0 でない）数を掛けても解は変わりません。分数の分母を払うとき（両辺を最小公倍数倍にするとき）と同じです。`
        });
      }
      steps.push({
        t: R`判別式 $D = b^{2} - 4ac$ を求める`,
        m: [R`D = b^{2} - 4ac`, R`D = ` + pw(qB, 2) + R` - 4 \cdot ` + U.paren(qA) + R` \cdot ` + U.paren(qC) + ' = ' + D],
        n: R`$D > 0$ なら異なる 2 つの実数解、$D = 0$ なら重解、$D < 0$ なら異なる 2 つの虚数解です。ここでは $D = ` + D + R`$ なので、**` + kindName + R`**です。`,
        easy: R`$D$ は解の公式の $\sqrt{\ }$ の中身です。中身が正なら平方根が普通に取れて「$+$」と「$-$」で 2 つの解、0 なら $\pm$ が意味を失って解が 1 つ（重解）、負なら実数の範囲では平方根が取れないので、$i$ を使った虚数の解になります。グラフでは、$D>0$ は放物線が $x$ 軸と 2 点で交わる、$D=0$ は接する、$D<0$ は交わらない場合です。`,
        pro: R`$D$ の符号の判定だけなら $b^{2} - 4ac$、$b$ が偶数なら $\dfrac{D}{4} = b'^{2} - ac$（$b = 2b'$）が楽です。`
      });
      steps.push({
        t: '解の公式に代入する',
        m: [
          R`x = \frac{-b \pm \sqrt{D}}{2a}`,
          R`x = \frac{-` + U.paren(qB) + R` \pm \sqrt{` + D + R`}}{2 \cdot ` + U.paren(qA) + '}'
        ],
        n: R`$a = ` + A + R`,\ b = ` + B + R`,\ D = ` + D + R`$ を代入します。$b$ が負のとき $-b$ の符号に注意します。`,
        easy: R`解の公式は「方程式 $ax^{2}+bx+c=0$ の答えを $a,\ b,\ c$ だけで書いた式」です。右辺の $a,\ b$ と、さっき求めた $D$ をそのまま入れるだけです。`
      });
      if (sol.kind !== 'double') {
        const s = sol.s;
        const sqrtLine = sol.kind === 'imag'
          ? R`\sqrt{` + D + R`} = \sqrt{` + (-D) + R`}\,i = ` + radTex(s.out, s.in, true)
          : (sol.kind === 'rat' ? R`\sqrt{` + D + '} = ' + s.out : R`\sqrt{` + D + '} = ' + radTex(s.out, s.in, false));
        steps.push({
          t: R`$\sqrt{D}$ を簡単にする`,
          m: [sqrtLine],
          n: sol.kind === 'imag'
            ? R`$D$ が負なので、$\sqrt{-k} = \sqrt{k}\,i$ を使います。さらに $\sqrt{` + (-D) + R`}$ の中から平方数を外に出します。`
            : (sol.kind === 'rat' ? R`$D = ` + D + R`$ は平方数なので、根号が外れて整数になります。` : R`$\sqrt{` + D + R`}$ の中の平方数を外に出して簡単にします。`),
          easy: sol.kind === 'imag'
            ? R`ふつうの平方根と同じように、根号の中から平方数（$4,\ 9,\ 16$ など）を外に出して簡単にします。ここで、負の数の平方根は「$\sqrt{\text{正の数}}$ に $i$ を付ける」だけです。`
            : R`根号の中を素因数に分けて、$2$ 個ずつ組になっているものを外に出します（例: $\sqrt{12} = \sqrt{2^{2} \cdot 3} = 2\sqrt{3}$）。`,
          lv: 2
        });
      }
      if (sol.kind === 'double') {
        steps.push({
          t: '重解を求める',
          m: [R`x = \frac{-b}{2a} = \frac{-` + U.paren(qB) + R`}{2 \cdot ` + U.paren(qA) + '} = ' + sol.x.tex()],
          n: R`$D = 0$ なので $\pm\sqrt{D}$ が 0 になり、解は 1 つだけ（**重解**）です。`,
          easy: R`$D = 0$ だと「$+0$」と「$-0$」が同じになるので、2 つの解が重なって 1 つになります。グラフでは放物線が $x$ 軸にちょうど接する点です。`
        });
      } else if (sol.kind === 'rat') {
        steps.push({
          t: '約分して解を求める',
          m: [
            R`x = \frac{` + (-B) + ' + ' + sol.s.out + '}{' + 2 * A + '} = ' + sol.x1.tex(),
            R`x = \frac{` + (-B) + ' - ' + sol.s.out + '}{' + 2 * A + '} = ' + sol.x2.tex()
          ],
          n: R`$\pm$ の $+$ と $-$ をそれぞれ計算し、約分します。$D$ が平方数なので解はどちらも有理数です。`,
          easy: R`$\pm$ は「$+$ の場合と $-$ の場合の 2 通り」という意味です。分子を別々に計算して、分母で割って約分します。`
        });
      } else {
        const rd = surdTex(sol.B0, sol.out0, sol.s.in, sol.imag, sol.den0, 'pm');
        const lines = [R`x = ` + rd];
        if (sol.g > 1) lines.push(R`x = ` + surdTex(sol.B1, sol.out1, sol.s.in, sol.imag, sol.den1, 'pm') + R`\quad (\text{分子・分母を } ` + sol.g + R` \text{ で約分})`);
        steps.push({
          t: '約分して解を求める',
          m: lines,
          n: sol.imag ? R`実部 $` + Q(sol.B1, sol.den1).tex() + R`$、虚部 $\pm` + (U.sqrtTex(Q(sol.out1 * sol.out1 * sol.s.in, sol.den1 * sol.den1))) + R`$ の、互いに共役な 2 つの虚数解です。` : R`$\sqrt{` + sol.s.in + R`}$ は無理数なので、解は $\pm$ のついた形のままで答えます（2 つの実数解）。`,
          easy: sol.imag ? R`虚数解は必ず「$p + qi$」と「$p - qi$」のペア（互いに共役）で現れます。$p$ が実部、$q$ が虚部です。` : R`$\sqrt{}$ が残る解も立派な実数の解です。小数にしたいときは $\sqrt{` + sol.s.in + R`} \fallingdotseq ` + U.fmt(Math.sqrt(sol.s.in), 4) + R`$ を使います。`
        });
      }
      // 解と係数の関係
      steps.push({
        t: '解と係数の関係を確かめる',
        m: [
          R`\alpha + \beta = -\frac{b}{a} = -\frac{` + qB.tex() + '}{' + qA.tex() + R`} = ` + sSum.tex(),
          R`\alpha\beta = \frac{c}{a} = \frac{` + qC.tex() + '}{' + qA.tex() + R`} = ` + sProd.tex()
        ].concat(sol.kind === 'double' ? [R`\text{実際の解 } \alpha = \beta = ` + sol.x.tex() + R`:\ \alpha + \beta = ` + sol.x.mul(2).tex() + R`,\ \alpha\beta = ` + sol.x.mul(sol.x).tex()]
          : (sol.kind === 'rat' ? [R`\text{実際の解 } ` + sol.x2.tex() + R`,\ ` + sol.x1.tex() + R`:\ \text{和 } ` + sol.x1.add(sol.x2).tex() + R`,\ \text{積 } ` + sol.x1.mul(sol.x2).tex()]
            : [
              R`\text{実際の解の和: } \frac{-b + \sqrt{D}}{2a} + \frac{-b - \sqrt{D}}{2a} = \frac{-2b}{2a} = -\frac{b}{a} = ` + sSum.tex(),
              R`\text{実際の解の積: } \frac{(-b)^{2} - (\sqrt{D})^{2}}{(2a)^{2}} = \frac{b^{2} - D}{4a^{2}} = \frac{4ac}{4a^{2}} = \frac{c}{a} = ` + sProd.tex()
            ])),
        n: R`2 つの解 $\alpha,\ \beta$ について、$\alpha + \beta = -\dfrac{b}{a}$、$\alpha\beta = \dfrac{c}{a}$。実際に求めた解でも成り立ちます。` + (sol.kind === 'imag' ? R`虚数解でも、$(\sqrt{D})^{2} = D$ として同じ計算ができます。` : ''),
        easy: R`$(x - \alpha)(x - \beta)$ を展開すると $x^{2} - (\alpha+\beta)x + \alpha\beta$ です。一方、$ax^{2}+bx+c = a\left(x^{2} + \dfrac{b}{a}x + \dfrac{c}{a}\right)$ なので、見比べると「$x$ の係数 $= -(\text{解の和})$」「定数項 $=$ 解の積」の関係があることが分かります。これが**解と係数の関係**で、解そのものを求めなくても、和と積が係数から読み取れます。`,
        pro: R`解と係数の関係は、$D<0$ でも成り立ちます。2 解の和と積が実数でも、解自体は虚数になりえます。`
      });
      steps.push({
        t: '対称式の値（解を求めずに）',
        m: [
          R`\alpha^{2} + \beta^{2} = (\alpha+\beta)^{2} - 2\alpha\beta = ` + pw(sSum, 2) + R` - 2 \cdot ` + U.paren(sProd) + ' = ' + p2.tex(),
          R`\alpha^{3} + \beta^{3} = (\alpha+\beta)^{3} - 3\alpha\beta(\alpha+\beta) = ` + pw(sSum, 3) + R` - 3 \cdot ` + U.paren(sProd) + R` \cdot ` + U.paren(sSum) + ' = ' + p3.tex(),
          R`(\alpha-\beta)^{2} = (\alpha+\beta)^{2} - 4\alpha\beta = ` + pw(sSum, 2) + R` - 4 \cdot ` + U.paren(sProd) + ' = ' + diff2.tex()
        ].concat(sProd.isZero() ? [] : [R`\frac{1}{\alpha} + \frac{1}{\beta} = \frac{\alpha+\beta}{\alpha\beta} = \frac{` + sSum.tex() + '}{' + sProd.tex() + '} = ' + sSum.div(sProd).tex()]),
        n: R`$\alpha^{2}+\beta^{2}$ などの対称式は、$\alpha+\beta$ と $\alpha\beta$ だけで表せます。` + (diff2.sign() < 0 ? R`$(\alpha-\beta)^{2} < 0$ となるのは、$\alpha,\ \beta$ が虚数（共役な複素数）のときです。` : ''),
        easy: R`$(\alpha + \beta)^{2} = \alpha^{2} + 2\alpha\beta + \beta^{2}$ という展開公式を逆に使うと、$\alpha^{2} + \beta^{2} = (\alpha+\beta)^{2} - 2\alpha\beta$ になります。「和」と「積」が分かっていれば、解を 1 つずつ求めなくても値が出ます。`,
        pro: R`$\alpha^{2}+\beta^{2}$ が負なら虚数解を含むなど、符号から解の性質を判定できることもあります。`,
        lv: 2
      });

      return {
        result: [
          { label: scaled ? '判別式 D（整数係数にそろえた式）' : '判別式 D', tex: String(D) },
          { label: '解 x', tex: quadSolTex(sol) + (sol.kind === 'irr' ? R` \approx ` + vals.map((z) => U.fmt(z.re, 4)).join(R`,\ `) : '') },
          { label: '解の和と積', tex: R`\alpha + \beta = ` + sSum.tex() + R`,\quad \alpha\beta = ` + sProd.tex() },
          { label: 'α² + β²', tex: p2.tex() }
        ],
        steps: steps,
        fig: parabolaFig(a, b, c, vals)
      };
    }
  });

  /* ================= 剰余の定理・因数定理 ================= */

  JK.registerCalc({
    id: 'iib-remainder',
    course: 'IIB',
    unit: 'm-complex',
    group: '複素数と方程式',
    title: '剰余の定理・因数定理（高次方程式）',
    desc: R`整式 $P(x)$ を $x - a$ で割った余り $P(a)$ を組立除法で求めます。さらに $P(x) = 0$ の解を、因数定理で有理数解を探して次数を下げ、残りの 2 次式を解の公式で解いて求めます（虚数解も表示）。`,
    form: [R`P(x) = (x-a)Q(x) + P(a)`, R`P(a) = 0 \;\Leftrightarrow\; x-a \text{ は } P(x) \text{ の因数}`],
    inputs: [
      { key: 'P', label: R`整式 $P(x)$`, type: 'poly', def: 'x^3 - 2x^2 - 5x + 6', hint: R`例: $x^3 - 2x^2 - 5x + 6$、$2x^3 + x^2 + 2x + 1$（1〜6 次）` },
      { key: 'a', label: R`$a$（$x - a$ で割る）`, type: 'q', def: '2' }
    ],
    examples: [
      { label: '余りが 0（因数）', v: { P: 'x^3 - 2x^2 - 5x + 6', a: '1' } },
      { label: '虚数解をもつ', v: { P: 'x^3 - 1', a: '2' } },
      { label: '4 次方程式', v: { P: 'x^4 - 3x^3 - x^2 + 3x', a: '-1' } },
      { label: '分数の解', v: { P: '2x^3 - 3x^2 - 3x + 2', a: '1/2' } },
      { label: '有理数解なし', v: { P: 'x^3 - 2x + 5', a: '1' } }
    ],
    intro: {
      easy: R`整式を $x - a$ で割ると、割り算の結果は「$P(x) = (x-a) \times (\text{商}) + (\text{余り})$」と書けます。この等式の $x$ に $a$ を入れると $x - a = 0$ になって商の部分が消えるので、**余りは $P(a)$ に等しい**と分かります。これが**剰余の定理**で、割り算をしなくても代入だけで余りが求まります。
特に余りが 0 のとき、$P(x)$ は $x - a$ で割り切れます（$x - a$ が**因数**）。これが**因数定理**で、グラフでいうと「$x = a$ で $x$ 軸と交わる（$P(a)=0$）」ことと同じです。この性質を使うと、3 次以上の方程式でも、解を 1 つ見つけて次数を 1 つ下げ、最後は 2 次方程式として解けます。`,
      normal: R`余りは $P(a)$。$P(a)=0$ なら $x - a$ は因数。方程式 $P(x)=0$ は、定数項の約数 $\div$ 最高次の係数の約数 を候補に $P(\text{候補})=0$ となる解を探し、組立除法で次数を下げます。`,
      pro: R`有理数解の候補は $\pm\dfrac{(\text{定数項の約数})}{(\text{最高次の係数の約数})}$。まず $\pm1,\ \pm2$ から試すのが定石です。組立除法で商の係数が同時に求まり、次の候補の検討に使えます。`
    },
    compute(v) {
      const p = v.P, a = v.a;
      const n = P.deg(p);
      if (n < 1) throw new JK.CalcError('1 次以上の整式を入力してください（定数だと割り算の意味がありません）');
      if (n > 6) throw new JK.CalcError('6 次以下の整式にしてください');
      const sc0 = intScale(p.slice().reverse());
      bigGuard(sc0.ints, 100000);
      const pa = P.eval(p, a);

      /* --- 部分 1: x - a で割る --- */
      const sy = synth(p, a);
      const ev = evalLines(p, a);
      const steps = [
        {
          t: '剰余の定理',
          m: [R`P(x) = (x - a)\,Q(x) + R`, R`x = a \text{ を代入} \;\Rightarrow\; P(a) = (a - a)Q(a) + R = R`],
          n: R`$P(x)$ を $x - a$ で割った余り $R$ は、$P(a)$ に等しくなります（余りは定数）。`,
          easy: R`整数の割り算 $17 = 5 \times 3 + 2$ と同じ形の「$P(x) = (x-a) \times (\text{商}) + (\text{余り})$」が成り立ちます。この式の $x$ に $a$ を入れると、$(x - a)$ が 0 になるので、商の部分が全部消えて余りだけが残ります。だから、割り算をしなくても $P(a)$ を計算するだけで余りが分かるのです。`
        },
        {
          t: R`$P(` + a.tex() + R`)$ を計算する`,
          m: ev,
          n: R`$x$ に $` + a.tex() + R`$ を代入して、各項の値を足します。` + (pa.isZero() ? R`結果は $0$ なので、余りは $0$（割り切れる）です。` : R`余りは $` + pa.tex() + R`$ です。`),
          easy: R`$x^{3}$ なら $x$ の場所に $` + a.tex() + R`$ を入れて 3 乗する、というふうに、式の $x$ をすべて $` + a.tex() + R`$ に置き換えます。マイナスの数を入れるときは括弧をつけて計算ミスを防ぎます。`
        },
        {
          t: '組立除法で商と余りを同時に求める',
          m: [
            R`P(x) = (` + shiftTex(a) + R`)\left(` + ptex(sy.quot) + R`\right)` + (sy.rem.isZero() ? '' : ' ' + U.signed(sy.rem))
          ],
          n: R`係数だけを使う割り算の省略法です。先頭の係数をそのまま下ろし、$` + a.tex() + R`$ を掛けて次の係数の下に書いて足す、を繰り返します。最後の数が余り、その手前までが商の係数です。`,
          easy: R`筆算で「割る→掛ける→引く」を繰り返す代わりに、係数だけを横に並べて「掛けて足す」を繰り返す計算です。やり方は 3 つだけ。(1) 先頭の係数を下に写す。(2) $a$ を掛けて、次の係数の下に書く。(3) 上下を足して下に書く。(2)(3) を最後まで繰り返し、最後に出た数が余りです。上の表の矢印が「掛けて足す」の流れです。`,
          pro: R`組立除法の最後の数が $P(a)$（余り）。代入計算の検算にもなります。`,
          fig: synthFig(a, sy)
        },
        {
          t: '因数定理',
          m: pa.isZero()
            ? [R`P(` + a.tex() + R`) = 0 \;\Rightarrow\; ` + shiftTex(a) + R` \text{ は } P(x) \text{ の因数}`, R`P(x) = (` + shiftTex(a) + R`)\left(` + ptex(sy.quot) + R`\right)`]
            : [R`P(` + a.tex() + R`) = ` + pa.tex() + R` \ne 0 \;\Rightarrow\; ` + shiftTex(a) + R` \text{ は } P(x) \text{ の因数ではない}`],
          n: pa.isZero() ? R`余りが 0 なので割り切れて、$x = ` + a.tex() + R`$ は方程式 $P(x) = 0$ の解です。` : R`余りが 0 でないので、$x = ` + a.tex() + R`$ は $P(x) = 0$ の解ではありません。`,
          easy: R`余りが 0 ということは「ぴったり割り切れる」ということで、$P(x) = (x-a) \times (\text{商})$ と因数分解できます。このとき $x = a$ を代入すると 0 になる、つまり $x = a$ は方程式 $P(x) = 0$ の解です。グラフでは、$y = P(x)$ が $x = a$ で $x$ 軸と交わります。`,
          pro: R`因数定理は「$P(a) = 0 \Leftrightarrow (x-a) \mid P(x)$」。解を 1 つ見つければ次数が 1 つ下がります。`
        }
      ];

      /* --- 部分 2: P(x) = 0 を解く --- */
      let cur = p.slice();
      const rationalRoots = [];
      let stuck = false, stageNo = 0;
      steps.push({
        t: R`方程式 $P(x) = 0$ を解く方針`,
        m: [R`P(x) = ` + ptex(p) + ' = 0'],
        n: R`3 次以上の方程式は、因数定理で解（有理数解）を 1 つ見つけて $(x - \text{解})$ で割り、次数を下げていきます。2 次になったら解の公式で解きます。`,
        easy: R`3 次以上の方程式には、2 次のような「解の公式」を使えません。そこで、(1) 解になりそうな数を探す（$P(\text{候補}) = 0$ を調べる）、(2) 見つけた解 $r$ で $(x - r)$ を因数として割る（次数が下がる）、(3) 2 次式になったら解の公式、という手順で進めます。`
      });
      while (P.deg(cur) > 2) {
        stageNo++;
        const sc = intScale(cur.slice().reverse());              // 降べきの整数係数
        const ascInts = sc.ints.slice().reverse();               // 昇べき
        let cands;
        if (ascInts[0] === 0) cands = [Q(0)];
        else {
          const divs = (m) => { const r = []; for (let i = 1; i * i <= m; i++) if (m % i === 0) { r.push(i); if (i * i !== m) r.push(m / i); } return r; };
          const ps = divs(Math.abs(ascInts[0])), qsv = divs(Math.abs(ascInts[ascInts.length - 1]));
          cands = [];
          ps.forEach((pp) => qsv.forEach((qq) => { if (U.gcd(pp, qq) === 1) { cands.push(Q(pp, qq)); cands.push(Q(-pp, qq)); } }));
          cands.sort((x, y) => (Math.abs(x.val()) - Math.abs(y.val())) || (y.val() - x.val()));
        }
        const tested = [];
        let root = null;
        for (let i = 0; i < cands.length; i++) {
          const val = P.eval(cur, cands[i]);
          tested.push({ c: cands[i], val: val });
          if (val.isZero()) { root = cands[i]; break; }
        }
        const posC = cands.filter((x) => x.sign() >= 0);
        const candLines = ascInts[0] === 0
          ? [R`\text{定数項が } 0 \text{ なので } x = 0 \text{ が解}`]
          : [
            R`\text{候補} = \pm\frac{\text{定数項 } ` + Math.abs(ascInts[0]) + R` \text{ の約数}}{\text{最高次の係数 } ` + Math.abs(ascInts[ascInts.length - 1]) + R` \text{ の約数}}`,
            posC.slice(0, 12).map((x) => R`\pm ` + x.tex()).join(R`,\ `) + (posC.length > 12 ? R`,\ \cdots` : '')
          ];
        const pn = R`P_{` + stageNo + '}';
        const shown = tested.length > 8 ? tested.slice(0, 7).concat([null, tested[tested.length - 1]]) : tested;
        let testLines = [];
        shown.forEach((t) => {
          if (t === null) testLines.push(R`\ldots`);
          else if (t.val.isZero()) testLines = testLines.concat(evalLines(cur, t.c, pn)).concat([R`\text{よって } x = ` + t.c.tex() + R` \text{ は解}`]);
          else testLines.push(pn + '(' + t.c.tex() + ') = ' + t.val.tex());
        });
        steps.push({
          t: stageNo === 1 ? '有理数の解の候補を調べる' : '次の解の候補を調べる（' + stageNo + ' 回目）',
          m: [pn + R`(x) = ` + ptex(cur)].concat(candLines).concat(testLines),
          n: root
            ? R`候補を小さい順に代入していくと、$x = ` + root.tex() + R`$ で $0$ になりました。因数定理より $` + shiftTex(root) + R`$ は因数です。`
            : R`すべての候補を代入しても $0$ になりませんでした。この整式には有理数の解がありません。`,
          easy: R`有理数の解 $x = \dfrac{p}{q}$（約分済み）があれば、$p$ は定数項の約数、$q$ は最高次の係数の約数になります。まず分子 $p$ の候補（定数項の約数）と分母 $q$ の候補（最高次の係数の約数）を書き出し、$\pm\dfrac{p}{q}$ を 1 つずつ代入して、値が 0 になるものを探します。0 になった $x$ が解です。`,
          pro: R`$P(1),\ P(-1)$ から試すのが定石。係数の和が 0 なら $x = 1$ が、交代和が 0 なら $x = -1$ が解です。`
        });
        if (!root) { stuck = true; break; }
        const sy2 = synth(cur, root);
        rationalRoots.push(root);
        steps.push({
          t: '組立除法で割って次数を下げる',
          m: [R`P_{` + stageNo + R`}(x) = (` + shiftTex(root) + R`)\left(` + ptex(sy2.quot) + R`\right)`],
          n: R`解 $x = ` + root.tex() + R`$ で割ります。余りは $0$、商は $` + (P.deg(sy2.quot)) + R`$ 次式です。`,
          easy: R`解が 1 つ見つかったので、$(x - ` + root.tex() + R`)$ をくくり出します。上の表のやり方で割ると、割り切れて（余り 0）、次数が 1 つ下がった式が残ります。`,
          fig: synthFig(root, sy2),
          lv: 2
        });
        cur = sy2.quot;
      }

      let finalSol = null, approx = null;
      const lead = p[n];
      if (!stuck) {
        const d = P.deg(cur);
        if (d === 2) {
          const sc = intScale([cur[2], cur[1], cur[0]]);
          const A = sc.ints[0], B = sc.ints[1], C = sc.ints[2];
          if (Math.max(Math.abs(A), Math.abs(B), Math.abs(C)) > 1e7) throw new JK.CalcError('係数が大きすぎます');
          finalSol = quadSolve(A, B, C);
          const dTex = R`D = b^{2} - 4ac = ` + pw(Q(B), 2) + R` - 4 \cdot ` + U.paren(Q(A)) + R` \cdot ` + U.paren(Q(C)) + ' = ' + finalSol.D;
          const solLine = finalSol.kind === 'double' ? 'x = ' + finalSol.x.tex() + R`\ (\text{重解})` : 'x = ' + quadSolTex(finalSol);
          steps.push({
            t: '残った 2 次方程式を解の公式で解く',
            m: [ptex(cur) + ' = 0' + (sc.k === 1 ? '' : R` \;\Rightarrow\; ` + ptex(P.of([Q(C), Q(B), Q(A)])) + ' = 0'), dTex, R`x = \frac{-b \pm \sqrt{D}}{2a}`, solLine],
            n: finalSol.kind === 'imag' ? R`$D < 0$ なので虚数解です（$\sqrt{-k} = \sqrt{k}\,i$）。` : (finalSol.kind === 'double' ? R`$D = 0$ なので重解です。` : R`$D \ge 0$ なので実数解です。`),
            easy: R`3 次方程式の解の 1 つを見つけて割ったので、残りは 2 次方程式です。2 次方程式は解の公式で必ず解けます（$D < 0$ のときは虚数 $i$ を使った解になります）。`,
            pro: R`残りの 2 次式が因数分解できそうなら、公式を使わず因数分解のほうが速いです。`
          });
        } else if (d === 1) {
          const r1 = cur[0].neg().div(cur[1]);
          rationalRoots.push(r1);
          steps.push({
            t: '1 次方程式を解く',
            m: [ptex(cur) + R` = 0 \;\Rightarrow\; x = ` + r1.tex()],
            n: R`最後に残った式は 1 次式なので、そのまま解けます。`,
            easy: R`1 次方程式は移項して割るだけです。`
          });
        }
      } else {
        const zs = numRoots(cur.slice().map((q) => q.val()));
        approx = zs;
        steps.push({
          t: '有理数解がない場合（近似値）',
          m: [ptex(cur) + R` = 0 \quad \text{の解（近似値）}`, zs.map((z) => R`x \approx ` + numRootTex(z)).join(R`,\ \ `)],
          n: R`有理数の解がないので、因数分解では解けません（入試では出題されにくい形です）。参考として、数値計算による近似解を示します。`,
          easy: R`この式には、分数や整数のきれいな解がありません。コンピュータの数値計算で近い値を求めた結果を参考に載せています。`
        });
      }

      /* --- まとめ --- */
      const sorted = rationalRoots.slice();
      if (finalSol) {
        if (finalSol.kind === 'double') { sorted.push(finalSol.x); sorted.push(finalSol.x); }
        else if (finalSol.kind === 'rat') { sorted.push(finalSol.x1); sorted.push(finalSol.x2); }
      }
      sorted.sort((x, y) => x.cmp(y));
      const groups = [];
      sorted.forEach((r) => { const g = groups.find((e) => e.r.eq(r)); if (g) g.m++; else groups.push({ r: r, m: 1 }); });
      const parts = groups.map((g) => g.r.tex() + (g.m > 1 ? R`\ (` + g.m + R` \text{ 重解})` : ''));
      if (finalSol && (finalSol.kind === 'irr' || finalSol.kind === 'imag')) parts.push(quadSolTex(finalSol));
      let solTex = parts.length ? 'x = ' + parts.join(R`,\ `) : '';
      if (approx) solTex += (solTex ? R`,\ \ ` : '') + R`x \approx ` + approx.map(numRootTex).join(R`,\ `);
      let facTex = '';
      if (!stuck) {
        const lf = lead.eq(1) ? '' : (lead.eq(-1) ? '-' : lead.tex());
        const fs = [];
        groups.forEach((g) => { for (let i = 0; i < g.m; i++) fs.push('(' + shiftTex(g.r) + ')'); });
        if (finalSol && (finalSol.kind === 'irr' || finalSol.kind === 'imag')) {
          const mq = P.scale(cur, cur[2].inv());
          fs.push('(' + ptex(mq) + ')');
        }
        facTex = 'P(x) = ' + lf + fs.join('');
      }
      steps.push({
        t: 'まとめ（解と因数分解）',
        m: [solTex].concat(facTex ? [facTex] : []),
        n: !stuck ? R`見つけた解と、解の公式で求めた解をまとめました。` + (finalSol && finalSol.kind === 'imag' ? R`虚数解は共役な 2 つがペアです。` : '') + R`$n$ 次方程式の解の個数は、重解を重複して数えると $n$ 個です（この方程式は ` + n + R` 次）。` : R`有理数解が見つからなかったので、近似値で示しました。`,
        easy: R`方程式の解は、重なりも数えると次数と同じ個数あります。$P(x) = 0$ の解 $r$ ごとに $(x - r)$ が因数になるので、解が分かれば因数分解の形に書けます。`,
        pro: R`係数が実数の方程式では、虚数解は共役な組で現れます。たとえば $x^{3} = 1$ の虚数解 $\dfrac{-1 \pm \sqrt{3}\,i}{2}$ は 1 の 3 乗根のうち実数でない 2 つです。`
      });

      // 図
      const realsNum = [];
      if (!stuck) {
        rationalRoots.forEach((r) => realsNum.push(r.val()));
        if (finalSol) quadValues(finalSol).forEach((z) => { if (z.im === 0) realsNum.push(z.re); });
      } else {
        rationalRoots.forEach((r) => realsNum.push(r.val()));
        approx.forEach((z) => { if (z.im === 0) realsNum.push(z.re); });
      }
      const fn = P.fn(p);
      const xs = realsNum.concat([a.val()]);
      const xlo = Math.min.apply(null, xs) - 1.2, xhi = Math.max.apply(null, xs) + 1.2;
      const uniq = [];
      realsNum.forEach((r) => { if (!uniq.some((u) => Math.abs(u - r) < 1e-6)) uniq.push(r); });
      const o = {
        w: 340, h: 250, x: [xhi - xlo < 4 ? (xlo + xhi) / 2 - 2 : xlo, xhi - xlo < 4 ? (xlo + xhi) / 2 + 2 : xhi],
        curves: [{ f: (x) => fn(x), cls: 'c1' }],
        points: uniq.map((r, i) => ({ x: r, y: 0, label: 'x=' + U.fmt(r, 3), cls: 'c2', pos: i % 2 ? 'tr' : 'tl' }))
      };
      o.points.push({ x: a.val(), y: pa.val(), label: 'P(' + a.toString() + ')=' + pa.toString(), cls: 'c3', pos: pa.sign() >= 0 ? 'tr' : 'br' });
      o.vlines = [{ x: a.val(), dash: true }];

      return {
        result: [
          { label: '余り P(' + a.toString() + ')', tex: pa.tex() },
          { label: '商（x − (' + a.toString() + ') で割る）', tex: ptex(sy.quot) },
          { label: '方程式 P(x) = 0 の解', tex: solTex },
          { label: pa.isZero() ? '因数定理' : '因数分解', tex: pa.isZero() ? shiftTex(a) + R` \text{ は } P(x) \text{ の因数}` : (facTex || R`\text{（有理数解なし）}`) }
        ],
        steps: steps,
        fig: JK.plot.graph(o)
      };
    }
  });

  /* ================= 3次方程式の解と係数の関係 ================= */

  function cubicFig(a, b, c, d) {
    const co = [d.val(), c.val(), b.val(), a.val()];
    const f = (x) => ((co[3] * x + co[2]) * x + co[1]) * x + co[0];
    const zs = numRoots(co);
    const reals = zs.filter((z) => z.im === 0).map((z) => z.re).sort((x, y) => x - y);
    // 導関数 3a x^2 + 2b x + c の零点（極値の位置）
    const A3 = 3 * a.val(), B2 = 2 * b.val(), C1 = c.val();
    const cr = [];
    const dsc = B2 * B2 - 4 * A3 * C1;
    if (dsc > 0) { const s = Math.sqrt(dsc); cr.push((-B2 + s) / (2 * A3), (-B2 - s) / (2 * A3)); }
    const xsAll = reals.concat(cr);
    let lo = Math.min.apply(null, xsAll) - 1.2, hi = Math.max.apply(null, xsAll) + 1.2;
    if (!(hi - lo >= 3)) { const m = (lo + hi) / 2; lo = m - 1.5; hi = m + 1.5; }
    // y の範囲: 極値（なければ端点）と 0 から決める
    const yk = (cr.length ? cr.map(f) : [f(lo), f(hi)]).concat([0]);
    let ylo = Math.min.apply(null, yk), yhi = Math.max.apply(null, yk);
    if (!(yhi > ylo)) { ylo -= 1; yhi += 1; }
    const span = yhi - ylo;
    ylo -= span * 0.35; yhi += span * 0.35;
    return JK.plot.graph({
      w: 340, h: 250, x: [lo, hi], y: [ylo, yhi],
      curves: [{ f: f, cls: 'c1' }],
      points: reals.map((r, i) => ({ x: r, y: 0, label: 'x=' + U.fmt(r, 3), cls: 'c3', pos: i % 2 ? 'tr' : 'tl' }))
    });
  }

  JK.registerCalc({
    id: 'iib-cubic-roots',
    course: 'IIB',
    unit: 'm-complex',
    group: '複素数と方程式',
    title: '3次方程式の解と係数の関係',
    desc: R`3 次方程式 $ax^{3}+bx^{2}+cx+d = 0$ の 3 つの解 $\alpha,\ \beta,\ \gamma$ について、和・積和・積を係数から求め、$\alpha^{2}+\beta^{2}+\gamma^{2}$ などの対称式の値も出します。`,
    form: [R`\alpha+\beta+\gamma = -\frac{b}{a}`, R`\alpha\beta+\beta\gamma+\gamma\alpha = \frac{c}{a}`, R`\alpha\beta\gamma = -\frac{d}{a}`],
    inputs: [
      { key: 'a', label: R`$a$`, type: 'q', def: '2' },
      { key: 'b', label: R`$b$`, type: 'q', def: '-3' },
      { key: 'c', label: R`$c$`, type: 'q', def: '-3' },
      { key: 'd', label: R`$d$`, type: 'q', def: '2' }
    ],
    examples: [
      { label: '解がきれいな例', v: { a: '2', b: '-3', c: '-3', d: '2' } },
      { label: '虚数解をもつ', v: { a: '1', b: '-1', c: '1', d: '-1' } },
      { label: '解を求めにくい', v: { a: '1', b: '-2', c: '3', d: '-4' } },
      { label: '2次の係数が 0', v: { a: '1', b: '0', c: '-7', d: '6' } }
    ],
    intro: {
      easy: R`2 次方程式 $x^{2} + px + q = 0$ の 2 つの解 $\alpha,\ \beta$ について、$(x-\alpha)(x-\beta) = x^{2} - (\alpha+\beta)x + \alpha\beta$ だから「解の和 $= -p$、解の積 $= q$」でした。3 次方程式も同じ考え方です。3 つの解を $\alpha,\ \beta,\ \gamma$ とすると、方程式は $a(x-\alpha)(x-\beta)(x-\gamma) = 0$ と書け、これを展開した係数と見比べると、**解の和・（2 つずつの）積の和・3 つの積**が、$a,\ b,\ c,\ d$ だけで表せます。
解そのものを求めなくても、解に関する値（たとえば $\alpha^{2}+\beta^{2}+\gamma^{2}$）が分かるのが便利な点です。`,
      normal: R`$a(x-\alpha)(x-\beta)(x-\gamma)$ を展開して係数を比べると、$\alpha+\beta+\gamma = -\dfrac{b}{a}$、$\alpha\beta+\beta\gamma+\gamma\alpha = \dfrac{c}{a}$、$\alpha\beta\gamma = -\dfrac{d}{a}$。対称式はこの 3 つで表せます。`,
      pro: R`$\alpha^{2}+\beta^{2}+\gamma^{2} = (\alpha+\beta+\gamma)^{2} - 2(\alpha\beta+\beta\gamma+\gamma\alpha)$、$\alpha^{3}+\beta^{3}+\gamma^{3} = e_{1}^{3} - 3e_{1}e_{2} + 3e_{3}$ が基本。値が負になれば虚数解の存在が分かります。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c, d = v.d;
      if (a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（a = 0 だと 3 次方程式になりません）');
      const e1 = b.neg().div(a), e2 = c.div(a), e3 = d.neg().div(a);
      const s2 = e1.mul(e1).sub(e2.mul(2));                                  // α²+β²+γ²
      const s3 = e1.mul(e1).mul(e1).sub(e1.mul(e2).mul(3)).add(e3.mul(3));   // α³+β³+γ³
      const inv = e3.isZero() ? null : e2.div(e3);                           // 1/α+1/β+1/γ
      const eq = ptex([d, c, b, a]) + ' = 0';

      const steps = [
        {
          t: '3 次方程式を解の形で書く',
          m: [R`ax^{3} + bx^{2} + cx + d = a(x-\alpha)(x-\beta)(x-\gamma)`],
          n: R`$\alpha,\ \beta,\ \gamma$ が解のとき、因数定理から $(x-\alpha),\ (x-\beta),\ (x-\gamma)$ がそれぞれ因数です。最高次の係数が $a$ なので、全体に $a$ がかかります。`,
          easy: R`$x = \alpha$ を $a(x-\alpha)(x-\beta)(x-\gamma)$ に入れると、$(x - \alpha)$ が 0 になるので全体が 0 になります。つまり $\alpha$ は方程式の解です（$\beta,\ \gamma$ も同様）。逆に「3 つの解が $\alpha,\ \beta,\ \gamma$ の 3 次方程式」は、この形に書けます。`
        },
        {
          t: '右辺を展開して係数を比べる（解と係数の関係の導出）',
          m: [
            R`(x-\alpha)(x-\beta) = x^{2} - (\alpha+\beta)x + \alpha\beta`,
            R`(x-\alpha)(x-\beta)(x-\gamma) = x^{3} - (\alpha+\beta+\gamma)x^{2} + (\alpha\beta+\beta\gamma+\gamma\alpha)x - \alpha\beta\gamma`,
            R`ax^{3} + bx^{2} + cx + d = ax^{3} - a(\alpha+\beta+\gamma)x^{2} + a(\alpha\beta+\beta\gamma+\gamma\alpha)x - a\alpha\beta\gamma`
          ],
          n: R`$x^{3},\ x^{2},\ x,\ $定数項の係数を比べます（恒等式）。`,
          easy: R`まず $(x-\alpha)(x-\beta)$ を展開し、それに $(x-\gamma)$ を掛けます。$x^{2}$ の係数は $-\alpha-\beta-\gamma$、$x$ の係数は $\alpha\beta+\beta\gamma+\gamma\alpha$、定数項は $-\alpha\beta\gamma$ になります。これを $a$ 倍した式が $ax^{3}+bx^{2}+cx+d$ に等しい（恒等式）ので、同じ次数の係数を比べます。`,
          lv: 3
        },
        {
          t: '解と係数の関係',
          m: [
            R`\alpha + \beta + \gamma = -\frac{b}{a},\quad \alpha\beta + \beta\gamma + \gamma\alpha = \frac{c}{a},\quad \alpha\beta\gamma = -\frac{d}{a}`
          ],
          n: R`係数比較から、$-a(\alpha+\beta+\gamma) = b$、$a(\alpha\beta+\beta\gamma+\gamma\alpha) = c$、$-a\alpha\beta\gamma = d$ が得られ、両辺を $a$ で割ります。符号（和と積は $-$、積和は $+$）の位置に注意します。`,
          easy: R`覚え方は「$x^{2}$ の係数 $b$ は和にマイナス、$x$ の係数 $c$ は積和にプラス、定数項 $d$ は積にマイナス」です。符号が $-,\ +,\ -$ と交互に並ぶのは、$(x - \alpha)$ のようにマイナスの付いた因数を掛けているからです。`,
          pro: R`符号は $(-1)^{k}$ で交互に（和は $-$、積和は $+$、積は $-$）と覚えます。4 次以降も同じ流れです。`
        },
        {
          t: R`$a,\ b,\ c,\ d$ を代入する`,
          m: [
            R`\alpha + \beta + \gamma = -\frac{b}{a} = -\frac{` + b.tex() + '}{' + a.tex() + R`} = ` + e1.tex(),
            R`\alpha\beta + \beta\gamma + \gamma\alpha = \frac{c}{a} = \frac{` + c.tex() + '}{' + a.tex() + R`} = ` + e2.tex(),
            R`\alpha\beta\gamma = -\frac{d}{a} = -\frac{` + d.tex() + '}{' + a.tex() + R`} = ` + e3.tex()
          ],
          n: R`方程式 $` + eq + R`$ の係数を代入します。`,
          easy: R`負の数が入ると符号を間違いやすいので、$-\dfrac{b}{a}$ の「$-$」をつけ忘れないようにします。分数のときは約分して簡単にします。`
        },
        {
          t: R`対称式の値（解を求めずに）`,
          m: [
            R`\alpha^{2}+\beta^{2}+\gamma^{2} = (\alpha+\beta+\gamma)^{2} - 2(\alpha\beta+\beta\gamma+\gamma\alpha) = ` + pw(e1, 2) + R` - 2 \cdot ` + U.paren(e2) + ' = ' + s2.tex(),
            R`\alpha^{3}+\beta^{3}+\gamma^{3} = e_{1}^{3} - 3e_{1}e_{2} + 3e_{3} = ` + pw(e1, 3) + R` - 3 \cdot ` + U.paren(e1) + R` \cdot ` + U.paren(e2) + R` + 3 \cdot ` + U.paren(e3) + ' = ' + s3.tex()
          ].concat(inv ? [R`\frac{1}{\alpha} + \frac{1}{\beta} + \frac{1}{\gamma} = \frac{\alpha\beta+\beta\gamma+\gamma\alpha}{\alpha\beta\gamma} = \frac{` + e2.tex() + '}{' + e3.tex() + '} = ' + inv.tex()] : [R`\alpha\beta\gamma = 0 \text{ なので } \frac{1}{\alpha} + \frac{1}{\beta} + \frac{1}{\gamma} \text{ は定義されない（} 0 \text{ が解）}`]),
          n: R`$e_{1} = \alpha+\beta+\gamma,\ e_{2} = \alpha\beta+\beta\gamma+\gamma\alpha,\ e_{3} = \alpha\beta\gamma$ とおくと、対称式は $e_{1},\ e_{2},\ e_{3}$ で表せます。` + (s2.sign() < 0 ? R`$\alpha^{2}+\beta^{2}+\gamma^{2} < 0$ なので、少なくとも 1 つの解は虚数です（3 つとも実数なら 2 乗の和は 0 以上）。` : ''),
          easy: R`$(\alpha+\beta+\gamma)^{2}$ を展開すると、$\alpha^{2}+\beta^{2}+\gamma^{2}$ のほかに $2(\alpha\beta+\beta\gamma+\gamma\alpha)$ が出てきます。だから「和の 2 乗」から「積和の 2 倍」を引けば、2 乗の和が得られます。`,
          pro: R`$\alpha^{3}+\beta^{3}+\gamma^{3}$ は $e_{1}^{3} - 3e_{1}e_{2} + 3e_{3}$。$(\alpha+1)(\beta+1)(\gamma+1) = e_{3} + e_{2} + e_{1} + 1$ など、「解に 1 を足した式」も頻出です。`,
          lv: 2
        }
      ];

      // 実際の解での確認（有理数解が見つかる場合）
      const pp = [d, c, b, a];
      const rr = JK.poly.rationalRoots(pp);
      if (rr.length) {
        const r0 = rr[0];
        const sy = synth(pp, r0);
        const q2 = sy.quot;
        if (P.deg(q2) === 2) {
          const sc = intScale([q2[2], q2[1], q2[0]]);
          const A = sc.ints[0], B = sc.ints[1], C = sc.ints[2];
          if (Math.max(Math.abs(A), Math.abs(B), Math.abs(C)) <= 1e7) {
            const sol = quadSolve(A, B, C);
            const ps = Q(-B, A), pq = Q(C, A);
            steps.push({
              t: '実際の解で確かめる',
              m: [
                R`\text{解の 1 つ } \alpha = ` + r0.tex() + R`,\ \text{残りの 2 つ } \beta,\ \gamma:\ ` + ptex(q2) + R` = 0 \;\Rightarrow\; x = ` + (sol.kind === 'double' ? sol.x.tex() : quadSolTex(sol)),
                R`\beta + \gamma = ` + ps.tex() + R`,\quad \beta\gamma = ` + pq.tex(),
                R`\alpha + \beta + \gamma = ` + r0.tex() + ' ' + U.signed(ps) + ' = ' + r0.add(ps).tex() + R`\quad \text{（係数から求めた } ` + e1.tex() + R` \text{ と一致）}`,
                R`\alpha\beta + \beta\gamma + \gamma\alpha = \alpha(\beta+\gamma) + \beta\gamma = ` + U.paren(r0) + R` \cdot ` + U.paren(ps) + ' + ' + U.paren(pq) + ' = ' + r0.mul(ps).add(pq).tex() + R`\quad \text{（} ` + e2.tex() + R` \text{ と一致）}`,
                R`\alpha\beta\gamma = \alpha \cdot \beta\gamma = ` + U.paren(r0) + R` \cdot ` + U.paren(pq) + ' = ' + r0.mul(pq).tex() + R`\quad \text{（} ` + e3.tex() + R` \text{ と一致）}`
              ],
              n: R`因数定理で有理数の解 $x = ` + r0.tex() + R`$ を見つけて割り、残りの 2 次方程式を解くと 3 つの解がそろいます。実際の解から計算した和・積和・積が、係数から求めた値と一致します。`,
              easy: R`係数だけから求めた値が本当に正しいか、解を実際に求めて確認します。ここでは先に解を 1 つ見つけ、残りは 2 次方程式を解いています。確かめた結果、同じ値になります。`,
              lv: 2
            });
          }
        }
      }
      return {
        result: [
          { label: '和 α+β+γ', tex: e1.tex() },
          { label: '積和 αβ+βγ+γα', tex: e2.tex() },
          { label: '積 αβγ', tex: e3.tex() },
          { label: 'α²+β²+γ²', tex: s2.tex() },
          { label: inv ? '1/α+1/β+1/γ' : 'α³+β³+γ³', tex: inv ? inv.tex() : s3.tex() }
        ],
        steps: steps,
        fig: cubicFig(a, b, c, d)
      };
    }
  });
})();
