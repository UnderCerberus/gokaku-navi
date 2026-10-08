/* 数I・A — 図形と計量: 三角比の値（単位円）/ 相互関係 / 正弦定理 / 余弦定理 / 三角形の面積と内接円
   構成は ia-quad.js に揃える（intro → result → steps(easy/pro/lv) → fig）。
   根号つきの値は「有理数 × √m」の形（S 型）で厳密に計算し、15° の倍数以外の角は近似値で示す。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util;
  const CE = (msg) => new JK.CalcError(msg);
  const RAD = Math.PI / 180;

  /* ================= 共通ヘルパー ================= */

  function chain(lhs, rhs) {                               // lhs = r1 = r2 …（同じ式の連続は省く。\approx で始まる項は「=」を付けない）
    const r = rhs.filter((s, i) => i === 0 || s !== rhs[i - 1]);
    const rel = (s) => (/^\\approx/.test(s) ? '' : '= ');
    if (r.length === 1) return lhs + (rel(r[0]) ? ' = ' : ' ') + r[0];
    return R`\begin{aligned} ` + lhs + ' &' + rel(r[0]) + r[0] + r.slice(1).map((s) => R` \\ &` + rel(s) + s).join('') + R` \end{aligned}`;
  }
  const fmt = (x, d) => U.fmt(Math.abs(x) < 1e-12 ? 0 : x, d == null ? 4 : d);
  const degTex = (d, k) => fmt(d, k == null ? 4 : k) + R`\degree`;
  const sq2 = (q) => (q.isInt() && q.sign() >= 0 ? q.tex() + '^{2}' : R`\left(` + q.tex() + R`\right)^{2}`);   // Q の 2 乗の表示

  /* ---------- S 型: 有理数 r に √m をかけた値（m は平方因子をもたない整数） ---------- */

  function mkS(r, m) {
    if (r.isZero()) return { r: Q(0), m: 1 };
    const s = U.sqrtSimplify(m);
    return { r: r.mul(s.out), m: s.in };
  }
  const sQ = (q) => ({ r: q, m: 1 });
  const sVal = (s) => s.r.val() * Math.sqrt(s.m);
  const sMul = (a, b) => mkS(a.r.mul(b.r), a.m * b.m);
  const sDiv = (a, b) => {
    if (b.r.isZero()) throw CE('0 で割ることはできません');
    return mkS(a.r.div(b.r).div(b.m), a.m * b.m);
  };
  const sNeg = (s) => ({ r: s.r.neg(), m: s.m });
  const sSq = (s) => s.r.mul(s.r).mul(s.m);                 // 2 乗（Q）
  function sqrtQ(q) {                                       // √q（q ≥ 0）。分子と分母を別々に簡単にして桁を抑える
    if (q.n > 1e13 || q.d > 1e13) throw CE('数値の桁数が多すぎて、根号を含む厳密な値を計算できません。整数や簡単な分数で入力してください');
    const sn = U.sqrtSimplify(q.n), sd = U.sqrtSimplify(q.d);
    if (sn.in * sd.in > 1e14) throw CE('数値の桁数が多すぎて、根号を含む厳密な値を計算できません。整数や簡単な分数で入力してください');
    return mkS(Q(sn.out, sd.out * sd.in), sn.in * sd.in);
  }
  const sScale = (s, q) => mkS(s.r.mul(q), s.m);           // S に有理数をかける
  function sTex(s) {
    if (s.r.isZero()) return '0';
    if (s.m === 1) return s.r.tex();
    const ab = s.r.abs(), rad = R`\sqrt{` + s.m + '}';
    const num = (ab.n === 1 ? '' : String(ab.n)) + rad;
    return (s.r.sign() < 0 ? '-' : '') + (ab.d === 1 ? num : R`\frac{` + num + '}{' + ab.d + '}');
  }
  const sParen = (s) => (s.r.sign() < 0 ? R`\left(` + sTex(s) + R`\right)` : sTex(s));
  const sParenSq = (s) => (s.m === 1 && s.r.isInt() && s.r.sign() >= 0 ? sTex(s) + '^{2}' : R`\left(` + sTex(s) + R`\right)^{2}`);

  // 整数度の特別な角（0, 30, 45, 60, 90, 120, 135, 150, 180）の sin, cos
  const BASE = {
    0: { s: mkS(Q(0), 1), c: mkS(Q(1), 1) },
    30: { s: mkS(Q(1, 2), 1), c: mkS(Q(1, 2), 3) },
    45: { s: mkS(Q(1, 2), 2), c: mkS(Q(1, 2), 2) },
    60: { s: mkS(Q(1, 2), 3), c: mkS(Q(1, 2), 1) },
    90: { s: mkS(Q(1), 1), c: mkS(Q(0), 1) }
  };
  function trigS(deg) {
    if (!Number.isInteger(deg) || deg < 0 || deg > 180) return null;
    if (deg <= 90) return BASE[deg] || null;
    const b = BASE[180 - deg];
    return b ? { s: b.s, c: sNeg(b.c) } : null;
  }

  // 15° の倍数の厳密値（TeX）を図のラベル用の文字列にする
  function plainTex(t) {
    if (t == null) return '';
    let s = String(t).replace(/\\sqrt\{(\d+)\}/g, '√$1');
    for (let i = 0; i < 3; i++) {
      s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m0, n, d) => (/[+-]/.test(n.replace(/^-/, '')) ? '(' + n + ')' : n) + '/' + d);
    }
    return s.replace(/-/g, '−');
  }

  /* ---------- 図: 単位円 ---------- */

  function unitFig(deg) {
    const th = deg * RAD, c = Math.cos(th), s = Math.sin(th);
    const inner = deg > 0.5 && deg < 179.5;
    const spec = {
      w: 340, h: 215, x: [-1.5, 1.5], y: [-0.2, 1.4], equal: true,
      param: [{ x: (t) => Math.cos(t), y: (t) => Math.sin(t), t: [0, Math.PI], cls: 'c1' }],
      segs: [{ x1: 0, y1: 0, x2: c, y2: s, cls: 'c2' }],
      points: [{ x: c, y: s, label: inner ? 'P(θ)' : 'P', cls: 'c2', pos: c >= 0 ? 'tr' : 'tl' }],
      labels: []
    };
    if (inner) {
      spec.segs.push({ x1: c, y1: s, x2: c, y2: 0, cls: 'dim', dash: true });
      spec.param.push({ x: (t) => 0.2 * Math.cos(t), y: (t) => 0.2 * Math.sin(t), t: [0, th], cls: 'c3' });
      spec.labels.push({ x: 0.3 * Math.cos(th / 2), y: 0.3 * Math.sin(th / 2) - 0.02, text: 'θ', cls: 'c3', anchor: 'middle' });
      spec.labels.push({ x: c, y: -0.27, text: 'cosθ', cls: 'fg', anchor: 'middle' });
      spec.labels.push({ x: c + (c >= 0 ? 0.04 : -0.04), y: s / 2, text: 'sinθ', cls: 'fg', anchor: c >= 0 ? 'start' : 'end' });
      if (Math.abs(c) > 0.02) {                            // 180°−θ の点 P'（y 軸について対称）
        spec.segs.push({ x1: 0, y1: 0, x2: -c, y2: s, cls: 'dim', dash: true });
        spec.segs.push({ x1: -c, y1: s, x2: -c, y2: 0, cls: 'dim', dash: true });
        spec.points.push({ x: -c, y: s, label: "P'(180°−θ)", cls: 'c3', pos: c >= 0 ? 'tl' : 'tr' });
      }
    }
    return JK.plot.graph(spec);
  }

  /* ---------- 図: 三角形（数学座標 y 上向き）を外接円・内接円などと一緒に枠に収めて描く ---------- */

  // P = {A:[x,y], B, C}。o: { circles:[{cx,cy,r,cls,dash}], sides:{a,b,c}（ラベル）, angles:{A,B,C}（ラベル）, extra(d,T,sc) }
  function triFigure(P, o) {
    o = o || {};
    const W = o.w || 340, H = o.h || 250, M = 28;
    let x0 = Math.min(P.A[0], P.B[0], P.C[0]), x1 = Math.max(P.A[0], P.B[0], P.C[0]);
    let y0 = Math.min(P.A[1], P.B[1], P.C[1]), y1 = Math.max(P.A[1], P.B[1], P.C[1]);
    (o.circles || []).forEach((cc) => {
      x0 = Math.min(x0, cc.cx - cc.r); x1 = Math.max(x1, cc.cx + cc.r);
      y0 = Math.min(y0, cc.cy - cc.r); y1 = Math.max(y1, cc.cy + cc.r);
    });
    const sc = Math.min((W - 2 * M) / Math.max(x1 - x0, 1e-9), (H - 2 * M) / Math.max(y1 - y0, 1e-9));
    const ox = (W - sc * (x1 - x0)) / 2 - sc * x0, oy = (H + sc * (y1 - y0)) / 2 + sc * y0;
    const T = (p) => [ox + sc * p[0], oy - sc * p[1]];
    const d = JK.plot.draw(W, H);
    const A = T(P.A), B = T(P.B), C = T(P.C);
    d.poly([A, B, C], { cls: 'fg', fill: 'f0' });
    (o.circles || []).forEach((cc) => {
      const t = T([cc.cx, cc.cy]);
      d.circle(t[0], t[1], cc.r * sc, { cls: cc.cls || 'c2', dash: !!cc.dash });
    });
    if (o.extra) o.extra(d, T, sc);
    const g = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    const out = (p, dist) => {
      const dx = p[0] - g[0], dy = p[1] - g[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      return [p[0] + dx / L * dist, p[1] + dy / L * dist];
    };
    [['A', A], ['B', B], ['C', C]].forEach((e) => {
      const q = out(e[1], 13);
      d.text(q[0], q[1] + 4, e[0], { cls: 'fg', size: 13, italic: true });
    });
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    [['a', B, C], ['b', C, A], ['c', A, B]].forEach((e) => {
      if (!o.sides || !o.sides[e[0]]) return;
      const q = out(mid(e[1], e[2]), 15);
      d.text(q[0], q[1] + 4, o.sides[e[0]], { cls: 'c2', size: 12 });
    });
    const dirDeg = (V, Uu) => Math.atan2(Uu[1] - V[1], Uu[0] - V[0]) * 180 / Math.PI;
    const heightPx = (V, Uu, Ww) => {                      // 頂点 V から直線 UW までの距離（px）
      const L = Math.sqrt((Ww[0] - Uu[0]) * (Ww[0] - Uu[0]) + (Ww[1] - Uu[1]) * (Ww[1] - Uu[1])) || 1;
      return Math.abs((Ww[0] - Uu[0]) * (Uu[1] - V[1]) - (Uu[0] - V[0]) * (Ww[1] - Uu[1])) / L;
    };
    [['A', P.A, P.B, P.C, A, B, C], ['B', P.B, P.C, P.A, B, C, A], ['C', P.C, P.A, P.B, C, A, B]].forEach((e) => {
      if (!o.angles || !o.angles[e[0]]) return;
      let a0 = dirDeg(e[1], e[2]), a1 = dirDeg(e[1], e[3]), dd = ((a1 - a0) % 360 + 360) % 360;
      if (dd > 180) { const t = a0; a0 = a1; a1 = t; dd = 360 - dd; }
      const V = e[4];
      if (dd > 100 && heightPx(V, e[5], e[6]) < 42) {      // つぶれた三角形の鈍角: ラベルは三角形の外側に出す
        d.arc(V[0], V[1], 18, a0, a0 + dd, { cls: 'c3' });
        const q = out(V, 32);
        d.text(q[0], Math.max(q[1] + 4, 12), o.angles[e[0]], { cls: 'c3', size: 12, italic: true });
      } else {
        d.angle(V[0], V[1], dd < 35 ? 34 : 22, a0, a0 + dd, o.angles[e[0]], { cls: 'c3' });
      }
    });
    return d.svg();
  }
  // 3 辺（数値）から三角形の頂点座標: B=(0,0), C=(a,0)
  function triFromSides(a, b, c) {
    const x = (a * a + c * c - b * b) / (2 * a);
    return { A: [x, Math.sqrt(Math.max(c * c - x * x, 0))], B: [0, 0], C: [a, 0] };
  }

  /* ================= ia-trig-values: 三角比の値（単位円） ================= */

  JK.registerCalc({
    id: 'ia-trig-values',
    course: 'IA',
    unit: 'm-trig1',
    group: '図形と計量',
    title: '三角比の値（0°〜180°・単位円）',
    desc: R`角 $\theta$（$0\degree \le \theta \le 180\degree$）の $\sin\theta,\ \cos\theta,\ \tan\theta$ を、単位円と $180\degree-\theta$ の関係を使って求めます。15° の倍数は根号を使った正確な値、それ以外は近似値で示します。`,
    form: [R`\sin\theta = y,\quad \cos\theta = x,\quad \tan\theta = \frac{y}{x}`, R`\sin(180\degree-\theta) = \sin\theta,\ \cos(180\degree-\theta) = -\cos\theta,\ \tan(180\degree-\theta) = -\tan\theta`],
    inputs: [
      { key: 'deg', label: R`角 $\theta$（度）`, type: 'num', def: '150', min: 0, max: 180, hint: R`$0 \le \theta \le 180$ の角度（度）。小数も入力できます。` }
    ],
    examples: [
      { label: '30°', v: { deg: '30' } },
      { label: '45°', v: { deg: '45' } },
      { label: '120°（鈍角）', v: { deg: '120' } },
      { label: '135°（鈍角）', v: { deg: '135' } },
      { label: '75°（15° の倍数）', v: { deg: '75' } },
      { label: '90°（tan は定義されない）', v: { deg: '90' } },
      { label: '37°（近似値）', v: { deg: '37' } }
    ],
    intro: {
      easy: R`三角比は、直角三角形の辺の比（$\sin\theta=\frac{\text{対辺}}{\text{斜辺}}$ など）として習いますが、直角や鈍角にも広げるために、**半径 1 の円（単位円）**の周上の点の座標で定義し直します。原点から $x$ 軸の正の向きに対して反時計まわりに角 $\theta$ だけ回った点を $P$ とすると、**$P$ の横の位置が $\cos\theta$、縦の位置が $\sin\theta$**、$\tan\theta$ は直線 $OP$ の傾きです。
この計算機は、図の単位円で $P$ の位置を確かめながら、$\sin\theta,\ \cos\theta,\ \tan\theta$ の値を求めます。鈍角のときは「$180\degree-\theta$ の鋭角に直す」のがコツです。`,
      normal: R`単位円上の点 $P(\cos\theta,\ \sin\theta)$ で定義します。$30\degree,\ 45\degree,\ 60\degree$ の値を押さえ、鈍角は $\sin\theta=\sin(180\degree-\theta)$、$\cos\theta=-\cos(180\degree-\theta)$、$\tan\theta=-\tan(180\degree-\theta)$ で鋭角に直します。`,
      pro: R`$\sin$ は第 1・2 象限で正、$\cos$ は第 1 象限で正・第 2 象限で負、$\tan=\frac{\sin}{\cos}$ の符号は $\cos$ に連動。$0\degree,\ 90\degree,\ 180\degree$ の値と $\tan90\degree$ が定義されないことを即答できるように。`
    },
    compute(v) {
      const deg = v.deg;
      const th = deg * RAD;
      const clean = (x) => (Math.abs(x) < 1e-12 ? 0 : x);
      const sn = clean(Math.sin(th)), cs = clean(Math.cos(th));
      const is90 = Math.abs(deg - 90) < 1e-9;
      const tn = is90 ? null : sn / cs;
      const ex = U.exactTrig(deg);
      const obtuse = deg > 90 + 1e-9;
      const ref = obtuse ? 180 - deg : deg;
      const exRef = U.exactTrig(ref);
      const dTex = degTex(deg), rTex = degTex(ref);
      // 「= 厳密値（≈ 近似値）」または「≈ 近似値」の右辺
      const eqv = (e, x) => (e == null ? R` \approx ` + fmt(x) : ' = ' + e + (/sqrt/.test(e) ? R` \approx ` + fmt(x) : ''));
      const lineOf = (d0, e, sx, cx, tx) => R`\sin ` + degTex(d0) + eqv(e && e.sin, sx) +
        R`,\quad \cos ` + degTex(d0) + eqv(e && e.cos, cx) +
        R`,\quad \tan ` + degTex(d0) + (tx == null ? R` \text{ は定義されない}` : eqv(e && e.tan, tx));
      const sr = Math.sin(ref * RAD), cr = Math.cos(ref * RAD), tr = Math.abs(ref - 90) < 1e-9 ? null : Math.tan(ref * RAD);
      const steps = [];
      steps.push({
        t: '三角比の定義（単位円）',
        m: [R`\sin\theta = y,\qquad \cos\theta = x,\qquad \tan\theta = \frac{y}{x}`, R`P(x,\ y) = (\cos\theta,\ \sin\theta)`],
        n: R`原点 $O$ を中心とする**半径 1 の円（単位円）**の周上に、$x$ 軸の正の向きから反時計まわりに角 $\theta$ だけ回った点 $P(x,\ y)$ をとります。このとき $\cos\theta=x$、$\sin\theta=y$、$\tan\theta=\frac{y}{x}$ と定めます。鈍角や直角の三角比もこの定義で決まります。`,
        easy: R`直角三角形の「斜辺・底辺・高さ」で決めた $\sin,\ \cos,\ \tan$ を、鈍角にも使えるように広げたものが、単位円による定義です。半径 1 の円の周上の点 $P$ の**横の位置（$x$ 座標）が $\cos\theta$、縦の位置（$y$ 座標）が $\sin\theta$** になります。$\tan\theta$ は「$P$ と原点を結ぶ直線の傾き」$\frac{y}{x}$ にあたります。たとえば $\theta=0\degree$ の点は $(1,\ 0)$ なので、$\cos0\degree=1,\ \sin0\degree=0$ です。`,
        pro: R`$P$ の座標が $(\cos\theta,\ \sin\theta)$ なので、$\sin^{2}\theta+\cos^{2}\theta=1$ はそのまま「$x^{2}+y^{2}=1$」です。`
      });
      steps.push({
        t: R`$30\degree,\ 45\degree,\ 60\degree$ の値のもと（三角定規）`,
        m: [
          R`30\degree,\ 60\degree,\ 90\degree \text{ の直角三角形: 辺の比 } 1 : \sqrt{3} : 2`,
          R`45\degree,\ 45\degree,\ 90\degree \text{ の直角三角形: 辺の比 } 1 : 1 : \sqrt{2}`,
          R`\sin 30\degree = \frac{1}{2},\ \cos 30\degree = \frac{\sqrt{3}}{2},\ \tan 30\degree = \frac{1}{\sqrt{3}} = \frac{\sqrt{3}}{3}`,
          R`\sin 45\degree = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2},\ \cos 45\degree = \frac{\sqrt{2}}{2},\ \tan 45\degree = 1`,
          R`\sin 60\degree = \frac{\sqrt{3}}{2},\ \cos 60\degree = \frac{1}{2},\ \tan 60\degree = \sqrt{3}`
        ],
        n: R`三角定規の辺の比から、$\sin=\frac{\text{対辺}}{\text{斜辺}},\ \cos=\frac{\text{底辺}}{\text{斜辺}},\ \tan=\frac{\text{対辺}}{\text{底辺}}$ で求めます。`,
        easy: R`三角定規の 2 つの形（正三角形を半分にした $30\degree$-$60\degree$-$90\degree$ と、正方形を半分にした $45\degree$-$45\degree$-$90\degree$）の辺の比は決まっています。斜辺を 1 にそろえて考えると、「対辺 ÷ 斜辺」が $\sin$、「底辺 ÷ 斜辺」が $\cos$ です。たとえば $30\degree$ の対辺は斜辺の半分だから $\sin30\degree=\frac{1}{2}$ です。この 3 つの角の値は暗記しておくと入試で必ず役に立ちます。`,
        lv: 3
      });
      // 180°−θ の関係
      const relM = [R`\sin(180\degree-\theta) = \sin\theta,\quad \cos(180\degree-\theta) = -\cos\theta,\quad \tan(180\degree-\theta) = -\tan\theta`];
      if (deg > 1e-9 && deg < 180 - 1e-9) {
        if (obtuse) {
          relM.push(R`\theta' = 180\degree - ` + dTex + ' = ' + rTex);
          relM.push(R`\sin ` + dTex + R` = \sin ` + rTex + R`,\quad \cos ` + dTex + R` = -\cos ` + rTex + R`,\quad \tan ` + dTex + R` = -\tan ` + rTex);
        } else {
          const sup = 180 - deg;
          relM.push(R`180\degree - ` + dTex + ' = ' + degTex(sup));
          relM.push(R`\sin ` + degTex(sup) + R` = \sin ` + dTex + R`,\quad \cos ` + degTex(sup) + R` = -\cos ` + dTex + R`,\quad \tan ` + degTex(sup) + R` = -\tan ` + dTex);
        }
      }
      steps.push({
        t: R`$180\degree-\theta$ との関係（鈍角を鋭角に直す）`,
        m: relM,
        n: obtuse
          ? R`鈍角 $\theta=` + dTex + R`$ は、$\theta'=180\degree-\theta=` + rTex + R`$ という**鋭角**に直して調べます。単位円で、$P$ と $y$ 軸について対称な点 $P'$ を考えると、高さ（$y$）は同じ、横の位置（$x$）は符号が逆になるからです。`
          : R`単位円で、角 $\theta$ の点 $P$ と、$y$ 軸について対称な点 $P'$（角 $180\degree-\theta$）を比べると、高さ（$y$）は同じ、横の位置（$x$）は符号が逆です。これが $180\degree-\theta$ の関係です。`,
        easy: R`単位円の図で、$P$ と $P'$ は $y$ 軸をはさんで左右対称です。左右対称なので**高さ（$y$ 座標）は同じ**、つまり $\sin$ は変わりません。横の位置（$x$ 座標）は符号が反対になるので $\cos$ は符号だけ逆。$\tan=\frac{y}{x}$ も、分母の $x$ の符号が逆になって符号が逆になります。`,
        pro: obtuse ? R`鈍角の三角比は「$\sin$ はそのまま、$\cos$ と $\tan$ は符号反転」で鋭角に帰着。` : undefined,
        lv: obtuse ? 1 : 2
      });
      steps.push({
        t: obtuse || deg > 1e-9 && ref !== deg ? R`鋭角 $` + rTex + R`$ の三角比の値` : R`$` + dTex + R`$ の三角比の値`,
        m: [lineOf(ref, exRef, sr, cr, tr)],
        n: exRef
          ? R`$` + rTex + R`$ は特別な角（15° の倍数）なので、根号を使った正確な値になります。`
          : R`$` + rTex + R`$ は特別な角ではないので、三角比の表（または電卓）で求めた近似値（小数第 4 位まで）で答えます。`,
        easy: exRef
          ? R`上の「三角定規」の値を使います。`
          : R`$30\degree,\ 45\degree,\ 60\degree$ のようなきれいな値にならない角は、三角比の表や電卓で近似値を調べます（入試では、このような角の値は問題文に与えられます）。`
      });
      if (exRef && (Math.abs(ref - 15) < 1e-9 || Math.abs(ref - 75) < 1e-9)) {
        steps.push({
          t: R`（参考）$15\degree,\ 75\degree$ の値の求め方`,
          m: [
            R`\sin 75\degree = \sin(45\degree + 30\degree) = \sin45\degree\cos30\degree + \cos45\degree\sin30\degree = \frac{\sqrt{6}+\sqrt{2}}{4}`,
            R`\cos 75\degree = \cos(45\degree + 30\degree) = \cos45\degree\cos30\degree - \sin45\degree\sin30\degree = \frac{\sqrt{6}-\sqrt{2}}{4}`,
            R`\sin 15\degree = \cos 75\degree = \frac{\sqrt{6}-\sqrt{2}}{4},\qquad \cos 15\degree = \sin 75\degree = \frac{\sqrt{6}+\sqrt{2}}{4}`,
            R`\tan 15\degree = 2 - \sqrt{3},\qquad \tan 75\degree = 2 + \sqrt{3}`
          ],
          n: R`$15\degree=45\degree-30\degree$、$75\degree=45\degree+30\degree$ と分けて、数 II で学ぶ**加法定理**で求めます。高校 1 年の段階では、これらの値は問題文で与えられるか、図形（頂角 $30\degree$ の二等辺三角形など）から求めます。`,
          easy: R`$75\degree$ は $45\degree+30\degree$ と分けられるので、「和の角の公式」（加法定理）を使うと、すでに知っている $30\degree,\ 45\degree$ の値から計算できます。これは数 II の内容です。いまは「$15\degree,\ 75\degree$ にも根号を使った値がある」と知っておけば十分です。`,
          lv: 3
        });
      }
      // 結論
      const cl = [];
      const sgnC = obtuse ? '-' : '', sgnT = obtuse ? '-' : '';
      if (obtuse && exRef) {
        cl.push(R`\sin ` + dTex + R` = \sin ` + rTex + ' = ' + ex.sin);
        cl.push(R`\cos ` + dTex + R` = -\cos ` + rTex + ' = ' + ex.cos);
        cl.push(R`\tan ` + dTex + R` = -\tan ` + rTex + ' = ' + (ex.tan == null ? R`\text{定義されない}` : ex.tan));
      } else if (obtuse) {
        cl.push(R`\sin ` + dTex + R` = \sin ` + rTex + R` \approx ` + fmt(sn));
        cl.push(R`\cos ` + dTex + R` = -\cos ` + rTex + R` \approx ` + fmt(cs));
        cl.push(R`\tan ` + dTex + R` = -\tan ` + rTex + R` \approx ` + fmt(tn));
      } else {
        cl.push(lineOf(deg, ex, sn, cs, tn));
      }
      steps.push({
        t: R`$\theta=` + dTex + R`$ の三角比`,
        m: cl,
        n: obtuse
          ? R`鈍角では $\sin\theta>0,\ \cos\theta<0,\ \tan\theta<0$ になります。符号が合っているか確かめましょう。`
          : (is90 ? R`$\theta=90\degree$ では $P(0,\ 1)$ で $x=0$ なので、$\tan\theta=\frac{y}{x}$ は分母が 0 になり**定義されません**。` : R`$0\degree<\theta<90\degree$ の鋭角では、$\sin,\ \cos,\ \tan$ はすべて正です。`),
        easy: R`点 $P$ の位置と符号を見比べます。$P$ が $y$ 軸の右側（鋭角）なら $\cos>0$、左側（鈍角）なら $\cos<0$。$P$ はいつも $x$ 軸の上側にあるので $\sin\ge0$ です。`,
        pro: R`$90\degree$ の $\tan$、$0\degree$・$180\degree$ の値（$\sin=0,\ \cos=\pm1,\ \tan=0$）は即答できるように。`
      });
      steps.push({
        t: '近似値で確かめる',
        m: [R`\sin\theta \approx ` + fmt(sn) + R`,\quad \cos\theta \approx ` + fmt(cs) + R`,\quad \tan\theta ` + (tn == null ? R`\text{は定義されない}` : R`\approx ` + fmt(tn))],
        n: R`正確な値と近似値が一致しているか、図の点 $P$ の位置（$x\approx` + fmt(cs, 3) + R`,\ y\approx` + fmt(sn, 3) + R`$）と照らして確認します。`,
        lv: 2
      });
      const pTex = R`P\left(` + (ex ? ex.cos : fmt(cs)) + R`,\ ` + (ex ? ex.sin : fmt(sn)) + R`\right)`;
      return {
        result: [
          { label: 'sin θ', tex: R`\sin\theta` + eqv(ex && ex.sin, sn) },
          { label: 'cos θ', tex: R`\cos\theta` + eqv(ex && ex.cos, cs) },
          { label: 'tan θ', tex: tn == null ? R`\tan\theta = \text{定義されない}` : R`\tan\theta` + eqv(ex && ex.tan, tn) },
          { label: '単位円上の点', tex: pTex }
        ],
        steps: steps,
        fig: unitFig(deg)
      };
    }
  });

  /* ================= ia-trig-relation: 三角比の相互関係 ================= */

  const REL_FORM = [R`\sin^{2}\theta + \cos^{2}\theta = 1`, R`\tan\theta = \frac{\sin\theta}{\cos\theta}`, R`1 + \tan^{2}\theta = \frac{1}{\cos^{2}\theta}`];

  JK.registerCalc({
    id: 'ia-trig-relation',
    course: 'IA',
    unit: 'm-trig1',
    group: '図形と計量',
    title: '三角比の相互関係（1 つの値から残りを求める）',
    desc: R`$\sin\theta,\ \cos\theta,\ \tan\theta$ のどれか 1 つの値と、$\theta$ が鋭角か鈍角かから、残りの 2 つを相互関係の公式で求めます。根号は簡単にし、分母は有理化します。`,
    form: REL_FORM,
    inputs: [
      { key: 'kind', label: '与えられた値', type: 'select', def: 'sin', options: [['sin', 'sin θ の値'], ['cos', 'cos θ の値'], ['tan', 'tan θ の値']] },
      { key: 'val', label: '値（分数・小数も可）', type: 'q', def: '3/5', min: -1000, max: 1000, hint: R`例: $\sin\theta=\frac{3}{5}$ なら sin を選んで 3/5 と入力します。` },
      { key: 'ang', label: R`角 $\theta$ の範囲`, type: 'select', def: 'acute', options: [['acute', '鋭角（0° < θ < 90°）'], ['obtuse', '鈍角（90° < θ < 180°）']] }
    ],
    examples: [
      { label: 'sin = 3/5（鋭角）', v: { kind: 'sin', val: '3/5', ang: 'acute' } },
      { label: 'sin = 1/3（鈍角）', v: { kind: 'sin', val: '1/3', ang: 'obtuse' } },
      { label: 'cos = −2/3（鈍角）', v: { kind: 'cos', val: '-2/3', ang: 'obtuse' } },
      { label: 'cos = 1/4（鋭角）', v: { kind: 'cos', val: '1/4', ang: 'acute' } },
      { label: 'tan = 2（鋭角）', v: { kind: 'tan', val: '2', ang: 'acute' } },
      { label: 'tan = −3/4（鈍角）', v: { kind: 'tan', val: '-3/4', ang: 'obtuse' } }
    ],
    intro: {
      easy: R`$\sin\theta,\ \cos\theta,\ \tan\theta$ は、バラバラの値ではなく、次の 3 つの式（**相互関係**）でつながっています。
$\sin^{2}\theta+\cos^{2}\theta=1$、$\tan\theta=\frac{\sin\theta}{\cos\theta}$、$1+\tan^{2}\theta=\frac{1}{\cos^{2}\theta}$。
だから 1 つの値が分かれば残りも決まります。ただし、2 乗の式から値を取り出すときは $\pm$ の 2 通りが出てくるので、**$\theta$ が鋭角か鈍角か**（$\cos$ が正か負か）で符号を決めます。`,
      normal: R`与えられた値に応じて $\sin^{2}\theta+\cos^{2}\theta=1$ または $1+\tan^{2}\theta=\frac{1}{\cos^{2}\theta}$ から $\cos^{2}\theta$（または $\sin^{2}\theta$）を求め、鋭角・鈍角で符号を決めてから、$\tan\theta=\frac{\sin\theta}{\cos\theta}$ で残りを求めます。`,
      pro: R`符号は「$0\degree<\theta<180\degree$ で $\sin\theta>0$、$\cos\theta$ と $\tan\theta$ は同符号」で決まります。$\tan\theta$ が与えられたら直角三角形（底辺 1・高さ $\tan\theta$）をかくと速いです。`
    },
    compute(v) {
      const kind = v.kind, val = v.val, obtuse = v.ang === 'obtuse';
      let s, c, t;
      const one = sQ(Q(1));
      let special90 = false;
      if (kind === 'sin') {
        if (val.sign() <= 0) throw CE('0° < θ < 180° では sin θ は正の値です（0 より大きい値を入れてください）');
        if (val.cmp(1) > 0) throw CE('sin θ は 1 以下です（1 以下の値を入れてください）');
        if (val.eq(1)) special90 = true;
      } else if (kind === 'cos') {
        if (val.cmp(1) >= 0 || val.cmp(-1) <= 0) throw CE('0° < θ < 180° では、cos θ は −1 と 1 のあいだの値です（−1 < cos θ < 1）');
        if (val.isZero()) special90 = true;
        else if (!obtuse && val.sign() < 0) throw CE('鋭角では cos θ は正の値です。cos θ が負なら「鈍角」を選んでください');
        else if (obtuse && val.sign() > 0) throw CE('鈍角では cos θ は負の値です。cos θ が正なら「鋭角」を選んでください');
      } else {
        if (val.isZero()) throw CE('tan θ = 0 になるのは θ = 0°, 180° のときだけで、三角形の角としては使えません');
        if (!obtuse && val.sign() < 0) throw CE('鋭角では tan θ は正の値です。tan θ が負なら「鈍角」を選んでください');
        if (obtuse && val.sign() > 0) throw CE('鈍角では tan θ は負の値です。tan θ が正なら「鋭角」を選んでください');
      }
      const steps = [];
      const idStep = {
        t: '相互関係の公式を確認する',
        m: REL_FORM,
        n: R`この 3 つの式を使えば、1 つの値から残りの値が求められます。`,
        easy: R`単位円で考えると、点 $P(x,\ y)=(\cos\theta,\ \sin\theta)$ は半径 1 の円の周上にあるので $x^{2}+y^{2}=1$、つまり $\cos^{2}\theta+\sin^{2}\theta=1$ です。また $\tan\theta=\frac{y}{x}=\frac{\sin\theta}{\cos\theta}$。この 2 つから、3 つ目の $1+\tan^{2}\theta=\frac{1}{\cos^{2}\theta}$ も導けます（$\sin^{2}\theta+\cos^{2}\theta=1$ の両辺を $\cos^{2}\theta$ でわる）。`,
        pro: R`3 つの公式は「$\sin^{2}+\cos^{2}=1$ の両辺を $\cos^{2}$ でわると $\tan^{2}+1=\frac{1}{\cos^{2}}$」とつながっています。`
      };
      if (special90) {
        s = sQ(Q(1)); c = sQ(Q(0)); t = null;
        steps.push(idStep);
        steps.push({
          t: R`$\theta=90\degree$ の場合`,
          m: kind === 'sin' ? [R`\sin\theta = 1 \;\Rightarrow\; \cos^{2}\theta = 1 - 1^{2} = 0 \;\Rightarrow\; \cos\theta = 0`] : [R`\cos\theta = 0 \;\Rightarrow\; \sin^{2}\theta = 1 - 0^{2} = 1 \;\Rightarrow\; \sin\theta = 1`],
          n: R`このとき $\theta=90\degree$ で、鋭角でも鈍角でもありません。$\tan\theta=\frac{\sin\theta}{\cos\theta}$ は分母が 0 になるので**定義されません**。`,
          easy: R`単位円で $\sin\theta=1$ になるのは、$P$ が真上の点 $(0,\ 1)$ にあるとき、つまり $\theta=90\degree$ のときだけです。このとき $x=0$ なので、$\tan\theta=\frac{y}{x}$ は 0 でわる形になり、値が決まりません。`
        });
      } else if (kind === 'sin') {
        const c2 = Q(1).sub(val.mul(val)), cmag = sqrtQ(c2);
        s = sQ(val); c = obtuse ? sNeg(cmag) : cmag; t = sDiv(s, c);
        steps.push(idStep);
        steps.push({
          t: R`$\cos^{2}\theta$ を求める`,
          m: chain(R`\cos^{2}\theta`, [R`1 - \sin^{2}\theta`, '1 - ' + sq2(val), c2.tex()]),
          n: R`$\sin^{2}\theta+\cos^{2}\theta=1$ を $\cos^{2}\theta$ について解き、$\sin\theta=` + val.tex() + R`$ を代入します。`,
          easy: R`$\sin^{2}\theta+\cos^{2}\theta=1$ の $\sin^{2}\theta$ を右辺に移すと $\cos^{2}\theta=1-\sin^{2}\theta$。与えられた $\sin\theta$ を 2 乗して 1 から引くだけです。`
        });
        steps.push({
          t: R`$\cos\theta$ の符号を決めて値を求める`,
          m: [R`\cos\theta = \pm\sqrt{` + c2.tex() + R`} = \pm ` + sTex(cmag), R`\cos\theta = ` + sTex(c) + R`\quad (\text{` + (obtuse ? '鈍角' : '鋭角') + R`})`],
          n: R`$\cos^{2}\theta=` + c2.tex() + R`$ より $\cos\theta=\pm` + sTex(cmag) + R`$。` + (obtuse ? R`鈍角では $\cos\theta<0$ なので**負**の方をとります。` : R`鋭角では $\cos\theta>0$ なので**正**の方をとります。`),
          easy: R`2 乗して $` + c2.tex() + R`$ になる数は、正の数と負の数の 2 つがあります。どちらかは、角の種類で決めます。鋭角（$P$ が $y$ 軸の右側）なら $\cos\theta=x$ は正、鈍角（$P$ が左側）なら負です。` + (c2.n !== 1 || c2.d !== 1 ? R`根号の中は、$\sqrt{\frac{n}{d}}=\frac{\sqrt{nd}}{d}$ と分母を有理化し、$\sqrt{12}=2\sqrt{3}$ のように外に出せるものは外に出して簡単にします。` : '')
        });
        steps.push({
          t: R`$\tan\theta$ を求める`,
          m: chain(R`\tan\theta`, [R`\frac{\sin\theta}{\cos\theta}`, R`\frac{` + sTex(s) + '}{' + sTex(c) + '}', sTex(t)]),
          n: R`$\tan\theta=\frac{\sin\theta}{\cos\theta}$ に代入します。` + (t.m > 1 ? R`分母の根号は有理化します。` : ''),
          easy: R`$\tan\theta$ は $\sin\theta$ を $\cos\theta$ でわった値です。分数どうしのわり算は「ひっくり返してかける」で計算します。`,
          lv: 1
        });
      } else if (kind === 'cos') {
        const s2 = Q(1).sub(val.mul(val)), smag = sqrtQ(s2);
        c = sQ(val); s = smag; t = sDiv(s, c);
        steps.push(idStep);
        steps.push({
          t: R`$\sin^{2}\theta$ を求める`,
          m: chain(R`\sin^{2}\theta`, [R`1 - \cos^{2}\theta`, '1 - ' + sq2(val), s2.tex()]),
          n: R`$\sin^{2}\theta+\cos^{2}\theta=1$ を $\sin^{2}\theta$ について解き、$\cos\theta=` + val.tex() + R`$ を代入します。`,
          easy: R`$\sin^{2}\theta+\cos^{2}\theta=1$ の $\cos^{2}\theta$ を右辺に移すと $\sin^{2}\theta=1-\cos^{2}\theta$。与えられた $\cos\theta$ を 2 乗して 1 から引きます（負の値を 2 乗すると正になることに注意）。`
        });
        steps.push({
          t: R`$\sin\theta$ の値を求める（$\sin\theta>0$）`,
          m: [R`\sin\theta = \sqrt{` + s2.tex() + '} = ' + sTex(s)],
          n: R`$0\degree<\theta<180\degree$ では単位円の点 $P$ が $x$ 軸より上にあるので、$\sin\theta$ はつねに**正**です。したがって正の平方根をとります。` + (s.m > 1 ? R`根号は簡単にします。` : ''),
          easy: R`$\sin\theta$ は点 $P$ の高さ（$y$ 座標）です。$0\degree<\theta<180\degree$ では $P$ は $x$ 軸より上にあるので、$\sin\theta$ は必ず正。だから 2 乗の式から値を取り出すとき、$\sin\theta$ は正の方を選べば符号の迷いがありません。`
        });
        steps.push({
          t: R`$\tan\theta$ を求める`,
          m: chain(R`\tan\theta`, [R`\frac{\sin\theta}{\cos\theta}`, R`\frac{` + sTex(s) + '}{' + sTex(c) + '}', sTex(t)]),
          n: R`$\tan\theta=\frac{\sin\theta}{\cos\theta}$ に代入します。` + (t.m > 1 ? R`分母の根号は有理化します。` : ''),
          easy: R`$\tan\theta$ は $\sin\theta$ を $\cos\theta$ でわった値です。$\cos\theta$ が負（鈍角）のときは $\tan\theta$ も負になります。`
        });
      } else {
        const d2 = Q(1).add(val.mul(val)), cmag = sDiv(one, sqrtQ(d2));
        t = sQ(val); c = val.sign() > 0 ? cmag : sNeg(cmag); s = sMul(t, c);
        steps.push(idStep);
        steps.push({
          t: R`$\cos^{2}\theta$ を求める`,
          m: chain(R`\cos^{2}\theta`, [R`\frac{1}{1 + \tan^{2}\theta}`, R`\frac{1}{1 + ` + sq2(val) + '}', R`\frac{1}{` + d2.tex() + '}', Q(1).div(d2).tex()]),
          n: R`$1+\tan^{2}\theta=\frac{1}{\cos^{2}\theta}$ の逆数をとって、$\tan\theta=` + val.tex() + R`$ を代入します。`,
          easy: R`$1+\tan^{2}\theta=\frac{1}{\cos^{2}\theta}$ の両辺の逆数（ひっくり返した数）を考えると $\cos^{2}\theta=\frac{1}{1+\tan^{2}\theta}$。$\tan\theta$ から $\cos^{2}\theta$ が直接求まる便利な式です。`
        });
        steps.push({
          t: R`$\cos\theta$ の符号を決めて値を求める`,
          m: [R`\cos\theta = \pm\sqrt{` + Q(1).div(d2).tex() + R`} = \pm ` + sTex(cmag), R`\cos\theta = ` + sTex(c) + R`\quad (\text{` + (obtuse ? '鈍角' : '鋭角') + R`})`],
          n: obtuse ? R`鈍角では $\cos\theta<0$ なので**負**の方をとります（このとき $\tan\theta<0$ とも合っています）。` : R`鋭角では $\cos\theta>0$ なので**正**の方をとります。`,
          easy: R`2 乗して $` + Q(1).div(d2).tex() + R`$ になる数は正負の 2 つあります。鋭角なら $\cos\theta$ は正、鈍角なら負です。$\tan\theta=\frac{\sin\theta}{\cos\theta}$ で $\sin\theta$ は常に正なので、$\tan\theta$ と $\cos\theta$ の符号は同じになります。`
        });
        steps.push({
          t: R`$\sin\theta$ を求める`,
          m: chain(R`\sin\theta`, [R`\tan\theta \cdot \cos\theta`, sParen(t) + R` \cdot ` + sParen(c), sTex(s)]),
          n: R`$\tan\theta=\frac{\sin\theta}{\cos\theta}$ の両辺に $\cos\theta$ をかけて $\sin\theta=\tan\theta\cdot\cos\theta$ とします。`,
          easy: R`$\tan\theta=\frac{\sin\theta}{\cos\theta}$ は「$\sin\theta$ を $\cos\theta$ でわった値」なので、逆に $\tan\theta$ に $\cos\theta$ をかければ $\sin\theta$ に戻ります。`
        });
      }
      const thetaDeg = special90 ? 90 : Math.atan2(sVal(s), sVal(c)) / RAD;
      if (!special90) {
        steps.push({
          t: R`$\sin^{2}\theta+\cos^{2}\theta=1$ で検算する`,
          m: chain(R`\sin^{2}\theta + \cos^{2}\theta`, [sParenSq(s) + ' + ' + sParenSq(c), sSq(s).tex() + ' + ' + sSq(c).tex(), sSq(s).add(sSq(c)).tex()]),
          n: R`求めた $\sin\theta,\ \cos\theta$ を 2 乗して足すと 1 になります。符号を取り違えていても 2 乗では気づけないので、符号は「鋭角・鈍角」と見比べて確認します。`,
          lv: 2
        });
      }
      steps.push({
        t: R`$\theta$ のおよその大きさ`,
        m: R`\theta \approx ` + degTex(thetaDeg, 2),
        n: R`図の単位円の点 $P$ の位置（$\cos\theta=x,\ \sin\theta=y$）と合っているか、およその角度でも確かめられます（電卓の逆三角関数、または三角比の表）。`,
        lv: 2
      });
      const tTex = t == null ? R`\text{定義されない}` : sTex(t);
      const withApprox = (e) => (e.m > 1 ? sTex(e) + R` \approx ` + fmt(sVal(e)) : sTex(e));
      return {
        result: [
          { label: 'sin θ', tex: R`\sin\theta = ` + withApprox(s) },
          { label: 'cos θ', tex: R`\cos\theta = ` + withApprox(c) },
          { label: 'tan θ', tex: R`\tan\theta = ` + (t == null ? tTex : withApprox(t)) },
          { label: 'θ のおよその大きさ', tex: R`\theta \approx ` + degTex(thetaDeg, 2) }
        ],
        steps: steps,
        fig: unitFig(thetaDeg)
      };
    }
  });

  /* ================= 三角形まわりの共通部品 ================= */

  // 辺・角の入力チェック
  function needSide(q, name) {
    if (q.sign() <= 0) throw CE(name + ' は正の数を入力してください（辺の長さは 0 より大きい値です）');
  }
  function needAngle(x, name) {
    if (!(x > 0 && x < 180)) throw CE(name + ' は 0° より大きく 180° より小さい値を入力してください');
  }
  // 三角形の成立条件（各辺 < 他の 2 辺の和）。a, b, c は Q
  function needTriangle(a, b, c) {
    const chk = (x, y, z, nx, ny, nz) => {
      if (x.cmp(y.add(z)) >= 0) throw CE('三角形ができません: 辺 ' + nx + ' が他の 2 辺の和 ' + ny + ' + ' + nz + ' 以上です（どの辺も、他の 2 辺の和より短くなければなりません）');
    };
    chk(a, b, c, 'a', 'b', 'c'); chk(b, c, a, 'b', 'c', 'a'); chk(c, a, b, 'c', 'a', 'b');
  }
  const sinOf = (deg) => Math.sin(deg * RAD);
  const cosOf = (deg) => Math.cos(deg * RAD);
  // 値の表示: 厳密値（S 型）があればそれ、なければ近似値
  const valEq = (S, x) => (S ? ' = ' + sTex(S) + (S.m > 1 ? R` \approx ` + fmt(x) : '') : R` \approx ` + fmt(x));
  const eqS = (S, x) => (S ? ' = ' + sTex(S) : R` \approx ` + fmt(x));      // 「= 厳密値」または「≈ 近似値」
  const sinTex = (deg, ex) => (ex ? sTex(ex.s) : fmt(sinOf(deg)));        // 代入用の sin の値
  const cosTexV = (deg, ex) => (ex ? sTex(ex.c) : fmt(cosOf(deg)));
  const dg = (d) => (Number.isInteger(d) ? String(d) : fmt(d, 2)) + R`\degree`;
  const lenLabel = (name, q, v) => (q ? name + '=' + q.toString() : name + '≈' + fmt(v, 2));
  const angLabel = (d) => (Number.isInteger(d) ? String(d) : fmt(d, 1)) + '°';

  // 余弦定理の導出（共通の参考ステップ）
  const COS_DERIVE = {
    t: '（参考）余弦定理のみなもと',
    m: [
      R`CH = b\sin A,\qquad AH = b\cos A,\qquad BH = c - b\cos A`,
      R`\begin{aligned} a^{2} &= CH^{2} + BH^{2} \\ &= b^{2}\sin^{2}A + (c - b\cos A)^{2} \\ &= b^{2}(\sin^{2}A + \cos^{2}A) + c^{2} - 2bc\cos A \\ &= b^{2} + c^{2} - 2bc\cos A \end{aligned}`
    ],
    n: R`頂点 $C$ から辺 $AB$ に垂線 $CH$ をおろし、直角三角形 $BCH$ に三平方の定理を使います（$\sin^{2}A+\cos^{2}A=1$ を利用）。$A$ が鈍角のときも同じ結果になります。`,
    easy: R`三平方の定理 $a^{2}=b^{2}+c^{2}$ は直角三角形でしか使えません。そこで、頂点から垂線をおろして直角三角形をつくり、三角比で長さを表して三平方の定理を使います。$CH=b\sin A$、$AH=b\cos A$ と表せるので、$BH=c-b\cos A$ です。展開して整理すると、余弦定理の式がきれいに出てきます。`,
    lv: 3
  };

  /* ================= ia-sine-rule: 正弦定理 ================= */

  JK.registerCalc({
    id: 'ia-sine-rule',
    course: 'IA',
    unit: 'm-trig1',
    group: '図形と計量',
    title: '正弦定理（外接円の半径・辺の長さ）',
    desc: R`正弦定理 $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}=2R$ を使って、1 辺とその対角から外接円の半径 $R$ を、または 2 角と 1 辺から残りの辺を求めます。特別な角（30°・45°・60° など）は根号を使った正確な値で示します。`,
    form: R`\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R`,
    inputs: [
      { key: 'mode', label: '求めるもの', type: 'select', def: 'R', options: [['R', '外接円の半径 R（1 辺とその対角）'], ['side', '残りの辺（2 角と 1 辺）']] },
      { key: 'a', label: R`辺 $a$（角 $A$ の対辺）`, type: 'q', def: '6', max: 1000 },
      { key: 'A', label: R`角 $A$（度）`, type: 'num', def: '60', min: 0, max: 180 },
      { key: 'B', label: R`角 $B$（度）`, type: 'num', def: '45', min: 0, max: 180, show: (raw) => raw.mode === 'side' }
    ],
    examples: [
      { label: 'R: a=6, A=60°', v: { mode: 'R', a: '6', A: '60' } },
      { label: 'R: a=5, A=150°（鈍角）', v: { mode: 'R', a: '5', A: '150' } },
      { label: '辺: a=6, A=60°, B=45°', v: { mode: 'side', a: '6', A: '60', B: '45' } },
      { label: '辺: a=4, A=30°, B=60°', v: { mode: 'side', a: '4', A: '30', B: '60' } },
      { label: '辺: a=3, A=45°, B=105°', v: { mode: 'side', a: '3', A: '45', B: '105' } }
    ],
    intro: {
      easy: R`三角形の 3 つの頂点を通る円を**外接円**といい、その半径を $R$ と書きます。**正弦定理**は、三角形の「辺の長さ」と「向かい合う角の $\sin$」の比がどの辺でも同じで、その値が外接円の直径 $2R$ に等しい、という定理です。
$$\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}=2R$$
1 辺とその対角が分かれば外接円の半径 $R$ が求まり、2 つの角と 1 辺が分かれば、残りの辺も求まります。`,
      normal: R`「辺と向かい合う角の $\sin$ の組」を 2 つ使うのが基本です。角がすべて分かるなら、内角の和 $A+B+C=180\degree$ で残りの角を出してから使います。`,
      pro: R`$a=2R\sin A$ の形で覚えておくと速く、「角と対辺が 1 組分かる」ときは正弦定理、「2 辺と夾角」「3 辺」のときは余弦定理、と使い分けます。`
    },
    compute(v) {
      const a = v.a, A = v.A, side = v.mode === 'side', B = side ? v.B : 0;
      needSide(a, 'a'); needAngle(A, 'A');
      if (side) { needAngle(B, 'B'); if (A + B >= 180) throw CE('A + B が 180° 以上になっています（三角形の内角の和は 180° なので、A + B は 180° より小さくしてください）'); }
      const C = 180 - A - B;
      const exA = trigS(A), exB = side ? trigS(B) : null, exC = side ? trigS(C) : null;
      const sA = sinOf(A), twoRv = a.val() / sA, Rv = twoRv / 2;
      const twoRs = exA ? sDiv(sQ(a), exA.s) : null, Rs = twoRs ? sScale(twoRs, Q(1, 2)) : null;
      const steps = [];
      steps.push({
        t: '正弦定理を使う',
        m: R`\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R`,
        n: R`三角形 $ABC$ の外接円の半径を $R$ とすると、どの辺でも「**辺の長さ ÷ その対角の $\sin$**」が $2R$ に等しくなります。`,
        easy: R`**外接円**とは、三角形の 3 つの頂点をすべて通る円のことで、その半径が $R$ です。正弦定理は、「ある辺の長さを、向かい合う角の $\sin$ でわると、外接円の直径 $2R$ になる」という関係で、どの辺で計算しても同じ値になります。1 つの辺とその対角が分かれば $R$ が求まり、さらに $R$ を使って他の辺や角も求められます。`,
        pro: R`$a=2R\sin A$ の形で覚えておくと、辺と $R$ の変換が速くなります。`
      });
      if (side) {
        steps.push({
          t: '内角の和から残りの角を求める',
          m: R`C = 180\degree - A - B = 180\degree - ` + dg(A) + ' - ' + dg(B) + ' = ' + dg(C),
          n: R`三角形の内角の和は $180\degree$ です。`,
          easy: R`三角形の 3 つの角をたすと必ず $180\degree$ になります。2 つの角が分かっているので、残りの 1 つは $180\degree$ から引けば求まります。`
        });
      }
      const sinLines = [R`\sin ` + dg(A) + eqS(exA && exA.s, sA)];
      if (side) {
        sinLines.push(R`\sin ` + dg(B) + eqS(exB && exB.s, sinOf(B)));
        sinLines.push(R`\sin ` + dg(C) + eqS(exC && exC.s, sinOf(C)));
      }
      steps.push({
        t: R`$\sin$ の値を用意する`,
        m: sinLines,
        n: R`$30\degree,\ 45\degree,\ 60\degree$ など特別な角は、根号を使った正確な値を使います。そうでない角は近似値（小数第 4 位まで）で計算するので、答えも近似値になります。`,
        easy: R`$\sin$ の値は、「三角比の値」の計算機（または三角定規の辺の比）で調べられます。$\sin30\degree=\frac{1}{2},\ \sin45\degree=\frac{\sqrt{2}}{2},\ \sin60\degree=\frac{\sqrt{3}}{2}$ は暗記しておくと便利です。鈍角の $\sin$ は $\sin(180\degree-\theta)=\sin\theta$ で鋭角に直せます。`
      });
      // 2R
      const l2 = [R`2R = \frac{a}{\sin A}`, R`2R = \frac{` + a.tex() + '}{' + (exA ? sTex(exA.s) : fmt(sA)) + '}'];
      if (twoRs) {
        if (exA.s.m > 1) l2.push(R`2R = \frac{` + a.div(exA.s.r).tex() + R`}{\sqrt{` + exA.s.m + '}}');
        l2.push('2R = ' + sTex(twoRs));
      } else l2.push(R`2R \approx ` + fmt(twoRv));
      steps.push({
        t: R`$2R=\frac{a}{\sin A}$ を計算する`,
        m: l2,
        n: R`辺 $a=` + a.tex() + R`$ と、その対角 $A=` + dg(A) + R`$ から $2R$ を求めます。` + (twoRs && exA.s.m > 1 ? R`分母に根号が残るときは、分母と分子に同じ根号をかけて有理化します。` : ''),
        easy: R`分母が分数（$\frac{\sqrt{3}}{2}$ など）のときは、「分数でわる＝逆数をかける」で計算します。分母に根号が残ったときは、分母と分子に同じ根号をかけて有理化します。`
      });
      if (!side) {
        steps.push({
          t: '外接円の半径 R',
          m: [chain('R', [R`\frac{2R}{2}`, Rs ? sTex(Rs) : R`\approx ` + fmt(Rv)]), R`\text{外接円の直径 } 2R` + eqS(twoRs, twoRv)],
          n: R`$2R$ を 2 でわって、外接円の半径 $R$ が求まりました。` + (Rs && Rs.m > 1 ? R`（近似値は $R\approx ` + fmt(Rv) + R`$）` : ''),
          easy: R`$2R$ は外接円の「直径」にあたるので、半径 $R$ はその半分です。`,
          pro: R`$A=30\degree$ なら $R=a$、$A=90\degree$ なら $R=\frac{a}{2}$ など、$\sin A$ がきれいな値のときは暗算で出せます。`
        });
        steps.push({
          t: '検算: 2R sin A が a に戻るか',
          m: twoRs ? chain(R`2R\sin A`, [sParen(twoRs) + R` \cdot ` + sParen(exA.s), sTex(sMul(twoRs, exA.s))]) : R`2R\sin A \approx ` + fmt(twoRv * sA),
          n: R`$a=2R\sin A$ に戻して、もとの $a=` + a.tex() + R`$ と一致することを確かめます。`,
          lv: 2
        });
      } else {
        const bv = twoRv * sinOf(B), cv = twoRv * sinOf(C);
        const bS = twoRs && exB ? sMul(twoRs, exB.s) : null, cS = twoRs && exC ? sMul(twoRs, exC.s) : null;
        const part = (nm, ang, ex, S, val) => ({
          t: R`辺 $` + nm + R`$ を求める（$` + nm + R`=2R\sin ` + nm.toUpperCase() + R`$）`,
          m: chain(nm, [R`2R\sin ` + nm.toUpperCase(), (twoRs ? sParen(twoRs) : fmt(twoRv)) + R` \cdot ` + (ex ? sParen(ex.s) : fmt(sinOf(ang))), S ? sTex(S) : R`\approx ` + fmt(val)]),
          n: R`正弦定理 $\frac{` + nm + R`}{\sin ` + nm.toUpperCase() + R`}=2R$ より $` + nm + R`=2R\sin ` + nm.toUpperCase() + R`$ です。` + (S && S.m > 1 ? R`（近似値は $` + nm + R`\approx ` + fmt(val) + R`$）` : (S ? '' : R`$\sin ` + nm.toUpperCase() + R`$ が近似値なので答えも近似値です。`)),
          easy: R`正弦定理は $\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$ という比の形なので、求めたい辺の「対角の $\sin$」をかければ、その辺の長さになります（$2R$ はどの辺でも共通の値です）。`
        });
        const sb = part('b', B, exB, bS, bv);
        sb.pro = R`$b=\frac{a\sin B}{\sin A}$ と直接計算してもかまいません（$2R$ を経由すると、あとで $c$ を出すときにも使えて楽です）。`;
        steps.push(sb);
        steps.push(part('c', C, exC, cS, cv));
        const ord = [['A', A, 'a', a.val()], ['B', B, 'b', bv], ['C', C, 'c', cv]].sort((p, q) => p[1] - q[1]);
        steps.push({
          t: '検算: 大きい角の対辺は長い',
          m: [ord.map((e) => e[0]).join(' < ') + R`\ \ \Rightarrow\ \ ` + ord.map((e) => e[2]).join(' < '), ord.map((e) => e[2] + (e[2] === 'a' ? '=' + a.tex() : R`\approx ` + fmt(e[3], 3))).join(' < ')],
          n: R`三角形では「大きい角の対辺ほど長い」ので、角の大小と辺の大小が一致しているか確かめます。`,
          lv: 2
        });
      }
      steps.push({
        t: '（参考）正弦定理のみなもと',
        m: R`a = 2R\sin A`,
        n: R`外接円で、頂点 $B$ を通る直径 $BA'$ を引きます。$\angle BCA'=90\degree$（直径に対する円周角）で、$\angle BA'C=\angle A$（同じ弧 $BC$ に対する円周角）なので、直角三角形 $BCA'$ で $BC=BA'\sin A$、つまり $a=2R\sin A$ となります（$A$ が鈍角のときは $\angle BA'C=180\degree-A$ ですが、$\sin$ の値は同じです）。`,
        easy: R`円周角の定理（同じ弧に対する円周角は等しく、直径に対する円周角は直角）を使います。外接円の直径を 1 本引くと、辺 $a$ を 1 辺にもつ直角三角形ができます。その斜辺は直径 $2R$ なので、「対辺 ＝ 斜辺 × $\sin$」から $a=2R\sin A$ となり、正弦定理が出てきます。`,
        lv: 3
      });
      // 図
      let P, O, sides, angles;
      if (!side) {
        O = [0, 0];
        P = { A: [0, Rv], B: [-Rv * sA, -Rv * cosOf(A)], C: [Rv * sA, -Rv * cosOf(A)] };
        sides = { a: lenLabel('a', a, a.val()) };
        angles = { A: angLabel(A) };
      } else {
        const cv = twoRv * sinOf(C);
        P = { A: [cv * cosOf(B), cv * sinOf(B)], B: [0, 0], C: [a.val(), 0] };
        O = [a.val() / 2, Rv * cosOf(A)];
        sides = { a: lenLabel('a', a, a.val()), b: lenLabel('b', null, twoRv * sinOf(B)), c: lenLabel('c', null, cv) };
        angles = { A: angLabel(A), B: angLabel(B), C: angLabel(C) };
      }
      const fig = triFigure(P, {
        circles: [{ cx: O[0], cy: O[1], r: Rv, cls: 'c2', dash: true }],
        sides: sides, angles: angles,
        extra: (d, T, sc) => {
          const o = T(O), c = T(P.C);
          d.line(o[0], o[1], c[0], c[1], { cls: 'c2', dash: true, w: 1.2 });
          d.dot(o[0], o[1], { cls: 'c2', r: 2.5 });
          d.text((o[0] + c[0]) / 2 + 2, (o[1] + c[1]) / 2 - 5, 'R', { cls: 'c2', size: 12, italic: true });
        }
      });
      const results = side
        ? [
          { label: '角 C', tex: R`C = ` + dg(C) },
          { label: '辺 b', tex: 'b' + valEq(twoRs && exB ? sMul(twoRs, exB.s) : null, twoRv * sinOf(B)) },
          { label: '辺 c', tex: 'c' + valEq(twoRs && exC ? sMul(twoRs, exC.s) : null, twoRv * sinOf(C)) },
          { label: '外接円の半径 R', tex: 'R' + valEq(Rs, Rv) }
        ]
        : [
          { label: '外接円の半径 R', tex: 'R' + valEq(Rs, Rv) },
          { label: '外接円の直径 2R', tex: '2R' + valEq(twoRs, twoRv) },
          { label: 'sin A', tex: R`\sin A` + valEq(exA ? exA.s : null, sA) }
        ];
      return { result: results, steps: steps, fig: fig };
    }
  });

  /* ================= ia-cosine-rule: 余弦定理 ================= */

  // 3 辺（Q）から角 A, B, C の cos（Q）
  function cosesOf(a, b, c) {
    const two = (x, y) => x.mul(y).mul(2);
    return {
      A: b.mul(b).add(c.mul(c)).sub(a.mul(a)).div(two(b, c)),
      B: c.mul(c).add(a.mul(a)).sub(b.mul(b)).div(two(c, a)),
      C: a.mul(a).add(b.mul(b)).sub(c.mul(c)).div(two(a, b))
    };
  }
  // cos（Q）から角の厳密な表示（60°, 90°, 120° になるとき）または近似
  function angleFromCos(cq) {
    const x = Math.max(-1, Math.min(1, cq.val()));
    const d = Math.acos(x) / RAD;
    const exact = cq.eq(Q(1, 2)) ? 60 : (cq.isZero() ? 90 : (cq.eq(Q(-1, 2)) ? 120 : null));
    return { deg: exact != null ? exact : d, exact: exact != null };
  }
  const angEq = (an) => (an.exact ? ' = ' + dg(an.deg) : R` \approx ` + dg(an.deg));

  JK.registerCalc({
    id: 'ia-cosine-rule',
    course: 'IA',
    unit: 'm-trig1',
    group: '図形と計量',
    title: '余弦定理（辺・角の長さ）',
    desc: R`余弦定理 $a^{2}=b^{2}+c^{2}-2bc\cos A$ を使って、2 辺とその間の角（夾角）から残りの辺を、または 3 辺から角を求めます。三角形の成立条件も確かめます。`,
    form: [R`a^{2} = b^{2} + c^{2} - 2bc\cos A`, R`\cos A = \frac{b^{2} + c^{2} - a^{2}}{2bc}`],
    inputs: [
      { key: 'mode', label: '与えられた条件', type: 'select', def: 'sas', options: [['sas', '2 辺とその間の角 → 残りの辺'], ['sss', '3 辺 → 角']] },
      { key: 'a', label: R`辺 $a$`, type: 'q', def: '7', max: 1000, show: (raw) => raw.mode === 'sss' },
      { key: 'b', label: R`辺 $b$`, type: 'q', def: '5', max: 1000 },
      { key: 'c', label: R`辺 $c$`, type: 'q', def: '8', max: 1000 },
      { key: 'A', label: R`角 $A$（辺 $b,\ c$ の間の角・度）`, type: 'num', def: '60', min: 0, max: 180, show: (raw) => raw.mode === 'sas' }
    ],
    examples: [
      { label: '2 辺夾角: b=5, c=8, A=60°', v: { mode: 'sas', b: '5', c: '8', A: '60' } },
      { label: '2 辺夾角: b=3, c=5, A=120°', v: { mode: 'sas', b: '3', c: '5', A: '120' } },
      { label: '2 辺夾角: b=4, c=3, A=45°', v: { mode: 'sas', b: '4', c: '3', A: '45' } },
      { label: '3 辺: 7, 5, 8', v: { mode: 'sss', a: '7', b: '5', c: '8' } },
      { label: '3 辺: 3, 4, 5（直角）', v: { mode: 'sss', a: '5', b: '3', c: '4' } },
      { label: '3 辺: 7, 3, 5（120°）', v: { mode: 'sss', a: '7', b: '3', c: '5' } }
    ],
    intro: {
      easy: R`直角三角形なら三平方の定理 $a^{2}=b^{2}+c^{2}$ が使えますが、直角でない三角形では使えません。そこで、その続きとして使えるのが**余弦定理**です。
$$a^{2}=b^{2}+c^{2}-2bc\cos A$$
「**2 辺とその間の角**」が分かれば残りの辺の長さが決まり、逆に「**3 辺**」が分かれば角が決まります（$\cos A=\frac{b^{2}+c^{2}-a^{2}}{2bc}$）。$A=90\degree$ のときは $\cos A=0$ なので、三平方の定理にもどります。`,
      normal: R`2 辺と夾角 → 第 3 辺は $a^{2}=b^{2}+c^{2}-2bc\cos A$、3 辺 → 角は $\cos A=\frac{b^{2}+c^{2}-a^{2}}{2bc}$。角を求めたら $\cos$ の符号で鋭角・鈍角を判断できます（$\cos A>0$ なら鋭角、$<0$ なら鈍角）。`,
      pro: R`$\cos A$ の分子 $b^{2}+c^{2}-a^{2}$ の符号だけで、最大の辺の対角が鋭角・直角・鈍角のどれかが分かります（三角形の形の判別の定石）。`
    },
    compute(v) {
      return v.mode === 'sss' ? cosSSS(v) : cosSAS(v);
    }
  });

  function cosSAS(v) {
    const b = v.b, c = v.c, A = v.A;
    needSide(b, 'b'); needSide(c, 'c'); needAngle(A, 'A');
    const ex = trigS(A), cA = cosOf(A);
    const b2 = b.mul(b), c2 = c.mul(c), bc2 = b.mul(c).mul(2);
    const sumSq = b2.add(c2);
    let a2Q = null, aS = null, a2Tex;                      // 第 3 辺の 2 乗（Q のとき）
    const a2v = sumSq.val() - bc2.val() * cA;
    if (ex && ex.c.m === 1) {
      a2Q = sumSq.sub(bc2.mul(ex.c.r));
      aS = sqrtQ(a2Q);
      a2Tex = a2Q.tex();
    } else if (ex) {                                       // cos A = r√m（m > 1）: a² = (b²+c²) + k√m
      const k = bc2.mul(ex.c.r).neg();
      a2Tex = sumSq.tex() + (k.sign() < 0 ? ' - ' : ' + ') + sTex({ r: k.abs(), m: ex.c.m });
    }
    const av = Math.sqrt(Math.max(a2v, 0));
    if (!(av > 0)) throw CE('この値では第 3 辺が 0 以下になり、三角形ができません');
    const steps = [];
    steps.push({
      t: '余弦定理を使う',
      m: R`a^{2} = b^{2} + c^{2} - 2bc\cos A`,
      n: R`2 辺 $b=` + b.tex() + R`,\ c=` + c.tex() + R`$ とその間の角 $A=` + dg(A) + R`$ が分かっているので、残りの辺 $a$ は余弦定理で求められます。`,
      easy: R`**余弦定理**は、三平方の定理を直角でない三角形にも使えるように広げたものです。直角のとき $\cos90\degree=0$ なので最後の項が消えて、三平方の定理 $a^{2}=b^{2}+c^{2}$ にもどります。「**2 辺とその間の角**」が分かれば、残りの辺の長さが決まります。`,
      pro: R`夾角が $60\degree$ なら $a^{2}=b^{2}+c^{2}-bc$、$120\degree$ なら $a^{2}=b^{2}+c^{2}+bc$ と暗算で書けます。`
    });
    steps.push({
      t: R`$\cos A$ の値を調べる`,
      m: R`\cos ` + dg(A) + eqS(ex && ex.c, cA),
      n: ex ? R`$` + dg(A) + R`$ は特別な角なので、正確な値を使います。` + (A > 90 ? R`鈍角なので $\cos A$ は負になります。` : '') : R`$` + dg(A) + R`$ は特別な角ではないので、近似値（小数第 4 位まで）を使い、答えも近似値になります。`,
      easy: R`$\cos60\degree=\frac{1}{2},\ \cos45\degree=\frac{\sqrt{2}}{2},\ \cos30\degree=\frac{\sqrt{3}}{2}$ などは「三角比の値」の計算機で確認できます。鈍角の $\cos$ は $\cos(180\degree-\theta)=-\cos\theta$ で、負の値になります。`
    });
    const termTex = 2 + R` \cdot ` + b.tex() + R` \cdot ` + c.tex() + R` \cdot ` + (ex ? sParen(ex.c) : fmt(cA));
    const sub = sq2(b) + ' + ' + sq2(c) + ' - ' + termTex;
    let lines;
    if (a2Q) lines = [R`a^{2}`, sub, sumSq.tex() + ' ' + U.signed(bc2.mul(ex.c.r).neg()), a2Q.tex()];
    else if (a2Tex) lines = [R`a^{2}`, sub, a2Tex];
    else lines = [R`a^{2}`, sub, R`\approx ` + fmt(a2v)];
    steps.push({
      t: R`代入して $a^{2}$ を求める`,
      m: chain(lines[0], lines.slice(1)),
      n: R`$b^{2}=` + b2.tex() + R`,\ c^{2}=` + c2.tex() + R`$、$2bc\cos A$ を計算して引きます。` + (a2Q ? '' : (ex ? R`$\cos A$ に根号が含まれるので、$a^{2}$ も根号を含む式になります。` : '')),
      easy: R`$b,\ c,\ \cos A$ の値を式にそのまま入れて計算します。かけ算は足し引きより先に計算すること、$\cos A$ が負のときは「引く（−）」が「足す（＋）」になることに気をつけます。`
    });
    steps.push({
      t: R`$a$ を求める（$a>0$）`,
      m: aS ? chain('a', [R`\sqrt{` + a2Tex + '}', sTex(aS)]) : (a2Tex ? chain('a', [R`\sqrt{` + a2Tex + '}', R`\approx ` + fmt(av)]) : R`a \approx ` + fmt(av)),
      n: R`辺の長さは正なので、$a^{2}$ の正の平方根をとります。` + (aS && aS.m > 1 ? R`（近似値は $a\approx ` + fmt(av) + R`$）` : '') + (!aS ? R`根号の中が簡単にならないときは、近似値で答えます。` : ''),
      easy: R`$a^{2}$ が分かったら、平方根をとって $a$ にします。長さなので正の方だけです。`
    });
    // 成立条件・残りの角
    const bv = b.val(), cv = c.val();
    steps.push({
      t: '三角形の成立条件を確かめる',
      m: R`|b - c| < a < b + c \;:\quad ` + fmt(Math.abs(bv - cv), 3) + ' < ' + (aS ? sTex(aS) : fmt(av, 3)) + ' < ' + fmt(bv + cv, 3),
      n: R`3 辺が三角形をつくるには、どの辺も他の 2 辺の和より短く、差より長くなければなりません。夾角が $0\degree<A<180\degree$ なら、余弦定理で求めた $a$ は必ずこの条件を満たします。`,
      lv: 2
    });
    const cB = (a2v + c.val() * c.val() - bv * bv) / (2 * av * cv), cC = (a2v + bv * bv - cv * cv) / (2 * av * bv);
    const Bd = Math.acos(Math.max(-1, Math.min(1, cB))) / RAD, Cd = 180 - A - Bd;
    steps.push({
      t: '残りの角 B, C も求める',
      m: [R`\cos B = \frac{a^{2} + c^{2} - b^{2}}{2ac} \approx ` + fmt(cB), R`B \approx ` + dg(Bd), R`C = 180\degree - A - B \approx ` + dg(Cd)],
      n: R`余弦定理を「角を求める形」にして $\cos B$ を出し、$B$ を求めます。$C$ は内角の和から求めます。角度は近似値です。`,
      lv: 2
    });
    steps.push(COS_DERIVE);
    const sidesLab = { a: lenLabel('a', aS && aS.m === 1 ? aS.r : null, av), b: lenLabel('b', b, bv), c: lenLabel('c', c, cv) };
    const fig = triFigure({ A: [0, 0], B: [cv, 0], C: [bv * cA, bv * sinOf(A)] }, {
      sides: sidesLab, angles: { A: angLabel(A), B: angLabel(Bd), C: angLabel(Cd) }
    });
    return {
      result: [
        { label: '第 3 辺 a', tex: aS ? 'a' + valEq(aS, av) : (a2Tex ? R`a = \sqrt{` + a2Tex + R`} \approx ` + fmt(av) : R`a \approx ` + fmt(av)) },
        { label: '第 3 辺 a の 2 乗', tex: 'a^{2}' + (a2Tex ? ' = ' + a2Tex : R` \approx ` + fmt(a2v)) },
        { label: '角 B', tex: 'B' + R` \approx ` + dg(Bd) },
        { label: '角 C', tex: 'C' + R` \approx ` + dg(Cd) }
      ],
      steps: steps,
      fig: fig
    };
  }

  function cosSSS(v) {
    const a = v.a, b = v.b, c = v.c;
    needSide(a, 'a'); needSide(b, 'b'); needSide(c, 'c');
    needTriangle(a, b, c);
    const cs = cosesOf(a, b, c);
    const an = { A: angleFromCos(cs.A), B: angleFromCos(cs.B), C: angleFromCos(cs.C) };
    const names = ['A', 'B', 'C'];
    const sideOf = { A: [a, b, c], B: [b, c, a], C: [c, a, b] };     // [対辺, 隣辺 1, 隣辺 2]
    const steps = [];
    steps.push({
      t: '三角形の成立条件を確かめる',
      m: [R`a < b + c:\quad ` + a.tex() + ' < ' + b.add(c).tex(), R`b < c + a:\quad ` + b.tex() + ' < ' + c.add(a).tex(), R`c < a + b:\quad ` + c.tex() + ' < ' + a.add(b).tex()],
      n: R`3 つの辺が三角形をつくるには、**どの辺も他の 2 辺の和より短い**ことが必要です。3 つとも成り立っているので、この 3 辺から三角形がつくれます。`,
      easy: R`三角形の 2 辺の和は、残りの 1 辺より必ず長くなります（遠回りした道のほうが長いのと同じです）。たとえば 3, 4, 10 の棒では三角形はつくれません（$3+4<10$）。まずこの確認をしてから角を求めます。`
    });
    steps.push({
      t: '余弦定理（角を求める形）',
      m: [R`\cos A = \frac{b^{2} + c^{2} - a^{2}}{2bc}`, R`\cos B = \frac{c^{2} + a^{2} - b^{2}}{2ca}`, R`\cos C = \frac{a^{2} + b^{2} - c^{2}}{2ab}`],
      n: R`余弦定理 $a^{2}=b^{2}+c^{2}-2bc\cos A$ を $\cos A$ について解いた形です。3 辺が分かっているので、これで 3 つの角が求まります。`,
      easy: R`余弦定理を「$\cos A=\ \cdots$」の形に直しておくと、3 辺から角を求められます。分子の「**求めたい角の対辺の 2 乗を引く**」ところがポイントで、$A$ なら $a^{2}$ を引きます。`,
      pro: R`分子は「求める角をはさむ 2 辺の 2 乗の和 − 対辺の 2 乗」、分母は「はさむ 2 辺の積の 2 倍」と覚えます。`
    });
    const lineFor = (nm) => {
      const x = sideOf[nm][0], y = sideOf[nm][1], z = sideOf[nm][2];
      const num = y.mul(y).add(z.mul(z)).sub(x.mul(x)), den = y.mul(z).mul(2);
      const raw = (num.sign() < 0 ? '-' : '') + R`\frac{` + num.abs().tex() + '}{' + den.tex() + '}';
      return [
        R`\cos ` + nm + R` = \frac{` + sq2(y) + ' + ' + sq2(z) + ' - ' + sq2(x) + R`}{2 \cdot ` + y.tex() + R` \cdot ` + z.tex() + '}',
        R`\cos ` + nm + ' = ' + raw + (raw !== cs[nm].tex() ? ' = ' + cs[nm].tex() : '')
      ];
    };
    steps.push({
      t: R`$\cos A,\ \cos B,\ \cos C$ を計算する`,
      m: [].concat(lineFor('A'), lineFor('B'), lineFor('C')),
      n: R`それぞれ分子・分母を計算して約分します。値が $\frac{1}{2},\ 0,\ -\frac{1}{2}$ のときは $60\degree,\ 90\degree,\ 120\degree$ と分かります。`,
      easy: R`3 辺の値をそのまま代入して、分数を計算します。分子が負なら $\cos$ も負で、その角は鈍角です。計算ミスを防ぐため、2 乗の値を先にすべて出しておくと楽です（$a^{2}=` + a.mul(a).tex() + R`,\ b^{2}=` + b.mul(b).tex() + R`,\ c^{2}=` + c.mul(c).tex() + R`$）。`
    });
    steps.push({
      t: '角の大きさを求める',
      m: names.map((nm) => R`\cos ` + nm + ' = ' + cs[nm].tex() + R` \;\Rightarrow\; ` + nm + angEq(an[nm])),
      n: R`$\cos A=\frac{1}{2}$ のように三角定規の値になるときは正確な角（$60\degree$ など）、そうでないときは三角比の表や電卓（逆三角関数 $\cos^{-1}$）による近似値です。`,
      easy: R`$\cos$ の値から角度を知るには、$\cos60\degree=\frac{1}{2}$ のように覚えている値を逆にたどるか、電卓の「$\cos^{-1}$」キー（逆三角関数）を使います。きれいな値でないときは、近似値で答えます。`
    });
    const sumD = an.A.deg + an.B.deg + an.C.deg;
    steps.push({
      t: R`内角の和 $180\degree$ で検算する`,
      m: R`A + B + C \approx ` + fmt(an.A.deg, 2) + ' + ' + fmt(an.B.deg, 2) + ' + ' + fmt(an.C.deg, 2) + R` = ` + fmt(sumD, 2) + R`\degree`,
      n: R`3 つの角の和が $180\degree$ になれば、計算が合っています。`,
      lv: 2
    });
    // 三角形の形
    const big = [['a', a, b, c], ['b', b, c, a], ['c', c, a, b]].sort((p, q) => q[1].cmp(p[1]))[0];
    const lhs = big[1].mul(big[1]), rhs = big[2].mul(big[2]).add(big[3].mul(big[3]));
    const kind = lhs.cmp(rhs) < 0 ? '鋭角三角形' : (lhs.cmp(rhs) === 0 ? '直角三角形' : '鈍角三角形');
    const rel = lhs.cmp(rhs) < 0 ? '<' : (lhs.cmp(rhs) === 0 ? '=' : '>');
    steps.push({
      t: '三角形の形（鋭角・直角・鈍角）',
      m: [
        R`\text{最大の辺: } ` + big[0] + ' = ' + big[1].tex(),
        big[0] + '^{2} = ' + lhs.tex() + ' ' + rel + ' ' + rhs.tex() + ' = ' + sq2(big[2]) + ' + ' + sq2(big[3]) + R` \;\Rightarrow\; \text{` + kind + '}'
      ],
      n: R`最大の辺 $` + big[0] + R`$ の対角が最大の角です。$` + big[0] + R`^{2}$ と他の 2 辺の 2 乗の和を比べると、**` + kind + R`**と分かります（$<$: 鋭角、$=$: 直角、$>$: 鈍角）。`,
      lv: 2
    });
    steps.push(COS_DERIVE);
    const side = (nm, q) => lenLabel(nm, q, q.val());
    const P = triFromSides(a.val(), b.val(), c.val());
    const fig = triFigure(P, {
      sides: { a: side('a', a), b: side('b', b), c: side('c', c) },
      angles: { A: angLabel(an.A.deg), B: angLabel(an.B.deg), C: angLabel(an.C.deg) }
    });
    return {
      result: [
        { label: '角 A', tex: 'A' + angEq(an.A) },
        { label: '角 B', tex: 'B' + angEq(an.B) },
        { label: '角 C', tex: 'C' + angEq(an.C) },
        { label: '三角形の形', tex: R`\text{` + kind + '}' }
      ],
      steps: steps,
      fig: fig
    };
  }

  /* ================= ia-tri-area: 三角形の面積と内接円 ================= */

  // 内接円（三角形は B=(0,0), C=(a,0)）の図。r は内接円の半径、sides はラベル
  function areaFig(a, b, c, r, sides, angles) {
    const P = triFromSides(a, b, c);
    const I = [(a * P.A[0] + b * P.B[0] + c * P.C[0]) / (a + b + c), (a * P.A[1] + b * P.B[1] + c * P.C[1]) / (a + b + c)];
    return triFigure(P, {
      circles: [{ cx: I[0], cy: I[1], r: r, cls: 'c1' }],
      sides: sides, angles: angles,
      extra: (d, T, sc) => {
        const i = T(I), f = T([I[0], 0]);
        d.line(i[0], i[1], f[0], f[1], { cls: 'c1', dash: true, w: 1.2 });
        d.dot(i[0], i[1], { cls: 'c1', r: 2.5 });
        d.text(i[0] + 7, (i[1] + f[1]) / 2 + 4, 'r', { cls: 'c1', size: 12, italic: true });
      }
    });
  }

  const AREA_INSCRIBE = {
    t: R`内接円の半径の公式 $S=\frac{1}{2}r(a+b+c)$`,
    m: [R`S = \frac{1}{2}r(a + b + c)`, R`r = \frac{2S}{a + b + c}`],
    n: R`三角形の 3 辺すべてに接する円を**内接円**といい、その半径を $r$ とします。内接円の中心 $I$ から 3 辺に垂線を引くと、どれも長さ $r$ で、三角形 $ABC$ は 3 つの三角形 $IBC,\ ICA,\ IAB$ に分かれます。それらの面積の和が $S$ なので、上の式が成り立ちます。`,
    easy: R`**内接円**は、三角形の中にぴったり入る円で、3 つの辺すべてに接します。円の中心を三角形の 3 つの頂点と結ぶと、三角形は 3 つの小さな三角形に分かれます。どの小さな三角形も、底辺が元の三角形の辺（$a,\ b,\ c$）、高さがすべて内接円の半径 $r$ なので、面積は $\frac{1}{2}ra,\ \frac{1}{2}rb,\ \frac{1}{2}rc$。その合計が $S$ ですから $S=\frac{1}{2}r(a+b+c)$、よって $r=\frac{2S}{a+b+c}$ です。`,
    pro: R`$r=\frac{2S}{a+b+c}$ は入試頻出です。$S$ が先に分かるとき（ヘロンの公式、$\frac{1}{2}bc\sin A$）はこの式で一発。直角三角形なら $r=\frac{b+c-a}{2}$（$a$ が斜辺）も使えます。`
  };

  JK.registerCalc({
    id: 'ia-tri-area',
    course: 'IA',
    unit: 'm-trig1',
    group: '図形と計量',
    title: '三角形の面積と内接円の半径',
    desc: R`2 辺とその間の角（$S=\frac{1}{2}bc\sin A$）、または 3 辺（ヘロンの公式）から三角形の面積 $S$ を求め、内接円の半径 $r=\frac{2S}{a+b+c}$ まで計算します。`,
    form: [R`S = \frac{1}{2}bc\sin A`, R`S = \sqrt{s(s-a)(s-b)(s-c)}\ \left(s = \frac{a+b+c}{2}\right)`, R`r = \frac{2S}{a + b + c}`],
    inputs: [
      { key: 'mode', label: '与えられた条件', type: 'select', def: 'sas', options: [['sas', '2 辺とその間の角'], ['heron', '3 辺（ヘロンの公式）']] },
      { key: 'a', label: R`辺 $a$`, type: 'q', def: '7', max: 1000, show: (raw) => raw.mode === 'heron' },
      { key: 'b', label: R`辺 $b$`, type: 'q', def: '5', max: 1000 },
      { key: 'c', label: R`辺 $c$`, type: 'q', def: '8', max: 1000 },
      { key: 'A', label: R`角 $A$（辺 $b,\ c$ の間の角・度）`, type: 'num', def: '60', min: 0, max: 180, show: (raw) => raw.mode === 'sas' }
    ],
    examples: [
      { label: '2 辺夾角: b=5, c=8, A=60°', v: { mode: 'sas', b: '5', c: '8', A: '60' } },
      { label: '2 辺夾角: b=3, c=5, A=120°', v: { mode: 'sas', b: '3', c: '5', A: '120' } },
      { label: '2 辺夾角: b=4, c=6, A=45°', v: { mode: 'sas', b: '4', c: '6', A: '45' } },
      { label: 'ヘロン: 7, 5, 8', v: { mode: 'heron', a: '7', b: '5', c: '8' } },
      { label: 'ヘロン: 13, 14, 15', v: { mode: 'heron', a: '13', b: '14', c: '15' } },
      { label: 'ヘロン: 4, 5, 6', v: { mode: 'heron', a: '4', b: '5', c: '6' } }
    ],
    intro: {
      easy: R`三角形の面積は「底辺 × 高さ ÷ 2」ですが、高さが分からないことがよくあります。そのときは次の 2 通りがあります。
①**2 辺とその間の角**が分かるとき: 高さは $b\sin A$ と表せるので、$S=\frac{1}{2}bc\sin A$。
②**3 辺**が分かるとき: **ヘロンの公式** $S=\sqrt{s(s-a)(s-b)(s-c)}$（$s$ は 3 辺の和の半分）。
面積が分かれば、三角形の中にぴったり入る円（**内接円**）の半径 $r$ も、$S=\frac{1}{2}r(a+b+c)$ から $r=\frac{2S}{a+b+c}$ と求められます。`,
      normal: R`$S=\frac{1}{2}bc\sin A$（2 辺夾角）、$S=\sqrt{s(s-a)(s-b)(s-c)}$（3 辺）のどちらかで面積を出し、$r=\frac{2S}{a+b+c}$ で内接円の半径を求めます。2 辺夾角のときは余弦定理で第 3 辺も出します。`,
      pro: R`3 辺から $S$ を出すときは、$\cos A$ を経由するよりヘロンの公式が速いです。外接円の半径は $R=\frac{abc}{4S}$（「図形の性質」の計算機）で、$S$ から $r$ と $R$ の両方がすぐ求まります。`
    },
    compute(v) {
      return v.mode === 'heron' ? areaHeron(v) : areaSAS(v);
    }
  });

  function areaSAS(v) {
    const b = v.b, c = v.c, A = v.A;
    needSide(b, 'b'); needSide(c, 'c'); needAngle(A, 'A');
    const ex = trigS(A), sA = sinOf(A), cA = cosOf(A);
    const bv = b.val(), cv = c.val();
    const Sv = 0.5 * bv * cv * sA;
    const Sx = ex ? sScale(ex.s, b.mul(c).div(2)) : null;
    const sumSq = b.mul(b).add(c.mul(c)), bc2 = b.mul(c).mul(2);
    const a2v = sumSq.val() - bc2.val() * cA;
    let a2Q = null, aS = null, a2Tex = null;
    if (ex && ex.c.m === 1) {
      a2Q = sumSq.sub(bc2.mul(ex.c.r)); aS = sqrtQ(a2Q); a2Tex = a2Q.tex();
    } else if (ex) {
      const k = bc2.mul(ex.c.r).neg();
      a2Tex = sumSq.tex() + (k.sign() < 0 ? ' - ' : ' + ') + sTex({ r: k.abs(), m: ex.c.m });
    }
    const av = Math.sqrt(Math.max(a2v, 0));
    if (!(av > 0)) throw CE('この値では第 3 辺が 0 以下になり、三角形ができません');
    const perimv = av + bv + cv, rv = 2 * Sv / perimv;
    let rS = null, perimQ = null;
    if (Sx && aS && aS.m === 1) { perimQ = aS.r.add(b).add(c); rS = sScale(Sx, Q(2).div(perimQ)); }
    const aTex = aS ? sTex(aS) : (a2Tex ? R`\sqrt{` + a2Tex + '}' : fmt(av));
    const steps = [];
    steps.push({
      t: R`2 辺とその間の角から面積を求める公式 $S=\frac{1}{2}bc\sin A$`,
      m: R`S = \frac{1}{2}bc\sin A`,
      n: R`辺 $c$ を底辺とみると、高さは $b\sin A$ です。したがって面積は $\frac{1}{2}\times c\times b\sin A$ となります。`,
      easy: R`底辺 $AB=c$ に対して、頂点 $C$ から下ろした垂線の長さ（高さ）を考えます。直角三角形で「対辺 ＝ 斜辺 × $\sin$」なので、高さは $b\sin A$ です。あとは「底辺 × 高さ ÷ 2」にあてはめるだけです。`,
      pro: R`「2 辺の積 × 間の角の $\sin$ ÷ 2」と覚えます。夾角が $90\degree$ なら $\sin A=1$ で、直角三角形の面積に戻ります。`
    });
    steps.push({
      t: R`$\sin A$ の値を調べる`,
      m: R`\sin ` + dg(A) + eqS(ex && ex.s, sA),
      n: ex ? R`$` + dg(A) + R`$ は特別な角なので正確な値を使います。` : R`$` + dg(A) + R`$ は特別な角ではないので近似値を使い、面積も近似値になります。`,
      easy: R`$\sin30\degree=\frac{1}{2},\ \sin45\degree=\frac{\sqrt{2}}{2},\ \sin60\degree=\frac{\sqrt{3}}{2}$ です。鈍角でも $\sin A=\sin(180\degree-A)$ なので、鋭角の値と同じになります。`
    });
    steps.push({
      t: R`面積 $S$ を計算する`,
      m: chain('S', [R`\frac{1}{2}bc\sin A`, R`\frac{1}{2} \cdot ` + b.tex() + R` \cdot ` + c.tex() + R` \cdot ` + (ex ? sParen(ex.s) : fmt(sA)), Sx ? sTex(Sx) : R`\approx ` + fmt(Sv)]),
      n: R`$b=` + b.tex() + R`,\ c=` + c.tex() + R`$ と $\sin A$ を代入します。` + (Sx && Sx.m > 1 ? R`（近似値は $S\approx ` + fmt(Sv) + R`$）` : ''),
      easy: R`公式に数をそのまま入れます。分数や根号のかけ算は、「分子どうし・分母どうし」にまとめてから約分します。`
    });
    const subA2 = ex ? sq2(b) + ' + ' + sq2(c) + R` - 2 \cdot ` + b.tex() + R` \cdot ` + c.tex() + R` \cdot ` + sParen(ex.c) : '';
    const aLine = aS ? 'a = ' + sTex(aS) : (a2Tex ? R`a = \sqrt{` + a2Tex + R`} \approx ` + fmt(av) : R`a \approx ` + fmt(av));
    steps.push({
      t: R`第 3 辺 $a$ を余弦定理で求める`,
      m: [R`a^{2} = b^{2} + c^{2} - 2bc\cos A`,
        chain(R`a^{2}`, a2Q ? [subA2, sumSq.tex() + ' ' + U.signed(bc2.mul(ex.c.r).neg()), a2Q.tex()] : (a2Tex ? [subA2, a2Tex] : [R`\approx ` + fmt(a2v)])),
        aLine],
      n: R`内接円の半径を求めるには 3 辺すべての長さが必要です。2 辺とその間の角から、残りの辺 $a$ を余弦定理 $a^{2}=b^{2}+c^{2}-2bc\cos A$ で求めます。`,
      easy: R`内接円の半径の公式では、3 辺の長さの合計 $a+b+c$ を使います。$b,\ c$ と夾角 $A$ が分かっているので、残りの $a$ は余弦定理で出せます（くわしくは「余弦定理」の計算機で確認できます）。`
    });
    steps.push(AREA_INSCRIBE);
    const perimTex = (aS && aS.m === 1 ? aS.r.tex() : aTex) + ' + ' + b.tex() + ' + ' + c.tex();
    steps.push({
      t: R`内接円の半径 $r$ を計算する`,
      m: chain('r', [R`\frac{2S}{a + b + c}`, R`\frac{2 \cdot ` + (Sx ? sParen(Sx) : fmt(Sv)) + '}{' + perimTex + '}', rS ? sTex(rS) : R`\approx ` + fmt(rv)]),
      n: R`$S$ と $a+b+c` + (perimQ ? '=' + perimQ.tex() : '') + R`$ を代入します。` + (rS ? (rS.m > 1 ? R`（近似値は $r\approx ` + fmt(rv) + R`$）` : '') : R`$a$ に根号が残るときは、分母の有理化が複雑になるので近似値で答えます。`),
      easy: R`$r=\frac{2S}{a+b+c}$ に、求めた $S$ と、3 辺の和を入れて計算するだけです。3 辺の和が整数になる（$a$ が整数・分数になる）と、きれいな値になります。`
    });
    steps.push({
      t: '検算: S = ½ r (a + b + c)',
      m: R`\frac{1}{2}r(a + b + c) \approx \frac{1}{2} \cdot ` + fmt(rv) + R` \cdot ` + fmt(perimv) + R` \approx ` + fmt(0.5 * rv * perimv) + R`,\qquad S \approx ` + fmt(Sv),
      n: R`内接円の半径から面積を逆算して、最初の $S$ と一致するか確かめます。`,
      lv: 2
    });
    const fig = areaFig(av, bv, cv, rv, { a: lenLabel('a', aS && aS.m === 1 ? aS.r : null, av), b: lenLabel('b', b, bv), c: lenLabel('c', c, cv) }, { A: angLabel(A) });
    return {
      result: [
        { label: '面積 S', tex: 'S' + valEq(Sx, Sv) },
        { label: '第 3 辺 a', tex: aS ? 'a' + valEq(aS, av) : (a2Tex ? R`a = \sqrt{` + a2Tex + R`} \approx ` + fmt(av) : R`a \approx ` + fmt(av)) },
        { label: '内接円の半径 r', tex: 'r' + valEq(rS, rv) },
        { label: '3 辺の和 a+b+c', tex: aS && aS.m === 1 ? R`a + b + c = ` + perimQ.tex() : (aS ? R`a + b + c = ` + sTex(aS) + ' + ' + b.add(c).tex() + R` \approx ` + fmt(perimv) : R`a + b + c \approx ` + fmt(perimv)) }
      ],
      steps: steps,
      fig: fig
    };
  }

  function areaHeron(v) {
    const a = v.a, b = v.b, c = v.c;
    needSide(a, 'a'); needSide(b, 'b'); needSide(c, 'c');
    needTriangle(a, b, c);
    const s = a.add(b).add(c).div(2), sa = s.sub(a), sb = s.sub(b), sc = s.sub(c);
    const P2 = s.mul(sa).mul(sb).mul(sc);
    const S = sqrtQ(P2), r = sScale(S, s.inv());
    const Sv = Math.sqrt(P2.val()), rv = Sv / s.val();
    const steps = [];
    steps.push({
      t: '三角形の成立条件を確かめる',
      m: [R`a < b + c:\quad ` + a.tex() + ' < ' + b.add(c).tex(), R`b < c + a:\quad ` + b.tex() + ' < ' + c.add(a).tex(), R`c < a + b:\quad ` + c.tex() + ' < ' + a.add(b).tex()],
      n: R`どの辺も他の 2 辺の和より短いので、三角形ができます（このとき $s-a,\ s-b,\ s-c$ はすべて正になり、根号の中が正になります）。`,
      easy: R`三角形の 2 辺の和は、残りの 1 辺より必ず長くなります。この条件が成り立たない 3 つの長さでは、三角形はつくれません。`
    });
    steps.push({
      t: R`半周長 $s$ を求める`,
      m: chain('s', [R`\frac{a + b + c}{2}`, R`\frac{` + a.tex() + ' + ' + b.tex() + ' + ' + c.tex() + '}{2}', s.tex()]),
      n: R`**半周長**とは、3 辺の長さの和の半分のことです（周の長さの半分）。ヘロンの公式ではこの $s$ を使います。`,
      easy: R`「3 辺をすべて足して 2 でわった値」を $s$ とおきます。ヘロンの公式は、この $s$ から各辺を引いた値 $s-a,\ s-b,\ s-c$ をかけ合わせて作ります。`
    });
    steps.push({
      t: R`ヘロンの公式で面積 $S$ を求める`,
      m: [R`S = \sqrt{s(s-a)(s-b)(s-c)}`,
        R`s - a = ` + sa.tex() + R`,\quad s - b = ` + sb.tex() + R`,\quad s - c = ` + sc.tex(),
        chain('S', [R`\sqrt{` + s.tex() + R` \cdot ` + sa.tex() + R` \cdot ` + sb.tex() + R` \cdot ` + sc.tex() + '}', R`\sqrt{` + P2.tex() + '}', sTex(S)])],
      n: R`3 つの差 $s-a,\ s-b,\ s-c$ を先に計算してから、$s$ とあわせて 4 つをかけ、根号の中を簡単にします。` + (S.m > 1 ? R`（近似値は $S\approx ` + fmt(Sv) + R`$）` : ''),
      easy: R`ヘロンの公式は、高さが分からなくても 3 辺だけで面積が求められる便利な公式です。4 つの数 $s,\ s-a,\ s-b,\ s-c$ をかけ合わせた値の平方根が面積になります。根号の中は、$\sqrt{12}=2\sqrt{3}$ のように 2 乗の因数を外に出して簡単にします。`,
      pro: R`3 辺がすべて整数なら、$16S^{2}=(a+b+c)(-a+b+c)(a-b+c)(a+b-c)$ の形で、整数だけで計算できます（分数を避けられます）。`
    });
    steps.push(AREA_INSCRIBE);
    steps.push({
      t: R`内接円の半径 $r$ を計算する`,
      m: chain('r', [R`\frac{2S}{a + b + c}`, R`\frac{2 \cdot ` + sParen(S) + '}{' + a.add(b).add(c).tex() + '}', sTex(r)]),
      n: R`$a+b+c=2s=` + a.add(b).add(c).tex() + R`$ なので、$r=\frac{2S}{2s}=\frac{S}{s}$ とも書けます。` + (r.m > 1 ? R`（近似値は $r\approx ` + fmt(rv) + R`$）` : ''),
      easy: R`$r=\frac{2S}{a+b+c}$ に、求めた $S$ と 3 辺の和を入れて計算します。分母の $a+b+c$ は、半周長 $s$ の 2 倍です。`
    });
    // 検算: sin A = 2S/(bc)
    const sinA = sDiv(sScale(S, 2), sQ(b.mul(c)));
    steps.push({
      t: R`検算: $\sin A=\frac{2S}{bc}$`,
      m: chain(R`\sin A`, [R`\frac{2S}{bc}`, R`\frac{2 \cdot ` + sParen(S) + '}{' + b.mul(c).tex() + '}', sTex(sinA)]),
      n: R`$S=\frac{1}{2}bc\sin A$ の逆算です。$\sin A$ が 1 以下になっていれば、面積の計算は矛盾していません（このとき $\sin A\approx ` + fmt(sVal(sinA)) + R`$）。`,
      lv: 2
    });
    steps.push({
      t: '（参考）ヘロンの公式のみなもと',
      m: [
        R`S = \frac{1}{2}bc\sin A,\qquad \sin^{2}A = (1 - \cos A)(1 + \cos A)`,
        R`1 + \cos A = \frac{(b + c)^{2} - a^{2}}{2bc},\qquad 1 - \cos A = \frac{a^{2} - (b - c)^{2}}{2bc}`,
        R`S^{2} = \frac{1}{4}b^{2}c^{2}\sin^{2}A = \frac{(a+b+c)(-a+b+c)(a-b+c)(a+b-c)}{16} = s(s-a)(s-b)(s-c)`
      ],
      n: R`$\cos A=\frac{b^{2}+c^{2}-a^{2}}{2bc}$（余弦定理）を $\sin^{2}A=1-\cos^{2}A$ に代入し、和と差の積で因数分解すると、ヘロンの公式が得られます。`,
      easy: R`面積の公式 $S=\frac{1}{2}bc\sin A$ の $\sin A$ を、3 辺だけの式に直したものがヘロンの公式です。そのために余弦定理で $\cos A$ を 3 辺で表し、$\sin^{2}A=1-\cos^{2}A=(1-\cos A)(1+\cos A)$ と因数分解します。分子が「和と差の積」になって、きれいに 4 つの因数の積にまとまります。`,
      lv: 3
    });
    const fig = areaFig(a.val(), b.val(), c.val(), rv, { a: lenLabel('a', a, a.val()), b: lenLabel('b', b, b.val()), c: lenLabel('c', c, c.val()) }, null);
    return {
      result: [
        { label: '面積 S', tex: 'S' + valEq(S, Sv) },
        { label: '半周長 s', tex: 's = ' + s.tex() },
        { label: '内接円の半径 r', tex: 'r' + valEq(r, rv) },
        { label: '3 辺の和 a+b+c', tex: R`a + b + c = ` + a.add(b).add(c).tex() }
      ],
      steps: steps,
      fig: fig
    };
  }
})();
