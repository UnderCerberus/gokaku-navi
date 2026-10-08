/* 物理・波動 — 光の干渉（unit: p-interf）
   wave-young: ヤングの実験（明線の間隔 Δx = Lλ/d、経路差の導出）
   wave-grating: 回折格子（d sinθ = mλ）
   wave-thin-film: 薄膜の干渉（反射での位相の反転を屈折率から判断） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const PI = Math.PI;

  // 有効数字 3 桁の四捨五入（105.5 のようにちょうど半端な値は 106 に切り上げる）。
  // 答え（P3）と解説・図の表示（sig, pl）は必ずこの 1 つの丸めを通す。toPrecision や toFixed は 2 進数の誤差で
  // 半端な値を 2 通りに割ってしまい、答えと解説の数値が 1 ずれる
  function rd3(x) {
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return x;
    const a = Math.abs(Number(x.toPrecision(12)));
    const e = Math.floor(Math.log10(a)) - 2;
    const m = Math.round(Number((a / Math.pow(10, e)).toPrecision(12)));
    return (x < 0 ? -1 : 1) * Number(m + 'e' + e);
  }
  const sig = (x) => U.sig(rd3(x), 3);
  // 問題文に与えた値（入力値）の TeX 表示。10 桁までは正確に書く（0.01575 を 0.0158 や 0.016 と書かない）。
  // 10^-3 未満・10^5 以上は 2.5 \times 10^{-4} の形。途中の値には使わない（SV と dig を使う）
  function nf(x) {
    if (typeof x !== 'number' || !isFinite(x)) return '0';
    const ax = Math.abs(x);
    if (ax === 0) return '0';
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = Number((x / Math.pow(10, e)).toPrecision(10));
      if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(10)); e += 1; }
      let ms = String(m);
      if (ms.indexOf('.') < 0) ms += '.0';
      return ms + R` \times 10^{` + e + '}';
    }
    return String(Number(x.toPrecision(10)));
  }
  const P3 = rd3;
  // 途中の値を d 桁（有効数字）で書く。3 桁は従来の sig と同じ。4 桁以上は普通の小数で書き、末尾の 0 は除く（1245、12450、622.5）。
  // 10^5 以上や 10^-3 未満は 1.5 \times 10^{5} の形
  function SD(x, d) {
    if (d <= 3 || typeof x !== 'number' || !isFinite(x)) return sig(x);
    const v = U.roundSig(x, d);
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a < 1e5 && a >= 1e-3) return String(Number(v));
    const m = /^(-?\d)(?:\.(\d+))?e([+-]?\d+)$/.exec(v.toExponential(d - 1));
    const frac = (m[2] || '').replace(/0+$/, '') || '0';
    return m[1] + '.' + frac + R` \times 10^{` + Number(m[3]) + '}';
  }
  // 途中の値 xs を式 f に代入して見せるときの、表示する有効数字の桁数。ちょうど表せる値（有効数字 6 桁以内。225、1245、622.5）は
  // そのまま書く。そうでない値は 3 桁から増やし、表示した値で計算し直した結果が、厳密な値の 3 桁表示（答えと解説の結果）と
  // 一致する最小の桁数にする（丸めた値を代入して、最後の桁が合わなくなるのを防ぐ）
  const same = (a, b) => a === b || Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b));
  const isExact = (x) => x === 0 || same(U.roundSig(x, 6), x);
  // zeroTol: 和・差の結果が 0 になる式のとき、0 とみなす絶対誤差（項の大きさ × 1e-9）
  function dig(xs, f, zeroTol) {
    const eq = (a, b) => a === b || Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b)) || (zeroTol !== undefined && Math.abs(a) <= zeroTol && Math.abs(b) <= zeroTol);
    const want = rd3(f.apply(null, xs));
    for (let d = 3; d <= 9; d++) {
      if (eq(rd3(f.apply(null, xs.map((x) => (isExact(x) ? x : U.roundSig(x, d))))), want)) return d;
    }
    return 9;
  }
  const SV = (x, d) => (isExact(x) ? SD(x, 6) : SD(x, d));
  // 結果 x の表示。3 桁に丸めると変わる値は、ちょうどの値を添える（316.5 \approx 317）
  const eqTail = (x) => (isExact(x) && !same(rd3(x), x) ? ' = ' + SD(x, 6) + R` \approx ` + sig(x) : ' = ' + sig(x));
  // 結果 x の表示。項 xs がどれもちょうど書ける値なら、ちょうどの値も添える。丸めた項を使うときは、表示した項の計算結果が
  // 3 桁で x と一致するので、3 桁の結果だけを書く
  const tailOf = (x, xs) => (xs.every(isExact) ? eqTail(x) : ' = ' + sig(x));
  const rad = (deg) => deg * PI / 180;
  const MM = R`\,\mathrm{m}`, MMM = R`\,\mathrm{mm}`, NM = R`\,\mathrm{nm}`, UM = R`\,\mu\mathrm{m}`;
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const nice = (x, d) => Math.abs(x * Math.pow(10, d) - Math.round(x * Math.pow(10, d))) < 1e-7;
  // 105.5 のように 3 桁目の四捨五入の境目になる値のうち、従来の表示（U.sig）が切り上げない値を、候補から外す判定。
  // 丸めは rd3 にそろえてあるので、残った境目の値でも答えと解説の数値は一致する（外すのは、きれいな値を優先するため）
  const stable3 = (x) => Number(U.sig(x, 3)) === P3(x);
  // 候補を「屈折率」などの設定ごとにまとめ、設定を等確率で選んでから、その中の 1 つ（波長が違う例）を選ぶ（候補の多い設定に偏らない）
  function pickBy(rng, cands, keyOf) {
    const groups = {}, keys = [];
    cands.forEach((c) => {
      const k = keyOf(c);
      if (!groups[k]) { groups[k] = []; keys.push(k); }
      groups[k].push(c);
    });
    return rng.pick(groups[rng.pick(keys)]);
  }

  // 図の文字用: 有効数字 3 桁の平文
  function pl(x) {
    if (!isFinite(x)) return '';
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = rd3(x / Math.pow(10, e));
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return m + '×10' + String(e).replace(/-/g, '⁻').replace(/\d/g, (c) => SUP[c]);
    }
    return String(rd3(x));
  }

  // 各グラフ SVG を入れ子の <svg> として 1 枚にまとめる
  function stack(parts, w) {
    let H = 0;
    parts.forEach((p) => { H += p.h; });
    const d = JK.plot.draw(w, H);
    let y = 0;
    parts.forEach((p) => {
      d.group(p.svg.replace(/^<svg[^>]*>/, '<svg x="0" y="' + y + '" width="' + w + '" height="' + p.h + '" viewBox="0 0 ' + w + ' ' + p.h + '" style="overflow:visible">'));
      y += p.h;
    });
    return d.svg();
  }

  /* =====================================================================
     ヤングの実験
     ===================================================================== */
  function solveYoung(lamNm, dMm, L, m, n) {
    const r = { lamNm: lamNm, dMm: dMm, L: L, m: m, n: n };
    r.lam = lamNm * 1e-9; r.lamp = r.lam / n; r.d = dMm * 1e-3;
    r.dx = L * r.lamp / r.d;                             // 明線の間隔 [m]
    r.xm = m * r.dx;
    r.delta = m * r.lamp;                                // m 番目の明線の位置での経路差
    r.sin = m * r.lamp / r.d;
    r.xExact = r.sin < 1 ? L * Math.tan(Math.asin(r.sin)) : NaN;
    return r;
  }

  // 装置の幾何（S₁, S₂, スクリーン上の点 P と経路差）。plate: {n, t}（S₁ の前に置いた薄板）
  function youngGeom(o) {
    o = o || {};
    const d = JK.plot.draw(360, 238);
    const px = 70, sx = 304, yc = 112, dp = 44, yP = yc - 64;
    const s1 = [px, yc - dp / 2], s2 = [px, yc + dp / 2], P = [sx, yP];
    d.line(px, 18, px, s1[1] - 7, { cls: 'fg', w: 3 });
    d.line(px, s1[1] + 7, px, s2[1] - 7, { cls: 'fg', w: 3 });
    d.line(px, s2[1] + 7, px, 204, { cls: 'fg', w: 3 });
    d.line(sx, 18, sx, 204, { cls: 'fg', w: 2 });
    d.dot(s1[0], s1[1], { cls: 'c3', r: 3 });
    d.dot(s2[0], s2[1], { cls: 'c3', r: 3 });
    d.text(px - 8, s1[1] + 4, 'S₁', { size: 12, anchor: 'end' });
    d.text(px - 8, s2[1] + 4, 'S₂', { size: 12, anchor: 'end' });
    d.text(sx + 8, yP + 4, 'P', { size: 13, bold: true, anchor: 'start' });
    d.dot(sx, yc, { cls: 'fg', r: 3 });
    d.text(sx + 8, yc + 4, 'O', { size: 12, anchor: 'start' });
    d.arrow(14, yc, px - 4, yc, { cls: 'c1', w: 2 });
    d.line(s1[0], s1[1], P[0], P[1], { cls: 'c1', w: 1.4 });
    d.line(s2[0], s2[1], P[0], P[1], { cls: 'c2', w: 1.4 });
    // 経路差: S₁ から S₂P に下ろした垂線の足 H。S₂H が経路差 δ ≈ d sinθ
    const vx = P[0] - s2[0], vy = P[1] - s2[1], vl = Math.hypot(vx, vy);
    const ux = vx / vl, uy = vy / vl;
    const th = (s1[0] - s2[0]) * ux + (s1[1] - s2[1]) * uy;                     // S₂ から H までの距離
    const Hp = [s2[0] + th * ux, s2[1] + th * uy];
    d.line(s1[0], s1[1], Hp[0], Hp[1], { cls: 'c3', dash: true, w: 1.2 });
    d.line(s2[0], s2[1], Hp[0], Hp[1], { cls: 'c3', w: 3.2 });
    d.text((s2[0] + Hp[0]) / 2 + 16, (s2[1] + Hp[1]) / 2 + 16, 'δ', { cls: 'c3', size: 13, italic: true });
    // 角 θ（スリットの中点から見た OP の方向）
    const thetaDeg = Math.atan2(yc - yP, sx - px) * 180 / PI;
    d.line(px, yc, sx, yc, { cls: 'dim', dash: true, w: 1 });
    d.line(px, yc, P[0], P[1], { cls: 'dim', dash: true, w: 1 });
    d.angle(px, yc, 60, 0, thetaDeg, 'θ', { cls: 'c3' });
    // d, x, L の寸法
    d.arrow(px - 24, s1[1], px - 24, s2[1], { cls: 'dim', w: 1.2 });
    d.arrow(px - 24, s2[1], px - 24, s1[1], { cls: 'dim', w: 1.2 });
    d.text(px - 30, yc - 10, 'd', { cls: 'dim', size: 12, italic: true, anchor: 'end' });
    d.arrow(sx + 26, yc, sx + 26, yP, { cls: 'dim', w: 1.2 });
    d.arrow(sx + 26, yP, sx + 26, yc, { cls: 'dim', w: 1.2 });
    d.text(sx + 32, (yc + yP) / 2 + 4, 'x', { cls: 'dim', size: 12, italic: true, anchor: 'start' });
    d.arrow(px, 220, sx, 220, { cls: 'dim', w: 1.2 });
    d.arrow(sx, 220, px, 220, { cls: 'dim', w: 1.2 });
    d.text((px + sx) / 2, 234, 'L', { cls: 'dim', size: 12, italic: true });
    if (o.plate) {
      d.rect(px + 6, s1[1] - 11, 22, 22, { cls: 'fg', fill: 'f2', rx: 2 });
      d.text(px + 17, s1[1] - 16, o.plate, { size: 10.5 });
    }
    d.text(66, 12, 'スリット板', { cls: 'dim', size: 10.5 });
    d.text(sx, 12, 'スクリーン', { cls: 'dim', size: 10.5 });
    return d.svg();
  }

  function youngGraph(r) {
    const dxm = r.dx * 1e3;                               // mm
    const I = (x) => Math.pow(Math.cos(PI * x / dxm), 2);
    return JK.plot.graph({
      w: 340, h: 170, x: [-3.3 * dxm, 3.3 * dxm], y: [-0.08, 1.3],
      axis: ['x [mm]', '明るさ'],
      curves: [{ f: I, cls: 'c1', domain: [-3.3 * dxm, 3.3 * dxm] }],
      segs: [
        { x1: dxm, y1: 1.16, x2: 2 * dxm, y2: 1.16, cls: 'c3', arrow: true, label: '' },
        { x1: 2 * dxm, y1: 1.16, x2: dxm, y2: 1.16, cls: 'c3', arrow: true, label: '' }
      ],
      labels: [{ x: 1.5 * dxm, y: 1.22, text: 'Δx = ' + pl(dxm) + ' mm', anchor: 'middle', cls: 'c3' }],
      vlines: r.m !== 0 && Math.abs(r.m) <= 3 ? [{ x: r.m * dxm, label: 'm = ' + r.m, dash: true, cls: 'c2' }] : []
    });
  }

  // opt.noXm: m 番目の明線の位置の行を入れない（演習で m を問わないとき）
  function youngSteps(r, opt) {
    opt = opt || {};
    const steps = [];
    const med = r.n !== 1;
    // 媒質中の波長 λ′ は、媒質（n ≠ 1）のときは途中の値。Δx の式に代入して結果と合う桁数で書く
    const lampS = med ? SV(r.lamp, dig([r.lamp], (l) => r.L * l / r.d)) : nf(r.lamp);
    const dxmm = r.dx * 1e3;
    const dxS = SV(dxmm, dig([dxmm], (x) => r.m * x));       // Δx（mm）。m 倍して x_m を求めるときの桁数
    steps.push({
      t: 'ヤングの実験の仕組み',
      n: R`単色光を、間隔 $d$ の 2 つの細いスリット $S_{1}$, $S_{2}$ に通すと、2 つのスリットは**同じ位相で振動する光源**になり、スクリーン上で 2 つの光が**干渉**して、明るい線（**明線**）と暗い線（**暗線**）が交互に並んだ縞ができます。スクリーン上の位置は、中央の点 O からの距離 $x$ で表します。`,
      easy: R`光は波なので、2 つの波が重なると、強め合って明るくなったり、弱め合って暗くなったりします（**干渉**）。2 本の細い隙間（スリット）から出た光が、スクリーン上で重なると、場所によって「山と山」「山と谷」が出会い、明るい線と暗い線の縞模様ができます。この縞の間隔を測ると、光の波長が分かります。`,
      pro: R`2 つのスリットは同位相の波源。明暗は「2 つの光の経路差」だけで決まる。`
    });
    steps.push({
      t: '経路差を求める',
      m: [R`\delta = |S_{2}P - S_{1}P| \approx d\sin\theta`, R`\sin\theta \approx \tan\theta = \frac{x}{L}\ \Rightarrow\ \delta \approx \frac{dx}{L}`],
      n: R`$S_{1}$ から $S_{2}P$ に垂線 $S_{1}H$ を下ろすと、$L$ が $d$ や $x$ にくらべて十分に大きいとき $S_{1}P \approx HP$ とみなせるので、経路差は $S_{2}H = d\sin\theta$ です（図の太線 $\delta$）。$\theta$ が小さいとき $\sin\theta \approx \tan\theta = \frac{x}{L}$ なので、$\delta = \frac{dx}{L}$ となります。`,
      easy: R`スクリーン上の点 P まで、$S_{1}$ からの光と $S_{2}$ からの光が進む道のりには、差があります（**経路差** $\delta$）。図のように、$S_{1}$ から $S_{2}P$ に垂線 $S_{1}H$ を下ろすと、$S_{1}$ と $H$ は P からほぼ同じ距離にあります。ですから、経路差は $S_{2}H$ の長さで、直角三角形から $d\sin\theta$ です。角 $\theta$ が小さいときは、$\sin\theta$ を $\tan\theta = \frac{x}{L}$（スクリーン上の距離 ÷ スクリーンまでの距離）で置きかえられます。`,
      pro: R`$\delta = d\sin\theta \approx \frac{dx}{L}$（$L$ は $d$ や $x$ より十分に大きい）。導出の図（垂線 $S_{1}H$）は記述問題の定番。`
    });
    steps.push({
      t: '強め合い・弱め合いの条件',
      m: [R`\text{明線: } \delta = m\lambda'\quad (m = 0, \pm 1, \pm 2, \cdots)`, R`\text{暗線: } \delta = \left(m - \frac{1}{2}\right)\lambda'\quad (m = 1, 2, \cdots)`],
      n: R`経路差が波長の**整数倍**なら、2 つの光は山と山・谷と谷が重なって**強め合い**（明線）、**半波長の奇数倍**なら、山と谷が重なって**弱め合い**ます（暗線）。` + (med ? R`装置全体を屈折率 $n = ` + nf(r.n) + R`$ の媒質で満たした場合は、媒質中の波長 $\lambda' = \frac{\lambda}{n} = ` + sig(r.lamp * 1e9) + R`\,\mathrm{nm}$ を使います。` : R`ここでは空気中（真空とほぼ同じ）なので $\lambda' = \lambda$ です。`),
      easy: R`光は波なので、2 つの光が重なるとき、「山と山」が重なれば大きくなり（強め合い）、「山と谷」が重なれば消し合います（弱め合い）。2 つの光の道のりの差（経路差）が、波長のちょうど何倍かで決まります。整数倍（$0$, $\lambda$, $2\lambda$, $\cdots$）なら山と山がそろって明るく、半波長のずれ（$\frac{\lambda}{2}$, $\frac{3\lambda}{2}$, $\cdots$）なら山と谷が重なって暗くなります。` + (med ? R`水など屈折率 $n$ の媒質中では、光の波長が $\frac{1}{n}$ 倍に縮むので、$\lambda$ を $\lambda' = \frac{\lambda}{n}$ に置きかえます。` : '')
    });
    steps.push({
      t: '明線の位置と間隔',
      m: [R`\frac{dx_{m}}{L} = m\lambda' \;\Rightarrow\; x_{m} = m\,\frac{L\lambda'}{d}`,
        R`\Delta x = \frac{L\lambda'}{d} = \frac{` + nf(r.L) + R` \times ` + lampS + '}{' + nf(r.d) + '} = ' + sig(r.dx) + MM + R` = ` + sig(dxmm) + MMM]
        .concat(opt.noXm ? [] : [R`x_{` + r.m + R`} = ` + r.m + R` \times \Delta x = ` + r.m + R` \times ` + dxS + tailOf(r.xm * 1e3, [dxmm]) + MMM]),
      n: R`$\delta = \frac{dx}{L} = m\lambda'$ から、$m$ 番目の明線の位置 $x_{m} = m\frac{L\lambda'}{d}$ が求まります。隣り合う明線の間隔は $\Delta x = \frac{L\lambda'}{d}$ で、$m$ によらず**等間隔**です。暗線は明線と明線のちょうど中間にあります。`,
      easy: R`明線の条件 $\frac{dx}{L} = m\lambda'$ を $x$ について解くと、$x_{m} = m\times\frac{L\lambda'}{d}$ です。$m = 0$ が中央の明線（O の位置）、$m = 1$ が 1 本目、$m = 2$ が 2 本目、…と並びます。隣り合う明線の間隔 $\Delta x = \frac{L\lambda'}{d}$ は、どの明線の間でも同じです。数値は、長さの単位を m にそろえて（nm は $10^{-9}\,\mathrm{m}$、mm は $10^{-3}\,\mathrm{m}$）代入します。`,
      pro: R`$\Delta x = \frac{L\lambda}{d}$。$\Delta x \propto \lambda,\ L$、$\Delta x \propto \frac{1}{d}$。水中なら $\frac{1}{n}$ 倍。白色光なら、波長が長い赤ほど間隔が広い。`
    });
    steps.push({
      t: '暗線の位置',
      m: [R`\frac{dx}{L} = \left(m - \frac{1}{2}\right)\lambda' \;\Rightarrow\; x = \left(m - \frac{1}{2}\right)\Delta x`,
        R`x_{\text{暗},1} = \frac{\Delta x}{2} = \frac{` + SV(dxmm, dig([dxmm], (x) => x / 2)) + R`}{2}` + tailOf(dxmm / 2, [dxmm]) + MMM],
      n: R`中央から数えて 1 番目の暗線は、中央の明線と 1 本目の明線の真ん中（$\frac{\Delta x}{2}$）にあります。`,
      lv: 2
    });
    steps.push({
      t: '近似の確かめ',
      m: [R`\sin\theta_{m} = \frac{m\lambda'}{d} = ` + sig(r.sin) + R`,\qquad x_{m}^{\text{厳密}} = L\tan\theta_{m} = ` + sig(r.xExact * 1e3) + MMM],
      n: R`$\sin\theta \approx \tan\theta$ の近似をしないで計算すると、位置は $L\tan\theta_{m} = ` + sig(r.xExact * 1e3) + R`\,\mathrm{mm}$ で、近似値との差は小さいことが分かります（$\theta$ が小さいほど近似がよい）。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'wave-young',
    field: '波動',
    unit: 'p-interf',
    title: 'ヤングの実験（明線の間隔と経路差）',
    desc: R`2 つのスリットを通った光の干渉で、スクリーンにできる縞の間隔 $\Delta x = \frac{L\lambda}{d}$ と、$m$ 番目の明線の位置・経路差を求めます。経路差の導出図（$\delta = d\sin\theta \approx \frac{dx}{L}$）と、スクリーン上の明るさのグラフを描きます。装置を屈折率 $n$ の媒質で満たした場合も計算できます。`,
    form: [R`\delta = d\sin\theta \approx \frac{dx}{L}`, R`\text{明線: } \delta = m\lambda`, R`\text{暗線: } \delta = \left(m - \frac{1}{2}\right)\lambda`, R`\Delta x = \frac{L\lambda}{d}`],
    inputs: [
      { key: 'lam', label: '光の波長（真空中）λ', unit: 'nm', type: 'num', def: '600', min: 100, max: 3000, hint: '赤 約 700、緑 約 550、青 約 450' },
      { key: 'd', label: 'スリットの間隔 d', unit: 'mm', type: 'num', def: '0.30', min: 0.001, max: 100 },
      { key: 'L', label: 'スリットからスクリーンまでの距離 L', unit: 'm', type: 'num', def: '1.5', min: 0.01, max: 1000 },
      { key: 'm', label: '調べる明線の番号 m', type: 'int', def: '3', min: 0, max: 100, hint: '中央の明線が m = 0' },
      { key: 'n', label: '装置を満たす媒質の屈折率 n', type: 'num', def: '1.00', min: 1, max: 3, hint: '空気中なら 1.00、水中なら 1.33' }
    ],
    examples: [
      { label: '空気中（赤色光）', v: { lam: '700', d: '0.20', L: '1.0', m: '2', n: '1.00' } },
      { label: '空気中（緑色光）', v: { lam: '550', d: '0.25', L: '2.0', m: '4', n: '1.00' } },
      { label: '水中（n = 1.33）', v: { lam: '600', d: '0.30', L: '1.5', m: '3', n: '1.33' } }
    ],
    intro: {
      easy: R`光は波なので、2 つの光が重なると**干渉**します。ヤングの実験では、2 つの細いスリットを通った光がスクリーン上で重なって、明るい線（明線）と暗い線（暗線）の縞ができます。スクリーン上の点 P まで、2 つの光が進む道のりの差（**経路差**）が、波長の**整数倍**なら強め合って明るく、**半波長の奇数倍**なら弱め合って暗くなります。経路差は、スリットの間隔 $d$、スクリーンまでの距離 $L$、中央からの距離 $x$ を使うと、$\delta \approx \frac{dx}{L}$ と表せます。これから、明線の間隔が $\Delta x = \frac{L\lambda}{d}$ と求まります。`,
      normal: R`経路差 $\delta = d\sin\theta \approx \frac{dx}{L}$。明線: $\delta = m\lambda$、暗線: $\delta = (m - \frac{1}{2})\lambda$。明線の間隔 $\Delta x = \frac{L\lambda}{d}$（等間隔）。媒質中では $\lambda \to \frac{\lambda}{n}$。`,
      pro: R`$\Delta x \propto \lambda L/d$。屈折率 $n$ の媒質中では縞の間隔が $\frac{1}{n}$ 倍。片方のスリットを厚さ $t$、屈折率 $n_{p}$ の薄板でおおうと、光路差が $(n_{p} - 1)t$ だけ変わり、縞全体が $x_{0} = \frac{(n_{p}-1)tL}{d}$ だけずれる。`
    },
    compute(v) {
      const r = solveYoung(v.lam, v.d, v.L, v.m, v.n);
      if (!(r.sin < 1)) throw new JK.CalcError('その番号の明線はできません（経路差 mλ′ がスリットの間隔 d 以上になるため）。m を小さくするか、d を大きくしてください。');
      return {
        result: [
          { label: '明線の間隔 Δx', tex: sig(r.dx * 1e3) + MMM },
          { label: v.m + ' 番目の明線の位置 x_m（中央から）', tex: sig(r.xm * 1e3) + MMM },
          { label: '中央から 1 番目の暗線の位置', tex: sig(r.dx * 1e3 / 2) + MMM },
          { label: v.m + ' 番目の明線での経路差 δ', tex: sig(r.delta * 1e9) + NM },
          { label: '媒質中の波長 λ′ = λ/n', tex: sig(r.lamp * 1e9) + NM }
        ],
        steps: youngSteps(r),
        fig: stack([{ svg: youngGeom(), h: 238 }, { svg: youngGraph(r), h: 170 }], 360)
      };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      const fig = (o) => youngGeom(o);
      const solSteps = (r) => youngSteps(r);
      if (level === 'basic') {
        const lam = rng.pick([450, 500, 540, 600, 650, 700]);
        const d = rng.pick([0.10, 0.20, 0.25, 0.30, 0.40]);
        const L = rng.pick([1.0, 1.2, 1.5, 2.0]);
        const m = rng.pick([2, 3, 4]);
        const r = solveYoung(lam, d, L, m, 1);
        return {
          title: 'ヤングの実験の縞の間隔',
          body: R`間隔 $` + d.toFixed(2) + R`\,\mathrm{mm}$ の 2 つのスリットに、波長 $` + lam.toFixed(0) + R`\,\mathrm{nm}$ の単色光を当て、スリットから $` + L.toFixed(1) + R`\,\mathrm{m}$ はなれたスクリーン上に干渉縞をつくった。空気中で実験を行い、空気の屈折率は $1$ とする。次の問いに答えよ。`,
          fig: fig(),
          parts: [
            { label: '(1)', q: R`隣り合う明線の間隔 $\Delta x$`, type: 'num', answer: P3(r.dx * 1e3), rel: tol.rel, unit: 'mm' },
            { label: '(2)', q: R`中央の明線から数えて $` + m + R`$ 番目の明線までの距離 $x_{` + m + R`}$`, type: 'num', answer: P3(r.xm * 1e3), rel: tol.rel, unit: 'mm' }
          ],
          solution: solSteps(r)
        };
      }
      if (level === 'mid') {
        let lam, d, L, k, r;
        for (let i = 0; i < 200; i++) {
          lam = rng.pick([500, 540, 600, 640]);
          d = rng.pick([0.20, 0.25, 0.30, 0.40]);
          L = rng.pick([1.0, 1.5, 2.0]);
          k = rng.pick([1.5, 2.0, 2.5, 3.0, 3.5]);
          r = solveYoung(lam, d, L, 1, 1);
          if (nice(k * r.dx * 1e3, 2)) break;
        }
        const xP = k * r.dx;
        const delta = r.d * xP / L;                                     // 経路差 [m]
        const q = delta / r.lam;
        const bright = Math.abs(q - Math.round(q)) < 1e-6;
        // 設問（点 P の経路差 → 波長の何倍か → 明暗）に答えるステップを、条件の説明のあとに入れる。
        // 明線の間隔 Δx は設問に出ないので、最後に「検算」（lv 2）として、P が Δx の何倍の位置かで確かめる
        const r1 = solveYoung(lam, d, L, 1, 1);
        const g = solSteps(r1);
        const xPmm = xP * 1e3, kk = xP / r1.dx;
        const sol = [g[0], g[1], g[2], {
          t: '点 P での経路差と明暗',
          m: [R`\delta \approx \frac{dx}{L} = \frac{` + nf(r.d) + R` \times ` + nf(xP) + '}{' + nf(L) + '} = ' + sig(delta) + MM + R` = ` + SV(delta * 1e9, 3) + NM,
            R`\frac{\delta}{\lambda} = \frac{` + SV(delta * 1e9, 3) + '}{' + nf(lam) + '}' + eqTail(q),
            R`\frac{\delta}{\lambda} = ` + sig(q) + R`\ \Rightarrow\ ` + (bright ? R`\text{整数なので強め合い（明線）: 明るい}` : R`\text{半整数なので弱め合い（暗線）: 暗い}`)],
          n: R`点 P は、中央の明線 O から $x = ` + xPmm.toFixed(2) + R`\,\mathrm{mm}$ の位置です。経路差 $\delta = \frac{dx}{L}$ を求め、それが波長 $\lambda$ の何倍かを調べます。` + (bright ? R`整数倍なので、2 つの光は山と山が重なって強め合い、点 P は**明るい**（明線の位置）です。` : R`半整数倍（$\frac{1}{2}$ の奇数倍）なので、2 つの光は山と谷が重なって弱め合い、点 P は**暗い**（暗線の位置）です。`),
          easy: R`スクリーン上の点 P まで、2 つのスリットからの光の道のりの差（経路差）を $\delta = \frac{dx}{L}$ で計算します。この差が波長 $\lambda$ の何倍になるかを見て、整数倍なら明るく、半整数倍（$0.5$, $1.5$, $2.5$, $\cdots$）なら暗くなります。`
        }, {
          t: R`検算: 明線の間隔 $\Delta x$ との比較`,
          m: [R`\Delta x = \frac{L\lambda}{d} = \frac{` + nf(L) + R` \times ` + nf(r1.lam) + '}{' + nf(r1.d) + '} = ' + sig(r1.dx * 1e3) + MMM,
            R`\frac{x}{\Delta x} = \frac{` + nf(xPmm) + '}{' + SV(r1.dx * 1e3, dig([r1.dx * 1e3], (x) => xPmm / x)) + '}' + eqTail(kk)],
          n: R`明線は $x = m\Delta x$（$m$ は整数）の位置、暗線は $x = \left(m - \frac{1}{2}\right)\Delta x$ の位置にあります。点 P は明線の間隔 $\Delta x$ の $` + sig(kk) + R`$ 倍の位置にあるので、` + (bright ? R`整数倍で明線の位置、つまり明るいことが確かめられます。` : R`半整数倍で暗線の位置、つまり暗いことが確かめられます。`),
          lv: 2
        }];
        return {
          title: 'スクリーン上の点の経路差と明暗',
          body: R`間隔 $` + d.toFixed(2) + R`\,\mathrm{mm}$ の 2 つのスリットに、波長 $` + lam.toFixed(0) + R`\,\mathrm{nm}$ の単色光を当て、スリットから $` + L.toFixed(1) + R`\,\mathrm{m}$ はなれたスクリーン上に干渉縞をつくった。スクリーン上で、中央の明線の位置 O から $` + (xP * 1e3).toFixed(2) + R`\,\mathrm{mm}$ はなれた点 P に注目する。空気中で実験し、$\sin\theta \approx \tan\theta$ の近似を使ってよい。次の問いに答えよ。`,
          fig: fig(),
          parts: [
            { label: '(1)', q: R`点 P での 2 つの光の経路差 $\delta$`, type: 'num', answer: P3(delta * 1e9), rel: tol.rel, unit: 'nm', hint: R`単位は nm（$10^{-9}\,\mathrm{m}$）で答える` },
            { label: '(2)', q: R`経路差 $\delta$ は、波長 $\lambda$ の何倍か（$\frac{\delta}{\lambda}$）`, type: 'num', answer: P3(q), rel: tol.rel },
            { label: '(3)', q: R`点 P は明るいか、暗いか`, type: 'choice', choices: ['明るい（明線の位置）', '暗い（暗線の位置）'], answer: bright ? 0 : 1 }
          ],
          solution: sol
        };
      }
      // adv: スリットの一方を薄い板でおおったときの縞のずれ
      let lam, d, L, np, t, r;
      for (let i = 0; i < 300; i++) {
        lam = rng.pick([500, 600, 650]);
        d = rng.pick([0.20, 0.25, 0.30]);
        L = rng.pick([1.0, 1.5, 2.0]);
        np = rng.pick([1.30, 1.50, 1.60]);
        t = rng.pick([2.0, 3.0, 4.0, 5.0]);                               // μm
        r = solveYoung(lam, d, L, 1, 1);
        const eps = (np - 1) * t * 1e-6, x0 = eps * L / r.d;
        if (nice(x0 * 1e3, 2) && eps / r.lam > 1.2 && eps / r.lam < 8) break;
      }
      const eps = (np - 1) * t * 1e-6;
      const x0 = eps * L / r.d;
      const sol = youngSteps(r, { noXm: true }).slice(0, 4).concat([{
        t: R`(2)(3) 薄い板をおいたときの縞のずれ`,
        m: [R`\varepsilon = (n_{p} - 1)\,t = (` + nf(np) + ' - 1) \\times ' + nf(t) + R`\,\mu\mathrm{m} = ` + sig(eps * 1e9) + NM,
          R`\frac{\varepsilon}{\lambda} = \frac{` + sig(eps * 1e9) + '}{' + nf(lam) + '} = ' + sig(eps / r.lam),
          R`x_{0} = \frac{\varepsilon L}{d} = \frac{` + sig(eps) + R` \times ` + nf(L) + '}{' + nf(r.d) + '} = ' + sig(x0) + MM + R` = ` + sig(x0 * 1e3) + MMM],
        n: R`厚さ $t$、屈折率 $n_{p}$ の板の中では、光の波長が $\frac{1}{n_{p}}$ 倍に縮み、同じ厚さ $t$ のあいだに含まれる波の数が $n_{p}$ 倍になるので、光学的な道のり（光路長）が $n_{p}t$ になります。板がないとき（光路長 $t$）にくらべて、光路差は $\varepsilon = (n_{p} - 1)t$ だけ増えます。経路差が 0 になる点（中央の明線）は、板でおおったスリット $S_{1}$ の側に、$\frac{dx_{0}}{L} = \varepsilon$ から $x_{0} = \frac{\varepsilon L}{d}$ だけずれます。縞の間隔 $\Delta x$ は変わりません。`,
        easy: R`スリット $S_{1}$ の前に、透明な板をおくと、板の中では光が遅くなるので、$S_{1}$ から出た光は、板がないときより「遅れて」到着します。この遅れは、道のりに直して $\varepsilon = (n_{p} - 1)t$ だけ長くなったのと同じ効果です。すると、「2 つの光が同じ時刻に着く」（経路差が 0 になる）点が、中央ではなく、遅れた $S_{1}$ の側へずれます。ずれの大きさは、経路差の式 $\frac{dx}{L} = \varepsilon$ から $x_{0} = \frac{\varepsilon L}{d}$ です。縞の間隔そのものは、板をおいても変わりません。`,
        pro: R`スリットを薄膜でおおう問題は「光路差の変化 $(n-1)t$ → 縞のずれ $\frac{(n-1)tL}{d}$（$= \frac{(n-1)t}{\lambda}$ 本ぶん）」。ずれる向きは、おおったスリット側。`
      }]);
      return {
        title: 'スリットを薄い板でおおったときの縞のずれ',
        body: R`間隔 $` + d.toFixed(2) + R`\,\mathrm{mm}$ の 2 つのスリット $S_{1}$, $S_{2}$ に、波長 $` + lam.toFixed(0) + R`\,\mathrm{nm}$ の単色光を当て、スリットから $` + L.toFixed(1) + R`\,\mathrm{m}$ はなれたスクリーン上に干渉縞をつくった（装置は空気中にある）。つぎに、$S_{1}$ の直後に、厚さ $` + t.toFixed(1) + R`\,\mu\mathrm{m}$、屈折率 $` + np.toFixed(2) + R`$ の薄い透明な板を、光の進む向きに垂直におくと、干渉縞全体がずれた。$\sin\theta \approx \tan\theta$ の近似を使ってよい。次の問いに答えよ。`,
        fig: fig({ plate: '板' }),
        parts: [
          { label: '(1)', q: R`薄い板をおく前の、明線の間隔 $\Delta x$`, type: 'num', answer: P3(r.dx * 1e3), rel: tol.rel, unit: 'mm' },
          { label: '(2)', q: R`板をおくことによる、$S_{1}$ を通る光の光路差の増加 $\varepsilon = (n_{p} - 1)t$`, type: 'num', answer: P3(eps * 1e9), rel: tol.rel, unit: 'nm', hint: R`単位は nm（$10^{-9}\,\mathrm{m}$）` },
          { label: '(3)', q: R`中央の明線（経路差 0 の位置）がずれる距離 $x_{0}$`, type: 'num', answer: P3(x0 * 1e3), rel: tol.rel, unit: 'mm' }
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     回折格子
     ===================================================================== */
  function solveGrating(N, lamNm, m, L) {
    const r = { N: N, lamNm: lamNm, m: m, L: L };
    r.lam = lamNm * 1e-9;
    r.d = 1e-3 / N;                                      // 格子定数 [m]
    r.sin = m * r.lam / r.d;
    r.mmax = Math.ceil(r.d / r.lam - 1e-9) - 1;          // 観測できる最大の次数（sinθ < 1）
    if (r.sin < 1) {
      r.th = Math.asin(r.sin); r.thDeg = r.th * 180 / PI;
      r.x = L * Math.tan(r.th);
    }
    return r;
  }

  function gratingFig(r, o) {
    o = o || {};
    const d = JK.plot.draw(360, 262);
    const gx = 64, yc = 128;
    let smax = 0.05;
    for (let k = 1; k <= 40; k++) {
      const s = k * r.lam / r.d;
      if (s >= 1) break;
      if (k <= Math.max(Math.min(r.mmax, 5), Math.abs(r.m))) smax = Math.max(smax, s);
    }
    const R0 = Math.min(160, 92 / smax);
    d.line(gx, 26, gx, 230, { cls: 'fg', dash: '2 5', w: 4 });
    d.text(gx, 16, '回折格子', { cls: 'dim', size: 11 });
    d.arrow(12, yc, gx - 6, yc, { cls: 'c1', w: 2.2 });
    d.text(30, yc - 10, '入射光', { cls: 'dim', size: 11 });
    const Kmax = Math.min(Math.max(r.mmax, 0), 5);
    const kk = Math.max(Kmax, Math.abs(r.m));
    for (let k = -kk; k <= kk; k++) {
      const s = k * r.lam / r.d;
      if (Math.abs(s) >= 1) continue;
      const th = Math.asin(s);
      const ex = gx + R0 * Math.cos(th), ey = yc - R0 * Math.sin(th);
      const sel = Math.abs(k) === Math.abs(r.m) && !o.problem;
      d.line(gx, yc, ex, ey, { cls: sel ? 'c3' : 'c2', w: sel ? 2.6 : 1.5 });
      d.text(ex + 6, ey + 4, 'm = ' + (k > 0 ? '+' + k : k), { cls: sel ? 'c3' : 'dim', size: 10.5, anchor: 'start' });
    }
    if (r.sin < 1 && !o.problem) d.angle(gx, yc, 56, 0, r.thDeg, 'θ', { cls: 'c3' });
    d.text(180, 248, 'N = ' + pl(r.N) + ' 本/mm　d = ' + pl(r.d * 1e6) + ' μm　λ = ' + pl(r.lamNm) + ' nm', { size: 12 });
    return d.svg();
  }

  // adv 用: 2 つの波長が重なる明線（問題用の概念図）
  function gratingOverlapFig(N, L, la, lb) {
    const d = JK.plot.draw(360, 236);
    const gx = 60, yc = 120, sx = 306;
    d.line(gx, 24, gx, 216, { cls: 'fg', dash: '2 5', w: 4 });
    d.text(gx, 14, '回折格子', { cls: 'dim', size: 11 });
    d.line(sx, 24, sx, 216, { cls: 'fg', w: 2 });
    d.text(sx, 14, 'スクリーン', { cls: 'dim', size: 11 });
    d.arrow(10, yc, gx - 6, yc, { cls: 'c1', w: 2.2 });
    d.text(30, yc - 10, '入射光', { cls: 'dim', size: 11 });
    d.text(30, yc + 16, 'λ₁, λ₂', { cls: 'dim', size: 11 });
    const th = rad(30), ey = yc - (sx - gx) * Math.tan(th);
    d.line(gx, yc, sx, ey, { cls: 'c3', w: 2 });
    d.line(gx, yc, sx, ey + 0.001, { cls: 'c2', w: 1.2, dash: true });
    d.dot(sx, ey, { cls: 'c3', r: 4 });
    d.text(sx - 8, ey - 8, '重なった明線 P', { cls: 'c3', size: 11, anchor: 'end' });
    d.line(gx, yc, sx, yc, { cls: 'dim', dash: true, w: 1 });
    d.dot(sx, yc, { cls: 'fg', r: 3 });
    d.text(sx + 8, yc + 4, 'O', { size: 12, anchor: 'start' });
    d.arrow(sx + 24, yc, sx + 24, ey, { cls: 'dim', w: 1.2 });
    d.arrow(sx + 24, ey, sx + 24, yc, { cls: 'dim', w: 1.2 });
    d.text(sx + 30, (yc + ey) / 2 + 4, 'x', { cls: 'dim', size: 12, italic: true, anchor: 'start' });
    d.arrow(gx, 206, sx, 206, { cls: 'dim', w: 1.2 });
    d.arrow(sx, 206, gx, 206, { cls: 'dim', w: 1.2 });
    d.text((gx + sx) / 2, 224, 'L = ' + pl(L) + ' m', { size: 12 });
    d.angle(gx, yc, 50, 0, 30, 'θ', { cls: 'c3' });
    d.text(180, 40, 'N = ' + pl(N) + ' 本/mm　λ₁ = ' + pl(la) + ' nm，λ₂ = ' + pl(lb) + ' nm', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // opt.lvMax / opt.lvPos: 演習で、最大の次数・スクリーン上の位置を問うとき（そのステップを lv 1 にする）。
  // opt.noPos: 演習で、スクリーンまでの距離 L を与えていないとき（スクリーン上の位置のステップを入れない）
  function gratingSteps(r, opt) {
    opt = opt || {};
    const steps = [];
    steps.push({
      t: '回折格子と強め合いの条件',
      m: [R`d\sin\theta = m\lambda\quad (m = 0, \pm 1, \pm 2, \cdots)`],
      n: R`**回折格子**は、細いスリットを多数、等間隔 $d$（**格子定数**）に並べたものです。となり合うスリットから、角 $\theta$ の方向へ進む光の経路差は $d\sin\theta$ で、これが波長の**整数倍**になる方向で、すべてのスリットからの光が強め合って、明るい線（明線）になります。$m$ を**次数**といいます。`,
      easy: R`たくさんの細い隙間（スリット）が等間隔に並んだものを、回折格子といいます。そこへ光を当てると、光は隙間を通るとき広がって（回折して）、隣り合う隙間からの光が重なり合います。ある方向では、隣の隙間からの光とちょうど波長の整数倍だけずれて、すべての光が山と山でそろって強め合い、そこに明るい線ができます。その方向の角度 $\theta$ の条件が $d\sin\theta = m\lambda$ です。$m = 0$ はまっすぐ進む光で、$m = 1, 2, \cdots$ は、中央から数えた明線の番号です。`,
      pro: R`隣り合うスリットからの経路差 $d\sin\theta = m\lambda$。スリットの数が多いほど、明線は細く鋭くなる（ヤングの 2 重スリットは明るさがなだらかに変化する）。`
    });
    steps.push({
      t: '格子定数',
      m: [R`d = \frac{1\,\mathrm{mm}}{N} = \frac{1.00 \times 10^{-3}\,\mathrm{m}}{` + nf(r.N) + '} = ' + sig(r.d) + MM + R` = ` + sig(r.d * 1e6) + UM],
      n: R`1 mm あたり $N$ 本のスリット（溝）があるとき、スリットの間隔（格子定数）は $d = \frac{1\,\mathrm{mm}}{N}$ です。単位を m に直して使います。`,
      easy: R`「1 mm に $N$ 本」という書き方は、1 mm（$10^{-3}\,\mathrm{m}$）を $N$ 個に等分したのが、スリットの間隔 $d$ だ、という意味です。たとえば $500$ 本/mm なら、$d = \frac{1}{500}\,\mathrm{mm} = 2.00 \times 10^{-3}\,\mathrm{mm} = 2.00\,\mu\mathrm{m}$ です。`
    });
    if (r.sin < 1) {
      steps.push({
        t: '回折角を求める',
        // 格子定数 d は途中の値（1 mm ÷ N）。表示した d で計算し直して結果と合う桁数で書く
        m: [R`\sin\theta_{` + r.m + R`} = \frac{m\lambda}{d} = \frac{` + r.m + R` \times ` + nf(r.lam) + '}{' + SV(r.d, dig([r.d], (d) => r.m * r.lam / d)) + '}' + tailOf(r.sin, [r.d]),
          R`\theta_{` + r.m + R`} = ` + sig(r.thDeg) + R`\degree`],
        n: R`条件式を $\sin\theta$ について解きます。$\lambda$ が長いほど（赤い光ほど）、$d$ が小さいほど（溝が密なほど）、回折角は大きくなります。`,
        easy: R`条件式 $d\sin\theta = m\lambda$ を、$\sin\theta = \frac{m\lambda}{d}$ の形に直して、数値を入れます。$\sin\theta$ が求まったら、電卓の逆関数で角度に直します。波長が長い光ほど、大きく曲がります。白色光を当てると、紫から赤まで色が分かれて並ぶのは、このためです。`
      });
    }
    steps.push({
      t: '観測できる最大の次数',
      m: [R`\sin\theta < 1 \;\Rightarrow\; m < \frac{d}{\lambda} = \frac{` + SV(r.d, dig([r.d], (d) => d / r.lam)) + '}{' + nf(r.lam) + '}' + tailOf(r.d / r.lam, [r.d]) + R`\ \Rightarrow\ m_{\max} = ` + r.mmax],
      n: R`$\sin\theta$ は 1 をこえられないので、$m\lambda < d$ を満たす次数までしか明線ができません。この条件で観測できる最大の次数は $m_{\max} = ` + r.mmax + R`$ で、$m = \pm ` + (r.mmax > 0 ? '1' : '0') + R`$ から $\pm ` + r.mmax + R`$ までの明線が（中央の $m = 0$ とあわせて）観測できます。`,
      easy: R`次数を大きくしていくと、回折角もどんどん大きくなり、いつかは $90\degree$（真横）をこえてしまいます。$\sin\theta$ は 1 をこえないので、それ以上の次数の明線は、できません。ですから、$m\lambda < d$ を満たす整数 $m$ のうち、いちばん大きいものが、観測できる最大の次数です。`,
      lv: opt.lvMax ? 1 : 2
    });
    if (r.sin < 1 && !opt.noPos) {
      const tn = Math.tan(r.th);
      steps.push({
        t: 'スクリーン上の位置',
        m: [R`x_{` + r.m + R`} = L\tan\theta_{` + r.m + R`} = ` + nf(r.L) + R` \times ` + SV(tn, dig([tn], (t) => r.L * t)) + tailOf(r.x, [tn]) + MM],
        n: R`格子から距離 $L$ のスクリーン上で、中央の明線 ($m = 0$) から $m$ 次の明線までの距離は $x_{m} = L\tan\theta_{m}$ です。`,
        easy: R`スクリーンが格子から $L$ はなれているとき、角度 $\theta$ の方向に進む光は、スクリーン上で、中央から $L\tan\theta$ の位置に当たります（直角三角形の、横が $L$、縦が $x$、角が $\theta$）。回折角が大きいときは、$\sin\theta$ と $\tan\theta$ の差が大きいので、$\tan\theta$ を使って計算します。`,
        lv: opt.lvPos ? 1 : 2
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'wave-grating',
    field: '波動',
    unit: 'p-interf',
    title: '回折格子（d sinθ = mλ）',
    desc: R`1 mm あたり $N$ 本の回折格子に、波長 $\lambda$ の光を当てたときの、格子定数 $d$、$m$ 次の明線の回折角、観測できる最大の次数、スクリーン上の位置を求めます。光線の広がりを図に描きます。`,
    form: [R`d = \frac{1\,\mathrm{mm}}{N}`, R`d\sin\theta = m\lambda`, R`x_{m} = L\tan\theta_{m}`],
    inputs: [
      { key: 'N', label: '1 mm あたりの溝の数 N', unit: '本/mm', type: 'num', def: '500', min: 1, max: 100000 },
      { key: 'lam', label: '光の波長 λ', unit: 'nm', type: 'num', def: '600', min: 100, max: 3000 },
      { key: 'm', label: '調べる次数 m', type: 'int', def: '1', min: 1, max: 100 },
      { key: 'L', label: '格子からスクリーンまでの距離 L', unit: 'm', type: 'num', def: '1.0', min: 0.01, max: 1000 }
    ],
    examples: [
      { label: '500 本/mm・赤い光（1 次）', v: { N: '500', lam: '700', m: '1', L: '1.0' } },
      { label: '500 本/mm・緑の光（2 次）', v: { N: '500', lam: '550', m: '2', L: '2.0' } },
      { label: '300 本/mm・青い光（3 次）', v: { N: '300', lam: '450', m: '3', L: '1.5' } }
    ],
    intro: {
      easy: R`たくさんの細い溝を等間隔に並べた**回折格子**に光を当てると、光は溝を通るときに広がり、特定の方向だけで明るい線（明線）をつくります。溝の間隔（**格子定数**）を $d$、光の波長を $\lambda$ とすると、明線の方向の角度 $\theta$ は、$d\sin\theta = m\lambda$（$m = 0, \pm 1, \pm 2, \cdots$）で決まります。$m$ は中央から数えた明線の番号（**次数**）です。波長が長い光ほど大きく曲がるので、白色光を当てると色が分かれて見えます（CD の裏側が虹色に見えるのも同じ原理です）。`,
      normal: R`$d = \frac{1\,\mathrm{mm}}{N}$、$d\sin\theta_{m} = m\lambda$、$\sin\theta_{m} < 1$ より $m < \frac{d}{\lambda}$。スクリーン上の位置は $x_{m} = L\tan\theta_{m}$。`,
      pro: R`ヤングの実験と同じ「経路差 = 波長の整数倍」の条件だが、$\theta$ が大きく近似 $\sin\theta \approx \tan\theta$ は使えない。2 つの波長の明線が重なる条件は $m_{1}\lambda_{1} = m_{2}\lambda_{2}$。`
    },
    compute(v) {
      const r = solveGrating(v.N, v.lam, v.m, v.L);
      if (!(r.sin < 1)) {
        throw new JK.CalcError('その次数の明線はできません（m が大きすぎて、sinθ = mλ/d が 1 以上になります）。観測できる最大の次数は m = ' + Math.max(r.mmax, 0) + ' です。m を小さくしてください。');
      }
      return {
        result: [
          { label: '格子定数 d', tex: sig(r.d * 1e6) + UM },
          { label: v.m + ' 次の明線の sinθ', tex: sig(r.sin) },
          { label: v.m + ' 次の明線の回折角 θ', tex: sig(r.thDeg) + R`\degree` },
          { label: '観測できる最大の次数 m_max', tex: String(Math.max(r.mmax, 0)) },
          { label: v.m + ' 次の明線の、スクリーン上での中央からの距離', tex: sig(r.x) + MM }
        ],
        steps: gratingSteps(r),
        fig: gratingFig(r)
      };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      if (level === 'basic') {
        const N = rng.pick([200, 250, 400, 500, 800]);
        const lam = rng.pick([400, 500, 600, 650, 700]);
        const r = solveGrating(N, lam, 1, 1.0);
        return {
          title: '回折格子の格子定数と回折角',
          body: R`1 mm あたり $` + N.toFixed(0) + R`$ 本の溝がある回折格子に、波長 $` + lam.toFixed(0) + R`\,\mathrm{nm}$ の単色光を垂直に当てた。次の問いに答えよ。`,
          fig: gratingFig(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`回折格子の格子定数 $d$`, type: 'num', answer: P3(r.d * 1e6), rel: tol.rel, unit: 'μm' },
            { label: '(2)', q: R`1 次の明線（$m = 1$）について、$\sin\theta_{1}$ の値`, type: 'num', answer: P3(r.sin), rel: tol.rel }
          ],
          solution: gratingSteps(r, { noPos: true })       // スクリーンまでの距離 L は問題文にないので、スクリーン上の位置のステップは入れない
        };
      }
      if (level === 'mid') {
        let N, lam, L, r2;
        for (let i = 0; i < 200; i++) {
          N = rng.pick([200, 250, 300, 400, 500]);
          lam = rng.pick([400, 450, 500, 600, 650]);
          L = rng.pick([1.0, 1.5, 2.0]);
          r2 = solveGrating(N, lam, 2, L);
          if (r2.sin < 0.9) break;
        }
        const r1 = solveGrating(N, lam, 2, L);
        return {
          title: '2 次の明線とスクリーン上の位置',
          body: R`1 mm あたり $` + N.toFixed(0) + R`$ 本の溝がある回折格子に、波長 $` + lam.toFixed(0) + R`\,\mathrm{nm}$ の単色光を垂直に当て、格子から $` + L.toFixed(1) + R`\,\mathrm{m}$ はなれたスクリーン上に明線をつくった。次の問いに答えよ。`,
          fig: gratingFig(r1, { problem: true }),
          parts: [
            { label: '(1)', q: R`2 次の明線（$m = 2$）について、$\sin\theta_{2}$ の値`, type: 'num', answer: P3(r1.sin), rel: tol.rel },
            { label: '(2)', q: R`観測できる明線の、次数 $m$ の最大値 $m_{\max}$（$\sin\theta < 1$ の範囲）`, type: 'num', answer: r1.mmax, rel: 0.0, tol: 0.001 },
            { label: '(3)', q: R`中央の明線から 2 次の明線までの、スクリーン上の距離 $x_{2}$`, type: 'num', answer: P3(r1.x), rel: tol.rel, unit: 'm' }
          ],
          solution: gratingSteps(r1, { lvMax: true, lvPos: true })       // (2) 最大の次数、(3) スクリーン上の位置のステップは lv 1
        };
      }
      // adv: 波長 λ_a（3 次）と λ_b = 1.5 λ_a（2 次）の明線が重なる
      const cands = [];
      const La = (la) => 1.5 * la;
      [300, 400, 500, 600].forEach((N) => [400, 420, 440, 460].forEach((la) => [1.0, 1.5, 2.0].forEach((L) => {
        const s = 3 * la * 1e-9 / (1e-3 / N);
        if (s < 0.92 && s > 0.2 && nice(La(la), 0)) cands.push([N, la, L]);
      })));
      const c = rng.pick(cands);
      const N = c[0], la = c[1], lb = La(la), L = c[2];
      const d = 1e-3 / N;
      const sinT = 3 * la * 1e-9 / d, cosT = Math.sqrt(1 - sinT * sinT), tanT = sinT / cosT;
      const x = L * tanT;
      const dT = dig([sinT, cosT], (s, c_) => s / c_);      // tan = sin ÷ cos の式に代入する sin・cos の桁数
      const ra = solveGrating(N, la, 3, L);
      const sol = [
        gratingSteps(ra)[0],
        gratingSteps(ra)[1],
        {
          t: R`(2) 2 つの波長の明線が重なる条件と $\sin\theta$`,
          m: [R`d\sin\theta = m_{a}\lambda_{a} = m_{b}\lambda_{b}`,
            R`\lambda_{b} = ` + nf(lb) + R`\,\mathrm{nm} = 1.5\lambda_{a} \;\Rightarrow\; 3\lambda_{a} = 2\lambda_{b}`,
            // 格子定数 d は途中の値（1 mm ÷ N）。表示した d で計算し直して結果と合う桁数で書く
            R`\sin\theta = \frac{3\lambda_{a}}{d} = \frac{3 \times ` + nf(la * 1e-9) + '}{' + SV(d, dig([d], (d_) => 3 * la * 1e-9 / d_)) + '}' + tailOf(sinT, [d])],
          n: R`同じ角 $\theta$ の方向に、波長 $\lambda_{a}$ の $m_{a}$ 次の明線と、波長 $\lambda_{b}$ の $m_{b}$ 次の明線がくるとき、$m_{a}\lambda_{a} = m_{b}\lambda_{b}$ です。$\lambda_{b} = 1.5\lambda_{a}$ より、$m_{a} : m_{b} = 3 : 2$ のとき重なるので、もっとも小さい次数の組は $m_{a} = 3$（$\lambda_{a}$ の 3 次）、$m_{b} = 2$（$\lambda_{b}$ の 2 次）です。`,
          easy: R`波長が違う 2 つの光は、同じ格子に当たっても、明線の方向がずれます。ところが、ある次数の組み合わせでは、ちょうど同じ方向に重なります。条件は、$d\sin\theta = m\lambda$ の右辺が等しいこと、つまり「$\lambda_{a}$ の $m_{a}$ 倍 = $\lambda_{b}$ の $m_{b}$ 倍」です。$\lambda_{b}$ が $\lambda_{a}$ のちょうど 1.5 倍（3 : 2）なので、$\lambda_{a} \times 3 = \lambda_{b} \times 2$ となって、この組で重なります。`
        },
        {
          t: R`(3) 重なった明線のスクリーン上の位置`,
          m: [R`\cos\theta = \sqrt{1 - \sin^{2}\theta} = \sqrt{1 - ` + SV(sinT, dig([sinT], (s) => Math.sqrt(1 - s * s))) + R`^{2}}` + tailOf(cosT, [sinT]),
            R`\tan\theta = \frac{\sin\theta}{\cos\theta} = \frac{` + SV(sinT, dT) + '}{' + SV(cosT, dT) + '}' + tailOf(tanT, [sinT, cosT]),
            R`x = L\tan\theta = ` + nf(L) + R` \times ` + SV(tanT, dig([tanT], (t) => L * t)) + tailOf(x, [tanT]) + MM],
          n: R`$\sin\theta$ が求まったので、$\cos\theta$ と $\tan\theta$ を計算し、$x = L\tan\theta$ でスクリーン上の位置を出します。`,
          easy: R`スクリーン上の位置 $x$ は、$L\tan\theta$ で求まります。$\sin\theta$ の値から $\tan\theta$ を出すには、まず $\cos\theta = \sqrt{1 - \sin^{2}\theta}$ を計算して、$\tan\theta = \frac{\sin\theta}{\cos\theta}$ とします。`
        }
      ];
      return {
        title: '2 つの波長の明線が重なる位置',
        body: R`1 mm あたり $` + N.toFixed(0) + R`$ 本の溝がある回折格子に、波長 $\lambda_{a} = ` + la.toFixed(0) + R`\,\mathrm{nm}$ と $\lambda_{b} = ` + lb.toFixed(0) + R`\,\mathrm{nm}$ の 2 つの光を含む光を垂直に当て、格子から $` + L.toFixed(1) + R`\,\mathrm{m}$ はなれたスクリーン上に明線をつくった。中央の明線以外で、$\lambda_{a}$ の 3 次の明線と、$\lambda_{b}$ の 2 次の明線がちょうど重なった位置 P ができた。次の問いに答えよ。`,
        fig: gratingOverlapFig(N, L, la, lb),
        parts: [
          { label: '(1)', q: R`回折格子の格子定数 $d$`, type: 'num', answer: P3(d * 1e6), rel: tol.rel, unit: 'μm' },
          { label: '(2)', q: R`重なった明線の回折角 $\theta$ について、$\sin\theta$ の値`, type: 'num', answer: P3(sinT), rel: tol.rel },
          { label: '(3)', q: R`中央の明線から P までの距離 $x$`, type: 'num', answer: P3(x), rel: tol.rel, unit: 'm' }
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     薄膜の干渉
     ===================================================================== */
  function solveFilm(n0, n1, n2, tNm, lamNm) {
    const r = { n0: n0, n1: n1, n2: n2, t: tNm, lam: lamNm };
    r.f1 = n1 > n0;                                       // 上面（n0 → n1）での反射で位相が π ずれるか
    r.f2 = n2 > n1;                                       // 下面（n1 → n2）での反射で位相が π ずれるか
    r.flips = (r.f1 ? 1 : 0) + (r.f2 ? 1 : 0);
    r.odd = r.flips % 2 === 1;
    r.path = 2 * n1 * tNm;                                // 光路差 [nm]
    r.q = r.path / lamNm;
    r.eff = r.q + r.flips / 2;
    r.frac = r.eff - Math.round(r.eff);                   // 0: 強め合い、±0.5: 弱め合い
    r.lamFilm = lamNm / n1;
    // 強め合う / 弱め合う最小の膜厚（> 0）
    r.tC = r.odd ? lamNm / (4 * n1) : lamNm / (2 * n1);
    r.tD = r.odd ? lamNm / (2 * n1) : lamNm / (4 * n1);
    const af = Math.abs(r.frac);
    r.kind = af < 1e-6 ? 'c' : (Math.abs(af - 0.5) < 1e-6 ? 'd' : (af < 0.1 ? 'cc' : (af > 0.4 ? 'dd' : 'mid')));
    return r;
  }

  // 可視光（380〜780 nm）で強め合う / 弱め合う波長の一覧
  function visibleList(r) {
    const c = [], d = [];
    const sets = r.odd ? { c: 0.5, d: 0 } : { c: 0, d: 0.5 };           // q = k - offset（k は整数）
    for (let k = 1; k <= 400; k++) {
      [['c', sets.c], ['d', sets.d]].forEach((p) => {
        const q = k - p[1];
        if (q <= 0) return;
        const lam = r.path / q;
        if (lam >= 380 && lam <= 780) (p[0] === 'c' ? c : d).push(lam);
      });
    }
    return { c: c.sort((a, b) => b - a), d: d.sort((a, b) => b - a) };
  }

  function figFilm(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 282 : 306);
    const x0 = 14, x1 = 346, yt = 112;
    const tp = Math.max(40, Math.min(66, 28 + 16 * (r.t > 0 ? Math.min(3.5, 2 * r.n1 * r.t / r.lam) : 1.5)));
    const yb = yt + tp;
    const yEnd = prob ? 258 : 238;
    d.rect(x0, yt, x1 - x0, tp, { cls: 'fg', fill: 'f3', w: 1.2 });
    d.rect(x0, yb, x1 - x0, yEnd - yb, { cls: 'fg', fill: 'f1', w: 1.2 });
    d.text(x0 + 6, 28, '媒質 0（屈折率 n₀ = ' + pl(r.n0) + '）', { cls: 'dim', size: 12, anchor: 'start' });
    d.text(x0 + 6, yt + tp / 2 + 4, '薄膜（屈折率 n₁ = ' + pl(r.n1) + '）', { cls: 'fg', size: 12, anchor: 'start' });
    d.text(x0 + 6, yb + 22, '媒質 2（屈折率 n₂ = ' + pl(r.n2) + '）', { cls: 'dim', size: 12, anchor: 'start' });
    // 光線（見やすいように、実際より斜めに描く）
    const sa = Math.min(0.5, 0.65 * r.n1 / r.n0);
    const al = Math.asin(sa), be = Math.asin(sa * r.n0 / r.n1), ga = Math.asin(Math.min(0.95, sa * r.n0 / r.n2));
    const Ax = 140, Ay = yt, Bx = Ax + tp * Math.tan(be), By = yb, Cx = Ax + 2 * tp * Math.tan(be), Cy = yt;
    const len = 66;
    d.arrow(Ax - len * Math.sin(al), Ay - len * Math.cos(al), Ax, Ay, { cls: 'c1', w: 2 });
    d.arrow(Ax, Ay, Ax + len * Math.sin(al), Ay - len * Math.cos(al), { cls: 'c1', w: 1.8 });
    d.line(Ax, Ay, Bx, By, { cls: 'c2', w: 1.6 });
    d.line(Bx, By, Cx, Cy, { cls: 'c2', w: 1.6 });
    d.arrow(Cx, Cy, Cx + len * Math.sin(al), Cy - len * Math.cos(al), { cls: 'c2', w: 1.8 });
    d.line(Bx, By, Bx + 0.8 * tp * Math.tan(ga), By + 0.8 * tp, { cls: 'dim', dash: true, w: 1 });
    d.text(Ax + len * Math.sin(al) - 6, Ay - len * Math.cos(al) - 2, '反射光 1', { cls: 'c1', size: 11, anchor: 'end' });
    d.text(Cx + len * Math.sin(al) + 6, Cy - len * Math.cos(al) - 2, '反射光 2', { cls: 'c2', size: 11, anchor: 'start' });
    d.dot(Ax, Ay, { cls: 'c1', r: 3 }); d.dot(Bx, By, { cls: 'c2', r: 3 }); d.dot(Cx, Cy, { cls: 'c2', r: 3 });
    d.text(Ax - 8, Ay + 16, 'A', { size: 11, anchor: 'end' });
    d.text(Bx + 8, By + 16, 'B', { size: 11, anchor: 'start' });
    d.text(Cx + 8, Cy + 16, 'C', { size: 11, anchor: 'start' });
    d.text(346, prob ? 274 : 298, '※ 図は見やすいように斜めに描いています（実際は垂直入射）', { cls: 'dim', size: 10, anchor: 'end' });
    // 膜厚 t
    d.arrow(x1 - 30, yt, x1 - 30, yb, { cls: 'c4', w: 1.3 });
    d.arrow(x1 - 30, yb, x1 - 30, yt, { cls: 'c4', w: 1.3 });
    d.text(x1 - 36, (yt + yb) / 2 + 4, prob && !(r.t > 0) ? 't' : 't = ' + pl(r.t) + ' nm', { cls: 'c4', size: 11, anchor: 'end' });
    if (!prob) {
      d.text(180, 258, '上面（A）での反射: 位相が π ずれ' + (r.f1 ? 'る' : 'ない') + '　下面（B）での反射: ' + (r.f2 ? 'ずれる' : 'ずれない'), { size: 11.5 });
      d.text(180, 278, '光路差 2n₁t = ' + pl(r.path) + ' nm（λ = ' + pl(r.lam) + ' nm の ' + pl(r.q) + ' 倍）', { cls: 'dim', size: 11.5 });
    }
    return d.svg();
  }

  function filmSteps(r) {
    const steps = [];
    const rel = (a, b, nA, nB) => (a < b ? R`$n_{` + nA + R`} < n_{` + nB + R`}$（屈折率が小さい側から大きい側へ向かって反射するので、**位相が $\pi$ ずれる**）` : R`$n_{` + nA + R`} > n_{` + nB + R`}$（屈折率が大きい側から小さい側へ向かって反射するので、**位相はずれない**）`);
    steps.push({
      t: '薄膜の干渉の考え方',
      n: R`薄膜に光を垂直に当てると、**膜の上面で反射する光 1** と、膜の中に入って**下面で反射し、膜の中を往復してもどってくる光 2** が重なって、干渉します。この 2 つの光の強め合い・弱め合いは、① 反射のときの**位相のずれ**と、② 膜の中を往復する分の**光路差** $2n_{1}t$、の 2 つで決まります。`,
      easy: R`シャボン玉や、水面に浮いた油の膜が、虹色に見えるのは、薄膜の干渉のためです。膜の上の面で反射した光と、膜を通り抜けて下の面で反射してきた光が重なり合って、強め合ったり弱め合ったりするのです。どちらの色が強まるかは、膜の厚さと光の波長の関係で決まります。判断のポイントは、「反射するときの位相のずれがあるか」と「膜の中を往復する道のりの差」の 2 つです。`,
      pro: R`薄膜の干渉は「位相のずれの回数（偶奇）」と「光路差 $2n_{1}t$ は $\lambda$ の何倍か」の 2 点セット。`
    });
    steps.push({
      t: '反射のときの位相のずれ（屈折率で判断）',
      m: [R`\text{上面（媒質 0 → 薄膜）: } n_{0} = ` + nf(r.n0) + (r.f1 ? ' < ' : ' > ') + 'n_{1} = ' + nf(r.n1) + R`\ \Rightarrow\ ` + (r.f1 ? R`\text{位相が } \pi \text{ ずれる}` : R`\text{位相はずれない}`),
        R`\text{下面（薄膜 → 媒質 2）: } n_{1} = ` + nf(r.n1) + (r.f2 ? ' < ' : ' > ') + 'n_{2} = ' + nf(r.n2) + R`\ \Rightarrow\ ` + (r.f2 ? R`\text{位相が } \pi \text{ ずれる}` : R`\text{位相はずれない}`)],
      n: R`光が屈折率の**小さい**媒質から**大きい**媒質に向かって反射するとき（固定端反射）、反射光の位相が $\pi$（半波長ぶん）ずれます。逆に、大きい媒質から小さい媒質に向かって反射するとき（自由端反射）は、位相はずれません。光 1（上面）は ` + rel(r.n0, r.n1, '0', '1') + R`。光 2（下面）は ` + rel(r.n1, r.n2, '1', '2') + R`。位相がずれる反射は、**全部で ` + r.flips + R` 回**（` + (r.odd ? R`奇数回` : R`偶数回`) + R`）です。`,
      easy: R`光が物質の境目で反射するとき、「反射の仕方」によって、波が裏返ることがあります。たとえるなら、ロープの端が壁に固定されているとき、はね返る波は裏返ります（山が谷になる）。一方、端が自由なとき、波は裏返りません。光の場合は、「屈折率が小さい物質から、屈折率が大きい（光が遅くなる）物質に入ろうとして反射する」ときが、固定端と同じで、位相が $\pi$ ずれます（裏返ります）。反対に、「屈折率が大きい方から小さい方へ」向かう反射では、ずれません。上面と下面で、それぞれ屈折率の大小を比べてみましょう。`,
      pro: R`反射での位相: 小 → 大（屈折率）で $\pi$ ずれる。ずれる回数が偶数なら、位相のずれは打ち消し合って「ずれなし」と同じ。`
    });
    steps.push({
      t: '光路差',
      m: [R`\Delta = 2n_{1}t = 2 \times ` + nf(r.n1) + R` \times ` + nf(r.t) + eqTail(r.path) + NM,
        R`\frac{\Delta}{\lambda} = \frac{` + SV(r.path, dig([r.path], (p) => p / r.lam)) + '}{' + nf(r.lam) + '}' + tailOf(r.q, [r.path])],
      n: R`光 2 は、膜の中を往復する分（距離 $2t$）だけ、光 1 より長く進みます。屈折率 $n_{1}$ の膜の中では波長が $\frac{\lambda}{n_{1}}$ に縮むので、同じ距離でも波の数が $n_{1}$ 倍に増え、**光路差**（真空中の波長 $\lambda$ にそろえた道のりの差）は $2n_{1}t$ です。`,
      easy: R`光 2 は、膜の厚さ $t$ を行って、帰ってくるので、光 1 より $2t$ だけ余計に進みます。ところが、屈折率 $n_{1}$ の膜の中では、光の波長が短くなる（$\frac{1}{n_{1}}$ 倍）ので、同じ距離でも波の数が多くなります。この影響をまとめて、「真空中の波長 $\lambda$ にそろえた道のりの差」を求めると、$2n_{1}t$ です（これを光路差といいます）。この値が、波長 $\lambda$ の何倍かを見ると、干渉の様子が決まります。`
    });
    steps.push({
      t: '強め合い・弱め合いの条件',
      m: r.odd
        ? [R`\text{位相のずれが奇数回: } \begin{cases} \text{強め合い: } 2n_{1}t = \left(m - \frac{1}{2}\right)\lambda \\ \text{弱め合い: } 2n_{1}t = m\lambda \end{cases}\quad (m = 1, 2, \cdots)`]
        : [R`\text{位相のずれが偶数回: } \begin{cases} \text{強め合い: } 2n_{1}t = m\lambda \\ \text{弱め合い: } 2n_{1}t = \left(m - \frac{1}{2}\right)\lambda \end{cases}\quad (m = 1, 2, \cdots)`],
      n: r.odd
        ? R`位相のずれが**奇数回**なので、光 1 と光 2 の間には、半波長ぶんの「ずれ」が余分にあります。このため、光路差が**半波長の奇数倍**のとき強め合い、**波長の整数倍**のとき弱め合います（ずれがないときと、条件が入れかわります）。`
        : R`位相のずれが**偶数回**（0 回または 2 回）なので、位相のずれは打ち消し合います。このため、光路差が**波長の整数倍**のとき強め合い、**半波長の奇数倍**のとき弱め合います（ふつうの干渉と同じ条件です）。`,
      easy: r.odd
        ? R`反射で波が裏返るのが 1 回だけだと、2 つの光は、道のりが同じでも、すでに「山と谷」の関係になっています。そこに道のりの差が加わるので、道のりの差が半波長ぶん（$\frac{\lambda}{2}$, $\frac{3\lambda}{2}$, $\cdots$）あると、谷と谷が重なって、逆に強め合います。道のりの差が波長の整数倍（$\lambda$, $2\lambda$, $\cdots$）なら、山と谷のままなので弱め合います。`
        : R`反射で波が裏返る回数が 0 回か 2 回のとき（偶数回）は、2 つの光の間に、位相のずれは残りません。そこで、道のりの差が波長の整数倍なら山と山が重なって強め合い、半波長の奇数倍なら山と谷が重なって弱め合います。`,
      pro: r.odd ? R`位相のずれ 奇数回（シャボン膜・油膜など）: 強め合い $2nt = (m - \frac{1}{2})\lambda$。最小の厚さ $\frac{\lambda}{4n}$。` : R`位相のずれ 偶数回（反射防止膜など）: 弱め合い $2nt = (m - \frac{1}{2})\lambda$。最小の厚さ $t = \frac{\lambda}{4n}$（無反射コート）。`
    });
    const verdict = r.kind === 'c' ? R`**強め合い**（反射光が明るい）` : (r.kind === 'd' ? R`**弱め合い**（反射光が暗い）` : (r.kind === 'cc' ? R`ほぼ強め合い（反射光はかなり明るい）` : (r.kind === 'dd' ? R`ほぼ弱め合い（反射光はかなり暗い）` : R`強め合いと弱め合いの中間（反射光は中くらいの明るさ）`)));
    steps.push({
      t: 'この条件での判定',
      m: [R`\frac{2n_{1}t}{\lambda} = ` + sig(r.q) + R`\quad \to\quad ` + (r.odd ? R`\text{奇数回の位相のずれ: 半整数 } (m - \tfrac{1}{2}) \text{ なら強め合い}` : R`\text{偶数回の位相のずれ: 整数 } m \text{ なら強め合い}`)],
      n: R`光路差は波長の $` + sig(r.q) + R`$ 倍です。位相のずれが` + (r.odd ? R`奇数回` : R`偶数回`) + R`なので、判定は` + verdict + R`です。`,
      easy: R`求めた「光路差が波長の何倍か」を、上の条件と見比べます。` + (r.odd ? R`位相のずれが奇数回なので、$0.5$, $1.5$, $2.5$, $\cdots$（半整数）倍なら強め合い、$1$, $2$, $\cdots$（整数）倍なら弱め合いです。` : R`位相のずれが偶数回なので、$1$, $2$, $\cdots$（整数）倍なら強め合い、$0.5$, $1.5$, $\cdots$（半整数）倍なら弱め合いです。`) + R`どちらにも当てはまらない値のときは、強め合いと弱め合いの中間の明るさになります。`,
      lv: 2
    });
    const vis = visibleList(r);
    steps.push({
      t: '強め合う（弱め合う）最小の膜厚',
      m: [R`t_{\text{強}} = ` + (r.odd ? R`\frac{\lambda}{4n_{1}}` : R`\frac{\lambda}{2n_{1}}`) + R` = \frac{` + nf(r.lam) + '}{' + (r.odd ? '4' : '2') + R` \times ` + nf(r.n1) + '}' + eqTail(r.tC) + NM,
        R`t_{\text{弱}} = ` + (r.odd ? R`\frac{\lambda}{2n_{1}}` : R`\frac{\lambda}{4n_{1}}`) + R` = \frac{` + nf(r.lam) + '}{' + (r.odd ? '2' : '4') + R` \times ` + nf(r.n1) + '}' + eqTail(r.tD) + NM],
      n: R`$t > 0$ で、条件を満たすもっとも薄い膜の厚さです（$m = 1$ を代入）。` + (r.odd ? R`位相のずれが奇数回のときは、強め合う最小の厚さが $\frac{\lambda}{4n_{1}}$、弱め合う最小の厚さが $\frac{\lambda}{2n_{1}}$ です。` : R`位相のずれが偶数回のときは、弱め合う最小の厚さが $\frac{\lambda}{4n_{1}}$（反射防止膜の厚さ）、強め合う最小の厚さが $\frac{\lambda}{2n_{1}}$ です。`),
      easy: R`いちばん薄い膜で、強め合う（弱め合う）ときの厚さを、条件の式の $m = 1$ から求めます。` + (r.odd ? R`たとえば、$2n_{1}t = \frac{\lambda}{2}$ なら $t = \frac{\lambda}{4n_{1}}$ です。` : R`たとえば、反射防止膜は、$2n_{1}t = \frac{\lambda}{2}$（弱め合い）から $t = \frac{\lambda}{4n_{1}}$ と決めます。`),
      lv: 2
    });
    steps.push({
      t: '可視光で強め合う波長・弱め合う波長',
      m: [R`\lambda = \frac{2n_{1}t}{q}\quad (q: \text{条件を満たす数})`,
        R`\text{強め合う: } ` + (vis.c.length ? vis.c.map((x) => sig(x)).join(R`,\ `) + NM : R`\text{なし}`),
        R`\text{弱め合う: } ` + (vis.d.length ? vis.d.map((x) => sig(x)).join(R`,\ `) + NM : R`\text{なし}`)],
      n: R`白色光（可視光 $380$〜$780\,\mathrm{nm}$）を当てたとき、膜の厚さ $t = ` + nf(r.t) + R`\,\mathrm{nm}$ で、反射光が強め合う波長、弱め合う波長を調べると上のようになります。弱め合って消える色の補色が、膜が色づいて見える原因です。`,
      lv: 3
    });
    return steps;
  }

  // 演習用: 膜の厚さを問うとき、条件の式（m = 1 のとき最小）から、強め合う / 弱め合う最小の膜厚を求めるステップ。
  // kind: 'c'（強め合う）| 'd'（弱め合う）。sym: 設問の記号（t、t_{1}、t_{2}）。膜の厚さ t は問題文にないので、t を既知として使わない
  function minThickStep(r, kind, label, sym) {
    const half = kind === 'c' ? r.odd : !r.odd;                  // 半整数倍（(m − 1/2)λ）の条件か
    const tmin = half ? r.lam / (4 * r.n1) : r.lam / (2 * r.n1);
    const name = kind === 'c' ? '強め合う' : '弱め合う';
    return {
      t: label + ' 反射光が' + name + R`最小の膜厚 $` + sym + R`$`,
      m: [half
        ? R`2n_{1}t = \left(m - \frac{1}{2}\right)\lambda \;\Rightarrow\; t = \left(m - \frac{1}{2}\right)\frac{\lambda}{2n_{1}}`
        : R`2n_{1}t = m\lambda \;\Rightarrow\; t = m\,\frac{\lambda}{2n_{1}}`,
      R`m = 1:\ \ ` + sym + ' = ' + (half ? R`\frac{\lambda}{4n_{1}} = \frac{` + nf(r.lam) + R`}{4 \times ` : R`\frac{\lambda}{2n_{1}} = \frac{` + nf(r.lam) + R`}{2 \times `) + nf(r.n1) + '}' + eqTail(tmin) + NM],
      n: R`反射光が` + name + R`条件は $` + (half ? R`2n_{1}t = \left(m - \frac{1}{2}\right)\lambda` : R`2n_{1}t = m\lambda`) + R`$ です。$t > 0$ をみたすいちばん小さい整数は $m = 1$` + (half ? R`（$m - \frac{1}{2} = \frac{1}{2}$）で、このとき $2n_{1}t = \frac{\lambda}{2}$ より $t = \frac{\lambda}{4n_{1}}$` : R` で、このとき $2n_{1}t = \lambda$ より $t = \frac{\lambda}{2n_{1}}$`) + R` です。膜の中の波長 $\frac{\lambda}{n_{1}}$ を使って考えると、$t$ は膜の中の波長の` + (half ? R` $\frac{1}{4}$ ` : R` $\frac{1}{2}$ `) + R`にあたります。`,
      easy: R`いちばん薄い膜は、光路差 $2n_{1}t$ がちょうど` + (half ? R`半波長（$\frac{\lambda}{2}$）` : R`1 波長（$\lambda$）`) + R`のときです。そこで $2n_{1}t = ` + (half ? R`\frac{\lambda}{2}` : R`\lambda`) + R`$ を $t$ について解くと、$t = ` + (half ? R`\frac{\lambda}{4n_{1}}` : R`\frac{\lambda}{2n_{1}}`) + R`$ になります。` + (kind === 'd' && !r.odd ? R`これが反射防止膜（無反射コート）の厚さです。` : ''),
      pro: half ? R`最小の厚さ $\frac{\lambda}{4n_{1}}$（膜の中の波長の $\frac{1}{4}$）。反射防止膜はこの厚さにする。` : R`最小の厚さ $\frac{\lambda}{2n_{1}}$（膜の中の波長の $\frac{1}{2}$）。`
    };
  }

  // 演習用: 白色光（可視光 380〜780 nm）を当てたとき、強め合う / 弱め合う波長を、条件の式に m = 1, 2, ... を入れて探すステップ。
  // 光路差 Δ = 2n₁t（r.path）は問題文の n₁・t から求めた値。可視光の波長 λ は問題文にないので、λ を既知として使わない
  function visStep(r, kind, label) {
    const half = kind === 'c' ? r.odd : !r.odd;                  // 半整数倍の条件か
    const name = kind === 'c' ? '強め合う' : '弱め合う';
    const lines = [half
      ? R`2n_{1}t = \left(m - \frac{1}{2}\right)\lambda \;\Rightarrow\; \lambda = \frac{2n_{1}t}{m - \frac{1}{2}}`
      : R`2n_{1}t = m\lambda \;\Rightarrow\; \lambda = \frac{2n_{1}t}{m}`];
    const found = [];
    for (let m = 1; m <= 40; m++) {
      const q = half ? m - 0.5 : m;
      const lam = r.path / q;
      const inside = lam >= 380 && lam <= 780;
      if (inside) found.push(lam);
      lines.push(R`m = ` + m + R`:\ \ \lambda = \frac{` + SD(r.path, 6) + '}{' + q + '}' + eqTail(lam) + R`\,\mathrm{nm}\quad (\text{` + (inside ? '可視光の範囲内' : '範囲外') + R`})`);
      if (lam < 380) break;
    }
    lines.push(R`\Rightarrow\ \lambda = ` + found.map((x) => sig(x)).join(R`,\ `) + NM);
    return {
      t: label + ' 可視光で反射光が' + name + '波長',
      m: lines,
      n: R`光路差は $2n_{1}t = ` + SD(r.path, 6) + R`\,\mathrm{nm}$ で、位相のずれが` + (r.odd ? '奇数回' : '偶数回') + R`なので、反射光が` + name + R`条件は $` + (half ? R`2n_{1}t = \left(m - \frac{1}{2}\right)\lambda` : R`2n_{1}t = m\lambda`) + R`$ です。$m = 1, 2, 3, \cdots$ を順に入れて $\lambda$ を求め、可視光の範囲（$380$〜$780\,\mathrm{nm}$）に入るものを探します。範囲に入るのは $\lambda = ` + found.map((x) => sig(x)).join(R`,\ `) + R`\,\mathrm{nm}$ です。`,
      easy: R`光路差 $2n_{1}t$ は、膜の厚さと屈折率で決まる決まった値です。強め合う（弱め合う）ための波長 $\lambda$ は、条件の式を $\lambda$ について解いて、$m = 1, 2, 3, \cdots$ を入れるととびとびに出てきます。そのうち、人の目に見える範囲（約 $380$〜$780\,\mathrm{nm}$）に入るものだけを選びます。`
    };
  }

  JK.registerSim({
    id: 'wave-thin-film',
    field: '波動',
    unit: 'p-interf',
    title: '薄膜の干渉（反射での位相のずれ）',
    desc: R`屈折率 $n_{0}$ の媒質中の、屈折率 $n_{1}$・厚さ $t$ の薄膜（下は屈折率 $n_{2}$ の媒質）に、波長 $\lambda$ の光を垂直に当てたときの反射光の干渉です。上面・下面での反射のときの位相のずれを屈折率の大小から判断し、光路差 $2n_{1}t$ から、強め合うか弱め合うかを調べます。`,
    form: [R`\Delta = 2n_{1}t`, R`\text{反射で屈折率 小 → 大 のとき位相が } \pi \text{ ずれる}`, R`\text{ずれ 偶数回: } 2n_{1}t = m\lambda \text{ で強め合い}`, R`\text{ずれ 奇数回: } 2n_{1}t = \left(m - \frac{1}{2}\right)\lambda \text{ で強め合い}`],
    inputs: [
      { key: 'n0', label: '膜の上の媒質の屈折率 n₀', type: 'num', def: '1.00', min: 1, max: 4, hint: '空気なら 1.00' },
      { key: 'n1', label: '薄膜の屈折率 n₁', type: 'num', def: '1.38', min: 1, max: 4 },
      { key: 'n2', label: '膜の下の媒質の屈折率 n₂', type: 'num', def: '1.50', min: 1, max: 4 },
      { key: 't', label: '膜の厚さ t', unit: 'nm', type: 'num', def: '99.6', min: 1, max: 100000 },
      { key: 'lam', label: '光の波長（真空中）λ', unit: 'nm', type: 'num', def: '550', min: 100, max: 3000 }
    ],
    examples: [
      { label: '反射防止膜（弱め合い）', v: { n0: '1.00', n1: '1.38', n2: '1.50', t: '99.6', lam: '550' } },
      { label: 'シャボン膜（空気中）', v: { n0: '1.00', n1: '1.33', n2: '1.00', t: '250', lam: '532' } },
      { label: 'ガラス間の空気層', v: { n0: '1.50', n1: '1.00', n2: '1.50', t: '275', lam: '550' } },
      { label: '水面の油膜', v: { n0: '1.00', n1: '1.40', n2: '1.33', t: '200', lam: '560' } }
    ],
    intro: {
      easy: R`シャボン玉や水面の油膜が虹色に光って見えるのは、**薄膜の干渉**のためです。膜の上面で反射した光と、膜の中に入って下面で反射して戻ってきた光が重なって、強め合ったり弱め合ったりします。考えることは 2 つあります。①反射のときに**波が裏返る（位相が $\pi$ ずれる）かどうか** — 屈折率が小さい物質から大きい物質に向かって反射するときだけ、裏返ります。②膜の中を往復する分の**光路差** $2n_{1}t$ が、波長の何倍か。この 2 つを組み合わせて、強め合いか弱め合いかを判断します。`,
      normal: R`位相のずれ: 屈折率 小 → 大 の反射で $\pi$。位相のずれが偶数回なら、強め合い $2n_{1}t = m\lambda$、弱め合い $2n_{1}t = (m - \frac{1}{2})\lambda$。奇数回なら条件が逆。`,
      pro: R`反射防止膜: $n_{0} < n_{1} < n_{2}$ で位相のずれ 2 回（偶数）→ $2n_{1}t = \frac{\lambda}{2}$ で弱め合い、最小の膜厚 $\frac{\lambda}{4n_{1}}$。シャボン膜・油膜（上下とも同じ側が大きい）は、ずれ 1 回（奇数）。ガラス間の空気層（くさび形）も奇数回。`
    },
    compute(v) {
      if (Math.abs(v.n0 - v.n1) < 1e-9) throw new JK.CalcError('n₀ と n₁ が等しいと、上面で反射が起こりません。屈折率を変えてください。');
      if (Math.abs(v.n1 - v.n2) < 1e-9) throw new JK.CalcError('n₁ と n₂ が等しいと、下面で反射が起こりません。屈折率を変えてください。');
      const r = solveFilm(v.n0, v.n1, v.n2, v.t, v.lam);
      const vis = visibleList(r);
      const verdict = r.kind === 'c' ? R`\text{強め合い}` : (r.kind === 'd' ? R`\text{弱め合い}` : (r.kind === 'cc' ? R`\text{ほぼ強め合い}` : (r.kind === 'dd' ? R`\text{ほぼ弱め合い}` : R`\text{中間}`)));
      return {
        result: [
          { label: '上面（媒質 0 → 薄膜）での反射の位相のずれ', tex: r.f1 ? R`\text{あり（}\pi\text{）}` : R`\text{なし}` },
          { label: '下面（薄膜 → 媒質 2）での反射の位相のずれ', tex: r.f2 ? R`\text{あり（}\pi\text{）}` : R`\text{なし}` },
          { label: '光路差 2n₁t', tex: sig(r.path) + NM },
          { label: '光路差は波長の何倍か', tex: sig(r.q) },
          { label: '反射光の判定', tex: verdict },
          { label: '強め合う最小の膜厚', tex: sig(r.tC) + NM },
          { label: '弱め合う最小の膜厚', tex: sig(r.tD) + NM },
          { label: '可視光で強め合う波長（nm）', tex: vis.c.length ? vis.c.map((x) => sig(x)).join(R`,\ `) : R`\text{なし}` },
          { label: '可視光で弱め合う波長（nm）', tex: vis.d.length ? vis.d.map((x) => sig(x)).join(R`,\ `) : R`\text{なし}` }
        ],
        steps: filmSteps(r),
        fig: figFilm(r)
      };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      // 波長の候補: 400〜700 nm の 10 nm 刻みと、よく使われる光源の波長（Nd:YAG 532、水銀 546、ナトリウム 589、He-Ne 633、水素 656）
      const lams = [532, 546, 589, 633, 656];
      for (let l = 400; l <= 700; l += 10) lams.push(l);
      if (level === 'basic') {
        // 屈折率 n₁（空気 < 膜 < ガラス）と波長 λ の組のうち、最小の厚さ t = λ/(4n₁) が小数 1 桁までで書けるものだけを候補にする。
        // n₁ は、きりのよい波長で割り切れる組が 5 通り以上ある 4 つ（候補の少ない n₁ を混ぜると、同じ答えの組ばかり出るため）
        const cands = [];
        [1.20, 1.25, 1.40, 1.50].forEach((n1) => lams.forEach((lam) => {
          if (nice(lam / (4 * n1), 1) && stable3(lam / (4 * n1)) && stable3(lam / (2 * n1))) cands.push([n1, lam]);
        }));
        const p = pickBy(rng, cands, (c) => c[0]);
        const n2 = rng.pick([1.50, 1.60, 1.70].filter((x) => x > p[0]));
        const r = solveFilm(1.00, p[0], n2, p[1] / (4 * p[0]), p[1]);
        const rg = solveFilm(1.00, p[0], n2, 0, p[1]);
        // 設問の順（(1) 膜の中の波長 → (2) 弱め合う最小の厚さ）に合わせる。膜の厚さ t は問題文にない（(2) で求める量）ので、
        // t を使う光路差・判定のステップは入れず、位相のずれ → 条件の式 → 最小の厚さ（m = 1）の順にする
        const g = filmSteps(r);
        const sol = [g[0], {
          t: R`(1) 薄膜の中での光の波長 $\lambda'$`,
          m: [R`\lambda' = \frac{\lambda}{n_{1}} = \frac{` + nf(p[1]) + '}{' + nf(p[0]) + '}' + eqTail(p[1] / p[0]) + NM],
          n: R`光は屈折率 $n_{1}$ の物質の中では、速さも波長も $\frac{1}{n_{1}}$ 倍になります（振動数は変わりません）。空気中の波長が $\lambda = ` + p[1].toFixed(0) + R`\,\mathrm{nm}$ なので、薄膜の中での波長は $\lambda' = \frac{\lambda}{n_{1}}$ です。`,
          easy: R`物質の中に入ると光は遅くなり、波の山と山の間隔（波長）も $\frac{1}{n_{1}}$ 倍に縮みます。膜の中を何波長ぶん往復するかを考えるときは、この縮んだ波長 $\lambda'$ を使います。`
        }, g[1], g[3], minThickStep(r, 'd', '(2)', 't')];
        return {
          title: '反射防止膜の最小の厚さ',
          body: R`屈折率 $` + n2.toFixed(2) + R`$ のガラスの表面に、屈折率 $` + p[0].toFixed(2) + R`$ の透明な薄膜をつけて、空気中から波長 $` + p[1].toFixed(0) + R`\,\mathrm{nm}$ の光を垂直に当てたとき、反射光ができるだけ弱くなる（無反射にする）ようにしたい。空気の屈折率は $1.00$ とする。次の問いに答えよ。`,
          fig: figFilm(Object.assign({}, rg, { t: 0 }), { problem: true }),
          parts: [
            { label: '(1)', q: R`薄膜の中での、この光の波長 $\lambda'$`, type: 'num', answer: P3(p[1] / p[0]), rel: tol.rel, unit: 'nm' },
            { label: '(2)', q: R`反射光が弱め合うための、薄膜の最小の厚さ $t$`, type: 'num', answer: P3(r.tD), rel: tol.rel, unit: 'nm' }
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        // 空気中のシャボン膜（下の媒質 n₂ = 1.00）と、水面の油膜（n₂ = 1.33、油の n₁ > 1.33）。
        // 最小の厚さ λ/(4n₁) が小数 1 桁までで書ける (n₁, λ) だけを候補にする（n₁ は基礎と同じく、割り切れる波長が 5 通り以上ある値）
        const cands = [];
        [[1.00, [1.20, 1.25, 1.40, 1.50]], [1.33, [1.40, 1.50]]].forEach((g) => g[1].forEach((n1) => lams.forEach((lam) => {
          if (nice(lam / (4 * n1), 1) && stable3(lam / (4 * n1)) && stable3(lam / (2 * n1))) cands.push([1.00, n1, g[0], lam]);
        })));
        const p = pickBy(rng, cands, (c) => c[1] + '/' + c[2]);
        const r = solveFilm(p[0], p[1], p[2], p[3] / (4 * p[1]), p[3]); const chOrd = rng.shuffle([0, 1, 2, 3]);   // (1) の選択肢の並び（正解がいつも先頭にならないように）
        const what = p[2] === 1.00 ? R`空気中にある透明な薄膜（屈折率 $` + p[1].toFixed(2) + R`$）` : R`水（屈折率 $` + p[2].toFixed(2) + R`$）の表面に広がった、屈折率 $` + p[1].toFixed(2) + R`$ の油の膜`;
        return {
          title: '薄膜・油膜の反射光',
          body: what + R`に、上から波長 $` + p[3].toFixed(0) + R`\,\mathrm{nm}$ の単色光を垂直に当て、反射光を観察する。膜の上は空気（屈折率 $1.00$）である。次の問いに答えよ。`,
          fig: figFilm(Object.assign({}, r, { t: 0 }), { problem: true }),
          parts: [
            { label: '(1)', q: R`位相が $\pi$ ずれて反射するのは、どの面か`, type: 'choice', choices: chOrd.map((k) => ['上面（空気と膜の境界）だけ', '下面（膜と下の媒質の境界）だけ', '上面と下面の両方', 'どちらの面でもずれない'][k]), answer: chOrd.indexOf(r.f1 && !r.f2 ? 0 : (!r.f1 && r.f2 ? 1 : (r.f1 && r.f2 ? 2 : 3))) },
            { label: '(2)', q: R`反射光が強め合う、膜の最小の厚さ $t_{1}$（$t > 0$）`, type: 'num', answer: P3(r.tC), rel: tol.rel, unit: 'nm' },
            { label: '(3)', q: R`反射光が弱め合う、膜の最小の厚さ $t_{2}$（$t > 0$）`, type: 'num', answer: P3(r.tD), rel: tol.rel, unit: 'nm' }
          ],
          // 設問の順（(1) 位相のずれる面 → (2) 強め合う最小の厚さ → (3) 弱め合う最小の厚さ）に合わせる。膜の厚さ t は問題文にない
          // （(2)(3) で求める量）ので、t を使う光路差・判定のステップは入れない
          solution: (() => {
            const g = filmSteps(r);
            return [g[0], Object.assign({}, g[1], { t: '(1) ' + g[1].t }), g[3], minThickStep(r, 'c', '(2)', 't_{1}'), minThickStep(r, 'd', '(3)', 't_{2}')];
          })()
        };
      }
      // adv: 可視光のうち強め合う（弱め合う）波長がそれぞれ 1 つになる膜厚
      let n1, t, r, vis;
      const tries = [];
      const ts = [];                                                  // 膜厚の候補: 100〜600 nm の 5 nm 刻み（条件を満たす (n₁, t) だけが残る）
      for (let tt = 100; tt <= 600; tt += 5) ts.push(tt);
      [1.33, 1.40, 1.50].forEach((nn) => ts.forEach((tt) => {
        const rr = solveFilm(1.00, nn, 1.00, tt, 550);
        const v = visibleList(rr);
        const margin = (arr) => arr.every((x) => x > 395 && x < 765);
        if (v.c.length === 1 && v.d.length === 1 && margin(v.c) && margin(v.d) && nice(v.c[0], 0) && nice(v.d[0], 0)) tries.push([nn, tt]);
      }));
      const pick = tries.length ? rng.pick(tries) : [1.33, 250];
      n1 = pick[0]; t = pick[1];
      r = solveFilm(1.00, n1, 1.00, t, 550);
      vis = visibleList(r);
      return {
        title: '空気中の薄膜に白色光を当てたときの反射光',
        body: R`空気中に、厚さ $` + t.toFixed(0) + R`\,\mathrm{nm}$、屈折率 $` + n1.toFixed(2) + R`$ の透明な薄膜がある。この膜に白色光（可視光の波長は $380$〜$780\,\mathrm{nm}$）を垂直に当てて、反射光を観察した。空気の屈折率は $1.00$ とする。次の問いに答えよ。`,
        fig: figFilm(Object.assign({}, r, { lam: 550 }), { problem: true }),
        parts: [
          { label: '(1)', q: R`上面と下面での反射光の光路差 $2n_{1}t$`, type: 'num', answer: P3(r.path), rel: tol.rel, unit: 'nm' },
          { label: '(2)', q: R`可視光のうち、反射光が最も強め合う（明るく見える）光の波長`, type: 'num', answer: P3(vis.c[0]), rel: tol.rel, unit: 'nm' },
          { label: '(3)', q: R`可視光のうち、反射光が弱め合って見えなくなる光の波長`, type: 'num', answer: P3(vis.d[0]), rel: tol.rel, unit: 'nm' }
        ],
        // 設問の順（(1) 光路差 → (2) 強め合う波長 → (3) 弱め合う波長）に合わせる。波長 λ は問題文にない（(2)(3) で求める量）ので、
        // λ を使う「光路差は波長の何倍か」「判定」のステップは入れず、条件の式に m = 1, 2, … を入れて可視光の範囲の波長を探す
        solution: (() => {
          const g = filmSteps(r);
          return [g[0], g[1], { t: R`(1) 光路差 $2n_{1}t$`, m: [g[2].m[0]], n: g[2].n, easy: g[2].easy }, g[3], visStep(r, 'c', '(2)'), visStep(r, 'd', '(3)')];
        })()
      };
    }
  });
})();
