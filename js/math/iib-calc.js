/* 数II・B — 微分・積分: 多項式の微分と接線 / 3次関数の増減表と極値 / 多項式の積分 / 面積 / 曲線外の点からの接線
   構成は ia-quad.js に準拠（intro → result → steps(easy / pro / lv) → fig）。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;

  /* ================= 共通ヘルパ ================= */

  const ptex = (p) => P.tex(p, 'x');
  const fm = (x, n) => U.fmt(x, n == null ? 4 : n);
  const co = (p, k) => (k < p.length ? p[k] : Q(0));
  const pa = (t) => R`\left(` + t + R`\right)`;
  const parQ = (q) => (q.sign() < 0 || !q.isInt() ? R`\left(` + q.tex() + R`\right)` : q.tex());
  const xp = (e) => (e === 0 ? '' : (e === 1 ? 'x' : 'x^{' + e + '}'));
  const mono = (c, e) => { const a = []; for (let i = 0; i < e; i++) a.push(Q(0)); a.push(c); return a; };
  const termStr = (c, e) => P.tex(mono(c, e), 'x');
  const shiftX = (a) => (a.isZero() ? 'x' : (a.sign() > 0 ? 'x - ' + a.tex() : 'x + ' + a.neg().tex()));
  // p(x) に Q の値 x を代入した形（係数×(x)^k の和）
  function substTex(p, x) {
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
  // p + c√m（m は平方因子なしの整数、m = 1 なら有理数）の TeX
  function surdQ(p, c, m) {
    if (c.isZero()) return p.tex();
    if (m === 1) return p.add(c).tex();
    const d = U.lcm(p.d, c.d);
    let P0 = p.n * (d / p.d), C0 = c.n * (d / c.d);
    const g = U.gcd(U.gcd(Math.abs(P0), Math.abs(C0)), d) || 1;
    P0 /= g; C0 /= g;
    const dd = d / g;
    const rad = (Math.abs(C0) === 1 ? '' : String(Math.abs(C0))) + '\\sqrt{' + m + '}';
    if (P0 === 0) return (C0 < 0 ? '-' : '') + (dd === 1 ? rad : '\\frac{' + rad + '}{' + dd + '}');
    const num = P0 + (C0 < 0 ? ' - ' : ' + ') + rad;
    return dd === 1 ? num : '\\frac{' + num + '}{' + dd + '}';
  }
  function isqrt(n) { const r = Math.round(Math.sqrt(n)); return r * r === n ? r : -1; }
  // q（非負の Q）が有理数の 2 乗なら √q（Q）、でなければ null
  function ratSqrt(q) {
    if (q.sign() < 0) return null;
    const a = isqrt(q.n), b = isqrt(q.d);
    return (a >= 0 && b >= 0) ? Q(a, b) : null;
  }
  // √q = c√m（m は平方因子なしの整数）
  function sqrtParts(q) {
    const s = U.sqrtSimplify(q.n * q.d);
    return { c: Q(s.out, q.d), m: s.in };
  }
  // u + v√r の数値
  const pv = (x, r) => x[0].val() + x[1].val() * Math.sqrt(r);
  // Z[√r] 風の積・和（x = [u, v] は u + v√r）
  const pMul = (x, y, r) => [x[0].mul(y[0]).add(x[1].mul(y[1]).mul(r)), x[0].mul(y[1]).add(x[1].mul(y[0]))];
  const pAdd = (x, y) => [x[0].add(y[0]), x[1].add(y[1])];
  const pSc = (x, k) => [x[0].mul(k), x[1].mul(k)];

  // 数値の列から y の表示範囲
  function yRange(fn, x0, x1, extra) {
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i <= 120; i++) {
      const y = fn(x0 + (x1 - x0) * i / 120);
      if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
    }
    (extra || []).forEach((y) => { lo = Math.min(lo, y); hi = Math.max(hi, y); });
    if (!isFinite(lo)) { lo = -1; hi = 1; }
    const pad = Math.max((hi - lo) * 0.15, 0.5);
    return [lo - pad, hi + pad];
  }

  /* ================= 1. 多項式の微分と接線 ================= */

  // 項ごとの微分の行
  function derivLines(f) {
    const lines = [];
    for (let n = P.deg(f); n >= 0; n--) {
      const c = f[n];
      if (c.isZero()) continue;
      if (n === 0) { lines.push(R`(` + c.tex() + R`)' = 0`); continue; }
      const dn = c.mul(n);
      lines.push(R`(` + termStr(c, n) + R`)' = ` + parQ(c) + R` \cdot ` + n + xp(n - 1) + ' = ' + termStr(dn, n - 1));
    }
    return lines.length ? lines : [R`(0)' = 0`];
  }

  function diffFig(f, a, fa, line) {
    const av = a.val(), w = 2;
    const fn = P.fn(f), lfn = P.fn(line);
    return JK.plot.graph({
      w: 340, h: 250, x: [av - w, av + w], y: yRange(fn, av - w, av + w, [fa.val()]),
      curves: [{ f: fn, cls: 'c1' }, { f: lfn, cls: 'c2', dash: true }],
      points: [{ x: av, y: fa.val(), label: '接点(' + a.toString() + ', ' + fa.toString() + ')', cls: 'c3', pos: 'tl' }]
    });
  }

  JK.registerCalc({
    id: 'iib-diff-poly',
    course: 'IIB',
    unit: 'm-calc2',
    group: '微分・積分',
    title: '多項式の微分と接線',
    desc: R`多項式 $f(x)$ の導関数 $f'(x)$ を項ごとに求め、$x=a$ における微分係数 $f'(a)$ と接線の方程式を求めます。導関数の定義（平均変化率の極限）を数値例で確かめる手順もつけています。`,
    form: [R`(x^{n})' = nx^{n-1},\qquad (c)' = 0`, R`y - f(a) = f'(a)\,(x - a)`],
    inputs: [
      { key: 'f', label: R`$f(x)$`, type: 'poly', def: 'x^3 - 3x + 1', hint: R`多項式で入力します（例: x^3 - 3x^2 + 2、(x-1)(x+2)）。8 次まで。` },
      { key: 'a', label: R`接点の $x$ 座標 $a$`, type: 'q', def: '2' }
    ],
    examples: [
      { label: '3 次関数 x=2', v: { f: 'x^3 - 3x + 1', a: '2' } },
      { label: '2 次関数 x=−1', v: { f: 'x^2 - 4x + 5', a: '-1' } },
      { label: '4 次関数 x=1', v: { f: 'x^4 - 2x^2 + x', a: '1' } },
      { label: '分数の接点', v: { f: '2x^3 - x^2 + 3', a: '1/2' } },
      { label: '傾きが 0（極値）', v: { f: 'x^3 - 3x^2 + 2', a: '2' } }
    ],
    intro: {
      easy: R`曲線 $y=f(x)$ の「ある点での傾き」を表すのが**微分係数** $f'(a)$、その傾きの接する直線が**接線**です。傾きを調べたいときは、まず $f(x)$ を微分して**導関数** $f'(x)$ という新しい関数をつくり、そこに $x=a$ を入れます。
多項式の微分はとても簡単で、$x^{n}$ の項を「$n$ を前に出して、次数を 1 つ下げる」だけです。たとえば $x^{3}$ は $3x^{2}$、$x^{2}$ は $2x$、$x$ は $1$、定数は $0$ になります。
接線は「点 $(a,\ f(a))$ を通り、傾きが $f'(a)$ の直線」です。中学で習った「通る 1 点と傾きが分かれば直線が決まる」という考え方がそのまま使えます。`,
      normal: R`$(x^{n})' = nx^{n-1}$、$\{kf(x)\}' = kf'(x)$、$\{f(x)+g(x)\}' = f'(x)+g'(x)$。接線は $y = f'(a)(x-a) + f(a)$。`,
      pro: R`接線の式は $y = f'(a)(x-a)+f(a)$ を暗算で整理します。接線と曲線の方程式を連立すると、接点は**重解**になる（$f(x) - (\text{接線}) = (x-a)^{2}g(x)$）点も覚えておくと検算に使えます。`
    },
    compute(v) {
      const f = v.f, a = v.a;
      if (P.isZero(f)) throw new JK.CalcError('f(x) が 0 です。多項式を入力してください');
      if (P.deg(f) > 8) throw new JK.CalcError('次数は 8 次以下にしてください');
      const f1 = P.deriv(f);
      const fa = P.eval(f, a), da = P.eval(f1, a);
      const inter = fa.sub(da.mul(a));
      const line = [inter, da];
      const lineTex = ptex(line);
      const hs = [Q(1), Q(1, 10), Q(1, 100), Q(1, 1000)];
      const dq = hs.map((h) => P.eval(f, a.add(h)).sub(fa).div(h));
      const steps = [];
      steps.push({
        t: '微分とは（導関数の定義）',
        m: [R`f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}`].concat(
          hs.map((h, i) => R`h = ` + fm(h.val(), 3) + R`:\quad \frac{f(` + a.tex() + ' + ' + fm(h.val(), 3) + R`) - f(` + a.tex() + R`)}{` + fm(h.val(), 3) + '} = ' + fm(dq[i].val(), 4)),
          [R`h \to 0\ \text{のとき}\quad \to\ f'(` + a.tex() + R`) = ` + da.tex()]
        ),
        n: R`$x$ が $a$ から $h$ だけ動いたときの変化の割合（平均変化率）$\frac{f(a+h)-f(a)}{h}$ で、$h$ を $0$ に限りなく近づけたときの値が微分係数 $f'(a)$ です。`,
        easy: R`グラフ上の 2 点 $(a,\ f(a))$ と $(a+h,\ f(a+h))$ を結んだ直線の傾きが、平均変化率です。$h$ を小さくしていくと 2 点が近づき、直線は点 $(a,\ f(a))$ だけに触れる**接線**に近づきます。上の数値の列は、$h=1,\ 0.1,\ 0.01,\ 0.001$ と小さくするほど、傾きが $` + da.tex() + R`$（微分係数）に近づいていく様子です。`,
        lv: 3
      });
      steps.push({
        t: '微分の公式',
        m: [R`(x^{n})' = nx^{n-1}\quad (n = 1,\ 2,\ 3,\ \cdots)`, R`(c)' = 0,\qquad \{kf(x)\}' = kf'(x),\qquad \{f(x) + g(x)\}' = f'(x) + g'(x)`],
        n: R`多項式は、各項を別々に微分して足し合わせます。定数倍はそのまま外に出せます。`,
        easy: R`$x^{3}$ を微分すると $3x^{2}$：指数の $3$ を前に出して、指数を $1$ 下げます。$x$ は $x^{1}$ と見て $1 \cdot x^{0} = 1$、定数（たとえば $5$）はグラフが水平なので傾き $0$ です。項が何個あっても 1 つずつ微分するだけです。`,
        pro: R`$(x^{n})' = nx^{n-1}$ は「指数を下ろして 1 引く」と唱えれば暗算できます。`
      });
      steps.push({
        t: '項ごとに微分する',
        m: derivLines(f),
        n: R`各項に公式を適用します。係数がかかっているときは、係数と指数をかけます。`,
        easy: R`たとえば $3x^{2}$ なら、係数 $3$ と指数 $2$ をかけて $6$、指数は $1$ 下がって $x^{1}=x$ になり、$6x$ です。符号つきの係数もそのままかけ算します。`
      });
      steps.push({
        t: R`導関数 $f'(x)$`,
        m: [R`f(x) = ` + ptex(f), R`f'(x) = ` + ptex(f1)],
        n: R`各項の微分結果を足し合わせたものが導関数 $f'(x)$ です。`,
        easy: R`$f'(x)$ は「グラフの各点での傾き」を表す関数です。$x$ に値を入れると、その点での接線の傾きが分かります。`,
        pro: R`導関数は項の次数を 1 下げた多項式になります。次数が下がるので、極値・接線の問題は方程式が 1 段階やさしくなります。`
      });
      steps.push({
        t: R`接点の $y$ 座標 $f(a)$ と傾き $f'(a)$`,
        m: [
          R`f(` + a.tex() + R`) = ` + substTex(f, a) + ' = ' + fa.tex(),
          R`f'(` + a.tex() + R`) = ` + substTex(f1, a) + ' = ' + da.tex()
        ],
        n: R`$f(x)$ に $x=a$ を代入すると接点の $y$ 座標、$f'(x)$ に代入すると接線の傾きです。接点は $(` + a.tex() + R`,\ ` + fa.tex() + R`)$、傾きは $` + da.tex() + R`$ です。`,
        easy: R`接線は「点 $(a,\ f(a))$ を通る」直線です。そこで、まず $y$ 座標 $f(a)$ を元の関数 $f(x)$ で求め、次に傾き $f'(a)$ を導関数 $f'(x)$ で求めます。2 つの関数を取り違えないようにしましょう。`
      });
      steps.push({
        t: '接線の方程式',
        m: [
          R`y - f(a) = f'(a)(x - a)`,
          R`y - ` + parQ(fa) + ' = ' + parQ(da) + R`\left(x - ` + parQ(a) + R`\right)`,
          'y = ' + lineTex
        ],
        n: R`通る点 $(a,\ f(a))$ と傾き $f'(a)$ を直線の式 $y - y_{1} = m(x - x_{1})$ に入れ、$y=$ の形に整理します。`,
        easy: R`中学で習った「傾き $m$ で点 $(x_{1},\ y_{1})$ を通る直線は $y - y_{1} = m(x - x_{1})$」にそのまま当てはめます。$y$ について解いて整理すれば、接線の式 $y = ` + lineTex + R`$ が得られます。`,
        pro: R`$y = f'(a)\,x + \{f(a) - a f'(a)\}$ と先に切片を計算しておくと速いです。`
      });
      if (P.deg(f) >= 2) {
        const diff = P.sub(f, line);
        const dm = P.divmod(diff, P.mul([a.neg(), Q(1)], [a.neg(), Q(1)]));
        const sqTex = R`\left(` + shiftX(a) + R`\right)^{2}`;
        steps.push({
          t: '接線と曲線の式を連立して確かめる（接点は重解）',
          m: [
            R`f(x) - (` + lineTex + R`) = ` + ptex(diff),
            dm.q.length === 1
              ? '= ' + (dm.q[0].eq(1) ? '' : (dm.q[0].eq(-1) ? '-' : dm.q[0].tex())) + sqTex
              : '= ' + sqTex + R`\left(` + ptex(dm.q) + R`\right)`
          ],
          n: R`接線と曲線を連立した方程式 $f(x) = (\text{接線})$ は、接点 $x=a$ を**重解**にもちます（$(x-a)^{2}$ で割り切れる）。余りが $0$ になるので、接線の式が正しいと確かめられます。`,
          easy: R`接線は曲線にちょうど「触れる」直線なので、連立方程式を解くと、接点の $x=a$ が 2 回重なって出てきます。式で言うと、$f(x) - (\text{接線の式})$ が $(x-a)^{2}$ で割り切れる、ということです。割り切れれば計算ミスがありません。`,
          lv: 2
        });
      }
      return {
        result: [
          { label: '導関数 f′(x)', tex: R`f'(x) = ` + ptex(f1) },
          { label: '接点の y 座標 f(a)', tex: R`f(` + a.tex() + R`) = ` + fa.tex() },
          { label: '傾き f′(a)', tex: R`f'(` + a.tex() + R`) = ` + da.tex() },
          { label: '接線', tex: 'y = ' + lineTex }
        ],
        steps: steps,
        fig: diffFig(f, a, fa, line)
      };
    }
  });

  /* ================= 2. 3次関数の増減表と極値 ================= */

  // 増減表の図。cols: [{k:'iv', x:'…', s:+1|-1}|{k:'pt', x:'-1', v:'10', tag:'極大'}]
  function tableFig(cols) {
    const L = 54, wi = 60, wp = 66, top = 6;
    let W = L + 8;
    cols.forEach((c) => { W += c.k === 'iv' ? wi : wp; });
    const H = 130;
    const d = JK.plot.draw(W, H);
    const rows = [top, top + 30, top + 66, top + 118];
    rows.forEach((y) => d.line(6, y, W - 6, y, { cls: 'dim', w: 1 }));
    d.line(6, rows[0], 6, rows[3], { cls: 'dim', w: 1 });
    d.line(L, rows[0], L, rows[3], { cls: 'dim', w: 1 });
    d.line(W - 6, rows[0], W - 6, rows[3], { cls: 'dim', w: 1 });
    d.text(30, rows[0] + 20, 'x', { size: 13, italic: true });
    d.text(30, rows[1] + 24, "f′(x)", { size: 12 });
    d.text(30, rows[2] + 31, 'f(x)', { size: 12 });
    let x0 = L;
    cols.forEach((c) => {
      const w = c.k === 'iv' ? wi : wp, cx = x0 + w / 2;
      if (x0 > L) d.line(x0, rows[0], x0, rows[3], { cls: 'dim', w: 1 });
      if (c.k === 'iv') {
        d.text(cx, rows[0] + 20, '…', { size: 13 });
        d.text(cx, rows[1] + 24, c.s > 0 ? '+' : '−', { size: 15, cls: c.s > 0 ? 'c1' : 'c2' });
        if (c.s > 0) d.arrow(cx - 15, rows[2] + 38, cx + 15, rows[2] + 18, { cls: 'c1', w: 1.8 });
        else d.arrow(cx - 15, rows[2] + 18, cx + 15, rows[2] + 38, { cls: 'c2', w: 1.8 });
      } else {
        d.text(cx, rows[0] + 20, c.x, { size: 12 });
        d.text(cx, rows[1] + 24, '0', { size: 14 });
        d.text(cx, rows[2] + 25, c.v, { size: 12, cls: c.tag ? 'c3' : 'fg' });
        if (c.tag) d.text(cx, rows[2] + 44, c.tag, { size: 11, cls: 'dim' });
        else d.text(cx, rows[2] + 44, '極値なし', { size: 11, cls: 'dim' });
      }
      x0 += w;
    });
    return d.svg();
  }

  function cubicFig(f, crit, fvals, centerX) {
    let x0, x1;
    if (crit.length) {
      const lo = Math.min.apply(null, crit), hi = Math.max.apply(null, crit);
      const span = Math.max(hi - lo, 1);
      x0 = lo - 0.9 * span - 0.5; x1 = hi + 0.9 * span + 0.5;
    } else { x0 = centerX - 3; x1 = centerX + 3; }
    const fn = P.fn(f);
    let y;
    if (fvals.length) {
      const lo = Math.min.apply(null, fvals), hi = Math.max.apply(null, fvals), dy = Math.max(hi - lo, 1);
      y = [lo - 0.8 * dy, hi + 0.8 * dy];
    } else y = yRange(fn, x0, x1);
    const pts = [];
    crit.forEach((x, i) => { pts.push({ x: x, y: fvals[i], cls: i === 0 ? 'c3' : 'c2', label: crit.length === 2 ? (i === 0 ? '極' + (fvals[0] > fvals[1] ? '大' : '小') : '極' + (fvals[1] > fvals[0] ? '大' : '小')) : '', pos: 'tr' }); });
    return JK.plot.graph({ w: 340, h: 250, x: [x0, x1], y: y, curves: [{ f: fn, cls: 'c1' }], points: pts, vlines: crit.map((x) => ({ x: x, dash: true })) });
  }

  JK.registerCalc({
    id: 'iib-extrema',
    course: 'IIB',
    unit: 'm-calc2',
    group: '微分・積分',
    title: '3次関数の増減表と極値',
    desc: R`3 次関数 $f(x) = ax^{3} + bx^{2} + cx + d$ の導関数から、$f'(x) = 0$ の解・増減表・極大値・極小値を求めます。極値がない場合（$f'(x) \ge 0$ がずっと続く場合）も説明します。`,
    form: [R`f(x) = ax^{3} + bx^{2} + cx + d`, R`f'(x) = 3ax^{2} + 2bx + c`],
    inputs: [
      { key: 'a', label: R`$a$（$x^{3}$ の係数）`, type: 'q', def: '1' },
      { key: 'b', label: R`$b$（$x^{2}$ の係数）`, type: 'q', def: '-3' },
      { key: 'c', label: R`$c$（$x$ の係数）`, type: 'q', def: '-9' },
      { key: 'd', label: R`$d$（定数項）`, type: 'q', def: '5' }
    ],
    examples: [
      { label: '標準（極値あり）', v: { a: '1', b: '-3', c: '-9', d: '5' } },
      { label: 'a < 0（山が先）', v: { a: '-1', b: '0', c: '3', d: '1' } },
      { label: '極値が無理数', v: { a: '1', b: '-1', c: '-1', d: '0' } },
      { label: '重解（極値なし）', v: { a: '1', b: '3', c: '3', d: '1' } },
      { label: '極値なし（D < 0）', v: { a: '1', b: '0', c: '1', d: '0' } },
      { label: '分数係数', v: { a: '2', b: '-3', c: '-12', d: '1' } }
    ],
    intro: {
      easy: R`関数のグラフが「上がっている」か「下がっている」かは、その点での接線の傾き、つまり**導関数 $f'(x)$ の符号**で決まります。$f'(x) > 0$ なら右上がり（増加）、$f'(x) < 0$ なら右下がり（減少）です。増加から減少に変わる山の頂上が**極大**、減少から増加に変わる谷の底が**極小**で、そのときの $f(x)$ の値を極大値・極小値といいます。
手順は 3 つです。(1) $f'(x)$ を求める (2) $f'(x) = 0$ を解いて、傾きが 0 になる $x$ を見つける (3) その前後で $f'(x)$ の符号を調べて**増減表**にまとめ、極値を求める。3 次関数では $f'(x)$ が 2 次式なので、2 つの解があれば山と谷が 1 つずつできます。`,
      normal: R`$f'(x) = 3ax^{2}+2bx+c = 0$ の判別式 $\frac{D}{4} = b^{2}-3ac$ で、異なる 2 つの実数解（$>0$）なら極値が 2 つ、重解（$=0$）か実数解なし（$<0$）なら極値なしです。$a>0$ なら「増加 → 減少 → 増加」、$a<0$ なら「減少 → 増加 → 減少」。`,
      pro: R`極値が無理数のときは、$f(x)$ を $f'(x)$ で割った余り（1 次式）に代入すると $f(\alpha)$ が楽に出ます。3 次関数は変曲点（$f''(x)=0$）に関して点対称で、極大値と極小値の差は $\frac{|D|^{3/2}}{27a^{2}}$ のような形になります。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c, d = v.d;
      if (a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（a = 0 だと 3 次関数になりません）');
      const f = [d, c, b, a];
      const f1 = P.deriv(f);
      const D4 = b.mul(b).sub(a.mul(c).mul(3));
      const p0 = b.neg().div(a.mul(3));
      const up = a.sign() > 0;
      const steps = [];
      steps.push({
        t: '増減表と極値とは',
        m: [R`f'(x) > 0 \;\Rightarrow\; f(x) \text{ は増加},\qquad f'(x) < 0 \;\Rightarrow\; f(x) \text{ は減少}`],
        n: R`導関数の符号が $+$ から $-$ に変わる点で極大、$-$ から $+$ に変わる点で極小になります。その点の $f(x)$ の値が極値です。`,
        easy: R`山登りにたとえると、$f'(x) > 0$ は上り坂、$f'(x) < 0$ は下り坂です。上り坂から下り坂に変わる所が山頂（極大）、下りから上りに変わる所が谷底（極小）。ちょうど平らな所（$f'(x) = 0$）が頂上や谷底の候補になります。`,
        lv: 3
      });
      steps.push({
        t: R`導関数 $f'(x)$`,
        m: [R`f(x) = ` + ptex(f), R`f'(x) = ` + ptex(f1)],
        n: R`$f'(x) = 3ax^{2} + 2bx + c$ に係数を入れます。`,
        easy: R`各項を微分します。$x^{3}$ は $3x^{2}$、$x^{2}$ は $2x$、$x$ は $1$、定数は $0$ です。$f'(x)$ は 2 次式になります。`,
        pro: R`3 次関数の導関数は 2 次式なので、判別式 $\frac{D}{4}=b^{2}-3ac$ を見れば、極値の有無が即座に分かります。`
      });
      steps.push({
        t: R`$f'(x) = 0$ を解く（判別式 $\frac{D}{4} = b^{2}-3ac$）`,
        m: [R`\frac{D}{4} = b^{2} - 3ac = ` + parQ(b) + R`^{2} - 3 \cdot ` + parQ(a) + R` \cdot ` + parQ(c) + ' = ' + D4.tex()],
        n: D4.sign() > 0 ? R`$\frac{D}{4} > 0$ なので、$f'(x) = 0$ は異なる 2 つの実数解をもち、極値が 2 つあります。` : (D4.isZero() ? R`$\frac{D}{4} = 0$ なので、$f'(x) = 0$ は重解（$x = ` + p0.tex() + R`$）です。符号が変わらないので、極値はありません。` : R`$\frac{D}{4} < 0$ なので、$f'(x) = 0$ は実数解をもちません。$f'(x)$ の符号がずっと変わらず、極値はありません。`),
        easy: R`$f'(x) = 0$ は 2 次方程式です。解が 2 つ（判別式が正）なら、傾きが 0 になる場所が 2 か所あって、山と谷ができます。解が 1 つ（重解）や 0 個なら、傾きの符号が変わらないので、ずっと上がり続ける（または下がり続ける）だけで、山も谷もできません。`
      });
      let cols, res, crit = [], fvals = [];
      if (D4.sign() > 0) {
        const rs = ratSqrt(D4);
        const sp = rs ? { c: rs, m: 1 } : sqrtParts(D4);
        const sAbs = sp.c.abs().div(a.abs().mul(3));
        const rt = sp.m;
        const xs = [[p0, sAbs.neg()], [p0, sAbs]];                 // 小さい解、大きい解
        const exact = rt === 1;
        const xq = exact ? [p0.sub(sAbs), p0.add(sAbs)] : null;
        const xTex = xs.map((x, i) => (exact ? xq[i].tex() : surdQ(x[0], x[1], rt)));
        const xNum = xs.map((x) => pv(x, rt));
        steps.push({
          t: R`$f'(x) = 0$ の解`,
          m: [R`x = \frac{-b \pm \sqrt{b^{2} - 3ac}}{3a} = \frac{-` + parQ(b) + R` \pm \sqrt{` + D4.tex() + R`}}{3 \cdot ` + parQ(a) + '}', R`x = ` + xTex[0] + R`,\quad ` + xTex[1] + (exact ? '' : R`\ \ (\approx ` + fm(xNum[0], 3) + R`,\ ` + fm(xNum[1], 3) + ')')],
          n: R`$f'(x) = 3ax^{2}+2bx+c = 0$ に 2 次方程式の解の公式（$b$ が偶数係数の形）を使います。小さいほうの解を $\alpha$、大きいほうを $\beta$ とします。`,
          easy: R`$3ax^{2}+2bx+c = 0$ の解の公式は、係数の半分で書くと $x = \frac{-b \pm \sqrt{b^{2}-3ac}}{3a}$ です（$x$ の係数 $2b$ の半分が $b$）。± の 2 つが山と谷の位置です。`,
          pro: R`解が有理数なら因数分解 $f'(x) = 3a(x-\alpha)(x-\beta)$ が早いです。`
        });
        // 値
        const dm = P.divmod(f, f1);
        const r0 = co(dm.r, 0), r1 = co(dm.r, 1);
        const vals = [];
        for (let i = 0; i < 2; i++) {
          if (exact) vals.push([P.eval(f, xq[i]), Q(0)]);
          else vals.push([r0.add(r1.mul(xs[i][0])), r1.mul(xs[i][1])]);
        }
        const vNum = vals.map((x) => pv(x, rt));
        const vTex = vals.map((x) => (exact ? x[0].tex() : surdQ(x[0], x[1], rt)));
        crit = xNum; fvals = vNum;
        const isMaxFirst = vNum[0] > vNum[1];
        const tags = up ? ['極大', '極小'] : ['極小', '極大'];
        cols = [
          { k: 'iv', s: up ? 1 : -1 },
          { k: 'pt', x: exact ? xq[0].toString() : fm(xNum[0], 2), v: exact ? vals[0][0].toString() : fm(vNum[0], 2), tag: tags[0] },
          { k: 'iv', s: up ? -1 : 1 },
          { k: 'pt', x: exact ? xq[1].toString() : fm(xNum[1], 2), v: exact ? vals[1][0].toString() : fm(vNum[1], 2), tag: tags[1] },
          { k: 'iv', s: up ? 1 : -1 }
        ];
        steps.push({
          t: '増減表をつくる',
          m: [R`f'(x) = 3 \cdot ` + parQ(a) + R`(x - \alpha)(x - \beta)\quad (\alpha < \beta)`],
          n: R`$f'(x) = 3a(x-\alpha)(x-\beta)$ なので、$a` + (up ? '>' : '<') + R` 0$ のとき、$x<\alpha$ では $f'(x)$ が` + (up ? '正' : '負') + R`、$\alpha<x<\beta$ では` + (up ? '負' : '正') + R`、$x>\beta$ では` + (up ? '正' : '負') + R`です。$x=\alpha$ で` + tags[0] + R`、$x=\beta$ で` + tags[1] + R`になります。`,
          easy: R`$f'(x)$ は $x=\alpha,\ \beta$ で $0$ になり、その前後で符号が入れ替わります。符号が $+$ の区間では $f(x)$ は増加（↗）、$-$ の区間では減少（↘）です。$a$ が正なら最初は増加、負なら最初は減少から始まります。`,
          pro: R`$f'(x)$ のグラフは $a>0$ で下に凸の放物線。$\alpha, \beta$ の外側で正、内側で負、と符号を即決します。`,
          fig: tableFig(cols)
        });
        const lines = [];
        if (exact) {
          for (let i = 0; i < 2; i++) lines.push(R`f(` + xq[i].tex() + R`) = ` + substTex(f, xq[i]) + ' = ' + vals[i][0].tex());
        } else {
          lines.push(R`f(x) = f'(x)\,\{` + ptex(dm.q) + R`\} + ` + pa(ptex(dm.r)));
          for (let i = 0; i < 2; i++) {
            const nm = i === 0 ? R`\alpha` : R`\beta`;
            lines.push(R`f(` + nm + R`) = ` + pa(ptex(dm.r).replace(/x/g, nm)) + ' = ' + vTex[i] + R` \approx ` + fm(vNum[i], 4));
          }
        }
        steps.push({
          t: '極値を求める',
          m: lines,
          n: exact ? R`増減表の $x=\alpha,\ \beta$ を $f(x)$ に代入して、極大値・極小値を求めます。` : R`解が無理数なので、$f(x)$ を $f'(x)$ で割った商と余りを使います。$f'(\alpha)=0$ なので、$f(\alpha)$ は余り（1 次式）に $x=\alpha$ を代入した値になります。`,
          easy: exact ? R`山と谷の位置 $x$ が分かったら、$f(x)$ に代入して高さを調べます。符号に注意して、分数や負の数は丁寧に計算します。` : R`$x$ が $\sqrt{\ \ }$ を含むと、3 乗の計算がとても大変です。そこで「$f(x) = f'(x) \times (\text{商}) + (\text{余り})$」という割り算の関係を使います。$f'(\alpha) = 0$ なので、掛け算の部分が消えて、余りだけが残ります。`,
          pro: R`3 次関数の極値は、$f(x)$ を $f'(x)$ で割った余りに代入する方法が定石です（無理数解でも 1 次式の代入で済みます）。`
        });
        const vMaxIdx = isMaxFirst ? 0 : 1, vMinIdx = 1 - vMaxIdx;
        const mm = (i) => vTex[i] + (exact ? '' : R` \approx ` + fm(vNum[i], 4));
        res = [
          { label: '導関数 f′(x)', tex: R`f'(x) = ` + ptex(f1) },
          { label: '極大値', tex: mm(vMaxIdx) + R`\ \ (x = ` + xTex[vMaxIdx] + ')' },
          { label: '極小値', tex: mm(vMinIdx) + R`\ \ (x = ` + xTex[vMinIdx] + ')' },
          { label: '増減', tex: up ? R`\text{増加 → 減少 → 増加}` : R`\text{減少 → 増加 → 減少}` }
        ];
      } else {
        const fp = P.eval(f, p0);
        const sgnLabel = up ? 1 : -1;
        if (D4.isZero()) {
          steps.push({
            t: R`$f'(x) = 0$ の解（重解）`,
            m: [R`f'(x) = 3 \cdot ` + parQ(a) + R`\left(x - ` + parQ(p0) + R`\right)^{2}`, R`x = ` + p0.tex() + R`\ \ (\text{重解}),\quad f(` + p0.tex() + R`) = ` + fp.tex()],
            n: R`$f'(x) = 3a(x-p)^{2}$ は常に $a$ と同じ符号（$x=p$ のとき 0）なので、増加（または減少）の向きが変わりません。$x=p$ で傾きが一瞬 $0$ になるだけで、極値ではありません。`,
            easy: R`$(x-p)^{2}$ は $0$ 以上なので、$f'(x)$ はずっと $a$ と同じ向きです。傾きが $0$ になる点が 1 つあっても、その前も後も同じ向きに進むので、山にも谷にもなりません（階段の踊り場のようなところです）。`
          });
          cols = [{ k: 'iv', s: sgnLabel }, { k: 'pt', x: p0.toString(), v: fp.toString(), tag: '' }, { k: 'iv', s: sgnLabel }];
          crit = []; fvals = [];
        } else {
          steps.push({
            t: R`$f'(x) = 0$ は実数解なし`,
            m: [R`f'(x) = ` + ptex(f1) + R` \;\Rightarrow\; \frac{D}{4} = ` + D4.tex() + R` < 0`],
            n: R`$f'(x)$ は常に $a$ と同じ符号で、$0$ にならないので、$f(x)$ はいつも増加（または減少）です。極値はありません。`,
            easy: R`$f'(x) = 0$ となる $x$ がない、つまり傾きが $0$ になる場所がありません。傾きがずっと正（または負）のままなので、グラフは山も谷もなく、右上がり（または右下がり）に伸びていきます。`
          });
          cols = [{ k: 'iv', s: sgnLabel }];
        }
        steps.push({
          t: '増減表をつくる',
          m: [D4.isZero() ? R`f'(x) = 3 \cdot ` + parQ(a) + R`(x - p)^{2} ` + (up ? R`\ge 0` : R`\le 0`) : R`f'(x) ` + (up ? '>' : '<') + ' 0\\ (\\text{すべての } x)'],
          n: R`$f(x)$ は全体を通して` + (up ? '増加' : '減少') + R`で、極大値・極小値はありません。`,
          easy: R`符号がずっと同じなので、増減表は 1 行（` + (up ? '↗' : '↘') + R`）だけです。極値はなし、と答えます。`,
          pro: R`極値をもたない条件は「$\frac{D}{4}=b^{2}-3ac \le 0$」です。「$f(x)$ が単調増加になる $a$ の範囲」を問う定番の逆算問題になります。`,
          fig: tableFig(cols)
        });
        res = [
          { label: '導関数 f′(x)', tex: R`f'(x) = ` + ptex(f1) },
          { label: '判別式 D/4', tex: R`\frac{D}{4} = ` + D4.tex() },
          { label: '極値', tex: R`\text{なし}（` + (up ? R`\text{単調に増加}` : R`\text{単調に減少}`) + '）' }
        ];
        crit = []; fvals = [];
        if (D4.isZero()) { steps.push({ t: '変曲点', m: [R`f'(` + p0.tex() + R`) = 0,\quad f(` + p0.tex() + R`) = ` + fp.tex()], n: R`$x=` + p0.tex() + R`$ では傾きが $0$ ですが、極値ではなく、グラフの曲がる向きが変わる点（変曲点）にあたります。`, easy: R`この点でグラフは平らになりますが、またすぐ同じ向きに上がり（下がり）はじめます。山でも谷でもない、「ねころがった S 字の中央」のような点です。`, lv: 3 }); }
      }
      steps.push({
        t: 'グラフの形で確かめる',
        m: [R`x \to +\infty:\ f(x) \to ` + (up ? R`+\infty` : R`-\infty`), R`x \to -\infty:\ f(x) \to ` + (up ? R`-\infty` : R`+\infty`)],
        n: R`$x^{3}$ の係数 $a$ の符号で、右端・左端の向きが決まります（$a>0$ なら右上がりで始まり右上がりで終わる）。増減表のグラフと一致するか確かめます。`,
        easy: R`3 次関数は、$x$ が十分大きいとき $ax^{3}$ の項が圧倒的に大きくなり、符号は $a$ で決まります。$a>0$ なら右端は上へ、左端は下へ伸びます。増減表の矢印の向きが、この左右の端の向きと矛盾していないか確かめます。`,
        lv: 2
      });
      return { result: res, steps: steps, fig: cubicFig(f, crit, fvals, p0.val()) };
    }
  });

  /* ================= 3. 多項式の不定積分・定積分 ================= */

  // [lo, hi] での f の符号つき分割: { pts: [...], exact: bool }（分点は Q か Number）
  function splitPoints(f, lo, hi) {
    const loV = lo.val(), hiV = hi.val();
    const pts = [];
    P.rationalRoots(f).forEach((r) => { if (r.cmp(lo) > 0 && r.cmp(hi) < 0) pts.push({ q: r, v: r.val() }); });
    const fn = P.fn(f), N = 4000;
    let x0 = loV, y0 = fn(x0);
    for (let i = 1; i <= N; i++) {
      const x1 = loV + (hiV - loV) * i / N, y1 = fn(x1);
      if ((y0 < 0 && y1 > 0) || (y0 > 0 && y1 < 0)) {
        let l = x0, h = x1, yl = y0;
        for (let k = 0; k < 80; k++) {
          const m = (l + h) / 2, ym = fn(m);
          if ((yl < 0 && ym < 0) || (yl > 0 && ym > 0)) { l = m; yl = ym; } else h = m;
        }
        const r = (l + h) / 2;
        if (!pts.some((p) => Math.abs(p.v - r) < 1e-7)) pts.push({ q: null, v: r });
      }
      x0 = x1; y0 = y1;
    }
    pts.sort((p, q) => p.v - q.v);
    return pts;
  }

  function integFig(f, lo, hi, pieces) {
    const loV = lo.val(), hiV = hi.val(), mg = Math.max((hiV - loV) * 0.25, 0.5);
    const fn = P.fn(f);
    const fills = pieces.map((pc) => ({ f: fn, from: pc.l, to: pc.r, cls: pc.s > 0 ? 'f1' : 'f3' }));
    return JK.plot.graph({
      w: 340, h: 250, x: [loV - mg, hiV + mg], y: yRange(fn, loV - mg, hiV + mg, [0]),
      curves: [{ f: fn, cls: 'c1' }], fills: fills,
      vlines: [{ x: loV, label: 'x=' + lo.toString(), dash: true }, { x: hiV, label: 'x=' + hi.toString(), dash: true }]
    });
  }

  JK.registerCalc({
    id: 'iib-integ-poly',
    course: 'IIB',
    unit: 'm-calc2',
    group: '微分・積分',
    title: '多項式の不定積分・定積分',
    desc: R`多項式 $f(x)$ の不定積分 $\int f(x)\,dx$ と、区間 $[a,\ b]$ の定積分 $\int_{a}^{b} f(x)\,dx$ を分数のまま厳密に求めます。$x$ 軸の上下で符号が変わる場合の「符号つき面積」と「面積」の違いも示します。`,
    form: [R`\int x^{n}\,dx = \frac{1}{n+1}x^{n+1} + C`, R`\int_{a}^{b} f(x)\,dx = \left[F(x)\right]_{a}^{b} = F(b) - F(a)`],
    inputs: [
      { key: 'f', label: R`$f(x)$`, type: 'poly', def: 'x^2 - 4', hint: R`多項式で入力します（8 次まで）。` },
      { key: 'a', label: R`下端 $a$`, type: 'q', def: '-1' },
      { key: 'b', label: R`上端 $b$`, type: 'q', def: '3', hint: R`$a < b$ となるように入力します。` }
    ],
    examples: [
      { label: 'x 軸の上下をまたぐ', v: { f: 'x^2 - 4', a: '-1', b: '3' } },
      { label: '常に正の関数', v: { f: '3x^2 + 2x + 1', a: '0', b: '2' } },
      { label: '3 次関数', v: { f: 'x^3 - 3x^2 + 2', a: '0', b: '3' } },
      { label: '分数の端点', v: { f: '2x - 1', a: '1/2', b: '5/2' } },
      { label: '無理数の交点をまたぐ', v: { f: 'x^2 - 2', a: '0', b: '3' } }
    ],
    intro: {
      easy: R`**積分**は、微分の逆の計算です。$F'(x) = f(x)$ となる関数 $F(x)$ を、$f(x)$ の**原始関数**といいます。たとえば $x^{2}$ を微分すると $2x$ なので、$2x$ の原始関数は $x^{2}$（に定数を足したもの）です。定数は微分すると消えるので、不定積分には「$+C$」（積分定数）をつけます。
**定積分** $\int_{a}^{b} f(x)\,dx$ は、原始関数 $F$ を使って $F(b) - F(a)$ と計算します。意味は「グラフと $x$ 軸ではさまれた部分の面積（ただし $x$ 軸より下の部分は**マイナス**の面積として数える）」です。面積そのものを求めたいときは、符号が変わる所で区切って、それぞれの絶対値を足します。`,
      normal: R`$\int x^{n}dx = \frac{x^{n+1}}{n+1}+C$。定積分は $[F(x)]_{a}^{b} = F(b)-F(a)$（$C$ は引き算で消える）。面積は $f(x)$ の符号で区切って $\int|f(x)|dx$。`,
      pro: R`定積分の計算は、分数の通分ミスが最大の敵です。$F(b)$ と $F(a)$ を別々に計算して引く、あるいは項ごとに $\left[\frac{x^{n+1}}{n+1}\right]_{a}^{b}$ を計算して足す、のどちらかで統一します。偶関数・奇関数の対称性（$\int_{-a}^{a}$）も時短になります。`
    },
    compute(v) {
      const f = v.f, a = v.a, b = v.b;
      if (P.isZero(f)) throw new JK.CalcError('f(x) が 0 です。多項式を入力してください');
      if (P.deg(f) > 8) throw new JK.CalcError('次数は 8 次以下にしてください');
      if (a.cmp(b) >= 0) throw new JK.CalcError('下端 a は上端 b より小さくなるように入力してください');
      const F = P.integ(f);
      const Fa = P.eval(F, a), Fb = P.eval(F, b), I = Fb.sub(Fa);
      const pts = splitPoints(f, a, b);
      const bounds = [{ q: a, v: a.val() }].concat(pts, [{ q: b, v: b.val() }]);
      const pieces = [];
      for (let i = 0; i + 1 < bounds.length; i++) {
        const l = bounds[i], r = bounds[i + 1];
        const mid = (l.v + r.v) / 2;
        const s = P.eval(f, mid) >= 0 ? 1 : -1;
        const exact = !!(l.q && r.q);
        const val = exact ? P.eval(F, r.q).sub(P.eval(F, l.q)) : null;
        const valNum = exact ? val.val() : P.eval(F, r.v) - P.eval(F, l.v);
        pieces.push({ l: l.v, r: r.v, s: s, exact: exact, val: val, num: valNum, lq: l.q, rq: r.q });
      }
      const allExact = pieces.every((p) => p.exact);
      const changes = pieces.some((p) => p.s !== pieces[0].s);
      const areaQ = allExact ? pieces.reduce((s, p) => s.add(p.val.abs()), Q(0)) : null;
      const areaNum = pieces.reduce((s, p) => s + Math.abs(p.num), 0);
      const fTex = ptex(f), FTex = ptex(F);
      const steps = [];
      steps.push({
        t: '積分とは（微分の逆）',
        m: [R`\frac{d}{dx}\left(\frac{x^{n+1}}{n+1}\right) = x^{n}`, R`F'(x) = f(x) \;\Rightarrow\; \int f(x)\,dx = F(x) + C`],
        n: R`積分は微分の逆の操作です。$F(x)$ を微分して $f(x)$ になるとき、$F(x)$ を $f(x)$ の原始関数といい、不定積分は $F(x) + C$ と書きます。`,
        easy: R`微分が「$x^{n}$ を $nx^{n-1}$ にする」操作だったので、その逆は「$x^{n-1}$ を $\frac{1}{n}x^{n}$ にする」操作です。足し算と引き算、かけ算と割り算のような関係です。$x^{2}$ も $x^{2}+5$ も微分すると $2x$ になるので、元の定数は決まりません。それで $+C$ と書きます。`,
        lv: 3
      });
      steps.push({
        t: '不定積分の公式',
        m: [R`\int x^{n}\,dx = \frac{1}{n+1}x^{n+1} + C\quad (n = 0,\ 1,\ 2,\ \cdots)`, R`\int k\,dx = kx + C,\qquad \int kf(x)\,dx = k\int f(x)\,dx`],
        n: R`各項の指数を 1 増やして、新しい指数で割ります。定数倍は外に出せます。`,
        easy: R`$x^{2}$ なら指数を $3$ に増やして $3$ で割り、$\frac{1}{3}x^{3}$。「指数を 1 増やして、その数で割る」と唱えます。微分のちょうど逆の動きです。`,
        pro: R`$\int x^{n}dx$ の公式は暗算で。定積分では $C$ を書く必要はありません。`
      });
      const termLines = [];
      for (let n = P.deg(f); n >= 0; n--) {
        const c = f[n];
        if (c.isZero()) continue;
        termLines.push(R`\int ` + (c.sign() < 0 ? pa(termStr(c, n)) : termStr(c, n)) + R`\,dx = ` + termStr(c.div(n + 1), n + 1));
      }
      steps.push({
        t: '項ごとに積分する',
        m: termLines.concat([R`F(x) = ` + FTex]),
        n: R`各項を公式で積分して足します。ここでは積分定数 $C$ を除いた $F(x) = ` + FTex + R`$ を使います。`,
        easy: R`たとえば $6x^{2}$ なら、指数 $2$ を $3$ にして、係数 $6$ を $3$ で割ると $2x^{3}$ です。項が何個あっても 1 つずつ積分して並べるだけです。`
      });
      steps.push({
        t: '定積分の計算法',
        m: [R`\int_{a}^{b} f(x)\,dx = \left[F(x)\right]_{a}^{b} = F(b) - F(a)`],
        n: R`上端 $b$ を代入した値から、下端 $a$ を代入した値を引きます。$F(x) + C$ のどの $C$ でも、引き算で消えます。`,
        easy: R`定積分は「ゴール $b$ での値 $F(b)$ から、スタート $a$ での値 $F(a)$ を引く」計算です。$F(x)$ が「$x$ までにたまった量」だと考えると、$a$ から $b$ までに増えた分が $F(b) - F(a)$ です。`,
        pro: R`$F(a)$ と $F(b)$ の計算は別々に行い、符号ミスを防ぎます。`
      });
      steps.push({
        t: R`$F(b)$ と $F(a)$ を求める`,
        m: [
          R`F(` + b.tex() + R`) = ` + substTex(F, b) + ' = ' + Fb.tex(),
          R`F(` + a.tex() + R`) = ` + substTex(F, a) + ' = ' + Fa.tex()
        ],
        n: R`分数の通分に注意して、$F(x)$ に上端・下端を代入します。`,
        easy: R`$F(x) = ` + FTex + R`$ の $x$ に $` + b.tex() + R`$ と $` + a.tex() + R`$ をそれぞれ入れて、別々に計算します。負の数や分数は括弧をつけて代入するとミスが減ります。`
      });
      steps.push({
        t: '定積分の値',
        m: [R`\int_{` + a.tex() + '}^{' + b.tex() + R`} (` + fTex + R`)\,dx = F(` + b.tex() + R`) - F(` + a.tex() + R`) = ` + Fb.tex() + ' - ' + parQ(Fa) + ' = ' + I.tex()],
        n: R`定積分の値は $` + I.tex() + (I.isInt() ? '' : R` \approx ` + fm(I.val(), 4)) + R`$ です。` + (changes ? R`この区間では $f(x)$ の符号が変わるので、これは「符号つき面積」で、面積そのものとは異なります。` : (pieces[0].s > 0 ? R`この区間で $f(x) \ge 0$ なので、定積分の値はそのまま面積です。` : R`この区間で $f(x) \le 0$ なので、定積分は負で、面積は絶対値です。`)),
        easy: R`定積分の値は、グラフと $x$ 軸ではさまれた部分の面積のうち、$x$ 軸より上を「プラス」、下を「マイナス」として足し合わせたものです。`
      });
      if (changes || pieces[0].s < 0) {
        const lines = pieces.map((p) => {
          const lt = p.lq ? p.lq.tex() : fm(p.l, 4), rt = p.rq ? p.rq.tex() : fm(p.r, 4);
          return R`\int_{` + lt + '}^{' + rt + R`} f(x)\,dx = ` + (p.exact ? p.val.tex() : R`\approx ` + fm(p.num, 4)) + R`\quad (` + (p.s > 0 ? R`\text{上}` : R`\text{下}`) + ')';
        });
        lines.push(R`S = ` + pieces.map((p) => (p.exact ? p.val.abs().tex() : fm(Math.abs(p.num), 4))).join(' + ') + ' = ' + (allExact ? areaQ.tex() : R`\approx ` + fm(areaNum, 4)));
        steps.push({
          t: '面積（符号が変わる所で区切る）',
          m: lines,
          n: R`$x$ 軸より下の部分は定積分が負になるので、符号が変わる $x$（$f(x)=0$ の解）で区間を分け、それぞれ絶対値をとって足します。` + (allExact ? '' : R`分点が無理数なので、面積は近似値です。`),
          easy: R`面積は「ふつうの広さ」なので、マイナスにはなりません。そこで、グラフが $x$ 軸をまたぐ所で区間を分け、下側の部分は符号を反対にして（絶対値をとって）足します。こうすると本当の面積が求まります。`,
          pro: R`面積を問う問題では、まず $f(x)$ の符号を調べる（グラフを描く）のが鉄則です。符号つき面積をそのまま答えにするミスが定番です。`
        });
      }
      const res = [
        { label: '不定積分', tex: R`\int f(x)\,dx = ` + FTex + ' + C' },
        { label: '定積分', tex: R`\int_{` + a.tex() + '}^{' + b.tex() + R`} f(x)\,dx = ` + I.tex() + (I.isInt() ? '' : R` \approx ` + fm(I.val(), 4)) }
      ];
      if (changes || pieces[0].s < 0) res.push({ label: '面積 S', tex: 'S = ' + (allExact ? areaQ.tex() + (areaQ.isInt() ? '' : R` \approx ` + fm(areaQ.val(), 4)) : R`\approx ` + fm(areaNum, 4)) });
      return { result: res, steps: steps, fig: integFig(f, a, b, pieces) };
    }
  });

  /* ================= 4. 面積（放物線と x 軸・直線・放物線） ================= */

  function areaFig(f1, other, al, be, mode, upperIsF1) {
    const x0 = al - Math.max((be - al) * 0.3, 0.5), x1 = be + Math.max((be - al) * 0.3, 0.5);
    const g1 = P.fn(f1), g2 = P.fn(other);
    const up = upperIsF1 ? g1 : g2, lo = upperIsF1 ? g2 : g1;
    const o = {
      w: 340, h: 260, x: [x0, x1], y: yRange(g1, x0, x1, [0, g2(al), g2(be)].concat(mode === 'axis' ? [0] : [g2(x0), g2(x1)])),
      curves: [{ f: g1, cls: 'c1' }],
      fills: [{ f: up, g: lo, from: al, to: be, cls: 'f1' }],
      points: [{ x: al, y: g1(al), cls: 'c3', label: 'x=' + fm(al, 3), pos: 'tl' }, { x: be, y: g1(be), cls: 'c3', label: 'x=' + fm(be, 3), pos: 'tr' }],
      vlines: [{ x: al, dash: true }, { x: be, dash: true }]
    };
    if (mode !== 'axis') o.curves.push({ f: g2, cls: 'c2' });
    return JK.plot.graph(o);
  }
  function simpson(fn, a, b, n) {
    const h = (b - a) / n;
    let s = fn(a) + fn(b);
    for (let i = 1; i < n; i++) s += fn(a + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  }

  JK.registerCalc({
    id: 'iib-area',
    course: 'IIB',
    unit: 'm-calc2',
    group: '微分・積分',
    title: '面積（放物線と x 軸・直線・放物線）',
    desc: R`放物線と $x$ 軸、放物線と直線、2 つの放物線で囲まれた部分の面積を、交点 → 上下関係 → 定積分の順に求めます。$\frac{|a|}{6}(\beta-\alpha)^{3}$ の公式（$\frac{1}{6}$ 公式）で検算します。`,
    form: [R`S = \int_{\alpha}^{\beta} \{(\text{上}) - (\text{下})\}\,dx`, R`S = \frac{|a|}{6}(\beta - \alpha)^{3}`],
    inputs: [
      { key: 'mode', label: '囲む図形', type: 'select', def: 'axis', options: [['axis', '放物線と x 軸'], ['line', '放物線と直線'], ['two', '2 つの放物線']] },
      { key: 'a', label: R`放物線 $y = ax^{2}+bx+c$ の $a$`, type: 'q', def: '-1' },
      { key: 'b', label: R`$b$`, type: 'q', def: '2' },
      { key: 'c', label: R`$c$`, type: 'q', def: '3' },
      { key: 'm', label: R`直線 $y = mx + n$ の $m$`, type: 'q', def: '1', show: (r) => r.mode === 'line' },
      { key: 'n', label: R`$n$`, type: 'q', def: '2', show: (r) => r.mode === 'line' },
      { key: 'a2', label: R`2 つ目の放物線 $y = a_{2}x^{2}+b_{2}x+c_{2}$ の $a_{2}$`, type: 'q', def: '1', show: (r) => r.mode === 'two' },
      { key: 'b2', label: R`$b_{2}$`, type: 'q', def: '0', show: (r) => r.mode === 'two' },
      { key: 'c2', label: R`$c_{2}$`, type: 'q', def: '-1', show: (r) => r.mode === 'two' }
    ],
    examples: [
      { label: '放物線と x 軸', v: { mode: 'axis', a: '-1', b: '2', c: '3' } },
      { label: '放物線と直線', v: { mode: 'line', a: '1', b: '0', c: '0', m: '1', n: '2' } },
      { label: '2 つの放物線', v: { mode: 'two', a: '-1', b: '0', c: '4', a2: '1', b2: '0', c2: '-4' } },
      { label: '交点が無理数', v: { mode: 'line', a: '1', b: '0', c: '0', m: '1', n: '1' } },
      { label: '下に凸と x 軸', v: { mode: 'axis', a: '2', b: '-4', c: '-6' } },
      { label: '係数が分数', v: { mode: 'two', a: '1/2', b: '0', c: '0', a2: '-1/2', b2: '1', c2: '3' } }
    ],
    intro: {
      easy: R`曲線で囲まれた部分の面積は、**積分**で求められます。細い縦の短冊に切り分けて、「（上の曲線の高さ）−（下の曲線の高さ）」をたくさん足し合わせたものが定積分です。
手順は 3 つです。(1) 2 つの図形の式を連立して**交点の $x$ 座標** $\alpha,\ \beta$ を求める (2) $\alpha < x < \beta$ のとき**どちらが上か**を調べる (3) $\int_{\alpha}^{\beta}\{(\text{上}) - (\text{下})\}\,dx$ を計算する。
放物線と直線、あるいは 2 つの放物線で囲まれた部分では、「上 − 下」は $-|a|(x-\alpha)(x-\beta)$ の形になり、面積は**公式** $\frac{|a|}{6}(\beta-\alpha)^{3}$ で一気に求まります（$\frac{1}{6}$ 公式）。`,
      normal: R`交点 $\alpha<\beta$ を求め、$\alpha \le x \le \beta$ で（上）−（下）を積分します。（上）−（下）が $-a(x-\alpha)(x-\beta)$ なら $S = \frac{|a|}{6}(\beta-\alpha)^{3}$。`,
      pro: R`$\frac{1}{6}$ 公式は、$\beta-\alpha = \frac{\sqrt{D}}{|a|}$ を使うと $S = \frac{D\sqrt{D}}{6a^{2}}$ とも書けます（解の公式から交点が無理数でもすぐ出ます）。囲まれる図形が 2 つの放物線のときは、$a$ に「$x^{2}$ の係数の差」を使う点に注意します。`
    },
    compute(v) {
      const mode = String(v.mode);
      const f1 = [v.c, v.b, v.a];
      let other, otherTex;
      if (mode === 'axis') { other = [Q(0)]; otherTex = '0'; }
      else if (mode === 'line') { other = [v.n, v.m]; otherTex = ptex(other); }
      else { other = [v.c2, v.b2, v.a2]; otherTex = ptex(other); }
      const g = P.sub(f1, other);
      const A = co(g, 2), B = co(g, 1), C = co(g, 0);
      if (A.isZero()) throw new JK.CalcError(mode === 'two' ? '2 つの放物線の x² の係数が等しいため、交点が 2 つできません（囲まれた部分がありません）' : 'a は 0 以外を入力してください（放物線にならないため）');
      const D = B.mul(B).sub(A.mul(C).mul(4));
      if (D.sign() <= 0) throw new JK.CalcError('交わらない（または接するだけ）なので、囲まれた部分がありません（判別式 D = ' + D.toString() + ' ≦ 0）');
      const rs = ratSqrt(D);
      const sp = rs ? { c: rs, m: 1 } : sqrtParts(D);
      const p0 = B.neg().div(A.mul(2));
      const sAbs = sp.c.abs().div(A.abs().mul(2));
      const exact = sp.m === 1;
      const alQ = exact ? p0.sub(sAbs) : null, beQ = exact ? p0.add(sAbs) : null;
      const alTex = exact ? alQ.tex() : surdQ(p0, sAbs.neg(), sp.m), beTex = exact ? beQ.tex() : surdQ(p0, sAbs, sp.m);
      const al = p0.val() - sAbs.val() * Math.sqrt(sp.m), be = p0.val() + sAbs.val() * Math.sqrt(sp.m);
      const upperIsF1 = A.sign() < 0;
      const H = upperIsF1 ? g : P.neg(g);                       // 上 − 下
      const widthTex = surdQ(Q(0), sAbs.mul(2), sp.m);              // β − α（= √D / |A|）
      const Sq = U.sqrtTex(D.pow(3).div(A.pow(4).mul(36)));
      const Sv = Math.pow(D.val(), 1.5) / (6 * A.val() * A.val());
      const simp = simpson(P.fn(H), al, be, 400);
      const absA = A.abs();
      const stepsA = [];
      const nameUp = mode === 'axis' ? (upperIsF1 ? R`\text{放物線}` : R`x \text{ 軸}（y = 0）`) : (mode === 'line' ? (upperIsF1 ? R`\text{放物線}` : R`\text{直線}`) : (upperIsF1 ? R`\text{1 つ目の放物線}` : R`\text{2 つ目の放物線}`));
      const nameLo = mode === 'axis' ? (upperIsF1 ? R`x \text{ 軸}（y = 0）` : R`\text{放物線}`) : (mode === 'line' ? (upperIsF1 ? R`\text{直線}` : R`\text{放物線}`) : (upperIsF1 ? R`\text{2 つ目の放物線}` : R`\text{1 つ目の放物線}`));
      stepsA.push({
        t: '面積と定積分の関係',
        m: [R`S = \int_{\alpha}^{\beta} \{(\text{上の式}) - (\text{下の式})\}\,dx\quad (\alpha \le x \le \beta)`],
        n: R`$\alpha \le x \le \beta$ の範囲で、上にある曲線の式から下にある曲線の式を引いた関数を積分すると、はさまれた部分の面積になります。`,
        easy: R`囲まれた部分を、$x$ 軸に垂直な細い短冊に切ります。1 本の短冊の高さは「上の曲線の $y$ − 下の曲線の $y$」、幅はほとんど $0$ です。それを $x=\alpha$ から $x=\beta$ まで全部足したものが定積分で、足し合わせた結果が面積になります。上下を逆にすると、面積がマイナスになってしまうので注意します。`,
        lv: 3
      });
      stepsA.push({
        t: '交点の $x$ 座標',
        m: [
          mode === 'axis' ? R`y = ` + ptex(f1) + R`\ \text{と}\ y = 0` : (mode === 'line' ? R`y = ` + ptex(f1) + R`\ \text{と}\ y = ` + otherTex : R`y = ` + ptex(f1) + R`\ \text{と}\ y = ` + otherTex),
          ptex(f1) + ' = ' + otherTex + R` \;\Rightarrow\; ` + ptex(g) + ' = 0',
          R`D = B^{2} - 4AC = ` + D.tex(),
          R`x = \frac{-B \pm \sqrt{D}}{2A} = ` + alTex + R`,\ ` + beTex + (exact ? '' : R`\ \ (\approx ` + fm(al, 3) + R`,\ ` + fm(be, 3) + ')')
        ],
        n: R`2 つの式を連立して $y$ を消し、$x$ の 2 次方程式 $` + ptex(g) + R` = 0$ を解きます。判別式 $D=` + D.tex() + R` > 0$ なので、異なる 2 つの交点があり、$\alpha<\beta$ とします。`,
        easy: R`2 つのグラフがぶつかる所では $y$ の値が等しいので、2 つの式を「$=$」でつないで $x$ だけの方程式にします。その解が交点の $x$ 座標で、囲まれた部分の左端 $\alpha$・右端 $\beta$ になります。解の公式は $x = \frac{-B \pm \sqrt{B^{2}-4AC}}{2A}$ です。`,
        pro: R`$f(x) = g(x)$ を整理するときは「（上）−（下）」ではなく、とりあえず $f-g$ の形で $=0$ にして構いません。`
      });
      stepsA.push({
        t: '上下関係を調べる',
        m: [R`\alpha < x < \beta \text{ では } ` + nameUp + R` \ge ` + nameLo, R`\text{（上）} - \text{（下）} = ` + ptex(H)],
        n: R`$x^{2}$ の係数 $` + A.tex() + (A.sign() > 0 ? R`> 0$ なので、$\alpha<x<\beta$ では $f(x)-g(x)<0$（` + (mode === 'axis' ? 'グラフは x 軸の下' : '1 つ目の式は下') + R`）` : R`< 0$ なので、$\alpha<x<\beta$ では $f(x)-g(x)>0$（` + (mode === 'axis' ? 'グラフは x 軸の上' : '1 つ目の式は上') + R`）`) + R`です。そこで（上）−（下）は $` + ptex(H) + R`$ になります。`,
        easy: R`2 次関数の差 $` + ptex(g) + R`$ は、$x^{2}$ の係数が` + (A.sign() > 0 ? '正' : '負') + R`なので、2 つの交点の間では` + (A.sign() > 0 ? '負（下に落ちた形）' : '正（盛り上がった形）') + R`です。真ん中あたりの $x$ を 1 つ代入して符号を確かめると、どちらが上か分かります。`,
        pro: R`囲まれた部分の「上 − 下」は、必ず $-|a|(x-\alpha)(x-\beta)$ の形（$a$ は $x^{2}$ の係数の差）です。`
      });
      if (exact) {
        const F = P.integ(H);
        const Fb = P.eval(F, beQ), Fa = P.eval(F, alQ);
        stepsA.push({
          t: '定積分を計算する',
          m: [
            R`S = \int_{` + alQ.tex() + '}^{' + beQ.tex() + R`} (` + ptex(H) + R`)\,dx = \left[` + ptex(F) + R`\right]_{` + alQ.tex() + '}^{' + beQ.tex() + '}',
            R`F(` + beQ.tex() + R`) = ` + substTex(F, beQ) + ' = ' + Fb.tex(),
            R`F(` + alQ.tex() + R`) = ` + substTex(F, alQ) + ' = ' + Fa.tex(),
            R`S = F(` + beQ.tex() + R`) - F(` + alQ.tex() + R`) = ` + Fb.tex() + ' - ' + parQ(Fa) + ' = ' + Fb.sub(Fa).tex()
          ],
          n: R`（上）−（下）の原始関数 $F(x)$ を求め、$F(\beta) - F(\alpha)$ を計算します。`,
          easy: R`上で調べた「上 − 下」の式を積分して、$F(x)$ をつくります。次に、右端 $\beta$ を入れた値から左端 $\alpha$ を入れた値を引きます。分数が出てくるので、通分を慎重に行います。`,
          pro: R`この計算は $\frac{1}{6}$ 公式で一瞬です。次のステップで確かめます。`
        });
      }
      stepsA.push({
        t: R`$\frac{1}{6}$ 公式で求める`,
        m: [
          R`\int_{\alpha}^{\beta} (x-\alpha)(x-\beta)\,dx = \int_{\alpha}^{\beta} (x-\alpha)\{(x-\alpha) - (\beta-\alpha)\}\,dx`,
          R`= \left[\frac{(x-\alpha)^{3}}{3} - \frac{(\beta-\alpha)(x-\alpha)^{2}}{2}\right]_{\alpha}^{\beta} = \frac{(\beta-\alpha)^{3}}{3} - \frac{(\beta-\alpha)^{3}}{2} = -\frac{(\beta-\alpha)^{3}}{6}`,
          R`S = \frac{|a|}{6}(\beta - \alpha)^{3},\qquad \beta - \alpha = \frac{\sqrt{D}}{|a|}`,
          R`S = \frac{` + absA.tex() + '}{6}' + R`\left(` + widthTex + R`\right)^{3} = ` + Sq + (/\\sqrt/.test(Sq) ? R` \approx ` + fm(Sv, 4) : '')
        ],
        n: R`2 つの交点を $\alpha,\ \beta$ とすると、（上）−（下）は $-|a|(x-\alpha)(x-\beta)$ です。これを $\alpha$ から $\beta$ まで積分すると $\frac{|a|}{6}(\beta-\alpha)^{3}$ になります。`,
        easy: R`$(x-\alpha)(x-\beta)$ を積分するとき、「$x-\alpha$ をひとかたまり」と見て、$(x-\beta) = (x-\alpha) - (\beta-\alpha)$ と書き直します。すると 3 乗と 2 乗の項になり、それぞれ簡単に積分できて、$-\frac{(\beta-\alpha)^{3}}{6}$ となります。この結果を知っていれば、放物線で囲まれた面積は交点の幅だけで求まります。`,
        pro: R`囲まれた部分が放物線と直線（または放物線どうし）なら、$S = \frac{|a|}{6}(\beta-\alpha)^{3}$ を即座に使います（$a$ は $x^{2}$ の係数の差）。交点が無理数でも $\beta-\alpha=\frac{\sqrt{D}}{|a|}$ で済みます。`
      });
      stepsA.push({
        t: '数値で確かめる（シンプソン法）',
        m: [R`S = \int_{\alpha}^{\beta} (` + ptex(H) + R`)\,dx \approx ` + fm(simp, 6), R`\frac{D\sqrt{D}}{6A^{2}} = ` + (/\\sqrt/.test(Sq) ? R`\frac{` + D.tex() + R`\sqrt{` + D.tex() + R`}}{6 \cdot ` + A.mul(A).tex() + R`} \approx ` : '') + fm(Sv, 6)],
        n: R`コンピュータでよく使う近似計算（シンプソン法）で積分の値を求めると、公式の値とほぼ一致します。`,
        easy: R`面積を、細かく分けた短冊の面積の合計（精密な近似）で数値計算した結果と、公式で求めた正確な値を比べています。ほとんど同じ値なので、計算にミスがないと分かります。`,
        lv: 3
      });
      return {
        result: [
          { label: '交点の x 座標', tex: R`x = ` + alTex + R`,\ ` + beTex },
          { label: '面積 S（正確な値）', tex: 'S = ' + Sq },
          { label: '面積 S（近似値）', tex: R`S \approx ` + fm(Sv, 4) }
        ],
        steps: stepsA,
        fig: areaFig(f1, other, al, be, mode, upperIsF1)
      };
    }
  });

  /* ================= 5. 曲線外の点から 2 次関数に引いた接線 ================= */

  // 接線 y = kx + n（k, n は u + v√r）の TeX
  function lineTexPair(k, n, r) {
    const kIrr = r !== 1 && !k[1].isZero(), nIrr = r !== 1 && !n[1].isZero();
    const kq = r === 1 ? k[0].add(k[1]) : k[0], nq = r === 1 ? n[0].add(n[1]) : n[0];
    let s = 'y = ';
    if (kIrr) s += R`\left(` + surdQ(k[0], k[1], r) + R`\right)x`;
    else if (kq.isZero()) s += '';
    else s += (kq.eq(1) ? '' : (kq.eq(-1) ? '-' : kq.tex())) + 'x';
    if (nIrr) s += (s === 'y = ' ? '' : ' + ') + R`\left(` + surdQ(n[0], n[1], r) + R`\right)`;
    else if (!nq.isZero()) s += s === 'y = ' ? nq.tex() : (nq.sign() < 0 ? ' - ' + nq.abs().tex() : ' + ' + nq.tex());
    else if (s === 'y = ') s += '0';
    return s;
  }

  JK.registerCalc({
    id: 'iib-tangent-from',
    course: 'IIB',
    unit: 'm-calc2',
    group: '微分・積分',
    title: '曲線外の点から 2 次関数に引く接線',
    desc: R`放物線 $y = ax^{2}+bx+c$ の外にある点 $(p,\ q)$ を通る接線を、接点の $x$ 座標を $t$ とおいて求めます。接点・接線の方程式（1 本または 2 本）を厳密値で示し、判別式による別解で確かめます。`,
    form: [R`y = f(t) + f'(t)(x - t)`, R`f(x) = ax^{2} + bx + c,\quad f'(x) = 2ax + b`],
    inputs: [
      { key: 'a', label: R`$a$`, type: 'q', def: '1' },
      { key: 'b', label: R`$b$`, type: 'q', def: '0' },
      { key: 'c', label: R`$c$`, type: 'q', def: '0' },
      { key: 'p', label: R`点の $x$ 座標 $p$`, type: 'q', def: '1' },
      { key: 'q', label: R`点の $y$ 座標 $q$`, type: 'q', def: '-3', hint: R`放物線の外側の点（下に凸なら放物線より下側）を入力します。` }
    ],
    examples: [
      { label: 'y = x² の外の点 (1, −3)', v: { a: '1', b: '0', c: '0', p: '1', q: '-3' } },
      { label: '接点が無理数', v: { a: '1', b: '0', c: '0', p: '1', q: '-1' } },
      { label: '上に凸の放物線', v: { a: '-1', b: '2', c: '3', p: '0', q: '6' } },
      { label: '曲線上の点（接線 1 本）', v: { a: '1', b: '-2', c: '3', p: '2', q: '3' } },
      { label: '係数が分数', v: { a: '1/2', b: '1', c: '-1', p: '2', q: '-4' } }
    ],
    intro: {
      easy: R`曲線の**外にある点** $P(p,\ q)$ から曲線に引いた接線は、曲線上にない点を通るので、これまでの「接点が分かっているときの接線」の公式がそのままでは使えません。そこで、**接点の $x$ 座標を文字 $t$ とおきます**。
接点が $(t,\ f(t))$ なら、接線の方程式は $y = f'(t)(x - t) + f(t)$ と $t$ を使って書けます。この接線が点 $P$ を通るので、$x=p,\ y=q$ を代入すると $t$ の方程式になります。それを解けば接点が決まり、接線も決まります。放物線の外の点からは、ふつう**接線が 2 本**引けます。`,
      normal: R`接点を $(t,\ f(t))$ とおき、接線 $y = f'(t)(x-t)+f(t)$ が点 $(p,\ q)$ を通る条件から $t$ の 2 次方程式を立てて解きます。$t$ が 2 つなら接線は 2 本、重解なら点が曲線上にあり 1 本、実数解なしなら（内側の点なので）引けません。`,
      pro: R`別解として、点 $P$ を通る傾き $m$ の直線 $y = m(x-p)+q$ と放物線を連立し、判別式 $D=0$ から $m$ を求めることもできます。接点 $t$ の方程式は $t^{2}-2pt-\frac{c+bp-q}{a} = 0$ なので、解は $t = p \pm \sqrt{\frac{f(p)-q}{a}}$ と一発で書けます。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c, p = v.p, q = v.q;
      if (a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（放物線にならないため）');
      const fq = [c, b, a];
      const fp = P.eval(fq, p);
      const mm = fp.sub(q).div(a);
      if (mm.sign() < 0) throw new JK.CalcError('点 (' + p.toString() + ', ' + q.toString() + ') は放物線の内側にあるため、接線は引けません。外側の点を入力してください');
      const rs = ratSqrt(mm);
      const sp = rs ? { c: rs, m: 1 } : sqrtParts(mm);
      const r = sp.m;
      const two = !mm.isZero();
      // 接点 t（Z[√r] の数）
      const ts = two ? [[p, sp.c.neg()], [p, sp.c]] : [[p, Q(0)]];
      const tNorm = ts.map((t) => (r === 1 ? [t[0].add(t[1]), Q(0)] : t));
      const tTex = tNorm.map((t) => surdQ(t[0], t[1], r));
      const tNum = tNorm.map((t) => pv(t, r));
      const kk = tNorm.map((t) => pAdd(pSc(t, a.mul(2)), [b, Q(0)]));                    // 傾き 2at + b
      const nn = tNorm.map((t) => { const t2 = pMul(t, t, r); return pAdd([c, Q(0)], pSc(t2, a.neg())); });   // 切片 c - at²
      const lines = kk.map((k, i) => lineTexPair(k, nn[i], r));
      const kNum = kk.map((k) => pv(k, r)), nNum = nn.map((n) => pv(n, r));
      const slopeT = P.tex([b, a.mul(2)], 't');                  // 2at + b
      const restT = P.tex([c, Q(0), a.neg()], 't');              // -at² + c
      const tPoly = (p0) => P.tex(p0, 't');
      const steps = [];
      steps.push({
        t: '接線の方程式（接点が決まれば決まる）',
        m: [R`\text{接点 } (t,\ f(t)) \text{ での接線: } y - f(t) = f'(t)(x - t)`],
        n: R`曲線上の点 $P$ でない点から接線を引くときは、まず**接点を $t$ とおいて**、接線の式を $t$ で表します。`,
        easy: R`接線は「ある 1 点で曲線に触れる直線」です。触れている点（接点）の $x$ 座標を $t$ という文字で表しておけば、その点の $y$ 座標は $f(t)$、傾きは $f'(t)$ なので、接線の式が $t$ で書けます。あとは、この接線が点 $P(p,\ q)$ を通る、という条件で $t$ を決めればよいのです。`,
        lv: 3
      });
      steps.push({
        t: '接点を $t$ とおいて、接線を $t$ で表す',
        m: [
          R`f'(x) = 2ax + b = ` + ptex([b, a.mul(2)]),
          R`y - ` + pa(tPoly(fq)) + ' = ' + pa(slopeT) + R`(x - t)`,
          'y = ' + pa(slopeT) + 'x ' + (restT.charAt(0) === '-' ? restT : '+ ' + restT)
        ],
        n: R`接線 $y = (2at+b)x - at^{2} + c$ は、$f(t)$ と $f'(t)$ に $t$ を使って展開して整理した形です（$-f'(t)\,t + f(t) = -2at^{2} - bt + at^{2} + bt + c = -at^{2} + c$）。`,
        easy: R`点 $(t,\ f(t))$ を通り傾き $f'(t)$ の直線を、$y - y_{1} = m(x - x_{1})$ の形から $y=$ の形に整理します。$t$ を含む式がそのまま接線の式になります（$t$ が決まると、傾きも切片も決まります）。`,
        pro: R`接線は $y = (2at+b)x - at^{2} + c$ と覚えておくと速いです（切片は「$c - at^{2}$」）。`
      });
      steps.push({
        t: R`接線が点 $P(` + p.tex() + R`,\ ` + q.tex() + R`)$ を通る条件`,
        m: [
          R`q = (2at + b)\,p - at^{2} + c`,
          q.tex() + ' = ' + pa(slopeT) + R` \cdot ` + parQ(p) + ' ' + (restT.charAt(0) === '-' ? restT : '+ ' + restT),
          P.tex([q.sub(b.mul(p)).sub(c), a.mul(p).mul(-2), a], 't') + ' = 0'
        ],
        n: R`接線の式に $x = ` + p.tex() + R`,\ y = ` + q.tex() + R`$ を代入して、$t$ の 2 次方程式 $at^{2} - 2ap\,t + (q - bp - c) = 0$ をつくります。この方程式の解 $t$ が接点の $x$ 座標です。`,
        easy: R`点 $P$ が接線の上にあるので、接線の式の $x$ に $p$、$y$ に $q$ を入れた式が成り立ちます。それは $t$ についての 2 次方程式です。解が 2 つなら接線が 2 本、解が 1 つ（重解）なら接線は 1 本、解なしなら接線は引けません。`
      });
      steps.push({
        t: R`$t$ を求める`,
        m: [
          R`t = p \pm \sqrt{\frac{f(p) - q}{a}},\qquad f(p) = ` + fp.tex(),
          R`\frac{f(p) - q}{a} = \frac{` + fp.tex() + ' - ' + parQ(q) + '}{' + a.tex() + '} = ' + mm.tex(),
          two ? R`t = ` + p.tex() + R` \pm \sqrt{` + mm.tex() + '} = ' + tTex[0] + R`,\ ` + tTex[1] + (r === 1 ? '' : R`\ \ (\approx ` + fm(tNum[0], 3) + R`,\ ` + fm(tNum[1], 3) + ')') : R`t = ` + p.tex() + R`\ \text{（重解）}`
        ],
        n: two ? R`$t^{2} - 2pt - \frac{c+bp-q}{a} = 0$ を解くと $t = p \pm \sqrt{\frac{f(p)-q}{a}}$ です。ルートの中が正なので、接点は 2 つあり、接線は 2 本です。` : R`ルートの中が $0$ なので、$t$ は重解 $t = p$ です。点 $P$ 自身が放物線上にあり、接線は 1 本です。`,
        easy: R`2 次方程式の解の公式を使います。ここでは $t^{2} - 2pt - (\cdots) = 0$ という形なので、$t = p \pm \sqrt{p^{2} + (\cdots)}$ と出ます。ルートの中身が正なら 2 本、$0$ なら 1 本、負なら引けません。この点は` + (two ? '2 本' : '1 本') + R`の場合です。`,
        pro: R`$p^{2} + \frac{c+bp-q}{a} = \frac{f(p)-q}{a}$ と整理できるので、ルートの中は「$f(p)-q$ と $a$ の符号が同じ」かどうかで接線の本数が決まります。`
      });
      steps.push({
        t: '接線の方程式',
        m: tNorm.map((t, i) => R`t = ` + tTex[i] + R`:\quad ` + lines[i]),
        n: R`$t$ を $y = (2at+b)x - at^{2} + c$ に代入して接線を求めます（傾き $2at+b$、切片 $c - at^{2}$）。`,
        easy: R`求めた $t$ を接線の式 $y = (2at+b)x - at^{2} + c$ に入れるだけです。$t$ に $\sqrt{\ \ }$ が含まれるときは、$t^{2}$ の計算で $(\sqrt{m})^{2} = m$ を使って整理します。`,
        pro: R`2 本の接線の傾きは $2ap+b \pm 2\sqrt{a(f(p)-q)}$ とも書けます（次の判別式の別解と一致します）。`
      });
      // 別解: 判別式
      const hh = b.add(a.mul(p).mul(2));                       // b + 2ap
      const kPoly = [b.mul(b).sub(a.mul(c).mul(4)).add(a.mul(q).mul(4)), hh.mul(-2), Q(1)];
      const disc = hh.mul(hh).sub(kPoly[0]);                   // = 4a{f(p) - q}
      steps.push({
        t: '別解: 判別式で確かめる',
        m: [
          'y = k(' + shiftX(p) + ') ' + U.signed(q) + R`\ \text{と}\ y = ` + ptex(fq) + R`\ \text{を連立する}`,
          R`ax^{2} + (b - k)x + (c + kp - q) = 0 \;\Rightarrow\; D(k) = (b - k)^{2} - 4a(c + kp - q) = 0`,
          P.tex(kPoly, 'k') + ' = 0',
          R`k = ` + hh.tex() + R` \pm \sqrt{` + disc.tex() + '} = ' + kk.map((k) => surdQ(k[0], k[1], r)).join(R`,\ `) + R`\quad (\text{接点から求めた傾き } 2at + b \text{ と一致})`
        ],
        n: R`点 $P$ を通る傾き $k$ の直線が放物線と接する条件は、連立した 2 次方程式の判別式 $D = 0$ です。$k$ の 2 次方程式を解くと、接点から求めた傾きと一致します。`,
        easy: R`もう 1 つの考え方です。点 $P$ を通る直線は $y = k(x-p) + q$（傾き $k$）と書けます。これが放物線に「ちょうど接する」とき、連立した式の判別式が $0$ になります。傾き $k$ の方程式を解いて、接点を使った結果と同じになることを確かめます。`,
        lv: 2
      });
      // 図
      const xsAll = tNum.concat([p.val()]);
      const xlo = Math.min.apply(null, xsAll), xhi = Math.max.apply(null, xsAll);
      const span = Math.max(xhi - xlo, 2), x0 = xlo - 0.5 * span - 0.5, x1 = xhi + 0.5 * span + 0.5;
      const f0 = P.fn(fq);
      const ysKey = tNum.map((t) => f0(t)).concat([q.val(), f0(p.val())]);
      const ylo = Math.min.apply(null, ysKey), yhi = Math.max.apply(null, ysKey);
      const ypad = Math.max((yhi - ylo) * 0.35, 1);
      const o = {
        w: 340, h: 260, x: [x0, x1], y: [ylo - ypad, yhi + ypad],
        curves: [{ f: f0, cls: 'c1' }],
        points: [{ x: p.val(), y: q.val(), label: 'P(' + p.toString() + ', ' + q.toString() + ')', cls: 'c3', pos: 'bl' }],
        vlines: []
      };
      tNum.forEach((t, i) => {
        o.curves.push({ f: (x) => kNum[i] * x + nNum[i], cls: i === 0 ? 'c2' : 'c4', dash: true });
        o.points.push({ x: t, y: f0(t), cls: i === 0 ? 'c2' : 'c4', label: 't=' + (r === 1 ? tNorm[i][0].toString() : fm(t, 2)), pos: i === 0 ? 'tl' : 'tr' });
      });
      return {
        result: [
          { label: '接点の x 座標 t', tex: R`t = ` + tTex.join(R`,\ `) },
          { label: two ? '接線 ①' : '接線', tex: lines[0] },
          two ? { label: '接線 ②', tex: lines[1] } : { label: '本数', tex: R`1\ \text{本（点が放物線上）}` }
        ],
        steps: steps,
        fig: JK.plot.graph(o)
      };
    }
  });
})();
