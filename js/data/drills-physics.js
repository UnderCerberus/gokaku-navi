/* GOKAKU NAVI — 物理 復習ドリル（level: 'drill'）
   物理の全 24 単元 × 各 3 問 = 72 問。上位単元で誤答した生徒が「1 つ前の範囲」に戻って解く一問一答の基礎確認です。
   すべて書き下ろしのオリジナル問題。solution の各ステップに易しい言い直し（easy）を付けています。 */
(function () {
  'use strict';
  const R = String.raw;

  /* ================================================================
   *  共通の描画部品
   * ================================================================ */

  // 四角い物体（左上 (x, y)・幅 w・高さ h）。label は中央に表示
  function box(d, x, y, w, h, label, o) {
    o = o || {};
    d.rect(x, y, w, h, { cls: o.cls || 'fg', fill: o.fill === undefined ? 'f1' : o.fill, rx: 2 });
    if (label) d.text(x + w / 2, y + h / 2 + 4, label, { size: o.size || 12, cls: o.tcls || 'fg' });
  }
  // 水平の寸法線（両端が矢印）。below=true で文字を線の下に置く
  function dimH(d, x1, x2, y, label, o) {
    o = o || {};
    const m = (x1 + x2) / 2, cls = o.cls || 'dim';
    d.arrow(m, y, x1, y, { cls: cls, w: 1 });
    d.arrow(m, y, x2, y, { cls: cls, w: 1 });
    if (label) d.text(m, y + (o.below ? 15 : -6), label, { cls: cls, size: o.size || 12 });
  }
  // 鉛直の寸法線（両端が矢印）。left=true で文字を線の左に置く
  function dimV(d, x, y1, y2, label, o) {
    o = o || {};
    const m = (y1 + y2) / 2, cls = o.cls || 'dim';
    d.arrow(x, m, x, y1, { cls: cls, w: 1 });
    d.arrow(x, m, x, y2, { cls: cls, w: 1 });
    if (label) d.text(x + (o.left ? -6 : 6), m + 4, label, { cls: cls, size: o.size || 12, anchor: o.left ? 'end' : 'start' });
  }
  // 斜面（左下が角 θ、右へ向かって高くなる）。物体の配置や力の矢印に使う単位ベクトルを返す
  function drawIncline(d, deg, x0, y0, len, noAngle) {
    const th = deg * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
    d.hatch(x0 - 10, y0, x0 + len * c + 30, y0);
    d.poly([[x0, y0], [x0 + len * c, y0], [x0 + len * c, y0 - len * s]], { cls: 'fg', fill: 'f0' });
    if (!noAngle) d.angle(x0, y0, 38, 0, deg, deg + '°', { cls: 'c3' });
    return { th: th, deg: deg, ux: c, uy: -s, nx: -s, ny: -c, x0: x0, y0: y0, len: len };
  }
  // 斜面上の位置 t（0=下端, 1=上端）に物体を置き、物体の中心座標を返す
  function putBlock(d, g, t, bw, bh, label) {
    const cx = g.x0 + g.len * g.ux * t, cy = g.y0 + g.len * g.uy * t;
    const mx = cx + g.nx * bh / 2, my = cy + g.ny * bh / 2;
    d.rect(mx - bw / 2, my - bh / 2, bw, bh, { cls: 'fg', fill: 'f1', rot: g.deg, ox: mx, oy: my, rx: 2 });
    if (label) d.text(mx, my + 4, label, { size: 12 });
    return { x: mx, y: my };
  }
  // 区分線形の v–t グラフ。pts: [[t, v], ...]。o.fill=true で面積を塗る
  function figVT(pts, o) {
    o = o || {};
    const segs = [];
    for (let i = 0; i + 1 < pts.length; i++) segs.push({ x1: pts[i][0], y1: pts[i][1], x2: pts[i + 1][0], y2: pts[i + 1][1], cls: 'c1' });
    const f = function (t) {
      for (let i = 0; i + 1 < pts.length; i++) {
        if (t >= pts[i][0] && t <= pts[i + 1][0]) {
          const r = (t - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
          return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r;
        }
      }
      return 0;
    };
    const g = { w: 340, h: 230, x: o.x, y: o.y, segs: segs, axis: o.axis || ['t [s]', 'v [m/s]'], points: o.points || [], vlines: o.vlines || [], hlines: o.hlines || [] };
    if (o.fill) g.fills = [{ f: f, from: pts[0][0], to: pts[pts.length - 1][0], cls: 'f1' }];
    return JK.plot.graph(g);
  }

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // ばねの比例（2.0 N で 3.0 cm、5.0 N で x cm）
  function figSpringRatio() {
    const d = JK.plot.draw(340, 200);
    const row = function (cy, ext, force, label) {
      const xn = 114;                                            // 自然長の端
      d.hatch(24, cy - 28, 24, cy + 28);
      d.line(xn, cy - 22, xn, cy + 22, { cls: 'dim', dash: true, w: 1 });
      d.spring(24, cy, xn + ext, cy, { n: 8, amp: 7 });
      box(d, xn + ext, cy - 14, 30, 28, null);
      d.arrow(xn + ext + 30, cy, xn + ext + 80, cy, { cls: 'c1', label: force });
      dimH(d, xn, xn + ext, cy + 36, label, { below: true });
    };
    row(40, 30, '2.0 N', '3.0 cm');
    row(135, 75, '5.0 N', 'x = ?');
    return d.svg();
  }

  // 電池 1 個 + 抵抗 1 個（Vtxt, Rtxt はラベル）
  function figOhm1(Vtxt, Rtxt) {
    const d = JK.plot.draw(340, 180);
    const xL = 80, xR = 250, yT = 40, yB = 140;
    d.battery(xL, 65, xL, 115);
    d.wire([[xL, 65], [xL, yT], [xR, yT], [xR, 65]]);
    d.resistor(xR, 65, xR, 115);
    d.wire([[xR, 115], [xR, yB], [xL, yB], [xL, 115]]);
    d.arrow(130, yT, 170, yT, { cls: 'c3', label: 'I' });
    d.text(xL - 14, 94, Vtxt, { anchor: 'end' });
    d.text(xR + 14, 94, Rtxt, { anchor: 'start' });
    return d.svg();
  }

  // 直列 2 抵抗
  function figSeries2(Vtxt, R1, R2) {
    const d = JK.plot.draw(360, 170);
    const xL = 60, xR = 320, yT = 40, yB = 135;
    d.battery(xL, 65, xL, 110);
    d.wire([[xL, 65], [xL, yT], [120, yT]]);
    d.resistor(120, yT, 200, yT);
    d.resistor(200, yT, 280, yT);
    d.wire([[280, yT], [xR, yT], [xR, yB], [xL, yB], [xL, 110]]);
    d.text(160, yT - 14, R1);
    d.text(240, yT - 14, R2);
    d.text(xL + 12, 92, Vtxt, { anchor: 'start' });
    d.arrow(200, yB, 160, yB, { cls: 'c3', label: 'I' });
    return d.svg();
  }

  // 並列 2 抵抗
  function figParallel2(Vtxt, R1, R2) {
    const d = JK.plot.draw(360, 190);
    const xL = 60, x1 = 160, x2 = 270, yT = 35, yB = 150;
    d.battery(xL, 62, xL, 122);
    d.wire([[xL, 62], [xL, yT], [x2, yT]]);
    d.wire([[xL, 122], [xL, yB], [x2, yB]]);
    [[x1, R1], [x2, R2]].forEach(function (b) {
      d.wire([[b[0], yT], [b[0], 62]]);
      d.resistor(b[0], 62, b[0], 122);
      d.wire([[b[0], 122], [b[0], yB]]);
      d.text(b[0] + 12, 96, b[1], { anchor: 'start' });
    });
    d.dot(x1, yT); d.dot(x1, yB);
    d.text(xL + 12, 96, Vtxt, { anchor: 'start' });
    return d.svg();
  }

  // 水平な床の上の物体に斜め上向きの力（30°）。成分を破線で表す
  function figForceSplit() {
    const d = JK.plot.draw(340, 200);
    const fy = 160;
    d.hatch(20, fy, 320, fy);
    box(d, 80, fy - 40, 70, 40, '物体');
    const ox = 150, oy = fy - 20, L = 120, th = 30 * Math.PI / 180;
    const tx = ox + L * Math.cos(th), ty = oy - L * Math.sin(th);
    d.arrow(ox, oy, tx, ty, { cls: 'c1', label: '10 N' });
    d.line(ox, oy, tx, oy, { cls: 'c3', dash: true });
    d.line(tx, oy, tx, ty, { cls: 'c3', dash: true });
    d.angle(ox, oy, 44, 0, 30, '30°', { cls: 'c3' });
    d.text((ox + tx) / 2, oy + 17, 'Fx', { cls: 'c3', italic: true });
    d.text(tx + 14, (oy + ty) / 2 + 4, 'Fy', { cls: 'c3', italic: true });
    return d.svg();
  }

  // 天井からばねでつるした物体（重力と弾性力）
  function figHangSpring() {
    const d = JK.plot.draw(340, 220);
    d.hatch(110, 14, 230, 14, { side: -1 });
    d.spring(170, 14, 170, 110, { n: 8, amp: 8 });
    box(d, 140, 110, 60, 46, '2.0 kg');
    d.arrow(170, 156, 170, 205, { cls: 'c2', label: 'mg' });
    d.arrow(196, 110, 196, 60, { cls: 'c1', label: 'kx' });
    d.text(230, 80, '弾性力', { cls: 'c1', anchor: 'start' });
    return d.svg();
  }

  // 斜面上の物体を斜面に平行な糸で支える
  function figInclineHold() {
    const d = JK.plot.draw(360, 230);
    const g = drawIncline(d, 30, 30, 200, 270);
    const p = putBlock(d, g, 0.5, 46, 28, null);
    d.text(70, 40, 'm = 4.0 kg（なめらかな斜面）', { anchor: 'start' });
    d.arrow(p.x, p.y, p.x, p.y + 60, { cls: 'c2', label: 'mg' });
    d.arrow(p.x, p.y, p.x + g.nx * 56, p.y + g.ny * 56, { cls: 'c1', label: 'N' });
    d.arrow(p.x, p.y, p.x + g.ux * 66, p.y + g.uy * 66, { cls: 'c3', label: 'T' });
    return d.svg();
  }

  // v–t グラフ: 初速度 2.0 m/s・加速度 3.0 m/s²（t = 0〜4.0 s）
  function figVT1(fill) {
    return figVT([[0, 2], [4, 14]], {
      x: [0, 5], y: [0, 16], fill: fill,
      points: [{ x: 0, y: 2, label: '2.0', cls: 'c3', pos: 'tr' }, { x: 4, y: 14, label: '14', cls: 'c3', pos: 'tl' }],
      vlines: [{ x: 4, dash: true, label: 't=4.0' }]
    });
  }

  // 減速する自動車
  function figBrakeCar() {
    const d = JK.plot.draw(340, 150);
    d.hatch(14, 100, 326, 100);
    d.rect(60, 62, 100, 28, { cls: 'fg', fill: 'f1', rx: 6 });
    d.rect(86, 46, 48, 18, { cls: 'fg', fill: 'f0', rx: 4 });
    d.circle(86, 94, 9, { cls: 'fg', fill: 'f0' });
    d.circle(138, 94, 9, { cls: 'fg', fill: 'f0' });
    d.arrow(166, 76, 236, 76, { cls: 'c1' });
    d.text(280, 80, 'v₀ = 20 m/s', { cls: 'c1' });
    d.arrow(120, 128, 70, 128, { cls: 'c3' });
    d.text(190, 132, 'a = −4.0 m/s²', { cls: 'c3', size: 12 });
    return d.svg();
  }

  // v–t グラフ: 0→10（2 s）→一定（6 s まで）→0（8 s）
  function figVT3(fill) {
    return figVT([[0, 0], [2, 10], [6, 10], [8, 0]], {
      x: [0, 9], y: [0, 12], fill: fill,
      points: [{ x: 2, y: 10, label: '(2, 10)', cls: 'c3', pos: 'tl' }, { x: 6, y: 10, label: '(6, 10)', cls: 'c3', pos: 'tr' }]
    });
  }

  // 自由落下（高さ 19.6 m）
  function figFreeFall() {
    const d = JK.plot.draw(340, 220);
    d.hatch(60, 200, 300, 200);
    d.circle(130, 34, 9, { cls: 'c1', fill: 'f1' });
    d.text(150, 38, '静かに放す', { anchor: 'start', cls: 'dim' });
    d.line(130, 46, 130, 196, { cls: 'dim', dash: true, w: 1 });
    dimV(d, 220, 34, 200, 'h = 19.6 m');
    d.arrow(96, 100, 96, 150, { cls: 'c2', label: 'g' });
    return d.svg();
  }

  // 鉛直投げ上げ（初速度 29.4 m/s）
  function figThrowUp() {
    const d = JK.plot.draw(340, 230);
    d.hatch(40, 205, 300, 205);
    d.circle(90, 196, 8, { cls: 'c1', fill: 'f1' });
    d.arrow(90, 182, 90, 118, { cls: 'c1' });
    d.text(106, 150, 'v₀ = 29.4 m/s', { anchor: 'start', cls: 'c1' });
    d.line(190, 40, 300, 40, { cls: 'dim', dash: true, w: 1 });
    d.circle(240, 40, 8, { cls: 'c3', fill: 'f3' });
    d.text(240, 20, '最高点（v = 0）', { cls: 'c3' });
    dimV(d, 285, 40, 205, 'H', { left: true });
    return d.svg();
  }

  // 水平投射（崖の高さ 78.4 m、初速度 15 m/s）
  function figHorizontal() {
    const d = JK.plot.draw(340, 240);
    d.hatch(14, 200, 326, 200);
    d.poly([[14, 52], [130, 52], [130, 200], [14, 200]], { cls: 'fg', fill: 'f0' });
    d.path('M130 52 Q 220 52 310 200', { cls: 'c1', dash: true, fill: null });
    d.circle(130, 52, 7, { cls: 'c1', fill: 'f1' });
    d.arrow(140, 36, 190, 36, { cls: 'c3' });
    d.text(196, 40, 'v₀ = 15 m/s', { anchor: 'start', cls: 'c3' });
    dimV(d, 36, 52, 200, '78.4 m');
    dimH(d, 130, 310, 224, 'x = ?');
    return d.svg();
  }

  // 棒に加える力のモーメント（上段: 棒に垂直、下段: 棒と 30° の向き）
  function figMoment() {
    const d = JK.plot.draw(340, 230);
    const xo = 40, xe = 200;
    const row = function (cy, oblique) {
      d.line(xo, cy, xe, cy, { cls: 'fg', w: 6 });
      d.circle(xo, cy, 5, { cls: 'c3', fill: 'f3' });
      d.text(xo, cy + 20, 'O', { cls: 'c3', italic: true });
      if (!oblique) {
        d.arrow(xe, cy, xe, cy - 55, { cls: 'c1', label: 'F = 15 N' });
      } else {
        const th = 30 * Math.PI / 180;
        d.line(xe, cy, xe + 70, cy, { cls: 'dim', dash: true, w: 1 });
        d.arrow(xe, cy, xe + 70 * Math.cos(th), cy - 70 * Math.sin(th), { cls: 'c1', label: 'F = 15 N' });
        d.angle(xe, cy, 36, 0, 30, '30°', { cls: 'c3' });
      }
      dimH(d, xo, xe, cy + 24, 'r = 0.40 m', { below: true });
    };
    row(70, false);
    row(170, true);
    return d.svg();
  }

  // てこ（支点 O から左 0.20 m に 30 N、右 0.50 m に W）
  function figLever() {
    const d = JK.plot.draw(340, 200);
    const y = 84, xo = 120, xl = xo - 50, xr = xo + 125;
    d.line(xl - 20, y, xr + 20, y, { cls: 'fg', w: 6 });
    d.poly([[xo, y + 4], [xo - 16, y + 42], [xo + 16, y + 42]], { cls: 'fg', fill: 'f0' });
    d.hatch(xo - 50, y + 42, xo + 50, y + 42);
    d.text(xo, y + 66, '支点 O', { cls: 'c3' });
    d.arrow(xl, y, xl, y + 56, { cls: 'c2', label: '30 N' });
    d.arrow(xr, y, xr, y + 56, { cls: 'c2', label: 'W' });
    dimH(d, xl, xo, y - 26, '0.20 m');
    dimH(d, xo, xr, y - 26, '0.50 m');
    return d.svg();
  }

  // 一様な棒（4.0 kg）を両端の糸でつるし、左端から 0.50 m の位置に 2.0 kg のおもり
  function figBarStrings() {
    const d = JK.plot.draw(340, 215);
    const y = 90, xa = 40, xb = 300;
    d.line(xa, y, xb, y, { cls: 'fg', w: 6 });
    d.arrow(xa, y, xa, y - 56, { cls: 'c1', label: 'TA' });
    d.arrow(xb, y, xb, y - 56, { cls: 'c1', label: 'TB' });
    d.text(xa, y + 18, 'A', { italic: true });
    d.text(xb, y + 18, 'B', { italic: true });
    d.arrow(xa + 130, y, xa + 130, y + 52, { cls: 'c2', label: '棒の重さ' });
    d.line(xa + 65, y, xa + 65, y + 22, { cls: 'fg', w: 1.2 });
    box(d, xa + 45, y + 22, 40, 26, '2.0 kg');
    dimH(d, xa, xa + 65, y + 74, '0.50 m', { below: true });
    dimH(d, xa, xb, y + 108, '2.0 m（棒 4.0 kg）', { below: true });
    return d.svg();
  }

  // なめらかな床の上の物体を水平に引く
  function figPullSmooth() {
    const d = JK.plot.draw(340, 170);
    d.hatch(20, 120, 320, 120);
    box(d, 100, 70, 80, 50, '3.0 kg');
    d.arrow(180, 95, 250, 95, { cls: 'c1', label: '12 N' });
    d.text(60, 150, 'なめらかな床', { cls: 'dim', anchor: 'start' });
    d.arrow(110, 44, 160, 44, { cls: 'c4', label: 'a' });
    return d.svg();
  }

  // あらい床の上の物体を水平に引く（力の図示）
  function figPullRough() {
    const d = JK.plot.draw(340, 220);
    d.hatch(20, 160, 320, 160);
    box(d, 110, 100, 80, 60, '5.0 kg', { tcls: 'dim' });
    const cx = 150, cy = 130;
    d.arrow(cx, cy, cx + 110, cy, { cls: 'c1', label: 'F = 30 N' });
    d.arrow(cx, cy, cx - 70, cy, { cls: 'c3', label: "f'" });
    d.arrow(cx, cy, cx, cy - 60, { cls: 'c4', label: 'N' });
    d.arrow(cx, cy, cx, cy + 56, { cls: 'c2', label: 'mg' });
    d.text(300, 190, "μ' = 0.20", { cls: 'dim' });
    return d.svg();
  }

  // 机の上の物体 A を、滑車を通した糸で B がつるす
  function figTablePulley() {
    const d = JK.plot.draw(360, 240);
    d.poly([[30, 100], [250, 100], [250, 225], [30, 225]], { cls: 'fg', fill: 'f0' });
    box(d, 100, 64, 64, 36, 'A 3.0 kg');
    d.circle(262, 90, 11, { cls: 'fg', fill: 'f0' });
    d.dot(262, 90, { cls: 'fg', r: 2 });
    d.line(164, 79, 262, 79, { cls: 'fg', w: 1.3 });
    d.line(273, 90, 273, 150, { cls: 'fg', w: 1.3 });
    box(d, 247, 150, 52, 36, 'B 2.0 kg');
    d.arrow(110, 44, 150, 44, { cls: 'c4', label: 'a' });
    d.arrow(320, 150, 320, 190, { cls: 'c4', label: 'a' });
    d.text(60, 140, 'なめらかな机', { cls: 'dim', anchor: 'start' });
    return d.svg();
  }

  // 壁に衝突するボール（上段: 衝突前、下段: 衝突後）
  function figWallBounce() {
    const d = JK.plot.draw(340, 200);
    const row = function (cy, bx, x1, x2, label, tag) {
      d.hatch(290, cy - 34, 290, cy + 34, { side: -1 });
      d.circle(bx, cy, 12, { cls: 'c1', fill: 'f1' });
      d.arrow(x1, cy, x2, cy, { cls: 'c3' });
      d.text((x1 + x2) / 2, cy - 18, label, { cls: 'c3' });
      d.text(14, cy + 4, tag, { anchor: 'start', cls: 'dim' });
    };
    row(55, 110, 126, 206, '8.0 m/s', '衝突前');
    row(145, 210, 194, 124, '6.0 m/s', '衝突後');
    d.text(170, 14, 'ボール m = 0.50 kg', { cls: 'dim' });
    return d.svg();
  }

  // 一体となる衝突（上段: 衝突前、下段: 衝突後）
  function figMergeCollision() {
    const d = JK.plot.draw(340, 190);
    d.text(14, 44, '衝突前', { anchor: 'start', cls: 'dim' });
    d.hatch(14, 90, 326, 90);
    box(d, 80, 50, 50, 40, 'A 2.0 kg');
    box(d, 210, 50, 50, 40, 'B 1.0 kg');
    d.arrow(80, 36, 130, 36, { cls: 'c3' });
    d.text(105, 24, '3.0 m/s', { cls: 'c3' });
    d.text(235, 36, '静止', { cls: 'dim' });
    d.text(14, 134, '衝突後', { anchor: 'start', cls: 'dim' });
    d.hatch(14, 180, 326, 180);
    box(d, 130, 140, 100, 40, 'A + B 3.0 kg');
    d.arrow(130, 126, 190, 126, { cls: 'c3', label: 'v' });
    return d.svg();
  }

  // 正面衝突（上段: 衝突前、下段: 衝突後）
  function figElasticCollision() {
    const d = JK.plot.draw(340, 190);
    d.text(14, 44, '衝突前', { anchor: 'start', cls: 'dim' });
    d.hatch(14, 90, 326, 90);
    box(d, 80, 58, 40, 32, 'A 1.0 kg', { size: 11 });
    box(d, 200, 50, 60, 40, 'B 3.0 kg');
    d.arrow(80, 44, 125, 44, { cls: 'c3' });
    d.text(110, 30, '4.0 m/s', { cls: 'c3' });
    d.text(230, 36, '静止', { cls: 'dim' });
    d.text(14, 134, '衝突後', { anchor: 'start', cls: 'dim' });
    d.hatch(14, 180, 326, 180);
    box(d, 80, 148, 40, 32, 'A', { size: 11 });
    box(d, 200, 140, 60, 40, 'B');
    d.arrow(80, 134, 120, 134, { cls: 'c3', label: "vA′" });
    d.arrow(230, 126, 270, 126, { cls: 'c3', label: "vB′" });
    d.text(310, 100, '→ 正', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 水平から 60° 上向きの力 20 N で床に沿って 3.0 m 引く
  function figWorkAngle() {
    const d = JK.plot.draw(340, 200);
    d.hatch(14, 140, 326, 140);
    box(d, 40, 100, 60, 40, '物体');
    d.rect(200, 100, 60, 40, { cls: 'dim', dash: true, rx: 2 });
    const ox = 100, oy = 120, L = 90, th = 60 * Math.PI / 180;
    d.arrow(ox, oy, ox + L * Math.cos(th), oy - L * Math.sin(th), { cls: 'c1', label: '20 N' });
    d.line(ox, oy, ox + 70, oy, { cls: 'dim', dash: true, w: 1 });
    d.angle(ox, oy, 34, 0, 60, '60°', { cls: 'c3' });
    dimH(d, 70, 230, 168, '移動距離 3.0 m', { below: true });
    return d.svg();
  }

  // 運動エネルギーの変化（6.0 m/s → 10 m/s）
  function figKineticWork() {
    const d = JK.plot.draw(340, 150);
    d.hatch(14, 112, 326, 112);
    box(d, 30, 76, 50, 36, '2.0 kg', { size: 11 });
    d.arrow(80, 94, 130, 94, { cls: 'c3' });
    d.text(105, 66, '6.0 m/s', { cls: 'c3' });
    d.arrow(140, 50, 190, 50, { cls: 'c4', label: '仕事 W' });
    box(d, 215, 76, 50, 36, '2.0 kg', { size: 11 });
    d.arrow(265, 94, 325, 94, { cls: 'c3' });
    d.text(295, 66, '10 m/s', { cls: 'c3' });
    return d.svg();
  }

  // なめらかな曲面（A: 高さ 5.0 m、B: 高さ 2.0 m、C: 最下点）
  function figCurveTrack() {
    const d = JK.plot.draw(340, 230);
    const base = 200, sc = 30;                                     // 30 px = 1.0 m
    // 曲面: M 50 50 Q 50 200 230 200 （2 次ベジェ）
    const bez = function (t) { return [50 + 180 * t * t, 50 + 300 * t - 150 * t * t]; };
    d.hatch(30, base, 300, base);
    d.path('M50 50 Q 50 200 230 200', { cls: 'fg', w: 2.2, fill: null });
    const tB = 1 - Math.sqrt(1 - (base - 2.0 * sc - 50) / 150);    // y = 140 となる t
    const pB = bez(tB);
    d.circle(50, 50, 7, { cls: 'c1', fill: 'f1' });
    d.text(70, 46, 'A', { italic: true, anchor: 'start' });
    d.circle(pB[0], pB[1], 6, { cls: 'c3', fill: 'f3' });
    d.text(pB[0] + 14, pB[1] - 6, 'B', { italic: true, anchor: 'start', cls: 'c3' });
    d.circle(230, 194, 6, { cls: 'c4', fill: 'f4' });
    d.text(230, 180, 'C', { italic: true, cls: 'c4' });
    dimV(d, 20, 50, base, '5.0 m', { left: false });
    d.line(50, 140, 120, 140, { cls: 'dim', dash: true, w: 1 });
    d.text(130, 144, '高さ 2.0 m', { anchor: 'start', cls: 'dim' });
    return d.svg();
  }

  // 等速円運動（半径 r、速度、周期などをラベルで表す）
  function figCircleMotion(rLabel, vLabel, extra) {
    const d = JK.plot.draw(340, 230);
    const cx = 170, cy = 120, r = 78, a = 40 * Math.PI / 180;
    d.circle(cx, cy, r, { cls: 'dim' });
    d.dot(cx, cy, { cls: 'fg', r: 2.5 });
    d.text(cx - 11, cy + 15, 'O', { italic: true });
    const px = cx + r * Math.cos(a), py = cy - r * Math.sin(a);
    d.line(cx, cy, px, py, { cls: 'dim', dash: true, w: 1 });
    d.text(cx + 30, cy - 34, rLabel, { cls: 'c3', anchor: 'start' });
    d.circle(px, py, 9, { cls: 'c1', fill: 'f1' });
    d.arrow(px, py, px - 52 * Math.sin(a), py - 52 * Math.cos(a), { cls: 'c3' });
    d.text(px - 60, py - 58, vLabel, { cls: 'c3' });
    if (extra) d.text(170, 224, extra, { cls: 'dim' });
    return d.svg();
  }
  // 等速円運動で向心力（中心向きの力）も描く
  function figCircleForce() {
    const d = JK.plot.draw(340, 230);
    const cx = 170, cy = 120, r = 78, a = 40 * Math.PI / 180;
    d.circle(cx, cy, r, { cls: 'dim' });
    d.dot(cx, cy, { cls: 'fg', r: 2.5 });
    d.text(cx - 11, cy + 15, 'O', { italic: true });
    const px = cx + r * Math.cos(a), py = cy - r * Math.sin(a);
    d.line(cx, cy, px, py, { cls: 'dim', dash: true, w: 1 });
    d.text(cx + 22, cy - 40, 'r = 0.50 m', { cls: 'dim', anchor: 'start' });
    d.circle(px, py, 9, { cls: 'c1', fill: 'f1' });
    d.arrow(px, py, px - 52 * Math.sin(a), py - 52 * Math.cos(a), { cls: 'c3' });
    d.text(px - 66, py - 62, 'v = 4.0 m/s', { cls: 'c3' });
    d.arrow(px, py, px - 46 * Math.cos(a), py + 46 * Math.sin(a), { cls: 'c2', label: 'F' });
    d.text(170, 224, '小球 m = 0.20 kg', { cls: 'dim' });
    return d.svg();
  }

  // 最下点を通る振り子（糸の張力と重力）
  function figPendulumBottom() {
    const d = JK.plot.draw(340, 250);
    const px = 170, py = 28, L = 150, by = py + L + 12;
    d.hatch(120, py, 220, py, { side: -1 });
    d.line(px, py, px, by - 12, { cls: 'fg', w: 1.4 });
    d.circle(px, by, 12, { cls: 'c1', fill: 'f1' });
    d.arrow(px + 14, by, px + 14, by - 62, { cls: 'c3', label: 'T' });
    d.arrow(px - 14, by, px - 14, by + 40, { cls: 'c2', label: 'mg' });
    d.arrow(px + 28, by + 6, px + 88, by + 6, { cls: 'c4' });
    d.text(px + 100, by + 26, 'v = 3.0 m/s', { cls: 'c4' });
    dimV(d, 110, py, by, 'L = 1.0 m', { left: true });
    d.text(px + 50, by - 6, '最下点', { cls: 'dim', size: 11, anchor: 'start' });
    return d.svg();
  }

  // 水平なばね振り子（なめらかな床）
  function figSpringMass() {
    const d = JK.plot.draw(340, 180);
    d.hatch(14, 124, 326, 124);
    d.hatch(40, 66, 40, 124);
    d.spring(40, 96, 150, 96, { n: 8, amp: 9 });
    box(d, 150, 70, 52, 54, '0.50 kg');
    d.text(95, 64, 'k = 50 N/m', { cls: 'dim' });
    d.line(176, 56, 176, 134, { cls: 'c3', dash: true, w: 1 });
    d.text(176, 152, 'つり合いの位置 O', { cls: 'c3' });
    d.arrow(176, 44, 250, 44, { cls: 'c1' });
    d.text(262, 48, 'x', { italic: true, cls: 'c1' });
    d.arrow(150, 30, 100, 30, { cls: 'dim' });
    d.arrow(202, 30, 252, 30, { cls: 'dim' });
    d.text(176, 22, '往復運動（単振動）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 単振動の x–t グラフ（x = 0.10 cos 5.0t）
  function figSHMGraph() {
    return JK.plot.graph({
      w: 340, h: 230, x: [0, 1.4], y: [-0.14, 0.14],
      curves: [{ f: function (t) { return 0.10 * Math.cos(5.0 * t); }, cls: 'c1' }],
      hlines: [{ y: 0.1, dash: true, label: 'A = 0.10 m', cls: 'c3' }, { y: -0.1, dash: true, cls: 'c3' }],
      axis: ['t [s]', 'x [m]']
    });
  }

  // 単振り子
  function figSimplePendulum() {
    const d = JK.plot.draw(340, 240);
    const px = 170, py = 26, L = 160, a = 20 * Math.PI / 180;
    const bx = px + L * Math.sin(a), by = py + L * Math.cos(a);
    d.hatch(110, py, 230, py, { side: -1 });
    d.line(px, py, px, py + L + 6, { cls: 'dim', dash: true, w: 1 });
    d.line(px, py, bx, by, { cls: 'fg', w: 1.5 });
    d.circle(bx, by, 11, { cls: 'c1', fill: 'f1' });
    d.angle(px, py, 56, -90, -70, 'θ', { cls: 'c3' });
    d.text(px + 62, py + 98, 'l = 0.98 m', { cls: 'c3', anchor: 'start' });
    d.text(px - 22, py + L + 22, 'θ は小さい', { cls: 'dim', size: 11, anchor: 'end' });
    return d.svg();
  }

  // 水をヒーターで加熱する
  function figBeakerHeat() {
    const d = JK.plot.draw(340, 200);
    d.poly([[110, 40], [110, 150], [230, 150], [230, 40]], { cls: 'fg', fill: null, close: false });
    d.poly([[111, 70], [111, 150], [229, 150], [229, 70]], { cls: 'c1', fill: 'f1', close: true, w: 0.6 });
    d.text(170, 108, '水 200 g', { cls: 'fg' });
    d.arrow(150, 190, 150, 156, { cls: 'c3', label: 'Q' });
    d.text(280, 74, '20 °C', { cls: 'c1' });
    d.arrow(262, 90, 262, 120, { cls: 'dim' });
    d.text(280, 138, '50 °C', { cls: 'c3' });
    d.text(60, 100, 'c = 4.2', { cls: 'dim', size: 11 });
    d.text(60, 114, 'J/(g·K)', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 水を混ぜる（A: 50 °C 100 g、B: 20 °C 200 g → 混合）
  function figMixWater() {
    const d = JK.plot.draw(340, 190);
    const cup = function (x, hgt, label, cls, fl) {
      d.poly([[x, 40], [x, 130], [x + 70, 130], [x + 70, 40]], { cls: 'fg', fill: null, close: false });
      d.poly([[x + 1, 130 - hgt], [x + 1, 130], [x + 69, 130], [x + 69, 130 - hgt]], { cls: cls, fill: fl, close: true, w: 0.6 });
      d.text(x + 35, 150, label[0], { cls: cls });
      d.text(x + 35, 166, label[1], { cls: 'dim', size: 11 });
    };
    cup(20, 40, ['A  50 °C', '水 100 g'], 'c3', 'f3');
    d.text(113, 95, '＋', { size: 18 });
    cup(130, 70, ['B  20 °C', '水 200 g'], 'c1', 'f1');
    d.arrow(215, 90, 250, 90, { cls: 'dim' });
    cup(260, 82, ['混合後', '？ °C'], 'c4', 'f4');
    return d.svg();
  }

  // 氷 0 °C → 水 0 °C → 水 20 °C の加熱曲線
  function figHeatingCurve() {
    return JK.plot.graph({
      w: 340, h: 230, x: [0, 24], y: [-3, 24],
      segs: [{ x1: 0, y1: 0, x2: 16.5, y2: 0, cls: 'c1' }, { x1: 16.5, y1: 0, x2: 20.7, y2: 20, cls: 'c3' }],
      points: [{ x: 16.5, y: 0, label: '氷が全部とける', cls: 'c1', pos: 'tl' }, { x: 20.7, y: 20, label: '20 °C', cls: 'c3', pos: 'bl' }],
      axis: ['Q [kJ]', 'T [°C]']
    });
  }

  // ボイルの法則の p–V グラフ（pV = 6.0 一定 / p: 10⁵ Pa、V: L）
  function figBoyle() {
    return JK.plot.graph({
      w: 340, h: 240, x: [0, 7], y: [0, 4],
      curves: [{ f: function (v) { return 6.0 / v; }, cls: 'c1', domain: [1.4, 7] }],
      points: [{ x: 6, y: 1, label: '(6.0 L, 1.0)', cls: 'c3', pos: 'tr' }, { x: 2, y: 3, label: '(2.0 L, ?)', cls: 'c2', pos: 'tr' }],
      vlines: [{ x: 2, dash: true }, { x: 6, dash: true }],
      axis: ['V [L]', 'p [10⁵ Pa]']
    });
  }

  // シャルルの法則の V–T グラフ（V = 0.010 T）
  function figCharles() {
    return JK.plot.graph({
      w: 340, h: 240, x: [0, 420], y: [0, 4.4],
      curves: [{ f: function (T) { return 0.010 * T; }, cls: 'c1' }],
      points: [{ x: 300, y: 3.0, label: '(300 K, 3.0 L)', cls: 'c3', pos: 'br' }, { x: 360, y: 3.6, label: '(360 K, ?)', cls: 'c2', pos: 'tl' }],
      vlines: [{ x: 300, dash: true }, { x: 360, dash: true }],
      axis: ['T [K]', 'V [L]']
    });
  }

  // ピストン付きシリンダー（状態 1 → 状態 2）
  function figPistonStates() {
    const d = JK.plot.draw(360, 220);
    const cyl = function (x, h, lab, cls) {
      d.poly([[x, 30], [x, 130], [x + 90, 130], [x + 90, 30]], { cls: 'fg', fill: null, close: false });
      d.rect(x + 2, 130 - h - 8, 86, 8, { cls: 'fg', fill: 'f0' });
      d.rect(x + 2, 130 - h, 86, h, { cls: cls, fill: cls === 'c3' ? 'f3' : 'f1', w: 0.5 });
      d.line(x + 45, 130 - h - 8, x + 45, 40, { cls: 'fg', w: 1.5 });
      d.text(x + 45, 150, lab[0], { cls: cls });
      d.text(x + 45, 166, lab[1], { cls: 'dim', size: 11 });
      d.text(x + 45, 182, lab[2], { cls: 'dim', size: 11 });
    };
    cyl(40, 66, ['状態 1', 'p₁ = 1.0×10⁵ Pa  V₁ = 4.0 L', 'T₁ = 300 K'], 'c1');
    cyl(210, 44, ['状態 2', 'p₂ = 2.0×10⁵ Pa  V₂ = ?', 'T₂ = 450 K'], 'c3');
    d.arrow(140, 90, 200, 90, { cls: 'dim' });
    return d.svg();
  }

  // 熱力学第一法則: 気体が熱 Q を吸収し、外部へ仕事 W をする
  function figFirstLaw() {
    const d = JK.plot.draw(340, 220);
    d.poly([[110, 60], [110, 160], [230, 160], [230, 60]], { cls: 'fg', fill: null, close: false });
    d.rect(112, 100, 116, 60, { cls: 'c1', fill: 'f1', w: 0.5 });
    d.rect(112, 92, 116, 8, { cls: 'fg', fill: 'f0' });
    d.line(170, 92, 170, 40, { cls: 'fg', w: 1.5 });
    d.text(170, 136, '気体', { cls: 'fg' });
    d.arrow(150, 205, 150, 168, { cls: 'c3', label: 'Q = 300 J' });
    d.arrow(250, 110, 250, 60, { cls: 'c4' });
    d.text(262, 56, '外部への仕事', { cls: 'c4', anchor: 'start', size: 11 });
    d.text(262, 72, 'W = 120 J', { cls: 'c4', anchor: 'start', size: 11 });
    d.text(60, 130, 'ΔU = ?', { cls: 'c2' });
    return d.svg();
  }

  // 定圧膨張の p–V グラフ（p = 1.0×10⁵ Pa、V: 2.0 → 5.0 ×10⁻³ m³）
  function figIsobaricPV() {
    return JK.plot.graph({
      w: 340, h: 240, x: [0, 7], y: [0, 2],
      fills: [{ f: function () { return 1.0; }, from: 2, to: 5, cls: 'f1' }],
      segs: [{ x1: 2, y1: 1.0, x2: 5, y2: 1.0, cls: 'c1', arrow: true }],
      points: [{ x: 2, y: 1.0, label: 'A', cls: 'c3', pos: 'tl' }, { x: 5, y: 1.0, label: 'B', cls: 'c3', pos: 'tr' }],
      vlines: [{ x: 2, dash: true, label: '2.0' }, { x: 5, dash: true, label: '5.0' }],
      axis: ['V [10⁻³ m³]', 'p [10⁵ Pa]']
    });
  }

  // 定積変化 A→B と定圧変化 A→C の p–V グラフ
  function figIsoPV() {
    return JK.plot.graph({
      w: 340, h: 240, x: [0, 1.6], y: [0, 1.6],
      segs: [
        { x1: 1, y1: 1, x2: 1, y2: 1.167, cls: 'c1', arrow: true },
        { x1: 1, y1: 1, x2: 1.167, y2: 1, cls: 'c3', arrow: true }
      ],
      points: [
        { x: 1, y: 1, label: 'A (300 K)', cls: 'fg', pos: 'bl' },
        { x: 1, y: 1.167, label: 'B (350 K)', cls: 'c1', pos: 'tl' },
        { x: 1.167, y: 1, label: 'C (350 K)', cls: 'c3', pos: 'br' }
      ],
      axis: ['V', 'p'], ticks: false
    });
  }

  // 正弦波の y–x グラフ（振幅 0.20 m・波長 2.0 m）。隣り合う山の座標を示す
  function figWaveYX() {
    return JK.plot.graph({
      w: 340, h: 230, x: [0, 4.5], y: [-0.3, 0.3],
      curves: [{ f: function (x) { return 0.20 * Math.sin(Math.PI * x); }, cls: 'c1' }],
      segs: [{ x1: 0.5, y1: 0.2, x2: 0.5, y2: 0, cls: 'dim', dash: true }, { x1: 2.5, y1: 0.2, x2: 2.5, y2: 0, cls: 'dim', dash: true }],
      points: [{ x: 0.5, y: 0.2, label: '(0.5, 0.20)', cls: 'c3', pos: 'tr' }, { x: 2.5, y: 0.2, label: '(2.5, 0.20)', cls: 'c3', pos: 'tr' }],
      axis: ['x [m]', 'y [m]']
    });
  }

  // 波形の移動（実線: t = 0、破線: t = 0.50 s。振幅 0.50 m・波長 4.0 m。右向きに 1.0 m 進む）
  function figWaveShift() {
    return JK.plot.graph({
      w: 340, h: 230, x: [0, 10], y: [-0.8, 0.8],
      curves: [
        { f: function (x) { return 0.50 * Math.sin(Math.PI * x / 2); }, cls: 'c1' },
        { f: function (x) { return 0.50 * Math.sin(Math.PI * (x - 1) / 2); }, cls: 'c2', dash: true }
      ],
      segs: [{ x1: 1, y1: 0.5, x2: 1, y2: 0, cls: 'c1', dash: true }, { x1: 2, y1: 0.5, x2: 2, y2: 0, cls: 'c2', dash: true }],
      points: [{ x: 1, y: 0.5, cls: 'c1' }, { x: 2, y: 0.5, cls: 'c2' }],
      labels: [{ x: 6.6, y: 0.74, text: '実線: t = 0', cls: 'c1' }, { x: 6.6, y: 0.6, text: '破線: t = 0.50 s', cls: 'c2' }],
      axis: ['x [m]', 'y [m]']
    });
  }

  // 弦の定常波（両端固定・長さ 1.2 m・腹が 3 個）
  function figStandingWave() {
    const d = JK.plot.draw(340, 200);
    const xa = 50, xb = 290, cy = 88, A = 40, L = xb - xa;
    d.hatch(xa, cy - 56, xa, cy + 56);
    d.hatch(xb, cy - 56, xb, cy + 56, { side: -1 });
    d.line(xa, cy, xb, cy, { cls: 'dim', dash: true, w: 1 });
    let up = '', dn = '';
    for (let i = 0; i <= 60; i++) {
      const t = i / 60, x = xa + L * t, s = Math.sin(3 * Math.PI * t) * A;
      up += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + (cy - s).toFixed(1);
      dn += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + (cy + s).toFixed(1);
    }
    d.path(up, { cls: 'c1', w: 2, fill: null });
    d.path(dn, { cls: 'c1', w: 2, fill: null });
    [1, 2].forEach(function (k) {
      d.dot(xa + L * k / 3, cy, { cls: 'c3', r: 3 });
      d.text(xa + L * k / 3, cy + 31, '節', { cls: 'c3' });
    });
    [1, 3, 5].forEach(function (k) { d.text(xa + L * k / 6, cy - A - 8, '腹', { cls: 'c4' }); });
    dimH(d, xa, xb, cy + 70, 'L = 1.2 m', { below: true });
    return d.svg();
  }

  // 近づく救急車（音源 S）と静止した観測者 O。前方の波面は間隔がせまく、後方はひろい
  function figDopplerSource() {
    const d = JK.plot.draw(340, 170);
    const sx = 100, sy = 90;
    [24, 36, 48].forEach(function (r) { d.arc(sx, sy, r, -42, 42, { cls: 'c1', w: 1.5 }); });
    [24, 46, 68].forEach(function (r) { d.arc(sx, sy, r, 138, 222, { cls: 'c2', w: 1.5 }); });
    d.circle(sx, sy, 10, { cls: 'c3', fill: 'f3' });
    d.text(sx, sy + 4, 'S', { cls: 'c3', italic: true });
    d.text(14, 18, '救急車（サイレン 720 Hz）', { anchor: 'start', cls: 'dim' });
    d.arrow(sx - 22, 40, sx + 30, 40, { cls: 'c3' });
    d.text(sx + 38, 44, '20 m/s', { anchor: 'start', cls: 'c3' });
    d.circle(290, 70, 8, { cls: 'c4', fill: 'f4' });
    d.line(290, 78, 290, 108, { cls: 'c4', w: 2 });
    d.line(274, 90, 306, 90, { cls: 'c4', w: 2 });
    d.line(290, 108, 280, 130, { cls: 'c4', w: 2 });
    d.line(290, 108, 300, 130, { cls: 'c4', w: 2 });
    d.text(290, 152, '観測者（静止）', { cls: 'c4' });
    d.text(172, 152, '前方: 波長が短い', { cls: 'c1' });
    d.text(62, 152, '後方: 波長が長い', { cls: 'c2' });
    return d.svg();
  }

  // 音源 S が観測者 O を追いかける（どちらも右向きに運動）
  function figDopplerBoth() {
    const d = JK.plot.draw(340, 170);
    d.arrow(60, 40, 280, 40, { cls: 'dim', w: 1.5 });
    d.text(170, 28, '音の進む向き（正の向き）', { cls: 'dim' });
    d.line(14, 112, 326, 112, { cls: 'dim', w: 1 });
    d.circle(80, 100, 12, { cls: 'c3', fill: 'f3' });
    d.text(80, 104, 'S', { cls: 'c3', italic: true });
    d.arrow(96, 100, 150, 100, { cls: 'c3' });
    d.text(123, 88, '30 m/s', { cls: 'c3' });
    d.text(80, 138, 'f₀ = 620 Hz', { cls: 'c3' });
    d.circle(220, 100, 12, { cls: 'c4', fill: 'f4' });
    d.text(220, 104, 'O', { cls: 'c4', italic: true });
    d.arrow(236, 100, 276, 100, { cls: 'c4' });
    d.text(256, 88, '10 m/s', { cls: 'c4' });
    d.text(220, 138, '観測者', { cls: 'c4' });
    return d.svg();
  }

  // ヤングの実験（複スリット S₁, S₂ とスクリーン上の点 P）
  function figYoung() {
    const d = JK.plot.draw(340, 220);
    const px = 80, sx = 280, y1 = 98, y2 = 128, yo = 113, yp = 58;
    d.line(px, 24, px, y1 - 3, { cls: 'fg', w: 3 });
    d.line(px, y1 + 3, px, y2 - 3, { cls: 'fg', w: 3 });
    d.line(px, y2 + 3, px, 182, { cls: 'fg', w: 3 });
    d.hatch(sx, 24, sx, 182, { side: -1 });
    d.line(px, yo, sx, yo, { cls: 'dim', dash: true, w: 1 });
    d.line(px, y1, sx, yp, { cls: 'c1', w: 1.4 });
    d.line(px, y2, sx, yp, { cls: 'c2', w: 1.4 });
    d.dot(sx, yp, { cls: 'c3' });
    d.dot(sx, yo, { cls: 'fg', r: 2.5 });
    d.text(px + 6, y1 - 9, 'S₁', { anchor: 'start', italic: true });
    d.text(px + 6, y2 + 17, 'S₂', { anchor: 'start', italic: true });
    d.text(sx - 8, yp + 4, 'P', { anchor: 'end', cls: 'c3', italic: true });
    d.text(sx - 8, yo + 15, 'O', { anchor: 'end', italic: true });
    d.arrow(10, yo, 44, yo, { cls: 'c3' });
    d.text(14, yo - 10, '単色光', { anchor: 'start', cls: 'c3' });
    d.text(14, 18, '波長 λ = 600 nm', { anchor: 'start', cls: 'c3' });
    dimV(d, px - 16, y1, y2, 'd', { left: true });
    dimV(d, sx + 20, yp, yo, 'x');
    d.line(px, 182, px, 200, { cls: 'dim', dash: true, w: 1 });
    d.line(sx, 182, sx, 200, { cls: 'dim', dash: true, w: 1 });
    dimH(d, px, sx, 196, 'L = 2.0 m');
    d.text(14, 214, 'スリットの間隔 d = 0.20 mm', { anchor: 'start', cls: 'dim' });
    return d.svg();
  }

  // 空気中の薄膜に光を当てる（① 表面で反射する光、② 裏面で反射する光）
  function figThinFilm() {
    const d = JK.plot.draw(340, 210);
    const yt = 110, yb = 160;
    d.rect(40, yt, 260, yb - yt, { cls: 'fg', fill: 'f1' });
    d.arrow(96, 34, 140, yt, { cls: 'c3' });
    d.arrow(140, yt, 184, 34, { cls: 'c1' });
    d.line(140, yt, 160, yb, { cls: 'c3', w: 1.4 });
    d.line(160, yb, 180, yt, { cls: 'c3', w: 1.4 });
    d.arrow(180, yt, 224, 34, { cls: 'c2' });
    d.text(14, 14, '入射光 λ = 520 nm（空気中）', { anchor: 'start', cls: 'c3' });
    d.text(180, 26, '① 表面で反射', { anchor: 'end', size: 11, cls: 'c1' });
    d.text(228, 26, '② 裏面で反射', { anchor: 'start', size: 11, cls: 'c2' });
    d.text(14, 98, '空気（n = 1.00）', { anchor: 'start', cls: 'dim' });
    d.text(14, 182, '空気（n = 1.00）', { anchor: 'start', cls: 'dim' });
    d.text(240, 140, '薄膜  n = 1.30', { cls: 'fg' });
    dimV(d, 318, yt, yb, 't');
    d.text(170, 202, '（光線は見やすいよう斜めに描いてある）', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // 一様な電場（右向き）と、電場に平行な直線上の 2 点 A, B
  function figUniformField() {
    const d = JK.plot.draw(340, 180);
    [28, 58, 88, 118].forEach(function (y) { d.arrow(24, y, 316, y, { cls: 'c1', w: 1.4 }); });
    d.text(316, 14, 'E = 2.0 × 10³ V/m', { anchor: 'end', cls: 'c1' });
    d.dot(80, 88, { cls: 'c3', r: 4 });
    d.dot(260, 88, { cls: 'c3', r: 4 });
    d.text(80, 80, 'A', { cls: 'c3', italic: true });
    d.text(260, 80, 'B', { cls: 'c3', italic: true });
    d.line(80, 94, 80, 150, { cls: 'dim', dash: true, w: 1 });
    d.line(260, 94, 260, 150, { cls: 'dim', dash: true, w: 1 });
    dimH(d, 80, 260, 150, '0.15 m', { below: true });
    return d.svg();
  }

  // 直並列回路: 電池に R₁ を直列に、R₂ と R₃ を並列につなぐ
  function figSeriesParallel(Vtxt, R1, R2, R3) {
    const d = JK.plot.draw(380, 190);
    const xL = 80, x2 = 220, x3 = 300, yT = 35, yB = 155;
    d.battery(xL, 62, xL, 122);
    d.wire([[xL, 62], [xL, yT], [110, yT]]);
    d.resistor(110, yT, 190, yT);
    d.wire([[190, yT], [x3, yT]]);
    d.wire([[xL, 122], [xL, yB], [x3, yB]]);
    [x2, x3].forEach(function (x) {
      d.wire([[x, yT], [x, 62]]);
      d.resistor(x, 62, x, 122);
      d.wire([[x, 122], [x, yB]]);
    });
    d.dot(x2, yT); d.dot(x2, yB);
    d.text(150, yT - 14, R1);
    d.text(x2 - 12, 96, R2, { anchor: 'end' });
    d.text(x3 + 12, 96, R3, { anchor: 'start' });
    d.text(xL - 12, 96, Vtxt, { anchor: 'end' });
    d.arrow(190, yB, 150, yB, { cls: 'c3', label: 'I' });
    return d.svg();
  }

  // 内部抵抗 r をもつ電池（点線の枠）に、外部の抵抗 R をつないだ回路
  function figInternalR() {
    const d = JK.plot.draw(380, 200);
    const xL = 110, xR = 290, yT = 36, yB = 160;
    d.rect(xL - 32, 44, 64, 108, { cls: 'dim', dash: true, rx: 6 });
    d.wire([[xL, 66], [xL, yT], [xR, yT], [xR, 70]]);
    d.battery(xL, 66, xL, 100);
    d.wire([[xL, 100], [xL, 108]]);
    d.resistor(xL, 108, xL, 144);
    d.wire([[xL, 144], [xL, yB], [xR, yB], [xR, 130]]);
    d.resistor(xR, 70, xR, 130);
    d.text(xL - 40, 88, 'E = 6.0 V', { anchor: 'end' });
    d.text(xL + 40, 130, 'r = 0.50 Ω', { anchor: 'start', cls: 'c3' });
    d.text(xR + 12, 104, 'R = 2.5 Ω', { anchor: 'start' });
    d.arrow(180, yT, 220, yT, { cls: 'c3', label: 'I' });
    d.text(xL, 182, '電池（内部抵抗 r をふくむ）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 紙面に垂直な直線電流（紙面の裏から表へ）と、導線から 0.10 m はなれた点 P
  function figWireField() {
    const d = JK.plot.draw(340, 210);
    const cx = 120, cy = 112, r = 80;
    d.circle(cx, cy, r, { cls: 'dim', dash: true, w: 1.2 });
    d.circle(cx, cy, 10, { cls: 'fg', fill: 'f0' });
    d.dot(cx, cy, { cls: 'fg', r: 3 });
    d.text(cx, cy + 30, '導線', { cls: 'fg' });
    d.dot(cx + r, cy, { cls: 'c3', r: 4 });
    d.text(cx + r + 10, cy + 4, 'P', { anchor: 'start', cls: 'c3', italic: true });
    d.line(cx, cy - 12, cx, cy - 26, { cls: 'dim', dash: true, w: 1 });
    d.line(cx + r, cy - 8, cx + r, cy - 26, { cls: 'dim', dash: true, w: 1 });
    dimH(d, cx, cx + r, cy - 22, 'r = 0.10 m');
    d.text(14, 16, '電流 I = 5.0 A（紙面の裏から表へ向かう）', { anchor: 'start', cls: 'c3' });
    return d.svg();
  }

  // 磁場（紙面の表から裏へ）の中の直線導線に、右向きの電流
  function figForceOnWire() {
    const d = JK.plot.draw(340, 190);
    [50, 110, 170, 230, 290].forEach(function (x) {
      [38, 60, 140, 162].forEach(function (y) { d.text(x, y + 5, '×', { cls: 'c4', size: 16 }); });
    });
    d.text(14, 16, 'B = 0.20 T（紙面の表から裏へ向かう）', { anchor: 'start', cls: 'c4' });
    d.line(60, 100, 280, 100, { cls: 'fg', w: 3 });
    d.arrow(110, 100, 200, 100, { cls: 'c3', w: 2 });
    d.text(155, 122, 'I = 3.0 A', { cls: 'c3' });
    d.line(60, 96, 60, 78, { cls: 'dim', dash: true, w: 1 });
    d.line(280, 96, 280, 78, { cls: 'dim', dash: true, w: 1 });
    dimH(d, 60, 280, 84, 'ℓ = 0.50 m');
    return d.svg();
  }

  // コイルを貫く磁束 Φ の時間変化（Φ–t グラフ）
  function figPhiT() {
    return JK.plot.graph({
      w: 340, h: 230, x: [0, 0.6], y: [0, 0.06],
      segs: [{ x1: 0, y1: 0.010, x2: 0.20, y2: 0.050, cls: 'c1' }, { x1: 0.20, y1: 0.050, x2: 0.50, y2: 0.020, cls: 'c1' }],
      points: [
        { x: 0, y: 0.010, label: '0.010', cls: 'c3', pos: 'tr' },
        { x: 0.20, y: 0.050, label: '(0.20, 0.050)', cls: 'c3', pos: 'tr' },
        { x: 0.50, y: 0.020, label: '(0.50, 0.020)', cls: 'c3', pos: 'bl' }
      ],
      vlines: [{ x: 0.20, dash: true }, { x: 0.50, dash: true }],
      axis: ['t [s]', 'Φ [Wb]']
    });
  }

  // 平行レール上を動く導体棒（真上から見た図）。磁場は紙面の表から裏へ
  function figRailRod() {
    const d = JK.plot.draw(380, 200);
    const xA = 90, xB = 270, y1 = 50, y2 = 150, xr = 150;
    d.line(xA, y1, xB, y1, { cls: 'fg', w: 2.5 });
    d.line(xA, y2, xB, y2, { cls: 'fg', w: 2.5 });
    d.resistor(xA, y1, xA, y2);
    d.text(xA - 14, 104, 'R = 0.60 Ω', { anchor: 'end' });
    d.line(xr, y1 - 6, xr, y2 + 6, { cls: 'c3', w: 4 });
    d.arrow(xr + 12, 100, xr + 64, 100, { cls: 'c3' });
    d.text(xr + 40, 90, 'v = 3.0 m/s', { cls: 'c3' });
    [115, 200, 245].forEach(function (x) {
      [66, 134].forEach(function (y) { d.text(x, y + 5, '×', { cls: 'c4', size: 16 }); });
    });
    d.text(14, 16, 'B = 0.50 T（紙面の表から裏へ向かう）', { anchor: 'start', cls: 'c4' });
    d.line(xB, y1, 300, y1, { cls: 'dim', dash: true, w: 1 });
    d.line(xB, y2, 300, y2, { cls: 'dim', dash: true, w: 1 });
    dimV(d, 296, y1, y2, 'ℓ = 0.20 m');
    return d.svg();
  }

  // N 極を下にした棒磁石を、真上からコイルに近づける
  function figLenz() {
    const d = JK.plot.draw(340, 230);
    const ell = function (cx, cy, rx, ry) {
      return 'M' + (cx - rx) + ' ' + cy + ' A' + rx + ' ' + ry + ' 0 1 0 ' + (cx + rx) + ' ' + cy +
        ' A' + rx + ' ' + ry + ' 0 1 0 ' + (cx - rx) + ' ' + cy;
    };
    d.rect(150, 18, 40, 44, { cls: 'c1', fill: 'f1' });
    d.text(170, 46, 'S', { cls: 'c1', size: 16, bold: true });
    d.rect(150, 62, 40, 44, { cls: 'c3', fill: 'f3' });
    d.text(170, 90, 'N', { cls: 'c3', size: 16, bold: true });
    d.arrow(228, 36, 228, 96, { cls: 'c3' });
    d.text(240, 70, '磁石を近づける', { anchor: 'start', cls: 'c3' });
    [168, 180, 192].forEach(function (cy) { d.path(ell(170, cy, 62, 14), { cls: 'fg', w: 1.8, fill: null }); });
    d.text(250, 190, 'コイル', { anchor: 'start', cls: 'fg' });
    d.text(14, 225, '（コイルを真上から見たときの向きで答える）', { anchor: 'start', cls: 'dim', size: 11 });
    return d.svg();
  }

  // 交流電圧の v–t グラフ（最大値 100√2 ≒ 141 V、周期 0.020 s）
  function figACGraph() {
    const V0 = 100 * Math.SQRT2;
    return JK.plot.graph({
      w: 340, h: 230, x: [0, 0.055], y: [-170, 170],
      curves: [{ f: function (t) { return V0 * Math.sin(2 * Math.PI * t / 0.020); }, cls: 'c1' }],
      hlines: [{ y: V0, dash: true, cls: 'c3' }, { y: -V0, dash: true, cls: 'c3' }],
      vlines: [{ x: 0.020, dash: true, label: '0.020', cls: 'c3' }],
      points: [{ x: 0.005, y: V0, label: '141 V', cls: 'c3', pos: 'tr' }],
      axis: ['t [s]', 'v [V]']
    });
  }

  // 変圧器（1 次コイル N₁ = 500、2 次コイル N₂ = 50）。1 次側に交流電源、2 次側に抵抗器
  function figTransformer() {
    const d = JK.plot.draw(420, 200);
    const xs = 70, xa = 170, xb = 270, xr = 355, yT = 34, yB = 166;
    d.rect(xa, 52, xb - xa, 86, { cls: 'dim', w: 12 });
    d.text((xa + xb) / 2, 99, '鉄心', { cls: 'dim' });
    d.acsource(xs, 100, 14);
    d.wire([[xs, 86], [xs, yT], [xa, yT], [xa, 62]]);
    d.coil(xa, 130, xa, 62, { n: 6 });
    d.wire([[xa, 130], [xa, yB], [xs, yB], [xs, 114]]);
    d.coil(xb, 62, xb, 130, { n: 6 });
    d.wire([[xb, 62], [xb, yT], [xr, yT], [xr, 70]]);
    d.resistor(xr, 70, xr, 130);
    d.wire([[xr, 130], [xr, yB], [xb, yB], [xb, 130]]);
    d.text(xs - 22, 104, '100 V', { anchor: 'end' });
    d.text(xa - 16, 100, 'N₁ = 500', { anchor: 'end', cls: 'c1' });
    d.text(xb + 16, 100, 'N₂ = 50', { anchor: 'start', cls: 'c3' });
    d.text(xr + 12, 104, '5.0 Ω', { anchor: 'start' });
    d.text(120, 188, '1 次側', { cls: 'c1', size: 11 });
    d.text(312, 188, '2 次側', { cls: 'c3', size: 11 });
    return d.svg();
  }

  // 光電効果: 光電子の運動エネルギーの最大値 K と、光の振動数 ν の関係（破線は直線の延長）
  function figPhotoK() {
    return JK.plot.graph({
      w: 340, h: 240, x: [0, 12.5], y: [-4, 5],
      segs: [
        { x1: 5, y1: 0, x2: 12, y2: 4.62, cls: 'c1' },
        { x1: 0, y1: -3.3, x2: 5, y2: 0, cls: 'c1', dash: true }
      ],
      points: [
        { x: 5, y: 0, label: 'ν₀ = 5.0', cls: 'c3', pos: 'tl' },
        { x: 0, y: -3.3, label: '−W', cls: 'c2', pos: 'br' }
      ],
      labels: [
        { x: 6.4, y: -2.3, text: 'ν の単位: 10¹⁴ Hz', cls: 'dim' },
        { x: 6.4, y: -3.2, text: 'K の単位: 10⁻¹⁹ J', cls: 'dim' }
      ],
      axis: ['ν', 'K']
    });
  }

  // 水素原子のエネルギー準位（n = 1〜4 と n = ∞）。n = 3 から n = 2 への遷移を矢印で示す
  function figLevels() {
    const d = JK.plot.draw(340, 300);
    const y = function (E) { return 24 - E * 18; };
    const lv = [['n = ∞', '0', 0], ['n = 4', '−0.85 eV', -0.85], ['n = 3', '−1.51 eV', -1.51], ['n = 2', '−3.40 eV', -3.40], ['n = 1', '−13.6 eV', -13.6]];
    d.text(14, 14, 'エネルギー準位', { anchor: 'start', cls: 'dim' });
    lv.forEach(function (a) {
      d.line(100, y(a[2]), 230, y(a[2]), { cls: 'fg', w: 2 });
      d.text(92, y(a[2]) + 4, a[0], { anchor: 'end', size: 11 });
      d.text(238, y(a[2]) + 4, a[1], { anchor: 'start', size: 11 });
    });
    d.arrow(165, y(-1.51), 165, y(-3.40), { cls: 'c3' });
    d.text(176, 72, '光子を放出', { anchor: 'start', cls: 'c3', size: 11 });
    d.text(165, 290, '（基底状態）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ---------- 比の計算・単位と指数（p-math0） ---------- */
    {
      id: 'd-p-math0-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-math0',
      title: '比例の関係と比の計算',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`あるばねは、加えた力に比例して伸びる。このばねを $2.0\,\mathrm{N}$ の力で引くと $3.0\,\mathrm{cm}$ 伸びた。次の問いに答えよ。`,
      fig: figSpringRatio(),
      parts: [
        { label: '(1)', q: R`同じばねを $5.0\,\mathrm{N}$ の力で引くと、伸びは何 $\mathrm{cm}$ になるか。`, type: 'num', answer: 7.5, rel: 0.02, unit: 'cm' },
        { label: '(2)', q: R`同じばねの伸びを $12\,\mathrm{cm}$ にするには、何 $\mathrm{N}$ の力で引けばよいか。`, type: 'num', answer: 8, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: '「比例」を比の式にする（(1)）',
          m: [R`2.0 : 3.0 = 5.0 : x`,
              R`x = 3.0 \times \frac{5.0}{2.0} = 7.5\,\mathrm{cm}`],
          n: R`伸び $x$ は力 $F$ に比例するので、$\dfrac{x}{F}$ は一定です。力が $\dfrac{5.0}{2.0} = 2.5$ 倍になれば、伸びも $2.5$ 倍になります。`,
          easy: R`「比例」とは、一方が 2 倍・3 倍になると、もう一方も 2 倍・3 倍になる関係です。力が $2.0\,\mathrm{N}$ から $5.0\,\mathrm{N}$ へ $2.5$ 倍になったので、伸びも $3.0\,\mathrm{cm}$ の $2.5$ 倍、つまり $7.5\,\mathrm{cm}$ です。`,
          pro: R`$\dfrac{F}{x}$（ばね定数）が一定、と見れば $x = \dfrac{5.0}{2.0/3.0}$ と 1 行で出せます。` },
        { t: '逆向きにも同じ比を使う（(2)）',
          m: [R`F = 2.0 \times \frac{12}{3.0} = 8.0\,\mathrm{N}`],
          n: R`伸びが $\dfrac{12}{3.0} = 4$ 倍になるので、力も $4$ 倍にします。`,
          easy: R`今度は伸びのほうが先に分かっています。伸びが $3.0\,\mathrm{cm}$ から $12\,\mathrm{cm}$ へ $4$ 倍になったので、必要な力も $2.0\,\mathrm{N}$ の $4$ 倍で $8.0\,\mathrm{N}$ です。比例の問題は「何倍になったか」を先に求めると間違えにくくなります。` }
      ],
      tags: ['比例', '比', 'ばね']
    },

    {
      id: 'd-p-math0-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-math0',
      title: '単位の換算（速さ・密度）',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`次の単位換算をせよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$54\,\mathrm{km/h}$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 15, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`密度 $2.7\,\mathrm{g/cm^{3}}$ は何 $\mathrm{kg/m^{3}}$ か。`, type: 'num', answer: 2700, rel: 0.02, unit: 'kg/m³', show: R`2.7 \times 10^{3}`, hint: R`例: 1.5e3 や 1500` }
      ],
      solution: [
        { t: '速さの換算（(1)）',
          m: [R`54\,\mathrm{km/h} = \frac{54 \times 1000\,\mathrm{m}}{3600\,\mathrm{s}} = 15\,\mathrm{m/s}`],
          n: R`$1\,\mathrm{km} = 1000\,\mathrm{m}$、$1\,\mathrm{h} = 3600\,\mathrm{s}$ を代入します。`,
          easy: R`$\mathrm{km/h}$ は「1 時間に何 $\mathrm{km}$ 進むか」、$\mathrm{m/s}$ は「1 秒間に何 $\mathrm{m}$ 進むか」です。$1\,\mathrm{km}$ は $1000\,\mathrm{m}$ なので分子を $1000$ 倍し、$1$ 時間は $3600$ 秒なので分母を $3600$ 倍します。結果として「$\mathrm{km/h}$ を $3.6$ で割ると $\mathrm{m/s}$」になり、$54 \div 3.6 = 15$ です。`,
          pro: R`$\mathrm{km/h} \to \mathrm{m/s}$ は $\div 3.6$、逆は $\times 3.6$。$36\,\mathrm{km/h} = 10\,\mathrm{m/s}$ を基準に覚えます。` },
        { t: '密度の換算（体積の単位は 3 乗になる）（(2)）',
          m: [R`1\,\mathrm{g} = 10^{-3}\,\mathrm{kg}, \qquad 1\,\mathrm{cm^{3}} = (10^{-2}\,\mathrm{m})^{3} = 10^{-6}\,\mathrm{m^{3}}`,
              R`2.7\,\mathrm{g/cm^{3}} = \frac{2.7 \times 10^{-3}\,\mathrm{kg}}{10^{-6}\,\mathrm{m^{3}}} = 2.7 \times 10^{3}\,\mathrm{kg/m^{3}}`],
          n: R`長さの単位が $\dfrac{1}{100}$ 倍になると、体積の単位は $\left(\dfrac{1}{100}\right)^{3} = 10^{-6}$ 倍になります。`,
          easy: R`$1\,\mathrm{cm} = 0.01\,\mathrm{m}$ ですが、$1\,\mathrm{cm^{3}}$ は縦・横・高さがすべて $0.01\,\mathrm{m}$ の立方体なので、$0.01 \times 0.01 \times 0.01 = 0.000001\,\mathrm{m^{3}}$ です。分母が $10^{-6}$ 倍に小さくなるので、全体は $10^{3}$ 倍に大きくなります。「$1\,\mathrm{g/cm^{3}} = 1000\,\mathrm{kg/m^{3}}$（水の密度）」と覚えておくと速く換算できます。` }
      ],
      tags: ['単位換算', '密度', '速さ']
    },

    {
      id: 'd-p-math0-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-math0',
      title: '指数の計算と有効数字',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`次の問いに答えよ。答えの数値は $6.0 \times 10^{2}$ のように指数を使って書いてもよい（解答欄には $6.0\mathrm{e}2$ や $6.0 \times 10^{2}$ と入力できる）。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$(3.0 \times 10^{5}) \times (2.0 \times 10^{-3})$ を計算せよ。`, type: 'num', answer: 600, rel: 0.02, show: R`6.0 \times 10^{2}`, hint: R`例: 1.5e3 や 1500` },
        { label: '(2)', q: R`光は真空中を $3.0 \times 10^{8}\,\mathrm{m/s}$ の速さで進む。$1.5 \times 10^{-3}\,\mathrm{s}$ の間に光が進む距離は何 $\mathrm{m}$ か。`, type: 'num', answer: 450000, rel: 0.02, unit: 'm', show: R`4.5 \times 10^{5}`, hint: R`例: 1.5e3 や 1.5×10^3` },
        { label: '(3)', q: R`次のうち、有効数字が 3 桁の数はどれか。`, type: 'choice', choices: [R`$0.0050$`, R`$4.0 \times 10^{-2}$`, R`$1.20 \times 10^{3}$`, R`$8 \times 10^{5}$`], answer: 2 }
      ],
      solution: [
        { t: '指数どうしは足し算、係数どうしは掛け算（(1)）',
          m: [R`(3.0 \times 10^{5}) \times (2.0 \times 10^{-3}) = (3.0 \times 2.0) \times 10^{5 + (-3)}`,
              R`= 6.0 \times 10^{2} = 600`],
          n: R`$10^{a} \times 10^{b} = 10^{a+b}$ です。係数 $3.0 \times 2.0 = 6.0$ と、指数 $5 + (-3) = 2$ を別々に計算します。`,
          easy: R`$10^{5}$ は $1$ のあとに $0$ が 5 個並んだ数（$100000$）、$10^{-3}$ は $1000$ 分の $1$ です。$100000$ に $\dfrac{1}{1000}$ をかけると $100 = 10^{2}$ になるので、指数は $5 + (-3) = 2$ と足し算で求められます。係数どうし $3.0 \times 2.0 = 6.0$ は普通にかけます。` },
        { t: '「距離 = 速さ × 時間」に代入する（(2)）',
          m: [R`x = vt = (3.0 \times 10^{8}) \times (1.5 \times 10^{-3})`,
              R`= (3.0 \times 1.5) \times 10^{8 + (-3)} = 4.5 \times 10^{5}\,\mathrm{m}`],
          n: R`$3.0 \times 1.5 = 4.5$、$10^{8} \times 10^{-3} = 10^{5}$ です。$4.5 \times 10^{5}\,\mathrm{m} = 450\,\mathrm{km}$ にあたります。`,
          easy: R`距離は「速さ × 時間」です。光はとても速いので、たった $1.5 \times 10^{-3}$ 秒（約 $0.0015$ 秒）でも $450\,\mathrm{km}$ も進みます。$10^{5}$ は $100000$ なので、$4.5 \times 10^{5} = 450000\,\mathrm{m}$ と書いても同じです。` },
        { t: '有効数字の数え方（(3)）',
          n: R`有効数字は「0 でない最初の数字」から数えます。$0.0050$ は $5,\ 0$ の 2 桁、$4.0 \times 10^{-2}$ は $4,\ 0$ の 2 桁、$1.20 \times 10^{3}$ は $1,\ 2,\ 0$ の 3 桁、$8 \times 10^{5}$ は 1 桁です。`,
          easy: R`$0.0050$ の先頭の $0$ は小数点の位置を示すだけの $0$（位取り）なので数えません。最後の $0$ は「$5.0$ まで測った」という意味のある $0$ なので数えます。指数の部分（$10^{-2}$ など）は桁数に入りません。したがって有効数字 3 桁は $1.20 \times 10^{3}$ だけです。` }
      ],
      tags: ['指数', '有効数字', '光の速さ']
    },

    /* ---------- オームの法則の基本（p-ohm0） ---------- */
    {
      id: 'd-p-ohm0-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-ohm0',
      title: 'オームの法則（V = RI）',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`図のように、電圧 $6.0\,\mathrm{V}$ の電池に抵抗値 $20\,\Omega$ の抵抗器をつないだ。`,
      fig: figOhm1('6.0 V', '20 Ω'),
      parts: [
        { label: '(1)', q: R`抵抗器を流れる電流 $I$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.3, rel: 0.02, unit: 'A' },
        { label: '(2)', q: R`この抵抗器に $0.50\,\mathrm{A}$ の電流を流すには、何 $\mathrm{V}$ の電圧をかければよいか。`, type: 'num', answer: 10, rel: 0.02, unit: 'V' }
      ],
      solution: [
        { t: 'オームの法則で電流を求める（(1)）',
          m: [R`V = RI \;\Rightarrow\; I = \frac{V}{R}`,
              R`I = \frac{6.0}{20} = 0.30\,\mathrm{A}`],
          n: R`抵抗器にかかる電圧 $V$、抵抗値 $R$、流れる電流 $I$ の間には $V = RI$（オームの法則）が成り立ちます。`,
          easy: R`電気を水の流れにたとえると、電圧 $V$ は「水を押す力（高さの差）」、電流 $I$ は「流れる水の量」、抵抗 $R$ は「水路の細さ（流れにくさ）」です。押す力が同じなら、水路が細い（$R$ が大きい）ほど流れる量 $I$ は小さくなる、という関係が $I = \dfrac{V}{R}$ です。`,
          pro: R`単位は $\mathrm{V} = \Omega \times \mathrm{A}$。式の両辺の単位を確かめると式の覚え間違いを防げます。` },
        { t: '電圧を求める（(2)）',
          m: [R`V = RI = 20 \times 0.50 = 10\,\mathrm{V}`],
          n: R`今度は電流 $I$ と抵抗 $R$ が分かっているので、$V = RI$ にそのまま代入します。`,
          easy: R`同じ抵抗器でも、流したい電流を大きくするには、押す力（電圧）を大きくする必要があります。$V = RI$ に $R = 20\,\Omega$、$I = 0.50\,\mathrm{A}$ を入れるだけです。確かめとして、$10\,\mathrm{V}$ を $20\,\Omega$ にかけると $I = \dfrac{10}{20} = 0.50\,\mathrm{A}$ に戻ります。` }
      ],
      tags: ['オームの法則', '電圧', '電流']
    },

    {
      id: 'd-p-ohm0-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-ohm0',
      title: '抵抗の直列つなぎ',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、$R_{1} = 10\,\Omega$ と $R_{2} = 20\,\Omega$ の 2 つの抵抗器を直列につなぎ、電圧 $12\,\mathrm{V}$ の電池をつないだ。`,
      fig: figSeries2('12 V', 'R₁ = 10 Ω', 'R₂ = 20 Ω'),
      parts: [
        { label: '(1)', q: R`2 つの抵抗器全体の合成抵抗 $R$ は何 $\Omega$ か。`, type: 'num', answer: 30, rel: 0.02, unit: 'Ω' },
        { label: '(2)', q: R`回路を流れる電流 $I$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.4, rel: 0.02, unit: 'A' },
        { label: '(3)', q: R`$R_{1}$ にかかる電圧 $V_{1}$ は何 $\mathrm{V}$ か。`, type: 'num', answer: 4, rel: 0.02, unit: 'V' }
      ],
      solution: [
        { t: '直列の合成抵抗',
          m: [R`R = R_{1} + R_{2} = 10 + 20 = 30\,\Omega`],
          n: R`直列つなぎでは、合成抵抗は各抵抗値の和になります。`,
          easy: R`直列は、水路を 1 本の道につなげて長くしたようなものです。道が長くなるぶん流れにくくなるので、抵抗は足し算になります。` },
        { t: '全体にオームの法則を使って電流を求める',
          m: [R`I = \frac{V}{R} = \frac{12}{30} = 0.40\,\mathrm{A}`],
          n: R`直列では、どの抵抗器にも同じ大きさの電流が流れます。この $0.40\,\mathrm{A}$ が $R_{1}$ にも $R_{2}$ にも流れています。`,
          easy: R`直列つなぎは 1 本の道なので、途中で電流が枝分かれすることはありません。だから回路のどこを測っても電流は同じ $0.40\,\mathrm{A}$ です。` },
        { t: '$R_{1}$ だけにオームの法則を使う',
          m: [R`V_{1} = R_{1}I = 10 \times 0.40 = 4.0\,\mathrm{V}`,
              R`V_{2} = R_{2}I = 20 \times 0.40 = 8.0\,\mathrm{V} \quad (V_{1} + V_{2} = 12\,\mathrm{V})`],
          n: R`各抵抗器にかかる電圧は「その抵抗値 × 流れる電流」です。$V_{1}$ と $V_{2}$ を足すと電池の電圧 $12\,\mathrm{V}$ に一致することを確かめましょう。`,
          easy: R`電池の $12\,\mathrm{V}$ は、2 つの抵抗器が抵抗の大きさに比例して分け合います。$R_{1}$ は全体の $\dfrac{10}{30}$ なので $12 \times \dfrac{1}{3} = 4.0\,\mathrm{V}$ としても求められます。` }
      ],
      tags: ['直列', '合成抵抗', 'オームの法則']
    },

    {
      id: 'd-p-ohm0-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-ohm0',
      title: '抵抗の並列つなぎ',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、$R_{1} = 30\,\Omega$ と $R_{2} = 60\,\Omega$ の 2 つの抵抗器を並列につなぎ、電圧 $6.0\,\mathrm{V}$ の電池をつないだ。`,
      fig: figParallel2('6.0 V', '30 Ω', '60 Ω'),
      parts: [
        { label: '(1)', q: R`2 つの抵抗器全体の合成抵抗 $R$ は何 $\Omega$ か。`, type: 'num', answer: 20, rel: 0.02, unit: 'Ω' },
        { label: '(2)', q: R`電池から流れ出る電流 $I$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.3, rel: 0.02, unit: 'A' },
        { label: '(3)', q: R`$R_{1}$ を流れる電流 $I_{1}$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.2, rel: 0.02, unit: 'A' }
      ],
      solution: [
        { t: '並列の合成抵抗',
          m: [R`\frac{1}{R} = \frac{1}{R_{1}} + \frac{1}{R_{2}} = \frac{1}{30} + \frac{1}{60} = \frac{2 + 1}{60} = \frac{1}{20}`,
              R`R = 20\,\Omega`],
          n: R`並列つなぎでは、合成抵抗の逆数が各抵抗値の逆数の和になります。結果の $20\,\Omega$ は、どちらの抵抗値（$30\,\Omega$、$60\,\Omega$）よりも小さくなります。`,
          easy: R`並列は、水路を 2 本に分けて水の通り道を増やしたようなものです。道が増えるので全体としては流れやすくなり、合成抵抗は元のどの抵抗よりも小さくなります。そのため、抵抗値そのものではなく「逆数（$\dfrac{1}{R}$）」を足します。` },
        { t: '電池を流れる電流（全体の電流）',
          m: [R`I = \frac{V}{R} = \frac{6.0}{20} = 0.30\,\mathrm{A}`],
          n: R`回路全体を 1 つの抵抗 $R = 20\,\Omega$ とみなして、オームの法則を使います。`,
          easy: R`2 つの抵抗器を「合成抵抗 $20\,\Omega$ の 1 つの抵抗器」に置き換えて考えると、電池から出る電流は $V \div R$ で求められます。` },
        { t: '各抵抗器に流れる電流',
          m: [R`I_{1} = \frac{V}{R_{1}} = \frac{6.0}{30} = 0.20\,\mathrm{A}`,
              R`I_{2} = \frac{V}{R_{2}} = \frac{6.0}{60} = 0.10\,\mathrm{A} \quad (I_{1} + I_{2} = I)`],
          n: R`並列では、どの抵抗器にも電池と同じ電圧 $6.0\,\mathrm{V}$ がかかります。各抵抗器の電流は、その電圧を各抵抗値で割れば求まり、足すと全体の電流 $0.30\,\mathrm{A}$ に一致します。`,
          easy: R`並列つなぎでは、枝分かれした両方の道に電池の電圧がそのままかかります。$R_{1}$ には $6.0\,\mathrm{V}$ がかかるので $I_{1} = \dfrac{6.0}{30} = 0.20\,\mathrm{A}$、$R_{2}$ には $I_{2} = 0.10\,\mathrm{A}$ が流れ、合計が $0.30\,\mathrm{A}$ になります。抵抗が小さい（流れやすい）枝ほど大きな電流が流れます。` }
      ],
      tags: ['並列', '合成抵抗', 'オームの法則']
    },

    /* ---------- 力のつり合い・力の分解（p-force0） ---------- */
    {
      id: 'd-p-force0-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-force0',
      title: '力の分解（水平・鉛直成分）',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`水平な床の上の物体に、水平方向から $30\degree$ 上向きに $10\,\mathrm{N}$ の力を加える。$\sqrt{3} = 1.73$ とする。`,
      fig: figForceSplit(),
      parts: [
        { label: '(1)', q: R`この力の水平方向の成分 $F_{x}$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 5 * Math.sqrt(3), rel: 0.02, unit: 'N', show: R`5\sqrt{3} \fallingdotseq 8.7`, hint: R`例: 5.2 や 3√3` },
        { label: '(2)', q: R`この力の鉛直方向の成分 $F_{y}$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 5, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: '力を直角三角形の斜辺とみなして分解する',
          m: [R`F_{x} = F\cos 30\degree = 10 \times \frac{\sqrt{3}}{2} = 5\sqrt{3} \fallingdotseq 8.7\,\mathrm{N}`,
              R`F_{y} = F\sin 30\degree = 10 \times \frac{1}{2} = 5.0\,\mathrm{N}`],
          n: R`斜めの力 $F$ を斜辺とする直角三角形を描き、水平成分・鉛直成分を 2 辺として求めます。角 $\theta$ に「隣り合う辺」が $F\cos\theta$、「向かい合う辺」が $F\sin\theta$ です。`,
          easy: R`斜めの力は、「右向きに押す力」と「上向きに引き上げる力」の 2 つが合わさったものと考えられます。これを力の**分解**といいます。図の破線の直角三角形で、斜辺が $10\,\mathrm{N}$、$30\degree$ の角に隣り合う底辺が水平成分、向かい合う高さが鉛直成分です。`,
          pro: R`$30\degree,\ 60\degree,\ 90\degree$ の三角形は辺の比が $1 : \sqrt{3} : 2$。$\sin 30\degree = \dfrac{1}{2},\ \cos 30\degree = \dfrac{\sqrt{3}}{2}$ は暗記しておきます。` },
        { t: '三角比の値を確認する',
          m: [R`\sin 30\degree = \frac{1}{2}, \qquad \cos 30\degree = \frac{\sqrt{3}}{2} \fallingdotseq 0.865`],
          n: R`直角三角形の辺の比 $1 : \sqrt{3} : 2$（$30\degree$ の角の向かい側が $1$、隣が $\sqrt{3}$、斜辺が $2$）から値が決まります。$F_{x}^{2} + F_{y}^{2} = 8.66^{2} + 5.0^{2} = 100 = F^{2}$ で、三平方の定理の確かめにもなります。`,
          easy: R`角が $30\degree$ のとき、直角三角形の 3 辺は短い辺：長い辺：斜辺 $= 1 : \sqrt{3} : 2$ になります（正三角形を半分に切った形）。斜辺が $10$ なら、向かい合う辺は $5$、隣り合う辺は $5\sqrt{3} = 5 \times 1.73 = 8.65$ です。`,
          lv: 2 }
      ],
      tags: ['力の分解', '三角比']
    },

    {
      id: 'd-p-force0-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-force0',
      title: 'つるしたおもりのつり合い',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`質量 $2.0\,\mathrm{kg}$ の物体を、軽いばね（ばね定数 $98\,\mathrm{N/m}$）の下端につるしたところ、物体は静止した。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figHangSpring(),
      parts: [
        { label: '(1)', q: R`ばねが物体を引く力（弾性力）の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 19.6, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`ばねは自然の長さから何 $\mathrm{m}$ 伸びているか。`, type: 'num', answer: 0.2, rel: 0.02, unit: 'm' }
      ],
      solution: [
        { t: '物体にはたらく力を書き出し、つり合いの式を立てる（(1)）',
          m: [R`kx = mg`,
              R`kx = 2.0 \times 9.8 = 19.6\,\mathrm{N}`],
          n: R`物体にはたらく力は、重力 $mg$（下向き）とばねの弾性力 $kx$（上向き）の 2 つです。静止しているので、2 つの力はつり合い、同じ大きさです。`,
          easy: R`物体が止まっているということは、「下へ引く力」と「上へ引く力」がちょうど同じ大きさで打ち消し合っている、ということです。下へ引く力は重力 $mg = 2.0 \times 9.8 = 19.6\,\mathrm{N}$ なので、ばねが上へ引く力も $19.6\,\mathrm{N}$ です。`,
          pro: R`「静止 → 力のつり合い」。力を図に描き、上向き＝下向きの式を最初に立てます。` },
        { t: 'フックの法則で伸びを求める（(2)）',
          m: [R`F = kx \;\Rightarrow\; x = \frac{F}{k} = \frac{19.6}{98} = 0.20\,\mathrm{m}`],
          n: R`ばねの弾性力 $F$ は、伸び $x$ に比例します（フックの法則）。比例定数 $k$ がばね定数です。`,
          easy: R`ばね定数 $k = 98\,\mathrm{N/m}$ は「$1\,\mathrm{m}$ 伸ばすのに $98\,\mathrm{N}$ の力が要る」という意味です。$19.6\,\mathrm{N}$ は $98\,\mathrm{N}$ の $\dfrac{1}{5}$ なので、伸びも $1\,\mathrm{m}$ の $\dfrac{1}{5}$、つまり $0.20\,\mathrm{m}$ です。` }
      ],
      tags: ['つり合い', 'フックの法則', '重力']
    },

    {
      id: 'd-p-force0-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-force0',
      title: '斜面上の物体のつり合い',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`傾きが $30\degree$ のなめらかな斜面上に質量 $4.0\,\mathrm{kg}$ の物体を置き、斜面に平行な糸で支えて静止させた。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、$\sqrt{3} = 1.73$ とする。`,
      fig: figInclineHold(),
      parts: [
        { label: '(1)', q: R`糸が物体を引く力（張力）$T$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 19.6, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`斜面が物体を押す垂直抗力 $N$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 33.9, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: '重力を「斜面に平行」と「斜面に垂直」に分解する',
          m: [R`mg = 4.0 \times 9.8 = 39.2\,\mathrm{N}`,
              R`\text{平行成分: } mg\sin 30\degree = 19.6\,\mathrm{N}, \qquad \text{垂直成分: } mg\cos 30\degree \fallingdotseq 33.9\,\mathrm{N}`],
          n: R`斜面の問題では、重力を斜面に沿った向きと斜面に垂直な向きに分けると、つり合いの式が立てやすくなります。傾き $\theta$ のとき、平行成分が $mg\sin\theta$、垂直成分が $mg\cos\theta$ です。`,
          easy: R`重力は真下に向かう 1 本の力ですが、斜面の上では「斜面をすべり下ろうとする力」と「斜面を押しつける力」の 2 つの働きをします。そこで重力を、斜面に沿った向きと斜面に垂直な向きの 2 方向に分けて考えます。斜面が急になる（$\theta$ が大きくなる）ほど、すべり下ろうとする成分 $mg\sin\theta$ が大きくなります。` },
        { t: '斜面に平行な向きのつり合い（(1)）',
          m: [R`T = mg\sin 30\degree = 39.2 \times \frac{1}{2} = 19.6\,\mathrm{N}`],
          n: R`斜面に沿った向きの力は、糸の張力 $T$（斜面上向き）と重力の平行成分（斜面下向き）です。静止しているのでこの 2 つがつり合います。`,
          easy: R`物体を止めているのは糸です。物体を斜面の下へ引っ張る力（重力の平行成分 $19.6\,\mathrm{N}$）を、糸が同じ大きさで上へ引き返しているので、$T = 19.6\,\mathrm{N}$ です。` },
        { t: '斜面に垂直な向きのつり合い（(2)）',
          m: [R`N = mg\cos 30\degree = 39.2 \times \frac{\sqrt{3}}{2} = 39.2 \times 0.865 \fallingdotseq 33.9\,\mathrm{N}`],
          n: R`斜面に垂直な向きでは、垂直抗力 $N$ と重力の垂直成分がつり合います（糸は斜面に平行なので、この向きには力を出しません）。`,
          easy: R`物体は斜面にめり込むことも浮き上がることもなく、斜面に沿って静止しています。つまり斜面に垂直な向きの力もつり合っていて、斜面が押し返す力 $N$ は、重力が斜面を押す成分 $mg\cos 30\degree$ と同じ大きさになります。` }
      ],
      tags: ['斜面', 'つり合い', '力の分解']
    },

    /* ---------- 等加速度運動（p-kin） ---------- */
    {
      id: 'd-p-kin-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-kin',
      title: '等加速度直線運動の基本式',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`一直線上を、初速度 $2.0\,\mathrm{m/s}$、加速度 $3.0\,\mathrm{m/s^{2}}$ で等加速度直線運動する物体がある。速度のグラフは図のようになる。`,
      fig: figVT1(false),
      parts: [
        { label: '(1)', q: R`$4.0\,\mathrm{s}$ 後の速さ $v$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 14, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`$4.0\,\mathrm{s}$ の間の変位 $x$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 32, rel: 0.02, unit: 'm' }
      ],
      solution: [
        { t: '速度の式 $v = v_{0} + at$ に代入する（(1)）',
          m: [R`v = v_{0} + at`,
              R`v = 2.0 + 3.0 \times 4.0 = 14\,\mathrm{m/s}`],
          n: R`加速度とは「1 秒間に速度がどれだけ増えるか」です。$3.0\,\mathrm{m/s^{2}}$ なら 1 秒ごとに速さが $3.0\,\mathrm{m/s}$ ずつ増えます。`,
          easy: R`初めの速さは $2.0\,\mathrm{m/s}$ です。1 秒ごとに $3.0\,\mathrm{m/s}$ ずつ速くなるので、$4.0$ 秒間では $3.0 \times 4.0 = 12\,\mathrm{m/s}$ だけ速くなり、$2.0 + 12 = 14\,\mathrm{m/s}$ になります。グラフでは、傾きが加速度 $a = 3.0$ の直線です。` },
        { t: R`変位の式 $x = v_{0}t + \dfrac{1}{2}at^{2}$ に代入する（(2)）`,
          m: [R`x = v_{0}t + \frac{1}{2}at^{2}`,
              R`x = 2.0 \times 4.0 + \frac{1}{2} \times 3.0 \times 4.0^{2} = 8.0 + 24 = 32\,\mathrm{m}`],
          n: R`$v$–$t$ グラフの線と時間軸ではさまれた面積が変位です。ここでは上底 $2.0$、下底 $14$、高さ $4.0$ の台形で、$\dfrac{(2.0 + 14) \times 4.0}{2} = 32\,\mathrm{m}$ と同じ値になります。`,
          easy: R`進んだ距離は「速さ × 時間」ですが、速さが変わっていくので、グラフの面積で考えます。図の色のついた台形の面積が、この $4.0$ 秒間に進んだ距離です。公式 $x = v_{0}t + \dfrac{1}{2}at^{2}$ は、この面積を式にしたものです。`,
          pro: R`時間が分かっていて速さを聞かれていないなら $x = \dfrac{v_{0} + v}{2}\,t$（平均の速さ × 時間）も速いです。`,
          fig: figVT1(true) }
      ],
      tags: ['等加速度', 'v-tグラフ']
    },

    {
      id: 'd-p-kin-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-kin',
      title: 'ブレーキをかけた自動車',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`直線道路を $20\,\mathrm{m/s}$ で走る自動車が、ブレーキをかけて一定の加速度 $-4.0\,\mathrm{m/s^{2}}$（運動と逆向きに $4.0\,\mathrm{m/s^{2}}$）で減速し、やがて停止した。`,
      fig: figBrakeCar(),
      parts: [
        { label: '(1)', q: R`ブレーキをかけてから停止するまでの時間 $t$ は何 $\mathrm{s}$ か。`, type: 'num', answer: 5, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`ブレーキをかけてから停止するまでに進む距離 $x$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 50, rel: 0.02, unit: 'm' }
      ],
      solution: [
        { t: '速度の式から停止までの時間を求める（(1)）',
          m: [R`v = v_{0} + at \;\Rightarrow\; 0 = 20 + (-4.0)\,t`,
              R`t = \frac{20}{4.0} = 5.0\,\mathrm{s}`],
          n: R`停止したときの速さは $v = 0$ です。加速度は運動と逆向きなので負の値 $a = -4.0$ を代入します。`,
          easy: R`ブレーキで毎秒 $4.0\,\mathrm{m/s}$ ずつ遅くなります。初めの速さ $20\,\mathrm{m/s}$ が $0$ になるまでには、$20 \div 4.0 = 5.0$ 秒かかります。運動の向きを正とするので、遅くなる加速度は負の数で表すのがポイントです。`,
          pro: R`「止まる」＝ $v = 0$。減速の問題は加速度の符号を間違えないことが最重要です。` },
        { t: '時間を含まない式で距離を求める（(2)）',
          m: [R`v^{2} - v_{0}^{2} = 2ax \;\Rightarrow\; 0 - 20^{2} = 2 \times (-4.0) \times x`,
              R`x = \frac{400}{8.0} = 50\,\mathrm{m}`],
          n: R`$x = v_{0}t + \dfrac{1}{2}at^{2} = 20 \times 5.0 - \dfrac{1}{2} \times 4.0 \times 5.0^{2} = 100 - 50 = 50\,\mathrm{m}$ としても同じです。`,
          easy: R`時間 $t$ が分からないとき（または使いたくないとき）に便利なのが $v^{2} - v_{0}^{2} = 2ax$ です。止まるまでの速さは $20 \to 0$ なので、左辺は $0 - 400$、右辺は $2 \times (-4.0) \times x$。両辺の負号が打ち消し合って $x = 50\,\mathrm{m}$ になります。平均の速さ $10\,\mathrm{m/s}$ で $5.0$ 秒進んだ、と考えても $50\,\mathrm{m}$ です。` }
      ],
      tags: ['等加速度', '減速', '停止距離']
    },

    {
      id: 'd-p-kin-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-kin',
      title: 'v-t グラフの読み取り',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`直線上を運動する物体の速度 $v$ と時間 $t$ の関係が、図のグラフのようになった。$t = 0$ のとき物体は静止していた。`,
      fig: figVT3(false),
      parts: [
        { label: '(1)', q: R`$0 \sim 2\,\mathrm{s}$ の間の加速度の大きさは何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 5, rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`$0 \sim 8\,\mathrm{s}$ の間に物体が進んだ距離は何 $\mathrm{m}$ か。`, type: 'num', answer: 60, rel: 0.02, unit: 'm' },
        { label: '(3)', q: R`$0 \sim 8\,\mathrm{s}$ の間の平均の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 7.5, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        { t: 'グラフの傾きが加速度（(1)）',
          m: [R`a = \frac{\Delta v}{\Delta t} = \frac{10 - 0}{2 - 0} = 5.0\,\mathrm{m/s^{2}}`],
          n: R`$v$–$t$ グラフの傾きは、1 秒あたりの速度の変化、つまり加速度を表します。$2\,\mathrm{s} \sim 6\,\mathrm{s}$ は傾きが $0$ なので、速さが一定（加速度 $0$）の区間です。`,
          easy: R`グラフが右上がりに急であるほど、速さが短い時間で大きく増えている（加速度が大きい）ことを表します。$0$ 秒から $2$ 秒の間に速さが $0$ から $10\,\mathrm{m/s}$ に増えているので、$1$ 秒あたり $10 \div 2 = 5.0\,\mathrm{m/s}$ ずつ増えています。` },
        { t: 'グラフと横軸ではさまれた面積が距離（(2)）',
          m: [R`x = \frac{1}{2} \times 2 \times 10 + 4 \times 10 + \frac{1}{2} \times 2 \times 10 = 10 + 40 + 10 = 60\,\mathrm{m}`,
              R`\text{（台形として: }\ \frac{(6 - 2) + (8 - 0)}{2} \times 10 = \frac{4 + 8}{2} \times 10 = 60\,\mathrm{m}\ \text{）}`],
          n: R`台形（上底 $4$、下底 $8$、高さ $10$）として一度に求めても、三角形・長方形・三角形の 3 つに分けて足しても同じ $60\,\mathrm{m}$ です。`,
          easy: R`距離は「速さ × 時間」なので、速さが一定の区間は長方形の面積になります。速さが変わる区間は三角形（底辺が時間、高さが速さの最大値）の面積です。$0 \sim 2\,\mathrm{s}$ は三角形 $10\,\mathrm{m}$、$2 \sim 6\,\mathrm{s}$ は長方形 $4 \times 10 = 40\,\mathrm{m}$、$6 \sim 8\,\mathrm{s}$ は三角形 $10\,\mathrm{m}$ で、合計 $60\,\mathrm{m}$ です。`,
          fig: figVT3(true) },
        { t: '平均の速さ = 進んだ距離 ÷ かかった時間（(3)）',
          m: [R`\bar{v} = \frac{x}{t} = \frac{60}{8} = 7.5\,\mathrm{m/s}`],
          n: R`物体は一方向に進み続けているので、変位の大きさと進んだ距離が等しく、平均の速さは距離 ÷ 時間で求められます。`,
          easy: R`平均の速さは「同じ時間で同じ距離を、一定の速さで進んだと考えたときの速さ」です。$8$ 秒間で $60\,\mathrm{m}$ 進んだので、$60 \div 8 = 7.5\,\mathrm{m/s}$ です。最高の速さ $10\,\mathrm{m/s}$ より小さくなるのは、加速・減速の時間が含まれるためです。` }
      ],
      tags: ['v-tグラフ', '加速度', '面積']
    },

    /* ---------- 落体の運動（p-fall） ---------- */
    {
      id: 'd-p-fall-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-fall',
      title: '自由落下',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`高さ $19.6\,\mathrm{m}$ の位置から、小球を静かに放した。空気の抵抗は無視でき、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figFreeFall(),
      parts: [
        { label: '(1)', q: R`小球が地面に達するまでの時間 $t$ は何 $\mathrm{s}$ か。`, type: 'num', answer: 2, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`地面に達する直前の小球の速さ $v$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 19.6, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        { t: '自由落下の位置の式から落下時間を求める（(1)）',
          m: [R`y = \frac{1}{2}gt^{2}`,
              R`19.6 = \frac{1}{2} \times 9.8 \times t^{2} \;\Rightarrow\; t^{2} = 4.0 \;\Rightarrow\; t = 2.0\,\mathrm{s}`],
          n: R`静かに放した物体の運動を自由落下といいます。初速度が $0$、加速度が重力加速度 $g$ の等加速度直線運動なので、下向きを正として $y = \dfrac{1}{2}gt^{2}$ が使えます。`,
          easy: R`自由落下は「手を放しただけで、投げてはいない」運動です。落ち始めの速さは $0$ で、1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ速くなっていきます。落ちた距離は $\dfrac{1}{2}gt^{2}$ で表され、これが $19.6\,\mathrm{m}$ になる時間を求めます。$\dfrac{1}{2} \times 9.8 = 4.9$ なので、$4.9\,t^{2} = 19.6$ より $t^{2} = 4.0$ です。`,
          pro: R`$\dfrac{1}{2}g = 4.9$ を暗記しておくと、$h = 4.9\,t^{2}$ としてすぐ解けます。` },
        { t: '速さの式 $v = gt$ に代入する（(2)）',
          m: [R`v = gt = 9.8 \times 2.0 = 19.6\,\mathrm{m/s}`],
          n: R`別解: $v^{2} = 2gh = 2 \times 9.8 \times 19.6 = 384.16$ より $v = 19.6\,\mathrm{m/s}$ です。時間が分からないときは、こちらの式（時間を含まない式）が便利です。`,
          easy: R`1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ速くなるので、$2.0$ 秒後の速さは $9.8 \times 2.0 = 19.6\,\mathrm{m/s}$ です。時速に直すと約 $70\,\mathrm{km/h}$ にもなります。高さ $19.6\,\mathrm{m}$（ビルの 6〜7 階）から落ちる物体は、これだけの速さで地面にぶつかるのです。` }
      ],
      tags: ['自由落下', '重力加速度']
    },

    {
      id: 'd-p-fall-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-fall',
      title: '鉛直投げ上げ',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`地面から小球を、速さ $29.4\,\mathrm{m/s}$ で鉛直上向きに投げ上げた。空気の抵抗は無視でき、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figThrowUp(),
      parts: [
        { label: '(1)', q: R`小球が最高点に達するまでの時間 $t$ は何 $\mathrm{s}$ か。`, type: 'num', answer: 3, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`最高点の地面からの高さ $H$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 44.1, rel: 0.02, unit: 'm' }
      ],
      solution: [
        { t: '最高点では速さが 0 になることを使う（(1)）',
          m: [R`v = v_{0} - gt \;\Rightarrow\; 0 = 29.4 - 9.8\,t`,
              R`t = \frac{29.4}{9.8} = 3.0\,\mathrm{s}`],
          n: R`上向きを正とすると、加速度は下向きの重力加速度なので $-g$ です。最高点では一瞬止まるので $v = 0$ とおきます。`,
          easy: R`上へ投げたボールは、上へ進みながら 1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ遅くなり、最高点で一瞬止まります（速さ $0$）。$29.4\,\mathrm{m/s}$ が $0$ になるまでには $29.4 \div 9.8 = 3.0$ 秒かかります。最高点でも、加速度は $9.8\,\mathrm{m/s^{2}}$（下向き）のままで $0$ にはならない点に注意しましょう。`,
          pro: R`「最高点 ＝ $v = 0$（加速度は $g$ のまま）」。上昇と下降は対称で、戻ってくるまでの時間は $2 \times 3.0 = 6.0\,\mathrm{s}$ です。` },
        { t: '時間を含まない式で高さを求める（(2)）',
          m: [R`v^{2} - v_{0}^{2} = -2gH \;\Rightarrow\; 0 - 29.4^{2} = -2 \times 9.8 \times H`,
              R`H = \frac{29.4^{2}}{2 \times 9.8} = \frac{864.36}{19.6} = 44.1\,\mathrm{m}`],
          n: R`別解: $H = v_{0}t - \dfrac{1}{2}gt^{2} = 29.4 \times 3.0 - \dfrac{1}{2} \times 9.8 \times 3.0^{2} = 88.2 - 44.1 = 44.1\,\mathrm{m}$ です。`,
          easy: R`上昇中の速さは $29.4\,\mathrm{m/s}$ から $0$ へ一定の割合で減っていくので、平均の速さは $\dfrac{29.4 + 0}{2} = 14.7\,\mathrm{m/s}$ です。これで $3.0$ 秒間進むので、高さは $14.7 \times 3.0 = 44.1\,\mathrm{m}$ になります。` }
      ],
      tags: ['鉛直投げ上げ', '最高点']
    },

    {
      id: 'd-p-fall-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-fall',
      title: '水平投射',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`高さ $78.4\,\mathrm{m}$ の崖の上から、小球を水平方向に速さ $15\,\mathrm{m/s}$ で投げ出した。空気の抵抗は無視でき、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figHorizontal(),
      parts: [
        { label: '(1)', q: R`小球が地面に達するまでの時間 $t$ は何 $\mathrm{s}$ か。`, type: 'num', answer: 4, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`小球は崖の真下から水平方向に何 $\mathrm{m}$ 離れた地点に落ちるか。`, type: 'num', answer: 60, rel: 0.02, unit: 'm' }
      ],
      solution: [
        { t: '水平方向と鉛直方向に分けて考える',
          m: [R`\text{水平方向（等速直線運動）: } x = v_{0}t`,
              R`\text{鉛直方向（自由落下）: } y = \frac{1}{2}gt^{2}`],
          n: R`水平に投げた物体には、水平方向に力がはたらかないので、水平方向は等速直線運動になります。鉛直方向には重力だけがはたらくので、初速度 $0$ の自由落下と同じ運動をします。`,
          easy: R`水平に投げた物体は、「横へは一定の速さで進みながら」「縦へは自由落下と同じように落ちる」という 2 つの運動を同時に行っています。この 2 つは互いに影響しないので、別々に計算してから、同じ時間 $t$ でつなぎます。` },
        { t: '鉛直方向の式で落下時間を求める（(1)）',
          m: [R`78.4 = \frac{1}{2} \times 9.8 \times t^{2} \;\Rightarrow\; t^{2} = 16 \;\Rightarrow\; t = 4.0\,\mathrm{s}`],
          n: R`落下時間は、水平の初速度 $15\,\mathrm{m/s}$ に関係なく、高さだけで決まります。`,
          easy: R`同じ高さから「静かに落とした球」と「横へ投げた球」は、同時に地面に着きます。横の動きは縦の動きに影響しないからです。だから時間は自由落下の式 $4.9\,t^{2} = 78.4$ から $t^{2} = 16$、$t = 4.0\,\mathrm{s}$ と求められます。` },
        { t: '水平方向の式で到達距離を求める（(2)）',
          m: [R`x = v_{0}t = 15 \times 4.0 = 60\,\mathrm{m}`],
          n: R`水平方向は速さ $15\,\mathrm{m/s}$ の等速直線運動です。落下時間 $4.0\,\mathrm{s}$ の間に進む距離を求めます。`,
          easy: R`横へは一定の速さ $15\,\mathrm{m/s}$ で進み続けます。$4.0$ 秒間に進む距離は「速さ × 時間」$= 15 \times 4.0 = 60\,\mathrm{m}$ です。` }
      ],
      tags: ['水平投射', '放物運動']
    },

    /* ---------- 剛体（p-rigid） ---------- */
    {
      id: 'd-p-rigid-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-rigid',
      title: '力のモーメント',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、点 O を中心に回転できる長さ $0.40\,\mathrm{m}$ の棒の端に、大きさ $15\,\mathrm{N}$ の力を加える。上の図は力を棒に垂直に加える場合、下の図は棒と $30\degree$ の向きに加える場合である。`,
      fig: figMoment(),
      parts: [
        { label: '(1)', q: R`上の図（棒に垂直）の、点 O のまわりの力のモーメントの大きさは何 $\mathrm{N \cdot m}$ か。`, type: 'num', answer: 6, rel: 0.02, unit: 'N·m' },
        { label: '(2)', q: R`下の図（棒と $30\degree$ の向き）の、点 O のまわりの力のモーメントの大きさは何 $\mathrm{N \cdot m}$ か。`, type: 'num', answer: 3, rel: 0.02, unit: 'N·m' }
      ],
      solution: [
        { t: '力のモーメント = 力 × うでの長さ（(1)）',
          m: [R`M = F \times l`,
              R`M = 15 \times 0.40 = 6.0\,\mathrm{N \cdot m}`],
          n: R`$l$ は、回転の中心 O から「力の作用線（力の向きに引いた直線）」までの距離（うでの長さ）です。力が棒に垂直なら、うでの長さは棒の長さ $0.40\,\mathrm{m}$ です。`,
          easy: R`力のモーメントは「物体を回す効果の大きさ」です。ドアを開けるとき、回転軸（ちょうつがい）から遠いところを、ドアに垂直に押すほど軽く開きます。回す効果は「力の大きさ × 軸から力の作用線までの距離」で表します。単位は $\mathrm{N \cdot m}$ です。`,
          pro: R`力が棒に垂直なら $M = Fr$。斜めのときは「垂直成分 × $r$」か「$F$ × うで $l$」のどちらかで計算します。` },
        { t: '斜めの力は、棒に垂直な成分だけが回す（(2)）',
          m: [R`M = (F\sin 30\degree) \times r = 15 \times \frac{1}{2} \times 0.40 = 3.0\,\mathrm{N \cdot m}`],
          n: R`力を「棒に垂直な成分 $F\sin 30\degree = 7.5\,\mathrm{N}$」と「棒に平行な成分 $F\cos 30\degree$」に分解します。平行な成分は作用線が O を通るのでうでの長さが $0$ で、回す効果をもちません。別解として、うでの長さ $l = r\sin 30\degree = 0.20\,\mathrm{m}$ を使い、$M = Fl = 15 \times 0.20 = 3.0\,\mathrm{N \cdot m}$ としても同じです。`,
          easy: R`棒を回すのは、棒に垂直な向きの力だけです。棒に沿った向きの力は、棒を押したり引いたりするだけで、回してはくれません。$30\degree$ 斜めに引くと、回す効果をもつ成分は $15 \times \dfrac{1}{2} = 7.5\,\mathrm{N}$ だけになります。これに $0.40\,\mathrm{m}$ をかけて $3.0\,\mathrm{N \cdot m}$ です。` }
      ],
      tags: ['力のモーメント', 'うでの長さ']
    },

    {
      id: 'd-p-rigid-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-rigid',
      title: 'てこのつり合い',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、軽い棒（質量は無視できる）を支点 O で水平に支え、O から左に $0.20\,\mathrm{m}$ の位置に $30\,\mathrm{N}$ の力を、右に $0.50\,\mathrm{m}$ の位置に力 $W$ を、どちらも下向きに加えて棒を水平に保った。`,
      fig: figLever(),
      parts: [
        { label: '(1)', q: R`力 $W$ の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 12, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`支点 O が棒を押し上げる力 $N$ の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 42, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: '点 O のまわりの力のモーメントのつり合い（(1)）',
          m: [R`30 \times 0.20 = W \times 0.50`,
              R`W = \frac{30 \times 0.20}{0.50} = 12\,\mathrm{N}`],
          n: R`棒が回転しないので、左回りのモーメントと右回りのモーメントが等しくなります。支点の力 $N$ は O を通るので、うでの長さ $0$ でモーメントに入りません。`,
          easy: R`シーソーと同じです。支点から近い（$0.20\,\mathrm{m}$）左側には大きな力 $30\,\mathrm{N}$、支点から遠い（$0.50\,\mathrm{m}$）右側には小さな力 $W$ でつり合います。「力 × 支点からの距離」が、左右で等しくなればよいのです。左は $30 \times 0.20 = 6.0$、右も $W \times 0.50 = 6.0$ になるので $W = 12\,\mathrm{N}$ です。`,
          pro: R`回転軸を「未知の力が通る点」にとると、未知数が式から消えて 1 本の式で解けます。` },
        { t: '力のつり合い（上下方向）（(2)）',
          m: [R`N = 30 + W = 30 + 12 = 42\,\mathrm{N}`],
          n: R`棒は動かないので、上向きの力 $N$ と下向きの力の合計 $30 + W$ がつり合います。`,
          easy: R`棒は上にも下にも動きません。棒を下へ引く力は合わせて $30 + 12 = 42\,\mathrm{N}$ なので、それを支える支点が上向きに $42\,\mathrm{N}$ で押し返していることになります。「回らない」ためのモーメントのつり合いと、「動かない」ための力のつり合いは別の条件で、両方が成り立っています。` }
      ],
      tags: ['てこ', 'モーメントのつり合い']
    },

    {
      id: 'd-p-rigid-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-rigid',
      title: '一様な棒をつるす力',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`長さ $2.0\,\mathrm{m}$、質量 $4.0\,\mathrm{kg}$ の一様な棒の両端 A, B を、軽い糸で鉛直につるして水平にした。さらに、A から $0.50\,\mathrm{m}$ の位置に質量 $2.0\,\mathrm{kg}$ のおもりをつるした。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、糸 A, B の張力をそれぞれ $T_{\mathrm{A}},\ T_{\mathrm{B}}$ とする。`,
      fig: figBarStrings(),
      parts: [
        { label: '(1)', q: R`糸 B の張力 $T_{\mathrm{B}}$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 24.5, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`糸 A の張力 $T_{\mathrm{A}}$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 34.3, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: '棒にはたらく力と、その作用点を整理する',
          m: [R`\text{棒の重力: } 4.0 \times 9.8 = 39.2\,\mathrm{N}\quad(\text{重心は中央、A から } 1.0\,\mathrm{m})`,
              R`\text{おもりが引く力: } 2.0 \times 9.8 = 19.6\,\mathrm{N}\quad(\text{A から } 0.50\,\mathrm{m})`],
          n: R`一様な棒の重力は、重心（中央）に集中してはたらくとみなせます。棒には、この 2 つの下向きの力と、糸の張力 $T_{\mathrm{A}},\ T_{\mathrm{B}}$（上向き）がはたらきます。`,
          easy: R`太さが一様な棒の重さは、棒全体に広がっていますが、「ちょうど真ん中の 1 点にまとめてはたらく」と考えて計算できます。この点を重心といいます。おもりはつるした位置で棒を引きます。力と位置を図に書き込むのが、剛体の問題の第一歩です。`,
          lv: 2 },
        { t: '点 A のまわりの力のモーメントのつり合い（(1)）',
          m: [R`T_{\mathrm{B}} \times 2.0 = 39.2 \times 1.0 + 19.6 \times 0.50`,
              R`T_{\mathrm{B}} = \frac{39.2 + 9.8}{2.0} = 24.5\,\mathrm{N}`],
          n: R`回転軸を A にとると、$T_{\mathrm{A}}$ は A を通るのでモーメントに入りません。$T_{\mathrm{B}}$ は棒を A のまわりに左回り（反時計回り）に回そうとし、棒とおもりの重力は右回り（時計回り）に回そうとします。この 2 つのモーメントがつり合います。`,
          easy: R`「A のまわりに回ろうとする効果」を比べます。糸 B が上へ引く力は A を中心に左回りに回そうとし、棒の重さとおもりの重さは右回りに回そうとします。A から遠い B を引く $T_{\mathrm{B}}$ は、うでの長さが $2.0\,\mathrm{m}$ なので小さな力でも効きます。うでの長さが $0$ の $T_{\mathrm{A}}$ は式に出てこないので、1 本の式で $T_{\mathrm{B}}$ が求められます。`,
          pro: R`未知の力が 2 つあるときは、片方が通る点を回転軸にして 1 つずつ消す。` },
        { t: '上下方向の力のつり合い（(2)）',
          m: [R`T_{\mathrm{A}} + T_{\mathrm{B}} = 39.2 + 19.6 = 58.8`,
              R`T_{\mathrm{A}} = 58.8 - 24.5 = 34.3\,\mathrm{N}`],
          n: R`棒は動かないので、上向きの力の合計と下向きの力の合計が等しくなります。確かめとして B のまわりのモーメント $T_{\mathrm{A}} \times 2.0 = 39.2 \times 1.0 + 19.6 \times 1.5 = 68.6$ から $T_{\mathrm{A}} = 34.3\,\mathrm{N}$ と求めても一致します。`,
          easy: R`2 本の糸が支える力の合計は、棒とおもりの重さの合計 $58.8\,\mathrm{N}$ に等しくなります。このうち B 側が $24.5\,\mathrm{N}$ を受け持つので、残りの $34.3\,\mathrm{N}$ を A 側が受け持ちます。おもりが A に近いぶん、A のほうが多くの重さを支えるのは感覚とも合っています。` }
      ],
      tags: ['剛体', '重心', 'モーメント']
    },

    /* ---------- 運動方程式（p-eom） ---------- */
    {
      id: 'd-p-eom-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-eom',
      title: '運動方程式の基本',
      source: { univ: 'オリジナル' },
      time: 2,
      body: R`なめらかな水平面上に置いた質量 $3.0\,\mathrm{kg}$ の物体を、水平右向きに $12\,\mathrm{N}$ の一定の力で引く。物体は静止の状態から動き出した。`,
      fig: figPullSmooth(),
      parts: [
        { label: '(1)', q: R`物体の加速度の大きさ $a$ は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 4, rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`力を加え始めてから $5.0\,\mathrm{s}$ 後の物体の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 20, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        { t: '運動方程式 $ma = F$ を立てる（(1)）',
          m: [R`ma = F`,
              R`a = \frac{F}{m} = \frac{12}{3.0} = 4.0\,\mathrm{m/s^{2}}`],
          n: R`鉛直方向の重力と垂直抗力はつり合うので、水平方向にはたらく力は $12\,\mathrm{N}$ だけです。この力を向きも含めて合計したものを $F$ とすると、質量 $m$、加速度 $a$ の間に $ma = F$ が成り立ちます。`,
          easy: R`「力が大きいほど物体は大きく加速し、質量が大きいほど加速しにくい」という経験を式にしたものが運動方程式 $ma = F$ です。同じ $12\,\mathrm{N}$ で引いても、軽い物体ほど速く加速します。$3.0\,\mathrm{kg}$ の物体は、$12 \div 3.0 = 4.0\,\mathrm{m/s^{2}}$ で加速します。`,
          pro: R`手順は「物体を決める → 力を全部書く → 運動の向きを正にして $ma = (\text{力の和})$」。この 3 段階を毎回そろえます。` },
        { t: '等加速度運動の式で速さを求める（(2)）',
          m: [R`v = v_{0} + at = 0 + 4.0 \times 5.0 = 20\,\mathrm{m/s}`],
          n: R`加速度が一定なので、等加速度直線運動の式が使えます。静止の状態から始めているので $v_{0} = 0$ です。`,
          easy: R`運動方程式で求めた加速度 $4.0\,\mathrm{m/s^{2}}$ は「1 秒ごとに速さが $4.0\,\mathrm{m/s}$ ずつ増える」という意味です。$5.0$ 秒間では $4.0 \times 5.0 = 20\,\mathrm{m/s}$ だけ速くなります。運動方程式で加速度を出し、それを等加速度運動の式につなぐのが力学の基本の流れです。` }
      ],
      tags: ['運動方程式', '加速度']
    },

    {
      id: 'd-p-eom-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-eom',
      title: '動摩擦力がはたらく運動',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`あらい水平面上に置いた質量 $5.0\,\mathrm{kg}$ の物体を、水平右向きに $30\,\mathrm{N}$ の力で引いたところ、物体は右向きにすべり出した。物体と面の間の動摩擦係数を $0.20$、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figPullRough(),
      parts: [
        { label: '(1)', q: R`物体にはたらく動摩擦力の大きさ $f'$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 9.8, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`物体の加速度の大きさ $a$ は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 4.04, rel: 0.02, unit: 'm/s²' }
      ],
      solution: [
        { t: '鉛直方向のつり合いから垂直抗力を求める',
          m: [R`N - mg = 0 \;\Rightarrow\; N = mg = 5.0 \times 9.8 = 49\,\mathrm{N}`],
          n: R`物体は鉛直方向には動かないので、上向きの垂直抗力 $N$ と下向きの重力 $mg$ がつり合っています。`,
          easy: R`動摩擦力の大きさは、面が物体を押し返す力（垂直抗力 $N$）に比例します。そこでまず $N$ を求めます。この物体は上下には動かないので、面が押し上げる力 $N$ と重力 $mg$ がちょうど同じ大きさです。`,
          lv: 2 },
        { t: R`動摩擦力 $f' = \mu' N$ を求める（(1)）`,
          m: [R`f' = \mu' N = 0.20 \times 49 = 9.8\,\mathrm{N}`],
          n: R`すべっている物体には、運動と逆向き（左向き）に動摩擦力がはたらきます。大きさは動摩擦係数 $\mu'$ と垂直抗力 $N$ の積です。`,
          easy: R`すべっている物体には、すべりを妨げる向きに摩擦力がはたらきます。面を強く押しつけるほど、面がざらざらしているほど、摩擦力は大きくなります。その大きさを「$\mu'$（面のざらざらの度合い）× $N$（押しつける力）」で表します。`,
          pro: R`$f' = \mu' mg$ と一気に書くと、$N$ を別に求める手間が省けます（水平面で上下の力が重力と垂直抗力だけのとき）。` },
        { t: '水平方向の運動方程式を立てる（(2)）',
          m: [R`ma = F - f'`,
              R`a = \frac{30 - 9.8}{5.0} = \frac{20.2}{5.0} = 4.04\,\mathrm{m/s^{2}}`],
          n: R`運動の向き（右向き）を正にします。右向きの力は $F = 30\,\mathrm{N}$、左向きの力は動摩擦力 $f' = 9.8\,\mathrm{N}$ なので、合力は $30 - 9.8 = 20.2\,\mathrm{N}$ です。`,
          easy: R`物体を右へ動かす力は $30\,\mathrm{N}$ ですが、摩擦力が左へ $9.8\,\mathrm{N}$ だけ引き戻しています。差し引きの力（合力）は $30 - 9.8 = 20.2\,\mathrm{N}$。これを質量 $5.0\,\mathrm{kg}$ で割ると、加速度が $4.04\,\mathrm{m/s^{2}}$ と求まります。摩擦がなければ $30 \div 5.0 = 6.0\,\mathrm{m/s^{2}}$ ですから、それより小さくなるのは納得できます。` }
      ],
      tags: ['運動方程式', '動摩擦力']
    },

    {
      id: 'd-p-eom-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-eom',
      title: '滑車でつながれた 2 物体',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`図のように、なめらかな水平な机の上の物体 A（質量 $3.0\,\mathrm{kg}$）と、滑車を通して軽い糸でつないだ物体 B（質量 $2.0\,\mathrm{kg}$）を静かに放した。糸と滑車の質量、滑車の摩擦は無視でき、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figTablePulley(),
      parts: [
        { label: '(1)', q: R`物体の加速度の大きさ $a$ は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 3.92, rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`糸が引く力（張力）$T$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 11.76, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: 'A と B のそれぞれについて運動方程式を立てる',
          m: [R`\text{A（右向きを正）: } 3.0\,a = T`,
              R`\text{B（下向きを正）: } 2.0\,a = 2.0 \times 9.8 - T`],
          n: R`糸でつながれた 2 つの物体は、同じ大きさの加速度 $a$ で動きます。糸の張力 $T$ も、軽い糸なので A にも B にも同じ大きさではたらきます。A の水平方向の力は $T$ だけ、B の鉛直方向の力は重力 $2.0 \times 9.8$（下向き）と $T$（上向き）です。`,
          easy: R`A は糸に右へ引かれて動き、B は重力で下へ動きます。糸がピンと張っている間は、A が右へ $1\,\mathrm{m}$ 動けば B も下へ $1\,\mathrm{m}$ 動くので、2 つの物体の加速度の大きさは同じです。物体ごとに「質量 × 加速度 ＝ 力の合計」を書きます。向きは、それぞれの物体が動く向きを正にするのがコツです。`,
          pro: R`糸でつながった物体は「全体を 1 つとみなす」と速い: $(3.0 + 2.0)\,a = 2.0 \times 9.8$。張力はあとで 1 つの物体から求めます。` },
        { t: '2 つの式を足して $T$ を消去し、$a$ を求める（(1)）',
          m: [R`(3.0 + 2.0)\,a = 2.0 \times 9.8`,
              R`a = \frac{19.6}{5.0} = 3.92\,\mathrm{m/s^{2}}`],
          n: R`2 つの式の左辺どうし、右辺どうしを足すと、$T$ が打ち消し合います。`,
          easy: R`A の式 $3.0\,a = T$ と B の式 $2.0\,a = 19.6 - T$ を足すと、右辺の $T$ と $-T$ が消えて $5.0\,a = 19.6$ になります。つまり「動かす力（B の重さ $19.6\,\mathrm{N}$）を、動かされる物体の質量の合計 $5.0\,\mathrm{kg}$ で割る」と加速度が出るのです。` },
        { t: '$a$ を代入して張力を求める（(2)）',
          m: [R`T = 3.0\,a = 3.0 \times 3.92 = 11.76\,\mathrm{N}`],
          n: R`B の式で確かめると $T = 2.0 \times 9.8 - 2.0 \times 3.92 = 19.6 - 7.84 = 11.76\,\mathrm{N}$ で一致します。張力 $11.76\,\mathrm{N}$ は B の重さ $19.6\,\mathrm{N}$ より小さくなっています。`,
          easy: R`A の式にそのまま $a = 3.92$ を代入するだけです。B が自由落下するなら糸の張力は $0$、B が静止しているなら張力は B の重さと同じ $19.6\,\mathrm{N}$ です。今は動きながら加速しているので、その中間の $11.76\,\mathrm{N}$ になります。` }
      ],
      tags: ['運動方程式', '連結体', '張力']
    },

    /* ---------- 運動量と力積（p-momentum） ---------- */
    {
      id: 'd-p-momentum-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-momentum',
      title: '運動量の変化と力積',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`質量 $0.50\,\mathrm{kg}$ のボールが、$8.0\,\mathrm{m/s}$ の速さで壁に垂直に衝突し、同じ直線上を $6.0\,\mathrm{m/s}$ の速さではね返った。ボールが壁に接していた時間は $0.010\,\mathrm{s}$ であった。`,
      fig: figWallBounce(),
      parts: [
        { label: '(1)', q: R`壁がボールに与えた力積の大きさは何 $\mathrm{N \cdot s}$ か。`, type: 'num', answer: 7, rel: 0.02, unit: 'N·s' },
        { label: '(2)', q: R`壁がボールに及ぼした平均の力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 700, rel: 0.02, unit: 'N', show: R`7.0 \times 10^{2}`, hint: R`例: 1.5e3 や 1500` }
      ],
      solution: [
        { t: '衝突の前後の運動量を、向きを決めて計算する',
          m: [R`p = mv`,
              R`p_{\text{前}} = 0.50 \times 8.0 = 4.0\,\mathrm{kg \cdot m/s}`,
              R`p_{\text{後}} = 0.50 \times (-6.0) = -3.0\,\mathrm{kg \cdot m/s}`],
          n: R`運動量 $p = mv$ は向きをもつ量です。壁に向かう向きを正とすると、はね返ったあとの速度は $-6.0\,\mathrm{m/s}$ です。`,
          easy: R`運動量は「質量 × 速度」で、動きの勢いを表します。速度と同じように向きがあるので、「壁に向かう向きを正」と決めたら、はね返った後（壁から離れる向き）は負の値にします。このとき「速さ」ではなく「速度（向きつき）」を使うことが大切です。`,
          pro: R`向きを最初に決めて、はね返りは $-$ をつける。この符号ミスが最頻出です。` },
        { t: '力積 = 運動量の変化（(1)）',
          m: [R`I = p_{\text{後}} - p_{\text{前}} = -3.0 - 4.0 = -7.0\,\mathrm{N \cdot s}`,
              R`|I| = 7.0\,\mathrm{N \cdot s}`],
          n: R`力積 $I$ は運動量の変化に等しい（$mv' - mv = I$）。負の符号は、壁から離れる向きの力積であることを表します。`,
          easy: R`力積とは「力 × 力がはたらいた時間」のことで、物体の運動量をどれだけ変えたかを表します。ボールの運動量は $+4.0$ から $-3.0$ へ変わったので、差は $-3.0 - 4.0 = -7.0$ です。向きが反転したぶん、変化は初めの運動量 $4.0$ よりも大きくなります。` },
        { t: R`力積 $= F\Delta t$ から平均の力を求める（(2)）`,
          m: [R`F\Delta t = 7.0 \;\Rightarrow\; F = \frac{7.0}{0.010} = 700\,\mathrm{N}`],
          n: R`接触時間 $\Delta t$ の間にはたらいた力は一定ではありませんが、平均の力 $F$ と時間 $\Delta t$ の積が力積になります。`,
          easy: R`力積 $7.0\,\mathrm{N \cdot s}$ を、たった $0.010$ 秒（100 分の 1 秒）の間に与えたので、平均の力は $7.0 \div 0.010 = 700\,\mathrm{N}$ と大きくなります。同じ力積でも、時間を長くするほど必要な力は小さくてすみます（ボールを受けるとき、手を引いて衝撃をやわらげるのはこのためです）。` }
      ],
      tags: ['運動量', '力積', '反発']
    },

    {
      id: 'd-p-momentum-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-momentum',
      title: '運動量保存（合体）',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`なめらかな水平面上で、質量 $2.0\,\mathrm{kg}$ の物体 A が速さ $3.0\,\mathrm{m/s}$ で進み、静止していた質量 $1.0\,\mathrm{kg}$ の物体 B に衝突して、A と B は一体となって動いた。`,
      fig: figMergeCollision(),
      parts: [
        { label: '(1)', q: R`衝突後の速さ $v$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 2, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`衝突によって失われた力学的エネルギーは何 $\mathrm{J}$ か。`, type: 'num', answer: 3, rel: 0.02, unit: 'J' }
      ],
      solution: [
        { t: '運動量保存の法則を使う（(1)）',
          m: [R`m_{\mathrm{A}}v_{\mathrm{A}} + m_{\mathrm{B}}v_{\mathrm{B}} = (m_{\mathrm{A}} + m_{\mathrm{B}})\,v`,
              R`2.0 \times 3.0 + 1.0 \times 0 = (2.0 + 1.0)\,v \;\Rightarrow\; v = 2.0\,\mathrm{m/s}`],
          n: R`衝突のとき A と B が互いに及ぼし合う力（内力）は、大きさが等しく向きが逆なので、2 つの物体の運動量の和は衝突の前後で変わりません。水平面がなめらかなので、水平方向に外力もはたらきません。`,
          easy: R`ぶつかる前の「勢い（運動量）」の合計は、ぶつかった後も変わりません。A が $2.0 \times 3.0 = 6.0$、静止している B が $0$ なので、合計 $6.0$ です。一体になった質量 $3.0\,\mathrm{kg}$ の物体が同じ勢い $6.0$ をもつので、速さは $6.0 \div 3.0 = 2.0\,\mathrm{m/s}$ です。`,
          pro: R`衝突の問題は、まず「運動量保存」を立てる。反発係数が与えられたら 2 本目の式として使います。` },
        { t: '衝突の前後の運動エネルギーを比べる（(2)）',
          m: [R`K_{\text{前}} = \frac{1}{2} \times 2.0 \times 3.0^{2} = 9.0\,\mathrm{J}`,
              R`K_{\text{後}} = \frac{1}{2} \times 3.0 \times 2.0^{2} = 6.0\,\mathrm{J}`,
              R`K_{\text{前}} - K_{\text{後}} = 3.0\,\mathrm{J}`],
          n: R`水平面上の運動なので、位置エネルギーは変化せず、力学的エネルギーの変化は運動エネルギーの変化に等しくなります。一体となる衝突（完全非弾性衝突）では、エネルギーの一部が熱や変形のために失われます。`,
          easy: R`衝突の前後で運動量の合計は変わりませんが、運動エネルギーは変わります。ぶつかった物体どうしがくっつくと、一部のエネルギーは熱や音、物体の変形に使われてしまうからです。前の $9.0\,\mathrm{J}$ から後の $6.0\,\mathrm{J}$ を引いた $3.0\,\mathrm{J}$ が失われたエネルギーです。` }
      ],
      tags: ['運動量保存', '完全非弾性衝突']
    },

    {
      id: 'd-p-momentum-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-momentum',
      title: '反発係数と衝突',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`なめらかな水平面上で、質量 $1.0\,\mathrm{kg}$ の物体 A が速さ $4.0\,\mathrm{m/s}$ で進み、静止していた質量 $3.0\,\mathrm{kg}$ の物体 B に正面衝突した。A と B の間の反発係数（はね返り係数）は $0.50$ である。A の進む向きを正とし、衝突後の A, B の速度をそれぞれ $v_{\mathrm{A}}',\ v_{\mathrm{B}}'$ とする。`,
      fig: figElasticCollision(),
      parts: [
        { label: '(1)', q: R`衝突後の B の速度 $v_{\mathrm{B}}'$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 1.5, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`衝突後の A の速度 $v_{\mathrm{A}}'$ は何 $\mathrm{m/s}$ か。（向きが負ならば負の値で答えよ）`, type: 'num', answer: -0.5, rel: 0.02, unit: 'm/s', hint: R`例: 0.4 や -0.6（負の向きは「−」をつける）` }
      ],
      solution: [
        { t: '運動量保存の式を立てる',
          m: [R`m_{\mathrm{A}}v_{\mathrm{A}} + m_{\mathrm{B}}v_{\mathrm{B}} = m_{\mathrm{A}}v_{\mathrm{A}}' + m_{\mathrm{B}}v_{\mathrm{B}}'`,
              R`1.0 \times 4.0 + 3.0 \times 0 = 1.0\,v_{\mathrm{A}}' + 3.0\,v_{\mathrm{B}}'`,
              R`4.0 = v_{\mathrm{A}}' + 3.0\,v_{\mathrm{B}}' \quad \cdots (\text{i})`],
          n: R`衝突の前後で、A と B の運動量の和は変わりません。式の中の速度は、向きを含めた値（右向きが正）で書きます。`,
          easy: R`未知数が 2 つ（$v_{\mathrm{A}}'$ と $v_{\mathrm{B}}'$）あるので、式も 2 本必要です。1 本目は、いつでも使える「運動量保存」です。衝突前の運動量は A の $1.0 \times 4.0 = 4.0$ だけ、衝突後は A と B の運動量の合計です。` },
        { t: '反発係数の式を立てる',
          m: [R`e = -\frac{v_{\mathrm{A}}' - v_{\mathrm{B}}'}{v_{\mathrm{A}} - v_{\mathrm{B}}}`,
              R`0.50 = -\frac{v_{\mathrm{A}}' - v_{\mathrm{B}}'}{4.0 - 0} \;\Rightarrow\; v_{\mathrm{B}}' - v_{\mathrm{A}}' = 2.0 \quad \cdots (\text{ii})`],
          n: R`反発係数 $e$ は「近づく速さ」に対する「遠ざかる速さ」の比です。衝突前に近づく速さは $4.0 - 0 = 4.0$、衝突後に遠ざかる速さは $v_{\mathrm{B}}' - v_{\mathrm{A}}'$ です。`,
          easy: R`反発係数は、ボールを床に落としたときのはね返り具合のようなものです。$e = 1$ ならまったく勢いを失わずにはね返り、$e = 0$ ならくっついて離れません。「離れる速さ ÷ 近づく速さ」$= 2.0 \div 4.0 = 0.50$ という関係を式にしたのが (ii) です。`,
          pro: R`$e = \dfrac{\text{離れる速さ}}{\text{近づく速さ}}$ と言葉で覚えると、符号を間違えません。` },
        { t: '連立方程式を解く（(1)(2)）',
          m: [R`\text{(ii) より } v_{\mathrm{B}}' = v_{\mathrm{A}}' + 2.0`,
              R`\text{(i) に代入: } 4.0 = v_{\mathrm{A}}' + 3.0\,(v_{\mathrm{A}}' + 2.0) \;\Rightarrow\; 4.0\,v_{\mathrm{A}}' = -2.0`,
              R`v_{\mathrm{A}}' = -0.50\,\mathrm{m/s}, \qquad v_{\mathrm{B}}' = 1.5\,\mathrm{m/s}`],
          n: R`$v_{\mathrm{A}}'$ が負なので、A は衝突後にはね返って、逆向き（左向き）に $0.50\,\mathrm{m/s}$ で動きます。確かめ: 運動量の和 $1.0 \times (-0.50) + 3.0 \times 1.5 = 4.0$ ✓。`,
          easy: R`軽い A が重い B にぶつかったので、A ははね返って逆向きに動きます。そのため $v_{\mathrm{A}}'$ は負の値になります。負の値が出たら「最初に決めた正の向きと逆向き」という意味です。(ii) から $v_{\mathrm{B}}'$ を $v_{\mathrm{A}}'$ で表して (i) に代入すると、文字が 1 つになって解けます。` }
      ],
      tags: ['反発係数', '運動量保存', '衝突']
    },

    /* ---------- 仕事と力学的エネルギー（p-energy） ---------- */
    {
      id: 'd-p-energy-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-energy',
      title: '仕事と仕事率',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`水平な床の上の物体を、水平から $60\degree$ 上向きの $20\,\mathrm{N}$ の力で引き、床に沿って $3.0\,\mathrm{m}$ 動かした。この移動にかかった時間は $5.0\,\mathrm{s}$ であった。`,
      fig: figWorkAngle(),
      parts: [
        { label: '(1)', q: R`この力が物体にした仕事 $W$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 30, rel: 0.02, unit: 'J' },
        { label: '(2)', q: R`この間の仕事率 $P$ は何 $\mathrm{W}$ か。`, type: 'num', answer: 6, rel: 0.02, unit: 'W' }
      ],
      solution: [
        { t: R`仕事の定義 $W = Fs\cos\theta$ に代入する（(1)）`,
          m: [R`W = Fs\cos\theta`,
              R`W = 20 \times 3.0 \times \cos 60\degree = 20 \times 3.0 \times \frac{1}{2} = 30\,\mathrm{J}`],
          n: R`$\theta$ は力の向きと移動の向きがなす角です。力のうち、移動の向きにはたらく成分 $F\cos\theta$ だけが仕事をします。`,
          easy: R`仕事は「力が物体を動かした大きさ」を表す量で、「力 × 動かした距離」が基本です。ただし、斜めに引く力は、その一部しか「進む向き」に役立ちません。役立つ成分は $20 \times \cos 60\degree = 10\,\mathrm{N}$ だけなので、仕事は $10 \times 3.0 = 30\,\mathrm{J}$ です。上向きの成分（$20 \times \sin 60\degree$）は物体を動かす向きに垂直なので、仕事をしません。`,
          pro: R`$\theta = 90\degree$ なら $W = 0$（力と移動が垂直）、$\theta > 90\degree$ なら負の仕事。向きの確認が先です。` },
        { t: '仕事率 = 仕事 ÷ 時間（(2)）',
          m: [R`P = \frac{W}{t} = \frac{30}{5.0} = 6.0\,\mathrm{W}`],
          n: R`仕事率は、1 秒あたりの仕事です。単位は $\mathrm{W} = \mathrm{J/s}$（ワット）です。`,
          easy: R`同じ仕事でも、短い時間でやるほど「仕事率が大きい（力持ち）」といえます。$30\,\mathrm{J}$ の仕事を $5.0$ 秒でしたので、1 秒あたりでは $30 \div 5.0 = 6.0\,\mathrm{J}$、つまり $6.0\,\mathrm{W}$ です。` }
      ],
      tags: ['仕事', '仕事率', 'cosθ']
    },

    {
      id: 'd-p-energy-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-energy',
      title: '運動エネルギーと仕事',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`質量 $2.0\,\mathrm{kg}$ の物体が、なめらかな水平面上を速さ $6.0\,\mathrm{m/s}$ で進んでいる。`,
      fig: figKineticWork(),
      parts: [
        { label: '(1)', q: R`この物体の運動エネルギー $K$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 36, rel: 0.02, unit: 'J' },
        { label: '(2)', q: R`この物体に水平方向の力で仕事をして、速さを $10\,\mathrm{m/s}$ にした。力がした仕事 $W$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 64, rel: 0.02, unit: 'J' }
      ],
      solution: [
        { t: R`運動エネルギーの式 $K = \dfrac{1}{2}mv^{2}$（(1)）`,
          m: [R`K = \frac{1}{2}mv^{2} = \frac{1}{2} \times 2.0 \times 6.0^{2} = 36\,\mathrm{J}`],
          n: R`運動エネルギーは、運動している物体がもつエネルギーで、質量に比例し、速さの 2 乗に比例します。`,
          easy: R`同じ物体でも、速いほど（またぶつかったときの衝撃も）大きくなります。その大きさを表すのが運動エネルギーで、速さを 2 倍にするとエネルギーは 4 倍になります。ここでは $\dfrac{1}{2} \times 2.0 \times 36 = 36\,\mathrm{J}$ です。` },
        { t: '仕事と運動エネルギーの関係（(2)）',
          m: [R`W = \Delta K = \frac{1}{2}mv_{2}^{2} - \frac{1}{2}mv_{1}^{2}`,
              R`W = \frac{1}{2} \times 2.0 \times 10^{2} - 36 = 100 - 36 = 64\,\mathrm{J}`],
          n: R`物体が外から受けた仕事は、物体の運動エネルギーの増加分に等しくなります。なめらかな水平面なので、仕事をするのは加えた力だけです。`,
          easy: R`物体を加速するには、力を加えて動かす（仕事をする）必要があります。その仕事の分だけ、運動エネルギーが増えます。増えた量は「あと」の $100\,\mathrm{J}$ から「前」の $36\,\mathrm{J}$ を引いた $64\,\mathrm{J}$ で、これが力のした仕事です。速さは約 $1.7$ 倍ですが、エネルギーは約 $2.8$ 倍になっています。`,
          pro: R`「仕事 ＝ 運動エネルギーの変化」は、力や時間が分からなくても使えます。摩擦などがあれば、それらの仕事も合計に入れます。` }
      ],
      tags: ['運動エネルギー', '仕事とエネルギー']
    },

    {
      id: 'd-p-energy-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-energy',
      title: '力学的エネルギー保存',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、なめらかな曲面の高さ $5.0\,\mathrm{m}$ の点 A から、小物体を静かにすべらせた。最下点 C の高さを $0$ とし、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figCurveTrack(),
      parts: [
        { label: '(1)', q: R`最下点 C を通るときの速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 9.9, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`高さ $2.0\,\mathrm{m}$ の点 B を通るときの速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 7.67, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        { t: '力学的エネルギー保存則を使えるか確かめる',
          n: R`小物体にはたらく力は、重力と曲面からの垂直抗力です。垂直抗力は運動の向き（曲面に沿った向き）と常に垂直なので仕事をしません。摩擦もないので、保存力（重力）以外の仕事が $0$ となり、力学的エネルギー（運動エネルギー + 位置エネルギー）が保存されます。`,
          easy: R`「なめらかな曲面」とは摩擦がないという意味です。曲面が物体を押す力（垂直抗力）は、物体の進む向きに対していつも直角なので、物体の速さを変えません。だから、位置エネルギーが減ったぶんだけ、運動エネルギーが増えます（エネルギーの総量は変わりません）。`,
          lv: 2 },
        { t: '点 A と点 C でエネルギー保存の式を立てる（(1)）',
          m: [R`mgh_{\mathrm{A}} + 0 = 0 + \frac{1}{2}mv_{\mathrm{C}}^{2}`,
              R`v_{\mathrm{C}} = \sqrt{2gh_{\mathrm{A}}} = \sqrt{2 \times 9.8 \times 5.0} = \sqrt{98} \fallingdotseq 9.9\,\mathrm{m/s}`],
          n: R`A では静止しているので運動エネルギー $0$、C では高さ $0$ なので位置エネルギー $0$ です。質量 $m$ は両辺で消えるので、速さは質量によりません。`,
          easy: R`高いところの物体は「落ちる力」をためこんでいます（位置エネルギー $mgh$）。下りてくると、ためこんだエネルギーが速さ（運動エネルギー $\dfrac{1}{2}mv^{2}$）に変わります。式の両辺に $m$ があるので消去でき、$gh = \dfrac{1}{2}v^{2}$ から $v = \sqrt{2gh}$ となります。`,
          pro: R`$v = \sqrt{2gh}$ は自由落下と同じ式。曲面の形に関係なく「落ちた高さ」だけで決まります。` },
        { t: '点 A と点 B でエネルギー保存の式を立てる（(2)）',
          m: [R`mgh_{\mathrm{A}} = mgh_{\mathrm{B}} + \frac{1}{2}mv_{\mathrm{B}}^{2}`,
              R`v_{\mathrm{B}} = \sqrt{2g(h_{\mathrm{A}} - h_{\mathrm{B}})} = \sqrt{2 \times 9.8 \times 3.0} = \sqrt{58.8} \fallingdotseq 7.7\,\mathrm{m/s}`],
          n: R`点 B では位置エネルギーが残っているので、A から B までに下がった高さ $h_{\mathrm{A}} - h_{\mathrm{B}} = 3.0\,\mathrm{m}$ のぶんだけが運動エネルギーになります。`,
          easy: R`B までの間に下りた高さは $5.0 - 2.0 = 3.0\,\mathrm{m}$ です。位置エネルギーは「下りた高さのぶんだけ」運動エネルギーに変わります。だから、$3.0\,\mathrm{m}$ 自由落下したときと同じ速さ $\sqrt{2 \times 9.8 \times 3.0} \fallingdotseq 7.7\,\mathrm{m/s}$ になります。` }
      ],
      tags: ['力学的エネルギー保存', '位置エネルギー']
    },

    /* ---------- 円運動（p-circular） ---------- */
    {
      id: 'd-p-circular-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-circular',
      title: '角速度と速さ',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`半径 $0.50\,\mathrm{m}$ の円周上を、小球が周期 $2.0\,\mathrm{s}$ で等速円運動している。円周率を $\pi = 3.14$ とする。`,
      fig: figCircleMotion('r = 0.50 m', 'v', '周期 T = 2.0 s'),
      parts: [
        { label: '(1)', q: R`小球の角速度 $\omega$ は何 $\mathrm{rad/s}$ か。`, type: 'num', answer: 3.14, rel: 0.02, unit: 'rad/s' },
        { label: '(2)', q: R`小球の速さ $v$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 1.57, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        { t: R`角速度 $\omega = \dfrac{2\pi}{T}$ を求める（(1)）`,
          m: [R`\omega = \frac{2\pi}{T} = \frac{2 \times 3.14}{2.0} = 3.14\,\mathrm{rad/s}`],
          n: R`1 周は $2\pi\,\mathrm{rad}$（約 $6.28\,\mathrm{rad}$）の回転です。周期 $T$ で 1 周するので、角速度は $\dfrac{2\pi}{T}$ です。`,
          easy: R`角速度は「1 秒間に回る角度」です。角度は、半径と同じ長さの弧に対する角を $1\,\mathrm{rad}$（ラジアン）とする単位で表し、円 1 周は $2\pi \fallingdotseq 6.28\,\mathrm{rad}$ です。$2.0$ 秒で 1 周するので、1 秒あたりでは $6.28 \div 2.0 = 3.14\,\mathrm{rad}$ だけ回ります。` },
        { t: R`速さ $v = r\omega$ を求める（(2)）`,
          m: [R`v = r\omega = 0.50 \times 3.14 = 1.57\,\mathrm{m/s}`],
          n: R`別解: 円周の長さ $2\pi r = 3.14\,\mathrm{m}$ を周期 $2.0\,\mathrm{s}$ で進むので、$v = \dfrac{2\pi r}{T} = \dfrac{3.14}{2.0} = 1.57\,\mathrm{m/s}$ です。`,
          easy: R`速さは「1 秒間に進む道のり」です。1 周 $2\pi r = 2 \times 3.14 \times 0.50 = 3.14\,\mathrm{m}$ を $2.0$ 秒で進むので、$3.14 \div 2.0 = 1.57\,\mathrm{m/s}$ です。同じ角速度でも、半径が大きい（円の外側）ほど速さは大きくなります。` }
      ],
      tags: ['等速円運動', '角速度', '周期']
    },

    {
      id: 'd-p-circular-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-circular',
      title: '向心加速度と向心力',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`質量 $0.20\,\mathrm{kg}$ の小球が、半径 $0.50\,\mathrm{m}$ の円周上を速さ $4.0\,\mathrm{m/s}$ で等速円運動している。`,
      fig: figCircleForce(),
      parts: [
        { label: '(1)', q: R`小球の加速度（向心加速度）の大きさ $a$ は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 32, rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`小球にはたらく向心力の大きさ $F$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 6.4, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: R`向心加速度 $a = \dfrac{v^{2}}{r}$（(1)）`,
          m: [R`a = \frac{v^{2}}{r} = \frac{4.0^{2}}{0.50} = \frac{16}{0.50} = 32\,\mathrm{m/s^{2}}`],
          n: R`等速円運動では速さは変わりませんが、速度の向きが常に変わっているので、加速度があります。その加速度は円の中心に向かい、大きさは $\dfrac{v^{2}}{r}$（$= r\omega^{2}$）です。`,
          easy: R`速さが一定でも、進む向きが変わり続ける運動には加速度があります（向きの変化も「速度の変化」だからです）。円運動の加速度は、いつも円の中心を向いているので「向心加速度」とよばれます。速いほど、また半径が小さいほど急に曲がるので、$a = \dfrac{v^{2}}{r}$ は大きくなります。`,
          pro: R`向心加速度は $a = \dfrac{v^{2}}{r} = r\omega^{2} = v\omega$ の 3 通り。与えられた量で選びます。` },
        { t: '運動方程式から向心力を求める（(2)）',
          m: [R`F = ma = 0.20 \times 32 = 6.4\,\mathrm{N}`],
          n: R`円運動の運動方程式は、中心向きの成分について $ma = F$ です。この $F$（中心向きの力の合力）を向心力といいます。`,
          easy: R`向心力は「円の中心に向かう力の合計」のことで、新しい種類の力ではありません。糸の張力、重力、摩擦力、万有引力などが向心力の役目をします。運動方程式 $ma = F$ に $a = 32$ を入れれば、必要な向心力は $0.20 \times 32 = 6.4\,\mathrm{N}$ です。` }
      ],
      tags: ['向心力', '向心加速度']
    },

    {
      id: 'd-p-circular-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-circular',
      title: '最下点での糸の張力',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`長さ $1.0\,\mathrm{m}$ の軽い糸の一端を固定し、他端に質量 $0.50\,\mathrm{kg}$ の小球をつけて鉛直面内で振らせる。小球が最下点を速さ $3.0\,\mathrm{m/s}$ で通過するときについて答えよ。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figPendulumBottom(),
      parts: [
        { label: '(1)', q: R`小球の向心加速度の大きさは何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 9, rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`糸の張力 $T$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 9.4, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: '向心加速度を求める（(1)）',
          m: [R`a = \frac{v^{2}}{r} = \frac{3.0^{2}}{1.0} = 9.0\,\mathrm{m/s^{2}}`],
          n: R`円運動の半径は糸の長さ $L = 1.0\,\mathrm{m}$ です。最下点での向心加速度は、円の中心の向き（真上）を向きます。`,
          easy: R`最下点では、小球は水平方向に速さ $3.0\,\mathrm{m/s}$ で動いています。その瞬間の円の中心は、真上にある糸の固定点です。向心加速度の大きさは $\dfrac{v^{2}}{r}$ で、$9.0 \div 1.0 = 9.0\,\mathrm{m/s^{2}}$ と、重力加速度とほぼ同じ大きさです。` },
        { t: '円の中心向き（上向き）の運動方程式（(2)）',
          m: [R`ma = T - mg`,
              R`T = mg + ma = 0.50 \times 9.8 + 0.50 \times 9.0 = 4.9 + 4.5 = 9.4\,\mathrm{N}`],
          n: R`小球にはたらく力は、糸の張力 $T$（上向き = 中心向き）と重力 $mg$（下向き）です。中心向きを正にして、中心向きの力の合力 $T - mg$ が向心力になります。`,
          easy: R`止まっているだけなら、糸は小球の重さ $4.9\,\mathrm{N}$ だけ支えればよいのですが、小球は円を描いて「上向きに曲がり続けて」います。曲がるためには、上向きの力が重さよりも $ma = 4.5\,\mathrm{N}$ だけ余分に必要です。その分を糸が負担するので、$T = 4.9 + 4.5 = 9.4\,\mathrm{N}$ と重さより大きくなります。`,
          pro: R`最下点は「$T - mg = m\dfrac{v^{2}}{r}$」、最高点は「$T + mg = m\dfrac{v^{2}}{r}$」。中心向きを正にして符号を決めます。` }
      ],
      tags: ['円運動', '張力', '最下点']
    },

    /* ---------- 単振動（p-shm） ---------- */
    {
      id: 'd-p-shm-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-shm',
      title: 'ばね振り子の周期',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`なめらかな水平面上で、ばね定数 $50\,\mathrm{N/m}$ のばねの一端を壁に固定し、他端に質量 $0.50\,\mathrm{kg}$ の物体をつけた。物体を引いて放すと、物体は単振動をした。円周率を $\pi = 3.14$ とする。`,
      fig: figSpringMass(),
      parts: [
        { label: '(1)', q: R`単振動の周期 $T$ は何 $\mathrm{s}$ か。`, type: 'num', answer: 0.628, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`単振動の振動数 $f$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 1.59, rel: 0.02, unit: 'Hz' }
      ],
      solution: [
        { t: 'ばね振り子の周期の公式（(1)）',
          m: [R`T = 2\pi\sqrt{\frac{m}{k}}`,
              R`T = 2 \times 3.14 \times \sqrt{\frac{0.50}{50}} = 2 \times 3.14 \times 0.10 = 0.628\,\mathrm{s}`],
          n: R`ばね振り子の周期は、物体の質量 $m$ とばね定数 $k$ だけで決まり、振幅（どれだけ引いて放したか）にはよりません。`,
          easy: R`周期は「1 往復にかかる時間」です。物体が重いほど動きがゆっくりになり（$m$ が大きいと $T$ が大きい）、ばねが固いほど速く往復します（$k$ が大きいと $T$ が小さい）。$\sqrt{\dfrac{0.50}{50}} = \sqrt{0.010} = 0.10$ なので、$T = 2\pi \times 0.10 = 0.628\,\mathrm{s}$ です。`,
          pro: R`$\omega = \sqrt{\dfrac{k}{m}}$ を先に求めて $T = \dfrac{2\pi}{\omega}$ とすると、最大速度 $A\omega$ などにもそのまま使えます。` },
        { t: '振動数は周期の逆数（(2)）',
          m: [R`f = \frac{1}{T} = \frac{1}{0.628} \fallingdotseq 1.59\,\mathrm{Hz}`],
          n: R`振動数は 1 秒間に往復する回数で、単位は $\mathrm{Hz}$（ヘルツ）です。`,
          easy: R`1 往復に $0.628$ 秒かかるので、1 秒間には $1 \div 0.628 \fallingdotseq 1.59$ 回往復します。この「1 秒あたりの回数」が振動数で、周期とは逆数の関係（$f = \dfrac{1}{T}$）にあります。` }
      ],
      tags: ['単振動', 'ばね振り子', '周期']
    },

    {
      id: 'd-p-shm-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-shm',
      title: '単振動の最大速度・加速度',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`単振動をする物体の変位 $x$ が、図のように $x = 0.10\cos(5.0\,t)$ $[\mathrm{m}]$ で表される。ここで $t$ は時間 $[\mathrm{s}]$ である。`,
      fig: figSHMGraph(),
      parts: [
        { label: '(1)', q: R`物体の最大の速さ $v_{\max}$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 0.5, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`物体の最大の加速度の大きさ $a_{\max}$ は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 2.5, rel: 0.02, unit: 'm/s²' }
      ],
      solution: [
        { t: R`式を $x = A\cos\omega t$ と比べて、振幅と角振動数を読み取る`,
          m: [R`x = A\cos\omega t \quad\Rightarrow\quad A = 0.10\,\mathrm{m},\quad \omega = 5.0\,\mathrm{rad/s}`],
          n: R`$A$ は振幅（中心から端までの距離）、$\omega$ は角振動数で、周期は $T = \dfrac{2\pi}{\omega}$ です。図でも、変位の最大値が $0.10\,\mathrm{m}$ であることが読み取れます。`,
          easy: R`単振動は、円周上を等速円運動する点の「影」の動きと同じです。円の半径が振幅 $A$、円運動の角速度が角振動数 $\omega$ にあたります。与えられた式 $x = 0.10\cos(5.0\,t)$ と見比べると、半径にあたる $A = 0.10\,\mathrm{m}$、角速度にあたる $\omega = 5.0\,\mathrm{rad/s}$ が分かります。` },
        { t: R`最大の速さ $v_{\max} = A\omega$（(1)）`,
          m: [R`v_{\max} = A\omega = 0.10 \times 5.0 = 0.50\,\mathrm{m/s}`],
          n: R`速さが最大になるのは、振動の中心（$x = 0$）を通るときです。円運動の点の速さ $A\omega$ が、影の最大の速さになります。`,
          easy: R`円運動している点の速さは $r\omega = A\omega$ です。その影が、円の真ん中（$x = 0$）を通るときだけ、影の速さは点の速さと等しくなり最大になります。端（$x = \pm A$）では一瞬止まるので、速さは $0$ です。`,
          pro: R`速さは中心で最大 $A\omega$、端で $0$。加速度は端で最大 $A\omega^{2}$、中心で $0$ と、対で覚えます。` },
        { t: R`最大の加速度の大きさ $a_{\max} = A\omega^{2}$（(2)）`,
          m: [R`a_{\max} = A\omega^{2} = 0.10 \times 5.0^{2} = 2.5\,\mathrm{m/s^{2}}`],
          n: R`加速度の大きさが最大になるのは、振動の端（$x = \pm A$）です。単振動では $a = -\omega^{2}x$ なので、$|x| = A$ のとき $|a| = A\omega^{2}$ です。`,
          easy: R`円運動の向心加速度は $r\omega^{2}$ で、中心向きです。その影の加速度は、点が円の端（$x = \pm A$）にあるときに最大になり、大きさは $A\omega^{2} = 0.10 \times 25 = 2.5\,\mathrm{m/s^{2}}$ です。物体が中心から離れているほど、中心へ引き戻す加速度が大きくなる、と覚えましょう。` }
      ],
      tags: ['単振動', '最大速度', '最大加速度']
    },

    {
      id: 'd-p-shm-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-shm',
      title: '単振り子の周期',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`長さ $0.98\,\mathrm{m}$ の軽い糸の先に小さな重りをつけ、小さな振れ角で振らせる（単振り子）。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$、円周率を $\pi = 3.14$ とする。`,
      fig: figSimplePendulum(),
      parts: [
        { label: '(1)', q: R`この単振り子の周期 $T$ は何 $\mathrm{s}$ か。`, type: 'num', answer: 1.99, rel: 0.02, unit: 's' },
        { label: '(2)', q: R`糸の長さを $4$ 倍にすると、周期は何倍になるか。`, type: 'num', answer: 2, rel: 0.02, unit: '倍' }
      ],
      solution: [
        { t: '単振り子の周期の公式（(1)）',
          m: [R`T = 2\pi\sqrt{\frac{l}{g}}`,
              R`T = 2 \times 3.14 \times \sqrt{\frac{0.98}{9.8}} = 6.28 \times 0.316 \fallingdotseq 1.99\,\mathrm{s}`],
          n: R`単振り子の周期は、糸の長さ $l$ と重力加速度 $g$ だけで決まります。おもりの質量や、振れ角が小さい範囲での振れ幅には関係しません。`,
          easy: R`振り子の周期は、「長い糸ほどゆっくり揺れる」「重力が強いほど速く揺れる」という経験に合う式 $T = 2\pi\sqrt{\dfrac{l}{g}}$ で表されます。ブランコの揺れ方が、乗っている人の重さによらないのも同じ理由です。$\sqrt{\dfrac{0.98}{9.8}} = \sqrt{0.10} \fallingdotseq 0.316$ です。`,
          pro: R`周期 $\approx 2\,\mathrm{s}$ の振り子の長さは約 $1\,\mathrm{m}$（$l = \dfrac{gT^{2}}{4\pi^{2}}$）。数値の見当をつけるのに便利です。` },
        { t: R`周期は $\sqrt{l}$ に比例する（(2)）`,
          m: [R`\frac{T'}{T} = \sqrt{\frac{4l}{l}} = \sqrt{4} = 2`],
          n: R`$T = 2\pi\sqrt{\dfrac{l}{g}}$ より、$T$ は $\sqrt{l}$ に比例します。長さを $4$ 倍にすると周期は $\sqrt{4} = 2$ 倍になります。`,
          easy: R`周期は糸の長さにそのまま比例するのではなく、「長さの平方根」に比例します。長さが $4$ 倍になっても、周期は $4$ 倍にはならず $\sqrt{4} = 2$ 倍にしかなりません。同様に、長さを $9$ 倍にすれば周期は $3$ 倍です。` }
      ],
      tags: ['単振り子', '周期']
    },

    /* ---------- 熱量と比熱（p-heat） ---------- */
    {
      id: 'd-p-heat-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-heat',
      title: '熱容量と熱量の計算',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`水の比熱を $4.2\,\mathrm{J/(g \cdot K)}$ とする。質量 $200\,\mathrm{g}$ の水の温度を、$20\degree\mathrm{C}$ から $50\degree\mathrm{C}$ まで上げたい。`,
      fig: figBeakerHeat(),
      parts: [
        { label: '(1)', q: R`水 $200\,\mathrm{g}$ の熱容量 $C$ は何 $\mathrm{J/K}$ か。`, type: 'num', answer: 840, rel: 0.02, unit: 'J/K' },
        { label: '(2)', q: R`必要な熱量 $Q$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 25200, rel: 0.02, unit: 'J', show: R`2.52 \times 10^{4}`, hint: R`例: 1.5e3 や 1500` }
      ],
      solution: [
        { t: '熱容量 $C = mc$ を求める（(1)）',
          m: [R`C = mc = 200 \times 4.2 = 840\,\mathrm{J/K}`],
          n: R`熱容量は、物体全体の温度を $1\,\mathrm{K}$ 上げるのに必要な熱量です。比熱 $c$ は物質 $1\,\mathrm{g}$ あたり、熱容量 $C$ は物体全体あたりの量です。`,
          easy: R`水 $1\,\mathrm{g}$ の温度を $1\,\mathrm{K}$（$1\,\mathrm{^{\circ}C}$）上げるのに必要な熱量が比熱 $4.2\,\mathrm{J/(g \cdot K)}$ です。水が $200\,\mathrm{g}$ あれば、$1\,\mathrm{K}$ 上げるのに $200$ 倍の熱量 $840\,\mathrm{J}$ が必要です。これが水 $200\,\mathrm{g}$ の熱容量です。` },
        { t: R`熱量 $Q = mc\Delta T = C\Delta T$ を求める（(2)）`,
          m: [R`\Delta T = 50 - 20 = 30\,\mathrm{K}`,
              R`Q = C\Delta T = 840 \times 30 = 25200\,\mathrm{J} = 2.52 \times 10^{4}\,\mathrm{J}`],
          n: R`温度の「差」は、セルシウス温度でもケルビンでも同じ値になります（$30\degree\mathrm{C}$ の差 $= 30\,\mathrm{K}$ の差）。`,
          easy: R`$1\,\mathrm{K}$ 上げるのに $840\,\mathrm{J}$ 必要なので、$30\,\mathrm{K}$ 上げるには $30$ 倍の $840 \times 30 = 25200\,\mathrm{J}$ が必要です。「質量 × 比熱 × 温度の上昇」という覚え方で、$Q = mc\Delta T$ と書けます。`,
          pro: R`$Q = mc\Delta T$ の $\Delta T$ は「終わり − 初め」。冷えるときは負になり、熱量も負（放出）になります。` }
      ],
      tags: ['熱量', '比熱', '熱容量']
    },

    {
      id: 'd-p-heat-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-heat',
      title: '水を混ぜたときの温度',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`熱の出入りは水どうしの間だけで起こるものとする。$50\degree\mathrm{C}$ の水 $100\,\mathrm{g}$ と $20\degree\mathrm{C}$ の水 $200\,\mathrm{g}$ を混ぜると、全体が一様な温度 $t$ になった。水の比熱を $4.2\,\mathrm{J/(g \cdot K)}$ とする。`,
      fig: figMixWater(),
      parts: [
        { label: '(1)', q: R`混ぜた後の温度 $t$ は何 $\degree\mathrm{C}$ か。`, type: 'num', answer: 30, rel: 0.02, unit: '°C' },
        { label: '(2)', q: R`高温の水 $100\,\mathrm{g}$ が失った熱量は何 $\mathrm{J}$ か。`, type: 'num', answer: 8400, rel: 0.02, unit: 'J', show: R`8.4 \times 10^{3}`, hint: R`例: 1.5e3 や 1500` }
      ],
      solution: [
        { t: '熱量保存の式を立てる（(1)）',
          m: [R`\text{高温の水が失った熱量} = \text{低温の水が得た熱量}`,
              R`100 \times 4.2 \times (50 - t) = 200 \times 4.2 \times (t - 20)`],
          n: R`熱は高温の物体から低温の物体へ移ります。外へ逃げなければ、高温側が失った熱量と低温側が得た熱量は等しくなります（熱量の保存）。`,
          easy: R`コップのお湯と水を混ぜると、お湯は冷え、水は温まり、やがて同じ温度になります。お湯が失った熱が、そっくり水へ移っただけなので、「失った熱量 ＝ 得た熱量」と書けます。失った熱量は $mc \times (\text{高い温度} - t)$、得た熱量は $mc \times (t - \text{低い温度})$ です。`,
          pro: R`同じ物質どうしなら比熱は両辺で消え、$m_{1}(T_{1} - t) = m_{2}(t - T_{2})$ だけで解けます。` },
        { t: '$t$ について解く（(1)）',
          m: [R`100\,(50 - t) = 200\,(t - 20) \;\Rightarrow\; 50 - t = 2t - 40`,
              R`3t = 90 \;\Rightarrow\; t = 30\degree\mathrm{C}`],
          n: R`確かめ: 質量で重みをつけた平均 $\dfrac{100 \times 50 + 200 \times 20}{300} = 30$ と一致します。水が $200\,\mathrm{g}$ と多い低温側に近い温度になります。`,
          easy: R`両辺の $4.2$ を消して、$100$ で割ると $50 - t = 2(t - 20)$ という簡単な式になります。かっこを開いて $t$ を左辺に集めれば $3t = 90$。水が多い（$200\,\mathrm{g}$）低温側のほうに引っぱられるので、$50\degree\mathrm{C}$ と $20\degree\mathrm{C}$ の真ん中の $35\degree\mathrm{C}$ ではなく、$30\degree\mathrm{C}$ になります。` },
        { t: '失った熱量を計算する（(2)）',
          m: [R`Q = 100 \times 4.2 \times (50 - 30) = 8400\,\mathrm{J} = 8.4 \times 10^{3}\,\mathrm{J}`],
          n: R`低温の水が得た熱量 $200 \times 4.2 \times (30 - 20) = 8400\,\mathrm{J}$ と一致します。`,
          easy: R`高温の水は $50\degree\mathrm{C}$ から $30\degree\mathrm{C}$ まで $20\,\mathrm{K}$ 下がりました。$100\,\mathrm{g}$ の水が $1\,\mathrm{K}$ 下がると $100 \times 4.2 = 420\,\mathrm{J}$ を放出するので、$20\,\mathrm{K}$ では $420 \times 20 = 8400\,\mathrm{J}$ です。` }
      ],
      tags: ['熱量保存', '比熱', '混合']
    },

    {
      id: 'd-p-heat-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-heat',
      title: '融解熱と加熱曲線',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`$0\degree\mathrm{C}$ の氷 $50\,\mathrm{g}$ に熱を加え続け、$20\degree\mathrm{C}$ の水にした。氷の融解熱を $3.3 \times 10^{2}\,\mathrm{J/g}$、水の比熱を $4.2\,\mathrm{J/(g \cdot K)}$ とし、熱は外へ逃げないものとする。`,
      fig: figHeatingCurve(),
      parts: [
        { label: '(1)', q: R`氷が全部 $0\degree\mathrm{C}$ の水になるまでに加えた熱量は何 $\mathrm{J}$ か。`, type: 'num', answer: 16500, rel: 0.02, unit: 'J', show: R`1.65 \times 10^{4}`, hint: R`例: 1.5e3 や 1500` },
        { label: '(2)', q: R`氷を $20\degree\mathrm{C}$ の水にするまでに加えた熱量の合計は何 $\mathrm{J}$ か。`, type: 'num', answer: 20700, rel: 0.02, unit: 'J', show: R`2.07 \times 10^{4}`, hint: R`例: 1.5e3 や 1500` }
      ],
      solution: [
        { t: '融解する間は温度が変わらない（(1)）',
          m: [R`Q_{1} = mL = 50 \times 3.3 \times 10^{2} = 1.65 \times 10^{4}\,\mathrm{J}`],
          n: R`氷がとけて水になる間は、加えた熱はすべて状態変化（融解）に使われ、温度は $0\degree\mathrm{C}$ のまま変わりません。融解熱 $L$ は、物質 $1\,\mathrm{g}$ を融解させるのに必要な熱量です。`,
          easy: R`氷に熱を加えると温度が上がると思いがちですが、氷がとけている間は $0\degree\mathrm{C}$ のまま温度が変わりません。加えた熱は、氷の結晶の結びつきをほどく（水にする）ことに使われるからです。これを融解熱といい、$1\,\mathrm{g}$ あたり $330\,\mathrm{J}$ です。グラフの水平な部分にあたります。` },
        { t: R`水になったあとの温度上昇に必要な熱量を足す（(2)）`,
          m: [R`Q_{2} = mc\Delta T = 50 \times 4.2 \times 20 = 4200\,\mathrm{J}`,
              R`Q = Q_{1} + Q_{2} = 16500 + 4200 = 20700\,\mathrm{J} = 2.07 \times 10^{4}\,\mathrm{J}`],
          n: R`全部が水になったあとは、$Q = mc\Delta T$ で温度が上がっていきます。グラフの右上がりの部分にあたります。`,
          easy: R`氷が全部とけて $0\degree\mathrm{C}$ の水になったら、あとは普通の水の加熱と同じで、$Q = mc\Delta T$ です。$20\,\mathrm{K}$ 上げるのに $50 \times 4.2 \times 20 = 4200\,\mathrm{J}$。最初の $16500\,\mathrm{J}$ と合わせて $20700\,\mathrm{J}$ です。氷をとかすための熱のほうが、水を $20\degree\mathrm{C}$ 温める熱より何倍も大きいことが分かります。` }
      ],
      tags: ['融解熱', '潜熱', '加熱曲線']
    },

    /* ---------- ボイル・シャルルの法則（p-gas） ---------- */
    {
      id: 'd-p-gas-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-gas',
      title: 'ボイルの法則',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`なめらかに動くピストンのついた容器に、気体が入っている。温度を一定に保ったまま、気体を圧力 $1.0 \times 10^{5}\,\mathrm{Pa}$、体積 $6.0\,\mathrm{L}$ の状態から、体積 $2.0\,\mathrm{L}$ まで圧縮した。`,
      fig: figBoyle(),
      parts: [
        { label: '(1)', q: R`圧縮後の圧力は何 $\mathrm{Pa}$ か。`, type: 'num', answer: 300000, rel: 0.02, unit: 'Pa', show: R`3.0 \times 10^{5}`, hint: R`例: 1.5e3 や 1500` },
        { label: '(2)', q: R`もとの状態から、温度を一定のまま圧力を $4.0 \times 10^{5}\,\mathrm{Pa}$ にしたとき、体積は何 $\mathrm{L}$ か。`, type: 'num', answer: 1.5, rel: 0.02, unit: 'L' }
      ],
      solution: [
        { t: 'ボイルの法則 $pV = $ 一定（(1)）',
          m: [R`p_{1}V_{1} = p_{2}V_{2}`,
              R`p_{2} = \frac{p_{1}V_{1}}{V_{2}} = \frac{1.0 \times 10^{5} \times 6.0}{2.0} = 3.0 \times 10^{5}\,\mathrm{Pa}`],
          n: R`温度が一定のとき、一定量の気体の圧力 $p$ と体積 $V$ は反比例します（ボイルの法則）。体積の単位は $\mathrm{L}$ のままで、両辺の単位がそろっていれば換算の必要はありません。`,
          easy: R`注射器の先をふさいで押すと、中の空気が縮んで押し返す力（圧力）が強くなります。温度が同じなら、体積を $\dfrac{1}{3}$ に縮めると、圧力は $3$ 倍になります。この「体積が半分になれば圧力は 2 倍」という反比例の関係が、$pV = $ 一定（グラフでは双曲線）です。`,
          pro: R`$p_{1}V_{1} = p_{2}V_{2}$ は単位が同じなら $\mathrm{L}$ のまま使えます（比の式だから）。圧力・体積の単位をそろえることだけ確認します。` },
        { t: '同じ式を体積について解く（(2)）',
          m: [R`V_{3} = \frac{p_{1}V_{1}}{p_{3}} = \frac{1.0 \times 10^{5} \times 6.0}{4.0 \times 10^{5}} = 1.5\,\mathrm{L}`],
          n: R`圧力が $4.0 \times 10^{5}$ で、もとの $4$ 倍になるので、体積は $\dfrac{1}{4}$ の $1.5\,\mathrm{L}$ になります。`,
          easy: R`圧力が $\dfrac{4.0 \times 10^{5}}{1.0 \times 10^{5}} = 4$ 倍になったので、体積は $\dfrac{1}{4}$ 倍です。$6.0 \div 4 = 1.5\,\mathrm{L}$。グラフの双曲線の上で、点が左上へ動いたことに対応します。` }
      ],
      tags: ['ボイルの法則', '圧力', '体積']
    },

    {
      id: 'd-p-gas-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-gas',
      title: 'シャルルの法則と絶対温度',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`圧力を一定に保ったまま、気体の温度を変える。気体の体積は、$27\degree\mathrm{C}$ のとき $3.0\,\mathrm{L}$ であった。`,
      fig: figCharles(),
      parts: [
        { label: '(1)', q: R`$27\degree\mathrm{C}$ は、絶対温度で何 $\mathrm{K}$ か。`, type: 'num', answer: 300, rel: 0.02, unit: 'K' },
        { label: '(2)', q: R`気体の温度を $87\degree\mathrm{C}$ にしたとき、体積は何 $\mathrm{L}$ か。`, type: 'num', answer: 3.6, rel: 0.02, unit: 'L' }
      ],
      solution: [
        { t: '絶対温度に直す（(1)）',
          m: [R`T = t + 273 = 27 + 273 = 300\,\mathrm{K}`],
          n: R`絶対温度 $T\,[\mathrm{K}]$ は、セルシウス温度 $t\,[\degree\mathrm{C}]$ に $273$ を足したものです。$-273\degree\mathrm{C}$ が $0\,\mathrm{K}$（絶対零度）にあたります。`,
          easy: R`気体の体積は、温度が下がると小さくなり、理論上 $-273\degree\mathrm{C}$ で $0$ になる（これより低くならない）と考えられます。この温度を $0$ とした温度が絶対温度で、単位は $\mathrm{K}$（ケルビン）です。目盛りの幅は $\degree\mathrm{C}$ と同じなので、$273$ を足すだけで換算できます。気体の法則では、**必ず絶対温度**を使います。` },
        { t: R`シャルルの法則 $\dfrac{V}{T} = $ 一定（(2)）`,
          m: [R`T_{2} = 87 + 273 = 360\,\mathrm{K}`,
              R`\frac{V_{1}}{T_{1}} = \frac{V_{2}}{T_{2}} \;\Rightarrow\; V_{2} = V_{1} \times \frac{T_{2}}{T_{1}} = 3.0 \times \frac{360}{300} = 3.6\,\mathrm{L}`],
          n: R`圧力が一定のとき、一定量の気体の体積 $V$ は絶対温度 $T$ に比例します（シャルルの法則）。摂氏のまま $\dfrac{87}{27}$ で比をとってはいけません。`,
          easy: R`絶対温度が $300\,\mathrm{K}$ から $360\,\mathrm{K}$ へ $1.2$ 倍になったので、体積も $1.2$ 倍の $3.0 \times 1.2 = 3.6\,\mathrm{L}$ になります。グラフは、原点を通る直線（比例）です。もし摂氏のまま「$87 \div 27 \fallingdotseq 3.2$ 倍」としてしまうと、まちがった答えになります。` }
      ],
      tags: ['シャルルの法則', '絶対温度']
    },

    {
      id: 'd-p-gas-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-gas',
      title: 'ボイル・シャルルの法則',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`ピストンのついた容器に入った一定量の気体を、状態 1（圧力 $1.0 \times 10^{5}\,\mathrm{Pa}$、体積 $4.0\,\mathrm{L}$、温度 $300\,\mathrm{K}$）から、状態 2（圧力 $2.0 \times 10^{5}\,\mathrm{Pa}$、温度 $450\,\mathrm{K}$）に変化させた。`,
      fig: figPistonStates(),
      parts: [
        { label: '(1)', q: R`状態 2 の体積 $V_{2}$ は何 $\mathrm{L}$ か。`, type: 'num', answer: 3, rel: 0.02, unit: 'L' },
        { label: '(2)', q: R`状態 2 から、温度を $450\,\mathrm{K}$ に保ったまま圧力を $1.0 \times 10^{5}\,\mathrm{Pa}$ にしたとき、体積は何 $\mathrm{L}$ か。`, type: 'num', answer: 6, rel: 0.02, unit: 'L' }
      ],
      solution: [
        { t: R`ボイル・シャルルの法則 $\dfrac{pV}{T} = $ 一定（(1)）`,
          m: [R`\frac{p_{1}V_{1}}{T_{1}} = \frac{p_{2}V_{2}}{T_{2}}`,
              R`V_{2} = \frac{p_{1}V_{1}T_{2}}{T_{1}p_{2}} = \frac{(1.0 \times 10^{5}) \times 4.0 \times 450}{300 \times (2.0 \times 10^{5})} = 3.0\,\mathrm{L}`],
          n: R`ボイルの法則（温度一定で $pV = $ 一定）とシャルルの法則（圧力一定で $\dfrac{V}{T} = $ 一定）を 1 つにまとめた式です。温度は絶対温度（$\mathrm{K}$）で入れます。`,
          easy: R`圧力が $2$ 倍になると、体積は $\dfrac{1}{2}$ 倍になります（ボイル）。温度が $\dfrac{450}{300} = 1.5$ 倍になると、体積は $1.5$ 倍になります（シャルル）。2 つの効果を順にかけると、$4.0 \times \dfrac{1}{2} \times 1.5 = 3.0\,\mathrm{L}$ です。公式にそのまま入れても、同じ結果になります。`,
          pro: R`「何が何倍」を先に出してかけ合わせる（$V_{2} = V_{1} \times \dfrac{p_{1}}{p_{2}} \times \dfrac{T_{2}}{T_{1}}$）と、数値の入れ間違いが減ります。` },
        { t: '温度が一定の変化はボイルの法則（(2)）',
          m: [R`p_{2}V_{2} = p_{3}V_{3} \;\Rightarrow\; V_{3} = \frac{2.0 \times 10^{5} \times 3.0}{1.0 \times 10^{5}} = 6.0\,\mathrm{L}`],
          n: R`$450\,\mathrm{K}$ で温度が一定なので、$pV = $ 一定が使えます。圧力が半分になるので、体積は $2$ 倍になります。`,
          easy: R`状態 2 から圧力だけが $\dfrac{1.0 \times 10^{5}}{2.0 \times 10^{5}} = \dfrac{1}{2}$ 倍になります。温度が変わらないので、体積は反比例して $2$ 倍の $6.0\,\mathrm{L}$ になります。` }
      ],
      tags: ['ボイル・シャルルの法則', '状態変化']
    },

    /* ---------- 熱力学第一法則（p-thermo1） ---------- */
    {
      id: 'd-p-thermo1-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-thermo1',
      title: '熱力学第一法則',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`ピストンのついた容器に入った気体について、次の 2 つの変化を考える。気体が吸収した熱量を $Q$、気体が外部からされた仕事を $W$、気体の内部エネルギーの変化を $\Delta U$ とすると、$\Delta U = Q + W$ が成り立つ。`,
      fig: figFirstLaw(),
      parts: [
        { label: '(1)', q: R`気体に $300\,\mathrm{J}$ の熱を加えたところ、気体は膨張して外部に $120\,\mathrm{J}$ の仕事をした。内部エネルギーの変化 $\Delta U$ は何 $\mathrm{J}$ か（図の変化）。`, type: 'num', answer: 180, rel: 0.02, unit: 'J' },
        { label: '(2)', q: R`別の変化で、気体が外部へ $100\,\mathrm{J}$ の熱を放出し、同時に外部から $40\,\mathrm{J}$ の仕事をされた。内部エネルギーの変化 $\Delta U$ は何 $\mathrm{J}$ か。`, type: 'num', answer: -60, rel: 0.02, unit: 'J', hint: R`例: 25 や -40（減少なら「−」をつける）` }
      ],
      solution: [
        { t: '符号の約束を確認する',
          m: [R`\Delta U = Q + W`,
              R`Q: \text{気体が吸収した熱量（放出なら負）},\qquad W: \text{気体がされた仕事（外へする仕事なら負）}`],
          n: R`$Q$ と $W$ は、どちらも「気体に入ってくる向きを正」とします。気体が外部に仕事をしたときは、$W$ は負の値になります。`,
          easy: R`内部エネルギー $U$ は、気体がためこんでいるエネルギーです。気体が熱をもらう（$Q > 0$）か、外から押されて仕事をされる（$W > 0$）と、エネルギーが増えます。逆に、熱を捨てる（$Q < 0$）か、外へ押し出して仕事をする（$W < 0$）と、エネルギーは減ります。貯金の入金と出金のようなものです。` },
        { t: R`(1) 吸熱 $300\,\mathrm{J}$、外部への仕事 $120\,\mathrm{J}$`,
          m: [R`Q = +300\,\mathrm{J},\quad W = -120\,\mathrm{J}`,
              R`\Delta U = 300 + (-120) = 180\,\mathrm{J}`],
          n: R`気体は $300\,\mathrm{J}$ を受け取り、そのうち $120\,\mathrm{J}$ を外部への仕事に使ったので、残りの $180\,\mathrm{J}$ が内部エネルギーの増加になります。`,
          easy: R`受け取ったエネルギーは $300\,\mathrm{J}$。そのうち $120\,\mathrm{J}$ は、ピストンを押し上げる仕事として外へ出ていきました。差し引き $300 - 120 = 180\,\mathrm{J}$ だけ、気体の中にたまります。` },
        { t: R`(2) 放熱 $100\,\mathrm{J}$、外部からされた仕事 $40\,\mathrm{J}$`,
          m: [R`Q = -100\,\mathrm{J},\quad W = +40\,\mathrm{J}`,
              R`\Delta U = (-100) + 40 = -60\,\mathrm{J}`],
          n: R`熱を放出したので $Q$ は負、外から仕事をされたので $W$ は正です。合計が負なので、内部エネルギーは $60\,\mathrm{J}$ 減少します。`,
          easy: R`気体は $100\,\mathrm{J}$ の熱を外へ捨て、外から $40\,\mathrm{J}$ 分のエネルギーを受け取りました。出ていく量のほうが多いので、差し引き $-100 + 40 = -60\,\mathrm{J}$ で、気体のエネルギーは減ります（温度が下がります）。` }
      ],
      tags: ['熱力学第一法則', '内部エネルギー']
    },

    {
      id: 'd-p-thermo1-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-thermo1',
      title: '定圧変化の仕事と熱量',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`ピストンのついた容器に入った気体が、圧力 $1.0 \times 10^{5}\,\mathrm{Pa}$ を保ったまま、体積 $2.0 \times 10^{-3}\,\mathrm{m^{3}}$ から $5.0 \times 10^{-3}\,\mathrm{m^{3}}$ まで膨張した（図の A → B）。この間に、気体の内部エネルギーは $450\,\mathrm{J}$ 増加した。`,
      fig: figIsobaricPV(),
      parts: [
        { label: '(1)', q: R`この変化で、気体が外部にした仕事 $W'$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 300, rel: 0.02, unit: 'J' },
        { label: '(2)', q: R`この変化で、気体が吸収した熱量 $Q$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 750, rel: 0.02, unit: 'J' }
      ],
      solution: [
        { t: R`定圧変化で気体がする仕事 $W' = p\Delta V$（(1)）`,
          m: [R`W' = p\Delta V = (1.0 \times 10^{5}) \times (5.0 - 2.0) \times 10^{-3}`,
              R`W' = 1.0 \times 10^{5} \times 3.0 \times 10^{-3} = 300\,\mathrm{J}`],
          n: R`圧力が一定のとき、気体が外へする仕事は「圧力 × 体積の増加」です。これは、$p$–$V$ グラフで線の下の面積（図の色のついた長方形）にあたります。`,
          easy: R`ピストンを押し広げる仕事は、「ピストンを押す力 $\times$ 動いた距離」です。圧力 $p$ と断面積 $S$ から力は $pS$、動いた距離を $d$ とすると仕事は $pSd = p\Delta V$ になります。グラフでは、横の幅（体積の増加 $3.0 \times 10^{-3}$）と縦の高さ（圧力 $1.0 \times 10^{5}$）をかけた長方形の面積が、仕事の大きさです。` },
        { t: R`第一法則 $Q = \Delta U + W'$ を使う（(2)）`,
          m: [R`Q = \Delta U + W' = 450 + 300 = 750\,\mathrm{J}`],
          n: R`気体が外部にした仕事を $W'$ とすると、$\Delta U = Q - W'$ なので $Q = \Delta U + W'$ です。内部エネルギーを増やすぶんと、外へ仕事をするぶんの両方を、熱でまかなう必要があります。`,
          easy: R`気体に加えた熱は、2 つの使い道に分かれます。1 つは気体の内部エネルギーを増やすこと（$450\,\mathrm{J}$）、もう 1 つはピストンを押し広げて外へ仕事をすること（$300\,\mathrm{J}$）です。合わせて $450 + 300 = 750\,\mathrm{J}$ の熱が必要でした。` }
      ],
      tags: ['定圧変化', 'p-V図', '仕事']
    },

    {
      id: 'd-p-thermo1-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-thermo1',
      title: '単原子分子の内部エネルギー',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`物質量 $2.0\,\mathrm{mol}$ の単原子分子理想気体の温度を、$300\,\mathrm{K}$ から $350\,\mathrm{K}$ に上げる。気体定数を $R = 8.31\,\mathrm{J/(mol \cdot K)}$ とする。図の A → B は体積を変えずに（定積変化）、A → C は圧力を変えずに（定圧変化）、それぞれ温度を $350\,\mathrm{K}$ にする変化である。`,
      fig: figIsoPV(),
      parts: [
        { label: '(1)', q: R`気体の内部エネルギーの変化 $\Delta U$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 1246.5, rel: 0.02, unit: 'J', show: R`1.25 \times 10^{3}`, hint: R`例: 1.5e3 や 1500` },
        { label: '(2)', q: R`A → C（定圧変化）の間に、気体が吸収した熱量 $Q$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 2077.5, rel: 0.02, unit: 'J', show: R`2.08 \times 10^{3}`, hint: R`例: 1.5e3 や 1500` }
      ],
      solution: [
        { t: '単原子分子理想気体の内部エネルギー（(1)）',
          m: [R`U = \frac{3}{2}nRT \;\Rightarrow\; \Delta U = \frac{3}{2}nR\Delta T`,
              R`\Delta U = \frac{3}{2} \times 2.0 \times 8.31 \times (350 - 300) = 1246.5 \fallingdotseq 1.25 \times 10^{3}\,\mathrm{J}`],
          n: R`理想気体の内部エネルギーは、温度だけで決まります。単原子分子理想気体では $U = \dfrac{3}{2}nRT$ です。A → B でも A → C でも、温度変化が同じなので、$\Delta U$ は同じ値になります。`,
          easy: R`気体の内部エネルギーは、気体の分子が飛び回っている運動エネルギーの合計です。温度が高いほど分子は速く動くので、内部エネルギーは温度に比例して大きくなります。理想気体では、体積や圧力がどうであっても、温度の変化 $50\,\mathrm{K}$ だけで $\Delta U$ が決まります。`,
          pro: R`単原子分子: $\Delta U = \dfrac{3}{2}nR\Delta T$、定積モル比熱 $C_{V} = \dfrac{3}{2}R$、定圧モル比熱 $C_{p} = \dfrac{5}{2}R$ は 3 点セットで暗記します。` },
        { t: '定圧変化では、外へ仕事をするぶんの熱も必要（(2)）',
          m: [R`W' = p\Delta V = nR\Delta T = 2.0 \times 8.31 \times 50 = 831\,\mathrm{J}`,
              R`Q = \Delta U + W' = 1246.5 + 831 = 2077.5 \fallingdotseq 2.08 \times 10^{3}\,\mathrm{J}`],
          n: R`状態方程式 $pV = nRT$ から、圧力一定のときの $p\Delta V = nR\Delta T$ となります。定積変化 A → B では $W' = 0$ なので $Q = \Delta U = 1.25 \times 10^{3}\,\mathrm{J}$ ですが、定圧変化 A → C では膨張による仕事ぶんだけ、より多くの熱が必要です。`,
          easy: R`同じ $50\,\mathrm{K}$ の温度上昇でも、定圧変化では気体が膨張してピストンを押し、外へ $831\,\mathrm{J}$ の仕事をします。その分を熱で補う必要があるので、内部エネルギーの増加（$1246.5\,\mathrm{J}$）に加えて $831\,\mathrm{J}$ が必要で、合計 $2077.5\,\mathrm{J}$ です。体積を固定した場合（$Q = 1246.5\,\mathrm{J}$）より、温めにくいことが分かります。` }
      ],
      tags: ['内部エネルギー', '定圧変化', '定積変化']
    },

    /* ---------- 波の性質（p-wave） ---------- */
    {
      id: 'd-p-wave-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-wave',
      title: '波の基本式（v = fλ）',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図は、$x$ 軸の正の向きに進む正弦波の、ある時刻の波形（$y$–$x$ グラフ）である。媒質の各点は、周期 $0.50\,\mathrm{s}$ で振動している。`,
      fig: figWaveYX(),
      parts: [
        { label: '(1)', q: R`この波の波長 $\lambda$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 2, rel: 0.02, unit: 'm' },
        { label: '(2)', q: R`この波の速さ $v$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 4, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        { t: '波長は「山から山まで」の長さ（(1)）',
          m: [R`\lambda = 2.5 - 0.5 = 2.0\,\mathrm{m}`],
          n: R`波長は、波形が 1 回くり返される長さで、隣り合う山と山（または谷と谷）の間隔です。図の山は $x = 0.5\,\mathrm{m}$ と $x = 2.5\,\mathrm{m}$ にあるので、$\lambda = 2.5 - 0.5 = 2.0\,\mathrm{m}$ です。`,
          easy: R`波は「山・谷・山・谷…」と同じ形をくり返します。この 1 くり返しぶんの長さが波長です。いちばん読み取りやすい「となりの山までの距離」で測りましょう。山の高さ（$0.20\,\mathrm{m}$）は振幅であって、波長ではありません。` },
        { t: R`波の基本式 $v = f\lambda$ を使う（(2)）`,
          m: [R`f = \frac{1}{T} = \frac{1}{0.50} = 2.0\,\mathrm{Hz}`,
              R`v = f\lambda = 2.0 \times 2.0 = 4.0\,\mathrm{m/s}`],
          n: R`振動数 $f$ は 1 秒間の振動の回数で、周期 $T$ の逆数です。波は 1 周期の間に 1 波長だけ進むので、$v = \dfrac{\lambda}{T} = f\lambda$ です。`,
          easy: R`媒質の 1 点は $0.50$ 秒で 1 回振動します。この間に山が 1 つぶん（$2.0\,\mathrm{m}$）進むので、速さは $\dfrac{2.0\,\mathrm{m}}{0.50\,\mathrm{s}} = 4.0\,\mathrm{m/s}$ です。「1 秒間に山が $f = 2.0$ 個通り過ぎる」と考えて、$2.0\,\mathrm{m} \times 2.0$ 個としても同じ結果になります。`,
          pro: R`波の速さは媒質で決まり、振動数は波源で決まる。媒質が変わると $v$ と $\lambda$ だけが変わって $f$ は変わらない、という使い方が頻出です。` }
      ],
      tags: ['波長', '周期', '波の速さ']
    },

    {
      id: 'd-p-wave-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-wave',
      title: '波形の移動と速さ・周期',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`$x$ 軸の正の向きに進む正弦波がある。図の実線は時刻 $t = 0$ の波形、破線は $t = 0.50\,\mathrm{s}$ の波形である。この間に、波は 1 波長より短い距離しか進んでいない。`,
      fig: figWaveShift(),
      parts: [
        { label: '(1)', q: R`この波の速さ $v$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 2, rel: 0.02, unit: 'm/s' },
        { label: '(2)', q: R`この波の周期 $T$ は何 $\mathrm{s}$ か。`, type: 'num', answer: 2, rel: 0.02, unit: 's' }
      ],
      solution: [
        { t: '波形が進んだ距離を時間でわる（(1)）',
          m: [R`\Delta x = 2.0 - 1.0 = 1.0\,\mathrm{m}`,
              R`v = \frac{\Delta x}{\Delta t} = \frac{1.0}{0.50} = 2.0\,\mathrm{m/s}`],
          n: R`波は形を保ったまま進むので、山が動いた距離を、かかった時間でわれば波の速さです。実線の山は $x = 1.0\,\mathrm{m}$、破線の山は $x = 2.0\,\mathrm{m}$ にあります（1 波長より短い距離しか進んでいないので、この 2 つの山を対応させます）。`,
          easy: R`波は、形を変えずに右へ動いていきます。ですから、1 つの山に注目して「$0.50$ 秒の間に、どこからどこまで動いたか」を読み取れば、「速さ ＝ 動いた距離 ÷ かかった時間」で求められます。山は $x = 1.0\,\mathrm{m}$ から $2.0\,\mathrm{m}$ へ $1.0\,\mathrm{m}$ 動いたので、$1.0 \div 0.50 = 2.0\,\mathrm{m/s}$ です。` },
        { t: R`$v = \dfrac{\lambda}{T}$ から周期を求める（(2)）`,
          m: [R`\lambda = 5.0 - 1.0 = 4.0\,\mathrm{m}`,
              R`T = \frac{\lambda}{v} = \frac{4.0}{2.0} = 2.0\,\mathrm{s}`],
          n: R`波長は隣り合う山の間隔です（実線の山は $x = 1.0\,\mathrm{m}$ と $x = 5.0\,\mathrm{m}$ にあります）。波は 1 周期 $T$ の間に 1 波長ぶん進むので、$T = \dfrac{\lambda}{v}$ です。`,
          easy: R`山が $1.0\,\mathrm{m}$ 進むのに $0.50$ 秒かかるので、次の山が来るまでの $4.0\,\mathrm{m}$ を進むには、その $4$ 倍の $2.0$ 秒かかります。これが「同じ状態がくり返される時間」、つまり周期です。別の見方: $1.0\,\mathrm{m}$ は波長 $4.0\,\mathrm{m}$ の $\dfrac{1}{4}$ なので、$0.50\,\mathrm{s}$ は周期の $\dfrac{1}{4}$、したがって $T = 0.50 \times 4 = 2.0\,\mathrm{s}$ です。`,
          pro: R`波形のずれが $\dfrac{1}{4}$ 波長なら、経過時間は $\dfrac{1}{4}$ 周期です。「ずれの割合 ＝ 時間の割合」と見ると、速さを求めなくても周期が出ます。` }
      ],
      tags: ['波形の移動', '波の速さ', '周期']
    },

    {
      id: 'd-p-wave-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-wave',
      title: '弦の定常波',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`長さ $1.2\,\mathrm{m}$ の弦の両端を固定し、弦をはじいたところ、図のように腹が 3 個の定常波ができた。弦を伝わる波の速さは $60\,\mathrm{m/s}$ である。`,
      fig: figStandingWave(),
      parts: [
        { label: '(1)', q: R`この定常波の波長 $\lambda$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.8, rel: 0.02, unit: 'm' },
        { label: '(2)', q: R`弦の振動数 $f$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 75, rel: 0.02, unit: 'Hz' }
      ],
      solution: [
        { t: '腹 1 個の長さは半波長（(1)）',
          m: [R`L = 3 \times \frac{\lambda}{2} \;\Rightarrow\; \lambda = \frac{2L}{3} = \frac{2 \times 1.2}{3} = 0.80\,\mathrm{m}`],
          n: R`定常波では、隣り合う節と節（または腹と腹）の間隔が半波長 $\dfrac{\lambda}{2}$ です。弦の両端は固定されているので節になり、その間に腹が 3 個入っているので、弦の長さは半波長の 3 個ぶんにあたります。`,
          easy: R`定常波は、その場で大きく振動する場所（腹）と、まったく動かない場所（節）が交互に並んだ波です。「腹 1 つぶんの長さ」が波長の半分にあたります。図の弦には腹が 3 つ並んでいるので、弦の長さ $1.2\,\mathrm{m}$ は半波長の $3$ 倍です。半波長は $1.2 \div 3 = 0.40\,\mathrm{m}$ なので、波長はその $2$ 倍の $0.80\,\mathrm{m}$ です。` },
        { t: R`$v = f\lambda$ で振動数を求める（(2)）`,
          m: [R`f = \frac{v}{\lambda} = \frac{60}{0.80} = 75\,\mathrm{Hz}`],
          n: R`定常波は、弦を右向きと左向きに進む 2 つの波が重なってできるので、もとの進行波と同じ速さ・同じ波長・同じ振動数をもっています。`,
          easy: R`定常波の波長 $0.80\,\mathrm{m}$ は、弦を進む波の波長でもあります。「速さ ＝ 振動数 × 波長」を変形した $f = \dfrac{v}{\lambda}$ に代入すると、$60 \div 0.80 = 75$ です。弦は 1 秒間に $75$ 回振動している、ということです。`,
          pro: R`両端固定の弦で腹が $n$ 個のとき、$\lambda_{n} = \dfrac{2L}{n}$、$f_{n} = \dfrac{nv}{2L}$（$n$ 倍振動）。ここでは基本振動 $\dfrac{v}{2L} = 25\,\mathrm{Hz}$ の 3 倍にあたります。` }
      ],
      tags: ['定常波', '弦の振動', '波長']
    },

    /* ---------- ドップラー効果（p-doppler） ---------- */
    {
      id: 'd-p-doppler-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-doppler',
      title: 'ドップラー効果（動く音源）',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`静止している観測者 O に向かって、救急車が一定の速さ $20\,\mathrm{m/s}$ で近づいてくる。救急車は振動数 $720\,\mathrm{Hz}$ のサイレンを鳴らしている。空気中の音の速さを $340\,\mathrm{m/s}$ とする。`,
      fig: figDopplerSource(),
      parts: [
        { label: '(1)', q: R`救急車が近づいてくるとき、観測者が聞く音の振動数 $f_{1}$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 765, rel: 0.02, unit: 'Hz' },
        { label: '(2)', q: R`救急車が観測者の前を通り過ぎて遠ざかっていくとき、観測者が聞く音の振動数 $f_{2}$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 680, rel: 0.02, unit: 'Hz' }
      ],
      solution: [
        { t: '音源が近づくと、前方の波長が短くなる（(1)）',
          m: [R`\lambda_{1} = \frac{V - v_{s}}{f_{0}} = \frac{340 - 20}{720} = \frac{4}{9}\,\mathrm{m}`,
              R`f_{1} = \frac{V}{\lambda_{1}} = \frac{V}{V - v_{s}}\,f_{0} = \frac{340}{340 - 20} \times 720 = 765\,\mathrm{Hz}`],
          n: R`音源は 1 周期 $\dfrac{1}{f_{0}}$ の間に $\dfrac{v_{s}}{f_{0}}$ だけ前へ進むので、進行方向の波長は $\dfrac{V}{f_{0}}$ ではなく $\dfrac{V - v_{s}}{f_{0}}$ に縮みます。観測者は静止しているので、音は速さ $V$ のまま届き、$f = \dfrac{V}{\lambda}$ で振動数が決まります。`,
          easy: R`サイレンは 1 秒間に $720$ 回、波を送り出します。救急車が近づいてくる間は、波を出す場所が次の波を出す前に少し前進するので、波と波の間隔（波長）がつまります。間隔のつまった波が、同じ速さ $340\,\mathrm{m/s}$ で次々と観測者の耳に届くので、1 秒間に受け取る波の数（振動数）が増え、音が高く聞こえます。`,
          pro: R`音源が動く: $f = \dfrac{V}{V - v_{s}}f_{0}$（近づくとき分母が $V - v_{s}$、遠ざかるとき $V + v_{s}$）。` },
        { t: '遠ざかるときは、後方の波長が長くなる（(2)）',
          m: [R`f_{2} = \frac{V}{V + v_{s}}\,f_{0} = \frac{340}{340 + 20} \times 720 = 680\,\mathrm{Hz}`],
          n: R`遠ざかる音源の後方では、波長が $\dfrac{V + v_{s}}{f_{0}} = 0.50\,\mathrm{m}$ にのびます。分母の $V - v_{s}$ が $V + v_{s}$ に入れかわるだけです。`,
          easy: R`遠ざかるときは、次の波を出す場所が観測者から離れていくので、波と波の間隔が広がります。間隔の広い波が同じ速さで届くと、1 秒間に受け取る波の数は減り、音は低く聞こえます。確かめとして、近づくとき $765\,\mathrm{Hz}$ ＞ 元の $720\,\mathrm{Hz}$ ＞ 遠ざかるとき $680\,\mathrm{Hz}$ の順になっていることを見ておきましょう。` }
      ],
      tags: ['ドップラー効果', '動く音源', '振動数']
    },

    {
      id: 'd-p-doppler-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-doppler',
      title: 'ドップラー効果（動く観測者）',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`静止している音源が、振動数 $680\,\mathrm{Hz}$ の音を出し続けている。観測者が音源に向かって一定の速さ $10\,\mathrm{m/s}$ で近づいていく。空気中の音の速さを $340\,\mathrm{m/s}$ とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`音源が出す音の波長 $\lambda$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.5, rel: 0.02, unit: 'm' },
        { label: '(2)', q: R`近づいていく観測者が聞く音の振動数 $f$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 700, rel: 0.02, unit: 'Hz' }
      ],
      solution: [
        { t: '音源が静止していれば、波長は変わらない（(1)）',
          m: [R`\lambda = \frac{V}{f_{0}} = \frac{340}{680} = 0.50\,\mathrm{m}`],
          n: R`音源が静止しているので、波長は $\dfrac{V}{f_{0}}$ のままです。観測者が動いても、空気中を広がっていく波の形（波と波の間隔）は変わりません。`,
          easy: R`1 秒間に $680$ 個の波が出て、音が $340\,\mathrm{m}$ 進むので、波 1 個の長さ（波長）は $340 \div 680 = 0.50\,\mathrm{m}$ です。観測者がどう動いても、空気中を進む波と波の間隔そのものは変わりません。` },
        { t: '観測者から見た音の速さが変わる（(2)）',
          m: [R`V' = V + v_{o} = 340 + 10 = 350\,\mathrm{m/s}`,
              R`f = \frac{V'}{\lambda} = \frac{V + v_{o}}{V}\,f_{0} = \frac{350}{0.50} = 700\,\mathrm{Hz}`],
          n: R`観測者が音源に近づくと、観測者から見た音の速さ（波が観測者に出会う速さ）が $V + v_{o}$ に増えます。波長はそのままなので、1 秒間に出会う波の数 $f = \dfrac{V + v_{o}}{\lambda}$ が増えます。`,
          easy: R`向かってくる波に向かって走ると、波とすれちがう回数が増えます。観測者から見ると音は $340 + 10 = 350\,\mathrm{m/s}$ で迫ってくるので、波長 $0.50\,\mathrm{m}$ の波が 1 秒間に $350 \div 0.50 = 700$ 個ぶん耳に届きます。観測者が遠ざかるときは $V - v_{o} = 330\,\mathrm{m/s}$ になり、$660\,\mathrm{Hz}$ に下がります。`,
          pro: R`観測者が動く: $f = \dfrac{V \pm v_{o}}{V}f_{0}$（近づくとき $+$）。音源が動く場合（分母が変わる）と区別します。` }
      ],
      tags: ['ドップラー効果', '動く観測者', '波長']
    },

    {
      id: 'd-p-doppler-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-doppler',
      title: 'ドップラー効果（両方が動く）',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`一直線上を、音源 S と観測者 O が同じ向き（右向き）に動いている。音源は観測者の後方（左側）にあって、速さ $30\,\mathrm{m/s}$ で観測者を追いかけ、観測者は速さ $10\,\mathrm{m/s}$ で進んでいる。音源は振動数 $620\,\mathrm{Hz}$ の音を出している。無風で、空気中の音の速さを $340\,\mathrm{m/s}$ とする。`,
      fig: figDopplerBoth(),
      parts: [
        { label: '(1)', q: R`観測者が聞く音の振動数 $f$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 660, rel: 0.02, unit: 'Hz' },
        { label: '(2)', q: R`もし音源と観測者が、どちらも $20\,\mathrm{m/s}$ で同じ向きに動いていたら、観測者が聞く振動数は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 620, rel: 0.02, unit: 'Hz' }
      ],
      solution: [
        { t: '音源の運動で、観測者側の波長が変わる（(1)）',
          m: [R`\lambda' = \frac{V - v_{s}}{f_{0}} = \frac{340 - 30}{620} = 0.50\,\mathrm{m}`],
          n: R`音の進む向き（右向き）を正とします。音源が観測者に向かって動くので、観測者側の波長は $\dfrac{V - v_{s}}{f_{0}}$ に縮みます。`,
          easy: R`音源が波を追いかけるように進むので、波と波の間隔がつまります。音源が 1 周期（$\dfrac{1}{620}$ 秒）の間に進む距離ぶん、波長が短くなります。静止しているときの波長 $\dfrac{340}{620} \fallingdotseq 0.55\,\mathrm{m}$ が、$0.50\,\mathrm{m}$ になります。` },
        { t: '観測者の運動で、観測者から見た音の速さが変わる（(1)）',
          m: [R`V' = V - v_{o} = 340 - 10 = 330\,\mathrm{m/s}`,
              R`f = \frac{V'}{\lambda'} = \frac{V - v_{o}}{V - v_{s}}\,f_{0} = \frac{330}{0.50} = 660\,\mathrm{Hz}`],
          n: R`観測者も音と同じ向きに逃げているので、観測者から見た音の速さは $V - v_{o}$ に減ります。この速さで波長 $\lambda'$ の波に出会うので、$f = \dfrac{V - v_{o}}{\lambda'}$ です。`,
          easy: R`観測者は波から遠ざかる向きに進んでいるので、波とすれちがう回数が減ります。観測者から見た音の速さは $340 - 10 = 330\,\mathrm{m/s}$ です。縮んだ波長 $0.50\,\mathrm{m}$ の波が、1 秒間に $330 \div 0.50 = 660$ 個ぶん届くので、振動数は $660\,\mathrm{Hz}$ になります。`,
          pro: R`一般形: $f = \dfrac{V - v_{o}}{V - v_{s}}f_{0}$（音の進む向きを正とし、$v_{o}$、$v_{s}$ はその向きの速度）。分子は観測者、分母は音源、と覚えます。` },
        { t: '同じ速さで動くと、振動数は変わらない（(2)）',
          m: [R`f = \frac{340 - 20}{340 - 20} \times 620 = 620\,\mathrm{Hz}`],
          n: R`音源と観測者の速さが等しいと、分子と分母が同じ値になって打ち消し合い、$f = f_{0}$ になります（無風のとき）。`,
          easy: R`2 人が同じ速さで同じ向きに動いているとき、2 人の間隔は変わりません。おたがいに止まっているのと同じなので、音の高さは変わりません。ドップラー効果は「音源と観測者の間隔が変化するとき」に起こる現象です。` }
      ],
      tags: ['ドップラー効果', '音源と観測者', '相対運動']
    },

    /* ---------- 光の干渉（p-interf） ---------- */
    {
      id: 'd-p-interf-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-interf',
      title: 'ヤングの実験',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、波長 $\lambda = 600\,\mathrm{nm}$ の単色光を、間隔 $d = 0.20\,\mathrm{mm}$ の 2 つのスリット $\mathrm{S_{1}}$、$\mathrm{S_{2}}$ に当て、距離 $L = 2.0\,\mathrm{m}$ はなれたスクリーンに干渉じまをつくった。$L$ は $d$ や明線の間隔にくらべて十分に大きい。$1\,\mathrm{nm} = 10^{-9}\,\mathrm{m}$ とする。`,
      fig: figYoung(),
      parts: [
        { label: '(1)', q: R`スクリーン上の隣り合う明線の間隔 $\Delta x$ は何 $\mathrm{mm}$ か。`, type: 'num', answer: 6, rel: 0.02, unit: 'mm' },
        { label: '(2)', q: R`波長が $450\,\mathrm{nm}$ の青い光に変えると、隣り合う明線の間隔は何 $\mathrm{mm}$ になるか。`, type: 'num', answer: 4.5, rel: 0.02, unit: 'mm' }
      ],
      solution: [
        { t: '経路差が波長の整数倍のところが明線',
          m: [R`\Delta l = |\mathrm{S_{2}P} - \mathrm{S_{1}P}| \fallingdotseq \frac{d\,x}{L}`,
              R`\frac{d\,x_{m}}{L} = m\lambda \;\Rightarrow\; x_{m} = \frac{mL\lambda}{d} \quad (m = 0, 1, 2, \cdots)`],
          n: R`スクリーン上で中央 O から $x$ はなれた点 P では、2 つのスリットからの経路の差が $\dfrac{dx}{L}$ になります（$x$ が $L$ にくらべて十分に小さいとき）。経路差が波長の整数倍 $m\lambda$ のとき、2 つの波は山と山が重なって強め合い、明線になります。`,
          easy: R`2 つのスリットは、同じタイミングで振動する 2 つの波の源です。スクリーン上の点には、遠いほうのスリットからの波が、近いほうのスリットからの波より「経路差」ぶんだけ遅れて着きます。この遅れがちょうど波長の整数倍（$0$ 個ぶん、$1$ 個ぶん、$2$ 個ぶん、…）のときは、山と山、谷と谷が重なって強め合い、明るくなります。$m = 0$ が中央の明線、$m = 1$ が隣の明線、…です。` },
        { t: '隣り合う明線の間隔（(1)）',
          m: [R`\Delta x = x_{m+1} - x_{m} = \frac{L\lambda}{d}`,
              R`\Delta x = \frac{2.0 \times (600 \times 10^{-9})}{0.20 \times 10^{-3}} = 6.0 \times 10^{-3}\,\mathrm{m} = 6.0\,\mathrm{mm}`],
          n: R`$x_{m}$ は $m$ に比例するので、明線は等間隔に並びます。$m$ が 1 増えるごとに $\dfrac{L\lambda}{d}$ ずつ進むので、これが明線の間隔です。単位は $\mathrm{m}$ にそろえて代入します。`,
          easy: R`$m$ が 1 増えるごとに $\dfrac{L\lambda}{d}$ ずつ位置が進むので、明線は等間隔です。計算では単位を $\mathrm{m}$ にそろえるのがコツで、$\lambda = 6.0 \times 10^{-7}\,\mathrm{m}$、$d = 2.0 \times 10^{-4}\,\mathrm{m}$ として $\dfrac{2.0 \times 6.0 \times 10^{-7}}{2.0 \times 10^{-4}} = 6.0 \times 10^{-3}\,\mathrm{m}$ です。`,
          pro: R`$\Delta x = \dfrac{L\lambda}{d}$ は、$\lambda$ に比例・$L$ に比例・$d$ に反比例。変化量の比で処理すると速い。` },
        { t: '波長を変えたときは、比で考える（(2)）',
          m: [R`\Delta x' = \frac{L\lambda'}{d} = \Delta x \times \frac{\lambda'}{\lambda} = 6.0 \times \frac{450}{600} = 4.5\,\mathrm{mm}`],
          n: R`$L$ と $d$ は変わらないので、明線の間隔は波長に比例します。`,
          easy: R`波長が短いほど、明線の間隔はせまくなります（赤い光より青い光のほうが、しまが細かくなる）。波長が $\dfrac{450}{600} = 0.75$ 倍になるので、間隔も $0.75$ 倍の $4.5\,\mathrm{mm}$ です。` }
      ],
      tags: ['ヤングの実験', '明線の間隔', '経路差']
    },

    {
      id: 'd-p-interf-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-interf',
      title: '回折格子',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`$1\,\mathrm{mm}$ あたり $500$ 本のみぞをもつ回折格子に、波長 $600\,\mathrm{nm}$ の単色光を垂直に当てた。回折光の進む向きが入射方向となす角を $\theta$ とする。$1\,\mathrm{nm} = 10^{-9}\,\mathrm{m}$ とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`1 次の回折光（$m = 1$）について、$\sin\theta$ の値を求めよ。`, type: 'num', answer: 0.3, rel: 0.02 },
        { label: '(2)', q: R`観測できる回折光のうち、最も大きい次数 $m$ はいくつか。（$m = 0$ の中央の光の両側に、$m = 1, 2, \cdots$ の光が対称に現れる。）`, type: 'num', answer: 3, tol: 0.01 }
      ],
      solution: [
        { t: '格子定数 $d$ を求める',
          m: [R`d = \frac{1.0 \times 10^{-3}\,\mathrm{m}}{500} = 2.0 \times 10^{-6}\,\mathrm{m}`],
          n: R`格子定数 $d$ は、隣り合うみぞの間隔です。$1\,\mathrm{mm}$ あたり $500$ 本なので、$1$ 本あたりの間隔は $\dfrac{1\,\mathrm{mm}}{500}$ です。`,
          easy: R`「$1\,\mathrm{mm}$ あたり $500$ 本」は、$1\,\mathrm{mm}$ を $500$ 等分したものが、みぞ 1 本ぶんの間隔という意味です。$1\,\mathrm{mm} = 1.0 \times 10^{-3}\,\mathrm{m}$ を $500$ でわって、$d = 2.0 \times 10^{-6}\,\mathrm{m}$（$2.0\,\mu\mathrm{m}$）です。` },
        { t: '回折光が強め合う条件（(1)）',
          m: [R`d\sin\theta = m\lambda \;\Rightarrow\; \sin\theta = \frac{m\lambda}{d}`,
              R`\sin\theta_{1} = \frac{1 \times (600 \times 10^{-9})}{2.0 \times 10^{-6}} = 0.30`],
          n: R`隣り合うみぞから出る光の経路差は $d\sin\theta$ です。これが波長の整数倍 $m\lambda$ のとき、すべてのみぞからの光が山と山でそろって強め合い、明るい回折光になります。`,
          easy: R`回折格子は、たくさんのスリットを等間隔に並べたものです。斜め $\theta$ の向きに進む光は、隣のみぞの光にくらべて $d\sin\theta$ だけ余計に進みます。その差がちょうど波長の $m$ 倍（$m = 0, 1, 2, \cdots$）なら、どのみぞの光も山と山がそろって強め合います。$m = 1$ を代入すると $\sin\theta_{1} = \dfrac{6.0 \times 10^{-7}}{2.0 \times 10^{-6}} = 0.30$ です。` },
        { t: '観測できる最大の次数（(2)）',
          m: [R`\sin\theta \le 1 \;\Rightarrow\; m \le \frac{d}{\lambda} = \frac{2.0 \times 10^{-6}}{600 \times 10^{-9}} = 3.33\cdots`,
              R`m_{\max} = 3`],
          n: R`$\sin\theta$ は $1$ を超えられないので、$m\lambda \le d$ を満たす整数 $m$ の回折光だけが現れます。$3.33\cdots$ 以下の最大の整数は $3$ です。`,
          easy: R`$\sin\theta = \dfrac{m\lambda}{d}$ の値が $1$ より大きくなる次数では、そんな角度は存在しないので、光は出てきません。$m = 3$ なら $\sin\theta = 0.90$ で問題ありませんが、$m = 4$ なら $\sin\theta = 1.2$ となって不可能です。よって最大の次数は $m = 3$ です（中央の $m = 0$ の両側に $3$ 本ずつ、全部で $7$ 本の回折光）。`,
          pro: R`格子定数が $d$ のとき、最大の次数は $\dfrac{d}{\lambda}$ の整数部分。波長が短いほど、多くの次数が観測できます。` }
      ],
      tags: ['回折格子', '格子定数', '強め合い']
    },

    {
      id: 'd-p-interf-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-interf',
      title: '薄膜の干渉',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`図のように、空気中にある屈折率 $n = 1.30$ の薄い膜に、波長 $\lambda = 520\,\mathrm{nm}$（空気中）の光を膜面に垂直に当てる。膜の表面で反射する光と、裏面で反射する光が干渉する。膜の両側は空気（屈折率 $1.00$）である。`,
      fig: figThinFilm(),
      parts: [
        { label: '(1)', q: R`膜の中での光の波長 $\lambda'$ は何 $\mathrm{nm}$ か。`, type: 'num', answer: 400, rel: 0.02, unit: 'nm' },
        { label: '(2)', q: R`反射光が最も強め合う（明るく見える）とき、最も薄い膜の厚さ $t$ は何 $\mathrm{nm}$ か。`, type: 'num', answer: 100, rel: 0.02, unit: 'nm' }
      ],
      solution: [
        { t: '膜の中では波長が短くなる（(1)）',
          m: [R`\lambda' = \frac{\lambda}{n} = \frac{520}{1.30} = 400\,\mathrm{nm}`],
          n: R`光が屈折率 $n$ の媒質に入ると、速さと波長が $\dfrac{1}{n}$ 倍になります（振動数は変わりません）。`,
          easy: R`光は、空気中から膜の中に入ると遅くなります。振動数（1 秒間に何回振動するか）は変わらないので、遅くなったぶん、波と波の間隔（波長）がつまります。屈折率 $1.30$ とは、速さも波長も $\dfrac{1}{1.30}$ 倍になるという意味で、$520 \div 1.30 = 400\,\mathrm{nm}$ です。` },
        { t: '反射で位相がずれるのは、表面だけ',
          n: R`屈折率の小さい媒質の側から進んできた光が、屈折率の大きい媒質との境界で反射するとき、位相が $\pi$（半波長ぶん）ずれます。表面（空気 → 膜）での反射は位相が $\pi$ ずれ、裏面（膜 → 空気）での反射は位相がずれません。`,
          easy: R`ひもの波が壁（固定端）で反射すると、山が谷にひっくり返ります。光も、より光が進みにくい媒質（屈折率の大きいほう）との境界ではね返されるとき、山と谷がひっくり返ります。図では、空気から膜に入る表面 ① の反射だけがひっくり返り、膜から空気へ出る裏面 ② の反射はひっくり返りません。` },
        { t: '強め合う条件から厚さを求める（(2)）',
          m: [R`2t = \left(m + \frac{1}{2}\right)\lambda' \quad (m = 0, 1, 2, \cdots)`,
              R`t_{\min} = \frac{\lambda'}{4} = \frac{400}{4} = 100\,\mathrm{nm}`],
          n: R`裏面で反射する光は、膜の中を往復するぶん（$2t$）だけ余計に進みます。表面の反射だけが半波長ぶんずれているので、往復の距離 $2t$ が半波長の奇数倍のとき、2 つの反射光は山と山が重なって強め合います。最も薄い膜は $m = 0$ のときで、$2t = \dfrac{\lambda'}{2}$ です。`,
          easy: R`裏面で反射した光は、表面の光にくらべて、膜を往復するぶん $2t$ だけ遅れます。ところが表面の反射だけは山と谷がひっくり返っているので、すでに半波長ぶんずれています。そこで、$2t$ がちょうど半波長のとき、「ひっくり返ったぶん」と「遅れたぶん」が打ち消し合って、2 つの反射光の山と山が重なります。これが一番薄い膜の厚さで、$t = \dfrac{\lambda'}{4} = 100\,\mathrm{nm}$ です。`,
          pro: R`空気 / 膜 / 空気では、反射光が強め合う条件は $2nt = \left(m + \dfrac{1}{2}\right)\lambda$（$\lambda$ は空気中の波長）、弱め合う条件は $2nt = m\lambda$。膜の下がガラスなど屈折率が膜より大きい場合は、この条件が逆になるので注意します。` }
      ],
      tags: ['薄膜干渉', '位相のずれ', '屈折率']
    },

    /* ---------- 静電気（p-estat） ---------- */
    {
      id: 'd-p-estat-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-estat',
      title: 'クーロンの法則',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`真空中で、$q_{1} = 2.0 \times 10^{-6}\,\mathrm{C}$ の正の点電荷と $q_{2} = 3.0 \times 10^{-6}\,\mathrm{C}$ の正の点電荷を、$r = 0.30\,\mathrm{m}$ はなして固定した。クーロンの法則の比例定数を $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`2 つの電荷が及ぼし合う静電気力の大きさ $F$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 0.6, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`$q_{2}$ を動かして距離を $0.60\,\mathrm{m}$ にすると、静電気力の大きさは何 $\mathrm{N}$ になるか。`, type: 'num', answer: 0.15, rel: 0.02, unit: 'N' }
      ],
      solution: [
        { t: 'クーロンの法則に代入する（(1)）',
          m: [R`F = k\frac{q_{1}q_{2}}{r^{2}}`,
              R`F = 9.0 \times 10^{9} \times \frac{(2.0 \times 10^{-6}) \times (3.0 \times 10^{-6})}{(0.30)^{2}} = 0.60\,\mathrm{N}`],
          n: R`2 つの点電荷の間にはたらく力の大きさは、電気量の積に比例し、距離の 2 乗に反比例します。ここでは同符号（正と正）なので、たがいに反発する力（斥力）です。`,
          easy: R`電気をもつ物体どうしには、同じ種類（正と正、負と負）なら反発し、ちがう種類なら引き合う力がはたらきます。その大きさは、電気量が大きいほど強く、はなれるほど弱くなります（距離の $2$ 乗に反比例）。計算では、$(2.0 \times 10^{-6}) \times (3.0 \times 10^{-6}) = 6.0 \times 10^{-12}$、$(0.30)^{2} = 0.090$ なので、$9.0 \times 10^{9} \times 6.0 \times 10^{-12} \div 0.090 = 0.60\,\mathrm{N}$ です。` },
        { t: R`距離が 2 倍になると、力は $\dfrac{1}{4}$ 倍（(2)）`,
          m: [R`F' = F \times \left(\frac{0.30}{0.60}\right)^{2} = 0.60 \times \frac{1}{4} = 0.15\,\mathrm{N}`],
          n: R`距離が $2$ 倍になると、力は $\dfrac{1}{2^{2}} = \dfrac{1}{4}$ 倍になります。電気量は変わらないので、比で求められます。`,
          easy: R`力は距離の $2$ 乗に反比例するので、距離が $2$ 倍なら $\dfrac{1}{4}$ 倍、$3$ 倍なら $\dfrac{1}{9}$ 倍です。「距離が 2 倍だから、力は半分」と間違えやすいので注意しましょう。`,
          pro: R`$F \propto \dfrac{1}{r^{2}}$ は万有引力と同じ形。何倍になるかの比で処理すると、定数 $k$ を使わずに済みます。` }
      ],
      tags: ['クーロンの法則', '静電気力', '距離の2乗']
    },

    {
      id: 'd-p-estat-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-estat',
      title: '点電荷がつくる電場',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`真空中に、正の点電荷 $Q = 4.0 \times 10^{-9}\,\mathrm{C}$ を固定した。点 P は、$Q$ から $r = 0.30\,\mathrm{m}$ はなれた位置にある。$k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`点 P での電場の強さ $E$ は何 $\mathrm{N/C}$ か。`, type: 'num', answer: 400, rel: 0.02, unit: 'N/C' },
        { label: '(2)', q: R`点 P に $-2.0 \times 10^{-9}\,\mathrm{C}$ の点電荷をおいた。この電荷が受ける静電気力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 8.0e-7, rel: 0.02, unit: 'N', show: R`8.0 \times 10^{-7}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        { t: '点電荷がつくる電場の強さ（(1)）',
          m: [R`E = k\frac{Q}{r^{2}} = 9.0 \times 10^{9} \times \frac{4.0 \times 10^{-9}}{(0.30)^{2}} = \frac{36}{0.090} = 400\,\mathrm{N/C}`],
          n: R`点電荷 $Q$ から距離 $r$ の点の電場の強さは $E = k\dfrac{Q}{r^{2}}$ です。$Q$ が正なので、電場の向きは $Q$ から遠ざかる向きです。`,
          easy: R`電場とは、「その場所に $+1\,\mathrm{C}$ の正電荷を置いたとき、それが受ける力」を表す量です。電気量 $q$ の電荷が受ける力を $F$ とすると $E = \dfrac{F}{q}$ で、単位は $\mathrm{N/C}$ です。点電荷 $Q$ から距離 $r$ の点では、クーロンの法則より $F = k\dfrac{Qq}{r^{2}}$ なので、$E = k\dfrac{Q}{r^{2}}$ となり、置く電荷の大きさによりません。数値は $9.0 \times 10^{9} \times 4.0 \times 10^{-9} = 36$ を $0.090$ でわって $400\,\mathrm{N/C}$ です。` },
        { t: '電場の中の電荷が受ける力（(2)）',
          m: [R`F = |q|E = (2.0 \times 10^{-9}) \times 400 = 8.0 \times 10^{-7}\,\mathrm{N}`],
          n: R`電場 $E$ の中の電気量 $q$ の電荷は、$F = qE$ の力を受けます。$q$ が負のときは、力の向きが電場と逆向き（$Q$ に引かれる向き）になります。`,
          easy: R`電場は「$1\,\mathrm{C}$ あたりの力」なので、電気量の大きさ $|q|$ の電荷を置くと、力は $|q|$ 倍になります。電荷が負のときは大きさは同じで、向きだけが逆になります。ここでは $Q$ が正、$q$ が負で引き合うので、力は $Q$ に向かう向きです。確かめとして、クーロンの法則で直接計算しても、$9.0 \times 10^{9} \times \dfrac{(4.0 \times 10^{-9})(2.0 \times 10^{-9})}{0.090} = 8.0 \times 10^{-7}\,\mathrm{N}$ で一致します。`,
          pro: R`$E = \dfrac{F}{q}$、$F = qE$ は、電場を求める → 力を求める、と 2 段階で処理するときの基本。負電荷の力は電場と逆向き。` }
      ],
      tags: ['電場', '点電荷', 'F = qE']
    },

    {
      id: 'd-p-estat-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-estat',
      title: '一様な電場と電位差',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、強さ $E = 2.0 \times 10^{3}\,\mathrm{V/m}$ の一様な電場が右向きにある。電場に平行な直線上に点 A、B があり、A から B までの距離は $0.15\,\mathrm{m}$ である。`,
      fig: figUniformField(),
      parts: [
        { label: '(1)', q: R`A、B 間の電位差 $V_{\mathrm{AB}}$（A の電位 $-$ B の電位）は何 $\mathrm{V}$ か。`, type: 'num', answer: 300, rel: 0.02, unit: 'V' },
        { label: '(2)', q: R`電気量 $+2.0 \times 10^{-6}\,\mathrm{C}$ の点電荷を A から B まで動かすとき、静電気力がする仕事 $W$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 6.0e-4, rel: 0.02, unit: 'J', show: R`6.0 \times 10^{-4}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        { t: '電場の向きに $d$ 進むと、電位は $Ed$ 下がる（(1)）',
          m: [R`V_{\mathrm{AB}} = Ed = (2.0 \times 10^{3}) \times 0.15 = 300\,\mathrm{V}`],
          n: R`一様な電場 $E$ の中で、電場の向きに距離 $d$ 進むと、電位は $Ed$ だけ下がります。したがって、電場の向きに $d$ はなれた 2 点の電位差は $V = Ed$ です。電場は A から B の向きなので、A のほうが B より電位が高く、$V_{\mathrm{AB}} > 0$ です。`,
          easy: R`電位は、電気の「高さ」のようなものです。電場は電位の高いほうから低いほうへ向かうので、電場の向きに進むと電位は下がっていきます。坂道にたとえると、電場 $E$ が「坂の急さ」、進んだ距離 $d$ が「水平方向の長さ」で、下がる高さ（電位差）は $E \times d$ にあたります。単位は $\mathrm{V/m} \times \mathrm{m} = \mathrm{V}$ です。` },
        { t: '静電気力がする仕事は $W = qV$（(2)）',
          m: [R`W = qV_{\mathrm{AB}} = (2.0 \times 10^{-6}) \times 300 = 6.0 \times 10^{-4}\,\mathrm{J}`],
          n: R`電位差 $V$ の 2 点間を電気量 $q$ の電荷が移動するとき、静電気力がする仕事は $W = qV$ です。正電荷は電場の向き（A → B）に力を受けて動くので、仕事は正です。`,
          easy: R`確かめ算をします。電場から受ける力は $F = qE = (2.0 \times 10^{-6}) \times (2.0 \times 10^{3}) = 4.0 \times 10^{-3}\,\mathrm{N}$ で、向きは電場と同じ右向きです。これが $0.15\,\mathrm{m}$ の間はたらき続けるので、仕事は「力 × 距離」$= 4.0 \times 10^{-3} \times 0.15 = 6.0 \times 10^{-4}\,\mathrm{J}$ で、$qV$ と一致します。電位差 $V$ は、「$1\,\mathrm{C}$ あたりの仕事」と見ることもできます。`,
          pro: R`$W = qV$ と $F = qE$、$V = Ed$ の 3 式は、一様な電場の問題の基本セット。エネルギーで考えると、静電気力がした仕事ぶんだけ運動エネルギーが増えます。` }
      ],
      tags: ['一様な電場', '電位差', '静電気力の仕事']
    },

    /* ---------- オームの法則と合成抵抗（p-circuit） ---------- */
    {
      id: 'd-p-circuit-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-circuit',
      title: '直並列回路の合成抵抗',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、起電力 $12\,\mathrm{V}$ の電池に、$R_{1} = 4.0\,\Omega$ の抵抗器と、$R_{2} = 6.0\,\Omega$、$R_{3} = 12\,\Omega$ の 2 つの抵抗器を並列にしたものを、直列につないだ。電池の内部抵抗は無視できるものとする。`,
      fig: figSeriesParallel('E = 12 V', 'R₁ = 4.0 Ω', 'R₂ = 6.0 Ω', 'R₃ = 12 Ω'),
      parts: [
        { label: '(1)', q: R`回路全体の合成抵抗 $R$ は何 $\Omega$ か。`, type: 'num', answer: 8, rel: 0.02, unit: 'Ω' },
        { label: '(2)', q: R`$R_{3}$ を流れる電流 $I_{3}$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.5, rel: 0.02, unit: 'A' }
      ],
      solution: [
        { t: '並列の部分を先に 1 つの抵抗にまとめる（(1)）',
          m: [R`\frac{1}{R_{23}} = \frac{1}{R_{2}} + \frac{1}{R_{3}} = \frac{1}{6.0} + \frac{1}{12} = \frac{3}{12} \;\Rightarrow\; R_{23} = 4.0\,\Omega`,
              R`R = R_{1} + R_{23} = 4.0 + 4.0 = 8.0\,\Omega`],
          n: R`並列の部分 $R_{2}$、$R_{3}$ を 1 つの抵抗 $R_{23}$ にまとめてから、$R_{1}$ と直列の和をとります。`,
          easy: R`複雑な回路は、「並列のかたまり」を 1 個の抵抗に置きかえて考えます。$R_{2}$ と $R_{3}$ の並列は、道が 2 本になって流れやすくなるので、$R_{23} = 4.0\,\Omega$ と、$R_{2} = 6.0\,\Omega$ よりも小さくなります。そのあと $R_{1}$ と直列につなぐので、足し算で $8.0\,\Omega$ です。` },
        { t: '全体の電流 → 並列部分の電圧 → $I_{3}$ の順に求める（(2)）',
          m: [R`I = \frac{E}{R} = \frac{12}{8.0} = 1.5\,\mathrm{A}`,
              R`V_{23} = R_{23}I = 4.0 \times 1.5 = 6.0\,\mathrm{V}`,
              R`I_{3} = \frac{V_{23}}{R_{3}} = \frac{6.0}{12} = 0.50\,\mathrm{A}`],
          n: R`電池から流れる全電流 $I$ は、$R_{1}$ を通ってから、$R_{2}$ と $R_{3}$ に分かれます。並列の部分では、2 つの抵抗器に共通の電圧 $V_{23}$ がかかります。`,
          easy: R`まず回路全体にオームの法則を使って、全電流 $1.5\,\mathrm{A}$ を求めます。この電流は $R_{1}$ を通り、並列の部分で枝分かれします。並列の部分にかかる電圧は、$R_{23}$ に $1.5\,\mathrm{A}$ が流れるときの $6.0\,\mathrm{V}$ です。この $6.0\,\mathrm{V}$ が $R_{2}$ にも $R_{3}$ にもそのままかかるので、$R_{3}$ の電流は $\dfrac{6.0}{12} = 0.50\,\mathrm{A}$ です。確かめとして、$R_{2}$ には $\dfrac{6.0}{6.0} = 1.0\,\mathrm{A}$ が流れ、$1.0 + 0.50 = 1.5\,\mathrm{A}$ と全電流に一致します。`,
          pro: R`並列部分の電流は、抵抗の逆比に分かれます（$I_{2} : I_{3} = R_{3} : R_{2} = 2 : 1$）。電圧は全体の $R$ の比（$R_{1} : R_{23} = 1 : 1$）で分配されます。` }
      ],
      tags: ['合成抵抗', '直並列', 'オームの法則']
    },

    {
      id: 'd-p-circuit-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-circuit',
      title: '抵抗率と消費電力',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`断面積 $0.50\,\mathrm{mm^{2}}$、長さ $3.0\,\mathrm{m}$ の一様な導線がある。この導線の材料の抵抗率は $1.0 \times 10^{-6}\,\Omega \cdot \mathrm{m}$ である。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`この導線の抵抗値 $R$ は何 $\Omega$ か。`, type: 'num', answer: 6, rel: 0.02, unit: 'Ω' },
        { label: '(2)', q: R`この導線に $12\,\mathrm{V}$ の電圧をかけたとき、導線が消費する電力 $P$ は何 $\mathrm{W}$ か。`, type: 'num', answer: 24, rel: 0.02, unit: 'W' }
      ],
      solution: [
        { t: R`導線の抵抗は $R = \rho\dfrac{\ell}{S}$（(1)）`,
          m: [R`R = \rho\frac{\ell}{S}`,
              R`S = 0.50\,\mathrm{mm^{2}} = 0.50 \times 10^{-6}\,\mathrm{m^{2}}`,
              R`R = (1.0 \times 10^{-6}) \times \frac{3.0}{0.50 \times 10^{-6}} = 6.0\,\Omega`],
          n: R`導線の抵抗は、長さ $\ell$ に比例し、断面積 $S$ に反比例します。比例定数 $\rho$ が抵抗率です。断面積は $\mathrm{m^{2}}$ に直してから代入します（$1\,\mathrm{mm} = 10^{-3}\,\mathrm{m}$ なので $1\,\mathrm{mm^{2}} = 10^{-6}\,\mathrm{m^{2}}$）。`,
          easy: R`水道管にたとえると、管が長いほど水は流れにくく（抵抗が大きく）、太いほど流れやすい（抵抗が小さい）ですね。導線も同じで、$R = \rho\dfrac{\ell}{S}$ です。$\rho$ は材料ごとに決まる「流れにくさ」の値です。注意したいのは単位で、$\mathrm{mm^{2}}$ のまま計算すると $10^{6}$ 倍もずれてしまうので、必ず $\mathrm{m^{2}}$ に直してから計算します。`,
          pro: R`$R \propto \dfrac{\ell}{S}$。導線を 2 倍の長さに引きのばすと、断面積は $\dfrac{1}{2}$ になるので、抵抗は $4$ 倍になります（体積一定）。` },
        { t: '消費電力は $P = VI$（(2)）',
          m: [R`I = \frac{V}{R} = \frac{12}{6.0} = 2.0\,\mathrm{A}`,
              R`P = VI = 12 \times 2.0 = 24\,\mathrm{W}`],
          n: R`消費電力は $P = VI$ で、オームの法則 $V = RI$ を使うと $P = RI^{2} = \dfrac{V^{2}}{R}$ とも書けます。どれで計算しても同じ値です。`,
          easy: R`電力 $P$ は「1 秒あたりに使われる電気エネルギー」です。電圧 $V$ のもとで電流 $I$ が流れるとき、$P = VI$ になります。まず電流 $I = \dfrac{12}{6.0} = 2.0\,\mathrm{A}$ を求めてから、$12 \times 2.0 = 24\,\mathrm{W}$ とします。この電力はすべて熱（ジュール熱）になって、導線が熱くなります。` }
      ],
      tags: ['抵抗率', '消費電力', 'ジュール熱']
    },

    {
      id: 'd-p-circuit-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-circuit',
      title: '電池の内部抵抗',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`起電力 $E = 6.0\,\mathrm{V}$、内部抵抗 $r = 0.50\,\Omega$ の電池に、図のように $R = 2.5\,\Omega$ の抵抗器をつないだ。`,
      fig: figInternalR(),
      parts: [
        { label: '(1)', q: R`回路を流れる電流 $I$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 2, rel: 0.02, unit: 'A' },
        { label: '(2)', q: R`電池の端子電圧 $V$（電池の両端の電圧）は何 $\mathrm{V}$ か。`, type: 'num', answer: 5, rel: 0.02, unit: 'V' }
      ],
      solution: [
        { t: '内部抵抗 $r$ と外部の抵抗 $R$ は直列（(1)）',
          m: [R`E = (R + r)I \;\Rightarrow\; I = \frac{E}{R + r}`,
              R`I = \frac{6.0}{2.5 + 0.50} = 2.0\,\mathrm{A}`],
          n: R`内部抵抗 $r$ は、電池の中で電流の流れをさまたげる抵抗です。回路を、起電力 $E$ の理想的な電池に、内部抵抗 $r$ と外部の抵抗 $R$ が直列につながったものとみなして、オームの法則を使います。`,
          easy: R`実際の電池は、中にも少し抵抗があります。これを「電池の中に小さな抵抗 $r$ がある」と考えると、回路全体は、電池 $E$ に $r$ と $R$ が直列につながったものになります。直列の合成抵抗は $R + r = 3.0\,\Omega$ なので、$I = \dfrac{6.0}{3.0} = 2.0\,\mathrm{A}$ です。` },
        { t: '端子電圧は、起電力から内部抵抗の電圧降下を引く（(2)）',
          m: [R`V = E - rI = 6.0 - 0.50 \times 2.0 = 5.0\,\mathrm{V}`,
              R`V = RI = 2.5 \times 2.0 = 5.0\,\mathrm{V} \quad (\text{一致})`],
          n: R`電池の端子電圧は、起電力 $E$ から、内部抵抗での電圧降下 $rI$ を引いたものです。端子電圧は外部の抵抗 $R$ にかかる電圧と同じなので、$V = RI$ でも求められます。`,
          easy: R`電池が $6.0\,\mathrm{V}$ の押す力をもっていても、電流が流れると、電池の中の抵抗で $rI = 0.50 \times 2.0 = 1.0\,\mathrm{V}$ ぶんが使われてしまいます。外に出てくるのは、残りの $6.0 - 1.0 = 5.0\,\mathrm{V}$ です。外の抵抗 $R$ にかかる電圧 $RI = 2.5 \times 2.0 = 5.0\,\mathrm{V}$ とも一致します。電流を多く流すほど、端子電圧は起電力より低くなります。`,
          pro: R`$V = E - rI$ は、端子電圧 $V$ を縦軸、電流 $I$ を横軸にとったグラフの式。縦切片が $E$、傾きが $-r$ の直線です。` }
      ],
      tags: ['内部抵抗', '端子電圧', '起電力']
    },

    /* ---------- 電流と磁場（p-mag） ---------- */
    {
      id: 'd-p-mag-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-mag',
      title: '直線電流がつくる磁場',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`紙面に垂直に置かれた十分に長い直線導線に、紙面の裏から表へ向かって $I = 5.0\,\mathrm{A}$ の電流を流す。図の点 P は、導線から $r = 0.10\,\mathrm{m}$ はなれた位置にある。真空の透磁率を $\mu_{0} = 4\pi \times 10^{-7}\,\mathrm{N/A^{2}}$ とする。`,
      fig: figWireField(),
      parts: [
        { label: '(1)', q: R`点 P での磁束密度の大きさ $B$ は何 $\mathrm{T}$ か。`, type: 'num', answer: 1.0e-5, rel: 0.02, unit: 'T', show: R`1.0 \times 10^{-5}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(2)', q: R`点 P での磁場の向きとして正しいものを選べ。`, type: 'choice', choices: [R`紙面の表から裏へ向かう向き`, R`導線に向かう向き（図の左向き）`, R`図の上向き`, R`図の下向き`], answer: 2 }
      ],
      solution: [
        { t: '直線電流がつくる磁場の強さ（(1)）',
          m: [R`B = \frac{\mu_{0}I}{2\pi r}`,
              R`B = \frac{(4\pi \times 10^{-7}) \times 5.0}{2\pi \times 0.10} = 1.0 \times 10^{-5}\,\mathrm{T}`],
          n: R`十分に長い直線電流から距離 $r$ の点の磁束密度は、電流 $I$ に比例し、距離 $r$ に反比例します。式の中の $\pi$ は約分できます。`,
          easy: R`電流が流れる導線のまわりには、導線を取り囲むように磁場ができます。電流が強いほど磁場は強く、導線から遠いほど弱くなります（距離に反比例）。計算では、$\dfrac{\mu_{0}}{2\pi} = \dfrac{4\pi \times 10^{-7}}{2\pi} = 2 \times 10^{-7}$ に、電流と距離の比 $\dfrac{I}{r} = \dfrac{5.0}{0.10} = 50$ をかけて、$2 \times 10^{-7} \times 50 = 1.0 \times 10^{-5}\,\mathrm{T}$ です。`,
          pro: R`$\dfrac{\mu_{0}}{2\pi} = 2 \times 10^{-7}\,\mathrm{N/A^{2}}$ を覚えておくと、$B = 2 \times 10^{-7} \times \dfrac{I}{r}$ と暗算できます。` },
        { t: '磁場の向きは右ねじの法則で決める（(2)）',
          m: [R`\text{電流（手前向き）} \;\Rightarrow\; \text{磁場は反時計回り} \;\Rightarrow\; \text{右側の P では上向き}`],
          n: R`右ねじを電流の向きに進めるとき、ねじを回す向きが磁場の向きです。電流は紙面の裏から表へ向かうので、磁場は導線のまわりを反時計回りに回ります。導線の右側にある点 P では、磁場は上向きです。`,
          easy: R`右手の親指を電流の向き（紙面から手前へ向かう向き）にそろえて、残りの 4 本の指で導線をにぎるようにします。このとき指先が向かう向きが、導線のまわりの磁場の向きです。手前に向かう親指に対して、手前から見ると指は反時計回りに巻きつきます。導線の右側では、反時計回りの流れは上向きになるので、点 P での磁場は上向きです。`,
          pro: R`向きの暗記: 電流が手前向きなら磁場は反時計回り、奥向きなら時計回り。電流が逆向きになれば、磁場も逆向きになります。` }
      ],
      tags: ['直線電流', '磁束密度', '右ねじの法則']
    },

    {
      id: 'd-p-mag-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-mag',
      title: '磁場中の電流が受ける力',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`紙面の表から裏へ向かう、磁束密度 $B = 0.20\,\mathrm{T}$ の一様な磁場がある。この磁場の中に、図のように長さ $\ell = 0.50\,\mathrm{m}$ の直線状の導線を磁場に垂直に置き、右向きに $I = 3.0\,\mathrm{A}$ の電流を流した。`,
      fig: figForceOnWire(),
      parts: [
        { label: '(1)', q: R`導線が磁場から受ける力の大きさ $F$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 0.3, rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`この力の向きとして正しいものを選べ。`, type: 'choice', choices: [R`図の下向き`, R`図の上向き`, R`紙面の表から裏へ向かう向き`, R`電流と同じ右向き`], answer: 1 }
      ],
      solution: [
        { t: R`力の大きさは $F = IB\ell$（(1)）`,
          m: [R`F = IB\ell = 3.0 \times 0.20 \times 0.50 = 0.30\,\mathrm{N}`],
          n: R`磁場に垂直な導線に電流 $I$ を流すと、磁場の中にある長さ $\ell$ の部分は、$F = IB\ell$ の力を受けます（磁場と導線のなす角が $\theta$ なら $F = IB\ell\sin\theta$ です。ここでは垂直なので $\sin\theta = 1$）。`,
          easy: R`磁場の中で電流が流れると、導線は磁場から力を受けて押されます。力の大きさは、電流 $I$ が大きいほど、磁場 $B$ が強いほど、磁場の中にある導線の長さ $\ell$ が長いほど大きくなり、3 つの積 $IB\ell$ で決まります。数値を入れると $3.0 \times 0.20 \times 0.50 = 0.30\,\mathrm{N}$ です。` },
        { t: 'フレミングの左手の法則で力の向きを決める（(2)）',
          n: R`左手の中指を電流の向き（右向き）、人さし指を磁場の向き（紙面の表から裏へ向かう向き）にそろえると、親指が力の向き（上向き）を指します。`,
          easy: R`左手の中指・人さし指・親指を、たがいに直角に開きます。中指が電流、人さし指が磁場、親指が力で、「電・磁・力」の順に覚えます。中指を右向き、人さし指を紙面の奥向きにそろえると、親指は上向きになります。`,
          pro: R`外積で $\vec{F} = I\vec{\ell} \times \vec{B}$ と考えても同じです。電流が $+x$ 向き、磁場が $-z$ 向き（紙面の奥）なら、力は $+y$ 向き（上）になります。` }
      ],
      tags: ['電流が受ける力', 'フレミングの左手の法則', 'IBℓ']
    },

    {
      id: 'd-p-mag-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-mag',
      title: 'ローレンツ力と円運動',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`紙面に垂直で、紙面の表から裏へ向かう磁束密度 $B = 2.0 \times 10^{-3}\,\mathrm{T}$ の一様な磁場の中に、電子を磁場に垂直な向きに速さ $v = 3.2 \times 10^{6}\,\mathrm{m/s}$ で打ちこんだ。電子は等速円運動をする。電子の質量を $m = 9.1 \times 10^{-31}\,\mathrm{kg}$、電気素量を $e = 1.6 \times 10^{-19}\,\mathrm{C}$ とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`電子が磁場から受ける力（ローレンツ力）の大きさ $f$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 1.024e-15, rel: 0.02, unit: 'N', show: R`1.02 \times 10^{-15}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(2)', q: R`電子がえがく円軌道の半径 $r$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 9.1e-3, rel: 0.02, unit: 'm', show: R`9.1 \times 10^{-3}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        { t: 'ローレンツ力の大きさ $f = evB$（(1)）',
          m: [R`f = evB = (1.6 \times 10^{-19}) \times (3.2 \times 10^{6}) \times (2.0 \times 10^{-3}) \fallingdotseq 1.02 \times 10^{-15}\,\mathrm{N}`],
          n: R`磁場に垂直に動く、電気量の大きさ $e$ の荷電粒子は、$f = evB$ のローレンツ力を受けます。この力は常に速度に垂直で、速さは変えずに向きだけを変えます。`,
          easy: R`磁場の中を動く電荷には、動く向きと磁場の向きの両方に直角な力がはたらきます。これがローレンツ力です。力の大きさは、電気量・速さ・磁場の強さの積 $evB$ です。計算では、指数どうしは足し算で $-19 + 6 + (-3) = -16$、係数は $1.6 \times 3.2 \times 2.0 = 10.24$ なので、$10.24 \times 10^{-16} = 1.02 \times 10^{-15}\,\mathrm{N}$ です。` },
        { t: 'ローレンツ力が向心力になる（(2)）',
          m: [R`m\frac{v^{2}}{r} = evB \;\Rightarrow\; r = \frac{mv}{eB}`,
              R`r = \frac{(9.1 \times 10^{-31}) \times (3.2 \times 10^{6})}{(1.6 \times 10^{-19}) \times (2.0 \times 10^{-3})} = 9.1 \times 10^{-3}\,\mathrm{m}`],
          n: R`ローレンツ力は常に速度に垂直なので仕事をせず、電子は等速円運動をします。この力が円の中心に向かう向心力になるので、円運動の運動方程式 $m\dfrac{v^{2}}{r} = evB$ が成り立ちます。`,
          easy: R`ローレンツ力は、電子の進行方向に対して常に横向きにはたらきます。進行方向に対して常に横から押され続けると、まっすぐには進めず、円をえがいて回ります。このとき、ローレンツ力が円の中心に向かう力（向心力）になります。円運動の運動方程式「質量 × 向心加速度 ＝ 向心力」に代入して、半径を求めます。半径 $9.1\,\mathrm{mm}$ の小さな円です。`,
          pro: R`半径 $r = \dfrac{mv}{eB}$、周期 $T = \dfrac{2\pi m}{eB}$（速さによらない）。この 2 式は、荷電粒子の円運動の基本セットです。` }
      ],
      tags: ['ローレンツ力', '円運動', '電子']
    },

    /* ---------- 電磁誘導（p-induction） ---------- */
    {
      id: 'd-p-induction-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-induction',
      title: '磁束の変化と誘導起電力',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`巻き数 $N = 50$ のコイルを貫く磁束 $\Phi$ が、図のように時間変化した。`,
      fig: figPhiT(),
      parts: [
        { label: '(1)', q: R`$t = 0$ から $0.20\,\mathrm{s}$ の間に、コイルに生じる誘導起電力の大きさ $V_{1}$ は何 $\mathrm{V}$ か。`, type: 'num', answer: 10, rel: 0.02, unit: 'V' },
        { label: '(2)', q: R`$t = 0.20\,\mathrm{s}$ から $0.50\,\mathrm{s}$ の間に、コイルに生じる誘導起電力の大きさ $V_{2}$ は何 $\mathrm{V}$ か。`, type: 'num', answer: 5, rel: 0.02, unit: 'V' }
      ],
      solution: [
        { t: 'ファラデーの法則は「巻き数 × グラフの傾き」（(1)）',
          m: [R`V = N\left|\frac{\Delta\Phi}{\Delta t}\right|`,
              R`V_{1} = 50 \times \frac{0.050 - 0.010}{0.20 - 0} = 50 \times 0.20 = 10\,\mathrm{V}`],
          n: R`ファラデーの電磁誘導の法則: コイルに生じる誘導起電力の大きさは、巻き数 $N$ と、磁束の単位時間あたりの変化量 $\left|\dfrac{\Delta\Phi}{\Delta t}\right|$（$\Phi$–$t$ グラフの傾きの大きさ）の積です。`,
          easy: R`コイルを貫く磁束が変化すると、その変化をさまたげるように電圧（誘導起電力）が生じます。変化が速い（グラフの傾きが急な）ほど、また巻き数が多い（同じ変化を $N$ 回ぶん受ける）ほど、電圧は大きくなります。この区間のグラフの傾きは $\dfrac{0.040\,\mathrm{Wb}}{0.20\,\mathrm{s}} = 0.20\,\mathrm{Wb/s}$ で、巻き数 $50$ をかけて $10\,\mathrm{V}$ です。`,
          pro: R`$\Phi$–$t$ グラフの傾きを読んで $N$ 倍する、が基本の型。傾きの符号は、誘導電流の向き（レンツの法則）の判断に使います。` },
        { t: '減少している区間も、傾きの大きさで求める（(2)）',
          m: [R`V_{2} = 50 \times \left|\frac{0.020 - 0.050}{0.50 - 0.20}\right| = 50 \times 0.10 = 5.0\,\mathrm{V}`],
          n: R`磁束が減少している区間でも、起電力の「大きさ」は傾きの絶対値で求めます（向きは増加のときと逆になります）。`,
          easy: R`この区間は磁束が減っているので、グラフの傾きは負ですが、電圧の大きさを聞かれているので、傾きの大きさ $\dfrac{0.030}{0.30} = 0.10\,\mathrm{Wb/s}$ を使います。傾きがゆるやかなぶん、起電力は前の区間の半分の $5.0\,\mathrm{V}$ です。誘導電流の向きは、磁束が増えるときとは逆になります（レンツの法則）。` }
      ],
      tags: ['ファラデーの法則', '誘導起電力', 'Φ-tグラフ']
    },

    {
      id: 'd-p-induction-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-induction',
      title: '動く導体棒の誘導起電力',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図は、水平面内に間隔 $\ell = 0.20\,\mathrm{m}$ の平行なレールを置き、左端を抵抗値 $R = 0.60\,\Omega$ の抵抗器でつないだものを、真上から見たものである。レールに垂直に導体棒をのせ、紙面の表から裏へ向かう磁束密度 $B = 0.50\,\mathrm{T}$ の一様な磁場の中で、棒を右向きに一定の速さ $v = 3.0\,\mathrm{m/s}$ で動かす。棒とレールの電気抵抗は無視できる。`,
      fig: figRailRod(),
      parts: [
        { label: '(1)', q: R`棒に生じる誘導起電力の大きさ $V$ は何 $\mathrm{V}$ か。`, type: 'num', answer: 0.3, rel: 0.02, unit: 'V' },
        { label: '(2)', q: R`抵抗器を流れる電流 $I$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.5, rel: 0.02, unit: 'A' }
      ],
      solution: [
        { t: R`動く導体棒の誘導起電力は $V = vB\ell$（(1)）`,
          m: [R`V = vB\ell = 3.0 \times 0.50 \times 0.20 = 0.30\,\mathrm{V}`],
          n: R`磁場の中を、磁場に垂直な向きに速さ $v$ で動く、長さ $\ell$ の導体棒には、$V = vB\ell$ の誘導起電力が生じます。`,
          easy: R`棒が動くと、棒の中の自由電子も磁場の中を一緒に動くので、ローレンツ力を受けて棒の一方の端に押し寄せます。これが電池と同じはたらきをして、電圧（誘導起電力）が生じます。速く動かすほど、磁場が強いほど、棒が長いほど大きくなり、大きさは $vB\ell$ です。別の見方として、回路の面積が 1 秒に $v\ell$ ずつ増えるので、磁束は 1 秒に $Bv\ell$ ずつ増え、ファラデーの法則でも同じ値になります。` },
        { t: '棒を電池とみなして、オームの法則を使う（(2)）',
          m: [R`I = \frac{V}{R} = \frac{0.30}{0.60} = 0.50\,\mathrm{A}`],
          n: R`棒が電池の役割をする回路とみなして、オームの法則を使います。棒とレールの抵抗は無視できるので、回路の抵抗は $R$ だけです。`,
          easy: R`棒を、起電力 $0.30\,\mathrm{V}$ の電池と考えます。この電池に $0.60\,\Omega$ の抵抗器がつながっているので、$I = \dfrac{V}{R}$ です。`,
          pro: R`この電流が磁場から受ける力 $F = IB\ell = 0.50 \times 0.50 \times 0.20 = 0.050\,\mathrm{N}$ は、棒の運動をさまたげる向きです。一定の速さで動かすには、同じ大きさの力で押し続ける必要があり、その仕事率 $Fv = 0.15\,\mathrm{W}$ は、抵抗器のジュール熱 $I^{2}R = 0.15\,\mathrm{W}$ に等しくなります（エネルギー保存）。` }
      ],
      tags: ['導体棒', '誘導起電力', 'vBℓ']
    },

    {
      id: 'd-p-induction-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-induction',
      title: 'レンツの法則',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、コイルの真上から、棒磁石の N 極を下に向けて、コイルに近づける。`,
      fig: figLenz(),
      parts: [
        { label: '(1)', q: R`コイルを真上から見たとき、コイルに流れる誘導電流の向きはどちらか。`, type: 'choice', choices: [R`時計回り`, R`反時計回り`], answer: 1 },
        { label: '(2)', q: R`棒磁石がコイルから受ける力の向きはどちらか。`, type: 'choice', choices: [R`上向き（磁石を遠ざける向き）`, R`下向き（磁石を引きこむ向き）`], answer: 0 }
      ],
      solution: [
        { t: '磁束の変化をさまたげる向きに磁場をつくる（(1)）',
          m: [R`\text{下向きの磁束が増える} \;\Rightarrow\; \text{上向きの磁場をつくる向きに電流が流れる}`],
          n: R`N 極が近づくと、コイルを貫く下向きの磁束が増加します。レンツの法則により、誘導電流は、この磁束の増加をさまたげる向き、つまりコイルの中に上向きの磁場をつくる向きに流れます。`,
          easy: R`磁石の N 極からは、磁力線が外へ向かって出ていきます。N 極が下向きにコイルへ近づくと、コイルの中を下向きに通る磁力線が増えます。コイルには「変化をいやがる」性質があり、増えたぶんを打ち消そうとして、上向きの磁場をつくる電流を流します。` },
        { t: '右ねじの法則で電流の向きを決める（(1)）',
          n: R`上向きの磁場をつくる電流の向きは、右ねじの法則で決まります。右ねじを上向きに進めるとき、ねじを回す向きに電流が流れるので、真上から見ると反時計回りです。`,
          easy: R`右手の親指を上向き（つくりたい磁場の向き）にそろえて、残りの指でコイルをにぎるようにします。このとき指先が向かう向きが電流の向きです。真上から見ると、指先は反時計回りに回っています。` },
        { t: '誘導電流は、磁石の動きをさまたげる力を生む（(2)）',
          n: R`コイルには、上向きの磁場をつくる電流が流れているので、コイルの上側が N 極の電磁石になります。近づく磁石の N 極と反発するので、磁石は上向き（遠ざける向き）の力を受けます。このように、誘導電流は、磁石を近づける変化をさまたげる向きにはたらきます。`,
          easy: R`コイルの上側が N 極になると、近づいてくる N 極どうしが反発して、磁石を押し返します。「近づけようとすると押し返され、遠ざけようとすると引き戻される」のがレンツの法則の結論です。これは、外から加えた力の仕事が、電気エネルギー（誘導電流）に変わっているという、エネルギー保存の表れでもあります。`,
          pro: R`向きの判断は「磁束の変化を打ち消す向きに磁場をつくる」の一言。結論を先に言うと、磁石が近づく → 押し返す（斥力）、遠ざかる → 引き戻す（引力）です。` }
      ],
      tags: ['レンツの法則', '誘導電流の向き', '右ねじの法則']
    },

    /* ---------- 交流（p-ac） ---------- */
    {
      id: 'd-p-ac-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-ac',
      title: '交流電圧のグラフ',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図は、ある交流電圧 $v$ の時間変化を表すグラフである。最大値は $100\sqrt{2} \fallingdotseq 141\,\mathrm{V}$ である。`,
      fig: figACGraph(),
      parts: [
        { label: '(1)', q: R`この交流の周波数（振動数）$f$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 50, rel: 0.02, unit: 'Hz' },
        { label: '(2)', q: R`この交流電圧の実効値 $V_{\mathrm{e}}$ は何 $\mathrm{V}$ か。`, type: 'num', answer: 100, rel: 0.02, unit: 'V' }
      ],
      solution: [
        { t: 'グラフから周期を読み、逆数で周波数を求める（(1)）',
          m: [R`T = 0.020\,\mathrm{s}`,
              R`f = \frac{1}{T} = \frac{1}{0.020} = 50\,\mathrm{Hz}`],
          n: R`周期 $T$ は 1 回の振動にかかる時間で、グラフでは波形が 1 回くり返される時間です。周波数（振動数）$f$ は 1 秒間の振動の回数で、$T$ の逆数です。`,
          easy: R`グラフを見ると、$t = 0$ から $0.020\,\mathrm{s}$ までで、波が 1 回ぶん（山 1 つと谷 1 つ）できています。$0.020$ 秒で 1 回なら、1 秒では $1 \div 0.020 = 50$ 回です。これが周波数 $50\,\mathrm{Hz}$ で、東日本の家庭用の電源と同じ周波数です。` },
        { t: R`実効値は最大値の $\dfrac{1}{\sqrt{2}}$ 倍（(2)）`,
          m: [R`V_{\mathrm{e}} = \frac{V_{0}}{\sqrt{2}} = \frac{100\sqrt{2}}{\sqrt{2}} = 100\,\mathrm{V}`],
          n: R`交流の実効値は、「同じ抵抗で同じ熱を発生させる直流の値」で、正弦波では最大値 $V_{0}$ の $\dfrac{1}{\sqrt{2}}$ 倍です。`,
          easy: R`交流の電圧は刻々と変わるので、「いくらの電圧か」をひとつの値で表すために、実効値を使います。最大値の $141\,\mathrm{V}$ になるのは一瞬だけで、ほとんどの時間はそれより小さいので、実効値は最大値より小さくなります。正弦波では、最大値を $\sqrt{2}$（約 $1.41$）でわった値です。ふだん「家庭のコンセントは $100\,\mathrm{V}$」と言うのは、この実効値のことです。`,
          pro: R`$V_{\mathrm{e}} = \dfrac{V_{0}}{\sqrt{2}}$、$I_{\mathrm{e}} = \dfrac{I_{0}}{\sqrt{2}}$。抵抗だけの回路の平均電力は $\overline{P} = V_{\mathrm{e}}I_{\mathrm{e}}$ です。` }
      ],
      tags: ['交流', '周期と周波数', '実効値']
    },

    {
      id: 'd-p-ac-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-ac',
      title: 'コイルとコンデンサー',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`角周波数 $\omega = 100\,\mathrm{rad/s}$、実効値 $20\,\mathrm{V}$ の交流電源がある。この電源を、自己インダクタンス $L = 0.20\,\mathrm{H}$ のコイルだけにつないだ場合と、電気容量 $C = 250\,\mu\mathrm{F}$ のコンデンサーだけにつないだ場合を考える。$1\,\mu\mathrm{F} = 10^{-6}\,\mathrm{F}$ とし、コイルや導線の抵抗は無視できる。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`コイルのリアクタンス $X_{L}$ は何 $\Omega$ か。`, type: 'num', answer: 20, rel: 0.02, unit: 'Ω' },
        { label: '(2)', q: R`コンデンサーを流れる電流の実効値 $I_{C}$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.5, rel: 0.02, unit: 'A' }
      ],
      solution: [
        { t: R`コイルのリアクタンスは $X_{L} = \omega L$（(1)）`,
          m: [R`X_{L} = \omega L = 100 \times 0.20 = 20\,\Omega`],
          n: R`コイルは、電流の変化をさまたげる（自己誘導）ので、交流に対して抵抗のようにはたらきます。その大きさがリアクタンス $X_{L} = \omega L$ です。周波数が高い（$\omega$ が大きい）ほど電流の変化が速くなり、流れにくくなります。`,
          easy: R`コイルには、「電流が変化するのをいやがる」性質があります。交流は電流が絶えず入れかわる（変化が速い）ので、コイルは大きな「流れにくさ」をもちます。この流れにくさをリアクタンスといい、単位は抵抗と同じ $\Omega$ です。$\omega L = 100 \times 0.20 = 20\,\Omega$ です（変化のない直流では $\omega = 0$ で、理想的なコイルの $X_{L}$ は $0$ になります）。` },
        { t: R`コンデンサーのリアクタンスは $X_{C} = \dfrac{1}{\omega C}$（(2)）`,
          m: [R`X_{C} = \frac{1}{\omega C} = \frac{1}{100 \times (250 \times 10^{-6})} = 40\,\Omega`,
              R`I_{C} = \frac{V}{X_{C}} = \frac{20}{40} = 0.50\,\mathrm{A}`],
          n: R`コンデンサーは、周波数が高いほど、また容量が大きいほど、電流が流れやすくなります。そのリアクタンスは $X_{C} = \dfrac{1}{\omega C}$ です。オームの法則と同じ形 $V = X_{C}I$ が、実効値どうしで成り立ちます。`,
          easy: R`コンデンサーは、電気をためたり放したりすることで、交流をくり返し通します。ためられる量（容量 $C$）が大きいほど、また電源の向きが速く入れかわる（$\omega$ が大きい）ほど、たくさんの電流が流れます。そのため、流れにくさ（リアクタンス）は $\omega C$ の逆数です。$\omega C = 100 \times 250 \times 10^{-6} = 0.025$ なので $X_{C} = \dfrac{1}{0.025} = 40\,\Omega$、電流は $\dfrac{20}{40} = 0.50\,\mathrm{A}$ です。`,
          pro: R`$X_{L} = \omega L$（$\omega$ に比例）、$X_{C} = \dfrac{1}{\omega C}$（$\omega$ に反比例）。位相は、コイルでは電流が電圧より $\dfrac{\pi}{2}$ 遅れ、コンデンサーでは $\dfrac{\pi}{2}$ 進みます。` }
      ],
      tags: ['リアクタンス', 'コイル', 'コンデンサー']
    },

    {
      id: 'd-p-ac-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-ac',
      title: '変圧器',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`図のように、1 次コイルの巻き数が $500$、2 次コイルの巻き数が $50$ の変圧器（理想的なもの）がある。1 次コイルに実効値 $100\,\mathrm{V}$ の交流電圧を加え、2 次コイルに $5.0\,\Omega$ の抵抗器をつないだ。`,
      fig: figTransformer(),
      parts: [
        { label: '(1)', q: R`2 次コイルの電圧の実効値 $V_{2}$ は何 $\mathrm{V}$ か。`, type: 'num', answer: 10, rel: 0.02, unit: 'V' },
        { label: '(2)', q: R`1 次コイルを流れる電流の実効値 $I_{1}$ は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.2, rel: 0.02, unit: 'A' }
      ],
      solution: [
        { t: '電圧は巻き数に比例する（(1)）',
          m: [R`\frac{V_{2}}{V_{1}} = \frac{N_{2}}{N_{1}} \;\Rightarrow\; V_{2} = 100 \times \frac{50}{500} = 10\,\mathrm{V}`],
          n: R`変圧器では、1 次コイルと 2 次コイルの電圧の比が、巻き数の比に等しくなります。$N_{2} < N_{1}$ なので、電圧は下がります（降圧）。`,
          easy: R`変圧器は、鉄心に巻いた 2 つのコイルの間で、電磁誘導を使って電圧を変える装置です。1 次コイルに交流を流すと、鉄心の中の磁束が変化し、同じ磁束変化が 2 次コイルにも伝わります。コイル 1 巻きあたりに生じる電圧は同じなので、全体の電圧は巻き数に比例します。巻き数が $\dfrac{1}{10}$ なので、電圧も $\dfrac{1}{10}$ の $10\,\mathrm{V}$ です。` },
        { t: '電力は変わらない（(2)）',
          m: [R`I_{2} = \frac{V_{2}}{R} = \frac{10}{5.0} = 2.0\,\mathrm{A}`,
              R`V_{1}I_{1} = V_{2}I_{2} \;\Rightarrow\; I_{1} = \frac{V_{2}I_{2}}{V_{1}} = \frac{10 \times 2.0}{100} = 0.20\,\mathrm{A}`],
          n: R`理想的な変圧器では電力の損失がないので、1 次側が受け取る電力と、2 次側で消費する電力が等しくなります。電圧が $\dfrac{1}{10}$ になるぶん、電流は $10$ 倍になります。`,
          easy: R`2 次側の抵抗器は、$V_{2}I_{2} = 10 \times 2.0 = 20\,\mathrm{W}$ の電力を消費しています。この電力は 1 次側から送られてくるので、1 次側でも $V_{1}I_{1} = 20\,\mathrm{W}$ でなければなりません。$V_{1} = 100\,\mathrm{V}$ なので、$I_{1} = \dfrac{20}{100} = 0.20\,\mathrm{A}$ です。変圧器は、電圧を下げると電流が増え、電圧を上げると電流が減ります（電力は変わりません）。`,
          pro: R`電流比は巻き数の逆比（$\dfrac{I_{1}}{I_{2}} = \dfrac{N_{2}}{N_{1}}$）。送電では、高電圧にして電流を小さくし、送電線でのジュール熱 $rI^{2}$ を減らします。` }
      ],
      tags: ['変圧器', '巻き数比', '電力']
    },

    /* ---------- 光の粒子性（p-photon） ---------- */
    {
      id: 'd-p-photon-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-photon',
      title: '光子のエネルギー',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`波長 $500\,\mathrm{nm}$ の光（真空中）を考える。真空中の光の速さを $c = 3.0 \times 10^{8}\,\mathrm{m/s}$、プランク定数を $h = 6.6 \times 10^{-34}\,\mathrm{J \cdot s}$ とする。$1\,\mathrm{nm} = 10^{-9}\,\mathrm{m}$ である。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`この光の振動数 $\nu$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 6.0e14, rel: 0.02, unit: 'Hz', show: R`6.0 \times 10^{14}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(2)', q: R`この光の光子 1 個がもつエネルギー $E$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 3.96e-19, rel: 0.02, unit: 'J', show: R`3.96 \times 10^{-19}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        { t: R`波の基本式 $c = \nu\lambda$ から振動数を求める（(1)）`,
          m: [R`c = \nu\lambda \;\Rightarrow\; \nu = \frac{c}{\lambda} = \frac{3.0 \times 10^{8}}{500 \times 10^{-9}} = 6.0 \times 10^{14}\,\mathrm{Hz}`],
          n: R`光も波なので、波の基本式 $c = \nu\lambda$ が成り立ちます（光速 $c$、振動数 $\nu$、波長 $\lambda$）。$\lambda = 500\,\mathrm{nm} = 5.0 \times 10^{-7}\,\mathrm{m}$ です。`,
          easy: R`光は波の一種で、「速さ ＝ 振動数 × 波長」が成り立ちます。光の速さは真空中で $3.0 \times 10^{8}\,\mathrm{m/s}$ です。波長 $500\,\mathrm{nm}$ は $5.0 \times 10^{-7}\,\mathrm{m}$ なので、$\nu = \dfrac{3.0 \times 10^{8}}{5.0 \times 10^{-7}} = 6.0 \times 10^{14}\,\mathrm{Hz}$ です。1 秒間に $6 \times 10^{14}$ 回も振動する、とても速い波です。` },
        { t: R`光子 1 個のエネルギーは $E = h\nu$（(2)）`,
          m: [R`E = h\nu = \frac{hc}{\lambda}`,
              R`E = (6.6 \times 10^{-34}) \times (6.0 \times 10^{14}) = 3.96 \times 10^{-19}\,\mathrm{J}`],
          n: R`光は、$E = h\nu$ のエネルギーをもつ粒（光子）の流れとしてもふるまいます。$h$ はプランク定数です。振動数が大きい（波長が短い）光ほど、光子 1 個のエネルギーが大きくなります。`,
          easy: R`光は波であると同時に、「光子」という小さな粒の集まりでもあります。光子 1 個のエネルギーは、光の振動数 $\nu$ に比例し、$E = h\nu$ で決まります。$h$ は比例定数（プランク定数）です。この光子のエネルギーは約 $4.0 \times 10^{-19}\,\mathrm{J}$ で、とても小さい値です。$1\,\mathrm{eV} = 1.6 \times 10^{-19}\,\mathrm{J}$ を使うと、約 $2.5\,\mathrm{eV}$ にあたります。`,
          pro: R`$E = \dfrac{hc}{\lambda}$ を直接使えば、振動数を経由せずに 1 行で出せます。$hc \fallingdotseq 1240\,\mathrm{eV \cdot nm}$ を覚えておくと、$\dfrac{1240}{500} \fallingdotseq 2.5\,\mathrm{eV}$ と暗算できます。` }
      ],
      tags: ['光子', 'プランク定数', 'E = hν']
    },

    {
      id: 'd-p-photon-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-photon',
      title: '光電効果とK–νグラフ',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`ある金属の表面に光を当てると、光の振動数がある値より大きいときだけ光電子が飛び出す。図は、飛び出す光電子の運動エネルギーの最大値 $K$ と、当てる光の振動数 $\nu$ の関係を表すグラフである（破線は直線の延長）。プランク定数を $h = 6.6 \times 10^{-34}\,\mathrm{J \cdot s}$ とする。`,
      fig: figPhotoK(),
      parts: [
        { label: '(1)', q: R`この金属の仕事関数 $W$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 3.3e-19, rel: 0.02, unit: 'J', show: R`3.3 \times 10^{-19}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(2)', q: R`振動数 $9.0 \times 10^{14}\,\mathrm{Hz}$ の光を当てたとき、飛び出す光電子の運動エネルギーの最大値 $K$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 2.64e-19, rel: 0.02, unit: 'J', show: R`2.64 \times 10^{-19}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        { t: R`グラフが $\nu$ 軸と交わる点が限界振動数 $\nu_{0}$（(1)）`,
          m: [R`h\nu_{0} = W`,
              R`W = (6.6 \times 10^{-34}) \times (5.0 \times 10^{14}) = 3.3 \times 10^{-19}\,\mathrm{J}`],
          n: R`グラフが $\nu$ 軸と交わる点 $\nu_{0}$ が限界振動数です。そこでは光電子の運動エネルギーが $0$ になるので、光子のエネルギー $h\nu_{0}$ が、仕事関数 $W$（電子を金属から取り出すのに必要な最小のエネルギー）にちょうど等しくなります。`,
          easy: R`金属の中の電子は、金属にしばられています。電子を外へ取り出すには、決まった大きさのエネルギー（仕事関数 $W$）が必要です。光子 1 個が電子 1 個にエネルギーを渡すので、光子のエネルギー $h\nu$ が $W$ にちょうど届くときの振動数が、限界振動数 $\nu_{0}$ です。これより振動数が小さいと、光をどれだけ強くしても電子は飛び出しません。` },
        { t: R`光電効果の式 $K = h\nu - W$（(2)）`,
          m: [R`K = h\nu - W`,
              R`K = (6.6 \times 10^{-34}) \times (9.0 \times 10^{14}) - 3.3 \times 10^{-19} = 5.94 \times 10^{-19} - 3.3 \times 10^{-19} = 2.64 \times 10^{-19}\,\mathrm{J}`],
          n: R`エネルギー保存の式です。光子のエネルギー $h\nu$ のうち、$W$ を電子を取り出すために使い、残りが飛び出した電子の運動エネルギーになります。最も浅いところから飛び出す電子の運動エネルギーが最大値 $K$ です。`,
          easy: R`光子 1 個のエネルギー $5.94 \times 10^{-19}\,\mathrm{J}$ のうち、$3.3 \times 10^{-19}\,\mathrm{J}$ が「電子を金属から引きはがす」のに使われ、残りの $2.64 \times 10^{-19}\,\mathrm{J}$ が電子の運動エネルギーになります。グラフでいうと、$\nu = 9.0 \times 10^{14}\,\mathrm{Hz}$ のところの直線の高さです。直線の傾きは $h$ に等しく、金属の種類を変えても傾きは変わりません（$\nu_{0}$ だけが変わります）。`,
          pro: R`$K$–$\nu$ グラフ: 傾き $= h$、$\nu$ 切片 $= \nu_{0}$、$K$ 切片 $= -W$。この 3 つを読めれば、光電効果のグラフ問題はほぼ解けます。` }
      ],
      tags: ['光電効果', '仕事関数', '限界振動数']
    },

    {
      id: 'd-p-photon-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-photon',
      title: '阻止電圧と光の強さ',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`ある金属に、限界振動数より大きい振動数の単色光を当てると、光電子が飛び出す。光電管の電圧を、光電子を押しもどす向きにかけていくと、電圧が $V_{0} = 1.5\,\mathrm{V}$（阻止電圧）のとき、光電流がちょうど $0$ になった。電気素量を $e = 1.6 \times 10^{-19}\,\mathrm{C}$ とする。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`飛び出した光電子の運動エネルギーの最大値 $K$ は何 $\mathrm{J}$ か。`, type: 'num', answer: 2.4e-19, rel: 0.02, unit: 'J', show: R`2.4 \times 10^{-19}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(2)', q: R`当てる光の振動数は変えずに、光の強さだけを $2$ 倍にした。このとき正しい記述を選べ。`, type: 'choice', choices: [R`阻止電圧は $2$ 倍になり、光電流の最大値（飽和電流）は変わらない。`, R`阻止電圧は変わらず、光電流の最大値（飽和電流）は $2$ 倍になる。`, R`阻止電圧も、光電流の最大値も、$2$ 倍になる。`, R`阻止電圧も、光電流の最大値も、変わらない。`], answer: 1 }
      ],
      solution: [
        { t: R`阻止電圧のとき、$eV_{0} = K$（(1)）`,
          m: [R`eV_{0} = K \;\Rightarrow\; K = (1.6 \times 10^{-19}) \times 1.5 = 2.4 \times 10^{-19}\,\mathrm{J}`],
          n: R`逆向きの電圧をかけると、光電子は電場から減速させられます。最も速い光電子でも極板に届かなくなる最小の電圧が阻止電圧 $V_{0}$ で、そのとき光電子の運動エネルギーの最大値 $K$ が、電場にさからってする仕事 $eV_{0}$ にちょうど等しくなります。`,
          easy: R`電圧を逆向きにかけると、飛び出した電子は向かい風を受けて減速します。電圧を上げていくと、いちばん速い電子でも向かい側の電極にたどり着けなくなる瞬間があり、そのときの電圧が阻止電圧です。電子が電圧 $V_{0}$ の坂を登りきれる最大のエネルギーは $eV_{0}$ なので、これがちょうど運動エネルギーの最大値 $K$ に等しくなります。$1.6 \times 10^{-19} \times 1.5 = 2.4 \times 10^{-19}\,\mathrm{J}$ です（$1\,\mathrm{eV}$ は電子が $1\,\mathrm{V}$ の電圧で得るエネルギーなので、$K = 1.5\,\mathrm{eV}$ とも言えます）。` },
        { t: '光の強さは光子の数、光子 1 個のエネルギーは振動数で決まる（(2)）',
          n: R`光子 1 個のエネルギー $h\nu$ は振動数だけで決まります。光の強さを $2$ 倍にしても振動数が同じなら、光子 1 個のエネルギーは変わらず、光電子の運動エネルギーの最大値 $K$ も、したがって阻止電圧 $V_{0}$ も変わりません。一方、光の強さは、単位時間に当たる光子の数に比例するので、飛び出す光電子の数が $2$ 倍になり、光電流の最大値（飽和電流）が $2$ 倍になります。`,
          easy: R`光を「光子の雨」と考えましょう。雨粒 1 つの大きさ（エネルギー）は振動数で決まり、光の強さは雨粒の数です。強い光は、同じ大きさの雨粒がたくさん降ってくるイメージです。電子 1 個が受け取るエネルギーは変わらないので、電子が飛び出す勢い（$K$、したがって阻止電圧）は同じです。飛び出す電子の数だけが $2$ 倍になるので、光電流が $2$ 倍になります。`,
          pro: R`光電効果の 3 つの特徴: ① $K$ は振動数だけで決まり、強さによらない。② 限界振動数より小さいと、強くしても飛び出さない。③ 飛び出す電子の数（光電流）は光の強さに比例する。` }
      ],
      tags: ['阻止電圧', '光の強さ', '光電流']
    },

    /* ---------- 原子構造（p-atom） ---------- */
    {
      id: 'd-p-atom-01',
      subject: 'physics',
      level: 'drill',
      unit: 'p-atom',
      title: '水素原子のエネルギー準位',
      source: { univ: 'オリジナル' },
      time: 4,
      body: R`水素原子の電子のエネルギーは、とびとびの値 $E_{n} = -\dfrac{13.6}{n^{2}}\,\mathrm{eV}$（$n = 1, 2, 3, \cdots$）だけをとる。電子が $n = 3$ の軌道から $n = 2$ の軌道へ移るとき、光子 1 個が放出される（図）。$h = 6.6 \times 10^{-34}\,\mathrm{J \cdot s}$、$c = 3.0 \times 10^{8}\,\mathrm{m/s}$、$1\,\mathrm{eV} = 1.6 \times 10^{-19}\,\mathrm{J}$ とする。`,
      fig: figLevels(),
      parts: [
        { label: '(1)', q: R`放出される光子のエネルギーは何 $\mathrm{eV}$ か。`, type: 'num', answer: 1.89, rel: 0.02, unit: 'eV' },
        { label: '(2)', q: R`この光の波長は何 $\mathrm{m}$ か。`, type: 'num', answer: 6.55e-7, rel: 0.02, unit: 'm', show: R`6.55 \times 10^{-7}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        { t: 'エネルギー準位の差が、光子 1 個のエネルギーになる（(1)）',
          m: [R`E_{3} = -\frac{13.6}{3^{2}} = -1.51\,\mathrm{eV}, \qquad E_{2} = -\frac{13.6}{2^{2}} = -3.40\,\mathrm{eV}`,
              R`h\nu = E_{3} - E_{2} = -1.51 - (-3.40) = 1.89\,\mathrm{eV}`],
          n: R`電子が高いエネルギー準位 $E_{n}$ から低い準位 $E_{n'}$ へ移るとき、そのエネルギーの差が光子 1 個として放出されます（$h\nu = E_{n} - E_{n'}$）。`,
          easy: R`原子の中の電子は、決まったエネルギーの「階段」にしか立てません。階段を下りるとき、エネルギーの差が光として出てきます。$n = 3$ のエネルギーは $-1.51\,\mathrm{eV}$、$n = 2$ は $-3.40\,\mathrm{eV}$ で、その差は $1.89\,\mathrm{eV}$ です。エネルギーが負になっているのは、電子が原子核にしばられている状態を、「完全にはなれた状態を $0$」として測っているからです。`,
          pro: R`$E_{3} - E_{2} = 13.6\left(\dfrac{1}{2^{2}} - \dfrac{1}{3^{2}}\right) = 13.6 \times \dfrac{5}{36}$ と、分数のまま計算すると速い。` },
        { t: R`光子のエネルギー $E = \dfrac{hc}{\lambda}$ から波長を求める（(2)）`,
          m: [R`E = 1.89 \times (1.6 \times 10^{-19}) = 3.024 \times 10^{-19}\,\mathrm{J}`,
              R`\lambda = \frac{hc}{E} = \frac{(6.6 \times 10^{-34}) \times (3.0 \times 10^{8})}{3.024 \times 10^{-19}} \fallingdotseq 6.55 \times 10^{-7}\,\mathrm{m}`],
          n: R`光子のエネルギーは $E = h\nu = \dfrac{hc}{\lambda}$ なので、$\lambda = \dfrac{hc}{E}$ です。$\mathrm{eV}$ を $\mathrm{J}$ に直してから代入します。`,
          easy: R`エネルギーの単位をそろえるのがコツです。$1\,\mathrm{eV} = 1.6 \times 10^{-19}\,\mathrm{J}$ なので、$1.89\,\mathrm{eV}$ は $3.024 \times 10^{-19}\,\mathrm{J}$ です。これを $\lambda = \dfrac{hc}{E}$ に入れると、波長は約 $6.55 \times 10^{-7}\,\mathrm{m}$（$655\,\mathrm{nm}$）で、赤色の可視光（水素原子のバルマー系列のうち、最も波長の長い線）です。`,
          pro: R`$hc \fallingdotseq 1240\,\mathrm{eV \cdot nm}$ を覚えておくと、$\lambda = \dfrac{1240}{1.89} \fallingdotseq 6.6 \times 10^{2}\,\mathrm{nm}$ と暗算できます。` }
      ],
      tags: ['エネルギー準位', '水素原子', '光の放出']
    },

    {
      id: 'd-p-atom-02',
      subject: 'physics',
      level: 'drill',
      unit: 'p-atom',
      title: 'α崩壊とβ崩壊',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`ウラン $ {}^{238}_{92}\mathrm{U}$ の原子核が、$\alpha$ 崩壊を 1 回、$\beta$ 崩壊を 2 回おこなって、別の原子核になった。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`崩壊後の原子核の質量数はいくつか。`, type: 'num', answer: 234, tol: 0.01 },
        { label: '(2)', q: R`崩壊後の原子核の原子番号はいくつか。`, type: 'num', answer: 92, tol: 0.01 }
      ],
      solution: [
        { t: R`$\alpha$ 崩壊と $\beta$ 崩壊で、質量数 $A$ と原子番号 $Z$ はどう変わるか`,
          m: [R`\alpha \text{ 崩壊（ヘリウムの原子核が飛び出す）}: \quad A \to A - 4, \quad Z \to Z - 2`,
              R`\beta \text{ 崩壊（電子が飛び出す）}: \quad A \to A, \quad Z \to Z + 1`],
          n: R`原子番号 $Z$ は陽子の数、質量数 $A$ は陽子と中性子の数の合計です。$\alpha$ 線の正体は、陽子 $2$ 個と中性子 $2$ 個からなるヘリウムの原子核なので、$\alpha$ 崩壊では $A$ が $4$、$Z$ が $2$ 減ります。$\beta$ 崩壊では、原子核の中の中性子 $1$ 個が陽子 $1$ 個に変わって電子（$\beta$ 線）が飛び出すので、$A$ は変わらず、$Z$ が $1$ 増えます。`,
          easy: R`原子核は「陽子」と「中性子」でできています。原子番号は陽子の数、質量数は陽子と中性子を合わせた数です。$\alpha$ 崩壊は、陽子 2 個と中性子 2 個のかたまりが飛び出すので、質量数が $4$、原子番号が $2$ 減ります。$\beta$ 崩壊は、中性子が陽子に入れかわる変化なので、合計の数（質量数）は変わらず、陽子が 1 個増えて原子番号が $1$ 増えます。`,
          pro: R`$\alpha$ 崩壊は $(A, Z) \to (A - 4, Z - 2)$、$\beta$ 崩壊は $(A, Z) \to (A, Z + 1)$。崩壊の回数が分からない問題では、質量数の変化（$4$ の倍数）から $\alpha$ 崩壊の回数を先に決めます。` },
        { t: '回数をかけて、変化を足す（(1)(2)）',
          m: [R`A = 238 - 4 \times 1 = 234`,
              R`Z = 92 - 2 \times 1 + 1 \times 2 = 92`],
          n: R`$\alpha$ 崩壊 1 回、$\beta$ 崩壊 2 回なので、質量数は $238 - 4 = 234$、原子番号は $92 - 2 + 2 = 92$ です。原子番号が $92$ のままなので、元と同じウランの原子核（質量数が $234$ の $ {}^{234}_{92}\mathrm{U}$）になります。`,
          easy: R`順番に追ってみましょう。$ {}^{238}_{92}\mathrm{U}$ が $\alpha$ 崩壊すると、質量数 $234$、原子番号 $90$ のトリウムになります。次の $\beta$ 崩壊で原子番号が $91$（プロトアクチニウム）、さらにもう 1 回の $\beta$ 崩壊で原子番号が $92$（ウラン）になります。質量数は、最初の $\alpha$ 崩壊で $4$ 減っただけで、あとは変わりません。` }
      ],
      tags: ['α崩壊', 'β崩壊', '質量数・原子番号']
    },

    {
      id: 'd-p-atom-03',
      subject: 'physics',
      level: 'drill',
      unit: 'p-atom',
      title: '半減期と残る原子核の数',
      source: { univ: 'オリジナル' },
      time: 3,
      body: R`ある放射性原子核の半減期は $6.0$ 時間である。はじめにこの原子核が $N_{0} = 8.0 \times 10^{10}$ 個あった。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$18$ 時間後に残っている原子核の数は、はじめの何倍か。`, type: 'num', answer: 0.125, rel: 0.02, show: R`\frac{1}{8}`, hint: R`例: 0.75 や 3/4` },
        { label: '(2)', q: R`$30$ 時間後に残っている原子核は何個か。`, type: 'num', answer: 2.5e9, rel: 0.02, unit: '個', show: R`2.5 \times 10^{9}`, hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` }
      ],
      solution: [
        { t: '半減期ごとに、数が半分になる（(1)）',
          m: [R`N = N_{0}\left(\frac{1}{2}\right)^{t/T}`,
              R`\frac{N}{N_{0}} = \left(\frac{1}{2}\right)^{18/6.0} = \left(\frac{1}{2}\right)^{3} = \frac{1}{8}`],
          n: R`半減期 $T$ は、原子核の数が半分になるまでの時間です。$t$ 時間後の数は $N = N_{0}\left(\dfrac{1}{2}\right)^{t/T}$ です。$18$ 時間は、半減期 $6.0$ 時間の $3$ 回ぶんです。`,
          easy: R`「半減期 $6$ 時間」とは、$6$ 時間たつごとに、残りがちょうど半分になるという意味です。$6$ 時間後は $\dfrac{1}{2}$、$12$ 時間後は $\dfrac{1}{4}$、$18$ 時間後は $\dfrac{1}{8}$ と、半分、そのまた半分…とくり返します。$18 \div 6.0 = 3$ 回ぶん半分になるので、$\dfrac{1}{2} \times \dfrac{1}{2} \times \dfrac{1}{2} = \dfrac{1}{8}$（$= 0.125$）倍です。` },
        { t: '30 時間は、半減期の 5 回ぶん（(2)）',
          m: [R`N = N_{0}\left(\frac{1}{2}\right)^{30/6.0} = 8.0 \times 10^{10} \times \frac{1}{32} = 2.5 \times 10^{9}\,\text{個}`],
          n: R`$30$ 時間は半減期の $5$ 回ぶんなので、$\left(\dfrac{1}{2}\right)^{5} = \dfrac{1}{32}$ 倍になります。`,
          easy: R`半分にする操作を $5$ 回くり返します。$8.0 \times 10^{10}$ → $4.0 \times 10^{10}$ → $2.0 \times 10^{10}$ → $1.0 \times 10^{10}$ → $5.0 \times 10^{9}$ → $2.5 \times 10^{9}$ 個です。半減期の整数倍の時間であれば、このように、半分にする回数を数えるだけで求められます。`,
          pro: R`整数倍でない時間（たとえば $9.0$ 時間）では、$\left(\dfrac{1}{2}\right)^{1.5} = \dfrac{1}{2\sqrt{2}} \fallingdotseq 0.35$ のように、指数法則で計算します。` }
      ],
      tags: ['半減期', '放射性崩壊', '指数']
    }
  ]);
})();
