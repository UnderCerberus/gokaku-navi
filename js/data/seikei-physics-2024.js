/* GOKAKU NAVI — 成蹊大学 理工学部 物理 2024 年度 準拠の類題
   大問構成・出題分野・形式（マーク式の選択・数値）・難易度・誘導の流れだけを過去問に合わせ、
   装置・状況・数値・問題文・図・解説はすべて書き下ろしたもの（過去問の文面・数値・図は含まない）。
   第1問（小問集合）は小問ごとに別カード（id 末尾 -1〜-5）、第2・4問は大問ごとに 1 カード、
   第3問は独立した文章 I・II ごとに別カード（id 末尾 -1・-2）。 */
(function () {
  'use strict';
  const R = String.raw;
  const PI = Math.PI;
  const G = JK.plot.graph;
  const D = function (w, h) { return JK.plot.draw(w, h); };
  const src = function (no) {
    return { univ: '成蹊大学', faculty: '理工学部', year: 2024, no: no, kind: '類題' };
  };
  // 矢印 + 手動配置のラベル（ラベルが矢印に重ならないよう位置を明示する）
  function arr(d, x1, y1, x2, y2, label, cls, lx, ly, anchor) {
    d.arrow(x1, y1, x2, y2, { cls: cls });
    if (label) d.text(lx, ly, label, { cls: cls, anchor: anchor || 'start', italic: true });
  }
  // 寸法線（水平 / 鉛直）
  function hdim(d, x1, x2, y, label, ly) {
    d.line(x1, y, x2, y, { cls: 'dim', w: 1 });
    d.line(x1, y - 4, x1, y + 4, { cls: 'dim', w: 1 });
    d.line(x2, y - 4, x2, y + 4, { cls: 'dim', w: 1 });
    if (label) d.text((x1 + x2) / 2, ly == null ? y + 15 : ly, label, { italic: true });
  }

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // 1-1: 机の縁 P から L/5 だけはみ出した棒 AB と、A 端のおもり
  function figOverhang() {
    const d = D(360, 200);
    const xA = 56, xB = 326, xP = 110, yt = 124;
    d.rect(xP, yt, 236, 52, { cls: 'fg', fill: 'f0' });
    d.text(250, 158, '机', { cls: 'dim' });
    d.rect(xA, yt - 12, xB - xA, 12, { cls: 'fg', fill: 'f1' });
    d.rect(xA + 2, yt - 38, 24, 26, { cls: 'c2', fill: 'f2', rx: 2 });
    d.text(xA + 14, yt - 20, 'm', { italic: true });
    d.dot(xP, yt, { cls: 'c3', r: 3.5 });
    d.text(xA - 4, yt + 17, 'A', { italic: true, size: 13 });
    d.text(xP - 9, yt + 17, 'P', { italic: true, size: 13, cls: 'c3' });
    d.text(xB + 12, yt - 4, 'B', { italic: true, size: 13 });
    d.text(236, yt - 22, '一様な棒 AB（質量 M）', { size: 12 });
    hdim(d, xA, xB, 62, 'L', 55);
    hdim(d, xA, xP, 168, 'L/5', 186);
    return d.svg();
  }
  // 1-1 解説: 棒にはたらく力（P のまわりのモーメント）
  function figBeamForces() {
    const d = D(360, 196);
    const xA = 50, xB = 320, xP = 104, xG = 185, yr = 84;
    d.rect(xA, yr, xB - xA, 12, { cls: 'fg', fill: 'f1' });
    d.rect(xA + 1, yr - 24, 22, 24, { cls: 'c2', fill: 'f2', rx: 2 });
    d.text(xA + 12, yr - 7, 'm', { italic: true });
    d.poly([[xP, yr + 12], [xP - 11, yr + 30], [xP + 11, yr + 30]], { cls: 'fg', fill: 'f0' });
    d.hatch(xP - 28, yr + 30, xP + 28, yr + 30);
    d.dot(xG, yr + 6, { cls: 'fg', r: 3 });
    arr(d, xP, yr + 12, xP, yr - 40, 'N', 'c1', xP + 8, yr - 30);
    arr(d, xA + 8, yr + 12, xA + 8, yr + 66, 'mg', 'c3', xA + 14, yr + 66);
    arr(d, xG, yr + 12, xG, yr + 66, 'Mg', 'c3', xG + 6, yr + 66);
    d.text(xA - 2, yr + 20, 'A', { italic: true, anchor: 'end' });
    d.text(xB + 6, yr + 10, 'B', { italic: true, anchor: 'start' });
    d.text(xP + 14, yr + 44, 'P', { italic: true, cls: 'c1', anchor: 'start' });
    d.text(xG + 8, yr - 8, 'G（棒の中心）', { size: 11, anchor: 'start', cls: 'dim' });
    hdim(d, xA + 8, xP, 168, 'L/5', 186);
    hdim(d, xP, xG, 168, '3L/10', 186);
    return d.svg();
  }

  // 1-2: 天井からつるしたばねとおもり（原点 O = つり合いの位置、鉛直上向きが y 軸の正）
  function figSpringShm() {
    const d = D(360, 236);
    const xs = 150, yO = 140;
    d.hatch(96, 14, 204, 14, { side: -1 });
    d.spring(xs, 14, xs, yO - 16, { n: 8, amp: 9 });
    d.rect(xs - 22, yO - 16, 44, 32, { cls: 'fg', fill: 'f1', rx: 3 });
    d.text(xs, yO + 4, 'm', { italic: true });
    d.line(xs + 24, yO, 294, yO, { cls: 'dim', dash: true, w: 1 });
    d.arrow(300, 214, 300, 30, { cls: 'fg', w: 1.4 });
    d.text(310, 34, 'y', { italic: true, anchor: 'start' });
    d.dot(300, yO, { cls: 'fg', r: 2.8 });
    d.text(294, yO + 17, 'O（つり合いの位置）', { anchor: 'end', size: 12 });
    d.text(xs - 18, 70, 'k = 50 N/m', { anchor: 'end', size: 12 });
    d.text(xs - 28, yO + 5, 'm = 0.50 kg', { anchor: 'end', size: 12 });
    arr(d, 200, yO - 6, 200, yO - 56, '', 'c3');
    d.text(210, yO - 36, 'v₀ = 0.40 m/s', { cls: 'c3', anchor: 'start', size: 12 });
    d.text(210, yO - 20, '（t = 0）', { cls: 'dim', anchor: 'start', size: 11 });
    return d.svg();
  }
  // 1-2 の選択肢: 1 周期を 1 とした時間 t（0 ≦ t ≦ 2.5）の関数 f のグラフ
  function figShmOpt(f) {
    return G({
      w: 200, h: 130, x: [-0.2, 2.65], y: [-1.45, 1.45], axis: ['t', ''], grid: false, ticks: false,
      curves: [{ f: f, cls: 'c1', domain: [0, 2.5] }],
      labels: [{ x: -0.18, y: -0.34, text: 'O', cls: 'dim' }]
    });
  }
  const shmSin = function (t) { return Math.sin(2 * PI * t); };
  const shmCos = function (t) { return Math.cos(2 * PI * t); };
  const shmNegSin = function (t) { return -Math.sin(2 * PI * t); };
  const shmNegCos = function (t) { return -Math.cos(2 * PI * t); };
  const shmFast = function (t) { return Math.sin(4 * PI * t); };
  const shmDamp = function (t) { return 1.25 * Math.exp(-0.5 * t) * Math.sin(2 * PI * t); };
  // ① 周期が半分 ② cos ③ 減衰 ④ sin ⑤ −cos ⑥ −sin
  const SHM_OPTS = [shmFast, shmCos, shmDamp, shmSin, shmNegCos, shmNegSin].map(function (f) { return { fig: figShmOpt(f) }; });
  // 1-2 解説: y, v_y, F_y を重ねたグラフ（それぞれ最大値を 1 に規格化）
  function figShmSol() {
    return G({
      w: 340, h: 240, x: [-0.15, 2.5], y: [-1.7, 1.7], axis: ['t / T', ''], ticks: false,
      curves: [
        { f: shmSin, cls: 'c1' },
        { f: shmCos, cls: 'c2' },
        { f: shmNegSin, cls: 'c3', dash: true }
      ],
      vlines: [{ x: 0.25, label: 'T/4' }, { x: 0.5, label: 'T/2' }, { x: 1, label: 'T' }],
      labels: [
        { x: 0.3, y: 1.22, text: 'y（座標）', cls: 'c1' },
        { x: 1.03, y: 1.22, text: 'v（速度）', cls: 'c2' },
        { x: 0.3, y: -1.32, text: 'F（合力・破線）', cls: 'c3' },
        { x: 1.25, y: -1.55, text: '各量の最大値を 1 として表示', cls: 'dim' }
      ]
    });
  }

  // 1-3: 熱量計（水入り）に金属球を入れる
  function figCalorimeter() {
    const d = D(360, 216);
    d.poly([[111, 112], [249, 112], [249, 178], [111, 178]], { cls: 'c1', fill: 'f1', w: 1 });
    d.path('M110 74 L110 180 L250 180 L250 74', { cls: 'fg', fill: null, w: 2.2 });
    d.text(180, 140, '水 150 g（25 ℃）', { size: 12 });
    d.text(180, 164, '熱量計の熱容量 30 J/K', { size: 11, cls: 'dim' });
    d.circle(180, 40, 16, { cls: 'c2', fill: 'f2' });
    arr(d, 180, 60, 180, 106, '', 'c3');
    d.text(204, 37, '金属球 200 g', { size: 12, anchor: 'start', cls: 'c2' });
    d.text(204, 53, '（100 ℃に熱してある）', { size: 12, anchor: 'start', cls: 'c2' });
    d.text(180, 204, '熱の出入りは熱量計・水・金属球の間だけ', { size: 11, cls: 'dim' });
    return d.svg();
  }
  // 1-3 解説: 温度の変化（金属球は 100 → 34 ℃、水と熱量計は 25 → 34 ℃）
  function figHeatSol() {
    const d = D(360, 156);
    const X = function (t) { return 24 + (t - 20) * 3.7; };
    d.line(X(20), 74, X(104), 74, { cls: 'dim', w: 1.2 });
    [25, 34, 100].forEach(function (t) {
      d.line(X(t), 70, X(t), 78, { cls: 'fg', w: 1.2 });
      d.text(X(t), 92, t + ' ℃', { size: 11 });
    });
    d.arrow(X(100), 46, X(34) + 2, 46, { cls: 'c2', w: 2 });
    d.text(200, 32, '金属球：100 ℃ → 34 ℃（66 K 下がる）', { cls: 'c2', size: 12 });
    d.arrow(X(25), 112, X(34) - 2, 112, { cls: 'c1', w: 2 });
    d.text(200, 138, '水と熱量計：25 ℃ → 34 ℃（9 K 上がる）', { cls: 'c1', size: 12 });
    d.line(X(34), 46, X(34), 112, { cls: 'dim', dash: true, w: 1 });
    return d.svg();
  }

  // 1-4: ピストンつきシリンダー（外圧一定のまま放熱）
  function figCylinder() {
    const d = D(360, 224);
    d.path('M110 36 L110 172 L250 172 L250 36', { cls: 'fg', fill: null, w: 2.2 });
    d.rect(112, 72, 136, 12, { cls: 'fg', fill: 'f0' });
    d.rect(112, 84, 136, 86, { cls: 'dim', fill: 'f1', w: 0.8 });
    d.text(180, 132, '単原子分子理想気体', { size: 12 });
    [138, 180, 222].forEach(function (x) { d.arrow(x, 34, x, 68, { cls: 'c3', w: 1.6 }); });
    d.text(180, 20, '一定の外圧（P = 2.0×10⁵ Pa）', { size: 12, cls: 'c3' });
    d.text(262, 82, 'ピストン', { size: 12, anchor: 'start' });
    [150, 210].forEach(function (x) { d.arrow(x, 176, x, 206, { cls: 'c1', w: 1.8 }); });
    d.text(240, 198, '放熱（ゆっくり）', { size: 12, anchor: 'start', cls: 'c1' });
    return d.svg();
  }
  // 1-4 解説: P-V グラフ（定圧変化。長方形の面積 = 仕事の大きさ）
  function figPVCool() {
    return G({
      w: 340, h: 230, x: [0, 8], y: [0, 4], axis: ['V', 'P'],
      fills: [{ f: function () { return 2; }, from: 4, to: 6, cls: 'f1' }],
      segs: [{ x1: 6, y1: 2, x2: 4, y2: 2, cls: 'c1', arrow: true }],
      vlines: [{ x: 4, dash: true }, { x: 6, dash: true }],
      points: [
        { x: 6, y: 2, label: 'はじめ', pos: 'tr', cls: 'c3' },
        { x: 4, y: 2, label: 'のち', pos: 'tl', cls: 'c4' }
      ],
      labels: [
        { x: 4.15, y: 1.3, text: '面積 = 仕事', cls: 'c1' },
        { x: 4.15, y: 0.9, text: '= 4.0×10² J', cls: 'c1' },
        { x: 0.2, y: 3.7, text: '縦軸 P の単位: 10⁵ Pa', cls: 'dim' },
        { x: 0.2, y: 3.3, text: '横軸 V の単位: 10⁻³ m³', cls: 'dim' }
      ]
    });
  }

  // 1-5: 平行な金属板 P, Q と、P の表面に置いた電子（sol = true で電場・力・電位を描き込む）
  function figPlates(sol) {
    const d = D(360, 212);
    const xP = 96, xQ = 264, y0 = 40, y1 = 150, ye = 95;
    d.line(xP, y0, xP, y1, { cls: 'fg', w: 4.5 });
    d.line(xQ, y0, xQ, y1, { cls: 'fg', w: 4.5 });
    d.text(xP, y0 - 10, 'P', { italic: true, size: 14 });
    d.text(xQ, y0 - 10, 'Q', { italic: true, size: 14 });
    d.circle(xP + 14, ye, 8, { cls: 'c2', fill: 'f2' });
    d.text(xP + 14, ye + 5, '−', { size: 15, bold: true, cls: 'c2' });
    if (sol) {
      [60, 130].forEach(function (y) { d.arrow(xQ - 12, y, xP + 40, y, { cls: 'c1', w: 2 }); });
      d.text(180, 48, '電場 E（Q → P）', { cls: 'c1', size: 12 });
      d.arrow(xP + 26, ye, xP + 76, ye, { cls: 'c3', w: 2 });
      d.text(xP + 82, ye + 4, '力 F', { cls: 'c3', size: 12, anchor: 'start', italic: true });
      d.text(xP, y1 + 17, '低電位', { size: 11, cls: 'dim' });
      d.text(xQ, y1 + 17, '高電位', { size: 11, cls: 'dim' });
    } else {
      d.arrow(xP + 28, ye, xQ - 14, ye, { cls: 'c3', w: 2, dash: true });
      d.text(180, ye - 10, '電子の運動の向き', { cls: 'c3', size: 12 });
      d.text(xP + 14, ye + 24, '電子', { size: 11 });
    }
    hdim(d, xP, xQ, 184, 'd = 5.0 mm', 202);
    return d.svg();
  }

  // 2: 傾き θ の斜面。下端にばね、AB 間があらい、O に小物体（OA = ℓ, AB = 2ℓ）
  const SL = (function () {
    const th = PI / 6;
    return { th: th, ux: Math.cos(th), uy: -Math.sin(th), nx: -Math.sin(th), ny: -Math.cos(th) };
  })();
  function slopePt(fx, fy, s, off) {
    off = off || 0;
    return [fx + SL.ux * s + SL.nx * off, fy + SL.uy * s + SL.ny * off];
  }
  function figIncline() {
    const d = D(360, 250);
    const Fx = 44, Fy = 214;
    const P = function (s, off) { return slopePt(Fx, Fy, s, off); };
    const sC = 56, sB = 92, sA = 204, sO = 260, sTop = 300;
    d.hatch(14, Fy, 346, Fy);
    d.poly([[Fx, Fy], P(sTop), [P(sTop)[0], Fy]], { cls: 'fg', fill: 'f0' });
    const a = P(sA), b = P(sB);
    d.line(b[0], b[1], a[0], a[1], { cls: 'c3', w: 5 });
    // ばね（下端の固定板から C まで）
    const s0 = P(0, 7), s1 = P(sC, 7), w0 = P(0, 0), w1 = P(0, 24);
    d.line(w0[0], w0[1], w1[0], w1[1], { cls: 'fg', w: 3 });
    d.spring(s0[0], s0[1], s1[0], s1[1], { n: 6, amp: 5 });
    // 小物体（O の位置）
    const bc = P(sO, 11);
    d.rect(bc[0] - 16, bc[1] - 11, 32, 22, { cls: 'fg', fill: 'f1', rx: 2, rot: 30, ox: bc[0], oy: bc[1] });
    d.text(bc[0], bc[1] + 4, 'm', { italic: true });
    // 点と記号
    [[sO, 'O', 40], [sA, 'A', 18], [sB, 'B', 18], [sC, 'C', 18]].forEach(function (q) {
      const p = P(q[0]), t = P(q[0], q[2]);
      d.dot(p[0], p[1], { cls: 'fg', r: 2.6 });
      d.text(t[0], t[1] + 4, q[1], { italic: true, size: 13 });
    });
    // 寸法（斜面に平行・斜面の内側）
    function sdim(sa, sb, label) {
      const p = P(sa, -17), q = P(sb, -17);
      d.line(p[0], p[1], q[0], q[1], { cls: 'dim', w: 1 });
      [p, q].forEach(function (e) {
        d.line(e[0] - SL.nx * 4, e[1] - SL.ny * 4, e[0] + SL.nx * 4, e[1] + SL.ny * 4, { cls: 'dim', w: 1 });
      });
      const m = P((sa + sb) / 2, -32);
      d.text(m[0], m[1] + 4, label, { italic: true });
    }
    sdim(sA, sO, 'ℓ');
    sdim(sB, sA, '2ℓ');
    d.angle(Fx, Fy, 66, 0, 30, 'θ', { cls: 'c3' });
    d.text(20, 34, 'AB 間：あらい（動摩擦係数 μ′）', { anchor: 'start', size: 12, cls: 'c3' });
    d.text(20, 52, 'それ以外：なめらか', { anchor: 'start', size: 12, cls: 'dim' });
    return d.svg();
  }
  // 2 解説: AB 間を上向きにすべる小物体にはたらく力
  function figInclineForces() {
    const d = D(360, 232);
    const Fx = 24, Fy = 206;
    const P = function (s, off) { return slopePt(Fx, Fy, s, off); };
    d.hatch(10, Fy, 346, Fy);
    d.poly([[Fx, Fy], P(300), [P(300)[0], Fy]], { cls: 'fg', fill: 'f0' });
    const s0 = 150, c = P(s0, 11), f = P(s0, 0);
    d.rect(c[0] - 17, c[1] - 11, 34, 22, { cls: 'fg', fill: 'f1', rx: 2, rot: 30, ox: c[0], oy: c[1] });
    // 運動の向き
    const v0 = P(s0, 34);
    d.arrow(v0[0], v0[1], v0[0] + SL.ux * 44, v0[1] + SL.uy * 44, { cls: 'c4', w: 2 });
    d.text(v0[0] + SL.ux * 44 + 6, v0[1] + SL.uy * 44 - 6, 'v', { cls: 'c4', italic: true, anchor: 'start' });
    // 垂直抗力 N
    d.arrow(c[0], c[1], c[0] + SL.nx * 60, c[1] + SL.ny * 60, { cls: 'c1', w: 2 });
    d.text(c[0] + SL.nx * 60 - 6, c[1] + SL.ny * 60 - 4, 'N', { cls: 'c1', italic: true, anchor: 'end' });
    // 重力 mg と、その斜面方向・垂直方向の成分（点線）
    d.arrow(c[0], c[1], c[0], c[1] + 52, { cls: 'c2', w: 2 });
    d.text(c[0] + 6, c[1] + 62, 'mg', { cls: 'c2', italic: true, anchor: 'start' });
    d.arrow(c[0], c[1], c[0] - SL.ux * 50, c[1] - SL.uy * 50, { cls: 'dim', w: 1.4, dash: true });
    d.text(c[0] - SL.ux * 50 - 4, c[1] - SL.uy * 50 - 6, 'mg sinθ', { cls: 'dim', italic: true, anchor: 'end', size: 11 });
    d.arrow(c[0], c[1], c[0] - SL.nx * 52, c[1] - SL.ny * 52, { cls: 'dim', w: 1.4, dash: true });
    d.text(c[0] - SL.nx * 52 + 8, c[1] - SL.ny * 52 + 12, 'mg cosθ', { cls: 'dim', italic: true, anchor: 'start', size: 11 });
    // 動摩擦力 μ′N（運動と逆向き = 斜面下向き）
    d.arrow(f[0], f[1], f[0] - SL.ux * 46, f[1] - SL.uy * 46, { cls: 'c3', w: 2.2 });
    d.text(f[0] - SL.ux * 46 - 2, f[1] - SL.uy * 46 + 24, 'μ′N', { cls: 'c3', italic: true, anchor: 'end' });
    d.text(190, 24, 'AB 間を上向きにすべるとき', { anchor: 'start', size: 12 });
    d.text(190, 42, '（斜面に沿って上向きを正）', { anchor: 'start', size: 12, cls: 'dim' });
    return d.svg();
  }
  // 2 解説: 位置 s（O から斜面に沿って下向きに測る）と v² の関係（θ = 30°, μ′ = 0.20, ℓ = 0.50 m, g = 9.8 m/s² の例）
  function figInclineV2() {
    const g = 9.8, l = 0.5, th = PI / 6, mu = 0.2;
    const kd = 2 * g * (Math.sin(th) - mu * Math.cos(th)), ku = 2 * g * (Math.sin(th) + mu * Math.cos(th));
    const vA2 = 2 * g * Math.sin(th) * l, vB2 = vA2 + kd * 2 * l;
    const sStop = 3 * l - vB2 / ku;
    const down = function (s) { return s <= l ? 2 * g * Math.sin(th) * s : vA2 + kd * (s - l); };
    const up = function (s) { return vB2 - ku * (3 * l - s); };
    return G({
      w: 340, h: 240, x: [0, 1.8], y: [0, 13], axis: ['s', 'v²'], ticks: false,
      curves: [
        { f: down, cls: 'c1', domain: [0, 3 * l] },
        { f: up, cls: 'c3', dash: true, domain: [sStop, 3 * l] }
      ],
      vlines: [{ x: l, label: 'A' }, { x: 3 * l, label: 'B' }],
      points: [{ x: sStop, y: 0, label: '停止', pos: 'tl', cls: 'c4' }],
      labels: [
        { x: 0.04, y: 4.6, text: '下り', cls: 'c1' },
        { x: 1.0, y: 3.0, text: '上り（破線）', cls: 'c3' },
        { x: 1.56, y: 3.2, text: 'B 以降は', cls: 'dim' },
        { x: 1.56, y: 2.2, text: 'なめらか', cls: 'dim' }
      ]
    });
  }

  // 3-1: ヘリウムイオンのモデル（原子核 +2e のまわりを電子が等速円運動）
  function figBohr() {
    const d = D(360, 240);
    const cx = 150, cy = 106, r = 74, ph = 38 * PI / 180;
    const ex = cx + r * Math.cos(ph), ey = cy - r * Math.sin(ph);
    d.circle(cx, cy, r, { cls: 'dim', dash: true, w: 1.3 });
    d.line(cx + 14 * Math.cos(ph), cy - 14 * Math.sin(ph), ex - 8 * Math.cos(ph), ey + 8 * Math.sin(ph), { cls: 'dim', w: 1.2 });
    d.circle(cx, cy, 14, { cls: 'c3', fill: 'f3' });
    d.text(cx, cy + 4, '+2e', { size: 11, bold: true });
    d.circle(ex, ey, 8, { cls: 'c2', fill: 'f2' });
    d.text(ex, ey + 5, '−', { size: 14, bold: true, cls: 'c2' });
    // 速度 v（反時計まわりの接線方向）と静電気力 F（中心向き）
    const tx = -Math.sin(ph), ty = -Math.cos(ph);
    d.arrow(ex + tx * 10, ey + ty * 10, ex + tx * 52, ey + ty * 52, { cls: 'c4', w: 2 });
    d.text(ex + tx * 52 - 8, ey + ty * 52 - 6, 'v', { cls: 'c4', italic: true, anchor: 'end' });
    d.arrow(ex - Math.cos(ph) * 10, ey + Math.sin(ph) * 10, ex - Math.cos(ph) * 40, ey + Math.sin(ph) * 40, { cls: 'c1', w: 2 });
    d.text(ex - Math.cos(ph) * 40 + 4, ey + Math.sin(ph) * 40 + 16, 'F', { cls: 'c1', italic: true, anchor: 'start' });
    d.text(cx + 37 * Math.cos(ph) - 14, cy - 37 * Math.sin(ph) - 8, 'r', { italic: true, anchor: 'middle' });
    d.text(250, 70, '電子の軌道', { anchor: 'start', size: 12, cls: 'dim' });
    d.text(250, 88, '（半径 r）', { anchor: 'start', size: 12, cls: 'dim' });
    d.text(cx, 204, '中心：原子核（電気量 +2e）', { size: 12 });
    d.text(cx, 224, '電子：質量 m、電気量 −e、速さ v', { size: 12 });
    return d.svg();
  }
  // 3-1 解説: 円軌道に沿って波が n 個（n = 3 の例）
  function figOrbitWave() {
    const d = D(360, 200);
    const cx = 130, cy = 100, R0 = 62, a = 9, n = 3;
    d.circle(cx, cy, R0, { cls: 'dim', dash: true, w: 1 });
    let p = '';
    for (let i = 0; i <= 360; i++) {
      const f = i * PI / 180, rho = R0 + a * Math.sin(n * f);
      p += (i ? ' L' : 'M') + (cx + rho * Math.cos(f)).toFixed(1) + ' ' + (cy - rho * Math.sin(f)).toFixed(1);
    }
    d.path(p, { cls: 'c2', fill: null, w: 2 });
    d.circle(cx, cy, 6, { cls: 'c3', fill: 'f3' });
    d.text(250, 74, '円周 2πr', { anchor: 'start', size: 13 });
    d.text(250, 94, '= 3 × （波長 λ）', { anchor: 'start', size: 13 });
    d.text(250, 120, 'n = 3 の例', { anchor: 'start', size: 12, cls: 'dim' });
    d.text(250, 138, '波がちょうど 3 個', { anchor: 'start', size: 12, cls: 'dim' });
    return d.svg();
  }
  // 3-1 解説: He⁺ のエネルギー準位（E_n = −54.4/n² eV）と n = 2 → 1 の遷移
  function figHeLevels() {
    const d = D(360, 236);
    const Y = function (E) { return 24 + (-E / 54.4) * 176; };
    [[1, -54.4, '−54.4'], [2, -13.6, '−13.6'], [3, -54.4 / 9, '−6.0']].forEach(function (q) {
      d.line(60, Y(q[1]), 190, Y(q[1]), { cls: 'fg', w: 2 });
      d.text(200, Y(q[1]) + 4, 'n = ' + q[0] + '　' + q[2] + ' eV', { anchor: 'start', size: 12 });
    });
    d.line(60, Y(0), 190, Y(0), { cls: 'dim', dash: true, w: 1.2 });
    d.text(200, Y(0) + 4, 'n = ∞　0 eV（束縛が切れる）', { anchor: 'start', size: 12, cls: 'dim' });
    d.arrow(125, Y(-13.6) + 3, 125, Y(-54.4) - 3, { cls: 'c3', w: 2.2 });
    d.text(112, (Y(-13.6) + Y(-54.4)) / 2 - 4, '光子', { anchor: 'end', size: 12, cls: 'c3' });
    d.text(112, (Y(-13.6) + Y(-54.4)) / 2 + 12, '40.8 eV', { anchor: 'end', size: 12, cls: 'c3' });
    d.text(280, 226, 'He⁺ のエネルギー準位', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // 3-2: 鉛直に立てたガラス管（水面の位置 L を変えられる）と、管口の上のスピーカー
  function figResTube() {
    const d = D(360, 244);
    const xl = 150, xr = 210, yT = 58, yW = 150, yB = 224;
    d.rect(xl + 1, yW, xr - xl - 2, yB - yW, { cls: 'c1', fill: 'f1', w: 0.8 });
    d.line(xl, yT, xl, yB, { cls: 'fg', w: 2.4 });
    d.line(xr, yT, xr, yB, { cls: 'fg', w: 2.4 });
    d.line(xl, yB, xr, yB, { cls: 'fg', w: 2.4 });
    d.line(xl + 1, yW, xr - 1, yW, { cls: 'c1', w: 2 });
    d.rect(166, 10, 28, 14, { cls: 'fg', fill: 'f0' });
    d.poly([[166, 24], [194, 24], [208, 44], [152, 44]], { cls: 'fg', fill: 'f0' });
    d.text(222, 24, 'スピーカー', { anchor: 'start', size: 12 });
    d.text(222, 40, '（発振器につながれている）', { anchor: 'start', size: 11, cls: 'dim' });
    d.line(xl - 8, yT, xr + 40, yT, { cls: 'dim', dash: true, w: 1 });
    d.text(xl - 12, yT + 4, '管口', { anchor: 'end', size: 12 });
    d.text(xl - 12, 112, 'ガラス管', { anchor: 'end', size: 12 });
    d.text(xr + 36, yW + 4, '水面', { anchor: 'start', size: 12, cls: 'c1' });
    d.line(xr + 24, yT, xr + 24, yW, { cls: 'dim', w: 1 });
    d.line(xr + 19, yT, xr + 29, yT, { cls: 'dim', w: 1 });
    d.line(xr + 19, yW, xr + 29, yW, { cls: 'dim', w: 1 });
    d.text(xr + 36, (yT + yW) / 2 + 4, 'L', { anchor: 'start', italic: true, size: 13 });
    d.text(xl - 12, yW + 36, '水', { anchor: 'end', size: 12, cls: 'c1' });
    d.text(180, 240, '水を少しずつ抜いて、水面を下げていく', { size: 11, cls: 'dim' });
    return d.svg();
  }
  // 3-2 解説: 2 回目・3 回目の共鳴のようす（定常波の変位の包絡線。腹は管口の外側 Δ の位置、節は水面）
  function figResTubeSol() {
    const d = D(360, 262);
    const sc = 2.6, yM = 70, q = 10.0 * sc;
    function tube(xc, L, title, quarters, qlabel, lname) {
      const yn = yM + L, yA = yn - quarters * q, hw = 27;
      d.rect(xc - hw + 1, yn, 2 * hw - 2, 26, { cls: 'c1', fill: 'f1', w: 0.8 });
      d.line(xc - hw, yM, xc - hw, yn + 26, { cls: 'fg', w: 2.2 });
      d.line(xc + hw, yM, xc + hw, yn + 26, { cls: 'fg', w: 2.2 });
      d.line(xc - hw, yn + 26, xc + hw, yn + 26, { cls: 'fg', w: 2.2 });
      d.line(xc - hw + 1, yn, xc + hw - 1, yn, { cls: 'c1', w: 2 });
      let pu = '', pd = '';
      const N = 90;
      for (let i = 0; i <= N; i++) {
        const y = yA + (yn - yA) * i / N, u = 20 * Math.sin(2 * PI * (yn - y) / (4 * q));
        pu += (i ? ' L' : 'M') + (xc + u).toFixed(1) + ' ' + y.toFixed(1);
        pd += (i ? ' L' : 'M') + (xc - u).toFixed(1) + ' ' + y.toFixed(1);
      }
      d.path(pu, { cls: 'c2', fill: null, w: 1.7 });
      d.path(pd, { cls: 'c2', fill: null, w: 1.7 });
      d.text(xc, 24, title, { size: 12 });
      // 管口の位置（点線）
      d.line(xc - hw - 6, yM, xc + hw + 6, yM, { cls: 'dim', dash: true, w: 1 });
      // 左: 気柱の実効的な長さ（腹から節まで）
      const xd = xc - hw - 20;
      d.line(xd, yA, xd, yn, { cls: 'c3', w: 1.3 });
      d.line(xd - 4, yA, xd + 4, yA, { cls: 'c3', w: 1.3 });
      d.line(xd - 4, yn, xd + 4, yn, { cls: 'c3', w: 1.3 });
      d.text(xd - 6, (yA + yn) / 2 + 4, qlabel, { anchor: 'end', size: 12, cls: 'c3', italic: true });
      // 右: 管口から水面まで L
      const xr2 = xc + hw + 20;
      d.line(xr2, yM, xr2, yn, { cls: 'dim', w: 1 });
      d.line(xr2 - 4, yM, xr2 + 4, yM, { cls: 'dim', w: 1 });
      d.line(xr2 - 4, yn, xr2 + 4, yn, { cls: 'dim', w: 1 });
      d.text(xr2 + 7, (yM + yn) / 2 + 4, lname, { anchor: 'start', size: 13, italic: true });
      // 腹（管口の外側 Δ）
      d.dot(xc, yA, { cls: 'c4', r: 2.6 });
      d.text(xc + hw + 2, yA - 3, '腹', { anchor: 'start', size: 11, cls: 'c4' });
      d.text(xc + 12, yn - 4, '節', { anchor: 'start', size: 11, cls: 'c4' });
    }
    tube(96, 29.0 * sc, '2 回目の共鳴', 3, '3λ/4', 'L₂');
    tube(250, 49.0 * sc, '3 回目の共鳴', 5, '5λ/4', 'L₃');
    d.text(180, 254, '腹の位置は、管口より Δ（= 1.0 cm）だけ外側', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // 4: 電池・S₁・R₃ に、並列な 2 本の枝（R₁ の枝と、S₂ で R₂ またはコイル L に切り替える枝）
  function figCircuit() {
    const d = D(360, 268);
    const xL = 40, yT = 44, yB = 212;
    d.wire([[xL, yT], [xL, 96]]);
    d.battery(xL, 96, xL, 128, {});
    d.text(xL - 9, 116, '15 V', { anchor: 'end', size: 12 });
    d.wire([[xL, 128], [xL, 160]]);
    d.line(xL, 196, xL, 160, { cls: 'fg', w: 3 });
    d.circle(xL, 160, 3, { cls: 'fg', fill: 'f0' });
    d.circle(xL, 196, 3, { cls: 'fg', fill: 'f0' });
    d.wire([[xL, 196], [xL, yB]]);
    d.text(xL + 11, 182, 'S₁', { italic: true, anchor: 'start' });
    d.resistor(xL, yT, 164, yT, { label: 'R₃' });
    d.wire([[164, yT], [300, yT]]);
    d.resistor(232, yT, 232, yB, { label: 'R₁' });
    d.wire([[300, yT], [300, 84]]);
    d.line(300, 84, 276, 118, { cls: 'fg', w: 3 });
    d.circle(300, 84, 3.2, { cls: 'fg', fill: 'f0' });
    d.circle(276, 118, 3.2, { cls: 'fg', fill: 'f0' });
    d.circle(324, 118, 3.2, { cls: 'fg', fill: 'f0' });
    d.text(310, 80, 'S₂', { italic: true, anchor: 'start' });
    d.text(266, 112, 'a', { italic: true, anchor: 'end' });
    d.text(334, 112, 'b', { italic: true, anchor: 'start' });
    d.resistor(276, 118, 276, yB, { label: 'R₂' });
    d.coil(324, 118, 324, yB, { label: 'L', n: 5 });
    d.wire([[xL, yB], [324, yB]]);
    [[232, yT], [300, yT], [232, yB], [276, yB]].forEach(function (q) { d.dot(q[0], q[1], { r: 3 }); });
    d.text(180, 244, 'R₁ = 30 Ω、R₂ = 15 Ω、R₃ = 10 Ω', { size: 12 });
    d.text(180, 262, 'はじめ：S₁ は閉じ、S₂ は a 側', { size: 12, cls: 'dim' });
    return d.svg();
  }
  // 4 の (4) の選択肢: コイルの電流 I（rise: 0 から増加して val に近づく / 減少: val から 0 に近づく）
  function figCoilOpt(rise, val) {
    const f = rise ? function (t) { return val * (1 - Math.exp(-t)); } : function (t) { return val * Math.exp(-t); };
    return G({
      w: 210, h: 150, x: [0, 5.2], y: [0, 2], axis: ['t [s]', 'I [A]'], grid: false, ticks: false,
      curves: [{ f: f, cls: 'c1', domain: [0, 5] }],
      hlines: [{ y: val, label: String(val), dash: true }]
    });
  }
  // 4 解説: S₂ を b にした直後（コイルの電流 0）と、十分に時間がたった後（コイルは導線と同じ）
  function figCoilStates() {
    const d = D(360, 214);
    function mini(ox, title, wireState, l1, l2) {
      const yT = 56, yB = 150, xl = ox + 12, xR = ox + 104, xC = ox + 146;
      d.text(ox + 82, 18, title, { size: 12, bold: true });
      d.wire([[xl, yT], [xl, 84]]);
      d.battery(xl, 84, xl, 116, {});
      d.wire([[xl, 116], [xl, yB]]);
      d.resistor(xl, yT, xR, yT, { label: 'R₃' });
      d.wire([[xR, yT], [xC, yT]]);
      d.resistor(xR, yT, xR, yB, { label: 'R₁' });
      if (wireState) {
        d.line(xC, yT, xC, yB, { cls: 'c3', w: 3 });
        d.text(xC + 6, 106, '導線と', { anchor: 'start', size: 11, cls: 'c3' });
        d.text(xC + 6, 120, '同じ', { anchor: 'start', size: 11, cls: 'c3' });
      } else {
        d.line(xC, yT, xC, yB, { cls: 'dim', dash: true, w: 1.6 });
        d.line(xC - 6, 96, xC + 6, 108, { cls: 'c3', w: 2.2 });
        d.line(xC - 6, 108, xC + 6, 96, { cls: 'c3', w: 2.2 });
        d.text(xC + 6, 128, '電流 0', { anchor: 'start', size: 11, cls: 'c3' });
      }
      d.wire([[xl, yB], [xC, yB]]);
      d.dot(xR, yT, { r: 3 });
      d.dot(xR, yB, { r: 3 });
      d.text(ox + 82, 178, l1, { size: 12 });
      d.text(ox + 82, 196, l2, { size: 12, cls: 'c3' });
    }
    mini(0, 'S₂ を b にした直後', false, 'R₃ と R₁ が直列', 'I = 15 ÷ 40 ≒ 0.38 A');
    mini(180, '十分に時間がたった後', true, 'R₁ は短絡（電流 0）', 'I = 15 ÷ 10 = 1.5 A');
    return d.svg();
  }
  // 4 解説: S₁ を開いた直後の回路（コイルと R₁ だけの閉じた回路）
  function figCoilLoop() {
    const d = D(360, 214);
    const xl = 100, xr = 236, yT = 56, yB = 154;
    d.text(180, 20, 'S₁ を開いた直後（電池側は切り離される）', { size: 12, cls: 'dim' });
    d.wire([[xl, yT], [xr, yT]]);
    d.wire([[xl, yB], [xr, yB]]);
    d.coil(xl, yT, xl, yB, { label: 'L', n: 5 });
    d.resistor(xr, yT, xr, yB, { label: 'R₁' });
    d.arrow(xl - 28, 78, xl - 28, 110, { cls: 'c3', w: 2 });
    d.text(xl - 34, 96, '1.5 A', { anchor: 'end', size: 12, cls: 'c3' });
    d.arrow(xr + 28, 110, xr + 28, 78, { cls: 'c3', w: 2 });
    d.text(xr + 34, 96, '1.5 A', { anchor: 'start', size: 12, cls: 'c3' });
    d.text(xl + 6, 112, '電池の役目', { anchor: 'start', size: 11, cls: 'c1' });
    d.text(xl + 6, 126, '（自己誘導）', { anchor: 'start', size: 11, cls: 'c1' });
    d.text(180, 184, 'コイルの電圧 = R₁ × 1.5 A = 30 × 1.5 = 45 V', { size: 12 });
    d.text(180, 202, '（コイルの電流は急には変わらず、R₁ を流れ続ける）', { size: 11, cls: 'dim' });
    return d.svg();
  }

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ================= 第1問（小問集合）================= */

    /* ---------- 第1問 問1 力のモーメント ---------- */
    {
      id: 'sk-p-2024-1-1',
      subject: 'physics',
      level: 'mid',
      unit: 'p-rigid',
      title: 'はみ出した棒のつり合い',
      source: src('第1問 問1'),
      time: 4,
      body: R`長さ $L$、質量 $M$ の一様な棒 AB が、水平な机の上に水平に置かれている。図のように、棒の A 端は机の縁 P から $\dfrac{L}{5}$ だけ机の外にはみ出している。この A 端に、質量 $m$ の小さなおもりをそっとのせる。$m$ が大きすぎると、棒は机の縁 P のまわりに回転して傾いてしまう。重力加速度の大きさを $g$ とし、棒の太さとおもりの大きさは無視する。`,
      fig: figOverhang(),
      parts: [
        {
          label: '(1)',
          q: R`棒が傾かずにいられる $m$ の最大値として、正しいものを選べ。`,
          type: 'choice',
          choices: [R`$\dfrac{1}{2}M$`, R`$\dfrac{2}{3}M$`, R`$M$`, R`$\dfrac{3}{2}M$`, R`$2M$`, R`$\dfrac{5}{2}M$`],
          answer: 3,
          explain: R`$m$ が最大のとき、机が棒を支える力は縁 P だけに集中します。P のまわりの力のモーメントのつり合いを考えると、おもりの重力のモーメント $mg\times\dfrac{L}{5}$ と、棒の重力のモーメント $Mg\times\left(\dfrac{L}{2}-\dfrac{L}{5}\right)=Mg\times\dfrac{3L}{10}$ が等しいので、$m=\dfrac{3}{2}M$ です。棒の重さは棒の中心（A 端から $\dfrac{L}{2}$）にはたらくと考えるのがポイントで、これを机の上の部分の中心にはたらくと考えると $2M$、中心までの距離を A 端から測ってしまうと $\dfrac{5}{2}M$ という誤りになります。`
        },
        {
          label: '(2)',
          q: R`(1) の最大値の質量のおもりをのせたとき、机の縁 P が棒に及ぼす垂直抗力の大きさとして、正しいものを選べ。`,
          type: 'choice',
          choices: [R`$Mg$`, R`$\dfrac{3}{2}Mg$`, R`$2Mg$`, R`$\dfrac{5}{2}Mg$`, R`$3Mg$`],
          answer: 3,
          explain: R`限界の状態では、棒は縁 P だけで支えられています。棒とおもりをまとめて見ると、鉛直方向の力のつり合いから $N=Mg+mg=Mg+\dfrac{3}{2}Mg=\dfrac{5}{2}Mg$ です。垂直抗力は棒の重さ $Mg$ だけでなく、おもりの重さ $mg$ も支えています。`
        },
        {
          label: '(3)',
          q: R`$M=1.6\,\mathrm{kg}$、$g=9.8\,\mathrm{m/s^{2}}$ のとき、(2) の垂直抗力の大きさは何 $\mathrm{N}$ か。`,
          type: 'num',
          answer: 39.2,
          rel: 0.02,
          unit: 'N',
          explain: R`$N=\dfrac{5}{2}Mg=\dfrac{5}{2}\times 1.6\times 9.8=39.2\,\mathrm{N}$ です。このとき $m=\dfrac{3}{2}M=2.4\,\mathrm{kg}$ で、棒とおもりの重さの合計 $(1.6+2.4)\times 9.8=39.2\,\mathrm{N}$ と一致します。`
        }
      ],
      solution: [
        {
          t: '「傾き始める」ときの力のようす',
          n: R`おもりが軽いうちは、棒は机の上にのっていて、机は棒を面全体で支えています。$m$ を増やしていくと、机が棒を支える力の「合力の位置」が縁 P に近づいていき、ちょうど P に来たところが限界です。この限界を超えると、棒は P のまわりに回転して傾きます。したがって、限界の状態では机の垂直抗力 $N$ は P の 1 点にはたらくと考えます。`,
          easy: R`シーソーを思い浮かべてください。支点（P）の外へはみ出した A 端に重いおもりをのせるほど、A 側を下げようとする「回す力」（力のモーメント）が強くなります。一方、机の上にある棒の重さは、反対側（B 側）を下げようとする回す力をつくります。この 2 つの回す力がちょうど同じになる瞬間が「傾き始める限界」です。`,
          lv: 1
        },
        {
          t: 'P のまわりの力のモーメントのつり合い',
          m: [
            R`mg\times\dfrac{L}{5} = Mg\times\left(\dfrac{L}{2}-\dfrac{L}{5}\right)`,
            R`m\times\dfrac{1}{5} = M\times\dfrac{3}{10}`
          ],
          n: R`力のモーメントは「力 × 支点から力の作用線までの距離」です。支点 P から水平方向に測った距離は、おもり（A 端）が $\dfrac{L}{5}$、棒の重心（中心）が $\dfrac{L}{2}-\dfrac{L}{5}=\dfrac{3L}{10}$ です。限界のとき、垂直抗力は P にはたらくのでモーメントを持たず、2 つの重力のモーメントだけがつり合います。`,
          fig: figBeamForces(),
          easy: R`モーメントの式は「回す力 = 力の大きさ × 支点までの距離」です。距離は、力の向き（ここでは鉛直）に垂直な方向（水平）に測ります。おもりは P から $\dfrac{L}{5}$ だけ A 側、棒の重さは中心 G にはたらくので、P から $\dfrac{3L}{10}$ だけ B 側です。図の長さを読み取って、左右の回す力をそろえます。`,
          pro: R`支点 P のまわりで式を立てると、未知の垂直抗力 $N$ が式に現れません。「未知の力の作用点のまわりでモーメントを考える」のが定石です。別解として、棒とおもりを合わせた重心が P の真上に来る条件 $\dfrac{m\cdot 0+M\cdot\frac{L}{2}}{m+M}=\dfrac{L}{5}$（A 端から測る）でも、同じ結果になります。`,
          lv: 1
        },
        {
          t: '(1) 傾かない $m$ の最大値',
          m: R`m = \dfrac{3}{2}M`,
          n: R`$\dfrac{m}{5}=\dfrac{3M}{10}$ の両辺に $5$ をかけて $m=\dfrac{3}{2}M$ です。棒の質量の 1.5 倍までなら傾きません。机の外に出ている部分が短い（$\dfrac{L}{5}$）ので、棒より重いおもりをのせても耐えられます。`,
          lv: 1
        },
        {
          t: '(2) 垂直抗力（鉛直方向の力のつり合い）',
          m: R`N = Mg + mg = Mg + \dfrac{3}{2}Mg = \dfrac{5}{2}Mg`,
          n: R`棒とおもりを 1 つの物体とみなすと、上向きの力は P での垂直抗力 $N$ だけ、下向きの力は重力 $Mg$ と $mg$ です。静止しているので、上向きと下向きの力はつり合います。`,
          easy: R`机は、棒とおもりの重さをぜんぶ支えています。ですから、垂直抗力は「棒の重さ + おもりの重さ」に等しくなります。`,
          lv: 1
        },
        {
          t: '(3) 数値の代入',
          m: R`N = \dfrac{5}{2}\times 1.6\times 9.8 = 39.2\,\mathrm{N}`,
          n: R`検算として、$m=2.4\,\mathrm{kg}$ を求めて $(1.6+2.4)\times 9.8=39.2\,\mathrm{N}$ となることを確かめられます。`,
          lv: 2
        }
      ],
      tags: ['小問集合', '選択式', '力のモーメント', '剛体のつり合い', '重心']
    },

    /* ---------- 第1問 問2 単振動 ---------- */
    {
      id: 'sk-p-2024-1-2',
      subject: 'physics',
      level: 'mid',
      unit: 'p-shm',
      title: '鉛直ばね振り子のグラフ',
      source: src('第1問 問2'),
      time: 6,
      body: R`軽いばね（ばね定数 $k=50\,\mathrm{N/m}$）の上端を天井に固定し、下端に質量 $m=0.50\,\mathrm{kg}$ のおもりをつるすと、おもりは静止した。このときのおもりの位置を原点 O とし、鉛直上向きを $y$ 軸の正の向きとする。時刻 $t=0$ に、O にあるおもりを鉛直上向きに速さ $v_{0}=0.40\,\mathrm{m/s}$ で打ち出したところ、おもりは鉛直方向に単振動を始めた。空気抵抗とばねの質量は無視できる。選択肢のグラフは、横軸が時刻 $t$（約 2.5 周期分）、縦軸が各量（上向きを正）を表す。`,
      fig: figSpringShm(),
      parts: [
        {
          label: '(1)',
          q: R`おもりの座標 $y$ は、時間とともにどう変化するか。最も適切なグラフを選べ。`,
          type: 'choice',
          choices: SHM_OPTS,
          answer: 3,
          explain: R`$t=0$ で原点 O にあり、上向きに動き出すので、$y$ は $0$ から正の向きに増えていきます。原点から立ち上がる sin 型のグラフ（④）です。始めに最大値から始まる cos 型や、負の向きに動き出す型は、初期条件に合いません。周期が半分のもの（①）や振幅が減っていくもの（③）は、単振動（周期・振幅が一定）ではありません。`
        },
        {
          label: '(2)',
          q: R`おもりの速度の $y$ 成分 $v_{y}$ は、時間とともにどう変化するか。最も適切なグラフを選べ。`,
          type: 'choice',
          choices: SHM_OPTS,
          answer: 1,
          explain: R`速度は座標の変化の割合（$y$ のグラフの傾き）です。$t=0$ の速度は上向きの最大値 $v_{0}$ なので、正の最大値から始まる cos 型（②）です。座標が最大になる位置では、速度は $0$ になります。`
        },
        {
          label: '(3)',
          q: R`おもりにはたらく**合力**（重力とばねの弾性力の合力）の $y$ 成分 $F_{y}$ は、時間とともにどう変化するか。最も適切なグラフを選べ。`,
          type: 'choice',
          choices: SHM_OPTS,
          answer: 5,
          explain: R`合力は、つり合いの位置 O からの変位 $y$ に比例して、O に戻す向きにはたらきます（$F_{y}=-ky$）。つまり $y$ のグラフを上下に反転した形で、原点から下がり始める $-\sin$ 型（⑥）です。O を原点にとれば、重力はばねの伸びによる力と打ち消し合うので、式には現れません。`
        },
        {
          label: '(4)',
          q: R`この単振動の周期は何 $\mathrm{s}$ か。`,
          type: 'num',
          answer: 0.628,
          rel: 0.02,
          unit: 's',
          explain: R`$T=2\pi\sqrt{\dfrac{m}{k}}=2\pi\sqrt{\dfrac{0.50}{50}}=2\pi\times 0.10\approx 0.63\,\mathrm{s}$ です。周期は、おもりの質量とばね定数だけで決まり、打ち出す速さや振幅にはよりません。`
        },
        {
          label: '(5)',
          q: R`合力の大きさ $|F_{y}|$ の最大値は何 $\mathrm{N}$ か。`,
          type: 'num',
          answer: 2.0,
          rel: 0.02,
          unit: 'N',
          explain: R`角振動数 $\omega=\sqrt{\dfrac{k}{m}}=10\,\mathrm{rad/s}$、振幅 $A=\dfrac{v_{0}}{\omega}=0.040\,\mathrm{m}$ です。合力の大きさは端（$y=\pm A$）で最大になり、$kA=50\times 0.040=2.0\,\mathrm{N}$ です。エネルギー保存 $\dfrac{1}{2}mv_{0}^{2}=\dfrac{1}{2}kA^{2}$ から $A$ を求めても、同じ値になります。`
        }
      ],
      solution: [
        {
          t: '合力は、つり合いの位置からの変位に比例する',
          m: [
            R`\text{つり合いの位置（O）：}\quad k\,x_{0} = mg`,
            R`F_{y} = k\,(x_{0}-y) - mg = -k\,y`
          ],
          n: R`O では、ばねの伸び $x_{0}$ による上向きの力 $kx_{0}$ が重力 $mg$ とつり合っています。おもりが O から $y$ だけ上にあるとき、ばねの伸びは $x_{0}-y$ なので、合力の上向き成分は上の式になります。**合力は O からの変位に比例し、O に戻す向き**（$F_{y}=-ky$）です。これが単振動の条件です。`,
          easy: R`ばねにおもりをつるして静止させたとき、ばねの力と重力はちょうどつり合っています。その位置から上や下へずらすと、ずらした分だけ「元に戻す力」が生まれます。この力は、ずれが大きいほど強く、向きはいつも O の方です（上にずれたら下向き、下にずれたら上向き）。これが「単振動」をつくる力で、重力の分は最初のつり合いで消えてしまいます。`,
          lv: 1
        },
        {
          t: '$y$, $v_{y}$, $F_{y}$ の式',
          m: [
            R`y = A\sin\omega t`,
            R`v_{y} = A\omega\cos\omega t`,
            R`F_{y} = -ky = -kA\sin\omega t`
          ],
          n: R`$t=0$ で $y=0$、速度が上向き（$v_{y}>0$）なので、$y=A\sin\omega t$ とおけます。速度はその時間微分、合力は $-ky$ です。$\omega=\sqrt{k/m}$ は角振動数、$A$ は振幅で、$t=0$ の速度が最大値 $A\omega=v_{0}$ に等しいことから決まります。`,
          easy: R`単振動は、等速円運動を真横から見たときの影の動きと同じです。円周上を回る点が真横（O の位置）から出発して上へ向かうと、その影の高さは $\sin$ の形で変わります。影の速さは「円運動の速さの上向き成分」なので、O を通るときが最大（cos 型で $t=0$ が最大）、いちばん高いところで $0$ になります。`,
          lv: 2
        },
        {
          t: '3 つのグラフを重ねて比べる',
          n: R`図は、3 つの量を最大値で規格化して重ねたものです。**$F_{y}$ は $y$ と符号が逆**（上下反転）、**$v_{y}$ は $y$ より $\dfrac{1}{4}$ 周期だけ位相が進む**（$y$ が $0$ を通るとき $v_{y}$ は最大・最小）、という関係が一目で分かります。選択肢のうち、周期が違うもの・減衰するものは単振動ではないので、まず除外できます。`,
          fig: figShmSol(),
          pro: R`「$v$ は $x$ より位相が $\dfrac{\pi}{2}$ 進む、$a$ や $F$ は $x$ と逆位相」と暗記しておくと、初期条件（どこから、どの向きに動き出すか）を確かめるだけで即答できます。`,
          lv: 1
        },
        {
          t: '(1)(2)(3) の選択',
          n: R`$y$ → ④（原点から立ち上がる sin 型）、$v_{y}$ → ②（正の最大値から始まる cos 型）、$F_{y}$ → ⑥（原点から下がる $-\sin$ 型）です。`,
          lv: 1
        },
        {
          t: '(4)(5) 周期と合力の最大値',
          m: [
            R`\omega=\sqrt{\dfrac{k}{m}}=\sqrt{\dfrac{50}{0.50}}=10\,\mathrm{rad/s},\qquad T=\dfrac{2\pi}{\omega}\approx 0.628\,\mathrm{s}`,
            R`A=\dfrac{v_{0}}{\omega}=\dfrac{0.40}{10}=0.040\,\mathrm{m},\qquad |F_{y}|_{\max}=kA=50\times 0.040=2.0\,\mathrm{N}`
          ],
          n: R`合力が最大になるのは、振幅の位置（$y=\pm A$）、つまりおもりが一瞬止まる上下の端です。そのとき加速度の大きさも最大で、$\dfrac{2.0}{0.50}=4.0\,\mathrm{m/s^{2}}$ になります。`,
          lv: 1
        }
      ],
      tags: ['小問集合', '選択式', '単振動', 'グラフ', '位相', '復元力']
    },

    /* ---------- 第1問 問3 熱量の保存 ---------- */
    {
      id: 'sk-p-2024-1-3',
      subject: 'physics',
      level: 'mid',
      unit: 'p-heat',
      title: '熱量計と金属球の比熱',
      source: src('第1問 問3'),
      time: 5,
      body: R`熱量計（容器とかき混ぜ棒）に水を入れ、全体が 25 ℃ で熱平衡に達した状態から始める。熱量計の熱容量は $30\,\mathrm{J/K}$、水の質量は $150\,\mathrm{g}$、水の比熱は $4.2\,\mathrm{J/(g\cdot K)}$ である。この水の中に、100 ℃ に熱した質量 $200\,\mathrm{g}$ の金属球を静かに入れてかき混ぜたところ、全体の温度は 34 ℃ で一定になった。熱の出入りは、熱量計・水・金属球の間だけで起こるものとする。`,
      fig: figCalorimeter(),
      parts: [
        {
          label: '(1)',
          q: R`水と熱量計が受け取った熱量の合計は何 $\mathrm{J}$ か。`,
          type: 'num',
          answer: 5940,
          rel: 0.02,
          unit: 'J',
          hint: R`1500 や 1.5e3 の形で入力できます。`,
          explain: R`水の熱容量は $150\times 4.2=630\,\mathrm{J/K}$、熱量計は $30\,\mathrm{J/K}$ で、合わせて $660\,\mathrm{J/K}$ です。温度が $34-25=9\,\mathrm{K}$ 上がったので、受け取った熱量は $660\times 9=5940\,\mathrm{J}$ です。`
        },
        {
          label: '(2)',
          q: R`金属球の比熱として、最も適切なものを選べ。`,
          type: 'choice',
          choices: [R`$0.13\,\mathrm{J/(g\cdot K)}$`, R`$0.40\,\mathrm{J/(g\cdot K)}$`, R`$0.43\,\mathrm{J/(g\cdot K)}$`, R`$0.45\,\mathrm{J/(g\cdot K)}$`, R`$0.60\,\mathrm{J/(g\cdot K)}$`, R`$0.88\,\mathrm{J/(g\cdot K)}$`],
          answer: 3,
          explain: R`金属球が放出した熱量は、水と熱量計が受け取った熱量に等しいので、$200\times c\times(100-34)=5940$ より $c=\dfrac{5940}{200\times 66}=0.45\,\mathrm{J/(g\cdot K)}$ です。温度変化を $100-25=75\,\mathrm{K}$ としてしまうと $0.40$、熱量計の熱容量を忘れると $0.43$、球の質量を $150\,\mathrm{g}$（水の質量）としてしまうと $0.60$ になります。`
        },
        {
          label: '(3)',
          q: R`もし熱量計の熱容量を無視して計算すると、(2) の比熱は実際の値に比べてどうなるか。`,
          type: 'choice',
          choices: [R`実際より大きく求まる`, R`実際と変わらない`, R`実際より小さく求まる`],
          answer: 2,
          explain: R`熱量計が受け取った熱量 $30\times 9=270\,\mathrm{J}$ を見落とすと、金属球が放出した熱量が $5940\,\mathrm{J}$ ではなく $5670\,\mathrm{J}$ と小さく見積もられます。そのため比熱も小さく求まり、$\dfrac{5670}{200\times 66}\approx 0.43\,\mathrm{J/(g\cdot K)}$ となります。`
        }
      ],
      solution: [
        {
          t: '熱量の保存の式を立てる',
          m: R`\text{金属球が失った熱量} = \text{水が得た熱量} + \text{熱量計が得た熱量}`,
          n: R`外部との熱の出入りがないので、高温の金属球が放出した熱量は、そっくり低温の水と熱量計が受け取ります（熱量の保存）。質量 $m$、比熱 $c$ の物体の温度が $\Delta t$ 変わるとき、熱量は $Q=mc\,\Delta t$。熱容量 $C$ の物体では $Q=C\,\Delta t$ です。`,
          easy: R`熱いお湯と冷たい水を混ぜると、ぬるいお湯になります。熱いほうが失った熱が、そのまま冷たいほうへ移った、と考えるのが「熱量の保存」です。熱の量は温度そのものではなく、「温度の変化」と「温まりにくさ」のかけ算で決まります。この「温まりにくさ」が、比熱（$1\,\mathrm{g}$ あたり）や熱容量（物体全体あたり）です。`,
          lv: 1
        },
        {
          t: '(1) 水と熱量計が受け取った熱量',
          m: [
            R`C_{\text{水}} = 150\times 4.2 = 630\,\mathrm{J/K}`,
            R`Q = (630 + 30)\times(34 - 25) = 660\times 9 = 5940\,\mathrm{J}`
          ],
          n: R`水の熱容量は「質量 × 比熱」で $630\,\mathrm{J/K}$、熱量計の熱容量は $30\,\mathrm{J/K}$ です。どちらも 25 ℃ から 34 ℃ まで $9\,\mathrm{K}$ 上がったので、まとめて熱容量 $660\,\mathrm{J/K}$ の 1 つの物体として扱えます。`,
          easy: R`熱容量は「その物体の温度を $1\,\mathrm{K}$ 上げるのに必要な熱量」です。水 $150\,\mathrm{g}$ は、$1\,\mathrm{g}$ を $1\,\mathrm{K}$ 上げるのに $4.2\,\mathrm{J}$ 必要なので、$150\times 4.2=630\,\mathrm{J}$ で $1\,\mathrm{K}$ 上がります。容器も同じように温まるので、その分 $30\,\mathrm{J/K}$ を足して $660\,\mathrm{J/K}$ です。これに温度の上昇 $9\,\mathrm{K}$ をかければ、受け取った熱量が出ます。`,
          lv: 1
        },
        {
          t: '(2) 金属球の比熱',
          m: [
            R`m_{\text{球}}\,c\,(100 - 34) = 5940`,
            R`200\times c\times 66 = 5940`,
            R`c = \dfrac{5940}{200\times 66} = 0.45\,\mathrm{J/(g\cdot K)}`
          ],
          n: R`金属球の温度変化は、入れる前の 100 ℃ から最後の 34 ℃ までの $66\,\mathrm{K}$ です。$100-25=75\,\mathrm{K}$ としてしまう誤りが多いので注意します（25 ℃ は水のはじめの温度です）。`,
          fig: figHeatSol(),
          pro: R`熱量保存は「失った熱 = 得た熱」を、物体ごとに（質量 × 比熱 × 温度変化）または（熱容量 × 温度変化）で足していくだけです。温度変化は「その物体自身の、はじめと最後の差」で、物体どうしの温度差ではありません。`,
          lv: 1
        },
        {
          t: '(3) 熱量計の熱容量を無視すると',
          m: [
            R`Q' = 630\times 9 = 5670\,\mathrm{J}`,
            R`c' = \dfrac{5670}{200\times 66} \approx 0.43\,\mathrm{J/(g\cdot K)}`
          ],
          n: R`熱量計が受け取った $30\times 9=270\,\mathrm{J}$ を見落とすと、金属球が放出した熱量が実際より小さく見積もられ、比熱は小さく求まります。実験では、熱量計の熱容量をあらかじめ測っておく理由です。`,
          lv: 2
        }
      ],
      tags: ['小問集合', '選択式', '熱量の保存', '比熱', '熱容量']
    },

    /* ---------- 第1問 問4 熱力学第一法則 ---------- */
    {
      id: 'sk-p-2024-1-4',
      subject: 'physics',
      level: 'mid',
      unit: 'p-thermo1',
      title: '気体の定圧冷却と熱量',
      source: src('第1問 問4'),
      time: 5,
      body: R`摩擦なく動く軽いピストンをそなえたシリンダーの中に、単原子分子の理想気体が入っている。ピストンには外から一定の圧力がはたらき続けているので、気体の圧力は $2.0\times 10^{5}\,\mathrm{Pa}$ のまま変わらない。はじめ、気体の体積は $6.0\times 10^{-3}\,\mathrm{m^{3}}$、温度は $300\,\mathrm{K}$ であった。この気体から熱をゆっくりと逃がしていくと、圧力は変わらないまま、体積が $4.0\times 10^{-3}\,\mathrm{m^{3}}$ まで減った。`,
      fig: figCylinder(),
      parts: [
        {
          label: '(1)',
          q: R`この変化で、気体が外部からされた仕事 $W$ として最も適切なものを選べ。`,
          type: 'choice',
          choices: [R`$-4.0\times 10^{2}\,\mathrm{J}$`, R`$2.0\times 10^{2}\,\mathrm{J}$`, R`$4.0\times 10^{2}\,\mathrm{J}$`, R`$6.0\times 10^{2}\,\mathrm{J}$`, R`$8.0\times 10^{2}\,\mathrm{J}$`, R`$1.2\times 10^{3}\,\mathrm{J}$`],
          answer: 2,
          explain: R`圧力が一定なので、仕事の大きさは $P\,|\Delta V|=2.0\times 10^{5}\times 2.0\times 10^{-3}=4.0\times 10^{2}\,\mathrm{J}$ です。体積が減る（気体が押し縮められる）ので、気体は外部から仕事をされ、符号は正です。$-4.0\times 10^{2}\,\mathrm{J}$ は符号の誤り（気体が外部にした仕事の値）です。`
        },
        {
          label: '(2)',
          q: R`気体の内部エネルギーの変化 $\Delta U$ として最も適切なものを選べ。`,
          type: 'choice',
          choices: [R`$-1.0\times 10^{3}\,\mathrm{J}$`, R`$-6.0\times 10^{2}\,\mathrm{J}$`, R`$-4.0\times 10^{2}\,\mathrm{J}$`, R`$4.0\times 10^{2}\,\mathrm{J}$`, R`$6.0\times 10^{2}\,\mathrm{J}$`, R`$1.0\times 10^{3}\,\mathrm{J}$`],
          answer: 1,
          explain: R`単原子分子理想気体の内部エネルギーは $U=\dfrac{3}{2}nRT=\dfrac{3}{2}PV$ です。$\Delta U=\dfrac{3}{2}P\,(V_{2}-V_{1})=\dfrac{3}{2}\times 2.0\times 10^{5}\times(-2.0\times 10^{-3})=-6.0\times 10^{2}\,\mathrm{J}$。温度が下がっているので、内部エネルギーは減ります（負）。`
        },
        {
          label: '(3)',
          q: R`気体が放出した熱量として最も適切なものを選べ。`,
          type: 'choice',
          choices: [R`$2.0\times 10^{2}\,\mathrm{J}$`, R`$4.0\times 10^{2}\,\mathrm{J}$`, R`$6.0\times 10^{2}\,\mathrm{J}$`, R`$1.0\times 10^{3}\,\mathrm{J}$`, R`$1.4\times 10^{3}\,\mathrm{J}$`, R`$2.0\times 10^{3}\,\mathrm{J}$`],
          answer: 3,
          explain: R`熱力学第一法則 $\Delta U=Q+W$ より、$Q=\Delta U-W=-6.0\times 10^{2}-4.0\times 10^{2}=-1.0\times 10^{3}\,\mathrm{J}$。負は「放出」を表すので、放出した熱量は $1.0\times 10^{3}\,\mathrm{J}$ です。気体は外から仕事をされた分（$4.0\times 10^{2}\,\mathrm{J}$）に加えて、内部エネルギーの減少分（$6.0\times 10^{2}\,\mathrm{J}$）も、熱として捨てています。`
        },
        {
          label: '(4)',
          q: R`変化後の気体の温度は何 $\mathrm{K}$ か。`,
          type: 'num',
          answer: 200,
          rel: 0.02,
          unit: 'K',
          explain: R`圧力が一定のとき、体積は絶対温度に比例します（シャルルの法則）。$T_{2}=300\times\dfrac{4.0\times 10^{-3}}{6.0\times 10^{-3}}=200\,\mathrm{K}$ です。`
        }
      ],
      solution: [
        {
          t: '第一法則と符号の約束',
          m: R`\Delta U = Q + W`,
          n: R`$\Delta U$ は気体の内部エネルギーの変化、$Q$ は気体が**吸収した**熱量（放出したときは負）、$W$ は気体が外部から**された**仕事（気体が膨張して外部にした仕事は負）です。この問題では、熱を放出して体積が減る（圧縮される）ので、$Q<0$、$W>0$、温度が下がるので $\Delta U<0$ となるはずです。`,
          easy: R`気体のエネルギーは、「熱をもらう」か「押されて仕事をされる」と増え、「熱を捨てる」か「自分で押し返して仕事をする」と減ります。式 $\Delta U=Q+W$ は、そのエネルギーの出入りを記録する家計簿のようなものです。$Q$ と $W$ は、**気体の側から見て**入ってくるときを正とします。`,
          lv: 1
        },
        {
          t: '(1) 気体がされた仕事',
          m: [
            R`W = -P\,\Delta V = -P\,(V_{2}-V_{1})`,
            R`= -2.0\times 10^{5}\times(4.0\times 10^{-3}-6.0\times 10^{-3}) = 4.0\times 10^{2}\,\mathrm{J}`
          ],
          n: R`圧力が一定なので、$P$-$V$ グラフの長方形の面積 $P\times|\Delta V|$ が仕事の大きさです。体積が減る（圧縮される）ので、気体は外から仕事をされ、$W>0$ になります。`,
          fig: figPVCool(),
          easy: R`ピストンを押して体積を小さくすると、気体は外から押された分だけエネルギーをもらいます。その量が「圧力 × 体積の減少分」で、グラフでは色のついた長方形の面積になります。`,
          lv: 1
        },
        {
          t: '(2) 内部エネルギーの変化',
          m: [
            R`U = \dfrac{3}{2}nRT = \dfrac{3}{2}PV`,
            R`\Delta U = \dfrac{3}{2}\,P\,(V_{2}-V_{1}) = \dfrac{3}{2}\times 2.0\times 10^{5}\times(-2.0\times 10^{-3}) = -6.0\times 10^{2}\,\mathrm{J}`
          ],
          n: R`単原子分子理想気体の内部エネルギーは $U=\dfrac{3}{2}nRT$ で、状態方程式 $PV=nRT$ から $U=\dfrac{3}{2}PV$ とも書けます。内部エネルギーは温度だけで決まるので、途中経路によらず、はじめと終わりの $PV$ の差から求まります。`,
          easy: R`単原子分子（ヘリウムなど）の気体では、エネルギーは分子が飛び回る運動エネルギーだけで、その合計が $\dfrac{3}{2}nRT$ です。温度に比例するので、温度が下がれば内部エネルギーも減ります。ここでは、$PV=nRT$ を使って「温度の代わりに $PV$」で書き直しています。`,
          lv: 1
        },
        {
          t: '(3) 放出した熱量',
          m: R`Q = \Delta U - W = -6.0\times 10^{2} - 4.0\times 10^{2} = -1.0\times 10^{3}\,\mathrm{J}`,
          n: R`$Q=-1.0\times 10^{3}\,\mathrm{J}$ は、気体が熱を $1.0\times 10^{3}\,\mathrm{J}$ **放出**したことを表します。圧縮されて仕事をもらっても、それ以上に熱を捨てたので、内部エネルギーが減りました。`,
          pro: R`定圧変化の熱量は $Q=\dfrac{5}{2}P\,\Delta V$（定圧モル比熱 $C_{p}=\dfrac{5}{2}R$）と一気に出せます。$\dfrac{5}{2}\times 2.0\times 10^{5}\times(-2.0\times 10^{-3})=-1.0\times 10^{3}\,\mathrm{J}$ です。単原子分子の定圧変化では「$\Delta U$ : 気体がした仕事 : $Q$ = 3 : 2 : 5」と覚えておくと速い。`,
          lv: 1
        },
        {
          t: '(4) 変化後の温度（シャルルの法則）',
          m: R`\dfrac{V_{1}}{T_{1}} = \dfrac{V_{2}}{T_{2}} \;\Rightarrow\; T_{2} = 300\times\dfrac{4.0}{6.0} = 200\,\mathrm{K}`,
          n: R`圧力が一定のとき、気体の体積は絶対温度に比例します。体積が $\dfrac{2}{3}$ 倍になったので、温度も $\dfrac{2}{3}$ 倍の $200\,\mathrm{K}$ です。(2) を温度から確かめることもできます。$nR=\dfrac{PV_{1}}{T_{1}}=4.0\,\mathrm{J/K}$ なので、$\Delta U=\dfrac{3}{2}nR\,(200-300)=-6.0\times 10^{2}\,\mathrm{J}$ と一致します。`,
          lv: 2
        }
      ],
      tags: ['小問集合', '選択式', '熱力学第一法則', '定圧変化', '単原子分子理想気体']
    },

    /* ---------- 第1問 問5 一様な電場と仕事 ---------- */
    {
      id: 'sk-p-2024-1-5',
      subject: 'physics',
      level: 'mid',
      unit: 'p-estat',
      title: '極板間で加速される電子',
      source: src('第1問 問5'),
      time: 4,
      body: R`真空中で、間隔 $d=5.0\,\mathrm{mm}$ の 2 枚の平行な金属板 P, Q の間に、一様な電場ができている。P の表面に静かに置いた電子（電気量 $-e=-1.6\times 10^{-19}\,\mathrm{C}$）は、電場から力を受けて Q に向かって動き出し、Q に達したときの運動エネルギーは $8.0\times 10^{-16}\,\mathrm{J}$ であった。電子にはたらく力は、極板間の電場による力だけであるとし、重力は無視する。`,
      fig: figPlates(false),
      parts: [
        {
          label: '(1)',
          q: R`極板間の電場の強さとして、最も適切なものを選べ。`,
          type: 'choice',
          choices: [R`$1.0\times 10^{5}\,\mathrm{N/C}$`, R`$5.0\times 10^{5}\,\mathrm{N/C}$`, R`$1.0\times 10^{6}\,\mathrm{N/C}$`, R`$2.0\times 10^{6}\,\mathrm{N/C}$`, R`$5.0\times 10^{6}\,\mathrm{N/C}$`, R`$1.0\times 10^{7}\,\mathrm{N/C}$`],
          answer: 2,
          explain: R`一様な電場が電子にする仕事 $eEd$ が、運動エネルギー $8.0\times 10^{-16}\,\mathrm{J}$ に等しいので、$E=\dfrac{8.0\times 10^{-16}}{1.6\times 10^{-19}\times 5.0\times 10^{-3}}=1.0\times 10^{6}\,\mathrm{N/C}$ です。$d=5.0\,\mathrm{mm}$ を $5.0\times 10^{-3}\,\mathrm{m}$ に直すところで、$\mathrm{cm}$ と取り違えると $1.0\times 10^{5}$、$5.0\times 10^{-4}\,\mathrm{m}$ としてしまうと $1.0\times 10^{7}$ という誤りになります。`
        },
        {
          label: '(2)',
          q: R`極板間の電場の向きとして、正しいものを選べ。`,
          type: 'choice',
          choices: [R`P から Q へ向かう向き`, R`Q から P へ向かう向き`],
          answer: 1,
          explain: R`電場の向きは、正の電気をもつ電荷が受ける力の向きと定めます。電子は負の電気をもつので、電場と**逆向き**に力を受けます。電子が P から Q へ向かって動き出したことから、電子が受ける力は P → Q の向き。したがって電場は Q → P の向きです。`
        },
        {
          label: '(3)',
          q: R`Q の電位は、P の電位より何 $\mathrm{V}$ 高いか。`,
          type: 'num',
          answer: 5000,
          rel: 0.02,
          unit: 'V',
          show: R`5.0\times 10^{3}`,
          hint: R`1500 や 1.5e3 の形で入力できます。`,
          explain: R`極板間の電位差は $V=Ed=1.0\times 10^{6}\times 5.0\times 10^{-3}=5.0\times 10^{3}\,\mathrm{V}$ です。電場は電位が高い方から低い方へ向かうので、(2) より Q の方が高電位です。電子は電位の高い方へ加速されます。別解として、静電気力のする仕事 $eV$ が運動エネルギーに等しいことから $V=\dfrac{8.0\times 10^{-16}}{1.6\times 10^{-19}}$ とも求まります。`
        }
      ],
      solution: [
        {
          t: '電場が電子にした仕事は、運動エネルギーに変わる',
          m: R`W = F\,d = eE\,d = K - 0`,
          n: R`静止していた電子は、一様な電場から大きさ一定の力 $F=eE$ を受け、距離 $d$ だけ動く間に仕事 $eEd$ をされます。この仕事が運動エネルギーの増加 $K-0$ に等しくなります（仕事とエネルギーの関係）。電子は電場以外の力を受けないので、ほかのエネルギーの出入りはありません。`,
          easy: R`電気の力も、重力と同じように、物体に仕事をして速さ（運動エネルギー）を増やすはたらきがあります。一定の力 $F$ で距離 $d$ だけ押し続けたときの仕事は $F\times d$ です。電子にはたらく力は「電気量 $e$ × 電場の強さ $E$」なので、仕事は $eEd$ になります。`,
          lv: 1
        },
        {
          t: '(1) 電場の強さ',
          m: [
            R`E = \dfrac{K}{e\,d}`,
            R`= \dfrac{8.0\times 10^{-16}}{1.6\times 10^{-19}\times 5.0\times 10^{-3}} = 1.0\times 10^{6}\,\mathrm{N/C}`
          ],
          n: R`$d=5.0\,\mathrm{mm}=5.0\times 10^{-3}\,\mathrm{m}$ と単位をそろえてから代入します。電場の単位 $\mathrm{N/C}$（$=\mathrm{V/m}$）は、長さを $\mathrm{m}$ で測った値です。`,
          easy: R`電場の強さの単位 $\mathrm{N/C}$ は「$1\,\mathrm{C}$ あたり何ニュートンの力か」を表すので、長さは $\mathrm{m}$ で計算します。$1\,\mathrm{mm}$ は $10^{-3}\,\mathrm{m}$、$1\,\mathrm{cm}$ は $10^{-2}\,\mathrm{m}$ です。`,
          pro: R`運動エネルギーを電子ボルトで表すと $K=\dfrac{8.0\times 10^{-16}}{1.6\times 10^{-19}}\,\mathrm{eV}=5.0\times 10^{3}\,\mathrm{eV}$ なので、電位差が $5.0\times 10^{3}\,\mathrm{V}$ と分かり、$E=\dfrac{V}{d}=\dfrac{5.0\times 10^{3}}{5.0\times 10^{-3}}$ と一気に出せます。`,
          lv: 1
        },
        {
          t: '(2) 電場の向き',
          n: R`電子は負の電気をもつので、電場と**逆向き**の力を受けます。電子が P から Q へ向かって動き出したので、電子が受ける力は P → Q の向き、よって電場の向きは Q → P です。電場の向きは、正の電荷が受ける力の向きで定めることを思い出します。`,
          fig: figPlates(true),
          easy: R`電場の矢印は、「プラスの電気をもつ粒を置いたら、どちらへ押されるか」を表します。電子はマイナスの電気をもつので、矢印とは反対向きに押されます。図では、電子を右（Q）へ押す力 $F$ と、左（P）を向く電場 $E$ が、逆向きになっています。`,
          lv: 1
        },
        {
          t: '(3) 電位差',
          m: [
            R`V = E\,d = 1.0\times 10^{6}\times 5.0\times 10^{-3} = 5.0\times 10^{3}\,\mathrm{V}`,
            R`\left(\text{別解：}\ eV = K \;\Rightarrow\; V = \dfrac{8.0\times 10^{-16}}{1.6\times 10^{-19}} = 5.0\times 10^{3}\,\mathrm{V}\right)`
          ],
          n: R`電場は電位の高い方から低い方へ向かう（Q → P）ので、Q の電位が P より高くなります。電子は電位の高い方へ引き寄せられて加速されたことが分かります。`,
          easy: R`電位は、電気の「高さ」にたとえられます。電場は、高い所から低い所へ向かう「坂の下り方向」です。プラスの電荷は坂を下る向き（電場の向き）に加速されますが、マイナスの電荷である電子は、坂を登る向き（電位の高い Q の方）へ加速されます。`,
          lv: 1
        }
      ],
      tags: ['小問集合', '選択式', '一様な電場', '電位差', '仕事とエネルギー']
    },

    /* ================= 第2問（力学）================= */
    {
      id: 'sk-p-2024-2',
      subject: 'physics',
      level: 'mid',
      unit: 'p-energy',
      title: '粗い区間のある斜面とばね',
      source: src('第2問'),
      time: 15,
      body: R`水平な床の上に、傾き $\theta$ の斜面が固定されている。斜面の下端にはばねが斜面に沿って取り付けてあり、自然の長さのときのばねの先端を点 C とする。斜面の途中にある点 A（上側）から点 B（下側）までの区間は、長さが $2\ell$ で、小物体との動摩擦係数が $\mu'$ のあらい面になっている。あらいのはこの AB 間だけで、斜面のほかの部分とばねの表面は摩擦なしとして扱ってよい。A から斜面に沿って上方へ $\ell$ だけ離れた位置に点 O をとる。O に置いた質量 $m$ の小物体から静かに手を離す瞬間を、時刻 $t=0$ とする。小物体は斜面を下り、点 B を過ぎてばねを縮めたあと、ばねに押し返されて斜面を上っていった。小物体の大きさとばねの質量は無視でき、重力加速度の大きさを $g$ とする。`,
      fig: figIncline(),
      parts: [
        {
          label: '(1)',
          q: R`手を離してから、小物体がはじめて点 A に達するまでの時間 $t$ はいくらか。正しいものを選べ。`,
          type: 'choice',
          choices: [R`$\sqrt{\dfrac{2\ell}{g\cos\theta}}$`, R`$\sqrt{\dfrac{2\ell}{g\sin\theta}}$`, R`$\sqrt{\dfrac{\ell}{g\sin\theta}}$`, R`$\sqrt{\dfrac{2\ell\sin\theta}{g}}$`, R`$\sqrt{\dfrac{2\ell}{g}}$`, R`$2\sqrt{\dfrac{\ell}{g\sin\theta}}$`],
          answer: 1,
          explain: R`OA 間はなめらかなので、斜面に沿った加速度は $a=g\sin\theta$ の等加速度直線運動です。初速度 $0$ で距離 $\ell$ 進むので $\ell=\dfrac{1}{2}g\sin\theta\,t^{2}$、よって $t=\sqrt{\dfrac{2\ell}{g\sin\theta}}$ です。斜面が水平に近い（$\sin\theta\to 0$）ほど時間が長くなり、垂直に近い（$\theta\to 90\degree$）と自由落下の $\sqrt{\dfrac{2\ell}{g}}$ に近づく、という極限の確認もできます。`
        },
        {
          label: '(2)',
          q: R`点 A を通過する瞬間の小物体の速さ $v_{\mathrm{A}}$ はいくらか。正しいものを選べ。`,
          type: 'choice',
          choices: [R`$\sqrt{2g\ell\cos\theta}$`, R`$\sqrt{g\ell\sin\theta}$`, R`$\sqrt{2g\ell}$`, R`$\sqrt{2g\ell\sin\theta}$`, R`$2\sqrt{g\ell\sin\theta}$`, R`$\sqrt{2g\ell\tan\theta}$`],
          answer: 3,
          explain: R`$v_{\mathrm{A}}=g\sin\theta\cdot t=\sqrt{2g\ell\sin\theta}$ です。力学的エネルギー保存から求めると、O から A までに下がる高さは $\ell\sin\theta$ なので $\dfrac{1}{2}mv_{\mathrm{A}}^{2}=mg\,\ell\sin\theta$。斜面に沿った距離 $\ell$ をそのまま高さにしてしまう（$\sqrt{2g\ell}$）誤りに注意します。`
        },
        {
          label: '(3)',
          q: R`あらい区間を下りきって点 B に達したときの小物体の速さ $v_{\mathrm{B}}$ はいくらか。正しいものを選べ。`,
          type: 'choice',
          choices: [R`$\sqrt{2g\ell\,(3\sin\theta-\mu'\cos\theta)}$`, R`$\sqrt{2g\ell\,(3\sin\theta+2\mu'\cos\theta)}$`, R`$\sqrt{2g\ell\,(2\sin\theta-2\mu'\cos\theta)}$`, R`$\sqrt{6g\ell\sin\theta}$`, R`$\sqrt{2g\ell\,(3\sin\theta-2\mu'\cos\theta)}$`, R`$\sqrt{2g\ell\,(3\sin\theta-2\mu'\sin\theta)}$`],
          answer: 4,
          explain: R`O から B までに下がる高さは $3\ell\sin\theta$。AB 間（長さ $2\ell$）では動摩擦力 $\mu' mg\cos\theta$ が負の仕事をします。エネルギーの関係 $\dfrac{1}{2}mv_{\mathrm{B}}^{2}=mg\cdot 3\ell\sin\theta-\mu' mg\cos\theta\cdot 2\ell$ より、$v_{\mathrm{B}}=\sqrt{2g\ell\,(3\sin\theta-2\mu'\cos\theta)}$ です。摩擦のする仕事は、摩擦力 × **あらい区間の長さ** $2\ell$ であり、垂直抗力は $mg\cos\theta$（$\sin\theta$ ではない）です。`
        },
        {
          label: '(4)',
          q: R`ばねに押し返された小物体が、あらい区間を斜面に沿って上へ進んでいる間の加速度 $a$ はいくらか。斜面に沿って上向きを正として、正しいものを選べ。`,
          type: 'choice',
          choices: [R`$-g\,(\sin\theta+\mu'\cos\theta)$`, R`$-g\,(\sin\theta-\mu'\cos\theta)$`, R`$g\,(\sin\theta+\mu'\cos\theta)$`, R`$-g\sin\theta$`, R`$-\mu' g\cos\theta$`, R`$-g\,(\cos\theta+\mu'\sin\theta)$`],
          answer: 0,
          explain: R`上向きに動くとき、重力の斜面成分 $mg\sin\theta$ も動摩擦力 $\mu' mg\cos\theta$ も下向き（負の向き）にはたらくので、$ma=-mg\sin\theta-\mu' mg\cos\theta$、$a=-g\,(\sin\theta+\mu'\cos\theta)$ です。すべり降りるとき（摩擦力が上向き）の $g\,(\sin\theta-\mu'\cos\theta)$ と混同しないようにします。`
        },
        {
          label: '(5)',
          q: R`小物体が、B を通ってばねに達し、ばねに押し返されたあと、A に届かないうちに AB 間の途中で動きを止める（一瞬静止する）ためには、$\theta$ と $\mu'$ がどんな関係を満たせばよいか。正しいものを選べ。`,
          type: 'choice',
          choices: [R`$\dfrac{1}{3}\mu' < \tan\theta \le 4\mu'$`, R`$\dfrac{2}{3}\mu' < \tan\theta \le \dfrac{3}{2}\mu'$`, R`$\dfrac{2}{3}\mu' < \tan\theta \le 4\mu'$`, R`$\dfrac{2}{3}\mu' < \tan\theta \le 2\mu'$`, R`$\mu' < \tan\theta \le 4\mu'$`, R`$\dfrac{2}{3}\mu' < \tan\theta \le 3\mu'$`],
          answer: 2,
          explain: R`点 B を通過するには、$v_{\mathrm{B}}^{2}>0$ から $3\sin\theta>2\mu'\cos\theta$、つまり $\tan\theta>\dfrac{2}{3}\mu'$。ばねで押し返されて B に戻る速さは $v_{\mathrm{B}}$ のままなので（なめらか）、AB 間をすべり上がって止まるまでの距離は $\dfrac{v_{\mathrm{B}}^{2}}{2g\,(\sin\theta+\mu'\cos\theta)}$。これが $2\ell$ 以下になる条件 $3\sin\theta-2\mu'\cos\theta\le 2(\sin\theta+\mu'\cos\theta)$ から $\tan\theta\le 4\mu'$ です。まとめて $\dfrac{2}{3}\mu'<\tan\theta\le 4\mu'$。上りの加速度に摩擦を入れ忘れると上限が $2\mu'$、止まるまでの距離の上限を $2\ell$ ではなく $\ell$ と取り違えると上限が $\dfrac{3}{2}\mu'$ になります。`
        },
        {
          label: '(6)',
          q: R`$\theta=30\degree$、$\mu'=0.20$、$\ell=0.50\,\mathrm{m}$、$g=9.8\,\mathrm{m/s^{2}}$ とする（これらの値は (5) の条件を満たしている）。小物体が AB 間で動きを止める位置は、点 B から斜面に沿って何 $\mathrm{m}$ 上か。`,
          type: 'num',
          answer: 0.857,
          rel: 0.02,
          unit: 'm',
          explain: R`$v_{\mathrm{B}}^{2}=2\times 9.8\times 0.50\times(3\times 0.50-2\times 0.20\times 0.866)\approx 11.3\,\mathrm{m^{2}/s^{2}}$。止まるまでの距離は $\dfrac{v_{\mathrm{B}}^{2}}{2g\,(\sin\theta+\mu'\cos\theta)}=\dfrac{11.3}{2\times 9.8\times(0.50+0.20\times 0.866)}\approx 0.857\,\mathrm{m}$。これは AB の長さ $2\ell=1.0\,\mathrm{m}$ より短いので、確かに A を越える前に止まります。`
        }
      ],
      solution: [
        {
          t: 'なめらかな部分 OA の運動（(1)(2)）',
          m: [
            R`ma = mg\sin\theta \;\Rightarrow\; a = g\sin\theta`,
            R`\ell = \dfrac{1}{2}\,g\sin\theta\;t^{2} \;\Rightarrow\; t = \sqrt{\dfrac{2\ell}{g\sin\theta}}`,
            R`v_{\mathrm{A}} = g\sin\theta\cdot t = \sqrt{2g\ell\sin\theta}`
          ],
          n: R`斜面に沿った方向の運動方程式を立てます。垂直抗力は斜面に垂直なので、斜面方向には重力の斜面成分 $mg\sin\theta$ だけがはたらき、加速度は一定です。初速度 $0$ の等加速度直線運動として、時間と速さが求まります。`,
          easy: R`物体が斜面をすべるとき、重力を「斜面に沿う向きの力」と「斜面に垂直な向きの力」に分けて考えます。垂直な向きの力は斜面（垂直抗力）が受け止めるので、物体を動かすのは斜面に沿う向きの力 $mg\sin\theta$ だけです。傾きが急なほど、この力は大きくなります。力が一定なら加速度も一定なので、「初速度 $0$ の等加速度運動」の式がそのまま使えます。`,
          pro: R`速さだけが欲しいときは、力学的エネルギー保存を使えば時間を経由せずに出せます。高さの減少は斜面に沿った距離ではなく $\ell\sin\theta$ です：$\dfrac{1}{2}mv_{\mathrm{A}}^{2}=mg\,\ell\sin\theta$。`,
          lv: 1
        },
        {
          t: 'あらい部分 AB の運動と B での速さ（(3)）',
          m: [
            R`N = mg\cos\theta`,
            R`ma' = mg\sin\theta - \mu' N \;\Rightarrow\; a' = g\,(\sin\theta - \mu'\cos\theta)`,
            R`v_{\mathrm{B}}^{2} = v_{\mathrm{A}}^{2} + 2a'\cdot 2\ell = 2g\ell\,(3\sin\theta - 2\mu'\cos\theta)`
          ],
          n: R`斜面に垂直な方向の力のつり合いから $N=mg\cos\theta$、動摩擦力は $\mu' N$ で、すべり降りるときは上向きにはたらきます。AB 間の加速度 $a'$ は一定なので、$v^{2}-v_{0}^{2}=2ax$ を使って B での速さが求まります。エネルギーで考えると、$\dfrac{1}{2}mv_{\mathrm{B}}^{2}=mg\cdot 3\ell\sin\theta-\mu' mg\cos\theta\cdot 2\ell$ となり、同じ式が得られます。`,
          easy: R`あらい面では、動く向きと逆向きに摩擦力がはたらきます。斜面を降りているときは、摩擦力は斜面の上向きです。摩擦力の大きさは「摩擦係数 × 垂直抗力」で、斜面の上では垂直抗力が $mg\cos\theta$ になります（斜面に垂直な方向で、力がつり合っているからです）。降りるときの加速度は、重力の斜面成分から摩擦力を引いた分で決まります。`,
          pro: R`あらい区間の長さが分かっているときは、「重力がする仕事 − 摩擦がする仕事 = 運動エネルギーの変化」の方が速いです。摩擦の仕事は $\mu' mg\cos\theta\times$（あらい区間の長さ）で、斜面の上でも水平面と同じ形です。`,
          lv: 1
        },
        {
          t: '上りの加速度（(4)）',
          m: [
            R`ma = -mg\sin\theta - \mu' mg\cos\theta`,
            R`a = -g\,(\sin\theta + \mu'\cos\theta)`
          ],
          n: R`ばねも、ばねとの接触面もなめらかなので、小物体は B に戻るときも同じ速さ $v_{\mathrm{B}}$ をもっています（力学的エネルギー保存）。上向きに進むとき、重力の斜面成分も動摩擦力も下向きにはたらき、小物体はどんどん減速します。斜面に沿って上向きを正としたので、加速度は負です。`,
          fig: figInclineForces(),
          easy: R`動摩擦力は、物体の動く向きと逆向きです。上へ動いているときは、摩擦力は下向きです。重力の斜面成分も下向きなので、2 つの力が同じ向きに重なり、強く減速します。降りるときは摩擦力が上向きなので、重力の斜面成分と打ち消し合う向きだったことと比べてみましょう。`,
          lv: 1
        },
        {
          t: '「通過して、戻って、AB 間で止まる」条件（(5)）',
          m: [
            R`\text{B を通過：}\quad v_{\mathrm{B}}^{2} > 0 \;\Rightarrow\; 3\sin\theta > 2\mu'\cos\theta \;\Rightarrow\; \tan\theta > \dfrac{2}{3}\mu'`,
            R`\text{止まるまでの距離：}\quad x = \dfrac{v_{\mathrm{B}}^{2}}{2g\,(\sin\theta+\mu'\cos\theta)} \le 2\ell`,
            R`3\sin\theta - 2\mu'\cos\theta \le 2\,(\sin\theta+\mu'\cos\theta) \;\Rightarrow\; \tan\theta \le 4\mu'`,
            R`\dfrac{2}{3}\mu' < \tan\theta \le 4\mu'`
          ],
          n: R`2 つの条件を別々に考えます。**① 下りで B まで届くこと**：$v_{\mathrm{B}}$ が $0$ より大きければよい（等号は B で止まる場合）。**② 上りで A を越えないこと**：B から上向きに進んで止まるまでの距離 $x$ が AB の長さ $2\ell$ 以下であればよい（$x=2\ell$ は A でちょうど止まる場合）。①は不等号 $<$、②は $\le$ になる点にも注意します。図は、$\theta=30\degree$、$\mu'=0.20$、$\ell=0.50\,\mathrm{m}$ の場合に、$v^{2}$ を位置 $s$（O から斜面に沿って下向きに測った距離）に対して描いたものです。下りは AB 間で傾きがゆるやか（摩擦で加速が弱まる）、上りは急（重力成分と摩擦が重なって減速が強い）になっています。`,
          fig: figInclineV2(),
          easy: R`止まるかどうかは、「持っている運動エネルギーが、摩擦でぜんぶ使い切られるか」で決まります。図の縦軸 $v^{2}$ は運動エネルギーに比例する量で、$0$ になった位置が止まる位置です。下りでは、あらい AB 間でも $v^{2}$ はまだ増えています（B で $v_{\mathrm{B}}^{2}>0$）。上りでは、同じ長さの AB 間で $v^{2}$ がより急に減るので、$A$ に着くまでに $0$ になれば AB 間で止まります。`,
          pro: R`この種の「通過条件」「停止条件」は、不等式を 2 本立てて、最後に斜面角と摩擦係数の関係（$\tan\theta$ と $\mu'$ の比）にまとめます。係数（ここでは $\dfrac{2}{3}$ と $4$）は、O–A–B の長さの比で決まります。`,
          lv: 1
        },
        {
          t: '(6) 数値を代入する',
          m: [
            R`v_{\mathrm{B}}^{2} = 2\times 9.8\times 0.50\times(3\times 0.50 - 2\times 0.20\times 0.866) \approx 11.3`,
            R`x = \dfrac{11.3}{2\times 9.8\times(0.50 + 0.20\times 0.866)} \approx 0.857\,\mathrm{m}`
          ],
          n: R`$\tan 30\degree\approx 0.577$ は、$\dfrac{2}{3}\mu'=0.13$ より大きく、$4\mu'=0.80$ 以下なので (5) の条件を満たしています。$x\approx 0.857\,\mathrm{m}$ は AB の長さ $1.0\,\mathrm{m}$ より短く、条件と矛盾しません。`,
          lv: 2
        }
      ],
      prereq: ['p-eom', 'p-kin'],
      tags: ['記述→選択式', '斜面', '動摩擦力', '運動方程式', '力学的エネルギー', '条件の導出']
    },

    /* ================= 第3問（原子・波動）================= */

    /* ---------- 第3問 I ボーアの水素様原子モデル ---------- */
    {
      id: 'sk-p-2024-3-1',
      subject: 'physics',
      level: 'mid',
      unit: 'p-atom',
      title: 'ヘリウムイオンのボーア模型',
      source: src('第3問 I'),
      time: 10,
      body: R`電気量 $+2e$ のヘリウムの原子核のまわりを、電子 1 個（質量 $m$、電気量 $-e$）が回っているヘリウムイオン He⁺ を、次の簡単なモデルで考える。電子は、核から受ける静電気力だけを向心力として、半径 $r$ の円軌道上を速さ $v$ で等速円運動する。使う定数は、クーロンの法則の比例定数 $k_{0}$ とプランク定数 $h$ である。また、ボーアの考えにしたがい、電子の物質波が円軌道に沿ってちょうど整数個の波をつくる（定常波になる）軌道だけが実現するものとする。`,
      fig: figBohr(),
      parts: [
        {
          label: '(1)',
          q: R`静電気力が向心力になることから、軌道半径 $r$ を $m$, $v$, $k_{0}$, $e$ で表した式として、正しいものを選べ。`,
          type: 'choice',
          choices: [R`$\dfrac{k_{0}e^{2}}{2mv^{2}}$`, R`$\dfrac{4k_{0}e^{2}}{mv^{2}}$`, R`$\dfrac{2k_{0}e^{2}}{mv}$`, R`$\dfrac{2k_{0}e^{2}}{mv^{2}}$`, R`$\dfrac{k_{0}e^{2}}{mv^{2}}$`, R`$\dfrac{mv^{2}}{2k_{0}e^{2}}$`],
          answer: 3,
          explain: R`向心力は原子核から受ける静電気力 $k_{0}\dfrac{2e\cdot e}{r^{2}}$ です。円運動の運動方程式 $m\dfrac{v^{2}}{r}=k_{0}\dfrac{2e^{2}}{r^{2}}$ より、$r=\dfrac{2k_{0}e^{2}}{mv^{2}}$ です。水素原子（核の電気量 $+e$）なら $\dfrac{k_{0}e^{2}}{mv^{2}}$ ですが、ヘリウムの原子核の電気量は $2e$ なので、静電気力は 2 倍になります。次元の確認：$k_{0}e^{2}$ は「エネルギー × 長さ」、$mv^{2}$ は「エネルギー」なので、比は長さの次元です（$\dfrac{2k_{0}e^{2}}{mv}$ は長さになりません）。`
        },
        {
          label: '(2)',
          q: R`電子の物質波が円軌道に沿って定常波をつくるのは、円周の長さが波長 $\lambda$ の整数倍、すなわち $2\pi r=n\lambda$（$n=1,\,2,\,3,\,\cdots$）となるときである。電子の物質波の波長 $\lambda$ を $m$, $v$, $h$ で表して、この条件を $m$, $v$, $r$, $h$, $n$ だけの関係式に直したものとして、正しいものを選べ。`,
          type: 'choice',
          choices: [R`$mvr=nh$`, R`$mvr=n\dfrac{h}{2\pi}$`, R`$mvr=n\dfrac{h}{2}$`, R`$mvr=n\dfrac{h}{\pi}$`, R`$mv^{2}r=n\dfrac{h}{2\pi}$`, R`$\dfrac{mr}{v}=n\dfrac{h}{2\pi}$`],
          answer: 1,
          explain: R`電子の物質波の波長は、ド・ブロイの関係により、運動量 $mv$ を使って $\lambda=\dfrac{h}{mv}$ と表されます。これを $2\pi r=n\lambda$ に代入すると $2\pi r=n\dfrac{h}{mv}$ となり、整理して $mvr=n\dfrac{h}{2\pi}$（角運動量の量子化）です。円周ではなく半径や直径、半周を使うと $mvr=nh$, $n\dfrac{h}{2}$, $n\dfrac{h}{\pi}$ という誤りに、$\lambda=\dfrac{h}{mv^{2}}$ や $\lambda=\dfrac{hv}{m}$ と覚え違えると残りの 2 つになります。`
        },
        {
          label: '(3)',
          q: R`(1) の結果を使うと、軌道上の電子の全エネルギー $E$（運動エネルギーと静電気力による位置エネルギーの和。位置エネルギーの基準は無限遠）を、$k_{0}$, $e$, $r$ だけで表せる。正しいものを選べ。`,
          type: 'choice',
          choices: [R`$E=-\dfrac{k_{0}e^{2}}{2r}$`, R`$E=\dfrac{k_{0}e^{2}}{r}$`, R`$E=-\dfrac{2k_{0}e^{2}}{r}$`, R`$E=-\dfrac{2k_{0}e^{2}}{r^{2}}$`, R`$E=-\dfrac{k_{0}e^{2}}{r}$`, R`$E=\dfrac{2k_{0}e^{2}}{r}$`],
          answer: 4,
          explain: R`(1) の式から $mv^{2}=\dfrac{2k_{0}e^{2}}{r}$ なので、運動エネルギーは $\dfrac{1}{2}mv^{2}=\dfrac{k_{0}e^{2}}{r}$ です。静電気力による位置エネルギー（無限遠が基準）は、電気量 $2e$ の核と電子のあいだで $-\dfrac{k_{0}\cdot 2e\cdot e}{r}=-\dfrac{2k_{0}e^{2}}{r}$。和は $E=-\dfrac{k_{0}e^{2}}{r}$ で、負の値です。負のエネルギーは、電子が原子核に束縛されていることを表します（$E\ge 0$ なら無限遠へ飛び去れます）。水素原子（核の電気量 $e$）の結果 $-\dfrac{k_{0}e^{2}}{2r}$ をそのまま使うのは、よくある誤りです。$-\dfrac{2k_{0}e^{2}}{r^{2}}$ は、エネルギーではなく力の式の形で、次元が合いません。`
        },
        {
          label: '(4)',
          q: R`量子数 $n$ の軌道について、半径 $r_{n}$、速さ $v_{n}$、全エネルギー $E_{n}$ を、$n=1$ のときの値 $r_{1}$, $v_{1}$, $E_{1}$ を使って表した組合せとして、正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$r_{n}=nr_{1}$、$v_{n}=nv_{1}$、$E_{n}=n^{2}E_{1}$`,
            R`$r_{n}=n^{2}r_{1}$、$v_{n}=\dfrac{v_{1}}{n}$、$E_{n}=\dfrac{E_{1}}{n^{2}}$`,
            R`$r_{n}=n^{2}r_{1}$、$v_{n}=nv_{1}$、$E_{n}=n^{2}E_{1}$`,
            R`$r_{n}=nr_{1}$、$v_{n}=\dfrac{v_{1}}{n}$、$E_{n}=\dfrac{E_{1}}{n}$`,
            R`$r_{n}=n^{2}r_{1}$、$v_{n}=\dfrac{v_{1}}{n}$、$E_{n}=\dfrac{E_{1}}{n}$`,
            R`$r_{n}=\dfrac{r_{1}}{n^{2}}$、$v_{n}=nv_{1}$、$E_{n}=n^{2}E_{1}$`
          ],
          answer: 1,
          explain: R`(1) と (2) から $v$ を消去すると $r_{n}=\dfrac{n^{2}h^{2}}{8\pi^{2}mk_{0}e^{2}}=n^{2}r_{1}$ となり、軌道半径は $n^{2}$ に比例します。速さは $v_{n}=\dfrac{nh}{2\pi mr_{n}}=\dfrac{v_{1}}{n}$（遠い軌道ほど遅い）、全エネルギーは $E_{n}=-\dfrac{k_{0}e^{2}}{r_{n}}=\dfrac{E_{1}}{n^{2}}$ です。$E_{1}<0$ なので、$n$ が大きいほど $E_{n}$ は $0$ に近づきます。`
        },
        {
          label: '(5)',
          q: R`He⁺ の基底状態（$n=1$）のエネルギーは $E_{1}=-54.4\,\mathrm{eV}$ である。電子が $n=2$ の軌道から $n=1$ の軌道に移るとき、放出される光の波長は何 $\mathrm{nm}$ か。プランク定数を $h=6.6\times 10^{-34}\,\mathrm{J\cdot s}$、光の速さを $c=3.0\times 10^{8}\,\mathrm{m/s}$、$1\,\mathrm{eV}=1.6\times 10^{-19}\,\mathrm{J}$ とする。`,
          type: 'num',
          answer: 30.3,
          rel: 0.02,
          unit: 'nm',
          explain: R`(4) より $E_{2}=\dfrac{E_{1}}{4}=-13.6\,\mathrm{eV}$。放出される光子のエネルギーは $E_{2}-E_{1}=40.8\,\mathrm{eV}=40.8\times 1.6\times 10^{-19}\approx 6.53\times 10^{-18}\,\mathrm{J}$。波長は $\lambda=\dfrac{hc}{E_{2}-E_{1}}=\dfrac{6.6\times 10^{-34}\times 3.0\times 10^{8}}{6.53\times 10^{-18}}\approx 3.03\times 10^{-8}\,\mathrm{m}=30.3\,\mathrm{nm}$ です。`
        }
      ],
      solution: [
        {
          t: '(1) 円運動の運動方程式',
          m: [
            R`m\dfrac{v^{2}}{r} = k_{0}\dfrac{(2e)\,e}{r^{2}}`,
            R`r = \dfrac{2k_{0}e^{2}}{mv^{2}}`
          ],
          n: R`向心力は、電子と原子核の間にはたらく静電気力（クーロン力）です。電気量の大きさ $q_{1}$, $q_{2}$ の 2 つの電荷が距離 $r$ だけ離れているとき、力の大きさは $k_{0}\dfrac{q_{1}q_{2}}{r^{2}}$。原子核の電気量が $2e$、電子の電気量の大きさが $e$ なので $k_{0}\dfrac{2e^{2}}{r^{2}}$ です。向心加速度 $\dfrac{v^{2}}{r}$ を使って運動方程式を立て、$r$ について解きます。`,
          easy: R`円運動している物体には、円の中心へ向かう力（向心力）がはたらいています。ここでは、原子核が電子を引きつける電気の力がその役目をしています。電気の力の大きさは、クーロンの法則「電気量どうしの積 ÷ 距離の 2 乗」に比例します。ヘリウムの原子核は電気量が水素の 2 倍なので、引く力も 2 倍になります。`,
          pro: R`水素原子（核の電気量 $e$）の結果 $r=\dfrac{k_{0}e^{2}}{mv^{2}}$ の $e^{2}$ を $2e^{2}$ に置き換えるだけです。核の電気量が $Ze$ なら $r=\dfrac{Zk_{0}e^{2}}{mv^{2}}$ になります。`,
          lv: 1
        },
        {
          t: '(2) 量子条件（物質波が円周上で定常波になる）',
          m: [
            R`\lambda = \dfrac{h}{mv}`,
            R`2\pi r = n\lambda = n\,\dfrac{h}{mv}`,
            R`\Longleftrightarrow\quad mvr = n\,\dfrac{h}{2\pi}\qquad(n = 1,\ 2,\ 3,\ \cdots)`
          ],
          n: R`電子は粒子であると同時に波（物質波）としての性質ももち、その波長はド・ブロイの関係 $\lambda=\dfrac{h}{mv}$ で表されます。円軌道に沿って 1 周した波がちょうど元の波とつながる（円周が波長の整数倍になる）ときだけ、波は消えずに定常波として存在できます。これが「とびとびの軌道（定常状態）しか許されない」理由で、ボーアの量子条件です。右辺の $\dfrac{h}{2\pi}$ は、角運動量 $mvr$ の最小単位にあたります。`,
          fig: figOrbitWave(),
          easy: R`縄跳びの縄を揺らして波をつくるとき、波が途中でずれずに「止まって見える」のは、縄の長さにちょうど合った波長のときだけです。電子の波も同じで、円周にちょうど整数個の波が入る場合だけ、安定した波になります。図は $n=3$ の例で、円周が波長 $\lambda$ の 3 倍になっています。`,
          lv: 1
        },
        {
          t: '(3)(4) エネルギーと $n$ への依存',
          m: [
            R`E_{n} = \dfrac{1}{2}mv^{2} - k_{0}\dfrac{2e^{2}}{r} = \dfrac{k_{0}e^{2}}{r} - \dfrac{2k_{0}e^{2}}{r} = -\dfrac{k_{0}e^{2}}{r}`,
            R`r_{n} = \dfrac{n^{2}h^{2}}{8\pi^{2}mk_{0}e^{2}} = n^{2}r_{1}`,
            R`v_{n} = \dfrac{nh}{2\pi m r_{n}} = \dfrac{v_{1}}{n}`,
            R`E_{n} = -\dfrac{k_{0}e^{2}}{r_{n}} = \dfrac{E_{1}}{n^{2}}`
          ],
          n: R`(1) の式から $mv^{2}=\dfrac{2k_{0}e^{2}}{r}$ なので、運動エネルギーは $\dfrac{k_{0}e^{2}}{r}$ です。静電気力による位置エネルギー（無限遠が基準）は $-\dfrac{2k_{0}e^{2}}{r}$。全エネルギーは負で、$-\dfrac{k_{0}e^{2}}{r}$ になります。次に、(1) と (2) を連立して $v$ を消去すると、$r$ が $n^{2}$ に比例することが分かります。速さは $v=\dfrac{nh}{2\pi mr}\propto\dfrac{n}{n^{2}}$ で $\dfrac{1}{n}$ 倍、全エネルギーは $E_{n}\propto\dfrac{1}{r_{n}}$ で $\dfrac{1}{n^{2}}$ 倍です。`,
          easy: R`$n$ が大きいほど、電子は原子核から遠い軌道を、ゆっくり回ります。軌道半径は $1,\,4,\,9,\cdots$ と $n^{2}$ に比例して広がります。全エネルギーは「$0$ より低い負の値」で、$n$ が大きくなるほど $0$ に近づきます（$n\to\infty$ で電子が原子核から離れて自由になります）。`,
          lv: 1
        },
        {
          t: '(5) 放出される光の波長',
          m: [
            R`E_{2} = \dfrac{E_{1}}{2^{2}} = \dfrac{-54.4}{4} = -13.6\,\mathrm{eV}`,
            R`h\nu = E_{2} - E_{1} = 40.8\,\mathrm{eV} = 40.8\times 1.6\times 10^{-19} \approx 6.53\times 10^{-18}\,\mathrm{J}`,
            R`\lambda = \dfrac{c}{\nu} = \dfrac{hc}{E_{2}-E_{1}} = \dfrac{6.6\times 10^{-34}\times 3.0\times 10^{8}}{6.53\times 10^{-18}} \approx 3.03\times 10^{-8}\,\mathrm{m} = 30.3\,\mathrm{nm}`
          ],
          n: R`電子が高いエネルギー準位から低い準位に移るとき、そのエネルギー差が光子 1 個のエネルギー $h\nu$ として放出されます（ボーアの振動数条件）。波長は $\lambda=\dfrac{c}{\nu}$ から求めます。$\mathrm{eV}$ で与えられたエネルギーは、$1\,\mathrm{eV}=1.6\times 10^{-19}\,\mathrm{J}$ で $\mathrm{J}$ に直してから $h$, $c$ と組み合わせます。`,
          fig: figHeLevels(),
          easy: R`原子の中の電子は、決まった「段」（エネルギー準位）の上にしか乗れません。電子が高い段から低い段へ飛び降りると、その段差ぶんのエネルギーが光になって出ていきます。段差が大きいほど、エネルギーの高い（波長の短い）光が出ます。ここでは段差が $40.8\,\mathrm{eV}$ と大きく、波長 $30\,\mathrm{nm}$ ほどの紫外線になります。`,
          pro: R`光子のエネルギーを電子ボルトで表すときは $\lambda\,[\mathrm{nm}]\approx\dfrac{1240}{E\,[\mathrm{eV}]}$ が使えます。$\dfrac{1240}{40.8}\approx 30.4\,\mathrm{nm}$ と検算できます。`,
          lv: 1
        }
      ],
      tags: ['文章I', '選択式', 'ボーアの模型', '水素様イオン', '量子条件', '物質波', 'エネルギー準位']
    },

    /* ---------- 第3問 II 気柱の共鳴 ---------- */
    {
      id: 'sk-p-2024-3-2',
      subject: 'physics',
      level: 'mid',
      unit: 'p-wave',
      title: '気柱の共鳴と音速',
      source: src('第3問 II'),
      time: 10,
      body: R`鉛直に立てた細長いガラス管に水を入れ、管口のすぐ上にスピーカーを置く。スピーカーには発振器がつながれていて、一定の振動数の音を出し続けられる。水を少しずつ抜いて水面を下げ、管口から水面までの距離 $L$ を大きくしながら、気柱がどの位置で共鳴するかを調べる。管は十分に長い。実験中、音の速さは一定であり、管口の外側にできる定常波の腹と管口とのあいだの距離 $\Delta$（開口端補正）も、共鳴の次数によらず一定であるとする。`,
      fig: figResTube(),
      parts: [
        {
          label: '(1)',
          q: R`振動数 $850\,\mathrm{Hz}$ の音を出し続けて $L$ を $0$ から大きくしていくと、$L=29.0\,\mathrm{cm}$ で 2 回目の共鳴が、$L=49.0\,\mathrm{cm}$ で 3 回目の共鳴が起こった。空気中の音の速さは何 $\mathrm{m/s}$ か。`,
          type: 'num',
          answer: 340,
          rel: 0.02,
          unit: 'm/s',
          explain: R`隣り合う 2 つの共鳴位置の間隔は半波長 $\dfrac{\lambda}{2}$ です。$\dfrac{\lambda}{2}=49.0-29.0=20.0\,\mathrm{cm}$ より $\lambda=0.400\,\mathrm{m}$。音の速さは $V=f\lambda=850\times 0.400=340\,\mathrm{m/s}$ です。2 つの位置の差をとると、開口端補正 $\Delta$ が消えるので、$\Delta$ が分からなくても波長が求まります。`
        },
        {
          label: '(2)',
          q: R`開口端補正 $\Delta$ は何 $\mathrm{cm}$ か。`,
          type: 'num',
          answer: 1.0,
          rel: 0.03,
          unit: 'cm',
          explain: R`2 回目の共鳴では、気柱の実効的な長さ $L_{2}+\Delta$ が $\dfrac{3}{4}\lambda$ に等しくなります（腹から節までの距離が $\dfrac{3}{4}$ 波長）。$\dfrac{3}{4}\lambda=30.0\,\mathrm{cm}$、$L_{2}=29.0\,\mathrm{cm}$ より、$\Delta=30.0-29.0=1.0\,\mathrm{cm}$ です。なお、1 回目の共鳴は $L_{1}+\Delta=\dfrac{\lambda}{4}=10.0\,\mathrm{cm}$ から $L_{1}=9.0\,\mathrm{cm}$ の位置で起こっています。`
        },
        {
          label: '(3)',
          q: R`水面を $L=61.5\,\mathrm{cm}$ の位置に固定し、音の振動数を $850\,\mathrm{Hz}$ から少しずつ下げていくと、固定してから初めて共鳴が起こった。このときの音の波長は何 $\mathrm{m}$ か。`,
          type: 'num',
          answer: 0.500,
          rel: 0.02,
          unit: 'm',
          explain: R`実効的な気柱の長さは $L+\Delta=62.5\,\mathrm{cm}$ です。共鳴するのは $L+\Delta=\dfrac{2k-1}{4}\lambda$ のときで、振動数にすると $f_{k}=\dfrac{(2k-1)V}{4(L+\Delta)}=136\,(2k-1)\,\mathrm{Hz}$（$136,\,408,\,680,\,952,\cdots$）です。$850\,\mathrm{Hz}$ から下げていくと、最初に共鳴するのは $680\,\mathrm{Hz}$。波長は $\lambda=\dfrac{340}{680}=0.500\,\mathrm{m}$ です。`
        },
        {
          label: '(4)',
          q: R`(3) で共鳴が起こったとき、気柱の実効的な長さ $L+\Delta$ は、音の波長 $\lambda$ の何倍か。`,
          type: 'choice',
          choices: [R`$\dfrac{1}{4}$ 倍`, R`$\dfrac{3}{4}$ 倍`, R`$\dfrac{5}{4}$ 倍`, R`$\dfrac{7}{4}$ 倍`, R`$\dfrac{3}{2}$ 倍`, R`$2$ 倍`],
          answer: 2,
          explain: R`$L+\Delta=0.625\,\mathrm{m}$、$\lambda=0.500\,\mathrm{m}$ なので、$\dfrac{L+\Delta}{\lambda}=\dfrac{5}{4}$ です。これは共鳴の条件 $L+\Delta=\dfrac{2k-1}{4}\lambda$ で $k=3$（3 番目の共鳴）にあたります。片端が閉じた気柱では、気柱の長さがいつも $\dfrac{1}{4}$ 波長の奇数倍になり、$\dfrac{3}{2}$ 倍や $2$ 倍（半波長の整数倍）の共鳴は起こりません。`
        }
      ],
      solution: [
        {
          t: '共鳴の条件（片端が閉じた気柱と開口端補正）',
          m: R`L_{k} + \Delta = \dfrac{2k-1}{4}\,\lambda\qquad(k = 1,\ 2,\ 3,\ \cdots)`,
          n: R`水面は固い壁と同じように振る舞い、空気が動けないので、定常波の**節**になります。管口側は開いているので、定常波の**腹**ができ、その位置は管口より $\Delta$ だけ外側（開口端補正）です。腹から節までの距離は $\dfrac{1}{4}$ 波長の奇数倍なので、実効的な気柱の長さ $L+\Delta$ について上の式が成り立ちます。図は、2 回目・3 回目の共鳴のようすです。`,
          fig: figResTubeSol(),
          easy: R`笛やペットボトルに息を吹きかけると、特定の高さの音がよく響きます。これは、空気の柱の長さに合った波長の音だけが「共鳴」して大きくなるからです。片端が閉じている管では、閉じた端（ここでは水面）で空気が動けないため節になり、開いた端では空気が自由に動くため腹になります。節と腹の間隔は $\dfrac{1}{4}$ 波長なので、気柱の長さが $\dfrac{1}{4}$ 波長、$\dfrac{3}{4}$ 波長、$\dfrac{5}{4}$ 波長、$\cdots$ のとき共鳴します。開口端では、腹が管口より少し外側にできるので、その分 $\Delta$ を長さに足します。`,
          lv: 1
        },
        {
          t: '(1) 隣り合う共鳴の間隔から音速を求める',
          m: [
            R`L_{3} - L_{2} = \dfrac{\lambda}{2}`,
            R`\lambda = 2\times(49.0 - 29.0) = 40.0\,\mathrm{cm} = 0.400\,\mathrm{m}`,
            R`V = f\lambda = 850\times 0.400 = 340\,\mathrm{m/s}`
          ],
          n: R`$L_{2}+\Delta=\dfrac{3\lambda}{4}$ と $L_{3}+\Delta=\dfrac{5\lambda}{4}$ の差をとると、$\Delta$ が消えて $L_{3}-L_{2}=\dfrac{\lambda}{2}$ となります。開口端補正が分からなくても、隣り合う 2 つの共鳴位置さえ分かれば波長が決まります。`,
          pro: R`「共鳴位置の間隔 = 半波長」は、閉管（片端閉じ）の実験の定石です。1 つの共鳴位置だけから $\lambda=4L$ のように求めると、開口端補正のぶんだけ誤差が出ます。`,
          lv: 1
        },
        {
          t: '(2) 開口端補正',
          m: R`L_{2} + \Delta = \dfrac{3\lambda}{4} \;\Rightarrow\; \Delta = 30.0 - 29.0 = 1.0\,\mathrm{cm}`,
          n: R`$\dfrac{3\lambda}{4}=\dfrac{3\times 40.0}{4}=30.0\,\mathrm{cm}$ です。2 回目の共鳴では、気柱の実効的な長さ $L_{2}+\Delta$ がちょうど $\dfrac{3}{4}$ 波長にあたります。管口から実際の水面までの $29.0\,\mathrm{cm}$ より、$1.0\,\mathrm{cm}$ だけ長い気柱として振る舞っていることになります。1 回目の共鳴なら $L_{1}+\Delta=\dfrac{\lambda}{4}=10.0\,\mathrm{cm}$ で、$L_{1}=9.0\,\mathrm{cm}$ です。`,
          lv: 1
        },
        {
          t: '(3)(4) 水面を固定して振動数を変える',
          m: [
            R`f_{k} = \dfrac{V}{\lambda_{k}} = \dfrac{(2k-1)\,V}{4\,(L+\Delta)} = (2k-1)\times\dfrac{340}{4\times 0.625} = 136\,(2k-1)\,\mathrm{Hz}`,
            R`f_{k} = 136,\ 408,\ 680,\ 952,\ \cdots\,\mathrm{Hz}`,
            R`\lambda = \dfrac{V}{f} = \dfrac{340}{680} = 0.500\,\mathrm{m},\qquad \dfrac{L+\Delta}{\lambda} = \dfrac{0.625}{0.500} = \dfrac{5}{4}`
          ],
          n: R`水面の位置を固定すると、共鳴できる音の振動数は $f_{k}=\dfrac{(2k-1)V}{4(L+\Delta)}$（基本の $136\,\mathrm{Hz}$ の奇数倍）にかぎられます。$850\,\mathrm{Hz}$ は $680\,\mathrm{Hz}$ と $952\,\mathrm{Hz}$ の間なので、そこから振動数を下げると、最初に $680\,\mathrm{Hz}$ で共鳴します。このとき $L+\Delta=\dfrac{5}{4}\lambda$（$k=3$）です。`,
          easy: R`水面を固定すると、気柱の長さが決まるので、共鳴できる音の高さ（振動数）が「とびとび」に決まります。ここでは $136\,\mathrm{Hz}$ の奇数倍だけです。$850\,\mathrm{Hz}$ から音を低くしていくと、$850$ のすぐ下にある共鳴の振動数 $680\,\mathrm{Hz}$ に達したところで共鳴が起こります。波長は $\lambda=\dfrac{V}{f}$ で求めます。`,
          lv: 1
        }
      ],
      tags: ['文章II', '数値', '気柱の共鳴', '閉管', '開口端補正', '音速']
    },

    /* ================= 第4問（電磁気）================= */
    {
      id: 'sk-p-2024-4',
      subject: 'physics',
      level: 'mid',
      unit: 'p-induction',
      title: '抵抗とコイルの直流回路',
      source: src('第4問'),
      time: 12,
      body: R`電池（起電力 $15\,\mathrm{V}$）、抵抗 R₁, R₂, R₃、コイル L、スイッチ S₁, S₂ を、図のようにつないだ回路を考える。S₁ は電池に直列に入っていて、そのすぐ先に R₃ がある。R₃ を出た電流は 2 本の枝に分かれ、一方の枝には R₁ だけが、もう一方の枝には切り替えスイッチ S₂ が入っている。S₂ を a 側に倒すとその枝に R₂ が、b 側に倒すとコイル L がつながる。抵抗値は $R_{1}=30\,\Omega$、$R_{2}=15\,\Omega$、$R_{3}=10\,\Omega$ で、電池の内部抵抗とコイルの抵抗は考えなくてよい。この回路は、S₁ を閉じ、S₂ を a 側に倒した状態で、十分に長い時間おかれていた（これを「はじめの状態」とよぶ）。`,
      fig: figCircuit(),
      parts: [
        {
          label: '(1)',
          q: R`はじめの状態で、抵抗 R₁ を流れる電流の大きさは何 $\mathrm{A}$ か。`,
          type: 'num',
          answer: 0.25,
          rel: 0.02,
          unit: 'A',
          explain: R`R₁ と R₂ は並列なので、合成抵抗は $\dfrac{30\times 15}{30+15}=10\,\Omega$。これに R₃ が直列なので全体の抵抗は $20\,\Omega$、電池から流れ出る電流は $\dfrac{15}{20}=0.75\,\mathrm{A}$ です。並列部分にかかる電圧は $10\times 0.75=7.5\,\mathrm{V}$ なので、R₁ を流れる電流は $\dfrac{7.5}{30}=0.25\,\mathrm{A}$ です。`
        },
        {
          label: '(2)',
          q: R`はじめの状態で、抵抗 R₃ を流れる電流の大きさは何 $\mathrm{A}$ か。`,
          type: 'num',
          answer: 0.75,
          rel: 0.02,
          unit: 'A',
          explain: R`R₃ は電池に直列につながっているので、電池から流れ出る電流がそのまま R₃ を流れます。(1) より $0.75\,\mathrm{A}$ です。R₁ と R₂ を流れる電流（$0.25\,\mathrm{A}$ と $0.50\,\mathrm{A}$）の和にも等しくなっています。`
        },
        {
          label: '(3)',
          q: R`はじめの状態が $40$ 秒間続くあいだに、R₁, R₂, R₃ で発生するジュール熱の合計は何 $\mathrm{J}$ か。`,
          type: 'num',
          answer: 450,
          rel: 0.02,
          unit: 'J',
          hint: R`1500 や 1.5e3 の形で入力できます。`,
          explain: R`3 つの抵抗で発生する熱の合計は、電池がした仕事（電力 × 時間）に等しいので、$15\times 0.75\times 40=450\,\mathrm{J}$ です。抵抗ごとに $RI^{2}t$ を足して確かめることもできます。R₁: $30\times 0.25^{2}\times 40=75\,\mathrm{J}$、R₂: $15\times 0.50^{2}\times 40=150\,\mathrm{J}$、R₃: $10\times 0.75^{2}\times 40=225\,\mathrm{J}$ で、合計は $450\,\mathrm{J}$ です。`
        },
        {
          label: '(4)',
          q: R`その後、時刻 $t=0$ に、S₁ は閉じたまま S₂ を b 側へ倒した。$t\ge 0$ でコイル L を流れる電流 $I$ のようすを表すグラフとして、最も適切なものを選べ。`,
          type: 'choice',
          choices: [
            { fig: figCoilOpt(false, 0.75) },
            { fig: figCoilOpt(true, 1.5) },
            { fig: figCoilOpt(true, 0.75) },
            { fig: figCoilOpt(false, 1.5) }
          ],
          answer: 1,
          explain: R`コイルには、電流の変化を妨げる向きに自己誘導起電力が生じるので、コイルの電流は $t=0$ では $0$ のままで、**急には変われません**（減少するグラフや、$t=0$ で電流が 0 でないグラフは不適）。十分に時間がたって電流が一定になると、自己誘導起電力が $0$ になり、コイル（抵抗なし）は導線と同じになります。すると R₁ は導線で短絡されて電流が流れず、電池には R₃ だけがつながっている回路になるので、コイルの電流は $\dfrac{15}{10}=1.5\,\mathrm{A}$ に近づきます。$0.75\,\mathrm{A}$ は S₂ を切り替える前に電池から流れていた電流です。`
        },
        {
          label: '(5)',
          q: R`S₂ を b 側にしたまま十分に時間が過ぎ、$I$ が一定になった。次に、S₂ はそのままにして S₁ を開いた。S₁ を開いた直後に、抵抗 R₁ を流れる電流の大きさは何 $\mathrm{A}$ か。`,
          type: 'num',
          answer: 1.5,
          rel: 0.02,
          unit: 'A',
          explain: R`S₁ を開くと、電池と R₃ のつながった枝には電流が流れなくなり、コイルと R₁ だけの閉じた回路になります。コイルの電流は急には変われないので、直後も $1.5\,\mathrm{A}$ のままで、この電流が R₁ を流れます（S₁ を開く前の R₁ には電流が流れていなかったことと比べてみましょう）。`
        },
        {
          label: '(6)',
          q: R`S₁ を開いた直後に、コイルに生じている自己誘導起電力の大きさは何 $\mathrm{V}$ か。`,
          type: 'num',
          answer: 45,
          rel: 0.02,
          unit: 'V',
          explain: R`この瞬間、コイルは電池の役目をして、R₁ に $1.5\,\mathrm{A}$ を流し続けます。コイルの両端の電圧は、R₁ の両端の電圧に等しく $30\times 1.5=45\,\mathrm{V}$ です。これが自己誘導による誘導起電力の大きさで、電池の起電力 $15\,\mathrm{V}$ の 3 倍にもなります。スイッチを開いた瞬間に火花が飛ぶことがあるのは、このような大きな誘導起電力が生じるためです。`
        }
      ],
      solution: [
        {
          t: '(1)(2) S₂ が a 側のとき（直流回路）',
          m: [
            R`R_{\mathrm{p}} = \dfrac{R_{1}R_{2}}{R_{1}+R_{2}} = \dfrac{30\times 15}{30+15} = 10\,\Omega`,
            R`I_{3} = \dfrac{E}{R_{3}+R_{\mathrm{p}}} = \dfrac{15}{10+10} = 0.75\,\mathrm{A}`,
            R`V_{\mathrm{p}} = R_{\mathrm{p}}I_{3} = 7.5\,\mathrm{V}\;\Rightarrow\; I_{1} = \dfrac{V_{\mathrm{p}}}{R_{1}} = \dfrac{7.5}{30} = 0.25\,\mathrm{A}`
          ],
          n: R`R₁ と R₂ には同じ電圧がかかる（並列）ので、まず合成抵抗 $R_{\mathrm{p}}$ を求めます。次に、R₃ と $R_{\mathrm{p}}$ が直列なので、電池から流れ出る電流 $I_{3}$（= R₃ を流れる電流）が出ます。並列部分の電圧 $V_{\mathrm{p}}$ から、R₁ を流れる電流が決まります。`,
          easy: R`電流の通り道が 1 本のときが「直列」、途中で 2 本に分かれて合流するのが「並列」です。並列の部分は、2 本の道の両端にかかる電圧が同じになります。分かれる前の電流（電池から出る電流）は、2 本の道を流れる電流の和です。ですから、(1) 並列部分を 1 つの抵抗にまとめる → (2) 直列の合計抵抗で全体の電流を出す → (3) 並列部分の電圧から、各枝の電流を出す、の順に進めます。`,
          pro: R`並列の合成抵抗は 2 つなら「積 ÷ 和」。電流は並列では抵抗の逆比に分かれます（R₁ : R₂ = 2 : 1 なので、電流は $1:2$ に分かれて $0.25\,\mathrm{A}$ と $0.50\,\mathrm{A}$）。`,
          lv: 1
        },
        {
          t: '(3) ジュール熱の合計',
          m: [
            R`Q = E\,I_{3}\,t = 15\times 0.75\times 40 = 450\,\mathrm{J}`,
            R`\left(\text{確認：}\ R_{1}I_{1}^{2}t + R_{2}I_{2}^{2}t + R_{3}I_{3}^{2}t = 75 + 150 + 225 = 450\,\mathrm{J}\right)`
          ],
          n: R`電池が $40$ 秒間にした仕事 $EIt$ は、すべて抵抗でジュール熱に変わります（エネルギー保存）。コイルは $\mathrm{S_{2}}$ が a 側のときは回路に入っていないので、考えなくてかまいません。`,
          easy: R`電池は、電流を流すことで「電気のエネルギー」を回路に送り出し、抵抗はそれを熱に変えています。電池が送り出した量は「電圧 × 電流 × 時間」です。これは、3 つの抵抗で出た熱の合計とぴったり同じになります。`,
          lv: 1
        },
        {
          t: '(4) S₂ を b に切り替えた後の、コイルの電流',
          m: [
            R`t = 0\ \text{の直後：}\quad I = 0`,
            R`t \to \infty\ \text{：}\quad \text{コイルの電圧} = 0\;\Rightarrow\; I = \dfrac{E}{R_{3}} = \dfrac{15}{10} = 1.5\,\mathrm{A}`
          ],
          n: R`コイルに流れる電流が変わろうとすると、その変化を妨げる向きに自己誘導起電力が生じます。そのため、$t=0$ の直後はコイルの電流は $0$ のままで、枝が切れているのと同じです（このとき電池からは $\dfrac{15}{10+30}\approx 0.38\,\mathrm{A}$ が R₃ と R₁ を流れます）。時間がたつと電流の変化が止まり、自己誘導起電力が $0$ になって、コイルは抵抗のない導線と同じになります。R₁ はこの導線で短絡されるので、回路は電池と R₃ だけとなり、コイルには $1.5\,\mathrm{A}$ が流れます。`,
          fig: figCoilStates(),
          easy: R`コイルは「電流が変わるのをいやがる」部品です。スイッチを入れた直後は、電流を流そうとしても、コイルがそれを妨げるので、電流は $0$ から少しずつしか増えません。しかし、いったん電流が落ち着くと、コイルは何も妨げなくなり、ただの導線になります。導線は電気抵抗がないので、同じ 2 点に並列につないだ R₁ には電流が流れず（導線のほうへ流れてしまうため）、電池から出た電流は、R₃ を通ってすべてコイルへ流れます。`,
          pro: R`コイルの回路問題は「スイッチを入れた直後 ＝ コイルは断線（電流 0 のまま）」「十分時間後 ＝ コイルは導線（電圧 0）」の 2 つの極端な状態を押さえれば、グラフの始点と終点が決まります。コンデンサーの場合は逆（直後は導線、十分後は断線）です。`,
          lv: 1
        },
        {
          t: '(5)(6) S₁ を開いた直後',
          m: [
            R`I_{\mathrm{L}} = 1.5\,\mathrm{A}\quad(\text{直後も変わらない})`,
            R`V = R_{1}\,I_{\mathrm{L}} = 30\times 1.5 = 45\,\mathrm{V}`
          ],
          n: R`S₁ を開くと、電池と R₃ の枝には電流が流れなくなり、回路はコイル L と R₁ だけの閉じた回路になります。コイルの電流は急には変わらないので、直後も $1.5\,\mathrm{A}$ が流れ続け、その電流が R₁ を通ります（R₁ には、S₁ を開く前は電流がありませんでしたが、直後は $1.5\,\mathrm{A}$ が流れます）。このとき、コイルが電池の役目をして電流を流しているので、コイルに生じる誘導起電力は、R₁ にかかる電圧 $30\times 1.5=45\,\mathrm{V}$ に等しくなります。`,
          fig: figCoilLoop(),
          easy: R`スイッチを開くと、電池はつながりが切れて電流を送れなくなります。ところが、コイルは「今まで流れていた電流を流し続けよう」とするので、コイルが今度は電池のかわりになって、$1.5\,\mathrm{A}$ を送り出します。この電流が通れる道は R₁ だけです。$30\,\Omega$ の抵抗に $1.5\,\mathrm{A}$ を流すには $30\times 1.5=45\,\mathrm{V}$ の電圧が必要で、その電圧をコイルがつくります。電池の $15\,\mathrm{V}$ より大きくなる点が、この問題のポイントです。`,
          pro: R`「電流を流し続けようとする」コイルの性質から、S₁ を開く直前の電流 $I_{\mathrm{L}}$ がそのまま回路に流れ、起電力は（その電流が通る抵抗の合計）×（電流）になります。ここでは通る抵抗が R₁ だけなので $R_{1}I_{\mathrm{L}}$ です。R₃ が同じループに入る回路なら、$(R_{1}+R_{3})I_{\mathrm{L}}$ になります。`,
          lv: 1
        }
      ],
      prereq: ['p-circuit', 'p-mag'],
      tags: ['直流回路', '合成抵抗', 'ジュール熱', 'コイル', '自己誘導', 'グラフ選択']
    }
  ]);
})();
