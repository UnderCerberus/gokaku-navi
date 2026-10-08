/* 物理・電磁気 — 電流と磁場: 電流がつくる磁場 / 磁場中の電流が受ける力 / ローレンツ力と円運動
   構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  // 有効数字 3 桁の四捨五入（2.275 のようにちょうど半端な値は 2.28 に切り上げる）。
  // 答え（ans）と解説の表示（sig）は必ずこの 1 つの丸めを通す。toPrecision や toFixed は 2 進数の誤差で
  // 半端な値を 2 通りに割ってしまい、答えと解説の数値が 1 ずれる
  function rd3(x) {
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return x;
    const a = Math.abs(Number(x.toPrecision(12)));
    const e = Math.floor(Math.log10(a)) - 2;
    const m = Math.round(Number((a / Math.pow(10, e)).toPrecision(12)));
    return (x < 0 ? -1 : 1) * Number(m + 'e' + e);
  }
  const sig = (x) => U.sig(rd3(x), 3);
  const un = (s) => R`\,\mathrm{` + s + '}';
  const ans = rd3;
  const MU0 = 4 * Math.PI * 1e-7;   // 真空の透磁率 [N/A²]
  const QE = 1.6e-19;               // 電気素量 [C]
  const ME = 9.1e-31;               // 電子の質量 [kg]
  const MP = 1.67e-27;              // 陽子の質量 [kg]
  const MA = 6.64e-27;              // α粒子の質量 [kg]
  const AMU = 1.66e-27;             // 原子質量単位 [kg]
  const C0 = 3.0e8;                 // 光速 [m/s]
  const G = 9.8;                    // 重力加速度 [m/s²]

  // 入力値の表示用: 与えた値をそのまま（有効数字 12 桁で、浮動小数点の誤差だけを除く）。10 万以上・0.001 未満は指数表記。
  // 4 桁で丸めると、4 桁を超える入力で解説の式が表示の結果と合わなくなる
  function nice(x) {
    if (!isFinite(x) || x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12);
    if (e >= -3 && e <= 4) return String(Number(x.toPrecision(12)));
    let m = Number((x / Math.pow(10, e)).toPrecision(12)), ee = e;
    if (Math.abs(m) >= 10) { m /= 10; ee += 1; }
    return m + R` \times 10^{` + ee + '}';
  }
  // 途中の値 x を次の式に代入して見せるときの桁数を決める。ok(v) は「丸めた値 v を代入して、表示どおりに計算し直すと
  // 表示する結果と一致する」かを返す関数。有効数字 3 桁で足りればそのまま、足りなければ 1 桁ずつ増やす（上限 9 桁）。
  // 3 桁に丸め直した値が x を直接 3 桁にした値と変わってしまう桁数（二重丸め）は使わない
  function carry(x, ok) {
    const want = rd3(x);
    let last = { k: 3, v: want, t: U.sig(want, 3) };
    for (let k = 3; k <= 9; k++) {
      const v = U.roundSig(x, k);
      if (rd3(v) !== want) continue;
      last = { k: k, v: v, t: U.sig(v, k) };
      if (ok(v)) return last;
    }
    return last;      // どの桁でも合わないとき（結果がちょうど丸めの境目 3.575 など）は、いちばん細かい桁で見せる
  }
  // 途中の値の表示。4 桁以上なら「1.592 ≒ 1.59」のように、丸める前の値のあとに 3 桁の値を添える
  const ext = (c) => (c.k > 3 ? c.t + R` \fallingdotseq ` + U.sig(c.v, 3) : c.t);
  // 問題文・図ラベル用: 有効数字 2 桁（ちょうど表せないときだけ 3 桁）。6 → 6.0
  function sf(x) {
    if (x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12);
    if (e >= 5 || e <= -3) {
      const m = x / Math.pow(10, e);
      const s1 = m.toFixed(1);
      return (Math.abs(Number(s1) - m) <= 1e-9 * Math.abs(m) ? s1 : m.toFixed(2)) + R` \times 10^{` + e + '}';
    }
    for (const n of [2, 3]) {
      const d = Math.max(0, n - 1 - e), s = x.toFixed(d);
      if (n === 3 || Math.abs(Number(s) - x) <= 1e-9 * Math.abs(x)) return s;
    }
    return String(x);
  }
  const SUPS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const toPlain = (t) => t.replace(/ \\times 10\^\{(-?\d+)\}/, (m, e) => '×10' + String(e).split('').map((c) => SUPS[c] || c).join(''));
  const tx = (x) => toPlain(sf(x));      // 図ラベル用プレーンテキスト（有効数字 2〜3 桁）
  const tx3 = (x) => toPlain(sig(x));    // 同（有効数字 3 桁）
  // 問題文に書く数値は有効数字 3 桁以内で正確に表せること（丸めると解答値とずれるため）
  const ok3 = (x) => Math.abs(Number(x.toPrecision(3)) - x) <= 1e-9 * Math.abs(x);
  function numPart(label, q, x, unit, o) {
    const a = ans(x), p = { label: label, q: q, type: 'num', answer: a, rel: 0.02, unit: unit }, ax = Math.abs(a);
    if (ax !== 0 && (ax < 1e-3 || ax >= 1e5)) { p.show = sig(a); p.hint = '例: 4.7e-12 や 4.7*10^-12 の形で入力'; }
    return Object.assign(p, o || {});
  }
  // 画面上で反時計回りに角 a（ラジアン）が増える極座標
  const pol = (cx, cy, r, a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  // 紙面の裏→表（⊙）か、表→裏（⊗）の記号
  function outIn(d, x, y, out, r, cls) {
    cls = cls || 'fg';
    d.circle(x, y, r, { cls: cls, fill: 'f0' });
    if (out) d.dot(x, y, { cls: cls, r: Math.max(1.5, r * 0.28) });
    else {
      const k = r * 0.62;
      d.line(x - k, y - k, x + k, y + k, { cls: cls, w: 1.3 });
      d.line(x - k, y + k, x + k, y - k, { cls: cls, w: 1.3 });
    }
  }
  // 図の右側などに文字を縦に並べる
  function panel(d, x, y, lines) {
    lines.forEach((ln, i) => d.text(x, y + i * 21, ln[0], { anchor: 'start', cls: ln[1] || 'fg' }));
  }
  // 両端に矢じりのある寸法線
  function dimLine(d, x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    d.arrow(mx, my, x1, y1, { cls: 'dim', w: 1.2 });
    d.arrow(mx, my, x2, y2, { cls: 'dim', w: 1.2 });
  }
  // 荷電粒子の記号（正: 琥珀色 / 負: シアン）
  function chargeSym(d, x, y, pos, rad) {
    d.circle(x, y, rad || 9, { cls: pos ? 'c3' : 'c1', fill: pos ? 'f3' : 'f1' });
    d.text(x, y + 4, pos ? '+' : '−', { bold: true, size: 12 });
  }
  const MU0TXT = R`真空の透磁率を $\mu_{0} = 4\pi \times 10^{-7}\,\mathrm{N/A^{2}}$、円周率を $\pi = 3.14$ とする。`;
  const PI314 = 3.14;               // 演習で問題文に書く円周率（答え・解説も同じ値で計算する）

  /* =====================================================================
     1. 電流がつくる磁場（直線電流・円形電流・ソレノイド）
     ===================================================================== */

  // pi: 円周率（演習では問題文どおり 3.14 を渡す。省略すると Math.PI）。μ₀ = 4π × 10⁻⁷ にも同じ π を使う
  function solveField(kind, I, r, N, n, pi) {
    const PI = pi || Math.PI;
    let H;
    if (kind === 'line') H = I / (2 * PI * r);
    else if (kind === 'circle') H = N * I / (2 * r);
    else H = n * I;
    return { H: H, B: 4 * PI * 1e-7 * H };
  }

  // 直線電流: 導線の断面（紙面に垂直な電流）と同心円状の磁場。s = null なら H, B を図に書かない（演習用）
  function figLine(out, p, s) {
    const d = JK.plot.draw(380, 236);
    const cx = 108, cy = 112, sg = out ? 1 : -1;
    [30, 62, 92].forEach((rr, i) => {
      const hi = i === 1, cls = hi ? 'c1' : 'dim';
      d.circle(cx, cy, rr, { cls: cls, w: hi ? 1.8 : 1 });
      [1.7, 4.4].forEach((a0) => {
        const a = a0 + i * 0.45, q = pol(cx, cy, rr, a), tX = -Math.sin(a) * sg, tY = -Math.cos(a) * sg;
        d.arrow(q[0] - tX * 6, q[1] - tY * 6, q[0] + tX * 8, q[1] + tY * 8, { cls: cls, w: 1.4 });
      });
    });
    const a = 0.55, P = pol(cx, cy, 62, a), tX = -Math.sin(a) * sg, tY = -Math.cos(a) * sg;
    d.line(cx, cy, P[0], P[1], { cls: 'dim', dash: true, w: 1 });
    const mid = pol(cx, cy, 33, a);
    d.text(mid[0] + 2, mid[1] + 15, 'r', { italic: true });
    d.dot(P[0], P[1], { cls: 'c3', r: 3 });
    d.text(P[0] + 7, P[1] + 15, 'P', { italic: true });
    d.arrow(P[0], P[1], P[0] + tX * 36, P[1] + tY * 36, { cls: 'c2', w: 2.2, label: 'B' });
    outIn(d, cx, cy, out, 10, 'c3');
    d.text(cx - 20, cy + 24, 'I', { italic: true, cls: 'c3' });
    const lines = [['I = ' + tx(p.I) + ' A'], ['r = ' + tx(p.r) + ' m']];
    if (s) { lines.push(['H = ' + tx3(s.H) + ' A/m']); lines.push(['B = ' + tx3(s.B) + ' T']); }
    panel(d, 222, 44, lines);
    d.text(222, 152, out ? '電流: 裏 → 表（⊙）' : '電流: 表 → 裏（⊗）', { anchor: 'start', cls: 'c3' });
    d.text(222, 173, out ? '磁場: 反時計回り' : '磁場: 時計回り', { anchor: 'start', cls: 'c1' });
    d.text(190, 224, '右ねじの法則: ねじの進む向き = 電流、回る向き = 磁場', { cls: 'dim' });
    return d.svg();
  }

  // 円形電流: 正面から見た円形コイルと中心の磁場
  function figCircle(ccw, p, s) {
    const d = JK.plot.draw(380, 236);
    const cx = 108, cy = 110, rr = 72, sg = ccw ? 1 : -1;
    for (let k = 0; k < Math.min(p.N, 3); k++) d.circle(cx, cy, rr - k * 7, { cls: 'c3', w: 2 });
    [0.5, 2.0, 3.6, 5.2].forEach((a) => {
      const q = pol(cx, cy, rr, a), tX = -Math.sin(a) * sg, tY = -Math.cos(a) * sg;
      d.arrow(q[0] - tX * 8, q[1] - tY * 8, q[0] + tX * 9, q[1] + tY * 9, { cls: 'c3', w: 2.2 });
    });
    const a = -0.75, Q = pol(cx, cy, rr, a), mid = pol(cx, cy, rr * 0.5, a);
    d.line(cx, cy, Q[0], Q[1], { cls: 'dim', dash: true, w: 1 });
    d.text(mid[0] + 10, mid[1] + 6, 'r', { italic: true });
    outIn(d, cx, cy, ccw, 11, 'c1');
    d.text(cx - 22, cy - 12, 'H', { italic: true, cls: 'c1' });
    const lines = [['I = ' + tx(p.I) + ' A'], ['r = ' + tx(p.r) + ' m'], ['N = ' + p.N + ' 回巻き']];
    if (s) { lines.push(['H = ' + tx3(s.H) + ' A/m']); lines.push(['B = ' + tx3(s.B) + ' T']); }
    panel(d, 222, 44, lines);
    d.text(222, 168, ccw ? '電流: 反時計回り' : '電流: 時計回り', { anchor: 'start', cls: 'c3' });
    d.text(222, 189, ccw ? '磁場: 手前向き（⊙）' : '磁場: 奥向き（⊗）', { anchor: 'start', cls: 'c1' });
    d.text(190, 224, '右ねじの法則: ねじを電流の向きに回すと、進む向きが磁場', { cls: 'dim' });
    return d.svg();
  }

  // ソレノイド: 軸を含む断面（上の導線が手前向き ⊙、下の導線が奥向き ⊗ なら、内部の磁場は右向き）
  function figSol(fwd, p, s) {
    const d = JK.plot.draw(380, 236);
    const x0 = 56, x1 = 276, yT = 80, yB = 140, ym = 110;
    d.rect(x0, yT, x1 - x0, yB - yT, { cls: 'fg', fill: 'f0' });
    for (let k = 0; k < 6; k++) {
      const x = x0 + 20 + k * ((x1 - x0 - 40) / 5);
      outIn(d, x, yT, fwd, 6.5, 'c3');
      outIn(d, x, yB, !fwd, 6.5, 'c3');
    }
    const dx = fwd ? 1 : -1, xm = (x0 + x1) / 2;
    d.arrow(xm - dx * 62, ym, xm + dx * 62, ym, { cls: 'c1', w: 2.6, label: 'H' });
    // 外側へ回り込む磁場（曲線 + 向き）
    const yU = yT - 50, yD = yB + 50;
    d.path('M ' + (x1 + 6) + ' ' + (ym - 12) + ' C ' + (x1 + 70) + ' ' + (ym - 12) + ' ' + (x1 + 70) + ' ' + yU + ' ' + xm + ' ' + yU + ' C ' + (x0 - 70) + ' ' + yU + ' ' + (x0 - 70) + ' ' + (ym - 12) + ' ' + (x0 - 6) + ' ' + (ym - 12), { cls: 'dim', w: 1 });
    d.path('M ' + (x1 + 6) + ' ' + (ym + 12) + ' C ' + (x1 + 70) + ' ' + (ym + 12) + ' ' + (x1 + 70) + ' ' + yD + ' ' + xm + ' ' + yD + ' C ' + (x0 - 70) + ' ' + yD + ' ' + (x0 - 70) + ' ' + (ym + 12) + ' ' + (x0 - 6) + ' ' + (ym + 12), { cls: 'dim', w: 1 });
    d.arrow(xm + dx * 10, yU, xm - dx * 12, yU, { cls: 'dim', w: 1.2 });
    d.arrow(xm - dx * 10, yD, xm + dx * 12, yD, { cls: 'dim', w: 1.2 });
    d.text(x1 + 24, ym + 5, fwd ? 'N' : 'S', { bold: true, cls: 'c3', size: 14 });
    d.text(x0 - 24, ym + 5, fwd ? 'S' : 'N', { bold: true, cls: 'c3', size: 14 });
    d.text(xm, yT - 24, '断面: 上の導線は ' + (fwd ? '⊙（手前向き）' : '⊗（奥向き）'), { cls: 'dim', size: 11 });
    d.text(30, 214, 'I = ' + tx(p.I) + ' A', { anchor: 'start' });
    d.text(120, 214, 'n = ' + tx(p.n) + ' 回/m', { anchor: 'start' });
    if (s) d.text(250, 214, 'H = ' + tx3(s.H) + ' A/m', { anchor: 'start' });
    d.text(190, 232, '右手の 4 本の指を電流の向きに → 親指が内部の磁場の向き', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 円形電流（反時計回り）と、円の右端に接する直線電流
  function figLoopWire(p) {
    const d = JK.plot.draw(380, 236);
    const cx = 120, cy = 118, rr = 66, xw = cx + rr;
    d.circle(cx, cy, rr, { cls: 'c3', w: 2 });
    [0.6, 2.2, 3.7, 5.3].forEach((a) => {
      const q = pol(cx, cy, rr, a), tX = -Math.sin(a), tY = -Math.cos(a);
      d.arrow(q[0] - tX * 8, q[1] - tY * 8, q[0] + tX * 9, q[1] + tY * 9, { cls: 'c3', w: 2.2 });
    });
    d.text(cx - 52, cy - 52, 'I₁', { italic: true, cls: 'c3' });
    d.line(xw, 18, xw, 218, { cls: 'c1', w: 3 });
    if (p.up) d.arrow(xw + 16, 156, xw + 16, 90, { cls: 'c1', w: 2.2, label: 'I₂', lpos: -1 });
    else d.arrow(xw + 16, 90, xw + 16, 156, { cls: 'c1', w: 2.2, label: 'I₂' });
    d.dot(cx, cy, { cls: 'fg', r: 3 });
    d.text(cx - 11, cy + 17, 'O', { italic: true });
    d.line(cx, cy, xw, cy, { cls: 'dim', dash: true, w: 1 });
    d.text(cx + rr / 2, cy - 7, 'r', { italic: true });
    d.text(270, 56, 'I₁ = ' + tx(p.I1) + ' A', { anchor: 'start' });
    d.text(270, 77, 'I₂ = ' + tx(p.I2) + ' A', { anchor: 'start' });
    d.text(270, 98, 'r = ' + tx(p.r) + ' m', { anchor: 'start' });
    d.text(270, 168, '直線導線は円に', { anchor: 'start', cls: 'dim', size: 11 });
    d.text(270, 184, '右端で接している', { anchor: 'start', cls: 'dim', size: 11 });
    return d.svg();
  }

  function graphHr(I, r) {
    const H0 = I / (2 * Math.PI * r);
    return JK.plot.graph({
      w: 320, h: 210, x: [0, r * 3], y: [0, H0 * 3.2],
      curves: [{ f: (x) => I / (2 * Math.PI * x), cls: 'c1', domain: [r / 3, r * 3] }],
      points: [{ x: r, y: H0, label: '(r, H)', cls: 'c3' }],
      vlines: [{ x: r }], hlines: [{ y: H0 }],
      axis: ['r [m]', 'H [A/m]']
    });
  }

  // p.pi: 問題文で指定した円周率（演習は 3.14。数値を代入する式にはこの値を書く。省略（計算機）は π のまま）
  // p.ex: 演習（B を問う設問があるので、B を出すステップも lv 1 にする）
  function stepsField(kind, p, s) {
    const out = p.out;
    const I = nice(p.I), r = nice(p.r);
    const piT = p.pi ? nice(p.pi) : null;
    const twoPi = piT ? R`2 \times ` + piT : R`2\pi`;
    const mu0 = piT ? R`4 \times ` + piT + R` \times 10^{-7}` : R`4\pi \times 10^{-7}`;
    // B = μ₀H に代入する H。3 桁の H では、表示どおりに計算し直すと B の最後の桁が合わないとき、桁を増やして見せる
    const hd = carry(s.H, (h) => rd3(4 * (p.pi || Math.PI) * 1e-7 * h) === rd3(s.B));
    const H = ext(hd), B = sig(s.B);
    const noteH = hd.k > 3 ? R`$H$ は、3 桁に丸める前の値 $` + hd.t + R`\,\mathrm{A/m}$ を使います。` : '';
    const steps = [];
    if (kind === 'line') {
      steps.push({
        t: '右ねじの法則で磁場の向きを決める',
        n: R`電流の向きに右ねじを進めるとき、ねじを回す向きが磁場の向きです。` + (out ? R`電流が紙面の裏から表へ向かうとき、磁場は導線のまわりを**反時計回り**にまわります。` : R`電流が紙面の表から裏へ向かうとき、磁場は導線のまわりを**時計回り**にまわります。`),
        easy: R`電流が流れる導線のまわりには、導線を中心にした**同心円状の磁場**ができます（磁針の N 極が指す向きが磁場の向きです）。向きは**右ねじの法則**で決まります。ふつうのねじは、時計回りに回すと奥へ進みます。このねじの進む向きを電流の向きに合わせると、ねじを回す向きが磁場の向きになります。`,
        pro: R`導線を右手でにぎり、親指を電流の向きにすると、残りの 4 本の指の向きが磁場の向きです。`
      });
      steps.push({
        t: '直線電流のまわりの磁場の強さ',
        m: [R`H = \frac{I}{2\pi r}`, R`H = \frac{` + I + '}{' + twoPi + R` \times ` + r + '} = ' + H + un('A/m')],
        n: R`十分に長い直線電流から距離 $r$ の点の磁場の強さ $H$ は、電流 $I$ に比例し、距離 $r$ に反比例します。単位は $\mathrm{A/m}$（アンペア毎メートル）です。`,
        easy: R`電流が大きいほど磁場は強く、導線から遠ざかるほど弱くなります。式の分母 $2\pi r$ は「半径 $r$ の円の円周の長さ」で、「電流 $I$ を、磁場がぐるっと回る円周で割ったもの」が $H$ だと読めます。距離が 2 倍になると円周も 2 倍なので、磁場は半分になります（距離に反比例）。`,
        pro: R`$H = \dfrac{I}{2\pi r}$ は「$I$ を円周で割る」と覚えると、単位 $\mathrm{A/m}$ も忘れません。`
      });
      steps.push({
        t: '磁束密度 $B$ に直す',
        m: [R`B = \mu_{0}H`, R`\mu_{0} = 4\pi \times 10^{-7}\,\mathrm{N/A^{2}}`, R`B = ` + mu0 + R` \times ` + hd.t + ' = ' + B + un('T')],
        n: R`真空中（空気中もほぼ同じ）では、磁束密度 $B$ は磁場の強さ $H$ に**真空の透磁率** $\mu_{0}$ を掛けたものです。単位は $\mathrm{T}$（テスラ）です。` + noteH,
        easy: R`磁場の大きさを表す量が 2 つあります。$H$ は「電流がつくった磁場の強さ」、$B$ は「その場所で磁石や電流が実際に受ける力の強さ（磁束密度）」です。真空中では $B = \mu_{0}H$ と定数倍の関係なので、同じことを別の単位で表していると考えて構いません。`,
        lv: p.ex ? 1 : 2
      });
      steps.push({
        t: '距離と磁場の強さの関係をグラフで見る',
        n: R`$H = \dfrac{I}{2\pi r}$ は $r$ に反比例するので、グラフは双曲線です。距離が $2r$ になると $H$ は $\dfrac{1}{2}$ 倍（今回なら、距離 $2r$ の点の $H$ は $` + sig(s.H / 2) + R`\,\mathrm{A/m}$）、$3r$ なら $\dfrac{1}{3}$ 倍になります。`,
        easy: R`導線のすぐそばでは磁場が急に強く、少し離れると急に弱くなり、遠くではほとんど 0 に近づきます。これが「反比例」のグラフの形です。`,
        fig: graphHr(p.I, p.r),
        lv: 3
      });
    } else if (kind === 'circle') {
      steps.push({
        t: '右ねじの法則で磁場の向きを決める',
        n: R`コイルを流れる電流のまわる向きに右ねじを回すと、ねじの進む向きが**中心の磁場の向き**です。` + (out ? R`電流が反時計回りのとき、中心の磁場は**手前向き**になります。` : R`電流が時計回りのとき、中心の磁場は**奥向き**になります。`),
        easy: R`円形のコイルを流れる電流のまわりにも磁場ができます。コイルの面に垂直な向きに、中心を貫くように磁場が向きます。向きは右ねじの法則で、「ねじを電流のまわる向きに回したとき、ねじが進む向き」です。`,
        pro: R`右手の 4 本の指を電流のまわる向きにそろえると、親指が中心の磁場の向きです。`
      });
      steps.push({
        t: '円形電流の中心の磁場の強さ',
        m: [R`H = \frac{NI}{2r}`, R`H = \frac{` + nice(p.N) + R` \times ` + I + R`}{2 \times ` + r + '} = ' + H + un('A/m')],
        n: R`半径 $r$ の円形コイル（$N$ 回巻き）の**中心**の磁場の強さは、巻数 $N$ と電流 $I$ に比例し、半径 $r$ に反比例します。`,
        easy: R`$N$ 回巻きは、同じ電流が $N$ 回ぐるぐる回っているので、磁場は 1 回巻きの $N$ 倍です。また輪が小さいほど、どの部分の電流も中心に近くなるので、中心の磁場は強くなります。この式が使えるのは**中心の点だけ**です（輪の外や輪の面内の別の点では別の式になります）。`,
        pro: R`直線電流の $\dfrac{I}{2\pi r}$ との違いは、$2\pi r$（円周）が $2r$（直径）に変わっただけです。円形コイルの公式は中心でのみ成り立ちます。`
      });
      steps.push({
        t: '磁束密度 $B$ に直す',
        m: [R`B = \mu_{0}H = ` + mu0 + R` \times ` + hd.t + ' = ' + B + un('T')],
        n: R`真空中では $B = \mu_{0}H$（$\mu_{0} = 4\pi \times 10^{-7}\,\mathrm{N/A^{2}}$）です。` + noteH,
        easy: R`$H$ は「電流がつくった磁場の強さ」、$B$ は「実際に磁石や電流が受ける力の強さ（磁束密度）」です。真空中では定数 $\mu_{0}$ を掛けるだけで $H$ から $B$ になります。`,
        lv: p.ex ? 1 : 2
      });
      steps.push({
        t: '大きさの変化の見積もり',
        n: R`半径を 2 倍にすると $H$ は $\dfrac{1}{2}$ 倍、電流を 2 倍にすると 2 倍、巻数を 2 倍にすると 2 倍です。同じ長さの導線を巻き直して、巻数を 2 倍・半径を $\dfrac{1}{2}$ 倍にすると、$H$ は $2 \times 2 = 4$ 倍になります。`,
        easy: R`式 $H = \dfrac{NI}{2r}$ は、分子（$N$、$I$）が大きいほど強く、分母（$r$）が大きいほど弱い、という形です。「何を何倍にしたら $H$ は何倍か」を、式のまま比で考えると計算せずに答えが分かります。`,
        lv: 3
      });
    } else {
      steps.push({
        t: '右ねじの法則で磁場の向きを決める',
        n: R`コイルの電流のまわる向きに右ねじを回すと、ねじの進む向きが内部の磁場の向きです。右手でコイルをにぎり、4 本の指を電流の向きにそろえると、**親指の向きが内部の磁場の向き**（磁石でいう N 極側）です。`,
        easy: R`ソレノイドは、導線をらせん状に何回も巻いたコイルです。1 回ぶんの輪が、円形電流と同じように中心を貫く磁場をつくります。それが何回も重なるので、コイルの内部には、軸にそって一方向に向く強い磁場ができます。`,
        pro: R`磁場の出てくる側が N 極です。電流の向きを逆にすると、N 極と S 極が入れかわります。`
      });
      steps.push({
        t: 'ソレノイド内部の磁場の強さ',
        m: [R`H = nI`, R`H = ` + nice(p.n) + R` \times ` + I + ' = ' + H + un('A/m')],
        n: R`単位長さ（$1\,\mathrm{m}$）あたりの巻数を $n$ とすると、内部の磁場の強さは $H = nI$ で、**場所によらず一様**です。外部の磁場はほぼ $0$ とみなします。`,
        easy: R`$n$ は「1 m あたり何回巻いてあるか」です。巻き方が密なほど、また電流が大きいほど、内部の磁場は強くなります。内部では各輪がつくる磁場がすべて同じ向きに重なり合って強めあい、外側では打ち消しあうので、内部だけが強い一様な磁場になります。`,
        pro: R`$H = nI$ に $\pi$ も半径も出てこない点が特徴です。コイルの太さや長さに無関係で、$n$ と $I$ だけで決まります（十分に長いソレノイドの場合）。`
      });
      steps.push({
        t: '磁束密度 $B$ に直す',
        m: [R`B = \mu_{0}H = \mu_{0}nI`, R`B = ` + mu0 + R` \times ` + hd.t + ' = ' + B + un('T')],
        n: R`真空中では $B = \mu_{0}H$ です。鉄心を入れると $\mu_{0}$ が透磁率 $\mu$ に変わり、磁束密度は数百〜数千倍になります。` + noteH,
        easy: R`$H$ に定数 $\mu_{0}$ を掛けると、実際に磁石や電流が受ける力の強さを表す $B$ になります。コイルの中に鉄の棒（鉄心）を入れると、同じ電流でも $B$ がずっと大きくなります。電磁石はこの性質を利用しています。`,
        lv: p.ex ? 1 : 2
      });
      steps.push({
        t: '総巻数と長さから $n$ を求める',
        m: [R`n = \frac{N}{l}`],
        n: R`長さ $l$ のコイルに総巻数 $N$ 回巻いてあるとき、$n = N/l$ です。たとえば長さ $0.50\,\mathrm{m}$ に $1000$ 回巻いたコイルなら $n = \dfrac{1000}{0.50} = 2000$ 回/m です。`,
        easy: R`「全体で何回巻いてあるか（$N$）」を「コイルの長さ（$l$）」で割ると、1 m あたりの巻数 $n$ になります。公式に入れるのは $N$ ではなく $n$ なので注意しましょう。`,
        lv: 3
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-field-current',
    field: '電磁気',
    unit: 'p-mag',
    title: '電流がつくる磁場（直線・円形・ソレノイド）',
    desc: '直線電流・円形電流（中心）・ソレノイド（内部）がつくる磁場の強さ $H$ と磁束密度 $B$ を求め、右ねじの法則で磁場の向きを図に表します。',
    form: [R`H = \frac{I}{2\pi r}\ \text{（直線）}`, R`H = \frac{NI}{2r}\ \text{（円形の中心）}`, R`H = nI\ \text{（ソレノイド内部）}`, R`B = \mu_{0}H,\quad \mu_{0} = 4\pi \times 10^{-7}\,\mathrm{N/A^{2}}`],
    inputs: [
      { key: 'kind', label: '電流の形', type: 'select', def: 'line', options: [['line', '直線電流（十分に長い導線）'], ['circle', '円形電流（円形コイルの中心）'], ['solenoid', 'ソレノイド（内部の磁場）']] },
      { key: 'I', label: '電流 $I$', unit: 'A', type: 'num', def: '5.0', min: 0.001, max: 100000 },
      { key: 'r', label: '距離・半径 $r$', unit: 'm', type: 'num', def: '0.10', min: 0.0001, max: 1000, hint: '直線電流: 導線からの距離 ／ 円形電流: 円の半径', show: (raw) => raw.kind !== 'solenoid' },
      { key: 'N', label: '巻数 $N$', unit: '回', type: 'int', def: '1', min: 1, max: 10000, show: (raw) => raw.kind === 'circle' },
      { key: 'n', label: '単位長さあたりの巻数 $n$', unit: '回/m', type: 'num', def: '2000', min: 1, max: 1000000, hint: '総巻数 N と長さ l から n = N/l', show: (raw) => raw.kind === 'solenoid' },
      { key: 'dir', label: '電流の向き', type: 'select', def: 'fwd', options: [['fwd', '直線: 裏 → 表 ／ 円形: 反時計回り ／ ソレノイド: 上の導線が手前向き'], ['rev', '逆向き']] }
    ],
    examples: [
      { label: '直線電流（5.0 A・10 cm 離れた点）', v: { kind: 'line', I: '5.0', r: '0.10', dir: 'fwd' } },
      { label: '円形コイル（10 回巻き・半径 5.0 cm）', v: { kind: 'circle', I: '2.0', r: '0.050', N: '10', dir: 'fwd' } },
      { label: 'ソレノイド（2000 回/m）', v: { kind: 'solenoid', I: '1.5', n: '2000', dir: 'rev' } }
    ],
    intro: {
      easy: R`方位磁針のそばの導線に電流を流すと、針が振れます。電流のまわりには**磁場**（磁石の力がはたらく空間）ができるからです。磁場の向きは**右ねじの法則**で決まり、強さは電流が大きいほど強く、導線から遠いほど弱くなります。導線をまっすぐにした場合（直線電流）、輪にした場合（円形電流）、らせん状に何回も巻いた場合（ソレノイド）で、磁場の強さを表す式が少しずつ違います。`,
      normal: R`直線電流 $H = \dfrac{I}{2\pi r}$、円形電流の中心 $H = \dfrac{NI}{2r}$、ソレノイド内部 $H = nI$。向きは右ねじの法則で決め、真空中では $B = \mu_{0}H$ で磁束密度に直します。`,
      pro: R`3 つの公式は「どの量に比例・反比例するか」を比で押さえておくと、倍率の問題が一瞬で解けます。複数の電流がつくる磁場は、向きに注意してベクトルとして重ねあわせます（同じ向きなら足し算、逆向きなら引き算）。`
    },
    compute(v) {
      const kind = v.kind;
      const out = v.dir !== 'rev';
      const p = { I: v.I, r: kind === 'solenoid' ? 0 : v.r, N: kind === 'circle' ? v.N : 1, n: kind === 'solenoid' ? v.n : 0, out: out };
      const s = solveField(kind, p.I, p.r, p.N, p.n);
      if (!isFinite(s.H) || !(s.H > 0)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
      let dirTex;
      if (kind === 'line') dirTex = out ? R`\text{電流のまわりを反時計回り}` : R`\text{電流のまわりを時計回り}`;
      else if (kind === 'circle') dirTex = out ? R`\text{中心で手前向き（⊙）}` : R`\text{中心で奥向き（⊗）}`;
      else dirTex = out ? R`\text{内部で右向き（右端が N 極）}` : R`\text{内部で左向き（左端が N 極）}`;
      const res = [
        { label: '磁場の強さ H', tex: sig(s.H) + un('A/m') },
        { label: '磁束密度 B（真空中）', tex: sig(s.B) + un('T') },
        { label: '磁場の向き', tex: dirTex }
      ];
      if (kind === 'line') res.push({ label: '距離を 2 倍にしたときの H', tex: sig(s.H / 2) + un('A/m') });
      const fig = kind === 'line' ? figLine(out, p, s) : (kind === 'circle' ? figCircle(out, p, s) : figSol(out, p, s));
      return { result: res, steps: stepsField(kind, p, s), fig: fig };
    },
    exercise(rng, level) {
      if (level === 'basic') {
        const I = rng.pick([2.0, 3.0, 4.0, 5.0, 8.0, 10, 15, 20]), r = rng.pick([0.05, 0.10, 0.20, 0.25, 0.40, 0.50]);
        const p = { I: I, r: r, N: 1, n: 0, out: true, pi: PI314, ex: true };
        const s = solveField('line', I, r, 1, 0, PI314);
        return {
          title: '直線電流のまわりの磁場',
          body: R`十分に長い直線状の導線に、紙面の裏から表に向かって $` + sf(I) + R`\,\mathrm{A}$ の電流が流れている。導線から $` + sf(r) + R`\,\mathrm{m}$ 離れた点 P について、次の問いに答えよ。` + MU0TXT,
          fig: figLine(true, p, null),
          parts: [
            numPart('(1)', R`点 P での磁場の強さ $H$`, s.H, 'A/m'),
            numPart('(2)', R`点 P での磁束密度 $B$`, s.B, 'T')
          ],
          solution: stepsField('line', p, s)
        };
      }
      if (level === 'mid') {
        if (rng.bool()) {
          // 円形コイルの中心 + 同じ導線の巻き直し
          const N = rng.pick([1, 2, 5, 10]), r = rng.pick([0.05, 0.10, 0.20]), I = rng.pick([1.0, 2.0, 3.0, 5.0]);
          const p = { I: I, r: r, N: N, n: 0, out: true, pi: PI314, ex: true };
          const s = solveField('circle', I, r, N, 0, PI314);
          const s2 = solveField('circle', I, r / 2, 2 * N, 0, PI314);
          const sol = stepsField('circle', p, s).slice(0, 3);
          sol.push({
            t: '巻き直したあとの磁場',
            m: [R`H' = \frac{N'I}{2r'} = \frac{2N \cdot I}{2 \times (r/2)} = 4 \times \frac{NI}{2r} = 4H`, R`H' = 4 \times ` + sig(s.H) + ' = ' + sig(s2.H) + un('A/m')],
            n: R`導線の長さは $2\pi r \times N$ で一定なので、半径を $\dfrac{1}{2}$ にすると巻数は 2 倍になります。電流は同じなので、$H$ は $\dfrac{NI}{2r}$ から**巻数 2 倍 × 半径の逆数 2 倍 = 4 倍**になります。`,
            easy: R`同じ針金を、小さな輪にして何重にも巻くと、磁場は強くなります。式の $N$ が 2 倍、$r$ が $\dfrac{1}{2}$ 倍（分母が小さくなるので値は 2 倍）になるので、$2 \times 2 = 4$ 倍です。`
          });
          return {
            title: '円形コイルの中心の磁場',
            body: R`半径 $` + sf(r) + R`\,\mathrm{m}$ の円形コイルを $` + N + R`$ 回巻き、電流 $` + sf(I) + R`\,\mathrm{A}$ を流した。次の問いに答えよ。` + MU0TXT,
            fig: figCircle(true, p, null),
            parts: [
              numPart('(1)', R`コイルの中心での磁場の強さ $H$`, s.H, 'A/m'),
              numPart('(2)', R`コイルの中心での磁束密度 $B$`, s.B, 'T'),
              numPart('(3)', R`同じ長さの導線を、巻数 $` + (2 * N) + R`$ 回・半径 $` + sf(r / 2) + R`\,\mathrm{m}$ に巻き直して同じ電流を流したときの、中心での磁場の強さ $H'$`, s2.H, 'A/m')
            ],
            solution: sol
          };
        }
        // ソレノイド（総巻数と長さから n を求める）
        let Nt, l, I;
        for (let k = 0; k < 80; k++) {
          Nt = rng.pick([200, 400, 500, 800, 1000, 1500]); l = rng.pick([0.10, 0.20, 0.25, 0.40, 0.50]); I = rng.pick([0.50, 1.0, 2.0, 3.0]);
          if (Math.abs(Nt / l - Math.round(Nt / l)) < 1e-9) break;
        }
        const n = Math.round(Nt / l), p = { I: I, r: 0, N: 1, n: n, out: true, pi: PI314, ex: true };
        const s = solveField('solenoid', I, 0, 1, n, PI314);
        const sol = [{
          t: '単位長さあたりの巻数 $n$ を求める',
          m: [R`n = \frac{N}{l} = \frac{` + Nt + '}{' + nice(l) + '} = ' + nice(n) + un('回/m')],
          n: R`$n$ は「$1\,\mathrm{m}$ あたりの巻数」です。総巻数 $N$ を長さ $l$ で割って求めます。`,
          easy: R`コイルの長さが $` + nice(l) + R`\,\mathrm{m}$ で、そこに $` + Nt + R`$ 回巻いてあります。$1\,\mathrm{m}$ あたりに直すと何回になるかを、割り算で求めます。`,
          pro: R`公式に入れるのは $N$ ではなく $n$（$N/l$）です。`
        }].concat(stepsField('solenoid', p, s).slice(0, 3));
        return {
          title: 'ソレノイドの内部の磁場',
          body: R`長さ $` + sf(l) + R`\,\mathrm{m}$ の円筒に導線を一様に $` + Nt + R`$ 回巻いたソレノイドに、電流 $` + sf(I) + R`\,\mathrm{A}$ を流した。ソレノイドは十分に長く、内部の磁場は一様とみなせる。次の問いに答えよ。` + MU0TXT,
          fig: figSol(true, p, null),
          parts: [
            numPart('(1)', R`単位長さあたりの巻数 $n$`, n, '回/m'),
            numPart('(2)', R`内部の磁場の強さ $H$`, s.H, 'A/m'),
            numPart('(3)', R`内部の磁束密度 $B$`, s.B, 'T')
          ],
          solution: sol
        };
      }
      // adv: 円形電流 + 円の右端に接する直線電流（中心 O での磁場の重ねあわせ）
      let I1, I2, r, add, H1, H2;
      for (let k = 0; k < 100; k++) {
        I1 = rng.pick([2.0, 3.0, 4.0, 5.0]); I2 = rng.pick([5.0, 10, 15, 20]); r = rng.pick([0.10, 0.20, 0.50]);
        add = rng.bool();
        H1 = I1 / (2 * r); H2 = I2 / (2 * PI314 * r);
        if (add || Math.abs(H1 - H2) >= 0.3 * Math.max(H1, H2)) break;
      }
      const net = add ? H1 + H2 : Math.abs(H1 - H2);
      const wireDir = add ? '上' : '下';
      const bigger = H1 > H2 ? '円形電流' : '直線電流';
      // 合成の式に代入する H₂。3 桁の H₂ では、表示どおりに計算し直すと H の最後の桁が合わないとき、桁を増やして見せる
      const H1d = rd3(H1);
      const h2 = carry(H2, (h) => rd3(add ? H1d + h : Math.abs(H1d - h)) === rd3(net));
      const sol = [
        {
          t: '円形電流がつくる磁場（向きと大きさ）',
          m: [R`H_{1} = \frac{I_{1}}{2r} = \frac{` + nice(I1) + R`}{2 \times ` + nice(r) + '} = ' + sig(H1) + un('A/m')],
          n: R`反時計回りの円形電流がつくる中心の磁場は、右ねじの法則から**手前向き**です。大きさは、巻数 1 の円形電流の公式 $H_{1} = \dfrac{I_{1}}{2r}$ で求まります。`,
          easy: R`円形のコイルは、中心を貫く向きに磁場をつくります。電流が反時計回りなら、右ねじを反時計回りに回したときに進む向き＝**こちら（手前）向き**に磁場ができます。`,
          pro: R`円形電流は反時計回り → 中心で手前向き。「手前向きにそろえば足し算、逆なら引き算」と最初に決めておきます。`
        },
        {
          t: '直線電流がつくる磁場（向きと大きさ）',
          m: [R`H_{2} = \frac{I_{2}}{2\pi r} = \frac{` + nice(I2) + R`}{2 \times ` + nice(PI314) + R` \times ` + nice(r) + '} = ' + ext(h2) + un('A/m')],
          n: R`中心 O から距離 $r$ の位置を通る直線電流（電流は` + wireDir + R`向き）がつくる磁場は、右ねじの法則より O で**` + (add ? '手前向き' : '奥向き') + R`**になります。大きさは $H_{2} = \dfrac{I_{2}}{2\pi r}$ です。`,
          easy: R`直線電流のまわりには、導線を取り巻く円形の磁場ができます。O は導線の左側にあり、電流は` + wireDir + R`向きです。右手の親指を電流の向きにして、4 本の指がまわる向きが、O の位置での磁場の向きです。`
        },
        {
          t: '2 つの磁場を重ねあわせる',
          m: add ? [R`H = H_{1} + H_{2} = ` + sig(H1) + ' + ' + h2.t + ' = ' + sig(net) + un('A/m')] : [R`H = |H_{1} - H_{2}| = |` + sig(H1) + ' - ' + h2.t + '| = ' + sig(net) + un('A/m')],
          n: (add ? R`2 つの磁場は**同じ向き**（ともに手前向き）なので足し算です。` : R`2 つの磁場は**逆向き**（円形電流は手前向き、直線電流は奥向き）なので、大きい方から小さい方を引きます。合成磁場は` + bigger + R`の向きです。`) +
            (h2.k > 3 ? R`$H_{2}$ は、3 桁に丸める前の値 $` + h2.t + R`\,\mathrm{A/m}$ を使います。` : ''),
          easy: R`磁場は向きをもった量なので、同じ向きなら強めあい、逆向きなら弱めあいます。綱引きで同じ方向に引けば力が足され、反対方向に引けば差だけが残るのと同じです。`
        }
      ];
      return {
        title: '円形電流と直線電流の磁場の重ねあわせ',
        body: R`半径 $` + sf(r) + R`\,\mathrm{m}$ の円形コイル（1 回巻き）に、図のように反時計回りに電流 $I_{1} = ` + sf(I1) + R`\,\mathrm{A}$ を流す。このコイルと同じ平面内で、コイルの右端に接する十分に長い直線導線に、` + wireDir + R`向きに電流 $I_{2} = ` + sf(I2) + R`\,\mathrm{A}$ を流す（導線とコイルは接触しておらず、絶縁されている）。コイルの中心 O について、次の問いに答えよ。` + MU0TXT,
        fig: figLoopWire({ I1: I1, I2: I2, r: r, up: add }),
        parts: [
          numPart('(1)', R`円形電流だけがつくる O での磁場の強さ $H_{1}$`, H1, 'A/m'),
          numPart('(2)', R`直線電流だけがつくる O での磁場の強さ $H_{2}$`, H2, 'A/m'),
          numPart('(3)', R`2 つの電流による O での合成磁場の強さ $H$`, net, 'A/m')
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     2. 電流が磁場から受ける力 / 平行電流の間の力
     ===================================================================== */

  // フレミングの左手の法則: 中指 = 電流（右）、人差し指 = 磁場（奥向き）、親指 = 力（上）
  function figFleming() {
    const d = JK.plot.draw(320, 210);
    const ox = 96, oy = 140;
    d.arrow(ox, oy, ox + 150, oy, { cls: 'c3', w: 2.6 });
    d.arrow(ox, oy, ox + 64, oy - 64, { cls: 'c1', w: 2.6 });
    d.arrow(ox, oy, ox, oy - 108, { cls: 'c2', w: 2.6 });
    d.dot(ox, oy, { cls: 'fg', r: 3 });
    d.text(ox + 148, oy + 20, '中指: 電流 I', { anchor: 'end', cls: 'c3' });
    d.text(ox + 70, oy - 70, '人差し指: 磁場 B（奥向き）', { anchor: 'start', cls: 'c1', size: 11 });
    d.text(ox - 8, oy - 112, '親指: 力 F', { anchor: 'end', cls: 'c2' });
    d.text(160, 186, 'フレミングの左手の法則', { bold: true });
    d.text(160, 203, '中指（電流）→ 人差し指（磁場）→ 親指（力）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 磁場中の導線: 導線は水平で電流は右向き、磁場は面内で導線と角 θ をなす → 力は紙面に垂直（手前向き）。F = null なら結果を書かない
  function figForce(p, F) {
    const d = JK.plot.draw(380, 236);
    const t = p.th * Math.PI / 180, ct = Math.cos(t), st = Math.sin(t);
    const y0 = 136, x0 = 56, x1 = 316, xc = 150, Lb = 78;
    // 一様な磁場（面内の薄い矢印）
    [[60, 100], [240, 100], [320, 100], [60, 166], [230, 166], [310, 166]].forEach((q) => {
      d.arrow(q[0], q[1], q[0] + 26 * ct, q[1] - 26 * st, { cls: 'dim', w: 1 });
    });
    d.line(x0, y0, x1, y0, { cls: 'c3', w: 4.5 });
    d.arrow(236, y0 - 13, 290, y0 - 13, { cls: 'c3', w: 2, label: 'I' });
    d.arrow(xc, y0, xc + Lb * ct, y0 - Lb * st, { cls: 'c1', w: 2.4, label: 'B' });
    if (st > 0.02) {
      d.line(xc + Lb * ct, y0 - Lb * st, xc + Lb * ct, y0, { cls: 'dim', dash: true, w: 1 });
      d.text(xc + Lb * ct + 6, y0 - Lb * st / 2 + 4, 'B sinθ', { anchor: 'start', cls: 'dim', size: 11 });
      d.arrow(xc, y0, xc - 36, y0 + 36, { cls: 'c2', w: 2.6, label: 'F' });
    }
    d.angle(xc, y0, 30, 0, p.th, 'θ', { cls: 'c3' });
    panel(d, 14, 22, [['I = ' + tx(p.I) + ' A'], ['B = ' + tx(p.B) + ' T']]);
    d.text(366, 22, 'l = ' + tx(p.l) + ' m', { anchor: 'end' });
    d.text(366, 43, 'θ = ' + tx(p.th) + '°', { anchor: 'end' });
    if (F != null) d.text(190, 192, st > 0.02 ? 'F = IBl sinθ = ' + tx3(F) + ' N' : '磁場が電流と平行なので F = 0', { cls: 'dim' });
    d.text(190, 212, '磁場は紙面内、電流は右向き', { cls: 'dim', size: 10 });
    d.text(190, 227, '力は紙面に垂直（斜め下の矢印 = 手前向き）', { cls: 'dim', size: 10 });
    return d.svg();
  }

  // 平行な 2 本の導線。s = null なら f を書かない
  function figParallel(same, p, s) {
    const d = JK.plot.draw(380, 236);
    const y1 = 56, y2 = 132, xa = 50, xb = 320;
    d.line(xa, y1, xb, y1, { cls: 'fg', w: 3.5 });
    d.line(xa, y2, xb, y2, { cls: 'fg', w: 3.5 });
    d.arrow(120, y1 - 14, 186, y1 - 14, { cls: 'c3', w: 2.2 });
    if (same) d.arrow(120, y2 + 14, 186, y2 + 14, { cls: 'c3', w: 2.2 });
    else d.arrow(186, y2 + 14, 120, y2 + 14, { cls: 'c3', w: 2.2 });
    d.text(153, y1 - 26, 'I₁ = ' + tx(p.I1) + ' A', { cls: 'c3' });
    d.text(153, y2 + 38, 'I₂ = ' + tx(p.I2) + ' A', { cls: 'c3' });
    if (same) {
      d.arrow(240, y1 + 2, 240, y1 + 32, { cls: 'c2', w: 2.4, label: 'F₁', lpos: -1 });
      d.arrow(290, y2 - 2, 290, y2 - 32, { cls: 'c2', w: 2.4, label: 'F₂' });
    } else {
      d.arrow(240, y1 - 2, 240, y1 - 32, { cls: 'c2', w: 2.4, label: 'F₁' });
      d.arrow(290, y2 + 2, 290, y2 + 32, { cls: 'c2', w: 2.4, label: 'F₂', lpos: -1 });
    }
    d.line(86, y1, 86, y2, { cls: 'dim', dash: true, w: 1 });
    dimLine(d, 86, y1 + 2, 86, y2 - 2);
    d.text(80, (y1 + y2) / 2 + 4, 'd = ' + tx(p.d) + ' m', { anchor: 'end' });
    if (s) d.text(190, 200, 'f = μ₀I₁I₂/(2πd) = ' + tx3(s.f) + ' N/m（' + (same ? '引き合う' : '反発する') + '）', { cls: 'dim' });
    d.text(190, 222, same ? '同じ向きの電流は引き合う（F₁ = F₂）' : '逆向きの電流は反発しあう（F₁ = F₂）', { cls: 'dim' });
    return d.svg();
  }

  // つり合いの図（棒を横から見る）。th は鉛直からの傾き[度]
  function figHang(th) {
    const d = JK.plot.draw(380, 236);
    const t = Math.min(70, Math.max(8, th)) * Math.PI / 180;
    const ox = 150, oy = 30, L = 118;
    const px = ox + L * Math.sin(t), py = oy + L * Math.cos(t);
    d.hatch(ox - 50, oy, ox + 120, oy, { side: -1 });
    d.line(ox, oy, ox, oy + L + 14, { cls: 'dim', dash: true, w: 1 });
    d.line(ox, oy, px, py, { cls: 'fg', w: 1.6 });
    d.circle(px, py, 7, { cls: 'c3', fill: 'f3' });
    d.angle(ox, oy, 40, -90, -90 + th, 'θ', { cls: 'c3' });
    d.arrow(px, py, px, py + 54, { cls: 'c2', label: 'mg' });
    d.arrow(px, py, px + 64, py, { cls: 'c1', label: 'F' });
    d.arrow(px, py, px - (px - ox) * 0.42, py - (py - oy) * 0.42, { cls: 'c4', label: 'T' });
    d.arrow(318, 128, 318, 84, { cls: 'c2', w: 2.2 });
    d.text(318, 76, 'B', { cls: 'c2', bold: true });
    d.text(318, 146, '磁場', { cls: 'dim', size: 11 });
    d.text(190, 228, '棒を横から見た図（電流は紙面に垂直）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  function stepsForce(mode, p, s) {
    const steps = [];
    if (mode === 'field') {
      const I = nice(p.I), B = nice(p.B), l = nice(p.l);
      steps.push({
        t: '力の向きを決める（フレミングの左手の法則）',
        n: R`磁場の中で電流が流れる導線は、**電流と磁場の両方に垂直な向き**に力を受けます。向きは**フレミングの左手の法則**で決めます。左手の中指・人差し指・親指を互いに直角にして、**中指を電流、人差し指を磁場の向き**に合わせると、**親指が力の向き**です。`,
        easy: R`磁石の間にぶら下げた導線に電流を流すと、導線が横に動きます。この「動く向き」を決めるのが左手の法則です。左手を、中指・人差し指・親指がそれぞれ直角になるように広げ、「電（中指）・磁（人差し指）・力（親指）」と覚えます。電流と磁場の向きに指を合わせれば、残りの親指が力の向きです。`,
        pro: R`磁場が導線と平行なら力は 0 です。磁場が導線に斜めのときは、導線に垂直な成分 $B\sin\theta$ だけが力に効きます。`,
        fig: figFleming()
      });
      steps.push({
        t: '力の大きさ',
        m: [R`F = IBl\sin\theta`, R`F = ` + I + R` \times ` + B + R` \times ` + l + R` \times \sin ` + nice(p.th) + R`\degree = ` + sig(s.F) + un('N')],
        n: R`磁束密度 $B$ の一様な磁場の中で、長さ $l$ の導線に電流 $I$ が流れるとき、導線が受ける力の大きさは $F = IBl\sin\theta$ です。$\theta$ は電流の向きと磁場の向きのなす角です。`,
        easy: R`力は、電流が大きいほど、磁場が強いほど、磁場の中にある導線が長いほど大きくなります。$\sin\theta$ は「磁場が電流にどれだけ垂直か」を表し、垂直（$\theta = 90\degree$）のとき最大の 1、平行（$\theta = 0\degree, 180\degree$）のとき 0 になります。`,
        pro: R`$\theta = 90\degree$ なら $F = IBl$。磁束密度の単位 $\mathrm{T}$ は $\mathrm{N/(A \cdot m)}$ なので、$IBl$ の単位が $\mathrm{N}$ になることで検算できます。`
      });
      steps.push({
        t: '磁場に垂直な成分で考える',
        m: [R`B_{\perp} = B\sin\theta = ` + B + R` \times \sin ` + nice(p.th) + R`\degree = ` + sig(s.Bp) + un('T'), R`F = IB_{\perp}l = ` + sig(s.F) + un('N')],
        n: R`磁場を「導線に平行な成分（力を生まない）」と「導線に垂直な成分 $B\sin\theta$（力を生む）」に分けて考えても同じ結果になります。`,
        easy: R`磁場を斜めの矢印として描くと、導線に沿った向きの部分と、導線に直角な向きの部分に分けられます。導線に沿った部分は力を生まず、直角な部分だけが力を生みます。力学で、斜面の重力を「斜面に沿う成分」と「垂直な成分」に分けるのと同じ考え方です。`,
        lv: 2
      });
      steps.push({
        t: '磁束密度の単位 T の意味',
        m: [R`B = \frac{F}{Il}\ \Rightarrow\ 1\,\mathrm{T} = 1\,\frac{\mathrm{N}}{\mathrm{A \cdot m}}`],
        n: R`磁場に垂直に置いた長さ $1\,\mathrm{m}$ の導線に $1\,\mathrm{A}$ の電流を流したとき、$1\,\mathrm{N}$ の力を受ける磁場の強さが $1\,\mathrm{T}$（テスラ）です。`,
        easy: R`$B$ は「磁場がどれだけ強く電流を押すか」の尺度です。$F = IBl$ を $B$ について解くと $B = \dfrac{F}{Il}$ となり、「電流 1 A あたり・導線 1 m あたりの力」が磁束密度、と読めます。`,
        lv: 3
      });
    } else {
      const I1 = nice(p.I1), I2 = nice(p.I2), dd = nice(p.d), l = nice(p.l);
      // F = f × l に代入する f。3 桁の f では、表示どおりに計算し直すと F の最後の桁が合わないとき、桁を増やして見せる
      const fd = carry(s.f, (h) => rd3(h * p.l) === rd3(s.F));
      steps.push({
        t: '導線 1 が導線 2 の位置につくる磁場',
        m: [R`B_{1} = \mu_{0}H_{1} = \mu_{0}\frac{I_{1}}{2\pi d}`, R`B_{1} = \frac{4\pi \times 10^{-7} \times ` + I1 + R`}{2\pi \times ` + dd + '} = ' + sig(s.B1) + un('T')],
        n: R`導線 1 のまわりには、右ねじの法則に従う同心円状の磁場ができています。導線 2 の位置（導線 1 から距離 $d$）での磁束密度は $B_{1} = \dfrac{\mu_{0}I_{1}}{2\pi d}$ です。`,
        easy: R`平行な 2 本の導線の間にはたらく力は、「**片方の導線がつくった磁場の中に、もう片方の導線が置かれている**」と考えると分かります。まず導線 1 がつくる磁場の強さを、直線電流の公式で求めます。`,
        pro: R`$\mu_{0} = 4\pi \times 10^{-7}$ を代入すると $B_{1} = \dfrac{2 \times 10^{-7}I_{1}}{d}$ と簡単になるので、暗算でも出せます。`
      });
      steps.push({
        t: '導線 2 が受ける力',
        m: [R`F = I_{2}B_{1}l = \frac{\mu_{0}I_{1}I_{2}}{2\pi d}\,l`, R`f = \frac{F}{l} = \frac{4\pi \times 10^{-7} \times ` + I1 + R` \times ` + I2 + R`}{2\pi \times ` + dd + '} = ' + ext(fd) + un('N/m'), R`F = ` + fd.t + R` \times ` + l + ' = ' + sig(s.F) + un('N')],
        n: R`磁場 $B_{1}$ に垂直な導線 2（長さ $l$）が受ける力は $F = I_{2}B_{1}l$ です。単位長さ（$1\,\mathrm{m}$）あたりの力 $f = \dfrac{F}{l}$ は $f = \dfrac{\mu_{0}I_{1}I_{2}}{2\pi d}$ となります。` + (fd.k > 3 ? R`$F$ を求めるときは、$f$ を 3 桁に丸める前の値 $` + fd.t + R`\,\mathrm{N/m}$ で計算します。` : ''),
        easy: R`導線 1 がつくった磁場 $B_{1}$ の中に、電流 $I_{2}$ の導線 2 が垂直に置かれているので、前に学んだ $F = IBl$ がそのまま使えます。導線の長さ $l$ が長いほど、力も大きくなります。`,
        pro: R`2 本の電流の積に比例し、距離に反比例します。$1\,\mathrm{m}$ あたりの力 $f = \dfrac{F}{l}$ で覚えておくと、長さが変わっても対応できます。`
      });
      steps.push({
        t: '力の向き（引き合うか、反発するか）',
        n: p.same ? R`2 本の電流が**同じ向き**なので、力は互いに近づく向き（**引力**）です。` : R`2 本の電流が**逆向き**なので、力は互いに遠ざかる向き（**斥力**）です。`,
        easy: R`同じ向きに流れる電流どうしは引き合い、逆向きに流れる電流どうしは反発し合います。「同じ向き → 引力、逆向き → 斥力」は、静電気の「同符号 → 斥力」とは逆なので、混同しないようにしましょう。`,
        pro: R`2 本の導線が受ける力は、作用・反作用の関係で、大きさが等しく向きが逆です（導線 1 が受ける力も同じ $f$）。`
      });
      steps.push({
        t: '電流の単位（アンペア）との関係',
        m: [R`I_{1} = I_{2} = 1\,\mathrm{A},\ d = 1\,\mathrm{m}\ \Rightarrow\ \frac{F}{l} = \frac{4\pi \times 10^{-7}}{2\pi} = 2 \times 10^{-7}\,\mathrm{N/m}`],
        n: R`真空中で $1\,\mathrm{m}$ 離れた平行な導線に同じ大きさの電流を流して、導線 $1\,\mathrm{m}$ あたり $2 \times 10^{-7}\,\mathrm{N}$ の力がはたらくときの電流を $1\,\mathrm{A}$ と定めていました（かつての電流の単位の定義）。`,
        easy: R`電流の単位 A（アンペア）は、もともとこの「導線の間にはたらく力」を基準に決められました。力がとても小さな値になるのは、$\mu_{0}$ が $10^{-7}$ 程度の小さな数だからです。`,
        lv: 3
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-force-current',
    field: '電磁気',
    unit: 'p-mag',
    title: '電流が磁場から受ける力・平行電流の間の力',
    desc: R`一様な磁場の中の導線が受ける力 $F = IBl\sin\theta$ と、平行な 2 本の導線の間にはたらく力 $\dfrac{F}{l} = \dfrac{\mu_{0}I_{1}I_{2}}{2\pi d}$ を求め、フレミングの左手の法則で向きを図示します。`,
    form: [R`F = IBl\sin\theta`, R`B_{1} = \frac{\mu_{0}I_{1}}{2\pi d},\quad \frac{F}{l} = I_{2}B_{1} = \frac{\mu_{0}I_{1}I_{2}}{2\pi d}`],
    inputs: [
      { key: 'mode', label: '調べる場面', type: 'select', def: 'field', options: [['field', '一様な磁場の中の導線が受ける力'], ['parallel', '平行な 2 本の導線の間にはたらく力']] },
      { key: 'I', label: '電流 $I$', unit: 'A', type: 'num', def: '5.0', min: 0.001, max: 100000, show: (raw) => raw.mode === 'field' },
      { key: 'B', label: '磁束密度 $B$', unit: 'T', type: 'num', def: '0.40', min: 0.00001, max: 100, show: (raw) => raw.mode === 'field' },
      { key: 'th', label: '電流と磁場のなす角 $\\theta$', unit: '°', type: 'num', def: '90', min: 0, max: 180, show: (raw) => raw.mode === 'field' },
      { key: 'I1', label: '電流 $I_{1}$', unit: 'A', type: 'num', def: '10', min: 0.001, max: 100000, show: (raw) => raw.mode === 'parallel' },
      { key: 'I2', label: '電流 $I_{2}$', unit: 'A', type: 'num', def: '6.0', min: 0.001, max: 100000, show: (raw) => raw.mode === 'parallel' },
      { key: 'd', label: '導線の間隔 $d$', unit: 'm', type: 'num', def: '0.10', min: 0.0001, max: 1000, show: (raw) => raw.mode === 'parallel' },
      { key: 'same', label: '2 本の電流の向き', type: 'select', def: 'same', options: [['same', '同じ向き'], ['opp', '逆向き']], show: (raw) => raw.mode === 'parallel' },
      { key: 'l', label: '導線の長さ $l$', unit: 'm', type: 'num', def: '0.30', min: 0.0001, max: 1000 }
    ],
    examples: [
      { label: '磁場に垂直な導線（5.0 A）', v: { mode: 'field', I: '5.0', B: '0.40', th: '90', l: '0.30' } },
      { label: '磁場と 30° をなす導線', v: { mode: 'field', I: '2.0', B: '0.50', th: '30', l: '0.60' } },
      { label: '平行電流（同じ向き）', v: { mode: 'parallel', I1: '10', I2: '6.0', d: '0.10', same: 'same', l: '1.0' } },
      { label: '平行電流（逆向き）', v: { mode: 'parallel', I1: '20', I2: '30', d: '0.050', same: 'opp', l: '2.0' } }
    ],
    intro: {
      easy: R`モーターが回るのは、磁石の磁場の中にある導線に電流を流すと、導線が**力を受けて動く**からです。この力の大きさは「電流 × 磁場の強さ × 導線の長さ」、向きは**フレミングの左手の法則**で決まります。また、電流どうしも磁場を通して力を及ぼしあいます。平行な 2 本の導線では、電流が同じ向きなら**引き合い**、逆向きなら**反発**します。`,
      normal: R`磁場中の導線が受ける力は $F = IBl\sin\theta$（向きは左手の法則）。平行電流は、一方がつくる磁場 $B_{1} = \dfrac{\mu_{0}I_{1}}{2\pi d}$ の中に他方があると考えて $\dfrac{F}{l} = I_{2}B_{1}$ を求めます。`,
      pro: R`磁場が斜めのときは $B\sin\theta$（導線に垂直な成分）だけが効きます。平行電流の力は「電流の積に比例・距離に反比例」で、同じ向き=引力・逆向き=斥力。つり合いの問題では、この力を他の力（重力・張力）とベクトルで合成します。`
    },
    compute(v) {
      if (v.mode === 'field') {
        let sinT = Math.sin(v.th * Math.PI / 180);
        if (Math.abs(sinT) < 1e-9) sinT = 0;
        const F = v.I * v.B * v.l * sinT;
        if (!isFinite(F)) throw new JK.CalcError('値が大きすぎて計算できません。');
        const s = { F: F, Bp: v.B * sinT };
        const p = { I: v.I, B: v.B, l: v.l, th: v.th };
        return {
          result: [
            { label: '導線が受ける力 F', tex: sig(F) + un('N') },
            { label: '導線に垂直な磁場の成分 B sinθ', tex: sig(s.Bp) + un('T') },
            { label: '力の向き', tex: sinT === 0 ? R`\text{力ははたらかない}` : R`\text{電流・磁場に垂直（左手の法則）}` }
          ],
          steps: stepsForce('field', p, s),
          fig: figForce(p, F)
        };
      }
      const same = v.same !== 'opp';
      const B1 = MU0 * v.I1 / (2 * Math.PI * v.d), f = v.I2 * B1, F = f * v.l;
      if (!isFinite(F)) throw new JK.CalcError('値が大きすぎて計算できません。');
      const s = { B1: B1, f: f, F: F };
      const p = { I1: v.I1, I2: v.I2, d: v.d, l: v.l, same: same };
      return {
        result: [
          { label: '導線 1 が導線 2 の位置につくる磁場 B₁', tex: sig(B1) + un('T') },
          { label: '単位長さあたりの力 f = F/l', tex: sig(f) + un('N/m') },
          { label: '長さ l の部分にはたらく力 F', tex: sig(F) + un('N') },
          { label: '力の向き', tex: same ? R`\text{引き合う（引力）}` : R`\text{反発しあう（斥力）}` }
        ],
        steps: stepsForce('parallel', p, s),
        fig: figParallel(same, p, s)
      };
    },
    exercise(rng, level) {
      if (level === 'basic') {
        const I = rng.pick([2.0, 4.0, 5.0, 10]), B = rng.pick([0.10, 0.20, 0.40, 0.50]), l = rng.pick([0.10, 0.20, 0.30, 0.50]);
        const F90 = I * B * l, F30 = F90 * 0.5;
        const p = { I: I, B: B, l: l, th: 90 };
        const sol = stepsForce('field', p, { F: F90, Bp: B }).slice(0, 2);
        sol.push({
          t: R`導線を傾けたとき（$\theta = 30\degree$）`,
          m: [R`F' = IBl\sin 30\degree = ` + sig(F90) + R` \times \frac{1}{2} = ` + sig(F30) + un('N')],
          n: R`磁場に垂直な成分が $B\sin 30\degree = \dfrac{B}{2}$ になるので、力は $\theta = 90\degree$ のときの $\dfrac{1}{2}$ 倍です。`,
          easy: R`導線を磁場に対して傾けると、磁場が導線に「垂直に当たる」割合が減ります。$\sin 30\degree = \dfrac{1}{2}$ なので、力も半分になります。`
        });
        return {
          title: '磁場中の導線が受ける力',
          body: R`磁束密度 $` + sf(B) + R`\,\mathrm{T}$ の一様な磁場の中に、長さ $` + sf(l) + R`\,\mathrm{m}$ の直線状の導線を磁場に垂直に置き、$` + sf(I) + R`\,\mathrm{A}$ の電流を流した。次の問いに答えよ。`,
          fig: figForce(p, null),
          parts: [
            numPart('(1)', R`導線が磁場から受ける力の大きさ $F$`, F90, 'N'),
            numPart('(2)', R`導線を回転させて、電流の向きと磁場のなす角を $30\degree$ にしたときの力の大きさ $F'$`, F30, 'N')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        let I1, I2, dd, l;
        for (let k = 0; k < 80; k++) {
          I1 = rng.pick([5.0, 10, 20, 30]); I2 = rng.pick([2.0, 4.0, 5.0, 10, 15]); dd = rng.pick([0.10, 0.20, 0.50, 0.050]); l = rng.pick([0.50, 1.0, 2.0]);
          if (I1 !== I2) break;
        }
        const same = rng.bool();
        const B1 = MU0 * I1 / (2 * Math.PI * dd), f = I2 * B1, F = f * l;
        const p = { I1: I1, I2: I2, d: dd, l: l, same: same };
        return {
          title: '平行な 2 本の導線の間の力',
          body: R`真空中で、$` + sf(dd) + R`\,\mathrm{m}$ 離れた平行な 2 本の十分に長い直線導線 1, 2 に、` + (same ? '同じ向きに' : '互いに逆向きに') + R`それぞれ電流 $I_{1} = ` + sf(I1) + R`\,\mathrm{A}$、$I_{2} = ` + sf(I2) + R`\,\mathrm{A}$ を流した。真空の透磁率を $\mu_{0} = 4\pi \times 10^{-7}\,\mathrm{N/A^{2}}$ とする。次の問いに答えよ。`,
          fig: figParallel(same, p, null),
          parts: [
            numPart('(1)', R`導線 1 が導線 2 の位置につくる磁束密度の大きさ $B_{1}$`, B1, 'T'),
            numPart('(2)', R`導線 2 の長さ $1\,\mathrm{m}$ あたりにはたらく力の大きさ $f$`, f, 'N/m'),
            numPart('(3)', R`導線 2 の長さ $` + sf(l) + R`\,\mathrm{m}$ の部分にはたらく力の大きさ $F$`, F, 'N')
          ],
          solution: stepsForce('parallel', p, { B1: B1, f: f, F: F })
        };
      }
      // adv: 磁場中でつるした導体棒のつり合い
      let m, l, B, I, F, W, tn;
      for (let k = 0; k < 200; k++) {
        m = rng.pick([0.020, 0.040, 0.050, 0.10]); l = rng.pick([0.20, 0.30, 0.50]); B = rng.pick([0.10, 0.20, 0.50]); I = rng.pick([2.0, 4.0, 5.0, 10]);
        F = I * B * l; W = m * G; tn = F / W;
        if (tn > 0.2 && tn < 1.5 && ok3(W) && ok3(F)) break;
      }
      const th = Math.atan(tn) * 180 / Math.PI;
      const sol = [
        {
          t: '棒にはたらく力を図示する',
          n: R`棒には、重力 $mg$（鉛直下向き）、磁場から受ける力 $F$（磁場は鉛直上向きで電流は水平なので、**水平方向**）、導線の張力 $T$（導線に沿って上向き）の 3 力がはたらきます。静止しているので、3 力はつり合っています。`,
          easy: R`静止している物体にはたらく力は、必ずつり合っています。この棒には 3 つの力（重力・磁場の力・導線がひっぱる力）がはたらいています。力のつり合いは、**水平方向と鉛直方向に分けて**考えるのがコツです。`,
          pro: R`磁場が鉛直なら、電流が水平のとき力は水平方向（$F = IBl$）です。向きは左手の法則で決まりますが、大きさだけを問われているなら、図の傾きから向きは分かります。`
        },
        {
          t: '磁場から受ける力と重力の大きさ',
          m: [R`F = IBl = ` + nice(I) + R` \times ` + nice(B) + R` \times ` + nice(l) + ' = ' + sig(F) + un('N'), R`mg = ` + nice(m) + R` \times 9.8 = ` + sig(W) + un('N')],
          n: R`磁場と電流は垂直（$\sin\theta = 1$）なので $F = IBl$ です。`,
          easy: R`磁場の力の公式 $F = IBl$ に、電流・磁束密度・棒の長さをそのまま代入します。重力は質量 × 重力加速度 $9.8$ です。`
        },
        {
          t: 'つり合いの式から傾きを求める',
          m: [R`\text{鉛直: } T\cos\theta = mg`, R`\text{水平: } T\sin\theta = F`, R`\tan\theta = \frac{F}{mg} = \frac{` + sig(F) + '}{' + sig(W) + '} = ' + sig(tn), R`\theta \fallingdotseq ` + sig(th) + R`\degree`],
          n: R`張力 $T$ を鉛直成分 $T\cos\theta$ と水平成分 $T\sin\theta$ に分け、それぞれが重力・磁場の力とつり合います。2 式の比をとると $T$ が消えて $\tan\theta = \dfrac{F}{mg}$ となります。`,
          easy: R`鉛直方向では「上向きの $T\cos\theta$ ＝ 下向きの $mg$」、水平方向では「$T\sin\theta$ ＝ 磁場の力 $F$」が成り立ちます。2 つの式を割り算すると、分からない $T$ がきれいに消えて、傾きの $\tan$ が求まります。`,
          pro: R`3 力がつり合う問題では「張力を消すために水平・鉛直の式を割る」のが定石です。$\tan\theta = \dfrac{F}{mg}$ は覚えておくと速いです。`
        }
      ];
      return {
        title: '磁場中でつるした導体棒の傾き',
        body: R`質量 $` + sf(m) + R`\,\mathrm{kg}$、長さ $` + sf(l) + R`\,\mathrm{m}$ の一様な導体棒を、軽くて柔らかい 2 本の導線で水平につるし、鉛直上向きの一様な磁場（磁束密度 $` + sf(B) + R`\,\mathrm{T}$）の中に置いた。棒に $` + sf(I) + R`\,\mathrm{A}$ の電流を流したところ、導線は鉛直方向から傾いて、棒が静止した。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ として、次の問いに答えよ。`,
        fig: figHang(th),
        parts: [
          numPart('(1)', R`棒が磁場から受ける力の大きさ $F$`, F, 'N'),
          numPart('(2)', R`棒にはたらく重力の大きさ $mg$`, W, 'N'),
          numPart('(3)', R`導線が鉛直方向となす角を $\theta$ としたときの $\tan\theta$`, tn, '')
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     3. ローレンツ力と荷電粒子の円運動
     ===================================================================== */

  const PARTICLES = {
    electron: { name: '電子', q: -QE, m: ME },
    proton: { name: '陽子', q: QE, m: MP },
    alpha: { name: 'α粒子', q: 2 * QE, m: MA }
  };
  function particleOf(v) {
    if (v.kind === 'custom') return { name: '荷電粒子', q: v.zc * QE, m: v.mu * AMU };
    return PARTICLES[v.kind] || PARTICLES.electron;
  }
  // pi: 円周率（周期 T を問う演習では問題文どおり 3.14 を渡す。省略すると Math.PI）
  function solveLor(pt, B, vel, pi) {
    const q = Math.abs(pt.q), m = pt.m;
    return { F: q * vel * B, r: m * vel / (q * B), T: 2 * (pi || Math.PI) * m / (q * B), K: 0.5 * m * vel * vel };
  }

  // 一様な磁場（紙面に垂直）の中の円軌道。s = null なら r, T を図に書かない
  function figOrbit(pos, bin, p, s) {
    const d = JK.plot.draw(380, 244);
    const sg = (pos === bin) ? 1 : -1;       // +1: 反時計回り、-1: 時計回り
    const cx = 190, cy = 124, R0 = 70;
    for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) {
      const x = 28 + i * 54, y = 48 + j * 48, dist = Math.hypot(x - cx, y - cy);
      if (dist > R0 - 12 && dist < R0 + 12) continue;
      outIn(d, x, y, !bin, 4.2, 'dim');
    }
    d.circle(cx, cy, R0, { cls: 'c2', w: 1.8 });
    [0, Math.PI / 2, Math.PI].forEach((a) => {
      const q = pol(cx, cy, R0, a), tX = -Math.sin(a) * sg, tY = -Math.cos(a) * sg;
      d.arrow(q[0] - tX * 6, q[1] - tY * 6, q[0] + tX * 8, q[1] + tY * 8, { cls: 'c2', w: 1.8 });
    });
    const ey = sg > 0 ? cy + R0 : cy - R0;       // 入射点（反時計回りなら下、時計回りなら上）
    d.arrow(cx, ey, cx + 56, ey, { cls: 'c1', w: 2.4, label: 'v' });
    d.arrow(cx, ey, cx, ey - sg * 42, { cls: 'c3', w: 2.4, label: 'F', lpos: -1 });
    chargeSym(d, cx, ey, pos, 8);
    d.dot(cx, cy, { cls: 'fg', r: 2.6 });
    d.line(cx, cy, cx + R0, cy, { cls: 'dim', dash: true, w: 1 });
    d.text(cx + R0 / 2, cy - 6, 'r', { italic: true });
    d.text(14, 16, 'B = ' + tx(p.B) + ' T（' + (bin ? '紙面の裏向き ⊗' : '紙面の表向き ⊙') + '）', { anchor: 'start', size: 11 });
    if (s) {
      d.text(366, 16, sg > 0 ? '反時計回り' : '時計回り', { anchor: 'end', size: 11, cls: 'c2' });
      d.text(190, 238, 'r = mv/(|q|B) = ' + tx3(s.r) + ' m ／ T = 2πm/(|q|B) = ' + tx3(s.T) + ' s', { cls: 'dim', size: 11 });
    }
    return d.svg();
  }

  // 質量分析器の図（磁場は紙面の表向き ⊙。イオンは下から入って右へ曲がる）
  function figSpectro(r1, r2) {
    const d = JK.plot.draw(380, 236);
    const yp = 170, xs = 50, a = 56;          // イオン 1 の半径を 56 px とし、イオン 2 は差を強調して描く（模式図）
    const b = a + Math.max(12, Math.min(34, (r2 / r1 - 1) * 3 * a));
    for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) outIn(d, 110 + i * 34, 28 + j * 34, true, 4.2, 'dim');
    d.hatch(20, yp, 360, yp, { side: 1 });
    d.path('M ' + xs + ' ' + yp + ' A ' + a + ' ' + a + ' 0 0 1 ' + (xs + 2 * a) + ' ' + yp, { cls: 'c1', w: 2 });
    d.path('M ' + xs + ' ' + yp + ' A ' + b + ' ' + b + ' 0 0 1 ' + (xs + 2 * b) + ' ' + yp, { cls: 'c2', w: 2 });
    d.arrow(xs, yp + 34, xs, yp + 3, { cls: 'c4', w: 2.2 });
    d.text(xs - 6, yp + 26, 'スリット', { anchor: 'end', size: 11 });
    d.text(xs + 2 * a, yp + 20, 'イオン 1', { cls: 'c1', size: 11 });
    d.text(xs + 2 * b + 6, yp + 34, 'イオン 2', { cls: 'c2', size: 11, anchor: 'start' });
    d.line(xs + 2 * a, yp - 4, xs + 2 * a, yp - 26, { cls: 'dim', dash: true, w: 1 });
    d.line(xs + 2 * b, yp - 4, xs + 2 * b, yp - 26, { cls: 'dim', dash: true, w: 1 });
    dimLine(d, xs + 2 * a, yp - 20, xs + 2 * b, yp - 20);
    d.text(xs + a + b, yp - 32, 'Δ', { italic: true });
    d.text(190, 230, '※ 図は模式図（イオン 2 の半径は強調して描いてある）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // p.pi: 問題文で指定した円周率（演習は 3.14。周期の式に書く。省略（計算機）は π のまま）
  // p.ex: 演習（F を問う設問があるので、F を出すステップも lv 1 にする）
  function stepsLor(pt, p, s) {
    const pos = pt.q > 0;
    const qa = Math.abs(pt.q);
    const qT = Math.abs(pt.q / QE) === 1 ? R`1.6 \times 10^{-19}` : nice(qa);
    const zq = Math.round(qa / QE), qSym = zq === 1 ? 'e' : zq + 'e';      // 電気量の大きさ |q| = e, 2e, …
    const mT = nice(pt.m), Bt = nice(p.B);
    const twoPi = p.pi ? R`2 \times ` + nice(p.pi) : R`2\pi`;
    // 電圧で加速した粒子の速さ v は割り切れない。F と r に代入する v は、表示どおりに計算し直すと結果が合う桁数で見せる
    const vd = p.vmode === 'V' ? carry(p.vel, (h) => rd3(qa * h * p.B) === rd3(s.F) && rd3(pt.m * h / (qa * p.B)) === rd3(s.r)) : null;
    const vT = vd ? vd.t : nice(p.vel);
    const noteV = vd && vd.k > 3 ? R`$v$ は、3 桁に丸める前の値 $` + vd.t + R`\,\mathrm{m/s}$ を使います。` : '';
    const sg = (pos === p.bin) ? 1 : -1;
    const steps = [];
    steps.push({
      t: 'ローレンツ力の向き',
      n: R`磁場の中を運動する荷電粒子は、**速度と磁場の両方に垂直な向き**に力（**ローレンツ力**）を受けます。向きは左手の法則（中指を電流の向き、人差し指を磁場の向きにすると親指が力の向き）で決めます。電流の向きは、` + (pos ? '正電荷では速度の向きと同じ' : '負電荷（電子など）では速度と**逆向き**') + R`です。以下、電気量の大きさを $|q|$ と書きます（今回は $|q| = ` + qSym + ' = ' + qT + R`\,\mathrm{C}$）。`,
      easy: R`ローレンツ力は、磁場の中で**動いている電気**にはたらく力です。導線の電流が磁場から受ける力は、じつは導線の中を動く電荷 1 つ 1 つが受けるローレンツ力の合計です。止まっている電荷には力がはたらきません。力はいつも進行方向に対して**直角**なので、粒子は進路を曲げられます。`,
      pro: R`向きの判定は「正電荷の速度の向き = 電流の向き」と読みかえて左手の法則を使います。負電荷は速度と逆向きを電流の向きにします。`
    });
    if (p.vmode === 'V') {
      steps.push({
        t: '電圧で加速された粒子の速さ',
        m: [R`|q|V = \frac{1}{2}mv^{2} \;\Rightarrow\; v = \sqrt{\frac{2|q|V}{m}}`, R`v = \sqrt{\frac{2 \times ` + qT + R` \times ` + nice(p.V) + '}{' + mT + '}} = ' + ext(vd) + un('m/s')],
        n: R`静止していた粒子が電圧 $V$ の間で加速されると、電場がした仕事 $|q|V$ が運動エネルギー $\frac{1}{2}mv^{2}$ になります。`,
        easy: R`坂道を下るボールが速くなるように、電圧（電気の高低差）を下る荷電粒子は速くなります。電場が荷電粒子にした仕事（$|q|V$）が、そのまま運動エネルギーになったと考えれば、速さが求まります。`,
        pro: R`加速電圧で入射する問題では、$v$ を消去して $r = \dfrac{1}{B}\sqrt{\dfrac{2mV}{|q|}}$ と表せます。$m/|q|$ の違いが半径の違いになります。`
      });
    }
    steps.push({
      t: 'ローレンツ力の大きさ',
      m: [R`F = |q|vB`, R`F = ` + qT + R` \times ` + vT + R` \times ` + Bt + ' = ' + sig(s.F) + un('N')],
      n: R`速度が磁場に垂直なとき、ローレンツ力の大きさは電気量の大きさ $|q|$・速さ $v$・磁束密度 $B$ の積です。` + noteV,
      easy: R`電気量が大きいほど、速いほど、磁場が強いほど、ローレンツ力は大きくなります。電流が磁場から受ける力 $F = IBl$ の「$Il$」の部分が、1 個の電荷では「$qv$」にあたります。`,
      lv: p.ex ? 1 : 2
    });
    steps.push({
      t: '円運動の運動方程式から半径を求める',
      m: [R`m\frac{v^{2}}{r} = |q|vB \;\Rightarrow\; r = \frac{mv}{|q|B}`, R`r = \frac{` + mT + R` \times ` + vT + '}{' + qT + R` \times ` + Bt + '} = ' + sig(s.r) + un('m')],
      n: R`ローレンツ力は常に速度に垂直なので、粒子の**速さは変わらず**（力が仕事をしない）、向きだけが変わります。この力が向心力となって**等速円運動**をします。向心力 $= m\dfrac{v^{2}}{r}$ をローレンツ力 $|q|vB$ に等しいとおきます。` + noteV,
      easy: R`ひもの先に付けたボールを回すと、ひもが引く力が向心力になって円運動します。磁場の中の荷電粒子では、ローレンツ力が「見えないひも」の役目をします。力が進行方向に対して直角にはたらき続けるので、速さは同じまま、進む向きだけが変わり続けて円を描きます。`,
      pro: R`$r = \dfrac{mv}{|q|B} = \dfrac{p}{|q|B}$。運動量 $p$ に比例し、$B$ に反比例します。同じ速さなら質量が大きい粒子ほど大きな円になります。`
    });
    steps.push({
      t: '周期を求める',
      m: [R`T = \frac{2\pi r}{v} = \frac{2\pi m}{|q|B}`, R`T = \frac{` + twoPi + R` \times ` + mT + '}{' + qT + R` \times ` + Bt + '} = ' + sig(s.T) + un('s')],
      n: R`1 周の長さ $2\pi r$ を速さ $v$ で割れば周期です。$r = \dfrac{mv}{|q|B}$ を代入すると $v$ が消え、**周期は粒子の速さによらない**ことが分かります。`,
      easy: R`速い粒子は大きな円を描くので、1 周の道のりは長くなりますが、そのぶん速く走ります。この 2 つが打ち消しあって、**1 周にかかる時間は速さに関係なく同じ**になります。この性質を利用した加速器がサイクロトロンです。`,
      pro: R`$T = \dfrac{2\pi m}{|q|B}$ は $v$ も $r$ も含まない形。$q/m$ と $B$ だけで決まります。`
    });
    steps.push({
      t: '回る向きの決め方',
      n: R`磁場が` + (p.bin ? '紙面の裏向き（⊗）' : '紙面の表向き（⊙）') + R`のとき、` + (pos ? '正電荷' : '負電荷') + R`は` + (sg > 0 ? '**反時計回り**' : '**時計回り**') + R`に回ります（正電荷と負電荷では回る向きが逆になります）。`,
      easy: R`同じ磁場の中でも、正電荷と負電荷は逆向きに回ります。向きは、速度の向きと磁場の向きから左手の法則で力の向きを決め、その力が「円の中心」を向くように考えれば分かります。`,
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'em-lorentz',
    field: '電磁気',
    unit: 'p-mag',
    title: 'ローレンツ力と荷電粒子の円運動',
    desc: R`一様な磁場に垂直に入射した荷電粒子（電子・陽子・α粒子など）が受けるローレンツ力 $F = |q|vB$、円運動の半径 $r = \dfrac{mv}{|q|B}$、周期 $T = \dfrac{2\pi m}{|q|B}$ を求めます。電圧で加速された粒子にも対応します。`,
    form: [R`F = |q|vB`, R`m\frac{v^{2}}{r} = |q|vB \;\Rightarrow\; r = \frac{mv}{|q|B}`, R`T = \frac{2\pi r}{v} = \frac{2\pi m}{|q|B}`],
    inputs: [
      { key: 'kind', label: '荷電粒子', type: 'select', def: 'electron', options: [['electron', '電子（q = −e, m = 9.1×10⁻³¹ kg）'], ['proton', '陽子（q = +e, m = 1.67×10⁻²⁷ kg）'], ['alpha', 'α粒子（q = +2e, m = 6.64×10⁻²⁷ kg）'], ['custom', '任意のイオン（電荷 ze・質量 m u）']] },
      { key: 'zc', label: '電荷数 $z$（q = ze）', type: 'int', def: '1', min: -10, max: 10, hint: '負のイオンは負の整数', show: (raw) => raw.kind === 'custom' },
      { key: 'mu', label: '質量 $m$（原子質量単位 u）', unit: 'u', type: 'num', def: '20', min: 0.0005, max: 500, hint: '1 u = 1.66×10⁻²⁷ kg', show: (raw) => raw.kind === 'custom' },
      { key: 'vmode', label: '速さの与え方', type: 'select', def: 'v', options: [['v', '速さ v を直接入力'], ['V', '電圧 V で静止状態から加速（v を求める）']] },
      { key: 'v', label: '速さ $v$', unit: 'm/s', type: 'num', def: '2.0e6', min: 1, max: 30000000, hint: '光速の 1/10（3.0×10⁷ m/s）以下で入力', show: (raw) => raw.vmode === 'v' },
      { key: 'V', label: '加速電圧 $V$', unit: 'V', type: 'num', def: '1000', min: 0.001, max: 100000, show: (raw) => raw.vmode === 'V' },
      { key: 'B', label: '磁束密度 $B$', unit: 'T', type: 'num', def: '0.0010', min: 0.000001, max: 100 },
      { key: 'bdir', label: '磁場の向き', type: 'select', def: 'in', options: [['in', '紙面の裏向き（⊗）'], ['out', '紙面の表向き（⊙）']] }
    ],
    examples: [
      { label: '電子（2.0×10⁶ m/s・0.0010 T）', v: { kind: 'electron', vmode: 'v', v: '2.0e6', B: '0.0010', bdir: 'in' } },
      { label: '陽子を 1000 V で加速', v: { kind: 'proton', vmode: 'V', V: '1000', B: '0.10', bdir: 'in' } },
      { label: 'α粒子（磁場が表向き）', v: { kind: 'alpha', vmode: 'v', v: '1.0e6', B: '0.50', bdir: 'out' } },
      { label: '任意のイオン（質量 20 u・+e）', v: { kind: 'custom', zc: '1', mu: '20', vmode: 'V', V: '1000', B: '0.50', bdir: 'in' } }
    ],
    intro: {
      easy: R`磁場の中を**動いている電気**（荷電粒子）は、進む向きに対して**直角**に力を受けます。これが**ローレンツ力**です。力がいつも進行方向に直角なので、粒子は速さを変えずに向きだけを変え続け、**円**を描きます。磁場が強いほど小さな円、粒子が重くて速いほど大きな円になります。1 周する時間（周期）は、速さに関係なく粒子の種類と磁場だけで決まります。`,
      normal: R`ローレンツ力 $F = |q|vB$ が向心力となって等速円運動をします。$m\dfrac{v^{2}}{r} = |q|vB$ より $r = \dfrac{mv}{|q|B}$、周期 $T = \dfrac{2\pi m}{|q|B}$。電圧 $V$ で加速された粒子では $\dfrac{1}{2}mv^{2} = |q|V$ から $v$ を求めます。`,
      pro: R`$r = \dfrac{p}{|q|B}$、$T = \dfrac{2\pi m}{|q|B}$（$v$ によらない）は必ず押さえます。加速電圧 $V$ からは $r = \dfrac{1}{B}\sqrt{\dfrac{2mV}{|q|}}$。質量分析器では $r \propto \sqrt{m}$ を使って同位体を分離します。`
    },
    compute(v) {
      const pt = particleOf(v);
      if (!(pt.m > 0)) throw new JK.CalcError('質量は正の値にしてください。');
      if (!(Math.abs(pt.q) > 0)) throw new JK.CalcError('電荷数 z は 0 以外にしてください（電気を帯びていない粒子は磁場から力を受けません）。');
      const vmode = v.vmode === 'V' ? 'V' : 'v';
      const vel = vmode === 'V' ? Math.sqrt(2 * Math.abs(pt.q) * v.V / pt.m) : v.v;
      if (!(vel > 0) || !isFinite(vel)) throw new JK.CalcError('速さを正の値で入力してください。');
      if (vel > 0.1 * C0) throw new JK.CalcError('速さが光速の 1/10（3.0×10⁷ m/s）を超えます。この計算は相対性理論が不要な範囲でのみ成り立つので、電圧や速さを小さくしてください。');
      const bin = v.bdir !== 'out';
      const s = solveLor(pt, v.B, vel);
      if (!isFinite(s.r) || !isFinite(s.T) || !isFinite(s.F)) throw new JK.CalcError('この入力では計算できません。値を見直してください。');
      const p = { B: v.B, vel: vel, V: v.V, vmode: vmode, bin: bin };
      const sg = ((pt.q > 0) === bin) ? 1 : -1;
      const res = [];
      if (vmode === 'V') res.push({ label: '加速後の速さ v', tex: sig(vel) + un('m/s') });
      res.push({ label: 'ローレンツ力 F', tex: sig(s.F) + un('N') });
      res.push({ label: '円運動の半径 r', tex: sig(s.r) + un('m') });
      res.push({ label: '周期 T', tex: sig(s.T) + un('s') });
      res.push({ label: '回る向き（図の向きから見て）', tex: sg > 0 ? R`\text{反時計回り}` : R`\text{時計回り}` });
      return { result: res, steps: stepsLor(pt, p, s), fig: figOrbit(pt.q > 0, bin, p, s) };
    },
    exercise(rng, level) {
      const eDef = R`電気素量を $e = 1.6 \times 10^{-19}\,\mathrm{C}$、`;
      if (level === 'basic') {
        const isE = rng.bool();
        const pt = isE ? PARTICLES.electron : PARTICLES.proton;
        const vel = isE ? rng.pick([1.0e6, 2.0e6, 4.0e6]) : rng.pick([1.0e5, 2.0e5, 5.0e5]);
        const B = rng.pick([0.010, 0.020, 0.050, 0.10, 0.20]);
        const s = solveLor(pt, B, vel);
        const p = { B: B, vel: vel, V: 0, vmode: 'v', bin: true, ex: true };
        const mDef = isE ? R`電子の質量を $9.1 \times 10^{-31}\,\mathrm{kg}$` : R`陽子の質量を $1.67 \times 10^{-27}\,\mathrm{kg}$`;
        return {
          title: isE ? '磁場中の電子の運動' : '磁場中の陽子の運動',
          body: R`紙面に垂直で裏向きの一様な磁場（磁束密度 $` + sf(B) + R`\,\mathrm{T}$）に垂直に、速さ $` + sf(vel) + R`\,\mathrm{m/s}$ の` + pt.name + R`を入射させた。` + eDef + mDef + R` として、次の問いに答えよ（重力は無視する）。`,
          fig: figOrbit(pt.q > 0, true, p, null),
          parts: [
            numPart('(1)', pt.name + R`が受けるローレンツ力の大きさ $F$`, s.F, 'N'),
            numPart('(2)', R`円運動の半径 $r$`, s.r, 'm')
          ],
          solution: stepsLor(pt, p, s).filter((st) => st.t !== '周期を求める')
        };
      }
      if (level === 'mid') {
        const pt = rng.pick([PARTICLES.electron, PARTICLES.proton, PARTICLES.alpha]);
        const vel = pt === PARTICLES.electron ? rng.pick([1.0e6, 2.0e6, 3.0e6]) : rng.pick([1.0e5, 2.0e5, 4.0e5]);
        const B = rng.pick([0.020, 0.050, 0.10, 0.20, 0.50]);
        const s = solveLor(pt, B, vel, PI314);                 // 周期 T は、問題文の円周率 π = 3.14 で計算する
        const p = { B: B, vel: vel, V: 0, vmode: 'v', bin: rng.bool(), pi: PI314, ex: true };
        const mDef = pt === PARTICLES.electron ? R`電子の質量を $9.1 \times 10^{-31}\,\mathrm{kg}$` : (pt === PARTICLES.proton ? R`陽子の質量を $1.67 \times 10^{-27}\,\mathrm{kg}$` : R`α粒子の質量を $6.64 \times 10^{-27}\,\mathrm{kg}$、電気量を $+2e$`);
        return {
          title: '磁場中の荷電粒子の円運動',
          body: R`紙面に垂直で` + (p.bin ? '裏向き' : '表向き') + R`の一様な磁場（磁束密度 $` + sf(B) + R`\,\mathrm{T}$）の中に、` + pt.name + R`が磁場に垂直に速さ $` + sf(vel) + R`\,\mathrm{m/s}$ で入射した。` + eDef + mDef + R`、円周率を $\pi = 3.14$ として、次の問いに答えよ（重力は無視する）。`,
          fig: figOrbit(pt.q > 0, p.bin, p, null),
          parts: [
            numPart('(1)', R`ローレンツ力の大きさ $F$`, s.F, 'N'),
            numPart('(2)', R`円運動の半径 $r$`, s.r, 'm'),
            numPart('(3)', R`円運動の周期 $T$`, s.T, 's')
          ],
          solution: stepsLor(pt, p, s)
        };
      }
      // adv: 質量分析器（2 種類のイオンの着地点の差）
      let V, B, A1, A2, r1, r2;
      for (let k = 0; k < 300; k++) {
        V = rng.pick([500, 1000, 2000]); B = rng.pick([0.20, 0.50, 1.0]); A1 = rng.pick([12, 14, 20, 35]); A2 = A1 + rng.pick([1, 2, 4]);
        r1 = Math.sqrt(2 * A1 * AMU * V / QE) / B; r2 = Math.sqrt(2 * A2 * AMU * V / QE) / B;
        if (2 * (r2 - r1) > 0.005 && 2 * r2 < 0.5) break;
      }
      const m1 = A1 * AMU;
      const v1 = Math.sqrt(2 * QE * V / m1);
      const dlt = 2 * (r2 - r1);
      // v₁ → r₁ → r₂ → Δ と、表示した値を次の式に代入していく。各段の結果は、表示した桁の値から計算し直して丸める。
      // 答え（v₁, r₁, Δ の 3 桁）と一致する範囲で、見せる桁数がなるべく少ない組（v₁, r₁, r₂ の桁数。3 桁から）を探す。
      // 差 Δ をとると桁が減るので、r₂ だけ 4 桁以上にすることが多い
      const rho = Math.sqrt(A2 / A1);          // r₂ / r₁ = √(m₂/m₁) = √(質量数の比)
      const link = (kv, kr, k2) => {
        const v1k = U.roundSig(v1, kv), r1u = m1 * v1k / (QE * B), r1k = U.roundSig(r1u, kr), r2k = U.roundSig(r1k * rho, k2);
        return {
          kv: kv, kr: kr, k2: k2, v1k: v1k, r1k: r1k, r2k: r2k,
          ok: rd3(v1k) === rd3(v1) && rd3(r1u) === rd3(r1) && rd3(r1k) === rd3(r1) && rd3(2 * r2k - 2 * r1k) === rd3(dlt)
        };
      };
      let ch = null;
      for (let mx = 3; mx <= 8 && !ch; mx++) {
        for (let a = 3; a <= mx; a++) for (let b = 3; b <= mx; b++) for (let c = 3; c <= mx; c++) {
          if (Math.max(a, b, c) !== mx) continue;
          const t = link(a, b, c);
          if (t.ok && (!ch || a + b + c < ch.kv + ch.kr + ch.k2)) ch = t;
        }
      }
      if (!ch) ch = link(9, 9, 9);
      const kt = (x, k) => U.sig(x, k);
      // 結果の表示。4 桁以上なら「0.06310 ≒ 0.0631」のように、3 桁の値を添える
      const fin = (x, k) => (k > 3 ? U.sig(x, k) + R` \fallingdotseq ` + U.sig(x, 3) : U.sig(x, 3));
      const sol = [
        {
          t: '電圧で加速されたイオンの速さ',
          m: [R`eV = \frac{1}{2}m_{1}v_{1}^{2} \;\Rightarrow\; v_{1} = \sqrt{\frac{2eV}{m_{1}}}`, R`v_{1} = \sqrt{\frac{2 \times 1.6 \times 10^{-19} \times ` + nice(V) + '}{' + nice(m1) + '}} = ' + fin(ch.v1k, ch.kv) + un('m/s')],
          n: R`静止していたイオンが電圧 $V$ で加速され、電場がした仕事 $eV$ が運動エネルギーになります。質量は $m_{1} = ` + A1 + R` \times 1.66 \times 10^{-27} = ` + nice(m1) + R`\,\mathrm{kg}$ です。`,
          easy: R`イオンの質量は「質量数 × $1.66 \times 10^{-27}\,\mathrm{kg}$」で求めます。電圧を下る間に電場がイオンにした仕事（$eV$）が、全部運動エネルギーになったと考えると速さが求まります。`
        },
        {
          t: '磁場中の円運動の半径',
          m: [R`m_{1}\frac{v_{1}^{2}}{r_{1}} = ev_{1}B \;\Rightarrow\; r_{1} = \frac{m_{1}v_{1}}{eB}`, R`r_{1} = \frac{` + nice(m1) + R` \times ` + kt(ch.v1k, ch.kv) + R`}{1.6 \times 10^{-19} \times ` + nice(B) + '} = ' + fin(ch.r1k, ch.kr) + un('m')],
          n: R`磁場に垂直に入射したイオンは、ローレンツ力が向心力となって等速円運動（半円）をします。スリットから**直径 $2r_{1}$** だけ離れた点に着地します。` +
            (ch.kv > 3 ? R`$v_{1}$ は、3 桁に丸める前の値 $` + kt(ch.v1k, ch.kv) + R`\,\mathrm{m/s}$ を使います。` : ''),
          easy: R`磁場に入ったイオンは、半円を描いてスリットのある面にもどってきます。着地する点は、スリットから円の**直径**（半径の 2 倍）だけ離れた位置です。`,
          pro: R`$r = \dfrac{1}{B}\sqrt{\dfrac{2mV}{e}}$ なので $r \propto \sqrt{m}$。質量が異なるイオンは着地点が違うので、同位体を分けられます。`
        },
        {
          t: '2 種類のイオンの着地点の差',
          m: [R`r_{2} = r_{1}\sqrt{\frac{m_{2}}{m_{1}}} = ` + kt(ch.r1k, ch.kr) + R` \times \sqrt{\frac{` + A2 + '}{' + A1 + '}} = ' + fin(ch.r2k, ch.k2) + un('m'), R`\Delta = 2r_{2} - 2r_{1} = 2 \times ` + kt(ch.r2k, ch.k2) + R` - 2 \times ` + kt(ch.r1k, ch.kr) + ' = ' + sig(dlt) + un('m')],
          n: R`イオン 2 の質量は $m_{2} = ` + A2 + R` \times 1.66 \times 10^{-27}\,\mathrm{kg}$。同じ電圧・同じ磁場なので、半径の比は $\dfrac{r_{2}}{r_{1}} = \sqrt{\dfrac{m_{2}}{m_{1}}}$ です（質量の比は質量数の比 $\dfrac{` + A2 + '}{' + A1 + R`}$ に等しい）。着地点の間隔は $2r_{2} - 2r_{1}$ です。` +
            (ch.kr > 3 ? R`差をとると有効数字が減るので、$r_{1}$、$r_{2}$ は 3 桁に丸めず、多めの桁を残して計算します。` : (ch.k2 > 3 ? R`差をとると有効数字が減るので、$r_{2}$ は 3 桁に丸めず、多めの桁を残して計算します。` : '')),
          easy: R`同じ電圧・同じ磁場でも、重いイオンほど大きな半円を描きます（半径は質量の平方根に比例）。2 つの半円の直径の差が、着地点の間隔です。この差を測れば、質量のちがう原子（同位体）を見分けられます。`
        }
      ];
      return {
        title: '質量分析器（同位体の分離）',
        body: R`図のように、スリットを通った質量数 $` + A1 + R`$ と $` + A2 + R`$ の 1 価の陽イオン（電気量 $+e$）を、電圧 $` + sf(V) + R`\,\mathrm{V}$ で静止状態から加速したあと、紙面に垂直な表向きの一様な磁場（磁束密度 $` + sf(B) + R`\,\mathrm{T}$）に、磁場に垂直に入射させた。イオンは半円を描き、スリットのある面にもどった。電気素量を $e = 1.6 \times 10^{-19}\,\mathrm{C}$、$1\,\mathrm{u} = 1.66 \times 10^{-27}\,\mathrm{kg}$（イオンの質量は質量数 $\times\,1\,\mathrm{u}$ とする）として、次の問いに答えよ。`,
        fig: figSpectro(r1, r2),
        parts: [
          numPart('(1)', R`質量数 $` + A1 + R`$ のイオンが磁場に入るときの速さ $v_{1}$`, v1, 'm/s'),
          numPart('(2)', R`質量数 $` + A1 + R`$ のイオンの円運動の半径 $r_{1}$`, r1, 'm'),
          numPart('(3)', R`2 種類のイオンが面に着地する点の間隔 $\Delta$`, dlt, 'm', { rel: 0.05 })
        ],
        solution: sol
      };
    }
  });
})();
