/* 数II・B — 図形と方程式: 2点間の距離・内分点・外分点 / 直線 / 円 / 領域の判定 / 軌跡
   構成は ia-quad.js に準拠（intro → result → steps(easy / pro / lv) → fig）。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;

  /* ---------- 共通ヘルパ ---------- */

  function pw(q, k) {
    const base = (q.isInt() && q.sign() >= 0) ? q.tex() : R`\left(` + q.tex() + R`\right)`;
    return base + '^{' + k + '}';
  }
  function par(t) { return /\\frac|\\sqrt/.test(t) ? R`\left(` + t + R`\right)` : '(' + t + ')'; }
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
  const ptex = (p) => P.tex(p, 'x');
  // 点の TeX（Q 同士）
  const pt = (x, y) => R`\left(` + x.tex() + R`,\ ` + y.tex() + R`\right)`;
  // 点の TeX（TeX 文字列同士）
  const ptS = (xs, ys) => R`\left(` + xs + R`,\ ` + ys + R`\right)`;
  // 点の文字列（図のラベル用）
  const lab = (name, x, y) => name + '(' + x.toString() + ', ' + y.toString() + ')';
  // Q の配列を整数にそろえる（gcd 1・最初の非零が正）
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
  // (v - p)^2 の TeX
  function sq(v, p) {
    if (p.isZero()) return v + '^{2}';
    const inner = v + (p.sign() > 0 ? ' - ' + p.tex() : ' + ' + p.neg().tex());
    return par(inner) + '^{2}';
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
  // √T = t0·√m（T は非負の Q）
  function sqrtParts(T) {
    const s = U.sqrtSimplify(T.n * T.d);
    return { c: Q(s.out, T.d), m: s.in };
  }
  // 直線 ax + by + c = 0 の整数係数形
  function normLine(a, b, c) {
    const sc = intScale([a, b, c]);
    return { a: Q(sc.ints[0]), b: Q(sc.ints[1]), c: Q(sc.ints[2]), k: sc.k };
  }
  const lineGen = (a, b, c) => lc([[a, 'x'], [b, 'y'], [c, '']]) + ' = 0';
  // y = mx + n（b = 0 のときは x = k）
  function lineSlope(a, b, c) {
    if (b.isZero()) return 'x = ' + c.neg().div(a).tex();
    return 'y = ' + ptex([c.neg().div(b), a.neg().div(b)]);
  }
  const slopeOf = (a, b) => (b.isZero() ? null : a.neg().div(b));
  const wordJa = (x) => String(x);

  /* ---------- 図のための窓・直線の切り取り ---------- */
  function fitWindow(pts, minHalf, W, H) {
    W = W || 340; H = H || 300;
    const pw0 = W - 48, ph0 = H - 40;
    let xlo = Infinity, xhi = -Infinity, ylo = Infinity, yhi = -Infinity;
    pts.forEach((p) => {
      if (!isFinite(p[0]) || !isFinite(p[1])) return;
      xlo = Math.min(xlo, p[0]); xhi = Math.max(xhi, p[0]); ylo = Math.min(ylo, p[1]); yhi = Math.max(yhi, p[1]);
    });
    if (!isFinite(xlo)) { xlo = -3; xhi = 3; ylo = -3; yhi = 3; }
    const cx = (xlo + xhi) / 2, cy = (ylo + yhi) / 2;
    const hx = Math.max((xhi - xlo) / 2 * 1.3 + 0.4, minHalf || 2), hy = Math.max((yhi - ylo) / 2 * 1.3 + 0.4, minHalf || 2);
    const s = Math.max(2 * hx / pw0, 2 * hy / ph0);
    return { x: [cx - s * pw0 / 2, cx + s * pw0 / 2], y: [cy - s * ph0 / 2, cy + s * ph0 / 2], w: W, h: H };
  }
  function clipLine(a, b, c, win) {
    const pts = [];
    const ex = 1e-9 * Math.max(1, win.x[1] - win.x[0]), ey = 1e-9 * Math.max(1, win.y[1] - win.y[0]);
    if (Math.abs(b) > 1e-12) {
      win.x.forEach((x) => { const y = -(a * x + c) / b; if (y >= win.y[0] - ey && y <= win.y[1] + ey) pts.push([x, y]); });
    }
    if (Math.abs(a) > 1e-12) {
      win.y.forEach((y) => { const x = -(b * y + c) / a; if (x >= win.x[0] - ex && x <= win.x[1] + ex) pts.push([x, y]); });
    }
    if (pts.length < 2) return null;
    let best = [pts[0], pts[1]], bd = -1;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const dd = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (dd > bd) { bd = dd; best = [pts[i], pts[j]]; }
    }
    return best;
  }
  function addLine(o, a, b, c, cls, dash, label) {
    const seg = clipLine(a, b, c, { x: o.x, y: o.y });
    if (!seg) return;
    o.segs.push({ x1: seg[0][0], y1: seg[0][1], x2: seg[1][0], y2: seg[1][1], cls: cls, dash: !!dash, label: label });
  }
  function baseOpts(win, extra) {
    return Object.assign({ w: win.w, h: win.h, x: win.x, y: win.y, equal: true, segs: [], points: [], param: [], curves: [], fills: [], labels: [] }, extra || {});
  }
  const circleParam = (cx, cy, r, cls, dash) => ({ x: (t) => cx + r * Math.cos(t), y: (t) => cy + r * Math.sin(t), t: [0, 2 * Math.PI], cls: cls, dash: !!dash });
  // 原点が円の近くにあるときだけ窓に含める
  function maybeOrigin(cx, cy, r) { return Math.hypot(cx, cy) <= 4 * r ? [[0, 0]] : []; }

  /* ================= 2点間の距離・内分点・外分点 ================= */

  JK.registerCalc({
    id: 'iib-points',
    course: 'IIB',
    unit: 'm-coord',
    group: '図形と方程式',
    title: '2点間の距離・内分点・外分点',
    desc: R`2 点 $A(x_{1},\ y_{1}),\ B(x_{2},\ y_{2})$ の距離と中点、線分 $AB$ を $m : n$ に内分・外分する点を求めます。`,
    form: [R`AB = \sqrt{(x_{2}-x_{1})^{2} + (y_{2}-y_{1})^{2}}`, R`\text{内分点 } \left(\frac{nx_{1}+mx_{2}}{m+n},\ \frac{ny_{1}+my_{2}}{m+n}\right),\quad \text{外分点 } \left(\frac{-nx_{1}+mx_{2}}{m-n},\ \frac{-ny_{1}+my_{2}}{m-n}\right)`],
    inputs: [
      { key: 'x1', label: R`$A$ の $x$ 座標 $x_{1}$`, type: 'q', def: '1' },
      { key: 'y1', label: R`$A$ の $y$ 座標 $y_{1}$`, type: 'q', def: '2' },
      { key: 'x2', label: R`$B$ の $x$ 座標 $x_{2}$`, type: 'q', def: '7' },
      { key: 'y2', label: R`$B$ の $y$ 座標 $y_{2}$`, type: 'q', def: '5' },
      { key: 'm', label: R`比 $m$`, type: 'q', def: '2', hint: R`$m : n$ は正の数（整数でなくてもよい）` },
      { key: 'n', label: R`比 $n$`, type: 'q', def: '1' }
    ],
    examples: [
      { label: '2:1', v: { x1: '1', y1: '2', x2: '7', y2: '5', m: '2', n: '1' } },
      { label: '3:2（根号の距離）', v: { x1: '-2', y1: '1', x2: '3', y2: '-3', m: '3', n: '2' } },
      { label: '1:1（中点と外分なし）', v: { x1: '0', y1: '0', x2: '4', y2: '6', m: '1', n: '1' } },
      { label: '外分点が A 側', v: { x1: '2', y1: '-1', x2: '5', y2: '3', m: '1', n: '3' } }
    ],
    intro: {
      easy: R`座標平面の 2 点 $A,\ B$ を結ぶ線分を斜辺とする直角三角形を、横と縦の線を引いて作ります。横の長さが $|x_{2}-x_{1}|$、縦の長さが $|y_{2}-y_{1}|$ なので、中学で習った**三平方の定理**で距離が求まります。
線分を $m : n$ に分ける点には 2 種類あります。線分の**内側**で分ける**内分点**（$A$ から $B$ に向かって $\dfrac{m}{m+n}$ だけ進んだ点）と、線分の**延長上**で分ける**外分点**です。公式は暗記するのではなく、「$A$ から $B$ へ向かうベクトルの何倍進むか」という考え方で出せます。`,
      normal: R`距離は $\sqrt{(x_{2}-x_{1})^{2}+(y_{2}-y_{1})^{2}}$。内分点は $\left(\dfrac{nx_{1}+mx_{2}}{m+n},\ \dfrac{ny_{1}+my_{2}}{m+n}\right)$、外分点は $n$ を $-n$ に置き換えた形（$m \ne n$）。`,
      pro: R`外分は「$m : (-n)$ の内分」と考えると内分点の公式の $n \to -n$ で一発です。重心 $\left(\dfrac{x_{1}+x_{2}+x_{3}}{3},\ \dfrac{y_{1}+y_{2}+y_{3}}{3}\right)$ や中点は内分の特別な場合です。`
    },
    compute(v) {
      const x1 = v.x1, y1 = v.y1, x2 = v.x2, y2 = v.y2, m = v.m, n = v.n;
      const dx = x2.sub(x1), dy = y2.sub(y1);
      const D2 = dx.mul(dx).add(dy.mul(dy));
      if (D2.isZero()) throw new JK.CalcError('A と B が同じ点です。異なる 2 点を入力してください');
      if (m.sign() <= 0 || n.sign() <= 0) throw new JK.CalcError('m, n は正の数にしてください（比 m : n）');
      const dist = U.sqrtTex(D2), distV = Math.sqrt(D2.val());
      const Mx = x1.add(x2).div(2), My = y1.add(y2).div(2);
      const mn = m.add(n), dm = m.sub(n);
      const Px = n.mul(x1).add(m.mul(x2)).div(mn), Py = n.mul(y1).add(m.mul(y2)).div(mn);
      const hasOut = !dm.isZero();
      const Ex = hasOut ? m.mul(x2).sub(n.mul(x1)).div(dm) : null, Ey = hasOut ? m.mul(y2).sub(n.mul(y1)).div(dm) : null;
      const sS = U.sqrtSimplify(D2.n * D2.d);
      const approxD = /\\sqrt/.test(dist) ? R` \approx ` + U.fmt(distV, 4) : '';

      const steps = [
        {
          t: '2 点間の距離の公式',
          m: [R`AB = \sqrt{(x_{2}-x_{1})^{2} + (y_{2}-y_{1})^{2}}`],
          n: R`$x$ 座標の差と $y$ 座標の差をそれぞれ 2 乗して足し、平方根をとります。`,
          easy: R`座標平面で $A,\ B$ を結ぶ線分を斜辺として、横と縦の線で直角三角形を作ります。横の長さは $|x_{2}-x_{1}|$、縦の長さは $|y_{2}-y_{1}|$。**三平方の定理**（中学で習った「直角三角形の斜辺の 2 乗 ＝ 他の 2 辺の 2 乗の和」）をそのまま使っただけの式です。`
        },
        {
          t: '距離を計算する',
          m: [
            R`AB = \sqrt{\left(` + x2.tex() + ' - ' + U.paren(x1) + R`\right)^{2} + \left(` + y2.tex() + ' - ' + U.paren(y1) + R`\right)^{2}}`,
            R`= \sqrt{` + pw(dx, 2) + ' + ' + pw(dy, 2) + '} = \\sqrt{' + dx.mul(dx).tex() + ' + ' + dy.mul(dy).tex() + '} = \\sqrt{' + D2.tex() + '}',
            R`= ` + dist + approxD
          ],
          n: R`差を先に求めてから 2 乗します。負の数は 2 乗すると正になります。`,
          easy: R`$x$ の差は $` + dx.tex() + R`$、$y$ の差は $` + dy.tex() + R`$。たとえ負の数でも 2 乗すれば正になるので、「大きいほうから小さいほうを引く」順番は気にしなくて大丈夫です。`
        }
      ];
      if (/^\d+$/.test(D2.tex()) && sS.out > 1) {
        steps.push({
          t: R`根号の中の平方数を外に出す`,
          m: [R`\sqrt{` + D2.tex() + R`} = \sqrt{` + sS.out + R`^{2} \cdot ` + sS.in + R`} = ` + dist],
          n: R`$` + D2.tex() + R` = ` + sS.out + R`^{2} \times ` + sS.in + R`$ と分解して、平方数 $` + sS.out + R`^{2}$ を根号の外に $` + sS.out + R`$ として出します。`,
          easy: R`$\sqrt{12} = \sqrt{4 \times 3} = \sqrt{4}\sqrt{3} = 2\sqrt{3}$ のように、根号の中を「平方数 × 残り」に分けると外に出せます。中学で習った根号の計算と同じです。`,
          lv: 3
        });
      }
      steps.push({
        t: '中点',
        m: [R`M\left(\frac{x_{1}+x_{2}}{2},\ \frac{y_{1}+y_{2}}{2}\right) = \left(\frac{` + x1.tex() + ' + ' + U.paren(x2) + R`}{2},\ \frac{` + y1.tex() + ' + ' + U.paren(y2) + R`}{2}\right) = ` + pt(Mx, My)],
        n: R`中点は、$x$ 座標どうし・$y$ 座標どうしの平均です（$1 : 1$ の内分点）。`,
        easy: R`ちょうど真ん中の点は、$x$ 座標も $y$ 座標も「2 つの平均」になります。数直線で 3 と 7 の真ん中が $\dfrac{3+7}{2} = 5$ なのと同じです。`
      });
      steps.push({
        t: R`内分点 $P$（$AP : PB = m : n$）`,
        m: [
          R`P\left(\frac{nx_{1}+mx_{2}}{m+n},\ \frac{ny_{1}+my_{2}}{m+n}\right)`,
          R`P\left(\frac{` + n.tex() + R` \cdot ` + U.paren(x1) + ' + ' + m.tex() + R` \cdot ` + U.paren(x2) + '}{' + mn.tex() + R`},\ \frac{` + n.tex() + R` \cdot ` + U.paren(y1) + ' + ' + m.tex() + R` \cdot ` + U.paren(y2) + '}{' + mn.tex() + R`}\right) = ` + pt(Px, Py)
        ],
        n: R`$A$ に近いほうの比 $m$ が $B$ の座標に、$B$ に近いほうの比 $n$ が $A$ の座標にかかる、たすき掛けの形に注意します。`,
        easy: R`線分 $AB$ を $m+n$ 等分したとき、$A$ から $m$ 目盛り進んだ点が内分点です。$A$ から $B$ へ進む道のりのうち $\dfrac{m}{m+n}$ のところなので、$P = A + \dfrac{m}{m+n}(B - A)$ と書けます。これを整理すると $\dfrac{nA + mB}{m+n}$ になり、座標ごとに計算したものが上の公式です。`,
        pro: R`たすき掛け（$m$ は $B$ 側、$n$ は $A$ 側）と覚えます。比の大きいほうに近い点という意味で、$m$ が大きいほど $P$ は $B$ に近づきます。`
      });
      steps.push({
        t: '内分点の確認（距離の比）',
        m: [
          R`AP = \frac{m}{m+n}AB = ` + U.sqrtTex(D2.mul(m.div(mn)).mul(m.div(mn))),
          R`PB = \frac{n}{m+n}AB = ` + U.sqrtTex(D2.mul(n.div(mn)).mul(n.div(mn))),
          R`AP : PB = ` + m.tex() + ' : ' + n.tex()
        ],
        n: R`内分点は線分 $AB$ 上にあり、$AP : PB = m : n$ になります。`,
        lv: 3
      });
      if (hasOut) {
        steps.push({
          t: R`外分点 $E$（$AE : EB = m : n$、線分の延長上）`,
          m: [
            R`E\left(\frac{-nx_{1}+mx_{2}}{m-n},\ \frac{-ny_{1}+my_{2}}{m-n}\right)`,
            R`E\left(\frac{-` + U.paren(n) + R` \cdot ` + U.paren(x1) + ' + ' + U.paren(m) + R` \cdot ` + U.paren(x2) + '}{' + dm.tex() + R`},\ \frac{-` + U.paren(n) + R` \cdot ` + U.paren(y1) + ' + ' + U.paren(m) + R` \cdot ` + U.paren(y2) + '}{' + dm.tex() + R`}\right) = ` + pt(Ex, Ey)
          ],
          n: m.cmp(n) > 0 ? R`$m > n$ なので、外分点は $B$ の側の延長上にあります。` : R`$m < n$ なので、外分点は $A$ の側の延長上にあります。`,
          easy: R`外分点は、線分 $AB$ をはみ出した延長線上で、$A$ からの距離と $B$ からの距離の比が $m : n$ になる点です。内分点の公式の $n$ を $-n$ に置き換えた形になります（分母も $m + n$ が $m - n$ になります）。比が大きいほうの点の外側にできます。`,
          pro: R`外分点は $m : n$ の外分 ＝ $m : (-n)$ の内分、と見て内分点の公式で $n \to -n$。$m = n$ のときは外分点が存在しません。`
        });
      } else {
        steps.push({
          t: '外分点',
          m: [R`m = n \;\Rightarrow\; \text{外分点は存在しない}`],
          n: R`$m = n$ のとき外分点の分母 $m - n$ が 0 になり、延長線上に比が $1 : 1$ となる点はありません。`,
          easy: R`延長線上のどこを選んでも、$A$ からの距離と $B$ からの距離は必ず違うので、「比が $1 : 1$」にはなりません。だから $m = n$ の外分点は存在しません。`
        });
      }

      // 図
      const far = hasOut && Math.hypot(Ex.val() - Mx.val(), Ey.val() - My.val()) > 6 * distV;
      const showOut = hasOut && !far;
      const ptsFig = [[x1.val(), y1.val()], [x2.val(), y2.val()], [Px.val(), Py.val()]];
      if (showOut) ptsFig.push([Ex.val(), Ey.val()]);
      const win = fitWindow(ptsFig.concat([[0, 0]]), 2);
      const o = baseOpts(win);
      o.segs.push({ x1: x1.val(), y1: y1.val(), x2: x2.val(), y2: y2.val(), cls: 'c1' });
      if (showOut) {
        const nearA = m.cmp(n) < 0;
        o.segs.push({ x1: nearA ? x1.val() : x2.val(), y1: nearA ? y1.val() : y2.val(), x2: Ex.val(), y2: Ey.val(), cls: 'c3', dash: true });
      }
      const left = x1.val() <= x2.val();
      o.points.push({ x: x1.val(), y: y1.val(), label: lab('A', x1, y1), cls: 'c1', pos: left ? 'tl' : 'tr' });
      o.points.push({ x: x2.val(), y: y2.val(), label: lab('B', x2, y2), cls: 'c2', pos: left ? 'tr' : 'tl' });
      o.points.push({ x: Px.val(), y: Py.val(), label: lab('P', Px, Py), cls: 'c3', pos: 'br' });
      if (showOut) o.points.push({ x: Ex.val(), y: Ey.val(), label: lab('E', Ex, Ey), cls: 'c4', pos: 'bl' });
      else if (!hasOut) o.points[2].label = lab('P=M', Px, Py);
      if (hasOut && far) o.labels.push({ x: win.x[0] + (win.x[1] - win.x[0]) * 0.03, y: win.y[1] - (win.y[1] - win.y[0]) * 0.06, text: '外分点は遠く図に入りません', cls: 'dim' });

      return {
        result: [
          { label: '距離 AB', tex: dist + approxD },
          { label: '中点 M', tex: pt(Mx, My) },
          { label: '内分点 P（' + m.toString() + ' : ' + n.toString() + '）', tex: pt(Px, Py) },
          { label: '外分点 E（' + m.toString() + ' : ' + n.toString() + '）', tex: hasOut ? pt(Ex, Ey) : R`\text{存在しない（} m = n \text{）}` }
        ],
        steps: steps,
        fig: JK.plot.graph(o)
      };
    }
  });

  /* ================= 直線 ================= */

  const lineModes = (...ms) => (r) => ms.indexOf(String(r.mode)) >= 0;

  // 直線を図に描く共通処理（b = 0 でも可）
  function lineFig(pts, lines, points, extraSegs) {
    const win = fitWindow(pts.concat([[0, 0]]), 3);
    const o = baseOpts(win);
    lines.forEach((l) => addLine(o, l.a, l.b, l.c, l.cls, l.dash, l.label));
    (extraSegs || []).forEach((s) => o.segs.push(s));
    points.forEach((p) => o.points.push(p));
    return JK.plot.graph(o);
  }

  JK.registerCalc({
    id: 'iib-line',
    course: 'IIB',
    unit: 'm-coord',
    group: '図形と方程式',
    title: '直線の方程式（2点・傾き・距離・平行垂直）',
    desc: R`直線の方程式を一般形 $ax+by+c=0$ と $y=mx+n$ の形の両方で求めます。2 点を通る直線、点と傾き、点と直線の距離、2 直線の平行・垂直・交点を切り替えて計算できます。`,
    form: [R`y - y_{1} = m(x - x_{1})`, R`d = \frac{|ax_{1}+by_{1}+c|}{\sqrt{a^{2}+b^{2}}}`],
    inputs: [
      { key: 'mode', label: '求めるもの', type: 'select', def: 'two', options: [['two', '2 点を通る直線'], ['slope', '点と傾きで決まる直線'], ['dist', '点と直線の距離'], ['rel', '2 直線の平行・垂直・交点']],
        hint: R`2 点: $A(x_{1},y_{1}),\ B(x_{2},y_{2})$ ／ 点と傾き: 点 $(x_{1},y_{1})$ と傾き $m$ ／ 距離: 点 $(x_{1},y_{1})$ と直線 $ax+by+c=0$ ／ 2 直線: $ax+by+c=0$ と $a_{2}x+b_{2}y+c_{2}=0$` },
      { key: 'x1', label: R`$x_{1}$`, type: 'q', def: '1', show: lineModes('two', 'slope', 'dist') },
      { key: 'y1', label: R`$y_{1}$`, type: 'q', def: '2', show: lineModes('two', 'slope', 'dist') },
      { key: 'x2', label: R`$x_{2}$`, type: 'q', def: '5', show: lineModes('two') },
      { key: 'y2', label: R`$y_{2}$`, type: 'q', def: '5', show: lineModes('two') },
      { key: 'm', label: R`傾き $m$`, type: 'q', def: '3/2', show: lineModes('slope') },
      { key: 'a', label: R`$a$`, type: 'q', def: '3', show: lineModes('dist', 'rel'), hint: R`直線 $ax+by+c=0$（$y=x+1$ なら $a=1,\ b=-1,\ c=1$）` },
      { key: 'b', label: R`$b$`, type: 'q', def: '4', show: lineModes('dist', 'rel') },
      { key: 'c', label: R`$c$`, type: 'q', def: '-12', show: lineModes('dist', 'rel') },
      { key: 'a2', label: R`$a_{2}$`, type: 'q', def: '4', show: lineModes('rel') },
      { key: 'b2', label: R`$b_{2}$`, type: 'q', def: '-3', show: lineModes('rel') },
      { key: 'c2', label: R`$c_{2}$`, type: 'q', def: '6', show: lineModes('rel') }
    ],
    examples: [
      { label: '2 点 (1,2),(5,5)', v: { mode: 'two', x1: '1', y1: '2', x2: '5', y2: '5' } },
      { label: '縦の直線', v: { mode: 'two', x1: '3', y1: '-1', x2: '3', y2: '4' } },
      { label: '点と傾き', v: { mode: 'slope', x1: '-2', y1: '3', m: '-1/2' } },
      { label: '点と直線の距離', v: { mode: 'dist', x1: '2', y1: '3', a: '3', b: '4', c: '-12' } },
      { label: '垂直な 2 直線', v: { mode: 'rel', a: '3', b: '4', c: '-12', a2: '4', b2: '-3', c2: '6' } },
      { label: '平行な 2 直線', v: { mode: 'rel', a: '2', b: '-1', c: '3', a2: '4', b2: '-2', c2: '-5' } },
      { label: '一般の 2 直線', v: { mode: 'rel', a: '1', b: '-2', c: '3', a2: '2', b2: '1', c2: '-4' } }
    ],
    intro: {
      easy: R`直線は、$y = mx + n$ の形で書くと、**傾き $m$**（$x$ が 1 増えたとき $y$ がいくら増えるか）と**切片 $n$**（$x = 0$ のときの $y$）がひと目で分かります。これは中学で習った 1 次関数のグラフと同じです。$ax + by + c = 0$ の形（**一般形**）は、縦の直線 $x = k$ も同じ形で書けるので便利です。
ここでは、(1) 2 点を通る直線、(2) 点と傾きから決まる直線、(3) 点から直線までの**距離**（点から直線に下ろした垂線の長さ）、(4) 2 直線の**平行・垂直・交点**を調べます。平行なら傾きが等しく、垂直なら傾きの積が $-1$、交点は 2 つの式を連立方程式として解けば求まります。`,
      normal: R`傾きは $m = \dfrac{y_{2}-y_{1}}{x_{2}-x_{1}}$。点 $(x_{1},y_{1})$ を通り傾き $m$ の直線は $y - y_{1} = m(x - x_{1})$。平行は傾きが等しい、垂直は傾きの積が $-1$（一般形では $aa_{2}+bb_{2}=0$）。`,
      pro: R`2 点を通る直線は $(y_{2}-y_{1})(x-x_{1}) = (x_{2}-x_{1})(y-y_{1})$ の形にすれば分数が出ず、縦線も扱えます。点と直線の距離の公式は法線ベクトル $(a, b)$ の向きの成分を取ったもの。`
    },
    compute(v) {
      const mode = v.mode;
      if (mode === 'two' || mode === 'slope') return lineTwoSlope(v, mode);
      if (mode === 'dist') return lineDist(v);
      return lineRel(v);
    }
  });

  function lineTwoSlope(v, mode) {
    const x1 = v.x1, y1 = v.y1;
    let x2, y2, m, vertical = false;
    const steps = [];
    if (mode === 'two') {
      x2 = v.x2; y2 = v.y2;
      if (x1.eq(x2) && y1.eq(y2)) throw new JK.CalcError('2 点が同じ点です。異なる 2 点を入力してください');
      vertical = x1.eq(x2);
      if (!vertical) {
        m = y2.sub(y1).div(x2.sub(x1));
        steps.push({
          t: '傾き m を求める',
          m: [R`m = \frac{y_{2}-y_{1}}{x_{2}-x_{1}} = \frac{` + y2.tex() + ' - ' + U.paren(y1) + '}{' + x2.tex() + ' - ' + U.paren(x1) + R`} = \frac{` + y2.sub(y1).tex() + '}{' + x2.sub(x1).tex() + '} = ' + m.tex()],
          n: R`傾きは「$x$ の増加量に対する $y$ の増加量」の比です。`,
          easy: R`傾き $m$ は「$x$ が 1 増えると $y$ がいくつ増えるか」です（中学の 1 次関数の変化の割合）。2 点を比べると、$x$ が $` + x2.sub(x1).tex() + R`$ 変わる間に $y$ は $` + y2.sub(y1).tex() + R`$ 変わっているので、$y$ の変化 ÷ $x$ の変化 で傾きが決まります。`,
          pro: R`2 点が分かれば $\dfrac{y_{2}-y_{1}}{x_{2}-x_{1}}$ は一瞬。$x_{1} = x_{2}$ のときは傾きが定義されず、直線は $x = x_{1}$ です。`
        });
      } else {
        steps.push({
          t: '縦の直線になる',
          m: [R`x_{1} = x_{2} = ` + x1.tex() + R` \;\Rightarrow\; x = ` + x1.tex()],
          n: R`2 点の $x$ 座標が等しいので、$y$ 軸に平行な直線 $x = ` + x1.tex() + R`$ です。傾き $\dfrac{y_{2}-y_{1}}{x_{2}-x_{1}}$ は分母が 0 になり、定義されません（$y = mx + n$ の形では表せません）。`,
          easy: R`2 点が真上・真下に並んでいるので、直線はまっすぐ縦に伸びます。縦の直線は $x$ がずっと同じ値 $` + x1.tex() + R`$ なので、$x = ` + x1.tex() + R`$ と書きます。傾きは「$y$ の増加 ÷ 0」になって決められないので、$y = mx + n$ の形にはなりません。`
        });
      }
    } else {
      m = v.m;
    }
    let g, ge;
    if (vertical) {
      g = { a: Q(1), b: Q(0), c: x1.neg() };
    } else {
      const n0 = y1.sub(m.mul(x1));
      steps.push({
        t: '点と傾きから直線の式をつくる',
        m: [R`y - y_{1} = m(x - x_{1})`, R`y - ` + U.paren(y1) + ' = ' + (m.eq(1) ? '' : (m.eq(-1) ? '-' : par(m.tex()))) + R`(x - ` + U.paren(x1) + ')'],
        n: R`点 $(x_{1},\ y_{1}) = ` + pt(x1, y1) + R`$ を通り、傾きが $m = ` + m.tex() + R`$ の直線です。`,
        easy: R`点 $(x_{1}, y_{1})$ から出発して、$x$ が $x - x_{1}$ だけ進むと、$y$ は傾き $m$ の分だけ $m(x - x_{1})$ 増えます。だから、$y$ の増加 $y - y_{1}$ が $m(x - x_{1})$ に等しい、という式になります。この式は「その点を通る」ことと「傾きが $m$」であることを両方表しています。`
      });
      steps.push({
        t: R`$y = mx + n$ の形に整理する`,
        m: [R`y = mx - mx_{1} + y_{1}`, R`y = ` + (m.eq(1) ? '' : (m.eq(-1) ? '-' : par(m.tex()))) + 'x ' + U.signed(m.mul(x1).neg()) + ' ' + U.signed(y1) + ' = ' + ptex([n0, m])],
        n: R`括弧を外して定数項をまとめます。切片は $n = y_{1} - mx_{1} = ` + n0.tex() + R`$ です。`,
        easy: R`両辺の括弧を外して、$y$ だけが左辺に残るように移項します。$x$ の項と定数項に分ければ、傾き $m$ と切片 $n$ が読み取れます。`
      });
      g = normLine(m, Q(-1), n0);
      const needClear = !(m.isInt() && n0.isInt());
      steps.push({
        t: R`一般形 $ax + by + c = 0$ にする`,
        m: needClear
          ? [ptex([n0, m]) + R` \;\text{を } y = \text{ で書くと}\; y = ` + ptex([n0, m]), R`\text{分母を払うため両辺に } ` + (Math.abs(g.k) || 1) + R` \text{ を掛けて移項} \;\Rightarrow\; ` + lineGen(g.a, g.b, g.c)].slice(1)
          : [lineGen(g.a, g.b, g.c)],
        n: R`$y$ を左辺から右辺へ移項して整数係数にします（$x$ の係数が正になるようにそろえます）。`,
        easy: R`一般形は「右辺を 0 にした形」です。分数があれば分母の最小公倍数を両辺に掛けて整数にそろえます。`
      });
    }
    if (vertical) g = { a: Q(1), b: Q(0), c: x1.neg() };
    ge = lineSlope(g.a, g.b, g.c);
    if (mode === 'two') {
      const chk = (px, py) => g.a.mul(px).add(g.b.mul(py)).add(g.c);
      steps.push({
        t: '検算: 2 点が直線上にあるか',
        m: [
          R`A: ` + U.paren(g.a) + R` \cdot ` + U.paren(x1) + ' + ' + U.paren(g.b) + R` \cdot ` + U.paren(y1) + ' + ' + U.paren(g.c) + ' = ' + chk(x1, y1).tex(),
          R`B: ` + U.paren(g.a) + R` \cdot ` + U.paren(x2) + ' + ' + U.paren(g.b) + R` \cdot ` + U.paren(y2) + ' + ' + U.paren(g.c) + ' = ' + chk(x2, y2).tex()
        ],
        n: R`$A,\ B$ の座標を $` + lineGen(g.a, g.b, g.c).replace(' = 0', '') + R`$ に代入して、どちらも $0$ になれば正しい直線です。`,
        easy: R`求めた式に 2 点の座標を代入して、どちらも 0 になれば、2 点が直線の上にある証拠です。`,
        lv: 2
      });
    }
    // 図
    const pts = mode === 'two' ? [[x1.val(), y1.val()], [x2.val(), y2.val()]] : [[x1.val(), y1.val()], [x1.val() + 2, y1.val() + (vertical ? 0 : m.val() * 2)]];
    const fig = lineFig(pts, [{ a: g.a.val(), b: g.b.val(), c: g.c.val(), cls: 'c1' }],
      [{ x: x1.val(), y: y1.val(), label: mode === 'two' ? lab('A', x1, y1) : lab('P', x1, y1), cls: 'c3', pos: 'tl' }].concat(mode === 'two' ? [{ x: x2.val(), y: y2.val(), label: lab('B', x2, y2), cls: 'c2', pos: 'br' }] : []));
    const mm = vertical ? null : (m || null);
    return {
      result: [
        { label: vertical ? '直線（縦）' : '直線 y = mx + n', tex: ge },
        { label: '一般形', tex: lineGen(g.a, g.b, g.c) },
        { label: '傾き m', tex: vertical ? R`\text{定義されない（} y \text{ 軸に平行）}` : mm.tex() },
        { label: vertical ? 'x 切片' : 'y 切片 n', tex: vertical ? x1.tex() : y1.sub(mm.mul(x1)).tex() }
      ],
      steps: steps,
      fig: fig
    };
  }

  function lineDist(v) {
    const x1 = v.x1, y1 = v.y1, a = v.a, b = v.b, c = v.c;
    if (a.isZero() && b.isZero()) throw new JK.CalcError('a と b が両方 0 の式は直線を表しません（どちらかを 0 以外にしてください）');
    const N = a.mul(x1).add(b.mul(y1)).add(c);
    const S = a.mul(a).add(b.mul(b));
    const d2 = N.mul(N).div(S);
    const dTex = U.sqrtTex(d2), dV = Math.sqrt(d2.val());
    const t = N.div(S);
    const Hx = x1.sub(t.mul(a)), Hy = y1.sub(t.mul(b));
    const nrm = normLine(a, b, c);
    const steps = [
      {
        t: '点と直線の距離とは',
        m: [R`\text{点 } P(x_{1},\ y_{1}) \text{ から直線 } ax + by + c = 0 \text{ までの距離 } d`],
        n: R`点から直線に**垂線**を下ろしたときの、点と垂線の足の間の長さです（点と直線上の点を結ぶ線分のうち最短のもの）。`,
        easy: R`定規を直線に垂直に当てて、点までの長さを測ったものが「点と直線の距離」です。直線の上のほかの点までの距離は、これより必ず長くなります。たとえば地図で「まっすぐ川に向かう最短の道のり」を測るイメージです。`
      },
      {
        t: '距離の公式',
        m: [R`d = \frac{|ax_{1} + by_{1} + c|}{\sqrt{a^{2} + b^{2}}}`],
        n: R`分子は点の座標を直線の式の左辺に代入して絶対値をとったもの、分母は $x,\ y$ の係数の 2 乗の和の平方根です。`,
        easy: R`直線の式の左辺 $ax + by + c$ に点の座標を入れた値は、「点が直線からどれだけ離れているか」を表す（ただし $\sqrt{a^{2}+b^{2}}$ 倍された）数です。点が直線上なら 0 になります。分母の $\sqrt{a^{2}+b^{2}}$ で割って本当の長さに直し、絶対値をとって向き（どちら側か）を無視します。`,
        pro: R`公式の導出は垂線の足を求めるか、法線ベクトル $(a,\ b)$ への正射影で考えます。直線上の点を 1 つとって内積を取る形に書けます。`
      },
      {
        t: '分子（直線の式に代入）',
        m: [R`ax_{1} + by_{1} + c = ` + U.paren(a) + R` \cdot ` + U.paren(x1) + ' + ' + U.paren(b) + R` \cdot ` + U.paren(y1) + ' + ' + U.paren(c) + ' = ' + N.tex(), R`|` + N.tex() + R`| = ` + N.abs().tex()],
        n: R`点 $P$ の座標を $ax + by + c$ に代入します。符号は距離にはならないので絶対値をとります。`
      },
      {
        t: '分母と距離',
        m: [
          R`\sqrt{a^{2} + b^{2}} = \sqrt{` + pw(a, 2) + ' + ' + pw(b, 2) + '} = \\sqrt{' + S.tex() + '} = ' + U.sqrtTex(S),
          R`d = \frac{` + N.abs().tex() + '}{' + U.sqrtTex(S) + '} = ' + dTex + (/\\sqrt/.test(dTex) ? R` \approx ` + U.fmt(dV, 4) : '')
        ],
        n: R`分母の根号を簡単にし、必要なら分母を有理化して距離 $d$ を求めます。`,
        easy: R`分母に根号があるときは、分母と分子に同じ根号を掛けて有理化します（例: $\dfrac{3}{\sqrt{2}} = \dfrac{3\sqrt{2}}{2}$）。`
      },
      {
        t: R`垂線の足 $H$ を求めて確かめる`,
        m: [
          R`H = (x_{1},\ y_{1}) - \frac{ax_{1}+by_{1}+c}{a^{2}+b^{2}}\,(a,\ b)`,
          R`H = ` + pt(x1, y1) + ' - ' + par(t.tex()) + R`\,` + pt(a, b) + ' = ' + pt(Hx, Hy),
          R`PH^{2} = ` + pw(x1.sub(Hx), 2) + ' + ' + pw(y1.sub(Hy), 2) + ' = ' + x1.sub(Hx).mul(x1.sub(Hx)).add(y1.sub(Hy).mul(y1.sub(Hy))).tex() + R` = d^{2}`
        ],
        n: R`直線の法線ベクトル $(a,\ b)$ の向きに $P$ から進んだ先が垂線の足 $H$ です。$PH$ の長さを直接計算すると、公式で出した $d$ と一致します。`,
        easy: R`$(a,\ b)$ は直線にぴったり垂直な向きを表す矢印です。点 $P$ からその向きにちょうどよい長さだけ進むと直線にぶつかる点が $H$（垂線の足）で、$P$ と $H$ の間の長さが $d$ です。`,
        lv: 2
      },
      {
        t: R`直線を $y = mx + n$ の形でも表す`,
        m: [b.isZero() ? R`x = ` + c.neg().div(a).tex() + R`\quad (y \text{ 軸に平行})` : lineSlope(a, b, c) + R`\quad (\text{傾き } ` + a.neg().div(b).tex() + ')'],
        n: R`$ax + by + c = 0$ を $y$ について解くと $y = -\dfrac{a}{b}x - \dfrac{c}{b}$（$b \ne 0$ のとき）です。`,
        lv: 2
      }
    ];
    const pts = [[x1.val(), y1.val()], [Hx.val(), Hy.val()]];
    const fig = lineFig(pts, [{ a: a.val(), b: b.val(), c: c.val(), cls: 'c1' }],
      [{ x: x1.val(), y: y1.val(), label: lab('P', x1, y1), cls: 'c3', pos: 'tl' }, { x: Hx.val(), y: Hy.val(), label: lab('H', Hx, Hy), cls: 'c2', pos: 'br' }],
      [{ x1: x1.val(), y1: y1.val(), x2: Hx.val(), y2: Hy.val(), cls: 'c3', dash: true, label: 'd' }]);
    void nrm;
    return {
      result: [
        { label: '距離 d', tex: dTex },
        { label: 'd の近似値', tex: U.fmt(dV, 4) },
        { label: '垂線の足 H', tex: pt(Hx, Hy) },
        { label: '直線の別表示', tex: b.isZero() ? R`x = ` + c.neg().div(a).tex() : lineSlope(a, b, c) }
      ],
      steps: steps,
      fig: fig
    };
  }

  function lineRel(v) {
    const a = v.a, b = v.b, c = v.c, a2 = v.a2, b2 = v.b2, c2 = v.c2;
    if (a.isZero() && b.isZero()) throw new JK.CalcError('直線 1 の a, b が両方 0 です（直線を表しません）');
    if (a2.isZero() && b2.isZero()) throw new JK.CalcError('直線 2 の a₂, b₂ が両方 0 です（直線を表しません）');
    const det = a.mul(b2).sub(a2.mul(b)), dot = a.mul(a2).add(b.mul(b2));
    const parallel = det.isZero();
    const same = parallel && a.mul(c2).sub(a2.mul(c)).isZero() && b.mul(c2).sub(b2.mul(c)).isZero();
    const perp = dot.isZero();
    const m1 = slopeOf(a, b), m2 = slopeOf(a2, b2);
    let kind;
    if (same) kind = '同じ直線（一致する）';
    else if (parallel) kind = '平行（交わらない）';
    else if (perp) kind = '垂直に交わる';
    else kind = '1 点で交わる（垂直ではない）';
    const ix = parallel ? null : b.mul(c2).sub(b2.mul(c)).div(det);
    const iy = parallel ? null : a2.mul(c).sub(a.mul(c2)).div(det);
    const steps = [
      {
        t: '2 直線の傾きを見る',
        m: [
          R`L_{1}:\ ` + lineGen(a, b, c) + R`\quad \Rightarrow\quad ` + lineSlope(a, b, c) + (m1 ? R`\ \ (m_{1} = ` + m1.tex() + ')' : ''),
          R`L_{2}:\ ` + lineGen(a2, b2, c2) + R`\quad \Rightarrow\quad ` + lineSlope(a2, b2, c2) + (m2 ? R`\ \ (m_{2} = ` + m2.tex() + ')' : '')
        ],
        n: R`$y$ について解いて傾きを読み取ります（$b = 0$ なら $y$ 軸に平行な直線 $x = k$ で、傾きはありません）。`,
        easy: R`直線を $y = mx + n$ の形に直すと、$x$ の係数が傾きです。傾きは「直線の向き」を表す数なので、2 つの直線の向きを比べることで「平行か」「垂直か」が分かります。`,
        lv: 1
      },
      {
        t: '平行・垂直の判定',
        m: [
          R`\text{平行} \Leftrightarrow ab_{2} - a_{2}b = 0:\quad ` + U.paren(a) + R` \cdot ` + U.paren(b2) + ' - ' + U.paren(a2) + R` \cdot ` + U.paren(b) + ' = ' + det.tex(),
          R`\text{垂直} \Leftrightarrow aa_{2} + bb_{2} = 0:\quad ` + U.paren(a) + R` \cdot ` + U.paren(a2) + ' + ' + U.paren(b) + R` \cdot ` + U.paren(b2) + ' = ' + dot.tex()
        ].concat(m1 && m2 ? [R`m_{1} = ` + m1.tex() + R`,\ m_{2} = ` + m2.tex() + R`,\ m_{1}m_{2} = ` + m1.mul(m2).tex()] : []),
        n: R`結論: **` + kind + R`**。` + (same ? R`2 つの式は定数倍の関係です（係数が比例）。` : ''),
        easy: R`平行な直線は傾きが等しく（$m_{1} = m_{2}$）、垂直な直線は傾きの積が $-1$ です（$m_{1}m_{2} = -1$）。一般形では、傾きを割り算せずに「$ab_{2} - a_{2}b = 0$ なら平行」「$aa_{2} + bb_{2} = 0$ なら垂直」と調べられます（縦の直線も同じ式で扱えます）。`,
        pro: R`平行条件 $ab_{2}-a_{2}b=0$、垂直条件 $aa_{2}+bb_{2}=0$ は一般形のまま使えて、縦線・横線の場合分けが要りません。法線ベクトル $(a,b),(a_{2},b_{2})$ の平行・直交と同じことです。`
      }
    ];
    if (!parallel) {
      const lines = [
        R`\begin{cases} ` + lc([[a, 'x'], [b, 'y']]) + ' = ' + c.neg().tex() + R` \cdots (1) \\ ` + lc([[a2, 'x'], [b2, 'y']]) + ' = ' + c2.neg().tex() + R` \cdots (2) \end{cases}`
      ];
      if (!b.isZero() && !b2.isZero()) {
        lines.push(R`(1) \times ` + U.paren(b2) + R` - (2) \times ` + U.paren(b) + R`:\ \ (` + det.tex() + R`)x = ` + c.neg().mul(b2).sub(c2.neg().mul(b)).tex());
        lines.push(R`x = \frac{bc_{2} - b_{2}c}{ab_{2} - a_{2}b} = ` + ix.tex());
        lines.push(R`(1) \text{ に代入: } y = ` + iy.tex());
      } else if (b.isZero()) {
        lines.push(R`(1) \text{ より } x = ` + ix.tex());
        lines.push(R`(2) \text{ に代入して } y = \frac{-c_{2} - a_{2}x}{b_{2}} = ` + iy.tex());
      } else {
        lines.push(R`(2) \text{ より } x = ` + ix.tex());
        lines.push(R`(1) \text{ に代入して } y = \frac{-c - ax}{b} = ` + iy.tex());
      }
      steps.push({
        t: '交点を求める（連立方程式）',
        m: lines,
        n: R`2 直線の交点は、2 つの式を同時に満たす点です。連立方程式を解くと交点は $` + pt(ix, iy) + R`$ です。`,
        easy: R`2 本の直線が交わる点では、$x,\ y$ が両方の式を同時に満たします。つまり交点は「連立方程式の解」です。中学で習った加減法（$y$ を消すために式を何倍かして引く）で $x$ を出し、$x$ を元の式に代入して $y$ を出します。`
      });
      const chk1 = a.mul(ix).add(b.mul(iy)).add(c), chk2 = a2.mul(ix).add(b2.mul(iy)).add(c2);
      steps.push({
        t: '検算: 交点が 2 直線上にあるか',
        m: [R`L_{1}:\ ` + chk1.tex() + R` = 0,\qquad L_{2}:\ ` + chk2.tex() + R` = 0`],
        n: R`交点の座標を両方の式の左辺に代入すると、どちらも $0$ になります。`,
        lv: 2
      });
    } else {
      steps.push({
        t: '交点',
        m: [same ? R`\text{2 直線は完全に重なる（共有点は無数）}` : R`\text{平行なので交点はない}`],
        n: same ? R`2 つの式が同じ直線を表しているので、すべての点が共通です。` : R`傾きが等しく切片が違う（平行）ので、どれだけ延ばしても交わりません。`,
        easy: same ? R`2 つの式は、式全体を何倍かしただけで同じ直線です。だから 2 つは重なっています。` : R`電車の線路のように、同じ向きで並んだ直線は、どこまで行っても交わりません。`
      });
    }
    // 図
    const f1 = [-a.val() * c.val() / (a.val() * a.val() + b.val() * b.val()), -b.val() * c.val() / (a.val() * a.val() + b.val() * b.val())];
    const f2 = [-a2.val() * c2.val() / (a2.val() * a2.val() + b2.val() * b2.val()), -b2.val() * c2.val() / (a2.val() * a2.val() + b2.val() * b2.val())];
    const pts = [f1, f2].concat(parallel ? [] : [[ix.val(), iy.val()]]);
    const fig = lineFig(pts,
      [{ a: a.val(), b: b.val(), c: c.val(), cls: 'c1', label: 'L₁' }, { a: a2.val(), b: b2.val(), c: c2.val(), cls: 'c2', label: 'L₂', dash: same }],
      parallel ? [] : [{ x: ix.val(), y: iy.val(), label: lab('交点', ix, iy), cls: 'c3', pos: 'tr' }]);
    return {
      result: [
        { label: '位置関係', tex: R`\text{` + kind + '}' },
        { label: '直線 1（傾き）', tex: lineSlope(a, b, c) },
        { label: '直線 2（傾き）', tex: lineSlope(a2, b2, c2) },
        { label: '交点', tex: parallel ? (same ? R`\text{無数（一致）}` : R`\text{なし}`) : pt(ix, iy) }
      ],
      steps: steps,
      fig: fig
    };
  }

  /* ================= 円 ================= */

  const circleModes = (...ms) => (r) => ms.indexOf(String(r.mode)) >= 0;
  const circStd = (cx, cy, r2) => sq('x', cx) + ' + ' + sq('y', cy) + ' = ' + r2.tex();

  function circleFig(cx, cy, r, extraPts, lines, points, segs, dashCircle) {
    const cv = cx.val(), cyv = cy.val(), rv = r;
    const pts = [[cv - rv, cyv - rv], [cv + rv, cyv + rv]].concat(extraPts || []).concat(maybeOrigin(cv, cyv, rv));
    const win = fitWindow(pts, 2);
    const o = baseOpts(win);
    o.param.push(circleParam(cv, cyv, rv, 'c1', dashCircle));
    (lines || []).forEach((l) => addLine(o, l.a, l.b, l.c, l.cls, l.dash, l.label));
    (segs || []).forEach((s) => o.segs.push(s));
    (points || []).forEach((p) => o.points.push(p));
    return JK.plot.graph(o);
  }

  JK.registerCalc({
    id: 'iib-circle',
    course: 'IIB',
    unit: 'm-coord',
    group: '図形と方程式',
    title: '円の方程式・円と直線・接線',
    desc: R`円の一般形から中心と半径を求める（平方完成）、円と直線の位置関係（中心と直線の距離と半径の比較、交点の座標）、円上の点における接線の方程式を、図つきで求めます。`,
    form: [R`(x-a)^{2} + (y-b)^{2} = r^{2}`, R`x^{2} + y^{2} + lx + my + n = 0`, R`(x_{1}-a)(x-a) + (y_{1}-b)(y-b) = r^{2}`],
    inputs: [
      { key: 'mode', label: '求めるもの', type: 'select', def: 'general', options: [['general', '一般形 → 中心と半径'], ['line', '円と直線の位置関係'], ['tangent', '円上の点における接線']],
        hint: R`一般形: $x^{2}+y^{2}+lx+my+n=0$ ／ 円と直線: 円 $(x-c_{x})^{2}+(y-c_{y})^{2}=r^{2}$ と直線 $a_{1}x+b_{1}y+c_{1}=0$ ／ 接線: 円と円上の点 $(t_{x},\ t_{y})$` },
      { key: 'l', label: R`$l$`, type: 'q', def: '-4', show: circleModes('general') },
      { key: 'm', label: R`$m$`, type: 'q', def: '6', show: circleModes('general') },
      { key: 'n', label: R`$n$`, type: 'q', def: '-12', show: circleModes('general') },
      { key: 'cx', label: R`中心の $x$ 座標 $c_{x}$`, type: 'q', def: '0', show: circleModes('line', 'tangent') },
      { key: 'cy', label: R`中心の $y$ 座標 $c_{y}$`, type: 'q', def: '0', show: circleModes('line', 'tangent') },
      { key: 'r', label: R`半径 $r$`, type: 'q', def: '5', show: circleModes('line', 'tangent') },
      { key: 'la', label: R`直線の $a_{1}$`, type: 'q', def: '1', show: circleModes('line'), hint: R`直線 $a_{1}x+b_{1}y+c_{1}=0$（例 $y=-x+1$ は $a_{1}=1,\ b_{1}=1,\ c_{1}=-1$）` },
      { key: 'lb', label: R`直線の $b_{1}$`, type: 'q', def: '1', show: circleModes('line') },
      { key: 'lc', label: R`直線の $c_{1}$`, type: 'q', def: '-1', show: circleModes('line') },
      { key: 'tx', label: R`接点の $x$ 座標 $t_{x}$`, type: 'q', def: '3', show: circleModes('tangent'), hint: '接点は円の上にある点を入力します' },
      { key: 'ty', label: R`接点の $y$ 座標 $t_{y}$`, type: 'q', def: '4', show: circleModes('tangent') }
    ],
    examples: [
      { label: '一般形 → 中心・半径', v: { mode: 'general', l: '-4', m: '6', n: '-12' } },
      { label: '分数の中心', v: { mode: 'general', l: '3', m: '-5', n: '1' } },
      { label: '2 点で交わる', v: { mode: 'line', cx: '0', cy: '0', r: '5', la: '1', lb: '1', lc: '-1' } },
      { label: '接する', v: { mode: 'line', cx: '0', cy: '0', r: '5', la: '3', lb: '4', lc: '-25' } },
      { label: '交わらない', v: { mode: 'line', cx: '1', cy: '-2', r: '2', la: '1', lb: '1', lc: '-8' } },
      { label: '根号の交点', v: { mode: 'line', cx: '1', cy: '2', r: '3', la: '1', lb: '-1', lc: '0' } },
      { label: '(3,4) での接線', v: { mode: 'tangent', cx: '0', cy: '0', r: '5', tx: '3', ty: '4' } },
      { label: '中心がずれた円', v: { mode: 'tangent', cx: '1', cy: '-2', r: '5', tx: '4', ty: '2' } }
    ],
    intro: {
      easy: R`円は「中心から同じ距離 $r$ にある点の集まり」です。中心を $(a,\ b)$ とすると、円上の点 $(x,\ y)$ は中心との距離が $r$ なので、三平方の定理から $(x-a)^{2} + (y-b)^{2} = r^{2}$ となります。これが円の**標準形**です。展開した $x^{2}+y^{2}+lx+my+n=0$（**一般形**）から中心と半径を読み取るには、$x$ と $y$ をそれぞれ**平方完成**して標準形に直します。
円と直線の位置関係は、「中心から直線までの距離 $d$」と半径 $r$ を比べれば分かります。$d < r$ なら 2 点で交わり、$d = r$ なら接し、$d > r$ なら交わりません（コインに定規を当てるイメージです）。円の接線は、接点と中心を結ぶ半径に**垂直**です。`,
      normal: R`一般形は平方完成して中心 $\left(-\dfrac{l}{2},\ -\dfrac{m}{2}\right)$、半径 $\sqrt{\dfrac{l^{2}+m^{2}}{4}-n}$。円と直線は距離 $d$ と $r$ の比較。接線は $(x_{1}-a)(x-a)+(y_{1}-b)(y-b)=r^{2}$。`,
      pro: R`$l^{2}+m^{2}-4n>0$ が円を表す条件。円と直線は判別式でも調べられますが、距離で見るほうが速いです。接線の公式は円 $x^{2}+y^{2}=r^{2}$ 上の点 $(x_{1},y_{1})$ で $x_{1}x+y_{1}y=r^{2}$ が基本形です。`
    },
    compute(v) {
      if (v.mode === 'general') return circleGeneral(v);
      if (v.mode === 'line') return circleLine(v);
      return circleTangent(v);
    }
  });

  function circleGeneral(v) {
    const l = v.l, m = v.m, n = v.n;
    const h = l.div(2), k = m.div(2);
    const cx = h.neg(), cy = k.neg();
    const r2 = h.mul(h).add(k.mul(k)).sub(n);
    const gen = lc([[Q(1), 'x^{2}'], [Q(1), 'y^{2}'], [l, 'x'], [m, 'y'], [n, '']]) + ' = 0';
    const steps = [
      {
        t: '円の標準形と一般形',
        m: [R`(x-a)^{2} + (y-b)^{2} = r^{2} \quad (\text{中心 } (a,\ b),\ \text{半径 } r)`, R`x^{2} + y^{2} + lx + my + n = 0`],
        n: R`標準形を展開して整理すると一般形になります。逆に、一般形を $x$ と $y$ について**平方完成**すると標準形に戻り、中心と半径が読み取れます。`,
        easy: R`標準形は「中心からの距離が $r$」という円の定義をそのまま式にしたものです。ここから中心 $(a, b)$ と半径 $r$ が一目で分かります。一般形はそれを展開して整理した形なので、中心や半径はそのままでは見えません。そこで、展開する前の形に戻す（平方完成）ことで、中心と半径を取り出します。`
      },
      {
        t: R`$x$ と $y$ をそれぞれ平方完成する`,
        m: [
          gen,
          R`\left(x + \frac{l}{2}\right)^{2} - \left(\frac{l}{2}\right)^{2} + \left(y + \frac{m}{2}\right)^{2} - \left(\frac{m}{2}\right)^{2} + n = 0`,
          sq('x', cx) + ' - ' + h.mul(h).tex() + ' + ' + sq('y', cy) + ' - ' + k.mul(k).tex() + ' ' + U.signed(n) + ' = 0'
        ],
        n: R`$x^{2} + lx = \left(x + \dfrac{l}{2}\right)^{2} - \left(\dfrac{l}{2}\right)^{2}$ を使います（$y$ も同様）。$\dfrac{l}{2} = ` + h.tex() + R`,\ \dfrac{m}{2} = ` + k.tex() + R`$ です。`,
        easy: R`$(x + p)^{2} = x^{2} + 2px + p^{2}$ という展開の公式を逆向きに使います。$x^{2} + lx$ を見たら、$2p = l$ となる $p = \dfrac{l}{2}$ を考え、「$(x + p)^{2}$ から余分な $p^{2}$ を引いたもの」と読み替えます。これが平方完成です。$y$ についても同じことをします。`,
        pro: R`係数の半分を括弧に入れて、その 2 乗を引く。暗算では $x^{2}-4x \to (x-2)^{2}-4$ のように 1 行で処理します。`
      },
      {
        t: '定数項を右辺に移して標準形にする',
        m: [
          sq('x', cx) + ' + ' + sq('y', cy) + ' = ' + h.mul(h).tex() + ' + ' + k.mul(k).tex() + ' ' + U.signed(n.neg()),
          circStd(cx, cy, r2)
        ],
        n: R`右辺 $= \dfrac{l^{2}+m^{2}}{4} - n = ` + r2.tex() + R`$ です。` + (r2.sign() > 0 ? R`右辺が正なので、中心 $` + pt(cx, cy) + R`$、半径 $` + U.sqrtTex(r2) + R`$ の円です。` : (r2.isZero() ? R`右辺が $0$ なので、円ではなく 1 点（中心）だけです。` : R`右辺が負なので、この式を満たす実数の点は存在せず、円を表しません。`)),
        easy: r2.sign() > 0
          ? R`標準形 $(x-a)^{2} + (y-b)^{2} = r^{2}$ と見比べて、括弧の中の符号を反対にしたものが中心、右辺の平方根が半径です。$(x - ` + cx.tex() + R`)$ なら中心の $x$ 座標は $` + cx.tex() + R`$（括弧の中の符号に注意）。`
          : R`2 乗の和 $(x-a)^{2} + (y-b)^{2}$ は 0 以上なので、右辺（$r^{2}$ にあたる数）が負だと、等式を満たす点がありません。右辺が 0 ちょうどなら、中心の 1 点だけが条件を満たします。`,
        pro: R`円を表す条件は「右辺 $>0$」、すなわち $l^{2}+m^{2}-4n>0$ です。文字定数を含む問題ではこの条件の確認が必要です。`
      }
    ];
    const res = [];
    let fig = null;
    if (r2.sign() > 0) {
      const rt = U.sqrtTex(r2), rv = Math.sqrt(r2.val());
      steps.push({
        t: '中心と半径',
        m: [R`\text{中心 } ` + pt(cx, cy), R`\text{半径 } r = \sqrt{` + r2.tex() + '} = ' + rt + (/\\sqrt/.test(rt) ? R` \approx ` + U.fmt(rv, 4) : '')],
        n: R`$(x - a)^{2}$ の $a$ が中心の $x$ 座標、$(y - b)^{2}$ の $b$ が中心の $y$ 座標、右辺の平方根が半径です。`,
        lv: 1
      });
      res.push({ label: '標準形', tex: circStd(cx, cy, r2) });
      res.push({ label: '中心', tex: pt(cx, cy) });
      res.push({ label: '半径 r', tex: rt + (/\\sqrt/.test(rt) ? R` \approx ` + U.fmt(rv, 4) : '') });
      fig = circleFig(cx, cy, rv, [], [], [
        { x: cx.val(), y: cy.val(), label: lab('中心', cx, cy), cls: 'c3', pos: 'tl' }
      ], [{ x1: cx.val(), y1: cy.val(), x2: cx.val() + rv, y2: cy.val(), cls: 'c2', dash: true, label: 'r' }]);
    } else {
      steps.push({
        t: '結論',
        m: [r2.isZero() ? R`\text{円ではなく、1 点 } ` + pt(cx, cy) + R` \text{ のみ}` : R`\text{実数の点がない（円を表さない）}`],
        n: R`右辺が $` + r2.tex() + R`$ なので、` + (r2.isZero() ? '半径 0 の「点円」です。' : '2 乗の和が負になることはないため、図形はありません。')
      });
      res.push({ label: '右辺 r²', tex: r2.tex() });
      res.push({ label: '図形', tex: r2.isZero() ? R`\text{1 点 } ` + pt(cx, cy) : R`\text{円を表さない（図形なし）}` });
      if (r2.isZero()) fig = circleFig(cx, cy, 0.5, [], [], [{ x: cx.val(), y: cy.val(), label: lab('点', cx, cy), cls: 'c3', pos: 'tr' }], [], false);
    }
    return { result: res, steps: steps, fig: fig };
  }

  function circleLine(v) {
    const cx = v.cx, cy = v.cy, r = v.r, la = v.la, lb = v.lb, lcc = v.lc;
    if (r.sign() <= 0) throw new JK.CalcError('半径 r は正の数にしてください');
    if (la.isZero() && lb.isZero()) throw new JK.CalcError('直線の a₁, b₁ が両方 0 です（直線を表しません）');
    const N = la.mul(cx).add(lb.mul(cy)).add(lcc);
    const S = la.mul(la).add(lb.mul(lb));
    const r2 = r.mul(r);
    const d2 = N.mul(N).div(S);
    const dTex = U.sqrtTex(d2), dV = Math.sqrt(d2.val());
    const cmp = N.mul(N).cmp(r2.mul(S));               // d^2 と r^2 の比較（S > 0）
    const tt = N.div(S);
    const Hx = cx.sub(tt.mul(la)), Hy = cy.sub(tt.mul(lb));
    const rel = cmp < 0 ? '2 点で交わる' : (cmp === 0 ? '接する（1 点を共有）' : '交わらない（共有点なし）');
    const sym = cmp < 0 ? '<' : (cmp === 0 ? '=' : '>');
    const steps = [
      {
        t: '位置関係は「中心と直線の距離 $d$」と半径 $r$ の比較',
        m: [R`d < r \;\Rightarrow\; \text{2 点で交わる},\qquad d = r \;\Rightarrow\; \text{接する},\qquad d > r \;\Rightarrow\; \text{交わらない}`],
        n: R`円の中心から直線までの距離 $d$ を求め、半径 $r$ と大小を比べます。`,
        easy: R`コインの上に定規を当てることを想像してください。定規がコインの中心に近い（距離 $d$ が半径 $r$ より小さい）と、定規はコインを横切って 2 か所で交わります。ちょうどふちに触れるのが $d = r$（接する）、コインから離れていると交わりません。`
      },
      {
        t: '中心から直線までの距離 $d$',
        m: [
          R`d = \frac{|a_{1}c_{x} + b_{1}c_{y} + c_{1}|}{\sqrt{a_{1}^{2} + b_{1}^{2}}}`,
          R`a_{1}c_{x} + b_{1}c_{y} + c_{1} = ` + U.paren(la) + R` \cdot ` + U.paren(cx) + ' + ' + U.paren(lb) + R` \cdot ` + U.paren(cy) + ' + ' + U.paren(lcc) + ' = ' + N.tex(),
          R`\sqrt{a_{1}^{2} + b_{1}^{2}} = \sqrt{` + S.tex() + '} = ' + U.sqrtTex(S),
          R`d = \frac{` + N.abs().tex() + '}{' + U.sqrtTex(S) + '} = ' + dTex + (/\\sqrt/.test(dTex) ? R` \approx ` + U.fmt(dV, 4) : '')
        ],
        n: R`点（ここでは中心）と直線の距離の公式を使います。`,
        easy: R`点と直線の距離は、点から直線に垂線を下ろしたときの長さです。直線の式 $a_{1}x + b_{1}y + c_{1}$ に中心の座標を入れた値を、$\sqrt{a_{1}^{2}+b_{1}^{2}}$ で割った絶対値で求められます。`
      },
      {
        t: '$d$ と $r$ を比べる',
        m: [R`d = ` + dTex + R`,\quad r = ` + r.tex(), R`d^{2} = ` + d2.tex() + R`,\quad r^{2} = ` + r2.tex() + R`\;\Rightarrow\; d^{2} ` + sym + ' r^{2}'],
        n: R`根号を含む数の比較は 2 乗どうしで行うと確実です。$d ` + sym + R` r$ なので、**` + rel + R`**です。`,
        easy: R`$d$ と $r$ はどちらも正の数なので、2 乗した $d^{2}$ と $r^{2}$ の大小は元の $d$ と $r$ の大小と同じです。根号が残るときは 2 乗して比べるのが安全です。`,
        pro: R`$d^{2}$ と $r^{2}$ を比べると根号が出ません（$N^{2}$ と $r^{2}(a_{1}^{2}+b_{1}^{2})$ の整数の比較）。`
      }
    ];
    const res = [{ label: '中心と直線の距離 d', tex: dTex + (/\\sqrt/.test(dTex) ? R` \approx ` + U.fmt(dV, 4) : '') }, { label: '位置関係', tex: R`\text{` + rel + '}' }];
    let fig;
    const line1 = { a: la.val(), b: lb.val(), c: lcc.val(), cls: 'c2' };
    const baseSegs = [{ x1: cx.val(), y1: cy.val(), x2: Hx.val(), y2: Hy.val(), cls: 'c3', dash: true, label: 'd' }];
    if (cmp < 0) {
      const T = r2.mul(S).sub(N.mul(N)).div(S.mul(S));       // ((r^2 S - N^2) / S^2)
      const sp = sqrtParts(T);
      const c1 = lb.neg().mul(sp.c), c2 = la.mul(sp.c);
      const p1x = surdQ(Hx, c1, sp.m), p1y = surdQ(Hy, c2, sp.m), p2x = surdQ(Hx, c1.neg(), sp.m), p2y = surdQ(Hy, c2.neg(), sp.m);
      const tv = Math.sqrt(T.val());
      steps.push({
        t: '垂線の足 $H$（弦の中点）',
        m: [R`H = (c_{x},\ c_{y}) - \frac{a_{1}c_{x}+b_{1}c_{y}+c_{1}}{a_{1}^{2}+b_{1}^{2}}\,(a_{1},\ b_{1}) = ` + pt(cx, cy) + ' - ' + par(tt.tex()) + R`\,` + pt(la, lb) + ' = ' + pt(Hx, Hy)],
        n: R`中心から直線に下ろした垂線の足 $H$ は、直線が円で切り取る弦の**中点**になります。`,
        easy: R`円の中心から直線に垂線を下ろすと、その足は、円が直線から切り取る線分（弦）のちょうど真ん中になります（二等辺三角形の頂点から底辺に垂線を下ろすと底辺の中点に来るのと同じ理由です）。`,
        lv: 2
      });
      steps.push({
        t: '交点の座標',
        m: [
          R`h^{2} = r^{2} - d^{2} = ` + r2.tex() + ' - ' + d2.tex() + ' = ' + r2.sub(d2).tex() + R`\quad (\text{弦の半分の長さ } h)`,
          R`t = \sqrt{\frac{r^{2}-d^{2}}{a_{1}^{2}+b_{1}^{2}}} = \sqrt{` + r2.sub(d2).div(S).tex() + '} = ' + U.sqrtTex(T),
          R`\text{交点 } H \pm t\,(-b_{1},\ a_{1}):`,
          R`P_{1} = ` + ptS(p1x, p1y),
          R`P_{2} = ` + ptS(p2x, p2y)
        ],
        n: R`$H$ から直線に沿って $\pm h$ だけ進んだ点が交点です。直線の向き $(-b_{1},\ a_{1})$ の長さは $\sqrt{a_{1}^{2}+b_{1}^{2}}$ なので、$t = \dfrac{h}{\sqrt{a_{1}^{2}+b_{1}^{2}}}$ を掛けて進みます。`,
        easy: R`弦の半分の長さ $h$ は、中心・$H$・交点でできる**直角三角形**に三平方の定理を使えば $h^{2} = r^{2} - d^{2}$ です。$H$ から直線に沿って左右に $h$ ずつ進んだ点が 2 つの交点になります。直線の向きを表す矢印 $(-b_{1}, a_{1})$ の長さで割って、ちょうど $h$ 進むように調整します。`,
        pro: R`別解: 直線の式を円の式に代入して 2 次方程式の判別式 $D$ を調べても、交点の個数と座標が出ます（$D>0 \Leftrightarrow d<r$）。`
      });
      res.push({ label: '交点 P₁', tex: ptS(p1x, p1y) });
      res.push({ label: '交点 P₂', tex: ptS(p2x, p2y) });
      const ipts = [[Hx.val() - lb.val() * tv, Hy.val() + la.val() * tv], [Hx.val() + lb.val() * tv, Hy.val() - la.val() * tv]];
      fig = circleFig(cx, cy, Math.sqrt(r2.val()), ipts.concat([[Hx.val(), Hy.val()]]), [line1], [
        { x: cx.val(), y: cy.val(), label: '中心', cls: 'c3', pos: 'tl' },
        { x: ipts[0][0], y: ipts[0][1], label: 'P₁', cls: 'c4', pos: 'tl' },
        { x: ipts[1][0], y: ipts[1][1], label: 'P₂', cls: 'c4', pos: 'br' }
      ], baseSegs);
    } else if (cmp === 0) {
      steps.push({
        t: '接点',
        m: [R`d = r \;\Rightarrow\; \text{接点は垂線の足 } H = ` + pt(cx, cy) + ' - ' + par(tt.tex()) + R`\,` + pt(la, lb) + ' = ' + pt(Hx, Hy)],
        n: R`$d = r$ のとき、中心から下ろした垂線の足が円上にあり、そこが接点です（接線は半径に垂直）。`,
        easy: R`直線が円にちょうど触れる（接する）とき、触れた点（接点）と中心を結ぶ半径は、直線に垂直になっています。この垂線の足が接点です。`
      });
      res.push({ label: '接点', tex: pt(Hx, Hy) });
      fig = circleFig(cx, cy, Math.sqrt(r2.val()), [[Hx.val(), Hy.val()]], [line1], [
        { x: cx.val(), y: cy.val(), label: '中心', cls: 'c3', pos: 'tl' },
        { x: Hx.val(), y: Hy.val(), label: lab('接点', Hx, Hy), cls: 'c4', pos: 'br' }
      ], baseSegs);
    } else {
      steps.push({
        t: '共有点はない',
        m: [R`d > r \;\Rightarrow\; \text{円と直線は共有点をもたない}`],
        n: R`中心から直線までの距離が半径より大きいので、直線は円の外側を通ります。`,
        easy: R`定規がコインから離れた場所にあるので、どこにも触れません。`
      });
      res.push({ label: '共有点', tex: R`\text{なし}` });
      fig = circleFig(cx, cy, Math.sqrt(r2.val()), [[Hx.val(), Hy.val()]], [line1], [
        { x: cx.val(), y: cy.val(), label: '中心', cls: 'c3', pos: 'tl' },
        { x: Hx.val(), y: Hy.val(), label: 'H', cls: 'c2', pos: 'br' }
      ], baseSegs);
    }
    res.push({ label: '円の方程式', tex: circStd(cx, cy, r2) });
    return { result: res.slice(0, 5), steps: steps, fig: fig };
  }

  function circleTangent(v) {
    const cx = v.cx, cy = v.cy, r = v.r, tx = v.tx, ty = v.ty;
    if (r.sign() <= 0) throw new JK.CalcError('半径 r は正の数にしてください');
    const u = tx.sub(cx), w = ty.sub(cy);
    const r2 = r.mul(r);
    const onC = u.mul(u).add(w.mul(w));
    if (!onC.eq(r2)) {
      throw new JK.CalcError('点 (' + tx.toString() + ', ' + ty.toString() + ') は円の上にありません（中心からの距離の 2 乗は ' + onC.toString() + '、半径の 2 乗は ' + r2.toString() + '）。円上の点を入力してください');
    }
    // 接線: u(x - cx) + w(y - cy) = r^2  →  u x + w y - (u cx + w cy + r^2) = 0
    const s0 = u.mul(cx).add(w.mul(cy)).add(r2).neg();
    const g = normLine(u, w, s0);
    const mr = u.isZero() ? null : w.div(u);                // 半径の傾き
    const mt = w.isZero() ? null : u.neg().div(w);          // 接線の傾き
    const steps = [
      {
        t: '接線の性質: 半径に垂直',
        m: [R`\text{接線} \perp \text{接点と中心を結ぶ半径}`],
        n: R`円の接線は、接点を通る半径に垂直です。この性質で接線の向きが決まります。`,
        easy: R`車輪（円）が地面（直線）に接しているとき、地面に触れている点と車輪の中心を結ぶ線（半径）は、地面に垂直です。つまり接線は「接点で半径と直角に交わる直線」です。`
      },
      {
        t: '点が円上にあることを確かめる',
        m: [R`(x_{1}-a)^{2} + (y_{1}-b)^{2} = ` + pw(u, 2) + ' + ' + pw(w, 2) + ' = ' + onC.tex() + ' = ' + r2.tex() + ' = r^{2}'],
        n: R`接点 $(x_{1},\ y_{1}) = ` + pt(tx, ty) + R`$ が円 $` + circStd(cx, cy, r2) + R`$ の上にあることを確認しました。`,
        easy: R`中心 $(a, b)$ からの距離がちょうど $r$ であれば、その点は円の上にあります。距離の 2 乗が $r^{2}$ に等しいかを確かめます。`
      }
    ];
    if (!u.isZero() && !w.isZero()) {
      steps.push({
        t: '傾きから求める（垂直条件）',
        m: [
          R`\text{半径の傾き } m_{r} = \frac{y_{1}-b}{x_{1}-a} = \frac{` + w.tex() + '}{' + u.tex() + '} = ' + mr.tex(),
          R`m_{r} \cdot m_{t} = -1 \;\Rightarrow\; m_{t} = ` + mt.tex(),
          R`y - ` + U.paren(ty) + ' = ' + par(mt.tex()) + R`(x - ` + U.paren(tx) + ')'
        ],
        n: R`垂直な直線どうしは傾きの積が $-1$ です。接線の傾き $m_{t} = -\dfrac{1}{m_{r}}$ を求め、接点を通る直線として式を作ります。`,
        easy: R`2 本の直線が垂直に交わるとき、傾きの積が $-1$ になります（片方が右上がりなら、もう片方は右下がり）。半径の傾き $m_{r}$ が分かれば、接線の傾きは $-\dfrac{1}{m_{r}}$ です。傾きと接点がそろったので、点と傾きから直線の式が決まります。`
      });
    } else {
      steps.push({
        t: '特別な位置（軸に平行な接線）',
        m: [u.isZero() ? R`x_{1} = a \;\Rightarrow\; \text{半径は縦、接線は横の直線 } y = ` + ty.tex() : R`y_{1} = b \;\Rightarrow\; \text{半径は横、接線は縦の直線 } x = ` + tx.tex()],
        n: u.isZero() ? R`接点が中心の真上（真下）にあるので、接線は $x$ 軸に平行です。` : R`接点が中心の真横にあるので、接線は $y$ 軸に平行です。`,
        easy: u.isZero() ? R`半径が縦向きなら、それに垂直な接線は横向きの直線 $y = ` + ty.tex() + R`$ です。` : R`半径が横向きなら、それに垂直な接線は縦向きの直線 $x = ` + tx.tex() + R`$ です。`
      });
    }
    steps.push({
      t: '接線の公式で求める（確認）',
      m: [
        R`(x_{1}-a)(x-a) + (y_{1}-b)(y-b) = r^{2}`,
        U.paren(u) + R`(x ` + (cx.sign() >= 0 ? '- ' + cx.tex() : '+ ' + cx.neg().tex()) + ') + ' + U.paren(w) + R`(y ` + (cy.sign() >= 0 ? '- ' + cy.tex() : '+ ' + cy.neg().tex()) + ') = ' + r2.tex(),
        lineGen(g.a, g.b, g.c)
      ],
      n: R`円 $(x-a)^{2}+(y-b)^{2}=r^{2}$ 上の点 $(x_{1},\ y_{1})$ における接線は、一方の $(x-a)$ を $(x_{1}-a)$ に、もう一方の $(y-b)$ を $(y_{1}-b)$ に置き換えた形です。傾きから求めた式と一致します。`,
      easy: R`接線の公式は、円の式 $(x-a)^{2}+(y-b)^{2}=r^{2}$ の「2 乗」のうち、片方の文字を接点の座標に置き換えた形です。展開して整理すると、傾きから求めた直線と同じ式になります。`,
      pro: R`原点中心の円 $x^{2}+y^{2}=r^{2}$ なら $x_{1}x + y_{1}y = r^{2}$ と即答できます。中心がずれていても、平行移動して同じ形を使えます。`,
      lv: 2
    });
    const tangentSlope = g.b.isZero() ? R`x = ` + tx.tex() : lineSlope(g.a, g.b, g.c);
    const fig = circleFig(cx, cy, Math.sqrt(r2.val()), [[tx.val(), ty.val()]], [{ a: g.a.val(), b: g.b.val(), c: g.c.val(), cls: 'c2' }], [
      { x: cx.val(), y: cy.val(), label: '中心', cls: 'c3', pos: 'tl' },
      { x: tx.val(), y: ty.val(), label: lab('接点', tx, ty), cls: 'c4', pos: 'tr' }
    ], [{ x1: cx.val(), y1: cy.val(), x2: tx.val(), y2: ty.val(), cls: 'c3', dash: true, label: 'r' }]);
    return {
      result: [
        { label: '接線（一般形）', tex: lineGen(g.a, g.b, g.c) },
        { label: '接線（y=mx+n 形）', tex: tangentSlope },
        { label: '接線の傾き', tex: g.b.isZero() ? R`\text{なし（縦の直線）}` : g.a.neg().div(g.b).tex() },
        { label: '円の方程式', tex: circStd(cx, cy, r2) }
      ],
      steps: steps,
      fig: fig
    };
  }

  /* ================= 領域の判定 ================= */

  const SYM = { lt: R`<`, le: R`\le`, gt: R`>`, ge: R`\ge` };
  const SYMJ = { lt: '＜', le: '≦', gt: '＞', ge: '≧' };
  const regionKinds = (...ks) => (r) => ks.indexOf(String(r.kind)) >= 0;

  JK.registerCalc({
    id: 'iib-region',
    course: 'IIB',
    unit: 'm-coord',
    group: '図形と方程式',
    title: '領域の判定（直線・円・放物線）',
    desc: R`不等式 $y \lessgtr mx+n$、$(x-a)^{2}+(y-b)^{2} \lessgtr r^{2}$、$y \lessgtr ax^{2}+bx+c$ の表す領域と、指定した点がその領域の「内・境界上・外」のどこにあるかを判定します。境界を含むか（実線・破線）も図に表します。`.replace(/\\lessgtr/g, R`\mathrel{\lessgtr}`).replace(R`\mathrel{\lessgtr}`, R`<`).replace(R`\mathrel{\lessgtr}`, R`<`).replace(R`\mathrel{\lessgtr}`, R`<`),
    form: [R`y \;\square\; mx + n`, R`(x-a)^{2} + (y-b)^{2} \;\square\; r^{2}`, R`y \;\square\; ax^{2} + bx + c \qquad (\square \text{ は } <,\ \le,\ >,\ \ge)`],
    inputs: [
      { key: 'kind', label: '境界の種類', type: 'select', def: 'line', options: [['line', '直線  y ⋈ mx + n'], ['circle', '円  (x−a)²+(y−b)² ⋈ r²'], ['parab', '放物線  y ⋈ ax²+bx+c']] },
      { key: 'ineq', label: '不等号 ⋈', type: 'select', def: 'gt', options: [['lt', '＜（境界を含まない）'], ['le', '≦（境界を含む）'], ['gt', '＞（境界を含まない）'], ['ge', '≧（境界を含む）']] },
      { key: 'lm', label: R`$m$`, type: 'q', def: '1/2', show: regionKinds('line') },
      { key: 'ln', label: R`$n$`, type: 'q', def: '1', show: regionKinds('line') },
      { key: 'ca', label: R`中心 $a$`, type: 'q', def: '1', show: regionKinds('circle') },
      { key: 'cb', label: R`中心 $b$`, type: 'q', def: '-1', show: regionKinds('circle') },
      { key: 'cr', label: R`半径 $r$`, type: 'q', def: '3', show: regionKinds('circle') },
      { key: 'pa', label: R`$a$`, type: 'q', def: '1', show: regionKinds('parab') },
      { key: 'pb', label: R`$b$`, type: 'q', def: '-2', show: regionKinds('parab') },
      { key: 'pc', label: R`$c$`, type: 'q', def: '-1', show: regionKinds('parab') },
      { key: 'X', label: R`判定する点の $x$ 座標 $X$`, type: 'q', def: '2' },
      { key: 'Y', label: R`判定する点の $y$ 座標 $Y$`, type: 'q', def: '3' }
    ],
    examples: [
      { label: '直線の上側', v: { kind: 'line', ineq: 'gt', lm: '1/2', ln: '1', X: '2', Y: '3' } },
      { label: '境界上（含まない）', v: { kind: 'line', ineq: 'gt', lm: '1/2', ln: '1', X: '2', Y: '2' } },
      { label: '境界上（含む）', v: { kind: 'circle', ineq: 'le', ca: '0', cb: '0', cr: '5', X: '3', Y: '-4' } },
      { label: '円の外側', v: { kind: 'circle', ineq: 'lt', ca: '1', cb: '-1', cr: '3', X: '4', Y: '3' } },
      { label: '放物線の下側', v: { kind: 'parab', ineq: 'lt', pa: '1', pb: '-2', pc: '-1', X: '1', Y: '-3' } },
      { label: '放物線の上側（含む）', v: { kind: 'parab', ineq: 'ge', pa: '1', pb: '-2', pc: '-1', X: '3', Y: '4' } }
    ],
    intro: {
      easy: R`「$y > x + 1$」のような不等式を満たす点 $(x,\ y)$ の集まりは、座標平面の**領域**（面積をもつ範囲）になります。まず、不等号を等号に変えた式（$y = x + 1$ など）が表す直線や曲線を描きます。これが**境界**で、平面を 2 つの側に分けます。
$y > x + 1$ は「$y$ の値が直線より大きい側」、つまり直線の**上側**です。同じ $x$ で直線上の点より $y$ が大きい点が、上にあるからです。円の $(x-a)^{2}+(y-b)^{2} < r^{2}$ は「中心からの距離が $r$ より小さい点」＝円の**内側**です。
$<,\ >$ なら境界は含まない（**破線**）、$\le,\ \ge$ なら含む（**実線**）と描き分けます。ある点がどちら側かを調べるには、その点の座標を不等式に**代入して成り立つか**を見るのが確実です。`,
      normal: R`境界の式に点を代入し、左辺と右辺を比べます。等しければ境界上、不等式が成り立てば領域内、成り立たなければ領域外です。$\le,\ \ge$ のときだけ境界上の点も領域に含まれます。`,
      pro: R`連立不等式の領域は各不等式の領域の共通部分。直線なら $y$ について解いた形（上側・下側）、円なら内外、で判断します。境界を含むかの扱いで最大・最小問題の答えが変わるので注意します。`
    },
    compute(v) {
      const kind = v.kind, ineq = v.ineq, X = v.X, Y = v.Y;
      const strict = ineq === 'lt' || ineq === 'gt';
      let left, right, bdTex, ineqTex, regionJa, expl, sideWord;
      let fits;                         // 図用
      if (kind === 'line') {
        const m = v.lm, n = v.ln;
        left = Y; right = m.mul(X).add(n);
        bdTex = 'y = ' + ptex([n, m]);
        ineqTex = 'y ' + SYM[ineq] + ' ' + ptex([n, m]);
        regionJa = (ineq === 'gt' || ineq === 'ge') ? '直線の上側' : '直線の下側';
        sideWord = (ineq === 'gt' || ineq === 'ge') ? '上' : '下';
        expl = R`点 $(X,\ Y)$ を $y ` + SYM[ineq] + ' ' + ptex([n, m]) + R`$ に代入します。`;
      } else if (kind === 'circle') {
        const a = v.ca, b = v.cb, r = v.cr;
        if (r.sign() <= 0) throw new JK.CalcError('半径 r は正の数にしてください');
        const du = X.sub(a), dv = Y.sub(b);
        left = du.mul(du).add(dv.mul(dv)); right = r.mul(r);
        bdTex = circStd(a, b, r.mul(r));
        ineqTex = sq('x', a) + ' + ' + sq('y', b) + ' ' + SYM[ineq] + ' ' + r.mul(r).tex();
        regionJa = (ineq === 'lt' || ineq === 'le') ? '円の内側' : '円の外側';
        sideWord = (ineq === 'lt' || ineq === 'le') ? '内' : '外';
        expl = R`点 $(X,\ Y)$ の中心からの距離の 2 乗 $(X-a)^{2}+(Y-b)^{2}$ を、$r^{2}$ と比べます。`;
      } else {
        const a = v.pa, b = v.pb, c = v.pc;
        if (a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（a = 0 だと放物線ではなく直線になります）');
        left = Y; right = a.mul(X).mul(X).add(b.mul(X)).add(c);
        bdTex = 'y = ' + ptex([c, b, a]);
        ineqTex = 'y ' + SYM[ineq] + ' ' + ptex([c, b, a]);
        regionJa = (ineq === 'gt' || ineq === 'ge') ? '放物線の上側（$y$ が大きい側）' : '放物線の下側（$y$ が小さい側）';
        sideWord = (ineq === 'gt' || ineq === 'ge') ? '上' : '下';
        expl = R`点 $(X,\ Y)$ を $y ` + SYM[ineq] + ' ' + ptex([c, b, a]) + R`$ に代入します。`;
      }
      const cmp = left.cmp(right);
      const holds = ineq === 'lt' ? cmp < 0 : (ineq === 'le' ? cmp <= 0 : (ineq === 'gt' ? cmp > 0 : cmp >= 0));
      const onB = cmp === 0;
      let verdict, state;
      if (onB) { verdict = strict ? '境界上（境界を含まないので領域に属さない）' : '境界上（境界を含むので領域に属する）'; state = 'b'; }
      else if (holds) { verdict = '領域内（不等式を満たす）'; state = 'in'; }
      else { verdict = '領域外（不等式を満たさない）'; state = 'out'; }
      const cmpSym = cmp < 0 ? '<' : (cmp === 0 ? '=' : '>');
      const leftTex = kind === 'circle' ? R`(X-a)^{2}+(Y-b)^{2}` : 'Y';
      const rightTex = kind === 'circle' ? 'r^{2}' : (kind === 'line' ? R`mX+n` : R`aX^{2}+bX+c`);
      const numLeft = kind === 'circle' ? pw(X.sub(v.ca), 2) + ' + ' + pw(Y.sub(v.cb), 2) + ' = ' + left.tex() : Y.tex();
      const numRight = kind === 'circle' ? v.cr.mul(v.cr).tex() : (kind === 'line'
        ? U.paren(v.lm) + R` \cdot ` + U.paren(X) + ' + ' + U.paren(v.ln) + ' = ' + right.tex()
        : U.paren(v.pa) + R` \cdot ` + pw(X, 2) + ' + ' + U.paren(v.pb) + R` \cdot ` + U.paren(X) + ' + ' + U.paren(v.pc) + ' = ' + right.tex());

      const steps = [
        {
          t: '境界と領域',
          m: [R`\text{境界: } ` + bdTex, R`\text{領域: } ` + ineqTex],
          n: R`不等号を等号に変えた式が**境界**（` + (kind === 'line' ? '直線' : (kind === 'circle' ? '円' : '放物線')) + R`）です。領域は境界の**` + regionJa + R`**で、境界は` + (strict ? R`含みません（破線）` : R`含みます（実線）`) + '。',
          easy: kind === 'line'
            ? R`$y = mx + n$ は直線です。$y >$（直線の式）は、同じ $x$ で直線上の点より $y$ が大きい点の集まりだから、直線より**上**の側。$y <$ なら**下**の側です。不等号が $<,\ >$ のときは境界線そのものは含まず（破線）、$\le,\ \ge$ なら含む（実線）と描きます。`
            : (kind === 'circle'
              ? R`$(x-a)^{2}+(y-b)^{2} = r^{2}$ は中心 $(a,\ b)$ からの距離が $r$ の点＝円周です。距離が $r$ より小さい点は円の**内側**、大きい点は**外側**。左辺は「距離の 2 乗」なので、$<r^{2}$ が内側、$>r^{2}$ が外側です。`
              : R`$y = ax^{2}+bx+c$ は放物線です。同じ $x$ で、$y$ が放物線上の点より大きい点が**上側**、小さい点が**下側**です。$<,\ >$ なら放物線そのものは含まない（破線）、$\le,\ \ge$ なら含む（実線）です。`)
        },
        {
          t: R`点 $(` + X.tex() + R`,\ ` + Y.tex() + R`)$ を代入する`,
          m: [
            R`\text{左辺: } ` + leftTex + ' = ' + numLeft,
            R`\text{右辺: } ` + rightTex + ' = ' + numRight
          ],
          n: expl,
          easy: R`判定したい点の $x$ 座標と $y$ 座標を、不等式の $x,\ y$ にそのまま入れます。すると左辺と右辺がただの数になるので、大小が比べられます。`
        },
        {
          t: '左辺と右辺を比べて判定',
          m: [left.tex() + ' ' + cmpSym + ' ' + right.tex() + R`\;\Rightarrow\; \text{左辺 } ` + cmpSym + R` \text{ 右辺}`, R`\text{不等式 } ` + ineqTex + R` \text{ は } ` + (holds ? R`\text{成り立つ}` : R`\text{成り立たない}`)],
          n: R`**` + verdict + R`**。` + (onB ? (strict ? R`$<,\ >$ では等号が成り立たないので、境界上の点は領域に入りません。` : R`$\le,\ \ge$ では等号が成り立つので、境界上の点も領域に入ります。`) : R``),
          easy: R`左辺と右辺の大小で、点が境界のどちら側にあるかが分かります。` + (onB ? R`等しいときは、点がちょうど境界の上にあります。` : R`不等式が成り立てば、その点は求める領域の中にあります。`),
          pro: R`領域の判定は「テスト点を代入して成り立つ側を斜線にする」のが確実です。原点が境界上にないなら、原点で試すのが定石です。`
        },
        {
          t: '境界の描き方（実線か破線か）',
          m: [R`\text{不等号 } ` + SYM[ineq] + R` \;\Rightarrow\; \text{境界は} ` + (strict ? R`\text{含まない（破線）}` : R`\text{含む（実線）}`)],
          n: R`図では、領域を塗り、境界線を` + (strict ? '破線' : '実線') + R`で描きます。判定した点は` + (state === 'in' ? '塗りの内側' : (state === 'b' ? '境界の上' : '塗りの外側')) + R`にあります。`,
          easy: R`「$<$」「$>$」は「ちょうど等しい」を含まないので、境界線は**破線**（その線上の点は仲間に入れない）。「$\le$」「$\ge$」は含むので**実線**です。`,
          lv: 2
        }
      ];

      /* ---- 図 ---- */
      const Xv = X.val(), Yv = Y.val();
      let pts, o, win;
      if (kind === 'line') {
        const m = v.lm.val(), n = v.ln.val();
        pts = [[Xv, Yv], [0, n], [Xv, m * Xv + n], [-3, -3 * m + n], [3, 3 * m + n]];
        win = fitWindow(pts.concat([[0, 0]]), 3);
        o = baseOpts(win);
        const f = (x) => m * x + n;
        const up = ineq === 'gt' || ineq === 'ge';
        o.fills.push({ f: up ? () => win.y[1] : f, g: up ? f : () => win.y[0], from: win.x[0], to: win.x[1], cls: 'f1' });
        o.curves.push({ f: f, cls: 'c1', dash: strict });
      } else if (kind === 'circle') {
        const a = v.ca.val(), b = v.cb.val(), r = v.cr.val();
        pts = [[a - r, b - r], [a + r, b + r], [Xv, Yv]].concat(maybeOrigin(a, b, r));
        win = fitWindow(pts, 2);
        o = baseOpts(win);
        const up = (x) => b + Math.sqrt(Math.max(0, r * r - (x - a) * (x - a))), dn = (x) => b - Math.sqrt(Math.max(0, r * r - (x - a) * (x - a)));
        const lo = Math.max(a - r, win.x[0]), hi = Math.min(a + r, win.x[1]);
        if (ineq === 'lt' || ineq === 'le') {
          if (hi > lo) o.fills.push({ f: up, g: dn, from: lo, to: hi, cls: 'f1' });
        } else {
          if (win.x[0] < a - r) o.fills.push({ f: () => win.y[1], g: () => win.y[0], from: win.x[0], to: a - r, cls: 'f1' });
          if (win.x[1] > a + r) o.fills.push({ f: () => win.y[1], g: () => win.y[0], from: a + r, to: win.x[1], cls: 'f1' });
          if (hi > lo) {
            o.fills.push({ f: () => win.y[1], g: up, from: lo, to: hi, cls: 'f1' });
            o.fills.push({ f: dn, g: () => win.y[0], from: lo, to: hi, cls: 'f1' });
          }
        }
        o.param.push(circleParam(a, b, r, 'c1', strict));
      } else {
        const a = v.pa.val(), b = v.pb.val(), c = v.pc.val();
        const f = (x) => a * x * x + b * x + c;
        const vx = -b / (2 * a);
        pts = [[Xv, Yv], [vx, f(vx)], [Xv, f(Xv)], [vx - 2, f(vx - 2)], [vx + 2, f(vx + 2)]];
        win = fitWindow(pts.concat(Math.hypot(vx, f(vx)) < 8 ? [[0, 0]] : []), 3);
        o = baseOpts(win);
        const up = ineq === 'gt' || ineq === 'ge';
        o.fills.push({ f: up ? () => win.y[1] : f, g: up ? f : () => win.y[0], from: win.x[0], to: win.x[1], cls: 'f1' });
        o.curves.push({ f: f, cls: 'c1', dash: strict });
      }
      const cls = state === 'in' ? 'c4' : (state === 'b' ? 'c3' : 'c2');
      o.points.push({ x: Xv, y: Yv, label: '(' + X.toString() + ', ' + Y.toString() + ')' + (state === 'in' ? ' 内' : (state === 'b' ? ' 境界上' : ' 外')), cls: cls, pos: 'tr' });

      return {
        result: [
          { label: '判定', tex: R`\text{` + verdict + '}' },
          { label: '左辺と右辺', tex: left.tex() + ' ' + cmpSym + ' ' + right.tex() },
          { label: '領域', tex: ineqTex },
          { label: '境界線', tex: R`\text{` + (strict ? '破線（含まない）' : '実線（含む）') + '}' }
        ],
        steps: steps,
        fig: JK.plot.graph(o)
      };
    }
  });

  /* ================= 軌跡 ================= */

  JK.registerCalc({
    id: 'iib-locus',
    course: 'IIB',
    unit: 'm-coord',
    group: '図形と方程式',
    title: '軌跡（2 定点からの距離の比）',
    desc: R`2 定点 $A,\ B$ からの距離の比が $AP : BP = m : n$ である点 $P$ の軌跡を求めます。$m = n$ なら垂直二等分線、$m \ne n$ ならアポロニウスの円です。$AP^{2}$、$BP^{2}$ を座標で表して展開・整理する過程を示します。`,
    form: [R`n^{2}AP^{2} = m^{2}BP^{2}`, R`AP^{2} = (x-x_{1})^{2} + (y-y_{1})^{2}`],
    inputs: [
      { key: 'x1', label: R`$A$ の $x$ 座標`, type: 'q', def: '0' },
      { key: 'y1', label: R`$A$ の $y$ 座標`, type: 'q', def: '0' },
      { key: 'x2', label: R`$B$ の $x$ 座標`, type: 'q', def: '6' },
      { key: 'y2', label: R`$B$ の $y$ 座標`, type: 'q', def: '0' },
      { key: 'm', label: R`比 $m$（$AP$ 側）`, type: 'q', def: '2', hint: R`$AP : BP = m : n$` },
      { key: 'n', label: R`比 $n$（$BP$ 側）`, type: 'q', def: '1' }
    ],
    examples: [
      { label: 'アポロニウスの円（2:1）', v: { x1: '0', y1: '0', x2: '6', y2: '0', m: '2', n: '1' } },
      { label: '垂直二等分線（1:1）', v: { x1: '1', y1: '2', x2: '5', y2: '-2', m: '1', n: '1' } },
      { label: '点がずれた配置（3:1）', v: { x1: '-1', y1: '1', x2: '3', y2: '3', m: '3', n: '1' } },
      { label: '1:2（A 側が内部）', v: { x1: '0', y1: '0', x2: '3', y2: '0', m: '1', n: '2' } }
    ],
    intro: {
      easy: R`「条件を満たす点 $P(x,\ y)$ の集まり（**軌跡**）はどんな図形か」を求める問題です。やり方は 3 段階です。(1) 動く点を $P(x,\ y)$ とおく。(2) 条件を $x,\ y$ の式で表す。(3) 整理して、どんな図形（直線・円など）かを読み取る。
$AP : BP = m : n$ は $n \cdot AP = m \cdot BP$ と同じです。距離は平方根を含むので、両辺を 2 乗した $n^{2}AP^{2} = m^{2}BP^{2}$ にします（距離は正なので、2 乗しても同じことです）。$AP^{2},\ BP^{2}$ は距離の公式から $x,\ y$ の 2 次式になり、整理すると、比が $1 : 1$ なら直線（2 点から等距離＝**垂直二等分線**）、そうでなければ**円**になります。`,
      normal: R`$n^{2}\{(x-x_{1})^{2}+(y-y_{1})^{2}\} = m^{2}\{(x-x_{2})^{2}+(y-y_{2})^{2}\}$ を展開し、$x^{2}+y^{2}$ の係数 $n^{2}-m^{2}$ が $0$ なら直線、$0$ でなければ円の方程式として平方完成します。`,
      pro: R`$m \ne n$ のとき、$A,\ B$ を $m : n$ に内分・外分する点を直径の両端とする円（アポロニウスの円）です。半径は $\dfrac{mn \cdot AB}{|m^{2}-n^{2}|}$。この 2 点を求めて検算するのが速いです。`
    },
    compute(v) {
      const x1 = v.x1, y1 = v.y1, x2 = v.x2, y2 = v.y2, m = v.m, n = v.n;
      const dx = x2.sub(x1), dy = y2.sub(y1);
      const D2 = dx.mul(dx).add(dy.mul(dy));
      if (D2.isZero()) throw new JK.CalcError('A と B が同じ点です。異なる 2 点を入力してください');
      if (m.sign() <= 0 || n.sign() <= 0) throw new JK.CalcError('m, n は正の数にしてください（比 m : n）');
      const N2 = n.mul(n), M2 = m.mul(m);
      const k = N2.sub(M2);
      const Cx = N2.mul(x1).sub(M2.mul(x2)).mul(-2), Cy = N2.mul(y1).sub(M2.mul(y2)).mul(-2);
      const C0 = N2.mul(x1.mul(x1).add(y1.mul(y1))).sub(M2.mul(x2.mul(x2).add(y2.mul(y2))));
      const AP2 = R`(x ` + (x1.sign() >= 0 ? '- ' + x1.tex() : '+ ' + x1.neg().tex()) + R`)^{2} + (y ` + (y1.sign() >= 0 ? '- ' + y1.tex() : '+ ' + y1.neg().tex()) + ')^{2}';
      const BP2 = R`(x ` + (x2.sign() >= 0 ? '- ' + x2.tex() : '+ ' + x2.neg().tex()) + R`)^{2} + (y ` + (y2.sign() >= 0 ? '- ' + y2.tex() : '+ ' + y2.neg().tex()) + ')^{2}';
      const expA = lc([[Q(1), 'x^{2}'], [Q(1), 'y^{2}'], [x1.mul(-2), 'x'], [y1.mul(-2), 'y'], [x1.mul(x1).add(y1.mul(y1)), '']]);
      const expB = lc([[Q(1), 'x^{2}'], [Q(1), 'y^{2}'], [x2.mul(-2), 'x'], [y2.mul(-2), 'y'], [x2.mul(x2).add(y2.mul(y2)), '']]);
      const merged = lc([[k, 'x^{2}'], [k, 'y^{2}'], [Cx, 'x'], [Cy, 'y'], [C0, '']]) + ' = 0';

      const steps = [
        {
          t: '動点 $P$ をおき、条件を式にする',
          m: [R`P(x,\ y),\quad AP : BP = m : n \;\Rightarrow\; n \cdot AP = m \cdot BP \;\Rightarrow\; n^{2}AP^{2} = m^{2}BP^{2}`],
          n: R`$AP : BP = ` + m.tex() + ' : ' + n.tex() + R`$ なので $` + n.tex() + R` \cdot AP = ` + m.tex() + R` \cdot BP$。距離は 0 以上なので、両辺を 2 乗しても同値です。`,
          easy: R`軌跡の問題は、まず動く点を $P(x,\ y)$ と置いて、「$P$ が満たす条件」を $x,\ y$ の式にします。比 $AP : BP = m : n$ は、分数にすれば $\dfrac{AP}{BP} = \dfrac{m}{n}$、分母を払えば $n \cdot AP = m \cdot BP$ です。距離には平方根が入るので、両辺を 2 乗して $AP^{2},\ BP^{2}$ の形にします。`,
          pro: R`両辺とも 0 以上の数なので、2 乗しても条件は同値です（軌跡の「逆の確認」も同時に済みます）。`
        },
        {
          t: R`$AP^{2},\ BP^{2}$ を座標で表す`,
          m: [R`AP^{2} = (x - x_{1})^{2} + (y - y_{1})^{2} = ` + AP2, R`BP^{2} = (x - x_{2})^{2} + (y - y_{2})^{2} = ` + BP2],
          n: R`$A = ` + pt(x1, y1) + R`,\ B = ` + pt(x2, y2) + R`$ を距離の公式（2 乗の形）に代入します。`,
          easy: R`2 点間の距離の公式 $\sqrt{(x_{2}-x_{1})^{2}+(y_{2}-y_{1})^{2}}$ の「2 乗」にあたる部分が、$AP^{2}$ です。根号がないので扱いやすくなります。`
        },
        {
          t: R`$n^{2}AP^{2} = m^{2}BP^{2}$ に代入して展開する`,
          m: [
            N2.tex() + R`\left\{` + AP2 + R`\right\} = ` + M2.tex() + R`\left\{` + BP2 + R`\right\}`,
            N2.tex() + R`\left(` + expA + R`\right) = ` + M2.tex() + R`\left(` + expB + R`\right)`
          ],
          n: R`各括弧を展開します。$(x - p)^{2} = x^{2} - 2px + p^{2}$ を使います。`,
          easy: R`$(x - p)^{2} = x^{2} - 2px + p^{2}$ という展開の公式を $x$ の部分と $y$ の部分に使います。$x^{2} + y^{2}$ の項、$x$ の項、$y$ の項、定数項に分けて書き出します。`,
          lv: 2
        },
        {
          t: '右辺を移項して整理する',
          m: [
            R`(n^{2}-m^{2})(x^{2}+y^{2}) - 2(n^{2}x_{1} - m^{2}x_{2})x - 2(n^{2}y_{1} - m^{2}y_{2})y + n^{2}(x_{1}^{2}+y_{1}^{2}) - m^{2}(x_{2}^{2}+y_{2}^{2}) = 0`,
            merged
          ],
          n: R`$x^{2} + y^{2}$ の係数は $n^{2} - m^{2} = ` + N2.tex() + ' - ' + M2.tex() + ' = ' + k.tex() + R`$ です。`,
          easy: R`両辺にある $x^{2}$ の項どうし、$y^{2}$ の項どうし、$x$ の項どうし…を、左辺にまとめて同類項を整理します。$x^{2}$ と $y^{2}$ の係数がそろっているのが、あとで円になる理由です。`
        }
      ];
      let res, fig;
      const Mx = x1.add(x2).div(2), My = y1.add(y2).div(2);
      const win0 = [[x1.val(), y1.val()], [x2.val(), y2.val()]];
      if (k.isZero()) {
        // 垂直二等分線: Cx x + Cy y + C0 = 0
        const g = normLine(Cx, Cy, C0);
        steps.push({
          t: R`$m = n$ のとき: 直線（垂直二等分線）`,
          m: [R`n^{2}-m^{2} = 0 \;\Rightarrow\; ` + lc([[Cx, 'x'], [Cy, 'y'], [C0, '']]) + ' = 0', lineGen(g.a, g.b, g.c)],
          n: R`$x^{2},\ y^{2}$ の項が消えて 1 次式になるので、軌跡は直線です。$m = n$ は $AP = BP$ で、$A,\ B$ から等距離の点の集まり＝線分 $AB$ の**垂直二等分線**です。`,
          easy: R`$AP : BP = 1 : 1$ は $AP = BP$、「2 点から同じ距離にある点」です。そんな点を全部集めると、線分 $AB$ の真ん中を通り $AB$ に垂直な直線になります（中学の作図で習った垂直二等分線）。式の上でも $x^{2},\ y^{2}$ が消えて直線の式になります。`
        });
        steps.push({
          t: '確認: 中点を通り、$AB$ に垂直',
          m: [R`M = ` + pt(Mx, My) + R`:\ ` + U.paren(g.a) + R` \cdot ` + U.paren(Mx) + ' + ' + U.paren(g.b) + R` \cdot ` + U.paren(My) + ' + ' + U.paren(g.c) + ' = ' + g.a.mul(Mx).add(g.b.mul(My)).add(g.c).tex(), R`\overrightarrow{AB} = ` + R`\left(` + dx.tex() + R`,\ ` + dy.tex() + R`\right) \parallel \left(` + g.a.tex() + R`,\ ` + g.b.tex() + R`\right) \text{（法線ベクトル）}`].map((s) => s.replace(R`\overrightarrow{AB}`, R`AB \text{ の向き}`)),
          n: R`線分 $AB$ の中点 $M$ が直線上にあり、直線の法線ベクトル $(a,\ b)$ が $AB$ の向き $(` + dx.tex() + R`,\ ` + dy.tex() + R`)$ に平行であることを確認します。`,
          lv: 2
        });
        res = [
          { label: '軌跡', tex: R`\text{直線 } ` + lineGen(g.a, g.b, g.c) },
          { label: '図形', tex: R`\text{線分 } AB \text{ の垂直二等分線}` },
          { label: '通る点（中点 M）', tex: pt(Mx, My) }
        ];
        const win = fitWindow(win0.concat([[Mx.val(), My.val()]]), 3);
        const o = baseOpts(win);
        addLine(o, g.a.val(), g.b.val(), g.c.val(), 'c1', false);
        o.segs.push({ x1: x1.val(), y1: y1.val(), x2: x2.val(), y2: y2.val(), cls: 'dim', dash: true });
        o.points.push({ x: x1.val(), y: y1.val(), label: lab('A', x1, y1), cls: 'c2', pos: 'tl' });
        o.points.push({ x: x2.val(), y: y2.val(), label: lab('B', x2, y2), cls: 'c3', pos: 'br' });
        o.points.push({ x: Mx.val(), y: My.val(), label: 'M', cls: 'c4', pos: 'tr' });
        fig = JK.plot.graph(o);
      } else {
        const l = Cx.div(k), mm = Cy.div(k), nn = C0.div(k);
        const h = l.div(2), kk = mm.div(2);
        const cx = h.neg(), cy = kk.neg();
        const r2 = h.mul(h).add(kk.mul(kk)).sub(nn);
        const r2alt = M2.mul(N2).mul(D2).div(k.mul(k));
        const rt = U.sqrtTex(r2), rv = Math.sqrt(r2.val());
        steps.push({
          t: R`$m \ne n$ のとき: 円の形に直す（平方完成）`,
          m: [
            R`\text{両辺を } ` + k.tex() + R` \text{ で割る:}\quad ` + lc([[Q(1), 'x^{2}'], [Q(1), 'y^{2}'], [l, 'x'], [mm, 'y'], [nn, '']]) + ' = 0',
            sq('x', cx) + ' - ' + h.mul(h).tex() + ' + ' + sq('y', cy) + ' - ' + kk.mul(kk).tex() + ' ' + U.signed(nn) + ' = 0',
            circStd(cx, cy, r2)
          ],
          n: R`$x^{2} + y^{2}$ の係数が 1 になるように割り、$x,\ y$ をそれぞれ平方完成します。中心は $` + pt(cx, cy) + R`$、半径は $\sqrt{` + r2.tex() + R`} = ` + rt + R`$ です。`,
          easy: R`$x^{2}$ と $y^{2}$ の係数が同じ（ここでは $` + k.tex() + R`$）なので、その数で割ると $x^{2} + y^{2} + lx + my + n = 0$ という円の一般形になります。あとは「円の一般形から中心と半径を求める」ときと同じ、平方完成です。`,
          pro: R`$AP : BP$ が 1 でないとき、点 $A,\ B$ は円に対して「反転の関係」にあり、比の小さいほうの点がこの円の内部に入ります。`
        });
        // 内分点・外分点での検算
        const mn = m.add(n), dm = m.sub(n);
        const Px = n.mul(x1).add(m.mul(x2)).div(mn), Py = n.mul(y1).add(m.mul(y2)).div(mn);
        const Ex = m.mul(x2).sub(n.mul(x1)).div(dm), Ey = m.mul(y2).sub(n.mul(y1)).div(dm);
        const midx = Px.add(Ex).div(2), midy = Py.add(Ey).div(2);
        steps.push({
          t: '検算: 内分点・外分点が直径の両端',
          m: [
            R`P_{1} = \text{内分点 } (m : n) = ` + pt(Px, Py) + R`,\quad P_{2} = \text{外分点 } (m : n) = ` + pt(Ex, Ey),
            R`\text{中心 } = \frac{P_{1}+P_{2}}{2} = ` + pt(midx, midy) + R`\quad (\text{上で求めた中心と一致})`,
            R`r = \frac{mn \cdot AB}{|m^{2}-n^{2}|} = \sqrt{\frac{m^{2}n^{2}AB^{2}}{(m^{2}-n^{2})^{2}}} = \sqrt{` + r2alt.tex() + '} = ' + U.sqrtTex(r2alt)
          ],
          n: R`直線 $AB$ 上で $AP : BP = m : n$ となる点は、内分点と外分点の 2 つです。この 2 点はどちらも軌跡の円上にあり、円の直径の両端になります。中心がその中点になっているか、半径が一致するかで検算できます。`,
          easy: R`直線 $AB$ の上で、距離の比が $m : n$ になる点は 2 個あります（線分の内側と、延長線上）。この 2 つの点を結ぶ線分が、円のちょうど直径になります。だから、その中点が円の中心、その長さの半分が半径になります。`,
          lv: 2
        });
        res = [
          { label: '軌跡', tex: R`\text{円 } ` + circStd(cx, cy, r2) },
          { label: '中心', tex: pt(cx, cy) },
          { label: '半径', tex: rt + (/\\sqrt/.test(rt) ? R` \approx ` + U.fmt(rv, 4) : '') },
          { label: '直径の両端', tex: pt(Px, Py) + R`,\ ` + pt(Ex, Ey) }
        ];
        const win = fitWindow(win0.concat([[cx.val() - rv, cy.val() - rv], [cx.val() + rv, cy.val() + rv]]), 2);
        const o = baseOpts(win);
        o.param.push(circleParam(cx.val(), cy.val(), rv, 'c1', false));
        o.segs.push({ x1: x1.val(), y1: y1.val(), x2: x2.val(), y2: y2.val(), cls: 'dim', dash: true });
        o.points.push({ x: x1.val(), y: y1.val(), label: lab('A', x1, y1), cls: 'c2', pos: 'tl' });
        o.points.push({ x: x2.val(), y: y2.val(), label: lab('B', x2, y2), cls: 'c3', pos: 'br' });
        o.points.push({ x: Px.val(), y: Py.val(), label: 'P₁', cls: 'c4', pos: 'tr' });
        o.points.push({ x: Ex.val(), y: Ey.val(), label: 'P₂', cls: 'c4', pos: 'tl' });
        o.points.push({ x: cx.val(), y: cy.val(), label: '中心', cls: 'dim', pos: 'bl' });
        fig = JK.plot.graph(o);
      }
      return { result: res, steps: steps, fig: fig };
    }
  });
})();
