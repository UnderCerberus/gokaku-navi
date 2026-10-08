/* 数II・B — 三角関数: 弧度法と扇形 / 一般角 / 加法定理・2倍角・半角 / 三角関数の合成 / 三角方程式・不等式
   構成は ia-quad.js に準拠（intro → result → steps(easy / pro / lv) → fig）。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util;
  const PI = Math.PI, D2R = PI / 180;

  /* ================= 共通ヘルパ ================= */

  // 波括弧の外側（最上位）に + / - があるか（積に使うとき括弧が要るか）
  function hasTopOp(t) {
    let depth = 0;
    for (let i = 0; i < t.length; i++) {
      const c = t.charAt(i);
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (depth === 0 && (c === '+' || c === '-')) return true;
    }
    return false;
  }
  const par = (t) => (hasTopOp(t) ? R`\left(` + t + R`\right)` : t);
  const pa = (t) => R`\left(` + t + R`\right)`;
  const pw = (q, e) => ((q.isInt() && q.sign() >= 0) ? q.tex() : R`\left(` + q.tex() + R`\right)`) + '^{' + e + '}';
  const fm = (x, n) => U.fmt(x, n == null ? 4 : n);

  // kπ（k は Q）の TeX / 図用の文字列
  function kpi(k) {
    if (k.isZero()) return '0';
    const a = k.abs();
    const num = a.n === 1 ? R`\pi` : a.n + R`\pi`;
    return (k.sign() < 0 ? '-' : '') + (a.d === 1 ? num : R`\frac{` + num + '}{' + a.d + '}');
  }
  function kpiT(k) {
    if (k.isZero()) return '0';
    const a = k.abs();
    const num = a.n === 1 ? 'π' : a.n + 'π';
    return (k.sign() < 0 ? '−' : '') + (a.d === 1 ? num : num + '/' + a.d);
  }
  const degToK = (deg) => Q(Math.round(deg), 180);
  const isMul15 = (x) => Math.abs(x / 15 - Math.round(x / 15)) < 1e-7;
  const degT = (d) => (Number.isInteger(d) ? String(d) : U.fmt(d, 2)) + R`\degree`;
  const degArg = (d) => (d < 0 ? R`\left(` + degT(d) + R`\right)` : degT(d));
  // \sin 30\degree / \sin\left(-30\degree\right)
  const trg = (name, d) => '\\' + name + (d < 0 ? R`\left(` + degT(d) + R`\right)` : ' ' + degT(d));
  const sgn0 = (x) => (Math.abs(x) < 1e-12 ? 0 : (x > 0 ? 1 : -1));
  const withApprox = (tex, val) => (/\\sqrt/.test(tex) ? tex + R` \approx ` + fm(val, 4) : tex);

  /* ---------- Q(√2, √3) の数（基底 1, √2, √3, √6）: 15° 刻みの三角比を厳密に計算する ---------- */
  const mk = (a, b, c, d) => [Q.from(a), Q.from(b), Q.from(c), Q.from(d)];
  const sCon = (n) => mk(n, 0, 0, 0);
  const sNeg = (x) => x.map((q) => q.neg());
  const sAdd = (x, y) => x.map((q, i) => q.add(y[i]));
  const sSub = (x, y) => x.map((q, i) => q.sub(y[i]));
  const sIsZero = (x) => x.every((q) => q.isZero());
  const sEq = (x, y) => x.every((q, i) => q.eq(y[i]));
  const SV = [1, Math.SQRT2, Math.sqrt(3), Math.sqrt(6)];
  const sVal = (x) => x.reduce((s, q, i) => s + q.val() * SV[i], 0);
  const MT = [
    [[1, 0], [1, 1], [1, 2], [1, 3]],
    [[1, 1], [2, 0], [1, 3], [2, 2]],
    [[1, 2], [1, 3], [3, 0], [3, 1]],
    [[1, 3], [2, 2], [3, 1], [6, 0]]
  ];
  function sMul(x, y) {
    const r = sCon(0);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (x[i].isZero() || y[j].isZero()) continue;
        const t = MT[i][j];
        r[t[1]] = r[t[1]].add(x[i].mul(y[j]).mul(t[0]));
      }
    }
    return r;
  }
  const SG = [[1, -1, 1, -1], [1, 1, -1, -1], [1, -1, -1, 1]];
  const sConj = (x, k) => x.map((q, i) => (SG[k][i] === 1 ? q : q.neg()));
  function sInv(x) {
    const m = sMul(sMul(sConj(x, 0), sConj(x, 1)), sConj(x, 2));
    const N = sMul(x, m)[0];
    if (N.isZero()) throw new JK.CalcError('0 では割れません');
    return m.map((q) => q.div(N));
  }
  // TeX（項の順は 定数, √6, √3, √2。分母は共通にまとめる）
  function sTex(x) {
    let L = 1;
    x.forEach((q) => { L = U.lcm(L, q.d); });
    const ints = x.map((q) => q.n * (L / q.d));
    const NAMES = ['', R`\sqrt{2}`, R`\sqrt{3}`, R`\sqrt{6}`];
    const terms = [0, 3, 2, 1].filter((i) => ints[i] !== 0).map((i) => ({ c: ints[i], i: i }));
    if (!terms.length) return '0';
    const allNeg = terms.every((t) => t.c < 0) && L > 1;
    if (allNeg) {
      terms.forEach((t) => { t.c = -t.c; });
    } else if (terms[0].c < 0) {
      const k = terms.findIndex((t) => t.c > 0);
      if (k > 0) terms.unshift(terms.splice(k, 1)[0]);
    }
    let num = '';
    terms.forEach((t, idx) => {
      const ab = Math.abs(t.c);
      const body = t.i === 0 ? String(ab) : (ab === 1 ? '' : String(ab)) + NAMES[t.i];
      num += idx === 0 ? (t.c < 0 ? '-' : '') + body : (t.c < 0 ? ' - ' : ' + ') + body;
    });
    return L === 1 ? num : (allNeg ? '-' : '') + R`\frac{` + num + '}{' + L + '}';
  }
  // 項の連結: a + b（b が負なら a - |b|）
  function joinTerms(a, b) {
    if (a === '0') return b;
    if (b === '0') return a;
    return b.charAt(0) === '-' ? a + ' ' + b : a + ' + ' + b;
  }
  const prodTex = (x, y) => par(sTex(x)) + R` \cdot ` + par(sTex(y));
  // 15° の倍数（整数度）の sin, cos, tan
  const TBL = {
    0: [mk(0, 0, 0, 0), mk(1, 0, 0, 0), mk(0, 0, 0, 0)],
    15: [mk(0, '-1/4', 0, '1/4'), mk(0, '1/4', 0, '1/4'), mk(2, 0, -1, 0)],
    30: [mk('1/2', 0, 0, 0), mk(0, 0, '1/2', 0), mk(0, 0, '1/3', 0)],
    45: [mk(0, '1/2', 0, 0), mk(0, '1/2', 0, 0), mk(1, 0, 0, 0)],
    60: [mk(0, 0, '1/2', 0), mk('1/2', 0, 0, 0), mk(0, 0, 1, 0)],
    75: [mk(0, '1/4', 0, '1/4'), mk(0, '-1/4', 0, '1/4'), mk(2, 0, 1, 0)],
    90: [mk(1, 0, 0, 0), mk(0, 0, 0, 0), null]
  };
  function tvS(deg) {
    const d = ((Math.round(deg) % 360) + 360) % 360;
    let ref, ss, cs;
    if (d <= 90) { ref = d; ss = 1; cs = 1; }
    else if (d <= 180) { ref = 180 - d; ss = 1; cs = -1; }
    else if (d <= 270) { ref = d - 180; ss = -1; cs = -1; }
    else { ref = 360 - d; ss = -1; cs = 1; }
    const t = TBL[ref];
    return {
      s: ss > 0 ? t[0] : sNeg(t[0]),
      c: cs > 0 ? t[1] : sNeg(t[1]),
      t: t[2] === null ? null : (ss * cs > 0 ? t[2] : sNeg(t[2])),
      ref: ref, ss: ss, cs: cs
    };
  }

  /* ---------- 単位円の図 ---------- */
  const circleP = (rr, cls, dash) => ({ x: (t) => rr * Math.cos(t), y: (t) => rr * Math.sin(t), t: [0, 2 * PI], cls: cls, dash: !!dash });
  const arcP = (rr, t0, t1, cls) => ({ x: (t) => rr * Math.cos(t), y: (t) => rr * Math.sin(t), t: [t0, t1], cls: cls });
  function unitBase() {
    return { w: 320, h: 320, x: [-1.5, 1.5], y: [-1.5, 1.5], equal: true, param: [circleP(1, 'dim')], segs: [], points: [], labels: [], hlines: [], vlines: [] };
  }
  const posOf = (x, y) => (y >= 0 ? 't' : 'b') + (x >= 0 ? 'r' : 'l');
  const quadLabels = () => [
    { x: 1.18, y: 1.3, text: 'I', cls: 'dim' }, { x: -1.3, y: 1.3, text: 'II', cls: 'dim' },
    { x: -1.4, y: -1.38, text: 'III', cls: 'dim' }, { x: 1.14, y: -1.38, text: 'IV', cls: 'dim' }
  ];

  /* ================= 1. 弧度法と扇形 ================= */

  function sectorFig(degV, ok, lab) {
    const W = 330, H = 240, cx = 120, cy = 125, Rr = 92;
    const d = JK.plot.draw(W, H);
    const P = (a, rr) => [cx + rr * Math.cos(a * D2R), cy - rr * Math.sin(a * D2R)];
    d.line(cx - Rr - 16, cy, cx + Rr + 24, cy, { cls: 'dim', w: 1 });
    d.line(cx, cy + Rr + 14, cx, cy - Rr - 16, { cls: 'dim', w: 1 });
    d.circle(cx, cy, Rr, { cls: 'dim', dash: true, w: 1 });
    const a = ok ? degV : (((degV % 360) + 360) % 360);
    if (ok && a >= 359.999) {
      d.circle(cx, cy, Rr, { cls: 'c1', fill: 'f1' });
    } else if (a > 1e-6) {
      const e = P(a, Rr);
      if (ok) {
        d.path('M' + cx + ' ' + cy + ' L' + (cx + Rr) + ' ' + cy + ' A' + Rr + ' ' + Rr + ' 0 ' + (a > 180 ? 1 : 0) + ' 0 ' + e[0].toFixed(2) + ' ' + e[1].toFixed(2) + ' Z', { cls: 'c1', fill: 'f1' });
      } else {
        d.line(cx, cy, e[0], e[1], { cls: 'c1' });
      }
      d.line(cx, cy, cx + Rr, cy, { cls: 'c1' });
      d.angle(cx, cy, 24, 0, a, 'θ', { cls: 'c3' });
    }
    d.dot(cx, cy, { cls: 'fg', r: 2.5 });
    if (ok) {
      d.text(cx + Rr / 2, cy + 16, lab.r, { cls: 'c2', size: 12 });
      const m = P(a / 2, Rr + 24);
      d.text(m[0], m[1] + 4, lab.l, { cls: 'c3', size: 12 });
      const s = P(a / 2, Rr * 0.58);
      d.text(s[0], s[1] + 4, lab.s, { cls: 'fg', size: 12 });
      d.text(W - 8, 30, lab.th, { cls: 'c3', size: 13, anchor: 'end' });
    } else {
      d.text(W - 8, 30, lab.th, { cls: 'c3', size: 13, anchor: 'end' });
      d.text(W - 8, 50, '0 < θ ≦ 2π の外なので', { cls: 'dim', size: 11, anchor: 'end' });
      d.text(W - 8, 66, '扇形は考えません', { cls: 'dim', size: 11, anchor: 'end' });
    }
    return d.svg();
  }

  JK.registerCalc({
    id: 'iib-radian',
    course: 'IIB',
    unit: 'm-trig2',
    group: '三角関数',
    title: '弧度法（度とラジアン）・扇形',
    desc: R`角を度とラジアンで換算し、半径 $r$・中心角 $\theta$ の扇形の弧の長さ $l = r\theta$ と面積 $S = \frac{1}{2}r^{2}\theta$ を求めます。`,
    form: [R`180\degree = \pi\ \text{（ラジアン）}`, R`l = r\theta,\qquad S = \frac{1}{2}r^{2}\theta = \frac{1}{2}rl`],
    inputs: [
      { key: 'mode', label: '変換の向き', type: 'select', def: 'd2r', options: [['d2r', '度 → ラジアン'], ['r2d', 'ラジアン → 度']] },
      { key: 'deg', label: R`角 $\theta$（度）`, type: 'q', def: '150', min: -3600, max: 3600, show: (r) => r.mode !== 'r2d' },
      { key: 'k', label: R`$\theta = k\pi$ の $k$`, type: 'q', def: '5/6', min: -20, max: 20, show: (r) => r.mode === 'r2d', hint: R`$\theta = \frac{5\pi}{6}$ なら 5/6 と入力します。` },
      { key: 'r', label: R`扇形の半径 $r$`, type: 'q', def: '6', min: 0, max: 1000, hint: R`中心角が $0 < \theta \le 2\pi$ のとき、弧の長さ $l$ と面積 $S$ も求めます。` }
    ],
    examples: [
      { label: '150° をラジアンに', v: { mode: 'd2r', deg: '150', r: '6' } },
      { label: '5π/6 を度に', v: { mode: 'r2d', k: '5/6', r: '6' } },
      { label: '75°（半径 4）', v: { mode: 'd2r', deg: '75', r: '4' } },
      { label: '半円', v: { mode: 'd2r', deg: '180', r: '3' } },
      { label: '420°（扇形なし）', v: { mode: 'd2r', deg: '420', r: '5' } },
      { label: '負の角 −45°', v: { mode: 'd2r', deg: '-45', r: '2' } }
    ],
    intro: {
      easy: R`角の大きさは、ふつう「度」（直角 $=90\degree$、1 周 $=360\degree$）で表します。数学では、これとは別の**弧度法**（ラジアン）というものさしもよく使います。半径 $r$ の円で、**弧の長さがちょうど半径 $r$ になる中心角を 1 ラジアン**とします。
円周は $2\pi r$ なので、1 周は $2\pi$ ラジアン、半周（$180\degree$）は $\pi$ ラジアンです。この対応 $180\degree = \pi$ だけ覚えておけば、度とラジアンはいつでも行き来できます。
ラジアンで測ると、弧の長さは $l = r\theta$、扇形の面積は $S = \frac{1}{2}r^{2}\theta$ という簡単な式になります。これが弧度法を使う最大の利点です。`,
      normal: R`$180\degree = \pi$ ラジアン。度 → ラジアンは $\frac{\pi}{180}$ 倍、ラジアン → 度は $\frac{180}{\pi}$ 倍。弧長 $l = r\theta$、面積 $S = \frac{1}{2}r^{2}\theta = \frac{1}{2}rl$（$\theta$ はラジアン）。`,
      pro: R`弧度法では単位「ラジアン」を書かず $\theta = \frac{\pi}{3}$ のように書きます。三角関数のグラフや微分（$(\sin x)' = \cos x$）は $x$ がラジアンのときだけ成り立つので、数III でも必須です。`
    },
    compute(v) {
      const toRad = String(v.mode) !== 'r2d';
      const deg = toRad ? v.deg : v.k.mul(180);
      const k = toRad ? v.deg.div(180) : v.k;
      const r = v.r;
      if (r.sign() <= 0) throw new JK.CalcError('半径 r は正の数にしてください');
      const kT = kpi(k), kV = k.val() * PI;
      const sector = k.sign() > 0 && k.cmp(2) <= 0;
      const degTex = deg.tex() + R`\degree` + (deg.isInt() ? '' : R` \approx ` + fm(deg.val(), 4) + R`\degree`);
      const radTex = kT + (k.isZero() ? '' : R` \approx ` + fm(kV, 4));
      const lk = r.mul(k), sk = r.mul(r).mul(k).div(2);
      const ratio = deg.div(360);
      const steps = [];
      steps.push({
        t: 'ラジアン（弧度法）とは',
        m: [R`\theta = \frac{l}{r}\quad (l: \text{弧の長さ},\ r: \text{半径})`, R`1\text{ 周} = \frac{2\pi r}{r} = 2\pi\ \text{（ラジアン）}`],
        n: R`中心角 $\theta$ を「弧の長さ ÷ 半径」で測るのが弧度法です。半径 $r$ の円周は $2\pi r$ なので、1 周は $2\pi$ ラジアンになります。`,
        easy: R`たとえば半径 $1$ の円で、弧の長さがちょうど $1$ になるように開いた角が **1 ラジアン**（約 $57.3\degree$）です。半径が変わっても「弧の長さ ÷ 半径」は変わらないので、ものさしとして使えます。1 周の弧は円周 $2\pi r$ なので、1 周 $=2\pi r \div r = 2\pi$ ラジアンです。`,
        lv: 3
      });
      steps.push({
        t: '度とラジアンの関係',
        m: [R`180\degree = \pi\ \text{（ラジアン）}`, R`1\degree = \frac{\pi}{180}\ \text{（ラジアン）}`, R`1\ \text{（ラジアン）} = \frac{180\degree}{\pi} \approx 57.3\degree`],
        n: R`半周 $180\degree$ の弧の長さは円周の半分の $\pi r$ なので、$\theta = \frac{\pi r}{r} = \pi$ です。これが換算の基準です。`,
        easy: R`「$180\degree$ と $\pi$ は同じ大きさ」と覚えれば十分です。度 → ラジアンは「$\frac{\pi}{180}$ をかける」、ラジアン → 度は「$\pi$ を $180\degree$ に置き換える」と考えても同じ結果になります。`,
        pro: R`$30\degree=\frac{\pi}{6},\ 45\degree=\frac{\pi}{4},\ 60\degree=\frac{\pi}{3},\ 90\degree=\frac{\pi}{2},\ 120\degree=\frac{2\pi}{3},\ 135\degree=\frac{3\pi}{4},\ 150\degree=\frac{5\pi}{6}$ は暗記して即答します。`
      });
      if (toRad) {
        const mid = (deg.isInt() && !deg.isZero()) ? R` = \frac{` + deg.n + R`}{180}\pi` : '';
        steps.push({
          t: '度 → ラジアン',
          m: [R`\theta = ` + deg.tex() + R`\degree \times \frac{\pi}{180}` + mid + ' = ' + kT],
          n: R`度の数に $\frac{\pi}{180}$ をかけ、分数を約分します。答えは $\pi$ の何倍かで表すのがふつうです。`,
          easy: R`$` + deg.tex() + R`\degree$ は半周 $180\degree$ の $\frac{` + deg.tex() + R`}{180} = ` + k.tex() + R`$ 倍の大きさです。半周が $\pi$ ラジアンなので、答えは $\pi$ の $` + k.tex() + R`$ 倍、つまり $` + kT + R`$ ラジアンです。`,
          pro: R`よく使う角は暗記しているので、換算はほぼ暗算です。分母が 180 の約数でなければ小数の度（たとえば $22.5\degree$）です。`
        });
        if (deg.isInt() && !deg.isZero() && U.gcd(Math.abs(deg.n), 180) > 1) {
          const g = U.gcd(Math.abs(deg.n), 180);
          steps.push({
            t: '約分のしかた',
            m: [R`\text{` + Math.abs(deg.n) + R` と 180 の最大公約数} = ` + g, R`\frac{` + deg.n + R`}{180} = \frac{` + (deg.n / g) + '}{' + (180 / g) + '}'],
            n: R`分子と分母の最大公約数 $` + g + R`$ で割ります。`,
            easy: R`$` + Math.abs(deg.n) + R`$ と $180$ の両方を割り切れる最大の数が $` + g + R`$ です。分子・分母を $` + g + R`$ で割ると、それ以上約分できない形になります。`,
            lv: 2
          });
        }
      } else {
        steps.push({
          t: 'ラジアン → 度',
          m: [R`\theta = ` + kT + R` \;\to\; \pi \text{ を } 180\degree \text{ に置き換える}`, R`\theta = ` + par(k.tex()) + R` \times 180\degree = ` + degTex],
          n: R`$\pi$ ラジアン $=180\degree$ なので、$\pi$ の前の係数 $k$ に $180\degree$ をかけます。`,
          easy: R`$\pi$ は半周 $180\degree$ のことです。$` + kT + R`$ は「半周の $` + k.tex() + R`$ 倍」なので、$180\degree \times ` + par(k.tex()) + R` = ` + deg.tex() + R`\degree$ になります。`,
          pro: R`$\pi$ を $180\degree$ に置き換えるだけです。$\frac{5\pi}{6}$ なら $\frac{5 \times 180\degree}{6} = 150\degree$。`
        });
      }
      if (sector) {
        steps.push({
          t: '扇形の弧の長さ $l$',
          m: [R`l = r\theta`, R`l = ` + r.tex() + R` \times ` + kT + ' = ' + kpi(lk)],
          n: R`弧の長さは中心角に比例します。$\theta$ がラジアンなら $l = r\theta$ と、かけ算だけで求まります。`,
          easy: R`1 ラジアンの弧の長さが $r$ なので、$\theta$ ラジアンなら $\theta$ 倍で $r\theta$ です。「円周 $2\pi r$ の何割か」で求めても同じ値になります（あとの確かめを見てください）。`,
          pro: R`度のままなら $l = 2\pi r \times \frac{\theta}{360\degree}$。ラジアンなら $l = r\theta$ の 1 行で済みます。`
        });
        steps.push({
          t: '扇形の面積 $S$',
          m: [R`S = \frac{1}{2}r^{2}\theta = \frac{1}{2}rl`, R`S = \frac{1}{2} \times ` + pw(r, 2) + R` \times ` + kT + ' = ' + kpi(sk)],
          n: R`面積も中心角に比例します。円全体の面積 $\pi r^{2}$ の $\frac{\theta}{2\pi}$ 倍なので、$S = \pi r^{2} \cdot \frac{\theta}{2\pi} = \frac{1}{2}r^{2}\theta$ です。`,
          easy: R`扇形を細い三角形にたくさん切り分けると、面積は「底辺（弧）$l$ × 高さ $r$ ÷ 2」の合計に近づきます。だから $S = \frac{1}{2}rl$ で、$l = r\theta$ を入れると $S = \frac{1}{2}r^{2}\theta$ になります。`,
          pro: R`$S = \frac{1}{2}rl$ は三角形の面積公式と同じ形です。弧の長さが分かっているときはこちらが速いです。`
        });
        steps.push({
          t: '割合で確かめる',
          m: [R`\frac{\theta}{2\pi} = \frac{` + deg.tex() + R`\degree}{360\degree} = ` + ratio.tex(), R`l = 2\pi r \times ` + par(ratio.tex()) + ' = ' + kpi(lk), R`S = \pi r^{2} \times ` + par(ratio.tex()) + ' = ' + kpi(sk)],
          n: R`円全体の何割にあたるかで求め直しても、上と同じ答えになります。`,
          easy: R`中心角が全円（$360\degree$）の $` + ratio.tex() + R`$ にあたるので、弧の長さも面積も円全体の $` + ratio.tex() + R`$ 倍です。ラジアンの式と一致することで、計算の確かめになります。`,
          lv: 2
        });
      } else {
        steps.push({
          t: '扇形について',
          n: R`扇形の弧の長さと面積の公式は、中心角が $0 < \theta \le 2\pi$（$0\degree$ より大きく $360\degree$ 以下）のときに使います。この角はその範囲の外なので、換算だけを行いました。`,
          easy: R`扇形は「円の一部」なので、中心角は 1 周（$360\degree = 2\pi$）以下の正の角です。それより大きい角や負の角は、動径の回転（一般角）として扱います。`
        });
      }
      const res = [{ label: 'ラジアン', tex: R`\theta = ` + radTex }, { label: '度', tex: R`\theta = ` + degTex }];
      if (sector) {
        res.push({ label: '弧の長さ l', tex: 'l = ' + kpi(lk) + R` \approx ` + fm(lk.val() * PI, 4) });
        res.push({ label: '扇形の面積 S', tex: 'S = ' + kpi(sk) + R` \approx ` + fm(sk.val() * PI, 4) });
      }
      return {
        result: res,
        steps: steps,
        fig: sectorFig(deg.val(), sector, {
          th: 'θ = ' + kpiT(k) + '（' + U.fmt(deg.val(), 2) + '°）', r: 'r = ' + r.toString(),
          l: 'l = ' + kpiT(lk), s: 'S = ' + kpiT(sk)
        })
      };
    }
  });

  /* ================= 2. 一般角と三角関数の値 ================= */

  function quadInfo(a) {
    const eq = (x) => Math.abs(a - x) < 1e-9;
    if (eq(0)) return { id: 'x+', name: 'x 軸の正の部分' };
    if (eq(90)) return { id: 'y+', name: 'y 軸の正の部分' };
    if (eq(180)) return { id: 'x-', name: 'x 軸の負の部分' };
    if (eq(270)) return { id: 'y-', name: 'y 軸の負の部分' };
    if (a < 90) return { id: 1, name: '第 1 象限' };
    if (a < 180) return { id: 2, name: '第 2 象限' };
    if (a < 270) return { id: 3, name: '第 3 象限' };
    return { id: 4, name: '第 4 象限' };
  }
  const SIGNS = { 1: [1, 1, 1], 2: [1, -1, -1], 3: [-1, -1, 1], 4: [-1, 1, -1] };

  function angleFig(deg) {
    const t = deg * D2R, cs = Math.cos(t), sn = Math.sin(t);
    const o = unitBase();
    const rr = (s) => 0.17 + 0.05 * Math.min(Math.abs(s) / (2 * PI), 8);
    o.param.push({ x: (s) => rr(s) * Math.cos(s), y: (s) => rr(s) * Math.sin(s), t: [0, t], cls: 'c3' });
    o.segs.push({ x1: 0, y1: 0, x2: cs, y2: sn, cls: 'c1', arrow: true });
    if (Math.abs(sn) > 1e-9) o.segs.push({ x1: cs, y1: sn, x2: cs, y2: 0, cls: 'c3', dash: true, label: 'sin θ' });
    if (Math.abs(cs) > 1e-9) o.segs.push({ x1: 0, y1: 0, x2: cs, y2: 0, cls: 'c4', dash: true, label: 'cos θ' });
    if (Math.abs(cs) > 1e-9 && Math.abs(sn / cs) <= 1.45) {
      o.vlines.push({ x: 1, dash: true, cls: 'c2' });
      o.segs.push({ x1: 0, y1: 0, x2: 1 * (cs > 0 ? 1 : 1), y2: sn / cs, cls: 'c2', dash: true });
      o.points.push({ x: 1, y: sn / cs, label: 'T', cls: 'c2', pos: sn / cs >= 0 ? 'tr' : 'br' });
    }
    o.points.push({ x: cs, y: sn, label: 'P', cls: 'c1', pos: posOf(cs, sn) });
    o.labels = quadLabels();
    o.labels.push({ x: -1.46, y: 1.1, text: 'P(cos θ, sin θ) = (' + fm(cs, 3) + ', ' + fm(sn, 3) + ')', cls: 'dim' });
    o.labels.push({ x: -1.46, y: 0.95, text: 'θ = ' + U.fmt(deg, 2) + '°', cls: 'dim' });
    return JK.plot.graph(o);
  }

  JK.registerCalc({
    id: 'iib-trig-general',
    course: 'IIB',
    unit: 'm-trig2',
    group: '三角関数',
    title: '一般角の sin・cos・tan（単位円）',
    desc: R`角 $\theta$（負の角・$360\degree$ を超える角もOK）の $\sin\theta,\ \cos\theta,\ \tan\theta$ を、単位円・象限・基準角から求めます。15° の倍数は厳密な値で表示します。`,
    form: [R`P(\cos\theta,\ \sin\theta),\qquad \tan\theta = \frac{\sin\theta}{\cos\theta}`, R`\sin^{2}\theta + \cos^{2}\theta = 1`],
    inputs: [
      { key: 'deg', label: R`角 $\theta$（度）`, type: 'num', def: '150', min: -3600, max: 3600, hint: R`負の角（$-45$）や $360$ を超える角（$765$）も入力できます。` }
    ],
    examples: [
      { label: '150°', v: { deg: '150' } },
      { label: '−45°', v: { deg: '-45' } },
      { label: '765°（2 回転と 45°）', v: { deg: '765' } },
      { label: '240°', v: { deg: '240' } },
      { label: '270°（軸上）', v: { deg: '270' } },
      { label: '100°（表にない角）', v: { deg: '100' } }
    ],
    intro: {
      easy: R`角を「回転の量」と考えます。x 軸の正の方向から**反時計回りに回した量が正の角、時計回りが負の角**で、1 周回ると $360\degree$ です。こうして考えた角を**一般角**、回転した先の半直線を**動径**といいます。
半径 $1$ の円（**単位円**）を使うと、動径が円と交わる点 $P$ の座標が $(\cos\theta,\ \sin\theta)$、動径の傾きが $\tan\theta$ になります。鋭角でしか使えなかった三角比を、どんな大きさの角にも広げたものが三角関数です。符号は「$P$ がどの象限にあるか」で決まります。`,
      normal: R`$0\degree \le \alpha < 360\degree$ に直し、象限で符号を決め、基準角（動径と $x$ 軸のなす鋭角）の三角比を使います。第 1 象限はすべて正、第 2 象限は $\sin$ だけ、第 3 象限は $\tan$ だけ、第 4 象限は $\cos$ だけが正です。`,
      pro: R`$\sin(-\theta) = -\sin\theta$、$\cos(-\theta) = \cos\theta$、$\sin(180\degree-\theta) = \sin\theta$、$\cos(180\degree-\theta) = -\cos\theta$、$\sin(\theta+180\degree) = -\sin\theta$ などは、動径の位置を図に描いてその場で導きます。`
    },
    compute(v) {
      const deg = v.deg;
      let a = ((deg % 360) + 360) % 360;
      if (a > 360 - 1e-9) a = 0;
      const turns = Math.round((deg - a) / 360);
      const rad = deg * D2R, cs = Math.cos(rad), sn = Math.sin(rad);
      const qi = quadInfo(a);
      const exact = isMul15(a);
      const ex = exact ? tvS(Math.round(a)) : null;
      const tanOk = Math.abs(cs) > 1e-9;
      const tn = tanOk ? sn / cs : NaN;
      const axis = typeof qi.id === 'string';
      const ref = axis ? 0 : (qi.id === 1 ? a : (qi.id === 2 ? 180 - a : (qi.id === 3 ? a - 180 : 360 - a)));
      const sg = axis ? null : SIGNS[qi.id];
      const gl = (x) => (x > 0 ? '>' : '<');
      const steps = [];
      steps.push({
        t: '一般角と動径',
        m: [R`\theta = \alpha + 360\degree \times n \quad (n \text{ は整数},\ 0\degree \le \alpha < 360\degree)`],
        n: R`角 $\theta$ は、始線（$x$ 軸の正の部分）から動径を回した量です。反時計回りが正、時計回りが負で、$360\degree$ 回すと元の位置に戻ります。`,
        easy: R`時計の針を想像してください。針が 1 周すると元の位置に戻るのと同じで、$\theta$ と $\theta + 360\degree$ は同じ方向を指します（時計回りに回すと負の角です）。そこで、まず $0\degree$ 以上 $360\degree$ 未満の角 $\alpha$ に直してから考えます。`,
        lv: 3
      });
      steps.push({
        t: R`$0\degree \le \alpha < 360\degree$ の角に直す`,
        m: [turns !== 0 ? R`\theta = ` + degT(deg) + ' = ' + degT(a) + R` + 360\degree \times ` + par(String(turns)) : R`\theta = ` + degT(a) + R`\quad (\text{すでに } 0\degree \le \theta < 360\degree)`],
        n: turns !== 0 ? R`$360\degree$ の整数倍を足し引きして、動径が同じ位置になる $0\degree$ 以上 $360\degree$ 未満の角 $\alpha = ` + degT(a) + R`$ を求めます。` : R`角はすでに $0\degree \le \theta < 360\degree$ の範囲にあるので、このまま使います。`,
        easy: turns !== 0 ? R`$360\degree$ ずつ進めたり戻したりしても動径は同じ場所に来るので、三角関数の値は変わりません。$` + degT(deg) + R`$ は $360\degree$ を $` + par(String(turns)) + R`$ 回分ずらすと $` + degT(a) + R`$ に重なります。` : R`$0\degree$ から $360\degree$ の間にある角は、そのまま考えられます。`,
        pro: R`$\sin(\theta+360\degree n) = \sin\theta$、$\cos(\theta+360\degree n) = \cos\theta$、$\tan(\theta+180\degree n) = \tan\theta$（$\tan$ は $180\degree$ ごとに繰り返す）。`
      });
      steps.push({
        t: '単位円で考える',
        m: [R`P(\cos\theta,\ \sin\theta)`, R`\tan\theta = \frac{\sin\theta}{\cos\theta}\quad (\cos\theta \ne 0)`],
        n: R`半径 $1$ の円（単位円）の上で、動径と円の交点を $P$ とします。$P$ の $x$ 座標が $\cos\theta$、$y$ 座標が $\sin\theta$ で、直線 $OP$ の傾きが $\tan\theta$ です。`,
        easy: R`$\theta$ が鋭角のときの三角比（斜辺 $1$ の直角三角形で、底辺が $\cos\theta$・高さが $\sin\theta$）を「座標」で言い直したものです。座標なら $90\degree$ を超える角や負の角でも考えられ、$x$ 座標が負なら $\cos\theta<0$、$y$ 座標が負なら $\sin\theta<0$ になります。`,
        pro: R`$\tan\theta$ は直線 $x=1$ との交点の $y$ 座標としても読めます（図の点 $T$）。$\cos\theta = 0$ のとき $\tan\theta$ は定義されません。`
      });
      if (!axis) {
        steps.push({
          t: '象限と符号',
          m: [R`\sin\theta ` + gl(sg[0]) + R` 0,\quad \cos\theta ` + gl(sg[1]) + R` 0,\quad \tan\theta ` + gl(sg[2]) + ' 0'],
          n: R`動径は**` + qi.name + R`**にあります。この象限では $\sin$ は` + (sg[0] > 0 ? '正' : '負') + R`、$\cos$ は` + (sg[1] > 0 ? '正' : '負') + R`、$\tan$ は` + (sg[2] > 0 ? '正' : '負') + R`です。`,
          easy: R`点 $P$ の $x$ 座標（$\cos$）は右半分で正・左半分で負、$y$ 座標（$\sin$）は上半分で正・下半分で負です。$\tan = \frac{y}{x}$ は、$x, y$ の符号が同じなら正、違えば負になります。`,
          pro: R`符号は「第 1 象限はすべて正、第 2 象限は $\sin$、第 3 象限は $\tan$、第 4 象限は $\cos$ だけが正」と覚えます。`
        });
        steps.push({
          t: R`基準角 $\alpha'$（動径と $x$ 軸のなす鋭角）`,
          m: [qi.id === 1 ? R`\alpha' = \alpha = ` + degT(a) : (qi.id === 2 ? R`\alpha' = 180\degree - \alpha = 180\degree - ` + degT(a) + ' = ' + degT(ref) : (qi.id === 3 ? R`\alpha' = \alpha - 180\degree = ` + degT(a) + R` - 180\degree = ` + degT(ref) : R`\alpha' = 360\degree - \alpha = 360\degree - ` + degT(a) + ' = ' + degT(ref)))],
          n: R`動径が $x$ 軸となす鋭角を基準角 $\alpha'$ とします。$|\sin\theta|,\ |\cos\theta|,\ |\tan\theta|$ は、基準角 $\alpha'$ の三角比と等しくなります。`,
          easy: R`動径を $x$ 軸に近いほうへ折り返すと、第 1 象限の鋭角 $\alpha'$ の三角形と同じ形になります。向きが変わるだけで長さは同じなので、値の大きさ（絶対値）は $\alpha'$ の三角比、符号は象限で決まります。`
        });
      }
      const sTx = ex ? sTex(ex.s) : null, cTx = ex ? sTex(ex.c) : null, tTx = ex && ex.t ? sTex(ex.t) : null;
      if (exact) {
        const rr = Math.round(a);
        if (axis) {
          steps.push({
            t: '軸上の角は座標を読む',
            m: [R`P = (\cos\theta,\ \sin\theta) = (` + cTx + R`,\ ` + sTx + ')', ex.t ? R`\tan\theta = \frac{` + sTx + '}{' + cTx + '} = ' + tTx : R`\tan\theta \text{ は定義されない}（\cos\theta = 0）`],
            n: R`動径が軸上にあるので、点 $P$ は $(\pm 1,\ 0)$ か $(0,\ \pm 1)$ です。座標をそのまま読みます。` + (ex.t ? '' : R`$x$ 座標が $0$ なので $\tan\theta$ は定義されません。`),
            easy: R`単位円は半径 $1$ なので、右端 $(1,0)$・上端 $(0,1)$・左端 $(-1,0)$・下端 $(0,-1)$ が軸上の点です。その座標がそのまま $(\cos\theta,\ \sin\theta)$ になります。`,
            pro: R`$\tan 90\degree$、$\tan 270\degree$ は定義されません（グラフの漸近線の位置）。`
          });
        } else {
          steps.push({
            t: '値を求める',
            m: [
              trg('sin', rr) + ' = ' + (ex.ss < 0 ? '-' : '') + trg('sin', ex.ref) + ' = ' + sTx,
              trg('cos', rr) + ' = ' + (ex.cs < 0 ? '-' : '') + trg('cos', ex.ref) + ' = ' + cTx,
              trg('tan', rr) + ' = ' + (ex.ss * ex.cs < 0 ? '-' : '') + trg('tan', ex.ref) + ' = ' + tTx
            ],
            n: R`基準角 $` + degT(ex.ref) + R`$ の値に、象限で決まる符号を付けます。`,
            easy: R`$` + degT(ex.ref) + R`$ の $\sin,\ \cos,\ \tan$ の値（$30\degree,\ 45\degree,\ 60\degree$ などの三角比）を求めてから、象限の符号を付ければ完成です。`,
            pro: R`$15\degree$ 刻みの値は、$15\degree = 45\degree - 30\degree$ などと加法定理から出せます（$\sin 15\degree = \frac{\sqrt{6}-\sqrt{2}}{4}$）。`
          });
        }
        const s2 = sMul(ex.s, ex.s), c2 = sMul(ex.c, ex.c);
        steps.push({
          t: '相互関係で確かめる',
          m: [R`\sin^{2}\theta + \cos^{2}\theta = ` + pa(sTx) + R`^{2} + ` + pa(cTx) + R`^{2} = ` + joinTerms(sTex(s2), sTex(c2)) + ' = ' + sTex(sAdd(s2, c2))],
          n: R`$\sin^{2}\theta + \cos^{2}\theta = 1$ が成り立てば、$\sin\theta,\ \cos\theta$ の値は矛盾していません（点 $P$ が単位円の上にあることの確認です）。`,
          easy: R`点 $P(\cos\theta,\ \sin\theta)$ は半径 $1$ の円の上にあるので、三平方の定理から $x^{2}+y^{2}=1$、つまり $\cos^{2}\theta+\sin^{2}\theta=1$ です。求めた値を 2 乗して足し、$1$ になれば正しいと分かります。`,
          lv: 2
        });
      } else {
        steps.push({
          t: '値を求める（近似値）',
          m: [R`\sin\theta \approx ` + fm(sn, 4), R`\cos\theta \approx ` + fm(cs, 4), tanOk ? R`\tan\theta \approx ` + fm(tn, 4) : R`\tan\theta \text{ は定義されない}`],
          n: R`$` + degT(deg) + R`$ は $15\degree$ の倍数ではないので、厳密な値の表にはありません。電卓で求めた近似値です（符号は象限の決まりと一致します）。`,
          easy: R`入試では $30\degree,\ 45\degree,\ 60\degree$ の仲間（$15\degree$ 刻み）の角が出題の中心です。それ以外の角は、符号と大まかな大きさ（図で位置を確認）を確かめる使い方をします。`
        });
        steps.push({
          t: '相互関係で確かめる',
          m: [R`\sin^{2}\theta + \cos^{2}\theta \approx ` + pa(fm(sn, 4)) + R`^{2} + ` + pa(fm(cs, 4)) + R`^{2} \approx ` + fm(sn * sn + cs * cs, 3)],
          n: R`$\sin^{2}\theta + \cos^{2}\theta = 1$ が（近似の範囲で）成り立つことを確かめます。`,
          easy: R`点 $P$ は単位円の上にあるので、$x^{2}+y^{2}=1$ になります。電卓の値を 2 乗して足し、ほぼ $1$ になれば OK です。`,
          lv: 2
        });
      }
      const sTexR = ex ? withApprox(sTx, sn) : R`\approx ` + fm(sn, 4);
      const cTexR = ex ? withApprox(cTx, cs) : R`\approx ` + fm(cs, 4);
      const tTexR = tanOk ? (ex ? withApprox(tTx, tn) : R`\approx ` + fm(tn, 4)) : R`\text{定義されない}`;
      return {
        result: [
          { label: '動径の位置', tex: R`\text{` + qi.name + R`}` },
          { label: 'sin θ', tex: (ex ? '' : R`\sin\theta `) + sTexR },
          { label: 'cos θ', tex: (ex ? '' : R`\cos\theta `) + cTexR },
          { label: 'tan θ', tex: (ex || !tanOk ? '' : R`\tan\theta `) + tTexR }
        ],
        steps: steps,
        fig: angleFig(deg)
      };
    }
  });

  /* ================= 3. 加法定理・2倍角・半角 ================= */

  function raysFig(rays) {
    const o = unitBase();
    rays.forEach((ry) => {
      o.segs.push({ x1: 0, y1: 0, x2: Math.cos(ry.deg * D2R), y2: Math.sin(ry.deg * D2R), cls: ry.cls, arrow: true, label: ry.label });
      if (Math.abs(ry.deg) > 1e-9) o.param.push(arcP(ry.r, 0, ry.deg * D2R, ry.cls));
    });
    return JK.plot.graph(o);
  }

  // 1 つの式 head = f1 (op) f2 を、公式 → 値の代入 → 積 → 和 の 3 行にする
  function expandLines(head, f1, f2, op) {
    const t1 = sMul(f1[4], f1[5]), t2 = sMul(f2[4], f2[5]);
    const sum = op === '+' ? sAdd(t1, t2) : sSub(t1, t2);
    return {
      lines: [
        head + ' = ' + trg(f1[0], f1[1]) + trg(f1[2], f1[3]) + ' ' + op + ' ' + trg(f2[0], f2[1]) + trg(f2[2], f2[3]),
        '= ' + prodTex(f1[4], f1[5]) + ' ' + op + ' ' + prodTex(f2[4], f2[5]),
        '= ' + joinTerms(sTex(t1), sTex(op === '+' ? t2 : sNeg(t2))) + ' = ' + sTex(sum)
      ],
      value: sum
    };
  }
  // 分子・分母を整数係数にそろえる（共通の分母を払う）
  function scaleInt(x, y) {
    let L = 1;
    x.concat(y).forEach((q) => { L = U.lcm(L, q.d); });
    return { x: x.map((q) => q.mul(L)), y: y.map((q) => q.mul(L)), L: L };
  }
  // 分数 num / den の途中式（有理化つき）。戻り値 { lines, value }（den = 0 のとき null）
  function fracLines(head, num, den) {
    if (sIsZero(den)) return null;
    const sc = scaleInt(num, den);
    const val = sMul(num, sInv(den));
    const lines = [head + R` = \frac{` + sTex(num) + '}{' + sTex(den) + '}'];
    if (sc.L > 1) lines.push(R`= \frac{` + sTex(sc.x) + '}{' + sTex(sc.y) + '}');
    const dRat = sc.y.slice(1).every((q) => q.isZero());
    if (!dRat) {
      const dbar = sConj(sc.y, 1);
      const n2 = sMul(sc.x, dbar), d2 = sMul(sc.y, dbar);
      lines.push(R`= \frac{` + pa(sTex(sc.x)) + pa(sTex(dbar)) + '}{' + pa(sTex(sc.y)) + pa(sTex(dbar)) + '}');
      lines.push(R`= \frac{` + sTex(n2) + '}{' + sTex(d2) + '} = ' + sTex(val));
    } else {
      lines.push('= ' + sTex(val));
    }
    return { lines: lines, value: val };
  }

  function addForm(A, B, plus) {
    const G = plus ? A + B : A - B;
    const vA = tvS(A), vB = tvS(B), vG = tvS(G);
    const op = plus ? '+' : '-', opI = plus ? '-' : '+';
    const headArg = degT(A) + ' ' + op + ' ' + degArg(B);
    const sinE = expandLines(R`\sin(` + headArg + ')', ['sin', A, 'cos', B, vA.s, vB.c], ['cos', A, 'sin', B, vA.c, vB.s], op);
    const cosE = expandLines(R`\cos(` + headArg + ')', ['cos', A, 'cos', B, vA.c, vB.c], ['sin', A, 'sin', B, vA.s, vB.s], opI);
    const tA = vA.t, tB = vB.t;
    let tanLines = null, tanVal = null, tanNote = '';
    const den = (tA && tB) ? (plus ? sSub(sCon(1), sMul(tA, tB)) : sAdd(sCon(1), sMul(tA, tB))) : null;
    if (den && !sIsZero(den)) {
      const num = plus ? sAdd(tA, tB) : sSub(tA, tB);
      const head = R`\tan(` + headArg + R`) = \frac{` + sTex(tA) + ' ' + op + ' ' + par(sTex(tB)) + '}{1 ' + opI + ' ' + prodTex(tA, tB) + '}';
      const fl = fracLines(head, num, den);
      tanLines = fl.lines; tanVal = fl.value;
    } else {
      tanVal = sIsZero(cosE.value) ? null : sMul(sinE.value, sInv(cosE.value));
      tanNote = (!tA || !tB) ? R`$\tan\alpha$ か $\tan\beta$ が定義されないので、$\tan$ の加法定理は使えません。` : R`$1 ` + opI + R` \tan\alpha\tan\beta = 0$ となり、$\tan$ の加法定理は使えません。`;
      tanLines = tanVal === null
        ? [R`\cos ` + degT(G) + R` = 0 \;\Rightarrow\; \tan ` + degT(G) + R`\text{ は定義されない}`]
        : [R`\tan(` + headArg + R`) = \frac{\sin ` + degT(G) + R`}{\cos ` + degT(G) + R`} = \frac{` + sTex(sinE.value) + '}{' + sTex(cosE.value) + '} = ' + sTex(tanVal)];
    }
    const stepsAdd = [];
    stepsAdd.push({
      t: '加法定理とは（なぜ必要か）',
      m: [R`\sin(30\degree + 60\degree) = \sin 90\degree = 1`, R`\sin 30\degree + \sin 60\degree = \frac{1}{2} + \frac{\sqrt{3}}{2} \ne 1`],
      n: R`$\sin(\alpha+\beta)$ は $\sin\alpha + \sin\beta$ ではありません。足し算の角の三角関数は、2 つの角の $\sin$ と $\cos$ を**組み合わせた式**になります。それが加法定理です。`,
      easy: R`「角を足してから $\sin$ をとる」ことと「$\sin$ をとってから足す」ことは別物です（上の例で値が合いません）。そこで、$75\degree = 45\degree + 30\degree$ のように、値が分かっている角に分けて計算できる公式が加法定理です。これで $15\degree,\ 75\degree,\ 105\degree$ などの値も求められます。`,
      lv: 3
    });
    stepsAdd.push({
      t: '加法定理の公式',
      m: plus
        ? [R`\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta`, R`\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta`, R`\tan(\alpha + \beta) = \frac{\tan\alpha + \tan\beta}{1 - \tan\alpha\tan\beta}`]
        : [R`\sin(\alpha - \beta) = \sin\alpha\cos\beta - \cos\alpha\sin\beta`, R`\cos(\alpha - \beta) = \cos\alpha\cos\beta + \sin\alpha\sin\beta`, R`\tan(\alpha - \beta) = \frac{\tan\alpha - \tan\beta}{1 + \tan\alpha\tan\beta}`],
      n: R`$\sin$ の式は「$\sin\cos$ と $\cos\sin$」の和・差で、符号は左辺と同じです。$\cos$ の式は「$\cos\cos$ と $\sin\sin$」で、符号は左辺と**逆**になります。`,
      easy: R`覚え方は、$\sin$ は「$\sin\cdot\cos$ と $\cos\cdot\sin$ が混ざる（符号はそのまま）」、$\cos$ は「$\cos\cdot\cos$ と $\sin\cdot\sin$（符号は逆）」です。$\tan$ は $\frac{\sin}{\cos}$ から導かれ、分母の符号が分子と逆になります。`,
      pro: R`符号の覚え方: $\sin$ は同符号、$\cos$ は逆符号、$\tan$ は分子が同符号・分母が逆符号。`
    });
    stepsAdd.push({
      t: R`$\alpha = ` + degT(A) + R`,\ \beta = ` + degT(B) + R`$ の三角比の値`,
      m: [
        trg('sin', A) + ' = ' + sTex(vA.s) + R`,\quad ` + trg('cos', A) + ' = ' + sTex(vA.c) + R`,\quad ` + (vA.t ? trg('tan', A) + ' = ' + sTex(vA.t) : R`\tan ` + degT(A) + R`\text{ は定義されない}`),
        trg('sin', B) + ' = ' + sTex(vB.s) + R`,\quad ` + trg('cos', B) + ' = ' + sTex(vB.c) + R`,\quad ` + (vB.t ? trg('tan', B) + ' = ' + sTex(vB.t) : R`\tan ` + degT(B) + R`\text{ は定義されない}`)
      ],
      n: R`$15\degree$ 刻みの角の値を、基準角と象限の符号から決めておきます。`,
      easy: R`$30\degree,\ 45\degree,\ 60\degree$ の値（$\frac{1}{2},\ \frac{\sqrt{2}}{2},\ \frac{\sqrt{3}}{2}$ など）を象限の符号つきで用意します。符号は単位円の位置から決まります。`
    });
    stepsAdd.push({
      t: R`$\sin(\alpha ` + op + R` \beta)$ を計算`,
      m: sinE.lines,
      n: R`公式に値を代入し、積 → 和の順に整理します。根号の積は $\sqrt{2}\times\sqrt{3}=\sqrt{6}$ のように計算します。`,
      easy: R`$\frac{\sqrt{2}}{2}\cdot\frac{\sqrt{3}}{2} = \frac{\sqrt{2}\sqrt{3}}{4} = \frac{\sqrt{6}}{4}$ のように、分子どうし・分母どうしをかけます。同じ分母の分数は分子をまとめて足します。`,
      pro: R`根号の積は $\sqrt{a}\sqrt{b}=\sqrt{ab}$、$\sqrt{2}\sqrt{2}=2$ に注意すれば暗算できます。`
    });
    stepsAdd.push({
      t: R`$\cos(\alpha ` + op + R` \beta)$ を計算`,
      m: cosE.lines,
      n: R`$\cos$ の公式は符号が左辺と逆になる点に注意して代入します。`,
      easy: R`$\cos$ の加法定理は「$\cos\cos$ と $\sin\sin$」の組み合わせで、足し算 $\alpha+\beta$ のときは**引き算**、引き算 $\alpha-\beta$ のときは**足し算**になります。符号の取り違えが最も多いミスです。`,
      pro: R`$\cos(\alpha+\beta)$ の符号を間違えたら、$\beta = 0$ を入れて $\cos\alpha$ になるか確認します。`
    });
    stepsAdd.push({
      t: R`$\tan(\alpha ` + op + R` \beta)$ を計算`,
      m: tanLines,
      n: tanNote ? tanNote + R`$\tan = \frac{\sin}{\cos}$ から求めます。` : R`値を代入し、分母に根号が残るときは**有理化**（分母の根号を消す変形）をします。`,
      easy: tanNote ? tanNote + R`こういうときは、$\sin(\alpha ` + op + R` \beta)$ と $\cos(\alpha ` + op + R` \beta)$ の値の比 $\tan = \frac{\sin}{\cos}$ で求めます。` : R`分母が $3-\sqrt{3}$ のように根号を含むときは、分母・分子に「符号だけ変えた形」$3+\sqrt{3}$ をかけます。分母が $(3-\sqrt{3})(3+\sqrt{3}) = 9-3 = 6$ と整数になります（有理化）。`,
      pro: R`$\tan$ の加法定理は分母が $0$ になる角（$\alpha+\beta=90\degree$ など）では使えません。`
    });
    stepsAdd.push({
      t: '表の値と照らし合わせて検算',
      m: [
        trg('sin', G) + ' = ' + sTex(vG.s) + R`,\quad ` + trg('cos', G) + ' = ' + sTex(vG.c) + R`,\quad ` + (vG.t ? trg('tan', G) + ' = ' + sTex(vG.t) : R`\tan ` + degT(G) + R`\text{ は定義されない}`),
        R`\text{加法定理の結果：}\ ` + sTex(sinE.value) + R`,\ ` + sTex(cosE.value) + R`,\ ` + (tanVal ? sTex(tanVal) : R`\text{定義されない}`)
      ],
      n: R`$` + degT(G) + R`$ の三角比を、15° 刻みの値の一覧（基準角と象限の符号）から直接求めて比べると、加法定理の結果と一致します。`,
      easy: R`答えの確認には、$` + degT(G) + R`$ を単位円の上で考えて値を読み取る方法があります。2 通りの計算が一致すれば、符号や計算の取り違えがないと分かります。`,
      lv: 2
    });
    const ap = (x, f) => withApprox(sTex(x), f);
    return {
      result: [
        { label: 'sin ' + G + '°', tex: trg('sin', G) + ' = ' + ap(sinE.value, Math.sin(G * D2R)) },
        { label: 'cos ' + G + '°', tex: trg('cos', G) + ' = ' + ap(cosE.value, Math.cos(G * D2R)) },
        { label: 'tan ' + G + '°', tex: tanVal ? trg('tan', G) + ' = ' + ap(tanVal, Math.tan(G * D2R)) : R`\tan ` + degT(G) + R`\text{ は定義されない}` }
      ],
      steps: stepsAdd,
      fig: raysFig([
        { deg: A, cls: 'c1', label: 'α', r: 0.28 },
        { deg: B, cls: 'c2', label: 'β', r: 0.4 },
        { deg: G, cls: 'c3', label: plus ? 'α+β' : 'α−β', r: 0.52 }
      ])
    };
  }

  function doubleHalf(A) {
    const v1 = tvS(A), v2 = tvS(2 * A);
    const one = sCon(1), half = mk('1/2', 0, 0, 0);
    const sin2 = sMul(sCon(2), sMul(v1.s, v1.c));
    const cos2 = sSub(sMul(v1.c, v1.c), sMul(v1.s, v1.s));
    const cos2b = sSub(sMul(sCon(2), sMul(v1.c, v1.c)), one);
    const cos2c = sSub(one, sMul(sCon(2), sMul(v1.s, v1.s)));
    const tA = v1.t;
    let tan2 = null, tanLines;
    const den2 = tA ? sSub(one, sMul(tA, tA)) : null;
    let tanNote = '';
    if (den2 && !sIsZero(den2)) {
      const fl = fracLines(R`\tan ` + degT(2 * A) + R` = \frac{2\tan\alpha}{1 - \tan^{2}\alpha} = \frac{2 \cdot ` + pa(sTex(tA)) + '}{1 - ' + pa(sTex(tA)) + R`^{2}}`, sMul(sCon(2), tA), den2);
      tanLines = fl.lines; tan2 = fl.value;
    } else {
      tan2 = sIsZero(cos2) ? null : sMul(sin2, sInv(cos2));
      tanNote = !tA ? R`$\tan\alpha$ が定義されないので、$\tan$ の 2 倍角の公式は使えません。` : R`$1 - \tan^{2}\alpha = 0$ となり、公式は使えません。`;
      tanLines = tan2 === null
        ? [R`\cos ` + degT(2 * A) + R` = 0 \;\Rightarrow\; \tan ` + degT(2 * A) + R`\text{ は定義されない}`]
        : [R`\tan ` + degT(2 * A) + R` = \frac{\sin ` + degT(2 * A) + R`}{\cos ` + degT(2 * A) + R`} = \frac{` + sTex(sin2) + '}{' + sTex(cos2) + '} = ' + sTex(tan2)];
    }
    const H = A / 2, hExact = isMul15(H);
    const sq1 = sMul(sSub(one, v1.c), half), sq2 = sMul(sAdd(one, v1.c), half);
    const sH = Math.sin(H * D2R), cH = Math.cos(H * D2R);
    const vH = hExact ? tvS(Math.round(H)) : null;
    const hs = hExact ? sTex(vH.s) : (sgn0(sH) < 0 ? '-' : '') + R`\sqrt{` + sTex(sq1) + '}';
    const hc = hExact ? sTex(vH.c) : (sgn0(cH) < 0 ? '-' : '') + R`\sqrt{` + sTex(sq2) + '}';
    const quadName = quadInfo((((H % 360) + 360) % 360)).name;
    const steps = [];
    steps.push({
      t: '2 倍角・半角の公式のもと',
      m: [R`\sin 2\alpha = \sin(\alpha + \alpha) = \sin\alpha\cos\alpha + \cos\alpha\sin\alpha = 2\sin\alpha\cos\alpha`, R`\cos 2\alpha = \cos(\alpha + \alpha) = \cos^{2}\alpha - \sin^{2}\alpha`],
      n: R`2 倍角の公式は、加法定理で $\beta = \alpha$ とおいたものです。半角の公式は、$\cos 2\theta = 1 - 2\sin^{2}\theta$ などで $\theta = \frac{\alpha}{2}$ とおいて得られます。`,
      easy: R`$2\alpha$ は $\alpha + \alpha$ なので、加法定理の $\beta$ に $\alpha$ をそのまま入れるだけです。新しい公式を丸ごと覚えるのではなく、「加法定理の特別な場合」と考えると忘れません。半角は 2 倍角の式を逆向きに読んだものです。`,
      lv: 3
    });
    steps.push({
      t: '2 倍角・半角の公式',
      m: [
        R`\sin 2\alpha = 2\sin\alpha\cos\alpha`,
        R`\cos 2\alpha = \cos^{2}\alpha - \sin^{2}\alpha = 2\cos^{2}\alpha - 1 = 1 - 2\sin^{2}\alpha`,
        R`\tan 2\alpha = \frac{2\tan\alpha}{1 - \tan^{2}\alpha}`,
        R`\sin^{2}\frac{\alpha}{2} = \frac{1 - \cos\alpha}{2},\quad \cos^{2}\frac{\alpha}{2} = \frac{1 + \cos\alpha}{2}`
      ],
      n: R`$\cos 2\alpha$ には 3 通りの形があり、問題に合わせて使い分けます（$\sin^{2}\alpha + \cos^{2}\alpha = 1$ で互いに変形できます）。半角の公式は 2 乗の形なので、平方根をとるときの符号が必要です。`,
      easy: R`$\cos 2\alpha$ の 3 つの形はすべて同じ値です。$\cos$ だけで表したいときは $2\cos^{2}\alpha - 1$、$\sin$ だけなら $1 - 2\sin^{2}\alpha$ を使います。半角の公式は「2 乗」になっているので、答えが $\pm$ のどちらかを、$\frac{\alpha}{2}$ の動径がある象限で決めます。`,
      pro: R`$\cos^{2}\alpha = \frac{1+\cos 2\alpha}{2}$、$\sin^{2}\alpha = \frac{1-\cos 2\alpha}{2}$（次数下げ）は微分・積分でも頻出です。`
    });
    steps.push({
      t: R`$\alpha = ` + degT(A) + R`$ の三角比の値`,
      m: [trg('sin', A) + ' = ' + sTex(v1.s) + R`,\quad ` + trg('cos', A) + ' = ' + sTex(v1.c) + R`,\quad ` + (tA ? trg('tan', A) + ' = ' + sTex(tA) : R`\tan ` + degT(A) + R`\text{ は定義されない}`)],
      n: R`基準角と象限の符号から値を決めます。`,
      easy: R`まず元の角 $\alpha$ の $\sin,\ \cos,\ \tan$ を、象限の符号つきで用意します。2 倍角も半角も、この値から計算します。`
    });
    steps.push({
      t: R`$\sin 2\alpha$ を計算`,
      m: [R`\sin ` + degT(2 * A) + R` = 2\sin\alpha\cos\alpha = 2 \cdot ` + prodTex(v1.s, v1.c), '= ' + sTex(sin2)],
      n: R`$\sin 2\alpha = 2\sin\alpha\cos\alpha$ に代入します。`,
      easy: R`$\sin$ と $\cos$ の値をかけて 2 倍するだけです。たとえば $\alpha = 30\degree$ なら $2 \cdot \frac{1}{2} \cdot \frac{\sqrt{3}}{2} = \frac{\sqrt{3}}{2}$ で、これは $\sin 60\degree$ の値と一致します。`,
      pro: R`$\sin 2\alpha = \frac{2\tan\alpha}{1+\tan^{2}\alpha}$ の形も使えます。`
    });
    steps.push({
      t: R`$\cos 2\alpha$ を計算`,
      m: [R`\cos ` + degT(2 * A) + R` = \cos^{2}\alpha - \sin^{2}\alpha = ` + pa(sTex(v1.c)) + R`^{2} - ` + pa(sTex(v1.s)) + R`^{2}`, '= ' + joinTerms(sTex(sMul(v1.c, v1.c)), sTex(sNeg(sMul(v1.s, v1.s)))) + ' = ' + sTex(cos2)],
      n: R`$\cos 2\alpha = \cos^{2}\alpha - \sin^{2}\alpha$ に代入します。`,
      easy: R`$\cos$ の 2 乗から $\sin$ の 2 乗を引きます。たとえば $\alpha = 30\degree$ なら $\frac{3}{4} - \frac{1}{4} = \frac{1}{2}$ で、$\cos 60\degree = \frac{1}{2}$ と一致します。`,
      pro: R`$\cos$ の値だけ分かるなら $2\cos^{2}\alpha - 1$、$\sin$ だけなら $1 - 2\sin^{2}\alpha$ が速いです。`
    });
    steps.push({
      t: R`$\cos 2\alpha$ の 3 通りの形で確かめる`,
      m: [R`2\cos^{2}\alpha - 1 = 2 \cdot ` + pa(sTex(v1.c)) + R`^{2} - 1 = ` + sTex(cos2b), R`1 - 2\sin^{2}\alpha = 1 - 2 \cdot ` + pa(sTex(v1.s)) + R`^{2} = ` + sTex(cos2c), R`\cos 2\alpha = ` + sTex(cos2)],
      n: R`どの形で計算しても同じ値になります。計算ミスの検出に使えます。`,
      easy: R`3 つの式は $\sin^{2}\alpha + \cos^{2}\alpha = 1$ を使って互いに書き換えたものなので、答えが必ず一致します。1 つだけ違う値が出たら、その計算を見直しましょう。`,
      lv: 2
    });
    steps.push({
      t: R`$\tan 2\alpha$ を計算`,
      m: tanLines,
      n: tanNote ? tanNote + R`$\tan = \frac{\sin}{\cos}$ から求めます。` : R`$\tan 2\alpha = \frac{2\tan\alpha}{1 - \tan^{2}\alpha}$ に代入し、分母に根号が残れば有理化します。`,
      easy: tanNote ? tanNote + R`こういうときは $\frac{\sin 2\alpha}{\cos 2\alpha}$ の比で求めます。` : R`$\tan\alpha$ の値を 2 回使う式です。分母が根号を含む形になったら、分母と分子に「符号だけ変えた形」をかけて有理化します。`
    });
    steps.push({
      t: '半角の公式（符号は象限で決める）',
      m: [
        R`\sin^{2}\frac{\alpha}{2} = \frac{1 - \cos\alpha}{2} = \frac{1 - ` + pa(sTex(v1.c)) + '}{2} = ' + sTex(sq1),
        R`\cos^{2}\frac{\alpha}{2} = \frac{1 + \cos\alpha}{2} = \frac{1 + ` + pa(sTex(v1.c)) + '}{2} = ' + sTex(sq2)
      ],
      n: R`$\frac{\alpha}{2} = ` + degT(H) + R`$ の動径は**` + quadName + R`**にあるので、$\sin\frac{\alpha}{2}$ は` + (sgn0(sH) > 0 ? '正' : (sgn0(sH) < 0 ? '負' : '$0$')) + R`、$\cos\frac{\alpha}{2}$ は` + (sgn0(cH) > 0 ? '正' : (sgn0(cH) < 0 ? '負' : '$0$')) + R`です。`,
      easy: R`半角の公式は 2 乗の値までしか教えてくれません。そこで平方根をとるときに、$\frac{\alpha}{2}$ の動径がどの象限にあるか（図で確認）を見て $+$ か $-$ を選びます。`,
      pro: R`符号は「$\frac{\alpha}{2}$ の象限」で決まります。$\alpha$ の象限ではないので注意。`
    });
    steps.push({
      t: R`$\sin\frac{\alpha}{2},\ \cos\frac{\alpha}{2}$ の値`,
      m: hExact
        ? [R`\sin ` + degT(H) + ' = ' + hs, R`\cos ` + degT(H) + ' = ' + hc]
        : [R`\sin\frac{\alpha}{2} = ` + hs + R` \approx ` + fm(sH, 4), R`\cos\frac{\alpha}{2} = ` + hc + R` \approx ` + fm(cH, 4)],
      n: hExact ? R`$\frac{\alpha}{2} = ` + degT(H) + R`$ は $15\degree$ の倍数なので、二重根号は外せて、表の値と一致します。` : R`$\frac{\alpha}{2} = ` + degT(H) + R`$ は $15\degree$ の倍数ではないため、二重根号（根号の中に根号）のまま、近似値で示します。`,
      easy: hExact ? R`たとえば $\sqrt{\frac{2-\sqrt{3}}{4}} = \frac{\sqrt{6}-\sqrt{2}}{4}$ のように、二重根号は 2 乗して確かめると外せます。` : R`二重根号を外せない角では、このまま答えにするか、電卓で近似値を調べます。`
    });
    const ap = (x, f) => withApprox(sTex(x), f);
    return {
      result: [
        { label: 'sin ' + (2 * A) + '°', tex: trg('sin', 2 * A) + ' = ' + ap(sin2, Math.sin(2 * A * D2R)) },
        { label: 'cos ' + (2 * A) + '°', tex: trg('cos', 2 * A) + ' = ' + ap(cos2, Math.cos(2 * A * D2R)) },
        { label: 'tan ' + (2 * A) + '°', tex: tan2 ? trg('tan', 2 * A) + ' = ' + ap(tan2, Math.tan(2 * A * D2R)) : R`\tan ` + degT(2 * A) + R`\text{ は定義されない}` },
        { label: 'sin ' + U.fmt(H, 2) + '°', tex: R`\sin ` + degT(H) + ' = ' + (hExact ? withApprox(hs, sH) : hs + R` \approx ` + fm(sH, 4)) },
        { label: 'cos ' + U.fmt(H, 2) + '°', tex: R`\cos ` + degT(H) + ' = ' + (hExact ? withApprox(hc, cH) : hc + R` \approx ` + fm(cH, 4)) }
      ],
      steps: steps,
      fig: raysFig([
        { deg: A, cls: 'c1', label: 'α', r: 0.3 },
        { deg: 2 * A, cls: 'c3', label: '2α', r: 0.5 },
        { deg: H, cls: 'c2', label: 'α/2', r: 0.2 }
      ])
    };
  }

  JK.registerCalc({
    id: 'iib-addition',
    course: 'IIB',
    unit: 'm-trig2',
    group: '三角関数',
    title: '加法定理・2倍角・半角',
    desc: R`$\alpha,\ \beta$ を 15° の倍数で入力し、$\sin(\alpha\pm\beta)$・$\cos(\alpha\pm\beta)$・$\tan(\alpha\pm\beta)$ を加法定理に代入して厳密値で求めます。2 倍角・半角の公式にも切り替えられます。`,
    form: [R`\sin(\alpha \pm \beta) = \sin\alpha\cos\beta \pm \cos\alpha\sin\beta`, R`\cos(\alpha \pm \beta) = \cos\alpha\cos\beta \mp \sin\alpha\sin\beta`, R`\tan(\alpha \pm \beta) = \frac{\tan\alpha \pm \tan\beta}{1 \mp \tan\alpha\tan\beta}`],
    inputs: [
      { key: 'mode', label: '求めるもの', type: 'select', def: 'plus', options: [['plus', '加法定理（α + β）'], ['minus', '加法定理（α − β）'], ['multi', '2 倍角・半角（α だけ使う）']] },
      { key: 'a', label: R`$\alpha$（度）`, type: 'num', def: '45', min: -720, max: 720, hint: R`15° の倍数（15, 30, 45, 60, 75, 90, 105, …）で入力します。` },
      { key: 'b', label: R`$\beta$（度）`, type: 'num', def: '30', min: -720, max: 720, show: (r) => r.mode !== 'multi' }
    ],
    examples: [
      { label: 'sin 75°（45°＋30°）', v: { mode: 'plus', a: '45', b: '30' } },
      { label: 'cos 15°（45°−30°）', v: { mode: 'minus', a: '45', b: '30' } },
      { label: 'tan 105°（60°＋45°）', v: { mode: 'plus', a: '60', b: '45' } },
      { label: 'tan が使えない（90°＋45°）', v: { mode: 'plus', a: '90', b: '45' } },
      { label: '30° の 2 倍角・半角', v: { mode: 'multi', a: '30' } },
      { label: '120° の 2 倍角・半角', v: { mode: 'multi', a: '120' } },
      { label: '75° の半角（37.5°）', v: { mode: 'multi', a: '75' } }
    ],
    intro: {
      easy: R`$\sin 15\degree$ や $\cos 75\degree$ のように、三角比の表にない角の値は、**値が分かっている角に分けて**求めます。たとえば $75\degree = 45\degree + 30\degree$ です。そのとき必要になるのが**加法定理**です。
注意したいのは、$\sin(\alpha+\beta)$ が $\sin\alpha + \sin\beta$ にはならないことです。正しくは $\sin\alpha\cos\beta + \cos\alpha\sin\beta$ という、$\sin$ と $\cos$ を組み合わせた式になります。この計算機は、公式に値を代入して、根号の積・和を整理し、有理化まで 1 行ずつ見せます。
**2 倍角**は加法定理で $\beta=\alpha$ とした特別な場合、**半角**は 2 倍角の式を逆向きに使った公式です。`,
      normal: R`加法定理を値の分かる角（$15\degree$ 刻み）の三角比に代入して整理します。$\cos$ の公式は符号が逆になること、$\tan$ は分母の有理化が要ることに注意します。2 倍角は $\beta=\alpha$、半角は $\cos 2\theta = 2\cos^{2}\theta-1$ などの逆用です。`,
      pro: R`加法定理から 2 倍角・3 倍角・半角・積和・和積・合成がすべて導かれます。公式を暗記しすぎず、「加法定理だけ確実に」とし、他はそこから出すと符号ミスが減ります。$\tan\frac{\alpha}{2}=t$ とおく置き換えも定番です。`
    },
    compute(v) {
      const mode = String(v.mode);
      const chk = (x, nm) => {
        if (!isFinite(x) || !isMul15(x)) throw new JK.CalcError(nm + ' は 15° の倍数で入力してください（例: 15, 30, 45, 60, 75, 90, 105, 120, …）');
        return Math.round(x);
      };
      const A = chk(v.a, 'α');
      if (mode === 'multi') return doubleHalf(A);
      const B = chk(v.b, 'β');
      return addForm(A, B, mode === 'plus');
    }
  });

  /* ================= 4. 三角関数の合成 ================= */

  // x² が（分母の小さい）有理数なら Q、そうでなければ null（x = p√m の形かどうかの判定）
  function niceSq(x) {
    const s = x * x, q = Q.from(s);
    if (!q || q.d > 10000 || Math.abs(q.n) > 1e9) return null;
    return Math.abs(q.val() - s) <= 1e-9 * Math.max(1, Math.abs(s)) ? q : null;
  }
  // 実数の厳密な TeX（p√m の形）。厳密にできなければ小数
  function numTex(x) {
    const q = niceSq(x);
    if (!q) return U.fmt(x, 4);
    const t = U.sqrtTex(q);
    return x < 0 ? '-' + t : t;
  }
  // 係数つきの項（c·trig）の TeX
  function coefTerm(c, trig, first) {
    const q = niceSq(c);
    const one = q && q.eq(1);
    const body = one ? '' : numTex(Math.abs(c));
    const sign = c < 0 ? '-' : '';
    if (first) return sign + body + trig;
    return (c < 0 ? ' - ' : ' + ') + body + trig;
  }

  function composeFig(a, b, r, alphaDeg) {
    const w = Math.max(1.3 * r, 1e-6);
    const o = {
      w: 320, h: 300, x: [-w, w], y: [-w, w], equal: true,
      param: [circleOf(r, 'dim'), arcOf(0.3 * r, 0, alphaDeg * D2R, 'c3')],
      segs: [
        { x1: 0, y1: 0, x2: a, y2: b, cls: 'c1', arrow: true },
        { x1: a, y1: 0, x2: a, y2: b, cls: 'c2', dash: true, label: 'b' },
        { x1: 0, y1: 0, x2: a, y2: 0, cls: 'c4', dash: true, label: 'a' }
      ],
      points: [{ x: a, y: b, label: 'P(a, b)', cls: 'c1', pos: posOf(a, b) }],
      labels: [{ x: 0.42 * r * Math.cos(alphaDeg * D2R / 2), y: 0.42 * r * Math.sin(alphaDeg * D2R / 2), text: 'α', cls: 'c3' }, { x: -w * 0.95, y: w * 0.9, text: 'r = ' + fm(r, 3) + '，α = ' + fm(alphaDeg, 2) + '°', cls: 'dim' }]
    };
    return JK.plot.graph(o);
  }
  function circleOf(rr, cls) { return { x: (t) => rr * Math.cos(t), y: (t) => rr * Math.sin(t), t: [0, 2 * PI], cls: cls, dash: true }; }
  function arcOf(rr, t0, t1, cls) { return { x: (t) => rr * Math.cos(t), y: (t) => rr * Math.sin(t), t: [t0, t1], cls: cls }; }

  JK.registerCalc({
    id: 'iib-compose',
    course: 'IIB',
    unit: 'm-trig2',
    group: '三角関数',
    title: '三角関数の合成',
    desc: R`$a\sin\theta + b\cos\theta$ を $r\sin(\theta + \alpha)$ の形にまとめ、$r,\ \alpha$、最大値・最小値とグラフを求めます。$a,\ b$ には $\sqrt{3}$ や $1/2$ も入力できます。`,
    form: [R`a\sin\theta + b\cos\theta = r\sin(\theta + \alpha)`, R`r = \sqrt{a^{2} + b^{2}},\qquad \cos\alpha = \frac{a}{r},\quad \sin\alpha = \frac{b}{r}`],
    inputs: [
      { key: 'a', label: R`$\sin\theta$ の係数 $a$`, type: 'num', def: '1', min: -1000, max: 1000, hint: R`$\sqrt{3}$ は √3、$\frac{1}{2}$ は 1/2 のように入力できます。` },
      { key: 'b', label: R`$\cos\theta$ の係数 $b$`, type: 'num', def: '1', min: -1000, max: 1000 }
    ],
    examples: [
      { label: 'sinθ + cosθ', v: { a: '1', b: '1' } },
      { label: 'sinθ + √3 cosθ', v: { a: '1', b: '√3' } },
      { label: '√3 sinθ − cosθ', v: { a: '√3', b: '-1' } },
      { label: '3sinθ + 4cosθ', v: { a: '3', b: '4' } },
      { label: 'sinθ − cosθ', v: { a: '1', b: '-1' } },
      { label: '−sinθ + cosθ', v: { a: '-1', b: '1' } },
      { label: '2sinθ（b = 0）', v: { a: '2', b: '0' } }
    ],
    intro: {
      easy: R`$\sin\theta + \cos\theta$ のように、$\sin$ と $\cos$ が足し算になった式は、最大値や最小値が分かりにくいです。ところが、これを **1 つの $\sin$ にまとめる**と、$r\sin(\theta+\alpha)$ という形になり、「大きさ（振幅）$r$ の波を $\alpha$ だけずらしたもの」だと分かります。波の最大値は $r$、最小値は $-r$ ですから、すぐに最大・最小が読み取れます。
まとめ方の鍵は、右辺を加法定理で展開することです。$r\sin(\theta+\alpha) = r\cos\alpha\sin\theta + r\sin\alpha\cos\theta$ と書けるので、$a = r\cos\alpha,\ b = r\sin\alpha$ とおけばよいのです。座標平面で点 $(a,\ b)$ を考えると、$r$ は原点からの距離、$\alpha$ は $x$ 軸から測った角になります。`,
      normal: R`$r = \sqrt{a^{2}+b^{2}}$、$\cos\alpha = \frac{a}{r},\ \sin\alpha = \frac{b}{r}$ となる $\alpha$ を点 $(a,\ b)$ の位置から決めて、$a\sin\theta + b\cos\theta = r\sin(\theta+\alpha)$。最大値 $r$、最小値 $-r$。`,
      pro: R`$\alpha$ は $\cos\alpha$ と $\sin\alpha$ の**両方**の符号を見て決めます（$\tan\alpha = \frac{b}{a}$ だけでは象限を取り違えます）。定義域に制限があるときは、$\theta+\alpha$ の範囲を先に求めて最大・最小を判断します。`
    },
    compute(v) {
      const a = v.a, b = v.b;
      if (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12) throw new JK.CalcError('a と b が両方 0 です（式が 0 になって合成できません）');
      const qa = niceSq(a), qb = niceSq(b);
      const exactR = !!(qa && qb);
      const r2 = exactR ? qa.add(qb) : null;
      const r = Math.sqrt(a * a + b * b);
      const rT = exactR ? U.sqrtTex(r2) : fm(r, 4);
      const alphaDeg0 = Math.atan2(b, a) / D2R;
      const special = isMul15(alphaDeg0);
      const alphaDeg = special ? Math.round(alphaDeg0 / 15) * 15 : alphaDeg0;
      const alphaK = special ? degToK(alphaDeg) : null;
      const alphaRad = alphaDeg * D2R;
      const alphaT = special ? kpi(alphaK) : fm(alphaRad, 4);
      const alphaAbsT = special ? kpi(alphaK.abs()) : fm(Math.abs(alphaRad), 4);
      const argT = Math.abs(alphaDeg) < 1e-9 ? R`\theta` : R`\theta ` + (alphaDeg < 0 ? '- ' : '+ ') + alphaAbsT;
      const rCoef = (rT === '1') ? '' : (hasTopOp(rT) ? pa(rT) : rT);
      const composed = rCoef + R`\sin(` + argT + ')';
      const original = coefTerm(a, R`\sin\theta`, true) + coefTerm(b, R`\cos\theta`, false);
      const cosA = exactR ? (a === 0 ? '0' : (a < 0 ? '-' : '') + U.sqrtTex(qa.div(r2))) : fm(a / r, 4);
      const sinA = exactR ? (b === 0 ? '0' : (b < 0 ? '-' : '') + U.sqrtTex(qb.div(r2))) : fm(b / r, 4);
      const thMax = ((90 - alphaDeg) % 360 + 360) % 360;
      const thMin = (thMax + 180) % 360;
      const thT = (d) => (special ? kpi(degToK(d)) : fm(d * D2R, 4));
      const thD = (d) => (special ? degT(Math.round(d)) : R`\approx ` + fm(d, 2) + R`\degree`);
      const aT = numTex(a), bT = numTex(b);
      const steps = [];
      steps.push({
        t: 'なぜ合成するのか',
        m: [R`a\sin\theta + b\cos\theta = r\sin(\theta + \alpha)`],
        n: R`$\sin\theta$ と $\cos\theta$ が混ざった式を 1 つの $\sin$ にまとめると、グラフの形（振幅 $r$、ずれ $\alpha$）と最大・最小がひと目で分かります。`,
        easy: R`たとえば $y = \sin\theta + \cos\theta$ の最大値を、そのままでは求めにくいと思いませんか。波の形をした 2 つのグラフを足すと、また波の形になる、というのがこの合成の考え方です。山の高さ $r$ と、波が左右にずれる量 $\alpha$ が分かれば、最大値・最小値・グラフが全部分かります。`,
        lv: 3
      });
      steps.push({
        t: '加法定理で右辺を展開して係数を比べる',
        m: [R`r\sin(\theta + \alpha) = r\cos\alpha\,\sin\theta + r\sin\alpha\,\cos\theta`, R`a = r\cos\alpha,\qquad b = r\sin\alpha`],
        n: R`右辺を加法定理で展開し、$\sin\theta$ と $\cos\theta$ の係数を左辺と比べると、$a = r\cos\alpha$、$b = r\sin\alpha$ が得られます。`,
        easy: R`加法定理 $\sin(\theta+\alpha) = \sin\theta\cos\alpha + \cos\theta\sin\alpha$ を使います。$r$ を前に出して展開し、「$\sin\theta$ の係数」と「$\cos\theta$ の係数」を左辺と見比べます。すると $a = r\cos\alpha,\ b = r\sin\alpha$ という 2 つの関係式が出ます。`,
        pro: R`この 2 式を 2 乗して足すと $a^{2}+b^{2} = r^{2}(\cos^{2}\alpha+\sin^{2}\alpha) = r^{2}$ になり、$r$ が出ます。`
      });
      steps.push({
        t: R`$r$ を求める`,
        m: [R`r = \sqrt{a^{2} + b^{2}}`, exactR ? R`r = \sqrt{` + pa(aT) + R`^{2} + ` + pa(bT) + R`^{2}} = \sqrt{` + r2.tex() + '} = ' + rT : R`r = \sqrt{` + fm(a, 4) + R`^{2} + ` + pa(fm(b, 4)) + R`^{2}} \approx ` + rT],
        n: R`$a = r\cos\alpha,\ b = r\sin\alpha$ を 2 乗して足し、$\sin^{2}\alpha+\cos^{2}\alpha=1$ を使うと $a^{2}+b^{2}=r^{2}$ です。$r>0$ にとります。`,
        easy: R`点 $(a,\ b)$ を座標平面にとったとき、$r$ は原点からの距離です。三平方の定理（中学で習った「直角三角形の斜辺の 2 乗は他の 2 辺の 2 乗の和」）を使えば $r=\sqrt{a^{2}+b^{2}}$ と求まります。`,
        pro: R`$r$ は $a,\ b$ の符号によらず必ず正にとります（$\alpha$ のほうで調整します）。`
      });
      steps.push({
        t: R`$\alpha$ を決める（点 $(a,\ b)$ の位置から）`,
        m: [
          R`\cos\alpha = \frac{a}{r} = ` + R`\frac{` + aT + '}{' + rT + '}' + (R`\frac{` + aT + '}{' + rT + '}' === cosA ? '' : ' = ' + cosA),
          R`\sin\alpha = \frac{b}{r} = ` + R`\frac{` + bT + '}{' + rT + '}' + (R`\frac{` + bT + '}{' + rT + '}' === sinA ? '' : ' = ' + sinA),
          special ? R`\alpha = ` + alphaT + R`\quad (` + degT(alphaDeg) + ')' : R`\alpha \approx ` + fm(alphaRad, 4) + R`\ \text{（ラジアン）} \approx ` + fm(alphaDeg, 2) + R`\degree`
        ],
        n: R`$\cos\alpha$ と $\sin\alpha$ の両方の符号を満たす角 $\alpha$ を、$-\pi < \alpha \le \pi$ の範囲で選びます。図の点 $P(a,\ b)$ に向かう動径の角が $\alpha$ です。` + (special ? '' : R`特殊角ではないので、近似値で示します。`),
        easy: R`点 $P(a,\ b)$ を原点と結ぶと、$x$ 軸から $P$ の向きまでの角が $\alpha$ です。$P$ の $x$ 座標が $r\cos\alpha$（$=a$）、$y$ 座標が $r\sin\alpha$（$=b$）になることは、単位円の定義と同じです。$a,\ b$ の符号で象限が決まり、その象限にある角を選びます。`,
        pro: R`$\tan\alpha = \frac{b}{a}$ だけで決めると、第 2・第 3 象限で角を取り違えます。必ず $\cos\alpha$ と $\sin\alpha$ の符号を確認します。`
      });
      steps[steps.length - 1].fig = composeFig(a, b, r, alphaDeg);
      steps.push({
        t: '合成した式',
        m: [original + R` = ` + composed + (exactR ? '' : R` \quad (r,\ \alpha \text{ は近似値})`)],
        n: R`$r = ` + rT + R`,\ \alpha = ` + alphaT + R`$ を $r\sin(\theta+\alpha)$ に代入します。` + (alphaDeg < 0 ? R`$\alpha$ が負なので、$\theta - $（正の数）の形になります。` : ''),
        easy: R`求めた $r$ と $\alpha$ を $r\sin(\theta+\alpha)$ に入れれば完成です。$\alpha$ が負のときは $\theta + (\text{負の数})$ なので、$\theta - $（正の数）と書き直します。`,
        pro: R`最後に $\theta = 0$ を代入して、左辺 $=b$ と右辺 $=r\sin\alpha$ が一致するか確かめると、符号ミスを防げます。`
      });
      steps.push({
        t: '最大値・最小値と，そのときの θ',
        m: [
          R`-r \le a\sin\theta + b\cos\theta \le r`,
          R`\text{最大値 } ` + rT + R`\quad (\theta + \alpha = \frac{\pi}{2} \;\Rightarrow\; \theta = ` + thT(thMax) + (special ? '' : R`\approx ` + fm(thMax * D2R, 4)) + ')',
          R`\text{最小値 } -` + par(rT) + R`\quad (\theta + \alpha = \frac{3\pi}{2} \;\Rightarrow\; \theta = ` + thT(thMin) + (special ? '' : R`\approx ` + fm(thMin * D2R, 4)) + ')'
        ],
        n: R`$-1 \le \sin(\theta+\alpha) \le 1$ なので、$-r \le r\sin(\theta+\alpha) \le r$ です。$0 \le \theta < 2\pi$ では、最大は $\theta+\alpha=\frac{\pi}{2}$、最小は $\theta+\alpha=\frac{3\pi}{2}$ のとき（それぞれ $2\pi$ の整数倍の差は範囲に収めます）。`,
        easy: R`$\sin$ の値はどんな角でも $-1$ から $1$ の間です。$r$ 倍すれば $-r$ から $r$ の間になり、一番高い山で $r$、一番深い谷で $-r$ です。山の位置は $\theta+\alpha=90\degree$（$\sin$ が $1$）になる $\theta$、谷の位置は $\theta+\alpha=270\degree$ になる $\theta$ です。`,
        pro: R`最大・最小問題では、$0\le\theta<2\pi$ のとき $\theta+\alpha$ の取りうる範囲（$\alpha \le \theta+\alpha < 2\pi+\alpha$）を先に書き、その中で $\sin$ が最大・最小になる位置を探します。`
      });
      // 検算: 数値
      const chkTh = 40;
      const lhs = a * Math.sin(chkTh * D2R) + b * Math.cos(chkTh * D2R);
      const rhs = r * Math.sin(chkTh * D2R + alphaRad);
      steps.push({
        t: '数値で確かめる（$\\theta = 40\\degree$）',
        m: [R`\text{左辺} = ` + fm(a, 4) + R`\sin 40\degree + ` + pa(fm(b, 4)) + R`\cos 40\degree \approx ` + fm(lhs, 4), R`\text{右辺} = ` + fm(r, 4) + R`\sin(40\degree + ` + fm(alphaDeg, 2) + R`\degree) \approx ` + fm(rhs, 4)],
        n: R`適当な角（ここでは $40\degree$）で両辺を電卓計算して一致するか確かめます。`,
        easy: R`合成の式が正しいかは、実際に数字を入れて確かめられます。左辺と右辺がほぼ同じ値になれば、$r$ と $\alpha$ が合っています。`,
        lv: 2
      });
      const gx = (t) => a * Math.sin(t * D2R) + b * Math.cos(t * D2R);
      const fig = JK.plot.graph({
        w: 340, h: 250, x: [0, 360], y: [-1.25 * r, 1.25 * r], axis: ['', 'y'],
        labels: [{ x: 6, y: 1.12 * r, text: '横軸 θ は度（°）', cls: 'dim' }],
        curves: [{ f: gx, cls: 'c1' }],
        hlines: [{ y: r, label: 'y = ' + fm(r, 3), dash: true, cls: 'c3' }, { y: -r, label: 'y = −' + fm(r, 3), dash: true, cls: 'c3' }],
        vlines: [{ x: thMax, dash: true, cls: 'c4' }],
        points: [
          { x: thMax, y: r, label: '最大', cls: 'c3', pos: thMax > 270 ? 'tl' : 'tr' },
          { x: thMin, y: -r, label: '最小', cls: 'c2', pos: thMin > 270 ? 'bl' : 'br' }
        ]
      });
      return {
        result: [
          { label: '合成', tex: original + ' = ' + composed },
          { label: '振幅 r', tex: 'r = ' + rT },
          { label: '位相のずれ α', tex: R`\alpha = ` + (special ? alphaT + R`\ (` + degT(alphaDeg) + ')' : R`\approx ` + fm(alphaRad, 4) + R`\ (` + fm(alphaDeg, 2) + R`\degree)`) },
          { label: '最大値', tex: rT + R`\ \ (\theta = ` + (special ? thT(thMax) : fm(thMax * D2R, 4)) + ')' },
          { label: '最小値', tex: '-' + par(rT) + R`\ \ (\theta = ` + (special ? thT(thMin) : fm(thMin * D2R, 4)) + ')' }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 5. 三角方程式・不等式 ================= */

  const FNS = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  const RELS = {
    eq: { tex: '=', has: true, test: (d) => Math.abs(d) < 1e-9 },
    lt: { tex: '<', has: false, test: (d) => d < -1e-9 },
    le: { tex: R`\le`, has: true, test: (d) => d < 1e-9 },
    gt: { tex: '>', has: false, test: (d) => d > 1e-9 },
    ge: { tex: R`\ge`, has: true, test: (d) => d > -1e-9 }
  };
  const normDeg = (d) => { let x = ((d % 360) + 360) % 360; if (x > 360 - 1e-9) x = 0; return x; };

  // 基準角を使った解の一覧 { none, ref, list: [{deg, expr}], where }
  function baseRoots(fn, k) {
    const ak = Math.abs(k), zero = ak < 1e-12;
    const snap = (x) => (isMul15(x) ? Math.round(x / 15) * 15 : x);
    let ref = 0, items = [], where = '';
    if (fn === 'tan') {
      ref = snap(Math.atan(ak) / D2R);
      if (zero) { items = [[0, R`0\degree`], [180, R`180\degree`]]; where = '傾きが 0 なので、動径は $x$ 軸上'; }
      else if (k > 0) { items = [[ref, R`\alpha'`], [180 + ref, R`180\degree + \alpha'`]]; where = '傾きが正なので、第 1・第 3 象限'; }
      else { items = [[180 - ref, R`180\degree - \alpha'`], [360 - ref, R`360\degree - \alpha'`]]; where = '傾きが負なので、第 2・第 4 象限'; }
    } else {
      if (ak > 1 + 1e-12) return { none: true };
      if (fn === 'sin') {
        ref = snap(Math.asin(Math.min(1, ak)) / D2R);
        if (zero) { items = [[0, R`0\degree`], [180, R`180\degree`]]; where = '$y$ 座標が $0$ なので、円の左右の端'; }
        else if (k > 0) { items = [[ref, R`\alpha'`], [180 - ref, R`180\degree - \alpha'`]]; where = '$y$ 座標が正なので、第 1・第 2 象限'; }
        else { items = [[180 + ref, R`180\degree + \alpha'`], [360 - ref, R`360\degree - \alpha'`]]; where = '$y$ 座標が負なので、第 3・第 4 象限'; }
      } else {
        ref = snap(Math.acos(Math.min(1, ak)) / D2R);
        if (zero) { items = [[90, R`90\degree`], [270, R`270\degree`]]; where = '$x$ 座標が $0$ なので、円の上下の端'; }
        else if (k > 0) { items = [[ref, R`\alpha'`], [360 - ref, R`360\degree - \alpha'`]]; where = '$x$ 座標が正なので、第 1・第 4 象限'; }
        else { items = [[180 - ref, R`180\degree - \alpha'`], [180 + ref, R`180\degree + \alpha'`]]; where = '$x$ 座標が負なので、第 2・第 3 象限'; }
      }
    }
    const list = [];
    items.forEach((it) => {
      const d = normDeg(it[0]);
      if (!list.some((x) => Math.abs(x.deg - d) < 1e-9)) list.push({ deg: d, expr: it[1] });
    });
    list.sort((p, q) => p.deg - q.deg);
    return { none: false, ref: ref, zero: zero, list: list, where: where };
  }

  const degRadTex = (d) => (isMul15(d) ? kpi(degToK(d)) : fm(d * D2R, 4));
  const degName = (d) => (isMul15(d) ? degT(Math.round(d)) : fm(d, 2) + R`\degree`);

  // 0 ≦ θ < 2π での解集合（区間の列）
  function solveSet(fn, rel, k, roots) {
    const f = FNS[fn], T = RELS[rel];
    const marks = [{ d: 0, kind: 'start' }];
    roots.forEach((d) => { if (d < 1e-9) marks[0] = { d: 0, kind: 'root' }; else marks.push({ d: d, kind: 'root' }); });
    if (fn === 'tan') marks.push({ d: 90, kind: 'disc' }, { d: 270, kind: 'disc' });
    marks.sort((p, q) => p.d - q.d);
    const atoms = [];
    marks.forEach((mk2, i) => {
      let inc;
      if (mk2.kind === 'root') inc = T.has;
      else if (mk2.kind === 'disc') inc = false;
      else inc = T.test(f(0) - k);
      atoms.push({ type: 'pt', d: mk2.d, inc: inc });
      const end = i + 1 < marks.length ? marks[i + 1].d : 360;
      if (end - mk2.d > 1e-9) atoms.push({ type: 'iv', a: mk2.d, b: end, inc: T.test(f(((mk2.d + end) / 2) * D2R) - k) });
    });
    const segs = [];
    let cur = null;
    atoms.forEach((at) => {
      if (at.inc) {
        const l = at.type === 'pt' ? at.d : at.a, r = at.type === 'pt' ? at.d : at.b, cl = at.type === 'pt';
        if (!cur) cur = { l: l, lc: cl, r: r, rc: cl };
        else { cur.r = r; cur.rc = cl; }
      } else if (cur) { segs.push(cur); cur = null; }
    });
    if (cur) segs.push(cur);
    return segs;
  }
  // 区間 s を「a ≦ θ < b」の形に（conv: 角の表し方、top: 2π または 360° の表記）
  function segTex(s, conv, top) {
    if (Math.abs(s.r - s.l) < 1e-9) return R`\theta = ` + conv(s.l);
    const Rt = s.r >= 360 - 1e-9 ? top : conv(s.r);
    return conv(s.l) + (s.lc ? R` \le ` : ' < ') + R`\theta` + (s.rc ? R` \le ` : ' < ') + Rt;
  }
  function setTex(segs, conv, top) {
    if (!segs.length) return R`\text{解なし}`;
    if (segs.every((s) => Math.abs(s.r - s.l) < 1e-9)) return R`\theta = ` + segs.map((s) => conv(s.l)).join(R`,\ `);
    return segs.map((s) => segTex(s, conv, top)).join(R`\ \ \text{または}\ \ `);
  }

  function eqFig(fn, k, roots, segs) {
    const o = unitBase();
    if (fn === 'sin' && Math.abs(k) <= 1.45) o.hlines.push({ y: k, label: 'y = ' + fm(k, 3), dash: true, cls: 'c2' });
    if (fn === 'cos' && Math.abs(k) <= 1.45) o.vlines.push({ x: k, label: 'x = ' + fm(k, 3), dash: true, cls: 'c2' });
    if (fn === 'tan') {
      o.vlines.push({ x: 1, label: 'x = 1', dash: true, cls: 'c2' });
      const sc = Math.min(1.45, 1.45 / Math.max(Math.abs(k), 1e-9));
      o.segs.push({ x1: -sc, y1: -k * sc, x2: sc, y2: k * sc, cls: 'c2', dash: true });
      if (Math.abs(k) <= 1.45) o.points.push({ x: 1, y: k, label: 'T', cls: 'c2', pos: k >= 0 ? 'tr' : 'br' });
    }
    segs.forEach((s) => {
      if (Math.abs(s.r - s.l) > 1e-9) o.param.push(arcP(1, s.l * D2R, s.r * D2R, 'c3'));
    });
    roots.forEach((d) => {
      const cx = Math.cos(d * D2R), cy = Math.sin(d * D2R);
      o.segs.push({ x1: 0, y1: 0, x2: cx, y2: cy, cls: 'c1' });
      o.points.push({ x: cx, y: cy, cls: 'c1' });
    });
    o.labels = quadLabels();
    if (!segs.length) o.labels.push({ x: -0.6, y: 0.12, text: '解なし', cls: 'c3' });
    return JK.plot.graph(o);
  }

  JK.registerCalc({
    id: 'iib-trig-eq',
    course: 'IIB',
    unit: 'm-trig2',
    group: '三角関数',
    title: '三角方程式・不等式（0 ≦ θ < 2π）',
    desc: R`$\sin\theta,\ \cos\theta,\ \tan\theta$ と値 $k$ の等式・不等式を、単位円を使って $0 \le \theta < 2\pi$ の範囲で解きます。特殊角は $\pi$ の分数で表します。`,
    form: [R`\sin\theta = k,\quad \cos\theta = k,\quad \tan\theta = k\qquad (0 \le \theta < 2\pi)`],
    inputs: [
      { key: 'fn', label: '三角関数', type: 'select', def: 'sin', options: [['sin', 'sin θ'], ['cos', 'cos θ'], ['tan', 'tan θ']] },
      { key: 'rel', label: '関係', type: 'select', def: 'eq', options: [['eq', '＝（方程式）'], ['lt', '＜'], ['le', '≦'], ['gt', '＞'], ['ge', '≧']] },
      { key: 'k', label: R`右辺の値 $k$`, type: 'num', def: '1/2', hint: R`$\frac{\sqrt{3}}{2}$ は √3/2、$\frac{1}{\sqrt{2}}$ は 1/√2 のように入力できます。` }
    ],
    examples: [
      { label: 'sinθ = 1/2', v: { fn: 'sin', rel: 'eq', k: '1/2' } },
      { label: 'cosθ = −√2/2', v: { fn: 'cos', rel: 'eq', k: '-√2/2' } },
      { label: 'tanθ = √3', v: { fn: 'tan', rel: 'eq', k: '√3' } },
      { label: 'sinθ > √3/2', v: { fn: 'sin', rel: 'gt', k: '√3/2' } },
      { label: 'cosθ ≦ 1/2', v: { fn: 'cos', rel: 'le', k: '1/2' } },
      { label: 'tanθ ≧ 1', v: { fn: 'tan', rel: 'ge', k: '1' } },
      { label: 'sinθ = 2（解なし）', v: { fn: 'sin', rel: 'eq', k: '2' } },
      { label: 'sinθ = 0.3（特殊角でない）', v: { fn: 'sin', rel: 'eq', k: '0.3' } }
    ],
    intro: {
      easy: R`$\sin\theta = \frac{1}{2}$ のような式を満たす角 $\theta$ を探す問題です。半径 $1$ の円（**単位円**）で考えると、$\sin\theta$ は「円周上の点の $y$ 座標」、$\cos\theta$ は「$x$ 座標」、$\tan\theta$ は「原点と点を結ぶ直線の傾き」です。$y$ 座標が $\frac{1}{2}$ になる円周上の点は 2 つあるので、$0 \le \theta < 2\pi$ では答えも 2 つになります。
不等式のときは、条件を満たす側（たとえば $y$ 座標が $\frac{1}{2}$ より大きい部分）の**円周上の弧**を選んで、その端の角を範囲として読み取ります。範囲の端を含むかどうかは不等号（$<$ か $\le$）で決まります。`,
      normal: R`基準角 $\alpha'$（鋭角）を求め、符号から象限を決めて $\theta$ を並べます。不等式は、方程式の解を境に単位円（または $\tan$ のグラフ）で条件を満たす範囲を読み取ります。`,
      pro: R`$\sin\theta$・$\cos\theta$ の不等式は円周上の弧、$\tan\theta$ の不等式は $\theta=\frac{\pi}{2},\ \frac{3\pi}{2}$ で区切られた区間ごとに増加する様子で考えます。$2\theta$ や $\theta-\frac{\pi}{3}$ を含むときは、まず全体を 1 つの角 $t$ とおいて範囲を広げます。`
    },
    compute(v) {
      const fn = String(v.fn), rel = String(v.rel), k = v.k;
      if (!isFinite(k)) throw new JK.CalcError('k を数値で入力してください');
      const T = RELS[rel];
      const br = baseRoots(fn, k);
      const roots = br.none ? [] : br.list.map((x) => x.deg);
      const segs = solveSet(fn, rel, k, roots);
      const kT = numTex(k);
      const FN = '\\' + fn;
      const fnT = FN + R`\theta`;
      const special = !br.none && (br.zero || isMul15(br.ref));
      const steps = [];
      steps.push({
        t: '単位円で $' + fnT + '$ は何を表すか',
        m: [fn === 'sin' ? R`\sin\theta = (\text{点 } P \text{ の } y \text{ 座標})` : (fn === 'cos' ? R`\cos\theta = (\text{点 } P \text{ の } x \text{ 座標})` : R`\tan\theta = (\text{直線 } OP \text{ の傾き}) = (\text{直線 } x=1 \text{ との交点の } y \text{ 座標})`)],
        n: R`半径 $1$ の円の上で、動径と円の交点を $P(\cos\theta,\ \sin\theta)$ とします。` + (fn === 'sin' ? R`$\sin\theta = k$ は「$P$ の $y$ 座標が $k$」という条件です。` : (fn === 'cos' ? R`$\cos\theta = k$ は「$P$ の $x$ 座標が $k$」という条件です。` : R`$\tan\theta = k$ は「原点と $P$ を結ぶ直線の傾きが $k$」という条件です。`)),
        easy: fn === 'tan'
          ? R`$\tan\theta$ は「$\frac{y}{x}$」、つまり原点から点 $P$ を見たときの**傾き**です。傾きが $k$ の直線は原点を通る 1 本だけで、その直線は円と 2 点（反対側どうし）で交わります。ただし $\theta=\frac{\pi}{2}$ のような真上・真下は傾きが定義されません。`
          : R`単位円では「` + (fn === 'sin' ? R`$y$` : R`$x$`) + R` 座標が $k$ になる点」を探す問題になります。円の上で` + (fn === 'sin' ? '高さ' : '横の位置') + R`が $k$ の点は、$|k|<1$ ならちょうど 2 つあります（$|k|=1$ なら 1 つ、$|k|>1$ なら 0 個）。`,
        lv: 3
      });
      if (br.none) {
        steps.push({
          t: '解があるか調べる',
          m: [R`-1 \le ` + fnT + R` \le 1`, R`k = ` + kT + (k > 1 ? R` > 1` : R` < -1`)],
          n: '$' + fnT + R`$ の値は常に $-1$ 以上 $1$ 以下です。$k$ がこの範囲の外なので、等式を満たす $\theta$ はありません。` + (rel === 'eq' ? '' : (segs.length ? R`不等式は、すべての $\theta$ で成り立ちます。` : R`不等式を満たす $\theta$ はありません。`)),
          easy: R`単位円の半径は $1$ なので、$x$ 座標も $y$ 座標も $-1$ から $1$ の間にしかなれません。$` + kT + R`$ はその外なので、円の上にそんな点はありません。` + (rel === 'eq' ? '' : R`不等式のときは、円周上のどの点でも条件が成り立つか、どの点でも成り立たないかのどちらかです。`)
        });
        steps.push({
          t: '結論',
          m: [setTex(segs, degRadTex, R`2\pi`)],
          n: rel === 'eq' ? R`等式を満たす $\theta$ は $0 \le \theta < 2\pi$ の範囲に存在しないので、解なしです。` : (segs.length ? R`$0 \le \theta < 2\pi$ のすべての $\theta$ で不等式が成り立ちます。` : R`不等式を満たす $\theta$ は $0 \le \theta < 2\pi$ の範囲に存在しません（解なし）。`),
          easy: R`図で確かめると、条件の線（$` + (fn === 'cos' ? 'x' : 'y') + R` = ` + kT + R`$）は単位円の外側にあります。` + (rel === 'eq' ? '円周上にその線に届く点はないので、解なしです。' : (segs.length ? '円周上のどの点も条件を満たすので、不等式はすべての角で成り立ちます。' : '円周上のどの点も条件を満たさないので、解なしです。')),
          pro: R`$|k|>1$ の三角方程式は、見た瞬間に「解なし」と答えます（不等式は全体か空集合かを大小で判断）。`
        });
      } else {
        const refLine = br.zero ? '' : (isMul15(br.ref) ? R`\alpha' = ` + degT(Math.round(br.ref)) + R` = ` + kpi(degToK(br.ref)) : R`\alpha' \approx ` + fm(br.ref, 2) + R`\degree \approx ` + fm(br.ref * D2R, 4));
        steps.push({
          t: R`基準角 $\alpha'$ を求める`,
          m: br.zero ? [R`k = 0 \;\Rightarrow\; \text{軸上の角}`] : [FN + R`\alpha' = |k| = ` + numTex(Math.abs(k)) + R`\quad (0\degree < \alpha' < 90\degree)`, refLine],
          n: R`まず $k$ の絶対値を使って、$` + FN + R`\alpha' = |k|$ となる鋭角 $\alpha'$ を求めます。` + (special ? R`$\alpha'$ は特殊角です。` : R`特殊角ではないので、$\alpha'$ は近似値です（電卓の逆関数で求めます）。`),
          easy: R`$k$ の符号をいったん外して、$` + FN + R`$ が $|k|$ になる**鋭角**を探します。$30\degree,\ 45\degree,\ 60\degree$ の三角比の値（$\frac{1}{2},\ \frac{\sqrt{2}}{2},\ \frac{\sqrt{3}}{2}$、$\tan$ なら $\frac{1}{\sqrt{3}},\ 1,\ \sqrt{3}$）を思い出して、$|k|$ に等しいものを選びます。これを**基準角**といいます。`,
          pro: R`$|k|$ が $\frac{1}{2},\ \frac{\sqrt{2}}{2},\ \frac{\sqrt{3}}{2},\ 1$（$\tan$ は $\frac{\sqrt{3}}{3},\ 1,\ \sqrt{3}$）のときは、暗記した角を即答します。`
        });
        steps.push({
          t: '象限を決めて、すべての解を並べる',
          m: [R`\theta = ` + br.list.map((x) => x.expr).join(R`,\ `), R`\theta = ` + br.list.map((x) => degName(x.deg)).join(R`,\ `) + R`\quad (0\degree \le \theta < 360\degree)`, R`\theta = ` + br.list.map((x) => degRadTex(x.deg)).join(R`,\ `)],
          n: R`$k$ の符号から、` + br.where + R`に動径があります。基準角 $\alpha'$ を使って各象限の角を作ります。`,
          easy: R`単位円で、$` + FN + R`$ が $k$ になる点は 2 か所あります（$k=0$ や $|k|=1$ では重なることもあります）。基準角 $\alpha'$ を、$x$ 軸の向き（$0\degree$ か $180\degree$）からそれぞれ「足す」か「引く」かで $\theta$ が決まります。結果は度でもラジアンでも表せるようにしておきます。`,
          pro: R`解を 2 つ書いたら、図で動径の位置を確認します。$\tan$ は $180\degree$ ごとに同じ値を繰り返すので、$\theta_0,\ \theta_0+\pi$ の 2 解です。`
        });
      }
      if (rel !== 'eq') {
        steps.push({
          t: '不等式を図で読む',
          m: [fnT + R`\ ` + T.tex + ' ' + kT + R`\quad (0 \le \theta < 2\pi)`, setTex(segs, degRadTex, R`2\pi`)],
          n: (br.none
            ? R`方程式の解がないので、不等式は円周上の弧全体か空のどちらかです。` + (segs.length ? R`この場合は、すべての $\theta$ で成り立ちます。` : R`この場合は、成り立つ $\theta$ がありません。`)
            : R`方程式の解を境に、条件を満たす側の円周上の弧（図の色つきの弧）を選び、角の範囲に直します。端点は` + (T.has ? R`$\le$（等号つき）なので含み` : R`$<$ または $>$ なので含まず`) + R`、$\theta = 2\pi$ は範囲外です。`) + (fn === 'tan' ? R`$\tan$ は $\theta=\frac{\pi}{2},\ \frac{3\pi}{2}$ で定義されないので、その角は解に含めません。` : ''),
          easy: R`方程式の解は「境目」です。たとえば $` + fnT + R` > k$ なら、$` + (fn === 'cos' ? 'x' : 'y') + R`$ 座標が $k$ より` + (fn === 'cos' ? '右' : '上') + R`にある円周上の弧が答えです。弧の端の角が範囲の端になります。` + (fn === 'tan' ? R`$\tan$ は真上・真下の向きで値が飛ぶので、そこで範囲が切れる点に注意します。` : ''),
          pro: R`範囲を答えるときは、$0 \le \theta < 2\pi$ の端（$0$ と $2\pi$）をまたいで 2 つの区間に分かれることがあります（たとえば $\cos\theta \ge \frac{1}{2}$）。`
        });
      }
      const res = [
        { label: '条件', tex: fnT + ' ' + T.tex + ' ' + kT + R`\quad (0 \le \theta < 2\pi)` },
        { label: '解（ラジアン）', tex: setTex(segs, degRadTex, R`2\pi`) + ((!br.none && !special) ? R`\quad (\text{近似値})` : '') }
      ];
      if (segs.length) res.push({ label: '解（度）', tex: setTex(segs, degName, R`360\degree`) });
      return { result: res, steps: steps, fig: eqFig(fn, k, roots, segs) };
    }
  });
})();
