/* 数II・B — ベクトル: 成分計算 / 内積・なす角 / 三角形の面積 / 内分点・外分点・重心 / 垂直・平行になる x
   構成は ia-quad.js に準拠（intro → result → steps(easy / pro / lv) → fig）。2 次元・3 次元に対応。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;
  const PI = Math.PI, D2R = PI / 180;

  /* ================= 共通ヘルパ ================= */

  const fm = (x, n) => U.fmt(x, n == null ? 4 : n);
  const pa = (t) => R`\left(` + t + R`\right)`;
  const parQ = (q) => (q.sign() < 0 || !q.isInt() ? R`\left(` + q.tex() + R`\right)` : q.tex());
  const AXN = ['x', 'y', 'z'];
  // 成分の組 → (1, 2, 3) の TeX
  const vJoin = (strs) => R`\left(` + strs.join(R`,\ `) + R`\right)`;
  const vTex = (c) => vJoin(c.map((x) => x.tex()));
  const dotQ = (u, w) => u.reduce((s, x, i) => s.add(x.mul(w[i])), Q(0));
  const sqQ = (u) => dotQ(u, u);
  const subV = (u, w) => u.map((x, i) => x.sub(w[i]));
  const addV = (u, w) => u.map((x, i) => x.add(w[i]));
  const scV = (u, k) => u.map((x) => x.mul(k));
  const isZeroV = (u) => u.every((x) => x.isZero());
  const norm = (u) => Math.sqrt(sqQ(u).val());
  // 大きさ（2 乗の Q から）の TeX と近似つき
  const lenTex = (q) => { const t = U.sqrtTex(q); return /\\sqrt/.test(t) ? t + R` \approx ` + fm(Math.sqrt(q.val()), 4) : t; };
  const lenPlain = (q) => U.sqrtTex(q);
  // 成分の積の和 a1b1 + a2b2 + ...（代入形）
  const dotLine = (u, w) => u.map((x, i) => parQ(x) + R` \cdot ` + parQ(w[i])).join(' + ');
  const sqLine = (u) => u.map((x) => parQ(x) + '^{2}').join(' + ');
  const vecOf = (v, k, dim) => { const o = [v[k + '1'], v[k + '2']]; if (dim === 3) o.push(v[k + '3']); return o; };
  const dimOf = (v) => (String(v.dim) === '3' ? 3 : 2);
  const isMul15 = (x) => Math.abs(x / 15 - Math.round(x / 15)) < 1e-7;
  const degT = (d) => (Number.isInteger(d) ? String(d) : fm(d, 2)) + R`\degree`;
  const vstr = (c) => '(' + c.map((x) => x.toString()).join(', ') + ')';

  /* ---------- 図: 2 次元ベクトル ---------- */
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
  // arrows: [{x, y, cls, label, dash, from:[x0,y0]}]  points: [{x, y, label, cls, pos}]
  function vecOpts(arrows, points, minHalf) {
    const pts = [[0, 0]];
    arrows.forEach((a) => { const f = a.from || [0, 0]; pts.push(f, [f[0] + a.x, f[1] + a.y]); });
    (points || []).forEach((p) => pts.push([p.x, p.y]));
    const win = fitWindow(pts, minHalf || 2);
    const o = { w: win.w, h: win.h, x: win.x, y: win.y, equal: true, segs: [], points: [], param: [], labels: [] };
    arrows.forEach((a) => {
      const f = a.from || [0, 0];
      o.segs.push({ x1: f[0], y1: f[1], x2: f[0] + a.x, y2: f[1] + a.y, cls: a.cls, arrow: true, dash: !!a.dash, label: a.label });
    });
    // pos: 'auto' は窓の中での位置から、ラベルが図の外にはみ出さない向きを選ぶ
    (points || []).forEach((p) => {
      const q = Object.assign({}, p);
      if (p.pos === 'auto') {
        const fx = (p.x - win.x[0]) / (win.x[1] - win.x[0]), fy = (p.y - win.y[0]) / (win.y[1] - win.y[0]);
        q.pos = (fy > 0.62 ? 'b' : 't') + (fx > 0.55 ? 'l' : 'r');
      }
      o.points.push(q);
    });
    return o;
  }
  const posOf = (x, y) => (y >= 0 ? 't' : 'b') + (x >= 0 ? 'r' : 'l');
  const arcOf = (rr, t0, t1, cls) => ({ x: (t) => rr * Math.cos(t), y: (t) => rr * Math.sin(t), t: [t0, t1], cls: cls });

  // 2 次元・3 次元の入力欄
  const DIM_INPUT = { key: 'dim', label: '次元', type: 'select', def: '2', options: [['2', '2 次元（平面）'], ['3', '3 次元（空間）']] };
  const show3 = (r) => r.dim === '3';

  /* ================= 1. 成分計算（和・実数倍・大きさ） ================= */

  JK.registerCalc({
    id: 'iib-vec-basic',
    course: 'IIB',
    unit: 'm-vec',
    group: 'ベクトル',
    title: '成分計算（s a + t b と大きさ）',
    desc: R`2 つのベクトル $\vec{a},\ \vec{b}$ の成分から、$s\vec{a} + t\vec{b}$ の成分と、$|\vec{a}|,\ |\vec{b}|,\ |s\vec{a} + t\vec{b}|$ を求めます。2 次元は矢印の図つきです。`,
    form: [R`s\vec{a} + t\vec{b} = (sa_{1} + tb_{1},\ sa_{2} + tb_{2})`, R`|\vec{a}| = \sqrt{a_{1}^{2} + a_{2}^{2}}\quad (\text{空間では } + a_{3}^{2})`],
    inputs: [
      DIM_INPUT,
      { key: 'a1', label: R`$\vec{a}$ の第 1 成分 $a_{1}$`, type: 'q', def: '2' },
      { key: 'a2', label: R`$a_{2}$`, type: 'q', def: '1' },
      { key: 'a3', label: R`$a_{3}$`, type: 'q', def: '0', show: show3 },
      { key: 'b1', label: R`$\vec{b}$ の第 1 成分 $b_{1}$`, type: 'q', def: '-1' },
      { key: 'b2', label: R`$b_{2}$`, type: 'q', def: '3' },
      { key: 'b3', label: R`$b_{3}$`, type: 'q', def: '0', show: show3 },
      { key: 's', label: R`係数 $s$`, type: 'q', def: '2' },
      { key: 't', label: R`係数 $t$`, type: 'q', def: '-1' }
    ],
    examples: [
      { label: '2 次元（2a − b）', v: { dim: '2', a1: '2', a2: '1', b1: '-1', b2: '3', s: '2', t: '-1' } },
      { label: '分数の成分', v: { dim: '2', a1: '1/2', a2: '3', b1: '2', b2: '-1/3', s: '4', t: '3' } },
      { label: '3 次元', v: { dim: '3', a1: '1', a2: '2', a3: '-2', b1: '3', b2: '0', b3: '4', s: '1', t: '2' } },
      { label: '大きさが無理数', v: { dim: '2', a1: '3', a2: '3', b1: '1', b2: '-2', s: '1', t: '1' } },
      { label: '和が零ベクトル', v: { dim: '2', a1: '2', a2: '-3', b1: '4', b2: '-6', s: '2', t: '-1' } }
    ],
    intro: {
      easy: R`**ベクトル**は、「大きさ」と「向き」をもつ量で、矢印で表します。平面では、矢印の始点から終点までの「横にいくつ・縦にいくつ」進むかを $(x,\ y)$ と書いて**成分**といい、$\vec{a} = (a_{1},\ a_{2})$ と表します（空間では $(a_{1},\ a_{2},\ a_{3})$ の 3 つ）。
成分で表せば、計算は座標ごとに独立にできます。足し算 $\vec{a} + \vec{b}$ は成分どうしを足し、実数倍 $k\vec{a}$ は各成分を $k$ 倍します。矢印で言えば、足し算は「$\vec{a}$ のあとに $\vec{b}$ を続けて進む」こと、実数倍は「向きはそのままで長さを $k$ 倍（負なら逆向き）」にすることです。
ベクトルの**大きさ**（矢印の長さ）$|\vec{a}|$ は、三平方の定理から $\sqrt{a_{1}^{2} + a_{2}^{2}}$（空間では $\sqrt{a_{1}^{2} + a_{2}^{2} + a_{3}^{2}}$）で求まります。`,
      normal: R`$\vec{a} \pm \vec{b} = (a_{1} \pm b_{1},\ a_{2} \pm b_{2})$、$k\vec{a} = (ka_{1},\ ka_{2})$、$|\vec{a}| = \sqrt{a_{1}^{2}+a_{2}^{2}}$。$|\vec{a}|=1$ のベクトルが単位ベクトルで、$\vec{a}$ と同じ向きの単位ベクトルは $\frac{1}{|\vec{a}|}\vec{a}$。`,
      pro: R`大きさの計算は 2 乗のまま扱うと有理数で済みます（$|s\vec{a}+t\vec{b}|^{2} = s^{2}|\vec{a}|^{2} + 2st\,\vec{a}\cdot\vec{b} + t^{2}|\vec{b}|^{2}$）。「$|\vec{a}+t\vec{b}|$ の最小値」は 2 乗して $t$ の 2 次関数にするのが定石です。`
    },
    compute(v) {
      const dim = dimOf(v);
      const A = vecOf(v, 'a', dim), B = vecOf(v, 'b', dim), s = v.s, t = v.t;
      const sa = scV(A, s), tb = scV(B, t), sum = addV(sa, tb);
      const na = sqQ(A), nb = sqQ(B), ns = sqQ(sum), dp = dotQ(A, B);
      const steps = [];
      steps.push({
        t: 'ベクトルとは（成分表示）',
        m: [R`\vec{a} = (a_{1},\ a_{2})\ \Longleftrightarrow\ \text{横に } a_{1},\ \text{縦に } a_{2} \text{ 進む矢印}`, R`|\vec{a}| = \sqrt{a_{1}^{2} + a_{2}^{2}}\quad (\text{空間: } \sqrt{a_{1}^{2}+a_{2}^{2}+a_{3}^{2}})`],
        n: R`ベクトルは大きさと向きで決まり、始点の位置は問いません。成分は「始点から終点まで何進むか」を座標軸ごとに表した数です。`,
        easy: R`地図の「東へ 3 km、北へ 2 km」は $(3,\ 2)$ というベクトルです。どこからスタートしても、同じ移動を表します。足し算は「続けて移動する」こと、$2\vec{a}$ は「同じ向きに 2 倍進む」ことです。長さは、東と北の移動を 2 辺とする直角三角形の斜辺で、三平方の定理（$3^{2}+2^{2}=13$ から $\sqrt{13}$）で求めます。`,
        lv: 3
      });
      steps.push({
        t: '成分での計算規則',
        m: [R`\vec{a} + \vec{b} = (a_{1} + b_{1},\ a_{2} + b_{2}),\qquad k\vec{a} = (ka_{1},\ ka_{2})`, R`s\vec{a} + t\vec{b} = (sa_{1} + tb_{1},\ sa_{2} + tb_{2})`],
        n: R`成分ごとに足し算・かけ算をします（空間では第 3 成分も同じです）。`,
        easy: R`ベクトルの成分は、座標ごとにバラバラに計算できます。$x$ 成分は $x$ 成分どうし、$y$ 成分は $y$ 成分どうしで足したり、$k$ 倍したりします。引き算は、符号を逆にした足し算です。`,
        pro: R`$\vec{a} - \vec{b}$ は「$\vec{b}$ の終点から $\vec{a}$ の終点へ向かうベクトル」（終点 − 始点）として図形問題で多用されます。`
      });
      steps.push({
        t: R`$s\vec{a}$ と $t\vec{b}$ を求める`,
        m: [
          R`s\vec{a} = ` + parQ(s) + vTex(A) + R` = ` + vJoin(A.map((x) => parQ(s) + R` \cdot ` + parQ(x))) + ' = ' + vTex(sa),
          R`t\vec{b} = ` + parQ(t) + vTex(B) + R` = ` + vJoin(B.map((x) => parQ(t) + R` \cdot ` + parQ(x))) + ' = ' + vTex(tb)
        ],
        n: R`$\vec{a}$ の各成分に $s = ` + s.tex() + R`$ を、$\vec{b}$ の各成分に $t = ` + t.tex() + R`$ をかけます。`,
        easy: R`ベクトルの前の数は、すべての成分にかけ算します。たとえば $2(1,\ 3) = (2,\ 6)$。負の数をかけると向きが逆になります（成分の符号がすべて反転）。`
      });
      steps.push({
        t: R`$s\vec{a} + t\vec{b}$ を求める`,
        m: [R`s\vec{a} + t\vec{b} = ` + vTex(sa) + ' + ' + vTex(tb) + ' = ' + vTex(sum)],
        n: R`成分どうしを足します。` + (isZeroV(sum) ? R`結果は零ベクトルです。` : ''),
        easy: R`先ほどの $s\vec{a}$ と $t\vec{b}$ の成分を、$x$ 成分は $x$ 成分どうし、$y$ 成分は $y$ 成分どうしで足します。矢印の図では、$s\vec{a}$ の先から $t\vec{b}$ を続けて描いた終点が、和のベクトルの先になります。`,
        pro: R`$\vec{a},\ \vec{b}$ が平行でなければ、平面のどのベクトルも $s\vec{a}+t\vec{b}$ の形に一意に書けます（基底）。`
      });
      steps.push({
        t: '大きさを求める',
        m: [
          R`|\vec{a}| = \sqrt{` + sqLine(A) + '} = \\sqrt{' + na.tex() + '} = ' + lenTex(na),
          R`|\vec{b}| = \sqrt{` + sqLine(B) + '} = \\sqrt{' + nb.tex() + '} = ' + lenTex(nb),
          R`|s\vec{a} + t\vec{b}| = \sqrt{` + sqLine(sum) + '} = \\sqrt{' + ns.tex() + '} = ' + lenTex(ns)
        ],
        n: R`各成分を 2 乗して足し、平方根をとります。根号の中の平方数は外に出します（$\sqrt{12} = 2\sqrt{3}$）。`,
        easy: R`長さは三平方の定理です。成分を 2 乗して足した値の平方根が長さになります。負の成分も、2 乗すれば正になります。根号の中に平方数（4, 9, 16 など）が入っていたら、外に出して簡単にします。`,
        pro: R`ベクトルの大きさは、2 乗した値（有理数）を先に求めておくと、内積や角度の計算でそのまま使えます。`
      });
      const rhs = s.mul(s).mul(na).add(s.mul(t).mul(dp).mul(2)).add(t.mul(t).mul(nb));
      steps.push({
        t: '2 乗の展開で確かめる',
        m: [
          R`|s\vec{a} + t\vec{b}|^{2} = s^{2}|\vec{a}|^{2} + 2st\,\vec{a}\cdot\vec{b} + t^{2}|\vec{b}|^{2}`,
          R`= ` + parQ(s) + R`^{2} \cdot ` + na.tex() + ' + 2 \\cdot ' + parQ(s) + R` \cdot ` + parQ(t) + R` \cdot ` + parQ(dp) + ' + ' + parQ(t) + R`^{2} \cdot ` + nb.tex() + ' = ' + rhs.tex(),
          R`|s\vec{a} + t\vec{b}|^{2} = ` + ns.tex()
        ],
        n: R`成分から直接求めた $|s\vec{a}+t\vec{b}|^{2}$ と、内積を使った展開の値が一致します（$\vec{a}\cdot\vec{b} = ` + dp.tex() + R`$）。`,
        easy: R`$(s\vec{a}+t\vec{b})$ の長さの 2 乗は、「$(s+t)^{2} = s^{2}+2st+t^{2}$」と同じ形に展開できます。ここでは $\vec{a}\cdot\vec{b}$（内積）が「$ab$」の役を果たします。2 つの計算が一致するので、成分の足し算に間違いがないと分かります。`,
        lv: 2
      });
      let fig = null;
      if (dim === 2) {
        const arrows = [
          { x: A[0].val(), y: A[1].val(), cls: 'c1', label: 'a' },
          { x: B[0].val(), y: B[1].val(), cls: 'c2', label: 'b' },
          { x: sa[0].val(), y: sa[1].val(), cls: 'c1', dash: true, label: 's·a' },
          { x: tb[0].val(), y: tb[1].val(), cls: 'c2', dash: true, from: [sa[0].val(), sa[1].val()] },
          { x: sum[0].val(), y: sum[1].val(), cls: 'c3', label: 'sa+tb' }
        ].filter((a) => Math.abs(a.x) > 1e-12 || Math.abs(a.y) > 1e-12);
        const fo = vecOpts(arrows, [], 2);
        if (Math.abs(tb[0].val()) > 1e-12 || Math.abs(tb[1].val()) > 1e-12) {
          const span = fo.x[1] - fo.x[0];
          fo.labels.push({ x: sa[0].val() + tb[0].val() / 2 + 0.03 * span, y: sa[1].val() + tb[1].val() / 2, text: 't·b', cls: 'c2' });
        }
        fig = JK.plot.graph(fo);
      }
      return {
        result: [
          { label: 's a + t b', tex: R`s\vec{a} + t\vec{b} = ` + vTex(sum) },
          { label: '|a|', tex: R`|\vec{a}| = ` + lenTex(na) },
          { label: '|b|', tex: R`|\vec{b}| = ` + lenTex(nb) },
          { label: '|s a + t b|', tex: R`|s\vec{a} + t\vec{b}| = ` + lenTex(ns) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 2. 内積・なす角・垂直/平行 ================= */

  JK.registerCalc({
    id: 'iib-vec-dot',
    course: 'IIB',
    unit: 'm-vec',
    group: 'ベクトル',
    title: '内積・なす角・垂直と平行の判定',
    desc: R`2 つのベクトルの内積 $\vec{a}\cdot\vec{b}$ と、なす角 $\theta$（$\cos\theta = \frac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|}$）を求め、垂直・平行かどうかを判定します。2 次元・3 次元に対応します。`,
    form: [R`\vec{a}\cdot\vec{b} = a_{1}b_{1} + a_{2}b_{2}\ (+\,a_{3}b_{3}) = |\vec{a}||\vec{b}|\cos\theta`, R`\vec{a} \perp \vec{b} \Leftrightarrow \vec{a}\cdot\vec{b} = 0,\qquad \vec{a} \parallel \vec{b} \Leftrightarrow \vec{b} = k\vec{a}`],
    inputs: [
      DIM_INPUT,
      { key: 'a1', label: R`$\vec{a}$ の第 1 成分 $a_{1}$`, type: 'q', def: '1' },
      { key: 'a2', label: R`$a_{2}$`, type: 'q', def: '2' },
      { key: 'a3', label: R`$a_{3}$`, type: 'q', def: '0', show: show3 },
      { key: 'b1', label: R`$\vec{b}$ の第 1 成分 $b_{1}$`, type: 'q', def: '3' },
      { key: 'b2', label: R`$b_{2}$`, type: 'q', def: '1' },
      { key: 'b3', label: R`$b_{3}$`, type: 'q', def: '0', show: show3 }
    ],
    examples: [
      { label: '45°（2 次元）', v: { dim: '2', a1: '1', a2: '2', b1: '3', b2: '1' } },
      { label: '垂直', v: { dim: '2', a1: '2', a2: '3', b1: '-3', b2: '2' } },
      { label: '平行（同じ向き）', v: { dim: '2', a1: '1', a2: '-2', b1: '3', b2: '-6' } },
      { label: '平行（逆向き）', v: { dim: '2', a1: '2', a2: '4', b1: '-1', b2: '-2' } },
      { label: '60°（3 次元）', v: { dim: '3', a1: '1', a2: '1', a3: '0', b1: '1', b2: '0', b3: '1' } },
      { label: '角が特殊角でない', v: { dim: '2', a1: '3', a2: '1', b1: '1', b2: '2' } }
    ],
    intro: {
      easy: R`**内積**は、2 つのベクトルが「どれだけ同じ向きを向いているか」を 1 つの数で表すものです。定義は $\vec{a}\cdot\vec{b} = |\vec{a}||\vec{b}|\cos\theta$（$\theta$ は 2 つのベクトルのなす角）で、成分で計算すると**対応する成分どうしをかけて足す**だけになります（$a_{1}b_{1} + a_{2}b_{2}$）。
同じ向きなら大きな正の数、垂直なら $0$、逆向きなら負になります。そこで、**垂直条件 $\vec{a}\cdot\vec{b} = 0$** がよく使われます。また、なす角は $\cos\theta = \frac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|}$ から求められます。平行なら一方が他方の実数倍（$\vec{b} = k\vec{a}$）です。`,
      normal: R`$\vec{a}\cdot\vec{b} = a_{1}b_{1}+a_{2}b_{2}(+a_{3}b_{3})$、$\cos\theta = \frac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|}$（$0\degree \le \theta \le 180\degree$）。垂直は内積 $0$、平行は $\vec{b}=k\vec{a}$（成分の比が等しい）。`,
      pro: R`$\cos\theta$ の値から角を出すとき、$\theta$ は $0\degree$〜$180\degree$ の 1 つに決まります（$\sin$ と違い象限で迷わない）。$|\vec{a}-\vec{b}|^{2} = |\vec{a}|^{2} + |\vec{b}|^{2} - 2\vec{a}\cdot\vec{b}$ は余弦定理と同じ式で、三角形の問題に直結します。`
    },
    compute(v) {
      const dim = dimOf(v);
      const A = vecOf(v, 'a', dim), B = vecOf(v, 'b', dim);
      if (isZeroV(A) || isZeroV(B)) throw new JK.CalcError('零ベクトルは向きが決まらないので、なす角は定義されません。0 でないベクトルを入力してください');
      const dp = dotQ(A, B), na = sqQ(A), nb = sqQ(B);
      const D = dp.mul(dp).div(na.mul(nb));                       // cos²θ
      const cosV = dp.val() / Math.sqrt(na.val() * nb.val());
      const cosT = dp.isZero() ? '0' : (dp.sign() < 0 ? '-' : '') + U.sqrtTex(D);
      const thetaDeg = Math.acos(Math.max(-1, Math.min(1, cosV))) / D2R;
      const special = isMul15(thetaDeg);
      const thD = special ? Math.round(thetaDeg / 15) * 15 : thetaDeg;
      // 平行判定（外積 = 0）
      const cross = [];
      if (dim === 2) cross.push(A[0].mul(B[1]).sub(A[1].mul(B[0])));
      else { cross.push(A[1].mul(B[2]).sub(A[2].mul(B[1])), A[2].mul(B[0]).sub(A[0].mul(B[2])), A[0].mul(B[1]).sub(A[1].mul(B[0]))); }
      const parallel = isZeroV(cross), perp = dp.isZero();
      const relTex = perp ? R`\vec{a} \perp \vec{b}\ \text{（垂直）}` : (parallel ? R`\vec{a} \parallel \vec{b}\ \text{（平行・` + (dp.sign() > 0 ? '同じ向き' : '逆向き') + '）}' : R`\text{垂直でも平行でもない}`);
      const thTex = special ? degT(thD) : R`\approx ` + fm(thetaDeg, 2) + R`\degree`;
      const dAB = subV(A, B), nd = sqQ(dAB);
      const steps = [];
      steps.push({
        t: '内積とは',
        m: [R`\vec{a}\cdot\vec{b} = |\vec{a}||\vec{b}|\cos\theta\quad (0\degree \le \theta \le 180\degree)`, R`\vec{a} = (a_{1},\ a_{2}),\ \vec{b} = (b_{1},\ b_{2}) \;\Rightarrow\; \vec{a}\cdot\vec{b} = a_{1}b_{1} + a_{2}b_{2}`],
        n: R`2 つのベクトルの大きさと、なす角 $\theta$ の $\cos$ をかけたものが内積です。成分で書くと、対応する成分どうしのかけ算の和になります（空間では 3 項）。`,
        easy: R`$\vec{b}$ を $\vec{a}$ の方向に「影」として落とした長さ（$|\vec{b}|\cos\theta$）に、$|\vec{a}|$ をかけたもの、というイメージです。同じ向きなら正、垂直なら影が 0 になって内積も $0$、逆向きなら負です。成分で計算するときは、角度を知らなくても、成分をかけて足すだけで求められます。`,
        lv: 3
      });
      steps.push({
        t: '内積を計算する',
        m: [R`\vec{a}\cdot\vec{b} = ` + dotLine(A, B), R`\vec{a}\cdot\vec{b} = ` + dp.tex()],
        n: R`対応する成分どうしをかけて足します。内積の値は数（スカラー）で、ベクトルではありません。`,
        easy: R`$x$ 成分どうし、$y$ 成分どうし（空間なら $z$ 成分どうしも）をかけて、全部足します。たとえば $(1,\ 2)\cdot(3,\ 1) = 1 \times 3 + 2 \times 1 = 5$ です。負の成分は符号に注意します。`,
        pro: R`内積は交換法則 $\vec{a}\cdot\vec{b}=\vec{b}\cdot\vec{a}$ と分配法則 $\vec{a}\cdot(\vec{b}+\vec{c}) = \vec{a}\cdot\vec{b}+\vec{a}\cdot\vec{c}$ を満たします。`
      });
      steps.push({
        t: '大きさを求める',
        m: [R`|\vec{a}| = \sqrt{` + sqLine(A) + '} = ' + lenTex(na), R`|\vec{b}| = \sqrt{` + sqLine(B) + '} = ' + lenTex(nb), R`|\vec{a}||\vec{b}| = ` + lenPlain(na.mul(nb))],
        n: R`なす角の計算には、$|\vec{a}|$ と $|\vec{b}|$ が必要です。2 つをかけた $|\vec{a}||\vec{b}| = \sqrt{|\vec{a}|^{2}|\vec{b}|^{2}}$ は、2 乗の積に平方根をとってまとめると簡単です。`,
        easy: R`それぞれのベクトルの長さを、三平方の定理（成分の 2 乗の和の平方根）で求めます。2 つの長さを別々にかけるより、「2 乗した値どうしをかけてからルートをとる」ほうが、根号の整理が楽です。`
      });
      steps.push({
        t: R`$\cos\theta$ を求める`,
        m: [R`\cos\theta = \frac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|} = \frac{` + dp.tex() + '}{' + lenPlain(na.mul(nb)) + '} = ' + cosT + (/\\sqrt/.test(cosT) ? R` \approx ` + fm(cosV, 4) : '')],
        n: R`内積を大きさの積で割ります。分母に根号があれば有理化します（$\frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}$）。`,
        easy: R`内積の定義 $\vec{a}\cdot\vec{b} = |\vec{a}||\vec{b}|\cos\theta$ を、$\cos\theta$ について解いた式です。内積を、2 つの長さの積で割ります。$\cos\theta$ は必ず $-1$ から $1$ の間になるはずなので、範囲を外れたら計算ミスです。`,
        pro: R`$\cos\theta$ の値から角が特殊角なら即答できます（$\frac{\sqrt{2}}{2} \to 45\degree$、$\frac{1}{2} \to 60\degree$、$-\frac{\sqrt{3}}{2} \to 150\degree$ など）。`
      });
      steps.push({
        t: '角 θ を求める',
        m: [special ? R`\theta = ` + degT(thD) : R`\theta = \cos^{-1}(` + fm(cosV, 4) + R`) \approx ` + fm(thetaDeg, 2) + R`\degree`],
        n: special ? R`$\cos\theta = ` + cosT + R`$ となる $0\degree \le \theta \le 180\degree$ の角は $` + degT(thD) + R`$ です。` : R`特殊角ではないので、電卓の逆関数で近似値を求めます（約 $` + fm(thetaDeg, 2) + R`\degree$）。`,
        easy: R`$0\degree$ から $180\degree$ の範囲で、$\cos$ の値がその数になる角を探します。$\cos$ は $0\degree$ で $1$、$90\degree$ で $0$、$180\degree$ で $-1$ と単調に減るので、答えは 1 つに決まります。`,
        pro: R`なす角は 2 つのベクトルの始点をそろえたときの角です（$0\degree \le \theta \le 180\degree$）。鈍角になる（内積が負）ことに注意します。`
      });
      steps.push({
        t: '垂直・平行の判定',
        m: [R`\vec{a}\cdot\vec{b} = ` + dp.tex() + (perp ? R` = 0 \;\Rightarrow\; \vec{a} \perp \vec{b}` : R` \ne 0 \;\Rightarrow\; \text{垂直ではない}`), parallel ? R`\vec{b} = k\vec{a}\ \text{の形（成分の比が等しい）} \;\Rightarrow\; \vec{a} \parallel \vec{b}` : R`\text{成分の比が等しくない} \;\Rightarrow\; \text{平行ではない}`],
        n: R`内積が $0$ なら垂直、一方が他方の実数倍（成分の比がそろう）なら平行です。結果は $` + relTex + R`$ です。`,
        easy: R`垂直かどうかは「内積が $0$ か」だけで判定できます。平行かどうかは、2 つのベクトルの成分の比が等しいか（たとえば $(1,\ 2)$ と $(3,\ 6)$ は $1:2 = 3:6$）で判定します。比が負の数なら逆向きです。`,
        pro: R`平面では、$\vec{a}=(a_{1},a_{2})$ と $\vec{b}=(b_{1},b_{2})$ が平行 $\Leftrightarrow a_{1}b_{2} - a_{2}b_{1} = 0$（外積の成分）。垂直 $\Leftrightarrow a_{1}b_{1} + a_{2}b_{2} = 0$。`
      });
      steps.push({
        t: '余弦定理で確かめる',
        m: [R`|\vec{a} - \vec{b}|^{2} = |\vec{a}|^{2} + |\vec{b}|^{2} - 2\,\vec{a}\cdot\vec{b}`, R`\text{左辺: } |\vec{a} - \vec{b}|^{2} = ` + sqLine(dAB) + ' = ' + nd.tex(), R`\text{右辺: } ` + na.tex() + ' + ' + nb.tex() + ' - 2 \\cdot ' + parQ(dp) + ' = ' + na.add(nb).sub(dp.mul(2)).tex()],
        n: R`$\vec{a}-\vec{b}$ は 2 つのベクトルの終点を結ぶベクトルで、三角形の第 3 辺にあたります。成分から直接計算した値と、内積を使った値が一致します。`,
        easy: R`2 つのベクトルを 2 辺とする三角形を考えると、余弦定理 $c^{2} = a^{2} + b^{2} - 2ab\cos C$ そのものです。$ab\cos C$ が内積にあたります。成分から作った $\vec{a}-\vec{b}$ の長さの 2 乗と一致すれば、内積の計算が正しいと分かります。`,
        lv: 2
      });
      let fig = null;
      if (dim === 2) {
        const arrows = [{ x: A[0].val(), y: A[1].val(), cls: 'c1', label: 'a' }, { x: B[0].val(), y: B[1].val(), cls: 'c2', label: 'b' }];
        const o = vecOpts(arrows, [], 2);
        const fa = Math.atan2(A[1].val(), A[0].val()), fb = Math.atan2(B[1].val(), B[0].val());
        let dd = fb - fa;
        while (dd > PI) dd -= 2 * PI;
        while (dd <= -PI) dd += 2 * PI;
        const rr = 0.3 * Math.min(norm(A), norm(B));
        if (Math.abs(dd) > 1e-9) {
          o.param.push(arcOf(rr, fa, fa + dd, 'c3'));
          o.labels.push({ x: 1.45 * rr * Math.cos(fa + dd / 2), y: 1.45 * rr * Math.sin(fa + dd / 2), text: 'θ', cls: 'c3' });
        }
        fig = JK.plot.graph(o);
      }
      return {
        result: [
          { label: '内積 a·b', tex: R`\vec{a}\cdot\vec{b} = ` + dp.tex() },
          { label: '|a|, |b|', tex: R`|\vec{a}| = ` + lenTex(na) + R`,\ \ |\vec{b}| = ` + lenTex(nb) },
          { label: 'cos θ', tex: R`\cos\theta = ` + cosT + (/\\sqrt/.test(cosT) ? R` \approx ` + fm(cosV, 4) : '') },
          { label: 'なす角 θ', tex: R`\theta ` + (special ? '= ' + degT(thD) : thTex) },
          { label: '垂直・平行', tex: relTex }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 3. 3 点から三角形の面積 ================= */

  JK.registerCalc({
    id: 'iib-vec-triangle',
    course: 'IIB',
    unit: 'm-vec',
    group: 'ベクトル',
    title: '三角形の面積（ベクトルと内積）',
    desc: R`3 点 $A,\ B,\ C$ の座標から $\overrightarrow{AB},\ \overrightarrow{AC}$ をつくり、$S = \frac{1}{2}\sqrt{|\overrightarrow{AB}|^{2}|\overrightarrow{AC}|^{2} - (\overrightarrow{AB}\cdot\overrightarrow{AC})^{2}}$ で三角形の面積を求めます。2 次元・3 次元に対応します。`,
    form: [R`S = \frac{1}{2}\sqrt{|\overrightarrow{AB}|^{2}|\overrightarrow{AC}|^{2} - (\overrightarrow{AB}\cdot\overrightarrow{AC})^{2}}`, R`\text{平面では } S = \frac{1}{2}|x_{1}y_{2} - x_{2}y_{1}|\quad (\overrightarrow{AB} = (x_{1},y_{1}),\ \overrightarrow{AC} = (x_{2},y_{2}))`],
    inputs: [
      DIM_INPUT,
      { key: 'p1', label: R`$A$ の $x$ 座標`, type: 'q', def: '1' },
      { key: 'p2', label: R`$A$ の $y$ 座標`, type: 'q', def: '1' },
      { key: 'p3', label: R`$A$ の $z$ 座標`, type: 'q', def: '0', show: show3 },
      { key: 'q1', label: R`$B$ の $x$ 座標`, type: 'q', def: '5' },
      { key: 'q2', label: R`$B$ の $y$ 座標`, type: 'q', def: '2' },
      { key: 'q3', label: R`$B$ の $z$ 座標`, type: 'q', def: '0', show: show3 },
      { key: 'r1', label: R`$C$ の $x$ 座標`, type: 'q', def: '2' },
      { key: 'r2', label: R`$C$ の $y$ 座標`, type: 'q', def: '5' },
      { key: 'r3', label: R`$C$ の $z$ 座標`, type: 'q', def: '0', show: show3 }
    ],
    examples: [
      { label: '平面の三角形', v: { dim: '2', p1: '1', p2: '1', q1: '5', q2: '2', r1: '2', r2: '5' } },
      { label: '直角三角形', v: { dim: '2', p1: '0', p2: '0', q1: '4', q2: '0', r1: '0', r2: '3' } },
      { label: '空間の三角形', v: { dim: '3', p1: '1', p2: '0', p3: '0', q1: '0', q2: '2', q3: '0', r1: '0', r2: '0', r3: '3' } },
      { label: '面積が無理数（空間）', v: { dim: '3', p1: '0', p2: '0', p3: '0', q1: '1', q2: '1', q3: '0', r1: '0', r2: '1', r3: '1' } },
      { label: '分数の座標', v: { dim: '2', p1: '1/2', p2: '0', q1: '3', q2: '1/2', r1: '-1', r2: '2' } }
    ],
    intro: {
      easy: R`三角形 $ABC$ の面積は「底辺 × 高さ ÷ 2」ですが、座標しか分かっていないときは、**ベクトル**を使うと求めやすくなります。頂点 $A$ から $B$ へのベクトル $\overrightarrow{AB}$ と、$A$ から $C$ へのベクトル $\overrightarrow{AC}$ を作り、その**長さ**と**内積**だけから面積が出ます。
三角形の面積は $S = \frac{1}{2}|\overrightarrow{AB}||\overrightarrow{AC}|\sin\theta$（$\theta$ は $A$ での角）です。$\sin\theta = \sqrt{1 - \cos^{2}\theta}$ に内積の式 $\cos\theta = \frac{\overrightarrow{AB}\cdot\overrightarrow{AC}}{|\overrightarrow{AB}||\overrightarrow{AC}|}$ を入れて整理すると、成分だけで計算できる公式 $S = \frac{1}{2}\sqrt{|\overrightarrow{AB}|^{2}|\overrightarrow{AC}|^{2} - (\overrightarrow{AB}\cdot\overrightarrow{AC})^{2}}$ になります。空間の三角形でも使える便利な式です。`,
      normal: R`$S = \frac{1}{2}\sqrt{|\overrightarrow{AB}|^{2}|\overrightarrow{AC}|^{2} - (\overrightarrow{AB}\cdot\overrightarrow{AC})^{2}}$。平面で $\overrightarrow{AB}=(x_{1},y_{1})$、$\overrightarrow{AC}=(x_{2},y_{2})$ なら $S = \frac{1}{2}|x_{1}y_{2} - x_{2}y_{1}|$。`,
      pro: R`平面では $\frac{1}{2}|x_{1}y_{2}-x_{2}y_{1}|$ が圧倒的に速いです（根号が出ません）。空間では上の内積の公式（または外積の大きさ）を使います。面積が $0$ になるのは 3 点が一直線上にあるときです。`
    },
    compute(v) {
      const dim = dimOf(v);
      const A = vecOf(v, 'p', dim), B = vecOf(v, 'q', dim), C = vecOf(v, 'r', dim);
      const AB = subV(B, A), AC = subV(C, A), BC = subV(C, B);
      const n1 = sqQ(AB), n2 = sqQ(AC), n3 = sqQ(BC), dp = dotQ(AB, AC);
      const M = n1.mul(n2).sub(dp.mul(dp));
      if (M.sign() <= 0) throw new JK.CalcError('3 点が一直線上にあるため、三角形になりません（面積が 0 です）');
      const S2 = M.div(4);
      const Stex = U.sqrtTex(S2);
      const Sv = Math.sqrt(S2.val());
      const heron = n1.mul(n2).add(n2.mul(n3)).add(n3.mul(n1)).mul(2).sub(n1.mul(n1).add(n2.mul(n2)).add(n3.mul(n3))).div(16);
      const steps = [];
      steps.push({
        t: 'ベクトルで面積を表す',
        m: [R`S = \frac{1}{2}|\overrightarrow{AB}||\overrightarrow{AC}|\sin\theta`, R`\sin\theta = \sqrt{1 - \cos^{2}\theta},\quad \cos\theta = \frac{\overrightarrow{AB}\cdot\overrightarrow{AC}}{|\overrightarrow{AB}||\overrightarrow{AC}|}`, R`S = \frac{1}{2}\sqrt{|\overrightarrow{AB}|^{2}|\overrightarrow{AC}|^{2} - (\overrightarrow{AB}\cdot\overrightarrow{AC})^{2}}`],
        n: R`三角形の 2 辺とそのはさむ角から面積を求める公式 $S = \frac{1}{2}ab\sin C$ に、$\sin\theta = \sqrt{1-\cos^{2}\theta}$ と内積の式を代入して、$\theta$ を消します。`,
        easy: R`面積の公式「$\frac{1}{2} \times$ 辺 $\times$ 辺 $\times \sin$（はさむ角）」を使います。角 $\theta$ は座標から直接は分かりませんが、内積から $\cos\theta$ が分かり、$\sin\theta = \sqrt{1 - \cos^{2}\theta}$ で $\sin\theta$ に直せます。整理すると、角度を使わず成分だけで面積が出る公式になります（根号の中は「長さの 2 乗の積 − 内積の 2 乗」）。`,
        lv: 3
      });
      steps.push({
        t: R`$\overrightarrow{AB}$ と $\overrightarrow{AC}$`,
        m: [R`\overrightarrow{AB} = B - A = ` + vTex(B) + ' - ' + vTex(A) + ' = ' + vTex(AB), R`\overrightarrow{AC} = C - A = ` + vTex(C) + ' - ' + vTex(A) + ' = ' + vTex(AC)],
        n: R`ベクトルは「終点の座標 − 始点の座標」です。$A$ を始点にそろえます。`,
        easy: R`点 $A$ から点 $B$ まで「横にいくつ、縦にいくつ」進むかが $\overrightarrow{AB}$ です。座標の引き算（終点 $B$ − 始点 $A$）で求めます。同じように $A$ から $C$ へのベクトルも作ります。`,
        pro: R`始点は $A$ に限らず、座標が簡単になる頂点を選んで構いません（面積は同じ）。`
      });
      steps.push({
        t: '長さの 2 乗と内積',
        m: [
          R`|\overrightarrow{AB}|^{2} = ` + sqLine(AB) + ' = ' + n1.tex(),
          R`|\overrightarrow{AC}|^{2} = ` + sqLine(AC) + ' = ' + n2.tex(),
          R`\overrightarrow{AB}\cdot\overrightarrow{AC} = ` + dotLine(AB, AC) + ' = ' + dp.tex()
        ],
        n: R`長さは 2 乗のまま（有理数）計算しておくと、あとの式がそのまま使えます。`,
        easy: R`面積の公式に必要な 3 つの数 $|\overrightarrow{AB}|^{2}$、$|\overrightarrow{AC}|^{2}$、$\overrightarrow{AB}\cdot\overrightarrow{AC}$ を先に求めます。長さは「成分の 2 乗の和」までで止めて、ルートをとらないのがコツです。`
      });
      steps.push({
        t: '面積の公式に代入する',
        m: [R`S = \frac{1}{2}\sqrt{` + n1.tex() + R` \cdot ` + n2.tex() + ' - ' + parQ(dp) + R`^{2}}`, R`S = \frac{1}{2}\sqrt{` + n1.mul(n2).tex() + ' - ' + dp.mul(dp).tex() + '} = \\frac{1}{2}\\sqrt{' + M.tex() + '} = ' + Stex + (/\\sqrt/.test(Stex) ? R` \approx ` + fm(Sv, 4) : '')],
        n: R`根号の中は $` + M.tex() + R`$（正）で、3 点は一直線上にありません。` + (/\\sqrt/.test(Stex) ? '' : R`平方数なので、面積は有理数です。`),
        easy: R`求めた 3 つの数を公式に入れて計算します。根号の中が $0$ になったら 3 点は一直線上（三角形にならない）、負になることはありません。根号の中の平方数は外に出します（$\frac{1}{2}\sqrt{36} = 3$ のように）。`,
        pro: R`$\sqrt{M}$ の外に出す数 $\times\ \frac{1}{2}$ を忘れずに。分数係数が出る問題は、$S^{2} = \frac{M}{4}$ のまま 2 乗で扱うと楽です。`
      });
      if (dim === 2) {
        const cr = AB[0].mul(AC[1]).sub(AB[1].mul(AC[0]));
        steps.push({
          t: '平面の公式 ½|x₁y₂ − x₂y₁| で確かめる',
          m: [R`S = \frac{1}{2}|x_{1}y_{2} - x_{2}y_{1}| = \frac{1}{2}\left|` + parQ(AB[0]) + R` \cdot ` + parQ(AC[1]) + ' - ' + parQ(AB[1]) + R` \cdot ` + parQ(AC[0]) + R`\right| = \frac{1}{2}|` + cr.tex() + '| = ' + cr.abs().div(2).tex()],
          n: R`平面では、$\overrightarrow{AB}=(x_{1},y_{1})$、$\overrightarrow{AC}=(x_{2},y_{2})$ のとき $S = \frac{1}{2}|x_{1}y_{2} - x_{2}y_{1}|$ です（上の公式と同じ値になります）。`,
          easy: R`平面の三角形だけは、もっと簡単な公式があります。ベクトルの成分をたすき掛けにして引き算し、絶対値をとって 2 で割ります。さっきの公式と同じ答えになることで、計算が正しいと確かめられます（上の根号の中は、実は $(x_{1}y_{2}-x_{2}y_{1})^{2}$ に等しいからです）。`,
          pro: R`座標が与えられた平面の三角形の面積は、ほぼこの公式で終わります。`
        });
      }
      steps.push({
        t: 'ヘロンの公式（2 乗の形）で確かめる',
        m: [R`16S^{2} = 2(a^{2}b^{2} + b^{2}c^{2} + c^{2}a^{2}) - (a^{4} + b^{4} + c^{4})`, R`a^{2} = |\overrightarrow{BC}|^{2} = ` + n3.tex() + R`,\ b^{2} = ` + n2.tex() + R`,\ c^{2} = ` + n1.tex(), R`S^{2} = ` + heron.tex() + R` = ` + S2.tex()],
        n: R`3 辺の長さの 2 乗だけから面積の 2 乗を求める形のヘロンの公式でも、同じ値になります。`,
        easy: R`「3 つの辺の長さが分かれば面積が決まる」というヘロンの公式を、辺の 2 乗だけで書き直した式で確かめます。ベクトルの公式とは別の道なのに答えが一致するので、計算に間違いがないと言えます。`,
        lv: 2
      });
      let fig = null;
      if (dim === 2) {
        const pts = [A, B, C].map((p) => [p[0].val(), p[1].val()]);
        const o = vecOpts([], [
          { x: pts[0][0], y: pts[0][1], label: 'A' + vstr(A), cls: 'c1', pos: 'auto' },
          { x: pts[1][0], y: pts[1][1], label: 'B' + vstr(B), cls: 'c2', pos: 'auto' },
          { x: pts[2][0], y: pts[2][1], label: 'C' + vstr(C), cls: 'c3', pos: 'auto' }
        ], 2);
        o.segs.push({ x1: pts[0][0], y1: pts[0][1], x2: pts[1][0], y2: pts[1][1], cls: 'c1' }, { x1: pts[1][0], y1: pts[1][1], x2: pts[2][0], y2: pts[2][1], cls: 'c2' }, { x1: pts[2][0], y1: pts[2][1], x2: pts[0][0], y2: pts[0][1], cls: 'c3' });
        fig = JK.plot.graph(o);
      }
      return {
        result: [
          { label: 'AB', tex: R`\overrightarrow{AB} = ` + vTex(AB) },
          { label: 'AC', tex: R`\overrightarrow{AC} = ` + vTex(AC) },
          { label: '内積 AB·AC', tex: R`\overrightarrow{AB}\cdot\overrightarrow{AC} = ` + dp.tex() },
          { label: '面積 S', tex: 'S = ' + Stex + (/\\sqrt/.test(Stex) ? R` \approx ` + fm(Sv, 4) : '') }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 4. 内分点・外分点・重心 ================= */

  JK.registerCalc({
    id: 'iib-vec-internal',
    course: 'IIB',
    unit: 'm-vec',
    group: 'ベクトル',
    title: '内分点・外分点・重心',
    desc: R`2 点 $A,\ B$ を $m:n$ に内分する点・外分する点、3 点 $A,\ B,\ C$ の重心を、位置ベクトルの公式で求めます。2 次元・3 次元に対応します。`,
    form: [R`\vec{p} = \frac{n\vec{a} + m\vec{b}}{m + n}\ (\text{内分}),\qquad \vec{q} = \frac{-n\vec{a} + m\vec{b}}{m - n}\ (\text{外分})`, R`\vec{g} = \frac{\vec{a} + \vec{b} + \vec{c}}{3}\ (\text{重心})`],
    inputs: [
      DIM_INPUT,
      { key: 'mode', label: '求めるもの', type: 'select', def: 'in', options: [['in', '内分点（m : n）'], ['out', '外分点（m : n）'], ['g', '三角形の重心']] },
      { key: 'p1', label: R`$A$ の $x$ 座標`, type: 'q', def: '1' },
      { key: 'p2', label: R`$A$ の $y$ 座標`, type: 'q', def: '2' },
      { key: 'p3', label: R`$A$ の $z$ 座標`, type: 'q', def: '0', show: show3 },
      { key: 'q1', label: R`$B$ の $x$ 座標`, type: 'q', def: '7' },
      { key: 'q2', label: R`$B$ の $y$ 座標`, type: 'q', def: '5' },
      { key: 'q3', label: R`$B$ の $z$ 座標`, type: 'q', def: '0', show: show3 },
      { key: 'r1', label: R`$C$ の $x$ 座標`, type: 'q', def: '4', show: (r) => r.mode === 'g' },
      { key: 'r2', label: R`$C$ の $y$ 座標`, type: 'q', def: '-1', show: (r) => r.mode === 'g' },
      { key: 'r3', label: R`$C$ の $z$ 座標`, type: 'q', def: '0', show: (r) => r.mode === 'g' && r.dim === '3' },
      { key: 'm', label: R`比 $m$`, type: 'q', def: '2', show: (r) => r.mode !== 'g', hint: R`$m : n$ は正の数（整数でなくてもよい）` },
      { key: 'n', label: R`比 $n$`, type: 'q', def: '1', show: (r) => r.mode !== 'g' }
    ],
    examples: [
      { label: '内分点 2:1', v: { dim: '2', mode: 'in', p1: '1', p2: '2', q1: '7', q2: '5', m: '2', n: '1' } },
      { label: '外分点 3:1', v: { dim: '2', mode: 'out', p1: '1', p2: '2', q1: '7', q2: '5', m: '3', n: '1' } },
      { label: '外分点 1:3（A 側）', v: { dim: '2', mode: 'out', p1: '0', p2: '0', q1: '4', q2: '2', m: '1', n: '3' } },
      { label: '三角形の重心', v: { dim: '2', mode: 'g', p1: '1', p2: '2', q1: '7', q2: '5', r1: '4', r2: '-1' } },
      { label: '3 次元の内分点', v: { dim: '3', mode: 'in', p1: '1', p2: '0', p3: '2', q1: '4', q2: '6', q3: '-1', m: '1', n: '2' } },
      { label: '3 次元の重心', v: { dim: '3', mode: 'g', p1: '1', p2: '0', p3: '2', q1: '4', q2: '6', q3: '-1', r1: '-2', r2: '3', r3: '5' } }
    ],
    intro: {
      easy: R`ベクトルで点の位置を表すとき、原点 $O$ から点 $A$ へのベクトル $\vec{a} = \overrightarrow{OA}$ を、点 $A$ の**位置ベクトル**といいます（成分は $A$ の座標そのものです）。
線分 $AB$ を $m : n$ に分ける点は、位置ベクトルの式で書けます。**内分点**（線分の中で分ける点）$P$ は $\vec{p} = \frac{n\vec{a} + m\vec{b}}{m + n}$。意味は「$A$ から $B$ へ向かって、全体の $\frac{m}{m+n}$ だけ進んだ点」です。**外分点**（線分の延長上で分ける点）は $n$ を $-n$ に置き換えた $\vec{q} = \frac{-n\vec{a} + m\vec{b}}{m - n}$ です。三角形の**重心**（3 本の中線の交点）は 3 頂点の位置ベクトルの平均 $\frac{\vec{a}+\vec{b}+\vec{c}}{3}$ です。`,
      normal: R`内分点 $\vec{p} = \frac{n\vec{a}+m\vec{b}}{m+n}$、外分点 $\vec{q} = \frac{-n\vec{a}+m\vec{b}}{m-n}$（$m \ne n$）、重心 $\vec{g} = \frac{\vec{a}+\vec{b}+\vec{c}}{3}$。$\overrightarrow{AP} = \frac{m}{m+n}\overrightarrow{AB}$ と書くと意味が分かりやすくなります。`,
      pro: R`内分点は $\overrightarrow{AP} = \frac{m}{m+n}\overrightarrow{AB}$ と「$A$ から $\overrightarrow{AB}$ の何倍進むか」で立式すると、外分（倍率が $1$ を超える・負になる）にもそのまま使えます。重心は中線を $2:1$ に内分する点でもあります。座標と同じ公式なので、成分ごとに平均・加重平均を計算するだけです。`
    },
    compute(v) {
      const dim = dimOf(v), mode = String(v.mode);
      const A = vecOf(v, 'p', dim), B = vecOf(v, 'q', dim);
      const nm = AXN.slice(0, dim);
      const steps = [];
      steps.push({
        t: '位置ベクトルとは',
        m: [R`\vec{a} = \overrightarrow{OA} = ` + vTex(A) + R`,\quad \vec{b} = \overrightarrow{OB} = ` + vTex(B)],
        n: R`原点 $O$ を始点としたベクトル $\overrightarrow{OA}$ を、点 $A$ の位置ベクトルといいます。成分は点の座標と一致します。`,
        easy: R`ベクトルの始点を原点に決めておけば、「点」と「ベクトル」が 1 対 1 に対応します。点 $A(1,\ 2)$ の位置ベクトルは $\vec{a} = (1,\ 2)$。これを使うと、点の位置を成分の式で計算できます。`,
        lv: 3
      });
      if (mode === 'g') {
        const C = vecOf(v, 'r', dim);
        const G = A.map((x, i) => x.add(B[i]).add(C[i]).div(3));
        const GA = subV(A, G), GB = subV(B, G), GC = subV(C, G);
        steps.push({
          t: '重心の公式',
          m: [R`\vec{g} = \frac{\vec{a} + \vec{b} + \vec{c}}{3}`],
          n: R`三角形 $ABC$ の重心 $G$ の位置ベクトルは、3 頂点の位置ベクトルの平均です。`,
          easy: R`重心は、三角形を紙で切り抜いて 1 点で支えたときにつり合う点です。3 つの頂点の「平均の位置」になるので、各座標を 3 つ足して 3 で割ります。2 つの点なら中点、3 つの点なら重心です。`,
          pro: R`重心は各中線を頂点から $2:1$ に内分する点です。`
        });
        steps.push({
          t: '成分ごとに計算する',
          m: nm.map((nmk, i) => nmk + R`\text{ 座標} = \frac{` + A[i].tex() + ' + ' + parQ(B[i]) + ' + ' + parQ(C[i]) + R`}{3} = ` + G[i].tex()).concat([R`G = ` + vTex(G)]),
          n: R`各座標について、3 点の値を足して 3 で割ります。`,
          easy: R`$x$ 座標どうし、$y$ 座標どうし（空間なら $z$ 座標どうしも）で、足し算して $3$ で割るだけです。座標ごとに別々に計算します。`
        });
        steps.push({
          t: '確かめ: 重心から各頂点へのベクトルの和は零ベクトル',
          m: [R`\overrightarrow{GA} + \overrightarrow{GB} + \overrightarrow{GC} = ` + vTex(GA) + ' + ' + vTex(GB) + ' + ' + vTex(GC) + ' = ' + vTex(addV(addV(GA, GB), GC))],
          n: R`重心の特徴は $\overrightarrow{GA} + \overrightarrow{GB} + \overrightarrow{GC} = \vec{0}$ です。実際に成分を足すと $\vec{0}$ になります。`,
          easy: R`重心は 3 点の「ちょうど真ん中」なので、そこから各頂点へ向かう 3 本の矢印をつなげると、元の場所に戻ります（和が零ベクトル）。成分を足して $0$ になれば、重心の計算が正しいです。`,
          lv: 2
        });
        let fig = null;
        if (dim === 2) {
          const pts = [A, B, C].map((p) => [p[0].val(), p[1].val()]);
          const o = vecOpts([], [
            { x: pts[0][0], y: pts[0][1], label: 'A', cls: 'c1', pos: 'auto' }, { x: pts[1][0], y: pts[1][1], label: 'B', cls: 'c2', pos: 'auto' },
            { x: pts[2][0], y: pts[2][1], label: 'C', cls: 'c4', pos: 'auto' }, { x: G[0].val(), y: G[1].val(), label: 'G' + vstr(G), cls: 'c3', pos: 'auto' }
          ], 2);
          o.segs.push({ x1: pts[0][0], y1: pts[0][1], x2: pts[1][0], y2: pts[1][1], cls: 'c1' }, { x1: pts[1][0], y1: pts[1][1], x2: pts[2][0], y2: pts[2][1], cls: 'c2' }, { x1: pts[2][0], y1: pts[2][1], x2: pts[0][0], y2: pts[0][1], cls: 'c4' });
          [[0, 1, 2], [1, 2, 0], [2, 0, 1]].forEach((t) => {
            const mx = (pts[t[1]][0] + pts[t[2]][0]) / 2, my = (pts[t[1]][1] + pts[t[2]][1]) / 2;
            o.segs.push({ x1: pts[t[0]][0], y1: pts[t[0]][1], x2: mx, y2: my, cls: 'dim', dash: true });
          });
          fig = JK.plot.graph(o);
        }
        return {
          result: [
            { label: '重心 G', tex: 'G' + vTex(G) },
            { label: '位置ベクトル g', tex: R`\vec{g} = ` + vTex(G) },
            { label: 'GA + GB + GC', tex: R`\overrightarrow{GA} + \overrightarrow{GB} + \overrightarrow{GC} = ` + vTex(addV(addV(GA, GB), GC)) }
          ],
          steps: steps,
          fig: fig
        };
      }
      const m = v.m, n = v.n;
      if (m.sign() <= 0 || n.sign() <= 0) throw new JK.CalcError('m, n は正の数にしてください（比 m : n）');
      const inn = mode === 'in';
      if (!inn && m.eq(n)) throw new JK.CalcError('m = n のとき外分点は存在しません（延長線上に比が 1 : 1 となる点がありません）');
      const den = inn ? m.add(n) : m.sub(n);
      const P0 = A.map((x, i) => (inn ? n.mul(x).add(m.mul(B[i])) : m.mul(B[i]).sub(n.mul(x))).div(den));
      const AB = subV(B, A), AP = subV(P0, A), PB = subV(B, P0);
      const nl = (q) => U.sqrtTex(q);
      steps.push({
        t: inn ? '内分点の公式' : '外分点の公式',
        m: inn
          ? [R`\overrightarrow{AP} = \frac{m}{m+n}\overrightarrow{AB}`, R`\vec{p} = \vec{a} + \frac{m}{m+n}(\vec{b} - \vec{a}) = \frac{n\vec{a} + m\vec{b}}{m + n}`]
          : [R`\overrightarrow{AQ} = \frac{m}{m-n}\overrightarrow{AB}`, R`\vec{q} = \vec{a} + \frac{m}{m-n}(\vec{b} - \vec{a}) = \frac{-n\vec{a} + m\vec{b}}{m - n}`],
        n: inn ? R`$A$ から $B$ へ向かって $\frac{m}{m+n}$ だけ進んだ点が内分点 $P$ です。式を整理すると「たすき掛け」の形になります。` : R`外分点は、$A$ から $B$ へ $\frac{m}{m-n}$ 倍進んだ点です（$m>n$ なら $B$ の先、$m<n$ なら $A$ の手前）。内分点の公式の $n$ を $-n$ に置き換えた形です。`,
        easy: inn
          ? R`線分 $AB$ を $m+n$ 個に等分したとき、$A$ から $m$ 個ぶん進んだ点が内分点 $P$ です。$A$ からの道のりは全体の $\frac{m}{m+n}$。そこで $\overrightarrow{AP} = \frac{m}{m+n}\overrightarrow{AB}$ と書け、$\vec{p} = \vec{a} + \overrightarrow{AP}$ を整理すると、$n$ が $\vec{a}$ に、$m$ が $\vec{b}$ にかかる公式になります。`
          : R`外分点は、線分 $AB$ の延長線上で、$A$ からの距離と $B$ からの距離の比が $m:n$ になる点です。$\overrightarrow{AQ} = \frac{m}{m-n}\overrightarrow{AB}$（比が $1$ より大きいので、$B$ を通り越します）。内分の式で $n$ を $-n$ にしたものと同じ形になります。`,
        pro: R`外分は「$m : (-n)$ の内分」と見て、内分点の公式の $n \to -n$。$m = n$ のときは存在しません。`
      });
      steps.push({
        t: '成分ごとに代入する',
        m: nm.map((nmk, i) => nmk + R`\text{ 座標} = \frac{` + (inn ? parQ(n) + R` \cdot ` + parQ(A[i]) + ' + ' + parQ(m) + R` \cdot ` + parQ(B[i]) : '-' + parQ(n) + R` \cdot ` + parQ(A[i]) + ' + ' + parQ(m) + R` \cdot ` + parQ(B[i])) + '}{' + den.tex() + '} = ' + P0[i].tex()).concat([(inn ? 'P' : 'Q') + vTex(P0)]),
        n: R`$\vec{a},\ \vec{b}$ の各成分（座標）に $m, n$ を使った加重平均を計算します。分母は $` + (inn ? 'm+n' : 'm-n') + ' = ' + den.tex() + R`$ です。`,
        easy: R`座標ごとに別々に計算します。$A$ の座標には $n$、$B$ の座標には $m$ をかけて足し、全体を $` + (inn ? 'm+n' : 'm-n') + R`$ で割ります。比と座標がたすき掛けになっているのが特徴で、近いほうの点の座標のほうに比の大きい値がかかります（内分のとき）。`,
        pro: R`成分計算では、「$A$ の座標 $+$ 比 $\times$（$B$ の座標 $-$ $A$ の座標）」の形 $\left(x_{A} + \frac{m}{m \pm n}(x_{B}-x_{A})\right)$ にすると暗算しやすいです。`
      });
      const lenAP = sqQ(AP), lenPB = sqQ(PB);
      steps.push({
        t: '確かめ: ' + (inn ? 'AP : PB' : 'AQ : QB') + R` = m : n`,
        m: [
          (inn ? R`\overrightarrow{AP}` : R`\overrightarrow{AQ}`) + ' = ' + vTex(AP) + R`,\quad ` + (inn ? R`\overrightarrow{PB}` : R`\overrightarrow{QB}`) + ' = ' + vTex(PB),
          (inn ? 'AP' : 'AQ') + ' = ' + nl(lenAP) + R`,\quad ` + (inn ? 'PB' : 'QB') + ' = ' + nl(lenPB),
          (inn ? 'AP : PB' : 'AQ : QB') + ' = ' + nl(lenAP) + ' : ' + nl(lenPB) + ' = ' + m.tex() + ' : ' + n.tex()
        ],
        n: R`求めた点から $A$、$B$ までの長さの比が、与えられた比 $m : n$ に一致します。` + (inn ? R`内分点では $\overrightarrow{AP}$ と $\overrightarrow{PB}$ は同じ向きです。` : R`外分点では $\overrightarrow{AQ}$ と $\overrightarrow{QB}$ は逆向きです。`),
        easy: R`点 $A$ からの長さと、点 $B$ までの長さを計算して、比が $m : n$ になっているか確かめます。ベクトルの成分から長さを求めるには、成分の 2 乗の和の平方根をとります。比が合えば、計算に間違いがありません。` + (inn ? '' : R`外分では、2 つのベクトルが逆向きになることも確かめられます。`),
        lv: 2
      });
      let fig = null;
      if (dim === 2) {
        const o = vecOpts([], [
          { x: A[0].val(), y: A[1].val(), label: 'A' + vstr(A), cls: 'c1', pos: 'auto' },
          { x: B[0].val(), y: B[1].val(), label: 'B' + vstr(B), cls: 'c2', pos: 'auto' },
          { x: P0[0].val(), y: P0[1].val(), label: (inn ? 'P' : 'Q') + vstr(P0), cls: 'c3', pos: 'auto' }
        ], 2);
        o.segs.push({ x1: A[0].val(), y1: A[1].val(), x2: B[0].val(), y2: B[1].val(), cls: 'c1' });
        if (!inn) {
          const far = m.cmp(n) > 0;
          const f = far ? B : A, e = P0;
          o.segs.push({ x1: f[0].val(), y1: f[1].val(), x2: e[0].val(), y2: e[1].val(), cls: 'c3', dash: true });
        }
        fig = JK.plot.graph(o);
      }
      return {
        result: [
          { label: inn ? '内分点 P' : '外分点 Q', tex: (inn ? 'P' : 'Q') + vTex(P0) },
          { label: '位置ベクトル', tex: (inn ? R`\vec{p}` : R`\vec{q}`) + ' = ' + vTex(P0) },
          { label: '比の確認', tex: (inn ? 'AP : PB' : 'AQ : QB') + ' = ' + nl(lenAP) + ' : ' + nl(lenPB) + ' = ' + m.tex() + ' : ' + n.tex() }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 5. 垂直・平行になる x ================= */

  JK.registerCalc({
    id: 'iib-vec-perp',
    course: 'IIB',
    unit: 'm-vec',
    group: 'ベクトル',
    title: '垂直・平行になる x',
    desc: R`$\vec{a}$ と、1 つの成分が未知数 $x$ の $\vec{b}$ について、$\vec{a}\perp\vec{b}$（内積 $=0$）、$\vec{a}\parallel\vec{b}$（$\vec{b} = k\vec{a}$）となる $x$ を求めます。2 次元・3 次元に対応します。`,
    form: [R`\vec{a} \perp \vec{b} \Leftrightarrow \vec{a}\cdot\vec{b} = 0`, R`\vec{a} \parallel \vec{b} \Leftrightarrow \vec{b} = k\vec{a}\ (k \text{ は実数})`],
    inputs: [
      DIM_INPUT,
      { key: 'pos', label: R`$x$ を入れる $\vec{b}$ の成分`, type: 'select', def: '1', options: [['1', '第 1 成分が x'], ['2', '第 2 成分が x'], ['3', '第 3 成分が x（3 次元のみ）']] },
      { key: 'a1', label: R`$\vec{a}$ の第 1 成分 $a_{1}$`, type: 'q', def: '1' },
      { key: 'a2', label: R`$a_{2}$`, type: 'q', def: '2' },
      { key: 'a3', label: R`$a_{3}$`, type: 'q', def: '1', show: show3 },
      { key: 'b1', label: R`$\vec{b}$ の第 1 成分 $b_{1}$`, type: 'q', def: '1', show: (r) => r.pos !== '1' },
      { key: 'b2', label: R`$b_{2}$`, type: 'q', def: '3', show: (r) => r.pos !== '2' },
      { key: 'b3', label: R`$b_{3}$`, type: 'q', def: '2', show: (r) => r.dim === '3' && r.pos !== '3' }
    ],
    examples: [
      { label: 'a=(1,2), b=(x,3)', v: { dim: '2', pos: '1', a1: '1', a2: '2', b2: '3' } },
      { label: 'a=(2,−1), b=(3,x)', v: { dim: '2', pos: '2', a1: '2', a2: '-1', b1: '3' } },
      { label: '3 次元 a=(1,2,1), b=(x,3,2)', v: { dim: '3', pos: '1', a1: '1', a2: '2', a3: '1', b2: '3', b3: '2' } },
      { label: '平行になる 3 次元', v: { dim: '3', pos: '3', a1: '1', a2: '-2', a3: '3', b1: '2', b2: '-4' } },
      { label: '平行にならない', v: { dim: '3', pos: '1', a1: '1', a2: '2', a3: '3', b2: '4', b3: '5' } },
      { label: '分数の解', v: { dim: '2', pos: '1', a1: '3', a2: '5', b2: '2' } }
    ],
    intro: {
      easy: R`ベクトルの条件問題の定番です。「$\vec{a}$ と $\vec{b}$ が**垂直**になる」とは、なす角が $90\degree$、つまり**内積が $0$**ということです。「**平行**になる」とは、同じ（または反対の）向きに伸びる、つまり一方が他方の**実数倍**（$\vec{b} = k\vec{a}$）ということです。
$\vec{b}$ の成分の 1 つが $x$ のとき、垂直なら内積の式が $x$ の 1 次方程式になるので、それを解きます。平行なら、$\vec{b} = k\vec{a}$ を成分ごとに書いて、$k$ と $x$ を求めます。どちらも「条件を式にする → 解く → 確かめる」の流れです。`,
      normal: R`垂直: $a_{1}b_{1}+a_{2}b_{2}(+a_{3}b_{3}) = 0$ を $x$ について解く。平行: $\vec{b}=k\vec{a}$ の成分から $k$ を決め、$x = ka_{i}$。平行にならないこともある（成分が比例しないとき）。`,
      pro: R`平面なら平行条件は $a_{1}b_{2}-a_{2}b_{1}=0$（たすき掛け）で一発です。空間では、$b_{i}=ka_{i}$ の連立を使います。$x$ が複数の場所に入るときは、内積・比の式を $x$ の方程式にまとめます。`
    },
    compute(v) {
      const dim = dimOf(v), pos = Number(v.pos) - 1;
      if (pos >= dim) throw new JK.CalcError('2 次元では、x を第 1 成分か第 2 成分に入れてください（第 3 成分は 3 次元のみです）');
      const A = vecOf(v, 'a', dim);
      if (isZeroV(A)) throw new JK.CalcError('a が零ベクトルです。0 でないベクトルを入力してください');
      const Bk = [];
      for (let i = 0; i < dim; i++) Bk.push(i === pos ? null : v['b' + (i + 1)]);
      const others = [];
      for (let i = 0; i < dim; i++) if (i !== pos) others.push(i);
      const bTex = (xt) => R`\left(` + Bk.map((q, i) => (i === pos ? xt : q.tex())).join(R`,\ `) + R`\right)`;
      const bAt = (x) => Bk.map((q, i) => (i === pos ? x : q));
      // 垂直
      const sigma = others.reduce((s, i) => s.add(A[i].mul(Bk[i])), Q(0));
      const ap = A[pos];
      let perpSol = null, perpKind;
      if (!ap.isZero()) { perpSol = sigma.neg().div(ap); perpKind = 'one'; }
      else perpKind = sigma.isZero() ? 'all' : 'none';
      // 平行
      let kv = null, parSol = null, parKind;
      const i0 = others.find((i) => !A[i].isZero());
      if (i0 !== undefined) {
        kv = Bk[i0].div(A[i0]);
        if (others.every((j) => Bk[j].eq(kv.mul(A[j])))) { parSol = kv.mul(ap); parKind = 'one'; }
        else parKind = 'none';
      } else {
        parKind = others.every((j) => Bk[j].isZero()) ? 'all' : 'none';
      }
      const steps = [];
      steps.push({
        t: '垂直と平行の条件',
        m: [R`\vec{a} \perp \vec{b} \Leftrightarrow \vec{a}\cdot\vec{b} = 0`, R`\vec{a} \parallel \vec{b} \Leftrightarrow \vec{b} = k\vec{a}\ \ (k \text{ は実数})`],
        n: R`垂直は内積 $0$、平行は一方が他方の実数倍、が条件です。$\vec{b}$ に含まれる未知数 $x$ を、この条件から決めます。`,
        easy: R`垂直（直角）なら、内積は $|\vec{a}||\vec{b}|\cos 90\degree = 0$ です。平行なら、向きが同じか反対なので、長さを何倍かすると重なります（$\vec{b} = k\vec{a}$、$k$ が負なら逆向き）。この 2 つの条件を式に書いて、$x$ の方程式にします。`,
        lv: 3
      });
      steps.push({
        t: '垂直になる条件',
        m: [
          R`\vec{a}\cdot\vec{b} = ` + A.map((q, i) => parQ(q) + R` \cdot ` + (i === pos ? 'x' : parQ(Bk[i]))).join(' + ') + ' = 0',
          P.tex([sigma, ap], 'x') + ' = 0'
        ],
        n: R`$\vec{a} = ` + vTex(A) + R`$、$\vec{b} = ` + bTex('x') + R`$ の内積を成分で計算し、$0$ とおきます。`,
        easy: R`内積は、対応する成分どうしをかけて足した値です。$\vec{b}$ の中の $x$ は文字のままかけ算に入れます。整理すると $x$ の 1 次方程式になります。それを $= 0$ とおいて解きます。`,
        pro: R`$x$ の係数は $\vec{a}$ の対応する成分 $a_{` + (pos + 1) + R`}$、定数項は残りの成分の積の和です。`
      });
      steps.push({
        t: R`$x$ を解く（垂直）`,
        m: perpKind === 'one' ? [R`x = ` + perpSol.tex(), R`\vec{b} = ` + vTex(bAt(perpSol))] : [perpKind === 'all' ? R`0 \cdot x + ` + sigma.tex() + R` = 0 \;\Rightarrow\; x \text{ はどんな値でもよい}` : R`0 \cdot x + ` + sigma.tex() + R` = 0 \;\Rightarrow\; \text{成り立つ } x \text{ はない}`],
        n: perpKind === 'one' ? R`$x$ の 1 次方程式を解いて $x = ` + perpSol.tex() + R`$。このとき $\vec{b} = ` + vTex(bAt(perpSol)) + R`$ です。` : (perpKind === 'all' ? R`$x$ の係数が $0$ で、定数項も $0$ なので、どんな $x$ でも垂直です。` : R`$x$ の係数が $0$ で、定数項が $0$ ではないので、$x$ をどう選んでも内積は $0$ になりません。`),
        easy: perpKind === 'one' ? R`方程式 $` + P.tex([sigma, ap], 'x') + R` = 0$ を、移項して $x$ について解きます。` : R`$x$ がかけ算で消えてしまう（係数が $0$）ので、$x$ では内積を変えられません。それなら、他の成分だけで内積が $0$ か決まります。`,
        pro: R`検算は内積に代入して $0$ になるか、です。`
      });
      if (perpKind === 'one') {
        const bb = bAt(perpSol);
        steps.push({
          t: '確かめ（垂直）',
          m: [R`\vec{a}\cdot\vec{b} = ` + dotLine(A, bb) + ' = ' + dotQ(A, bb).tex()],
          n: R`求めた $x$ を入れた $\vec{b}$ と $\vec{a}$ の内積が $0$ になります。`,
          easy: R`答えの $x$ を $\vec{b}$ に入れて、実際に内積を計算します。$0$ になれば正解です。`,
          lv: 2
        });
      }
      steps.push({
        t: '平行になる条件',
        m: [R`\vec{b} = k\vec{a}\ :\quad ` + bTex('x') + R` = k` + vTex(A)].concat(
          others.map((i) => parQ(Bk[i]) + ' = k \\cdot ' + parQ(A[i])),
          ['x = k \\cdot ' + parQ(ap)]
        ),
        n: R`成分ごとに $\vec{b} = k\vec{a}$ を書きます。$x$ 以外の成分の式から $k$ が決まり、$x$ の成分の式から $x$ が決まります。`,
        easy: R`平行なら、$\vec{b}$ は $\vec{a}$ を何倍かしたものです。その倍率を $k$ とすると、成分ごとに「$\vec{b}$ の成分 $= k \times \vec{a}$ の成分」が成り立ちます。$x$ のない成分の式から $k$ を求め、それを $x$ の成分の式に入れると $x$ が出ます。`,
        pro: R`平面ならたすき掛け $a_{1}b_{2}=a_{2}b_{1}$ で一発です（空間では全成分の比が等しいことを確かめる）。`
      });
      steps.push({
        t: R`$k$ と $x$ を求める（平行）`,
        m: parKind === 'one'
          ? [R`k = ` + kv.tex(), R`x = k \cdot ` + parQ(ap) + ' = ' + parQ(kv) + R` \cdot ` + parQ(ap) + ' = ' + parSol.tex(), R`\vec{b} = ` + vTex(bAt(parSol)) + ' = ' + parQ(kv) + vTex(A)]
          : (parKind === 'all'
            ? [R`b_{i} = k a_{i} = 0\ (x \text{ 以外の成分はすべて } 0) \;\Rightarrow\; x \text{ は任意}`]
            : [i0 === undefined ? R`x \text{ 以外の成分が } 0 \text{ でない} \;\Rightarrow\; \vec{b} \parallel \vec{a} \text{ とならない}` : R`k = ` + kv.tex() + R`\ \text{のとき、他の成分の比が合わない} \;\Rightarrow\; \text{平行になる } x \text{ はない}`]),
        n: parKind === 'one' ? R`$k = ` + kv.tex() + R`$、$x = ` + parSol.tex() + R`$ のとき $\vec{b} = ` + vTex(bAt(parSol)) + R`$ で、$\vec{a}$ と平行です。` : (parKind === 'all' ? R`$x$ 以外の成分がすべて $0$ なので、$\vec{b} = (x, 0, \cdots)$ はいつも $\vec{a}$ と同じ直線上にあります（$x=0$ のときは零ベクトルです）。` : R`$x$ 以外の成分の比が $\vec{a}$ と合わないので、$x$ をどう選んでも $\vec{b}$ は $\vec{a}$ と平行になりません。`),
        easy: parKind === 'one' ? R`$x$ のない成分の式から倍率 $k = ` + kv.tex() + R`$ が分かります。$x$ の成分も同じ倍率で変わるので、$x = k \times (\vec{a}$ の対応する成分$)$ です。すべての成分がこの $k$ でそろえば、平行になります。` : R`平行になるには、すべての成分が同じ倍率 $k$ でそろう必要があります。$x$ で調整できない成分の比が合わないとき、平行になる $x$ は存在しません。`,
        pro: R`存在しない場合も「なし」と書いて終わらず、理由（比が合わない）を添えると丁寧です。`
      });
      if (parKind === 'one') {
        const bb = bAt(parSol);
        const cr = dim === 2 ? [A[0].mul(bb[1]).sub(A[1].mul(bb[0]))] : [A[1].mul(bb[2]).sub(A[2].mul(bb[1])), A[2].mul(bb[0]).sub(A[0].mul(bb[2])), A[0].mul(bb[1]).sub(A[1].mul(bb[0]))];
        steps.push({
          t: '確かめ（平行）',
          m: [dim === 2
            ? R`a_{1}b_{2} - a_{2}b_{1} = ` + parQ(A[0]) + R` \cdot ` + parQ(bb[1]) + ' - ' + parQ(A[1]) + R` \cdot ` + parQ(bb[0]) + ' = ' + cr[0].tex()
            : R`\text{外積の成分: } ` + vTex(cr) + R` = \vec{0}`],
          n: R`$\vec{a}$ と $\vec{b}$ が平行なら、たすき掛け（平面）や外積（空間）が $0$ になります。求めた $x$ を入れて確かめます。`,
          easy: R`平行なら、2 つのベクトルの成分の比は等しいので、たすき掛けの差が $0$ になります。たとえば $(1,\ 2)$ と $(3,\ 6)$ では $1 \times 6 - 2 \times 3 = 0$ です。`,
          lv: 2
        });
      }
      const sol = (kind, q) => (kind === 'one' ? 'x = ' + q.tex() : (kind === 'all' ? R`x \text{ はすべての実数}` : R`\text{存在しない}`));
      let fig = null;
      if (dim === 2) {
        const arrows = [{ x: A[0].val(), y: A[1].val(), cls: 'c1', label: 'a' }];
        if (perpKind === 'one') { const bb = bAt(perpSol); arrows.push({ x: bb[0].val(), y: bb[1].val(), cls: 'c2', label: 'b⊥' }); }
        if (parKind === 'one') { const bb = bAt(parSol); if (!bb.every((q) => q.isZero())) arrows.push({ x: bb[0].val(), y: bb[1].val(), cls: 'c3', label: 'b∥', dash: true }); }
        fig = JK.plot.graph(vecOpts(arrows, [], 2));
      }
      return {
        result: [
          { label: '垂直になる x', tex: sol(perpKind, perpSol) },
          { label: '平行になる x', tex: sol(parKind, parSol) },
          { label: 'そのときの b（垂直）', tex: perpKind === 'one' ? R`\vec{b} = ` + vTex(bAt(perpSol)) : R`\text{なし（または不定）}` },
          { label: 'そのときの b（平行）', tex: parKind === 'one' ? R`\vec{b} = ` + vTex(bAt(parSol)) : R`\text{なし（または不定）}` }
        ],
        steps: steps,
        fig: fig
      };
    }
  });
})();
