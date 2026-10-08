/* 物理・力学 — 仕事と力学的エネルギー（unit: p-energy）
   mech-energy-conservation: 力学的エネルギー保存則（曲面をすべる / 振り子の最下点 / ばねで打ち出す）
   mech-work-friction: あらい面で止まるまでの距離（仕事とエネルギーの関係） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const G = 9.8;
  const PI = Math.PI;

  const sig = (x) => U.sig(x, 3);
  // 与えられた値の表示: 入力した値をそのまま（有効数字 10 桁まで。末尾の 0 は省く）。丸めて見せると、表示の数値どうしの計算が結果と合わなくなる
  const nf = (x) => {
    if (typeof x !== 'number' || !isFinite(x)) return U.fmt(x);
    const s = String(Number(x.toPrecision(10))), m = /^(-?[\d.]+)e([+-]?\d+)$/.exec(s);
    return m ? m[1] + R` \times 10^{` + Number(m[2]) + '}' : s;
  };
  const pn = (x) => U.paren(x);
  const P3 = (x) => U.roundSig(x, 3);
  const rad = (deg) => deg * PI / 180;
  const MS = R`\,\mathrm{m/s}`, MM = R`\,\mathrm{m}`, NN = R`\,\mathrm{N}`, SEC = R`\,\mathrm{s}`, JJ = R`\,\mathrm{J}`;
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const MS2 = R`\,\mathrm{m/s^{2}}`;

  // 途中の値の表示。x を有効数字 n 桁で書く（ちょうどの値は末尾の 0 を省く）
  const showN = (x, n) => {
    if (x === 0 || !isFinite(x)) return U.fmt(x);
    const r = U.roundSig(x, n), e = Math.floor(Math.log10(Math.abs(r)));
    if (e >= 7 || e < -3) return U.sig(r, n);
    let s = r.toFixed(Math.max(0, n - 1 - e));
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  };
  // 途中の値 vals を、あとの式 f（表示した値を代入して計算する関数。複数の結果は配列で返す）の結果が、丸める前の値から計算した target
  // （数値または配列）と有効数字 3 桁で一致する最小の桁数で書く。生徒が表示の数値どうしを電卓で計算しても、表示の結果と最後の桁まで合う
  const fit = (vals, f, target) => {
    const want = [].concat(target).map(P3);
    for (let n = 3; n <= 12; n++) {
      const got = [].concat(f.apply(null, vals.map((x) => U.roundSig(x, n)))).map(P3);
      if (got.every((g, i) => g === want[i])) return vals.map((x) => showN(x, n));
    }
    return vals.map((x) => showN(x, 12));
  };
  // 計算し直した結果 q が、丸める前の結果 r と、keys のすべてで有効数字 3 桁まで一致するか（どちらも未定義の項目は一致とみなす）
  const sameResults = (q, r, keys) => keys.every((k) => (r[k] === undefined && q[k] === undefined) || (r[k] !== undefined && q[k] !== undefined && P3(q[k]) === P3(r[k])));
  // 途中の値を 3 桁より多い桁（s）で代入したときの断り書き（3 桁と同じなら書かない）。sym: 記号、unit: 単位（TeX）
  const unrounded = (sym, s, x, unit) => (s === showN(x, 3) ? '' : R`式に入れる $` + sym + R`$ は、丸める前の値 $` + s + unit + R`$ です。`);

  // 図の文字用: 有効数字 3 桁の平文
  function pl(x) {
    if (!isFinite(x)) return '';
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = U.roundSig(x / Math.pow(10, e), 3);
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return m + '×10' + String(e).replace(/-/g, '⁻').replace(/\d/g, (c) => SUP[c]);
    }
    return String(U.roundSig(x, 3));
  }

  /* =====================================================================
     力学的エネルギー保存則
     ===================================================================== */
  function solveCurve(m, h, v0, h2) {
    const r = { kind: 'curve', m: m, h: h, v0: v0, h2: h2 };
    r.E = 0.5 * m * v0 * v0 + m * G * h;
    r.v2sq = v0 * v0 + 2 * G * (h - h2);
    r.Hr = h + v0 * v0 / (2 * G);                       // 到達できる最高の高さ
    r.vb = Math.sqrt(v0 * v0 + 2 * G * h);              // 基準面（高さ 0）を通る速さ
    r.K1 = 0.5 * m * v0 * v0; r.U1 = m * G * h;
    if (r.v2sq >= 0) { r.v = Math.sqrt(r.v2sq); r.K2 = 0.5 * m * r.v * r.v; r.U2 = m * G * h2; }
    return r;
  }
  // c: cosθ の値。解説で表示した値で計算し直して確かめるときに渡す。省略すると θ から求める（90° の 6e-17 は 0 にする）
  function solvePend(m, L, thDeg, c) {
    const th = rad(thDeg);
    const r = { kind: 'pendulum', m: m, L: L, thDeg: thDeg, th: th };
    r.c = c != null ? c : (Math.abs(Math.cos(th)) < 1e-12 ? 0 : Math.cos(th));
    r.dh = L * (1 - r.c);
    r.v = Math.sqrt(2 * G * r.dh);
    r.T = m * G + m * r.v * r.v / L;                    // = mg(3 - 2cosθ)
    r.W = m * G;
    r.K = m * G * r.dh;
    return r;
  }
  function solveSpring(m, k, x) {
    const r = { kind: 'spring', m: m, k: k, x: x };
    r.Ue = 0.5 * k * x * x;
    r.v = x * Math.sqrt(k / m);
    r.H = r.v * r.v / (2 * G);
    return r;
  }

  // ---- 図: 曲面 ----
  function figCurve(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, 264);
    const y0 = 212, xc = 186, w = 148;
    const Hd = Math.max(r.h, r.h2, r.Hr, 1e-9) * 1.15;
    const s = 148 / Hd;
    const yOf = (hh) => y0 - s * hh;
    const xL = (hh) => xc - w * Math.sqrt(Math.min(1, hh / Hd));
    const xR = (hh) => xc + w * Math.sqrt(Math.min(1, hh / Hd));
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const x = xc - w + 2 * w * i / 60;
      pts.push([x, yOf(Hd * Math.pow((x - xc) / w, 2))]);
    }
    pts.push([xc + w, y0 + 18], [xc - w, y0 + 18]);
    d.poly(pts, { cls: 'fg', fill: 'f0' });
    d.line(14, y0, 346, y0, { cls: 'dim', dash: true, w: 1 });
    d.text(xc, y0 + 14, '基準面（高さ 0）', { cls: 'dim', size: 11 });
    // トラック上の点（球の中心）と、その点での進行方向（右向き）
    const ball = (xs, hh) => {
      const ms = -2 * s * Hd * (xs - xc) / (w * w);       // 画面上の傾き dy/dx
      const nrm = Math.sqrt(1 + ms * ms);
      const nx = ms / nrm, ny = -1 / nrm;                 // 曲面の外向き（上向き）法線
      const sx = xs, sy = yOf(hh);
      return { cx: sx + 9 * nx, cy: sy + 9 * ny, tx: 1 / nrm, ty: ms / nrm, sx: sx, sy: sy };
    };
    const A = ball(xL(r.h), r.h);
    const x2 = r.h2 > 0 ? xR(r.h2) : xc;
    const B = ball(x2, r.h2);
    // 高さの寸法線
    const dim = (x, hh, lab, anchor) => {
      d.line(x, y0, x, yOf(hh), { cls: 'c3', w: 1.4 });
      d.line(x - 4, yOf(hh), x + 4, yOf(hh), { cls: 'c3', w: 1.4 });
      d.text(x + (anchor === 'end' ? -6 : 6), (y0 + yOf(hh)) / 2 + 4, lab, { cls: 'c3', size: 12, italic: true, anchor: anchor });
    };
    if (r.h > 0) {
      d.line(26, yOf(r.h), A.cx, A.cy, { cls: 'dim', dash: true, w: 1 });
      dim(26, r.h, 'h', 'end');
    }
    if (r.h2 > 0) {
      d.line(B.cx, B.cy, 346, yOf(r.h2), { cls: 'dim', dash: true, w: 1 });
      dim(346, r.h2, 'h₂', 'end');
    }
    // 到達できる最高点（v₀ > 0 のとき）
    if (!prob && r.v0 > 0) {
      const xh = xR(r.Hr), Hb = ball(xh, r.Hr);
      d.circle(Hb.cx, Hb.cy, 8, { cls: 'dim', dash: true });
      d.line(Hb.cx, Hb.cy, 346, yOf(r.Hr), { cls: 'dim', dash: true, w: 1 });
      d.text(Hb.cx - 12, Hb.cy - 8, '最高点 H', { cls: 'dim', size: 11, anchor: 'end' });
    }
    d.circle(A.cx, A.cy, 8, { cls: 'fg', fill: 'f3' });
    d.text(A.cx - 3, A.cy - 14, 'A', { size: 12, bold: true });
    d.circle(B.cx, B.cy, 8, { cls: 'fg', fill: 'f1' });
    d.text(B.cx, B.cy - 14, 'B', { size: 12, bold: true });
    if (r.v0 > 0) {
      d.arrow(A.cx + 10 * A.tx, A.cy + 10 * A.ty, A.cx + 48 * A.tx, A.cy + 48 * A.ty, { cls: 'c1', label: 'v₀', w: 2 });
    }
    if (!prob && r.v > 0) {
      d.arrow(B.cx + 10 * B.tx, B.cy + 10 * B.ty, B.cx + 48 * B.tx, B.cy + 48 * B.ty, { cls: 'c2', label: 'v', lpos: -1, w: 2 });
    }
    d.text(180, 256, 'm = ' + pl(r.m) + ' kg　h = ' + pl(r.h) + ' m　v₀ = ' + pl(r.v0) + ' m/s' + (r.h2 > 0 || !prob ? '　h₂ = ' + pl(r.h2) + ' m' : ''), { size: 12 });
    return d.svg();
  }

  // ---- 図: 振り子 ----
  function figPend(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, 258);
    const px = 196, py = 28, Ls = 150;
    const thd = r.thDeg, th = r.th;
    const rx = px - Ls * Math.sin(th), ry = py + Ls * Math.cos(th);
    const bx = px, by = py + Ls;
    d.hatch(px - 70, py - 18, px + 70, py - 18, { side: -1 });
    d.line(px, py - 18, px, py, { cls: 'fg', w: 1.6 });
    d.dot(px, py, { cls: 'fg', r: 3 });
    d.line(14, by, 346, by, { cls: 'dim', dash: true, w: 1 });
    d.text(346, by + 14, '基準面（最下点の高さ）', { cls: 'dim', size: 11, anchor: 'end' });
    d.line(px, py, px, by + 26, { cls: 'dim', dash: true, w: 1 });
    d.arc(px, py, Ls, -90 - thd, -90, { cls: 'dim', dash: true, w: 1.2 });
    d.line(px, py, rx, ry, { cls: 'fg', w: 1.6 });
    if (o.th1 != null) {
      const t1 = rad(o.th1), x1 = px - Ls * Math.sin(t1), y1 = py + Ls * Math.cos(t1);
      d.line(px, py, x1, y1, { cls: 'dim', dash: true, w: 1.2 });
      d.circle(x1, y1, 8, { cls: 'dim', dash: true });
      d.angle(px, py, 70, -90 - o.th1, -90, 'θ₁', { cls: 'c2' });
    }
    d.angle(px, py, 44, -90 - thd, -90, 'θ', { cls: 'c3' });
    d.circle(rx, ry, 10, { cls: 'fg', fill: 'f3' });
    d.circle(bx, by, 10, { cls: 'fg', fill: 'f1' });
    d.text(rx - 16, ry + 4, 'A', { size: 12, bold: true });
    d.text(bx + 18, by + 22, 'B', { size: 12, bold: true });
    // 高さの差
    d.line(rx, ry, 330, ry, { cls: 'dim', dash: true, w: 1 });
    d.line(330, ry, 330, by, { cls: 'c3', w: 1.4 });
    d.line(326, ry, 334, ry, { cls: 'c3', w: 1.4 });
    d.line(326, by, 334, by, { cls: 'c3', w: 1.4 });
    d.text(324, (ry + by) / 2 + 4, 'Δh', { cls: 'c3', size: 12, italic: true, anchor: 'end' });
    if (!prob) {
      d.arrow(bx + 14, by, bx + 66, by, { cls: 'c1', label: 'v', w: 2.2 });
      const k = 34 / r.W;
      d.arrow(bx, by - 11, bx, by - 11 - k * r.T, { cls: 'c2', label: 'T', lpos: -1, w: 2.2 });
      d.arrow(bx, by + 11, bx, by + 11 + k * r.W, { cls: 'c3', label: 'mg', w: 2.2 });
    }
    d.text(180, 250, 'm = ' + pl(r.m) + ' kg　L = ' + pl(r.L) + ' m　θ = ' + pl(thd) + '°', { size: 12 });
    return d.svg();
  }

  // ---- 図: ばねで打ち出す ----
  function figSpring(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, 230);
    const fy = 156, wx = 24, Lc = 56, xpx = 34;
    d.hatch(wx, fy - 56, wx, fy);
    d.hatch(wx, fy, 214, fy);
    // 斜面（なめらか）
    const sx = 214, tx = 334, ty = fy - 104;
    d.poly([[sx, fy], [tx, ty], [tx, fy]], { cls: 'fg', fill: 'f0' });
    // 圧縮されたばねと物体
    const xb = wx + Lc;
    d.spring(wx, fy - 22, xb, fy - 22, { n: 6, amp: 7, cls: 'fg' });
    d.rect(xb, fy - 44, 40, 44, { cls: 'fg', fill: 'f1', rx: 3 });
    d.text(xb + 20, fy - 17, 'm', { size: 13, italic: true });
    d.line(xb + xpx, fy - 62, xb + xpx, fy - 6, { cls: 'dim', dash: true, w: 1 });
    d.arrow(xb + xpx, fy - 56, xb, fy - 56, { cls: 'c3', w: 1.6 });
    d.arrow(xb, fy - 56, xb + xpx, fy - 56, { cls: 'c3', w: 1.6 });
    d.text(xb + xpx / 2, fy - 66, 'x', { cls: 'c3', size: 12, italic: true });
    d.text(xb + xpx + 6, fy - 66, '自然長の位置', { cls: 'dim', size: 10, anchor: 'start' });
    // 離れた後の物体（破線）と速さ
    d.rect(130, fy - 30, 34, 30, { cls: 'dim', dash: true, rx: 3 });
    d.arrow(170, fy - 15, 206, fy - 15, { cls: 'c2', label: 'v', w: 2.2 });
    // 斜面を上がった最高点（破線）
    const ang = Math.atan2(fy - ty, tx - sx), n = [-Math.sin(ang), -Math.cos(ang)];
    const sp = [sx + (tx - sx) * 0.78, fy - (fy - ty) * 0.78];
    const gc = [sp[0] + n[0] * 14, sp[1] + n[1] * 14];
    d.rect(gc[0] - 17, gc[1] - 11, 34, 22, { cls: 'dim', dash: true, rx: 3, rot: ang * 180 / PI, ox: gc[0], oy: gc[1] });
    d.line(gc[0] + 6, gc[1], 346, gc[1], { cls: 'dim', dash: true, w: 1 });
    d.line(346, fy, 346, gc[1], { cls: 'c3', w: 1.4 });
    d.line(342, gc[1], 350, gc[1], { cls: 'c3', w: 1.4 });
    d.text(342, (fy + gc[1]) / 2 + 4, 'H', { cls: 'c3', size: 12, italic: true, anchor: 'end' });
    d.text(180, 194, 'ばね定数 k = ' + pl(r.k) + ' N/m　縮み x = ' + pl(r.x) + ' m　m = ' + pl(r.m) + ' kg', { size: 12 });
    d.text(180, 212, prob ? 'なめらかな水平面と斜面' : 'なめらかな面: 弾性エネルギー → 運動エネルギー → 位置エネルギー', { cls: 'dim', size: 11 });
    return d.svg();
  }

  const figEnergy = (r, o) => (r.kind === 'curve' ? figCurve(r, o) : (r.kind === 'pendulum' ? figPend(r, o) : figSpring(r, o)));

  // ---- 解説 ----
  const stCond = (extra) => ({
    t: '力学的エネルギーが保存される条件を確かめる',
    n: extra + R`**力学的エネルギー**（運動エネルギー $\frac{1}{2}mv^{2}$ と位置エネルギーの和）は、仕事をするのが保存力（重力・弾性力）だけのときに保存されます。運動の向きに垂直な力（垂直抗力・張力）は仕事をしないので、保存則を使ってよいです。`,
    easy: R`エネルギーとは、「物体が持っている、仕事をする能力」のことです。高いところにある物体は、落ちるときに速くなれるので**位置エネルギー**を持っています。動いている物体は**運動エネルギー**を持っています。摩擦や空気抵抗がなければ、位置エネルギーが減った分だけ運動エネルギーが増え、その合計（力学的エネルギー）は変わりません。これを**力学的エネルギー保存則**といいます。`,
    pro: R`保存則が使える条件は「非保存力（摩擦・抵抗・外力）が仕事をしない」こと。垂直抗力と張力は運動と垂直なので仕事 0。条件を一言添えてから立式する。`
  });

  // o.given: 演習で、問題の値と記号を結びつける文 / o.askK: 点 B での運動エネルギー K_B を問うとき true / o.askH: 到達できる最高の高さ H を問うとき true（その段を lv 1 にする）
  function curveSteps(r, o) {
    o = o || {};
    const steps = [];
    steps.push(stCond((o.given || '') + R`物体は、重力 $mg$ と曲面からの垂直抗力 $N$ を受けて、なめらかな曲面上を動きます（摩擦なし）。はじめの位置を A（高さ $h$）、調べる位置を B（高さ $h_{2}$）とします。`));
    steps.push({
      t: '基準面を決めて、各点のエネルギーを式にする',
      m: [R`K = \frac{1}{2}mv^{2},\qquad U = mgh`,
        R`K_{A} = \frac{1}{2} \times ` + nf(r.m) + R` \times ` + nf(r.v0) + R`^{2} = ` + sig(r.K1) + JJ + R`,\qquad U_{A} = ` + nf(r.m) + R` \times 9.8 \times ` + nf(r.h) + ' = ' + sig(r.U1) + JJ],
      n: R`基準面（高さ 0）を決めると、高さ $h$ の位置エネルギーは $mgh$ です。A の力学的エネルギーは $E = K_{A} + U_{A} = ` + sig(r.E) + R`\,\mathrm{J}$ です。`,
      easy: R`位置エネルギーは「どこを高さ 0 とするか」で値が変わります。ここでは図の点線の面（基準面）を高さ 0 とします。基準面より上なら正、下なら負です。A での運動エネルギーは、最初の速さ $v_{0}$ から計算します。`,
      lv: 2
    });
    steps.push({
      t: '力学的エネルギー保存則を立てる',
      m: [R`K_{A} + U_{A} = K_{B} + U_{B}`, R`\frac{1}{2}mv_{0}^{2} + mgh = \frac{1}{2}mv^{2} + mgh_{2}`, R`v^{2} = v_{0}^{2} + 2g(h - h_{2})`],
      n: R`A と B で力学的エネルギーが等しいという式を立てます。すべての項に $m$ がふくまれるので、両辺の $m$ が消えて、**速さは質量によりません**。`,
      easy: R`「はじめの運動エネルギー + 位置エネルギー」と「あとの運動エネルギー + 位置エネルギー」が等しい、という式です。どの項にも質量 $m$ が入っているので、全体を $m$ で割ってしまえます。つまり、重い物体でも軽い物体でも、同じ高さの差なら同じ速さになります。`
    });
    if (r.v2sq >= 0) {
      // v² は、v と K_B の式に代入して計算し直しても結果が合う桁数で書く
      const v2S = fit([r.v2sq], (y) => [Math.sqrt(y), 0.5 * r.m * y], [r.v, r.K2])[0];
      steps.push({
        t: 'B での速さを求める',
        m: [R`v = \sqrt{v_{0}^{2} + 2g(h - h_{2})}`,
          R`v = \sqrt{` + nf(r.v0) + R`^{2} + 2 \times 9.8 \times (` + nf(r.h) + ' - ' + nf(r.h2) + R`)} = \sqrt{` + v2S + '} = ' + sig(r.v) + MS],
        n: R`B の方が低ければ速く（$v > v_{0}$）、高ければ遅く（$v < v_{0}$）なります。根号の中が負になる場合は、その高さには届きません。`,
        easy: R`根号の中は「はじめの速さの 2 乗 + $2g \times$（高さの差）」です。高さが下がった分だけ、位置エネルギーが運動エネルギーに変わって、速さの 2 乗が増えます。電卓で計算して、最後に平方根を取りましょう。`,
        pro: R`$v^{2} = v_{0}^{2} + 2g\Delta h$（$\Delta h$ は下がった高さ）は、等加速度運動の公式 $v^{2} - v_{0}^{2} = 2ax$ と同じ形。斜面・曲面によらず、高さの差だけで決まる。`
      });
      // K_B: 保存則から（与えられた値で直接）と、v² を使った式
      const kin0 = r.v0 > 0 ? R`\frac{1}{2} \times ` + nf(r.m) + R` \times ` + nf(r.v0) + R`^{2} + ` : '';
      const dh = r.h2 > 0 ? '(' + nf(r.h) + ' - ' + nf(r.h2) + ')' : nf(r.h);
      steps.push({
        t: 'B での運動エネルギー',
        m: [R`K_{B} = K_{A} + U_{A} - U_{B} = \frac{1}{2}mv_{0}^{2} + mg(h - h_{2})`,
          R`K_{B} = ` + kin0 + nf(r.m) + R` \times 9.8 \times ` + dh + ' = ' + sig(r.K2) + JJ,
          R`K_{B} = \frac{1}{2}mv^{2} = \frac{1}{2} \times ` + nf(r.m) + R` \times ` + v2S + ' = ' + sig(r.K2) + JJ],
        n: R`B での運動エネルギーは、保存則の式を $K_{B}$ について解いた $K_{B} = K_{A} + U_{A} - U_{B}$ で求められます。求めた速さを使って $K_{B} = \frac{1}{2}mv^{2}$ としても、同じ値になります。` + unrounded('v^{2}', v2S, r.v2sq, R`\,\mathrm{m^{2}/s^{2}}`),
        easy: R`運動エネルギーは「$\frac{1}{2} \times$ 質量 $\times$ 速さの 2 乗」です。保存則の「はじめの運動エネルギー + 位置エネルギー」から、B での位置エネルギーを引けば、B での運動エネルギーが残ります。`,
        pro: R`$K_{B} = K_{A} + U_{A} - U_{B}$（エネルギーの収支）。速さを先に求めなくても出せる。`,
        lv: o.askK ? 1 : 2
      });
      const KU = fit([r.K2, r.U2], (K, U) => K + U, r.E);
      steps.push({
        t: '検算（B での力学的エネルギー）',
        m: [R`U_{B} = mgh_{2} = ` + nf(r.m) + R` \times 9.8 \times ` + nf(r.h2) + ' = ' + sig(r.U2) + JJ,
          R`K_{B} + U_{B} = ` + KU[0] + ' + ' + KU[1] + ' = ' + sig(r.K2 + r.U2) + JJ + R`\quad (= E = ` + sig(r.E) + JJ + ')'],
        n: R`B での運動エネルギーと位置エネルギーの和が、A での力学的エネルギー $E$ に一致することを確かめます。`,
        lv: 2
      });
    }
    steps.push({
      t: '到達できる最高の高さ',
      m: [R`v = 0 \;\Rightarrow\; mgH = \frac{1}{2}mv_{0}^{2} + mgh \;\Rightarrow\; H = h + \frac{v_{0}^{2}}{2g}`,
        R`H = ` + nf(r.h) + R` + \frac{` + nf(r.v0) + R`^{2}}{2 \times 9.8} = ` + sig(r.Hr) + MM],
      n: R`曲面が十分に高くつづいているなら、運動エネルギーがすべて位置エネルギーになる（$v = 0$）高さまで上がります。それより高い所へは行けません。基準面（高さ 0）を通るときの速さは $\sqrt{v_{0}^{2} + 2gh} = ` + sig(r.vb) + R`\,\mathrm{m/s}$ です。`,
      lv: o.askH ? 1 : 2
    });
    return steps;
  }

  // 振り子の最下点での余弦の値（TeX）。計算機では、その値で計算し直した結果（Δh・v・T）が、丸める前の結果と 3 桁で一致する最小の桁数で書く
  function cosShow(r) {
    for (let n = 3; n <= 12; n++) {
      if (sameResults(solvePend(r.m, r.L, r.thDeg, U.roundSig(r.c, n)), r, ['dh', 'v', 'T'])) return showN(r.c, n);
    }
    return showN(r.c, 12);
  }

  // o.given: 演習で、問題の値と記号を結びつける文 / o.B: 演習で、最下点を B として $v_{B}$・$T_{B}$ と書くとき true
  function pendSteps(r, o) {
    o = o || {};
    const vs = o.B ? R`v_{B}` : R`v`, Ts = o.B ? R`T_{B}` : R`T`;
    const cS = cosShow(r);
    // v² は、v と T の式に代入して計算し直しても結果が合う桁数で書く
    const v2S = fit([r.v * r.v], (y) => [Math.sqrt(y), r.m * G + r.m * y / r.L], [r.v, r.T])[0];
    const steps = [];
    steps.push(stCond((o.given || '') + R`質量 $m$ のおもりが、長さ $L$ の糸の先で、鉛直から角 $\theta$ の位置 A から静かに放されて振れます。糸の張力 $T$ は、おもりの運動の向き（円弧の接線方向）に常に垂直なので、仕事をしません。`));
    steps.push({
      t: '高さの差を求める',
      m: [R`\Delta h = L - L\cos\theta = L(1 - \cos\theta)`,
        R`\Delta h = ` + nf(r.L) + R` \times (1 - ` + cS + ') = ' + sig(r.dh) + MM],
      n: R`最下点 B を基準にすると、A の高さは $L - L\cos\theta$ です（図の $\Delta h$）。糸の長さ $L$ と、糸が鉛直方向にしめす長さ $L\cos\theta$ との差です。`,
      easy: R`おもりが A から最下点 B まで下がる高さを求めます。糸を伸ばした長さ $L$ のうち、A の位置では鉛直方向に $L\cos\theta$ しか下に伸びていません。残りの $L - L\cos\theta$ が、B まで下がる高さです。$\theta = 90\degree$（真横）なら $\cos\theta = 0$ で、$\Delta h = L$ になります。`,
      lv: 2
    });
    steps.push({
      t: '力学的エネルギー保存則で最下点の速さを求める',
      m: [R`mg\Delta h = \frac{1}{2}m` + vs + R`^{2}`, vs + R` = \sqrt{2g\Delta h} = \sqrt{2gL(1 - \cos\theta)}`,
        vs + R` = \sqrt{2 \times 9.8 \times ` + nf(r.L) + R` \times (1 - ` + cS + R`)} = \sqrt{` + v2S + '} = ' + sig(r.v) + MS],
      n: R`A（速さ 0、高さ $\Delta h$）と B（高さ 0、速さ $` + vs + R`$）で力学的エネルギーが等しいので、$mg\Delta h = \frac{1}{2}m` + vs + R`^{2}$ です。$m$ が消えるので、速さは質量によりません。` + unrounded(vs + R`^{2}`, v2S, r.v * r.v, R`\,\mathrm{m^{2}/s^{2}}`),
      easy: R`A では止まっている（運動エネルギー 0）ので、持っているのは位置エネルギー $mg\Delta h$ だけです。B は基準面にあるので、位置エネルギー 0、持っているのは運動エネルギー $\frac{1}{2}m` + vs + R`^{2}$ だけです。この 2 つが等しい、という式から $` + vs + R`$ が出ます。`,
      pro: R`$v = \sqrt{2gL(1 - \cos\theta)}$。$\theta = 90\degree$ なら $v = \sqrt{2gL}$、$\theta = 60\degree$ なら $v = \sqrt{gL}$。`
    });
    steps.push({
      t: '最下点での糸の張力（円運動の運動方程式）',
      m: [R`m\frac{` + vs + R`^{2}}{L} = ` + Ts + R` - mg`, Ts + R` = mg + m\frac{` + vs + R`^{2}}{L} = mg(3 - 2\cos\theta)`,
        Ts + R` = ` + nf(r.m) + R` \times 9.8 + ` + nf(r.m) + R` \times \frac{` + v2S + '}{' + nf(r.L) + '} = ' + sig(r.T) + NN,
        Ts + R` = ` + nf(r.m) + R` \times 9.8 \times (3 - 2 \times ` + cS + ') = ' + sig(r.T) + NN],
      n: R`最下点では、おもりは半径 $L$ の円運動をしています。向心加速度 $\frac{` + vs + R`^{2}}{L}$ は、円の中心（真上）向きです。上向きを正とすると、向心方向の運動方程式は $m\frac{` + vs + R`^{2}}{L} = ` + Ts + R` - mg$ となり、張力は重力 $mg$ より大きくなります。$mg + m\frac{` + vs + R`^{2}}{L}$ に $` + vs + R`^{2} = 2gL(1 - \cos\theta)$ を代入して整理した $mg(3 - 2\cos\theta)$ で計算しても、同じ値になります。`,
      easy: R`最下点では、おもりは円を描いて動いているので、糸はおもりを円の中心（真上）の方向へ引き続けています。この「向きを曲げる力」の分だけ、糸の張力は重さ $mg$ より大きくなります。式にすると、「質量 × 向心加速度 $\frac{` + vs + R`^{2}}{L}$ = 上向きの張力 − 下向きの重力」です。`,
      pro: R`最下点の張力 $T = mg(3 - 2\cos\theta)$（$\theta = 90\degree$ で $3mg$、$60\degree$ で $2mg$）。糸の長さ $L$ によらない。`
    });
    return steps;
  }

  // o.given: 演習で、問題の値と記号を結びつける文
  function springSteps(r, o) {
    o = o || {};
    const steps = [];
    steps.push(stCond((o.given || '') + R`ばね（ばね定数 $k$）を自然長から $x$ だけ縮めて物体（質量 $m$）に当て、静かに放します。なめらかな水平面なので摩擦はなく、弾性力（保存力）だけが仕事をします。`));
    steps.push({
      t: 'ばねの弾性エネルギー',
      m: [R`U_{e} = \frac{1}{2}kx^{2}`, R`U_{e} = \frac{1}{2} \times ` + nf(r.k) + R` \times ` + nf(r.x) + R`^{2} = ` + sig(r.Ue) + JJ],
      n: R`ばねを自然長から $x$ だけ縮めたとき、ばねにたくわえられるエネルギー（弾性エネルギー）は $\frac{1}{2}kx^{2}$ です。縮みが 2 倍になると、エネルギーは 4 倍になります。`,
      easy: R`ばねは、縮めるほど強い力で押し返してきます（力は $kx$）。その力に逆らって少しずつ縮めるのに必要な仕事の合計が $\frac{1}{2}kx^{2}$（グラフ $F = kx$ の三角形の面積）で、これがばねに「ためこまれた」エネルギーです。放すと、このエネルギーが物体の運動エネルギーに変わります。`
    });
    steps.push({
      t: '保存則で、ばねから離れるときの速さを求める',
      m: [R`\frac{1}{2}kx^{2} = \frac{1}{2}mv^{2} \;\Rightarrow\; v = x\sqrt{\frac{k}{m}}`,
        R`v = ` + nf(r.x) + R` \times \sqrt{\frac{` + nf(r.k) + '}{' + nf(r.m) + '}} = ' + sig(r.v) + MS],
      n: R`ばねが自然長にもどった位置で、物体はばねから離れます。そのとき弾性エネルギーはすべて運動エネルギーに変わっているので、$\frac{1}{2}kx^{2} = \frac{1}{2}mv^{2}$ です。`,
      easy: R`放した後、ばねは自然長までのびきったところで物体を離します。ためこんだ弾性エネルギー $\frac{1}{2}kx^{2}$ が、すべて物体の運動エネルギー $\frac{1}{2}mv^{2}$ に変わった、とみなして式を立てます。両辺の $\frac{1}{2}$ を消して $v$ について解くと $v = x\sqrt{k/m}$ です。`,
      pro: R`$v = x\sqrt{k/m}$（単振動の最大の速さ $A\omega$ と同じ形）。$k$ が大きいほど、$m$ が小さいほど速い。`
    });
    steps.push({
      t: 'なめらかな斜面を上がる高さ',
      m: [R`\frac{1}{2}mv^{2} = mgH \;\Rightarrow\; H = \frac{v^{2}}{2g} = \frac{kx^{2}}{2mg}`,
        R`H = \frac{kx^{2}}{2mg} = \frac{` + nf(r.k) + R` \times ` + nf(r.x) + R`^{2}}{2 \times ` + nf(r.m) + R` \times 9.8} = ` + sig(r.H) + MM],
      n: R`その後、物体が十分に長いなめらかな斜面を上がると、運動エネルギーがすべて位置エネルギーに変わる高さ $H$ で一瞬止まります（斜面の角度にはよりません）。$v^{2} = \frac{kx^{2}}{m}$ を代入すると、速さを経由せずに、ばねの値から直接 $H$ が出ます。`,
      easy: R`斜面を上がるほど速さは減って、位置エネルギーが増えていきます。止まる高さでは、運動エネルギーがすべて位置エネルギー $mgH$ に変わっています。だから $\frac{1}{2}mv^{2} = mgH$ です。ばねで蓄えたエネルギー → 運動エネルギー → 位置エネルギー、とエネルギーが姿を変えるだけで、合計は変わりません。`
    });
    return steps;
  }

  const energySteps = (r, o) => (r.kind === 'curve' ? curveSteps(r, o) : (r.kind === 'pendulum' ? pendSteps(r, o) : springSteps(r, o)));

  JK.registerSim({
    id: 'mech-energy-conservation',
    field: '力学',
    unit: 'p-energy',
    title: '力学的エネルギー保存則（曲面・振り子・ばね）',
    desc: R`摩擦のない場面で、力学的エネルギー（運動エネルギー + 位置エネルギー）が保存されることを使って、速さ・張力・到達する高さを求めます。「曲面をすべる」「振り子の最下点」「ばねで打ち出す」から選べます。`,
    form: [R`\frac{1}{2}mv^{2} + mgh = \text{一定}`, R`\frac{1}{2}mv_{0}^{2} + mgh = \frac{1}{2}mv^{2} + mgh_{2}`, R`\frac{1}{2}kx^{2} = \frac{1}{2}mv^{2}`],
    inputs: [
      { key: 'kind', label: '場面', type: 'select', def: 'curve', options: [['curve', 'なめらかな曲面をすべる'], ['pendulum', '振り子（最下点の速さ・張力）'], ['spring', 'ばねで打ち出す']] },
      { key: 'm', label: '質量 m', unit: 'kg', type: 'num', def: '2.0', min: 0.001, max: 1000 },
      { key: 'h', label: 'はじめの高さ h（基準面から）', unit: 'm', type: 'num', def: '5.0', min: 0, max: 1000, show: (raw) => raw.kind === 'curve' },
      { key: 'v0', label: 'はじめの速さ v₀', unit: 'm/s', type: 'num', def: '0', min: 0, max: 1000, hint: '静かに放すなら 0', show: (raw) => raw.kind === 'curve' },
      { key: 'h2', label: '速さを調べる点の高さ h₂', unit: 'm', type: 'num', def: '0', min: 0, max: 1000, hint: '基準面（最下点）なら 0', show: (raw) => raw.kind === 'curve' },
      { key: 'L', label: '糸の長さ L', unit: 'm', type: 'num', def: '1.0', min: 0.01, max: 100, show: (raw) => raw.kind === 'pendulum' },
      { key: 'th', label: 'はじめの角度 θ（鉛直から）', unit: '°', type: 'num', def: '60', min: 1, max: 90, hint: '静かに放す位置。90° が真横', show: (raw) => raw.kind === 'pendulum' },
      { key: 'k', label: 'ばね定数 k', unit: 'N/m', type: 'num', def: '200', min: 0.01, max: 1000000, show: (raw) => raw.kind === 'spring' },
      { key: 'x', label: 'ばねの縮み x', unit: 'm', type: 'num', def: '0.10', min: 0.0001, max: 100, show: (raw) => raw.kind === 'spring' }
    ],
    examples: [
      { label: '曲面の最下点の速さ', v: { kind: 'curve', m: '2.0', h: '5.0', v0: '0', h2: '0', L: '1.0', th: '60', k: '200', x: '0.10' } },
      { label: '初速つき・途中の点', v: { kind: 'curve', m: '1.0', h: '3.0', v0: '4.0', h2: '2.0', L: '1.0', th: '60', k: '200', x: '0.10' } },
      { label: '振り子（60°から）', v: { kind: 'pendulum', m: '0.50', h: '5.0', v0: '0', h2: '0', L: '1.0', th: '60', k: '200', x: '0.10' } },
      { label: '振り子（真横から）', v: { kind: 'pendulum', m: '2.0', h: '5.0', v0: '0', h2: '0', L: '0.80', th: '90', k: '200', x: '0.10' } },
      { label: 'ばねで打ち出す', v: { kind: 'spring', m: '0.50', h: '5.0', v0: '0', h2: '0', L: '1.0', th: '60', k: '200', x: '0.10' } }
    ],
    intro: {
      easy: R`摩擦や空気抵抗のない場面では、**運動エネルギー**（$\frac{1}{2}mv^{2}$）と**位置エネルギー**（$mgh$、ばねなら $\frac{1}{2}kx^{2}$）の合計が変わりません。これが**力学的エネルギー保存則**です。「高いところ → 低いところ」で位置エネルギーが減った分、運動エネルギーが増える（速くなる）と考えます。運動方程式や等加速度運動の公式で時間を追わなくても、はじめと終わりの 2 点を比べるだけで速さが出せるのが強みです。`,
      normal: R`保存則の条件（非保存力が仕事をしない）を確認し、基準面を決めて $K_{1} + U_{1} = K_{2} + U_{2}$ を立てます。振り子の最下点では、さらに円運動の式 $T - mg = m\frac{v^{2}}{L}$ を使います。`,
      pro: R`速さは $v^{2} = v_{0}^{2} + 2g\Delta h$ で一発。振り子の最下点: $v = \sqrt{2gL(1-\cos\theta)}$、$T = mg(3 - 2\cos\theta)$。ばね: $v = x\sqrt{k/m}$、斜面の最高点 $H = \frac{kx^{2}}{2mg}$。`
    },
    compute(v) {
      let r;
      if (v.kind === 'curve') {
        r = solveCurve(v.m, v.h, v.v0, v.h2);
        if (!(r.v2sq >= 0)) {
          throw new JK.CalcError('その高さ h₂ には到達できません（運動エネルギーが足りず、最高でも高さ ' + pl(r.Hr) + ' m までです）。h₂ を下げるか、h や v₀ を大きくしてください。');
        }
        return {
          result: [
            { label: '高さ h₂ での速さ v', tex: sig(r.v) + MS },
            { label: 'そのときの運動エネルギー K', tex: sig(r.K2) + JJ },
            { label: 'そのときの位置エネルギー U', tex: sig(r.U2) + JJ },
            { label: '力学的エネルギー E（保存される値）', tex: sig(r.E) + JJ },
            { label: '到達できる最高の高さ H', tex: sig(r.Hr) + MM },
            { label: '基準面（高さ 0）を通る速さ', tex: sig(r.vb) + MS }
          ],
          steps: energySteps(r),
          fig: figEnergy(r)
        };
      }
      if (v.kind === 'pendulum') {
        r = solvePend(v.m, v.L, v.th);
        return {
          result: [
            { label: '最下点での速さ v', tex: sig(r.v) + MS },
            { label: '最下点での糸の張力 T', tex: sig(r.T) + NN },
            { label: '下がった高さ Δh', tex: sig(r.dh) + MM },
            { label: '最下点での運動エネルギー', tex: sig(r.K) + JJ }
          ],
          steps: energySteps(r),
          fig: figEnergy(r)
        };
      }
      r = solveSpring(v.m, v.k, v.x);
      return {
        result: [
          { label: '弾性エネルギー ½kx²', tex: sig(r.Ue) + JJ },
          { label: 'ばねから離れるときの速さ v', tex: sig(r.v) + MS },
          { label: '斜面を上がる最高の高さ H', tex: sig(r.H) + MM }
        ],
        steps: energySteps(r),
        fig: figEnergy(r)
      };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、空気の抵抗は無視する。`;
      const tol = { rel: 0.02 };
      if (level === 'basic') {
        const m = rng.pick([1.0, 2.0, 3.0, 5.0]);
        const h = rng.pick([1.0, 1.5, 2.0, 2.5, 5.0, 10.0]);
        const r = solveCurve(m, h, 0, 0);
        return {
          title: 'なめらかな曲面をすべり下りる物体',
          body: R`なめらかな曲面上の、最下点から高さ $` + h.toFixed(1) + R`\,\mathrm{m}$ の点 A に、質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の小物体を置き、静かに放した。最下点を B とし、B を通る水平面を重力による位置エネルギーの基準とする。` + gtxt + R`次の問いに答えよ。`,
          fig: figCurve(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`最下点 B を通るときの小物体の速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
            { label: '(2)', q: R`最下点 B での小物体の運動エネルギー $K_{B}$`, type: 'num', answer: P3(r.K2), rel: tol.rel, unit: 'J' }
          ],
          solution: curveSteps(r, {
            askK: true,
            given: R`小物体の質量を $m = ` + m.toFixed(1) + R`\,\mathrm{kg}$、A の高さを $h = ` + h.toFixed(1) + R`\,\mathrm{m}$ とします（静かに放すので、A での速さは $v_{0} = 0$、最下点 B の高さは $h_{2} = 0$ です）。`
          })
        };
      }
      if (level === 'mid') {
        if (rng.bool(0.5)) {
          const m = rng.pick([0.50, 1.0, 2.0, 4.0]);
          const k = rng.pick([100, 200, 400, 500, 800, 1000]);
          const x = rng.pick([0.05, 0.10, 0.20, 0.30]);
          const r = solveSpring(m, k, x);
          return {
            title: 'ばねで打ち出された物体',
            body: R`なめらかな水平面上で、ばね定数 $` + k.toFixed(0) + R`\,\mathrm{N/m}$ の軽いばねを自然長から $` + x.toFixed(2) + R`\,\mathrm{m}$ 縮めて、質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ の物体を押しつけ、静かに放した。物体はばねから離れたあと、水平面につづくなめらかな斜面を上がった。` + gtxt + R`次の問いに答えよ。`,
            fig: figSpring(r, { problem: true }),
            parts: [
              { label: '(1)', q: R`放す直前にばねにたくわえられていた弾性エネルギー $U_{e}$`, type: 'num', answer: P3(r.Ue), rel: tol.rel, unit: 'J' },
              { label: '(2)', q: R`ばねから離れた直後の物体の速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
              { label: '(3)', q: R`物体が斜面を上がる最高の高さ $H$（水平面から）`, type: 'num', answer: P3(r.H), rel: tol.rel, unit: 'm' }
            ],
            solution: springSteps(r, {
              given: R`ばね定数を $k = ` + k.toFixed(0) + R`\,\mathrm{N/m}$、縮みを $x = ` + x.toFixed(2) + R`\,\mathrm{m}$、物体の質量を $m = ` + m.toFixed(2) + R`\,\mathrm{kg}$ とします。`
            })
          };
        }
        const m = rng.pick([0.50, 1.0, 2.0]);
        const L = rng.pick([0.50, 1.0, 1.5, 2.0]);
        const th = rng.pick([60, 90]);
        const r = solvePend(m, L, th);
        return {
          title: '振り子の最下点の速さと張力',
          body: R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を天井に固定し、他端に質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけた。糸をたるませないで、糸が鉛直と $` + th + R`\degree$ の角をなす位置 A までおもりを持ち上げ、静かに放した。最下点 B を位置エネルギーの基準とし、$\cos 60\degree = 0.50$、$\cos 90\degree = 0$ とする。` + gtxt + R`次の問いに答えよ。`,
          fig: figPend(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`おもりが最下点 B を通るときの速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
            { label: '(2)', q: R`そのときの糸の張力の大きさ $T$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 'N' }
          ],
          solution: pendSteps(r, {
            given: R`おもりの質量を $m = ` + m.toFixed(2) + R`\,\mathrm{kg}$、糸の長さを $L = ` + L.toFixed(2) + R`\,\mathrm{m}$、A での糸の角を $\theta = ` + th + R`\degree$ とします。`
          })
        };
      }
      // adv
      if (rng.bool(0.5)) {
        let h, v0, h2, m, r;
        for (let i = 0; i < 200; i++) {
          h = rng.pick([2.0, 3.0, 4.0, 5.0]);
          v0 = rng.pick([2.0, 3.0, 4.0, 5.0]);
          h2 = rng.pick([1.0, 2.0, 3.0, 4.0, 6.0]);
          m = rng.pick([0.50, 1.0, 2.0]);
          r = solveCurve(m, h, v0, h2);
          if (r.v2sq > 4 && h2 !== h) break;
        }
        return {
          title: '初速つきですべる物体の速さと到達点',
          body: R`なめらかな曲面上の、基準面（最下点を通る水平面）から高さ $` + h.toFixed(1) + R`\,\mathrm{m}$ の点 A から、質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ の小物体を曲面にそってすべらせた。点 A での速さは $` + v0.toFixed(1) + R`\,\mathrm{m/s}$ で、物体は曲面から離れずにすべった。曲面は十分に高くまでつづいている。` + gtxt + R`次の問いに答えよ。`,
          fig: figCurve(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`基準面から高さ $` + h2.toFixed(1) + R`\,\mathrm{m}$ の点 B を通るときの速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
            { label: '(2)', q: R`点 B での小物体の運動エネルギー $K_{B}$`, type: 'num', answer: P3(r.K2), rel: tol.rel, unit: 'J' },
            { label: '(3)', q: R`物体が到達できる最高の高さ $H$（基準面から）`, type: 'num', answer: P3(r.Hr), rel: tol.rel, unit: 'm' }
          ],
          solution: curveSteps(r, {
            askK: true,
            askH: true,
            given: R`小物体の質量を $m = ` + m.toFixed(2) + R`\,\mathrm{kg}$、A の高さを $h = ` + h.toFixed(1) + R`\,\mathrm{m}$、A での速さを $v_{0} = ` + v0.toFixed(1) + R`\,\mathrm{m/s}$、B の高さを $h_{2} = ` + h2.toFixed(1) + R`\,\mathrm{m}$ とします。`
          })
        };
      }
      const th0 = rng.pick([60, 90]);
      const th1 = rng.pick([30, 37, 45]);
      const c1 = { 30: 0.866, 37: 0.80, 45: 0.707 }[th1];
      const m = rng.pick([0.50, 1.0, 2.0]);
      const L = rng.pick([0.50, 1.0, 1.5, 2.0]);
      const r = solvePend(m, L, th0);
      const c0 = th0 === 60 ? 0.5 : 0;
      const T1 = m * G * (3 * c1 - 2 * c0);
      const v1sq = 2 * G * L * (c1 - c0);
      const v1sqS = fit([v1sq], (y) => m * G * c1 + m * y / L, T1)[0];       // T₁ = mg cosθ₁ + m v₁²/L に代入する v₁²
      return {
        title: '振り子の途中の位置での張力',
        body: R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を天井に固定し、他端に質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけた。糸が鉛直と $` + th0 + R`\degree$ の角をなす位置 A まで糸をたるませずにおもりを持ち上げ、静かに放した。おもりは円弧にそって振れ、最下点 B を通る。$\cos 60\degree = 0.50$、$\cos 30\degree = 0.866$、$\cos 37\degree = 0.80$、$\cos 45\degree = 0.707$、$\cos 90\degree = 0$ を使ってよい。` + gtxt + R`次の問いに答えよ。`,
        fig: figPend(r, { problem: true, th1: th1 }),
        parts: [
          { label: '(1)', q: R`おもりが最下点 B を通るときの速さ $v_{B}$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
          { label: '(2)', q: R`最下点 B で糸がおもりを引く力の大きさ $T_{B}$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 'N' },
          { label: '(3)', q: R`糸が鉛直と $` + th1 + R`\degree$ の角をなす位置（図の $\theta_{1}$）を通るときの、糸の張力の大きさ $T_{1}$`, type: 'num', answer: P3(T1), rel: tol.rel, unit: 'N' }
        ],
        solution: pendSteps(r, {
          B: true,
          given: R`おもりの質量を $m = ` + m.toFixed(2) + R`\,\mathrm{kg}$、糸の長さを $L = ` + L.toFixed(2) + R`\,\mathrm{m}$、A での糸の角を $\theta = ` + th0 + R`\degree$ とします。`
        }).concat([{
          t: R`途中の位置（角 $\theta_{1}$）での張力`,
          m: [R`\frac{1}{2}mv_{1}^{2} = mgL(\cos\theta_{1} - \cos\theta) \;\Rightarrow\; v_{1}^{2} = 2gL(\cos\theta_{1} - \cos\theta)`,
            R`v_{1}^{2} = 2 \times 9.8 \times ` + nf(L) + R` \times (` + nf(c1) + ' - ' + nf(c0) + ') = ' + sig(v1sq) + R`\,\mathrm{m^{2}/s^{2}}`,
            R`T_{1} - mg\cos\theta_{1} = m\frac{v_{1}^{2}}{L}`,
            R`T_{1} = mg\cos\theta_{1} + m\frac{v_{1}^{2}}{L} = ` + nf(m) + R` \times 9.8 \times ` + nf(c1) + ' + ' + nf(m) + R` \times \frac{` + v1sqS + '}{' + nf(L) + '} = ' + sig(T1) + NN,
            R`T_{1} = mg(3\cos\theta_{1} - 2\cos\theta) = ` + nf(m) + R` \times 9.8 \times (3 \times ` + nf(c1) + R` - 2 \times ` + nf(c0) + ') = ' + sig(T1) + NN],
          n: R`角 $\theta_{1}$ の位置では、重力 $mg$ の糸の方向の成分は $mg\cos\theta_{1}$ です。円運動の向心方向（糸の方向、中心向き）の運動方程式は、$T_{1} - mg\cos\theta_{1} = m\frac{v_{1}^{2}}{L}$ です。速さ $v_{1}$ は、A からの高さの差 $L(\cos\theta_{1} - \cos\theta)$ を使った保存則で求めます。$v_{1}^{2}$ を代入して整理すると $T_{1} = mg(3\cos\theta_{1} - 2\cos\theta)$ になり、この式で計算しても同じ値です。最下点（$\theta_{1} = 0$）を代入すると、(2) の結果と一致します。` + unrounded('v_{1}^{2}', v1sqS, v1sq, R`\,\mathrm{m^{2}/s^{2}}`),
          easy: R`振り子が途中の位置にあるとき、糸は円の中心の方を向いていますが、重力は真下を向いています。だから、重力の「糸の方向の成分」$mg\cos\theta_{1}$ だけが、糸の張力と向かい合います。このとき円運動の式は「張力 − $mg\cos\theta_{1}$ = $m\frac{v_{1}^{2}}{L}$」となります。速さ $v_{1}$ は、保存則から出します。`
        }])
      };
    }
  });

  /* =====================================================================
     あらい面で止まるまでの距離（仕事とエネルギー）
     ===================================================================== */
  // tr: 三角比の値 { s: sinθ, c: cosθ }。演習では、問題文で指定した値（sin 30° = 0.500 など）で計算するので、その値を渡す。省略すると θ から求める
  function solveWork(m, v0, mu, thDeg, tr) {
    const th = rad(thDeg);
    const r = { m: m, v0: v0, mu: mu, thDeg: thDeg, th: th };
    r.s = tr ? tr.s : Math.sin(th); r.c = tr ? tr.c : Math.cos(th);
    r.N = m * G * r.c;
    r.f = mu * r.N;
    r.acc = G * (r.s + mu * r.c);                       // 減速の大きさ
    r.K0 = 0.5 * m * v0 * v0;
    r.d = v0 * v0 / (2 * r.acc);
    r.t = v0 / r.acc;
    r.Wf = r.f * r.d;                                   // 動摩擦力がした仕事の大きさ
    r.Wg = m * G * r.s * r.d;                           // 重力がした仕事の大きさ（負の仕事）
    r.h = r.d * r.s;
    r.back = r.s / r.c > mu + 1e-12;                    // すべり下りてくるか（静止摩擦係数 = 動摩擦係数とみなす）
    if (r.back) r.vb = Math.sqrt(2 * G * r.d * (r.s - mu * r.c));
    return r;
  }

  // 解説に出す三角比の値（文字列）。spec は演習で問題文が指定した値 { sS, cS }。
  // 省略した計算機では、その値で計算し直した結果が、丸める前の結果と 3 桁で一致する最小の桁数で書く
  function trigWork(r, spec) {
    if (spec) return spec;
    if (r.thDeg === 0) return { sS: '0', cS: '1' };
    let n = 3;
    for (; n <= 12; n++) {
      const q = solveWork(r.m, r.v0, r.mu, r.thDeg, { s: U.roundSig(r.s, n), c: U.roundSig(r.c, n) });
      if (sameResults(q, r, ['N', 'f', 'acc', 'd', 't', 'Wf', 'Wg', 'h', 'K0', 'vb'])) break;
    }
    return { sS: showN(r.s, Math.min(n, 12)), cS: showN(r.c, Math.min(n, 12)) };
  }

  function figWork(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, 262);
    const th = r.th, thd = r.thDeg;
    const x0 = 44 + 64 * Math.sin(th), y0 = thd > 0 ? 228 : 196;
    const u = [Math.cos(th), -Math.sin(th)], n = [-Math.sin(th), -Math.cos(th)];
    // 面の長さ（図に収まるように）と、物体が動く距離 d を表す長さ
    const Lsurf = Math.min((344 - x0) / Math.max(Math.cos(th), 1e-6), thd > 0 ? 172 / Math.sin(th) : Infinity);
    const Ld = Lsurf - 74;
    const P = (s, off) => [x0 + u[0] * s + n[0] * off, y0 + u[1] * s + n[1] * off];
    // 面
    if (thd > 0) {
      const e = P(Lsurf, 0);
      d.poly([[x0 - 20, y0], [x0, y0], [e[0], e[1]], [e[0], y0]], { cls: 'fg', fill: 'f0' });
      d.angle(x0, y0, 44, 0, thd, 'θ', { cls: 'c3' });
    } else {
      d.hatch(x0 - 20, y0, x0 + Lsurf, y0);
    }
    const bw = 44, bh = 28, s0 = bw / 2 + 6;
    const blk = (s, o2) => {
      const c = P(s, bh / 2);
      d.rect(c[0] - bw / 2, c[1] - bh / 2, bw, bh, Object.assign({ cls: 'fg', rx: 3, rot: thd, ox: c[0], oy: c[1] }, o2));
      return c;
    };
    const c0 = blk(s0, { fill: 'f1' });
    blk(s0 + Ld, { dash: true });
    d.text(c0[0], c0[1] + 5, 'm', { size: 13, italic: true });
    d.arrow(c0[0] + u[0] * 16, c0[1] + u[1] * 16, c0[0] + u[0] * 70, c0[1] + u[1] * 70, { cls: 'c1', label: 'v₀', w: 2.2 });
    const fa = P(s0 - 6, 6), fb = P(s0 - 50, 6);
    d.arrow(fa[0], fa[1], fb[0], fb[1], { cls: 'c3', label: 'f', lpos: -1, w: 2 });
    // 距離 d の寸法線（面に平行）
    const a = P(s0, bh + 24), b = P(s0 + Ld, bh + 24);
    d.arrow(a[0], a[1], b[0], b[1], { cls: 'c3', w: 1.6 });
    d.arrow(b[0], b[1], a[0], a[1], { cls: 'c3', w: 1.6 });
    const mid = P(s0 + Ld / 2, bh + 38);
    d.text(mid[0], mid[1] + 4, prob ? 'd' : 'd = ' + pl(r.d) + ' m', { cls: 'c3', size: 12, italic: prob });
    const lb = P(s0 + Ld, bh + 16);
    d.text(lb[0], lb[1], '止まった位置', { cls: 'dim', size: 11 });
    d.text(180, 252, 'm = ' + pl(r.m) + ' kg　v₀ = ' + pl(r.v0) + ' m/s　μ′ = ' + pl(r.mu) + (thd > 0 ? '　θ = ' + pl(thd) + '°' : '　（水平面）'), { size: 12 });
    return d.svg();
  }

  /* ---- 解説の部品（計算機・演習で共通。数値を代入する行は、与えられた値だけから直接書く） ---- */
  // 解説の式（TeX）。S = trigWork の結果。途中の結果（N, f, a, d など）は次の式に代入せず、与えられた値から直接つくる
  function workKit(r, S) {
    const hz = r.thDeg === 0;
    const m = nf(r.m), v0 = nf(r.v0), mu = nf(r.mu);
    const K = { hz: hz, m: m, v0: v0, mu: mu };
    K.N = m + R` \times 9.8` + (hz ? '' : R` \times ` + S.cS);                                                // N = mg（cosθ）
    K.f = mu + R` \times ` + K.N;                                                                          // f = μ'N
    K.acc = hz ? mu + R` \times 9.8` : R`9.8 \times (` + S.sS + ' + ' + mu + R` \times ` + S.cS + ')';       // 減速の大きさ a
    K.d = R`\frac{` + v0 + R`^{2}}{2 \times ` + K.acc + '}';                                               // d = v₀²/(2a)
    K.ratio = hz ? '' : R`\frac{` + S.sS + ' - ' + mu + R` \times ` + S.cS + '}{' + S.sS + ' + ' + mu + R` \times ` + S.cS + '}';   // (sinθ − μ'cosθ)/(sinθ + μ'cosθ)
    return K;
  }

  // o.given: 演習で、問題の値と記号を結びつける文 / o.round: 演習で、下りの運動も扱うとき true
  function stForces(r, S, o) {
    const hz = r.thDeg === 0;
    const ang = U.fmt(r.thDeg) + R`\degree`;
    const st = {
      t: '力と仕事を整理する',
      n: (o.given || '') + R`物体にはたらく力は、重力 $mg$、垂直抗力 $N$、動摩擦力 $f$ です。**垂直抗力は運動の向きに垂直なので仕事 0**、**動摩擦力は運動と逆向きなので負の仕事**（$-fd$）` +
        (hz ? R`、重力は水平面では運動に垂直なので仕事 0 です。`
          : R`、重力は斜面に沿って下向きの成分 $mg\sin\theta$ があり、上がる向きの運動に対して負の仕事（$-mg\sin\theta \cdot d$）をします。` +
            (o.round ? R`下りるときは、$mg\sin\theta$ は運動と同じ向きなので正の仕事（$+mg\sin\theta \cdot d$）をし、動摩擦力は上りと同じく運動と逆向きの負の仕事をします。` : '') +
            R`$\sin\theta$, $\cos\theta$ の値は上の式のとおりです。`),
      easy: R`**仕事**は「力 × 力の向きに動いた距離」です。動く向きと逆向きの力がはたらくと、仕事は負になり、物体のエネルギーを減らします。ブレーキ（摩擦）は、物体の運動エネルギーを奪う負の仕事をします。物体の運動エネルギーの変化は、物体にはたらく力がした仕事の合計に等しい、というのが「**仕事とエネルギーの関係**」です。`,
      pro: R`仕事とエネルギーの関係 $\Delta K = W_{\text{全}}$ は、時間が出てこない・距離で聞かれたときの最短経路。仕事の符号（運動と逆向きなら負）に注意。`
    };
    if (!hz) st.m = [R`\sin ` + ang + ' = ' + (S.sS === S.cS ? R`\cos ` + ang + ' = ' + S.sS : S.sS + R`,\qquad \cos ` + ang + ' = ' + S.cS)];
    return st;
  }

  // 垂直抗力と動摩擦力。lv: 段の粒度 / tag: 演習で設問の番号を付けるとき '(1) ' など
  function stNF(r, K, lv, tag) {
    const hz = K.hz;
    return {
      t: (tag || '') + '垂直抗力と動摩擦力',
      m: [(hz ? R`N = mg = ` : R`N = mg\cos\theta = `) + K.N + ' = ' + sig(r.N) + NN,
        (hz ? R`f = \mu' N = \mu' mg = ` : R`f = \mu' N = \mu' mg\cos\theta = `) + K.f + ' = ' + sig(r.f) + NN],
      n: (hz ? R`水平面では鉛直方向の力がつり合うので $N = mg$。` : R`面に垂直な方向の力がつり合うので $N = mg\cos\theta$。`) + R`動摩擦力は $f = \mu' N$ です。`,
      easy: R`摩擦力の大きさは、面を押す力（垂直抗力）に比例します。` + (hz ? R`水平面では垂直抗力は重さ $mg$ と同じです。` : R`斜面では、面を押す力は重さの一部 $mg\cos\theta$ だけです。`) + R`これに摩擦係数 $\mu'$ をかけると、動摩擦力が求まります。`,
      lv: lv
    };
  }

  function stWE(r) {
    const hz = r.thDeg === 0;
    return {
      t: '仕事とエネルギーの関係を立てる',
      m: hz
        ? [R`\frac{1}{2}mv^{2} - \frac{1}{2}mv_{0}^{2} = W_{\text{摩擦}}`, R`0 - \frac{1}{2}mv_{0}^{2} = -\mu' mg\,d`]
        : [R`\frac{1}{2}mv^{2} - \frac{1}{2}mv_{0}^{2} = W_{\text{摩擦}} + W_{\text{重力}}`, R`0 - \frac{1}{2}mv_{0}^{2} = -\mu' mg\cos\theta \cdot d - mg\sin\theta \cdot d`],
      n: R`止まった位置では速さ $v = 0$ です。運動エネルギーの変化 $0 - \frac{1}{2}mv_{0}^{2}$ が、はたらいた力がした仕事の合計（` + (hz ? R`摩擦力の仕事 $-\mu' mg\,d$` : R`摩擦力の仕事 $-\mu' mg\cos\theta\cdot d$ と重力の仕事 $-mg\sin\theta\cdot d$`) + R`）に等しい、という式です。`,
      easy: R`物体は最初 $\frac{1}{2}mv_{0}^{2}$ の運動エネルギーを持っていて、止まったときは 0 です。この減った分（$-\frac{1}{2}mv_{0}^{2}$）は、摩擦力` + (hz ? '' : R`と重力`) + R`が物体にした負の仕事の合計と同じです。仕事は「力 × 距離」なので、距離 $d$ が未知数として式に入ります。`
    };
  }

  function stDist(r, K, tag) {
    const hz = K.hz;
    return {
      t: (tag || '') + '止まるまでの距離 $d$ を求める',
      m: hz
        ? [R`d = \frac{v_{0}^{2}}{2\mu' g}`, R`d = ` + K.d + ' = ' + sig(r.d) + MM]
        : [R`d = \frac{v_{0}^{2}}{2g(\sin\theta + \mu'\cos\theta)}`, R`d = ` + K.d + ' = ' + sig(r.d) + MM],
      n: R`両辺の質量 $m$ が消えるので、**止まるまでの距離は質量によりません**。` + (hz ? R`初速 $v_{0}$ が 2 倍になると、距離は 4 倍になります。` : R`斜面を上がるので、重力と摩擦の両方が物体を止める向きにはたらきます。`),
      easy: R`式の両辺に $m$ が入っているので、$m$ で割って消せます。重い物体も軽い物体も同じ距離で止まるのです（重い物体は、動かしにくいぶん、摩擦力も大きいため）。残った式から $d$ を求めると、初めの速さの 2 乗に比例し、摩擦がきついほど短くなります。`,
      pro: hz ? R`$d = \frac{v_{0}^{2}}{2\mu' g}$。$v_{0}$ が 2 倍で $d$ は 4 倍（ブレーキ距離の定番）。` : R`$d = \frac{v_{0}^{2}}{2g(\sin\theta + \mu'\cos\theta)}$。$\theta = 0$ で水平面の式に一致する。`
    };
  }

  // 運動方程式からの検算（別解）。a は、d・t の式に代入して計算し直しても結果が合う桁数で書く
  function stAlt(r, K) {
    const hz = K.hz;
    const aS = fit([r.acc], (a) => [r.v0 * r.v0 / (2 * a), r.v0 / a], [r.d, r.t])[0];
    return {
      t: '運動方程式からの検算（別解）',
      m: [(hz ? R`a = \mu' g = ` : R`a = g(\sin\theta + \mu'\cos\theta) = `) + K.acc + ' = ' + sig(r.acc) + MS2 + R`\ \text{（減速の大きさ）}`,
        R`d = \frac{v_{0}^{2}}{2a} = \frac{` + K.v0 + R`^{2}}{2 \times ` + aS + '} = ' + sig(r.d) + MM,
        R`t = \frac{v_{0}}{a} = \frac{` + K.v0 + '}{' + aS + '} = ' + sig(r.t) + SEC],
      n: R`運動方程式から減速の加速度の大きさ $a$ を求め、等加速度直線運動の公式 $v^{2} - v_{0}^{2} = -2ad$ で距離を求めても同じ値になります。この方法では、止まるまでの時間 $t = \frac{v_{0}}{a}$ も求まります。` + unrounded('a', aS, r.acc, MS2),
      lv: 2
    };
  }

  // 失われた力学的エネルギー（熱）。fd・mgd sinθ は、与えられた値から直接つくる（d の式を代入した形）
  function stHeat(r, K, S) {
    const hz = K.hz;
    const K0line = R`K_{0} = \frac{1}{2}mv_{0}^{2} = \frac{1}{2} \times ` + K.m + R` \times ` + K.v0 + R`^{2} = ` + sig(r.K0) + JJ;
    return {
      t: '失われた力学的エネルギー（熱）',
      m: hz
        ? [R`Q = fd = \frac{1}{2}mv_{0}^{2} = \frac{1}{2} \times ` + K.m + R` \times ` + K.v0 + R`^{2} = ` + sig(r.K0) + JJ]
        : [R`Q = fd = \mu' mg\cos\theta \cdot d = ` + K.f + R` \times ` + K.d + ' = ' + sig(r.Wf) + JJ,
          R`mgd\sin\theta = ` + K.m + R` \times 9.8 \times ` + S.sS + R` \times ` + K.d + ' = ' + sig(r.Wg) + JJ,
          K0line],
      n: hz
        ? R`動摩擦力がした仕事の大きさ $fd$ は、はじめの運動エネルギーに等しく、すべて熱に変わったことになります。`
        : R`はじめの運動エネルギー $K_{0}$ のうち、$mgd\sin\theta$ は位置エネルギーとして残り、残り（$fd$）が摩擦で熱になります。$K_{0} = mgd\sin\theta + fd$ が成り立っています。`,
      lv: 2
    };
  }

  // 止まったあと、すべり下りてもどるときの速さ（lv: 段の粒度 / tag: 設問の番号）
  function stBack(r, K, lv, tag) {
    return {
      t: (tag || '') + '止まったあと、すべり下りてもどるときの速さ',
      m: [R`\frac{1}{2}mv_{b}^{2} = mgd\sin\theta - \mu' mg\cos\theta \cdot d`,
        R`v_{b} = \sqrt{2gd(\sin\theta - \mu'\cos\theta)}`,
        R`v_{b} = v_{0}\sqrt{\frac{\sin\theta - \mu'\cos\theta}{\sin\theta + \mu'\cos\theta}}`,
        R`v_{b} = ` + K.v0 + R` \times \sqrt{` + K.ratio + '} = ' + sig(r.vb) + MS],
      n: R`$\tan\theta > \mu'$ なので、止まった位置から斜面をすべり下りてきます（静止摩擦係数も $\mu'$ に等しいとします）。下りでは重力の仕事が正、摩擦力の仕事は負で、仕事とエネルギーの関係から出発点にもどったときの速さが求まります。$d$ に上りの式を代入すると $g$ と $d$ が消えて、$v_{b}$ は $v_{0}$ と、上りのブレーキの大きさ $\sin\theta + \mu'\cos\theta$・下りの加速の大きさ $\sin\theta - \mu'\cos\theta$ の比だけで決まります。もとの位置にもどった速さは、はじめの速さ $v_{0}$ より小さくなります。`,
      easy: R`下りでは、重力の斜面に沿った成分 $mg\sin\theta$ が物体を加速させ、動摩擦力 $\mu' mg\cos\theta$ が逆向きにブレーキをかけます。止まった位置から出発して、上りと同じ距離 $d$ を下りるので、仕事は「力 × $d$」です。上りの式と下りの式を見比べると、$d$ も $m$ も $g$ も打ち消し合って、$v_{b}$ は $v_{0}$ に「下りの力 ÷ 上りの力」の平方根をかけた値になります。`,
      pro: R`$v_{b} = v_{0}\sqrt{\dfrac{\sin\theta - \mu'\cos\theta}{\sin\theta + \mu'\cos\theta}}$。摩擦があるので必ず $v_{b} < v_{0}$。`,
      lv: lv
    };
  }

  // 計算機の解説（演習 basic も使う）。o.given: 演習で、問題の値と記号を結びつける文 / o.lvNF: 演習で、N と f を求める段の粒度 / o.tags: 演習で、設問の番号を付ける
  function workSteps(r, o) {
    o = o || {};
    const S = trigWork(r, o.tr), K = workKit(r, S);
    const steps = [stForces(r, S, o), stNF(r, K, o.lvNF || 2, o.tags ? '(1) ' : ''), stWE(r), stDist(r, K, o.tags ? '(2) ' : '')];
    steps.push(stAlt(r, K), stHeat(r, K, S));
    if (r.back) steps.push(stBack(r, K, 2));
    return steps;
  }

  // 演習 mid「すべった距離から摩擦係数を求める」: 与えられた m・v₀・d だけから、設問の順（|W|、μ'、t）に求める。dd = すべった距離 d
  function workStepsMid(r, dd, given) {
    const m = nf(r.m), v0 = nf(r.v0), d = nf(dd);
    // μ' = |W|/(mgd) に代入する |W|、a = μ'g・t = v₀/a に代入する μ'・a（いずれも、必要なら桁を増やす）
    const WS = fit([r.K0], (w) => w / (r.m * G * dd), r.mu)[0];
    const muS = fit([r.mu], (y) => [y * G, r.v0 / (y * G)], [r.acc, r.t])[0];
    const aS = fit([r.acc], (a) => r.v0 / a, r.t)[0];
    const steps = [];
    steps.push({
      t: '(1) 動摩擦力がした仕事の大きさ $|W|$',
      m: [R`\frac{1}{2}m \cdot 0^{2} - \frac{1}{2}mv_{0}^{2} = W`,
        R`|W| = \frac{1}{2}mv_{0}^{2} = \frac{1}{2} \times ` + m + R` \times ` + v0 + R`^{2} = ` + sig(r.K0) + JJ],
      n: given + R`物体にはたらく力のうち、重力と垂直抗力は運動に垂直なので仕事 0 で、動摩擦力だけが（運動と逆向きの）負の仕事 $W$ をします。止まった位置では速さが 0 なので、「仕事とエネルギーの関係」から、運動エネルギーの減少 $\frac{1}{2}mv_{0}^{2}$ が、動摩擦力がした仕事の大きさ $|W|$ に等しくなります。`,
      easy: R`**仕事**は「力 × 力の向きに動いた距離」です。物体は最初 $\frac{1}{2}mv_{0}^{2}$ の運動エネルギーを持っていて、止まったときは 0 です。減った分は、動摩擦力が物体にした仕事（運動と逆向きなので負の仕事）で奪われたものです。だから、動摩擦力がした仕事の大きさは、はじめの運動エネルギーと同じになります。`,
      pro: R`$|W| = \frac{1}{2}mv_{0}^{2}$ は「止まるまでに摩擦が奪った運動エネルギー」。距離が分かっていれば、ここから $\mu'$ まで一直線。`
    });
    steps.push({
      t: R`(2) 動摩擦係数 $\mu'$`,
      m: [R`|W| = fd = \mu' mg \cdot d`,
        R`\mu' = \frac{|W|}{mgd} = \frac{` + WS + '}{' + m + R` \times 9.8 \times ` + d + '} = ' + sig(r.mu),
        R`\mu' = \frac{v_{0}^{2}}{2gd} = \frac{` + v0 + R`^{2}}{2 \times 9.8 \times ` + d + '} = ' + sig(r.mu)],
      n: R`動摩擦力の大きさは一定で $f = \mu' N = \mu' mg$ なので、距離 $d$ の間にした仕事の大きさは $|W| = fd = \mu' mgd$ です。(1) で求めた $|W|$ を代入して、$\mu'$ について解きます。式の中の質量 $m$ は打ち消し合うので、$\mu' = \frac{v_{0}^{2}}{2gd}$ と整理して求めても同じ値になります。`,
      easy: R`動摩擦力の大きさは $f = \mu' mg$ で、これが距離 $d$ の間ずっと同じ大きさではたらくので、仕事の大きさは「力 × 距離」$= \mu' mgd$ です。これが (1) で求めた $|W|$ に等しい、という式から $\mu'$ が出ます。質量 $m$ は式の中で打ち消し合うので、$m$ が分からなくても $\mu' = \frac{v_{0}^{2}}{2gd}$ で求められます。`,
      pro: R`$\mu' = \frac{v_{0}^{2}}{2gd}$（質量によらない）。`
    });
    steps.push({
      t: '(3) 止まるまでの時間 $t$',
      m: [R`ma = \mu' mg \;\Rightarrow\; a = \mu' g = ` + muS + R` \times 9.8 = ` + sig(r.acc) + MS2 + R`\ \text{（減速の大きさ）}`,
        R`0 = v_{0} - at \;\Rightarrow\; t = \frac{v_{0}}{a} = \frac{` + v0 + '}{' + aS + '} = ' + sig(r.t) + SEC],
      n: R`動摩擦力は一定なので、物体は一定の加速度で減速します。運動方程式から減速の大きさは $a = \mu' g$（質量によりません）で、速さが $v_{0}$ から 0 になるまでの時間は $t = \frac{v_{0}}{a}$ です。` + unrounded('a', aS, r.acc, MS2),
      easy: R`動摩擦力は一定なので、物体は一定の加速度で減速します（ブレーキをかけ続けた車と同じ）。運動方程式 $ma = f = \mu' mg$ から、減速の加速度の大きさは $a = \mu' g$ です。速さが $v_{0}$ から 0 になるまでの時間は $t = \frac{v_{0}}{a}$ です。`,
      pro: R`時間を聞かれたら運動方程式（等加速度）。$t = \frac{2d}{v_{0}}$ でも出せる（平均の速さ $\frac{v_{0}}{2}$ で $d$ を進む）。`
    });
    steps.push({
      t: '別解: 平均の速さから時間を求める',
      m: [R`d = \frac{v_{0} + 0}{2} \times t \;\Rightarrow\; t = \frac{2d}{v_{0}} = \frac{2 \times ` + d + '}{' + v0 + '} = ' + sig(r.t) + SEC],
      n: R`一定の加速度で減速して止まるとき、平均の速さは $\frac{v_{0} + 0}{2}$ です。この平均の速さで距離 $d$ を進んだと考えると、$d = \frac{v_{0}}{2}t$ から $t$ が求まります。`,
      lv: 2
    });
    return steps;
  }

  // 演習 adv「あらい斜面を上って、もどってくる物体」: 設問の順（d、v_b、Q）に、与えられた値だけから求める
  function workStepsAdv(r, S, given) {
    const K = workKit(r, S);
    const Qnum = '{' + K.mu + R` \times ` + K.m + R` \times ` + K.v0 + R`^{2} \times ` + S.cS + '}{' + S.sS + ' + ' + K.mu + R` \times ` + S.cS + '}';
    const steps = [stForces(r, S, { given: given, round: true }), stNF(r, K, 2), stWE(r), stDist(r, K, '(1) '), stBack(r, K, 1, '(2) ')];
    steps.push({
      t: R`(3) 上りと下りの全体で動摩擦力がした仕事の大きさ $Q$`,
      m: [R`Q = fd + fd = 2fd`,
        R`Q = 2\mu' mg\cos\theta \cdot d = 2\mu' mg\cos\theta \times \frac{v_{0}^{2}}{2g(\sin\theta + \mu'\cos\theta)}`,
        R`Q = \frac{\mu' m v_{0}^{2}\cos\theta}{\sin\theta + \mu'\cos\theta}`,
        R`Q = \frac` + Qnum + ' = ' + sig(2 * r.Wf) + JJ],
      n: R`動摩擦力の大きさ $f = \mu' mg\cos\theta$ は、上りでも下りでも同じで、いつも運動と逆向きです。上りの $d$ と下りの $d$ を合わせた道のり $2d$ だけ、同じ大きさの力が負の仕事をするので、その仕事の大きさは $Q = 2fd$ です。$d$ に (1) の式を代入すると、$g$ が約分されます。この $Q$ が、熱に変わったエネルギーです。`,
      easy: R`動摩擦力は、上るときも下るときも運動を邪魔する向きにはたらき、大きさは同じ $f$ です。「力 × 動いた距離」が仕事なので、上りで $fd$、下りで $fd$、合わせて $2fd$ の仕事の大きさになります。摩擦がした（負の）仕事の分だけ、物体の運動エネルギーが熱に変わります。`,
      pro: R`$Q = 2fd$（往復の道のりは $2d$）。同じ高さにもどるので重力の仕事は 0。$Q = K_{0} - K_{b}$ でも確かめられる。`
    });
    steps.push({
      t: '別解: エネルギーの減少から $Q$ を求める',
      m: [R`Q = \frac{1}{2}mv_{0}^{2} - \frac{1}{2}mv_{b}^{2}`,
        R`Q = \frac{1}{2}mv_{0}^{2}\left(1 - \frac{\sin\theta - \mu'\cos\theta}{\sin\theta + \mu'\cos\theta}\right)`,
        R`Q = \frac{1}{2} \times ` + K.m + R` \times ` + K.v0 + R`^{2} \times \left(1 - ` + K.ratio + R`\right) = ` + sig(2 * r.Wf) + JJ],
      n: R`往復して同じ高さにもどるので、重力の仕事は 0 です（上りの負の仕事と、下りの正の仕事が打ち消し合います）。したがって、運動エネルギーの減少 $\frac{1}{2}mv_{0}^{2} - \frac{1}{2}mv_{b}^{2}$ が、そのまま摩擦で熱になった $Q$ に等しくなります。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'mech-work-friction',
    field: '力学',
    unit: 'p-energy',
    title: 'あらい面で止まるまでの距離（仕事とエネルギー）',
    desc: R`あらい水平面（または斜面）で、初速 $v_{0}$ で物体をすべらせたとき、止まるまでの距離・動摩擦力がした仕事・失われたエネルギーを、「仕事とエネルギーの関係」から求めます。斜面を上る場合には、もどってくるときの速さも示します。`,
    form: [R`\Delta K = W_{\text{全}}`, R`0 - \frac{1}{2}mv_{0}^{2} = -\mu' mg\cos\theta\,d - mg\sin\theta\,d`, R`d = \frac{v_{0}^{2}}{2g(\sin\theta + \mu'\cos\theta)}`],
    inputs: [
      { key: 'm', label: '質量 m', unit: 'kg', type: 'num', def: '2.0', min: 0.001, max: 1000 },
      { key: 'v0', label: '初速 v₀', unit: 'm/s', type: 'num', def: '6.0', min: 0.001, max: 1000 },
      { key: 'mu', label: '動摩擦係数 μ′', type: 'num', def: '0.30', min: 0, max: 5, hint: '0 より大きい値（0 だと止まらない）' },
      { key: 'th', label: '面の傾き θ（上り）', unit: '°', type: 'num', def: '0', min: 0, max: 80, hint: '0 で水平面。斜面は初速の向きに上る' }
    ],
    examples: [
      { label: '水平なあらい面', v: { m: '2.0', v0: '6.0', mu: '0.30', th: '0' } },
      { label: '斜面を上る（30°）', v: { m: '1.0', v0: '8.0', mu: '0.20', th: '30' } },
      { label: '急な斜面（止まったまま）', v: { m: '1.0', v0: '5.0', mu: '1.5', th: '30' } }
    ],
    intro: {
      easy: R`あらい面を物体がすべると、動摩擦力がブレーキとなって、やがて止まります。「どこで止まるか」は、**仕事とエネルギーの関係**（運動エネルギーの変化 = 力がした仕事の合計）で求められます。はじめに持っていた運動エネルギー $\frac{1}{2}mv_{0}^{2}$ が、摩擦力の負の仕事 $-fd$ ですべて奪われると、止まります。時間を求めなくても、距離だけを直接出せるのが便利です。斜面を上る場合は、重力の負の仕事も加わります。`,
      normal: R`$0 - \frac{1}{2}mv_{0}^{2} = -\mu' mg\cos\theta\cdot d - mg\sin\theta\cdot d$ より $d = \frac{v_{0}^{2}}{2g(\sin\theta + \mu'\cos\theta)}$（水平面なら $d = \frac{v_{0}^{2}}{2\mu' g}$）。`,
      pro: R`「距離」を聞かれたら仕事とエネルギー、「時間」を聞かれたら運動方程式（等加速度）が定石。質量に依らない。斜面では $\tan\theta > \mu'$ ならもどってくる。`
    },
    compute(v) {
      if (!(v.mu > 0)) throw new JK.CalcError('動摩擦係数 μ′ は 0 より大きくしてください（摩擦がないと水平面では止まりません）。');
      const r = solveWork(v.m, v.v0, v.mu, v.th);
      const res = [
        { label: '止まるまでの距離 d', tex: sig(r.d) + MM },
        { label: '動摩擦力 f', tex: sig(r.f) + NN },
        { label: '動摩擦力がした仕事の大きさ |W|', tex: sig(r.Wf) + JJ },
        { label: '止まるまでの時間 t', tex: sig(r.t) + SEC }
      ];
      if (v.th > 0) {
        res.push({ label: '上がった高さ', tex: sig(r.h) + MM });
        if (r.back) res.push({ label: 'もどってきたときの速さ', tex: sig(r.vb) + MS });
        else res.push({ label: 'その後の運動', tex: R`\text{止まったまま}` });
      }
      return { result: res, steps: workSteps(r), fig: figWork(r) };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      if (level === 'basic') {
        const m = rng.pick([1.0, 2.0, 4.0, 5.0]);
        const v0 = rng.pick([4.0, 6.0, 8.0, 10.0]);
        const mu = rng.pick([0.10, 0.20, 0.25, 0.40, 0.50]);
        const r = solveWork(m, v0, mu, 0);
        return {
          title: 'あらい水平面をすべって止まる物体',
          body: R`あらい水平面上に質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を置き、水平方向に初速 $` + v0.toFixed(1) + R`\,\mathrm{m/s}$ ですべらせた。物体と水平面の間の動摩擦係数は $` + mu.toFixed(2) + R`$ である。` + gtxt + R`次の問いに答えよ。`,
          fig: figWork(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`物体にはたらく動摩擦力の大きさ $f$`, type: 'num', answer: P3(r.f), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`物体が止まるまでにすべる距離 $d$`, type: 'num', answer: P3(r.d), rel: 0.02, unit: 'm' }
          ],
          solution: workSteps(r, {
            lvNF: 1, tags: true,
            given: R`質量を $m = ` + m.toFixed(1) + R`\,\mathrm{kg}$、初速を $v_{0} = ` + v0.toFixed(1) + R`\,\mathrm{m/s}$、動摩擦係数を $\mu' = ` + mu.toFixed(2) + R`$ とします。`
          })
        };
      }
      if (level === 'mid') {
        const pairs = [[7.0, [5.0, 10.0, 12.5, 25.0]], [14.0, [20.0, 25.0, 40.0, 50.0, 100.0]]];
        const pr = rng.pick(pairs);
        const v0 = pr[0], dd = rng.pick(pr[1]);
        let m = rng.pick([1.0, 2.0, 3.0, 5.0]);
        if (v0 === 7.0 && m === 5.0) m = 4.0;          // ½mv₀² = 122.5 J のように 4 桁になる組は避ける（答え 123 J と解説の式の値 122.5 J が別の数に見える）
        const mu = v0 * v0 / (2 * G * dd);
        const r = solveWork(m, v0, mu, 0);
        return {
          title: 'すべった距離から摩擦係数を求める',
          body: R`あらい水平面上で、質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体に初速 $` + v0.toFixed(1) + R`\,\mathrm{m/s}$ を与えてすべらせたところ、物体は $` + dd.toFixed(1) + R`\,\mathrm{m}$ すべって止まった。動摩擦力の大きさは一定とする。` + gtxt + R`次の問いに答えよ。`,
          fig: figWork(Object.assign({}, r, { d: dd }), { problem: true }),
          parts: [
            { label: '(1)', q: R`この間に動摩擦力がした仕事の大きさ $|W|$`, type: 'num', answer: P3(r.K0), rel: 0.02, unit: 'J' },
            { label: '(2)', q: R`物体と水平面の間の動摩擦係数 $\mu'$`, type: 'num', answer: P3(mu), rel: 0.02 },
            { label: '(3)', q: R`初速を与えてから止まるまでの時間 $t$`, type: 'num', answer: P3(r.t), rel: 0.02, unit: 's' }
          ],
          solution: workStepsMid(r, dd, R`質量を $m = ` + m.toFixed(1) + R`\,\mathrm{kg}$、初速を $v_{0} = ` + v0.toFixed(1) + R`\,\mathrm{m/s}$、すべった距離を $d = ` + dd.toFixed(1) + R`\,\mathrm{m}$ とします。`)
        };
      }
      // adv: 斜面を上り、止まってからすべり下りる
      const thd = rng.pick([30, 45]);
      const mu = rng.pick([0.10, 0.15, 0.20, 0.25]);
      const m = rng.pick([1.0, 2.0, 3.0]);
      const v0 = rng.pick([4.0, 5.0, 6.0, 8.0]);
      // 三角比は問題文で指定した値（sin 30° = 0.500、cos 30° = 0.866、sin 45° = cos 45° = 0.707）で計算する
      const tr = thd === 30 ? { s: 0.5, c: 0.866, sS: '0.500', cS: '0.866' } : { s: 0.707, c: 0.707, sS: '0.707', cS: '0.707' };
      const r = solveWork(m, v0, mu, thd, tr);
      const trTxt = thd === 30 ? R`$\sin 30\degree = 0.500$、$\cos 30\degree = 0.866$` : R`$\sin 45\degree = \cos 45\degree = 0.707$`;
      return {
        title: 'あらい斜面を上って、もどってくる物体',
        body: R`水平面と $` + thd + R`\degree$ の角をなすあらい斜面の下端から、質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を、斜面にそって上向きに初速 $` + v0.toFixed(1) + R`\,\mathrm{m/s}$ ですべらせた。物体は斜面を上がってやがて止まり、そのあと斜面をすべり下りて下端にもどってきた。物体と斜面の間の動摩擦係数は $` + mu.toFixed(2) + R`$ である。` + gtxt + trTxt + R` を使ってよい。次の問いに答えよ。`,
        fig: figWork(r, { problem: true }),
        parts: [
          { label: '(1)', q: R`物体が斜面を上がって止まるまでにすべった距離 $d$`, type: 'num', answer: P3(r.d), rel: 0.02, unit: 'm' },
          { label: '(2)', q: R`下端にもどってきたときの物体の速さ $v_{b}$`, type: 'num', answer: P3(r.vb), rel: 0.02, unit: 'm/s' },
          { label: '(3)', q: R`上りと下りの全体で、動摩擦力がした仕事の大きさ（熱に変わったエネルギー）$Q$`, type: 'num', answer: P3(2 * r.Wf), rel: 0.02, unit: 'J' }
        ],
        solution: workStepsAdv(r, tr, R`質量を $m = ` + m.toFixed(1) + R`\,\mathrm{kg}$、初速を $v_{0} = ` + v0.toFixed(1) + R`\,\mathrm{m/s}$、動摩擦係数を $\mu' = ` + mu.toFixed(2) + R`$、斜面の角を $\theta = ` + thd + R`\degree$ とします。`)
      };
    }
  });
})();
