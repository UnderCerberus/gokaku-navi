/* 数C — 2次曲線
   楕円 / 双曲線 / 放物線 / 一般形 Ax²+Cy²+Dx+Ey+F=0 の平方完成と分類 / 曲線上の点における接線 / 媒介変数表示・極座標
   構成は ia-quad.js に準拠（intro → result → steps(easy/pro/lv) → fig）。図はすべて縦横等倍（equal: true）。
   未習者（高1・高2）向けに、各計算機の冒頭に lv:3 の「そもそも〜とは」ステップを置く。
   根号を含む値は厳密値 V（有理数・根号の 1 次結合。iiic-diff.js と同じ方式）で扱う。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util;

  /* ================= 表示の共通ヘルパー ================= */

  function fin(x) { return typeof x === 'number' && isFinite(x); }
  const SUPS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(s) { return String(s).split('').map((c) => SUPS[c] || c).join(''); }
  function plain(x, d) {
    if (typeof x !== 'number' || isNaN(x)) return '—';
    if (!isFinite(x)) return x > 0 ? '∞' : '-∞';
    d = d == null ? 4 : d;
    const ax = Math.abs(x);
    if (ax !== 0 && (ax >= 1e7 || ax < Math.pow(10, -d))) {
      let e = Math.floor(Math.log10(ax)), m = x / Math.pow(10, e);
      if (Math.abs(Number(m.toFixed(2))) >= 10) { m /= 10; e += 1; }
      return m.toFixed(2) + '×10' + sup(e);
    }
    let s = x.toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }
  function num(x, sig) {
    if (!fin(x)) return U.fmt(x);
    sig = sig || 7;
    const ax = Math.abs(x);
    if (ax < 1e-12) return '0';
    if (ax >= 1e7 || ax < 1e-4) return U.sig(x, sig - 1);
    return U.fmt(x, Math.min(10, Math.max(0, sig - 1 - Math.floor(Math.log10(ax)))));
  }
  function sumTex(items) {
    items = items.filter(Boolean);
    if (!items.length) return '0';
    return items.map((t, i) => (i === 0 ? (t.neg ? '-' : '') : (t.neg ? ' - ' : ' + ')) + t.body).join('');
  }
  function clipSeg(s, x0, x1, y0, y1) {
    if (![s.x1, s.y1, s.x2, s.y2].every(fin)) return null;
    let t0 = 0, t1 = 1;
    const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
    const pq = [[-dx, s.x1 - x0], [dx, x1 - s.x1], [-dy, s.y1 - y0], [dy, y1 - s.y1]];
    for (let i = 0; i < 4; i++) {
      const p = pq[i][0], q = pq[i][1];
      if (p === 0) { if (q < 0) return null; continue; }
      const r = q / p;
      if (p < 0) { if (r > t1) return null; if (r > t0) t0 = r; } else { if (r < t0) return null; if (r < t1) t1 = r; }
    }
    return Object.assign({}, s, { x1: s.x1 + t0 * dx, y1: s.y1 + t0 * dy, x2: s.x1 + t1 * dx, y2: s.y1 + t1 * dy });
  }

  /* ================= 厳密値 V（iiic-diff.js と同じ方式・根号まで） ================= */

  function T(c, r, pk) { return { c: c, r: r || 1, pk: pk || 0 }; }
  function plainT(t) { return t.r === 1 && t.pk === 0; }
  function tkey(t) { return t.r + '|' + t.pk; }
  function tval(t) { return t.c.val() * Math.sqrt(t.r) * Math.pow(Math.PI, t.pk); }
  function norm(list) {
    const out = [], idx = {};
    list.forEach((t) => {
      const k = tkey(t);
      if (Object.prototype.hasOwnProperty.call(idx, k)) { const o = out[idx[k]]; out[idx[k]] = T(o.c.add(t.c), o.r, o.pk); }
      else { idx[k] = out.length; out.push(t); }
    });
    return out.filter((t) => !t.c.isZero());
  }
  function V(t, ax) { this.t = t || []; this.ax = ax == null ? null : ax; }
  function guard(fx, fn) {
    try { const r = fx(); return (r.ax === null && r.t.length > 8) ? V.num(fn()) : r; }
    catch (e) { if (e instanceof JK.CalcError) return V.num(fn()); throw e; }
  }
  V.num = (x) => new V(null, fin(x) && Math.abs(x) < 1e-13 ? 0 : x);
  V.q = (q) => { q = q instanceof Q ? q : Q(q); return new V(q.isZero() ? [] : [T(q)]); };
  V.of = (x) => (x instanceof V ? x : (x instanceof Q ? V.q(x) : (Number.isInteger(x) && Math.abs(x) < 1e15 ? V.q(Q(x)) : V.num(x))));
  V.pi = (q) => { q = q instanceof Q ? q : Q(q); return new V(q.isZero() ? [] : [T(q, 1, 1)]); };
  V.sqrt = (q) => {
    q = q instanceof Q ? q : Q(q);
    if (q.sign() < 0) return V.num(NaN);
    if (q.isZero()) return V.q(0);
    if (q.n * q.d > 1e12) return V.num(Math.sqrt(q.val()));
    const s = U.sqrtSimplify(q.n * q.d);
    return new V([T(Q(s.out, q.d), s.in)]);
  };
  const VP = V.prototype;
  VP.exact = function () { return this.ax === null; };
  VP.val = function () { return this.ax !== null ? this.ax : this.t.reduce((s, t) => s + tval(t), 0); };
  VP.add = function (o) {
    o = V.of(o);
    const a = this;
    if (!a.exact() || !o.exact()) return V.num(a.val() + o.val());
    return guard(() => new V(norm(a.t.concat(o.t))), () => a.val() + o.val());
  };
  VP.neg = function () { return this.exact() ? new V(this.t.map((t) => T(t.c.neg(), t.r, t.pk))) : V.num(-this.ax); };
  VP.sub = function (o) { return this.add(V.of(o).neg()); };
  VP.mul = function (o) {
    o = V.of(o);
    const a = this;
    if (!a.exact() || !o.exact()) return V.num(a.val() * o.val());
    return guard(() => {
      const out = [];
      a.t.forEach((x) => o.t.forEach((y) => {
        const rr = x.r * y.r;
        if (rr > 1e12) throw new JK.CalcError('big');
        const s = U.sqrtSimplify(rr);
        out.push(T(x.c.mul(y.c).mul(s.out), s.in, x.pk + y.pk));
      }));
      return new V(norm(out));
    }, () => a.val() * o.val());
  };
  VP.isZero = function () { return this.exact() ? this.t.length === 0 : Math.abs(this.ax) < 1e-12; };
  VP.isQ = function () { return this.exact() && (this.t.length === 0 || (this.t.length === 1 && plainT(this.t[0]))); };
  VP.q = function () { return this.t.length ? this.t[0].c : Q(0); };
  VP.single = function () { return this.exact() && this.t.length === 1; };
  VP.sign = function () { if (this.isZero()) return 0; return this.val() > 0 ? 1 : -1; };
  VP.inv = function () {
    if (this.isZero()) throw new JK.CalcError('0 で割ることはできません');
    const a = this;
    if (a.single()) {
      const t = a.t[0];
      return guard(() => new V([T(t.c.mul(t.r).inv(), t.r, -t.pk)]), () => 1 / a.val());
    }
    if (a.exact() && a.t.length === 2 && a.t.every((t) => t.pk === 0)) {
      const conj = new V([a.t[0], T(a.t[1].c.neg(), a.t[1].r)]);
      const d = a.mul(conj);
      if (d.isQ() && !d.isZero()) return conj.mul(V.q(d.q().inv()));
    }
    return V.num(1 / a.val());
  };
  VP.div = function (o) { return this.mul(V.of(o).inv()); };
  function ordered(ts) {
    if (ts.length > 1 && ts[0].c.sign() < 0) {
      const i = ts.findIndex((t) => t.c.sign() > 0);
      if (i > 0) return [ts[i]].concat(ts.slice(0, i), ts.slice(i + 1));
    }
    return ts;
  }
  function tbody(t, tex) {
    const c = t.c.abs(), numF = [], denF = [];
    if (t.r !== 1) numF.push(tex ? R`\sqrt{` + t.r + '}' : '√' + t.r);
    if (t.pk > 0) numF.push(tex ? (t.pk === 1 ? R`\pi` : R`\pi^{` + t.pk + '}') : 'π' + (t.pk === 1 ? '' : sup(t.pk)));
    if (t.pk < 0) denF.push(tex ? (t.pk === -1 ? R`\pi` : R`\pi^{` + (-t.pk) + '}') : 'π' + (t.pk === -1 ? '' : sup(-t.pk)));
    if (!numF.length && !denF.length) return tex ? c.tex() : (c.d === 1 ? String(c.n) : c.n + '/' + c.d);
    const nParts = (c.n === 1 && numF.length ? [] : [String(c.n)]).concat(numF);
    const dParts = (c.d === 1 ? [] : [String(c.d)]).concat(denF);
    const joinT = (arr) => (tex ? arr.join(' ') : arr.join(''));
    const ns = joinT(nParts), ds = joinT(dParts);
    if (!ds) return ns;
    if (tex) return R`\frac{` + ns + '}{' + ds + '}';
    const wrap = (s, n) => (n > 1 ? '(' + s + ')' : s);
    return wrap(ns, nParts.length) + '/' + wrap(ds, dParts.length);
  }
  VP.tex = function () {
    if (!this.exact()) return num(this.ax);
    if (!this.t.length) return '0';
    return ordered(this.t).map((t, i) => { const ng = t.c.sign() < 0; return (i === 0 ? (ng ? '-' : '') : (ng ? ' - ' : ' + ')) + tbody(t, true); }).join('');
  };
  VP.txt = function () {
    if (!this.exact()) return plain(this.ax, 3);
    if (!this.t.length) return '0';
    return ordered(this.t).map((t, i) => { const ng = t.c.sign() < 0; return (i === 0 ? (ng ? '-' : '') : (ng ? '-' : '+')) + tbody(t, false); }).join('');
  };
  function sinTab(k) {
    switch (k) {
      case 0: return V.q(0);
      case 1: return V.sqrt(Q(6)).sub(V.sqrt(Q(2))).mul(V.q(Q(1, 4)));
      case 2: return V.q(Q(1, 2));
      case 3: return V.sqrt(Q(1, 2));
      case 4: return V.sqrt(Q(3, 4));
      case 5: return V.sqrt(Q(6)).add(V.sqrt(Q(2))).mul(V.q(Q(1, 4)));
      default: return V.q(1);
    }
  }
  function sinPi(q) {
    const k12 = q.mul(12);
    if (!k12.isInt()) return null;
    let k = ((k12.n % 24) + 24) % 24, sg = 1;
    if (k >= 12) { k -= 12; sg = -1; }
    if (k > 6) k = 12 - k;
    const v = sinTab(k);
    return sg < 0 ? v.neg() : v;
  }
  function exactOf(x) {
    if (!fin(x)) return V.num(x);
    const q = Q.from(x);
    if (q && q.d <= 10000 && Math.abs(q.val() - x) <= 1e-12 * Math.max(1, Math.abs(x))) return V.q(q);
    const q2 = Q.from(x * x);
    if (q2 && q2.d <= 1000 && q2.n <= 1e6 && Math.abs(q2.val() - x * x) <= 1e-10 * Math.max(1, x * x)) {
      const r = V.sqrt(q2);
      if (r.exact()) return x < 0 ? r.neg() : r;
    }
    return V.num(x);
  }
  function pv(v) {
    if (!v.exact()) return v.ax < 0 ? R`\left(` + num(v.ax) + R`\right)` : num(v.ax);
    if (v.isZero()) return '0';
    return (v.single() && v.t[0].c.sign() > 0) ? v.tex() : R`\left(` + v.tex() + R`\right)`;
  }
  function approxTail(v) { return v.isQ() || !v.exact() ? '' : R` \fallingdotseq ` + num(v.val()); }
  function sq2(v) { const s = v.tex(); return (/^[0-9.]+$/.test(s) ? s : R`\left(` + s + R`\right)`) + '^{2}'; }
  function piQTex(q) {
    if (q.isZero()) return '0';
    if (q.eq(1)) return R`\pi`;
    const a = q.abs(), sg = q.sign() < 0 ? '-' : '';
    if (a.d === 1) return sg + a.n + R`\pi`;
    return sg + R`\frac{` + (a.n === 1 ? '' : a.n) + R`\pi}{` + a.d + '}';
  }

  /* ================= 2次曲線の小道具 ================= */

  // (v − p)^2 の TeX
  function sqT(v, p) {
    if (p.isZero()) return v + '^{2}';
    const s = p.sign() > 0 ? ' - ' + p.tex() : ' + ' + p.neg().tex();
    return R`\left(` + v + s + R`\right)^{2}`;
  }
  function vMinus(v, p) { return p.isZero() ? v : v + (p.sign() > 0 ? ' - ' + p.tex() : ' + ' + p.neg().tex()); }
  // (v − p)^2 / den（den は正の有理数。分数なら分子に回す）
  function fracSq(v, p, den) {
    if (den.eq(1)) return sqT(v, p);
    if (den.d === 1) return R`\frac{` + sqT(v, p) + '}{' + den.n + '}';
    return R`\frac{` + den.d + sqT(v, p) + '}{' + den.n + '}';
  }
  function xyPoly(terms) {
    return sumTex(terms.filter((t) => !t.c.isZero()).map((t) => ({ neg: t.c.sign() < 0, body: (t.c.abs().eq(1) && t.v ? '' : t.c.abs().tex()) + t.v })));
  }
  function ptT(x, y) { return R`\left(` + x.tex() + R`,\ ` + y.tex() + R`\right)`; }
  function ptTxt(x, y) { return '(' + x.txt() + ', ' + y.txt() + ')'; }
  // 縦横等倍の図
  function cgraph(o) {
    let x0 = o.box[0], x1 = o.box[1], y0 = o.box[2], y1 = o.box[3];
    if (!(fin(x0) && fin(x1) && fin(y0) && fin(y1))) { x0 = -5; x1 = 5; y0 = -5; y1 = 5; }
    const span = Math.max(x1 - x0, y1 - y0, 1e-6), pad = 0.1 * span + 0.2;
    x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
    const inR = (p) => fin(p.x) && fin(p.y) && p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1;
    return JK.plot.graph({
      w: 340, h: 290, x: [x0, x1], y: [y0, y1], equal: true,
      param: (o.param || []).filter(Boolean),
      curves: o.curves || [],
      vlines: (o.vlines || []).filter((l) => fin(l.x)),
      hlines: (o.hlines || []).filter((l) => fin(l.y)),
      points: (o.points || []).filter(inR),
      segs: (o.segs || []).map((s) => clipSeg(s, x0, x1, y0, y1)).filter(Boolean)
    });
  }
  const ELL = (h, k, a, b, cls) => ({ x: (t) => h + a * Math.cos(t), y: (t) => k + b * Math.sin(t), t: [0, 2 * Math.PI], cls: cls || 'c1' });
  // 双曲線の 2 本の枝（xAxis: 焦点が x 軸に平行）
  function hypBranches(h, k, a, b, xAxis, T0, cls) {
    const T1 = T0 || 2.4;
    return xAxis
      ? [{ x: (t) => h + a * Math.cosh(t), y: (t) => k + b * Math.sinh(t), t: [-T1, T1], cls: cls || 'c1' }, { x: (t) => h - a * Math.cosh(t), y: (t) => k + b * Math.sinh(t), t: [-T1, T1], cls: cls || 'c1' }]
      : [{ x: (t) => h + a * Math.sinh(t), y: (t) => k + b * Math.cosh(t), t: [-T1, T1], cls: cls || 'c1' }, { x: (t) => h + a * Math.sinh(t), y: (t) => k - b * Math.cosh(t), t: [-T1, T1], cls: cls || 'c1' }];
  }
  function checkPos(A, name) {
    if (A.sign() <= 0) throw new JK.CalcError(name + ' は正の数で入力してください');
    if (A.val() > 1e6) throw new JK.CalcError(name + ' は 10⁶ 以下で入力してください');
  }

  /* ================= 1. 楕円 ================= */

  JK.registerCalc({
    id: 'iiic-ellipse',
    course: 'IIIC',
    unit: 'm-conic',
    group: '2次曲線',
    title: '楕円（焦点・頂点・離心率）',
    desc: R`楕円 $\frac{x^{2}}{A} + \frac{y^{2}}{B} = 1$（$A = a^{2},\ B = b^{2}$）の焦点・頂点・長軸と短軸の長さ・離心率を求め、曲線上の点で「2 つの焦点からの距離の和が一定」であることを確かめます。`,
    form: [R`\frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = 1`, R`a > b > 0 \text{ のとき 焦点 } \left(\pm\sqrt{a^{2} - b^{2}},\ 0\right)`],
    inputs: [
      { key: 'A', label: R`$x^{2}$ の分母 $A$（$= a^{2}$）`, type: 'q', def: '25' },
      { key: 'B', label: R`$y^{2}$ の分母 $B$（$= b^{2}$）`, type: 'q', def: '9' }
    ],
    examples: [
      { label: '縦長（A < B）', v: { A: '4', B: '9' } },
      { label: 'x²/4 + y² = 1', v: { A: '4', B: '1' } },
      { label: '円（A = B）', v: { A: '4', B: '4' } },
      { label: '分母が分数', v: { A: '9/4', B: '1' } }
    ],
    intro: {
      easy: R`**楕円**は、円を一方向に押しつぶした（または引き伸ばした）形の曲線です。2 本の画びょう（**焦点**）に輪にした糸を掛け、鉛筆で糸をぴんと張りながら一周させると描けます。このとき、曲線上のどの点でも「2 つの焦点までの距離の和」が糸の長さで一定になります。式 $\frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = 1$ の $a,\ b$ は、中心から横・縦の端までの長さを表します。`,
      normal: R`$a > b$ のとき、焦点は $(\pm c,\ 0)$、$c = \sqrt{a^{2} - b^{2}}$。距離の和は $2a$、離心率は $e = \frac{c}{a}$（$0 < e < 1$）です。`,
      pro: R`分母の大きい方の文字の軸上に焦点があります。$c^{2} = a^{2} - b^{2}$（楕円）と $c^{2} = a^{2} + b^{2}$（双曲線）の符号の違いが頻出の取り違えです。`
    },
    compute(v) {
      const A = v.A, B = v.B;
      checkPos(A, 'A'); checkPos(B, 'B');
      const xM = A.cmp(B) >= 0, circle = A.eq(B);
      const a = V.sqrt(A), b = V.sqrt(B), big = xM ? A : B, small = xM ? B : A, L = xM ? a : b, S = xM ? b : a;
      const c2 = big.sub(small), c = V.sqrt(c2), e = V.sqrt(c2.div(big));
      const fT = xM ? R`\left(\pm ` + c.tex() + R`,\ 0\right)` : R`\left(0,\ \pm ` + c.tex() + R`\right)`;
      const axisL = xM ? 'x' : 'y';
      // 曲線上の点 P（媒介変数 60°）と焦点までの距離（焦半径）
      const xP = a.mul(V.q(Q(1, 2))), yP = b.mul(V.sqrt(Q(3, 4)));
      const along = xM ? xP : yP;
      const PF = L.sub(e.mul(along)), PF2 = L.add(e.mul(along));
      const eqT = R`\frac{x^{2}}{` + A.tex() + R`} + \frac{y^{2}}{` + B.tex() + '} = 1';
      const steps = [
        {
          t: 'そもそも楕円とは — 2 つの焦点からの距離の和が一定',
          m: [R`\mathrm{PF} + \mathrm{PF'} = (\text{一定}) = 2a`, R`\frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = 1`],
          n: R`平面上の 2 定点 F, F′（**焦点**）からの距離の和が一定である点 P の軌跡が楕円です。焦点を $x$ 軸上に $(\pm c,\ 0)$ とおいて距離の式を整理すると、標準形 $\frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = 1$（$b^{2} = a^{2} - c^{2}$）が得られます。`,
          easy: R`画びょう 2 本と糸で楕円を描くとき、糸の長さ（距離の和）は変わりません。画びょうの間隔を狭くするほど円に近づき、広くするほど細長くなります。円は、2 つの焦点が中心で重なった特別な楕円です。`,
          lv: 3
        },
        {
          t: R`$a,\ b$ を読み取る`,
          m: [eqT, R`a^{2} = ` + A.tex() + R`,\ \ b^{2} = ` + B.tex() + R`\quad \Rightarrow\quad a = ` + a.tex() + R`,\ \ b = ` + b.tex()],
          n: circle ? R`$A = B$ なので、これは半径 $` + a.tex() + R`$ の**円**です。` : R`分母が大きいのは $` + axisL + R`^{2}$ の方（$` + big.tex() + R`$）なので、楕円は $` + axisL + R`$ 軸方向に長く、焦点も $` + axisL + R`$ 軸上にあります。`,
          easy: R`$x = \pm a$ のとき $y = 0$、$y = \pm b$ のとき $x = 0$ になるので、$a$ は横の半径、$b$ は縦の半径にあたります。`
        },
        {
          t: '焦点を求める',
          m: [R`c^{2} = ` + (xM ? 'a^{2} - b^{2}' : 'b^{2} - a^{2}') + ' = ' + big.tex() + ' - ' + small.tex() + ' = ' + c2.tex(), R`c = ` + c.tex() + R`,\qquad \text{焦点 } ` + (circle ? R`(0,\ 0)\ \text{（中心と一致）}` : fT)],
          n: R`中心から焦点までの距離 $c$ は、「長い方の半径$^{2}$ − 短い方の半径$^{2}$」の平方根です。`,
          easy: R`短軸の端（たとえば $(0,\ b)$）から焦点までの距離は、ちょうど長い方の半径 $` + L.tex() + R`$ になります（距離の和 $2a$ の半分ずつ）。この直角三角形で三平方の定理を使うと $c^{2} = ` + (xM ? 'a^{2} - b^{2}' : 'b^{2} - a^{2}') + R`$ が出てきます。`,
          pro: R`焦点は分母の大きい方の軸上。$\frac{x^{2}}{4} + \frac{y^{2}}{9} = 1$ なら焦点は $y$ 軸上の $(0,\ \pm\sqrt{5})$ です。`
        },
        {
          t: '頂点・長軸・短軸',
          m: [R`\text{頂点 } \left(\pm ` + a.tex() + R`,\ 0\right),\ \left(0,\ \pm ` + b.tex() + R`\right)`, R`\text{長軸の長さ } 2` + (L.single() && L.t[0].c.eq(1) ? '' : R`\times `) + pv(L) + ' = ' + L.mul(V.q(2)).tex() + R`,\qquad \text{短軸の長さ } ` + S.mul(V.q(2)).tex()],
          n: R`楕円と座標軸の交点が頂点です。長い方の直径を**長軸**、短い方を**短軸**といいます。`,
          lv: 2
        },
        {
          t: R`離心率 $e$`,
          m: R`e = \frac{c}{` + (xM ? 'a' : 'b') + R`} = ` + (R`\frac{` + c.tex() + '}{' + L.tex() + '}' === e.tex() ? '' : R`\frac{` + c.tex() + '}{' + L.tex() + '} = ') + e.tex() + approxTail(e),
          n: circle ? R`円の離心率は $0$ です。` : R`楕円の離心率は $0 < e < 1$ の範囲にあります。`,
          easy: R`離心率は「どれだけつぶれているか」を表す数です。$e$ が $0$ に近いほど円に近く、$1$ に近いほど細長い楕円になります。`
        },
        {
          t: '確かめ — 曲線上の点で距離の和',
          m: [R`\mathrm{P}\left(` + xP.tex() + R`,\ ` + yP.tex() + R`\right)\ \text{（} \cos 60\degree,\ \sin 60\degree \text{ を使った点）}`, R`\mathrm{PF} = ` + PF.tex() + R`,\quad \mathrm{PF'} = ` + PF2.tex(), R`\mathrm{PF} + \mathrm{PF'} = ` + PF.add(PF2).tex() + ' = 2' + (xM ? 'a' : 'b')],
          n: R`点 $(a\cos\theta,\ b\sin\theta)$ は楕円上の点です（$\cos^{2}\theta + \sin^{2}\theta = 1$）。焦点までの距離は $` + (xM ? R`a \mp ex` : R`b \mp ey`) + R`$（焦半径）で求められ、和はいつも $2` + (xM ? 'a' : 'b') + R`$ になります。`,
          easy: R`図の点 P と 2 つの焦点を結んだ 2 本の線分の長さを足すと、長軸の長さ $` + L.mul(V.q(2)).tex() + R`$ に等しくなっています。`,
          lv: 2
        }
      ];
      const av = a.val(), bv = b.val(), cv = c.val();
      const F1 = xM ? [cv, 0] : [0, cv], F2 = xM ? [-cv, 0] : [0, -cv];
      return {
        result: [
          { label: '焦点', tex: circle ? R`(0,\ 0)\ \text{（円）}` : fT },
          { label: '頂点', tex: R`\left(\pm ` + a.tex() + R`,\ 0\right),\ \left(0,\ \pm ` + b.tex() + R`\right)` },
          { label: '長軸・短軸の長さ', tex: L.mul(V.q(2)).tex() + R`,\ \ ` + S.mul(V.q(2)).tex() },
          { label: '離心率', tex: 'e = ' + e.tex() + approxTail(e) }
        ],
        steps: steps,
        fig: cgraph({
          box: [-av, av, -bv, bv],
          param: [ELL(0, 0, av, bv)],
          points: [{ x: F1[0], y: F1[1], label: 'F', cls: 'c3', pos: 'br' }, { x: F2[0], y: F2[1], label: "F'", cls: 'c3', pos: 'bl' }, { x: xP.val(), y: yP.val(), label: 'P', cls: 'c2' }],
          segs: [{ x1: xP.val(), y1: yP.val(), x2: F1[0], y2: F1[1], cls: 'c2', dash: true }, { x1: xP.val(), y1: yP.val(), x2: F2[0], y2: F2[1], cls: 'c2', dash: true }]
        })
      };
    }
  });

  /* ================= 2. 双曲線 ================= */

  JK.registerCalc({
    id: 'iiic-hyperbola',
    course: 'IIIC',
    unit: 'm-conic',
    group: '2次曲線',
    title: '双曲線（焦点・頂点・漸近線）',
    desc: R`双曲線 $\frac{x^{2}}{A} - \frac{y^{2}}{B} = \pm 1$（$A = a^{2},\ B = b^{2}$）の焦点・頂点・漸近線・離心率を求め、「2 つの焦点からの距離の差が一定」を確かめます。`,
    form: [R`\frac{x^{2}}{a^{2}} - \frac{y^{2}}{b^{2}} = 1:\ \text{焦点 } \left(\pm\sqrt{a^{2} + b^{2}},\ 0\right)`, R`\text{漸近線 } y = \pm\frac{b}{a}x`],
    inputs: [
      { key: 'A', label: R`$x^{2}$ の分母 $A$（$= a^{2}$）`, type: 'q', def: '16' },
      { key: 'B', label: R`$y^{2}$ の分母 $B$（$= b^{2}$）`, type: 'q', def: '9' },
      { key: 'sg', label: '右辺', type: 'select', def: '1', options: [['1', '= 1（焦点が x 軸上）'], ['-1', '= −1（焦点が y 軸上）']] }
    ],
    examples: [
      { label: '直角双曲線 x² − y² = 1', v: { A: '1', B: '1', sg: '1' } },
      { label: '右辺 −1', v: { A: '4', B: '9', sg: '-1' } },
      { label: 'x²/4 − y² = 1', v: { A: '4', B: '1', sg: '1' } }
    ],
    intro: {
      easy: R`**双曲線**は、2 つの焦点からの距離の**差**が一定である点の集まりで、左右（または上下）に分かれた 2 本の曲線になります。遠くへ行くほど 2 本の直線（**漸近線**）に限りなく近づくのが特徴です。楕円の式の真ん中の $+$ が $-$ に変わった形 $\frac{x^{2}}{a^{2}} - \frac{y^{2}}{b^{2}} = 1$ で表されます。`,
      normal: R`$\frac{x^{2}}{a^{2}} - \frac{y^{2}}{b^{2}} = 1$ の焦点は $(\pm c,\ 0)$、$c = \sqrt{a^{2} + b^{2}}$。距離の差は $2a$、漸近線は $y = \pm\frac{b}{a}x$、離心率 $e = \frac{c}{a} > 1$ です。`,
      pro: R`右辺が $-1$ のときは焦点・頂点が $y$ 軸上に移りますが、漸近線は同じ $y = \pm\frac{b}{a}x$ です。漸近線は右辺を $0$ にした式 $\frac{x^{2}}{a^{2}} - \frac{y^{2}}{b^{2}} = 0$ から即座に出せます。`
    },
    compute(v) {
      const A = v.A, B = v.B, xAx = v.sg !== '-1';
      checkPos(A, 'A'); checkPos(B, 'B');
      const a = V.sqrt(A), b = V.sqrt(B), c2 = A.add(B), c = V.sqrt(c2);
      const L = xAx ? a : b, e = c.div(L);
      const slope = V.sqrt(B.div(A));
      const eqT = R`\frac{x^{2}}{` + A.tex() + R`} - \frac{y^{2}}{` + B.tex() + '} = ' + (xAx ? '1' : '-1');
      const fT = xAx ? R`\left(\pm ` + c.tex() + R`,\ 0\right)` : R`\left(0,\ \pm ` + c.tex() + R`\right)`;
      const vT = xAx ? R`\left(\pm ` + a.tex() + R`,\ 0\right)` : R`\left(0,\ \pm ` + b.tex() + R`\right)`;
      const asT = R`y = \pm ` + (slope.isQ() && slope.q().eq(1) ? '' : slope.tex()) + 'x';
      // 曲線上の点（θ = 60° の媒介変数）
      const xP = xAx ? a.mul(V.q(2)) : a.mul(V.sqrt(Q(3))), yP = xAx ? b.mul(V.sqrt(Q(3))) : b.mul(V.q(2));
      const along = xAx ? xP : yP;
      const PF = e.mul(along).sub(L), PF2 = e.mul(along).add(L);
      const steps = [
        {
          t: 'そもそも双曲線とは — 2 つの焦点からの距離の差が一定',
          m: [R`|\mathrm{PF} - \mathrm{PF'}| = (\text{一定}) = 2a`, R`\frac{x^{2}}{a^{2}} - \frac{y^{2}}{b^{2}} = 1`],
          n: R`2 定点 F, F′（焦点）からの距離の差が一定である点の軌跡が双曲線です。焦点を $(\pm c,\ 0)$ とおいて整理すると、$b^{2} = c^{2} - a^{2}$ として標準形が得られます。`,
          easy: R`楕円が「距離の和が一定」だったのに対し、双曲線は「距離の差が一定」です。差なので、焦点 F に近い側と F′ に近い側の 2 つに曲線が分かれます。`,
          lv: 3
        },
        {
          t: R`$a,\ b$ を読み取る`,
          m: [eqT, R`a^{2} = ` + A.tex() + R`,\ \ b^{2} = ` + B.tex() + R`\quad \Rightarrow\quad a = ` + a.tex() + R`,\ \ b = ` + b.tex()],
          n: xAx ? R`右辺が $1$ なので、曲線は $x$ 軸と交わり（左右に開く）、焦点は $x$ 軸上にあります。` : R`右辺が $-1$ なので、曲線は $y$ 軸と交わり（上下に開く）、焦点は $y$ 軸上にあります。`,
          easy: xAx ? R`$y = 0$ を代入すると $x^{2} = ` + A.tex() + R`$ となり $x = \pm ` + a.tex() + R`$。でも $x = 0$ を代入すると $y^{2} = -` + B.tex() + R`$ となって解がないので、曲線は $y$ 軸とは交わりません。` : R`$x = 0$ を代入すると $y^{2} = ` + B.tex() + R`$ となり $y = \pm ` + b.tex() + R`$。でも $y = 0$ を代入すると $x^{2} = -` + A.tex() + R`$ となって解がないので、曲線は $x$ 軸とは交わりません。`
        },
        {
          t: '焦点を求める',
          m: [R`c^{2} = a^{2} + b^{2} = ` + A.tex() + ' + ' + B.tex() + ' = ' + c2.tex(), R`c = ` + c.tex() + R`,\qquad \text{焦点 } ` + fT],
          n: R`双曲線では $c^{2} = a^{2} + b^{2}$（楕円とは符号が逆）です。`,
          easy: R`楕円は $c^{2} = a^{2} - b^{2}$、双曲線は $c^{2} = a^{2} + b^{2}$。双曲線の焦点は頂点より外側にあるので、$c$ は $a$ より大きくなる、と覚えると取り違えません。`,
          pro: R`焦点・頂点の位置は右辺の符号で決まり、漸近線は右辺によらず共通です。`
        },
        {
          t: '頂点',
          m: R`\text{頂点 } ` + vT,
          n: R`曲線が座標軸と交わる点です。`,
          lv: 2
        },
        {
          t: '漸近線',
          m: [R`\frac{x^{2}}{` + A.tex() + R`} - \frac{y^{2}}{` + B.tex() + R`} = 0 \;\Rightarrow\; y = \pm\frac{b}{a}x`, asT],
          n: R`$x,\ y$ が大きくなると、右辺の $\pm 1$ は左辺の各項に比べて無視できるほど小さくなり、曲線は直線 $y = \pm\frac{b}{a}x$ に限りなく近づきます。`,
          easy: R`漸近線は「曲線が遠くでぴったり寄り添っていく直線」です。図の点線がそれで、曲線は点線を越えることなく、どんどん近づいていきます。`
        },
        {
          t: R`離心率 $e$`,
          m: R`e = \frac{c}{` + (xAx ? 'a' : 'b') + R`} = \frac{` + c.tex() + '}{' + L.tex() + '} = ' + e.tex() + approxTail(e),
          n: R`双曲線の離心率は $e > 1$ です（楕円は $e < 1$、放物線は $e = 1$）。`,
          lv: 2
        },
        {
          t: '確かめ — 曲線上の点で距離の差',
          m: [R`\mathrm{P}\left(` + xP.tex() + R`,\ ` + yP.tex() + R`\right)`, R`\mathrm{PF} = ` + PF.tex() + R`,\quad \mathrm{PF'} = ` + PF2.tex(), R`\mathrm{PF'} - \mathrm{PF} = ` + PF2.sub(PF).tex() + ' = 2' + (xAx ? 'a' : 'b')],
          n: R`点 P は双曲線上の点です（代入すると成り立ちます）。焦点までの距離の差は $2` + (xAx ? 'a' : 'b') + R`$ で一定です。`,
          easy: R`図の P から 2 つの焦点への線分の長さの差が、頂点どうしの距離 $` + L.mul(V.q(2)).tex() + R`$ に等しくなっています。`,
          lv: 2
        }
      ];
      const av = a.val(), bv = b.val(), cv = c.val();
      const W = Math.max(xP.val(), cv) * 1.15, Hh = Math.max(yP.val(), cv) * 1.15;
      const Tm = xAx ? Math.acosh(Math.max(1.01, W / av)) : Math.acosh(Math.max(1.01, Hh / bv));
      const F1 = xAx ? [cv, 0] : [0, cv], F2 = xAx ? [-cv, 0] : [0, -cv];
      return {
        result: [
          { label: '焦点', tex: fT },
          { label: '頂点', tex: vT },
          { label: '漸近線', tex: asT },
          { label: '離心率', tex: 'e = ' + e.tex() + approxTail(e) }
        ],
        steps: steps,
        fig: cgraph({
          box: [-W, W, -Hh, Hh],
          param: hypBranches(0, 0, av, bv, xAx, Tm),
          curves: [{ f: (x) => (bv / av) * x, cls: 'dim', dash: true }, { f: (x) => -(bv / av) * x, cls: 'dim', dash: true }],
          points: [{ x: F1[0], y: F1[1], label: 'F', cls: 'c3', pos: 'br' }, { x: F2[0], y: F2[1], label: "F'", cls: 'c3', pos: 'bl' }, { x: xP.val(), y: yP.val(), label: 'P', cls: 'c2' }],
          segs: [{ x1: xP.val(), y1: yP.val(), x2: F1[0], y2: F1[1], cls: 'c2', dash: true }, { x1: xP.val(), y1: yP.val(), x2: F2[0], y2: F2[1], cls: 'c2', dash: true }]
        })
      };
    }
  });

  /* ================= 3. 放物線 ================= */

  JK.registerCalc({
    id: 'iiic-parabola',
    course: 'IIIC',
    unit: 'm-conic',
    group: '2次曲線',
    title: '放物線（焦点・準線）',
    desc: R`放物線 $y^{2} = kx$ または $x^{2} = ky$ を $y^{2} = 4px$ / $x^{2} = 4py$ の形に直して、焦点・準線・頂点・軸を求め、「焦点と準線から等距離」を確かめます。`,
    form: [R`y^{2} = 4px:\ \text{焦点 } (p,\ 0),\ \text{準線 } x = -p`, R`x^{2} = 4py:\ \text{焦点 } (0,\ p),\ \text{準線 } y = -p`],
    inputs: [
      { key: 'type', label: '形', type: 'select', def: 'y2', options: [['y2', 'y² = kx（左右に開く）'], ['x2', 'x² = ky（上下に開く）']] },
      { key: 'k', label: '係数 $k$（$= 4p$）', type: 'q', def: '8' }
    ],
    examples: [
      { label: 'y² = −4x', v: { type: 'y2', k: '-4' } },
      { label: 'x² = 2y（y = x²/2）', v: { type: 'x2', k: '2' } },
      { label: 'y = x² の焦点', v: { type: 'x2', k: '1' } }
    ],
    intro: {
      easy: R`**放物線**は、1 つの定点（**焦点**）と 1 本の定直線（**準線**）から等しい距離にある点の集まりです。数Iで学んだ $y = ax^{2}$ のグラフも放物線で、$x^{2} = \frac{1}{a}y$ と書き直せばこの形になります。パラボラアンテナや懐中電灯の反射鏡は放物線の形をしていて、軸に平行に入ってきた光や電波が焦点に集まる性質を利用しています。`,
      normal: R`$y^{2} = 4px$ の焦点は $(p,\ 0)$、準線は $x = -p$。$x^{2} = 4py$ の焦点は $(0,\ p)$、準線は $y = -p$ です。`,
      pro: R`$y = ax^{2}$ の焦点は $\left(0,\ \frac{1}{4a}\right)$。離心率 1 の 2 次曲線であり、極方程式 $r = \frac{l}{1 + \cos\theta}$ とも対応します。`
    },
    compute(v) {
      const k = v.k, yT = v.type !== 'x2';
      if (k.isZero()) throw new JK.CalcError('k は 0 以外を入力してください（k = 0 だと直線になります）');
      if (Math.abs(k.val()) > 1e6) throw new JK.CalcError('k は絶対値 10⁶ 以下で入力してください');
      const p = k.div(4);
      const eqT = yT ? 'y^{2} = ' + (k.eq(1) ? '' : (k.eq(-1) ? '-' : k.tex())) + 'x' : 'x^{2} = ' + (k.eq(1) ? '' : (k.eq(-1) ? '-' : k.tex())) + 'y';
      const std = yT ? R`y^{2} = 4 \cdot ` + U.paren(p) + R` \cdot x` : R`x^{2} = 4 \cdot ` + U.paren(p) + R` \cdot y`;
      const focT = yT ? R`\left(` + p.tex() + R`,\ 0\right)` : R`\left(0,\ ` + p.tex() + R`\right)`;
      const dirT = (yT ? 'x = ' : 'y = ') + p.neg().tex();
      // 確かめの点 P（y = 4p など）
      const P1 = p.mul(4), P2 = p.mul(4);   // y² = 4px なら (4p, 4p)、x² = 4py なら (4p, 4p)
      const dist = p.abs().mul(5);
      const steps = [
        {
          t: 'そもそも放物線とは — 焦点と準線から等距離',
          m: [R`\mathrm{PF} = \mathrm{PH}\quad (\mathrm{H} \text{ は P から準線に下ろした垂線の足})`, R`\sqrt{(x - p)^{2} + y^{2}} = |x + p| \;\Rightarrow\; y^{2} = 4px`],
          n: R`焦点 $\mathrm{F}(p,\ 0)$ と準線 $x = -p$ から等距離にある点 $\mathrm{P}(x,\ y)$ の条件を式にして両辺を 2 乗すると、$y^{2} = 4px$ が得られます。`,
          easy: R`「点 F までの距離」と「直線 $x = -p$ までの距離」がいつも等しい点を集めると、F を包み込むような U 字型の曲線になります。図の点 P で、2 本の点線の長さが等しいことを確かめてください。`,
          lv: 3
        },
        {
          t: R`$4p$ の形に直して $p$ を読み取る`,
          m: [eqT, std, R`4p = ` + k.tex() + R`\;\Rightarrow\; p = ` + p.tex()],
          n: R`$` + (yT ? 'x' : 'y') + R`$ の係数を $4p$ とみます。`,
          easy: R`公式 $` + (yT ? 'y^{2} = 4px' : 'x^{2} = 4py') + R`$ と見比べて、「$4p$ にあたる数」を探す作業です。$4p = ` + k.tex() + R`$ を $4$ で割ると $p$ が出ます。`
        },
        {
          t: '焦点・準線・頂点・軸',
          m: [R`\text{焦点 } ` + focT + R`,\qquad \text{準線 } ` + dirT, R`\text{頂点 } (0,\ 0),\qquad \text{軸 } ` + (yT ? 'y = 0' : 'x = 0')],
          n: (yT ? (p.sign() > 0 ? R`$p > 0$ なので右に開いた放物線です。` : R`$p < 0$ なので左に開いた放物線です。`) : (p.sign() > 0 ? R`$p > 0$ なので上に開いた放物線です。` : R`$p < 0$ なので下に開いた放物線です。`)),
          easy: R`焦点は放物線の「内側」、準線は「外側」にあり、頂点 $(0,\ 0)$ はそのちょうど真ん中です（焦点までも準線までも距離 $|p| = ` + p.abs().tex() + R`$）。`,
          pro: yT ? R`$y^{2} = 4px$ は $x$ 軸に関して対称。$x^{2} = 4py$（$y = \frac{1}{4p}x^{2}$）と取り違えないこと。` : R`$y = ax^{2}$ なら $x^{2} = \frac{1}{a}y$ なので $4p = \frac{1}{a}$、焦点は $\left(0,\ \frac{1}{4a}\right)$ です。`
        },
        {
          t: '確かめ — 焦点と準線までの距離',
          m: [R`\mathrm{P}\left(` + P1.tex() + R`,\ ` + P2.tex() + R`\right)\ \text{は曲線上}\ (` + (yT ? R`y^{2} = ` + P2.mul(P2).tex() + R`,\ 4px = ` + p.mul(4).mul(P1).tex() : R`x^{2} = ` + P1.mul(P1).tex() + R`,\ 4py = ` + p.mul(4).mul(P2).tex()) + ')', R`\mathrm{PF} = \sqrt{` + sq2(V.q(yT ? P1.sub(p) : P1)) + ' + ' + sq2(V.q(yT ? P2 : P2.sub(p))) + '} = ' + dist.tex() + R`,\qquad \mathrm{PH} = ` + dist.tex()],
          n: R`焦点までの距離と準線までの距離が等しくなっています。`,
          lv: 2
        }
      ];
      const pv0 = p.val(), Y = Math.abs(pv0) * 4.6;
      const par = yT ? { x: (t) => t * t / (4 * pv0), y: (t) => t, t: [-Y, Y], cls: 'c1' } : { x: (t) => t, y: (t) => t * t / (4 * pv0), t: [-Y, Y], cls: 'c1' };
      const Pp = { x: P1.val(), y: P2.val() };
      const H = yT ? { x: -pv0, y: Pp.y } : { x: Pp.x, y: -pv0 };
      const F = yT ? { x: pv0, y: 0 } : { x: 0, y: pv0 };
      const ext = Math.abs(pv0) * 5;
      return {
        result: [
          { label: '焦点', tex: focT },
          { label: '準線', tex: dirT },
          { label: 'p の値', tex: 'p = ' + p.tex() }
        ],
        steps: steps,
        fig: cgraph({
          box: yT ? [Math.min(-1.3 * Math.abs(pv0), 0, Pp.x), Math.max(1.3 * Math.abs(pv0), Pp.x), -ext, ext] : [-ext, ext, Math.min(-1.3 * Math.abs(pv0), Pp.y), Math.max(1.3 * Math.abs(pv0), Pp.y)],
          param: [par],
          vlines: yT ? [{ x: -pv0, label: '準線', cls: 'c4', dash: false }] : [],
          hlines: yT ? [] : [{ y: -pv0, label: '準線', cls: 'c4', dash: false }],
          points: [{ x: F.x, y: F.y, label: 'F', cls: 'c3', pos: 'br' }, { x: Pp.x, y: Pp.y, label: 'P', cls: 'c2' }, { x: H.x, y: H.y, label: 'H', cls: 'c4', pos: 'tl' }],
          segs: [{ x1: Pp.x, y1: Pp.y, x2: F.x, y2: F.y, cls: 'c2', dash: true }, { x1: Pp.x, y1: Pp.y, x2: H.x, y2: H.y, cls: 'c2', dash: true }]
        })
      };
    }
  });

  /* ================= 4. 一般形の平方完成と分類 ================= */

  JK.registerCalc({
    id: 'iiic-conic-general',
    course: 'IIIC',
    unit: 'm-conic',
    group: '2次曲線',
    title: '一般形 Ax²+Cy²+Dx+Ey+F=0 の分類',
    desc: R`$Ax^{2} + Cy^{2} + Dx + Ey + F = 0$ を $x,\ y$ それぞれ平方完成して標準形に直し、楕円（円）・双曲線・放物線のどれかを判定して、中心（頂点）と焦点を求めます。`,
    form: R`A(x - h)^{2} + C(y - k)^{2} = K \;\Rightarrow\; \frac{(x - h)^{2}}{K/A} + \frac{(y - k)^{2}}{K/C} = 1`,
    inputs: [
      { key: 'A', label: R`$x^{2}$ の係数 $A$`, type: 'q', def: '4' },
      { key: 'C', label: R`$y^{2}$ の係数 $C$`, type: 'q', def: '9' },
      { key: 'D', label: R`$x$ の係数 $D$`, type: 'q', def: '-16' },
      { key: 'E', label: R`$y$ の係数 $E$`, type: 'q', def: '18' },
      { key: 'F', label: R`定数項 $F$`, type: 'q', def: '-11' }
    ],
    examples: [
      { label: '双曲線', v: { A: '9', C: '-4', D: '-18', E: '-16', F: '-43' } },
      { label: '放物線', v: { A: '0', C: '1', D: '-8', E: '-4', F: '20' } },
      { label: '円', v: { A: '1', C: '1', D: '-4', E: '6', F: '-3' } },
      { label: '図形にならない例', v: { A: '1', C: '2', D: '0', E: '0', F: '5' } }
    ],
    intro: {
      easy: R`$x^{2}$ と $y^{2}$ を含む式は、2 次関数のときと同じように**平方完成**すると、楕円・双曲線・放物線のどれなのかと、その位置（中心や頂点）が分かります。目安は $x^{2}$ と $y^{2}$ の係数の符号で、**同じ符号なら楕円（等しければ円）**、**異なる符号なら双曲線**、**どちらかが 0 なら放物線**です。平方完成した式は、標準形のグラフを平行移動したものになっています。`,
      normal: R`$A(x - h)^{2} + C(y - k)^{2} = K$ の形にしてから、両辺を $K$ で割って標準形にします。中心は $(h,\ k)$ です。`,
      pro: R`$K$ の符号まで確認すること（楕円型で $\frac{K}{A} < 0$ なら図形なし、$K = 0$ なら 1 点または 2 直線）。焦点は「標準形の焦点 + 平行移動」で求めます。`
    },
    compute(v) {
      const A = v.A, C = v.C, D = v.D, E = v.E, F = v.F;
      [A, C, D, E, F].forEach((q) => { if (Math.abs(q.val()) > 1e5) throw new JK.CalcError('係数は絶対値 10⁵ 以下で入力してください'); });
      if (A.isZero() && C.isZero()) throw new JK.CalcError('A と C がともに 0 だと 2 次の項がなく、直線（1 次式）になります');
      const genT = xyPoly([{ c: A, v: 'x^{2}' }, { c: C, v: 'y^{2}' }, { c: D, v: 'x' }, { c: E, v: 'y' }, { c: F, v: '' }]) + ' = 0';
      const linT = (q, v) => (q.sign() < 0 ? ' - ' : ' + ') + (q.abs().eq(1) ? '' : q.abs().tex()) + v;
      const sqItem = (c, v, p) => ({ neg: c.sign() < 0, body: (c.abs().eq(1) ? '' : c.abs().tex()) + sqT(v, p) });
      const steps = [{
        t: '2 次曲線の一般形と平方完成',
        m: [R`Ax^{2} + Cy^{2} + Dx + Ey + F = 0`, R`AC > 0:\ \text{楕円（円）},\quad AC < 0:\ \text{双曲線},\quad AC = 0:\ \text{放物線}`],
        n: R`$x$ の項どうし、$y$ の項どうしをまとめて平方完成すると、標準形を平行移動した式になります。`,
        easy: R`2 次関数 $y = x^{2} - 4x + 1 = (x - 2)^{2} - 3$ で頂点を求めたのと同じ変形を、$x$ と $y$ の両方について行います。$x^{2}$ と $y^{2}$ の係数が同じ符号なら「足し算の形」（楕円）、違う符号なら「引き算の形」（双曲線）になります。`,
        lv: 3
      }];
      let kind, result = [], fig, eqStd = '';
      const pts = [], segsF = [];
      if (!A.isZero() && !C.isZero()) {
        const h = D.div(A.mul(2)).neg(), k = E.div(C.mul(2)).neg();
        const K = A.mul(h).mul(h).add(C.mul(k).mul(k)).sub(F);
        const grp = (c, v, lin) => ({ neg: c.sign() < 0, body: (c.abs().eq(1) ? '' : c.abs().tex()) + (lin.isZero() ? v + '^{2}' : R`\left(` + v + '^{2}' + linT(lin, v) + R`\right)`) });
        steps.push({
          t: 'x, y ごとにまとめる',
          m: [genT, sumTex([grp(A, 'x', D.div(A)), grp(C, 'y', E.div(C))]) + ' = ' + F.neg().tex()],
          n: R`$x^{2}$ の係数 $A = ` + A.tex() + R`$、$y^{2}$ の係数 $C = ` + C.tex() + R`$ でそれぞれくくり、定数項を右辺に移します。`,
          easy: R`くくると、括弧の中は $x^{2} + (\text{数})x$ の形になり、平方完成しやすくなります。`
        });
        steps.push({
          t: '平方完成する',
          m: [sumTex([sqItem(A, 'x', h), sqItem(C, 'y', k)]) + ' = ' + K.tex()],
          n: R`中心は $(h,\ k) = (` + h.tex() + R`,\ ` + k.tex() + R`)$ です。右辺は $F$ を移項し、平方完成で出た定数 $Ah^{2} + Ck^{2}$ を加えた $` + K.tex() + R`$ になります。`,
          easy: R`$x^{2} - 2hx = (x - h)^{2} - h^{2}$ のように「半分の 2 乗を足して引く」変形です。くくった係数が掛かることに注意して、引いた分を右辺に移します。`,
          pro: R`$h = -\frac{D}{2A},\ k = -\frac{E}{2C}$、$K = Ah^{2} + Ck^{2} - F$ と直接求めると速い。`
        });
        if (K.isZero()) {
          kind = A.mul(C).sign() > 0 ? '1 点' : '2 直線';
          const lineT = A.mul(C).sign() > 0 ? R`\text{点 } (` + h.tex() + R`,\ ` + k.tex() + ')' : R`y ` + U.signed(k.neg()) + R` = \pm ` + V.sqrt(A.div(C).abs()).tex() + R`\left(` + vMinus('x', h) + R`\right)`;
          steps.push({ t: '図形の判定', m: lineT, n: A.mul(C).sign() > 0 ? R`右辺が 0 で、左辺は 0 以上（または 0 以下）の項の和なので、両方の括弧が 0 になる 1 点だけを表します。` : R`右辺が 0 なので、因数分解すると 2 本の直線（交わる 2 直線）を表します。`, easy: R`2 次曲線が「つぶれた」特別な場合です（退化した 2 次曲線）。` });
          result = [{ label: '種類', tex: R`\text{` + kind + '（退化）}' }, { label: '図形', tex: lineT }];
          const s = Math.sqrt(Math.abs(A.val() / C.val()));
          fig = cgraph({
            box: [h.val() - 3, h.val() + 3, k.val() - 3, k.val() + 3],
            points: [{ x: h.val(), y: k.val(), label: '(' + h.toString() + ', ' + k.toString() + ')', cls: 'c3' }],
            curves: A.mul(C).sign() < 0 ? [{ f: (x) => k.val() + s * (x - h.val()), cls: 'c1' }, { f: (x) => k.val() - s * (x - h.val()), cls: 'c1' }] : []
          });
        } else {
          const P1 = K.div(A), P2 = K.div(C);
          if (P1.sign() < 0 && P2.sign() < 0) {
            kind = '図形なし';
            steps.push({ t: '標準形と判定', m: [fracSq('x', h, P1.neg()) + ' + ' + fracSq('y', k, P2.neg()) + ' = -1'], n: R`左辺は 0 以上なのに右辺が負なので、これを満たす実数 $(x,\ y)$ はありません。この方程式は図形を表しません。`, easy: R`「2 乗の和 = 負の数」になる点はないので、グラフには何も描かれません。` });
            result = [{ label: '種類', tex: R`\text{図形を表さない（実数解なし）}` }, { label: '平方完成', tex: sumTex([sqItem(A, 'x', h), sqItem(C, 'y', k)]) + ' = ' + K.tex() }];
            fig = cgraph({ box: [h.val() - 3, h.val() + 3, k.val() - 3, k.val() + 3], points: [{ x: h.val(), y: k.val(), label: '中心にあたる点', cls: 'dim' }] });
          } else if (P1.sign() > 0 && P2.sign() > 0) {
            const circle = P1.eq(P2);
            kind = circle ? '円' : '楕円';
            const a = V.sqrt(P1), b = V.sqrt(P2), xM = P1.cmp(P2) >= 0;
            const c = V.sqrt(xM ? P1.sub(P2) : P2.sub(P1));
            eqStd = fracSq('x', h, P1) + ' + ' + fracSq('y', k, P2) + ' = 1';
            const focT = circle ? R`\text{中心と一致}` : (xM ? R`\left(` + V.q(h).add(c).tex() + R`,\ ` + k.tex() + R`\right),\ \left(` + V.q(h).sub(c).tex() + R`,\ ` + k.tex() + R`\right)` : R`\left(` + h.tex() + R`,\ ` + V.q(k).add(c).tex() + R`\right),\ \left(` + h.tex() + R`,\ ` + V.q(k).sub(c).tex() + R`\right)`);
            steps.push({
              t: '両辺を割って標準形にする',
              m: [eqStd, circle ? R`\text{中心 } (` + h.tex() + R`,\ ` + k.tex() + R`),\ \text{半径 } ` + a.tex() : R`a = ` + a.tex() + R`,\ \ b = ` + b.tex() + R`\quad (` + (xM ? 'x' : 'y') + R`\ \text{方向が長い})`],
              n: R`両辺を $K = ` + K.tex() + R`$ で割ると右辺が 1 になります。分母がどちらも正なので**` + kind + R`**です。`,
              easy: R`標準形 $\frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = 1$ を、$x$ 方向に $` + h.tex() + R`$、$y$ 方向に $` + k.tex() + R`$ だけ平行移動した形です。`
            });
            steps.push({
              t: '中心と焦点',
              m: circle ? [R`\text{中心 } (` + h.tex() + R`,\ ` + k.tex() + R`)`] : [R`c = \sqrt{` + (xM ? 'a^{2} - b^{2}' : 'b^{2} - a^{2}') + '} = ' + c.tex(), R`\text{焦点 } ` + focT],
              n: circle ? R`円なので焦点は中心と一致します。` : R`中心 $(` + h.tex() + R`,\ ` + k.tex() + R`)$ から長軸方向に $\pm c$ 移動した点が焦点です。`,
              easy: R`原点が中心の楕円の焦点 $(\pm c,\ 0)$ を、中心の位置まで平行移動すればよいのです。`,
              lv: circle ? 2 : 1
            });
            result = [{ label: '種類', tex: R`\text{` + kind + '}' }, { label: '標準形', tex: eqStd }, { label: '中心', tex: R`(` + h.tex() + R`,\ ` + k.tex() + ')' }, { label: '焦点', tex: circle ? R`\text{中心と一致（半径 } ` + a.tex() + ')' : focT }];
            const av = a.val(), bv = b.val(), cv = c.val(), hv = h.val(), kv = k.val();
            if (!circle) { if (xM) pts.push({ x: hv + cv, y: kv, label: 'F', cls: 'c3' }, { x: hv - cv, y: kv, label: "F'", cls: 'c3' }); else pts.push({ x: hv, y: kv + cv, label: 'F', cls: 'c3' }, { x: hv, y: kv - cv, label: "F'", cls: 'c3' }); }
            pts.push({ x: hv, y: kv, label: '中心', cls: 'c2', pos: 'bl' });
            fig = cgraph({ box: [hv - av, hv + av, kv - bv, kv + bv], param: [ELL(hv, kv, av, bv)], points: pts });
          } else {
            kind = '双曲線';
            const xAx = P1.sign() > 0;
            const a2 = P1.abs(), b2 = P2.abs(), a = V.sqrt(a2), b = V.sqrt(b2), c = V.sqrt(a2.add(b2));
            eqStd = xAx ? fracSq('x', h, a2) + ' - ' + fracSq('y', k, b2) + ' = 1' : fracSq('y', k, b2) + ' - ' + fracSq('x', h, a2) + ' = 1';
            const focT = xAx ? R`\left(` + V.q(h).add(c).tex() + R`,\ ` + k.tex() + R`\right),\ \left(` + V.q(h).sub(c).tex() + R`,\ ` + k.tex() + R`\right)` : R`\left(` + h.tex() + R`,\ ` + V.q(k).add(c).tex() + R`\right),\ \left(` + h.tex() + R`,\ ` + V.q(k).sub(c).tex() + R`\right)`;
            const sl = V.sqrt(b2.div(a2));
            const asT = R`y ` + (k.isZero() ? '' : U.signed(k.neg())) + R` = \pm ` + (sl.isQ() && sl.q().eq(1) ? '' : sl.tex()) + (h.isZero() ? 'x' : R`\left(` + vMinus('x', h) + R`\right)`);
            steps.push({
              t: '両辺を割って標準形にする',
              m: [eqStd, R`a = ` + a.tex() + R`,\ \ b = ` + b.tex()],
              n: R`両辺を $K = ` + K.tex() + R`$ で割ると、分母の符号が異なるので**双曲線**です。正の分母をもつ $` + (xAx ? 'x' : 'y') + R`$ の方向に開きます。`,
              easy: R`標準形の双曲線を、中心が $(` + h.tex() + R`,\ ` + k.tex() + R`)$ になるように平行移動した形です。`
            });
            steps.push({
              t: '中心・焦点・漸近線',
              m: [R`\text{中心 } (` + h.tex() + R`,\ ` + k.tex() + R`),\qquad c = \sqrt{a^{2} + b^{2}} = ` + c.tex(), R`\text{焦点 } ` + focT, R`\text{漸近線 } ` + asT],
              n: R`焦点は中心から開く方向に $\pm c$、漸近線は中心を通る傾き $\pm\frac{b}{a}$ の 2 直線です。`,
              easy: R`原点中心の双曲線の焦点・漸近線を、中心の位置まで平行移動しています。`
            });
            result = [{ label: '種類', tex: R`\text{双曲線}` }, { label: '標準形', tex: eqStd }, { label: '中心', tex: R`(` + h.tex() + R`,\ ` + k.tex() + ')' }, { label: '焦点', tex: focT }, { label: '漸近線', tex: asT }];
            const av = a.val(), bv = b.val(), cv = c.val(), hv = h.val(), kv = k.val(), s = bv / av;
            if (xAx) pts.push({ x: hv + cv, y: kv, label: 'F', cls: 'c3' }, { x: hv - cv, y: kv, label: "F'", cls: 'c3' }); else pts.push({ x: hv, y: kv + cv, label: 'F', cls: 'c3' }, { x: hv, y: kv - cv, label: "F'", cls: 'c3' });
            pts.push({ x: hv, y: kv, label: '中心', cls: 'c2', pos: 'bl' });
            const W = 1.4 * cv;
            fig = cgraph({
              box: [hv - W, hv + W, kv - W, kv + W],
              param: hypBranches(hv, kv, av, bv, xAx, Math.acosh(Math.max(1.05, 1.6 * cv / (xAx ? av : bv)))),
              curves: [{ f: (x) => kv + s * (x - hv), cls: 'dim', dash: true }, { f: (x) => kv - s * (x - hv), cls: 'dim', dash: true }],
              points: pts
            });
          }
        }
      } else {
        // 放物線（A = 0 または C = 0）
        const xSq = !A.isZero();   // x^2 の項がある → 上下に開く
        const a2 = xSq ? A : C, lin2 = xSq ? D : E, lin1 = xSq ? E : D;
        const h = lin2.div(a2.mul(2)).neg();
        const u = xSq ? 'x' : 'y', w = xSq ? 'y' : 'x';
        if (lin1.isZero()) {
          // a2 u^2 + lin2 u + F = 0 → 平行な直線
          const disc = lin2.mul(lin2).sub(a2.mul(F).mul(4));
          kind = disc.sign() > 0 ? '平行な 2 直線' : (disc.isZero() ? '1 直線' : '図形なし');
          const rr = disc.sign() >= 0 ? [V.q(h).add(V.sqrt(disc).div(V.q(a2.abs().mul(2)))), V.q(h).sub(V.sqrt(disc).div(V.q(a2.abs().mul(2))))] : [];
          const lt = disc.sign() > 0 ? u + ' = ' + rr[0].tex() + R`,\ ` + rr[1].tex() : (disc.isZero() ? u + ' = ' + h.tex() : R`\text{実数解なし}`);
          steps.push({ t: '判定', m: [genT, lt], n: R`$` + w + R`$ の項がないので、$` + u + R`$ だけの 2 次方程式になり、$` + u + R`$ = 一定 の直線（または図形なし）を表します。`, easy: R`2 次曲線が退化した場合です。` });
          result = [{ label: '種類', tex: R`\text{` + kind + '（退化）}' }, { label: '図形', tex: lt }];
          fig = cgraph({
            box: [-4, 4, -4, 4],
            vlines: xSq ? rr.map((r) => ({ x: r.val(), cls: 'c1', dash: false })) : [],
            hlines: xSq ? [] : rr.map((r) => ({ y: r.val(), cls: 'c1', dash: false }))
          });
        } else {
          kind = '放物線';
          // a2(u − h)^2 = −lin1·w − F + a2 h^2 → (u − h)^2 = (−lin1/a2)(w − k)
          const k = a2.mul(h).mul(h).sub(F).div(lin1);
          const fourP = lin1.neg().div(a2), p = fourP.div(4);
          const grp = (a2.eq(1) ? '' : (a2.eq(-1) ? '-' : a2.tex())) + (lin2.isZero() ? u + '^{2}' : R`\left(` + u + '^{2}' + linT(lin2.div(a2), u) + R`\right)`);
          eqStd = sqT(u, h) + ' = ' + (fourP.eq(1) ? '' : (fourP.eq(-1) ? '-' : fourP.tex())) + (k.isZero() ? w : R`\left(` + vMinus(w, k) + R`\right)`);
          const vx = xSq ? h : k, vy = xSq ? k : h;
          const fx = xSq ? V.q(h) : V.q(k).add(V.q(p)), fy = xSq ? V.q(k).add(V.q(p)) : V.q(h);
          const dirT = w + ' = ' + k.sub(p).tex();
          steps.push({
            t: 'まとめて平方完成する',
            m: [genT, grp + ' = ' + xyPoly([{ c: lin1.neg(), v: w }, { c: F.neg(), v: '' }]), eqStd],
            n: R`$` + u + R`^{2}$ の項だけがあるので、$` + u + R`$ について平方完成し、残りを右辺に移して $` + w + R`$ の係数でくくります。`,
            easy: R`2 次関数の頂点を求めるのと同じ変形です。$(` + u + R` - h)^{2} = 4p(` + w + R` - k)$ の形になれば、頂点は $(` + vx.tex() + R`,\ ` + vy.tex() + R`)$ です。`
          });
          steps.push({
            t: '頂点・焦点・準線',
            m: [R`4p = ` + fourP.tex() + R`\;\Rightarrow\; p = ` + p.tex(), R`\text{頂点 } (` + vx.tex() + R`,\ ` + vy.tex() + R`),\quad \text{焦点 } \left(` + fx.tex() + R`,\ ` + fy.tex() + R`\right),\quad \text{準線 } ` + dirT],
            n: R`標準形 $` + (xSq ? 'x^{2} = 4py' : 'y^{2} = 4px') + R`$ の焦点・準線を、頂点の位置まで平行移動しました。`,
            easy: R`焦点は頂点から開く向きに $|p|$、準線は反対向きに $|p|$ のところにあります。`,
            pro: R`放物線は $AC = 0$ の場合。$x^{2}$ と $y^{2}$ の片方しかないことを最初に確認します。`
          });
          result = [{ label: '種類', tex: R`\text{放物線}` }, { label: '標準形', tex: eqStd }, { label: '頂点', tex: R`(` + vx.tex() + R`,\ ` + vy.tex() + ')' }, { label: '焦点', tex: R`\left(` + fx.tex() + R`,\ ` + fy.tex() + R`\right)` }, { label: '準線', tex: dirT }];
          const pv0 = p.val(), hv = h.val(), kv = k.val(), Y = Math.abs(pv0) * 4.6;
          const par = xSq ? { x: (t) => hv + t, y: (t) => kv + t * t / (4 * pv0), t: [-Y, Y], cls: 'c1' } : { x: (t) => kv + t * t / (4 * pv0), y: (t) => hv + t, t: [-Y, Y], cls: 'c1' };
          const ext = Math.abs(pv0) * 4;
          fig = cgraph({
            box: xSq ? [hv - ext, hv + ext, Math.min(kv, kv + pv0 * 5, kv - pv0), Math.max(kv, kv + pv0 * 5, kv - pv0)] : [Math.min(kv, kv + pv0 * 5, kv - pv0), Math.max(kv, kv + pv0 * 5, kv - pv0), hv - ext, hv + ext],
            param: [par],
            points: [{ x: fx.val(), y: fy.val(), label: 'F', cls: 'c3' }, { x: xSq ? hv : kv, y: xSq ? kv : hv, label: '頂点', cls: 'c2', pos: 'bl' }],
            vlines: xSq ? [] : [{ x: k.sub(p).val(), label: '準線', cls: 'c4', dash: false }],
            hlines: xSq ? [{ y: k.sub(p).val(), label: '準線', cls: 'c4', dash: false }] : []
          });
        }
      }
      steps.push({
        t: '平行移動との関係',
        n: R`一般形の 2 次曲線（$xy$ の項がないもの）は、標準形の楕円・双曲線・放物線を平行移動したものです。中心（頂点）の座標が平行移動の量を表します。`,
        easy: R`形は標準形と同じで、置かれている場所だけが違う、ということです。`,
        lv: 2
      });
      return { result: result, steps: steps, fig: fig };
    }
  });

  /* ================= 5. 接線 ================= */

  JK.registerCalc({
    id: 'iiic-conic-tangent',
    course: 'IIIC',
    unit: 'm-conic',
    group: '2次曲線',
    title: '曲線上の点における接線',
    desc: R`楕円・双曲線・放物線上の点 $(x_{1},\ y_{1})$ における接線を、公式（$x^{2} \to x_{1}x,\ y^{2} \to y_{1}y$ の置きかえ）で求め、陰関数の微分で求めた傾きと一致することを確かめます。`,
    form: [R`\frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = 1 \;\to\; \frac{x_{1}x}{a^{2}} + \frac{y_{1}y}{b^{2}} = 1`, R`y^{2} = 4px \;\to\; y_{1}y = 2p(x + x_{1})`],
    inputs: [
      { key: 'type', label: '曲線', type: 'select', def: 'ell', options: [['ell', '楕円 x²/A + y²/B = 1'], ['hyp', '双曲線 x²/A − y²/B = 1'], ['par', '放物線 y² = 4px']] },
      { key: 'A', label: R`$A$（$= a^{2}$）`, type: 'q', def: '25', show: (r) => r.type !== 'par' },
      { key: 'B', label: R`$B$（$= b^{2}$）`, type: 'q', def: '9', show: (r) => r.type !== 'par' },
      { key: 'p', label: R`$p$`, type: 'q', def: '2', show: (r) => r.type === 'par' },
      { key: 'x1', label: R`接点の $x$ 座標 $x_{1}$`, type: 'num', def: '4', hint: '√3 なども入力できます' },
      { key: 'y1', label: R`接点の $y$ 座標 $y_{1}$`, type: 'num', def: '9/5' }
    ],
    examples: [
      { label: '楕円 x²/4 + y² = 1 上の (√3, 1/2)', v: { type: 'ell', A: '4', B: '1', x1: '√3', y1: '1/2' } },
      { label: '双曲線 x²/4 − y² = 1 上の (2√2, 1)', v: { type: 'hyp', A: '4', B: '1', x1: '2√2', y1: '1' } },
      { label: '放物線 y² = 8x 上の (2, 4)', v: { type: 'par', p: '2', x1: '2', y1: '4' } },
      { label: '頂点での接線', v: { type: 'ell', A: '25', B: '9', x1: '5', y1: '0' } }
    ],
    intro: {
      easy: R`**接線**は、曲線上の 1 点で曲線に「ちょうど触れる」直線です。接線の傾きは、その点での微分係数（曲線の傾き）です。楕円や双曲線は $y = f(x)$ の形に直しにくいので、$y$ を $x$ の関数とみたまま両辺を $x$ で微分する**陰関数の微分**を使います（$y^{2}$ を微分すると $2y \cdot y'$）。結果をまとめると、「$x^{2}$ を $x_{1}x$ に、$y^{2}$ を $y_{1}y$ に置きかえる」という覚えやすい公式になります。`,
      normal: R`楕円 $\frac{x_{1}x}{a^{2}} + \frac{y_{1}y}{b^{2}} = 1$、双曲線 $\frac{x_{1}x}{a^{2}} - \frac{y_{1}y}{b^{2}} = 1$、放物線 $y_{1}y = 2p(x + x_{1})$。`,
      pro: R`曲線外の点から引いた接線は、接点を $(x_{1},\ y_{1})$ とおいて公式の接線がその点を通る条件と、曲線上にある条件の連立で求めます。`
    },
    compute(v) {
      const type = v.type, x1 = v.x1, y1 = v.y1;
      if (Math.abs(x1) > 1e5 || Math.abs(y1) > 1e5) throw new JK.CalcError('座標は絶対値 10⁵ 以下で入力してください');
      const X1 = exactOf(x1), Y1 = exactOf(y1);
      let curveT, lhsV, onT, tanT, slope, cls, dyT, fig;
      if (type === 'par') {
        const p = v.p;
        if (p.isZero()) throw new JK.CalcError('p は 0 以外を入力してください');
        const fourP = p.mul(4);
        curveT = 'y^{2} = ' + (fourP.eq(1) ? '' : (fourP.eq(-1) ? '-' : fourP.tex())) + 'x';
        lhsV = Y1.mul(Y1).sub(X1.mul(V.q(fourP)));
        if (Math.abs(lhsV.val()) > 1e-9 * Math.max(1, Math.abs(y1 * y1))) throw new JK.CalcError('点 (x₁, y₁) は放物線上にありません（y₁² − 4px₁ = ' + num(lhsV.val(), 5) + ' ≠ 0）');
        onT = sq2(Y1) + ' = ' + Y1.mul(Y1).tex() + R`,\quad ` + fourP.tex() + R` \times ` + pv(X1) + ' = ' + X1.mul(V.q(fourP)).tex();
        const twoP = p.mul(2);
        tanT = R`y_{1}y = 2p(x + x_{1}) \;\Rightarrow\; ` + pv(Y1) + R`y = ` + twoP.tex() + R`\left(x ` + (X1.sign() < 0 ? '- ' + X1.neg().tex() : '+ ' + X1.tex()) + R`\right)`;
        dyT = [R`2y \cdot y' = ` + fourP.tex(), R`y' = \frac{` + twoP.tex() + '}{y}'];
        slope = Y1.isZero() ? null : V.q(twoP).div(Y1);
        cls = { a: null };
      } else {
        const A = v.A, B = v.B, ell = type === 'ell';
        checkPos(A, 'A'); checkPos(B, 'B');
        curveT = R`\frac{x^{2}}{` + A.tex() + R`} ` + (ell ? '+' : '-') + R` \frac{y^{2}}{` + B.tex() + '} = 1';
        const val = X1.mul(X1).mul(V.q(A.inv())).add(Y1.mul(Y1).mul(V.q(B.inv())).mul(V.q(ell ? 1 : -1)));
        lhsV = val.sub(V.q(1));
        if (Math.abs(lhsV.val()) > 1e-9) throw new JK.CalcError('点 (x₁, y₁) は曲線上にありません（左辺に代入すると ' + num(val.val(), 6) + ' で、1 になりません）');
        onT = R`\frac{` + sq2(X1) + '}{' + A.tex() + R`} ` + (ell ? '+' : '-') + R` \frac{` + sq2(Y1) + '}{' + B.tex() + '} = ' + X1.mul(X1).mul(V.q(A.inv())).tex() + (ell ? ' + ' : ' - ') + Y1.mul(Y1).mul(V.q(B.inv())).tex() + ' = 1';
        const cx = X1.mul(V.q(A.inv())), cy = Y1.mul(V.q(B.inv())).mul(V.q(ell ? 1 : -1));
        const term = (c, w) => { if (c.isZero()) return null; const neg = c.sign() < 0, ab = neg ? c.neg() : c, s = ab.tex(); return { neg: neg, body: (s === '1' ? '' : (ab.exact() && !ab.single() ? R`\left(` + s + R`\right)` : s)) + w }; };
        tanT = R`\frac{x_{1}x}{a^{2}} ` + (ell ? '+' : '-') + R` \frac{y_{1}y}{b^{2}} = 1 \;\Rightarrow\; ` + sumTex([term(cx, 'x'), term(cy, 'y')]) + ' = 1';
        dyT = [R`\frac{2x}{` + A.tex() + R`} ` + (ell ? '+' : '-') + R` \frac{2y \cdot y'}{` + B.tex() + '} = 0', R`y' = ` + (ell ? '-' : '') + R`\frac{` + (B.eq(1) ? '' : B.tex()) + 'x}{' + (A.eq(1) ? '' : A.tex()) + 'y}'];
        slope = Y1.isZero() ? null : V.q(ell ? B.div(A).neg() : B.div(A)).mul(X1).div(Y1);
        cls = { A: A, B: B, ell: ell };
      }
      let lineT, mT;
      if (slope === null) { lineT = 'x = ' + X1.tex(); mT = R`\text{定義されない（} y_{1} = 0 \text{ のため接線は } x \text{ 軸に垂直）}`; }
      else {
        const nn = Y1.sub(slope.mul(X1));
        const sT = slope.tex();
        const sx = slope.isZero() ? '' : (sT === '1' ? 'x' : (sT === '-1' ? '-x' : ((slope.exact() && !slope.single()) ? R`\left(` + sT + R`\right)x` : sT + 'x')));
        lineT = 'y = ' + (sx ? sx + (nn.isZero() ? '' : (nn.sign() < 0 ? ' - ' + nn.neg().tex() : ' + ' + nn.tex())) : nn.tex());
        mT = sT;
      }
      const steps = [
        {
          t: 'そもそも接線とは — 陰関数の微分で傾きを求める',
          m: [R`\frac{d}{dx}\left(y^{2}\right) = 2y \cdot \frac{dy}{dx} = 2y \cdot y'`, R`\text{接線}:\ y - y_{1} = m(x - x_{1}),\quad m = y'\ (\text{点 } (x_{1},\ y_{1}) \text{ での値})`],
          n: R`$y$ を $x$ の関数とみて、曲線の式の両辺を $x$ で微分すると、$y'$（接線の傾き）を $x,\ y$ で表せます。これを**陰関数の微分**といいます。`,
          easy: R`$y^{2}$ を $x$ で微分するときは、$y$ を「$x$ で決まるかたまり」とみて合成関数の微分を使います。外側の 2 乗を微分して $2y$、内側の $y$ を微分して $y'$、掛けて $2y \cdot y'$ です。`,
          lv: 3
        },
        {
          t: '点が曲線上にあることを確かめる',
          m: [curveT, onT],
          n: R`接点 $(` + X1.tex() + R`,\ ` + Y1.tex() + R`)$ を代入すると式が成り立つので、曲線上の点です。`,
          easy: R`曲線上にない点では「その点における接線」は考えられないので、最初に確認します。`
        },
        {
          t: '接線の公式に代入する',
          m: tanT,
          n: type === 'par' ? R`$y^{2} = 4px$ の接線は、$y^{2} \to y_{1}y$、$4px \to 2p(x + x_{1})$ と置きかえた式です。` : R`$x^{2} \to x_{1}x$、$y^{2} \to y_{1}y$ と置きかえた式が接線です。`,
          easy: R`公式は「2 乗の片方だけを接点の座標に置きかえる」と覚えます。こうして作った式は 1 次式なので必ず直線になり、接点を代入すると元の曲線の式と同じになるので接点を通ります。`,
          pro: R`公式の形のまま答えてよい問題が多いですが、傾きや切片を問われたら $y = mx + n$ に直します。`
        },
        {
          t: '陰関数の微分で傾きを求める',
          m: dyT.concat([R`m = ` + mT]),
          n: R`点 $(` + X1.tex() + R`,\ ` + Y1.tex() + R`)$ を代入して接線の傾きを求めます。`,
          easy: R`両辺を $x$ で微分し、$y'$ について解きました。$x,\ y$ に接点の座標を入れたものが、接点での傾きです。`
        },
        {
          t: '傾きから接線を求めて比べる',
          m: slope === null ? [R`y_{1} = 0\ \text{なので接線は}\ ` + lineT] : [R`y - ` + pv(Y1) + R` = ` + (mT.charAt(0) === '-' || (slope.exact() && !slope.single()) ? R`\left(` + mT + R`\right)` : mT) + R`\left(x - ` + pv(X1) + R`\right)`, lineT],
          n: R`公式で求めた接線を $y$ について解いたものと一致します。`,
          lv: 2
        }
      ];
      // 図
      const xv = X1.val(), yv = Y1.val();
      const params = [];
      let box;
      if (type === 'par') {
        const pv0 = v.p.val(), Y = Math.max(Math.abs(yv) * 1.5, Math.abs(pv0) * 4);
        params.push({ x: (t) => t * t / (4 * pv0), y: (t) => t, t: [-Y, Y], cls: 'c1' });
        box = [Math.min(0, xv, -Math.abs(pv0)), Math.max(0, xv, Math.abs(pv0)), -Y, Y];
      } else {
        const av = Math.sqrt(cls.A.val()), bv = Math.sqrt(cls.B.val());
        if (cls.ell) { params.push(ELL(0, 0, av, bv)); box = [-av, av, -bv, bv]; }
        else {
          const W = Math.max(Math.abs(xv) * 1.4, av * 2.5);
          hypBranches(0, 0, av, bv, true, Math.acosh(Math.max(1.05, W / av))).forEach((pp) => params.push(pp));
          box = [-W, W, -W * bv / av, W * bv / av];
        }
      }
      const span = Math.max(box[1] - box[0], box[3] - box[2]);
      const seg = slope === null ? { x1: xv, y1: yv - span, x2: xv, y2: yv + span, cls: 'c3' } : (() => { const m = slope.val(), L = span / Math.sqrt(1 + m * m); return { x1: xv - L, y1: yv - m * L, x2: xv + L, y2: yv + m * L, cls: 'c3' }; })();
      fig = cgraph({ box: box, param: params, segs: [seg], points: [{ x: xv, y: yv, label: '(x₁, y₁)', cls: 'c2' }] });
      return {
        result: [
          { label: '接線（公式の形）', tex: tanT.split(R`\;\Rightarrow\; `).pop() },
          { label: '接線', tex: lineT },
          { label: '傾き', tex: 'm = ' + mT }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 6. 媒介変数表示・極座標 ================= */

  function thIn(deg) {
    const q = Q.from(deg);
    if (q && q.d <= 1000 && Math.abs(q.val() - deg) <= 1e-12 * Math.max(1, Math.abs(deg))) return { q: q.div(180), rad: deg * Math.PI / 180, deg: q };
    return { q: null, rad: deg * Math.PI / 180, deg: null };
  }
  function cosV(th) { if (th.q) { const v = sinPi(th.q.add(Q(1, 2))); if (v) return v; } return V.num(Math.cos(th.rad)); }
  function sinV(th) { if (th.q) { const v = sinPi(th.q); if (v) return v; } return V.num(Math.sin(th.rad)); }
  function thT(th) { return th.q ? piQTex(th.q) : num(th.rad); }
  function degT(th) { return (th.deg ? th.deg.tex() : num(th.rad * 180 / Math.PI, 6)) + R`\degree`; }

  JK.registerCalc({
    id: 'iiic-param',
    course: 'IIIC',
    unit: 'm-conic',
    group: '2次曲線',
    title: '媒介変数表示・極座標',
    desc: R`楕円・双曲線の媒介変数表示から $\theta$ を消去して方程式を求めます。また、極座標と直交座標の変換、極方程式 $r = \frac{l}{1 + e\cos\theta}$ の直交座標への変換と曲線の判定を行います。`,
    form: [R`x = r\cos\theta,\quad y = r\sin\theta,\quad r = \sqrt{x^{2} + y^{2}}`, R`r = \frac{l}{1 + e\cos\theta}`],
    inputs: [
      { key: 'mode', label: '内容', type: 'select', def: 'pe', options: [['pe', '楕円 x = a cos θ, y = b sin θ'], ['ph', '双曲線 x = a/cos θ, y = b tan θ'], ['p2r', '極座標 (r, θ) → 直交座標'], ['r2p', '直交座標 (x, y) → 極座標'], ['pconic', '極方程式 r = l/(1 + e cos θ)']] },
      { key: 'a', label: '$a$', type: 'num', def: '3', show: (r) => r.mode === 'pe' || r.mode === 'ph' },
      { key: 'b', label: '$b$', type: 'num', def: '2', show: (r) => r.mode === 'pe' || r.mode === 'ph' },
      { key: 'r', label: '$r$', type: 'num', def: '2', show: (r) => r.mode === 'p2r' },
      { key: 'th', label: R`$\theta$（度）`, type: 'num', def: '60', show: (r) => r.mode === 'pe' || r.mode === 'ph' || r.mode === 'p2r' },
      { key: 'x', label: '$x$', type: 'num', def: '-1', show: (r) => r.mode === 'r2p' },
      { key: 'y', label: '$y$', type: 'num', def: '√3', show: (r) => r.mode === 'r2p' },
      { key: 'l', label: '$l$', type: 'q', def: '3', show: (r) => r.mode === 'pconic' },
      { key: 'e', label: '離心率 $e$', type: 'q', def: '1/2', show: (r) => r.mode === 'pconic', hint: '0 で円、0 < e < 1 で楕円、1 で放物線、1 より大で双曲線' }
    ],
    examples: [
      { label: '双曲線の媒介変数', v: { mode: 'ph', a: '2', b: '1', th: '45' } },
      { label: '極座標 (4, 150°)', v: { mode: 'p2r', r: '4', th: '150' } },
      { label: '(−1, √3) を極座標に', v: { mode: 'r2p', x: '-1', y: '√3' } },
      { label: '極方程式 e = 1（放物線）', v: { mode: 'pconic', l: '2', e: '1' } },
      { label: '極方程式 e = 2（双曲線）', v: { mode: 'pconic', l: '3', e: '2' } }
    ],
    intro: {
      easy: R`点の動きを、時刻のような 1 つの文字 $\theta$（**媒介変数**）を使って $x = f(\theta),\ y = g(\theta)$ と表す方法を**媒介変数表示**といいます。たとえば $x = 3\cos\theta,\ y = 2\sin\theta$ は、$\theta$ が増えると楕円の上を回る点を表します。また、点の位置を「原点からの距離 $r$」と「向き $\theta$」で表すのが**極座標**です。$x = r\cos\theta,\ y = r\sin\theta$ の関係で、ふつうの座標（直交座標）と行き来できます。`,
      normal: R`媒介変数は $\cos^{2}\theta + \sin^{2}\theta = 1$ や $1 + \tan^{2}\theta = \frac{1}{\cos^{2}\theta}$ で消去します。極方程式は $r\cos\theta = x$、$r^{2} = x^{2} + y^{2}$ を使って直交座標に直します。`,
      pro: R`極方程式 $r = \frac{l}{1 + e\cos\theta}$ は、原点を焦点の 1 つとする 2 次曲線で、$e$ が離心率です（$e < 1$ 楕円、$e = 1$ 放物線、$e > 1$ 双曲線）。`
    },
    compute(v) {
      const mode = v.mode;
      const PSTEP = {
        t: 'そもそも媒介変数・極座標とは',
        m: [R`x = f(\theta),\quad y = g(\theta)`, R`(r,\ \theta) \;\Leftrightarrow\; (x,\ y) = (r\cos\theta,\ r\sin\theta)`],
        n: R`$x,\ y$ を別の文字 $\theta$ で表すのが媒介変数表示、原点からの距離 $r$ と偏角 $\theta$ で点を表すのが極座標です。`,
        easy: R`$\theta$ を時計の針の角度のように少しずつ変えると、点 $(x,\ y)$ が動いて曲線を描きます。$\theta$ を消去すると、$x$ と $y$ だけの関係式（曲線の方程式）が得られます。`,
        lv: 3
      };
      if (mode === 'pe' || mode === 'ph') {
        const a = v.a, b = v.b, ell = mode === 'pe';
        if (!(a > 0) || !(b > 0) || a > 1e4 || b > 1e4) throw new JK.CalcError('a, b は正の数（10000 以下）で入力してください');
        const th = thIn(v.th);
        const A = exactOf(a), B = exactOf(b), cs = cosV(th), sn = sinV(th);
        if (!ell && Math.abs(cs.val()) < 1e-12) throw new JK.CalcError('cos θ = 0 となる θ（90° + 180°×n）では x = a/cos θ が定義されません');
        const X = ell ? A.mul(cs) : A.div(cs), Y = ell ? B.mul(sn) : B.mul(sn).div(cs);
        const A2 = A.mul(A), B2 = B.mul(B);
        const eqT = R`\frac{x^{2}}{` + A2.tex() + R`} ` + (ell ? '+' : '-') + R` \frac{y^{2}}{` + B2.tex() + '} = 1';
        const steps = [PSTEP,
          {
            t: R`$\theta = ` + degT(th) + R`$ の点`,
            m: ell ? [R`x = ` + A.tex() + R`\cos ` + thT(th) + ' = ' + X.tex(), R`y = ` + B.tex() + R`\sin ` + thT(th) + ' = ' + Y.tex()] : [R`x = \frac{` + A.tex() + R`}{\cos ` + thT(th) + '} = ' + X.tex(), R`y = ` + B.tex() + R`\tan ` + thT(th) + ' = ' + Y.tex()],
            n: R`$\theta$ の値を代入して点の座標を求めます。`,
            easy: R`$\theta$ を 1 つ決めると、点が 1 つ決まります。$\theta$ をいろいろ変えた点を集めたものが曲線です。`
          },
          {
            t: R`$\theta$ を消去する`,
            m: ell ? [R`\cos\theta = \frac{x}{` + A.tex() + R`},\quad \sin\theta = \frac{y}{` + B.tex() + '}', R`\cos^{2}\theta + \sin^{2}\theta = 1 \;\Rightarrow\; ` + eqT] : [R`\frac{1}{\cos\theta} = \frac{x}{` + A.tex() + R`},\quad \tan\theta = \frac{y}{` + B.tex() + '}', R`1 + \tan^{2}\theta = \frac{1}{\cos^{2}\theta} \;\Rightarrow\; ` + eqT],
            n: ell ? R`$\cos\theta,\ \sin\theta$ をそれぞれ $x,\ y$ で表し、$\cos^{2}\theta + \sin^{2}\theta = 1$ に代入します。` : R`$\frac{1}{\cos\theta},\ \tan\theta$ を $x,\ y$ で表し、$1 + \tan^{2}\theta = \frac{1}{\cos^{2}\theta}$ に代入します。`,
            easy: R`$\theta$ を含む 2 つの式から、三角関数の相互関係を使って $\theta$ を消します。残った $x,\ y$ の関係式が曲線の方程式です。`,
            pro: ell ? R`楕円上の点は $(a\cos\theta,\ b\sin\theta)$ とおくのが定石で、最大・最小問題が三角関数の合成に帰着します。` : R`双曲線上の点は $\left(\frac{a}{\cos\theta},\ b\tan\theta\right)$ とおけます。`
          },
          {
            t: '曲線の種類',
            n: ell ? R`$x$ 軸方向の半径 $` + A.tex() + R`$、$y$ 軸方向の半径 $` + B.tex() + R`$ の楕円です。` : R`頂点 $(\pm ` + A.tex() + R`,\ 0)$ の双曲線です。`,
            lv: 2
          }
        ];
        const av = A.val(), bv = B.val();
        return {
          result: [
            { label: '曲線の方程式', tex: eqT },
            { label: 'θ = ' + plain(v.th, 4) + '° の点', tex: ptT(X, Y) }
          ],
          steps: steps,
          fig: ell
            ? cgraph({ box: [-av, av, -bv, bv], param: [ELL(0, 0, av, bv)], points: [{ x: X.val(), y: Y.val(), label: 'θ = ' + plain(v.th, 3) + '°', cls: 'c3' }], segs: [{ x1: 0, y1: 0, x2: av * Math.cos(th.rad), y2: av * Math.sin(th.rad), cls: 'dim', dash: true }] })
            : cgraph({ box: [-Math.max(Math.abs(X.val()) * 1.2, av * 2.2), Math.max(Math.abs(X.val()) * 1.2, av * 2.2), -Math.max(Math.abs(Y.val()) * 1.2, bv * 2.2), Math.max(Math.abs(Y.val()) * 1.2, bv * 2.2)], param: hypBranches(0, 0, av, bv, true, Math.acosh(Math.max(1.05, Math.max(Math.abs(X.val()) * 1.3, av * 2.4) / av))), curves: [{ f: (x) => bv / av * x, cls: 'dim', dash: true }, { f: (x) => -bv / av * x, cls: 'dim', dash: true }], points: [{ x: X.val(), y: Y.val(), label: 'θ = ' + plain(v.th, 3) + '°', cls: 'c3' }] })
        };
      }
      if (mode === 'p2r') {
        const r = v.r;
        if (Math.abs(r) > 1e5) throw new JK.CalcError('r は絶対値 10⁵ 以下で入力してください');
        const th = thIn(v.th), Rr = exactOf(r);
        const X = Rr.mul(cosV(th)), Y = Rr.mul(sinV(th));
        const steps = [PSTEP,
          {
            t: '直交座標に直す',
            m: [R`x = r\cos\theta = ` + pv(Rr) + R`\cos ` + thT(th) + ' = ' + X.tex(), R`y = r\sin\theta = ` + pv(Rr) + R`\sin ` + thT(th) + ' = ' + Y.tex()],
            n: R`$r = ` + Rr.tex() + R`,\ \theta = ` + thT(th) + R`\ (` + degT(th) + R`)$ を代入します。`,
            easy: R`原点から $\theta$ の向きに距離 $r$ だけ進んだ点です。半径 $r$ の円周上で角 $\theta$ の位置、と考えると、$x$ 座標は $r\cos\theta$、$y$ 座標は $r\sin\theta$ です。` + (r < 0 ? R`$r < 0$ のときは、$\theta$ と反対向き（$\theta + \pi$ の向き）に $|r|$ 進みます。` : ''),
            pro: R`極座標は $(r,\ \theta)$ と $(r,\ \theta + 2n\pi)$、$(-r,\ \theta + \pi)$ が同じ点を表すので、表し方は 1 通りではありません。`
          },
          {
            t: '確かめ',
            m: R`x^{2} + y^{2} = ` + sq2(X) + ' + ' + sq2(Y) + ' = ' + X.mul(X).add(Y.mul(Y)).tex() + R` = r^{2}`,
            n: R`原点からの距離の 2 乗が $r^{2} = ` + Rr.mul(Rr).tex() + R`$ に戻ることを確かめました。`,
            easy: R`図の点線の円（半径 $|r|$）の上に、求めた点がのっています。`,
            lv: 2
          }];
        return {
          result: [{ label: '直交座標', tex: ptT(X, Y) }, { label: '極座標', tex: R`\left(` + Rr.tex() + R`,\ ` + thT(th) + R`\right)` }],
          steps: steps,
          fig: cgraph({ box: [-Math.abs(r), Math.abs(r), -Math.abs(r), Math.abs(r)], param: [ELL(0, 0, Math.abs(r), Math.abs(r), 'dim')], points: [{ x: X.val(), y: Y.val(), label: ptTxt(X, Y), cls: 'c3' }], segs: [{ x1: 0, y1: 0, x2: X.val(), y2: Y.val(), cls: 'c1', arrow: true }] })
        };
      }
      if (mode === 'r2p') {
        const x = v.x, y = v.y;
        if (Math.abs(x) > 1e5 || Math.abs(y) > 1e5) throw new JK.CalcError('座標は絶対値 10⁵ 以下で入力してください');
        if (x === 0 && y === 0) throw new JK.CalcError('原点は偏角が定まりません（r = 0）');
        const X = exactOf(x), Y = exactOf(y);
        const r2 = X.mul(X).add(Y.mul(Y)), Rr = r2.isQ() ? V.sqrt(r2.q()) : V.num(Math.sqrt(r2.val()));
        let rad = Math.atan2(y, x); if (rad < 0) rad += 2 * Math.PI;
        const k12 = rad / Math.PI * 12, kr = Math.round(k12);
        const th = (Math.abs(k12 - kr) < 1e-9 && X.exact() && Y.exact()) ? { q: Q(kr % 24, 12), rad: (kr % 24) * Math.PI / 12, deg: Q((kr % 24) * 15) } : { q: null, rad: rad, deg: null };
        const steps = [PSTEP,
          {
            t: R`$r$ を求める`,
            m: R`r = \sqrt{x^{2} + y^{2}} = \sqrt{` + sq2(X) + ' + ' + sq2(Y) + '} = ' + Rr.tex() + approxTail(Rr),
            n: R`原点からの距離です。`,
            easy: R`三平方の定理で、原点と点 $(x,\ y)$ の距離を求めます。`
          },
          {
            t: R`$\theta$ を求める`,
            m: [R`\cos\theta = \frac{x}{r} = ` + X.div(Rr).tex() + R`,\quad \sin\theta = \frac{y}{r} = ` + Y.div(Rr).tex(), R`\theta = ` + thT(th) + R`\quad (` + degT(th) + ')'],
            n: th.q ? R`$0 \le \theta < 2\pi$ の範囲で求めました。` : R`特別な角ではないので近似値で表しました。`,
            easy: R`$\cos\theta$ と $\sin\theta$ の符号から、点がどの象限にあるかを確かめて角を決めます。`,
            pro: R`$\tan\theta = \frac{y}{x}$ だけで決めると、象限を取り違えることがあります。`
          }];
        return {
          result: [{ label: '極座標', tex: R`\left(` + Rr.tex() + R`,\ ` + thT(th) + R`\right)` }, { label: 'r と θ', tex: 'r = ' + Rr.tex() + approxTail(Rr) + R`,\ \ \theta = ` + degT(th) }],
          steps: steps,
          fig: cgraph({ box: [-Rr.val(), Rr.val(), -Rr.val(), Rr.val()], param: [ELL(0, 0, Rr.val(), Rr.val(), 'dim'), { x: (t) => 0.3 * Rr.val() * Math.cos(t), y: (t) => 0.3 * Rr.val() * Math.sin(t), t: [0, th.rad], cls: 'c3' }], points: [{ x: x, y: y, label: '(' + X.txt() + ', ' + Y.txt() + ')', cls: 'c3' }], segs: [{ x1: 0, y1: 0, x2: x, y2: y, cls: 'c1', arrow: true }] })
        };
      }
      // 極方程式 r = l / (1 + e cos θ)
      const l = v.l, e = v.e;
      if (l.sign() <= 0) throw new JK.CalcError('l は正の数で入力してください');
      if (e.sign() < 0) throw new JK.CalcError('離心率 e は 0 以上で入力してください');
      if (l.val() > 1e4 || e.val() > 100) throw new JK.CalcError('l は 10⁴ 以下、e は 100 以下で入力してください');
      const one = Q(1), d = one.sub(e.mul(e));
      const expand = xyPoly([{ c: d, v: 'x^{2}' }, { c: e.mul(l).mul(2), v: 'x' }, { c: one, v: 'y^{2}' }, { c: l.mul(l).neg(), v: '' }]) + ' = 0';
      let kind, stdT, extra = [], figO;
      const lv = l.val(), ev = e.val();
      if (e.isZero()) {
        kind = '円'; stdT = 'x^{2} + y^{2} = ' + l.mul(l).tex();
        figO = { box: [-lv, lv, -lv, lv], param: [ELL(0, 0, lv, lv)] };
      } else if (e.eq(1)) {
        kind = '放物線';
        stdT = 'y^{2} = ' + l.mul(-2).tex() + R`\left(` + vMinus('x', l.div(2)) + R`\right)`;
        extra.push(R`\text{頂点 } \left(` + l.div(2).tex() + R`,\ 0\right),\quad \text{焦点 } (0,\ 0)`);
        const Y = 2.2 * lv;
        figO = { box: [-1.5 * lv, 0.6 * lv, -Y, Y], param: [{ x: (t) => lv / 2 - t * t / (2 * lv), y: (t) => t, t: [-Y, Y], cls: 'c1' }] };
      } else {
        const h = e.mul(l).div(d).neg(), Ax = l.mul(l).div(d.mul(d)), By = l.mul(l).div(d);
        kind = e.cmp(1) < 0 ? '楕円' : '双曲線';
        stdT = e.cmp(1) < 0 ? fracSq('x', h, Ax) + ' + ' + fracSq('y', Q(0), By) + ' = 1' : fracSq('x', h, Ax) + ' - ' + fracSq('y', Q(0), By.neg()) + ' = 1';
        extra.push(R`\text{中心 } \left(` + h.tex() + R`,\ 0\right),\quad \text{焦点の 1 つが原点}`);
        const a0 = Math.sqrt(Ax.val()), b0 = Math.sqrt(Math.abs(By.val())), hv = h.val();
        if (e.cmp(1) < 0) figO = { box: [hv - a0, hv + a0, -b0, b0], param: [ELL(hv, 0, a0, b0)] };
        else { const W = Math.max(2.4 * a0, Math.abs(hv) + 1.6 * a0); figO = { box: [hv - W, hv + W, -W * 0.8, W * 0.8], param: hypBranches(hv, 0, a0, b0, true, Math.acosh(Math.max(1.05, W / a0))) }; }
      }
      figO.points = [{ x: 0, y: 0, label: '焦点 O', cls: 'c3', pos: 'br' }];
      const steps = [PSTEP,
        {
          t: R`分母を払って $r\cos\theta = x$ を使う`,
          m: [R`r = \frac{` + l.tex() + '}{1 + ' + (e.eq(1) ? '' : e.tex()) + R`\cos\theta}`, R`r + ` + (e.eq(1) ? '' : e.tex()) + R`r\cos\theta = ` + l.tex() + R` \;\Rightarrow\; r = ` + l.tex() + (e.isZero() ? '' : ' - ' + (e.eq(1) ? '' : e.tex()) + 'x')],
          n: R`分母を払い、$r\cos\theta = x$ を代入します。`,
          easy: R`極座標の $r,\ \theta$ を、$x = r\cos\theta,\ y = r\sin\theta,\ r^{2} = x^{2} + y^{2}$ の関係で $x,\ y$ に置きかえていきます。`
        },
        {
          t: R`両辺を 2 乗して $r^{2} = x^{2} + y^{2}$ を使う`,
          m: [R`x^{2} + y^{2} = ` + (e.isZero() ? l.mul(l).tex() : R`\left(` + l.tex() + ' - ' + (e.eq(1) ? '' : e.tex()) + R`x\right)^{2}`), expand],
          n: R`展開して整理しました。$x^{2}$ の係数は $1 - e^{2} = ` + d.tex() + R`$ です。`,
          easy: R`$x^{2}$ の係数 $1 - e^{2}$ の符号で曲線の種類が決まります（正なら楕円、0 なら放物線、負なら双曲線）。`
        },
        {
          t: '標準形と曲線の種類',
          m: [stdT].concat(extra),
          n: R`離心率 $e = ` + e.tex() + R`$ なので**` + kind + R`**です。原点が焦点の 1 つになっています。` + (e.cmp(1) > 0 ? R`ただし $r > 0$ の範囲で描かれるのは原点に近い側の枝だけで、もう一方の枝は 2 乗したときに加わった $r < 0$ の部分にあたります。` : ''),
          easy: R`$e$ は 2 次曲線の「つぶれ具合」を表す離心率で、$e = 0$ は円、$0 < e < 1$ は楕円、$e = 1$ は放物線、$e > 1$ は双曲線です。`,
          pro: R`$r = \frac{l}{1 + e\cos\theta}$ は「焦点からの距離 $r$ ＝ $e$ ×（準線 $x = \frac{l}{e}$ までの距離）」を表す式でもあります。`
        }];
      return {
        result: [{ label: '曲線の種類', tex: R`\text{` + kind + R`}\ (e = ` + e.tex() + ')' }, { label: '直交座標の方程式', tex: stdT }, { label: '展開形', tex: expand }],
        steps: steps,
        fig: cgraph(figO)
      };
    }
  });
})();
