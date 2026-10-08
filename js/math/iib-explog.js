/* 数II・B — 指数・対数関数
   指数の計算 / 対数の値 / 対数の性質による計算 / 桁数と小数首位 / 指数・対数方程式
   構成は ia-quad.js に合わせる（intro → result → steps(easy/pro/lv) → fig）。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;
  const CalcError = JK.CalcError;

  /* ======================= 共通ヘルパー ======================= */

  const f4 = (x) => U.fmt(x, 4);
  const f5 = (x) => U.fmt(x, 5);
  // 式変形（= をそろえる）。rows[0] は「左辺 &= 右辺」、2 行目以降は「&= 右辺」
  const al = (rows) => R`\begin{aligned} ` + rows.join(R` \\ `) + R` \end{aligned}`;
  const sup = (base, ex) => base + '^{' + ex + '}';
  // 有理数を底とする累乗（分数・負の数は括弧つき）
  function powB(q, ex) {
    const t = (q.d === 1 && q.sign() > 0) ? q.tex() : R`\left(` + q.tex() + R`\right)`;
    return t + '^{' + ex + '}';
  }
  // 整数の係数（1 は省略、-1 は符号だけ）
  const ck = (c) => (c === 1 ? '' : (c === -1 ? '-' : String(c)));
  // 「+ c·body」「- c·body」（c は Q、c = 0 なら空）
  function addTerm(c, body) {
    if (c.isZero()) return '';
    const ab = c.abs();
    const co = ab.eq(1) ? '' : ab.tex() + (/^[0-9]/.test(body) ? R`\cdot ` : '');
    return (c.sign() < 0 ? ' - ' : ' + ') + co + body;
  }
  // 「+ c × t」「- c × t」（代入した式の表示用）
  function addProd(c, tTex) {
    if (c.isZero()) return '';
    const ab = c.abs();
    return (c.sign() < 0 ? ' - ' : ' + ') + (ab.eq(1) ? tTex : ab.tex() + R` \times ` + tTex);
  }
  // 単純な文字・数以外は括弧で囲む
  const par = (s) => (/^[0-9a-zA-Z]+$/.test(s) ? s : R`\left(` + s + R`\right)`);
  function addConst(c) {
    if (c.isZero()) return '';
    return (c.sign() < 0 ? ' - ' : ' + ') + c.abs().tex();
  }
  // 整数 n の素因数分解（TeX）
  function facInt(n) {
    const f = U.primeFactors(n);
    if (!f.length) return '1';
    return f.map((x) => (x[1] === 1 ? String(x[0]) : x[0] + '^{' + x[1] + '}')).join(R` \times `);
  }
  function facQ(q) { return q.d === 1 ? facInt(q.n) : R`\frac{` + facInt(q.n) + '}{' + facInt(q.d) + '}'; }
  // 「x = y = z」の連鎖（同じ式が続くときは省く）
  function chain() {
    const out = [];
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i] != null && (!out.length || out[out.length - 1] !== arguments[i])) out.push(arguments[i]);
    }
    return out.join(' = ');
  }

  // 素因数分解の 1 行（素数ならそのことを添える）
  function primeLine(q) {
    if (q.d === 1 && U.primeFactors(q.n).length === 1 && U.primeFactors(q.n)[0][1] === 1) return q.tex() + R` \quad (\text{素数})`;
    return chain(q.tex(), facQ(q));
  }

  function checkSize(q, name) {
    if (q.n > 1e9 || q.d > 1e9) throw new CalcError(name + ' の分子・分母は 10 億以下にしてください');
  }
  function mustPositive(q, name) {
    if (q.sign() <= 0) throw new CalcError(name + ' は正の数にしてください（底・真数は正でなければなりません）');
  }
  function checkBase(a) {
    mustPositive(a, '底 a');
    if (a.eq(1)) throw new CalcError('底 a は 1 以外にしてください（1 は何乗しても 1 なので、対数・指数関数になりません）');
    checkSize(a, '底 a');
  }

  // 正の有理数の素因数分解 {素数: 指数}（分母側は負の指数）
  function factorQ(q) {
    const m = {};
    U.primeFactors(q.n).forEach((f) => { m[f[0]] = (m[f[0]] || 0) + f[1]; });
    U.primeFactors(q.d).forEach((f) => { m[f[0]] = (m[f[0]] || 0) - f[1]; });
    return m;
  }

  // a = c^m, b = c^n（c > 1 の有理数、m ≠ 0 と n は整数）と書けるなら {c, m, n}、書けなければ null。
  // このとき log_a b = n / m（有理数）。a ≠ 1 が前提。
  function commonBase(a, b) {
    const fa = factorQ(a), fb = factorQ(b);
    const set = {};
    Object.keys(fa).concat(Object.keys(fb)).forEach((k) => { set[k] = true; });
    const ps = Object.keys(set).map(Number).sort((x, y) => x - y);
    let g = 0;
    ps.forEach((p) => { g = U.gcd(g, Math.abs(fa[p] || 0)); });
    if (g === 0) return null;
    let s = 0;
    ps.forEach((p) => { s += ((fa[p] || 0) / g) * Math.log(p); });
    const sg = s > 0 ? 1 : -1;
    const gamma = {};
    ps.forEach((p) => { gamma[p] = sg * (fa[p] || 0) / g; });
    let n = null;
    for (let i = 0; i < ps.length; i++) {
      const gp = gamma[ps[i]], bp = fb[ps[i]] || 0;
      if (gp === 0) { if (bp !== 0) return null; continue; }
      if (bp % gp !== 0) return null;
      const k = bp / gp;
      if (n === null) n = k; else if (n !== k) return null;
    }
    if (n === null) return null;
    let c = Q(1);
    ps.forEach((p) => { if (gamma[p]) c = c.mul(Q(p).pow(gamma[p])); });
    return { c: c, m: sg * g, n: n };
  }

  // log_a(arg) の値。exact なら有理数 x、そうでなければ近似 v
  function logInfo(a, arg) {
    const cb = commonBase(a, arg);
    const v = Math.log10(arg.val()) / Math.log10(a.val());
    return { cb: cb, exact: !!cb, x: cb ? Q(cb.n, cb.m) : null, v: cb ? cb.n / cb.m : v };
  }
  const logHead = (aT, argT) => R`\log_{` + aT + '} ' + argT;

  // a^e（a は正の有理数、e は有理数）を「整数部分 × 累乗根」にしたもの。
  // 値 = out × rad^(1/idx)。parts は素因数ごとの内訳（E = 指数 × e、k = E の整数部分、rm = 余りの分子）
  function powExact(base, e) {
    const f = factorQ(base);
    const num = e.n, den = e.d;
    const ps = Object.keys(f).map(Number).sort((x, y) => x - y);
    const parts = [];
    const rems = [];
    let out = Q(1);
    ps.forEach((p) => {
      const N = f[p] * num;
      const k = Math.floor(N / den);
      const rm = N - k * den;
      parts.push({ p: p, e: f[p], E: Q(N, den), k: k, rm: rm });
      if (k !== 0) out = out.mul(Q(p).pow(k));
      if (rm) rems.push([p, rm]);
    });
    let idx = 1, rad = 1;
    if (rems.length) {
      let g = den;
      rems.forEach((x) => { g = U.gcd(g, x[1]); });
      idx = den / g;
      let lg = 0;
      rems.forEach((x) => { lg += (x[1] / g) * Math.log10(x[0]); });
      if (lg > 15) throw new CalcError('値が大きくなりすぎて根号を簡単にできません。数を小さくしてください');
      rems.forEach((x) => { rad *= Math.pow(x[0], x[1] / g); });
    }
    return { out: out, idx: idx, rad: rad, parts: parts, D: den };
  }
  // 1 / (out × rad^(1/idx)) を同じ形に（分母の有理化）
  function recip(v) {
    if (v.idx === 1) return { out: v.out.inv(), idx: 1, rad: 1 };
    const t = powExact(Q(v.rad), Q(v.idx - 1, v.idx));
    return { out: t.out.div(v.out.mul(v.rad)), idx: t.idx, rad: t.rad };
  }
  // out × rad^(1/idx) の TeX
  function radTex(v) {
    if (v.idx === 1 || v.rad === 1) return v.out.tex();
    const rt = v.idx === 2 ? R`\sqrt{` + v.rad + '}' : R`\sqrt[` + v.idx + ']{' + v.rad + '}';
    const num = (v.out.n === 1 ? '' : String(v.out.n)) + rt;
    return v.out.d === 1 ? num : R`\frac{` + num + '}{' + v.out.d + '}';
  }
  const approxOf = (v) => v.out.val() * Math.pow(v.rad, 1 / v.idx);
  function rootTex(aT, pn, qd) {
    const body = pn === 1 ? aT : aT + '^{' + pn + '}';
    if (qd === 1) return body;
    return qd === 2 ? R`\sqrt{` + body + '}' : R`\sqrt[` + qd + ']{' + body + '}';
  }

  // 平方根が有理数なら Q、そうでなければ null
  function sqrtQ(x) {
    if (x.sign() < 0) return null;
    const sn = Math.round(Math.sqrt(x.n)), sd = Math.round(Math.sqrt(x.d));
    return (sn * sn === x.n && sd * sd === x.d) ? Q(sn, sd) : null;
  }

  /* a + b√m（a, b は有理数、m は平方因子をもたない 2 以上の整数）。b = 0 なら有理数。 */
  function QR(a, b, m) { this.a = a; this.b = b; this.m = b.isZero() ? 1 : m; }
  QR.of = function (x) { return x instanceof QR ? x : new QR(Q.of(x), Q(0), 1); };
  QR.sqrt = function (w) {                      // √w（w ≥ 0 の有理数）
    if (w.n * w.d > 1e12) throw new CalcError('数値が大きすぎて根号を簡単にできません');
    const s = U.sqrtSimplify(w.n * w.d);
    if (s['in'] === 1) return new QR(Q(s.out, w.d), Q(0), 1);
    return new QR(Q(0), Q(s.out, w.d), s['in']);
  };
  QR.prototype.add = function (o) {
    o = QR.of(o);
    return new QR(this.a.add(o.a), this.b.add(o.b), this.b.isZero() ? o.m : this.m);
  };
  QR.prototype.neg = function () { return new QR(this.a.neg(), this.b.neg(), this.m); };
  QR.prototype.sub = function (o) { return this.add(QR.of(o).neg()); };
  QR.prototype.mul = function (o) {
    o = QR.of(o);
    const m = this.b.isZero() ? o.m : this.m;
    return new QR(this.a.mul(o.a).add(this.b.mul(o.b).mul(m)), this.a.mul(o.b).add(this.b.mul(o.a)), m);
  };
  QR.prototype.isRat = function () { return this.b.isZero(); };
  QR.prototype.val = function () { return this.a.val() + this.b.val() * Math.sqrt(this.m); };
  QR.prototype.sign = function () {
    if (this.b.isZero()) return this.a.sign();
    const sa = this.a.sign(), sb = this.b.sign();
    if (sa === 0) return sb;
    if (sa === sb) return sa;
    const c = this.a.mul(this.a).cmp(this.b.mul(this.b).mul(this.m));
    return c > 0 ? sa : (c < 0 ? sb : 0);
  };
  QR.prototype.tex = function () {
    if (this.b.isZero()) return this.a.tex();
    const L = U.lcm(this.a.d, this.b.d);
    let A = this.a.n * (L / this.a.d), B = this.b.n * (L / this.b.d);
    const g = U.gcd(U.gcd(A, B), L) || 1;
    A /= g; B /= g;
    const D = L / g;
    const rt = (Math.abs(B) === 1 ? '' : String(Math.abs(B))) + R`\sqrt{` + this.m + '}';
    if (A === 0) {
      const s = B < 0 ? '-' : '';
      return D === 1 ? s + rt : s + R`\frac{` + rt + '}{' + D + '}';
    }
    const num = String(A) + (B < 0 ? ' - ' : ' + ') + rt;
    return D === 1 ? num : R`\frac{` + num + '}{' + D + '}';
  };
  // 括弧つき（代入表示用）
  QR.prototype.par = function () {
    return (this.b.isZero() ? this.a.sign() >= 0 && this.a.d === 1 : false) ? this.tex() : R`\left(` + this.tex() + R`\right)`;
  };

  /* ---- グラフ ---- */
  // y = a^x と、点 (rv, a^rv)（水平線・垂直線つき）
  function expGraph(a, rv, label) {
    const fv = (x) => Math.pow(a, x);
    const yv = fv(rv);
    const ytop = Math.max(4, 1.6 * Math.max(yv, 1));
    const pts = [{ x: rv, y: yv, cls: 'c3', label: label, pos: 'br' }];
    if (rv !== 0) pts.unshift({ x: 0, y: 1, cls: 'c4', label: '(0, 1)', pos: 'tl' });
    return JK.plot.graph({
      w: 340, h: 240,
      x: [Math.min(-3, rv - 1), Math.max(3, rv + 1)],
      y: [-0.1 * ytop, ytop],
      curves: [{ f: fv, cls: 'c1' }],
      hlines: [{ y: yv, dash: true }],
      vlines: [{ x: rv, dash: true }],
      points: pts,
      labels: [{ x: Math.min(-3, rv - 1) + 0.2, y: ytop * 0.9, text: 'y = a^x', cls: 'c1' }]
    });
  }
  // y = log_a x のグラフ。pts: 点の配列 [{x, y, label, cls, pos}]
  function logGraph(a, pts, extra) {
    const L = Math.log(a);
    const fv = (x) => Math.log(x) / L;
    const use = pts.filter((p) => p.x > 0 && p.x <= 80 && Math.abs(p.y) <= 12);
    let xmax = 6, ymax = 3;
    use.forEach((p) => { xmax = Math.max(xmax, 1.3 * p.x); ymax = Math.max(ymax, Math.abs(p.y) + 1); });
    ymax = Math.min(Math.ceil(ymax), 13);
    const o = {
      w: 340, h: 240,
      x: [-0.12 * xmax, xmax], y: [-ymax, ymax],
      curves: [{ f: fv, cls: 'c1', domain: [xmax * 0.004, xmax] }],
      points: use,
      labels: [{ x: xmax * 0.52, y: -ymax * 0.82, text: 'y = log_a x', cls: 'c1' }]
    };
    if (extra) Object.keys(extra).forEach((k) => { o[k] = extra[k]; });
    return JK.plot.graph(o);
  }

  /* a^e の「素因数分解 → 指数法則」の式変形。head は左辺の TeX。
     戻り値 { pv, m3, m4 }（m3: 素因数分解と指数のかけ算 / m4: 根号が残るときの整理（なければ空）） */
  function powSteps(aq, e, head) {
    const pv = powExact(aq, e);
    const parts = pv.parts;
    const eT = e.tex();
    const facOf = (o) => (o.e === 1 ? String(o.p) : o.p + '^{' + o.e + '}');
    const fac = parts.map(facOf).join(R` \times `);
    const triv = parts.length === 1 && parts[0].e === 1;
    const m3 = [];
    if (!triv) {
      m3.push(aq.tex() + ' = ' + fac);
      const wrapped = R`\left(` + fac + R`\right)`;
      const rows = [];
      rows.push(head + R` &= ` + wrapped + '^{' + eT + '}');
      rows.push(R`&= ` + parts.map((o) => o.p + '^{' + o.e + R` \times ` + U.paren(e) + '}').join(R` \times `));
      rows.push(R`&= ` + parts.map((o) => o.p + '^{' + o.E.tex() + '}').join(R` \times `));
      if (pv.idx === 1) {
        const vals = parts.map((o) => Q(o.p).pow(o.E.n));
        rows.push(R`&= ` + vals.map((x) => x.tex()).join(R` \times `));
        if (parts.length > 1) rows.push(R`&= ` + pv.out.tex());
      }
      m3.push(al(rows));
    } else if (pv.idx === 1) {
      m3.push(head + ' = ' + pv.out.tex());
    }
    const m4 = [];
    if (pv.idx > 1) {
      parts.forEach((o) => {
        if (o.k !== 0 && o.rm) {
          m4.push(sup(String(o.p), o.E.tex()) + ' = ' + (o.k === 1 ? String(o.p) : sup(String(o.p), o.k)) + R` \times ` + sup(String(o.p), Q(o.rm, pv.D).tex()));
        }
      });
      const intTex = parts.filter((o) => o.k !== 0).map((o) => (o.k === 1 ? String(o.p) : sup(String(o.p), o.k))).join(R` \times `);
      const radBody = parts.filter((o) => o.rm).map((o) => (o.rm === 1 ? String(o.p) : sup(String(o.p), o.rm))).join(R` \times `);
      const radFull = pv.D === 2 ? R`\sqrt{` + radBody + '}' : R`\sqrt[` + pv.D + ']{' + radBody + '}';
      const grp = (intTex ? intTex + R` \times ` : '') + radFull;
      const fin = radTex(pv);
      const rows2 = [head + R` &= ` + grp];
      if (fin !== grp) rows2.push(R`&= ` + fin);
      m4.push(al(rows2));
    }
    return { pv: pv, m3: m3, m4: m4 };
  }

  /* ======================= 1. 指数の計算 ======================= */

  JK.registerCalc({
    id: 'iib-exp-calc',
    course: 'IIB',
    unit: 'm-explog',
    group: '指数・対数',
    title: '指数の計算（分数・負の指数）',
    desc: R`$a^{\frac{p}{q}}$ や $a^{-n}$ を、累乗根・逆数に直して簡単にします。指数法則の確認と、$y=a^{x}$ のグラフつき。`,
    form: [R`a^{\frac{p}{q}} = \sqrt[q]{a^{p}} \quad (a>0)`, R`a^{-n} = \frac{1}{a^{n}} \qquad a^{0} = 1`],
    inputs: [
      { key: 'a', label: R`底 $a$（正の整数）`, type: 'int', def: '8', min: 1, max: 100000 },
      { key: 'r', label: R`指数 $r$（整数・分数・小数）`, type: 'q', def: '2/3', min: -12, max: 12, hint: R`例: $\frac{2}{3}$ は 2/3、$-\frac{1}{3}$ は -1/3 と入力します。` }
    ],
    examples: [
      { label: '8 の 2/3 乗', v: { a: '8', r: '2/3' } },
      { label: '27 の -1/3 乗', v: { a: '27', r: '-1/3' } },
      { label: '16 の 3/4 乗', v: { a: '16', r: '3/4' } },
      { label: '72 の 1/2 乗（根号が残る）', v: { a: '72', r: '1/2' } },
      { label: '2 の -3/2 乗', v: { a: '2', r: '-3/2' } }
    ],
    intro: {
      easy: R`$2^{3}$ は「2 を 3 回かける」$=8$ でした。では指数が分数や負のとき、たとえば $8^{\frac{2}{3}}$ や $27^{-\frac{1}{3}}$ は何を表すのでしょう。
ここでは**「指数の足し算がかけ算に対応する」**という性質（$a^{m}\times a^{n}=a^{m+n}$）がずっと成り立つように意味を決めます。
・$a^{\frac{1}{3}}$ を 3 回かけると $a^{\frac{1}{3}+\frac{1}{3}+\frac{1}{3}}=a^{1}=a$ なので、$a^{\frac{1}{3}}$ は「3 回かけて $a$ になる数」＝**3 乗根** $\sqrt[3]{a}$ です。
・$a^{-1}$ は $a$ とかけて $a^{0}=1$ になる数なので、**逆数** $\frac{1}{a}$ です。
この計算機は、底を素因数分解して「指数のかけ算」で整理する流れを順に見せます。`,
      normal: R`$a^{\frac{p}{q}}=\sqrt[q]{a^{p}}$、$a^{-n}=\frac{1}{a^{n}}$、$a^{0}=1$。底を素因数分解して $(a^{m})^{n}=a^{mn}$ を使うと整理しやすくなります。`,
      pro: R`$8^{\frac{2}{3}}=(2^{3})^{\frac{2}{3}}=2^{2}$ のように「底を素因数分解 → 指数をかけ算」と暗算で処理するのが定石です。$t=a^{x}$ と置換する指数方程式や、$a^{x}+a^{-x}$ の式変形の土台になります。`
    },
    compute(v) {
      const a = v.a, r = v.r;
      const rT = r.tex();
      const neg = r.sign() < 0;
      const s = r.abs();
      const sT = s.tex();
      const aq = Q(a);
      const aS = String(a);
      const head = sup(aS, rT);
      if (s.val() * Math.log10(Math.max(a, 1)) > 12) throw new CalcError('値が大きすぎて（または小さすぎて）このツールでは扱えません。底 a か指数 r を小さくしてください');
      const gr = (label) => expGraph(a, r.val(), label);

      const meaning = {
        t: '指数が分数・負・0 のときの意味',
        m: [R`a^{\frac{p}{q}} = \sqrt[q]{a^{p}} \quad (a>0,\ q \ge 2)`, R`a^{-n} = \frac{1}{a^{n}}`, R`a^{0} = 1`],
        n: R`指数法則 $a^{m}a^{n}=a^{m+n}$、$(a^{m})^{n}=a^{mn}$ が、分数・負・0 の指数でも成り立つように決めた約束です。`,
        easy: R`$a^{\frac{1}{2}}$ を 2 回かけると $a^{\frac{1}{2}+\frac{1}{2}}=a$ になります。つまり $a^{\frac{1}{2}}$ は「2 回かけて $a$ になる数」＝ $\sqrt{a}$。同じように $a^{\frac{1}{3}}$ は「3 回かけて $a$ になる数」（3 乗根）です。分子は「そのあと何乗するか」で、$a^{\frac{2}{3}}=\left(a^{\frac{1}{3}}\right)^{2}$ と読みます。
また $a^{-1}$ は $a$ とかけて $a^{0}=1$ になる数、つまり**逆数** $\frac{1}{a}$ です。`,
        pro: R`指数が分数の式は、まず底を素因数分解して指数をかけ算するのが最短です。`
      };

      // ---- 底が 1 ----
      if (a === 1) {
        return {
          result: [{ label: '値', tex: head + ' = 1' }],
          steps: [
            meaning,
            {
              t: '1 は何乗しても 1',
              m: R`1^{x} = 1 \quad (x \text{ が何であっても})`,
              n: R`底が $1$ のとき、$1$ を何回かけても（何乗根をとっても、逆数をとっても）$1$ のままです。`,
              easy: R`1 に 1 をかけても 1 のままなので、$1^{2}=1$、$1^{\frac{1}{3}}=1$、$1^{-5}=1$ とどんな指数でも答えは 1 です。グラフにすると $y=1$ の水平な直線になります。`
            },
            {
              t: '結論',
              m: head + ' = 1',
              n: R`底が $1$ の $y=1^{x}$ は定数関数です。指数関数として扱うのは、底が $1$ でない正の数のときです。`,
              easy: R`指数関数 $y=a^{x}$ が「増える」「減る」グラフになるのは、$a$ が 1 より大きい（または 1 より小さい）ときだけです。`
            }
          ],
          fig: gr('1')
        };
      }
      // ---- 指数が 0 ----
      if (r.isZero()) {
        return {
          result: [{ label: '値', tex: aS + R`^{0} = 1` }],
          steps: [
            meaning,
            {
              t: '指数が 0 のとき',
              m: [R`a^{n} \div a^{n} = a^{n-n} = a^{0}`, R`a^{n} \div a^{n} = 1 \;\Rightarrow\; a^{0} = 1`],
              n: R`指数法則 $a^{m}\div a^{n}=a^{m-n}$ で $m=n$ とすると、左辺は $1$、右辺は $a^{0}$ です。`,
              easy: R`同じ数でわると 1 になります（$8\div 8=1$）。一方、指数法則では「わり算は指数の引き算」なので、$a^{3}\div a^{3}=a^{3-3}=a^{0}$。この 2 つを合わせて $a^{0}=1$ と決めます。`
            },
            {
              t: '結論',
              m: aS + R`^{0} = 1`,
              n: R`底が $` + aS + R`$ のときも、指数が $0$ なら値は $1$ です。グラフでは、どの指数関数も点 $(0,\ 1)$ を通ります。`,
              easy: R`$y=a^{x}$ のグラフは、$a$ がいくつでも必ず点 $(0,\ 1)$ を通ります（$x=0$ のとき $y=a^{0}=1$ だからです）。`,
              pro: R`$a^{0}=1$ は $a\ne 0$ のときに限る点に注意（$0^{0}$ は定義しません）。`
            }
          ],
          fig: gr('(0, 1)')
        };
      }

      // ---- 一般の場合 ----
      const w = powSteps(aq, s, sup(aS, sT));
      const pv = w.pv;
      const val = neg ? recip(pv) : pv;
      const exact = val.idx === 1;
      const approx = approxOf(val);
      const valT = radTex(val);
      const posT = radTex(pv);
      const steps = [meaning];

      // 2: 逆数・累乗根への書き直し
      if (neg || s.d > 1) {
        const rows = [];
        if (neg) rows.push(head + R` = \frac{1}{` + sup(aS, sT) + '}');
        if (s.d > 1) rows.push(sup(aS, sT) + ' = ' + rootTex(aS, s.n, s.d));
        steps.push({
          t: neg && s.d > 1 ? '指数を「逆数」「累乗根」で書き直す' : (neg ? '負の指数を逆数に直す' : '分数の指数を累乗根に直す'),
          m: rows,
          n: R`負の指数は逆数に、分数の指数は「分母 ＝ 何乗根か、分子 ＝ 何乗か」と読みます。` + (neg ? R`指数の符号をいったん取って $a^{` + sT + R`}$ を求め、最後に逆数をとります。` : ''),
          easy: (s.d > 1 ? R`指数 $` + sT + R`$ の分母 $` + s.d + R`$ は「$` + s.d + R` 乗根」、分子 $` + s.n + R`$ は「$` + s.n + R` 乗する」という意味です。` : '') +
            (neg ? R`マイナスは「逆数にする」の合図です（$a^{-1}=\frac{1}{a}$）。符号を外した指数で値を求めてから、最後にひっくり返します。` : ''),
          pro: R`負の指数は最後に逆数、分数の指数は素因数分解してから処理、の順に進めるとミスがありません。`
        });
      }

      // 3: 素因数分解して指数法則
      if (w.m3.length) {
        steps.push({
          t: R`底を素因数分解して、指数法則 $(a^{m})^{n}=a^{mn}$ を使う`,
          m: w.m3,
          n: R`底を素数の累乗に分解すると、指数どうしの**かけ算**で処理できます。` + (pv.parts.length > 1 ? R`積の累乗は $(xy)^{n}=x^{n}y^{n}$ と各因数に配ります。` : ''),
          easy: R`たとえば $8=2^{3}$ と分けると、$8^{\frac{2}{3}}=(2^{3})^{\frac{2}{3}}$ の「指数の指数」は**かけ算**になり、$2^{3\times\frac{2}{3}}=2^{2}$ となります。「$a^{m}$ をさらに $n$ 乗すると指数は $m\times n$」というルールです（$(2^{3})^{2}=2^{6}$ と同じ向きの話）。`,
          pro: R`素因数分解は「割り切れる小さい素数から順に」。慣れたら $` + aS + R`$ を累乗の形で見抜いて暗算します。`
        });
      }

      // 3b: 根号が残る場合の整理
      if (pv.idx > 1) {
        const hasInt = pv.parts.some((o) => o.k !== 0);
        steps.push({
          t: hasInt ? '整数乗の部分を外に出し、残りを根号に直す' : '分数乗の部分を根号に直す',
          m: w.m4,
          n: (hasInt ? R`指数が 1 以上の分数なら「整数 ＋ 真分数」に分け、整数乗の部分は根号の外へ出します。` : '') + R`残った分数乗の部分は $p^{\frac{1}{q}}=\sqrt[q]{p}$ で根号に戻します。` + (pv.D !== pv.idx ? R`根号の指数と中身が約分できるときは約分します（$\sqrt[4]{x^{2}}=\sqrt{x}$ など）。` : ''),
          easy: R`たとえば $2^{\frac{3}{2}}$ は「$2$ を 1.5 回かける」ので、$2^{1}\times 2^{\frac{1}{2}}=2\sqrt{2}$ と、ふつうにかけた分（$2$）と半端な分（$\sqrt{2}$）に分けられます。半端な分が根号として残ります。`,
          pro: R`根号の中身に平方数・立方数などの因数が残らないところまで簡単にします。`
        });
      }

      // 4: 逆数
      if (neg) {
        const rows = [sup(aS, '-' + sT) + R` = \frac{1}{` + sup(aS, sT) + R`} = \frac{1}{` + posT + '}'];
        if (pv.idx > 1) {
          const num = pv.idx === 2 ? R`\sqrt{` + pv.rad + '}' : R`\sqrt[` + pv.idx + ']{' + pv.rad + '^{' + (pv.idx - 1) + '}}';
          rows.push(R`\frac{1}{` + posT + R`} = \frac{` + num + '}{' + posT + R` \times ` + num + R`} = \frac{` + num + '}{' + (pv.out.n * pv.rad) + '}');
          if (valT !== R`\frac{` + num + '}{' + (pv.out.n * pv.rad) + '}') rows.push('= ' + valT);
        }
        steps.push({
          t: '逆数をとる',
          m: rows,
          n: R`$a^{-s}=\frac{1}{a^{s}}$ を使います。` + (pv.idx > 1 ? R`分母に根号が残るので、分母と分子に同じ根号をかけて**有理化**し、分母を整数にします。` : ''),
          easy: R`負の指数は「逆数」でした。$` + posT + R`$ をひっくり返して $\frac{1}{` + posT + R`}$ とします。` + (pv.idx > 1 ? R`分母に $\sqrt{\ \ }$ が残るときは、分母・分子に同じ根号をかけて分母から根号を消します（有理化）。` : ''),
          pro: R`逆数をとる前に $a^{s}$ を最後まで簡単にしておくと、有理化が 1 回で済みます。`
        });
      }

      // 5: 結論
      steps.push({
        t: '結論',
        m: [head + ' = ' + valT].concat(exact ? [] : [head + R` \approx ` + f4(approx)]),
        n: exact ? R`よって $` + head + R` = ` + valT + R`$ です。` : R`整数にならない値は根号のまま答えるのが正確です。電卓の近似値は約 $` + f4(approx) + R`$ です。`,
        easy: R`指数が分数・負でも、整理すれば「ふつうの数」または「根号つきの数」になります。` + (exact ? R`今回は根号が残らず、きれいな値 $` + valT + R`$ になりました。` : R`今回は根号が残りました。これ以上簡単にできない形が答えです。`),
        pro: R`答えは「分数・根号を簡約した形」で。近似値は検算用に使います。`
      });

      // 6: 検算（指数法則）
      {
        const q = s.d, pn = s.n;
        const m = [R`\left(` + sup(aS, sT) + R`\right)^{` + q + '} = ' + sup(aS, sT + R` \times ` + q) + ' = ' + sup(aS, pn)];
        const left = Math.pow(pv.out.val(), q) * Math.pow(pv.rad, q / pv.idx);
        const right = Math.pow(a, pn);
        const okSize = left < 1e15 && right < 1e15;
        if (okSize) m.push(R`\left(` + posT + R`\right)^{` + q + '} = ' + Math.round(left) + R` \quad,\quad ` + sup(aS, pn) + ' = ' + Math.round(right));
        steps.push({
          t: '指数法則で検算する',
          m: m,
          n: R`$a^{\frac{p}{q}}$ を $q$ 乗すると $a^{\frac{p}{q}\times q}=a^{p}$ に戻るはずです。` + (okSize ? R`実際に $` + posT + R`$ を $` + q + R`$ 乗して確かめました。` : ''),
          easy: R`「$` + q + R`$ 回かけると $` + sup(aS, pn) + R`$ になる数」が $` + sup(aS, sT) + R`$ の正体でした。それを実際に $` + q + R`$ 乗して、元の $` + sup(aS, pn) + R`$ に戻るかを確かめるのが検算です。`,
          lv: 2
        });
      }

      // 7: 分数の指数の意味（導入）
      if (s.d > 1) {
        steps.push({
          t: '分数の指数の意味を確かめる',
          m: [R`\left(a^{\frac{1}{q}}\right)^{q} = a^{\frac{1}{q}\times q} = a^{1} = a`, R`\therefore\ a^{\frac{1}{q}} = \sqrt[q]{a}`],
          n: R`$a^{\frac{1}{q}}$ を $q$ 回かけると $a$ に戻るので、「$q$ 乗して $a$ になる正の数」＝ $q$ 乗根と決めます。`,
          easy: R`たとえば $2^{3}=8$ なので、$8^{\frac{1}{3}}$（8 の 3 乗根）は 2 です。逆に「$8^{\frac{1}{3}}$ を 3 回かける」と $8^{\frac{1}{3}\times 3}=8^{1}=8$ に戻ります。分数の指数は、この「元に戻る」性質から決まります。`,
          lv: 3
        });
      }

      const res = [{ label: '値', tex: head + ' = ' + valT }];
      if (s.d > 1) res.push({ label: '累乗根の形', tex: neg ? R`\frac{1}{` + rootTex(aS, s.n, s.d) + '}' : rootTex(aS, s.n, s.d) });
      if (!exact) res.push({ label: '近似値', tex: head + R` \approx ` + f4(approx) });
      return {
        result: res,
        steps: steps,
        fig: gr(a + '^(' + r.toString() + ') ' + (exact ? '= ' + val.out.toString() : '≈ ' + f4(approx)))
      };
    }
  });

  /* ======================= 2. 対数の値 ======================= */

  JK.registerCalc({
    id: 'iib-log-calc',
    course: 'IIB',
    unit: 'm-explog',
    group: '指数・対数',
    title: '対数の値',
    desc: R`$\log_{a}b$（$a$ を何乗すると $b$ になるか）の値を求めます。ぴったりの値は厳密に、そうでなければ底の変換公式で近似します。$y=\log_{a}x$ のグラフつき。`,
    form: [R`\log_{a} b = x \;\Leftrightarrow\; a^{x} = b \quad (a>0,\ a \ne 1,\ b>0)`, R`\log_{a} b = \frac{\log_{c} b}{\log_{c} a}`],
    inputs: [
      { key: 'a', label: R`底 $a$（正の数・1 以外）`, type: 'q', def: '4', hint: R`整数・分数（1/2）・小数（0.5）で入力できます。` },
      { key: 'b', label: R`真数 $b$（正の数）`, type: 'q', def: '8' }
    ],
    examples: [
      { label: 'log₂ 8', v: { a: '2', b: '8' } },
      { label: 'log₄ 8（分数になる）', v: { a: '4', b: '8' } },
      { label: 'log₃ (1/9)（負になる）', v: { a: '3', b: '1/9' } },
      { label: 'log_{1/2} 8（底が 1 より小さい）', v: { a: '1/2', b: '8' } },
      { label: 'log₃ 5（近似値）', v: { a: '3', b: '5' } }
    ],
    intro: {
      easy: R`「2 を何乗したら 8 になる？」と聞かれたら、答えは 3 ですね。この「何乗か」を表す記号が**対数**で、$\log_{2}8=3$ と書きます（$\log$ は「ログ」と読みます）。かけ算をくり返す数 2 を**底**、8 を**真数**といいます。
つまり $\log_{a}b$ は「$a$ を何乗したら $b$ になるか」を表す数で、$a^{x}=b$ を満たす $x$ のことです。ぴったりの整数や分数にならないときは、電卓や $\log_{10}2=0.3010$ のような表の値を使って近似します。`,
      normal: R`$\log_{a}b=x \Leftrightarrow a^{x}=b$（$a>0,\ a\ne1,\ b>0$）。$a,\ b$ を同じ数の累乗で表せれば $\log_{c^{m}}c^{n}=\frac{n}{m}$ と求まります。そうでなければ底の変換公式で近似します。`,
      pro: R`底の変換公式 $\log_{a}b=\frac{\log_{c}b}{\log_{c}a}$ が定石。値の見積もりは「$a^{k}<b<a^{k+1}$ なら $k<\log_{a}b<k+1$」で整数部分を押さえます。`
    },
    compute(v) {
      const a = v.a, b = v.b;
      checkBase(a);
      mustPositive(b, '真数 b');
      checkSize(b, '真数 b');
      const aT = a.tex(), bT = b.tex();
      const head = logHead(aT, bT);
      const info = logInfo(a, b);
      const cb = info.cb;
      const la = Math.log10(a.val()), lb = Math.log10(b.val());
      const xv = info.v;
      const bv = b.val(), av = a.val();
      const pts = [{ x: bv, y: xv, cls: 'c3', label: '(' + b.toString() + ', ' + (info.exact ? info.x.toString() : '≈' + f4(xv)) + ')', pos: 'br' }, { x: 1, y: 0, cls: 'c4' }];
      if (!a.eq(b) && av <= 60) pts.push({ x: av, y: 1, cls: 'c4', label: '(' + a.toString() + ', 1)', pos: 'tr' });
      const fig = logGraph(av, pts);

      const defStep = {
        t: '対数の定義',
        m: R`\log_{a} b = x \;\Leftrightarrow\; a^{x} = b`,
        n: R`$\log_{a}b$ は「$a$ を何乗したら $b$ になるか」を表す数です。底 $a$ は正で 1 でない数、真数 $b$ は正の数です。`,
        easy: R`「$2$ を何乗すると $8$ か」→ $2^{3}=8$ なので $\log_{2}8=3$。対数は指数を**逆向きに読んだもの**です。$\log$ の右下の小さい数が「かける数（底）」、その右が「できあがる数（真数）」です。`,
        pro: R`対数の値は「底を何乗したら真数か」と常に言い換えるのがコツです。`
      };
      const readStep = {
        t: '「何乗すれば b になるか」に読み替える',
        m: [head + ' = x', R`\text{定義より}\quad ` + powB(a, 'x') + ' = ' + bT],
        n: R`求める値を $x$ とおき、定義より $` + powB(a, 'x') + ' = ' + bT + R`$ という指数の式にします。`,
        easy: R`$` + powB(a, 'x') + ' = ' + bT + R`$ を成り立たせる $x$ を探します。小さい整数や分数で試して、ちょうどになる数を見つけるのがコツです。`
      };

      if (b.eq(1)) {
        return {
          result: [{ label: '値', tex: head + ' = 0' }, { label: 'ポイント', tex: R`\log_{a} 1 = 0 \quad (a>0,\ a \ne 1)` }],
          steps: [
            defStep,
            readStep,
            {
              t: R`$1$ は $a$ の $0$ 乗`,
              m: powB(a, 0) + ' = 1',
              n: R`どんな数も $0$ 乗すると $1$ になります（$a^{0}=1$）。真数が $1$ のとき、答えは底によらず $0$ です。`,
              easy: R`$` + powB(a, 0) + R`=1$ です。「$a$ を 0 回かける」と、かけるものが何もないので $1$ が残る、と考えると覚えやすくなります。`
            },
            {
              t: '指数を比べて x を求める',
              m: [powB(a, 'x') + ' = 1 = ' + powB(a, 0), 'x = 0'],
              n: R`底が同じ（$` + aT + R`$）なので、指数どうしを比べて $x=0$ です。`,
              easy: R`$` + powB(a, 'x') + R`=1$ を満たす $x$ は、$0$ 乗のときだけです。だから $\log_{` + aT + R`}1=0$ です。`,
              pro: R`$\log_{a}1=0$、$\log_{a}a=1$ は暗算で使う基本値です。`
            },
            {
              t: '検算',
              m: powB(a, 0) + ' = 1',
              n: R`$a^{0}=1$ なので、$x=0$ は定義 $a^{x}=b$ を満たしています。`,
              easy: R`答えの $0$ を右上にのせると $` + powB(a, 0) + R`=1$ となり、真数に戻ります。`,
              lv: 2
            }
          ],
          fig: fig
        };
      }
      if (cb) {
        const x = info.x;
        const cT = cb.c.tex();
        const pa = powB(cb.c, cb.m), pb = powB(cb.c, cb.n);
        const exprs = [powB(a, x.tex())];
        if (cb.m !== 1) exprs.push(R`\left(` + pa + R`\right)^{` + x.tex() + '}', powB(cb.c, cb.m + R`\times ` + U.paren(x)));
        exprs.push(pb, bT);
        const dedup = exprs.filter((e, i) => i === 0 || e !== exprs[i - 1]);
        const checkRows = dedup.map((e, i) => (i === 0 ? e + R` &= ` + dedup[1] : (i === 1 ? null : R`&= ` + e))).filter((e) => e !== null);
        const coefX = cb.m === 1 ? 'x' : (cb.m === -1 ? '-x' : cb.m + 'x');
        const steps = [
          defStep,
          readStep,
          {
            t: 'a と b を同じ数の累乗にそろえる',
            m: [chain(aT, facQ(a), pa), chain(bT, facQ(b), pb)],
            n: R`$a=` + pa + R`$、$b=` + pb + R`$ と、同じ数 $` + cT + R`$ の累乗で表せました。底がそろうと指数だけを比べればよくなります。`,
            easy: R`素因数分解は「割り切れる素数で割っていく」操作です。$` + aT + R`$ と $` + bT + R`$ が同じ数のべき乗で書けるかを調べます。同じ数 $` + cT + R`$ が見つかれば、あとは指数だけの問題になります。`,
            pro: R`底と真数が同じ素数の累乗なら、$\log_{p^{m}}p^{n}=\frac{n}{m}$ と一発です。`
          },
          {
            t: '指数を比べて x を求める',
            m: (cb.m === 1
              ? [sup(cT, 'x') + ' = ' + pb, 'x = ' + cb.n]
              : [R`\left(` + pa + R`\right)^{x} = ` + pb, sup(cb.c.d === 1 ? cT : R`\left(` + cT + R`\right)`, coefX) + ' = ' + pb, coefX + ' = ' + cb.n, 'x = ' + x.tex()]),
            n: R`$(c^{m})^{x}=c^{mx}$ と指数をかけ算にし、「底が同じなら指数も等しい」を使います。`,
            easy: R`「$` + cT + R`$ を $` + coefX + R`$ 回かけたものが、$` + cT + R`$ を $` + cb.n + R`$ 回かけたものと等しい」なら、かける回数も等しいはずです。だから $` + coefX + '=' + cb.n + R`$ となります。`,
            pro: R`$a^{p}=a^{q}\Rightarrow p=q$（$a>0,\ a\ne1$）は指数方程式の基本です。`
          },
          {
            t: '検算',
            m: al(checkRows),
            n: R`$a^{x}$ に求めた $x$ を代入して、真数 $b$ に戻ることを確かめます。`,
            easy: R`答えの $x$ を底の右上にのせて計算し直すと、真数にちょうど戻ります。戻れば正解です。`,
            lv: 2
          },
          {
            t: '底の変換との関係',
            m: R`\log_{c^{m}} c^{n} = \frac{\log_{c} c^{n}}{\log_{c} c^{m}} = \frac{n}{m}`,
            n: R`同じ結果が、底の変換公式（底を $c$ にそろえる）からも出ます。$\log_{c}c^{n}=n$（「$c$ を何乗すると $c^{n}$ か」の答えは $n$）を使いました。`,
            easy: R`$\log_{c}c^{n}$ は「$c$ を何乗したら $c^{n}$ になるか」なので、答えはそのまま $n$ です。分母の $\log_{c}c^{m}=m$ も同じ理由で、結局 $\frac{n}{m}$ になります。`,
            lv: 3
          }
        ];
        const res = [
          { label: '値', tex: head + ' = ' + x.tex() },
          { label: '底・真数の関係', tex: 'a = ' + pa + R`,\quad b = ` + pb }
        ];
        if (!x.isInt()) res.push({ label: '小数', tex: 'x = ' + f4(x.val()) });
        return { result: res, steps: steps, fig: fig };
      }

      // ---- ぴったりの値にならない場合 ----
      const steps = [
        defStep,
        readStep,
        {
          t: '同じ数の累乗にそろえられるか調べる',
          m: [primeLine(a), primeLine(b)],
          n: R`素因数分解しても、$a$ と $b$ を同じ数の累乗で表すことができません。このとき $\log_{a}b$ は整数や分数にならない数（無理数）なので、近似値で表します。`,
          easy: R`$2^{x}=8$ のように、$x$ がきれいに見つかるのは「同じ数の累乗どうし」のときだけです。そうでないときは、$x$ は小数（ずっと続く数）になります。`
        },
        {
          t: '底の変換公式で近似値を求める',
          m: [R`\log_{a} b = \frac{\log_{c} b}{\log_{c} a}`,
            head + R` = \frac{\log_{10} ` + bT + R`}{\log_{10} ` + aT + '}',
            R`\log_{10} ` + bT + R` \approx ` + f5(lb) + R`,\quad \log_{10} ` + aT + R` \approx ` + f5(la),
            head + R` \approx \frac{` + f5(lb) + '}{' + f5(la) + R`} \approx ` + f4(xv)],
          n: R`底を $10$（常用対数）にそろえて計算します。電卓の $\log$ キー、または $\log_{10}2=0.3010$ などの表の値を使います。`,
          easy: R`「$` + aT + R`$ を何乗すると $` + bT + R`$ か」は、そのままでは電卓で出せません。そこで「どちらも 10 を何乗したものか」に直して比を取ります（$\log_{10}$ は電卓の log キーです）。10 を何乗か分かれば、その比が答えです。`,
          pro: R`入試では $\log_{10}2,\ \log_{10}3$ などが与えられるので、真数を $2,\ 3,\ 5$ の積に分解して近似します。`
        }
      ];
      // 範囲の見当（検算）
      try {
        const k = Math.floor(xv);
        if (Math.abs(k) <= 10) {
          const ak = a.pow(k), ak1 = a.pow(k + 1);
          const lo = av > 1 ? ak : ak1, hi = av > 1 ? ak1 : ak;
          steps.push({
            t: '値の見当をつける（検算）',
            m: [av > 1 ? powB(a, k) + ' < ' + bT + ' < ' + powB(a, k + 1) : powB(a, k + 1) + ' < ' + bT + ' < ' + powB(a, k), k + ' < ' + head + ' < ' + (k + 1)],
            n: R`$` + lo.tex() + R` < ` + bT + R` < ` + hi.tex() + R`$ なので、$\log_{a}b$ の整数部分は $` + k + R`$ です。近似値 $` + f4(xv) + R`$ はこの範囲に入っています。`,
            easy: R`「$` + aT + R`$ を ` + k + R` 回かけると $` + ak.tex() + R`$、` + (k + 1) + R` 回かけると $` + ak1.tex() + R`$」。真数 $` + bT + R`$ はその間にあるので、答えは ` + k + R` と ` + (k + 1) + R` の間の小数だと分かります。`,
            lv: 2
          });
        }
      } catch (e) { if (!(e instanceof CalcError)) throw e; }
      steps.push({
        t: '底の変換公式が成り立つ理由',
        m: [R`\log_{a} b = x \;\Rightarrow\; a^{x} = b`, R`\log_{c} a^{x} = \log_{c} b \;\Rightarrow\; x\log_{c} a = \log_{c} b`, R`x = \frac{\log_{c} b}{\log_{c} a}`],
        n: R`$a^{x}=b$ の両辺の（底 $c$ の）対数をとり、$\log_{c}a^{x}=x\log_{c}a$ を使って $x$ について解きます。`,
        easy: R`「$a$ を $x$ 回かけると $b$」の両辺を、10 を何乗したものかに直します。たとえば $a=10^{0.477}$ と書けるなら $a^{x}=10^{0.477x}$。両辺の「10 の何乗か」を比べれば $0.477x=\ldots$ と $x$ が出ます。`,
        lv: 3
      });
      return {
        result: [
          { label: '値（近似）', tex: head + R` \approx ` + f4(xv) },
          { label: '整数部分の範囲', tex: Math.floor(xv) + ' < ' + head + ' < ' + (Math.floor(xv) + 1) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ======================= 3. 対数の性質による計算 ======================= */

  JK.registerCalc({
    id: 'iib-log-rules',
    course: 'IIB',
    unit: 'm-explog',
    group: '指数・対数',
    title: '対数の性質による計算',
    desc: R`$\log_{a}M+\log_{a}N$、$\log_{a}M-\log_{a}N$、$k\log_{a}M$ を、対数の性質で 1 つの対数にまとめ、値を求めます。`,
    form: [R`\log_{a} MN = \log_{a} M + \log_{a} N`, R`\log_{a} \frac{M}{N} = \log_{a} M - \log_{a} N`, R`\log_{a} M^{k} = k\log_{a} M`],
    inputs: [
      {
        key: 'mode', label: '計算の種類', type: 'select', def: 'sum',
        options: [
          ['sum', 'log M + log N（和 → 真数の積）'],
          ['diff', 'log M - log N（差 → 真数の商）'],
          ['coef', 'k log M（係数 → 真数の累乗）'],
          ['mix', 'k log M + l log N（まとめて 1 つに）']
        ]
      },
      { key: 'a', label: R`底 $a$`, type: 'q', def: '6', hint: R`正の数で、1 以外にします。` },
      { key: 'M', label: R`真数 $M$`, type: 'q', def: '4' },
      { key: 'N', label: R`真数 $N$`, type: 'q', def: '9', show: (r) => r.mode !== 'coef' },
      { key: 'k', label: R`係数 $k$（整数）`, type: 'int', def: '2', min: -6, max: 6, show: (r) => r.mode === 'coef' || r.mode === 'mix' },
      { key: 'l', label: R`係数 $l$（整数）`, type: 'int', def: '-1', min: -6, max: 6, show: (r) => r.mode === 'mix' }
    ],
    examples: [
      { label: 'log₆4 + log₆9', v: { mode: 'sum', a: '6', M: '4', N: '9' } },
      { label: 'log₂24 − log₂3', v: { mode: 'diff', a: '2', M: '24', N: '3' } },
      { label: '2 log₄8', v: { mode: 'coef', a: '4', M: '8', k: '2' } },
      { label: '2 log₃6 − log₃4', v: { mode: 'mix', a: '3', M: '6', N: '4', k: '2', l: '-1' } },
      { label: 'log₂3 + log₂5（近似値）', v: { mode: 'sum', a: '2', M: '3', N: '5' } }
    ],
    intro: {
      easy: R`対数は「指数のこと」でした。指数には「かけ算は指数の足し算」（$2^{3}\times 2^{2}=2^{5}$）という法則があります。これを対数の言葉に直したものが**対数の性質**です。
たとえば $\log_{2}8=3$、$\log_{2}4=2$、$\log_{2}32=5$ で、$8\times 4=32$ なので $\log_{2}8+\log_{2}4=\log_{2}(8\times 4)$。つまり「**真数のかけ算 ＝ 対数の足し算**」です。わり算は引き算、$k$ 乗は $k$ 倍に対応します。
この計算機は、足し算・引き算・係数つきの対数を 1 つの対数にまとめて、値を求めます。`,
      normal: R`$\log_{a}M+\log_{a}N=\log_{a}MN$、$\log_{a}M-\log_{a}N=\log_{a}\frac{M}{N}$、$k\log_{a}M=\log_{a}M^{k}$。ただし $M>0,\ N>0$（真数条件）。まとめた真数が $a$ の累乗なら値が決まります。`,
      pro: R`入試では「まとめて真数を計算 → $a$ の累乗に直す」が基本です。真数を $2,\ 3,\ 5$ などの素因数に分解してから性質を使うと、$\log_{10}2=0.3010$ などの値と結びつきます。`
    },
    compute(v) {
      const mode = v.mode, a = v.a, M = v.M;
      checkBase(a);
      mustPositive(M, '真数 M');
      checkSize(M, '真数 M');
      let N = null, k = 0, l = 0;
      if (mode !== 'coef') { N = v.N; mustPositive(N, '真数 N'); checkSize(N, '真数 N'); }
      if (mode === 'coef' || mode === 'mix') k = v.k;
      if (mode === 'mix') l = v.l;
      let arg;
      if (mode === 'sum') arg = M.mul(N);
      else if (mode === 'diff') arg = M.div(N);
      else if (mode === 'coef') arg = M.pow(k);
      else arg = M.pow(k).mul(N.pow(l));
      if (arg.n > 1e12 || arg.d > 1e12) throw new CalcError('まとめた真数が大きくなりすぎます。M, N, k, l を小さくしてください');
      const aT = a.tex(), MT = M.tex(), NT = N ? N.tex() : '', argT = arg.tex();
      const info = logInfo(a, arg);
      const lg = (xT) => logHead(aT, xT);
      const kT = ck(k);
      let lhs, mid, calcT, rule;
      if (mode === 'sum') {
        lhs = lg(MT) + ' + ' + lg(NT);
        mid = lg(R`\left(` + MT + R` \times ` + NT + R`\right)`);
        calcT = R`M \times N = ` + MT + R` \times ` + NT + ' = ' + argT;
        rule = R`\log_{a} M + \log_{a} N = \log_{a} MN`;
      } else if (mode === 'diff') {
        lhs = lg(MT) + ' - ' + lg(NT);
        mid = lg(R`\left(` + MT + R` \div ` + NT + R`\right)`);
        calcT = R`M \div N = ` + MT + R` \div ` + NT + ' = ' + argT;
        rule = R`\log_{a} M - \log_{a} N = \log_{a} \frac{M}{N}`;
      } else if (mode === 'coef') {
        lhs = kT + lg(MT);
        mid = lg(powB(M, k));
        calcT = R`M^{k} = ` + powB(M, k) + ' = ' + argT;
        rule = R`k\log_{a} M = \log_{a} M^{k}`;
      } else {
        lhs = kT + lg(MT) + (l < 0 ? ' - ' + ck(-l) : ' + ' + ck(l)) + lg(NT);
        mid = lg(R`\left(` + powB(M, k) + R` \times ` + powB(N, l) + R`\right)`);
        calcT = R`M^{k} \times N^{l} = ` + powB(M, k) + R` \times ` + powB(N, l) + ' = ' + argT;
        rule = R`k\log_{a} M + l\log_{a} N = \log_{a} M^{k}N^{l}`;
      }
      const la = Math.log10(a.val()), lb = Math.log10(arg.val());

      // 値を求める式
      let valM;
      if (info.exact) {
        const cb = info.cb, pa = powB(cb.c, cb.m), pb = powB(cb.c, cb.n);
        const nm = cb.m === 1 ? String(cb.n) : R`\frac{` + (cb.m < 0 ? -cb.n : cb.n) + '}{' + Math.abs(cb.m) + '}';
        valM = [chain(aT, facQ(a), pa), chain(argT, facQ(arg), pb),
          lg(argT) + R` = \log_{` + (cb.m === 1 ? cb.c.tex() : pa) + '} ' + pb + ' = ' + nm + (nm === info.x.tex() ? '' : ' = ' + info.x.tex())];
      } else {
        valM = [lg(argT) + R` = \frac{\log_{10} ` + argT + R`}{\log_{10} ` + aT + '}',
          lg(argT) + R` \approx \frac{` + f5(lb) + '}{' + f5(la) + R`} \approx ` + f4(info.v)];
      }

      // 個別に求めてから合成する別解
      const iM = logInfo(a, M), iN = N ? logInfo(a, N) : null;
      const comps = mode === 'sum' ? [[1, iM], [1, iN]] : (mode === 'diff' ? [[1, iM], [-1, iN]] : (mode === 'coef' ? [[k, iM]] : [[k, iM], [l, iN]]));
      const allExact = comps.every((cp) => cp[1].exact);
      let altM, altN;
      if (allExact) {
        const xs = comps.map((cp) => cp[1].x);
        const names = mode === 'coef' ? [MT] : [MT, NT];
        const head2 = comps.map((cp, i) => lg(names[i]) + ' = ' + xs[i].tex()).join(R`,\quad `);
        let sub;
        if (mode === 'sum') sub = xs[0].tex() + ' + ' + U.paren(xs[1]);
        else if (mode === 'diff') sub = xs[0].tex() + ' - ' + U.paren(xs[1]);
        else if (mode === 'coef') sub = U.paren(Q(k)) + R` \times ` + U.paren(xs[0]);
        else sub = U.paren(Q(k)) + R` \times ` + U.paren(xs[0]) + ' + ' + U.paren(Q(l)) + R` \times ` + U.paren(xs[1]);
        let tot = Q(0);
        comps.forEach((cp, i) => { tot = tot.add(xs[i].mul(cp[0])); });
        altM = [head2, lhs + ' = ' + sub + ' = ' + tot.tex()];
        altN = R`それぞれの対数が整数や分数になるので、先に値を求めてから計算しても、まとめてから求めた値 $` + info.x.tex() + R`$ と一致します。`;
      } else {
        const vs = comps.map((cp) => cp[1].v);
        const names = mode === 'coef' ? [MT] : [MT, NT];
        const head2 = comps.map((cp, i) => lg(names[i]) + R` \approx ` + f4(vs[i])).join(R`,\quad `);
        let tot = 0;
        comps.forEach((cp, i) => { tot += cp[0] * vs[i]; });
        altM = [head2, lhs + R` \approx ` + f4(tot) + R`\quad (\text{まとめた値 } ` + f4(info.v) + ')'];
        altN = R`それぞれは整数や分数にならないので近似値で確かめます。小数の丸めのせいで、末尾の桁が 1 ずれることがあります。`;
      }

      // グラフ（各真数での y 座標）
      const av = a.val();
      const gp = [{ x: M.val(), y: iM.v, cls: 'c4', label: 'M', pos: 'tl' }];
      if (N) gp.push({ x: N.val(), y: iN.v, cls: 'c4', label: 'N', pos: 'tl' });
      gp.push({ x: arg.val(), y: info.v, cls: 'c3', label: mode === 'sum' ? 'MN' : (mode === 'diff' ? 'M÷N' : (mode === 'coef' ? 'M^k' : 'M^k·N^l')), pos: 'br' });
      const fig = logGraph(av, gp);

      const steps = [
        {
          t: '対数の性質（3 つの公式）',
          m: [R`\log_{a} MN = \log_{a} M + \log_{a} N`, R`\log_{a} \frac{M}{N} = \log_{a} M - \log_{a} N`, R`\log_{a} M^{k} = k\log_{a} M`],
          n: R`$a>0,\ a\ne1,\ M>0,\ N>0$ のとき成り立ちます。今回は 「` + (mode === 'sum' ? '和' : (mode === 'diff' ? '差' : (mode === 'coef' ? '係数つき' : '係数つきの和・差'))) + R`」を 1 つの対数にまとめる向きで使います。`,
          easy: R`対数は指数のこと、指数には「かけ算 ↔ 足し算」の法則があるのでした。$\log_{2}8=3$、$\log_{2}4=2$ のとき、$\log_{2}(8\times 4)=\log_{2}32=5=3+2$。真数どうしを**かけると**対数は**足され**、真数を**割ると**対数は**引かれ**、真数を **$k$ 乗**すると対数は **$k$ 倍**になります。`,
          pro: R`逆向き（バラす向き）も同じ公式です。$\log_{a}12=\log_{a}(2^{2}\times 3)=2\log_{a}2+\log_{a}3$ のように素因数分解して使います。`
        },
        {
          t: '真数条件を確認する',
          m: mode === 'coef' ? R`M = ` + MT + R` > 0` : R`M = ` + MT + R` > 0,\quad N = ` + NT + R` > 0`,
          n: R`対数の真数は正でなければなりません（真数条件）。` + (mode === 'coef' ? R`$M$` : R`$M,\ N$`) + R` が正なので、公式が使えます。`,
          easy: R`$\log_{a}M$ は「$a$ を何乗したら $M$ になるか」でした。$a$ が正の数のとき、何乗しても 0 や負の数にはなりません。だから真数 $M$ が 0 以下の対数は存在しません。公式を使う前に「中身がちゃんと正か」を確かめます。`
        },
        {
          t: '公式で 1 つの対数にまとめる',
          m: [rule, lhs + ' = ' + mid],
          n: R`公式の $M,\ N,\ k` + (mode === 'mix' ? R`,\ l` : '') + R`$ に数を代入して、真数の計算（かけ算・わり算・累乗）の形にします。`,
          easy: R`足し算の対数は「真数のかけ算」、引き算の対数は「真数のわり算」、係数 $k$ は「真数の $k$ 乗」に変わります。変形したあとは、対数が 1 つになります。`,
          pro: R`係数がついたら先に真数の累乗にする（$k\log_{a}M=\log_{a}M^{k}$）と、あとはかけ算とわり算だけです。`
        },
        {
          t: '真数を計算する',
          m: [calcT, mid + ' = ' + lg(argT)],
          n: R`真数 $` + argT + R`$ が求まりました。$` + lhs + ' = ' + lg(argT) + R`$ と 1 つの対数にまとまります。`,
          easy: R`ここは小学校からの計算です（かけ算・わり算・累乗）。分数が出てきたら約分して、できるだけ簡単な数にしておきます。`
        },
        {
          t: '対数の値を求める',
          m: valM,
          n: info.exact ? R`底と真数が同じ数の累乗で表せるので、$\log_{c^{m}}c^{n}=\frac{n}{m}$ から値が決まります。` : R`底と真数が同じ数の累乗にならないので、底の変換公式で近似値を求めます。`,
          easy: info.exact ? R`「$` + aT + R`$ を何乗したら $` + argT + R`$ になるか」を考えます。同じ数の累乗にそろえると、指数を比べるだけで答えが出ます。` : R`「$` + aT + R`$ を何乗したら $` + argT + R`$ か」は整数や分数にならないので、電卓の log キーで近似します（$\log_{10}$ の比をとる底の変換公式）。`,
          pro: R`$a$ の累乗になるように設計されている問題が多いので、まず「$` + argT + R`$ は $` + aT + R`$ の何乗か」を暗算で見抜きます。`
        },
        {
          t: '別の道筋で確かめる（個別に求めてから合成）',
          m: altM,
          n: altN,
          easy: R`まとめずに、1 つずつ値を求めてから計算しても同じ答えになるはずです。2 通りの計算で同じ値になれば、計算ミスがない証拠です。`,
          lv: 2
        },
        {
          t: 'なぜ公式が成り立つのか（指数法則から）',
          m: [R`\log_{a} M = x,\ \log_{a} N = y \;\Leftrightarrow\; M = a^{x},\ N = a^{y}`,
            R`MN = a^{x}a^{y} = a^{x+y} \;\Rightarrow\; \log_{a} MN = x + y`,
            R`\frac{M}{N} = \frac{a^{x}}{a^{y}} = a^{x-y},\qquad M^{k} = \left(a^{x}\right)^{k} = a^{kx}`],
          n: R`$M=a^{x}$、$N=a^{y}$ と指数で表し、指数法則を使うと 3 つの公式がすべて出てきます。`,
          easy: R`数値例で確かめます。$\log_{2}8+\log_{2}4=3+2=5$ で、$\log_{2}(8\times 4)=\log_{2}32=5$（$2^{5}=32$）。たしかに一致します。「$8=2^{3}$、$4=2^{2}$ だから、かけると $2^{3+2}=2^{5}$」というのが仕組みです。`,
          lv: 3
        }
      ];
      return {
        result: [
          { label: '1 つの対数にまとめる', tex: lhs + ' = ' + lg(argT) },
          { label: '値', tex: info.exact ? lg(argT) + ' = ' + info.x.tex() : lg(argT) + R` \approx ` + f4(info.v) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ======================= 4. 桁数と小数首位 ======================= */

  JK.registerCalc({
    id: 'iib-digits',
    course: 'IIB',
    unit: 'm-explog',
    group: '指数・対数',
    title: '桁数と小数首位（常用対数）',
    desc: R`$a^{n}$ が何桁の整数か、$\left(\frac{1}{a}\right)^{n}$ が小数第何位ではじめて 0 でない数字が現れるかを、常用対数（$\log_{10}2=0.3010,\ \log_{10}3=0.4771$）で求めます。`,
    form: [R`N \text{ が } k \text{ 桁} \;\Leftrightarrow\; k-1 \le \log_{10} N < k`, R`\log_{10} 2 = 0.3010,\quad \log_{10} 3 = 0.4771`],
    inputs: [
      { key: 'a', label: R`$a$（2, 3, 5 の積で表せる整数）`, type: 'int', def: '6', min: 2, max: 1000000, hint: R`例: 2, 3, 6, 12, 15, 24, 30, 45 など。` },
      { key: 'n', label: R`指数 $n$`, type: 'int', def: '20', min: 1, max: 5000 }
    ],
    examples: [
      { label: '2 の 30 乗', v: { a: '2', n: '30' } },
      { label: '3 の 40 乗', v: { a: '3', n: '40' } },
      { label: '12 の 25 乗', v: { a: '12', n: '25' } },
      { label: '5 の 50 乗', v: { a: '5', n: '50' } },
      { label: '15 の 20 乗', v: { a: '15', n: '20' } }
    ],
    intro: {
      easy: R`$2^{30}$ のような大きな数は、実際にかけ算しなくても「何桁の数か」を調べられます。道具は**常用対数**（10 を底とする対数）です。
3 桁の数は 100 以上 1000 未満、つまり $10^{2}$ 以上 $10^{3}$ 未満です。$\log_{10}N$ は「$N$ は 10 の何乗か」を表すので、$N$ が 3 桁なら $\log_{10}N$ は 2 以上 3 未満（2.5 や 2.99 のような数）になります。**$\log_{10}N$ の整数部分に 1 を足したものが桁数**です。
$\left(\frac{1}{a}\right)^{n}$ のような小さい数（0.000…の形）も、「10 の何乗分の 1 か」で、小数第何位に最初の数字が現れるかが分かります。`,
      normal: R`$N$ が $k$ 桁 $\Leftrightarrow 10^{k-1}\le N<10^{k}\Leftrightarrow k-1\le\log_{10}N<k$。$\left(\frac{1}{a}\right)^{n}$ は $-k<\log_{10}\left(\frac{1}{a}\right)^{n}<-(k-1)$ なら小数第 $k$ 位ではじめて 0 でない数字が現れます。`,
      pro: R`$\log_{10}a^{n}=n\log_{10}a$ を作って整数部分を見る、が定石。$5$ は $\log_{10}5=1-\log_{10}2$、$\frac{1}{a}$ の問題は符号を反転して同じ整数部分を使います。境界に近いときは与えられた精度の近似値で判定できるかを確認します。`
    },
    compute(v) {
      const a = v.a, n = v.n;
      let m = a, ex = 0, ey = 0, ez = 0;
      while (m % 2 === 0) { m /= 2; ex++; }
      while (m % 3 === 0) { m /= 3; ey++; }
      while (m % 5 === 0) { m /= 5; ez++; }
      if (m !== 1) throw new CalcError('a は 2, 3, 5 だけを素因数にもつ整数にしてください（例: 6, 12, 15, 24, 30, 45）');
      const isPow10 = ey === 0 && ex === ez;
      // 実際の桁数（巨大整数で数える。使えない環境では対数の倍精度で代用）
      let digits = null, bigStr = null;
      if (typeof BigInt === 'function') {
        try {
          let r = BigInt(1), b = BigInt(a), e = n;
          while (e > 0) { if (e % 2 === 1) r = r * b; e = Math.floor(e / 2); if (e > 0) b = b * b; }
          bigStr = r.toString();
          digits = bigStr.length;
        } catch (err) { digits = null; bigStr = null; }
      }
      if (digits === null) digits = Math.floor(n * Math.log10(a) + 1e-9) + 1;
      // 常用対数の近似値（4 桁 → 5 桁 → 7 桁 の順に、判定が正しくなる精度を探す）
      const LV = [
        { d: 10000, c2: 3010, c3: 4771, k: 4 },
        { d: 100000, c2: 30103, c3: 47712, k: 5 },
        { d: 10000000, c2: 3010300, c3: 4771213, k: 7 }
      ];
      let li = -1;
      for (let i = 0; i < LV.length; i++) {
        const t = LV[i];
        const S = ex * t.c2 + ey * t.c3 + ez * (t.d - t.c2);
        if (Math.floor(n * S / t.d) + 1 === digits) { li = i; break; }
      }
      const ok = li >= 0;
      const lev = LV[ok ? li : LV.length - 1];
      const S = ex * lev.c2 + ey * lev.c3 + ez * (lev.d - lev.c2);
      const LN = n * S;
      const fx = (num, k) => (num / lev.d).toFixed(k);
      const strip = (s) => String(Number(s));
      const c2s = fx(lev.c2, lev.k), c3s = fx(lev.c3, lev.k), c5s = fx(lev.d - lev.c2, lev.k);
      const logA = fx(S, lev.k);
      const Lex = n * Math.log10(a);
      const Ls = ok ? strip(fx(LN, lev.k)) : strip(Lex.toFixed(6));
      const fl = digits - 1;                              // 整数部分
      const place = isPow10 ? digits - 1 : digits;        // 小数第何位
      const aT = String(a), anT = aT + '^{' + n + '}';
      const invT = R`\left(\frac{1}{` + aT + R`}\right)^{` + n + '}';

      // log10 a の組み立て
      const fac = [];
      if (ex) fac.push(ex === 1 ? '2' : '2^{' + ex + '}');
      if (ey) fac.push(ey === 1 ? '3' : '3^{' + ey + '}');
      if (ez) fac.push(ez === 1 ? '5' : '5^{' + ez + '}');
      const facT = fac.join(R` \times `);
      const lterms = [], nterms = [];
      if (ex) { lterms.push(ck(ex) + R`\log_{10} 2`); nterms.push((ex === 1 ? '' : ex + R` \times `) + c2s); }
      if (ey) { lterms.push(ck(ey) + R`\log_{10} 3`); nterms.push((ey === 1 ? '' : ey + R` \times `) + c3s); }
      if (ez) { lterms.push(ck(ez) + R`\log_{10} 5`); nterms.push((ez === 1 ? '' : ez + R` \times `) + c5s); }
      const simpleA = (ex + ey + ez === 1);

      const steps = [];
      steps.push({
        t: '桁数と常用対数の関係',
        m: [R`N \text{ が } k \text{ 桁} \;\Leftrightarrow\; 10^{k-1} \le N < 10^{k}`, R`\Leftrightarrow\; k-1 \le \log_{10} N < k`],
        n: R`整数 $N$ の桁数は、$\log_{10}N$ の**整数部分に 1 を足したもの**です。`,
        easy: R`3 桁の数は 100 以上 1000 未満で、$100=10^{2}$、$1000=10^{3}$ です。$\log_{10}N$ は「$N$ は 10 の何乗か」を表すので、3 桁の数なら 2 以上 3 未満になります。整数部分が 2 なら 3 桁、整数部分が 15 なら 16 桁、と読み取れます。`,
        pro: R`$\log_{10}N$ の整数部分を $p$ とすると、桁数は $p+1$。小数なら「$-q<\log_{10}N<-(q-1)$ で小数第 $q$ 位」です。`
      });
      if (!simpleA) {
        steps.push({
          t: R`$` + aT + R`$ を素因数分解して $\log_{10}` + aT + R`$ を作る`,
          m: [aT + ' = ' + facT, R`\log_{10} ` + aT + R` = \log_{10}\left(` + facT + R`\right) = ` + lterms.join(' + ')],
          n: R`積の対数は和（$\log_{10}MN=\log_{10}M+\log_{10}N$）、累乗の対数は指数倍（$\log_{10}M^{k}=k\log_{10}M$）です。` + R`$\log_{10}2$、$\log_{10}3$ の値は問題で与えられます。`,
          easy: R`大きな数のままでは対数が分からないので、$2,\ 3,\ 5$ の積に分けます。$\log_{10}2=0.3010$ と $\log_{10}3=0.4771$ は「10 を何乗すると 2 や 3 になるか」を表す、あらかじめ分かっている値です。分けたあと、対数の性質で足し算に直します。`,
          pro: R`$a$ が 2, 3, 5 以外の素数をもつ問題は、与えられた近似値（たとえば $\log_{10}7=0.8451$）を使う形で出題されます。`
        });
      }
      if (ez > 0) {
        steps.push({
          t: R`$\log_{10}5$ の値を作る`,
          m: R`\log_{10} 5 = \log_{10}\frac{10}{2} = \log_{10}10 - \log_{10}2 = 1 - ` + fx(lev.c2, lev.k) + ' = ' + c5s,
          n: R`$5=\frac{10}{2}$ と見て、$\log_{10}10=1$ を使います。`,
          easy: R`5 を「10 ÷ 2」と見るのがコツです。10 の対数は 1（10 を 1 乗すると 10）なので、引き算だけで $\log_{10}5$ が出ます。`,
          lv: 2
        });
      }
      steps.push({
        t: R`値を代入して $\log_{10}` + aT + R`$ を計算する`,
        m: chain(R`\log_{10} ` + aT, nterms.join(' + '), logA),
        n: R`$\log_{10}2=` + c2s + (ey ? R`,\ \log_{10}3=` + c3s : '') + (ez ? R`,\ \log_{10}5=` + c5s : '') + R`$ を代入します。` + (ok && li === 0 ? '' : R`（判定に必要な精度の近似値を使っています）`),
        easy: R`作った式に、与えられた値を入れて計算します。ここはただの小数のかけ算と足し算です。`
      });
      steps.push({
        t: R`$n$ 倍して桁数を決める`,
        m: isPow10
          ? [R`\log_{10} a^{n} = n\log_{10} a`, R`\log_{10} ` + anT + ' = ' + n + R` \times ` + logA + ' = ' + Ls, chain(anT, '10^{' + fl + '}') + R` \;\Rightarrow\; ` + digits + R`\text{ 桁}`]
          : [R`\log_{10} a^{n} = n\log_{10} a`, R`\log_{10} ` + anT + ' = ' + n + R` \times ` + logA + ' = ' + Ls, fl + R` \le \log_{10} ` + anT + ' < ' + (fl + 1), '10^{' + fl + R`} \le ` + anT + ' < 10^{' + (fl + 1) + '}', R`\therefore\ ` + anT + R` \text{ は } ` + digits + R`\text{ 桁}`],
        n: R`$a^{n}$ の対数は $n\log_{10}a$。その整数部分が $` + fl + R`$ なので、桁数は $` + fl + '+1=' + digits + R`$ です。`,
        easy: R`$\log_{10}` + anT + R`$ は「$` + anT + R`$ は 10 の何乗か」でした。それが $` + Ls + R`$ なので、$10^{` + fl + R`}$ と $10^{` + (fl + 1) + R`}$ の間にあります。$10^{` + fl + R`}$ は 1 のうしろに 0 が ` + fl + R` 個の ` + (fl + 1) + R` 桁の数なので、$` + anT + R`$ は ` + digits + R` 桁です。`,
        pro: R`整数部分だけ見れば足ります。小数部分は「境界の近くでないか」の確認にだけ使います。`
      });
      steps.push({
        t: R`$\left(\frac{1}{` + aT + R`}\right)^{` + n + R`}$ が小数第何位か`,
        m: isPow10
          ? [R`\left(\frac{1}{a}\right)^{n} = a^{-n}`, invT + ' = 10^{-' + fl + '}' + (fl <= 20 ? ' = 0.' + '0'.repeat(Math.max(0, fl - 1)) + '1' : '') + R` \;\Rightarrow\; \text{小数第 } ` + place + R` \text{ 位}`]
          : [R`\log_{10}\left(\frac{1}{a}\right)^{n} = -n\log_{10} a`, R`\log_{10} ` + invT + ' = -' + Ls, '-' + (fl + 1) + R` < \log_{10} ` + invT + ' < -' + fl, '10^{-' + (fl + 1) + R`} < ` + invT + ' < 10^{-' + fl + '}', R`\therefore\ \text{小数第 } ` + place + R` \text{ 位}`],
        n: R`$\left(\frac{1}{a}\right)^{n}=a^{-n}$ なので、対数は $-n\log_{10}a=-` + Ls + R`$。` + (isPow10 ? R`ちょうど $10^{-` + fl + R`}$ になります。` : R`$-` + (fl + 1) + R`$ と $-` + fl + R`$ の間にあるので、$10^{-` + (fl + 1) + R`}$ と $10^{-` + fl + R`}$ の間の数です。`),
        easy: R`$10^{-1}=0.1$ は小数第 1 位に 1、$10^{-2}=0.01$ は小数第 2 位に 1、…、$10^{-q}$ は小数第 $q$ 位に 1 が立つ数です。$` + invT + R`$ が $10^{-` + (fl + 1) + R`}$ と $10^{-` + fl + R`}$ の間なら、0 でない数字が最初に現れるのは小数第 ` + place + R` 位です。` + (isPow10 ? '' : R`（元の数が $a^{n}$ の ` + digits + R` 桁と同じ「` + place + R`」になるのは偶然ではありません）`),
        pro: R`$a^{n}$ が $k$ 桁なら、$\left(\frac{1}{a}\right)^{n}$ は小数第 $k$ 位ではじめて 0 でない数字が現れます（$a^{n}$ がちょうど $10$ の累乗のときを除く）。`
      });
      if (li > 0 || !ok) {
        steps.push({
          t: '近似値の精度について',
          m: ok ? R`\log_{10}2=` + fx(LV[li].c2, LV[li].k) + R`,\quad \log_{10}3=` + fx(LV[li].c3, LV[li].k) : R`n\log_{10}a \approx ` + Ls,
          n: ok ? R`$n\log_{10}a$ が整数のすぐ近くにあるため、4 桁の近似値（$0.3010,\ 0.4771$）では桁数を正しく判定できません。そこで、より桁数の多い近似値を使っています。` : R`この問題は $n\log_{10}a$ が整数のごく近くにあり、7 桁の近似値でも判定できません。実際に $a^{n}$ を計算した桁数を答えとし、$n\log_{10}a$ の値は高精度の計算値を載せています。`,
          easy: R`$n$ 倍すると、近似値の小さなずれも $n$ 倍に大きくなります。答えの境目（整数）にぎりぎり近いときは、もう少し細かい値（$\log_{10}2=0.30103$ など）を使わないと、桁数を 1 つ間違えてしまいます。`,
          lv: 2
        });
      }
      if (bigStr && digits <= 30) {
        steps.push({
          t: '実際の値で確かめる',
          m: anT + ' = ' + bigStr + R`\quad (` + digits + R`\text{ 桁})`,
          n: R`実際に計算した $` + anT + R`$ も ` + digits + R` 桁で、対数による判定と一致しています。`,
          easy: R`この大きさなら、実際にかけ算して桁を数えても確かめられます。常用対数を使うと、これが 100 桁・1000 桁になっても同じ手順で桁数が分かります。`,
          lv: 2
        });
      }
      steps.push({
        t: '常用対数とは',
        m: [R`\log_{10} 1 = 0,\quad \log_{10} 10 = 1,\quad \log_{10} 100 = 2,\quad \log_{10} 1000 = 3`, R`\log_{10} 10^{k} = k`],
        n: R`底を 10 にした対数を**常用対数**といいます。10 の累乗の対数は、指数そのものです。`,
        easy: R`「10 を何乗したか」を表す数が常用対数です。1 → 0 乗、10 → 1 乗、100 → 2 乗、1000 → 3 乗なので、桁が 1 つ増えるごとに値が 1 ずつ増えます。だから整数部分が桁数に結びつきます。`,
        lv: 3
      });
      return {
        result: [
          { label: 'a^n の桁数', tex: anT + R` \text{ は } ` + digits + R`\text{ 桁}` },
          { label: '小数で最初の 0 でない数字', tex: invT + R` \text{ は小数第 } ` + place + R` \text{ 位}` },
          { label: 'n log10 a', tex: R`\log_{10} ` + anT + (ok ? ' = ' : R` \approx `) + Ls }
        ],
        steps: steps
      };
    }
  });

  /* ======================= 5. 指数・対数方程式 ======================= */

  const xm = (r) => (r.isZero() ? 'x' : 'x' + addConst(r));           // x + 2 / x - 1
  const tmin = (r) => (r.isZero() ? 't' : (r.sign() > 0 ? 't - ' + r.tex() : 't + ' + r.neg().tex()));   // t - r
  const xmin = (r) => (r.isZero() ? 'x' : (r.sign() > 0 ? 'x - ' + r.tex() : 'x + ' + r.neg().tex()));   // x - r
  const sgnWord = (s) => (s > 0 ? ' > 0' : (s < 0 ? ' < 0' : ' = 0'));

  // y = a^{2x} + p a^{x} + q のグラフ
  function quadExpGraph(a, p, q, xsol) {
    const fv = (x) => { const t = Math.pow(a, x); return t * t + p * t + q; };
    let xl = -3, xr = 3;
    xsol.forEach((s) => { xl = Math.min(xl, s - 1); xr = Math.max(xr, s + 1); });
    let lo = Infinity, hi = -Infinity;
    for (let k = 0; k <= 120; k++) {
      const y = fv(xl + (xr - xl) * k / 120);
      if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
    }
    if (!isFinite(lo) || !isFinite(hi)) { lo = -1; hi = 5; }
    const sc = Math.max(1, Math.abs(p), Math.abs(q));
    const ylo = Math.min(lo, 0) - 0.2 * sc;
    const yhi = Math.max(Math.min(hi, Math.max(6 * sc, 3)), ylo + 2);
    return JK.plot.graph({
      w: 340, h: 240, x: [xl, xr], y: [ylo, yhi],
      curves: [{ f: fv, cls: 'c1' }],
      points: xsol.map((s) => ({ x: s, y: 0, cls: 'c3', label: 'x=' + U.fmt(s, 3), pos: 'tr' })),
      labels: [{ x: xl + 0.2, y: yhi - 0.12 * (yhi - ylo), text: 'y = a^(2x) + p·a^x + q', cls: 'c1' }]
    });
  }

  function solveExp1(v) {
    const a = v.a, b = v.bE;
    checkBase(a);
    mustPositive(b, '右辺 b');
    checkSize(b, '右辺 b');
    const aT = a.tex(), bT = b.tex();
    const eq = powB(a, 'x') + ' = ' + bT;
    const info = logInfo(a, b), cb = info.cb;
    const xv = info.v;
    const fig = expGraph(a.val(), xv, 'x = ' + (info.exact ? info.x.toString() : '≈' + f4(xv)));
    const steps = [{
      t: '方針：底をそろえる',
      m: R`a^{p} = a^{q} \;\Rightarrow\; p = q \quad (a>0,\ a \ne 1)`,
      n: R`指数に未知数 $x$ があるので、両辺を**同じ底の累乗**にそろえて指数どうしを比べます。そろえられないときは対数で解きます。`,
      easy: R`指数方程式は「$a$ を何回かけたら $b$ になるか」を探す問題です。たとえば $2^{x}=8$ なら、$8=2^{3}$ と書き直すと「2 を $x$ 回かけた数」と「2 を 3 回かけた数」が等しいので、$x=3$ と分かります。`,
      pro: R`底をそろえる → 指数を比べる、が基本。そろわない（$3^{x}=5$ など）ときは両辺の対数をとって $x=\log_{3}5$ とします。`
    }];
    if (cb) {
      const x = info.x;
      const cT = cb.c.tex();
      const pa = powB(cb.c, cb.m), pb = powB(cb.c, cb.n);
      const coefX = cb.m === 1 ? 'x' : (cb.m === -1 ? '-x' : cb.m + 'x');
      steps.push({
        t: '両辺を同じ数の累乗にそろえる',
        m: [eq, chain(aT, facQ(a), pa), chain(bT, facQ(b), pb)],
        n: R`$a=` + pa + R`$、$b=` + pb + R`$ と、同じ数 $` + cT + R`$ の累乗で表せました。`,
        easy: R`底 $` + aT + R`$ と右辺 $` + bT + R`$ を素因数分解して、「同じ数を何回かけたものか」の形に直します。同じ数 $` + cT + R`$ が見つかれば、あとは「かける回数」を比べるだけです。`,
        pro: R`$4=2^{2}$、$8=2^{3}$、$\frac{1}{2}=2^{-1}$ のような 2 や 3 の累乗は暗算で書き直せるようにしておきます。`
      });
      steps.push({
        t: '指数を比べて x を求める',
        m: cb.m === 1
          ? [sup(cT, 'x') + ' = ' + pb, 'x = ' + cb.n]
          : [R`\left(` + pa + R`\right)^{x} = ` + pb, sup(cb.c.d === 1 ? cT : R`\left(` + cT + R`\right)`, coefX) + ' = ' + pb, coefX + ' = ' + cb.n, 'x = ' + x.tex()],
        n: R`$(c^{m})^{x}=c^{mx}$ と指数をかけ算にして、底が同じなので指数を等しいとおきます。`,
        easy: R`「$` + cT + R`$ を $` + coefX + R`$ 回かけた数」と「$` + cT + R`$ を $` + cb.n + R`$ 回かけた数」が等しいのですから、かける回数も等しいはずです。だから $` + coefX + '=' + cb.n + R`$ を解いて $x=` + x.tex() + R`$ です。`
      });
      const exprs = [powB(a, x.tex())];
      if (cb.m !== 1) exprs.push(R`\left(` + pa + R`\right)^{` + x.tex() + '}', powB(cb.c, cb.m + R`\times ` + U.paren(x)));
      exprs.push(pb, bT);
      const dedup = exprs.filter((e, i) => i === 0 || e !== exprs[i - 1]);
      steps.push({
        t: '検算',
        m: al(dedup.map((e, i) => (i === 0 ? e + R` &= ` + dedup[1] : (i === 1 ? null : R`&= ` + e))).filter((e) => e !== null)),
        n: R`$x=` + x.tex() + R`$ を元の方程式 $` + eq + R`$ の左辺に代入すると、右辺 $` + bT + R`$ になります。`,
        easy: R`求めた $x$ を元の式の左辺に入れて計算し直します。右辺と同じ値になれば正解です。`,
        lv: 2
      });
      steps.push({
        t: 'なぜ「指数を比べてよい」のか',
        m: R`y = a^{x} \text{ は単調（増加または減少）} \;\Rightarrow\; a^{p} = a^{q} \text{ なら } p = q`,
        n: R`指数関数 $y=a^{x}$ は $a>1$ なら増加、$0<a<1$ なら減少します。同じ値をとる $x$ は 1 つしかないので、$a^{p}=a^{q}$ なら $p=q$ です。`,
        easy: R`$y=a^{x}$ のグラフは、右に行くほど上がり続ける（または下がり続ける）なめらかな曲線です。水平な線 $y=b$ と交わる点は 1 つだけなので、答えの $x$ も 1 つに決まります（右の図の点）。`,
        lv: 3
      });
      return {
        result: [{ label: '解', tex: 'x = ' + x.tex() }, { label: '底をそろえた形', tex: 'a = ' + pa + R`,\quad b = ` + pb }],
        steps: steps,
        fig: fig
      };
    }
    const la = Math.log10(a.val()), lb = Math.log10(b.val());
    steps.push({
      t: '底をそろえられるか調べる',
      m: [primeLine(a), primeLine(b)],
      n: R`$a$ と $b$ を同じ数の累乗で表せません。このとき $x$ は整数や分数にならない数なので、対数を使って $x=\log_{a}b$ と表します。`,
      easy: R`「$` + aT + R`$ を何回かけたら $` + bT + R`$ か」が、きれいな回数にならない場合です。答えは $x=\log_{` + aT + '} ' + bT + R`$ という「対数の形」で書けば正確です。`
    });
    steps.push({
      t: '対数の定義と底の変換で値を求める',
      m: [R`a^{x} = b \;\Leftrightarrow\; x = \log_{a} b`, 'x = ' + logHead(aT, bT) + R` = \frac{\log_{10} ` + bT + R`}{\log_{10} ` + aT + '}', 'x \\approx \\frac{' + f5(lb) + '}{' + f5(la) + R`} \approx ` + f4(xv)],
      n: R`両辺の常用対数をとると $x\log_{10}a=\log_{10}b$ なので、$x=\frac{\log_{10}b}{\log_{10}a}$ です。`,
      easy: R`$` + eq + R`$ の両辺を「10 を何乗したものか」に直して比べます。$\log_{10}$ は電卓の log キーで出せます。比をとれば、かける回数 $x$ の近似値が求まります。`,
      pro: R`答えは $x=\log_{` + aT + '} ' + bT + R`$ の形が正解。近似が必要なときは $\log_{10}2=0.3010$ などで評価します。`
    });
    steps.push({
      t: '検算',
      m: powB(a, f4(xv)) + R` \approx ` + U.fmt(Math.pow(a.val(), Math.round(xv * 1e4) / 1e4), 2) + R`\quad (\text{右辺 } ` + bT + ')',
      n: R`求めた $x$ を左辺に代入して、右辺 $` + bT + R`$ に近い値になることを確かめます。`,
      easy: R`近似値の $x$ を元の式に入れて電卓で計算し、右辺に（ほぼ）一致すれば正解です。`,
      lv: 2
    });
    steps.push({
      t: 'グラフでの意味',
      m: R`y = a^{x} \text{ と } y = b \text{ の交点の } x \text{ 座標が解}`,
      n: R`曲線 $y=a^{x}$ と水平線 $y=b$ の交点が 1 つだけあり、その $x$ 座標が $\log_{a}b$ です。`,
      easy: R`右の図の曲線は $y=a^{x}$、点線は $y=b$ です。2 つが交わる点の横の位置が方程式の解です。曲線は右（または左）へ行くほど必ず一方向に動くので、交点はちょうど 1 つです。`,
      lv: 3
    });
    return { result: [{ label: '解', tex: 'x = ' + logHead(aT, bT) + R` \approx ` + f4(xv) }], steps: steps, fig: fig };
  }

  function solveExp2(v) {
    const a = v.a, p = v.pe, q = v.qe;
    checkBase(a);
    const aT = a.tex();
    const eq = powB(a, '2x') + addTerm(p, powB(a, 'x')) + addConst(q) + ' = 0';
    const tEq = P.tex([q, p, Q(1)], 't') + ' = 0';
    const D = p.mul(p).sub(q.mul(4));
    const u = p.neg().div(2);
    const roots = [];
    let sd = null;
    if (D.sign() >= 0) {
      if (D.isZero()) roots.push(QR.of(u));
      else {
        sd = sqrtQ(D);
        if (sd) { const h = sd.div(2); roots.push(QR.of(u.sub(h)), QR.of(u.add(h))); }
        else { const sq = QR.sqrt(D); const h = new QR(Q(0), sq.b.div(2), sq.m); roots.push(QR.of(u).sub(h), QR.of(u).add(h)); }
      }
    }
    const pos = roots.filter((t) => t.sign() > 0);
    const av = a.val();
    const sols = pos.map((t) => {
      if (t.isRat()) { const i = logInfo(a, t.a); return { t: t, exact: i.exact, x: i.x, v: i.v, cb: i.cb }; }
      return { t: t, exact: false, x: null, v: Math.log10(t.val()) / Math.log10(av), cb: null };
    });
    const xT = (s) => (s.exact ? s.x.tex() : logHead(aT, s.t.tex()));
    const fig = quadExpGraph(av, p.val(), q.val(), sols.map((s) => s.v));

    const steps = [];
    steps.push({
      t: R`$t=a^{x}$ とおいて、$t$ の 2 次方程式にする`,
      m: [eq, 't = ' + powB(a, 'x') + R`\quad (t>0)`, powB(a, '2x') + R` = \left(` + powB(a, 'x') + R`\right)^{2} = t^{2}`, tEq],
      n: R`$a^{2x}=(a^{x})^{2}$ なので、$t=a^{x}$ とおくと $t$ の 2 次方程式になります。**$a^{x}$ は正**なので $t>0$ という条件をつけておきます。`,
      easy: R`同じ形 $` + powB(a, 'x') + R`$ が何度も出てくるときは、まとめて 1 つの文字 $t$ に置き換えると、よく知っている 2 次方程式の形になります。$a^{2x}$ は $a^{x}$ を 2 乗したものなので $t^{2}$ です（$2^{6}=(2^{3})^{2}$ と同じ考え方）。`,
      pro: R`置換したら必ず $t>0$ を書く（答案の約束）。解の吟味を忘れる誤答が最も多い所です。`
    });
    // 2: t を解く
    const m2 = [R`D = p^{2} - 4q = ` + U.paren(p) + R`^{2} - 4 \times ` + U.paren(q) + ' = ' + D.tex()];
    let n2, e2;
    if (D.sign() < 0) {
      n2 = R`判別式 $D<0$ なので、$t$ の 2 次方程式に実数解はありません。したがって元の方程式にも解はありません。`;
      e2 = R`2 次方程式 $t^{2}+pt+q=0$ のグラフが $t$ 軸と交わらない（$D<0$）ので、$t$ に当てはまる実数がありません。$t=a^{x}$ は実数なので、元の方程式は解なしです。`;
    } else if (D.isZero()) {
      m2.push(R`\left(` + tmin(u) + R`\right)^{2} = 0`, 't = ' + u.tex());
      n2 = R`$D=0$ なので重解です。`;
      e2 = R`$D=0$ のときは、2 つの解が重なって $t$ がただ 1 つに決まります。`;
    } else if (sd) {
      m2.push(R`\left(` + tmin(roots[0].a) + R`\right)\left(` + tmin(roots[1].a) + R`\right) = 0`, 't = ' + roots[0].a.tex() + R`,\ ` + roots[1].a.tex());
      n2 = R`$t^{2}+pt+q$ を因数分解（または解の公式）で解きます。`;
      e2 = R`2 次方程式の解き方（因数分解 または 解の公式）を使うだけです。ここでは $t$ が $x$ の代わりの文字になっています。`;
    } else {
      m2.push(R`t = \frac{-p \pm \sqrt{D}}{2}`, 't = ' + roots[0].tex() + R`,\ ` + roots[1].tex(), R`t \approx ` + f4(roots[0].val()) + R`,\ ` + f4(roots[1].val()));
      n2 = R`整数の範囲で因数分解できないので、解の公式 $t=\frac{-p\pm\sqrt{p^{2}-4q}}{2}$ を使います。`;
      e2 = R`因数分解できないときは「解の公式」の出番です。根号つきの値が 2 つ出ます。`;
    }
    steps.push({ t: R`$t$ の 2 次方程式を解く`, m: m2, n: n2, easy: e2, pro: R`$D=p^{2}-4q$ の符号で、実数解の有無をまず判断します。` });

    if (D.sign() >= 0) {
      // 3: t > 0 の確認
      const rows3 = roots.map((t) => {
        const tt = t.isRat() ? t.tex() : t.tex() + R` \approx ` + f4(t.val());
        const s = t.sign();
        return 't = ' + tt + sgnWord(s) + R`\quad` + (s > 0 ? R` \text{採用}` : R` \text{不適}`);
      });
      steps.push({
        t: R`$t>0$ を満たす解だけを採用する`,
        m: rows3,
        n: R`$t=a^{x}>0$ なので、$0$ 以下の解は捨てます。` + (pos.length === 0 ? R`採用できる $t$ がないので、元の方程式は解なしです。` : R`採用する $t$ は ` + pos.length + R` 個です。`),
        easy: R`$a$ が正の数のとき、$a$ を何乗しても 0 や負の数にはなりません。だから $a^{x}=t$ となる $x$ が存在するのは $t>0$ のときだけです。0 以下の $t$ は「ありえない」解として捨てます（これを**解の吟味**といいます）。`,
        pro: R`2 次方程式の解と係数の関係（和 $-p$、積 $q$）で「正の解が何個か」を先に見積もれます。`
      });
    }
    if (sols.length) {
      const rows4 = [];
      sols.forEach((s) => {
        const tT = s.t.tex();
        rows4.push(powB(a, 'x') + ' = ' + tT);
        if (s.exact) {
          const cb = s.cb;
          const pa = powB(cb.c, cb.m), pb = powB(cb.c, cb.n);
          rows4.push(chain(aT, facQ(a), pa) + R`,\quad ` + chain(tT, facQ(s.t.a), pb) + R` \;\Rightarrow\; x = ` + s.x.tex());
        } else {
          rows4.push('x = ' + logHead(aT, tT) + R` \approx ` + f4(s.v));
        }
      });
      steps.push({
        t: R`$a^{x}=t$ から $x$ を求める`,
        m: rows4,
        n: R`$a^{x}=t$ を解くと $x=\log_{a}t$ です。$t$ が $a$ と同じ数の累乗で表せれば、底をそろえて指数を比べれば値が出ます。`,
        easy: R`置き換えた文字 $t$ を元に戻します。「$` + aT + R`$ を何回かけたら $t$ になるか」が $x$ です。きれいな累乗なら整数や分数、そうでなければ対数の形（近似値つき）になります。`
      });
      // 5: 検算
      const rows5 = [];
      sols.forEach((s) => {
        const t = s.t;
        if (t.isRat()) {
          const z = t.a.mul(t.a).add(p.mul(t.a)).add(q);
          rows5.push(R`t = ` + t.tex() + R`:\ ` + powB(t.a, 2) + addProd(p, t.a.tex()) + addConst(q) + ' = ' + z.tex());
        }
      });
      const vieta = roots.length === 2 && !roots[0].isRat();
      if (vieta) {
        const sum = roots[0].add(roots[1]), pr = roots[0].mul(roots[1]);
        rows5.push(R`t_{1} + t_{2} = ` + roots[0].tex() + ' + ' + par(roots[1].tex()) + ' = ' + sum.tex() + R` = -p`);
        rows5.push(R`t_{1}\,t_{2} = ` + par(roots[0].tex()) + par(roots[1].tex()) + ' = ' + pr.tex() + ' = q');
      }
      steps.push({
        t: '検算',
        m: rows5,
        n: R`$a^{2x}=t^{2}$、$a^{x}=t$ なので、元の方程式の左辺は $t^{2}+pt+q$ になります。求めた $t$ を代入すると $0$ になり、方程式を満たしています。` + (vieta ? R`無理数の解は代入が大変なので、解と係数の関係（和が $-p$、積が $q$）で確かめます。` : ''),
        easy: R`答えの $x$ を元の式に入れると、$a^{x}=t$、$a^{2x}=t^{2}$ になります。それを $t^{2}+pt+q$ に入れて 0 になれば、ちゃんと方程式の解です。`,
        lv: 2
      });
    }
    steps.push({
      t: '置換のコツ',
      m: [R`a^{2x} = \left(a^{x}\right)^{2},\qquad a^{x+k} = a^{k}\cdot a^{x},\qquad a^{-x} = \frac{1}{a^{x}}`],
      n: R`$a^{x}$ だけで書き直せる式は、$t=a^{x}$ と置換すれば $t$ の方程式になります。置換した文字の**範囲（$t>0$）**を必ず書き、解いたあとの吟味に使います。`,
      easy: R`$4^{x}$ や $2^{x+1}$ は、底や指数をそろえると $2^{x}$ の式で書けます（$4^{x}=(2^{2})^{x}=(2^{x})^{2}$、$2^{x+1}=2\cdot 2^{x}$）。同じ形がそろったら、その形を 1 つの文字に置き換えます。`,
      lv: 3
    });
    const res = [{ label: '置換後の方程式', tex: tEq }];
    if (D.sign() < 0) res.push({ label: 't の解', tex: R`\text{実数解なし}` });
    else res.push({ label: 't の解', tex: roots.map((t) => 't = ' + t.tex()).join(R`,\ `) });
    res.push({
      label: 'x の解',
      tex: sols.length ? sols.map((s) => 'x = ' + xT(s) + (s.exact ? '' : R` \approx ` + f4(s.v))).join(R`,\ `) : R`\text{解なし}`
    });
    return { result: res, steps: steps, fig: fig };
  }

  function solveLog1(v) {
    const a = v.a, b = v.bL;
    checkBase(a);
    if (b.d > 12 || Math.abs(b.n) > 40) throw new CalcError('b の分母は 12 以下、分子の絶対値は 40 以下にしてください');
    if (Math.abs(b.val()) * Math.abs(Math.log10(a.val())) > 12) throw new CalcError('x = a^b が大きすぎる（または小さすぎる）ため扱えません。a か b を小さくしてください');
    const aT = a.tex(), bT = b.tex();
    const w = powSteps(a, b, powB(a, bT));
    const pv = w.pv;
    const xT = radTex(pv);
    const exact = pv.idx === 1;
    const xv = approxOf(pv);
    const bv = b.val();
    const fig = logGraph(a.val(), [{ x: xv, y: bv, cls: 'c3', label: 'x = ' + (exact ? pv.out.toString() : '≈' + f4(xv)), pos: 'br' }], { hlines: [{ y: bv, dash: true }], vlines: [{ x: xv, dash: true }] });
    const eq = R`\log_{` + aT + R`} x = ` + bT;
    const steps = [
      {
        t: '真数条件',
        m: R`x > 0`,
        n: R`対数の真数は正でなければならないので、$x>0$ が条件です。`,
        easy: R`$\log_{a}x$ は「$a$ を何乗したら $x$ になるか」でした。$a$ は正の数なので、何乗しても 0 以下の数にはなりません。だから $x$ は正の数でなければ、そもそも式が成り立ちません。`,
        pro: R`対数方程式は、まず真数条件、最後に解の吟味、の順で。`
      },
      {
        t: '対数の定義で指数の式に直す',
        m: [R`\log_{a} x = b \;\Leftrightarrow\; x = a^{b}`, eq + R` \;\Leftrightarrow\; x = ` + powB(a, bT)],
        n: R`定義 $\log_{a}x=b \Leftrightarrow a^{b}=x$ を使うと、$x$ が $a^{b}$ と求まります。`,
        easy: R`$\log_{` + aT + R`}x=` + bT + R`$ は「$` + aT + R`$ を $` + bT + R`$ 乗すると $x$ になる」という意味です。だから $x=` + powB(a, bT) + R`$ と、指数の計算をするだけで答えが出ます。`,
        pro: R`$\log_{a}x=b$ は $x=a^{b}$ と書き直すのが最短。右辺が分数の指数でも、素因数分解して指数をかけ算します。`
      },
      {
        t: R`$` + powB(a, bT) + R`$ を計算する`,
        m: w.m3.concat(w.m4),
        n: R`底を素因数分解して、指数どうしをかけ算します（指数法則 $(a^{m})^{n}=a^{mn}$）。` + (exact ? '' : R`根号が残る場合は、整数乗の部分を外に出して簡単にします。`),
        easy: R`指数が分数や負の数でも、分母は「何乗根か」、符号は「逆数」を表すだけで、計算の仕方は変わりません。底を素因数分解して「指数のかけ算」にそろえます。`
      },
      {
        t: '真数条件の確認と結論',
        m: ['x = ' + xT + (exact ? '' : R` \approx ` + f4(xv)) + R` > 0`, R`\therefore\ x = ` + xT],
        n: R`$x=a^{b}$ は正の数なので、真数条件 $x>0$ を満たしています。`,
        easy: R`答えが正の数になっているので、真数条件も大丈夫です。$a>0$ のとき $a^{b}$ はつねに正なので、この型の方程式は「解の吟味」で落ちることがありません。`
      },
      {
        t: '検算',
        m: R`\log_{` + aT + '} ' + xT + ' = ' + R`\log_{` + aT + '} ' + powB(a, bT) + ' = ' + bT,
        n: R`$x=a^{b}$ を $\log_{a}x$ に入れると $\log_{a}a^{b}=b$ となり、元の方程式を満たします。`,
        easy: R`$\log_{a}a^{b}$ は「$a$ を何乗したら $a^{b}$ になるか」で、答えはそのまま $b$ です。求めた $x$ を戻すとちゃんと右辺になります。`,
        lv: 2
      },
      {
        t: '対数と指数の関係（グラフ）',
        m: R`y = \log_{a} x \text{ と } y = b \text{ の交点の } x \text{ 座標} = a^{b}`,
        n: R`$y=\log_{a}x$ のグラフと水平線 $y=b$ の交点を考えると、交点の $x$ 座標が $a^{b}$ です。`,
        easy: R`右の図の曲線は $y=\log_{a}x$ です。「高さが $b$ になる $x$」を探すのが、この方程式です。対数のグラフは指数関数のグラフを斜め（$y=x$ に関して）に折り返したものなので、「$\log$ を外す」と「指数にする」は逆の操作です。`,
        lv: 3
      }
    ];
    const res = [{ label: '解', tex: 'x = ' + xT }];
    if (!exact) res.push({ label: '近似値', tex: 'x \\approx ' + f4(xv) });
    return { result: res, steps: steps, fig: fig };
  }

  function solveLog2(v) {
    const a = v.a, p = v.pl, q = v.ql, r = v.rl;
    checkBase(a);
    const ar = a.pow(r);
    if (ar.n > 1e12 || ar.d > 1e12) throw new CalcError('a^r が大きすぎます。a か r を小さくしてください');
    const aT = a.tex();
    const x0 = p.neg().cmp(q.neg()) >= 0 ? p.neg() : q.neg();
    const sp = xm(p), sq = xm(q);
    const lg = (arg) => R`\log_{` + aT + '} ' + arg;
    const eq = lg(par(sp)) + ' + ' + lg(par(sq)) + ' = ' + r;
    const prodT = par(sp) + par(sq);
    const b2 = p.add(q), c2 = p.mul(q).sub(ar);
    const quad = P.tex([c2, b2, Q(1)], 'x');
    const D = b2.mul(b2).sub(c2.mul(4));
    const u = b2.neg().div(2);
    const sdq = sqrtQ(D);
    let roots;
    if (sdq) { const h = sdq.div(2); roots = [QR.of(u.sub(h)), QR.of(u.add(h))]; }
    else { const s = QR.sqrt(D); const h = new QR(Q(0), s.b.div(2), s.m); roots = [QR.of(u).sub(h), QR.of(u).add(h)]; }
    const x0Q = QR.of(x0);
    const valid = roots.map((t) => t.sub(x0Q).sign() > 0);
    const xr = roots[valid.indexOf(true)];                   // 採用する解（必ず 1 つ）
    const xrv = xr.val();
    const rT = (t) => (t.isRat() ? t.tex() : t.tex() + R` \approx ` + f4(t.val()));
    const lev = (t, k) => {                                   // x + k の値と符号
      const w = t.add(k);
      return { w: w, s: w.sign(), tex: (t.isRat() ? (k.isZero() ? t.tex() : t.tex() + addConst(k) + ' = ' + w.tex()) : 'x' + addConst(k) + R` \approx ` + f4(w.val())) };
    };
    const rows5 = roots.map((t, i) => {
      const l1 = lev(t, p), l2 = lev(t, q);
      return 'x = ' + rT(t) + R`:\ ` + l1.tex + sgnWord(l1.s) + R`,\ ` + l2.tex + sgnWord(l2.s) + R`\ \Rightarrow\ ` + (valid[i] ? R`\text{適}` : R`\text{不適}`);
    });
    const w1 = xr.add(p), w2 = xr.add(q);
    const w1T = w1.tex(), w2T = w2.tex();
    const prod = w1.mul(w2);
    const av = a.val();
    const xmax = Math.max(xrv + 2, x0.val() + 4);
    const f = (x) => Math.log(x + p.val()) / Math.log(av) + Math.log(x + q.val()) / Math.log(av);
    const fig = JK.plot.graph({
      w: 340, h: 240,
      x: [x0.val() - 1.2, xmax], y: [r - 4.5, r + 4.5],
      curves: [{ f: f, cls: 'c1', domain: [x0.val() + (xmax - x0.val()) * 0.004, xmax] }],
      hlines: [{ y: r, dash: true }],
      vlines: [{ x: x0.val(), label: 'x = ' + x0.toString(), dash: true }],
      points: [{ x: xrv, y: r, cls: 'c3', label: 'x = ' + (xr.isRat() ? xr.a.toString() : '≈' + f4(xrv)), pos: 'br' }]
    });
    const steps = [
      {
        t: '真数条件',
        m: ['x' + addConst(p) + R` > 0,\quad x` + addConst(q) + ' > 0', R`\therefore\ x > ` + x0.tex()],
        n: R`真数は正でなければならないので、2 つの真数がどちらも正になる範囲に $x$ を限ります。`,
        easy: R`対数の真数（log の右にある式）は、必ず正の数です。$` + sp + R`$ も $` + sq + R`$ も正になる範囲だけで考えます。数直線で 2 つの条件が両方成り立つ部分を探すと、$x>` + x0.tex() + R`$ です。`,
        pro: R`対数方程式は最初に真数条件を書く。最後の解の吟味で必ず使います。`
      },
      {
        t: '1 つの対数にまとめる',
        m: [R`\log_{a} M + \log_{a} N = \log_{a} MN`, eq + R` \;\Leftrightarrow\; ` + lg(prodT) + ' = ' + r],
        n: R`和の対数は、真数の積の対数にまとめられます。`,
        easy: R`対数の足し算は、中身（真数）のかけ算に直せるのでした（$\log_{2}4+\log_{2}8=\log_{2}32$）。左辺を 1 つの対数にしてから、定義を使って指数の式に直します。`
      },
      {
        t: '定義で指数の式にする',
        m: [R`\log_{a} X = r \;\Leftrightarrow\; X = a^{r}`, prodT + ' = ' + powB(a, r) + ' = ' + ar.tex()],
        n: R`$\log_{a}X=r$ は $X=a^{r}$ と同じ意味です。$a^{r}=` + ar.tex() + R`$ を計算しておきます。`,
        easy: R`「$` + aT + R`$ を $` + r + R`$ 乗すると $X$」という意味なので、まず $` + powB(a, r) + R`$ を計算して $` + ar.tex() + R`$ とします。これで対数が消え、$x$ の 2 次方程式になります。`
      },
      {
        t: '展開して 2 次方程式を解く',
        m: [prodT + ' = ' + ar.tex(), quad + ' = 0', R`D = ` + U.paren(b2) + R`^{2} - 4 \times ` + U.paren(c2) + ' = ' + D.tex(),
          (sdq ? R`\left(` + xmin(roots[0].a) + R`\right)\left(` + xmin(roots[1].a) + R`\right) = 0 \;\Rightarrow\; x = ` + roots[0].a.tex() + R`,\ ` + roots[1].a.tex() : R`x = \frac{-` + U.paren(b2) + R` \pm \sqrt{D}}{2} = ` + roots[0].tex() + R`,\ ` + roots[1].tex())],
        n: R`$(x+p)(x+q)$ を展開して $x^{2}+(p+q)x+pq-a^{r}=0$ とし、因数分解か解の公式で解きます。` + (sdq ? '' : R`整数の範囲で因数分解できないので解の公式を使います。`),
        easy: R`かっこを展開して整理すると、$x$ の 2 次方程式になります。解き方は中学・数 I で習った 2 次方程式と同じです。解の公式 $x=\frac{-b\pm\sqrt{b^{2}-4ac}}{2a}$ が使えます。`,
        pro: R`この型は $D=(p-q)^{2}+4a^{r}>0$ となり、2 つの実数解が必ずあります。`
      },
      {
        t: '真数条件で解を選ぶ（解の吟味）',
        m: rows5.concat([R`\therefore\ x = ` + rT(xr)]),
        n: R`真数条件 $x>` + x0.tex() + R`$ を満たす解だけが答えです。満たさない解は、対数の中身が負になるので捨てます。`,
        easy: R`2 次方程式の解がそのまま答えとは限りません。それぞれの解を元の対数の中身に入れてみて、**両方とも正**なら採用、**どちらかが 0 以下**なら不採用です。まとめた式 $` + prodT + R`$ は「負 × 負」でも正になるため、まとめる前の条件が必要になります。`,
        pro: R`$x>` + x0.tex() + R`$ との大小を比べるだけで十分です。条件に合わない解が必ず 1 つ出る型です。`
      },
      {
        t: '検算',
        m: [par(w1T) + R` \times ` + par(w2T) + ' = ' + prod.tex() + ' = ' + powB(a, r), lg(w1T) + ' + ' + lg(w2T) + ' = ' + lg(prod.tex()) + ' = ' + r],
        n: R`採用した $x$ を代入して、$(x+p)(x+q)=a^{r}$ となることを確かめます。`,
        easy: R`求めた $x$ を元の対数の式に入れてみます。真数のかけ算が $a^{r}$ になっていれば、対数の和が $r$ になって、方程式が成り立っています。`,
        lv: 2
      },
      {
        t: 'なぜ「解の吟味」が必要か',
        m: R`\log_{a}(x+p) + \log_{a}(x+q) \;\Rightarrow\; \log_{a}(x+p)(x+q)\ \text{は 定義域が広がる}`,
        n: R`$\log_{a}(x+p)+\log_{a}(x+q)$ は $x>` + x0.tex() + R`$ でしか定義されませんが、まとめた $\log_{a}(x+p)(x+q)$ は、2 つの真数がどちらも負のときにも定義されます。そのため、まとめてから解くと余分な解が混ざります。`,
        easy: R`たとえば $x=-5$ を考えると、$x+p$ と $x+q$ がどちらも負でも、かけると正になります。まとめた式では「合格」でも、元の式ではそれぞれの真数が負なので「対数が存在しない」。だから、解いたあとに元の条件へ戻って確かめます。`,
        lv: 3
      }
    ];
    return {
      result: [
        { label: '解', tex: 'x = ' + xr.tex() + (xr.isRat() ? '' : R` \approx ` + f4(xrv)) },
        { label: '真数条件', tex: 'x > ' + x0.tex() },
        { label: '2 次方程式', tex: quad + ' = 0' }
      ],
      steps: steps,
      fig: fig
    };
  }

  JK.registerCalc({
    id: 'iib-explog-eq',
    course: 'IIB',
    unit: 'm-explog',
    group: '指数・対数',
    title: '指数・対数方程式',
    desc: R`指数方程式 $a^{x}=b$、$a^{2x}+pa^{x}+q=0$（$t=a^{x}$ と置換）と、対数方程式 $\log_{a}x=b$、$\log_{a}(x+p)+\log_{a}(x+q)=r$（真数条件の確認つき）を解きます。`,
    form: [R`a^{x} = b \;\Rightarrow\; x = \log_{a} b \qquad \log_{a} x = b \;\Rightarrow\; x = a^{b}`, R`t = a^{x}\ (t>0) \quad\text{と置換} \qquad \text{真数} > 0`],
    inputs: [
      {
        key: 'mode', label: '方程式の型', type: 'select', def: 'exp1',
        options: [
          ['exp1', 'a^x = b（指数方程式）'],
          ['exp2', 'a^(2x) + p·a^x + q = 0（t = a^x と置換）'],
          ['log1', 'log_a x = b（対数方程式）'],
          ['log2', 'log_a(x+p) + log_a(x+q) = r（真数条件つき）']
        ]
      },
      { key: 'a', label: R`底 $a$（正の数・1 以外）`, type: 'q', def: '4', hint: R`整数・分数（1/2）・小数で入力できます。` },
      { key: 'bE', label: R`右辺 $b$（正の数）`, type: 'q', def: '8', show: (r) => r.mode === 'exp1' },
      { key: 'pe', label: R`$p$`, type: 'q', def: '-6', show: (r) => r.mode === 'exp2' },
      { key: 'qe', label: R`$q$`, type: 'q', def: '8', show: (r) => r.mode === 'exp2' },
      { key: 'bL', label: R`右辺 $b$`, type: 'q', def: '3', show: (r) => r.mode === 'log1' },
      { key: 'pl', label: R`$p$`, type: 'q', def: '0', show: (r) => r.mode === 'log2' },
      { key: 'ql', label: R`$q$`, type: 'q', def: '-2', show: (r) => r.mode === 'log2' },
      { key: 'rl', label: R`右辺 $r$（整数）`, type: 'int', def: '3', min: -6, max: 8, show: (r) => r.mode === 'log2' }
    ],
    examples: [
      { label: '4^x = 8', v: { mode: 'exp1', a: '4', bE: '8' } },
      { label: '(1/2)^x = 16', v: { mode: 'exp1', a: '1/2', bE: '16' } },
      { label: '3^x = 5（近似値）', v: { mode: 'exp1', a: '3', bE: '5' } },
      { label: '2^(2x) − 6·2^x + 8 = 0', v: { mode: 'exp2', a: '2', pe: '-6', qe: '8' } },
      { label: '3^(2x) + 2·3^x − 3 = 0（不適な解あり）', v: { mode: 'exp2', a: '3', pe: '2', qe: '-3' } },
      { label: '2^(2x) − 3·2^x + 1 = 0（t が無理数）', v: { mode: 'exp2', a: '2', pe: '-3', qe: '1' } },
      { label: 'log₂ x = 3', v: { mode: 'log1', a: '2', bL: '3' } },
      { label: 'log₄ x = 3/2', v: { mode: 'log1', a: '4', bL: '3/2' } },
      { label: 'log₂x + log₂(x−2) = 3', v: { mode: 'log2', a: '2', pl: '0', ql: '-2', rl: '3' } },
      { label: 'log₃(x+1) + log₃(x−1) = 1', v: { mode: 'log2', a: '3', pl: '1', ql: '-1', rl: '1' } }
    ],
    intro: {
      easy: R`指数方程式は「$x$ が指数のところにある方程式」、対数方程式は「$x$ が $\log$ の中にある方程式」です。
・$2^{x}=8$ は「2 を何回かけたら 8 か」→ $x=3$。底をそろえて指数を比べるのが基本です。
・$\log_{2}x=3$ は「2 を 3 回かけたものが $x$」→ $x=2^{3}=8$。$\log$ を外して指数の形にします。
対数方程式では、**真数（log の中身）は正**という条件があるので、解いたあとに必ずチェックします。指数方程式で $2^{2x}-6\cdot 2^{x}+8=0$ のような式は、$t=2^{x}$ とおくと 2 次方程式になります。`,
      normal: R`$a^{x}=b$ は底をそろえるか $x=\log_{a}b$。$a^{2x}+pa^{x}+q=0$ は $t=a^{x}\ (t>0)$ で置換。$\log_{a}x=b$ は $x=a^{b}$。$\log_{a}(x+p)+\log_{a}(x+q)=r$ は真数条件 $x>\max(-p,-q)$ を確認しながら、まとめて $(x+p)(x+q)=a^{r}$ を解きます。`,
      pro: R`ミスの大半は**解の吟味**（$t>0$、真数条件）の抜けです。まとめる前の式で条件を先に書き、最後に条件と照らして答えを選びます。`
    },
    compute(v) {
      switch (v.mode) {
        case 'exp2': return solveExp2(v);
        case 'log1': return solveLog1(v);
        case 'log2': return solveLog2(v);
        default: return solveExp1(v);
      }
    }
  });
})();
