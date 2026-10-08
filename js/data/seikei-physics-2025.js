/* GOKAKU NAVI — 成蹊大学 理工学部 物理 2025 年度 準拠の類題
   大問構成・出題分野・形式（マーク式の選択・数値）・難易度・誘導の流れだけを過去問に合わせ、
   装置・状況・数値・問題文・図・解説はすべて書き下ろしたもの（過去問の文面・数値・図は含まない）。
   第1問（小問集合）は小問ごとに別カード（id 末尾 -1〜-5）、第2〜4問は大問ごとに 1 カード。 */
(function () {
  'use strict';
  const R = String.raw;
  const PI = Math.PI;
  const G = JK.plot.graph;
  const D = function (w, h) { return JK.plot.draw(w, h); };
  const src = function (no) {
    return { univ: '成蹊大学', faculty: '理工学部', year: 2025, no: no, kind: '類題' };
  };
  // 矢印 + 手動配置のラベル（ラベルが矢印に重ならないよう位置を明示する）
  function arr(d, x1, y1, x2, y2, label, cls, lx, ly, anchor) {
    d.arrow(x1, y1, x2, y2, { cls: cls });
    if (label) d.text(lx, ly, label, { cls: cls, anchor: anchor || 'start', italic: true });
  }

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // 1-1: 鉛直に立てた筒の中のばねと小球（はじめの位置・ばねから離れる位置・最高点）
  function figSpringLaunch() {
    const d = D(360, 250);
    const x0 = 130, yf = 232, r = 12;
    const yc = 178, yn = 150, yt = 56;        // ばねの上端（押し縮めた状態・自然の長さ）、最高点での球の中心
    d.hatch(70, yf, 190, yf);
    d.line(x0 - 26, 126, x0 - 26, yf, { cls: 'fg', w: 2 });
    d.line(x0 + 26, 126, x0 + 26, yf, { cls: 'fg', w: 2 });
    d.spring(x0, yf, x0, yc, { n: 5, amp: 10 });
    d.circle(x0, yc - r, r, { cls: 'fg', fill: 'f1' });
    d.text(x0, yc - r + 4, 'm', { italic: true });
    d.circle(x0, yn - r, r, { cls: 'dim', dash: true, w: 1.2 });
    d.circle(x0, yt, r, { cls: 'dim', dash: true, w: 1.2 });
    // 寸法（d: はじめの位置 → ばねから離れる位置、H: そこから最高点まで）
    const xd = 204, y1 = yc - r, y2 = yn - r;
    d.line(x0 + 14, y1, xd + 6, y1, { cls: 'dim', dash: true, w: 1 });
    d.line(x0 + 14, y2, xd + 6, y2, { cls: 'dim', dash: true, w: 1 });
    d.line(x0 + 14, yt, xd + 6, yt, { cls: 'dim', dash: true, w: 1 });
    d.line(xd, yt, xd, y1, { cls: 'c3', w: 1.4 });
    d.line(xd - 5, y1, xd + 5, y1, { cls: 'c3', w: 1.4 });
    d.line(xd - 5, y2, xd + 5, y2, { cls: 'c3', w: 1.4 });
    d.line(xd - 5, yt, xd + 5, yt, { cls: 'c3', w: 1.4 });
    d.text(xd + 10, (y1 + y2) / 2 + 4, 'd', { cls: 'c3', italic: true, anchor: 'start' });
    d.text(xd + 10, (y2 + yt) / 2 + 4, 'H', { cls: 'c3', italic: true, anchor: 'start' });
    d.text(232, yt + 4, '最高点', { anchor: 'start', size: 12 });
    d.text(232, y2 - 2, 'ばねから離れる位置', { anchor: 'start', size: 11 });
    d.text(232, y2 + 12, '（ばねは自然の長さ）', { anchor: 'start', size: 11, cls: 'dim' });
    d.text(232, y1 + 6, 'はじめの位置', { anchor: 'start', size: 11 });
    d.text(232, y1 + 20, '（ばねは d 縮む）', { anchor: 'start', size: 11, cls: 'dim' });
    d.text(22, 206, 'ばね定数 k', { anchor: 'start', size: 12 });
    return d.svg();
  }

  // 1-2 解説: ブレーキをかけてからの v-t グラフ（三角形の面積 = 止まるまでに進んだ距離）
  function figBrakeVT() {
    const v = function (t) { return 30 - 6 * t; };
    return G({
      w: 340, h: 220, x: [0, 6], y: [0, 36], axis: ['t [s]', 'v [m/s]'],
      curves: [{ f: v, cls: 'c1', domain: [0, 5] }],
      fills: [{ f: v, from: 0, to: 5, cls: 'f1' }],
      vlines: [{ x: 5, dash: true }],
      points: [
        { x: 0, y: 30, label: 'v₀ = 30', pos: 'tr', cls: 'c3' },
        { x: 2.5, y: 15, label: '2.5 s で 15', pos: 'tr', cls: 'c4' },
        { x: 5, y: 0, label: '停止', pos: 'tl', cls: 'c4' }
      ],
      labels: [{ x: 0.8, y: 6, text: '面積 = 制動距離 x', cls: 'c1' }]
    });
  }

  // 1-3 解説: 残存量の曲線と、1/16・5 %・4 %・1/32 の位置
  function figDecay() {
    const f = function (t) { return Math.pow(0.5, t / 6); };
    return G({
      w: 340, h: 230, x: [18, 34], y: [0, 0.1], axis: ['t [時間]', 'N / N₀'],
      curves: [{ f: f, cls: 'c1' }],
      vlines: [
        { x: 24, label: '24 h' }, { x: 26, label: '26 h', cls: 'c3' },
        { x: 28, label: '28 h', cls: 'c3' }, { x: 30, label: '30 h' }
      ],
      hlines: [
        { y: 1 / 16, label: '1/16' }, { y: 0.05, label: '5 %', cls: 'c3' },
        { y: 0.04, label: '4 %', cls: 'c3' }, { y: 1 / 32, label: '1/32' }
      ],
      points: [
        { x: 24, y: 1 / 16, cls: 'c4' }, { x: 26, y: 0.05, cls: 'c3' },
        { x: 28, y: 0.04, cls: 'c3' }, { x: 30, y: 1 / 32, cls: 'c4' }
      ]
    });
  }

  // 1-4: 円筒を水平に置いたとき (a) と、鉛直に立てたとき (b)
  function figCylinders() {
    const d = D(360, 246);
    // (a) 水平
    d.poly([[20, 62], [100, 62], [100, 106], [20, 106]], { cls: 'dim', fill: 'f1', w: 0.8 });
    d.line(20, 62, 172, 62, { cls: 'fg', w: 2 });
    d.line(20, 62, 20, 106, { cls: 'fg', w: 2 });
    d.hatch(10, 106, 182, 106);
    d.rect(98, 62, 8, 44, { cls: 'fg', fill: 'f2' });
    d.text(102, 52, 'M', { italic: true, size: 13 });
    d.text(58, 88, 'p₀', { italic: true, size: 13 });
    arr(d, 160, 84, 112, 84, 'p₀', 'c3', 164, 88);
    d.line(20, 122, 102, 122, { cls: 'c3', w: 1.4 });
    d.line(20, 117, 20, 127, { cls: 'c3', w: 1.4 });
    d.line(102, 117, 102, 127, { cls: 'c3', w: 1.4 });
    d.text(61, 142, 'ℓ₀', { cls: 'c3', italic: true, size: 13 });
    // (b) 鉛直（閉じた端を下）
    d.poly([[250, 132], [294, 132], [294, 196], [250, 196]], { cls: 'dim', fill: 'f1', w: 0.8 });
    d.line(250, 44, 250, 196, { cls: 'fg', w: 2 });
    d.line(294, 44, 294, 196, { cls: 'fg', w: 2 });
    d.hatch(232, 196, 312, 196);
    d.rect(250, 124, 44, 8, { cls: 'fg', fill: 'f2' });
    d.text(242, 134, 'M', { italic: true, size: 13, anchor: 'end' });
    d.arrow(262, 82, 262, 120, { cls: 'c3' });
    d.arrow(282, 82, 282, 120, { cls: 'c3' });
    d.text(272, 72, 'p₀', { cls: 'c3', italic: true, size: 13 });
    d.text(272, 168, 'p', { italic: true, size: 13 });
    d.line(318, 132, 318, 196, { cls: 'c3', w: 1.4 });
    d.line(313, 132, 323, 132, { cls: 'c3', w: 1.4 });
    d.line(313, 196, 323, 196, { cls: 'c3', w: 1.4 });
    d.text(332, 168, 'ℓ', { cls: 'c3', italic: true, size: 13, anchor: 'start' });
    d.text(96, 232, '(a) 水平に置く', { size: 12 });
    d.text(272, 232, '(b) 鉛直に立てる', { size: 12 });
    return d.svg();
  }

  // 関数グラフ（JK.plot.graph の SVG）を、自由図形の SVG の中の (x, y) に埋め込む
  function embed(d, graphSvg, x, y) {
    const inner = graphSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    d.group('<g transform="translate(' + x + ' ' + y + ')">' + inner + '</g>');
  }

  // 1-5: 磁束密度 B(t)（0.10 T → 0.50 T と増加 → 一定 → 0 まで減少 → 0）
  function Bfield(t) { return t <= 2 ? 0.1 + 0.2 * t : t <= 4 ? 0.5 : t <= 5 ? 0.5 - 0.5 * (t - 4) : 0; }
  // 1-5 の選択肢用: 電流 I(t)（時計回りを正、単位 mA）の候補
  const I_A = function (t) { return t < 2 ? -100 : t < 4 ? 0 : t < 5 ? 250 : 0; };   // 正解
  const I_B = function (t) { return -I_A(t); };                                       // 符号が逆
  const I_C = function (t) { return Math.abs(I_A(t)); };                              // 向きを無視
  const I_D = function (t) { return -250 * Bfield(t) / 0.5; };                        // B の形そのまま

  // 1-5: 正方形コイル（紙面の表から裏へ向かう磁場 ⊗）と B-t グラフ
  function figInduction() {
    const d = D(360, 192);
    d.wire([[24, 110], [24, 30], [104, 30], [104, 110]]);
    d.resistor(104, 110, 24, 110, { label: 'R', lpos: -1 });
    [[50, 54], [78, 54], [50, 86], [78, 86]].forEach(function (p) {
      d.circle(p[0], p[1], 6, { cls: 'dim', w: 1 });
      d.line(p[0] - 3.4, p[1] - 3.4, p[0] + 3.4, p[1] + 3.4, { cls: 'dim', w: 1.2 });
      d.line(p[0] - 3.4, p[1] + 3.4, p[0] + 3.4, p[1] - 3.4, { cls: 'dim', w: 1.2 });
    });
    d.arrow(118, 46, 118, 92, { cls: 'c3' });
    d.text(124, 72, 'I', { cls: 'c3', italic: true, anchor: 'start' });
    d.text(8, 156, '⊗：磁場 B の向き', { anchor: 'start', size: 11 });
    d.text(8, 170, '（紙面の表から裏へ）', { anchor: 'start', size: 11, cls: 'dim' });
    d.text(8, 184, 'I の正の向き：時計回り', { anchor: 'start', size: 11, cls: 'dim' });
    embed(d, G({
      w: 210, h: 176, x: [0, 7], y: [0, 0.6], axis: ['t [s]', 'B [T]'],
      curves: [{ f: Bfield, cls: 'c1' }],
      vlines: [{ x: 2, dash: true }, { x: 4, dash: true }, { x: 5, dash: true }]
    }), 146, 6);
    return d.svg();
  }
  // 1-5 の選択肢: I-t グラフ
  function figCurrentOpt(fn) {
    return G({
      w: 300, h: 190, x: [0, 6.4], y: [-330, 330], axis: ['t [s]', 'I [mA]'],
      curves: [{ f: fn, cls: 'c1' }]
    });
  }

  // 第2問: 加速するトラックの荷台に置かれた木箱
  function figTruck() {
    const d = D(360, 232);
    d.hatch(8, 216, 352, 216);
    d.rect(26, 172, 274, 12, { cls: 'fg', fill: 'f0' });
    d.poly([[300, 184], [300, 138], [326, 138], [346, 164], [346, 184]], { cls: 'fg', fill: 'f0' });
    d.circle(80, 200, 16, { cls: 'fg', fill: 'f0' });
    d.circle(252, 200, 16, { cls: 'fg', fill: 'f0' });
    d.dot(80, 200, { cls: 'fg', r: 2 });
    d.dot(252, 200, { cls: 'fg', r: 2 });
    d.rect(112, 64, 54, 108, { cls: 'fg', fill: 'f1' });
    d.dot(139, 118, { cls: 'c3', r: 3 });
    d.text(148, 114, 'G', { cls: 'c3', italic: true, anchor: 'start' });
    // 寸法（高さ h・幅 w）
    d.line(96, 64, 96, 172, { cls: 'dim', w: 1 });
    d.line(91, 64, 101, 64, { cls: 'dim', w: 1 });
    d.line(91, 172, 101, 172, { cls: 'dim', w: 1 });
    d.text(86, 122, 'h', { italic: true, anchor: 'end' });
    d.line(112, 50, 166, 50, { cls: 'dim', w: 1 });
    d.line(112, 45, 112, 55, { cls: 'dim', w: 1 });
    d.line(166, 45, 166, 55, { cls: 'dim', w: 1 });
    d.text(139, 40, 'w', { italic: true });
    arr(d, 196, 112, 262, 112, 'a', 'c3', 268, 116);
    d.text(229, 98, '加速度', { size: 11, cls: 'dim' });
    d.text(20, 22, '荷台と木箱の間の静止摩擦係数 μ', { anchor: 'start', size: 11, cls: 'dim' });
    return d.svg();
  }
  // 第2問 解説: トラックから見た、木箱にはたらく力（慣性力を含む）
  function figTruckForces() {
    const d = D(360, 236);
    const bx = 130, bw = 60, bt = 34, bb = 150;
    const gx = bx + bw / 2, gy = (bt + bb) / 2;
    const xN = gx - 18;
    d.hatch(70, bb, 300, bb);
    d.rect(bx, bt, bw, bb - bt, { cls: 'fg', fill: 'f1' });
    d.dot(gx, gy, { cls: 'fg', r: 3 });
    d.text(gx + 9, gy - 6, 'G', { italic: true, anchor: 'start' });
    arr(d, gx, gy, gx - 64, gy, '', 'c2');
    d.text(gx - 68, gy - 7, 'Ma（慣性力）', { cls: 'c2', anchor: 'end', size: 11 });
    arr(d, gx, gy, gx, gy + 40, 'Mg', 'c4', gx + 7, gy + 44);
    arr(d, xN, bb, xN, bb - 40, '', 'c1');
    d.text(xN, bb - 46, 'N', { cls: 'c1', italic: true });
    arr(d, gx + 18, bb - 6, gx + 56, bb - 6, '', 'c3');
    d.text(gx + 38, bb - 14, 'F', { cls: 'c3', italic: true });
    d.dot(bx, bb, { cls: 'fg', r: 2.6 });
    d.text(bx - 8, bb + 15, 'P', { italic: true, anchor: 'end' });
    // 垂直抗力の作用点のずれ x、半分の幅 w/2、重心の高さ h/2
    d.line(xN, bb + 4, xN, 178, { cls: 'dim', dash: true, w: 1 });
    d.line(gx, bb + 4, gx, 208, { cls: 'dim', dash: true, w: 1 });
    d.line(bx, bb + 4, bx, 208, { cls: 'dim', dash: true, w: 1 });
    d.line(xN, 172, gx, 172, { cls: 'c3', w: 1.4 });
    d.text((xN + gx) / 2, 190, 'x', { cls: 'c3', italic: true });
    d.line(bx, 202, gx, 202, { cls: 'c3', w: 1.4 });
    d.text((bx + gx) / 2, 220, 'w/2', { cls: 'c3', italic: true });
    d.line(gx + 6, gy, 238, gy, { cls: 'dim', dash: true, w: 1 });
    d.line(234, gy, 234, bb, { cls: 'c3', w: 1.4 });
    d.line(229, gy, 239, gy, { cls: 'c3', w: 1.4 });
    d.line(229, bb, 239, bb, { cls: 'c3', w: 1.4 });
    d.text(244, (gy + bb) / 2 + 4, 'h/2', { cls: 'c3', italic: true, anchor: 'start' });
    d.text(180, 16, 'トラックから見たようす（右向きが進行方向）', { size: 11, cls: 'dim' });
    return d.svg();
  }
  // 第2問 (5) の選択肢: 静止し続けられる (μ, a) の範囲（色つき）
  function figAmaxOpt(fn) {
    return G({
      w: 300, h: 190, x: [0, 1.1], y: [0, 1.1], axis: ['μ', 'a / g'],
      curves: [{ f: fn, cls: 'c1' }],
      fills: [{ f: fn, from: 0, to: 1.1, cls: 'f1' }],
      hlines: [{ y: 0.5, dash: true, label: '0.5' }]
    });
  }

  // 開いたスイッチ（縦向き）: 上下の接点と、斜めに浮いた刃
  function vswitch(d, x, y1, y2, label) {
    d.dot(x, y1, { cls: 'fg', r: 2.6 });
    d.dot(x, y2, { cls: 'fg', r: 2.6 });
    d.line(x, y2, x + 13, y1 + 6, { cls: 'fg', w: 1.6 });
    d.text(x + 20, (y1 + y2) / 2 + 4, label, { anchor: 'start', size: 12, italic: true });
  }

  // 第3問: 上下 2 本の導線の間に、電池 + S₁、直列の P・Q、S₂ + R、コイル + S₃ の 4 つの枝を並べた回路
  function figCircuitPQR() {
    const d = D(400, 252);
    const yT = 34, yB = 212;
    d.wire([[44, yT], [346, yT]]);
    d.wire([[44, yB], [346, yB]]);
    // 電池 + S₁（左の枝）
    d.battery(44, yT, 44, 96, { label: 'E' });
    d.text(55, 60, '+', { anchor: 'start', size: 13, bold: true });
    d.text(55, 84, '−', { anchor: 'start', size: 13, bold: true });
    d.wire([[44, 96], [44, 126]]);
    vswitch(d, 44, 126, 152, 'S₁');
    d.wire([[44, 152], [44, yB]]);
    // 直列の P・Q（点 M でつながる）
    d.capacitor(150, yT, 150, 123, { label: 'P : 4C', ldist: 36 });
    d.capacitor(150, 123, 150, yB, { label: 'Q : 12C', ldist: 38 });
    // S₂ + R
    d.wire([[250, yT], [250, 68]]);
    vswitch(d, 250, 68, 94, 'S₂');
    d.wire([[250, 94], [250, 128]]);
    d.capacitor(250, 128, 250, yB, { label: 'R : 6C', ldist: 36 });
    // コイル + S₃
    d.coil(346, yT, 346, 100, { n: 5, label: 'L', lpos: -1, ldist: 22 });
    d.wire([[346, 100], [346, 126]]);
    vswitch(d, 346, 126, 152, 'S₃');
    d.wire([[346, 152], [346, yB]]);
    [[150, yT], [250, yT], [150, yB], [250, yB], [150, 123]].forEach(function (p) { d.dot(p[0], p[1], { cls: 'fg', r: 3 }); });
    d.arrow(318, 50, 318, 90, { cls: 'c3' });
    d.text(310, 74, 'I', { cls: 'c3', italic: true, anchor: 'end' });
    d.text(160, 119, 'M', { italic: true, anchor: 'start' });
    d.text(60, 234, 'G（電位の基準 0 V）', { anchor: 'start', size: 11, cls: 'dim' });
    return d.svg();
  }
  // 第3問 (5) の選択肢と解説: コイルを流れる電流 I(t)（横軸は ωt、縦軸は I₀ を単位に）
  function figLCOpt(fn) {
    return G({
      w: 300, h: 170, x: [0, 13], y: [-1.45, 1.45], axis: ['t', 'I'], ticks: false, grid: false,
      curves: [{ f: fn, cls: 'c1' }],
      hlines: [{ y: 1, label: 'I₀' }, { y: -1, label: '−I₀' }],
      labels: [{ x: 0.15, y: -0.3, text: 'O', cls: 'dim' }]
    });
  }

  // 第4問: 水面の油膜（空気 → 油 → 水）の反射光の強度。振幅反射係数から、多重反射を含めた反射率 R(λ) を計算して描く
  const OIL = { n0: 1.00, n1: 1.50, n2: 1.33, n3: 1.60, d: 840 };   // 屈折率と油膜の厚さ [nm]（2 n₁ d = 2520 nm）
  function filmR(lam, n0, n1, n2, d) {
    const r01 = (n0 - n1) / (n0 + n1), r12 = (n1 - n2) / (n1 + n2);
    const ph = 4 * PI * n1 * d / lam;                        // 膜を往復して生じる位相差
    const c = Math.cos(ph), s = Math.sin(ph);
    const nr = r01 + r12 * c, ni = -r12 * s, dr = 1 + r01 * r12 * c, di = -r01 * r12 * s;
    return (nr * nr + ni * ni) / (dr * dr + di * di);
  }
  const R_water = function (l) { return filmR(l, OIL.n0, OIL.n1, OIL.n2, OIL.d); };
  const R_glass = function (l) { return filmR(l, OIL.n0, OIL.n1, OIL.n3, OIL.d); };
  function oilPlot(w, h, curves, vlines, labels, ymax) {
    const ticks = [400, 500, 600, 700];
    return G({
      w: w, h: h, x: [380, 700], y: [0, ymax], axis: ['', '反射光の強度'], ticks: false, grid: false,
      curves: curves, vlines: vlines,
      segs: ticks.map(function (t) { return { x1: t, y1: 0, x2: t, y2: ymax * 0.03, cls: 'dim' }; }),
      labels: ticks.map(function (t) {
        return { x: t, y: -ymax * 0.09, text: t === 700 ? '700 nm' : String(t), anchor: 'middle', cls: 'dim' };
      }).concat(labels || [])
    });
  }
  // 第4問: 水面の油膜（光 ① ② の経路）と、反射光の強度のグラフ
  function figOil() {
    const d = D(380, 430);
    d.rect(20, 82, 340, 34, { cls: 'fg', fill: 'f3', w: 1 });
    d.rect(20, 116, 340, 54, { cls: 'fg', fill: 'f1', w: 1 });
    d.hatch(20, 170, 360, 170);
    d.text(28, 26, '空気 n₀ = 1.00', { anchor: 'start', size: 11 });
    d.text(28, 103, '油 n₁ = 1.50', { anchor: 'start', size: 11 });
    d.text(28, 142, '水 n₂ = 1.33', { anchor: 'start', size: 11 });
    d.arrow(190, 6, 190, 80, { cls: 'c1' });
    d.arrow(206, 80, 206, 6, { cls: 'c3' });
    d.line(190, 80, 190, 114, { cls: 'c4', w: 2 });
    d.line(190, 114, 222, 114, { cls: 'c4', w: 2 });
    d.arrow(222, 114, 222, 6, { cls: 'c4' });
    d.text(182, 38, '入射光', { cls: 'c1', anchor: 'end', size: 11 });
    d.text(212, 34, '①', { cls: 'c3', anchor: 'start', size: 13 });
    d.text(228, 50, '②', { cls: 'c4', anchor: 'start', size: 13 });
    d.line(334, 82, 334, 116, { cls: 'c3', w: 1.4 });
    d.line(329, 82, 339, 82, { cls: 'c3', w: 1.4 });
    d.line(329, 116, 339, 116, { cls: 'c3', w: 1.4 });
    d.text(344, 104, 'd', { cls: 'c3', italic: true, anchor: 'start' });
    embed(d, oilPlot(360, 224, [{ f: R_water, cls: 'c1' }], [
      { x: 420, label: 'A', cls: 'c3' }, { x: 504, label: 'B', cls: 'c3' }, { x: 630, label: 'C', cls: 'c3' }
    ], [], 0.09), 10, 192);
    return d.svg();
  }
  // 第4問 解説: 水をガラスに取りかえると、強度の山と谷が入れかわる
  function figOilCompare() {
    return oilPlot(340, 220, [{ f: R_water, cls: 'c1' }, { f: R_glass, cls: 'c2', dash: true }], [
      { x: 504, label: '504', cls: 'c3' }, { x: 560, label: '560', cls: 'c3' }
    ], [
      { x: 567, y: 0.0765, text: '実線：水（1.33）', cls: 'c1', anchor: 'start' },
      { x: 567, y: 0.070, text: '破線：ガラス（1.60）', cls: 'c2', anchor: 'start' }
    ], 0.09);
  }

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ================= 第1問（小問集合）================= */

    /* ---------- 第1問 問1 ばねの弾性エネルギーと鉛直投げ上げ ---------- */
    {
      id: 'sk-p-2025-1-1',
      subject: 'physics',
      level: 'mid',
      unit: 'p-energy',
      title: 'ばねで鉛直に打ち上げた小球',
      source: src('第1問 問1'),
      time: 5,
      prereq: ['p-eom', 'p-fall'],
      body: R`床に鉛直に立てた、なめらかな内壁をもつ筒の底に、ばね定数 $k$ の軽いばねを固定し、その上に質量 $m$ の小球を載せた（小球はばねに固定されていない）。小球を指で押し下げて、ばねを自然の長さより $d$ だけ縮んだ状態にし、そのまま静止させたのち、そっと手を放した。小球は上向きに動き出し、ばねが自然の長さにもどった位置でばねから離れて、そのまま真上に飛び上がった。重力加速度の大きさを $g$ とし、空気の抵抗と小球の大きさは無視できるものとする。`,
      fig: figSpringLaunch(),
      parts: [
        {
          label: '(1)',
          q: R`小球がばねから離れる瞬間の速さ $v$ を表す式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\sqrt{\dfrac{k d^{2}}{m}+2gd}$`,
            R`$\sqrt{\dfrac{k d^{2}}{m}}$`,
            R`$\sqrt{\dfrac{k d^{2}}{m}-gd}$`,
            R`$\sqrt{\dfrac{k d^{2}}{2m}-2gd}$`,
            R`$\sqrt{\dfrac{k d^{2}}{m}-2gd}$`,
            R`$\sqrt{\dfrac{2k d^{2}}{m}-2gd}$`
          ],
          answer: 4,
          explain: R`はじめの位置から、ばねから離れる位置（自然の長さ）までの間、力学的エネルギーが保存します。弾性エネルギー $\dfrac{1}{2}kd^{2}$ が、重力の位置エネルギーの増加 $mgd$（小球は $d$ だけ上がる）と運動エネルギー $\dfrac{1}{2}mv^{2}$ に変わるので、$\dfrac{1}{2}kd^{2}=mgd+\dfrac{1}{2}mv^{2}$ より $v=\sqrt{\dfrac{kd^{2}}{m}-2gd}$ です。重力の位置エネルギーを忘れると $\sqrt{\dfrac{kd^{2}}{m}}$ になってしまいます。`
        },
        {
          label: '(2)',
          q: R`小球が上昇する最高点の、ばねから離れた位置（自然の長さの位置）からの高さ $H$ を表す式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{k d^{2}}{2mg}+d$`,
            R`$\dfrac{k d^{2}}{mg}-d$`,
            R`$\dfrac{k d^{2}}{2mg}$`,
            R`$\dfrac{k d^{2}}{2mg}-d$`,
            R`$\dfrac{k d^{2}}{4mg}-d$`,
            R`$\dfrac{k d^{2}-2mgd}{mg}$`
          ],
          answer: 3,
          explain: R`ばねから離れたあとは重力だけがはたらく鉛直投げ上げです。最高点で速さが $0$ なので $0-v^{2}=-2gH$、$H=\dfrac{v^{2}}{2g}=\dfrac{kd^{2}}{2mg}-d$ となります。選択肢の $\dfrac{kd^{2}}{2mg}$ は「はじめの位置から測った高さ」で、$d$ を引くのを忘れた誤りです。$\dfrac{kd^{2}-2mgd}{mg}$ は $2H$（速さの $2$ 乗の式 $v^{2}=2gH$ の係数 $2$ を落とした誤り）に当たります。`
        }
      ],
      solution: [
        {
          t: 'エネルギー保存を使う区間を決める',
          n: R`はじめの位置（ばねが $d$ 縮んでいる）から、ばねから離れる位置（自然の長さ）までの間、小球にはたらく力は重力と弾性力だけで、筒の内壁はなめらかです。したがって、**弾性エネルギー・重力の位置エネルギー・運動エネルギー**の和が保存します。`,
          easy: R`ばねを縮めると、ばねに「エネルギーの貯金」（弾性エネルギー $\dfrac{1}{2}kx^{2}$）がたまります。手を放すと、この貯金が、小球の運動エネルギーと、小球を高い所へ持ち上げる分（重力の位置エネルギー）に使われます。貯金の額は、縮めた長さ $x$ の $2$ 乗に比例します。`,
          lv: 1
        },
        {
          t: '(1) ばねから離れる瞬間の速さ',
          m: [R`\frac{1}{2}kd^{2} = mgd + \frac{1}{2}mv^{2}`,
              R`v^{2} = \frac{kd^{2}}{m} - 2gd`,
              R`v = \sqrt{\frac{kd^{2}}{m} - 2gd}`],
          n: R`重力の位置エネルギーの基準をはじめの位置にとります。はじめは速さ $0$ でばねだけにエネルギーがあり（左辺）、ばねから離れる位置では、ばねは自然の長さで弾性エネルギーが $0$、小球は $d$ だけ高いので位置エネルギーは $mgd$、さらに運動エネルギー $\dfrac{1}{2}mv^{2}$ をもちます（右辺）。`,
          pro: R`鉛直ばねでは「弾性エネルギー・重力の位置エネルギー・運動エネルギー」の 3 項を毎回書き出す。重力の項を落とした $\sqrt{kd^{2}/m}$ は定番のひっかけ。`,
          lv: 1
        },
        {
          t: '(1) の答えの確かめ（ばねから離れる条件）',
          m: R`v^{2} > 0 \;\Longleftrightarrow\; kd^{2} > 2mgd \;\Longleftrightarrow\; d > \frac{2mg}{k}`,
          n: R`根号の中が負になる場合は、小球は自然の長さの位置まで届きません。小球をそっと載せたときにばねが縮んで静止する長さは $\dfrac{mg}{k}$（つり合いの位置）なので、$d$ がその $2$ 倍より大きいときだけ、小球はばねから離れて飛び上がります。`,
          easy: R`ばねに小球をそっと載せると、ばねは $\dfrac{mg}{k}$ だけ縮んだ位置で静止します（つり合いの位置）。放した小球は、このつり合いの位置を中心にして上下に動くので、自然の長さの位置まで届くには、つり合いの位置から見て、自然の長さの位置までの距離と同じだけ以上、下へ押し込んでおく必要があります。`,
          lv: 3
        },
        {
          t: '(2) 最高点の高さ',
          m: [R`0 - v^{2} = -2gH`,
              R`H = \frac{v^{2}}{2g} = \frac{kd^{2}}{2mg} - d`],
          n: R`ばねから離れたあとは重力だけがはたらく鉛直投げ上げで、最高点では速さが $0$ です。等加速度運動の式 $v^{2}-v_{0}^{2}=2ax$ に、上向きを正として $a=-g$、$x=H$ を入れます。`,
          easy: R`ボールを真上に投げ上げたときと同じです。投げ出す速さが大きいほど高く上がり、最高点で一瞬止まります。高さは速さの $2$ 乗に比例して、$H=\dfrac{v^{2}}{2g}$ です。`,
          pro: R`時間を聞かれない鉛直投げ上げは $H=\dfrac{v^{2}}{2g}$ で一発。`,
          lv: 1
        },
        {
          t: '別解：全体のエネルギー保存で一気に求める',
          m: [R`\frac{1}{2}kd^{2} = mg\,(H + d)`,
              R`H = \frac{kd^{2}}{2mg} - d`],
          n: R`はじめの位置（速さ $0$）から最高点（速さ $0$）まで、ばねの弾性エネルギーがすべて重力の位置エネルギーに変わったと考えます。最高点ははじめの位置より $H+d$ だけ高いので、この式が成り立ちます。$\dfrac{kd^{2}}{2mg}$ は「はじめの位置から測った高さ」なので、$d$ を引いた値が、ばねから離れた位置から測った $H$ です。`,
          lv: 2
        }
      ],
      tags: ['小問集合', '選択式', 'ばね', 'エネルギー保存', '鉛直投げ上げ']
    },

    /* ---------- 第1問 問2 単位換算と等加速度運動 ---------- */
    {
      id: 'sk-p-2025-1-2',
      subject: 'physics',
      level: 'mid',
      unit: 'p-kin',
      title: '急ブレーキと制動距離',
      source: src('第1問 問2'),
      time: 4,
      prereq: ['p-math0'],
      body: R`直線の道路を、自動車が速さ $108\,\mathrm{km/h}$ で走っている。運転手がブレーキをかけると、自動車は一定の加速度で減速し、ブレーキをかけてから $5.0$ 秒後に停止した。次の問いに答えよ。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`ブレーキをかけている間の加速度の大きさ $a$ は何 $\mathrm{m/s^{2}}$ か。`,
          type: 'num',
          answer: 6.0,
          rel: 0.02,
          unit: 'm/s²',
          explain: R`まず速さを m/s に直します。$108\,\mathrm{km/h}=\dfrac{108\times 1000}{3600}=30\,\mathrm{m/s}$。$5.0$ 秒で $30\,\mathrm{m/s}$ から $0$ まで減ったので、加速度の大きさは $a=\dfrac{30-0}{5.0}=6.0\,\mathrm{m/s^{2}}$ です。km/h のまま $\dfrac{108}{5.0}=21.6$ としても、単位が $\mathrm{m/s^{2}}$ になりません。`
        },
        {
          label: '(2)',
          q: R`ブレーキをかけてから停止するまでに、自動車が進んだ距離 $x$ は何 $\mathrm{m}$ か。`,
          type: 'num',
          answer: 75,
          rel: 0.02,
          unit: 'm',
          explain: R`等加速度運動では、平均の速さに時間をかけると距離になります。はじめの速さ $30\,\mathrm{m/s}$ と終わりの速さ $0$ の平均は $15\,\mathrm{m/s}$ なので、$x=\dfrac{30+0}{2}\times 5.0=75\,\mathrm{m}$ です。$30\times 5.0=150\,\mathrm{m}$ とするのは、速さが減らずに走り続けたと考えた誤りです。`
        },
        {
          label: '(3)',
          q: R`ブレーキをかけてから $2.5$ 秒後の自動車の速さは何 $\mathrm{km/h}$ か。`,
          type: 'num',
          answer: 54,
          rel: 0.02,
          unit: 'km/h',
          explain: R`速さは一定のペースで減るので、$2.5$ 秒後（ちょうど半分の時間）の速さは $v=30-6.0\times 2.5=15\,\mathrm{m/s}$ です。これを km/h に直すには $3.6$ をかけて、$15\times 3.6=54\,\mathrm{km/h}$ です。答えは km/h で聞かれているので、$15$ のままにしないように注意します。`
        }
      ],
      solution: [
        {
          t: '速さを m/s に直す',
          m: R`108\,\mathrm{km/h} = \frac{108\times 1000\,\mathrm{m}}{3600\,\mathrm{s}} = 30\,\mathrm{m/s}`,
          n: R`加速度の単位 $\mathrm{m/s^{2}}$ と合わせるため、速さは $\mathrm{m/s}$ に直してから計算します。$1\,\mathrm{km}=1000\,\mathrm{m}$、$1\,\mathrm{h}=3600\,\mathrm{s}$ です。`,
          easy: R`「時速 $108\,\mathrm{km}$」は「$1$ 時間に $108\,\mathrm{km}$ 進む速さ」です。$1$ 時間は $3600$ 秒、$108\,\mathrm{km}$ は $108000\,\mathrm{m}$ なので、$1$ 秒あたり $108000\div 3600=30\,\mathrm{m}$ 進む速さです。`,
          pro: R`$\mathrm{km/h}\to\mathrm{m/s}$ は $3.6$ で割る（逆は $3.6$ をかける）。$108\to 30$ と暗算する。`,
          lv: 1
        },
        {
          t: '(1) 加速度の大きさ',
          m: R`a = \frac{v - v_{0}}{t} = \frac{0 - 30}{5.0} = -6.0\,\mathrm{m/s^{2}}`,
          n: R`進行方向を正にとると、速さが減っているので加速度は負（$-6.0\,\mathrm{m/s^{2}}$）です。問われているのは「大きさ」なので、答えは $6.0\,\mathrm{m/s^{2}}$ です。`,
          easy: R`加速度は「$1$ 秒あたりに速さがどれだけ変わるか」を表します。$5.0$ 秒で $30\,\mathrm{m/s}$ だけ減ったので、$1$ 秒あたり $6.0\,\mathrm{m/s}$ ずつ減っています。速さが減るときの加速度は、向きが進行方向と逆なので、負の値になります。`,
          lv: 1
        },
        {
          t: '(2) 止まるまでに進んだ距離（制動距離）',
          m: [R`x = \frac{v_{0} + v}{2}\,t = \frac{30 + 0}{2}\times 5.0 = 75\,\mathrm{m}`,
              R`x = v_{0}t + \frac{1}{2}at^{2} = 30\times 5.0 + \frac{1}{2}\times(-6.0)\times 5.0^{2} = 75\,\mathrm{m}`],
          n: R`等加速度運動では「平均の速さ × 時間」が距離になります。$v$-$t$ グラフでは、図の三角形の面積に当たります。2 つ目の式（公式 $x=v_{0}t+\dfrac{1}{2}at^{2}$）でも同じ値になります。`,
          fig: figBrakeVT(),
          easy: R`速さが一定のペースで変わるときは、はじめと終わりの速さの平均で、ずっと走っていたことにして距離を計算できます。平均の速さは $15\,\mathrm{m/s}$ なので、$15\times 5.0=75\,\mathrm{m}$ です。グラフでは、底辺 $5.0$、高さ $30$ の三角形の面積です。`,
          pro: R`時間を使わずに距離を出す式 $v^{2}-v_{0}^{2}=2ax$ で検算できる。$0^{2}-30^{2}=2\times(-6.0)\times x$ より $x=75\,\mathrm{m}$。同じブレーキなら、制動距離は $v_{0}^{2}$ に比例する（速さが $2$ 倍なら距離は $4$ 倍）。`,
          lv: 1
        },
        {
          t: R`(3) $2.5$ 秒後の速さを km/h で答える`,
          m: [R`v = v_{0} + at = 30 + (-6.0)\times 2.5 = 15\,\mathrm{m/s}`,
              R`15\,\mathrm{m/s} = 15\times 3.6\,\mathrm{km/h} = 54\,\mathrm{km/h}`],
          n: R`$v$-$t$ グラフは直線なので、ちょうど半分の時間（$2.5$ 秒後）の速さは、はじめの速さ $30\,\mathrm{m/s}$ と $0$ の真ん中の $15\,\mathrm{m/s}$ です。問いが km/h なので、最後に $\mathrm{m/s}\to\mathrm{km/h}$ に直します。`,
          easy: R`$1\,\mathrm{m/s}$ は「$1$ 秒に $1\,\mathrm{m}$」、つまり「$1$ 時間（$3600$ 秒）に $3600\,\mathrm{m}=3.6\,\mathrm{km}$」進む速さです。だから $\mathrm{m/s}$ の数字に $3.6$ をかけると $\mathrm{km/h}$ になります。`,
          lv: 1
        },
        {
          t: 'よくある誤りの確認',
          n: R`km/h のまま計算して $a=\dfrac{108}{5.0}=21.6$ としたり、$x=30\times 5.0=150\,\mathrm{m}$ のように、減速していることを忘れたりしないように注意します。また、最後の答えの単位が $\mathrm{m/s}$ か $\mathrm{km/h}$ かを、問いに戻って確かめましょう。`,
          lv: 2
        }
      ],
      tags: ['小問集合', '単位換算', '等加速度運動', 'v-tグラフ', '制動距離']
    },

    /* ---------- 第1問 問3 半減期と対数 ---------- */
    {
      id: 'sk-p-2025-1-3',
      subject: 'physics',
      level: 'mid',
      unit: 'p-atom',
      title: '半減期と対数の利用',
      source: src('第1問 問3'),
      time: 4,
      prereq: ['p-math0'],
      body: R`医療の画像診断に使われる放射性同位体のテクネチウム 99m は、放射線を出して別の原子核に変わっていくため、体内にある量が減っていく。その半減期は $6.0$ 時間である。必要なら $\log_{10}2=0.30$ を用いて、次の問いに答えよ。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`はじめにあった量の $\dfrac{1}{20}$ まで減るのは、何時間後か。`,
          type: 'num',
          answer: 26,
          rel: 0.02,
          unit: '時間',
          explain: R`$t$ 時間後に残る割合は $\left(\dfrac{1}{2}\right)^{t/6.0}$ です。これが $\dfrac{1}{20}$ に等しいとおいて両辺の常用対数をとると、$\dfrac{t}{6.0}\log_{10}2=\log_{10}20=1+\log_{10}2$ となり、$t=6.0\times\dfrac{1+0.30}{0.30}=26$ 時間です。見当として、半減期 $4$ 回分（$24$ 時間）で $\dfrac{1}{16}$、$5$ 回分（$30$ 時間）で $\dfrac{1}{32}$ なので、$\dfrac{1}{20}$ は $24$〜$30$ 時間の間にあるはずです。`
        },
        {
          label: '(2)',
          q: R`はじめにあった量の $4.0$ % まで減るのは、何時間後か。`,
          type: 'num',
          answer: 28,
          rel: 0.02,
          unit: '時間',
          explain: R`$4.0$ % は $\dfrac{1}{25}$ です。$\log_{10}25=\log_{10}\dfrac{100}{4}=2-2\times 0.30=1.40$ なので、$t=6.0\times\dfrac{1.40}{0.30}=28$ 時間です。$\dfrac{1}{16}=6.25$ % と $\dfrac{1}{32}\approx 3.1$ % の間にあるので、$24$〜$30$ 時間の間という見当とも合います。`
        }
      ],
      solution: [
        {
          t: '半減期と、残る割合の関係',
          m: R`\frac{N}{N_{0}} = \left(\frac{1}{2}\right)^{t/T}`,
          n: R`半減期 $T$ ごとに量が半分になるので、経過時間 $t$ のあいだに「半分にする」回数は $\dfrac{t}{T}$ 回分です。$\dfrac{t}{T}$ が整数でなくても、この式が成り立ちます。ここでは $T=6.0$ 時間です。`,
          easy: R`半減期が $6$ 時間なら、$6$ 時間後に $\dfrac{1}{2}$、$12$ 時間後に $\dfrac{1}{4}$、$18$ 時間後に $\dfrac{1}{8}$、…と、$6$ 時間たつごとに半分になっていきます。経過時間が半減期の何倍か（$\dfrac{t}{T}$）を、$\dfrac{1}{2}$ の指数に入れたのがこの式です。`,
          lv: 1
        },
        {
          t: '「$2^{x}=20$」を解く道具：対数',
          m: R`2^{x} = 20 \;\Longrightarrow\; x\log_{10}2 = \log_{10}20 \;\Longrightarrow\; x = \frac{\log_{10}20}{\log_{10}2}`,
          n: R`$2$ を何回かけると $20$ になるか、が知りたい場面です。$2^{4}=16$、$2^{5}=32$ なので答えは $4$ と $5$ の間で、整数にはなりません。こういうときは両辺の常用対数（底が $10$ の対数）をとり、$\log_{10}a^{x}=x\log_{10}a$ を使って指数 $x$ を前に出します。`,
          easy: R`対数は「指数を取り出す道具」です。$\log_{10}2=0.30$ は「$10$ を $0.30$ 乗すると $2$ くらいになる」という意味で、これを使うと、$2$ や $20$ を $10$ の累乗の形に直して指数どうしを比べることができます。`,
          lv: 3
        },
        {
          t: R`(1) $\dfrac{1}{20}$ まで減る時間`,
          m: [R`\left(\frac{1}{2}\right)^{t/T} = \frac{1}{20} \;\Longrightarrow\; 2^{t/T} = 20`,
              R`\frac{t}{T} = \frac{\log_{10}20}{\log_{10}2} = \frac{1 + 0.30}{0.30} = \frac{13}{3}`,
              R`t = 6.0\times\frac{13}{3} = 26\ \text{時間}`],
          n: R`$\log_{10}20=\log_{10}(2\times 10)=\log_{10}2+1$ と分けるのがコツです。`,
          pro: R`$20=2\times 10$、$25=100\div 4$ のように、$2$ と $10$ だけの積・商に直して $\log_{10}2$ に帰着させる。$\log_{10}2$ の値が与えられていなくても、$2^{10}=1024\approx 10^{3}$ から $\log_{10}2\approx 0.30$ と覚えておくと便利。`,
          lv: 1
        },
        {
          t: '(2) $4.0$ % まで減る時間',
          m: [R`\left(\frac{1}{2}\right)^{t/T} = \frac{4.0}{100} = \frac{1}{25} \;\Longrightarrow\; 2^{t/T} = 25`,
              R`\frac{t}{T} = \frac{\log_{10}25}{\log_{10}2} = \frac{2 - 2\times 0.30}{0.30} = \frac{1.40}{0.30} = \frac{14}{3}`,
              R`t = 6.0\times\frac{14}{3} = 28\ \text{時間}`],
          n: R`$\log_{10}25=\log_{10}\dfrac{100}{4}=\log_{10}100-\log_{10}2^{2}=2-2\log_{10}2$ と変形します。`,
          lv: 1
        },
        {
          t: '見当をつけて検算する',
          n: R`$24$ 時間後は $\left(\dfrac{1}{2}\right)^{4}=\dfrac{1}{16}=6.25$ %、$30$ 時間後は $\left(\dfrac{1}{2}\right)^{5}=\dfrac{1}{32}\approx 3.1$ % です。$\dfrac{1}{20}=5$ % も $4$ % もこの間にあるので、答えは $24$〜$30$ 時間の間のはずです。$26$ 時間、$28$ 時間はこの範囲に入っています。図で、減少の曲線が $5$ % と $4$ % の線と交わる位置を確かめましょう。`,
          fig: figDecay(),
          lv: 2
        }
      ],
      tags: ['小問集合', '半減期', '放射性崩壊', '対数', '指数計算']
    },

    /* ---------- 第1問 問4 円筒を立てたときの気体（等温変化） ---------- */
    {
      id: 'sk-p-2025-1-4',
      subject: 'physics',
      level: 'mid',
      unit: 'p-gas',
      title: '円筒を立てたときの気体の状態',
      source: src('第1問 問4'),
      time: 5,
      prereq: ['p-math0', 'p-force0'],
      body: R`一端が閉じた円筒形の容器（断面積 $S$）に、一定量の理想気体を入れ、質量 $M$ のなめらかに動くピストンでふたをして、図 (a) のように水平な台の上に横にして置く。ピストンは静止していて、気体のしめる部分の長さは $\ell_{0}$ である。この容器を、気体がもれないようにゆっくり回して、図 (b) のように閉じた端を下にして立てたところ、ピストンは少し下がって静止し、気体の柱の長さは $\ell$ になった。容器は熱をよく通し、まわりの温度は変わらないので、気体の温度は一定とみなしてよい。大気圧を $p_{0}$、重力加速度の大きさを $g$ とする。ピストンの厚さと、ピストンと容器の間の摩擦は無視する。`,
      fig: figCylinders(),
      parts: [
        {
          label: '(1)',
          q: R`図 (b) の状態の、気体の圧力 $p$ を表す式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$p_{0}-\dfrac{Mg}{S}$`,
            R`$p_{0}$`,
            R`$p_{0}+\dfrac{Mg}{S}$`,
            R`$p_{0}+MgS$`,
            R`$\dfrac{Mg}{S}$`,
            R`$p_{0}+\dfrac{2Mg}{S}$`
          ],
          answer: 2,
          explain: R`図 (b) のピストンにはたらく力は、下向きが重力 $Mg$ と大気が押す力 $p_{0}S$、上向きが気体が押す力 $pS$ で、静止しているのでつり合います。$pS=p_{0}S+Mg$ より $p=p_{0}+\dfrac{Mg}{S}$ です。$MgS$ のように、圧力（力 ÷ 面積）の次元にならない式は選べません。`
        },
        {
          label: '(2)',
          q: R`図 (b) の気体の柱の長さ $\ell$ を表す式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{p_{0}S+Mg}{p_{0}S}\,\ell_{0}$`,
            R`$\dfrac{p_{0}S}{p_{0}S+Mg}\,\ell_{0}$`,
            R`$\dfrac{p_{0}S-Mg}{p_{0}S}\,\ell_{0}$`,
            R`$\dfrac{p_{0}}{p_{0}+Mg}\,\ell_{0}$`,
            R`$\dfrac{p_{0}S}{p_{0}S-Mg}\,\ell_{0}$`,
            R`$\ell_{0}$`
          ],
          answer: 1,
          explain: R`温度が一定なので、ボイルの法則 $p_{0}\cdot S\ell_{0}=p\cdot S\ell$ が成り立ちます。$\ell=\dfrac{p_{0}}{p}\,\ell_{0}=\dfrac{p_{0}S}{p_{0}S+Mg}\,\ell_{0}$。圧力が大きくなるので体積は小さくなり、$\ell<\ell_{0}$ のはずです（$\ell_{0}$ より大きくなる式や、$\ell_{0}$ のままの式は誤り）。$\dfrac{p_{0}}{p_{0}+Mg}$ のように $S$ がない式は、$p_{0}$（圧力）と $Mg$（力）の次元が合いません。`
        },
        {
          label: '(3)',
          q: R`$S=2.0\times10^{-3}\,\mathrm{m^{2}}$、$M=5.0\,\mathrm{kg}$、$p_{0}=1.0\times10^{5}\,\mathrm{Pa}$、$\ell_{0}=0.30\,\mathrm{m}$、$g=9.8\,\mathrm{m/s^{2}}$ のとき、気体の柱の長さ $\ell$ は何 $\mathrm{m}$ か。`,
          type: 'num',
          answer: 0.241,
          rel: 0.02,
          unit: 'm',
          explain: R`$p=p_{0}+\dfrac{Mg}{S}=1.0\times10^{5}+\dfrac{5.0\times 9.8}{2.0\times10^{-3}}=1.245\times10^{5}\,\mathrm{Pa}$。$\ell=\dfrac{p_{0}}{p}\,\ell_{0}=\dfrac{1.0\times10^{5}}{1.245\times10^{5}}\times 0.30\approx 0.241\,\mathrm{m}$ です。圧力が約 $1.2$ 倍になり、柱の長さは約 $0.8$ 倍に縮みます。`
        }
      ],
      solution: [
        {
          t: '水平に置いたときの状態をおさえる',
          n: R`図 (a) では、ピストンは水平方向に動くだけです。ピストンの重さ $Mg$ は容器の壁が支えるので、水平方向の力は「気体が押す力」と「大気が押す力」だけで、両者がつり合います。よって気体の圧力は $p_{0}$、体積は $S\ell_{0}$ です。`,
          easy: R`横に寝かせた容器では、ピストンの重さは下の壁が受け止めてくれます。だからピストンには、気体が内側から押す力と、大気が外側から押す力だけを考えればよく、この 2 つは等しくなります。力は「圧力 × 面積」なので、気体の圧力は大気圧 $p_{0}$ と同じです。`,
          lv: 1
        },
        {
          t: '(1) 立てた状態でのピストンの力のつり合い',
          m: [R`pS = p_{0}S + Mg`,
              R`p = p_{0} + \frac{Mg}{S}`],
          n: R`ピストン（質量 $M$）にはたらく力は、下向きに重力 $Mg$ と大気が押す力 $p_{0}S$、上向きに気体が押す力 $pS$ です。静止しているので、上向きの力と下向きの力がつり合います。`,
          easy: R`ピストンの上には大気がのっていて、そのうえピストン自身の重さもあります。この「上から下へ押す力」の合計を、下の気体が押し返してつり合っています。気体の圧力 $p$ は、大気圧 $p_{0}$ よりもピストンの重さの分だけ大きくなるのです。`,
          pro: R`ピストンのつり合いは「(内側の圧力)×$S$ ＝ (外側の圧力)×$S$ ＋ 重さ」。力の向きを図に書き込んでから式にする。文字式の選択問題は、立式のあとに「次元」と「極限（$M\to 0$ など）」の 2 つを確かめれば、半分以上の選択肢を消せる。`,
          lv: 1
        },
        {
          t: '(2) ボイルの法則',
          m: [R`p_{0}\,(S\ell_{0}) = p\,(S\ell)`,
              R`\ell = \frac{p_{0}}{p}\,\ell_{0} = \frac{p_{0}S}{p_{0}S + Mg}\,\ell_{0}`],
          n: R`容器は熱をよく通し、ゆっくり変化するので、気体の温度は変わりません（等温変化）。温度が一定の一定量の気体では、圧力と体積の積が一定になります（ボイルの法則）。体積は断面積 $S$ × 柱の長さなので、$S$ は約分されます。`,
          easy: R`同じ温度のまま気体を押し縮めると、圧力は大きくなります。たとえば圧力が $2$ 倍になれば体積は $\dfrac{1}{2}$ 倍です。（圧力）×（体積）が変わらない、というのがボイルの法則です。`,
          lv: 1
        },
        {
          t: '(3) 数値を代入する',
          m: [R`p = 1.0\times 10^{5} + \frac{5.0\times 9.8}{2.0\times 10^{-3}} = 1.245\times 10^{5}\,\mathrm{Pa}`,
              R`\ell = \frac{1.0\times 10^{5}}{1.245\times 10^{5}}\times 0.30 \approx 0.241\,\mathrm{m}`],
          n: R`ピストンの重さによる圧力 $\dfrac{Mg}{S}=2.45\times10^{4}\,\mathrm{Pa}$ は、大気圧の約 $\dfrac{1}{4}$ です。気体の圧力は約 $1.25$ 倍になり、柱の長さは $0.30\,\mathrm{m}$ の $0.80$ 倍ほど（$0.24\,\mathrm{m}$）になります。`,
          lv: 1
        },
        {
          t: '選択肢の確かめ（次元と極限）',
          n: R`圧力どうし（$p_{0}$ と $\dfrac{Mg}{S}$）しか足し引きできません。また、$M=0$ ならピストンは気体を押し縮めないので、$p=p_{0}$、$\ell=\ell_{0}$ になるはずです。ピストンの重さで気体は押し縮められるので $p>p_{0}$、$\ell<\ell_{0}$ のはずで、$p_{0}-\dfrac{Mg}{S}$ や $\ell_{0}$ より大きくなる式は、この点から除けます。`,
          lv: 2
        }
      ],
      tags: ['小問集合', '選択式', 'ボイルの法則', '力のつり合い', 'ピストン', '等温変化']
    },

    /* ---------- 第1問 問5 電磁誘導（コイルを貫く磁場の変化） ---------- */
    {
      id: 'sk-p-2025-1-5',
      subject: 'physics',
      level: 'mid',
      unit: 'p-induction',
      title: 'コイルを貫く磁場の変化と誘導電流',
      source: src('第1問 問5'),
      time: 6,
      body: R`一辺 $0.20\,\mathrm{m}$ の正方形に導線を $50$ 回巻いたコイルの両端を、抵抗値 $4.0\,\Omega$ の抵抗 $\mathrm{R}$ につなぎ、図のように紙面上に置く。このコイルの面全体に垂直に、紙面の表から裏へ向かう一様な磁場をかけ、その磁束密度 $B$ の大きさを、時刻 $t$ の関数として図の右のグラフのように変化させる。回路を流れる電流 $I$ は、図の矢印の向き（時計回り）を正とする。導線の抵抗とコイルの自己インダクタンスは無視する。`,
      fig: figInduction(),
      parts: [
        {
          label: '(1)',
          q: R`$t=1.0\,\mathrm{s}$ に、抵抗を流れる電流の大きさは何 $\mathrm{mA}$ か。`,
          type: 'num',
          answer: 100,
          rel: 0.02,
          unit: 'mA',
          explain: R`$0\sim 2.0\,\mathrm{s}$ では $B$ が $0.10\,\mathrm{T}$ から $0.50\,\mathrm{T}$ まで一定の割合で増えるので、$\dfrac{\Delta B}{\Delta t}=\dfrac{0.40}{2.0}=0.20\,\mathrm{T/s}$。コイルの面積は $S=0.20^{2}=0.040\,\mathrm{m^{2}}$ なので、起電力の大きさは $V=NS\dfrac{\Delta B}{\Delta t}=50\times 0.040\times 0.20=0.40\,\mathrm{V}$、電流は $I=\dfrac{V}{R}=\dfrac{0.40}{4.0}=0.10\,\mathrm{A}=100\,\mathrm{mA}$ です。巻数 $N=50$ をかけ忘れると $2.0\,\mathrm{mA}$ になってしまいます。`
        },
        {
          label: '(2)',
          q: R`$t=1.0\,\mathrm{s}$ に、コイルに流れる電流の向きとして正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`時計回り（図の矢印の向き）`,
            R`反時計回り（図の矢印と逆向き）`,
            R`時計回りと反時計回りを交互にくり返す`,
            R`電流は流れない`
          ],
          answer: 1,
          explain: R`紙面の表から裏へ向かう磁束が増えています。レンツの法則により、コイルは「その増加をさまたげる向き」の磁場、つまり裏から表へ向かう磁場を内側につくるように電流を流します。右ねじの法則から、裏から表へ向かう磁場をつくる電流は反時計回りです。図の矢印は時計回りなので、$I$ は負の値になります。`
        },
        {
          label: '(3)',
          q: R`電流 $I$ の時間変化（$0\le t\le 6.0\,\mathrm{s}$）を表すグラフとして最も適切なものを選べ。`,
          type: 'choice',
          choices: [
            { fig: figCurrentOpt(I_C) },
            { fig: figCurrentOpt(I_B) },
            { fig: figCurrentOpt(I_A) },
            { fig: figCurrentOpt(I_D) }
          ],
          answer: 2,
          explain: R`$0\sim 2.0\,\mathrm{s}$（$B$ が増加）は $I=-100\,\mathrm{mA}$、$2.0\sim 4.0\,\mathrm{s}$（$B$ が一定）は $I=0$、$4.0\sim 5.0\,\mathrm{s}$（$B$ が $0.50\,\mathrm{T}$ から $0$ へ減少、$\dfrac{\Delta B}{\Delta t}=-0.50\,\mathrm{T/s}$）は、大きさが $2.5$ 倍で向きが逆の $I=+250\,\mathrm{mA}$、$5.0\,\mathrm{s}$ 以降は $B=0$ で一定なので $I=0$ です。電流は $B$ の大きさではなく、$B$ の変化の割合（グラフの傾き）で決まります。向きを無視した図（すべて $0$ 以上）、符号が逆の図、$B$ の形をそのまま写した図は誤りです。`
        }
      ],
      solution: [
        {
          t: '電磁誘導の法則（ファラデーの法則）',
          m: R`V = N\left|\frac{\Delta\Phi}{\Delta t}\right| = NS\left|\frac{\Delta B}{\Delta t}\right|\qquad(\Phi = BS)`,
          n: R`コイルを貫く磁束 $\Phi=BS$（$S$ はコイルの面積）が変化すると、その変化の割合に比例した起電力が生じ、$N$ 巻きなら $N$ 倍になります。ここでは面積 $S$ が一定なので、起電力は $B$-$t$ グラフの**傾き**に比例します。`,
          easy: R`コイルに磁石を近づけたり遠ざけたりしているときだけ、電流が流れます。磁石をコイルのそばにじっと置いておくだけでは流れません。つまり大切なのは、磁場の「強さ」ではなく、磁場が「どれだけ速く変化するか」です。この問題では、$B$-$t$ グラフの傾きが、その「変化の速さ」を表します。`,
          lv: 1
        },
        {
          t: R`(1) $t=1.0\,\mathrm{s}$ の電流の大きさ`,
          m: [R`\frac{\Delta B}{\Delta t} = \frac{0.50 - 0.10}{2.0} = 0.20\,\mathrm{T/s}`,
              R`V = NS\left|\frac{\Delta B}{\Delta t}\right| = 50\times 0.20^{2}\times 0.20 = 0.40\,\mathrm{V}`,
              R`I = \frac{V}{R} = \frac{0.40}{4.0} = 0.10\,\mathrm{A} = 100\,\mathrm{mA}`],
          n: R`$0\sim 2.0\,\mathrm{s}$ では $B$ が一定の割合で増えるので、傾きは一定で、電流も一定です。コイルの面積は $S=0.20^{2}=0.040\,\mathrm{m^{2}}$ です。起電力を求めてから、オームの法則で電流を求めます。`,
          pro: R`巻数 $N$ のかけ忘れに注意（$N=50$ を落とすと $2.0\,\mathrm{mA}$）。「起電力 → オームの法則」の 2 段階で求める。`,
          lv: 1
        },
        {
          t: R`(2) 電流の向き（レンツの法則）`,
          n: R`紙面の表から裏へ向かう磁束が増えています。レンツの法則により、コイルは「その増加をさまたげる向き」の磁場、つまり裏から表へ向かう磁場を内側につくるように電流を流します。右ねじの法則で、裏から表へ向かう磁場をつくる電流は**反時計回り**です。反時計回りは図の矢印と逆向きなので、$I$ は負の値になります。`,
          easy: R`レンツの法則は「変化をさまたげる」法則です。奥向きの磁場が増えるときは、「増えるな」と、手前向きの磁場をつくる向きに電流が流れます。手前向きの磁場は、反時計回りの電流でできます（右手の親指を手前に向けてコイルを包むように握ると、4 本の指の向きが反時計回りになります）。`,
          lv: 1
        },
        {
          t: '(3) 区間ごとに傾きを求めて、電流のグラフを決める',
          m: [R`0\sim 2.0\,\mathrm{s}:\quad \frac{\Delta B}{\Delta t} = +0.20 \;\Rightarrow\; I = -100\,\mathrm{mA}`,
              R`2.0\sim 4.0\,\mathrm{s}:\quad \frac{\Delta B}{\Delta t} = 0 \;\Rightarrow\; I = 0`,
              R`4.0\sim 5.0\,\mathrm{s}:\quad \frac{\Delta B}{\Delta t} = -0.50 \;\Rightarrow\; I = +250\,\mathrm{mA}`,
              R`5.0\sim 6.0\,\mathrm{s}:\quad \frac{\Delta B}{\Delta t} = 0 \;\Rightarrow\; I = 0`],
          n: R`$4.0\sim 5.0\,\mathrm{s}$ は $B$ が $0.50\,\mathrm{T}$ から $0$ まで $1.0\,\mathrm{s}$ で減るので、傾きは $-0.50\,\mathrm{T/s}$ で、大きさは最初の区間の $2.5$ 倍です。$B$ が減るときは逆向き（時計回り）の電流が流れるので $I>0$、大きさは $\dfrac{50\times 0.040\times 0.50}{4.0}=0.25\,\mathrm{A}=250\,\mathrm{mA}$ です。`,
          fig: figCurrentOpt(I_A),
          pro: R`$I$ は $B$ の値ではなく**傾き**に比例し、この向きの取り方では傾きと電流の符号が逆になる。$B$ が一定の区間は $I=0$。`,
          lv: 1
        },
        {
          t: 'グラフ選択のコツ',
          n: R`典型的な誤りは、(a) 向きを無視した図（すべて $0$ 以上）、(b) 符号が逆の図、(c) $B$ の形をそのまま電流の形にした図、の 3 つです。まず「$B$ が一定の区間は $I=0$」で (c) を消し、次に「最初の区間は反時計回り、つまり負」で (a)(b) を消します。`,
          lv: 2
        }
      ],
      tags: ['小問集合', '選択式', '電磁誘導', 'レンツの法則', 'B-tグラフ']
    },

    /* ================= 第2問（剛体のつり合いと慣性力）================= */
    {
      id: 'sk-p-2025-2',
      subject: 'physics',
      level: 'mid',
      unit: 'p-rigid',
      title: '加速するトラック上の木箱',
      source: src('第2問'),
      time: 14,
      prereq: ['p-force0', 'p-eom'],
      body: R`図のように、水平な直線道路を走るトラックの荷台（水平で、あらい面）に、質量 $M$ の一様な直方体の木箱が置かれている。木箱の高さは $h=1.2\,\mathrm{m}$、トラックの進行方向の幅は $w=0.60\,\mathrm{m}$ で、荷台と木箱の間の静止摩擦係数は $\mu=0.40$ である。トラックが進行方向（図の右向き）に一定の加速度の大きさ $a$ で加速しているとき、木箱は荷台に対して静止したままであった。重力加速度の大きさを $g=9.8\,\mathrm{m/s^{2}}$ とし、以下では荷台とともに加速するトラック内の観測者の立場で考える（図の点 $\mathrm{G}$ は木箱の重心である）。`,
      fig: figTruck(),
      parts: [
        {
          label: '(1)',
          q: R`荷台の上から木箱を見ると、トラックが加速しているせいで、木箱に見かけの力（慣性力）がはたらいているように見える。その大きさと向きを正しく表しているものを選べ。`,
          type: 'choice',
          choices: [
            R`大きさ $a$、進行方向と逆向き（後ろ向き）`,
            R`大きさ $Ma$、進行方向と同じ向き（前向き）`,
            R`大きさ $Ma$、進行方向と逆向き（後ろ向き）`,
            R`大きさ $\mu Mg$、進行方向と逆向き（後ろ向き）`,
            R`大きさ $a$、進行方向と同じ向き（前向き）`,
            R`慣性力ははたらかない`
          ],
          answer: 2,
          explain: R`慣性力は、加速度と逆向きに、質量 × 加速度の大きさではたらきます。木箱の質量は $M$、トラックの加速度の大きさは $a$ なので、大きさは $Ma$、向きは後ろ向きです。発車する電車の中で、体が後ろへ引かれるように感じるのと同じです。$\mu Mg$ は「最大摩擦力」の大きさで、慣性力とは別のものです。`
        },
        {
          label: '(2)',
          q: R`木箱が荷台から受ける垂直抗力の作用点は、重心 $\mathrm{G}$ の真下の点から、後ろ向きに距離 $x$ だけずれている。$x$ を表す式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{ah}{g}$`,
            R`$\dfrac{ah}{2g}$`,
            R`$\dfrac{aw}{2g}$`,
            R`$\dfrac{gh}{2a}$`,
            R`$\dfrac{Mah}{2g}$`
          ],
          answer: 1,
          explain: R`木箱にはたらく力は、重力 $Mg$ と慣性力 $Ma$（どちらも重心）、垂直抗力 $N$ と静止摩擦力 $F$（どちらも底面）です。鉛直方向で $N=Mg$、水平方向で $F=Ma$。重心まわりのモーメントでは、重力と慣性力は重心にはたらくので $0$、摩擦力 $F$ は重心より $\dfrac{h}{2}$ 下にあるので $F\cdot\dfrac{h}{2}$ のモーメントをもち、これを垂直抗力のモーメント $N\,x$ が打ち消します。$Nx=F\dfrac{h}{2}$ より $x=\dfrac{Mah}{2Mg}=\dfrac{ah}{2g}$ です。$M$ が約分されて長さの次元になることも確認しましょう（$\dfrac{Mah}{2g}$ は質量 × 長さになってしまいます）。`
        },
        {
          label: '(3)',
          q: R`加速度の大きさ $a$ を $0$ から少しずつ大きくしていくとき、木箱が荷台の上ですべり出さないための $a$ の最大値 $a_{1}$ は何 $\mathrm{m/s^{2}}$ か。`,
          type: 'num',
          answer: 3.92,
          rel: 0.02,
          unit: 'm/s²',
          explain: R`すべり出さない条件は、静止摩擦力 $F$ が最大摩擦力 $\mu N$ をこえないことです。$F=Ma\le\mu N=\mu Mg$ より $a\le\mu g$ で、$a_{1}=\mu g=0.40\times 9.8=3.92\,\mathrm{m/s^{2}}$ です。`
        },
        {
          label: '(4)',
          q: R`すべり出さないものとして、$a$ を少しずつ大きくしていくとき、木箱が後ろ向きに倒れ始めないための $a$ の最大値 $a_{2}$ は何 $\mathrm{m/s^{2}}$ か。`,
          type: 'num',
          answer: 4.9,
          rel: 0.02,
          unit: 'm/s²',
          explain: R`垂直抗力の作用点は、木箱の底面の内側になければなりません。重心の真下から後ろへのずれ $x=\dfrac{ah}{2g}$ が、底面の半分の幅 $\dfrac{w}{2}$ をこえると、木箱は後ろ側の底の端を支点に、前側が持ち上がって倒れ始めます。$\dfrac{ah}{2g}\le\dfrac{w}{2}$ より $a\le\dfrac{w}{h}\,g$、$a_{2}=\dfrac{0.60}{1.2}\times 9.8=4.9\,\mathrm{m/s^{2}}$ です。`
        },
        {
          label: '(5)',
          q: R`荷台の面を取りかえて、静止摩擦係数 $\mu$ をいろいろに変えるとき、木箱が荷台に対して静止し続けられる $(\mu,\ a)$ の組の範囲を、横軸に $\mu$、縦軸に $\dfrac{a}{g}$ をとって色で示した図として、最も適切なものを選べ（$h$ と $w$ は上の値のままとする）。`,
          type: 'choice',
          choices: [
            { fig: figAmaxOpt(function (m) { return m; }) },
            { fig: figAmaxOpt(function () { return 0.5; }) },
            { fig: figAmaxOpt(function (m) { return Math.min(m, 0.25); }) },
            { fig: figAmaxOpt(function (m) { return Math.min(m, 0.5); }) },
            { fig: figAmaxOpt(function (m) { return Math.max(m, 0.5); }) }
          ],
          answer: 3,
          explain: R`静止し続けるには、「すべり出さない」$\dfrac{a}{g}\le\mu$ と「倒れない」$\dfrac{a}{g}\le\dfrac{w}{h}=0.50$ の両方が必要なので、$\dfrac{a}{g}\le\min\,(\mu,\ 0.50)$ です。$\mu<0.50$ では $\dfrac{a}{g}=\mu$ の直線の下側、$\mu>0.50$ では $\dfrac{a}{g}=0.50$ の水平線の下側が範囲になり、$\mu=0.50$ で折れ曲がる図になります。「どちらか一方を満たせばよい」とした図（大きい方を上限にしたもの）、$\mu$ によらず $0.50$ とした図（倒れる条件だけ）、直線だけの図（すべる条件だけ）は誤りです。(2) で重心から摩擦力の作用点までの距離を $h$ とまちがえると、水平線が $0.25$ の図になります。`
        }
      ],
      solution: [
        {
          t: '慣性力を使って「つり合い」の問題に直す',
          m: R`\text{慣性力：大きさ } Ma,\quad \text{向き：後ろ向き（加速度と逆向き）}`,
          n: R`トラックの中から見ると、木箱は静止しています。そこで、トラックの加速度と逆向き（後ろ向き）に、重心へ大きさ $Ma$ の慣性力を加え、「力のつり合い」と「力のモーメントのつり合い」の問題として解きます。`,
          easy: R`発車する電車の中で、体が後ろへ引かれるように感じるでしょう。この「引かれる力」が慣性力です。電車の外から見ると、体は元の速さのままでいようとしているだけで、力ははたらいていません。でも電車に乗っている立場では、後ろ向きの力がはたらくと考えると、「つり合い」の問題として扱えます。慣性力の大きさは（質量）×（加速度の大きさ）、向きは加速度と逆向きです。`,
          lv: 1
        },
        {
          t: '力のつり合い（鉛直・水平）',
          m: [R`\text{鉛直：}\ N = Mg`,
              R`\text{水平：}\ F = Ma`],
          n: R`木箱にはたらく力は、重力 $Mg$ と慣性力 $Ma$（どちらも重心 $\mathrm{G}$）、荷台から受ける垂直抗力 $N$ と静止摩擦力 $F$（どちらも底面）です。水平方向では、前向きの摩擦力 $F$ が、後ろ向きの慣性力 $Ma$ とつり合います。`,
          easy: R`木箱が荷台の上で静止しているのは、荷台が木箱を前向きに引いているからです。この前向きの力が静止摩擦力 $F$ で、木箱を加速させる（トラックと同じ加速度にする）はたらきをしています。トラックから見れば、これが後ろ向きの慣性力とつり合っている、ということです。`,
          lv: 1
        },
        {
          t: 'そもそも「力のモーメント」とは',
          m: R`\text{力のモーメント} = (\text{力の大きさ})\times(\text{回転軸から力の作用線までの垂直距離})`,
          n: R`回転軸を 1 つ決めたとき、力が物体を回そうとするはたらきの大きさです。同じ大きさの力でも、回転軸から遠い所で、軸に垂直な向きに押すほど、よく回ります。物体が回らずに静止しているときは、時計回りのモーメントの和と反時計回りのモーメントの和が等しくなります。`,
          easy: R`ドアを開けるとき、ちょうつがい（回転軸）に近い所を押すと重く、遠い所（ドアノブ）を押すと軽く開きますね。力の大きさが同じでも、軸からの距離が長いほど回す力が大きいということです。この「回す力」を数で表したものが、力のモーメント（力 × 距離）です。ドアが動かないで止まっているときは、右回りに回そうとする力と左回りに回そうとする力が、ちょうど同じ大きさでつり合っています。`,
          lv: 3
        },
        {
          t: '(2) 重心まわりのモーメントのつり合い',
          m: [R`F\cdot\frac{h}{2} = N\cdot x`,
              R`x = \frac{F\,h}{2N} = \frac{Ma\,h}{2Mg} = \frac{ah}{2g}`],
          n: R`重心まわりのモーメントを考えると、重力と慣性力は重心にはたらくのでモーメントは $0$ です。摩擦力 $F$ は重心から $\dfrac{h}{2}$ 下の底面にはたらき、木箱を後ろ向きに倒そうと回します。これを、重心の真下より後ろにずれた位置にはたらく垂直抗力 $N$ のモーメントが打ち消します。`,
          fig: figTruckForces(),
          easy: R`力が「ものを回そうとする」はたらきを、力のモーメント（力 × 回転軸までの垂直な距離）といいます。木箱が回らずに静止しているのは、回そうとするモーメントがつり合っているからです。摩擦力は底面を前に引くので、木箱を後ろ向きに倒そうとします。それを防ぐために、垂直抗力は、重心の真下よりも後ろの位置で木箱を支えます。加速度が大きいほど、支える位置は後ろへずれていきます。`,
          pro: R`剛体のつり合いは「力の和 $=0$」と「モーメントの和 $=0$」の 2 本立て。回転軸は、未知の力が多く通る点（ここでは重心か、後ろの底の端 $\mathrm{P}$）にとると式が簡単になる。`,
          lv: 1
        },
        {
          t: '(2) の答えの確かめ（極限と次元）',
          n: R`$a=0$（加速しない）なら $x=0$ で、垂直抗力は重心の真下にはたらきます。$a$ が大きいほど、また重心が高い（$h$ が大きい）ほど、$x$ は大きくなります。単位は $\dfrac{\mathrm{m/s^{2}}\times\mathrm{m}}{\mathrm{m/s^{2}}}=\mathrm{m}$ で長さになり、質量 $M$ は含まれません。この 3 点がそろわない選択肢（$\dfrac{gh}{2a}$ は $a\to 0$ で発散する、$\dfrac{Mah}{2g}$ は質量がまじる）は除けます。`,
          lv: 2
        },
        {
          t: '(3) すべり出さない条件',
          m: [R`F \le \mu N \;\Longrightarrow\; Ma \le \mu Mg \;\Longrightarrow\; a \le \mu g`,
              R`a_{1} = \mu g = 0.40\times 9.8 = 3.92\,\mathrm{m/s^{2}}`],
          n: R`静止摩擦力 $F$ には限界があり、最大摩擦力 $\mu N$ をこえると、木箱はすべり出します。$M$ が約分されるので、木箱の質量によらず $a\le\mu g$ です。`,
          easy: R`面がざらざらしているほど、木箱を引きとめる力（静止摩擦力）の限界は大きくなります。限界の大きさは「$\mu$ × 垂直抗力」です。木箱を加速させるのに必要な力 $Ma$ が、この限界をこえると、木箱は荷台の上をすべります。`,
          lv: 1
        },
        {
          t: '(4) 倒れない条件',
          m: [R`x \le \frac{w}{2} \;\Longrightarrow\; \frac{ah}{2g} \le \frac{w}{2} \;\Longrightarrow\; a \le \frac{w}{h}\,g`,
              R`a_{2} = \frac{0.60}{1.2}\times 9.8 = 4.9\,\mathrm{m/s^{2}}`],
          n: R`垂直抗力は底面全体にはたらく力の合力なので、その作用点は、底面の内側（重心の真下から $\dfrac{w}{2}$ まで）にしか来られません。$x=\dfrac{w}{2}$ が限界で、これをこえると、後ろ側の底の端 $\mathrm{P}$ を支点に木箱が回り始めます（倒れます）。背が高い（$h$ が大きい）ほど、幅が狭い（$w$ が小さい）ほど、倒れやすい式になっています。`,
          lv: 1
        },
        {
          t: '(5) 2 つの条件を合わせる',
          m: [R`\frac{a}{g} \le \mu \quad\text{かつ}\quad \frac{a}{g} \le \frac{w}{h} = 0.50`,
              R`\frac{a}{g} \le \min\,(\mu,\ 0.50)`],
          n: R`「すべらない」と「倒れない」の両方を同時に満たす範囲なので、2 つの上限のうち小さい方が上限になります。$\mu<0.50$ のときは先にすべり出し（上限は $\mu g$）、$\mu>0.50$ のときはすべる前に倒れます（上限は $\dfrac{w}{h}g=0.50g$）。この問題の $\mu=0.40$ では $a_{1}=3.92<a_{2}=4.9$ なので、$a$ を大きくしていくと最初に起きるのは「すべり出し」です。`,
          pro: R`限界の加速度は $a_{\max}=g\cdot\min\left(\mu,\ \dfrac{w}{h}\right)$。どちらが先に起きるかは、$\mu$ と $\dfrac{w}{h}$ の大小で決まる。`,
          lv: 1
        }
      ],
      tags: ['剛体', '力のモーメント', '慣性力', 'すべり出し', '転倒条件']
    },

    /* ================= 第3問（コンデンサーの電荷の分配と電気振動）================= */
    {
      id: 'sk-p-2025-3',
      subject: 'physics',
      level: 'mid',
      unit: 'p-ac',
      title: 'コンデンサーの電荷の分配と電気振動',
      source: src('第3問'),
      time: 14,
      prereq: ['p-estat', 'p-induction'],
      body: R`電気容量が $4C,\ 12C,\ 6C$ の 3 つのコンデンサー P, Q, R、自己インダクタンス $L$ のコイル、起電力 $E$ の電池、3 つのスイッチ $\mathrm{S}_{1},\ \mathrm{S}_{2},\ \mathrm{S}_{3}$ を、図のように接続した。P と Q は直列につながっていて、その接続点を M とする。また、電池の負極につながる下側の導線を、電位の基準（$0\,\mathrm{V}$）の点 G とする。電池の内部抵抗と、コイルおよび導線の抵抗は無視できる。回路を組んだ直後は、スイッチがすべて開いていて、3 つのコンデンサーはどれも帯電していない。コイルを流れる電流 $I$ は、図の矢印の向き（下向き）を正とする。以下の問いに答えよ。分数は $3/7$ のように入力してもよい。`,
      fig: figCircuitPQR(),
      parts: [
        {
          label: '(1)',
          q: R`$\mathrm{S}_{1}$ だけを閉じて、十分に時間がたった。このとき、P にたくわえられている電気量 $Q_{1}$ は $CE$ の何倍か。`,
          type: 'num',
          answer: 3,
          rel: 0.01,
          explain: R`P と Q は電池に直列につながっているので、同じ大きさの電気量がたまります。この 2 つを 1 つのコンデンサーとみなすと、合成容量は $C_{\mathrm{s}}=\dfrac{4C\cdot 12C}{4C+12C}=3C$ で、これに電池の電圧 $E$ がかかるので、$Q_{1}=C_{\mathrm{s}}E=3CE$ です。`
        },
        {
          label: '(2)',
          q: R`(1) のとき、点 G を基準とした点 M の電位は $E$ の何倍か。`,
          type: 'num',
          answer: 1 / 4,
          show: R`\frac{1}{4}`,
          rel: 0.01,
          explain: R`点 G を基準とした点 M の電位は、Q の両端の電圧に等しく、$\dfrac{Q_{1}}{12C}=\dfrac{3CE}{12C}=\dfrac{1}{4}E$ です。P の電圧は $\dfrac{Q_{1}}{4C}=\dfrac{3}{4}E$ で、2 つの電圧の和が電池の電圧 $E$ になります。電気容量が大きい Q のほうが、電圧は小さくなります。`
        },
        {
          label: '(3)',
          q: R`つぎに、$\mathrm{S}_{1}$ を開き、そのあとで $\mathrm{S}_{2}$ を閉じて、十分に時間がたった。このとき、R にたくわえられる電気量は $CE$ の何倍か。`,
          type: 'num',
          answer: 2,
          rel: 0.01,
          explain: R`$\mathrm{S}_{1}$ を開くと電池が切り離されるので、上側の導線につながる極板の電気量の和 $Q_{1}=3CE$ は、あとから R がつながっても変わりません。$\mathrm{S}_{2}$ を閉じると、R と、直列の P・Q（合成容量 $3C$）が並列になり、同じ電圧 $V'$ がかかります。電気量の保存より $6CV'+3CV'=Q_{1}=3CE$、$V'=\dfrac{1}{3}E$ なので、R の電気量は $6CV'=2CE$ です。`
        },
        {
          label: '(4)',
          q: R`(3) のとき、点 G を基準とした点 M の電位は $E$ の何倍か。`,
          type: 'num',
          answer: 1 / 12,
          show: R`\frac{1}{12}`,
          rel: 0.01,
          explain: R`P・Q にたまっている電気量は $3C\times\dfrac{1}{3}E=CE$ で、Q の電圧は $\dfrac{CE}{12C}=\dfrac{1}{12}E$、これが点 M の電位です。P の電圧は $\dfrac{CE}{4C}=\dfrac{1}{4}E$ で、$\dfrac{1}{4}E+\dfrac{1}{12}E=\dfrac{1}{3}E=V'$ と、並列の電圧に一致します。R の電気量 $2CE$ と合わせると $2CE+CE=3CE=Q_{1}$ で、電荷が保存されています。`
        },
        {
          label: '(5)',
          q: R`(3) の状態（$\mathrm{S}_{1}$ は開き、$\mathrm{S}_{2}$ は閉じている）から、時刻 $t=0$ に $\mathrm{S}_{3}$ を閉じた。このあと、コイルを流れる電流 $I$ の時間変化を表すグラフとして最も適切なものを選べ（横軸は $\omega t$、$\omega$ は電気振動の角周波数。縦軸は電流の最大値 $I_{0}$ を単位とする）。`,
          type: 'choice',
          choices: [
            { fig: figLCOpt(function (t) { return -Math.cos(t); }) },
            { fig: figLCOpt(function (t) { return -Math.sin(t); }) },
            { fig: figLCOpt(function (t) { return Math.cos(t); }) },
            { fig: figLCOpt(function (t) { return Math.sin(t); }) }
          ],
          answer: 3,
          explain: R`$\mathrm{S}_{3}$ を閉じると、コイルが上側の導線と G の間につながり、コンデンサーとコイルで電気振動が起こります。$t=0$ ではコイルの電流は $0$（コイルの電流は急には変わらない）で、上側の導線の電位が G より高いので、電流はコイルを上から下へ流れ始めます。電流の正の向きは下向きなので、$I$ は $0$ から正の向きに増え、$I=I_{0}\sin\omega t$ の形になります。$t=0$ で電流が $0$ なので $\cos$ 型は誤りで、向きを逆にとると $-\sin$ になります。`
        },
        {
          label: '(6)',
          q: R`(5) の電流の最大値 $I_{0}$ を、(1) の $Q_{1}$ と $L,\ C$ を用いて表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{Q_{1}}{\sqrt{6LC}}$`,
            R`$\dfrac{Q_{1}}{3\sqrt{LC}}$`,
            R`$\dfrac{Q_{1}}{\sqrt{22LC}}$`,
            R`$\dfrac{Q_{1}}{9LC}$`,
            R`$\dfrac{Q_{1}}{\sqrt{3LC}}$`,
            R`$Q_{1}\sqrt{\dfrac{9C}{L}}$`
          ],
          answer: 1,
          explain: R`電流が最大の瞬間は、コンデンサーの電荷がすべて $0$ になり、はじめの電気エネルギーがすべてコイルの磁気エネルギーになっています。振動に加わるコンデンサーは、並列の R（$6C$）と、直列の P・Q の合成（$3C$）なので、合計の電気容量は $C_{\mathrm{t}}=6C+3C=9C$ です。上側の導線の電気量の合計は $Q_{1}$ のままなので、$\dfrac{Q_{1}^{2}}{2C_{\mathrm{t}}}=\dfrac{Q_{1}^{2}}{18C}=\dfrac{1}{2}LI_{0}^{2}$ より $I_{0}=\dfrac{Q_{1}}{\sqrt{9LC}}=\dfrac{Q_{1}}{3\sqrt{LC}}$ です。R だけ（$6C$）、直列の P・Q だけ（$3C$）、3 つとも並列（$22C$）として合計を数えまちがえると、$\dfrac{Q_{1}}{\sqrt{6LC}}$、$\dfrac{Q_{1}}{\sqrt{3LC}}$、$\dfrac{Q_{1}}{\sqrt{22LC}}$ になります。次元で確かめると、$\sqrt{LC}$ は時間の次元なので、（電気量）÷（時間）で電流の次元になります。$\dfrac{Q_{1}}{9LC}$ と $Q_{1}\sqrt{\dfrac{9C}{L}}$ は次元が合いません。`
        },
        {
          label: '(7)',
          q: R`$C=1.0\,\mu\mathrm{F}$、$L=0.10\,\mathrm{mH}$、$E=9.0\,\mathrm{V}$ のとき、$I_{0}$ は何 $\mathrm{A}$ か。`,
          type: 'num',
          answer: 0.90,
          rel: 0.02,
          unit: 'A',
          explain: R`$Q_{1}=3CE=3\times 1.0\times10^{-6}\times 9.0=2.7\times10^{-5}\,\mathrm{C}$、$3\sqrt{LC}=3\times\sqrt{1.0\times10^{-4}\times 1.0\times10^{-6}}=3\times 1.0\times10^{-5}=3.0\times10^{-5}\,\mathrm{s}$ なので、$I_{0}=\dfrac{2.7\times10^{-5}}{3.0\times10^{-5}}=0.90\,\mathrm{A}$ です。別の確かめとして、電圧 $V'=\dfrac{1}{3}E=3.0\,\mathrm{V}$ のとき $I_{0}=V'\sqrt{\dfrac{C_{\mathrm{t}}}{L}}=3.0\times\sqrt{\dfrac{9.0\times10^{-6}}{1.0\times10^{-4}}}=3.0\times 0.30=0.90\,\mathrm{A}$ です。`
        }
      ],
      solution: [
        {
          t: 'そもそも：コンデンサーの直列と並列、合成容量',
          m: [R`\text{直列：}\ \frac{1}{C_{\mathrm{s}}} = \frac{1}{C_{a}} + \frac{1}{C_{b}}\qquad(\text{電気量が等しい})`,
              R`\text{並列：}\ C_{\mathrm{p}} = C_{a} + C_{b}\qquad(\text{電圧が等しい})`],
          n: R`コンデンサーに電圧 $V$ をかけたときにたまる電気量 $Q$ は、電圧に比例します（$Q=CV$）。比例定数 $C$ が電気容量です。直列につないだ 2 つは、間の導線にほかの出入り口がないので、同じ電気量になり、全体の電圧は 2 つの電圧の和です。並列につないだ 2 つは、同じ電圧がかかり、全体の電気量は 2 つの電気量の和です。どちらも、まとめて 1 つのコンデンサー（合成容量）とみなせます。`,
          easy: R`直列は、電気の通り道が一本につながった並べ方です。途中の導線（点 M）にはほかの出入り口がないので、どのコンデンサーにも同じ量の電気がたまります。そのかわり、全体にかかる電圧を 2 つで分け合うので、まとめた容量は、もとの容量より小さくなります。並列は、電気の通り道が分かれる並べ方で、どちらにも同じ電圧がかかります。ためられる電気の量は足し算になるので、まとめた容量も足し算です。`,
          lv: 3
        },
        {
          t: R`段階 1 — $\mathrm{S}_{1}$ のみ閉じる：直列のコンデンサー`,
          m: [R`C_{\mathrm{s}} = \frac{4C\cdot 12C}{4C+12C} = 3C`,
              R`Q_{1} = C_{\mathrm{s}}E = 3CE`,
              R`V_{\mathrm{M}} = \frac{Q_{1}}{12C} = \frac{3CE}{12C} = \frac{1}{4}E`],
          n: R`P と Q は電池に直列につながっているので、同じ電気量 $Q_{1}$ がたまります。この 2 つを 1 つのコンデンサーとみなした合成容量 $C_{\mathrm{s}}=3C$ に、電池の電圧 $E$ がかかるので、$Q_{1}=C_{\mathrm{s}}E=3CE$ です。点 G を基準とした点 M の電位は Q の両端の電圧に等しく、$\dfrac{Q_{1}}{12C}=\dfrac{1}{4}E$ です。P の電圧は $\dfrac{Q_{1}}{4C}=\dfrac{3}{4}E$ で、2 つの電圧の和が電池の電圧 $E$ になっています。`,
          easy: R`コンデンサーは電気をためる部品で、ためられる電気量 $Q$ は、かけた電圧 $V$ に比例します（$Q=CV$、$C$ は電気容量）。点 M は電池にも何にもつながっていないので、M につながる 2 枚の板（P の下の板と Q の上の板）の電気量の合計は $0$ のままです。P の上の板に $+Q$ がたまれば、P の下の板には $-Q$ が現れ、それを打ち消すように Q の上の板に $+Q$ が現れます。だから、P と Q には同じ電気量 $Q$ がたまります。電圧は $\dfrac{Q}{C}$ なので、電気容量が大きい（たくさんためられる）Q のほうが、電圧は小さくなります。`,
          pro: R`直列は「電気量が等しい」、並列は「電圧が等しい」。まずどちらが共通かを決めてから、$Q=CV$ を使う。直列の電圧は、容量に反比例して配分される（P : Q $=3:1$）。`,
          lv: 1
        },
        {
          t: R`段階 2 — $\mathrm{S}_{1}$ を開いて $\mathrm{S}_{2}$ を閉じる：電荷の保存と並列`,
          m: [R`6C\cdot V' + 3C\cdot V' = Q_{1}\qquad(\text{上側の導線につながる極板の電気量の和})`,
              R`V' = \frac{Q_{1}}{6C + 3C} = \frac{3CE}{9C} = \frac{1}{3}E`,
              R`Q_{\mathrm{R}} = 6C\cdot V' = 2CE,\qquad Q_{\mathrm{PQ}} = 3C\cdot V' = CE`,
              R`V_{\mathrm{M}}' = \frac{Q_{\mathrm{PQ}}}{12C} = \frac{CE}{12C} = \frac{1}{12}E`],
          n: R`$\mathrm{S}_{1}$ を開くと電池が切り離され、上側の導線につながる極板（P の上の極板と、これからつながる R の極板）の電気量の和は $Q_{1}$ のまま保存されます。$\mathrm{S}_{2}$ を閉じると、R（$6C$）と、直列の P・Q（合成容量 $3C$）が並列になり、同じ電圧 $V'$ がかかります。R に $6CV'$、P・Q に $3CV'$ の電気量がたまっているので、その和が $Q_{1}$ です。電気量が決まれば、Q の電圧から点 M の電位が求まります。`,
          easy: R`$\mathrm{S}_{1}$ を開くと、電池が切り離されます。上側の導線につながった板にたまっている電気（$Q_{1}$）は、増えも減りもしません（電荷の保存）。ここへ、まだ空だった R を並列につなぐと、P・Q にたまっていた電気の一部が R へ流れこんで、分け合われます。並列の 2 つ（R と、P・Q をまとめた $3C$）は、電圧が同じになるまで電気が移動し、電気は電気容量の比（$6C:3C=2:1$）に分かれます。電気の総量は変わらないことを式にするのがポイントです。`,
          lv: 1
        },
        {
          t: '確かめ：電圧の配分と電気量の和',
          n: R`P・Q にたまっている電気量 $CE$ から、P の電圧は $\dfrac{CE}{4C}=\dfrac{1}{4}E$、Q の電圧は $\dfrac{1}{12}E$ で、和は $\dfrac{1}{3}E=V'$ になり、R の電圧と一致します。電気量の和は $2CE+CE=3CE=Q_{1}$ で、保存されています。点 M の電位は、(2) の $\dfrac{1}{4}E$ から $\dfrac{1}{12}E$ に下がりました（P・Q の電気の一部が R に移ったため）。`,
          lv: 2
        },
        {
          t: R`段階 3 — $\mathrm{S}_{3}$ を閉じる：電気振動の電流のグラフ`,
          m: [R`\omega = \frac{1}{\sqrt{LC_{\mathrm{t}}}},\qquad C_{\mathrm{t}} = 6C + 3C = 9C`,
              R`I = I_{0}\sin\omega t\qquad(\text{下向きを正})`],
          n: R`$\mathrm{S}_{3}$ を閉じると、コイルが上側の導線と G の間につながります。このとき、3 つのコンデンサーは、R（$6C$）と、直列の P・Q の合成（$3C$）の並列とみなせて、合計の電気容量 $C_{\mathrm{t}}=9C$ のコンデンサーとコイルで電気振動が起こります。$t=0$ でコイルの電流は $0$、上側の導線の電位が高いので、電流は上から下へ流れ始めます。正の向きは下向きなので、電流は $0$ から正の向きに増え、$I=I_{0}\sin\omega t$ の形になります。`,
          fig: figLCOpt(function (t) { return Math.sin(t); }),
          easy: R`コイルには「電流を変化させまいとする」はたらきがあるので、スイッチを閉じた瞬間にいきなり電流が流れるのではなく、$0$ から少しずつ増えていきます。コンデンサーの電気が流れ出して減っていく間、電流は増え、電気が空になったとき電流は最大になります。次に、コイルが電流を流し続けようとして、反対向きに電気をためていきます。この往復が繰り返されるので（電気振動）、電流は $\sin$ の形の波になります。波の符号は、電流が流れ始める向き（この問題では下向き = 正）で決まります。`,
          pro: R`電気振動は「$t=0$ で電流が $0$」なら $\pm\sin$、「$t=0$ で電荷が $0$」なら $\pm\cos$。符号は、電流の正の向きと、はじめに正に帯電している側（上側の導線）から決める。`,
          lv: 1
        },
        {
          t: '(6)(7) 電流の最大値（エネルギー保存と合成容量）',
          m: [R`\frac{Q_{1}^{2}}{2C_{\mathrm{t}}} = \frac{1}{2}LI_{0}^{2}\qquad(C_{\mathrm{t}} = 9C)`,
              R`I_{0} = \frac{Q_{1}}{\sqrt{LC_{\mathrm{t}}}} = \frac{Q_{1}}{\sqrt{9LC}} = \frac{Q_{1}}{3\sqrt{LC}}`,
              R`I_{0} = \frac{3\times 1.0\times10^{-6}\times 9.0}{3\sqrt{1.0\times10^{-4}\times 1.0\times10^{-6}}} = \frac{2.7\times10^{-5}}{3.0\times10^{-5}} = 0.90\,\mathrm{A}`],
          n: R`電流が最大の瞬間は、コンデンサーの電荷がすべて $0$ になっていて、はじめにコンデンサー全体にあった電気エネルギー $\dfrac{Q_{1}^{2}}{2C_{\mathrm{t}}}$ が、すべてコイルの磁気エネルギー $\dfrac{1}{2}LI_{0}^{2}$ に移っています。上側の導線の電気量の合計は $Q_{1}$ のままで、振動に加わる合計の容量は $C_{\mathrm{t}}=9C$ です。エネルギー保存から $I_{0}$ が求まります。`,
          easy: R`電気が空になった瞬間（電流が最大の瞬間）、コンデンサーにあったエネルギー $\dfrac{Q^{2}}{2C}$ は、すべてコイルのエネルギー $\dfrac{1}{2}LI^{2}$ に移っています。エネルギーは減らずに形を変えただけ、という考え方で $I_{0}$ が求められます。ここでは、並列の R（$6C$）と、P・Q をまとめた $3C$ を合わせた $9C$ のコンデンサー 1 つとして考えます。`,
          pro: R`コンデンサーが複数あるときは、直列・並列で 1 つの合成容量 $C_{\mathrm{t}}$ にまとめてから、$\dfrac{Q^{2}}{2C_{\mathrm{t}}}=\dfrac{1}{2}LI_{0}^{2}$ を使う。$I_{0}=\dfrac{Q}{\sqrt{LC_{\mathrm{t}}}}=V\sqrt{\dfrac{C_{\mathrm{t}}}{L}}$ の 2 通りの形を覚えておくと、検算に使える。`,
          lv: 1
        },
        {
          t: '選択肢の確かめ（次元と単位）',
          n: R`$\sqrt{LC}$ は時間の次元（単位は秒）なので、$\dfrac{Q_{1}}{3\sqrt{LC}}$ は（電気量）÷（時間）＝ 電流 になります。$\dfrac{Q_{1}}{9LC}$ は（電気量）÷（時間の $2$ 乗）、$Q_{1}\sqrt{\dfrac{9C}{L}}$ は、$\sqrt{\dfrac{C}{L}}$ が（抵抗）の逆数の次元なので、電流になりません。合計の電気容量を数えまちがえた式（$\dfrac{Q_{1}}{\sqrt{6LC}}$、$\dfrac{Q_{1}}{\sqrt{3LC}}$、$\dfrac{Q_{1}}{\sqrt{22LC}}$ など）は、次元は合っていても係数がちがいます。数値の確認では、$\omega=\dfrac{1}{3\sqrt{LC}}=\dfrac{1}{3.0\times10^{-5}}\approx 3.3\times10^{4}\,\mathrm{rad/s}$、周期は $\dfrac{2\pi}{\omega}\approx 1.9\times10^{-4}\,\mathrm{s}$ で、電流が最大になるのは、電流が流れ始めてからその $\dfrac{1}{4}$（約 $4.7\times10^{-5}\,\mathrm{s}$）後です。`,
          lv: 2
        }
      ],
      tags: ['コンデンサー', '電荷保存', '合成容量', '電気振動', 'LC回路']
    },

    /* ================= 第4問（水面の油膜による光の干渉）================= */
    {
      id: 'sk-p-2025-4',
      subject: 'physics',
      level: 'mid',
      unit: 'p-interf',
      title: '水面の油膜による光の干渉',
      source: src('第4問'),
      time: 14,
      body: R`平らな容器に入れた水の表面に、屈折率 $n_{1}=1.50$ の透明な油が、一様な厚さ $d$ の薄い膜になって広がっている。水の屈折率を $n_{2}=1.33$、空気の屈折率を $n_{0}=1.00$ とする。この油膜に白色光を真上から垂直に当て、真上へもどってくる反射光を分光して、波長ごとの強度を調べる。油膜の上面（空気との境界）で反射する光を ①、油の中へ進んで下面（水との境界）で反射し、もう一度上面を通って空気中へ出てくる光を ② とする。観測される反射光は、① と ② が重なり合ったものである。

反射光の強度を、空気中での波長 $\lambda$ を変えながら測定したところ、可視光の範囲で図の下のグラフ（横軸は空気中での波長）のようになり、強度が極小になる波長が 3 つ現れた。これを波長の短いほうから A, B, C とする。A と B の波長は $\lambda_{\mathrm{A}}=420\,\mathrm{nm}$、$\lambda_{\mathrm{B}}=504\,\mathrm{nm}$ である。A, B, C は隣り合う極小で、波長が短いものほど干渉の次数が $1$ ずつ大きい。屈折率は波長によらず一定とし、反射光の強度の極小の位置は ① と ② の干渉だけで決まるものとして考えてよい。`,
      fig: figOil(),
      parts: [
        {
          label: '(1)',
          q: R`光 ①、② がそれぞれ反射するとき、位相はどうなるか。正しい組合せを選べ。`,
          type: 'choice',
          choices: [
            R`① は $\pi$ ずれる、② は変わらない`,
            R`① は変わらない、② は $\pi$ ずれる`,
            R`① も ② も $\pi$ ずれる`,
            R`① も ② も変わらない`
          ],
          answer: 0,
          explain: R`光が屈折率の小さい媒質から大きい媒質へ進んで反射するときは位相が $\pi$ ずれ、大きい媒質から小さい媒質へ進んで反射するときは変わりません。光 ① は空気（$1.00$）→ 油（$1.50$）で屈折率が大きくなる向きに反射するので $\pi$ ずれます。光 ② は油（$1.50$）→ 水（$1.33$）で屈折率が小さくなる向きに反射するので、位相は変わりません。ずれが残るのは ① だけです。`
        },
        {
          label: '(2)',
          q: R`空気中での波長が $504\,\mathrm{nm}$ の光（B）は、油の中を進むとき、波長が何 $\mathrm{nm}$ になるか。`,
          type: 'num',
          answer: 336,
          rel: 0.01,
          unit: 'nm',
          explain: R`屈折率 $n_{1}$ の油の中では、光の速さが $\dfrac{1}{n_{1}}$ 倍になり、振動数は変わらないので、波長も $\dfrac{1}{n_{1}}$ 倍になります。$\dfrac{504}{1.50}=336\,\mathrm{nm}$ です。$n_{1}$ をかけて $756\,\mathrm{nm}$ としてはいけません（媒質の中では波長は短くなります）。`
        },
        {
          label: '(3)',
          q: R`光 ① と光 ② が弱め合って反射光の強度が極小になる条件として、正しいものを選べ。ただし、$\lambda$ は空気中での光の波長、$m$ は正の整数とする。`,
          type: 'choice',
          choices: [
            R`$2n_{1}d=\left(m+\dfrac{1}{2}\right)\lambda$`,
            R`$2d=m\lambda$`,
            R`$n_{1}d=m\lambda$`,
            R`$2d=\left(m+\dfrac{1}{2}\right)\lambda$`,
            R`$2n_{1}d=m\lambda$`,
            R`$n_{1}d=\left(m+\dfrac{1}{2}\right)\lambda$`
          ],
          answer: 4,
          explain: R`光 ② は油の中を往復する分、光 ① より $2d$ だけ余分に進みます。これは、油の中の波長 $\dfrac{\lambda}{n_{1}}$ で数えると $\dfrac{2d}{\lambda/n_{1}}=\dfrac{2n_{1}d}{\lambda}$ 波長分で、空気中の波長 $\lambda$ を基準にした長さ（光路差）に直すと $2n_{1}d$ です。反射での位相のずれは ① にだけ $\pi$（半波長ぶん）残るので、光路差が波長の整数倍のとき、山と谷が重なって弱め合い、$2n_{1}d=m\lambda$ になります（強め合うのは $2n_{1}d=\left(m+\dfrac{1}{2}\right)\lambda$ のとき）。$2d$ や $n_{1}d$ は、往復の $2$ 倍や屈折率の補正を落とした誤りです。`
        },
        {
          label: '(4)',
          q: R`波長 C の値 $\lambda_{\mathrm{C}}$ は何 $\mathrm{nm}$ か。`,
          type: 'num',
          answer: 630,
          rel: 0.005,
          unit: 'nm',
          explain: R`弱め合う条件は $2n_{1}d=m\lambda$ で、波長が長いほど次数 $m$ は小さくなります。B の次数を $m$ とすると A は $m+1$ なので、$(m+1)\times 420=m\times 504$ より $84m=420$、$m=5$。$2n_{1}d=5\times 504=2520\,\mathrm{nm}$ です。C は次数が $m-1=4$ なので、$\lambda_{\mathrm{C}}=\dfrac{2520}{4}=630\,\mathrm{nm}$ です。弱め合う条件を $\left(m+\dfrac{1}{2}\right)\lambda$ の形でおくと、$m$ が整数にならず、まちがいに気づけます。`
        },
        {
          label: '(5)',
          q: R`油膜の厚さ $d$ は何 $\mathrm{nm}$ か。`,
          type: 'num',
          answer: 840,
          rel: 0.005,
          unit: 'nm',
          explain: R`(4) より $2n_{1}d=2520\,\mathrm{nm}$、$n_{1}=1.50$ なので、$d=\dfrac{2520}{2\times 1.50}=840\,\mathrm{nm}$ です。`
        },
        {
          label: '(6)',
          q: R`油膜の厚さ $d$ と屈折率 $n_{1}$ はそのままで、水を、屈折率 $n_{3}=1.60$ のガラスに取りかえ、ガラスの上に油膜がある状態にして、同じように測定した。このとき、波長 $504\,\mathrm{nm}$ の反射光の強度は、次のうちどうなったか。`,
          type: 'choice',
          choices: [
            R`強度が極大になる（反射光が最も強い）`,
            R`強度が極小になる（反射光が最も弱い）`,
            R`極大にも極小にもならない（途中の強さ）`
          ],
          answer: 0,
          explain: R`ガラスの屈折率 $1.60$ は油の $1.50$ より大きいので、光 ② の反射（油 → ガラス）で位相が $\pi$ ずれます。① も $\pi$ ずれるので、ずれは打ち消し合い、(3) とは逆に、光路差が波長の整数倍のとき強め合い（極大）、$\left(m+\dfrac{1}{2}\right)$ 倍のとき弱め合い（極小）になります。$\lambda=504\,\mathrm{nm}$ では $\dfrac{2n_{1}d}{\lambda}=\dfrac{2520}{504}=5$（整数）なので、強め合って極大になります。水のときは、この $504\,\mathrm{nm}$ が B（極小）でした。`
        },
        {
          label: '(7)',
          q: R`(6) のガラスのとき、波長 $560\,\mathrm{nm}$ の反射光の強度は、次のうちどうなったか。`,
          type: 'choice',
          choices: [
            R`強度が極大になる（反射光が最も強い）`,
            R`強度が極小になる（反射光が最も弱い）`,
            R`極大にも極小にもならない（途中の強さ）`
          ],
          answer: 1,
          explain: R`$\lambda=560\,\mathrm{nm}$ では $\dfrac{2n_{1}d}{\lambda}=\dfrac{2520}{560}=4.5=4+\dfrac{1}{2}$ で、(6) の条件のうち弱め合う方（$2n_{1}d=\left(m+\dfrac{1}{2}\right)\lambda$）を満たすので、極小になります。水のときは、同じ $560\,\mathrm{nm}$ で極大でした。水をガラスに取りかえると、山と谷がちょうど入れかわります。`
        }
      ],
      solution: [
        {
          t: '反射による位相のずれを確かめる',
          n: R`光が屈折率の小さい媒質から大きい媒質へ進んで境界で反射するとき、反射光の位相は $\pi$ ずれます。逆に、大きい媒質から小さい媒質へ進んで反射するときは、位相は変わりません。この問題の光 ①（空気 $1.00$ → 油 $1.50$）は屈折率が大きくなる向きの反射なので $\pi$ ずれ、光 ②（油 $1.50$ → 水 $1.33$）は小さくなる向きの反射なので変わりません。反射による位相のずれは、① にだけ $\pi$ 残ります。`,
          easy: R`ロープの端を壁に固定して波を送ると、波は上下が反転して返ってきます（固定端反射）。端が自由に動くときは、反転せずに返ってきます（自由端反射）。光でも同じで、屈折率が大きい媒質（光が進みにくい、いわば「重い」媒質）の境界で反射するときは反転（位相が $\pi$ ずれる）し、小さい媒質の境界で反射するときは反転しません。`,
          pro: R`位相のずれは「各反射で $\pi$ ずれるか」を数えて、ずれる回数の偶奇で判断する。1 回なら $\pi$ のずれが残り（強め合いと弱め合いの条件が半波長ぶんずれる）、2 回なら打ち消し合う（実質ずれなし）。`,
          lv: 1
        },
        {
          t: '(2) 油の中の波長',
          m: [R`\lambda' = \frac{\lambda}{n_{1}}`,
              R`\lambda'_{\mathrm{B}} = \frac{504}{1.50} = 336\,\mathrm{nm}`],
          n: R`屈折率 $n$ の媒質中では、光の速さが $\dfrac{1}{n}$ 倍になります。振動数は変わらないので、波長も $\dfrac{1}{n}$ 倍です。空気中の波長 $\lambda$ の光は、油の中では $\dfrac{\lambda}{n_{1}}$ に縮みます。`,
          easy: R`同じペースでゆれながら進む波が、進むのがおそい所に入ると、山と山の間隔（波長）がつまります。行進している列が、足場の悪い所でゆっくり歩くと、前後の間隔がつまるのと同じイメージです。光は、屈折率が大きい媒質ほど進むのがおそくなり、波長が縮みます。屈折率 $1.50$ の油の中では、波長が空気中の $\dfrac{1}{1.50}$ になります。`,
          pro: R`媒質中では、波長 $\dfrac{\lambda}{n}$、速さ $\dfrac{c}{n}$、振動数は不変。屈折率を波長に反映させるのは「割り算」。`,
          lv: 1
        },
        {
          t: '光路差：油の中の往復を、空気中の波長で測る',
          m: R`\text{光路差} = n_{1}\times 2d = 2n_{1}d`,
          n: R`光 ② は油の中を往復して、光 ① より $2d$ だけ余分に進みます。これを油の中の波長 $\dfrac{\lambda}{n_{1}}$ で数えると $\dfrac{2d}{\lambda/n_{1}}=\dfrac{2n_{1}d}{\lambda}$ 波長分です。空気中の波長 $\lambda$ を基準にして「何波長分か」を比べるために、$2d$ に $n_{1}$ をかけた $2n_{1}d$ を**光路差**といいます。`,
          easy: R`同じ長さの道のりでも、油の中では波長が縮んでいるので、入る波の数（何波長分か）が多くなります。油の中の $2d$ という距離は、波長 $\dfrac{\lambda}{n_{1}}$ のものさしで測ると、$\dfrac{2d}{\lambda/n_{1}}=\dfrac{2n_{1}d}{\lambda}$ 個分です。これを「空気中の波長 $\lambda$ のものさしで測った距離（光路）」に直したものが $2n_{1}d$ です。`,
          lv: 1
        },
        {
          t: 'そもそも「光路差」と位相の関係',
          m: R`\text{光路差} = m\lambda\ \Longrightarrow\ \text{山と山が重なる},\qquad \text{光路差} = \left(m+\frac{1}{2}\right)\lambda\ \Longrightarrow\ \text{山と谷が重なる}`,
          n: R`光は波なので、2 つの光の道のりの差（光路差）が波長 $\lambda$ の整数倍なら、山と山（谷と谷）が重なって強め合います。半波長の奇数倍なら、山と谷が重なって打ち消し合います。反射のときに位相が $\pi$（半波長ぶん）ずれる光が 1 つだけあるときは、その分だけ強め合いと弱め合いの条件が入れかわります。`,
          easy: R`2 つの波を重ねると、山と山が重なる所では波が大きくなり（強め合い）、山と谷が重なる所では波が消し合います（弱め合い）。2 つの光が出発点から出会う点まで進んだ道のりの差（光路差）が、波長のちょうど整数倍なら、山と山がそろいます。波長の半分だけずれていれば、山と谷が出会います。`,
          lv: 3
        },
        {
          t: '(3) 弱め合う・強め合う条件',
          m: [R`2n_{1}d = m\lambda\qquad(\text{弱め合い})`,
              R`2n_{1}d = \left(m + \frac{1}{2}\right)\lambda\qquad(\text{強め合い})`],
          n: R`位相のずれが ① にだけ $\pi$（半波長ぶん）残っているので、光路差が波長の整数倍のときに、2 つの光は山と谷が重なって弱め合います。反対に、光路差が半波長の奇数倍のときは、半波長ずれた位相がさらに半波長ずれて、同じ位相で重なり、強め合います。`,
          easy: R`① は反射で反転している（$\pi$ ずれる）ぶん、② とは山と谷が逆になっています。だから、② が余分に進む距離（光路差）がちょうど整数波長のときは、山と谷が逆のまま重なって弱め合います。光路差が半波長余分にあると、反転の分と打ち消し合って山と山がそろうので、強め合います。`,
          lv: 1
        },
        {
          t: R`(4) 次数のつながりから $\lambda_{\mathrm{C}}$ を求める`,
          m: [R`(m+1)\,\lambda_{\mathrm{A}} = m\,\lambda_{\mathrm{B}} \;\Longrightarrow\; (m+1)\times 420 = m\times 504`,
              R`84\,m = 420 \;\Longrightarrow\; m = 5`,
              R`2n_{1}d = 5\times 504 = 2520\,\mathrm{nm}`,
              R`\lambda_{\mathrm{C}} = \frac{2520}{m-1} = \frac{2520}{4} = 630\,\mathrm{nm}`],
          n: R`B の次数を $m$ とすると、波長がより短い A は $m+1$、より長い C は $m-1$ です。A と B は同じ油膜（同じ $2n_{1}d$）で弱め合っているので、$2n_{1}d$ が等しいことから $m$ が決まります。A の次数 $m+1=6$ でも確かめると、$6\times 420=2520\,\mathrm{nm}$ で一致します。`,
          easy: R`同じ油膜では、光路差 $2n_{1}d$ は同じ長さです。この長さの中に、波長が短い光ほど、たくさんの波が入ります。A（$420\,\mathrm{nm}$）は B（$504\,\mathrm{nm}$）より、入る波の数がちょうど $1$ つ多い（次数が $1$ だけ大きい）という関係を式にしたものです。次数 $m$ は整数でなければならないので、$m=5$ だけが答えになります。`,
          pro: R`「隣り合う極小の次数は 1 違う」ことと「$2n_{1}d$ は共通」から、次数を未知数にして連立する。整数にならなければ、条件の取りちがい（強め合いと弱め合いの取りちがい）を疑う。`,
          lv: 1
        },
        {
          t: '次数を半整数の形でおいたらどうなるか（確かめ）',
          m: R`\left(m+\frac{3}{2}\right)\lambda_{\mathrm{A}} = \left(m+\frac{1}{2}\right)\lambda_{\mathrm{B}} \;\Longrightarrow\; 84\,m = 378 \;\Longrightarrow\; m = 4.5`,
          n: R`もし弱め合う条件を「$2n_{1}d=\left(m+\dfrac{1}{2}\right)\lambda$」の形（強め合う条件の形）でおくと、B の次数を $m$ として $\left(m+\dfrac{3}{2}\right)\times 420=\left(m+\dfrac{1}{2}\right)\times 504$ となり、$m=4.5$ で整数になりません。次数は整数でなければならないので、この置き方は誤りだと分かります。「整数にならない」ときは、強め合いと弱め合いの取りちがいを疑うのが、この種の問題での確認の方法です。`,
          lv: 2
        },
        {
          t: '(5) 油膜の厚さ',
          m: R`d = \frac{2n_{1}d}{2n_{1}} = \frac{2520}{2\times 1.50} = 840\,\mathrm{nm}`,
          n: R`$d$ は $840\,\mathrm{nm}$（約 $0.84\,\mu\mathrm{m}$）で、可視光の波長と同程度の「薄い」膜です。`,
          lv: 1
        },
        {
          t: '(6)(7) 水をガラスに取りかえたとき：山と谷の入れかわり',
          m: [R`2n_{1}d = m\lambda\ (\text{強め合い}),\qquad 2n_{1}d = \left(m+\frac{1}{2}\right)\lambda\ (\text{弱め合い})`,
              R`\lambda = 504\,\mathrm{nm}:\ \frac{2520}{504} = 5\ \Rightarrow\ \text{極大},\qquad \lambda = 560\,\mathrm{nm}:\ \frac{2520}{560} = 4.5\ \Rightarrow\ \text{極小}`],
          n: R`油（$1.50$）→ ガラス（$1.60$）の反射では位相が $\pi$ ずれ、① と同じになるので、位相のずれは打ち消し合い、条件が水のときと入れかわります。図の実線（水）で極小だった A, B, C（$420,\ 504,\ 630\,\mathrm{nm}$）は、破線（ガラス）ではすべて極大になり、水で極大だった $387.7,\ 458.2,\ 560\,\mathrm{nm}$ が、ガラスでは極小になります。`,
          fig: figOilCompare(),
          easy: R`光 ① と ② の「反射のときの位相のずれ」が、① だけ $\pi$（水のとき）から、① も ② も $\pi$（ガラスのとき）に変わりました。ずれが残る光がなくなるので、2 つの光の位相の関係が半波長ぶん変わり、強め合う波長と弱め合う波長が入れかわります。$\dfrac{2n_{1}d}{\lambda}$ の値が整数なら強め合い、整数 $+\dfrac{1}{2}$ なら弱め合いです。`,
          pro: R`境界ごとの $\pi$ のずれの回数を数え、偶数回なら「光路差 $=m\lambda$ で強め合い」、奇数回なら「光路差 $=\left(m+\dfrac{1}{2}\right)\lambda$ で強め合い」。$\dfrac{2n_{1}d}{\lambda}$ を計算して整数か半整数かを見る。`,
          lv: 1
        }
      ],
      tags: ['光の干渉', '薄膜干渉', '位相のずれ', '光路差', '屈折率', '油膜']
    }
  ]);
})();
