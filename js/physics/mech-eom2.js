/* 物理・力学 — 運動方程式の続き（unit: p-eom）
   mech-connected: 水平面上で糸でつないだ 2 物体を力 F で引く（加速度・張力）
   mech-atwood: 滑車でつないだ 2 物体（定滑車の両側 / 机上の物体とつるした物体） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const G = 9.8;

  const sig = (x) => U.sig(x, 3);
  // 与えられた値の表示: 入力した値をそのまま（有効数字 10 桁まで。末尾の 0 は省く）。丸めて見せると、表示の数値どうしの計算が結果と合わなくなる
  const nf = (x) => {
    if (typeof x !== 'number' || !isFinite(x)) return U.fmt(x);
    const s = String(Number(x.toPrecision(10))), m = /^(-?[\d.]+)e([+-]?\d+)$/.exec(s);
    return m ? m[1] + R` \times 10^{` + Number(m[2]) + '}' : s;
  };
  const P3 = (x) => U.roundSig(x, 3);
  const MS = R`\,\mathrm{m/s}`, MS2 = R`\,\mathrm{m/s^{2}}`, NN = R`\,\mathrm{N}`, SEC = R`\,\mathrm{s}`;
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

  // 途中の値の表示。x を有効数字 n 桁で書く（ちょうどの値は末尾の 0 を省く）
  const showN = (x, n) => {
    if (x === 0 || !isFinite(x)) return U.fmt(x);
    const r = U.roundSig(x, n), e = Math.floor(Math.log10(Math.abs(r)));
    if (e >= 7 || e < -3) return U.sig(r, n);
    let s = r.toFixed(Math.max(0, n - 1 - e));
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  };
  // 途中の値 vals を、あとの式 f（表示した値を代入して計算する関数。複数の結果は配列で返す）の結果が、丸める前の値から計算した target
  // （数値または配列）と有効数字 3 桁で一致する最小の桁数で書く。生徒が表示の数値どうしを電卓で計算しても、表示の結果と最後の桁まで合う
  const fit = (vals, f, target) => {
    const want = [].concat(target).map(P3);
    for (let n = 3; n <= 12; n++) {
      const got = [].concat(f.apply(null, vals.map((x) => U.roundSig(x, n)))).map(P3);
      if (got.every((g, i) => g === want[i])) return vals.map((x) => showN(x, n));
    }
    return vals.map((x) => showN(x, 12));
  };
  // 途中の値を 3 桁より多い桁（s）で代入したときの断り書き（3 桁と同じなら書かない）。sym: 記号、unit: 単位（TeX）
  const unrounded = (sym, s, x, unit) => (s === showN(x, 3) ? '' : R`式に入れる $` + sym + R`$ は、丸める前の値 $` + s + unit + R`$ です。`);

  // 図の文字用: 有効数字 3 桁の平文（指数は Unicode の上付き）
  function pl(x) {
    if (!isFinite(x)) return '';
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = U.roundSig(x / Math.pow(10, e), 3);
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return m + '×10' + String(e).replace(/-/g, '⁻').replace(/\d/g, (c) => SUP[c]);
    }
    return String(U.roundSig(x, 3));
  }

  /* =====================================================================
     水平面上の連結 2 物体
     ===================================================================== */
  function solveConn(m1, m2, F, mu) {
    const r = { m1: m1, m2: m2, F: F, mu: mu, tot: m1 + m2 };
    r.N1 = m1 * G; r.N2 = m2 * G;
    r.f1 = mu * r.N1; r.f2 = mu * r.N2;
    r.a = F / r.tot - mu * G;
    r.T = m1 * (r.a + mu * G);                       // = m1 F / (m1 + m2)
    return r;
  }

  function figConn(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 118 : 290);
    const gy = prob ? 64 : 104, hb = 36;
    const wA = 34 + 30 * r.m1 / r.tot, wB = 34 + 30 * r.m2 / r.tot;
    const xA = 44, xB = xA + wA + 60;
    const ym = gy - hb / 2;
    d.hatch(14, gy, 346, gy);
    d.line(xA + wA, ym, xB, ym, { cls: 'fg', w: 1.6 });
    d.rect(xA, gy - hb, wA, hb, { cls: 'fg', fill: 'f1', rx: 3 });
    d.rect(xB, gy - hb, wB, hb, { cls: 'fg', fill: 'f2', rx: 3 });
    d.text(xA + wA / 2, ym + 5, 'A', { size: 14, bold: true });
    d.text(xB + wB / 2, ym + 5, 'B', { size: 14, bold: true });
    d.arrow(xB + wB, ym, xB + wB + 64, ym, { cls: 'c3', label: 'F', w: 2.4 });
    d.text(180, gy + 22, 'A: m₁ = ' + pl(r.m1) + ' kg　B: m₂ = ' + pl(r.m2) + ' kg　F = ' + pl(r.F) + ' N', { size: 12 });
    d.text(180, gy + 40, r.mu > 0 ? 'あらい水平面（動摩擦係数 μ′ = ' + pl(r.mu) + '）' : 'なめらかな水平面', { cls: 'dim', size: 11 });
    if (!prob) {
      d.arrow(xA + 6, gy - hb - 14, xA + 54, gy - hb - 14, { cls: 'c4', label: 'a', w: 1.8 });
      // 物体ごとの水平方向の力
      const fmax = Math.max(r.F, r.T, r.f1, r.f2);
      const k = 54 / fmax, L = (F) => Math.max(14, F * k);
      const cy = 216, bw = 40, bh = 26;
      d.text(88, 164, '物体 A（右向きが正）', { cls: 'dim', size: 11 });
      d.rect(88 - bw / 2, cy - bh / 2, bw, bh, { cls: 'fg', fill: 'f1', rx: 3 });
      d.arrow(88 + bw / 2, cy, 88 + bw / 2 + L(r.T), cy, { cls: 'c1', label: 'T', w: 2.2 });
      if (r.mu > 0) d.arrow(88 - bw / 2, cy, 88 - bw / 2 - L(r.f1), cy, { cls: 'c2', label: 'f₁', w: 2.2 });
      d.text(88, cy + 38, 'm₁a = T' + (r.mu > 0 ? ' − f₁' : ''), { size: 11 });
      d.text(272, 164, '物体 B', { cls: 'dim', size: 11 });
      d.rect(272 - bw / 2, cy - bh / 2, bw, bh, { cls: 'fg', fill: 'f2', rx: 3 });
      d.arrow(272 + bw / 2, cy, 272 + bw / 2 + L(r.F), cy, { cls: 'c3', label: 'F', w: 2.2 });
      d.arrow(272 - bw / 2, cy - 6, 272 - bw / 2 - L(r.T), cy - 6, { cls: 'c1', label: 'T', lpos: -1, w: 2.2 });
      if (r.mu > 0) d.arrow(272 - bw / 2, cy + 6, 272 - bw / 2 - L(r.f2), cy + 6, { cls: 'c2', label: 'f₂', w: 2.2 });
      d.text(272, cy + 38, 'm₂a = F − T' + (r.mu > 0 ? ' − f₂' : ''), { size: 11 });
      d.text(180, 280, '鉛直方向の力（重力と垂直抗力）はつり合うので省略', { cls: 'dim', size: 10 });
    }
    return d.svg();
  }

  // o.given: 演習で、問題の値と記号を結びつける文
  function connSteps(r, o) {
    o = o || {};
    const fr = r.mu > 0;
    const steps = [];
    // T と検算で代入する a（丸めた 2.04 を代入して結果が 1 つずれる、を防ぐため、必要なら桁を増やす）
    const aS = fit([r.a], (a) => [r.m1 * a + r.mu * r.m1 * G, r.m2 * a], [r.T, r.m2 * r.a])[0];
    steps.push({
      t: '力を図に描き、向きを決める',
      n: (o.given || '') + R`右向きを正とします。物体 A（質量 $m_{1}$）には、**糸の張力 $T$**（右向き）` + (fr ? R`と**動摩擦力 $f_{1}$**（左向き）` : '') +
        R`がはたらきます。物体 B（質量 $m_{2}$）には、**引く力 $F$**（右向き）、**糸の張力 $T$**（左向き）` + (fr ? R`、**動摩擦力 $f_{2}$**（左向き）` : '') +
        R`がはたらきます（図）。鉛直方向には重力と垂直抗力がつり合っています。糸は軽くて伸びないので、A と B は**同じ加速度 $a$** で動き、糸の張力は A にも B にも同じ大きさ $T$ です。`,
      easy: R`物体が 2 つ糸でつながっているときは、「物体ごとに」力を考えて、それぞれに運動方程式を書きます。糸はぴんと張っていて伸びないので、2 つの物体はいつも同じペースで動きます（同じ加速度 $a$）。また、糸が A を引く力と B を引く力は、向きは逆で大きさは同じです。これが $T$ です。`,
      pro: R`連結体は「物体ごとの運動方程式 → 連立」が基本。$T$ は 2 物体の間の内力です。`
    });
    if (fr) {
      steps.push({
        t: '垂直抗力と動摩擦力',
        m: [R`N_{1} = m_{1}g,\quad f_{1} = \mu' N_{1} = \mu' m_{1}g = ` + nf(r.mu) + R` \times ` + nf(r.m1) + R` \times 9.8 = ` + sig(r.f1) + NN,
          R`N_{2} = m_{2}g,\quad f_{2} = \mu' N_{2} = \mu' m_{2}g = ` + nf(r.mu) + R` \times ` + nf(r.m2) + R` \times 9.8 = ` + sig(r.f2) + NN],
        n: R`鉛直方向の力はつり合っているので、垂直抗力は重力と等しく $N = mg$ です。すべっている物体にはたらく動摩擦力は $f = \mu' N = \mu' mg$ です。`,
        easy: R`床が物体を押し返す力（垂直抗力）は、物体が床を押す力（重さ $mg$）と同じ大きさです。すべっているときの摩擦力は、床を押す力に比例して、その $\mu'$ 倍になります。`,
        lv: 2
      });
    }
    steps.push({
      t: '物体ごとに運動方程式を立てる',
      m: fr
        ? [R`\text{A: } m_{1}a = T - \mu' m_{1}g`, R`\text{B: } m_{2}a = F - T - \mu' m_{2}g`]
        : [R`\text{A: } m_{1}a = T`, R`\text{B: } m_{2}a = F - T`],
      n: R`運動方程式 $ma = (\text{合力})$ を、右向きを正として A と B それぞれに立てます。A の合力は、右向きの $T$` + (fr ? R` から左向きの摩擦力 $\mu' m_{1}g$ を引いたもの` : '') +
        R`、B の合力は、右向きの $F$ から左向きの $T$` + (fr ? R` と摩擦力 $\mu' m_{2}g$` : '') + R` を引いたものです。`,
      easy: R`運動方程式は「質量 × 加速度 = 物体にはたらく力の合計」です。向きを決めて、正の向きの力は $+$、逆向きの力は $-$ で足し合わせます。A と B は同じ加速度 $a$ を共有しているので、未知数は $a$ と $T$ の 2 つ、式も 2 本です。`
    });
    steps.push({
      t: '2 式を足して、加速度 $a$ を求める',
      m: fr
        ? [R`(m_{1}+m_{2})a = F - \mu'(m_{1}+m_{2})g`, R`a = \frac{F}{m_{1}+m_{2}} - \mu' g`,
          R`a = \frac{` + nf(r.F) + '}{' + nf(r.m1) + ' + ' + nf(r.m2) + R`} - ` + nf(r.mu) + R` \times 9.8 = ` + sig(r.a) + MS2]
        : [R`(m_{1}+m_{2})a = F`, R`a = \frac{F}{m_{1}+m_{2}}`,
          R`a = \frac{` + nf(r.F) + '}{' + nf(r.m1) + ' + ' + nf(r.m2) + '} = ' + sig(r.a) + MS2],
      n: R`2 つの式を辺々足すと、$T$ が打ち消し合って $a$ だけの式になります。これは、質量 $m_{1}+m_{2}$ の 1 つの物体を力 $F$ で引く運動` + (fr ? R`（全体にはたらく摩擦力は $\mu'(m_{1}+m_{2})g$）` : '') + R`と同じ式です。`,
      easy: R`連立方程式は、「足して $T$ を消す」のが近道です。A の式の $+T$ と B の式の $-T$ が消えて、$a$ だけが残ります。` + (fr ? R`残った式を $a$ について解けば加速度が求まります。` : R`$F$ を全体の質量で割ると加速度になる、という直感どおりの結果です。`),
      pro: R`全体を 1 つの物体（質量 $m_{1}+m_{2}$）とみなせば、内力の $T$ は現れません。$` + (fr ? R`F - \mu'(m_{1}+m_{2})g` : R`F`) + R` = (m_{1}+m_{2})a$ を最初から立てられます。`
    });
    steps.push({
      t: '糸の張力 $T$ を求める',
      m: [R`T = m_{1}a` + (fr ? R` + \mu' m_{1}g` : ''),
        R`T = ` + nf(r.m1) + R` \times ` + aS + (fr ? R` + ` + nf(r.mu) + R` \times ` + nf(r.m1) + R` \times 9.8` : '') + ' = ' + sig(r.T) + NN,
        R`T = \frac{m_{1}}{m_{1}+m_{2}}F = \frac{` + nf(r.m1) + '}{' + nf(r.m1) + ' + ' + nf(r.m2) + R`} \times ` + nf(r.F) + ' = ' + sig(r.T) + NN],
      n: R`A の式を $T$ について解いて、求めた $a$ を代入します。` + unrounded('a', aS, r.a, MS2) + R`A と B に同じ摩擦係数がはたらくときは、$a$ の式を代入して整理すると $T = \frac{m_{1}}{m_{1}+m_{2}}F$ となり、**摩擦係数 $\mu'$ によりません**（$F$ を質量の比で分けた値です）。この式で計算しても同じ値になります。`,
      easy: R`A の式を「$T = \cdots$」の形に直して、先に求めた $a$ を入れます。$T$ は、A を加速させるために糸が引いている力です。B から見ると、$F$ のうち A を引っ張るために使われる分、と考えられます。`,
      pro: R`$T = \frac{m_{1}}{m_{1}+m_{2}}F$。後ろの物体ほど軽ければ、張力は小さくてよい。`
    });
    // B の式に代入して確かめる（T は、F - T - f₂ の計算が m₂a と合う桁数で書く）
    const Ts = fit([r.T], (T) => r.F - T - r.f2, r.m2 * r.a)[0];
    steps.push({
      t: '検算（B の式に代入）',
      m: [R`m_{2}a = ` + nf(r.m2) + R` \times ` + aS + ' = ' + sig(r.m2 * r.a) + NN,
        R`F - T` + (fr ? R` - \mu' m_{2}g` : '') + ' = ' + nf(r.F) + ' - ' + Ts + (fr ? ' - ' + nf(r.mu) + R` \times ` + nf(r.m2) + R` \times 9.8` : '') + ' = ' + sig(r.m2 * r.a) + NN],
      n: R`求めた $a$, $T$ を B の運動方程式に戻して、左辺と右辺が一致することを確かめます。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'mech-connected',
    field: '力学',
    unit: 'p-eom',
    title: '水平面上の連結 2 物体（糸でつないで引く）',
    desc: R`水平面上に置いた物体 A, B を軽い糸でつなぎ、B を水平な力 $F$ で引きます。動摩擦係数 $\mu'$ を入れるとあらい面も扱えます。物体ごとに運動方程式を立てて、加速度 $a$ と糸の張力 $T$ を求めます。`,
    form: [R`m_{1}a = T - \mu' m_{1}g`, R`m_{2}a = F - T - \mu' m_{2}g`, R`a = \frac{F}{m_{1}+m_{2}} - \mu' g`],
    inputs: [
      { key: 'm1', label: 'A の質量 m₁', unit: 'kg', type: 'num', def: '2.0', min: 0.01, max: 1000 },
      { key: 'm2', label: 'B の質量 m₂', unit: 'kg', type: 'num', def: '3.0', min: 0.01, max: 1000 },
      { key: 'F', label: 'B を引く力 F', unit: 'N', type: 'num', def: '20', min: 0.01, max: 100000 },
      { key: 'mu', label: '動摩擦係数 μ′', type: 'num', def: '0', min: 0, max: 5, hint: '0 でなめらかな面' }
    ],
    examples: [
      { label: 'なめらかな面', v: { m1: '2.0', m2: '3.0', F: '20', mu: '0' } },
      { label: 'あらい面（μ′ = 0.20）', v: { m1: '2.0', m2: '3.0', F: '30', mu: '0.20' } },
      { label: '軽い A を重い B が引く', v: { m1: '1.0', m2: '5.0', F: '24', mu: '0.10' } }
    ],
    intro: {
      easy: R`糸でつながった 2 つの物体を引くと、2 つは**同じ加速度**で一緒に動きます。ただし、物体ごとに受ける力は違います。そこで、**物体ごとに運動方程式**（質量 × 加速度 = 力の合計）を立てて、加速度 $a$ と糸の張力 $T$ を未知数とする連立方程式を解きます。糸が引く力 $T$ は、前の物体を引っ張る力であると同時に、後ろの物体にとってはブレーキの力にもなる点が大切です。`,
      normal: R`A: $m_{1}a = T - \mu' m_{1}g$、B: $m_{2}a = F - T - \mu' m_{2}g$。2 式を足して $T$ を消すと、$a = \frac{F}{m_{1}+m_{2}} - \mu' g$。`,
      pro: R`連結体は全体を 1 つの物体とみなして $a$ を先に出し、$T$ は片方の物体の式から出すのが定石。摩擦係数が同じなら $T = \frac{m_{1}}{m_{1}+m_{2}}F$ で $\mu'$ に無関係。`
    },
    compute(v) {
      const r = solveConn(v.m1, v.m2, v.F, v.mu);
      if (!(r.a > 1e-9)) {
        throw new JK.CalcError('この条件では物体は動き出しません（引く力 F が、動摩擦力の合計 μ′(m₁+m₂)g = ' + pl(v.mu * r.tot * G) + ' N 以下のため）。F を大きくするか μ′ を小さくしてください。');
      }
      const res = [
        { label: '加速度 a', tex: sig(r.a) + MS2 },
        { label: '糸の張力 T', tex: sig(r.T) + NN }
      ];
      if (r.mu > 0) {
        res.push({ label: '動摩擦力 f₁（A）', tex: sig(r.f1) + NN });
        res.push({ label: '動摩擦力 f₂（B）', tex: sig(r.f2) + NN });
      }
      res.push({ label: '全体の合力 (m₁+m₂)a', tex: sig(r.tot * r.a) + NN });
      return { result: res, steps: connSteps(r), fig: figConn(r) };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      const m1 = rng.pick([1.0, 2.0, 3.0]);
      const m2 = rng.pick([2.0, 3.0, 4.0, 5.0]);
      const mu = level === 'basic' ? 0 : rng.pick([0.10, 0.20, 0.25]);
      const a0 = rng.pick(mu > 0 ? [4.0, 5.0, 6.0] : [2.0, 3.0, 4.0, 5.0]);
      const F = (m1 + m2) * a0;
      const r = solveConn(m1, m2, F, mu);
      const surf = mu > 0
        ? R`あらい水平面上に`
        : R`なめらかな水平面上に`;
      let body = surf + R`、質量 $` + m1.toFixed(1) + R`\,\mathrm{kg}$ の物体 A と質量 $` + m2.toFixed(1) + R`\,\mathrm{kg}$ の物体 B を軽い糸でつないで置き、B を水平右向きの一定の力 $F = ` + F.toFixed(1) + R`\,\mathrm{N}$ で引いたところ、A と B は糸がたるまずに一緒に右へ動いた。` +
        (mu > 0 ? R`A, B と水平面の間の動摩擦係数はどちらも $` + mu.toFixed(2) + R`$ である。` : '') + gtxt + R`次の問いに答えよ。`;
      const parts = [
        { label: '(1)', q: R`A, B の加速度の大きさ $a$`, type: 'num', answer: P3(r.a), rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`糸の張力の大きさ $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 'N' }
      ];
      const given = R`A の質量を $m_{1} = ` + m1.toFixed(1) + R`\,\mathrm{kg}$、B の質量を $m_{2} = ` + m2.toFixed(1) + R`\,\mathrm{kg}$` + (mu > 0 ? R`、動摩擦係数を $\mu' = ` + mu.toFixed(2) + '$' : '') + R` とします。`;
      const solution = connSteps(r, { given: given });
      let title = mu > 0 ? 'あらい面上の連結 2 物体' : 'なめらかな面上の連結 2 物体';
      if (level === 'mid') {
        const aB = F / m2 - mu * G;
        parts.push({ label: '(3)', q: R`糸が切れた直後の、B の加速度の大きさ $a_{B}$`, type: 'num', answer: P3(aB), rel: 0.02, unit: 'm/s²' });
        solution.push({
          t: '糸が切れた直後の B の加速度',
          m: [R`m_{2}a_{B} = F - \mu' m_{2}g`, R`a_{B} = \frac{F}{m_{2}} - \mu' g = \frac{` + nf(F) + '}{' + nf(m2) + R`} - ` + nf(mu) + R` \times 9.8 = ` + sig(aB) + MS2],
          n: R`糸が切れると張力 $T$ がなくなるので、B には $F$ と摩擦力だけがはたらきます。B だけの運動方程式を立てれば加速度が求まります。`,
          easy: R`糸が切れた直後は、B を後ろへ引いていた糸の力（張力）が急になくなります。B は軽くなったように感じて、加速度は大きくなります。B だけに注目して、もう一度運動方程式 $m_{2}a_{B} = (\text{合力})$ を立てます。`
        });
        title = '糸が切れる前後の連結 2 物体';
      } else if (level === 'adv') {
        const Tmax = Math.ceil(r.T * 1.25 / 5) * 5;
        const Fmax = Tmax * r.tot / m1;
        parts.push({ label: '(3)', q: R`この糸は張力が $` + Tmax.toFixed(0) + R`\,\mathrm{N}$ をこえると切れる。糸が切れないように B を引くことのできる力の最大値 $F_{\max}$`, type: 'num', answer: P3(Fmax), rel: 0.02, unit: 'N' });
        solution.push({
          t: '糸が切れない力の最大値',
          m: [R`T = \frac{m_{1}}{m_{1}+m_{2}}F \le T_{\max} \;\Rightarrow\; F \le \frac{m_{1}+m_{2}}{m_{1}}T_{\max}`,
            R`F_{\max} = \frac{` + nf(r.tot) + '}{' + nf(m1) + R`} \times ` + nf(Tmax) + ' = ' + sig(Fmax) + NN],
          n: R`張力は $T = \frac{m_{1}}{m_{1}+m_{2}}F$ で、$F$ に比例して大きくなります。$T$ が耐えられる最大の張力 $T_{\max}$ に達するときの $F$ が最大値です（摩擦係数にはよりません）。`,
          easy: R`引く力 $F$ を大きくしていくと、糸の張力 $T$ も同じ割合で大きくなります。$T$ がちょうど切れる値 $T_{\max} = ` + nf(Tmax) + R`\,\mathrm{N}$ になったときの $F$ を、$T = \frac{m_{1}}{m_{1}+m_{2}}F$ から逆算します。`
        });
        title = '糸の強さと引く力の限界';
      }
      return { title: title, body: body, fig: figConn(r, { problem: true }), parts: parts, solution: solution };
    }
  });

  /* =====================================================================
     滑車でつないだ 2 物体
     ===================================================================== */
  function solveAt(kind, m1, m2, mu, h) {
    const r = { kind: kind, m1: m1, m2: m2, mu: mu, h: h, tot: m1 + m2 };
    if (kind === 'atwood') {
      r.M = Math.max(m1, m2); r.m = Math.min(m1, m2);
      r.a = (r.M - r.m) * G / (r.M + r.m);
      r.T = 2 * r.M * r.m * G / (r.M + r.m);
      r.pull = 2 * r.T;                                     // 滑車を引く力（糸 2 本が平行）
    } else {
      r.N = m1 * G; r.f = mu * r.N;
      r.a = (m2 - mu * m1) * G / (m1 + m2);
      r.T = m1 * m2 * (1 + mu) * G / (m1 + m2);
      r.pull = Math.SQRT2 * r.T;                            // 糸 2 本が直角
    }
    if (r.a > 1e-12) { r.v = Math.sqrt(2 * r.a * h); r.t = Math.sqrt(2 * h / r.a); }
    return r;
  }

  function figAtwood(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 262 : 300);
    const px = 180, py = 62, pr = 34;
    const xl = px - pr, xr = px + pr, top = 150, bw = 46;
    const h1 = 28 + 26 * r.m1 / r.tot, h2 = 28 + 26 * r.m2 / r.tot;
    d.hatch(px - 56, 16, px + 56, 16, { side: -1 });
    d.line(px, 16, px, py, { cls: 'fg', w: 1.6 });
    d.line(xl, py, xl, top, { cls: 'fg', w: 1.6 });
    d.line(xr, py, xr, top, { cls: 'fg', w: 1.6 });
    d.circle(px, py, pr, { cls: 'fg', fill: 'f0' });
    d.dot(px, py, { cls: 'fg', r: 3 });
    d.rect(xl - bw / 2, top, bw, h1, { cls: 'fg', fill: 'f1', rx: 3 });
    d.rect(xr - bw / 2, top, bw, h2, { cls: 'fg', fill: 'f2', rx: 3 });
    d.text(xl, top + h1 / 2 + 5, prob ? 'A' : 'm₁', { size: 13, italic: !prob, bold: prob });
    d.text(xr, top + h2 / 2 + 5, prob ? 'B' : 'm₂', { size: 13, italic: !prob, bold: prob });
    d.text(180, prob ? 250 : 292, prob ? 'A: ' + pl(r.m1) + ' kg　B: ' + pl(r.m2) + ' kg' : 'm₁ = ' + pl(r.m1) + ' kg　m₂ = ' + pl(r.m2) + ' kg', { size: 12 });
    if (!prob) {
      const k = 56 / Math.max(r.m1 * G, r.m2 * G, r.T), L = (F) => Math.max(14, F * k);
      [[xl, r.m1, h1, 1, '₁'], [xr, r.m2, h2, -1, '₂']].forEach((b) => {
        d.arrow(b[0], top, b[0], top - L(r.T), { cls: 'c1', label: 'T', lpos: b[3], w: 2.2 });
        d.arrow(b[0], top + b[2] / 2, b[0], top + b[2] / 2 + L(b[1] * G), { cls: 'c3', label: 'm' + b[4] + 'g', lpos: -b[3], w: 2.2 });
      });
      if (r.a > 1e-9) {
        const heavyLeft = r.m1 > r.m2;
        const xa1 = xl - bw / 2 - 16, xa2 = xr + bw / 2 + 16, ay = top + 12;
        d.arrow(xa1, heavyLeft ? ay : ay + 36, xa1, heavyLeft ? ay + 36 : ay, { cls: 'c4', label: 'a', w: 1.8 });
        d.arrow(xa2, heavyLeft ? ay + 36 : ay, xa2, heavyLeft ? ay : ay + 36, { cls: 'c4', label: 'a', w: 1.8 });
      } else {
        d.text(180, 272, 'つり合っている（a = 0）', { cls: 'c4', size: 12, bold: true });
      }
    }
    return d.svg();
  }

  function figTable(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 266 : 276);
    const ty = 104, tx1 = 16, tx2 = 232;
    const pcx = tx2 + 14, pcy = ty, prr = 14;
    const wA = 46, hA = 28, xA = 138, ya = ty - hA / 2;
    const bw = 40, bTop = 160, bh = 34, bx = pcx + prr;
    d.poly([[tx1, ty], [tx2, ty], [tx2, 228], [tx1, 228]], { cls: 'fg', fill: 'f0' });
    d.line(xA + wA, ya, pcx, ya, { cls: 'fg', w: 1.6 });
    d.arc(pcx, pcy, prr, 90, 0, { cls: 'fg', w: 1.6 });
    d.line(bx, pcy, bx, bTop, { cls: 'fg', w: 1.6 });
    d.circle(pcx, pcy, prr, { cls: 'fg', fill: 'f0' });
    d.dot(pcx, pcy, { cls: 'fg', r: 2.5 });
    d.rect(xA, ty - hA, wA, hA, { cls: 'fg', fill: 'f1', rx: 3 });
    d.rect(bx - bw / 2, bTop, bw, bh, { cls: 'fg', fill: 'f2', rx: 3 });
    d.text(xA + wA / 2, ya + 5, 'A', { size: 14, bold: true });
    d.text(bx, bTop + bh / 2 + 5, 'B', { size: 14, bold: true });
    d.text(110, 168, r.mu > 0 ? 'あらい机（μ′ = ' + pl(r.mu) + '）' : 'なめらかな机', { cls: 'dim', size: 11 });
    d.text(110, 188, 'A: m₁ = ' + pl(r.m1) + ' kg', { size: 12 });
    d.text(110, 206, 'B: m₂ = ' + pl(r.m2) + ' kg', { size: 12 });
    if (!prob) {
      const k = 52 / Math.max(r.m2 * G, r.T, r.f || 0), L = (F) => Math.max(14, F * k);
      d.arrow(xA + wA, ya, xA + wA + Math.min(L(r.T), 56), ya, { cls: 'c1', label: 'T', w: 2.2 });
      if (r.mu > 0) d.arrow(xA, ya, xA - L(r.f), ya, { cls: 'c2', label: 'f', w: 2.2 });
      d.arrow(bx, bTop, bx, bTop - L(r.T), { cls: 'c1', label: 'T', lpos: -1, w: 2.2 });
      d.arrow(bx, bTop + bh / 2, bx, bTop + bh / 2 + L(r.m2 * G), { cls: 'c3', label: 'm₂g', lpos: 1, w: 2.2 });
      d.arrow(xA + 4, ty - hA - 14, xA + 42, ty - hA - 14, { cls: 'c4', label: 'a', w: 1.8 });
      d.arrow(bx + bw / 2 + 14, bTop + 4, bx + bw / 2 + 14, bTop + 40, { cls: 'c4', label: 'a', w: 1.8 });
      d.text(180, 266, '机の上の A には、重力と垂直抗力（つり合い）も作用する', { cls: 'dim', size: 10 });
    }
    return d.svg();
  }

  const figAt = (r, o) => (r.kind === 'atwood' ? figAtwood(r, o) : figTable(r, o));

  // o.names: 演習用。[物体 1 の名前, 物体 2 の名前]（問題文の A, B）を重い方・軽い方に添える
  // o.noH: 演習用。問題文に動く距離 h が書かれていないとき、h を使う「速さと時間」の段を出さない
  function atwoodSteps(r, o) {
    o = o || {};
    const M = r.M, m = r.m;
    const eq = Math.abs(M - m) < 1e-12;
    const hasH = !eq && !o.noH;
    const nameM = o.names && !eq ? '（' + (r.m1 > r.m2 ? o.names[0] : o.names[1]) + '）' : '';
    const nameL = o.names && !eq ? '（' + (r.m1 > r.m2 ? o.names[1] : o.names[0]) + '）' : '';
    // T = m(g + a) と、h を使う段に代入する a（丸めた値を代入して結果が 1 つずれる、を防ぐため、必要なら桁を増やす）
    const aS = fit([r.a], (a) => [m * (G + a)].concat(hasH ? [Math.sqrt(2 * a * r.h), Math.sqrt(2 * r.h / a)] : []), [r.T].concat(hasH ? [r.v, r.t] : []))[0];
    const steps = [];
    steps.push({
      t: '状況を整理する（動く向きと張力）',
      n: R`重い方` + nameM + R`の質量を $M = ` + nf(M) + R`\,\mathrm{kg}$、軽い方` + nameL + R`の質量を $m = ` + nf(m) + R`\,\mathrm{kg}$ とします。重い方が下がり、軽い方が上がります。軽くて伸びない糸でつながっているので、2 つの物体は**同じ大きさの加速度 $a$** で動き、なめらかな滑車にかけた糸の**張力 $T$ はどこでも同じ**です。` +
        (eq ? R`ここでは $M = m$ なので、つり合って動きません（$a = 0$）。` : ''),
      easy: R`糸の両端にぶら下げた物体のうち、重い方が下がります。大切なのは、「糸が伸びないので、片方が 1 m 下がれば、もう片方はちょうど 1 m 上がる」ことです。だから 2 つの物体の速さも加速度も同じ大きさになります。2 つの物体について、運動方程式を別々に立てます。`,
      pro: R`動く向きを正に取る（軽い方は上向き、重い方は下向き）と、符号で迷わず連立できます。`
    });
    steps.push({
      t: '物体ごとに運動方程式を立てる',
      m: [R`\text{軽い方（上向きが正）: } ma = T - mg`, R`\text{重い方（下向きが正）: } Ma = Mg - T`],
      n: R`運動方程式 $ma = (\text{合力})$ を、動く向きを正として立てます。軽い方は、上向きの張力 $T$ から下向きの重力 $mg$ を引いた力が合力です。重い方は、下向きの重力 $Mg$ から上向きの張力 $T$ を引いた力が合力です。`,
      easy: R`運動方程式は「質量 × 加速度 = 力の合計」です。軽い方は糸に上へ引かれ（$T$）、重力に下へ引かれます（$mg$）。引く力の方が大きいから上がる、と式でも表します。重い方は逆に、重力 $Mg$ の方が糸の引く力 $T$ より大きいので下がります。`
    });
    steps.push({
      t: '2 式を足して加速度 $a$ を求める',
      m: [R`(M+m)a = (M-m)g`, R`a = \frac{M-m}{M+m}g = \frac{` + nf(M) + ' - ' + nf(m) + '}{' + nf(M) + ' + ' + nf(m) + R`} \times 9.8 = ` + sig(r.a) + MS2],
      n: R`2 つの式を辺々足すと $T$ が消えて、$(M+m)a = Mg - mg$ になります。これは、「全体の質量 $M+m$ の物体に、重さの差 $(M-m)g$ が正味の力としてはたらく」という意味です。`,
      easy: R`2 つの式を足し算すると、$+T$ と $-T$ が消えて $a$ だけの式になります。重い方の重さと軽い方の重さが引き合って、その差 $(M-m)g$ が全体（質量 $M+m$）を動かしている、とイメージすると分かりやすいです。2 つの物体の質量が等しいと差が 0 になり、動きません。`,
      pro: R`$a = \frac{M-m}{M+m}g$ は結果を覚えておく形（質量差 ÷ 質量和 × $g$）。$M$ が $m$ よりはるかに大きければ $a \to g$、$M = m$ なら $a = 0$。`
    });
    steps.push({
      t: '糸の張力 $T$ を求める',
      m: [R`T = m(g + a)`,
        R`T = ` + nf(m) + R` \times (9.8 + ` + aS + ') = ' + sig(r.T) + NN,
        R`T = \frac{2Mm}{M+m}g = \frac{2 \times ` + nf(M) + R` \times ` + nf(m) + '}{' + nf(M) + ' + ' + nf(m) + R`} \times 9.8 = ` + sig(r.T) + NN],
      n: R`軽い方の式 $ma = T - mg$ を $T$ について解いて、求めた $a$ を代入します。` + unrounded('a', aS, r.a, MS2) + R`$a$ の式を代入して整理すると $T = \frac{2Mm}{M+m}g$ となり、この式で計算しても同じ値になります。重い方の式 $Ma = Mg - T$ からも同じ値になります（検算）。`,
      easy: R`軽い方の式を「$T = \cdots$」の形に直して、先に求めた $a$ を入れます。上向きに加速している軽い方を引く力 $T$ は、重さ $mg$ より大きくなります。`,
      pro: R`$T = \frac{2Mm}{M+m}g$（調和平均型）。$M = m$ のとき $T = mg$、静止のときの値と一致する。`
    });
    if (hasH) {
      steps.push({
        t: 'h だけ動いた後の速さと時間',
        m: [R`v^{2} = 2ah \;\Rightarrow\; v = \sqrt{2ah} = \sqrt{2 \times ` + aS + R` \times ` + nf(r.h) + '} = ' + sig(r.v) + MS,
          R`h = \frac{1}{2}at^{2} \;\Rightarrow\; t = \sqrt{\frac{2h}{a}} = \sqrt{\frac{2 \times ` + nf(r.h) + '}{' + aS + R`}} = ` + sig(r.t) + SEC],
        n: R`加速度が一定なので、静止状態から動き出す等加速度直線運動の公式が使えます。` + unrounded('a', aS, r.a, MS2),
        easy: R`加速度が一定の運動では、$v^{2} - v_{0}^{2} = 2ax$ と $x = v_{0}t + \frac{1}{2}at^{2}$ が使えます。静かにはなした（$v_{0} = 0$）ので、距離 $h$ 動いたときの速さと時間がそれぞれ求まります。`,
        lv: 2
      });
    }
    steps.push({
      t: '滑車を支える力（参考）',
      m: [R`F_{\text{滑車}} = 2T = 2 \times \frac{2Mm}{M+m}g = 2 \times \frac{2 \times ` + nf(M) + R` \times ` + nf(m) + '}{' + nf(M) + ' + ' + nf(m) + R`} \times 9.8 = ` + sig(r.pull) + NN],
      n: R`糸は滑車の両側で下向きに引くので、滑車（と天井）には $2T$ の力がかかります。2 つの物体を合わせた重さ $(M+m)g$ とは一般に一致しません（動いているときは $2T < (M+m)g$）。`,
      lv: 2
    });
    return steps;
  }

  // o.noH: 演習用。問題文に動く距離 h が書かれていないとき、h を使う「速さと時間」を出さない
  // o.sqrt2: 演習用。問題文で √2 をこの値（1.41）とするとき、滑車を支える力をこの値で計算して表示する
  // o.askV / o.askF: 演習用。速さ v / 滑車が受ける力を問うとき、その段を lv 1 にする
  // o.pullSym: 演習用。滑車が受ける力の記号（問題文の F）。省略すると F_滑車
  // o.given: 演習用。問題の値と記号を結びつける文
  function tableSteps(r, o) {
    o = o || {};
    const fr = r.mu > 0;
    const hasA = r.a > 1e-12;
    const hasH = hasA && !o.noH;
    const k2 = o.sqrt2 != null ? o.sqrt2 : Math.SQRT2;
    // T = m₂(g − a)・h を使う段に代入する a（必要なら桁を増やす）と、滑車が受ける力に代入する T
    const aS = fit([r.a], (a) => [r.m2 * (G - a)].concat(hasH ? [Math.sqrt(2 * a * r.h), Math.sqrt(2 * r.h / a)] : []), [r.T].concat(hasH ? [r.v, r.t] : []))[0];
    const TS = fit([r.T], (T) => k2 * T, k2 * r.T)[0];
    const steps = [];
    steps.push({
      t: '力を図に描き、向きを決める',
      n: (o.given || '') + R`机の上の物体 A（質量 $m_{1}$）には、**糸の張力 $T$**（滑車の向き）` + (fr ? R`と**動摩擦力 $f$**（逆向き）` : '') +
        R`がはたらきます。つるした物体 B（質量 $m_{2}$）には、**重力 $m_{2}g$**（下向き）と**糸の張力 $T$**（上向き）がはたらきます。糸は軽くて伸びず、滑車はなめらかなので、A と B は**同じ大きさの加速度 $a$** で動き、張力 $T$ は糸のどこでも同じです。A が滑車に近づく向きと B が下がる向きを、それぞれ正の向きに取ります。`,
      easy: R`糸でつながった物体は、A が滑車の方へ 1 m 進めば、B もちょうど 1 m 下がります。だから 2 つの物体の速さと加速度は同じ大きさです。「動く向き」を正の向きにそろえておくと、符号で迷いません。机の上の A は、重力と垂直抗力がつり合っているので、水平方向の力だけを考えます。`,
      pro: R`A と B で正の向きを別々に取ってよい（A は滑車向き、B は下向き）。糸が伸びない限り加速度の大きさは同じ。`
    });
    if (fr) {
      steps.push({
        t: '垂直抗力と動摩擦力',
        m: [R`N = m_{1}g,\quad f = \mu' N = \mu' m_{1}g = ` + nf(r.mu) + R` \times ` + nf(r.m1) + R` \times 9.8 = ` + sig(r.f) + NN],
        n: R`A は鉛直方向に動かないので、垂直抗力は重力と等しく $N = m_{1}g$。動摩擦力は $f = \mu' N = \mu' m_{1}g$ です。`,
        easy: R`机が A を押し返す力（垂直抗力）は A の重さと同じです。すべっているときの摩擦力は、その $\mu'$ 倍です。`,
        lv: 2
      });
    }
    steps.push({
      t: '物体ごとに運動方程式を立てる',
      m: fr
        ? [R`\text{A（滑車向きが正）: } m_{1}a = T - \mu' m_{1}g`, R`\text{B（下向きが正）: } m_{2}a = m_{2}g - T`]
        : [R`\text{A（滑車向きが正）: } m_{1}a = T`, R`\text{B（下向きが正）: } m_{2}a = m_{2}g - T`],
      n: R`運動方程式 $ma = (\text{合力})$ を A, B それぞれに立てます。A は糸に引かれて進み、` + (fr ? R`摩擦力 $\mu' m_{1}g$ が逆向きにはたらきます。` : R`水平方向の力は $T$ だけです。`) + R`B は重力 $m_{2}g$ で下へ引かれ、糸の張力 $T$ で上へ引かれます。`,
      easy: R`運動方程式は「質量 × 加速度 = 力の合計」です。A を動かしているのは糸の張力 $T$ だけ` + (fr ? R`（摩擦力 $\mu' m_{1}g$ がブレーキ）` : '') + R`、B を動かしているのは重力 $m_{2}g$ から糸の張力 $T$ を引いた力です。未知数は $a$ と $T$ の 2 つ、式も 2 本です。`
    });
    steps.push({
      t: '2 式を足して加速度 $a$ を求める',
      m: fr
        ? [R`(m_{1}+m_{2})a = m_{2}g - \mu' m_{1}g`, R`a = \frac{m_{2} - \mu' m_{1}}{m_{1}+m_{2}}g = \frac{` + nf(r.m2) + ' - ' + nf(r.mu) + R` \times ` + nf(r.m1) + '}{' + nf(r.m1) + ' + ' + nf(r.m2) + R`} \times 9.8 = ` + sig(r.a) + MS2]
        : [R`(m_{1}+m_{2})a = m_{2}g`, R`a = \frac{m_{2}}{m_{1}+m_{2}}g = \frac{` + nf(r.m2) + '}{' + nf(r.m1) + ' + ' + nf(r.m2) + R`} \times 9.8 = ` + sig(r.a) + MS2],
      n: R`2 つの式を辺々足すと、$T$ が消えます。B にはたらく重力 $m_{2}g$ が、全体（質量 $m_{1}+m_{2}$）を動かす力になっています` + (fr ? R`（そのうち $\mu' m_{1}g$ は摩擦力に使われます）。` : R`。`),
      easy: R`足し算すると $+T$ と $-T$ が打ち消し合って、$a$ だけの式になります。「B の重さが、A と B の両方を動かしている」と考えると、加速度は $g$ より小さくなるはずです（B だけが自由落下するなら $g$ ですが、A も一緒に動かすぶん遅くなります）。`,
      pro: R`$a = \frac{m_{2} - \mu' m_{1}}{m_{1}+m_{2}}g$。全体を 1 つの物体とみて、外力は「B の重さ − A への摩擦」。`
    });
    steps.push({
      t: '糸の張力 $T$ を求める',
      m: [R`T = m_{2}(g - a)`,
        R`T = ` + nf(r.m2) + R` \times (9.8 - ` + aS + ') = ' + sig(r.T) + NN,
        R`T = \frac{m_{1}m_{2}` + (fr ? R`(1+\mu')` : '') + R`}{m_{1}+m_{2}}g = \frac{` + nf(r.m1) + R` \times ` + nf(r.m2) + (fr ? R` \times (1 + ` + nf(r.mu) + ')' : '') + '}{' + nf(r.m1) + ' + ' + nf(r.m2) + R`} \times 9.8 = ` + sig(r.T) + NN],
      n: R`B の式 $m_{2}a = m_{2}g - T$ を $T$ について解いて代入します。` + unrounded('a', aS, r.a, MS2) + R`A の式 $m_{1}a = T` + (fr ? R` - \mu' m_{1}g` : '') + R`$ から出しても同じ値です（検算）。$T$ は $m_{2}g$ より小さくなります（B が下へ加速しているため）。`,
      easy: R`B の式を「$T = \cdots$」の形に直して、先に求めた $a$ を入れます。B は下に加速しているので、重さ $m_{2}g$ に糸の力 $T$ が負けています。つまり $T < m_{2}g$ になります。`,
      pro: R`$T$ は $m_{2}g$ より必ず小さい（B は加速して下がる）。この大小関係で答えの妥当性を確かめる。`
    });
    if (hasH) {
      steps.push({
        t: 'h だけ動いた後の速さと時間',
        m: [R`v^{2} = 2ah \;\Rightarrow\; v = \sqrt{2ah} = \sqrt{2 \times ` + aS + R` \times ` + nf(r.h) + '} = ' + sig(r.v) + MS,
          R`h = \frac{1}{2}at^{2} \;\Rightarrow\; t = \sqrt{\frac{2h}{a}} = \sqrt{\frac{2 \times ` + nf(r.h) + '}{' + aS + R`}} = ` + sig(r.t) + SEC],
        n: R`B が $h = ` + nf(r.h) + R`\,\mathrm{m}$ 下がる間（A が $h$ だけ進む間）、加速度は一定なので、静止状態から動き出す等加速度直線運動の公式が使えます。` + unrounded('a', aS, r.a, MS2),
        easy: R`静かにはなして距離 $h$ 動いたときの速さは $v = \sqrt{2ah}$、かかる時間は $t = \sqrt{2h/a}$ です。`,
        lv: o.askV ? 1 : 2
      });
    }
    if (hasA) {
      // 演習で問題文に √2 = 1.41 と書いたときは、その値で計算した表示にして、答え（1.41 × T）と合わせる
      const PS = o.pullSym || R`F_{\text{滑車}}`;
      steps.push({
        t: '滑車を支える力',
        m: [PS + R` = \sqrt{2}\,T`,
          PS + R` = ` + (o.sqrt2 != null ? nf(o.sqrt2) : R`\sqrt{2}`) + R` \times ` + TS + ' = ' + sig(k2 * r.T) + NN],
        n: R`滑車にかかる力は、水平な糸（$T$）と鉛直な糸（$T$）の合力で、大きさは $\sqrt{2}\,T$（向きは斜め下 45°）です。` + unrounded('T', TS, r.T, NN),
        easy: R`滑車は、横向きの糸と下向きの糸の 2 本で引かれるので、この 2 つの力（どちらも大きさ $T$）を直角に合成した $\sqrt{2}\,T$ の力を受けます。`,
        lv: o.askF ? 1 : 2
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'mech-atwood',
    field: '力学',
    unit: 'p-eom',
    title: '滑車でつないだ 2 物体（アトウッドの装置・机上の物体）',
    desc: R`なめらかな滑車に軽い糸をかけた 2 物体について、加速度 $a$・糸の張力 $T$・動いた後の速さを求めます。「定滑車の両側に物体をつるす」場合と、「机の上の物体 $m_{1}$ をつるした物体 $m_{2}$ が引く」場合（動摩擦係数 $\mu'$ つき）を選べます。`,
    form: [R`ma = T - mg,\quad Ma = Mg - T`, R`a = \frac{M-m}{M+m}g`, R`a = \frac{m_{2} - \mu' m_{1}}{m_{1}+m_{2}}g`],
    inputs: [
      { key: 'kind', label: '装置の種類', type: 'select', def: 'atwood', options: [['atwood', '定滑車の両側に物体をつるす'], ['table', '机の上の m₁ を、つるした m₂ が引く']] },
      { key: 'm1', label: '物体 1 の質量 m₁', unit: 'kg', type: 'num', def: '2.0', min: 0.01, max: 1000 },
      { key: 'm2', label: '物体 2 の質量 m₂', unit: 'kg', type: 'num', def: '3.0', min: 0.01, max: 1000 },
      { key: 'mu', label: '机と物体 1 の動摩擦係数 μ′', type: 'num', def: '0', min: 0, max: 5, hint: '0 でなめらかな机', show: (raw) => raw.kind === 'table' },
      { key: 'h', label: '動く距離 h', unit: 'm', type: 'num', def: '1.0', min: 0.01, max: 1000, hint: '静かにはなしてから h だけ動いたときの速さ・時間を求めます' }
    ],
    examples: [
      { label: '定滑車（2.0 kg と 3.0 kg）', v: { kind: 'atwood', m1: '2.0', m2: '3.0', mu: '0', h: '1.0' } },
      { label: '質量が等しい（つり合い）', v: { kind: 'atwood', m1: '2.0', m2: '2.0', mu: '0', h: '1.0' } },
      { label: '机上（なめらか）', v: { kind: 'table', m1: '2.0', m2: '1.0', mu: '0', h: '1.0' } },
      { label: '机上（μ′ = 0.20）', v: { kind: 'table', m1: '2.0', m2: '3.0', mu: '0.20', h: '1.5' } }
    ],
    intro: {
      easy: R`滑車に軽い糸をかけて 2 つの物体をつなぐと、**糸が伸びないので 2 つの物体は同じ大きさの加速度**で動き、**糸の張力はどこでも同じ**になります。解き方は連結体と同じで、物体ごとに運動方程式（質量 × 加速度 = 力の合計）を立てて、$a$ と $T$ を求めます。ポイントは、「動く向きを正の向きにそろえる」ことです。たとえば、片方が下がるときは下向きを、もう片方が上がるときは上向きを正にします。`,
      normal: R`定滑車: $ma = T - mg$、$Ma = Mg - T$ → $a = \frac{M-m}{M+m}g$。机上: $m_{1}a = T - \mu' m_{1}g$、$m_{2}a = m_{2}g - T$ → $a = \frac{m_{2} - \mu' m_{1}}{m_{1}+m_{2}}g$。`,
      pro: R`全体を 1 つの物体とみなし、「動かそうとする力 ÷ 全質量」で $a$ を先に出す。張力は片方の式に代入して求める。滑車が受ける力は $2T$（鉛直 2 本）または $\sqrt{2}\,T$（直角 2 本）。`
    },
    compute(v) {
      const kind = v.kind;
      const mu = kind === 'table' ? v.mu : 0;
      const r = solveAt(kind, v.m1, v.m2, mu, v.h);
      if (kind === 'table' && !(r.a > 1e-9)) {
        throw new JK.CalcError('この条件では物体は動き出しません（つるした m₂ の重さ m₂g が、動摩擦力 μ′m₁g 以下のため）。m₂ を大きくするか μ′ を小さくしてください。');
      }
      const res = [
        { label: '加速度 a', tex: sig(r.a) + MS2 },
        { label: '糸の張力 T', tex: sig(r.T) + NN }
      ];
      if (r.a > 1e-9) {
        res.push({ label: U.fmt(v.h, 3) + ' m 動いた後の速さ v', tex: sig(r.v) + MS });
        res.push({ label: 'かかる時間 t', tex: sig(r.t) + SEC });
      }
      res.push({ label: '滑車が糸から受ける力', tex: sig(r.pull) + NN });
      return {
        result: res,
        steps: kind === 'atwood' ? atwoodSteps(r) : tableSteps(r),
        fig: figAt(r)
      };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      if (level === 'basic') {
        // (軽い方, 重い方) の質量 [kg]。a = (M−m)g/(M+m)、T = 2Mmg/(M+m) が、有効数字 3 桁で書いたとき解説の表示と答えがずれない値
        // （T = 36.75 のように 3 桁目の四捨五入の境目になる組は除く）になる組だけ。A が重いか B が重いかも乱数で決める
        const pr = rng.pick([[0.5, 1.5], [0.5, 2.0], [0.5, 3.0], [1.0, 1.5], [1.0, 2.5], [1.0, 3.0], [1.0, 4.0], [1.0, 6.0], [1.5, 2.0],
          [1.5, 2.5], [2.0, 3.0], [2.0, 5.0], [2.0, 6.0], [2.0, 8.0], [3.0, 4.0], [4.0, 6.0], [6.0, 8.0]]);
        const aLight = rng.bool(0.5);
        const mA = aLight ? pr[0] : pr[1], mB = aLight ? pr[1] : pr[0];
        const r = solveAt('atwood', mA, mB, 0, 1.0);
        return {
          title: '定滑車にかけた 2 つの物体',
          body: R`質量 $` + mA.toFixed(1) + R`\,\mathrm{kg}$ の物体 A と質量 $` + mB.toFixed(1) + R`\,\mathrm{kg}$ の物体 B を軽い糸でつなぎ、なめらかな定滑車にかけて、両手で支えてから静かにはなした。糸は伸びず、滑車の質量は無視できる。` + gtxt + R`次の問いに答えよ。`,
          fig: figAtwood({ kind: 'atwood', m1: mA, m2: mB, tot: mA + mB, T: r.T, a: r.a, mu: 0 }, { problem: true }),
          parts: [
            { label: '(1)', q: R`はなした後の A, B の加速度の大きさ $a$`, type: 'num', answer: P3(r.a), rel: 0.02, unit: 'm/s²' },
            { label: '(2)', q: R`糸の張力の大きさ $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 'N' }
          ],
          solution: atwoodSteps(r, { names: ['A', 'B'], noH: true })
        };
      }
      if (level === 'mid') {
        const m1 = rng.pick([1.0, 2.0, 3.0, 4.0]);
        const m2 = rng.pick([1.0, 2.0, 3.0]);
        const h = rng.pick([0.50, 1.0, 2.0]);
        const r = solveAt('table', m1, m2, 0, h);
        return {
          title: '机の上の物体とつるした物体',
          body: R`なめらかな水平な机の上に質量 $` + m1.toFixed(1) + R`\,\mathrm{kg}$ の物体 A を置き、軽い糸を机の端のなめらかな滑車にかけて、質量 $` + m2.toFixed(1) + R`\,\mathrm{kg}$ の物体 B をつるした。A を手で支えてから静かにはなしたところ、A は机の上を、B は鉛直に動き出した。` + gtxt + R`次の問いに答えよ。`,
          fig: figTable({ kind: 'table', m1: m1, m2: m2, tot: m1 + m2, mu: 0, T: r.T, a: r.a, f: 0 }, { problem: true }),
          parts: [
            { label: '(1)', q: R`A, B の加速度の大きさ $a$`, type: 'num', answer: P3(r.a), rel: 0.02, unit: 'm/s²' },
            { label: '(2)', q: R`糸の張力の大きさ $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 'N' },
            { label: '(3)', q: R`B が $` + h.toFixed(2) + R`\,\mathrm{m}$ 下がったときの B の速さ $v$`, type: 'num', answer: P3(Math.sqrt(2 * r.a * h)), rel: 0.02, unit: 'm/s' }
          ],
          solution: tableSteps(r, { askV: true, given: R`A の質量を $m_{1} = ` + m1.toFixed(1) + R`\,\mathrm{kg}$、B の質量を $m_{2} = ` + m2.toFixed(1) + R`\,\mathrm{kg}$ とします。` })
        };
      }
      // adv: あらい机 + 滑車が受ける力
      let m1, m2, mu;
      for (let i = 0; i < 100; i++) {
        m1 = rng.pick([1.0, 2.0, 3.0, 4.0]);
        m2 = rng.pick([2.0, 3.0, 4.0, 5.0]);
        mu = rng.pick([0.10, 0.20, 0.25, 0.30]);
        if (m2 > 1.8 * mu * m1 + 0.5) break;
      }
      const h = rng.pick([0.50, 1.0, 2.0]);
      const r = solveAt('table', m1, m2, mu, h);
      return {
        title: 'あらい机上の物体とつるした物体',
        body: R`水平なあらい机の上に質量 $` + m1.toFixed(1) + R`\,\mathrm{kg}$ の物体 A を置き、軽い糸を机の端のなめらかな滑車にかけて、質量 $` + m2.toFixed(1) + R`\,\mathrm{kg}$ の物体 B をつるした。A と机の間の動摩擦係数は $` + mu.toFixed(2) + R`$ で、手をはなすと A, B は動き出した。` + gtxt + R`$\sqrt{2} = 1.41$ として、次の問いに答えよ。`,
        fig: figTable({ kind: 'table', m1: m1, m2: m2, tot: m1 + m2, mu: mu, T: r.T, a: r.a, f: r.f }, { problem: true }),
        parts: [
          { label: '(1)', q: R`A, B の加速度の大きさ $a$`, type: 'num', answer: P3(r.a), rel: 0.02, unit: 'm/s²' },
          { label: '(2)', q: R`糸の張力の大きさ $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 'N' },
          { label: '(3)', q: R`滑車が 2 本の糸から受ける力の大きさ $F$`, type: 'num', answer: P3(1.41 * r.T), rel: 0.02, unit: 'N' }
        ],
        solution: tableSteps(r, {
          noH: true, sqrt2: 1.41, askF: true, pullSym: 'F',
          given: R`A の質量を $m_{1} = ` + m1.toFixed(1) + R`\,\mathrm{kg}$、B の質量を $m_{2} = ` + m2.toFixed(1) + R`\,\mathrm{kg}$、動摩擦係数を $\mu' = ` + mu.toFixed(2) + R`$ とします。`
        })
      };
    }
  });
})();
