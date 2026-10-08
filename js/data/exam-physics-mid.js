/* GOKAKU NAVI — 物理 問題バンク（中堅大レベル）
   物理の単元 p-kin 〜 p-atom の 21 単元を 1 問ずつ。入試標準・誘導つき（3〜4 設問）。
   すべて書き下ろしのオリジナル問題（既存の入試問題・参考書の文面は含まない）。 */
(function () {
  'use strict';
  const R = String.raw;
  const PI = Math.PI;
  const G = JK.plot.graph;
  const D = function (w, h) { return JK.plot.draw(w, h); };
  // 矢印 + 手動配置のラベル（ラベルが矢印に重ならないよう位置を明示する）
  function arr(d, x1, y1, x2, y2, label, cls, lx, ly, anchor) {
    d.arrow(x1, y1, x2, y2, { cls: cls });
    if (label) d.text(lx, ly, label, { cls: cls, anchor: anchor || 'start', italic: true });
  }

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // p-kin: 自動車 A（加速 → 等速）とバイク B（等速）の v-t グラフ
  function figKin() {
    return G({
      w: 340, h: 230, x: [0, 12], y: [0, 14], axis: ['t [s]', 'v [m/s]'],
      curves: [
        { f: function (t) { return t <= 6 ? 2 * t : 12; }, cls: 'c1' },
        { f: function () { return 10; }, cls: 'c2' }
      ],
      vlines: [{ x: 6, label: 't = 6 s' }],
      labels: [
        { x: 0.3, y: 8.6, text: '自動車 A', cls: 'c1' },
        { x: 8.2, y: 8.7, text: 'バイク B', cls: 'c2' }
      ]
    });
  }
  // p-kin 解説: 2 本の線にはさまれた面積 = 距離の差
  function figKinSol() {
    return G({
      w: 340, h: 230, x: [0, 12], y: [0, 14], axis: ['t [s]', 'v [m/s]'],
      curves: [
        { f: function (t) { return t <= 6 ? 2 * t : 12; }, cls: 'c1' },
        { f: function () { return 10; }, cls: 'c2' }
      ],
      fills: [{ f: function () { return 10; }, g: function (t) { return 2 * t; }, from: 2, to: 5, cls: 'f3' }],
      vlines: [{ x: 2, label: 't = 2', dash: true }, { x: 5, dash: true }],
      points: [{ x: 5, y: 10, label: 't = 5 で v が等しい', cls: 'c3', pos: 'tr' }],
      labels: [{ x: 2.9, y: 6.6, text: '面積 = 9 m', cls: 'c3' }]
    });
  }

  // p-fall: 崖の上から斜め上に投げた小球
  function figFall() {
    const d = D(360, 238);
    const s = 5.2, x0 = 62, yg = 196, h = 14.7, vx = 19.6 * Math.cos(PI / 6), vy = 9.8, g = 9.8;
    const X = function (t) { return x0 + s * vx * t; };
    const Y = function (t) { return yg - s * (h + vy * t - 0.5 * g * t * t); };
    d.hatch(8, yg, 352, yg);
    d.poly([[8, yg], [x0, yg], [x0, yg - s * h], [8, yg - s * h]], { cls: 'fg', fill: 'f0' });
    let p = '';
    for (let k = 0; k <= 60; k++) { const t = 3 * k / 60; p += (k ? ' L' : 'M') + X(t).toFixed(1) + ' ' + Y(t).toFixed(1); }
    d.path(p, { cls: 'c1', dash: true });
    const y0 = Y(0);
    d.line(x0, y0, x0 + 66, y0, { cls: 'dim', dash: true, w: 1 });
    d.arrow(x0, y0, x0 + 44 * Math.cos(PI / 6), y0 - 44 * Math.sin(PI / 6), { cls: 'c3' });
    d.arc(x0, y0, 30, 0, 30, { cls: 'c3' });
    d.text(x0 + 40, y0 - 3, '30°', { cls: 'c3', anchor: 'start', size: 11 });
    d.text(x0 + 52, y0 - 30, 'v₀ = 19.6 m/s', { cls: 'c3', anchor: 'start', size: 11 });
    d.dot(X(1), Y(1), { cls: 'c4', r: 3.2 });
    d.text(X(1), Y(1) - 8, '最高点', { cls: 'c4', size: 11 });
    d.dot(X(3), yg, { cls: 'c2', r: 3.5 });
    d.text(X(3), yg - 9, '落下点', { cls: 'c2', size: 11 });
    d.line(x0, 214, X(3), 214, { cls: 'dim', w: 1 });
    d.line(x0, 209, x0, 219, { cls: 'dim', w: 1 });
    d.line(X(3), 209, X(3), 219, { cls: 'dim', w: 1 });
    d.text((x0 + X(3)) / 2, 230, '崖の真下から落下点までの水平距離', { size: 11, cls: 'dim' });
    d.text(35, (yg + yg - s * h) / 2 + 4, '14.7 m', { size: 12 });
    return d.svg();
  }

  // p-rigid: 壁に立てかけたはしご
  function figLadder() {
    const d = D(360, 250);
    const s = 36, wx = 80, fy = 206;
    const A = [wx + 3 * s, fy], B = [wx, fy - 4 * s], Gp = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    d.hatch(wx, 30, wx, fy, { side: 1 });
    d.hatch(wx, fy, 340, fy, { side: 1 });
    d.line(A[0], A[1], B[0], B[1], { cls: 'fg', w: 4 });
    d.dot(Gp[0], Gp[1], { cls: 'fg', r: 3 });
    arr(d, B[0], B[1], B[0] + 50, B[1], 'N_B', 'c1', B[0] + 56, B[1] + 4);
    arr(d, A[0], A[1], A[0], A[1] - 56, 'N_A', 'c1', A[0] + 6, A[1] - 52);
    arr(d, A[0], A[1], A[0] - 52, A[1], 'f', 'c3', A[0] - 52, A[1] - 8, 'middle');
    arr(d, Gp[0], Gp[1], Gp[0], Gp[1] + 50, 'mg', 'c2', Gp[0] + 6, Gp[1] + 52);
    d.text(A[0] + 12, A[1] - 6, 'A', { size: 14, italic: true, anchor: 'start' });
    d.text(B[0] + 10, B[1] - 8, 'B', { size: 14, italic: true, anchor: 'start' });
    d.text(Gp[0] - 12, Gp[1] - 6, 'G', { size: 12, italic: true });
    // 寸法
    d.line(58, B[1], 58, fy, { cls: 'dim', w: 1 });
    d.line(53, B[1], 63, B[1], { cls: 'dim', w: 1 });
    d.line(53, fy, 63, fy, { cls: 'dim', w: 1 });
    d.text(30, (B[1] + fy) / 2 + 4, '4.0 m', { size: 12 });
    d.line(wx, 226, A[0], 226, { cls: 'dim', w: 1 });
    d.line(wx, 221, wx, 231, { cls: 'dim', w: 1 });
    d.line(A[0], 221, A[0], 231, { cls: 'dim', w: 1 });
    d.text((wx + A[0]) / 2, 243, '3.0 m', { size: 12 });
    d.text(228, 100, 'はしご AB（長さ 5.0 m）', { size: 12, anchor: 'start' });
    d.text(228, 118, '床: あらい（静止摩擦係数 μ）', { size: 12, anchor: 'start' });
    d.text(228, 136, '壁: なめらか', { size: 12, anchor: 'start' });
    return d.svg();
  }

  // p-eom: あらい台上の物体 A と、滑車を介してつるされた B
  function figPulley() {
    const d = D(360, 246);
    d.rect(10, 140, 232, 16, { cls: 'fg', fill: 'f0' });
    d.rect(60, 112, 54, 28, { cls: 'fg', fill: 'f1', rx: 3 });
    d.text(87, 131, 'A', { size: 14, italic: true });
    d.text(87, 104, 'M = 5.0 kg', { size: 12 });
    d.text(124, 176, '台の面: あらい（動摩擦係数 μ′ = 0.20）', { size: 12, anchor: 'middle' });
    d.line(114, 126, 252, 126, { cls: 'fg', w: 1.3 });
    d.circle(252, 136, 10, { cls: 'fg', fill: 'f0' });
    d.dot(252, 136, { cls: 'fg', r: 2 });
    d.path('M252 126 A10 10 0 0 1 262 136', { cls: 'fg', fill: null, w: 1.3 });
    d.line(262, 136, 262, 182, { cls: 'fg', w: 1.3 });
    d.rect(248, 182, 28, 32, { cls: 'fg', fill: 'f2', rx: 3 });
    d.text(262, 203, 'B', { size: 14, italic: true });
    d.text(284, 200, 'm = 3.0 kg', { size: 12, anchor: 'start' });
    d.hatch(226, 234, 350, 234);
    d.line(300, 214, 300, 234, { cls: 'dim', w: 1 });
    d.line(295, 214, 305, 214, { cls: 'dim', w: 1 });
    d.line(295, 234, 305, 234, { cls: 'dim', w: 1 });
    d.text(310, 228, 'h = 0.80 m', { size: 12, anchor: 'start' });
    return d.svg();
  }

  // p-momentum: 衝突前後
  function figCollision() {
    const d = D(360, 240);
    d.text(14, 20, '衝突前', { anchor: 'start', size: 12, bold: true });
    d.hatch(14, 100, 346, 100);
    d.rect(66, 70, 40, 30, { cls: 'c1', fill: 'f1', rx: 3 });
    d.text(86, 90, 'A', { size: 14, italic: true });
    d.rect(232, 62, 52, 38, { cls: 'c2', fill: 'f2', rx: 3 });
    d.text(258, 86, 'B', { size: 14, italic: true });
    arr(d, 70, 54, 124, 54, 'v = 6.0 m/s', 'c3', 130, 58);
    d.text(86, 118, '2.0 kg', { size: 12 });
    d.text(258, 118, '4.0 kg', { size: 12 });
    d.text(258, 56, '静止', { size: 12, cls: 'dim' });
    d.text(14, 146, '衝突後', { anchor: 'start', size: 12, bold: true });
    d.hatch(14, 214, 346, 214);
    d.rect(112, 184, 40, 30, { cls: 'c1', fill: 'f1', rx: 3 });
    d.text(132, 204, 'A', { size: 14, italic: true });
    d.rect(216, 176, 52, 38, { cls: 'c2', fill: 'f2', rx: 3 });
    d.text(242, 200, 'B', { size: 14, italic: true });
    arr(d, 116, 170, 146, 170, 'v_A′', 'c3', 150, 174);
    arr(d, 220, 162, 262, 162, 'v_B′', 'c3', 266, 166);
    d.text(180, 234, '右向きを正とする（なめらかな水平面、反発係数 e = 0.60）', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // p-energy: 斜面・あらい区間 AB・ばね
  function figIncline() {
    const d = D(360, 236);
    const s = 44, fy = 188, xt = 88, h = 1.2;
    const run = h / Math.tan(PI / 6) * s, yt = fy - h * s;
    const xA = xt + run, xB = xA + 1.0 * s;
    d.hatch(60, fy, 346, fy);
    d.poly([[xt, yt], [xA, fy], [xt, fy]], { cls: 'fg', fill: 'f0' });
    d.line(xA, fy, xB, fy, { cls: 'c3', w: 4.5 });
    // 斜面上の小物体
    const t = 0.2, px = xt + t * run, py = yt + t * (fy - yt), cx = px + 4.5, cy = py - 7.8;
    d.rect(cx - 14, cy - 9, 28, 18, { cls: 'fg', fill: 'f1', rx: 2, rot: -30, ox: cx, oy: cy });
    d.text(cx + 34, cy - 22, 'm = 0.50 kg', { size: 11, anchor: 'middle' });
    d.angle(xA, fy, 30, 150, 180, '30°', { cls: 'c3' });
    // ばねと壁
    d.spring(294, fy - 10, 342, fy - 10, { n: 6, amp: 8 });
    d.hatch(342, fy - 46, 342, fy, { side: -1 });
    d.text(318, fy - 30, 'k = 200 N/m', { size: 11 });
    // 高さの寸法
    d.line(70, yt, 70, fy, { cls: 'dim', w: 1 });
    d.line(65, yt, 75, yt, { cls: 'dim', w: 1 });
    d.line(65, fy, 75, fy, { cls: 'dim', w: 1 });
    d.text(64, (yt + fy) / 2 + 4, 'h = 1.2 m', { size: 12, anchor: 'end' });
    d.dot(xA, fy, { cls: 'fg', r: 2.5 });
    d.dot(xB, fy, { cls: 'fg', r: 2.5 });
    d.text(xA, fy + 20, 'A', { size: 13, italic: true });
    d.text(xB, fy + 20, 'B', { size: 13, italic: true });
    d.text((xA + xB) / 2, fy + 34, 'AB 間: あらい（μ′ = 0.40、長さ 1.0 m）', { size: 12, cls: 'c3' });
    d.text(268, fy - 30, 'なめらか', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // p-circular: 鉛直面内の円運動
  function figVertCircle() {
    const d = D(360, 236);
    const ox = 170, oy = 118, r = 78;
    d.circle(ox, oy, r, { cls: 'dim', dash: true, w: 1.2 });
    d.line(ox, oy, ox, oy + r - 9, { cls: 'fg', w: 1.5 });
    d.circle(ox, oy + r, 9, { cls: 'fg', fill: 'f1' });
    d.dot(ox, oy, { cls: 'fg', r: 3.5 });
    d.text(ox - 14, oy - 6, 'O', { size: 13, italic: true });
    d.dot(ox, oy - r, { cls: 'c4', r: 3.5 });
    d.text(ox, oy - r - 8, '最高点 P', { size: 12, cls: 'c4' });
    arr(d, ox + 14, oy + r, ox + 70, oy + r, 'v₀ = 7.0 m/s', 'c3', ox + 76, oy + r + 4);
    d.text(ox + 8, oy + 36, 'L = 0.80 m', { size: 12, anchor: 'start' });
    d.text(ox, oy + r + 28, 'm = 0.50 kg', { size: 12 });
    return d.svg();
  }

  // p-shm: ばね振り子（3 つの状態）
  function figSpringPend() {
    const d = D(360, 226);
    const sc = 600, L0 = 50, ext = 0.098 * sc, amp = 0.05 * sc, y0 = 16;
    d.hatch(30, y0, 340, y0, { side: -1 });
    [[62, 0, '自然長'], [180, ext, 'つり合いの位置'], [300, ext + amp, '放す位置']].forEach(function (c) {
      const x = c[0], yEnd = y0 + L0 + c[1];
      d.spring(x, y0, x, yEnd, { n: 7, amp: 6 });
      d.rect(x - 16, yEnd, 32, 24, { cls: 'fg', fill: 'f1', rx: 3 });
      d.text(x, 206, c[2], { size: 12 });
    });
    const yb = y0 + L0 + ext, yc = yb + amp;
    d.line(196, yb, 332, yb, { cls: 'dim', dash: true, w: 1 });
    d.line(224, yc, 332, yc, { cls: 'dim', dash: true, w: 1 });
    d.line(238, yb, 238, yc, { cls: 'c3', w: 1.4 });
    d.line(233, yb, 243, yb, { cls: 'c3', w: 1.4 });
    d.line(233, yc, 243, yc, { cls: 'c3', w: 1.4 });
    d.text(246, (yb + yc) / 2 + 4, '0.050 m', { size: 12, anchor: 'start', cls: 'c3' });
    d.text(228, 104, 'k = 40 N/m、m = 0.40 kg', { size: 12, anchor: 'start' });
    return d.svg();
  }

  // p-heat: 熱量計（容器・水・金属球）
  function figCalorimeter() {
    const d = D(360, 214);
    d.poly([[111, 100], [249, 100], [249, 178], [111, 178]], { cls: 'c1', fill: 'f1', w: 1 });
    d.path('M110 62 L110 180 L250 180 L250 62', { cls: 'fg', fill: null, w: 2.2 });
    d.text(180, 120, '水 200 g（20 °C）', { size: 12 });
    d.circle(180, 40, 14, { cls: 'c2', fill: 'f2' });
    arr(d, 180, 58, 180, 96, '', 'c3', 0, 0);
    d.text(202, 44, '金属球 150 g（100 °C）', { size: 12, anchor: 'start', cls: 'c2' });
    d.text(180, 150, '容器: 熱容量 60 J/K', { size: 12, cls: 'dim' });
    d.text(180, 200, '外部との熱の出入りはない', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // p-gas: 水銀柱で封じた空気（(a) 水平 (b) 口が上 (c) 口が下）。長さは 1 cm = 2.2 px の縮尺
  function figMercury() {
    const d = D(360, 206);
    const s = 2.2, tw = 18;
    const air = function (x, y, w, h) { d.rect(x, y, w, h, { cls: 'c1', fill: 'f1', w: 0.6 }); };
    const hg = function (x, y, w, h) { d.rect(x, y, w, h, { cls: 'c2', fill: 'f2', w: 0.6 }); };
    const dimH = function (x1, x2, y, label) {
      d.line(x1, y, x2, y, { cls: 'dim', w: 1 });
      d.line(x1, y - 4, x1, y + 4, { cls: 'dim', w: 1 });
      d.line(x2, y - 4, x2, y + 4, { cls: 'dim', w: 1 });
      d.text((x1 + x2) / 2, y + 16, label, { size: 12 });
    };
    const dimV = function (y1, y2, x, label) {
      d.line(x, y1, x, y2, { cls: 'dim', w: 1 });
      d.line(x - 4, y1, x + 4, y1, { cls: 'dim', w: 1 });
      d.line(x - 4, y2, x + 4, y2, { cls: 'dim', w: 1 });
      d.text(x + 9, (y1 + y2) / 2 + 5, label, { size: 14, italic: true, anchor: 'start' });
    };
    const ax = 16, ay = 62;
    air(ax, ay, 30 * s, tw);
    hg(ax + 30 * s, ay, 19 * s, tw);
    d.path('M' + (ax + 60 * s) + ' ' + ay + ' L' + ax + ' ' + ay + ' L' + ax + ' ' + (ay + tw) + ' L' + (ax + 60 * s) + ' ' + (ay + tw), { cls: 'fg', fill: null, w: 2 });
    d.text(ax + 30 * s, 44, '(a) 水平', { size: 12 });
    dimH(ax, ax + 30 * s, ay + tw + 14, '30 cm');
    dimH(ax + 30 * s, ax + 49 * s, ay + tw + 14, '19 cm');
    d.text(ax + 60 * s + 4, ay + tw / 2 + 4, '管口', { size: 11, anchor: 'start', cls: 'dim' });
    const top = 30, bot = top + 60 * s;
    const bx = 214;
    air(bx, bot - 24 * s, tw, 24 * s);
    hg(bx, bot - 43 * s, tw, 19 * s);
    d.path('M' + bx + ' ' + top + ' L' + bx + ' ' + bot + ' L' + (bx + tw) + ' ' + bot + ' L' + (bx + tw) + ' ' + top, { cls: 'fg', fill: null, w: 2 });
    dimV(bot - 24 * s, bot, bx + tw + 12, 'L₁');
    d.text(bx + tw / 2, bot + 20, '(b) 口が上', { size: 12 });
    const cx = 296;
    air(cx, top, tw, 40 * s);
    hg(cx, top + 40 * s, tw, 19 * s);
    d.path('M' + cx + ' ' + bot + ' L' + cx + ' ' + top + ' L' + (cx + tw) + ' ' + top + ' L' + (cx + tw) + ' ' + bot, { cls: 'fg', fill: null, w: 2 });
    dimV(top, top + 40 * s, cx + tw + 12, 'L₂');
    d.text(cx + tw / 2, bot + 20, '(c) 口が下', { size: 12 });
    air(ax, 140, 14, 10);
    d.text(ax + 20, 149, '空気', { size: 11, anchor: 'start' });
    hg(ax + 56, 140, 14, 10);
    d.text(ax + 76, 149, '水銀（長さ 19 cm）', { size: 11, anchor: 'start' });
    d.text(ax, 176, '(a)(b)(c) とも空気の温度は 300 K', { size: 11, anchor: 'start', cls: 'dim' });
    return d.svg();
  }

  // p-thermo1: ばねのついたピストン（水平な円筒、ピストンの右側は真空）
  function figSpringPiston() {
    const d = D(360, 200);
    const x0 = 28, x1 = 332, yt = 68, yb = 128, xp = 128, ym = (yt + yb) / 2;
    d.rect(x0 + 1, yt, xp - x0 - 1, yb - yt, { cls: 'c1', fill: 'f1', w: 0.6 });
    d.line(x0, yt, x1, yt, { cls: 'fg', w: 2.4 });
    d.line(x0, yb, x1, yb, { cls: 'fg', w: 2.4 });
    d.hatch(x0, yt - 6, x0, yb + 6, { side: 1 });
    d.hatch(x1, yt - 6, x1, yb + 6, { side: -1 });
    d.rect(xp - 4, yt + 1, 8, yb - yt - 2, { cls: 'fg', fill: 'f0', w: 1.6 });
    d.spring(xp + 4, ym, x1, ym, { n: 9, amp: 9 });
    d.text((x0 + xp) / 2, ym - 4, '気体', { size: 13 });
    d.text((x0 + xp) / 2, ym + 14, '（単原子分子）', { size: 11 });
    d.text(232, yb - 5, '真空', { size: 12, cls: 'dim' });
    d.text(232, yt - 10, 'ばね定数 k = 5.0×10³ N/m', { size: 12 });
    // 左端からピストンまでの長さ x
    d.line(x0, 44, xp, 44, { cls: 'dim', w: 1 });
    d.line(x0, 39, x0, 49, { cls: 'dim', w: 1 });
    d.line(xp, 39, xp, 49, { cls: 'dim', w: 1 });
    d.text((x0 + xp) / 2, 34, '0.20 m（状態 A）', { size: 12 });
    // ヒーターと断面積
    d.path('M44 152 L54 142 L64 160 L74 142 L84 160 L94 142 L104 160 L112 150', { cls: 'c3', fill: null, w: 2 });
    d.text(78, 184, 'ヒーター', { size: 12, cls: 'c3' });
    d.text(250, 156, '断面積 S = 1.0×10⁻² m²', { size: 12 });
    return d.svg();
  }

  // p-thermo1: 選択肢用の小さな p-V グラフ（A = (1, 1) から B = (2, 2) への変化）
  function figPV(kind) {
    const o = {
      w: 190, h: 150, x: [0, 3], y: [0, 3], axis: ['V', 'p'], grid: false, ticks: false,
      points: [{ x: 1, y: 1, label: 'A', cls: 'c3', pos: 'br' }, { x: 2, y: 2, label: 'B', cls: 'c3', pos: 'br' }]
    };
    if (kind === 'line') o.curves = [{ f: function (x) { return x; }, domain: [1, 2], cls: 'c1' }];
    if (kind === 'low') o.curves = [{ f: function (x) { return 1 + (x - 1) * (x - 1); }, domain: [1, 2], cls: 'c1' }];
    if (kind === 'high') o.curves = [{ f: function (x) { return 1 + Math.sqrt(x - 1); }, domain: [1, 2], cls: 'c1' }];
    if (kind === 'step') o.segs = [{ x1: 1, y1: 1, x2: 2, y2: 1, cls: 'c1' }, { x1: 2, y1: 1, x2: 2, y2: 2, cls: 'c1' }];
    return G(o);
  }

  // p-wave: 水面波の屈折（波面と進行方向）。sinθ₁ = 0.8、sinθ₂ = 0.6。境界上の波面の間隔は 75 px
  function figRefraction() {
    const d = D(360, 234);
    const yb = 118, xn = 176;
    d.rect(8, yb, 344, 108, { cls: 'c1', fill: 'f1', w: 0.6 });
    d.line(8, yb, 352, yb, { cls: 'fg', w: 2 });
    for (let k = 0; k < 4; k++) {
      const xb = 64 + 75 * k;
      d.line(xb, yb, xb + 0.6 * 84, yb - 0.8 * 84, { cls: 'dim', w: 1.4 });
      d.line(xb, yb, xb - 0.8 * 64, yb + 0.6 * 64, { cls: 'dim', w: 1.4 });
    }
    d.line(xn, 52, xn, 206, { cls: 'dim', dash: true, w: 1 });
    d.arrow(xn - 0.8 * 74, yb - 0.6 * 74, xn, yb, { cls: 'c3' });
    d.arrow(xn, yb, xn + 0.6 * 74, yb + 0.8 * 74, { cls: 'c3' });
    d.angle(xn, yb, 34, 90, 143.13, 'θ₁', { cls: 'c4' });
    d.angle(xn, yb, 34, 270, 306.87, 'θ₂', { cls: 'c4' });
    d.text(14, 20, '領域 I（深い）', { size: 12, anchor: 'start', bold: true });
    d.text(14, 38, 'v₁ = 20 cm/s、λ₁ = 10 cm', { size: 11, anchor: 'start' });
    d.text(346, 196, '領域 II（浅い）', { size: 12, anchor: 'end', bold: true });
    d.text(346, 214, 'λ₂ = 7.5 cm', { size: 11, anchor: 'end' });
    d.text(346, yb - 7, '境界', { size: 11, anchor: 'end', cls: 'dim' });
    d.text(140, 44, '波面', { size: 11, anchor: 'start', cls: 'dim' });
    return d.svg();
  }

  // p-doppler: 図 A（音源 S が壁 W に近づく）、図 B（観測者 O が壁 W に近づく）
  function figDoppler() {
    const d = D(360, 218);
    const person = function (x, y) {
      d.circle(x, y - 28, 6, { cls: 'fg', fill: 'f0' });
      d.line(x, y - 22, x, y - 4, { cls: 'fg', w: 2 });
      d.line(x - 7, y - 16, x + 7, y - 16, { cls: 'fg', w: 2 });
    };
    const speaker = function (x, y) {
      d.rect(x - 10, y - 30, 20, 30, { cls: 'fg', fill: 'f1', rx: 2 });
      d.circle(x, y - 14, 5, { cls: 'fg' });
      d.arc(x, y - 15, 20, -42, 42, { cls: 'c1', w: 1.2 });
      d.arc(x, y - 15, 30, -42, 42, { cls: 'c1', w: 1.2 });
      d.arc(x, y - 15, 20, 138, 222, { cls: 'c1', w: 1.2 });
      d.arc(x, y - 15, 30, 138, 222, { cls: 'c1', w: 1.2 });
    };
    const wall = function (y) { d.hatch(322, y - 62, 322, y + 2, { side: -1 }); d.text(310, y - 66, 'W', { size: 14, italic: true }); };
    // 図 A
    d.text(14, 16, '図 A', { size: 12, anchor: 'start', bold: true });
    d.line(14, 92, 322, 92, { cls: 'dim', w: 1 });
    person(40, 92); d.text(40, 110, 'O', { size: 14, italic: true });
    speaker(158, 92); d.text(158, 110, 'S', { size: 14, italic: true });
    d.text(158, 126, '680 Hz', { size: 11, cls: 'dim' });
    d.arrow(182, 44, 230, 44, { cls: 'c3' });
    d.text(206, 36, 'u = 2.0 m/s', { size: 12, cls: 'c3' });
    wall(92);
    // 図 B
    d.text(14, 142, '図 B', { size: 12, anchor: 'start', bold: true });
    d.line(14, 196, 322, 196, { cls: 'dim', w: 1 });
    speaker(58, 196); d.text(58, 214, 'S（静止）', { size: 12 });
    person(188, 196); d.text(188, 214, 'O', { size: 14, italic: true });
    d.arrow(204, 160, 252, 160, { cls: 'c3' });
    d.text(228, 152, 'w = 1.0 m/s', { size: 12, cls: 'c3' });
    wall(196);
    return d.svg();
  }

  // p-interf: 回折格子とスクリーン（L = 1.0 m を 130 px の縮尺。2 次の明線まで描く）
  function figGrating() {
    const d = D(380, 262);
    const gx = 92, sx = 222, cy = 122, Lp = 130;
    const t1 = 0.3 / Math.sqrt(1 - 0.09), t2 = 0.75;      // tan θ₁（sin θ₁ = 0.30）、tan θ₂（sin θ₂ = 0.60）
    d.hatch(sx, 20, sx, 224, { side: -1 });
    d.line(gx, 20, gx, 224, { cls: 'fg', w: 4, dash: '9 5' });
    d.text(gx, 12, '回折格子', { size: 12 });
    d.text(sx, 12, 'スクリーン', { size: 12 });
    d.arrow(8, cy, gx - 8, cy, { cls: 'c3' });
    d.text(46, cy - 12, '単色光', { size: 12, cls: 'c3' });
    d.text(46, cy + 22, 'λ = 600 nm', { size: 11 });
    [[0, '0 次'], [Lp * t1, '1 次'], [-Lp * t1, '1 次'], [Lp * t2, '2 次'], [-Lp * t2, '2 次']].forEach(function (q) {
      const y = cy - q[0];
      d.line(gx, cy, sx, y, { cls: 'c1', w: 1.4 });
      d.dot(sx, y, { cls: 'c3', r: 3.5 });
      d.text(sx + 12, y + 4, q[1], { size: 11, anchor: 'start' });
    });
    d.arc(gx, cy, 62, 0, 36.87, { cls: 'c4' });
    d.text(gx + 68, cy - 33, 'θ₂', { size: 12, italic: true, anchor: 'start', cls: 'c4' });
    // 2 次の明線の位置 x₂（中央の明線から測る）
    const xd = sx + 64;
    d.line(xd, cy, xd, cy - Lp * t2, { cls: 'dim', w: 1 });
    d.line(xd - 4, cy, xd + 4, cy, { cls: 'dim', w: 1 });
    d.line(xd - 4, cy - Lp * t2, xd + 4, cy - Lp * t2, { cls: 'dim', w: 1 });
    d.text(xd + 9, cy - Lp * t2 / 2 + 4, 'x₂', { size: 13, italic: true, anchor: 'start' });
    // 格子からスクリーンまでの距離 L
    d.line(gx, 238, sx, 238, { cls: 'dim', w: 1 });
    d.line(gx, 233, gx, 243, { cls: 'dim', w: 1 });
    d.line(sx, 233, sx, 243, { cls: 'dim', w: 1 });
    d.text((gx + sx) / 2, 255, 'L = 1.0 m', { size: 12 });
    return d.svg();
  }

  // p-estat: 金属板 P を差し込んだコンデンサー（1.0 mm = 80 px）。sol = true で誘導電荷と電場を描く解説用
  function figCapSlab(sol) {
    const d = D(sol ? 340 : 380, sol ? 238 : 250);
    const x0 = sol ? 40 : 128, x1 = x0 + 160, yA = 36, yP0 = 68, yP1 = 148, yB = 196;
    d.line(x0, yA, x1, yA, { cls: 'fg', w: 3.2 });
    d.line(x0, yB, x1, yB, { cls: 'fg', w: 3.2 });
    d.rect(x0, yP0, x1 - x0, yP1 - yP0, { cls: 'c3', fill: 'f3', w: 1.6 });
    d.text((x0 + x1) / 2, (yP0 + yP1) / 2 + 5, '金属板 P', { size: 13, cls: 'c3' });
    d.text((x0 + x1) / 2, yA - 9, '極板 A', { size: 12 });
    d.text((x0 + x1) / 2, yB + 20, '極板 B', { size: 12 });
    const xs = [x0 + 20, x0 + 60, x0 + 100, x0 + 140];
    xs.forEach(function (x) {
      d.text(x, yA + 14, '+', { size: 13, cls: 'c2' });
      d.text(x, yB - 5, '−', { size: 14, cls: 'c1' });
    });
    if (!sol) {
      // 電池（+ 極が上）とスイッチ S（開いている）
      d.wire([[70, 92], [70, yA], [94, yA]]);
      d.dot(94, yA, { cls: 'fg', r: 2.5 });
      d.dot(116, yA, { cls: 'fg', r: 2.5 });
      d.line(94, yA, 113, yA - 14, { cls: 'fg', w: 1.5 });
      d.wire([[116, yA], [x0, yA]]);
      d.text(101, yA - 20, 'S', { size: 13, italic: true });
      d.battery(70, 92, 70, 140);
      d.wire([[70, 140], [70, yB], [x0, yB]]);
      d.text(58, 113, 'V₀', { size: 12, italic: true, anchor: 'end' });
      d.text(58, 128, '60 V', { size: 11, anchor: 'end' });
      // 寸法
      const dx = x1 + 22;
      [[yA, yP0, '0.40 mm'], [yP0, yP1, '1.0 mm'], [yP1, yB, '0.60 mm']].forEach(function (s) {
        d.line(dx, s[0], dx, s[1], { cls: 'dim', w: 1 });
        d.line(dx - 4, s[0], dx + 4, s[0], { cls: 'dim', w: 1 });
        d.line(dx - 4, s[1], dx + 4, s[1], { cls: 'dim', w: 1 });
        d.text(dx + 9, (s[0] + s[1]) / 2 + 4, s[2], { size: 11, anchor: 'start' });
      });
    } else {
      // 静電誘導で P の表面に現れる電荷と、すきまの電場
      xs.forEach(function (x) {
        d.text(x, yP0 + 15, '−', { size: 14, cls: 'c1' });
        d.text(x, yP1 - 6, '+', { size: 13, cls: 'c2' });
      });
      [x0 + 40, x0 + 80, x0 + 120].forEach(function (x) {
        d.arrow(x, yA + 6, x, yP0 - 4, { cls: 'c4', w: 1.6 });
        d.arrow(x, yP1 + 6, x, yB - 8, { cls: 'c4', w: 1.6 });
      });
      d.text(x1 + 12, (yA + yP0) / 2 + 4, 'E₀（すきま）', { size: 11, anchor: 'start', cls: 'c4' });
      d.text(x1 + 12, (yP1 + yB) / 2 + 4, 'E₀（すきま）', { size: 11, anchor: 'start', cls: 'c4' });
      d.text(x1 + 12, (yP0 + yP1) / 2 + 4, 'E = 0（金属内）', { size: 11, anchor: 'start', cls: 'c3' });
    }
    return d.svg();
  }

  // p-circuit: 2 つの電池をふくむ回路（スイッチ S は開いている）。sol = true で電流の向きと閉回路の番号を描き込む
  function figKirchhoff(sol) {
    const d = D(380, 246);
    const yt = 50, yb = 196, xl = 56, xm = 190, xr = 324;
    d.wire([[xl, yt], [xr, yt]]);
    d.wire([[xl, yb], [xr, yb]]);
    // 左の枝: R₁ と E₁（長い線が正極で上側）
    d.resistor(xl, yt, xl, 108);
    d.battery(xl, 108, xl, 156);
    d.wire([[xl, 156], [xl, yb]]);
    d.text(xl + 12, 82, 'R₁ = 2.0 Ω', { size: 12, anchor: 'start' });
    d.text(xl + 12, 138, 'E₁ = 12 V', { size: 12, anchor: 'start' });
    // 中央の枝: R₃
    d.resistor(xm, yt, xm, yb);
    d.dot(xm, yt, { cls: 'fg', r: 3 });
    d.dot(xm, yb, { cls: 'fg', r: 3 });
    d.text(xm + 12, 128, 'R₃ = 3.0 Ω', { size: 12, anchor: 'start' });
    // 右の枝: R₂、E₂（正極が上）、スイッチ S（開いている）
    d.resistor(xr, yt, xr, 108);
    d.battery(xr, 108, xr, 156);
    d.wire([[xr, 156], [xr, 166]]);
    d.dot(xr, 166, { cls: 'fg', r: 2.5 });
    d.dot(xr, 184, { cls: 'fg', r: 2.5 });
    d.line(xr, 184, xr + 14, 166, { cls: 'fg', w: 1.5 });
    d.wire([[xr, 184], [xr, yb]]);
    d.text(xr + 26, 180, 'S', { size: 13, italic: true });
    d.text(xr - 12, 82, 'R₂ = 3.0 Ω', { size: 12, anchor: 'end' });
    d.text(xr - 12, 138, 'E₂ = 3.0 V', { size: 12, anchor: 'end' });
    if (!sol) {
      d.text(190, 232, '電池の内部抵抗と導線の抵抗は無視する（長い線が正極）', { size: 11, cls: 'dim' });
    } else {
      d.arrow(xl - 14, 188, xl - 14, 162, { cls: 'c3' });
      d.text(xl - 22, 180, 'I₁', { size: 13, italic: true, anchor: 'end', cls: 'c3' });
      d.arrow(xm - 14, 62, xm - 14, 92, { cls: 'c3' });
      d.text(xm - 22, 82, 'I₃', { size: 13, italic: true, anchor: 'end', cls: 'c3' });
      d.arrow(xr + 14, 100, xr + 14, 68, { cls: 'c3' });
      d.text(xr + 22, 90, 'I₂', { size: 13, italic: true, anchor: 'start', cls: 'c3' });
      d.text(124, 170, '①', { size: 16, cls: 'c4' });
      d.text(258, 176, '②', { size: 16, cls: 'c4' });
      d.text(190, 232, '矢印は、仮定した電流の向き（S は閉じた状態として扱う）', { size: 11, cls: 'dim' });
    }
    return d.svg();
  }

  // p-mag: 質量分析器（1 m = 500 px）。イオンは O から入って半円を描き、乾板に当たる
  function figMassSpec() {
    const d = D(380, 272);
    const ox = 318, yb = 150, s = 500, r1 = 0.16 * s, r2 = 0.20 * s;
    d.rect(44, 30, 318, yb - 30, { cls: 'dim', fill: 'f1', dash: true, w: 1 });
    d.text(52, 46, 'B = 0.50 T', { size: 12, anchor: 'start' });
    d.text(52, 62, '（紙面に垂直）', { size: 11, anchor: 'start', cls: 'dim' });
    // 写真乾板と、すきま O のまわりの壁
    d.line(60, yb, ox - 14, yb, { cls: 'fg', w: 4 });
    d.line(ox + 14, yb, 362, yb, { cls: 'fg', w: 4 });
    d.text(228, yb + 20, '写真乾板', { size: 12 });
    d.text(ox + 24, yb + 18, 'O', { size: 13, italic: true });
    // 2 つのイオンの軌道（中心は乾板上）
    d.path('M' + ox + ' ' + yb + ' A' + r1 + ' ' + r1 + ' 0 0 0 ' + (ox - 2 * r1) + ' ' + yb, { cls: 'c1', w: 2 });
    d.path('M' + ox + ' ' + yb + ' A' + r2 + ' ' + r2 + ' 0 0 0 ' + (ox - 2 * r2) + ' ' + yb, { cls: 'c2', w: 2, dash: true });
    d.text(ox - r1, yb - 26, 'イオン 1', { size: 12, cls: 'c1' });
    d.text(ox - r1, yb - 11, '(m₁)', { size: 11, cls: 'c1' });
    d.text(ox - r2, 43, 'イオン 2（m₂）', { size: 12, cls: 'c2' });
    d.dot(ox - 2 * r1, yb, { cls: 'c1', r: 4 });
    d.dot(ox - 2 * r2, yb, { cls: 'c2', r: 4 });
    d.text(ox - 2 * r1, yb + 18, 'P₁', { size: 12, italic: true, cls: 'c1' });
    d.text(ox - 2 * r2, yb + 18, 'P₂', { size: 12, italic: true, cls: 'c2' });
    // 加速部分（電極のすきまをイオンが通る）
    const yu = 194, yl = 234, bx = ox - 62;
    [yu, yl].forEach(function (y) {
      d.line(ox - 38, y, ox - 16, y, { cls: 'fg', w: 3 });
      d.line(ox + 16, y, ox + 38, y, { cls: 'fg', w: 3 });
    });
    d.wire([[ox - 38, yl], [bx, yl]]);
    d.wire([[ox - 38, yu], [bx, yu]]);
    d.battery(bx, yl, bx, yu);
    d.text(bx - 12, 218, 'V = 8.0×10³ V', { size: 12, anchor: 'end' });
    d.arrow(ox, 254, ox, 106, { cls: 'c3' });
    d.text(ox + 10, 122, 'v', { size: 13, italic: true, anchor: 'start', cls: 'c3' });
    d.text(ox, 268, 'イオン源', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // p-induction: 正方形コイルが一様な磁場の領域へ進む（t = 0 のようす）。a = 0.20 m を 60 px の縮尺
  function figCoilField() {
    const d = D(360, 226);
    const fx0 = 150, fx1 = 270, fy0 = 34, fy1 = 174, cx0 = 90, cy0 = 74, a = 60;
    d.rect(fx0, fy0, fx1 - fx0, fy1 - fy0, { cls: 'dim', fill: 'f1', dash: true, w: 1 });
    [170, 210, 250].forEach(function (x) {
      [60, 104, 148].forEach(function (y) {
        d.circle(x, y, 6, { cls: 'dim', w: 1 });
        d.line(x - 3.5, y - 3.5, x + 3.5, y + 3.5, { cls: 'dim', w: 1 });
        d.line(x - 3.5, y + 3.5, x + 3.5, y - 3.5, { cls: 'dim', w: 1 });
      });
    });
    d.text(210, 26, 'B = 0.50 T（表から裏へ）', { size: 12 });
    d.rect(cx0, cy0, a, a, { cls: 'c3', fill: 'f3', w: 2.4 });
    d.text(cx0 - 34, 108, 'コイル', { size: 12 });
    d.text(cx0 - 34, 124, 'R = 0.20 Ω', { size: 11 });
    d.arrow(66, 52, 120, 52, { cls: 'c4' });
    d.text(93, 44, 'v = 2.0 m/s', { size: 12, cls: 'c4' });
    // 寸法: コイルの一辺 a と、磁場の領域の幅 w
    d.line(cx0, 150, cx0 + a, 150, { cls: 'dim', w: 1 });
    d.line(cx0, 145, cx0, 155, { cls: 'dim', w: 1 });
    d.line(cx0 + a, 145, cx0 + a, 155, { cls: 'dim', w: 1 });
    d.text(cx0 + a / 2, 168, 'a = 0.20 m', { size: 11 });
    d.line(fx0, 192, fx1, 192, { cls: 'dim', w: 1 });
    d.line(fx0, 187, fx0, 197, { cls: 'dim', w: 1 });
    d.line(fx1, 187, fx1, 197, { cls: 'dim', w: 1 });
    d.text((fx0 + fx1) / 2, 210, 'w = 0.40 m', { size: 12 });
    return d.svg();
  }

  // p-induction: I-t グラフ（0〜0.10 s, 0.10〜0.20 s, 0.20〜0.30 s の電流値 l1, l2, l3 [A]）
  function figCoilIt(l1, l2, l3) {
    const seg = function (x1, y1, x2, y2, dash) { return { x1: x1, y1: y1, x2: x2, y2: y2, cls: dash ? 'dim' : 'c1', dash: !!dash }; };
    return G({
      w: 250, h: 170, x: [0, 0.36], y: [-1.5, 1.5], axis: ['t [s]', 'I [A]'],
      segs: [
        seg(0, l1, 0.1, l1), seg(0.1, l2, 0.2, l2), seg(0.2, l3, 0.3, l3),
        seg(0, 0, 0, l1, true), seg(0.1, l1, 0.1, l2, true), seg(0.2, l2, 0.2, l3, true), seg(0.3, l3, 0.3, 0, true)
      ]
    });
  }

  // p-ac: 変圧器を使った送電。sol = true で各部分の電圧・電流を描き込む
  function figTransmission(sol) {
    const d = D(380, 206);
    const yt = 56, yb = 148;
    const transformer = function (xp, xs) {          // 一次コイル（左に膨らむ）・鉄心・二次コイル（右に膨らむ）
      d.coil(xp, yb, xp, yt, { n: 5 });
      d.line(xp + 14, yt + 16, xp + 14, yb - 16, { cls: 'fg', w: 1.6 });
      d.line(xp + 18, yt + 16, xp + 18, yb - 16, { cls: 'fg', w: 1.6 });
      d.coil(xs, yt, xs, yb, { n: 5 });
    };
    d.acsource(46, 102, 14);
    d.wire([[46, 88], [46, yt], [104, yt]]);
    d.wire([[46, 116], [46, yb], [104, yb]]);
    transformer(104, 136);
    d.wire([[136, yt], [158, yt]]);
    d.resistor(158, yt, 228, yt);
    d.wire([[228, yt], [250, yt]]);
    d.wire([[136, yb], [250, yb]]);
    transformer(250, 282);
    d.wire([[282, yt], [330, yt]]);
    d.wire([[282, yb], [330, yb]]);
    d.resistor(330, yt, 330, yb);
    d.text(344, 106, '負荷', { size: 12, anchor: 'start' });
    d.text(46, 176, '発電機', { size: 12 });
    d.text(120, 176, '昇圧変圧器', { size: 12 });
    d.text(120, 192, '巻数比 1 : 10', { size: 11, cls: 'dim' });
    d.text(266, 176, '降圧変圧器', { size: 12 });
    d.text(266, 192, '巻数比 10 : 1', { size: 11, cls: 'dim' });
    if (!sol) {
      d.text(193, 38, '送電線（抵抗 r = 5.0 Ω）', { size: 12 });
      d.text(46, 192, '1.0×10³ V', { size: 11, cls: 'dim' });
    } else {
      d.text(70, 38, '1.0×10³ V', { size: 12, cls: 'c1' });
      d.text(70, 22, 'I = 1.0×10² A', { size: 11, cls: 'c3' });
      d.text(193, 38, '1.0×10⁴ V → 9950 V', { size: 12, cls: 'c1' });
      d.text(193, 22, 'I = 10 A（r = 5.0 Ω）', { size: 11, cls: 'c3' });
      d.text(312, 38, '995 V', { size: 12, cls: 'c1' });
      d.text(312, 22, 'I = 1.0×10² A', { size: 11, cls: 'c3' });
    }
    return d.svg();
  }

  // p-photon: 結晶の原子面での X 線のブラッグ反射（模式図。θ は 30° で描いてある）
  function figBragg() {
    const d = D(360, 218);
    const yP = [100, 136, 172], dpx = 36, th = 30 * PI / 180, c = Math.cos(th), s = Math.sin(th), L = 80;
    yP.forEach(function (y) {
      d.line(24, y, 336, y, { cls: 'dim', w: 1.2 });
      for (let x = 40; x <= 320; x += 30) d.dot(x, y, { cls: 'fg', r: 3.5 });
    });
    const A = [150, 100], B = [150, 136], t2 = L + dpx * s;
    // X 線 1 は面 1 の A で、X 線 2 は面 2 の B で反射する（波面に垂直な向きの 2 本）
    d.arrow(A[0] - L * c, A[1] - L * s, A[0], A[1], { cls: 'c3' });
    d.arrow(A[0], A[1], A[0] + L * c, A[1] - L * s, { cls: 'c3' });
    d.arrow(B[0] - t2 * c, B[1] - t2 * s, B[0], B[1], { cls: 'c3' });
    d.arrow(B[0], B[1], B[0] + t2 * c, B[1] - t2 * s, { cls: 'c3' });
    d.angle(A[0], A[1], 34, 150, 180, 'θ', { cls: 'c4' });
    d.angle(A[0], A[1], 34, 0, 30, 'θ', { cls: 'c4' });
    d.text(52, 50, 'X 線', { size: 12, cls: 'c3' });
    d.text(334, 92, '原子面', { size: 12, anchor: 'end' });
    d.line(300, 100, 300, 136, { cls: 'dim', w: 1 });
    d.line(295, 100, 305, 100, { cls: 'dim', w: 1 });
    d.line(295, 136, 305, 136, { cls: 'dim', w: 1 });
    d.text(312, 122, 'd', { size: 14, italic: true, anchor: 'start' });
    d.text(180, 206, '模式図（θ の大きさは実際とは異なる）', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // p-photon 解説: X 線管（加速された電子がターゲットに衝突して X 線が出る）
  function figXrayTube() {
    const d = D(360, 224);
    d.rect(40, 42, 220, 118, { cls: 'fg', rx: 20, w: 1.5 });
    d.spring(66, 100, 98, 100, { n: 3, amp: 8, cls: 'c3' });
    d.text(82, 140, '陰極', { size: 12 });
    d.poly([[212, 66], [226, 60], [226, 140], [212, 134]], { cls: 'fg', fill: 'f2' });
    d.text(232, 152, '陽極', { size: 12 });
    d.arrow(106, 100, 206, 100, { cls: 'c1' });
    d.text(156, 90, 'e⁻', { size: 13, italic: true, cls: 'c1' });
    d.text(156, 118, 'K = eV', { size: 12, cls: 'c1' });
    d.arrow(230, 100, 322, 134, { cls: 'c3' });
    d.text(352, 156, 'X 線（光子 hν）', { size: 12, anchor: 'end', cls: 'c3' });
    // 電源（長い線の側が正極で、陽極につなぐ）
    d.wire([[72, 160], [72, 194], [120, 194]]);
    d.wire([[226, 160], [226, 194], [180, 194]]);
    d.battery(180, 194, 120, 194);
    d.text(150, 216, 'V = 3.0×10⁴ V', { size: 12 });
    return d.svg();
  }

  // p-atom: α 崩壊（崩壊前は静止、崩壊後は反対向きに飛び出す。矢印の長さは模式的）
  function figAlphaDecay() {
    const d = D(360, 232);
    d.text(14, 20, '崩壊前', { size: 12, anchor: 'start', bold: true });
    d.circle(120, 62, 22, { cls: 'c2', fill: 'f2' });
    d.text(120, 67, 'Po', { size: 14 });
    d.text(156, 58, '²¹⁰Po（原子番号 84）', { size: 12, anchor: 'start' });
    d.text(156, 76, 'はじめ静止している', { size: 11, anchor: 'start', cls: 'dim' });
    d.arrow(120, 94, 120, 124, { cls: 'dim' });
    d.text(134, 114, 'α 崩壊', { size: 12, anchor: 'start' });
    d.text(14, 144, '崩壊後', { size: 12, anchor: 'start', bold: true });
    d.circle(120, 184, 20, { cls: 'c2', fill: 'f2' });
    d.text(120, 189, 'Pb', { size: 14 });
    d.arrow(96, 184, 58, 184, { cls: 'c2' });
    d.text(76, 172, 'V', { size: 14, italic: true, cls: 'c2' });
    d.circle(236, 184, 9, { cls: 'c1', fill: 'f1' });
    d.text(236, 188, 'α', { size: 12, cls: 'c1' });
    d.arrow(250, 184, 330, 184, { cls: 'c1' });
    d.text(290, 172, 'v', { size: 14, italic: true, cls: 'c1' });
    d.text(120, 218, '鉛の原子核（質量 M）', { size: 11 });
    d.text(260, 218, 'α 線（質量 m）', { size: 11 });
    return d.svg();
  }

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ---------- 等加速度運動 ---------- */
    {
      id: 'p-mid-kin-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-kin',
      title: '追いつき・追い越しとv-tグラフ',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`まっすぐな水平道路上で、停止していた自動車 A が時刻 $t=0$ に一定の加速度 $2.0\,\mathrm{m/s^{2}}$ で発進し、速さが $12\,\mathrm{m/s}$ に達した後は、その速さで等速直線運動を続ける。時刻 $t=0$ のとき、A の $16\,\mathrm{m}$ 後方を A と同じ向きに一定の速さ $10\,\mathrm{m/s}$ で走っていたバイク B は、そのまま等速で走り続ける。図は A, B の速さ $v$ と時刻 $t$ の関係である。自動車とバイクは大きさを無視し、同じ直線上を進むものとする。`,
      fig: figKin(),
      parts: [
        { label: '(1)', q: R`B が A に最初に追いつく（並ぶ）時刻は $t=\boxed{\ \ }\,\mathrm{s}$ である。`, type: 'num', answer: 2, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`その後、B が A の前方にいる間に、A と B の距離が最大になる時刻は $t=\boxed{\ \ }\,\mathrm{s}$ である。`, type: 'num', answer: 5, rel: 0.02, unit: 's' },
        { label: '(3)', q: R`(2) のときの A と B の距離は何 $\mathrm{m}$ か。`, type: 'num', answer: 9, rel: 0.02, unit: 'm' },
        { label: '(4)', q: R`A が B に再び追いつく（並ぶ）時刻は $t=\boxed{\ \ }\,\mathrm{s}$ である。`, type: 'num', answer: 10, rel: 0.02, unit: 's' }
      ],
      solution: [
        {
          t: 'v-t グラフから A の運動を 2 つの区間に分ける',
          m: [R`0 \le t \le 6:\quad v_{A} = 2.0\,t,\qquad x_{A} = \frac{1}{2}\times 2.0\,t^{2} = t^{2}`,
              R`t \ge 6:\quad v_{A} = 12,\qquad x_{A} = 36 + 12\,(t-6)`],
          n: R`$v_{A}=2.0\,t=12$ より、A は $t=6.0\,\mathrm{s}$ で $12\,\mathrm{m/s}$ に達します。その間に進む距離は $\frac{1}{2}\times 2.0\times 6.0^{2}=36\,\mathrm{m}$ です。以後は等速直線運動です。位置 $x$ は、$t=0$ の A の位置を原点、進行方向を正としています。`,
          easy: R`v-t グラフでは、**傾きが加速度**、**グラフと横軸にはさまれた面積が進んだ距離**を表します。A のグラフは原点から傾き $2.0$ の直線で $t=6$ まで上がり、そこから水平になります。$t=6$ までの面積は三角形で $\frac{1}{2}\times 6\times 12=36$ です。`,
          lv: 1
        },
        {
          t: 'B の位置を式にする',
          m: R`x_{B} = -16 + 10\,t`,
          n: R`B は $t=0$ に A の $16\,\mathrm{m}$ 後方（$x=-16$）にいて、一定の速さ $10\,\mathrm{m/s}$ で進むので、このように表せます。2 台が「並ぶ」とは $x_{A}=x_{B}$ のことです。`,
          easy: R`「追いつく」「並ぶ」は、2 台の位置が等しい（$x_{A}=x_{B}$）という意味です。位置を時刻の式で表しておけば、あとは方程式を解くだけになります。`,
          lv: 2
        },
        {
          t: '最初に追いつく時刻（(1)）',
          m: [R`t^{2} = -16 + 10\,t \;\Longrightarrow\; t^{2} - 10t + 16 = 0`,
              R`(t-2)(t-8) = 0 \;\Longrightarrow\; t = 2.0,\ 8.0`],
          n: R`$t=8.0\,\mathrm{s}$ は A がすでに等速になった後の時刻で、$x_{A}=t^{2}$ が使える範囲 $0\le t\le 6$ の外です。範囲内の解は $t=2.0\,\mathrm{s}$ です。`,
          pro: R`式を立てるときは「使える時刻の範囲」を必ず確認します。範囲外の解は不適です（今回の $t=8$）。`,
          lv: 1
        },
        {
          t: '距離が最大になる時刻と、そのときの距離（(2)(3)）',
          m: [R`v_{A} = v_{B} \;\Longrightarrow\; 2.0\,t = 10 \;\Longrightarrow\; t = 5.0\,\mathrm{s}`,
              R`x_{B}-x_{A} = (-16 + 10\times 5.0) - 5.0^{2} = 9.0\,\mathrm{m}`],
          n: R`$t=2$ のあと A は加速しますが、$v_{A}<v_{B}$ の間は B が A を引き離し、$v_{A}>v_{B}$ になると距離は縮まります。したがって、速さが等しくなる $t=5.0\,\mathrm{s}$ に距離が最大になります。図で 2 本の線にはさまれた三角形の面積 $\frac{1}{2}\times 3\times 6=9\,\mathrm{m}$ からも確かめられます。`,
          easy: R`B が A に並んだ直後は B の方が速いので、距離は広がっていきます。A がだんだん加速して B と**同じ速さになった瞬間**が、いちばん離れた瞬間です（それ以後は A の方が速く、距離は縮みます）。図の色つきの三角形の面積が、その間に広がった距離（$9\,\mathrm{m}$）です。`,
          fig: figKinSol(),
          pro: R`「速さが等しい瞬間に距離が極値」は追いつき問題の定石です。v-t グラフの面積で差を求めると速い。`,
          lv: 1
        },
        {
          t: 'A が再び追いつく時刻（(4)）',
          m: [R`t \ge 6:\quad x_{A} = 36 + 12\,(t-6) = 12t - 36`,
              R`12t - 36 = 10t - 16 \;\Longrightarrow\; t = 10\,\mathrm{s}`],
          n: R`今度は A が等速になった後なので $x_{A}=36+12(t-6)$ を使います。前に出てきた $t=8$ を $x_{A}=t^{2}$ に代入しても A は $t=6$ 以降は加速していないので、この解は成り立ちません。`,
          lv: 1
        }
      ],
      tags: ['v-tグラフ', '追いつき', '等加速度直線運動']
    },

    /* ---------- 落体の運動 ---------- */
    {
      id: 'p-mid-fall-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-fall',
      title: '崖から斜め上に投げた小球',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`高さ $14.7\,\mathrm{m}$ の崖の上の端から、水平方向と $30\degree$ の角をなす斜め上向きに、小球を速さ $19.6\,\mathrm{m/s}$ で投げ出した。小球は崖の下の水平な地面に落ちた。空気の抵抗は無視でき、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$、$\sqrt{3}=1.73$ とする。`,
      fig: figFall(),
      parts: [
        { label: '(1)', q: R`小球が最高点に達するのは、投げ出してから何秒後か。`, type: 'num', answer: 1, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`最高点の地面からの高さは何 $\mathrm{m}$ か。`, type: 'num', answer: 19.6, rel: 0.02, unit: 'm' },
        { label: '(3)', q: R`小球が地面に達するのは、投げ出してから何秒後か。`, type: 'num', answer: 3, rel: 0.02, unit: 's' },
        { label: '(4)', q: R`落下点は、崖の真下の点から水平方向に何 $\mathrm{m}$ の位置か。`, type: 'num', answer: 50.9, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: '初速度を水平成分と鉛直成分に分解する',
          m: [R`v_{0x} = 19.6\cos 30\degree = 9.8\sqrt{3} \approx 17.0\,\mathrm{m/s}`,
              R`v_{0y} = 19.6\sin 30\degree = 9.8\,\mathrm{m/s}`],
          n: R`水平方向は力がはたらかないので**等速直線運動**、鉛直方向は重力だけなので**加速度 $g$（下向き）の等加速度運動**です。2 つの方向を別々に考えます。`,
          easy: R`斜めに投げたボールの運動は、「横方向」と「縦方向」に分けると簡単になります。横方向には押す力がないので、速さは変わりません。縦方向は重力で、上向きに投げた分が少しずつ減り、やがて下向きになります。初速度の斜めの矢印を、横と縦の 2 本の矢印に分けて考えます（$\cos$ が横成分、$\sin$ が縦成分）。`,
          lv: 1
        },
        {
          t: '位置と速度を時刻の式で表す',
          m: [R`x = v_{0x}\,t,\qquad y = h + v_{0y}\,t - \frac{1}{2}gt^{2}`,
              R`v_{y} = v_{0y} - gt`],
          n: R`崖の真下の地面の点を原点とし、水平を $x$、鉛直上向きを $y$ とします（$h=14.7\,\mathrm{m}$）。`,
          lv: 2
        },
        {
          t: '最高点（(1)(2)）',
          m: [R`v_{y} = 9.8 - 9.8\,t = 0 \;\Longrightarrow\; t_{1} = 1.0\,\mathrm{s}`,
              R`H = h + \frac{v_{0y}^{2}}{2g} = 14.7 + \frac{9.8^{2}}{2\times 9.8} = 14.7 + 4.9 = 19.6\,\mathrm{m}`],
          n: R`最高点では鉛直方向の速度が $0$ になります（水平方向の速度は残っています）。`,
          pro: R`最高点の高さは $h+\dfrac{v_{0y}^{2}}{2g}$。時間を使わずに $v^{2}-v_{0}^{2}=-2g\,\Delta y$ で出せます。`,
          lv: 1
        },
        {
          t: '地面に達する時刻（(3)）',
          m: [R`0 = 14.7 + 9.8\,t - 4.9\,t^{2}`,
              R`t^{2} - 2t - 3 = 0 \;\Longrightarrow\; (t-3)(t+1) = 0 \;\Longrightarrow\; t = 3.0\,\mathrm{s}`],
          n: R`地面は $y=0$ です。$t>0$ の解を選びます（$t=-1$ は不適）。両辺を $-4.9$ で割ると整理できます。`,
          easy: R`「地面に落ちる」は「高さ $y$ が $0$ になる」ということです。$y$ の式に $y=0$ を入れると、$t$ についての 2 次方程式になります。時刻は正なので、$t=-1$ は捨てて $t=3.0$ を選びます。`,
          lv: 1
        },
        {
          t: '落下点までの水平距離（(4)）',
          m: R`x = v_{0x}\,t = 9.8\sqrt{3}\times 3.0 = 29.4\sqrt{3} \approx 29.4\times 1.73 \approx 50.9\,\mathrm{m}`,
          n: R`水平方向は等速なので、落下までの時間 $3.0\,\mathrm{s}$ に水平成分の速さをかけます。`,
          pro: R`水平到達距離は「水平方向の速さ × 滞空時間」。滞空時間は鉛直方向だけで決まります。`,
          lv: 1
        }
      ],
      tags: ['斜方投射', '放物運動', '最高点']
    },

    /* ---------- 剛体 ---------- */
    {
      id: 'p-mid-rigid-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-rigid',
      title: '壁に立てかけたはしご',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`長さ $5.0\,\mathrm{m}$、質量 $10\,\mathrm{kg}$ の一様なはしご AB を、図のように、なめらかな鉛直の壁に立てかけ、あらい水平な床の上に置いた。上端 B は床から $4.0\,\mathrm{m}$ の高さで壁に接し、下端 A は壁から $3.0\,\mathrm{m}$ 離れている。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、はしごと床の間の静止摩擦係数を $\mu$ とする。はしごは静止している。`,
      fig: figLadder(),
      parts: [
        { label: '(1)', q: R`床がはしごに及ぼす垂直抗力 $N_{A}$ の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 98, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`壁がはしごに及ぼす垂直抗力 $N_{B}$ の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 36.75, rel: 0.02, unit: 'N' },
        { label: '(3)', q: R`はしごがすべり出さないためには、$\mu$ はいくら以上でなければならないか。`, type: 'num', answer: 0.375, rel: 0.02 },
        { label: '(4)', q: R`$\mu=0.50$ とする。質量 $20\,\mathrm{kg}$ の人が、A から $s\,[\mathrm{m}]$ はなれたはしご上の点まで登ったとき、はしごはすべり出す寸前になった。$s$ は何 $\mathrm{m}$ か（人は質点とみなす）。`, type: 'num', answer: 3.75, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: 'はしごにはたらく力を図示する',
          n: R`はしごにはたらく力は、重心 G の重力 $mg$（下向き）、床からの垂直抗力 $N_{A}$（上向き）と静止摩擦力 $f$（壁の方向）、壁からの垂直抗力 $N_{B}$（床と平行、壁から離れる向き）の 4 つです。壁はなめらかなので、B には摩擦力がありません。`,
          easy: R`静止している物体は、**力のつり合い**（上下・左右の力の和がそれぞれ $0$）だけでなく、**回転しない条件**（力のモーメントの和が $0$）も満たします。大きさのある物体（剛体）では、力の「向きと大きさ」に加えて、力が「どこにはたらくか」が大切になります。`,
          lv: 1
        },
        {
          t: '鉛直方向のつり合い（(1)）',
          m: R`N_{A} - mg = 0 \;\Longrightarrow\; N_{A} = 10\times 9.8 = 98\,\mathrm{N}`,
          n: R`鉛直方向の力は $N_{A}$（上向き）と $mg$（下向き）だけです（壁の垂直抗力は水平、摩擦力も水平）。`,
          lv: 1
        },
        {
          t: 'A のまわりの力のモーメントのつり合い（(2)）',
          m: [R`N_{B}\times 4.0 = mg\times 1.5`,
              R`N_{B} = \frac{98\times 1.5}{4.0} = 36.75\,\mathrm{N}`],
          n: R`未知の力 $N_{A}$, $f$ の作用線が通る点 A を回転軸に選ぶと、これらのモーメントが $0$ になり、式が簡単になります。重心 G ははしごの中点なので、A から水平に $1.5\,\mathrm{m}$ です。$N_{B}$ の腕の長さは A から B までの高さ $4.0\,\mathrm{m}$ です。`,
          easy: R`**力のモーメント**は「力 × 腕の長さ」です。腕の長さは、回転軸から力の作用線までの**垂直な距離**です。$N_{B}$ は水平なので腕は高さ $4.0\,\mathrm{m}$、重力は鉛直なので腕は軸から重心までの水平距離 $1.5\,\mathrm{m}$ です。$N_{B}$ ははしごを時計回りに、重力は反時計回りに回そうとするので、この 2 つがつり合います。`,
          pro: R`軸は「未知の力が多く通る点」に取る。ここでは床の A（$N_{A}$ と $f$ の 2 つが消える）。`,
          lv: 1
        },
        {
          t: '水平方向のつり合いと、すべらない条件（(3)）',
          m: [R`f = N_{B} = 36.75\,\mathrm{N}`,
              R`f \le \mu N_{A} \;\Longrightarrow\; \mu \ge \frac{36.75}{98} = 0.375`],
          n: R`水平方向の力は $f$ と $N_{B}$ だけなので $f=N_{B}$ です。静止摩擦力は最大 $\mu N_{A}$ までなので、$f$ がそれ以下なら静止できます。`,
          lv: 1
        },
        {
          t: '人が登った場合（(4)）',
          m: [R`N_{A}' = (10+20)\times 9.8 = 294\,\mathrm{N}`,
              R`N_{B}'\times 4.0 = mg\times 1.5 + Mg\times(s\cos\theta),\quad \cos\theta = \frac{3.0}{5.0} = 0.60`,
              R`N_{B}' = \frac{147 + 196\times 0.60\,s}{4.0} = 36.75 + 29.4\,s`,
              R`f = N_{B}' = \mu N_{A}' = 0.50\times 294 = 147 \;\Longrightarrow\; s = \frac{147-36.75}{29.4} = 3.75\,\mathrm{m}`],
          n: R`人（質量 $M=20\,\mathrm{kg}$）が加わった全体で、鉛直の力のつり合いから $N_{A}'=(m+M)g$ です。人の位置ははしごに沿って A から $s$ のところなので、A からの水平距離は $s\cos\theta=0.60\,s$ です（$\cos\theta=\dfrac{3.0}{5.0}$）。すべり出す寸前は $f=\mu N_{A}'$ です。`,
          easy: R`人が登ると、はしごは重くなって床を強く押すので最大摩擦力は大きくなります。一方、人が高いところに登るほど、はしごを壁へ回そうとする力のモーメントが増えて、壁を押す力 $N_{B}$（＝摩擦力 $f$）も大きくなります。この 2 つが等しくなる位置が「すべり出す寸前」です。`,
          pro: R`すべり出す寸前は「摩擦力 = 最大摩擦力」を等式で使う。$s=3.75\,\mathrm{m}<5.0\,\mathrm{m}$ なので、頂上に着く前にすべります。`,
          lv: 1
        }
      ],
      tags: ['力のモーメント', 'はしご', '静止摩擦力']
    },

    /* ---------- 運動方程式 ---------- */
    {
      id: 'p-mid-eom-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-eom',
      title: '滑車でつながれた 2 物体',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`図のように、水平なあらい台の上に質量 $M=5.0\,\mathrm{kg}$ の物体 A を置き、軽い糸の一端をつけて、台の端にある軽くてなめらかな定滑車を通し、他端に質量 $m=3.0\,\mathrm{kg}$ の物体 B をつり下げた。B は床から高さ $h=0.80\,\mathrm{m}$ のところにある。A と台の間の動摩擦係数を $\mu'=0.20$、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。糸は伸び縮みしない。A, B を静かに放すと、A は台の上をすべり出し、B は下降した。台は十分に長く、A は滑車に達しないものとする。`,
      fig: figPulley(),
      parts: [
        { label: '(1)', q: R`A, B の加速度の大きさ $a$ は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 2.45, rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`糸の張力の大きさ $T$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 22.05, rel: 0.02, unit: 'N' },
        { label: '(3)', q: R`B が床に達する直前の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 1.98, rel: 0.02, unit: 'm/s' },
        { label: '(4)', q: R`B が床に達すると、B は止まり、糸はたるむ。その後、A はさらに台の上を何 $\mathrm{m}$ すべって止まるか。`, type: 'num', answer: 1, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: '物体ごとに力を図示し、運動方程式を立てる',
          m: [R`\text{A（水平）}:\quad Ma = T - \mu' Mg`,
              R`\text{B（鉛直・下向きを正）}:\quad ma = mg - T`],
          n: R`A には、糸の張力 $T$（右向き）、動摩擦力 $\mu' N=\mu' Mg$（左向き）がはたらきます（鉛直方向は重力と垂直抗力がつり合うので $N=Mg$）。B には重力 $mg$（下向き）と張力 $T$（上向き）がはたらきます。糸が伸びないので A, B の加速度の大きさは等しく $a$ です。`,
          easy: R`運動方程式 $ma=F$ は「物体ごとに」立てます。それぞれの物体にはたらく力を矢印で全部かき出し、**加速する向きを正**として、（正の向きの力の和）$=$（質量）×（加速度）とします。糸でつながれた A と B は、同じ速さで動くので、加速度の大きさは同じ $a$ です。糸が引く力 $T$ は A にとっては右向き、B にとっては上向きで、大きさは同じです。`,
          lv: 1
        },
        {
          t: '連立して $a$ と $T$ を求める（(1)(2)）',
          m: [R`(M+m)\,a = mg - \mu' Mg`,
              R`a = \frac{(m-\mu' M)\,g}{M+m} = \frac{(3.0-0.20\times 5.0)\times 9.8}{5.0+3.0} = 2.45\,\mathrm{m/s^{2}}`,
              R`T = M(a+\mu' g) = 5.0\times(2.45 + 0.20\times 9.8) = 22.05\,\mathrm{N}`],
          n: R`2 つの式を足すと $T$ が消えて、$a$ が求まります。$T$ は A の式から求め、B の式 $T=m(g-a)=3.0\times 7.35=22.05\,\mathrm{N}$ で確かめられます。`,
          pro: R`糸でつながれた物体は「全体を 1 つの物体」とみると、$(M+m)a=$（動かす力）$-$（逆らう力）で $a$ が一発で出ます。張力はそのあと 1 つの物体で。`,
          lv: 1
        },
        {
          t: 'B が床に達する直前の速さ（(3)）',
          m: R`v^{2} = 2ah = 2\times 2.45\times 0.80 = 3.92 \;\Longrightarrow\; v = \sqrt{3.92} \approx 1.98\,\mathrm{m/s}`,
          n: R`加速度が一定なので、初速度 $0$ の等加速度直線運動の式 $v^{2}-0=2ah$ を使います。`,
          lv: 1
        },
        {
          t: 'B が着地した後の A の運動（(4)）',
          m: [R`Ma' = -\mu' Mg \;\Longrightarrow\; a' = -\mu' g = -1.96\,\mathrm{m/s^{2}}`,
              R`0^{2} - v^{2} = 2a'd \;\Longrightarrow\; d = \frac{3.92}{2\times 1.96} = 1.0\,\mathrm{m}`],
          n: R`B が止まると糸はたるんで張力は $0$ になります。A には動摩擦力だけがはたらくので、A は減速します。速度の向きに $a'$ を負とした等加速度直線運動で、止まるまでの距離 $d$ を求めます。`,
          easy: R`糸がたるむと、A を引っぱる力がなくなって、A には「ブレーキ」の摩擦力だけが残ります。そこで A は一定の割合で遅くなっていき、やがて止まります。このとき**仕事とエネルギー**で考えることもできます。運動エネルギー $\frac{1}{2}Mv^{2}$ が、摩擦力がする仕事 $\mu' Mg\,d$ に全部使われるので、$\frac{1}{2}Mv^{2}=\mu' Mg\,d$ です。`,
          lv: 1
        }
      ],
      tags: ['運動方程式', '糸でつながれた物体', '動摩擦力']
    },

    /* ---------- 運動量と力積 ---------- */
    {
      id: 'p-mid-momentum-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-momentum',
      title: '反発係数のある 2 球の衝突',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`なめらかな水平面上の $x$ 軸に沿って、質量 $2.0\,\mathrm{kg}$ の小球 A が速さ $6.0\,\mathrm{m/s}$ で $x$ 軸の正の向きに進み、静止していた質量 $4.0\,\mathrm{kg}$ の小球 B に正面衝突した。A と B の間の反発係数（はねかえり係数）は $0.60$ である。$x$ 軸の正の向きを速度の正の向きとし、衝突後の A, B の速度をそれぞれ $v_{A}'$, $v_{B}'$ とする。`,
      fig: figCollision(),
      parts: [
        { label: '(1)', q: R`衝突後の A の速度 $v_{A}'$ は何 $\mathrm{m/s}$ か。負のときは符号もつけて答えよ。`, type: 'num', answer: -0.4, rel: 0.03, unit: 'm/s', hint: R`例: -0.5` },
        { label: '(2)', q: R`衝突後の B の速度 $v_{B}'$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 3.2, rel: 0.02, unit: 'm/s' },
        { label: '(3)', q: R`この衝突で失われた力学的エネルギーは何 $\mathrm{J}$ か。`, type: 'num', answer: 15.36, rel: 0.03, unit: 'J' },
        { label: '(4)', q: R`衝突の継続時間が $2.0\times 10^{-2}\,\mathrm{s}$ であったとする。衝突の間に、B が A から受けた力の平均の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 640, rel: 0.02, unit: 'N' }
      ],
      solution: [
        {
          t: '運動量保存則',
          m: [R`m_{A}v_{A} + m_{B}v_{B} = m_{A}v_{A}' + m_{B}v_{B}'`,
              R`2.0\times 6.0 + 0 = 2.0\,v_{A}' + 4.0\,v_{B}' \;\Longrightarrow\; v_{A}' + 2\,v_{B}' = 6.0`],
          n: R`衝突の間にはたらく力は、A と B が互いに及ぼし合う力（内力）だけです。水平面はなめらかで、外から水平方向の力がはたらかないので、2 球の運動量の和は衝突の前後で変わりません。`,
          easy: R`**運動量**は「質量 × 速度」です。A が B を押す力と、B が A を押し返す力は、大きさが同じで向きが逆です。だから、運動量が A から B へ「受け渡される」ことはあっても、2 つの合計は変わりません。これが運動量保存則です。向きのある量なので、$x$ 軸の正の向きを正として符号をつけます。`,
          lv: 1
        },
        {
          t: '反発係数の式',
          m: R`e = -\frac{v_{A}' - v_{B}'}{v_{A} - v_{B}} \;\Longrightarrow\; v_{B}' - v_{A}' = e\,(v_{A}-v_{B}) = 0.60\times 6.0 = 3.6`,
          n: R`反発係数 $e$ は「衝突後に離れ合う速さ」と「衝突前に近づき合う速さ」の比です。保存則だけでは未知数が 2 つに対して式が 1 つなので、もう 1 つの式としてこれを使います。`,
          easy: R`(離れる速さ) $=e\times$(近づく速さ) と覚えます。近づき合う速さは $6.0-0=6.0\,\mathrm{m/s}$ です。$e=1$ なら離れる速さは近づく速さと同じ（はずむ衝突）、$e=0$ なら離れずにくっついて進みます。`,
          lv: 1
        },
        {
          t: '連立して速度を求める（(1)(2)）',
          m: [R`3v_{B}' = 6.0 + 3.6 \;\Longrightarrow\; v_{B}' = 3.2\,\mathrm{m/s}`,
              R`v_{A}' = v_{B}' - 3.6 = -0.40\,\mathrm{m/s}`],
          n: R`$v_{A}'<0$ なので、A は衝突後に $x$ 軸の負の向き（もとの向きと逆）に、$0.40\,\mathrm{m/s}$ で進みます。軽い A は、重い B にはね返されたことになります。`,
          lv: 1
        },
        {
          t: '失われた力学的エネルギー（(3)）',
          m: [R`K_{\text{前}} = \frac{1}{2}\times 2.0\times 6.0^{2} = 36\,\mathrm{J}`,
              R`K_{\text{後}} = \frac{1}{2}\times 2.0\times 0.40^{2} + \frac{1}{2}\times 4.0\times 3.2^{2} = 0.16 + 20.48 = 20.64\,\mathrm{J}`,
              R`K_{\text{前}} - K_{\text{後}} = 15.36\,\mathrm{J}`],
          n: R`$e<1$ の衝突では、力学的エネルギーが減ります（熱や音になります）。減った分が失われたエネルギーです。`,
          pro: R`$e=1$（弾性衝突）なら $K_{\text{前}}=K_{\text{後}}$。検算に使えます。`,
          lv: 1
        },
        {
          t: '力積と運動量の関係（(4)）',
          m: R`m_{B}v_{B}' - m_{B}\times 0 = F\,\Delta t \;\Longrightarrow\; F = \frac{4.0\times 3.2}{2.0\times 10^{-2}} = 640\,\mathrm{N}`,
          n: R`物体の運動量の変化は、その物体が受けた**力積**（力 × 時間）に等しくなります。B は衝突の間、A からの力だけを受けるので、これが B の運動量の変化になります。`,
          easy: R`ぶつかる時間はごく短いので、力は時間とともに変化しますが、「平均の力 × 時間」で力積を表します。B は $0$ から $m_{B}v_{B}'=12.8\,\mathrm{kg\cdot m/s}$ の運動量になりました。この変化を $\Delta t=0.020\,\mathrm{s}$ で割ると、平均の力になります。`,
          lv: 1
        }
      ],
      tags: ['運動量保存', '反発係数', '力積']
    },

    /* ---------- 仕事と力学的エネルギー ---------- */
    {
      id: 'p-mid-energy-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-energy',
      title: '斜面・あらい面・ばねの運動',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`図のように、傾き $30\degree$ のなめらかな斜面が、水平面の点 A でなめらかにつながっている。水平面の A から $1.0\,\mathrm{m}$ の区間 AB はあらく、動摩擦係数は $0.40$ である。B より先の水平面はなめらかで、その先に、ばね定数 $200\,\mathrm{N/m}$ の軽いばねの一端が壁に固定されている。質量 $0.50\,\mathrm{kg}$ の小物体を、斜面上の水平面からの高さ $1.2\,\mathrm{m}$ の点から静かにすべらせた。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、小物体の大きさ、空気抵抗は無視する。`,
      fig: figIncline(),
      parts: [
        { label: '(1)', q: R`小物体が A を通過するときの速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 4.85, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`小物体が B を通過するときの速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 3.96, rel: 0.02, unit: 'm/s' },
        { label: '(3)', q: R`ばねの縮みは最大で何 $\mathrm{m}$ になるか。`, type: 'num', answer: 0.198, rel: 0.02, unit: 'm' },
        { label: '(4)', q: R`小物体はばねに押し返され、AB 間を通って斜面をのぼった。最高点の水平面からの高さは何 $\mathrm{m}$ か。`, type: 'num', answer: 0.4, rel: 0.03, unit: 'm' }
      ],
      solution: [
        {
          t: '斜面をすべり下りる（(1)）',
          m: [R`mgh = \frac{1}{2}mv_{A}^{2}`,
              R`v_{A} = \sqrt{2gh} = \sqrt{2\times 9.8\times 1.2} = \sqrt{23.52} \approx 4.85\,\mathrm{m/s}`],
          n: R`斜面はなめらかなので、垂直抗力は仕事をせず、力学的エネルギー（位置エネルギー + 運動エネルギー）が保存されます。高さ $h$ がわかっているので、斜面の角度 $30\degree$ は使いません。`,
          easy: R`物体が高いところから下りてくると、位置エネルギー $mgh$ が減って、そのぶん運動エネルギー $\frac{1}{2}mv^{2}$ が増えます。摩擦がなければこの 2 つの和は変わりません（**力学的エネルギー保存則**）。斜面がゆるやかでも急でも、同じ高さを下りれば同じ速さになります。`,
          pro: R`高さがわかっていれば角度は不要。「角度は計算に使わない」と見抜けるのが速い。`,
          lv: 1
        },
        {
          t: 'あらい区間 AB を通過する（(2)）',
          m: [R`\frac{1}{2}mv_{B}^{2} - \frac{1}{2}mv_{A}^{2} = -\mu' mg\times 1.0`,
              R`v_{B}^{2} = 23.52 - 2\times 0.40\times 9.8\times 1.0 = 15.68 \;\Longrightarrow\; v_{B} \approx 3.96\,\mathrm{m/s}`],
          n: R`AB 間では、動摩擦力 $\mu' mg$ が、運動と逆向きに距離 $1.0\,\mathrm{m}$ の間、負の仕事をします。（運動エネルギーの変化）$=$（力がした仕事）の関係を使います。`,
          easy: R`摩擦力は運動をじゃまする向きにはたらくので、「負の仕事」をして、運動エネルギーを減らします。減る量は「摩擦力 × すべった距離」です。ここでは $0.40\times 0.50\times 9.8\times 1.0=1.96\,\mathrm{J}$ 減ります。`,
          lv: 1
        },
        {
          t: 'ばねを縮める（(3)）',
          m: [R`\frac{1}{2}mv_{B}^{2} = \frac{1}{2}kx^{2}`,
              R`x = v_{B}\sqrt{\frac{m}{k}} = 3.96\times\sqrt{\frac{0.50}{200}} = 3.96\times 0.050 \approx 0.198\,\mathrm{m}`],
          n: R`ばねのあたりはなめらかなので、縮みが最大（速さが $0$）になる瞬間、運動エネルギーがすべて弾性エネルギー $\frac{1}{2}kx^{2}$ に変わります。`,
          lv: 1
        },
        {
          t: '押し返されて斜面をのぼる（(4)）',
          m: [R`\frac{1}{2}mu^{2} = \frac{1}{2}mv_{B}^{2} - \mu' mg\times 1.0 = 3.92 - 1.96 = 1.96\,\mathrm{J}`,
              R`mgh' = 1.96 \;\Longrightarrow\; h' = \frac{1.96}{0.50\times 9.8} = 0.40\,\mathrm{m}`],
          n: R`ばねが元の長さにもどった後、小物体は速さ $v_{B}$ で左向きに B を通過します。ここから A までもう一度あらい区間で $1.96\,\mathrm{J}$ を失い、A での運動エネルギー（$u$ は A での速さ）が斜面をのぼる高さに変わります。`,
          pro: R`全過程をまとめると、AB を 2 回通ったので $mgh' = mgh - 2\mu' mg\times 1.0$。よって $h' = 1.2 - 2\times 0.40\times 1.0 = 0.40\,\mathrm{m}$。`,
          lv: 1
        }
      ],
      tags: ['力学的エネルギー保存', '摩擦力の仕事', '弾性エネルギー']
    },

    /* ---------- 円運動 ---------- */
    {
      id: 'p-mid-circular-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-circular',
      title: '鉛直面内の円運動（糸）',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`図のように、長さ $L=0.80\,\mathrm{m}$ の軽い糸の一端を点 O に固定し、他端に質量 $m=0.50\,\mathrm{kg}$ の小球をつけて、鉛直面内で運動させる。最下点で、小球に水平方向の初速度 $v_{0}=7.0\,\mathrm{m/s}$ を与えたところ、小球は最高点 P を通って円運動を続けた。空気抵抗は無視でき、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figVertCircle(),
      parts: [
        { label: '(1)', q: R`最下点で、小球が糸から受ける張力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 35.525, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`最高点 P での小球の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 4.2, rel: 0.02, unit: 'm/s' },
        { label: '(3)', q: R`最高点 P で、小球が糸から受ける張力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 6.125, rel: 0.03, unit: 'N' },
        { label: '(4)', q: R`小球が最高点まで糸をたるませずに円運動を続けるためには、最下点での初速度 $v_{0}$ は何 $\mathrm{m/s}$ 以上でなければならないか。`, type: 'num', answer: 6.261, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        {
          t: '最下点での円運動の方程式（(1)）',
          m: [R`m\frac{v_{0}^{2}}{L} = T_{0} - mg`,
              R`T_{0} = mg + m\frac{v_{0}^{2}}{L} = 0.50\times 9.8 + 0.50\times\frac{7.0^{2}}{0.80} = 4.9 + 30.6 \approx 35.5\,\mathrm{N}`],
          n: R`円運動をする小球には、円の中心 O に向かう加速度 $\dfrac{v^{2}}{L}$ があります。そこで、**中心向きを正**として、運動方程式 $m\dfrac{v^{2}}{L}=$（中心向きの力の和）を立てます。最下点では中心 O は真上なので、張力 $T_{0}$ が正、重力 $mg$ が負です。`,
          easy: R`円運動では、速さが一定でも向きが変わり続けるので、いつも中心に向かう加速度（**向心加速度**）$\dfrac{v^{2}}{r}$ があります。この加速度を生む力は、「中心に向かう向きの力の合計」です。最下点では、中心 O が上にあるので、張力（上向き）から重力（下向き）を引いた分が向心力になります。静止しているときの張力 $mg$ より、動いているときの方が大きくなる点に注目しましょう。`,
          lv: 1
        },
        {
          t: '力学的エネルギー保存則で最高点の速さを求める（(2)）',
          m: [R`\frac{1}{2}mv_{0}^{2} = \frac{1}{2}mv^{2} + mg\,(2L)`,
              R`v^{2} = v_{0}^{2} - 4gL = 49 - 4\times 9.8\times 0.80 = 17.64 \;\Longrightarrow\; v = 4.2\,\mathrm{m/s}`],
          n: R`張力は運動の向きと常に垂直なので仕事をしません。したがって力学的エネルギーが保存されます。最下点から最高点までの高さの差は $2L$ です。`,
          lv: 1
        },
        {
          t: '最高点での円運動の方程式（(3)）',
          m: [R`m\frac{v^{2}}{L} = T + mg`,
              R`T = m\frac{v^{2}}{L} - mg = 0.50\times\frac{17.64}{0.80} - 4.9 = 11.025 - 4.9 \approx 6.1\,\mathrm{N}`],
          n: R`最高点では中心 O は真下なので、向心力は下向きです。張力 $T$ も重力 $mg$ もどちらも下向き（中心向き）にはたらくので、どちらも正になります。`,
          pro: R`最低点・最高点の向きに注意。最高点は「$T+mg=m\dfrac{v^{2}}{L}$」。$T>0$ なら糸はたるんでいません。`,
          lv: 1
        },
        {
          t: '糸がたるまない条件（(4)）',
          m: [R`T \ge 0 \;\Longrightarrow\; m\frac{v^{2}}{L} \ge mg \;\Longrightarrow\; v^{2} \ge gL`,
              R`v_{0}^{2} = v^{2} + 4gL \ge 5gL \;\Longrightarrow\; v_{0} \ge \sqrt{5gL} = \sqrt{39.2} \approx 6.26\,\mathrm{m/s}`],
          n: R`糸は引くことしかできないので、張力は負になれません。最高点で $T=0$（重力だけが向心力）となる速さが限界です。これを (2) の関係に戻して、最下点の速さを求めます。$v_{0}=7.0\,\mathrm{m/s}$ はこれを満たしています。`,
          easy: R`最高点で糸がたるむのは、小球の速さが遅くて、円周に沿って曲がるのに必要な力（向心力）が重力だけで足りてしまう（それ以上の力で引く必要がない）ときです。ちょうど足りる状態が $mg=m\dfrac{v^{2}}{L}$、つまり $v^{2}=gL$ です。`,
          pro: R`鉛直円運動（糸）を最高点まで回り切る条件は、最高点で $v \ge \sqrt{gL}$、最下点で $v_{0} \ge \sqrt{5gL}$。この 2 つは公式として暗記してよい。`,
          lv: 1
        }
      ],
      tags: ['鉛直円運動', '向心力', '張力']
    },

    /* ---------- 単振動 ---------- */
    {
      id: 'p-mid-shm-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-shm',
      title: 'ばね振り子の周期と速さ',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`図のように、ばね定数 $k=40\,\mathrm{N/m}$ の軽いばねの上端を天井に固定し、下端に質量 $m=0.40\,\mathrm{kg}$ のおもりをつるした。おもりをつり合いの位置から鉛直下向きに $0.050\,\mathrm{m}$ 引き下げて静かに放したところ、おもりは鉛直方向に単振動をした。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$、円周率を $\pi=3.14$ とし、ばねは常にフックの法則に従い、空気抵抗は無視できるものとする。`,
      fig: figSpringPend(),
      parts: [
        { label: '(1)', q: R`つり合いの位置での、ばねの自然長からの伸びは何 $\mathrm{m}$ か。`, type: 'num', answer: 0.098, rel: 0.02, unit: 'm' },
        { label: '(2)', q: R`単振動の周期は何 $\mathrm{s}$ か。`, type: 'num', answer: 0.628, rel: 0.02, unit: 's' },
        { label: '(3)', q: R`おもりの最大の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 0.5, rel: 0.02, unit: 'm/s' },
        { label: '(4)', q: R`おもりがつり合いの位置より $0.030\,\mathrm{m}$ 上方を通過するときの速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 0.4, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        {
          t: 'つり合いの位置（(1)）',
          m: R`kx_{0} = mg \;\Longrightarrow\; x_{0} = \frac{mg}{k} = \frac{0.40\times 9.8}{40} = 0.098\,\mathrm{m}`,
          n: R`つり合いの位置では、おもりにはたらく重力 $mg$（下向き）とばねの弾性力 $kx_{0}$（上向き）がつり合っています。`,
          lv: 1
        },
        {
          t: 'つり合いの位置からの変位に対する運動方程式（(2)）',
          m: [R`ma = mg - k(x_{0}+x) = -kx`,
              R`\omega = \sqrt{\frac{k}{m}} = \sqrt{\frac{40}{0.40}} = 10\,\mathrm{rad/s}`,
              R`T = \frac{2\pi}{\omega} = \frac{2\times 3.14}{10} \approx 0.628\,\mathrm{s}`],
          n: R`つり合いの位置からの下向きの変位を $x$ とすると、重力 $mg$ と $kx_{0}=mg$ が打ち消し合うので、復元力は $-kx$ だけが残ります。$a=-\dfrac{k}{m}x=-\omega^{2}x$ の形なので、つり合いの位置を中心とする単振動で、角振動数は $\omega=\sqrt{\dfrac{k}{m}}$ です。`,
          easy: R`ばねにおもりをつるすと、重力と弾性力がつり合う位置（**つり合いの位置**）で止まります。そこから少しずらすと、つり合いの位置にもどそうとする力（**復元力**）が、ずれの長さに比例してはたらきます。「ずれに比例して中心に引きもどされる運動」が単振動です。重力は、つり合いの位置を決めるだけで、振動の周期には影響しません。`,
          pro: R`周期は $T=2\pi\sqrt{\dfrac{m}{k}}$。重力の有無・振幅によりません（公式をそのまま使う）。`,
          lv: 1
        },
        {
          t: '最大の速さ（(3)）',
          m: R`v_{\max} = A\omega = 0.050\times 10 = 0.50\,\mathrm{m/s}`,
          n: R`振幅は、はじめに引き下げた距離 $A=0.050\,\mathrm{m}$ です（はじめ静止していたので、そこが折り返し点）。速さが最大になるのは、つり合いの位置を通るときです。`,
          easy: R`単振動では、折り返し点（いちばん端）で速さが $0$、中心（つり合いの位置）で速さが最大になります。最大の速さは「振幅 × 角振動数」です。`,
          lv: 1
        },
        {
          t: '途中の位置での速さ（(4)）',
          m: [R`\frac{1}{2}mv^{2} + \frac{1}{2}kx^{2} = \frac{1}{2}kA^{2}`,
              R`v = \sqrt{\frac{k}{m}\,(A^{2}-x^{2})} = 10\times\sqrt{0.050^{2} - 0.030^{2}} = 10\times 0.040 = 0.40\,\mathrm{m/s}`],
          n: R`重力と弾性力による位置エネルギーを合わせて、つり合いの位置からの変位 $x$ を使って表すと、$\dfrac{1}{2}kx^{2}$ になります。したがって「運動エネルギー $+\dfrac{1}{2}kx^{2}$」が一定です（端で運動エネルギーが $0$）。上方でも下方でも、中心からの距離が同じなら速さは同じです。`,
          pro: R`$v=\omega\sqrt{A^{2}-x^{2}}$ を公式として使う。ここでは $0.050^{2}-0.030^{2}=0.040^{2}$ の 3:4:5 の関係に気づくと計算が速い。`,
          lv: 1
        }
      ],
      tags: ['単振動', 'ばね振り子', '周期']
    },

    /* ---------- 熱量と比熱 ---------- */
    {
      id: 'p-mid-heat-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-heat',
      title: '金属球と氷の熱量保存',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`熱容量 $60\,\mathrm{J/K}$ の容器に、$20\degree\mathrm{C}$ の水 $200\,\mathrm{g}$ を入れた。この水に、$100\degree\mathrm{C}$ に熱した質量 $150\,\mathrm{g}$ の金属球を入れてよくかき混ぜたところ、全体の温度が $25\degree\mathrm{C}$ になった。続いて、$0\degree\mathrm{C}$ の氷 $40\,\mathrm{g}$ を入れてよくかき混ぜたところ、氷はすべてとけ、全体の温度は $10\degree\mathrm{C}$ になった。水の比熱を $4.2\,\mathrm{J/(g\cdot K)}$ とし、熱の出入りは容器・水・金属球・氷の間だけで、外部とのやりとりはないものとする。`,
      fig: figCalorimeter(),
      parts: [
        { label: '(1)', q: R`金属の比熱は何 $\mathrm{J/(g\cdot K)}$ か。`, type: 'num', answer: 0.4, rel: 0.02, unit: 'J/(g·K)' },
        { label: '(2)', q: R`金属球を入れて $25\degree\mathrm{C}$ になったときの、容器・水・金属球を合わせた全体の熱容量は何 $\mathrm{J/K}$ か。`, type: 'num', answer: 960, rel: 0.02, unit: 'J/K' },
        { label: '(3)', q: R`氷の融解熱は、氷 $1\,\mathrm{g}$ あたり何 $\mathrm{J}$ か。`, type: 'num', answer: 318, rel: 0.02, unit: 'J/g' },
        { label: '(4)', q: R`氷 $40\,\mathrm{g}$ のかわりに、$0\degree\mathrm{C}$ の氷 $150\,\mathrm{g}$ を入れたとする（金属球を入れて $25\degree\mathrm{C}$ になった状態から）。熱平衡に達したとき、とけ残っている氷は何 $\mathrm{g}$ か。`, type: 'num', answer: 74.53, rel: 0.02, unit: 'g' }
      ],
      solution: [
        {
          t: '金属球を入れたときの熱量保存（(1)）',
          m: [R`150\times c\times(100-25) = (200\times 4.2 + 60)\times(25-20)`,
              R`11250\,c = 900\times 5 = 4500 \;\Longrightarrow\; c = 0.40\,\mathrm{J/(g\cdot K)}`],
          n: R`高温の金属球が失った熱量と、低温の水と容器が得た熱量は等しくなります（熱量保存）。質量 $m$、比熱 $c$ の物体の温度が $\Delta T$ 変わるときの熱量は $Q=mc\,\Delta T$、熱容量 $C$ の物体では $Q=C\,\Delta T$ です。`,
          easy: R`**比熱**は「物質 $1\,\mathrm{g}$ を $1\,\mathrm{K}$ 温めるのに必要な熱量」、**熱容量**は「その物体全体を $1\,\mathrm{K}$ 温めるのに必要な熱量」（$=$ 質量 × 比熱）です。熱いものと冷たいものを混ぜると、熱いものが失った熱と、冷たいものが得た熱が等しくなって、全体が同じ温度になります。`,
          lv: 1
        },
        {
          t: '全体の熱容量（(2)）',
          m: R`C = 200\times 4.2 + 60 + 150\times 0.40 = 840 + 60 + 60 = 960\,\mathrm{J/K}`,
          n: R`容器・水・金属球は同じ温度 $25\degree\mathrm{C}$ になっているので、1 つの物体とみなせます。熱容量は足し算でき、水の熱容量は $200\times 4.2=840\,\mathrm{J/K}$、金属球は $150\times 0.40=60\,\mathrm{J/K}$ です。`,
          lv: 1
        },
        {
          t: '氷を入れたときの熱量保存（(3)）',
          m: [R`960\times(25-10) = 40\,L + 40\times 4.2\times(10-0)`,
              R`14400 = 40\,L + 1680 \;\Longrightarrow\; L = 318\,\mathrm{J/g}`],
          n: R`全体（水・容器・金属球）が $25\degree\mathrm{C}\to 10\degree\mathrm{C}$ に下がる間に失った熱量が、氷に与えた熱量になります。氷は、まず $0\degree\mathrm{C}$ のままとけるのに $40L$ を吸収し、とけてできた水 $40\,\mathrm{g}$ が $0\degree\mathrm{C}\to 10\degree\mathrm{C}$ に温まるのにさらに $40\times 4.2\times 10$ を吸収します。`,
          easy: R`氷は温度が $0\degree\mathrm{C}$ のままでも、とけるときに熱を吸収します。この熱が**融解熱**（$1\,\mathrm{g}$ あたり $L$）です。とけたあとの水が温まるには、さらに別に熱が必要です。「とけるための熱」と「温まるための熱」の 2 段階に分けて考えるのがコツです。`,
          pro: R`状態変化がからむ熱量計算は「温度が変わる部分 $mc\Delta T$」と「状態が変わる部分 $mL$」を分けて足す。`,
          lv: 1
        },
        {
          t: '氷が多すぎる場合（(4)）',
          m: [R`960\times(25-0) = 24000\,\mathrm{J}`,
              R`\frac{24000}{318} \approx 75.5\,\mathrm{g} < 150\,\mathrm{g}`,
              R`150 - 75.5 \approx 74.5\,\mathrm{g}`],
          n: R`全体が $0\degree\mathrm{C}$ まで下がるときに放出する熱量は $24000\,\mathrm{J}$ で、この熱量でとける氷は約 $75.5\,\mathrm{g}$ です。入れた氷 $150\,\mathrm{g}$ はそれより多いので、すべてはとけず、全体は $0\degree\mathrm{C}$ のまま氷と水が共存します。とけ残りは約 $74.5\,\mathrm{g}$ です。`,
          easy: R`氷が少ないと、全部とけて 0 °C より高い温度になりますが、氷が多すぎると、全部とけきらないうちに熱が足りなくなって、全体が $0\degree\mathrm{C}$ のところで止まります。そこで「全体が $0\degree\mathrm{C}$ に下がるまでに出す熱」で何 $\mathrm{g}$ とけるかを先に調べます。`,
          pro: R`最初に「全部とけるか」の判定をする。$0\degree\mathrm{C}$ まで下げる熱量と、氷を全部とかす熱量 $mL$ を比べる。`,
          lv: 1
        }
      ],
      tags: ['熱量保存', '比熱', '融解熱']
    },

    /* ---------- ボイル・シャルルの法則 ---------- */
    {
      id: 'p-mid-gas-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-gas',
      title: '水銀柱で封じた空気',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`一端を閉じた、内側の断面積 $1.0\,\mathrm{cm^{2}}$、内側の長さ $60\,\mathrm{cm}$ のまっすぐなガラス管に、長さ $19\,\mathrm{cm}$ の水銀柱で空気を封じ込めた。管を水平に置いたところ、閉じた端から水銀柱までの空気柱の長さは $30\,\mathrm{cm}$、空気の温度は $300\,\mathrm{K}$ であった（図 a）。大気圧は $76\,\mathrm{cmHg}$（高さ $76\,\mathrm{cm}$ の水銀柱がおよぼす圧力）で、これは $1.0\times10^{5}\,\mathrm{Pa}$ に等しいものとする。気体定数を $8.3\,\mathrm{J/(mol\cdot K)}$ とし、封じ込めた空気は理想気体とみなす。(1)(2) では、管をゆっくり回す間も空気の温度は $300\,\mathrm{K}$ に保たれ、水銀は管から流れ出ないものとする。`,
      fig: figMercury(),
      parts: [
        { label: '(1)', q: R`管を、開口部が上になるように鉛直に立てた（図 b）。空気柱の長さ $L_{1}$ は何 $\mathrm{cm}$ か。`, type: 'num', answer: 24, rel: 0.02, unit: 'cm' },
        { label: '(2)', q: R`管を、開口部が下になるように鉛直に立てた（図 c）。空気柱の長さ $L_{2}$ は何 $\mathrm{cm}$ か。`, type: 'num', answer: 40, rel: 0.02, unit: 'cm' },
        { label: '(3)', q: R`管を水平にもどし（図 a）、空気をゆっくり加熱した。水銀柱の右端が管口に達したときの、空気の温度は何 $\mathrm{K}$ か。`, type: 'num', answer: 410, rel: 0.02, unit: 'K' },
        { label: '(4)', q: R`封じ込められている空気の物質量は何 $\mathrm{mol}$ か。`, type: 'num', answer: 1.2e-3, rel: 0.02, unit: 'mol', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        {
          t: '水銀柱のつり合いから、空気の圧力を求める',
          m: [R`\text{(a) 水平}:\quad p_{a} = p_{0} = 76\,\mathrm{cmHg}`,
              R`\text{(b) 口が上}:\quad p_{b} = p_{0} + 19 = 95\,\mathrm{cmHg}`,
              R`\text{(c) 口が下}:\quad p_{c} = p_{0} - 19 = 57\,\mathrm{cmHg}`],
          n: R`水銀柱が静止しているので、水銀柱にはたらく力はつり合っています。(a) 水平のとき、水銀柱を左右から押す力は、空気の圧力と大気圧によるものだけ（重力は管の壁からの力とつり合う）なので、$p_{a}=p_{0}$ です。(b) 口が上のとき、空気は水銀柱の下にあり、空気の圧力は「大気圧 + 水銀柱の重さによる圧力」を支えます。(c) 口が下のときは、大気圧が下から水銀柱を押し上げるので、$p_{c}+19=p_{0}$ となります。`,
          easy: R`**cmHg** は、水銀柱の高さで圧力を表す単位です。水銀柱が $h\,\mathrm{cm}$ あれば、その重さの分だけ圧力が $h\,\mathrm{cmHg}$ 大きくなります。管を立てて口を上にすると、空気は水銀の重さに押されて圧力が高くなります。逆に口を下にすると、水銀が下へ引っぱるので、空気の圧力は大気圧より低くなります。`,
          lv: 1
        },
        {
          t: '温度が一定のとき: ボイルの法則（(1)(2)）',
          m: [R`p_{a}V_{a} = p_{b}V_{b} \;\Longrightarrow\; 76\times 30 = 95\times L_{1} \;\Longrightarrow\; L_{1} = 24\,\mathrm{cm}`,
              R`p_{a}V_{a} = p_{c}V_{c} \;\Longrightarrow\; 76\times 30 = 57\times L_{2} \;\Longrightarrow\; L_{2} = 40\,\mathrm{cm}`],
          n: R`断面積は変わらないので、体積は空気柱の長さに比例します。体積のかわりに長さをそのまま代入できます。(c) のとき、閉じた端から水銀柱の先端までは $40+19=59\,\mathrm{cm}$ で、管の長さ $60\,\mathrm{cm}$ 以内なので、水銀は流れ出ません（問題文の仮定と矛盾しません）。`,
          easy: R`温度が変わらないとき、気体の圧力と体積は反比例します（**ボイルの法則** $pV=$ 一定）。圧力が $76\to 95$ と $1.25$ 倍になれば、体積は $\dfrac{1}{1.25}=0.8$ 倍になって、$30\to 24\,\mathrm{cm}$ です。圧力が $76\to 57$ と $0.75$ 倍になれば、体積は $\dfrac{4}{3}$ 倍になって、$40\,\mathrm{cm}$ です。`,
          pro: R`$p$ は cmHg のまま、$V$ は長さのまま代入してよい（Pa や $\mathrm{m^{3}}$ に直す必要はない）。`,
          lv: 1
        },
        {
          t: '圧力が一定のとき: シャルルの法則（(3)）',
          m: [R`L_{3} = 60 - 19 = 41\,\mathrm{cm}`,
              R`\frac{V_{a}}{T_{a}} = \frac{V_{3}}{T_{3}} \;\Longrightarrow\; \frac{30}{300} = \frac{41}{T_{3}} \;\Longrightarrow\; T_{3} = 410\,\mathrm{K}`],
          n: R`管が水平なので、水銀柱が動いても空気の圧力は大気圧 $76\,\mathrm{cmHg}$ のまま変わりません。圧力が一定のとき、体積は**絶対温度**に比例します。水銀柱の右端が管口に達したとき、空気柱の長さは「管の長さ $-$ 水銀柱の長さ」$=41\,\mathrm{cm}$ です。温度は $\mathrm{K}$ のまま計算します（$\degree\mathrm{C}$ に直して比べてはいけません）。`,
          easy: R`圧力が一定のとき、気体の体積は絶対温度に比例します（**シャルルの法則** $\dfrac{V}{T}=$ 一定）。体積が $\dfrac{41}{30}$ 倍になるので、絶対温度も $\dfrac{41}{30}$ 倍の $300\times\dfrac{41}{30}=410\,\mathrm{K}$（$137\degree\mathrm{C}$）になります。`,
          lv: 1
        },
        {
          t: '状態方程式から物質量を求める（(4)）',
          m: [R`pV = nRT \;\Longrightarrow\; n = \frac{pV}{RT}`,
              R`n = \frac{1.0\times10^{5}\times 30\times10^{-6}}{8.3\times 300} = \frac{3.0}{2490} \approx 1.2\times10^{-3}\,\mathrm{mol}`],
          n: R`図 a の状態（$300\,\mathrm{K}$）で考えます。圧力は $76\,\mathrm{cmHg}=1.0\times10^{5}\,\mathrm{Pa}$、体積は $30\,\mathrm{cm}\times1.0\,\mathrm{cm^{2}}=30\,\mathrm{cm^{3}}=30\times10^{-6}\,\mathrm{m^{3}}$ です。状態方程式には SI 単位（Pa、$\mathrm{m^{3}}$、K）で代入します。`,
          easy: R`ボイルの法則やシャルルの法則は「何倍になるか」という比の関係でした。物質量 $n$ を求めるには、**状態方程式** $pV=nRT$ に具体的な値を入れます。気体定数 $R=8.3\,\mathrm{J/(mol\cdot K)}$ の単位に合わせて、圧力は Pa、体積は $\mathrm{m^{3}}$、温度は K で入れるのがポイントです。`,
          pro: R`$1\,\mathrm{cm^{3}}=10^{-6}\,\mathrm{m^{3}}$。単位換算の見落としが、この種の計算でいちばん多いミス。`,
          lv: 1
        }
      ],
      tags: ['ボイルの法則', 'シャルルの法則', '水銀柱', '状態方程式']
    },

    /* ---------- 熱力学第一法則 ---------- */
    {
      id: 'p-mid-thermo1-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-thermo1',
      title: 'ばねのついたピストンの気体',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`図のように、水平に置いた断面積 $S=1.0\times10^{-2}\,\mathrm{m^{2}}$ の円筒の左端は閉じられ、なめらかに動くピストンで、単原子分子の理想気体が閉じこめられている。ピストンの右側は真空で、ピストンと円筒の右端の壁は、ばね定数 $k=5.0\times10^{3}\,\mathrm{N/m}$ の軽いばねでつながれている。ピストンが円筒の左端にあるときに、ばねは自然の長さになる。はじめ（状態 A）、ピストンは円筒の左端から $0.20\,\mathrm{m}$ の位置で静止している。この気体をヒーターでゆっくり加熱し、気体の絶対温度がはじめの $4.0$ 倍になった状態を B とする。ヒーターの熱容量と、円筒・ピストンの熱容量は無視でき、ヒーター以外から気体へ熱は出入りしない。`,
      fig: figSpringPiston(),
      parts: [
        { label: '(1)', q: R`状態 A の気体の圧力は何 $\mathrm{Pa}$ か。`, type: 'num', answer: 1.0e5, rel: 0.02, unit: 'Pa', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        {
          label: '(2)', q: R`状態 A から B へ変化するときの、気体の圧力 $p$（縦軸）と体積 $V$（横軸）の関係を表すグラフとして、もっとも適当なものはどれか。`,
          type: 'choice',
          choices: [{ t: 'ア', fig: figPV('step') }, { t: 'イ', fig: figPV('high') }, { t: 'ウ', fig: figPV('line') }, { t: 'エ', fig: figPV('low') }],
          answer: 2,
          explain: R`ピストンが $x$ だけ右にあるときの力のつり合いは $pS=kx$、体積は $V=Sx$ なので、$p=\dfrac{k}{S^{2}}V$ です。圧力は体積に比例するので、$p$-$V$ 図では原点を通る直線になります（ウ）。イ・エの曲線は比例関係ではなく、ア は「圧力一定で膨張してから、体積一定で加熱する」変化です。`
        },
        { label: '(3)', q: R`状態 B の気体の体積は何 $\mathrm{m^{3}}$ か。`, type: 'num', answer: 4.0e-3, rel: 0.02, unit: 'm³', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(4)', q: R`状態 A から B までの間に、気体が吸収した熱量は何 $\mathrm{J}$ か。`, type: 'num', answer: 1200, rel: 0.02, unit: 'J' }
      ],
      solution: [
        {
          t: 'ピストンのつり合いから圧力を求める（(1)）',
          m: [R`pS = kx`,
              R`p_{A} = \frac{k\,x_{A}}{S} = \frac{5.0\times10^{3}\times 0.20}{1.0\times10^{-2}} = 1.0\times10^{5}\,\mathrm{Pa}`],
          n: R`ピストンにはたらく水平方向の力は、気体が右向きに押す力 $pS$ と、縮んだばねが左向きに押す力 $kx$ です。ピストンの右側は真空なので、大気圧による力はありません。ピストンが左端にあるときにばねが自然の長さなので、ピストンの位置 $x$ がそのままばねの縮みです。`,
          easy: R`ピストンは止まっているので、右向きの力と左向きの力がつり合っています。気体がピストンを押す力は「圧力 × 面積」で $pS$、ばねがピストンを押し返す力は「ばね定数 × 縮み」で $kx$ です。右側が真空なので、空気がピストンを押す力は考えなくてかまいません。`,
          lv: 1
        },
        {
          t: '圧力は体積に比例する（(2)）',
          m: R`p = \frac{kx}{S},\qquad V = Sx \;\Longrightarrow\; p = \frac{k}{S^{2}}\,V`,
          n: R`ヒーターでゆっくり加熱するので、ピストンはいつでもつり合いを保ちながら動きます。したがって、どの状態でも $p=\dfrac{kx}{S}$ が成り立ち、体積 $V=Sx$ を使うと $p\propto V$ となります。$p$-$V$ 図では、原点を通る右上がりの直線の上を、A から B へ移ります。`,
          easy: R`「圧力 $p$ と体積 $V$ が比例する」とは、$V$ が 2 倍になれば $p$ も 2 倍になる関係です。グラフにすると、原点を通る直線です。この問題では、気体がふくらむほど、ばねが縮んで強く押し返すので、気体の圧力もそれに合わせて大きくならないとつり合いません。`,
          lv: 1
        },
        {
          t: '状態 B の体積（(3)）',
          m: [R`pV = nRT,\quad p \propto V \;\Longrightarrow\; T \propto V^{2}`,
              R`\frac{T_{B}}{T_{A}} = \left(\frac{V_{B}}{V_{A}}\right)^{2} = 4.0 \;\Longrightarrow\; \frac{V_{B}}{V_{A}} = 2.0`,
              R`V_{A} = Sx_{A} = 2.0\times10^{-3}\,\mathrm{m^{3}} \;\Longrightarrow\; V_{B} = 4.0\times10^{-3}\,\mathrm{m^{3}},\quad p_{B} = 2.0\times10^{5}\,\mathrm{Pa}`],
          n: R`状態方程式から、温度 $T$ は $pV$ に比例します。この問題では $p$ も $V$ に比例するので、$V$ が $a$ 倍になると $pV$ は $a^{2}$ 倍になります。$a^{2}=4.0$ より $a=2.0$ です。このとき、ピストンは左端から $0.40\,\mathrm{m}$ の位置（ばねの縮みは 2 倍）、圧力は $p_{B}=\dfrac{k\times0.40}{S}=2.0\times10^{5}\,\mathrm{Pa}$ です。`,
          easy: R`温度は $pV$ の値で決まります（$pV=nRT$ で、$nR$ は一定）。体積が 2 倍になると、圧力も 2 倍になるので、$pV$ は $2\times2=4$ 倍になります。温度が 4 倍になるのは、体積が 2 倍になったときです。`,
          pro: R`$p\propto V$ の変化では $T\propto V^{2}$（体積が $a$ 倍なら温度は $a^{2}$ 倍）。`,
          lv: 1
        },
        {
          t: '気体が外部にした仕事（(4) の準備）',
          m: R`W = \frac{p_{A}+p_{B}}{2}\,(V_{B}-V_{A}) = \frac{1.0\times10^{5}+2.0\times10^{5}}{2}\times(4.0-2.0)\times10^{-3} = 3.0\times10^{2}\,\mathrm{J}`,
          n: R`気体が膨張するときにする仕事は、$p$-$V$ 図で、グラフと $V$ 軸ではさまれた部分の面積（図の台形）です。確かめとして、気体の仕事は、すべてばねの弾性エネルギーの増加になっています（ピストンの右側は真空で、ほかに仕事をする相手がありません）: $\dfrac{1}{2}k(0.40^{2}-0.20^{2})=\dfrac{1}{2}\times5.0\times10^{3}\times0.12=3.0\times10^{2}\,\mathrm{J}$。`,
          fig: G({
            w: 340, h: 220, x: [0, 5], y: [0, 2.5], axis: ['V', 'p'],
            curves: [{ f: function (v) { return v / 2; }, domain: [0, 4.6], cls: 'c1' }],
            fills: [{ f: function (v) { return v / 2; }, g: function () { return 0; }, from: 2, to: 4, cls: 'f3' }],
            points: [{ x: 2, y: 1, label: 'A', cls: 'c3', pos: 'tl' }, { x: 4, y: 2, label: 'B', cls: 'c3', pos: 'br' }],
            labels: [{ x: 2.6, y: 0.5, text: '面積 = W = 300 J', cls: 'c3' }, { x: 0.15, y: 2.32, text: '単位: p は 10⁵ Pa、V は 10⁻³ m³', cls: 'dim' }]
          }),
          easy: R`気体が押し広げて仕事をするとき、仕事の大きさは $p$-$V$ 図の「グラフの下の面積」で表されます。圧力が一定なら長方形、この問題のように圧力が変わる場合は台形になります。台形の面積 $=$（上底 + 下底）$\times$ 高さ $\div\,2$ です。`,
          lv: 1
        },
        {
          t: '内部エネルギーの変化と、吸収した熱量（(4)）',
          m: [R`\Delta U = \frac{3}{2}nR\,\Delta T = \frac{3}{2}\left(p_{B}V_{B} - p_{A}V_{A}\right) = \frac{3}{2}\times(800 - 200) = 9.0\times10^{2}\,\mathrm{J}`,
              R`Q = \Delta U + W = 900 + 300 = 1.2\times10^{3}\,\mathrm{J}`],
          n: R`単原子分子理想気体の内部エネルギーは $U=\dfrac{3}{2}nRT$ で、状態方程式 $nRT=pV$ より $U=\dfrac{3}{2}pV$ とも書けます。ここで $p_{B}V_{B}=2.0\times10^{5}\times4.0\times10^{-3}=800\,\mathrm{J}$、$p_{A}V_{A}=1.0\times10^{5}\times2.0\times10^{-3}=200\,\mathrm{J}$ です。熱力学第一法則 $Q=\Delta U+W$（$Q$: 気体が吸収した熱量、$W$: 気体が外部にした仕事）に代入します。`,
          easy: R`**熱力学第一法則**は、エネルギーの収支です。「ヒーターからもらった熱 $Q$」は、「気体の温度を上げる（内部エネルギー $\Delta U$ を増やす）」ことと、「ばねを縮めて外部に仕事 $W$ をする」ことに使われます。温度が 4 倍になっているので、$\Delta U$ はかなり大きく、$\Delta U=900\,\mathrm{J}$ です。仕事 $300\,\mathrm{J}$ をたして、$Q=1200\,\mathrm{J}$ になります。`,
          pro: R`単原子分子理想気体では $\Delta U=\dfrac{3}{2}\Delta(pV)$ とすれば、$n$・$R$・$T$ の値を使わずにすむ。$W$ は $p$-$V$ 図の面積。`,
          lv: 1
        }
      ],
      tags: ['熱力学第一法則', '内部エネルギー', 'p-V図', 'ばね']
    },

    /* ---------- 波の性質 ---------- */
    {
      id: 'p-mid-wave-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-wave',
      title: '水面波の屈折と全反射',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`水槽の底に板を置いて、水深の大きい領域 I と水深の小さい領域 II をつくった。境界は直線である。領域 I から領域 II へ、一定の振動数の平面波を送ったところ、波は境界で屈折した。図は、ある瞬間の波面（山の位置）と波の進む向きを表している。領域 I での波の速さは $20\,\mathrm{cm/s}$、波長は $10\,\mathrm{cm}$ で、領域 II での波長は $7.5\,\mathrm{cm}$ である。また、領域 I での入射角 $\theta_{1}$ は $\sin\theta_{1}=0.80$ を満たす。(1)〜(3) では、波は境界で反射せず、すべて領域 II へ進むものとする。`,
      fig: figRefraction(),
      parts: [
        { label: '(1)', q: R`波の振動数は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 2.0, rel: 0.02, unit: 'Hz' },
        { label: '(2)', q: R`領域 II での波の速さは何 $\mathrm{cm/s}$ か。`, type: 'num', answer: 15, rel: 0.02, unit: 'cm/s' },
        { label: '(3)', q: R`領域 II での屈折角 $\theta_{2}$ について、$\sin\theta_{2}$ の値を求めよ。`, type: 'num', answer: 0.60, rel: 0.02 },
        { label: '(4)', q: R`次に、同じ波を領域 II から領域 I へ向けて送った。入射角を $0$ から少しずつ大きくしていくと、入射角がある値 $\theta_{c}$ に達したとき、波は領域 I へ進めなくなり、すべて境界で反射された。$\sin\theta_{c}$ の値を求めよ。`, type: 'num', answer: 0.75, rel: 0.02 }
      ],
      solution: [
        {
          t: '振動数は境界の前後で変わらない（(1)）',
          m: R`v = f\lambda \;\Longrightarrow\; f = \frac{v_{1}}{\lambda_{1}} = \frac{20}{10} = 2.0\,\mathrm{Hz}`,
          n: R`波の速さ $v$・振動数 $f$・波長 $\lambda$ の関係 $v=f\lambda$ を、速さと波長がどちらもわかっている領域 I に使います。振動数は波を送り出す側（波源）で決まり、波が境界を通りぬけても変わりません。`,
          easy: R`**振動数**は、1 秒間に水面が上下する回数（1 秒間に通る山の数）です。境界の水面は、領域 I の波に合わせて 1 秒間に $2.0$ 回上下します。領域 II の波はその上下運動から生まれるので、領域 II の水面も 1 秒間に $2.0$ 回上下します。つまり、境界をこえても振動数は変わりません。`,
          lv: 1
        },
        {
          t: '領域 II での波の速さ（(2)）',
          m: R`v_{2} = f\lambda_{2} = 2.0\times 7.5 = 15\,\mathrm{cm/s}`,
          n: R`領域 II でも振動数は $2.0\,\mathrm{Hz}$ のままです。波長が $10\,\mathrm{cm}$ から $7.5\,\mathrm{cm}$（$\dfrac{3}{4}$ 倍）になったので、速さも $\dfrac{3}{4}$ 倍の $15\,\mathrm{cm/s}$ になります。水深の小さい領域ほど、波はゆっくり進みます。`,
          pro: R`屈折では「振動数は不変、速さと波長は比例」。$v_{1}:v_{2}=\lambda_{1}:\lambda_{2}$ を使えば、振動数を求めずに $v_{2}=20\times\dfrac{7.5}{10}=15$ と出せる。`,
          lv: 1
        },
        {
          t: '境界上の波面の間隔から、屈折の法則を導く（(3)）',
          m: [R`D = \frac{\lambda_{1}}{\sin\theta_{1}} = \frac{\lambda_{2}}{\sin\theta_{2}}`,
              R`\sin\theta_{2} = \frac{\lambda_{2}}{\lambda_{1}}\,\sin\theta_{1} = \frac{7.5}{10}\times 0.80 = 0.60`],
          n: R`境界の上で、隣り合う波面が境界と交わる点の間隔を $D$ とします。$D$ は境界線上の長さなので、領域 I から見ても領域 II から見ても同じです。波長は波面に垂直にはかるので、直角三角形を考えると、領域 I では $\lambda_{1}=D\sin\theta_{1}$、領域 II では $\lambda_{2}=D\sin\theta_{2}$ となります。ここから $D=\dfrac{10}{0.80}=12.5\,\mathrm{cm}$、$\sin\theta_{2}=\dfrac{7.5}{12.5}=0.60$ です。`,
          easy: R`図の境界線をよく見ると、波面（山の線）は境界に斜めに当たっています。隣り合う 2 本の波面が境界と交わる 2 点の間隔 $D$ は、境界線の上の長さなので、どちら側から見ても同じです。いっぽう、波面と波面の間隔（波長）は、波面に垂直な向きにはかります。波長は、斜めの長さ $D$ に対する「向かい側の辺」にあたるので、$\lambda=D\sin\theta$ と書けます。領域 II では波長が短いので、$\sin\theta_{2}$ も小さくなります。`,
          lv: 1
        },
        {
          t: '屈折の法則のまとめ',
          m: R`\frac{\sin\theta_{1}}{\sin\theta_{2}} = \frac{\lambda_{1}}{\lambda_{2}} = \frac{v_{1}}{v_{2}} = \frac{4}{3}`,
          n: R`これが波の屈折の法則です。右端の値は、領域 I に対する領域 II の屈折率 $n_{12}$ にあたります。光・音・水面波のどれでも成り立ち、速さの小さい領域に入ると、波は法線に近づく向きに曲がります（$\theta_{2}<\theta_{1}$）。入射角、速さ（または波長）のうち 3 つがわかれば、残りの 1 つは比で出せます。`,
          lv: 2
        },
        {
          t: '全反射が起こる入射角（(4)）',
          m: [R`\frac{\sin\theta}{\sin\varphi} = \frac{v_{2}}{v_{1}}\qquad(\theta:\text{領域 II 側の入射角},\ \varphi:\text{領域 I 側の屈折角})`,
              R`\varphi = 90\degree \;\Longrightarrow\; \sin\theta_{c} = \frac{v_{2}}{v_{1}} = \frac{15}{20} = 0.75`],
          n: R`今度は速さが $15\,\mathrm{cm/s}$ の領域 II から、速さが $20\,\mathrm{cm/s}$ の領域 I へ向かうので、屈折角 $\varphi$ は入射角 $\theta$ より大きくなります。入射角を大きくすると $\varphi$ も大きくなり、$\varphi=90\degree$（波が境界に沿って進む）になる入射角が臨界角 $\theta_{c}$ です。これより大きい入射角では、屈折波ができず全反射します。$\theta_{c}=\sin^{-1}0.75\approx 48.6\degree$ です。`,
          easy: R`速く進める領域へ出ていくとき、波は法線から遠ざかる向きに曲がります。入射角を大きくしていくと、曲がった波がちょうど境界線に沿って進む（屈折角 $90\degree$）瞬間がきます。入射角がそれより大きいと、曲がって出ていける向きがもうないので、波はすべて境界ではね返されます。これが全反射です。`,
          pro: R`全反射は「速い（屈折率の小さい）側へ出るとき」だけ起こる。臨界角は $\sin\theta_{c}=\dfrac{v_{\text{遅}}}{v_{\text{速}}}$。`,
          lv: 1
        }
      ],
      tags: ['屈折の法則', '波の基本式', '全反射', '水面波']
    },

    /* ---------- ドップラー効果 ---------- */
    {
      id: 'p-mid-doppler-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-doppler',
      title: 'ドップラー効果と反射音のうなり',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`音の速さを $340\,\mathrm{m/s}$ とし、風はないものとする。図 A のように、一直線上に観測者 O、音源 S、壁 W が並んでいる。O と W は静止している。S は振動数 $680\,\mathrm{Hz}$ の音を出しながら、O から遠ざかる向き（W に近づく向き）に、一定の速さ $2.0\,\mathrm{m/s}$ で動いている。O には、S から直接届く音と、W で反射して届く音の 2 つが聞こえる。W は音を完全に反射する。次に、図 B のように S を静止させ（振動数は $680\,\mathrm{Hz}$ のまま）、O が W に向かって一定の速さ $1.0\,\mathrm{m/s}$ で歩くようにした。`,
      fig: figDoppler(),
      parts: [
        { label: '(1)', q: R`図 A で、O が S から直接聞く音の振動数は何 $\mathrm{Hz}$ か。有効数字 3 桁で答えよ。`, type: 'num', answer: 676, rel: 0.0005, unit: 'Hz' },
        { label: '(2)', q: R`図 A で、W で反射して O に届く音の振動数は何 $\mathrm{Hz}$ か。有効数字 3 桁で答えよ。`, type: 'num', answer: 684, rel: 0.0005, unit: 'Hz' },
        { label: '(3)', q: R`図 A で、O が聞くうなりは 1 秒間に何回か。有効数字 2 桁で答えよ。`, type: 'num', answer: 8.0, rel: 0.02, unit: '回' },
        { label: '(4)', q: R`図 B で、O が聞くうなりは 1 秒間に何回か。`, type: 'num', answer: 4.0, rel: 0.02, unit: '回' }
      ],
      solution: [
        {
          t: 'ドップラー効果の式と、符号の決め方',
          m: R`f = \frac{V - v_{O}}{V - v_{S}}\,f_{0}`,
          n: R`音速を $V$、音源の振動数を $f_{0}$、観測者の速度を $v_{O}$、音源の速度を $v_{S}$ とします。**速度は「音源から観測者へ向かう向き」を正**として、符号つきで代入します。静止しているものの速度は $0$ です。`,
          easy: R`音源が近づくと、音の波が前へ押しつけられて波長が短くなり、高い音になります。遠ざかると波長がのびて低い音になります。観測者が音源に近づくときは、1 秒間に出会う波の数がふえるので、これも高い音になります。上の式はこの 2 つをまとめたもので、分母の $V-v_{S}$ が音源の動きの効果、分子の $V-v_{O}$ が観測者の動きの効果を表します。`,
          pro: R`「音源 → 観測者の向きを正」と最初に決めて機械的に代入すれば、近づく・遠ざかるの判断ミスがなくなる。反射音は「壁が出す音」として、向きを決め直して 2 回使う。`,
          lv: 1
        },
        {
          t: '直接音（(1)）',
          m: [R`v_{S} = -2.0\,\mathrm{m/s},\qquad v_{O} = 0`,
              R`f_{1} = \frac{340}{340-(-2.0)}\times 680 = \frac{340}{342}\times 680 \approx 676\,\mathrm{Hz}`],
          n: R`S から O へ向かう向きは図の左向きです。S は右向きに動いているので、左向きを正とすると $v_{S}=-2.0\,\mathrm{m/s}$（O から遠ざかる）です。音源が遠ざかるので、聞こえる音は $680\,\mathrm{Hz}$ より低くなります。`,
          easy: R`1 秒間に、S は $680$ 個の波を出しながら $2.0\,\mathrm{m}$ 遠ざかります。このとき、最初の波は $340\,\mathrm{m}$ 進んでいるので、$680$ 個の波は $340+2.0=342\,\mathrm{m}$ の長さに並びます。波長は $\dfrac{342}{680}\,\mathrm{m}$ で、これが O の前を通りすぎる回数は $340\div\dfrac{342}{680}\approx 676$ 回/秒です。`,
          lv: 1
        },
        {
          t: '反射音（(2)）',
          m: [R`\text{W が受け取る音}:\quad v_{S} = +2.0,\ v_{O} = 0 \;\Longrightarrow\; f_{W} = \frac{340}{340-2.0}\times 680 = \frac{340}{338}\times 680 \approx 684\,\mathrm{Hz}`,
              R`f_{2} = f_{W} \approx 684\,\mathrm{Hz}`],
          n: R`反射音は「W が出す音」と考えます。まず、静止している W が観測者として、近づいてくる S（S → W の向きを正として $v_{S}=+2.0$）の音を受け取ります。W は受け取った音と同じ振動数 $f_{W}$ の音を出す静止した音源になり、静止している O にはその $f_{W}$ がそのまま聞こえます。`,
          easy: R`壁にぶつかる音は、音源が近づきながら出した音なので、波長が縮んでいて振動数が高くなっています。壁は受け取った波を同じ間隔で送り返すだけなので、O には、その高い振動数がそのまま届きます。`,
          lv: 1
        },
        {
          t: 'うなりの回数（(3)）',
          m: R`|f_{2}-f_{1}| = \frac{340}{338}\times 680 - \frac{340}{342}\times 680 \approx 684.02 - 676.02 = 8.0`,
          n: R`振動数のわずかにちがう 2 つの音を同時に聞くと、音の大きさが周期的に変わります（**うなり**）。1 秒間のうなりの回数は、2 つの音の振動数の差 $|f_{2}-f_{1}|$ に等しく、約 $8.0$ 回です。`,
          easy: R`少しだけ高さのちがう 2 つの音（たとえば $676\,\mathrm{Hz}$ と $684\,\mathrm{Hz}$）を重ねると、強め合う瞬間と弱め合う瞬間が交互にきて、「ワンワン」と音が強弱をくり返します。その回数が、1 秒間に $|f_{2}-f_{1}|$ 回です。`,
          pro: R`うなりは振動数の「差」。$u$ が $V$ よりずっと小さいときは $f_{2}-f_{1}\approx\dfrac{2u}{V}f_{0}=\dfrac{2\times2.0}{340}\times680=8.0$ と近似でき、2 つの振動数を別々に求めなくてすむ。`,
          lv: 1
        },
        {
          t: 'O が歩く場合（(4)）',
          m: [R`\text{直接音}\ (\mathrm{S}\to\mathrm{O}\ \text{を正}):\quad v_{S}=0,\ v_{O}=+1.0 \;\Longrightarrow\; f_{d} = \frac{340-1.0}{340}\times 680 = 678\,\mathrm{Hz}`,
              R`\text{反射音}\ (\mathrm{W}\to\mathrm{O}\ \text{を正}):\quad v_{S}=0,\ v_{O}=-1.0 \;\Longrightarrow\; f_{r} = \frac{340-(-1.0)}{340}\times 680 = 682\,\mathrm{Hz}`,
              R`f_{r}-f_{d} = 4.0`],
          n: R`直接音は S → O（右向き）を正とします。O は右向きに歩くので $v_{O}=+1.0$ で、音源から遠ざかる動きです。反射音では、静止した W が $680\,\mathrm{Hz}$ を受け取って同じ振動数で反射するので、W → O（左向き）を正とします。O は右向きに歩くので $v_{O}=-1.0$ で、音に向かっていく動きです。よって、うなりは 1 秒間に $4.0$ 回です。`,
          easy: R`O が壁に向かって歩くと、後ろから追いかけてくる直接音は「遠ざかる側」なので少し低く（$678\,\mathrm{Hz}$）、前から向かってくる反射音は「近づく側」なので少し高く（$682\,\mathrm{Hz}$）聞こえます。この 2 つの差がうなりです。`,
          pro: R`$f_{r}-f_{d}=\dfrac{2w}{V}f_{0}=\dfrac{2\times1.0}{340}\times680=4.0$。歩く速さ・音速・振動数だけで、うなりが直接出せる。`,
          lv: 1
        }
      ],
      tags: ['ドップラー効果', '反射音', 'うなり']
    },

    /* ---------- 光の干渉 ---------- */
    {
      id: 'p-mid-interf-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-interf',
      title: '回折格子の明線と白色光のスペクトル',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`$1\,\mathrm{mm}$ あたり $500$ 本の溝が等間隔に刻まれた回折格子に、波長 $600\,\mathrm{nm}$（$1\,\mathrm{nm}=10^{-9}\,\mathrm{m}$）の単色光を、格子面に垂直に当てた。格子から $1.0\,\mathrm{m}$ はなれた、格子面に平行なスクリーンに、明線が現れた（図には 2 次の明線まで描いてある。スクリーンは十分に広いものとする）。回折角 $\theta$ は、入射光の進む向きと回折光の進む向きのなす角とし、$m$ 次の明線の回折角を $\theta_{m}$ とする。空気の屈折率は $1$ とする。`,
      fig: figGrating(),
      parts: [
        { label: '(1)', q: R`$2$ 次の明線について、$\sin\theta_{2}$ の値を求めよ。`, type: 'num', answer: 0.60, rel: 0.02 },
        { label: '(2)', q: R`スクリーン上で、中央の明線（$0$ 次）から $2$ 次の明線までの距離 $x_{2}$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.75, rel: 0.02, unit: 'm' },
        { label: '(3)', q: R`スクリーン上に現れる明線は、中央の明線もふくめて全部で何本か。`, type: 'num', answer: 7, rel: 0.02, unit: '本' },
        { label: '(4)', q: R`次に、波長が $400\,\mathrm{nm}$ から $700\,\mathrm{nm}$ までの白色光を当てると、$2$ 次のスペクトルと $3$ 次のスペクトルの一部が重なった。$2$ 次のスペクトルの赤い端（波長 $700\,\mathrm{nm}$）と同じ位置に現れる、$3$ 次のスペクトルの光の波長は何 $\mathrm{nm}$ か。`, type: 'num', answer: 467, rel: 0.02, unit: 'nm' }
      ],
      solution: [
        {
          t: '格子定数と、明線ができる条件',
          m: [R`d = \frac{1.0\times10^{-3}}{500} = 2.0\times10^{-6}\,\mathrm{m}`,
              R`d\sin\theta_{m} = m\lambda\qquad(m=0,\ 1,\ 2,\ \cdots)`],
          n: R`溝の間隔 $d$（格子定数）は、$1\,\mathrm{mm}=1.0\times10^{-3}\,\mathrm{m}$ を $500$ 本で割った値です。となり合う溝から出る光は、角度 $\theta$ の方向で $d\sin\theta$ だけ経路差ができます。これが波長 $\lambda$ の整数倍のとき、すべての溝からの光が強め合って、明線になります。`,
          easy: R`回折格子は、細い溝（スリット）をたくさん並べた板です。溝 1 本ずつから光が広がり（回折）、斜めの方向では、となりの溝から来る光のほうが $d\sin\theta$ だけ余分に進みます。この余分な長さが、波長のちょうど $0$ 倍、$1$ 倍、$2$ 倍、…のときは、山と山が重なって、すべての溝の光が強め合います。それが明線です。`,
          pro: R`ヤングの実験の $\dfrac{dx}{L}=m\lambda$ は角が小さいときの近似式。回折格子は角が大きくても使える $d\sin\theta=m\lambda$ を使う。`,
          lv: 1
        },
        {
          t: '2 次の明線の方向（(1)）',
          m: R`\sin\theta_{2} = \frac{2\lambda}{d} = \frac{2\times 6.0\times10^{-7}}{2.0\times10^{-6}} = 0.60`,
          n: R`条件式に $m=2$、$\lambda=600\,\mathrm{nm}=6.0\times10^{-7}\,\mathrm{m}$ を代入します。このとき $\theta_{2}\approx37\degree$ です。`,
          lv: 1
        },
        {
          t: 'スクリーン上の位置（(2)）',
          m: [R`\tan\theta_{2} = \frac{\sin\theta_{2}}{\cos\theta_{2}} = \frac{0.60}{\sqrt{1-0.60^{2}}} = \frac{0.60}{0.80} = 0.75`,
              R`x_{2} = L\tan\theta_{2} = 1.0\times 0.75 = 0.75\,\mathrm{m}`],
          n: R`図の直角三角形（格子の中心・スクリーン上の中央の点・$2$ 次の明線の点）から、$x_{2}=L\tan\theta_{2}$ です。$\theta_{2}$ は約 $37\degree$ で小さくないので、$\tan\theta\approx\sin\theta$ という近似は使えません（使うと $0.60\,\mathrm{m}$ となって誤りです）。`,
          easy: R`$\sin\theta=0.60$ のときは、斜辺 $5$、向かい側 $3$、となり $4$ の直角三角形（3:4:5）を思い浮かべます。すると、$\tan\theta=\dfrac{3}{4}=0.75$ とすぐにわかります。`,
          pro: R`$\sin\theta=0.6$ や $0.8$ は 3:4:5 の三角形。$\tan\theta$ がすぐ出る。角が小さくないのに $\sin\theta\approx\tan\theta$ としないこと。`,
          lv: 1
        },
        {
          t: '現れる明線の本数（(3)）',
          m: [R`\sin\theta_{m} = \frac{m\lambda}{d} = 0.30\,m \le 1 \;\Longrightarrow\; m \le 3.3`,
              R`m = 0,\ \pm1,\ \pm2,\ \pm3 \;\Longrightarrow\; 1 + 2\times3 = 7\ \text{本}`],
          n: R`$\sin\theta$ は $1$ をこえないので、$\dfrac{m\lambda}{d}\le1$ を満たす $m$ の明線だけが現れます。$m=3$ のとき $\sin\theta_{3}=0.90$（$\theta_{3}\approx64\degree$）で現れますが、$m=4$ では $\sin\theta_{4}=1.2$ となって現れません。明線は中央をはさんで両側に対称にできるので、全部で $7$ 本です。`,
          easy: R`光が広がる向き（回折角 $\theta$）は、真横（$90\degree$）までしか選べないので、$\sin\theta$ は $1$ 以下です。$m$ が大きくなりすぎて $\sin\theta=\dfrac{m\lambda}{d}$ が $1$ をこえると、そんな向きはないので、その次数の明線はできません。`,
          lv: 1
        },
        {
          t: '白色光のスペクトルの重なり（(4)）',
          m: [R`\text{同じ位置} \;\Longrightarrow\; \text{同じ}\ \theta\ \Longrightarrow\ m\lambda\ \text{が等しい}:\qquad 2\times700 = 3\times\lambda'`,
              R`\lambda' = \frac{1400}{3} \approx 467\,\mathrm{nm}`],
          n: R`スクリーン上の同じ位置は同じ回折角 $\theta$ なので、$d\sin\theta=m\lambda$ より、$m\lambda$ の値が等しい光が重なります。同様に、$2$ 次の $600\,\mathrm{nm}$ は $3$ 次の $400\,\mathrm{nm}$ と重なります。つまり、$2$ 次の $600$〜$700\,\mathrm{nm}$（橙〜赤）の部分に、$3$ 次の $400$〜$467\,\mathrm{nm}$（紫〜青）の部分が重なっています。`,
          easy: R`白色光にはいろいろな波長の光が混ざっているので、明線のかわりに、次数ごとに虹色の帯（スペクトル）ができます。波長が長いほど回折角が大きいので、各帯の外側が赤になります。$m$ が大きいほど帯は外側へのび、となりの次数の帯と重なっていきます。同じ位置にくる条件が「$m\lambda$ が同じ」です。`,
          pro: R`スペクトルの重なりは $m_{1}\lambda_{1}=m_{2}\lambda_{2}$ で判定する。2 次の長波長端と 3 次の短波長端（$2\times700$ と $3\times400$）を比べれば、重なりの有無がすぐわかる。`,
          lv: 1
        }
      ],
      tags: ['回折格子', '干渉', '経路差', 'スペクトル']
    },

    /* ---------- 静電気 ---------- */
    {
      id: 'p-mid-estat-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-estat',
      title: 'コンデンサーと金属板の挿入',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`面積の等しい 2 枚の金属の極板 A, B を、間隔 $d=2.0\,\mathrm{mm}$ で平行に向かい合わせた平行板コンデンサーがある。電気容量は $C_{0}=1.0\times10^{-10}\,\mathrm{F}$ である。A を電池の正極に、B を負極につなぎ、電圧 $V_{0}=60\,\mathrm{V}$ で十分に充電した。その後、スイッチ S を開いて電池を切り離した。この状態から、極板と同じ面積の、厚さ $1.0\,\mathrm{mm}$ の金属板 P を、極板に平行に、どちらの極板にもふれないように、2 枚の極板の間へゆっくり差し込んだ（図）。差し込んだ後、A と P の間隔は $0.40\,\mathrm{mm}$、P と B の間隔は $0.60\,\mathrm{mm}$ である。極板の端での電場の乱れは無視する。`,
      fig: figCapSlab(false),
      parts: [
        { label: '(1)', q: R`P を差し込む前の、極板間の電場の強さは何 $\mathrm{V/m}$ か。`, type: 'num', answer: 3.0e4, rel: 0.02, unit: 'V/m', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(2)', q: R`P を差し込んだ後の、極板 A, B 間の電位差は何 $\mathrm{V}$ か。`, type: 'num', answer: 30, rel: 0.02, unit: 'V' },
        { label: '(3)', q: R`P を差し込んだ後、B の電位を $0\,\mathrm{V}$ としたとき、金属板 P の電位は何 $\mathrm{V}$ か。`, type: 'num', answer: 18, rel: 0.02, unit: 'V' },
        { label: '(4)', q: R`P を差し込む前と比べて、コンデンサーに蓄えられた静電エネルギーは何 $\mathrm{J}$ 減少したか。`, type: 'num', answer: 9.0e-8, rel: 0.02, unit: 'J', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        {
          t: '差し込む前の電場と電気量（(1)）',
          m: [R`E_{0} = \frac{V_{0}}{d} = \frac{60}{2.0\times10^{-3}} = 3.0\times10^{4}\,\mathrm{V/m}`,
              R`Q_{0} = C_{0}V_{0} = 1.0\times10^{-10}\times 60 = 6.0\times10^{-9}\,\mathrm{C}`],
          n: R`平行板コンデンサーの極板間の電場は一様で、電位差と電場には $V=Ed$ の関係があります。電気量は $Q=CV$ です。スイッチを開いて電池を切り離したので、これ以後、A の電気量 $+Q_{0}$ と B の電気量 $-Q_{0}$ は変わりません。`,
          easy: R`電場の強さは、「電位が $1\,\mathrm{m}$ あたりどれだけ変わるか」を表します（坂道のかたむきのようなものです）。極板間では、$2.0\,\mathrm{mm}=2.0\times10^{-3}\,\mathrm{m}$ の距離で電位が $60\,\mathrm{V}$ 変わるので、$1\,\mathrm{m}$ あたりでは $\dfrac{60}{2.0\times10^{-3}}$ です。`,
          lv: 1
        },
        {
          t: '金属板を差し込んでも、すきまの電場は変わらない',
          n: R`切り離されているので、A に $+Q_{0}$、B に $-Q_{0}$ がそのまま残ります。金属板 P の中では、自由電子が動いて電場を打ち消すので、**P の内部の電場は $0$** です。そのため、P の上面（A 側）には $-Q_{0}$、下面（B 側）には $+Q_{0}$ の電荷が現れます（静電誘導）。すきまの電場は、向かい合う面の電荷（A の $+Q_{0}$ と P の上面の $-Q_{0}$、P の下面の $+Q_{0}$ と B の $-Q_{0}$）で決まり、差し込む前と同じ $E_{0}=3.0\times10^{4}\,\mathrm{V/m}$ のままです。`,
          easy: R`金属の中には、自由に動ける電子があります。中に電場があると、電子がその力で動いてしまい、動きが止まるのは、電場が $0$ になったときです。そこで、金属板を電場の中に入れると、A 側の面に負、B 側の面に正の電荷が集まり（静電誘導）、板の内側の電場を打ち消します。すきまの電場は、「向かい合う $+Q_{0}$ と $-Q_{0}$ の電荷の組」で決まるので、差し込む前と同じ強さのままです。`,
          fig: figCapSlab(true),
          pro: R`切り離した（$Q$ 一定の）コンデンサーでは、導体を差し込んでもすきまの電場 $E=\dfrac{Q}{\varepsilon_{0}S}$ は変わらない。変わるのは、電場がある部分の長さだけ。`,
          lv: 1
        },
        {
          t: '差し込んだ後の電位差（(2)）',
          m: [R`V_{1} = E_{0}\times(0.40+0.60)\times10^{-3} = 3.0\times10^{4}\times1.0\times10^{-3} = 30\,\mathrm{V}`,
              R`\text{確かめ}:\quad C_{1} = 2C_{0} = 2.0\times10^{-10}\,\mathrm{F},\qquad V_{1} = \frac{Q_{0}}{C_{1}} = \frac{6.0\times10^{-9}}{2.0\times10^{-10}} = 30\,\mathrm{V}`],
          n: R`電位差が生じるのは、電場があるすきまの部分だけです（P の内部は電場が $0$ なので、電位は変わりません）。すきまの長さは合計 $0.40+0.60=1.0\,\mathrm{mm}$ で、差し込む前の $2.0\,\mathrm{mm}$ の半分です。確かめとして、有効な極板間隔が半分になると電気容量は 2 倍（$C_{1}=2C_{0}$）になり、電気量 $Q_{0}$ は変わらないので、$V_{1}=\dfrac{Q_{0}}{C_{1}}$ からも $30\,\mathrm{V}$ とわかります。`,
          easy: R`電位は、電場の向きに進むと、進んだ長さに比例して下がっていきます（坂を下るイメージ）。金属板の中は電場が $0$ で、坂のない平らな台地なので、電位は変わりません。坂になっているのは、すきまの合計 $1.0\,\mathrm{mm}$ だけです。`,
          lv: 1
        },
        {
          t: 'P の電位（(3)）',
          m: [R`V_{P} = E_{0}\times0.60\times10^{-3} = 3.0\times10^{4}\times6.0\times10^{-4} = 18\,\mathrm{V}`,
              R`V_{A} = V_{P} + E_{0}\times0.40\times10^{-3} = 18 + 12 = 30\,\mathrm{V}`],
          n: R`B（$0\,\mathrm{V}$）から P の下面までの電位差が、P の電位 $V_{P}$ です。P は内部の電場が $0$ なので、板全体が同じ電位（等電位）になります。A から B まで、電位が $30\,\mathrm{V}$ から $0\,\mathrm{V}$ へ変わっていく様子を、図に表しました。傾きの大きさが電場の強さ（$30\,\mathrm{V/mm}=3.0\times10^{4}\,\mathrm{V/m}$）です。`,
          fig: G({
            w: 340, h: 220, x: [0, 2.4], y: [0, 36], axis: ['x [mm]', '電位 [V]'],
            curves: [{ f: function (x) { return x < 0.4 ? 30 - 30 * x : (x < 1.4 ? 18 : 18 - 30 * (x - 1.4)); }, domain: [0, 2.0], cls: 'c1' }],
            fills: [{ f: function () { return 18; }, g: function () { return 0; }, from: 0.4, to: 1.4, cls: 'f3' }],
            points: [{ x: 0, y: 30, label: 'A  30 V', cls: 'c3', pos: 'tr' }, { x: 0.4, y: 18, label: '18 V', cls: 'c3', pos: 'tr' }, { x: 2.0, y: 0, label: 'B  0 V', cls: 'c4', pos: 'tr' }],
            labels: [{ x: 0.5, y: 7.5, text: '金属板 P（等電位）', cls: 'c3' }, { x: 1.2, y: 33, text: 'x は A からの距離', cls: 'dim' }]
          }),
          easy: R`P の中は平らな台地で、電位は A 側の面から B 側の面まで同じです。台地の高さは、B（$0\,\mathrm{V}$）から P までの坂（$0.60\,\mathrm{mm}$ 分）の高さです。坂の傾きは電場の強さ $3.0\times10^{4}\,\mathrm{V/m}$（$30\,\mathrm{V}$ が $1\,\mathrm{mm}$ あたり）なので、$30\times0.60=18\,\mathrm{V}$ です。`,
          lv: 1
        },
        {
          t: '静電エネルギーの変化（(4)）',
          m: [R`U_{0} = \frac{1}{2}C_{0}V_{0}^{2} = \frac{1}{2}\times1.0\times10^{-10}\times60^{2} = 1.8\times10^{-7}\,\mathrm{J}`,
              R`U_{1} = \frac{1}{2}Q_{0}V_{1} = \frac{1}{2}\times6.0\times10^{-9}\times30 = 9.0\times10^{-8}\,\mathrm{J}`,
              R`U_{0}-U_{1} = 9.0\times10^{-8}\,\mathrm{J}`],
          n: R`静電エネルギーは $U=\dfrac{1}{2}QV$ です。$Q$ は一定のままで、$V$ が半分になるので、$U$ も半分になります。減った $9.0\times10^{-8}\,\mathrm{J}$ は、金属板が極板の間へ引き込まれるときに、電場が金属板にした仕事にあたります（P は引き込まれるので、外から押しこむ必要はありません）。`,
          easy: R`静電エネルギーは、コンデンサーが電荷を蓄えているときに持つエネルギーで、$U=\dfrac{1}{2}QV$ と表されます。切り離した後は $Q$ が変わらないので、電圧が半分になれば、エネルギーも半分です。`,
          pro: R`$Q$ 一定なら $U=\dfrac{Q^{2}}{2C}$、$V$ 一定なら $U=\dfrac{1}{2}CV^{2}$ で整理する。$C$ が 2 倍になると、前者は $U$ が $\dfrac{1}{2}$ 倍、後者は 2 倍になる。`,
          lv: 1
        }
      ],
      tags: ['コンデンサー', '金属板', '静電誘導', '電位', '静電エネルギー']
    },

    /* ---------- オームの法則と合成抵抗 ---------- */
    {
      id: 'p-mid-circuit-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-circuit',
      title: '2 つの電池をふくむ直流回路',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`図のように、起電力 $E_{1}=12\,\mathrm{V}$ の電池、起電力 $E_{2}=3.0\,\mathrm{V}$ の電池、抵抗値 $R_{1}=2.0\,\Omega$、$R_{2}=3.0\,\Omega$、$R_{3}=3.0\,\Omega$ の 3 つの抵抗、スイッチ S をつないだ回路がある。電池の内部抵抗と導線の抵抗は無視でき、電池の長い線の側が正極である。はじめ、S は開いている。(2)(3) では、S を閉じて十分に時間がたち、電流が一定になった状態を考える。$E_{1}$ の正極から出て $R_{1}$ を通る向きの電流を $I_{1}$、$E_{2}$ の正極から出て $R_{2}$ を通る向きの電流を $I_{2}$ とする（$I_{2}$ は負の値になることもある）。`,
      fig: figKirchhoff(false),
      parts: [
        { label: '(1)', q: R`S を開いているとき、$R_{3}$ を流れる電流は何 $\mathrm{A}$ か。`, type: 'num', answer: 2.4, rel: 0.02, unit: 'A' },
        { label: '(2)', q: R`S を閉じたとき、電流 $I_{1}$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 3.0, rel: 0.02, unit: 'A' },
        { label: '(3)', q: R`S を閉じたとき、電流 $I_{2}$ は何 $\mathrm{A}$ か。符号もふくめて答えよ。`, type: 'num', answer: -1.0, rel: 0.02, unit: 'A', hint: R`例: 1.5 や -2.5（負の数は - をつける）` },
        { label: '(4)', q: R`S を閉じたとき、3 つの抵抗で 1 秒間に発生するジュール熱の合計は何 $\mathrm{J}$ か。`, type: 'num', answer: 33, rel: 0.02, unit: 'J' }
      ],
      solution: [
        {
          t: 'S を開いているとき（(1)）',
          m: [R`R = R_{1} + R_{3} = 2.0 + 3.0 = 5.0\,\Omega`,
              R`I = \frac{E_{1}}{R} = \frac{12}{5.0} = 2.4\,\mathrm{A}`],
          n: R`S が開いているので、右の枝（$E_{2}$ と $R_{2}$）には電流が流れません。回路は、$E_{1}$・$R_{1}$・$R_{3}$ の直列だけになります。直列の合成抵抗は、各抵抗値の和です。$R_{3}$ には、全体を流れる電流と同じ $2.4\,\mathrm{A}$ が流れます。`,
          easy: R`直列つなぎでは、電流の通り道が 1 本だけなので、どの抵抗にも同じ電流が流れ、全体の抵抗は足し算になります（$5.0\,\Omega$）。電池の電圧を全体の抵抗で割れば（オームの法則 $I=\dfrac{V}{R}$）、電流が求まります。`,
          lv: 1
        },
        {
          t: 'S を閉じたとき: キルヒホッフの法則を立てる',
          m: [R`\text{第 1 法則（分かれ目）}:\quad I_{1} + I_{2} = I_{3}`,
              R`\text{第 2 法則（閉回路 ①）}:\quad E_{1} = R_{1}I_{1} + R_{3}I_{3}`,
              R`\text{第 2 法則（閉回路 ②）}:\quad E_{2} = R_{2}I_{2} + R_{3}I_{3}`],
          n: R`$R_{3}$ を上から下へ流れる電流を $I_{3}$ とします。向きは仮定でかまいません（答えが負になれば、仮定と逆向きという意味です）。第 1 法則は「枝の分かれ目に流れこむ電流の和と、流れ出る電流の和は等しい」、第 2 法則は「閉じた 1 周で、電位の上がりと下がりの合計は $0$」です。閉回路 ①（$E_{1}\to R_{1}\to R_{3}$）では、$E_{1}$ で電位が $E_{1}$ だけ上がり、$R_{1}$ と $R_{3}$ で $R_{1}I_{1}$ と $R_{3}I_{3}$ だけ下がります。閉回路 ② も同様です。`,
          easy: R`未知の電流が 3 つあるので、式が 3 本必要です。**第 1 法則**は、水の流れと同じで、分かれ目に入る量と出る量は等しい、という式です。**第 2 法則**は、坂道を 1 周して元の高さにもどると、上った高さと下った高さが等しい、という式です。電池は電位を上げる「ポンプ」、抵抗は電位が下がる「坂」と考えます。`,
          fig: figKirchhoff(true),
          lv: 1
        },
        {
          t: '連立方程式を解く（(2)(3)）',
          m: [R`12 = 2.0\,I_{1} + 3.0\,(I_{1}+I_{2}) \;\Longrightarrow\; 5.0\,I_{1} + 3.0\,I_{2} = 12`,
              R`3.0 = 3.0\,I_{2} + 3.0\,(I_{1}+I_{2}) \;\Longrightarrow\; I_{1} + 2.0\,I_{2} = 1.0`,
              R`I_{1} = 3.0\,\mathrm{A},\qquad I_{2} = -1.0\,\mathrm{A},\qquad I_{3} = 2.0\,\mathrm{A}`],
          n: R`$I_{3}=I_{1}+I_{2}$ を第 2 法則の式に代入して $I_{3}$ を消すと、$I_{1},\,I_{2}$ の連立方程式になります。2 本目から $I_{1}=1.0-2.0\,I_{2}$ を 1 本目に代入すると、$5.0-10\,I_{2}+3.0\,I_{2}=12$ より $I_{2}=-1.0$ です。$I_{2}$ が負なので、$E_{2}$ には、仮定と逆向き（正極に流れこむ向き）に $1.0\,\mathrm{A}$ の電流が流れています。$E_{2}$ は放電せず、$E_{1}$ によって充電されています。`,
          easy: R`答えが負になったときは、「仮定した向きと逆向きに流れている」という意味です。$I_{2}=-1.0\,\mathrm{A}$ は、電池 $E_{2}$ に、正極へ流れこむ向きに $1.0\,\mathrm{A}$ 流れている、ということです。電池に外から電流が流れこむのは、充電のときです。$E_{1}$ が $E_{2}$ よりずっと強いので、$E_{2}$ は押しもどされて、充電される側になります。`,
          pro: R`検算は電位で行う。$R_{3}$ の両端の電圧 $R_{3}I_{3}=6.0\,\mathrm{V}$ は、$E_{1}-R_{1}I_{1}=12-6.0$ とも、$E_{2}-R_{2}I_{2}=3.0+3.0$ とも一致する。`,
          lv: 1
        },
        {
          t: '別解: 分かれ目の電位を未知数にする',
          m: [R`V = \frac{\dfrac{E_{1}}{R_{1}} + \dfrac{E_{2}}{R_{2}}}{\dfrac{1}{R_{1}} + \dfrac{1}{R_{2}} + \dfrac{1}{R_{3}}} = \frac{6.0 + 1.0}{\dfrac{7}{6}} = 6.0\,\mathrm{V}`,
              R`I_{1} = \frac{E_{1}-V}{R_{1}} = 3.0\,\mathrm{A},\qquad I_{2} = \frac{E_{2}-V}{R_{2}} = -1.0\,\mathrm{A},\qquad I_{3} = \frac{V}{R_{3}} = 2.0\,\mathrm{A}`],
          n: R`下の導線の電位を $0$ として、枝の分かれ目の電位 $V$ を未知数にすると、3 つの電流がすべて $V$ で書けます。第 1 法則 $I_{1}+I_{2}=I_{3}$ の 1 本だけで $V$ が決まります。電池が並列に入った回路では、連立方程式より速く解けることがあります。`,
          lv: 2
        },
        {
          t: 'ジュール熱の合計とエネルギーの保存（(4)）',
          m: [R`P = R_{1}I_{1}^{2} + R_{2}I_{2}^{2} + R_{3}I_{3}^{2} = 2.0\times3.0^{2} + 3.0\times1.0^{2} + 3.0\times2.0^{2} = 18 + 3.0 + 12 = 33\,\mathrm{W}`,
              R`\text{確かめ}:\quad E_{1}I_{1} = 36\,\mathrm{W} = 33\,\mathrm{W} + E_{2}\times|I_{2}|\ (= 3.0\,\mathrm{W})`],
          n: R`抵抗が 1 秒間に出すジュール熱は $RI^{2}$ です。$I^{2}$ なので、$I_{2}$ の符号は結果に関係しません。合計は 1 秒間に $33\,\mathrm{J}$ です。$E_{1}$ が 1 秒間に送り出すエネルギー $E_{1}I_{1}=36\,\mathrm{J}$ のうち、$33\,\mathrm{J}$ が抵抗の熱になり、残りの $3.0\,\mathrm{J}$ が $E_{2}$ の充電に使われています（エネルギー保存）。`,
          easy: R`抵抗に電流 $I$ が流れると熱が出ます。1 秒あたりの熱（電力）は $RI^{2}$ で、3 つの抵抗の分を足せば合計になります。電池 $E_{1}$ は、1 秒あたり $E_{1}I_{1}=12\times3.0=36\,\mathrm{J}$ のエネルギーを回路に送り出します。そのうち $33\,\mathrm{J}$ が熱になり、残りの $3.0\,\mathrm{J}$ が、充電される電池 $E_{2}$ に蓄えられます。`,
          pro: R`エネルギー保存で検算する。「電池が出す電力 $=$ 抵抗の消費電力 $+$ 充電される電池が受け取る電力」。`,
          lv: 1
        }
      ],
      tags: ['キルヒホッフの法則', '合成抵抗', 'オームの法則', '電力']
    },

    /* ---------- 電流と磁場 ---------- */
    {
      id: 'p-mid-mag-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-mag',
      title: '磁場中のイオンの円運動と質量分析',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`図のように、電荷 $+q$（$q=1.6\times10^{-19}\,\mathrm{C}$）をもつ 2 種類のイオン 1, 2 を、はじめ静止した状態から、電位差 $V=8.0\times10^{3}\,\mathrm{V}$ で加速した。加速されたイオンは、すきま O を通って、乾板の上側にある一様な磁場の領域（磁束密度 $B=0.50\,\mathrm{T}$、磁場の向きは紙面に垂直）に、乾板に垂直に入り、半円を描いて写真乾板に衝突した。イオン 1 の質量は $m_{1}=6.4\times10^{-26}\,\mathrm{kg}$、イオン 2 の質量は $m_{2}=1.0\times10^{-25}\,\mathrm{kg}$ である。イオンどうしの間にはたらく力と重力は無視できる。`,
      fig: figMassSpec(),
      parts: [
        {
          label: '(1)', q: R`磁場の向きはどちらか。`,
          type: 'choice',
          choices: [R`紙面の表から裏へ向かう向き`, R`紙面の裏から表へ向かう向き`],
          answer: 0,
          explain: R`正のイオンは、O で上向きに進みながら、左向きに力を受けて、反時計まわりに円運動をします。フレミングの左手の法則で、中指を電流の向き（正イオンの運動の向き＝上）に、親指を力の向き（左）に合わせると、人さし指（磁場の向き）は、紙面の表から裏へ向かう向きになります。`
        },
        { label: '(2)', q: R`イオン 1 が O を通過するときの速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 2.0e5, rel: 0.02, unit: 'm/s', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(3)', q: R`イオン 1 の軌道の半径は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.16, rel: 0.02, unit: 'm' },
        { label: '(4)', q: R`写真乾板上で、イオン 1 が衝突した位置 $\mathrm{P_{1}}$ とイオン 2 が衝突した位置 $\mathrm{P_{2}}$ の間隔は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.080, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: '磁場の向き（(1)）',
          n: R`図で、正のイオンは O で上向きに進み、円の中心（O の左側の乾板上）の向きである左へ力を受けて曲がり、反時計まわりに円運動します。フレミングの左手の法則を使います。中指を電流の向き（正イオンの運動の向き、上）に、親指を力の向き（左）に合わせると、人さし指が磁場の向きを指し、それは紙面の表から裏へ向かう向きです。`,
          easy: R`磁場の中を動く、電気をもった粒子は、動く向きにも磁場の向きにも垂直な向きに力を受けます（ローレンツ力）。力の向きは、フレミングの左手の法則（親指 = 力、人さし指 = 磁場、中指 = 電流の向き）で決めます。電流の向きは、正の電気をもつ粒子が動く向きです。`,
          pro: R`回る向きで判断してもよい。正電荷は、磁場が「表から裏」なら反時計まわり、「裏から表」なら時計まわりに回る。`,
          lv: 1
        },
        {
          t: '加速で得る速さ（(2)）',
          m: [R`qV = \frac{1}{2}m_{1}v_{1}^{2} \;\Longrightarrow\; v_{1} = \sqrt{\frac{2qV}{m_{1}}}`,
              R`v_{1} = \sqrt{\frac{2\times1.6\times10^{-19}\times8.0\times10^{3}}{6.4\times10^{-26}}} = \sqrt{4.0\times10^{10}} = 2.0\times10^{5}\,\mathrm{m/s}`],
          n: R`電位差 $V$ で加速されるとき、電場が電荷 $q$ にする仕事は $qV$ で、これがイオンの運動エネルギーの増加になります（はじめは静止）。磁場の中では、ローレンツ力は速度に垂直で仕事をしないので、速さは変わりません。`,
          easy: R`電場の中で電荷が動くと、電場が電荷に仕事をして、運動エネルギーが増えます。電圧 $V$ を通りぬけた電荷 $q$ がされる仕事は $qV$（電気量 × 電圧）です。はじめ止まっていたので、この仕事がすべて運動エネルギー $\dfrac{1}{2}mv^{2}$ になります。`,
          lv: 1
        },
        {
          t: '磁場中の円運動（(3)）',
          m: [R`m_{1}\frac{v_{1}^{2}}{r_{1}} = qv_{1}B \;\Longrightarrow\; r_{1} = \frac{m_{1}v_{1}}{qB}`,
              R`r_{1} = \frac{6.4\times10^{-26}\times2.0\times10^{5}}{1.6\times10^{-19}\times0.50} = 0.16\,\mathrm{m}`],
          n: R`ローレンツ力 $qvB$ は速度に垂直なので、円運動の向心力になります。円運動の運動方程式 $m\dfrac{v^{2}}{r}=qvB$ から、半径は $r=\dfrac{mv}{qB}$ です。`,
          easy: R`磁場の中では、荷電粒子は進む向きに垂直な力 $qvB$ を受け続けるので、等速円運動をします。円運動させる力（向心力）は $m\dfrac{v^{2}}{r}$ と表せるので、$m\dfrac{v^{2}}{r}=qvB$ とおいて、半径 $r$ を求めます。`,
          pro: R`加速と円運動をまとめると $r=\dfrac{1}{B}\sqrt{\dfrac{2mV}{q}}$。$q$・$V$・$B$ が同じなら、$r\propto\sqrt{m}$ になる。`,
          lv: 1
        },
        {
          t: '2 つのイオンの着点の間隔（(4)）',
          m: [R`\frac{r_{2}}{r_{1}} = \sqrt{\frac{m_{2}}{m_{1}}} = \sqrt{\frac{1.0\times10^{-25}}{6.4\times10^{-26}}} = 1.25 \;\Longrightarrow\; r_{2} = 0.20\,\mathrm{m}`,
              R`\mathrm{P_{1}P_{2}} = 2r_{2} - 2r_{1} = 2\times(0.20-0.16) = 0.080\,\mathrm{m}`],
          n: R`$r=\dfrac{1}{B}\sqrt{\dfrac{2mV}{q}}$ より、$q$・$V$・$B$ が同じなら $r\propto\sqrt{m}$ です。イオンは O から半円を描いて乾板に当たるので、O から着点までの距離は直径 $2r$ です。重いイオン 2 のほうが遠くに着き、着点の間隔は直径の差 $2(r_{2}-r_{1})$ です（半径の差ではないので注意）。`,
          easy: R`着点は、O から直径 $2r$ だけはなれたところです。イオン 1 は $2\times0.16=0.32\,\mathrm{m}$、イオン 2 は $2\times0.20=0.40\,\mathrm{m}$ のところに着きます。この差が、着点の間隔 $0.080\,\mathrm{m}$ です。重いイオンは曲がりにくいので、半径が大きく、遠くに着きます。着点の位置から質量がわかる、これが質量分析器のしくみです。`,
          lv: 1
        },
        {
          t: '参考: 半周にかかる時間',
          m: R`T = \frac{2\pi m}{qB},\qquad t_{1} = \frac{T}{2} = \frac{\pi m_{1}}{qB} = \frac{3.14\times6.4\times10^{-26}}{1.6\times10^{-19}\times0.50} \approx 2.5\times10^{-6}\,\mathrm{s}`,
          n: R`円運動の周期 $T=\dfrac{2\pi r}{v}=\dfrac{2\pi m}{qB}$ は、速さ $v$ や半径 $r$ によらず、質量 $m$ だけで決まります。イオン 1 が O から乾板に着くまでの時間は、半周ぶんの約 $2.5\times10^{-6}\,\mathrm{s}$ です。`,
          lv: 2
        }
      ],
      tags: ['ローレンツ力', '荷電粒子の円運動', '質量分析', 'フレミングの左手の法則']
    },

    /* ---------- 電磁誘導 ---------- */
    {
      id: 'p-mid-induction-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-induction',
      title: '磁場の領域を通りぬける正方形コイル',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`図のように、水平面内で、一辺 $a=0.20\,\mathrm{m}$ の正方形のコイル（1 巻き、抵抗 $R=0.20\,\Omega$）を、一定の速さ $v=2.0\,\mathrm{m/s}$ で右向きに動かして、幅 $w=0.40\,\mathrm{m}$ の一様な磁場の領域を通りぬけさせる。磁場の磁束密度は $B=0.50\,\mathrm{T}$ で、向きは紙面の表から裏である。コイルの面は磁場に垂直で、コイルの辺は領域の境界に平行なまま動く。コイルの右辺が領域の左端に達した時刻を $t=0$ とする（図はこの時刻のようすである）。コイルの自己誘導は無視する。`,
      fig: figCoilField(),
      parts: [
        { label: '(1)', q: R`コイルが磁場の領域に入りつつある間（$0<t<0.10\,\mathrm{s}$）の、誘導起電力の大きさは何 $\mathrm{V}$ か。`, type: 'num', answer: 0.20, rel: 0.02, unit: 'V' },
        { label: '(2)', q: R`(1) のとき、コイルを一定の速さで動かし続けるために必要な外力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 0.10, rel: 0.02, unit: 'N' },
        {
          label: '(3)', q: R`コイルを流れる電流 $I$ と時刻 $t$ の関係を表すグラフとして、もっとも適当なものはどれか。図で見て反時計まわりに流れる電流を正とする。$t<0$ と $t>0.30\,\mathrm{s}$ では、コイルに電流は流れない。`,
          type: 'choice',
          choices: [{ t: 'ア', fig: figCoilIt(1, 0, 1) }, { t: 'イ', fig: figCoilIt(1, 0, -1) }, { t: 'ウ', fig: figCoilIt(-1, 0, 1) }, { t: 'エ', fig: figCoilIt(1, 1, -1) }],
          answer: 1,
          explain: R`コイルが入っていく間（$0<t<0.10\,\mathrm{s}$）は、紙面の裏向きの磁束が増えるので、それを打ち消す表向きの磁場をつくる向き、つまり反時計まわり（正）に電流が流れます。コイル全体が磁場の中にある間（$0.10\,\mathrm{s}<t<0.20\,\mathrm{s}$）は、磁束が変化しないので、電流は $0$ です。出ていく間（$0.20\,\mathrm{s}<t<0.30\,\mathrm{s}$）は、裏向きの磁束が減るので、それを補う向き、つまり時計まわり（負）に電流が流れます。大きさは、どの区間も $1.0\,\mathrm{A}$ です。`
        },
        { label: '(4)', q: R`$t=0$ から $t=0.30\,\mathrm{s}$ までの間に、コイルで発生するジュール熱の総量は何 $\mathrm{J}$ か。`, type: 'num', answer: 0.040, rel: 0.02, unit: 'J' }
      ],
      solution: [
        {
          t: '磁束の変化と、誘導起電力（(1)）',
          m: [R`\Phi = B\times a\,(vt) \;\Longrightarrow\; V = \left|\frac{\Delta\Phi}{\Delta t}\right| = Bav`,
              R`V = 0.50\times0.20\times2.0 = 0.20\,\mathrm{V}`],
          n: R`コイルが領域に入っていく間は、磁場の中にある部分の面積が $a\times vt$ と一定の割合で増えるので、コイルを貫く磁束 $\Phi=Ba\,vt$ も一定の割合で増えます。ファラデーの電磁誘導の法則 $V=\left|\dfrac{\Delta\Phi}{\Delta t}\right|$ から、$V=Bav$ で一定です。磁場の中にある右辺が速さ $v$ で動く、導体棒の起電力 $vBa$ と考えても同じ式になります。`,
          easy: R`**磁束**は、コイルを貫く磁場の量（磁束密度 × 面積）です。コイルが磁場に入っていくと、磁場の中にある部分の面積が、1 秒間に $a\times v=0.20\times2.0=0.40\,\mathrm{m^{2}}$ ずつ増えます。したがって、磁束は 1 秒間に $0.50\times0.40=0.20\,\mathrm{Wb}$ ずつ増えます。電磁誘導の法則では、磁束が 1 秒間に変化する量が、そのまま起電力（単位 V）になります。`,
          lv: 1
        },
        {
          t: '電流と、動かすのに必要な外力（(2)）',
          m: [R`I = \frac{V}{R} = \frac{0.20}{0.20} = 1.0\,\mathrm{A}`,
              R`F_{\text{磁}} = IBa = 1.0\times0.50\times0.20 = 0.10\,\mathrm{N}`,
              R`F_{\text{外}} = F_{\text{磁}} = 0.10\,\mathrm{N}\quad(\text{等速なので力はつり合う})`],
          n: R`磁場の中にあるのは、コイルの右辺だけです（上下の辺は、一部が磁場の中にありますが、逆向きの電流が流れるので、力は打ち消し合います）。右辺を流れる電流 $I$ は、磁場から力 $IBa$ を受けます。この力は、レンツの法則どおり、コイルの運動をさまたげる向き（左向き）です。コイルを等速で動かすには、これとつり合う右向きの外力が必要です。`,
          easy: R`磁場の中を電流が流れると、導線は磁場から力を受けます（長さ $a$ の導線なら $IBa$）。今は右辺だけが磁場の中にあるので、右辺が受ける力を考えます。この力は、コイルが動くのをじゃまする向き（左向き）にはたらきます（誘導電流は、変化をさまたげる向きに流れるからです）。コイルを一定の速さで動かし続けるには、この力と同じ大きさで逆向きの力（外力）で引きつづける必要があります。`,
          pro: R`等速なら、外力 $=$ 磁場から受ける力。外力の仕事率 $Fv=0.10\times2.0=0.20\,\mathrm{W}$ は、ジュール熱の仕事率 $I^{2}R=1.0^{2}\times0.20=0.20\,\mathrm{W}$ と一致する。`,
          lv: 1
        },
        {
          t: '電流の向きと、I-t グラフ（(3)）',
          m: [R`0<t<0.10:\quad I = +1.0\,\mathrm{A}\ \ (\text{反時計まわり})`,
              R`0.10<t<0.20:\quad I = 0`,
              R`0.20<t<0.30:\quad I = -1.0\,\mathrm{A}\ \ (\text{時計まわり})`],
          n: R`入っていく間は、裏向きの磁束が増えるので、コイルは増加をさまたげる向き、つまり表向きの磁場をつくる向き（反時計まわり）に電流を流します。$0.10$〜$0.20\,\mathrm{s}$ は、コイル全体が磁場の中にあって磁束が変化しないので、起電力も電流も $0$ です。出ていく間（$0.20$〜$0.30\,\mathrm{s}$）は、裏向きの磁束が減るので、それを補う向き（裏向きの磁場をつくる時計まわり）に、同じ大きさ $1.0\,\mathrm{A}$ の電流が流れます。`,
          easy: R`**レンツの法則**: 誘導電流は、コイルを貫く磁束の変化を「打ち消す」向きに流れます。裏向きの磁束が増えるときは、表向きの磁場をつくる電流、減るときは、裏向きの磁場をつくる電流が流れます。反時計まわりの電流は、コイルの内側に表向き（手前向き）の磁場をつくります（右ねじの法則）。`,
          fig: figCoilIt(1, 0, -1),
          lv: 1
        },
        {
          t: 'ジュール熱（(4)）',
          m: [R`Q_{1} = I^{2}Rt = 1.0^{2}\times0.20\times0.10 = 0.020\,\mathrm{J}\quad(\text{入る間、出る間それぞれ})`,
              R`Q = 2\times0.020 = 0.040\,\mathrm{J}`,
              R`\left(\text{確かめ}:\ W = F\times2a = 0.10\times0.40 = 0.040\,\mathrm{J}\right)`],
          n: R`電流が流れるのは、入る間と出る間の $0.10\,\mathrm{s}$ ずつです。その間、$I^{2}R$ の割合でジュール熱が発生します。確かめとして、外力がする仕事 $F\times$（その間に動く距離）が、ジュール熱になります。電流が流れる間にコイルが動く距離は、入る間の $a$ と出る間の $a$ で、合計 $2a=0.40\,\mathrm{m}$ です。`,
          easy: R`電流が流れる時間は、入る間の $0.10\,\mathrm{s}$ と出る間の $0.10\,\mathrm{s}$ の合計 $0.20\,\mathrm{s}$ です。1 秒あたりのジュール熱は $I^{2}R=0.20\,\mathrm{J}$ なので、$0.20\times0.20=0.040\,\mathrm{J}$ です。コイルを引く外力のする仕事が、すべて熱に変わります。`,
          pro: R`エネルギー保存: 外力の仕事 $=$ ジュール熱。コイル全体が磁場の中にある間は、電流も外力も $0$。`,
          lv: 1
        }
      ],
      tags: ['電磁誘導', 'レンツの法則', 'ジュール熱', 'I-tグラフ']
    },

    /* ---------- 交流 ---------- */
    {
      id: 'p-mid-ac-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-ac',
      title: '変圧器を使った送電と電力損失',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`発電所の発電機は、周波数 $50\,\mathrm{Hz}$、実効値 $1.0\times10^{3}\,\mathrm{V}$ の交流電圧を出し、平均の電力 $1.0\times10^{5}\,\mathrm{W}$ を送り出している。この電力を、図のように、変圧器で電圧を高くして送電線で送り、町で変圧器を使って電圧を下げて、工場（負荷）で使う。送電線の抵抗の合計は $r=5.0\,\Omega$ である。変圧器はどちらも理想的で、電力の損失はない。電流と電圧の位相のずれは考えなくてよい（力率は $1$）。電圧と電流は、すべて実効値で表す。`,
      fig: figTransmission(false),
      parts: [
        { label: '(1)', q: R`送電線を流れる電流は何 $\mathrm{A}$ か。`, type: 'num', answer: 10, rel: 0.02, unit: 'A' },
        { label: '(2)', q: R`送電線で 1 秒間に失われる電力は何 $\mathrm{W}$ か。`, type: 'num', answer: 500, rel: 0.02, unit: 'W' },
        { label: '(3)', q: R`町の降圧変圧器の二次側に出る電圧は何 $\mathrm{V}$ か。`, type: 'num', answer: 995, rel: 0.001, unit: 'V' },
        { label: '(4)', q: R`変圧器を使わずに、発電機の電圧のまま、同じ電力 $1.0\times10^{5}\,\mathrm{W}$ を送電線に送り出したとすると、送電線で失われる電力は、変圧器を使った (2) の場合の何倍か。`, type: 'num', answer: 100, rel: 0.02, unit: '倍' }
      ],
      solution: [
        {
          t: '理想変圧器の電圧と電流の関係',
          m: R`\frac{V_{2}}{V_{1}} = \frac{N_{2}}{N_{1}},\qquad V_{1}I_{1} = V_{2}I_{2}`,
          n: R`理想的な変圧器では、一次側と二次側の電圧の比は巻数の比に等しく、電力（電圧 × 電流）は変わりません。電圧を $\dfrac{N_{2}}{N_{1}}$ 倍にすると、電流は $\dfrac{N_{1}}{N_{2}}$ 倍になります。`,
          easy: R`変圧器は、鉄心に巻いた 2 つのコイルでできていて、電磁誘導を利用しています。一次側のコイルに交流を流すと、鉄心の中の磁束が周期的に変化し、そのために二次側のコイルに交流の電圧が生じます。電圧は、コイルの巻数に比例します。エネルギーは増えも減りもしないので、電圧が 10 倍になれば、電流は $\dfrac{1}{10}$ になります。`,
          lv: 1
        },
        {
          t: '送電線を流れる電流（(1)）',
          m: [R`V_{2} = \frac{10}{1}\times V_{1} = 1.0\times10^{4}\,\mathrm{V}`,
              R`I_{2} = \frac{P}{V_{2}} = \frac{1.0\times10^{5}}{1.0\times10^{4}} = 10\,\mathrm{A}`],
          n: R`発電機が送り出す電力 $P=V_{1}I_{1}$ は、理想変圧器では変わらずに送電線へ渡されるので、$P=V_{2}I_{2}$ です。発電機側の電流は $I_{1}=\dfrac{P}{V_{1}}=1.0\times10^{2}\,\mathrm{A}$ で、送電線の電流 $I_{2}$ はその $\dfrac{1}{10}$ です。`,
          easy: R`電力は「電圧 × 電流」です。同じ電力を送るとき、電圧を 10 倍にすれば、電流は $\dfrac{1}{10}$ ですみます。`,
          lv: 1
        },
        {
          t: '送電線での電力損失（(2)）',
          m: R`P_{\text{損}} = I_{2}^{2}\,r = 10^{2}\times5.0 = 5.0\times10^{2}\,\mathrm{W}`,
          n: R`送電線の抵抗 $r$ に電流 $I_{2}$ が流れると、1 秒間に $I_{2}^{2}r$ のジュール熱が発生し、そのぶんの電力が失われます。これは、送り出した電力 $1.0\times10^{5}\,\mathrm{W}$ の $0.50\,\%$ です。`,
          easy: R`電流が抵抗を通ると、熱が出ます。その 1 秒あたりの量（電力）は $I^{2}r$ です。電流の 2 乗に比例するので、電流を小さくすると、熱による損失は、それよりずっと小さくなります。`,
          pro: R`損失は $I^{2}r=\left(\dfrac{P}{V}\right)^{2}r$。同じ電力なら、送電電圧 $V$ を高くするほど、損失は $V^{2}$ に反比例して減る。`,
          lv: 1
        },
        {
          t: '町で使える電圧（(3)）',
          m: [R`\Delta V = I_{2}\,r = 10\times5.0 = 50\,\mathrm{V}`,
              R`V_{3} = V_{2} - \Delta V = 1.0\times10^{4} - 50 = 9950\,\mathrm{V}`,
              R`V_{4} = \frac{1}{10}\,V_{3} = 995\,\mathrm{V}`],
          n: R`送電線にも抵抗があるので、電流が流れると、そこで電圧が下がります（オームの法則による電圧降下 $\Delta V=I_{2}r$）。そのため、町の降圧変圧器の一次側にかかる電圧は $9950\,\mathrm{V}$ です。巻数比が $10:1$ なので、二次側の電圧はその $\dfrac{1}{10}$ で、$995\,\mathrm{V}$ です（発電機の電圧より $5\,\mathrm{V}$ 低くなります）。`,
          easy: R`送電線は長いので、電気抵抗があります。抵抗に電流が流れると、電圧が下がります（$V=Ir$、オームの法則）。町に届くときの電圧は、送り出した $1.0\times10^{4}\,\mathrm{V}$ より $50\,\mathrm{V}$ だけ低くなっています。それを $\dfrac{1}{10}$ にしたものが、工場で使う電圧です。`,
          fig: figTransmission(true),
          lv: 1
        },
        {
          t: '変圧器を使わない場合との比較（(4)）',
          m: [R`I = \frac{P}{V_{1}} = \frac{1.0\times10^{5}}{1.0\times10^{3}} = 1.0\times10^{2}\,\mathrm{A}`,
              R`P_{\text{損}}' = I^{2}r = (1.0\times10^{2})^{2}\times5.0 = 5.0\times10^{4}\,\mathrm{W}`,
              R`\frac{P_{\text{損}}'}{P_{\text{損}}} = \frac{5.0\times10^{4}}{5.0\times10^{2}} = 100`],
          n: R`変圧器を使わないと、送電線には $100\,\mathrm{A}$ が流れます。損失は電流の 2 乗に比例するので、電流が 10 倍だと損失は $10^{2}=100$ 倍です。このときの損失 $5.0\times10^{4}\,\mathrm{W}$ は、送り出す電力 $1.0\times10^{5}\,\mathrm{W}$ の半分にもなり、送電として実用になりません。`,
          pro: R`電圧を $n$ 倍にすると、電流は $\dfrac{1}{n}$、損失は $\dfrac{1}{n^{2}}$。高電圧で送電する理由を、この比で説明できるようにしておく。`,
          lv: 1
        }
      ],
      tags: ['変圧器', '送電', '電力損失', '実効値']
    },

    /* ---------- 光の粒子性 ---------- */
    {
      id: 'p-mid-photon-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-photon',
      title: 'X 線の発生とブラッグ反射',
      source: { univ: 'オリジナル' },
      time: 12,
      body: R`X 線管の陰極から出た電子（電気量 $-e$）を、電圧 $V=3.0\times10^{4}\,\mathrm{V}$ で加速して、陽極のターゲットに衝突させたところ、波長が連続的に分布する連続 X 線と、ターゲットの金属に特有の特性 X 線が出た。この X 線を、図のように、原子面の間隔が $d=2.5\times10^{-10}\,\mathrm{m}$ の結晶に当てた。X 線と原子面のなす角 $\theta$ を $0$ から少しずつ大きくしていくと、$\sin\theta=0.30$ になったとき、特性 X 線がはじめて強く反射された。プランク定数を $h=6.6\times10^{-34}\,\mathrm{J\cdot s}$、光の速さを $c=3.0\times10^{8}\,\mathrm{m/s}$、電気素量を $e=1.6\times10^{-19}\,\mathrm{C}$ とする。`,
      fig: figBragg(),
      parts: [
        { label: '(1)', q: R`連続 X 線の最短波長は何 $\mathrm{m}$ か。`, type: 'num', answer: 4.1e-11, rel: 0.02, unit: 'm', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(2)', q: R`特性 X 線の波長は何 $\mathrm{m}$ か。`, type: 'num', answer: 1.5e-10, rel: 0.02, unit: 'm', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(3)', q: R`$\sin\theta=0.30$ のとき、特性 X 線とは波長の異なる X 線で、同じ角度で強く反射されるものは何種類あるか。連続 X 線には、(1) の最短波長以上の、あらゆる波長の X 線がふくまれているものとする。`, type: 'num', answer: 2, rel: 0.02, unit: '種類' },
        {
          label: '(4)', q: R`X 線管にかける電圧を $6.0\times10^{4}\,\mathrm{V}$ に上げた。連続 X 線の最短波長と、特性 X 線の波長は、それぞれどうなるか。`,
          type: 'choice',
          choices: [
            R`最短波長は短くなり、特性 X 線の波長も短くなる。`,
            R`最短波長は長くなり、特性 X 線の波長は変わらない。`,
            R`最短波長も、特性 X 線の波長も変わらない。`,
            R`最短波長は短くなり、特性 X 線の波長は変わらない。`
          ],
          answer: 3,
          explain: R`連続 X 線の最短波長は $\lambda_{\min}=\dfrac{hc}{eV}$ で、電圧 $V$ に反比例して短くなります（電圧が 2 倍なら半分）。いっぽう、特性 X 線は、ターゲットの原子の内側の軌道の電子が抜けたあとに、外側の電子が落ちこむときに出る X 線で、その波長は原子の種類（エネルギー準位の差）で決まり、電圧によって変わりません。`
        }
      ],
      solution: [
        {
          t: '連続 X 線の最短波長（(1)）',
          m: [R`K = eV = 1.6\times10^{-19}\times3.0\times10^{4} = 4.8\times10^{-15}\,\mathrm{J}`,
              R`K = h\nu_{\max} = \frac{hc}{\lambda_{\min}} \;\Longrightarrow\; \lambda_{\min} = \frac{hc}{eV}`,
              R`\lambda_{\min} = \frac{6.6\times10^{-34}\times3.0\times10^{8}}{4.8\times10^{-15}} \approx 4.1\times10^{-11}\,\mathrm{m}`],
          n: R`電子は電圧 $V$ で加速されて、運動エネルギー $K=eV$ をもってターゲットに衝突します。連続 X 線は、電子がターゲットの原子核の近くで減速されるときに出る光子で、電子が失った運動エネルギーが光子のエネルギー $h\nu=\dfrac{hc}{\lambda}$ になります。電子の運動エネルギーのすべてが 1 個の光子になったとき、光子のエネルギーは最大（振動数が最大、波長が最短）です。`,
          easy: R`X 線は光の仲間で、「光子」というエネルギーのつぶとして考えます。光子 1 個のエネルギーは $h\nu=\dfrac{hc}{\lambda}$ で、波長が短いほど大きくなります。加速された電子が持つエネルギー $eV$ を、全部 1 個の光子に渡したときが、いちばんエネルギーの大きい（波長の短い）X 線です。これより短い波長の X 線は、エネルギーが足りないので出てきません。`,
          fig: figXrayTube(),
          pro: R`$\lambda_{\min}=\dfrac{hc}{eV}$ は、ターゲットの種類によらず、電圧だけで決まる。$\lambda_{\min}\,[\mathrm{nm}]\approx\dfrac{1.24}{V\,[\mathrm{kV}]}$ を覚えておくと速い（今回は $\dfrac{1.24}{30}=0.041\,\mathrm{nm}$）。`,
          lv: 1
        },
        {
          t: 'ブラッグ反射の条件（(2)）',
          m: [R`2d\sin\theta = n\lambda\qquad(n=1,\,2,\,3,\,\cdots)`,
              R`\lambda_{K} = 2d\sin\theta = 2\times2.5\times10^{-10}\times0.30 = 1.5\times10^{-10}\,\mathrm{m}`],
          n: R`結晶の、となり合う原子面で反射した X 線は、下の面で反射したぶんだけ余分に進みます。その経路差は $2d\sin\theta$ で、これが波長の整数倍のとき、反射した X 線どうしが強め合います。角 $\theta$ を小さい方から大きくしていって、はじめて強く反射されるのは $n=1$ のときなので、特性 X 線の波長は $\lambda_{K}=2d\sin\theta$ です。ここでの $\theta$ は、法線ではなく、原子面と X 線のなす角（図）です。`,
          easy: R`となり合う 2 つの原子面で反射した X 線をくらべると、下の面で反射したほうが、往復で $2d\sin\theta$ だけ余分に進みます（図の 2 本の X 線）。この余分な長さが波長の $1$ 倍、$2$ 倍、…のときだけ、反射した X 線どうしの山と山が重なって、強め合います。それがブラッグ反射です。`,
          lv: 1
        },
        {
          t: '同じ角度で強く反射される波長（(3)）',
          m: [R`\lambda = \frac{2d\sin\theta}{n} = \frac{1.5\times10^{-10}}{n}\,\mathrm{m}`,
              R`\lambda\ge\lambda_{\min} \;\Longrightarrow\; n \le \frac{1.5\times10^{-10}}{4.1\times10^{-11}} \approx 3.7 \;\Longrightarrow\; n=1,\ 2,\ 3`,
              R`\lambda = 1.5\times10^{-10},\ \ 7.5\times10^{-11},\ \ 5.0\times10^{-11}\,\mathrm{m}`],
          n: R`$\theta$ が同じなら、$2d\sin\theta=1.5\times10^{-10}\,\mathrm{m}$ も同じなので、$n\lambda$ がこの値に等しい波長の X 線だけが強く反射されます。連続 X 線には、最短波長 $\lambda_{\min}$ 以上のあらゆる波長がふくまれているので、$n=1,\,2,\,3$ の 3 つの波長が反射されます。$n=1$ の波長 $1.5\times10^{-10}\,\mathrm{m}$ は特性 X 線の波長なので、それとは異なる波長は、$n=2,\,3$ の $7.5\times10^{-11}\,\mathrm{m}$ と $5.0\times10^{-11}\,\mathrm{m}$ の **2 種類**です。$n=4$ の $3.75\times10^{-11}\,\mathrm{m}$ は、最短波長より短く、そもそも X 線管から出ていません。`,
          easy: R`同じ角度 $\theta$ のとき、条件式 $2d\sin\theta=n\lambda$ の左辺は同じ値 $1.5\times10^{-10}\,\mathrm{m}$ です。右辺の $n\lambda$ がこの値になる波長を、$n=1,\,2,\,3,\,\cdots$ と順に書き出して、X 線管から実際に出ている波長（$4.1\times10^{-11}\,\mathrm{m}$ 以上）のものだけを数えます。`,
          pro: R`$2d\sin\theta=n\lambda$ を満たす $\lambda$ を全部書き出し、$\lambda\ge\lambda_{\min}$ のものだけを数える。$n=1$ は特性 X 線と同じ波長なので、数えないこと。`,
          lv: 1
        },
        {
          t: '電圧を上げたとき（(4)）',
          m: R`\lambda_{\min} = \frac{hc}{eV} \propto \frac{1}{V}\qquad(V\ \text{が 2 倍} \;\Rightarrow\; \lambda_{\min}\ \text{は半分})`,
          n: R`電圧を上げると、電子の運動エネルギー $eV$ が大きくなるので、最短波長 $\lambda_{\min}=\dfrac{hc}{eV}$ は短くなります（$6.0\times10^{4}\,\mathrm{V}$ なら $2.1\times10^{-11}\,\mathrm{m}$）。いっぽう、特性 X 線の波長は、ターゲットの原子の種類で決まり、電圧には関係しません。したがって、「最短波長は短くなり、特性 X 線の波長は変わらない」が正解です。`,
          easy: R`連続 X 線は、電子のエネルギーが光に変わったもので、電圧が高いほどエネルギーの大きい（波長の短い）X 線まで出ます。特性 X 線は、ターゲットの原子が出す、その原子に決まった波長の光です。原子の中のエネルギー準位は、電圧を変えても変わらないので、波長も変わりません。`,
          lv: 1
        },
        {
          t: '参考: 特性 X 線の光子のエネルギー',
          m: R`E_{K} = \frac{hc}{\lambda_{K}} = \frac{6.6\times10^{-34}\times3.0\times10^{8}}{1.5\times10^{-10}} = 1.32\times10^{-15}\,\mathrm{J} \approx 8.3\times10^{3}\,\mathrm{eV}`,
          n: R`特性 X 線の光子 1 個のエネルギーは約 $8.3\,\mathrm{keV}$ です。電子の運動エネルギー $eV=30\,\mathrm{keV}$ のほうが大きいので、電子が原子の内側の軌道の電子をたたき出して、特性 X 線を出させることができます。`,
          lv: 2
        }
      ],
      tags: ['X線', 'ブラッグ反射', '光子', '最短波長']
    },

    /* ---------- 原子構造 ---------- */
    {
      id: 'p-mid-atom-01',
      subject: 'physics',
      level: 'mid',
      unit: 'p-atom',
      title: 'α 崩壊のエネルギーと運動量',
      source: { univ: 'オリジナル' },
      time: 10,
      body: R`原子番号 $84$、質量数 $210$ のポロニウム Po の原子核は、α 線（ヘリウムの原子核で、陽子 2 個と中性子 2 個からなる）を出して、鉛 Pb の原子核に変わる。静止していた Po の原子核が、α 崩壊した。Po 原子の質量は $209.98287\,\mathrm{u}$、崩壊後にできた Pb 原子の質量は $205.97447\,\mathrm{u}$、ヘリウム原子の質量は $4.00260\,\mathrm{u}$ である。原子の質量は電子をふくんでいるが、原子の質量の差を、そのまま原子核の質量の差として使ってよい。ここで $\mathrm{u}$ は原子質量単位で、$1\,\mathrm{u}$ の質量に相当するエネルギーは $931.5\,\mathrm{MeV}$ である。α 線と Pb の原子核の速さは光速よりずっと小さく、運動エネルギーは $\dfrac{1}{2}mv^{2}$ で表してよい。α 線と Pb の原子核の質量の比は、質量数の比（$4:206$）に等しいとする。`,
      fig: figAlphaDecay(),
      parts: [
        { label: '(1)', q: R`崩壊後にできた Pb の原子核にふくまれる中性子の数はいくつか。`, type: 'num', answer: 124, rel: 0.002, unit: '個' },
        { label: '(2)', q: R`この崩壊で生じる質量欠損は何 $\mathrm{u}$ か。`, type: 'num', answer: 5.80e-3, rel: 0.02, unit: 'u', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(3)', q: R`この崩壊で放出されるエネルギー（α 線と Pb の原子核の運動エネルギーの和）は何 $\mathrm{MeV}$ か。`, type: 'num', answer: 5.40, rel: 0.01, unit: 'MeV' },
        { label: '(4)', q: R`α 線の運動エネルギーは何 $\mathrm{MeV}$ か。`, type: 'num', answer: 5.30, rel: 0.005, unit: 'MeV' }
      ],
      solution: [
        {
          t: '崩壊後の原子核（(1)）',
          m: [R`\text{質量数}:\quad 210 = A + 4 \;\Longrightarrow\; A = 206`,
              R`\text{原子番号}:\quad 84 = Z + 2 \;\Longrightarrow\; Z = 82`,
              R`\text{中性子の数} = A - Z = 206 - 82 = 124`],
          n: R`α 線は、陽子 2 個と中性子 2 個からなるヘリウムの原子核で、質量数 $4$、原子番号 $2$ です。崩壊の前後で、質量数（陽子と中性子の数の合計）と原子番号（陽子の数）は変わりません。したがって、Pb の原子核は、質量数 $206$、原子番号 $82$ で、中性子の数は「質量数 $-$ 原子番号」で $124$ 個です。`,
          easy: R`原子核は、陽子と中性子でできています。原子番号は陽子の数、質量数は陽子と中性子の数の合計です。α 線は、陽子 2 個と中性子 2 個のかたまりなので、Po の原子核から α 線が出ていくと、陽子が $2$ 個、陽子と中性子の合計が $4$ 個減ります。中性子の数は、「質量数 $-$ 原子番号」で求めます。`,
          lv: 1
        },
        {
          t: '質量欠損（(2)）',
          m: [R`\Delta m = M_{\mathrm{Po}} - \left(M_{\mathrm{Pb}} + M_{\mathrm{He}}\right)`,
              R`\Delta m = 209.98287 - (205.97447 + 4.00260) = 0.00580\,\mathrm{u} = 5.80\times10^{-3}\,\mathrm{u}`],
          n: R`崩壊の前後では、全体の質量が少し減ります。この減った質量が質量欠損 $\Delta m$ です。原子の質量で計算してよいのは、電子の数が崩壊の前後で等しい（Po の電子 $84$ 個 $=$ Pb の電子 $82$ 個 $+$ He の電子 $2$ 個）ので、電子の質量が差の中で打ち消し合うからです。`,
          easy: R`崩壊したあとのもの（Pb と α 線）の質量の合計は、もとの Po の質量より、わずかに軽くなっています。軽くなった分は、消えたのではなく、エネルギーに変わります（次のステップ）。「もとの質量 $-$ あとの質量の合計」が質量欠損です。`,
          lv: 1
        },
        {
          t: '放出されるエネルギー（(3)）',
          m: [R`E = \Delta m\,c^{2}`,
              R`Q = 5.80\times10^{-3}\times931.5 \approx 5.40\,\mathrm{MeV}`],
          n: R`アインシュタインの関係 $E=mc^{2}$ から、質量欠損 $\Delta m$ に相当するエネルギーが放出されます。$1\,\mathrm{u}$ が $931.5\,\mathrm{MeV}$ に相当するので、$\Delta m\,[\mathrm{u}]$ に $931.5\,\mathrm{MeV}$ をかければ、そのままエネルギーが求まります。このエネルギーは、α 線と Pb の原子核の運動エネルギーの和になります。`,
          easy: R`質量とエネルギーは、同じものの別の見方で、$E=mc^{2}$ で結ばれています（$c$ は光速）。質量が減ると、その分のエネルギーが出てきます。問題で、「$1\,\mathrm{u}$ は $931.5\,\mathrm{MeV}$」と教えてくれているので、$\Delta m$ にこれをかけるだけです。`,
          pro: R`質量欠損 $[\mathrm{u}]\times931.5=$ エネルギー $[\mathrm{MeV}]$ をそのまま使う（$c^{2}$ の計算は不要）。`,
          lv: 1
        },
        {
          t: '運動量保存と、運動エネルギーの分配（(4)）',
          m: [R`0 = mv - MV \;\Longrightarrow\; mv = MV\ (=p)`,
              R`K_{\alpha} = \frac{p^{2}}{2m},\quad K_{\mathrm{Pb}} = \frac{p^{2}}{2M} \;\Longrightarrow\; K_{\alpha}:K_{\mathrm{Pb}} = M:m = 206:4`,
              R`K_{\alpha} = Q\times\frac{206}{206+4} = 5.40\times\frac{206}{210} \approx 5.30\,\mathrm{MeV}\qquad(K_{\mathrm{Pb}}\approx0.10\,\mathrm{MeV})`],
          n: R`はじめ静止していたので、崩壊のあとの運動量の和も $0$ です。α 線（質量 $m$、速さ $v$）と Pb の原子核（質量 $M$、速さ $V$）は、逆向きに同じ大きさの運動量 $p$ で飛び出します。運動エネルギーは $K=\dfrac{p^{2}}{2m}$ と書けるので、質量に反比例します。軽い α 線が、放出エネルギー $Q$ のほとんど（$\dfrac{206}{210}\approx98\,\%$）を受け取ります。`,
          easy: R`止まっていたものが 2 つに分かれて飛び出すとき、2 つの運動量（質量 × 速さ）は、同じ大きさで逆向きです。同じ運動量なら、軽いほうが速く、運動エネルギーも大きくなります（$K=\dfrac{p^{2}}{2m}$）。そこで、全体のエネルギー $Q=5.40\,\mathrm{MeV}$ を、質量の逆の比 $M:m=206:4$ で分けます。α 線は、$5.40$ の $\dfrac{206}{210}$ にあたります。`,
          pro: R`静止した原子核が 2 つに分かれるとき、運動エネルギーは質量の逆比に分配される（$K\propto\dfrac{1}{m}$）。$K_{\alpha}=Q\times\dfrac{M}{M+m}$。`,
          lv: 1
        },
        {
          t: '参考: α 線の速さ',
          m: R`v = \sqrt{\frac{2K_{\alpha}}{m}} = \sqrt{\frac{2\times5.30\times1.6\times10^{-13}}{4.0026\times1.66\times10^{-27}}} \approx 1.6\times10^{7}\,\mathrm{m/s}`,
          n: R`$1\,\mathrm{MeV}=1.6\times10^{-13}\,\mathrm{J}$、$1\,\mathrm{u}=1.66\times10^{-27}\,\mathrm{kg}$ を使うと、α 線の速さは約 $1.6\times10^{7}\,\mathrm{m/s}$ で、光速の約 $5\,\%$ です。光速よりずっと小さいので、問題文のとおり、非相対論的な運動エネルギーの式で考えてよいことが確かめられます。`,
          lv: 2
        }
      ],
      tags: ['α崩壊', '質量欠損', '運動量保存', '原子核']
    }
  ]);
})();
