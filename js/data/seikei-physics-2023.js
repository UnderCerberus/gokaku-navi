/* GOKAKU NAVI — 成蹊大学 理工学部 物理 2023 年度 準拠の類題
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
    return { univ: '成蹊大学', faculty: '理工学部', year: 2023, no: no, kind: '類題' };
  };
  // 矢印 + 手動配置のラベル（ラベルが矢印に重ならないよう位置を明示する）
  function arr(d, x1, y1, x2, y2, label, cls, lx, ly, anchor) {
    d.arrow(x1, y1, x2, y2, { cls: cls });
    if (label) d.text(lx, ly, label, { cls: cls, anchor: anchor || 'start' });
  }

  /* ================================================================
   *  図（SVG 文字列）
   * ================================================================ */

  // 1-1: レール上の台車（時刻 2.0 s のようす）
  function figCart() {
    const d = D(360, 140);
    d.hatch(14, 90, 346, 90);
    d.rect(146, 58, 72, 26, { cls: 'fg', fill: 'f1', rx: 3 });
    d.circle(164, 86, 4.5, { cls: 'fg', fill: 'f0' });
    d.circle(200, 86, 4.5, { cls: 'fg', fill: 'f0' });
    d.text(182, 76, '台車');
    arr(d, 218, 68, 282, 68, '', 'c1');
    d.text(252, 50, 'v = +3.0 m/s', { cls: 'c1' });
    arr(d, 146, 68, 82, 68, '', 'c3');
    d.text(110, 50, 'a = −1.5 m/s²', { cls: 'c3' });
    d.arrow(24, 116, 330, 116, { cls: 'dim', w: 1.2 });
    d.text(338, 120, 'x', { italic: true, anchor: 'start' });
    d.text(180, 134, '時刻 t = 2.0 s のようす（右向きが x 軸の正の向き）', { cls: 'dim', size: 11 });
    return d.svg();
  }
  // 1-1 解説: 台車の v-t グラフ（面積 = 進んだ距離・戻った距離）
  function figCartVT() {
    const v = function (t) { return 3.0 - 1.5 * (t - 2.0); };
    return G({
      w: 340, h: 230, x: [0, 7.5], y: [-4, 4.5], axis: ['t [s]', 'v [m/s]'],
      curves: [{ f: v, cls: 'c1', domain: [2, 6] }],
      fills: [
        { f: v, from: 2, to: 4, cls: 'f1' },
        { f: v, from: 4, to: 6, cls: 'f3' }
      ],
      vlines: [{ x: 2, dash: true }, { x: 4, dash: true }, { x: 6, dash: true }],
      points: [
        { x: 2, y: 3, label: 't = 2.0 s, v = +3.0', pos: 'tr', cls: 'c3' },
        { x: 6, y: -3, label: 'v = −3.0', pos: 'br', cls: 'c4' }
      ],
      labels: [
        { x: 2.15, y: 0.5, text: '3.0 m', cls: 'c1' },
        { x: 4.85, y: -0.55, text: '3.0 m', cls: 'c3' }
      ]
    });
  }

  // 1-2: 傾き 30° のなめらかな斜面。上端の壁にばね A（k）、その先にばね B（2k）、先端に物体 m（x は自然の長さのときの位置からの距離）
  function figSpringIncline(withForce) {
    const d = D(360, 270);
    const c = Math.cos(PI / 6), sn = Math.sin(PI / 6);
    const ux = c, uy = sn;           // 斜面に沿って下る向き（画面座標: y は下向き）
    const nx = sn, ny = -c;          // 斜面に垂直で、斜面の外へ向かう向き
    const x0 = 34, y0 = 94, len = 300;
    const P = function (s, h) { return [x0 + s * ux + h * nx, y0 + s * uy + h * ny]; };
    const p1 = P(len, 0), base = y0 + len * uy;
    d.poly([[x0, y0], [p1[0], p1[1]], [x0, base]], { cls: 'fg', fill: 'f0', w: 1.2 });
    d.hatch(x0, y0, p1[0], p1[1], { side: 1 });
    const w1 = P(0, 72);
    d.hatch(x0, y0, w1[0], w1[1], { side: -1 });
    d.angle(p1[0], p1[1], 38, 150, 180, '30°', { cls: 'c3' });
    // ばね A, B（密に巻いた方が硬い）と物体。自然の長さ 56, 50、伸び 30, 15（px。伸びの比 = 2 : 1）
    const hs = 30, sj = 86, sb = 151;
    const a0 = P(0, hs), a1 = P(sj, hs), b1 = P(sb, hs);
    d.spring(a0[0], a0[1], a1[0], a1[1], { n: 6, amp: 8 });
    d.dot(a1[0], a1[1], { r: 3 });
    d.spring(a1[0], a1[1], b1[0], b1[1], { n: 8, amp: 5 });
    const blk = [P(sb, 0), P(sb + 50, 0), P(sb + 50, 40), P(sb, 40)];
    d.poly(blk, { cls: 'fg', fill: 'f1', w: 1.6 });
    const cm = P(sb + 12, 30);
    d.text(cm[0], cm[1] + 4, 'm', { italic: true });
    const la = P(40, 56), lb = P(128, 80);
    d.text(la[0] - 6, la[1], 'ばね A（k）', { anchor: 'start' });
    d.text(lb[0], lb[1], 'ばね B（2k）', { anchor: 'start' });
    // 自然の長さのときの物体の位置（s = 106）と、そこからの距離 x
    const r0 = P(106, 0), r1 = P(106, 56), q0 = P(106, 48), q1 = P(sb, 48), e1 = P(sb, 40), e2 = P(sb, 56);
    d.line(r0[0], r0[1], r1[0], r1[1], { cls: 'dim', dash: true, w: 1 });
    d.line(e1[0], e1[1], e2[0], e2[1], { cls: 'dim', dash: true, w: 1 });
    d.arrow(q0[0], q0[1], q1[0], q1[1], { cls: 'c3', w: 1.6 });
    const lx = P(128, 62);
    d.text(lx[0], lx[1] + 4, 'x', { italic: true, cls: 'c3' });
    if (withForce) {
      // 重力 mg とその分解（斜面に平行な mg sin30° と、垂直な mg cos30°。矢印の長さは大きさに比例）
      const C = P(sb + 25, 20), L = 56;
      const tg = [C[0], C[1] + L];
      const ts = [C[0] + 0.5 * L * ux, C[1] + 0.5 * L * uy];
      const tc = [C[0] - c * L * nx, C[1] - c * L * ny];
      d.line(ts[0], ts[1], tg[0], tg[1], { cls: 'dim', dash: true, w: 1 });
      d.line(tc[0], tc[1], tg[0], tg[1], { cls: 'dim', dash: true, w: 1 });
      arr(d, C[0], C[1], tg[0], tg[1], '', 'c3');
      arr(d, C[0], C[1], ts[0], ts[1], '', 'c2');
      arr(d, C[0], C[1], tc[0], tc[1], '', 'c4');
      d.text(tg[0] - 6, tg[1] + 4, 'mg', { cls: 'c3', italic: true, anchor: 'end' });
      d.text(ts[0] + 8, ts[1] + 4, 'mg sin30°', { cls: 'c2', size: 11, anchor: 'start' });
      d.text(tc[0] - 6, tc[1] + 4, 'mg cos30°', { cls: 'c4', size: 11, anchor: 'end' });
    }
    return d.svg();
  }
  // 導線の断面（⊙: 紙面の裏から表へ / ⊗: 表から裏へ）
  function wireMark(d, x, y, kind) {
    d.circle(x, y, 11, { cls: 'fg', fill: 'f0' });
    if (kind === 'out') d.dot(x, y, { cls: 'fg', r: 3.2 });
    else {
      d.line(x - 7, y - 7, x + 7, y + 7, { cls: 'fg', w: 1.8 });
      d.line(x - 7, y + 7, x + 7, y - 7, { cls: 'fg', w: 1.8 });
    }
  }

  // 1-3: 一辺 a の正方形 ABCD。頂点 A, C の導線は手前向き（⊙）、B は奥向き（⊗）、頂点 D は空き
  function figSquareWires(withField) {
    const d = D(360, withField ? 258 : 212);
    const s = 116, xa = 104, ya = 34;
    const xb = xa + s, yc = ya + s, xd = xa;
    d.poly([[xa, ya], [xb, ya], [xb, yc], [xd, yc]], { cls: 'dim', w: 1, dash: true });
    d.line(xb, ya, xd, yc, { cls: 'dim', w: 1, dash: true });
    d.text(xa - 14, (ya + yc) / 2 + 4, 'a', { italic: true, anchor: 'end' });
    d.text(xb + 14, (ya + yc) / 2 + 4, 'a', { italic: true, anchor: 'start' });
    if (withField) {
      const L = 56, h = L / 2;
      // 点 D での各磁場（矢印の長さ = 強さに比例）: H(A) 右向き, H(C) 下向き, H(B) 左上向き（強さは 1/√2 倍）
      d.line(xd + L, yc, xd + L, yc + L, { cls: 'dim', dash: true, w: 1 });
      d.line(xd, yc + L, xd + L, yc + L, { cls: 'dim', dash: true, w: 1 });
      d.arrow(xd, yc, xd + L, yc + L, { cls: 'dim', dash: true, w: 1.2 });
      d.arrow(xd, yc, xd + L, yc, { cls: 'c1', w: 2.2 });
      d.arrow(xd, yc, xd, yc + L, { cls: 'c3', w: 2.2 });
      d.arrow(xd, yc, xd - h, yc - h, { cls: 'c4', w: 2.2 });
      d.arrow(xd, yc, xd + h, yc + h, { cls: 'c2', w: 3 });
      d.text(xd + L / 2, yc - 8, 'H(A)', { cls: 'c1' });
      d.text(xd - 8, yc + L / 2 + 4, 'H(C)', { cls: 'c3', anchor: 'end' });
      d.text(xd - h - 6, yc - h - 6, 'H(B)', { cls: 'c4', anchor: 'end' });
      d.text(xd + h + 8, yc + h + 14, 'H', { cls: 'c2', anchor: 'start', bold: true });
    }
    wireMark(d, xa, ya, 'out');
    wireMark(d, xb, ya, 'in');
    wireMark(d, xb, yc, 'out');
    d.dot(xd, yc, { cls: 'c3', r: 3.8 });
    d.text(xa - 16, ya - 12, 'A', { italic: true, anchor: 'end' });
    d.text(xb + 16, ya - 12, 'B', { italic: true, anchor: 'start' });
    d.text(xb + 16, yc + 18, 'C', { italic: true, anchor: 'start' });
    d.text(xd - 12, yc + 16, 'D', { italic: true, anchor: 'end' });
    const yl = withField ? 236 : 190;
    d.text(180, yl, '⊙: 手前向きの電流（紙面の裏から表へ）', { anchor: 'middle', size: 11, cls: 'dim' });
    d.text(180, yl + 15, '⊗: 奥向きの電流（紙面の表から裏へ）', { anchor: 'middle', size: 11, cls: 'dim' });
    return d.svg();
  }

  // 1-4: 光電子の運動エネルギーの最大値 K₀ と振動数 ν（金属 X: K₀ = 0.66(ν − 6.0) ［10⁻¹⁹ J, 10¹⁴ Hz］）
  const photoK = function (nu) { return 0.66 * (nu - 6.0); };
  function figPhoto() {
    return G({
      w: 340, h: 250, x: [0, 14], y: [0, 4.4], axis: ['ν', 'K₀'],
      curves: [{ f: photoK, cls: 'c1', domain: [6, 14] }],
      segs: [
        { x1: 0, y1: 2.64, x2: 10, y2: 2.64, cls: 'dim', dash: true },
        { x1: 10, y1: 0, x2: 10, y2: 2.64, cls: 'dim', dash: true }
      ],
      points: [{ x: 10, y: 2.64, cls: 'c3' }],
      labels: [
        { x: 0.25, y: 2.8, text: '2.64', cls: 'fg' },
        { x: 11.2, y: 3.6, text: '金属 X', cls: 'c1' },
        { x: 0.5, y: 4.05, text: '縦軸 K₀ の単位: 10⁻¹⁹ J', cls: 'dim' },
        { x: 0.5, y: 3.65, text: '横軸 ν の単位: 10¹⁴ Hz', cls: 'dim' }
      ]
    });
  }
  // 1-4 解説: 直線を ν = 0 まで延長（傾き = h、横軸との交点 = ν₀、縦軸との交点 = −W）
  function figPhotoSol() {
    return G({
      w: 340, h: 270, x: [0, 14], y: [-4.8, 4.4], axis: ['ν', 'K₀'],
      curves: [
        { f: photoK, cls: 'c1', domain: [6, 14] },
        { f: photoK, cls: 'c1', dash: true, domain: [0, 6] }
      ],
      points: [
        { x: 6, y: 0, cls: 'c3' },
        { x: 10, y: 2.64, label: '(10.0, 2.64)', pos: 'br', cls: 'c4' },
        { x: 0, y: -3.96, label: '−W = −3.96', pos: 'br', cls: 'c3' }
      ],
      labels: [
        { x: 6.2, y: -1.3, text: 'ν₀ = 6.0（K₀ = 0）', cls: 'c3' },
        { x: 7.4, y: 3.7, text: '傾き = h', cls: 'c1' },
        { x: 0.5, y: 4.0, text: '縦軸 K₀ の単位: 10⁻¹⁹ J', cls: 'dim' },
        { x: 0.5, y: 3.55, text: '横軸 ν の単位: 10¹⁴ Hz', cls: 'dim' }
      ]
    });
  }
  // 1-4 (3) の選択肢: 実線 = 金属 X、破線 = 金属 Y（限界振動数 nu0、傾き slope）
  function figPhotoOpt(nu0, slope) {
    return G({
      w: 210, h: 160, x: [0, 14], y: [0, 4.4], axis: ['ν', 'K₀'], grid: false, ticks: false,
      curves: [
        { f: photoK, cls: 'c1', domain: [6, 14] },
        { f: function (nu) { return slope * (nu - nu0); }, cls: 'c2', dash: true, domain: [nu0, 14] }
      ]
    });
  }

  // 1-5: ひもを伝わる正弦波（A = 0.50 m, λ = 8.0 m, v = 4.0 m/s, T = 2.0 s。t = 0 に山 P が x = 2.0 m）
  const WA = 0.5;
  const wave0 = function (x) { return WA * Math.cos(PI * (x - 2) / 4); };   // t = 0
  const wave1 = function (x) { return WA * Math.cos(PI * (x - 8) / 4); };   // t = 1.5 s
  function figWave() {
    return G({
      w: 360, h: 230, x: [0, 16], y: [-0.8, 0.8], axis: ['x [m]', 'y [m]'],
      curves: [{ f: wave0, cls: 'c1' }, { f: wave1, cls: 'c2', dash: true }],
      points: [
        { x: 2, y: WA, label: 'P', pos: 'tl', cls: 'c1' },
        { x: 8, y: WA, label: 'P′', pos: 'tr', cls: 'c2' }
      ],
      labels: [
        { x: 10.6, y: 0.74, text: '実線: t = 0', cls: 'c1' },
        { x: 10.6, y: 0.62, text: '破線: t = 1.5 s', cls: 'c2' }
      ]
    });
  }
  // 1-5 (4) の選択肢: x = 0 の媒質の変位 y の時間変化（0 ≦ t ≦ 4.0 s）
  function figWaveOpt(f) {
    return G({
      w: 210, h: 150, x: [0, 4.4], y: [-0.8, 0.8], axis: ['t', 'y'], grid: false, ticks: false,
      curves: [{ f: f, cls: 'c1', domain: [0, 4] }],
      vlines: [{ x: 2, label: '2 s' }, { x: 4, label: '4 s' }]
    });
  }
  // 1-5 解説: 波形を右へ 1.0 m ずらす（少し後の波形）と、x = 0 の高さは下がる
  function figWaveSol() {
    const shifted = function (x) { return wave0(x - 1); };
    return G({
      w: 340, h: 230, x: [-4, 8], y: [-0.8, 0.8], axis: ['x [m]', 'y [m]'],
      curves: [{ f: wave0, cls: 'c1' }, { f: shifted, cls: 'c2', dash: true }],
      segs: [
        { x1: 0, y1: 0, x2: 0, y2: shifted(0), cls: 'c3', arrow: true },
        { x1: 2, y1: 0.62, x2: 3, y2: 0.62, cls: 'c2', arrow: true, label: '右へ 1.0 m' }
      ],
      points: [{ x: 0, y: 0, cls: 'c4' }],
      labels: [
        { x: -3.8, y: 0.72, text: '実線: t = 0', cls: 'c1' },
        { x: -3.8, y: 0.6, text: '破線: t = 0.25 s', cls: 'c2' },
        { x: 0.25, y: -0.72, text: 'x = 0 の媒質は下へ動く', cls: 'c3' }
      ]
    });
  }

  // 寸法線（水平 / 鉛直）
  function hdim(d, x1, x2, y, label) {
    d.line(x1, y, x2, y, { cls: 'dim', w: 1 });
    d.line(x1, y - 4, x1, y + 4, { cls: 'dim', w: 1 });
    d.line(x2, y - 4, x2, y + 4, { cls: 'dim', w: 1 });
    if (label) d.text((x1 + x2) / 2, y + 15, label, { italic: true });
  }
  function vdim(d, x, y1, y2, label, lx) {
    d.line(x, y1, x, y2, { cls: 'dim', w: 1 });
    d.line(x - 4, y1, x + 4, y1, { cls: 'dim', w: 1 });
    d.line(x - 4, y2, x + 4, y2, { cls: 'dim', w: 1 });
    if (label) d.text(lx == null ? x + 9 : lx, (y1 + y2) / 2 + 4, label, { italic: true, anchor: 'start' });
  }

  // 2: 高さ H の台の右端 A から、水平から 30° 上向きに速さ v で打ち出された小球が、床の上の台車のついたて（高さ b、前面は x = s）に衝突する
  //   図の寸法は g = 1, v = 2, H = 2, b = 1（1 目盛り = 44 px）の例。s₁ ≈ 4.73, s₂ ≈ 5.61、s = 5.15 の場合を描く
  function figLaunch() {
    const d = D(400, 246);
    const yf = 190, U = 44, xo = 92;
    const S3 = Math.sqrt(3), v = 2, g = 1, Hh = 2, bb = 1, s = 5.15;
    const X = function (u) { return xo + U * u; };
    const Y = function (u) { return yf - U * (Hh + u / S3 - 2 * g * u * u / (3 * v * v)); };
    const xm = S3 * v * v / (4 * g) * (1 + Math.sqrt(1 + 8 * g * Hh / (v * v)));
    const ya = yf - U * Hh;
    d.hatch(14, yf, 392, yf);
    d.rect(52, ya, xo - 52, U * Hh, { cls: 'fg', fill: 'f0' });
    d.arrow(xo, ya - 8, xo, 22, { cls: 'dim', w: 1.2 });
    d.text(xo + 8, 30, 'y', { italic: true, anchor: 'start' });
    d.text(394, yf - 6, 'x', { italic: true, anchor: 'end' });
    d.text(xo - 8, yf + 16, 'O', { italic: true, anchor: 'end' });
    // 軌道（濃い破線は衝突まで、薄い破線は台車がないと仮定したときの続き）
    let p = '', q = '';
    for (let i = 0; i <= 80; i++) { const u = s * i / 80; p += (i ? ' L' : 'M') + X(u).toFixed(1) + ' ' + Y(u).toFixed(1); }
    for (let i = 0; i <= 20; i++) { const u = s + (xm - s) * i / 20; q += (i ? ' L' : 'M') + X(u).toFixed(1) + ' ' + Y(u).toFixed(1); }
    d.path(q, { cls: 'dim', dash: true, w: 1.4 });
    d.path(p, { cls: 'c1', dash: true, w: 1.8 });
    d.line(X(xm), yf - 5, X(xm), yf + 5, { cls: 'dim', w: 1 });
    // 打ち出し点 A と速度 v、角 30°
    d.dot(xo, ya, { cls: 'c3', r: 3.8 });
    d.text(xo - 8, ya - 8, 'A', { italic: true, anchor: 'end' });
    d.line(xo, ya, xo + 52, ya, { cls: 'dim', dash: true, w: 1 });
    const L = 50;
    arr(d, xo, ya, xo + L * S3 / 2, ya - L / 2, '', 'c3');
    d.text(xo + L * S3 / 2 + 6, ya - L / 2 - 2, 'v', { cls: 'c3', italic: true, anchor: 'start' });
    d.angle(xo, ya, 32, 0, 30, '30°', { cls: 'c3' });
    // 台車（ついたて前面 x = s）
    const xw = X(s);
    d.line(xw, yf - 14, xw, yf - U * bb, { cls: 'fg', w: 4 });
    d.rect(xw, yf - 14, 44, 11, { cls: 'fg', fill: 'f1', rx: 2 });
    d.circle(xw + 11, yf - 3.5, 3.5, { cls: 'fg', fill: 'f0' });
    d.circle(xw + 33, yf - 3.5, 3.5, { cls: 'fg', fill: 'f0' });
    d.text(xw + 22, yf - 5, 'M', { italic: true, size: 11 });
    d.dot(xw, Y(s), { cls: 'c3', r: 3.8 });
    arr(d, xw + 8, yf - U * bb - 10, xw + 40, yf - U * bb - 10, '', 'c2');
    d.text(xw + 46, yf - U * bb - 6, 'V', { cls: 'c2', italic: true, anchor: 'start' });
    // 寸法: H（台の高さ）、b（ついたての高さ）、s（A の真下から前面まで）
    vdim(d, 32, ya, yf, 'H', 14);
    vdim(d, xw + 56, yf - U * bb, yf, 'b', xw + 62);
    hdim(d, xo, xw, yf + 24, 's');
    return d.svg();
  }
  // 2解説: 軌道 y = H + x/√3 − 2g x²/(3v²)（g = 1, v = 2, H = 2, b = 1 の例）と、高さ b・床との交点 s₁, s₂
  function figLaunchSol() {
    const S3 = Math.sqrt(3), v = 2, g = 1, Hh = 2, bb = 1;
    const f = function (x) { return Hh + x / S3 - 2 * g * x * x / (3 * v * v); };
    const x0 = S3 * v * v / (4 * g);
    const s1 = x0 * (1 + Math.sqrt(1 + 8 * g * (Hh - bb) / (v * v)));
    const xm = x0 * (1 + Math.sqrt(1 + 8 * g * Hh / (v * v)));
    return G({
      w: 340, h: 230, x: [-0.4, 8.6], y: [-1.1, 3.2], ticks: false, grid: false, axis: ['x', 'y'],
      curves: [{ f: f, cls: 'c1', domain: [0, xm] }],
      hlines: [{ y: bb, label: 'y = b', dash: true }],
      vlines: [{ x: s1, label: 's₁' }, { x: xm, label: 's₂' }],
      segs: [
        { x1: 0, y1: -0.3, x2: s1, y2: -0.3, cls: 'c4' },
        { x1: s1, y1: -0.3, x2: xm, y2: -0.3, cls: 'c3' },
        { x1: xm, y1: -0.3, x2: 8.4, y2: -0.3, cls: 'c4' }
      ],
      labels: [
        { x: s1 / 2, y: -0.85, text: '上端の上を通過', cls: 'c4', anchor: 'middle' },
        { x: (s1 + xm) / 2, y: -0.85, text: '衝突', cls: 'c3', anchor: 'middle' },
        { x: (xm + 8.4) / 2 + 0.1, y: -0.85, text: '届かない', cls: 'c4', anchor: 'middle' },
        { x: 1.6, y: 3.0, text: '軌道 y(x)', cls: 'c1', anchor: 'start' }
      ],
      points: [{ x: 0, y: Hh, label: 'A', pos: 'tr', cls: 'c3' }]
    });
  }

  // 複数の SVG を縦に並べて 1 枚の SVG にする（入れ子の <svg> を使う）
  function stack(svgs, gap) {
    let y = 0, body = '';
    svgs.forEach(function (s) {
      const m = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(s);
      const sw = Number(m[1]), sh = Number(m[2]);
      body += s.replace(/^<svg class="[^"]*" /, '<svg x="' + ((360 - sw) / 2) + '" y="' + y + '" ');
      y += sh + gap;
    });
    const H = y - gap;
    return '<svg class="jk-plot" viewBox="0 0 360 ' + H + '" width="360" height="' + H + '" xmlns="http://www.w3.org/2000/svg" role="img">' + body + '</svg>';
  }

  // 3-1: 平行な極板（上が高電位）。中央の点 S から右向きに打ち込まれた粒子が、下の板の点 T に達する
  function figPlates(withField) {
    const d = D(360, 214);
    const xl = 64, xr = 300, yt = 48, yb = 158, ym = (yt + yb) / 2;
    d.rect(xl, yt - 7, xr - xl, 7, { cls: 'fg', fill: 'f1' });
    d.rect(xl, yb, xr - xl, 7, { cls: 'fg', fill: 'f1' });
    d.line(xr, yt - 3.5, 338, yt - 3.5, { cls: 'fg' });
    d.line(xr, yb + 3.5, 338, yb + 3.5, { cls: 'fg' });
    d.battery(338, yt - 3.5, 338, yb + 3.5, { label: 'V', ldist: 20 });
    d.text(350, yt + 10, '+', { bold: true, anchor: 'start' });
    d.text(350, yb - 4, '−', { bold: true, anchor: 'start' });
    const sx = 88, sy = ym, tx = 232, k = (yb - sy) / ((tx - sx) * (tx - sx));
    const Y = function (x) { return sy + k * (x - sx) * (x - sx); };
    let p = '';
    for (let i = 0; i <= 60; i++) { const x = sx + (tx - sx) * i / 60; p += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + Y(x).toFixed(1); }
    d.path(p, { cls: 'c1', dash: true, w: 1.8 });
    d.dot(sx, sy, { cls: 'c3', r: 3.6 });
    d.dot(tx, yb, { cls: 'c3', r: 3.6 });
    d.text(sx - 8, sy + 4, 'S', { italic: true, anchor: 'end' });
    d.text(tx + 10, yb - 8, 'T', { italic: true, anchor: 'start' });
    arr(d, sx, sy, sx + 46, sy, '', 'c3');
    d.text(sx + 24, sy - 9, 'v₀', { cls: 'c3', italic: true });
    vdim(d, 40, yt, yb, 'd', 18);
    d.text(200, 28, '上の板が高電位', { size: 11, cls: 'dim' });
    if (withField) {
      arr(d, 262, yt + 14, 262, yb - 14, '', 'c4');
      arr(d, 286, yt + 14, 286, yb - 14, '', 'c4');
      d.text(274, yt + 40, 'E', { cls: 'c4', italic: true, bold: true });
      arr(d, 160, Y(160), 160, Y(160) + 28, '', 'c2');
      d.text(170, Y(160) + 24, 'F', { cls: 'c2', italic: true, bold: true, anchor: 'start' });
    }
    return d.svg();
  }

  // 3-2: ダイオード D・抵抗 R・電池 E の直列回路
  function figDiodeCircuit() {
    const d = D(360, 150);
    const xl = 92, xr = 292, yt = 38, yb = 124;
    d.battery(xl, yt, xl, yb, { label: 'E = 2.0 V', ldist: 46 });
    d.resistor(xl, yt, xr, yt, { label: 'R = 10 Ω' });
    d.line(xr, yt, xr, 66, { cls: 'fg' });
    d.poly([[xr - 11, 66], [xr + 11, 66], [xr, 92]], { cls: 'fg', fill: 'f0' });
    d.line(xr - 12, 93, xr + 12, 93, { cls: 'fg', w: 2.4 });
    d.line(xr, 93, xr, yb, { cls: 'fg' });
    d.wire([[xr, yb], [xl, yb]]);
    d.text(xl + 17, 80, '+', { anchor: 'start', bold: true });
    d.text(xl + 17, 95, '−', { anchor: 'start', bold: true });
    d.text(xr + 20, 84, 'D', { anchor: 'start', italic: true });
    d.text(xr - 18, 74, 'p', { anchor: 'end', italic: true, cls: 'dim' });
    d.text(xr - 18, 106, 'n', { anchor: 'end', italic: true, cls: 'dim' });
    arr(d, xr + 40, yt + 6, xr + 40, yt + 30, '', 'c3');
    d.text(xr + 48, yt + 24, 'I', { cls: 'c3', italic: true, anchor: 'start' });
    return d.svg();
  }
  // 3-2: ダイオードの電流電圧特性 I = Is(exp(V/0.08) − 1)（V = 0.80 V で I = 0.12 A）
  const diodeIs = 0.12 / (Math.exp(0.80 / 0.08) - 1);
  const diodeI = function (v) { return diodeIs * (Math.exp(v / 0.08) - 1); };
  function figDiodeGraph() {
    return G({
      w: 340, h: 250, x: [0, 1.1], y: [0, 0.16], axis: ['V [V]', 'I [A]'],
      curves: [{ f: diodeI, cls: 'c1', domain: [0, 1.1] }],
      labels: [{ x: 0.12, y: 0.1, text: 'ダイオードの特性', cls: 'c1' }]
    });
  }
  // 3-2 解説: 負荷直線 I = (2.0 − V)/10 を重ねる
  function figDiodeSol() {
    return G({
      w: 340, h: 250, x: [0, 1.1], y: [0, 0.16], axis: ['V [V]', 'I [A]'],
      curves: [
        { f: diodeI, cls: 'c1', domain: [0, 1.1] },
        { f: function (v) { return (2.0 - v) / 10; }, cls: 'c3', domain: [0, 1.1] }
      ],
      points: [{ x: 0.8, y: 0.12, label: '(0.80 V, 0.12 A)', pos: 'tr', cls: 'c4' }],
      labels: [
        { x: 0.12, y: 0.1, text: 'ダイオードの特性', cls: 'c1' },
        { x: 0.12, y: 0.145, text: '負荷直線 I = (2.0 − V)/10', cls: 'c3' }
      ]
    });
  }

  // 4: p-V 図（A→B→C→D→A：時計まわりの矩形サイクル。A(V₀, 3p₀) B(2V₀, 3p₀) C(2V₀, p₀) D(V₀, p₀)）
  function figCycle() {
    const d = D(360, 262);
    const ox = 66, oy = 214, sx = 96, sy = 48;
    const X = function (v) { return ox + sx * v; };
    const Y = function (p) { return oy - sy * p; };
    const A = [X(1), Y(3)], B = [X(2), Y(3)], C = [X(2), Y(1)], Dd = [X(1), Y(1)];
    d.arrow(ox, oy, 338, oy, { cls: 'dim', w: 1.3 });
    d.arrow(ox, oy, ox, 20, { cls: 'dim', w: 1.3 });
    d.text(338, oy + 17, '体積 V', { anchor: 'end', size: 11, cls: 'dim' });
    d.text(ox + 8, 26, '圧力 p', { anchor: 'start', size: 11, cls: 'dim' });
    d.text(ox - 8, oy + 15, 'O', { italic: true, anchor: 'end' });
    d.line(ox, A[1], A[0], A[1], { cls: 'dim', dash: true, w: 1 });
    d.line(ox, Dd[1], Dd[0], Dd[1], { cls: 'dim', dash: true, w: 1 });
    d.line(Dd[0], Dd[1], Dd[0], oy, { cls: 'dim', dash: true, w: 1 });
    d.line(C[0], C[1], C[0], oy, { cls: 'dim', dash: true, w: 1 });
    d.text(ox - 8, A[1] + 4, '3p₀', { anchor: 'end' });
    d.text(ox - 8, Dd[1] + 4, 'p₀', { anchor: 'end' });
    d.text(Dd[0], oy + 17, 'V₀');
    d.text(C[0], oy + 17, '2V₀');
    d.poly([A, B, C, Dd], { cls: 'c1', w: 2.2 });
    const mx = (A[0] + B[0]) / 2, my = (B[1] + C[1]) / 2;
    d.arrow(mx - 14, A[1], mx + 14, A[1], { cls: 'c1', w: 2.2 });
    d.arrow(B[0], my - 14, B[0], my + 14, { cls: 'c1', w: 2.2 });
    d.arrow(mx + 14, C[1], mx - 14, C[1], { cls: 'c1', w: 2.2 });
    d.arrow(A[0], my + 14, A[0], my - 14, { cls: 'c1', w: 2.2 });
    d.text(A[0] - 10, A[1] - 8, 'A', { italic: true, anchor: 'end' });
    d.text(B[0] + 10, B[1] - 8, 'B', { italic: true, anchor: 'start' });
    d.text(C[0] + 10, C[1] + 15, 'C', { italic: true, anchor: 'start' });
    d.text(Dd[0] - 10, Dd[1] + 15, 'D', { italic: true, anchor: 'end' });
    return d.svg();
  }

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ================= 第1問（小問集合）================= */

    /* ---------- 第1問 問1 等加速度運動 ---------- */
    {
      id: 'sk-p-2023-1-1',
      subject: 'physics',
      level: 'mid',
      unit: 'p-kin',
      title: '等加速度運動の速度と道のり',
      source: src('第1問 問1'),
      time: 4,
      body: R`直線レールの上を、台車が一定の加速度で走っている。レールに沿って右向きに $x$ 軸をとると、台車の加速度の $x$ 成分は $-1.5\,\mathrm{m/s^{2}}$ で、時刻 $t=2.0\,\mathrm{s}$ のとき台車の速度の $x$ 成分は $+3.0\,\mathrm{m/s}$ だった。`,
      fig: figCart(),
      parts: [
        {
          label: '(1)',
          q: R`時刻 $t=6.0\,\mathrm{s}$ の台車の速度の $x$ 成分に最も近いものはどれか。`,
          type: 'choice',
          choices: [R`$-9.0\,\mathrm{m/s}$`, R`$-6.0\,\mathrm{m/s}$`, R`$-3.0\,\mathrm{m/s}$`, R`$0\,\mathrm{m/s}$`, R`$+6.0\,\mathrm{m/s}$`, R`$+9.0\,\mathrm{m/s}$`],
          answer: 2,
          explain: R`時刻 $2.0\,\mathrm{s}$ の速度を基準に、経過時間 $6.0-2.0=4.0\,\mathrm{s}$ を使います。$v=3.0+(-1.5)\times 4.0=-3.0\,\mathrm{m/s}$。時刻 $0$ を基準にした式 $v=v_{0}+at$ に $t=6.0$ を入れるとき、$3.0\,\mathrm{m/s}$ を初速度 $v_{0}$ にしてしまうと誤りです（$-6.0\,\mathrm{m/s}$ になります）。`
        },
        {
          label: '(2)',
          q: R`$t=2.0\,\mathrm{s}$ から $t=6.0\,\mathrm{s}$ までの $4.0$ 秒間に、台車が実際に走った距離（道のり）は何 $\mathrm{m}$ か。`,
          type: 'num',
          answer: 6.0,
          rel: 0.02,
          unit: 'm',
          explain: R`速度は $t=4.0\,\mathrm{s}$ に $0$ になり、そこで向きが反転します。$t=2.0\sim4.0\,\mathrm{s}$ に右へ $\dfrac{1}{2}\times2.0\times3.0=3.0\,\mathrm{m}$、$t=4.0\sim6.0\,\mathrm{s}$ に左へ $3.0\,\mathrm{m}$ 動くので、道のりは $6.0\,\mathrm{m}$ です（変位は $0$ で、元の位置に戻っています）。`
        }
      ],
      solution: [
        {
          t: '基準になる時刻をそろえて等加速度運動の式を使う',
          m: R`v = v_{1} + a\,(t - t_{1})`,
          n: R`時刻 $t_{1}=2.0\,\mathrm{s}$ の速度 $v_{1}=+3.0\,\mathrm{m/s}$ が分かっているので、その時刻からの経過時間 $t-t_{1}$ を使います。初速度 $v_{0}$ は「時刻 $0$ の速度」なので、$v_{0}=3.0$ としてはいけません。`,
          easy: R`加速度は「1 秒たつごとに速度がどれだけ変わるか」を表します。$-1.5\,\mathrm{m/s^{2}}$ なら、1 秒ごとに速度が $1.5\,\mathrm{m/s}$ ずつ減っていきます。基準の時刻から $4.0$ 秒たてば、速度は $4.0\times 1.5=6.0\,\mathrm{m/s}$ だけ減ります。`,
          pro: R`「基準にした時刻からの経過時間」で式を立てれば、初速度を求め直す手間が省けます。`,
          lv: 1
        },
        {
          t: '(1) 時刻 6.0 s の速度',
          m: [R`v = 3.0 + (-1.5)\times(6.0 - 2.0)`, R`= 3.0 - 6.0 = -3.0\,\mathrm{m/s}`],
          n: R`符号が負なので、台車は $x$ 軸の負の向き（左向き）に $3.0\,\mathrm{m/s}$ で動いています。`,
          lv: 1
        },
        {
          t: '速度が 0 になる時刻（向きが変わる時刻）を求める',
          m: [R`v = 0 \;\Rightarrow\; 3.0 - 1.5\,(t - 2.0) = 0`, R`t - 2.0 = 2.0 \;\Rightarrow\; t = 4.0\,\mathrm{s}`],
          n: R`$t=4.0\,\mathrm{s}$ に台車は一瞬止まり、その後は向きを反転して戻ってきます。道のりは、この反転を境に分けて考えます。`,
          easy: R`まっすぐ進んで、減速して止まり、こんどは逆向きに加速する運動です。ボールを真上に投げ上げたときの「上昇 → 頂点で一瞬静止 → 落下」と同じ形です。道のりは「行きの距離 + 帰りの距離」の合計です。`,
          lv: 2
        },
        {
          t: '(2) 道のり（$v$-$t$ グラフの面積）',
          m: [
            R`x_{1} = \frac{1}{2}\times 2.0\times 3.0 = 3.0\,\mathrm{m}\qquad(t = 2.0 \sim 4.0\,\mathrm{s})`,
            R`x_{2} = \frac{1}{2}\times 2.0\times 3.0 = 3.0\,\mathrm{m}\qquad(t = 4.0 \sim 6.0\,\mathrm{s})`,
            R`s = x_{1} + x_{2} = 6.0\,\mathrm{m}`
          ],
          n: R`横軸より上の三角形の面積が「進んだ距離」、下の三角形の面積が「戻った距離」です。変位（符号つきの位置の変化）は $+3.0-3.0=0$ で、台車は元の位置に戻っていますが、道のりは面積の絶対値の和で $6.0\,\mathrm{m}$ になります。`,
          fig: figCartVT(),
          pro: R`変位は「符号つき面積の和」、道のりは「面積の絶対値の和」。折り返す運動では両者を混同しないこと。`,
          lv: 1
        }
      ],
      tags: ['小問集合', '選択式', '等加速度運動', 'v-tグラフ', '道のり']
    },

    /* ---------- 第1問 問2 ばねの直列 ---------- */
    {
      id: 'sk-p-2023-1-2',
      subject: 'physics',
      level: 'mid',
      unit: 'p-force0',
      title: '斜面上でばねにつながれた物体',
      source: src('第1問 問2'),
      time: 4,
      body: R`傾き $30\degree$ のなめらかな斜面の上端の壁に、ばね定数 $k$ のばね A の一端を固定し、A の他端にばね定数 $2k$ のばね B をつなぎ、B の他端に質量 $m$ の物体を取り付けたところ、2 本のばねは斜面に平行に伸び、物体は斜面上で静止した（図）。ばねの質量は無視でき、重力加速度の大きさを $g$ とする。`,
      fig: figSpringIncline(false),
      parts: [
        {
          label: '(1)',
          q: R`2 本のばねがどちらも自然の長さのときの物体の位置から、静止したときの位置までの、斜面に沿った距離を $x$ とする。$x$ を表す式はどれか。`,
          type: 'choice',
          choices: [R`$\dfrac{3mg}{4k}$`, R`$\dfrac{mg}{6k}$`, R`$\dfrac{mg}{2k}$`, R`$\dfrac{3mg}{2k}$`, R`$\dfrac{mg}{4k}$`, R`$\dfrac{3\sqrt{3}\,mg}{4k}$`],
          answer: 0,
          explain: R`斜面に平行な方向の力のつり合いを考えます。物体にはたらく重力の斜面に平行な成分は $mg\sin30\degree=\dfrac{mg}{2}$ で、この力が 2 本のばねのどちらにも同じ大きさではたらきます。A の伸びは $\dfrac{mg/2}{k}=\dfrac{mg}{2k}$、B の伸びは $\dfrac{mg/2}{2k}=\dfrac{mg}{4k}$ で、距離 $x$ はその和 $\dfrac{mg}{2k}+\dfrac{mg}{4k}=\dfrac{3mg}{4k}$ です。斜面の傾きを無視して $mg$ を使うと $\dfrac{3mg}{2k}$ に、$\cos30\degree$ を使うと $\dfrac{3\sqrt{3}\,mg}{4k}$ になり、誤りです。`
        },
        {
          label: '(2)',
          q: R`(1) の $x$ を使って、物体にはたらく重力の斜面に平行な成分 $mg\sin30\degree$ を $Kx$ と表す。2 本のばねを 1 本のばねとみなしたときのばね定数にあたる $K$ はどれか。`,
          type: 'choice',
          choices: [R`$3k$`, R`$\dfrac{3k}{2}$`, R`$2k$`, R`$k$`, R`$\dfrac{2k}{3}$`, R`$\dfrac{k}{3}$`],
          answer: 4,
          explain: R`$\dfrac{mg}{2}=Kx$ に $x=\dfrac{3mg}{4k}$ を入れると、$K=\dfrac{mg/2}{x}=\dfrac{2k}{3}$ です。直列では伸びが足し合わさるので、ばね定数の逆数どうしが足し合わさります（$\dfrac{1}{K}=\dfrac{1}{k}+\dfrac{1}{2k}=\dfrac{3}{2k}$）。$k+2k=3k$ は並列につないだときの値です。`
        }
      ],
      solution: [
        {
          t: '斜面に平行な力のつり合いから、各ばねにはたらく力を決める',
          m: [R`F = mg\sin30\degree = \dfrac{mg}{2}`, R`T_{\mathrm{A}} = T_{\mathrm{B}} = \dfrac{mg}{2}`],
          n: R`物体は斜面上で静止しているので、斜面に平行な方向の力がつり合っています。斜面はなめらかなので摩擦はなく、物体にはたらく斜面に平行な力は、重力の成分 $mg\sin30\degree$（斜面に沿って下向き）と、ばね B が引く力（斜面に沿って上向き）だけです。よって B の張力は $\dfrac{mg}{2}$ です。ばねの質量は無視できるので、B の上端が A を引く力も同じで、A の張力も $\dfrac{mg}{2}$ になります。直列につないだばねには、どれにも同じ大きさの力がはたらきます。`,
          easy: R`重力 $mg$ は、斜面に沿った成分と、斜面に垂直な成分に分けて考えます。斜面に垂直な成分は、斜面が支えてくれます。斜面に沿って物体を引き下ろす力は $mg\sin30\degree=\dfrac{mg}{2}$ で、これをばねが引き上げてつり合います。ばねは軽い（質量を考えない）ので、上から下まで同じ大きさの力で引っ張り合っています。「糸で荷物をつるしたとき、糸のどこでも張力が同じ」と同じ考え方です。`,
          fig: figSpringIncline(true),
          lv: 1
        },
        {
          t: '(1) フックの法則で各ばねの伸びを求める',
          m: [
            R`\dfrac{mg}{2} = k\,x_{\mathrm{A}} \;\Rightarrow\; x_{\mathrm{A}} = \dfrac{mg}{2k}`,
            R`\dfrac{mg}{2} = 2k\,x_{\mathrm{B}} \;\Rightarrow\; x_{\mathrm{B}} = \dfrac{mg}{4k}`,
            R`x = x_{\mathrm{A}} + x_{\mathrm{B}} = \dfrac{mg}{2k} + \dfrac{mg}{4k} = \dfrac{3mg}{4k}`
          ],
          n: R`フックの法則 $F=kx$（ばね定数 $k$、伸び $x$）を、ばねごとに使います。物体は、2 本のばねがどちらも自然の長さのときの位置から、2 本の伸びの和だけ、斜面に沿って下がっています。`,
          easy: R`ばね定数は「ばねの硬さ」です。同じ力で引っ張っても、硬い（ばね定数が大きい）ばねほど伸びは小さくなります。A（$k$）は B（$2k$）より柔らかいので、A の方が大きく伸びるはずだ、と先に見当をつけておくと検算になります（$\dfrac{mg}{2k}>\dfrac{mg}{4k}$）。`,
          lv: 1
        },
        {
          t: '(2) 合成ばね定数',
          m: [R`\dfrac{mg}{2} = Kx \;\Rightarrow\; K = \dfrac{mg/2}{x} = \dfrac{2k}{3}`, R`\dfrac{1}{K} = \dfrac{1}{k} + \dfrac{1}{2k} = \dfrac{3}{2k}`],
          n: R`直列につなぐと、ばね定数の「逆数」が足し合わさります。合成ばね定数 $K=\dfrac{2k}{3}$ は、どちらのばね（$k$ と $2k$）よりも小さく、つまり全体が柔らかくなります。`,
          easy: R`2 本つなぐと、全体は伸びやすくなります（柔らかくなる）。だから合成したばね定数は、どちらのばねよりも小さくなるはずです。$\dfrac{2k}{3}$ は $k$ より小さいので、この感覚に合っています。`,
          pro: R`ばねの合成は、直列が「逆数の和」、並列が「和」。コンデンサーの合成容量と同じ形で、抵抗の合成とは逆です。斜面の傾きを変えても合成ばね定数 $K=\dfrac{2k}{3}$ は変わらず、変わるのは伸びを決める力 $mg\sin\theta$ の方です。`,
          lv: 1
        }
      ],
      tags: ['小問集合', '選択式', 'ばね', '直列', 'フックの法則', '斜面', '力のつり合い']
    },

    /* ---------- 第1問 問3 直線電流がつくる磁場 ---------- */
    {
      id: 'sk-p-2023-1-3',
      subject: 'physics',
      level: 'mid',
      unit: 'p-mag',
      title: '3本の直線電流がつくる磁場',
      source: src('第1問 問3'),
      time: 5,
      body: R`紙面に垂直な、細くて十分に長い 3 本の直線導線が、一辺 $a$ の正方形 ABCD の頂点 A, B, C に固定されている（真空中）。3 本には同じ大きさ $I$ の電流が流れていて、向きは、A と C では紙面の手前向き（図の ⊙）、B では紙面の奥向き（図の ⊗）である。導線のない頂点 D の位置の磁場を考える。なお、直線電流 $I$ から距離 $r$ はなれた点での磁場の強さは $\dfrac{I}{2\pi r}$ である。`,
      fig: figSquareWires(false),
      parts: [
        {
          label: '(1)',
          q: R`点 D の磁場の強さ $H$ はどれか。`,
          type: 'choice',
          choices: [R`$\dfrac{I}{2\pi a}$`, R`$0$`, R`$\dfrac{\sqrt{2}\,I}{2\pi a}$`, R`$\dfrac{\sqrt{2}\,I}{4\pi a}$`, R`$\dfrac{3\sqrt{2}\,I}{4\pi a}$`, R`$\dfrac{I}{\pi a}$`],
          answer: 3,
          explain: R`D から A, C までの距離は $a$、B までは対角線の長さ $\sqrt{2}\,a$ です。1 本がつくる磁場の強さは $\dfrac{I}{2\pi r}$ なので、A, C は $\dfrac{I}{2\pi a}$、B は $\dfrac{\sqrt{2}\,I}{4\pi a}$ です。向きは、A が右向き、C が下向き、B が左上向きなので、A と C の合成 $\dfrac{\sqrt{2}\,I}{2\pi a}$（右下向き）から B の分を引いて、$H=\dfrac{\sqrt{2}\,I}{2\pi a}-\dfrac{\sqrt{2}\,I}{4\pi a}=\dfrac{\sqrt{2}\,I}{4\pi a}$ です。B の電流を A, C と同じ向きだと思い違いをすると $\dfrac{3\sqrt{2}\,I}{4\pi a}$ になります。`
        },
        {
          label: '(2)',
          q: R`点 D の磁場の向きはどれか。図の右向き・上向きを基準にして選べ。`,
          type: 'choice',
          choices: [
            R`右向き`,
            R`左上向き（水平から $45\degree$ 上）`,
            R`下向き`,
            R`右上向き（水平から $45\degree$ 上）`,
            R`左下向き（水平から $45\degree$ 下）`,
            R`右下向き（水平から $45\degree$ 下）`
          ],
          answer: 5,
          explain: R`右ねじの法則から、手前向きの電流 A, C のまわりの磁場は反時計まわり、奥向きの電流 B のまわりの磁場は時計まわりです。D では、A がつくる磁場は右向き、C がつくる磁場は下向き、B がつくる磁場は左上向きです。A と C の合成は右下向きで、B のつくる磁場の 2 倍の強さなので、差し引きの合成磁場は右下向き（水平から $45\degree$ 下）になります。`
        }
      ],
      solution: [
        {
          t: '1 本がつくる磁場の強さと、D からの距離',
          m: [
            R`H = \dfrac{I}{2\pi r}`,
            R`\mathrm{DA} = \mathrm{DC} = a,\qquad \mathrm{DB} = \sqrt{2}\,a`,
            R`H_{\mathrm{A}} = H_{\mathrm{C}} = \dfrac{I}{2\pi a},\qquad H_{\mathrm{B}} = \dfrac{I}{2\pi\cdot\sqrt{2}\,a} = \dfrac{\sqrt{2}\,I}{4\pi a}`
          ],
          n: R`D から A と C までは正方形の一辺 $a$、B までは正方形の対角線 $\sqrt{2}\,a$ です。電流の大きさはどれも $I$ なので、磁場の強さの違いは距離だけで決まります。B は A, C より遠いので、B のつくる磁場は A, C のつくる磁場の $\dfrac{1}{\sqrt{2}}$ 倍の強さです。`,
          easy: R`電流のまわりにできる磁場は、電流が大きいほど強く、導線から遠いほど弱くなります（強さは距離に反比例）。3 本とも電流は同じ $I$ なので、D から近い A, C が強く、遠い B が弱い、と先に見当をつけられます。B までの距離 $\sqrt{2}\,a\approx1.41a$ は、A, C までの距離 $a$ の約 $1.4$ 倍なので、B の磁場は約 $0.71$ 倍です。`,
          lv: 1
        },
        {
          t: '各導線がつくる磁場の向き（右ねじの法則）',
          n: R`右ねじを電流の向きに進めるとき、ねじを回す向きが磁場のまわる向きです。手前向きの電流（⊙）のまわりでは**反時計まわり**、奥向きの電流（⊗）のまわりでは**時計まわり**になります。磁場の向きは、導線と D を結ぶ線に垂直で、まわる向きに沿った向きです。D は A の真下にあるので、反時計まわりの磁場は D で**右向き**。D は C の左にあるので、反時計まわりの磁場は D で**下向き**。D は B の左下にあるので、時計まわりの磁場は D で**左上向き**（水平から $45\degree$ 上）になります。`,
          easy: R`⊙ は「電流が自分の方へ飛び出してくる」向きです。ここでは、導線のまわりに時計の針と逆向きの円をえがくように磁場がまわります。円のどこにいるかで向きが決まります。上にいれば左向き、左にいれば下向き、下にいれば右向き、右にいれば上向きです（反時計まわりの円の接線）。⊗ は逆で、時計まわりです。D は A の「真下」、C の「真左」なので、A の磁場は右向き、C の磁場は下向きと読み取れます。`,
          fig: figSquareWires(true),
          lv: 1
        },
        {
          t: '(1)(2) 3 つの磁場をベクトルとして足し合わせる',
          m: [
            R`H_{x} = H_{\mathrm{A}} - H_{\mathrm{B}}\cos45\degree = \dfrac{I}{2\pi a} - \dfrac{\sqrt{2}\,I}{4\pi a}\times\dfrac{1}{\sqrt{2}} = \dfrac{I}{4\pi a}`,
            R`H_{y} = -H_{\mathrm{C}} + H_{\mathrm{B}}\sin45\degree = -\dfrac{I}{2\pi a} + \dfrac{I}{4\pi a} = -\dfrac{I}{4\pi a}`,
            R`H = \sqrt{H_{x}^{2} + H_{y}^{2}} = \dfrac{\sqrt{2}\,I}{4\pi a}`
          ],
          n: R`右向きを $x$、上向きを $y$ として成分に分けます。$x$ 成分は、A の磁場（右向き、$+H_{\mathrm{A}}$）と B の磁場の $x$ 成分（左向き）の差、$y$ 成分は、C の磁場（下向き、$-H_{\mathrm{C}}$）と B の磁場の $y$ 成分（上向き）の和です。$H_{x}=\dfrac{I}{4\pi a}>0$、$H_{y}=-\dfrac{I}{4\pi a}<0$ なので、磁場は**右下向き**（水平から $45\degree$ 下）で、強さは $\dfrac{\sqrt{2}\,I}{4\pi a}$ です。`,
          pro: R`A と C の合成は $\dfrac{\sqrt{2}\,I}{2\pi a}$（右下向き）、B の磁場は逆向きでちょうどその半分です。B の電流の向きが A, C と同じ（⊙）なら B の磁場は右下向きで、強め合って $\dfrac{3\sqrt{2}\,I}{4\pi a}$ になります。向きだけを問われたら、強い方（A と C の合成）の向きで決まります。`,
          lv: 1
        }
      ],
      tags: ['小問集合', '選択式', '直線電流', '磁場の重ね合わせ', '右ねじの法則']
    },

    /* ---------- 第1問 問4 光電効果 ---------- */
    {
      id: 'sk-p-2023-1-4',
      subject: 'physics',
      level: 'mid',
      unit: 'p-photon',
      title: '光電効果のグラフの読み取り',
      source: src('第1問 問4'),
      time: 5,
      body: R`光電管の陰極に金属 X を使い、陰極に当てる単色光の振動数 $\nu$ を変えながら、光電子がもつ運動エネルギーの最大値 $K_{0}$ を調べたところ、$K_{0}$ と $\nu$ の関係は図の実線の直線になった。`,
      fig: figPhoto(),
      parts: [
        {
          label: '(1)',
          q: R`図から求めたプランク定数 $h$ に最も近いものを選べ。`,
          type: 'choice',
          choices: [
            R`$4.4\times10^{-34}\,\mathrm{J\cdot s}$`,
            R`$6.6\times10^{-6}\,\mathrm{J\cdot s}$`,
            R`$2.6\times10^{-34}\,\mathrm{J\cdot s}$`,
            R`$6.6\times10^{-20}\,\mathrm{J\cdot s}$`,
            R`$6.6\times10^{-34}\,\mathrm{J\cdot s}$`
          ],
          answer: 4,
          explain: R`光電効果の式 $K_{0}=h\nu-W$ より、直線の傾きが $h$ です。直線上の 2 点 $(6.0\times10^{14},\,0)$ と $(10.0\times10^{14},\,2.64\times10^{-19})$ から、$$h=\dfrac{2.64\times10^{-19}}{(10.0-6.0)\times10^{14}}=6.6\times10^{-34}\,\mathrm{J\cdot s}$$ となります。$K_{0}$ を $\nu$ で割る（$2.6\times10^{-34}$）のは誤りで、$\nu$ の増加分 $\nu-\nu_{0}$ で割ります。`
        },
        {
          label: '(2)',
          q: R`図から求めた金属 X の仕事関数 $W$ に最も近いものを選べ。`,
          type: 'choice',
          choices: [
            R`$2.6\times10^{-19}\,\mathrm{J}$`,
            R`$4.0\times10^{-19}\,\mathrm{J}$`,
            R`$6.6\times10^{-19}\,\mathrm{J}$`,
            R`$9.2\times10^{-19}\,\mathrm{J}$`,
            R`$4.0\times10^{-33}\,\mathrm{J}$`
          ],
          answer: 1,
          explain: R`$K_{0}=0$ になる限界振動数 $\nu_{0}=6.0\times10^{14}\,\mathrm{Hz}$ で $h\nu_{0}=W$ となるので、$$W=6.6\times10^{-34}\times6.0\times10^{14}=3.96\times10^{-19}\approx4.0\times10^{-19}\,\mathrm{J}$$ です。$h\nu-K_{0}$ に直線上の点 $(10.0\times10^{14},\,2.64\times10^{-19})$ を入れても同じ値になります。`
        },
        {
          label: '(3)',
          q: R`金属 X より仕事関数の大きい金属 Y でも、同じ測定を行った。金属 X の結果（実線）と金属 Y の結果（破線）を並べて描いた図はどれか。`,
          type: 'choice',
          choices: [
            { fig: figPhotoOpt(8.0, 0.66) },
            { fig: figPhotoOpt(6.0, 0.33) },
            { fig: figPhotoOpt(4.0, 0.66) },
            { fig: figPhotoOpt(6.0, 1.1) }
          ],
          answer: 0,
          explain: R`限界振動数 $\nu_{0}=\dfrac{W}{h}$ は仕事関数 $W$ に比例するので、$W$ が大きい金属 Y では直線が横軸と交わる点が右へずれます。傾き $h$ は金属によらない定数なので、破線は実線と平行です。`
        }
      ],
      solution: [
        {
          t: '光電効果の式とグラフの意味',
          m: [R`K_{0} = h\nu - W`, R`= h(\nu - \nu_{0}),\qquad \nu_{0} = \dfrac{W}{h}`],
          n: R`光電効果では、金属中の電子 1 個が光子 1 個のエネルギー $h\nu$ を受け取り、金属から出るのに必要な最小のエネルギー（仕事関数 $W$）を使って外へ飛び出します。残りが運動エネルギーで、その最大値が $K_{0}$ です。$K_{0}$ を $\nu$ の関数として見ると、傾きが $h$、$\nu$ 軸との交点が $\nu_{0}=\dfrac{W}{h}$（限界振動数）の直線になります。`,
          easy: R`光は「光子」というエネルギーの粒の集まりで、振動数 $\nu$ の光の粒 1 個は $h\nu$ のエネルギーをもちます（$h$ はプランク定数）。金属から電子を 1 個取り出すには、最低でも $W$ のエネルギーが必要です（これが仕事関数）。粒のエネルギー $h\nu$ から、取り出しに使った $W$ を引いた残りが、飛び出した電子の運動エネルギーです。$\nu$ が小さくて $h\nu<W$ のときは、電子は出てきません。`,
          lv: 1
        },
        {
          t: '(1) 直線の傾きからプランク定数を求める',
          m: [
            R`h = \dfrac{\Delta K_{0}}{\Delta \nu} = \dfrac{2.64\times10^{-19} - 0}{(10.0 - 6.0)\times10^{14}}`,
            R`= 6.6\times10^{-34}\,\mathrm{J\cdot s}`
          ],
          n: R`直線上の 2 点 $(6.0\times10^{14}\,\mathrm{Hz},\ 0)$ と $(10.0\times10^{14}\,\mathrm{Hz},\ 2.64\times10^{-19}\,\mathrm{J})$ を読み取って傾きを求めます。軸の目盛りの $10^{14}$ と $10^{-19}$ を落とさないように注意します。`,
          easy: R`「傾き」は「横に $1$ 進むと縦がいくつ増えるか」です。ここでは横軸が $10^{14}\,\mathrm{Hz}$ 単位、縦軸が $10^{-19}\,\mathrm{J}$ 単位なので、まず目盛りの値だけで $\dfrac{2.64}{4.0}=0.66$ を出し、あとから単位の $\dfrac{10^{-19}}{10^{14}}=10^{-33}$ をかけて $0.66\times10^{-33}=6.6\times10^{-34}$ とします。`,
          lv: 1
        },
        {
          t: '(2) 仕事関数',
          m: [
            R`W = h\nu_{0} = 6.6\times10^{-34}\times 6.0\times10^{14}`,
            R`= 3.96\times10^{-19} \approx 4.0\times10^{-19}\,\mathrm{J}`
          ],
          n: R`$K_{0}=0$ となる $\nu_{0}$（直線が横軸と交わる点）では、光子のエネルギー $h\nu_{0}$ がちょうど仕事関数 $W$ に等しくなります。別の確かめ方として、直線上の点 $(10.0,\ 2.64)$ を $K_{0}=h\nu-W$ に代入すると、$$W=6.6\times10^{-34}\times10.0\times10^{14}-2.64\times10^{-19}=3.96\times10^{-19}\,\mathrm{J}$$ と同じ値になります。`,
          fig: figPhotoSol(),
          pro: R`直線を左に延長したとき、縦軸との交点が $-W$ になります。傾き $h$、横軸切片 $\nu_{0}$、縦軸切片 $-W$ の 3 つを 1 枚のグラフから読み取れるのが、このグラフの利点です。`,
          lv: 1
        },
        {
          t: '(3) 仕事関数が大きい金属のグラフ',
          m: R`\nu_{0} = \dfrac{W}{h}\quad\Longrightarrow\quad W\text{ が大きいほど }\nu_{0}\text{ は大きい}`,
          n: R`限界振動数 $\nu_{0}=\dfrac{W}{h}$ は $W$ に比例するので、$W$ が大きい金属 Y では、直線が横軸と交わる点が右（振動数が大きい側）へずれます。一方、傾き $h$ はプランク定数で、金属によらない定数です。したがって、金属 Y の直線は金属 X の直線と平行で、右にずれたものになります。`,
          easy: R`電子を取り出すのに必要なエネルギー $W$ が大きい金属ほど、電子が出始めるのに強い（振動数の大きい）光が必要になります。だから、直線の始まりが右にずれます。一方、光の粒 1 個のエネルギーは $h\nu$ で、$h$ は金属によらない定数なので、「振動数が 1 増えると運動エネルギーがどれだけ増えるか」（傾き）は金属 X と同じです。`,
          lv: 1
        }
      ],
      tags: ['小問集合', '選択式', '光電効果', 'グラフの読み取り', 'プランク定数', '仕事関数']
    },

    /* ---------- 第1問 問5 正弦波の読み取り ---------- */
    {
      id: 'sk-p-2023-1-5',
      subject: 'physics',
      level: 'mid',
      unit: 'p-wave',
      title: '波の速さ・波長・周期の読み取り',
      source: src('第1問 問5'),
      time: 6,
      body: R`$x$ 軸に沿って張った長いひもを、正弦波が $x$ 軸の正の向きに進んでいく。図の実線は時刻 $t=0$、破線は時刻 $t=1.5\,\mathrm{s}$ のひもの形（各位置 $x$ での変位 $y$）である。実線の山の頂点 P と、破線の山の頂点 P′ は、同じ山の頂点が移動したものである。この $1.5\,\mathrm{s}$ の間に、波は 1 波長に満たない距離だけ進んだ。`,
      fig: figWave(),
      parts: [
        {
          label: '(1)',
          q: R`この波の波長は何 $\mathrm{m}$ か。`,
          type: 'num',
          answer: 8.0,
          rel: 0.02,
          unit: 'm',
          explain: R`実線で、隣り合う山の頂点は $x=2.0\,\mathrm{m}$ と $x=10.0\,\mathrm{m}$ にあります。山から山までの間隔が 1 波長なので、$\lambda=10.0-2.0=8.0\,\mathrm{m}$ です。`
        },
        {
          label: '(2)',
          q: R`この波の速さは何 $\mathrm{m/s}$ か。`,
          type: 'num',
          answer: 4.0,
          rel: 0.02,
          unit: 'm/s',
          explain: R`山の頂点 P が $1.5\,\mathrm{s}$ の間に $x=2.0\,\mathrm{m}$ から $x=8.0\,\mathrm{m}$ まで $6.0\,\mathrm{m}$ 進んだので、$v=\dfrac{6.0}{1.5}=4.0\,\mathrm{m/s}$ です。進んだ距離が 1 波長（$8.0\,\mathrm{m}$）より短いので、P の移った先は P′ だと決まります。`
        },
        {
          label: '(3)',
          q: R`この波の周期は何 $\mathrm{s}$ か。`,
          type: 'num',
          answer: 2.0,
          rel: 0.02,
          unit: 's',
          explain: R`波は 1 周期 $T$ の間に 1 波長 $\lambda$ だけ進むので、$v=\dfrac{\lambda}{T}$ より $T=\dfrac{\lambda}{v}=\dfrac{8.0}{4.0}=2.0\,\mathrm{s}$ です。`
        },
        {
          label: '(4)',
          q: R`位置 $x=0$ にある媒質の変位 $y$ の時間変化（$t=0$ から $t=4.0\,\mathrm{s}$）を表すグラフはどれか。`,
          type: 'choice',
          choices: [
            { fig: figWaveOpt(function (t) { return WA * Math.cos(PI * t); }) },
            { fig: figWaveOpt(function (t) { return WA * Math.sin(PI * t); }) },
            { fig: figWaveOpt(function (t) { return -WA * Math.cos(PI * t); }) },
            { fig: figWaveOpt(function (t) { return -WA * Math.sin(PI * t); }) }
          ],
          answer: 3,
          explain: R`波は形を変えずに右へ進むので、少し後の $x=0$ の変位は、いま $x=0$ のすぐ左にある波形の高さになります。$t=0$ で $x=0$ の変位は $0$、そのすぐ左（$x<0$）の波形は負なので、$x=0$ の媒質はまず下向きに動き始めます。周期 $2.0\,\mathrm{s}$ で $y=-0.50\sin(\pi t)$ となるグラフです。`
        }
      ],
      solution: [
        {
          t: '(1) 波長：隣り合う山と山の間隔',
          m: R`\lambda = 10.0 - 2.0 = 8.0\,\mathrm{m}`,
          n: R`実線で、隣り合う山の頂点の位置は $x=2.0\,\mathrm{m}$ と $x=10.0\,\mathrm{m}$ です。山から山まで（谷から谷まででも同じ）の長さが 1 波長です。`,
          easy: R`波長は「波の 1 まとまり（山 1 つと谷 1 つ）の長さ」です。山の頂点から次の山の頂点まで、図の目盛りを読んで引き算します。山は $x=2.0$ と $x=10.0$ にあるので、$10.0-2.0=8.0$ です。`,
          lv: 1
        },
        {
          t: '(2) 波の速さ：同じ山が進んだ距離 ÷ かかった時間',
          m: [R`\Delta x = 8.0 - 2.0 = 6.0\,\mathrm{m}`, R`v = \dfrac{\Delta x}{\Delta t} = \dfrac{6.0}{1.5} = 4.0\,\mathrm{m/s}`],
          n: R`山 P が P′ まで進んだ距離 $6.0\,\mathrm{m}$ を、かかった時間 $1.5\,\mathrm{s}$ で割ります。波は形をそのまま保って、速さ $v$ で $x$ 軸の正の向きに移動していきます。進んだ距離が 1 波長より短いことから、P が移った先は「別の山」ではなく P′ だと決まります。`,
          easy: R`波は「波の形がそのまま動いていく」現象です。山の頂点に目印をつけて、その目印が $1.5$ 秒でどこまで動いたかを見れば、速さが分かります（速さ = 距離 ÷ 時間）。`,
          lv: 1
        },
        {
          t: '(3) 周期：波が 1 波長進むのにかかる時間',
          m: [R`v = f\lambda = \dfrac{\lambda}{T}`, R`T = \dfrac{\lambda}{v} = \dfrac{8.0}{4.0} = 2.0\,\mathrm{s}`],
          n: R`波は 1 周期 $T$ の間にちょうど 1 波長 $\lambda$ だけ進むので、$v=\dfrac{\lambda}{T}$ です。振動数は $f=\dfrac{1}{T}=0.50\,\mathrm{Hz}$ になります。`,
          easy: R`周期は、ある場所の媒質が 1 回上下して元の状態に戻るまでの時間です。その間に波は 1 波長ぶん進むので、「1 波長進むのにかかる時間」と同じになります。$8.0\,\mathrm{m}$ を $4.0\,\mathrm{m/s}$ で進むには $2.0$ 秒かかります。`,
          pro: R`$v=f\lambda=\dfrac{\lambda}{T}$ は波の基本公式。図の読み取りでは「同じ山の移動距離 → $v$、山と山の間隔 → $\lambda$、$T=\dfrac{\lambda}{v}$」の順に出すと速い。`,
          lv: 1
        },
        {
          t: '(4) $x=0$ の媒質は、まず上下どちらへ動くか',
          m: R`y(0,\,t) = -0.50\sin(\pi t)\,\mathrm{m}`,
          n: R`波は形を変えずに右へ進むので、少し後の $x=0$ の変位は、いま $x=0$ のすぐ左にある波形の高さになります。$t=0$ で $x=0$ の変位は $0$、そのすぐ左（$x<0$）の波形は負です。したがって $x=0$ の媒質はまず**下向き**に動き始め、周期 $2.0\,\mathrm{s}$ の半分の $1.0\,\mathrm{s}$ で元の高さ $y=0$ に戻ります。`,
          easy: R`「ある場所の媒質がこれからどう動くか」を知りたいときは、波形をほんの少しだけ進行方向（ここでは右）へずらして描き、その場所の高さが上がるか下がるかを見ます。図の破線（$0.25\,\mathrm{s}$ 後。波形が $1.0\,\mathrm{m}$ 右へ移ったもの）がそれです。$x=0$ では実線の高さ $0$ が、破線では負の値になるので、媒質は下へ動き始めます。`,
          fig: figWaveSol(),
          pro: R`「山が近づいてくる側なら上がる、谷が近づいてくる側なら下がる」と判断できます。右へ進む波では、$x$ の小さい側（左）の波形が自分の位置へ移ってきます。`,
          lv: 1
        }
      ],
      tags: ['小問集合', '数値・選択式', '正弦波', 'グラフの読み取り', '波長・速さ・周期']
    },

    /* ================= 第2問（力学）================= */

    /* ---------- 第2問 斜方投射と弾性衝突 ---------- */
    {
      id: 'sk-p-2023-2',
      subject: 'physics',
      level: 'mid',
      unit: 'p-momentum',
      title: '台から打ち出した小球と台車への衝突',
      source: src('第2問'),
      time: 15,
      body: R`水平でなめらかな床の上に、高さ $H$ の台が固定されている。台の右端の点 A（床からの高さ $H$）から、質量 $m$ の小球を、水平から $30\degree$ 上向きに、速さ $v$ で打ち出す。A の真下の床の点を原点 O として、床に沿って右向きに $x$ 軸、鉛直上向きに $y$ 軸をとる。台の右方の床の上には質量 $M$ の台車が置かれていて、その左端には高さ $b$ の薄い鉛直なついたてが付いている（$b<H$）。ついたての前面（左側の面）は $x=s$ の位置にあり、台車は床の上を水平になめらかに動ける。台車のうち、ついたて以外の部分の高さは無視してよい。空気の抵抗は無視でき、小球は質点として扱ってよい。重力加速度の大きさを $g$ とする。`,
      fig: figLaunch(),
      prereq: ['p-fall', 'p-eom'],
      parts: [
        {
          label: '(1)ア',
          q: R`まず、台車がないものとして考える。小球が軌道の最高点に達するのは、打ち出してから何秒後か。その時間 $t_{1}$ を表す式を選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{\sqrt{3}\,v}{2g}$`,
            R`$\dfrac{v}{g}$`,
            R`$\dfrac{v}{2g}\left(1+\sqrt{1+\dfrac{8gH}{v^{2}}}\right)$`,
            R`$\sqrt{\dfrac{2H}{g}}$`,
            R`$\dfrac{v}{2g}$`,
            R`$\dfrac{v}{4g}$`
          ],
          answer: 4,
          explain: R`最高点では速度の $y$ 成分が $0$ です。打ち出し時の $y$ 成分は $v\sin30\degree=\dfrac{v}{2}$ なので、$\dfrac{v}{2}-gt_{1}=0$ より $t_{1}=\dfrac{v}{2g}$ です。$\dfrac{\sqrt{3}\,v}{2g}$ は、$\sin30\degree$ のかわりに $\cos30\degree$ を使ってしまった場合の値です。$\dfrac{v}{2g}\left(1+\sqrt{1+\dfrac{8gH}{v^{2}}}\right)$ は、最高点までではなく、床に落ちるまでの全時間にあたります。`
        },
        {
          label: '(1)イ',
          q: R`同じく台車がないものとして、軌道の最高点の床からの高さ $y_{\max}$ を表す式を選べ。`,
          type: 'choice',
          choices: [
            R`$H+\dfrac{v^{2}}{2g}$`,
            R`$H+\dfrac{v^{2}}{8g}$`,
            R`$H+\dfrac{3v^{2}}{8g}$`,
            R`$\dfrac{v^{2}}{8g}$`,
            R`$H+\dfrac{v^{2}}{4g}$`,
            R`$H+\dfrac{v^{2}}{16g}$`
          ],
          answer: 1,
          explain: R`打ち出した点の高さ $H$ から、さらに $\dfrac{(v/2)^{2}}{2g}=\dfrac{v^{2}}{8g}$ だけ上がるので、床からの最高点の高さは $y_{\max}=H+\dfrac{v^{2}}{8g}$ です。$H$ を足し忘れると $\dfrac{v^{2}}{8g}$ に、$v$ をそのまま（成分に分けずに）使うと $H+\dfrac{v^{2}}{2g}$ になります。`
        },
        {
          label: '(2)ア',
          q: R`台車を置く位置 $s$ を変えて、同じ打ち出しを何度も行った。台車を置かなければ、小球は $x=s_{2}$ の点で床に落ちる。$s$ が小さいときは、小球はついたての上端より高い所を通りすぎるが、$s$ が $s_{1}$ より大きく $s_{2}$ より小さいと、下降中の小球がついたての前面に当たる。境目の位置 $s_{1}$ を表す式を選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1-\sqrt{1+\dfrac{8g(H-b)}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1+\sqrt{1-\dfrac{8g(H-b)}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1+\sqrt{1+\dfrac{8g(H-b)}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1+\sqrt{1+\dfrac{8gH}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1+\sqrt{1+\dfrac{8g(H+b)}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{2g}\left(1+\sqrt{1+\dfrac{8g(H-b)}{v^{2}}}\right)$`
          ],
          answer: 2,
          explain: R`軌道は $y=H+\dfrac{x}{\sqrt{3}}-\dfrac{2g}{3v^{2}}x^{2}$ です。$y=b$ とおいた 2 次方程式 $\dfrac{2g}{3v^{2}}x^{2}-\dfrac{x}{\sqrt{3}}-(H-b)=0$ を解の公式で解くと $x=\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1\pm\sqrt{1+\dfrac{8g(H-b)}{v^{2}}}\right)$。$H>b$ なので根号の中は $1$ より大きく、$x>0$ の解は $+$ の方だけです。これが、下降しながら高さ $b$ を通る位置 $s_{1}$ です。`
        },
        {
          label: '(2)イ',
          q: R`(2)ア の $s_{2}$（台車がないときの、小球の落下点の $x$ 座標）を表す式を選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{\sqrt{3}\,v^{2}}{2g}$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1+\sqrt{1+\dfrac{4gH}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1+\sqrt{1+\dfrac{8g(H-b)}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1-\sqrt{1+\dfrac{8gH}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{2g}\left(1+\sqrt{1+\dfrac{8gH}{v^{2}}}\right)$`,
            R`$\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1+\sqrt{1+\dfrac{8gH}{v^{2}}}\right)$`
          ],
          answer: 5,
          explain: R`床（$y=0$）に落ちる位置は、(2)ア と同じ 2 次方程式で、$b$ のかわりに $0$ とおいたものです。$s_{2}=\dfrac{\sqrt{3}\,v^{2}}{4g}\left(1+\sqrt{1+\dfrac{8gH}{v^{2}}}\right)$ となります。台の高さが $0$（$H=0$）なら $\dfrac{\sqrt{3}\,v^{2}}{2g}$、つまり水平面上の射程になります。`
        },
        {
          label: '(3)',
          q: R`台車を $s_{1}<s<s_{2}$ の位置に置いて小球を打ち出したところ、小球は下降の途中で、ついたての前面に弾性衝突した。前面はなめらかなので、小球が前面から受ける力は水平方向だけで、小球の速度の鉛直成分は衝突の前後で変わらない。衝突の直後、台車は右向きに速さ $V$ で動き出した。$V$ を表す式を選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{\sqrt{3}\,mv}{m+M}$`,
            R`$\dfrac{\sqrt{3}\,mv}{2(m+M)}$`,
            R`$\dfrac{2mv}{m+M}$`,
            R`$\dfrac{mv}{m+M}$`,
            R`$\dfrac{\sqrt{3}\,mv}{M}$`,
            R`$\dfrac{\sqrt{3}\,(m-M)\,v}{2(m+M)}$`
          ],
          answer: 0,
          explain: R`衝突直前の小球の速度の $x$ 成分は $u=v\cos30\degree=\dfrac{\sqrt{3}}{2}v$。水平方向の運動量保存 $mu=mw+MV$ と、弾性衝突（反発係数 $1$）の条件 $V-w=u$ から、$V=\dfrac{2m}{m+M}u=\dfrac{\sqrt{3}\,mv}{m+M}$ です。$\dfrac{\sqrt{3}\,mv}{2(m+M)}$ は、小球が台車にくっつく（完全非弾性衝突の）場合の速さです。`
        },
        {
          label: '(4)ア',
          q: R`衝突のあと、小球は台に当たることなく床に落ちた。床に着く直前の小球の速度の $x$ 成分（右向きを正）を表す式を選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{\sqrt{3}\,(M-m)\,v}{2(m+M)}$`,
            R`$\dfrac{\sqrt{3}}{2}v$`,
            R`$-\dfrac{\sqrt{3}}{2}v$`,
            R`$\dfrac{\sqrt{3}\,(m-M)\,v}{2(m+M)}$`,
            R`$0$`,
            R`$\dfrac{\sqrt{3}\,(m-M)\,v}{m+M}$`
          ],
          answer: 3,
          explain: R`衝突直後の小球の速度の $x$ 成分は、$w=V-u=\dfrac{m-M}{m+M}\,u=\dfrac{\sqrt{3}\,(m-M)\,v}{2(m+M)}$。衝突後の小球には水平方向の力がはたらかないので、落下の直前までこの値のままです（$m<M$ なら負で、小球は跳ね返されます）。台車が非常に重い（$M\to\infty$）極限では $-\dfrac{\sqrt{3}}{2}v$、つまり固定した壁での跳ね返りになります。`
        },
        {
          label: '(4)イ',
          q: R`同じ瞬間の小球の速度の $y$ 成分（上向きを正）を表す式を選べ。`,
          type: 'choice',
          choices: [
            R`$-\dfrac{v}{2}$`,
            R`$-\sqrt{2gH}$`,
            R`$-\sqrt{\dfrac{v^{2}}{4}+2gH}$`,
            R`$-\sqrt{\dfrac{v^{2}}{4}+2g(H-b)}$`,
            R`$+\sqrt{\dfrac{v^{2}}{4}+2gH}$`,
            R`$-\dfrac{\sqrt{3}}{2}v$`
          ],
          answer: 2,
          explain: R`衝突は鉛直方向の運動に影響しないので、小球の鉛直方向の運動は、台車があってもなくても同じです。打ち出した高さ $H$ から床に着くまでの鉛直方向の力学的エネルギー保存より、$\dfrac{1}{2}mv_{y}'^{2}=\dfrac{1}{2}m\left(\dfrac{v}{2}\right)^{2}+mgH$。向きは下向きなので、$v_{y}'=-\sqrt{\dfrac{v^{2}}{4}+2gH}$ です。衝突した高さ（$H$ より低い所）での値や、打ち出したときの $y$ 成分の大きさと取り違えないこと。`
        }
      ],
      solution: [
        {
          t: '打ち出しの速度を $x$ 成分と $y$ 成分に分ける',
          m: [R`v_{0x} = v\cos30\degree = \dfrac{\sqrt{3}}{2}\,v`, R`v_{0y} = v\sin30\degree = \dfrac{v}{2}`],
          n: R`水平方向（$x$）には力がはたらかないので等速運動、鉛直方向（$y$）には重力だけがはたらくので加速度 $-g$ の等加速度運動です。斜めに打ち出した小球の運動は、このように成分に分けて、別々に考えます。`,
          easy: R`斜めに打ち出した物体の運動は、「横方向」と「縦方向」に分けると簡単になります。横方向は何の力も受けないので、一定の速さで進み続けます。縦方向は、ボールを真上に投げ上げたときと同じ運動です。斜めの矢印 $v$ を横と縦に分けるには三角比を使います（$30\degree$ では $\cos30\degree=\dfrac{\sqrt{3}}{2},\ \sin30\degree=\dfrac{1}{2}$）。`,
          lv: 1
        },
        {
          t: '(1) 最高点までの時間と、最高点の高さ',
          m: [
            R`v_{y} = v_{0y} - g\,t_{1} = 0 \;\Rightarrow\; t_{1} = \dfrac{v_{0y}}{g} = \dfrac{v}{2g}`,
            R`y_{\max} = H + \dfrac{v_{0y}^{2}}{2g} = H + \dfrac{v^{2}}{8g}`
          ],
          n: R`最高点では速度の $y$ 成分が $0$ になります。高さは、打ち出した点の高さ $H$ に、そこから上がる高さ $\dfrac{v_{0y}^{2}}{2g}$ を加えたものです（鉛直投げ上げの公式 $v^{2}-v_{0}^{2}=-2gy$ で、最高点では $v=0$）。`,
          easy: R`ボールを真上に投げ上げると、上がるにつれて遅くなり、最高点で一瞬止まります（このとき縦の速さが $0$）。縦の初速度は $\dfrac{v}{2}$ なので、速さが $0$ になるまでの時間は「速さ ÷ 重力加速度」で $\dfrac{v}{2g}$、上がる高さは $\dfrac{(v/2)^{2}}{2g}$ です。床からの高さにするには、台の高さ $H$ を足します。`,
          lv: 1
        },
        {
          t: '軌道の式をつくる',
          m: [
            R`x = \dfrac{\sqrt{3}}{2}\,v\,t,\qquad y = H + \dfrac{v}{2}\,t - \dfrac{1}{2}\,g\,t^{2}`,
            R`t = \dfrac{2x}{\sqrt{3}\,v} \;\text{を代入して}\;\; y = H + \dfrac{x}{\sqrt{3}} - \dfrac{2g}{3v^{2}}\,x^{2}`
          ],
          n: R`時間 $t$ を消去して、高さ $y$ を位置 $x$ だけの式で表します。ついたての前面の位置 $x=s$ で、小球の高さ $y(s)$ がついたての上端の高さ $b$ より高いか低いかを調べるときに使います。`,
          easy: R`ついたてのところ（$x=s$）で、ボールの高さが $b$ より高ければ飛び越え、低ければぶつかります。そのために、ボールの高さを「位置 $x$ の式」にしておきます。$x=\dfrac{\sqrt{3}}{2}vt$ から $t=\dfrac{2x}{\sqrt{3}\,v}$ が分かるので、これを $y$ の式の $t$ に代入するだけです。`,
          lv: 2
        },
        {
          t: R`(2) 高さ $b$ を通る位置 $s_{1}$ と、床に落ちる位置 $s_{2}$`,
          m: [
            R`y = h' \;\Rightarrow\; \dfrac{2g}{3v^{2}}\,x^{2} - \dfrac{x}{\sqrt{3}} - (H - h') = 0`,
            R`x = \dfrac{\sqrt{3}\,v^{2}}{4g}\left(1 \pm \sqrt{1 + \dfrac{8g(H-h')}{v^{2}}}\right)`,
            R`s_{1}\;(h' = b):\quad \dfrac{\sqrt{3}\,v^{2}}{4g}\left(1 + \sqrt{1 + \dfrac{8g(H-b)}{v^{2}}}\right)`,
            R`s_{2}\;(h' = 0):\quad \dfrac{\sqrt{3}\,v^{2}}{4g}\left(1 + \sqrt{1 + \dfrac{8gH}{v^{2}}}\right)`
          ],
          n: R`軌道が高さ $h'$（$h'=b$ または $0$）を通る位置は、$y=h'$ とおいた $x$ の 2 次方程式の解です。$H>h'$ なので、解の公式の根号の中は $1$ より大きくなり、2 つの解のうち $x>0$ なのは $+$ の方だけです（$-$ の方は負で、打ち出す前の側にあたります）。$s<s_{1}$ のとき小球はついたての上端より高い所を通り、$s_{1}<s<s_{2}$ のとき下降中についたての前面に当たり、$s>s_{2}$ のときは前面に届く前に床に落ちます。`,
          fig: figLaunchSol(),
          pro: R`$s_{2}$ は、$H=0$ とおくと水平面上の射程 $\dfrac{\sqrt{3}\,v^{2}}{2g}$（公式 $\dfrac{v^{2}\sin2\theta}{g}$ で $\theta=30\degree$）に戻ります。この検算で、根号の中の係数 $8$ や符号のミスを見つけられます。`,
          lv: 1
        },
        {
          t: '(3) 弾性衝突：水平方向の運動量保存と反発係数',
          m: [
            R`u = \dfrac{\sqrt{3}}{2}\,v,\qquad mu = mw + MV`,
            R`V - w = u\quad(\text{弾性衝突：反発係数 }1)`,
            R`V = \dfrac{2m}{m+M}\,u = \dfrac{\sqrt{3}\,mv}{m+M},\qquad w = V - u = \dfrac{\sqrt{3}\,(m-M)\,v}{2(m+M)}`
          ],
          n: R`ついたての前面はなめらかなので、小球が受ける力は水平方向だけです。そこで、衝突直前の小球の速度の $x$ 成分を $u$、直後を $w$ として、水平方向だけで運動量保存を使います（台車は床の上をなめらかに動くので、水平方向には小球と台車の間の力しかはたらきません）。弾性衝突では、衝突前に近づいていた速さ $u$ と、衝突後に離れていく速さ $V-w$ が等しくなります（反発係数 $1$）。この 2 式を連立して $V$ と $w$ を求めます。`,
          easy: R`ぶつかる前と後で、横方向の「勢い（運動量 $=$ 質量 $\times$ 速度）」の合計は変わりません。また、弾性衝突では、ぶつかる前に近づいていた速さと、ぶつかった後に離れていく速さが等しくなります。この 2 つの関係式を連立方程式として解くと、台車の速さ $V$ と、小球のぶつかった後の速度 $w$ が決まります。なお、上下方向の速度は、ついたての前面がなめらかなので変わりません。`,
          pro: R`質量 $m$ の物体が静止した質量 $M$ の物体に弾性衝突するときの公式 $V=\dfrac{2m}{m+M}u,\ w=\dfrac{m-M}{m+M}u$ は暗記しておく価値があります。$m=M$ なら $w=0$（速度の交換）、$M\to\infty$ なら $w\to -u$（壁での跳ね返り）と、極限で検算できます。`,
          lv: 1
        },
        {
          t: '(4) 落下直前の速度の成分',
          m: [
            R`v_{x}' = w = \dfrac{\sqrt{3}\,(m-M)\,v}{2(m+M)}\quad(\text{落下まで一定})`,
            R`\dfrac{1}{2}\,m\,v_{y}'^{2} = \dfrac{1}{2}\,m\,v_{0y}^{2} + mgH \;\Rightarrow\; v_{y}' = -\sqrt{\dfrac{v^{2}}{4} + 2gH}`
          ],
          n: R`衝突後の小球には水平方向の力がはたらかないので、速度の $x$ 成分は $w$ のまま落下します。衝突は鉛直方向の運動に影響しないので、小球の鉛直方向の運動は、衝突があってもなくても同じです。打ち出した高さ $H$ から床（$y=0$）に着くまでの鉛直方向の力学的エネルギー保存から、床に着く直前の $y$ 成分の大きさが決まり、向きは下向き（負）です。`,
          easy: R`ついたての前面はなめらかなので、小球の上下方向の動きは衝突の影響を受けません。上下方向だけを見れば、小球は「高さ $H$ から、上向きの速さ $\dfrac{v}{2}$ で投げ上げられて、床に落ちる」運動をしているだけです。投げ上げて元の高さに戻ってきたときの速さは $\dfrac{v}{2}$（向きは下向き）で、そこからさらに高さ $H$ だけ落ちるので、$\dfrac{1}{2}mv_{y}'^{2}=\dfrac{1}{2}m\left(\dfrac{v}{2}\right)^{2}+mgH$ となります。`,
          pro: R`床に着く直前の鉛直方向の速さは、衝突の有無や台車の質量に関係なく $-\sqrt{(v/2)^{2}+2gH}$ と即答できます。衝突した高さ $y_{\mathrm{c}}$ での鉛直方向の速さ（$-\sqrt{(v/2)^{2}+2g(H-y_{\mathrm{c}})}$）は、途中の値にすぎません。`,
          lv: 1
        }
      ],
      tags: ['斜方投射', '軌道の式', '弾性衝突', '運動量保存', '選択式']
    },

    /* ================= 第3問（電磁気・半導体）文章 I・II は独立した別カード ================= */

    /* ---------- 第3問 I 荷電粒子の運動（静電気力とエネルギー） ---------- */
    {
      id: 'sk-p-2023-3-1',
      subject: 'physics',
      level: 'mid',
      unit: 'p-estat',
      title: '平行な極板の間を通る荷電粒子',
      source: src('第3問 I'),
      time: 8,
      body: R`水平に置いた 2 枚の広い金属板が、間隔 $d$ で向かい合っている。上の板を高電位にして、2 枚の板の間に電位差 $V$ を加える。板の間の電場は一様で、板の外側にはもれないものとする。質量 $m$、電気量 $q$（符号は不明）の粒子を、2 枚の板から等しい距離にある点 S から、板に平行に右向きの速さ $v_{0}$ で打ち込んだところ、粒子は下の板の側へ曲がり、点 T で下の板に達した（図の破線）。粒子にはたらく力は板の間の電場による力だけで、重力は無視できる。`,
      fig: figPlates(false),
      parts: [
        {
          label: '(1)',
          q: R`図の破線のように粒子が曲がったことから、この粒子の電気量 $q$ の符号と、板の間で粒子が受けている力の向きについて、正しいものはどれか。`,
          type: 'choice',
          choices: [
            R`$q<0$ であり、粒子は電場と同じ向きの力を受けている`,
            R`$q>0$ であり、粒子は電場と同じ向きの力を受けている`,
            R`$q>0$ であり、粒子は電場と逆向きの力を受けている`,
            R`$q<0$ であり、粒子は電場と逆向きの力を受けている`
          ],
          answer: 1,
          explain: R`粒子は下の板の側へ曲がったので、粒子が受ける力は下向きです。上の板が高電位なので、板の間の電場は上から下へ向かう**下向き**です。力が電場と同じ向きなので、粒子の電気量は**正**です。負の電荷は、電場と逆向きの力を受けます。`
        },
        {
          label: '(2)',
          q: R`板の間で粒子が受ける力の大きさ $F$ を表す式を選べ。`,
          type: 'choice',
          choices: [R`$qV$`, R`$\dfrac{qV}{2d}$`, R`$\dfrac{V}{qd}$`, R`$qVd$`, R`$\dfrac{qV}{d^{2}}$`, R`$\dfrac{qV}{d}$`],
          answer: 5,
          explain: R`(1) で $q>0$ と分かりました。板の間の電場の強さは $E=\dfrac{V}{d}$（一様な電場では、電位差 $=$ 電場の強さ $\times$ 距離）で、粒子が受ける力は $F=qE=\dfrac{qV}{d}$ です。$qV$ は仕事（エネルギー）の次元なので、距離 $d$ で割ってはじめて力になります。`
        },
        {
          label: '(3)',
          q: R`粒子が点 T で下の板に達する直前の速さ $v$ を表す式を選べ。`,
          type: 'choice',
          choices: [
            R`$\sqrt{v_0^{2}+\dfrac{qV}{2m}}$`,
            R`$\sqrt{v_0^{2}+\dfrac{qV}{m}}$`,
            R`$\sqrt{v_0^{2}+\dfrac{2qV}{m}}$`,
            R`$v_0$`,
            R`$\sqrt{v_0^{2}-\dfrac{qV}{m}}$`,
            R`$\sqrt{v_0^{2}+\dfrac{qV}{md}}$`
          ],
          answer: 1,
          explain: R`S は 2 枚の板の中央にあるので、S と下の板の電位差は $\dfrac{V}{2}$ です。S から T まで動く間に静電気力が粒子にする仕事は $q\times\dfrac{V}{2}$ で、これが運動エネルギーの増加に等しくなります。$\dfrac{1}{2}mv^{2}-\dfrac{1}{2}mv_{0}^{2}=\dfrac{qV}{2}$ より $v=\sqrt{v_{0}^{2}+\dfrac{qV}{m}}$ です。電位差を $V$ としてしまうと $\sqrt{v_{0}^{2}+\dfrac{2qV}{m}}$ になり、誤りです。`
        }
      ],
      solution: [
        {
          t: '軌跡の曲がり方から、力の向きと $q$ の符号を決める',
          n: R`物体は、力を受けると、その力の向きに軌跡が曲がります。粒子は S から右向きに入って下へ曲がったので、板の間で受ける力は**下向き**です。上の板が高電位（電池の $+$ 側）なので、板の間の電場は高電位から低電位へ向かう**下向き**です。力の向きが電場の向きと同じなので、粒子の電気量は**正**（$q>0$）です。`,
          easy: R`電場は「正の電気を押す向き」を表す矢印です。正の電気は電場の向きに、負の電気は電場と逆向きに押されます。ここでは、電場は下向き（高電位の上の板から、低電位の下の板へ）で、粒子は下向きに押されています。押される向きと電場の向きが同じなので、粒子は正の電気をもっています。ボールを横に投げると重力の向き（下）へ曲がるのと同じで、力を受けた向きに軌跡が曲がります。`,
          fig: figPlates(true),
          lv: 1
        },
        {
          t: '(2) 板の間の電場と、粒子が受ける力',
          m: [R`E = \dfrac{V}{d}`, R`F = qE = \dfrac{qV}{d}`],
          n: R`間隔 $d$ の 2 枚の板の間に電位差 $V$ を加えると、板の間には一様な電場ができ、その強さは $E=\dfrac{V}{d}$ です。電気量 $q$ の粒子が電場から受ける力の大きさは $qE$ なので、$F=\dfrac{qV}{d}$ です。この力は、粒子が板の間にいるあいだ、大きさも向き（下向き）も変わりません。`,
          easy: R`一様な電場は、「$1\,\mathrm{m}$ 進むごとに電位が $E$ ずつ変わる」場所です。電位差 $V$ を距離 $d$ で割れば、$1\,\mathrm{m}$ あたりの電位の変化 $E=\dfrac{V}{d}$ が出ます（単位は $\mathrm{V/m}$）。電気量 $q$ の粒子は、電場から $qE$ の力を受けます（電場 $=$ 電気量 $1\,\mathrm{C}$ あたりの力）。`,
          lv: 1
        },
        {
          t: '(3) 仕事とエネルギーの関係で、T に達する直前の速さを求める',
          m: [
            R`\text{S と下の板の電位差} = \dfrac{V}{2}`,
            R`\dfrac{1}{2}mv^{2} - \dfrac{1}{2}mv_{0}^{2} = q\times\dfrac{V}{2}`,
            R`v = \sqrt{v_{0}^{2} + \dfrac{qV}{m}}`
          ],
          n: R`S は 2 枚の板の中央にあるので、S から下の板までの電位差は、板の間の電位差 $V$ のちょうど半分の $\dfrac{V}{2}$ です。電位差 $\Delta\varphi$ の間を電気量 $q$ の粒子が動くと、静電気力は $q\,\Delta\varphi$ の仕事をし、その分だけ運動エネルギーが増えます。重力は無視できるので、これが運動エネルギーの変化のすべてです。`,
          easy: R`電位は「電気的な高さ」のようなものです。ボールが高さ $h$ の差だけ落ちると $mgh$ の運動エネルギーが増えるのと同じように、電気量 $q$ の粒子が電位差 $\Delta\varphi$ だけ「電気的に落ちる」と、$q\,\Delta\varphi$ の運動エネルギーが増えます。粒子は 2 枚の板の真ん中から下の板まで動くので、落ちる電位差は全体の半分の $\dfrac{V}{2}$ です。`,
          pro: R`別解：加速度 $a=\dfrac{qV}{md}$ の等加速度運動で、下向きに $\dfrac{d}{2}$ 進んだときの下向きの速さは $v_{y}=\sqrt{2a\cdot\dfrac{d}{2}}=\sqrt{\dfrac{qV}{m}}$。板に平行な速さ $v_{0}$ は変わらないので、$v=\sqrt{v_{0}^{2}+v_{y}^{2}}$ で同じ結果になります。仕事とエネルギーの関係を使うと、板の長さや時間を使わずに求められます。`,
          lv: 1
        }
      ],
      tags: ['静電気力', '一様な電場', '電位差と仕事', 'エネルギー保存', '選択式']
    },

    /* ---------- 第3問 II ダイオードと回路 ---------- */
    {
      id: 'sk-p-2023-3-2',
      subject: 'physics',
      level: 'mid',
      unit: 'p-circuit',
      title: 'ダイオードの整流作用と回路の電流',
      source: src('第3問 II'),
      time: 8,
      body: R`図の上は、電圧 $2.0\,\mathrm{V}$ の電池 E に、$10\,\Omega$ の抵抗 R とダイオード D を直列につないだ回路である（電池の内部抵抗は考えない）。ダイオードは p 型半導体と n 型半導体を接合してつくる素子で、図の下のグラフは、D に加わる電圧 $V$ と D を流れる電流 $I$ の関係（D の特性）を示している。`,
      fig: stack([figDiodeCircuit(), figDiodeGraph()], 6),
      parts: [
        {
          label: '(1)',
          q: R`次の文中の空欄 **ア**〜**エ** に当てはまる語句の組合せはどれか。

p 型半導体で電流を運ぶ主なキャリアは **ア** である。ダイオードの p 型側を電池の正極に、n 型側を負極につなぐ電圧のかけ方を **イ** といい、このとき電流は **ウ**。逆に p 型側を負極に、n 型側を正極につなぐと、キャリアの少ない領域（空乏層）が **エ** ので、電流はほとんど流れない。`,
          type: 'choice',
          choices: [
            R`ア：自由電子　　イ：順方向　　ウ：流れやすい　　エ：狭まる`,
            R`ア：ホール（正孔）　　イ：逆方向　　ウ：流れにくい　　エ：狭まる`,
            R`ア：ホール（正孔）　　イ：順方向　　ウ：流れやすい　　エ：広がる`,
            R`ア：自由電子　　イ：逆方向　　ウ：流れにくい　　エ：広がる`
          ],
          answer: 2,
          explain: R`p 型半導体のキャリアは正の電気を運ぶホール（正孔）、n 型半導体のキャリアは自由電子です。p 型側を電池の正極につなぐ向きが順方向で、正極に押されたホールと負極に押された自由電子が、どちらも接合部へ向かって動きます。キャリアの少ない領域（空乏層）がせまくなるので、電流が流れやすくなります。逆方向では、ホールは負極へ、電子は正極へ引き寄せられて接合部から離れ、空乏層が広がるので、電流はほとんど流れません。`
        },
        {
          label: '(2)',
          q: R`図の回路に流れる電流 $I$ は何 $\mathrm{A}$ か。`,
          type: 'num',
          answer: 0.12,
          rel: 0.05,
          unit: 'A',
          hint: R`小数で入力（例: 0.25）`,
          explain: R`ダイオードにかかる電圧を $V$ とすると、$E=V+RI$ より $I=\dfrac{2.0-V}{10}$。この直線（負荷直線）を特性のグラフに重ねると、$V=0.80\,\mathrm{V}$、$I=0.12\,\mathrm{A}$ で曲線と交わります（確かめ：$0.80+10\times0.12=2.0\,\mathrm{V}$）。ダイオードにはオームの法則が使えないので、抵抗 $10\,\Omega$ に $2.0\,\mathrm{V}$ がかかるとして $0.20\,\mathrm{A}$ とするのは誤りです。`
        },
        {
          label: '(3)',
          q: R`このとき、抵抗器で消費される電力は何 $\mathrm{W}$ か。`,
          type: 'num',
          answer: 0.144,
          rel: 0.09,
          unit: 'W',
          hint: R`小数で入力（例: 0.25）`,
          explain: R`抵抗器にかかる電圧は $RI=10\times0.12=1.2\,\mathrm{V}$ で、消費電力は $P=IV_{R}=I^{2}R=0.12^{2}\times10=0.144\approx0.14\,\mathrm{W}$ です。`
        }
      ],
      solution: [
        {
          t: '(1) ダイオードの整流作用',
          n: R`p 型半導体の主なキャリアは正の電気を運ぶ**ホール（正孔）**、n 型の主なキャリアは**自由電子**です。p 型側を電池の正極につなぐ向き（順方向）では、正極に押されたホールと、負極に押された自由電子が、どちらも接合部へ向かって動きます。接合部のキャリアの少ない領域（空乏層）がせまくなり、キャリアが接合部を行き来できるので、電流が流れやすくなります。逆に p 型側を負極につなぐ向き（逆方向）では、ホールは負極へ、電子は正極へ引き寄せられて接合部から離れ、空乏層が広がるので、電流はほとんど流れません。`,
          easy: R`半導体には、電気を運ぶ粒（キャリア）が 2 種類あります。p 型では、電子が抜けた「穴」であるホールが、正の電気をもつ粒として動きます。n 型では、自由に動ける電子が負の電気を運びます。接合部のまわりには、粒のほとんどいない「空乏層」という、電気を通しにくい領域ができています。p 側に電池の $+$、n 側に $-$ をつなぐと、ホールも電子も接合部へ押されて空乏層がせまくなり、電流が流れます。逆につなぐと、粒が接合部から引き離されて空乏層が広がり、電流が流れません。この「一方向にだけ電流を流す」はたらきを整流作用といいます。`,
          lv: 1
        },
        {
          t: '(2) 電池の電圧の分かれ方から、グラフ上の直線を作る',
          m: [R`E = V + RI`, R`I = \dfrac{E - V}{R} = \dfrac{2.0 - V}{10}`],
          n: R`ダイオードにかかる電圧を $V$、流れる電流を $I$ とします。電池の電圧 $E$ は、ダイオードの電圧 $V$ と抵抗器の電圧 $RI$ に分かれます（キルヒホッフの第 2 法則）。ダイオードでは $I$ と $V$ が比例しない（オームの法則が使えない）ので、この関係式をグラフに書き込んで、特性曲線との交点を読み取ります。`,
          easy: R`抵抗器なら、電流は電圧に比例しました。ダイオードは「$0.6\,\mathrm{V}$ くらいまではほとんど電流が流れず、それを超えると急に流れる」という性質で、式だけでは電流が決まりません。そこで、グラフを使います。「電池の電圧 $=$ ダイオードの電圧 $+$ 抵抗器の電圧」という関係は、グラフの上では 1 本の直線になります。この直線とダイオードの曲線が交わる点が、回路で実際に成り立つ $V$ と $I$ の組です。`,
          lv: 1
        },
        {
          t: '直線を引いて交点を読む',
          m: [
            R`V = 0.60\,\mathrm{V} \Rightarrow I = \dfrac{2.0 - 0.60}{10} = 0.14\,\mathrm{A}`,
            R`V = 1.0\,\mathrm{V} \Rightarrow I = \dfrac{2.0 - 1.0}{10} = 0.10\,\mathrm{A}`,
            R`\text{交点：}\;\; V = 0.80\,\mathrm{V},\quad I = 0.12\,\mathrm{A}`
          ],
          n: R`直線上の 2 点（グラフの範囲に入る点を選びます）を結ぶと、特性曲線とちょうど $V=0.80\,\mathrm{V}$、$I=0.12\,\mathrm{A}$ で交わります。確かめとして、$0.80+10\times0.12=2.0\,\mathrm{V}$ となり、電池の電圧に一致します。したがって、回路に流れる電流は $0.12\,\mathrm{A}$ です。`,
          fig: figDiodeSol(),
          pro: R`ダイオードを含む回路は、「回路の式（負荷直線）をグラフに重ねて交点を読む」のが定石です。直線は、$V=0$ のとき $I=\dfrac{E}{R}$、$I=0$ のとき $V=E$ の 2 点を結んで引けますが、グラフの範囲外になるときは範囲内の別の 2 点を使います。`,
          lv: 1
        },
        {
          t: '(3) 抵抗器で消費される電力',
          m: [R`V_{R} = RI = 10\times0.12 = 1.2\,\mathrm{V}`, R`P = IV_{R} = I^{2}R = 0.12^{2}\times10 = 0.144 \approx 0.14\,\mathrm{W}`],
          n: R`抵抗器の消費電力は、流れる電流と抵抗器の電圧の積 $P=IV_{R}$、または $P=I^{2}R$ で求めます。電流は (2) の $0.12\,\mathrm{A}$ です。`,
          easy: R`「電力 = 電圧 × 電流」で、1 秒あたりに使われるエネルギー（単位は $\mathrm{W}$）を表します。抵抗器の電圧は、オームの法則で $RI=10\times0.12=1.2\,\mathrm{V}$ なので、$1.2\times0.12=0.144\,\mathrm{W}$ になります。ちなみに電池の供給電力は $2.0\times0.12=0.24\,\mathrm{W}$ で、抵抗器とダイオードの消費電力（$0.144+0.80\times0.12=0.24$）の合計に等しくなります。`,
          lv: 2
        }
      ],
      tags: ['半導体', 'ダイオード', '整流作用', '負荷直線', 'グラフの読み取り', '数値・選択式']
    },

    /* ================= 第4問（熱力学）================= */

    /* ---------- 第4問 二原子分子理想気体の矩形サイクル ---------- */
    {
      id: 'sk-p-2023-4',
      subject: 'physics',
      level: 'mid',
      unit: 'p-thermo1',
      title: '矩形サイクルの仕事と熱効率',
      source: src('第4問'),
      time: 12,
      body: R`二原子分子の理想気体を、なめらかに動くピストンつきのシリンダーに閉じ込めて、ゆっくりと状態を変化させる。気体の圧力 $p$ と体積 $V$ は、図の長方形に沿って A→B→C→D→A の順に変化し、もとの状態にもどる。図の $p_{0}$ は $2.0\times10^{5}\,\mathrm{Pa}$、$V_{0}$ は $5.0\times10^{-3}\,\mathrm{m^{3}}$ で、最も温度の低い状態 D での気体の温度は $200\,\mathrm{K}$ である。気体定数を $8.31\,\mathrm{J/(mol\cdot K)}$、この気体の定積モル比熱を $\dfrac{5}{2}R$ として、この 1 周をくり返す熱機関について、次の問いに答えよ。数値は有効数字 2 桁で求めること。`,
      fig: figCycle(),
      parts: [
        {
          label: '(1)',
          q: R`容器内の気体の物質量 $n$ は何 $\mathrm{mol}$ か。`,
          type: 'num',
          answer: 0.60,
          rel: 0.02,
          unit: 'mol',
          explain: R`状態 D について状態方程式 $pV=nRT$ を使うと、$p_{0}V_{0}=1.0\times10^{3}\,\mathrm{J}$ より、$$n=\dfrac{p_{0}V_{0}}{RT_{\mathrm{D}}}=\dfrac{1.0\times10^{3}}{8.31\times200}=0.60\,\mathrm{mol}$$ です。`
        },
        {
          label: '(2)',
          q: R`状態 B での気体の温度 $T_{\mathrm{B}}$ は何 $\mathrm{K}$ か。`,
          type: 'num',
          answer: 1200,
          rel: 0.02,
          unit: 'K',
          show: R`1.2\times10^{3}`,
          hint: R`指数の入力例: 2.4e3（2400 でも可）`,
          explain: R`物質量が一定なので $\dfrac{pV}{T}$ は一定です。D から B へ「圧力 × 体積」は $3\times2=6$ 倍になるので、$T_{\mathrm{B}}=6\times200=1.2\times10^{3}\,\mathrm{K}$ です。`
        },
        {
          label: '(3)',
          q: R`1 周のあいだに、気体が外部へ行う正味の仕事を $W$ とする。$W$ は何 $\mathrm{J}$ か。`,
          type: 'num',
          answer: 2000,
          rel: 0.02,
          unit: 'J',
          show: R`2.0\times10^{3}`,
          hint: R`指数の入力例: 2.4e3（2400 でも可）`,
          explain: R`正味の仕事は、$p$-$V$ 図で囲まれた長方形の面積です。たて $3p_{0}-p_{0}=2p_{0}$、よこ $2V_{0}-V_{0}=V_{0}$ より、$$W=2p_{0}V_{0}=2\times(1.0\times10^{3})=2.0\times10^{3}\,\mathrm{J}$$ です（$p_{0}V_{0}=1.0\times10^{3}\,\mathrm{J}$ は (1) で使った値）。`
        },
        {
          label: '(4)',
          q: R`この 1 周のうち、気体が外部から熱を受け取る過程をすべて選べ。`,
          type: 'multi',
          choices: [R`A→B`, R`B→C`, R`C→D`, R`D→A`],
          answer: [0, 3],
          explain: R`熱力学第一法則 $Q=\Delta U+W$ を過程ごとに調べます。A→B は膨張（$W>0$）で温度上昇（$\Delta U>0$）なので吸熱。B→C は体積一定で圧力が下がる（温度低下、$\Delta U<0$、$W=0$）ので放熱。C→D は圧縮（$W<0$）で温度低下なので放熱。D→A は体積一定で圧力が上がる（温度上昇、$\Delta U>0$、$W=0$）ので吸熱です。`
        },
        {
          label: '(5)',
          q: R`(4) で選んだ 2 つの過程で、気体が受け取る熱量の合計 $Q_{\mathrm{in}}$ は何 $\mathrm{J}$ か。`,
          type: 'num',
          answer: 15500,
          rel: 0.02,
          unit: 'J',
          show: R`1.55\times10^{4}`,
          hint: R`指数の入力例: 2.4e3（2400 でも可）`,
          explain: R`$p_{0}V_{0}=1.0\times10^{3}\,\mathrm{J}$ を単位に数えます。A→B は定圧変化（$Q=nC_{p}\Delta T=\dfrac{7}{2}\Delta(pV)$）で、$$Q_{\mathrm{AB}}=\dfrac{7}{2}\times3p_{0}V_{0}=1.05\times10^{4}\,\mathrm{J}$$ D→A は定積変化（$Q=nC_{V}\Delta T=\dfrac{5}{2}\Delta(pV)$）で、$$Q_{\mathrm{DA}}=\dfrac{5}{2}\times2p_{0}V_{0}=5.0\times10^{3}\,\mathrm{J}$$ 合計は $1.55\times10^{4}\,\mathrm{J}$ です。`
        },
        {
          label: '(6)',
          q: R`このサイクルの熱効率 $e=\dfrac{W}{Q_{\mathrm{in}}}$ を求めよ。`,
          type: 'num',
          answer: 0.13,
          rel: 0.03,
          hint: R`小数で入力（例: 0.25）`,
          explain: R`$$e=\dfrac{W}{Q_{\mathrm{in}}}=\dfrac{2.0\times10^{3}}{1.55\times10^{4}}=0.129\approx0.13$$ つまり、受け取った熱の約 $13\,\%$ を仕事に変えています。`
        }
      ],
      solution: [
        {
          t: '(1) 理想気体の状態方程式から物質量を求める',
          m: [
            R`pV = nRT \;\Rightarrow\; n = \dfrac{p_{0}V_{0}}{R\,T_{\mathrm{D}}}`,
            R`p_{0}V_{0} = (2.0\times10^{5})\times(5.0\times10^{-3}) = 1.0\times10^{3}\,\mathrm{J}`,
            R`n = \dfrac{1.0\times10^{3}}{8.31\times200} = 0.60\,\mathrm{mol}`
          ],
          n: R`状態 D の圧力・体積・温度がすべて分かっているので、理想気体の状態方程式にそのまま代入します。1 サイクルのあいだ気体の量は変わらないので、この $n$ はどの状態でも共通です。`,
          easy: R`気体の「圧力 × 体積」は、「物質量 × 気体定数 × 温度」に等しい、というのが状態方程式です。圧力 $p_{0}$・体積 $V_{0}$・温度 $200\,\mathrm{K}$ の 3 つが分かっているので、残りの未知数 $n$ が求まります。単位は、圧力は $\mathrm{Pa}$、体積は $\mathrm{m^{3}}$、温度は $\mathrm{K}$ にそろえてから代入します。`,
          lv: 1
        },
        {
          t: '(2) 状態 B の温度',
          m: [
            R`\dfrac{p_{\mathrm{B}}V_{\mathrm{B}}}{T_{\mathrm{B}}} = nR = \dfrac{p_{0}V_{0}}{T_{\mathrm{D}}}`,
            R`T_{\mathrm{B}} = T_{\mathrm{D}}\times\dfrac{3p_{0}\times 2V_{0}}{p_{0}\times V_{0}}`,
            R`= 6\,T_{\mathrm{D}} = 1.2\times10^{3}\,\mathrm{K}`
          ],
          n: R`物質量が一定なので $\dfrac{pV}{T}$ は一定です（ボイル・シャルルの法則）。状態 B の圧力は D の 3 倍、体積は 2 倍なので、温度は $3\times2=6$ 倍です。同様に、A は $3T_{\mathrm{D}}=600\,\mathrm{K}$、C は $2T_{\mathrm{D}}=400\,\mathrm{K}$ です。`,
          easy: R`物質量が同じなら、温度は「圧力 × 体積」に比例します。D と比べて、B は圧力が $3$ 倍、体積が $2$ 倍なので、「圧力 × 体積」は $6$ 倍で、温度も $6$ 倍になります。比をとるのは絶対温度（K）です。セルシウス温度では比になりません。`,
          lv: 1
        },
        {
          t: '(3) 1 サイクルの仕事は、$p$-$V$ 図で囲まれた面積',
          m: [
            R`W = (3p_{0} - p_{0})(2V_{0} - V_{0}) = 2p_{0}V_{0}`,
            R`= 2\times(2.0\times10^{5})\times(5.0\times10^{-3}) = 2.0\times10^{3}\,\mathrm{J}`
          ],
          n: R`気体が外部にする仕事は、$p$-$V$ 図の曲線の下の面積に等しく、膨張（右向き）なら正、圧縮（左向き）なら負です。時計まわりのサイクルでは、膨張のときの仕事 $+3p_{0}V_{0}$（A→B）が、圧縮のときの仕事 $-p_{0}V_{0}$（C→D）より大きく、差し引きで、囲まれた長方形の面積が正味の仕事になります。体積が変わらない辺（B→C、D→A）の仕事は $0$ です。`,
          easy: R`$p$-$V$ 図では、「横に動いた距離（体積の変化）× そのときの圧力」が仕事です。A→B は圧力 $3p_{0}$ のまま体積が $V_{0}$ だけ増える（仕事 $+3p_{0}V_{0}$）、C→D は圧力 $p_{0}$ のまま体積が $V_{0}$ だけ減る（仕事 $-p_{0}V_{0}$）、縦に動く辺では体積が変わらないので仕事は $0$ です。足し合わせると $2p_{0}V_{0}$ で、これは長方形の面積（たて $2p_{0}$ × よこ $V_{0}$）と同じです。`,
          pro: R`サイクルの正味の仕事は囲まれた面積。時計まわりなら正（熱機関）、反時計まわりなら負（冷凍機・ヒートポンプ）。`,
          lv: 1
        },
        {
          t: R`各過程での内部エネルギーの変化 $\Delta U$`,
          m: [
            R`\Delta U = nC_{V}\Delta T = \dfrac{5}{2}\,nR\,\Delta T = \dfrac{5}{2}\,\Delta(pV)`,
            R`p_{0}V_{0} = (2.0\times10^{5})\times(5.0\times10^{-3}) = 1.0\times10^{3}\,\mathrm{J}`
          ],
          n: R`二原子分子の理想気体では $C_{V}=\dfrac{5}{2}R$ なので、内部エネルギーの変化は温度変化に比例します。また $nR\Delta T=\Delta(pV)$ なので、各状態の「圧力 × 体積」の差から、温度を経由せずに $\Delta U$ を求められます。`,
          easy: R`理想気体の内部エネルギーは、温度だけで決まります（温度が上がれば増え、下がれば減ります）。「圧力 × 体積」は温度に比例するので、$p$-$V$ 図で「圧力 × 体積」が増える過程では、内部エネルギーも増えます。この問題では $p_{0}V_{0}=1.0\times10^{3}\,\mathrm{J}$ を単位にして数えると楽です。たとえば D→A は、「圧力 × 体積」が $p_{0}V_{0}$ から $3p_{0}V_{0}$ に $2p_{0}V_{0}$ だけ増えるので、$\Delta U=\dfrac{5}{2}\times2p_{0}V_{0}=5.0\times10^{3}\,\mathrm{J}$ です。`,
          lv: 2
        },
        {
          t: '(4) 各過程の熱量（熱力学第一法則）',
          m: [
            R`Q = \Delta U + W\qquad(W\text{：気体が外部にする仕事})`,
            R`\text{以下、単位は}\ 10^{3}\,\mathrm{J}\ \text{とする}`,
            R`\mathrm{A}\to\mathrm{B}:\;\; W = 3.0,\;\; \Delta U = 7.5,\;\; Q = 10.5\;\;(\text{吸収})`,
            R`\mathrm{B}\to\mathrm{C}:\;\; W = 0,\;\; \Delta U = -10.0,\;\; Q = -10.0\;\;(\text{放出})`,
            R`\mathrm{C}\to\mathrm{D}:\;\; W = -1.0,\;\; \Delta U = -2.5,\;\; Q = -3.5\;\;(\text{放出})`,
            R`\mathrm{D}\to\mathrm{A}:\;\; W = 0,\;\; \Delta U = 5.0,\;\; Q = 5.0\;\;(\text{吸収})`
          ],
          n: R`熱力学第一法則 $Q=\Delta U+W$ を過程ごとに使います。A→B は膨張して仕事をしながら温度も上がるので、必ず吸熱です。B→C は体積一定のまま圧力が下がる（温度が下がる）ので放熱、C→D は圧縮されて仕事をされ、温度も下がるので放熱、D→A は体積一定のまま圧力が上がる（温度が上がる）ので吸熱です。したがって、吸熱の過程は **A→B と D→A** です。検算として、4 つの $\Delta U$ の和は $0$、$W$ の和は $2.0\times10^{3}\,\mathrm{J}$、$Q$ の和も $2.0\times10^{3}\,\mathrm{J}$ で、$\Delta U=0$ の 1 サイクルでは $Q=W$ になっています。`,
          easy: R`第一法則は、「もらった熱 $Q$ は、気体の内部エネルギーを増やす（$\Delta U$）か、外に仕事をする（$W$）のどちらかに使われる」という、エネルギーの収支の式です。体積が増える（膨張する）ときは $W>0$、減る（圧縮される）ときは $W<0$、体積が変わらないときは $W=0$。温度が上がる過程では $\Delta U>0$、下がる過程では $\Delta U<0$ です。`,
          pro: R`体積一定なら $Q=\Delta U$、圧力一定なら $Q=\Delta U+p\Delta V=nC_{p}\Delta T$（$C_{p}=\dfrac{7}{2}R$）。A→B なら $Q=\dfrac{7}{2}\Delta(pV)=\dfrac{7}{2}\times3p_{0}V_{0}=1.05\times10^{4}\,\mathrm{J}$ と一発で出せます。`,
          lv: 1
        },
        {
          t: '(5)(6) 吸収する熱量の合計と熱効率',
          m: [
            R`Q_{\mathrm{in}} = Q_{\mathrm{AB}} + Q_{\mathrm{DA}}`,
            R`= 1.05\times10^{4} + 5.0\times10^{3} = 1.55\times10^{4}\,\mathrm{J}`,
            R`e = \dfrac{W}{Q_{\mathrm{in}}} = \dfrac{2.0\times10^{3}}{1.55\times10^{4}}`,
            R`= 0.129 \approx 0.13`
          ],
          n: R`熱効率は、吸収した熱量のうち、何割を仕事に変えたかを表します。放出した熱量（B→C と C→D の合計 $1.35\times10^{4}\,\mathrm{J}$）は含めず、吸収した熱量だけを分母にします。放出した熱量との間には $Q_{\mathrm{in}}-Q_{\mathrm{out}}=W$（$1.55\times10^{4}-1.35\times10^{4}=2.0\times10^{3}\,\mathrm{J}$）が成り立っています。`,
          easy: R`熱機関は、高温の側から熱をもらって、その一部を仕事にして、残りを低温の側へ捨てています。熱効率は「もらった熱のうち、仕事にできた割合」です。ここでは、もらった熱 $1.55\times10^{4}\,\mathrm{J}$ のうち仕事になったのが $2.0\times10^{3}\,\mathrm{J}$ なので、約 $13\,\%$ です。`,
          lv: 1
        }
      ],
      tags: ['熱力学第一法則', 'p-V図', '熱サイクル', '熱効率', '数値・選択式']
    }
  ]);
})();
