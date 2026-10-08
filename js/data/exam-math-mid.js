/* GOKAKU NAVI — 数学 問題バンク（中堅大レベル）
   数学の全単元（grade 1 以上の 20 単元）を 1 問ずつ、頻出 4 単元（微分・積分(数II)・数列・ベクトル・積分法(数III)）は 2 問ずつ、計 24 問。
   中堅私大（偏差値 50〜60）の入試標準を想定した誘導つき大問。すべて書き下ろしのオリジナル問題（既存の入試問題・参考書の文面は含まない）。 */
(function () {
  'use strict';
  const R = String.raw;
  const PI = Math.PI;
  const S2 = Math.SQRT2, S3 = Math.sqrt(3), S5 = Math.sqrt(5), S7 = Math.sqrt(7), S21 = Math.sqrt(21);
  const G = JK.plot.graph;

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // 絶対値つき 2 次関数 g(x) = |x^2 - 2x - 3| と水平線 y = 2, y = 4
  function figAbsQuad() {
    const g = function (x) { return Math.abs(x * x - 2 * x - 3); };
    return G({
      w: 340, h: 240, x: [-2.5, 4.5], y: [-0.8, 6.2],
      curves: [{ f: g, cls: 'c1' }],
      hlines: [{ y: 2, label: 'y = 2', cls: 'c2' }, { y: 4, label: 'y = 4', cls: 'c3' }],
      points: [{ x: 1, y: 4, label: '(1, 4)', cls: 'c3', pos: 'tr' }],
      labels: [{ x: 3.3, y: 5.5, text: 'y = g(x)', cls: 'c1' }]
    });
  }

  // 円に内接する四角形 ABCD（AB=2, BC=5, CD=6, DA=3）
  function figCyclic() {
    const d = JK.plot.draw(340, 270);
    const cosA = -2 / 3, sinA = S5 / 3;
    const A = [0, 0], B = [2, 0], D = [3 * cosA, 3 * sinA];
    // C は B から 5、D から 6 の点で、直線 BD に関して A と反対側
    const dx = D[0] - B[0], dy = D[1] - B[1], dd = Math.sqrt(dx * dx + dy * dy);
    const a = (25 - 36 + dd * dd) / (2 * dd), h = Math.sqrt(25 - a * a);
    const ux = dx / dd, uy = dy / dd;
    const cross = function (P) { return dx * (P[1] - B[1]) - dy * (P[0] - B[0]); };
    let C = [B[0] + a * ux - h * uy, B[1] + a * uy + h * ux];
    if (cross(C) * cross(A) > 0) C = [B[0] + a * ux + h * uy, B[1] + a * uy - h * ux];
    // 外接円（A, B, D の外心）
    const ex = (A[0] * A[0] + A[1] * A[1]), fx = (B[0] * B[0] + B[1] * B[1]), gx = (D[0] * D[0] + D[1] * D[1]);
    const den = 2 * (A[0] * (B[1] - D[1]) + B[0] * (D[1] - A[1]) + D[0] * (A[1] - B[1]));
    const O = [(ex * (B[1] - D[1]) + fx * (D[1] - A[1]) + gx * (A[1] - B[1])) / den,
               (ex * (D[0] - B[0]) + fx * (A[0] - D[0]) + gx * (B[0] - A[0])) / den];
    const Rr = Math.sqrt((A[0] - O[0]) * (A[0] - O[0]) + (A[1] - O[1]) * (A[1] - O[1]));
    const k = 38, cx = 170, cy = 140;
    const T = function (P) { return [cx + (P[0] - O[0]) * k, cy - (P[1] - O[1]) * k]; };
    const tA = T(A), tB = T(B), tC = T(C), tD = T(D);
    d.circle(cx, cy, Rr * k, { cls: 'dim', w: 1.2 });
    d.poly([tA, tB, tC, tD], { cls: 'fg', fill: 'f0' });
    d.line(tB[0], tB[1], tD[0], tD[1], { cls: 'c3', dash: true, w: 1.3 });
    d.line(tA[0], tA[1], tC[0], tC[1], { cls: 'c2', dash: true, w: 1.3 });
    [tA, tB, tC, tD].forEach(function (P) { d.dot(P[0], P[1], { cls: 'fg', r: 2.5 }); });
    const mid = function (P, Q) { return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const out = function (M, s) {          // 外心から外向きに少しずらした位置
      const vx = M[0] - cx, vy = M[1] - cy, L = Math.sqrt(vx * vx + vy * vy) || 1;
      return [M[0] + vx / L * s, M[1] + vy / L * s];
    };
    const lab = function (P, s, txt, o) { const q = out(P, s); d.text(q[0], q[1] + 4, txt, o); };
    lab(tA, 13, 'A', { size: 14, italic: true });
    lab(tB, 13, 'B', { size: 14, italic: true });
    lab(tC, 13, 'C', { size: 14, italic: true });
    lab(tD, 13, 'D', { size: 14, italic: true });
    // 辺の長さ（辺の中点から多角形の外側へ）
    const gc = [(tA[0] + tB[0] + tC[0] + tD[0]) / 4, (tA[1] + tB[1] + tC[1] + tD[1]) / 4];
    const side = function (P, Q, txt) {
      const M = mid(P, Q), vx = M[0] - gc[0], vy = M[1] - gc[1], L = Math.sqrt(vx * vx + vy * vy) || 1;
      d.text(M[0] + vx / L * 12, M[1] + vy / L * 12 + 4, txt, { cls: 'c1', size: 13 });
    };
    side(tA, tB, '2'); side(tB, tC, '5'); side(tC, tD, '6'); side(tD, tA, '3');
    return d.svg();
  }

  // △ABC（AB=6, BC=7, CA=3）と ∠A の二等分線 AE・外接円・内心 I
  function figGeo() {
    const d = JK.plot.draw(340, 306);
    const B = [0, 0], C = [7, 0], A = [38 / 7, 8 * S5 / 7];
    const yo = -1 / A[1];                                  // 外心 O = (7/2, yo)
    const O = [3.5, yo], Rr = Math.sqrt(3.5 * 3.5 + yo * yo);
    const D = [14 / 3, 0], E = [3.5, yo - Rr], I = [5, S5 / 2];
    const k = 36;
    const T = function (P) { return [43 + (P[0] + 0.02) * k, 24 + (3.15 - P[1]) * k]; };
    const tA = T(A), tB = T(B), tC = T(C), tD = T(D), tE = T(E), tI = T(I), tO = T(O);
    d.circle(tO[0], tO[1], Rr * k, { cls: 'dim', w: 1.2 });
    d.poly([tA, tB, tC], { cls: 'fg', fill: 'f0' });
    d.line(tB[0], tB[1], tE[0], tE[1], { cls: 'dim', dash: true, w: 1 });
    d.line(tC[0], tC[1], tE[0], tE[1], { cls: 'dim', dash: true, w: 1 });
    d.line(tA[0], tA[1], tE[0], tE[1], { cls: 'c2', w: 1.6 });
    d.line(tB[0], tB[1], tI[0], tI[1], { cls: 'c3', dash: true, w: 1.3 });
    [tA, tB, tC, tD, tE, tI].forEach(function (P) { d.dot(P[0], P[1], { cls: 'fg', r: 2.5 }); });
    const lab = function (P, dx, dy, txt) { d.text(P[0] + dx, P[1] + dy, txt, { size: 14, italic: true }); };
    lab(tA, 8, -6, 'A'); lab(tB, -14, 5, 'B'); lab(tC, 6, 5, 'C');
    lab(tD, 4, 17, 'D'); lab(tE, -4, 18, 'E'); lab(tI, 12, 14, 'I');
    const mid = function (P, Q) { return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const m1 = mid(tA, tB), m2 = mid(tA, tC), m3 = mid(tB, tC);
    d.text(m1[0] - 12, m1[1] - 8, '6', { cls: 'c1', size: 13 });
    d.text(m2[0] + 8, m2[1] - 2, '3', { cls: 'c1', size: 13 });
    d.text(m3[0] - 30, m3[1] + 15, '7', { cls: 'c1', size: 13 });
    return d.svg();
  }

  // 領域 D: x ≥ 0, y ≥ 0, x + 2y ≤ 10, 3x + 2y ≤ 18 と頂点
  function figRegion() {
    return G({
      w: 340, h: 250, x: [-1, 11], y: [-1, 7],
      curves: [
        { f: function (x) { return (10 - x) / 2; }, cls: 'c2', domain: [0, 10] },
        { f: function (x) { return (18 - 3 * x) / 2; }, cls: 'c3', domain: [0, 6] }
      ],
      fills: [{ f: function (x) { return Math.min((10 - x) / 2, (18 - 3 * x) / 2); }, g: function () { return 0; }, from: 0, to: 6, cls: 'f1' }],
      points: [
        { x: 0, y: 5, label: '(0, 5)', cls: 'c1', pos: 'tr' },
        { x: 4, y: 3, label: '(4, 3)', cls: 'c1', pos: 'tr' },
        { x: 6, y: 0, label: '(6, 0)', cls: 'c1', pos: 'tr' }
      ],
      labels: [
        { x: 8.3, y: 1.6, text: 'x + 2y = 10', cls: 'c2' },
        { x: 7.6, y: 3.2, text: '3x + 2y = 18', cls: 'c3' },
        { x: 1.6, y: 1.4, text: 'D', cls: 'c1' }
      ]
    });
  }

  // 円錐（底面の半径 6、高さ 12）に内接する円柱の断面（r, h は文字のまま示す）
  function figCone() {
    const d = JK.plot.draw(340, 284);
    const cx = 180, by = 240, k = 18;
    const rr = 2.5, hh = 12 - 2 * rr;                 // 図示用の 1 例
    const tl = [cx - 6 * k, by], tr = [cx + 6 * k, by], ap = [cx, by - 12 * k];
    d.poly([tl, tr, ap], { cls: 'fg', fill: 'f0' });
    const x1 = cx - rr * k, x2 = cx + rr * k, y2 = by - hh * k;
    d.poly([[x1, by], [x2, by], [x2, y2], [x1, y2]], { cls: 'c1', fill: 'f1' });
    d.line(cx, ap[1], cx, by, { cls: 'dim', dash: true, w: 1 });
    d.line(cx, y2, x2, y2, { cls: 'c2', w: 2.2 });
    d.text((cx + x2) / 2, y2 - 7, 'r', { cls: 'c2', size: 14, anchor: 'middle', italic: true });
    const my = (y2 + by) / 2;
    d.arrow(x1 + 14, my, x1 + 14, y2 + 3, { cls: 'c3', w: 1.4 });
    d.arrow(x1 + 14, my, x1 + 14, by - 3, { cls: 'c3', w: 1.4 });
    d.text(x1 + 24, my + 5, 'h', { cls: 'c3', size: 14, italic: true });
    // 寸法: 底面の半径 6、全体の高さ 12
    d.line(cx, by + 12, tr[0], by + 12, { cls: 'dim', w: 1 });
    d.line(cx, by + 8, cx, by + 16, { cls: 'dim', w: 1 });
    d.line(tr[0], by + 8, tr[0], by + 16, { cls: 'dim', w: 1 });
    d.text((cx + tr[0]) / 2, by + 28, '6', { cls: 'c1', size: 13, anchor: 'middle' });
    const lx = tl[0] - 14;
    d.line(lx, ap[1], lx, by, { cls: 'dim', w: 1 });
    d.line(lx - 4, ap[1], lx + 4, ap[1], { cls: 'dim', w: 1 });
    d.line(lx - 4, by, lx + 4, by, { cls: 'dim', w: 1 });
    d.text(lx - 6, (ap[1] + by) / 2 + 5, '12', { cls: 'c1', size: 13, anchor: 'end' });
    return d.svg();
  }

  // 放物線 y = x^2 と P(1, -3) から引いた 2 本の接線、囲まれた部分
  function figTangents() {
    return G({
      w: 340, h: 260, x: [-2.5, 4.5], y: [-4, 10],
      curves: [
        { f: function (x) { return x * x; }, cls: 'c1' },
        { f: function (x) { return -2 * x - 1; }, cls: 'c2', domain: [-2.4, 1.5] },
        { f: function (x) { return 6 * x - 9; }, cls: 'c3', domain: [0.8, 3.15] }
      ],
      fills: [{ f: function (x) { return x * x; }, g: function (x) { return Math.max(-2 * x - 1, 6 * x - 9); }, from: -1, to: 3, cls: 'f1' }],
      points: [
        { x: -1, y: 1, label: 'A(-1, 1)', cls: 'c2', pos: 'tl' },
        { x: 3, y: 9, label: 'B(3, 9)', cls: 'c3', pos: 'tl' },
        { x: 1, y: -3, label: 'P(1, -3)', cls: 'fg', pos: 'br' }
      ],
      labels: [{ x: -1.9, y: 6.6, text: 'y = x²', cls: 'c1' }]
    });
  }

  // 曲線 C: y = log x、原点から引いた接線 ℓ: y = x/e（接点 P(e, 1)）、囲まれた図形 D（斜線部）
  function figLogTangent() {
    const e = Math.E;
    return G({
      w: 340, h: 270, x: [-0.4, 3.7], y: [-1.5, 1.7], equal: true,
      curves: [
        { f: function (x) { return Math.log(x); }, cls: 'c1', domain: [0.03, 3.7] },
        { f: function (x) { return x / e; }, cls: 'c2', domain: [0, 3.7] }
      ],
      fills: [{ f: function (x) { return x / e; }, g: function (x) { return Math.max(0, Math.log(x)); }, from: 0, to: e, cls: 'f1' }],
      segs: [
        { x1: e, y1: 0, x2: e, y2: 1, cls: 'dim', dash: true },
        { x1: 0, y1: 1, x2: e, y2: 1, cls: 'dim', dash: true }
      ],
      points: [
        { x: e, y: 1, label: 'P(e, 1)', cls: 'c3', pos: 'tl' },
        { x: e, y: 0, label: 'e', cls: 'dim', pos: 'br' },
        { x: 1, y: 0, cls: 'dim' }
      ],
      labels: [
        { x: 3.3, y: 1.5, text: 'ℓ', cls: 'c2' },
        { x: 3.35, y: 0.88, text: 'C', cls: 'c1' },
        { x: 0.58, y: 0.06, text: 'D', cls: 'c1' }
      ]
    });
  }

  // 双曲線 H: x²/4 - y²/5 = 1（焦点 F(3, 0), F'(-3, 0)、点 P(3, 5/2)）と漸近線。
  // detail = true のときは P における接線 y = 3x/2 - 2、交点 A・B、三角形 OAB（斜線部）を加える
  function figHyperbola(detail) {
    const sl = S5 / 2;                                   // 漸近線の傾き √5/2
    const xA = 3 + S5, xB = 3 - S5;                      // 接線と漸近線の交点の x 座標
    const o = {
      w: 340, h: detail ? 304 : 260, equal: true,
      x: detail ? [-4.5, 7.2] : [-6.5, 6.5], y: detail ? [-3.5, 7] : [-5, 5],
      param: [
        { x: function (t) { return 2 * Math.cosh(t); }, y: function (t) { return S5 * Math.sinh(t); }, t: [-2.3, 2.3], cls: 'c1' },
        { x: function (t) { return -2 * Math.cosh(t); }, y: function (t) { return S5 * Math.sinh(t); }, t: [-2.3, 2.3], cls: 'c1' }
      ],
      curves: [
        { f: function (x) { return sl * x; }, cls: 'dim', dash: true },
        { f: function (x) { return -sl * x; }, cls: 'dim', dash: true }
      ],
      points: [{ x: 3, y: 2.5, label: 'P', cls: 'c3', pos: 'br' }]
    };
    if (!detail) {
      o.segs = [
        { x1: 3, y1: 0, x2: 3, y2: 2.5, cls: 'c2' },
        { x1: -3, y1: 0, x2: 3, y2: 2.5, cls: 'c2' }
      ];
      o.points.push({ x: 3, y: 0, label: 'F', cls: 'fg', pos: 'tr' });
      o.points.push({ x: -3, y: 0, label: 'F′', cls: 'fg', pos: 'tl' });
    } else {
      o.curves.push({ f: function (x) { return 1.5 * x - 2; }, cls: 'c2', domain: [-1.2, 7.2] });
      o.fills = [{ f: function (x) { return sl * x; }, g: function (x) { return Math.max(-sl * x, 1.5 * x - 2); }, from: 0, to: xA, cls: 'f3' }];
      o.points.push({ x: xA, y: sl * xA, label: 'A', cls: 'c3', pos: 'tl' });
      o.points.push({ x: xB, y: -sl * xB, cls: 'c3' });
      o.labels = [{ x: xB + 0.5, y: -sl * xB - 0.05, text: 'B', cls: 'c3' }];
    }
    return G(o);
  }

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ---------- 数と式 ---------- */
    {
      id: 'm-mid-expr-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-expr',
      title: '二重根号と対称式・整数部分',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`$a = \sqrt{8 + 2\sqrt{15}}$、$b = \sqrt{8 - 2\sqrt{15}}$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$a + b$ の値を求めよ。`, type: 'num', answer: 2 * S5, show: R`2\sqrt{5}`, hint: R`例: 2√3 や 2*sqrt(3)` },
        { label: '(2)', q: R`$a^{3} + b^{3}$ の値を求めよ。`, type: 'num', answer: 28 * S5, show: R`28\sqrt{5}`, hint: R`例: 5√2` },
        { label: '(3)', q: R`$a^{4} + b^{4}$ の値を求めよ。`, type: 'num', answer: 248 },
        { label: '(4)', q: R`$a^{4}$ の整数部分を求めよ。`, type: 'num', answer: 247 }
      ],
      solution: [
        { t: R`二重根号をはずして $a,\ b$ を簡単にする`,
          m: [R`a = \sqrt{8 + 2\sqrt{15}} = \sqrt{5} + \sqrt{3}`,
              R`b = \sqrt{8 - 2\sqrt{15}} = \sqrt{5} - \sqrt{3}`],
          n: R`$\sqrt{p + 2\sqrt{q}}$ は、「足して $p$、かけて $q$」になる 2 つの正の数 $m,\ n$ ($m > n$) を見つけて $\sqrt{m} + \sqrt{n}$ と直せます。ここでは $p = 8,\ q = 15$ で、$5 + 3 = 8,\ 5 \times 3 = 15$ なので $m = 5,\ n = 3$ です。引き算の方は $\sqrt{m} - \sqrt{n}$ となり、$\sqrt{5} > \sqrt{3}$ なので正の値で、$b>0$ と合っています。`,
          easy: R`$(\sqrt{m} + \sqrt{n})^{2} = m + n + 2\sqrt{mn}$ という展開を逆向きに使います。$8 + 2\sqrt{15}$ が「ある数の 2 乗」になっていれば、外側の $\sqrt{\ }$ と 2 乗が打ち消し合います。そこで「足して $8$、かけて $15$」になる 2 数を探すと $5$ と $3$ が見つかり、$8 + 2\sqrt{15} = (\sqrt{5} + \sqrt{3})^{2}$ と分かります。` },
        { t: '和 $a + b$ と積 $ab$ を求める（(1)）',
          m: [R`a + b = (\sqrt{5}+\sqrt{3}) + (\sqrt{5}-\sqrt{3}) = 2\sqrt{5}`,
              R`ab = (\sqrt{5}+\sqrt{3})(\sqrt{5}-\sqrt{3}) = 5 - 3 = 2`],
          n: R`$a,\ b$ を入れ替えても変わらない式（**対称式**）は、和 $a+b$ と積 $ab$ だけで表せます。以降の計算のために両方を求めておきます。`,
          easy: R`足し算では $+\sqrt{3}$ と $-\sqrt{3}$ が打ち消し合うので $2\sqrt{5}$、かけ算は $(x+y)(x-y) = x^{2} - y^{2}$ の形で $5 - 3 = 2$ と根号が消えます。` },
        { t: '$a^{3} + b^{3}$ を和と積で表す（(2)）',
          m: [R`a^{3} + b^{3} = (a+b)^{3} - 3ab(a+b)`,
              R`= (2\sqrt{5})^{3} - 3 \cdot 2 \cdot 2\sqrt{5} = 40\sqrt{5} - 12\sqrt{5} = 28\sqrt{5}`],
          n: R`$(a+b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$ より $a^{3}+b^{3} = (a+b)^{3} - 3ab(a+b)$ です。$(2\sqrt{5})^{3} = 8 \cdot 5\sqrt{5} = 40\sqrt{5}$ に注意します。`,
          easy: R`$a$ と $b$ に $\sqrt{5}\pm\sqrt{3}$ を直接代入して 3 乗するのは大変です。公式 $a^{3}+b^{3} = (a+b)^{3} - 3ab(a+b)$ を使えば、すでに求めた $a+b = 2\sqrt{5}$ と $ab = 2$ を入れるだけで済みます。` },
        { t: '$a^{4} + b^{4}$ を求める（(3)）',
          m: [R`a^{2} + b^{2} = (a+b)^{2} - 2ab = 20 - 4 = 16`,
              R`a^{4} + b^{4} = (a^{2} + b^{2})^{2} - 2(ab)^{2} = 256 - 8 = 248`],
          n: R`まず 2 乗の和 $a^{2}+b^{2}$ を作り、それをもう一度 2 乗して $a^{4}+b^{4}$ に進みます。$(a^{2}+b^{2})^{2} = a^{4} + 2a^{2}b^{2} + b^{4}$ を移項した形です。`,
          pro: R`$x^{n}+y^{n}$ 型は「和と積 → $x^{2}+y^{2}$ → $x^{4}+y^{4}$」の順に 2 乗で上げていくのが速い。$s_{n+1} = (x+y)s_{n} - xy\,s_{n-1}$ の漸化式も使えます。` },
        { t: '$a^{4}$ の整数部分を求める（(4)）',
          m: [R`a^{4} = 248 - b^{4}`,
              R`0 < b = \sqrt{5} - \sqrt{3} < 1 \;\Rightarrow\; 0 < b^{4} < 1`,
              R`247 < a^{4} < 248`],
          n: R`$a^{4} + b^{4} = 248$ は整数で、$b^{4}$ は $0$ より大きく $1$ より小さい数です。したがって $a^{4} = 248 - b^{4}$ は $247$ と $248$ のあいだにあり、整数部分は $247$ です。実際 $b \fallingdotseq 2.236 - 1.732 = 0.504$ なので $b^{4} \fallingdotseq 0.0645$、$a^{4} \fallingdotseq 247.9355$ です。`,
          easy: R`整数部分は「小数点より左の部分」です。$a^{4}$ と $b^{4}$ を足すとちょうど整数 $248$ になるので、$a^{4}$ は「$248$ からほんの少し（$b^{4}$ だけ）引いた数」です。$b^{4}$ は $1$ より小さい正の数なので、$a^{4}$ は $247.\text{○○}$ という数になり、整数部分は $247$ です。`,
          pro: R`「$x^{n}+y^{n}$ が整数、$0<y<1$」の型は整数部分問題の定石。$y = \sqrt{5}-\sqrt{3} = \dfrac{2}{\sqrt{5}+\sqrt{3}}$ と書けば $0<y<1$ はすぐ確認できます。` }
      ],
      tags: ['二重根号', '対称式', '整数部分']
    },

    /* ---------- 2次関数 ---------- */
    {
      id: 'm-mid-quad-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-quad',
      title: '絶対値つき2次関数と解の個数',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`$f(x) = x^{2} - 2x - 3$ とし、$g(x) = |f(x)|$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$-2 \le x \le 4$ における $g(x)$ の最大値を求めよ。`, type: 'num', answer: 5 },
        { label: '(2)', q: R`$x$ の方程式 $g(x) = k$ が異なる 3 個の実数解をもつような定数 $k$ の値を求めよ。`, type: 'num', answer: 4 },
        { label: '(3)', q: R`$k = 2$ のとき、方程式 $g(x) = 2$ の 4 つの実数解を、それぞれ 2 乗してすべて足した値を求めよ。`, type: 'num', answer: 20 },
        { label: '(4)', q: R`方程式 $g(x) = k$ が異なる 2 個の実数解をもつような $k$ の範囲として正しいものを選べ。`, type: 'choice', choices: [R`$0 < k < 4$`, R`$k = 0$ または $k > 4$`, R`$k > 4$`, R`$k = 0$ または $k \ge 4$`], answer: 1 }
      ],
      solution: [
        { t: '絶対値をはずして $g(x)$ のグラフをかく',
          m: [R`f(x) = x^{2} - 2x - 3 = (x+1)(x-3) = (x-1)^{2} - 4`,
              R`g(x) = \begin{cases} f(x) & (x \le -1,\ x \ge 3) \\ -f(x) & (-1 < x < 3) \end{cases}`],
          n: R`$f(x) \ge 0$ となるのは $x \le -1$ または $x \ge 3$ のときで、そこでは $g(x) = f(x)$ です。$-1 < x < 3$ では $f(x) < 0$ なので $g(x) = -f(x)$ となり、グラフは $y = f(x)$ の $x$ 軸より下の部分を $x$ 軸に関して折り返したものになります。折り返した部分の頂点は $(1,\ 4)$ です。`,
          easy: R`絶対値 $|A|$ は「$A$ が負のときだけ符号を変えて正にする」操作です。グラフでいうと、$y = f(x)$ の $x$ 軸より下にはみ出した部分を、鏡に映すように $x$ 軸で上側へ折り返した形になります。$y = f(x)$ の頂点 $(1,\ -4)$ は、折り返されて $(1,\ 4)$ の「山」になります。`,
          fig: figAbsQuad() },
        { t: R`区間 $-2 \le x \le 4$ での最大値（(1)）`,
          m: [R`g(-2) = |4 + 4 - 3| = 5,\qquad g(4) = |16 - 8 - 3| = 5`,
              R`g(1) = |-4| = 4`],
          n: R`区間の両端での値と、内側の山の頂点 $(1,\ 4)$ の高さを比べます。$g(-2) = g(4) = 5$ が最も大きいので、最大値は $5$ です。`,
          easy: R`グラフ（図）を見ると、区間 $-2 \le x \le 4$ のなかで一番高いのは左端 $x=-2$ と右端 $x=4$ の点で、どちらも高さ $5$ です。真ん中の山の頂上は高さ $4$ なので、それより高いことが分かります。`,
          lv: 2 },
        { t: '共有点が 3 個になる $k$（(2)）',
          m: R`k = 4`,
          n: R`方程式 $g(x) = k$ の実数解は、曲線 $y = g(x)$ と水平な直線 $y = k$ の共有点の $x$ 座標です。直線がちょうど折り返した山の頂点 $(1,\ 4)$ を通るとき、頂点で 1 個、山の両側で 1 個ずつの計 3 個の共有点をもちます。よって $k = 4$ です。`,
          easy: R`水平な直線 $y=k$ を下から上へゆっくり動かしながら、曲線との交点の数を数えてみましょう。$k$ が $0$ のとき交点は 2 個、少し上げると山の両脇と谷の外側で 4 個、山の頂上（高さ $4$）に触れる瞬間だけ 3 個、それより上では 2 個に減ります。`,
          pro: R`$|f(x)| = k$ の解の個数は「折り返した山の頂点の高さ」が境目。個数が $0 \to 2 \to 4 \to 3 \to 2$ と変わる様子を図で押さえておく。` },
        { t: '$k = 2$ のとき 4 つの解の 2 乗の和（(3)）',
          m: [R`x^{2} - 2x - 3 = 2 \;\Rightarrow\; x^{2} - 2x - 5 = 0`,
              R`x^{2} - 2x - 3 = -2 \;\Rightarrow\; x^{2} - 2x - 1 = 0`,
              R`\text{前者の 2 解 } \alpha,\ \beta: \ \alpha+\beta = 2,\ \alpha\beta = -5 \;\Rightarrow\; \alpha^{2}+\beta^{2} = 4 + 10 = 14`,
              R`\text{後者の 2 解 } \gamma,\ \delta: \ \gamma+\delta = 2,\ \gamma\delta = -1 \;\Rightarrow\; \gamma^{2}+\delta^{2} = 4 + 2 = 6`,
              R`14 + 6 = 20`],
          n: R`$g(x) = 2$ は「$f(x) = 2$ または $f(x) = -2$」と同じです。それぞれ $x$ の 2 次方程式を解かずに、**解と係数の関係**（和と積）から $\alpha^{2}+\beta^{2} = (\alpha+\beta)^{2} - 2\alpha\beta$ を計算すると楽です。4 つの解は $x = 1 \pm \sqrt{6},\ 1 \pm \sqrt{2}$ で、確かに 4 個の異なる実数です。`,
          easy: R`絶対値を含む方程式 $|A| = 2$ は「$A = 2$ または $A = -2$」と 2 つに分けて解きます。2 次方程式 $x^{2} + px + q = 0$ の 2 つの解の和は $-p$、積は $q$ になります（解と係数の関係）。解を実際に出さなくても、$\alpha^{2}+\beta^{2} = (\alpha+\beta)^{2} - 2\alpha\beta$ と変形すれば 2 乗の和が求まります。`,
          lv: 2 },
        { t: '解の個数と $k$ の範囲（(4)）',
          m: R`g(x) = k \text{ の実数解の個数} = \begin{cases} 0\text{ 個} & (k < 0) \\ 2\text{ 個} & (k = 0) \\ 4\text{ 個} & (0 < k < 4) \\ 3\text{ 個} & (k = 4) \\ 2\text{ 個} & (k > 4) \end{cases}`,
          n: R`異なる 2 個の実数解をもつのは、$k = 0$（谷の 2 点 $x=-1,\ 3$）と $k > 4$（山の頂点より上で左右に 1 個ずつ）のときです。$k = 4$ は 3 個なので含まれません。したがって「$k = 0$ または $k > 4$」が正解です。`,
          easy: R`直線 $y=k$ とグラフの交点の数を、$k$ の高さごとに整理します。$k<0$ ではグラフに届かず $0$ 個、$k=0$ は $x$ 軸上の 2 点、$0<k<4$ は 4 点、$k=4$ は山の頂点で 3 点、$k>4$ は山より高いので外側の 2 点です。` }
      ],
      tags: ['絶対値', '2次関数', '解の個数', '解と係数の関係']
    },

    /* ---------- 図形と計量 ---------- */
    {
      id: 'm-mid-trig1-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-trig1',
      title: '円に内接する四角形の対角線と面積',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`円に内接する四角形 ABCD において、$\mathrm{AB} = 2,\ \mathrm{BC} = 5,\ \mathrm{CD} = 6,\ \mathrm{DA} = 3$ である。次の問いに答えよ。`,
      fig: figCyclic(),
      parts: [
        { label: '(1)', q: R`$\cos\angle\mathrm{BAD}$ の値を求めよ。`, type: 'num', answer: -2 / 3, show: R`-\frac{2}{3}`, hint: R`例: -3/8` },
        { label: '(2)', q: R`対角線 BD の長さを求めよ。`, type: 'num', answer: S21, show: R`\sqrt{21}`, hint: R`例: √13 や sqrt(13)` },
        { label: '(3)', q: R`四角形 ABCD の面積を求めよ。`, type: 'num', answer: 6 * S5, show: R`6\sqrt{5}`, hint: R`例: 4√3` },
        { label: '(4)', q: R`対角線 AC の長さを求めよ。`, type: 'num', answer: 9 * S21 / 7, show: R`\frac{9\sqrt{21}}{7}`, hint: R`例: 5√13/3` }
      ],
      solution: [
        { t: '円に内接する四角形の性質を使う方針',
          n: R`円に内接する四角形では、向かい合う角の和が $180\degree$ です。したがって $\angle\mathrm{C} = 180\degree - \angle\mathrm{A}$ となり、$\cos\mathrm{C} = -\cos\mathrm{A}$、$\sin\mathrm{C} = \sin\mathrm{A}$ が成り立ちます。対角線 BD を共有する △ABD と △CBD の両方に余弦定理を使うと、$\cos\mathrm{A}$ を求める方程式が作れます。`,
          easy: R`円周上の 4 点を順に結ぶと、向かい合う 2 つの角（A と C）は合わせて $180\degree$ になります。A が鈍角（$90\degree$ より大きい）なら C は鋭角です。角そのものの大きさは分からなくても、「$\cos$ の符号だけが逆になる」ことを使えば、2 つの三角形から同じ $\mathrm{BD}$ を表す式を作って解けます。`,
          lv: 2 },
        { t: R`余弦定理で $\cos\mathrm{A}$ を求める（(1)）`,
          m: [R`\mathrm{BD}^{2} = \mathrm{AB}^{2} + \mathrm{AD}^{2} - 2\,\mathrm{AB}\cdot\mathrm{AD}\cos\mathrm{A} = 13 - 12\cos\mathrm{A}`,
              R`\mathrm{BD}^{2} = \mathrm{CB}^{2} + \mathrm{CD}^{2} - 2\,\mathrm{CB}\cdot\mathrm{CD}\cos\mathrm{C} = 61 + 60\cos\mathrm{A}`,
              R`13 - 12\cos\mathrm{A} = 61 + 60\cos\mathrm{A} \;\Rightarrow\; 72\cos\mathrm{A} = -48 \;\Rightarrow\; \cos\mathrm{A} = -\frac{2}{3}`],
          n: R`△ABD では $\mathrm{AB}^{2} + \mathrm{AD}^{2} = 4 + 9 = 13$、△CBD では $\mathrm{CB}^{2} + \mathrm{CD}^{2} = 25 + 36 = 61$ です。$\cos\mathrm{C} = -\cos\mathrm{A}$ を使うと、2 つの式の右辺が等しいことから $\cos\mathrm{A}$ が決まります。`,
          easy: R`**余弦定理**は、三角形の 2 辺 $b,\ c$ とそのあいだの角 $\theta$ が分かっているとき、残りの辺 $a$ を $a^{2} = b^{2} + c^{2} - 2bc\cos\theta$ で求める公式です（$\theta = 90\degree$ なら三平方の定理）。同じ辺 BD を 2 通りに表した式を「$=$」でつなぐと、未知数 $\cos\mathrm{A}$ の方程式になります。` },
        { t: '対角線 BD の長さ（(2)）',
          m: R`\mathrm{BD}^{2} = 13 - 12 \cdot \left(-\frac{2}{3}\right) = 13 + 8 = 21 \;\Rightarrow\; \mathrm{BD} = \sqrt{21}`,
          n: R`$\cos\mathrm{A} = -\dfrac{2}{3}$ を △ABD の式に代入します。$\cos\mathrm{A} < 0$ なので $\angle\mathrm{A}$ は鈍角です。`,
          easy: R`(1) で求めた $\cos\mathrm{A}$ を、$\mathrm{BD}^{2} = 13 - 12\cos\mathrm{A}$ に入れるだけです。負の数を引くので、足し算になることに注意しましょう。` },
        { t: '四角形の面積（(3)）',
          m: [R`\sin\mathrm{A} = \sqrt{1 - \cos^{2}\mathrm{A}} = \sqrt{1 - \frac{4}{9}} = \frac{\sqrt{5}}{3}`,
              R`S = \triangle\mathrm{ABD} + \triangle\mathrm{CBD} = \frac{1}{2}\cdot 2 \cdot 3\sin\mathrm{A} + \frac{1}{2}\cdot 5 \cdot 6\sin\mathrm{C}`,
              R`= (3 + 15)\cdot\frac{\sqrt{5}}{3} = 6\sqrt{5}`],
          n: R`四角形を対角線 BD で 2 つの三角形に分け、それぞれ「2 辺とその間の角」の面積公式 $\dfrac{1}{2}bc\sin\theta$ を使います。$\sin\mathrm{C} = \sin(180\degree - \mathrm{A}) = \sin\mathrm{A}$ なので、まとめて計算できます。`,
          easy: R`$\sin^{2}\theta + \cos^{2}\theta = 1$ から、$\cos\mathrm{A}$ が分かれば $\sin\mathrm{A}$ も求まります（$0\degree < \mathrm{A} < 180\degree$ では $\sin\mathrm{A} > 0$）。三角形の面積は「2 辺 × その間の角の $\sin$ ÷ 2」で計算できます。` },
        { t: '対角線 AC の長さ（(4)）',
          m: [R`\cos\mathrm{B} = \frac{\mathrm{AB}^{2} + \mathrm{BC}^{2} - \mathrm{CD}^{2} - \mathrm{DA}^{2}}{2(\mathrm{AB}\cdot\mathrm{BC} + \mathrm{CD}\cdot\mathrm{DA})} = \frac{29 - 45}{2(10 + 18)} = -\frac{2}{7}`,
              R`\mathrm{AC}^{2} = 2^{2} + 5^{2} - 2\cdot 2\cdot 5\cdot\left(-\frac{2}{7}\right) = \frac{243}{7} \;\Rightarrow\; \mathrm{AC} = \frac{9\sqrt{21}}{7}`],
          n: R`今度は角 B に注目して、対角線 AC を △ABC と △ADC の両方で表します（$\angle\mathrm{D} = 180\degree - \angle\mathrm{B}$）。$29 - 20\cos\mathrm{B} = 45 + 36\cos\mathrm{B}$ を解いて $\cos\mathrm{B} = -\dfrac{2}{7}$、これを △ABC の式に代入して $\mathrm{AC}^{2} = \dfrac{243}{7}$ を得ます。`,
          pro: R`円に内接する四角形では**トレミーの定理** $\mathrm{AC}\cdot\mathrm{BD} = \mathrm{AB}\cdot\mathrm{CD} + \mathrm{BC}\cdot\mathrm{DA}$ が使えます。$\mathrm{AC}\cdot\sqrt{21} = 12 + 15 = 27$ より $\mathrm{AC} = \dfrac{27}{\sqrt{21}} = \dfrac{9\sqrt{21}}{7}$ と一発で出ます。` }
      ],
      tags: ['円に内接する四角形', '余弦定理', '面積', 'トレミーの定理']
    },

    /* ---------- データの分析 ---------- */
    {
      id: 'm-mid-data-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-data',
      title: '2つの集団の平均・分散と変量変換',
      source: { univ: 'オリジナル' },
      time: 9,
      body: R`ある学校の 1 年 A 組（10 人）と B 組（15 人）が同じ数学のテストを受けた。A 組の得点の平均は $60$ 点・分散は $20$、B 組の得点の平均は $65$ 点・分散は $30$ であった。分散は、それぞれの組の人数で割って求めたものとする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`A 組と B 組を合わせた 25 人全体の得点の平均を求めよ。`, type: 'num', answer: 63 },
        { label: '(2)', q: R`A 組の 10 人について、得点の 2 乗の平均値を求めよ。`, type: 'num', answer: 3620 },
        { label: '(3)', q: R`25 人全体の得点の分散を求めよ。`, type: 'num', answer: 32 },
        { label: '(4)', q: R`25 人全員の得点 $x$ を $y = 1.2x + 5$ に変換した。変換後の得点 $y$ の分散を求めよ。`, type: 'num', answer: 46.08 }
      ],
      solution: [
        { t: '前提：分散を 2 乗の平均と平均から表す',
          n: R`データ $x$ の平均を $\bar{x}$、分散を $s^{2}$ とすると、$s^{2} = (\text{偏差の 2 乗の平均}) = \overline{x^{2}} - (\bar{x})^{2}$ が成り立ちます（$\overline{x^{2}}$ は $x^{2}$ の平均）。つまり $\overline{x^{2}} = s^{2} + (\bar{x})^{2}$ です。`,
          easy: R`分散は「平均からのずれの 2 乗の平均」です。式を展開して整理すると、「$x$ を 2 乗してから平均した値」から「平均を 2 乗した値」を引いたものに等しい、という便利な形になります。この形を使うと、人数や平均がちがう 2 つのグループを合体させたときの分散も計算できます。`,
          lv: 3 },
        { t: '全体の平均（(1)）',
          m: R`\bar{x} = \frac{10 \times 60 + 15 \times 65}{25} = \frac{600 + 975}{25} = \frac{1575}{25} = 63`,
          n: R`全体の平均は「全員の得点の合計 ÷ 人数」です。各組の合計は「平均 × 人数」で求められます。`,
          easy: R`A 組の合計点は $60 \times 10 = 600$、B 組の合計点は $65 \times 15 = 975$ です。合計 $1575$ 点を $25$ 人で割ったものが全体の平均です。人数が多い B 組のほうに平均が少し引き寄せられて、$60$ と $65$ の真ん中（$62.5$）より高くなります。` },
        { t: '各組の「2 乗の平均」（(2)）',
          m: [R`\text{A 組}:\ \overline{x^{2}} = s^{2} + (\bar{x})^{2} = 20 + 60^{2} = 3620`,
              R`\text{B 組}:\ \overline{x^{2}} = 30 + 65^{2} = 30 + 4225 = 4255`],
          n: R`前提の式 $\overline{x^{2}} = s^{2} + (\bar{x})^{2}$ を使います。A 組は $20 + 3600 = 3620$ です。`,
          easy: R`分散と平均が分かっていれば、実際の得点が分からなくても「得点を 2 乗した値の平均」は計算できます。これが、2 つの組を合わせるときのカギになります。` },
        { t: '全体の分散（(3)）',
          m: [R`\overline{x^{2}} = \frac{10 \times 3620 + 15 \times 4255}{25} = \frac{36200 + 63825}{25} = 4001`,
              R`s^{2} = \overline{x^{2}} - (\bar{x})^{2} = 4001 - 63^{2} = 4001 - 3969 = 32`],
          n: R`全員分の「2 乗の平均」も、各組の「2 乗の合計（2 乗の平均 × 人数）」を足して 25 で割れば求まります。そこから全体の平均 $63$ の 2 乗を引くと全体の分散です。`,
          easy: R`平均のときと同じ要領で、「2 乗の合計」を全員分足して人数で割ります。最後に「平均の 2 乗」を引くのを忘れないようにしましょう。` },
        { t: '1 次式で変換したときの分散（(4)）',
          m: [R`y = ax + b \;\Rightarrow\; \bar{y} = a\bar{x} + b,\quad s_{y}^{2} = a^{2}s_{x}^{2}`,
              R`s_{y}^{2} = 1.2^{2} \times 32 = 1.44 \times 32 = 46.08`],
          n: R`$y = ax + b$ と変換すると、平均は $a\bar{x} + b$ になりますが、偏差は $a$ 倍になるだけ（$+b$ は平均からのずれには影響しない）なので、分散は $a^{2}$ 倍になります。$+5$ は分散に影響しません。`,
          easy: R`全員の得点に一律 $5$ 点を足しても、全員が同じだけ動くので「散らばり具合」は変わりません。一方、得点を $1.2$ 倍すると散らばりの幅も $1.2$ 倍になり、「ずれの 2 乗」である分散は $1.2^{2} = 1.44$ 倍になります。`,
          pro: R`変量変換 $y = ax+b$ では、平均は $a\bar{x}+b$、分散は $a^{2}s^{2}$、標準偏差は $|a|s$。この問題の分散の合成は、(各組の分散の加重平均 $26$) + (各組の平均の分散 $6$) $= 32$ と計算しても求まります。` }
      ],
      tags: ['平均', '分散', '変量変換', '分散の合成']
    },

    /* ---------- 場合の数・確率 ---------- */
    {
      id: 'm-mid-prob-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-prob',
      title: 'さいころ3回の最大値・積・和',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`1 個のさいころを 3 回続けて投げ、出た目を順に $a,\ b,\ c$ とする。次の確率を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$a < b < c$ となる確率`, type: 'num', answer: 5 / 54, show: R`\frac{5}{54}`, hint: R`例: 7/48` },
        { label: '(2)', q: R`出た目の最大値がちょうど $4$ になる確率`, type: 'num', answer: 37 / 216, show: R`\frac{37}{216}`, hint: R`例: 25/72` },
        { label: '(3)', q: R`積 $abc$ が $4$ の倍数になる確率`, type: 'num', answer: 5 / 8, show: R`\frac{5}{8}` },
        { label: '(4)', q: R`和 $a + b + c$ がちょうど $10$ になる確率`, type: 'num', answer: 1 / 8, show: R`\frac{1}{8}` }
      ],
      solution: [
        { t: '全事象を確認する',
          n: R`さいころを 3 回投げたときの目の出方は $6^{3} = 216$ 通りで、どれも同じ確率で起こります。$a,\ b,\ c$ は「順に出た目」なので、$(a,\ b,\ c) = (1,\ 2,\ 3)$ と $(3,\ 2,\ 1)$ は別の結果として数えます。`,
          easy: R`確率は「(条件に合う場合の数) ÷ (全部の場合の数)」で求めます。1 回目の目が 6 通り、2 回目も 6 通り、3 回目も 6 通りなので、全部で $6 \times 6 \times 6 = 216$ 通りです。順番を区別して数えるのが、さいころの問題の基本です。`,
          lv: 2 },
        { t: '$a < b < c$ となる確率（(1)）',
          m: [R`\C{6}{3} = 20`,
              R`\frac{20}{216} = \frac{5}{54}`],
          n: R`$a<b<c$ を満たす $(a,\ b,\ c)$ は、$1$ から $6$ までの異なる 3 つの数を選べば、小さい順に $a,\ b,\ c$ に当てはめる方法がただ 1 通りに決まります。よって選び方の数 $\C{6}{3} = 20$ がそのまま場合の数です。`,
          easy: R`たとえば $\{2,\ 3,\ 5\}$ という 3 つの数を選んだら、$a<b<c$ を満たす並べ方は $(2,\ 3,\ 5)$ の 1 通りだけです。だから「3 つの数を選ぶ組合せの数」を数えれば十分です。`,
          pro: R`「大小が決まっている」型は組合せ $\C{n}{r}$ に直すのが定石。等号を許す $a \le b \le c$ なら重複組合せ $\H{6}{3} = 56$ 通りです。` },
        { t: '最大値がちょうど 4 になる確率（(2)）',
          m: [R`4^{3} - 3^{3} = 64 - 27 = 37`,
              R`\frac{37}{216}`],
          n: R`最大値が「ちょうど $4$」とは、「3 つとも $4$ 以下」から「3 つとも $3$ 以下」を除いたものです。3 つとも $4$ 以下になる目の出方は $4^{3}$ 通り、3 つとも $3$ 以下は $3^{3}$ 通りなので、その差 $37$ 通りが該当します。`,
          easy: R`「最大値が 4」とは、4 が少なくとも 1 回出て、5 と 6 は 1 回も出ない、ということです。まず「1〜4 だけが出る」場合を数え、そこから「1〜3 だけが出る」場合（4 が出ない）を引けば、「4 が少なくとも 1 回出る」場合だけが残ります。`,
          pro: R`「最大値がちょうど $k$」は「$k$ 以下」$-$「$k-1$ 以下」、「最小値がちょうど $k$」は「$k$ 以上」$-$「$k+1$ 以上」。この差の形で一気に出せます。` },
        { t: '積が 4 の倍数になる確率（(3)）',
          m: [R`\text{積が } 4 \text{ の倍数でない} \;\Leftrightarrow\; \text{積にふくまれる素因数 } 2 \text{ が } 1 \text{ 個以下}`,
              R`\text{すべて奇数: } 3^{3} = 27 \text{ 通り}`,
              R`\text{偶数がちょうど 1 個で、それが } 2 \text{ か } 6: \quad 3 \times 2 \times 3^{2} = 54 \text{ 通り}`,
              R`1 - \frac{27 + 54}{216} = 1 - \frac{81}{216} = \frac{135}{216} = \frac{5}{8}`],
          n: R`「4 の倍数になる」場合は数えにくいので、余事象「4 の倍数にならない」場合を数えます。目 $1,\ 2,\ 3,\ 4,\ 5,\ 6$ にふくまれる素因数 $2$ の個数は $0,\ 1,\ 0,\ 2,\ 0,\ 1$ 個です。3 つの積に素因数 $2$ が 2 個以上ふくまれれば $4$ の倍数なので、「$4$ の倍数でない」のは「3 つとも奇数」か「$2$ または $6$ がちょうど 1 個で残り 2 個が奇数」のときだけです（$4$ が出たら必ず $4$ の倍数）。後者は、偶数の位置が 3 通り、その値が $2,\ 6$ の 2 通り、残り 2 個の奇数が $3 \times 3$ 通りです。`,
          easy: R`$4 = 2 \times 2$ なので、積が $4$ の倍数になるには、かけ合わせる数の中に「素因数 $2$」が合わせて 2 個以上必要です。偶数が 2 つ出れば $2 \times 2$ でそろいます。偶数が 1 つだけのときは、その偶数が $4$ なら（$4$ 自体が $2 \times 2$）OK、$2$ や $6$ なら素因数 $2$ が 1 個しかないのでダメです。この「ダメな場合」を数えて全体から引きます。`,
          pro: R`「〜の倍数」は余事象と素因数の個数で数える。素因数 $2$ の個数が $2$ 以上かどうか、という見方を身につけておく。` },
        { t: '和が 10 になる確率（(4)）',
          m: [R`\{1,3,6\},\ \{1,4,5\},\ \{2,3,5\} \to \text{各 } 3! = 6 \text{ 通り}`,
              R`\{2,2,6\},\ \{2,4,4\},\ \{3,3,4\} \to \text{各 } 3 \text{ 通り}`,
              R`6 \times 3 + 3 \times 3 = 27 \;\Rightarrow\; \frac{27}{216} = \frac{1}{8}`],
          n: R`和が $10$ となる 3 つの目の組を、小さい順に書き出して漏れなく数えます。$\{1,3,6\},\ \{1,4,5\},\ \{2,2,6\},\ \{2,3,5\},\ \{2,4,4\},\ \{3,3,4\}$ の 6 組です。3 つとも異なる組は並べ方が $3! = 6$ 通り、2 つが同じ組は並べ方が $3$ 通りです。`,
          easy: R`「和が 10」になる 3 つの数を、$1 \le x \le y \le z \le 6$ の順で書き出すと漏れにくくなります。$x = 1$ なら $y + z = 9$ で $(y,\ z) = (3,\ 6),\ (4,\ 5)$、$x = 2$ なら $y + z = 8$ で $(2,\ 6),\ (3,\ 5),\ (4,\ 4)$、$x = 3$ なら $y + z = 7$ で $(3,\ 4)$ です。書き出した組ごとに、$a,\ b,\ c$ への並べ方を数えて足します。`,
          pro: R`和が一定の場合の数は、重複組合せで $\C{9}{2} - 3\cdot\C{3}{2} = 36 - 9 = 27$ と数えても求まります（各目から $1$ を引いて $0 \le \cdot \le 5$、上限を超える場合を除く）。` }
      ],
      tags: ['さいころ', '組合せ', '余事象', '場合の数']
    },

    /* ---------- 整数の性質 ---------- */
    {
      id: 'm-mid-int-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-int',
      title: '約数の個数・総和と gcd・lcm',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`自然数 $360$ について、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$360$ の正の約数は全部で何個あるか。`, type: 'num', answer: 24 },
        { label: '(2)', q: R`$360$ の正の約数すべての和を求めよ。`, type: 'num', answer: 1170 },
        { label: '(3)', q: R`$360n$ がある自然数の 2 乗になるような、最小の自然数 $n$ を求めよ。`, type: 'num', answer: 10 },
        { label: '(4)', q: R`最大公約数が $12$、最小公倍数が $360$ である 2 つの自然数の組 $(a,\ b)$ $(a < b)$ は全部で何組あるか。`, type: 'num', answer: 4 }
      ],
      solution: [
        { t: '素因数分解する',
          m: R`360 = 2^{3} \times 3^{2} \times 5`,
          n: R`$360$ を小さい素数で順に割っていくと、$360 \div 2 = 180,\ 180 \div 2 = 90,\ 90 \div 2 = 45,\ 45 \div 3 = 15,\ 15 \div 3 = 5$ となり、$360 = 2^{3} \times 3^{2} \times 5$ です。以降の 4 問はすべてこの形から出発します。`,
          easy: R`素因数分解は「$360$ を素数のかけ算だけで表す」ことです。$2$ で割れるだけ割り、次に $3$、次に $5$ と進めます。約数・平方数・最大公約数といった整数の性質の問題は、素因数分解の「指数」を見ると見通しが良くなります。`,
          lv: 2 },
        { t: '約数の個数（(1)）',
          m: R`(3+1)(2+1)(1+1) = 4 \times 3 \times 2 = 24`,
          n: R`$360$ の約数は $2^{a}\,3^{b}\,5^{c}$ $(0 \le a \le 3,\ 0 \le b \le 2,\ 0 \le c \le 1)$ の形で表せ、この $(a,\ b,\ c)$ の選び方と約数が 1 対 1 に対応します。$a$ は $4$ 通り、$b$ は $3$ 通り、$c$ は $2$ 通りです。`,
          easy: R`約数は「$360$ の素因数をいくつか選んでかけたもの」です。$2$ は $0$ 個・1 個・2 個・3 個の $4$ 通り、$3$ は $0$ 個・1 個・2 個の $3$ 通り、$5$ は $0$ 個・1 個の $2$ 通りの選び方があり、組み合わせると $4 \times 3 \times 2$ 通りです。`,
          pro: R`$N = p^{a}q^{b}r^{c}$ の約数の個数は $(a+1)(b+1)(c+1)$。公式を知っていれば暗算で出ます。` },
        { t: '約数の総和（(2)）',
          m: [R`(1 + 2 + 4 + 8)(1 + 3 + 9)(1 + 5)`,
              R`= 15 \times 13 \times 6 = 1170`],
          n: R`左辺を展開すると、$2^{a}\,3^{b}\,5^{c}$ の形の項がすべて 1 回ずつ現れます。つまり、展開した式の項の和が「約数すべての和」になります。それを素数ごとの和の積 $(1+2+2^{2}+2^{3})(1+3+3^{2})(1+5)$ にまとめて計算します。`,
          easy: R`たとえば $12 = 2^{2} \times 3$ の約数の和は、$(1 + 2 + 4)(1 + 3) = 7 \times 4 = 28$ で、実際 $1+2+3+4+6+12 = 28$ です。展開すると $1\cdot1,\ 1\cdot3,\ 2\cdot1,\ 2\cdot3,\ 4\cdot1,\ 4\cdot3$ の 6 項（$=$ 全約数）が出てくるからです。$360$ でも同じ仕組みで、$15 \times 13 \times 6$ を計算します。`,
          pro: R`約数の総和は $\dfrac{p^{a+1}-1}{p-1}\cdot\dfrac{q^{b+1}-1}{q-1}\cdots$ とも書けます。$2^{4}-1 = 15,\ \dfrac{3^{3}-1}{2} = 13,\ \dfrac{5^{2}-1}{4} = 6$ です。` },
        { t: '平方数になる最小の $n$（(3)）',
          m: [R`360n = 2^{3} \times 3^{2} \times 5 \times n`,
              R`n = 2 \times 5 = 10 \;\Rightarrow\; 360 \times 10 = 3600 = 60^{2}`],
          n: R`ある自然数の 2 乗になる数は、素因数分解したときの指数がすべて偶数です。$360$ の指数は $2$ が $3$（奇数）、$3$ が $2$（偶数）、$5$ が $1$（奇数）なので、$n$ には少なくとも $2$ が 1 個と $5$ が 1 個必要です。最小の $n$ は $2 \times 5 = 10$ です。`,
          easy: R`$36 = 6^{2} = 2^{2} \times 3^{2}$ のように、平方数は「同じ素数がペアで出てくる」数です。$360 = 2\cdot2\cdot2\cdot3\cdot3\cdot5$ では、$3$ はペアが作れていますが、$2$ が 1 個余り、$5$ も 1 個余っています。余りの $2$ と $5$ にペアの相手を足すために、$n = 2 \times 5 = 10$ をかけます。` },
        { t: '最大公約数と最小公倍数から 2 数を決める（(4)）',
          m: [R`a = 12a',\ b = 12b' \quad (a',\ b' \text{ は互いに素},\ a' < b')`,
              R`\text{最小公倍数 } = 12a'b' = 360 \;\Rightarrow\; a'b' = 30`,
              R`(a',\ b') = (1,\ 30),\ (2,\ 15),\ (3,\ 10),\ (5,\ 6)`,
              R`(a,\ b) = (12,\ 360),\ (24,\ 180),\ (36,\ 120),\ (60,\ 72) \quad\text{の 4 組}`],
          n: R`最大公約数が $12$ なので、$a = 12a',\ b = 12b'$ とおくと $a',\ b'$ は互いに素です。このとき最小公倍数は $12a'b'$ となるので、$12a'b' = 360$ より $a'b' = 30$ です。$30 = 2 \times 3 \times 5$ はどの素数の指数も $1$ なので、$30$ を 2 数の積に分ければ必ず互いに素になり、$a' < b'$ の分け方は $1 \cdot 30,\ 2 \cdot 15,\ 3 \cdot 10,\ 5 \cdot 6$ の 4 通りです。`,
          easy: R`「最大公約数が $12$」とは、2 数がどちらも $12$ の倍数で、$12$ で割った商 $a',\ b'$ に共通の約数が残っていない、ということです。つまり $a',\ b'$ は「互いに素」です。互いに素な 2 数の最小公倍数は単なる積なので、$a'b' = 360 \div 12 = 30$ と決まります。あとは $30$ を 2 つの数の積に分ける方法（小さい方を $a'$）を数えるだけです。`,
          pro: R`$G = \mathrm{gcd},\ L = \mathrm{lcm}$ なら $a = Ga',\ b = Gb',\ L = Ga'b',\ ab = GL$ が出発点。この問題では $a + b$ が最小となるのは $(60,\ 72)$ のときで、そのとき $a + b = 132$ です。` }
      ],
      tags: ['約数の個数', '約数の総和', '平方数', '最大公約数', '最小公倍数']
    },

    /* ---------- 図形の性質 ---------- */
    {
      id: 'm-mid-geo-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-geo',
      title: '角の二等分線・方べきの定理・内心',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`$\triangle\mathrm{ABC}$ において、$\mathrm{AB} = 6,\ \mathrm{BC} = 7,\ \mathrm{CA} = 3$ である。$\angle\mathrm{A}$ の二等分線が辺 $\mathrm{BC}$ と交わる点を D、この二等分線が $\triangle\mathrm{ABC}$ の外接円と再び交わる点を E（E $\ne$ A）とする。また、$\triangle\mathrm{ABC}$ の内心を I とする。次の問いに答えよ。`,
      fig: figGeo(),
      parts: [
        { label: '(1)', q: R`線分 $\mathrm{BD}$ の長さを求めよ。`, type: 'num', answer: 14 / 3, show: R`\frac{14}{3}`, hint: R`例: 11/4` },
        { label: '(2)', q: R`線分 $\mathrm{AD}$ の長さを求めよ。`, type: 'num', answer: 8 / 3, show: R`\frac{8}{3}`, hint: R`例: 7/5` },
        { label: '(3)', q: R`線分 $\mathrm{DE}$ の長さを求めよ。`, type: 'num', answer: 49 / 12, show: R`\frac{49}{12}`, hint: R`例: 25/6` },
        { label: '(4)', q: R`線分 $\mathrm{AI}$ の長さを求めよ。`, type: 'num', answer: 3 / 2, show: R`\frac{3}{2}`, hint: R`例: 5/3` }
      ],
      solution: [
        { t: '使う 3 つの定理を確認する',
          n: R`この問題では次の 3 つを使います。(ア) **角の二等分線の定理**：$\angle\mathrm{A}$ の二等分線は、辺 $\mathrm{BC}$ を $\mathrm{AB} : \mathrm{AC}$ に内分する。(イ) **円周角の定理**：同じ弧に対する円周角は等しい。(ウ) **方べきの定理**：円の 2 つの弦 $\mathrm{AE},\ \mathrm{BC}$ が円の内部の点 D で交わるとき $\mathrm{AD}\cdot\mathrm{DE} = \mathrm{BD}\cdot\mathrm{DC}$。`,
          easy: R`(ア) 二等分線は「向かい合う辺を、角をはさむ 2 辺の長さの比に分ける」線です。たとえば AB が AC の 2 倍なら、D は BC を $2 : 1$ に分けます。(イ) 円周上の同じ弧に向かって張った角は、どこから見ても同じ大きさです。(ウ) 円の中で 2 つの弦が交わる点では、「一方の弦の 2 つの部分の積」と「他方の弦の 2 つの部分の積」が等しくなります。`,
          lv: 3 },
        { t: R`角の二等分線の定理で $\mathrm{BD}$ を求める（(1)）`,
          m: [R`\mathrm{BD} : \mathrm{DC} = \mathrm{AB} : \mathrm{AC} = 6 : 3 = 2 : 1`,
              R`\mathrm{BD} = \frac{2}{3}\,\mathrm{BC} = \frac{14}{3},\qquad \mathrm{DC} = \frac{1}{3}\,\mathrm{BC} = \frac{7}{3}`],
          n: R`$\mathrm{BC} = 7$ を $2 : 1$ に分けるので、$\mathrm{BD}$ はその $\dfrac{2}{3}$ です。後で方べきの定理に使う積 $\mathrm{BD}\cdot\mathrm{DC} = \dfrac{14}{3}\cdot\dfrac{7}{3} = \dfrac{98}{9}$ も、ここで求めておきます。`,
          easy: R`二等分線の定理は、辺の長さの比 $\mathrm{AB} : \mathrm{AC}$ をそのまま $\mathrm{BD} : \mathrm{DC}$ に写す、と覚えます。$\mathrm{AB} = 6$ は $\mathrm{AC} = 3$ の 2 倍なので、B 側の $\mathrm{BD}$ も C 側の $\mathrm{DC}$ の 2 倍です。全体 $\mathrm{BC} = 7$ のうち $\dfrac{2}{3}$ を B 側が受け持つ、と考えます。`,
          pro: R`この後 $\mathrm{AD}^{2} = \mathrm{AB}\cdot\mathrm{AC} - \mathrm{BD}\cdot\mathrm{DC}$ を使うので、$\mathrm{BD}\cdot\mathrm{DC} = \dfrac{98}{9}$ まで一気に計算しておくと速いです。` },
        { t: R`相似を見つけて $\mathrm{AB}\cdot\mathrm{AC} = \mathrm{AD}\cdot\mathrm{AE}$ を作る`,
          m: [R`\angle\mathrm{BAD} = \angle\mathrm{EAC} \quad (\text{二等分線})`,
              R`\angle\mathrm{ABD} = \angle\mathrm{AEC} \quad (\text{弧 AC に対する円周角})`,
              R`\triangle\mathrm{ABD} \sim \triangle\mathrm{AEC} \;\Rightarrow\; \mathrm{AB} : \mathrm{AE} = \mathrm{AD} : \mathrm{AC} \;\Rightarrow\; \mathrm{AD}\cdot\mathrm{AE} = \mathrm{AB}\cdot\mathrm{AC} = 18`],
          n: R`$\triangle\mathrm{ABD}$ と $\triangle\mathrm{AEC}$ は、2 組の角が等しいので相似です（図の破線 EC を補って見てください）。対応する辺の比 $\mathrm{AB} : \mathrm{AE} = \mathrm{AD} : \mathrm{AC}$ の内項の積と外項の積を比べると $\mathrm{AB}\cdot\mathrm{AC} = \mathrm{AD}\cdot\mathrm{AE}$ となり、右辺は $6 \times 3 = 18$ です。`,
          easy: R`2 つの三角形が相似になるには、「2 組の角がそれぞれ等しい」ことを示せば十分です。1 組目は、AE が $\angle\mathrm{A}$ の二等分線なので $\angle\mathrm{BAD}$ と $\angle\mathrm{EAC}$ が等しい。2 組目は、B と E が弦 AC の同じ側にある円周上の点なので、弧 AC に向かう角 $\angle\mathrm{ABC}$ と $\angle\mathrm{AEC}$ が等しい（円周角の定理）。対応が A→A、B→E、D→C となるので、辺の比は $\mathrm{AB} : \mathrm{AE} = \mathrm{AD} : \mathrm{AC}$ です。` },
        { t: R`方べきの定理と合わせて $\mathrm{AD}$ を求める（(2)）`,
          m: [R`\mathrm{AD}\cdot\mathrm{DE} = \mathrm{BD}\cdot\mathrm{DC} = \frac{98}{9} \quad (\text{方べきの定理})`,
              R`\mathrm{AD}\cdot\mathrm{AE} = \mathrm{AD}(\mathrm{AD} + \mathrm{DE}) = \mathrm{AD}^{2} + \mathrm{AD}\cdot\mathrm{DE}`,
              R`18 = \mathrm{AD}^{2} + \frac{98}{9} \;\Rightarrow\; \mathrm{AD}^{2} = \frac{64}{9} \;\Rightarrow\; \mathrm{AD} = \frac{8}{3}`],
          n: R`$\mathrm{AE} = \mathrm{AD} + \mathrm{DE}$ なので、$\mathrm{AD}\cdot\mathrm{AE}$ を 2 つの積に分けると、片方が方べきの定理により $\dfrac{98}{9}$ と分かっている形 $\mathrm{AD}\cdot\mathrm{DE}$ になります。残りの $\mathrm{AD}^{2}$ が $18 - \dfrac{98}{9} = \dfrac{64}{9}$ と決まり、$\mathrm{AD} > 0$ から $\mathrm{AD} = \dfrac{8}{3}$ です。`,
          easy: R`長さが分かっているのは $\mathrm{AB}\cdot\mathrm{AC} = 18$ と $\mathrm{BD}\cdot\mathrm{DC} = \dfrac{98}{9}$ の 2 つの積だけです。2 つの未知の長さ $\mathrm{AD},\ \mathrm{DE}$ を、この 2 つの式（$\mathrm{AD}\cdot\mathrm{AE} = 18$ と $\mathrm{AD}\cdot\mathrm{DE} = \dfrac{98}{9}$）から求めます。上の式から下の式を引くと、$\mathrm{AD}\cdot(\mathrm{AE} - \mathrm{DE}) = \mathrm{AD}\cdot\mathrm{AD} = \mathrm{AD}^{2}$ が出てきて、$\mathrm{AD}$ だけが残るのがポイントです。`,
          pro: R`$\mathrm{AD}^{2} = \mathrm{AB}\cdot\mathrm{AC} - \mathrm{BD}\cdot\mathrm{DC}$ は、角の二等分線の長さの公式として覚えておく。余弦定理（$\cos\mathrm{B} = \dfrac{19}{21}$）を経由するよりずっと速い。` },
        { t: R`$\mathrm{DE}$ を求める（(3)）`,
          m: R`\mathrm{DE} = \frac{\mathrm{BD}\cdot\mathrm{DC}}{\mathrm{AD}} = \frac{98}{9} \div \frac{8}{3} = \frac{98}{9}\cdot\frac{3}{8} = \frac{49}{12}`,
          n: R`方べきの定理 $\mathrm{AD}\cdot\mathrm{DE} = \dfrac{98}{9}$ を $\mathrm{DE}$ について解きます。確認として $\mathrm{AE} = \dfrac{8}{3} + \dfrac{49}{12} = \dfrac{27}{4}$ を作ると、$\mathrm{AD}\cdot\mathrm{AE} = \dfrac{8}{3}\cdot\dfrac{27}{4} = 18 = \mathrm{AB}\cdot\mathrm{AC}$ となり、先の相似から出した式と一致します。`,
          easy: R`分数の割り算は、割る数の逆数をかけます。$\dfrac{98}{9} \div \dfrac{8}{3} = \dfrac{98}{9} \times \dfrac{3}{8} = \dfrac{98 \times 3}{9 \times 8} = \dfrac{294}{72}$ で、$6$ で約分して $\dfrac{49}{12}$ です。`,
          lv: 2 },
        { t: R`内心 I の位置から $\mathrm{AI}$ を求める（(4)）`,
          m: [R`\triangle\mathrm{ABD} \text{ で } \mathrm{BI} \text{ は } \angle\mathrm{B} \text{ の二等分線} \;\Rightarrow\; \mathrm{AI} : \mathrm{ID} = \mathrm{BA} : \mathrm{BD} = 6 : \frac{14}{3} = 9 : 7`,
              R`\mathrm{AI} = \frac{9}{9 + 7}\,\mathrm{AD} = \frac{9}{16}\cdot\frac{8}{3} = \frac{3}{2}`],
          n: R`内心は 3 つの角の二等分線の交点なので、I は $\angle\mathrm{A}$ の二等分線 AD 上にあり、同時に $\angle\mathrm{B}$ の二等分線 BI 上にもあります。BI は $\triangle\mathrm{ABD}$ の頂点 B における角の二等分線ですから、ここでも角の二等分線の定理が使えて、$\mathrm{AI} : \mathrm{ID} = \mathrm{BA} : \mathrm{BD}$ です。`,
          easy: R`内心 I は「3 つの角の二等分線が集まる点」で、内接円の中心です。AD は $\angle\mathrm{A}$ の二等分線で、I はその上にあります。さらに B から I へ引いた線（図の破線）は $\angle\mathrm{B}$ の二等分線です。$\triangle\mathrm{ABD}$ の中で「角 B の二等分線が、向かい合う辺 AD を I で分ける」と見れば、(1) と同じ定理で $\mathrm{AI} : \mathrm{ID}$ が決まります。`,
          pro: R`内心は二等分線 AD を $\mathrm{AI} : \mathrm{ID} = (\mathrm{AB} + \mathrm{AC}) : \mathrm{BC}$ に内分する（公式）。ここでは $(6 + 3) : 7 = 9 : 7$ で、上の結果と一致します。` }
      ],
      tags: ['角の二等分線', '方べきの定理', '内心', '円周角', '相似']
    },

    /* ---------- 式と証明 ---------- */
    {
      id: 'm-mid-proof-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-proof',
      title: '分数式の計算と不等式の最小値',
      source: { univ: 'オリジナル' },
      time: 9,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\dfrac{1}{x(x+1)} + \dfrac{1}{(x+1)(x+2)} + \dfrac{1}{(x+2)(x+3)}$ を 1 つの分数式にまとめよ。`, type: 'expr', answer: '3/(x*(x+3))', vars: ['x'], show: R`\frac{3}{x(x+3)}`, hint: R`例: (x+1)/(x*(x+2))` },
        { label: '(2)', q: R`$a + b + c = 0$、$abc \ne 0$ のとき、$\dfrac{a^{2}}{bc} + \dfrac{b^{2}}{ca} + \dfrac{c^{2}}{ab}$ の値を求めよ。`, type: 'num', answer: 3 },
        { label: '(3)', q: R`実数 $x,\ y$ が $2x + 3y = 26$ を満たすとき、$x^{2} + y^{2}$ の最小値を求めよ。`, type: 'num', answer: 52 },
        { label: '(4)', q: R`(3) で $x^{2} + y^{2}$ が最小になるときの $x$ の値を求めよ。`, type: 'num', answer: 4 }
      ],
      solution: [
        { t: '部分分数に分けて項を打ち消す（(1)）',
          m: [R`\frac{1}{k(k+1)} = \frac{1}{k} - \frac{1}{k+1}`,
              R`\left(\frac{1}{x} - \frac{1}{x+1}\right) + \left(\frac{1}{x+1} - \frac{1}{x+2}\right) + \left(\frac{1}{x+2} - \frac{1}{x+3}\right)`,
              R`= \frac{1}{x} - \frac{1}{x+3} = \frac{(x+3) - x}{x(x+3)} = \frac{3}{x(x+3)}`],
          n: R`3 つの分母はどれも「連続する 2 つの式の積」なので、$\dfrac{1}{k(k+1)} = \dfrac{1}{k} - \dfrac{1}{k+1}$（右辺を通分すると $\dfrac{(k+1) - k}{k(k+1)}$）の形に直します。すると隣り合う項が次々に打ち消し合い、最初と最後の項だけが残ります。`,
          easy: R`3 つの分数をそのまま通分すると、分母が $x(x+1)(x+2)(x+3)$ になって計算が大変です。そこで 1 つ 1 つの分数を「差」の形に分けます。たとえば $\dfrac{1}{x(x+1)} = \dfrac{1}{x} - \dfrac{1}{x+1}$ です。並べると $\dfrac{1}{x+1}$ は「$-$」と「$+$」で 1 回ずつ出てきて消え、$\dfrac{1}{x+2}$ も同様に消えます。残るのは $\dfrac{1}{x} - \dfrac{1}{x+3}$ だけです。`,
          pro: R`分母が「差が一定の式」の積になっている和は、$\dfrac{1}{A\,B} = \dfrac{1}{B - A}\left(\dfrac{1}{A} - \dfrac{1}{B}\right)$ で分解して打ち消す（数列の和 $\sum \dfrac{1}{k(k+1)}$ と同じ型）。` },
        { t: '条件式を使って式を整理する（(2)）',
          m: [R`\frac{a^{2}}{bc} + \frac{b^{2}}{ca} + \frac{c^{2}}{ab} = \frac{a^{3} + b^{3} + c^{3}}{abc}`,
              R`a^{3} + b^{3} + c^{3} - 3abc = (a+b+c)(a^{2} + b^{2} + c^{2} - ab - bc - ca) = 0`,
              R`a^{3} + b^{3} + c^{3} = 3abc \;\Rightarrow\; \frac{3abc}{abc} = 3`],
          n: R`3 つの分数を $abc$ で通分すると、分子は $a \cdot a^{2} + b \cdot b^{2} + c \cdot c^{2} = a^{3} + b^{3} + c^{3}$ です。条件 $a + b + c = 0$ があるので、因数分解の公式 $a^{3} + b^{3} + c^{3} - 3abc = (a+b+c)(a^{2} + b^{2} + c^{2} - ab - bc - ca)$ の右辺が $0$ になり、$a^{3} + b^{3} + c^{3} = 3abc$ が成り立ちます。`,
          easy: R`分母が $bc,\ ca,\ ab$ とバラバラなので、共通の分母 $abc$ に通分します。たとえば $\dfrac{a^{2}}{bc} = \dfrac{a^{2} \cdot a}{bc \cdot a} = \dfrac{a^{3}}{abc}$ です。条件「和が $0$」が使えるのは、$a^{3} + b^{3} + c^{3} - 3abc$ という式を $(a+b+c)$ をくくり出す形に因数分解できるからです。和が $0$ なら全体が $0$ になります。`,
          pro: R`「$a+b+c=0$ なら $a^{3}+b^{3}+c^{3} = 3abc$」は暗記しておく。$c = -a-b$ を代入して展開しても確かめられます。` },
        { t: '平方の和の最小値（(3)）',
          m: [R`(2^{2} + 3^{2})(x^{2} + y^{2}) - (2x + 3y)^{2} = 13x^{2} + 13y^{2} - 4x^{2} - 12xy - 9y^{2} = (3x - 2y)^{2} \ge 0`,
              R`13(x^{2} + y^{2}) \ge (2x + 3y)^{2} = 26^{2} = 676 \;\Rightarrow\; x^{2} + y^{2} \ge 52`],
          n: R`$x^{2} + y^{2}$ に、条件で値が決まっている $2x + 3y$ を結びつけるために、「$(2^{2} + 3^{2})(x^{2} + y^{2})$ と $(2x + 3y)^{2}$ の差」を計算します。差が $(3x - 2y)^{2}$ と平方の形になるので、$0$ 以上であることが分かり、$x^{2} + y^{2} \ge \dfrac{676}{13} = 52$ が得られます。`,
          easy: R`$x^{2} + y^{2}$ は、原点から点 $(x,\ y)$ までの距離の 2 乗です。点 $(x,\ y)$ は直線 $2x + 3y = 26$ の上を動くので、この直線上でいちばん原点に近い点を探す問題とも読めます。式変形では、$13(x^{2} + y^{2}) - (2x + 3y)^{2}$ を展開して整理すると $9x^{2} - 12xy + 4y^{2} = (3x - 2y)^{2}$ となり、平方（$0$ 以上）の形になります。`,
          pro: R`$(a^{2} + b^{2})(x^{2} + y^{2}) \ge (ax + by)^{2}$（コーシー・シュワルツの不等式）の型。等号は $ay = bx$ のとき。原点と直線の距離の公式で $\dfrac{26^{2}}{13} = 52$ としても同じです。` },
        { t: '等号が成り立つときの $x$（(4)）',
          m: [R`3x - 2y = 0 \;\Rightarrow\; y = \frac{3}{2}x`,
              R`2x + 3y = 2x + \frac{9}{2}x = \frac{13}{2}x = 26 \;\Rightarrow\; x = 4,\ \ y = 6`,
              R`x^{2} + y^{2} = 16 + 36 = 52 \;(\text{確認})`],
          n: R`最小値 $52$ をとるのは、不等式の等号が成り立つとき、つまり $(3x - 2y)^{2} = 0$ のときです。$y = \dfrac{3}{2}x$ を条件 $2x + 3y = 26$ に代入して $x = 4$ を得ます。このとき $y = 6$ で、$x^{2} + y^{2} = 52$ となり、最小値に実際に到達することが確認できます。`,
          easy: R`最小値を答えるときは、「その値に本当に届くのか」を確かめる必要があります。不等式 $13(x^{2} + y^{2}) \ge 676$ は、右辺と同じ値になる（等号）ときに限って最小値です。等号が成り立つのは $(3x - 2y)^{2} = 0$ のとき。この式と、もとの条件 $2x + 3y = 26$ を連立すれば $(x,\ y) = (4,\ 6)$ が決まります。`,
          lv: 2 }
      ],
      tags: ['分数式', '部分分数', '条件つき等式', 'コーシー・シュワルツ', '最小値']
    },

    /* ---------- 複素数と方程式 ---------- */
    {
      id: 'm-mid-complex-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-complex',
      title: '実数解をもつ複素数係数の2次方程式',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`$k$ を実数の定数とし、$x$ の 2 次方程式 $x^{2} + (2 + i)x + (k + 3i) = 0$ ……① を考える。ただし $i$ は虚数単位とする。①が実数解 $\alpha$ をもつとして、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\alpha$ の値を求めよ。`, type: 'num', answer: -3 },
        { label: '(2)', q: R`$k$ の値を求めよ。`, type: 'num', answer: -3 },
        { label: '(3)', q: R`①のもう 1 つの解 $\beta$ の実部を求めよ。`, type: 'num', answer: 1 },
        { label: '(4)', q: R`①のもう 1 つの解 $\beta$ の虚部を求めよ。`, type: 'num', answer: -1 }
      ],
      solution: [
        { t: '実数解を代入して、実部と虚部に分ける',
          m: [R`\alpha^{2} + (2 + i)\alpha + k + 3i = 0`,
              R`(\alpha^{2} + 2\alpha + k) + (\alpha + 3)\,i = 0`,
              R`\alpha^{2} + 2\alpha + k = 0 \quad\text{かつ}\quad \alpha + 3 = 0`],
          n: R`$\alpha,\ k$ は実数なので、$\alpha^{2} + 2\alpha + k$ と $\alpha + 3$ はどちらも実数です。実数 $p,\ q$ について $p + qi = 0$ となるのは $p = 0$ かつ $q = 0$ のときだけなので、実部と虚部をそれぞれ $0$ とおきます。`,
          easy: R`複素数は「実部 $+$ 虚部 $\times\, i$」の形で、$i$ は実数とは別の「向き」を表すものと考えられます。たとえば $3 + 2i$ は $0$ ではありません。$p + qi$ が $0$ になるには、$i$ のつかない部分 $p$ と、$i$ のつく部分 $q$ が、それぞれ別々に $0$ になる必要があります。そこで、$i$ のつく項と $i$ のつかない項に整理し直します。`,
          pro: R`係数が虚数の 2 次方程式では、判別式 $D \ge 0$ は「実数解をもつ」条件になりません（$D$ が実数とは限らないため）。実数解を代入して実部・虚部に分けるのが定石です。` },
        { t: R`$\alpha$ と $k$ を求める（(1)(2)）`,
          m: [R`\alpha + 3 = 0 \;\Rightarrow\; \alpha = -3`,
              R`\alpha^{2} + 2\alpha + k = 9 - 6 + k = 0 \;\Rightarrow\; k = -3`],
          n: R`虚部の式から $\alpha = -3$ がすぐに決まります。これを実部の式に代入すると $k = -3$ です。①が実数解をもつ実数 $k$ は、この 1 つだけです。`,
          easy: R`$\alpha + 3 = 0$ は 1 次方程式なので $\alpha = -3$ とすぐに解けます。その値を $\alpha^{2} + 2\alpha + k = 0$ に入れると、$(-3)^{2} + 2 \times (-3) + k = 9 - 6 + k = 3 + k$ なので、$k = -3$ です。` },
        { t: '解と係数の関係でもう 1 つの解を求める（(3)(4)）',
          m: [R`\alpha + \beta = -(2 + i) \;\Rightarrow\; \beta = -2 - i - (-3) = 1 - i`,
              R`\text{検算: } \alpha\beta = -3(1 - i) = -3 + 3i = k + 3i`],
          n: R`2 次方程式 $x^{2} + px + q = 0$ の 2 つの解 $\alpha,\ \beta$ について $\alpha + \beta = -p,\ \alpha\beta = q$ が成り立ちます。これは係数が虚数でも同じです。ここでは $p = 2 + i$ なので $\alpha + \beta = -2 - i$ となり、$\beta = 1 - i$ を得ます。実部は $1$、虚部は $-1$ です。積 $\alpha\beta = -3 + 3i$ が定数項 $k + 3i = -3 + 3i$ と一致することも確認できます。`,
          easy: R`2 次方程式の 2 つの解の「和」は $x$ の係数の符号を変えたもの、「積」は定数項です。この関係は、係数が実数でも複素数でも成り立ちます。①の $x$ の係数は $2 + i$ なので、和は $-(2 + i)$ です。そこから $\alpha = -3$ を引くと、もう 1 つの解 $\beta = 1 - i$ が決まります。実部は $i$ のつかない $1$、虚部は $i$ の係数 $-1$ です。`,
          pro: R`「$\beta$ は $\alpha$ の共役複素数」とはなりません（共役の関係が使えるのは係数が実数のときだけ）。係数が虚数の問題でつまずきやすい点です。` },
        { t: '$k = -3$ のとき実際に解になることを確認する',
          m: R`(-3)^{2} + (2 + i)(-3) + (-3 + 3i) = 9 - 6 - 3i - 3 + 3i = 0`,
          n: R`実部・虚部が $0$ という条件は必要条件として導いたものなので、$\alpha = -3,\ k = -3$ のとき、①が本当に成り立つかを代入して確かめておきます。確かに $0$ になるので、問題の条件を満たします。`,
          easy: R`「こうなるはずだ」と求めた値は、もとの式に代入して確かめると安心です。$-3$ を $x$ に代入すると、$i$ のつかない部分は $9 - 6 - 3 = 0$、$i$ のつく部分は $-3i + 3i = 0$ となり、どちらも消えます。`,
          lv: 2 }
      ],
      tags: ['複素数', '実数解', '解と係数の関係', '実部・虚部']
    },

    /* ---------- 図形と方程式 ---------- */
    {
      id: 'm-mid-coord-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-coord',
      title: '連立不等式の表す領域と最大・最小',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`連立不等式 $x \ge 0,\ y \ge 0,\ x + 2y \le 10,\ 3x + 2y \le 18$ の表す領域を $D$ とする。点 $(x,\ y)$ が $D$ を動くとき、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`領域 $D$ の面積を求めよ。`, type: 'num', answer: 19 },
        { label: '(2)', q: R`$x + y$ の最大値を求めよ。`, type: 'num', answer: 7 },
        { label: '(3)', q: R`$a$ を定数とする。$ax + y$ が点 $(4,\ 3)$ でのみ最大値をとるような $a$ の範囲を $m < a < M$ とするとき、$m$ の値を求めよ。`, type: 'num', answer: 1 / 2, show: R`\frac{1}{2}`, hint: R`例: 1/3` },
        { label: '(4)', q: R`(3) の $M$ の値を求めよ。`, type: 'num', answer: 3 / 2, show: R`\frac{3}{2}`, hint: R`例: 5/4` }
      ],
      solution: [
        { t: '領域 $D$ をかく',
          m: [R`x + 2y = 10,\quad 3x + 2y = 18 \;\Rightarrow\; 2x = 8 \;\Rightarrow\; (x,\ y) = (4,\ 3)`,
              R`\text{頂点: } \mathrm{O}(0,\ 0),\ \mathrm{P}(6,\ 0),\ \mathrm{Q}(4,\ 3),\ \mathrm{R}(0,\ 5)`],
          n: R`$x \ge 0,\ y \ge 0$ は第 1 象限、$x + 2y \le 10$ は直線 $y = -\dfrac{1}{2}x + 5$ の下側、$3x + 2y \le 18$ は直線 $y = -\dfrac{3}{2}x + 9$ の下側を表します。2 直線は $(4,\ 3)$ で交わり、$D$ は図の 4 つの頂点をもつ四角形になります。`,
          easy: R`不等式の表す領域は、まず境界の直線を引き、その上側か下側かを調べてぬります。$y$ について解いた形 $y \le (\text{式})$ なら直線の下側、$y \ge (\text{式})$ なら上側です。3 本の条件が重なる部分が $D$ で、2 直線 $x + 2y = 10$、$3x + 2y = 18$ の交点 $(4,\ 3)$ が領域の「角」になります。`,
          pro: R`領域の頂点は「境界線どうしの交点」。次の最大・最小の問題では、この頂点の値だけを調べれば足ります。`,
          fig: figRegion() },
        { t: '領域 $D$ の面積（(1)）',
          m: [R`\triangle\mathrm{OPQ} = \frac{1}{2} \cdot 6 \cdot 3 = 9`,
              R`\triangle\mathrm{OQR} = \frac{1}{2} \cdot 5 \cdot 4 = 10`,
              R`9 + 10 = 19`],
          n: R`四角形 OPQR を対角線 OQ で 2 つの三角形に分けます。$\triangle\mathrm{OPQ}$ は底辺 $\mathrm{OP} = 6$、高さ（Q の $y$ 座標）$3$、$\triangle\mathrm{OQR}$ は底辺 $\mathrm{OR} = 5$（$y$ 軸上）、高さ（Q の $x$ 座標）$4$ です。`,
          easy: R`座標の分かっている四角形は、三角形に分けて面積を足すのが基本です。底辺が軸の上にのる三角形を選ぶと、高さが頂点の座標そのものになって計算しやすくなります。`,
          lv: 2 },
        { t: '$x + y$ の最大値（(2)）',
          m: [R`x + y = k \;\Leftrightarrow\; y = -x + k`,
              R`\mathrm{O}: 0,\quad \mathrm{P}: 6,\quad \mathrm{Q}: 4 + 3 = 7,\quad \mathrm{R}: 5`,
              R`\text{最大値は } 7 \quad (\text{点 Q})`],
          n: R`$x + y = k$ とおくと $y = -x + k$ で、傾き $-1$ の直線の $y$ 切片が $k$ です。この直線を領域 $D$ と共有点をもつ範囲で動かすとき、$k$ が最大になるのは領域の端である頂点を通るときです。各頂点での値を比べると、Q $(4,\ 3)$ のとき最大で $7$ です。`,
          easy: R`$x + y = k$ をグラフにすると、傾き $-1$ の斜めの直線で、$k$ が大きいほど上にずれます。この直線を下から上へ動かしていき、領域 $D$ に最後に触れる点が「最大値をとる点」です。それは領域の角（頂点）のどれかになります。全部の頂点で $x + y$ を計算して比べるのが確実です。`,
          pro: R`1 次式の最大・最小（線形計画法）は、領域の頂点だけを調べれば十分。頂点の値を表にしてすぐに比べる。` },
        { t: '$ax + y$ が点 Q でのみ最大となる条件（(3)(4)）',
          m: [R`\mathrm{O}: 0,\quad \mathrm{P}: 6a,\quad \mathrm{Q}: 4a + 3,\quad \mathrm{R}: 5`,
              R`4a + 3 > 6a \;\Rightarrow\; a < \frac{3}{2}`,
              R`4a + 3 > 5 \;\Rightarrow\; a > \frac{1}{2}`,
              R`4a + 3 > 0 \;\Rightarrow\; a > -\frac{3}{4}`,
              R`\frac{1}{2} < a < \frac{3}{2} \quad (m = \frac{1}{2},\ M = \frac{3}{2})`],
          n: R`各頂点での $ax + y$ の値を出し、Q での値 $4a + 3$ が他の 3 点の値すべてより大きい（「でのみ」なので等号は含まない）条件を求めます。P との比較から $a < \dfrac{3}{2}$、R との比較から $a > \dfrac{1}{2}$、O との比較から $a > -\dfrac{3}{4}$ で、共通部分が $\dfrac{1}{2} < a < \dfrac{3}{2}$ です。`,
          easy: R`$ax + y = k$ は $y = -ax + k$ と直すと、傾き $-a$ の直線です。この直線を下から平行移動して領域に触れた最後の点が最大になる点で、傾きが辺 $\mathrm{QR}$ の傾き $-\dfrac{1}{2}$ より急で、辺 $\mathrm{PQ}$ の傾き $-\dfrac{3}{2}$ よりゆるやかなとき、触れるのは Q だけです。つまり $-\dfrac{3}{2} < -a < -\dfrac{1}{2}$、すなわち $\dfrac{1}{2} < a < \dfrac{3}{2}$ です。端の値のとき（$a = \dfrac{1}{2}$ なら辺 $\mathrm{QR}$ 全体、$a = \dfrac{3}{2}$ なら辺 $\mathrm{PQ}$ 全体で同時に最大）は、Q だけではなくなるので除きます。`,
          pro: R`「傾きが 2 辺の傾きの間にあれば頂点で最大」と図で即答できる。上限・下限の値は、境界線の傾きの符号を変えたものです。` }
      ],
      tags: ['領域', '線形計画法', '最大・最小', '面積']
    },

    /* ---------- 三角関数 ---------- */
    {
      id: 'm-mid-trig2-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-trig2',
      title: '加法定理・半角と2倍角の方程式',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`$\dfrac{\pi}{2} < \alpha < \pi$、$0 < \beta < \dfrac{\pi}{2}$ で、$\sin\alpha = \dfrac{4}{5}$、$\cos\beta = \dfrac{5}{13}$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\sin(\alpha + \beta)$ の値を求めよ。`, type: 'num', answer: -16 / 65, show: R`-\frac{16}{65}`, hint: R`例: -7/25` },
        { label: '(2)', q: R`$\tan(\alpha + \beta)$ の値を求めよ。`, type: 'num', answer: 16 / 63, show: R`\frac{16}{63}`, hint: R`例: 8/15` },
        { label: '(3)', q: R`$\sin\dfrac{\alpha}{2}$ の値を求めよ。`, type: 'num', answer: 2 / S5, show: R`\frac{2\sqrt{5}}{5}`, hint: R`例: 3√10/10 や 3/sqrt(10)` },
        { label: '(4)', q: R`$\alpha,\ \beta$ とは別に、$0 \le \theta < 2\pi$ のとき、方程式 $\cos 2\theta + 3\sin\theta - 2 = 0$ の解をすべて足した値を求めよ。`, type: 'num', answer: 3 * PI / 2, show: R`\frac{3}{2}\pi`, hint: R`例: 5π/3` }
      ],
      solution: [
        { t: R`$\cos\alpha$ と $\sin\beta$ を求める`,
          m: [R`\cos\alpha = -\sqrt{1 - \sin^{2}\alpha} = -\sqrt{1 - \frac{16}{25}} = -\frac{3}{5}`,
              R`\sin\beta = \sqrt{1 - \cos^{2}\beta} = \sqrt{1 - \frac{25}{169}} = \frac{12}{13}`],
          n: R`加法定理には $\sin,\ \cos$ の両方が必要なので、$\sin^{2}\theta + \cos^{2}\theta = 1$ で足りない方を補います。$\alpha$ は第 2 象限の角なので $\cos\alpha < 0$、$\beta$ は第 1 象限の角なので $\sin\beta > 0$ であり、符号に注意して平方根をとります。`,
          easy: R`単位円で考えると、第 2 象限（左上）の角は「$x$ 座標 $= \cos$ が負、$y$ 座標 $= \sin$ が正」、第 1 象限（右上）の角は「$\cos,\ \sin$ ともに正」です。$\sin\alpha = \dfrac{4}{5}$ は 3 辺が $3 : 4 : 5$ の直角三角形の比、$\cos\beta = \dfrac{5}{13}$ は $5 : 12 : 13$ の比に対応しているので、残りの値は $\cos\alpha = -\dfrac{3}{5}$、$\sin\beta = \dfrac{12}{13}$ とすぐ分かります。`,
          pro: R`$3:4:5$、$5:12:13$ などの直角三角形の比は暗算で。符号は角の象限で決める（平方根をとったら必ず確認）。` },
        { t: R`加法定理で $\sin(\alpha + \beta)$（(1)）`,
          m: [R`\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta`,
              R`= \frac{4}{5}\cdot\frac{5}{13} + \left(-\frac{3}{5}\right)\cdot\frac{12}{13}`,
              R`= \frac{20 - 36}{65} = -\frac{16}{65}`],
          n: R`加法定理 $\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$ に、前のステップで求めた値を代入します。分母は $5 \times 13 = 65$ にそろいます。`,
          easy: R`加法定理は、「2 つの角を足した角の $\sin$」を、それぞれの角の $\sin$ と $\cos$ の組み合わせで表す公式です。$\sin$ の加法定理は「$\sin$ $\cos$ $+$ $\cos$ $\sin$」と覚えます（符号は $+$）。代入するときは、$\cos\alpha = -\dfrac{3}{5}$ のマイナス符号を落とさないようにします。` },
        { t: R`$\tan(\alpha + \beta)$（(2)）`,
          m: [R`\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta = -\frac{15}{65} - \frac{48}{65} = -\frac{63}{65}`,
              R`\tan(\alpha + \beta) = \frac{\sin(\alpha + \beta)}{\cos(\alpha + \beta)} = \frac{-16}{-63} = \frac{16}{63}`],
          n: R`$\cos$ の加法定理 $\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$ で $\cos(\alpha + \beta)$ を求め、$\tan = \dfrac{\sin}{\cos}$ で割ります。$\sin(\alpha + \beta),\ \cos(\alpha + \beta)$ がともに負なので、$\alpha + \beta$ は第 3 象限の角であり、$\tan$ は正になります。`,
          easy: R`$\tan$ は $\dfrac{\sin}{\cos}$ なので、まず $\cos(\alpha + \beta)$ が必要です。$\cos$ の加法定理は「$\cos$ $\cos$ $-$ $\sin$ $\sin$」と、符号が $-$ になる点が $\sin$ と違います。$\sin,\ \cos$ がどちらも負だと、割り算で負どうしが約分されて、$\tan$ は正の値になります。`,
          pro: R`$\tan\alpha = -\dfrac{4}{3},\ \tan\beta = \dfrac{12}{5}$ から $\tan(\alpha + \beta) = \dfrac{\tan\alpha + \tan\beta}{1 - \tan\alpha\tan\beta} = \dfrac{16/15}{21/5} = \dfrac{16}{63}$ と検算できる。` },
        { t: R`半角の公式で $\sin\dfrac{\alpha}{2}$（(3)）`,
          m: [R`\sin^{2}\frac{\alpha}{2} = \frac{1 - \cos\alpha}{2} = \frac{1 + \frac{3}{5}}{2} = \frac{4}{5}`,
              R`\frac{\pi}{4} < \frac{\alpha}{2} < \frac{\pi}{2} \;\Rightarrow\; \sin\frac{\alpha}{2} > 0`,
              R`\sin\frac{\alpha}{2} = \sqrt{\frac{4}{5}} = \frac{2}{\sqrt{5}} = \frac{2\sqrt{5}}{5}`],
          n: R`半角の公式 $\sin^{2}\dfrac{\theta}{2} = \dfrac{1 - \cos\theta}{2}$ を使います（2 倍角の公式 $\cos\theta = 1 - 2\sin^{2}\dfrac{\theta}{2}$ を変形したものです）。平方根をとるときの符号は、$\dfrac{\alpha}{2}$ が第 1 象限の角であることから $\sin\dfrac{\alpha}{2} > 0$ と決まります。`,
          easy: R`角が半分になると、象限が変わります。$\dfrac{\pi}{2} < \alpha < \pi$ の半分は $\dfrac{\pi}{4} < \dfrac{\alpha}{2} < \dfrac{\pi}{2}$ で、第 1 象限なので $\sin$ は正です。$\dfrac{2}{\sqrt{5}}$ は分母を有理化して $\dfrac{2\sqrt{5}}{5}$ とも書けます（どちらの形で入力しても正解になります）。`,
          pro: R`半角の公式は「2 乗の形」で出てくるので、符号は半角の象限で決める。$\tan\dfrac{\alpha}{2} = \dfrac{\sin\alpha}{1 + \cos\alpha} = 2$ なども覚えておくと検算に便利。` },
        { t: R`2 倍角の公式で $\sin\theta$ の 2 次方程式にする（(4)）`,
          m: [R`\cos 2\theta = 1 - 2\sin^{2}\theta`,
              R`1 - 2\sin^{2}\theta + 3\sin\theta - 2 = 0 \;\Rightarrow\; 2\sin^{2}\theta - 3\sin\theta + 1 = 0`,
              R`(2\sin\theta - 1)(\sin\theta - 1) = 0 \;\Rightarrow\; \sin\theta = \frac{1}{2},\ 1`,
              R`\theta = \frac{\pi}{6},\ \frac{5\pi}{6}\ \ (\sin\theta = \tfrac{1}{2}),\qquad \theta = \frac{\pi}{2}\ \ (\sin\theta = 1)`,
              R`\frac{\pi}{6} + \frac{5\pi}{6} + \frac{\pi}{2} = \frac{3}{2}\pi`],
          n: R`$\cos 2\theta$ と $\sin\theta$ が混ざっているので、2 倍角の公式 $\cos 2\theta = 1 - 2\sin^{2}\theta$ で $\sin\theta$ だけの式に統一し、$\sin\theta = t$ の 2 次方程式として解きます。$-1 \le t \le 1$ を確認し、$0 \le \theta < 2\pi$ の範囲で $\theta$ を求めます。$\sin\theta = 1$ の解は $\theta = \dfrac{\pi}{2}$ の 1 個だけです。`,
          easy: R`$\cos 2\theta$ は $\cos^{2}\theta - \sin^{2}\theta,\ 2\cos^{2}\theta - 1,\ 1 - 2\sin^{2}\theta$ の 3 通りに書き換えられます。この方程式には $\sin\theta$ が含まれるので、$\sin\theta$ だけの形 $1 - 2\sin^{2}\theta$ を選ぶのがコツです。$\sin\theta = t$ とおくと $2t^{2} - 3t + 1 = 0$ で、$(2t - 1)(t - 1) = 0$ から $t = \dfrac{1}{2},\ 1$ です。$\sin\theta = \dfrac{1}{2}$ は単位円上で高さ $\dfrac{1}{2}$ の点が 2 つ（$\dfrac{\pi}{6},\ \dfrac{5\pi}{6}$）、$\sin\theta = 1$ は一番上の点 1 つ（$\dfrac{\pi}{2}$）です。`,
          pro: R`$\cos 2\theta$ は混在する関数に合わせて 3 通りの形から選ぶ。解の個数は「$\sin\theta = k$ は $-1<k<1$ なら 2 個、$k = \pm1$ なら 1 個」と数える（$\sin\theta = 1$ の解を 2 個と数えない）。` }
      ],
      tags: ['加法定理', '半角の公式', '2倍角の公式', '三角方程式']
    },

    /* ---------- 指数・対数関数 ---------- */
    {
      id: 'm-mid-explog-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-explog',
      title: '対数の2次関数と最大・最小',
      source: { univ: 'オリジナル' },
      time: 9,
      body: R`関数 $f(x) = \left(\log_{2}\dfrac{x}{2}\right)\left(\log_{2}4x\right)$ $\left(\dfrac{1}{4} \le x \le 8\right)$ について、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`方程式 $f(x) = 0$ の解のうち、大きい方を求めよ。`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$f(x)$ の最小値を求めよ。`, type: 'num', answer: -9 / 4, show: R`-\frac{9}{4}`, hint: R`例: -7/3` },
        { label: '(3)', q: R`$f(x)$ が最小になるときの $x$ の値を求めよ。`, type: 'num', answer: S2 / 2, show: R`\frac{\sqrt{2}}{2}`, hint: R`例: √3/3 や 1/√3` },
        { label: '(4)', q: R`$f(x)$ の最大値を求めよ。`, type: 'num', answer: 10 }
      ],
      solution: [
        { t: R`$t = \log_{2}x$ とおいて、$t$ の 2 次関数にする`,
          m: [R`t = \log_{2}x \quad\left(\frac{1}{4} \le x \le 8 \;\Rightarrow\; -2 \le t \le 3\right)`,
              R`\log_{2}\frac{x}{2} = \log_{2}x - \log_{2}2 = t - 1,\qquad \log_{2}4x = \log_{2}4 + \log_{2}x = t + 2`,
              R`f(x) = (t - 1)(t + 2) = t^{2} + t - 2 = \left(t + \frac{1}{2}\right)^{2} - \frac{9}{4}`],
          n: R`対数の性質 $\log_{a}\dfrac{M}{N} = \log_{a}M - \log_{a}N$、$\log_{a}MN = \log_{a}M + \log_{a}N$ で、どちらの対数も $\log_{2}x$ だけで表せます。底 $2$ は $1$ より大きいので $\log_{2}x$ は増加関数で、$x$ の範囲の両端 $\dfrac{1}{4},\ 8$ から $t$ の範囲は $\log_{2}\dfrac{1}{4} = -2$ 以上 $\log_{2}8 = 3$ 以下です。`,
          easy: R`$f(x)$ には $\log_{2}x$ が 2 回出てくるので、$\log_{2}x$ を 1 つの文字 $t$ で置き換えると、$t$ の 2 次式になって扱いやすくなります。このとき「$t$ がどんな範囲を動くか」を必ず調べます。$x$ が $\dfrac{1}{4}$ から $8$ まで動くとき、$2^{-2} = \dfrac{1}{4}$、$2^{3} = 8$ なので、$t = \log_{2}x$ は $-2$ から $3$ まで動きます。`,
          pro: R`対数の 2 次式は $t = \log x$ の置き換えが定石。置き換えたら「$t$ の範囲」を最初に確認する（$2^{x} = t$ の置き換えなら $t > 0$）。` },
        { t: '$f(x) = 0$ の解（(1)）',
          m: [R`(t - 1)(t + 2) = 0 \;\Rightarrow\; t = 1,\ -2`,
              R`x = 2^{1} = 2,\quad x = 2^{-2} = \frac{1}{4}`],
          n: R`$f(x) = 0$ は $t = 1$ または $t = -2$ のときです。$t = \log_{2}x$ から $x = 2^{t}$ なので、$x = 2$ と $x = \dfrac{1}{4}$ です（どちらも範囲 $\dfrac{1}{4} \le x \le 8$ に入っています）。大きい方は $2$ です。`,
          easy: R`$t = \log_{2}x$ は「$2$ を何乗すると $x$ になるか」を表すので、逆に $x = 2^{t}$ です。$t = 1$ なら $x = 2^{1} = 2$、$t = -2$ なら $x = 2^{-2} = \dfrac{1}{4}$ です。` },
        { t: '最小値とそのときの $x$（(2)(3)）',
          m: [R`f = \left(t + \frac{1}{2}\right)^{2} - \frac{9}{4}`,
              R`t = -\frac{1}{2} \;\; (-2 \le t \le 3 \text{ に含まれる}) \text{ で最小値 } -\frac{9}{4}`,
              R`x = 2^{-\frac{1}{2}} = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}`],
          n: R`$t$ の 2 次関数 $\left(t + \dfrac{1}{2}\right)^{2} - \dfrac{9}{4}$ は、軸（頂点）$t = -\dfrac{1}{2}$ で最小になります。軸は範囲 $-2 \le t \le 3$ の内部にあるので、最小値は $-\dfrac{9}{4}$ です。そのときの $x$ は $x = 2^{-\frac{1}{2}} = \dfrac{\sqrt{2}}{2}$ です。`,
          easy: R`放物線の頂点が範囲の中に入っているとき、最小値は頂点でとります。頂点の $t$ 座標は $-\dfrac{1}{2}$ で、これは $-2 \le t \le 3$ の中にあります。$x$ に戻すときは $x = 2^{t}$ を使い、指数が分数の $2^{-\frac{1}{2}} = \dfrac{1}{2^{\frac{1}{2}}} = \dfrac{1}{\sqrt{2}}$ とします。`,
          pro: R`区間つき 2 次関数の最大・最小は、「軸が区間に入るか」で場合分けする。ここでは入るので頂点で最小、最大は軸から遠い端点です。` },
        { t: '最大値（(4)）',
          m: [R`t = -2:\ f = 0,\qquad t = 3:\ f = 3^{2} + 3 - 2 = 10`,
              R`\text{最大値は } 10 \quad (x = 2^{3} = 8)`],
          n: R`区間 $-2 \le t \le 3$ で、軸 $t = -\dfrac{1}{2}$ から遠い方の端点 $t = 3$ で最大になります。軸からの距離は $t = -2$ が $\dfrac{3}{2}$、$t = 3$ が $\dfrac{7}{2}$ で、$t = 3$ の方が遠いからです。$f = 10$ で、そのとき $x = 2^{3} = 8$ です。`,
          easy: R`下に凸の放物線では、頂点から遠い点ほど値が大きくなります。両端の値を実際に計算して比べるのが確実です。$t = -2$ のとき $(−2−1)(−2+2) = 0$、$t = 3$ のとき $(3-1)(3+2) = 10$ なので、大きい方の $10$ が最大値です。`,
          lv: 2 }
      ],
      tags: ['対数関数', '置き換え', '2次関数', '最大・最小']
    },

    /* ---------- 微分・積分（数II）① ---------- */
    {
      id: 'm-mid-calc2-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-calc2',
      title: '円錐に内接する円柱の体積',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`底面の半径が $6$、高さが $12$ の直円錐に、図のように円柱が内接している（円柱の底面は円錐の底面と同じ平面上にあり、円柱の上の面の円周は円錐の側面上にある）。円柱の底面の半径を $r$ $(0 < r < 6)$、高さを $h$、体積を $V$ とする。次の問いに答えよ。`,
      fig: figCone(),
      parts: [
        { label: '(1)', q: R`$h$ を $r$ の式で表せ。`, type: 'expr', answer: '12-2r', vars: ['r'], show: R`12 - 2r`, hint: R`例: 10-3r` },
        { label: '(2)', q: R`$V$ が最大になるときの $r$ の値を求めよ。`, type: 'num', answer: 4 },
        { label: '(3)', q: R`$V$ の最大値を求めよ。`, type: 'num', answer: 64 * PI, show: R`64\pi`, hint: R`例: 32π（π はそのまま入力できます）` },
        { label: '(4)', q: R`$V$ が最大のとき、円柱の体積は円錐の体積の何倍か。`, type: 'num', answer: 4 / 9, show: R`\frac{4}{9}`, hint: R`例: 2/7` }
      ],
      solution: [
        { t: R`断面図で $h$ を $r$ で表す（(1)）`,
          m: [R`r : 6 = (12 - h) : 12`,
              R`12 - h = 2r \;\Rightarrow\; h = 12 - 2r`],
          n: R`円錐の軸を含む平面で切った断面（図）を考えます。円柱の上の面の縁の点は円錐の母線上にあるので、頂点から円柱の上面までの部分に現れる小さな直角三角形（底辺 $r$、高さ $12 - h$）が、もとの直角三角形（底辺 $6$、高さ $12$）と相似になります。相似比から $r : 6 = (12 - h) : 12$ が成り立ちます。`,
          easy: R`立体のままでは考えにくいので、真ん中を縦に切った「断面」で考えます。断面は、底辺 $12$（半径 $6$ の 2 倍）・高さ $12$ の二等辺三角形で、その中に円柱の断面の長方形（横 $2r$、縦 $h$）が入っています。長方形の上の角は三角形の斜めの辺の上にあり、そこから上の小さい三角形は、もとの三角形を縮小したもの（相似）です。横の長さの比 $r : 6$ と、高さの比 $(12 - h) : 12$ が等しくなります。`,
          pro: R`円錐に内接する円柱、円錐に内接する球などは、軸を含む断面で相似を使うのが定石。変数を 1 つ（ここでは $r$）に絞ってから微分する。` },
        { t: R`体積 $V$ を $r$ の関数で表す`,
          m: R`V = \pi r^{2}h = \pi r^{2}(12 - 2r) = \pi(12r^{2} - 2r^{3}) \quad (0 < r < 6)`,
          n: R`円柱の体積は「底面積 $\times$ 高さ」$= \pi r^{2}h$ です。(1) の $h = 12 - 2r$ を代入して、$V$ を $r$ だけの 3 次関数にします。$r$ の範囲 $0 < r < 6$ も忘れずに書いておきます。`,
          easy: R`円柱の底面は半径 $r$ の円なので面積は $\pi r^{2}$、これに高さ $h$ をかけると体積です。$h$ に $12 - 2r$ を入れると、文字が $r$ 1 つだけの式になり、微分して最大値を調べられるようになります。`,
          lv: 2 },
        { t: R`微分して増減を調べる（(2)）`,
          m: [R`V'(r) = \pi(24r - 6r^{2}) = 6\pi r(4 - r)`,
              R`V'(r) = 0 \;\Rightarrow\; r = 4 \quad (0 < r < 6)`,
              R`0 < r < 4:\ V' > 0\ (\text{増加}),\qquad 4 < r < 6:\ V' < 0\ (\text{減少})`],
          n: R`$V'(r) = 6\pi r(4 - r)$ で、$0 < r < 6$ では $6\pi r > 0$ なので、符号は $4 - r$ で決まります。$r = 4$ の前後で増加から減少に変わるので、$V$ は $r = 4$ で最大になります。`,
          easy: R`関数の最大値は、増加から減少に変わる場所（グラフの山の頂上）で起こります。導関数 $V'(r)$ が $0$ になる場所が、その候補です。$V'(r) = 6\pi r(4 - r)$ の符号は、$r < 4$ のとき正（増加中）、$r > 4$ のとき負（減少中）なので、$r = 4$ が頂上です。`,
          pro: R`$r \cdot r \cdot (12 - 2r)$ は、3 数の和 $r + r + (12 - 2r) = 12$ が一定なので、相加・相乗平均 $\dfrac{r + r + (12 - 2r)}{3} \ge \sqrt[3]{r \cdot r \cdot (12 - 2r)}$ から、微分なしで $V \le 64\pi$ と出せる。等号は $r = 12 - 2r$、すなわち $r = 4$ のとき。` },
        { t: R`最大値を求める（(3)）`,
          m: [R`V(4) = \pi(12 \cdot 16 - 2 \cdot 64) = \pi(192 - 128) = 64\pi`,
              R`(h = 12 - 2 \cdot 4 = 4,\quad V = \pi \cdot 4^{2} \cdot 4 = 64\pi)`],
          n: R`最大値は $V(4) = 64\pi$ です。このとき円柱の高さは $h = 12 - 8 = 4$ で、底面の半径と同じです。`,
          easy: R`$r = 4$ を $V = \pi(12r^{2} - 2r^{3})$ に代入します。$12 \times 16 = 192$、$2 \times 64 = 128$ で、差は $64$ です。`,
          lv: 2 },
        { t: R`円錐の体積との比（(4)）`,
          m: [R`\text{円錐の体積} = \frac{1}{3}\pi \cdot 6^{2} \cdot 12 = 144\pi`,
              R`\frac{64\pi}{144\pi} = \frac{4}{9}`],
          n: R`円錐の体積は $\dfrac{1}{3} \times (\text{底面積}) \times (\text{高さ}) = \dfrac{1}{3}\pi \cdot 36 \cdot 12 = 144\pi$ です。最大の円柱の体積 $64\pi$ との比は $\dfrac{64}{144} = \dfrac{4}{9}$ です。`,
          easy: R`円錐の体積の公式は「底面積 $\times$ 高さ $\div\, 3$」です。底面積は $\pi \times 6^{2} = 36\pi$、高さは $12$ なので $36\pi \times 12 \div 3 = 144\pi$ です。$64\pi \div 144\pi$ を約分して（両方を $16$ で割って）$\dfrac{4}{9}$ になります。` }
      ],
      tags: ['最大・最小', '微分の応用', '円柱', '相似']
    },

    /* ---------- 微分・積分（数II）② ---------- */
    {
      id: 'm-mid-calc2-02',
      subject: 'math',
      level: 'mid',
      unit: 'm-calc2',
      title: '放物線と2本の接線で囲む面積',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`放物線 $C : y = x^{2}$ と点 $\mathrm{P}(1,\ -3)$ がある。P から $C$ に引いた 2 本の接線の接点を $\mathrm{A}(a,\ a^{2}),\ \mathrm{B}(b,\ b^{2})$ $(a < b)$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$b$ の値を求めよ。`, type: 'num', answer: 3 },
        { label: '(2)', q: R`点 B における $C$ の接線の方程式を $y = \boxed{\ \ }$ の形で答えよ。`, type: 'expr', answer: '6x-9', vars: ['x'], show: R`6x - 9`, hint: R`例: 2x-1` },
        { label: '(3)', q: R`$C$ と 2 本の接線で囲まれた図形の面積 $S$ を求めよ。`, type: 'num', answer: 16 / 3, show: R`\frac{16}{3}`, hint: R`例: 7/3` },
        { label: '(4)', q: R`点 P を $\mathrm{P}(1,\ q)$ $(q < 1)$ に変えたとき、面積 $S$ が $18$ になるような $q$ の値を求めよ。`, type: 'num', answer: -8 }
      ],
      solution: [
        { t: R`接点を求める（(1)）`,
          m: [R`\text{点 } (t,\ t^{2}) \text{ での接線: } y - t^{2} = 2t(x - t) \;\Rightarrow\; y = 2tx - t^{2}`,
              R`\mathrm{P}(1,\ -3) \text{ を通る: } -3 = 2t - t^{2} \;\Rightarrow\; t^{2} - 2t - 3 = 0 \;\Rightarrow\; (t - 3)(t + 1) = 0`,
              R`a = -1,\qquad b = 3`],
          n: R`$y = x^{2}$ の導関数は $y' = 2x$ なので、点 $(t,\ t^{2})$ における接線の傾きは $2t$ です。この接線が P を通る条件から $t$ の 2 次方程式ができ、その 2 つの解が 2 つの接点の $x$ 座標 $a,\ b$ です。$a < b$ なので $a = -1,\ b = 3$ です。`,
          easy: R`放物線の外側にある点からは、接線が 2 本引けます。「接点の座標を文字 $t$ で $(t,\ t^{2})$ とおく → その点での接線の式を作る → その接線が P を通る、という条件で $t$ を決める」という順序で考えると、$t$ が 2 つ求まり、それが 2 本の接線に対応します。`,
          pro: R`曲線上にない点から引く接線は、「接点を $t$ とおく」が定石。接線の式は $y = f'(t)(x - t) + f(t)$ とおいて、通る点を代入する。` },
        { t: R`接線の方程式（(2)）`,
          m: R`t = -1:\ y = -2x - 1,\qquad t = 3:\ y = 6x - 9`,
          n: R`$y = 2tx - t^{2}$ に $t = 3$ を入れると、点 $\mathrm{B}(3,\ 9)$ における接線 $y = 6x - 9$ が得られます。もう 1 本（点 A における接線）は $y = -2x - 1$ です。どちらも P$(1,\ -3)$ を通ることを確かめられます（$6 - 9 = -3,\ -2 - 1 = -3$）。2 本の接線の交点が P で、図の囲まれた部分が求める面積の図形です。`,
          easy: R`接線の式 $y = 2tx - t^{2}$ の $t$ に $3$ を入れると、傾きは $2 \times 3 = 6$、切片は $-3^{2} = -9$ です。図では、放物線（シアン）に 2 本の接線（紫と琥珀）が接し、斜線部が 2 接線と放物線で囲まれた図形です。`,
          fig: figTangents() },
        { t: R`面積を積分で求める（(3)）`,
          m: [R`x^{2} - (2tx - t^{2}) = (x - t)^{2}`,
              R`S = \int_{-1}^{1}(x + 1)^{2}\,dx + \int_{1}^{3}(x - 3)^{2}\,dx`,
              R`= \left[\frac{(x+1)^{3}}{3}\right]_{-1}^{1} + \left[\frac{(x-3)^{3}}{3}\right]_{1}^{3} = \frac{8}{3} + \frac{8}{3} = \frac{16}{3}`],
          n: R`放物線と接線の差は、接点で重解になるので完全平方の形 $x^{2} - (2tx - t^{2}) = (x - t)^{2}$ になります。区間 $-1 \le x \le 1$ では下側の境界は点 A の接線、$1 \le x \le 3$ では点 B の接線（交点 P の $x$ 座標が $1$）なので、積分を 2 つに分けて計算します。`,
          easy: R`面積は「上の曲線 $-$ 下の曲線」を、左端から右端まで積分して求めます。上が放物線 $y = x^{2}$ で、下は 2 本の接線のうち低い方です。接線は交点 $x = 1$ で入れ替わるので、$x = -1$ から $1$ までと、$x = 1$ から $3$ までに分けます。上と下の差は $x^{2} - (2tx - t^{2})$ を整理すると $(x - t)^{2}$ になるので、積分は $\dfrac{(x - t)^{3}}{3}$ を使うだけで済みます。`,
          pro: R`放物線と 2 接線で囲まれる面積は、接点の $x$ 座標を $a,\ b$ として $\dfrac{|\text{2次の係数}|}{12}(b - a)^{3}$。ここでは $\dfrac{64}{12} = \dfrac{16}{3}$ と一発で出る（放物線と弦 AB で囲まれる面積 $\dfrac{1}{6}(b-a)^{3}$ の半分）。` },
        { t: R`点 P を動かしたとき（(4)）`,
          m: [R`\text{2 接線の交点の } x \text{ 座標は } c = \frac{a + b}{2}`,
              R`S = \int_{a}^{c}(x - a)^{2}\,dx + \int_{c}^{b}(x - b)^{2}\,dx = \frac{(c - a)^{3}}{3} + \frac{(b - c)^{3}}{3} = \frac{(b - a)^{3}}{12}`,
              R`\mathrm{P}(1,\ q):\ t^{2} - 2t + q = 0 \;\Rightarrow\; t = 1 \pm \sqrt{1 - q} \;\Rightarrow\; b - a = 2\sqrt{1 - q}`,
              R`S = \frac{8(1 - q)^{\frac{3}{2}}}{12} = \frac{2}{3}(1 - q)^{\frac{3}{2}} = 18 \;\Rightarrow\; (1 - q)^{\frac{3}{2}} = 27 \;\Rightarrow\; 1 - q = 9 \;\Rightarrow\; q = -8`],
          n: R`接点の $x$ 座標を一般に $a,\ b$ とすると、2 接線 $y = 2ax - a^{2}$、$y = 2bx - b^{2}$ の交点の $x$ 座標は $c = \dfrac{a + b}{2}$ です。(3) と同じ計算で、面積は $S = \dfrac{(b - a)^{3}}{12}$ と表せます。P$(1,\ q)$ のときの接点は $t^{2} - 2t + q = 0$ の 2 解で、$b - a = 2\sqrt{1 - q}$ です。これを $S = 18$ に代入して $q$ を求めます。（$q = -3$ のときは $S = \dfrac{2}{3}\cdot 4^{\frac{3}{2}} = \dfrac{16}{3}$ で、(3) と一致します。）`,
          easy: R`(3) の計算を、接点の座標を文字のままにして行うと、面積が接点の $x$ 座標の差 $b - a$ だけで決まる式 $\dfrac{(b - a)^{3}}{12}$ になります。P の $y$ 座標 $q$ を変えると接点が動き、$b - a = 2\sqrt{1 - q}$ となります（2 次方程式の解の公式 $t = 1 \pm \sqrt{1 - q}$ の差）。$S = 18$ から $(1 - q)^{\frac{3}{2}} = 27$ を作り、両辺を $\dfrac{2}{3}$ 乗して $1 - q = 27^{\frac{2}{3}} = 9$、つまり $q = -8$ です。`,
          lv: 2 }
      ],
      tags: ['接線', '面積', '放物線', '定積分']
    },

    /* ---------- 数列① ---------- */
    {
      id: 'm-mid-seq-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-seq',
      title: '階差数列と部分分数の和',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`数列 $\{a_{n}\}$ が $a_{1} = 2,\ a_{n+1} = a_{n} + 2n + 2$ $(n = 1,\ 2,\ 3,\ \cdots)$ で定められている。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`一般項 $a_{n}$ を $n$ の式で表せ。`, type: 'expr', answer: 'n^2+n', vars: ['n'], show: R`n^{2} + n`, hint: R`例: 2n^2-1` },
        { label: '(2)', q: R`$\displaystyle\sum_{k=1}^{n} a_{k}$ を $n$ の式で表せ。`, type: 'expr', answer: 'n*(n+1)*(n+2)/3', vars: ['n'], show: R`\frac{n(n+1)(n+2)}{3}`, hint: R`例: n*(n+1)/2` },
        { label: '(3)', q: R`$\displaystyle\sum_{k=1}^{n} \frac{1}{a_{k}}$ を $n$ の式で表せ。`, type: 'expr', answer: 'n/(n+1)', vars: ['n'], show: R`\frac{n}{n+1}`, hint: R`例: n/(2*n+1)` },
        { label: '(4)', q: R`$\displaystyle\sum_{k=1}^{n} \frac{1}{a_{k}} > 0.99$ を満たす最小の自然数 $n$ を求めよ。`, type: 'num', answer: 100 }
      ],
      solution: [
        { t: R`階差数列から一般項を求める（(1)）`,
          m: [R`a_{n+1} - a_{n} = 2n + 2 \quad (\text{階差数列 } b_{n} = 2n + 2)`,
              R`a_{n} = a_{1} + \sum_{k=1}^{n-1}(2k + 2) = 2 + (n-1)n + 2(n-1) = n^{2} + n \quad (n \ge 2)`,
              R`n = 1 \text{ のとき } 1^{2} + 1 = 2 = a_{1} \;\Rightarrow\; n = 1 \text{ でも成り立つ}`],
          n: R`隣り合う項の差 $b_{n} = a_{n+1} - a_{n} = 2n + 2$ が分かっているので、$n \ge 2$ では $a_{n} = a_{1} + (b_{1} + b_{2} + \cdots + b_{n-1})$ とします。$\sum_{k=1}^{n-1}(2k + 2) = 2 \cdot \dfrac{(n-1)n}{2} + 2(n-1) = (n-1)(n+2)$ です。最後に、この式が $n = 1$ のときも $a_{1} = 2$ と合うかを必ず確認します。`,
          easy: R`「$a_{n+1} = a_{n} + 2n + 2$」は、「次の項は、前の項に $2n + 2$ を足したもの」という意味です。$a_{1} = 2$ から順に $a_{2} = 2 + 4 = 6,\ a_{3} = 6 + 6 = 12,\ a_{4} = 12 + 8 = 20$ となります。$a_{n}$ は「最初の $a_{1}$ に、そこまでに足してきた分 $b_{1} + b_{2} + \cdots + b_{n-1}$ を足したもの」ですから、$\sum$ を使って表せます。$\sum$ の範囲が $k = 1$ から $n - 1$ までである点に注意しましょう。`,
          pro: R`階差が $n$ の 1 次式なら $a_{n}$ は 2 次式。最初の数項 $2,\ 6,\ 12,\ 20$ が $n(n+1)$ と気づければ検算になる。「$n = 1$ のときも成り立つか」の確認を答案に書き忘れない。` },
        { t: R`$\sum a_{k}$ を計算する（(2)）`,
          m: [R`\sum_{k=1}^{n}(k^{2} + k) = \frac{n(n+1)(2n+1)}{6} + \frac{n(n+1)}{2}`,
              R`= \frac{n(n+1)\left[(2n+1) + 3\right]}{6} = \frac{n(n+1)(2n+4)}{6} = \frac{n(n+1)(n+2)}{3}`],
          n: R`$a_{k} = k^{2} + k$ なので、公式 $\sum_{k=1}^{n}k^{2} = \dfrac{n(n+1)(2n+1)}{6},\ \sum_{k=1}^{n}k = \dfrac{n(n+1)}{2}$ を使います。共通因数 $n(n+1)$ でくくると、残りは $\dfrac{2n+1}{6} + \dfrac{1}{2} = \dfrac{2n+4}{6}$ です。`,
          easy: R`$\sum_{k=1}^{n}$ は「$k = 1$ から $n$ まで足す」記号です。$\sum(k^{2} + k) = \sum k^{2} + \sum k$ と分けて、それぞれ公式で計算します。2 つの式が同じ因数 $n(n+1)$ をもつので、そこをくくり出して整理するとすっきり因数分解できます。たとえば $n = 3$ では $a_{1} + a_{2} + a_{3} = 2 + 6 + 12 = 20$ で、式に入れると $\dfrac{3 \cdot 4 \cdot 5}{3} = 20$ と一致します。`,
          lv: 2 },
        { t: R`部分分数に分けて打ち消す（(3)）`,
          m: [R`\frac{1}{a_{k}} = \frac{1}{k(k+1)} = \frac{1}{k} - \frac{1}{k+1}`,
              R`\sum_{k=1}^{n}\left(\frac{1}{k} - \frac{1}{k+1}\right) = \left(1 - \frac{1}{2}\right) + \left(\frac{1}{2} - \frac{1}{3}\right) + \cdots + \left(\frac{1}{n} - \frac{1}{n+1}\right)`,
              R`= 1 - \frac{1}{n+1} = \frac{n}{n+1}`],
          n: R`$a_{k} = k(k+1)$ の逆数 $\dfrac{1}{k(k+1)}$ は、$\dfrac{1}{k} - \dfrac{1}{k+1}$ と分けられます（右辺を通分して確かめられます）。足していくと、隣り合う項が次々に打ち消し合い、最初の $1$ と最後の $-\dfrac{1}{n+1}$ だけが残ります。`,
          easy: R`分母が「連続する 2 つの整数の積」の分数は、「差」の形に直せます。たとえば $\dfrac{1}{2 \cdot 3} = \dfrac{1}{2} - \dfrac{1}{3}$ は $\dfrac{3-2}{2 \cdot 3}$ で確かめられます。足し算を並べると、$-\dfrac{1}{2}$ と $+\dfrac{1}{2}$、$-\dfrac{1}{3}$ と $+\dfrac{1}{3}$ のように、ほとんどが打ち消し合います。残るのは最初の $1$ と最後の $-\dfrac{1}{n+1}$ です。`,
          pro: R`部分分数分解して打ち消す「望遠鏡和」の型。$\dfrac{1}{k(k+2)}$ なら $\dfrac{1}{2}\left(\dfrac{1}{k} - \dfrac{1}{k+2}\right)$ と、ずれの幅に合わせて係数 $\dfrac{1}{2}$ をつける。` },
        { t: R`不等式を満たす最小の $n$（(4)）`,
          m: [R`\frac{n}{n+1} > 0.99 = \frac{99}{100} \;\Leftrightarrow\; 100n > 99(n+1) \;\Leftrightarrow\; n > 99`,
              R`n = 99 \text{ のとき } \frac{99}{100} = 0.99 \quad (\text{等しいので } > \text{ を満たさない})`,
              R`\text{最小の自然数は } n = 100`],
          n: R`$n + 1 > 0$ なので、分母をはらっても不等号の向きは変わりません。$100n > 99n + 99$ より $n > 99$ です。$n = 99$ では左辺がちょうど $0.99$ になり、「$>$」は成り立ちません。よって最小の自然数は $100$ です。`,
          easy: R`$n$ にいくつか値を入れて様子を見ると、$\dfrac{n}{n+1}$ は $n = 1$ で $0.5$、$n = 9$ で $0.9$、$n = 99$ で $0.99$ と、$1$ に近づいていきます。$n = 99$ のとき値は「ちょうど $0.99$」なので、「$0.99$ より大きい」を満たす最初の $n$ は $100$ です（$\dfrac{100}{101} \fallingdotseq 0.9901$）。`,
          pro: R`不等号に等号が含まれるか（$>$ か $\ge$ か）で答えが 1 ずれる。境界の $n$ で等号が成り立つかを必ず確認する。` }
      ],
      tags: ['階差数列', '一般項', 'Σ', '部分分数', '不等式']
    },

    /* ---------- 数列② ---------- */
    {
      id: 'm-mid-seq-02',
      subject: 'math',
      level: 'mid',
      unit: 'm-seq',
      title: '和と一般項の関係・(等差)×(等比)の和',
      source: { univ: 'オリジナル' },
      time: 13,
      body: R`数列 $\{a_{n}\}$ の初項から第 $n$ 項までの和を $S_{n}$ とする。すべての自然数 $n$ について $S_{n} = 2a_{n} - 3n$ が成り立つとき、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`初項 $a_{1}$ の値を求めよ。`, type: 'num', answer: 3 },
        { label: '(2)', q: R`一般項 $a_{n}$ を $n$ の式で表せ。`, type: 'expr', answer: '3*2^n-3', vars: ['n'], show: R`3 \cdot 2^{n} - 3`, hint: R`例: 5*3^n-2` },
        { label: '(3)', q: R`$S_{10}$ の値を求めよ。`, type: 'num', answer: 6108 },
        { label: '(4)', q: R`$\displaystyle T = \sum_{k=1}^{10} k\,a_{k}$ の値を求めよ。`, type: 'num', answer: 55137 }
      ],
      solution: [
        { t: R`$n = 1$ を代入する（(1)）`,
          m: R`S_{1} = a_{1} = 2a_{1} - 3 \;\Rightarrow\; a_{1} = 3`,
          n: R`$S_{1}$ は「初項から第 1 項までの和」なので $a_{1}$ そのものです。条件の式に $n = 1$ を入れると、$a_{1} = 2a_{1} - 3$ という $a_{1}$ の方程式になり、$a_{1} = 3$ が決まります。`,
          easy: R`和 $S_{n}$ は「最初の $n$ 個の項を足したもの」です。$n = 1$ のときは項が 1 個しかないので、$S_{1} = a_{1}$ です。条件の $S_{n} = 2a_{n} - 3n$ に $n = 1$ を入れた $a_{1} = 2a_{1} - 3$ を解けば $a_{1}$ が求まります。` },
        { t: R`$a_{n} = S_{n} - S_{n-1}$ から漸化式を作る（(2)）`,
          m: [R`a_{n} = S_{n} - S_{n-1} = (2a_{n} - 3n) - \left\{2a_{n-1} - 3(n-1)\right\} \quad (n \ge 2)`,
              R`a_{n} = 2a_{n} - 2a_{n-1} - 3 \;\Rightarrow\; a_{n} = 2a_{n-1} + 3`,
              R`a_{n} + 3 = 2(a_{n-1} + 3)`,
              R`a_{n} + 3 = (a_{1} + 3) \cdot 2^{n-1} = 6 \cdot 2^{n-1} = 3 \cdot 2^{n} \;\Rightarrow\; a_{n} = 3 \cdot 2^{n} - 3`],
          n: R`$n \ge 2$ では $a_{n} = S_{n} - S_{n-1}$ が成り立ちます。条件の式を $n$ と $n-1$ の両方に使うと、$a_{n}$ と $a_{n-1}$ だけの漸化式 $a_{n} = 2a_{n-1} + 3$ ができます。$\alpha = 2\alpha + 3$ の解 $\alpha = -3$ を使って $a_{n} + 3 = 2(a_{n-1} + 3)$ と変形すると、$\{a_{n} + 3\}$ は初項 $a_{1} + 3 = 6$、公比 $2$ の等比数列です。$n = 1$ のとき $3 \cdot 2 - 3 = 3 = a_{1}$ なので、すべての $n$ で成り立ちます。`,
          easy: R`「$n$ 個目までの和」から「$n - 1$ 個目までの和」を引くと、ちょうど「$n$ 番目の項」だけが残ります。これが $a_{n} = S_{n} - S_{n-1}$ です（ただし $S_{0}$ は考えないので $n \ge 2$）。$S_{n}$ と $S_{n-1}$ を条件の式で表して引くと、$a_{n}$ と $a_{n-1}$ の関係式（漸化式）が得られます。$a_{n} = 2a_{n-1} + 3$ のような式は、$a_{n} + 3 = 2(a_{n-1} + 3)$ と変形すると「前の項の 2 倍」になり、等比数列として扱えます。`,
          pro: R`「$S_{n}$ と $a_{n}$ の関係式」型は、(i) $n = 1$ で $a_{1}$、(ii) $n \ge 2$ で $a_{n} = S_{n} - S_{n-1}$、(iii) 漸化式を解く、(iv) $n = 1$ でも成り立つか確認、の 4 手順が定石。` },
        { t: R`$S_{10}$ を求める（(3)）`,
          m: [R`S_{10} = 2a_{10} - 3 \cdot 10 = 2(3 \cdot 2^{10} - 3) - 30 = 2 \cdot 3069 - 30 = 6108`,
              R`\text{検算: } \sum_{k=1}^{10}(3 \cdot 2^{k} - 3) = 3(2^{11} - 2) - 30 = 6138 - 30 = 6108`],
          n: R`もとの条件の式 $S_{n} = 2a_{n} - 3n$ に $n = 10$ を入れるのが最短です。$a_{10} = 3 \cdot 1024 - 3 = 3069$ なので $S_{10} = 6138 - 30 = 6108$ です。等比数列の和の公式を使った $\sum(3 \cdot 2^{k} - 3)$ の計算でも同じ値になります。`,
          easy: R`$S_{10}$ を求めるのに、$a_{1}$ から $a_{10}$ までを全部足す必要はありません。条件の式 $S_{n} = 2a_{n} - 3n$ が使えるからです。$a_{10} = 3 \times 2^{10} - 3 = 3 \times 1024 - 3 = 3069$ を代入すると、$S_{10} = 2 \times 3069 - 30 = 6108$ です。`,
          lv: 2 },
        { t: R`(等差)×(等比)の和 $\sum k\,2^{k}$ を求める（(4)）`,
          m: [R`T = \sum_{k=1}^{10} k(3 \cdot 2^{k} - 3) = 3U - 3\sum_{k=1}^{10}k,\qquad U = \sum_{k=1}^{10} k \cdot 2^{k}`,
              R`\begin{aligned} U &= 1\cdot 2 + 2\cdot 2^{2} + 3\cdot 2^{3} + \cdots + 10\cdot 2^{10} \\ 2U &= \qquad\ \ \, 1\cdot 2^{2} + 2\cdot 2^{3} + \cdots + 9\cdot 2^{10} + 10\cdot 2^{11} \\ -U &= 2 + 2^{2} + 2^{3} + \cdots + 2^{10} - 10\cdot 2^{11} \end{aligned}`,
              R`-U = (2^{11} - 2) - 10 \cdot 2^{11} = 2046 - 20480 = -18434 \;\Rightarrow\; U = 18434`,
              R`T = 3 \cdot 18434 - 3 \cdot 55 = 55302 - 165 = 55137`],
          n: R`$k\,a_{k} = k(3 \cdot 2^{k} - 3) = 3k \cdot 2^{k} - 3k$ なので、$T = 3U - 3\sum k$ と分けます。$U = \sum k \cdot 2^{k}$ は「等差数列 $k$ と等比数列 $2^{k}$ の積」の和なので、**公比 $2$ をかけたものとずらして引く**方法で求めます。$U - 2U$ では、$2^{2}$ から $2^{10}$ の係数が $(k) - (k - 1) = 1$ となって等比数列の和 $2 + 2^{2} + \cdots + 2^{10} = 2^{11} - 2$ に変わります。$\sum_{k=1}^{10}k = 55$ です。`,
          easy: R`$1 \cdot 2 + 2 \cdot 2^{2} + 3 \cdot 2^{3} + \cdots$ のように、「係数が $1, 2, 3, \cdots$（等差）」で「$2$ の累乗（等比）」の形の和は、そのままでは公式が使えません。そこで、同じ和を $2$ 倍したものを 1 項ずらして書き、もとの式から引きます。すると係数が $(1),\ (2-1),\ (3-2),\ \cdots$ と全部 $1$ になり、ふつうの等比数列の和 $2 + 2^{2} + \cdots + 2^{10} = 2^{11} - 2$ に変わります。最後に、$10 \cdot 2^{11}$ の項が 1 つだけ余ります。`,
          pro: R`公式として $\sum_{k=1}^{n} k \cdot 2^{k} = (n-1)2^{n+1} + 2$。$n = 10$ で $9 \cdot 2048 + 2 = 18434$ と一致します。「(等差)×(等比)」は「公比倍してずらして引く」で必ず解ける。` }
      ],
      tags: ['Sn と an', '漸化式', '等比数列', '(等差)×(等比)', 'Σ']
    },

    /* ---------- ベクトル① ---------- */
    {
      id: 'm-mid-vec-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-vec',
      title: '内積と垂線の足・ベクトルの大きさの最小',
      source: { univ: 'オリジナル' },
      time: 11,
      body: R`$\triangle\mathrm{OAB}$ において、$\left|\overrightarrow{\mathrm{OA}}\right| = 3,\ \left|\overrightarrow{\mathrm{OB}}\right| = 2,\ \angle\mathrm{AOB} = 60\degree$ であり、$\vec{a} = \overrightarrow{\mathrm{OA}},\ \vec{b} = \overrightarrow{\mathrm{OB}}$ とおく。O から直線 AB に下ろした垂線の足を H とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`線分 $\mathrm{AB}$ の長さを求めよ。`, type: 'num', answer: S7, show: R`\sqrt{7}`, hint: R`例: √5 や sqrt(5)` },
        { label: '(2)', q: R`$\overrightarrow{\mathrm{OH}} = (1 - s)\vec{a} + s\vec{b}$ と表すとき、$s$ の値を求めよ。`, type: 'num', answer: 6 / 7, show: R`\frac{6}{7}`, hint: R`例: 2/5` },
        { label: '(3)', q: R`線分 $\mathrm{OH}$ の長さを求めよ。`, type: 'num', answer: 3 * S21 / 7, show: R`\frac{3\sqrt{21}}{7}`, hint: R`例: 2√15/5` },
        { label: '(4)', q: R`実数 $t$ を動かすとき、$\left|\vec{a} + t\vec{b}\right|$ の最小値を求めよ。`, type: 'num', answer: 3 * S3 / 2, show: R`\frac{3\sqrt{3}}{2}`, hint: R`例: 5√2/3` }
      ],
      solution: [
        { t: R`内積と大きさを求めておく`,
          m: [R`\vec{a}\cdot\vec{b} = \left|\vec{a}\right|\left|\vec{b}\right|\cos 60\degree = 3 \cdot 2 \cdot \frac{1}{2} = 3`,
              R`\left|\vec{a}\right|^{2} = 9,\qquad \left|\vec{b}\right|^{2} = 4`],
          n: R`この問題では、座標がなく長さと角だけが与えられているので、すべて「$\vec{a},\ \vec{b}$ の内積」で計算します。基本になる 3 つの値 $\vec{a}\cdot\vec{b} = 3,\ \left|\vec{a}\right|^{2} = 9,\ \left|\vec{b}\right|^{2} = 4$ を先に求めておきます。`,
          easy: R`内積は $\vec{a}\cdot\vec{b} = (\vec{a}\text{ の長さ}) \times (\vec{b}\text{ の長さ}) \times \cos(\text{なす角})$ で計算できる、ベクトルどうしの「かけ算」です。同じベクトルどうしの内積は、長さの 2 乗になります（$\vec{a}\cdot\vec{a} = \left|\vec{a}\right|^{2}$）。以降の計算は、この 3 つの値を使って式を展開していくだけです。`,
          lv: 2 },
        { t: R`$\mathrm{AB}$ の長さ（(1)）`,
          m: [R`\left|\overrightarrow{\mathrm{AB}}\right|^{2} = \left|\vec{b} - \vec{a}\right|^{2} = \left|\vec{b}\right|^{2} - 2\vec{a}\cdot\vec{b} + \left|\vec{a}\right|^{2} = 4 - 6 + 9 = 7`,
              R`\mathrm{AB} = \sqrt{7}`],
          n: R`$\overrightarrow{\mathrm{AB}} = \vec{b} - \vec{a}$ の大きさを求めるには、2 乗して展開し、内積の値を代入します。$\left|\vec{b} - \vec{a}\right|^{2} = \left|\vec{b}\right|^{2} - 2\vec{a}\cdot\vec{b} + \left|\vec{a}\right|^{2}$ です（余弦定理と同じ式です）。`,
          easy: R`ベクトルの大きさのままでは計算しにくいので、2 乗します。$(b - a)^{2} = b^{2} - 2ab + a^{2}$ という文字式の展開と同じ形で、$b^{2}$ や $a^{2}$ は大きさの 2 乗、$ab$ は内積 $\vec{a}\cdot\vec{b}$ に対応します。`,
          pro: R`$\left|\vec{p} \pm \vec{q}\right|^{2}$ の展開は、余弦定理そのもの。長さ 2 つと内積が与えられたら、まず 2 乗して展開する。` },
        { t: R`垂線の足 H を内積 $=0$ で決める（(2)）`,
          m: [R`\overrightarrow{\mathrm{OH}} = (1 - s)\vec{a} + s\vec{b} \quad (\text{H は直線 AB 上})`,
              R`\overrightarrow{\mathrm{OH}}\cdot\overrightarrow{\mathrm{AB}} = 0,\quad \overrightarrow{\mathrm{AB}} = \vec{b} - \vec{a}`,
              R`\left\{(1 - s)\vec{a} + s\vec{b}\right\}\cdot(\vec{b} - \vec{a}) = (1 - s)(\vec{a}\cdot\vec{b} - \left|\vec{a}\right|^{2}) + s(\left|\vec{b}\right|^{2} - \vec{a}\cdot\vec{b})`,
              R`= (1 - s)(3 - 9) + s(4 - 3) = 7s - 6 = 0 \;\Rightarrow\; s = \frac{6}{7}`],
          n: R`H は直線 AB 上の点なので $\overrightarrow{\mathrm{OH}} = (1 - s)\vec{a} + s\vec{b}$（係数の和が $1$）と表せます。さらに $\mathrm{OH} \perp \mathrm{AB}$ なので $\overrightarrow{\mathrm{OH}}\cdot\overrightarrow{\mathrm{AB}} = 0$ です。この内積を展開して、先に求めた値を代入すると $s$ の 1 次方程式になります。$s = \dfrac{6}{7}$ は $0$ と $1$ の間なので、H は線分 AB 上にあります。`,
          easy: R`「H は直線 AB 上の点」を式にすると、「$\overrightarrow{\mathrm{OH}}$ は $\vec{a}$ と $\vec{b}$ を $(1 - s) : s$ の割合で混ぜたもの」になります（$s = 0$ なら A、$s = 1$ なら B）。「垂線の足」は $\mathrm{OH}$ と $\mathrm{AB}$ が垂直という意味で、垂直なベクトルの内積は $0$ です。この 2 つの条件から $s$ が決まります。`,
          pro: R`「垂線の足」は、(i) 直線上の点なので係数の和が $1$、(ii) 内積 $=0$、の 2 条件で決める。定石として $\overrightarrow{\mathrm{OH}}$ の係数は、$\mathrm{AH} : \mathrm{HB} = 6 : 1$ のような比にもなる。` },
        { t: R`$\mathrm{OH}$ の長さ（(3)）`,
          m: [R`\overrightarrow{\mathrm{OH}} = \frac{1}{7}\vec{a} + \frac{6}{7}\vec{b}`,
              R`\left|\overrightarrow{\mathrm{OH}}\right|^{2} = \frac{1}{49}\cdot 9 + 2\cdot\frac{1}{7}\cdot\frac{6}{7}\cdot 3 + \frac{36}{49}\cdot 4 = \frac{9 + 36 + 144}{49} = \frac{27}{7}`,
              R`\mathrm{OH} = \sqrt{\frac{27}{7}} = \frac{3\sqrt{3}}{\sqrt{7}} = \frac{3\sqrt{21}}{7}`],
          n: R`$s = \dfrac{6}{7}$ を代入して $\overrightarrow{\mathrm{OH}} = \dfrac{1}{7}\vec{a} + \dfrac{6}{7}\vec{b}$ とし、2 乗して展開します。（検算）$\triangle\mathrm{OAB}$ の面積は $\dfrac{1}{2} \cdot 3 \cdot 2 \cdot \sin 60\degree = \dfrac{3\sqrt{3}}{2}$ なので、$\mathrm{OH} = \dfrac{2 \times \text{面積}}{\mathrm{AB}} = \dfrac{3\sqrt{3}}{\sqrt{7}}$ と一致します。`,
          easy: R`$\overrightarrow{\mathrm{OH}}$ の大きさも、(1) と同じように「2 乗して展開」で求めます。$\left(\dfrac{1}{7}\vec{a} + \dfrac{6}{7}\vec{b}\right)^{2}$ を展開すると、$\vec{a}$ の 2 乗の項、$\vec{b}$ の 2 乗の項、そして内積 $\vec{a}\cdot\vec{b}$ の項（係数 $2 \times \dfrac{1}{7} \times \dfrac{6}{7}$）が出てきます。最後に平方根をとり、分母の $\sqrt{7}$ を有理化します（$\dfrac{3\sqrt{3}}{\sqrt{7}} = \dfrac{3\sqrt{21}}{7}$）。`,
          lv: 2 },
        { t: R`$\left|\vec{a} + t\vec{b}\right|$ の最小値（(4)）`,
          m: [R`\left|\vec{a} + t\vec{b}\right|^{2} = \left|\vec{a}\right|^{2} + 2t\,\vec{a}\cdot\vec{b} + t^{2}\left|\vec{b}\right|^{2} = 4t^{2} + 6t + 9`,
              R`= 4\left(t + \frac{3}{4}\right)^{2} + \frac{27}{4}`,
              R`\text{最小値 } \sqrt{\frac{27}{4}} = \frac{3\sqrt{3}}{2} \quad \left(t = -\frac{3}{4}\right)`],
          n: R`$\left|\vec{a} + t\vec{b}\right|$ を 2 乗して内積で展開すると、$t$ の 2 次式 $4t^{2} + 6t + 9$ になります。平方完成すると $t = -\dfrac{3}{4}$ のとき最小値 $\dfrac{27}{4}$ をとるので、$\left|\vec{a} + t\vec{b}\right|$ の最小値はその平方根 $\dfrac{3\sqrt{3}}{2}$ です。図形的には、$\vec{a} + t\vec{b}$ の終点は「A を通り $\vec{b}$ に平行な直線」上を動き、O からその直線までの距離（A から直線 OB への距離 $3\sin 60\degree$）が最小値です。`,
          easy: R`$\left|\vec{a} + t\vec{b}\right|$ は、$t$ を動かしたときのベクトルの長さです。大きさは 2 乗してから考えるのが基本で、2 乗すると $t$ の 2 次式になります。2 次式の最小値は、平方完成して頂点を調べれば分かります。$t$ の係数 $6$ は、内積の値 $\vec{a}\cdot\vec{b} = 3$ から $2 \times 3 = 6$ と出てきます。`,
          pro: R`$\left|\vec{a} + t\vec{b}\right|$ が最小になるのは、$(\vec{a} + t\vec{b}) \perp \vec{b}$ のとき。$(\vec{a} + t\vec{b})\cdot\vec{b} = 3 + 4t = 0$ より $t = -\dfrac{3}{4}$ と、微分も平方完成も使わずに求まる。` }
      ],
      tags: ['内積', '垂線の足', '大きさ', '最小値', '平面ベクトル']
    },

    /* ---------- ベクトル② ---------- */
    {
      id: 'm-mid-vec-02',
      subject: 'math',
      level: 'mid',
      unit: 'm-vec',
      title: '空間ベクトルの内積・面積・垂線の足',
      source: { univ: 'オリジナル' },
      time: 11,
      body: R`座標空間に 3 点 $\mathrm{A}(1,\ 2,\ 3),\ \mathrm{B}(3,\ 4,\ 4),\ \mathrm{C}(1,\ 5,\ 3)$ がある。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`内積 $\overrightarrow{\mathrm{AB}}\cdot\overrightarrow{\mathrm{AC}}$ の値を求めよ。`, type: 'num', answer: 6 },
        { label: '(2)', q: R`$\cos\angle\mathrm{BAC}$ の値を求めよ。`, type: 'num', answer: 2 / 3, show: R`\frac{2}{3}`, hint: R`例: 3/5` },
        { label: '(3)', q: R`$\triangle\mathrm{ABC}$ の面積を求めよ。`, type: 'num', answer: 3 * S5 / 2, show: R`\frac{3\sqrt{5}}{2}`, hint: R`例: 2√7/3` },
        { label: '(4)', q: R`点 C から直線 AB に下ろした垂線の足を P とする。P の $x$ 座標を求めよ。`, type: 'num', answer: 7 / 3, show: R`\frac{7}{3}`, hint: R`例: 5/4` }
      ],
      solution: [
        { t: R`ベクトルの成分と内積（(1)）`,
          m: [R`\overrightarrow{\mathrm{AB}} = (3 - 1,\ 4 - 2,\ 4 - 3) = (2,\ 2,\ 1),\qquad \overrightarrow{\mathrm{AC}} = (0,\ 3,\ 0)`,
              R`\overrightarrow{\mathrm{AB}}\cdot\overrightarrow{\mathrm{AC}} = 2 \cdot 0 + 2 \cdot 3 + 1 \cdot 0 = 6`],
          n: R`ベクトル $\overrightarrow{\mathrm{AB}}$ の成分は「終点の座標 $-$ 始点の座標」です。内積は、対応する成分どうしの積の和（空間では $x,\ y,\ z$ の 3 成分）で計算します。`,
          easy: R`空間のベクトルは、$x$ 方向・$y$ 方向・$z$ 方向の 3 つの成分で表します。A から B へ向かうベクトルは、B の座標から A の座標を引いて $(2,\ 2,\ 1)$ です。2 つのベクトルの内積は、$x$ 成分どうし、$y$ 成分どうし、$z$ 成分どうしをそれぞれかけて、全部足します。平面の場合（$x,\ y$ の 2 成分）に $z$ 成分が増えただけです。` },
        { t: R`なす角の余弦（(2)）`,
          m: [R`\left|\overrightarrow{\mathrm{AB}}\right| = \sqrt{2^{2} + 2^{2} + 1^{2}} = 3,\qquad \left|\overrightarrow{\mathrm{AC}}\right| = \sqrt{0 + 3^{2} + 0} = 3`,
              R`\cos\angle\mathrm{BAC} = \frac{\overrightarrow{\mathrm{AB}}\cdot\overrightarrow{\mathrm{AC}}}{\left|\overrightarrow{\mathrm{AB}}\right|\left|\overrightarrow{\mathrm{AC}}\right|} = \frac{6}{3 \cdot 3} = \frac{2}{3}`],
          n: R`ベクトルの大きさは各成分の 2 乗の和の平方根です。内積の定義 $\vec{a}\cdot\vec{b} = \left|\vec{a}\right|\left|\vec{b}\right|\cos\theta$ を $\cos\theta$ について解いた式に代入します。`,
          easy: R`内積の定義式 $\vec{a}\cdot\vec{b} = \left|\vec{a}\right|\left|\vec{b}\right|\cos\theta$ を $\cos\theta$ について解くと、$\cos\theta = \dfrac{\vec{a}\cdot\vec{b}}{\left|\vec{a}\right|\left|\vec{b}\right|}$ です。空間でも長さは三平方の定理の拡張で、$\sqrt{x^{2} + y^{2} + z^{2}}$ で計算します。$\cos\angle\mathrm{BAC} > 0$ なので、$\angle\mathrm{BAC}$ は鋭角です。`,
          lv: 2 },
        { t: R`三角形の面積（(3)）`,
          m: [R`\sin\angle\mathrm{BAC} = \sqrt{1 - \left(\frac{2}{3}\right)^{2}} = \frac{\sqrt{5}}{3}`,
              R`S = \frac{1}{2}\left|\overrightarrow{\mathrm{AB}}\right|\left|\overrightarrow{\mathrm{AC}}\right|\sin\angle\mathrm{BAC} = \frac{1}{2}\cdot 3 \cdot 3 \cdot\frac{\sqrt{5}}{3} = \frac{3\sqrt{5}}{2}`],
          n: R`三角形の面積は「2 辺とその間の角」から $\dfrac{1}{2}bc\sin A$ で求められます。$\sin$ は $\sin^{2} + \cos^{2} = 1$ から出します（$0 < \angle\mathrm{BAC} < \pi$ なので $\sin > 0$）。`,
          easy: R`空間の三角形でも、面積は「$\dfrac{1}{2} \times 2$ 辺の長さの積 $\times$ 間の角の $\sin$」で求まります。$\cos\angle\mathrm{BAC} = \dfrac{2}{3}$ が分かっているので、$\sin = \sqrt{1 - \cos^{2}}$ で $\sin$ を出して代入します。`,
          pro: R`成分から直接 $S = \dfrac{1}{2}\sqrt{\left|\vec{a}\right|^{2}\left|\vec{b}\right|^{2} - (\vec{a}\cdot\vec{b})^{2}} = \dfrac{1}{2}\sqrt{81 - 36} = \dfrac{3\sqrt{5}}{2}$ と出せる（$\cos,\ \sin$ を経由しない）。` },
        { t: R`垂線の足 P の座標（(4)）`,
          m: [R`\overrightarrow{\mathrm{AP}} = t\,\overrightarrow{\mathrm{AB}},\qquad \overrightarrow{\mathrm{CP}} = \overrightarrow{\mathrm{AP}} - \overrightarrow{\mathrm{AC}} = t\,\overrightarrow{\mathrm{AB}} - \overrightarrow{\mathrm{AC}}`,
              R`\overrightarrow{\mathrm{CP}}\cdot\overrightarrow{\mathrm{AB}} = t\left|\overrightarrow{\mathrm{AB}}\right|^{2} - \overrightarrow{\mathrm{AB}}\cdot\overrightarrow{\mathrm{AC}} = 9t - 6 = 0 \;\Rightarrow\; t = \frac{2}{3}`,
              R`\mathrm{P} = \mathrm{A} + \frac{2}{3}\overrightarrow{\mathrm{AB}} = \left(1 + \frac{4}{3},\ 2 + \frac{4}{3},\ 3 + \frac{2}{3}\right) = \left(\frac{7}{3},\ \frac{10}{3},\ \frac{11}{3}\right)`],
          n: R`P は直線 AB 上の点なので $\overrightarrow{\mathrm{AP}} = t\,\overrightarrow{\mathrm{AB}}$ とおけます。$\mathrm{CP} \perp \mathrm{AB}$ より $\overrightarrow{\mathrm{CP}}\cdot\overrightarrow{\mathrm{AB}} = 0$ で、これを展開すると $t$ の 1 次方程式になります。P の座標は $\mathrm{A} + \dfrac{2}{3}\overrightarrow{\mathrm{AB}}$ で、$x$ 座標は $\dfrac{7}{3}$ です。（検算）$\overrightarrow{\mathrm{CP}} = \left(\dfrac{4}{3},\ -\dfrac{5}{3},\ \dfrac{2}{3}\right)$ の大きさは $\sqrt{5}$ で、$\dfrac{1}{2} \cdot \mathrm{AB} \cdot \mathrm{CP} = \dfrac{3\sqrt{5}}{2}$ と (3) の面積に一致します。`,
          easy: R`「点 C から直線 AB に下ろした垂線の足」は、直線 AB 上で C にいちばん近い点です。直線 AB 上の点は、A から B の方向へ $t$ 倍だけ進んだ点 $\mathrm{A} + t\overrightarrow{\mathrm{AB}}$ と書けます。C とその点を結ぶ線分が AB と垂直（内積が $0$）になるように $t$ を決めると、$t = \dfrac{2}{3}$ が出ます。$t$ が分かれば、P の座標は A の座標に $\dfrac{2}{3}\overrightarrow{\mathrm{AB}} = \left(\dfrac{4}{3},\ \dfrac{4}{3},\ \dfrac{2}{3}\right)$ を足して求まります。`,
          pro: R`垂線の足は「射影」$\overrightarrow{\mathrm{AP}} = \dfrac{\overrightarrow{\mathrm{AB}}\cdot\overrightarrow{\mathrm{AC}}}{\left|\overrightarrow{\mathrm{AB}}\right|^{2}}\overrightarrow{\mathrm{AB}}$ として、$t = \dfrac{6}{9}$ を一発で出せる。` }
      ],
      tags: ['空間ベクトル', '内積', 'なす角', '面積', '垂線の足']
    },

    /* ---------- 極限 ---------- */
    {
      id: 'm-mid-limit-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-limit',
      title: '円と正方形の無限列と無限等比級数',
      source: { univ: 'オリジナル' },
      time: 11,
      body: R`半径 $2$ の円 $C_{1}$ に内接する正方形を $S_{1}$、$S_{1}$ に内接する円を $C_{2}$、$C_{2}$ に内接する正方形を $S_{2}$、……と、円と正方形を交互に限りなくつくっていく。円 $C_{n}$ の半径を $r_{n}$、面積を $a_{n}$、正方形 $S_{n}$ の面積を $b_{n}$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$r_{3}$ の値を求めよ。`, type: 'num', answer: 1 },
        { label: '(2)', q: R`$\displaystyle\sum_{n=1}^{\infty} a_{n}$ の値を求めよ。`, type: 'num', answer: 8 * PI, show: R`8\pi`, hint: R`例: 6π（π はそのまま入力できます）` },
        { label: '(3)', q: R`$\displaystyle\sum_{n=1}^{\infty} (a_{n} - b_{n})$ の値を求めよ。`, type: 'num', answer: 8 * PI - 16, show: R`8\pi - 16`, hint: R`例: 4π-3` },
        { label: '(4)', q: R`(2) の和を $S$、$a_{1}$ から $a_{n}$ までの和を $T_{n}$ とする。$S - T_{n} < 0.01$ を満たす最小の自然数 $n$ を求めよ。ただし $\pi = 3.14$ として計算してよい。`, type: 'num', answer: 12 }
      ],
      solution: [
        { t: R`半径の関係 $r_{n+1} = \dfrac{r_{n}}{\sqrt{2}}$（(1)）`,
          m: [R`S_{n} \text{ の対角線} = C_{n} \text{ の直径} = 2r_{n} \;\Rightarrow\; S_{n} \text{ の 1 辺} = \sqrt{2}\,r_{n}`,
              R`C_{n+1} \text{ の直径} = S_{n} \text{ の 1 辺} \;\Rightarrow\; r_{n+1} = \frac{\sqrt{2}\,r_{n}}{2} = \frac{r_{n}}{\sqrt{2}}`,
              R`r_{1} = 2,\quad r_{2} = \sqrt{2},\quad r_{3} = 1`],
          n: R`円に内接する正方形の対角線は円の直径に等しく、正方形の 1 辺は対角線の $\dfrac{1}{\sqrt{2}}$ 倍です。さらに、正方形に内接する円の直径はその正方形の 1 辺に等しいので、半径は $\dfrac{1}{\sqrt{2}}$ 倍になります。$r_{1} = 2$ から順に $\sqrt{2},\ 1$ と求まります。`,
          easy: R`正方形の 1 辺を $1$ とすると、対角線は三平方の定理から $\sqrt{2}$ です（辺 : 対角線 $= 1 : \sqrt{2}$）。円 $C_{n}$ に内接する正方形は、4 つの頂点が円周上にあるので、対角線が円の直径 $2r_{n}$ です。この正方形の中にぴったり入る円（内接円）は、直径が正方形の 1 辺と同じです。つまり「円 → 正方形 → 円」と進むたびに、半径が $\dfrac{1}{\sqrt{2}}$ 倍になります。`,
          pro: R`「円 → 内接正方形 → 内接円」を 1 周すると、長さは $\dfrac{1}{\sqrt{2}}$ 倍、面積は $\dfrac{1}{2}$ 倍。この「面積の公比 $\dfrac{1}{2}$」が無限等比級数の出発点です。` },
        { t: R`面積 $a_{n}$ の和（(2)）`,
          m: [R`a_{n} = \pi r_{n}^{2},\quad r_{n+1}^{2} = \frac{r_{n}^{2}}{2} \;\Rightarrow\; a_{n+1} = \frac{1}{2}a_{n}`,
              R`a_{1} = 4\pi,\quad \text{公比 } \frac{1}{2},\quad \left|\frac{1}{2}\right| < 1 \;\Rightarrow\; \text{収束}`,
              R`\sum_{n=1}^{\infty} a_{n} = \frac{4\pi}{1 - \frac{1}{2}} = 8\pi`],
          n: R`円の面積は $a_{n} = \pi r_{n}^{2}$ で、$r_{n+1}^{2} = \dfrac{r_{n}^{2}}{2}$ なので $a_{n+1} = \dfrac{1}{2}a_{n}$ です。$\{a_{n}\}$ は初項 $a_{1} = \pi \cdot 2^{2} = 4\pi$、公比 $\dfrac{1}{2}$ の等比数列です。公比の絶対値が $1$ より小さいので、無限等比級数の和の公式 $\dfrac{(\text{初項})}{1 - (\text{公比})}$ が使えます。`,
          easy: R`半径が $\dfrac{1}{\sqrt{2}}$ 倍になると、面積は（半径の 2 乗に比例するので）$\left(\dfrac{1}{\sqrt{2}}\right)^{2} = \dfrac{1}{2}$ 倍になります。つまり、次々にできる円の面積は、前の円の半分ずつになっていきます。$4\pi,\ 2\pi,\ \pi,\ \dfrac{\pi}{2},\ \cdots$ を限りなく足すと、公式 $\dfrac{\text{初項}}{1 - \text{公比}} = \dfrac{4\pi}{\frac{1}{2}} = 8\pi$ に近づきます。公式が使えるのは「公比の絶対値が $1$ より小さい」ときだけなので、まずそれを確認します。` },
        { t: R`円から正方形を除いた部分の面積の和（(3)）`,
          m: [R`b_{n} = \left(\sqrt{2}\,r_{n}\right)^{2} = 2r_{n}^{2},\quad b_{1} = 8,\quad \text{公比 } \frac{1}{2}`,
              R`\sum_{n=1}^{\infty} b_{n} = \frac{8}{1 - \frac{1}{2}} = 16`,
              R`\sum_{n=1}^{\infty}(a_{n} - b_{n}) = 8\pi - 16`],
          n: R`正方形 $S_{n}$ の面積は 1 辺 $\sqrt{2}\,r_{n}$ の 2 乗で $b_{n} = 2r_{n}^{2}$、これも初項 $b_{1} = 8$、公比 $\dfrac{1}{2}$ の等比数列です。収束する 2 つの無限級数の差は、それぞれの和の差に等しい（項別に引いてよい）ので、$8\pi - 16$ です。$a_{n} - b_{n}$ は、円 $C_{n}$ の内側で正方形 $S_{n}$ の外側にある 4 つの弓形の面積の合計を表します。`,
          easy: R`$a_{n} - b_{n}$ は「円の面積 $-$ その円に内接する正方形の面積」なので、円の中の、正方形からはみ出す 4 つの小さな部分（弓形）の面積です。それを $n = 1, 2, 3, \cdots$ について限りなく足した値が (3) です。$b_{n}$ の和も、$8,\ 4,\ 2,\ 1,\ \cdots$ という公比 $\dfrac{1}{2}$ の等比級数なので、(2) と同じ要領で $16$ と求まります。数値は $8\pi - 16 \fallingdotseq 25.13 - 16 = 9.13$ です。`,
          lv: 2 },
        { t: R`部分和と収束のようす（(4)）`,
          m: [R`T_{n} = \frac{4\pi\left\{1 - \left(\frac{1}{2}\right)^{n}\right\}}{1 - \frac{1}{2}} = 8\pi - \frac{8\pi}{2^{n}}`,
              R`S - T_{n} = \frac{8\pi}{2^{n}} < 0.01 \;\Leftrightarrow\; 2^{n} > 800\pi \fallingdotseq 2512`,
              R`2^{11} = 2048 < 2512 < 4096 = 2^{12} \;\Rightarrow\; n = 12`],
          n: R`等比数列の和の公式から $T_{n} = 8\pi - \dfrac{8\pi}{2^{n}}$ となり、$S - T_{n} = \dfrac{8\pi}{2^{n}}$ です。これを $0.01$ より小さくするために、$2^{n} > 800\pi$（$\pi = 3.14$ なら $2512$）を満たす最小の $n$ を探します。$2$ の累乗は $2^{10} = 1024,\ 2^{11} = 2048,\ 2^{12} = 4096$ なので、$2^{11}$ ではまだ足りず、$n = 12$ です。`,
          easy: R`「無限に足した値 $S$」と「$n$ 個まで足した値 $T_{n}$」のズレ $S - T_{n}$ は、$n$ を大きくするほど小さくなります（これが「収束する」ということ）。ここではズレが $\dfrac{8\pi}{2^{n}}$ と求まるので、これが $0.01$ より小さくなる最初の $n$ を調べます。$n = 11$ のとき $\dfrac{8\pi}{2048} \fallingdotseq 0.0123$（まだ $0.01$ より大きい）、$n = 12$ のとき $\dfrac{8\pi}{4096} \fallingdotseq 0.0061$ なので、$n = 12$ です。`,
          pro: R`「部分和 $T_{n}$ と和 $S$ の差」は、等比級数では「初項 $\times$ 公比の $n$ 乗 $\div$ (1 $-$ 公比)」の形。$2^{n}$ を 2 の累乗の表（$2^{10} = 1024$）と比べて $n$ を決める。` }
      ],
      tags: ['無限等比級数', '図形と極限', '部分和', '収束']
    },

    /* ---------- 微分法（数III） ---------- */
    {
      id: 'm-mid-diff3-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-diff3',
      title: '分数形の三角関数の増減と方程式の解',
      source: { univ: 'オリジナル' },
      time: 11,
      body: R`関数 $f(x) = \dfrac{\sin x}{2 + \cos x}$ $(0 \le x \le 2\pi)$ について、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`導関数は $f'(x) = \dfrac{\boxed{\ \ }}{(2 + \cos x)^{2}}$ と表せる。空欄に入る式を答えよ。`, type: 'expr', answer: '2*cos(x)+1', vars: ['x'], show: R`2\cos x + 1`, hint: R`例: 3*sin(x)-1（cos(x), sin(x) の形で入力）` },
        { label: '(2)', q: R`$f(x)$ は $0 < x < \pi$ の範囲の $x = \alpha$ で極大値をとる。$\alpha$ の値を求めよ。`, type: 'num', answer: 2 * PI / 3, show: R`\frac{2\pi}{3}`, hint: R`例: 5π/6` },
        { label: '(3)', q: R`$f(x)$ の極大値を求めよ。`, type: 'num', answer: S3 / 3, show: R`\frac{\sqrt{3}}{3}`, hint: R`例: √2/4` },
        { label: '(4)', q: R`方程式 $f(x) = \dfrac{1}{2}$ の $0 \le x \le 2\pi$ における実数解の個数を求めよ。`, type: 'num', answer: 2 }
      ],
      solution: [
        { t: R`商の微分で $f'(x)$ を求める（(1)）`,
          m: [R`f'(x) = \frac{\cos x\,(2 + \cos x) - \sin x\cdot(-\sin x)}{(2 + \cos x)^{2}}`,
              R`= \frac{2\cos x + \cos^{2}x + \sin^{2}x}{(2 + \cos x)^{2}} = \frac{2\cos x + 1}{(2 + \cos x)^{2}}`],
          n: R`商の微分公式 $\left\{\dfrac{u}{v}\right\}' = \dfrac{u'v - uv'}{v^{2}}$ を、$u = \sin x,\ v = 2 + \cos x$（$u' = \cos x,\ v' = -\sin x$）として使います。分子を展開すると $\cos^{2}x + \sin^{2}x = 1$ が現れて、すっきりした形になります。`,
          easy: R`分数の形の関数を微分するときは、「(分子の微分) $\times$ (分母) $-$ (分子) $\times$ (分母の微分)」を「(分母)$^{2}$」で割ります。$\sin x$ の微分は $\cos x$、$2 + \cos x$ の微分は $-\sin x$ なので、分子は $\cos x(2 + \cos x) + \sin^{2}x$ です。展開すると $2\cos x + \cos^{2}x + \sin^{2}x$ となり、$\sin^{2}x + \cos^{2}x = 1$ を使って $2\cos x + 1$ にまとまります。`,
          pro: R`分母は $(2 + \cos x)^{2} > 0$ なので、$f'(x)$ の符号は分子 $2\cos x + 1$ だけで決まる。商の微分の後は、分子を $\sin^{2} + \cos^{2} = 1$ で整理するのが定石。` },
        { t: R`増減表で極大を見つける（(2)）`,
          m: [R`f'(x) = 0 \;\Leftrightarrow\; \cos x = -\frac{1}{2} \;\Leftrightarrow\; x = \frac{2\pi}{3},\ \frac{4\pi}{3}`,
              R`0 \le x < \frac{2\pi}{3}:\ f'(x) > 0\ (\text{増加}),\qquad \frac{2\pi}{3} < x < \frac{4\pi}{3}:\ f'(x) < 0\ (\text{減少})`,
              R`\frac{4\pi}{3} < x \le 2\pi:\ f'(x) > 0\ (\text{増加}) \;\Rightarrow\; x = \frac{2\pi}{3} \text{ で極大、} x = \frac{4\pi}{3} \text{ で極小}`],
          n: R`符号は $2\cos x + 1$ で決まります。$\cos x > -\dfrac{1}{2}$ すなわち $0 \le x < \dfrac{2\pi}{3}$ と $\dfrac{4\pi}{3} < x \le 2\pi$ では $f'(x) > 0$、$\dfrac{2\pi}{3} < x < \dfrac{4\pi}{3}$ では $f'(x) < 0$ です。増加から減少に変わる $x = \dfrac{2\pi}{3}$ が極大なので、$\alpha = \dfrac{2\pi}{3}$ です。`,
          easy: R`極大は「増加から減少に変わる場所」です。$f'(x)$ が正なら増加中、負なら減少中です。$2\cos x + 1$ の符号は、単位円で $\cos x = -\dfrac{1}{2}$ になる角（$\dfrac{2\pi}{3}$ と $\dfrac{4\pi}{3}$）を境目にして、$\cos x$ が $-\dfrac{1}{2}$ より大きいか小さいかで決まります。$x$ が $0$ から大きくなるにつれて、$\cos x$ は $1$ から減っていき、$x = \dfrac{2\pi}{3}$ で $-\dfrac{1}{2}$ になって、そこで符号が正から負に変わります。` },
        { t: R`極大値を求める（(3)）`,
          m: [R`f\!\left(\frac{2\pi}{3}\right) = \frac{\sin\frac{2\pi}{3}}{2 + \cos\frac{2\pi}{3}} = \frac{\frac{\sqrt{3}}{2}}{2 - \frac{1}{2}} = \frac{\sqrt{3}}{2}\cdot\frac{2}{3} = \frac{\sqrt{3}}{3}`,
              R`\text{（極小値は } f\!\left(\tfrac{4\pi}{3}\right) = -\tfrac{\sqrt{3}}{3} \text{）}`],
          n: R`$\sin\dfrac{2\pi}{3} = \dfrac{\sqrt{3}}{2},\ \cos\dfrac{2\pi}{3} = -\dfrac{1}{2}$ を $f(x)$ に代入します。分母は $2 - \dfrac{1}{2} = \dfrac{3}{2}$ です。極大値は $\dfrac{\sqrt{3}}{3} = 0.577\cdots$ です。`,
          easy: R`$x = \dfrac{2\pi}{3}$（$120\degree$）の三角関数の値は $\sin = \dfrac{\sqrt{3}}{2},\ \cos = -\dfrac{1}{2}$ です。これを $f(x) = \dfrac{\sin x}{2 + \cos x}$ に代入すると、分子が $\dfrac{\sqrt{3}}{2}$、分母が $\dfrac{3}{2}$ で、$\dfrac{\sqrt{3}}{2} \div \dfrac{3}{2} = \dfrac{\sqrt{3}}{3}$ です。`,
          lv: 2 },
        { t: R`極値の大小から解の個数を数える（(4)）`,
          m: [R`f(0) = 0,\quad f\!\left(\frac{2\pi}{3}\right) = \frac{\sqrt{3}}{3},\quad f\!\left(\frac{4\pi}{3}\right) = -\frac{\sqrt{3}}{3},\quad f(2\pi) = 0`,
              R`\left(\frac{\sqrt{3}}{3}\right)^{2} = \frac{1}{3} > \frac{1}{4} = \left(\frac{1}{2}\right)^{2} \;\Rightarrow\; \frac{\sqrt{3}}{3} > \frac{1}{2}`,
              R`\text{増加区間 } [0, \tfrac{2\pi}{3}] \text{ で } 1 \text{ 回、減少区間 } [\tfrac{2\pi}{3}, \tfrac{4\pi}{3}] \text{ で } 1 \text{ 回、最後の増加区間は最大 } 0 < \tfrac{1}{2} \text{ で } 0 \text{ 回}`,
              R`\text{よって解は } 2 \text{ 個}`],
          n: R`$y = f(x)$ のグラフと直線 $y = \dfrac{1}{2}$ の共有点の数を、増減表から数えます。$0 \to \dfrac{\sqrt{3}}{3}$ と増加する区間で $y = \dfrac{1}{2}$ を 1 回通り（$\dfrac{\sqrt{3}}{3} > \dfrac{1}{2}$ だから）、$\dfrac{\sqrt{3}}{3} \to -\dfrac{\sqrt{3}}{3}$ と減少する区間でもう 1 回通ります。最後の区間では $-\dfrac{\sqrt{3}}{3} \to 0$ と増加するだけで、$\dfrac{1}{2}$ には届きません。実際、$x = \dfrac{\pi}{2}$ のとき $f = \dfrac{1}{2}$ で、もう 1 つの解は $\dfrac{\pi}{2}$ と $\dfrac{2\pi}{3}$ の間ではなく $\dfrac{2\pi}{3}$ と $\pi$ の間にあります。`,
          easy: R`方程式 $f(x) = \dfrac{1}{2}$ の解の個数は、グラフ $y = f(x)$ と水平な直線 $y = \dfrac{1}{2}$ の交点の個数です。グラフのイメージは、$0$ から出発して山（高さ $\dfrac{\sqrt{3}}{3} = 0.577$）まで登り、谷（高さ $-0.577$）まで下って、$0$ まで戻る形です。山の高さ $0.577$ は $\dfrac{1}{2}$ より高いので、登りで 1 回、下りで 1 回、直線と交わります。谷から $0$ に戻る最後の登りは、$0$ までしか上がらないので、交わりません。`,
          pro: R`解の個数は「極値と $k$ の大小」で数える。$\dfrac{\sqrt{3}}{3}$ と $\dfrac{1}{2}$ の比較は、両辺を 2 乗して $\dfrac{1}{3}$ と $\dfrac{1}{4}$ を比べる（正の数どうしなら 2 乗しても大小は変わらない）。` }
      ],
      tags: ['商の微分', '増減表', '極値', '三角関数', '方程式の解の個数']
    },

    /* ---------- 積分法（数III）① ---------- */
    {
      id: 'm-mid-integ3-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-integ3',
      title: '対数曲線の接線と面積・回転体',
      source: { univ: 'オリジナル' },
      time: 14,
      body: R`曲線 $C:\ y = \log x$ $(x > 0)$ がある。ただし $\log$ は自然対数、$e$ は自然対数の底とする。原点 O から $C$ に引いた接線を $\ell$、その接点を P とし、$C$、$\ell$ および $x$ 軸で囲まれた図形を $D$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`接点 P の $x$ 座標を求めよ。`, type: 'num', answer: Math.E, show: R`e`, hint: R`自然対数の底を含む値は 2e+1 や e^(3/2) のように入力` },
        { label: '(2)', q: R`接線 $\ell$ の方程式を $y = \boxed{\ \ }$ の形で答えよ。`, type: 'expr', answer: 'x/e', vars: ['x'], show: R`\frac{x}{e}`, hint: R`例: 3x/e（e はそのまま入力）` },
        { label: '(3)', q: R`$D$ の面積 $S$ を求めよ。`, type: 'num', answer: Math.E / 2 - 1, show: R`\frac{e}{2} - 1`, hint: R`例: e/3+1/2` },
        { label: '(4)', q: R`$D$ を $x$ 軸のまわりに 1 回転させてできる立体の体積 $V$ を求めよ。`, type: 'num', answer: 2 * PI / 3 * (3 - Math.E), show: R`\frac{2\pi}{3}(3 - e)`, hint: R`例: π(5-e)/4` }
      ],
      solution: [
        { t: R`接点を $t$ とおいて接線の方程式を作る`,
          m: [R`f(x) = \log x,\qquad f'(x) = \frac{1}{x}`,
              R`\text{接点 } (t,\ \log t) \text{ での接線: } y - \log t = \frac{1}{t}(x - t)`,
              R`\Rightarrow\; y = \frac{x}{t} + \log t - 1`],
          n: R`曲線 $y = f(x)$ 上の点 $(t,\ f(t))$ における接線は $y - f(t) = f'(t)(x - t)$ です。$(\log x)' = \dfrac{1}{x}$ なので、接点 $(t,\ \log t)$ での傾きは $\dfrac{1}{t}$ です。`,
          easy: R`接線は「その点でちょうど曲線に触れる直線」で、傾きは接点での微分係数 $f'(t)$ に等しくなります。対数関数 $\log x$ の導関数は $\dfrac{1}{x}$ なので、$x = t$ での傾きは $\dfrac{1}{t}$ です。点 $(t,\ \log t)$ を通り傾きが $\dfrac{1}{t}$ の直線の式を整理すると $y = \dfrac{x}{t} + \log t - 1$ になります。接点の位置 $t$ はまだ分からないので、文字のままにしておきます。`,
          pro: R`曲線の外の点から引く接線は、「接点を $t$ とおいて接線の式を作り、通る点を代入して $t$ を決める」が定石。` },
        { t: R`原点を通る条件で $t$ を決める（(1)(2)）`,
          m: [R`\ell \text{ が原点 } (0,\ 0) \text{ を通る: } 0 = 0 + \log t - 1`,
              R`\log t = 1 \;\Rightarrow\; t = e`,
              R`\mathrm{P}(e,\ 1),\qquad \ell:\ y = \frac{x}{e}`],
          n: R`接線の式 $y = \dfrac{x}{t} + \log t - 1$ に $x = 0,\ y = 0$ を代入すると $\log t - 1 = 0$ となり、$t = e$ です。したがって接点 P の $x$ 座標は $e$（$y$ 座標は $\log e = 1$）、接線 $\ell$ は傾き $\dfrac{1}{e}$ で原点を通る直線 $y = \dfrac{x}{e}$ です。`,
          easy: R`「原点から引いた接線」という条件は、直線が点 $(0,\ 0)$ を通る、ということです。接線の式に $x = 0,\ y = 0$ を入れると、$t$ だけの方程式 $\log t - 1 = 0$ ができます。$\log t = 1$ は「$e$ を $1$ 乗すると $t$ になる」という意味なので、$t = e$ です。` },
        { t: R`図形 $D$ を確認する`,
          n: R`図の斜線部が $D$ です（シアンの曲線が $C$、紫の直線が $\ell$）。$C$ は $x = 1$ で $x$ 軸と交わり、$x = e$ で $\ell$ と接します。$D$ の上側の境界はつねに直線 $\ell$、下側の境界は $0 \le x \le 1$ では $x$ 軸、$1 \le x \le e$ では曲線 $C$ です。`,
          easy: R`$\log x$ のグラフは上に膨らんだ形（上に凸）なので、接線 $\ell$ は曲線の上側を通ります（接点 P だけで触れます）。$D$ は、原点 O、点 $(1,\ 0)$、接点 $\mathrm{P}(e,\ 1)$ を頂点とする、1 辺が曲がった三角形のような図形です。積分で面積や体積を求めるときは、「どの $x$ の範囲で、上の境界と下の境界が何か」をこのように先に整理しておきます。`,
          fig: figLogTangent() },
        { t: R`面積 $S$ を求める（(3)）`,
          m: [R`S = \int_{0}^{e}\frac{x}{e}\,dx - \int_{1}^{e}\log x\,dx`,
              R`\int_{0}^{e}\frac{x}{e}\,dx = \left[\frac{x^{2}}{2e}\right]_{0}^{e} = \frac{e}{2}`,
              R`\int\log x\,dx = x\log x - \int x\cdot\frac{1}{x}\,dx = x\log x - x`,
              R`\int_{1}^{e}\log x\,dx = \left[x\log x - x\right]_{1}^{e} = 0 - (-1) = 1`,
              R`S = \frac{e}{2} - 1`],
          n: R`面積は「$\ell$ の下側の面積 $-$ $C$ の下側の面積」で求めます。$\ell$ と $x$ 軸と直線 $x = e$ で囲まれた三角形（底辺 $e$、高さ $1$）の面積 $\dfrac{e}{2}$ から、$C$ と $x$ 軸と直線 $x = e$ で囲まれた部分の面積 $\displaystyle\int_{1}^{e}\log x\,dx$ を引きます。$\log x$ の不定積分は、$1\cdot\log x$ と見て部分積分（$(x)' = 1$ を使う）で $x\log x - x$ と求まります。`,
          easy: R`$\ell$ の下側（$x$ 軸との間）の面積は三角形なので、「底辺 $\times$ 高さ $\div\ 2$」$= e \times 1 \div 2 = \dfrac{e}{2}$ です。そこから、$C$ の下側（$x$ 軸との間、$x = 1$ から $x = e$ まで）の面積を引けば、$D$ の面積になります。$\log x$ の積分は、$\log x = 1 \cdot \log x$ と考えて部分積分を使います。「$1$ の方を積分して $x$ にする」「$\log x$ の方を微分して $\dfrac{1}{x}$ にする」と決めると、$x\log x - \displaystyle\int x\cdot\dfrac{1}{x}\,dx = x\log x - x$ となります（微分して $\log x$ に戻ることを確かめられます）。`,
          pro: R`$\displaystyle\int\log x\,dx = x\log x - x$ は結果を覚えておく。$\displaystyle\int_{1}^{e}\log x\,dx = 1$ はよく使う。` },
        { t: R`回転体の体積の式を立てる（(4)）`,
          m: [R`V = \pi\int_{0}^{e}\left(\frac{x}{e}\right)^{2}dx - \pi\int_{1}^{e}(\log x)^{2}\,dx`,
              R`\pi\int_{0}^{e}\frac{x^{2}}{e^{2}}\,dx = \pi\left[\frac{x^{3}}{3e^{2}}\right]_{0}^{e} = \frac{\pi e}{3}`],
          n: R`$x$ 軸のまわりの回転体の体積は $\pi\displaystyle\int y^{2}\,dx$ で求めます。$D$ を回すと、外側の境界 $\ell$ を回した円錐から、内側の境界を回した部分をくり抜いた立体になります。$0 \le x \le 1$ では内側の境界が $x$ 軸（回しても体積 $0$）なので、くり抜くのは $1 \le x \le e$ の曲線 $C$ を回した部分だけです。第 1 項は円錐（底面の半径 $1$、高さ $e$）の体積 $\dfrac{1}{3}\pi\cdot 1^{2}\cdot e = \dfrac{\pi e}{3}$ に一致します。`,
          easy: R`回転体の体積は、$x$ 軸に垂直な平面で薄く切ったときの断面積 $\pi\times(\text{半径})^{2}$ を、$x$ について足し合わせる（積分する）ことで求めます。この問題では、$0 \le x \le 1$ の断面は半径 $\dfrac{x}{e}$ の円板、$1 \le x \le e$ の断面は「外側の半径が $\dfrac{x}{e}$、内側の半径が $\log x$ の輪（ドーナツ形）」です。そこで、直線 $\ell$ を回してできる円錐の体積から、曲線 $C$ を回してできる立体の体積を引く、と考えます。`,
          pro: R`$\ell$ を回した立体は円錐（$r = 1,\ h = e$）なので、積分せずに $\dfrac{\pi e}{3}$ と書ける。` },
        { t: R`$\displaystyle\int_{1}^{e}(\log x)^{2}\,dx$ を部分積分で求める`,
          m: [R`\int(\log x)^{2}\,dx = x(\log x)^{2} - \int x\cdot 2\log x\cdot\frac{1}{x}\,dx`,
              R`= x(\log x)^{2} - 2\int\log x\,dx = x(\log x)^{2} - 2(x\log x - x)`,
              R`= x(\log x)^{2} - 2x\log x + 2x`,
              R`\int_{1}^{e}(\log x)^{2}\,dx = \left[x(\log x)^{2} - 2x\log x + 2x\right]_{1}^{e}`,
              R`= (e - 2e + 2e) - (0 - 0 + 2) = e - 2`],
          n: R`$(\log x)^{2} = 1\cdot(\log x)^{2}$ と見て部分積分します（$(x)' = 1$、$\left\{(\log x)^{2}\right\}' = 2\log x\cdot\dfrac{1}{x}$）。すると $x \cdot \dfrac{1}{x}$ が約分されて $\log x$ の積分が残り、(3) で求めた $x\log x - x$ が使えます。`,
          easy: R`$(\log x)^{2}$ の積分も、(3) の $\log x$ の積分と同じ方針で部分積分します。「$1$ の方を積分して $x$ にする」「$(\log x)^{2}$ の方を微分して $2\log x\cdot\dfrac{1}{x}$ にする」と決めると、$x\cdot 2\log x\cdot\dfrac{1}{x} = 2\log x$ と $x$ が約分されて、$2\displaystyle\int\log x\,dx$ だけが残ります。これは (3) の結果 $x\log x - x$ をそのまま使えば計算できます。代入のときは $\log e = 1,\ \log 1 = 0$ に注意します。`,
          lv: 2 },
        { t: R`体積を求める（(4)）`,
          m: [R`V = \frac{\pi e}{3} - \pi(e - 2) = \pi\left(2 - \frac{2e}{3}\right) = \frac{2\pi}{3}(3 - e)`,
              R`\fallingdotseq \frac{2 \times 3.1416}{3} \times 0.2817 \fallingdotseq 0.590`],
          n: R`前の式に $\displaystyle\int_{1}^{e}(\log x)^{2}\,dx = e - 2$ を代入して整理すると、$V = \dfrac{2\pi}{3}(3 - e)$ です。$e = 2.718\cdots < 3$ なので $V > 0$ で、値は約 $0.590$ です（円錐の体積 $\dfrac{\pi e}{3} \fallingdotseq 2.85$ から、くり抜く部分 $\pi(e - 2) \fallingdotseq 2.26$ を引いた残りです）。`,
          easy: R`先に求めた $\displaystyle\int_{1}^{e}(\log x)^{2}\,dx = e - 2$ に $\pi$ をかけると、くり抜く部分の体積 $\pi(e - 2)$ になります。円錐の体積 $\dfrac{\pi e}{3}$ からこれを引くと、$\dfrac{\pi e}{3} - \pi e + 2\pi = 2\pi - \dfrac{2\pi e}{3}$ です。$\dfrac{2\pi}{3}$ でくくると $\dfrac{2\pi}{3}(3 - e)$ となり、$e = 2.718\cdots$ を入れると約 $0.590$ です。$e < 3$ なので $3 - e > 0$ で、体積が正の値になっていることも確かめられます。`,
          pro: R`$\displaystyle\int_{1}^{e}(\log x)^{2}\,dx = e - 2$ は、$x = e^{y}$ と置換すると $\displaystyle\int_{0}^{1}y^{2}e^{y}\,dy$ になるので、「多項式 $\times\ e^{y}$」の部分積分としても出せる。` }
      ],
      tags: ['接線', '面積', '回転体', '部分積分', '対数関数']
    },

    /* ---------- 積分法（数III）② ---------- */
    {
      id: 'm-mid-integ3-02',
      subject: 'math',
      level: 'mid',
      unit: 'm-integ3',
      title: '定積分の漸化式と極限',
      source: { univ: 'オリジナル' },
      time: 13,
      body: R`$n = 0,\ 1,\ 2,\ \cdots$ に対して、$I_{n} = \displaystyle\int_{0}^{1} x^{n}e^{x}\,dx$ とおく。ただし $e$ は自然対数の底である。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$I_{1}$ の値を求めよ。`, type: 'num', answer: 1 },
        { label: '(2)', q: R`$n \ge 1$ のとき、$I_{n} = e - \boxed{\ \ }\ I_{n-1}$ が成り立つ。空欄に入る式（$n$ の式）を答えよ。`, type: 'expr', answer: 'n', vars: ['n'], show: R`n`, hint: R`例: 2n+1` },
        { label: '(3)a', q: R`$I_{4} = a\,e + b$（$a,\ b$ は整数）と表すとき、$a$ の値を求めよ。`, type: 'num', answer: 9 },
        { label: '(3)b', q: R`同じく $b$ の値を求めよ。`, type: 'num', answer: -24 },
        { label: '(4)', q: R`極限 $\displaystyle\lim_{n \to \infty} n I_{n-1}$ の値を求めよ。`, type: 'num', answer: Math.E, show: R`e`, hint: R`自然対数の底を含む値は 2e+1 や e^(3/2) のように入力` }
      ],
      solution: [
        { t: R`$I_{1}$ を部分積分で求める（(1)）`,
          m: [R`\int_{0}^{1} f(x)\,g'(x)\,dx = \left[f(x)g(x)\right]_{0}^{1} - \int_{0}^{1} f'(x)\,g(x)\,dx`,
              R`I_{1} = \int_{0}^{1} x\,(e^{x})'\,dx = \left[xe^{x}\right]_{0}^{1} - \int_{0}^{1} 1\cdot e^{x}\,dx`,
              R`= e - \left[e^{x}\right]_{0}^{1} = e - (e - 1) = 1`],
          n: R`$x^{n}e^{x}$ のように「多項式 $\times$ 指数関数」の積分は、$e^{x}$ を積分する側、多項式を微分する側と決めて部分積分します。上の公式で $f(x) = x,\ g(x) = e^{x}$ とおくと、$x$ の次数が 1 つ下がって積分しやすくなります。`,
          easy: R`部分積分の公式は $\displaystyle\int f\,g'\,dx = fg - \int f'\,g\,dx$ です。積の微分公式 $(fg)' = f'g + fg'$ を積分して移項した形、と考えると覚えやすくなります。$xe^{x}$ では、$e^{x}$ は積分しても形が変わらず、$x$ は微分すると $1$ になって次数が下がるので、$f = x,\ g = e^{x}$ と選びます。`,
          pro: R`「多項式 $\times\ e^{x}$」は、多項式を微分する側にして次数を下げるのが部分積分の定石。` },
        { t: R`漸化式を作る（(2)）`,
          m: [R`I_{n} = \int_{0}^{1} x^{n}(e^{x})'\,dx = \left[x^{n}e^{x}\right]_{0}^{1} - \int_{0}^{1} nx^{n-1}e^{x}\,dx`,
              R`= e - n\int_{0}^{1} x^{n-1}e^{x}\,dx = e - n\,I_{n-1}\qquad (n \ge 1)`],
          n: R`(1) と同じ部分積分を一般の $n$ で行います。$\left[x^{n}e^{x}\right]_{0}^{1} = 1^{n}e^{1} - 0^{n}e^{0} = e$（$n \ge 1$ のとき $0^{n} = 0$）で、残った積分は $x^{n-1}e^{x}$ の積分、つまり $I_{n-1}$ です。よって空欄は $n$ です。（$n = 1$ のとき、$I_{0} = \displaystyle\int_{0}^{1} e^{x}\,dx = e - 1$ なので $I_{1} = e - 1\cdot(e - 1) = 1$ となり、(1) と一致します。）`,
          easy: R`$I_{n}$ の中の $x^{n}$ を微分すると $nx^{n-1}$ になり、$x$ の次数が 1 つ下がります。その結果、残る積分は $I_{n-1}$ の $n$ 倍の形になって、「$I_{n}$ を 1 つ前の $I_{n-1}$ で表す式」（漸化式）が得られます。$\left[x^{n}e^{x}\right]_{0}^{1}$ は、上端 $x = 1$ で $e$、下端 $x = 0$ で $0$（$n \ge 1$ のとき）なので、$e$ だけが残ります。`,
          pro: R`$I_{n} = e - nI_{n-1}$ は定積分の漸化式の典型。$I_{0} = e - 1$ から順に $I_{1} = 1,\ I_{2} = e - 2,\ \cdots$ と求まる。` },
        { t: R`漸化式で $I_{2},\ I_{3},\ I_{4}$ を順に求める（(3)）`,
          m: [R`I_{2} = e - 2I_{1} = e - 2`,
              R`I_{3} = e - 3I_{2} = e - 3(e - 2) = 6 - 2e`,
              R`I_{4} = e - 4I_{3} = e - 4(6 - 2e) = 9e - 24`,
              R`a = 9,\qquad b = -24`],
          n: R`$I_{1} = 1$ から出発して、漸化式 $I_{n} = e - nI_{n-1}$ を $n = 2,\ 3,\ 4$ と順に使います。どれも「$e$ の 1 次式（整数係数）」の形になります。$I_{4} = 9e - 24$ の値は約 $0.4645$ です。`,
          easy: R`漸化式は「前の値から次の値を作るルール」です。$n = 2$ なら $I_{2} = e - 2I_{1}$ で、$I_{1} = 1$ を入れて $I_{2} = e - 2$。次は $n = 3$ で、$I_{3} = e - 3I_{2}$ に $I_{2} = e - 2$ を入れ、かっこを展開すると $e - 3e + 6 = 6 - 2e$。同様に $n = 4$ で $I_{4} = e - 4(6 - 2e) = e - 24 + 8e = 9e - 24$ となります。かっこの前のマイナスで符号が変わる（$-4 \times (-2e) = +8e$）ところに注意します。`,
          lv: 2 },
        { t: R`$I_{n}$ をはさみうちで評価する`,
          m: [R`0 \le x \le 1 \;\Rightarrow\; 1 \le e^{x} \le e \;\Rightarrow\; x^{n} \le x^{n}e^{x} \le e\,x^{n}`,
              R`\frac{1}{n+1} = \int_{0}^{1} x^{n}\,dx \;\le\; I_{n} \;\le\; e\int_{0}^{1} x^{n}\,dx = \frac{e}{n+1}`,
              R`\lim_{n \to \infty}\frac{1}{n+1} = \lim_{n \to \infty}\frac{e}{n+1} = 0 \;\Rightarrow\; \lim_{n \to \infty} I_{n} = 0`],
          n: R`極限を求めるために、まず $I_{n}$ 自身がどうなるかを調べます。積分区間 $0 \le x \le 1$ では $1 \le e^{x} \le e$ なので、$x^{n} \le x^{n}e^{x} \le e\,x^{n}$ です。各辺を $0$ から $1$ まで積分すると $\dfrac{1}{n+1} \le I_{n} \le \dfrac{e}{n+1}$ が得られます。両側が $0$ に近づくので、はさみうちの原理により $I_{n} \to 0$ です。`,
          easy: R`「はさみうちの原理」は、数列 $a_{n}$ が $b_{n} \le a_{n} \le c_{n}$ を満たし、$b_{n}$ と $c_{n}$ が同じ値に近づくなら、$a_{n}$ もその値に近づく、というものです。ここでは $I_{n}$ を $\dfrac{1}{n+1}$ と $\dfrac{e}{n+1}$ ではさみます。積分しにくい $e^{x}$ を、区間の両端の値 $1$ と $e$ でおさえて、積分しやすい $x^{n}$ の形にするのがポイントで、$\displaystyle\int_{0}^{1} x^{n}\,dx = \dfrac{1}{n+1}$ です。（たとえば $n = 4$ なら $0.2 \le I_{4} \le 0.5437$ で、(3) の $I_{4} \fallingdotseq 0.4645$ はこの範囲に入っています。）`,
          pro: R`$e^{x}$ を区間の端の値 $1,\ e$ でおさえて、はさみうちに持ち込むのが定石。` },
        { t: R`漸化式に戻って極限を求める（(4)）`,
          m: [R`I_{n} = e - nI_{n-1} \;\Rightarrow\; nI_{n-1} = e - I_{n}`,
              R`\lim_{n \to \infty} nI_{n-1} = \lim_{n \to \infty}\left(e - I_{n}\right) = e - 0 = e`],
          n: R`漸化式 $I_{n} = e - nI_{n-1}$ を $nI_{n-1}$ について解くと $nI_{n-1} = e - I_{n}$ です。$I_{n} \to 0$ なので、$nI_{n-1} \to e$ です。$I_{n-1}$ そのものは $0$ に近づきますが、$n$ 倍すると $e$ に近づく、つまり $I_{n-1}$ は $\dfrac{e}{n}$ 程度の大きさだと分かります。`,
          easy: R`$nI_{n-1}$ は、「$0$ に近づく $I_{n-1}$」と「どんどん大きくなる $n$」の積なので、そのままでは極限が分かりません。そこで漸化式 $I_{n} = e - nI_{n-1}$ を使い、$nI_{n-1} = e - I_{n}$ と書きかえます。右辺は、前のステップで $I_{n} \to 0$ と分かっているので $e - 0 = e$ に近づきます。実際、$n = 10$ のとき $10\,I_{9} \fallingdotseq 2.49$、$n = 50$ のとき $50\,I_{49} \fallingdotseq 2.67$ で、$n$ を大きくすると $e = 2.718\cdots$ に近づいていきます。`,
          pro: R`「$I_{n} \to 0$ $\Rightarrow$ $nI_{n-1} = e - I_{n} \to e$」。$I_{n} \sim \dfrac{e}{n}$ のオーダーがつかめる。` }
      ],
      tags: ['定積分の漸化式', '部分積分', 'はさみうちの原理', '極限']
    },

    /* ---------- 複素数平面 ---------- */
    {
      id: 'm-mid-cplane-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-cplane',
      title: '正三角形をなす 3 点と外接円',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`複素数平面上に 2 点 $\mathrm{A}(\alpha),\ \mathrm{B}(\beta)$ があり、$\alpha = 1 + i,\ \beta = 5 + i$ である。$\triangle\mathrm{ABC}$ が正三角形となるように点 $\mathrm{C}(\gamma)$ をとる。ただし $\gamma$ の虚部は $1$ より大きいものとする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\dfrac{\gamma - \alpha}{\beta - \alpha}$ の虚部を求めよ。`, type: 'num', answer: S3 / 2, show: R`\frac{\sqrt{3}}{2}`, hint: R`例: √3/4` },
        { label: '(2)', q: R`$\gamma$ の虚部を求めよ。`, type: 'num', answer: 1 + 2 * S3, show: R`1 + 2\sqrt{3}`, hint: R`例: 2+3√2` },
        { label: '(3)', q: R`$\triangle\mathrm{ABC}$ の外接円の半径を求めよ。`, type: 'num', answer: 4 * S3 / 3, show: R`\frac{4\sqrt{3}}{3}`, hint: R`例: 2√5/3` },
        { label: '(4)', q: R`点 $z$ が $\triangle\mathrm{ABC}$ の外接円の周上を動くとき、$|z - \alpha|^{2} + |z - \beta|^{2} + |z - \gamma|^{2}$ の値は一定である。その値を求めよ。`, type: 'num', answer: 32 }
      ],
      solution: [
        { t: R`正三角形の条件を複素数の式にする（(1)）`,
          m: [R`\beta - \alpha = 4,\qquad \left|\frac{\gamma - \alpha}{\beta - \alpha}\right| = \frac{\mathrm{AC}}{\mathrm{AB}} = 1`,
              R`\arg\frac{\gamma - \alpha}{\beta - \alpha} = \angle\mathrm{BAC} = \pm\frac{\pi}{3}`,
              R`\text{C は AB の上側} \;\Rightarrow\; \arg\frac{\gamma - \alpha}{\beta - \alpha} = +\frac{\pi}{3}`,
              R`\frac{\gamma - \alpha}{\beta - \alpha} = \cos\frac{\pi}{3} + i\sin\frac{\pi}{3} = \frac{1}{2} + \frac{\sqrt{3}}{2}\,i`],
          n: R`$\dfrac{\gamma - \alpha}{\beta - \alpha}$ は、ベクトル $\overrightarrow{\mathrm{AB}}$ をベクトル $\overrightarrow{\mathrm{AC}}$ に重ねる「拡大と回転」を表す複素数です。絶対値は長さの比 $\dfrac{\mathrm{AC}}{\mathrm{AB}}$、偏角は $\overrightarrow{\mathrm{AB}}$ から $\overrightarrow{\mathrm{AC}}$ までの回転角 $\angle\mathrm{BAC}$ です。正三角形なので $\mathrm{AC} = \mathrm{AB}$（絶対値 $1$）、$\angle\mathrm{BAC} = \dfrac{\pi}{3}$ です。ここでは $\beta - \alpha = 4$ が正の実数で、$\overrightarrow{\mathrm{AB}}$ は $x$ 軸の正の向きです。C は上側にあるので、$\overrightarrow{\mathrm{AC}}$ は反時計回りに $\dfrac{\pi}{3}$ 回転した向きで、$\dfrac{\gamma - \alpha}{\beta - \alpha} = \dfrac{1}{2} + \dfrac{\sqrt{3}}{2}\,i$、虚部は $\dfrac{\sqrt{3}}{2}$ です。`,
          easy: R`複素数どうしのかけ算・割り算は、「長さの拡大・縮小」と「向きの回転」を同時に表します。たとえば $z$ に $\cos\theta + i\sin\theta$ をかけると、$z$ は原点のまわりに $\theta$ だけ回転します。点 A を基準に考えると、ベクトル $\overrightarrow{\mathrm{AB}}$ は複素数 $\beta - \alpha$、ベクトル $\overrightarrow{\mathrm{AC}}$ は複素数 $\gamma - \alpha$ で表せます。正三角形では、$\overrightarrow{\mathrm{AC}}$ は $\overrightarrow{\mathrm{AB}}$ を $60\degree$（$\dfrac{\pi}{3}$）回転しただけで、長さは同じです。だから $\gamma - \alpha = (\beta - \alpha)\left(\cos\dfrac{\pi}{3} + i\sin\dfrac{\pi}{3}\right)$、すなわち $\dfrac{\gamma - \alpha}{\beta - \alpha} = \cos\dfrac{\pi}{3} + i\sin\dfrac{\pi}{3}$ です。C が AB の上側にあるので、回転の向きは反時計回り（$+\dfrac{\pi}{3}$）です。`,
          pro: R`正三角形 ABC の条件は $\dfrac{\gamma - \alpha}{\beta - \alpha} = \dfrac{1 \pm \sqrt{3}\,i}{2}$（$= \cos(\pm 60\degree) + i\sin(\pm 60\degree)$）。符号は C が AB の左側（反時計回り）なら $+$、右側なら $-$。` },
        { t: R`$\gamma$ を求める（(2)）`,
          m: [R`\gamma - \alpha = (\beta - \alpha)\left(\frac{1}{2} + \frac{\sqrt{3}}{2}\,i\right) = 4\left(\frac{1}{2} + \frac{\sqrt{3}}{2}\,i\right)`,
              R`= 2 + 2\sqrt{3}\,i`,
              R`\gamma = (1 + i) + (2 + 2\sqrt{3}\,i) = 3 + \left(1 + 2\sqrt{3}\right)i`],
          n: R`(1) の関係を $\gamma$ について解きます。$\gamma = \alpha + (\beta - \alpha)\left(\dfrac{1}{2} + \dfrac{\sqrt{3}}{2}\,i\right)$ に $\alpha = 1 + i,\ \beta - \alpha = 4$ を代入すると $\gamma = 3 + (1 + 2\sqrt{3})\,i$ で、虚部は $1 + 2\sqrt{3} \fallingdotseq 4.46$ です。（検算）$|\gamma - \alpha|^{2} = 2^{2} + (2\sqrt{3})^{2} = 16$、$|\gamma - \beta|^{2} = (-2)^{2} + (2\sqrt{3})^{2} = 16$ で、$\mathrm{AB} = \mathrm{AC} = \mathrm{BC} = 4$ になっています。`,
          easy: R`(1) で求めた「$\overrightarrow{\mathrm{AB}}$ を $60\degree$ 回転すると $\overrightarrow{\mathrm{AC}}$ になる」という関係から、$\gamma - \alpha = 4\left(\dfrac{1}{2} + \dfrac{\sqrt{3}}{2}\,i\right) = 2 + 2\sqrt{3}\,i$ です。これは A を基準にした C の位置（右へ $2$、上へ $2\sqrt{3}$）を表すので、A の位置 $1 + i$ に足して C の位置 $\gamma = 3 + (1 + 2\sqrt{3})\,i$ が求まります。C は線分 AB の真ん中（実部 $3$）の真上にあります。` },
        { t: R`外接円の中心と半径（(3)）`,
          m: [R`\text{正三角形の外心は重心に一致する: } G = \frac{\alpha + \beta + \gamma}{3}`,
              R`= \frac{9 + (3 + 2\sqrt{3})\,i}{3} = 3 + \left(1 + \frac{2\sqrt{3}}{3}\right)i`,
              R`R = |\alpha - G| = \left|-2 - \frac{2\sqrt{3}}{3}\,i\right|`,
              R`= \sqrt{4 + \frac{4}{3}} = \sqrt{\frac{16}{3}} = \frac{4\sqrt{3}}{3}`],
          n: R`正三角形では、外心・重心・内心・垂心がすべて一致します。よって外接円の中心は重心 $G = \dfrac{\alpha + \beta + \gamma}{3}$ で、半径は $G$ から頂点 A までの距離 $|\alpha - G|$ です。$G = 3 + \left(1 + \dfrac{2\sqrt{3}}{3}\right)i$ なので、$R = \dfrac{4\sqrt{3}}{3} \fallingdotseq 2.31$ です。`,
          easy: R`正三角形は「どの頂点から見ても同じ形」なので、3 つの頂点から等しい距離にある点（外心）は、重心（3 頂点の位置の平均）と同じ場所になります。複素数平面では、3 点の複素数の平均 $\dfrac{\alpha + \beta + \gamma}{3}$ が重心を表します。外接円の半径は、その中心から頂点 A までの距離で、複素数の差の絶対値 $|\alpha - G|$ として計算できます。`,
          pro: R`1 辺 $a$ の正三角形の外接円の半径は $R = \dfrac{a}{\sqrt{3}}$（正弦定理 $\dfrac{a}{\sin 60\degree} = 2R$ から）。$a = 4$ なら $\dfrac{4}{\sqrt{3}} = \dfrac{4\sqrt{3}}{3}$ と一発で出る。` },
        { t: R`外接円上の点 $z = \alpha$ を代入して値を決める（(4)）`,
          m: [R`\text{一定なので、外接円上の点 } z = \alpha \text{（頂点 A）で計算する}`,
              R`|\alpha - \alpha|^{2} + |\alpha - \beta|^{2} + |\alpha - \gamma|^{2} = 0 + 4^{2} + 4^{2} = 32`],
          n: R`問題文のとおり、この和が外接円の周上で一定であるなら、周上の計算しやすい点を 1 つ選んで値を決めれば十分です。頂点 A（$z = \alpha$）は外接円の周上にあるので、$z = \alpha$ を代入します。$|\alpha - \alpha| = 0$、$|\alpha - \beta| = \mathrm{AB} = 4$、$|\alpha - \gamma| = \mathrm{AC} = 4$ なので、和は $0 + 16 + 16 = 32$ です。`,
          easy: R`$|z - \alpha|$ は「点 $z$ と点 A の距離」です。だから $|z - \alpha|^{2} + |z - \beta|^{2} + |z - \gamma|^{2}$ は、「点 $z$ から 3 つの頂点 A, B, C までの距離の 2 乗の和」です。外接円の周上のどこに $z$ をおいてもこの和が同じになる、と問題文が教えてくれているので、いちばん計算しやすい位置（頂点 A そのもの）に $z$ をおきます。A までの距離は $0$、B と C までの距離は正三角形の 1 辺の長さ $4$ なので、$0 + 16 + 16 = 32$ です。`,
          pro: R`「周上で一定」と分かっているなら、周上の特別な点（頂点・対称な点）を代入して値を決めるのが速い。` },
        { t: R`値が $z$ によらず一定になる理由（確認）`,
          m: [R`G = \frac{\alpha + \beta + \gamma}{3},\qquad u = z - G`,
              R`v_{1} = \alpha - G,\quad v_{2} = \beta - G,\quad v_{3} = \gamma - G`,
              R`v_{1} + v_{2} + v_{3} = 0,\qquad |v_{1}| = |v_{2}| = |v_{3}| = R`,
              R`|u - v_{k}|^{2} = |u|^{2} - 2\,\mathrm{Re}\left(u\,\overline{v_{k}}\right) + |v_{k}|^{2}`,
              R`\sum_{k=1}^{3}|u - v_{k}|^{2} = 3|u|^{2} - 2\,\mathrm{Re}\left(u\,\overline{v_{1} + v_{2} + v_{3}}\right) + 3R^{2}`,
              R`= 3|z - G|^{2} + 3R^{2}`,
              R`|z - G| = R \;\Rightarrow\; 3R^{2} + 3R^{2} = 6R^{2} = 6\cdot\frac{16}{3} = 32`],
          n: R`$z$ を外接円上で動かしても和が変わらないのは、重心 G を基準にして展開すると、$z$ に関する 1 次の項が消えるからです。$|u - v|^{2} = |u|^{2} - 2\,\mathrm{Re}(u\bar{v}) + |v|^{2}$ を 3 頂点について足すと、$v_{1} + v_{2} + v_{3} = 0$（G が重心だから）によって $\mathrm{Re}$ の項がちょうど打ち消し合います。残るのは $3|z - G|^{2} + 3R^{2}$ で、$z$ が外接円の周上（$|z - G| = R$）なら $6R^{2} = 32$ です。円周上でなければ値は変わります（たとえば $|z - G| = 2R$ の点では $3\cdot 4R^{2} + 3R^{2} = 15R^{2} = 80$ です）。`,
          easy: R`複素数 $w$ の絶対値の 2 乗は $|w|^{2} = w\bar{w}$（$\bar{w}$ は $w$ の共役複素数）です。これを使うと $|u - v|^{2} = (u - v)(\bar{u} - \bar{v}) = |u|^{2} - u\bar{v} - \bar{u}v + |v|^{2}$ と展開でき、$u\bar{v} + \bar{u}v$ は実部の 2 倍 $2\,\mathrm{Re}(u\bar{v})$ になります。3 つの頂点 $v_{1},\ v_{2},\ v_{3}$ について足すと、$z$ を含む項は $u\,\overline{(v_{1} + v_{2} + v_{3})}$ にまとまり、重心の性質 $v_{1} + v_{2} + v_{3} = 0$ によって $0$ になります。だから和は $3|u|^{2} + 3R^{2}$ だけになり、$|u| = R$ の円周上では一定の値 $6R^{2}$ です。`,
          lv: 2 }
      ],
      tags: ['正三角形', '回転', '外接円', '重心', '複素数平面']
    },

    /* ---------- 2次曲線 ---------- */
    {
      id: 'm-mid-conic-01',
      subject: 'math',
      level: 'mid',
      unit: 'm-conic',
      title: '双曲線の焦点・接線・漸近線',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`双曲線 $H:\ \dfrac{x^{2}}{4} - \dfrac{y^{2}}{5} = 1$ の 2 つの焦点のうち、$x$ 座標が正のものを F、負のものを $\mathrm{F'}$ とする。$H$ 上の点 $\mathrm{P}\left(3,\ \dfrac{5}{2}\right)$ について、次の問いに答えよ。`,
      fig: figHyperbola(false),
      parts: [
        { label: '(1)', q: R`$H$ の離心率を求めよ。`, type: 'num', answer: 3 / 2, show: R`\frac{3}{2}`, hint: R`例: 5/4 や 1.25` },
        { label: '(2)', q: R`線分 $\mathrm{PF'}$ の長さを求めよ。`, type: 'num', answer: 13 / 2, show: R`\frac{13}{2}`, hint: R`例: 17/3` },
        { label: '(3)', q: R`点 P における $H$ の接線の方程式を $y = \boxed{\ \ }$ の形で答えよ。`, type: 'expr', answer: '3x/2-2', vars: ['x'], show: R`\frac{3}{2}x - 2`, hint: R`例: 5x/4+1` },
        { label: '(4)', q: R`(3) の接線が $H$ の 2 本の漸近線と交わる点を A, B とする。O を原点として、$\triangle\mathrm{OAB}$ の面積を求めよ。`, type: 'num', answer: 2 * S5, show: R`2\sqrt{5}`, hint: R`例: 3√2` }
      ],
      solution: [
        { t: R`$a,\ b,\ c$ と離心率（(1)）`,
          m: [R`a^{2} = 4,\quad b^{2} = 5 \;\Rightarrow\; a = 2,\quad b = \sqrt{5}`,
              R`c = \sqrt{a^{2} + b^{2}} = \sqrt{4 + 5} = 3,\qquad \mathrm{F}(3,\ 0),\quad \mathrm{F'}(-3,\ 0)`,
              R`e = \frac{c}{a} = \frac{3}{2}`],
          n: R`双曲線 $\dfrac{x^{2}}{a^{2}} - \dfrac{y^{2}}{b^{2}} = 1$ の焦点は $(\pm c,\ 0)$ で、$c = \sqrt{a^{2} + b^{2}}$ です（楕円の $c = \sqrt{a^{2} - b^{2}}$ とは符号が逆です）。離心率は $e = \dfrac{c}{a}$ で、双曲線では $e > 1$ になります。`,
          easy: R`双曲線は「2 つの定点（焦点）からの距離の差が一定」である点の集まりで、この式のように $x^{2}$ の項が正の形では、焦点は $x$ 軸上にあります。式の分母から $a^{2} = 4,\ b^{2} = 5$ を読み取り、焦点の位置 $c$ は $c^{2} = a^{2} + b^{2} = 9$ で決まります（楕円は $a^{2} - b^{2}$ でしたが、双曲線は足し算です）。離心率は「焦点の遠さ」を表す数で、$\dfrac{c}{a} = \dfrac{3}{2}$ です。`,
          pro: R`焦点の位置は $c^{2} = a^{2} + b^{2}$（楕円と逆）、離心率は $e = \dfrac{c}{a} > 1$。セットで押さえる。` },
        { t: R`焦点までの距離（(2)）`,
          m: [R`\mathrm{PF'} = \sqrt{(3 + 3)^{2} + \left(\frac{5}{2}\right)^{2}} = \sqrt{36 + \frac{25}{4}} = \sqrt{\frac{169}{4}} = \frac{13}{2}`,
              R`\text{（検算）}\ \mathrm{PF} = \frac{5}{2},\quad \mathrm{PF'} - \mathrm{PF} = \frac{13}{2} - \frac{5}{2} = 4 = 2a`],
          n: R`P の $x$ 座標は焦点 F の $x$ 座標と同じ $3$ なので、$\mathrm{PF} = \dfrac{5}{2}$（P の $y$ 座標そのもの）です。$\mathrm{PF'}$ は 2 点間の距離の公式から $\dfrac{13}{2}$ です。双曲線の定義「2 つの焦点からの距離の差が一定で $2a$」を使って、$\mathrm{PF'} = \mathrm{PF} + 2a = \dfrac{5}{2} + 4 = \dfrac{13}{2}$ としても求められます。`,
          easy: R`2 点間の距離は、$x$ 座標の差と $y$ 座標の差から三平方の定理で求めます。$\mathrm{P}\left(3,\ \dfrac{5}{2}\right)$ と $\mathrm{F'}(-3,\ 0)$ では、$x$ 座標の差が $6$、$y$ 座標の差が $\dfrac{5}{2}$ なので、$\sqrt{6^{2} + \left(\dfrac{5}{2}\right)^{2}} = \dfrac{13}{2}$ です。もう 1 つの焦点 $\mathrm{F}(3,\ 0)$ は P の真下にあるので、$\mathrm{PF} = \dfrac{5}{2}$ とすぐ分かります。双曲線上の点では「$\mathrm{PF'} - \mathrm{PF}$ がいつも $2a = 4$」という性質があり、$\dfrac{13}{2} - \dfrac{5}{2} = 4$ と確かに成り立っています。`,
          pro: R`双曲線の定義 $\left|\mathrm{PF'} - \mathrm{PF}\right| = 2a$ を使うと、PF がすぐ分かる点（ここでは F の真上の点）では $\mathrm{PF'}$ が暗算で出る。` },
        { t: R`点 P における接線（(3)）`,
          m: [R`\text{接線の公式: } \frac{x_{1}x}{a^{2}} - \frac{y_{1}y}{b^{2}} = 1 \qquad (x_{1},\ y_{1}) = \left(3,\ \frac{5}{2}\right)`,
              R`\frac{3x}{4} - \frac{\frac{5}{2}\,y}{5} = 1 \;\Rightarrow\; \frac{3}{4}x - \frac{1}{2}y = 1 \;\Rightarrow\; y = \frac{3}{2}x - 2`],
          n: R`双曲線 $\dfrac{x^{2}}{a^{2}} - \dfrac{y^{2}}{b^{2}} = 1$ 上の点 $(x_{1},\ y_{1})$ における接線は $\dfrac{x_{1}x}{a^{2}} - \dfrac{y_{1}y}{b^{2}} = 1$ です。$a^{2} = 4,\ b^{2} = 5$ と $(x_{1},\ y_{1}) = \left(3,\ \dfrac{5}{2}\right)$ を代入して整理します。（検算）陰関数の微分 $\dfrac{2x}{4} - \dfrac{2yy'}{5} = 0$ から $y' = \dfrac{5x}{4y}$ で、P での傾きは $\dfrac{5 \cdot 3}{4 \cdot \frac{5}{2}} = \dfrac{3}{2}$ です。$y - \dfrac{5}{2} = \dfrac{3}{2}(x - 3)$ より $y = \dfrac{3}{2}x - 2$ となり、一致します。`,
          easy: R`曲線の接線の公式は、元の式の $x^{2}$ を $x_{1}x$ に、$y^{2}$ を $y_{1}y$ に置きかえたものです（楕円の接線の公式と同じ作り方で、双曲線は引き算のままです）。$\dfrac{x^{2}}{4} - \dfrac{y^{2}}{5} = 1$ から $\dfrac{3x}{4} - \dfrac{\frac{5}{2}y}{5} = 1$ となり、整理すると $\dfrac{3}{4}x - \dfrac{1}{2}y = 1$ です。両辺に $2$ をかけて $\dfrac{3}{2}x - y = 2$、すなわち $y = \dfrac{3}{2}x - 2$ です。`,
          pro: R`接線の公式は暗記して使う（$x^{2} \to x_{1}x,\ y^{2} \to y_{1}y$）。微分で確かめるなら $y' = \dfrac{b^{2}x}{a^{2}y}$。` },
        { t: R`漸近線の方程式`,
          m: [R`\frac{x^{2}}{4} - \frac{y^{2}}{5} = 0 \;\Rightarrow\; y = \pm\frac{b}{a}\,x = \pm\frac{\sqrt{5}}{2}\,x`],
          n: R`双曲線 $\dfrac{x^{2}}{a^{2}} - \dfrac{y^{2}}{b^{2}} = 1$ の漸近線は $y = \pm\dfrac{b}{a}x$ です（右辺の $1$ を $0$ にした式を因数分解すると得られます）。ここでは $a = 2,\ b = \sqrt{5}$ なので $y = \pm\dfrac{\sqrt{5}}{2}x$ です。`,
          easy: R`漸近線は、「$x$ や $y$ が大きくなるにつれて、双曲線がどんどん近づいていく直線」です。$x,\ y$ が大きいと右辺の $1$ は目立たなくなるので、$\dfrac{x^{2}}{4} - \dfrac{y^{2}}{5} = 0$ に近い状態になります。これを $y$ について解くと $y^{2} = \dfrac{5}{4}x^{2}$、つまり $y = \pm\dfrac{\sqrt{5}}{2}x$ です。図の点線がこの 2 本の直線です。`,
          lv: 2 },
        { t: R`接線と漸近線の交点 A, B（(4)）`,
          m: [R`\mathrm{A}:\ y = \frac{\sqrt{5}}{2}x \text{ と } y = \frac{3}{2}x - 2 \text{ を連立}`,
              R`\frac{3 - \sqrt{5}}{2}\,x = 2 \;\Rightarrow\; x = \frac{4}{3 - \sqrt{5}} = 3 + \sqrt{5}`,
              R`\mathrm{A}\left(3 + \sqrt{5},\ \frac{5 + 3\sqrt{5}}{2}\right)`,
              R`\mathrm{B}:\ y = -\frac{\sqrt{5}}{2}x \text{ と } y = \frac{3}{2}x - 2 \text{ を連立}`,
              R`\frac{3 + \sqrt{5}}{2}\,x = 2 \;\Rightarrow\; x = \frac{4}{3 + \sqrt{5}} = 3 - \sqrt{5}`,
              R`\mathrm{B}\left(3 - \sqrt{5},\ \frac{5 - 3\sqrt{5}}{2}\right)`],
          n: R`接線の式と、2 本の漸近線の式をそれぞれ連立して、交点の座標を求めます。$\dfrac{4}{3 - \sqrt{5}}$ の分母の有理化は、分母と分子に $3 + \sqrt{5}$ をかけて行います（分母は $(3 - \sqrt{5})(3 + \sqrt{5}) = 9 - 5 = 4$ になり、結果は $3 + \sqrt{5}$）。$y$ 座標は漸近線の式に $x$ を代入して求めます（A: $\dfrac{\sqrt{5}}{2}(3 + \sqrt{5}) = \dfrac{3\sqrt{5} + 5}{2}$）。`,
          easy: R`接線 $y = \dfrac{3}{2}x - 2$ の傾きは、2 本の漸近線の傾き $\pm\dfrac{\sqrt{5}}{2}$ $\left(\fallingdotseq \pm 1.118\right)$ のどちらとも違うので、接線は 2 本の漸近線と 1 点ずつで交わります。右上がりの漸近線との交点が A、右下がりの漸近線との交点が B です（図）。それぞれ 2 本の直線の式を連立方程式として解けば、交点の座標が出ます。分母に $3 - \sqrt{5}$ のような根号を含む数が出てくるときは、分母と分子に $3 + \sqrt{5}$ をかけて有理化します。`,
          fig: figHyperbola(true) },
        { t: R`三角形 OAB の面積（(4)）`,
          m: [R`\mathrm{A}(x_{1},\ y_{1}),\ \mathrm{B}(x_{2},\ y_{2}) \;\Rightarrow\; S = \frac{1}{2}\left|x_{1}y_{2} - x_{2}y_{1}\right|`,
              R`x_{1}y_{2} = (3 + \sqrt{5})\cdot\frac{5 - 3\sqrt{5}}{2} = \frac{-4\sqrt{5}}{2} = -2\sqrt{5}`,
              R`x_{2}y_{1} = (3 - \sqrt{5})\cdot\frac{5 + 3\sqrt{5}}{2} = \frac{4\sqrt{5}}{2} = 2\sqrt{5}`,
              R`S = \frac{1}{2}\left|-2\sqrt{5} - 2\sqrt{5}\right| = 2\sqrt{5}`],
          n: R`原点 O と 2 点 $\mathrm{A}(x_{1},\ y_{1}),\ \mathrm{B}(x_{2},\ y_{2})$ でできる三角形の面積は $\dfrac{1}{2}\left|x_{1}y_{2} - x_{2}y_{1}\right|$ です。$x_{1}y_{2} = -2\sqrt{5},\ x_{2}y_{1} = 2\sqrt{5}$ なので、面積は $2\sqrt{5} \fallingdotseq 4.47$ です。`,
          easy: R`原点を 1 つの頂点とする三角形の面積は、他の 2 つの頂点の座標 $(x_{1},\ y_{1}),\ (x_{2},\ y_{2})$ から $\dfrac{1}{2}\left|x_{1}y_{2} - x_{2}y_{1}\right|$ で計算できます（2 つのベクトル $(x_{1},\ y_{1}),\ (x_{2},\ y_{2})$ がつくる平行四辺形の面積の半分です）。$(3 + \sqrt{5})(5 - 3\sqrt{5}) = 15 - 9\sqrt{5} + 5\sqrt{5} - 15 = -4\sqrt{5}$ のように、根号の積を丁寧に展開し、$\sqrt{5} \times \sqrt{5} = 5$ を使って整理します。`,
          pro: R`双曲線 $\dfrac{x^{2}}{a^{2}} - \dfrac{y^{2}}{b^{2}} = 1$ の接線と 2 本の漸近線でできる三角形 OAB の面積は、接点の位置によらず一定で $ab$。ここでは $ab = 2\sqrt{5}$ で、実際に一致する。` }
      ],
      tags: ['双曲線', '焦点', '離心率', '接線', '漸近線']
    }
  ]);
})();
