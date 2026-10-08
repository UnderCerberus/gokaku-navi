/* GOKAKU NAVI — 数学 復習ドリル（level: 'drill'）
   数学の全 22 単元 × 各 3 問 = 66 問。上位単元で誤答した生徒が「1 つ前の範囲」に戻って解く一問一答の基礎確認です。
   すべて書き下ろしのオリジナル問題。solution の各ステップに易しい言い直し（easy）を付けています。 */
(function () {
  'use strict';
  const R = String.raw;

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // 直角三角形（直角をはさむ 2 辺 4, 7、斜辺 x）
  function figRightTri() {
    const d = JK.plot.draw(300, 190);
    const C = [50, 160], B = [260, 160], A = [50, 40];
    d.poly([A, B, C], { cls: 'fg', fill: 'f1' });
    d.poly([[C[0] + 14, C[1]], [C[0] + 14, C[1] - 14], [C[0], C[1] - 14]], { cls: 'dim', close: false });
    d.text(A[0] - 12, A[1] + 4, 'A', { size: 14, italic: true });
    d.text(B[0] + 12, B[1] + 5, 'B', { size: 14, italic: true });
    d.text(C[0] - 12, C[1] + 14, 'C', { size: 14, italic: true });
    d.text(C[0] - 14, (A[1] + C[1]) / 2 + 4, '4', { cls: 'c1', size: 14 });
    d.text((B[0] + C[0]) / 2, C[1] + 18, '7', { cls: 'c1', size: 14 });
    d.text((A[0] + B[0]) / 2 + 12, (A[1] + B[1]) / 2 - 6, 'x', { cls: 'c3', size: 14, italic: true });
    return d.svg();
  }

  // 1 辺 6 の正三角形と高さ
  function figEquilateral() {
    const d = JK.plot.draw(300, 200);
    const k = 30, B = [50, 175], C = [50 + 6 * k, 175], A = [50 + 3 * k, 175 - Math.sqrt(27) * k], M = [50 + 3 * k, 175];
    d.poly([A, B, C], { cls: 'fg', fill: 'f1' });
    d.line(A[0], A[1], M[0], M[1], { cls: 'c3', dash: true });
    d.poly([[M[0] - 12, M[1]], [M[0] - 12, M[1] - 12], [M[0], M[1] - 12]], { cls: 'dim', close: false });
    d.text(A[0], A[1] - 8, 'A', { size: 14, italic: true });
    d.text(B[0] - 12, B[1] + 5, 'B', { size: 14, italic: true });
    d.text(C[0] + 12, C[1] + 5, 'C', { size: 14, italic: true });
    d.text(M[0], M[1] + 17, 'M', { size: 14, italic: true });
    d.text((A[0] + B[0]) / 2 - 12, (A[1] + B[1]) / 2, '6', { cls: 'c1', size: 14 });
    d.text(A[0] + 10, (A[1] + M[1]) / 2, 'h', { cls: 'c3', size: 14, italic: true });
    d.text((B[0] + M[0]) / 2, B[1] + 17, '3', { cls: 'c1', size: 13 });
    d.text((M[0] + C[0]) / 2, B[1] + 17, '3', { cls: 'c1', size: 13 });
    return d.svg();
  }

  // △ABC と DE ∥ BC
  function figParallelLines() {
    const d = JK.plot.draw(320, 205);
    const A = [160, 20], B = [40, 175], C = [290, 175];
    const lerp = function (P, Q, t) { return [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]; };
    const D = lerp(A, B, 0.4), E = lerp(A, C, 0.4);
    d.poly([A, B, C], { cls: 'fg', fill: 'f0' });
    d.line(D[0], D[1], E[0], E[1], { cls: 'c1', w: 2 });
    [D, E].forEach(function (P) { d.dot(P[0], P[1], { cls: 'c1', r: 2.8 }); });
    d.text(A[0], A[1] - 8, 'A', { size: 14, italic: true });
    d.text(B[0] - 12, B[1] + 5, 'B', { size: 14, italic: true });
    d.text(C[0] + 12, C[1] + 5, 'C', { size: 14, italic: true });
    d.text(D[0] - 14, D[1] + 4, 'D', { size: 14, italic: true });
    d.text(E[0] + 14, E[1] + 4, 'E', { size: 14, italic: true });
    d.text((A[0] + D[0]) / 2 - 12, (A[1] + D[1]) / 2, '4', { cls: 'c3', size: 13 });
    d.text((D[0] + B[0]) / 2 - 12, (D[1] + B[1]) / 2 + 4, '6', { cls: 'c3', size: 13 });
    d.text((D[0] + E[0]) / 2, D[1] - 7, '6', { cls: 'c3', size: 13 });
    d.text((B[0] + C[0]) / 2, B[1] + 18, '?', { cls: 'c2', size: 14 });
    return d.svg();
  }

  // 円周角と中心角（∠AOB = 112°, C は優弧上）
  function figInscribed() {
    const d = JK.plot.draw(300, 220);
    const O = [140, 110], r = 88;
    const P = function (deg) { return [O[0] + r * Math.cos(deg * Math.PI / 180), O[1] - r * Math.sin(deg * Math.PI / 180)]; };
    const A = P(-56), B = P(56), C = P(180);
    const deg = function (S, T) { return Math.atan2(-(T[1] - S[1]), T[0] - S[0]) * 180 / Math.PI; };
    d.circle(O[0], O[1], r, { cls: 'fg' });
    d.line(O[0], O[1], A[0], A[1], { cls: 'dim' });
    d.line(O[0], O[1], B[0], B[1], { cls: 'dim' });
    d.line(C[0], C[1], A[0], A[1], { cls: 'c1', w: 2 });
    d.line(C[0], C[1], B[0], B[1], { cls: 'c1', w: 2 });
    d.angle(O[0], O[1], 24, -56, 56, '112°', { cls: 'c3' });
    d.angle(C[0], C[1], 34, deg(C, A), deg(C, B), '?', { cls: 'c2' });
    [A, B, C, O].forEach(function (Q) { d.dot(Q[0], Q[1], { cls: 'fg', r: 2.6 }); });
    d.text(A[0] + 12, A[1] + 12, 'A', { size: 14, italic: true });
    d.text(B[0] + 12, B[1] - 6, 'B', { size: 14, italic: true });
    d.text(C[0] - 12, C[1] + 5, 'C', { size: 14, italic: true });
    d.text(O[0] - 8, O[1] + 16, 'O', { size: 14, italic: true });
    return d.svg();
  }

  // y = 2x^2 + 8x + 3 の頂点
  function figQuadVertex() {
    return JK.plot.graph({
      w: 320, h: 230, x: [-5, 1], y: [-7, 6],
      curves: [{ f: function (x) { return 2 * x * x + 8 * x + 3; }, cls: 'c1' }],
      vlines: [{ x: -2, dash: true, label: '軸 x=-2', cls: 'c3' }],
      points: [{ x: -2, y: -5, label: '頂点(-2, -5)', cls: 'c3', pos: 'br' }]
    });
  }

  // y = -x^2 + 4x + 1 (0 ≦ x ≦ 3)
  function figQuadInterval() {
    return JK.plot.graph({
      w: 320, h: 230, x: [-1, 4], y: [-2, 6.5],
      curves: [{ f: function (x) { return -x * x + 4 * x + 1; }, cls: 'c1' }],
      vlines: [{ x: 0, dash: true }, { x: 3, dash: true }],
      points: [
        { x: 2, y: 5, label: '最大(2, 5)', cls: 'c3', pos: 'tr' },
        { x: 0, y: 1, label: '(0, 1)', cls: 'c2', pos: 'br' },
        { x: 3, y: 4, label: '(3, 4)', cls: 'c2', pos: 'tr' }
      ]
    });
  }

  // 直角三角形 ABC（∠C=90°, AC=3, BC=2）と ∠A=θ
  function figRightTri2() {
    const d = JK.plot.draw(300, 190);
    const k = 50, C = [50, 150], A = [50 + 3 * k, 150], B = [50, 150 - 2 * k];
    d.poly([A, B, C], { cls: 'fg', fill: 'f1' });
    d.poly([[C[0] + 14, C[1]], [C[0] + 14, C[1] - 14], [C[0], C[1] - 14]], { cls: 'dim', close: false });
    const th = 180 - Math.atan2(2, 3) * 180 / Math.PI;
    d.angle(A[0], A[1], 34, th, 180, 'θ', { cls: 'c3' });
    d.text(A[0] + 12, A[1] + 5, 'A', { size: 14, italic: true });
    d.text(B[0] - 4, B[1] - 10, 'B', { size: 14, italic: true });
    d.text(C[0] - 12, C[1] + 14, 'C', { size: 14, italic: true });
    d.text((A[0] + C[0]) / 2, C[1] + 18, '3', { cls: 'c1', size: 14 });
    d.text(C[0] - 14, (B[1] + C[1]) / 2 + 4, '2', { cls: 'c1', size: 14 });
    return d.svg();
  }

  // 円と 2 本の割線（方べきの定理: PA=3, AB=5, PC=4）。円の半径 5・OP=7 の実寸比で描く
  function figSecants() {
    const d = JK.plot.draw(340, 230);
    const k = 17, O = [100, 115], P = [O[0] + 7 * k, O[1]];
    d.circle(O[0], O[1], 5 * k, { cls: 'fg' });
    const phi1 = Math.asin(Math.sqrt(18.75) / 7), phi2 = Math.asin(Math.sqrt(24) / 7);
    const dir1 = [-Math.cos(phi1), -Math.sin(phi1)], dir2 = [-Math.cos(phi2), Math.sin(phi2)];
    const pt = function (dir, len) { return [P[0] + dir[0] * len * k, P[1] + dir[1] * len * k]; };
    const A = pt(dir1, 3), B = pt(dir1, 8), C = pt(dir2, 4), D = pt(dir2, 6);
    d.line(P[0], P[1], B[0], B[1], { cls: 'c1', w: 2 });
    d.line(P[0], P[1], D[0], D[1], { cls: 'c2', w: 2 });
    [P, A, B, C, D].forEach(function (Q) { d.dot(Q[0], Q[1], { cls: 'fg', r: 2.8 }); });
    d.text(P[0] + 12, P[1] + 5, 'P', { size: 14, italic: true });
    d.text(A[0] + 4, A[1] - 9, 'A', { size: 14, italic: true });
    d.text(B[0] - 4, B[1] - 9, 'B', { size: 14, italic: true });
    d.text(C[0] + 6, C[1] + 16, 'C', { size: 14, italic: true });
    d.text(D[0] - 4, D[1] + 16, 'D', { size: 14, italic: true });
    const mid = function (S, T) { return [(S[0] + T[0]) / 2, (S[1] + T[1]) / 2]; };
    const m1 = mid(P, A), m2 = mid(A, B), m3 = mid(P, C);
    d.text(m1[0] + 6, m1[1] - 8, '3', { cls: 'c1', size: 13 });
    d.text(m2[0] + 2, m2[1] - 9, '5', { cls: 'c1', size: 13 });
    d.text(m3[0] + 8, m3[1] + 14, '4', { cls: 'c2', size: 13 });
    return d.svg();
  }

  // y = x^3 - 3x と、点 (2, 2) における接線 y = 9x - 16
  function figTangentCubic() {
    return JK.plot.graph({
      w: 320, h: 240, x: [-2.2, 3], y: [-4, 8],
      curves: [
        { f: function (x) { return x * x * x - 3 * x; }, cls: 'c1' },
        { f: function (x) { return 9 * x - 16; }, cls: 'c3', dash: true, domain: [0.8, 2.6] }
      ],
      points: [{ x: 2, y: 2, label: '接点(2, 2)', cls: 'c3', pos: 'tl' }]
    });
  }

  // 放物線 y^2 = 8x（焦点 (2, 0)、準線 x = -2）
  function figParabola() {
    return JK.plot.graph({
      w: 320, h: 230, x: [-3.5, 6], y: [-5.5, 5.5], equal: true,
      param: [{ x: function (t) { return t * t / 8; }, y: function (t) { return t; }, t: [-7, 7], cls: 'c1' }],
      vlines: [{ x: -2, label: '準線 x=-2', cls: 'c2', dash: true }],
      points: [{ x: 2, y: 0, label: '焦点(2, 0)', cls: 'c3', pos: 'tr' }]
    });
  }

  // 楕円 x^2/9 + y^2/25 = 1（縦長。焦点 (0, ±4)）
  function figEllipseTall() {
    return JK.plot.graph({
      w: 300, h: 260, x: [-4.5, 4.5], y: [-6.2, 6.2], equal: true,
      param: [{ x: function (t) { return 3 * Math.cos(t); }, y: function (t) { return 5 * Math.sin(t); }, t: [0, 2 * Math.PI], cls: 'c1' }],
      points: [
        { x: 0, y: 4, label: 'F(0, 4)', cls: 'c3', pos: 'tr' },
        { x: 0, y: -4, label: "F'(0, -4)", cls: 'c3', pos: 'br' }
      ]
    });
  }

  // 双曲線 x^2/9 - y^2/16 = 1（漸近線 y = ±(4/3)x、焦点 (±5, 0)）
  function figHyperbola() {
    const up = function (x) { return 4 / 3 * Math.sqrt(x * x - 9); };
    const dn = function (x) { return -4 / 3 * Math.sqrt(x * x - 9); };
    return JK.plot.graph({
      w: 340, h: 250, x: [-8, 8], y: [-6, 6], equal: true,
      curves: [
        { f: up, domain: [3, 8], cls: 'c1' }, { f: dn, domain: [3, 8], cls: 'c1' },
        { f: up, domain: [-8, -3], cls: 'c1' }, { f: dn, domain: [-8, -3], cls: 'c1' },
        { f: function (x) { return 4 * x / 3; }, cls: 'c3', dash: true },
        { f: function (x) { return -4 * x / 3; }, cls: 'c3', dash: true }
      ],
      points: [
        { x: 5, y: 0, label: 'F(5, 0)', cls: 'c4', pos: 'tr' },
        { x: -5, y: 0, label: "F'(-5, 0)", cls: 'c4', pos: 'tl' }
      ]
    });
  }

  /* @@APPEND-FIG@@ */

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ---------- 中学数学（m-junior） ---------- */
    {
      id: 'd-m-junior-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-junior',
      title: '分数の計算と一次方程式',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\dfrac{3}{4} - \dfrac{5}{6} + \dfrac{1}{3}$ を計算せよ。`, type: 'num', answer: 1 / 4, show: R`\frac{1}{4}`, hint: R`例: 3/4 や 0.75` },
        { label: '(2)', q: R`方程式 $\dfrac{2x-1}{3} = \dfrac{x+2}{2}$ を解け。`, type: 'num', answer: 8 }
      ],
      solution: [
        { t: '通分してから分子を計算する（(1)）',
          m: R`\frac{3}{4} - \frac{5}{6} + \frac{1}{3} = \frac{9}{12} - \frac{10}{12} + \frac{4}{12} = \frac{9 - 10 + 4}{12} = \frac{3}{12} = \frac{1}{4}`,
          n: R`分母 $4,\ 6,\ 3$ の最小公倍数 $12$ に通分します。分母がそろったら分子だけを計算し、最後に約分します。`,
          easy: R`分数の足し算・引き算は、**分母をそろえてから**分子どうしを計算します。分母 $4,\ 6,\ 3$ のどれでも割り切れる最小の数が $12$ です。$\dfrac{3}{4}$ は分母分子に $3$ をかけて $\dfrac{9}{12}$、$\dfrac{5}{6}$ は $2$ をかけて $\dfrac{10}{12}$、$\dfrac{1}{3}$ は $4$ をかけて $\dfrac{4}{12}$ になります。答えは約分して $\dfrac{1}{4}$ です。` },
        { t: '両辺に分母の最小公倍数をかけて分母をはらう（(2)）',
          m: [R`\frac{2x-1}{3} = \frac{x+2}{2}`,
              R`2(2x-1) = 3(x+2) \;\Rightarrow\; 4x - 2 = 3x + 6 \;\Rightarrow\; x = 8`],
          n: R`両辺に $3$ と $2$ の最小公倍数 $6$ をかけると、分母がなくなります。そのあと、$x$ の項を左辺、数を右辺に移項します。`,
          easy: R`等式は、**両辺に同じ数をかけても成り立ちます**。分母の $3$ と $2$ をいっぺんに消すために、$6$ を両辺にかけます。左辺は $\dfrac{2x-1}{3} \times 6 = 2(2x-1)$、右辺は $\dfrac{x+2}{2} \times 6 = 3(x+2)$ です。かっこを開いて $4x-2=3x+6$、$x$ を左に集めると $x=8$ です。確かめると、左辺 $\dfrac{16-1}{3}=5$、右辺 $\dfrac{8+2}{2}=5$ で一致します。` }
      ],
      tags: ['分数', '一次方程式']
    },

    {
      id: 'd-m-junior-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-junior',
      title: '比と割合（比例配分・濃度）',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`2400 円を $3 : 5$ に分けるとき、多い方の金額は何円か。`, type: 'num', answer: 1500, unit: '円' },
        { label: '(2)', q: R`10% の食塩水 200 g と 5% の食塩水 300 g を混ぜると、何 % の食塩水になるか。`, type: 'num', answer: 7, unit: '%' }
      ],
      solution: [
        { t: '全体を比の合計で割って、1 つ分を求める（(1)）',
          m: R`2400 \times \frac{5}{3+5} = 2400 \times \frac{5}{8} = 1500`,
          n: R`$3 : 5$ に分けるとは、全体を $3 + 5 = 8$ 個分に分け、$3$ 個分と $5$ 個分にすることです。多い方は $5$ 個分です。`,
          easy: R`比 $3 : 5$ は「全体を $8$ 等分して、3 つ分と 5 つ分に分ける」という意味です。$1$ 個分は $2400 \div 8 = 300$ 円。多い方は 5 個分なので $300 \times 5 = 1500$ 円です。少ない方は $300 \times 3 = 900$ 円で、合計 $2400$ 円になります。` },
        { t: '食塩の重さの合計 ÷ 食塩水全体の重さ（(2)）',
          m: [R`200 \times 0.10 + 300 \times 0.05 = 20 + 15 = 35`,
              R`\frac{35}{200 + 300} \times 100 = \frac{35}{500} \times 100 = 7`],
          n: R`まず、それぞれに含まれる食塩の重さ（$20\ \mathrm{g}$ と $15\ \mathrm{g}$）を求めて足します。濃度は「食塩の重さ ÷ 食塩水全体の重さ × 100」です。濃度（%）どうしをそのまま平均しないように注意しましょう。`,
          easy: R`濃度は「食塩水の中に食塩がどれだけ入っているか」の割合です。10% の食塩水 200 g には食塩が $200 \times 0.10 = 20$ g、5% の 300 g には $300 \times 0.05 = 15$ g 入っています。混ぜると食塩は合計 $35$ g、食塩水は合計 $500$ g です。だから濃度は $35 \div 500 = 0.07$、つまり 7% です。**重さは足せるけれど、% は足せない**（10 と 5 の平均 7.5 にはならない）のがポイントです。` }
      ],
      tags: ['比', '割合', '食塩水']
    },

    {
      id: 'd-m-junior-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-junior',
      title: '連立方程式の文章題',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`鉛筆 1 本の値段を $x$ 円、ノート 1 冊の値段を $y$ 円とする。鉛筆 3 本とノート 2 冊で 440 円、鉛筆 5 本とノート 1 冊で 430 円である。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`鉛筆 1 本の値段 $x$ を求めよ。`, type: 'num', answer: 60, unit: '円' },
        { label: '(2)', q: R`ノート 1 冊の値段 $y$ を求めよ。`, type: 'num', answer: 130, unit: '円' }
      ],
      solution: [
        { t: '条件を連立方程式に直す',
          m: R`\begin{cases} 3x + 2y = 440 \\ 5x + y = 430 \end{cases}`,
          n: R`「鉛筆 3 本とノート 2 冊で 440 円」から $3x + 2y = 440$、「鉛筆 5 本とノート 1 冊で 430 円」から $5x + y = 430$ です。`,
          easy: R`文章題は、まず「分からないものを文字で表す」ことから始めます。鉛筆 1 本が $x$ 円なら 3 本で $3x$ 円、ノート 1 冊が $y$ 円なら 2 冊で $2y$ 円。合計が 440 円なので $3x+2y=440$ です。もう 1 つの条件も同じように式にして、2 本の式をそろえて書きます。` },
        { t: '加減法で文字を 1 つ消して解く',
          m: [R`(5x + y = 430) \times 2:\quad 10x + 2y = 860`,
              R`(10x + 2y) - (3x + 2y) = 7x = 860 - 440 = 420 \;\Rightarrow\; x = 60`,
              R`5 \times 60 + y = 430 \;\Rightarrow\; y = 130`],
          n: R`下の式を $2$ 倍して $y$ の係数をそろえ、上の式を引くと $y$ が消えます。$x=60$ を代入して $y$ を求めます。確かめ: $3 \times 60 + 2 \times 130 = 440$ ✓。`,
          easy: R`2 つの式を足したり引いたりして、**文字を 1 つ消す**のが加減法です。上の式の $y$ の係数は $2$、下の式は $1$ なので、下の式を $2$ 倍すると $y$ の係数が $2$ にそろいます。そこで 2 つの式を引き算すると $y$ が消えて、$7x=420$ になります。$x$ が分かったら、どちらかの式に代入して $y$ を求めます。` }
      ],
      tags: ['連立方程式', '文章題']
    },

    /* ---------- 中学図形（m-geo0） ---------- */
    {
      id: 'd-m-geo0-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-geo0',
      title: '三平方の定理',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: figRightTri(),
      parts: [
        { label: '(1)', q: R`図の直角三角形で、直角をはさむ 2 辺が $4$ と $7$ のとき、斜辺の長さ $x$ を求めよ。`, type: 'num', answer: Math.sqrt(65), show: R`\sqrt{65}`, hint: R`例: √7 や sqrt(7)` },
        { label: '(2)', q: R`1 辺の長さが $6$ の正三角形の高さを求めよ。`, type: 'num', answer: 3 * Math.sqrt(3), show: R`3\sqrt{3}`, hint: R`例: 5√7（5*sqrt(7) でも可）` }
      ],
      solution: [
        { t: '三平方の定理を使う（(1)）',
          m: R`x^{2} = 4^{2} + 7^{2} = 16 + 49 = 65 \;\Rightarrow\; x = \sqrt{65}`,
          n: R`直角三角形では、斜辺の 2 乗は、他の 2 辺の 2 乗の和に等しくなります（三平方の定理）。`,
          easy: R`**斜辺**は、直角の向かい側にある一番長い辺です。三平方の定理は「直角をはさむ 2 辺をそれぞれ 2 乗して足すと、斜辺の 2 乗になる」という関係です。$4^{2}+7^{2}=65$ なので、斜辺は「2 乗すると 65 になる正の数」、つまり $\sqrt{65}$ です。` },
        { t: '正三角形を半分に切って直角三角形にする（(2)）',
          m: [R`h^{2} + 3^{2} = 6^{2}`,
              R`h^{2} = 36 - 9 = 27 \;\Rightarrow\; h = \sqrt{27} = 3\sqrt{3}`],
          n: R`頂点から底辺に垂線をおろすと、底辺は $3$ ずつに 2 等分され、斜辺 $6$・底辺 $3$ の直角三角形ができます。三平方の定理で高さ $h$ を求めます。`,
          easy: R`正三角形は左右対称なので、頂点からまっすぐ下ろした線は底辺をちょうど半分（$3$ ずつ）に分けます。すると図のように、斜辺が $6$、底辺が $3$ の直角三角形が現れます。残りの辺 $h$ が高さで、$h^{2}=6^{2}-3^{2}=27$。$\sqrt{27}=\sqrt{9 \times 3}=3\sqrt{3}$ と簡単にします。`,
          fig: figEquilateral() }
      ],
      tags: ['三平方の定理', '正三角形']
    },

    {
      id: 'd-m-geo0-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-geo0',
      title: '相似比と線分の比・面積比',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: figParallelLines(),
      parts: [
        { label: '(1)', q: R`図で $\mathrm{DE} \parallel \mathrm{BC}$、$\mathrm{AD} = 4,\ \mathrm{DB} = 6,\ \mathrm{DE} = 6$ のとき、$\mathrm{BC}$ の長さを求めよ。`, type: 'num', answer: 15 },
        { label: '(2)', q: R`相似比が $2 : 3$ の 2 つの相似な三角形がある。小さい方の面積が $20\ \mathrm{cm^{2}}$ のとき、大きい方の面積は何 $\mathrm{cm^{2}}$ か。`, type: 'num', answer: 45, unit: 'cm²' }
      ],
      solution: [
        { t: '平行線から相似な三角形を見つける（(1)）',
          m: [R`\triangle \mathrm{ADE} \sim \triangle \mathrm{ABC}, \qquad \mathrm{AD} : \mathrm{AB} = 4 : 10 = 2 : 5`,
              R`\mathrm{BC} = \mathrm{DE} \times \frac{5}{2} = 6 \times \frac{5}{2} = 15`],
          n: R`$\mathrm{DE} \parallel \mathrm{BC}$ なので △ADE と △ABC は相似です。相似比は $\mathrm{AD} : \mathrm{AB}$ で、$\mathrm{AB} = \mathrm{AD} + \mathrm{DB} = 10$ です。$\mathrm{DE} : \mathrm{BC} = 2 : 5$ から $\mathrm{BC}$ を求めます。`,
          easy: R`平行な線を引くと、同じ形で大きさだけが違う 2 つの三角形（**相似**な三角形）ができます。小さい三角形 ADE の辺 AD と、大きい三角形 ABC の辺 AB が「対応する辺」で、その比が **相似比**です。$\mathrm{AB}$ は $4+6=10$ なので、相似比は $4 : 10 = 2 : 5$。すべての対応する辺の比が同じなので、$\mathrm{DE} : \mathrm{BC} = 2 : 5$ から $\mathrm{BC} = 6 \times \dfrac{5}{2}=15$ です。` },
        { t: '面積比は相似比の 2 乗（(2)）',
          m: [R`\text{面積比} = 2^{2} : 3^{2} = 4 : 9`,
              R`20 \times \frac{9}{4} = 45`],
          n: R`相似比が $a : b$ のとき、面積比は $a^{2} : b^{2}$ です。小さい方の面積 $20$ が $4$ にあたるので、大きい方（$9$ にあたる）の面積は $20 \times \dfrac{9}{4}$ です。`,
          easy: R`面積は「縦 × 横」のように長さを 2 回かけて決まるので、長さが $\dfrac{3}{2}$ 倍になると面積は $\left(\dfrac{3}{2}\right)^{2}=\dfrac{9}{4}$ 倍になります。たとえば縦も横も 2 倍の長方形の面積は $2 \times 2 = 4$ 倍です。ここでは $20 \times \dfrac{9}{4} = 45$ です。` }
      ],
      tags: ['相似', '平行線', '面積比']
    },

    {
      id: 'd-m-geo0-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-geo0',
      title: '円周角と中心角',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: figInscribed(),
      parts: [
        { label: '(1)', q: R`図のように、円 O の周上に 3 点 A, B, C があり、$\angle \mathrm{AOB} = 112\degree$ である。$\angle \mathrm{ACB}$ の大きさ（度）を求めよ。`, type: 'num', answer: 56, unit: '°' },
        { label: '(2)', q: R`円 O の直径を AB とし、円周上に A, B と異なる点 C をとる。$\angle \mathrm{CAB} = 38\degree$ のとき、$\angle \mathrm{ABC}$ の大きさ（度）を求めよ。`, type: 'num', answer: 52, unit: '°' }
      ],
      solution: [
        { t: '円周角は中心角の半分（(1)）',
          m: R`\angle \mathrm{ACB} = \frac{1}{2}\angle \mathrm{AOB} = \frac{1}{2} \times 112\degree = 56\degree`,
          n: R`同じ弧 AB に対する円周角 $\angle \mathrm{ACB}$ は、中心角 $\angle \mathrm{AOB}$ の半分です（円周角の定理）。`,
          easy: R`円周上の 1 点から弧 AB を見込む角が**円周角**、円の中心から見込む角が**中心角**です。同じ弧に対しては、いつも「円周角 ＝ 中心角の半分」になります。図では、中心 O から見た角が $112\degree$ なので、円の左の点 C から見た角は $112 \div 2 = 56\degree$ です。` },
        { t: '直径に対する円周角は 90°（(2)）',
          m: [R`\angle \mathrm{ACB} = 90\degree`,
              R`\angle \mathrm{ABC} = 180\degree - 90\degree - 38\degree = 52\degree`],
          n: R`直径 AB に対する中心角は $180\degree$ なので、円周角 $\angle \mathrm{ACB}$ は $90\degree$ です。三角形の内角の和は $180\degree$ です。`,
          easy: R`直径は円の中心を通るので、直径に対する中心角は真っすぐな角 $180\degree$ です。その半分で、直径 AB を見込む円周角 $\angle \mathrm{ACB}$ は必ず $90\degree$（直角）になります。あとは三角形 ABC の内角の和 $180\degree$ から、$90\degree$ と $38\degree$ を引くだけです。` }
      ],
      tags: ['円周角', '中心角', '直径']
    },

    /* ---------- 数と式（m-expr） ---------- */
    {
      id: 'd-m-expr-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-expr',
      title: '展開の公式',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の式を展開せよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$(3x - 2)^{2}$`, type: 'expr', answer: '9x^2-12x+4', vars: ['x'], show: R`9x^{2}-12x+4`, hint: R`例: x^2+2x+1` },
        { label: '(2)', q: R`$(x + 2)(x - 2)(x^{2} + 4)$`, type: 'expr', answer: 'x^4-16', vars: ['x'], show: R`x^{4}-16`, hint: R`累乗は ^ で入力` }
      ],
      solution: [
        { t: '$(a-b)^{2} = a^{2} - 2ab + b^{2}$ を使う（(1)）',
          m: R`(3x-2)^{2} = (3x)^{2} - 2 \cdot 3x \cdot 2 + 2^{2} = 9x^{2} - 12x + 4`,
          n: R`$a = 3x,\ b = 2$ として公式に代入します。真ん中の項 $-2ab$ を忘れないようにしましょう。`,
          easy: R`$(3x-2)^{2}$ は $(3x-2)(3x-2)$ のことです。かっこを開くと $9x^{2} - 6x - 6x + 4$ ですが、この形は $(a-b)^{2}=a^{2}-2ab+b^{2}$ の公式に当てはまります。「**1 つ目の 2 乗 − 2 × 1 つ目 × 2 つ目 + 2 つ目の 2 乗**」と覚えます。` },
        { t: '$(a+b)(a-b) = a^{2} - b^{2}$ を 2 回使う（(2)）',
          m: [R`(x+2)(x-2) = x^{2} - 4`,
              R`(x^{2}-4)(x^{2}+4) = (x^{2})^{2} - 4^{2} = x^{4} - 16`],
          n: R`先に $(x+2)(x-2)$ を計算すると $x^{2}-4$ になり、これと $x^{2}+4$ の積がまた和と差の積の形になります。`,
          easy: R`3 つのかっこがあるときは、**公式が使える 2 つを先に組み合わせる**と楽になります。$(x+2)(x-2)$ は「和と差の積」で $x^{2}-4$。残った $(x^{2}-4)(x^{2}+4)$ もまた「和と差の積」で、$(x^{2})^{2}-4^{2}=x^{4}-16$ です。順に全部かけるより、ずっと速く正確に計算できます。` }
      ],
      tags: ['展開', '乗法公式']
    },

    {
      id: 'd-m-expr-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-expr',
      title: '因数分解（たすき掛け）',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の式の因数分解について、空欄に入る式を答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$2x^{2} + 7x + 3 = (2x+1)(\boxed{\ \ })$`, type: 'expr', answer: 'x+3', vars: ['x'], show: R`x+3`, hint: R`例: x+5` },
        { label: '(2)', q: R`$6x^{2} - 11x - 10 = (3x+2)(\boxed{\ \ })$`, type: 'expr', answer: '2x-5', vars: ['x'], show: R`2x-5`, hint: R`例: 3x+4` }
      ],
      solution: [
        { t: '$2x^{2} + 7x + 3$ をたすき掛けで分ける（(1)）',
          m: [R`2x^{2} + 7x + 3 = (2x+1)(x+3)`,
              R`(2x+1)(x+3) = 2x^{2} + 6x + x + 3 = 2x^{2} + 7x + 3`],
          n: R`$2 = 2 \times 1$、$3 = 1 \times 3$ と分けて、斜めにかけて足した値が $x$ の係数 $7$ になる組を探します。$2 \times 3 + 1 \times 1 = 7$ なので $(2x+1)(x+3)$ です。展開して確かめます。`,
          easy: R`**たすき掛け**は「展開の逆」を探すパズルです。$(px+q)(rx+s)$ を展開すると、$x^{2}$ の係数は $pr$、定数項は $qs$、$x$ の係数は $ps+qr$ です。ここでは $pr=2,\ qs=3$ なので、$p=2,\ r=1$、$q=1,\ s=3$ とすると $ps+qr=2 \times 3+1 \times 1=7$ で一致します。` },
        { t: '$6x^{2} - 11x - 10$ をたすき掛けで分ける（(2)）',
          m: [R`6x^{2} - 11x - 10 = (3x+2)(2x-5)`,
              R`(3x+2)(2x-5) = 6x^{2} - 15x + 4x - 10 = 6x^{2} - 11x - 10`],
          n: R`$6 = 3 \times 2$、$-10 = 2 \times (-5)$ と分けると、斜めにかけて足した値が $3 \times (-5) + 2 \times 2 = -15 + 4 = -11$ となり、$x$ の係数に一致します。`,
          easy: R`定数項が負（$-10$）のときは、$2$ つの数の符号が違う組を考えます。$6=3 \times 2$ と $-10=2 \times (-5)$ を並べ、斜めにかけて足すと $3 \times (-5)+2 \times 2=-11$。これが真ん中の項の係数 $-11$ と同じなので、$(3x+2)(2x-5)$ とわかります。うまくいかないときは、組合せを変えて試します。` }
      ],
      tags: ['因数分解', 'たすき掛け']
    },

    {
      id: 'd-m-expr-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-expr',
      title: '平方根の計算',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の式を簡単にせよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\sqrt{12} + \dfrac{6}{\sqrt{3}}$`, type: 'num', answer: 4 * Math.sqrt(3), show: R`4\sqrt{3}`, hint: R`例: 5√7（5*sqrt(7) でも可）` },
        { label: '(2)', q: R`$(\sqrt{5} + \sqrt{2})^{2}$`, type: 'num', answer: 7 + 2 * Math.sqrt(10), show: R`7 + 2\sqrt{10}`, hint: R`例: 3+2√5（3+2*sqrt(5) でも可）` }
      ],
      solution: [
        { t: '根号の中を簡単にして、分母を有理化する（(1)）',
          m: [R`\sqrt{12} = \sqrt{4 \times 3} = 2\sqrt{3}, \qquad \frac{6}{\sqrt{3}} = \frac{6\sqrt{3}}{3} = 2\sqrt{3}`,
              R`2\sqrt{3} + 2\sqrt{3} = 4\sqrt{3}`],
          n: R`根号の中の数は、平方数（$4,\ 9,\ 16,\ \cdots$）を外に出して小さくします。分母に根号があるときは、分母と分子に同じ根号をかけて分母を整数にします（有理化）。`,
          easy: R`$\sqrt{12}$ の $12$ は $4 \times 3$ と分けられ、$\sqrt{4}=2$ は根号の外に出せます。だから $\sqrt{12}=2\sqrt{3}$。$\dfrac{6}{\sqrt{3}}$ は、分母の $\sqrt{3}$ をなくすために、分母と分子に $\sqrt{3}$ をかけます（$\sqrt{3} \times \sqrt{3}=3$）。すると $\dfrac{6\sqrt{3}}{3}=2\sqrt{3}$。同じ $\sqrt{3}$ を含む項は、$2$ 個と $2$ 個で $4$ 個分、$4\sqrt{3}$ とまとめられます。` },
        { t: '展開の公式 $(a+b)^{2}$ を使う（(2)）',
          m: R`(\sqrt{5}+\sqrt{2})^{2} = (\sqrt{5})^{2} + 2\sqrt{5}\sqrt{2} + (\sqrt{2})^{2} = 5 + 2\sqrt{10} + 2 = 7 + 2\sqrt{10}`,
          n: R`$(a+b)^{2} = a^{2}+2ab+b^{2}$ に $a=\sqrt{5},\ b=\sqrt{2}$ を代入します。$\sqrt{5}\sqrt{2}=\sqrt{10}$ です。`,
          easy: R`平方根も、ふつうの文字と同じように展開の公式が使えます。$(\sqrt{5})^{2}=5$（根号と 2 乗は打ち消し合う）、$(\sqrt{2})^{2}=2$、真ん中は $2 \times \sqrt{5} \times \sqrt{2}=2\sqrt{10}$。$5+2=7$ は整数どうし、$2\sqrt{10}$ は根号つきなので、そのまま $7+2\sqrt{10}$ と書きます（これ以上は足せません）。` }
      ],
      tags: ['平方根', '有理化', '展開']
    },

    /* ---------- 2次関数（m-quad） ---------- */
    {
      id: 'd-m-quad-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-quad',
      title: '平方完成と頂点',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`2次関数 $y = 2x^{2} + 8x + 3$ のグラフについて答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`頂点の $x$ 座標を求めよ。`, type: 'num', answer: -2 },
        { label: '(2)', q: R`頂点の $y$ 座標を求めよ。`, type: 'num', answer: -5 }
      ],
      solution: [
        { t: '平方完成する',
          m: [R`y = 2x^{2} + 8x + 3 = 2(x^{2} + 4x) + 3`,
              R`= 2\{(x+2)^{2} - 4\} + 3 = 2(x+2)^{2} - 5`],
          n: R`$x^{2}$ の係数 $2$ で $x$ の項をくくり、かっこの中を $(x+2)^{2}-4$ と変形します。最後に、くくり出した $2$ を $-4$ にかけるのを忘れないようにしましょう（$2 \times (-4) = -8$）。`,
          easy: R`**平方完成**は、$ax^{2}+bx+c$ を $a(x-p)^{2}+q$ の形に直すことです。手順は (1) $x^{2}$ の係数 $2$ で $x^{2}$ と $x$ の項をくくる、(2) かっこの中の $x$ の係数 $4$ の**半分 $2$** をとって $(x+2)^{2}$ を作り、はみ出した $2^{2}=4$ を引く、(3) 外に出した $2$ をかけて整理、です。結果は $y=2(x+2)^{2}-5$ です。` },
        { t: '頂点の座標を読み取る',
          m: R`y = 2(x - (-2))^{2} + (-5) \;\Rightarrow\; \text{頂点 } (-2,\ -5)`,
          n: R`$y = a(x-p)^{2} + q$ のグラフは、頂点が $(p,\ q)$ の放物線です。$p$ の符号に注意しましょう（$(x+2)^{2}$ なら $p=-2$）。`,
          easy: R`$(x-p)^{2}$ の形で見ると、$(x+2)^{2}$ は $p=-2$ です。「かっこの中の符号と、頂点の $x$ 座標の符号は逆」と覚えましょう。$(x+2)^{2}$ は $x=-2$ のとき $0$ になって一番小さくなるので、そこが頂点の位置です。そのときの $y$ の値が $-5$ です。図の曲線の一番下の点が頂点です。`,
          fig: figQuadVertex() }
      ],
      tags: ['平方完成', '頂点']
    },

    {
      id: 'd-m-quad-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-quad',
      title: '定義域つきの最大・最小',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`2次関数 $y = -x^{2} + 4x + 1$ $(0 \le x \le 3)$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`最大値を求めよ。`, type: 'num', answer: 5 },
        { label: '(2)', q: R`最小値を求めよ。`, type: 'num', answer: 1 }
      ],
      solution: [
        { t: '平方完成して軸と向きを調べる',
          m: R`y = -x^{2} + 4x + 1 = -(x-2)^{2} + 5`,
          n: R`$x^{2}$ の係数が負なので上に凸の放物線で、頂点 $(2,\ 5)$、軸 $x=2$ です。軸は区間 $0 \le x \le 3$ の中にあるので、最大値は頂点の $y$ 座標 $5$（$x=2$ のとき）です。`,
          easy: R`$x^{2}$ の係数が負のグラフは「山の形（上に凸）」です。山の頂上が頂点で、そこが一番高くなります。頂点の $x$ 座標 $2$ は範囲 $0 \le x \le 3$ に入っているので、頂上の高さ $5$ がそのまま最大値です。` },
        { t: '端点の値を比べて最小値を求める',
          m: [R`x = 0:\quad y = 1`,
              R`x = 3:\quad y = -9 + 12 + 1 = 4`],
          n: R`上に凸の山では、頂上から遠い端ほど低くなります。軸 $x=2$ からの距離は、$x=0$ が $2$、$x=3$ が $1$ なので、$x=0$ の方が低くなり、最小値は $1$ です。`,
          easy: R`山の形のグラフで一番低い所は、範囲の**どちらかの端**です。両方の端の高さを計算して、小さい方を選びましょう。$x=0$ のとき $1$、$x=3$ のとき $4$ なので、小さい方の $1$ が最小値です。図で、山の頂上から左右に下りていくようすを確認してみてください。`,
          fig: figQuadInterval() }
      ],
      tags: ['最大・最小', '定義域']
    },

    {
      id: 'd-m-quad-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-quad',
      title: '2次方程式の解',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の 2 次方程式を解き、大きい方の解を答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$2x^{2} - 5x - 3 = 0$`, type: 'num', answer: 3 },
        { label: '(2)', q: R`$x^{2} - 4x + 1 = 0$`, type: 'num', answer: 2 + Math.sqrt(3), show: R`2+\sqrt{3}`, hint: R`例: 3+2√5（3+2*sqrt(5) でも可）` }
      ],
      solution: [
        { t: '因数分解して解く（(1)）',
          m: [R`2x^{2} - 5x - 3 = (2x+1)(x-3)`,
              R`(2x+1)(x-3) = 0 \;\Rightarrow\; x = -\frac{1}{2},\ 3`],
          n: R`たすき掛けで因数分解します。「$A \times B = 0$ ならば $A = 0$ または $B = 0$」を使って解を求めます。大きい方は $x=3$ です。`,
          easy: R`2 次方程式は、左辺が因数分解できれば簡単に解けます。かけ算の答えが $0$ になるのは、どちらかが $0$ のときだけです。$2x+1=0$ なら $x=-\dfrac{1}{2}$、$x-3=0$ なら $x=3$。2 つの解のうち大きい方が答えです。` },
        { t: '解の公式を使う（(2)）',
          m: R`x = \frac{4 \pm \sqrt{16 - 4}}{2} = \frac{4 \pm 2\sqrt{3}}{2} = 2 \pm \sqrt{3}`,
          n: R`$x^{2} - 4x + 1 = 0$ は整数の範囲で因数分解できないので、解の公式 $x=\dfrac{-b\pm\sqrt{b^{2}-4ac}}{2a}$ を使います。$a=1,\ b=-4,\ c=1$ です。大きい方は $2+\sqrt{3}$ です。`,
          easy: R`因数分解できないときの「万能の道具」が**解の公式**です。$ax^{2}+bx+c=0$ の $a,\ b,\ c$ を公式に代入するだけで、必ず解が求まります。ここでは $b=-4$ なので $-b=4$、$\sqrt{b^{2}-4ac}=\sqrt{16-4}=\sqrt{12}=2\sqrt{3}$。最後に分母分子を $2$ で約分して $2\pm\sqrt{3}$ です。` }
      ],
      tags: ['2次方程式', '解の公式', '因数分解']
    },

    /* ---------- 図形と計量（m-trig1） ---------- */
    {
      id: 'd-m-trig1-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-trig1',
      title: '三角比の定義',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`図の直角三角形 ABC で、$\angle \mathrm{C} = 90\degree,\ \mathrm{AC} = 3,\ \mathrm{BC} = 2$ とする。$\angle \mathrm{A} = \theta$ とおくとき、次の値を求めよ。`,
      fig: figRightTri2(),
      parts: [
        { label: '(1)', q: R`$\tan\theta$`, type: 'num', answer: 2 / 3, show: R`\frac{2}{3}`, hint: R`例: 3/7` },
        { label: '(2)', q: R`$\sin\theta$`, type: 'num', answer: 2 / Math.sqrt(13), show: R`\frac{2\sqrt{13}}{13}`, hint: R`例: 3/sqrt(7) や 3√7/7` }
      ],
      solution: [
        { t: R`三角比の定義から $\tan\theta$（(1)）`,
          m: [R`\sin\theta = \frac{\text{対辺}}{\text{斜辺}}, \quad \cos\theta = \frac{\text{隣辺}}{\text{斜辺}}, \quad \tan\theta = \frac{\text{対辺}}{\text{隣辺}}`,
              R`\tan\theta = \frac{\mathrm{BC}}{\mathrm{AC}} = \frac{2}{3}`],
          n: R`角 $\theta = \angle \mathrm{A}$ から見て、向かい側の辺 BC が**対辺**、角のとなりにある辺 AC が**隣辺**、直角の向かい側の辺 AB が**斜辺**です。`,
          easy: R`三角比は「直角三角形の 2 辺の比」を、角の名前で表したものです。まず、調べたい角 $\theta$（点 A のところの角）を決めます。その角の向かい側にある辺が**対辺**（BC）、角に接していて斜辺でない方が**隣辺**（AC）、一番長い辺が**斜辺**（AB）です。$\tan\theta$ は「対辺 ÷ 隣辺」なので $2 \div 3$ です。`,
          pro: R`「$\sin$ は対辺 / 斜辺、$\cos$ は隣辺 / 斜辺、$\tan$ は対辺 / 隣辺」を頭文字の筆記体（s・c・t）の形で覚える人も多いです。` },
        { t: R`斜辺を求めて $\sin\theta$（(2)）`,
          m: [R`\mathrm{AB} = \sqrt{3^{2} + 2^{2}} = \sqrt{13}`,
              R`\sin\theta = \frac{\mathrm{BC}}{\mathrm{AB}} = \frac{2}{\sqrt{13}} = \frac{2\sqrt{13}}{13}`],
          n: R`斜辺 AB は三平方の定理で求めます。$\sin\theta$ は「対辺 ÷ 斜辺」で、分母の根号は有理化します。`,
          easy: R`$\sin\theta$ の分母は斜辺 AB ですが、図には長さが書かれていません。そこで三平方の定理（直角をはさむ 2 辺の 2 乗の和が斜辺の 2 乗）を使うと、$\mathrm{AB}^{2}=3^{2}+2^{2}=13$ から $\mathrm{AB}=\sqrt{13}$ とわかります。$\sin\theta=\dfrac{2}{\sqrt{13}}$ は、分母に根号があるので、分母分子に $\sqrt{13}$ をかけて $\dfrac{2\sqrt{13}}{13}$ とします。` }
      ],
      tags: ['三角比', '三平方の定理']
    },

    {
      id: 'd-m-trig1-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-trig1',
      title: '三角比の相互関係（鈍角）',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$\sin\theta = \dfrac{3}{5}$ $(90\degree < \theta < 180\degree)$ のとき、次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\cos\theta$`, type: 'num', answer: -4 / 5, show: R`-\frac{4}{5}`, hint: R`例: 5/2, -2.5（分数・小数どちらでも可。負の数は - をつける）` },
        { label: '(2)', q: R`$\tan\theta$`, type: 'num', answer: -3 / 4, show: R`-\frac{3}{4}`, hint: R`例: 5/2 や -7/3（負の数は - をつける）` }
      ],
      solution: [
        { t: R`$\sin^{2}\theta + \cos^{2}\theta = 1$ から $\cos\theta$ を求める（(1)）`,
          m: [R`\cos^{2}\theta = 1 - \sin^{2}\theta = 1 - \frac{9}{25} = \frac{16}{25}`,
              R`\cos\theta = \pm\frac{4}{5} \;\Rightarrow\; 90\degree < \theta < 180\degree \text{ より } \cos\theta < 0 \;\Rightarrow\; \cos\theta = -\frac{4}{5}`],
          n: R`$\cos^{2}\theta = \dfrac{16}{25}$ から $\cos\theta = \pm\dfrac{4}{5}$ の 2 つの候補が出ます。$\theta$ が鈍角（$90\degree$ より大きい）のときは $\cos\theta<0$ なので、負の方を選びます。`,
          easy: R`単位円（半径 $1$ の円）の上で角 $\theta$ の点をとると、その点の $x$ 座標が $\cos\theta$、$y$ 座標が $\sin\theta$ です。円周上の点は必ず $x^{2}+y^{2}=1$ を満たすので、$\sin^{2}\theta+\cos^{2}\theta=1$ が成り立ちます。ここから $\cos\theta$ は $\pm\dfrac{4}{5}$。$\theta$ が $90\degree$ より大きいと点は**左半分**にあり、$x$ 座標は負です。だから $\cos\theta=-\dfrac{4}{5}$ です。` },
        { t: R`$\tan\theta = \dfrac{\sin\theta}{\cos\theta}$ を使う（(2)）`,
          m: R`\tan\theta = \frac{\sin\theta}{\cos\theta} = \frac{3/5}{-4/5} = -\frac{3}{4}`,
          n: R`$\tan\theta$ は $\sin\theta$ を $\cos\theta$ で割った値です。分母が負なので、答えも負になります。`,
          easy: R`$\tan\theta$ は、角 $\theta$ の方向の直線の「傾き」にあたります。点 $\left(-\dfrac{4}{5},\ \dfrac{3}{5}\right)$ は左上にあるので、原点と結んだ線は右下がり（傾きは負）です。実際に $\dfrac{3}{5} \div \left(-\dfrac{4}{5}\right)=-\dfrac{3}{4}$ と負の値になります。` }
      ],
      tags: ['三角比の相互関係', '鈍角']
    },

    {
      id: 'd-m-trig1-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-trig1',
      title: '余弦定理・正弦定理',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`△ABC において、$\mathrm{BC} = a,\ \mathrm{CA} = b,\ \mathrm{AB} = c$、$\angle \mathrm{A} = A,\ \angle \mathrm{B} = B$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$b = 5,\ c = 8,\ A = 60\degree$ のとき、$a$ を求めよ。`, type: 'num', answer: 7 },
        { label: '(2)', q: R`$a = 6,\ A = 30\degree,\ B = 45\degree$ のとき、$b$ を求めよ。`, type: 'num', answer: 6 * Math.sqrt(2), show: R`6\sqrt{2}`, hint: R`例: 5√7（5*sqrt(7) でも可）` }
      ],
      solution: [
        { t: '2 辺とはさむ角 → 余弦定理（(1)）',
          m: [R`a^{2} = b^{2} + c^{2} - 2bc\cos A`,
              R`= 5^{2} + 8^{2} - 2 \cdot 5 \cdot 8 \cdot \cos 60\degree = 25 + 64 - 80 \cdot \frac{1}{2} = 49`,
              R`a = 7`],
          n: R`2 辺 $b,\ c$ とその間の角 $A$ が分かっているときは、残りの辺 $a$ を**余弦定理**で求めます。$a>0$ なので $a=7$ です。`,
          easy: R`余弦定理は「三平方の定理に、角度の補正 $-2bc\cos A$ をつけ加えたもの」です。$A=90\degree$ なら $\cos A=0$ で、三平方の定理そのものになります。$\cos 60\degree=\dfrac{1}{2}$ を使うと $80 \times \dfrac{1}{2}=40$ を引くことになり、$25+64-40=49$、よって $a=7$ です。` },
        { t: '1 辺と 2 つの角 → 正弦定理（(2)）',
          m: [R`\frac{a}{\sin A} = \frac{b}{\sin B}`,
              R`b = \frac{a\sin B}{\sin A} = \frac{6 \cdot \sin 45\degree}{\sin 30\degree} = \frac{6 \cdot \frac{\sqrt{2}}{2}}{\frac{1}{2}} = 6\sqrt{2}`],
          n: R`1 辺とその向かい側の角、ともう 1 つの角が分かっているときは**正弦定理** $\dfrac{a}{\sin A}=\dfrac{b}{\sin B}$ です。分母分子の関係を取りちがえないようにしましょう（辺とその向かいの角がペア）。`,
          easy: R`正弦定理は「辺の長さ ÷ その辺の向かい側の角の $\sin$」が、三角形のどの辺でも同じ値になる、という関係です。辺 $a$ と角 $A$、辺 $b$ と角 $B$ がペアです。$\sin 45\degree=\dfrac{\sqrt{2}}{2},\ \sin 30\degree=\dfrac{1}{2}$ を代入して $b$ を求めます。` }
      ],
      tags: ['余弦定理', '正弦定理']
    },

    /* ---------- データの分析（m-data） ---------- */
    {
      id: 'd-m-data-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-data',
      title: '平均値・中央値',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`8 人の生徒の小テストの得点（点）は次の通りである。

4, 6, 3, 9, 7, 5, 7, 12`,
      fig: null,
      parts: [
        { label: '(1)', q: R`平均値を求めよ。`, type: 'num', answer: 6.625, hint: R`例: 0.75 や 3/4` },
        { label: '(2)', q: R`中央値を求めよ。`, type: 'num', answer: 6.5 }
      ],
      solution: [
        { t: '平均値 = 合計 ÷ 個数（(1)）',
          m: R`\frac{4+6+3+9+7+5+7+12}{8} = \frac{53}{8} = 6.625`,
          n: R`8 人の得点の合計は $53$ 点です。人数 $8$ で割ります。`,
          easy: R`**平均値**は、全員の点数を足して人数で割った値で、「みんなが同じ点だったとしたら何点か」を表します。足し算の順番はバラバラのままで構いません（$4+6+3+9+7+5+7+12=53$）。$53 \div 8 = 6.625$ です。` },
        { t: '小さい順に並べて真ん中を見る（(2)）',
          m: [R`3,\ 4,\ 5,\ 6,\ 7,\ 7,\ 9,\ 12`,
              R`\frac{6+7}{2} = 6.5`],
          n: R`データを小さい順に並べます。個数が偶数（$8$ 個）のときは、真ん中の 2 つ（4 番目の $6$ と 5 番目の $7$）の平均が中央値です。`,
          easy: R`**中央値**は、データを小さい順に並べたときの「ちょうど真ん中」の値です。必ず**並べ替えてから**数えます。8 個のデータの真ん中は 4 番目と 5 番目の間なので、その 2 つ（$6$ と $7$）の平均 $6.5$ を中央値とします。個数が奇数のときは、真ん中の 1 つがそのまま中央値です。` }
      ],
      tags: ['平均値', '中央値']
    },

    {
      id: 'd-m-data-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-data',
      title: '分散と標準偏差',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`5 個のデータ $3,\ 4,\ 6,\ 7,\ 10$ について、分散と標準偏差を求める。分散は偏差の 2 乗の平均とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`分散を求めよ。`, type: 'num', answer: 6 },
        { label: '(2)', q: R`標準偏差を求めよ。`, type: 'num', answer: Math.sqrt(6), show: R`\sqrt{6}`, hint: R`例: √7 や 2.65` }
      ],
      solution: [
        { t: '平均と偏差から分散を求める（(1)）',
          m: [R`\bar{x} = \frac{3+4+6+7+10}{5} = 6`,
              R`s^{2} = \frac{(-3)^{2} + (-2)^{2} + 0^{2} + 1^{2} + 4^{2}}{5} = \frac{9+4+0+1+16}{5} = \frac{30}{5} = 6`],
          n: R`偏差（各データ − 平均）は $-3,\ -2,\ 0,\ 1,\ 4$ です。分散は偏差の 2 乗の平均です。`,
          easy: R`**分散**は、データが平均のまわりにどれだけ散らばっているかを表す数です。まず平均 $6$ を求め、各データが平均からどれだけずれているか（**偏差**）を出します。ずれをそのまま平均すると $+$ と $-$ が打ち消し合って $0$ になるので、**2 乗してから平均**します。` },
        { t: '標準偏差は分散の平方根（(2)）',
          m: R`s = \sqrt{s^{2}} = \sqrt{6} \fallingdotseq 2.45`,
          n: R`標準偏差は分散の正の平方根です。分散は 2 乗した値なので、もとのデータと同じ単位にそろえるために平方根をとります。`,
          easy: R`分散は「ずれの 2 乗」の平均なので、単位が 2 乗になってしまっています（たとえば点数のデータなら「点の 2 乗」）。そこで平方根をとってもとの単位にもどしたものが**標準偏差**です。ここでは $\sqrt{6}$（約 $2.45$ 点）が、データの典型的なばらつき具合です。` }
      ],
      tags: ['分散', '標準偏差']
    },

    {
      id: 'd-m-data-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-data',
      title: '四分位数と四分位範囲',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`9 個のデータ $2,\ 4,\ 5,\ 7,\ 8,\ 10,\ 12,\ 13,\ 17$ について答えよ。第 1 四分位数・第 3 四分位数は、中央値を除いた前半・後半のデータの中央値とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`第 1 四分位数を求めよ。`, type: 'num', answer: 4.5 },
        { label: '(2)', q: R`四分位範囲を求めよ。`, type: 'num', answer: 8 }
      ],
      solution: [
        { t: '中央値で前半と後半に分ける（(1)）',
          m: [R`\text{中央値 } 8 \;\Rightarrow\; \text{前半 } 2,\ 4,\ 5,\ 7 \quad \text{後半 } 10,\ 12,\ 13,\ 17`,
              R`Q_{1} = \frac{4+5}{2} = 4.5, \qquad Q_{3} = \frac{12+13}{2} = 12.5`],
          n: R`$9$ 個のデータの中央値は 5 番目の $8$ です。これを除いた前半 $4$ 個の中央値が第 1 四分位数 $Q_{1}$、後半 $4$ 個の中央値が第 3 四分位数 $Q_{3}$ です。`,
          easy: R`データを小さい順に並べて**4 等分**する区切りの値が四分位数です。真ん中の区切りが中央値（第 2 四分位数）、前半の真ん中が第 1 四分位数、後半の真ん中が第 3 四分位数です。この問題では、まず中央値 $8$ を見つけて、それを除いた前半 4 個（$2,\ 4,\ 5,\ 7$）と後半 4 個（$10,\ 12,\ 13,\ 17$）に分けます。それぞれの真ん中は、2 個の平均で求めます。` },
        { t: '四分位範囲 = $Q_{3} - Q_{1}$（(2)）',
          m: R`Q_{3} - Q_{1} = 12.5 - 4.5 = 8`,
          n: R`四分位範囲は、データの真ん中あたり半分が収まる範囲の幅です。極端に大きい（小さい）値の影響を受けにくいのが特徴です。`,
          easy: R`**四分位範囲**は、「真ん中の約半分のデータがどのくらいの幅に入っているか」を表します。最大値と最小値の差（範囲）は 1 つの極端な値に引っぱられますが、四分位範囲は外れ値の影響を受けにくいです。箱ひげ図の「箱の幅」にあたります。` }
      ],
      tags: ['四分位数', '四分位範囲', '箱ひげ図']
    },

    /* ---------- 場合の数・確率（m-prob） ---------- */
    {
      id: 'd-m-prob-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-prob',
      title: '順列と組合せ',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`7 人の中から人を選ぶ。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`3 人を選んで、1 位・2 位・3 位の順に並べる並べ方は何通りか。`, type: 'num', answer: 210 },
        { label: '(2)', q: R`3 人の代表を選ぶ選び方は何通りか。`, type: 'num', answer: 35 }
      ],
      solution: [
        { t: R`順番を区別する → 順列 $\P{7}{3}$（(1)）`,
          m: R`\P{7}{3} = 7 \times 6 \times 5 = 210`,
          n: R`1 位は 7 人から、2 位は残り 6 人から、3 位は残り 5 人から選びます。順位を区別するので「順列」です。`,
          easy: R`「1 位・2 位・3 位」のように順番に意味があるときは、順番ごとに何通りあるかを**かけ算**します。1 位の選び方は 7 通り、1 位が決まると 2 位の選び方は 6 通り、3 位は 5 通りです。だから $7 \times 6 \times 5=210$ 通りです。この「7 個から 3 個を取って並べる」数を $\P{7}{3}$ と書きます。` },
        { t: R`順番を区別しない → 組合せ $\C{7}{3}$（(2)）`,
          m: R`\C{7}{3} = \frac{\P{7}{3}}{3!} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35`,
          n: R`代表は順番を問わないので、同じ 3 人を並べ替えただけの $3!=6$ 通りが 1 通りと数えられます。したがって順列の数 $210$ を $3!$ で割ります。`,
          easy: R`代表は「誰が選ばれたか」だけが大事で、選ばれた順は関係ありません。たとえば A, B, C の 3 人を選ぶとき、(1) の数え方だと「ABC, ACB, BAC, BCA, CAB, CBA」の 6 通りが別々に数えられています。これを 1 通りにまとめるので、$210 \div 6=35$ です。この数を $\C{7}{3}$ と書きます。` }
      ],
      tags: ['順列', '組合せ']
    },

    {
      id: 'd-m-prob-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-prob',
      title: 'さいころの確率',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`大小 2 個のさいころを同時に投げる。次の確率を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`目の和が 8 以上になる確率`, type: 'num', answer: 5 / 12, show: R`\frac{5}{12}`, hint: R`例: 3/7` },
        { label: '(2)', q: R`目の積が 12 になる確率`, type: 'num', answer: 1 / 9, show: R`\frac{1}{9}`, hint: R`例: 3/7` }
      ],
      solution: [
        { t: '目の和が 8 以上の場合を数える（(1)）',
          m: [R`\text{全体は } 6 \times 6 = 36 \text{ 通り}`,
              R`\text{和が } 8,\ 9,\ 10,\ 11,\ 12: \quad 5 + 4 + 3 + 2 + 1 = 15`,
              R`\frac{15}{36} = \frac{5}{12}`],
          n: R`大小 2 個なので、(大, 小) の目の出方は $6 \times 6 = 36$ 通りで、どれも同じ確率で起こります。和が $8$ になるのは $(2,6),(3,5),(4,4),(5,3),(6,2)$ の $5$ 通り、$9$ は $4$ 通り、$10$ は $3$ 通り、$11$ は $2$ 通り、$12$ は $1$ 通りです。`,
          easy: R`確率は「あてはまる場合の数 ÷ 全部の場合の数」です。大小のさいころを区別すると、(大の目, 小の目) の組は全部で $36$ 通りあります。そのうち和が $8$ 以上になる組を数えます。和が大きい方から数えると、$12$ が 1 通り、$11$ が 2 通り、$10$ が 3 通り、$9$ が 4 通り、$8$ が 5 通りで合計 $15$ 通りです。` },
        { t: '目の積が 12 になる組を書き出す（(2)）',
          m: [R`(2,6),\ (3,4),\ (4,3),\ (6,2) \;\Rightarrow\; 4 \text{ 通り}`,
              R`\frac{4}{36} = \frac{1}{9}`],
          n: R`積が $12$ になる 2 つの目の組を書き出します。$(3,4)$ と $(4,3)$ は大小が入れかわった別の場合なので、2 通りと数えます。`,
          easy: R`積が $12$ になる組を 1 つずつ探します。$12=2 \times 6=3 \times 4$ で、さいころの目は $6$ までなので、この 2 通りだけです。ただし大と小を区別しているので、$(2,6)$ と $(6,2)$、$(3,4)$ と $(4,3)$ はそれぞれ別の場合です。合計 4 通りなので、確率は $\dfrac{4}{36}=\dfrac{1}{9}$ です。` }
      ],
      tags: ['確率', 'さいころ']
    },

    {
      id: 'd-m-prob-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-prob',
      title: '反復試行と余事象',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`1 個のさいころを 3 回投げる。次の確率を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`6 の目がちょうど 1 回出る確率`, type: 'num', answer: 25 / 72, show: R`\frac{25}{72}`, hint: R`例: 3/8（小数でも可）` },
        { label: '(2)', q: R`6 の目が少なくとも 1 回出る確率`, type: 'num', answer: 91 / 216, show: R`\frac{91}{216}`, hint: R`例: 3/8（小数でも可）` }
      ],
      solution: [
        { t: '反復試行の確率（(1)）',
          m: R`\C{3}{1} \cdot \frac{1}{6} \cdot \left(\frac{5}{6}\right)^{2} = 3 \times \frac{25}{216} = \frac{25}{72}`,
          n: R`3 回のうち 6 が出るのが何回目かの選び方が $\C{3}{1}=3$ 通り。そのどれも、確率は「6 が出る $\dfrac{1}{6}$」×「6 以外が 2 回 $\left(\dfrac{5}{6}\right)^{2}$」です。`,
          easy: R`「6 が出る」を○、「6 以外が出る」を×とすると、ちょうど 1 回だけ○になるのは「○××」「×○×」「××○」の 3 通りです。どれも確率は同じで、$\dfrac{1}{6} \times \dfrac{5}{6} \times \dfrac{5}{6}=\dfrac{25}{216}$。それが 3 通りあるので、$3 \times \dfrac{25}{216}=\dfrac{25}{72}$ です。` },
        { t: '「少なくとも 1 回」は余事象で考える（(2)）',
          m: R`1 - \left(\frac{5}{6}\right)^{3} = 1 - \frac{125}{216} = \frac{91}{216}`,
          n: R`「少なくとも 1 回 6 が出る」の反対は「1 回も 6 が出ない（3 回とも 6 以外）」で、その確率は $\left(\dfrac{5}{6}\right)^{3}$ です。全体の確率 $1$ からこれを引きます。`,
          easy: R`「少なくとも 1 回」を直接数えると、1 回・2 回・3 回の場合を全部足すことになり大変です。そこで、**反対のこと（1 回も出ない）の確率を $1$ から引く**（余事象）のが近道です。3 回とも 6 以外になる確率は $\dfrac{5}{6} \times \dfrac{5}{6} \times \dfrac{5}{6}=\dfrac{125}{216}$ で、$1-\dfrac{125}{216}=\dfrac{91}{216}$ です。` }
      ],
      tags: ['反復試行', '余事象']
    },

    /* ---------- 整数の性質（m-int） ---------- */
    {
      id: 'd-m-int-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-int',
      title: '最大公約数と最小公倍数',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$84$ と $126$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`最大公約数を求めよ。`, type: 'num', answer: 42 },
        { label: '(2)', q: R`最小公倍数を求めよ。`, type: 'num', answer: 252 }
      ],
      solution: [
        { t: '素因数分解して共通部分を取る（(1)）',
          m: [R`84 = 2^{2} \times 3 \times 7, \qquad 126 = 2 \times 3^{2} \times 7`,
              R`\text{最大公約数} = 2 \times 3 \times 7 = 42`],
          n: R`どちらにも含まれる素因数を、指数の小さい方に合わせて取り出してかけます（$2^{1},\ 3^{1},\ 7^{1}$）。`,
          easy: R`**素因数分解**は、数を素数（$2,\ 3,\ 5,\ 7,\ \cdots$）だけのかけ算に分けることです。$84=2 \times 2 \times 3 \times 7$、$126=2 \times 3 \times 3 \times 7$。**最大公約数**は「両方に共通して含まれる素数」を、少ない方の個数で取ってかけたものです。共通するのは $2$ が 1 個、$3$ が 1 個、$7$ が 1 個なので、$2 \times 3 \times 7=42$ です。` },
        { t: '素因数を指数の大きい方に合わせて取る（(2)）',
          m: [R`\text{最小公倍数} = 2^{2} \times 3^{2} \times 7 = 252`,
              R`42 \times 252 = 84 \times 126`],
          n: R`どちらかに含まれる素因数を、指数の大きい方に合わせてかけます。確認として、最大公約数 × 最小公倍数 = 2 数の積（$42 \times 252 = 84 \times 126 = 10584$）が成り立ちます。`,
          easy: R`**最小公倍数**は、両方の数の倍数になる最小の数です。素因数ごとに、「多い方の個数」を取ってかけます。$2$ は 84 に 2 個、126 に 1 個なので 2 個、$3$ は 1 個と 2 個なので 2 個、$7$ は 1 個です。だから $2 \times 2 \times 3 \times 3 \times 7=252$ です。` }
      ],
      tags: ['最大公約数', '最小公倍数', '素因数分解']
    },

    {
      id: 'd-m-int-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-int',
      title: '約数の個数と平方数',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$360 = 2^{3} \times 3^{2} \times 5$ である。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$360$ の正の約数は全部で何個か。`, type: 'num', answer: 24 },
        { label: '(2)', q: R`$\sqrt{360n}$ が自然数となる最小の自然数 $n$ を求めよ。`, type: 'num', answer: 10 }
      ],
      solution: [
        { t: '約数の個数 = (指数 + 1) の積（(1)）',
          m: R`(3+1)(2+1)(1+1) = 4 \times 3 \times 2 = 24`,
          n: R`約数は、素因数 $2$ を $0 \sim 3$ 個（4 通り）、$3$ を $0 \sim 2$ 個（3 通り）、$5$ を $0 \sim 1$ 個（2 通り）選んでかけたものです。選び方の総数は $4 \times 3 \times 2$ です。`,
          easy: R`$360$ の約数は「$2$ を何個、$3$ を何個、$5$ を何個使うか」を決めると 1 つ決まります。$2$ は $0,1,2,3$ 個の **4 通り**、$3$ は $0,1,2$ 個の **3 通り**、$5$ は $0,1$ 個の **2 通り**。これらはどれを選んでもよいので、全部かけて $4 \times 3 \times 2=24$ 個です。` },
        { t: '平方数 → すべての素因数の指数が偶数（(2)）',
          m: [R`360n = 2^{3} \times 3^{2} \times 5 \times n`,
              R`n = 2 \times 5 = 10 \;\Rightarrow\; 360 \times 10 = 3600 = 60^{2}`],
          n: R`$\sqrt{360n}$ が自然数になるのは、$360n$ が平方数（ある自然数の 2 乗）のときです。平方数は、素因数分解したときすべての指数が偶数になります。$2^{3}$ と $5^{1}$ の指数が奇数なので、$2$ と $5$ を 1 個ずつ足せばよく、最小の $n=2 \times 5=10$ です。`,
          easy: R`平方数（$4,\ 9,\ 36,\ \cdots$）は、同じ数 2 個のかけ算で作れる数なので、素因数分解すると**すべての素数が偶数個**ずつ並びます（たとえば $36=2^{2} \times 3^{2}$）。$360=2^{3} \times 3^{2} \times 5$ では、$2$ が 3 個（奇数）、$5$ が 1 個（奇数）なので、あと $2$ と $5$ を 1 個ずつかければ全部偶数個になります。$n=2 \times 5=10$ です。` }
      ],
      tags: ['約数の個数', '平方数', '素因数分解']
    },

    {
      id: 'd-m-int-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-int',
      title: '余りの計算',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$7^{100}$ を $5$ で割った余りを求めよ。`, type: 'num', answer: 1 },
        { label: '(2)', q: R`整数 $n$ を $7$ で割ると $4$ 余る。$n^{2}$ を $7$ で割った余りを求めよ。`, type: 'num', answer: 2 }
      ],
      solution: [
        { t: '余りのくり返し（周期）を見つける（(1)）',
          m: [R`7^{1} \to 2, \quad 7^{2} = 49 \to 4, \quad 7^{3} = 343 \to 3, \quad 7^{4} = 2401 \to 1 \quad (\text{5 で割った余り})`,
              R`7^{100} = (7^{4})^{25} \;\Rightarrow\; \text{余りは } 1^{25} = 1`],
          n: R`5 で割った余りは、$2,\ 4,\ 3,\ 1$ と 4 回ごとにくり返します。$7^{4}$ を 5 で割ると $1$ 余るので、$7^{100}=(7^{4})^{25}$ の余りは $1^{25}=1$ です。`,
          easy: R`大きな累乗は、まず小さい指数で余りを調べて、**くり返しのパターン**を探します。$7^{1}$ から $7^{4}$ までの余りは $2,\ 4,\ 3,\ 1$ で、$7^{4}$ で余りが $1$ にもどっています。「余り $1$」は何回かけても $1$ のままなので、$7^{4}$ を 25 個かけた $7^{100}$ の余りも $1$ です。` },
        { t: '$n = 7k + 4$ とおいて計算する（(2)）',
          m: R`n = 7k + 4 \;\Rightarrow\; n^{2} = (7k+4)^{2} = 49k^{2} + 56k + 16 = 7(7k^{2} + 8k + 2) + 2`,
          n: R`$7$ で割って $4$ 余る整数は、整数 $k$ を使って $n=7k+4$ と表せます。2 乗して展開し、$7$ の倍数の部分をくくり出すと、余りが $2$ だと分かります。`,
          easy: R`「$7$ で割ると $4$ 余る」は、「$7$ の倍数に $4$ を足した数」という意味です。式で書くと $n=7k+4$（$k$ は整数）です。これを 2 乗して展開すると、$49k^{2}+56k$ は $7$ の倍数、残りの $16$ を $7$ で割ると $2$ 余る（$16=7 \times 2+2$）ので、全体の余りは $2$ です。` }
      ],
      tags: ['余り', '合同式', '累乗']
    },

    /* ---------- 図形の性質（m-geo） ---------- */
    {
      id: 'd-m-geo-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-geo',
      title: '角の二等分線と重心',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`△ABC で $\mathrm{AB} = 6,\ \mathrm{AC} = 9,\ \mathrm{BC} = 10$ とする。$\angle \mathrm{A}$ の二等分線と辺 BC の交点を D とするとき、BD の長さを求めよ。`, type: 'num', answer: 4 },
        { label: '(2)', q: R`別の三角形 PQR で、辺 QR の中点を M、重心を G とする。$\mathrm{PM} = 12$ のとき、PG の長さを求めよ。`, type: 'num', answer: 8 }
      ],
      solution: [
        { t: R`角の二等分線は、対辺を「となり合う 2 辺の比」に分ける（(1)）`,
          m: [R`\mathrm{BD} : \mathrm{DC} = \mathrm{AB} : \mathrm{AC} = 6 : 9 = 2 : 3`,
              R`\mathrm{BD} = 10 \times \frac{2}{2+3} = 4`],
          n: R`$\angle \mathrm{A}$ の二等分線 AD は、辺 BC を $\mathrm{AB} : \mathrm{AC}$ の比に分けます。$\mathrm{BC} = 10$ を $2 : 3$ に分けると、$\mathrm{BD}$ は全体の $\dfrac{2}{5}$ です。`,
          easy: R`角を 2 等分する線を引くと、向かい側の辺 BC が「角をはさむ 2 辺の長さの比」に分かれます。「長い辺（AC）の側ほど長く分かれる」と覚えます。$\mathrm{AB} : \mathrm{AC}=6 : 9=2 : 3$ なので、$\mathrm{BC}=10$ を $2 : 3$ に分けます。全体を $2+3=5$ 個分とみると、BD は $2$ 個分で $10 \times \dfrac{2}{5}=4$ です。` },
        { t: R`重心は中線を $2 : 1$ に内分する（(2)）`,
          m: [R`\mathrm{PG} : \mathrm{GM} = 2 : 1`,
              R`\mathrm{PG} = 12 \times \frac{2}{3} = 8`],
          n: R`三角形の重心は、3 本の中線（頂点と向かい側の辺の中点を結ぶ線）の交点で、各中線を頂点側から $2 : 1$ に分けます。`,
          easy: R`**重心**は、三角形を針の先でちょうどつり合わせられる点です。頂点 P と向かい側の辺の中点 M を結んだ中線 PM を、重心 G は **P に近い側が 2、M に近い側が 1** の比に分けます。PM 全体が $12$ なら、$3$ 等分して 2 個分が PG なので、$12 \times \dfrac{2}{3}=8$ です。` }
      ],
      tags: ['角の二等分線', '重心']
    },

    {
      id: 'd-m-geo-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-geo',
      title: '方べきの定理',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`円の外部の点 P から、この円と 2 点 A, B で交わる直線と、2 点 C, D で交わる直線を引く（図）。$\mathrm{PA} = 3,\ \mathrm{AB} = 5,\ \mathrm{PC} = 4$ とする。`,
      fig: figSecants(),
      parts: [
        { label: '(1)', q: R`PD の長さを求めよ。`, type: 'num', answer: 6 },
        { label: '(2)', q: R`P からこの円に引いた接線の接点を T とするとき、PT の長さを求めよ。`, type: 'num', answer: 2 * Math.sqrt(6), show: R`2\sqrt{6}`, hint: R`例: 5√7（5*sqrt(7) でも可）` }
      ],
      solution: [
        { t: R`方べきの定理：$\mathrm{PA} \cdot \mathrm{PB} = \mathrm{PC} \cdot \mathrm{PD}$（(1)）`,
          m: [R`\mathrm{PA} \cdot \mathrm{PB} = \mathrm{PC} \cdot \mathrm{PD}`,
              R`3 \times 8 = 4 \times \mathrm{PD} \;\Rightarrow\; \mathrm{PD} = 6`],
          n: R`$\mathrm{PB} = \mathrm{PA} + \mathrm{AB} = 3 + 5 = 8$ です。外部の点 P から引いた 2 本の割線について、「P から近い交点までの距離 × P から遠い交点までの距離」は、どちらの割線でも等しくなります。`,
          easy: R`円の外の 1 点 P から、円と交わる直線を何本引いても、「**P から手前の交点までの長さ × P から奥の交点までの長さ**」は同じ値になります。これが**方べきの定理**です。1 本目の積は $3 \times 8=24$（奥の交点 B は P から $3+5=8$ の位置です）。2 本目も積が $24$ なので、$4 \times \mathrm{PD}=24$、$\mathrm{PD}=6$ です。` },
        { t: R`接線の場合：$\mathrm{PT}^{2} = \mathrm{PA} \cdot \mathrm{PB}$（(2)）`,
          m: R`\mathrm{PT}^{2} = \mathrm{PA} \cdot \mathrm{PB} = 3 \times 8 = 24 \;\Rightarrow\; \mathrm{PT} = 2\sqrt{6}`,
          n: R`接線は、2 つの交点が 1 点に重なった割線とみなせるので、「$\mathrm{PT} \times \mathrm{PT}$」が割線の積に等しくなります。`,
          easy: R`P から円に接する直線（接線）を引くと、円とは接点 T の 1 点でしか交わりません。この場合は「手前の交点」も「奥の交点」も同じ点 T なので、積は $\mathrm{PT} \times \mathrm{PT}=\mathrm{PT}^{2}$ になります。方べきの定理の積 $24$ に等しいので、$\mathrm{PT}=\sqrt{24}=2\sqrt{6}$ です。` }
      ],
      tags: ['方べきの定理', '接線']
    },

    {
      id: 'd-m-geo-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-geo',
      title: '内心・外心と角',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`△ABC において $\angle \mathrm{A} = 70\degree$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`△ABC の内心を I とするとき、$\angle \mathrm{BIC}$ の大きさ（度）を求めよ。`, type: 'num', answer: 125, unit: '°' },
        { label: '(2)', q: R`△ABC の外心を O とするとき、$\angle \mathrm{BOC}$ の大きさ（度）を求めよ。`, type: 'num', answer: 140, unit: '°' }
      ],
      solution: [
        { t: R`内心 = 角の二等分線の交点（(1)）`,
          m: [R`\angle \mathrm{IBC} + \angle \mathrm{ICB} = \frac{\angle \mathrm{B} + \angle \mathrm{C}}{2} = \frac{180\degree - 70\degree}{2} = 55\degree`,
              R`\angle \mathrm{BIC} = 180\degree - 55\degree = 125\degree`],
          n: R`内心 I は 3 つの内角の二等分線の交点なので、$\angle \mathrm{IBC} = \dfrac{\angle \mathrm{B}}{2}$、$\angle \mathrm{ICB} = \dfrac{\angle \mathrm{C}}{2}$ です。$\angle \mathrm{B} + \angle \mathrm{C} = 180\degree - \angle \mathrm{A} = 110\degree$、三角形 IBC の内角の和から $\angle \mathrm{BIC}$ を求めます。`,
          easy: R`**内心**は、3 つの角を 2 等分する線が交わる点で、三角形に内接する円の中心です。三角形 ABC の内角の和は $180\degree$ なので、$\angle \mathrm{B}+\angle \mathrm{C}=110\degree$。内心から見ると、B と C の角はそれぞれ半分になるので、小さな三角形 IBC では $\dfrac{110\degree}{2}=55\degree$ が 2 つの底角の和になります。残りの $\angle \mathrm{BIC}$ は $180\degree-55\degree=125\degree$ です。`,
          pro: R`$\angle \mathrm{BIC} = 90\degree + \dfrac{\angle \mathrm{A}}{2} = 90\degree + 35\degree = 125\degree$ と公式で一気に出せる。` },
        { t: R`外心 → 円周角の定理（(2)）`,
          m: R`\angle \mathrm{BOC} = 2\angle \mathrm{A} = 2 \times 70\degree = 140\degree`,
          n: R`外心 O は 3 つの頂点を通る円（外接円）の中心です。弧 BC に対する円周角が $\angle \mathrm{A}$、中心角が $\angle \mathrm{BOC}$ なので、中心角は円周角の 2 倍です。`,
          easy: R`**外心**は、3 つの頂点 A, B, C を通る円の中心です。この円で、弧 BC を点 A から見た角（円周角）が $70\degree$、中心 O から見た角（中心角）が $\angle \mathrm{BOC}$ です。同じ弧に対する中心角は円周角の 2 倍なので、$70\degree \times 2=140\degree$ です。` }
      ],
      tags: ['内心', '外心', '円周角']
    },

    /* ---------- 式と証明（m-proof） ---------- */
    {
      id: 'd-m-proof-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-proof',
      title: '二項定理',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の展開式の係数を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$(x+2)^{5}$ の展開式における $x^{3}$ の係数`, type: 'num', answer: 40 },
        { label: '(2)', q: R`$(3x-1)^{4}$ の展開式における $x^{2}$ の係数`, type: 'num', answer: 54 }
      ],
      solution: [
        { t: R`一般項を使う（(1)）`,
          m: [R`(x+2)^{5} \text{ の一般項: } \C{5}{k}\, x^{5-k} \cdot 2^{k}`,
              R`x^{3} \text{ の項は } 5 - k = 3 \text{ より } k = 2: \quad \C{5}{2} \cdot 2^{2} = 10 \times 4 = 40`],
          n: R`二項定理 $(a+b)^{n} = \sum_{k=0}^{n}\C{n}{k}a^{n-k}b^{k}$ の $a=x,\ b=2,\ n=5$ の場合です。$x$ の次数が $3$ になるのは $x^{5-k}$ の $5-k=3$ のとき、つまり $k=2$ です。`,
          easy: R`$(x+2)^{5}$ は「$(x+2)$ を 5 個かけたもの」です。5 個のかっこから、$2$ を何個選ぶかで項が決まります。$x^{3}$ の項は「$x$ を 3 個、$2$ を 2 個選ぶ」ときで、その選び方が $\C{5}{2}=10$ 通り、選んだ $2$ をかけると $2^{2}=4$。係数は $10 \times 4=40$ です。` },
        { t: R`負の項があるときは符号に注意（(2)）`,
          m: [R`(3x-1)^{4} \text{ の一般項: } \C{4}{k}(3x)^{4-k}(-1)^{k}`,
              R`x^{2} \text{ の項は } 4 - k = 2 \text{ より } k = 2: \quad \C{4}{2}\, 3^{2} (-1)^{2} = 6 \times 9 \times 1 = 54`],
          n: R`$a=3x,\ b=-1$ とみて、一般項に代入します。$(3x)^{4-k}$ の係数は $3^{4-k}$ になること、$(-1)^{k}$ の符号を忘れないことがポイントです。`,
          easy: R`かっこの中身が $3x$ や $-1$ のときは、「$3$ を何乗するか」「$-1$ を何乗するか」を別に計算してかけます。$x^{2}$ の項は、$(3x)$ を 2 個、$(-1)$ を 2 個選ぶときで、選び方 $\C{4}{2}=6$ 通り、$(3x)^{2}=9x^{2}$、$(-1)^{2}=1$。係数は $6 \times 9 \times 1=54$ です。` }
      ],
      tags: ['二項定理', '展開式の係数']
    },

    {
      id: 'd-m-proof-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-proof',
      title: '恒等式の係数決定',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`$x^{2} + 5x + 7 = a(x-1)^{2} + b(x-1) + c$ が $x$ についての恒等式であるとき、次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$b$ の値`, type: 'num', answer: 7 },
        { label: '(2)', q: R`$c$ の値`, type: 'num', answer: 13 }
      ],
      solution: [
        { t: R`右辺を展開して係数を比べる`,
          m: [R`a(x-1)^{2} + b(x-1) + c = ax^{2} + (-2a + b)x + (a - b + c)`,
              R`a = 1, \qquad -2a + b = 5, \qquad a - b + c = 7`],
          n: R`恒等式は、どんな $x$ でも成り立つ式です。右辺を $x$ について整理し、$x^{2},\ x$、定数項の係数を左辺と比べます。`,
          easy: R`「$x$ についての恒等式」とは、$x$ にどんな数を入れても両辺が等しくなる式のことです。そうなるには、両辺を $x^{2}$、$x$、数の順にそろえたとき、**同じ位置の係数がすべて等しい**必要があります。右辺の $(x-1)^{2}=x^{2}-2x+1$ を展開して $x^{2}$ の係数・$x$ の係数・定数項を並べ、左辺の $1,\ 5,\ 7$ と比べます。` },
        { t: R`連立して $b,\ c$ を求める`,
          m: [R`-2 \times 1 + b = 5 \;\Rightarrow\; b = 7`,
              R`1 - 7 + c = 7 \;\Rightarrow\; c = 13`],
          n: R`$a=1$ を 2 番目の式に代入して $b=7$、さらに 3 番目の式に代入して $c=13$ です。（別解）$x=1$ を代入すると右辺は $c$ だけが残り、左辺は $1+5+7=13$ なので $c=13$ とすぐ分かります。`,
          easy: R`$a$ は $x^{2}$ の係数の比較から $1$ とすぐ決まります。次に $x$ の係数の式に $a=1$ を入れて $b$ を、最後に定数項の式に $a,\ b$ を入れて $c$ を求めます。ちなみに、$x=1$ を左辺に代入すると $1+5+7=13$、右辺は $(x-1)$ の項が消えて $c$ だけになるので、$c=13$ は一瞬で分かります（数値代入法）。` }
      ],
      tags: ['恒等式', '係数比較']
    },

    {
      id: 'd-m-proof-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-proof',
      title: '相加相乗平均・剰余の定理',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$x > 0$ のとき、$x + \dfrac{4}{x}$ の最小値を求めよ。`, type: 'num', answer: 4 },
        { label: '(2)', q: R`多項式 $P(x) = x^{3} - 2x^{2} + ax + 6$ が $x - 3$ で割り切れるように、定数 $a$ の値を定めよ。`, type: 'num', answer: -5 }
      ],
      solution: [
        { t: R`相加平均 $\ge$ 相乗平均（(1)）`,
          m: [R`x + \frac{4}{x} \ge 2\sqrt{x \cdot \frac{4}{x}} = 2\sqrt{4} = 4`,
              R`\text{等号は } x = \frac{4}{x},\ \text{すなわち } x = 2\ (>0) \text{ のとき成立}`],
          n: R`$a>0,\ b>0$ のとき $a+b \ge 2\sqrt{ab}$ が成り立ちます。ここでは $a=x,\ b=\dfrac{4}{x}$ で、積 $ab=4$ が定数になっています。等号が成り立つ $x=2$ が $x>0$ に含まれているので、最小値は $4$ です。`,
          easy: R`2 つの正の数 $a,\ b$ を足した値は、かけた値の平方根の 2 倍 $2\sqrt{ab}$ より小さくなることはありません（**相加平均 $\ge$ 相乗平均**）。この問題では 2 つの数 $x$ と $\dfrac{4}{x}$ をかけると $4$ で一定なので、足した値は $2\sqrt{4}=4$ 以上です。$x=\dfrac{4}{x}$ となる $x=2$ のときにちょうど $4$ になります。` },
        { t: R`剰余の定理 $P(3)=0$（(2)）`,
          m: R`P(3) = 27 - 18 + 3a + 6 = 3a + 15 = 0 \;\Rightarrow\; a = -5`,
          n: R`$P(x)$ が $x-3$ で割り切れる $\iff$ $P(3)=0$ です（因数定理）。$x=3$ を代入して $a$ について解きます。`,
          easy: R`「$x-3$ で割り切れる」とは、「$P(x)=(x-3) \times (\text{ある式})$ と書ける」ということです。この式で $x=3$ を代入すると $(x-3)$ が $0$ になるので、$P(3)=0$ になります。逆に $P(3)=0$ なら割り切れます。そこで $x=3$ を代入して $0$ になるように $a$ を決めます。` }
      ],
      tags: ['相加相乗平均', '因数定理']
    },

    /* ---------- 複素数と方程式（m-complex） ---------- */
    {
      id: 'd-m-complex-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-complex',
      title: '複素数の計算',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$(2 + 3i)(1 - i)$ を計算して $a + bi$ の形に表す（$a,\ b$ は実数、$i$ は虚数単位）。次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`実部 $a$`, type: 'num', answer: 5 },
        { label: '(2)', q: R`虚部 $b$`, type: 'num', answer: 1 }
      ],
      solution: [
        { t: R`展開して $i^{2} = -1$ を使う`,
          m: [R`(2+3i)(1-i) = 2 - 2i + 3i - 3i^{2}`,
              R`= 2 + i + 3 = 5 + i`],
          n: R`ふつうの文字式と同じように展開し、$i^{2}$ が出てきたら $-1$ に置きかえます。$-3i^{2} = -3 \times (-1) = +3$ です。`,
          easy: R`**虚数単位 $i$** は「2 乗すると $-1$ になる数」($i^{2}=-1$) です。複素数のかけ算は、$i$ を 1 つの文字だと思って展開するだけでOK。ただし $i^{2}$ が出てきたら $-1$ に置きかえます。展開すると $2-2i+3i-3i^{2}$。$-2i+3i=i$、$-3i^{2}=3$ なので、$2+3+i=5+i$ になります。` },
        { t: R`実部と虚部を読み取る`,
          m: R`5 + i = 5 + 1 \cdot i \;\Rightarrow\; a = 5,\quad b = 1`,
          n: R`$a+bi$ の $a$ を**実部**、$b$ を**虚部**といいます。虚部は $i$ の係数なので、$i$ を含みません（虚部は $1$ であって $i$ ではありません）。`,
          easy: R`複素数 $a+bi$ では、$i$ がついていない部分 $a$ が**実部**、$i$ にかかっている数 $b$ が**虚部**です。$5+i$ は $5+1 \times i$ と書けるので、実部は $5$、虚部は $1$ です。虚部は「$i$ をふくまない実数」なので、「$i$」と答えないように注意してください。` }
      ],
      tags: ['複素数', '虚数単位']
    },

    {
      id: 'd-m-complex-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-complex',
      title: '2次方程式の虚数解',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`2次方程式 $x^{2} - 2x + 5 = 0$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`判別式 $D$ の値を求めよ。`, type: 'num', answer: -16 },
        { label: '(2)', q: R`解のうち、虚部が正であるものの虚部を求めよ。`, type: 'num', answer: 2 }
      ],
      solution: [
        { t: R`判別式 $D = b^{2} - 4ac$ を計算する（(1)）`,
          m: R`D = (-2)^{2} - 4 \cdot 1 \cdot 5 = 4 - 20 = -16`,
          n: R`$D<0$ なので、この方程式は実数の解をもたず、2 つの虚数解をもちます。`,
          easy: R`**判別式** $D=b^{2}-4ac$ は、2 次方程式 $ax^{2}+bx+c=0$ の解の種類を教えてくれる値です。解の公式の根号の中身にあたります。$D>0$ なら異なる 2 つの実数解、$D=0$ なら重解、**$D<0$ なら虚数解**です。ここでは $a=1,\ b=-2,\ c=5$ を代入して $D=-16<0$。実数の解はありません。` },
        { t: R`解の公式で虚数解を求める（(2)）`,
          m: R`x = \frac{2 \pm \sqrt{-16}}{2} = \frac{2 \pm 4i}{2} = 1 \pm 2i`,
          n: R`$\sqrt{-16} = \sqrt{16}\,i = 4i$ です。解は $1+2i,\ 1-2i$ で、虚部が正の方 $1+2i$ の虚部は $2$ です。`,
          easy: R`負の数の平方根は、虚数単位 $i$ を使って表します。$\sqrt{-16}=\sqrt{16} \times \sqrt{-1}=4i$ です。解の公式にそのまま代入すると $\dfrac{2 \pm 4i}{2}=1 \pm 2i$ で、解は 2 つ（$1+2i$ と $1-2i$）あります。虚部は $i$ の係数なので、$1+2i$ の虚部は $2$ です。` }
      ],
      tags: ['判別式', '虚数解']
    },

    {
      id: 'd-m-complex-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-complex',
      title: '解と係数の関係',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`2次方程式 $x^{2} - 5x + 3 = 0$ の 2 つの解を $\alpha,\ \beta$ とする。次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\alpha^{2} + \beta^{2}$`, type: 'num', answer: 19 },
        { label: '(2)', q: R`$\dfrac{1}{\alpha} + \dfrac{1}{\beta}$`, type: 'num', answer: 5 / 3, show: R`\frac{5}{3}`, hint: R`例: 3/7` }
      ],
      solution: [
        { t: R`解の和と積を求める`,
          m: R`\alpha + \beta = -\frac{-5}{1} = 5, \qquad \alpha\beta = \frac{3}{1} = 3`,
          n: R`2 次方程式 $ax^{2}+bx+c=0$ の 2 つの解 $\alpha,\ \beta$ について、$\alpha+\beta=-\dfrac{b}{a},\ \alpha\beta=\dfrac{c}{a}$ が成り立ちます（解と係数の関係）。解そのものを求めなくても、和と積が分かります。`,
          easy: R`2 次方程式の 2 つの解を $\alpha,\ \beta$ とすると、$ax^{2}+bx+c=a(x-\alpha)(x-\beta)$ と因数分解できます。右辺を展開すると $x$ の係数は $-a(\alpha+\beta)$、定数項は $a\alpha\beta$。左辺と比べると、$\alpha+\beta=-\dfrac{b}{a}$、$\alpha\beta=\dfrac{c}{a}$ が出ます。ここでは $a=1,\ b=-5,\ c=3$ なので、和は $5$、積は $3$ です。` },
        { t: R`和と積で表して計算する`,
          m: [R`\alpha^{2} + \beta^{2} = (\alpha+\beta)^{2} - 2\alpha\beta = 5^{2} - 2 \times 3 = 19`,
              R`\frac{1}{\alpha} + \frac{1}{\beta} = \frac{\alpha + \beta}{\alpha\beta} = \frac{5}{3}`],
          n: R`(1) は $(\alpha+\beta)^{2}$ の展開式から、(2) は通分することで、どちらも「和と積」だけで表せます。`,
          easy: R`解の値が複雑でも、**和 $\alpha+\beta$ と積 $\alpha\beta$ だけで表せる式**なら、解を求めずに値が出せます。(1) は $(\alpha+\beta)^{2}=\alpha^{2}+2\alpha\beta+\beta^{2}$ を変形して $\alpha^{2}+\beta^{2}=(\alpha+\beta)^{2}-2\alpha\beta$。(2) は通分すると $\dfrac{\beta+\alpha}{\alpha\beta}$ になり、和 ÷ 積です。` }
      ],
      tags: ['解と係数の関係', '対称式']
    },

    /* ---------- 図形と方程式（m-coord） ---------- */
    {
      id: 'd-m-coord-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-coord',
      title: '2点間の距離と内分点',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`2 点 $\mathrm{A}(-2,\ 1),\ \mathrm{B}(7,\ 13)$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`線分 AB の長さを求めよ。`, type: 'num', answer: 15 },
        { label: '(2)', q: R`線分 AB を $1 : 2$ に内分する点 P の $y$ 座標を求めよ。`, type: 'num', answer: 5 }
      ],
      solution: [
        { t: R`2 点間の距離の公式（(1)）`,
          m: R`\mathrm{AB} = \sqrt{(7-(-2))^{2} + (13-1)^{2}} = \sqrt{81 + 144} = \sqrt{225} = 15`,
          n: R`2 点 $(x_{1},\ y_{1}),\ (x_{2},\ y_{2})$ の距離は $\sqrt{(x_{2}-x_{1})^{2}+(y_{2}-y_{1})^{2}}$ です。`,
          easy: R`2 点間の距離は、**横の差と縦の差を 2 辺とする直角三角形の斜辺**です。横の差は $7-(-2)=9$、縦の差は $13-1=12$。三平方の定理で $\sqrt{9^{2}+12^{2}}=\sqrt{225}=15$ です。差を計算するとき、マイナスの座標の引き算（$7-(-2)=9$）の符号ミスに注意しましょう。` },
        { t: R`内分点の公式（(2)）`,
          m: [R`y = \frac{2 \times 1 + 1 \times 13}{1 + 2} = \frac{15}{3} = 5`,
              R`x = \frac{2 \times (-2) + 1 \times 7}{1 + 2} = 1 \;\Rightarrow\; \mathrm{P}(1,\ 5)`],
          n: R`線分 AB を $m : n$ に内分する点の座標は $\left(\dfrac{nx_{1}+mx_{2}}{m+n},\ \dfrac{ny_{1}+my_{2}}{m+n}\right)$ です。ここでは $m=1,\ n=2$ で、「近い方の点の座標に、遠い方の比をかける」と覚えます。`,
          easy: R`A から B へ $\dfrac{1}{3}$ だけ進んだ位置が、$1 : 2$ に内分する点です。$y$ 座標は $1$ から $13$ へ $12$ 動くので、$\dfrac{1}{3}$ だけ進むと $1+12 \times \dfrac{1}{3}=5$。公式では A の座標に $2$、B の座標に $1$ をかけて足し、$1+2=3$ で割ります。A に近い点なので、A の座標に大きい比（$2$）がかかるのがポイントです。` }
      ],
      tags: ['距離', '内分点']
    },

    {
      id: 'd-m-coord-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-coord',
      title: '直線の方程式・垂直',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の直線の方程式を $y = \boxed{\ \ }$ の形で答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`2 点 $(1,\ 3),\ (4,\ 9)$ を通る直線`, type: 'expr', answer: '2x+1', vars: ['x'], show: R`2x+1`, hint: R`例: 3x-2` },
        { label: '(2)', q: R`直線 $y = 2x + 1$ に垂直で、点 $(4,\ 5)$ を通る直線`, type: 'expr', answer: '-x/2+7', vars: ['x'], show: R`-\frac{1}{2}x + 7`, hint: R`例: -x/3+2` }
      ],
      solution: [
        { t: R`傾きを求めて、1 点を通る直線の式にする（(1)）`,
          m: [R`\text{傾き} = \frac{9-3}{4-1} = 2`,
              R`y - 3 = 2(x-1) \;\Rightarrow\; y = 2x + 1`],
          n: R`2 点を通る直線の傾きは「$y$ の増加量 ÷ $x$ の増加量」です。点 $(x_{1},\ y_{1})$ を通り傾き $m$ の直線は $y-y_{1}=m(x-x_{1})$ です。`,
          easy: R`直線の**傾き**は、$x$ が $1$ 増えるごとに $y$ がいくつ増えるかを表します。$x$ が $1$ から $4$ へ $3$ 増えると $y$ は $3$ から $9$ へ $6$ 増えるので、傾きは $6 \div 3=2$。あとは、通る点 $(1,\ 3)$ を使って $y-3=2(x-1)$ と書き、$y=$ の形に整理します。` },
        { t: R`垂直な直線は、傾きの積が $-1$（(2)）`,
          m: [R`\text{傾き } m \text{ は } 2 \times m = -1 \;\Rightarrow\; m = -\frac{1}{2}`,
              R`y - 5 = -\frac{1}{2}(x - 4) \;\Rightarrow\; y = -\frac{1}{2}x + 7`],
          n: R`2 直線が垂直に交わるとき、傾きの積は $-1$ です。$y=2x+1$ の傾きが $2$ なので、求める直線の傾きは $-\dfrac{1}{2}$ です。点 $(4,\ 5)$ を通る条件で式を決めます。`,
          easy: R`傾き $2$ の直線は、右に $1$ 進むと上に $2$ 上がります。これと直角になる直線は、「**右に 2 進むと下に 1 下がる**」向き、つまり傾き $-\dfrac{1}{2}$ です。（逆数にマイナスをつけた形）。$-\dfrac{1}{2}$ と決まったら、点 $(4,\ 5)$ を通るように $y-5=-\dfrac{1}{2}(x-4)$ とします。` }
      ],
      tags: ['直線の方程式', '垂直条件']
    },

    {
      id: 'd-m-coord-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-coord',
      title: '円の方程式・点と直線の距離',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`円 $x^{2} + y^{2} - 6x + 4y - 12 = 0$ の半径を求めよ。`, type: 'num', answer: 5 },
        { label: '(2)', q: R`点 $(1,\ 2)$ と直線 $3x + 4y - 2 = 0$ の距離を求めよ。`, type: 'num', answer: 9 / 5, show: R`\frac{9}{5}`, hint: R`例: 3/4 や 0.75` }
      ],
      solution: [
        { t: R`平方完成して $(x-a)^{2}+(y-b)^{2}=r^{2}$ の形にする（(1)）`,
          m: [R`x^{2} + y^{2} - 6x + 4y - 12 = (x-3)^{2} + (y+2)^{2} - 25`,
              R`(x-3)^{2} + (y+2)^{2} = 25 \;\Rightarrow\; \text{中心 } (3,\ -2),\ \text{半径 } 5`],
          n: R`$x$ と $y$ についてそれぞれ平方完成します。$x^{2}-6x=(x-3)^{2}-9$、$y^{2}+4y=(y+2)^{2}-4$ なので、$-9-4-12=-25$ が残り、右辺に移して $25$ です。`,
          easy: R`円の方程式は $(x-a)^{2}+(y-b)^{2}=r^{2}$ の形にすると、中心が $(a,\ b)$、半径が $r$ と読み取れます。展開されたままの式では読み取れないので、$x$ の項と $y$ の項をそれぞれ**平方完成**します。$-12$ も一緒に移項して、右辺が $25$ になれば、半径は $\sqrt{25}=5$ です。` },
        { t: R`点と直線の距離の公式（(2)）`,
          m: R`\frac{|3 \cdot 1 + 4 \cdot 2 - 2|}{\sqrt{3^{2} + 4^{2}}} = \frac{9}{5}`,
          n: R`点 $(x_{0},\ y_{0})$ と直線 $ax+by+c=0$ の距離は $\dfrac{|ax_{0}+by_{0}+c|}{\sqrt{a^{2}+b^{2}}}$ です。分子は直線の式に点の座標を代入して絶対値をとります。`,
          easy: R`**点と直線の距離**は、点から直線に垂線を下ろしたときの長さです。公式は、直線の式 $ax+by+c$ の $x,\ y$ に点の座標を入れた値（絶対値）を、$\sqrt{a^{2}+b^{2}}$ で割るだけ。ここでは $3+8-2=9$、$\sqrt{9+16}=5$ なので距離は $\dfrac{9}{5}$ です。` }
      ],
      tags: ['円の方程式', '点と直線の距離']
    },

    /* ---------- 三角関数（m-trig2） ---------- */
    {
      id: 'd-m-trig2-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-trig2',
      title: '弧度法（度とラジアン）',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の角を、度はラジアンに、ラジアンは度に直せ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$240\degree$ をラジアンで表せ。`, type: 'num', answer: 4 * Math.PI / 3, show: R`\frac{4}{3}\pi`, hint: R`例: 3π/4 や 3*pi/4` },
        { label: '(2)', q: R`$\dfrac{7}{6}\pi$ ラジアンを度で表せ。`, type: 'num', answer: 210, unit: '°' }
      ],
      solution: [
        { t: R`$180\degree = \pi$ を基準にして度 → ラジアン（(1)）`,
          m: [R`180\degree = \pi`,
              R`240\degree = 240 \times \frac{\pi}{180} = \frac{4}{3}\pi`],
          n: R`半円の角 $180\degree$ が $\pi$ ラジアンです。度の数に $\dfrac{\pi}{180}$ をかけるとラジアンになります。`,
          easy: R`角の大きさの測り方には、度（$^{\circ}$）のほかに**ラジアン**があります。ラジアンは「半径と同じ長さの弧に対する中心角」を $1$ とする測り方で、円を 1 周すると $2\pi$ ラジアン（$360\degree$）、半周で $\pi$ ラジアン（$180\degree$）です。度 → ラジアンは「$\dfrac{\pi}{180}$ をかける」だけ。$240 \times \dfrac{\pi}{180}=\dfrac{240}{180}\pi=\dfrac{4}{3}\pi$ です。` },
        { t: R`ラジアン → 度は $\dfrac{180\degree}{\pi}$ をかける（(2)）`,
          m: R`\frac{7}{6}\pi = \frac{7}{6} \times 180\degree = 210\degree`,
          n: R`$\pi$ を $180\degree$ に置きかえれば度になります。ラジアンの単位はふつう書かないので、$\pi$ が入っていたらラジアン、$\degree$ があれば度と見分けます。`,
          easy: R`ラジアン → 度は、$\pi$ を $180\degree$ に置きかえるだけです。$\dfrac{7}{6}\pi$ の $\pi$ を $180\degree$ にすると $\dfrac{7}{6} \times 180\degree=210\degree$。これは半周 $180\degree$ に、さらに $30\degree$ をたした角です。` }
      ],
      tags: ['弧度法', 'ラジアン']
    },

    {
      id: 'd-m-trig2-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-trig2',
      title: '一般角の三角関数の値',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\sin 210\degree$`, type: 'num', answer: -1 / 2, show: R`-\frac{1}{2}`, hint: R`例: 3/4, -0.75（分数・小数どちらでも可。負の数は - をつける）` },
        { label: '(2)', q: R`$\cos\dfrac{5}{4}\pi$`, type: 'num', answer: -Math.sqrt(2) / 2, show: R`-\frac{\sqrt{2}}{2}`, hint: R`例: 3√5/4 や -3√5/4（負の数は - をつける）` }
      ],
      solution: [
        { t: R`$180\degree$ + 鋭角に直す（(1)）`,
          m: [R`210\degree = 180\degree + 30\degree`,
              R`\sin 210\degree = \sin(180\degree + 30\degree) = -\sin 30\degree = -\frac{1}{2}`],
          n: R`$\sin(180\degree + \theta) = -\sin\theta$ です。$210\degree$ は第 3 象限の角で、$\sin$（$y$ 座標）は負になります。`,
          easy: R`単位円で考えます。$210\degree$ の点は、$30\degree$ の点を原点のまわりに半周（$180\degree$）回した位置、つまり**原点について反対側**にあります。$x$ 座標も $y$ 座標も符号が逆になるので、$\sin 210\degree$ は $\sin 30\degree=\dfrac{1}{2}$ の符号を変えて $-\dfrac{1}{2}$ です。` },
        { t: R`$\pi$ + 鋭角に直す（(2)）`,
          m: [R`\frac{5}{4}\pi = \pi + \frac{\pi}{4}`,
              R`\cos\frac{5}{4}\pi = \cos\left(\pi + \frac{\pi}{4}\right) = -\cos\frac{\pi}{4} = -\frac{\sqrt{2}}{2}`],
          n: R`$\cos(\pi + \theta) = -\cos\theta$ です。$\dfrac{5}{4}\pi = 225\degree$ も第 3 象限の角で、$\cos$（$x$ 座標）は負になります。`,
          easy: R`まず $\dfrac{5}{4}\pi$ が何度かを確かめます（$\pi=180\degree$ なので $\dfrac{5}{4} \times 180\degree=225\degree$）。これは $180\degree+45\degree$ で、(1) と同じく原点の反対側にある点です。$\cos\dfrac{\pi}{4}=\dfrac{\sqrt{2}}{2}$ の符号を変えて $-\dfrac{\sqrt{2}}{2}$ です。` }
      ],
      tags: ['一般角', '単位円']
    },

    {
      id: 'd-m-trig2-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-trig2',
      title: '加法定理と周期',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\sin 75\degree$ の値を求めよ。`, type: 'num', answer: (Math.sqrt(6) + Math.sqrt(2)) / 4, show: R`\frac{\sqrt{6}+\sqrt{2}}{4}`, hint: R`例: (1+√5)/2（(1+sqrt(5))/2 でも可）` },
        { label: '(2)', q: R`関数 $y = \sin 3\theta$ の周期として正しいものを選べ。`, type: 'choice', choices: [R`$\dfrac{2\pi}{3}$`, R`$\dfrac{3\pi}{2}$`, R`$6\pi$`, R`$\dfrac{\pi}{3}$`], answer: 0 }
      ],
      solution: [
        { t: R`$75\degree = 45\degree + 30\degree$ と分けて加法定理を使う（(1)）`,
          m: [R`\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta`,
              R`\sin 75\degree = \sin(45\degree + 30\degree) = \sin 45\degree\cos 30\degree + \cos 45\degree\sin 30\degree`,
              R`= \frac{\sqrt{2}}{2} \cdot \frac{\sqrt{3}}{2} + \frac{\sqrt{2}}{2} \cdot \frac{1}{2} = \frac{\sqrt{6} + \sqrt{2}}{4}`],
          n: R`値を知っている角（$30\degree,\ 45\degree,\ 60\degree$ など）の和や差に分けて、**加法定理** $\sin(\alpha+\beta)=\sin\alpha\cos\beta+\cos\alpha\sin\beta$ を使います。`,
          easy: R`$75\degree$ の三角関数の値は覚えていなくても、値を知っている角に分ければ求められます。$75\degree=45\degree+30\degree$ と見ると、加法定理に $\alpha=45\degree,\ \beta=30\degree$ を代入するだけです。$\sin 45\degree=\cos 45\degree=\dfrac{\sqrt{2}}{2}$、$\cos 30\degree=\dfrac{\sqrt{3}}{2}$、$\sin 30\degree=\dfrac{1}{2}$ を使います。` },
        { t: R`$\sin k\theta$ の周期は $\dfrac{2\pi}{k}$（(2)）`,
          m: R`\sin 3\left(\theta + \frac{2\pi}{3}\right) = \sin(3\theta + 2\pi) = \sin 3\theta`,
          n: R`$\sin\theta$ の周期は $2\pi$ です。$\sin 3\theta$ は $3\theta$ が $2\pi$ だけ増えるごとに同じ値にもどるので、$\theta$ は $\dfrac{2\pi}{3}$ 進むたびにくり返します。`,
          easy: R`$\sin\theta$ は $\theta$ が $2\pi$ 進むと 1 周して元の値にもどります（周期 $2\pi$）。$\sin 3\theta$ は、$\theta$ が進むと中身の $3\theta$ が **3 倍の速さ**で進むので、1 周するのも $\dfrac{1}{3}$ の時間（$\dfrac{2\pi}{3}$）で済みます。グラフでいうと、$\sin\theta$ の波を横に $\dfrac{1}{3}$ に縮めた形で、波が細かくなります。` }
      ],
      tags: ['加法定理', '周期']
    },

    /* ---------- 指数・対数関数（m-explog） ---------- */
    {
      id: 'd-m-explog-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-explog',
      title: '指数法則と分数の指数',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\left(\dfrac{1}{8}\right)^{-\frac{2}{3}}$`, type: 'num', answer: 4 },
        { label: '(2)', q: R`$27^{\frac{2}{3}} \div 9^{\frac{1}{2}}$`, type: 'num', answer: 3 }
      ],
      solution: [
        { t: R`負の指数は逆数、分数の指数は累乗根（(1)）`,
          m: R`\left(\frac{1}{8}\right)^{-\frac{2}{3}} = 8^{\frac{2}{3}} = (2^{3})^{\frac{2}{3}} = 2^{2} = 4`,
          n: R`$a^{-n}=\dfrac{1}{a^{n}}$ なので、$\left(\dfrac{1}{8}\right)^{-\frac{2}{3}}=8^{\frac{2}{3}}$ です。$8=2^{3}$ と底をそろえ、$(a^{p})^{q}=a^{pq}$ を使います。`,
          easy: R`指数が負のときは、**分数をひっくり返して**指数を正にします。さらに、指数が分数のときは「分母が累乗根、分子が累乗」の意味です。$8^{\frac{2}{3}}$ は「8 の 3 乗根（$=2$）を 2 乗する」と読んで $2^{2}=4$。$8=2^{3}$ と気づければ、$(2^{3})^{\frac{2}{3}}=2^{3 \times \frac{2}{3}}=2^{2}$ と計算できます。` },
        { t: R`底をそろえて割り算する（(2)）`,
          m: [R`27^{\frac{2}{3}} = (3^{3})^{\frac{2}{3}} = 3^{2} = 9, \qquad 9^{\frac{1}{2}} = (3^{2})^{\frac{1}{2}} = 3`,
              R`9 \div 3 = 3`],
          n: R`$27=3^{3},\ 9=3^{2}$ と、どちらも底を $3$ にそろえると計算しやすくなります。$9^{\frac{1}{2}}$ は $\sqrt{9}=3$ のことです。`,
          easy: R`分数の指数が出てきたら、まず底を素数の累乗に直します。$27=3^{3}$、$9=3^{2}$。$27^{\frac{2}{3}}$ は「27 の 3 乗根（3）を 2 乗」で $9$、$9^{\frac{1}{2}}$ は「9 の 2 乗根（平方根）」で $3$ です。あとは $9 \div 3=3$ です。` }
      ],
      tags: ['指数法則', '累乗根']
    },

    {
      id: 'd-m-explog-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-explog',
      title: '対数の計算',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\log_{2}24 - \log_{2}3$`, type: 'num', answer: 3 },
        { label: '(2)', q: R`$\log_{4}8$`, type: 'num', answer: 3 / 2, show: R`\frac{3}{2}`, hint: R`例: 3/4 や 0.75` }
      ],
      solution: [
        { t: R`対数の差は、真数の割り算（(1)）`,
          m: R`\log_{2}24 - \log_{2}3 = \log_{2}\frac{24}{3} = \log_{2}8 = \log_{2}2^{3} = 3`,
          n: R`$\log_{a}M - \log_{a}N = \log_{a}\dfrac{M}{N}$ です。$\log_{2}8$ は「$2$ を何乗すると $8$ になるか」で、$2^{3}=8$ から $3$ です。`,
          easy: R`**対数** $\log_{a}M$ は、「$a$ を何乗すると $M$ になるか」を表す数です（$a$ を**底**、$M$ を**真数**といいます）。たとえば $2^{3}=8$ なので $\log_{2}8=3$。同じ底の対数の引き算は、真数の割り算にまとめられます。$24 \div 3=8$ で、$\log_{2}8=3$ です。` },
        { t: R`底をそろえる（底の変換）（(2)）`,
          m: R`\log_{4}8 = \frac{\log_{2}8}{\log_{2}4} = \frac{3}{2}`,
          n: R`底の変換公式 $\log_{a}b=\dfrac{\log_{c}b}{\log_{c}a}$ で、底を $2$ にそろえます。（別解）$4^{x}=8$ とおくと $2^{2x}=2^{3}$ から $x=\dfrac{3}{2}$ です。`,
          easy: R`$\log_{4}8$ は「$4$ を何乗すると $8$ か」という意味です。$4=2^{2},\ 8=2^{3}$ なので、$4^{x}=8$ は $(2^{2})^{x}=2^{3}$、つまり $2^{2x}=2^{3}$ から $2x=3$、$x=\dfrac{3}{2}$ とわかります。公式（底の変換）は、この考え方を一般的にしたものです。` }
      ],
      tags: ['対数', '底の変換']
    },

    {
      id: 'd-m-explog-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-explog',
      title: '指数・対数の方程式',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の方程式を解け。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$9^{x} - 4 \cdot 3^{x} + 3 = 0$ の解のうち、大きい方`, type: 'num', answer: 1 },
        { label: '(2)', q: R`$\log_{2}(x-1) = 3$`, type: 'num', answer: 9 }
      ],
      solution: [
        { t: R`$3^{x} = t$ とおいて 2 次方程式にする（(1)）`,
          m: [R`9^{x} = (3^{x})^{2} = t^{2}`,
              R`t^{2} - 4t + 3 = (t-1)(t-3) = 0 \;\Rightarrow\; t = 1,\ 3`,
              R`3^{x} = 1,\ 3 \;\Rightarrow\; x = 0,\ 1`],
          n: R`$t=3^{x}$ とおくと $t>0$ で、$9^{x}=(3^{x})^{2}=t^{2}$ です。$t$ の 2 次方程式を解いて、$3^{x}=t$ に戻します。大きい方の解は $x=1$ です。`,
          easy: R`$9^{x}$ と $3^{x}$ が混ざった式は、$9=3^{2}$ に注目して底を $3$ にそろえます。すると $3^{x}$ を 1 つの文字 $t$ とおくことで、ふつうの $t$ の 2 次方程式になります。$t$ が求まったら、「$3$ を何乗すると $t$ か」を考えて $x$ にもどします（$3^{x}=1$ なら $x=0$、$3^{x}=3$ なら $x=1$）。` },
        { t: R`真数条件を確認して、指数の形に直す（(2)）`,
          m: [R`x - 1 > 0 \;\Rightarrow\; x > 1`,
              R`\log_{2}(x-1) = 3 \;\Rightarrow\; x - 1 = 2^{3} = 8 \;\Rightarrow\; x = 9`],
          n: R`対数の真数は正なので $x>1$ が条件です。$\log_{a}M=p \iff M=a^{p}$ を使って、対数を指数に直します。$x=9$ は $x>1$ を満たすので解です。`,
          easy: R`$\log_{2}(x-1)=3$ は「$2$ を $3$ 乗すると $x-1$ になる」という意味なので、$x-1=2^{3}=8$ です。対数の中身（真数）は必ず正の数なので、最初に $x-1>0$、つまり $x>1$ を確認し、求めた解 $x=9$ がこの条件に合っているかを最後に確かめます。` }
      ],
      tags: ['指数方程式', '対数方程式', '真数条件']
    },

    /* ---------- 微分・積分（数II）（m-calc2） ---------- */
    {
      id: 'd-m-calc2-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-calc2',
      title: '多項式の微分',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$f(x) = 2x^{3} - 6x + 1$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`導関数 $f'(x)$ を求めよ。`, type: 'expr', answer: '6x^2-6', vars: ['x'], show: R`6x^{2}-6`, hint: R`累乗は ^ で入力（例: 3x^2+1）` },
        { label: '(2)', q: R`$f'(2)$ の値を求めよ。`, type: 'num', answer: 18 }
      ],
      solution: [
        { t: R`$x^{n}$ の微分は $nx^{n-1}$（(1)）`,
          m: [R`(x^{n})' = nx^{n-1}, \qquad (\text{定数})' = 0`,
              R`f'(x) = 2 \cdot 3x^{2} - 6 \cdot 1 + 0 = 6x^{2} - 6`],
          n: R`各項をそれぞれ微分します。$2x^{3} \to 2 \cdot 3x^{2}=6x^{2}$、$-6x \to -6$、定数 $1 \to 0$ です。`,
          easy: R`**微分**は、グラフの各点での「傾き」を表す式 $f'(x)$ を作る計算です。ルールは「指数を前に出して、指数を 1 減らす」。$x^{3}$ なら $3x^{2}$、$x$ なら $1$（$x^{1}$ から $x^{0}=1$）、数だけの項は $0$ になります。係数はそのまま残るので、$2x^{3}$ は $2 \times 3x^{2}=6x^{2}$ です。` },
        { t: R`$x=2$ を代入する（(2)）`,
          m: R`f'(2) = 6 \cdot 2^{2} - 6 = 24 - 6 = 18`,
          n: R`$f'(2)$ は「$x=2$ における微分係数」で、グラフの $x=2$ の点での接線の傾きです。導関数 $f'(x)$ に $x=2$ を代入します。`,
          easy: R`$f'(x)$ は「各 $x$ での傾き」を表す式なので、$x=2$ での傾きを知りたいときは $x$ に $2$ を入れます。$6 \times 2^{2}=6 \times 4=24$ から $6$ を引いて $18$ です。傾き $18$ はかなり急な上り坂、ということです。` }
      ],
      tags: ['微分', '導関数', '微分係数']
    },

    {
      id: 'd-m-calc2-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-calc2',
      title: '接線の方程式',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`曲線 $y = x^{3} - 3x$ 上の点 $(2,\ 2)$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`この点における接線の傾きを求めよ。`, type: 'num', answer: 9 },
        { label: '(2)', q: R`この点における接線の方程式を $y = \boxed{\ \ }$ の形で答えよ。`, type: 'expr', answer: '9x-16', vars: ['x'], show: R`9x-16`, hint: R`例: 2x-3` }
      ],
      solution: [
        { t: R`微分して $x=2$ を代入（接線の傾き）（(1)）`,
          m: R`y' = 3x^{2} - 3 \;\Rightarrow\; x = 2 \text{ のとき } y' = 3 \cdot 4 - 3 = 9`,
          n: R`曲線上の点 $(a,\ f(a))$ における接線の傾きは、微分係数 $f'(a)$ です。`,
          easy: R`曲線を限りなくズームすると、ほとんど直線に見えます。その直線が**接線**で、その傾きは微分係数 $f'(a)$ に等しくなります。まず $y=x^{3}-3x$ を微分して $y'=3x^{2}-3$。接点の $x$ 座標 $2$ を入れると傾き $9$ が分かります。` },
        { t: R`傾き $9$ で点 $(2,\ 2)$ を通る直線の式にする（(2)）`,
          m: R`y - 2 = 9(x - 2) \;\Rightarrow\; y = 9x - 16`,
          n: R`点 $(x_{1},\ y_{1})$ を通り傾き $m$ の直線は $y-y_{1}=m(x-x_{1})$ です。`,
          easy: R`傾きが分かって、通る点も分かっているので、直線の式が決まります。$y-2=9(x-2)$ を $y=$ の形に整理すると $y=9x-18+2=9x-16$ です。図の破線が、この接線です。`,
          fig: figTangentCubic() }
      ],
      tags: ['接線', '微分係数']
    },

    {
      id: 'd-m-calc2-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-calc2',
      title: '不定積分と定積分',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`定積分 $\int_{1}^{2} (3x^{2} - 4x + 1)\,dx$ の値を求めよ。`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$F(x) = \int (2x+1)\,dx$ で $F(0) = 3$ のとき、$F(2)$ の値を求めよ。`, type: 'num', answer: 9 }
      ],
      solution: [
        { t: R`原始関数を求めて、上端 − 下端（(1)）`,
          m: [R`\int_{1}^{2} (3x^{2} - 4x + 1)\,dx = \left[x^{3} - 2x^{2} + x\right]_{1}^{2}`,
              R`= (8 - 8 + 2) - (1 - 2 + 1) = 2 - 0 = 2`],
          n: R`$x^{n}$ の原始関数は $\dfrac{x^{n+1}}{n+1}$ です。$3x^{2} \to x^{3}$、$-4x \to -2x^{2}$、$1 \to x$。上端 $x=2$ の値から下端 $x=1$ の値を引きます。`,
          easy: R`**積分**は、微分の逆の計算です。「微分すると $3x^{2}-4x+1$ になる式」を探すと $x^{3}-2x^{2}+x$（微分してたしかめられます）。**定積分**は、その式に上端の値 $2$ と下端の値 $1$ を入れて、差をとります。$2$ を入れると $8-8+2=2$、$1$ を入れると $1-2+1=0$。差は $2-0=2$ です。` },
        { t: R`積分定数を条件から決める（(2)）`,
          m: [R`F(x) = \int (2x+1)\,dx = x^{2} + x + C`,
              R`F(0) = C = 3 \;\Rightarrow\; F(x) = x^{2} + x + 3`,
              R`F(2) = 4 + 2 + 3 = 9`],
          n: R`不定積分には積分定数 $C$ がつきます。$F(0)=3$ の条件から $C=3$ と決まります。`,
          easy: R`「微分すると $2x+1$ になる式」は $x^{2}+x$ のほかに、$x^{2}+x+5$ や $x^{2}+x-1$ のように定数をつけたものすべてです。そこで $+C$ をつけておき、$F(0)=3$ という条件で $C$ を決めます。$x=0$ を入れると $C$ だけが残るので $C=3$。その後 $x=2$ を代入して $F(2)=9$ です。` }
      ],
      tags: ['不定積分', '定積分', '積分定数']
    },

    /* ---------- 数列（m-seq） ---------- */
    {
      id: 'd-m-seq-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-seq',
      title: '等差数列',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`初項 $5$、公差 $3$ の等差数列 $\{a_{n}\}$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`第 10 項 $a_{10}$ を求めよ。`, type: 'num', answer: 32 },
        { label: '(2)', q: R`初項から第 10 項までの和を求めよ。`, type: 'num', answer: 185 }
      ],
      solution: [
        { t: R`一般項の公式（(1)）`,
          m: R`a_{n} = a_{1} + (n-1)d \;\Rightarrow\; a_{10} = 5 + 9 \times 3 = 32`,
          n: R`第 $n$ 項は、初項から公差 $d$ を $(n-1)$ 回足した値です。第 $10$ 項は $9$ 回足します。`,
          easy: R`等差数列は「となり合う項の差がいつも同じ」数列です。$5,\ 8,\ 11,\ 14,\ \cdots$ のように、毎回 $3$ ずつ増えます。第 $10$ 項は、第 $1$ 項から**$9$ 回**増えた値なので、$5+9 \times 3=32$ です（第 $n$ 項では「$n-1$ 回」増えるのがポイント）。` },
        { t: R`和の公式（(2)）`,
          m: R`S_{10} = \frac{10(a_{1} + a_{10})}{2} = \frac{10(5 + 32)}{2} = 185`,
          n: R`等差数列の和は「（初項 + 末項）× 項数 ÷ 2」です。`,
          easy: R`数列を順に並べた和と、逆順に並べた和を縦に足すと、どの列も「初項 + 末項 $=5+32=37$」で同じ値になります。それが $10$ 列あるので合計 $370$ で、これは求める和の 2 倍です。だから半分にして $185$ です。` }
      ],
      tags: ['等差数列', '和']
    },

    {
      id: 'd-m-seq-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-seq',
      title: '等比数列',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`初項 $2$、公比 $3$ の等比数列 $\{a_{n}\}$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`第 5 項 $a_{5}$ を求めよ。`, type: 'num', answer: 162 },
        { label: '(2)', q: R`初項から第 5 項までの和を求めよ。`, type: 'num', answer: 242 }
      ],
      solution: [
        { t: R`一般項の公式（(1)）`,
          m: R`a_{n} = a_{1} r^{n-1} \;\Rightarrow\; a_{5} = 2 \cdot 3^{4} = 2 \times 81 = 162`,
          n: R`第 $n$ 項は、初項に公比 $r$ を $(n-1)$ 回かけた値です。第 $5$ 項は $4$ 回かけます。`,
          easy: R`等比数列は「となり合う項の比がいつも同じ」数列です。$2,\ 6,\ 18,\ 54,\ 162,\ \cdots$ のように、毎回 $3$ 倍になります。第 $5$ 項は、第 $1$ 項に $3$ を **$4$ 回**かけた値なので、$2 \times 3^{4}=2 \times 81=162$ です。` },
        { t: R`和の公式（(2)）`,
          m: R`S_{5} = \frac{a_{1}(r^{5} - 1)}{r - 1} = \frac{2(3^{5} - 1)}{3 - 1} = \frac{2 \times 242}{2} = 242`,
          n: R`公比 $r \ne 1$ の等比数列の和は $S_{n}=\dfrac{a_{1}(r^{n}-1)}{r-1}$ です。$3^{5}=243$ です。`,
          easy: R`直接足すと $2+6+18+54+162=242$ です。公式を使うと、$\dfrac{2 \times (243-1)}{3-1}$ と、掛け算と引き算だけで済みます。項数が多いときに便利です。分子は「（最後の項の次の項に当たる $a_{1}r^{n}$ − 最初の項 $a_{1}$）」の形になっています。` }
      ],
      tags: ['等比数列', '和']
    },

    {
      id: 'd-m-seq-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-seq',
      title: 'Σ（シグマ）の計算',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\sum_{k=1}^{10} (2k+1)$`, type: 'num', answer: 120 },
        { label: '(2)', q: R`$\sum_{k=1}^{5} k(k+1)$`, type: 'num', answer: 70 }
      ],
      solution: [
        { t: R`$\sum k$ の公式を使う（(1)）`,
          m: [R`\sum_{k=1}^{n} k = \frac{n(n+1)}{2}`,
              R`\sum_{k=1}^{10}(2k+1) = 2 \cdot \frac{10 \cdot 11}{2} + 10 = 110 + 10 = 120`],
          n: R`$\sum_{k=1}^{10}(2k+1) = 2\sum_{k=1}^{10}k + \sum_{k=1}^{10}1$ と分けます。定数 $1$ を $10$ 個足すと $10$ です。`,
          easy: R`$\sum_{k=1}^{10}$ は「$k=1$ から $k=10$ まで足す」という記号です。$(2k+1)$ を 1 項ずつ足すと $3+5+7+\cdots+21$ ですが、**$k$ の部分と定数の部分に分ける**と公式が使えます。$\sum_{k=1}^{n} k=\dfrac{n(n+1)}{2}$ より $1+2+\cdots+10=55$ なので、$2 \times 55+10=120$ です。` },
        { t: R`$\sum k^{2}$ の公式も使って分けて計算する（(2)）`,
          m: [R`\sum_{k=1}^{5} k(k+1) = \sum_{k=1}^{5} k^{2} + \sum_{k=1}^{5} k`,
              R`= \frac{5 \cdot 6 \cdot 11}{6} + \frac{5 \cdot 6}{2} = 55 + 15 = 70`],
          n: R`まず $k(k+1)=k^{2}+k$ と展開します。$\sum_{k=1}^{n}k^{2}=\dfrac{n(n+1)(2n+1)}{6}$ を使います。`,
          easy: R`$k(k+1)$ を展開して $k^{2}+k$ にしてから、それぞれの和の公式を使います。$\sum k^{2}=\dfrac{n(n+1)(2n+1)}{6}$ に $n=5$ を入れると $\dfrac{5 \cdot 6 \cdot 11}{6}=55$、$\sum k=15$ なので、合計は $70$ です。確かめに、$1 \cdot 2+2 \cdot 3+3 \cdot 4+4 \cdot 5+5 \cdot 6=2+6+12+20+30=70$ と直接足しても同じです。` }
      ],
      tags: ['シグマ', '和の公式']
    },

    /* ---------- ベクトル（m-vec） ---------- */
    {
      id: 'd-m-vec-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-vec',
      title: 'ベクトルの成分計算',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$\vec{a} = (2,\ -1),\ \vec{b} = (-3,\ 4)$ のとき、$2\vec{a} - \vec{b}$ の成分表示を $(p,\ q)$ とする。次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$p$ の値`, type: 'num', answer: 7 },
        { label: '(2)', q: R`$q$ の値`, type: 'num', answer: -6 }
      ],
      solution: [
        { t: R`実数倍は成分ごとにかける`,
          m: R`2\vec{a} = 2(2,\ -1) = (4,\ -2)`,
          n: R`ベクトルを $k$ 倍するときは、$x$ 成分と $y$ 成分をそれぞれ $k$ 倍します。`,
          easy: R`ベクトル $\vec{a}=(2,\ -1)$ は「右に $2$、下に $1$」進む矢印です。$2\vec{a}$ は、その矢印を同じ向きに **2 倍の長さ**にしたものなので、「右に $4$、下に $2$」、つまり $(4,\ -2)$ です。成分ごとに $2$ をかければよいのです。` },
        { t: R`引き算も成分ごと`,
          m: R`2\vec{a} - \vec{b} = (4,\ -2) - (-3,\ 4) = (4 - (-3),\ -2 - 4) = (7,\ -6)`,
          n: R`ベクトルの足し算・引き算は、$x$ 成分どうし、$y$ 成分どうしで計算します。$-(-3)=+3$ の符号に注意しましょう。`,
          easy: R`ベクトルの引き算は、同じ位置の成分どうしを引きます。$x$ 成分は $4-(-3)=7$、$y$ 成分は $-2-4=-6$。マイナスの数を引くときは「$-(-3)=+3$」になる（引き算 → 足し算に変わる）ので、符号を間違えないように気をつけます。したがって $(p,\ q)=(7,\ -6)$ です。` }
      ],
      tags: ['ベクトルの成分', '実数倍']
    },

    {
      id: 'd-m-vec-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-vec',
      title: '内積と垂直条件',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\vec{a} = (2,\ 3),\ \vec{b} = (1,\ -2)$ のとき、内積 $\vec{a} \cdot \vec{b}$ を求めよ。`, type: 'num', answer: -4 },
        { label: '(2)', q: R`$\vec{p} = (3,\ 1)$ と $\vec{q} = (k,\ 6)$ が垂直になるとき、$k$ の値を求めよ。`, type: 'num', answer: -2 }
      ],
      solution: [
        { t: R`内積は成分どうしの積の和（(1)）`,
          m: R`\vec{a} \cdot \vec{b} = 2 \times 1 + 3 \times (-2) = 2 - 6 = -4`,
          n: R`$(a_{1},\ a_{2}) \cdot (b_{1},\ b_{2}) = a_{1}b_{1} + a_{2}b_{2}$ です。`,
          easy: R`**内積**は、2 つのベクトルから 1 つの「数」を作る計算です。$x$ 成分どうし、$y$ 成分どうしをかけて、足します。$2 \times 1=2$、$3 \times (-2)=-6$ を足して $-4$ です。内積は矢印ではなく**ふつうの数**になる点に注意しましょう。` },
        { t: R`垂直 $\Leftrightarrow$ 内積が $0$（(2)）`,
          m: [R`\vec{p} \perp \vec{q} \;\Leftrightarrow\; \vec{p} \cdot \vec{q} = 0`,
              R`3k + 1 \times 6 = 0 \;\Rightarrow\; k = -2`],
          n: R`$\vec{p} \cdot \vec{q} = |\vec{p}||\vec{q}|\cos\theta$ で、垂直（$\theta=90\degree$）なら $\cos\theta=0$ なので内積は $0$ です。`,
          easy: R`内積には「長さ × 長さ × $\cos$（なす角）」という意味があります。2 つのベクトルが**直角**のとき $\cos 90\degree=0$ なので、内積がちょうど $0$ になります。逆に、内積が $0$ なら垂直です。成分で内積を計算して $0$ とおくと、$3k+6=0$ から $k=-2$ が出ます。` }
      ],
      tags: ['内積', '垂直条件']
    },

    {
      id: 'd-m-vec-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-vec',
      title: '位置ベクトルと内分点',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`2 点 $\mathrm{A}(1,\ 4),\ \mathrm{B}(6,\ -1)$ について、線分 AB を $2 : 3$ に内分する点を P とする。次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`P の $x$ 座標`, type: 'num', answer: 3 },
        { label: '(2)', q: R`P の $y$ 座標`, type: 'num', answer: 2 }
      ],
      solution: [
        { t: R`内分点の位置ベクトル`,
          m: R`\overrightarrow{\mathrm{OP}} = \frac{3\overrightarrow{\mathrm{OA}} + 2\overrightarrow{\mathrm{OB}}}{2 + 3}`,
          n: R`線分 AB を $m : n$ に内分する点 P の位置ベクトルは $\overrightarrow{\mathrm{OP}} = \dfrac{n\overrightarrow{\mathrm{OA}} + m\overrightarrow{\mathrm{OB}}}{m+n}$ です。ここでは $m=2,\ n=3$ なので、A に $3$、B に $2$ をかけます。`,
          easy: R`A から B へ向かって、全体の $\dfrac{2}{5}$ だけ進んだ位置が、$2 : 3$ に内分する点 P です。そのため P は A に近く、**A の影響の方が大きい**はずです。公式では、近い方の点（A）に大きい数 $3$、遠い方の点（B）に小さい数 $2$ をかけて足し、全体 $2+3=5$ で割ります。` },
        { t: R`成分で計算する`,
          m: R`\overrightarrow{\mathrm{OP}} = \frac{3(1,\ 4) + 2(6,\ -1)}{5} = \frac{(15,\ 10)}{5} = (3,\ 2)`,
          n: R`$3(1,\ 4)=(3,\ 12)$、$2(6,\ -1)=(12,\ -2)$ を足して $(15,\ 10)$、これを $5$ で割ります。点 P の座標は $(3,\ 2)$ なので、$x$ 座標は $3$、$y$ 座標は $2$ です。`,
          easy: R`成分ごとに計算します。$x$ 成分は $\dfrac{3 \times 1+2 \times 6}{5}=\dfrac{15}{5}=3$、$y$ 成分は $\dfrac{3 \times 4+2 \times (-1)}{5}=\dfrac{10}{5}=2$。A$(1,\ 4)$ から B$(6,\ -1)$ へ $\dfrac{2}{5}$ 進むと、$x$ は $5 \times \dfrac{2}{5}=2$ 増えて $3$、$y$ は $-5 \times \dfrac{2}{5}=-2$ 減って $2$ となり、同じ結果になります。` }
      ],
      tags: ['位置ベクトル', '内分点']
    },

    /* ---------- 極限（m-limit） ---------- */
    {
      id: 'd-m-limit-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-limit',
      title: '数列の極限（分数式）',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の極限値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\lim_{n \to \infty} \dfrac{4n^{2} + 3n}{2n^{2} - 1}$`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$\lim_{n \to \infty} \dfrac{5n - 2}{n^{2} + 1}$`, type: 'num', answer: 0 }
      ],
      solution: [
        { t: R`分母の最高次の項で割る（(1)）`,
          m: R`\lim_{n \to \infty} \frac{4n^{2} + 3n}{2n^{2} - 1} = \lim_{n \to \infty} \frac{4 + \frac{3}{n}}{2 - \frac{1}{n^{2}}} = \frac{4}{2} = 2`,
          n: R`分母の最高次の項 $n^{2}$ で分母・分子を割ります。$n \to \infty$ のとき $\dfrac{3}{n} \to 0,\ \dfrac{1}{n^{2}} \to 0$ です。分子・分母の最高次の係数の比 $\dfrac{4}{2}$ が極限値です。`,
          easy: R`$n$ が限りなく大きくなると、分子も分母も限りなく大きくなるので、そのままでは行き先が分かりません。分母の最高次 $n^{2}$ で全体を割ると、「$n$ が大きいほど $0$ に近づく分数」（$\dfrac{3}{n},\ \dfrac{1}{n^{2}}$）だけが残ります。それらを $0$ とみなすと、$\dfrac{4+0}{2-0}=2$ です。` },
        { t: R`分子の次数が低いときは $0$ に近づく（(2)）`,
          m: R`\lim_{n \to \infty} \frac{5n - 2}{n^{2} + 1} = \lim_{n \to \infty} \frac{\frac{5}{n} - \frac{2}{n^{2}}}{1 + \frac{1}{n^{2}}} = \frac{0}{1} = 0`,
          n: R`分子の次数（$1$ 次）が分母の次数（$2$ 次）より低いので、分母のほうが速く大きくなり、分数は $0$ に近づきます。`,
          easy: R`分子は $n$ に比例して大きくなり、分母は $n^{2}$ に比例して（もっと速く）大きくなります。分母の方がずっと大きくなるので、分数はどんどん小さく、$0$ に近づきます。(1) と同じ手順で $n^{2}$ で割ると、分子が $\dfrac{5}{n}-\dfrac{2}{n^{2}} \to 0$、分母が $1$ に近づくので、$\dfrac{0}{1}=0$ です。` }
      ],
      tags: ['数列の極限', '不定形']
    },

    {
      id: 'd-m-limit-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-limit',
      title: '無限等比級数と等比数列の極限',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`無限等比級数 $\sum_{n=1}^{\infty} 2\left(\dfrac{1}{3}\right)^{n-1}$ の和を求めよ。`, type: 'num', answer: 3 },
        { label: '(2)', q: R`$\lim_{n \to \infty} \dfrac{3^{n} + 2^{n}}{3^{n} - 2^{n}}$ を求めよ。`, type: 'num', answer: 1 }
      ],
      solution: [
        { t: R`無限等比級数の和 $\dfrac{a}{1-r}$（(1)）`,
          m: R`\sum_{n=1}^{\infty} 2\left(\frac{1}{3}\right)^{n-1} = \frac{2}{1 - \frac{1}{3}} = \frac{2}{\frac{2}{3}} = 3`,
          n: R`初項 $a=2$、公比 $r=\dfrac{1}{3}$ で、$|r|<1$ なので収束し、和は $\dfrac{a}{1-r}$ です。`,
          easy: R`$2+\dfrac{2}{3}+\dfrac{2}{9}+\cdots$ のように、足す値が毎回 $\dfrac{1}{3}$ 倍に小さくなる足し算です。無限に足しても、足す値がどんどん小さくなるので、合計はある値に近づきます。その値が「初項 ÷ (1 − 公比)」で、$\dfrac{2}{1-\frac{1}{3}}=\dfrac{2}{\frac{2}{3}}=3$ です。**公比の絶対値が $1$ より小さい**ときだけ使える公式です。` },
        { t: R`分母・分子を $3^{n}$ で割る（(2)）`,
          m: R`\frac{3^{n} + 2^{n}}{3^{n} - 2^{n}} = \frac{1 + \left(\frac{2}{3}\right)^{n}}{1 - \left(\frac{2}{3}\right)^{n}} \to \frac{1 + 0}{1 - 0} = 1`,
          n: R`底が最も大きい $3^{n}$ で分母・分子を割ります。$\left(\dfrac{2}{3}\right)^{n}$ は $|r|<1$ の等比数列なので $0$ に近づきます。`,
          easy: R`$3^{n}$ も $2^{n}$ も限りなく大きくなりますが、$3^{n}$ の方がずっと速く大きくなります。そこで底が大きい方の $3^{n}$ で割ると、$\dfrac{2^{n}}{3^{n}}=\left(\dfrac{2}{3}\right)^{n}$ が出てきます。$\dfrac{2}{3}$ を何回もかけると $0$ に近づくので、残りは $\dfrac{1+0}{1-0}=1$ です。` }
      ],
      tags: ['無限等比級数', '等比数列の極限']
    },

    {
      id: 'd-m-limit-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-limit',
      title: '関数の極限（0/0 の形）',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の極限値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\lim_{x \to 3} \dfrac{x^{2} - 9}{x - 3}$`, type: 'num', answer: 6 },
        { label: '(2)', q: R`$\lim_{x \to 0} \dfrac{\sqrt{x+4} - 2}{x}$`, type: 'num', answer: 1 / 4, show: R`\frac{1}{4}`, hint: R`例: 3/4 や 0.75` }
      ],
      solution: [
        { t: R`因数分解して約分する（(1)）`,
          m: [R`\frac{x^{2} - 9}{x - 3} = \frac{(x-3)(x+3)}{x-3} = x + 3 \quad (x \ne 3)`,
              R`\lim_{x \to 3}(x + 3) = 6`],
          n: R`$x=3$ を代入すると $\dfrac{0}{0}$ の形（不定形）になります。分子を因数分解して共通因数 $x-3$ を約分してから、$x \to 3$ とします。`,
          easy: R`$x \to 3$ は「$x$ が $3$ に限りなく近づく（$3$ そのものにはならない）」という意味です。そのため $x-3 \ne 0$ で、約分してよいのです。約分すると $x+3$ になり、$x$ が $3$ に近づくと、これは $6$ に近づきます。` },
        { t: R`分子を有理化して約分する（(2)）`,
          m: [R`\frac{\sqrt{x+4} - 2}{x} = \frac{(x+4) - 4}{x(\sqrt{x+4} + 2)} = \frac{1}{\sqrt{x+4} + 2}`,
              R`\lim_{x \to 0}\frac{1}{\sqrt{x+4} + 2} = \frac{1}{2 + 2} = \frac{1}{4}`],
          n: R`$x=0$ を代入すると $\dfrac{0}{0}$ の形です。分子の $\sqrt{x+4}-2$ に $\sqrt{x+4}+2$ をかけて有理化すると、分子が $x$ になって約分できます。`,
          easy: R`分子に根号があって因数分解できないときは、**分子を有理化**します。$(\sqrt{x+4}-2)(\sqrt{x+4}+2)=(x+4)-4=x$ となって、分子と分母の共通因数 $x$ が現れます。約分すると、$x$ を $0$ に近づけても分母が $0$ にならない形になるので、そのまま代入できます。` }
      ],
      tags: ['関数の極限', '不定形', '有理化']
    },

    /* ---------- 微分法（数III）（m-diff3） ---------- */
    {
      id: 'd-m-diff3-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-diff3',
      title: '積・商の微分',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`ただし $e$ は自然対数の底である。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$f(x) = x^{2}e^{x}$ について、$f'(1)$ の値を求めよ。`, type: 'num', answer: 3 * Math.E, show: R`3e`, hint: R`自然対数の底を含む値は 2e+1 や e^(3/2) のように入力` },
        { label: '(2)', q: R`$g(x) = \dfrac{x}{x^{2}+1}$ について、$g'(2)$ の値を求めよ。`, type: 'num', answer: -3 / 25, show: R`-\frac{3}{25}`, hint: R`例: 5/2 や -7/3（負の数は - をつける）` }
      ],
      solution: [
        { t: R`積の微分法（(1)）`,
          m: [R`f'(x) = 2x \cdot e^{x} + x^{2} \cdot e^{x} = (x^{2} + 2x)e^{x}`,
              R`f'(1) = (1 + 2)e = 3e`],
          n: R`積の微分法 $\{u(x)v(x)\}' = u'v + uv'$ を、$u=x^{2},\ v=e^{x}$ として使います。$(e^{x})'=e^{x}$ です。`,
          easy: R`2 つの関数の積の微分は、「前を微分 × 後ろそのまま」＋「前そのまま × 後ろを微分」と覚えます。$x^{2}$ を微分すると $2x$、$e^{x}$ は微分しても $e^{x}$ のままです。足し合わせて、共通の $e^{x}$ でくくると、$f'(x)=(x^{2}+2x)e^{x}$。$x=1$ を代入すると $3e$ です。` },
        { t: R`商の微分法（(2)）`,
          m: [R`g'(x) = \frac{1 \cdot (x^{2}+1) - x \cdot 2x}{(x^{2}+1)^{2}} = \frac{1 - x^{2}}{(x^{2}+1)^{2}}`,
              R`g'(2) = \frac{1 - 4}{(4+1)^{2}} = -\frac{3}{25}`],
          n: R`商の微分法 $\left\{\dfrac{u}{v}\right\}' = \dfrac{u'v - uv'}{v^{2}}$ を、$u=x,\ v=x^{2}+1$ として使います。`,
          easy: R`分数の形の関数の微分は、「**分子の微分 × 分母 − 分子 × 分母の微分**」を「**分母の 2 乗**」で割ります。引き算の順番（分子の微分が先）を間違えないように注意しましょう。$x$ の微分は $1$、$x^{2}+1$ の微分は $2x$ なので、上の式になります。` }
      ],
      tags: ['積の微分', '商の微分']
    },

    {
      id: 'd-m-diff3-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-diff3',
      title: '合成関数の微分',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$y = (3x-2)^{5}$ について、$x = 1$ における微分係数を求めよ。`, type: 'num', answer: 15 },
        { label: '(2)', q: R`$y = \sin 2x$ について、$x = \dfrac{\pi}{6}$ における微分係数を求めよ。`, type: 'num', answer: 1 }
      ],
      solution: [
        { t: R`外側を微分 × 内側の微分（(1)）`,
          m: [R`y' = 5(3x-2)^{4} \cdot (3x-2)' = 15(3x-2)^{4}`,
              R`x = 1:\quad y' = 15 \cdot 1^{4} = 15`],
          n: R`合成関数の微分法 $\{f(g(x))\}' = f'(g(x)) \cdot g'(x)$ です。外側の「5 乗」を先に微分し、内側 $3x-2$ の微分 $3$ をかけます。`,
          easy: R`$(3x-2)^{5}$ は「$3x-2$ という中身を 5 乗した関数」です。微分するときは、**まず外側（5 乗）を微分**して $5(3x-2)^{4}$、そのうえで**中身の微分** $(3x-2)'=3$ をかけます。かけ忘れが多いので、「外 × 内」と唱えましょう。$x=1$ なら $3x-2=1$ なので、$15 \cdot 1^{4}=15$ です。` },
        { t: R`三角関数の合成関数（(2)）`,
          m: [R`y' = \cos 2x \cdot (2x)' = 2\cos 2x`,
              R`x = \frac{\pi}{6}:\quad y' = 2\cos\frac{\pi}{3} = 2 \cdot \frac{1}{2} = 1`],
          n: R`$(\sin u)' = \cos u \cdot u'$ です。中身 $u=2x$ の微分 $2$ を忘れずにかけます。`,
          easy: R`$\sin 2x$ は「$2x$ という中身の $\sin$」です。(1) と同じで、外側（$\sin$）を微分して $\cos 2x$、中身 $2x$ の微分 $2$ をかけて $2\cos 2x$ になります。$x=\dfrac{\pi}{6}$ のとき $2x=\dfrac{\pi}{3}$ で、$\cos\dfrac{\pi}{3}=\dfrac{1}{2}$ なので、$2 \times \dfrac{1}{2}=1$ です。` }
      ],
      tags: ['合成関数の微分', '三角関数の微分']
    },

    {
      id: 'd-m-diff3-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-diff3',
      title: '対数・指数関数の微分',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$\log$ は自然対数（底が $e$）とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$y = x\log x$ について、$x = e$ における微分係数を求めよ。`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$y = 2^{x}$ について、$x = 3$ における微分係数を求めよ。`, type: 'num', answer: 8 * Math.log(2), show: R`8\log 2`, hint: R`例: 3*ln(5) や 3*log(5)` }
      ],
      solution: [
        { t: R`積の微分と $(\log x)' = \dfrac{1}{x}$（(1)）`,
          m: [R`y' = 1 \cdot \log x + x \cdot \frac{1}{x} = \log x + 1`,
              R`x = e:\quad y' = \log e + 1 = 1 + 1 = 2`],
          n: R`積の微分法で、$x$ の微分は $1$、$\log x$ の微分は $\dfrac{1}{x}$ です。$\log e = 1$ です。`,
          easy: R`$x\log x$ は「$x$ と $\log x$ の積」なので、積の微分法を使います。$(\log x)'=\dfrac{1}{x}$ は暗記しておきましょう。$x \cdot \dfrac{1}{x}=1$ になるので、$y'=\log x+1$ です。$\log e$ は「$e$ を何乗すると $e$ か」なので $1$。したがって $y'=1+1=2$ です。` },
        { t: R`指数関数 $a^{x}$ の微分（(2)）`,
          m: [R`(a^{x})' = a^{x}\log a`,
              R`y' = 2^{x}\log 2 \;\Rightarrow\; x=3:\quad 2^{3}\log 2 = 8\log 2`],
          n: R`$a^{x}$ の微分は、$a^{x}$ に $\log a$ をかけた形です（$a=e$ のときは $\log e=1$ なので $(e^{x})'=e^{x}$ になります）。`,
          easy: R`$e^{x}$ は微分しても変わらない特別な関数ですが、底が $e$ でない $2^{x}$ は、微分すると**係数 $\log 2$ がかかります**（$\log 2 \fallingdotseq 0.693$）。$x=3$ では $2^{3}=8$ なので、傾きは $8\log 2 \fallingdotseq 5.55$ です。` }
      ],
      tags: ['対数関数の微分', '指数関数の微分']
    },

    /* ---------- 積分法（数III）（m-integ3） ---------- */
    {
      id: 'd-m-integ3-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-integ3',
      title: '基本の定積分（対数・指数）',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$\log$ は自然対数、$e$ は自然対数の底とする。次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\int_{1}^{e^{2}} \dfrac{1}{x}\,dx$`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$\int_{0}^{1} e^{2x}\,dx$`, type: 'num', answer: (Math.exp(2) - 1) / 2, show: R`\frac{e^{2}-1}{2}`, hint: R`自然対数の底を含む値は 2e+1 や e^(3/2) のように入力` }
      ],
      solution: [
        { t: R`$\dfrac{1}{x}$ の原始関数は $\log x$（(1)）`,
          m: R`\int_{1}^{e^{2}} \frac{1}{x}\,dx = \left[\log x\right]_{1}^{e^{2}} = \log e^{2} - \log 1 = 2 - 0 = 2`,
          n: R`$\dfrac{1}{x}$ は $\log x$ を微分した形です（$x>0$）。$\log e^{2}=2$、$\log 1=0$ です。`,
          easy: R`「微分すると $\dfrac{1}{x}$ になる関数」は $\log x$（自然対数）です。定積分は、上端 $e^{2}$ の値から下端 $1$ の値を引きます。$\log e^{2}$ は「$e$ を何乗すると $e^{2}$ か」なので $2$、$\log 1=0$（どんな底でも $1$ の対数は $0$）なので、答えは $2$ です。` },
        { t: R`$e^{ax}$ の原始関数は $\dfrac{1}{a}e^{ax}$（(2)）`,
          m: R`\int_{0}^{1} e^{2x}\,dx = \left[\frac{1}{2}e^{2x}\right]_{0}^{1} = \frac{e^{2} - 1}{2}`,
          n: R`$\left(\dfrac{1}{2}e^{2x}\right)' = \dfrac{1}{2} \cdot 2e^{2x} = e^{2x}$ より、原始関数は $\dfrac{1}{2}e^{2x}$ です。上端・下端を代入して引きます（$e^{0}=1$）。`,
          easy: R`$e^{2x}$ を微分すると、中身 $2x$ の微分 $2$ が前に出て $2e^{2x}$ になります。余分な $2$ を打ち消すために、あらかじめ $\dfrac{1}{2}$ をかけておけば、微分して $e^{2x}$ に戻ります。だから原始関数は $\dfrac{1}{2}e^{2x}$。$x=1$ のとき $\dfrac{e^{2}}{2}$、$x=0$ のとき $\dfrac{1}{2}$ なので、差は $\dfrac{e^{2}-1}{2}$ です。` }
      ],
      tags: ['定積分', '指数関数の積分', '対数']
    },

    {
      id: 'd-m-integ3-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-integ3',
      title: '置換積分の基本',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\int_{0}^{1} x(x^{2}+1)^{3}\,dx$`, type: 'num', answer: 15 / 8, show: R`\frac{15}{8}`, hint: R`例: 3/4 や 0.75` },
        { label: '(2)', q: R`$\int_{0}^{1} 2xe^{x^{2}}\,dx$`, type: 'num', answer: Math.E - 1, show: R`e-1`, hint: R`自然対数の底を含む値は 2e+1 や e^(3/2) のように入力` }
      ],
      solution: [
        { t: R`$u = x^{2}+1$ と置換する（(1)）`,
          m: [R`u = x^{2} + 1 \;\Rightarrow\; du = 2x\,dx, \quad x\,dx = \frac{1}{2}du, \qquad x: 0 \to 1 \;\text{のとき}\; u: 1 \to 2`,
              R`\int_{0}^{1} x(x^{2}+1)^{3}\,dx = \frac{1}{2}\int_{1}^{2} u^{3}\,du = \frac{1}{2}\left[\frac{u^{4}}{4}\right]_{1}^{2} = \frac{1}{2} \cdot \frac{16 - 1}{4} = \frac{15}{8}`],
          n: R`かっこの中身 $x^{2}+1$ を $u$ とおくと、その微分 $2x$ が（定数倍を除いて）外側の $x$ としてちょうど現れます。積分範囲も $u$ の範囲に直します。`,
          easy: R`積分の中に「ある関数 $x^{2}+1$ と、その微分 $2x$（の定数倍）」が一緒に入っているときは、**置換積分**が使えます。$x^{2}+1$ を新しい文字 $u$ に置きかえると、$x\,dx$ が $\dfrac{1}{2}du$ に変わり、$u$ の累乗の積分というやさしい形になります。$x=0$ のとき $u=1$、$x=1$ のとき $u=2$ と、積分範囲も置きかえましょう。` },
        { t: R`$u = x^{2}$ と置換する（(2)）`,
          m: [R`u = x^{2} \;\Rightarrow\; du = 2x\,dx, \qquad x: 0 \to 1 \;\text{のとき}\; u: 0 \to 1`,
              R`\int_{0}^{1} 2xe^{x^{2}}\,dx = \int_{0}^{1} e^{u}\,du = \left[e^{u}\right]_{0}^{1} = e - 1`],
          n: R`指数の中身 $x^{2}$ を $u$ とおくと、$2x\,dx=du$ がそのまま現れます。`,
          easy: R`$e^{x^{2}}$ の指数の中身 $x^{2}$ を $u$ とおくと、その微分 $2x$ が、ちょうど積分の中の「$2x\,dx$」に当たります。それを $du$ に置きかえれば、$\int e^{u}\,du$ という簡単な積分に変わります。$e^{u}$ は積分しても $e^{u}$ のままなので、$e^{1}-e^{0}=e-1$ です。` }
      ],
      tags: ['置換積分']
    },

    {
      id: 'd-m-integ3-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-integ3',
      title: '部分積分の基本',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`$\log$ は自然対数、$e$ は自然対数の底とする。次の値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\int_{0}^{1} xe^{x}\,dx$`, type: 'num', answer: 1 },
        { label: '(2)', q: R`$\int_{1}^{e} x\log x\,dx$`, type: 'num', answer: (Math.exp(2) + 1) / 4, show: R`\frac{e^{2}+1}{4}`, hint: R`自然対数の底を含む値は 2e+1 や e^(3/2) のように入力` }
      ],
      solution: [
        { t: R`$x$ を微分して消す部分積分（(1)）`,
          m: [R`\int_{0}^{1} xe^{x}\,dx = \left[xe^{x}\right]_{0}^{1} - \int_{0}^{1} e^{x}\,dx`,
              R`= e - \left[e^{x}\right]_{0}^{1} = e - (e - 1) = 1`],
          n: R`部分積分の公式 $\int f g'\,dx = fg - \int f'g\,dx$ を、$f=x,\ g'=e^{x}$（$g=e^{x}$）として使います。`,
          easy: R`「$x$ のような 1 次式 × 指数関数や三角関数」の積分は、**部分積分**で $x$ を微分して消します。公式は「前 × 後ろの原始関数 − ∫（前の微分 × 後ろの原始関数）」です。前を $x$、後ろを $e^{x}$ とすると、$x$ を微分して $1$ になるので、残りの積分が $\int e^{x}\,dx$ という簡単な形になります。` },
        { t: R`$\log x$ は微分して簡単になる方を前に（(2)）`,
          m: [R`\int_{1}^{e} x\log x\,dx = \left[\frac{x^{2}}{2}\log x\right]_{1}^{e} - \int_{1}^{e} \frac{x^{2}}{2} \cdot \frac{1}{x}\,dx`,
              R`= \frac{e^{2}}{2} - \left[\frac{x^{2}}{4}\right]_{1}^{e} = \frac{e^{2}}{2} - \frac{e^{2} - 1}{4} = \frac{e^{2} + 1}{4}`],
          n: R`$f=\log x,\ g'=x$（$g=\dfrac{x^{2}}{2}$）とします。$\log x$ は微分すると $\dfrac{1}{x}$ という簡単な形になるので、前に選びます。`,
          easy: R`$\log x$ は積分しにくい関数ですが、微分すると $\dfrac{1}{x}$ と簡単になります。そこで、$\log x$ を「微分する側（前）」、$x$ を「積分する側（後ろ）」にします。$x$ の原始関数は $\dfrac{x^{2}}{2}$ で、積の積分は $\dfrac{x^{2}}{2}\log x$ から、微分した $\dfrac{1}{x}$ との積 $\dfrac{x}{2}$ の積分を引きます。` }
      ],
      tags: ['部分積分']
    },

    /* ---------- 複素数平面（m-cplane） ---------- */
    {
      id: 'd-m-cplane-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-cplane',
      title: '絶対値と偏角',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`複素数 $z = -1 + \sqrt{3}\,i$ について答えよ。偏角は $0 \le \arg z < 2\pi$ の範囲で答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`絶対値 $|z|$ を求めよ。`, type: 'num', answer: 2 },
        { label: '(2)', q: R`偏角 $\arg z$（ラジアン）を求めよ。`, type: 'num', answer: 2 * Math.PI / 3, show: R`\frac{2}{3}\pi`, hint: R`例: 3π/4 や 3*pi/4` }
      ],
      solution: [
        { t: R`絶対値は原点からの距離（(1)）`,
          m: R`|z| = \sqrt{(-1)^{2} + (\sqrt{3})^{2}} = \sqrt{1 + 3} = 2`,
          n: R`$z=a+bi$ の絶対値は $|z|=\sqrt{a^{2}+b^{2}}$ で、複素数平面上で原点から点 $(a,\ b)$ までの距離です。`,
          easy: R`複素数 $a+bi$ を、横軸を実部、縦軸を虚部とした平面上の点 $(a,\ b)$ と考えます（**複素数平面**）。$z=-1+\sqrt{3}\,i$ は点 $(-1,\ \sqrt{3})$ です。**絶対値** $|z|$ は、この点と原点との距離で、三平方の定理で $\sqrt{(-1)^{2}+(\sqrt{3})^{2}}=\sqrt{4}=2$ と求まります。` },
        { t: R`$\cos$, $\sin$ から偏角を決める（(2)）`,
          m: R`z = 2\left(-\frac{1}{2} + \frac{\sqrt{3}}{2}\,i\right) = 2\left(\cos\frac{2}{3}\pi + i\sin\frac{2}{3}\pi\right)`,
          n: R`$|z|=2$ でくくると、$\cos\theta=-\dfrac{1}{2},\ \sin\theta=\dfrac{\sqrt{3}}{2}$ となる $\theta$ が偏角です。$\cos$ が負、$\sin$ が正なので第 2 象限の角で、$\theta=\dfrac{2}{3}\pi$ です。`,
          easy: R`**偏角**は、$x$ 軸の正の向き（実軸の正の部分）から、原点と点を結ぶ線まで反時計回りに測った角です。まず $|z|=2$ でくくって、実部 $-\dfrac{1}{2}$ と虚部 $\dfrac{\sqrt{3}}{2}$ を見ます。点は**第 2 象限**（左上）にあり、$\cos\theta=-\dfrac{1}{2}$ となる角は $120\degree=\dfrac{2}{3}\pi$ です。` }
      ],
      tags: ['絶対値', '偏角', '極形式']
    },

    {
      id: 'd-m-cplane-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-cplane',
      title: '積と商の絶対値・偏角',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`$z_{1} = 2\left(\cos\dfrac{\pi}{6} + i\sin\dfrac{\pi}{6}\right),\ z_{2} = 3\left(\cos\dfrac{\pi}{3} + i\sin\dfrac{\pi}{3}\right)$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$|z_{1}z_{2}|$ を求めよ。`, type: 'num', answer: 6 },
        { label: '(2)', q: R`$\dfrac{z_{2}}{z_{1}}$ の偏角（ラジアン）を求めよ。`, type: 'num', answer: Math.PI / 6, show: R`\frac{\pi}{6}`, hint: R`例: 3π/4（3*pi/4 でも可）` }
      ],
      solution: [
        { t: R`積の絶対値は絶対値の積（(1)）`,
          m: R`|z_{1}z_{2}| = |z_{1}||z_{2}| = 2 \times 3 = 6`,
          n: R`$z_{1}$ の絶対値は $2$、$z_{2}$ の絶対値は $3$ です。かけ算では、絶対値はかけ算になり、偏角は足し算になります。`,
          easy: R`極形式 $r(\cos\theta+i\sin\theta)$ では、$r$ が絶対値（原点からの距離）、$\theta$ が偏角（向きの角）です。複素数どうしをかけると、「**距離はかけ算、角は足し算**」になります。$z_{1}$ の距離は $2$、$z_{2}$ の距離は $3$ なので、積の距離は $2 \times 3=6$ です。` },
        { t: R`商の偏角は偏角の差（(2)）`,
          m: R`\arg\frac{z_{2}}{z_{1}} = \arg z_{2} - \arg z_{1} = \frac{\pi}{3} - \frac{\pi}{6} = \frac{\pi}{6}`,
          n: R`割り算では、絶対値は割り算（$\dfrac{3}{2}$）、偏角は引き算になります。$\arg z_{1}=\dfrac{\pi}{6},\ \arg z_{2}=\dfrac{\pi}{3}$ です。`,
          easy: R`割り算は「かけ算の逆」なので、角は引き算になります。$z_{2}$ の向きは $\dfrac{\pi}{3}$（$60\degree$）、$z_{1}$ の向きは $\dfrac{\pi}{6}$（$30\degree$）。商 $\dfrac{z_{2}}{z_{1}}$ の向きは $60\degree-30\degree=30\degree$、ラジアンで $\dfrac{\pi}{6}$ です。` }
      ],
      tags: ['積と商', '偏角']
    },

    {
      id: 'd-m-cplane-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-cplane',
      title: 'ド・モアブルの定理',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$(1 + i)^{8}$ の値を求めよ。`, type: 'num', answer: 16 },
        { label: '(2)', q: R`$\left(\cos\dfrac{\pi}{9} + i\sin\dfrac{\pi}{9}\right)^{3}$ の実部を求めよ。`, type: 'num', answer: 1 / 2, show: R`\frac{1}{2}`, hint: R`例: 3/4 や 0.75` }
      ],
      solution: [
        { t: R`極形式にして $n$ 乗する（(1)）`,
          m: [R`1 + i = \sqrt{2}\left(\cos\frac{\pi}{4} + i\sin\frac{\pi}{4}\right)`,
              R`(1+i)^{8} = (\sqrt{2})^{8}\left(\cos 2\pi + i\sin 2\pi\right) = 16 \cdot (1 + 0i) = 16`,
              R`(\sqrt{2})^{8} = 2^{4} = 16`],
          n: R`**ド・モアブルの定理** $\{r(\cos\theta+i\sin\theta)\}^{n}=r^{n}(\cos n\theta+i\sin n\theta)$ を使います。$|1+i|=\sqrt{2},\ \arg(1+i)=\dfrac{\pi}{4}$ で、$8$ 乗すると偏角は $\dfrac{\pi}{4} \times 8=2\pi$ です。`,
          easy: R`$(1+i)^{8}$ をそのまま 8 回かけるのは大変です。そこで、$1+i$ を「距離 $\sqrt{2}$、角 $45\degree$」の形（極形式）に直します。複素数を $n$ 回かけると、「**距離は $n$ 乗、角は $n$ 倍**」になるので、距離は $(\sqrt{2})^{8}=16$、角は $45\degree \times 8=360\degree$（ちょうど 1 周）。1 周まわると実軸の正の方向にもどるので、答えは $16$ です。` },
        { t: R`すでに極形式のときは、角を $n$ 倍するだけ（(2)）`,
          m: [R`\left(\cos\frac{\pi}{9} + i\sin\frac{\pi}{9}\right)^{3} = \cos\frac{3\pi}{9} + i\sin\frac{3\pi}{9} = \cos\frac{\pi}{3} + i\sin\frac{\pi}{3}`,
              R`= \frac{1}{2} + \frac{\sqrt{3}}{2}\,i \;\Rightarrow\; \text{実部 } \frac{1}{2}`],
          n: R`絶対値が $1$ なので、ド・モアブルの定理で $3$ 乗すると、偏角が $3$ 倍の $\dfrac{3\pi}{9}=\dfrac{\pi}{3}$ になるだけです。実部は $\cos\dfrac{\pi}{3}=\dfrac{1}{2}$ です。`,
          easy: R`この複素数は、距離が $1$（半径 $1$ の円の上）で、角が $\dfrac{\pi}{9}$（$20\degree$）の点です。$3$ 乗すると、角が $3$ 倍の $60\degree$（$\dfrac{\pi}{3}$）になります。実部は、その点の $x$ 座標なので $\cos 60\degree=\dfrac{1}{2}$ です。` }
      ],
      tags: ['ド・モアブルの定理', '極形式']
    },

    /* ---------- 2次曲線（m-conic） ---------- */
    {
      id: 'd-m-conic-01',
      subject: 'math',
      level: 'drill',
      unit: 'm-conic',
      title: '放物線の焦点と準線',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`放物線 $y^{2} = 8x$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`焦点の $x$ 座標を求めよ。`, type: 'num', answer: 2 },
        { label: '(2)', q: R`焦点と準線の距離を求めよ。`, type: 'num', answer: 4 }
      ],
      solution: [
        { t: R`$y^{2} = 4px$ の形に直して $p$ を読み取る（(1)）`,
          m: [R`y^{2} = 4px \text{ と比べて } 4p = 8 \;\Rightarrow\; p = 2`,
              R`\text{焦点 } (p,\ 0) = (2,\ 0), \qquad \text{準線 } x = -p = -2`],
          n: R`放物線 $y^{2}=4px$ の焦点は $(p,\ 0)$、準線は直線 $x=-p$ です。$4p=8$ より $p=2$ です。`,
          easy: R`放物線は、「**焦点**とよばれる点 F と、**準線**とよばれる直線から等しい距離にある点の集まり」です。式が $y^{2}=4px$ の形のとき、焦点は $(p,\ 0)$、準線は $x=-p$ になります。$y^{2}=8x$ では $4p=8$ なので $p=2$、焦点は $(2,\ 0)$ で、準線は $x=-2$ です。` },
        { t: R`焦点と準線の距離（(2)）`,
          m: R`2 - (-2) = 4 \;(= 2p)`,
          n: R`焦点 $x=2$ と準線 $x=-2$ の距離は $2p=4$ です。放物線の頂点（原点）は、焦点と準線のちょうど真ん中にあります。`,
          easy: R`焦点は $x=2$ の位置、準線は $x=-2$ の位置にあるので、その間の距離は $2-(-2)=4$ です。頂点（原点）はちょうど真ん中にあり、頂点から焦点までも、頂点から準線までも $p=2$ です。図で、放物線の上の点が焦点と準線から等しい距離にあるようすを確かめてみましょう。`,
          fig: figParabola() }
      ],
      tags: ['放物線', '焦点', '準線']
    },

    {
      id: 'd-m-conic-02',
      subject: 'math',
      level: 'drill',
      unit: 'm-conic',
      title: '楕円の焦点（縦長の場合）',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`楕円 $\dfrac{x^{2}}{9} + \dfrac{y^{2}}{25} = 1$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`2 つの焦点のうち、$y$ 座標が正である方の $y$ 座標を求めよ。`, type: 'num', answer: 4 },
        { label: '(2)', q: R`楕円上の点から 2 つの焦点までの距離の和を求めよ。`, type: 'num', answer: 10 }
      ],
      solution: [
        { t: R`長い方の軸を見きわめて、焦点の位置を求める（(1)）`,
          m: [R`25 > 9 \;\Rightarrow\; y \text{ 軸方向に長い楕円}, \quad a^{2} = 25,\ b^{2} = 9`,
              R`c^{2} = a^{2} - b^{2} = 25 - 9 = 16 \;\Rightarrow\; c = 4, \quad \text{焦点 } (0,\ \pm 4)`],
          n: R`$x^{2}$ と $y^{2}$ の分母のうち大きい方（$25$）が長軸の半分の 2 乗です。分母が大きいのは $y^{2}$ の側なので、長軸は $y$ 軸上にあり、焦点も $y$ 軸上の $(0,\ \pm c)$ です。`,
          easy: R`楕円は、細長い方向に焦点が並びます。どちらが細長いかは、**分母が大きい方の文字の向き**です。$\dfrac{x^{2}}{9}+\dfrac{y^{2}}{25}=1$ では、$y^{2}$ の分母 $25$ の方が大きいので、**縦（$y$ 軸方向）に長い**楕円です。焦点までの距離 $c$ は、大きい分母から小さい分母を引いた $25-9=16$ の平方根 $4$ で、焦点は $(0,\ 4)$ と $(0,\ -4)$ です。`,
          fig: figEllipseTall() },
        { t: R`焦点からの距離の和 = 長軸の長さ（(2)）`,
          m: R`\mathrm{PF} + \mathrm{PF'} = 2a = 2 \times 5 = 10`,
          n: R`楕円は「2 つの焦点からの距離の和が一定（$=2a$、長軸の長さ）」の点の集まりです。長軸の半分 $a=\sqrt{25}=5$ です。`,
          easy: R`楕円の定義は「2 つの焦点 F, F' からの距離の和 $\mathrm{PF}+\mathrm{PF'}$ が一定になる点 P の集まり」です。この一定の値が長軸の長さ $2a$ に等しくなります。この楕円の長軸の半分は $5$（上下の端が $(0,\ \pm 5)$）なので、距離の和は $10$ です。` }
      ],
      tags: ['楕円', '焦点', '長軸']
    },

    {
      id: 'd-m-conic-03',
      subject: 'math',
      level: 'drill',
      unit: 'm-conic',
      title: '双曲線の焦点と漸近線',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`双曲線 $\dfrac{x^{2}}{9} - \dfrac{y^{2}}{16} = 1$ について答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`焦点のうち、$x$ 座標が正である方の $x$ 座標を求めよ。`, type: 'num', answer: 5 },
        { label: '(2)', q: R`漸近線のうち、傾きが正であるものの方程式を $y = \boxed{\ \ }$ の形で答えよ。`, type: 'expr', answer: '4x/3', vars: ['x'], show: R`\frac{4}{3}x`, hint: R`例: 2x/5` }
      ],
      solution: [
        { t: R`双曲線の焦点：$c^{2} = a^{2} + b^{2}$（(1)）`,
          m: R`c^{2} = a^{2} + b^{2} = 9 + 16 = 25 \;\Rightarrow\; c = 5, \quad \text{焦点 } (\pm 5,\ 0)`,
          n: R`双曲線 $\dfrac{x^{2}}{a^{2}}-\dfrac{y^{2}}{b^{2}}=1$ の焦点は $(\pm c,\ 0)$、$c=\sqrt{a^{2}+b^{2}}$ です。楕円（$c^{2}=a^{2}-b^{2}$）と引き算・足し算を取り違えないようにしましょう。`,
          easy: R`双曲線は、「2 つの焦点からの距離の**差**が一定」の点の集まりで、x 軸の左右に 2 本の曲線が開いた形です。焦点までの距離 $c$ は、$a^{2}$ と $b^{2}$ を**足した**値の平方根で決まります（楕円は引き算でした）。$9+16=25$ なので $c=5$、焦点は $(5,\ 0)$ と $(-5,\ 0)$ です。` },
        { t: R`漸近線は右辺を $0$ にして求める（(2)）`,
          m: [R`\frac{x^{2}}{9} - \frac{y^{2}}{16} = 0 \;\Rightarrow\; y^{2} = \frac{16}{9}x^{2} \;\Rightarrow\; y = \pm\frac{4}{3}x`,
              R`\text{傾きが正のもの: } y = \frac{4}{3}x`],
          n: R`漸近線は、曲線がどんどん近づいていく直線です。右辺の $1$ を $0$ にした式 $\dfrac{x^{2}}{a^{2}}-\dfrac{y^{2}}{b^{2}}=0$ から、$y=\pm\dfrac{b}{a}x$ が得られます。ここでは $a=3,\ b=4$ です。`,
          easy: R`$x$ や $y$ がものすごく大きいとき、式の右辺の $1$ は無視できるほど小さいので、$\dfrac{x^{2}}{9}-\dfrac{y^{2}}{16}\fallingdotseq 0$ とみなせます。この式を整理した $y=\pm\dfrac{4}{3}x$ が、曲線が限りなく近づく直線（**漸近線**）です。図の破線が漸近線で、双曲線がその直線に挟まれた形で開いていきます。`,
          fig: figHyperbola() }
      ],
      tags: ['双曲線', '焦点', '漸近線']
    }
  ]);
})();
