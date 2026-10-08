/* 数II・B — 数列: 等差数列 / 等比数列 / 和の記号 Σ / 漸化式 / 和 S_n から一般項
   構成は ia-quad.js に準拠（intro → result → steps(easy / pro / lv) → fig）。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;

  /* ================= 共通ヘルパ ================= */

  const fm = (x, n) => U.fmt(x, n == null ? 4 : n);
  const pa = (t) => R`\left(` + t + R`\right)`;
  const parQ = (q) => (q.sign() < 0 || !q.isInt() ? R`\left(` + q.tex() + R`\right)` : q.tex());
  const ptn = (p) => P.tex(p, 'n');
  const co = (p, k) => (k < p.length ? p[k] : Q(0));
  // 多項式の合成 p(q(x))
  function compose(p, q) {
    let r = [Q(0)];
    for (let i = p.length - 1; i >= 0; i--) r = P.add(P.mul(r, q), [p[i]]);
    return r;
  }
  const SH = [Q(-1), Q(1)];                                    // n - 1
  // 累乗和 Σ_{k=1}^{n} k^j（j = 0..3）の n の多項式
  const PS = [
    [Q(0), Q(1)],
    [Q(0), Q(1, 2), Q(1, 2)],
    [Q(0), Q(1, 6), Q(1, 2), Q(1, 3)],
    [Q(0), Q(0), Q(1, 4), Q(1, 2), Q(1, 4)]
  ];
  const PSF = [
    'n',
    R`\frac{1}{2}n(n+1)`,
    R`\frac{1}{6}n(n+1)(2n+1)`,
    R`\left\{\frac{1}{2}n(n+1)\right\}^{2}`
  ];
  // m 項までの累乗和の n = m に直したもの（Σ_{k=1}^{n-1}）
  const PSM = PS.map((p) => compose(p, SH));
  const PSMF = [
    'n - 1',
    R`\frac{1}{2}(n-1)n`,
    R`\frac{1}{6}(n-1)n(2n-1)`,
    R`\left\{\frac{1}{2}(n-1)n\right\}^{2}`
  ];
  // c0 + c1 s + ... （係数 × 項の和）の TeX。terms: [[Q, tex], ...]
  function lcTerms(terms) {
    let out = '';
    terms.forEach((t) => {
      const c = t[0];
      if (c.isZero()) return;
      const neg = c.sign() < 0, ab = c.abs();
      const body = (ab.eq(1) ? '' : ab.tex() + R` \cdot `) + t[1];
      out += out === '' ? (neg ? '-' : '') + body : (neg ? ' - ' : ' + ') + body;
    });
    return out === '' ? '0' : out;
  }
  // 数の列（Q）の TeX
  const listTex = (vals) => vals.map((v) => v.tex()).join(R`,\ `) + R`,\ \cdots`;
  // base^{exp} の TeX（負・分数の底は括弧）
  const powTex = (base, ex) => parQ(base) + '^{' + ex + '}';
  // n の多項式 p に n = x（Q）を代入した形
  function substN(p, x) {
    let out = '';
    for (let k = P.deg(p); k >= 0; k--) {
      const c = p[k];
      if (c.isZero()) continue;
      const neg = c.sign() < 0, ab = c.abs();
      let body;
      if (k === 0) body = ab.tex();
      else {
        const xs = (x.isInt() && x.sign() >= 0) ? x.tex() : R`\left(` + x.tex() + R`\right)`;
        body = (ab.eq(1) ? '' : ab.tex() + R` \cdot `) + xs + (k === 1 ? '' : '^{' + k + '}');
      }
      out += out === '' ? (neg ? '-' : '') + body : (neg ? ' - ' : ' + ') + body;
    }
    return out === '' ? '0' : out;
  }

  // 多項式 p（Q 係数・昇べき）を、有理数根で因数分解した形の TeX（変数 v）
  function factorTex(p, v) {
    let cur = P.of(p.slice());
    if (P.isZero(cur)) return '0';
    const lin = [];
    P.rationalRoots(cur).forEach((rt) => {
      let m = 0;
      for (;;) {
        if (P.deg(cur) < 1) break;
        const dm = P.divmod(cur, [rt.neg(), Q(1)]);
        if (!P.isZero(dm.r)) break;
        cur = dm.q; m++;
      }
      if (m) lin.push({ rt: rt, m: m });
    });
    // 1 次因数 (x - u/w) → (w x - u) と 1/w
    let scalar = Q(1);
    const fac = lin.map((l) => {
      const u = l.rt.n, w = l.rt.d;
      for (let i = 0; i < l.m; i++) scalar = scalar.div(w);
      return { w: w, u: u, m: l.m };
    });
    fac.sort((x, y) => (x.w - y.w) || (Math.abs(x.u) - Math.abs(y.u)));
    // 残り（有理数根なし）を整数係数の原始多項式にする
    let restTex = '';
    if (P.deg(cur) >= 1) {
      let L = 1;
      cur.forEach((q) => { L = U.lcm(L, q.d); });
      let ints = cur.map((q) => q.n * (L / q.d));
      const g = ints.reduce((s, x) => U.gcd(s, x), 0) || 1;
      ints = ints.map((x) => x / g);
      let sc = Q(g, L);
      if (ints[ints.length - 1] < 0) { ints = ints.map((x) => -x); sc = sc.neg(); }
      scalar = scalar.mul(sc);
      restTex = '(' + P.tex(ints.map((x) => Q(x)), v) + ')';
    } else {
      scalar = scalar.mul(cur[0]);
    }
    let body = '';
    fac.forEach((f) => {
      const lt = f.u === 0 ? (f.w === 1 ? v : f.w + v) : (f.w === 1 ? v : f.w + v) + (f.u > 0 ? ' - ' + f.u : ' + ' + (-f.u));
      const t = f.u === 0 ? lt : '(' + lt + ')';
      body += f.m === 1 ? t : t + '^{' + f.m + '}';
    });
    body += restTex;
    if (body === '') return scalar.tex();
    if (scalar.eq(1)) return body;
    if (scalar.eq(-1)) return '-' + body;
    return scalar.tex() + body;
  }

  // 項の図: 点 (k, a_k)
  function termsFig(vals, curveFn, extraPts, w) {
    const K = vals.length;
    const pts = vals.map((q, i) => ({ x: i + 1, y: q.val(), cls: 'c1' }));
    const ys = vals.map((q) => q.val()).concat((extraPts || []).map((p) => p.y));
    let lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
    if (!isFinite(lo) || !isFinite(hi)) { lo = -1; hi = 1; }
    const pad = Math.max((hi - lo) * 0.15, 0.5);
    const o = { w: w || 340, h: 240, x: [0, K + 1], y: [Math.min(lo, 0) - pad, hi + pad], points: pts.concat(extraPts || []), axis: ['n', 'a'] };
    if (curveFn) o.curves = [{ f: curveFn, cls: 'c2', dash: true }];
    if (extraPts && extraPts.length) o.labels = [{ x: 0.3, y: Math.min(lo, 0) - pad + (hi + pad - Math.min(lo, 0) + pad) * 0.93, text: '青: 各項　紫: 部分和', cls: 'dim' }];
    return JK.plot.graph(o);
  }

  /* ================= 1. 等差数列 ================= */

  JK.registerCalc({
    id: 'iib-arith',
    course: 'IIB',
    unit: 'm-seq',
    group: '数列',
    title: '等差数列（一般項・和）',
    desc: R`初項 $a$・公差 $d$ から、一般項 $a_{n} = a + (n-1)d$、第 $N$ 項、初項から第 $N$ 項までの和 $S_{N}$ を求めます。和の $n$ の式（$n$ の 2 次式）も示します。`,
    form: [R`a_{n} = a + (n-1)d`, R`S_{n} = \frac{n(a + a_{n})}{2} = \frac{n\{2a + (n-1)d\}}{2}`],
    inputs: [
      { key: 'a', label: R`初項 $a$`, type: 'q', def: '3' },
      { key: 'd', label: R`公差 $d$`, type: 'q', def: '4' },
      { key: 'n', label: R`$N$（第 $N$ 項・第 $N$ 項までの和）`, type: 'int', def: '10', min: 1, max: 1000 }
    ],
    examples: [
      { label: '3, 7, 11, …（N=10）', v: { a: '3', d: '4', n: '10' } },
      { label: '公差が負', v: { a: '50', d: '-3', n: '15' } },
      { label: '分数の公差', v: { a: '1/2', d: '1/3', n: '12' } },
      { label: '公差 0（定数列）', v: { a: '5', d: '0', n: '8' } },
      { label: '初項 1・公差 1（1 から N の和）', v: { a: '1', d: '1', n: '100' } }
    ],
    intro: {
      easy: R`**等差数列**は、となり合う項の差がいつも同じ数列です（たとえば $3,\ 7,\ 11,\ 15,\ \cdots$ はいつも $4$ ずつ増えます）。この一定の差を**公差** $d$、最初の項を**初項** $a$ といいます。
$n$ 番目の項（**一般項**）は、初項から公差を $(n-1)$ 回足せば得られるので、$a_{n} = a + (n-1)d$ です。「$n$ 番目まで進むのに、一歩は $n-1$ 回」というのがポイントです。
最初から $n$ 番目までの**和** $S_{n}$ は、「初項と末項の平均 × 項数」と考えて $S_{n} = \frac{n(a + a_{n})}{2}$ で求められます。数列を逆順に並べて足すと、どの組も同じ和になる、というガウスの考え方です。`,
      normal: R`$a_{n} = a + (n-1)d$、$S_{n} = \frac{n(a + a_{n})}{2} = \frac{n\{2a + (n-1)d\}}{2}$。公差は $d = a_{n+1} - a_{n}$。3 数 $x, y, z$ が等差なら $2y = x + z$。`,
      pro: R`$a_{n}$ は $n$ の 1 次式、$S_{n}$ は $n$ の 2 次式（定数項なし）です。$S_{n}$ を最大にする $n$ は、$a_{n}$ が正から負へ変わる所を見ます。$a_{p}$ と $a_{q}$ が分かれば $d = \frac{a_{q} - a_{p}}{q - p}$ で公差が出せます。`
    },
    compute(v) {
      const a = v.a, d = v.d, N = v.n;
      const an = P.of([a.sub(d), d]);
      const aN = a.add(d.mul(N - 1));
      const SN = Q(N).mul(a.mul(2).add(d.mul(N - 1))).div(2);
      const Spoly = P.of([Q(0), a.sub(d.div(2)), d.div(2)]);
      const K = Math.min(N, 12);
      const vals = [];
      for (let k = 1; k <= K; k++) vals.push(a.add(d.mul(k - 1)));
      const first5 = [];
      for (let k = 1; k <= 5; k++) first5.push(a.add(d.mul(k - 1)));
      const steps = [];
      steps.push({
        t: '等差数列とは',
        m: [R`a_{n+1} - a_{n} = d\ \ (\text{一定})`, listTex(first5)],
        n: R`となり合う項の差が一定（公差 $d = ` + d.tex() + R`$）の数列を等差数列といいます。初項は $a = ` + a.tex() + R`$ です。`,
        easy: R`階段を一定の高さずつ上っていくイメージです。1 段目の高さが $a$、1 段ごとに $d$ ずつ高くなる（$d$ が負なら低くなる）と考えます。たとえば $` + first5.slice(0, 4).map((q) => q.tex()).join(',\\ ') + R`,\ \cdots$ はいつも $` + d.tex() + R`$ ずつ変わります。`,
        lv: 3
      });
      steps.push({
        t: '一般項の公式',
        m: [R`a_{1} = a,\quad a_{2} = a + d,\quad a_{3} = a + 2d,\quad \cdots`, R`a_{n} = a + (n-1)d`],
        n: R`$n$ 番目の項は、初項 $a$ に公差 $d$ を $(n-1)$ 回足したものです。`,
        easy: R`2 番目の項は $d$ を 1 回、3 番目は 2 回、…と足しているので、$n$ 番目の項では $d$ を $(n-1)$ 回足します。「回数は番号より 1 少ない」と覚えます。`,
        pro: R`$a_{n} = dn + (a - d)$ と $n$ の 1 次式の形に直しておくと、グラフ（直線上の点列）として扱えます。`
      });
      steps.push({
        t: '一般項を求める',
        m: [R`a_{n} = ` + a.tex() + ' + (n - 1) \\cdot ' + parQ(d), R`a_{n} = ` + ptn(an)],
        n: R`$a = ` + a.tex() + R`,\ d = ` + d.tex() + R`$ を代入して $n$ について整理します。`,
        easy: R`初項と公差を公式 $a_{n} = a + (n-1)d$ に入れて、かっこをはずします。$(n-1)d = dn - d$ なので、$a_{n} = dn + (a - d)$ という「$n$ の 1 次式」になります。`,
        pro: R`整理した $a_{n} = ` + ptn(an) + R`$ に $n=1$ を入れて、初項 $` + a.tex() + R`$ になるか確かめると検算になります。`
      });
      steps.push({
        t: R`第 $` + N + R`$ 項`,
        m: [R`a_{` + N + R`} = ` + a.tex() + ' + (' + N + R` - 1) \cdot ` + parQ(d) + ' = ' + aN.tex()],
        n: R`$n = ` + N + R`$ を一般項に代入します。`,
        easy: R`番号 $` + N + R`$ を $n$ に入れます。$(n-1)$ は $` + (N - 1) + R`$ になるので、公差を $` + (N - 1) + R`$ 回足した値です。`
      });
      steps.push({
        t: '和の公式（なぜ成り立つか）',
        m: [R`S_{n} = a_{1} + a_{2} + \cdots + a_{n}`, R`S_{n} = a_{n} + a_{n-1} + \cdots + a_{1}\quad (\text{逆順})`, R`2S_{n} = n(a_{1} + a_{n}) \;\Rightarrow\; S_{n} = \frac{n(a_{1} + a_{n})}{2}`],
        n: R`和 $S_{n}$ を順に並べたものと逆順に並べたものを縦に足すと、どの組も $a_{1} + a_{n}$ になり、それが $n$ 組できます。`,
        easy: R`たとえば $1+2+3+4+5$ を、$5+4+3+2+1$ と縦に足すと、どの組も $6$ で、$5$ 組あるので $30$。これは求めたい和の 2 倍なので、答えは $15$ です。等差数列では、初項と末項の組、2 番目と末項の 1 つ前の組、…がいつも同じ和になるので、この方法が使えます。`,
        lv: 3
      });
      steps.push({
        t: R`第 $` + N + R`$ 項までの和 $S_{` + N + R`}$`,
        m: [R`S_{` + N + R`} = \frac{n(a + a_{n})}{2} = \frac{` + N + R` \times (` + a.tex() + ' + ' + parQ(aN) + R`)}{2} = ` + SN.tex(), R`S_{n} = \frac{n\{2a + (n-1)d\}}{2} = ` + ptn(Spoly)],
        n: R`初項 $` + a.tex() + R`$ と末項 $a_{` + N + R`} = ` + aN.tex() + R`$ の平均 $` + a.add(aN).div(2).tex() + R`$ に項数 $` + N + R`$ をかけて、和は $` + SN.tex() + R`$ です。`,
        easy: R`「初項と末項の平均」に「項数」をかけると和になります。平均が $` + a.add(aN).div(2).tex() + R`$、項数が $` + N + R`$ ですから、かけ算して $` + SN.tex() + R`$ です。`,
        pro: R`$S_{n}$ を $n$ の式にすると $` + ptn(Spoly) + R`$。定数項が $0$ になるのは $S_{0} = 0$ だからです。`
      });
      if (N <= 12) {
        steps.push({
          t: '直接足して確かめる',
          m: [vals.map((q) => q.tex()).join(' + ') + ' = ' + vals.reduce((s, q) => s.add(q), Q(0)).tex()],
          n: R`項を実際に足し合わせても、公式の値 $` + SN.tex() + R`$ と一致します。`,
          easy: R`公式を使わずに、並んだ数をそのまま足した答えと比べます。一致すれば、公式の使い方や計算が合っていると分かります。`,
          lv: 2
        });
      } else {
        steps.push({
          t: '最初の数項で確かめる',
          m: [R`a_{1}, a_{2}, \cdots = ` + listTex(first5), R`S_{5} = ` + first5.reduce((s, q) => s.add(q), Q(0)).tex() + R` = \frac{5 \cdot (2 \cdot ` + a.tex() + R` + 4 \cdot ` + parQ(d) + R`)}{2}`],
          n: R`$N$ が大きいので、最初の 5 項の和 $S_{5}$ で、一般項と和の公式が合っているか確かめます。`,
          easy: R`大きな項数を全部足すのは大変なので、最初の 5 項だけ公式と比べます。ここで合えば、同じ公式で $N=` + N + R`$ でも正しいと考えられます。`,
          lv: 2
        });
      }
      return {
        result: [
          { label: '一般項 a_n', tex: R`a_{n} = ` + ptn(an) },
          { label: '第 ' + N + ' 項', tex: R`a_{` + N + R`} = ` + aN.tex() },
          { label: '和 S_n（n の式）', tex: R`S_{n} = ` + ptn(Spoly) },
          { label: '第 ' + N + ' 項までの和', tex: R`S_{` + N + R`} = ` + SN.tex() }
        ],
        steps: steps,
        fig: termsFig(vals, (x) => a.val() + (x - 1) * d.val(), null)
      };
    }
  });

  /* ================= 2. 等比数列 ================= */

  JK.registerCalc({
    id: 'iib-geom',
    course: 'IIB',
    unit: 'm-seq',
    group: '数列',
    title: '等比数列（一般項・和）',
    desc: R`初項 $a$・公比 $r$ から、一般項 $a_{n} = ar^{n-1}$、第 $N$ 項、初項から第 $N$ 項までの和 $S_{N}$ を求めます。$r = 1$ のときの場合分けも説明します。`,
    form: [R`a_{n} = ar^{n-1}`, R`S_{n} = \frac{a(r^{n} - 1)}{r - 1}\ (r \ne 1),\qquad S_{n} = na\ (r = 1)`],
    inputs: [
      { key: 'a', label: R`初項 $a$`, type: 'q', def: '2' },
      { key: 'r', label: R`公比 $r$`, type: 'q', def: '3' },
      { key: 'n', label: R`$N$（第 $N$ 項・第 $N$ 項までの和）`, type: 'int', def: '6', min: 1, max: 30 }
    ],
    examples: [
      { label: '2, 6, 18, …（N=6）', v: { a: '2', r: '3', n: '6' } },
      { label: '公比が負', v: { a: '1', r: '-2', n: '8' } },
      { label: '公比が分数', v: { a: '81', r: '1/3', n: '5' } },
      { label: 'r = 1（定数列）', v: { a: '4', r: '1', n: '7' } },
      { label: '公比 −1', v: { a: '3', r: '-1', n: '9' } }
    ],
    intro: {
      easy: R`**等比数列**は、となり合う項の比がいつも同じ数列です（たとえば $2,\ 6,\ 18,\ 54,\ \cdots$ はいつも $3$ 倍になります）。この一定の比を**公比** $r$、最初の項を**初項** $a$ といいます。
$n$ 番目の項は、初項に公比を $(n-1)$ 回かけたものなので、$a_{n} = ar^{n-1}$ です。等差数列の「足す」が、等比数列では「かける」に変わっただけです。
和 $S_{n}$ は、$S_{n}$ と $rS_{n}$ を並べて引き算するとほとんどの項が消える、というトリックで求めます。結果は $r \ne 1$ なら $S_{n} = \frac{a(r^{n}-1)}{r-1}$、$r = 1$ なら $S_{n} = na$ です。`,
      normal: R`$a_{n} = ar^{n-1}$、$r \ne 1$ のとき $S_{n} = \frac{a(r^{n}-1)}{r-1} = \frac{a(1-r^{n})}{1-r}$、$r = 1$ のとき $S_{n} = na$。公比は $r = \frac{a_{n+1}}{a_{n}}$。3 数 $x, y, z$ が等比なら $y^{2} = xz$。`,
      pro: R`$r \ne 1$ か $r = 1$ かの場合分けを忘れないこと（文字の公比が出る問題の定番）。$|r|>1$ なら $\frac{a(r^{n}-1)}{r-1}$、$|r|<1$ なら $\frac{a(1-r^{n})}{1-r}$ と使い分けると計算が楽です。`
    },
    compute(v) {
      const a = v.a, r = v.r, N = v.n;
      if (a.isZero()) throw new JK.CalcError('初項 a は 0 以外を入力してください（すべての項が 0 になります）');
      if (r.isZero()) throw new JK.CalcError('公比 r は 0 以外を入力してください（等比数列の公比は 0 になりません）');
      const aN = a.mul(r.pow(N - 1));
      const one = r.eq(1);
      const SN = one ? a.mul(N) : a.mul(r.pow(N).sub(1)).div(r.sub(1));
      const first5 = [];
      for (let k = 1; k <= 5; k++) first5.push(a.mul(r.pow(k - 1)));
      const K = Math.min(N, 10);
      const vals = [];
      for (let k = 1; k <= K; k++) vals.push(a.mul(r.pow(k - 1)));
      const coef = a.eq(1) ? '' : (a.eq(-1) ? '-' : a.tex() + R` \cdot `);
      const anTex = coef + powTex(r, 'n-1');
      const small = r.abs().cmp(1) < 0;
      const steps = [];
      steps.push({
        t: '等比数列とは',
        m: [R`\frac{a_{n+1}}{a_{n}} = r\ \ (\text{一定})`, listTex(first5)],
        n: R`となり合う項の比が一定（公比 $r = ` + r.tex() + R`$）の数列を等比数列といいます。初項は $a = ` + a.tex() + R`$ です。`,
        easy: R`コピー機で同じ倍率の拡大（縮小）を繰り返すイメージです。1 回ごとに $r$ 倍になります。たとえば $` + first5.slice(0, 4).map((q) => q.tex()).join(',\\ ') + R`,\ \cdots$ は、いつも $` + r.tex() + R`$ 倍です。$r$ が負なら符号が交互に入れ替わり、$|r| < 1$ なら小さくなっていきます。`,
        lv: 3
      });
      steps.push({
        t: '一般項の公式',
        m: [R`a_{1} = a,\quad a_{2} = ar,\quad a_{3} = ar^{2},\quad \cdots`, R`a_{n} = ar^{n-1}`],
        n: R`$n$ 番目の項は、初項 $a$ に公比 $r$ を $(n-1)$ 回かけたものです。`,
        easy: R`2 番目の項は $r$ を 1 回、3 番目は 2 回かけているので、$n$ 番目では $(n-1)$ 回かけます。$r$ を $(n-1)$ 回かけたものが $r^{n-1}$ です。`,
        pro: R`$a_{n} = \frac{a}{r} \cdot r^{n}$ とも書けます。指数が $n-1$ か $n$ か取り違えやすいので、$n=1$ で初項になるか確かめます。`
      });
      steps.push({
        t: '一般項を求める',
        m: [R`a_{n} = ` + a.tex() + R` \cdot ` + powTex(r, 'n-1'), R`a_{n} = ` + anTex],
        n: R`$a = ` + a.tex() + R`,\ r = ` + r.tex() + R`$ を $a_{n} = ar^{n-1}$ に代入します。`,
        easy: R`初項と公比を公式に入れるだけです。負の公比や分数の公比には、かっこをつけて書きます（$(-2)^{n-1}$ のように）。`,
        pro: R`$n=1$ を代入して $a_{1} = ` + a.tex() + R`$ になることを確かめておくと安心です。`
      });
      steps.push({
        t: R`第 $` + N + R`$ 項`,
        m: [R`a_{` + N + R`} = ` + a.tex() + R` \cdot ` + powTex(r, String(N - 1)) + ' = ' + a.tex() + R` \cdot ` + parQ(r.pow(N - 1)) + ' = ' + aN.tex()],
        n: R`$n = ` + N + R`$ を代入して、$r^{` + (N - 1) + R`}$ を計算してから初項をかけます。`,
        easy: R`番号 $` + N + R`$ なので、公比を $` + (N - 1) + R`$ 回かけます。累乗の計算は、符号（負の数の奇数乗は負）に気をつけましょう。`
      });
      steps.push({
        t: '和の公式のつくり方',
        m: [
          R`S_{n} = a + ar + ar^{2} + \cdots + ar^{n-1}`,
          R`rS_{n} = ar + ar^{2} + \cdots + ar^{n-1} + ar^{n}`,
          R`S_{n} - rS_{n} = a - ar^{n} \;\Rightarrow\; (1 - r)S_{n} = a(1 - r^{n})`,
          R`S_{n} = \frac{a(1 - r^{n})}{1 - r} = \frac{a(r^{n} - 1)}{r - 1}\quad (r \ne 1)`,
          R`r = 1\ \text{のとき}\ S_{n} = a + a + \cdots + a = na`
        ],
        n: R`$S_{n}$ に $r$ をかけた $rS_{n}$ を作って引くと、間の項がすべて消えて、最初の $a$ と最後の $ar^{n}$ だけが残ります。$r = 1$ のときは $1 - r = 0$ で割れないので、別扱いにします（全部 $a$ を $n$ 個足すので $na$）。`,
        easy: R`長い和を、「$r$ 倍してずらしたもの」との引き算でほとんど消してしまう、というアイデアです。たとえば $S = 1 + 2 + 4 + 8$ なら、$2S = 2 + 4 + 8 + 16$ と引き算して $S - 2S = 1 - 16$、つまり $S = 15$ です。$r=1$ のときだけは引いても 0 になって使えないので、$na$ で別に考えます。`,
        lv: 3
      });
      steps.push({
        t: R`第 $` + N + R`$ 項までの和 $S_{` + N + R`}$`,
        m: one
          ? [R`r = 1 \;\Rightarrow\; S_{` + N + R`} = n a = ` + N + R` \times ` + a.tex() + ' = ' + SN.tex()]
          : [
            R`S_{` + N + R`} = ` + (small ? R`\frac{a(1 - r^{n})}{1 - r} = \frac{` + a.tex() + R`(1 - ` + powTex(r, String(N)) + R`)}{1 - ` + parQ(r) + '}' : R`\frac{a(r^{n} - 1)}{r - 1} = \frac{` + a.tex() + '(' + powTex(r, String(N)) + R` - 1)}{` + parQ(r) + R` - 1}`),
            R`= \frac{` + a.tex() + R` \cdot ` + parQ(small ? Q(1).sub(r.pow(N)) : r.pow(N).sub(1)) + '}{' + parQ(small ? Q(1).sub(r) : r.sub(1)) + '} = ' + SN.tex()
          ],
        n: one ? R`$r = 1$ なので、すべての項が $a = ` + a.tex() + R`$ です。$` + N + R`$ 個の和は $` + SN.tex() + R`$ です。` : R`$r^{` + N + R`} = ` + r.pow(N).tex() + R`$ を計算して公式に代入します。$|r|` + (small ? '<' : '>') + R` 1$ なので、分母・分子が正になりやすい形を選びました。`,
        easy: one ? R`公比が $1$ ならすべて同じ数の繰り返しなので、「その数 × 個数」です。` : R`公式の $r^{n}$ に $r^{` + N + R`} = ` + r.pow(N).tex() + R`$ を入れ、引き算・割り算をします。分数が出るときは通分や約分を丁寧に行います。`,
        pro: one ? R`$r=1$ は公式が使えない例外です。` : R`$|r| > 1$ なら $\frac{a(r^{n}-1)}{r-1}$、$|r| < 1$ なら $\frac{a(1-r^{n})}{1-r}$ が計算しやすいです。`
      });
      const M = Math.min(N, 10);
      const dsum = vals.reduce((s, q) => s.add(q), Q(0));
      const fsum = one ? a.mul(M) : a.mul(r.pow(M).sub(1)).div(r.sub(1));
      steps.push({
        t: '直接足して確かめる',
        m: [R`\text{直接: } S_{` + M + R`} = ` + vals.map((q) => q.tex()).join(' + ') + ' = ' + dsum.tex(), R`\text{公式: } S_{` + M + R`} = ` + fsum.tex()],
        n: (N > 10 ? R`$N$ が大きいので、最初の 10 項までで確かめます。` : '') + R`項を実際に足し合わせた値と公式の値が一致します。`,
        easy: R`公式の結果が正しいか、並んだ数を順に足して確かめます。一致しないときは、$r^{n}$ の計算や符号を見直します。`,
        lv: 2
      });
      return {
        result: [
          { label: '一般項 a_n', tex: R`a_{n} = ` + anTex },
          { label: '第 ' + N + ' 項', tex: R`a_{` + N + R`} = ` + aN.tex() },
          { label: '第 ' + N + ' 項までの和', tex: R`S_{` + N + R`} = ` + SN.tex() },
          { label: '和の公式', tex: one ? R`S_{n} = ` + a.tex() + 'n' : R`S_{n} = \frac{` + a.tex() + R`(` + powTex(r, 'n') + R` - 1)}{` + parQ(r) + R` - 1}` }
        ],
        steps: steps,
        fig: termsFig(vals, null, null)
      };
    }
  });

  /* ================= 3. シグマ（和の記号） ================= */

  JK.registerCalc({
    id: 'iib-sigma',
    course: 'IIB',
    unit: 'm-seq',
    group: '数列',
    title: '和の記号 Σ の計算',
    desc: R`$\sum_{k=1}^{n}(dk^{3} + ak^{2} + bk + c)$ を、$\sum k,\ \sum k^{2},\ \sum k^{3}$ の公式で求めます。$n$ に数を入れた値と、$n$ の式のまま（展開形と因数分解形）の両方に対応します。`,
    form: [R`\sum_{k=1}^{n} 1 = n,\qquad \sum_{k=1}^{n} k = \frac{1}{2}n(n+1)`, R`\sum_{k=1}^{n} k^{2} = \frac{1}{6}n(n+1)(2n+1),\qquad \sum_{k=1}^{n} k^{3} = \left\{\frac{1}{2}n(n+1)\right\}^{2}`],
    inputs: [
      { key: 'mode', label: '求め方', type: 'select', def: 'sym', options: [['sym', 'n の式のまま（展開・因数分解）'], ['num', 'n に数を入れる']] },
      { key: 'a', label: R`$k^{2}$ の係数 $a$`, type: 'q', def: '3' },
      { key: 'b', label: R`$k$ の係数 $b$`, type: 'q', def: '2' },
      { key: 'c', label: R`定数項 $c$`, type: 'q', def: '1' },
      { key: 'd', label: R`$k^{3}$ の係数 $d$（なければ 0）`, type: 'q', def: '0' },
      { key: 'n', label: R`項数 $n$`, type: 'int', def: '10', min: 1, max: 1000, show: (r) => r.mode === 'num' }
    ],
    examples: [
      { label: 'Σ(3k²+2k+1) を n の式で', v: { mode: 'sym', a: '3', b: '2', c: '1', d: '0' } },
      { label: 'Σk² の公式（因数分解形）', v: { mode: 'sym', a: '1', b: '0', c: '0', d: '0' } },
      { label: 'Σ(2k−1)（奇数の和）', v: { mode: 'sym', a: '0', b: '2', c: '-1', d: '0' } },
      { label: 'n=10 の値', v: { mode: 'num', a: '3', b: '2', c: '1', d: '0', n: '10' } },
      { label: 'k³ を含む', v: { mode: 'sym', a: '1', b: '-1', c: '0', d: '1' } },
      { label: '分数係数・n=6', v: { mode: 'num', a: '1/2', b: '-3', c: '2', d: '0', n: '6' } }
    ],
    intro: {
      easy: R`$\sum$（シグマ）は「足し合わせる」という意味の記号で、$\sum_{k=1}^{n} a_{k}$ は $a_{1} + a_{2} + \cdots + a_{n}$ のことです。$k$ に $1$ から $n$ まで順に入れた式を、すべて足します。
$k$ の式（$k^{2}$ や $k$ や定数）の和には、次の公式があります。$\sum 1 = n$、$\sum k = \frac{1}{2}n(n+1)$、$\sum k^{2} = \frac{1}{6}n(n+1)(2n+1)$、$\sum k^{3} = \left\{\frac{1}{2}n(n+1)\right\}^{2}$。
$\sum(ak^{2} + bk + c)$ は、$a\sum k^{2} + b\sum k + c\sum 1$ とバラして、公式に当てはめるだけです。定数 $a, b, c$ は $\sum$ の外に出せます。`,
      normal: R`$\sum_{k=1}^{n}(pa_{k} + qb_{k}) = p\sum a_{k} + q\sum b_{k}$（線形性）。公式に代入して通分し、$n$ でくくって因数分解します。$n$ に数を入れるときは、各 $\sum$ の値を先に計算します。`,
      pro: R`答えは因数分解した形（$\frac{1}{6}n(n+1)(2n+1)$ など）で書くと検算・約分がしやすくなります。$\sum_{k=1}^{n} k(k+1)$ のように積の形は展開してから公式を使います。階差型の漸化式 $a_{n+1}-a_{n}=f(n)$ や、群数列でも $\sum k^{2}$ が頻出です。`
    },
    compute(v) {
      const mode = String(v.mode);
      const a = v.a, b = v.b, c = v.c, d = v.d;
      const coefs = [c, b, a, d];                                // Σk^0, Σk^1, Σk^2, Σk^3 の係数
      let S = [Q(0)];
      for (let j = 0; j < 4; j++) S = P.add(S, P.scale(PS[j], coefs[j]));
      const summand = P.tex([c, b, a, d], 'k');
      const hasAny = coefs.some((x) => !x.isZero());
      if (!hasAny) throw new JK.CalcError('係数がすべて 0 です。どれか 1 つは 0 以外を入力してください');
      const steps = [];
      steps.push({
        t: 'Σ（シグマ）の意味',
        m: [R`\sum_{k=1}^{n} a_{k} = a_{1} + a_{2} + \cdots + a_{n}`, R`\sum_{k=1}^{4} k^{2} = 1^{2} + 2^{2} + 3^{2} + 4^{2} = 1 + 4 + 9 + 16 = 30`],
        n: R`$\sum_{k=1}^{n}$ は、$k$ を $1$ から $n$ まで $1$ ずつ増やしながら、式の値をすべて足す、という記号です。`,
        easy: R`「$k$ に $1,\ 2,\ 3,\ \cdots,\ n$ を順に入れて、全部足しなさい」という命令です。$k$ は足し算を数える番号のようなもので、答えには残りません。たとえば $\sum_{k=1}^{4} k^{2}$ は $1+4+9+16=30$ です。`,
        lv: 3
      });
      steps.push({
        t: '和の公式',
        m: [R`\sum_{k=1}^{n} 1 = n`, R`\sum_{k=1}^{n} k = \frac{1}{2}n(n+1)`, R`\sum_{k=1}^{n} k^{2} = \frac{1}{6}n(n+1)(2n+1)`, R`\sum_{k=1}^{n} k^{3} = \left\{\frac{1}{2}n(n+1)\right\}^{2}`],
        n: R`この 4 つが基本公式です。$\sum 1$ は「1 を $n$ 個足す」ので $n$ です。`,
        easy: R`$\sum k$ は $1+2+\cdots+n$ のこと。$1$ と $n$、$2$ と $n-1$、…と両端から組にすると、どの組も和が $n+1$ で、組が $\frac{n}{2}$ 個できるので $\frac{n(n+1)}{2}$ です。$k^{2}$ と $k^{3}$ の公式は、証明は少し大変なので、形をそのまま覚えて使います。`,
        pro: R`$\sum k^{2}$ の公式は、$n(n+1)(2n+1)$ を 6 で割る、と声に出して覚えます。$n=1$ を入れて $1$ になるか確かめるのが検算です。`
      });
      steps.push({
        t: '係数を外に出して、公式に当てはめる',
        m: [R`\sum_{k=1}^{n}(` + summand + R`) = ` + lcTerms([[d, R`\sum k^{3}`], [a, R`\sum k^{2}`], [b, R`\sum k`], [c, R`\sum 1`]])],
        n: R`$\sum$ は足し算なので、項ごとに分けて計算でき、定数倍は $\sum$ の外に出せます（線形性）。`,
        easy: R`足し算は項ごとにバラせます。たとえば $\sum(3k^{2}+2k+1)$ は、$3\sum k^{2} + 2\sum k + \sum 1$ です。数を $\sum$ の外に出して、残った $\sum k^{2}$、$\sum k$、$\sum 1$ に公式を使います。`,
        pro: R`定数 $c$ の和 $\sum c = cn$ を忘れないこと（$c$ を $n$ 個足す）。`
      });
      if (mode === 'num') {
        const n = v.n;
        const sv = [0, 1, 2, 3].map((j) => P.eval(PS[j], Q(n)));
        const total = P.eval(S, Q(n));
        let direct = Q(0);
        for (let k = 1; k <= n; k++) direct = direct.add(P.eval([c, b, a, d], Q(k)));
        steps.push({
          t: R`$n = ` + n + R`$ のときの各和`,
          m: [
            R`\sum_{k=1}^{` + n + R`} 1 = ` + n,
            R`\sum_{k=1}^{` + n + R`} k = \frac{1}{2} \cdot ` + n + R` \cdot ` + (n + 1) + ' = ' + sv[1].tex(),
            R`\sum_{k=1}^{` + n + R`} k^{2} = \frac{1}{6} \cdot ` + n + R` \cdot ` + (n + 1) + R` \cdot ` + (2 * n + 1) + ' = ' + sv[2].tex(),
            R`\sum_{k=1}^{` + n + R`} k^{3} = \left\{\frac{1}{2} \cdot ` + n + R` \cdot ` + (n + 1) + R`\right\}^{2} = ` + sv[3].tex()
          ],
          n: R`公式に $n = ` + n + R`$ を代入して、各和の値を求めます。`,
          easy: R`$n$ の入った公式に $n=` + n + R`$ を入れて、数値で計算します。分数は約分できる（$n(n+1)$ は必ず偶数）ので、先に割れる所から割ると楽です。`
        });
        steps.push({
          t: '係数をかけて合計する',
          m: [R`\sum_{k=1}^{` + n + R`}(` + summand + R`) = ` + lcTerms([[d, sv[3].tex()], [a, sv[2].tex()], [b, sv[1].tex()], [c, sv[0].tex()]]) + ' = ' + total.tex()],
          n: R`各和の値に係数をかけて足します。答えは $` + total.tex() + (total.isInt() ? '' : R` \approx ` + fm(total.val(), 4)) + R`$ です。`,
          easy: R`バラした各部分に、前に出した係数をかけて足します。符号つきの係数や分数の係数は、かっこや通分に気をつけます。`
        });
        steps.push({
          t: '直接足して確かめる',
          m: [n <= 6
            ? vals0(n, a, b, c, d) + ' = ' + direct.tex()
            : R`\sum_{k=1}^{` + n + R`}(` + summand + R`) = ` + direct.tex() + R`\quad (\text{各項を計算機で全部足した値})`],
          n: R`公式を使わず、$k=1$ から $k=` + n + R`$ までの各項を全部足しても $` + direct.tex() + R`$ で、公式の結果と一致します。`,
          easy: R`公式の答えが正しいか、実際に 1 つずつ足して確かめた結果です。一致すれば、公式の使い方も計算も合っています。`,
          lv: 2
        });
        const K = Math.min(n, 12);
        const tv = [], sp = [];
        let run = Q(0);
        for (let k = 1; k <= K; k++) { const t = P.eval([c, b, a, d], Q(k)); run = run.add(t); tv.push(t); sp.push({ x: k, y: run.val(), cls: 'c2' }); }
        const fig = termsFig(tv, null, sp);
        return {
          result: [
            { label: '値', tex: R`\sum_{k=1}^{` + n + R`}(` + summand + R`) = ` + total.tex() + (total.isInt() ? '' : R` \approx ` + fm(total.val(), 4)) },
            { label: 'n の式（参考）', tex: R`S_{n} = ` + ptn(S) },
            { label: '因数分解', tex: R`S_{n} = ` + factorTex(S, 'n') }
          ],
          steps: steps,
          fig: fig
        };
      }
      // n の式
      const comb = lcTerms([[d, PSF[3]], [a, PSF[2]], [b, PSF[1]], [c, PSF[0]]]);
      steps.push({
        t: '公式を代入する',
        m: [R`\sum_{k=1}^{n}(` + summand + R`) = ` + comb],
        n: R`$\sum k^{2},\ \sum k,\ \sum 1$（と $\sum k^{3}$）に公式を入れます。`,
        easy: R`先ほどの公式を、そのまま当てはめます。係数をかけた形のまま、まだ整理しません。次に展開して通分します。`
      });
      const S0 = S;
      steps.push({
        t: '展開して整理する',
        m: [R`S_{n} = ` + ptn(S0)],
        n: R`すべての項を展開して、$n$ の降べきの順に整理します。分数の係数は通分して足します。`,
        easy: R`かっこを開いて、同じ次数の項どうしをまとめます。分数の係数は通分（分母をそろえる）してから足し算します。展開が終わったら、$n$ の 3 次式（または 4 次式）の形になっているはずです。`
      });
      const ft = factorTex(S0, 'n');
      steps.push({
        t: '因数分解した形にする',
        m: [R`S_{n} = ` + ft],
        n: R`共通因数の $n$ でくくり、残りの式が因数分解できるかを調べます。有理数の根があれば、$(n+1)$ のような因数が出ます。`,
        easy: R`答えは「展開した形」でも「因数分解した形」でも正解ですが、因数分解した形のほうが、$n$ に数を入れたときに計算しやすく、検算もしやすいです。まず共通因数 $n$ をくくり出し、残りが因数分解できるか考えます。`,
        pro: R`$\sum k^{2}$ のように、結果が $\frac{1}{6}n(n+1)(2n+1)$ の形になるかどうかを見ると、計算ミスにすぐ気づけます。`
      });
      const chkN = 3;
      let direct = Q(0);
      for (let k = 1; k <= chkN; k++) direct = direct.add(P.eval([c, b, a, d], Q(k)));
      steps.push({
        t: R`$n = ` + chkN + R`$ で確かめる`,
        m: [R`\text{直接: } ` + vals0(chkN, a, b, c, d) + ' = ' + direct.tex(), R`\text{公式: } S_{` + chkN + R`} = ` + P.eval(S0, Q(chkN)).tex()],
        n: R`小さい $n$（ここでは $3$）で、直接足した値と公式の値を比べると、整理の計算ミスを見つけられます。`,
        easy: R`$n$ の式ができたら、$n=1$ や $n=3$ のような小さい数を入れて、実際に足した値と合うか確かめます。合わなければ、通分や展開を見直します。`,
        lv: 2
      });
      const K = 10;
      const tv = [], sp = [];
      let run = Q(0);
      for (let k = 1; k <= K; k++) { const t = P.eval([c, b, a, d], Q(k)); run = run.add(t); tv.push(t); sp.push({ x: k, y: run.val(), cls: 'c2' }); }
      return {
        result: [
          { label: '展開した形', tex: R`S_{n} = ` + ptn(S0) },
          { label: '因数分解した形', tex: R`S_{n} = ` + ft },
          { label: 'n = 10 のとき', tex: R`S_{10} = ` + P.eval(S0, Q(10)).tex() }
        ],
        steps: steps,
        fig: termsFig(tv, null, sp)
      };
    }
  });
  // k = 1..n（n ≦ 6）の各項を並べた足し算の TeX
  function vals0(n, a, b, c, d) {
    const out = [];
    for (let k = 1; k <= n; k++) out.push(P.eval([c, b, a, d], Q(k)).tex());
    return out.join(' + ');
  }

  /* ================= 4. 漸化式 ================= */

  JK.registerCalc({
    id: 'iib-recur',
    course: 'IIB',
    unit: 'm-seq',
    group: '数列',
    title: '漸化式（等差型・等比型・pa+q 型・階差型）',
    desc: R`漸化式の型を選んで一般項を求めます。$a_{n+1} = pa_{n} + q$ 型は特性方程式 $\alpha = p\alpha + q$ を使って等比数列に直し、階差型は $\sum$ の公式で解きます。最初の 5 項で検算します。`,
    form: [R`a_{n+1} = a_{n} + d,\quad a_{n+1} = ra_{n},\quad a_{n+1} = pa_{n} + q,\quad a_{n+1} = a_{n} + f(n)`],
    inputs: [
      { key: 'type', label: '漸化式の型', type: 'select', def: 'lin', options: [['arith', '等差型  a(n+1) = a(n) + d'], ['geom', '等比型  a(n+1) = r・a(n)'], ['lin', 'a(n+1) = p・a(n) + q 型'], ['diff', '階差型  a(n+1) = a(n) + f(n)']] },
      { key: 'a1', label: R`初項 $a_{1}$`, type: 'q', def: '1' },
      { key: 'd', label: R`公差 $d$`, type: 'q', def: '3', show: (r) => r.type === 'arith' },
      { key: 'r', label: R`公比 $r$`, type: 'q', def: '2', show: (r) => r.type === 'geom' },
      { key: 'p', label: R`$p$（$a_{n}$ の係数）`, type: 'q', def: '2', show: (r) => r.type === 'lin' },
      { key: 'q', label: R`$q$（定数項）`, type: 'q', def: '3', show: (r) => r.type === 'lin' },
      { key: 'f', label: R`階差 $f(n)$（$n$ の式、3 次まで）`, type: 'poly', 'var': 'n', def: '2n + 1', show: (r) => r.type === 'diff' },
      { key: 'nn', label: R`第 $N$ 項の $N$`, type: 'int', def: '10', min: 1, max: 60 }
    ],
    examples: [
      { label: 'a(n+1) = 2a(n) + 3', v: { type: 'lin', a1: '1', p: '2', q: '3', nn: '10' } },
      { label: 'a(n+1) = −a(n)/2 + 3', v: { type: 'lin', a1: '4', p: '-1/2', q: '3', nn: '8' } },
      { label: '等差型', v: { type: 'arith', a1: '5', d: '-2', nn: '12' } },
      { label: '等比型', v: { type: 'geom', a1: '3', r: '2', nn: '10' } },
      { label: '階差型 f(n)=2n+1', v: { type: 'diff', a1: '1', f: '2n + 1', nn: '10' } },
      { label: '階差型（2 次）', v: { type: 'diff', a1: '2', f: 'n^2 - n', nn: '8' } },
      { label: 'p = 1（等差型になる）', v: { type: 'lin', a1: '2', p: '1', q: '5', nn: '9' } },
      { label: '定数列になる', v: { type: 'lin', a1: '3', p: '2', q: '-3', nn: '7' } }
    ],
    intro: {
      easy: R`**漸化式**は、「となりの項から次の項を作るルール」で数列を決める式です。たとえば $a_{n+1} = 2a_{n} + 3$ は、前の項を 2 倍して 3 を足すと次の項になる、という意味です。初項 $a_{1}$ が分かれば、$a_{2},\ a_{3},\ \cdots$ と順に決まります。でも、100 番目を知りたいときは 99 回計算しないといけません。そこで、$n$ の式で直接表した**一般項**を求めます。
型によって解き方が違います。(1) $a_{n+1} = a_{n} + d$：等差数列。(2) $a_{n+1} = ra_{n}$：等比数列。(3) $a_{n+1} = pa_{n} + q$：**特性方程式** $\alpha = p\alpha + q$ の解 $\alpha$ を使い、$a_{n+1} - \alpha = p(a_{n} - \alpha)$ と変形して等比数列に直す。(4) $a_{n+1} = a_{n} + f(n)$：差 $f(n)$ を足していけば一般項になる（**階差数列**）。`,
      normal: R`$a_{n+1} = pa_{n}+q$ は $\alpha = \frac{q}{1-p}$（$p \ne 1$）として $a_{n}-\alpha = (a_{1}-\alpha)p^{n-1}$。階差型は $n \ge 2$ で $a_{n} = a_{1} + \sum_{k=1}^{n-1} f(k)$、最後に $n=1$ でも成り立つか確認。`,
      pro: R`$p = 1$ なら等差型、$q = 0$ なら等比型です。階差型の結果が $n=1$ でも成り立つかの確認と、$a_{n+1}=pa_{n}+q^{n}$ のような型（両辺を $q^{n+1}$ で割る）も頻出です。解いたあとは $a_{2},\ a_{3}$ で必ず検算します。`
    },
    compute(v) {
      const type = String(v.type), a1 = v.a1, N = v.nn;
      let step;                                   // 漸化式の 1 ステップ
      let closed;                                 // 一般項（Q から Q）
      let closedTex, closedAt, recTex, extraSteps = [], plotFn = null;
      const steps = [];
      if (type === 'arith') {
        const d = v.d;
        step = (x) => x.add(d);
        closed = (n) => a1.add(d.mul(n - 1));
        const an = P.of([a1.sub(d), d]);
        closedTex = R`a_{n} = ` + ptn(an);
        closedAt = (n) => substN(an, Q(n));
        recTex = R`a_{n+1} = a_{n} ` + U.signed(d);
        plotFn = (x) => a1.val() + (x - 1) * d.val();
        extraSteps = [
          { t: '型を見分ける', m: [R`a_{n+1} - a_{n} = ` + d.tex() + R`\ \ (\text{一定})`], n: R`となり合う項の差が一定なので、**等差数列**です（公差 $d = ` + d.tex() + R`$）。`, easy: R`「次の項 − 今の項」がいつも同じ数 $` + d.tex() + R`$ なので、一定の差ずつ変わる等差数列です。`, pro: R`$a_{n+1} - a_{n} = $ 定数 の形は即、等差型と判断します。` },
          { t: '一般項を求める', m: [R`a_{n} = a_{1} + (n-1)d = ` + a1.tex() + ' + (n - 1) \\cdot ' + parQ(d), closedTex], n: R`初項 $a_{1} = ` + a1.tex() + R`$ から公差 $d$ を $(n-1)$ 回足します。`, easy: R`初項に公差を $(n-1)$ 回足すのが等差数列の一般項です（2 番目は 1 回、3 番目は 2 回、…）。` }
        ];
      } else if (type === 'geom') {
        const r = v.r;
        if (r.isZero()) throw new JK.CalcError('公比 r は 0 以外を入力してください（2 項目以降がすべて 0 になります）');
        step = (x) => x.mul(r);
        closed = (n) => a1.mul(r.pow(n - 1));
        const coef = a1.eq(1) ? '' : (a1.eq(-1) ? '-' : a1.tex() + R` \cdot `);
        closedTex = a1.isZero() ? R`a_{n} = 0` : R`a_{n} = ` + coef + powTex(r, 'n-1');
        closedAt = (n) => (a1.isZero() ? '0' : coef + powTex(r, String(n - 1)));
        recTex = R`a_{n+1} = ` + (r.eq(1) ? '' : (r.eq(-1) ? '-' : parQ(r))) + R`a_{n}`;
        extraSteps = [
          { t: '型を見分ける', m: [R`\frac{a_{n+1}}{a_{n}} = ` + r.tex() + R`\ \ (\text{一定})`], n: R`次の項が前の項の一定倍なので、**等比数列**です（公比 $r = ` + r.tex() + R`$）。`, easy: R`「次の項 ÷ 今の項」がいつも同じ数 $` + r.tex() + R`$ なので、一定の倍率で変わる等比数列です。`, pro: R`$a_{n+1} = ra_{n}$ の形は即、等比型と判断します。` },
          { t: '一般項を求める', m: [R`a_{n} = a_{1}r^{n-1} = ` + a1.tex() + R` \cdot ` + powTex(r, 'n-1'), closedTex], n: R`初項 $a_{1} = ` + a1.tex() + R`$ に公比 $r$ を $(n-1)$ 回かけます。`, easy: R`初項に公比を $(n-1)$ 回かけるのが等比数列の一般項です（2 番目は 1 回、3 番目は 2 回、…）。` }
        ];
      } else if (type === 'lin') {
        const p = v.p, q = v.q;
        if (p.isZero()) throw new JK.CalcError('p = 0 のときは a(n+1) = q となり、2 項目以降はすべて q（定数）です。p は 0 以外を入力してください');
        step = (x) => x.mul(p).add(q);
        recTex = R`a_{n+1} = ` + (p.eq(1) ? '' : (p.eq(-1) ? '-' : parQ(p))) + R`a_{n} ` + (q.isZero() ? '' : U.signed(q));
        if (p.eq(1)) {
          closed = (n) => a1.add(q.mul(n - 1));
          const an = P.of([a1.sub(q), q]);
          closedTex = R`a_{n} = ` + ptn(an);
          closedAt = (n) => substN(an, Q(n));
          plotFn = (x) => a1.val() + (x - 1) * q.val();
          extraSteps = [
            { t: 'p = 1 のときは等差型', m: [R`a_{n+1} = a_{n} + ` + q.tex() + R` \;\Rightarrow\; a_{n+1} - a_{n} = ` + q.tex()], n: R`$p = 1$ なので、特性方程式 $\alpha = \alpha + q$ は解をもたず、等差数列（公差 $q = ` + q.tex() + R`$）として解きます。`, easy: R`係数が $1$ のとき、式は $a_{n+1} = a_{n} + q$ となり、毎回 $q$ ずつ増える等差数列になります。特性方程式で解く必要はありません。` },
            { t: '一般項を求める', m: [R`a_{n} = a_{1} + (n-1)q = ` + a1.tex() + R` + (n-1) \cdot ` + parQ(q), closedTex], n: R`等差数列の一般項の公式を使います。`, easy: R`初項に公差 $q$ を $(n-1)$ 回足します。` }
          ];
        } else {
          const al = q.div(Q(1).sub(p));
          const K = a1.sub(al);
          closed = (n) => K.mul(p.pow(n - 1)).add(al);
          const kc = K.eq(1) ? '' : (K.eq(-1) ? '-' : K.tex() + R` \cdot `);
          const tail = al.isZero() ? '' : ' ' + U.signed(al);
          closedTex = K.isZero() ? R`a_{n} = ` + al.tex() : R`a_{n} = ` + kc + powTex(p, 'n-1') + tail;
          closedAt = (n) => (K.isZero() ? al.tex() : kc + powTex(p, String(n - 1)) + tail);
          plotFn = null;
          extraSteps = [
            {
              t: '特性方程式 α = pα + q を解く',
              m: [R`\alpha = p\alpha + q \;\Rightarrow\; \alpha = ` + R`\frac{q}{1 - p} = \frac{` + q.tex() + '}{1 - ' + parQ(p) + '} = ' + al.tex()],
              n: R`漸化式の $a_{n+1}$ と $a_{n}$ を同じ文字 $\alpha$ に置き換えた方程式（特性方程式）を解きます。$\alpha$ は、数列が一定値になるときの値（固定点）です。`,
              easy: R`もし数列がずっと同じ値 $\alpha$ になったら、$a_{n+1} = a_{n} = \alpha$ のはずです。それを漸化式に入れると $\alpha = p\alpha + q$ になります。この方程式の解 $\alpha$ が、次の変形の目印になります（図の 2 本の直線の交点）。`,
              pro: R`$\alpha = \frac{q}{1-p}$ と公式で一発です。$p = 1$ のときは解がない（等差型）ので別扱いです。`
            },
            {
              t: R`$a_{n+1} - \alpha = p(a_{n} - \alpha)$ と変形する`,
              m: [R`a_{n+1} = p\,a_{n} + q`, R`-)\ \ \alpha = p\,\alpha + q`, R`a_{n+1} - \alpha = p\,(a_{n} - \alpha)`],
              n: R`漸化式から特性方程式を引くと、定数項 $q$ が消えて、$a_{n} - \alpha$ が公比 $p$ の等比数列になります。`,
              easy: R`2 つの式を縦に並べて、左辺どうし・右辺どうしを引き算します。すると $q$ が消えて、「$(a_{n+1} - \alpha)$ は $(a_{n} - \alpha)$ の $p$ 倍」という形になります。これは等比数列の漸化式です。`,
              lv: 3
            },
            {
              t: R`$b_{n} = a_{n} - \alpha$ は等比数列`,
              m: [R`b_{n} = a_{n} - (` + al.tex() + R`),\quad b_{1} = ` + a1.tex() + ' - ' + parQ(al) + ' = ' + K.tex(), R`b_{n+1} = ` + parQ(p) + R`\,b_{n} \;\Rightarrow\; b_{n} = ` + K.tex() + R` \cdot ` + powTex(p, 'n-1')],
              n: R`$b_{n} = a_{n} - \alpha$ とおくと、初項 $b_{1} = a_{1} - \alpha = ` + K.tex() + R`$、公比 $p = ` + p.tex() + R`$ の等比数列です。`,
              easy: R`$a_{n} - \alpha$ をひとかたまりの数列 $b_{n}$ と見ると、「次は前の $p$ 倍」の等比数列です。初項は $a_{1}-\alpha$。等比数列の一般項（初項 × 公比の $(n-1)$ 乗）がそのまま使えます。`,
              pro: R`$a_{1} = \alpha$ のときは $b_{1} = 0$ で、数列は定数 $\alpha$ になります。`
            },
            {
              t: '一般項',
              m: [R`a_{n} = b_{n} + \alpha = ` + (K.isZero() ? '0' : K.tex() + R` \cdot ` + powTex(p, 'n-1')) + ' ' + U.signed(al), closedTex],
              n: R`$a_{n} = b_{n} + \alpha$ に戻して、$a_{n}$ の一般項を得ます。`,
              easy: R`最後に、変形のときに引いた $\alpha$ を足し戻します。$a_{n} = (a_{1}-\alpha)p^{n-1} + \alpha$ が答えの形です。`,
              pro: R`この形 $a_{n} = (a_{1}-\alpha)p^{n-1}+\alpha$ を覚えておくと、特性方程式を解いたあとは 1 行で終わります。`
            }
          ];
        }
      } else {
        const f = v.f;
        if (P.isZero(f)) throw new JK.CalcError('f(n) が 0 です。階差 f(n) を入力してください');
        if (P.deg(f) > 3) throw new JK.CalcError('階差 f(n) は 3 次以下の多項式にしてください');
        step = null;
        let sP = [Q(0)];
        for (let j = 0; j <= 3; j++) sP = P.add(sP, P.scale(PSM[j], co(f, j)));
        const ap = P.add([a1], sP);
        closed = (n) => P.eval(ap, Q(n));
        closedTex = R`a_{n} = ` + ptn(ap);
        closedAt = (n) => substN(ap, Q(n));
        const fk = P.tex(f, 'k');
        recTex = R`a_{n+1} = a_{n} + ` + (P.deg(f) === 0 ? f[0].tex() : R`\left(` + ptn(f) + R`\right)`);
        plotFn = (x) => P.eval(ap, x);
        const comb = lcTerms([[co(f, 3), PSMF[3]], [co(f, 2), PSMF[2]], [co(f, 1), PSMF[1]], [co(f, 0), PSMF[0]]]);
        extraSteps = [
          {
            t: '階差数列とは',
            m: [R`b_{n} = a_{n+1} - a_{n} = ` + ptn(f), R`a_{n} = a_{1} + \sum_{k=1}^{n-1} b_{k}\quad (n \ge 2)`],
            n: R`となり合う項の差 $b_{n} = a_{n+1} - a_{n}$ を作った数列 $\{b_{n}\}$ を、$\{a_{n}\}$ の階差数列といいます。$a_{n}$ は初項 $a_{1}$ に、階差を $a_{1} \to a_{n}$ の間の分だけ足したものです。`,
            easy: R`$a_{2} = a_{1} + b_{1}$、$a_{3} = a_{2} + b_{2} = a_{1} + b_{1} + b_{2}$、…と、1 つ前に $b$ を足していきます。$a_{n}$ までには $b_{1}$ から $b_{n-1}$ まで（$n-1$ 個）を足したことになるので、$a_{n} = a_{1} + \sum_{k=1}^{n-1} b_{k}$ です。`,
            lv: 3
          },
          {
            t: '型を見分ける',
            m: [R`a_{n+1} - a_{n} = ` + ptn(f) + R`\ \ (n \text{ の式})`],
            n: R`差 $a_{n+1} - a_{n}$ が $n$ の式 $f(n) = ` + ptn(f) + R`$ になっているので、**階差型**です。`,
            easy: R`差が一定でも比が一定でもなく、「差が $n$ の式になる」ときは階差型です。差の数列 $b_{n} = f(n)$ の和を求めれば、$a_{n}$ が分かります。`,
            pro: R`階差型は「$a_{n} = a_{1} + \sum_{k=1}^{n-1} f(k)$、$n=1$ でも成立するか確認」の 2 点が決まり文句です。`
          },
          {
            t: R`$\sum_{k=1}^{n-1} f(k)$ を公式で計算する`,
            m: [R`\sum_{k=1}^{n-1}(` + fk + R`) = ` + comb, R`= ` + ptn(sP)],
            n: R`$\sum_{k=1}^{n-1}$ は、公式の $n$ を $n-1$ に置き換えたものです（$\sum_{k=1}^{m} k = \frac{1}{2}m(m+1)$ で $m = n-1$ とおくと $\frac{1}{2}(n-1)n$）。`,
            easy: R`「$1$ から $n-1$ まで」の和なので、基本公式の $n$ のところに $n-1$ を入れます。たとえば $\sum_{k=1}^{n-1} k = \frac{1}{2}(n-1)n$ です。公式を使って展開・整理すると、$n$ の多項式になります。`,
            pro: R`$\sum_{k=1}^{n-1}$ と $\sum_{k=1}^{n}$ の違い（$n$ か $n-1$ か）が最も多いミスです。`
          },
          {
            t: '一般項と n = 1 の確認',
            m: [R`a_{n} = ` + a1.tex() + R` + (` + ptn(sP) + R`) = ` + ptn(ap), R`n = 1:\quad ` + substN(ap, Q(1)) + ' = ' + a1.tex() + R` = a_{1}\ \ (\text{成り立つ})`],
            n: R`この式は $n \ge 2$ で導きましたが、$n = 1$ を入れると $a_{1}$ になり、すべての $n \ge 1$ で成り立ちます（$\sum_{k=1}^{0} = 0$ だからです）。`,
            easy: R`階差の和の式は、本当は $n \ge 2$ のときの式です。$n=1$ を入れると足す項がないので $a_{1}$ そのものになり、初項とも合います。だから、この式はすべての $n$ で使えます。`,
            pro: R`階差型で $n=1$ の確認を省くと減点されます。実際には $\sum_{k=1}^{0} = 0$ なので、必ず成立します。`
          }
        ];
      }
      // 漸化式から順に求めた項
      const rec = [a1];
      for (let k = 2; k <= Math.max(N, 5); k++) {
        if (type === 'diff') rec.push(rec[k - 2].add(P.eval(v.f, Q(k - 1))));
        else rec.push(step(rec[k - 2]));
      }
      const first5 = rec.slice(0, 5), cl5 = [1, 2, 3, 4, 5].map((n) => closed(n));
      const aN = closed(N);
      steps.push({
        t: '漸化式とは',
        m: [recTex + R`,\quad a_{1} = ` + a1.tex(), R`a_{2} = ` + first5[1].tex() + R`,\ a_{3} = ` + first5[2].tex() + R`,\ a_{4} = ` + first5[3].tex() + R`,\ \cdots`],
        n: R`漸化式は、前の項から次の項を作るルールで、初項 $a_{1} = ` + a1.tex() + R`$ から順に項が決まります。`,
        easy: R`漸化式は「ドミノ倒し」のようなものです。1 つ目の値（初項）が決まっていて、前の値から次の値を作る約束があれば、2 番目、3 番目…と全部決まります。ただし、100 番目を知るには 99 回計算が必要なので、$n$ の式（一般項）に直す必要があります。`,
        lv: 3
      });
      extraSteps.forEach((s) => steps.push(s));
      steps.push({
        t: '最初の 5 項で検算する',
        m: [R`\text{漸化式から: } ` + listTex(first5), R`\text{一般項から: } ` + listTex(cl5)],
        n: R`漸化式で順に求めた最初の 5 項と、一般項に $n = 1,\ \cdots,\ 5$ を入れた値が一致します。`,
        easy: R`求めた一般項が正しいか確かめます。漸化式で $a_{2},\ a_{3},\ \cdots$ を順に計算した値と、一般項に番号を入れた値が一致すれば OK です。1 つでもずれたら、解き方を見直します。`,
        lv: 2
      });
      steps.push({
        t: R`第 $` + N + R`$ 項`,
        m: [R`a_{` + N + R`} = ` + closedAt(N) + ' = ' + aN.tex()],
        n: R`一般項に $n = ` + N + R`$ を代入して $a_{` + N + R`} = ` + aN.tex() + R`$ です（漸化式を ` + (N - 1) + R` 回くり返した値と一致します）。`,
        easy: R`一般項があれば、番号を入れるだけで何番目でもすぐ求まります。漸化式のままだと ` + (N - 1) + R` 回の計算が必要です。`
      });
      let fig;
      if (type === 'lin' && !v.p.eq(1)) {
        const p = v.p, q = v.q, al = q.div(Q(1).sub(p));
        const pts = rec.slice(0, Math.abs(p.val()) > 1 ? 4 : 7).map((x) => x.val());
        const lo = Math.min.apply(null, pts.concat([al.val()])), hi = Math.max.apply(null, pts.concat([al.val()]));
        const pad = Math.max((hi - lo) * 0.2, 0.6);
        const x0 = lo - pad, x1 = hi + pad;
        const segs = [];
        for (let k = 0; k + 1 < pts.length; k++) {
          segs.push({ x1: pts[k], y1: pts[k], x2: pts[k], y2: pts[k + 1], cls: 'c3', dash: true });
          segs.push({ x1: pts[k], y1: pts[k + 1], x2: pts[k + 1], y2: pts[k + 1], cls: 'c3', dash: true });
        }
        const pf = p.val(), qf = q.val();
        fig = JK.plot.graph({
          w: 340, h: 280, x: [x0, x1], y: [x0, x1], equal: true, axis: ['a(n)', 'a(n+1)'],
          curves: [{ f: (x) => pf * x + qf, cls: 'c1' }, { f: (x) => x, cls: 'c2', dash: true }],
          segs: segs,
          points: [{ x: al.val(), y: al.val(), label: 'α = ' + al.toString(), cls: 'c4', pos: 'tr' }, { x: pts[0], y: pts[0], label: 'a₁', cls: 'c3', pos: 'br' }],
          labels: [{ x: x0 + (x1 - x0) * 0.04, y: x1 - (x1 - x0) * 0.08, text: 'y = ' + (p.eq(1) ? '' : p.toString()) + 'x + ' + q.toString() + '（青）と y = x（紫）', cls: 'dim' }]
        });
      } else {
        const K = Math.min(Math.max(N, 5), 10);
        fig = termsFig(rec.slice(0, K), plotFn, null);
      }
      return {
        result: [
          { label: '一般項 a_n', tex: closedTex },
          { label: '最初の 5 項', tex: listTex(first5) },
          { label: '第 ' + N + ' 項', tex: R`a_{` + N + R`} = ` + aN.tex() }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 5. 和 S_n から一般項 ================= */

  JK.registerCalc({
    id: 'iib-sum-from-sn',
    course: 'IIB',
    unit: 'm-seq',
    group: '数列',
    title: '和 S(n) から一般項 a(n) を求める',
    desc: R`初項から第 $n$ 項までの和 $S_{n}$（$n$ の整式）が分かっているときの一般項を求めます。$a_{1} = S_{1}$、$a_{n} = S_{n} - S_{n-1}\ (n \ge 2)$ を使い、$a_{1}$ が $n \ge 2$ の式に含まれるかを確かめます。`,
    form: [R`a_{1} = S_{1},\qquad a_{n} = S_{n} - S_{n-1}\ (n \ge 2)`],
    inputs: [
      { key: 's', label: R`$S_{n}$（$n$ の式）`, type: 'poly', 'var': 'n', def: 'n^2 + 2n + 1', hint: R`例: n^2 + 2n + 1、3n^2 - 2n、n^3（4 次まで）。定数項が 0 でないと、初項だけ別扱いになります。` }
    ],
    examples: [
      { label: 'S = n² + 2n + 1（初項が別）', v: { s: 'n^2 + 2n + 1' } },
      { label: 'S = n² + n（そのまま成立）', v: { s: 'n^2 + n' } },
      { label: 'S = 3n² − 2n', v: { s: '3n^2 - 2n' } },
      { label: 'S = n³', v: { s: 'n^3' } },
      { label: 'S = 2n² − n + 5', v: { s: '2n^2 - n + 5' } },
      { label: 'S = n(n+1)(2n+1)/6', v: { s: '1/6 n (n+1)(2n+1)' } }
    ],
    intro: {
      easy: R`$S_{n}$ は「$a_{1}$ から $a_{n}$ までの和」です。$S_{n}$ と、1 つ前の $S_{n-1}$（$a_{1}$ から $a_{n-1}$ までの和）を引き算すると、$a_{n}$ だけが残ります。つまり $a_{n} = S_{n} - S_{n-1}$ です。
ただし、この引き算は $S_{n-1}$ が存在する $n \ge 2$ のときだけ使えます。**初項 $a_{1}$ は $S_{1}$ そのもの**（$a_{1} = S_{1}$）です。そこで、(1) $a_{1} = S_{1}$ を求める (2) $n \ge 2$ の式 $S_{n} - S_{n-1}$ を計算する (3) (2) の式に $n=1$ を入れて $a_{1}$ と一致するか確かめる、の 3 段階で答えます。一致すれば 1 本の式で、しなければ $n=1$ と $n \ge 2$ に分けて書きます。`,
      normal: R`$a_{1} = S_{1}$、$n \ge 2$ で $a_{n} = S_{n} - S_{n-1}$。$n \ge 2$ の式に $n=1$ を代入した値が $a_{1}$ と等しいか確認。等しければまとめて 1 つの式、等しくなければ場合分け。`,
      pro: R`$S_{n}$ が $n$ の整式のとき、定数項が $0$（$S_{0} = 0$）なら $n=1$ でも成り立ちます。定数項が $0$ でなければ初項だけ別扱いです。$a_{n}$ の和が与えられる問題は「$a_{1}$ の別扱い」を確認したか、が採点ポイントです。`
    },
    compute(v) {
      const S = v.s;
      if (P.isZero(S)) throw new JK.CalcError('S(n) が 0 です。n の式を入力してください');
      if (P.deg(S) > 4) throw new JK.CalcError('次数は 4 次以下にしてください');
      const Sm1 = compose(S, SH);                                  // S_{n-1}
      const g = P.sub(S, Sm1);                                     // n ≧ 2 での a_n
      const a1 = P.eval(S, Q(1));
      const g1 = P.eval(g, Q(1));
      const consistent = g1.eq(a1);
      const S0 = co(S, 0);                                         // S(0)
      const terms = [];
      for (let k = 1; k <= 8; k++) terms.push(k === 1 ? a1 : P.eval(g, Q(k)));
      const sums = [];
      let run = Q(0);
      terms.forEach((t) => { run = run.add(t); sums.push(run); });
      // S(n-1) の代入形
      let sub = '';
      for (let k = P.deg(S); k >= 0; k--) {
        const c = S[k];
        if (c.isZero()) continue;
        const neg = c.sign() < 0, ab = c.abs();
        const body = k === 0 ? ab.tex() : (ab.eq(1) ? '' : ab.tex()) + R`(n-1)` + (k === 1 ? '' : '^{' + k + '}');
        sub += sub === '' ? (neg ? '-' : '') + body : (neg ? ' - ' : ' + ') + body;
      }
      const steps = [];
      steps.push({
        t: R`$S_{n}$ と $a_{n}$ の関係`,
        m: [R`S_{n} = a_{1} + a_{2} + \cdots + a_{n-1} + a_{n}`, R`S_{n-1} = a_{1} + a_{2} + \cdots + a_{n-1}\quad (n \ge 2)`, R`S_{n} - S_{n-1} = a_{n}\quad (n \ge 2)`],
        n: R`$S_{n}$ から $S_{n-1}$ を引くと、$a_{1}$ から $a_{n-1}$ までが消えて、最後の項 $a_{n}$ だけが残ります。`,
        easy: R`たとえばクラス全員の合計点 $S_{n}$ から、最後の 1 人を除いた合計点 $S_{n-1}$ を引けば、最後の 1 人の点数 $a_{n}$ が分かります。これと同じ考え方です。ただし $S_{0}$ にあたる「0 人の合計」は $S_{n-1}$ の式では使えないので、$n=1$ の場合は別に考えます。`,
        lv: 3
      });
      steps.push({
        t: R`$a_{1} = S_{1}$`,
        m: [R`a_{1} = S_{1} = ` + substN(S, Q(1)) + ' = ' + a1.tex()],
        n: R`和 $S_{1}$ は項が 1 つだけなので、初項そのものです。$S_{n}$ の式に $n=1$ を入れます。`,
        easy: R`項が 1 個しかないとき、その和 $S_{1}$ は初項 $a_{1}$ に等しくなります。$S_{n}$ の式の $n$ に $1$ を入れて計算します。`,
        pro: R`$a_{1}$ はいつも $S_{1}$ から求めます（引き算の式は使えません）。`
      });
      steps.push({
        t: R`$S_{n-1}$ をつくる（$n$ を $n-1$ に置き換える）`,
        m: [R`S_{n} = ` + ptn(S), R`S_{n-1} = ` + sub, R`S_{n-1} = ` + ptn(Sm1)],
        n: R`$S_{n}$ の式の $n$ をすべて $n-1$ に置き換えて展開します。`,
        easy: R`$S_{n}$ の式の $n$ を、$(n-1)$ に置き換えます。たとえば $n^{2}$ は $(n-1)^{2} = n^{2} - 2n + 1$ になります。かっこを開いて、$n$ の降べきの順に整理します。`,
        pro: R`$(n-1)^{2}$ や $(n-1)^{3}$ の展開ミスに注意します。検算として、$n=2$ を入れて $S_{1}$ に一致するか見ます。`
      });
      steps.push({
        t: R`$n \ge 2$ のとき $a_{n} = S_{n} - S_{n-1}$`,
        m: [R`a_{n} = ` + pa(ptn(S)) + ' - ' + pa(ptn(Sm1)), R`a_{n} = ` + ptn(g) + R`\quad (n \ge 2)`],
        n: R`$S_{n}$ から $S_{n-1}$ を引きます。$n$ の高次の項が消えて、次数が 1 つ下がります。`,
        easy: R`2 つの式を引き算して、同じ次数の項どうしをまとめます。$n^{2}$ の項が消えて 1 次式になるなど、次数が 1 つ下がるのが普通です。引くほうの式にはかっこをつけて、符号を反転させるのを忘れずに。`,
        pro: R`$S_{n} - S_{n-1}$ の次数は $S_{n}$ より 1 小さくなります（微分に似た関係）。`
      });
      steps.push({
        t: R`$n=1$ のとき成り立つか確かめる`,
        m: [R`n = 1:\quad ` + substN(g, Q(1)) + ' = ' + g1.tex() + (consistent ? ' = ' : R` \ne `) + R`a_{1} = ` + a1.tex()],
        n: consistent ? R`$n \ge 2$ の式に $n=1$ を入れた値 $` + g1.tex() + R`$ が $a_{1} = ` + a1.tex() + R`$ と一致します。このとき、$S_{n}$ の定数項が $0$ だったので、1 本の式で表せます。` : R`$n \ge 2$ の式に $n=1$ を入れた値 $` + g1.tex() + R`$ は $a_{1} = ` + a1.tex() + R`$ と**一致しません**。$S_{n}$ の定数項が $` + S0.tex() + R`$ だったためで、初項だけ別に書きます。`,
        easy: R`$n \ge 2$ のために作った式が、$n=1$ のときも正しいかどうかを確かめます。一致しないなら、初項だけ「特別な値」ということです。実は、$S_{n}$ の式の定数項が $0$ なら必ず一致し、$0$ でなければ一致しません。`,
        pro: R`この確認が答案の肝です。$S_{n}$ の定数項が $0$ のときは確認なしでも成立しますが、書いておくと安全です。`
      });
      const ans = consistent
        ? R`a_{n} = ` + ptn(g)
        : R`a_{n} = \begin{cases} ` + a1.tex() + R` & (n = 1) \\ ` + ptn(g) + R` & (n \ge 2) \end{cases}`;
      steps.push({
        t: '一般項',
        m: [ans],
        n: consistent ? R`$n=1$ でも成り立つので、すべての $n \ge 1$ について $a_{n} = ` + ptn(g) + R`$ です。` : R`初項だけ別なので、場合分けして答えます。`,
        easy: consistent ? R`$n=1$ のときも同じ式でよいので、場合分けは不要です。` : R`$n=1$ のとき（初項）と $n \ge 2$ のときで式が違うので、2 つに分けて書きます。ここを 1 本の式にまとめると誤りになります。`
      });
      steps.push({
        t: '最初の数項で検算する',
        m: [
          R`a_{1},\ a_{2},\ \cdots,\ a_{5} = ` + terms.slice(0, 5).map((t) => t.tex()).join(R`,\ `),
          R`a_{1} + a_{2} + \cdots + a_{5} = ` + terms.slice(0, 5).map((t) => t.tex()).join(' + ') + ' = ' + sums[4].tex(),
          R`S_{5} = ` + substN(S, Q(5)) + ' = ' + P.eval(S, Q(5)).tex()
        ],
        n: R`求めた $a_{n}$ を最初の 5 項まで足すと、$S_{5}$ の値と一致します。`,
        easy: R`得られた一般項で $a_{1},\ \cdots,\ a_{5}$ を計算して足し合わせ、元の $S_{5}$ と同じになるか確かめます。一致すれば、場合分けも含めて正しい答えです。`,
        lv: 2
      });
      const pts1 = terms.map((t, i) => ({ x: i + 1, y: t.val(), cls: 'c1' }));
      const pts2 = sums.map((t, i) => ({ x: i + 1, y: t.val(), cls: 'c2' }));
      const ysAll = pts1.concat(pts2).map((p) => p.y);
      const lo = Math.min.apply(null, ysAll), hi = Math.max.apply(null, ysAll), pad = Math.max((hi - lo) * 0.12, 0.5);
      const fig = JK.plot.graph({
        w: 340, h: 250, x: [0, 9], y: [Math.min(lo, 0) - pad, hi + pad], axis: ['n', ''],
        points: pts1.concat(pts2),
        labels: [{ x: 0.3, y: Math.min(lo, 0) + (hi - Math.min(lo, 0)) * 0.92, text: '青: a(n)　紫: S(n)', cls: 'dim' }]
      });
      return {
        result: [
          { label: '初項 a₁', tex: R`a_{1} = S_{1} = ` + a1.tex() },
          { label: 'n ≧ 2 のとき', tex: R`a_{n} = S_{n} - S_{n-1} = ` + ptn(g) },
          { label: '一般項', tex: ans },
          { label: '最初の 5 項', tex: listTex(terms.slice(0, 5)) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });
})();
