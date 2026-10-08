/* 数I・A — 2次関数（続き）: 2次方程式の解（判別式・因数分解・解の公式）/ 2次不等式 / 2次関数の決定
   構成は ia-quad.js に揃える（intro → result → steps(easy/pro/lv) → fig）。
   係数は JK.Q（有理数）で厳密に扱い、解は根号つきの厳密値で示す。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;
  const CE = (msg) => new JK.CalcError(msg);

  /* ================= 共通ヘルパー ================= */

  const pt = (a, b, c) => P.tex([c, b, a], 'x');           // a x^2 + b x + c の TeX（Q を渡す）
  const REL = { eq: '=', gt: '>', ge: R`\ge`, lt: '<', le: R`\le` };
  const FLIP = { eq: 'eq', gt: 'lt', ge: 'le', lt: 'gt', le: 'ge' };

  function chain(lhs, rhs) {                               // lhs = r1 = r2 …（同じ式の連続は省く）
    const r = rhs.filter((s, i) => i === 0 || s !== rhs[i - 1]);
    if (r.length === 1) return lhs + ' = ' + r[0];
    return R`\begin{aligned} ` + lhs + ' &= ' + r[0] + r.slice(1).map((s) => R` \\ &= ` + s).join('') + R` \end{aligned}`;
  }

  // 係数 c1·a + c2·b + … の TeX（係数は Q。0 の項は省く）
  function linTex(coefs, vars) {
    let out = '';
    coefs.forEach((q, i) => {
      if (q.isZero()) return;
      const ab = q.abs();
      const body = (ab.eq(1) ? '' : ab.tex()) + vars[i];
      out += out === '' ? (q.sign() < 0 ? '-' : '') + body : (q.sign() < 0 ? ' - ' : ' + ') + body;
    });
    return out === '' ? '0' : out;
  }

  // (p + k√m)/d の TeX（p, k は整数・k ≠ 0・d > 0・m > 1）
  function surdTex(p, k, m, d) {
    const kk = Math.abs(k);
    const rad = (kk === 1 ? '' : String(kk)) + R`\sqrt{` + m + '}';
    let num;
    if (p === 0) {
      if (d > 1 && k < 0) return '-' + R`\frac{` + rad + '}{' + d + '}';
      num = (k < 0 ? '-' : '') + rad;
    } else {
      num = p + (k < 0 ? ' - ' : ' + ') + rad;
    }
    return d === 1 ? num : R`\frac{` + num + '}{' + d + '}';
  }
  // 図のラベル用の文字列版
  function surdText(p, k, m, d) {
    const kk = Math.abs(k), rad = (kk === 1 ? '' : String(kk)) + '√' + m;
    const num = p === 0 ? (k < 0 ? '−' : '') + rad : String(p).replace('-', '−') + (k < 0 ? '−' : '+') + rad;
    if (d === 1) return num;
    return p === 0 ? num + '/' + d : '(' + num + ')/' + d;
  }
  // (p ± k√m)/d の TeX
  function pmTex(p, kk, m, d) {
    const rad = (kk === 1 ? '' : String(kk)) + R`\sqrt{` + m + '}';
    const num = (p === 0 ? '' : p + ' ') + R`\pm ` + rad;
    return d === 1 ? num : R`\frac{` + num + '}{' + d + '}';
  }
  // 虚数解 (p ± k√m i)/d の TeX
  function imTex(p, kk, m, d) {
    const im = (kk === 1 ? '' : String(kk)) + (m === 1 ? '' : R`\sqrt{` + m + R`}\,`) + 'i';
    const num = (p === 0 ? '' : p + ' ') + R`\pm ` + im;
    return d === 1 ? num : R`\frac{` + num + '}{' + d + '}';
  }

  // 係数を「整数・互いに素・x² の係数が正」にそろえる（分数を消す倍率 L、共通因数 g、符号反転 flip）
  function normalize(a, b, c) {
    let L = 1;
    [a, b, c].forEach((q) => { L = U.lcm(L, q.d); });
    if (L > 100000) throw CE('係数の分母が大きすぎます（分母の最小公倍数が 10 万以下になるよう入力してください）');
    let A = a.n * (L / a.d), B = b.n * (L / b.d), C = c.n * (L / c.d);
    const g = U.gcd(U.gcd(Math.abs(A), Math.abs(B)), Math.abs(C)) || 1;
    A /= g; B /= g; C /= g;
    const flip = A < 0;
    if (flip) { A = -A; B = -B; C = -C; }
    if (Math.max(Math.abs(A), Math.abs(B), Math.abs(C)) > 1e7) throw CE('係数が大きすぎます。もう少し小さい数で入力してください');
    return { A: A, B: B, C: C, L: L, g: g, flip: flip };
  }

  // 整数係数 A x² + B x + C（A > 0、互いに素）の判別式と解の情報
  function analyze(A, B, C) {
    const D = B * B - 4 * A * C;
    const info = { A: A, B: B, C: C, D: D, rational: false, roots: [], vals: [], n: 0 };
    if (D < 0) {
      const s = U.sqrtSimplify(-D);
      const g = U.gcd(U.gcd(Math.abs(B), s.out), 2 * A) || 1;
      info.s = s;
      info.im = { p: -B / g, k: s.out / g, m: s.in, d: 2 * A / g };
      return info;
    }
    const s = U.sqrtSimplify(D);
    info.k = s.out; info.m = s.in;
    if (s.in === 1) {                                     // D が平方数 → 有理数の解（因数分解できる）
      info.rational = true;
      const r1 = Q(-B - s.out, 2 * A), r2 = Q(-B + s.out, 2 * A);
      info.roots = D === 0 ? [r1] : [r1, r2];
      info.n = D === 0 ? 1 : 2;
      info.vals = info.roots.map((r) => r.val());
    } else {
      const g = U.gcd(U.gcd(Math.abs(B), s.out), 2 * A) || 1;
      info.surd = { p: -B / g, k: s.out / g, m: s.in, d: 2 * A / g };
      info.n = 2;
      info.vals = [-1, 1].map((sg) => (-B + sg * s.out * Math.sqrt(s.in)) / (2 * A));
    }
    return info;
  }
  // i 番目（小さい順）の解
  const rootTex = (info, i) => (info.rational ? info.roots[i].tex()
    : surdTex(info.surd.p, (i === 0 ? -1 : 1) * info.surd.k, info.surd.m, info.surd.d));
  const rootText = (info, i) => (info.rational ? info.roots[i].toString().replace('-', '−')
    : surdText(info.surd.p, (i === 0 ? -1 : 1) * info.surd.k, info.surd.m, info.surd.d));
  const allRootsTex = (info) => (info.D === 0 ? rootTex(info, 0) : rootTex(info, 0) + R`,\ ` + rootTex(info, 1));

  // d x - n（既約分数 n/d の解に対応する 1 次因数）
  function linFac(n, d) {
    return (d === 1 ? 'x' : d + 'x') + (n === 0 ? '' : (n > 0 ? ' - ' + n : ' + ' + (-n)));
  }
  function factoredTex(info) {                             // 有理数解のときの因数分解形
    const f1 = linFac(info.roots[0].n, info.roots[0].d);
    if (info.D === 0) return f1 === 'x' ? 'x^{2}' : '(' + f1 + ')^{2}';
    const f2 = linFac(info.roots[1].n, info.roots[1].d);
    const w = (f) => (f === 'x' ? 'x' : '(' + f + ')');
    return w(f1) + w(f2);
  }

  // x - p の TeX と平方完成形（ia-quad.js と同じ書式）
  function shift(p) {
    if (p.isZero()) return 'x';
    return p.sign() > 0 ? 'x - ' + p.tex() : 'x + ' + p.neg().tex();
  }
  const sq = (p) => (p.isZero() ? 'x^{2}' : R`\left(` + shift(p) + R`\right)^{2}`);
  const coef = (a) => (a.eq(1) ? '' : (a.eq(-1) ? '-' : a.tex()));
  const vertexForm = (a, p, q) => coef(a) + sq(p) + (q.isZero() ? '' : ' ' + U.signed(q));
  function vertexOf(a, b, c) {                             // 頂点 (p, q)
    return { p: b.div(a.mul(2)).neg(), q: c.sub(b.mul(b).div(a.mul(4))) };
  }
  // 厳密な頂点 ex（桁あふれで計算できないときは null）と、数値の頂点 p, q・表示用の文字列
  function vertexInfo(a, b, c) {
    let ex = null;
    try { ex = vertexOf(a, b, c); } catch (e) { if (!(e instanceof JK.CalcError)) throw e; }
    const p = -b.val() / (2 * a.val()), q = c.val() - b.val() * b.val() / (4 * a.val());
    return { ex: ex, p: p, q: q, ps: ex ? ex.p.toString() : U.fmt(p, 3), qs: ex ? ex.q.toString() : U.fmt(q, 3) };
  }

  /* ---------- 図: 放物線 y = ax² + bx + c ---------- */

  // keyXs: 画面に入れたい x の値。o: { points, regions: [{from,to}]（解の範囲。±Infinity 可）, ys, labels }
  function parabolaFig(a, b, c, keyXs, o) {
    o = o || {};
    const av = a.val(), bv = b.val(), cv = c.val();
    const f = (x) => (av * x + bv) * x + cv;
    const px = -bv / (2 * av);
    const xs = keyXs.filter((x) => isFinite(x)).concat([px]);
    let lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs);
    if (hi - lo < 3) { const mid = (lo + hi) / 2; lo = mid - 1.5; hi = mid + 1.5; }
    const pad = (hi - lo) * 0.3;
    const x0 = lo - pad, x1 = hi + pad;
    let ymin = 0, ymax = 0;
    for (let i = 0; i <= 60; i++) {
      const y = f(x0 + (x1 - x0) * i / 60);
      if (y < ymin) ymin = y;
      if (y > ymax) ymax = y;
    }
    (o.ys || []).forEach((y) => { if (isFinite(y)) { ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); } });
    const yp = (ymax - ymin) * 0.1 || 1;
    const yLo = ymin - yp, yHi = ymax + yp;
    const ux = (x1 - x0) / 292, uy = (yHi - yLo) / 210;     // 図の 1px あたりの x, y の大きさ
    const spec = {
      w: 340, h: 250, x: [x0, x1], y: [yLo, yHi],
      curves: [{ f: f, cls: 'c1' }],
      points: o.points || [], labels: (o.labels || []).slice(), vlines: []
    };
    const textW = (s) => Array.from(String(s)).reduce((t, ch) => t + (ch.charCodeAt(0) > 255 ? 12 : 6.3), 0);
    const boxes = [];                                      // すでに置いた文字の外接矩形（px）
    const PX = (x) => 30 + (x - x0) / (x1 - x0) * 292, PY = (y) => 16 + (yHi - y) / (yHi - yLo) * 210;
    // x 軸との交点の目印: 破線 + 図の上端に x の値（2 つあるときは左の解は左側、右の解は右側に出す）
    (o.marks || []).forEach((mk, i, arr) => {
      const left = arr.length === 2 && i === 0;
      const w = textW(mk.text);
      spec.vlines.push({ x: mk.x, cls: 'dim' });
      spec.labels.push({ x: mk.x + (left ? -4 : 4) * ux, y: yHi - 12 * uy, text: mk.text, cls: 'fg', anchor: left ? 'end' : 'start' });
      boxes.push({ x0: PX(mk.x) + (left ? -4 - w : 4), x1: PX(mk.x) + (left ? -4 : 4 + w), y0: 17, y1: 31 });
    });
    if (o.note) {                                          // 「解なし」などの注記（破線の目印があるときはその左側に）
      const w = textW(o.note), withMark = (o.marks || []).length > 0;
      spec.labels.push({ x: px - (withMark ? 8 * ux : 0), y: yHi - (withMark ? 30 : 12) * uy, text: o.note, cls: 'dim', anchor: withMark ? 'end' : 'middle' });
    }
    // 点のラベル（pos 指定なし）は、曲線・軸の目盛り数字・ほかのラベルと重ならない位置を探して置く
    const curvePx = [];
    for (let i = 0; i <= 160; i++) { const x = x0 + (x1 - x0) * i / 160; curvePx.push([PX(x), PY(f(x))]); }
    const zones = [{ x0: 0, x1: 340, y0: PY(0) + 1, y1: PY(0) + 14 }];                       // x 軸の目盛り数字
    if (x0 <= 0 && x1 >= 0) zones.push({ x0: PX(0) - 34, x1: PX(0) - 1, y0: 0, y1: 250 });   // y 軸の目盛り数字
    const hit = (A, B) => A.x0 < B.x1 && B.x0 < A.x1 && A.y0 < B.y1 && B.y0 < A.y1;
    const arms = av > 0 ? { l: ['bl', 'tr', 'tl', 'br'], r: ['br', 'tl', 'tr', 'bl'] } : { l: ['tl', 'br', 'bl', 'tr'], r: ['tr', 'bl', 'br', 'tl'] };
    spec.points = spec.points.map((p) => {
      if (!p.label || p.pos) return p;
      const cx = PX(p.x), cy = PY(p.y), w = textW(p.label);
      let best = null;
      arms[p.x >= px ? 'r' : 'l'].forEach((pos) => {
        const right = pos.charAt(1) === 'r', below = pos.charAt(0) === 'b', bx = right ? cx + 6 : cx - 6 - w, by = below ? cy + 14 : cy - 7;
        const box = { x0: bx, x1: bx + w, y0: by - 11, y1: by + 3 };
        let pen = 0;
        zones.forEach((z) => { if (hit(box, z)) pen += 4; });
        boxes.forEach((q) => { if (hit(box, q)) pen += 5; });
        curvePx.forEach((q) => { if (q[0] > box.x0 - 2 && q[0] < box.x1 + 2 && q[1] > box.y0 - 2 && q[1] < box.y1 + 2) pen += 1; });
        if (box.x0 < 10 || box.x1 > 338 || box.y0 < 4 || box.y1 > 246) pen += 3;
        if (!best || pen < best.pen) best = { pos: pos, pen: pen, box: box };
      });
      boxes.push(best.box);
      return Object.assign({}, p, { pos: best.pos });
    });
    const regions = (o.regions || []).map((r) => ({ from: Math.max(x0, r.from), to: Math.min(x1, r.to) })).filter((r) => r.to > r.from);
    if (regions.length) {
      spec.fills = regions.map((r) => ({ f: f, from: r.from, to: r.to, cls: 'f1' }));
      spec.segs = regions.map((r) => ({ x1: r.from, y1: 0, x2: r.to, y2: 0, cls: 'c3' }));
    }
    return JK.plot.graph(spec);
  }

  /* ================= 2次方程式の解き方（ステップ） ================= */

  // 係数をそろえる操作（分数 → 整数、共通因数、x² の係数の符号）。変更がなければ null
  function normStep(a, b, c, N, rel) {
    if (a.eq(N.A) && b.eq(N.B) && c.eq(N.C)) return null;
    const line = (x, y, z, r) => pt(x, y, z) + ' ' + REL[r] + ' 0';
    const lines = [line(a, b, c, rel)], notes = [];
    let x = a, y = b, z = c, r = rel;
    if (N.L > 1) {
      x = x.mul(N.L); y = y.mul(N.L); z = z.mul(N.L);
      lines.push(line(x, y, z, r) + R`\quad (\times ` + N.L + ')');
      notes.push('分数（小数）が残っているので、両辺に分母の最小公倍数 $' + N.L + '$ をかけて整数係数にします。');
    }
    if (N.g > 1) {
      x = x.div(N.g); y = y.div(N.g); z = z.div(N.g);
      lines.push(line(x, y, z, r) + R`\quad (\div ` + N.g + ')');
      notes.push('すべての係数が $' + N.g + '$ の倍数なので、両辺を $' + N.g + '$ でわって数を小さくします。');
    }
    if (N.flip) {
      x = x.neg(); y = y.neg(); z = z.neg(); r = FLIP[r];
      lines.push(line(x, y, z, r) + R`\quad (\times (-1))`);
      notes.push(rel === 'eq'
        ? '$x^{2}$ の係数を正にするため、両辺に $-1$ をかけます。'
        : '$x^{2}$ の係数を正にするため、両辺に $-1$ をかけます。**負の数をかけるので、不等号の向きが逆になります。**');
    }
    return {
      t: rel === 'eq' ? '係数を整数にそろえる（解は変わらない）' : '不等式を整える（分数・共通因数・$x^{2}$ の係数の符号）',
      m: lines,
      n: notes.join(''),
      easy: rel === 'eq'
        ? R`方程式は、両辺に 0 でない同じ数をかけたり、同じ数でわったりしても、解は変わりません。分数や共通因数があると計算がやりにくいので、先に「整数だけで、いちばん簡単な形」に直しておきます。`
        : R`不等式は、両辺に**正の数**をかけたりわったりしても向きは変わりませんが、**負の数**をかけたりわったりすると向きが逆になります（たとえば $1<2$ の両辺に $-1$ をかけると $-1>-2$）。$x^{2}$ の係数が負のままだと扱いにくいので、先に正にそろえます。`
    };
  }

  function discStep(info) {
    const A = info.A, B = info.B, C = info.C, D = info.D;
    const sub = U.paren(B) + R`^{2} - 4 \cdot ` + A + R` \cdot ` + U.paren(C);
    const mid = String(B * B) + (C === 0 ? '' : ' ' + U.signed(-4 * A * C));
    return {
      t: R`判別式 $D = b^{2} - 4ac$ を計算する`,
      m: chain('D', [R`b^{2} - 4ac`, sub, mid, String(D)]),
      n: R`$a = ${A},\ b = ${B},\ c = ${C}$ を代入します（$b$ の符号に注意）。$D$ は解の公式の根号の中身で、**$D$ の符号**で実数解の個数が決まります（$D>0$: 2 個、$D=0$: 1 個（重解）、$D<0$: なし）。`,
      easy: R`**判別式**とは、解の公式 $x=\frac{-b\pm\sqrt{b^{2}-4ac}}{2a}$ の根号の中身 $b^{2}-4ac$ のことで、$D$ と書きます。根号の中が正なら「$+$」と「$-$」で 2 つの値が出て、0 なら 1 つだけ、負なら実数の範囲では解がありません（2 乗して負になる実数はないため）。そこでまず $D$ を計算して、解の個数と解き方の見当をつけます。`
    };
  }

  function countStep(info) {
    const A = info.A, B = info.B, C = info.C, D = info.D;
    const fx = pt(Q(A), Q(B), Q(C));
    const word = D > 0 ? '異なる 2 つの実数解' : (D === 0 ? '重解（実数解が 1 つ）' : '実数解なし');
    const sign = D > 0 ? '>' : (D === 0 ? '=' : '<');
    const n = D > 0
      ? R`$D>0$ なので、放物線 $y = ` + fx + R`$ は $x$ 軸と**異なる 2 点**で交わります。`
      : (D === 0
        ? R`$D=0$ なので、放物線 $y = ` + fx + R`$ は $x$ 軸に**ちょうど 1 点で接し**、解は 1 つ（**重解**）です。`
        : R`$D<0$ なので、放物線 $y = ` + fx + R`$ は $x$ 軸と**共有点をもたず**、実数解はありません。`);
    return {
      t: '解の個数を調べる',
      m: (D === 0 ? 'D = 0' : R`D = ${D} ` + sign + ' 0') + R` \;\Rightarrow\; \text{` + word + '}',
      n: n,
      easy: R`方程式 $ax^{2}+bx+c=0$ の解は、放物線 $y=ax^{2}+bx+c$ が $x$ 軸（$y=0$ の線）と交わる点の $x$ 座標です。$D>0$ なら 2 点で交わり、$D=0$ なら 1 点で触れ（**接する**）、$D<0$ なら交わりません。`
    };
  }

  // D が平方数のとき: 因数分解 → 積 = 0 → （確かめ）
  function factorSteps(info) {
    const A = info.A, B = info.B, C = info.C, D = info.D, roots = info.roots;
    const fac = factoredTex(info);
    const lhs = pt(Q(A), Q(B), Q(C));
    let fm, fn, feasy;
    if (D === 0) {
      const d = roots[0].d, n = roots[0].n;
      fm = [
        R`(px + q)^{2} = p^{2}x^{2} + 2pq\,x + q^{2}`,
        R`p^{2} = ${A},\quad q^{2} = ${C},\quad 2pq = ${B} \;\Rightarrow\; p = ${d},\ q = ${-n}`,
        lhs + ' = ' + fac
      ];
      fn = R`$D=0$ なので左辺は**完全平方式**（$(px+q)^{2}$ の形）になります。$x^{2}$ の係数 $` + A + R`$ が $p^{2}$、定数項 $` + C + R`$ が $q^{2}$、$x$ の係数 $` + B + R`$ が $2pq$ になるように $p,\ q$ を決めます。`;
      feasy = R`$(px+q)^{2}$ を展開すると $p^{2}x^{2}+2pqx+q^{2}$ です。この形に当てはまる式を「2 乗の形（完全平方式）」といいます。展開の公式を逆向きに使って、元の式を $(\ )^{2}$ の形に戻します。`;
    } else if (A === 1) {
      const p = -roots[0].n, q = -roots[1].n;
      fm = [
        R`(x + p)(x + q) = x^{2} + (p + q)x + pq`,
        R`p + q = ${B},\quad pq = ${C} \;\Rightarrow\; p = ${p},\ q = ${q}`,
        lhs + ' = ' + fac
      ];
      fn = R`展開の公式 $(x+p)(x+q)=x^{2}+(p+q)x+pq$ を逆に使います。**かけて $` + C + R`$、たして $` + B + R`$ になる 2 つの整数**を探すと $p=` + p + R`,\ q=` + q + R`$ です（定数項 $` + C + R`$ の約数の組を順に試します）。`;
      feasy = R`$(x+p)(x+q)$ を展開すると、$x$ の係数は「$p+q$」、定数項は「$pq$」になります。だから、元の式の $x$ の係数 $` + B + R`$ と定数項 $` + C + R`$ を見て、「かけると $` + C + R`$、たすと $` + B + R`$ になる 2 数」を探せば因数分解できます。たとえば $x^{2}+5x+6$ なら、かけて 6・たして 5 になる $2$ と $3$ を見つけて $(x+2)(x+3)$ です。`;
    } else {
      const d1 = roots[0].d, n1 = roots[0].n, d2 = roots[1].d, n2 = roots[1].n;
      fm = [
        R`(px + q)(rx + s) = pr\,x^{2} + (ps + qr)x + qs`,
        R`pr = ${A},\quad qs = ${C},\quad ps + qr = ${B}`,
        R`p = ${d1},\ q = ${-n1},\ r = ${d2},\ s = ${-n2}`,
        lhs + ' = ' + fac
      ];
      fn = R`$x^{2}$ の係数が 1 ではないので、**たすき掛け**で因数分解します。$pr=` + A + R`$、$qs=` + C + R`$ となる組のうち、斜めにかけてたした $ps+qr$ が $` + B + R`$ になるものを探します。`;
      feasy = R`$(px+q)(rx+s)$ を展開すると、$x^{2}$ の係数は $pr$、定数項は $qs$、$x$ の係数は「たすき掛け」の $ps+qr$ です。そこで「$pr=` + A + R`$ になる 2 数」「$qs=` + C + R`$ になる 2 数」を並べ、斜めにかけた 2 つの積をたして $` + B + R`$ になる組を見つけます。見つけにくいときは、次の解の公式で解くこともできます。`;
    }
    const f1 = linFac(roots[0].n, roots[0].d);
    const steps = [{
      t: '左辺を因数分解する',
      m: fm,
      n: fn,
      easy: feasy,
      pro: D === 0 ? R`左辺が完全平方式になる（$D=0$）と気づけば即答できます。` : R`**$D$ が平方数なら必ず因数分解できる**ので、先に $D$ を調べておけば「見つからない」という無駄な時間を省けます。`
    }];
    let sm;
    if (D === 0) {
      sm = [
        (f1 === 'x' ? 'x^{2}' : '(' + f1 + ')^{2}') + ' = 0',
        f1 + ' = 0',
        'x = ' + roots[0].tex() + R`\quad (\text{重解})`
      ];
    } else {
      const f2 = linFac(roots[1].n, roots[1].d);
      sm = [
        fac + ' = 0',
        f1 + R` = 0 \quad \text{または} \quad ` + f2 + ' = 0',
        'x = ' + roots[0].tex() + R`,\ ` + roots[1].tex()
      ];
    }
    steps.push({
      t: '「積が 0」の性質から解を求める',
      m: sm,
      n: D === 0
        ? R`$(\ )^{2}=0$ となるのは、かっこの中が 0 のときだけです。解は 1 つだけで、このような解を**重解**といいます。`
        : R`$A\times B=0$ ならば $A=0$ または $B=0$ です。それぞれのかっこを 0 とおいて $x$ について解きます。`,
      easy: R`0 に何をかけても 0 になるので、2 つの数をかけて 0 になるのは「少なくとも一方が 0」のときだけです。たとえば $(x-1)(x-2)=0$ なら、$x-1=0$ か $x-2=0$ のどちらかが成り立ちます。だから 1 次式ごとに $=0$ とおけば解が出ます。`
    });
    const sd = D === 0 ? R`x = \frac{-` + U.paren(B) + '}{2 \\cdot ' + A + '}' : '';
    const fl = D === 0
      ? [R`x = \frac{-b \pm \sqrt{D}}{2a}`, sd, 'x = ' + roots[0].tex()]
      : [R`x = \frac{-b \pm \sqrt{D}}{2a}`,
        R`x = \frac{-` + U.paren(B) + R` \pm \sqrt{` + D + R`}}{2 \cdot ` + A + '}',
        R`x = \frac{-` + U.paren(B) + R` \pm ` + info.k + '}{' + 2 * A + '}',
        'x = ' + roots[0].tex() + R`,\ ` + roots[1].tex()];
    steps.push({
      t: '解の公式でも確かめる',
      m: fl,
      n: R`因数分解が思いつかなくても、解の公式 $x=\frac{-b\pm\sqrt{D}}{2a}$ にあてはめれば同じ解が得られます。` + (D === 0 ? R`$D=0$ なので $\pm$ の部分が消えて、解は 1 つになります。` : ''),
      lv: 3
    });
    return steps;
  }

  // D > 0 で平方数でないとき: 解の公式 → 近似値 →（公式の導出）
  function formulaSteps(info) {
    const A = info.A, B = info.B, D = info.D, k = info.k, m = info.m, sd = info.surd;
    const lines = [
      R`x = \frac{-b \pm \sqrt{b^{2}-4ac}}{2a}`,
      R`x = \frac{-` + U.paren(B) + R` \pm \sqrt{` + D + R`}}{2 \cdot ` + A + '}'
    ];
    if (k > 1) lines.push(R`\sqrt{` + D + R`} = \sqrt{` + k + R`^{2} \times ` + m + '} = ' + k + R`\sqrt{` + m + '}');
    lines.push('x = ' + pmTex(-B, k, m, 2 * A));
    const g0 = U.gcd(U.gcd(Math.abs(B), k), 2 * A);
    if (g0 > 1) lines.push('x = ' + pmTex(sd.p, sd.k, sd.m, sd.d));
    lines.push('x = ' + rootTex(info, 0) + R`,\ ` + rootTex(info, 1));
    const steps = [{
      t: '解の公式を使って解く',
      m: lines,
      n: R`$D=` + D + R`$ は平方数ではないので、整数の範囲では因数分解できません。**解の公式**に代入します。` +
        (k > 1 ? R`根号の中は $` + D + '=' + k + R`^{2}\times ` + m + R`$ と分けて、$\sqrt{` + D + '}=' + k + R`\sqrt{` + m + R`}$ と簡単にします。` : '') +
        (g0 > 1 ? R`最後に、分子の各項と分母に共通な約数 $` + g0 + R`$ があるので約分します。` : ''),
      easy: R`解の公式は、因数分解できない 2 次方程式でも必ず解ける「万能の道具」です。$a,\ b,\ c$ の値をそのまま入れて計算します。$b$ が負のときは $-b$ が正になること、根号の中は先に $D$ として計算した値をそのまま使うことに気をつけます。根号の中に $2$ 乗の因数があれば、$\sqrt{12}=2\sqrt{3}$ のように外に出して簡単にします。`,
      pro: B % 2 === 0
        ? R`$b$ が偶数のときは $b=2b'$ として $x=\frac{-b'\pm\sqrt{b'^{2}-ac}}{a}$ を使うと計算が軽くなります（ここでは $b'=` + (B / 2) + R`$）。`
        : R`$b$ が奇数のときはそのまま $x=\frac{-b\pm\sqrt{D}}{2a}$ で計算します。答えは必ず約分まで済ませます。`
    }];
    const v = info.vals;
    steps.push({
      t: '近似値で確かめる',
      m: [R`\sqrt{` + m + R`} \approx ` + U.fmt(Math.sqrt(m), 4), R`x \approx ` + U.fmt(v[0], 4) + R`,\ ` + U.fmt(v[1], 4)],
      n: R`$x$ 軸との交点が、図の位置とおおよそ一致することを確認します。`,
      lv: 2
    });
    steps.push({
      t: '（参考）解の公式のみなもと',
      m: [
        R`ax^{2} + bx + c = 0 \;\Rightarrow\; x^{2} + \frac{b}{a}x = -\frac{c}{a}`,
        R`\left(x + \frac{b}{2a}\right)^{2} = \frac{b^{2}-4ac}{4a^{2}}`,
        R`x + \frac{b}{2a} = \pm\frac{\sqrt{b^{2}-4ac}}{2a} \;\Rightarrow\; x = \frac{-b \pm \sqrt{b^{2}-4ac}}{2a}`
      ],
      n: R`$a$ でわって平方完成し、2 乗を外せば解の公式になります。公式は「平方完成を一般の文字で行った結果」です。`,
      easy: R`解の公式は天から降ってきたものではなく、平方完成（式を $(x-p)^{2}=\cdots$ の形に直す変形）を文字のまま行った結果です。まず $x^{2}$ の係数を 1 にして、$x$ の係数の半分の 2 乗を両辺に足し、2 乗の形をつくります。そのあと「2 乗して $\cdots$ になる数は $\pm\sqrt{\cdots}$」として $x$ を取り出します。`,
      lv: 3
    });
    return steps;
  }

  // D < 0: 実数解なし（虚数解は参考）
  function negSteps(info) {
    const A = info.A, B = info.B, D = info.D, im = info.im;
    const steps = [{
      t: '実数の範囲では解なし',
      m: [R`D = ` + D + ' < 0', R`\sqrt{D} = \sqrt{` + D + R`} \quad \text{は実数ではない}`, R`\Rightarrow\; \text{実数解なし}`],
      n: R`$D<0$ のとき、解の公式の $\sqrt{D}$ は実数になりません（2 乗して負になる実数はないため）。よって実数の範囲では解がなく、放物線は $x$ 軸と交わりません。`,
      easy: R`どんな実数を 2 乗しても 0 以上になるので、$\sqrt{\text{負の数}}$ は実数ではありません。だから解の公式の根号の中が負だと、答えになる実数が存在しません。グラフでいうと、放物線が $x$ 軸に届かず、交点がないということです。`,
      pro: R`$D<0$ は「常に $y>0$（または常に $y<0$）」の条件として入試によく登場します。符号は $a$ の向きで判断します。`
    }];
    const s = info.s;
    const simple = (s.out === 1 ? '' : String(s.out)) + (s.in === 1 ? '' : R`\sqrt{` + s.in + R`}\,`) + 'i';
    const g0 = U.gcd(U.gcd(Math.abs(B), s.out), 2 * A);
    const sq0 = R`\sqrt{` + (-D) + R`}\,i`;
    steps.push({
      t: '（参考）複素数の範囲では',
      m: [
        R`i^{2} = -1,\quad \sqrt{` + D + '} = ' + sq0 + (simple !== sq0 ? ' = ' + simple : ''),
        R`x = \frac{-b \pm \sqrt{D}}{2a} = ` + imTex(-B, s.out, s.in, 2 * A)
      ].concat(g0 > 1 ? ['x = ' + imTex(im.p, im.k, im.m, im.d)] : []),
      n: R`数 II で学ぶ**虚数単位** $i$（$i^{2}=-1$）を使うと、負の数の平方根も表せます。このときは $x=\frac{-b\pm\sqrt{D}}{2a}$ が 2 つの**虚数解**を与えます。高校 1 年の範囲では「実数解なし」と答えれば十分です。`,
      easy: R`負の数の平方根を表すために、2 乗すると $-1$ になる新しい数 $i$ を考えます（高校 2 年で学習）。この $i$ を使うと、$D<0$ でも解の公式が使えて、2 つの「虚数解」が得られます。いまは「実数解はない」で OK ですが、続きがあることを知っておくと安心です。`,
      lv: 3
    });
    return steps;
  }

  function eqResult(info) {
    const D = info.D, res = [{ label: '判別式 D', tex: 'D = ' + D }];
    if (D < 0) {
      res.push({ label: '実数解', tex: R`\text{なし}` });
      res.push({ label: '虚数解（参考）', tex: 'x = ' + imTex(info.im.p, info.im.k, info.im.m, info.im.d) });
      return res;
    }
    res.push({ label: D === 0 ? '解（重解）' : '解', tex: 'x = ' + allRootsTex(info) });
    if (info.rational) res.push({ label: '因数分解', tex: factoredTex(info) + ' = 0' });
    else res.push({ label: '近似値', tex: R`x \approx ` + U.fmt(info.vals[0], 4) + R`,\ ` + U.fmt(info.vals[1], 4) });
    res.push({ label: '解の個数', tex: info.n + R`\ \text{個}` });
    return res;
  }

  function eqFig(a, b, c, info) {
    const av = a.val();
    if (info.D >= 0) {                                     // x 軸との交点（解）に目印をつける
      return parabolaFig(a, b, c, info.vals, {
        points: info.vals.map((x) => ({ x: x, y: 0, cls: 'c3' })),
        marks: info.vals.map((x, i) => ({ x: x, text: 'x=' + rootText(info, i) }))
      });
    }
    const vt = vertexInfo(a, b, c);                        // D < 0: x 軸と交わらない（頂点だけ示す）
    const h = Math.max(2, Math.min(8, 1.5 * Math.sqrt(Math.abs(vt.q / av))));
    return parabolaFig(a, b, c, [vt.p - h, vt.p + h], {
      points: [{ x: vt.p, y: vt.q, label: '頂点(' + vt.ps + ', ' + vt.qs + ')', cls: 'c3', pos: av > 0 ? 'br' : 'tr' }]
    });
  }

  /* ================= 2次方程式 ================= */

  const INTRO_EQ = {
    easy: R`2次方程式 $ax^{2}+bx+c=0$ の**解**とは、この式を成り立たせる $x$ の値のことです。グラフでいうと、放物線 $y=ax^{2}+bx+c$ が **$x$ 軸と交わる点の $x$ 座標**にあたります（$x$ 軸の上では $y=0$ だからです）。
解き方は 2 通りあります。①因数分解できるなら「積が 0 になるのは、どちらかが 0 のとき」を使う。②因数分解できないなら**解の公式**を使う。どちらにするかは、先に**判別式** $D=b^{2}-4ac$ を計算すると分かります。$D$ の値で、解が 2 個・1 個・なし のどれになるかも決まります。`,
    normal: R`$D=b^{2}-4ac$ の符号で実数解の個数が決まります（$D>0$: 2 個、$D=0$: 重解、$D<0$: なし）。$D$ が平方数なら有理数の範囲で因数分解でき、そうでなければ解の公式 $x=\frac{-b\pm\sqrt{D}}{2a}$ を使います。`,
    pro: R`$b=2b'$ のときは $x=\frac{-b'\pm\sqrt{b'^{2}-ac}}{a}$ が楽です。解と係数の関係 $\alpha+\beta=-\frac{b}{a},\ \alpha\beta=\frac{c}{a}$ で検算する習慣をつけましょう。`
  };

  JK.registerCalc({
    id: 'ia-quad-eq',
    course: 'IA',
    unit: 'm-quad',
    group: '2次関数',
    title: '2次方程式の解（判別式・因数分解・解の公式）',
    desc: R`2次方程式 $ax^{2}+bx+c=0$ を、判別式 $D$ で解の個数を調べてから、因数分解または解の公式で解きます。グラフと $x$ 軸の交点も図で確かめられます。係数は整数・分数・小数で入力できます。`,
    form: R`ax^{2} + bx + c = 0 \qquad D = b^{2} - 4ac \qquad x = \frac{-b \pm \sqrt{D}}{2a}`,
    inputs: [
      { key: 'a', label: '$a$', type: 'q', def: '1', min: -1000, max: 1000, hint: R`$a \ne 0$。分数（3/4）や小数（0.5）も入力できます。` },
      { key: 'b', label: '$b$', type: 'q', def: '-5', min: -1000, max: 1000 },
      { key: 'c', label: '$c$', type: 'q', def: '6', min: -1000, max: 1000 }
    ],
    examples: [
      { label: 'たすき掛け', v: { a: '2', b: '5', c: '-3' } },
      { label: '解の公式（無理数解）', v: { a: '1', b: '2', c: '-4' } },
      { label: '重解', v: { a: '1', b: '-6', c: '9' } },
      { label: '実数解なし', v: { a: '1', b: '2', c: '5' } },
      { label: '分数係数', v: { a: '1/2', b: '1/2', c: '-3' } },
      { label: 'a が負', v: { a: '-2', b: '3', c: '2' } }
    ],
    intro: INTRO_EQ,
    compute(v) {
      const a = v.a, b = v.b, c = v.c;
      if (a.isZero()) throw CE('a は 0 以外を入力してください（a = 0 だと 2次方程式になりません）');
      const N = normalize(a, b, c);
      const info = analyze(N.A, N.B, N.C);
      const steps = [];
      const ns = normStep(a, b, c, N, 'eq');
      if (ns) steps.push(ns);
      steps.push(discStep(info), countStep(info));
      const rest = info.D < 0 ? negSteps(info) : (info.rational ? factorSteps(info) : formulaSteps(info));
      return { result: eqResult(info), steps: steps.concat(rest), fig: eqFig(a, b, c, info) };
    }
  });

  /* ================= 2次不等式 ================= */

  // x²の係数が正（正規化後）での解の集合を TeX で
  function solutionTex(info, op) {
    const D = info.D;
    if (D > 0) {
      const al = rootTex(info, 0), be = rootTex(info, 1);
      switch (op) {
        case 'gt': return 'x < ' + al + R`,\ ` + be + ' < x';
        case 'ge': return R`x \le ` + al + R`,\ ` + be + R` \le x`;
        case 'lt': return al + ' < x < ' + be;
        default: return al + R` \le x \le ` + be;
      }
    }
    if (D === 0) {
      const al = rootTex(info, 0);
      switch (op) {
        case 'gt': return R`x \ne ` + al;
        case 'ge': return R`\text{すべての実数}`;
        case 'lt': return R`\text{解なし}`;
        default: return 'x = ' + al;
      }
    }
    return (op === 'gt' || op === 'ge') ? R`\text{すべての実数}` : R`\text{解なし}`;
  }
  // 解の範囲（図用）。D=0 の「x ≠ α」は全体を塗る
  function solRegions(info, op) {
    const INF = Infinity, v = info.vals;
    if (info.D > 0) {
      return (op === 'gt' || op === 'ge') ? [{ from: -INF, to: v[0] }, { from: v[1], to: INF }] : [{ from: v[0], to: v[1] }];
    }
    if (info.D === 0) return (op === 'gt' || op === 'ge') ? [{ from: -INF, to: INF }] : [];
    return (op === 'gt' || op === 'ge') ? [{ from: -INF, to: INF }] : [];
  }

  // 解の範囲に入る代表値（整数、なければ半整数）を厳密に探す。正規化後の整数係数 A, B, C で判定。なければ null
  function samplePoint(A, B, C, op2) {
    const holds = (v) => (op2 === 'gt' ? v > 0 : (op2 === 'ge' ? v >= 0 : (op2 === 'lt' ? v < 0 : v <= 0)));
    const ts = [];
    for (let k = 0; k <= 20; k++) { ts.push(k); if (k > 0) ts.push(-k); }
    for (let k = 0; k <= 20; k++) { ts.push(k + 0.5); ts.push(-k - 0.5); }
    for (let i = 0; i < ts.length; i++) {
      if (holds((A * ts[i] + B) * ts[i] + C)) return Q.from(ts[i]);
    }
    return null;
  }

  // グラフと x 軸の上下関係から解を読む
  function readStep(info, op) {
    const A = info.A, B = info.B, C = info.C, D = info.D;
    const fx = pt(Q(A), Q(B), Q(C));
    let m, n, easy;
    if (D > 0) {
      const al = rootTex(info, 0), be = rootTex(info, 1);
      m = [
        R`f(x) > 0 \;\Leftrightarrow\; x < \alpha,\ \beta < x`,
        R`f(x) < 0 \;\Leftrightarrow\; \alpha < x < \beta`,
        R`\alpha = ` + al + R`,\quad \beta = ` + be
      ];
      n = R`グラフは $x$ 軸と $x=\alpha,\ \beta$ の 2 点で交わります。グラフが $x$ 軸より**上側**にある（$f(x)>0$）のは 2 つの交点の**外側**、**下側**にある（$f(x)<0$）のは**内側**です。`;
      easy = R`$f(x)>0$ は「グラフの高さ $y$ が正」、つまり「グラフが $x$ 軸より上にある」という意味です。下に凸（谷の形）の放物線が $x$ 軸と 2 点で交わっているとき、$x$ 軸より上にあるのは左右のはし（2 つの交点の外側）、下にあるのは谷の部分（2 つの交点の内側）です。図で、塗った部分と $x$ 軸の対応を確かめましょう。`;
    } else if (D === 0) {
      m = [
        'f(x) = ' + factoredTex(info) + R` \ge 0`,
        R`f(x) = 0 \;\Leftrightarrow\; x = ` + rootTex(info, 0)
      ];
      n = R`$D=0$ なので $f(x)$ は完全平方式 $` + factoredTex(info) + R`$ です。2 乗は 0 以上なので、$f(x)\ge 0$ がつねに成り立ち、等号が成り立つのは $x=` + rootTex(info, 0) + R`$ のときだけです。グラフは頂点で $x$ 軸に接しています。`;
      easy = R`2 乗した数は 0 以上です。だから $f(x)=(\ )^{2}$ の形に書けると、$f(x)$ は 0 より小さくなりません。0 になるのは、かっこの中が 0 になる 1 点だけで、そこでグラフは $x$ 軸にちょんと触れます。それ以外の $x$ ではグラフは $x$ 軸より上です。`;
    } else {
      const vt = vertexOf(Q(A), Q(B), Q(C));
      m = [
        'f(x) = ' + vertexForm(Q(A), vt.p, vt.q),
        R`f(x) \ge ` + vt.q.tex() + R` > 0`
      ];
      n = R`平方完成すると $f(x)=` + vertexForm(Q(A), vt.p, vt.q) + R`$ です。$(\ )^{2}\ge 0$ なので $f(x)$ の最小値は頂点の $y$ 座標 $` + vt.q.tex() + R`$ で、これは正です。よって $f(x)$ はつねに正で、グラフはつねに $x$ 軸より上にあります。`;
      easy = R`$D<0$ のとき放物線は $x$ 軸と交わりません。しかも下に凸（谷の形）なので、谷の底（頂点）が $x$ 軸より上にあり、グラフ全体が $x$ 軸の上側にあります。つまり $f(x)$ は、どんな $x$ でも正です。`;
    }
    return {
      t: 'グラフと $x$ 軸の上下関係を読み取る',
      m: m,
      n: R`$f(x)=` + fx + R`$ とおきます。$x^{2}$ の係数が正なので、グラフは**下に凸**の放物線です。` + n,
      easy: easy,
      pro: D > 0 ? R`「**$>0$ なら外側、$<0$ なら内側**」と覚えます。等号つき（$\ge,\ \le$）のときは交点（解）も含めます。` : R`$D \le 0$ の不等式は「つねに成り立つ / 解なし / 1 点だけ」の 3 パターン。入試では「すべての $x$ で成り立つ条件」（$a>0$ かつ $D<0$）としてよく出ます。`
    };
  }

  JK.registerCalc({
    id: 'ia-quad-ineq',
    course: 'IA',
    unit: 'm-quad',
    group: '2次関数',
    title: '2次不等式',
    desc: R`2次不等式 $ax^{2}+bx+c>0$（＜・≧・≦ も可）の解を、方程式の解とグラフの位置関係から求めます。$a<0$ のときは両辺を $-1$ 倍して $a>0$ にそろえます。解の範囲は図で塗って示します。`,
    form: R`ax^{2} + bx + c \;\bigcirc\; 0 \qquad (\bigcirc \text{ は } >,\ \ge,\ <,\ \le)`,
    inputs: [
      { key: 'a', label: '$a$', type: 'q', def: '1', min: -1000, max: 1000, hint: R`$a \ne 0$。分数や小数も入力できます。` },
      { key: 'b', label: '$b$', type: 'q', def: '-3', min: -1000, max: 1000 },
      { key: 'c', label: '$c$', type: 'q', def: '2', min: -1000, max: 1000 },
      { key: 'op', label: '不等号（右辺は 0）', type: 'select', def: 'gt', options: [['gt', '＞ 0'], ['ge', '≧ 0'], ['lt', '＜ 0'], ['le', '≦ 0']] }
    ],
    examples: [
      { label: 'a が負（−1 倍する）', v: { a: '-1', b: '2', c: '3', op: 'gt' } },
      { label: '内側（＜ 0）', v: { a: '1', b: '-2', c: '-8', op: 'lt' } },
      { label: '無理数の端点', v: { a: '1', b: '-2', c: '-1', op: 'ge' } },
      { label: '重解（D=0）', v: { a: '1', b: '-4', c: '4', op: 'le' } },
      { label: 'D<0（つねに成り立つ）', v: { a: '1', b: '1', c: '1', op: 'gt' } },
      { label: 'D<0（解なし）', v: { a: '2', b: '-1', c: '3', op: 'lt' } }
    ],
    intro: {
      easy: R`2次不等式は、「放物線 $y=ax^{2}+bx+c$ が $x$ 軸より**上**にある（$>0$）、または**下**にある（$<0$）のは、$x$ がどの範囲のときか」という問題です。
そこでまず、放物線が $x$ 軸と交わる点（方程式 $ax^{2}+bx+c=0$ の解）を求めます。次に、グラフの形（下に凸か）と交点の位置から、「上にある範囲」「下にある範囲」を読み取ります。$x^{2}$ の係数が負のときは、両辺に $-1$ をかけて正にそろえると読み取りやすくなります（そのとき**不等号の向きが逆**になります）。`,
      normal: R`$a>0$ にそろえてから、$D$ で場合分けします。$D>0$（解 $\alpha<\beta$）: $>0$ は $x<\alpha,\ \beta<x$、$<0$ は $\alpha<x<\beta$。$D=0$、$D<0$ は 2 乗の形・頂点の位置から読み取ります。`,
      pro: R`「$>0$ は外側、$<0$ は内側」。$D\le 0$ の場合分け（つねに成り立つ・解なし・$x\ne\alpha$）を落とさないこと。『すべての $x$ で成り立つ』は $a>0$ かつ $D<0$ です。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c, op = v.op;
      if (a.isZero()) throw CE('a は 0 以外を入力してください（a = 0 だと 2次不等式になりません）');
      const N = normalize(a, b, c);
      const op2 = N.flip ? FLIP[op] : op;
      const info = analyze(N.A, N.B, N.C);
      const A = Q(N.A), B = Q(N.B), C = Q(N.C);
      const steps = [];
      const ns = normStep(a, b, c, N, op);
      if (ns) steps.push(ns);
      steps.push({
        t: R`対応する方程式 $` + pt(A, B, C) + R` = 0$ を考える`,
        m: pt(A, B, C) + ' ' + REL[op2] + R` 0 \quad \Rightarrow \quad \text{まず } ` + pt(A, B, C) + R` = 0 \text{ を解く}`,
        n: R`不等式の境目になるのは、$f(x) = ` + pt(A, B, C) + R`$ が 0 になる $x$（グラフが $x$ 軸と交わる点）です。判別式 $D$ を使って、その解を調べます。`,
        easy: R`$f(x)$ の符号（正か負か）が入れ替わる場所は、$f(x)=0$ になるところ、つまりグラフが $x$ 軸と交わる点です。まず境目を調べておくと、そのあいだの区間ごとに正か負かが決まります。`
      });
      steps.push(discStep(info), countStep(info));
      if (info.D > 0) {
        if (info.rational) {
          const f1 = linFac(info.roots[0].n, info.roots[0].d), f2 = linFac(info.roots[1].n, info.roots[1].d);
          steps.push({
            t: '方程式を解く（因数分解）',
            m: [pt(A, B, C) + ' = ' + factoredTex(info) + ' = 0', 'x = ' + info.roots[0].tex() + R`,\ ` + info.roots[1].tex()],
            n: R`$D=` + info.D + R`$ は平方数なので因数分解できます（$(` + f1 + R`)$ と $(` + f2 + R`)$ の積）。それぞれ $=0$ とおいて、$x=` + info.roots[0].tex() + R`,\ ` + info.roots[1].tex() + R`$ を得ます。小さいほうを $\alpha$、大きいほうを $\beta$ とします（$\alpha<\beta$）。`,
            easy: R`因数分解して「積が 0 なら、どちらかが 0」を使います。2 つの解が、グラフと $x$ 軸の 2 つの交点の位置です。このあと使うので、小さいほうを $\alpha$、大きいほうを $\beta$ と呼ぶことにします。`
          });
        } else {
          const sd = info.surd;
          steps.push({
            t: '方程式を解く（解の公式）',
            m: [
              R`x = \frac{-` + U.paren(N.B) + R` \pm \sqrt{` + info.D + R`}}{2 \cdot ` + N.A + '}',
              'x = ' + pmTex(sd.p, sd.k, sd.m, sd.d),
              'x = ' + rootTex(info, 0) + R`,\ ` + rootTex(info, 1)
            ],
            n: R`$D=` + info.D + R`$ は平方数ではないので、解の公式で解きます（根号を簡単にし、約分します）。近似値は $x \approx ` + U.fmt(info.vals[0], 3) + R`,\ ` + U.fmt(info.vals[1], 3) + R`$ です。小さいほうを $\alpha$、大きいほうを $\beta$ とします（$\alpha<\beta$）。`,
            easy: R`因数分解できないときは解の公式 $x=\frac{-b\pm\sqrt{D}}{2a}$ で境目を求めます。答えに根号が残っても、それが正確な値です。このあと使うので、小さいほうを $\alpha$、大きいほうを $\beta$ と呼ぶことにします。`
          });
        }
      }
      steps.push(readStep(info, op2));
      const sol = solutionTex(info, op2);
      const incl = (op2 === 'ge' || op2 === 'le');
      steps.push({
        t: '解を不等式で答える',
        m: 'x\\text{ の範囲}\\quad ' + sol,
        n: info.D > 0
          ? (incl ? R`不等号に「=」がある（$\ge,\ \le$）ので、境目の値 $x=\alpha,\ \beta$ も解に**含まれます**。` : R`不等号に「=」がない（$>,\ <$）ので、境目の値 $x=\alpha,\ \beta$ は解に**含まれません**。`)
          : R`場合分けの結果を、そのまま解として答えます。`,
        easy: R`図の塗った部分が、条件を満たす $x$ の範囲です。「=」つきのとき（$\ge,\ \le$）は端の点も含み、「=」なしのとき（$>,\ <$）は端の点を含みません。`
      });
      const tv = samplePoint(N.A, N.B, N.C, op2);
      if (tv) {
        const val = a.mul(tv).mul(tv).add(b.mul(tv)).add(c);
        steps.push({
          t: '解の範囲の値を、もとの不等式に代入して確かめる',
          m: [
            R`\text{もとの不等式: } ` + pt(a, b, c) + ' ' + REL[op] + ' 0',
            R`x = ` + tv.tex() + R`\ \text{のとき: } ` + a.tex() + R` \cdot ` + U.paren(tv) + R`^{2} ` + U.signed(b) + R` \cdot ` + U.paren(tv) + ' ' + U.signed(c) + ' = ' + val.tex() + ' ' + REL[op] + R` 0 \quad \text{（成り立つ）}`
          ],
          n: R`求めた解の範囲に入る値 $x=` + tv.tex() + R`$ を**もとの不等式**に代入すると、確かに成り立ちます。` + (N.flip ? R`$-1$ 倍して不等号の向きを逆にした不等式と、もとの不等式は同じ解をもつことの確認にもなります。` : ''),
          lv: 2
        });
      } else if (info.D <= 0) {                              // 解がない場合: 最小値（頂点）で確かめる
        const vt = vertexOf(A, B, C);
        steps.push({
          t: '最小値で、解がないことを確かめる',
          m: [
            R`f(` + vt.p.tex() + R`) = ` + vt.q.tex() + R`\quad (\text{最小値})`,
            R`f(x) \ge ` + vt.q.tex() + R` \;\Rightarrow\; f(x) ` + REL[op2] + R` 0 \text{ を満たす } x \text{ はない}`
          ],
          n: R`下に凸の放物線は、頂点で最小値 $` + vt.q.tex() + R`$ をとります。最小値が 0 以上なので、$f(x)<0$（または $f(x)\le0$）となる $x$ は存在しません。`,
          lv: 2
        });
      }
      const res = [
        { label: '解', tex: sol },
        { label: '整えた不等式', tex: pt(A, B, C) + ' ' + REL[op2] + ' 0' },
        { label: '判別式 D', tex: 'D = ' + info.D }
      ];
      res.push(info.D >= 0 ? { label: '方程式の解', tex: 'x = ' + allRootsTex(info) } : { label: '方程式の実数解', tex: R`\text{なし}` });
      // 図
      const regions = solRegions(info, op2);
      const none = !regions.length && !(info.D === 0 && op2 === 'le');
      let fig;
      if (info.D >= 0) {                                   // 境目（方程式の解）に破線と値、解の範囲を塗る
        fig = parabolaFig(A, B, C, info.vals, {
          points: info.vals.map((x) => ({ x: x, y: 0, cls: 'c3' })),
          marks: info.vals.map((x, i) => ({ x: x, text: 'x=' + rootText(info, i) })),
          regions: regions,
          note: none ? '解なし' : null
        });
      } else {
        const vt = vertexOf(A, B, C);
        const h = Math.max(2, Math.min(8, 1.5 * Math.sqrt(Math.abs(vt.q.val() / A.val()))));
        fig = parabolaFig(A, B, C, [vt.p.val() - h, vt.p.val() + h], {
          points: [{ x: vt.p.val(), y: vt.q.val(), label: '頂点(' + vt.p.toString() + ', ' + vt.q.toString() + ')', cls: 'c3', pos: 'br' }],
          regions: regions,
          note: none ? '解なし' : null
        });
      }
      return { result: res, steps: steps, fig: fig };
    }
  });

  /* ================= 2次関数の決定 ================= */

  // 図: 通る点と頂点
  function fromFig(a, b, c, pts) {
    const vt = vertexInfo(a, b, c);
    const isV = (t) => !!vt.ex && t[0].eq(vt.ex.p) && t[1].eq(vt.ex.q);   // 通る点が頂点そのものの場合は 1 つにまとめる
    const vl = '頂点(' + vt.ps + ', ' + vt.qs + ')';
    const points = pts.map((t) => ({ x: t[0].val(), y: t[1].val(), label: isV(t) ? vl : '(' + t[0].toString() + ', ' + t[1].toString() + ')', cls: isV(t) ? 'c3' : 'c2' }));
    if (!pts.some(isV)) points.push({ x: vt.p, y: vt.q, label: vl, cls: 'c3' });
    return parabolaFig(a, b, c, pts.map((t) => t[0].val()), { points: points });
  }

  // 一般形・平方完成形・頂点の結果欄
  function formResult(a, b, c) {
    const vt = vertexInfo(a, b, c).ex;
    const res = [{ label: '一般形', tex: 'y = ' + pt(a, b, c) }];
    if (vt) {
      res.push({ label: '平方完成形', tex: 'y = ' + vertexForm(a, vt.p, vt.q) });
      res.push({ label: '頂点', tex: R`\left(` + vt.p.tex() + R`,\ ` + vt.q.tex() + R`\right)` });
    }
    res.push({ label: a.sign() > 0 ? '下に凸（a > 0）' : '上に凸（a < 0）', tex: 'a = ' + a.tex() });
    return res;
  }

  JK.registerCalc({
    id: 'ia-quad-from',
    course: 'IA',
    unit: 'm-quad',
    group: '2次関数',
    title: '2次関数の決定（頂点と1点 / 3点）',
    desc: R`条件から2次関数を決定します。「頂点と通る1点」のときは平方完成形 $y=a(x-p)^{2}+q$ から、「通る3点」のときは一般形 $y=ax^{2}+bx+c$ の連立方程式から求め、一般形と平方完成形の両方で答えます。`,
    form: [R`y = a(x-p)^{2} + q`, R`y = ax^{2} + bx + c`],
    inputs: [
      { key: 'mode', label: '与えられた条件', type: 'select', def: 'vertex', options: [['vertex', '頂点と、通る 1 点'], ['three', '通る 3 点']] },
      { key: 'p', label: '頂点の $x$ 座標 $p$', type: 'q', def: '2', min: -1000, max: 1000, show: (raw) => raw.mode === 'vertex' },
      { key: 'q', label: '頂点の $y$ 座標 $q$', type: 'q', def: '-1', min: -1000, max: 1000, show: (raw) => raw.mode === 'vertex' },
      { key: 'x1', label: '点 1 の $x$ 座標 $x_1$', type: 'q', def: '0', min: -1000, max: 1000, hint: '「頂点と 1 点」のときは、この点 1 だけを使います。' },
      { key: 'y1', label: '点 1 の $y$ 座標 $y_1$', type: 'q', def: '3', min: -1000, max: 1000 },
      { key: 'x2', label: '点 2 の $x$ 座標 $x_2$', type: 'q', def: '1', min: -1000, max: 1000, show: (raw) => raw.mode === 'three' },
      { key: 'y2', label: '点 2 の $y$ 座標 $y_2$', type: 'q', def: '0', min: -1000, max: 1000, show: (raw) => raw.mode === 'three' },
      { key: 'x3', label: '点 3 の $x$ 座標 $x_3$', type: 'q', def: '3', min: -1000, max: 1000, show: (raw) => raw.mode === 'three' },
      { key: 'y3', label: '点 3 の $y$ 座標 $y_3$', type: 'q', def: '0', min: -1000, max: 1000, show: (raw) => raw.mode === 'three' }
    ],
    examples: [
      { label: '頂点(1,−4)・点(3,0)', v: { mode: 'vertex', p: '1', q: '-4', x1: '3', y1: '0' } },
      { label: '頂点(2,3)・点(0,−1)（上に凸）', v: { mode: 'vertex', p: '2', q: '3', x1: '0', y1: '-1' } },
      { label: '3 点 (0,3)(1,0)(3,0)', v: { mode: 'three', x1: '0', y1: '3', x2: '1', y2: '0', x3: '3', y3: '0' } },
      { label: '3 点（分数の係数になる）', v: { mode: 'three', x1: '-1', y1: '2', x2: '1', y2: '0', x3: '3', y3: '4' } }
    ],
    intro: {
      easy: R`2次関数のグラフは放物線です。放物線を 1 つに決めるには、式 $y=ax^{2}+bx+c$ の 3 つの文字 $a,\ b,\ c$ の値を決めなければなりません。そのためには「3 つの情報」が必要です。
**頂点が分かっている**ときは、式を $y=a(x-p)^{2}+q$（頂点が $(p,\ q)$）とおくと、残る文字は $a$ だけ。通る点を 1 つ代入すれば $a$ が決まります。**頂点が分からず 3 点だけ**分かっているときは、$y=ax^{2}+bx+c$ とおいて 3 点を代入し、$a,\ b,\ c$ の連立方程式を解きます。`,
      normal: R`頂点（または軸）が分かるなら $y=a(x-p)^{2}+q$、x 軸との交点が分かるなら $y=a(x-\alpha)(x-\beta)$、それ以外（通る 3 点）なら $y=ax^{2}+bx+c$ とおくのが基本です。`,
      pro: R`3 点から決めるときは、$c$ を引き算で消去 → $a,\ b$ の連立 の流れ。係数が整数にならないときは計算ミスを疑い、最後に 3 点すべてで検算します。`
    },
    compute(v) {
      try {
        return v.mode === 'three' ? threeCalc(v) : vertexCalc(v);
      } catch (e) {
        if (e instanceof JK.CalcError && /大きすぎ/.test(e.message)) throw CE('小数の桁数や分母が大きくなりすぎて、厳密に計算できません。整数や簡単な分数に直して入力してください');
        throw e;
      }
    }
  });

  function vertexCalc(v) {
    const p = v.p, q = v.q, x1 = v.x1, y1 = v.y1;
    if (x1.eq(p)) throw CE('通る点の x 座標が頂点の x 座標と同じです。このままでは a が決まりません（頂点と異なる x 座標の点を入れてください）');
    const dx = x1.sub(p), u = dx.mul(dx);                 // (x1 - p)²
    const a = y1.sub(q).div(u);
    if (a.isZero()) throw CE('通る点の高さが頂点と同じため a = 0 となり、2次関数になりません（別の点を入れてください）');
    const b = a.mul(p).mul(2).neg(), c = a.mul(p).mul(p).add(q);
    const steps = [];
    steps.push({
      t: '頂点が分かっているので、平方完成形でおく',
      m: [R`y = a(x - p)^{2} + q`, R`y = a` + (p.isZero() ? 'x^{2}' : R`\left(` + shift(p) + R`\right)^{2}`) + (q.isZero() ? '' : ' ' + U.signed(q))],
      n: R`頂点が $(p,\ q)=(` + p.tex() + R`,\ ` + q.tex() + R`)$ のとき、放物線は $y=a(x-p)^{2}+q$ と書けます。残る文字は $a$ だけです。`,
      easy: R`$y=a(x-p)^{2}+q$ のグラフは、$y=ax^{2}$ のグラフを「右に $p$、上に $q$」平行移動したもので、頂点は $(p,\ q)$ になります。頂点の座標が分かっているなら、これに当てはめるだけで、あとは $a$（グラフの開き方）を決めればよいのです。`,
      pro: R`軸が $x=p$ と分かるだけなら $y=a(x-p)^{2}+q$ の $q$ も未知数として、通る 2 点から $a,\ q$ を決めます。`
    });
    steps.push({
      t: R`通る点 $(` + x1.tex() + R`,\ ` + y1.tex() + R`)$ を代入して $a$ を求める`,
      m: [
        R`y_{1} = a(x_{1} - p)^{2} + q`,
        y1.tex() + ' = a' + R`\left(` + U.paren(x1) + ' - ' + U.paren(p) + R`\right)^{2} ` + U.signed(q),
        y1.tex() + ' = ' + (u.eq(1) ? '' : u.tex()) + 'a ' + U.signed(q),
        (u.eq(1) ? '' : u.tex()) + 'a = ' + y1.sub(q).tex(),
        'a = ' + a.tex()
      ],
      n: R`点 $(x_{1},\ y_{1})=(` + x1.tex() + R`,\ ` + y1.tex() + R`)$ は放物線の上にあるので、$x=` + x1.tex() + R`$ のとき $y=` + y1.tex() + R`$ です。これを代入すると、$a$ だけの 1 次方程式になります。`,
      easy: R`「点 $(x_{1},\ y_{1})$ を通る」とは、式の $x$ に $x_{1}$ を入れると $y$ が $y_{1}$ になる、ということです。だから $x$ と $y$ に点の座標をそのまま入れ、$a$ について解きます。`
    });
    const vf = vertexForm(a, p, q);
    steps.push({
      t: '平方完成形の答え',
      m: 'y = ' + vf,
      n: R`$a=` + a.tex() + R`$ を $y=a(x-p)^{2}+q$ に戻します。` + (a.sign() > 0 ? R`$a>0$ なので下に凸の放物線です。` : R`$a<0$ なので上に凸の放物線です。`),
      easy: R`求めた $a$ をもとの式に入れれば、頂点 $(` + p.tex() + R`,\ ` + q.tex() + R`)$ をもつ放物線の式が完成します。`
    });
    steps.push({
      t: '展開して一般形に直す',
      m: [
        R`(x - p)^{2} = x^{2} - 2px + p^{2}`,
        chain('y', [vf, coef(a) + R`\left(x^{2} ` + (p.isZero() ? '' : U.signed(p.mul(2).neg()) + 'x ' + U.signed(p.mul(p))) + R`\right)` + (q.isZero() ? '' : ' ' + U.signed(q)), pt(a, b, c)])
      ],
      n: R`展開の公式で括弧を外し、$a$ を分配して同類項をまとめると、一般形 $y=ax^{2}+bx+c$ になります。`,
      easy: R`$(x-p)^{2}$ は「$x-p$ を 2 回かけたもの」なので、$x^{2}-2px+p^{2}$ に展開できます。それに $a$ をかけ、最後に $q$ を足せば、$y=ax^{2}+bx+c$ の形になります。`,
      lv: 2
    });
    const fv = a.mul(x1).mul(x1).add(b.mul(x1)).add(c);
    steps.push({
      t: '通る点で確かめる',
      m: R`f(` + x1.tex() + R`) = ` + a.tex() + R` \cdot ` + U.paren(x1) + R`^{2} ` + U.signed(b) + R` \cdot ` + U.paren(x1) + ' ' + U.signed(c) + ' = ' + fv.tex(),
      n: R`一般形に $x=` + x1.tex() + R`$ を代入すると $y=` + fv.tex() + R`$ となり、通る点の $y$ 座標 $` + y1.tex() + R`$ と一致します。`,
      lv: 2
    });
    return { result: formResult(a, b, c), steps: steps, fig: fromFig(a, b, c, [[x1, y1]]) };
  }

  function threeCalc(v) {
    const x1 = v.x1, y1 = v.y1, x2 = v.x2, y2 = v.y2, x3 = v.x3, y3 = v.y3;
    if (x1.eq(x2) || x1.eq(x3) || x2.eq(x3)) throw CE('3 点の x 座標は、すべて異なる値にしてください（x 座標が同じ点があると、y が 2 つに決まらず関数になりません）');
    const s12 = y1.sub(y2).div(x1.sub(x2)), s23 = y2.sub(y3).div(x2.sub(x3));
    const a = s12.sub(s23).div(x1.sub(x3));
    if (a.isZero()) throw CE('3 点が一直線上に並んでいるため、2次関数になりません（a = 0 になります）');
    const b = s12.sub(x1.add(x2).mul(a));
    const c = y1.sub(a.mul(x1).mul(x1)).sub(b.mul(x1));
    const X = [x1, x2, x3], Y = [y1, y2, y3], one = Q(1);
    const eqn = (i) => linTex([X[i].mul(X[i]), X[i], one], ['a', 'b', 'c']) + ' = ' + Y[i].tex();
    const steps = [];
    steps.push({
      t: '一般形 $y = ax^{2} + bx + c$ とおく',
      m: R`y = ax^{2} + bx + c`,
      n: R`頂点も軸も分からないので、一般形でおきます。未知数は $a,\ b,\ c$ の 3 つ。3 点の座標から 3 本の式をつくって解きます。`,
      easy: R`放物線を決める 3 つの数 $a,\ b,\ c$ を文字のままおきます。3 つの点を通るという条件が 3 つあるので、ちょうど 3 本の式（連立方程式）ができ、$a,\ b,\ c$ が決まります。`
    });
    steps.push({
      t: '3 点の座標を代入して、$a,\ b,\ c$ の式を 3 本つくる',
      m: [0, 1, 2].map((i) => Y[i].tex() + R` = a \cdot ` + U.paren(X[i]) + R`^{2} + b \cdot ` + U.paren(X[i]) + ' + c' + R` \;\Rightarrow\; ` + eqn(i) + R`\quad \cdots\ ` + '①②③'.charAt(i)),
      n: R`点 $(x_{i},\ y_{i})$ を通るので、$x=x_{i}$ のとき $y=y_{i}$ です。式に代入して整理します。`,
      easy: R`「点を通る」とは、その点の座標を式に入れると等式が成り立つ、ということです。たとえば点 $(` + x1.tex() + R`,\ ` + y1.tex() + R`)$ なら、$x=` + x1.tex() + R`$、$y=` + y1.tex() + R`$ を $y=ax^{2}+bx+c$ に入れます。すると $a,\ b,\ c$ についての 1 次式（①）になります。`
    });
    const lhs12 = [X[0].mul(X[0]).sub(X[1].mul(X[1])), X[0].sub(X[1]), Q(0)];
    const lhs23 = [X[1].mul(X[1]).sub(X[2].mul(X[2])), X[1].sub(X[2]), Q(0)];
    steps.push({
      t: '引き算で $c$ を消去する',
      m: [
        R`\text{①} - \text{②}:\quad ` + linTex(lhs12, ['a', 'b', 'c']) + ' = ' + y1.sub(y2).tex() + R`\quad \cdots\ ④`,
        R`\text{②} - \text{③}:\quad ` + linTex(lhs23, ['a', 'b', 'c']) + ' = ' + y2.sub(y3).tex() + R`\quad \cdots\ ⑤`
      ],
      n: R`①，②，③はどれも $c$ の係数が 1 なので、辺々を引くと $c$ が消えて、$a,\ b$ だけの式が 2 本できます。`,
      easy: R`連立方程式は、2 つの式を引き算（または足し算）して文字を 1 つ消すのが基本です。①，②，③では $c$ の係数がどれも 1 なので、引くと $c-c=0$ で $c$ が消えます。これで、文字 3 つの問題が、文字 2 つ（$a,\ b$）の問題になります。`
    });
    const l12 = [X[0].add(X[1]), one, Q(0)], l23 = [X[1].add(X[2]), one, Q(0)];
    steps.push({
      t: R`④，⑤をそれぞれ $x$ の差でわって、$b$ の係数をそろえる`,
      m: [
        R`\text{④} \div (` + x1.sub(x2).tex() + R`):\quad ` + linTex(l12, ['a', 'b', 'c']) + ' = ' + s12.tex() + R`\quad \cdots\ ⑥`,
        R`\text{⑤} \div (` + x2.sub(x3).tex() + R`):\quad ` + linTex(l23, ['a', 'b', 'c']) + ' = ' + s23.tex() + R`\quad \cdots\ ⑦`
      ],
      n: R`$x_{1}^{2}-x_{2}^{2}=(x_{1}-x_{2})(x_{1}+x_{2})$ なので、④の両辺を $x_{1}-x_{2}$ でわると $b$ の係数が 1 になります（⑤も同様）。これで次の引き算で $b$ を消せます。`,
      easy: R`④と⑤をこのまま引いても $b$ は消えません（係数がちがうため）。そこで両辺を同じ数でわって、$b$ の係数を 1 にそろえます。$a$ の係数は $x_{1}^{2}-x_{2}^{2}=(x_{1}-x_{2})(x_{1}+x_{2})$ と因数分解できるので、$(x_{1}-x_{2})$ でわるときれいに $x_{1}+x_{2}$ になります。`,
      pro: R`$b$ の係数が 1 になるまでわる操作は、「平均変化率（傾き）」を求めているのと同じです。2 点を結ぶ直線の傾きが $a(x_{1}+x_{2})+b$ になる、と覚えておくと速く解けます。`
    });
    steps.push({
      t: '⑥−⑦で $b$ を消して $a$ を求める',
      m: [
        R`\text{⑥} - \text{⑦}:\quad ` + linTex([x1.add(x2).sub(x2.add(x3)), Q(0), Q(0)], ['a', 'b', 'c']) + ' = ' + s12.sub(s23).tex(),
        'a = ' + a.tex()
      ],
      n: R`⑥から⑦を引くと $b$ が消えて、$a$ だけの方程式になります。`,
      easy: R`⑥と⑦はどちらも $b$ の係数が 1 なので、引くと $b$ が消えます。残った式を解けば $a$ が決まります。`
    });
    steps.push({
      t: R`$a$ を代入して $b,\ c$ を求める`,
      m: [
        R`\text{⑥}:\quad b = ` + s12.tex() + ' - ' + U.paren(x1.add(x2)) + R` \cdot ` + U.paren(a) + ' = ' + b.tex(),
        R`\text{①}:\quad c = ` + y1.tex() + ' - ' + U.paren(a) + R` \cdot ` + U.paren(x1.mul(x1)) + ' - ' + U.paren(b) + R` \cdot ` + U.paren(x1) + ' = ' + c.tex()
      ],
      n: R`求めた $a=` + a.tex() + R`$ を⑥に入れて $b$、さらに①に入れて $c$ を求めます。`,
      easy: R`$a$ が分かったら、順番にさかのぼって他の文字も決めます。⑥に $a$ を入れれば $b$、①に $a,\ b$ を入れれば $c$ が出ます。`
    });
    const vt = vertexInfo(a, b, c).ex;
    steps.push({
      t: '一般形の答え',
      m: 'y = ' + pt(a, b, c),
      n: R`$a=` + a.tex() + R`,\ b=` + b.tex() + R`,\ c=` + c.tex() + R`$ を $y=ax^{2}+bx+c$ に入れます。`,
      easy: R`3 つの文字がすべて決まったので、放物線の式が 1 つに決まりました。`,
      pro: R`3 点から決める問題は、$c$ が $y$ 切片（$x=0$ の点）として分かれば計算がぐっと楽になります。`
    });
    steps.push({
      t: '3 点で確かめる',
      m: [0, 1, 2].map((i) => R`f(` + X[i].tex() + ') = ' + Y[i].tex()),
      n: R`求めた式に 3 点の $x$ 座標を入れると、それぞれ $y$ 座標と一致します。`,
      lv: 2
    });
    if (vt) {
      steps.push({
        t: '平方完成して頂点を求める',
        m: [pt(a, b, c) + ' = ' + vertexForm(a, vt.p, vt.q), R`\text{頂点 } \left(` + vt.p.tex() + R`,\ ` + vt.q.tex() + R`\right)`],
        n: R`平方完成すると頂点が分かります（途中式は「平方完成・頂点・軸」の計算機で確認できます）。`,
        easy: R`一般形 $y=ax^{2}+bx+c$ は、平方完成すると $y=a(x-p)^{2}+q$ の形になり、頂点 $(p,\ q)$ が読み取れます。`,
        lv: 2
      });
    }
    return { result: formResult(a, b, c), steps: steps, fig: fromFig(a, b, c, [[x1, y1], [x2, y2], [x3, y3]]) };
  }
})();
