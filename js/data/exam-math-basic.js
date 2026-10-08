/* GOKAKU NAVI — 数学 問題バンク（共通テスト/基礎レベル）
   数学の全単元（grade 1 以上の 20 単元）を 1 問ずつ、頻出 4 単元（2次関数・場合の数と確率・微分積分(数II)・数列）は 2 問ずつ、計 24 問。
   すべて書き下ろしのオリジナル問題（既存の入試問題・参考書の文面は含まない）。 */
(function () {
  'use strict';
  const R = String.raw;

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // 2次関数 f(x) = 2x^2 - 8x + 5 のグラフ（問題図）
  function figQuad1() {
    const f = function (x) { return 2 * x * x - 8 * x + 5; };
    return JK.plot.graph({
      w: 340, h: 240, x: [-1, 5], y: [-5, 16],
      curves: [{ f: f, cls: 'c1' }],
      vlines: [{ x: 1, label: 'x=1' }, { x: 4, label: 'x=4' }],
      labels: [{ x: 4.5, y: 11.5, text: 'C', cls: 'c1' }]
    });
  }
  // 同・解説図（頂点と区間の端点）
  function figQuad1Sol() {
    const f = function (x) { return 2 * x * x - 8 * x + 5; };
    return JK.plot.graph({
      w: 340, h: 240, x: [-1, 5], y: [-5, 16],
      curves: [{ f: f, cls: 'c1' }],
      vlines: [{ x: 1, dash: true }, { x: 4, dash: true }, { x: 2, label: '軸 x=2', cls: 'c3' }],
      points: [
        { x: 2, y: -3, label: '頂点(2, -3)', cls: 'c3', pos: 'br' },
        { x: 1, y: -1, label: '(1, -1)', cls: 'c2', pos: 'bl' },
        { x: 4, y: 5, label: '(4, 5)', cls: 'c2', pos: 'tl' }
      ]
    });
  }

  // m(a) のグラフ（場合分けした最小値）
  function figQuad2Sol() {
    return JK.plot.graph({
      w: 340, h: 230, x: [-3, 4], y: [-3, 8],
      curves: [
        { f: function (a) { return a + 6; }, domain: [-3, 0], cls: 'c1' },
        { f: function (a) { return -a * a + a + 6; }, domain: [0, 2], cls: 'c2' },
        { f: function (a) { return 10 - 3 * a; }, domain: [2, 4], cls: 'c3' }
      ],
      hlines: [{ y: 6.25, dash: true }],
      points: [{ x: 0.5, y: 6.25, label: '最大値 25/4', cls: 'c3', pos: 'tr' }],
      axis: ['a', 'm']
    });
  }

  // 三角形 ABC（AB=5, BC=7, CA=6）
  function figTriangle() {
    const d = JK.plot.draw(340, 220);
    const k = 38;
    const B = [34, 190], C = [34 + 7 * k, 190];
    const ax = (25 - 36 + 49) / 14;                       // A の x（B を原点、BC 方向を x 軸にした座標・単位は辺の長さ）
    const A = [B[0] + ax * k, B[1] - Math.sqrt(25 - ax * ax) * k];
    d.poly([A, B, C], { cls: 'fg', fill: 'f1' });
    const deg = function (P, Q) { return Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) * 180 / Math.PI; };
    d.arc(A[0], A[1], 26, deg(A, B), deg(A, C), { cls: 'c3' });
    d.text(A[0], A[1] - 9, 'A', { size: 14, italic: true });
    d.text(B[0] - 12, B[1] + 14, 'B', { size: 14, italic: true });
    d.text(C[0] + 12, C[1] + 14, 'C', { size: 14, italic: true });
    d.text((A[0] + B[0]) / 2 - 14, (A[1] + B[1]) / 2 + 4, '5', { cls: 'c1', size: 13 });
    d.text((B[0] + C[0]) / 2, B[1] + 18, '7', { cls: 'c1', size: 13 });
    d.text((A[0] + C[0]) / 2 + 14, (A[1] + C[1]) / 2 + 4, '6', { cls: 'c1', size: 13 });
    return d.svg();
  }

  // 散布図（データの分析）。withMeans=true で平均の補助線つき
  function figScatter(withMeans) {
    const xs = [2, 4, 6, 8, 10], ys = [4, 3, 5, 6, 7];
    const o = {
      w: 340, h: 240, x: [0, 12], y: [0, 9],
      points: xs.map(function (x, i) { return { x: x, y: ys[i], cls: 'c1' }; }),
      axis: ['x', 'y']
    };
    if (withMeans) {
      o.vlines = [{ x: 6, label: 'xの平均 6', cls: 'c3' }];
      o.hlines = [{ y: 5, label: 'yの平均 5', cls: 'c3' }];
    }
    return JK.plot.graph(o);
  }

  // △ABC と 3 本のチェバ線（BD:DC=2:3, CE:EA=3:1, AF:FB=1:2）
  function figCevians() {
    const d = JK.plot.draw(340, 232);
    const A = [170, 24], B = [36, 196], C = [318, 196];
    const lerp = function (P, Q, t) { return [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]; };
    const D = lerp(B, C, 2 / 5), E = lerp(C, A, 3 / 4), F = lerp(A, B, 1 / 3), P = lerp(A, D, 5 / 11);
    d.poly([A, B, C], { cls: 'fg', fill: 'f0' });
    d.line(A[0], A[1], D[0], D[1], { cls: 'c1' });
    d.line(B[0], B[1], E[0], E[1], { cls: 'c2' });
    d.line(C[0], C[1], F[0], F[1], { cls: 'c4' });
    [A, B, C, D, E, F].forEach(function (Q) { d.dot(Q[0], Q[1], { cls: 'fg', r: 2.5 }); });
    d.dot(P[0], P[1], { cls: 'c3', r: 3.5 });
    d.text(A[0], A[1] - 8, 'A', { size: 14, italic: true });
    d.text(B[0] - 12, B[1] + 6, 'B', { size: 14, italic: true });
    d.text(C[0] + 12, C[1] + 6, 'C', { size: 14, italic: true });
    d.text(D[0], D[1] + 17, 'D', { size: 14, italic: true });
    d.text(E[0] + 13, E[1] - 2, 'E', { size: 14, italic: true });
    d.text(F[0] - 13, F[1] - 2, 'F', { size: 14, italic: true });
    d.text(P[0] + 11, P[1] + 15, 'P', { size: 14, italic: true, cls: 'c3' });
    // 比の目印
    d.text((B[0] + D[0]) / 2, B[1] + 17, '2', { cls: 'dim', size: 12 });
    d.text((D[0] + C[0]) / 2 + 20, C[1] + 17, '3', { cls: 'dim', size: 12 });
    d.text((C[0] + E[0]) / 2 + 12, (C[1] + E[1]) / 2 + 4, '3', { cls: 'dim', size: 12 });
    d.text((E[0] + A[0]) / 2 + 12, (E[1] + A[1]) / 2 + 2, '1', { cls: 'dim', size: 12 });
    return d.svg();
  }

  // 円 C: (x-2)^2+(y+1)^2=25 と直線 l: 3x+4y-17=0（full=true で解説図: 接線・垂線・半径つき）
  function figCircle(full) {
    const o = {
      w: 340, h: 260, x: [-5, 9], y: [-7, 7], equal: true,
      param: [{ x: function (t) { return 2 + 5 * Math.cos(t); }, y: function (t) { return -1 + 5 * Math.sin(t); }, t: [0, 2 * Math.PI], cls: 'c1' }],
      curves: [{ f: function (x) { return (17 - 3 * x) / 4; }, cls: 'c2' }],
      labels: [{ x: -3.9, y: 6, text: 'l', cls: 'c2' }, { x: -2.6, y: -4.1, text: 'C', cls: 'c1' }],
      points: [{ x: 5, y: 3, label: 'P(5, 3)', cls: 'c3', pos: 'tr' }]
    };
    if (full) {
      o.curves.push({ f: function (x) { return (27 - 3 * x) / 4; }, cls: 'c3', dash: true });
      o.points.push({ x: 2, y: -1, label: '中心(2, -1)', cls: 'c4', pos: 'br' });
      o.points.push({ x: 3.8, y: 1.4, label: 'H', cls: 'fg', pos: 'bl' });
      o.segs = [
        { x1: 2, y1: -1, x2: 3.8, y2: 1.4, cls: 'c4', dash: true },
        { x1: 2, y1: -1, x2: 5, y2: 3, cls: 'c4' }
      ];
    }
    return JK.plot.graph(o);
  }

  // f(θ) = sinθ + √3 cosθ のグラフと y=1 の交点
  function figTrigSum() {
    const PI = Math.PI;
    return JK.plot.graph({
      w: 340, h: 240, x: [0, 2 * PI + 0.2], y: [-2.5, 2.5],
      curves: [{ f: function (t) { return Math.sin(t) + Math.sqrt(3) * Math.cos(t); }, cls: 'c1' }],
      hlines: [{ y: 1, dash: true, label: 'y=1' }],
      points: [
        { x: PI / 2, y: 1, label: 'π/2', cls: 'c3', pos: 'tr' },
        { x: 11 * PI / 6, y: 1, label: '11π/6', cls: 'c3', pos: 'tl' }
      ],
      axis: ['θ', 'y']
    });
  }

  // y = log2(x-1) + log2(x+2) と y = 2
  function figLogIneq() {
    return JK.plot.graph({
      w: 340, h: 240, x: [0, 5], y: [-3, 5],
      curves: [{ f: function (x) { return Math.log(x - 1) / Math.LN2 + Math.log(x + 2) / Math.LN2; }, cls: 'c1' }],
      hlines: [{ y: 2, dash: true, label: 'y=2' }],
      vlines: [{ x: 1, dash: true, label: 'x=1', cls: 'c2' }],
      points: [{ x: 2, y: 2, label: '(2, 2)', cls: 'c3', pos: 'br' }]
    });
  }

  // 3 次関数 f(x) = x^3 - 6x^2 + 9x + 1
  function figCubic() {
    const f = function (x) { return x * x * x - 6 * x * x + 9 * x + 1; };
    return JK.plot.graph({
      w: 340, h: 250, x: [-1, 5], y: [-3, 8],
      curves: [{ f: f, cls: 'c1' }],
      hlines: [{ y: 5, dash: true }, { y: 1, dash: true }],
      points: [
        { x: 1, y: 5, label: '極大(1, 5)', cls: 'c3', pos: 'tr' },
        { x: 3, y: 1, label: '極小(3, 1)', cls: 'c3', pos: 'br' }
      ]
    });
  }

  // f(x) = x^2 - 4x + 3 と x 軸の間（符号ごとに色分け）
  function figParabolaArea() {
    const f = function (x) { return x * x - 4 * x + 3; };
    return JK.plot.graph({
      w: 340, h: 240, x: [-0.5, 4.5], y: [-1.6, 3.6],
      curves: [{ f: f, cls: 'c1' }],
      fills: [
        { f: f, from: 0, to: 1, cls: 'f1' },
        { f: f, from: 1, to: 3, cls: 'f3' },
        { f: f, from: 3, to: 4, cls: 'f1' }
      ],
      points: [{ x: 1, y: 0, cls: 'fg' }, { x: 3, y: 0, cls: 'fg' }]
    });
  }

  // ベクトル a=(3,1), b=(1,2)（△OAB）
  // withMin=true で解説図（最小となる t=-1 のとき a+tb = BA が b に垂直、長さ √5）
  function figVec(withMin) {
    const o = {
      w: 340, h: 240, x: [-1, 5], y: [-1.2, 3.4], equal: true,
      segs: [
        { x1: 0, y1: 0, x2: 3, y2: 1, cls: 'c1', arrow: true },
        { x1: 0, y1: 0, x2: 1, y2: 2, cls: 'c2', arrow: true },
        { x1: 3, y1: 1, x2: 1, y2: 2, cls: withMin ? 'c3' : 'dim', dash: !withMin }
      ],
      points: [
        { x: 3, y: 1, label: 'A(3, 1)', cls: 'c1', pos: 'br' },
        { x: 1, y: 2, label: 'B(1, 2)', cls: 'c2', pos: 'tl' }
      ],
      labels: [
        { x: 1.7, y: 0.1, text: 'a', cls: 'c1' },
        { x: 0.1, y: 1.25, text: 'b', cls: 'c2' }
      ]
    };
    if (withMin) {
      // B での直角の目印（OB 方向と BA 方向の単位ベクトルで小さな四角）
      const k = 0.2, s = Math.sqrt(5);
      const u = [-1 / s, -2 / s], v = [2 / s, -1 / s];
      const p1 = [1 + k * u[0], 2 + k * u[1]], p2 = [p1[0] + k * v[0], p1[1] + k * v[1]], p3 = [1 + k * v[0], 2 + k * v[1]];
      o.segs.push({ x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], cls: 'dim' });
      o.segs.push({ x1: p2[0], y1: p2[1], x2: p3[0], y2: p3[1], cls: 'dim' });
      o.labels.push({ x: 2.1, y: 1.85, text: '最小 √5', cls: 'c3' });
    }
    return JK.plot.graph(o);
  }

  // y = x^2 e^{-x}（極大・変曲点・x=3 での接線）
  function figXsqExp() {
    const f = function (x) { return x * x * Math.exp(-x); };
    const s2 = Math.sqrt(2);
    return JK.plot.graph({
      w: 340, h: 240, x: [-0.6, 7.2], y: [-0.1, 0.7],
      curves: [{ f: f, cls: 'c1' }],
      segs: [{ x1: 3, y1: f(3), x2: 6, y2: 0, cls: 'c3', dash: true }],
      points: [
        { x: 2, y: f(2), label: '極大', cls: 'c3', pos: 'tr' },
        { x: 2 - s2, y: f(2 - s2), label: '変曲点', cls: 'c4', pos: 'br' },
        { x: 2 + s2, y: f(2 + s2), label: '変曲点', cls: 'c4', pos: 'tr' },
        { x: 3, y: f(3), cls: 'c3' },
        { x: 6, y: 0, label: '(6, 0)', cls: 'c3', pos: 'tr' }
      ]
    });
  }

  // 曲線 y = sin x (0 ≦ x ≦ π) と x 軸で囲まれた図形 D
  function figSinRegion() {
    return JK.plot.graph({
      w: 340, h: 210, x: [-0.3, 3.6], y: [-0.25, 1.3],
      curves: [{ f: Math.sin, domain: [0, Math.PI], cls: 'c1' }],
      fills: [{ f: Math.sin, from: 0, to: Math.PI, cls: 'f1' }],
      labels: [{ x: 1.45, y: 0.4, text: 'D', cls: 'c1' }, { x: 2.45, y: 0.8, text: 'C', cls: 'c1' }]
    });
  }

  // 複素数平面: z=1+√3i, w=1+i, z/w
  function figComplex() {
    const s3 = Math.sqrt(3);
    const q = [(1 + s3) / 2, (s3 - 1) / 2];
    return JK.plot.graph({
      w: 340, h: 250, x: [-0.5, 2.5], y: [-0.4, 2.1], equal: true, axis: ['Re', 'Im'],
      param: [{ x: function (t) { return 2 * Math.cos(t); }, y: function (t) { return 2 * Math.sin(t); }, t: [0, Math.PI / 2], cls: 'dim', dash: true }],
      segs: [
        { x1: 0, y1: 0, x2: 1, y2: s3, cls: 'c1', arrow: true },
        { x1: 0, y1: 0, x2: 1, y2: 1, cls: 'c2', arrow: true },
        { x1: 0, y1: 0, x2: q[0], y2: q[1], cls: 'c3', arrow: true }
      ],
      points: [
        { x: 1, y: s3, label: 'z (60°)', cls: 'c1', pos: 'tr' },
        { x: 1, y: 1, label: 'w (45°)', cls: 'c2', pos: 'br' },
        { x: q[0], y: q[1], label: 'z/w (15°)', cls: 'c3', pos: 'br' }
      ]
    });
  }

  // 楕円 x^2/16 + y^2/7 = 1 と P(3, 7/4)（full=true で焦点・線分・接線）
  function figEllipse(full) {
    const o = {
      w: 340, h: 250, x: [-5.5, 5.5], y: [-3.6, 3.6], equal: true,
      param: [{ x: function (t) { return 4 * Math.cos(t); }, y: function (t) { return Math.sqrt(7) * Math.sin(t); }, t: [0, 2 * Math.PI], cls: 'c1' }],
      points: [{ x: 3, y: 1.75, label: 'P', cls: 'c3', pos: 'tr' }]
    };
    if (full) {
      o.points.push({ x: 3, y: 0, label: 'F', cls: 'c4', pos: 'br' });
      o.points.push({ x: -3, y: 0, label: "F'", cls: 'c4', pos: 'bl' });
      o.segs = [
        { x1: 3, y1: 1.75, x2: 3, y2: 0, cls: 'c4' },
        { x1: 3, y1: 1.75, x2: -3, y2: 0, cls: 'c4' }
      ];
      o.curves = [{ f: function (x) { return 4 - 0.75 * x; }, cls: 'c3', dash: true, domain: [-0.4, 5.3] }];
    }
    return JK.plot.graph(o);
  }

  /* @@APPEND-FIG@@ */

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ---------- 数と式 ---------- */
    {
      id: 'm-basic-expr-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-expr',
      title: '因数分解・有理化・対称式',
      source: { univ: 'オリジナル' },
      time: 6,
      body: R`次の (1)〜(4) に答えよ。ただし (2)〜(4) では $x = \dfrac{2}{\sqrt{7}-\sqrt{5}}$、$y = \dfrac{2}{\sqrt{7}+\sqrt{5}}$ とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$6x^{2} - x - 12 = (2x-3)(\boxed{\ \ })$ である。空欄に入る式を答えよ。`, type: 'expr', answer: '3x+4', vars: ['x'], show: R`3x+4`, hint: R`例: 2x+1` },
        { label: '(2)', q: R`$x$ の分母を有理化して簡単にした値を求めよ。`, type: 'num', answer: Math.sqrt(7) + Math.sqrt(5), show: R`\sqrt{7}+\sqrt{5}`, hint: R`例: √2+3 や sqrt(2)+3` },
        { label: '(3)', q: R`$x + y$ の値を求めよ。`, type: 'num', answer: 2 * Math.sqrt(7), show: R`2\sqrt{7}`, hint: R`例: 2√3` },
        { label: '(4)', q: R`$x^{2} + y^{2}$ の値を求めよ。`, type: 'num', answer: 24 }
      ],
      solution: [
        { t: 'たすき掛けで因数分解する（(1)）',
          m: R`6x^{2} - x - 12 = (2x-3)(3x+4)`,
          n: R`$6 = 2 \times 3$、$-12 = (-3) \times 4$ と分け、斜めにかけて足した値が $x$ の係数 $-1$ になる組を探します。$2 \times 4 + (-3) \times 3 = 8 - 9 = -1$ となるので、空欄に入る式は $3x+4$ です。`,
          easy: R`**たすき掛け**は「展開の逆」をパズルのように探す方法です。$(px+q)(rx+s)$ を展開すると、$x^{2}$ の係数は $pr$、定数項は $qs$、$x$ の係数は $ps+qr$ になります。そこで $pr=6$、$qs=-12$ となる組を順に試し、$ps+qr=-1$ になるものを探します。$p=2,\ q=-3,\ r=3,\ s=4$ のとき $ps+qr = 2 \times 4 + (-3) \times 3 = -1$ で一致します。` },
        { t: '検算（展開して確かめる）',
          m: R`(2x-3)(3x+4) = 6x^{2} + 8x - 9x - 12 = 6x^{2} - x - 12`,
          n: R`展開して元の式に戻れば正解です。因数分解は必ず展開で確かめる習慣をつけましょう。`,
          lv: 2 },
        { t: R`分母を有理化して $x,\ y$ を簡単にする（(2)）`,
          m: [R`x = \frac{2(\sqrt{7}+\sqrt{5})}{(\sqrt{7}-\sqrt{5})(\sqrt{7}+\sqrt{5})} = \frac{2(\sqrt{7}+\sqrt{5})}{7-5} = \sqrt{7}+\sqrt{5}`,
              R`y = \frac{2(\sqrt{7}-\sqrt{5})}{(\sqrt{7}+\sqrt{5})(\sqrt{7}-\sqrt{5})} = \frac{2(\sqrt{7}-\sqrt{5})}{7-5} = \sqrt{7}-\sqrt{5}`],
          n: R`分母が $\sqrt{7}-\sqrt{5}$ のときは、分母と分子に $\sqrt{7}+\sqrt{5}$ をかけます。$(a-b)(a+b) = a^{2}-b^{2}$ を使うと分母の根号が消えます。$y$ も同様に処理します。`,
          easy: R`分母に平方根（根号）が残っていると大きさがつかみにくいので、**分母から根号をなくす（有理化）** のが約束です。コツは、分母と分子に「分母の符号だけを変えた式」をかけること。$(a-b)(a+b)=a^{2}-b^{2}$ なので、分母は $(\sqrt{7})^{2}-(\sqrt{5})^{2}=7-5=2$ となり、根号のない数になります。分子にも同じ式をかけるので、値は変わりません。` },
        { t: '和 $x+y$ と積 $xy$ を求める（(3)）',
          m: [R`x + y = (\sqrt{7}+\sqrt{5}) + (\sqrt{7}-\sqrt{5}) = 2\sqrt{7}`,
              R`xy = (\sqrt{7}+\sqrt{5})(\sqrt{7}-\sqrt{5}) = 7 - 5 = 2`],
          n: R`$x$ と $y$ を別々に 2 乗する前に、和と積を求めておくと次の計算が楽になります。`,
          easy: R`足し算では $+\sqrt{5}$ と $-\sqrt{5}$ が打ち消し合い、$\sqrt{7}$ が 2 個で $2\sqrt{7}$ になります。かけ算は $(a+b)(a-b)=a^{2}-b^{2}$ の形なので、$7-5=2$ と根号が消えます。` },
        { t: '$x^{2}+y^{2}$ を和と積で表す（(4)）',
          m: [R`x^{2} + y^{2} = (x+y)^{2} - 2xy`,
              R`= (2\sqrt{7})^{2} - 2 \times 2 = 28 - 4 = 24`],
          n: R`$(x+y)^{2} = x^{2} + 2xy + y^{2}$ を移項すると $x^{2}+y^{2} = (x+y)^{2} - 2xy$ です。`,
          easy: R`$x$ と $y$ を入れ替えても変わらない式（**対称式**）は、和と積だけで表せます。2 乗の展開公式を「逆向き」に使うだけです。$x,\ y$ に $\sqrt{7}\pm\sqrt{5}$ を直接代入して 2 乗するより、ずっと簡単に計算できます。`,
          pro: R`対称式は「和と積で表す」が定石。$x^{3}+y^{3} = (x+y)^{3} - 3xy(x+y)$ や $\dfrac{y}{x}+\dfrac{x}{y} = \dfrac{(x+y)^{2}-2xy}{xy}$ の形で共通テストにも頻出です。` }
      ],
      tags: ['因数分解', '有理化', '対称式']
    },

    /* ---------- 2次関数 ---------- */
    {
      id: 'm-basic-quad-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-quad',
      title: '放物線の軸と最大・最小',
      source: { univ: 'オリジナル' },
      time: 6,
      body: R`2次関数 $f(x) = 2x^{2} - 8x + 5$ のグラフを $C$ とする。次の問いに答えよ。`,
      fig: figQuad1(),
      parts: [
        { label: '(1)', q: R`$C$ の軸の方程式として正しいものを選べ。`, type: 'choice', choices: [R`$x = -2$`, R`$x = 2$`, R`$x = 4$`, R`$x = -4$`], answer: 1 },
        { label: '(2)', q: R`$1 \le x \le 4$ における $f(x)$ の最大値を求めよ。`, type: 'num', answer: 5 },
        { label: '(3)', q: R`$1 \le x \le 4$ における $f(x)$ の最小値を求めよ。`, type: 'num', answer: -3 },
        { label: '(4)', q: R`$C$ が $x$ 軸から切り取る線分の長さを求めよ。`, type: 'num', answer: Math.sqrt(6), show: R`\sqrt{6}`, hint: R`例: √7 や sqrt(7)` }
      ],
      solution: [
        { t: '前提：2次関数のグラフと「頂点」',
          n: R`2次関数 $y=ax^{2}+bx+c$ のグラフは**放物線**で、$a>0$ のとき下に凸（谷の形）、$a<0$ のとき上に凸（山の形）です。放物線の対称の中心の線を**軸**、軸とグラフの交点を**頂点**といい、下に凸なら頂点が最小値、上に凸なら頂点が最大値の位置になります。`,
          easy: R`$y=x^{2}$ のグラフは、ボールを投げたときの軌跡のような、カップ形の曲線です。この形を上下左右に動かしたり、縦に伸び縮みさせたりしたものが 2次関数のグラフです。左右対称の真ん中の線（**軸**）と、曲線の一番下（または一番上）の点（**頂点**）を知ることが、最大・最小や共有点を考える出発点になります。式のままでは頂点が読めないので、次の「平方完成」で $a(x-p)^{2}+q$ の形に直します。`,
          lv: 3 },
        { t: '平方完成して頂点と軸を求める（(1)）',
          m: [R`f(x) = 2x^{2} - 8x + 5`,
              R`= 2(x^{2} - 4x) + 5`,
              R`= 2\{(x-2)^{2} - 4\} + 5`,
              R`= 2(x-2)^{2} - 3`],
          n: R`頂点は $(2,\ -3)$、軸は直線 $x = 2$ です。`,
          easy: R`**平方完成**は、$ax^{2}+bx+c$ を $a(x-p)^{2}+q$ の形に直すことです。この形にすると、放物線の頂点が $(p,\ q)$、軸が直線 $x=p$ だと一目で分かります。手順は、まず $x^{2}$ の係数 $2$ で $x$ の項をくくり、かっこの中で $x^{2}-4x=(x-2)^{2}-4$ と「$x$ の係数の半分の 2 乗」を足して引きます。` },
        { t: R`区間 $1 \le x \le 4$ での最大・最小（(2)(3)）`,
          m: [R`f(1) = 2 - 8 + 5 = -1`,
              R`f(4) = 32 - 32 + 5 = 5`,
              R`f(2) = -3`],
          n: R`軸 $x=2$ は区間 $1 \le x \le 4$ の内部にあるので、最小値は頂点の値 $f(2) = -3$ です。最大値は軸から遠い方の端点で決まります。軸から $x=1$ までの距離は $1$、$x=4$ までは $2$ なので $x=4$ の方が遠く、最大値は $f(4) = 5$ です。`,
          easy: R`下に凸の放物線（$x^{2}$ の係数が正）は、軸に近いほど値が小さく、遠いほど大きくなります。区間の中に軸が入っていれば最小値は頂点、最大値は「軸から遠い方の端」で決まります。図の山の底（頂点）と、区間の両端 $x=1,\ 4$ の高さを見比べてみましょう。`,
          pro: R`下に凸なら「最小は軸の位置で場合分け、最大は軸から遠い端」。端点の値を計算しなくても、軸からの距離で大小が決まります。`,
          fig: figQuad1Sol() },
        { t: '$x$ 軸との 2 つの共有点の距離（(4)）',
          m: [R`2x^{2} - 8x + 5 = 0`,
              R`x = \frac{8 \pm \sqrt{64 - 40}}{4} = \frac{4 \pm \sqrt{6}}{2}`,
              R`\frac{4+\sqrt{6}}{2} - \frac{4-\sqrt{6}}{2} = \sqrt{6}`],
          n: R`$f(x) = 0$ の 2 つの解が、グラフが $x$ 軸と交わる点の $x$ 座標です。2 点の距離は 2 つの解の差です。`,
          easy: R`グラフが $x$ 軸と交わる点では $y=0$ です。そこで $2x^{2}-8x+5=0$ を解きます。解の公式 $x=\dfrac{-b\pm\sqrt{b^{2}-4ac}}{2a}$ に $a=2,\ b=-8,\ c=5$ を代入します。2 つの $x$ 座標の差が、$x$ 軸から切り取る線分の長さです。`,
          pro: R`2 解の差は $\dfrac{\sqrt{b^{2}-4ac}}{|a|} = \dfrac{\sqrt{24}}{2} = \sqrt{6}$ と一気に出せます。` }
      ],
      tags: ['平方完成', '最大・最小', '解の公式']
    },

    {
      id: 'm-basic-quad-02',
      subject: 'math',
      level: 'basic',
      unit: 'm-quad',
      title: '定義域内の最小値と場合分け',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`$a$ を定数とし、2次関数 $f(x) = x^{2} - 2ax + a + 6$ を考える。$0 \le x \le 2$ における $f(x)$ の最小値を $m(a)$ とおく。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$m(1)$ を求めよ。`, type: 'num', answer: 6 },
        { label: '(2)', q: R`$m(3)$ を求めよ。`, type: 'num', answer: 1 },
        { label: '(3)', q: R`$0 \le a \le 2$ のとき、$m(a)$ を $a$ の式で表せ。`, type: 'expr', answer: '-a^2+a+6', vars: ['a'], show: R`-a^{2}+a+6`, hint: R`例: a^2-3a+1` },
        { label: '(4)', q: R`$a$ がすべての実数を動くとき、$m(a)$ の最大値を求めよ。`, type: 'num', answer: 25 / 4, show: R`\frac{25}{4}`, hint: R`例: 3/4 や 0.75` }
      ],
      solution: [
        { t: '平方完成して軸を調べる',
          m: R`f(x) = x^{2} - 2ax + a + 6 = (x-a)^{2} - a^{2} + a + 6`,
          n: R`軸は直線 $x=a$、頂点の $y$ 座標は $-a^{2}+a+6$ です。$a$ の値によって、軸が区間 $0 \le x \le 2$ の左・中・右のどこにあるかが変わります。`,
          easy: R`文字 $a$ が入っていても、平方完成のやり方は同じです。$x$ の項 $-2ax$ から「半分の 2 乗」$a^{2}$ を足して引きます。軸の位置が $a$ で動く、つまり **$a$ が動くと山の底の位置が動く** のがこの問題のポイントです。`,
          lv: 1 },
        { t: '$a=1$、$a=3$ の場合（(1)(2)）',
          m: [R`f(x) = x^{2} - 2x + 7 = (x-1)^{2} + 6 \quad (a=1)`,
              R`m(1) = f(1) = 6`,
              R`f(x) = x^{2} - 6x + 9 = (x-3)^{2} \quad (a=3)`,
              R`m(3) = f(2) = 4 - 12 + 9 = 1`],
          n: R`$a=1$ では軸 $x=1$ が区間 $0 \le x \le 2$ の内部にあるので、最小値は頂点の $y$ 座標 $6$ です。$a=3$ では軸 $x=3$ が区間の右にはずれているので、区間内で $f$ は減少し、右端 $x=2$ で最小になります。`,
          easy: R`山の底（軸）が区間の中にあれば、底の値がそのまま最小値です。底が区間の外（右）にあるときは、区間の中で底にいちばん近い場所、つまり右端 $x=2$ が最小になります。`,
          lv: 2 },
        { t: '軸の位置で場合分けして $m(a)$ を求める（(3)）',
          m: R`m(a) = \begin{cases} f(0) = a + 6 & (a < 0) \\ f(a) = -a^{2} + a + 6 & (0 \le a \le 2) \\ f(2) = 10 - 3a & (a > 2) \end{cases}`,
          n: R`軸が区間の左にはずれる（$a<0$）ときは左端 $x=0$ で、区間の内部にある（$0 \le a \le 2$）ときは頂点で、右にはずれる（$a>2$）ときは右端 $x=2$ で最小になります。`,
          easy: R`下に凸の放物線は、軸（底の位置）に近いほど値が小さくなります。区間 $0 \le x \le 2$ の中で「底にいちばん近い場所」がどこかを、軸 $x=a$ の位置で 3 通りに分けて考えます。左にあれば左端、中にあれば軸そのもの、右にあれば右端です。`,
          pro: R`共通テストでは「軸が区間の左・中・右」の 3 場合分けが定番。端点の値 $f(0),\ f(2)$ を先に計算しておくと速いです。` },
        { t: '$m(a)$ の最大値を求める（(4)）',
          m: [R`0 \le a \le 2:\quad m(a) = -a^{2} + a + 6 = -\left(a - \frac{1}{2}\right)^{2} + \frac{25}{4}`,
              R`a < 0:\ m(a) = a + 6 < 6, \qquad a > 2:\ m(a) = 10 - 3a < 4`],
          n: R`$a<0$ のとき $m(a) = a+6 < 6$、$a>2$ のとき $m(a) = 10-3a < 4$ です。$0 \le a \le 2$ では $a = \dfrac{1}{2}$ で最大値 $\dfrac{25}{4}\ (=6.25)$ をとり、これは $6$ より大きいので、$m(a)$ 全体の最大値は $\dfrac{25}{4}$ です。`,
          easy: R`$m(a)$ 自体も $a$ の関数です。3 つの場合それぞれで「いちばん高くなる値」を調べて比べます。真ん中の場合は $a$ の 2 次関数なので、もう一度平方完成すると、$a=\dfrac{1}{2}$ で頂点になることが分かります。グラフ（図）では、山の頂上が $\left(\dfrac{1}{2},\ \dfrac{25}{4}\right)$ です。`,
          fig: figQuad2Sol() }
      ],
      tags: ['場合分け', '平方完成', '最小値']
    },

    /* ---------- 図形と計量 ---------- */
    {
      id: 'm-basic-trig1-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-trig1',
      title: '三角形の辺と角・面積・内接円',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`△ABC において $\mathrm{AB} = 5,\ \mathrm{BC} = 7,\ \mathrm{CA} = 6$ とする。次の問いに答えよ。`,
      fig: figTriangle(),
      parts: [
        { label: '(1)', q: R`$\cos A$ の値を求めよ。`, type: 'num', answer: 1 / 5, show: R`\frac{1}{5}`, hint: R`例: 3/4 や 0.75` },
        { label: '(2)', q: R`△ABC の面積 $S$ を求めよ。`, type: 'num', answer: 6 * Math.sqrt(6), show: R`6\sqrt{6}`, hint: R`例: 5√7（5*sqrt(7) でも可）` },
        { label: '(3)', q: R`△ABC の外接円の半径 $R$ を求めよ。`, type: 'num', answer: 35 * Math.sqrt(6) / 24, show: R`\frac{35\sqrt{6}}{24}`, hint: R`例: 3√5/4（3*sqrt(5)/4 でも可）` },
        { label: '(4)', q: R`△ABC の内接円の半径 $r$ を求めよ。`, type: 'num', answer: 2 * Math.sqrt(6) / 3, show: R`\frac{2\sqrt{6}}{3}`, hint: R`例: 3√5/4（3*sqrt(5)/4 でも可）` }
      ],
      solution: [
        { t: '前提：三角形の記号（辺と向かいの角）',
          n: R`△ABC で、頂点 A・B・C の向かい側の辺の長さを、それぞれ $a=\mathrm{BC},\ b=\mathrm{CA},\ c=\mathrm{AB}$ と書きます。この問題では $a=7,\ b=6,\ c=5$ です。正弦定理・余弦定理は、この「辺とその向かいの角」の対応で使います。`,
          easy: R`三角形の頂点は大文字（A, B, C）、辺の長さは小文字（$a,\ b,\ c$）で表し、**頂点 A の向かい側の辺が $a$**（B と C を結ぶ辺 BC）という約束です。角 A の「向かい側」を意識しておくと、余弦定理・正弦定理でどの辺をどこに入れるかを間違えにくくなります。図で、角 A の反対側に辺 BC（長さ $7$）があることを確かめましょう。`,
          lv: 3 },
        { t: R`余弦定理で $\cos A$ を求める（(1)）`,
          m: [R`\cos A = \frac{\mathrm{AB}^{2} + \mathrm{AC}^{2} - \mathrm{BC}^{2}}{2 \cdot \mathrm{AB} \cdot \mathrm{AC}}`,
              R`= \frac{5^{2} + 6^{2} - 7^{2}}{2 \cdot 5 \cdot 6} = \frac{12}{60} = \frac{1}{5}`],
          n: R`角 $A$ をはさむ 2 辺が $\mathrm{AB},\ \mathrm{AC}$、向かい側の辺が $\mathrm{BC}$ です。`,
          easy: R`**余弦定理**は、三角形の 3 辺の長さから角の大きさ（の $\cos$）を求める道具です。$\cos A$ の分子は「角 $A$ をはさむ 2 辺の 2 乗の和 − 向かい側の辺の 2 乗」、分母は「はさむ 2 辺の積の 2 倍」と覚えましょう。` },
        { t: R`$\sin A$ と面積 $S$（(2)）`,
          m: [R`\sin A = \sqrt{1 - \cos^{2}A} = \sqrt{1 - \frac{1}{25}} = \frac{2\sqrt{6}}{5}`,
              R`S = \frac{1}{2} \cdot \mathrm{AB} \cdot \mathrm{AC} \cdot \sin A = \frac{1}{2} \cdot 5 \cdot 6 \cdot \frac{2\sqrt{6}}{5} = 6\sqrt{6}`],
          n: R`$A$ は三角形の内角なので $\sin A > 0$ です。面積は「2 辺とその間の角」から $\dfrac{1}{2}bc\sin A$ で求めます。`,
          easy: R`$\sin^{2}A+\cos^{2}A=1$（三角比の相互関係）を使うと、$\cos A$ から $\sin A$ が分かります。三角形の面積は、底辺 × 高さ ÷ 2 の高さを $\sin$ で表した形 $\dfrac{1}{2}bc\sin A$ にまとめられます。`,
          pro: R`3 辺だけが与えられたら、ヘロンの公式 $S=\sqrt{s(s-a)(s-b)(s-c)}$（$s=9$ なら $\sqrt{9 \cdot 2 \cdot 3 \cdot 4}=6\sqrt{6}$）でも検算できます。` },
        { t: '正弦定理で外接円の半径 $R$（(3)）',
          m: [R`\frac{\mathrm{BC}}{\sin A} = 2R`,
              R`R = \frac{7}{2 \cdot \frac{2\sqrt{6}}{5}} = \frac{35}{4\sqrt{6}} = \frac{35\sqrt{6}}{24}`],
          n: R`正弦定理 $\dfrac{a}{\sin A} = 2R$ を使います。`,
          easy: R`**正弦定理**は「辺の長さ ÷ 向かいの角の $\sin$」が、どの辺で計算しても同じ値（外接円の直径 $2R$）になる、という関係です。外接円とは 3 つの頂点をすべて通る円のことです。最後は分母の $\sqrt{6}$ を有理化して $\dfrac{35\sqrt{6}}{24}$ とします。` },
        { t: '面積から内接円の半径 $r$（(4)）',
          m: [R`S = \frac{1}{2}\, r\,(\mathrm{AB} + \mathrm{BC} + \mathrm{CA})`,
              R`6\sqrt{6} = \frac{1}{2} \cdot r \cdot 18 \;\Rightarrow\; r = \frac{6\sqrt{6}}{9} = \frac{2\sqrt{6}}{3}`],
          n: R`内接円の中心 I と 3 頂点を結ぶと、△ABC は高さがすべて $r$ の 3 つの三角形に分かれます。その面積の和が $S$ です。`,
          easy: R`内接円は 3 辺すべてに接する円です。円の中心から 3 つの頂点へ線を引くと、△ABC が 3 つの三角形に分かれ、どれも「高さ $r$」です。面積の合計は $\dfrac{1}{2}r(5+7+6)$ となり、これが $S$ に等しいことから $r$ が求まります。`,
          pro: R`$r = \dfrac{2S}{a+b+c}$ はそのまま使える公式。外接円は正弦定理、内接円は面積、と使い分けましょう。` }
      ],
      tags: ['余弦定理', '正弦定理', '面積', '内接円']
    },

    /* ---------- データの分析 ---------- */
    {
      id: 'm-basic-data-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-data',
      title: '分散・共分散・相関係数',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`5 人の生徒の小テストの点数について、数学を $x$、英語を $y$ とすると、次のようになった。

$x$：2, 4, 6, 8, 10
$y$：4, 3, 5, 6, 7

分散・共分散は、データの個数 $5$ で割って求めるものとする。次の問いに答えよ。`,
      fig: figScatter(false),
      parts: [
        { label: '(1)', q: R`$x$ の分散を求めよ。`, type: 'num', answer: 8 },
        { label: '(2)', q: R`$x$ と $y$ の共分散を求めよ。`, type: 'num', answer: 3.6 },
        { label: '(3)', q: R`$x$ と $y$ の相関係数を求めよ。`, type: 'num', answer: 0.9 },
        { label: '(4)', q: R`$x$ を $u = 2x + 3$ に変換し、$u$ と $y$ の相関係数 $r'$ を考える。$r'$ について正しいものを選べ。`, type: 'choice', choices: [R`$0.9$ のまま変わらない`, R`$1.8$ になる`, R`$0.9$ より小さくなる`, R`$0.9$ より大きくなる`], answer: 0 }
      ],
      solution: [
        { t: '平均を求める',
          m: [R`\bar{x} = \frac{2+4+6+8+10}{5} = 6`,
              R`\bar{y} = \frac{4+3+5+6+7}{5} = 5`],
          n: R`以降の計算では、各データが平均からどれだけ離れているか（**偏差**）を使います。`,
          easy: R`**平均**はデータの合計 ÷ 個数です。分散や相関係数は「平均からのずれ」を元に作るので、まず平均を出します。図の点の「真ん中あたり」が $(6,\ 5)$ です。` },
        { t: '偏差を求める',
          m: [R`x - \bar{x}:\quad -4,\ -2,\ 0,\ 2,\ 4`,
              R`y - \bar{y}:\quad -1,\ -2,\ 0,\ 1,\ 2`],
          n: R`偏差 = 各データ − 平均 です。偏差の合計は必ず $0$ になるので、計算ミスの確認に使えます。`,
          easy: R`**偏差**は「平均より大きいか小さいか」を表す数です。$x=2$ は平均 $6$ より $4$ 小さいので偏差は $-4$、$x=10$ なら $+4$ です。図では、平均を表す破線（点線）から各点がどちらへどれだけ離れているかに当たります。`,
          fig: figScatter(true),
          lv: 2 },
        { t: '分散を求める（(1)）',
          m: [R`s_{x}^{2} = \frac{(-4)^{2} + (-2)^{2} + 0^{2} + 2^{2} + 4^{2}}{5} = \frac{40}{5} = 8`,
              R`s_{y}^{2} = \frac{(-1)^{2} + (-2)^{2} + 0^{2} + 1^{2} + 2^{2}}{5} = \frac{10}{5} = 2`],
          n: R`分散は「偏差の 2 乗の平均」です。$y$ の分散は (3) で使います。`,
          easy: R`分散は、データが平均のまわりにどれくらい散らばっているかを表す数です。偏差をそのまま平均すると $+$ と $-$ が打ち消し合って $0$ になってしまうので、**2 乗してから平均**します。` },
        { t: '共分散を求める（(2)）',
          m: R`s_{xy} = \frac{(-4)(-1) + (-2)(-2) + 0 \cdot 0 + 2 \cdot 1 + 4 \cdot 2}{5} = \frac{4+4+0+2+8}{5} = \frac{18}{5} = 3.6`,
          n: R`共分散は「$x$ の偏差 × $y$ の偏差」の平均です。`,
          easy: R`$x$ が平均より大きいとき $y$ も平均より大きい（偏差の積が正）データが多ければ共分散は正、$x$ が大きいほど $y$ が小さい傾向なら負になります。つまり共分散の符号で、右上がりの傾向か右下がりの傾向かが分かります。` },
        { t: '相関係数を求める（(3)）',
          m: R`r = \frac{s_{xy}}{s_{x}\,s_{y}} = \frac{3.6}{\sqrt{8} \times \sqrt{2}} = \frac{3.6}{4} = 0.9`,
          n: R`相関係数は共分散を、それぞれの標準偏差 $s_x=\sqrt{8},\ s_y=\sqrt{2}$ の積で割った値で、$-1$ 以上 $1$ 以下です。$0.9$ は強い正の相関を表します。`,
          easy: R`共分散だけでは、点数の単位や散らばりの大きさに左右されます。そこで標準偏差（分散の正の平方根）で割って、$-1$ から $1$ のあいだの数に直したものが**相関係数**です。$1$ に近いほど点が右上がりの直線に並び、$0$ に近いと関係が見られません。` },
        { t: '1 次変換しても相関係数は変わらない（(4)）',
          m: [R`u - \bar{u} = 2(x - \bar{x})`,
              R`s_{uy} = 2 s_{xy}, \quad s_{u} = 2 s_{x} \;\Rightarrow\; r' = \frac{2 s_{xy}}{2 s_{x}\, s_{y}} = r = 0.9`],
          n: R`$u = 2x+3$ では、平均も $\bar{u} = 2\bar{x}+3$ となり、偏差は $2$ 倍になるだけです（$+3$ は平均の差で消えます）。共分散も標準偏差も $2$ 倍なので、割り算で $2$ が約分され、相関係数は変わりません。`,
          easy: R`点数を一律に $+3$ しても、単位を $2$ 倍にしても、「点の並び方の傾向」は変わりません。たとえば、身長のデータを cm から mm に直しても、体重との相関の強さは変わらないのと同じです。ただし $-2x$ のように**負の数**をかけると、符号が逆（$-0.9$）になります。`,
          pro: R`正の係数の 1 次変換では相関係数は不変。共通テストでは「単位を変えると相関係数はどうなるか」が選択肢問題の定番です。` }
      ],
      tags: ['分散', '共分散', '相関係数', '散布図']
    },

    /* ---------- 場合の数・確率 ---------- */
    {
      id: 'm-basic-prob-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-prob',
      title: '順列・組合せ・円順列',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`男子 3 人、女子 4 人、合計 7 人のグループがある。どの 2 人も区別して考える。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`7 人が 1 列に並ぶとき、女子 4 人全員が隣り合う並び方は何通りか。`, type: 'num', answer: 576 },
        { label: '(2)', q: R`7 人が 1 列に並ぶとき、男子 3 人のどの 2 人も隣り合わない並び方は何通りか。`, type: 'num', answer: 1440 },
        { label: '(3)', q: R`7 人の中から 3 人の委員を選ぶとき、男子が少なくとも 1 人含まれる選び方は何通りか。`, type: 'num', answer: 31 },
        { label: '(4)', q: R`7 人が円形に並ぶとき、男子 3 人のどの 2 人も隣り合わない並び方は何通りか。ただし、回転して一致する並び方は同じとみなす。`, type: 'num', answer: 144 }
      ],
      solution: [
        { t: '前提：階乗・順列・組合せ',
          n: R`$n!$（$n$ の階乗）は $n \times (n-1) \times \cdots \times 1$ で、$n$ 個の異なるものを 1 列に並べる並べ方の数です。$\P{n}{r}$ は $n$ 個から $r$ 個を選んで並べる並べ方の数、$\C{n}{r} = \dfrac{\P{n}{r}}{r!}$ は $n$ 個から $r$ 個を選ぶ選び方（順番は区別しない）の数です。`,
          easy: R`たとえば A, B, C の 3 人を 1 列に並べるとき、1 番目は $3$ 通り、2 番目は残りの $2$ 通り、3 番目は $1$ 通りなので、$3 \times 2 \times 1 = 3! = 6$ 通りです。このように「順番に何通りあるか」をかけ算していくのが場合の数の基本です。**並べる（順番を区別する）なら順列、選ぶだけ（順番を区別しない）なら組合せ**と使い分けます。`,
          lv: 3 },
        { t: '隣り合う → ひとまとまりにする（(1)）',
          m: R`(3+1)! \times 4! = 24 \times 24 = 576`,
          n: R`女子 4 人を 1 つの「ブロック」とみなすと、男子 3 人とブロック 1 つの計 4 個が並ぶので $4!$ 通り。ブロックの中での女子 4 人の並び方が $4!$ 通りあり、これらをかけます。`,
          easy: R`「隣り合う」と言われたら、**ひとまとめにして 1 つのものとして並べ、あとでまとめの中の並び方をかける**のが基本です。階乗 $n!$ は $n$ 個の異なるものを 1 列に並べる並び方の数（$4! = 4 \times 3 \times 2 \times 1 = 24$）です。` },
        { t: '隣り合わない → 先に他を並べて間に入れる（(2)）',
          m: R`4! \times \P{5}{3} = 24 \times 60 = 1440`,
          n: R`先に女子 4 人を 1 列に並べる並び方が $4!$ 通り。女子の間と両端の 5 か所から異なる 3 か所を選んで男子 3 人を 1 人ずつ入れるので $\P{5}{3} = 5 \times 4 \times 3 = 60$ 通り。`,
          easy: R`「隣り合わない」は、**隣り合ってよい人を先に並べ、そのすき間に入れる**と考えます。女子を並べると、すき間は「両端 2 か所＋間 3 か所」で合計 5 か所。そこへ男子を 1 か所に 1 人ずつ入れるので、5 か所から 3 か所を選んで順に並べる $\P{5}{3}$ になります。`,
          pro: R`「隣り合う → 束ねる」「隣り合わない → 後から間に入れる」は場合の数の定石です。` },
        { t: '少なくとも 1 人 → 余事象（(3)）',
          m: R`\C{7}{3} - \C{4}{3} = 35 - 4 = 31`,
          n: R`「男子が少なくとも 1 人」の反対は「男子が 0 人（3 人とも女子）」です。全部の選び方から、女子 4 人から 3 人を選ぶ場合を引きます。`,
          easy: R`「少なくとも 1 つ」を直接数えると場合が多くなるので、**全体から「1 つもない場合」を引く**（余事象）のが近道です。組合せ $\C{n}{r}$ は $n$ 人から $r$ 人を選ぶ選び方（順序は区別しない）の数で、$\C{7}{3} = \dfrac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35$ です。` },
        { t: '円順列で隣り合わない（(4)）',
          m: R`(4-1)! \times \P{4}{3} = 6 \times 24 = 144`,
          n: R`円形では回転して重なる並びを同じとみなすので、まず女子 4 人を円形に並べる並び方は $(4-1)! = 6$ 通り。女子の間の 4 か所から 3 か所を選んで男子を入れるので $\P{4}{3} = 24$ 通りです。`,
          easy: R`円形に並べる**円順列**では、全員が 1 つずつ回ると同じ並びになってしまうので、1 人を固定して残りを並べます（$n$ 人なら $(n-1)!$ 通り）。女子 4 人を円に並べると、女子と女子の間に 4 つのすき間ができます。円の場合、すき間の数は人数と同じ 4 です（1 列のときは人数 + 1 でした）。` }
      ],
      tags: ['順列', '組合せ', '円順列', '余事象']
    },

    {
      id: 'm-basic-prob-02',
      subject: 'math',
      level: 'basic',
      unit: 'm-prob',
      title: '確率・期待値・条件付き確率',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`袋の中に白球 5 個と赤球 3 個が入っている。球はどれも区別でき、取り出すときはどの球も同じ確率で選ばれるものとする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`袋から同時に 2 個取り出すとき、2 個が同じ色である確率を求めよ。`, type: 'num', answer: 13 / 28, show: R`\frac{13}{28}`, hint: R`例: 3/8（小数でも可）` },
        { label: '(2)', q: R`(1) の取り出しで、取り出された赤球の個数を $X$ とする。$X$ の期待値を求めよ。`, type: 'num', answer: 3 / 4, show: R`\frac{3}{4}`, hint: R`例: 3/7` },
        { label: '(3)', q: R`(1) の取り出しで、2 個のうち少なくとも 1 個が赤球であったとき、2 個とも赤球である条件付き確率を求めよ。`, type: 'num', answer: 1 / 6, show: R`\frac{1}{6}`, hint: R`例: 3/7` },
        { label: '(4)', q: R`(1) の取り出しを、取り出した 2 個を袋にもどしてから、3 回くり返す。2 個が同じ色になる回数がちょうど 2 回である確率を求めよ。`, type: 'num', answer: 7605 / 21952, show: R`\frac{7605}{21952}`, hint: R`分数でも小数（4 桁程度）でも可` }
      ],
      solution: [
        { t: '同じ色になる確率（(1)）',
          m: R`\frac{\C{5}{2} + \C{3}{2}}{\C{8}{2}} = \frac{10 + 3}{28} = \frac{13}{28}`,
          n: R`全部で $\C{8}{2} = 28$ 通り。「白 2 個」は $\C{5}{2} = 10$ 通り、「赤 2 個」は $\C{3}{2} = 3$ 通りで、この 2 つは同時に起こらないので足します。`,
          easy: R`確率は「**あてはまる場合の数 ÷ 全部の場合の数**」です（どの取り出し方も同じ確率で起こるとき）。8 個から 2 個を選ぶ選び方は $\C{8}{2} = \dfrac{8 \times 7}{2} = 28$ 通り。同じ色になるのは「白どうし」か「赤どうし」のどちらかなので、それぞれの数を足します。` },
        { t: '$X$ の確率分布と期待値（(2)）',
          m: [R`P(X=0) = \frac{\C{5}{2}}{28} = \frac{10}{28}, \quad P(X=1) = \frac{5 \times 3}{28} = \frac{15}{28}, \quad P(X=2) = \frac{\C{3}{2}}{28} = \frac{3}{28}`,
              R`E(X) = 0 \times \frac{10}{28} + 1 \times \frac{15}{28} + 2 \times \frac{3}{28} = \frac{21}{28} = \frac{3}{4}`],
          n: R`確率の合計は $\dfrac{10+15+3}{28} = 1$ です。期待値は「値 × その確率」の合計です。`,
          easy: R`**期待値**は、この操作を何度もくり返したときの「平均的な値」です。$X$ が $0,\ 1,\ 2$ になる確率をそれぞれ求め、「値 × 確率」を足し合わせます。赤球が 1 個になるのは「白 1 個と赤 1 個」なので $5 \times 3 = 15$ 通りです。` },
        { t: '条件付き確率（(3)）',
          m: [R`A:\ X \ge 1,\quad B:\ X = 2`,
              R`P(A) = 1 - \frac{10}{28} = \frac{18}{28}, \qquad P(A \cap B) = P(B) = \frac{3}{28}`,
              R`P_{A}(B) = \frac{P(A \cap B)}{P(A)} = \frac{3/28}{18/28} = \frac{3}{18} = \frac{1}{6}`],
          n: R`「$A$ が起こったとき $B$ が起こる確率」$P_A(B)$ は、$A$ に絞った中での $B$ の割合 $\dfrac{P(A \cap B)}{P(A)}$ です。$B$ ($X=2$) が起これば必ず $A$ ($X \ge 1$) も起こるので $A \cap B = B$ です。`,
          easy: R`「少なくとも 1 個が赤」と分かっている世界だけに話を絞ります。その世界の確率は $\dfrac{18}{28}$。その中で「2 個とも赤」になる確率は $\dfrac{3}{28}$ なので、割合は $\dfrac{3}{28} \div \dfrac{18}{28} = \dfrac{1}{6}$ です。分母を「絞り込んだあとの全体」に取り替えるのが条件付き確率の考え方です。` },
        { t: '反復試行の確率（(4)）',
          m: [R`p = \frac{13}{28}`,
              R`\C{3}{2}\, p^{2}(1-p) = 3 \times \left(\frac{13}{28}\right)^{2} \times \frac{15}{28} = \frac{7605}{21952} \fallingdotseq 0.3464`],
          n: R`1 回ごとに球を戻すので、3 回の試行は互いに独立で、毎回「同じ色」になる確率は $p = \dfrac{13}{28}$ です。3 回のうち 2 回が「同じ色」（残り 1 回は違う色、確率 $1-p = \dfrac{15}{28}$）になる確率は、**反復試行の確率** $\C{3}{2} p^{2}(1-p)$ です。`,
          easy: R`同じ条件の試行をくり返す問題は、「どの回が成功か」の選び方（ここでは 3 回のうち 2 回を選ぶので $\C{3}{2} = 3$ 通り）と、「成功 2 回・失敗 1 回」が起こる確率 $p^{2}(1-p)$ をかけます。1 回の確率 $p$ を最初に決めてしまえば、あとは同じ形の計算です。`,
          pro: R`$n$ 回中ちょうど $r$ 回起こる確率は $\C{n}{r} p^{r}(1-p)^{n-r}$。余事象や「少なくとも」との組合せでも頻出です。` }
      ],
      tags: ['確率', '期待値', '条件付き確率', '反復試行']
    },

    /* ---------- 整数の性質 ---------- */
    {
      id: 'm-basic-int-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-int',
      title: '互除法と1次不定方程式',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`互除法と 1 次不定方程式について、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$1517$ と $1189$ の最大公約数を求めよ。`, type: 'num', answer: 41 },
        { label: '(2)', q: R`方程式 $13x + 8y = 1$ を満たす整数 $x,\ y$ のうち、$0 < x < 8$ を満たすものについて、$x$ の値を求めよ。`, type: 'num', answer: 5 },
        { label: '(3)', q: R`(2) のときの $y$ の値を求めよ。`, type: 'num', answer: -8 },
        { label: '(4)', q: R`方程式 $13x + 8y = 500$ を満たす正の整数の組 $(x,\ y)$ は全部で何組あるか。`, type: 'num', answer: 5 }
      ],
      solution: [
        { t: '互除法で最大公約数を求める（(1)）',
          m: [R`1517 = 1189 \times 1 + 328`,
              R`1189 = 328 \times 3 + 205`,
              R`328 = 205 \times 1 + 123`,
              R`205 = 123 \times 1 + 82`,
              R`123 = 82 \times 1 + 41`,
              R`82 = 41 \times 2 + 0`],
          n: R`割り算の「割られる数」と「割る数」を、「割る数」と「余り」に順に置き換えていき、余りが $0$ になったときの割る数 $41$ が最大公約数です。`,
          easy: R`**互除法**は、「$a$ と $b$ の最大公約数は、$a$ を $b$ で割った余り $r$ と $b$ の最大公約数に等しい」ことを使い、数をどんどん小さくしていく方法です。最後に余りが $0$ になったときの「割る数」が答えです。素因数分解しにくい大きな数でも機械的に求まります。` },
        { t: '$13x+8y=1$ の解を 1 つ見つける（互除法を逆にたどる）',
          m: [R`13 = 8 \times 1 + 5, \quad 8 = 5 \times 1 + 3, \quad 5 = 3 \times 1 + 2, \quad 3 = 2 \times 1 + 1`,
              R`1 = 3 - 2 \times 1 = 3 - (5 - 3) = 2 \times 3 - 5 = 2(8-5) - 5 = 2 \times 8 - 3 \times 5`,
              R`= 2 \times 8 - 3(13 - 8) = 5 \times 8 - 3 \times 13`,
              R`13 \times (-3) + 8 \times 5 = 1`],
          n: R`互除法の式を下から順に「余り = ○ − △ × □」の形に直して代入していくと、$13 \times (-3) + 8 \times 5 = 1$ が得られます。すなわち $(x,\ y) = (-3,\ 5)$ は 1 つの解です。`,
          easy: R`係数 $13$ と $8$ は互いに素（最大公約数 $1$）なので、$13x+8y=1$ には必ず整数解があります。見つけ方は、互除法の割り算の式を**下から上へ**たどり、「1 = …」の形を $13$ と $8$ だけの式に置き換えていくことです。計算が合っているかは、最後に $13 \times (-3) + 8 \times 5 = -39 + 40 = 1$ と確かめられます。`,
          lv: 2 },
        { t: '一般解を求めて $0<x<8$ のものを選ぶ（(2)(3)）',
          m: [R`13x + 8y = 1, \quad 13 \times (-3) + 8 \times 5 = 1`,
              R`13(x + 3) + 8(y - 5) = 0 \;\Rightarrow\; 13(x+3) = -8(y-5)`,
              R`x = -3 + 8k, \quad y = 5 - 13k \quad (k \text{ は整数})`,
              R`0 < x < 8 \;\Rightarrow\; k = 1: \quad x = 5, \ y = -8`],
          n: R`2 つの式を引くと $13(x+3) = -8(y-5)$ となります。$13$ と $8$ は互いに素なので、$x+3$ は $8$ の倍数です。よって $x+3 = 8k$ とおけます。$k=1$ のとき $x=5$ で、$0<x<8$ をみたします。このとき $y = 5 - 13 = -8$ です。`,
          easy: R`1 つの解 $(-3,\ 5)$ が見つかったら、他の解は「$x$ を 8 増やすたびに $y$ を 13 減らす」（$13 \times 8 = 8 \times 13$ でつり合う）ことでいくつでも作れます。これをまとめたのが $x=-3+8k,\ y=5-13k$ です。$0<x<8$ になる $k$ を探すと $k=1$ だけです。`,
          pro: R`1 次不定方程式は「特殊解を 1 つ見つける → 一般解（$k$ を使った式）を書く」が定石です。` },
        { t: '$13x+8y=500$ の正の整数解の個数（(4)）',
          m: [R`8y = 500 - 13x \;\text{が 8 の倍数}: \quad x=1 \to 487,\ x=2 \to 474,\ x=3 \to 461,\ x=4 \to 448 = 8 \times 56`,
              R`13 \times 4 + 8 \times 56 = 500`,
              R`x = 4 + 8k, \quad y = 56 - 13k`,
              R`x > 0:\ k \ge 0, \qquad y > 0:\ 56 - 13k > 0 \;\Rightarrow\; k \le 4`],
          n: R`$x$ を $1,2,3,\dots$ と順に代入して $500 - 13x$ が $8$ の倍数になる最初の $x$ を探すと、$x=4,\ y=56$ が見つかります。$13(x-4) + 8(y-56) = 0$ から、$(x,\ y) = (4+8k,\ 56-13k)$（$k$ は整数）です。$x>0$ かつ $y>0$ より $k = 0,\ 1,\ 2,\ 3,\ 4$ の **5 組**です。`,
          easy: R`正の整数解を数えるには、まず 1 組見つけて一般解を作ります。$x=4$ のとき $500-13 \times 4 = 448 = 8 \times 56$ で割り切れるので $(4,\ 56)$ が 1 組目です。あとは $k=0,1,2,3,4$ として $(4,56),\ (12,43),\ (20,30),\ (28,17),\ (36,4)$ の 5 組が正の整数の組です（$k=5$ だと $y=-9$ で不適）。` }
      ],
      tags: ['互除法', '最大公約数', '不定方程式']
    },

    /* ---------- 図形の性質 ---------- */
    {
      id: 'm-basic-geo-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-geo',
      title: 'チェバの定理とメネラウスの定理',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`△ABC の辺 BC 上に $\mathrm{BD} : \mathrm{DC} = 2 : 3$ となる点 D、辺 CA 上に $\mathrm{CE} : \mathrm{EA} = 3 : 1$ となる点 E をとり、線分 AD と BE の交点を P とする。さらに、直線 CP と辺 AB の交点を F とする。次の問いに答えよ。`,
      fig: figCevians(),
      parts: [
        { label: '(1)', q: R`$\dfrac{\mathrm{AF}}{\mathrm{FB}}$ の値を求めよ。`, type: 'num', answer: 1 / 2, show: R`\frac{1}{2}`, hint: R`例: 3/7` },
        { label: '(2)', q: R`$\dfrac{\mathrm{AP}}{\mathrm{PD}}$ の値を求めよ。`, type: 'num', answer: 5 / 6, show: R`\frac{5}{6}`, hint: R`例: 3/7` },
        { label: '(3)', q: R`$\dfrac{\mathrm{BP}}{\mathrm{PE}}$ の値を求めよ。`, type: 'num', answer: 8 / 3, show: R`\frac{8}{3}`, hint: R`例: 3/7` },
        { label: '(4)', q: R`△PBC の面積は、△ABC の面積の何倍か。`, type: 'num', answer: 6 / 11, show: R`\frac{6}{11}`, hint: R`例: 3/7` }
      ],
      solution: [
        { t: R`チェバの定理で $\mathrm{AF} : \mathrm{FB}$ を求める（(1)）`,
          m: [R`\frac{\mathrm{AF}}{\mathrm{FB}} \cdot \frac{\mathrm{BD}}{\mathrm{DC}} \cdot \frac{\mathrm{CE}}{\mathrm{EA}} = 1`,
              R`\frac{\mathrm{AF}}{\mathrm{FB}} \cdot \frac{2}{3} \cdot \frac{3}{1} = 1 \;\Rightarrow\; \frac{\mathrm{AF}}{\mathrm{FB}} = \frac{1}{2}`],
          n: R`3 本の線分 AD, BE, CF が 1 点 P で交わっているので、チェバの定理が使えます。`,
          easy: R`**チェバの定理**は、三角形の 3 つの頂点から出た 3 本の線が 1 点で交わるとき、辺を分ける比を「A → F → B」「B → D → C」「C → E → A」とぐるっと一周してかけると 1 になる、という関係です。比は「頂点から点まで ÷ 点から次の頂点まで」の順で書きます。` },
        { t: R`メネラウスの定理で $\mathrm{AP} : \mathrm{PD}$ を求める（(2)）`,
          m: [R`\frac{\mathrm{AP}}{\mathrm{PD}} \cdot \frac{\mathrm{DB}}{\mathrm{BC}} \cdot \frac{\mathrm{CE}}{\mathrm{EA}} = 1`,
              R`\frac{\mathrm{AP}}{\mathrm{PD}} \cdot \frac{2}{5} \cdot \frac{3}{1} = 1 \;\Rightarrow\; \frac{\mathrm{AP}}{\mathrm{PD}} = \frac{5}{6}`],
          n: R`△ADC と直線 BE（B, P, E を通る）に着目します。$\mathrm{DB} : \mathrm{BC} = 2 : 5$ です（$\mathrm{BD}=2k,\ \mathrm{DC}=3k$ とおくと $\mathrm{BC}=5k$）。`,
          easy: R`**メネラウスの定理**は、三角形と、その辺（または延長）を横切る 1 本の直線があるとき、「頂点 → 直線との交点 → 次の頂点 → 交点 → …」と順にたどって、線分の長さの比をかけると 1 になる、という関係です。ここでは三角形 ADC を A → D → C → A とたどり、直線 BE が AD 上の P、DC の延長上の B、CA 上の E で交わっていると見ます。` },
        { t: R`メネラウスの定理で $\mathrm{BP} : \mathrm{PE}$ を求める（(3)）`,
          m: [R`\frac{\mathrm{BP}}{\mathrm{PE}} \cdot \frac{\mathrm{EA}}{\mathrm{AC}} \cdot \frac{\mathrm{CD}}{\mathrm{DB}} = 1`,
              R`\frac{\mathrm{BP}}{\mathrm{PE}} \cdot \frac{1}{4} \cdot \frac{3}{2} = 1 \;\Rightarrow\; \frac{\mathrm{BP}}{\mathrm{PE}} = \frac{8}{3}`],
          n: R`今度は △BEC と直線 AD（A, P, D を通る）に着目します。$\mathrm{CE}=3m,\ \mathrm{EA}=m$ とおくと $\mathrm{AC}=4m$ なので $\mathrm{EA} : \mathrm{AC} = 1 : 4$、また $\mathrm{CD} : \mathrm{DB} = 3 : 2$ です。`,
          easy: R`(2) と同じ要領で、今度は三角形 BEC を B → E → C → B とたどります。直線 AD が BE 上の P、EC の延長上の A、CB 上の D で交わっています。$\mathrm{EA} : \mathrm{AC}$ を求めるために、$\mathrm{CE}=3m,\ \mathrm{EA}=m$ と文字で表しておくと、$\mathrm{AC}=\mathrm{CE}+\mathrm{EA}=4m$ と分かります。`,
          pro: R`メネラウスは「三角形 + 横切る直線」、チェバは「三角形 + 1 点で交わる 3 本」。どちらも 1 周の比の積が 1。どの三角形・どの直線に着目するかを図に太線で書くとミスが減ります。` },
        { t: '面積比を求める（(4)）',
          m: R`\frac{\triangle \mathrm{PBC}}{\triangle \mathrm{ABC}} = \frac{\mathrm{PD}}{\mathrm{AD}} = \frac{6}{5+6} = \frac{6}{11}`,
          n: R`△PBC と △ABC は底辺 BC が共通なので、面積比は高さの比に等しく、これは $\mathrm{PD} : \mathrm{AD}$ です。$\mathrm{AP} : \mathrm{PD} = 5 : 6$ より $\mathrm{AD} = 5 + 6 = 11$ 個分で、$\mathrm{PD} = 6$ 個分です。`,
          easy: R`同じ底辺をもつ三角形の面積は高さに比例します。A から BC までの高さを $11$ とすると、P から BC までの高さは、AD 上で $\mathrm{PD}$ に相当する $6$ になります。だから面積比は $6 : 11$ です。` }
      ],
      tags: ['チェバの定理', 'メネラウスの定理', '面積比']
    },

    /* ---------- 式と証明 ---------- */
    {
      id: 'm-basic-proof-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-proof',
      title: '二項定理・恒等式・相加相乗',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$(2x - 1)^{6}$ の展開式における $x^{4}$ の係数を求めよ。`, type: 'num', answer: 240 },
        { label: '(2)', q: R`$x^{2} + 3x - 4 = a(x-2)^{2} + b(x-2) + c$ が $x$ についての恒等式となるように、定数 $a,\ b,\ c$ を定める。$b$ の値を求めよ。`, type: 'num', answer: 7 },
        { label: '(3)', q: R`(2) の定数 $c$ の値を求めよ。`, type: 'num', answer: 6 },
        { label: '(4)', q: R`$x > 0$ のとき、$x + \dfrac{9}{x}$ の最小値を求めよ。`, type: 'num', answer: 6 }
      ],
      solution: [
        { t: '二項定理を使う（(1)）',
          m: [R`(a+b)^{n} = \sum_{k=0}^{n} \C{n}{k}\, a^{n-k} b^{k}`,
              R`(2x-1)^{6} \text{ の一般項: } \C{6}{k} (2x)^{6-k} (-1)^{k}`,
              R`x^{4} \text{ の項は } 6 - k = 4 \text{ より } k = 2: \quad \C{6}{2}(2x)^{4}(-1)^{2} = 15 \times 16x^{4} = 240x^{4}`],
          n: R`$(a+b)^{n}$ の展開で $a^{n-k}b^{k}$ の項の係数が $\C{n}{k}$ になります（**二項定理**）。ここでは $a=2x,\ b=-1,\ n=6$ です。`,
          easy: R`$(a+b)^{6}$ は「$(a+b)$ を 6 個かけ合わせる」ことです。6 個のかっこから $b$ を $k$ 個、$a$ を残りの $6-k$ 個選んでかけると $a^{6-k}b^{k}$ ができ、その選び方が $\C{6}{k}$ 通りあります。これが二項定理の係数の正体です。$x^{4}$ が出てくるのは $(2x)$ を 4 個、$(-1)$ を 2 個選ぶとき（$k=2$）です。` },
        { t: '恒等式の係数を決める（(2)(3)）',
          m: [R`a(x-2)^{2} + b(x-2) + c = ax^{2} + (-4a + b)x + (4a - 2b + c)`,
              R`\begin{cases} a = 1 \\ -4a + b = 3 \\ 4a - 2b + c = -4 \end{cases} \;\Rightarrow\; a = 1,\ b = 7,\ c = 6`],
          n: R`右辺を展開して、左辺 $x^{2}+3x-4$ と $x^{2},\ x,\ $ 定数項の係数を比べます（係数比較法）。$x^{2}$ の係数から $a=1$、$x$ の係数から $-4+b=3$ より $b=7$、定数項から $4-14+c=-4$ より $c=6$ です。`,
          easy: R`**恒等式**とは、$x$ にどんな数を入れても成り立つ式のことです。両辺が同じ式なら、$x^{2}$ の係数どうし、$x$ の係数どうし、定数項どうしがすべて等しくなければなりません。これを連立方程式にして解きます。ちなみに $x=2$ を代入すると $(x-2)$ の項が消えて $c = 4+6-4 = 6$ とすぐ分かります（数値代入法）。`,
          pro: R`$(x-2)$ のべきで表す問題は、組立除法を 2 回くり返すと速い。余りが順に $c,\ b$ になり、最後の商が $a$ です。` },
        { t: '相加平均・相乗平均を使う（(4)）',
          m: [R`x + \frac{9}{x} \ge 2\sqrt{x \cdot \frac{9}{x}} = 2\sqrt{9} = 6`,
              R`\text{等号は } x = \frac{9}{x},\ \text{すなわち } x = 3\ (>0) \text{ のとき成立}`],
          n: R`$x>0$ より $x>0,\ \dfrac{9}{x}>0$ なので、$a>0,\ b>0$ のとき $a+b \ge 2\sqrt{ab}$ が成り立つ（**相加平均 $\ge$ 相乗平均**）ことを使います。積 $x \cdot \dfrac{9}{x} = 9$ が定数になるのがポイントです。等号が成り立つ $x=3$ が $x>0$ に含まれるので、最小値は $6$ です。`,
          easy: R`2 つの正の数 $a,\ b$ について、足した値 $a+b$ は、かけた値の平方根 $\sqrt{ab}$ の 2 倍以上になります（$(\sqrt{a}-\sqrt{b})^{2} \ge 0$ を展開すると分かります）。この問題では 2 つの数 $x$ と $\dfrac{9}{x}$ の積が $9$ で一定なので、和の最小値が $2\sqrt{9}=6$ と求まります。**最小値になる $x$ が本当に存在する**（等号が成立する）ことの確認も忘れずに。`,
          pro: R`「積が定数」→ 和の最小値、「和が定数」→ 積の最大値、が相加相乗の使いどころ。等号成立条件の確認は必須です。` }
      ],
      tags: ['二項定理', '恒等式', '相加相乗平均']
    },

    /* ---------- 複素数と方程式 ---------- */
    {
      id: 'm-basic-complex-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-complex',
      title: '3次方程式の解と係数の関係',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`3次方程式 $x^{3} + ax^{2} + 7x - 5 = 0$ ……① が $x = 1$ を解にもつとする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`定数 $a$ の値を求めよ。`, type: 'num', answer: -3 },
        { label: '(2)', q: R`方程式 ① の $x=1$ 以外の 2 つの解のうち、虚部が正であるものの実部を求めよ。`, type: 'num', answer: 1 },
        { label: '(3)', q: R`(2) の解の虚部を求めよ。`, type: 'num', answer: 2 },
        { label: '(4)', q: R`方程式 ① の 3 つの解を $\alpha,\ \beta,\ \gamma$ とするとき、$\alpha^{2} + \beta^{2} + \gamma^{2}$ の値を求めよ。`, type: 'num', answer: -5 }
      ],
      solution: [
        { t: '前提：虚数単位 $i$ と複素数',
          n: R`2 乗して $-1$ になる数を**虚数単位**といい、$i$ で表します（$i^{2}=-1$）。$a+bi$（$a,\ b$ は実数）の形の数を**複素数**といい、$a$ を実部、$b$ を虚部とよびます。$b \ne 0$ の複素数を虚数といいます。`,
          easy: R`実数の範囲では、2 乗して負になる数はありません。そこで「2 乗して $-1$ になる新しい数」$i$ を考えることにします。すると、$x^{2}+4=0$ のような方程式にも解（$x=\pm 2i$）が作れるようになります。複素数 $a+bi$ は、実数 $a$ と実数 $b$ を組にした数で、数直線の「横」だけでなく「縦」の方向にも数を並べたものと考えるとイメージしやすくなります。`,
          lv: 3 },
        { t: '$x=1$ を代入して $a$ を求める（(1)）',
          m: R`1^{3} + a \cdot 1^{2} + 7 \cdot 1 - 5 = 0 \;\Rightarrow\; a + 3 = 0 \;\Rightarrow\; a = -3`,
          n: R`$x=1$ が解なので、① に代入すると成り立ちます（因数定理：$P(1)=0$ なら $P(x)$ は $x-1$ で割り切れる）。`,
          easy: R`「$x=1$ が方程式の解」とは「$x=1$ を代入すると左辺が $0$ になる」という意味です。代入して $a$ について解くだけです。` },
        { t: '因数分解して残りの解を求める（(2)(3)）',
          m: [R`x^{3} - 3x^{2} + 7x - 5 = (x-1)(x^{2} - 2x + 5)`,
              R`x^{2} - 2x + 5 = 0 \;\Rightarrow\; x = 1 \pm \sqrt{1 - 5} = 1 \pm 2i`],
          n: R`$x^{3}-3x^{2}+7x-5$ を $x-1$ で割る（組立除法）と、商は $x^{2}-2x+5$、余りは $0$ です。2 次方程式 $x^{2}-2x+5=0$ を解の公式で解くと、判別式が負なので虚数解 $1 \pm 2i$ になります。虚部が正の解は $1+2i$ で、実部 $1$、虚部 $2$ です。`,
          easy: R`負の数の平方根は、**虚数単位 $i$**（$i^{2}=-1$）を使って表します。たとえば $\sqrt{-4} = 2i$ です。ここでは $\sqrt{1-5}=\sqrt{-4}=2i$ となり、解は $1+2i$ と $1-2i$（互いに共役な複素数）です。「実部」は $i$ のついていない部分、「虚部」は $i$ の係数です。` },
        { t: R`解と係数の関係で $\alpha^{2}+\beta^{2}+\gamma^{2}$ を求める（(4)）`,
          m: [R`\alpha + \beta + \gamma = 3, \qquad \alpha\beta + \beta\gamma + \gamma\alpha = 7`,
              R`\alpha^{2} + \beta^{2} + \gamma^{2} = (\alpha + \beta + \gamma)^{2} - 2(\alpha\beta + \beta\gamma + \gamma\alpha) = 3^{2} - 2 \times 7 = -5`],
          n: R`3 次方程式 $x^{3} + px^{2} + qx + r = 0$ の 3 つの解 $\alpha,\ \beta,\ \gamma$ について、$\alpha+\beta+\gamma = -p,\ \alpha\beta+\beta\gamma+\gamma\alpha = q,\ \alpha\beta\gamma = -r$ が成り立ちます。ここでは $p=-3,\ q=7,\ r=-5$ です。`,
          easy: R`解が複素数になっても、解の和・積に関する関係は変わらず使えます。2 乗の和は、$(\alpha+\beta+\gamma)^{2}$ を展開すると $\alpha^{2}+\beta^{2}+\gamma^{2}$ に $2(\alpha\beta+\beta\gamma+\gamma\alpha)$ が加わることから、逆に引き算で求めます。`,
          pro: R`確かめ: $1^{2} + (1+2i)^{2} + (1-2i)^{2} = 1 + (-3+4i) + (-3-4i) = -5$。複素数の 2 乗の和は虚部が打ち消し合って実数になります。` }
      ],
      tags: ['解と係数の関係', '因数定理', '虚数解']
    },

    /* ---------- 図形と方程式 ---------- */
    {
      id: 'm-basic-coord-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-coord',
      title: '円と直線・弦の長さ・接線',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`円 $C: x^{2} + y^{2} - 4x + 2y - 20 = 0$ と直線 $l: 3x + 4y - 17 = 0$ がある。点 $\mathrm{P}(5,\ 3)$ は円 $C$ 上の点である。次の問いに答えよ。`,
      fig: figCircle(false),
      parts: [
        { label: '(1)', q: R`円 $C$ の半径を求めよ。`, type: 'num', answer: 5 },
        { label: '(2)', q: R`円 $C$ の中心と直線 $l$ の距離を求めよ。`, type: 'num', answer: 3 },
        { label: '(3)', q: R`円 $C$ が直線 $l$ から切り取る弦の長さを求めよ。`, type: 'num', answer: 8 },
        { label: '(4)', q: R`点 P における円 $C$ の接線の方程式を $y = \boxed{\ \ }$ の形で答えよ。`, type: 'expr', answer: '(27-3x)/4', vars: ['x'], show: R`\frac{27-3x}{4}`, hint: R`例: (5-2x)/3` }
      ],
      solution: [
        { t: '平方完成して円の中心と半径を求める（(1)）',
          m: [R`x^{2} + y^{2} - 4x + 2y - 20 = (x-2)^{2} + (y+1)^{2} - 25`,
              R`\text{よって } C:\ (x-2)^{2} + (y+1)^{2} = 25`],
          n: R`$x$ と $y$ をそれぞれ平方完成します。中心は $(2,\ -1)$、半径は $\sqrt{25}=5$ です。`,
          easy: R`円の方程式は $(x-a)^{2}+(y-b)^{2}=r^{2}$ の形にすると、中心が $(a,\ b)$、半径が $r$ と読み取れます。展開した形から戻すには、$x$ の項と $y$ の項をそれぞれ平方完成します。$x^{2}-4x = (x-2)^{2}-4$、$y^{2}+2y=(y+1)^{2}-1$ なので、$-20$ とあわせて $-25$ が残り、右辺に移して $25$ です。` },
        { t: '点と直線の距離の公式（(2)）',
          m: R`d = \frac{|3 \cdot 2 + 4 \cdot (-1) - 17|}{\sqrt{3^{2} + 4^{2}}} = \frac{|-15|}{5} = 3`,
          n: R`点 $(x_{0},\ y_{0})$ と直線 $ax+by+c=0$ の距離は $\dfrac{|ax_{0}+by_{0}+c|}{\sqrt{a^{2}+b^{2}}}$ です。中心 $(2,\ -1)$ を代入します。`,
          easy: R`**点と直線の距離**は、点から直線へおろした垂線（直線に直角に引いた線）の長さです。公式の分子は、直線の式の左辺に点の座標を代入して絶対値をとったもの、分母は $x,\ y$ の係数の 2 乗の和の平方根です。図では、中心 C から直線 $l$ へ引いた破線の長さ $\mathrm{CH}=3$ にあたります。`,
          fig: figCircle(true) },
        { t: '弦の長さを三平方の定理で求める（(3)）',
          m: R`2\sqrt{r^{2} - d^{2}} = 2\sqrt{25 - 9} = 2 \times 4 = 8`,
          n: R`中心から弦に垂線をおろすと、弦の中点 H で垂直に交わります。直角三角形で半径 $r=5$ が斜辺、中心と直線の距離 $d=3$ が 1 辺なので、弦の半分は $\sqrt{r^{2}-d^{2}} = 4$ です。`,
          easy: R`円の中心から弦におろした垂線は、弦をちょうど半分に分けます。すると「半径 $5$ を斜辺、中心から弦までの距離 $3$ を 1 辺とする直角三角形」ができ、もう 1 辺（弦の半分）が三平方の定理で $\sqrt{5^{2}-3^{2}}=4$ と分かります。弦全体はその 2 倍の $8$ です。` },
        { t: '円の接線の方程式（(4)）',
          m: [R`(5-2)(x-2) + (3+1)(y+1) = 25`,
              R`3(x-2) + 4(y+1) = 25 \;\Rightarrow\; 3x + 4y = 27 \;\Rightarrow\; y = \frac{27 - 3x}{4}`],
          n: R`円 $(x-a)^{2}+(y-b)^{2}=r^{2}$ 上の点 $(x_{0},\ y_{0})$ における接線は $(x_{0}-a)(x-a)+(y_{0}-b)(y-b)=r^{2}$ です。$a=2,\ b=-1,\ x_{0}=5,\ y_{0}=3$ を代入します。（別解）中心 $(2,-1)$ と P を結ぶ半径の傾きは $\dfrac{3-(-1)}{5-2}=\dfrac{4}{3}$ で、接線はこれに垂直なので傾きは $-\dfrac{3}{4}$。$y-3=-\dfrac{3}{4}(x-5)$ からも同じ式が得られます。`,
          easy: R`**接線**は、円と 1 点だけで接する直線で、接点を通る半径と直角に交わります。だから「半径の傾きの逆数にマイナスをつけたもの」が接線の傾きになります（傾き $\dfrac{4}{3}$ の直線に垂直な直線の傾きは $-\dfrac{3}{4}$）。接点 P を通るという条件から、直線の式が決まります。`,
          pro: R`接線の公式 $(x_{0}-a)(x-a)+(y_{0}-b)(y-b)=r^{2}$ は暗記しておくと速い。ここで接線 $3x+4y=27$ は $l$ と平行で、2 直線の距離が $\dfrac{|27-17|}{5} = 2 = r - d$ になっていることも確認できます。` }
      ],
      tags: ['円の方程式', '点と直線の距離', '弦の長さ', '接線']
    },

    /* ---------- 三角関数 ---------- */
    {
      id: 'm-basic-trig2-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-trig2',
      title: '三角関数の合成と方程式',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`関数 $f(\theta) = \sin\theta + \sqrt{3}\cos\theta$ $(0 \le \theta < 2\pi)$ を考える。$f(\theta) = r\sin(\theta + \alpha)$ $(r > 0,\ -\pi < \alpha \le \pi)$ と表すとき、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$r$ の値を求めよ。`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$\alpha$ の値（ラジアン）を求めよ。`, type: 'num', answer: Math.PI / 3, show: R`\frac{\pi}{3}`, hint: R`例: 3π/4 や 3*pi/4` },
        { label: '(3)', q: R`方程式 $f(\theta) = 1$ の解のうち、小さい方を求めよ。`, type: 'num', answer: Math.PI / 2, show: R`\frac{\pi}{2}`, hint: R`例: 3π/4（3*pi/4 でも可）` },
        { label: '(4)', q: R`方程式 $f(\theta) = 1$ の解のうち、大きい方を求めよ。`, type: 'num', answer: 11 * Math.PI / 6, show: R`\frac{11}{6}\pi`, hint: R`例: 3π/4（3*pi/4 でも可）` }
      ],
      solution: [
        { t: '三角関数を合成する（(1)(2)）',
          m: [R`\sin\theta + \sqrt{3}\cos\theta = 2\left(\frac{1}{2}\sin\theta + \frac{\sqrt{3}}{2}\cos\theta\right)`,
              R`= 2\left(\sin\theta\cos\frac{\pi}{3} + \cos\theta\sin\frac{\pi}{3}\right) = 2\sin\left(\theta + \frac{\pi}{3}\right)`],
          n: R`$a\sin\theta + b\cos\theta$ は、$\sqrt{a^{2}+b^{2}}$ でくくると $r\sin(\theta+\alpha)$ の形になります（三角関数の合成）。ここでは $\sqrt{1^{2}+(\sqrt{3})^{2}}=2$ でくくり、$\cos\alpha=\dfrac{1}{2},\ \sin\alpha=\dfrac{\sqrt{3}}{2}$ となる $\alpha=\dfrac{\pi}{3}$ を選びます。よって $r=2,\ \alpha=\dfrac{\pi}{3}$ です。`,
          easy: R`$\sin$ と $\cos$ が両方入った式は、**1 つの $\sin$ にまとめる（合成する）** と、方程式も最大・最小も楽になります。コツは、$\sin\theta$ の係数 $1$ と $\cos\theta$ の係数 $\sqrt{3}$ を直角三角形の 2 辺とみて、斜辺 $\sqrt{1+3}=2$ でくくること。すると $\dfrac{1}{2}$ と $\dfrac{\sqrt{3}}{2}$ が出てきます。これは $\cos\dfrac{\pi}{3}$ と $\sin\dfrac{\pi}{3}$ の値です。加法定理 $\sin(\theta+\alpha)=\sin\theta\cos\alpha+\cos\theta\sin\alpha$ を逆向きに使ったことになります。`,
          pro: R`合成の公式 $a\sin\theta+b\cos\theta=\sqrt{a^{2}+b^{2}}\sin(\theta+\alpha)$（$\cos\alpha=\dfrac{a}{\sqrt{a^{2}+b^{2}}},\ \sin\alpha=\dfrac{b}{\sqrt{a^{2}+b^{2}}}$）は暗記して即答できるように。` },
        { t: R`方程式を $\sin$ の形にして、角の範囲を確認する`,
          m: [R`2\sin\left(\theta + \frac{\pi}{3}\right) = 1 \;\Rightarrow\; \sin\left(\theta + \frac{\pi}{3}\right) = \frac{1}{2}`,
              R`0 \le \theta < 2\pi \;\Rightarrow\; \frac{\pi}{3} \le \theta + \frac{\pi}{3} < \frac{7}{3}\pi`],
          n: R`$x = \theta + \dfrac{\pi}{3}$ とおくと、$x$ のとり得る範囲は $\dfrac{\pi}{3} \le x < \dfrac{7}{3}\pi$ です。この範囲で $\sin x = \dfrac{1}{2}$ となる $x$ を探します。`,
          easy: R`$\theta + \dfrac{\pi}{3}$ をひとまとまり（$x$）とみなして方程式を解くときは、**範囲も同じだけずらす**のを忘れないでください。$\theta$ が $0$ から $2\pi$ 未満まで動くので、$x$ は $\dfrac{\pi}{3}$ から始まって $\dfrac{\pi}{3}+2\pi=\dfrac{7}{3}\pi$ 未満まで動きます。`,
          pro: R`置き換え $x=\theta+\alpha$ をしたら範囲もずらす。ここを忘れる誤答が非常に多いです。` },
        { t: R`単位円で $\sin x = \dfrac{1}{2}$ の解を探す（(3)(4)）`,
          m: [R`x = \frac{5}{6}\pi,\ \frac{13}{6}\pi`,
              R`\theta = \frac{5}{6}\pi - \frac{\pi}{3} = \frac{\pi}{2}, \qquad \theta = \frac{13}{6}\pi - \frac{\pi}{3} = \frac{11}{6}\pi`],
          n: R`$\sin x = \dfrac{1}{2}$ となる $x$ は、$x = \dfrac{\pi}{6},\ \dfrac{5}{6}\pi$ に $2\pi$ の整数倍を加えたものです。範囲 $\dfrac{\pi}{3} \le x < \dfrac{7}{3}\pi$ に入るのは $x = \dfrac{5}{6}\pi$ と $x = \dfrac{\pi}{6}+2\pi = \dfrac{13}{6}\pi$ で、$x=\dfrac{\pi}{6}$ は範囲より小さいので不適です。`,
          easy: R`単位円（半径 1 の円）で考えます。$\sin x$ は円周上の点の高さ（$y$ 座標）なので、高さが $\dfrac{1}{2}$ の点は 2 か所（$\dfrac{\pi}{6}$ と $\dfrac{5}{6}\pi$ の位置）あります。ただし範囲が $\dfrac{\pi}{3}$ から始まっているので $\dfrac{\pi}{6}$ は範囲の外。かわりに 1 周まわった $\dfrac{\pi}{6}+2\pi=\dfrac{13}{6}\pi$ が範囲に入ります。グラフで見ると、$y=f(\theta)$ と直線 $y=1$ の交点が 2 つあります。`,
          fig: figTrigSum() },
        { t: '検算',
          m: [R`f\left(\frac{\pi}{2}\right) = \sin\frac{\pi}{2} + \sqrt{3}\cos\frac{\pi}{2} = 1 + 0 = 1`,
              R`f\left(\frac{11}{6}\pi\right) = -\frac{1}{2} + \sqrt{3} \cdot \frac{\sqrt{3}}{2} = -\frac{1}{2} + \frac{3}{2} = 1`],
          n: R`元の式に代入して、どちらも $f(\theta)=1$ になることを確かめます。`,
          lv: 2 }
      ],
      tags: ['合成', '三角方程式', '単位円']
    },

    /* ---------- 指数・対数関数 ---------- */
    {
      id: 'm-basic-explog-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-explog',
      title: '指数・対数の計算と方程式・不等式',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`次の問いに答えよ。必要なら $\log_{10}2 = 0.3010$ を用いてよい。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$8^{\frac{2}{3}} \times 27^{-\frac{1}{3}}$ の値を求めよ。`, type: 'num', answer: 4 / 3, show: R`\frac{4}{3}`, hint: R`例: 3/7` },
        { label: '(2)', q: R`方程式 $4^{x} - 5 \cdot 2^{x} + 4 = 0$ の解のうち、大きい方を求めよ。`, type: 'num', answer: 2 },
        { label: '(3)', q: R`不等式 $\log_{2}(x-1) + \log_{2}(x+2) \le 2$ の解として正しいものを選べ。`, type: 'choice', choices: [R`$-3 \le x \le 2$`, R`$1 < x \le 2$`, R`$x \le 2$`, R`$1 \le x \le 2$`], answer: 1 },
        { label: '(4)', q: R`$2^{40}$ は何桁の整数か。`, type: 'num', answer: 13 }
      ],
      solution: [
        { t: '前提：指数と対数の意味',
          n: R`$a^{p}=M$ のとき、$p$ を $\log_{a}M$ と書きます（$a>0,\ a \ne 1,\ M>0$）。つまり対数 $\log_{a}M$ は「$a$ を何乗すると $M$ になるか」を表す数です。指数法則 $a^{p}a^{q}=a^{p+q}$、$(a^{p})^{q}=a^{pq}$ と、対数の性質 $\log_{a}MN=\log_{a}M+\log_{a}N$ が基本です。`,
          easy: R`$2^{3}=8$ のとき、「$2$ を $3$ 乗すると $8$」なので、$\log_{2}8=3$ と書きます。つまり対数は、指数の式を「指数を答えにする」形に書き直したものです。$2^{x}$ のように $x$ が指数に入っている関数が指数関数で、$x$ を求めるときに対数が使われます。かけ算が足し算に変わる（$\log MN=\log M+\log N$）のが対数の便利なところです。`,
          lv: 3 },
        { t: '指数法則で計算する（(1)）',
          m: [R`8^{\frac{2}{3}} = (2^{3})^{\frac{2}{3}} = 2^{2} = 4`,
              R`27^{-\frac{1}{3}} = (3^{3})^{-\frac{1}{3}} = 3^{-1} = \frac{1}{3}`,
              R`4 \times \frac{1}{3} = \frac{4}{3}`],
          n: R`底をそろえて、指数法則 $(a^{p})^{q} = a^{pq}$ を使います。$a^{-n} = \dfrac{1}{a^{n}}$ です。`,
          easy: R`$8 = 2^{3}$、$27 = 3^{3}$ と気づくのがポイントです。$8^{\frac{2}{3}}$ は「8 の $\dfrac{1}{3}$ 乗（= 3 乗して 8 になる数 $2$）を 2 乗する」と読めば $2^{2}=4$。指数が負のときは逆数になるので、$27^{-\frac{1}{3}} = \dfrac{1}{27^{\frac{1}{3}}} = \dfrac{1}{3}$ です。` },
        { t: '$2^{x}=t$ とおいて 2 次方程式にする（(2)）',
          m: [R`4^{x} = (2^{x})^{2} = t^{2}`,
              R`t^{2} - 5t + 4 = (t-1)(t-4)`,
              R`t = 1,\ 4 \;\Rightarrow\; 2^{x} = 1,\ 4 \;\Rightarrow\; x = 0,\ 2`],
          n: R`$t = 2^{x}$ とおくと $t>0$ です。$t^{2}-5t+4=0$ を解いて $t=1,\ 4$（どちらも $t>0$ を満たす）。$2^{x}=1$ より $x=0$、$2^{x}=4$ より $x=2$ です。大きい方は $x=2$ です。`,
          easy: R`$4^{x}$ は $(2^{2})^{x} = (2^{x})^{2}$ と書き直せます。そこで $2^{x}$ を 1 つの文字 $t$ とおくと、$x$ の式が $t$ の 2 次方程式に変わります。$t$ を求めたら、$2^{x}=t$ に戻して $x$ を求めます。指数関数の値は必ず正なので、$t>0$ であることも確認します。`,
          pro: R`$a^{2x}$ と $a^{x}$ が混ざっていたら $t=a^{x}$ の置き換え。$t>0$ の確認が頻出の落とし穴です。` },
        { t: '真数条件を確認して不等式を解く（(3)）',
          m: [R`\text{真数条件: } x - 1 > 0 \text{ かつ } x + 2 > 0 \;\Rightarrow\; x > 1`,
              R`\log_{2}(x-1)(x+2) \le 2 = \log_{2}4 \;\Rightarrow\; (x-1)(x+2) \le 4`,
              R`(x-1)(x+2) - 4 = x^{2} + x - 6 = (x+3)(x-2) \le 0 \;\Rightarrow\; -3 \le x \le 2`,
              R`x > 1 \text{ と合わせて } 1 < x \le 2`],
          n: R`対数の真数は正でなければならないので、まず $x>1$ が必要です。底 $2$ は $1$ より大きいので、$\log_{2}A \le \log_{2}B$ と $A \le B$ は同じ向きです。$(x+3)(x-2) \le 0$ の解 $-3 \le x \le 2$ のうち、$x>1$ を満たすのは $1<x\le 2$ です。`,
          easy: R`対数の中身（真数）は必ず正の数です。だから最初に「$x-1>0$ かつ $x+2>0$」で $x$ の範囲を絞ります。次に、$\log_{2}$ の和は積にまとめ、右辺 $2$ も $\log_{2}4$ と書き直して、真数どうしを比べます。底が $1$ より大きいので、不等号の向きは変わりません。最後に「真数条件の範囲」との共通部分を取るのを忘れずに。図では、曲線が $y=2$ 以下になる範囲が $x=1$ の右側から $x=2$ までです。`,
          fig: figLogIneq() },
        { t: '常用対数で桁数を調べる（(4)）',
          m: [R`\log_{10}2^{40} = 40\log_{10}2 = 40 \times 0.3010 = 12.04`,
              R`12 \le \log_{10}2^{40} < 13 \;\Rightarrow\; 10^{12} \le 2^{40} < 10^{13}`],
          n: R`$N$ が $k$ 桁の整数であることは $10^{k-1} \le N < 10^{k}$、つまり $k-1 \le \log_{10}N < k$ と同じです。$\log_{10}2^{40}=12.04$ は $12$ 以上 $13$ 未満なので、$2^{40}$ は **13 桁** の整数です。`,
          easy: R`たとえば 3 桁の整数は $100 \le N < 1000$、すなわち $10^{2} \le N < 10^{3}$ です。10 を底とする対数をとると $2 \le \log_{10}N < 3$ なので、「$\log_{10}N$ の整数部分 + 1」が桁数になります。$40 \times 0.3010 = 12.04$ の整数部分は $12$ なので、$12+1=13$ 桁です。` }
      ],
      tags: ['指数法則', '対数', '常用対数', '真数条件']
    },

    /* ---------- 微分・積分（数II） ---------- */
    {
      id: 'm-basic-calc2-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-calc2',
      title: '3次関数の極値・接線・解の個数',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`関数 $f(x) = x^{3} - 6x^{2} + 9x + 1$ について、次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$f(x)$ の極大値を求めよ。`, type: 'num', answer: 5 },
        { label: '(2)', q: R`$f(x)$ の極小値を求めよ。`, type: 'num', answer: 1 },
        { label: '(3)', q: R`曲線 $y = f(x)$ 上の点 $(0,\ f(0))$ における接線の方程式を $y = \boxed{\ \ }$ の形で答えよ。`, type: 'expr', answer: '9x+1', vars: ['x'], show: R`9x+1`, hint: R`例: 2x-3` },
        { label: '(4)', q: R`$x$ の方程式 $f(x) = k$ が異なる 3 個の実数解をもつような定数 $k$ の範囲として正しいものを選べ。`, type: 'choice', choices: [R`$1 < k < 5$`, R`$1 \le k \le 5$`, R`$0 < k < 6$`, R`$k < 1$ または $k > 5$`], answer: 0 }
      ],
      solution: [
        { t: '前提：微分とは（導関数と傾き）',
          n: R`関数 $f(x)$ の各点での接線の傾きを表す関数を**導関数** $f'(x)$ といい、$f'(x)$ を求める計算を**微分**といいます。$x^{n}$ の導関数は $nx^{n-1}$、定数の導関数は $0$ です。たとえば $f(x)=x^{3}-6x^{2}+9x+1$ の導関数は $f'(x)=3x^{2}-12x+9$ です。`,
          easy: R`グラフのある点に定規を当てて、その点だけでグラフに触れる直線（接線）を引きます。その直線がどれくらい急かを表す数が「傾き」で、右上がりなら正、右下がりなら負です。微分は、この「傾き」をすべての $x$ について 1 つの式にまとめる計算です。ルールは簡単で、**$x^{n}$ を $nx^{n-1}$ にする**（指数を前に出して 1 減らす）だけです。`,
          lv: 3 },
        { t: '導関数を求めて増減を調べる',
          m: [R`f'(x) = 3x^{2} - 12x + 9 = 3(x-1)(x-3)`,
              R`f'(x) = 0 \;\Rightarrow\; x = 1,\ 3`],
          n: R`$x<1$ で $f'(x)>0$（増加）、$1<x<3$ で $f'(x)<0$（減少）、$x>3$ で $f'(x)>0$（増加）です。したがって $x=1$ で増加から減少に変わるので極大、$x=3$ で減少から増加に変わるので極小になります。`,
          easy: R`**導関数** $f'(x)$ は、グラフの各点での「接線の傾き」を表す式です。$f'(x)>0$ ならグラフは右上がり（増加）、$f'(x)<0$ なら右下がり（減少）です。傾きが $0$ になる点 $x=1,\ 3$ がグラフの「山の頂上」「谷の底」の候補です。図の曲線を左から目で追うと、$x=1$ で山、$x=3$ で谷になっています。`,
          fig: figCubic() },
        { t: '極値を求める（(1)(2)）',
          m: [R`f(1) = 1 - 6 + 9 + 1 = 5`,
              R`f(3) = 27 - 54 + 27 + 1 = 1`],
          n: R`極大値は $f(1)=5$、極小値は $f(3)=1$ です。極値は「$x$ の値」ではなく「そのときの $f(x)$ の値」であることに注意しましょう。`,
          easy: R`山の頂上の高さが**極大値**、谷の底の高さが**極小値**です。どちらも、$x=1$ や $x=3$ を元の式 $f(x)$ に代入して求めます。` },
        { t: '接線の方程式（(3)）',
          m: [R`f(0) = 1, \qquad f'(0) = 9`,
              R`y - 1 = 9(x - 0) \;\Rightarrow\; y = 9x + 1`],
          n: R`点 $(a,\ f(a))$ における接線は $y - f(a) = f'(a)(x-a)$ です。$a=0$ を代入します。`,
          easy: R`接線は「その点を通り、傾きが $f'(a)$ の直線」です。点 $(0,\ 1)$ を通り、傾き $f'(0)=9$ の直線なので、$y-1=9(x-0)$ から $y=9x+1$ と分かります。` },
        { t: '方程式の実数解の個数をグラフで考える（(4)）',
          m: R`1 < k < 5`,
          n: R`方程式 $f(x)=k$ の実数解は、曲線 $y=f(x)$ と水平な直線 $y=k$ の共有点の $x$ 座標です。共有点が 3 個になるのは、直線が極小値 $1$ と極大値 $5$ のあいだにあるとき、すなわち $1<k<5$ です。$k=1$ や $k=5$ のときは直線が山や谷の頂点に接して共有点が 2 個になるので、等号は含みません。`,
          easy: R`曲線 $y=f(x)$ に水平な直線 $y=k$ をひき、上下に動かしてみましょう。直線が谷の底（高さ $1$）と山の頂上（高さ $5$）の間にあるときだけ、曲線と 3 回交わります。ちょうど $1$ や $5$ の高さでは、頂点にぴったり触れる（接する）ので 2 個になってしまいます。`,
          pro: R`「解の個数 → 定数分離して $y=k$ との交点の個数」は定石。極大値・極小値と $k$ の大小で個数が決まります。` }
      ],
      tags: ['極値', '接線', '方程式の解の個数']
    },

    {
      id: 'm-basic-calc2-02',
      subject: 'math',
      level: 'basic',
      unit: 'm-calc2',
      title: '定積分と面積',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`$f(x) = x^{2} - 4x + 3$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`定積分 $\int_{0}^{3} f(x)\,dx$ の値を求めよ。`, type: 'num', answer: 0 },
        { label: '(2)', q: R`放物線 $y = f(x)$ と $x$ 軸で囲まれた部分の面積を求めよ。`, type: 'num', answer: 4 / 3, show: R`\frac{4}{3}`, hint: R`例: 3/7` },
        { label: '(3)', q: R`定積分 $\int_{0}^{4} |f(x)|\,dx$ の値を求めよ。`, type: 'num', answer: 4 },
        { label: '(4)', q: R`$S(t) = \int_{0}^{t} f(x)\,dx$ とする。$0 \le t \le 4$ における $S(t)$ の最大値を求めよ。`, type: 'num', answer: 4 / 3, show: R`\frac{4}{3}`, hint: R`例: 3/7` }
      ],
      solution: [
        { t: '前提：積分とは（微分の逆と面積）',
          n: R`微分すると $f(x)$ になる関数を $f(x)$ の**原始関数**といい、$F(x)$ で表します。**定積分** $\int_{a}^{b} f(x)\,dx = F(b) - F(a)$ は、$a \le x \le b$ で $f(x) \ge 0$ のとき、グラフと $x$ 軸の間の面積を表します。`,
          easy: R`積分は、微分の「逆向き」の計算です。たとえば $x^{2}$ を微分すると $2x$ なので、$2x$ を積分すると $x^{2}$（に定数を足したもの）です。さらに、「グラフの下の面積」は、グラフの式を積分して上端と下端の差をとると求まる、という便利な性質があります。$x$ 軸より下にある部分は、面積が「マイナス」として計算されます。`,
          lv: 3 },
        { t: '原始関数を求める',
          m: [R`F(x) = \frac{x^{3}}{3} - 2x^{2} + 3x \quad (F'(x) = f(x))`,
              R`F(0) = 0, \quad F(1) = \frac{1}{3} - 2 + 3 = \frac{4}{3}, \quad F(3) = 9 - 18 + 9 = 0, \quad F(4) = \frac{64}{3} - 32 + 12 = \frac{4}{3}`],
          n: R`$f(x)$ の原始関数（微分すると $f(x)$ になる関数）の 1 つを $F(x)$ とすると、$\int_{a}^{b} f(x)\,dx = F(b) - F(a)$ です。後の計算で使う値 $F(0),\ F(1),\ F(3),\ F(4)$ を先に求めておきます。`,
          easy: R`**定積分**は、グラフの下の面積（$x$ 軸より下の部分は負の面積）を表します。計算は「$F(x)$ をつくって、上端の値から下端の値を引く」だけです。$F(x)$ は $f(x)$ の項ごとに $x^{n}$ を $\dfrac{x^{n+1}}{n+1}$ に直せば得られます（$x^{2} \to \dfrac{x^{3}}{3}$、$-4x \to -2x^{2}$、$3 \to 3x$）。` },
        { t: R`$\int_{0}^{3}f(x)\,dx$ を求める（(1)）`,
          m: R`\int_{0}^{3} f(x)\,dx = F(3) - F(0) = 0 - 0 = 0`,
          n: R`$0$ になりました。これは、$x$ 軸より上の部分（$0 \le x \le 1$）の面積と、下の部分（$1 \le x \le 3$）の面積が打ち消し合うためです（図参照）。`,
          easy: R`定積分は「上の面積は $+$、$x$ 軸より下の面積は $-$」として足し合わせます。この問題では、上にふくらんだ部分と下にふくらんだ部分がちょうど同じ大きさなので、合計が $0$ になります。` },
        { t: '囲まれた部分の面積（(2)）',
          m: [R`f(x) = (x-1)(x-3) \le 0 \quad (1 \le x \le 3)`,
              R`S = -\int_{1}^{3} f(x)\,dx = -\{F(3) - F(1)\} = -\left(0 - \frac{4}{3}\right) = \frac{4}{3}`],
          n: R`放物線は $x=1,\ 3$ で $x$ 軸と交わり、$1 \le x \le 3$ では $f(x) \le 0$（$x$ 軸の下側）です。面積は正の値なので、$f(x)$ に $-1$ をかけて積分します。`,
          easy: R`グラフが $x$ 軸より下にある部分の定積分はマイナスになるので、**面積を求めるときは符号を正にそろえます**（$-1$ をかける）。図の黄色い部分がこの面積です。`,
          pro: R`放物線と $x$ 軸（または放物線どうし）で囲まれた面積は、$\dfrac{|a|}{6}(\beta-\alpha)^{3}$ で一発計算できる（ここでは $\dfrac{1}{6} \times 2^{3} = \dfrac{4}{3}$）。`,
          fig: figParabolaArea() },
        { t: '絶対値つきの定積分（(3)）',
          m: [R`\int_{0}^{4} |f(x)|\,dx = \int_{0}^{1} f(x)\,dx - \int_{1}^{3} f(x)\,dx + \int_{3}^{4} f(x)\,dx`,
              R`= \{F(1) - F(0)\} - \{F(3) - F(1)\} + \{F(4) - F(3)\}`,
              R`= \frac{4}{3} + \frac{4}{3} + \frac{4}{3} = 4`],
          n: R`$|f(x)|$ は、$f(x)\ge 0$ の区間 $0\le x\le 1,\ 3\le x\le 4$ では $f(x)$、$f(x)\le 0$ の区間 $1\le x\le 3$ では $-f(x)$ です。区間を分けて積分します。`,
          easy: R`絶対値は「マイナスの部分をプラスに折り返す」操作です。グラフの $x$ 軸より下の部分を上に折り返したときの、全体の面積を求めることになります。そこで $f(x)$ の符号が変わる $x=1,\ 3$ で区間を 3 つに分け、下側の区間だけ $-1$ をかけます。` },
        { t: '$S(t)$ の最大値（(4)）',
          m: [R`S(t) = F(t) - F(0) = F(t), \qquad S'(t) = f(t) = (t-1)(t-3)`,
              R`S(0) = 0,\ S(1) = \frac{4}{3},\ S(3) = 0,\ S(4) = \frac{4}{3}`],
          n: R`$S'(t)=f(t)$ なので、$S(t)$ は $0\le t\le 1$ で増加、$1\le t\le 3$ で減少、$3\le t\le 4$ で増加します。最大値の候補は極大となる $t=1$ と区間の右端 $t=4$ で、どちらも $\dfrac{4}{3}$ です。よって最大値は $\dfrac{4}{3}$ です。`,
          easy: R`$S(t)$ は「$0$ から $t$ まで」の定積分なので、$t$ を右に動かすとグラフの下の（符号つき）面積がどんどん積み重なっていきます。$f(t)>0$ の間は面積が増え、$f(t)<0$ の間は減ります。$t=1$ まで増えて $\dfrac{4}{3}$、$t=3$ まで減って $0$、$t=4$ まで増えて再び $\dfrac{4}{3}$ になります。`,
          pro: R`「積分の上端を変数にした関数 $S(t)$」は、微分すると中身 $f(t)$ に戻る（微分と積分の関係）。増減は $f(t)$ の符号で決まります。` }
      ],
      tags: ['定積分', '面積', '絶対値', '微分と積分の関係']
    },

    /* ---------- 数列 ---------- */
    {
      id: 'm-basic-seq-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-seq',
      title: '等差数列の一般項と和',
      source: { univ: 'オリジナル' },
      time: 6,
      body: R`等差数列 $\{a_{n}\}$ について、$a_{3} = 11,\ a_{8} = 31$ である。初項から第 $n$ 項までの和を $S_{n}$ とする。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`公差を求めよ。`, type: 'num', answer: 4 },
        { label: '(2)', q: R`一般項 $a_{n}$ を $n$ の式で表せ。`, type: 'expr', answer: '4n-1', vars: ['n'], show: R`4n-1`, hint: R`例: 2n+5` },
        { label: '(3)', q: R`$S_{20}$ の値を求めよ。`, type: 'num', answer: 820 },
        { label: '(4)', q: R`$S_{n} > 300$ となる最小の自然数 $n$ を求めよ。`, type: 'num', answer: 13 }
      ],
      solution: [
        { t: '前提：数列と等差数列',
          n: R`数を 1 列に並べたものを**数列**といい、第 $n$ 番目の数を第 $n$ 項 $a_{n}$ とよびます。となり合う項の差が一定の数列を**等差数列**といい、その差を**公差** $d$ とよびます。すなわち $a_{n+1} = a_{n} + d$ です。`,
          easy: R`たとえば $3,\ 7,\ 11,\ 15,\ \cdots$ は、前の項に $4$ を足すと次の項になっています。こういう数列が等差数列で、足している数 $4$ が公差です。第 $n$ 項は、最初の項（初項）に公差を $(n-1)$ 回足したものになります。`,
          lv: 3 },
        { t: '公差を求める（(1)）',
          m: R`a_{8} = a_{3} + 5d \;\Rightarrow\; 31 = 11 + 5d \;\Rightarrow\; d = 4`,
          n: R`等差数列では、項が 1 つ進むごとに公差 $d$ ずつ増えます。第 $3$ 項から第 $8$ 項までは $5$ 回進むので、$a_{8} = a_{3} + 5d$ です。`,
          easy: R`**等差数列**は、となり合う項の差がいつも同じ数 $d$（**公差**）になる数列です。第 $3$ 項から第 $8$ 項まで進むには「$+d$」を $8-3=5$ 回くり返すので、$a_{8}$ は $a_{3}$ に $5d$ を足したものになります。` },
        { t: '一般項を求める（(2)）',
          m: [R`a_{1} = a_{3} - 2d = 11 - 8 = 3`,
              R`a_{n} = a_{1} + (n-1)d = 3 + 4(n-1) = 4n - 1`],
          n: R`初項 $a_{1}$ は、$a_{3}$ から $d$ を $2$ 回戻して求めます。一般項は $a_{n} = a_{1} + (n-1)d$ です。`,
          easy: R`第 $n$ 項は、初項から「$+d$」を $(n-1)$ 回くり返した値です。だから $a_{n} = a_{1} + (n-1)d$ となります。確かめると、$a_{3} = 4 \times 3 - 1 = 11$、$a_{8} = 4 \times 8 - 1 = 31$ で条件に合っています。` },
        { t: '和の公式で $S_{20}$ を求める（(3)）',
          m: [R`S_{n} = \frac{n(a_{1} + a_{n})}{2} = \frac{n(3 + 4n - 1)}{2} = n(2n+1)`,
              R`S_{20} = 20 \times 41 = 820`],
          n: R`等差数列の和は「（初項 + 末項）× 項数 ÷ 2」です。`,
          easy: R`数列を順に足した式と、逆順に足した式を縦に並べると、どの列も「初項 + 末項」と同じ値になります。それが $n$ 列あるので、2 倍の合計が $n(a_{1}+a_{n})$ で、半分にすると和 $S_{n}$ です。ここでは $S_{n} = n(2n+1)$ となるので、$n=20$ を代入します。` },
        { t: '$S_{n} > 300$ を解く（(4)）',
          m: [R`n(2n+1) > 300 \;\Rightarrow\; 2n^{2} + n - 300 > 0`,
              R`2n^{2} + n - 300 = (2n+25)(n-12)`,
              R`(2n+25)(n-12) > 0 \;\Rightarrow\; n > 12 \;\Rightarrow\; n = 13`,
              R`S_{12} = 12 \times 25 = 300, \qquad S_{13} = 13 \times 27 = 351`],
          n: R`$n$ は自然数なので $2n+25>0$ です。したがって $n-12>0$、すなわち $n>12$ で、最小の自然数は $n=13$ です。$S_{12}=300$ はちょうど $300$ で「超えて」いない点に注意しましょう。`,
          easy: R`「$S_{n}$ が $300$ を**超える**」は $S_{n}>300$（等号を含まない）です。実際に $S_{12}=300$ は $300$ ちょうどなので条件に合わず、$S_{13}=351$ が初めて超える項です。不等式の左辺は因数分解して符号を調べます。`,
          pro: R`「超える」「以上」の言葉遣いで等号の有無が変わる。端の値 $S_{12}$ を必ず代入して確認する習慣を。` }
      ],
      tags: ['等差数列', '一般項', '和の公式']
    },

    {
      id: 'm-basic-seq-02',
      subject: 'math',
      level: 'basic',
      unit: 'm-seq',
      title: '漸化式と一般項・和',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`数列 $\{a_{n}\}$ が $a_{1} = 1,\ a_{n+1} = 3a_{n} + 2\ \ (n = 1,\ 2,\ 3,\ \cdots)$ で定められている。次の問いに答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$a_{3}$ を求めよ。`, type: 'num', answer: 17 },
        { label: '(2)', q: R`一般項 $a_{n}$ を $n$ の式で表せ。`, type: 'expr', answer: '2*3^(n-1)-1', vars: ['n'], show: R`2 \cdot 3^{n-1} - 1`, hint: R`累乗は ^ で入力（例: 5*2^(n-1)+3）` },
        { label: '(3)', q: R`$\sum_{k=1}^{6} a_{k}$ の値を求めよ。`, type: 'num', answer: 722 },
        { label: '(4)', q: R`$a_{n} > 1000$ となる最小の自然数 $n$ を求めよ。`, type: 'num', answer: 7 }
      ],
      solution: [
        { t: '順に計算する（(1)）',
          m: [R`a_{2} = 3a_{1} + 2 = 3 \times 1 + 2 = 5`,
              R`a_{3} = 3a_{2} + 2 = 3 \times 5 + 2 = 17`],
          n: R`漸化式の $n$ に $1,\ 2$ を順に代入して求めます。`,
          easy: R`**漸化式**は「前の項から次の項をつくるルール」です。$a_{n+1} = 3a_{n}+2$ は「前の項を 3 倍して 2 を足す」という意味なので、$a_{1}=1$ から順に $a_{2},\ a_{3},\ \cdots$ と計算できます。` },
        { t: '$a_{n}+1$ が等比数列になることを使う（(2)）',
          m: [R`a_{n+1} + 1 = 3a_{n} + 3 = 3(a_{n} + 1)`,
              R`b_{n} = a_{n} + 1 \text{ とおくと } b_{1} = 2,\quad b_{n+1} = 3b_{n}`,
              R`b_{n} = 2 \cdot 3^{n-1} \;\Rightarrow\; a_{n} = 2 \cdot 3^{n-1} - 1`],
          n: R`$a_{n+1} = 3a_{n}+2$ の両辺に $1$ を足して $a_{n+1}+1 = 3(a_{n}+1)$ と変形します（特性方程式 $\alpha = 3\alpha + 2$ の解 $\alpha=-1$ を使った）。これは、数列 $\{a_{n}+1\}$ が初項 $2$、公比 $3$ の等比数列であることを意味します。`,
          easy: R`漸化式 $a_{n+1}=3a_{n}+2$ の「$+2$」がじゃまなので、これを消す工夫をします。もし $a_{n+1}$ も $a_{n}$ も同じ値 $\alpha$ だったとすると $\alpha = 3\alpha+2$ なので $\alpha=-1$。そこで、$a_{n}$ から $\alpha=-1$ を引いた形 $a_{n}+1$ を見ると、毎回ちょうど 3 倍になっています。つまり $\{a_{n}+1\}$ は公比 $3$ の等比数列です。初項は $a_{1}+1=2$ です。`,
          pro: R`$a_{n+1} = pa_{n}+q$ 型は、$\alpha = p\alpha+q$ の解 $\alpha$ を使って $a_{n+1}-\alpha = p(a_{n}-\alpha)$ に変形するのが定石です。` },
        { t: '和を計算する（(3)）',
          m: [R`\sum_{k=1}^{6} a_{k} = \sum_{k=1}^{6} \left(2 \cdot 3^{k-1} - 1\right) = 2 \cdot \frac{3^{6} - 1}{3 - 1} - 6`,
              R`= 728 - 6 = 722`,
              R`a_{4} = 53,\ a_{5} = 161,\ a_{6} = 485: \quad 1 + 5 + 17 + 53 + 161 + 485 = 722`],
          n: R`等比数列の和の公式 $\dfrac{a(r^{n}-1)}{r-1}$ を使います。項数 $6$ の定数項 $-1$ の和が $-6$ です。実際に 6 項を足しても $722$ になります。`,
          easy: R`$2 \cdot 3^{k-1}$ の部分は、初項 $2$、公比 $3$ の等比数列の和です（項数 $6$）。$-1$ の部分は $6$ 個足すので $-6$。2 つを別々に計算して合わせます。` },
        { t: '$a_{n} > 1000$ となる最小の $n$（(4)）',
          m: [R`a_{6} = 2 \cdot 3^{5} - 1 = 485, \qquad a_{7} = 2 \cdot 3^{6} - 1 = 1457`,
              R`a_{n} \text{ は増加し, } a_{6} < 1000 < a_{7} \;\Rightarrow\; n = 7`],
          n: R`$a_{n}$ は $n$ が大きいほど大きくなる（増加数列）ので、$1000$ を初めて超える項を探します。$a_{6}=485<1000<a_{7}=1457$ なので $n=7$ です。`,
          easy: R`この数列は項が進むたびに 3 倍近くに増えるので、$n$ を 1 つずつ増やして $1000$ を超える最初の項を探せば十分です。$3^{5}=243,\ 3^{6}=729$ を使うと $a_{6},\ a_{7}$ がすぐ計算できます。` }
      ],
      tags: ['漸化式', '等比数列', '和']
    },

    /* ---------- ベクトル ---------- */
    {
      id: 'm-basic-vec-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-vec',
      title: 'ベクトルの内積・角・面積',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`座標平面上に原点 O と 2 点 $\mathrm{A}(3,\ 1),\ \mathrm{B}(1,\ 2)$ がある。$\vec{a} = \overrightarrow{\mathrm{OA}},\ \vec{b} = \overrightarrow{\mathrm{OB}}$ とする。次の問いに答えよ。`,
      fig: figVec(false),
      parts: [
        { label: '(1)', q: R`内積 $\vec{a} \cdot \vec{b}$ を求めよ。`, type: 'num', answer: 5 },
        { label: '(2)', q: R`$\vec{a}$ と $\vec{b}$ のなす角 $\theta$ を度（$0\degree \le \theta \le 180\degree$）で求めよ。`, type: 'num', answer: 45, unit: '°' },
        { label: '(3)', q: R`△OAB の面積を求めよ。`, type: 'num', answer: 5 / 2, show: R`\frac{5}{2}`, hint: R`例: 3/4 や 0.75` },
        { label: '(4)', q: R`実数 $t$ が動くとき、$|\vec{a} + t\vec{b}|$ の最小値を求めよ。`, type: 'num', answer: Math.sqrt(5), show: R`\sqrt{5}`, hint: R`例: 5√7（5*sqrt(7) でも可）` }
      ],
      solution: [
        { t: '前提：ベクトルと成分',
          n: R`向きと大きさをもつ量を**ベクトル**といい、座標平面では「$x$ 方向にいくつ、$y$ 方向にいくつ進むか」を表す成分 $(a_{1},\ a_{2})$ で表せます。原点 O から点 $\mathrm{A}(3,\ 1)$ へのベクトル $\overrightarrow{\mathrm{OA}}$ の成分は $(3,\ 1)$ です。長さは $|\vec{a}| = \sqrt{a_{1}^{2} + a_{2}^{2}}$ です。`,
          easy: R`ベクトルは「矢印」です。矢印の長さが大きさ、向きが方向を表します。座標の上では、矢印の始点から終点までに「右へ $3$、上へ $1$」進むとき、成分は $(3,\ 1)$ と書きます。始点がどこにあっても、進む量が同じなら同じベクトルです。長さは、「右へ $3$、上へ $1$」を直角三角形の 2 辺とみて、三平方の定理で求めます。`,
          lv: 3 },
        { t: '内積を成分で計算する（(1)）',
          m: R`\vec{a} \cdot \vec{b} = 3 \times 1 + 1 \times 2 = 5`,
          n: R`成分表示のベクトル $(a_{1},\ a_{2}),\ (b_{1},\ b_{2})$ の内積は $a_{1}b_{1} + a_{2}b_{2}$ です。`,
          easy: R`**内積**は、2 つのベクトルの「向きがどれくらい揃っているか」を表す数です。成分で計算するときは、$x$ 成分どうし、$y$ 成分どうしをかけて足します。向きがそろっているほど大きい正の値、直角なら $0$、反対向きなら負の値になります。` },
        { t: 'なす角を求める（(2)）',
          m: [R`|\vec{a}| = \sqrt{3^{2} + 1^{2}} = \sqrt{10}, \qquad |\vec{b}| = \sqrt{1^{2} + 2^{2}} = \sqrt{5}`,
              R`\cos\theta = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}||\vec{b}|} = \frac{5}{\sqrt{10}\sqrt{5}} = \frac{5}{5\sqrt{2}} = \frac{1}{\sqrt{2}} \;\Rightarrow\; \theta = 45\degree`],
          n: R`内積の定義 $\vec{a} \cdot \vec{b} = |\vec{a}||\vec{b}|\cos\theta$ を $\cos\theta$ について解きます。$\cos\theta = \dfrac{1}{\sqrt{2}}$ となる $0\degree \le \theta \le 180\degree$ の角は $45\degree$ です。`,
          easy: R`内積には「長さの積 × $\cos$（なす角）」という見方があります。$\vec{a}\cdot\vec{b}=5$ と 2 つの長さ $\sqrt{10},\ \sqrt{5}$ が分かっているので、$\cos\theta$ が求まり、$\cos\theta=\dfrac{1}{\sqrt{2}}$ から $\theta=45\degree$ と読み取れます（図の O での角です）。` },
        { t: '三角形の面積（(3)）',
          m: R`S = \frac{1}{2}\left|a_{1}b_{2} - a_{2}b_{1}\right| = \frac{1}{2}\left|3 \times 2 - 1 \times 1\right| = \frac{5}{2}`,
          n: R`$\vec{a} = (a_{1},\ a_{2}),\ \vec{b} = (b_{1},\ b_{2})$ のとき、△OAB の面積は $\dfrac{1}{2}|a_{1}b_{2} - a_{2}b_{1}|$ です。（別解）$\dfrac{1}{2}|\vec{a}||\vec{b}|\sin 45\degree = \dfrac{1}{2} \cdot \sqrt{10} \cdot \sqrt{5} \cdot \dfrac{\sqrt{2}}{2} = \dfrac{5}{2}$ でも同じ値になります。`,
          easy: R`2 つのベクトルを 2 辺とする平行四辺形の面積は $|a_{1}b_{2}-a_{2}b_{1}|$、三角形はその半分です。公式を忘れたら「$\dfrac{1}{2} \times$ 2 辺の長さ $\times \sin$（間の角）」で求められます。` },
        { t: R`$|\vec{a}+t\vec{b}|$ の最小値（(4)）`,
          m: [R`|\vec{a} + t\vec{b}|^{2} = |\vec{a}|^{2} + 2t\,\vec{a} \cdot \vec{b} + t^{2}|\vec{b}|^{2} = 10 + 10t + 5t^{2}`,
              R`10 + 10t + 5t^{2} = 5(t+1)^{2} + 5`],
          n: R`長さの 2 乗は $t$ の 2 次式になるので、平方完成して最小値を調べます。$t=-1$ のとき最小値 $5$ をとるので、$|\vec{a}+t\vec{b}|$ の最小値は $\sqrt{5}$ です。`,
          easy: R`ベクトルの長さは根号がついて扱いにくいので、まず **2 乗した式**を作ります（$|\vec{p}|^{2}=\vec{p}\cdot\vec{p}$ を展開）。すると $t$ の 2 次関数になり、平方完成すれば最小値が分かります。図形的には、点 A から直線 OB へおろした垂線の長さ $\sqrt{5}$ に当たります（$t=-1$ のとき $\vec{a}-\vec{b}=\overrightarrow{\mathrm{BA}}$ が $\vec{b}$ と垂直になる）。`,
          pro: R`$|\vec{a}+t\vec{b}|$ の最小値は「点と直線の距離」。2 乗して $t$ の 2 次関数にするのが共通テスト・入試の定石です。`,
          fig: figVec(true) }
      ],
      tags: ['内積', 'なす角', '面積', '最小値']
    },

    /* ---------- 極限 ---------- */
    {
      id: 'm-basic-limit-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-limit',
      title: '数列・関数の極限と無限等比級数',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`次の極限値または和を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\lim_{n \to \infty} \dfrac{3n^{2} - n + 1}{2n^{2} + 5}$`, type: 'num', answer: 3 / 2, show: R`\frac{3}{2}`, hint: R`例: 3/7` },
        { label: '(2)', q: R`$\lim_{x \to 2} \dfrac{x^{2} - 4}{x^{2} - 3x + 2}$`, type: 'num', answer: 4 },
        { label: '(3)', q: R`$\lim_{n \to \infty} \left(\sqrt{n^{2} + 4n} - n\right)$`, type: 'num', answer: 2 },
        { label: '(4)', q: R`無限等比級数 $\sum_{n=1}^{\infty} 3\left(-\dfrac{2}{3}\right)^{n-1}$ の和`, type: 'num', answer: 9 / 5, show: R`\frac{9}{5}`, hint: R`例: 3/4 や 0.75` }
      ],
      solution: [
        { t: R`前提：極限（$\lim$）の意味`,
          n: R`$\lim_{n \to \infty} a_{n} = \alpha$ は、$n$ を限りなく大きくしたとき、$a_{n}$ が $\alpha$ に限りなく近づくことを表します。$\lim_{x \to a} f(x) = \alpha$ は、$x$ が $a$ に近づく（$a$ そのものにはならない）とき、$f(x)$ が $\alpha$ に近づくことを表します。`,
          easy: R`たとえば $\dfrac{1}{n}$ は、$n$ が $10,\ 100,\ 1000,\ \cdots$ と大きくなると $0.1,\ 0.01,\ 0.001,\ \cdots$ と小さくなり、$0$ に限りなく近づきます。これを $\lim_{n \to \infty}\dfrac{1}{n}=0$ と書きます。「$0$ そのものになる」のではなく「いくらでも $0$ に近づく」という意味です。この考え方を使って、複雑な式の行き先を調べていきます。`,
          lv: 3 },
        { t: '分母の最高次の項で割る（(1)）',
          m: R`\lim_{n \to \infty} \frac{3n^{2} - n + 1}{2n^{2} + 5} = \lim_{n \to \infty} \frac{3 - \frac{1}{n} + \frac{1}{n^{2}}}{2 + \frac{5}{n^{2}}} = \frac{3}{2}`,
          n: R`分母の最高次の項 $n^{2}$ で、分母・分子をそれぞれ割ります。$n \to \infty$ のとき $\dfrac{1}{n} \to 0,\ \dfrac{1}{n^{2}} \to 0$ です。`,
          easy: R`$n$ が限りなく大きくなると、分子・分母とも限りなく大きくなるので、そのままでは行き先が分かりません。そこで分母の最高次の項 $n^{2}$ で全体を割って、「$n$ が大きいほど小さくなる分数」（$\dfrac{1}{n}$ など）をつくります。それらは $0$ に近づくので、残るのは最高次の係数の比 $\dfrac{3}{2}$ です。` },
        { t: '約分して代入する（(2)）',
          m: [R`\frac{x^{2} - 4}{x^{2} - 3x + 2} = \frac{(x-2)(x+2)}{(x-1)(x-2)} = \frac{x+2}{x-1} \quad (x \ne 2)`,
              R`\lim_{x \to 2}\frac{x+2}{x-1} = \frac{2+2}{2-1} = 4`],
          n: R`$x=2$ をそのまま代入すると $\dfrac{0}{0}$ になる（不定形）ので、分母・分子を因数分解して共通因数 $x-2$ を約分します。$x \to 2$ では $x \ne 2$ なので約分できます。`,
          easy: R`$x \to 2$ は「$x$ が $2$ に限りなく近づく（$2$ そのものにはならない）」という意味です。だから、$0$ で割る形になっていても、共通因数 $x-2$ を約分してからであれば代入して値を求められます。` },
        { t: '有理化して不定形を解消する（(3)）',
          m: [R`\sqrt{n^{2}+4n} - n = \frac{(n^{2}+4n) - n^{2}}{\sqrt{n^{2}+4n}+n} = \frac{4n}{\sqrt{n^{2}+4n}+n} = \frac{4}{\sqrt{1+\frac{4}{n}}+1}`,
              R`n \to \infty \;\Rightarrow\; \frac{4}{\sqrt{1+0}+1} = \frac{4}{2} = 2`],
          n: R`$\infty - \infty$ の形（不定形）なので、$\sqrt{n^{2}+4n}+n$ を分母分子にかけて有理化します。そのあと分母・分子を $n$ で割ります。`,
          easy: R`大きい数どうしの引き算 $\infty-\infty$ は、そのままでは答えが決まりません。平方根をふくむ差は「**和をかけて有理化**」すると、$(a-b)(a+b)=a^{2}-b^{2}$ で根号が消えて、分数の形にできます。その分数に分母の最高次 $n$ で割る方法を使えば、(1) と同じ要領で値が分かります。`,
          pro: R`根号を含む $\infty-\infty$ は「有理化」が決まり手。$\sqrt{n^{2}+an}-n \to \dfrac{a}{2}$ と覚えておくと検算に便利です。` },
        { t: '無限等比級数の和の公式（(4)）',
          m: [R`\text{初項 } 3,\ \text{公比 } r = -\frac{2}{3},\quad |r| < 1 \;\Rightarrow\; \text{収束}`,
              R`\sum_{n=1}^{\infty} 3\left(-\frac{2}{3}\right)^{n-1} = \frac{3}{1 - r} = \frac{3}{1 + \frac{2}{3}} = \frac{3}{\frac{5}{3}} = \frac{9}{5}`],
          n: R`無限等比級数 $\sum_{n=1}^{\infty} ar^{n-1}$ は、$|r|<1$ のとき収束して和は $\dfrac{a}{1-r}$ です。$|r|\ge 1$（$a \ne 0$）のときは発散します。`,
          easy: R`等比数列の項を無限に足していくと、公比 $r$ の絶対値が $1$ より小さいときは、足す値がどんどん小さくなって、合計が一定の値に近づきます。その値が「初項 ÷ (1 − 公比)」です。公比が負のときは、足したり引いたりを交互にくり返しながら近づいていきます。**まず $|r|<1$ を確認**するのを忘れずに。` }
      ],
      tags: ['数列の極限', '関数の極限', '無限等比級数', '不定形']
    },

    /* ---------- 微分法（数III） ---------- */
    {
      id: 'm-basic-diff3-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-diff3',
      title: '積の微分・極値・接線・変曲点',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`関数 $f(x) = x^{2}e^{-x}$ について、次の問いに答えよ。ただし $e$ は自然対数の底である。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$f'(1)$ の値を求めよ。`, type: 'num', answer: Math.exp(-1), show: R`\frac{1}{e}`, hint: R`自然対数の底を含む値は 2e+1 や e^(3/2) のように入力` },
        { label: '(2)', q: R`$f(x)$ の極大値を求めよ。`, type: 'num', answer: 4 * Math.exp(-2), show: R`\frac{4}{e^{2}}`, hint: R`自然対数の底を含む値は 2e+1 や e^(3/2) のように入力` },
        { label: '(3)', q: R`曲線 $y = f(x)$ 上の点 $(3,\ f(3))$ における接線が $x$ 軸と交わる点の $x$ 座標を求めよ。`, type: 'num', answer: 6 },
        { label: '(4)', q: R`$f''(x) = 0$ となる $x$ のうち、大きい方の値を求めよ。`, type: 'num', answer: 2 + Math.sqrt(2), show: R`2+\sqrt{2}`, hint: R`例: 3+2√5（3+2*sqrt(5) でも可）` }
      ],
      solution: [
        { t: R`積の微分法で $f'(x)$ を求める（(1)）`,
          m: [R`f'(x) = 2x \cdot e^{-x} + x^{2} \cdot (-e^{-x}) = (2x - x^{2})e^{-x} = x(2-x)e^{-x}`,
              R`f'(1) = (2 - 1)e^{-1} = \frac{1}{e}`],
          n: R`積の微分法 $\{u(x)v(x)\}' = u'v + uv'$ を、$u = x^{2},\ v = e^{-x}$ として使います。$(e^{-x})' = -e^{-x}$ です（合成関数の微分）。`,
          easy: R`2 つの関数の積の微分は「前を微分して後ろはそのまま」＋「前はそのままで後ろを微分」です。$x^{2}$ を微分すると $2x$、$e^{-x}$ を微分すると $-e^{-x}$（$e^{x}$ は微分しても形が変わらず、$-x$ の中身の微分 $-1$ が前に出る）です。そのあと共通因数 $e^{-x}$ でくくると、符号の判断がしやすくなります。` },
        { t: '増減を調べて極大値を求める（(2)）',
          m: [R`f'(x) = 0 \;\Rightarrow\; x = 0,\ 2`,
              R`f(2) = 2^{2}e^{-2} = \frac{4}{e^{2}}`],
          n: R`$e^{-x}>0$ なので、$f'(x)$ の符号は $x(2-x)$ の符号と同じです。$x<0$ で負（減少）、$0<x<2$ で正（増加）、$x>2$ で負（減少）。よって $x=2$ で極大、$x=0$ で極小（$f(0)=0$）です。極大値は $f(2) = \dfrac{4}{e^{2}}$ です。`,
          easy: R`指数関数 $e^{-x}$ は常に正の数なので、$f'(x)$ の符号は残りの部分 $x(2-x)$ だけで決まります。これは $0<x<2$ のとき正（右上がり）、それ以外は負（右下がり）です。グラフは $x=0$ で底、$x=2$ で山の頂上になります。`,
          fig: figXsqExp() },
        { t: '接線が $x$ 軸と交わる点（(3)）',
          m: [R`f(3) = 9e^{-3}, \qquad f'(3) = (6-9)e^{-3} = -3e^{-3}`,
              R`y - 9e^{-3} = -3e^{-3}(x - 3)`,
              R`y = 0 \;\Rightarrow\; -9e^{-3} = -3e^{-3}(x-3) \;\Rightarrow\; x - 3 = 3 \;\Rightarrow\; x = 6`],
          n: R`接線は $y - f(3) = f'(3)(x-3)$ です。$y=0$ とおいて $x$ を求めます。両辺に共通な $e^{-3}$ は約分できます。`,
          easy: R`接線の式に $y=0$（$x$ 軸上の点）を代入して $x$ を求めるだけです。$e^{-3}$ はどの項にも共通についているので、両辺を $-3e^{-3}$ で割ると、きれいな整数の式 $3 = x-3$ になります。図の破線が、点 $(3,\ f(3))$ から $x$ 軸上の点 $(6,\ 0)$ まで伸びる接線です。` },
        { t: '第 2 次導関数と変曲点（(4)）',
          m: [R`f''(x) = (2 - 2x)e^{-x} + (2x - x^{2})(-e^{-x}) = (x^{2} - 4x + 2)e^{-x}`,
              R`x^{2} - 4x + 2 = 0 \;\Rightarrow\; x = 2 \pm \sqrt{2}`],
          n: R`$f''(x)=0$ の解 $x = 2 \pm \sqrt{2}$ の前後で $f''(x)$ の符号が変わるので、どちらも変曲点（グラフの凹凸が変わる点）の $x$ 座標です。大きい方は $2+\sqrt{2}$ です。`,
          easy: R`$f'(x)$ をもう一度微分したものが $f''(x)$ で、グラフの「曲がり方」（下に凸か上に凸か）を表します。$f''(x)$ の符号が変わる点が**変曲点**で、図では曲線が「谷型のカーブ」から「山型のカーブ」へ切り替わる位置です。$e^{-x}$ は正なので、$x^{2}-4x+2=0$ の解の公式から $x=2\pm\sqrt{2}$ が出ます。`,
          pro: R`$(e^{-x}g(x))' = e^{-x}(g'(x) - g(x))$ の形で一気に微分できる。ここでは $g = 2x-x^{2}$ → $g'-g = 2-2x-2x+x^{2}$。` }
      ],
      tags: ['積の微分', '極値', '接線', '変曲点']
    },

    /* ---------- 積分法（数III） ---------- */
    {
      id: 'm-basic-integ3-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-integ3',
      title: '面積・回転体・部分積分・置換積分',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`曲線 $C: y = \sin x\ (0 \le x \le \pi)$ と $x$ 軸で囲まれた図形を $D$ とする。次の問いに答えよ。`,
      fig: figSinRegion(),
      parts: [
        { label: '(1)', q: R`$D$ の面積を求めよ。`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$D$ を $x$ 軸のまわりに 1 回転させてできる立体の体積を求めよ。`, type: 'num', answer: Math.PI * Math.PI / 2, show: R`\frac{\pi^{2}}{2}`, hint: R`例: 3π/4 や 3*pi/4（2 乗は π^2 や pi^2）` },
        { label: '(3)', q: R`定積分 $\int_{0}^{\pi} x\sin x\,dx$ の値を求めよ。`, type: 'num', answer: Math.PI, show: R`\pi`, hint: R`例: 3π/4（3*pi/4 でも可）` },
        { label: '(4)', q: R`定積分 $\int_{0}^{\frac{\pi}{2}} \sin x\cos^{2}x\,dx$ の値を求めよ。`, type: 'num', answer: 1 / 3, show: R`\frac{1}{3}`, hint: R`例: 3/7` }
      ],
      solution: [
        { t: '前提：定積分と面積・体積',
          n: R`$x$ 軸の上側にある曲線 $y=f(x)$ と $x$ 軸、直線 $x=a,\ x=b$ で囲まれた図形の面積は $\int_{a}^{b} f(x)\,dx$ です。この図形を $x$ 軸のまわりに 1 回転させた立体の体積は $\pi\int_{a}^{b} \{f(x)\}^{2}\,dx$ です。`,
          easy: R`面積は、細い短冊を左から右へ並べて足し合わせたもの（それを極限にしたのが積分）です。短冊 1 本の高さが $f(x)$、幅がごく小さい $dx$ なので、面積は $\int f(x)\,dx$ になります。回転体は、同じ短冊を $x$ 軸のまわりに回して作る「円板」を積み重ねたものです。円板の半径が $f(x)$ なので、面積 $\pi\{f(x)\}^{2}$ に厚み $dx$ をかけて足し合わせると、体積になります。`,
          lv: 3 },
        { t: '面積を定積分で求める（(1)）',
          m: R`S = \int_{0}^{\pi} \sin x\,dx = \left[-\cos x\right]_{0}^{\pi} = -\cos\pi + \cos 0 = 1 + 1 = 2`,
          n: R`$0 \le x \le \pi$ では $\sin x \ge 0$ なので、面積は $\int_{0}^{\pi} \sin x\,dx$ です。$\sin x$ の原始関数は $-\cos x$ です。`,
          easy: R`図の色のついた部分が $D$ です。この部分は $x$ 軸より上にあるので、面積は定積分そのものです。$\sin x$ を微分すると $\cos x$ ですが、逆に「微分して $\sin x$ になる関数」は $-\cos x$（微分すると $-(-\sin x)=\sin x$）です。` },
        { t: '回転体の体積（(2)）',
          m: [R`V = \pi\int_{0}^{\pi} y^{2}\,dx = \pi\int_{0}^{\pi} \sin^{2}x\,dx = \pi\int_{0}^{\pi} \frac{1 - \cos 2x}{2}\,dx`,
              R`= \pi\left[\frac{x}{2} - \frac{\sin 2x}{4}\right]_{0}^{\pi} = \pi \cdot \frac{\pi}{2} = \frac{\pi^{2}}{2}`],
          n: R`$x$ 軸のまわりの回転体の体積は $V = \pi\int_{a}^{b} y^{2}\,dx$ です。$\sin^{2}x$ は半角の公式 $\sin^{2}x = \dfrac{1-\cos 2x}{2}$ で $\cos$ の 1 次式に直してから積分します。`,
          easy: R`回転体は、$x$ 軸に垂直に薄く切ると、どの切り口も「半径 $y$ の円」です。その面積 $\pi y^{2}$ を $x$ について足し合わせる（積分する）のが体積です。$\sin^{2}x$ のままでは積分しにくいので、$\cos 2x$ を使った形に直します（半角の公式）。`,
          pro: R`$\int_{0}^{\pi}\sin^{2}x\,dx=\dfrac{\pi}{2}$ は頻出。$\sin^{2}$ と $\cos^{2}$ の定積分は半角の公式、が定石です。` },
        { t: '部分積分で計算する（(3)）',
          m: [R`\int_{0}^{\pi} x\sin x\,dx = \left[-x\cos x\right]_{0}^{\pi} + \int_{0}^{\pi} \cos x\,dx`,
              R`= \pi + \left[\sin x\right]_{0}^{\pi} = \pi + 0 = \pi`],
          n: R`部分積分の公式 $\int_{a}^{b} f(x)g'(x)\,dx = \left[f(x)g(x)\right]_{a}^{b} - \int_{a}^{b} f'(x)g(x)\,dx$ を、$f(x) = x,\ g'(x) = \sin x$（$g(x)=-\cos x$）として使います。`,
          easy: R`「$x$ のような 1 次式 × $\sin$（または $\cos$、$e^{x}$）」の積分は、**部分積分**で $x$ を微分して消していきます。$x$ を微分すると $1$ になり、積分しにくい積がかんたんな $\int \cos x\,dx$ に変わります。公式は「前 × 後ろの原始関数 − ∫（前の微分 × 後ろの原始関数）」です。` },
        { t: '置換積分で計算する（(4)）',
          m: [R`u = \cos x \;\Rightarrow\; du = -\sin x\,dx, \qquad x: 0 \to \frac{\pi}{2} \;\text{のとき}\; u: 1 \to 0`,
              R`\int_{0}^{\frac{\pi}{2}} \sin x\cos^{2}x\,dx = \int_{1}^{0} u^{2}(-du) = \int_{0}^{1} u^{2}\,du = \left[\frac{u^{3}}{3}\right]_{0}^{1} = \frac{1}{3}`],
          n: R`$\cos x = u$ とおくと $-\sin x\,dx = du$ です。積分の範囲も $x$ の範囲から $u$ の範囲に直します（$x=0$ で $u=1$、$x=\dfrac{\pi}{2}$ で $u=0$）。上下端を入れ替えると符号が変わるので、$\int_{1}^{0} u^{2}(-du) = \int_{0}^{1} u^{2}\,du$ です。`,
          easy: R`積分の中に「ある関数 $\cos x$ と、その微分 $-\sin x$」が一緒に入っているときは、**置換積分**が使えます。$\cos x$ を新しい文字 $u$ に置きかえると、$\sin x\,dx$ がちょうど $-du$ に変わり、$u^{2}$ の積分というかんたんな形になります。上端・下端も $u$ の値に置きかえるのを忘れないでください。`,
          pro: R`$\int f(g(x))g'(x)\,dx$ の形を見抜く。$\sin x\cos^{n}x$ は $u=\cos x$、$\cos x\sin^{n}x$ は $u=\sin x$ が定石です。` }
      ],
      tags: ['面積', '回転体', '部分積分', '置換積分']
    },

    /* ---------- 複素数平面 ---------- */
    {
      id: 'm-basic-cplane-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-cplane',
      title: '極形式とド・モアブルの定理',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`複素数 $z = 1 + \sqrt{3}\,i$、$w = 1 + i$ について、次の問いに答えよ。ただし偏角は $0 \le \arg < 2\pi$ の範囲で答えよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$|z|$ を求めよ。`, type: 'num', answer: 2 },
        { label: '(2)', q: R`$z$ の偏角 $\arg z$（ラジアン）を求めよ。`, type: 'num', answer: Math.PI / 3, show: R`\frac{\pi}{3}`, hint: R`例: 3π/4 や 3*pi/4` },
        { label: '(3)', q: R`$z^{6}$ の値を求めよ。`, type: 'num', answer: 64 },
        { label: '(4)', q: R`$\dfrac{z}{w}$ の偏角（ラジアン）を求めよ。`, type: 'num', answer: Math.PI / 12, show: R`\frac{\pi}{12}`, hint: R`例: 3π/4（3*pi/4 でも可）` }
      ],
      solution: [
        { t: '前提：複素数平面',
          n: R`複素数 $a+bi$ を、座標平面上の点 $(a,\ b)$ に対応させた平面を**複素数平面**といいます。横軸を実軸、縦軸を虚軸とよびます。原点から点 $z$ までの距離が絶対値 $|z|$、実軸の正の部分から測った角が偏角 $\arg z$ です。`,
          easy: R`ふつうの数は数直線の上に並びますが、複素数は「実部」と「虚部」の 2 つの数をもつので、平面上の点として表します。$1+i$ は点 $(1,\ 1)$、$-2i$ は点 $(0,\ -2)$ です。点の位置を「原点からの距離」と「向きの角」で表す形が**極形式**で、かけ算・割り算がとてもきれいに表せるようになります。`,
          lv: 3 },
        { t: '極形式で表す（(1)(2)）',
          m: [R`|z| = \sqrt{1^{2} + (\sqrt{3})^{2}} = \sqrt{4} = 2`,
              R`z = 2\left(\frac{1}{2} + \frac{\sqrt{3}}{2}\,i\right) = 2\left(\cos\frac{\pi}{3} + i\sin\frac{\pi}{3}\right)`],
          n: R`絶対値は、複素数平面上で原点から点 $z$ までの距離 $\sqrt{(\text{実部})^{2}+(\text{虚部})^{2}}$ です。$|z|$ でくくると、実部が $\cos$、虚部が $\sin$ の形になり、偏角が読み取れます。`,
          easy: R`複素数 $a+bi$ を、横軸に実部 $a$、縦軸に虚部 $b$ をとった平面上の点 $(a,\ b)$ とみなしたものが**複素数平面**です。原点からの距離が**絶対値** $|z|$、$x$ 軸の正の向きからの角が**偏角** $\arg z$ です。$z=1+\sqrt{3}\,i$ は点 $(1,\ \sqrt{3})$ で、原点からの距離は $2$、角は $\dfrac{\pi}{3}$（$60\degree$）です。` },
        { t: 'ド・モアブルの定理で $z^{6}$（(3)）',
          m: R`z^{6} = 2^{6}\left(\cos\frac{6\pi}{3} + i\sin\frac{6\pi}{3}\right) = 64(\cos 2\pi + i\sin 2\pi) = 64`,
          n: R`**ド・モアブルの定理** $\{r(\cos\theta + i\sin\theta)\}^{n} = r^{n}(\cos n\theta + i\sin n\theta)$ を使います。`,
          easy: R`複素数を $n$ 乗すると、「絶対値は $n$ 乗」「偏角は $n$ 倍」になります（かけ算で偏角が足されるため）。$z$ を 6 回かけると、絶対値は $2^{6}=64$、角は $60\degree \times 6 = 360\degree$（1 周）で、点は実軸の正の部分にもどります。だから $z^{6}=64$ です。`,
          pro: R`$n$ 乗は極形式にしてから。$z^{n}$ が実数になる条件（偏角の $n$ 倍が $\pi$ の整数倍）もセットで押さえよう。` },
        { t: '商の偏角を求める（(4)）',
          m: [R`w = 1 + i = \sqrt{2}\left(\cos\frac{\pi}{4} + i\sin\frac{\pi}{4}\right)`,
              R`\frac{z}{w} = \frac{2}{\sqrt{2}}\left\{\cos\left(\frac{\pi}{3} - \frac{\pi}{4}\right) + i\sin\left(\frac{\pi}{3} - \frac{\pi}{4}\right)\right\} = \sqrt{2}\left(\cos\frac{\pi}{12} + i\sin\frac{\pi}{12}\right)`],
          n: R`商の極形式は「絶対値は割り算、偏角は引き算」です。$\arg\dfrac{z}{w} = \arg z - \arg w = \dfrac{\pi}{3} - \dfrac{\pi}{4} = \dfrac{\pi}{12}$ で、$0 \le \dfrac{\pi}{12} < 2\pi$ を満たします。`,
          easy: R`複素数のかけ算は「長さをかけて、角を足す」、割り算は「長さを割って、角を引く」です。$z$ の角は $60\degree$、$w$ の角は $45\degree$ なので、$\dfrac{z}{w}$ の角は $60\degree - 45\degree = 15\degree$、ラジアンで $\dfrac{\pi}{12}$ です。図で、3 本の矢印の向きの関係を確かめてみましょう。`,
          fig: figComplex() }
      ],
      tags: ['極形式', 'ド・モアブルの定理', '偏角']
    },

    /* ---------- 2次曲線 ---------- */
    {
      id: 'm-basic-conic-01',
      subject: 'math',
      level: 'basic',
      unit: 'm-conic',
      title: '楕円の焦点・離心率・接線',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`楕円 $E: \dfrac{x^{2}}{16} + \dfrac{y^{2}}{7} = 1$ の 2 つの焦点を $\mathrm{F}(c,\ 0),\ \mathrm{F'}(-c,\ 0)$ $(c > 0)$ とする。$E$ 上の点 $\mathrm{P}\left(3,\ \dfrac{7}{4}\right)$ について、次の問いに答えよ。`,
      fig: figEllipse(false),
      parts: [
        { label: '(1)', q: R`$c$ の値を求めよ。`, type: 'num', answer: 3 },
        { label: '(2)', q: R`$E$ の離心率を求めよ。`, type: 'num', answer: 3 / 4, show: R`\frac{3}{4}`, hint: R`例: 5/2 や 2.5` },
        { label: '(3)', q: R`線分 $\mathrm{PF'}$ の長さを求めよ。`, type: 'num', answer: 25 / 4, show: R`\frac{25}{4}`, hint: R`例: 5/2 や 2.5` },
        { label: '(4)', q: R`点 P における $E$ の接線の方程式を $y = \boxed{\ \ }$ の形で答えよ。`, type: 'expr', answer: '4-3x/4', vars: ['x'], show: R`4-\frac{3}{4}x`, hint: R`例: 5-2x/3` }
      ],
      solution: [
        { t: '前提：楕円の定義と標準形',
          n: R`平面上の 2 つの定点 F, F'（焦点）からの距離の和が一定である点 P の集まりを**楕円**といいます。標準形は $\dfrac{x^{2}}{a^{2}}+\dfrac{y^{2}}{b^{2}}=1$（$a>b>0$）で、$x$ 軸方向の長さ $2a$（長軸）、$y$ 軸方向の長さ $2b$（短軸）です。`,
          easy: R`ピンを 2 本立て、そこにゆるくかけたひもをペンでピンと張りながら 1 周させると、楕円が描けます。ひもの長さが一定なので、「2 本のピン（焦点）までの距離の和がずっと同じ」になります。式の $a^{2}$ は「横の半径の 2 乗」、$b^{2}$ は「縦の半径の 2 乗」です。$a>b$ なら横長の楕円で、焦点は横長の方向（$x$ 軸上）に並びます。`,
          lv: 3 },
        { t: '焦点の位置を求める（(1)）',
          m: R`c^{2} = a^{2} - b^{2} = 16 - 7 = 9 \;\Rightarrow\; c = 3`,
          n: R`楕円 $\dfrac{x^{2}}{a^{2}} + \dfrac{y^{2}}{b^{2}} = 1$（$a>b>0$）の焦点は $(\pm c,\ 0)$、$c = \sqrt{a^{2}-b^{2}}$ です。ここでは $a=4,\ b=\sqrt{7}$ です。`,
          easy: R`楕円は、「2 つの定点（**焦点**）からの距離の和が一定」の点の集まりです。横に長い楕円 $\dfrac{x^{2}}{a^{2}} + \dfrac{y^{2}}{b^{2}} = 1$ では、焦点は長い方の軸（$x$ 軸）上にあり、中心からの距離 $c$ は $c^{2}=a^{2}-b^{2}$ で決まります。$16$ が $x^{2}$ の分母、$7$ が $y^{2}$ の分母です。` },
        { t: '離心率を求める（(2)）',
          m: R`e = \frac{c}{a} = \frac{3}{4}`,
          n: R`離心率は $e = \dfrac{c}{a}$ です（楕円では $0<e<1$）。`,
          easy: R`**離心率**は、楕円のつぶれ具合を表す数で、「焦点までの距離 $c$ ÷ 長軸の半分 $a$」です。$e$ が $0$ に近いほど円に近く、$1$ に近いほど細長い楕円になります。` },
        { t: '焦点からの距離（(3)）',
          m: [R`\mathrm{PF'} = \sqrt{(3+3)^{2} + \left(\frac{7}{4}\right)^{2}} = \sqrt{36 + \frac{49}{16}} = \sqrt{\frac{625}{16}} = \frac{25}{4}`,
              R`\mathrm{PF} = \frac{7}{4}, \qquad \mathrm{PF} + \mathrm{PF'} = \frac{7}{4} + \frac{25}{4} = 8 = 2a`],
          n: R`2 点間の距離の公式で直接求めます。確認として、楕円の性質「焦点からの距離の和 $\mathrm{PF}+\mathrm{PF'}=2a=8$」が成り立っています（P の $x$ 座標が $c=3$ なので $\mathrm{PF}$ は P の高さ $\dfrac{7}{4}$ に等しい）。`,
          easy: R`点 $\mathrm{F'}(-3,\ 0)$ と点 $\mathrm{P}\left(3,\ \dfrac{7}{4}\right)$ の距離を、三平方の定理（横の差 $6$、縦の差 $\dfrac{7}{4}$）で求めます。もう 1 つの焦点 $\mathrm{F}(3,\ 0)$ との距離は真上にあるので $\dfrac{7}{4}$。2 つの距離の和が $2a=8$ になることで、計算の確かめができます。`,
          fig: figEllipse(true) },
        { t: '楕円の接線の公式（(4)）',
          m: [R`\frac{x_{0}x}{a^{2}} + \frac{y_{0}y}{b^{2}} = 1`,
              R`\frac{3x}{16} + \frac{\frac{7}{4}\,y}{7} = 1 \;\Rightarrow\; \frac{3x}{16} + \frac{y}{4} = 1 \;\Rightarrow\; y = 4 - \frac{3}{4}x`],
          n: R`楕円 $\dfrac{x^{2}}{a^{2}} + \dfrac{y^{2}}{b^{2}} = 1$ 上の点 $(x_{0},\ y_{0})$ における接線は $\dfrac{x_{0}x}{a^{2}} + \dfrac{y_{0}y}{b^{2}} = 1$ です。$x_{0}=3,\ y_{0}=\dfrac{7}{4},\ a^{2}=16,\ b^{2}=7$ を代入します。`,
          easy: R`楕円の接線の公式は、楕円の式の $x^{2}$ を $x_{0}x$、$y^{2}$ を $y_{0}y$ に置きかえた形です（円の接線の公式と同じ作り）。接点 P の座標を代入して整理すると、傾き $-\dfrac{3}{4}$、$y$ 切片 $4$ の直線になります。図の破線が接線です。`,
          pro: R`接線の公式は暗記が速い。円 $x^{2}+y^{2}=r^{2}$ → $x_{0}x+y_{0}y=r^{2}$ と同じ形で、2 次曲線すべてに同様の公式があります。` }
      ],
      tags: ['楕円', '焦点', '離心率', '接線']
    }
  ]);
})();
