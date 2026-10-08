/* GOKAKU NAVI — 物理 問題バンク（基礎レベル）
   物理の単元 p-kin 〜 p-atom の 21 単元を 1 問ずつ。教科書章末〜共通テスト標準（2〜3 設問）。
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
  // 寸法線（両端に短い目盛り）。horizontal: y を固定して x1〜x2 / vertical: x を固定して y1〜y2
  function dimH(d, x1, x2, y, label, ly, size) {
    d.line(x1, y, x2, y, { cls: 'dim', w: 1 });
    d.line(x1, y - 5, x1, y + 5, { cls: 'dim', w: 1 });
    d.line(x2, y - 5, x2, y + 5, { cls: 'dim', w: 1 });
    if (label) d.text((x1 + x2) / 2, ly == null ? y + 16 : ly, label, { size: size || 12 });
  }
  function dimV(d, x, y1, y2, label, lx, anchor, size) {
    d.line(x, y1, x, y2, { cls: 'dim', w: 1 });
    d.line(x - 5, y1, x + 5, y1, { cls: 'dim', w: 1 });
    d.line(x - 5, y2, x + 5, y2, { cls: 'dim', w: 1 });
    if (label) d.text(lx, (y1 + y2) / 2 + 4, label, { size: size || 12, anchor: anchor || 'end' });
  }

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // p-kin: ブレーキをかけた自動車の v-t グラフ（sol = true で面積の値を書き込む）
  function figBrake(sol) {
    const v = function (t) { return t <= 0.5 ? 20 : Math.max(0, 20 - 5 * (t - 0.5)); };
    return G({
      w: 340, h: 230, x: [0, 5], y: [0, 24], axis: ['t [s]', 'v [m/s]'],
      curves: [{ f: v, cls: 'c1' }],
      fills: [
        { f: v, from: 0, to: 0.5, cls: 'f3' },
        { f: v, from: 0.5, to: 4.5, cls: 'f1' }
      ],
      vlines: [{ x: 0.5, label: '0.5 s', dash: true }, { x: 4.5, label: '4.5 s', dash: true }],
      labels: sol
        ? [{ x: 0.03, y: 9, text: '10 m', cls: 'c3' }, { x: 1.4, y: 5, text: '40 m', cls: 'c1' }]
        : [{ x: 0.12, y: 21.8, text: '①', cls: 'c3' }, { x: 2.0, y: 5.5, text: '②', cls: 'c1' }]
    });
  }

  // p-fall: ビルの屋上から水平に投げた小球
  function figHoriz() {
    const d = D(360, 244);
    const s = 7, xw = 112, yg = 192, h = 19.6, v0 = 10, g = 9.8;
    const yt = yg - s * h;
    d.hatch(8, yg, 352, yg);
    d.poly([[58, yg], [xw, yg], [xw, yt], [58, yt]], { cls: 'fg', fill: 'f0' });
    let p = '';
    for (let k = 0; k <= 40; k++) {
      const t = 2 * k / 40;
      p += (k ? ' L' : 'M') + (xw + s * v0 * t).toFixed(1) + ' ' + (yt + s * 0.5 * g * t * t).toFixed(1);
    }
    d.path(p, { cls: 'c1', dash: true });
    d.arrow(xw, yt, xw + 56, yt, { cls: 'c3' });
    d.text(xw + 4, yt - 8, 'v₀ = 10 m/s', { cls: 'c3', anchor: 'start', size: 12 });
    d.dot(xw, yt, { cls: 'c3', r: 4 });
    const xl = xw + s * v0 * 2;
    d.dot(xl, yg, { cls: 'c2', r: 4 });
    d.text(xl, yg - 10, '落下点', { cls: 'c2', size: 12 });
    dimV(d, 44, yt, yg, '19.6 m', 38, 'end');
    dimH(d, xw, xl, 214, 'ビルの真下からの水平距離', 234);
    d.text(85, yt + 36, 'ビル', { size: 12 });
    return d.svg();
  }

  // p-rigid: ちょうつがいで壁にとりつけた棒（sol = true で棒にはたらく力を描き込む）
  function figRod(sol) {
    const d = D(360, 240);
    const xA = 56, yA = 146, L = 200, xB = xA + L;
    const yC = yA - L * Math.tan(PI / 6);
    const xG = xA + L / 2;
    d.hatch(xA, 12, xA, 226, { side: 1 });
    d.line(xB, yA, xA, yC, { cls: 'c3', w: 1.6 });
    d.line(xA, yA, xB, yA, { cls: 'fg', w: 5 });
    d.circle(xA, yA, 6, { cls: 'fg', fill: 'f0' });
    d.dot(xA, yC, { cls: 'c3', r: 3 });
    d.angle(xB, yA, 38, 150, 180, '30°', { cls: 'c3' });
    d.text(xB + 10, yA - 8, 'B', { size: 14, italic: true, anchor: 'start' });
    d.text(xA + 9, yC - 6, 'C', { size: 14, italic: true, anchor: 'start' });
    d.text(134, 68, 'T', { size: 14, italic: true, cls: 'c3' });
    if (!sol) {
      d.text(xA + 14, yA + 24, 'A', { size: 14, italic: true, anchor: 'start' });
      d.dot(xG, yA, { cls: 'c1', r: 3.5 });
      d.text(xG, yA + 20, 'G（棒の中点）', { size: 12 });
      d.line(xB, yA, xB, yA + 36, { cls: 'fg', w: 1.3 });
      d.rect(xB - 15, yA + 36, 30, 28, { cls: 'fg', fill: 'f2', rx: 3 });
      d.text(xB + 22, yA + 55, '1.0 kg', { size: 12, anchor: 'start' });
      d.text(xA + 14, 226, '一様な棒 AB（質量 2.0 kg、長さ 1.0 m）', { size: 12, anchor: 'start' });
    } else {
      d.text(xA + 14, yA + 40, 'A', { size: 14, italic: true, anchor: 'start' });
      d.dot(xG, yA, { cls: 'c1', r: 3.5 });
      d.text(xG - 8, yA - 8, 'G', { size: 12, anchor: 'end' });
      arr(d, xG, yA, xG, yA + 54, 'Mg', 'c2', xG + 6, yA + 52);
      arr(d, xB, yA, xB, yA + 54, 'mg', 'c2', xB + 6, yA + 52);
      arr(d, xB, yA, xB - 80 * Math.cos(PI / 6), yA - 80 * Math.sin(PI / 6), '', 'c3', 0, 0);
      arr(d, xA + 10, yA - 4, xA + 10, yA - 62, 'V', 'c1', xA + 18, yA - 48);
      arr(d, xA + 6, yA + 16, xA + 66, yA + 16, 'H', 'c1', xA + 72, yA + 20);
      d.text(xA + 14, 226, '重力 Mg は G、おもりの重力 mg は B にはたらく', { size: 12, anchor: 'start', cls: 'dim' });
    }
    return d.svg();
  }

  // p-eom: なめらかな水平面上で糸でつないだ 2 物体（sol = true で各物体にはたらく水平方向の力を描く）
  function figTwoBlocks(sol) {
    const d = D(360, sol ? 190 : 170);
    if (!sol) {
      const yf = 124;
      d.hatch(10, yf, 350, yf);
      d.rect(40, yf - 40, 56, 40, { cls: 'c1', fill: 'f1', rx: 3 });
      d.rect(150, yf - 40, 74, 40, { cls: 'c2', fill: 'f2', rx: 3 });
      d.line(96, yf - 20, 150, yf - 20, { cls: 'fg', w: 1.5 });
      d.arrow(224, yf - 20, 324, yf - 20, { cls: 'c3', w: 2.5 });
      d.text(68, yf - 14, 'A', { size: 15, italic: true });
      d.text(187, yf - 14, 'B', { size: 15, italic: true });
      d.text(68, yf - 48, '2.0 kg', { size: 12 });
      d.text(187, yf - 48, '3.0 kg', { size: 12 });
      d.text(273, yf - 30, 'F = 15 N', { size: 12, cls: 'c3' });
      d.text(123, yf - 28, '糸', { size: 12, cls: 'dim' });
      d.text(180, 156, '水平面: なめらか', { size: 12, cls: 'dim' });
    } else {
      d.text(180, 16, 'A にはたらく水平方向の力', { size: 12, cls: 'dim' });
      d.rect(100, 26, 70, 36, { cls: 'c1', fill: 'f1', rx: 3 });
      d.text(135, 49, 'A', { size: 15, italic: true });
      arr(d, 170, 44, 232, 44, 'T', 'fg', 238, 48);
      d.text(180, 98, 'B にはたらく水平方向の力', { size: 12, cls: 'dim' });
      d.rect(100, 108, 90, 36, { cls: 'c2', fill: 'f2', rx: 3 });
      d.text(145, 131, 'B', { size: 15, italic: true });
      arr(d, 100, 126, 40, 126, 'T', 'fg', 28, 130, 'end');
      arr(d, 190, 126, 270, 126, 'F', 'c3', 276, 130);
      d.text(180, 176, '右向きを正とする', { size: 12, cls: 'dim' });
    }
    return d.svg();
  }

  // p-momentum: 台車の正面衝突（衝突前・衝突後）
  function figCarts() {
    const d = D(360, 258);
    function cart(x, w, yr, cls, fill, label) {
      d.rect(x, yr - 40, w, 28, { cls: cls, fill: fill, rx: 3 });
      d.circle(x + 14, yr - 6, 6, { cls: 'fg', fill: 'f0' });
      d.circle(x + w - 14, yr - 6, 6, { cls: 'fg', fill: 'f0' });
      d.text(x + w / 2, yr - 21, label, { size: 15, italic: true });
    }
    d.text(14, 18, '衝突前', { anchor: 'start', size: 12, bold: true });
    d.line(14, 106, 346, 106, { cls: 'fg', w: 1.6 });
    cart(60, 62, 106, 'c1', 'f1', 'A');
    cart(232, 46, 106, 'c2', 'f2', 'B');
    d.arrow(62, 56, 118, 56, { cls: 'c3' });
    d.text(90, 46, '4.0 m/s', { cls: 'c3', size: 12 });
    d.arrow(276, 56, 230, 56, { cls: 'c3' });
    d.text(253, 46, '2.0 m/s', { cls: 'c3', size: 12 });
    d.text(91, 126, '3.0 kg', { size: 12 });
    d.text(255, 126, '1.0 kg', { size: 12 });
    d.text(14, 150, '衝突後', { anchor: 'start', size: 12, bold: true });
    d.line(14, 226, 346, 226, { cls: 'fg', w: 1.6 });
    cart(130, 62, 226, 'c1', 'f1', 'A');
    cart(192, 46, 226, 'c2', 'f2', 'B');
    d.arrow(134, 176, 206, 176, { cls: 'c3', dash: true });
    d.text(214, 180, 'v′', { cls: 'c3', size: 14, italic: true, anchor: 'start' });
    d.text(180, 248, '2 台はくっついて一体となる（右向きを正とする）', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // p-energy: 斜め上に引かれる物体（sol = true で力の分解を描く）
  function figPull(sol) {
    const d = D(360, 216);
    const yf = 152, x0 = 140, y0 = 130;
    const ex = x0 + 80, ey = y0 - 60;
    d.hatch(10, yf, 350, yf);
    d.rect(70, yf - 42, 70, 42, { cls: 'fg', fill: 'f1', rx: 3 });
    d.text(105, yf - 15, '5.0 kg', { size: 12 });
    d.rect(250, yf - 42, 70, 42, { cls: 'dim', dash: true, rx: 3 });
    d.arrow(x0, y0, ex, ey, { cls: 'c3', w: 2.5 });
    d.text(ex + 8, ey - 2, 'F = 20 N', { cls: 'c3', size: 12, anchor: 'start' });
    d.line(x0, y0, 208, y0, { cls: 'dim', dash: true, w: 1.2 });
    d.angle(x0, y0, 46, 0, 36.87, 'θ', { cls: 'c3' });
    if (sol) {
      d.line(ex, y0, ex, ey, { cls: 'c1', dash: true, w: 1.6 });
      d.line(x0, y0, ex, y0, { cls: 'c1', dash: true, w: 1.6 });
      d.text(ex + 8, (y0 + ey) / 2 + 4, 'F sinθ', { cls: 'c1', size: 12, anchor: 'start' });
      d.text((x0 + ex) / 2 + 14, y0 + 16, 'F cosθ', { cls: 'c1', size: 12 });
      arr(d, 70, yf - 10, 26, yf - 10, 'f′', 'c2', 22, yf - 16, 'end');
    }
    dimH(d, 105, 285, 186, '移動距離 5.0 m', 206);
    d.text(190, 22, '床: あらい（動摩擦係数 0.10）', { size: 12, cls: 'dim' });
    return d.svg();
  }

  // p-circular: 回転する円板（上から見た図。sol = true で速度と向心力を描く）
  function figTurntable(sol) {
    const d = D(360, 234);
    const ox = 150, oy = 112, R0 = 96, rp = 60;
    d.circle(ox, oy, R0, { cls: 'fg', fill: 'f0' });
    d.line(ox, oy, ox + rp, oy, { cls: 'dim', dash: true, w: 1.2 });
    d.dot(ox, oy, { cls: 'fg', r: 3 });
    d.text(ox - 8, oy - 8, 'O', { size: 13, italic: true, anchor: 'end' });
    d.circle(ox + rp, oy, 7, { cls: 'c3', fill: 'f3' });
    d.text(ox + rp + 14, oy + 22, 'P', { size: 14, italic: true, cls: 'c3' });
    d.text(ox + rp / 2, oy + 17, 'r = 0.25 m', { size: 12 });
    const pr = function (deg) {
      const a = deg * PI / 180;
      return [ox + (R0 + 12) * Math.cos(a), oy - (R0 + 12) * Math.sin(a)];
    };
    d.arc(ox, oy, R0 + 12, 20, 68, { cls: 'c4', w: 2 });
    const p1 = pr(67), p2 = pr(78);
    d.arrow(p1[0], p1[1], p2[0], p2[1], { cls: 'c4', w: 2 });
    d.text(ox + 92, oy - 80, 'ω', { size: 15, italic: true, cls: 'c4', anchor: 'start' });
    if (sol) {
      arr(d, ox + rp, oy, ox + rp, oy - 52, 'v', 'c1', ox + rp + 8, oy - 46);
      arr(d, ox + rp, oy, ox + rp - 44, oy, 'f', 'c2', ox + rp - 24, oy - 8, 'middle');
    }
    d.text(180, 228, '上から見た図（円板は反時計回りに回転）', { size: 12, cls: 'dim' });
    return d.svg();
  }

  // p-shm: ばね振り子の x-t グラフ（sol = true で振幅・周期の読み取りを書き込む）
  function figShmGraph(sol) {
    const o = {
      w: 360, h: 220, x: [0, 8], y: [-0.3, 0.3], axis: ['t [s]', 'x [m]'],
      curves: [{ f: function (t) { return 0.20 * Math.cos(PI * t / 2); }, cls: 'c1' }]
    };
    if (sol) {
      o.hlines = [{ y: -0.2, dash: true }];
      o.segs = [
        { x1: 0, y1: 0.265, x2: 4, y2: 0.265, cls: 'c3', arrow: true },
        { x1: 4, y1: 0.265, x2: 0, y2: 0.265, cls: 'c3', arrow: true }
      ];
      o.labels = [
        { x: 1.0, y: 0.283, text: '周期 T = 4.0 s', cls: 'c3' },
        { x: 4.4, y: 0.218, text: '振幅 A = 0.20 m', cls: 'c4' }
      ];
      o.hlines.push({ y: 0.2, dash: true });
    }
    return G(o);
  }

  // p-heat: 氷の加熱曲線（時間の目盛りは書かない）
  function figHeating() {
    const d = D(360, 224);
    const X0 = 64, K = 0.66;
    const X = function (t) { return X0 + K * t; };
    const Y = function (T) { return 166 - 1.2 * T; };
    d.arrow(X0, 198, X0, 12, { cls: 'dim', w: 1.4 });
    d.arrow(X0, 198, 348, 198, { cls: 'dim', w: 1.4 });
    d.text(X0 + 8, 22, '温度 T [°C]', { size: 12, anchor: 'start' });
    d.text(316, 188, '時間 t', { size: 12, anchor: 'end' });
    d.line(X0, Y(0), X(186), Y(0), { cls: 'dim', dash: true, w: 1 });
    d.line(X0, Y(100), X(396), Y(100), { cls: 'dim', dash: true, w: 1 });
    d.text(X0 - 6, Y(-20) + 4, '−20', { size: 11, anchor: 'end' });
    d.text(X0 - 6, Y(0) + 4, '0', { size: 11, anchor: 'end' });
    d.text(X0 - 6, Y(100) + 4, '100', { size: 11, anchor: 'end' });
    [[21, 0, 'P', 't₁'], [186, 0, 'Q', 't₂'], [396, 100, 'R', 't₃']].forEach(function (p) {
      d.line(X(p[0]), Y(p[1]), X(p[0]), 198, { cls: 'dim', dash: true, w: 1 });
      d.text(X(p[0]), 213, p[3], { size: 11, cls: 'dim' });
    });
    d.poly([[X(0), Y(-20)], [X(21), Y(0)], [X(186), Y(0)], [X(396), Y(100)]], { cls: 'c1', close: false, w: 2.5 });
    [[21, 0, 'P'], [186, 0, 'Q'], [396, 100, 'R']].forEach(function (p) {
      d.dot(X(p[0]), Y(p[1]), { cls: 'c3', r: 3.5 });
      d.text(X(p[0]) + (p[2] === 'R' ? 0 : -2), Y(p[1]) - 9, p[2], { size: 14, italic: true, cls: 'c3' });
    });
    d.text(90, 184, 'ア', { size: 13, cls: 'c1' });
    d.text(X(100), Y(0) + 17, 'イ', { size: 13, cls: 'c1' });
    d.text(268, 124, 'ウ', { size: 13, cls: 'c1' });
    d.text(86, 62, 'ア: 氷の温度が上がる', { size: 12, anchor: 'start', cls: 'dim' });
    d.text(86, 80, 'イ: 氷がとけている', { size: 12, anchor: 'start', cls: 'dim' });
    d.text(86, 98, 'ウ: 水の温度が上がる', { size: 12, anchor: 'start', cls: 'dim' });
    return d.svg();
  }

  // p-gas: ピストンで閉じた気体（鉛直な円筒）
  function figPiston() {
    const d = D(360, 240);
    const xl = 112, xr = 212, yb = 206, yp = yb - 100;
    d.path('M' + xl + ' 44 L' + xl + ' ' + yb + ' L' + xr + ' ' + yb + ' L' + xr + ' 44', { cls: 'fg', w: 3 });
    d.rect(xl + 2, yp, xr - xl - 4, yb - yp - 2, { cls: 'c1', fill: 'f1', w: 1 });
    d.rect(xl + 3, yp - 14, xr - xl - 6, 14, { cls: 'fg', fill: 'f0', rx: 1 });
    d.text(162, yb - 52, '気体', { size: 13 });
    d.text(162, yb - 32, '27 °C', { size: 13 });
    d.text(xr + 12, yp - 4, 'ピストン', { size: 12, anchor: 'start' });
    d.text(xr + 12, yp + 12, '質量 5.0 kg', { size: 12, anchor: 'start' });
    d.text(xr + 12, yb - 18, '断面積', { size: 12, anchor: 'start' });
    d.text(xr + 12, yb - 2, '2.5×10⁻³ m²', { size: 12, anchor: 'start' });
    dimV(d, 92, yp, yb, '20 cm', 86, 'end');
    [132, 162, 192].forEach(function (x) { d.arrow(x, 52, x, yp - 26, { cls: 'dim', w: 1.5 }); });
    d.text(162, 28, '大気圧 1.0×10⁵ Pa', { size: 12, cls: 'dim' });
    return d.svg();
  }

  // p-thermo1: p-V 図（A → B 定積、B → C 定圧）
  function figPV() {
    return G({
      w: 340, h: 240, x: [0, 6], y: [0, 3], axis: ['V', 'p'],
      labels: [
        { x: 0.3, y: 2.8, text: 'p の目盛りの単位: 10⁵ Pa', cls: 'dim' },
        { x: 0.3, y: 2.52, text: 'V の目盛りの単位: 10⁻³ m³', cls: 'dim' }
      ],
      segs: [
        { x1: 2, y1: 1, x2: 2, y2: 2, cls: 'c1', arrow: true },
        { x1: 2, y1: 2, x2: 5, y2: 2, cls: 'c1', arrow: true },
        { x1: 2, y1: 0, x2: 2, y2: 1, cls: 'dim', dash: true },
        { x1: 5, y1: 0, x2: 5, y2: 2, cls: 'dim', dash: true },
        { x1: 0, y1: 1, x2: 2, y2: 1, cls: 'dim', dash: true },
        { x1: 0, y1: 2, x2: 2, y2: 2, cls: 'dim', dash: true }
      ],
      points: [
        { x: 2, y: 1, label: 'A', cls: 'c3', pos: 'br' },
        { x: 2, y: 2, label: 'B', cls: 'c3', pos: 'tl' },
        { x: 5, y: 2, label: 'C', cls: 'c3', pos: 'tr' }
      ]
    });
  }

  // p-wave: 正弦波の波形（t = 0）。sol = true で少し後の波形を点線で重ねる
  function figWave(sol) {
    const A = 0.20, lam = 8.0;
    const y0 = function (x) { return A * Math.sin(2 * PI * x / lam); };
    const o = {
      w: 360, h: 220, x: [0, 16], y: [-0.3, 0.3], axis: ['x [m]', 'y [m]'],
      curves: [{ f: y0, cls: 'c1' }],
      points: [{ x: 4, y: 0, label: 'P', cls: 'c3', pos: 'tr' }]
    };
    if (sol) {
      o.curves.push({ f: function (x) { return y0(x - 1.0); }, cls: 'c2', dash: true });
      o.segs = [{ x1: 4, y1: 0, x2: 4, y2: y0(3), cls: 'c3', arrow: true }];
      o.labels = [
        { x: 0.3, y: -0.27, text: '実線: t = 0 の波形', cls: 'c1' },
        { x: 8.3, y: -0.27, text: '点線: 少し後の波形', cls: 'c2' }
      ];
    } else {
      o.segs = [{ x1: 9.5, y1: 0.26, x2: 12.5, y2: 0.26, cls: 'c3', arrow: true }];
      o.labels = [{ x: 12.9, y: 0.25, text: '波の進行', cls: 'c3' }];
    }
    return G(o);
  }

  // p-doppler: 動く音源がつくる波面（模式図。sol = true で波長を書き込む）
  function figDoppler(sol) {
    const d = D(360, 210);
    const sx = 120, sy = 100;
    for (let k = 1; k <= 4; k++) d.circle(sx - 6 * k, sy, 20 * k, { cls: 'c1', w: 1.2 });
    d.rect(sx - 16, sy - 9, 32, 18, { cls: 'c3', fill: 'f3', rx: 3 });
    d.text(sx, sy + 4, '音源', { size: 11 });
    d.arrow(sx + 18, sy, sx + 62, sy, { cls: 'c3', w: 2 });
    d.text(sx + 68, sy + 4, '20 m/s', { cls: 'c3', size: 12, anchor: 'start' });
    d.circle(304, sy, 8, { cls: 'c4', fill: 'f4' });
    d.text(304, sy + 28, '観測者', { size: 12, cls: 'c4' });
    d.text(304, sy + 44, '（静止）', { size: 12, cls: 'c4' });
    d.text(180, 202, '音源が出した波面（模式図。速さの比は誇張してある）', { size: 11, cls: 'dim' });
    if (sol) {
      d.text(8, 12, '後方: 間隔が広い（λ″）', { size: 11, anchor: 'start', cls: 'c2' });
      d.text(352, 12, '前方: 間隔がせまい（λ′）', { size: 11, anchor: 'end', cls: 'c2' });
    }
    return d.svg();
  }

  // p-interf: ヤングの干渉実験
  function figYoung() {
    const d = D(360, 252);
    const xp = 90, xs = 270, ys1 = 100, ys2 = 140, y0 = 120;
    // 入射光
    d.arrow(8, ys1, 46, ys1, { cls: 'c3', w: 1.6 });
    d.arrow(8, ys2, 46, ys2, { cls: 'c3', w: 1.6 });
    d.text(27, 82, '単色光', { size: 12, cls: 'c3' });
    // スリット板
    d.line(xp, 30, xp, ys1 - 6, { cls: 'fg', w: 3 });
    d.line(xp, ys1 + 6, xp, ys2 - 6, { cls: 'fg', w: 3 });
    d.line(xp, ys2 + 6, xp, 214, { cls: 'fg', w: 3 });
    d.text(xp - 10, ys1 + 4, 'S₁', { size: 13, italic: true, anchor: 'end' });
    d.text(xp - 10, ys2 + 4, 'S₂', { size: 13, italic: true, anchor: 'end' });
    dimV(d, 62, ys1, ys2, 'd', 56, 'end', 13);
    // スクリーンと明線
    d.line(xs, 24, xs, 216, { cls: 'fg', w: 3 });
    for (let m = -4; m <= 4; m++) d.rect(xs, y0 - 22 * m - 3, 12, 6, { cls: 'c3', fill: 'f3', w: 1 });
    d.text(xs + 18, y0 + 4, 'O', { size: 13, italic: true, anchor: 'start' });
    d.text(xs + 18, y0 - 88 + 4, 'P', { size: 13, italic: true, anchor: 'start' });
    // 光路
    d.line(xp, ys1, xs, y0 - 88, { cls: 'c1', w: 1.2 });
    d.line(xp, ys2, xs, y0 - 88, { cls: 'c2', w: 1.2 });
    d.line(xp, y0, xs, y0, { cls: 'dim', dash: true, w: 1 });
    // 寸法
    dimH(d, xp, xs, 230, 'L = 1.5 m', 247);
    d.line(xs + 12, y0, 316, y0, { cls: 'dim', dash: true, w: 1 });
    d.line(xs + 12, y0 - 88, 316, y0 - 88, { cls: 'dim', dash: true, w: 1 });
    dimV(d, 316, y0 - 88, y0, '12 mm', 322, 'start');
    return d.svg();
  }

  // p-estat: 2 つの点電荷と点 P
  function figCharges() {
    const d = D(360, 232);
    const xA = 72, xB = 288, xM = 180, yc = 170, yP = 26;
    d.line(xA, yc, xB, yc, { cls: 'dim', dash: true, w: 1.2 });
    d.line(xM, yc, xM, yP, { cls: 'dim', dash: true, w: 1.2 });
    d.line(xA, yc, xM, yP, { cls: 'c1', dash: true, w: 1.2 });
    d.line(xB, yc, xM, yP, { cls: 'c1', dash: true, w: 1.2 });
    d.poly([[xM, yc - 8], [xM + 8, yc - 8], [xM + 8, yc]], { cls: 'dim', close: false, w: 1 });
    [[xA, 'A'], [xB, 'B']].forEach(function (c) {
      d.circle(c[0], yc, 11, { cls: 'c2', fill: 'f2' });
      d.text(c[0], yc + 5, '+', { size: 15, bold: true });
      d.text(c[0], yc - 20, c[1], { size: 14, italic: true });
      d.text(c[0], yc + 30, '+4.0×10⁻⁶ C', { size: 12 });
    });
    d.dot(xM, yP, { cls: 'c3', r: 4 });
    d.text(xM + 12, yP + 4, 'P', { size: 14, italic: true, cls: 'c3', anchor: 'start' });
    d.dot(xM, yc, { cls: 'fg', r: 3 });
    d.text(xM, yc + 20, 'M', { size: 14, italic: true });
    d.text(xM + 10, 100, '0.40 m', { size: 12, anchor: 'start' });
    dimH(d, xA, xB, 212, 'AB = 0.60 m（M は AB の中点）', 228);
    return d.svg();
  }

  // p-circuit: 直列と並列の混合回路
  function figCircuit() {
    const d = D(360, 192);
    const yt = 40, yb = 150;
    d.wire([[70, 70], [70, yt], [118, yt]]);
    d.battery(70, 70, 70, 130);
    d.wire([[70, 130], [70, yb], [330, yb]]);
    d.text(48, 104, 'E = 16 V', { size: 12, anchor: 'end' });
    d.resistor(118, yt, 200, yt, { label: 'R₁ = 5.0 Ω' });
    d.wire([[200, yt], [330, yt]]);
    d.resistor(240, yt, 240, yb, { label: 'R₂ = 4.0 Ω', ldist: 46 });
    d.resistor(330, yt, 330, yb, { label: 'R₃ = 12 Ω', ldist: 46 });
    d.dot(240, yt, { cls: 'fg', r: 3 });
    d.dot(240, yb, { cls: 'fg', r: 3 });
    d.text(180, 182, '電池の内部抵抗は無視する', { size: 12, cls: 'dim' });
    return d.svg();
  }

  // p-mag: 平行な 2 本の直線電流（断面図。sol = true で磁場と力を描く）
  function figWires(sol) {
    const d = D(360, 234);
    const xa = 90, xb = 250, y = 106;
    [[xa, 'A', '6.0 A'], [xb, 'B', '3.0 A']].forEach(function (w) {
      d.circle(w[0], y, 13, { cls: 'fg', fill: 'f0' });
      d.dot(w[0], y, { cls: 'fg', r: 3.2 });
      d.text(w[0], y + 66, w[1], { size: 14, italic: true });
      d.text(w[0], y + 83, w[2], { size: 12 });
    });
    d.text(180, 22, '電流の向き: 紙面の裏から表へ（⊙）', { size: 12, cls: 'dim' });
    dimH(d, xa, xb, 206, 'r = 0.10 m', 226);
    if (sol) {
      const rf = 46;
      const pr = function (deg) {
        const a = deg * PI / 180;
        return [xa + rf * Math.cos(a), y - rf * Math.sin(a)];
      };
      d.circle(xa, y, rf, { cls: 'c4', dash: true, w: 1.3 });
      [[-12, 8], [168, 188]].forEach(function (g) {
        const p1 = pr(g[0]), p2 = pr(g[1]);
        d.arrow(p1[0], p1[1], p2[0], p2[1], { cls: 'c4', w: 1.5 });
      });
      d.text(xa, y - rf - 8, 'A の電流がつくる磁場', { size: 11, cls: 'c4' });
      arr(d, xb, y - 18, xb, y - 70, '', 'c1', 0, 0);
      d.text(xb + 8, y - 48, '磁場', { size: 12, cls: 'c1', anchor: 'start' });
      arr(d, xb - 18, y, xb - 80, y, 'F', 'c2', xb - 50, y - 8, 'middle');
    }
    return d.svg();
  }

  // p-induction: 磁場中のレール上を動く導体棒（上から見た図。sol = true で誘導電流の向きを描く）
  function figRails(sol) {
    const d = D(360, 230);
    const yt = 74, yb = 164, xr = 70, xe = 304, xq = 200;
    function cross(x, y) {
      d.circle(x, y, 6, { cls: 'dim', w: 1.2 });
      d.line(x - 3.5, y - 3.5, x + 3.5, y + 3.5, { cls: 'dim', w: 1.2 });
      d.line(x - 3.5, y + 3.5, x + 3.5, y - 3.5, { cls: 'dim', w: 1.2 });
    }
    d.line(xr, yt, xe, yt, { cls: 'fg', w: 2.5 });
    d.line(xr, yb, xe, yb, { cls: 'fg', w: 2.5 });
    d.resistor(xr, yt, xr, yb, { label: 'R = 2.0 Ω', ldist: 40 });
    [[112, 90], [152, 90], [112, 148], [152, 148], [242, 90], [282, 90], [242, 148], [282, 148]].forEach(function (c) { cross(c[0], c[1]); });
    d.line(xq, yt - 14, xq, yb + 14, { cls: 'c2', w: 5 });
    d.text(xq, yt - 20, 'P', { size: 14, italic: true });
    d.text(xq, yb + 32, 'Q', { size: 14, italic: true });
    d.arrow(xq + 8, 121, xq + 62, 121, { cls: 'c3', w: 2 });
    d.text(xq + 10, 112, 'v = 2.0 m/s', { size: 12, cls: 'c3', anchor: 'start' });
    dimV(d, 318, yt, yb, '0.40 m', 324, 'start', 11);
    d.text(12, 22, '磁束密度 0.50 T（紙面の表から裏向き ⊗）', { size: 12, anchor: 'start' });
    d.text(180, 218, '水平面内のレール（上から見た図）', { size: 12, cls: 'dim' });
    if (sol) {
      arr(d, xq - 4, yb - 8, xq - 4, yt + 12, '', 'c4', 0, 0);
      arr(d, 164, yt, 126, yt, '', 'c4', 0, 0);
      arr(d, xr, 82, xr, 98, '', 'c4', 0, 0);
      arr(d, 126, yb, 164, yb, '', 'c4', 0, 0);
      d.text(142, yt - 8, 'I', { size: 14, italic: true, cls: 'c4' });
    }
    return d.svg();
  }

  // p-ac: 交流電圧のグラフ
  function figAC() {
    return G({
      w: 360, h: 230, x: [0, 40], y: [-210, 180], axis: ['t [ms]', 'v [V]'],
      curves: [{ f: function (t) { return 141 * Math.sin(2 * PI * t / 20); }, cls: 'c1' }],
      hlines: [{ y: 141, dash: true }, { y: -141, dash: true }],
      segs: [
        { x1: 0, y1: -195, x2: 20, y2: -195, cls: 'c3', arrow: true },
        { x1: 20, y1: -195, x2: 0, y2: -195, cls: 'c3', arrow: true }
      ],
      labels: [
        { x: 0.8, y: 150, text: '141 V', cls: 'c3' },
        { x: 0.8, y: -131, text: '−141 V', cls: 'c3' },
        { x: 6.5, y: -176, text: 'T = 20 ms', cls: 'c3' }
      ]
    });
  }

  // p-photon: 金属板に紫外線を当てる（光電効果）
  function figPhoto() {
    const d = D(360, 214);
    const yp = 146;
    d.rect(60, yp, 240, 18, { cls: 'fg', fill: 'f0' });
    d.text(180, yp + 36, '金属板', { size: 12 });
    [110, 180, 250].forEach(function (x) { d.arrow(x, 44, x, yp - 6, { cls: 'c2', w: 2 }); });
    d.text(180, 26, '紫外線（波長 3.0×10⁻⁷ m）', { size: 12, cls: 'c2' });
    [[145, 130], [215, 232], [285, 300]].forEach(function (e) {
      d.arrow(e[0], yp - 6, e[1], 100, { cls: 'c3', w: 1.8 });
      d.text(e[1], 90, 'e⁻', { size: 13, italic: true, cls: 'c3' });
    });
    d.text(180, 206, 'e⁻: 金属板から飛び出した光電子', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // p-atom: 水素原子のエネルギー準位（間隔は正確ではない）
  function figLevels() {
    const d = D(360, 240);
    [['n = 1', 206, '−13.6'], ['n = 2', 130, '−3.40'], ['n = 3', 100, '−1.51'], ['n = 4', 80, '−0.85']].forEach(function (l) {
      d.line(120, l[1], 230, l[1], { cls: 'fg', w: 2 });
      d.text(112, l[1] + 4, l[0] + '   ' + l[2] + ' eV', { size: 12, anchor: 'end' });
    });
    d.line(120, 44, 230, 44, { cls: 'fg', w: 2 });
    d.text(112, 48, 'n = ∞   0 eV', { size: 12, anchor: 'end' });
    d.line(230, 100, 262, 100, { cls: 'dim', dash: true, w: 1 });
    d.line(230, 130, 312, 130, { cls: 'dim', dash: true, w: 1 });
    d.line(230, 44, 312, 44, { cls: 'dim', dash: true, w: 1 });
    d.arrow(252, 100, 252, 130, { cls: 'c3', w: 2.2 });
    d.text(260, 120, 'ア', { size: 14, cls: 'c3', anchor: 'start' });
    d.arrow(300, 130, 300, 44, { cls: 'c2', w: 2.2 });
    d.text(310, 92, 'イ', { size: 14, cls: 'c2', anchor: 'start' });
    d.text(180, 232, '準位の間隔は正確ではない（模式図）', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // p-wave: 選択肢用の小さなグラフ（点線: t = 0 の波形、実線: 候補の波形。shift は右へのずれ [m]）
  function figWaveOpt(shift) {
    const y0 = function (x) { return 0.2 * Math.sin(2 * PI * x / 8); };
    return G({
      w: 176, h: 112, x: [0, 16], y: [-0.25, 0.25], axis: ['x', 'y'], grid: false,
      curves: [
        { f: y0, cls: 'dim', dash: true },
        { f: function (x) { return y0(x - shift); }, cls: 'c1' }
      ]
    });
  }

  // p-wave 解説: 0.50 s 後の波形（t = 0 の波形を右へ 2.0 m ずらす）
  function figWaveShift() {
    const y0 = function (x) { return 0.2 * Math.sin(2 * PI * x / 8); };
    return G({
      w: 360, h: 220, x: [0, 16], y: [-0.3, 0.3], axis: ['x [m]', 'y [m]'],
      curves: [
        { f: y0, cls: 'dim', dash: true },
        { f: function (x) { return y0(x - 2); }, cls: 'c1' }
      ],
      segs: [{ x1: 2, y1: 0.255, x2: 4, y2: 0.255, cls: 'c3', arrow: true }],
      labels: [
        { x: 4.5, y: 0.262, text: '山が 2.0 m 進む', cls: 'c3' },
        { x: 0.3, y: -0.27, text: '点線: t = 0 の波形', cls: 'dim' },
        { x: 8.6, y: -0.27, text: '実線: t = 0.50 s', cls: 'c1' }
      ]
    });
  }

  /* @@FIG@@ */

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ---------- 等加速度運動 ---------- */
    {
      id: 'p-basic-kin-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-kin',
      title: 'ブレーキと停止距離（v-tグラフ）',
      source: { univ: 'オリジナル' },
      time: 6,
      body: R`速さ $72\,\mathrm{km/h}$ で一直線の道路を走っていた自動車の運転手が、前方の障害物に気づいてブレーキを踏んだ。気づいてからブレーキが効き始めるまでの $0.50\,\mathrm{s}$ の間、自動車は同じ速さで進み、ブレーキが効き始めてからは一定の加速度で減速して、$4.0\,\mathrm{s}$ 後に停止した。図は、運転手が障害物に気づいた時刻を $t=0$ としたときの、自動車の速さ $v$ と時刻 $t$ の関係である。進む向きを正とする。`,
      fig: figBrake(false),
      parts: [
        { label: '(1)', q: R`速さ $72\,\mathrm{km/h}$ は、何 $\mathrm{m/s}$ か。`, type: 'num', answer: 20, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`ブレーキが効いている間の加速度の大きさは何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 5, rel: 0.02, unit: 'm/s²' },
        { label: '(3)', q: R`運転手が障害物に気づいてから停止するまでに、自動車が進んだ距離は何 $\mathrm{m}$ か。`, type: 'num', answer: 50, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: R`単位を $\mathrm{m/s}$ にそろえる（(1)）`,
          m: R`72\,\mathrm{km/h} = \frac{72\times 1000\,\mathrm{m}}{3600\,\mathrm{s}} = 20\,\mathrm{m/s}`,
          n: R`$1\,\mathrm{km}=1000\,\mathrm{m}$、$1\,\mathrm{h}=3600\,\mathrm{s}$ なので、$\mathrm{km/h}$ の数値を $3.6$ で割ると $\mathrm{m/s}$ になります。`,
          easy: R`速さの計算は、長さと時間の単位をそろえてから行います。この問題では加速度や距離を $\mathrm{m}$ と $\mathrm{s}$ で答えるので、先に $\mathrm{m/s}$ に直します。$72\,\mathrm{km/h}$ は「1 時間に $72000\,\mathrm{m}$」、1 時間は $3600$ 秒なので、「1 秒に $72000\div3600=20\,\mathrm{m}$」です。`,
          pro: R`$\mathrm{km/h}\to\mathrm{m/s}$ は $3.6$ で割る（逆は $3.6$ をかける）。`,
          lv: 1
        },
        {
          t: 'v-t グラフの読み方',
          n: R`v-t グラフでは、**傾きが加速度**、**グラフと横軸ではさまれた面積が進んだ距離**を表します。区間 ①（$0\le t\le 0.5$）は横一直線なので等速、区間 ②（$0.5\le t\le 4.5$）は右下がりの直線なので、一定の割合で速さが減っています。`,
          easy: R`グラフが水平なら「速さが変わらない」、右下がりなら「だんだん遅くなっている」という意味です。傾きが急なほど、速さの変化が大きくなります。面積が距離になるのは、「速さ × 時間 = 距離」を図にしたものだからです。`,
          lv: 2
        },
        {
          t: '加速度の大きさ（(2)）',
          m: R`a = \frac{\Delta v}{\Delta t} = \frac{0-20}{4.0} = -5.0\,\mathrm{m/s^{2}}`,
          n: R`ブレーキが効いている $4.0\,\mathrm{s}$ の間に、速さが $20\,\mathrm{m/s}$ から $0$ に変わります。加速度は負（進む向きと逆向き）で、大きさは $5.0\,\mathrm{m/s^{2}}$ です。`,
          easy: R`加速度は「1 秒あたりの速さの変化」です。$4.0$ 秒で $20\,\mathrm{m/s}$ 減ったので、1 秒あたり $20\div4.0=5.0\,\mathrm{m/s}$ ずつ減ったことになります。グラフの傾きがそのまま加速度です。`,
          lv: 1
        },
        {
          t: '進んだ距離（(3)）',
          m: [R`x_{1} = 20\times 0.50 = 10\,\mathrm{m}\qquad(\text{①: 長方形の面積})`,
              R`x_{2} = \frac{1}{2}\times 4.0\times 20 = 40\,\mathrm{m}\qquad(\text{②: 三角形の面積})`,
              R`x = x_{1}+x_{2} = 50\,\mathrm{m}`],
          n: R`距離はグラフの面積です。① は縦 $20$、横 $0.50$ の長方形、② は底辺 $4.0$、高さ $20$ の三角形です。`,
          easy: R`① の間は、ブレーキが効く前なので $20\,\mathrm{m/s}$ のまま進みます。② は、速さが $20$ から $0$ まで直線的に減るので、平均の速さは $10\,\mathrm{m/s}$ とみなせて、$10\times 4.0=40\,\mathrm{m}$ 進みます。`,
          pro: R`② は $v^{2}-v_{0}^{2}=2ax$ から $x_{2}=\dfrac{0-20^{2}}{2\times(-5.0)}=40\,\mathrm{m}$ でも出せる。速さが 2 倍になると制動距離は 4 倍。`,
          fig: figBrake(true),
          lv: 1
        }
      ],
      tags: ['v-tグラフ', '停止距離', '等加速度直線運動']
    },

    /* ---------- 落体の運動 ---------- */
    {
      id: 'p-basic-fall-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-fall',
      title: 'ビルの屋上から水平に投げる',
      source: { univ: 'オリジナル' },
      time: 6,
      body: R`高さ $19.6\,\mathrm{m}$ のビルの屋上の端から、小球を水平方向に速さ $10\,\mathrm{m/s}$ で投げ出した。小球は、ビルの前の水平な地面に落ちた。空気の抵抗は無視でき、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figHoriz(),
      parts: [
        { label: '(1)', q: R`小球が地面に達するのは、投げ出してから何 $\mathrm{s}$ 後か。`, type: 'num', answer: 2, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`落下点は、ビルの真下の点から水平方向に何 $\mathrm{m}$ はなれているか。`, type: 'num', answer: 20, rel: 0.02, unit: 'm' },
        { label: '(3)', q: R`小球が地面に達する直前の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 22, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        {
          t: '水平方向と鉛直方向に分けて考える',
          m: [R`\text{水平方向（等速直線運動）:}\quad x = v_{0}\,t`,
              R`\text{鉛直方向（自由落下）:}\quad y = \frac{1}{2}gt^{2},\qquad v_{y} = gt`],
          n: R`水平方向には力がはたらかないので、速さ $v_{0}=10\,\mathrm{m/s}$ のまま等速で進みます。鉛直方向は重力だけなので、初速度 $0$ の自由落下と同じ運動です。ここでは投げ出した点から下向きに $y$ をとります。`,
          easy: R`斜めや横に投げた物体の運動は、「横方向」と「縦方向」に分けると簡単になります。横方向には押す力がないので、スピードは変わりません。縦方向は、ただ落とした物体と同じで、重力によってだんだん速くなります。この 2 つの運動が**同時に**起こっているのが水平投射です。`,
          lv: 1
        },
        {
          t: '地面に達するまでの時間（(1)）',
          m: R`h = \frac{1}{2}gt^{2} \;\Longrightarrow\; t = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2\times 19.6}{9.8}} = \sqrt{4.0} = 2.0\,\mathrm{s}`,
          n: R`地面に達するまでの時間は、鉛直方向の運動だけで決まります。落下する高さ $h=19.6\,\mathrm{m}$ を $y$ に代入します。`,
          easy: R`「ビルの高さ $19.6\,\mathrm{m}$ を落ちるのにかかる時間」を求めればよいので、横に投げたことは関係しません。同じ高さから、ただ落とした球と同時に地面に着きます。`,
          pro: R`滞空時間は $\sqrt{2h/g}$。水平の初速度には依存しない。`,
          lv: 1
        },
        {
          t: '落下点までの水平距離（(2)）',
          m: R`x = v_{0}t = 10\times 2.0 = 20\,\mathrm{m}`,
          n: R`水平方向は等速なので、地面に達するまでの時間 $2.0\,\mathrm{s}$ に初速度をかければ距離になります。`,
          lv: 1
        },
        {
          t: '地面に達する直前の速さ（(3)）',
          m: [R`v_{x} = v_{0} = 10\,\mathrm{m/s},\qquad v_{y} = gt = 9.8\times 2.0 = 19.6\,\mathrm{m/s}`,
              R`v = \sqrt{v_{x}^{2}+v_{y}^{2}} = \sqrt{10^{2}+19.6^{2}} = \sqrt{484.16} \approx 22\,\mathrm{m/s}`],
          n: R`速さは、水平成分と鉛直成分を三平方の定理で合成して求めます。水平方向の速度は変わらず、鉛直方向の速度は $gt$ です。`,
          easy: R`地面に着く直前の速度は、「横向き $10\,\mathrm{m/s}$」と「下向き $19.6\,\mathrm{m/s}$」を合わせた斜め下向きの速度です。直角三角形の斜辺の長さが速さになるので、三平方の定理を使います。`,
          pro: R`力学的エネルギー保存でも出せる: $\dfrac{1}{2}v^{2}=\dfrac{1}{2}v_{0}^{2}+gh$ より $v^{2}=100+2\times 9.8\times 19.6=484.16$。`,
          lv: 1
        }
      ],
      tags: ['水平投射', '放物運動', '自由落下']
    },

    /* ---------- 剛体 ---------- */
    {
      id: 'p-basic-rigid-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-rigid',
      title: 'ちょうつがいで支えた棒',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`長さ $1.0\,\mathrm{m}$、質量 $2.0\,\mathrm{kg}$ の一様な棒 AB の端 A を、鉛直な壁にちょうつがいでとりつけ、端 B に質量 $1.0\,\mathrm{kg}$ のおもりをつるした。さらに B と壁の点 C を軽い糸でつなぎ、糸が棒と $30\degree$ の角をなすようにして、棒を水平に保った。糸の張力の大きさを $T$、ちょうつがいが棒に及ぼす力の水平成分の大きさを $H$、鉛直成分の大きさを $V$ とする。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$、$\sqrt{3}=1.73$ とする。`,
      fig: figRod(false),
      parts: [
        { label: '(1)', q: R`糸の張力の大きさ $T$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 39.2, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`ちょうつがいが棒に及ぼす力の水平成分の大きさ $H$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 33.9, rel: 0.02, unit: 'N' },
        { label: '(3)', q: R`ちょうつがいが棒に及ぼす力の鉛直成分の大きさ $V$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 9.8, rel: 0.02, unit: 'N' }
      ],
      solution: [
        {
          t: '棒にはたらく力を図示する',
          n: R`棒の質量を $M=2.0\,\mathrm{kg}$、おもりの質量を $m=1.0\,\mathrm{kg}$ とします。棒にはたらく力は、棒の重力 $Mg$（重心 G、下向き）、おもりが B を引く力 $mg$（下向き）、糸が B を引く力 $T$（糸の向きにななめ上向き）、ちょうつがいが A で棒に及ぼす力（水平成分 $H$、鉛直成分 $V$）の 4 つです。`,
          easy: R`大きさのある物体（**剛体**）が静止しているときは、2 つの条件が成り立ちます。①**力のつり合い**（上下・左右の力の和がそれぞれ $0$）と、②**力のモーメントのつり合い**（回転しない）です。まず、どの点にどの向きの力がはたらくかを図に描いて整理します。ちょうつがいの力は向きがわからないので、水平成分 $H$ と鉛直成分 $V$ に分けて描きます。`,
          fig: figRod(true),
          lv: 1
        },
        {
          t: '点 A のまわりの力のモーメントのつり合い（(1)）',
          m: [R`T\sin30\degree\times L = Mg\times\frac{L}{2} + mg\times L`,
              R`T\times 0.50\times 1.0 = 2.0\times 9.8\times 0.50 + 1.0\times 9.8\times 1.0 = 19.6`,
              R`T = 39.2\,\mathrm{N}`],
          n: R`ちょうつがいの点 A を回転軸にとると、$H$ と $V$ の作用線は A を通るので、そのモーメントは $0$ になり、式に出てきません。糸の力 $T$ のうち、棒に垂直な成分 $T\sin30\degree$ だけが棒を回す力になり、腕の長さは $L=1.0\,\mathrm{m}$ です。`,
          easy: R`**力のモーメント**は「力 × 腕の長さ」で、力が物体を回そうとする大きさを表します（腕の長さ = 回転軸から力の作用線までの垂直な距離）。糸の上向きの力は棒を**反時計回り**に回そうとし、棒とおもりの重力は**時計回り**に回そうとします。この 2 つがつり合っているので、棒は回りません。棒の重力は中点 G にはたらくので、腕の長さは $\dfrac{L}{2}=0.50\,\mathrm{m}$ です。`,
          pro: R`軸は「未知の力がたくさん通る点」にとる。ここではちょうつがい A（$H$, $V$ が消える）。`,
          lv: 1
        },
        {
          t: '水平方向のつり合い（(2)）',
          m: [R`H - T\cos30\degree = 0`,
              R`H = T\cos30\degree = 39.2\times\frac{\sqrt{3}}{2} \approx 39.2\times 0.865 \approx 33.9\,\mathrm{N}`],
          n: R`水平方向の力は、糸の力の水平成分 $T\cos30\degree$（壁の向き）と、ちょうつがいの力 $H$（壁から遠ざかる向き）だけです。`,
          lv: 1
        },
        {
          t: '鉛直方向のつり合い（(3)）',
          m: [R`V + T\sin30\degree - Mg - mg = 0`,
              R`V = (2.0+1.0)\times 9.8 - 39.2\times 0.50 = 29.4 - 19.6 = 9.8\,\mathrm{N}`],
          n: R`上向きの力は $V$ と糸の力の鉛直成分 $T\sin30\degree=19.6\,\mathrm{N}$、下向きの力は棒とおもりの重力の合計 $29.4\,\mathrm{N}$ です。糸が支えきれない $9.8\,\mathrm{N}$ 分を、ちょうつがいが上向きに支えています。`,
          easy: R`棒とおもりの重さの合計は $29.4\,\mathrm{N}$ ですが、糸が上向きに引き上げているのは $19.6\,\mathrm{N}$ だけです。足りない $9.8\,\mathrm{N}$ を、ちょうつがいが下から支えています。`,
          pro: R`ちょうつがいの力の大きさは $\sqrt{H^{2}+V^{2}}\approx 35\,\mathrm{N}$。向きは棒の方向とは一致しない（水平成分と鉛直成分を別々に立式する）。`,
          lv: 1
        }
      ],
      tags: ['力のモーメント', 'ちょうつがい', '剛体のつり合い']
    },

    /* ---------- 運動方程式 ---------- */
    {
      id: 'p-basic-eom-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-eom',
      title: '糸でつないだ 2 物体を引く',
      source: { univ: 'オリジナル' },
      time: 6,
      body: R`なめらかな水平面上に、質量 $2.0\,\mathrm{kg}$ の物体 A と質量 $3.0\,\mathrm{kg}$ の物体 B を軽い糸でつないで置く。B に水平右向きの一定の力 $15\,\mathrm{N}$ を加えて、A, B をいっしょに引いた。糸は伸び縮みせず、たるまないものとする。`,
      fig: figTwoBlocks(false),
      parts: [
        { label: '(1)', q: R`A, B の加速度の大きさは何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 3, rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`糸が A を引く力（張力）の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 6, rel: 0.02, unit: 'N' },
        { label: '(3)', q: R`A, B が動いている途中で糸が切れた。力 $15\,\mathrm{N}$ を加え続けているとき、糸が切れた直後の B の加速度の大きさは何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 5, rel: 0.02, unit: 'm/s²' }
      ],
      solution: [
        {
          t: 'A, B それぞれに運動方程式を立てる',
          m: [R`\text{A:}\quad m_{A}\,a = T`,
              R`\text{B:}\quad m_{B}\,a = F - T`],
          n: R`A, B は糸でつながっているので、同じ加速度 $a$（右向き）で動きます。右向きを正とすると、A にはたらく水平方向の力は糸の張力 $T$（右向き）だけです。B には、加えた力 $F=15\,\mathrm{N}$（右向き）と、糸が B を引きもどす張力 $T$（左向き）がはたらきます。糸は軽いので、A と B にはたらく張力の大きさは同じです。鉛直方向は、重力と垂直抗力がつり合っています。`,
          easy: R`運動方程式 $ma=F$ の $F$ は、その物体にはたらく**力の合計**（合力）です。A と B を別々の物体として、それぞれにはたらく力を書き出します。糸は、A を右へ引く力と、B を左へ引く力（同じ大きさ $T$）を生みます。`,
          fig: figTwoBlocks(true),
          lv: 1
        },
        {
          t: '加速度（(1)）',
          m: [R`(m_{A}+m_{B})\,a = F`,
              R`a = \frac{F}{m_{A}+m_{B}} = \frac{15}{2.0+3.0} = 3.0\,\mathrm{m/s^{2}}`],
          n: R`2 つの式を辺々加えると、張力 $T$ が消えます。A と B を 1 つの物体（質量 $5.0\,\mathrm{kg}$）とみなして、$F$ で引いていると考えたのと同じです。`,
          pro: R`糸でつながって同じ加速度の物体は、まず全体で $a=F/(m_{A}+m_{B})$。内力（張力）は全体の式に出てこない。`,
          lv: 1
        },
        {
          t: '張力（(2)）',
          m: R`T = m_{A}\,a = 2.0\times 3.0 = 6.0\,\mathrm{N}`,
          n: R`A の式に $a=3.0\,\mathrm{m/s^{2}}$ を代入します。B の式でも $F-T=15-6.0=9.0\,\mathrm{N}=m_{B}a=3.0\times3.0$ となり、一致します。`,
          easy: R`A を動かしているのは、糸の張力だけです。A の質量 $2.0\,\mathrm{kg}$ を加速度 $3.0\,\mathrm{m/s^{2}}$ で動かすために必要な力が $T$ なので、$T=2.0\times3.0=6.0\,\mathrm{N}$ です。`,
          lv: 1
        },
        {
          t: '糸が切れた直後（(3)）',
          m: [R`m_{B}\,a_{B} = F \;\Longrightarrow\; a_{B} = \frac{F}{m_{B}} = \frac{15}{3.0} = 5.0\,\mathrm{m/s^{2}}`,
              R`a_{A} = 0`],
          n: R`糸が切れると張力 $T$ が $0$ になり、B にはたらく水平方向の力は $F$ だけです。そのため、加速度は糸がつながっていたとき（$3.0\,\mathrm{m/s^{2}}$）より大きくなります。A には水平方向の力がはたらかないので、加速度は $0$ で、切れたときの速度のまま等速直線運動を続けます。`,
          pro: R`「切れる直前と直後で、速度は変わらないが加速度は変わる」。力がかわれば加速度がかわる。`,
          lv: 1
        }
      ],
      tags: ['運動方程式', '糸でつながれた物体', '張力']
    },

    /* ---------- 運動量と力積 ---------- */
    {
      id: 'p-basic-momentum-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-momentum',
      title: '台車の正面衝突と合体',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`なめらかな水平面上で、右向きに速さ $4.0\,\mathrm{m/s}$ で進む質量 $3.0\,\mathrm{kg}$ の台車 A が、左向きに速さ $2.0\,\mathrm{m/s}$ で進む質量 $1.0\,\mathrm{kg}$ の台車 B と正面衝突した。衝突後は 2 台の台車がくっついて、一体となって運動した。右向きを正とする。`,
      fig: figCarts(),
      parts: [
        { label: '(1)', q: R`衝突後の 2 台の速度は何 $\mathrm{m/s}$ か。右向きを正として答えよ。`, type: 'num', answer: 2.5, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`衝突のとき、B が A から受けた力積の大きさは何 $\mathrm{N\cdot s}$ か。`, type: 'num', answer: 4.5, rel: 0.02, unit: 'N·s' },
        { label: '(3)', q: R`衝突によって失われた運動エネルギーは何 $\mathrm{J}$ か。`, type: 'num', answer: 13.5, rel: 0.02, unit: 'J' }
      ],
      solution: [
        {
          t: '運動量保存の法則を立てる',
          m: R`m_{A}v_{A} + m_{B}v_{B} = (m_{A}+m_{B})\,v'`,
          n: R`衝突の間に台車どうしが及ぼしあう力（内力）は大きくても、水平方向の外力ははたらきません（水平面はなめらか）。そのため、2 台の運動量の和は衝突の前後で変わりません。速度は向きを含めて、右向きを正として符号つきで扱います（A は $v_{A}=+4.0\,\mathrm{m/s}$、B は $v_{B}=-2.0\,\mathrm{m/s}$）。`,
          easy: R`**運動量**は「質量 × 速度」で、向きをもつ量です。衝突は一瞬の出来事で、台車どうしが押し合うだけなので、2 台の運動量を合計した値は衝突の前後で変わりません（**運動量保存の法則**）。右向きを正にしたので、左向きに動く B の速度は負の値 $-2.0$ になります。`,
          lv: 1
        },
        {
          t: '衝突後の速度（(1)）',
          m: [R`3.0\times 4.0 + 1.0\times(-2.0) = (3.0+1.0)\,v'`,
              R`v' = \frac{12 - 2.0}{4.0} = 2.5\,\mathrm{m/s}`],
          n: R`値が正なので、2 台は右向きに $2.5\,\mathrm{m/s}$ で進みます。`,
          lv: 1
        },
        {
          t: 'B が受けた力積（(2)）',
          m: R`I_{B} = m_{B}v' - m_{B}v_{B} = 1.0\times 2.5 - 1.0\times(-2.0) = 4.5\,\mathrm{N\cdot s}`,
          n: R`力積は運動量の変化に等しい（$I=\Delta p$）ので、B の衝突前後の運動量の変化を求めます。B は左向き $2.0\,\mathrm{m/s}$ から右向き $2.5\,\mathrm{m/s}$ に変わったので、運動量の変化は右向きに $4.5\,\mathrm{N\cdot s}$ です。作用・反作用の法則から、A は逆向き（左向き）に同じ大きさの力積を受けます（確認: $3.0\times2.5-3.0\times4.0=-4.5$）。`,
          easy: R`**力積**は「力 × 力のはたらいた時間」で、物体の運動量を変化させる量です。B の運動量は、衝突前が $1.0\times(-2.0)=-2.0$、衝突後が $1.0\times2.5=+2.5$ です。差は $2.5-(-2.0)=4.5$ で、これが B が A から受けた力積です。`,
          pro: R`向きが逆転するときは符号に注意する。変化は $2.5-2.0$ ではなく $2.5-(-2.0)$。`,
          lv: 1
        },
        {
          t: '失われた運動エネルギー（(3)）',
          m: [R`K_{\text{前}} = \frac{1}{2}\times 3.0\times 4.0^{2} + \frac{1}{2}\times 1.0\times 2.0^{2} = 24 + 2.0 = 26\,\mathrm{J}`,
              R`K_{\text{後}} = \frac{1}{2}\times(3.0+1.0)\times 2.5^{2} = 12.5\,\mathrm{J}`,
              R`\Delta K = 26 - 12.5 = 13.5\,\mathrm{J}`],
          n: R`運動エネルギーは $\frac{1}{2}mv^{2}$ で、向きに関係しないので、速さの 2 乗を使います。失われた分は、熱・音・台車の変形などに変わります。`,
          pro: R`運動量は保存されるが、運動エネルギーは保存されない（反発係数 $e=0$ の完全非弾性衝突）。衝突後の運動エネルギーは前より必ず減る。`,
          lv: 1
        }
      ],
      tags: ['運動量保存', '力積', '完全非弾性衝突']
    },

    /* ---------- 仕事と力学的エネルギー ---------- */
    {
      id: 'p-basic-energy-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-energy',
      title: '斜めに引く力がする仕事',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`あらい水平な床の上に、質量 $5.0\,\mathrm{kg}$ の物体を置く。この物体を、水平と角 $\theta$ をなす斜め上向きの一定の力 $F=20\,\mathrm{N}$ で引き、静止の状態から水平に $5.0\,\mathrm{m}$ 動かした。$\cos\theta=0.80$、$\sin\theta=0.60$ とする。物体と床の間の動摩擦係数は $0.10$、重力加速度の大きさは $9.8\,\mathrm{m/s^{2}}$ で、物体は床から浮き上がらない。`,
      fig: figPull(false),
      parts: [
        { label: '(1)', q: R`力 $F$ が物体にした仕事は何 $\mathrm{J}$ か。`, type: 'num', answer: 80, rel: 0.02, unit: 'J' },
        { label: '(2)', q: R`動摩擦力が物体にした仕事は何 $\mathrm{J}$ か。負の仕事は負の値で答えよ。`, type: 'num', answer: -18.5, rel: 0.02, unit: 'J' },
        { label: '(3)', q: R`$5.0\,\mathrm{m}$ 動いたときの物体の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 4.96, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        {
          t: '力がした仕事（(1)）',
          m: [R`W = Fs\cos\theta`,
              R`W_{F} = 20\times 5.0\times 0.80 = 80\,\mathrm{J}`],
          n: R`仕事は「力の大きさ × 移動距離 × $\cos\theta$」です。$\theta$ は、力の向きと移動の向きがなす角です。物体が動く向き（水平方向）にはたらく力の成分は $F\cos\theta=16\,\mathrm{N}$ です。`,
          easy: R`**仕事**は、「力のうち、物体が動く向きにはたらく成分」と「動いた距離」の積です。斜めに引くと、動く向きに効いているのは $F\cos\theta$ の分だけで、残りの $F\sin\theta$ は物体を持ち上げる向きにはたらきます（図の点線）。`,
          fig: figPull(true),
          lv: 1
        },
        {
          t: '動摩擦力がした仕事（(2)）',
          m: [R`N + F\sin\theta = mg \;\Longrightarrow\; N = 5.0\times 9.8 - 20\times 0.60 = 37\,\mathrm{N}`,
              R`f' = \mu' N = 0.10\times 37 = 3.7\,\mathrm{N}`,
              R`W_{f} = -f's = -3.7\times 5.0 = -18.5\,\mathrm{J}`],
          n: R`鉛直方向の力のつり合いから、垂直抗力 $N$ を求めます。斜め上に引くと、床を押しつける力が小さくなるので、$N$ は $mg=49\,\mathrm{N}$ より小さくなります。動摩擦力は移動と逆向きにはたらくので、仕事は負（$\theta=180\degree$ で $\cos180\degree=-1$）です。`,
          easy: R`物体が床におしつけられる強さ（垂直抗力 $N$）は、上向きの力 $F\sin\theta=12\,\mathrm{N}$ が物体を軽くするぶん、重さ $49\,\mathrm{N}$ より小さい $37\,\mathrm{N}$ です。摩擦力は「$\mu'\times N$」で決まります。摩擦力は物体の動きをじゃまする向きなので、仕事は**マイナス**になります。`,
          pro: R`$N=mg$ とおくひっかけが頻出。斜め上に引くと $N$ は減る。`,
          lv: 1
        },
        {
          t: '仕事と運動エネルギー（(3)）',
          m: [R`\frac{1}{2}mv^{2} - 0 = W_{F} + W_{f}`,
              R`\frac{1}{2}\times 5.0\times v^{2} = 80 - 18.5 = 61.5`,
              R`v = \sqrt{\frac{2\times 61.5}{5.0}} = \sqrt{24.6} \approx 4.96\,\mathrm{m/s}`],
          n: R`重力と垂直抗力は移動の向きと垂直なので、仕事は $0$ です。物体がされた仕事の合計が、運動エネルギーの増加（はじめは静止していたので $\frac{1}{2}mv^{2}$）に等しくなります。`,
          pro: R`別解: 運動方程式で $a=\dfrac{F\cos\theta-f'}{m}=\dfrac{16-3.7}{5.0}=2.46\,\mathrm{m/s^{2}}$、$v^{2}=2as=24.6$ となり、同じ結果。「力」と「距離」が与えられる問題は仕事とエネルギーの方が速い。`,
          lv: 1
        }
      ],
      tags: ['仕事', '動摩擦力', '仕事と運動エネルギー']
    },

    /* ---------- 円運動 ---------- */
    {
      id: 'p-basic-circular-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-circular',
      title: '回転する円板上の小物体',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`水平な円板が、中心 O を通る鉛直な軸のまわりを一定の角速度で回転している。円板上で O から $0.25\,\mathrm{m}$ はなれた位置に、質量 $0.20\,\mathrm{kg}$ の小物体 P を置いたところ、P は円板に対して静止したまま、円板といっしょに周期 $2.0\,\mathrm{s}$ の等速円運動をした。円周率を $\pi=3.14$、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figTurntable(false),
      parts: [
        { label: '(1)', q: R`P の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 0.785, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`P にはたらく静止摩擦力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 0.493, rel: 0.02, unit: 'N' },
        { label: '(3)', q: R`円板の角速度をしだいに大きくしていくと、角速度が $\omega_{0}$ をこえたところで P が円板上をすべり出した。P と円板の間の静止摩擦係数を $0.40$ として、$\omega_{0}$ は何 $\mathrm{rad/s}$ か。`, type: 'num', answer: 3.96, rel: 0.02, unit: 'rad/s' }
      ],
      solution: [
        {
          t: '前提: 角度をラジアンで表す（弧度法）',
          m: [R`1\,\text{周} = 360\degree = 2\pi\,\mathrm{rad}`,
              R`\text{弧の長さ} = r\times\theta\qquad(\theta\ \text{は}\ \mathrm{rad}\ \text{で表した角})`],
          n: R`円運動では、角度を「度」ではなく**ラジアン**（$\mathrm{rad}$）で表します。半径 $r$ の円で、弧の長さが $r$ になる角度が $1\,\mathrm{rad}$（約 $57\degree$）です。1 周の角度は $2\pi\,\mathrm{rad}\approx6.28\,\mathrm{rad}$ になります。この表し方を使うと、弧の長さ（進んだ距離）が「半径 × 角度」という簡単な式で表せます。`,
          easy: R`たとえば、半径 $0.25\,\mathrm{m}$ の円を $2\,\mathrm{rad}$ だけ回ると、進んだ距離は $0.25\times2=0.50\,\mathrm{m}$ です。1 秒あたりに回る角度（角速度 $\omega\,[\mathrm{rad/s}]$）に半径をかければ速さになる、という式 $v=r\omega$ は、この関係から出てきます。`,
          lv: 3
        },
        {
          t: '角速度と速さ（(1)）',
          m: [R`\omega = \frac{2\pi}{T} = \frac{2\times 3.14}{2.0} = 3.14\,\mathrm{rad/s}`,
              R`v = r\omega = 0.25\times 3.14 = 0.785\,\mathrm{m/s}`],
          n: R`周期 $T$ は 1 周するのにかかる時間です。1 周は $2\pi\,\mathrm{rad}$ なので、角速度は $\omega=\dfrac{2\pi}{T}$、半径 $r$ の円周上の速さは $v=r\omega$ です。`,
          easy: R`円板が 1 周（角度でいうと $2\pi\approx6.28\,\mathrm{rad}$）するのに $2.0\,\mathrm{s}$ かかるので、1 秒あたり $3.14\,\mathrm{rad}$ 回ります。これが**角速度**です。P は半径 $0.25\,\mathrm{m}$ の円周上を動くので、「1 周の長さ $2\pi r$ ÷ 周期 $T$」からも速さが出ます（$2\times3.14\times0.25\div2.0=0.785$）。`,
          lv: 1
        },
        {
          t: '向心力としての静止摩擦力（(2)）',
          m: [R`m\,r\omega^{2} = f`,
              R`f = 0.20\times 0.25\times 3.14^{2} \approx 0.493\,\mathrm{N}`],
          n: R`等速円運動をする物体には、円の中心に向かう力（**向心力**）がはたらきます。円板上で P にはたらく水平方向の力は静止摩擦力 $f$ だけなので、これが向心力です。向心加速度は $r\omega^{2}$（$=v^{2}/r$）、運動方程式は $m\cdot r\omega^{2}=f$ です。`,
          easy: R`円板の上で P がずれずに回っているのは、円板が P を中心向きに引っぱる摩擦力がはたらいているからです。この摩擦力が P を円運動させる向心力の役をしています（図の $f$）。摩擦がなければ、P は円板の外へ飛び出してしまいます。`,
          fig: figTurntable(true),
          lv: 1
        },
        {
          t: 'すべり出す条件（(3)）',
          m: [R`m\,r\omega_{0}^{2} = \mu m g`,
              R`\omega_{0} = \sqrt{\frac{\mu g}{r}} = \sqrt{\frac{0.40\times 9.8}{0.25}} = \sqrt{15.68} \approx 3.96\,\mathrm{rad/s}`],
          n: R`角速度が大きくなると、円運動に必要な向心力 $mr\omega^{2}$ が大きくなります。静止摩擦力は最大 $\mu N=\mu mg$ までしか出せないので、必要な向心力が最大摩擦力に等しくなる角速度がすべり出す境目です。`,
          pro: R`質量 $m$ が消える。すべり出す角速度は $\sqrt{\mu g/r}$ で、物体の質量によらず、中心から遠いほど小さい。`,
          lv: 1
        }
      ],
      tags: ['等速円運動', '向心力', '静止摩擦力']
    },

    /* ---------- 単振動 ---------- */
    {
      id: 'p-basic-shm-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-shm',
      title: 'ばね振り子の x-t グラフ',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`なめらかな水平面上で、一端を固定したばねの他端に質量 $0.50\,\mathrm{kg}$ の物体をつけ、つり合いの位置 O から右へ $0.20\,\mathrm{m}$ 引いて静かに放したところ、物体は O を中心とする単振動をした。右向きを正として、O からの物体の位置 $x$ を時刻 $t$ に対して表したものが図である。円周率を $\pi=3.14$ とする。`,
      fig: figShmGraph(false),
      parts: [
        { label: '(1)', q: R`この単振動の振動数は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 0.25, rel: 0.02, unit: 'Hz' },
        { label: '(2)', q: R`物体の速さの最大値は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 0.314, rel: 0.02, unit: 'm/s' },
        { label: '(3)', q: R`ばねのばね定数は何 $\mathrm{N/m}$ か。`, type: 'num', answer: 1.23, rel: 0.02, unit: 'N/m' }
      ],
      solution: [
        {
          t: 'グラフから振幅と周期を読み取る',
          n: R`$x$ の最大値が**振幅** $A=0.20\,\mathrm{m}$ です。$x$ が最大になる時刻 $t=0$ から、次に最大になる $t=4.0\,\mathrm{s}$ までが 1 往復なので、**周期** $T=4.0\,\mathrm{s}$ です。`,
          easy: R`単振動は、同じ往復をくり返す運動です。グラフが 1 つの山から次の山までに要する時間が**周期**（1 往復にかかる時間）、山の高さ（中心からの最大のずれ）が**振幅**です。このグラフでは、$t=0$ に最大、$t=4$ にまた最大になっています。`,
          fig: figShmGraph(true),
          lv: 1
        },
        {
          t: '振動数と角振動数（(1)）',
          m: [R`f = \frac{1}{T} = \frac{1}{4.0} = 0.25\,\mathrm{Hz}`,
              R`\omega = 2\pi f = \frac{2\pi}{T} = \frac{2\times 3.14}{4.0} = 1.57\,\mathrm{rad/s}`],
          n: R`**振動数** $f$ は 1 秒間に往復する回数です。**角振動数** $\omega$ は、単振動を等速円運動の正射影と見たときの角速度にあたり、$\omega=2\pi f$ です。`,
          lv: 1
        },
        {
          t: '速さの最大値（(2)）',
          m: R`v_{\max} = A\omega = 0.20\times 1.57 = 0.314\,\mathrm{m/s}`,
          n: R`速さが最大になるのは、つり合いの位置 O（$x=0$）を通るときです。`,
          easy: R`単振動は、半径 $A$ の円周上を角速度 $\omega$ で回る点を真横から見た動きと同じです。円周上の点の速さは $A\omega$ で、これが真横から見たときの最大の速さ（O を通るとき）になります。`,
          pro: R`エネルギー保存 $\dfrac{1}{2}kA^{2}=\dfrac{1}{2}mv_{\max}^{2}$ より $v_{\max}=A\sqrt{k/m}=A\omega$。`,
          lv: 1
        },
        {
          t: R`前提: なぜ $\omega=\sqrt{k/m}$ になるのか`,
          m: [R`ma = -kx`,
              R`a = -\frac{k}{m}\,x = -\omega^{2}x \;\Longrightarrow\; \omega^{2} = \frac{k}{m}`],
          n: R`つり合いの位置からのずれ $x$ に比例して、ずれと逆向きにばねの力（復元力）$-kx$ がはたらきます。運動方程式 $ma=-kx$ から加速度は $a=-\dfrac{k}{m}x$ となり、単振動の加速度 $a=-\omega^{2}x$ と比べて $\omega^{2}=\dfrac{k}{m}$ とわかります。`,
          easy: R`ばねを引っぱるほど、もとにもどそうとする力は強くなります。この力は、ずれに比例して、ずれと逆向きにはたらく（**復元力** $F=-kx$）ので、物体は行ったり来たりをくり返します。この運動方程式を満たす動きが単振動で、角振動数は $\omega=\sqrt{k/m}$ です。ばねが硬い（$k$ が大きい）ほど、物体が軽い（$m$ が小さい）ほど、速く振動します。`,
          lv: 3
        },
        {
          t: 'ばね定数（(3)）',
          m: [R`\omega = \sqrt{\frac{k}{m}} \;\Longrightarrow\; k = m\omega^{2}`,
              R`k = 0.50\times 1.57^{2} \approx 1.23\,\mathrm{N/m}`],
          n: R`ばね振り子の周期 $T=2\pi\sqrt{\dfrac{m}{k}}$ から、$k=\dfrac{4\pi^{2}m}{T^{2}}=\dfrac{4\times3.14^{2}\times0.50}{4.0^{2}}\approx1.23\,\mathrm{N/m}$ と求めても同じです。`,
          pro: R`$\omega=\sqrt{k/m}$ は暗記しておく。$k$ を求める問題は $k=m\omega^{2}$ か $k=4\pi^{2}m/T^{2}$。`,
          lv: 1
        }
      ],
      tags: ['単振動', 'x-tグラフ', 'ばね振り子']
    },

    /* ---------- 熱量と比熱 ---------- */
    {
      id: 'p-basic-heat-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-heat',
      title: '氷の加熱と温度変化',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`$-20\degree\mathrm{C}$ の氷 $0.100\,\mathrm{kg}$ を、出力 $200\,\mathrm{W}$ のヒーターで一定の割合で加熱した。ヒーターで発生した熱は、すべて氷（水）に与えられるものとする。図は、加熱を始めてからの時間 $t$ と温度 $T$ の関係の概略で、点 P は氷が $0\degree\mathrm{C}$ に達した点、点 Q は氷がすべてとけ終わった点、点 R は水が $100\degree\mathrm{C}$ に達した点である。氷の比熱を $2.1\times10^{3}\,\mathrm{J/(kg\cdot K)}$、水の比熱を $4.2\times10^{3}\,\mathrm{J/(kg\cdot K)}$、氷の融解熱を $3.3\times10^{5}\,\mathrm{J/kg}$ とする。`,
      fig: figHeating(),
      parts: [
        { label: '(1)', q: R`氷を $-20\degree\mathrm{C}$ から $0\degree\mathrm{C}$（点 P）まで温めるのに必要な熱量は何 $\mathrm{J}$ か。`, type: 'num', answer: 4200, rel: 0.02, unit: 'J', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        { label: '(2)', q: R`点 Q に達するのは、加熱を始めてから何 $\mathrm{s}$ 後か。`, type: 'num', answer: 186, rel: 0.02, unit: 's' },
        { label: '(3)', q: R`点 R に達するのは、加熱を始めてから何 $\mathrm{s}$ 後か。`, type: 'num', answer: 396, rel: 0.02, unit: 's' }
      ],
      solution: [
        {
          t: '熱量の 3 つの式',
          m: [R`Q = mc\Delta T\qquad(\text{温度が変わるとき})`,
              R`Q = mL\qquad(\text{状態が変わるとき: 温度は一定})`,
              R`Q = Pt\qquad(\text{出力 } P \text{ のヒーターが } t \text{ 秒間に出す熱})`],
          n: R`図のア・ウは温度が上がる区間なので $Q=mc\Delta T$、イは温度が一定で氷が水に変わる区間なので $Q=mL$ を使います。ヒーターの出力が一定なので、加えた熱量は時間に比例します。`,
          easy: R`物体に熱を与えると、ふつうは温度が上がります（$mc\Delta T$）。ところが、氷がとけている間は、与えた熱が「氷を水に変える」ことに使われて、温度は $0\degree\mathrm{C}$ のまま上がりません（グラフの水平な部分）。このとき必要な熱が**融解熱** $L$（物質 $1\,\mathrm{kg}$ あたり）です。`,
          lv: 2
        },
        {
          t: '氷の温度上昇に必要な熱量（(1)）',
          m: R`Q_{1} = m\,c_{\text{氷}}\,\Delta T = 0.100\times 2.1\times10^{3}\times 20 = 4.2\times10^{3}\,\mathrm{J}`,
          n: R`$-20\degree\mathrm{C}$ から $0\degree\mathrm{C}$ までは $\Delta T=20\,\mathrm{K}$ です。温度差は、セルシウス温度でも絶対温度でも同じ値です。`,
          easy: R`比熱は「$1\,\mathrm{kg}$ の物質の温度を $1\,\mathrm{K}$ 上げるのに必要な熱量」です。氷は $0.100\,\mathrm{kg}$ で、$20\,\mathrm{K}$ 上げるので、$2.1\times10^{3}\times0.100\times20$ になります。`,
          lv: 1
        },
        {
          t: '氷がとけ終わるまでの時間（(2)）',
          m: [R`Q_{2} = mL = 0.100\times 3.3\times10^{5} = 3.3\times10^{4}\,\mathrm{J}`,
              R`Pt_{Q} = Q_{1}+Q_{2} \;\Longrightarrow\; t_{Q} = \frac{4.2\times10^{3}+3.3\times10^{4}}{200} = 186\,\mathrm{s}`],
          n: R`点 Q までにヒーターが出した熱 $Pt_{Q}$ は、氷を $0\degree\mathrm{C}$ にする熱 $Q_{1}$ と、とかす熱 $Q_{2}$ の合計に等しくなります。`,
          lv: 1
        },
        {
          t: R`水が $100\degree\mathrm{C}$ になるまでの時間（(3)）`,
          m: [R`Q_{3} = m\,c_{\text{水}}\,\Delta T = 0.100\times 4.2\times10^{3}\times 100 = 4.2\times10^{4}\,\mathrm{J}`,
              R`t_{R} = \frac{Q_{1}+Q_{2}+Q_{3}}{P} = \frac{4.2\times10^{3}+3.3\times10^{4}+4.2\times10^{4}}{200} = 396\,\mathrm{s}`],
          n: R`点 R までに加えた熱量の合計を、ヒーターの出力で割れば時間が出ます（$t=Q\div P$）。`,
          pro: R`ヒーターの出力が一定なら、各区間にかかる時間の比は熱量の比に等しい。ここでは $21\,\mathrm{s}:165\,\mathrm{s}:210\,\mathrm{s}$（合計 $396\,\mathrm{s}$）。`,
          lv: 1
        }
      ],
      tags: ['比熱', '融解熱', '加熱曲線']
    },

    /* ---------- ボイル・シャルルの法則 ---------- */
    {
      id: 'p-basic-gas-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-gas',
      title: 'ピストンで閉じた気体',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`断面積 $2.5\times10^{-3}\,\mathrm{m^{2}}$、質量 $5.0\,\mathrm{kg}$ のなめらかに動くピストンのついた鉛直な円筒容器に、理想気体を閉じこめた。大気圧は $1.0\times10^{5}\,\mathrm{Pa}$ で、ピストンは容器の底から高さ $20\,\mathrm{cm}$ の位置で静止した。このときの気体の温度は $27\degree\mathrm{C}$ である。重力加速度の大きさは $9.8\,\mathrm{m/s^{2}}$ とし、セルシウス温度 $t\,[\degree\mathrm{C}]$ と絶対温度 $T\,[\mathrm{K}]$ の関係は $T=t+273$ とする。`,
      fig: figPiston(),
      parts: [
        { label: '(1)', q: R`このときの気体の圧力は何 $\mathrm{Pa}$ か。`, type: 'num', answer: 119600, rel: 0.02, unit: 'Pa', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        { label: '(2)', q: R`気体をゆっくり加熱して、温度を $87\degree\mathrm{C}$ にした。ピストンの高さは容器の底から何 $\mathrm{cm}$ になるか。`, type: 'num', answer: 24, rel: 0.02, unit: 'cm' },
        { label: '(3)', q: R`気体の温度を $87\degree\mathrm{C}$ に保ったまま、ピストンの上に質量 $m$ のおもりをそっとのせたところ、ピストンの高さが $20\,\mathrm{cm}$ にもどった。$m$ は何 $\mathrm{kg}$ か。`, type: 'num', answer: 6.1, rel: 0.02, unit: 'kg' }
      ],
      solution: [
        {
          t: 'ピストンのつり合いから圧力を求める（(1)）',
          m: [R`pS = p_{0}S + Mg \;\Longrightarrow\; p_{1} = p_{0} + \frac{Mg}{S}`,
              R`p_{1} = 1.0\times10^{5} + \frac{5.0\times 9.8}{2.5\times10^{-3}} = 1.196\times10^{5} \approx 1.2\times10^{5}\,\mathrm{Pa}`],
          n: R`ピストンには、気体が押し上げる力 $pS$、大気が押し下げる力 $p_{0}S$、重力 $Mg$ がはたらき、静止しているのでつり合っています。`,
          easy: R`気体の圧力は、ピストンをどのくらいの力で支えているかで決まります。ピストンの上からは大気（$p_{0}S$）とピストン自身の重さ（$Mg$）が押し下げているので、下から気体がそれと同じ力で押し上げています。力を断面積 $S$ で割れば圧力になります。`,
          lv: 1
        },
        {
          t: '加熱: 圧力一定で体積が変わる（(2)）',
          m: [R`T_{1} = 273+27 = 300\,\mathrm{K},\qquad T_{2} = 273+87 = 360\,\mathrm{K}`,
              R`\frac{V_{1}}{T_{1}} = \frac{V_{2}}{T_{2}} \;\Longrightarrow\; \frac{20S}{300} = \frac{h_{2}S}{360} \;\Longrightarrow\; h_{2} = 24\,\mathrm{cm}`],
          n: R`ピストンは自由に動き、そのつり合いの式は変わらないので、加熱の間も気体の圧力は $p_{1}$ のままです（定圧変化）。体積は高さに比例します（断面積が一定）。**シャルルの法則**を、絶対温度で使います。`,
          easy: R`気体の法則では、セルシウス温度（$\degree\mathrm{C}$）ではなく**絶対温度** $T=t+273\,[\mathrm{K}]$ を使います。絶対温度に直すと、気体の体積は温度に比例してふえるというシャルルの法則が単純な式で書けるからです。$27\degree\mathrm{C}=300\,\mathrm{K}$、$87\degree\mathrm{C}=360\,\mathrm{K}$ です。`,
          pro: R`圧力一定なら体積比 = 絶対温度比。高さの比 $\dfrac{360}{300}=1.2$ をかけるだけ: $20\times1.2=24$。`,
          lv: 1
        },
        {
          t: 'おもりをのせる: 温度一定で圧力が変わる（(3)）',
          m: [R`p_{1}\times 24 = p_{3}\times 20 \;\Longrightarrow\; p_{3} = 1.196\times10^{5}\times 1.2 \approx 1.435\times10^{5}\,\mathrm{Pa}`,
              R`p_{3} = p_{0} + \frac{(M+m)g}{S} \;\Longrightarrow\; m = \frac{(p_{3}-p_{1})S}{g} = \frac{2.39\times10^{4}\times 2.5\times10^{-3}}{9.8} \approx 6.1\,\mathrm{kg}`],
          n: R`温度が一定なので**ボイルの法則** $pV=\text{一定}$ を使います。高さが $24\,\mathrm{cm}$ から $20\,\mathrm{cm}$ になった（体積が $\frac{5}{6}$ 倍）ので、圧力は $\frac{6}{5}$ 倍になります。おもりをのせたあとのピストンのつり合いから、$m$ を求めます。`,
          pro: R`おもりをのせる前後の圧力の差は $\Delta p=\dfrac{mg}{S}$。$p_{3}-p_{1}$ を求めて $m=\dfrac{\Delta p\,S}{g}$ とすると速い。`,
          lv: 1
        }
      ],
      tags: ['ボイルの法則', 'シャルルの法則', '圧力のつり合い']
    },

    /* ---------- 熱力学第一法則 ---------- */
    {
      id: 'p-basic-thermo1-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-thermo1',
      title: '定積・定圧変化と熱量',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`一定量の単原子分子理想気体を、図の状態 A から B, C の順にゆっくり変化させた。A → B は体積が一定の変化、B → C は圧力が一定の変化である。状態 A, B, C の圧力 $p$ と体積 $V$ は図のとおりである。単原子分子理想気体の内部エネルギーの変化は、物質量を $n$、気体定数を $R$、温度変化を $\Delta T$ として $\Delta U=\dfrac{3}{2}nR\Delta T$ と表される。`,
      fig: figPV(),
      parts: [
        { label: '(1)', q: R`A → B の間に、気体が吸収した熱量は何 $\mathrm{J}$ か。`, type: 'num', answer: 300, rel: 0.02, unit: 'J' },
        { label: '(2)', q: R`B → C の間に、気体が外部にした仕事は何 $\mathrm{J}$ か。`, type: 'num', answer: 600, rel: 0.02, unit: 'J' },
        { label: '(3)', q: R`A → B → C の全体で、気体が吸収した熱量は何 $\mathrm{J}$ か。`, type: 'num', answer: 1800, rel: 0.02, unit: 'J', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' }
      ],
      solution: [
        {
          t: '熱力学第一法則と内部エネルギーの変化',
          m: [R`Q = \Delta U + W`,
              R`\Delta U = \frac{3}{2}nR\,\Delta T = \frac{3}{2}\Delta(pV)\qquad(pV = nRT\ \text{より})`],
          n: R`$Q$ は気体が吸収した熱量、$W$ は気体が外部にした仕事（膨張するとき $W>0$）です。状態方程式 $pV=nRT$ より $nR\Delta T=\Delta(pV)$ なので、圧力と体積がわかれば $\Delta U$ を計算できます。`,
          easy: R`**熱力学第一法則**は、気体についてのエネルギーの保存です。気体が吸収した熱 $Q$ は、①気体の内部エネルギーをふやし（$\Delta U$）、②気体が外部に仕事をする（$W$）ことに使われます。温度が上がれば内部エネルギーは増え、膨張すれば気体は外部に仕事をします。`,
          lv: 1
        },
        {
          t: 'A → B（定積変化）（(1)）',
          m: [R`W_{AB} = 0`,
              R`\Delta U_{AB} = \frac{3}{2}(p_{B}-p_{A})V_{A} = \frac{3}{2}\times(2.0-1.0)\times10^{5}\times 2.0\times10^{-3} = 300\,\mathrm{J}`,
              R`Q_{AB} = \Delta U_{AB} + W_{AB} = 300\,\mathrm{J}`],
          n: R`体積が変わらないので、気体は仕事をしません（$W_{AB}=0$）。吸収した熱は、すべて内部エネルギーの増加（温度上昇）に使われます。`,
          lv: 1
        },
        {
          t: 'B → C（定圧膨張）で気体がする仕事（(2)）',
          m: R`W_{BC} = p_{B}(V_{C}-V_{B}) = 2.0\times10^{5}\times(5.0-2.0)\times10^{-3} = 600\,\mathrm{J}`,
          n: R`圧力が一定の変化では、気体のする仕事は $p\Delta V$ です。これは、p-V 図で B → C の線と体積の軸ではさまれた長方形の面積に等しくなります。`,
          easy: R`気体が膨張すると、ピストンを押して外部に仕事をします。圧力が一定のとき、仕事は「圧力 × 体積の増加量」です。p-V 図では、グラフと横軸（V 軸）ではさまれた面積が、気体のした仕事を表します。B → C は、縦 $2.0\times10^{5}\,\mathrm{Pa}$、横 $3.0\times10^{-3}\,\mathrm{m^{3}}$ の長方形です。`,
          lv: 1
        },
        {
          t: 'A → B → C 全体で吸収した熱量（(3)）',
          m: [R`\Delta U_{BC} = \frac{3}{2}(p_{C}V_{C}-p_{B}V_{B}) = \frac{3}{2}\times(1000-400) = 900\,\mathrm{J}`,
              R`Q_{BC} = \Delta U_{BC} + W_{BC} = 900 + 600 = 1500\,\mathrm{J}`,
              R`Q = Q_{AB} + Q_{BC} = 300 + 1500 = 1800\,\mathrm{J}`],
          n: R`B → C では、気体の温度が上がって内部エネルギーが増える（$900\,\mathrm{J}$）と同時に、膨張して外部に仕事（$600\,\mathrm{J}$）をするので、それらの合計 $1500\,\mathrm{J}$ の熱を吸収します。`,
          pro: R`別解: 内部エネルギーは状態量なので、A と C だけで決まる。$\Delta U_{AC}=\dfrac{3}{2}(p_{C}V_{C}-p_{A}V_{A})=\dfrac{3}{2}\times(1000-200)=1200\,\mathrm{J}$、気体がした仕事は $W=600\,\mathrm{J}$（A → B は 0）より $Q=1200+600=1800\,\mathrm{J}$。`,
          lv: 1
        }
      ],
      tags: ['熱力学第一法則', 'p-V図', '定積変化', '定圧変化']
    },

    /* ---------- 波の性質 ---------- */
    {
      id: 'p-basic-wave-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-wave',
      title: '正弦波のグラフと波の速さ',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`$x$ 軸の正の向きに進む正弦波がある。図は、時刻 $t=0$ における、この波の媒質の変位 $y$ と位置 $x$ の関係を表したものである。この波の振動数は $0.50\,\mathrm{Hz}$ である。`,
      fig: figWave(false),
      parts: [
        { label: '(1)', q: R`この波の伝わる速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 4, rel: 0.02, unit: 'm/s' },
        {
          label: '(2)', q: R`時刻 $t=0$ のとき、図の点 P（$x=4.0\,\mathrm{m}$）の媒質は、どの向きに動いているか。`,
          type: 'choice',
          choices: [R`$y$ 軸の負の向き（下向き）`, R`$x$ 軸の正の向き（右向き）`, R`$y$ 軸の正の向き（上向き）`, R`動いていない（速さが $0$）`],
          answer: 2,
          explain: R`波は $x$ 軸の正の向きに進むので、波形が少しずつ右へずれていきます。少し後には、P の左側にあった山が P に近づいてくるので、P の変位は $0$ から正の値に変わります。したがって P は上向きに動いています。媒質は波といっしょに右へ進むのではなく、その場で上下に振動するだけです。`
        },
        {
          label: '(3)', q: R`時刻 $t=0.50\,\mathrm{s}$ の波形（実線）として正しいものはどれか。各グラフの点線は $t=0$ の波形である。`,
          type: 'choice',
          choices: [{ fig: figWaveOpt(0) }, { fig: figWaveOpt(6) }, { fig: figWaveOpt(4) }, { fig: figWaveOpt(2) }],
          answer: 3,
          explain: R`波は $0.50\,\mathrm{s}$ の間に $vt=4.0\times0.50=2.0\,\mathrm{m}$ 進みます。波形は形を変えずに右（$x$ 軸の正の向き）へ $2.0\,\mathrm{m}$（波長の $\frac{1}{4}$）ずれるので、山が $x=2.0\,\mathrm{m}$ から $x=4.0\,\mathrm{m}$ へ移った ④ が正しい図です。① は動いていない図、② は左へずれた図、③ は半波長（$4.0\,\mathrm{m}$）ずれた図です。`
        }
      ],
      solution: [
        {
          t: '波長を図から読み取る',
          n: R`**波長**は、波形の同じ状態がくり返される長さです。図で、山の位置 $x=2.0\,\mathrm{m}$ から次の山の位置 $x=10\,\mathrm{m}$ までが $8.0\,\mathrm{m}$ なので、$\lambda=8.0\,\mathrm{m}$ です。`,
          easy: R`波は、山と谷が一定の間隔でくり返される形をしています。「山から次の山まで」（谷から次の谷まででも同じ）の長さが**波長**です。$y=0$ の点で数えるときは、「同じ向きに横切る点」どうし（たとえば $x=0$ と $x=8$）の間隔をとります。山から隣の谷までの長さ（$4.0\,\mathrm{m}$）は半波長なので、波長と間違えないようにします。`,
          lv: 1
        },
        {
          t: '波の速さ（(1)）',
          m: R`v = f\lambda = 0.50\times 8.0 = 4.0\,\mathrm{m/s}`,
          n: R`1 秒間に $f$ 個の波が通り過ぎ、1 個の長さが $\lambda$ なので、波は 1 秒間に $f\lambda$ だけ進みます。周期 $T=\dfrac{1}{f}=2.0\,\mathrm{s}$ を使えば、$v=\dfrac{\lambda}{T}$（1 周期に 1 波長進む）とも書けます。`,
          pro: R`$v=f\lambda=\dfrac{\lambda}{T}$ は波の基本式。単位は $\mathrm{Hz}\times\mathrm{m}=\mathrm{m/s}$。`,
          lv: 1
        },
        {
          t: '点 P の媒質の動く向き（(2)）',
          n: R`波は右へ進むので、少し後の波形は、現在の波形を右へずらしたもの（点線）になります。P の位置（$x=4.0\,\mathrm{m}$）では、変位が $0$ から正の値（点線の高さ）に変わるので、P は**上向き**に動いています。`,
          easy: R`波が進むとは、「波の形が移動していく」ことです。でも、媒質（ロープや水）そのものは右へ進まず、その場で上下に動くだけです。そこで、波の形を右に少しずらした図（点線）を描き、P の位置で変位がどう変わるかを見ます。点線が実線より上にあれば、P は上へ動いています。`,
          pro: R`「波の進む向きに少しだけずらした波形を描いて、その点の変位の変化を見る」のが定石。波の進む向きと逆側に山があれば上向き。`,
          fig: figWave(true),
          lv: 1
        },
        {
          t: R`$0.50\,\mathrm{s}$ 後の波形（(3)）`,
          m: [R`vt = 4.0\times 0.50 = 2.0\,\mathrm{m}`,
              R`T = \frac{1}{f} = 2.0\,\mathrm{s} \;\Longrightarrow\; t = 0.50\,\mathrm{s} = \frac{T}{4}`],
          n: R`波は形を変えずに進むので、$t=0.50\,\mathrm{s}$ の波形は、$t=0$ の波形を右（$x$ 軸の正の向き）へ $vt=2.0\,\mathrm{m}$、つまり波長の $\frac{1}{4}$ だけ平行にずらしたものです。山は $x=2.0\,\mathrm{m}$ から $x=4.0\,\mathrm{m}$ へ、谷は $x=6.0\,\mathrm{m}$ から $x=8.0\,\mathrm{m}$ へ移ります。したがって正しいのは ④ です。`,
          easy: R`波が進むとは、波の形がそのまま移動していくことです。$0.50$ 秒の間に進む距離は「速さ × 時間」で $4.0\times0.50=2.0\,\mathrm{m}$ です。点線（もとの波形）の山は $x=2.0\,\mathrm{m}$ にあるので、その山が右へ $2.0\,\mathrm{m}$ 動いた $x=4.0\,\mathrm{m}$ の位置に山がある図が正解になります。山のような目印の位置に注目すると見分けやすくなります。`,
          pro: R`周期 $T$ の $\dfrac{1}{4}$ の時間がたつと、波形は $\dfrac{\lambda}{4}$ だけ進む。「$\dfrac{T}{4}$ 後は山が $\dfrac{\lambda}{4}$ 右へ」を使えば計算せずに選べる。`,
          fig: figWaveShift(),
          lv: 1
        }
      ],
      tags: ['正弦波', '波長', '波の速さ', '媒質の動き', '波形の移動']
    },

    /* ---------- ドップラー効果 ---------- */
    {
      id: 'p-basic-doppler-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-doppler',
      title: '走る救急車のサイレン',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`静止している観測者の前の直線道路を、救急車が振動数 $700\,\mathrm{Hz}$ のサイレンを鳴らしながら、一定の速さ $20\,\mathrm{m/s}$ で観測者に近づき、前を通り過ぎて遠ざかっていく。音の速さを $340\,\mathrm{m/s}$ とし、風はないものとする。`,
      fig: figDoppler(false),
      parts: [
        { label: '(1)', q: R`救急車の進行方向の前方に出ていく音波の波長は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.457, rel: 0.02, unit: 'm' },
        { label: '(2)', q: R`救急車が観測者に近づいているとき、観測者が聞く音の振動数は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 743.75, rel: 0.02, unit: 'Hz' },
        { label: '(3)', q: R`救急車が観測者の前を通り過ぎて遠ざかっているとき、観測者が聞く音の振動数は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 661.11, rel: 0.02, unit: 'Hz' }
      ],
      solution: [
        {
          t: '音源が動くと、波長が変わる',
          m: [R`\lambda' = \frac{V - v_{s}}{f_{0}}\quad(\text{前方}),\qquad \lambda'' = \frac{V + v_{s}}{f_{0}}\quad(\text{後方})`],
          n: R`音源は 1 秒間に $f_{0}$ 個の波を出します。その 1 秒間に、先頭の波は $V$ だけ進み、音源も $v_{s}$ だけ進みます。前方では $f_{0}$ 個の波が長さ $V-v_{s}$ の中に詰め込まれるので、波長は $\dfrac{V-v_{s}}{f_{0}}$ に縮みます。後方では $V+v_{s}$ の中に並ぶので、波長がのびます。`,
          easy: R`救急車は音（波）を出しながら、自分も前へ進んでいます。そのため、前方では波と波の間隔が縮み（波長が短くなり）、後方では引きのばされます（波長が長くなります）。図の円は、音源が出した波面で、前方（右）のほうが後方（左）より間隔がせまくなっています。`,
          fig: figDoppler(true),
          lv: 2
        },
        {
          t: '前方の波長（(1)）',
          m: R`\lambda' = \frac{V - v_{s}}{f_{0}} = \frac{340-20}{700} \approx 0.457\,\mathrm{m}`,
          n: R`音源が静止していれば波長は $\dfrac{V}{f_{0}}=\dfrac{340}{700}\approx0.486\,\mathrm{m}$ ですが、音源が近づいてくる前方では、それより短くなります。`,
          lv: 1
        },
        {
          t: '近づくときの振動数（(2)）',
          m: [R`f_{1} = \frac{V}{\lambda'} = \frac{340}{0.457} \approx 744\,\mathrm{Hz}`,
              R`f_{1} = \frac{V}{V - v_{s}}\,f_{0} = \frac{340}{340-20}\times 700 \approx 744\,\mathrm{Hz}`],
          n: R`静止している観測者には、波長 $\lambda'$ の音波が速さ $V$ で次々に届くので、1 秒間に聞く波の数は $\dfrac{V}{\lambda'}$ です。もとの $700\,\mathrm{Hz}$ より高い音に聞こえます。`,
          easy: R`波と波の間隔がせまくなった音が、いつもの速さ（$340\,\mathrm{m/s}$）で耳に届くので、1 秒間に耳に入る波の数がふえます。波の数がふえることは、高い音に聞こえることです。`,
          lv: 1
        },
        {
          t: '遠ざかるときの振動数（(3)）',
          m: R`f_{2} = \frac{V}{V + v_{s}}\,f_{0} = \frac{340}{340+20}\times 700 \approx 661\,\mathrm{Hz}`,
          n: R`遠ざかるときは、観測者のいる側が音源の後方になるので、波長がのびて $\dfrac{V+v_{s}}{f_{0}}$ になり、振動数は $700\,\mathrm{Hz}$ より低くなります。`,
          pro: R`一般形: $f=\dfrac{V-v_{o}}{V-v_{s}}f_{0}$（$v_{o}$, $v_{s}$ は観測者・音源の速度で、音源から観測者へ向かう向きを正とする）。近づくときは分母が小さく（高く）、遠ざかるときは分母が大きく（低く）なる。`,
          lv: 1
        }
      ],
      tags: ['ドップラー効果', '音源の移動', '波長']
    },

    /* ---------- 光の干渉 ---------- */
    {
      id: 'p-basic-interf-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-interf',
      title: 'ヤングの干渉実験',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`図のように、単色光を平行な 2 本のスリット $\mathrm{S_{1}}$, $\mathrm{S_{2}}$（間隔 $d=0.30\,\mathrm{mm}$）に当て、スリットから $L=1.5\,\mathrm{m}$ はなれたスクリーン上に干渉じまをつくった。スクリーン上の点 P は、中央の明線 O を $0$ 番目として数えて $4$ 番目の明線の位置にあり、O から P までの距離は $12\,\mathrm{mm}$ であった。空気の屈折率は $1$ とし、$L$ は $d$ や $\mathrm{OP}$ に比べて十分大きいものとする。`,
      fig: figYoung(),
      parts: [
        { label: '(1)', q: R`光の波長は何 $\mathrm{m}$ か。`, type: 'num', answer: 6e-7, rel: 0.02, unit: 'm', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        { label: '(2)', q: R`点 P で、$\mathrm{S_{1}}$ からの距離と $\mathrm{S_{2}}$ からの距離の差（経路差）は何 $\mathrm{m}$ か。`, type: 'num', answer: 2.4e-6, rel: 0.02, unit: 'm', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        { label: '(3)', q: R`装置全体を屈折率 $1.33$ の水の中に入れた。隣り合う明線の間隔は何 $\mathrm{mm}$ になるか。`, type: 'num', answer: 2.26, rel: 0.02, unit: 'mm' }
      ],
      solution: [
        {
          t: '明線ができる条件',
          m: [R`|\mathrm{S_{2}P} - \mathrm{S_{1}P}| = m\lambda\qquad(m = 0,\,1,\,2,\,\cdots)`,
              R`|\mathrm{S_{2}P} - \mathrm{S_{1}P}| \approx \frac{d\,x}{L}\qquad(x:\ \mathrm{OP} \text{ の距離})`],
          n: R`2 つのスリットから出た波が重なる点では、経路差が波長の整数倍のとき、山と山（谷と谷）が重なって強め合い、明線になります。スクリーン上で O から $x$ の位置の点では、$L$ が十分大きいとき、経路差を $\dfrac{dx}{L}$ と近似できます。`,
          easy: R`同じ光源から出た光が、2 つのすきまを通って、スクリーンでふたたび出会います。2 つの道のりの差（**経路差**）が波長の整数倍のとき、波の山と山が重なって強め合い、明るくなります（**明線**）。経路差が半波長ぶんずれていると、山と谷が重なって打ち消し合い、暗くなります（**暗線**）。O では経路差が $0$ なので明線（$m=0$）で、O から離れるほど経路差は大きくなります。`,
          lv: 1
        },
        {
          t: '波長（(1)）',
          m: [R`\frac{d\,x}{L} = 4\lambda \;\Longrightarrow\; \lambda = \frac{d\,x}{4L}`,
              R`\lambda = \frac{0.30\times10^{-3}\times 12\times10^{-3}}{4\times 1.5} = 6.0\times10^{-7}\,\mathrm{m}`],
          n: R`P は $4$ 番目の明線なので $m=4$ です。単位を $\mathrm{m}$ に直して代入します（$d=3.0\times10^{-4}\,\mathrm{m}$、$x=1.2\times10^{-2}\,\mathrm{m}$）。`,
          pro: R`隣り合う明線の間隔は $\Delta x=\dfrac{\lambda L}{d}$。ここでは $\Delta x=12\div4=3.0\,\mathrm{mm}$ から $\lambda=\dfrac{d\,\Delta x}{L}$ としても同じ。`,
          lv: 1
        },
        {
          t: '点 P での経路差（(2)）',
          m: R`|\mathrm{S_{2}P} - \mathrm{S_{1}P}| = 4\lambda = 4\times 6.0\times10^{-7} = 2.4\times10^{-6}\,\mathrm{m}`,
          n: R`P は $m=4$ の明線なので、経路差は波長の $4$ 倍です。確認として $\dfrac{dx}{L}=\dfrac{3.0\times10^{-4}\times1.2\times10^{-2}}{1.5}=2.4\times10^{-6}\,\mathrm{m}$ とも一致します。`,
          lv: 1
        },
        {
          t: '水中での明線の間隔（(3)）',
          m: [R`\Delta x = \frac{\lambda L}{d} = \frac{12}{4} = 3.0\,\mathrm{mm}`,
              R`\lambda' = \frac{\lambda}{n},\qquad \Delta x' = \frac{\lambda' L}{d} = \frac{\Delta x}{n} = \frac{3.0}{1.33} \approx 2.26\,\mathrm{mm}`],
          n: R`光が屈折率 $n$ の媒質に入ると、振動数は変わらずに速さが $\dfrac{1}{n}$ 倍になるので、波長も $\dfrac{1}{n}$ 倍になります。明線の間隔は波長に比例するので、水中では $\dfrac{1}{n}$ 倍にせまくなります。`,
          easy: R`水の中では光の進む速さがおそくなりますが、光の振動数（1 秒間に振動する回数）は変わりません。その結果、波と波の間隔（波長）が短くなります。波長が短いと、干渉じまの間隔もせまくなります。`,
          pro: R`$\Delta x=\dfrac{\lambda L}{d}$ より、間隔は $\lambda$・$L$ に比例し、$d$ に反比例する。水中では $\lambda\to\lambda/n$ なので $\Delta x\to\Delta x/n$。`,
          lv: 1
        }
      ],
      tags: ['ヤングの実験', '経路差', '干渉', '屈折率']
    },

    /* ---------- 静電気 ---------- */
    {
      id: 'p-basic-estat-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-estat',
      title: '2 つの点電荷の電場と電位',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`真空中で、$0.60\,\mathrm{m}$ はなれた 2 点 A, B に、どちらも電気量 $+4.0\times10^{-6}\,\mathrm{C}$ の点電荷を固定した。線分 AB の中点を M、M から AB に垂直に $0.40\,\mathrm{m}$ はなれた点を P とする。クーロンの法則の比例定数を $k=9.0\times10^{9}\,\mathrm{N\cdot m^{2}/C^{2}}$、無限遠での電位を $0$ とする。`,
      fig: figCharges(),
      parts: [
        { label: '(1)', q: R`点 P の電位は何 $\mathrm{V}$ か。`, type: 'num', answer: 1.44e5, rel: 0.02, unit: 'V', hint: '例: 1.4e5' },
        { label: '(2)', q: R`点 P の電場の強さは何 $\mathrm{N/C}$ か。`, type: 'num', answer: 2.304e5, rel: 0.02, unit: 'N/C', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        { label: '(3)', q: R`電気量 $+1.0\times10^{-6}\,\mathrm{C}$ の点電荷を、P から M まで静かに運ぶとき、外力がする仕事は何 $\mathrm{J}$ か。`, type: 'num', answer: 9.6e-2, rel: 0.02, unit: 'J', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' }
      ],
      solution: [
        {
          t: 'AP, BP の長さ',
          m: R`\mathrm{AP} = \mathrm{BP} = \sqrt{0.30^{2}+0.40^{2}} = 0.50\,\mathrm{m}`,
          n: R`三角形 AMP は、$\mathrm{AM}=0.30\,\mathrm{m}$、$\mathrm{MP}=0.40\,\mathrm{m}$ の直角三角形なので、三平方の定理（$3:4:5$）から $\mathrm{AP}=0.50\,\mathrm{m}$ です。B についても同様です。`,
          lv: 2
        },
        {
          t: 'P の電位（(1)）',
          m: [R`V = k\frac{Q}{r}`,
              R`V_{\mathrm{P}} = k\frac{Q}{\mathrm{AP}} + k\frac{Q}{\mathrm{BP}} = 2\times\frac{9.0\times10^{9}\times 4.0\times10^{-6}}{0.50} = 1.44\times10^{5}\,\mathrm{V}`],
          n: R`電位は向きのない量（スカラー）なので、各点電荷がつくる電位を単純に足し算します。`,
          easy: R`電位は、電気的な「高さ」のようなものです。$+$ の電荷の近くほど高く、無限遠を $0$ とします。2 つの電荷があるときは、それぞれがつくる高さを足し算します。`,
          lv: 1
        },
        {
          t: 'P の電場（(2)）',
          m: [R`E = k\frac{Q}{r^{2}}`,
              R`E_{\mathrm{A}} = E_{\mathrm{B}} = \frac{9.0\times10^{9}\times 4.0\times10^{-6}}{0.50^{2}} = 1.44\times10^{5}\,\mathrm{N/C}`,
              R`E_{\mathrm{P}} = 2E_{\mathrm{A}}\cos\theta = 2\times 1.44\times10^{5}\times\frac{0.40}{0.50} \approx 2.3\times10^{5}\,\mathrm{N/C}`],
          n: R`$+$ の電荷がつくる電場は、電荷から遠ざかる向きです。A, B からの電場の大きさは等しく、AB に平行な成分は打ち消し合い、MP に平行な成分（$E\cos\theta$、$\cos\theta=\dfrac{\mathrm{MP}}{\mathrm{AP}}=0.80$）だけが足し合わされます。`,
          easy: R`電場は向きをもつ量（ベクトル）なので、向きも考えて足します。A, B からの電場は、P から見て左右対称に斜めの向きにあり、横向きの成分は打ち消し合って、縦向き（MP に沿った向き）の成分だけが残ります。`,
          pro: R`電場はベクトル和（対称性で成分が消える）、電位はスカラー和。この使い分けは頻出。`,
          lv: 1
        },
        {
          t: '外力がする仕事（(3)）',
          m: [R`V_{\mathrm{M}} = 2\times\frac{9.0\times10^{9}\times 4.0\times10^{-6}}{0.30} = 2.4\times10^{5}\,\mathrm{V}`,
              R`W = q\,(V_{\mathrm{M}} - V_{\mathrm{P}}) = 1.0\times10^{-6}\times(2.4\times10^{5}-1.44\times10^{5}) = 9.6\times10^{-2}\,\mathrm{J}`],
          n: R`静かに運ぶ（運動エネルギーが変わらない）ので、外力のする仕事は、静電気力に逆らった分、つまり電気的な位置エネルギーの増加 $q\Delta V$ に等しくなります。M のほうが 2 つの電荷に近く電位が高いので、正の仕事が必要です。`,
          easy: R`$+$ の電荷を、$+$ の電荷が集まっている方へ近づけるのは、反発する力に逆らって押すことなので、仕事が必要です。電位が高い所へ運ぶのは、「坂をのぼる」のと同じで、外から仕事をしなければなりません。`,
          lv: 1
        }
      ],
      tags: ['電場', '電位', 'クーロンの法則', '点電荷']
    },

    /* ---------- オームの法則と合成抵抗 ---------- */
    {
      id: 'p-basic-circuit-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-circuit',
      title: '直列と並列の混合回路',
      source: { univ: 'オリジナル' },
      time: 6,
      body: R`起電力 $16\,\mathrm{V}$ で内部抵抗が無視できる電池に、抵抗 $R_{1}=5.0\,\Omega$、$R_{2}=4.0\,\Omega$、$R_{3}=12\,\Omega$ を図のようにつないだ。$R_{2}$ と $R_{3}$ は並列につながれ、その部分に $R_{1}$ が直列につながれている。`,
      fig: figCircuit(),
      parts: [
        { label: '(1)', q: R`回路全体の合成抵抗は何 $\Omega$ か。`, type: 'num', answer: 8, rel: 0.02, unit: 'Ω' },
        { label: '(2)', q: R`$R_{1}$ を流れる電流は何 $\mathrm{A}$ か。`, type: 'num', answer: 2, rel: 0.02, unit: 'A' },
        { label: '(3)', q: R`$R_{3}$ で消費される電力は何 $\mathrm{W}$ か。`, type: 'num', answer: 3, rel: 0.02, unit: 'W' }
      ],
      solution: [
        {
          t: '並列部分の合成抵抗',
          m: [R`\frac{1}{R_{23}} = \frac{1}{R_{2}} + \frac{1}{R_{3}} = \frac{1}{4.0} + \frac{1}{12} = \frac{3+1}{12} = \frac{1}{3.0}`,
              R`R_{23} = 3.0\,\Omega`],
          n: R`並列につながれた抵抗は、逆数の和が合成抵抗の逆数になります。$R_{2}$ と $R_{3}$ をまとめて、$3.0\,\Omega$ の 1 つの抵抗とみなせます。`,
          easy: R`並列は、電流の通り道が 2 本に分かれている状態です。通り道が増えると電流が流れやすくなるので、合成抵抗は、もとのどの抵抗よりも小さくなります（$4.0\,\Omega$ と $12\,\Omega$ から $3.0\,\Omega$ になりました）。`,
          lv: 1
        },
        {
          t: '回路全体の合成抵抗（(1)）',
          m: R`R = R_{1} + R_{23} = 5.0 + 3.0 = 8.0\,\Omega`,
          n: R`直列につながれた抵抗は、そのまま足し算します。`,
          lv: 1
        },
        {
          t: '$R_{1}$ を流れる電流（(2)）',
          m: R`I = \frac{E}{R} = \frac{16}{8.0} = 2.0\,\mathrm{A}`,
          n: R`$R_{1}$ には、電池から出た電流がすべて流れます（直列）。オームの法則 $V=RI$ から、全体の電流を求めます。`,
          easy: R`直列につながれた部分には、同じ大きさの電流が流れます。$R_{1}$ は、電池から出た電流が $R_{2}$, $R_{3}$ に分かれる前に必ず通る場所にあるので、$R_{1}$ を流れる電流は、電池から出る全体の電流と同じです。全体の電圧 $16\,\mathrm{V}$ を全体の抵抗 $8.0\,\Omega$ で割れば、その電流が求まります。`,
          lv: 1
        },
        {
          t: '$R_{3}$ で消費される電力（(3)）',
          m: [R`V_{23} = I\,R_{23} = 2.0\times 3.0 = 6.0\,\mathrm{V}`,
              R`I_{3} = \frac{V_{23}}{R_{3}} = \frac{6.0}{12} = 0.50\,\mathrm{A}`,
              R`P_{3} = I_{3}V_{23} = 0.50\times 6.0 = 3.0\,\mathrm{W}`],
          n: R`並列部分では、$R_{2}$ と $R_{3}$ にかかる電圧が同じ $V_{23}$ です。$R_{3}$ に流れる電流を求めてから、電力 $P=IV$ を計算します（$P=\dfrac{V^{2}}{R}=\dfrac{6.0^{2}}{12}$ でも同じです）。`,
          pro: R`並列部分の電流は抵抗の逆比に分かれる: $I_{2}:I_{3}=\dfrac{1}{4.0}:\dfrac{1}{12}=3:1$ より $I_{2}=1.5\,\mathrm{A}$、$I_{3}=0.50\,\mathrm{A}$。検算: 全体の電力 $EI=32\,\mathrm{W}$ は、各抵抗の電力の合計 $20+9+3=32\,\mathrm{W}$ に等しい。`,
          lv: 1
        }
      ],
      tags: ['合成抵抗', 'オームの法則', '電力', '直列と並列']
    },

    /* ---------- 電流と磁場 ---------- */
    {
      id: 'p-basic-mag-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-mag',
      title: '平行な 2 本の直線電流',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`真空中で、十分に長い 2 本の直線導線 A, B を $0.10\,\mathrm{m}$ の間隔で平行に張り、図のように、どちらにも紙面の裏から表へ向かう向きに電流を流した。電流の大きさは、A が $6.0\,\mathrm{A}$、B が $3.0\,\mathrm{A}$ である。真空の透磁率を $\mu_{0}=4\pi\times10^{-7}\,\mathrm{N/A^{2}}$ とし、直線電流 $I$ から距離 $r$ はなれた点の磁束密度の大きさは $B=\dfrac{\mu_{0}I}{2\pi r}$ で表されるものとする。`,
      fig: figWires(false),
      parts: [
        { label: '(1)', q: R`導線 A を流れる電流が、導線 B の位置につくる磁束密度の大きさは何 $\mathrm{T}$ か。`, type: 'num', answer: 1.2e-5, rel: 0.02, unit: 'T', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        { label: '(2)', q: R`導線 B の長さ $1.0\,\mathrm{m}$ の部分が、(1) の磁場から受ける力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 3.6e-5, rel: 0.02, unit: 'N', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        {
          label: '(3)', q: R`導線 A, B の間にはたらく力は、引力か斥力か。`,
          type: 'choice',
          choices: [R`引力（引き合う）`, R`斥力（しりぞけ合う）`],
          answer: 0,
          explain: R`A の電流がつくる磁場は、右ねじの法則から A のまわりを反時計回りに回り、B の位置では上向きです。上向きの磁場の中で、手前向きの電流が受ける力は、フレミングの左手の法則から左向き（A の向き）です。したがって引力です。同じ向きの電流どうしは引き合います。`
        }
      ],
      solution: [
        {
          t: '直線電流がつくる磁束密度（(1)）',
          m: R`B_{A} = \frac{\mu_{0}I_{A}}{2\pi r} = \frac{4\pi\times10^{-7}\times 6.0}{2\pi\times 0.10} = 1.2\times10^{-5}\,\mathrm{T}`,
          n: R`$\pi$ が約分されて、$B_{A}=\dfrac{2\times10^{-7}\times 6.0}{0.10}$ となります。$I_{A}$ は導線 A の電流、$r=0.10\,\mathrm{m}$ は A から B までの距離です。`,
          easy: R`電流のまわりには磁場ができます。**磁束密度** $B$ は、その磁場の強さを表す量（単位 $\mathrm{T}$）です。電流が大きいほど、また電流に近いほど強くなります。この問題では、A の電流が、$0.10\,\mathrm{m}$ はなれた B のところにつくる磁場の強さを求めます。`,
          lv: 1
        },
        {
          t: '磁場の中の電流が受ける力（(2)）',
          m: R`F = I_{B}\,B_{A}\,l = 3.0\times 1.2\times10^{-5}\times 1.0 = 3.6\times10^{-5}\,\mathrm{N}`,
          n: R`B の位置の磁場（A がつくる）は、B の電流の向きに垂直なので、$F=IBl$ が使えます。$I_{B}$ は B の電流、$l=1.0\,\mathrm{m}$ は注目する導線の長さです。`,
          pro: R`公式で一発: 単位長さあたり $\dfrac{F}{l}=\dfrac{\mu_{0}I_{A}I_{B}}{2\pi r}=\dfrac{2\times10^{-7}\times6.0\times3.0}{0.10}=3.6\times10^{-5}\,\mathrm{N/m}$。電流の積に比例し、距離に反比例する。`,
          lv: 1
        },
        {
          t: '力の向き（(3)）',
          n: R`**右ねじの法則**で、A の電流（手前向き）のまわりの磁場は反時計回りです。B は A の右側にあるので、B の位置の磁場は**上向き**です。**フレミングの左手の法則**（磁場: 上向き、電流: 手前向き）から、B が受ける力は**左向き**、つまり A に近づく向きで、引力です。`,
          easy: R`右ねじ（ふつうのネジ）を電流の向きに進めるとき、ネジを回す向きが磁場の向きです。電流が手前向きなら、磁場は反時計回りです。次に、左手の中指を電流、人さし指を磁場の向きにすると、親指が力の向きを指します（フレミングの左手の法則）。こうして調べると、同じ向きの電流どうしは引き合うことがわかります。A も、B がつくる磁場から力を受け、作用・反作用の法則で同じ大きさの力で B に向かって引かれます。`,
          pro: R`「同じ向きの電流は引き合い、逆向きの電流は反発する」と覚える。力の大きさは A, B どちらが受ける力も等しい。`,
          fig: figWires(true),
          lv: 1
        }
      ],
      tags: ['直線電流の磁場', '電流が受ける力', '平行電流']
    },

    /* ---------- 電磁誘導 ---------- */
    {
      id: 'p-basic-induction-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-induction',
      title: '磁場中を動く導体棒',
      source: { univ: 'オリジナル' },
      time: 8,
      body: R`図のように、水平面内に間隔 $0.40\,\mathrm{m}$ で平行な 2 本の導体レールを置き、左端を抵抗値 $2.0\,\Omega$ の抵抗でつなぐ。レールに垂直に導体棒 PQ をのせ、鉛直下向き（図で紙面の表から裏向き）の一様な磁場（磁束密度 $0.50\,\mathrm{T}$）をかける。導体棒を、レールに沿って右向きに一定の速さ $2.0\,\mathrm{m/s}$ ですべらせる。レールと導体棒の電気抵抗、および導体棒とレールの間の摩擦は無視できるものとする。`,
      fig: figRails(false),
      parts: [
        { label: '(1)', q: R`導体棒に生じる誘導起電力の大きさは何 $\mathrm{V}$ か。`, type: 'num', answer: 0.4, rel: 0.02, unit: 'V' },
        {
          label: '(2)', q: R`導体棒を流れる電流の向きは、P → Q と Q → P のどちらか。`,
          type: 'choice',
          choices: [R`P → Q`, R`Q → P`],
          answer: 1,
          explain: R`棒が右へ動くと回路の面積がふえ、紙面の表から裏向きの磁束が増加します。レンツの法則により、誘導電流はこの増加を打ち消す向き（紙面の裏から表向き）の磁場をつくる向き、つまり回路を反時計回りに流れます。棒の部分では下端 Q から上端 P へ向かって流れます。`
        },
        { label: '(3)', q: R`導体棒を一定の速さで動かし続けるために、導体棒に加える外力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 0.04, rel: 0.02, unit: 'N', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' }
      ],
      solution: [
        {
          t: '前提: 磁束と電磁誘導',
          m: R`\Phi = B\,S`,
          n: R`**磁束** $\Phi$ は、面（面積 $S$）を貫く磁力線の「本数」にあたる量で、磁束密度 $B$ が一様で面に垂直なとき $\Phi=BS$ です（単位は $\mathrm{Wb}$）。回路を貫く磁束が時間とともに変化すると、回路に起電力（**誘導起電力**）が生じます。これが電磁誘導です。`,
          easy: R`磁場（磁力線）の中に輪（回路）を置くと考えます。輪の中を通り抜ける磁力線の本数が磁束です。輪を大きくしたり、磁場を強くしたりすると、通り抜ける本数がふえます。この本数が変化している間だけ、輪に電圧が生じます。`,
          lv: 3
        },
        {
          t: '誘導起電力（(1)）',
          m: R`V = vBl = 2.0\times 0.50\times 0.40 = 0.40\,\mathrm{V}`,
          n: R`棒が時間 $\Delta t$ に $v\Delta t$ 進むと、回路の面積が $lv\Delta t$ ふえ、回路を貫く磁束が $\Delta\Phi=B\,l\,v\Delta t$ ふえます。ファラデーの電磁誘導の法則 $V=\left|\dfrac{\Delta\Phi}{\Delta t}\right|$ から、$V=vBl$ になります。`,
          easy: R`磁場の中で導体を動かすと、導体の中の自由電子が磁場から力を受けて棒の一方の端に集まり、棒の両端に電圧が生じます。これが**誘導起電力**で、動く棒が電池のはたらきをします。大きさは、「速さ $v$ × 磁束密度 $B$ × 棒の長さ $l$」です。`,
          lv: 1
        },
        {
          t: '電流の向き（(2)）',
          n: R`磁束（紙面の表から裏向き）は、棒が右に動いて回路の面積がふえるので**増加**します。**レンツの法則**により、誘導電流は、この増加を妨げる向き、すなわち紙面の裏から表向きの磁場をつくる向きに流れます。右ねじの法則から、電流は回路を**反時計回り**に流れるので、棒の中では Q から P へ向かいます。`,
          easy: R`誘導電流は、いつも「磁束の変化をじゃまする向き」に流れます（**レンツの法則**）。この問題では、裏向きの磁束がふえているので、ふえないようにするため、逆向き（表向き）の磁場をつくる電流が流れます。表向きの磁場は、反時計回りの電流がつくります（右ねじの法則）。図の矢印が電流の向きです。`,
          fig: figRails(true),
          lv: 1
        },
        {
          t: '必要な外力（(3)）',
          m: [R`I = \frac{V}{R} = \frac{0.40}{2.0} = 0.20\,\mathrm{A}`,
              R`F = IBl = 0.20\times 0.50\times 0.40 = 4.0\times10^{-2}\,\mathrm{N}`],
          n: R`電流が流れると、棒は磁場から力 $F=IBl$ を受けます。この力の向きは、運動をさまたげる向き（左向き）です（レンツの法則、またはフレミングの左手の法則）。棒を一定の速さで動かし続けるには、この力とつり合う右向きの外力が必要です。`,
          pro: R`エネルギーで確認: 外力の仕事率 $Fv=0.040\times2.0=0.080\,\mathrm{W}$ は、抵抗で発生するジュール熱 $I^{2}R=0.20^{2}\times2.0=0.080\,\mathrm{W}$ に等しい。`,
          lv: 1
        }
      ],
      tags: ['電磁誘導', 'レンツの法則', '誘導起電力', 'レール上の導体棒']
    },

    /* ---------- 交流 ---------- */
    {
      id: 'p-basic-ac-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-ac',
      title: '交流電圧のグラフと実効値',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`抵抗値 $50\,\Omega$ の抵抗に、交流電源をつないだ。図は、この交流電圧 $v$ を時刻 $t$ に対して表したものである。電圧の最大値は $141\,\mathrm{V}$、周期は $20\,\mathrm{ms}$（$1\,\mathrm{ms}=10^{-3}\,\mathrm{s}$）である。$\sqrt{2}=1.41$ とする。`,
      fig: figAC(),
      parts: [
        { label: '(1)', q: R`この交流の周波数は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 50, rel: 0.02, unit: 'Hz' },
        {
          label: '(2)', q: R`時刻 $t\,[\mathrm{s}]$ における電圧 $v\,[\mathrm{V}]$ を表す式はどれか。`,
          type: 'choice',
          choices: [R`$v=141\sin(50t)$`, R`$v=100\sin(100\pi t)$`, R`$v=141\sin(100\pi t)$`, R`$v=141\sin(50\pi t)$`],
          answer: 2,
          explain: R`グラフは $t=0$ で $0$ から増加する正弦波なので $v=V_{0}\sin\omega t$ の形で、$V_{0}=141\,\mathrm{V}$ です。角周波数は $\omega=2\pi f=2\pi\times50=100\pi\,\mathrm{rad/s}$ なので、$v=141\sin(100\pi t)$ です。$100$ は実効値で、最大値ではありません。`
        },
        { label: '(3)', q: R`抵抗で消費される電力の平均値は何 $\mathrm{W}$ か。`, type: 'num', answer: 200, rel: 0.02, unit: 'W' }
      ],
      solution: [
        {
          t: '周期から周波数を求める（(1)）',
          m: R`f = \frac{1}{T} = \frac{1}{20\times10^{-3}} = 50\,\mathrm{Hz}`,
          n: R`$20\,\mathrm{ms}=20\times10^{-3}\,\mathrm{s}=0.020\,\mathrm{s}$ です。周波数は 1 秒間にくり返す回数（周期の逆数）です。`,
          lv: 1
        },
        {
          t: '電圧の式（(2)）',
          m: [R`v = V_{0}\sin\omega t,\qquad \omega = 2\pi f = 2\pi\times 50 = 100\pi\,\mathrm{rad/s}`,
              R`v = 141\sin(100\pi t)\ \mathrm{[V]}`],
          n: R`$t=0$ で $v=0$ から増加するので $\sin$ の形、最大値 $V_{0}=141\,\mathrm{V}$ です。確認として、$t=T=0.020\,\mathrm{s}$ を代入すると、$100\pi\times0.020=2\pi$ となり、ちょうど 1 周期になります。`,
          easy: R`**角周波数** $\omega$ は、1 秒間に進む角度（単位 $\mathrm{rad/s}$）です。交流は 1 周期で角度が $2\pi\,\mathrm{rad}$ 進むと考えるので、$\omega=\dfrac{2\pi}{T}=2\pi f$ です。周波数 $f=50\,\mathrm{Hz}$ なら $\omega=100\pi$ です。$\sin$ の中に $f$ をそのまま入れたり、$\omega$ を $f$ と同じにしたりしないように注意します。`,
          lv: 1
        },
        {
          t: '実効値と平均電力（(3)）',
          m: [R`V_{e} = \frac{V_{0}}{\sqrt{2}} = \frac{141}{1.41} = 100\,\mathrm{V}`,
              R`\bar{P} = \frac{V_{e}^{2}}{R} = \frac{100^{2}}{50} = 200\,\mathrm{W}`],
          n: R`交流の電圧・電流の**実効値**は、最大値の $\dfrac{1}{\sqrt{2}}$ 倍です。実効値を使うと、直流の場合と同じ形の式 $P=\dfrac{V^{2}}{R}=IV$ で、平均の電力を計算できます。参考: 電流の実効値は $I_{e}=\dfrac{V_{e}}{R}=2.0\,\mathrm{A}$、電力は $V_{e}I_{e}=200\,\mathrm{W}$ です。`,
          easy: R`交流の電圧は、時々刻々変わります。そこで、「同じ抵抗で同じ平均の電力を消費する直流の電圧」を考え、それを交流の**実効値**と呼びます。家庭のコンセントの「$100\,\mathrm{V}$」は実効値です。最大値は、実効値の約 $1.41$ 倍の $141\,\mathrm{V}$ になります。`,
          pro: R`電力の計算には実効値を使う: $\bar{P}=I_{e}^{2}R=2.0^{2}\times50=200\,\mathrm{W}$。最大値で計算すると $2$ 倍になってしまうので注意（平均では $\sin^{2}$ の平均が $\tfrac{1}{2}$）。`,
          lv: 1
        }
      ],
      tags: ['交流', '実効値', '周波数', '平均電力']
    },

    /* ---------- 光の粒子性 ---------- */
    {
      id: 'p-basic-photon-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-photon',
      title: '光電効果と光子のエネルギー',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`金属板に波長 $3.0\times10^{-7}\,\mathrm{m}$ の紫外線を当てたところ、光電子が飛び出した。この金属の仕事関数は $3.3\times10^{-19}\,\mathrm{J}$ である。プランク定数を $h=6.6\times10^{-34}\,\mathrm{J\cdot s}$、光の速さを $c=3.0\times10^{8}\,\mathrm{m/s}$ とする。`,
      fig: figPhoto(),
      parts: [
        { label: '(1)', q: R`この紫外線の光子 1 個のエネルギーは何 $\mathrm{J}$ か。`, type: 'num', answer: 6.6e-19, rel: 0.02, unit: 'J', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        { label: '(2)', q: R`飛び出す光電子の運動エネルギーの最大値は何 $\mathrm{J}$ か。`, type: 'num', answer: 3.3e-19, rel: 0.02, unit: 'J', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        {
          label: '(3)', q: R`紫外線の波長を変えずに、光の強さ（光子の数）だけを 2 倍にした。飛び出す光電子の個数と、運動エネルギーの最大値は、それぞれどうなるか。`,
          type: 'choice',
          choices: [
            R`個数も、運動エネルギーの最大値も 2 倍になる`,
            R`個数は変わらず、運動エネルギーの最大値は 2 倍になる`,
            R`個数も、運動エネルギーの最大値も変わらない`,
            R`個数は 2 倍になり、運動エネルギーの最大値は変わらない`
          ],
          answer: 3,
          explain: R`光子 1 個が電子 1 個にエネルギーを与えるので、光子の数が 2 倍になれば、飛び出す光電子の数も 2 倍になります。一方、光電子の運動エネルギーの最大値 $K_{\max}=h\nu-W$ は、光子 1 個のエネルギー $h\nu$（波長で決まる）と仕事関数 $W$ で決まるので、光の強さを変えても変わりません。`
        }
      ],
      solution: [
        {
          t: '前提: 光電効果とは',
          n: R`金属に光を当てると、金属の表面から電子（**光電子**）が飛び出す現象を**光電効果**といいます。光を波と考えると、光を強くすれば、どんな色の光でも電子が飛び出しそうですが、実際には、ある**限界振動数**より振動数が小さい光では、どれだけ強くしても電子は飛び出しません。この事実は、光が**光子**というエネルギー $h\nu$ のかたまりの流れであると考えると説明できます。`,
          easy: R`たとえば、赤い光をいくら明るくしても電子が出ない金属に、弱い紫外線を当てると電子が出てくることがあります。光には「色（振動数）で決まる 1 粒のエネルギー」があり、電子はその 1 粒を受け取って飛び出す、と考えます。`,
          lv: 3
        },
        {
          t: '光子 1 個のエネルギー（(1)）',
          m: [R`E = h\nu = \frac{hc}{\lambda}`,
              R`E = \frac{6.6\times10^{-34}\times 3.0\times10^{8}}{3.0\times10^{-7}} = 6.6\times10^{-19}\,\mathrm{J}`],
          n: R`光は、**光子**というエネルギーのかたまりの流れとして、金属中の電子にはたらきます。光子 1 個のエネルギーは振動数 $\nu$ に比例し $E=h\nu$ です。$c=\nu\lambda$ より $\nu=\dfrac{c}{\lambda}$ なので、波長で表すと $E=\dfrac{hc}{\lambda}$ です。`,
          easy: R`光は、波としての性質のほかに、粒（光子）としての性質ももっています。光子 1 個がもつエネルギーは、光の色（振動数）で決まり、振動数が大きい（波長が短い）光ほど大きくなります。紫外線は波長が短いので、光子 1 個のエネルギーが大きい光です。`,
          lv: 1
        },
        {
          t: '光電子の運動エネルギーの最大値（(2)）',
          m: [R`K_{\max} = h\nu - W`,
              R`K_{\max} = 6.6\times10^{-19} - 3.3\times10^{-19} = 3.3\times10^{-19}\,\mathrm{J}`],
          n: R`電子は、光子 1 個のエネルギーを受け取り、そのうち**仕事関数** $W$（金属の外へ出るのに最低限必要なエネルギー）を使って金属から飛び出します。残りが運動エネルギーになり、金属の表面近くから出る電子が最大の $K_{\max}$ をもちます。`,
          easy: R`電子が金属から飛び出すには、金属に引きとめられる力に打ち勝つ必要があります。そのために必要な最小のエネルギーが $W$ です。光子から受け取った $6.6\times10^{-19}\,\mathrm{J}$ のうち $3.3\times10^{-19}\,\mathrm{J}$ を脱出に使い、残りの $3.3\times10^{-19}\,\mathrm{J}$ が、飛び出した電子の運動エネルギーです。`,
          pro: R`光電効果が起こる限界の振動数は $\nu_{0}=\dfrac{W}{h}=5.0\times10^{14}\,\mathrm{Hz}$（限界波長 $\dfrac{c}{\nu_{0}}=6.0\times10^{-7}\,\mathrm{m}$）。この波長より短い光でないと、光電子は出ない。阻止電圧は $V_{0}=\dfrac{K_{\max}}{e}\approx2.1\,\mathrm{V}$（$e=1.6\times10^{-19}\,\mathrm{C}$）。`,
          lv: 1
        },
        {
          t: '光の強さを変えたとき（(3)）',
          n: R`光の強さは、1 秒間に当たる光子の数で決まります。光子が 2 倍になると、エネルギーを受け取る電子も 2 倍になるので、**光電子の個数は 2 倍**です。一方、1 個の光子のエネルギー $h\nu$ は光の波長（振動数）だけで決まるので、**$K_{\max}$ は変わりません**。$K_{\max}$ を変えるには、光の振動数を変える必要があります。`,
          easy: R`光を強くすると、粒（光子）がたくさん当たるので、飛び出す電子の数はふえます。でも、1 個の電子が受け取るエネルギーは、ぶつかった 1 個の光子の分だけなので、1 個ずつの勢いは変わりません。電子の勢いを大きくしたいときは、光の強さではなく光の色（振動数）を変えます。`,
          pro: R`「強さは個数、振動数はエネルギー」と覚える。光電流（個数に比例）と阻止電圧（$K_{\max}$ で決まる）を混同しない。`,
          lv: 1
        }
      ],
      tags: ['光電効果', '光子', '仕事関数', 'プランク定数']
    },

    /* ---------- 原子構造 ---------- */
    {
      id: 'p-basic-atom-01',
      subject: 'physics',
      level: 'basic',
      unit: 'p-atom',
      title: '水素原子のエネルギー準位',
      source: { univ: 'オリジナル' },
      time: 7,
      body: R`水素原子のエネルギー準位は、量子数 $n=1,\,2,\,3,\,\cdots$ に対して $E_{n}=-\dfrac{13.6}{n^{2}}\,\mathrm{eV}$ で表される。図は $n=1,\,2,\,3,\,4$ の準位と、電子が原子から完全に離れた状態（$n=\infty$、$E=0$）を表したものである。プランク定数を $h=6.6\times10^{-34}\,\mathrm{J\cdot s}$、光の速さを $c=3.0\times10^{8}\,\mathrm{m/s}$、$1\,\mathrm{eV}=1.6\times10^{-19}\,\mathrm{J}$ とする。`,
      fig: figLevels(),
      parts: [
        { label: '(1)', q: R`図のア（$n=3$ から $n=2$ への移り変わり）で、水素原子が放出する光子のエネルギーは何 $\mathrm{eV}$ か。`, type: 'num', answer: 1.89, rel: 0.02, unit: 'eV' },
        { label: '(2)', q: R`(1) の光の波長は何 $\mathrm{m}$ か。`, type: 'num', answer: 6.55e-7, rel: 0.02, unit: 'm', hint: '例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力' },
        { label: '(3)', q: R`図のイのように、$n=2$ の状態の水素原子から電子を引き離す（電離する）のに必要な最小のエネルギーは何 $\mathrm{eV}$ か。`, type: 'num', answer: 3.4, rel: 0.02, unit: 'eV' }
      ],
      solution: [
        {
          t: 'エネルギー準位の値',
          m: R`E_{2} = -\frac{13.6}{2^{2}} = -3.40\,\mathrm{eV},\qquad E_{3} = -\frac{13.6}{3^{2}} \approx -1.51\,\mathrm{eV}`,
          n: R`水素原子の電子は、とびとびの値のエネルギー（エネルギー準位）しかとれません。電子が原子から離れた状態を $E=0$ とするので、原子に束縛されている状態のエネルギーは負で、$n$ が大きいほど $0$ に近くなります。`,
          easy: R`電子は、階段のように決まった高さ（エネルギー）の段にしか立てません。$n$ が大きい段ほど高い位置（原子核から遠い軌道）にあります。いちばん上の $0\,\mathrm{eV}$ は、電子が原子から離れてしまった状態です。`,
          lv: 1
        },
        {
          t: '放出される光子のエネルギー（(1)）',
          m: [R`h\nu = E_{3} - E_{2}`,
              R`h\nu = -1.51 - (-3.40) \approx 1.89\,\mathrm{eV}`],
          n: R`電子が高い準位から低い準位に移るとき、そのエネルギーの差が光子 1 個として放出されます（$h\nu=E_{\text{高}}-E_{\text{低}}$）。`,
          easy: R`高い段から低い段へ降りるとき、段の高さの差のぶんのエネルギーが、光（光子）として外に出ていきます。$n=3$ の段は $-1.51\,\mathrm{eV}$、$n=2$ の段は $-3.40\,\mathrm{eV}$ なので、差は $1.89\,\mathrm{eV}$ です。`,
          lv: 1
        },
        {
          t: 'その光の波長（(2)）',
          m: [R`E = \frac{hc}{\lambda} \;\Longrightarrow\; \lambda = \frac{hc}{E}`,
              R`\lambda = \frac{6.6\times10^{-34}\times 3.0\times10^{8}}{1.89\times 1.6\times10^{-19}} \approx 6.5\times10^{-7}\,\mathrm{m}`],
          n: R`エネルギーを $\mathrm{J}$ に直してから代入します（$1.89\,\mathrm{eV}=1.89\times1.6\times10^{-19}\approx3.02\times10^{-19}\,\mathrm{J}$）。波長は約 $650\,\mathrm{nm}$ で、赤色の可視光にあたります。`,
          pro: R`$\mathrm{eV}$ のまま計算する近道: $\lambda\,[\mathrm{nm}]\approx\dfrac{1240}{E\,[\mathrm{eV}]}$（$\dfrac{1240}{1.89}\approx656$）。`,
          lv: 1
        },
        {
          t: '電離に必要な最小のエネルギー（(3)）',
          m: R`E_{\infty} - E_{2} = 0 - (-3.40) = 3.40\,\mathrm{eV}`,
          n: R`$n=2$ の電子を原子から引き離すには、$E=0$ の状態まで持ち上げるエネルギーが必要です。基底状態（$n=1$）から電離させるなら $13.6\,\mathrm{eV}$（電離エネルギー）が必要で、$n=2$ の状態からならその $\dfrac{1}{4}$ です。`,
          pro: R`原子が光子を吸収して準位 $n$ から別の準位へ励起するには、光子のエネルギーが準位差とぴったり等しい必要がある（とびとび）。電離は、$E_{\infty}-E_{n}$ 以上なら任意のエネルギーの光子でよい。`,
          lv: 1
        }
      ],
      tags: ['水素原子', 'エネルギー準位', 'ボーアの模型', '電離']
    },

    /* @@PROB@@ */
  ]);
})();
