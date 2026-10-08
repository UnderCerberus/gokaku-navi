/* GOKAKU NAVI — 数学 問題バンク（難関大レベル: level 'adv'）
   数学の grade 1 以上の 20 単元を 1 問ずつ、頻出 4 単元（積分法(数III)・ベクトル・場合の数と確率・数列）は 2 問ずつ、計 24 問。
   難関大の「やや難」を想定した複数単元の融合・場合分け・存在条件の大問。
   すべて書き下ろしのオリジナル問題（既存の入試問題・参考書の文面・数値設定は含まない）。 */
(function () {
  'use strict';
  const R = String.raw;
  const S2 = Math.SQRT2, S3 = Math.sqrt(3), S5 = Math.sqrt(5), S6 = Math.sqrt(6);
  const PI = Math.PI, E = Math.E;
  const G = JK.plot.graph;
  const ORIG = { univ: 'オリジナル' };

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // 円に内接する四角形 ABCD（AB = 4, BC = 5, CD = 5, DA = 6）
  const FIG_TRIG1 = (function () {
    const d = JK.plot.draw(340, 270);
    const cx = 170, cy = 133, Rr = 35 * S6 / 24, rp = 108;
    const sides = [4, 5, 5, 6], names = ['A', 'B', 'C', 'D'];
    const P = [], deg = [];
    let th = 215;
    for (let i = 0; i < 4; i++) {
      deg.push(th);
      P.push([cx + rp * Math.cos(th * PI / 180), cy - rp * Math.sin(th * PI / 180)]);
      th += 2 * Math.asin(sides[i] / (2 * Rr)) * 180 / PI;
    }
    d.circle(cx, cy, rp, { cls: 'dim', w: 1.2 });
    d.poly(P, { cls: 'fg', fill: 'f1' });
    d.line(P[0][0], P[0][1], P[2][0], P[2][1], { cls: 'c2', dash: true, w: 1.3 });
    d.line(P[1][0], P[1][1], P[3][0], P[3][1], { cls: 'c2', dash: true, w: 1.3 });
    // 対角線の交点 E
    const d1 = [P[2][0] - P[0][0], P[2][1] - P[0][1]], d2 = [P[3][0] - P[1][0], P[3][1] - P[1][1]];
    const w = [P[1][0] - P[0][0], P[1][1] - P[0][1]];
    const s = (w[0] * d2[1] - w[1] * d2[0]) / (d1[0] * d2[1] - d1[1] * d2[0]);
    const Ex = P[0][0] + s * d1[0], Ey = P[0][1] + s * d1[1];
    d.dot(Ex, Ey, { cls: 'c3' });
    d.text(Ex + 12, Ey + 15, 'E', { cls: 'c3' });
    for (let i = 0; i < 4; i++) {
      d.dot(P[i][0], P[i][1]);
      const a = deg[i] * PI / 180;
      d.text(cx + (rp + 13) * Math.cos(a), cy - (rp + 13) * Math.sin(a) + 4, names[i], { size: 13 });
      const q = P[(i + 1) % 4], mx = (P[i][0] + q[0]) / 2, my = (P[i][1] + q[1]) / 2;
      const ux = cx - mx, uy = cy - my, L = Math.hypot(ux, uy);
      d.text(mx + ux / L * 13, my + uy / L * 13 + 4, String(sides[i]), { cls: 'c1', size: 12 });
    }
    return d.svg();
  })();

  // △ABC と点 D（AB を 1:2）、E（AC を 3:2）、P = BE∩CD、F = AP∩BC
  const FIG_GEO = (function () {
    const d = JK.plot.draw(340, 240);
    const A = [112, 26], B = [26, 210], C = [318, 210];
    const mix = (ws, pts) => { const s = ws.reduce((t, w) => t + w, 0); return [0, 1].map((k) => pts.reduce((t, p, i) => t + ws[i] * p[k], 0) / s); };
    const D = mix([2, 1], [A, B]), Ept = mix([2, 3], [A, C]), F = mix([1, 3], [B, C]), P = mix([2, 1, 3], [A, B, C]);
    d.poly([A, B, C], { cls: 'fg', fill: 'f0' });
    d.line(B[0], B[1], Ept[0], Ept[1], { cls: 'c1', w: 1.4 });
    d.line(C[0], C[1], D[0], D[1], { cls: 'c1', w: 1.4 });
    d.line(A[0], A[1], F[0], F[1], { cls: 'c2', w: 1.4, dash: true });
    [A, B, C, D, Ept, F].forEach((p) => d.dot(p[0], p[1]));
    d.dot(P[0], P[1], { cls: 'c3' });
    d.text(A[0], A[1] - 8, 'A', { size: 13 });
    d.text(B[0] - 9, B[1] + 14, 'B', { size: 13 });
    d.text(C[0] + 9, C[1] + 14, 'C', { size: 13 });
    d.text(D[0] - 12, D[1] + 2, 'D', { size: 13 });
    d.text(Ept[0] + 11, Ept[1] - 2, 'E', { size: 13 });
    d.text(F[0], F[1] + 17, 'F', { size: 13 });
    d.text(P[0] + 4, P[1] - 9, 'P', { cls: 'c3', size: 13 });
    // 辺の比のラベル（線分の中点を重心から遠ざける向きにずらす）
    const Gc = mix([1, 1, 1], [A, B, C]);
    const lab = (p, q, s) => {
      const M = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], ux = M[0] - Gc[0], uy = M[1] - Gc[1], L = Math.hypot(ux, uy);
      d.text(M[0] + ux / L * 12, M[1] + uy / L * 12 + 4, s, { cls: 'c4', size: 11 });
    };
    lab(A, D, '1'); lab(D, B, '2'); lab(A, Ept, '3'); lab(Ept, C, '2');
    return d.svg();
  })();

  // 放物線 C_t: y = (x - t)^2 + t（t ≥ 0）の通過領域 E と、(4) の面積部分（1/2 ≤ x ≤ 2 で y = x^2 と接線の間）
  const FIG_COORD = G({
    w: 340, h: 260, x: [-1.6, 2.6], y: [-0.6, 4.6],
    fills: [
      { f: (x) => (x < 0.5 ? x * x : x - 0.25), g: () => 4.6, from: -1.6, to: 2.6, cls: 'f4' },
      { f: (x) => x * x, g: (x) => x - 0.25, from: 0.5, to: 2, cls: 'f1' }
    ],
    curves: [
      { f: (x) => (x - 1) * (x - 1) + 1, cls: 'dim', dash: true },
      { f: (x) => (x - 2) * (x - 2) + 2, cls: 'dim', dash: true },
      { f: (x) => x * x, cls: 'c1' },
      { f: (x) => x - 0.25, cls: 'c2', domain: [0.5, 2.6] }
    ],
    points: [{ x: 0.5, y: 0.25, label: '(1/2, 1/4)', cls: 'c3', pos: 'tl' }],
    vlines: [{ x: 2, label: 'x=2', dash: true }],
    labels: [
      { x: -0.75, y: 3.6, text: 'E', cls: 'c4' },
      { x: -1.55, y: 0.5, text: 'y=x²', cls: 'c1' },
      { x: 1.3, y: 0.55, text: 'y=x-1/4', cls: 'c2' },
      { x: 0.1, y: 2.5, text: 'C₁', cls: 'dim' },
      { x: 1.05, y: 3.35, text: 'C₂', cls: 'dim' }
    ]
  });

  // 不等式 log_x y − 2 log_y x > 1 の表す領域（塗った部分。境界線・x = 1・y = 1 は含まない）と直線 x + y = 6
  const FIG_EXPLOG = G({
    w: 340, h: 260, x: [0, 6.3], y: [0, 6.3],
    fills: [
      { f: (x) => x * x, g: () => 0, from: 0, to: 1, cls: 'f1' },
      { f: (x) => Math.min(1 / x, 8), g: () => 1, from: 0.001, to: 1, cls: 'f1' },
      { f: () => 8, g: (x) => x * x, from: 1, to: 2.6, cls: 'f1' },
      { f: () => 1, g: (x) => 1 / x, from: 1, to: 6.3, cls: 'f1' }
    ],
    curves: [
      { f: (x) => x * x, cls: 'c1' },
      { f: (x) => 1 / x, cls: 'c2', domain: [0.12, 6.3] },
      { f: (x) => 6 - x, cls: 'c3', dash: true }
    ],
    vlines: [{ x: 1, label: 'x=1', dash: true }],
    hlines: [{ y: 1, label: 'y=1', dash: true }],
    labels: [
      { x: 2.6, y: 5.5, text: 'y=x²', cls: 'c1' },
      { x: 0.25, y: 5.9, text: 'y=1/x', cls: 'c2' },
      { x: 3.4, y: 3.0, text: 'x+y=6', cls: 'c3' }
    ]
  });

  // k = g(t) = −2t^3 + 9t^2 − 12t のグラフと水平線（交点の個数 = 接線の本数）
  const FIG_CALC2 = G({
    w: 340, h: 240, x: [-0.3, 3.1], y: [-7, 1],
    axis: ['t', 'k'],
    curves: [{ f: (t) => -2 * t * t * t + 9 * t * t - 12 * t, cls: 'c1' }],
    hlines: [{ y: -4, label: 'k=-4', dash: true }, { y: -5, label: 'k=-5', dash: true }],
    segs: [{ x1: -0.3, y1: -4.5, x2: 2.6, y2: -4.5, cls: 'c3' }],
    points: [
      { x: 1, y: -5, label: '極小(1,-5)', cls: 'c2', pos: 'bl' },
      { x: 2, y: -4, label: '極大(2,-4)', cls: 'c2', pos: 'tl' }
    ],
    labels: [{ x: 0.45, y: -1.5, text: 'k=g(t)', cls: 'c1' }]
  });

  // y = e^x / x のグラフと水平線 y = 2a（交点で f'(x) の符号が変わる）
  const FIG_DIFF3 = G({
    w: 340, h: 240, x: [-3, 3.6], y: [-4, 8],
    curves: [
      { f: (x) => Math.exp(x) / x, cls: 'c1', domain: [-3, -0.05] },
      { f: (x) => Math.exp(x) / x, cls: 'c1', domain: [0.12, 3.6] }
    ],
    hlines: [{ y: E, label: 'y=e', dash: true }],
    segs: [
      { x1: -3, y1: 5, x2: 3.6, y2: 5, cls: 'c3' },
      { x1: -3, y1: -2, x2: 3.6, y2: -2, cls: 'c2' }
    ],
    points: [{ x: 1, y: E, label: '(1, e)', cls: 'c3', pos: 'br' }],
    labels: [
      { x: 1.9, y: 7.2, text: 'y=e^x/x', cls: 'c1' },
      { x: -2.9, y: 5.4, text: '2a>e: 2点', cls: 'c3' },
      { x: -2.9, y: -1.6, text: 'a<0: 1点', cls: 'c2' }
    ]
  });

  // ∫_0^1 |e^x − a| dx の図（a = 1.8 の例）。x = log a を境に e^x − a の符号が変わる
  const FIG_INTEG3A = (function () {
    const a = 1.8, c = Math.log(a);
    return G({
      w: 340, h: 230, x: [-0.15, 1.2], y: [0, 3],
      fills: [
        { f: () => a, g: (x) => Math.exp(x), from: 0, to: c, cls: 'f2' },
        { f: (x) => Math.exp(x), g: () => a, from: c, to: 1, cls: 'f1' }
      ],
      curves: [{ f: (x) => Math.exp(x), cls: 'c1' }],
      hlines: [{ y: a, label: 'y=a', dash: true, cls: 'c3' }],
      vlines: [{ x: c, label: 'x=log a', dash: true }, { x: 1, label: 'x=1', dash: true }],
      labels: [{ x: 0.15, y: 2.3, text: 'y=e^x', cls: 'c1' }]
    });
  })();

  // 放物線 C: y = x^2 − x と直線 ℓ: y = x で囲まれた部分 D、C 上の点 P から ℓ への垂線 PH（t = 1.2 の例）
  const FIG_INTEG3B = G({
    w: 340, h: 260, x: [-0.6, 2.6], y: [-0.6, 2.6], equal: true,
    fills: [{ f: (x) => x, g: (x) => x * x - x, from: 0, to: 2, cls: 'f1' }],
    curves: [
      { f: (x) => x, cls: 'c2' },
      { f: (x) => x * x - x, cls: 'c1', domain: [-0.5, 2.3] }
    ],
    segs: [{ x1: 1.2, y1: 0.24, x2: 0.72, y2: 0.72, cls: 'c3', dash: true }],
    points: [
      { x: 1.2, y: 0.24, label: 'P', cls: 'c3', pos: 'br' },
      { x: 0.72, y: 0.72, label: 'H', cls: 'c3', pos: 'tl' }
    ],
    labels: [
      { x: 1.0, y: 2.3, text: 'ℓ: y=x', cls: 'c2' },
      { x: 1.55, y: 0.25, text: 'C: y=x²-x', cls: 'c1' }
    ]
  });

  JK.registerProblems([
    /* ---------- 数と式: 二重根号・対称式・整数部分 ---------- */
    {
      id: 'm-adv-expr-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-expr',
      title: '二重根号と5乗の整数部分',
      source: ORIG,
      time: 15,
      body: R`$a = \sqrt{7 + 4\sqrt{3}},\ b = \sqrt{7 - 4\sqrt{3}}$ とする。次の問いに答えよ。

(1) $a + b$ の値を求めよ。
(2) $a^{3} + b^{3}$ の値を求めよ。
(3) $a^{5} + b^{5}$ の値を求めよ。
(4) $a^{5}$ の整数部分 $N$ を求めよ。
(5) $a^{5}$ の小数部分を $p$ とする（$a^{5} = N + p,\ 0 \le p < 1$）。$a^{5}(1 - p)$ の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$a + b$ の値`, type: 'num', answer: 4 },
        { label: '(2)', q: R`$a^{3} + b^{3}$ の値`, type: 'num', answer: 52 },
        { label: '(3)', q: R`$a^{5} + b^{5}$ の値`, type: 'num', answer: 724 },
        { label: '(4)', q: R`$a^{5}$ の整数部分 $N$`, type: 'num', answer: 723 },
        { label: '(5)', q: R`$a^{5}(1 - p)$ の値`, type: 'num', answer: 1 }
      ],
      solution: [
        {
          t: '二重根号をはずす',
          m: [R`7 + 4\sqrt{3} = 7 + 2\sqrt{12} = (\sqrt{4} + \sqrt{3})^{2} = (2 + \sqrt{3})^{2}`, R`7 - 4\sqrt{3} = 7 - 2\sqrt{12} = (2 - \sqrt{3})^{2}`],
          n: R`足して $7$、掛けて $12$ になる 2 数は $4$ と $3$ です。$2 - \sqrt{3} > 0$ なので $a = 2 + \sqrt{3},\ b = 2 - \sqrt{3}$ です。`,
          easy: R`$(\sqrt{p} + \sqrt{q})^{2} = p + q + 2\sqrt{pq}$ なので、根号の中を「(和) $+ 2\sqrt{\text{(積)}}$」の形に直せれば外側の根号がはずれます。$4\sqrt{3} = 2\sqrt{12}$ と書き直すのがコツです。ただし $\sqrt{X^{2}} = X$ となるのは $X \ge 0$ のときだけなので、$b$ は $\sqrt{3} - 2$（負の数）ではなく $2 - \sqrt{3}$ です。`,
          pro: R`$b$ で $\sqrt{3} - 2$ と書く誤りが定番です。二重根号をはずしたら「正の数か」を必ず確認します。`
        },
        {
          t: '和と積（基本対称式）',
          m: R`a + b = 4,\qquad ab = (2 + \sqrt{3})(2 - \sqrt{3}) = 4 - 3 = 1`,
          n: R`(1) の答えは $4$ です。以下、$a,\ b$ の対称式はすべて和 $4$ と積 $1$ だけで計算します。`
        },
        {
          t: '3 乗の和',
          m: [R`a^{3} + b^{3} = (a + b)^{3} - 3ab(a + b)`, R`= 4^{3} - 3 \cdot 1 \cdot 4 = 64 - 12 = 52`],
          easy: R`$(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3} = a^{3} + b^{3} + 3ab(a + b)$ を変形した式です。根号のまま $(2 + \sqrt{3})^{3}$ を展開するより、ずっと計算が軽くなります。`
        },
        {
          t: '5 乗の和',
          m: [R`a^{2} + b^{2} = (a + b)^{2} - 2ab = 16 - 2 = 14`, R`a^{5} + b^{5} = (a^{2} + b^{2})(a^{3} + b^{3}) - a^{2}b^{2}(a + b)`, R`= 14 \cdot 52 - 1^{2} \cdot 4 = 728 - 4 = 724`],
          n: R`$(a^{2} + b^{2})(a^{3} + b^{3}) = a^{5} + b^{5} + a^{2}b^{3} + a^{3}b^{2}$ で、余分な項は $a^{2}b^{2}(a + b)$ とまとめられます。`,
          pro: R`$s_{n} = a^{n} + b^{n}$ とおくと、$a,\ b$ は $x^{2} = 4x - 1$ の解なので $s_{n+2} = 4s_{n+1} - s_{n}$ が成り立ちます。$s_{0} = 2,\ s_{1} = 4$ から $14,\ 52,\ 194,\ 724$ と機械的に求まります。`
        },
        {
          t: R`$b^{5}$ の大きさを調べる`,
          m: R`1 < \sqrt{3} < 2 \;\Rightarrow\; 0 < b = 2 - \sqrt{3} < 1 \;\Rightarrow\; 0 < b^{5} < 1`,
          n: R`$b \fallingdotseq 0.27$ なので、$b^{5}$ は $0$ にとても近い正の数です。`,
          lv: 2
        },
        {
          t: '整数部分',
          m: [R`a^{5} = 724 - b^{5}`, R`723 < a^{5} < 724 \quad\therefore\quad N = 723`],
          n: R`$a^{5} + b^{5}$ が整数で、$b^{5}$ が $0$ と $1$ の間にあることがポイントです。`,
          easy: R`ある数の**整数部分**は「その数を超えない最大の整数」、**小数部分**は「元の数 − 整数部分」です（$3.7$ なら整数部分 $3$、小数部分 $0.7$）。$a^{5}$ は $724$ より $b^{5}$ だけ小さい数なので、整数部分は $723$ です。`
        },
        {
          t: '小数部分を使った式の値',
          m: [R`p = a^{5} - 723 = (724 - b^{5}) - 723 = 1 - b^{5}`, R`a^{5}(1 - p) = a^{5}b^{5} = (ab)^{5} = 1^{5} = 1`],
          n: R`よって (5) の答えは $1$ です。`,
          pro: R`「$a^{n} + b^{n}$ が整数」かつ「$0 < b < 1$」の組合せは、$(2 + \sqrt{3})^{n}$ 型の数の整数部分・小数部分を問う問題の定石です。小数部分は $1 - b^{n}$ と表せます。`
        }
      ],
      prereq: ['m-junior'],
      tags: ['二重根号', '対称式', '整数部分', '小数部分']
    },

    /* ---------- 2次関数: 定点を通る放物線・解の配置 ---------- */
    {
      id: 'm-adv-quad-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-quad',
      title: '2次方程式の解の配置と区間',
      source: ORIG,
      time: 18,
      body: R`$a$ を実数の定数とし、2次関数 $f(x) = x^{2} - 2ax + 2a + 3$ を考える。次の問いに答えよ。

(1) 方程式 $f(x) = 0$ が異なる 2 つの実数解をもち、それらがともに $2$ より大きくなるような $a$ の値の範囲を求めよ。
(2) $0 \le x \le 4$ を満たすすべての $x$ に対して $f(x) > 0$ が成り立つような $a$ の値の範囲を求めよ。
(3) 方程式 $f(x) = 0$ が $0 < x < 4$ の範囲に少なくとも 1 つの実数解をもつような $a$ の値の範囲を、下の選択肢から選べ。`,
      fig: null,
      parts: [
        { label: '(1)下限', q: R`(1) の範囲は $p < a < q$ の形になる。$p$ の値`, type: 'num', answer: 3 },
        { label: '(1)上限', q: R`同じく $q$ の値`, type: 'num', answer: 7 / 2, show: R`\frac{7}{2}`, hint: '分数は 5/3 のように入力' },
        { label: '(2)下限', q: R`(2) の範囲は $r < a < s$ の形になる。$r$ の値`, type: 'num', answer: -3 / 2, show: R`-\frac{3}{2}` },
        { label: '(2)上限', q: R`同じく $s$ の値`, type: 'num', answer: 3 },
        {
          label: '(3)', q: R`(3) の $a$ の値の範囲`, type: 'choice',
          choices: [
            R`$a < -\frac{3}{2}$ または $3 \le a$`,
            R`$a \le -\frac{3}{2}$ または $3 \le a$`,
            R`$a < -\frac{3}{2}$ または $3 < a$`,
            R`$-\frac{3}{2} < a < 3$`,
            R`$3 \le a < \frac{7}{2}$`
          ],
          answer: 0
        }
      ],
      solution: [
        {
          t: '平方完成と定点',
          m: [R`f(x) = (x - a)^{2} - a^{2} + 2a + 3`, R`f(x) = x^{2} + 3 - 2a(x - 1)`],
          n: R`軸は $x = a$、頂点の $y$ 座標は $-a^{2} + 2a + 3$ です。また 2 行目の形から、$a$ の値によらず $f(1) = 4$（放物線は定点 $(1,\ 4)$ を通る）とわかります。`,
          easy: R`$a$ が変わると放物線は形（開き具合）を変えずに位置だけ動きます。どの位置にあるかは「軸 $x = a$」と「頂点の高さ」で決まるので、まず平方完成してこの 2 つを読み取ります。`,
          pro: R`$a$ について整理して「$a$ の係数 $= 0$」となる $x$ を探すと定点が見つかります。定点 $(1,\ 4)$ が $x$ 軸より上にあることは、(3) で解の様子を考えるときの見通しになります。`
        },
        {
          t: '(1) 解の配置の 3 条件',
          m: [R`\frac{D}{4} = a^{2} - (2a + 3) = (a - 3)(a + 1) > 0 \;\Rightarrow\; a < -1,\ 3 < a`, R`\text{軸}:\ a > 2`, R`f(2) = 4 - 4a + 2a + 3 = 7 - 2a > 0 \;\Rightarrow\; a < \frac{7}{2}`],
          n: R`3 つの共通部分をとって $3 < a < \dfrac{7}{2}$ です。`,
          easy: R`2 つの解がともに $2$ より大きいとき、放物線は「$x$ 軸と 2 点で交わり（判別式 $> 0$）」「軸が $x = 2$ より右にあり」「$x = 2$ での値が正（$x = 2$ では $x$ 軸より上）」になっています。逆にこの 3 つがそろえば、交点は 2 つとも $x = 2$ より右にあります。`
        },
        {
          t: R`(2) $0 \le x \le 4$ での最小値 $m(a)$`,
          m: R`m(a) = \begin{cases} f(0) = 2a + 3 & (a < 0) \\ f(a) = -a^{2} + 2a + 3 & (0 \le a \le 4) \\ f(4) = 19 - 6a & (a > 4) \end{cases}`,
          n: R`「すべての $x$ で $f(x) > 0$」は「区間での最小値 $m(a) > 0$」と同じです。軸 $x = a$ が区間の左・中・右のどこにあるかで最小値をとる場所が変わります。`,
          easy: R`下に凸の放物線は、軸が区間の中にあれば頂点で最小、軸が区間より左にあれば左端、右にあれば右端で最小になります。グラフを 3 通り描いてみると納得できます。`
        },
        {
          t: R`(2) $m(a) > 0$ を場合ごとに解く`,
          m: [R`a < 0:\ 2a + 3 > 0 \;\Rightarrow\; -\frac{3}{2} < a < 0`, R`0 \le a \le 4:\ (a - 3)(a + 1) < 0 \;\Rightarrow\; 0 \le a < 3`, R`a > 4:\ 19 - 6a > 0 \;\Rightarrow\; a < \frac{19}{6}\ \text{（不適）}`],
          n: R`合わせて $-\dfrac{3}{2} < a < 3$ です。各場合の前提条件（$a < 0$ など）との共通部分をとるのを忘れないようにします。`
        },
        {
          t: R`(3) ① 2 つの解（重解を含む）がともに $0 < x < 4$ にある場合`,
          m: [R`\frac{D}{4} \ge 0:\ a \le -1,\ 3 \le a`, R`0 < a < 4,\quad f(0) = 2a + 3 > 0,\quad f(4) = 19 - 6a > 0`],
          n: R`共通部分は $3 \le a < \dfrac{19}{6}$ です（$a = 3$ のとき重解 $x = 3$）。`
        },
        {
          t: R`(3) ② 1 つの解だけが $0 < x < 4$ にある場合`,
          m: [R`f(0)f(4) < 0 \;\Leftrightarrow\; (2a + 3)(19 - 6a) < 0`, R`\Leftrightarrow\; a < -\frac{3}{2},\ \frac{19}{6} < a`],
          n: R`区間の両端で符号が異なれば、グラフは区間内でちょうど 1 回 $x$ 軸を横切ります。`,
          lv: 1
        },
        {
          t: '(3) ③ 区間の端が解になる場合と結論',
          m: [R`a = -\frac{3}{2}:\ f(x) = x^{2} + 3x = x(x + 3)\ \Rightarrow\ \text{解 } 0,\ -3\ \text{（区間内になし）}`, R`a = \frac{19}{6}:\ f(x) = (x - 4)\left(x - \frac{7}{3}\right)\ \Rightarrow\ \text{解 } \frac{7}{3}\ \text{は区間内}`],
          n: R`①〜③をまとめると $a < -\dfrac{3}{2}$ または $3 \le a$ で、答えは選択肢 **0** です。$a = -\dfrac{3}{2}$ は含まず、$a = 3$ は含む点に注意します。`,
          pro: R`$x = 1$ は解にならない（$f(1) = 4$）ので、$f(x) = 0 \Leftrightarrow 2a = \dfrac{x^{2} + 3}{x - 1} = (x - 1) + 2 + \dfrac{4}{x - 1}$ と文字定数を分離し、$0 < x < 4$ でのグラフと直線 $y = 2a$ の共有点を数える方法もあります。$1 < x < 4$ では相加・相乗平均から $2a \ge 6$、$0 < x < 1$ では $2a < -3$ となり、場合分けなしで同じ結論が出ます。`
        }
      ],
      prereq: ['m-expr'],
      tags: ['解の配置', '場合分け', '最小値', '定点', '端点の吟味']
    },

    /* ---------- 図形と計量: 円に内接する四角形 ---------- */
    {
      id: 'm-adv-trig1-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-trig1',
      title: '円に内接する四角形の対角線',
      source: ORIG,
      time: 18,
      body: R`円に内接する四角形 ABCD において、$\mathrm{AB} = 4,\ \mathrm{BC} = 5,\ \mathrm{CD} = 5,\ \mathrm{DA} = 6$ である。次の問いに答えよ。

(1) $\cos\angle\mathrm{ABC}$ の値を求めよ。
(2) 四角形 ABCD の面積 $S$ を求めよ。
(3) この円の半径 $R$ を求めよ。
(4) 対角線 BD の長さを求めよ。
(5) 対角線 AC と BD の交点を E とするとき、線分 AE の長さを求めよ。`,
      fig: FIG_TRIG1,
      parts: [
        { label: '(1)', q: R`$\cos\angle\mathrm{ABC}$ の値`, type: 'num', answer: -1 / 5, show: R`-\frac{1}{5}` },
        { label: '(2)', q: R`面積 $S$`, type: 'num', answer: 10 * S6, show: R`10\sqrt{6}`, hint: '根号は 3√5 または 3sqrt(5) と入力' },
        { label: '(3)', q: R`半径 $R$`, type: 'num', answer: 35 * S6 / 24, show: R`\frac{35\sqrt{6}}{24}` },
        { label: '(4)', q: R`BD の長さ`, type: 'num', answer: 50 / 7, show: R`\frac{50}{7}` },
        { label: '(5)', q: R`AE の長さ`, type: 'num', answer: 24 / 7, show: R`\frac{24}{7}` }
      ],
      solution: [
        {
          t: '向かい合う角の関係',
          m: R`\angle\mathrm{ABC} + \angle\mathrm{CDA} = 180\degree \;\Rightarrow\; \cos\angle\mathrm{CDA} = -\cos\angle\mathrm{ABC}`,
          n: R`$\angle\mathrm{ABC} = \theta$ とおきます。$\sin\angle\mathrm{CDA} = \sin\theta$ も成り立ちます。`,
          easy: R`円に内接する四角形では、向かい合う角の和が $180\degree$ です。$\cos(180\degree - \theta) = -\cos\theta$、$\sin(180\degree - \theta) = \sin\theta$ なので、角 D の三角比は角 B の三角比で表せます。`
        },
        {
          t: '対角線 AC を 2 通りに表す',
          m: [R`\triangle\mathrm{ABC}:\ \mathrm{AC}^{2} = 4^{2} + 5^{2} - 2 \cdot 4 \cdot 5\cos\theta = 41 - 40\cos\theta`, R`\triangle\mathrm{ACD}:\ \mathrm{AC}^{2} = 5^{2} + 6^{2} - 2 \cdot 5 \cdot 6 \cdot (-\cos\theta) = 61 + 60\cos\theta`],
          n: R`共通の辺 AC に余弦定理を 2 回使います。`
        },
        {
          t: R`(1) $\cos\theta$ と AC`,
          m: [R`41 - 40\cos\theta = 61 + 60\cos\theta \;\Rightarrow\; \cos\theta = -\frac{1}{5}`, R`\mathrm{AC}^{2} = 41 + 8 = 49 \;\Rightarrow\; \mathrm{AC} = 7`]
        },
        {
          t: '(2) 面積',
          m: [R`\sin\theta = \sqrt{1 - \frac{1}{25}} = \frac{2\sqrt{6}}{5}`, R`S = \frac{1}{2} \cdot 4 \cdot 5\sin\theta + \frac{1}{2} \cdot 5 \cdot 6\sin\theta = 25\sin\theta = 10\sqrt{6}`],
          n: R`四角形を対角線 AC で 2 つの三角形に分けます。角 D の正弦も $\sin\theta$ です。`
        },
        {
          t: '(3) 正弦定理で外接円の半径',
          m: [R`\frac{\mathrm{AC}}{\sin\theta} = 2R`, R`R = \frac{7}{2} \cdot \frac{5}{2\sqrt{6}} = \frac{35}{4\sqrt{6}} = \frac{35\sqrt{6}}{24}`],
          n: R`四角形の外接円は $\triangle\mathrm{ABC}$ の外接円でもあります。`
        },
        {
          t: '(4) 対角線 BD',
          m: [R`\mathrm{BD}^{2} = 4^{2} + 6^{2} - 2 \cdot 4 \cdot 6\cos A = 5^{2} + 5^{2} + 2 \cdot 5 \cdot 5\cos A`, R`52 - 48\cos A = 50 + 50\cos A \;\Rightarrow\; \cos A = \frac{1}{49}`, R`\mathrm{BD}^{2} = 52 - \frac{48}{49} = \frac{2500}{49} \;\Rightarrow\; \mathrm{BD} = \frac{50}{7}`],
          n: R`角 A と角 C も向かい合う角なので、同じ手法が使えます。`,
          pro: R`トレミーの定理 $\mathrm{AC} \cdot \mathrm{BD} = \mathrm{AB} \cdot \mathrm{CD} + \mathrm{AD} \cdot \mathrm{BC}$ を使えば $7\,\mathrm{BD} = 20 + 30$ から一瞬です（検算にも便利）。`
        },
        {
          t: '(5) 面積比で AE:EC を求める',
          m: [R`\mathrm{AE} : \mathrm{EC} = \triangle\mathrm{ABD} : \triangle\mathrm{CBD} = \frac{1}{2} \cdot 4 \cdot 6\sin A : \frac{1}{2} \cdot 5 \cdot 5\sin C = 24 : 25`, R`\mathrm{AE} = 7 \cdot \frac{24}{49} = \frac{24}{7}`],
          n: R`$\sin C = \sin(180\degree - A) = \sin A$ なので、面積比は $24 : 25$ になります。`,
          easy: R`$\triangle\mathrm{ABD}$ と $\triangle\mathrm{CBD}$ は底辺 BD が共通なので、面積の比は「高さの比」です。A と C から BD に下ろした垂線の長さの比は、BD 上の点 E で分けられる $\mathrm{AE} : \mathrm{EC}$ に等しくなります（相似な直角三角形）。`
        }
      ],
      prereq: ['m-geo0', 'm-geo'],
      tags: ['余弦定理', '正弦定理', '円に内接する四角形', '面積比', 'トレミーの定理']
    },

    /* ---------- データの分析: 2 組の合併・訂正・標準化・相関 ---------- */
    {
      id: 'm-adv-data-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-data',
      title: '2組の合併と得点の訂正・標準化',
      source: ORIG,
      time: 16,
      body: R`ある学年の生徒 50 人が数学のテストを受けた。生徒は A 組 20 人と B 組 30 人からなり、得点 $x$（点）について、A 組の平均値は $62$、分散は $30$、B 組の平均値は $72$、分散は $40$ であった。次の問いに答えよ。

(1) 50 人全体の得点の平均値を求めよ。
(2) 50 人全体の得点の分散を求めよ。
(3) 後日、B 組の 2 人の得点がともに $68$ 点と記録されていたが、正しくは $58$ 点と $78$ 点であったことがわかった。訂正後の 50 人全体の得点の分散を求めよ。
(4) 訂正後の得点 $x$ を、平均値が $50$、標準偏差が $10$ となるように 1 次式 $z = px + q$（$p > 0$）で変換する。$z$ を $x$ の式で表せ。
(5) 同じ 50 人が別のテストも受け、その得点を $w$ とする。訂正後の得点 $x$ と $w$ の共分散は $12$、$w$ の標準偏差は $2$ であった。$z$ と $w$ の相関係数を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`全体の平均値`, type: 'num', answer: 68 },
        { label: '(2)', q: R`全体の分散`, type: 'num', answer: 60 },
        { label: '(3)', q: R`訂正後の全体の分散`, type: 'num', answer: 64 },
        { label: '(4)', q: R`$z = \boxed{\ \ }$（$x$ の式）`, type: 'expr', answer: '5/4*x-35', vars: ['x'], show: R`\frac{5}{4}x - 35`, hint: '例: 3/2x + 4 のように入力' },
        { label: '(5)', q: R`$z$ と $w$ の相関係数`, type: 'num', answer: 3 / 4, show: R`\frac{3}{4}` }
      ],
      solution: [
        {
          t: '(1) 全体の平均値',
          m: R`\bar{x} = \frac{20 \cdot 62 + 30 \cdot 72}{50} = \frac{1240 + 2160}{50} = 68`,
          n: R`平均値 × 人数 = 合計 なので、各組の合計を足して全体の人数で割ります。`
        },
        {
          t: '各組の「2 乗の平均値」',
          m: [R`(\text{分散}) = (x^{2}\ \text{の平均値}) - (\text{平均値})^{2}`, R`\text{A 組}:\ 30 + 62^{2} = 3874,\qquad \text{B 組}:\ 40 + 72^{2} = 5224`],
          n: R`分散どうしは単純に平均できないので、いったん「$x^{2}$ の平均値」に直します。`,
          easy: R`分散は「平均値からのずれの 2 乗」の平均です。展開して整理すると「$x^{2}$ の平均値 − 平均値の 2 乗」に等しくなります。$x^{2}$ の平均値なら、合計どうしを足して人数で割る、という普通の平均の計算ができます。`
        },
        {
          t: '(2) 全体の分散',
          m: [R`(x^{2}\ \text{の平均値}) = \frac{20 \cdot 3874 + 30 \cdot 5224}{50} = \frac{77480 + 156720}{50} = 4684`, R`s^{2} = 4684 - 68^{2} = 4684 - 4624 = 60`],
          pro: R`「全体の分散 = 組内の分散の平均 + 組の平均値の散らばり」で検算できます：$\dfrac{20 \cdot 30 + 30 \cdot 40}{50} + \dfrac{20(62 - 68)^{2} + 30(72 - 68)^{2}}{50} = 36 + 24 = 60$。`
        },
        {
          t: '(3) 訂正の影響',
          m: [R`58 + 78 = 136 = 68 + 68 \;\Rightarrow\; \text{平均値は } 68 \text{ のまま}`, R`(\text{偏差の 2 乗の和の増加}) = (58 - 68)^{2} + (78 - 68)^{2} - 0 - 0 = 200`, R`s'^{2} = 60 + \frac{200}{50} = 64`],
          n: R`訂正後の標準偏差は $8$ です。`,
          easy: R`合計が変わらないので平均値 $68$ は変わりません。分散は「平均値 $68$ からのずれの 2 乗」の平均です。訂正前の 2 人はずれ $0$、訂正後は $-10$ と $+10$ なので、ずれの 2 乗の合計が $100 + 100 = 200$ 増え、50 人で割ると分散は $4$ 増えます。`
        },
        {
          t: '(4) 標準化の 1 次式',
          m: [R`\bar{z} = p\bar{x} + q = 68p + q = 50,\qquad s_{z} = p \cdot s_{x} = 8p = 10`, R`p = \frac{5}{4},\quad q = 50 - \frac{5}{4} \cdot 68 = -35`],
          n: R`よって $z = \dfrac{5}{4}x - 35$ です。`,
          easy: R`データ全体を $z = px + q$ と変換すると、平均値も同じ式で $p\bar{x} + q$ に変わり、標準偏差は $|p|$ 倍になります（$q$ を足しても散らばりは変わりません）。`
        },
        {
          t: '(5) 相関係数',
          m: [R`s_{zw} = p\,s_{xw} = \frac{5}{4} \cdot 12 = 15`, R`r = \frac{s_{zw}}{s_{z}s_{w}} = \frac{15}{10 \cdot 2} = \frac{3}{4}`],
          n: R`共分散は $x$ を $p$ 倍すると $p$ 倍になり、$q$ を足しても変わりません。`,
          pro: R`$p > 0$ の 1 次変換では相関係数は変わらないので、$r = \dfrac{12}{8 \cdot 2} = \dfrac{3}{4}$ と直接求めてもよいです。`
        }
      ],
      prereq: ['m-junior'],
      tags: ['平均値', '分散', 'データの訂正', '標準化', '相関係数']
    },

    /* ---------- 場合の数・確率: 玉の入れかえと確率漸化式 ---------- */
    {
      id: 'm-adv-prob-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-prob',
      title: '玉の入れかえと確率漸化式',
      source: ORIG,
      time: 20,
      body: R`袋の中に赤玉と白玉が合わせて 3 個入っている。袋から玉を 1 個取り出し、それが赤玉ならば代わりに白玉 1 個を、白玉ならば代わりに赤玉 1 個を袋に入れる（取り出した玉は戻さない）、という操作をくり返す。最初、袋の中の赤玉は 1 個である。操作を $2n$ 回行った後に袋の中の赤玉が 1 個である確率を $a_{n}$ とする（$a_{0} = 1$）。次の問いに答えよ。

(1) $a_{1}$ を求めよ。
(2) $a_{n+1} = pa_{n} + q$（$n = 0,\ 1,\ 2,\ \cdots$）が成り立つような定数 $p,\ q$ を求めよ。
(3) $a_{n}$ を $n$ の式で表せ。
(4) 操作を 5 回行った後に、袋の中の赤玉が 2 個である確率を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$a_{1}$`, type: 'num', answer: 7 / 9, show: R`\frac{7}{9}` },
        { label: '(2)p', q: R`$p$ の値`, type: 'num', answer: 1 / 9, show: R`\frac{1}{9}` },
        { label: '(2)q', q: R`$q$ の値`, type: 'num', answer: 2 / 3, show: R`\frac{2}{3}` },
        { label: '(3)', q: R`$a_{n} = \boxed{\ \ }$（$n$ の式）`, type: 'expr', answer: '3/4+1/4*(1/9)^n', vars: ['n'], show: R`\frac{3}{4} + \frac{1}{4}\left(\frac{1}{9}\right)^{n}`, hint: '例: 1/2 + 1/3*(1/5)^n のように入力' },
        { label: '(4)', q: R`5 回後に赤玉が 2 個である確率`, type: 'num', answer: 182 / 243, show: R`\frac{182}{243}` }
      ],
      solution: [
        {
          t: '1 回の操作で赤玉の個数はどう変わるか',
          m: R`\text{赤玉 } r \text{ 個}:\quad r \to r - 1\ \left(\text{確率 } \frac{r}{3}\right),\qquad r \to r + 1\ \left(\text{確率 } \frac{3 - r}{3}\right)`,
          n: R`赤玉を取り出すと赤玉が 1 個減り、白玉を取り出すと赤玉が 1 個増えます。どちらにしても玉の総数は 3 個のままです。`,
          easy: R`「袋の中の赤玉の個数」だけ追いかければ十分です。この個数を**状態**とよび、状態がどの確率でどの状態に移るかを整理するのが確率漸化式の第一歩です。`
        },
        {
          t: '偶数回後の状態',
          n: R`1 回ごとに赤玉の個数は $\pm 1$ 変わるので、偶数回後の個数は最初と同じく奇数、つまり $1$ 個か $3$ 個です。したがって、$2n$ 回後に赤玉が 3 個である確率は $1 - a_{n}$ です。`,
          pro: R`偶奇で状態を半分に減らすのがこの問題の要です。2 回分をまとめた推移を考えれば、状態は 2 つだけになります。`
        },
        {
          t: '2 回分の操作をまとめた推移',
          m: [R`1 \to 1:\ \frac{1}{3} \cdot 1 + \frac{2}{3} \cdot \frac{2}{3} = \frac{7}{9},\qquad 1 \to 3:\ \frac{2}{3} \cdot \frac{1}{3} = \frac{2}{9}`, R`3 \to 1:\ 1 \cdot \frac{2}{3} = \frac{2}{3},\qquad 3 \to 3:\ 1 \cdot \frac{1}{3} = \frac{1}{3}`],
          n: R`たとえば $1 \to 1$ は「$1 \to 0 \to 1$」と「$1 \to 2 \to 1$」の 2 通りです。最初は赤玉 1 個なので $a_{1} = \dfrac{7}{9}$ です。`
        },
        {
          t: '(2) 漸化式',
          m: [R`a_{n+1} = \frac{7}{9}a_{n} + \frac{2}{3}(1 - a_{n})`, R`= \frac{1}{9}a_{n} + \frac{2}{3}`],
          n: R`よって $p = \dfrac{1}{9},\ q = \dfrac{2}{3}$ です。`
        },
        {
          t: '(3) 一般項',
          m: [R`\alpha = \frac{1}{9}\alpha + \frac{2}{3} \;\Rightarrow\; \alpha = \frac{3}{4}`, R`a_{n+1} - \frac{3}{4} = \frac{1}{9}\left(a_{n} - \frac{3}{4}\right),\qquad a_{0} - \frac{3}{4} = \frac{1}{4}`, R`a_{n} = \frac{3}{4} + \frac{1}{4}\left(\frac{1}{9}\right)^{n}`],
          easy: R`$a_{n+1} = pa_{n} + q$ 型は、$\alpha = p\alpha + q$ を満たす数 $\alpha$ を両辺から引くと、$a_{n} - \alpha$ が公比 $p$ の等比数列になります。$n = 0$ から始まる数列なので、初項は $a_{0} - \alpha$、一般項は $(a_{0} - \alpha)p^{n}$ です。`
        },
        {
          t: '(4) 5 回後に赤玉 2 個',
          m: [R`a_{2} = \frac{3}{4} + \frac{1}{324} = \frac{61}{81},\qquad 1 - a_{2} = \frac{20}{81}`, R`\frac{61}{81} \cdot \frac{2}{3} + \frac{20}{81} \cdot 1 = \frac{122 + 60}{243} = \frac{182}{243}`],
          n: R`4 回後（$n = 2$）は赤玉 1 個か 3 個です。5 回目に赤玉が 2 個になるのは、1 個の状態から白玉を取り出す（確率 $\frac{2}{3}$）か、3 個の状態から赤玉を取り出す（確率 $1$）場合です。`,
          pro: R`$n \to \infty$ で $a_{n} \to \dfrac{3}{4}$。偶数回後の赤玉の個数は「1 個が $\frac{3}{4}$、3 個が $\frac{1}{4}$」の分布に近づきます。`
        }
      ],
      prereq: ['m-seq'],
      tags: ['確率漸化式', '推移', '偶奇', '特性方程式']
    },

    /* ---------- 場合の数・確率: 確率の最大と条件付き確率 ---------- */
    {
      id: 'm-adv-prob-02',
      subject: 'math',
      level: 'adv',
      unit: 'm-prob',
      title: '確率の最大と条件付き確率',
      source: ORIG,
      time: 17,
      body: R`赤玉 4 個と白玉 $n$ 個（$n \ge 2$）が入った袋から、同時に 3 個の玉を取り出す。取り出した 3 個のうち赤玉がちょうど 1 個である確率を $p_{n}$ とする。次の問いに答えよ。

(1) $p_{3}$ を求めよ。
(2) $\dfrac{p_{n+1}}{p_{n}}$ を $n$ の式で表せ。
(3) $p_{n}$ が最大となる $n$ をすべて求めよ。
(4) $p_{n}$ の最大値を求めよ。
(5) $n = 7$ とする。取り出した 3 個に赤玉が少なくとも 1 個含まれていたとき、赤玉がちょうど 1 個である条件付き確率を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$p_{3}$`, type: 'num', answer: 12 / 35, show: R`\frac{12}{35}` },
        { label: '(2)', q: R`$\dfrac{p_{n+1}}{p_{n}} = \boxed{\ \ }$（$n$ の式）`, type: 'expr', answer: '(n+1)(n+2)/((n-1)(n+5))', vars: ['n'], show: R`\frac{(n+1)(n+2)}{(n-1)(n+5)}`, hint: '例: (n+2)/(n-3) のように入力' },
        { label: '(3)', q: R`$p_{n}$ が最大となる $n$（すべて選ぶ）`, type: 'multi', choices: [R`$n = 5$`, R`$n = 6$`, R`$n = 7$`, R`$n = 8$`, R`$n = 9$`, R`$n = 10$`], answer: [2, 3] },
        { label: '(4)', q: R`$p_{n}$ の最大値`, type: 'num', answer: 28 / 55, show: R`\frac{28}{55}` },
        { label: '(5)', q: R`条件付き確率`, type: 'num', answer: 42 / 65, show: R`\frac{42}{65}` }
      ],
      solution: [
        {
          t: R`$p_{n}$ を式で表す`,
          m: [R`p_{n} = \frac{\C{4}{1} \cdot \C{n}{2}}{\C{n+4}{3}} = \frac{4 \cdot \frac{n(n-1)}{2}}{\frac{(n+4)(n+3)(n+2)}{6}}`, R`= \frac{12n(n-1)}{(n+2)(n+3)(n+4)}`],
          n: R`赤玉 1 個の選び方 $\C{4}{1}$ 通りと白玉 2 個の選び方 $\C{n}{2}$ 通りを掛けて、全体 $\C{n+4}{3}$ 通りで割ります。`
        },
        {
          t: '(1)',
          m: R`p_{3} = \frac{12 \cdot 3 \cdot 2}{5 \cdot 6 \cdot 7} = \frac{72}{210} = \frac{12}{35}`,
          lv: 2
        },
        {
          t: '(2) 隣り合う項の比',
          m: [R`\frac{p_{n+1}}{p_{n}} = \frac{12(n+1)n}{(n+3)(n+4)(n+5)} \cdot \frac{(n+2)(n+3)(n+4)}{12n(n-1)}`, R`= \frac{(n+1)(n+2)}{(n-1)(n+5)}`],
          n: R`共通の因数 $(n+3)(n+4)$ と $12n$ が約分で消えます。`,
          easy: R`$p_{n}$ のように番号 $n$ で決まる確率の最大を調べるとき、微分は使えません（$n$ は整数）。そこで「次の項が今の項より大きいか小さいか」を比 $\dfrac{p_{n+1}}{p_{n}}$ と $1$ の大小で判定します。比が $1$ より大きい間は増え、$1$ より小さくなると減り始めます。`
        },
        {
          t: R`(3) 比と $1$ の大小`,
          m: [R`(n+1)(n+2) - (n-1)(n+5) = (n^{2} + 3n + 2) - (n^{2} + 4n - 5) = 7 - n`, R`n < 7:\ p_{n+1} > p_{n},\qquad n = 7:\ p_{8} = p_{7},\qquad n > 7:\ p_{n+1} < p_{n}`],
          n: R`分母 $(n-1)(n+5)$ は $n \ge 2$ で正なので、分子と分母の差の符号だけで判定できます。`
        },
        {
          t: '最大となる n',
          m: R`p_{2} < p_{3} < \cdots < p_{7} = p_{8} > p_{9} > \cdots`,
          n: R`よって最大となるのは $n = 7,\ 8$ の 2 つです（選択肢の $n = 7$ と $n = 8$）。`,
          pro: R`比が「ちょうど $1$」になる $n$ があると最大値をとる $n$ が 2 つになります。答えを 1 つだけ書いて減点、が典型的な失点パターンです。`
        },
        {
          t: '(4) 最大値',
          m: R`p_{7} = \frac{12 \cdot 7 \cdot 6}{9 \cdot 10 \cdot 11} = \frac{504}{990} = \frac{28}{55}`,
          n: R`$p_{8} = \dfrac{12 \cdot 8 \cdot 7}{10 \cdot 11 \cdot 12} = \dfrac{28}{55}$ も同じ値です。`
        },
        {
          t: '(5) 条件付き確率',
          m: [R`\C{11}{3} = 165,\qquad (\text{赤玉なし}) = \C{7}{3} = 35,\qquad (\text{赤玉ちょうど 1 個}) = 4 \cdot \C{7}{2} = 84`, R`P = \frac{84}{165 - 35} = \frac{84}{130} = \frac{42}{65}`],
          n: R`「少なくとも 1 個」は余事象「赤玉なし」を全体から引いて数えます。`,
          easy: R`条件付き確率 $P_{A}(B) = \dfrac{P(A \cap B)}{P(A)}$ は、「起こったことがわかっている事象 $A$ を新しい全体とみなしたときの $B$ の割合」です。すべての取り出し方が同様に確からしいので、場合の数の比 $\dfrac{n(A \cap B)}{n(A)}$ で計算できます。`
        }
      ],
      prereq: ['m-expr'],
      tags: ['確率の最大', '比をとる', '組合せ', '条件付き確率']
    },

    /* ---------- 整数の性質: 1 次不定方程式・剰余・位数 ---------- */
    {
      id: 'm-adv-int-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-int',
      title: '不定方程式と 403 を法とする累乗',
      source: ORIG,
      time: 20,
      body: R`次の問いに答えよ。

(1) 等式 $13x + 31y = 1$ を満たす整数の組 $(x,\ y)$ のうち、$x$ が最小の正の整数であるものを求めよ。
(2) 13 で割ると 5 余り、31 で割ると 2 余る正の整数のうち、最小のものを求めよ。
(3) 等式 $13x + 31y = 1000$ を満たす正の整数の組 $(x,\ y)$ の個数を求めよ。
(4) $2^{n} - 1$ が $403$ で割り切れるような最小の正の整数 $n$ を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)x', q: R`$x$ の値`, type: 'num', answer: 12 },
        { label: '(1)y', q: R`$y$ の値`, type: 'num', answer: -5 },
        { label: '(2)', q: R`最小の正の整数`, type: 'num', answer: 343 },
        { label: '(3)', q: R`組の個数`, type: 'num', answer: 3 },
        { label: '(4)', q: R`最小の $n$`, type: 'num', answer: 60 }
      ],
      solution: [
        {
          t: '(1) ユークリッドの互除法',
          m: [R`31 = 13 \cdot 2 + 5,\quad 13 = 5 \cdot 2 + 3,\quad 5 = 3 \cdot 1 + 2,\quad 3 = 2 \cdot 1 + 1`],
          n: R`余りが $1$ になるまで割り算を続けます。最後の余りが $1$ なので $13$ と $31$ は互いに素です。`,
          easy: R`互除法は「大きい方を小さい方で割った余り」に置きかえていく方法です。各式を「余り $=$ 割られる数 $-$ 商 × 割る数」と読み直し、下から上へ代入していくと、$1$ を $13$ と $31$ の組合せで表せます。`
        },
        {
          t: '割り算の式を逆にたどる',
          m: [R`1 = 3 - 2 = 3 - (5 - 3) = 2 \cdot 3 - 5`, R`= 2(13 - 2 \cdot 5) - 5 = 2 \cdot 13 - 5 \cdot 5`, R`= 2 \cdot 13 - 5(31 - 2 \cdot 13) = 12 \cdot 13 - 5 \cdot 31`],
          lv: 2
        },
        {
          t: '一般解',
          m: [R`13x + 31y = 1,\quad 13 \cdot 12 + 31 \cdot (-5) = 1`, R`13(x - 12) = -31(y + 5)`, R`x = 12 + 31k,\quad y = -5 - 13k\quad (k\ \text{は整数})`],
          n: R`$13$ と $31$ は互いに素なので $x - 12$ は $31$ の倍数です。$x$ が最小の正の整数になるのは $k = 0$ のときで、$(x,\ y) = (12,\ -5)$ です。`
        },
        {
          t: '(2) 2 つの余りの条件を不定方程式に',
          m: [R`N = 13s + 5 = 31t + 2 \;\Rightarrow\; 13s - 31t = -3`, R`(1)\ \text{を}\ -3\ \text{倍}:\ 13 \cdot (-36) - 31 \cdot (-15) = -3`, R`s = -36 + 31k \;\Rightarrow\; N = 13(-36 + 31k) + 5 = 403k - 463`],
          n: R`$N > 0$ となる最小は $k = 2$ のときで $N = 806 - 463 = 343$ です。実際 $343 = 13 \cdot 26 + 5 = 31 \cdot 11 + 2$ です。`,
          pro: R`条件を満たす整数は $403$（$= 13 \cdot 31$）ごとに現れます（中国剰余定理）。最小解を 1 つ見つければ、残りは $343 + 403k$ です。`
        },
        {
          t: '(3) 正の整数解を数える',
          m: [R`13 \cdot 12000 + 31 \cdot (-5000) = 1000`, R`x = 12000 - 31m,\quad y = -5000 + 13m\quad (m\ \text{は整数})`, R`x > 0 \Leftrightarrow m \le 387,\qquad y > 0 \Leftrightarrow m \ge 385`],
          n: R`(1) の式を $1000$ 倍して特殊解を作りました。$m = 385,\ 386,\ 387$ に対応する $(x,\ y) = (65,\ 5),\ (34,\ 18),\ (3,\ 31)$ の **3 組** です。`,
          easy: R`$\dfrac{12000}{31} = 387.0\cdots$、$\dfrac{5000}{13} = 384.6\cdots$ なので、$m$ は $385 \le m \le 387$ の整数です。実際に $13 \cdot 65 + 31 \cdot 5 = 845 + 155 = 1000$ などと確かめられます。`
        },
        {
          t: '(4) 13 と 31 で別々に考える',
          m: [R`403 = 13 \cdot 31`, R`2^{1},\ 2^{2},\ \cdots,\ 2^{5} \equiv 2,\ 4,\ 8,\ 16,\ 1 \quad (\mathrm{mod}\ 31)`, R`2^{1},\ \cdots,\ 2^{12} \equiv 2,\ 4,\ 8,\ 3,\ 6,\ 12,\ 11,\ 9,\ 5,\ 10,\ 7,\ 1 \quad (\mathrm{mod}\ 13)`],
          n: R`$13$ と $31$ は互いに素な素数なので、「$403$ で割り切れる」は「$13$ でも $31$ でも割り切れる」と同じです。$2^{n}$ を割った余りは、$31$ では周期 $5$、$13$ では周期 $12$ でくり返します。`,
          easy: R`$2^{n}$ の余りは、1 つ前の余りを 2 倍してまた割れば求まります（たとえば $13$ で割った余り $8$ の次は $16$ を $13$ で割って $3$）。余りが一度 $1$ に戻ると、その後は同じ並びのくり返しになります。`
        },
        {
          t: '最小の n',
          m: [R`2^{n} \equiv 1\ (\mathrm{mod}\ 31) \Leftrightarrow n\ \text{は}\ 5\ \text{の倍数}`, R`2^{n} \equiv 1\ (\mathrm{mod}\ 13) \Leftrightarrow n\ \text{は}\ 12\ \text{の倍数}`, R`n\ \text{は}\ 5\ \text{と}\ 12\ \text{の公倍数} \;\Rightarrow\; n = 60`],
          n: R`$5$ と $12$ の最小公倍数 $60$ が答えです。`,
          pro: R`フェルマーの小定理より $2^{12} \equiv 1\ (\mathrm{mod}\ 13)$、$2^{30} \equiv 1\ (\mathrm{mod}\ 31)$ です。$2^{n} \equiv 1$ となる最小の $n$（位数）は $p - 1$ の約数なので、候補を約数に絞って調べると速くなります。`
        }
      ],
      prereq: ['m-expr'],
      tags: ['ユークリッドの互除法', '1次不定方程式', '中国剰余定理', '合同式', '位数']
    },

    /* ---------- 図形の性質: チェバ・メネラウス・方べき ---------- */
    {
      id: 'm-adv-geo-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-geo',
      title: 'チェバ・メネラウスと方べき',
      source: ORIG,
      time: 18,
      body: R`$\triangle\mathrm{ABC}$ において、辺 AB を $1:2$ に内分する点を D、辺 AC を $3:2$ に内分する点を E とする。線分 BE と線分 CD の交点を P、直線 AP と辺 BC の交点を F とする。次の問いに答えよ。

(1) $\mathrm{BF}:\mathrm{FC} = t:1$ となる $t$ の値を求めよ。
(2) $\mathrm{AP}:\mathrm{PF} = s:1$ となる $s$ の値を求めよ。
(3) $\triangle\mathrm{PAB}$ の面積は $\triangle\mathrm{ABC}$ の面積の何倍か。
(4) $\mathrm{AB} = 6,\ \mathrm{BC} = 5$ とし、さらに 4 点 B, C, E, D が同一円周上にあるとする。このとき辺 AC の長さを求めよ。
(5) (4) のとき、線分 DE の長さを求めよ。`,
      fig: FIG_GEO,
      parts: [
        { label: '(1)', q: R`$t$ の値`, type: 'num', answer: 3 },
        { label: '(2)', q: R`$s$ の値`, type: 'num', answer: 2 },
        { label: '(3)', q: R`$\triangle\mathrm{PAB}$ は $\triangle\mathrm{ABC}$ の何倍か`, type: 'num', answer: 1 / 2, show: R`\frac{1}{2}` },
        { label: '(4)', q: R`AC の長さ`, type: 'num', answer: 2 * S5, show: R`2\sqrt{5}` },
        { label: '(5)', q: R`DE の長さ`, type: 'num', answer: S5, show: R`\sqrt{5}` }
      ],
      solution: [
        {
          t: '(1) チェバの定理',
          m: [R`\frac{\mathrm{AD}}{\mathrm{DB}} \cdot \frac{\mathrm{BF}}{\mathrm{FC}} \cdot \frac{\mathrm{CE}}{\mathrm{EA}} = 1`, R`\frac{1}{2} \cdot \frac{\mathrm{BF}}{\mathrm{FC}} \cdot \frac{2}{3} = 1 \;\Rightarrow\; \frac{\mathrm{BF}}{\mathrm{FC}} = 3`],
          n: R`3 本の線分 AF, BE, CD が 1 点 P で交わるのでチェバの定理が使えます。よって $t = 3$ です。`,
          easy: R`チェバの定理は、三角形の 3 つの頂点から対辺に引いた 3 本の線が 1 点で交わるとき、頂点 → 分点 → 頂点 … と三角形を 1 周しながら辺の比を掛けると $1$ になる、という定理です。A → D → B → F → C → E → A の順にたどります。`
        },
        {
          t: '(2) メネラウスの定理',
          m: [R`\triangle\mathrm{ABF}\ \text{と直線 DC}:\ \frac{\mathrm{AD}}{\mathrm{DB}} \cdot \frac{\mathrm{BC}}{\mathrm{CF}} \cdot \frac{\mathrm{FP}}{\mathrm{PA}} = 1`, R`\frac{1}{2} \cdot \frac{4}{1} \cdot \frac{\mathrm{FP}}{\mathrm{PA}} = 1 \;\Rightarrow\; \frac{\mathrm{FP}}{\mathrm{PA}} = \frac{1}{2}`],
          n: R`$\mathrm{BF}:\mathrm{FC} = 3:1$ より $\mathrm{BC}:\mathrm{CF} = 4:1$ です。よって $\mathrm{AP}:\mathrm{PF} = 2:1$、$s = 2$ です。`,
          easy: R`メネラウスの定理は、三角形の 3 辺（またはその延長）を 1 本の直線が横切るとき、頂点 → 交点 → 頂点 … と 1 周して比を掛けると $1$ になる、という定理です。ここでは $\triangle\mathrm{ABF}$ を直線 DPC が横切っています（C は辺 BF の延長上）。`
        },
        {
          t: '(3) 面積比',
          m: R`\triangle\mathrm{PAB} = \frac{\mathrm{AP}}{\mathrm{AF}}\,\triangle\mathrm{FAB} = \frac{2}{3} \cdot \frac{\mathrm{BF}}{\mathrm{BC}}\,\triangle\mathrm{ABC} = \frac{2}{3} \cdot \frac{3}{4}\,\triangle\mathrm{ABC} = \frac{1}{2}\,\triangle\mathrm{ABC}`,
          n: R`高さが共通な三角形の面積比は底辺の比です。これを 2 回使いました。`,
          pro: R`ベクトルで表すと $\overrightarrow{\mathrm{AP}} = \dfrac{1}{6}\overrightarrow{\mathrm{AB}} + \dfrac{1}{2}\overrightarrow{\mathrm{AC}}$ となり、$\triangle\mathrm{PBC} : \triangle\mathrm{PCA} : \triangle\mathrm{PAB} = 2 : 1 : 3$ が一度に読み取れます。`
        },
        {
          t: '(4) 方べきの定理',
          m: [R`\mathrm{AD} \cdot \mathrm{AB} = \mathrm{AE} \cdot \mathrm{AC}`, R`\mathrm{AD} = 2,\quad \mathrm{AE} = \frac{3}{5}\mathrm{AC} \;\Rightarrow\; 2 \cdot 6 = \frac{3}{5}\mathrm{AC}^{2}`, R`\mathrm{AC}^{2} = 20 \;\Rightarrow\; \mathrm{AC} = 2\sqrt{5}`],
          n: R`点 A から円に 2 本の直線（AB 上と AC 上）を引いた形なので、方べきの定理が使えます。`,
          easy: R`方べきの定理：円の外の点 A を通る直線が円と 2 点で交わるとき、「A から近い交点までの長さ × 遠い交点までの長さ」は直線の引き方によらず一定です。ここでは直線 AB 上の交点が D, B、直線 AC 上の交点が E, C です。`
        },
        {
          t: '三角形が実際に存在するか',
          n: R`3 辺 $6,\ 5,\ 2\sqrt{5}\ (\fallingdotseq 4.47)$ は $6 < 5 + 2\sqrt{5}$ などの三角形の成立条件を満たします。`,
          lv: 2
        },
        {
          t: '(5) 相似な三角形',
          m: [R`\frac{\mathrm{AD}}{\mathrm{AC}} = \frac{2}{2\sqrt{5}} = \frac{1}{\sqrt{5}},\qquad \frac{\mathrm{AE}}{\mathrm{AB}} = \frac{\frac{6\sqrt{5}}{5}}{6} = \frac{1}{\sqrt{5}}`, R`\triangle\mathrm{ADE} \sim \triangle\mathrm{ACB} \;\Rightarrow\; \mathrm{DE} = \frac{\mathrm{BC}}{\sqrt{5}} = \frac{5}{\sqrt{5}} = \sqrt{5}`],
          n: R`$\angle\mathrm{A}$ が共通で、挟む 2 辺の比が等しいので相似です（対応は D ↔ C、E ↔ B）。`,
          pro: R`4 点が同一円周上 $\Leftrightarrow$ $\angle\mathrm{ADE} = \angle\mathrm{ACB}$（内接四角形の外角）なので、方べきの式も相似も同じ事実の言いかえです。`
        }
      ],
      prereq: ['m-geo0', 'm-trig1'],
      tags: ['チェバの定理', 'メネラウスの定理', '面積比', '方べきの定理', '相似']
    },

    /* ---------- 式と証明: 相加平均・相乗平均と等号成立 ---------- */
    {
      id: 'm-adv-proof-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-proof',
      title: '相加・相乗平均と等号成立条件',
      source: ORIG,
      time: 16,
      body: R`$x,\ y$ を正の実数とする。次の問いに答えよ。

(1) $(x + 4y)\left(\dfrac{1}{x} + \dfrac{1}{y}\right)$ の最小値を求めよ。
(2) $x + 4y = 3$ のとき、$\dfrac{1}{x} + \dfrac{1}{y}$ の最小値を求めよ。
(3) $x + 4y = 3$ のとき、$xy$ の最大値を求めよ。
(4) $x + 4y = 3$ のとき、$x^{2} + 4y^{2}$ の最小値を求めよ。
(5) (1) について、ある生徒が次のように考えた。

「相加平均と相乗平均の大小関係から $x + 4y \ge 2\sqrt{4xy} = 4\sqrt{xy}$、$\dfrac{1}{x} + \dfrac{1}{y} \ge \dfrac{2}{\sqrt{xy}}$ が成り立つ。これらを辺々掛けると $(x + 4y)\left(\dfrac{1}{x} + \dfrac{1}{y}\right) \ge 8$ となるから、最小値は $8$ である。」

この考え方についての記述として正しいものを選べ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`最小値`, type: 'num', answer: 9 },
        { label: '(2)', q: R`最小値`, type: 'num', answer: 3 },
        { label: '(3)', q: R`最大値`, type: 'num', answer: 9 / 16, show: R`\frac{9}{16}` },
        { label: '(4)', q: R`最小値`, type: 'num', answer: 9 / 5, show: R`\frac{9}{5}` },
        {
          label: '(5)', q: R`正しい記述`, type: 'choice',
          choices: [
            R`2 つの不等式のうち少なくとも一方が誤っているので、結論も誤りである。`,
            R`2 つの不等式は正しく、辺々掛けた不等式も正しいので、最小値は $8$ である。`,
            R`2 つの不等式は正しいが、不等式どうしを辺々掛けることはできないので誤りである。`,
            R`辺々掛けた不等式までは正しいが、2 つの等号を同時に成り立たせる $x,\ y$ が存在しないので、$8$ は最小値ではない。`,
            R`相加平均と相乗平均の大小関係は $x,\ y$ が整数のときにしか使えないので誤りである。`
          ],
          answer: 3
        }
      ],
      solution: [
        {
          t: '(1) 展開する',
          m: R`(x + 4y)\left(\frac{1}{x} + \frac{1}{y}\right) = 1 + \frac{x}{y} + \frac{4y}{x} + 4 = 5 + \frac{x}{y} + \frac{4y}{x}`,
          n: R`$\dfrac{x}{y}$ と $\dfrac{4y}{x}$ は積が $4$（一定）になる 2 つの正の数です。`
        },
        {
          t: '相加平均・相乗平均の大小関係',
          m: [R`\frac{x}{y} + \frac{4y}{x} \ge 2\sqrt{\frac{x}{y} \cdot \frac{4y}{x}} = 4`, R`\text{等号}:\ \frac{x}{y} = \frac{4y}{x} \Leftrightarrow x = 2y`],
          n: R`よって $(x + 4y)\left(\dfrac{1}{x} + \dfrac{1}{y}\right) \ge 9$ で、等号は $x = 2y$（たとえば $x = 2,\ y = 1$）のとき成り立つので、最小値は $9$ です。`,
          easy: R`正の数 $a,\ b$ について $\dfrac{a + b}{2} \ge \sqrt{ab}$（等号は $a = b$ のとき）。これは $(\sqrt{a} - \sqrt{b})^{2} \ge 0$ を展開すれば得られます。「積が一定なら和には最小値がある」と覚えておくと、どこで使うかが見えます。`,
          pro: R`「$\ge 9$」を示しただけでは最小値とはいえません。等号を成立させる $x,\ y$ を 1 組示して初めて最小値 $9$ が確定します。`
        },
        {
          t: R`(2) (1) を利用する`,
          m: [R`3\left(\frac{1}{x} + \frac{1}{y}\right) \ge 9 \;\Rightarrow\; \frac{1}{x} + \frac{1}{y} \ge 3`, R`\text{等号}:\ x = 2y,\ x + 4y = 3 \;\Rightarrow\; x = 1,\ y = \frac{1}{2}`],
          n: R`$x + 4y = 3$ を (1) の不等式に代入しました。等号が成り立つ $x,\ y$ が存在するので最小値は $3$ です。`
        },
        {
          t: '(3) 和が一定のときの積の最大',
          m: [R`3 = x + 4y \ge 2\sqrt{x \cdot 4y} = 4\sqrt{xy} \;\Rightarrow\; \sqrt{xy} \le \frac{3}{4} \;\Rightarrow\; xy \le \frac{9}{16}`, R`\text{等号}:\ x = 4y = \frac{3}{2} \;\Rightarrow\; x = \frac{3}{2},\ y = \frac{3}{8}`],
          n: R`最大値は $\dfrac{9}{16}$ です。`
        },
        {
          t: '(4) 1 文字消去して平方完成',
          m: [R`x = 3 - 4y\quad \left(0 < y < \frac{3}{4}\right)`, R`x^{2} + 4y^{2} = (3 - 4y)^{2} + 4y^{2} = 20y^{2} - 24y + 9 = 20\left(y - \frac{3}{5}\right)^{2} + \frac{9}{5}`],
          n: R`$y = \dfrac{3}{5}$（このとき $x = \dfrac{3}{5} > 0$）で最小値 $\dfrac{9}{5}$ をとります。$y$ の変域の中に頂点があることを確認しました。`,
          pro: R`コーシー・シュワルツの不等式 $(x^{2} + 4y^{2})(1 + 4) \ge (x + 4y)^{2} = 9$ からも $\dfrac{9}{5}$ が出ます（等号は $x = y$）。`
        },
        {
          t: '(5) 生徒の考え方の誤り',
          m: [R`x + 4y = 4\sqrt{xy}\ \text{の等号}:\ x = 4y,\qquad \frac{1}{x} + \frac{1}{y} = \frac{2}{\sqrt{xy}}\ \text{の等号}:\ x = y`, R`x = 4y\ \text{かつ}\ x = y \;\Rightarrow\; x = y = 0\ \text{（正の数でない）}`],
          n: R`正の数どうしの不等式は辺々掛けてよいので「$\ge 8$」自体は正しい不等式です。しかし等号が同時に成り立つ $x,\ y$ がないので、左辺が $8$ になることはなく、$8$ は最小値ではありません（実際の最小値は $9$）。正しい記述は選択肢 **3** です。`,
          easy: R`「$A \ge 8$」は「$A$ は $8$ より小さくならない」という意味で、「$A$ が $8$ になれる」ことまでは言っていません。最小値と言うには、実際に $8$ になる $x,\ y$ が必要です。`
        }
      ],
      prereq: ['m-expr'],
      tags: ['相加平均と相乗平均', '等号成立条件', '最大・最小', '条件つき最小']
    },

    /* ---------- 複素数と方程式: 相反方程式 ---------- */
    {
      id: 'm-adv-complex-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-complex',
      title: '相反方程式の解と実数解の条件',
      source: ORIG,
      time: 20,
      body: R`$k$ を実数の定数とし、$x$ の 4 次方程式
$$x^{4} - 4x^{3} + kx^{2} - 4x + 1 = 0 \quad \cdots (*)$$
を考える。次の問いに答えよ。

(1) $x = 0$ は $(*)$ の解ではないので、$(*)$ の両辺を $x^{2}$ で割り、$t = x + \dfrac{1}{x}$ とおくと、$(*)$ は $t^{2} - 4t + \boxed{\ \ } = 0$ と表される。空欄に当てはまる $k$ の式を求めよ。
(2) $k = 5$ のとき、$(*)$ の実数解のうち最大のものを求めよ。
(3) $k = 5$ のとき、$(*)$ の虚数解の 1 つを $\alpha$ とする。$\alpha^{3}$ の値を求めよ。
(4) $(*)$ が実数解をもつような $k$ の最大値を求めよ。
(5) $(*)$ が異なる 4 つの実数解をもつような $k$ の値の範囲を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`空欄（$k$ の式）`, type: 'expr', answer: 'k-2', vars: ['k'], show: R`k - 2`, hint: '例: k+3 のように入力' },
        { label: '(2)', q: R`最大の実数解`, type: 'num', answer: (3 + S5) / 2, show: R`\frac{3 + \sqrt{5}}{2}`, hint: '例: (1+√5)/2 のように入力' },
        { label: '(3)', q: R`$\alpha^{3}$ の値`, type: 'num', answer: -1 },
        { label: '(4)', q: R`$k$ の最大値`, type: 'num', answer: 6 },
        { label: '(5)', q: R`(5) の範囲は $k < m$ の形になる。$m$ の値`, type: 'num', answer: -10 }
      ],
      solution: [
        {
          t: R`(1) $x^{2}$ で割って $t$ に置きかえる`,
          m: [R`x^{2} - 4x + k - \frac{4}{x} + \frac{1}{x^{2}} = 0 \;\Rightarrow\; \left(x^{2} + \frac{1}{x^{2}}\right) - 4\left(x + \frac{1}{x}\right) + k = 0`, R`x^{2} + \frac{1}{x^{2}} = \left(x + \frac{1}{x}\right)^{2} - 2 = t^{2} - 2`, R`t^{2} - 4t + (k - 2) = 0`],
          n: R`空欄は $k - 2$ です。`,
          easy: R`$(*)$ の係数は $1,\ -4,\ k,\ -4,\ 1$ と左右対称に並んでいます（**相反方程式**）。このタイプは真ん中の $x^{2}$ で割ると $x$ と $\dfrac{1}{x}$ が対になって現れるので、$t = x + \dfrac{1}{x}$ とおくと次数が半分（2 次）に下がります。`
        },
        {
          t: R`(2) $k = 5$ のとき`,
          m: [R`t^{2} - 4t + 3 = 0 \;\Rightarrow\; t = 1,\ 3`, R`t = 3:\ x^{2} - 3x + 1 = 0 \;\Rightarrow\; x = \frac{3 \pm \sqrt{5}}{2}`, R`t = 1:\ x^{2} - x + 1 = 0 \;\Rightarrow\; x = \frac{1 \pm \sqrt{3}\,i}{2}`],
          n: R`$x + \dfrac{1}{x} = t$ の両辺に $x$ を掛けると $x^{2} - tx + 1 = 0$ です。実数解のうち最大のものは $\dfrac{3 + \sqrt{5}}{2}$ です。`
        },
        {
          t: R`(3) $\alpha^{3}$ の値`,
          m: [R`\alpha^{2} - \alpha + 1 = 0`, R`(\alpha + 1)(\alpha^{2} - \alpha + 1) = \alpha^{3} + 1 = 0 \;\Rightarrow\; \alpha^{3} = -1`],
          n: R`虚数解 $\alpha$ は $x^{2} - x + 1 = 0$ の解です。`,
          easy: R`$\alpha = \dfrac{1 + \sqrt{3}\,i}{2}$ を 3 乗してもよいのですが、$\alpha^{2} = \alpha - 1$ を使って次数を下げるか、上のように $(\alpha + 1)$ を掛けて $\alpha^{3} + 1$ を作る方が計算ミスが減ります。$a^{3} + b^{3} = (a + b)(a^{2} - ab + b^{2})$ の形です。`,
          pro: R`$x^{2} - x + 1 = 0$ の解は「$x^{3} = -1$ の虚数解」です。$\alpha^{6} = 1$ など、累乗の周期性もすぐ使えます。`
        },
        {
          t: R`$x$ が実数になるための $t$ の条件`,
          m: R`x^{2} - tx + 1 = 0\ \text{が実数解をもつ} \;\Leftrightarrow\; t^{2} - 4 \ge 0 \;\Leftrightarrow\; t \le -2,\ 2 \le t`,
          n: R`$t$ が実数でも、$|t| < 2$ なら対応する $x$ は虚数です。$|t| > 2$ の $t$ 1 つにつき異なる実数 $x$ が 2 つ、$t = \pm 2$ なら $x = \pm 1$ が 1 つ対応します。また、異なる $t$ から同じ $x$ は出ません。`,
          easy: R`$x > 0$ のとき相加・相乗平均から $x + \dfrac{1}{x} \ge 2$、$x < 0$ のとき $x + \dfrac{1}{x} \le -2$ です。つまり実数 $x$ に対して $t = x + \dfrac{1}{x}$ は $-2$ と $2$ の間の値をとれません。`
        },
        {
          t: '(4) 実数解をもつ条件',
          m: [R`t = 2 \pm \sqrt{6 - k}\quad (k \le 6\ \text{のとき実数})`, R`t_{+} = 2 + \sqrt{6 - k} \ge 2`],
          n: R`$k \le 6$ なら $t_{+} \ge 2$ なので、$t_{+}$ に対応する実数 $x$ が必ずあります。$k > 6$ なら $t$ は虚数で、実数 $x$ は存在しません。よって最大値は $k = 6$ です（このとき $(*)$ は $(x - 1)^{4} = 0$）。`
        },
        {
          t: '(5) 異なる 4 つの実数解',
          m: [R`t_{+} > 2 \Leftrightarrow k < 6,\qquad t_{-} = 2 - \sqrt{6 - k} < -2 \Leftrightarrow \sqrt{6 - k} > 4 \Leftrightarrow k < -10`],
          n: R`異なる 4 つの実数解には、異なる 2 つの $t$ がどちらも $|t| > 2$ を満たすことが必要十分です。$t_{-} < 2$ なので $t_{-} < -2$ が必要で、答えは $k < -10$、つまり $m = -10$ です。`,
          pro: R`$k = -(t^{2} - 4t - 2)$ と分離し、放物線 $k = -(t - 2)^{2} + 6$ と水平線の交点のうち $|t| > 2$ にあるものを数えると、場合分けが一目でわかります。$k = -10$ では $t = -2$（$x = -1$ の重解）が現れ、実数解は 3 個です。`
        }
      ],
      prereq: ['m-quad', 'm-expr'],
      tags: ['相反方程式', '置き換え', '虚数解', '実数解の個数']
    },

    /* ---------- 図形と方程式: 放物線の通過領域 ---------- */
    {
      id: 'm-adv-coord-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-coord',
      title: '動く放物線が通過する領域',
      source: ORIG,
      time: 20,
      body: R`$t$ を実数とし、放物線 $C_{t}:\ y = (x - t)^{2} + t$ を考える。$t$ が $t \ge 0$ の範囲を動くとき、$C_{t}$ が通過する領域を $E$ とする。次の問いに答えよ。

(1) 点 $(-1,\ Y)$ が $E$ に含まれるような $Y$ の最小値を求めよ。
(2) 点 $(2,\ Y)$ が $E$ に含まれるような $Y$ の最小値を求めよ。
(3) $x \ge \dfrac{1}{2}$ の範囲では、領域 $E$ の境界は直線になる。その直線の方程式 $y = \boxed{\ \ }$ を求めよ。
(4) 領域 $E$ のうち、$y < x^{2}$ かつ $x \le 2$ を満たす部分の面積を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$Y$ の最小値`, type: 'num', answer: 1 },
        { label: '(2)', q: R`$Y$ の最小値`, type: 'num', answer: 7 / 4, show: R`\frac{7}{4}` },
        { label: '(3)', q: R`$y = \boxed{\ \ }$（$x$ の式）`, type: 'expr', answer: 'x-1/4', vars: ['x'], show: R`x - \frac{1}{4}` },
        { label: '(4)', q: R`面積`, type: 'num', answer: 9 / 8, show: R`\frac{9}{8}` }
      ],
      solution: [
        {
          t: '考え方：x を固定して t を動かす',
          n: R`直線 $x = X$ 上で $E$ に含まれる点は、$t \ge 0$ を動かしたときに $y = (X - t)^{2} + t$ がとる値の全体です。そこで $X$ を固定し、$y$ を **$t$ の関数**とみてその値域を求めます。`,
          easy: R`放物線が動いた跡（通過領域）を直接描くのは大変です。そこで縦の直線 $x = X$ を 1 本固定し、「この直線上のどの高さを、どれかの放物線が通るか」を調べます。それをすべての $X$ について集めたものが通過領域です。`,
          pro: R`「$x$ を固定して、もう一方の文字の値域を調べる」（いわゆるファクシミリの原理）は通過領域の定石です。「$t$ の方程式が $t \ge 0$ に解をもつ条件」と読みかえても同じ結論になります。`
        },
        {
          t: R`$t$ について平方完成`,
          m: R`y = t^{2} - (2X - 1)t + X^{2} = \left\{t - \left(X - \frac{1}{2}\right)\right\}^{2} + X - \frac{1}{4}`,
          n: R`$t$ の 2 次関数で、軸は $t = X - \dfrac{1}{2}$ です。$t \to \infty$ で $y \to \infty$ なので、値域は「最小値以上のすべての実数」になります。`
        },
        {
          t: R`$t \ge 0$ での最小値`,
          m: [R`X \ge \frac{1}{2}:\ \text{軸が}\ t \ge 0\ \text{にある} \;\Rightarrow\; \text{最小値}\ X - \frac{1}{4}`, R`X < \frac{1}{2}:\ \text{軸が}\ t < 0 \;\Rightarrow\; t = 0\ \text{で最小値}\ X^{2}`],
          n: R`軸が変域 $t \ge 0$ の外（左側）にあるときは、変域の左端 $t = 0$ で最小になります。`
        },
        {
          t: '(1)(2) 最小値',
          m: [R`X = -1:\ Y \ge (-1)^{2} = 1`, R`X = 2:\ Y \ge 2 - \frac{1}{4} = \frac{7}{4}`],
          n: R`(1) は $1$、(2) は $\dfrac{7}{4}$ です。`
        },
        {
          t: R`(3) 領域 $E$ の境界`,
          m: [R`E:\ y \ge x^{2}\ \left(x < \frac{1}{2}\right),\qquad y \ge x - \frac{1}{4}\ \left(x \ge \frac{1}{2}\right)`, R`x^{2} - \left(x - \frac{1}{4}\right) = \left(x - \frac{1}{2}\right)^{2} \ge 0`],
          n: R`$x \ge \dfrac{1}{2}$ での境界は直線 $y = x - \dfrac{1}{4}$ です。2 行目から、この直線は放物線 $y = x^{2}$ の点 $\left(\dfrac{1}{2},\ \dfrac{1}{4}\right)$ における接線だとわかります。`,
          fig: FIG_COORD
        },
        {
          t: '(4) 面積',
          m: [R`\int_{1/2}^{2} \left\{x^{2} - \left(x - \frac{1}{4}\right)\right\}dx = \int_{1/2}^{2} \left(x - \frac{1}{2}\right)^{2}dx`, R`= \left[\frac{1}{3}\left(x - \frac{1}{2}\right)^{3}\right]_{1/2}^{2} = \frac{1}{3} \cdot \left(\frac{3}{2}\right)^{3} = \frac{9}{8}`],
          n: R`$x < \dfrac{1}{2}$ では $E$ は $y \ge x^{2}$ なので、$y < x^{2}$ の部分はありません。求める部分は $\dfrac{1}{2} \le x \le 2$ で接線と放物線にはさまれた部分（図の塗った部分）です。`,
          easy: R`$\int (x - p)^{2}dx = \dfrac{1}{3}(x - p)^{3} + C$ を使うと、展開せずに計算できます。`
        }
      ],
      prereq: ['m-quad', 'm-calc2'],
      tags: ['通過領域', 'パラメータの消去', '場合分け', '接線', '面積']
    },

    /* ---------- 三角関数: sinθ + cosθ = t の置き換え ---------- */
    {
      id: 'm-adv-trig2-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-trig2',
      title: 'sinθ+cosθ の置き換えと最小値',
      source: ORIG,
      time: 18,
      body: R`$a$ を実数の定数とし、$0 \le \theta \le \pi$ において
$$f(\theta) = \sin 2\theta - 2a(\sin\theta + \cos\theta) + 1$$
を考える。$t = \sin\theta + \cos\theta$ とおく。次の問いに答えよ。

(1) $t$ のとりうる値の最小値を求めよ。
(2) $f(\theta)$ を $t$ と $a$ の式で表せ。
(3) $a = \dfrac{1}{2}$ のとき、$f(\theta)$ の最大値を求めよ。
(4) $f(\theta)$ の最小値が $-4$ となるような $a$ の値をすべて求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$t$ の最小値`, type: 'num', answer: -1 },
        { label: '(2)', q: R`$f(\theta) = \boxed{\ \ }$（$t,\ a$ の式）`, type: 'expr', answer: 't^2-2a*t', vars: ['t', 'a'], show: R`t^{2} - 2at`, hint: '例: t^2 + 3at のように入力' },
        { label: '(3)', q: R`最大値`, type: 'num', answer: 2 },
        { label: '(4)小', q: R`(4) の $a$ は 2 つある。小さい方`, type: 'num', answer: -5 / 2, show: R`-\frac{5}{2}` },
        { label: '(4)大', q: R`大きい方`, type: 'num', answer: 3 * S2 / 2, show: R`\frac{3\sqrt{2}}{2}` }
      ],
      solution: [
        {
          t: R`(1) 合成で $t$ の範囲を求める`,
          m: [R`t = \sin\theta + \cos\theta = \sqrt{2}\sin\left(\theta + \frac{\pi}{4}\right)`, R`\frac{\pi}{4} \le \theta + \frac{\pi}{4} \le \frac{5\pi}{4} \;\Rightarrow\; -\frac{1}{\sqrt{2}} \le \sin\left(\theta + \frac{\pi}{4}\right) \le 1`, R`-1 \le t \le \sqrt{2}`],
          n: R`最小値は $-1$（$\theta = \pi$ のとき）です。`,
          easy: R`$\sin\theta + \cos\theta$ は、単位円上の点の $x$ 座標と $y$ 座標の和です。合成すると振幅 $\sqrt{2}$ の 1 つのサインになり、範囲が読み取れます。$\theta$ の範囲が $0 \le \theta \le \pi$ に限られているので、$\theta + \dfrac{\pi}{4}$ の範囲をきちんと単位円で確認します。`
        },
        {
          t: R`(2) $\sin 2\theta$ を $t$ で表す`,
          m: [R`t^{2} = \sin^{2}\theta + 2\sin\theta\cos\theta + \cos^{2}\theta = 1 + \sin 2\theta`, R`f(\theta) = (t^{2} - 1) - 2at + 1 = t^{2} - 2at`],
          n: R`$\sin\theta + \cos\theta$ を 2 乗すると $\sin 2\theta$ が現れるのがこの置き換えの急所です。`,
          pro: R`$\sin\theta\cos\theta$ と $\sin\theta + \cos\theta$ が混在する式は、$t = \sin\theta + \cos\theta$ で $t$ の 2 次関数になる、が定番です。$t$ の変域を最初に求めておくことを忘れないようにします。`
        },
        {
          t: R`(3) $a = \dfrac{1}{2}$ のとき`,
          m: [R`g(t) = t^{2} - t = \left(t - \frac{1}{2}\right)^{2} - \frac{1}{4}\quad (-1 \le t \le \sqrt{2})`, R`g(-1) = 2,\qquad g(\sqrt{2}) = 2 - \sqrt{2}`],
          n: R`下に凸の放物線の最大値は、軸 $t = \dfrac{1}{2}$ から遠い方の端でとります。$\dfrac{1}{2} - (-1) = \dfrac{3}{2} > \sqrt{2} - \dfrac{1}{2}$ なので、最大値は $g(-1) = 2$（$\theta = \pi$）です。`
        },
        {
          t: R`(4) 最小値 $m(a)$ の場合分け`,
          m: [R`g(t) = t^{2} - 2at = (t - a)^{2} - a^{2}`, R`m(a) = \begin{cases} g(-1) = 1 + 2a & (a < -1) \\ g(a) = -a^{2} & (-1 \le a \le \sqrt{2}) \\ g(\sqrt{2}) = 2 - 2\sqrt{2}\,a & (a > \sqrt{2}) \end{cases}`],
          n: R`軸 $t = a$ が変域 $-1 \le t \le \sqrt{2}$ の左・中・右のどこにあるかで分けます。`,
          easy: R`下に凸の放物線は、軸が区間の中なら頂点、区間より左なら左端、区間より右なら右端で最小です。$a$ が動くと軸が左右に動くイメージをもちましょう。`
        },
        {
          t: R`$m(a) = -4$ を解く`,
          m: [R`a < -1:\ 1 + 2a = -4 \;\Rightarrow\; a = -\frac{5}{2}\ \text{（適）}`, R`-1 \le a \le \sqrt{2}:\ -a^{2} = -4 \;\Rightarrow\; a = \pm 2\ \text{（範囲外で不適）}`, R`a > \sqrt{2}:\ 2 - 2\sqrt{2}\,a = -4 \;\Rightarrow\; a = \frac{3}{\sqrt{2}} = \frac{3\sqrt{2}}{2}\ \text{（適）}`],
          n: R`$\dfrac{3\sqrt{2}}{2} \fallingdotseq 2.12 > \sqrt{2}$ なので条件を満たします。よって $a = -\dfrac{5}{2},\ \dfrac{3\sqrt{2}}{2}$ です。`,
          pro: R`各場合で出た $a$ が、その場合の前提（$a < -1$ など）を満たすか必ず確認します。真ん中の場合の $a = \pm 2$ を答えに含めるのが典型的な誤りです。`
        }
      ],
      prereq: ['m-trig1', 'm-quad'],
      tags: ['置き換え', '三角関数の合成', '2倍角', '場合分け', '最大・最小']
    },

    /* ---------- 指数・対数関数: 底が変数の対数不等式と領域 ---------- */
    {
      id: 'm-adv-explog-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-explog',
      title: '底が変数の対数不等式と領域',
      source: ORIG,
      time: 20,
      body: R`1 でない正の数 $x,\ y$ について、不等式
$$\log_{x} y - 2\log_{y} x > 1 \quad \cdots (*)$$
を考える。次の問いに答えよ。

(1) $t = \log_{x} y$ とおく。$(*)$ を満たす $t$ の範囲は $-1 < t < 0$ または $t > \boxed{\ \ }$ である。空欄に当てはまる数を求めよ。
(2) $x = \dfrac{1}{3}$ のとき、$(*)$ を満たす $y$ の範囲は $0 < y < p$ または $1 < y < q$ となる。$p,\ q$ の値を求めよ。
(3) $2 \le x \le 30,\ 2 \le y \le 30$ を満たす整数の組 $(x,\ y)$ のうち、$(*)$ を満たすものの個数を求めよ。
(4) $(*)$ と $x + y = 6$ をともに満たす正の数 $x,\ y$ を考える。$x$ のとりうる値の範囲は 3 つの区間を合わせたものになる。3 つの区間の長さの和を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`空欄に当てはまる数`, type: 'num', answer: 2 },
        { label: '(2)p', q: R`$p$ の値`, type: 'num', answer: 1 / 9, show: R`\frac{1}{9}` },
        { label: '(2)q', q: R`$q$ の値`, type: 'num', answer: 3 },
        { label: '(3)', q: R`組 $(x,\ y)$ の個数`, type: 'num', answer: 66 },
        { label: '(4)', q: R`3 つの区間の長さの和`, type: 'num', answer: 2 }
      ],
      solution: [
        {
          t: R`(1) $t$ の不等式に直す`,
          m: [R`\log_{y} x = \frac{\log_{x} x}{\log_{x} y} = \frac{1}{t}\quad (t \ne 0)`, R`t - \frac{2}{t} > 1 \;\Leftrightarrow\; t^{3} - t^{2} - 2t > 0 \;\Leftrightarrow\; t(t + 1)(t - 2) > 0`, R`-1 < t < 0\quad \text{または}\quad t > 2`],
          n: R`$y \ne 1$ なので $t \ne 0$ です。両辺に $t^{2}\ (> 0)$ を掛けて分母を払い、3 つの因数の符号を調べます。空欄は $2$ です。`,
          easy: R`**底の変換公式** $\log_{a} b = \dfrac{\log_{c} b}{\log_{c} a}$ で底を $x$ にそろえると、$\log_{y} x$ は $\log_{x} y$ の逆数になります。また、両辺に $t$ を掛けると $t$ の正負で不等号の向きが変わってしまうので、必ず正である $t^{2}$ を掛けます。`,
          pro: R`分数不等式は「分母の 2 乗を掛ける」と場合分けなしで処理できます。$t(t + 1)(t - 2) > 0$ は、数直線上に $-1,\ 0,\ 2$ をとり、右から符号を $+,\ -,\ +,\ -$ と交互に書けばすぐ読めます。`
        },
        {
          t: R`$x,\ y$ の条件に戻す（底 $x$ と 1 の大小で場合分け）`,
          m: [R`x > 1:\quad t > 2 \Leftrightarrow y > x^{2},\qquad -1 < t < 0 \Leftrightarrow \frac{1}{x} < y < 1`, R`0 < x < 1:\quad t > 2 \Leftrightarrow y < x^{2},\qquad -1 < t < 0 \Leftrightarrow 1 < y < \frac{1}{x}`],
          n: R`$t > 2$ は $\log_{x} y > \log_{x} x^{2}$、$-1 < t < 0$ は $\log_{x} x^{-1} < \log_{x} y < \log_{x} 1$ と書けます。底 $x$ が 1 より大きければ真数の大小はそのまま、1 より小さければ逆向きになります。$(*)$ の表す領域は図の塗った部分です（境界線と直線 $x = 1,\ y = 1$ は含みません）。`,
          easy: R`$\log_{x} Y$ を $Y$ の関数とみると、底 $x > 1$ なら増加関数、$0 < x < 1$ なら減少関数です。減少関数では「対数が大きい $\Leftrightarrow$ 真数が小さい」と大小が入れかわります。`,
          fig: FIG_EXPLOG
        },
        {
          t: R`(2) $x = \dfrac{1}{3}$ のとき`,
          m: R`0 < x < 1\ \text{なので}\quad 0 < y < x^{2} = \frac{1}{9}\quad \text{または}\quad 1 < y < \frac{1}{x} = 3`,
          n: R`$p = \dfrac{1}{9},\ q = 3$ です。`,
          lv: 2
        },
        {
          t: '(3) 整数の組を数える',
          m: [R`x \ge 2,\ y \ge 2\ \text{では}\ \frac{1}{x} < y < 1\ \text{は起こらない} \;\Rightarrow\; y > x^{2}`, R`x = 2:\ 5 \le y \le 30\ (26\ \text{個}),\qquad x = 3:\ 10 \le y \le 30\ (21\ \text{個})`, R`x = 4:\ 17 \le y \le 30\ (14\ \text{個}),\qquad x = 5:\ 26 \le y \le 30\ (5\ \text{個})`, R`26 + 21 + 14 + 5 = 66`],
          n: R`$x \ge 6$ では $x^{2} \ge 36 > 30$ なので該当しません。$y = x^{2}$ は $t = 2$ となり不等号を満たさないので含めません。`,
          pro: R`$x^{2} < y \le 30$ を満たす整数 $y$ は $30 - x^{2}$ 個、と式で数えると速く確実です。`
        },
        {
          t: R`(4) $x > 1$ の場合（$y = 6 - x$）`,
          m: [R`y > x^{2}:\quad 6 - x > x^{2} \Leftrightarrow (x + 3)(x - 2) < 0 \;\Rightarrow\; 1 < x < 2`, R`\frac{1}{x} < y < 1:\quad x > 5\ \text{かつ}\ x^{2} - 6x + 1 < 0 \;\Rightarrow\; 5 < x < 3 + 2\sqrt{2}`],
          n: R`$6 - x < 1$ から $x > 5$、$\dfrac{1}{x} < 6 - x$ の両辺に $x\ (> 0)$ を掛けて $x^{2} - 6x + 1 < 0$、つまり $3 - 2\sqrt{2} < x < 3 + 2\sqrt{2}$ です。$3 + 2\sqrt{2} \fallingdotseq 5.83$ なので、合わせて $5 < x < 3 + 2\sqrt{2}$ です。`,
          easy: R`図の領域に直線 $x + y = 6$ を重ねると、直線が塗った部分を通る 3 か所が答えの 3 つの区間です。式だけで迷ったら図で確かめましょう。`
        },
        {
          t: R`(4) $0 < x < 1$ の場合`,
          m: [R`y = 6 - x > 5\ \text{なので}\ y < x^{2}\ (< 1)\ \text{は起こらない}`, R`1 < 6 - x < \frac{1}{x} \;\Leftrightarrow\; x^{2} - 6x + 1 > 0 \;\Rightarrow\; 0 < x < 3 - 2\sqrt{2}`],
          n: R`$3 - 2\sqrt{2} \fallingdotseq 0.17$ は 1 より小さいので、この範囲がそのまま答えの一部になります。`
        },
        {
          t: '(4) 区間の長さの和',
          m: [R`0 < x < 3 - 2\sqrt{2},\qquad 1 < x < 2,\qquad 5 < x < 3 + 2\sqrt{2}`, R`(3 - 2\sqrt{2}) + (2 - 1) + (3 + 2\sqrt{2} - 5) = 2`],
          n: R`根号の部分が打ち消し合い、和は $2$ になります。`,
          pro: R`底 $x = 1$ と $y = 1$（$x = 5$）は除外点ですが、区間の端なので長さには影響しません。対数の底と真数の条件（正で 1 でない）を最初に書き出しておくのが安全です。`
        }
      ],
      prereq: ['m-expr', 'm-coord'],
      tags: ['底の変換', '対数不等式', '領域', '場合分け', '格子点']
    },

    /* ---------- 微分・積分（数II）: 接線の本数と 1/12 公式 ---------- */
    {
      id: 'm-adv-calc2-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-calc2',
      title: '3次曲線の接線の本数と面積',
      source: ORIG,
      time: 20,
      body: R`曲線 $C:\ y = x^{3} - 3x^{2}$ と点 $\mathrm{P}(2,\ k)$ を考える。ただし $k$ は実数の定数とする。次の問いに答えよ。

(1) $C$ 上の点 $(t,\ t^{3} - 3t^{2})$ における接線が P を通るとき、$k$ を $t$ の式で表せ。
(2) P から $C$ へ異なる 3 本の接線が引けるような $k$ の値の範囲を求めよ。
(3) $k = -4$ のとき、P を通る $C$ の接線は 2 本ある。そのうち接点が P と異なるものの方程式を求めよ。
(4) (3) で求めた接線と $C$ で囲まれた部分の面積を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$k = \boxed{\ \ }$（$t$ の式）`, type: 'expr', answer: '-2t^3+9t^2-12t', vars: ['t'], show: R`-2t^{3} + 9t^{2} - 12t`, hint: '例: t^3 - 2t^2 + 5t のように入力' },
        { label: '(2)下限', q: R`(2) の範囲は $a < k < b$ の形になる。$a$ の値`, type: 'num', answer: -5 },
        { label: '(2)上限', q: R`$b$ の値`, type: 'num', answer: -4 },
        { label: '(3)', q: R`接線 $y = \boxed{\ \ }$（$x$ の式）`, type: 'expr', answer: '-9/4*x+1/2', vars: ['x'], show: R`-\frac{9}{4}x + \frac{1}{2}`, hint: '例: -3/2x + 5 のように入力' },
        { label: '(4)', q: R`面積`, type: 'num', answer: 27 / 64, show: R`\frac{27}{64}` }
      ],
      solution: [
        {
          t: '接線の方程式',
          m: [R`y' = 3x^{2} - 6x`, R`y = (3t^{2} - 6t)(x - t) + t^{3} - 3t^{2} = (3t^{2} - 6t)x - 2t^{3} + 3t^{2}`],
          n: R`点 $(t,\ f(t))$ における接線は $y = f'(t)(x - t) + f(t)$ です。`,
          easy: R`接線の傾きは、その点での微分係数 $f'(t)$ です。「傾き $m$ で点 $(t,\ f(t))$ を通る直線」$y - f(t) = m(x - t)$ に $m = f'(t)$ を入れたものが接線です。`
        },
        {
          t: '(1) P を通る条件',
          m: R`k = 2(3t^{2} - 6t) - 2t^{3} + 3t^{2} = -2t^{3} + 9t^{2} - 12t`,
          n: R`接線の式に $x = 2,\ y = k$ を代入しました。`
        },
        {
          t: '接線の本数 = 接点の個数',
          n: R`P から引ける接線の本数は、(1) の方程式 $k = -2t^{3} + 9t^{2} - 12t$ を満たす実数 $t$（接点の $x$ 座標）の個数に等しくなります。3 次関数のグラフでは、接点が異なれば接線も異なるからです。`,
          easy: R`ここからは「$k$ を固定したとき、$t$ の方程式の実数解がいくつあるか」を調べる問題です。$g(t) = -2t^{3} + 9t^{2} - 12t$ とおき、曲線 $k = g(t)$ と水平な直線 $k = (\text{一定})$ の交点を数えると見やすくなります（**定数分離**）。`,
          pro: R`「接線の本数 = 接点の個数」が言えるのは 3 次関数だからです。4 次関数では 2 点で接する直線があり得るので、この言いかえはそのままでは使えません。`
        },
        {
          t: R`$g(t)$ の増減`,
          m: [R`g'(t) = -6t^{2} + 18t - 12 = -6(t - 1)(t - 2)`, R`\text{極小値}\ g(1) = -2 + 9 - 12 = -5,\qquad \text{極大値}\ g(2) = -16 + 36 - 24 = -4`],
          n: R`$t < 1$ で減少、$1 < t < 2$ で増加、$t > 2$ で減少します。`
        },
        {
          t: '(2) 3 本引ける条件',
          n: R`曲線 $k = g(t)$ と直線 $k = (\text{一定})$ が異なる 3 点で交わるのは、直線が極小値と極大値の間にあるときです（図の水平線）。よって $-5 < k < -4$ です。`,
          fig: FIG_CALC2,
          pro: R`$k = -5,\ -4$ では直線が極値の点で曲線に接し、交点は 2 個（接線は 2 本）です。端を含めないよう注意します。`
        },
        {
          t: R`(3) $k = -4$ のとき`,
          m: [R`2t^{3} - 9t^{2} + 12t - 4 = 0 \;\Leftrightarrow\; (t - 2)^{2}(2t - 1) = 0 \;\Rightarrow\; t = 2,\ \frac{1}{2}`, R`t = \frac{1}{2}:\quad y = \left(\frac{3}{4} - 3\right)x - \frac{1}{4} + \frac{3}{4} = -\frac{9}{4}x + \frac{1}{2}`],
          n: R`$k = -4$ のとき P$(2,\ -4)$ は $C$ 上の点なので、P 自身での接線（$t = 2$）が重解として現れます。接点が P と異なるのは $t = \dfrac{1}{2}$ の接線です。`,
          easy: R`$t = 2$ が解とわかっているので、組立除法で $(t - 2)$ をくくり出すと $(t - 2)(2t^{2} - 5t + 2) = (t - 2)^{2}(2t - 1)$ と因数分解できます。`
        },
        {
          t: '(4) 接線と曲線の上下',
          m: R`(x^{3} - 3x^{2}) - \left(-\frac{9}{4}x + \frac{1}{2}\right) = x^{3} - 3x^{2} + \frac{9}{4}x - \frac{1}{2} = \left(x - \frac{1}{2}\right)^{2}(x - 2)`,
          n: R`接点 $x = \dfrac{1}{2}$ が重解、もう 1 つの交点が $x = 2$（点 P）です。$\dfrac{1}{2} \le x \le 2$ では $x - 2 \le 0$ なので、$C$ は接線の下側にあります。`
        },
        {
          t: '(4) 面積',
          m: [R`S = \int_{1/2}^{2} \left\{-\left(x - \frac{1}{2}\right)^{2}(x - 2)\right\}dx = \frac{1}{12}\left(2 - \frac{1}{2}\right)^{4}`, R`= \frac{1}{12} \cdot \frac{81}{16} = \frac{27}{64}`],
          n: R`$\int_{\alpha}^{\beta} (x - \alpha)^{2}(\beta - x)\,dx = \dfrac{(\beta - \alpha)^{4}}{12}$ を使いました（次のステップで確かめます）。`,
          pro: R`3 次曲線と接線で囲まれた部分の面積は $\dfrac{|a|}{12}(\beta - \alpha)^{4}$（$a$ は $x^{3}$ の係数、$\alpha$ は接点、$\beta$ はもう 1 つの交点の $x$ 座標）で即答できます。`
        },
        {
          t: R`$\dfrac{1}{12}$ 公式の確かめ`,
          m: [R`u = x - \frac{1}{2}\ \text{とおくと}\quad \int_{0}^{3/2} u^{2}\left(\frac{3}{2} - u\right)du = \left[\frac{1}{2}u^{3} - \frac{1}{4}u^{4}\right]_{0}^{3/2}`, R`= \frac{1}{2} \cdot \frac{27}{8} - \frac{1}{4} \cdot \frac{81}{16} = \frac{108}{64} - \frac{81}{64} = \frac{27}{64}`],
          n: R`$x$ を $\dfrac{1}{2}$ だけずらして $u$ の多項式にすると、展開しても計算が軽く済みます。`,
          lv: 3
        }
      ],
      prereq: ['m-complex', 'm-quad'],
      tags: ['接線の本数', '定数分離', '3次関数', '面積', '1/12公式']
    },

    /* ---------- 数列: 分数の群数列 ---------- */
    {
      id: 'm-adv-seq-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-seq',
      title: '分数の群数列と既約分数',
      source: ORIG,
      time: 20,
      body: R`分母が $2,\ 3,\ 4,\ \cdots$ の分数を、分母ごとに分子を 1 から順に並べた数列
$$\frac{1}{2},\ \ \frac{1}{3},\ \frac{2}{3},\ \ \frac{1}{4},\ \frac{2}{4},\ \frac{3}{4},\ \ \frac{1}{5},\ \frac{2}{5},\ \frac{3}{5},\ \frac{4}{5},\ \ \frac{1}{6},\ \cdots$$
を考える（約分はしない）。分母が $k + 1$ である $k$ 個の項 $\dfrac{1}{k+1},\ \dfrac{2}{k+1},\ \cdots,\ \dfrac{k}{k+1}$ を第 $k$ 群とよぶ。次の問いに答えよ。

(1) 第 100 項の値を求めよ。
(2) 第 $k$ 群に含まれる項の和を $k$ の式で表せ。
(3) 初項から第 100 項までの和を求めよ。
(4) 値が $\dfrac{1}{2}$ に等しい項のうち、$n$ 番目に現れるものは第何項か。$n$ の式で表せ。
(5) 第 1 群から第 14 群までに含まれる項のうち、既約分数であるもの（分子と分母が互いに素であるもの）の個数を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`第 100 項の値`, type: 'num', answer: 3 / 5, show: R`\frac{3}{5}` },
        { label: '(2)', q: R`第 $k$ 群の和（$k$ の式）`, type: 'expr', answer: 'k/2', vars: ['k'], show: R`\frac{k}{2}` },
        { label: '(3)', q: R`初項から第 100 項までの和`, type: 'num', answer: 97 / 2, show: R`\frac{97}{2}` },
        { label: '(4)', q: R`第何項か（$n$ の式）`, type: 'expr', answer: '2n^2-2n+1', vars: ['n'], show: R`2n^{2} - 2n + 1`, hint: '例: n^2 + 3n - 1 のように入力' },
        { label: '(5)', q: R`既約分数である項の個数`, type: 'num', answer: 71 }
      ],
      solution: [
        {
          t: '群の構造をつかむ',
          m: [R`\text{第}\ k\ \text{群}:\ \frac{1}{k+1},\ \frac{2}{k+1},\ \cdots,\ \frac{k}{k+1}\quad (k\ \text{個})`, R`\text{第}\ k\ \text{群の末項までの項数} = 1 + 2 + \cdots + k = \frac{k(k+1)}{2}`],
          n: R`第 $k$ 群の $j$ 番目の項は $\dfrac{j}{k+1}$ で、数列全体では第 $\dfrac{(k-1)k}{2} + j$ 項です。「何群目の何番目か」で項を表すのが群数列の基本です。`,
          easy: R`**群数列**は、数列をいくつかのまとまり（群）に区切って考えるものです。「何番目の群の、何番目の項か」がわかれば値が決まります。この数列では、群の区切りが $1,\ 3,\ 6,\ 10,\ \cdots$ 項目（三角数）にあります。`
        },
        {
          t: '(1) 第 100 項は第何群か',
          m: [R`\frac{13 \cdot 14}{2} = 91 < 100 \le 105 = \frac{14 \cdot 15}{2}`, R`100 - 91 = 9\ \text{より、第}\ 14\ \text{群の}\ 9\ \text{番目}:\quad \frac{9}{15} = \frac{3}{5}`],
          n: R`第 13 群の末項が第 91 項、第 14 群の末項が第 105 項なので、第 100 項は第 14 群に入ります。`,
          pro: R`$\dfrac{(k-1)k}{2} < N \le \dfrac{k(k+1)}{2}$ を満たす $k$ は、$k \fallingdotseq \sqrt{2N}$ を目安に探すと速いです（$\sqrt{200} \fallingdotseq 14.1$）。`
        },
        {
          t: R`(2) 第 $k$ 群の和`,
          m: R`\frac{1 + 2 + \cdots + k}{k+1} = \frac{1}{k+1} \cdot \frac{k(k+1)}{2} = \frac{k}{2}`,
          n: R`分母が共通なので、分子の和を先に計算します。`,
          lv: 2
        },
        {
          t: '(3) 第 100 項までの和',
          m: [R`\sum_{k=1}^{13} \frac{k}{2} + \frac{1 + 2 + \cdots + 9}{15} = \frac{1}{2} \cdot \frac{13 \cdot 14}{2} + \frac{45}{15}`, R`= \frac{91}{2} + 3 = \frac{97}{2}`],
          n: R`第 13 群までは (2) の群ごとの和を足し、第 14 群は 9 番目までを足します。`
        },
        {
          t: R`(4) 値が $\dfrac{1}{2}$ になる項`,
          m: [R`\frac{j}{k+1} = \frac{1}{2} \;\Leftrightarrow\; k + 1 = 2j`, R`n\ \text{番目}:\ j = n,\ k = 2n - 1\quad (\text{第}\ 2n - 1\ \text{群の}\ n\ \text{番目})`, R`\frac{(2n-2)(2n-1)}{2} + n = (n - 1)(2n - 1) + n = 2n^{2} - 2n + 1`],
          n: R`$\dfrac{1}{2}$ に等しい項は分母が偶数の群に 1 個ずつあり、$\dfrac{1}{2},\ \dfrac{2}{4},\ \dfrac{3}{6},\ \cdots$ の順に現れます。$n$ 番目は分子が $n$ のものです。`,
          easy: R`例えば $n = 2$ なら $\dfrac{2}{4}$ で、第 3 群の 2 番目です。第 2 群までに $1 + 2 = 3$ 項あるので、$3 + 2 = 5$ 番目の項です。式に $n = 2$ を入れると $8 - 4 + 1 = 5$ となり一致します。`
        },
        {
          t: '(5) 既約分数を数える',
          m: [R`\text{分母}\ d\ (= k + 1)\ \text{ごとに、分子}\ j\ (1 \le j \le d - 1)\ \text{のうち}\ d\ \text{と互いに素なものを数える}`, R`\begin{aligned} &d = 2,\ 3,\ 4,\ 5,\ 6,\ 7,\ 8:\quad 1,\ 2,\ 2,\ 4,\ 2,\ 6,\ 4 \\ &d = 9,\ 10,\ 11,\ 12,\ 13,\ 14,\ 15:\quad 6,\ 4,\ 10,\ 4,\ 12,\ 6,\ 8 \end{aligned}`, R`(1 + 2 + 2 + 4 + 2 + 6 + 4) + (6 + 4 + 10 + 4 + 12 + 6 + 8) = 21 + 50 = 71`],
          n: R`第 1 群から第 14 群までの分母は $2$ から $15$ です。分母が素数 $p$ なら、分子 $1,\ 2,\ \cdots,\ p - 1$ はすべて既約です。`,
          easy: R`「互いに素」とは最大公約数が 1 であることです。例えば分母 $12$ では、分子 $1,\ 5,\ 7,\ 11$ の 4 個だけが既約で、$\dfrac{2}{12},\ \dfrac{3}{12}$ などは約分できてしまいます。`,
          pro: R`$1$ 以上 $d$ 以下で $d$ と互いに素な整数の個数（オイラー関数 $\varphi(d)$）は、$d$ の素因数が $p,\ q$ のとき $d\left(1 - \dfrac{1}{p}\right)\left(1 - \dfrac{1}{q}\right)$ です。例: $\varphi(15) = 15 \cdot \dfrac{2}{3} \cdot \dfrac{4}{5} = 8$。`
        },
        {
          t: R`合成数の分母の数え方（例: $d = 12$）`,
          m: R`11 - (5 + 3 - 1) = 4`,
          n: R`$1$ から $11$ のうち、2 の倍数は 5 個、3 の倍数は 3 個、6 の倍数は 1 個です。「2 または 3 の倍数」の $5 + 3 - 1 = 7$ 個を除くと、既約になる分子は 4 個です。`,
          lv: 3
        }
      ],
      prereq: ['m-int', 'm-expr'],
      tags: ['群数列', 'Σの計算', '既約分数', '一般項の番号']
    },

    /* ---------- 数列: 特性方程式が重解の 3 項間漸化式 ---------- */
    {
      id: 'm-adv-seq-02',
      subject: 'math',
      level: 'adv',
      unit: 'm-seq',
      title: '重解型3項間漸化式と和',
      source: ORIG,
      time: 20,
      body: R`数列 $\{a_{n}\}$ が
$$a_{1} = 2,\quad a_{2} = 9,\quad a_{n+2} = 6a_{n+1} - 9a_{n}\quad (n = 1,\ 2,\ 3,\ \cdots)$$
で定められている。$S_{n} = a_{1} + a_{2} + \cdots + a_{n}$ とする。次の問いに答えよ。

(1) $b_{n} = a_{n+1} - 3a_{n}$ とおくとき、$b_{n}$ を $n$ の式で表せ。
(2) $a_{n}$ を $n$ の式で表せ。
(3) $S_{n}$ を $n$ の式で表せ。
(4) $S_{n} > 1000$ となる最小の自然数 $n$ を求めよ。
(5) $a_{n}$ が $2^{10}$ の倍数となる最小の自然数 $n$ を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$b_{n} = \boxed{\ \ }$`, type: 'expr', answer: '3^n', vars: ['n'], show: R`3^{n}`, hint: '例: 2^(n+1) のように入力' },
        { label: '(2)', q: R`$a_{n} = \boxed{\ \ }$`, type: 'expr', answer: '(n+1)*3^(n-1)', vars: ['n'], show: R`(n+1) \cdot 3^{n-1}`, hint: '例: (n+2)*2^(n-1) のように入力' },
        { label: '(3)', q: R`$S_{n} = \boxed{\ \ }$`, type: 'expr', answer: '((2n+1)*3^n-1)/4', vars: ['n'], show: R`\frac{(2n+1) \cdot 3^{n} - 1}{4}`, hint: '例: ((n+1)*2^n - 1)/3 のように入力' },
        { label: '(4)', q: R`最小の $n$`, type: 'num', answer: 6 },
        { label: '(5)', q: R`最小の $n$`, type: 'num', answer: 1023 }
      ],
      solution: [
        {
          t: '特性方程式で変形の方針を立てる',
          m: [R`x^{2} = 6x - 9 \;\Leftrightarrow\; (x - 3)^{2} = 0 \;\Rightarrow\; x = 3\ \text{（重解）}`, R`a_{n+2} - 3a_{n+1} = 3(a_{n+1} - 3a_{n})`],
          n: R`漸化式の $a_{n+2},\ a_{n+1},\ a_{n}$ を $x^{2},\ x,\ 1$ に置きかえた 2 次方程式（特性方程式）の解は $3$ だけなので、上の形に変形できます（展開すると元の漸化式に戻ります）。`,
          easy: R`$a_{n+2} = pa_{n+1} + qa_{n}$ 型の漸化式は、$x^{2} = px + q$ の解 $\alpha,\ \beta$ を使うと $a_{n+2} - \alpha a_{n+1} = \beta(a_{n+1} - \alpha a_{n})$ と書き直せます。これは「$a_{n+1} - \alpha a_{n}$ という新しい数列が、公比 $\beta$ の等比数列になる」という意味です。`
        },
        {
          t: R`(1) $b_{n}$ は等比数列`,
          m: [R`b_{n+1} = 3b_{n},\qquad b_{1} = a_{2} - 3a_{1} = 9 - 6 = 3`, R`b_{n} = 3 \cdot 3^{n-1} = 3^{n}`]
        },
        {
          t: R`(2) $3^{n+1}$ で割って等差数列にする`,
          m: [R`a_{n+1} = 3a_{n} + 3^{n} \;\Rightarrow\; \frac{a_{n+1}}{3^{n+1}} = \frac{a_{n}}{3^{n}} + \frac{1}{3}`, R`c_{n} = \frac{a_{n}}{3^{n}}:\quad c_{1} = \frac{2}{3},\qquad c_{n} = \frac{2}{3} + \frac{n - 1}{3} = \frac{n + 1}{3}`, R`a_{n} = 3^{n} \cdot \frac{n + 1}{3} = (n + 1) \cdot 3^{n-1}`],
          n: R`$a_{3} = 4 \cdot 9 = 36$ は、漸化式から計算した $6 \cdot 9 - 9 \cdot 2 = 36$ と一致します。`,
          pro: R`特性方程式が重解 $\alpha$ のときは、$a_{n+1} - \alpha a_{n} = (\text{等比})$ を $\alpha^{n+1}$ で割って等差数列に帰着させるのが定石です。答えは $(\text{1 次式}) \times \alpha^{n}$ の形になります。`
        },
        {
          t: '(3) 等差×等比の和',
          m: [R`S_{n} = 2 + 3 \cdot 3 + 4 \cdot 3^{2} + \cdots + (n + 1) \cdot 3^{n-1}`, R`3S_{n} = 2 \cdot 3 + 3 \cdot 3^{2} + \cdots + n \cdot 3^{n-1} + (n + 1) \cdot 3^{n}`, R`S_{n} - 3S_{n} = 2 + (3 + 3^{2} + \cdots + 3^{n-1}) - (n + 1) \cdot 3^{n} = 2 + \frac{3^{n} - 3}{2} - (n + 1) \cdot 3^{n}`, R`-2S_{n} = \frac{1 - (2n + 1) \cdot 3^{n}}{2} \;\Rightarrow\; S_{n} = \frac{(2n + 1) \cdot 3^{n} - 1}{4}`],
          n: R`公比 $3$ を掛けて 1 項ずらして引くと、等比数列の和が現れます。`,
          easy: R`$(\text{等差数列}) \times (\text{等比数列})$ の和は、「公比を掛けて 1 つずらして引く」と等差の部分が消え、普通の等比数列の和になります。等比数列の和の公式を導くときと同じ考え方です。`
        },
        {
          t: '和の公式の検算',
          m: R`S_{1} = \frac{3 \cdot 3 - 1}{4} = 2 = a_{1},\qquad S_{2} = \frac{5 \cdot 9 - 1}{4} = 11 = a_{1} + a_{2}`,
          n: R`和の公式は $n = 1,\ 2$ を代入して確かめておくと安心です。`,
          lv: 2
        },
        {
          t: R`(4) $S_{n} > 1000$ となる最小の $n$`,
          m: R`S_{5} = \frac{11 \cdot 243 - 1}{4} = 668,\qquad S_{6} = \frac{13 \cdot 729 - 1}{4} = 2369`,
          n: R`$a_{n} > 0$ なので $S_{n}$ は増加します。$S_{5} \le 1000 < S_{6}$ より、最小の $n$ は $6$ です。`
        },
        {
          t: R`(5) $2^{10}$ の倍数`,
          m: [R`a_{n} = (n + 1) \cdot 3^{n-1},\qquad 3^{n-1}\ \text{は奇数}`, R`a_{n}\ \text{が}\ 2^{10}\ \text{の倍数} \;\Leftrightarrow\; n + 1\ \text{が}\ 2^{10} = 1024\ \text{の倍数}`, R`n + 1 = 1024 \;\Rightarrow\; n = 1023`],
          n: R`$3^{n-1}$ は素因数 2 を含まないので、$a_{n}$ の素因数 2 はすべて $n + 1$ から来ます。`,
          easy: R`3 の累乗 $3,\ 9,\ 27,\ \cdots$ はすべて奇数で、2 で 1 回も割れません。だから積 $(n + 1) \cdot 3^{n-1}$ が 2 で何回割れるかは、$n + 1$ が 2 で何回割れるかと同じです。`,
          pro: R`素因数分解の一意性から、2 と互いに素な因数 $3^{n-1}$ は「$2^{10}$ の倍数か」の判定に影響しません。$a_{n} = (\text{1 次式}) \times (\text{累乗})$ の形は、このような整数の問題と相性がよいです。`
        }
      ],
      prereq: ['m-expr', 'm-int'],
      tags: ['3項間漸化式', '特性方程式（重解）', '等差×等比の和', '整数']
    },

    /* ---------- ベクトル: 四面体の垂線の足 ---------- */
    {
      id: 'm-adv-vec-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-vec',
      title: '四面体の垂線の足と体積',
      source: ORIG,
      time: 22,
      body: R`四面体 OABC において、$\mathrm{OA} = 3,\ \mathrm{OB} = \mathrm{OC} = 2$、$\angle\mathrm{AOB} = \angle\mathrm{AOC} = 60\degree,\ \angle\mathrm{BOC} = 90\degree$ とする。$\vec{a} = \overrightarrow{\mathrm{OA}},\ \vec{b} = \overrightarrow{\mathrm{OB}},\ \vec{c} = \overrightarrow{\mathrm{OC}}$ とおく。次の問いに答えよ。

(1) 点 A から平面 OBC に下ろした垂線の足を H とし、$\overrightarrow{\mathrm{OH}} = s\vec{b} + t\vec{c}$ と表す。$s,\ t$ の値を求めよ。
(2) 線分 AH の長さを求めよ。
(3) 四面体 OABC の体積 $V$ を求めよ。
(4) 点 O から平面 ABC に下ろした垂線の足を K とし、$\overrightarrow{\mathrm{OK}} = x\vec{a} + y\vec{b} + z\vec{c}$ と表す。$x$ の値を求めよ。
(5) 線分 OK の長さを求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$s$ の値`, type: 'num', answer: 3 / 4, show: R`\frac{3}{4}` },
        { label: '(2)', q: R`AH の長さ`, type: 'num', answer: 3 * S2 / 2, show: R`\frac{3\sqrt{2}}{2}`, hint: '例: 2√3/3 のように入力' },
        { label: '(3)', q: R`体積 $V$`, type: 'num', answer: S2, show: R`\sqrt{2}` },
        { label: '(4)', q: R`$x$ の値`, type: 'num', answer: -1 / 5, show: R`-\frac{1}{5}` },
        { label: '(5)', q: R`OK の長さ`, type: 'num', answer: 3 * S5 / 5, show: R`\frac{3\sqrt{5}}{5}` }
      ],
      solution: [
        {
          t: '大きさと内積を準備する',
          m: [R`|\vec{a}| = 3,\qquad |\vec{b}| = |\vec{c}| = 2`, R`\vec{a} \cdot \vec{b} = \vec{a} \cdot \vec{c} = 3 \cdot 2\cos 60\degree = 3,\qquad \vec{b} \cdot \vec{c} = 0`],
          n: R`以後の計算は、すべてこの大きさと内積の値だけで進められます。`,
          easy: R`内積 $\vec{u} \cdot \vec{v} = |\vec{u}||\vec{v}|\cos\theta$ は、2 つのベクトルの向きのそろい具合を表す量です。特に $\vec{u} \cdot \vec{v} = 0$ は垂直を意味します。空間でも平面と同じ公式が使えます。`
        },
        {
          t: '(1) 垂線の足 H',
          m: [R`\overrightarrow{\mathrm{AH}} = s\vec{b} + t\vec{c} - \vec{a}`, R`\overrightarrow{\mathrm{AH}} \cdot \vec{b} = 4s + 0 - 3 = 0,\qquad \overrightarrow{\mathrm{AH}} \cdot \vec{c} = 0 + 4t - 3 = 0`, R`s = t = \frac{3}{4}`],
          n: R`AH が平面 OBC に垂直であることは、$\overrightarrow{\mathrm{AH}}$ が平面上の 2 つのベクトル $\vec{b},\ \vec{c}$ の両方と垂直であることと同じです。`,
          pro: R`「平面に垂直 $\Leftrightarrow$ 平面上の平行でない 2 ベクトルと垂直」で、未知数 2 個に条件 2 個。垂線の足を求める定番の処理です。`
        },
        {
          t: '(2) AH の長さ',
          m: [R`|\overrightarrow{\mathrm{OH}}|^{2} = \frac{9}{16}|\vec{b} + \vec{c}|^{2} = \frac{9}{16}(4 + 0 + 4) = \frac{9}{2}`, R`\mathrm{AH}^{2} = \mathrm{OA}^{2} - \mathrm{OH}^{2} = 9 - \frac{9}{2} = \frac{9}{2} \;\Rightarrow\; \mathrm{AH} = \frac{3\sqrt{2}}{2}`],
          n: R`$\triangle\mathrm{OAH}$ は $\angle\mathrm{OHA} = 90\degree$ の直角三角形なので、三平方の定理が使えます。`
        },
        {
          t: '(3) 体積',
          m: R`V = \frac{1}{3} \cdot \triangle\mathrm{OBC} \cdot \mathrm{AH} = \frac{1}{3} \cdot \left(\frac{1}{2} \cdot 2 \cdot 2\right) \cdot \frac{3\sqrt{2}}{2} = \sqrt{2}`,
          n: R`$\angle\mathrm{BOC} = 90\degree$ なので、底面 $\triangle\mathrm{OBC}$ の面積は $2$ です。`
        },
        {
          t: '(4) 平面 ABC への垂線の足 K の条件',
          m: [R`\overrightarrow{\mathrm{OK}} = x\vec{a} + y\vec{b} + z\vec{c}\qquad (x + y + z = 1)`, R`\overrightarrow{\mathrm{OK}} \cdot (\vec{b} - \vec{a}) = x(3 - 9) + y(4 - 3) + z(0 - 3) = -6x + y - 3z = 0`, R`\overrightarrow{\mathrm{OK}} \cdot (\vec{c} - \vec{a}) = x(3 - 9) + y(0 - 3) + z(4 - 3) = -6x - 3y + z = 0`],
          n: R`K が平面 ABC 上にある条件が「係数の和が 1」、OK が平面 ABC に垂直である条件が $\overrightarrow{\mathrm{AB}},\ \overrightarrow{\mathrm{AC}}$ との内積が 0 の 2 式です。`,
          easy: R`点 K が平面 ABC 上にあるとき、$\overrightarrow{\mathrm{AK}} = y\overrightarrow{\mathrm{AB}} + z\overrightarrow{\mathrm{AC}}$ と書けます。これを O 始点に直すと $\overrightarrow{\mathrm{OK}} = (1 - y - z)\vec{a} + y\vec{b} + z\vec{c}$ となり、係数の和が $1$ になります。`
        },
        {
          t: '(4) 連立方程式を解く',
          m: [R`(\text{2 式の差}):\ 4y - 4z = 0 \;\Rightarrow\; y = z,\qquad -6x - 2y = 0 \;\Rightarrow\; y = -3x`, R`x + 2y = 1 \;\Rightarrow\; x - 6x = 1 \;\Rightarrow\; x = -\frac{1}{5},\quad y = z = \frac{3}{5}`],
          n: R`$x = -\dfrac{1}{5} < 0$ なので、K は直線 BC に関して A と反対側、つまり $\triangle\mathrm{ABC}$ の外部にあります。`,
          pro: R`垂線の足が三角形の内部にあるとは限りません。係数の符号で位置関係を判定できるのがベクトル表示の利点です。`
        },
        {
          t: '(5) OK の長さ',
          m: [R`|\overrightarrow{\mathrm{OK}}|^{2} = \frac{1}{25}|-\vec{a} + 3\vec{b} + 3\vec{c}|^{2} = \frac{1}{25}(9 + 36 + 36 - 6 \cdot 3 - 6 \cdot 3 + 18 \cdot 0) = \frac{45}{25}`, R`|\overrightarrow{\mathrm{OK}}| = \frac{3}{\sqrt{5}} = \frac{3\sqrt{5}}{5}`],
          n: R`$|p\vec{a} + q\vec{b} + r\vec{c}|^{2}$ を展開し、準備した内積の値を代入しました。`
        },
        {
          t: '体積を使った検算',
          m: [R`\mathrm{AB}^{2} = |\vec{b} - \vec{a}|^{2} = 4 - 6 + 9 = 7,\quad \mathrm{AC}^{2} = 7,\quad \mathrm{BC}^{2} = 8`, R`\triangle\mathrm{ABC} = \frac{1}{2} \cdot 2\sqrt{2} \cdot \sqrt{7 - 2} = \sqrt{10},\qquad \frac{1}{3} \cdot \sqrt{10} \cdot \mathrm{OK} = \sqrt{2} \;\Rightarrow\; \mathrm{OK} = \frac{3\sqrt{2}}{\sqrt{10}} = \frac{3\sqrt{5}}{5}`],
          n: R`$\triangle\mathrm{ABC}$ は $\mathrm{AB} = \mathrm{AC}$ の二等辺三角形なので、BC の中点までの高さは $\sqrt{7 - 2} = \sqrt{5}$ です。体積を「底面 ABC × 高さ OK」と見直しても同じ値になります。`,
          lv: 2
        }
      ],
      prereq: ['m-trig1', 'm-coord'],
      tags: ['空間ベクトル', '垂線の足', '内積', '四面体の体積', '係数の和が1']
    },

    /* ---------- ベクトル: 平面への垂線と折れ線の最短 ---------- */
    {
      id: 'm-adv-vec-02',
      subject: 'math',
      level: 'adv',
      unit: 'm-vec',
      title: '平面への垂線と折れ線の最短',
      source: ORIG,
      time: 22,
      body: R`座標空間に 5 点 $\mathrm{A}(2,\ 3,\ 1),\ \mathrm{B}(1,\ -1,\ 0),\ \mathrm{C}(-2,\ -1,\ 3),\ \mathrm{D}(5,\ -1,\ 5),\ \mathrm{E}(1,\ -5,\ 5)$ がある。3 点 A, B, C を通る平面を $\alpha$ とする。次の問いに答えよ。

(1) $\triangle\mathrm{ABC}$ の面積を求めよ。
(2) 点 D から平面 $\alpha$ に下ろした垂線の足を H とする。線分 DH の長さを求めよ。
(3) $\overrightarrow{\mathrm{AH}} = s\overrightarrow{\mathrm{AB}} + t\overrightarrow{\mathrm{AC}}$ を満たす実数 $s,\ t$ を求めよ。
(4) 点 P が平面 $\alpha$ 上を動くとき、$\mathrm{DP} + \mathrm{PE}$ の最小値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\triangle\mathrm{ABC}$ の面積`, type: 'num', answer: 9 },
        { label: '(2)', q: R`DH の長さ`, type: 'num', answer: 6 },
        { label: '(3)s', q: R`$s$ の値`, type: 'num', answer: 1 / 3, show: R`\frac{1}{3}` },
        { label: '(3)t', q: R`$t$ の値`, type: 'num', answer: 1 / 6, show: R`\frac{1}{6}` },
        { label: '(4)', q: R`$\mathrm{DP} + \mathrm{PE}$ の最小値`, type: 'num', answer: 12 }
      ],
      solution: [
        {
          t: '空間ベクトルの成分計算（確認）',
          m: [R`\vec{u} = (u_{1},\ u_{2},\ u_{3}),\ \vec{v} = (v_{1},\ v_{2},\ v_{3})\ \text{のとき}`, R`\vec{u} \cdot \vec{v} = u_{1}v_{1} + u_{2}v_{2} + u_{3}v_{3},\qquad |\vec{u}| = \sqrt{u_{1}^{2} + u_{2}^{2} + u_{3}^{2}}`],
          n: R`平面ベクトルの成分計算に $z$ 成分が 1 つ加わるだけです。`,
          lv: 3
        },
        {
          t: '(1) 面積',
          m: [R`\overrightarrow{\mathrm{AB}} = (-1,\ -4,\ -1),\qquad \overrightarrow{\mathrm{AC}} = (-4,\ -4,\ 2)`, R`|\overrightarrow{\mathrm{AB}}|^{2} = 18,\quad |\overrightarrow{\mathrm{AC}}|^{2} = 36,\quad \overrightarrow{\mathrm{AB}} \cdot \overrightarrow{\mathrm{AC}} = 4 + 16 - 2 = 18`, R`\triangle\mathrm{ABC} = \frac{1}{2}\sqrt{|\overrightarrow{\mathrm{AB}}|^{2}|\overrightarrow{\mathrm{AC}}|^{2} - (\overrightarrow{\mathrm{AB}} \cdot \overrightarrow{\mathrm{AC}})^{2}} = \frac{1}{2}\sqrt{648 - 324} = 9`],
          easy: R`三角形の面積 $\dfrac{1}{2}|\vec{u}||\vec{v}|\sin\theta$ の $\sin\theta$ を、内積から求めた $\cos\theta$ を使って $\sqrt{1 - \cos^{2}\theta}$ と書き直すと、この公式になります。`
        },
        {
          t: R`平面 $\alpha$ に垂直なベクトル`,
          m: [R`\vec{n} = (p,\ q,\ r):\quad \vec{n} \cdot \overrightarrow{\mathrm{AB}} = -p - 4q - r = 0,\qquad \vec{n} \cdot \overrightarrow{\mathrm{AC}} = -4p - 4q + 2r = 0`, R`p = -2q,\quad r = -2q \;\Rightarrow\; \vec{n} = (2,\ -1,\ 2)\quad (q = -1\ \text{ととった})`],
          n: R`平面上の平行でない 2 つのベクトルの両方に垂直なベクトルは、平面に垂直です（法線ベクトル）。$|\vec{n}| = 3$ です。`,
          easy: R`机の面に垂直に立てた鉛筆は、机の上に引いたどの線とも垂直です。逆に、机の上の向きの違う 2 本の線の両方と垂直なら、机の面に垂直だといえます。`
        },
        {
          t: '(2) 垂線の足 H と DH',
          m: [R`\mathrm{H} = \mathrm{D} + k\vec{n} = (5 + 2k,\ -1 - k,\ 5 + 2k),\qquad \overrightarrow{\mathrm{AH}} = (3 + 2k,\ -4 - k,\ 4 + 2k)`, R`\overrightarrow{\mathrm{AH}} \cdot \vec{n} = 2(3 + 2k) - (-4 - k) + 2(4 + 2k) = 18 + 9k = 0 \;\Rightarrow\; k = -2`, R`\mathrm{H}(1,\ 1,\ 1),\qquad \mathrm{DH} = |k||\vec{n}| = 2 \cdot 3 = 6`],
          n: R`DH は $\vec{n}$ と平行なので $\mathrm{H} = \mathrm{D} + k\vec{n}$ とおけます。H が平面 $\alpha$ 上にある条件は「$\overrightarrow{\mathrm{AH}}$ が $\vec{n}$ と垂直」です。`
        },
        {
          t: R`(3) $s,\ t$ を求める`,
          m: [R`\overrightarrow{\mathrm{AH}} = (-1,\ -2,\ 0) = s(-1,\ -4,\ -1) + t(-4,\ -4,\ 2)`, R`x\ \text{成分}:\ -s - 4t = -1,\qquad z\ \text{成分}:\ -s + 2t = 0 \;\Rightarrow\; s = \frac{1}{3},\ t = \frac{1}{6}`],
          n: R`$y$ 成分も $-\dfrac{4}{3} - \dfrac{4}{6} = -2$ で一致します。$s > 0,\ t > 0,\ s + t < 1$ なので、H は $\triangle\mathrm{ABC}$ の内部にあります。`
        },
        {
          t: R`D と E は $\alpha$ の同じ側か`,
          m: R`\vec{n} \cdot \overrightarrow{\mathrm{AD}} = 2 \cdot 3 - (-4) + 2 \cdot 4 = 18 > 0,\qquad \vec{n} \cdot \overrightarrow{\mathrm{AE}} = 2 \cdot (-1) - (-8) + 2 \cdot 4 = 14 > 0`,
          n: R`符号が同じなので、D と E は平面 $\alpha$ に対して同じ側にあります。このままでは線分 DE が $\alpha$ と交わらないので、D を $\alpha$ に関して対称移動します。`,
          easy: R`川の同じ側にある 2 地点を、途中で一度川に立ち寄って結ぶ最短経路の問題と同じです。片方の点を川（平面）の反対側へ折り返すと、折れ線が 1 本の線分に変わります。`
        },
        {
          t: '(4) 対称点で折れ線をまっすぐにする',
          m: [R`\mathrm{D}' = \mathrm{D} + 2k\vec{n} = (5,\ -1,\ 5) - 4(2,\ -1,\ 2) = (-3,\ 3,\ -3)`, R`\mathrm{DP} + \mathrm{PE} = \mathrm{D'P} + \mathrm{PE} \ge \mathrm{D'E} = \sqrt{4^{2} + (-8)^{2} + 8^{2}} = 12`],
          n: R`平面 $\alpha$ 上の点 P については $\mathrm{DP} = \mathrm{D'P}$ です。D' と E は $\alpha$ の反対側にあるので線分 D'E は $\alpha$ と交わり、その交点を P にとると等号が成り立ちます。最小値は $12$ です。`,
          pro: R`等号が成り立つ P は、D'E 上の点 $(-3 + 4u,\ 3 - 8u,\ -3 + 8u)$ のうち $\overrightarrow{\mathrm{AP}} \cdot \vec{n} = 0$ となるもので、$u = \dfrac{9}{16}$、$\mathrm{P}\left(-\dfrac{3}{4},\ -\dfrac{3}{2},\ \dfrac{3}{2}\right)$ です。「同じ側なら折り返す、反対側ならそのまま結ぶ」が定石です。`
        }
      ],
      prereq: ['m-trig1', 'm-coord'],
      tags: ['空間座標', '法線ベクトル', '垂線の足', '最短経路', '対称点']
    },

    /* ---------- 極限: 漸化式で定まる数列の極限と収束の速さ ---------- */
    {
      id: 'm-adv-limit-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-limit',
      title: '漸化式で定まる数列の極限',
      source: ORIG,
      time: 22,
      body: R`数列 $\{a_{n}\}$ を
$$a_{1} = 1,\qquad a_{n+1} = \sqrt{2a_{n} + 8}\quad (n = 1,\ 2,\ 3,\ \cdots)$$
で定める。すべての自然数 $n$ について $1 \le a_{n} < 4$ が成り立つ（数学的帰納法で示せる。これを用いてよい）。次の問いに答えよ。

(1) すべての $n$ について $4 - a_{n+1} = \dfrac{k}{4 + a_{n+1}}(4 - a_{n})$ が成り立つような定数 $k$ を求めよ。
(2) $\lim_{n \to \infty} a_{n}$ を求めよ。
(3) $\lim_{n \to \infty} \dfrac{4 - a_{n+1}}{4 - a_{n}}$ を求めよ。
(4) $\lim_{n \to \infty} \dfrac{a_{n+1}^{2} - a_{n}^{2}}{4 - a_{n}}$ を求めよ。
(5) 選択肢 ①〜⑤ のうち、正しいものをすべて選べ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$k$ の値`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$\lim_{n \to \infty} a_{n}$`, type: 'num', answer: 4 },
        { label: '(3)', q: R`比の極限`, type: 'num', answer: 1 / 4, show: R`\frac{1}{4}` },
        { label: '(4)', q: R`極限値`, type: 'num', answer: 6 },
        {
          label: '(5)', q: R`正しいものをすべて選べ`, type: 'multi',
          choices: [
            R`① 数列 $\{a_{n}\}$ は増加数列である`,
            R`② すべての $n$ について $4 - a_{n} \le 3\left(\dfrac{1}{2}\right)^{n-1}$ が成り立つ`,
            R`③ 無限級数 $\sum_{n=1}^{\infty} (4 - a_{n})$ は発散する`,
            R`④ $\lim_{n \to \infty} 2^{n}(4 - a_{n}) = 0$ である`,
            R`⑤ $\lim_{n \to \infty} 4^{n}(4 - a_{n}) = 0$ である`
          ],
          answer: [0, 1, 3],
          explain: R`① は (4) の因数分解、② と ④ は (2) の評価 $4 - a_{n} \le 3\left(\dfrac{2}{5}\right)^{n-1}$ から正しいとわかります。③ は収束する等比級数で上から押さえられるので誤り、⑤ は $4^{n}(4 - a_{n})$ が常に $12$ より大きいので誤りです。`
        }
      ],
      solution: [
        {
          t: '(1) 2 乗の差を作る',
          m: [R`a_{n+1}^{2} = 2a_{n} + 8 \;\Rightarrow\; 16 - a_{n+1}^{2} = 8 - 2a_{n} = 2(4 - a_{n})`, R`(4 - a_{n+1})(4 + a_{n+1}) = 2(4 - a_{n}) \;\Rightarrow\; 4 - a_{n+1} = \frac{2}{4 + a_{n+1}}(4 - a_{n})`],
          n: R`$k = 2$ です。極限の候補 $4$ との差 $4 - a_{n}$ の関係式を作るのが方針です。`,
          easy: R`$a_{n}$ が近づく先の候補は、$a_{n},\ a_{n+1}$ をともに $\alpha$ とおいた $\alpha = \sqrt{2\alpha + 8}$ の解、つまり $\alpha^{2} - 2\alpha - 8 = (\alpha - 4)(\alpha + 2) = 0$ の正の解 $\alpha = 4$ です。ただしこれは「近づくとしたら 4」という候補にすぎないので、本当に近づくことを差 $4 - a_{n}$ で確かめます。`,
          pro: R`根号を含む漸化式は、極限の候補 $\alpha$ との差を $(\alpha - a_{n+1})(\alpha + a_{n+1}) = \alpha^{2} - a_{n+1}^{2}$ の形にして評価するのが定石です。`
        },
        {
          t: '(2) 差を評価してはさみうち',
          m: [R`a_{n+1} \ge 1\ \text{より}\quad 0 < 4 - a_{n+1} = \frac{2}{4 + a_{n+1}}(4 - a_{n}) \le \frac{2}{5}(4 - a_{n})`, R`0 < 4 - a_{n} \le \left(\frac{2}{5}\right)^{n-1}(4 - a_{1}) = 3\left(\frac{2}{5}\right)^{n-1} \to 0\quad (n \to \infty)`, R`\lim_{n \to \infty} a_{n} = 4`],
          n: R`はさみうちの原理により $4 - a_{n} \to 0$、つまり $a_{n} \to 4$ です。`,
          easy: R`**はさみうちの原理**: $0 < b_{n} \le c_{n}$ で $c_{n} \to 0$ なら、間にはさまれた $b_{n}$ も $0$ に近づきます。$\left(\dfrac{2}{5}\right)^{n-1}$ は公比が 1 より小さい等比数列なので $0$ に近づきます。`
        },
        {
          t: '(3) 比の極限',
          m: R`\frac{4 - a_{n+1}}{4 - a_{n}} = \frac{2}{4 + a_{n+1}} \to \frac{2}{4 + 4} = \frac{1}{4}`,
          n: R`(1) の式を割り算の形にし、(2) の結果 $a_{n+1} \to 4$ を使います。`
        },
        {
          t: '(4) 因数分解して約分する',
          m: [R`a_{n+1}^{2} - a_{n}^{2} = 2a_{n} + 8 - a_{n}^{2} = (4 - a_{n})(a_{n} + 2)`, R`\frac{a_{n+1}^{2} - a_{n}^{2}}{4 - a_{n}} = a_{n} + 2 \to 6`],
          n: R`$4 - a_{n} \ne 0$ なので約分できます。`
        },
        {
          t: '(5) ① と ②',
          m: [R`a_{n+1}^{2} - a_{n}^{2} = (4 - a_{n})(a_{n} + 2) > 0 \;\Rightarrow\; a_{n+1} > a_{n}\quad (\text{①は正しい})`, R`4 - a_{n} \le 3\left(\frac{2}{5}\right)^{n-1} \le 3\left(\frac{1}{2}\right)^{n-1}\quad (\text{②は正しい})`],
          n: R`① は (4) の因数分解から（$a_{n} > 0$ なので 2 乗の大小と元の大小は一致）、② は (2) の評価と $\dfrac{2}{5} < \dfrac{1}{2}$ からわかります。`
        },
        {
          t: '(5) ③ と ④',
          m: [R`\sum_{n=1}^{N} (4 - a_{n}) \le \sum_{n=1}^{N} 3\left(\frac{2}{5}\right)^{n-1} < \frac{3}{1 - \frac{2}{5}} = 5\quad (\text{収束するので③は誤り})`, R`0 < 2^{n}(4 - a_{n}) \le 2^{n} \cdot 3\left(\frac{2}{5}\right)^{n-1} = 6\left(\frac{4}{5}\right)^{n-1} \to 0\quad (\text{④は正しい})`],
          n: R`正の項の和（部分和）は増加し、しかも $5$ を超えないので、無限級数は収束します。`,
          pro: R`正の項の級数は「収束する等比級数で上から押さえる」と収束が示せます（部分和が上に有界な増加数列になるため）。`
        },
        {
          t: '(5) ⑤ は誤り',
          m: [R`a_{n+1} < 4\ \text{より}\quad 4 - a_{n+1} = \frac{2}{4 + a_{n+1}}(4 - a_{n}) > \frac{1}{4}(4 - a_{n})`, R`4^{n+1}(4 - a_{n+1}) > 4^{n}(4 - a_{n}) > \cdots > 4^{1}(4 - a_{1}) = 12`],
          n: R`$4^{n}(4 - a_{n})$ は常に $12$ より大きいので、$0$ には近づきません。正しいものは ①・②・④ です。`,
          easy: R`(3) の通り、$4 - a_{n}$ は 1 回ごとにほぼ $\dfrac{1}{4}$ 倍ずつ小さくなりますが、その倍率はいつも $\dfrac{1}{4}$ より少しだけ大きいです。だから $2^{n}$ を掛けても $0$ に近づきますが、$4^{n}$ を掛けると $0$ には近づきません。`,
          pro: R`収束の速さを問う設問です。比の極限 $\dfrac{1}{4}$ より大きい公比 $r$ に対しては $\dfrac{4 - a_{n}}{r^{n}} \to 0$、小さい公比では発散し、境目の $r = \dfrac{1}{4}$ はより細かい評価が必要、と整理できます。`
        }
      ],
      prereq: ['m-seq', 'm-explog'],
      tags: ['漸化式と極限', 'はさみうちの原理', '収束の速さ', '無限級数']
    },

    /* ---------- 微分法（数III）: 指数関数の極値と定数分離 ---------- */
    {
      id: 'm-adv-diff3-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-diff3',
      title: '指数関数の極値と定数分離',
      source: ORIG,
      time: 22,
      body: R`$a$ を実数の定数とし、$f(x) = e^{x} - ax^{2}$ とする。ただし $e$ は自然対数の底である。次の問いに答えよ。

(1) $x > 0$ における関数 $g(x) = \dfrac{e^{x}}{x}$ の最小値を求めよ。
(2) $f(x)$ が極値を 2 つもつような $a$ の値の範囲は $a > p$ の形になる。$p$ の値を求めよ。
(3) $f(x)$ が極値をちょうど 1 つもつような $a$ の値の範囲は $a < r$ の形になる。$r$ の値を求めよ。
(4) $x > 0$ を満たすすべての $x$ について $f(x) > 0$ となるような $a$ の値の範囲は $a < q$ の形になる。$q$ の値を求めよ。
(5) $a = 2$ のとき、方程式 $f(x) = 0$ の異なる実数解の個数を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$g(x)$ の最小値`, type: 'num', answer: E, show: R`e`, hint: '自然対数の底を含む値は 2e+1 や e^(3/2) のように入力' },
        { label: '(2)', q: R`$p$ の値`, type: 'num', answer: E / 2, show: R`\frac{e}{2}` },
        { label: '(3)', q: R`$r$ の値`, type: 'num', answer: 0 },
        { label: '(4)', q: R`$q$ の値`, type: 'num', answer: E * E / 4, show: R`\frac{e^{2}}{4}` },
        { label: '(5)', q: R`異なる実数解の個数`, type: 'num', answer: 3 }
      ],
      solution: [
        {
          t: R`(1) $g(x)$ の増減`,
          m: [R`g'(x) = \frac{e^{x} \cdot x - e^{x} \cdot 1}{x^{2}} = \frac{e^{x}(x - 1)}{x^{2}}`, R`0 < x < 1\ \text{で減少},\quad x > 1\ \text{で増加} \;\Rightarrow\; \text{最小値}\ g(1) = e`],
          easy: R`商の微分 $\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^{2}}$ を使います。$e^{x}$ は微分しても $e^{x}$ のままです。$e^{x} > 0,\ x^{2} > 0$ なので、$g'(x)$ の符号は $x - 1$ の符号だけで決まります。`
        },
        {
          t: '指数関数の増え方（確認）',
          m: R`\lim_{x \to \infty} \frac{e^{x}}{x} = \infty,\qquad \lim_{x \to \infty} \frac{e^{x}}{x^{2}} = \infty`,
          n: R`例えば $x = 10$ でも $e^{10} \fallingdotseq 22026$ に対して $x^{2} = 100$ です。指数関数はどんな多項式よりも速く大きくなります。以下のグラフの概形はこの事実を使って描きます。`,
          lv: 3
        },
        {
          t: R`極値の個数は $f'(x)$ の符号変化の回数`,
          m: [R`f'(x) = e^{x} - 2ax`, R`f'(x) = 0 \;\Leftrightarrow\; \frac{e^{x}}{x} = 2a\quad (x \ne 0)`],
          n: R`$x = 0$ では $f'(0) = 1 \ne 0$ なので、両辺を $x$ で割って**定数分離**できます。曲線 $y = \dfrac{e^{x}}{x}$ と直線 $y = 2a$ が交わり、そこで $f'(x)$ の符号が変わる点が極値をとる点です。`,
          pro: R`極値の個数は「$f'(x) = 0$ の解の個数」ではなく「$f'(x)$ の符号が変わる点の個数」です。グラフが接する（重解）だけの点では極値になりません。`
        },
        {
          t: '(2) 極値を 2 つもつ条件',
          m: [R`x < 0:\ \frac{e^{x}}{x} < 0,\qquad x > 0:\ \frac{e^{x}}{x} \ge e\ \ (\text{(1) より})`, R`2a > e \;\Rightarrow\; y = 2a\ \text{は}\ y = \frac{e^{x}}{x}\ (x > 0)\ \text{と 2 点で交わる}`],
          n: R`$x \to +0$ と $x \to \infty$ でともに $\dfrac{e^{x}}{x} \to \infty$ なので、$2a > e$ なら交点が 2 つでき、どちらでも $f'(x)$ の符号が変わります。$2a = e$ では $x = 1$ で接するだけで符号は変わりません。よって $a > \dfrac{e}{2}$、$p = \dfrac{e}{2}$ です。`,
          fig: FIG_DIFF3
        },
        {
          t: '(3) 極値がちょうど 1 つ',
          m: [R`a < 0:\quad f''(x) = e^{x} - 2a > 0`, R`f'(x)\ \text{は増加し},\quad x \to -\infty\ \text{で}\ -\infty,\quad x \to \infty\ \text{で}\ \infty`],
          n: R`$a < 0$ のとき $f'(x) = 0$ の解はただ 1 つで、そこで符号が負から正に変わるので極値（極小値）は 1 つです。$a = 0$ では $f'(x) = e^{x} > 0$、$0 < a \le \dfrac{e}{2}$ では図のように符号変化がなく、どちらも極値はありません。よって $a < 0$、$r = 0$ です。`,
          easy: R`図の $x < 0$ の部分では、曲線 $y = \dfrac{e^{x}}{x}$ は $0$ より下にあり、$0$ から $-\infty$ まで下がっていきます。だから水平線 $y = 2a$ がこの部分と交わるのは $2a < 0$ のときで、交点はちょうど 1 つです。`
        },
        {
          t: R`(4) $x > 0$ で常に $f(x) > 0$`,
          m: [R`f(x) > 0 \;\Leftrightarrow\; a < \frac{e^{x}}{x^{2}} = h(x)\quad (x > 0)`, R`h'(x) = \frac{e^{x} \cdot x^{2} - e^{x} \cdot 2x}{x^{4}} = \frac{e^{x}(x - 2)}{x^{3}}`, R`x > 0\ \text{での最小値}\ h(2) = \frac{e^{2}}{4} \;\Rightarrow\; a < \frac{e^{2}}{4}`],
          n: R`すべての $x > 0$ で $a < h(x)$ となるのは、$a$ が $h(x)$ の最小値より小さいときです。$q = \dfrac{e^{2}}{4}$ です。`,
          pro: R`「すべての $x$ で成り立つ」は、定数を分離して「(定数) < (関数の最小値)」に言いかえるのが最短です。`
        },
        {
          t: R`(5) $a = 2$ のときの実数解の個数`,
          m: [R`f(x) = 0 \;\Leftrightarrow\; h(x) = \frac{e^{x}}{x^{2}} = 2\quad (x \ne 0)`, R`x < 0:\ h'(x) > 0,\ \ h(x)\ \text{は}\ 0\ \text{から}\ \infty\ \text{まで増加} \;\Rightarrow\; 1\ \text{個}`, R`x > 0:\ h(x)\ \text{の最小値}\ \frac{e^{2}}{4} \fallingdotseq 1.85 < 2 \;\Rightarrow\; 2\ \text{個}`],
          n: R`$x < 0$ では $x - 2 < 0,\ x^{3} < 0$ なので $h'(x) > 0$ で、$x \to -\infty$ で $h(x) \to 0$、$x \to -0$ で $h(x) \to \infty$ です。合わせて実数解は $3$ 個です。`,
          easy: R`$f(0) = 1 \ne 0$ なので $x = 0$ は解ではなく、両辺を $x^{2}$ で割っても解を失いません。$e^{2} \fallingdotseq 7.39$ なので $\dfrac{e^{2}}{4} \fallingdotseq 1.85$ です。`
        }
      ],
      prereq: ['m-calc2', 'm-explog'],
      tags: ['極値の個数', '定数分離', '商の微分', '不等式の成立条件', '実数解の個数']
    },

    /* ---------- 積分法（数III）: 絶対値つき定積分の最小と区分求積 ---------- */
    {
      id: 'm-adv-integ3-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-integ3',
      title: '絶対値つき定積分の最小と区分求積',
      source: ORIG,
      time: 22,
      body: R`$a$ を正の定数とし、
$$F(a) = \int_{0}^{1} \left|e^{x} - a\right|dx$$
とする。ただし $e$ は自然対数の底、$\log$ は自然対数である。次の問いに答えよ。

(1) $0 < a \le 1$ のとき、$F(a)$ を $a$ の式で表せ。
(2) $1 \le a \le e$ のとき、$F(a)$ を $a$ の式で表せ。
(3) $F(a)$ を最小にする $a$ の値を求めよ。
(4) $F(a)$ の最小値を求めよ。
(5) 極限 $\lim_{n \to \infty} \dfrac{1}{n}\sum_{k=1}^{n} \left|e^{\frac{k}{n}} - 2\right|$ を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$F(a) = \boxed{\ \ }$（$0 < a \le 1$）`, type: 'expr', answer: 'e-1-a', vars: ['a'], show: R`e - 1 - a`, hint: 'e は自然対数の底。例: 2e - a + 1 のように入力' },
        { label: '(2)', q: R`$F(a) = \boxed{\ \ }$（$1 \le a \le e$）`, type: 'expr', answer: '2a*log(a)-3a+e+1', vars: ['a'], show: R`2a\log a - 3a + e + 1`, hint: '自然対数は log(a) と入力。例: a*log(a) - 2a + e' },
        { label: '(3)', q: R`最小にする $a$ の値`, type: 'num', answer: Math.sqrt(E), show: R`\sqrt{e}`, hint: '自然対数の底を含む値は 2e+1 や e^(3/2) のように入力' },
        { label: '(4)', q: R`最小値`, type: 'num', answer: (Math.sqrt(E) - 1) * (Math.sqrt(E) - 1), show: R`\left(\sqrt{e} - 1\right)^{2}` },
        { label: '(5)', q: R`極限値`, type: 'num', answer: 4 * Math.log(2) + E - 5, show: R`4\log 2 + e - 5`, hint: '例: 3log(2) - e + 1 のように入力' }
      ],
      solution: [
        {
          t: '絶対値の中身の符号を調べる',
          n: R`$0 \le x \le 1$ で $e^{x}$ は $1$ から $e$ まで増加します。$a \le 1$ なら $e^{x} - a \ge 0$、$a \ge e$ なら $e^{x} - a \le 0$ で、絶対値はそのまま外れます。$1 < a < e$ なら $x = \log a$ を境に符号が変わります。`,
          easy: R`絶対値の積分は「中身が正の部分」と「負の部分」に分けて計算します。グラフでいうと、曲線 $y = e^{x}$ と水平線 $y = a$ にはさまれた部分（図の塗った部分）の面積が $F(a)$ です。`,
          fig: FIG_INTEG3A
        },
        {
          t: R`(1) $0 < a \le 1$ のとき`,
          m: R`F(a) = \int_{0}^{1} (e^{x} - a)\,dx = \left[e^{x} - ax\right]_{0}^{1} = (e - a) - 1 = e - 1 - a`,
          n: R`同様に、$a \ge e$ のときは $F(a) = \int_{0}^{1} (a - e^{x})\,dx = a - e + 1$ です。`,
          lv: 2
        },
        {
          t: R`(2) $1 \le a \le e$ のとき`,
          m: [R`c = \log a\ (0 \le c \le 1)\ \text{とおくと}\quad F(a) = \int_{0}^{c} (a - e^{x})\,dx + \int_{c}^{1} (e^{x} - a)\,dx`, R`= (ac - e^{c} + 1) + (e - a - e^{c} + ac) = 2ac - 2e^{c} - a + e + 1`, R`e^{c} = a\ \text{より}\quad F(a) = 2a\log a - 3a + e + 1`],
          n: R`$a = 1$ では $e - 2$、$a = e$ では $1$ となり、(1) の式や $a \ge e$ の式とつながります。`,
          pro: R`境目 $x = \log a$ をいったん文字 $c$ で置いて計算し、最後に $e^{c} = a$ で戻すと見通しがよくなります。`
        },
        {
          t: '(3) 増減を調べる',
          m: [R`1 < a < e:\quad F'(a) = 2\log a + 2a \cdot \frac{1}{a} - 3 = 2\log a - 1`, R`F'(a) = 0 \;\Leftrightarrow\; \log a = \frac{1}{2} \;\Leftrightarrow\; a = \sqrt{e}`],
          n: R`$1 < a < \sqrt{e}$ で $F'(a) < 0$、$\sqrt{e} < a < e$ で $F'(a) > 0$ です。さらに $0 < a \le 1$ では $F(a) = e - 1 - a$ が減少、$a \ge e$ では $F(a) = a - e + 1$ が増加なので、$F(a)$ は $a = \sqrt{e}$ で最小になります。`,
          easy: R`積の微分 $(a\log a)' = 1 \cdot \log a + a \cdot \dfrac{1}{a} = \log a + 1$ を使っています。`,
          pro: R`$\int_{0}^{1}|f(x) - a|\,dx$ を最小にする $a$ は、$f(x) \le a$ となる $x$ の範囲がちょうど区間の半分になる値（中央値）です。ここでは $\log a = \dfrac{1}{2}$ がその条件です。`
        },
        {
          t: '(4) 最小値',
          m: R`F(\sqrt{e}) = 2\sqrt{e} \cdot \frac{1}{2} - 3\sqrt{e} + e + 1 = e - 2\sqrt{e} + 1 = \left(\sqrt{e} - 1\right)^{2}`,
          n: R`$\log\sqrt{e} = \dfrac{1}{2}$ を使いました。`
        },
        {
          t: '(5) 区分求積法',
          m: [R`\lim_{n \to \infty} \frac{1}{n}\sum_{k=1}^{n} \left|e^{\frac{k}{n}} - 2\right| = \int_{0}^{1} \left|e^{x} - 2\right|dx = F(2)`, R`F(2) = 4\log 2 - 6 + e + 1 = 4\log 2 + e - 5`],
          n: R`$1 \le 2 \le e$ なので (2) の式が使えます（$2a\log a = 4\log 2$）。`,
          easy: R`**区分求積法**: 区間 $[0,\ 1]$ を $n$ 等分し、幅 $\dfrac{1}{n}$、高さ $f\left(\dfrac{k}{n}\right)$ の長方形の面積を足し合わせると、$n \to \infty$ で $\int_{0}^{1} f(x)\,dx$ に近づきます。`,
          pro: R`$\dfrac{k}{n}$ を $x$、$\dfrac{1}{n}$ を $dx$ に置きかえ、和の $k = 1$ から $n$ を積分区間 $0$ から $1$ に対応させるのが区分求積の型です。`
        }
      ],
      prereq: ['m-diff3', 'm-explog'],
      tags: ['絶対値つき定積分', 'パラメータを含む積分', '最小値', '区分求積法']
    },

    /* ---------- 積分法（数III）: 斜めの軸のまわりの回転体 ---------- */
    {
      id: 'm-adv-integ3-02',
      subject: 'math',
      level: 'adv',
      unit: 'm-integ3',
      title: '斜めの軸のまわりの回転体',
      source: ORIG,
      time: 25,
      body: R`放物線 $C:\ y = x^{2} - x$ と直線 $\ell:\ y = x$ で囲まれた部分を $D$ とする。O を原点とし、$C$ 上の点 $\mathrm{P}(t,\ t^{2} - t)\ (0 \le t \le 2)$ から $\ell$ に下ろした垂線の足を H とする。次の問いに答えよ。

(1) $D$ の面積を求めよ。
(2) 線分 PH の長さを $t$ の式で表せ。
(3) 線分 OH の長さを $t$ の式で表せ。
(4) $D$ を直線 $\ell$ のまわりに 1 回転してできる立体の体積 $V$ を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$D$ の面積`, type: 'num', answer: 4 / 3, show: R`\frac{4}{3}` },
        { label: '(2)', q: R`$\mathrm{PH} = \boxed{\ \ }$（$t$ の式）`, type: 'expr', answer: '(2t-t^2)/sqrt(2)', vars: ['t'], show: R`\frac{2t - t^{2}}{\sqrt{2}}`, hint: '例: (t^2+1)/sqrt(3) のように入力' },
        { label: '(3)', q: R`$\mathrm{OH} = \boxed{\ \ }$（$t$ の式）`, type: 'expr', answer: 't^2/sqrt(2)', vars: ['t'], show: R`\frac{t^{2}}{\sqrt{2}}` },
        { label: '(4)', q: R`体積 $V$`, type: 'num', answer: 8 * S2 * PI / 15, show: R`\frac{8\sqrt{2}}{15}\pi`, hint: '例: 3√2π/5 のように入力' }
      ],
      solution: [
        {
          t: '(1) 交点と面積',
          m: [R`x^{2} - x = x \;\Leftrightarrow\; x(x - 2) = 0 \;\Rightarrow\; x = 0,\ 2`, R`\int_{0}^{2} \{x - (x^{2} - x)\}\,dx = \int_{0}^{2} (2x - x^{2})\,dx = \left[x^{2} - \frac{x^{3}}{3}\right]_{0}^{2} = 4 - \frac{8}{3} = \frac{4}{3}`],
          n: R`$0 \le x \le 2$ では直線 $\ell$ が放物線 $C$ の上側にあります。`
        },
        {
          t: '回転体の体積の考え方（確認）',
          m: R`V = \pi\int (\text{軸からの距離})^{2}\,d(\text{軸方向の座標})`,
          n: R`回転体を軸に垂直な薄い円板に切り分けると、1 枚の体積は「$\pi \times$ 半径の 2 乗 $\times$ 厚さ」です。それを軸に沿って足し合わせたものが積分です。$x$ 軸が軸なら $V = \pi\int y^{2}\,dx$ でした。`,
          lv: 3
        },
        {
          t: R`回転軸 $\ell$ に沿った座標を使う`,
          n: R`$\ell$ のまわりに回転させるので、$\ell$ 上の位置 $u = \mathrm{OH}$ を軸方向の座標とし、$\ell$ に垂直な断面（半径 PH の円）を $u$ で積分します。そのために PH と OH を $t$ で表します。`,
          easy: R`$x$ 軸のまわりの回転体では、$x$ 軸に垂直な断面（半径 $|y|$ の円）を $x$ で積分しました。回転軸が斜めの直線でも考え方は同じで、「軸に沿った長さ」と「軸からの距離」を測り直すだけです。`,
          fig: FIG_INTEG3B
        },
        {
          t: '(2)(3) PH と OH',
          m: [R`\mathrm{PH} = \frac{|t - (t^{2} - t)|}{\sqrt{2}} = \frac{2t - t^{2}}{\sqrt{2}}\quad (0 \le t \le 2)`, R`\mathrm{OH} = \overrightarrow{\mathrm{OP}} \cdot \frac{1}{\sqrt{2}}(1,\ 1) = \frac{t + (t^{2} - t)}{\sqrt{2}} = \frac{t^{2}}{\sqrt{2}}`],
          n: R`PH は点と直線 $x - y = 0$ の距離の公式から求まります。OH は $\overrightarrow{\mathrm{OP}}$ を $\ell$ の向きの単位ベクトル $\dfrac{1}{\sqrt{2}}(1,\ 1)$ に正射影した長さ（内積）です。`,
          pro: R`斜回転は「軸方向の座標 $u = \mathrm{OH}$」と「軸からの距離 $r = \mathrm{PH}$」を媒介変数 $t$ で表し、$V = \pi\int r^{2}\,du$ を $t$ の積分に置換するのが定石です。`
        },
        {
          t: R`(4) 体積を $t$ の積分に直す`,
          m: [R`u = \frac{t^{2}}{\sqrt{2}}\quad (t: 0 \to 2\ \text{で}\ u: 0 \to 2\sqrt{2}\ \text{と増加}),\qquad \frac{du}{dt} = \sqrt{2}\,t`, R`V = \pi\int_{0}^{2\sqrt{2}} \mathrm{PH}^{2}\,du = \pi\int_{0}^{2} \frac{(2t - t^{2})^{2}}{2} \cdot \sqrt{2}\,t\,dt = \frac{\sqrt{2}}{2}\pi\int_{0}^{2} t^{3}(2 - t)^{2}\,dt`],
          n: R`$u$ が単調に増加するので、各位置 $u$ での断面はただ 1 つの円（半径 PH）です。`
        },
        {
          t: '(4) 積分の計算',
          m: [R`\int_{0}^{2} t^{3}(4 - 4t + t^{2})\,dt = \left[t^{4} - \frac{4}{5}t^{5} + \frac{1}{6}t^{6}\right]_{0}^{2} = 16 - \frac{128}{5} + \frac{32}{3} = \frac{16}{15}`, R`V = \frac{\sqrt{2}}{2}\pi \cdot \frac{16}{15} = \frac{8\sqrt{2}}{15}\pi`],
          n: R`$V = \dfrac{8\sqrt{2}}{15}\pi$ です。`,
          pro: R`検算: 回転体の体積は「図形の面積 × 重心が描く円周の長さ」（パップス・ギュルダンの定理）。$D$ の各点の $\ell$ までの距離の平均は $\dfrac{1}{S}\int_{0}^{2} \dfrac{(2x - x^{2})^{2}}{2\sqrt{2}}\,dx = \dfrac{3}{4} \cdot \dfrac{8}{15\sqrt{2}}$ なので、$V = \dfrac{4}{3} \cdot 2\pi \cdot \dfrac{2}{5\sqrt{2}} = \dfrac{8\sqrt{2}}{15}\pi$ と一致します。`
        }
      ],
      prereq: ['m-coord', 'm-calc2'],
      tags: ['斜回転', '回転体の体積', '点と直線の距離', '置換積分']
    },

    /* ---------- 複素数平面: アポロニウスの円と 1/z による像 ---------- */
    {
      id: 'm-adv-cplane-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-cplane',
      title: 'アポロニウスの円と 1/z の像',
      source: ORIG,
      time: 20,
      body: R`複素数平面上で、等式 $|z - 3i| = 2|z|$ を満たす点 $z$ 全体の描く図形を $C$ とする。次の問いに答えよ。

(1) $C$ は円である。$C$ の中心を表す複素数を $ci$（$c$ は実数）、半径を $r$ とするとき、$c,\ r$ の値を求めよ。
(2) 点 $z$ が $C$ 上を動くとき、$|z - 4 + i|$ の最大値を求めよ。
(3) 点 $z$ が $C$ 上を動くとき、$w = \dfrac{1}{z}$ の描く図形は円である。その半径を求めよ。
(4) $C$ 上の点 $z_{0}$ で、偏角が $\dfrac{\pi}{6}$ であるものについて、絶対値 $|z_{0}|$ を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)c', q: R`$c$ の値`, type: 'num', answer: -1 },
        { label: '(1)r', q: R`半径 $r$`, type: 'num', answer: 2 },
        { label: '(2)', q: R`最大値`, type: 'num', answer: 6 },
        { label: '(3)', q: R`$w$ の描く円の半径`, type: 'num', answer: 2 / 3, show: R`\frac{2}{3}` },
        { label: '(4)', q: R`$|z_{0}|$`, type: 'num', answer: (Math.sqrt(13) - 1) / 2, show: R`\frac{\sqrt{13} - 1}{2}`, hint: '例: (√5 + 1)/2 のように入力' }
      ],
      solution: [
        {
          t: '(1) 2 乗して円の方程式にする',
          m: [R`|z - 3i|^{2} = 4|z|^{2} \;\Leftrightarrow\; (z - 3i)(\bar{z} + 3i) = 4z\bar{z}`, R`z\bar{z} + 3iz - 3i\bar{z} + 9 = 4z\bar{z} \;\Leftrightarrow\; z\bar{z} - iz + i\bar{z} - 3 = 0`, R`(z + i)(\bar{z} - i) = 4 \;\Leftrightarrow\; |z + i| = 2`],
          n: R`$C$ は中心 $-i$、半径 $2$ の円です。$c = -1,\ r = 2$ です。`,
          easy: R`$|z - \alpha|$ は点 $z$ と点 $\alpha$ の距離です。$|z - 3i| = 2|z|$ は「点 $3i$ までの距離が、原点までの距離の 2 倍」という条件で、このような点の集まりは円になります（**アポロニウスの円**）。絶対値は 2 乗して $|w|^{2} = w\bar{w}$ を使うと計算できます。`,
          pro: R`$z = x + yi$ とおいて $x^{2} + (y - 3)^{2} = 4(x^{2} + y^{2})$ から $x^{2} + (y + 1)^{2} = 4$ としても同じです。また、2 点 $0,\ 3i$ を $1:2$ に内分する点 $i$ と外分する点 $-3i$ が直径の両端になる、と読めば計算なしで中心と半径がわかります。`
        },
        {
          t: '(2) 円周上の点と定点の距離',
          m: [R`|z - 4 + i| = |z - (4 - i)|`, R`|(4 - i) - (-i)| = 4 \;\Rightarrow\; \text{最大値}\ 4 + 2 = 6`],
          n: R`円周上の点と定点の距離の最大値は「中心までの距離 + 半径」です。定点・中心・円周上の点がこの順に一直線に並ぶ $z = -2 - i$ のとき最大になります。`
        },
        {
          t: R`(3) $w = \dfrac{1}{z}$ の条件に書きかえる`,
          m: [R`z = \frac{1}{w}\ \text{を}\ |z + i| = 2\ \text{に代入}:\quad \left|\frac{1}{w} + i\right| = 2 \;\Leftrightarrow\; |1 + iw| = 2|w|`, R`1 + iw = i(w - i)\ \text{より}\quad |1 + iw| = |w - i| \;\Rightarrow\; |w - i| = 2|w|`],
          n: R`$0$ は $C$ 上にない（$|0 + i| = 1 \ne 2$）ので、$w = \dfrac{1}{z}$ は常に定義され、$w \ne 0$ です。`,
          easy: R`「$z$ が満たす式」に $z = \dfrac{1}{w}$ を代入すると「$w$ が満たす式」が得られます。これが $w$ の描く図形の方程式です。`
        },
        {
          t: R`(3) $w$ の描く円`,
          m: [R`|w - i|^{2} = 4|w|^{2} \;\Leftrightarrow\; w\bar{w} + iw - i\bar{w} + 1 = 4w\bar{w}`, R`w\bar{w} - \frac{i}{3}w + \frac{i}{3}\bar{w} - \frac{1}{3} = 0 \;\Leftrightarrow\; \left|w + \frac{i}{3}\right|^{2} = \frac{1}{3} + \frac{1}{9} = \frac{4}{9}`],
          n: R`$w$ は中心 $-\dfrac{i}{3}$、半径 $\dfrac{2}{3}$ の円を描きます。`,
          pro: R`$|w - i| = 2|w|$ も (1) と同じ型のアポロニウスの円です。2 点 $0,\ i$ を $1:2$ に内分する点 $\dfrac{i}{3}$ と外分する点 $-i$ が直径の両端なので、中心 $-\dfrac{i}{3}$、半径 $\dfrac{2}{3}$ がすぐ読めます。`
        },
        {
          t: R`(4) 偏角が $\dfrac{\pi}{6}$ の点`,
          m: [R`z_{0} = \rho\left(\cos\frac{\pi}{6} + i\sin\frac{\pi}{6}\right) = \frac{\sqrt{3}}{2}\rho + \frac{1}{2}\rho i\quad (\rho > 0)`, R`|z_{0} + i|^{2} = \frac{3}{4}\rho^{2} + \left(\frac{1}{2}\rho + 1\right)^{2} = \rho^{2} + \rho + 1 = 4`, R`\rho^{2} + \rho - 3 = 0,\ \rho > 0 \;\Rightarrow\; \rho = \frac{-1 + \sqrt{13}}{2}`],
          n: R`原点は $C$ の内部（$|0 + i| = 1 < 2$）にあるので、原点から偏角 $\dfrac{\pi}{6}$ の向きに伸ばした半直線は $C$ とちょうど 1 点で交わります。$|z_{0}| = \dfrac{\sqrt{13} - 1}{2}$ です。`,
          easy: R`極形式 $z = \rho(\cos\theta + i\sin\theta)$ では $\rho$ が絶対値、$\theta$ が偏角です。偏角を固定して絶対値 $\rho$ を未知数にすると、円の条件が $\rho$ の 2 次方程式になります。`
        }
      ],
      prereq: ['m-complex', 'm-trig2'],
      tags: ['アポロニウスの円', '共役複素数', '1/z による像', '極形式']
    },

    /* ---------- 2次曲線: 楕円の接線が切り取る三角形と準円 ---------- */
    {
      id: 'm-adv-conic-01',
      subject: 'math',
      level: 'adv',
      unit: 'm-conic',
      title: '楕円の接線が切り取る三角形と準円',
      source: ORIG,
      time: 22,
      body: R`楕円 $E:\ \dfrac{x^{2}}{12} + \dfrac{y^{2}}{4} = 1$ を考える。次の問いに答えよ。

(1) $E$ の離心率を求めよ。
(2) $E$ 上の点 $\mathrm{P}(2\sqrt{3}\cos\theta,\ 2\sin\theta)\ \left(0 < \theta < \dfrac{\pi}{2}\right)$ における接線が $x$ 軸、$y$ 軸と交わる点をそれぞれ A, B とし、O を原点とする。$\triangle\mathrm{OAB}$ の面積の最小値を求めよ。
(3) (2) の面積が最小となるときの点 P の $x$ 座標を求めよ。
(4) (2) の線分 AB の長さの最小値を求めよ。
(5) $E$ の外部の点 Q から $E$ に引いた 2 本の接線が直交するとき、点 Q はある円の周上にある。その円の半径を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`離心率`, type: 'num', answer: S6 / 3, show: R`\frac{\sqrt{6}}{3}` },
        { label: '(2)', q: R`$\triangle\mathrm{OAB}$ の面積の最小値`, type: 'num', answer: 4 * S3, show: R`4\sqrt{3}` },
        { label: '(3)', q: R`点 P の $x$ 座標`, type: 'num', answer: S6, show: R`\sqrt{6}` },
        { label: '(4)', q: R`AB の最小値`, type: 'num', answer: 2 + 2 * S3, show: R`2 + 2\sqrt{3}` },
        { label: '(5)', q: R`円の半径`, type: 'num', answer: 4 }
      ],
      solution: [
        {
          t: '(1) 離心率',
          m: [R`a^{2} = 12,\ b^{2} = 4 \;\Rightarrow\; c = \sqrt{a^{2} - b^{2}} = 2\sqrt{2}`, R`e = \frac{c}{a} = \frac{2\sqrt{2}}{2\sqrt{3}} = \frac{\sqrt{6}}{3}`],
          n: R`焦点は $(\pm 2\sqrt{2},\ 0)$ です。`,
          easy: R`楕円 $\dfrac{x^{2}}{a^{2}} + \dfrac{y^{2}}{b^{2}} = 1\ (a > b > 0)$ の焦点は $(\pm c,\ 0)$、$c = \sqrt{a^{2} - b^{2}}$ です。**離心率** $e = \dfrac{c}{a}$ は楕円のつぶれ具合を表す量で、$0$ に近いほど円に近く、$1$ に近いほど細長くなります。`
        },
        {
          t: '(2) 接線と軸との交点',
          m: [R`\frac{2\sqrt{3}\cos\theta}{12}x + \frac{2\sin\theta}{4}y = 1 \;\Leftrightarrow\; \frac{\cos\theta}{2\sqrt{3}}x + \frac{\sin\theta}{2}y = 1`, R`\mathrm{A}\left(\frac{2\sqrt{3}}{\cos\theta},\ 0\right),\qquad \mathrm{B}\left(0,\ \frac{2}{\sin\theta}\right)`],
          n: R`楕円 $\dfrac{x^{2}}{a^{2}} + \dfrac{y^{2}}{b^{2}} = 1$ 上の点 $(x_{0},\ y_{0})$ における接線は $\dfrac{x_{0}x}{a^{2}} + \dfrac{y_{0}y}{b^{2}} = 1$ です。`,
          pro: R`楕円を $x$ 方向に $\dfrac{1}{\sqrt{3}}$ 倍すると半径 2 の円になり、接線は接線に、面積は $\dfrac{1}{\sqrt{3}}$ 倍に移ります。円で考えて最後に $\sqrt{3}$ 倍しても解けます。`
        },
        {
          t: '(2)(3) 面積の最小',
          m: [R`\triangle\mathrm{OAB} = \frac{1}{2} \cdot \frac{2\sqrt{3}}{\cos\theta} \cdot \frac{2}{\sin\theta} = \frac{2\sqrt{3}}{\sin\theta\cos\theta} = \frac{4\sqrt{3}}{\sin 2\theta}`, R`0 < 2\theta < \pi\ \text{で}\ 0 < \sin 2\theta \le 1\ \left(\text{等号は}\ \theta = \frac{\pi}{4}\right) \;\Rightarrow\; \triangle\mathrm{OAB} \ge 4\sqrt{3}`, R`\theta = \frac{\pi}{4}:\quad \mathrm{P}\left(2\sqrt{3} \cdot \frac{\sqrt{2}}{2},\ 2 \cdot \frac{\sqrt{2}}{2}\right) = (\sqrt{6},\ \sqrt{2})`],
          n: R`最小値は $4\sqrt{3}$、そのときの P の $x$ 座標は $\sqrt{6}$ です。`,
          easy: R`2 倍角の公式 $\sin 2\theta = 2\sin\theta\cos\theta$ で分母を 1 つのサインにまとめると、分母が最大（$= 1$）のとき面積が最小、とすぐわかります。`
        },
        {
          t: '(4) AB の 2 乗を変形する',
          m: [R`\mathrm{AB}^{2} = \frac{12}{\cos^{2}\theta} + \frac{4}{\sin^{2}\theta} = \left(\frac{12}{\cos^{2}\theta} + \frac{4}{\sin^{2}\theta}\right)(\cos^{2}\theta + \sin^{2}\theta)`, R`= 16 + 12\tan^{2}\theta + \frac{4}{\tan^{2}\theta} \ge 16 + 2\sqrt{12\tan^{2}\theta \cdot \frac{4}{\tan^{2}\theta}} = 16 + 8\sqrt{3}`],
          n: R`$\cos^{2}\theta + \sin^{2}\theta = 1$ を掛けても値は変わりません。展開して、相加平均と相乗平均の関係を使います。`
        },
        {
          t: '(4) 最小値と等号成立',
          m: [R`16 + 8\sqrt{3} = (2 + 2\sqrt{3})^{2} \;\Rightarrow\; \mathrm{AB} \ge 2 + 2\sqrt{3}`, R`\text{等号}:\ 12\tan^{2}\theta = \frac{4}{\tan^{2}\theta} \;\Leftrightarrow\; \tan^{2}\theta = \frac{1}{\sqrt{3}}`],
          n: R`$\tan^{2}\theta = \dfrac{1}{\sqrt{3}}$ を満たす $\theta\ \left(0 < \theta < \dfrac{\pi}{2}\right)$ は存在するので、最小値は $2 + 2\sqrt{3}$ です。`,
          pro: R`$\left(\dfrac{p^{2}}{u} + \dfrac{q^{2}}{v}\right)(u + v) \ge (p + q)^{2}$（コーシー・シュワルツの不等式）を使うと $\mathrm{AB}^{2} \ge (\sqrt{12} + \sqrt{4})^{2}$ と一行で出ます。面積の最小（(2)）と長さの最小（(4)）では、最小を与える P が異なることに注意します。`
        },
        {
          t: '(5) Q を通る接線の傾きの方程式',
          m: [R`\mathrm{Q}(p,\ q)\ \text{を通る直線}\ y = mx + (q - mp)\ \text{を}\ x^{2} + 3y^{2} = 12\ \text{に代入}`, R`(1 + 3m^{2})x^{2} + 6m(q - mp)x + 3(q - mp)^{2} - 12 = 0`, R`\frac{D}{4} = 0 \;\Leftrightarrow\; (q - mp)^{2} = 12m^{2} + 4 \;\Leftrightarrow\; (p^{2} - 12)m^{2} - 2pqm + (q^{2} - 4) = 0`],
          n: R`2 本の接線の傾き $m_{1},\ m_{2}$ は、この $m$ の 2 次方程式の 2 つの解です（$p^{2} \ne 12$ のとき）。`,
          easy: R`「直線が楕円に接する」とは、連立して $x$ の 2 次方程式にしたとき重解をもつ（判別式が 0）ことです。この条件から、点 Q を通る接線の傾き $m$ が満たす方程式が得られます。`
        },
        {
          t: '(5) 直交条件',
          m: R`m_{1}m_{2} = -1 \;\Leftrightarrow\; \frac{q^{2} - 4}{p^{2} - 12} = -1 \;\Leftrightarrow\; p^{2} + q^{2} = 16`,
          n: R`解と係数の関係から $m_{1}m_{2} = \dfrac{q^{2} - 4}{p^{2} - 12}$ です。$p = \pm 2\sqrt{3}$ のときは接線 $x = \pm 2\sqrt{3}$ と $y = \pm 2$ が直交し、点 $(\pm 2\sqrt{3},\ \pm 2)$ もこの円上にあります。よって Q は円 $x^{2} + y^{2} = 16$ 上にあり、半径は $4$ です。`,
          pro: R`一般に楕円 $\dfrac{x^{2}}{a^{2}} + \dfrac{y^{2}}{b^{2}} = 1$ の直交する 2 接線の交点は円 $x^{2} + y^{2} = a^{2} + b^{2}$（**準円**）上にあります。結果を知っておくと検算に使えます。`
        }
      ],
      prereq: ['m-coord', 'm-trig2', 'm-proof'],
      tags: ['楕円の接線', '離心率', '相加平均と相乗平均', '準円', '解と係数の関係']
    }
  ]);
})();
