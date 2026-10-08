/* 数I・A — 図形の性質: 三角形の外心・内心 / 角の二等分線と比 / チェバ・メネラウス / 方べきの定理
   構成は ia-quad.js に揃える（intro → result → steps(easy/pro/lv) → fig）。
   根号つきの値は「有理数 × √m」の形（S 型）で厳密に計算する。 */
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
  const sq2 = (q) => (q.isInt() && q.sign() >= 0 ? q.tex() + '^{2}' : R`\left(` + q.tex() + R`\right)^{2}`);   // Q の 2 乗の表示

  // S 型: 有理数 r に √m をかけた値（m は平方因子をもたない整数）
  function mkS(r, m) {
    if (r.isZero()) return { r: Q(0), m: 1 };
    const s = U.sqrtSimplify(m);
    return { r: r.mul(s.out), m: s.in };
  }
  const sQ = (q) => ({ r: q, m: 1 });
  const sVal = (s) => s.r.val() * Math.sqrt(s.m);
  const sDiv = (a, b) => {
    if (b.r.isZero()) throw CE('0 で割ることはできません');
    return mkS(a.r.div(b.r).div(b.m), a.m * b.m);
  };
  const sScale = (s, q) => mkS(s.r.mul(q), s.m);
  const sSq2 = (s) => s.r.mul(s.r).mul(s.m);               // S 型の 2 乗（Q）
  function sqrtQ(q) {                                       // √q（q ≥ 0）。分子と分母を別々に簡単にして桁を抑える
    if (q.n > 1e13 || q.d > 1e13) throw CE('数値の桁数が多すぎて、根号を含む厳密な値を計算できません。整数や簡単な分数で入力してください');
    const sn = U.sqrtSimplify(q.n), sd = U.sqrtSimplify(q.d);
    if (sn.in * sd.in > 1e14) throw CE('数値の桁数が多すぎて、根号を含む厳密な値を計算できません。整数や簡単な分数で入力してください');
    return mkS(Q(sn.out, sd.out * sd.in), sn.in * sd.in);
  }
  function sTex(s) {
    if (s.r.isZero()) return '0';
    if (s.m === 1) return s.r.tex();
    const ab = s.r.abs(), rad = R`\sqrt{` + s.m + '}';
    const num = (ab.n === 1 ? '' : String(ab.n)) + rad;
    return (s.r.sign() < 0 ? '-' : '') + (ab.d === 1 ? num : R`\frac{` + num + '}{' + ab.d + '}');
  }
  const sParen = (s) => (s.r.sign() < 0 ? R`\left(` + sTex(s) + R`\right)` : sTex(s));
  const valEq = (S, x) => (S ? ' = ' + sTex(S) + (S.m > 1 ? R` \approx ` + fmt(x) : '') : R` \approx ` + fmt(x));   // 「= 厳密値（≈ 近似値）」

  function needSide(q, name) {
    if (q.sign() <= 0) throw CE(name + ' は正の数を入力してください（辺の長さは 0 より大きい値です）');
  }
  function needTriangle(a, b, c) {                          // 各辺 < 他の 2 辺の和
    const chk = (x, y, z, nx, ny, nz) => {
      if (x.cmp(y.add(z)) >= 0) throw CE('三角形ができません: 辺 ' + nx + ' が他の 2 辺の和 ' + ny + ' + ' + nz + ' 以上です（どの辺も、他の 2 辺の和より短くなければなりません）');
    };
    chk(a, b, c, 'a', 'b', 'c'); chk(b, c, a, 'b', 'c', 'a'); chk(c, a, b, 'c', 'a', 'b');
  }
  const lenLabel = (name, q, v) => (q ? name + '=' + q.toString() : name + '≈' + fmt(v, 2));
  const dist = (p, q) => Math.sqrt((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]));

  // 整数比 m : n を既約にする
  function ratio(m, n) {
    const g = U.gcd(Math.abs(m), Math.abs(n)) || 1;
    return [m / g, n / g];
  }
  const ratTex = (m, n) => m + ' : ' + n;

  // 3 辺（数値）から三角形の頂点座標: B=(0,0), C=(a,0)
  function triFromSides(a, b, c) {
    const x = (a * a + c * c - b * b) / (2 * a);
    return { A: [x, Math.sqrt(Math.max(c * c - x * x, 0))], B: [0, 0], C: [a, 0] };
  }

  /* ---------- 図: 三角形を円・追加の線などと一緒に枠に収めて描く ---------- */

  // P = {A:[x,y], B, C}（数学座標・y 上向き）。o: { circles:[{cx,cy,r,cls,dash}], sides:{a,b,c}, w, h, extra(d, T, sc, out) }
  function fitFigure(P, o) {
    o = o || {};
    const W = o.w || 340, H = o.h || 250, M = o.m || 30;
    let x0 = Math.min(P.A[0], P.B[0], P.C[0]), x1 = Math.max(P.A[0], P.B[0], P.C[0]);
    let y0 = Math.min(P.A[1], P.B[1], P.C[1]), y1 = Math.max(P.A[1], P.B[1], P.C[1]);
    (o.circles || []).forEach((cc) => {
      x0 = Math.min(x0, cc.cx - cc.r); x1 = Math.max(x1, cc.cx + cc.r);
      y0 = Math.min(y0, cc.cy - cc.r); y1 = Math.max(y1, cc.cy + cc.r);
    });
    (o.extraPts || []).forEach((p) => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
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
    const g = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    const out = (p, dist2) => {                              // 三角形の重心から遠ざかる向きに dist2 px ずらした点
      const dx = p[0] - g[0], dy = p[1] - g[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      return [p[0] + dx / L * dist2, p[1] + dy / L * dist2];
    };
    if (o.extra) o.extra(d, T, sc, out);
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
    return d.svg();
  }
  // 線分 P1P2（画面座標）の中点から、垂直方向に dist px ずらした位置に文字（外側 = 重心と反対側）
  function segText(d, p1, p2, str, outFn, dist2, cls) {
    const m = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    const q = outFn(m, dist2 || 13);
    d.text(q[0], q[1] + 4, str, { cls: cls || 'c2', size: 12 });
  }

  /* ================= ia-tri-centers: 外接円・内接円 ================= */

  JK.registerCalc({
    id: 'ia-tri-centers',
    course: 'IA',
    unit: 'm-geo',
    group: '図形の性質',
    title: '三角形の面積・内接円・外接円の半径',
    desc: R`3 辺の長さから、面積 $S$（ヘロンの公式）、内接円の半径 $r=\frac{2S}{a+b+c}$、外接円の半径 $R=\frac{abc}{4S}$ を求めます。内心 $I$・外心 $O$ の性質と、オイラーの定理 $OI^{2}=R^{2}-2Rr$ による検算も示します。`,
    form: [R`S = \sqrt{s(s-a)(s-b)(s-c)}`, R`r = \frac{2S}{a+b+c}, \qquad R = \frac{abc}{4S}`],
    inputs: [
      { key: 'a', label: R`辺 $a=BC$`, type: 'q', def: '13', max: 1000 },
      { key: 'b', label: R`辺 $b=CA$`, type: 'q', def: '14', max: 1000 },
      { key: 'c', label: R`辺 $c=AB$`, type: 'q', def: '15', max: 1000 }
    ],
    examples: [
      { label: '13, 14, 15', v: { a: '13', b: '14', c: '15' } },
      { label: '3, 4, 5（直角三角形）', v: { a: '5', b: '3', c: '4' } },
      { label: '7, 5, 8', v: { a: '7', b: '5', c: '8' } },
      { label: '正三角形 6, 6, 6', v: { a: '6', b: '6', c: '6' } },
      { label: '4, 5, 6', v: { a: '4', b: '5', c: '6' } }
    ],
    intro: {
      easy: R`三角形には、「中に入る円」と「まわりを囲む円」があります。
**内接円**は、3 つの辺すべてに接する円（中心を**内心** $I$ といい、3 つの角の二等分線の交点）。**外接円**は、3 つの頂点すべてを通る円（中心を**外心** $O$ といい、3 辺の垂直二等分線の交点）です。
3 辺の長さが分かれば、まず**ヘロンの公式**で面積 $S$ を求め、そこから内接円の半径 $r=\frac{2S}{a+b+c}$ と外接円の半径 $R=\frac{abc}{4S}$ が求まります。`,
      normal: R`$S$（ヘロンの公式）→ $r=\frac{2S}{a+b+c}$（$S=\frac{1}{2}r(a+b+c)$ より）、$R=\frac{abc}{4S}$（$S=\frac{1}{2}bc\sin A$ と正弦定理 $\frac{a}{\sin A}=2R$ より）。検算にオイラーの定理 $OI^{2}=R(R-2r)$ が使えます。`,
      pro: R`$S$ が決まれば $r$ と $R$ は 1 行です。$R\ge 2r$（等号は正三角形）は覚えておくと検算になります。直角三角形なら $R=\frac{\text{斜辺}}{2}$、$r=\frac{b+c-a}{2}$（$a$ が斜辺）。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c;
      needSide(a, 'a'); needSide(b, 'b'); needSide(c, 'c');
      needTriangle(a, b, c);
      const p2 = a.add(b).add(c), s = p2.div(2), sa = s.sub(a), sb = s.sub(b), sc = s.sub(c);
      const P2 = s.mul(sa).mul(sb).mul(sc);
      const S = sqrtQ(P2), Sv = Math.sqrt(P2.val());
      const r = sScale(S, s.inv()), rv = Sv / s.val();
      const abc = a.mul(b).mul(c);
      const Rr = sDiv(sQ(abc.div(4)), S), Rv = abc.val() / (4 * Sv);
      // オイラーの定理 OI² = R² − 2Rr（有理数になる）
      const R2 = abc.mul(abc).div(P2.mul(16)), Rr2 = abc.div(p2.mul(2)).mul(2);       // R² = (abc)²/(16 S²)、R·r = abc/(2(a+b+c))
      const OI2 = R2.sub(Rr2);
      const OI = sqrtQ(OI2.sign() < 0 ? Q(0) : OI2), OIv = Math.sqrt(Math.max(OI2.val(), 0));
      const steps = [];
      steps.push({
        t: '三角形の成立条件を確かめる',
        m: [R`a < b + c:\quad ` + a.tex() + ' < ' + b.add(c).tex(), R`b < c + a:\quad ` + b.tex() + ' < ' + c.add(a).tex(), R`c < a + b:\quad ` + c.tex() + ' < ' + a.add(b).tex()],
        n: R`どの辺も他の 2 辺の和より短いので、三角形ができます。`,
        easy: R`三角形の 2 辺の和は、残りの 1 辺より必ず長くなります。この条件が成り立たないと、3 つの辺をつなげても閉じた三角形にならないので、先に確かめます。`
      });
      steps.push({
        t: R`半周長 $s$ とヘロンの公式で面積 $S$ を求める`,
        m: [
          chain('s', [R`\frac{a + b + c}{2}`, R`\frac{` + a.tex() + ' + ' + b.tex() + ' + ' + c.tex() + '}{2}', s.tex()]),
          R`s - a = ` + sa.tex() + R`,\quad s - b = ` + sb.tex() + R`,\quad s - c = ` + sc.tex(),
          chain('S', [R`\sqrt{s(s-a)(s-b)(s-c)}`, R`\sqrt{` + s.tex() + R` \cdot ` + sa.tex() + R` \cdot ` + sb.tex() + R` \cdot ` + sc.tex() + '}', R`\sqrt{` + P2.tex() + '}', sTex(S)])
        ],
        n: R`$s=\frac{a+b+c}{2}$（半周長）を使って、**ヘロンの公式** $S=\sqrt{s(s-a)(s-b)(s-c)}$ で面積を求めます。` + (S.m > 1 ? R`（近似値は $S\approx ` + fmt(Sv) + R`$）` : ''),
        easy: R`高さが分からなくても、3 辺の長さだけで面積が求められるのがヘロンの公式です。まず 3 辺の和の半分 $s$ を出し、$s-a,\ s-b,\ s-c$ を計算して、4 つの数 $s,\ s-a,\ s-b,\ s-c$ をかけ合わせた値の平方根をとります。根号の中は、2 乗の因数を外に出して簡単にします。`,
        pro: R`3 辺が整数なら $16S^{2}=(a+b+c)(-a+b+c)(a-b+c)(a+b-c)$ で整数計算だけにできます。`
      });
      steps.push({
        t: R`内接円の半径 $r=\frac{2S}{a+b+c}$`,
        m: [R`S = \frac{1}{2}r(a + b + c)`, chain('r', [R`\frac{2S}{a + b + c}`, R`\frac{2 \cdot ` + sParen(S) + '}{' + p2.tex() + '}', sTex(r)])],
        n: R`内心 $I$ から 3 辺に垂線を引くと、どれも長さ $r$。三角形 $ABC$ は 3 つの三角形 $IBC,\ ICA,\ IAB$ に分かれ、面積の和が $S=\frac{1}{2}ra+\frac{1}{2}rb+\frac{1}{2}rc$ となります。これを $r$ について解きます。` + (r.m > 1 ? R`（近似値は $r\approx ` + fmt(rv) + R`$）` : ''),
        easy: R`**内接円**は三角形の中にぴったり入る円で、3 つの辺すべてに接します。円の中心を 3 つの頂点と結ぶと、三角形が 3 つの小三角形に分かれます。どれも高さが内接円の半径 $r$ なので、面積は $\frac{1}{2}ra,\ \frac{1}{2}rb,\ \frac{1}{2}rc$ で、その合計が $S$ です。これから $r=\frac{2S}{a+b+c}$ が出ます。`,
        pro: R`$r=\frac{S}{s}$ とも書けます（$a+b+c=2s$）。直角三角形（$a$ が斜辺）なら $r=\frac{b+c-a}{2}$ と暗算できます。`
      });
      steps.push({
        t: R`外接円の半径 $R=\frac{abc}{4S}$`,
        m: [R`R = \frac{abc}{4S}`, chain('R', [R`\frac{abc}{4S}`, R`\frac{` + a.tex() + R` \cdot ` + b.tex() + R` \cdot ` + c.tex() + R`}{4 \cdot ` + sParen(S) + '}', sTex(Rr)])],
        n: R`$S=\frac{1}{2}bc\sin A$ と正弦定理 $\frac{a}{\sin A}=2R$（$\sin A=\frac{a}{2R}$）から、$S=\frac{1}{2}bc\cdot\frac{a}{2R}=\frac{abc}{4R}$。これを $R$ について解きます。` + (Rr.m > 1 ? R`（近似値は $R\approx ` + fmt(Rv) + R`$）` : ''),
        easy: R`**外接円**は三角形の 3 つの頂点すべてを通る円です。「面積 $S=\frac{1}{2}bc\sin A$」の $\sin A$ を、正弦定理（$\sin A=\frac{a}{2R}$）で $a$ と $R$ に置きかえると、$S=\frac{abc}{4R}$ となり、$R$ について解けば $R=\frac{abc}{4S}$ です。3 辺と面積だけで外接円の半径が求まります。`,
        pro: R`分母に根号が残ったら有理化します。$R=\frac{abc}{4S}$ と $r=\frac{2S}{a+b+c}$ を掛けると $Rr=\frac{abc}{2(a+b+c)}$ で、$S$ が消えて有理数になります（オイラーの定理の検算に使えます）。`
      });
      steps.push({
        t: '内心・外心とは',
        m: [R`I:\ \text{3 つの角の二等分線の交点（内接円の中心）}`, R`O:\ \text{3 辺の垂直二等分線の交点（外接円の中心）}`],
        n: R`内心 $I$ は 3 辺までの距離が等しい点（距離 $=r$）、外心 $O$ は 3 頂点までの距離が等しい点（距離 $=R$）です。図の破線の円が外接円、実線の円が内接円です。`,
        easy: R`角の二等分線上の点は、その角をつくる 2 辺から等しい距離にあります。だから 3 つの角の二等分線の交点は、3 辺から等しい距離（$=r$）にあり、これが内接円の中心です。一方、線分の垂直二等分線上の点は、その線分の両端から等しい距離にあるので、3 辺の垂直二等分線の交点は 3 頂点から等しい距離（$=R$）にあり、外接円の中心になります。`,
        lv: 2
      });
      steps.push({
        t: R`検算: オイラーの定理 $OI^{2}=R^{2}-2Rr$`,
        m: [
          R`R^{2} = ` + R2.tex() + R`,\qquad 2Rr = ` + Rr2.tex(),
          chain(R`OI^{2}`, [R`R^{2} - 2Rr`, R2.tex() + ' ' + (Rr2.sign() < 0 ? '+ ' + Rr2.abs().tex() : '- ' + Rr2.tex()), OI2.tex()]),
          R`OI = ` + sTex(OI) + (OI.m > 1 ? R` \approx ` + fmt(OIv) : '') + R` \quad (\ge 0)`
        ],
        n: R`外心と内心の距離 $OI$ について $OI^{2}=R^{2}-2Rr$ が成り立ちます（オイラーの定理）。$OI^{2}\ge 0$ なので $R\ge 2r$。等号は正三角形（$O=I$）のときです。ここでは $OI^{2}=` + OI2.tex() + R`$ となり、$R\ge 2r$ を満たしています。`,
        easy: R`外接円の半径 $R$ と内接円の半径 $r$、そして 2 つの円の中心の距離 $OI$ のあいだには、$OI^{2}=R^{2}-2Rr$ という関係があります。左辺は 2 乗なので 0 以上、だから $R\ge 2r$ になるはずです。計算した $R,\ r$ がこの条件を満たすか確かめると、計算ミスに気づけます。`,
        lv: 2
      });
      // 図
      const P = triFromSides(a.val(), b.val(), c.val());
      const al = a.val(), bl = b.val(), cl = c.val();
      const I = [(al * P.A[0] + bl * P.B[0] + cl * P.C[0]) / (al + bl + cl), (al * P.A[1] + bl * P.B[1] + cl * P.C[1]) / (al + bl + cl)];
      const kO = (P.A[0] * P.A[0] + P.A[1] * P.A[1] - al * P.A[0]) / (2 * P.A[1]);
      const O = [al / 2, kO];
      const fig = fitFigure(P, {
        circles: [{ cx: O[0], cy: O[1], r: Rv, cls: 'c2', dash: true }, { cx: I[0], cy: I[1], r: rv, cls: 'c1' }],
        sides: { a: lenLabel('a', a, al), b: lenLabel('b', b, bl), c: lenLabel('c', c, cl) },
        extra: (d, T, scale) => {
          const o = T(O), i = T(I), cc = T(P.C), f = T([I[0], 0]);
          d.line(o[0], o[1], cc[0], cc[1], { cls: 'c2', dash: true, w: 1.2 });
          d.line(i[0], i[1], f[0], f[1], { cls: 'c1', dash: true, w: 1.2 });
          d.dot(o[0], o[1], { cls: 'c2', r: 2.5 });
          d.dot(i[0], i[1], { cls: 'c1', r: 2.5 });
          d.text(o[0] - 8, o[1] - 5, 'O', { cls: 'c2', size: 12, italic: true });
          d.text(i[0] + 8, i[1] - 5, 'I', { cls: 'c1', size: 12, italic: true });
          d.text((o[0] + cc[0]) / 2 + 3, (o[1] + cc[1]) / 2 - 4, 'R', { cls: 'c2', size: 12, italic: true });
          d.text(i[0] + 6, (i[1] + f[1]) / 2 + 4, 'r', { cls: 'c1', size: 12, italic: true });
        }
      });
      return {
        result: [
          { label: '面積 S', tex: 'S' + valEq(S, Sv) },
          { label: '内接円の半径 r', tex: 'r' + valEq(r, rv) },
          { label: '外接円の半径 R', tex: 'R' + valEq(Rr, Rv) },
          { label: '外心と内心の距離 OI', tex: 'OI' + valEq(OI, OIv) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= ia-angle-bisector: 角の二等分線と比 ================= */

  JK.registerCalc({
    id: 'ia-angle-bisector',
    course: 'IA',
    unit: 'm-geo',
    group: '図形の性質',
    title: '角の二等分線と比（BD : DC = AB : AC）',
    desc: R`三角形 $ABC$ で $\angle A$ の二等分線が辺 $BC$ と交わる点を $D$ とするとき、$BD:DC=AB:AC$ を使って $BD,\ DC$ を、$AD^{2}=AB\cdot AC-BD\cdot DC$ で $AD$ の長さを求めます。`,
    form: [R`BD : DC = AB : AC`, R`AD^{2} = AB \cdot AC - BD \cdot DC`],
    inputs: [
      { key: 'c', label: R`$AB$（$=c$）`, type: 'q', def: '6', max: 1000 },
      { key: 'b', label: R`$AC$（$=b$）`, type: 'q', def: '4', max: 1000 },
      { key: 'a', label: R`$BC$（$=a$）`, type: 'q', def: '5', max: 1000 }
    ],
    examples: [
      { label: 'AB=6, AC=4, BC=5', v: { c: '6', b: '4', a: '5' } },
      { label: 'AB=AC=5, BC=6（二等辺）', v: { c: '5', b: '5', a: '6' } },
      { label: 'AB=8, AC=5, BC=7', v: { c: '8', b: '5', a: '7' } },
      { label: 'AB=3, AC=5, BC=7', v: { c: '3', b: '5', a: '7' } },
      { label: 'AB=9, AC=6, BC=10', v: { c: '9', b: '6', a: '10' } }
    ],
    intro: {
      easy: R`三角形の 1 つの角を 2 等分する線を**角の二等分線**といいます。$\angle A$ の二等分線が向かいの辺 $BC$ と交わる点を $D$ とすると、**$BC$ は $AB:AC$ の比に分けられます**。つまり
$$BD:DC=AB:AC$$
です。長い辺のほうに近いほど、$BC$ のなかで取り分が大きくなる、というイメージです。この比が分かれば、$BC$ の長さを分けて $BD,\ DC$ が求まり、さらに二等分線 $AD$ の長さも計算できます。`,
      normal: R`$BD=\frac{AB}{AB+AC}\cdot BC$、$DC=\frac{AC}{AB+AC}\cdot BC$。$AD$ の長さは $AD^{2}=AB\cdot AC-BD\cdot DC$（スチュワートの定理より）で求めます。`,
      pro: R`$AD^{2}=bc-BD\cdot DC=bc\left\{1-\frac{a^{2}}{(b+c)^{2}}\right\}$ と暗算できるようにしておくと速いです。内心 $I$ は $AD$ を $AI:ID=(b+c):a$ に分けます。外角の二等分線なら外分になります。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c;
      needSide(a, 'a'); needSide(b, 'b'); needSide(c, 'c');
      needTriangle(a, b, c);
      const bc = b.add(c);
      const BD = a.mul(c).div(bc), DC = a.mul(b).div(bc);
      const AD2 = b.mul(c).sub(BD.mul(DC)), AD = sqrtQ(AD2), ADv = Math.sqrt(AD2.val());
      const [m1, n1] = ratio(c.n * b.d, b.n * c.d);        // c : b を整数比に（分数のときは通分）
      const steps = [];
      steps.push({
        t: '三角形の成立条件を確かめる',
        m: [R`a < b + c:\quad ` + a.tex() + ' < ' + b.add(c).tex(), R`b < c + a:\quad ` + b.tex() + ' < ' + c.add(a).tex(), R`c < a + b:\quad ` + c.tex() + ' < ' + a.add(b).tex()],
        n: R`どの辺も他の 2 辺の和より短いので、三角形ができます。`,
        easy: R`三角形の 2 辺の和は、残りの 1 辺より必ず長くなります。先にこの確認をします。`
      });
      steps.push({
        t: '角の二等分線の定理',
        m: [R`BD : DC = AB : AC`, R`BD : DC = ` + c.tex() + ' : ' + b.tex() + (m1 + ' : ' + n1 !== c.tex() + ' : ' + b.tex() ? ' = ' + ratTex(m1, n1) : '')],
        n: R`$\angle A$ の二等分線 $AD$ は、向かいの辺 $BC$ を、$A$ をはさむ 2 辺の長さの比 $AB:AC$ に分けます。`,
        easy: R`$\angle BAC$ を半分にする線 $AD$ を引くと、$D$ は辺 $BC$ を「$AB$ と $AC$ の比」に分けます。たとえば $AB=6,\ AC=4$ なら、$BD:DC=6:4=3:2$ です。**$A$ に近い（長い）ほうの辺に向かい合う側が長くなる**と覚えます。`,
        pro: R`「$A$ から出る 2 辺の比 ＝ 対辺の分割比」。外角の二等分線のときは、$BC$ を **外分** する点になります。`
      });
      steps.push({
        t: R`$BD,\ DC$ の長さを求める`,
        m: [
          R`BD = BC \cdot \frac{AB}{AB + AC} = ` + a.tex() + R` \cdot \frac{` + c.tex() + '}{' + c.tex() + ' + ' + b.tex() + '} = ' + BD.tex(),
          R`DC = BC \cdot \frac{AC}{AB + AC} = ` + a.tex() + R` \cdot \frac{` + b.tex() + '}{' + c.tex() + ' + ' + b.tex() + '} = ' + DC.tex(),
          R`BD + DC = ` + BD.tex() + ' + ' + DC.tex() + ' = ' + BD.add(DC).tex() + R` = BC`
        ],
        n: R`$BC=` + a.tex() + R`$ を $AB:AC=` + c.tex() + ':' + b.tex() + R`$ に分けます。比の合計 $AB+AC=` + bc.tex() + R`$ を分母にして、それぞれの割合をかけます。最後に $BD+DC=BC$ になることで検算します。`,
        easy: R`長さ $BC$ を、比 $AB:AC$ で分けるだけです。たとえば長さ 10 を $3:2$ に分けるなら、合計 5 を分母にして $10\times\frac{3}{5}=6$ と $10\times\frac{2}{5}=4$ ですね。それと同じ計算です。`
      });
      steps.push({
        t: R`$AD$ の長さを求める`,
        m: [R`AD^{2} = AB \cdot AC - BD \cdot DC`, chain(R`AD^{2}`, [c.tex() + R` \cdot ` + b.tex() + ' - ' + BD.tex() + R` \cdot ` + DC.tex(), b.mul(c).tex() + ' - ' + BD.mul(DC).tex(), AD2.tex()]), chain('AD', [R`\sqrt{` + AD2.tex() + '}', sTex(AD)])],
        n: R`二等分線の長さは $AD^{2}=AB\cdot AC-BD\cdot DC$ で求められます（次の参考ステップで理由を確かめます）。` + (AD.m > 1 ? R`（近似値は $AD\approx ` + fmt(ADv) + R`$）` : ''),
        easy: R`二等分線 $AD$ の長さは、「$A$ をはさむ 2 辺の積」から「$BD$ と $DC$ の積」を引いた値の平方根です。この公式は「スチュワートの定理」から導けます。$AB\cdot AC$ と $BD\cdot DC$ を先に計算して引き、平方根をとります。`,
        pro: R`$AD^{2}=AB\cdot AC-BD\cdot DC$ は丸暗記する価値があります。二等分線の長さを聞かれたらこれで即答です。`
      });
      // 検算: 余弦定理（cos B）
      const cosB = a.mul(a).add(c.mul(c)).sub(b.mul(b)).div(a.mul(c).mul(2));
      const AD2b = c.mul(c).add(BD.mul(BD)).sub(c.mul(BD).mul(cosB).mul(2));
      steps.push({
        t: '検算: 余弦定理で $AD$ を求め直す',
        m: [
          R`\cos B = \frac{a^{2} + c^{2} - b^{2}}{2ac} = ` + cosB.tex(),
          chain(R`AD^{2}`, [R`AB^{2} + BD^{2} - 2 \cdot AB \cdot BD \cos B`, sq2(c) + ' + ' + sq2(BD) + R` - 2 \cdot ` + c.tex() + R` \cdot ` + BD.tex() + R` \cdot ` + (cosB.sign() < 0 ? R`\left(` + cosB.tex() + R`\right)` : cosB.tex()), AD2b.tex()])
        ],
        n: R`三角形 $ABD$ に余弦定理を使って $AD^{2}$ を別の方法で求めます。` + (AD2b.eq(AD2) ? R`先ほどの $AD^{2}=` + AD2.tex() + R`$ と一致しました。` : R`値が一致しません。計算を確かめてください。`),
        lv: 2
      });
      // 内心
      const ai = bc, id = a;
      const [rai, rid] = ratio(ai.n * id.d, id.n * ai.d);
      steps.push({
        t: R`応用: 内心 $I$ は $AD$ を $AI:ID=(b+c):a$ に分ける`,
        m: [R`AI : ID = BA : BD = ` + c.tex() + ' : ' + BD.tex() + ' = ' + ratTex(...ratio(c.n * BD.d, BD.n * c.d)), R`(b + c) : a = ` + bc.tex() + ' : ' + a.tex() + ' = ' + ratTex(rai, rid)],
        n: R`$\triangle ABD$ で $\angle B$ の二等分線 $BI$ を考えます。内心 $I$ は $\angle B$ の二等分線上にあるので、角の二等分線の定理から $AI:ID=BA:BD$ です。これを計算すると $(b+c):a$ になります。`,
        easy: R`内心 $I$ は、3 つの角の二等分線の交点です。$AD$ は $\angle A$ の二等分線なので、その上に $I$ があります。さらに三角形 $ABD$ の中で、$B$ から出る二等分線が $I$ を通りますから、もう一度「角の二等分線の定理」を使えば $AI:ID$ が出ます。`,
        lv: 3
      });
      steps.push({
        t: '（参考）角の二等分線の定理のみなもと',
        m: [R`\triangle ABD : \triangle ACD = BD : DC`, R`\triangle ABD : \triangle ACD = \frac{1}{2}AB \cdot AD \sin\frac{A}{2} : \frac{1}{2}AC \cdot AD \sin\frac{A}{2} = AB : AC`],
        n: R`$\triangle ABD$ と $\triangle ACD$ は、頂点 $A$ から $BC$ に下ろした高さが共通なので、面積比は底辺の比 $BD:DC$ に等しくなります。一方、$\angle BAD=\angle CAD=\frac{A}{2}$ を使うと、面積比は $AB:AC$ とも表せます。したがって $BD:DC=AB:AC$ です。`,
        easy: R`2 つの三角形 $ABD,\ ACD$ の面積を 2 通りに比べます。①高さが同じだから、面積の比は底辺 $BD:DC$ の比。②間の角（$\frac{A}{2}$）が同じだから、面積の比は $A$ をはさむ辺 $AB:AC$ の比（面積 $=\frac{1}{2}\times$ 辺 $\times$ 辺 $\times\sin$）。この 2 つの比が等しいことから定理が出ます。`,
        lv: 3
      });
      // 図
      const P = triFromSides(a.val(), b.val(), c.val());
      const Dp = [BD.val(), 0];
      const fig = fitFigure(P, {
        sides: { b: lenLabel('b', b, b.val()), c: lenLabel('c', c, c.val()) },
        extra: (d, T, scale, out) => {
          const A = T(P.A), D = T(Dp), B = T(P.B), C = T(P.C);
          d.line(A[0], A[1], D[0], D[1], { cls: 'c2', w: 1.8 });
          d.dot(D[0], D[1], { cls: 'c2', r: 3 });
          const dir = (V, W) => Math.atan2(-(W[1] - V[1]), W[0] - V[0]) * 180 / Math.PI;     // 画面座標 → 数学角
          const aB = dir(A, B), aD = dir(A, D), aC = dir(A, C);
          const span = (x, y) => { let dd = ((y - x) % 360 + 360) % 360; return dd > 180 ? [y, x + 360] : [x, x + dd]; };
          const s1 = span(aB, aD), s2 = span(aD, aC);
          d.arc(A[0], A[1], 24, s1[0], s1[1], { cls: 'c3' });
          d.arc(A[0], A[1], 24, s2[0], s2[1], { cls: 'c3' });
          const lab = (an, dist2) => { const rr = an * Math.PI / 180; return [A[0] + dist2 * Math.cos(rr), A[1] - dist2 * Math.sin(rr)]; };
          const l1 = lab((s1[0] + s1[1]) / 2, 37), l2 = lab((s2[0] + s2[1]) / 2, 37);
          d.text(l1[0], l1[1] + 4, 'α', { cls: 'c3', size: 12, italic: true });
          d.text(l2[0], l2[1] + 4, 'α', { cls: 'c3', size: 12, italic: true });
          const q = out(D, 14);
          d.text(q[0], q[1] + 4, 'D', { cls: 'fg', size: 13, italic: true });
          segText(d, B, D, 'BD=' + BD.toString(), out, 16, 'c2');
          segText(d, D, C, 'DC=' + DC.toString(), out, 16, 'c2');
          segText(d, A, D, 'AD' + (AD.m === 1 ? '=' + AD.r.toString() : '≈' + fmt(ADv, 2)), (p) => [p[0] + 18, p[1]], 0, 'c2');
        }
      });
      return {
        result: [
          { label: '比 BD : DC', tex: R`BD : DC = ` + ratTex(m1, n1) },
          { label: 'BD の長さ', tex: 'BD = ' + BD.tex() },
          { label: 'DC の長さ', tex: 'DC = ' + DC.tex() },
          { label: '二等分線 AD の長さ', tex: 'AD' + valEq(AD, ADv) },
          { label: '内心 I の位置', tex: R`AI : ID = ` + ratTex(rai, rid) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= ia-ceva-menelaus: チェバの定理・メネラウスの定理 ================= */

  const TRI = { A: [2.2, 5], B: [0, 0], C: [7, 0] };       // 図の三角形（見やすい形に固定）
  const divPt = (P1, P2, m, n) => [P1[0] + (P2[0] - P1[0]) * m / (m + n), P1[1] + (P2[1] - P1[1]) * m / (m + n)];
  function lineIntersect(p1, p2, p3, p4) {                   // 直線 p1p2 と直線 p3p4 の交点（平行なら null）
    const d1 = [p2[0] - p1[0], p2[1] - p1[1]], d2 = [p4[0] - p3[0], p4[1] - p3[1]];
    const det = d1[0] * d2[1] - d1[1] * d2[0];
    if (Math.abs(det) < 1e-12) return null;
    const t = ((p3[0] - p1[0]) * d2[1] - (p3[1] - p1[1]) * d2[0]) / det;
    return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
  }
  const rIn = { min: 1, max: 99 };

  JK.registerCalc({
    id: 'ia-ceva-menelaus',
    course: 'IA',
    unit: 'm-geo',
    group: '図形の性質',
    title: 'チェバの定理・メネラウスの定理',
    desc: R`三角形の辺上の 2 つの比から、残りの比を求めます。チェバの定理（3 本の線が 1 点で交わる）では $\frac{BP}{PC}\cdot\frac{CQ}{QA}\cdot\frac{AR}{RB}=1$ から $AR:RB$ と $AO:OP$ を、メネラウスの定理（直線が 3 辺を切る）では $\frac{AR}{RB}\cdot\frac{BP}{PC}\cdot\frac{CQ}{QA}=1$ から $BP:PC$ を求めます。`,
    form: [R`\frac{BP}{PC}\cdot\frac{CQ}{QA}\cdot\frac{AR}{RB} = 1\quad(\text{チェバ})`, R`\frac{AR}{RB}\cdot\frac{BP}{PC}\cdot\frac{CQ}{QA} = 1\quad(\text{メネラウス})`],
    inputs: [
      { key: 'mode', label: '定理', type: 'select', def: 'ceva', options: [['ceva', 'チェバの定理（3 本の線 AP, BQ, CR が 1 点で交わる）'], ['menelaus', 'メネラウスの定理（直線 RQ が辺 BC の延長と P で交わる）']] },
      Object.assign({ key: 'c_bp', label: R`比 $BP:PC$ の $BP$ 側`, type: 'int', def: '1', show: (raw) => raw.mode === 'ceva' }, rIn),
      Object.assign({ key: 'c_pc', label: R`比 $BP:PC$ の $PC$ 側`, type: 'int', def: '2', show: (raw) => raw.mode === 'ceva' }, rIn),
      Object.assign({ key: 'c_cq', label: R`比 $CQ:QA$ の $CQ$ 側`, type: 'int', def: '3', show: (raw) => raw.mode === 'ceva' }, rIn),
      Object.assign({ key: 'c_qa', label: R`比 $CQ:QA$ の $QA$ 側`, type: 'int', def: '1', show: (raw) => raw.mode === 'ceva' }, rIn),
      Object.assign({ key: 'm_ar', label: R`比 $AR:RB$ の $AR$ 側`, type: 'int', def: '2', show: (raw) => raw.mode === 'menelaus' }, rIn),
      Object.assign({ key: 'm_rb', label: R`比 $AR:RB$ の $RB$ 側`, type: 'int', def: '3', show: (raw) => raw.mode === 'menelaus' }, rIn),
      Object.assign({ key: 'm_cq', label: R`比 $CQ:QA$ の $CQ$ 側`, type: 'int', def: '1', show: (raw) => raw.mode === 'menelaus' }, rIn),
      Object.assign({ key: 'm_qa', label: R`比 $CQ:QA$ の $QA$ 側`, type: 'int', def: '2', show: (raw) => raw.mode === 'menelaus' }, rIn)
    ],
    examples: [
      { label: 'チェバ: BP:PC=1:2, CQ:QA=3:1', v: { mode: 'ceva', c_bp: '1', c_pc: '2', c_cq: '3', c_qa: '1' } },
      { label: 'チェバ（中線）: 1:1, 1:1', v: { mode: 'ceva', c_bp: '1', c_pc: '1', c_cq: '1', c_qa: '1' } },
      { label: 'チェバ: 2:3, 3:4', v: { mode: 'ceva', c_bp: '2', c_pc: '3', c_cq: '3', c_qa: '4' } },
      { label: 'メネラウス: AR:RB=2:3, CQ:QA=1:2', v: { mode: 'menelaus', m_ar: '2', m_rb: '3', m_cq: '1', m_qa: '2' } },
      { label: 'メネラウス: 3:1, 1:2（B 側に出る）', v: { mode: 'menelaus', m_ar: '3', m_rb: '1', m_cq: '1', m_qa: '2' } },
      { label: 'メネラウス: 3:2, 3:1', v: { mode: 'menelaus', m_ar: '3', m_rb: '2', m_cq: '3', m_qa: '1' } }
    ],
    intro: {
      easy: R`三角形 $ABC$ の辺 $BC,\ CA,\ AB$ 上に点 $P,\ Q,\ R$ があるとします。
**チェバの定理**は、3 本の線 $AP,\ BQ,\ CR$ が 1 点で交わるとき、辺を分ける比の積が 1 になる、という定理です。
**メネラウスの定理**は、三角形の頂点を通らない 1 本の直線が、3 つの辺（またはその延長）と交わるとき、同じ形の比の積が 1 になる、という定理です。
どちらも式は「**頂点 → 分点 → 次の頂点**」と三角形を 1 周しながら比をかけていく形で、2 つの比が分かれば残りの 1 つが求まります。`,
      normal: R`チェバ: $\frac{BP}{PC}\cdot\frac{CQ}{QA}\cdot\frac{AR}{RB}=1$。メネラウス: $\frac{AR}{RB}\cdot\frac{BP}{PC}\cdot\frac{CQ}{QA}=1$。比は「頂点から分点まで ÷ 分点から次の頂点まで」の向きをそろえて 1 周します。`,
      pro: R`交点 $O$ の比（$AO:OP$ など）は、チェバで $AR:RB$ を出したあと、メネラウスを 1 回使うのが定石です（三角形 $ABP$ と直線 $RC$）。式は覚えるより「ぐるっと 1 周」で作ります。`
    },
    compute(v) {
      return v.mode === 'menelaus' ? menelausCalc(v) : cevaCalc(v);
    }
  });

  const CYCLE_EASY = R`式の作り方は「**ぐるっと 1 周**」です。ある頂点から出発して、分点まで進む長さと、分点から次の頂点まで進む長さの比をつくり、三角形を 1 周して 3 つの比をかけ合わせます。向きをそろえて 1 周する（$B\to P\to C$、$C\to Q\to A$、$A\to R\to B$）のがコツです。`;

  function cevaCalc(v) {
    const p1 = v.c_bp, p2 = v.c_pc, q1 = v.c_cq, q2 = v.c_qa;
    const [m3, n3] = ratio(p2 * q2, p1 * q1);              // AR : RB
    const [o1, o2] = ratio(m3 * (p1 + p2), n3 * p2);       // AO : OP
    const [bp, pc] = ratio(p1, p2), [cq, qa] = ratio(q1, q2);
    const steps = [];
    steps.push({
      t: 'チェバの定理',
      m: R`\frac{BP}{PC} \cdot \frac{CQ}{QA} \cdot \frac{AR}{RB} = 1`,
      n: R`三角形 $ABC$ の辺 $BC,\ CA,\ AB$ 上の点 $P,\ Q,\ R$ について、3 直線 $AP,\ BQ,\ CR$ が 1 点 $O$ で交わるならば、上の式が成り立ちます（逆も成り立ちます）。`,
      easy: CYCLE_EASY,
      pro: R`逆も使えます: 3 つの比の積が 1 なら 3 直線は 1 点で交わる（3 本の線が共点であることの証明）。`
    });
    steps.push({
      t: '分かっている比を代入する',
      m: [R`\frac{BP}{PC} = \frac{` + p1 + '}{' + p2 + R`},\qquad \frac{CQ}{QA} = \frac{` + q1 + '}{' + q2 + '}', R`\frac{` + p1 + '}{' + p2 + R`} \cdot \frac{` + q1 + '}{' + q2 + R`} \cdot \frac{AR}{RB} = 1`],
      n: R`$BP:PC=` + ratTex(p1, p2) + R`,\ CQ:QA=` + ratTex(q1, q2) + R`$ を比の値（分数）にして代入します。`,
      easy: R`$BP:PC=1:2$ なら、比の値は $\frac{BP}{PC}=\frac{1}{2}$ です。「前の数 ÷ 後ろの数」の分数にして式に入れます。`
    });
    steps.push({
      t: R`$\frac{AR}{RB}$ を求める`,
      m: [
        chain(R`\frac{AR}{RB}`, [R`\frac{PC}{BP} \cdot \frac{QA}{CQ}`, R`\frac{` + p2 + '}{' + p1 + R`} \cdot \frac{` + q2 + '}{' + q1 + '}', R`\frac{` + (p2 * q2) + '}{' + (p1 * q1) + '}', R`\frac{` + m3 + '}{' + n3 + '}']),
        R`AR : RB = ` + ratTex(m3, n3)
      ],
      n: R`両辺を、すでに分かっている 2 つの比の積でわる（逆数をかける）と、$\frac{AR}{RB}$ が求まります。`,
      easy: R`「$\square\times\frac{1}{2}\times 3=1$」のような式で $\square$ を求めるときと同じです。分かっている数の積でわって、$\square$ だけを残します。わり算は逆数（ひっくり返した数）をかけると計算できます。`
    });
    steps.push({
      t: R`交点 $O$ が $AP$ を分ける比 $AO:OP$（メネラウスの定理）`,
      m: [
        R`\triangle ABP \text{ と直線 } RC:\quad \frac{AR}{RB} \cdot \frac{BC}{CP} \cdot \frac{PO}{OA} = 1`,
        R`\frac{` + m3 + '}{' + n3 + R`} \cdot \frac{` + (p1 + p2) + '}{' + p2 + R`} \cdot \frac{PO}{OA} = 1 \;\Rightarrow\; \frac{AO}{OP} = \frac{` + m3 * (p1 + p2) + '}{' + n3 * p2 + '}',
        R`AO : OP = ` + ratTex(o1, o2)
      ],
      n: R`$BC=BP+PC=` + (p1 + p2) + R`$（比の単位）、$CP=PC=` + p2 + R`$ です。三角形 $ABP$ を直線 $RC$（点 $R,\ O,\ C$ が一直線上）が切っている、と見てメネラウスの定理を使います。`,
      easy: R`チェバの定理で $AR:RB$ が分かったので、次は交点 $O$ が線分 $AP$ をどんな比に分けるかを調べます。三角形 $ABP$ を、直線 $RC$ が切っているとみて、メネラウスの定理（1 周の式）を作ります。`,
      lv: 2
    });
    steps.push({
      t: '（参考）チェバの定理のみなもと（面積比）',
      m: [
        R`\frac{BP}{PC} = \frac{\triangle ABO}{\triangle ACO},\qquad \frac{CQ}{QA} = \frac{\triangle BCO}{\triangle BAO},\qquad \frac{AR}{RB} = \frac{\triangle CAO}{\triangle CBO}`,
        R`\frac{\triangle ABO}{\triangle ACO} \cdot \frac{\triangle BCO}{\triangle BAO} \cdot \frac{\triangle CAO}{\triangle CBO} = 1`
      ],
      n: R`高さが共通な 2 つの三角形の面積比は、底辺の比に等しくなります。3 つの比を面積比で表してかけ合わせると、分子と分母がすべて打ち消し合って 1 になります。`,
      easy: R`たとえば $\triangle ABO$ と $\triangle ACO$ は、頂点 $A$ から直線 $BC$ への高さではなく、$O$ から見た高さが共通ですが、底辺 $BP,\ PC$ の比がそのまま面積の比になります。3 つかけ算すると、同じ三角形が分子と分母に 1 回ずつ現れて、きれいに 1 になります。`,
      lv: 3
    });
    // 図
    const B = TRI.B, C = TRI.C, A = TRI.A;
    const Pp = divPt(B, C, p1, p2), Qp = divPt(C, A, q1, q2), Rp = divPt(A, B, m3, n3);
    const Op = lineIntersect(A, Pp, B, Qp);
    const fig = fitFigure(TRI, {
      extra: (d, T, sc, out) => {
        const a = T(A), b = T(B), c = T(C), p = T(Pp), q = T(Qp), r = T(Rp), o = T(Op);
        d.line(a[0], a[1], p[0], p[1], { cls: 'c2', w: 1.6 });
        d.line(b[0], b[1], q[0], q[1], { cls: 'c2', w: 1.6 });
        d.line(c[0], c[1], r[0], r[1], { cls: 'c2', w: 1.6 });
        [[p, 'P'], [q, 'Q'], [r, 'R']].forEach((e) => {
          d.dot(e[0][0], e[0][1], { cls: 'c2', r: 3 });
          const t = out(e[0], 12);
          d.text(t[0], t[1] + 4, e[1], { cls: 'fg', size: 13, italic: true });
        });
        d.dot(o[0], o[1], { cls: 'c3', r: 3.5 });
        d.text(o[0] + 9, o[1] + 14, 'O', { cls: 'fg', size: 13, italic: true });
        segText(d, b, p, String(p1), out, 14, 'c3'); segText(d, p, c, String(p2), out, 14, 'c3');
        segText(d, c, q, String(q1), out, 14, 'c3'); segText(d, q, a, String(q2), out, 14, 'c3');
        segText(d, a, r, String(m3), out, 14, 'c3'); segText(d, r, b, String(n3), out, 14, 'c3');
      }
    });
    return {
      result: [
        { label: '比 AR : RB', tex: R`AR : RB = ` + ratTex(m3, n3) },
        { label: '比の値 AR/RB', tex: R`\frac{AR}{RB} = \frac{` + m3 + '}{' + n3 + '}' },
        { label: '比 AO : OP', tex: R`AO : OP = ` + ratTex(o1, o2) },
        { label: '3 つの比の積', tex: R`\frac{` + bp + '}{' + pc + R`} \cdot \frac{` + cq + '}{' + qa + R`} \cdot \frac{` + m3 + '}{' + n3 + '} = ' + Q(bp * cq * m3, pc * qa * n3).tex() }
      ],
      steps: steps,
      fig: fig
    };
  }

  function menelausCalc(v) {
    const r1 = v.m_ar, r2 = v.m_rb, q1 = v.m_cq, q2 = v.m_qa;
    const [u, w] = ratio(r2 * q2, r1 * q1);                // BP : PC
    if (u === w) throw CE('AR : RB = QA : CQ のため、直線 RQ は辺 BC と平行になり、点 P はできません（BP : PC = 1 : 1 になる入力は使えません）。比を変えてください');
    const beyondC = u > w;
    const [ex1, ex2] = beyondC ? ratio(u - w, w) : ratio(w - u, u);     // BC : CP（C の外側）または BC : BP（B の外側）
    const steps = [];
    steps.push({
      t: 'メネラウスの定理',
      m: R`\frac{AR}{RB} \cdot \frac{BP}{PC} \cdot \frac{CQ}{QA} = 1`,
      n: R`三角形 $ABC$ の頂点を通らない直線が、直線 $AB,\ BC,\ CA$ とそれぞれ $R,\ P,\ Q$ で交わるとき、上の式が成り立ちます（交点のうち 0 個または 2 個は、辺の延長上にあります）。`,
      easy: CYCLE_EASY + R`メネラウスの定理では、交点の 1 つ（または 3 つ）が辺の**延長上**にあるので、そのとき「頂点から分点まで」の長さは、辺の長さ + はみ出した長さになります。`,
      pro: R`向きをそろえて 1 周すれば、チェバの定理と**同じ形**の式になります（チェバは積が $+1$、メネラウスは符号つきで見ると $-1$、という違いだけです）。`
    });
    steps.push({
      t: '分かっている比を代入する',
      m: [R`\frac{AR}{RB} = \frac{` + r1 + '}{' + r2 + R`},\qquad \frac{CQ}{QA} = \frac{` + q1 + '}{' + q2 + '}', R`\frac{` + r1 + '}{' + r2 + R`} \cdot \frac{BP}{PC} \cdot \frac{` + q1 + '}{' + q2 + '} = 1'],
      n: R`$AR:RB=` + ratTex(r1, r2) + R`,\ CQ:QA=` + ratTex(q1, q2) + R`$ を比の値にして代入します。`,
      easy: R`比 $2:3$ は、分数（比の値）にすると $\frac{2}{3}$ です。式に入れるときは、「前の数 ÷ 後ろの数」の分数にします。`
    });
    steps.push({
      t: R`$\frac{BP}{PC}$ を求める`,
      m: [
        chain(R`\frac{BP}{PC}`, [R`\frac{RB}{AR} \cdot \frac{QA}{CQ}`, R`\frac{` + r2 + '}{' + r1 + R`} \cdot \frac{` + q2 + '}{' + q1 + '}', R`\frac{` + (r2 * q2) + '}{' + (r1 * q1) + '}', R`\frac{` + u + '}{' + w + '}']),
        R`BP : PC = ` + ratTex(u, w)
      ],
      n: R`分かっている 2 つの比の積でわる（逆数をかける）と、$\frac{BP}{PC}$ が求まります。`,
      easy: R`チェバのときと同じ要領で、求めたい比 $\frac{BP}{PC}$ 以外の部分を、逆数にして右辺に移します。`
    });
    steps.push({
      t: R`点 $P$ の位置（辺の延長上のどちら側か）`,
      m: beyondC
        ? [R`BP : PC = ` + ratTex(u, w) + R` \;\Rightarrow\; BP > PC`, R`P \text{ は } C \text{ の外側（} BP = BC + CP \text{）}`, R`BC = BP - PC \;\Rightarrow\; BC : CP = ` + ratTex(u - w, w) + (ex1 !== u - w || ex2 !== w ? ' = ' + ratTex(ex1, ex2) : '')]
        : [R`BP : PC = ` + ratTex(u, w) + R` \;\Rightarrow\; BP < PC`, R`P \text{ は } B \text{ の外側（} PC = PB + BC \text{）}`, R`BC = PC - BP \;\Rightarrow\; BC : BP = ` + ratTex(w - u, u) + (ex1 !== w - u || ex2 !== u ? ' = ' + ratTex(ex1, ex2) : '')],
      n: beyondC
        ? R`$BP>PC$ なので、点 $P$ は $B$ から見て $C$ より遠く、**$C$ の側の延長上**にあります。$BP$ は $BC$ に $CP$ を足した長さです。`
        : R`$BP<PC$ なので、点 $P$ は $C$ から見て $B$ より遠く、**$B$ の側の延長上**にあります。$PC$ は $PB$ に $BC$ を足した長さです。`,
      easy: R`$BP$ と $PC$ のどちらが長いかで、点 $P$ が辺 $BC$ のどちら側の延長上にあるかが決まります。長いほうの端点から見て、もう一方の端点の向こう側に $P$ があります。延長上の点では $BP$ や $PC$ が「辺の長さ ＋ はみ出し」になるので、図をかいて確かめるのがコツです。`,
      lv: 2
    });
    steps.push({
      t: '（参考）メネラウスの定理のみなもと（高さの比）',
      m: [R`\frac{AR}{RB} = \frac{d_{A}}{d_{B}},\qquad \frac{BP}{PC} = \frac{d_{B}}{d_{C}},\qquad \frac{CQ}{QA} = \frac{d_{C}}{d_{A}}`, R`\frac{d_{A}}{d_{B}} \cdot \frac{d_{B}}{d_{C}} \cdot \frac{d_{C}}{d_{A}} = 1`],
      n: R`3 頂点 $A,\ B,\ C$ から直線 $RQ$ までの距離を $d_{A},\ d_{B},\ d_{C}$ とします。直線上の点で辺が分けられる比は、相似な直角三角形から、この距離の比に等しくなります。3 つかけ合わせると、すべて打ち消し合って 1 です。`,
      easy: R`交わる直線から、3 つの頂点までの距離（垂線の長さ）を考えます。たとえば $AR:RB$ は、$A$ と $B$ から直線までの距離の比 $d_{A}:d_{B}$ と同じ（相似な直角三角形ができるため）です。3 つの比をかけると、$d_{A},\ d_{B},\ d_{C}$ が 1 回ずつ分子と分母に出て、全部消えます。`,
      lv: 3
    });
    // 図
    const A = TRI.A, B = TRI.B, C = TRI.C;
    const Rp = divPt(A, B, r1, r2), Qp = divPt(C, A, q1, q2);
    const Pp = lineIntersect(Rp, Qp, B, C);
    const reach = Pp ? (Pp[0] > C[0] ? Pp[0] - C[0] : B[0] - Pp[0]) : 1e9;
    const showP = Pp && reach < 2.2 * (C[0] - B[0]);
    const fig = fitFigure(TRI, {
      extraPts: showP ? [Pp] : [],
      extra: (d, T, sc, out) => {
        const a = T(A), b = T(B), c = T(C), r = T(Rp), q = T(Qp);
        const far = showP ? T(Pp) : null;
        // 直線 RQ を、Q の先（P の方向）まで引く
        const dir = [q[0] - r[0], q[1] - r[1]], L = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]) || 1;
        const end = far || [q[0] + dir[0] / L * 40, q[1] + dir[1] / L * 40];
        const start = [r[0] - dir[0] / L * 14, r[1] - dir[1] / L * 14];
        d.line(start[0], start[1], end[0], end[1], { cls: 'c2', w: 1.6 });
        if (showP) {
          const from = Pp[0] > C[0] ? c : b;
          d.line(from[0], from[1], far[0], far[1], { cls: 'dim', dash: true, w: 1.3 });
          d.dot(far[0], far[1], { cls: 'c2', r: 3 });
          d.text(far[0], far[1] + 16, 'P', { cls: 'fg', size: 13, italic: true });
          d.text(far[0], far[1] + 30, 'BP : PC = ' + u + ' : ' + w, { cls: 'c3', size: 11.5 });
        } else {
          d.text(Math.min(Math.max(end[0], 40), 300), end[1] - 8, 'P は図の外（' + (beyondC ? 'C' : 'B') + ' の側）', { cls: 'dim', size: 11 });
        }
        [[r, 'R'], [q, 'Q']].forEach((e) => {
          d.dot(e[0][0], e[0][1], { cls: 'c2', r: 3 });
          const t = out(e[0], 12);
          d.text(t[0], t[1] + 4, e[1], { cls: 'fg', size: 13, italic: true });
        });
        segText(d, c, q, String(q1), out, 14, 'c3'); segText(d, q, a, String(q2), out, 14, 'c3');
        segText(d, a, r, String(r1), out, 14, 'c3'); segText(d, r, b, String(r2), out, 14, 'c3');
      }
    });
    return {
      result: [
        { label: '比 BP : PC', tex: R`BP : PC = ` + ratTex(u, w) },
        { label: '比の値 BP/PC', tex: R`\frac{BP}{PC} = \frac{` + u + '}{' + w + '}' },
        { label: '点 P の位置', tex: R`\text{辺 } BC \text{ を } ` + (beyondC ? 'C' : 'B') + R` \text{ の側に延長した線上}` },
        { label: beyondC ? '比 BC : CP' : '比 BC : BP', tex: (beyondC ? R`BC : CP = ` : R`BC : BP = `) + ratTex(ex1, ex2) }
      ],
      steps: steps,
      fig: fig
    };
  }

  /* ================= ia-power: 方べきの定理 ================= */

  // 円周上の 3 点 → 外接円の中心と半径
  function circle3(p, q, r) {
    const d = 2 * (p[0] * (q[1] - r[1]) + q[0] * (r[1] - p[1]) + r[0] * (p[1] - q[1]));
    const p2 = p[0] * p[0] + p[1] * p[1], q2 = q[0] * q[0] + q[1] * q[1], r2 = r[0] * r[0] + r[1] * r[1];
    const cx = (p2 * (q[1] - r[1]) + q2 * (r[1] - p[1]) + r2 * (p[1] - q[1])) / d;
    const cy = (p2 * (r[0] - q[0]) + q2 * (p[0] - r[0]) + r2 * (q[0] - p[0])) / d;
    return { cx: cx, cy: cy, r: Math.sqrt((p[0] - cx) * (p[0] - cx) + (p[1] - cy) * (p[1] - cy)) };
  }
  // 点・円を枠に収めて描く土台（数学座標 → 画面座標）
  function fitCanvas(pts, circ, W, H, M) {
    let x0 = circ.cx - circ.r, x1 = circ.cx + circ.r, y0 = circ.cy - circ.r, y1 = circ.cy + circ.r;
    pts.forEach((p) => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
    const sc = Math.min((W - 2 * M) / Math.max(x1 - x0, 1e-9), (H - 2 * M) / Math.max(y1 - y0, 1e-9));
    const ox = (W - sc * (x1 - x0)) / 2 - sc * x0, oy = (H + sc * (y1 - y0)) / 2 + sc * y0;
    const T = (p) => [ox + sc * p[0], oy - sc * p[1]];
    const d = JK.plot.draw(W, H);
    const c = T([circ.cx, circ.cy]);
    d.circle(c[0], c[1], circ.r * sc, { cls: 'fg', fill: 'f0' });
    return { d: d, T: T, sc: sc, centerPx: c };
  }

  JK.registerCalc({
    id: 'ia-power',
    course: 'IA',
    unit: 'm-geo',
    group: '図形の性質',
    title: '方べきの定理',
    desc: R`円と点 $P$ について、$P$ を通る 2 本の弦・割線では $PA\cdot PB=PC\cdot PD$、$P$ から接線 $PT$ と割線 $PAB$ を引くと $PT^{2}=PA\cdot PB$ が成り立ちます（方べきの定理）。分かっている長さから残りの長さを求めます。`,
    form: [R`PA \cdot PB = PC \cdot PD`, R`PT^{2} = PA \cdot PB`],
    inputs: [
      { key: 'mode', label: '使う形', type: 'select', def: 'chord', options: [['chord', '2 本の弦・割線（PA·PB = PC·PD）'], ['tangent', '接線と割線（PT² = PA·PB）']] },
      { key: 'pos', label: '点 P の位置', type: 'select', def: 'in', options: [['in', '円の内部（弦が P で交わる）'], ['out', '円の外部（2 本の割線）']], show: (raw) => raw.mode === 'chord' },
      { key: 'pa', label: R`$PA$`, type: 'q', def: '3', max: 1000, show: (raw) => raw.mode === 'chord' },
      { key: 'pb', label: R`$PB$`, type: 'q', def: '4', max: 1000, show: (raw) => raw.mode === 'chord' },
      { key: 'pc', label: R`$PC$`, type: 'q', def: '2', max: 1000, show: (raw) => raw.mode === 'chord', hint: R`$PD$ を求めます。円の外部のときは $A$ が $P$ に近いほうの交点（$PA<PB$）で、$PC<PD$ となるようにしてください。` },
      { key: 'unk', label: '求めるもの', type: 'select', def: 'pt', options: [['pt', '接線の長さ PT（PA, PB が分かっている）'], ['pb', '割線の PB（PT, PA が分かっている）'], ['pa', '割線の PA（PT, PB が分かっている）']], show: (raw) => raw.mode === 'tangent' },
      { key: 't_pa', label: R`$PA$（近いほうの交点まで）`, type: 'q', def: '2', max: 1000, show: (raw) => raw.mode === 'tangent' && raw.unk !== 'pa' },
      { key: 't_pb', label: R`$PB$（遠いほうの交点まで）`, type: 'q', def: '8', max: 1000, show: (raw) => raw.mode === 'tangent' && raw.unk !== 'pb' },
      { key: 't_pt', label: R`接線の長さ $PT$`, type: 'q', def: '4', max: 1000, show: (raw) => raw.mode === 'tangent' && raw.unk !== 'pt' }
    ],
    examples: [
      { label: '弦: PA=3, PB=4, PC=2', v: { mode: 'chord', pos: 'in', pa: '3', pb: '4', pc: '2' } },
      { label: '割線: PA=2, PB=9, PC=3', v: { mode: 'chord', pos: 'out', pa: '2', pb: '9', pc: '3' } },
      { label: '割線: PA=4, PB=10, PC=5', v: { mode: 'chord', pos: 'out', pa: '4', pb: '10', pc: '5' } },
      { label: '接線: PA=2, PB=8 → PT', v: { mode: 'tangent', unk: 'pt', t_pa: '2', t_pb: '8' } },
      { label: '接線: PT=6, PA=3 → PB', v: { mode: 'tangent', unk: 'pb', t_pt: '6', t_pa: '3' } },
      { label: '接線: PT=6, PB=12 → PA', v: { mode: 'tangent', unk: 'pa', t_pt: '6', t_pb: '12' } }
    ],
    intro: {
      easy: R`円と、円の内部または外部の点 $P$ があるとします。$P$ を通る直線が円と交わる 2 点を $A,\ B$ とすると、**$PA\times PB$ の値は、$P$ を通る直線の引き方によらず一定**です。これが**方べきの定理**です。
・$P$ が円の中にあるとき: 2 つの弦 $AB,\ CD$ が $P$ で交わり、$PA\cdot PB=PC\cdot PD$。
・$P$ が円の外にあるとき: 2 本の割線 $PAB,\ PCD$ で $PA\cdot PB=PC\cdot PD$。
・外の点から接線 $PT$ を引くと、接点 $T$ は $A=B$ の特別な場合なので $PT^{2}=PA\cdot PB$。`,
      normal: R`積 $PA\cdot PB$ を「$P$ からの長さ × $P$ からの長さ」で作ります（$P$ が円の内部なら弦を $P$ で 2 つに分けた 2 つの長さ、外部なら $P$ から近い交点と遠い交点までの長さ）。相似な三角形 $PAC\sim PDB$ が理由です。`,
      pro: R`外部の点では $PA\cdot PB$ は「$P$ から近い交点までの長さ × 遠い交点までの長さ」。弦の全長 $AB$ ではなく、**$P$ からの長さ**を使う点に注意します。接線の長さは $PT=\sqrt{PA\cdot PB}$。`
    },
    compute(v) {
      return v.mode === 'tangent' ? powerTangent(v) : powerChord(v);
    }
  });

  function powerChord(v) {
    const pa = v.pa, pb = v.pb, pc = v.pc, out = v.pos === 'out';
    needSide(pa, 'PA'); needSide(pb, 'PB'); needSide(pc, 'PC');
    const prod = pa.mul(pb), pd = prod.div(pc);
    if (out) {
      if (pa.cmp(pb) >= 0) throw CE('P が円の外にあるとき、A は P に近いほうの交点です。PA < PB となるように入力してください');
      if (pc.mul(pc).cmp(prod) >= 0) throw CE('PC が大きすぎます。P が円の外にあるとき、PC < PD となるには PC² < PA·PB（= ' + prod.toString() + '）でなければなりません（PC² = PA·PB のときは PC が接線の長さなので「接線と割線」を使ってください）');
    }
    const ab = out ? pb.sub(pa) : pa.add(pb), cd = out ? pd.sub(pc) : pc.add(pd);
    const pt = out ? sqrtQ(prod) : null;
    const steps = [];
    steps.push({
      t: '方べきの定理',
      m: R`PA \cdot PB = PC \cdot PD`,
      n: out
        ? R`円の外の点 $P$ から、円と $A,\ B$ および $C,\ D$ で交わる 2 本の割線を引くとき（$PA<PB,\ PC<PD$）、**$P$ から近い交点までの長さ × 遠い交点までの長さ**はどちらの割線でも等しくなります。`
        : R`円の中の点 $P$ で 2 つの弦 $AB,\ CD$ が交わるとき、**弦を $P$ で分けた 2 つの長さの積**は、どちらの弦でも等しくなります。`,
      easy: R`$P$ を通る直線を何本引いても、「$P$ から交点までの 2 つの長さのかけ算」は同じ値になる、という性質です。` + (out ? R`円の外から引いた割線では、$P$ から近い交点 $A$ までと、遠い交点 $B$ までの長さをかけます。` : R`円の中の弦では、$P$ が弦を 2 つに分けたそれぞれの長さ（$PA$ と $PB$）をかけます。`) + R`この「かけ算の値」を方べき（の値）とよびます。`,
      pro: R`$PA\cdot PB$ の $PB$ は「弦の残り」ではなく**$P$ から端点まで**です。外部の割線では $PB=PA+AB$ になります。`
    });
    steps.push({
      t: R`$PD$ を求める`,
      m: chain('PD', [R`\frac{PA \cdot PB}{PC}`, R`\frac{` + pa.tex() + R` \cdot ` + pb.tex() + '}{' + pc.tex() + '}', R`\frac{` + prod.tex() + '}{' + pc.tex() + '}', pd.tex()]),
      n: R`$PA\cdot PB=PC\cdot PD$ を $PD$ について解き、$PA=` + pa.tex() + R`,\ PB=` + pb.tex() + R`,\ PC=` + pc.tex() + R`$ を代入します。`,
      easy: R`「$3\times 4=2\times\square$」のような式で $\square$ を求めるときと同じです。左辺の積を先に計算して（$PA\cdot PB=` + prod.tex() + R`$）、$PC$ でわれば $PD$ が出ます。`
    });
    steps.push({
      t: R`弦（割線）の長さ $AB,\ CD$`,
      m: out
        ? [R`AB = PB - PA = ` + pb.tex() + ' - ' + pa.tex() + ' = ' + ab.tex(), R`CD = PD - PC = ` + pd.tex() + ' - ' + pc.tex() + ' = ' + cd.tex()]
        : [R`AB = PA + PB = ` + pa.tex() + ' + ' + pb.tex() + ' = ' + ab.tex(), R`CD = PC + PD = ` + pc.tex() + ' + ' + pd.tex() + ' = ' + cd.tex()],
      n: out ? R`外部では $P,\ A,\ B$ が一直線上に並ぶので、弦の長さは $PB$ から $PA$ を引いた長さです。` : R`内部では $P$ が弦 $AB$ を $PA$ と $PB$ に分けているので、$AB=PA+PB$ です。`,
      easy: out ? R`$P$ から $B$ までの長さ $PB$ のうち、手前の $PA$ の部分は円の外側なので、円の内側の弦 $AB$ は $PB-PA$ です。` : R`弦 $AB$ は、$P$ で $PA$ と $PB$ の 2 つに分かれているので、全体の長さは足し算です。`
    });
    if (out) {
      steps.push({
        t: R`接線の長さ $PT$ もこの値から求まる`,
        m: [R`PT^{2} = PA \cdot PB = PC \cdot PD = ` + prod.tex(), chain('PT', [R`\sqrt{` + prod.tex() + '}', sTex(pt)])],
        n: R`同じ点 $P$ から引いた接線の長さ $PT$ は、$PT^{2}=PA\cdot PB$（方べきの値）です。` + (pt.m > 1 ? R`（近似値は $PT\approx ` + fmt(sVal(pt)) + R`$）` : ''),
        easy: R`$P$ から円に接線を引くと、接点 $T$ は割線の 2 つの交点が重なった（$A=B=T$）特別な場合と考えられます。だから $PA\cdot PB$ の位置に $PT\cdot PT$ が入って、$PT^{2}=PA\cdot PB$ になります。`,
        lv: 2
      });
    }
    steps.push({
      t: '（参考）方べきの定理のみなもと（相似）',
      m: [R`\triangle PAC \sim \triangle PDB`, R`\frac{PA}{PD} = \frac{PC}{PB} \;\Rightarrow\; PA \cdot PB = PC \cdot PD`],
      n: out
        ? R`$\angle P$ は共通、$\angle PAC=\angle PDB$（円に内接する四角形 $ABDC$ の内角と対角の外角）なので、2 組の角が等しく $\triangle PAC\sim\triangle PDB$。対応する辺の比が等しいことから出ます。`
        : R`$\angle PAC=\angle PDB$（同じ弧 $BC$ に対する円周角）、$\angle APC=\angle DPB$（対頂角）で 2 組の角が等しいので $\triangle PAC\sim\triangle PDB$。対応する辺の比が等しいことから出ます。`,
      easy: R`方べきの定理は、相似な 2 つの三角形から導けます。円周角の定理（同じ弧に対する円周角は等しい）で、2 つの三角形の角が 2 組等しいことが分かり、相似になります。相似なら対応する辺の比が等しいので $\frac{PA}{PD}=\frac{PC}{PB}$、分母をはらうと $PA\cdot PB=PC\cdot PD$ です。`,
      lv: 3
    });
    // 図
    const phi = out ? 30 * RAD : 110 * RAD;
    const u1 = [1, 0], u2 = [Math.cos(phi), Math.sin(phi)];
    const av = pa.val(), bv = pb.val(), cv = pc.val(), dv = pd.val();
    const A = out ? [av * u1[0], 0] : [av, 0], B = out ? [bv, 0] : [-bv, 0];
    const C = [cv * u2[0], cv * u2[1]], D = out ? [dv * u2[0], dv * u2[1]] : [-dv * u2[0], -dv * u2[1]];
    const circ = circle3(A, B, C);
    const Pp = [0, 0];
    const cv2 = fitCanvas([A, B, C, D, Pp], circ, 340, 260, 30);
    const d = cv2.d, T = cv2.T, cc = cv2.centerPx;
    const lineFar = (p, q) => { const a = T(p), b = T(q); d.line(a[0], a[1], b[0], b[1], { cls: 'c2', w: 1.6 }); };
    lineFar(out ? Pp : A, B);                           // 外部: P から B まで（A は途中）/ 内部: 弦 AB
    lineFar(out ? Pp : C, D);
    const outward = (p, dist2) => { const dx = p[0] - cc[0], dy = p[1] - cc[1], L = Math.sqrt(dx * dx + dy * dy) || 1; return [p[0] + dx / L * dist2, p[1] + dy / L * dist2]; };
    [['A', A], ['B', B], ['C', C], ['D', D]].forEach((e) => {
      const p = T(e[1]);
      d.dot(p[0], p[1], { cls: 'c2', r: 3 });
      const t = outward(p, 13);
      d.text(t[0], t[1] + 4, e[0], { cls: 'fg', size: 13, italic: true });
    });
    const pP = T(Pp);
    d.dot(pP[0], pP[1], { cls: 'c3', r: 3.5 });
    d.text(pP[0] + (out ? -8 : 9), pP[1] + (out ? 15 : -7), 'P', { cls: 'fg', size: 13, italic: true });
    const sidePerp = (p, q, str, sgn) => {                // 線分 pq の中点から垂直に 10px ずらして長さを書く
      const a = T(p), b = T(q), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      d.text((a[0] + b[0]) / 2 - dy / L * 11 * sgn, (a[1] + b[1]) / 2 + dx / L * 11 * sgn + 4, str, { cls: 'c3', size: 12 });
    };
    sidePerp(Pp, A, pa.toString(), 1); sidePerp(Pp, B, pb.toString(), -1);
    sidePerp(Pp, C, pc.toString(), -1); sidePerp(Pp, D, pd.toString(), 1);
    return {
      result: [
        { label: 'PD の長さ', tex: 'PD = ' + pd.tex() },
        { label: '方べきの値 PA·PB', tex: R`PA \cdot PB = ` + prod.tex() },
        { label: '弦（割線）AB の長さ', tex: 'AB = ' + ab.tex() },
        { label: '弦（割線）CD の長さ', tex: 'CD = ' + cd.tex() }
      ].concat(out ? [{ label: '接線の長さ PT', tex: 'PT' + valEq(pt, sVal(pt)) }] : []),
      steps: steps,
      fig: d.svg()
    };
  }

  function powerTangent(v) {
    const unk = v.unk;
    let pa = v.t_pa, pb = v.t_pb, pt = v.t_pt;               // Q
    let ptS = null;                                        // 接線の長さ（S 型）
    if (unk !== 'pa') needSide(pa, 'PA');
    if (unk !== 'pb') needSide(pb, 'PB');
    if (unk !== 'pt') needSide(pt, 'PT');
    if (unk === 'pt') {
      if (pa.cmp(pb) >= 0) throw CE('A は P に近いほうの交点なので、PA < PB となるように入力してください');
      ptS = sqrtQ(pa.mul(pb));
    } else if (unk === 'pb') {
      pb = pt.mul(pt).div(pa);
      if (pb.cmp(pa) <= 0) throw CE('PT が小さすぎます。PB = PT²/PA が PA より大きくなる（PT > PA）ように入力してください');
      ptS = sQ(pt);
    } else {
      pa = pt.mul(pt).div(pb);
      if (pa.cmp(pb) >= 0) throw CE('PT が大きすぎます。PA = PT²/PB が PB より小さくなる（PT < PB）ように入力してください');
      ptS = sQ(pt);
    }
    const prod = pa.mul(pb), ab = pb.sub(pa);
    const ptv = sVal(ptS);
    const steps = [];
    steps.push({
      t: '方べきの定理（接線と割線）',
      m: R`PT^{2} = PA \cdot PB`,
      n: R`円の外の点 $P$ から、接線 $PT$（$T$ は接点）と、円と $A,\ B$ で交わる割線 $PAB$ を引くとき、**接線の長さの 2 乗**は、**$P$ から近い交点までの長さ × 遠い交点までの長さ**に等しくなります。`,
      easy: R`円の外の点から引いた接線は、円に 1 点だけで触れます。この「触れる点 $T$」は、割線の 2 つの交点 $A,\ B$ が 1 つに重なった特別な場合です。だから $PA\cdot PB$ の $A,\ B$ がどちらも $T$ になって、$PT\cdot PT=PT^{2}$ になる、と考えると式が覚えやすいです。`,
      pro: R`接線の長さ $PT=\sqrt{PA\cdot PB}$ は、円外の点から円への「距離の目安」になります。中心 $O$ までの距離 $d$、半径 $r$ のとき $PT^{2}=d^{2}-r^{2}$ とも書けます。`
    });
    if (unk === 'pt') {
      steps.push({
        t: R`接線の長さ $PT$ を求める`,
        m: [chain(R`PT^{2}`, [R`PA \cdot PB`, pa.tex() + R` \cdot ` + pb.tex(), prod.tex()]), chain('PT', [R`\sqrt{` + prod.tex() + '}', sTex(ptS)])],
        n: R`$PA=` + pa.tex() + R`,\ PB=` + pb.tex() + R`$ を代入して $PT^{2}$ を求め、正の平方根をとります（長さなので正）。` + (ptS.m > 1 ? R`（近似値は $PT\approx ` + fmt(ptv) + R`$）` : ''),
        easy: R`まず $PA\cdot PB$ のかけ算をして $PT^{2}$ の値を出し、その平方根をとれば $PT$ です。根号の中に 2 乗の因数があれば外に出して簡単にします。`
      });
    } else if (unk === 'pb') {
      steps.push({
        t: R`$PB$ を求める`,
        m: chain('PB', [R`\frac{PT^{2}}{PA}`, R`\frac{` + sq2(pt) + '}{' + pa.tex() + '}', R`\frac{` + pt.mul(pt).tex() + '}{' + pa.tex() + '}', pb.tex()]),
        n: R`$PT^{2}=PA\cdot PB$ を $PB$ について解き、$PT=` + pt.tex() + R`,\ PA=` + pa.tex() + R`$ を代入します。`,
        easy: R`$PT^{2}=PA\cdot PB$ の $PA$ をはさんで、「$PT^{2}\div PA$」で $PB$ が出ます。まず $PT$ を 2 乗してから、$PA$ でわります。`
      });
    } else {
      steps.push({
        t: R`$PA$ を求める`,
        m: chain('PA', [R`\frac{PT^{2}}{PB}`, R`\frac{` + sq2(pt) + '}{' + pb.tex() + '}', R`\frac{` + pt.mul(pt).tex() + '}{' + pb.tex() + '}', pa.tex()]),
        n: R`$PT^{2}=PA\cdot PB$ を $PA$ について解き、$PT=` + pt.tex() + R`,\ PB=` + pb.tex() + R`$ を代入します。`,
        easy: R`$PT^{2}=PA\cdot PB$ の $PB$ のほうを移項して、「$PT^{2}\div PB$」で $PA$ が出ます。まず $PT$ を 2 乗してから、$PB$ でわります。`
      });
    }
    steps.push({
      t: R`割線が円の内側を通る長さ $AB$`,
      m: R`AB = PB - PA = ` + pb.tex() + ' - ' + pa.tex() + ' = ' + ab.tex(),
      n: R`$P,\ A,\ B$ は一直線上に並び、$PB$ のうち手前の $PA$ の部分は円の外側なので、円の内側の弦 $AB$ は $PB-PA$ です。`,
      easy: R`$P$ から遠いほうの交点 $B$ までの長さ $PB$ から、近いほうの交点 $A$ までの長さ $PA$ を引くと、円の内側を通る部分の長さが出ます。`
    });
    steps.push({
      t: '検算: PT² と PA·PB が等しいか',
      m: [R`PT^{2} = ` + (ptS.m === 1 ? sq2(ptS.r) + ' = ' + sSq2(ptS).tex() : sSq2(ptS).tex()), R`PA \cdot PB = ` + pa.tex() + R` \cdot ` + pb.tex() + ' = ' + prod.tex()],
      n: R`2 つの値が一致すれば、計算は合っています。`,
      lv: 2
    });
    steps.push({
      t: '（参考）接線と割線の方べきのみなもと（相似）',
      m: [R`\triangle PTA \sim \triangle PBT`, R`\frac{PT}{PB} = \frac{PA}{PT} \;\Rightarrow\; PT^{2} = PA \cdot PB`],
      n: R`$\angle P$ は共通で、接線と弦のつくる角（接弦定理）から $\angle PTA=\angle PBT$ なので、2 組の角が等しく $\triangle PTA\sim\triangle PBT$。対応する辺の比が等しいことから出ます。`,
      easy: R`接線と弦がつくる角は、その弦に対する円周角に等しい（接弦定理）ので、三角形 $PTA$ と $PBT$ は 2 つの角が等しく、相似になります。相似な三角形では対応する辺の比が等しいので、$\frac{PT}{PB}=\frac{PA}{PT}$。分母をはらうと $PT^{2}=PA\cdot PB$ です。`,
      lv: 3
    });
    // 図: P=(0,0), A=(PA,0), B=(PB,0)
    const av = pa.val(), bv = pb.val();
    const ox = (av + bv) / 2, h = (bv - av) / 2 * 1.1;
    const circ = { cx: ox, cy: h, r: Math.sqrt(((bv - av) / 2) * ((bv - av) / 2) + h * h) };
    const dPO = Math.sqrt(ox * ox + h * h), tau = Math.asin(Math.min(1, circ.r / dPO)), phi = Math.atan2(h, ox);
    const T0 = [ptv * Math.cos(phi + tau), ptv * Math.sin(phi + tau)];
    const Pp = [0, 0], A = [av, 0], B = [bv, 0];
    const cv2 = fitCanvas([Pp, A, B, T0], circ, 340, 260, 30);
    const d = cv2.d, Tm = cv2.T, cc = cv2.centerPx;
    const l = (p, q, o) => { const a = Tm(p), b = Tm(q); d.line(a[0], a[1], b[0], b[1], o); };
    l(Pp, B, { cls: 'c2', w: 1.6 });
    l(Pp, T0, { cls: 'c3', w: 1.8 });
    const oc = Tm([circ.cx, circ.cy]);
    d.dot(oc[0], oc[1], { cls: 'dim', r: 2.5 });
    d.text(oc[0] + 8, oc[1] - 4, 'O', { cls: 'dim', size: 12, italic: true });
    const outward = (p, dist2) => { const dx = p[0] - cc[0], dy = p[1] - cc[1], L = Math.sqrt(dx * dx + dy * dy) || 1; return [p[0] + dx / L * dist2, p[1] + dy / L * dist2]; };
    [['A', A], ['B', B], ['T', T0]].forEach((e) => {
      const p = Tm(e[1]);
      d.dot(p[0], p[1], { cls: e[0] === 'T' ? 'c3' : 'c2', r: 3 });
      const t = outward(p, 13);
      d.text(t[0], t[1] + 4, e[0], { cls: 'fg', size: 13, italic: true });
    });
    const pP = Tm(Pp);
    d.dot(pP[0], pP[1], { cls: 'c3', r: 3.5 });
    d.text(pP[0] - 9, pP[1] + 15, 'P', { cls: 'fg', size: 13, italic: true });
    const sidePerp = (p, q, str, sgn, cls) => {
      const a = Tm(p), b = Tm(q), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      d.text((a[0] + b[0]) / 2 - dy / L * 11 * sgn, (a[1] + b[1]) / 2 + dx / L * 11 * sgn + 4, str, { cls: cls || 'c3', size: 12 });
    };
    sidePerp(Pp, A, pa.toString(), -1); sidePerp(A, B, ab.toString(), -1, 'dim'); sidePerp(Pp, T0, ptS.m === 1 ? ptS.r.toString() : '≈' + fmt(ptv, 2), 1);
    return {
      result: [
        { label: '接線の長さ PT', tex: 'PT' + valEq(ptS, ptv) },
        { label: 'PA の長さ', tex: 'PA = ' + pa.tex() },
        { label: 'PB の長さ', tex: 'PB = ' + pb.tex() },
        { label: '弦 AB の長さ', tex: 'AB = ' + ab.tex() }
      ],
      steps: steps,
      fig: d.svg()
    };
  }
})();
