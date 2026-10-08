/* 物理・電磁気 — 静電気: クーロンの法則 / 点電荷の電場と電位 / コンデンサー / 一様な電場中の荷電粒子
   構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  // 有効数字 3 桁の四捨五入（4.425 のようにちょうど半端な値は 4.43 に切り上げる）。
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
  const K = 9.0e9;          // クーロンの法則の比例定数 [N·m²/C²]
  const EPS0 = 8.85e-12;    // 真空の誘電率 [F/m]
  const QE = 1.6e-19;       // 電気素量 [C]
  const ME = 9.1e-31;       // 電子の質量 [kg]
  const MP = 1.67e-27;      // 陽子の質量 [kg]
  const MA = 6.64e-27;      // α粒子の質量 [kg]
  const C0 = 3.0e8;         // 光速 [m/s]
  const MU = R`\mu `;       // 単位の接頭辞 μ（\mathrm の中では立体になる）
  const uF = MU + 'F', uC = MU + 'C', uJ = MU + 'J';

  // 式に代入する数の表示用。与えた入力（とその単位換算）は、丸めずにそのまま見せる（有効数字 12 桁まで。2 進数の誤差だけを除く）。
  // 4 桁などに丸めて見せると、入力が 5 桁以上のとき、表示の数値で計算した結果が合わなくなる。極端に大小の値は指数表記
  function nice(x, digits) {
    if (!isFinite(x) || x === 0) return '0';
    const dg = digits || 12;
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12);
    if (e >= -3 && e <= 6) return String(Number(x.toPrecision(dg)));
    let m = Number((x / Math.pow(10, e)).toPrecision(dg)), ee = e;
    if (Math.abs(m) >= 10) { m /= 10; ee += 1; }
    return m + R` \times 10^{` + ee + '}';
  }
  // 割り切れない途中の値の表示用（0.3333 など 4 桁）と、無理数になる距離などの表示用（6 桁）。
  // 表示の桁数で計算したとき、3 桁の結果と最後の桁まで合うことを simcheck で確かめて使う
  const nice4 = (x) => nice(x, 4);
  const nice6 = (x) => nice(x, 6);
  // べき乗の底。10 のべき乗・分数・負の値は括弧で囲む（1 \times 10^{-9}^{2} のような二重の上付きを避ける）
  function pw(s, n) { return (/^\d+(\.\d+)?$/.test(s) ? s : R`\left(` + s + R`\right)`) + '^{' + (n == null ? 2 : n) + '}'; }
  // 足し引きの材料にする途中の値の表示用。6 桁以内で言い切れる値（168750 など）はその桁まで、そうでなければ 4 桁。
  // 3 桁に丸めて見せると、表示どおりに足し引きした結果が最後の桁で合わないことがある
  function sigx(x) {
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return sig(x);
    const same = (n) => Math.abs(Number(x.toPrecision(n)) - x) <= 1e-13 * Math.abs(x);
    let n = 3;
    while (n < 6 && !same(n)) n++;
    if (!same(n)) n = 4;
    const r = U.roundSig(x, n), p = /^(-?\d(?:\.\d+)?)e([+-]\d+)$/.exec(r.toExponential(n - 1)), e = Number(p[2]);
    return e >= -2 && e <= 2 ? r.toFixed(Math.max(0, n - 1 - e)) : p[1] + R` \times 10^{` + e + '}';
  }
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
  function tx(x) { return toPlain(sf(x)); }          // 図ラベル用プレーンテキスト（有効数字 2〜3 桁）
  function tx3(x) { return toPlain(sig(x)); }        // 同（有効数字 3 桁）
  const sgn = (x) => (x < 0 ? '−' : '+') + tx(Math.abs(x));
  // 問題文に書く数値は有効数字 3 桁以内で正確に表せること（丸めると解答値とずれるため）
  function ok3(x) { return Math.abs(Number(x.toPrecision(3)) - x) <= 1e-9 * Math.abs(x); }
  function par(s) { return s.charAt(0) === '-' ? R`\left(` + s + R`\right)` : s; }
  function numPart(label, q, x, unit, o) {
    const a = ans(x), p = { label: label, q: q, type: 'num', answer: a, rel: 0.02, unit: unit }, ax = Math.abs(a);
    if (ax !== 0 && (ax < 1e-3 || ax >= 1e5)) { p.show = sig(a); p.hint = '例: 4.7e-12 や 4.7*10^-12 の形で入力'; }
    return Object.assign(p, o || {});
  }
  // SI 接頭辞つきの値（TeX）。p, n, μ, m, (なし), k, M から仮数が 1〜1000 になるものを選ぶ
  const PFX = [[1e-12, 'p'], [1e-9, 'n'], [1e-6, MU], [1e-3, 'm'], [1, ''], [1e3, 'k'], [1e6, 'M']];
  function si(x, base) {
    const a = Math.abs(x);
    let best = PFX[4];
    PFX.forEach((p) => { if (a >= p[0] * 0.9995) best = p; });
    return sig(x / best[0]) + un(best[1] + base);
  }
  // 複数の SVG（JK.plot の出力）を縦に並べて 1 枚にする
  function stack(list, w) {
    let y = 0, body = '';
    list.forEach((s) => {
      const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(s);
      const sw = Number(m[1]), sh = Number(m[2]);
      body += '<g transform="translate(' + ((w - sw) / 2) + ',' + y + ')">' + s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g>';
      y += sh;
    });
    return '<svg class="jk-plot jk-draw" viewBox="0 0 ' + w + ' ' + y + '" width="' + w + '" height="' + y + '" xmlns="http://www.w3.org/2000/svg" role="img">' + body + '</svg>';
  }
  // 点電荷の記号（正: 琥珀色 / 負: シアン）
  function chargeSym(d, x, y, pos, rad) {
    d.circle(x, y, rad || 15, { cls: pos ? 'c3' : 'c1', fill: pos ? 'f3' : 'f1' });
    d.text(x, y + 5, pos ? '+' : '−', { bold: true });
  }
  // 両端に矢じりのある寸法線
  function dimLine(d, x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    d.arrow(mx, my, x1, y1, { cls: 'dim', w: 1.2 });
    d.arrow(mx, my, x2, y2, { cls: 'dim', w: 1.2 });
  }

  /* =====================================================================
     1. クーロンの法則
     ===================================================================== */

  function solveCoul(q1, q2, r) {
    const Q1 = q1 * 1e-6, Q2 = q2 * 1e-6;
    return { Q1: Q1, Q2: Q2, F: K * Math.abs(Q1 * Q2) / (r * r), rep: q1 * q2 > 0 };
  }

  function figCoulomb(q1, q2, r, s) {
    const d = JK.plot.draw(380, 190);
    const x1 = 100, x2 = 280, y = 82, L = 52;
    chargeSym(d, x1, y, q1 > 0);
    chargeSym(d, x2, y, q2 > 0);
    d.text(x1, y - 27, 'q₁ = ' + sgn(q1) + ' μC');
    d.text(x2, y - 27, 'q₂ = ' + sgn(q2) + ' μC');
    if (s.rep) {
      d.arrow(x1 - 18, y, x1 - 18 - L, y, { cls: 'c2' });
      d.arrow(x2 + 18, y, x2 + 18 + L, y, { cls: 'c2' });
      d.text(x1 - 18 - L / 2, y - 9, 'F');
      d.text(x2 + 18 + L / 2, y - 9, 'F');
    } else {
      d.arrow(x1 + 18, y, x1 + 18 + L, y, { cls: 'c2' });
      d.arrow(x2 - 18, y, x2 - 18 - L, y, { cls: 'c2' });
      d.text(x1 + 18 + L / 2, y - 9, 'F');
      d.text(x2 - 18 - L / 2, y - 9, 'F');
    }
    d.line(x1, y + 18, x1, 150, { cls: 'dim', dash: true, w: 1 });
    d.line(x2, y + 18, x2, 150, { cls: 'dim', dash: true, w: 1 });
    dimLine(d, x1, 140, x2, 140);
    d.text((x1 + x2) / 2, 133, 'r = ' + tx(r) + ' m');
    d.text(190, 176, s.F == null ? '力の大きさは等しく、向きは逆（作用・反作用）' : 'F = ' + tx3(s.F) + ' N（' + (s.rep ? '斥力' : '引力') + '）', { cls: 'dim' });
    return d.svg();
  }

  // 一直線上の 3 つの電荷（A, B は固定、C は A から x の位置）
  function figLine3(qa, qb, qc, dist, x, known) {
    const d = JK.plot.draw(380, 170);
    const xa = 70, xb = 310, y = 80, xc = xa + (xb - xa) * (x / dist);
    d.line(xa - 30, y, xb + 30, y, { cls: 'dim', w: 1 });
    chargeSym(d, xa, y, qa > 0, 14);
    chargeSym(d, xb, y, qb > 0, 14);
    chargeSym(d, xc, y, qc > 0, 9);
    d.text(xa, y - 24, 'A  ' + sgn(qa) + ' μC');
    d.text(xb, y - 24, 'B  ' + sgn(qb) + ' μC');
    d.text(xc, y - 17, 'C  ' + sgn(qc) + ' μC');
    dimLine(d, xa, 125, xb, 125);
    d.text((xa + xb) / 2, 118, 'AB = d = ' + tx(dist) + ' m');
    d.line(xa, y + 16, xa, 130, { cls: 'dim', dash: true, w: 1 });
    d.line(xb, y + 16, xb, 130, { cls: 'dim', dash: true, w: 1 });
    dimLine(d, xa, 150, xc, 150);
    d.text((xa + xc) / 2, 165, 'x = ' + (known ? tx3(x) + ' m' : '?'));
    d.line(xc, y + 12, xc, 155, { cls: 'dim', dash: true, w: 1 });
    return d.svg();
  }

  function stepsCoul(q1, q2, r, s, opt) {
    opt = opt || {};
    const Q1 = nice(s.Q1), Q2 = nice(s.Q2), rr = nice(r);
    const ab1 = nice(Math.abs(s.Q1)), ab2 = nice(Math.abs(s.Q2));
    const steps = [
      {
        t: '電荷の符号から、引力か斥力かを決める',
        n: '電荷 $q_{1}$ は' + (q1 > 0 ? '正' : '負') + '、$q_{2}$ は' + (q2 > 0 ? '正' : '負') + 'なので、' + (s.rep ? '同符号どうし → **斥力**（反発し合う力）' : '異符号どうし → **引力**（引き合う力）') + 'です。',
        easy: R`電気には＋と−の 2 種類があります。**同じ種類どうしは反発し合い、違う種類どうしは引き合います**（磁石の N 極どうしが反発し、N 極と S 極が引き合うのと同じです）。この力を**静電気力（クーロン力）**といいます。`,
        pro: R`向きは符号だけで決まります。大きさを計算するときは符号を外して絶対値を代入します。`
      },
      {
        t: '電気量を C（クーロン）に直す',
        m: [R`q_{1} = ` + nice(q1) + R`\,\mu\mathrm{C} = ` + Q1 + un('C'), R`q_{2} = ` + nice(q2) + R`\,\mu\mathrm{C} = ` + Q2 + un('C')],
        n: R`$1\,\mu\mathrm{C} = 10^{-6}\,\mathrm{C}$ です。公式の $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ は電気量を C で測ったときの値なので、必ず直します。`,
        easy: R`$\mu$（マイクロ）は「100 万分の 1」を表す記号です。$1\,\mu\mathrm{C}$ は $0.000001\,\mathrm{C}$ のとても小さな電気量なので、$10^{-6}$ を掛けて C に直してから公式に入れます。`,
        lv: 2
      },
      {
        t: R`**クーロンの法則**で力の大きさを求める`,
        m: [R`F = k\,\frac{|q_{1}q_{2}|}{r^{2}}`, R`F = 9.0 \times 10^{9} \times \frac{` + ab1 + R` \times ` + ab2 + '}{' + pw(rr) + '} = ' + sig(s.F) + un('N')],
        n: R`2 つの点電荷の間にはたらく力の大きさは、電気量の大きさの積に比例し、距離の 2 乗に反比例します。比例定数は $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ です。`,
        easy: R`力は「電気量が大きいほど強く」「距離が近いほど強く」はたらきます。距離が 2 倍に離れると力は $\frac{1}{4}$、3 倍なら $\frac{1}{9}$ になります（距離の 2 乗に反比例）。電灯の光が遠くなるほど急に暗くなるのと似た関係です。`,
        pro: R`$r$ は 2 乗するので、cm のまま代入すると 4 桁ずれます。必ず m に直します。`
      },
      {
        t: '力の向きと作用・反作用',
        m: R`F_{12} = F_{21} = ` + sig(s.F) + un('N'),
        n: R`$q_{1}$ が $q_{2}$ を押す（引く）力と、$q_{2}$ が $q_{1}$ を押す（引く）力は、大きさが等しく向きが逆です（**作用・反作用の法則**）。電気量が大きい方が強く押す、ということはありません。図では` + (s.rep ? 'おたがいに遠ざかる向き' : 'おたがいに近づく向き') + R`に矢印を描いています。`,
        easy: R`綱引きでは、どちらのチームも相手を同じ力で引っ張っています。電荷どうしも同じで、片方だけが強く引くことはありません。`,
        pro: R`3 つ以上の電荷があるときは、1 つの電荷が他の電荷から受ける力をそれぞれ求めてベクトルで足します（重ね合わせの原理）。`
      },
      {
        t: '距離が変わると力はどう変わるか',
        m: [R`F(2r) = \frac{F}{2^{2}} = ` + sig(s.F / 4) + un('N'), R`F\left(\tfrac{r}{2}\right) = 2^{2}F = ` + sig(s.F * 4) + un('N')],
        n: R`距離を 2 倍にすると力は $\frac{1}{4}$、半分にすると 4 倍になります。比例・反比例の関係を使うと、計算せずに力の変化が分かります。`,
        easy: R`「距離の 2 乗に反比例」は、距離が 2 倍→$2^{2}=4$ で割る、距離が $\frac{1}{2}$→$\left(\frac{1}{2}\right)^{2}=\frac{1}{4}$ で割る（つまり 4 倍）と読み替えます。`,
        lv: 3
      }
    ];
    return steps;
  }

  JK.registerSim({
    id: 'em-coulomb',
    field: '電磁気',
    unit: 'p-estat',
    title: 'クーロンの法則（点電荷の間の力）',
    desc: '2 つの点電荷の電気量（符号つき）と距離から、静電気力の大きさと向き（引力か斥力か）を求めます。電気量は μC で入力します。',
    form: [R`F = k\,\frac{|q_{1}q_{2}|}{r^{2}}`, R`k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}`],
    inputs: [
      { key: 'q1', label: '電荷 $q_{1}$', unit: 'μC', type: 'num', def: '2.0', min: -1000000, max: 1000000, hint: '負の電荷は負の値で入力します' },
      { key: 'q2', label: '電荷 $q_{2}$', unit: 'μC', type: 'num', def: '-3.0', min: -1000000, max: 1000000 },
      { key: 'r', label: '距離 $r$', unit: 'm', type: 'num', def: '0.30', min: 0.000000000001, max: 1000000, hint: R`原子のスケール（$10^{-10}\,\mathrm{m}$ 程度）まで入力できます` }
    ],
    examples: [
      { label: '同符号（斥力）', v: { q1: '4.0', q2: '1.0', r: '0.20' } },
      { label: '異符号（引力）', v: { q1: '5.0', q2: '-2.0', r: '0.50' } },
      { label: '電子 2 個（e = 1.6×10⁻¹⁹ C）', v: { q1: '-0.00000000000016', q2: '-0.00000000000016', r: '0.000000001' } }
    ],
    intro: {
      easy: R`下敷きでこすった髪の毛が逆立つのは、電気の力のせいです。電気には＋と−があり、**同符号どうしは反発（斥力）、異符号どうしは引き合い（引力）**ます。その力の大きさを表すのが**クーロンの法則**で、「電気量の積に比例し、距離の 2 乗に反比例する」という形をしています。`,
      normal: R`$F = k\dfrac{|q_{1}q_{2}|}{r^{2}}$。電気量は C、距離は m に直して代入し、向きは符号（同符号→斥力、異符号→引力）で決めます。`,
      pro: R`万有引力 $G\dfrac{Mm}{r^{2}}$ と同じ逆 2 乗則の形。複数の電荷では力のベクトル和（重ね合わせ）を考え、つり合いの位置は「強い電荷から遠い側」に決まります。`
    },
    compute(v) {
      if (v.q1 === 0 || v.q2 === 0) throw new JK.CalcError('電気量が 0 の電荷には力がはたらきません。0 以外の値を入力してください。');
      const s = solveCoul(v.q1, v.q2, v.r);
      if (!isFinite(s.F)) throw new JK.CalcError('値が大きすぎて計算できません。');
      return {
        result: [
          { label: '力の大きさ F', tex: sig(s.F) + un('N') },
          { label: '力の種類', tex: s.rep ? R`\text{斥力（反発し合う）}` : R`\text{引力（引き合う）}` },
          { label: '距離を 2 倍にしたときの力', tex: sig(s.F / 4) + un('N') }
        ],
        steps: stepsCoul(v.q1, v.q2, v.r, s),
        fig: figCoulomb(v.q1, v.q2, v.r, s)
      };
    },
    exercise(rng, level) {
      const qs = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0];
      if (level === 'adv') {
        // 一直線上の 2 つの同符号の電荷の間で、第 3 の電荷がつり合う位置
        const pr = rng.pick([[4.0, 1.0], [9.0, 1.0], [9.0, 4.0], [16.0, 1.0], [4.0, 1.0]]);
        const dist = rng.pick([0.20, 0.30, 0.40, 0.50, 0.60]);
        const sg = rng.pick([1, -1]);
        const qa = sg * pr[0], qb = sg * pr[1], qc = rng.pick([1.0, 2.0]) * sg;
        const n = Math.sqrt(pr[0] / pr[1]);
        const x = dist * n / (n + 1);
        const sAB = solveCoul(qa, qb, dist);
        const sAC = solveCoul(qa, qc, x);
        const rr = x, r2 = dist - x;
        const fig = figLine3(qa, qb, qc, dist, x, false);
        const sol = [
          {
            t: '電荷 A と B の間にはたらく力',
            m: [R`F_{AB} = k\,\frac{|q_{A}q_{B}|}{d^{2}}`, R`F_{AB} = 9.0 \times 10^{9} \times \frac{` + nice(Math.abs(qa) * 1e-6) + R` \times ` + nice(Math.abs(qb) * 1e-6) + '}{' + pw(nice(dist)) + '} = ' + sig(sAB.F) + un('N')],
            n: R`電気量を C に直して、距離 $d$ とともにクーロンの法則に代入します。` + (qa * qb > 0 ? '同符号なので斥力です。' : ''),
            easy: R`まず A と B の 2 つだけを考え、基本の式 $F = k\frac{|q_{1}q_{2}|}{r^{2}}$ の距離 $r$ に $d$ を入れます。$\mu$ は $10^{-6}$ です。`
          },
          {
            t: '第 3 の電荷 C がつり合う位置の考え方',
            n: R`A と B は同符号なので、C を A–B の間に置くと、A からの力と B からの力が**逆向き**になり、つり合う点が見つかります（同符号どうしの間でだけ、つり合う点は 2 つの電荷の間にあります）。C の電気量 $q_{C}$ はつり合いの式の両辺で消えるので、位置の決定には関係しません。`,
            easy: R`A は「C を B の方へ押す」、B は「C を A の方へ押す」ので、2 つの力が打ち消し合う場所が必ずあります。電気量の大きい A の方が強く押すので、つり合う場所は A から遠く、B に近い側になります。`,
            lv: 2
          },
          {
            t: 'つり合いの式を立てて解く',
            m: [R`k\,\frac{|q_{A}q_{C}|}{x^{2}} = k\,\frac{|q_{B}q_{C}|}{(d - x)^{2}} \;\Rightarrow\; \frac{|q_{A}|}{x^{2}} = \frac{|q_{B}|}{(d - x)^{2}}`,
              R`n = \frac{x}{d - x} = \sqrt{\frac{|q_{A}|}{|q_{B}|}} = \sqrt{\frac{` + sf(pr[0]) + '}{' + sf(pr[1]) + R`}} = ` + nice(n),
              R`x = \frac{n}{n + 1}\,d = \frac{` + nice(n) + '}{' + nice(n) + R` + 1} \times ` + nice(dist) + ' = ' + sig(x) + un('m')],
            n: R`A から $x$、B から $d - x$ の位置で、A から受ける力と B から受ける力の大きさが等しいとします。両辺の平方根をとると $\dfrac{x}{d-x} = \sqrt{\dfrac{|q_{A}|}{|q_{B}|}}$ となるので、この値を $n$ とおくと、$x = n(d - x)$ より $x = \dfrac{n}{n+1}d$ と求まります（一次方程式です）。`,
            easy: R`力は「電気量 ÷ 距離²」に比例するので、A の電気量が B の $n^{2}$ 倍なら、A からの距離も B からの距離の $n$ 倍にしないと力がそろいません。つまり $x : (d - x) = n : 1$ です。`,
            pro: R`つり合いの位置は $q_{C}$ によらず「$x : (d-x) = \sqrt{|q_{A}|} : \sqrt{|q_{B}|}$」で決まります。`
          },
          {
            t: 'C が A から受ける力',
            m: [R`F_{AC} = k\,\frac{|q_{A}q_{C}|}{x^{2}}`, R`F_{AC} = 9.0 \times 10^{9} \times \frac{` + nice(Math.abs(qa) * 1e-6) + R` \times ` + nice(Math.abs(qc) * 1e-6) + '}{' + pw(nice4(rr)) + '} = ' + sig(sAC.F) + un('N')],
            n: (Math.abs(Number(x.toPrecision(3)) - x) > 1e-9 * x ? R`$x$ は割り切れないので、ここでは 4 桁の $` + nice4(rr) + R`\,\mathrm{m}$ を使って計算します。` : '') + R`つり合っているので、B から受ける力 $F_{BC}$ も同じ大きさです（距離 $d - x = ` + sig(r2) + R`\,\mathrm{m}$ で確かめられます）。`
          }
        ];
        return {
          title: '電荷にはたらく力のつり合い',
          body: R`真空中の一直線上に、距離 $d = ${sf(dist)}\,\mathrm{m}$ はなれて点電荷 A（電気量 $${sgn(qa)}\,\mu\mathrm{C}$）と点電荷 B（電気量 $${sgn(qb)}\,\mu\mathrm{C}$）を固定した。クーロンの法則の比例定数を $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ とする。次の問いに答えよ。`,
          fig: fig,
          parts: [
            numPart('(1)', R`A と B の間にはたらく力の大きさ $F_{AB}$`, sAB.F, 'N'),
            numPart('(2)', R`線分 AB 上に電気量 $${sgn(qc)}\,\mu\mathrm{C}$ の電荷 C を置いたところ、C にはたらく力がつり合った。C の位置は A から何 m か（距離 $x$）`, x, 'm'),
            numPart('(3)', R`そのとき、C が A から受ける力の大きさ $F_{AC}$`, sAC.F, 'N')
          ],
          solution: sol
        };
      }
      // basic / mid
      let qa, qb, r, sa, sb;
      for (let k = 0; k < 50; k++) {
        qa = rng.pick(qs); qb = rng.pick(qs); sa = rng.pick([1, -1]); sb = rng.pick([1, -1]);
        r = rng.pick([0.10, 0.20, 0.30, 0.50, 1.0]);
        if (ok3(K * qa * qb * 1e-12 / (r * r))) break;
      }
      const q1 = sa * qa, q2 = sb * qb;
      const s = solveCoul(q1, q2, r);
      const parts = [numPart('(1)', R`2 つの電荷の間にはたらく力の大きさ $F$`, s.F, 'N')];
      let f2, f3, Fp, Fpp;
      if (level === 'basic') {
        parts.push({ label: '(2)', q: R`この力は引力か、斥力か`, type: 'choice', choices: ['引力（引き合う力）', '斥力（反発し合う力）'], answer: s.rep ? 1 : 0 });
      } else {
        f2 = rng.pick([2, 3, 0.5]);
        f3 = rng.pick([[2, 3], [3, 2], [2, 2]]);
        Fp = s.F / (f2 * f2); Fpp = s.F * f3[0] * f3[1];
        parts.push(numPart('(2)', R`距離を $r' = ${sf(r * f2)}\,\mathrm{m}$ に変えたときの力の大きさ $F'$`, Fp, 'N'));
        parts.push(numPart('(3)', R`距離を元の $r = ${sf(r)}\,\mathrm{m}$ に戻し、電気量を $q_{1}$ は ${f3[0]} 倍、$q_{2}$ は ${f3[1]} 倍にしたときの力の大きさ $F''$`, Fpp, 'N'));
      }
      const sol = stepsCoul(q1, q2, r, s);
      if (level === 'mid') {
        sol.length = 4;
        sol.push({
          t: '力の変化を比で求める',
          m: [R`F' = F \times \left(\frac{r}{r'}\right)^{2} = ` + sig(s.F) + R` \times \left(\frac{` + nice(r) + '}{' + nice(r * f2) + R`}\right)^{2} = ` + sig(Fp) + un('N'),
            R`F'' = F \times (` + f3[0] + R` \times ` + f3[1] + R`) = ` + sig(s.F) + R` \times ` + (f3[0] * f3[1]) + ' = ' + sig(Fpp) + un('N')],
          n: R`$F \propto \dfrac{|q_{1}q_{2}|}{r^{2}}$ なので、電気量の積が何倍、距離が何倍になったかを見て比で計算します。`,
          easy: R`「距離を $a$ 倍 → 力は $\frac{1}{a^{2}}$ 倍」「電気量の積が $b$ 倍 → 力は $b$ 倍」と分けて考えると、計算が楽になります。`
        });
      }
      return {
        title: s.rep ? '同符号の電荷の間の力' : '異符号の電荷の間の力',
        body: R`真空中で、電気量 $q_{1} = ${sgn(q1)}\,\mu\mathrm{C}$ と $q_{2} = ${sgn(q2)}\,\mu\mathrm{C}$ の 2 つの点電荷を、距離 $r = ${sf(r)}\,\mathrm{m}$ はなして固定した。クーロンの法則の比例定数を $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ とする。次の問いに答えよ。`,
        fig: figCoulomb(q1, q2, r, { rep: s.rep, F: null }),
        parts: parts,
        solution: sol
      };
    }
  });

  /* =====================================================================
     2. 点電荷の電場と電位
     ===================================================================== */

  function solveField(q1, x1, q2, x2, xP, yP) {
    if (q1 === 0 || q2 === 0) throw new JK.CalcError('電気量が 0 の電荷はありません。0 以外の値を入力してください。');
    if (Math.abs(x1 - x2) < 1e-9) throw new JK.CalcError('2 つの電荷が同じ位置にあります。位置を変えてください。');
    const Q1 = q1 * 1e-6, Q2 = q2 * 1e-6;
    const dx1 = xP - x1, dx2 = xP - x2;
    const r1 = Math.hypot(dx1, yP), r2 = Math.hypot(dx2, yP);
    if (r1 < 1e-9 || r2 < 1e-9) throw new JK.CalcError('点 P が電荷の位置と重なっています。P を電荷から離してください。');
    const c = { Q1: Q1, Q2: Q2, r1: r1, r2: r2, dx1: dx1, dx2: dx2 };
    c.E1 = K * Math.abs(Q1) / (r1 * r1); c.E2 = K * Math.abs(Q2) / (r2 * r2);
    c.E1x = K * Q1 * dx1 / (r1 * r1 * r1); c.E1y = K * Q1 * yP / (r1 * r1 * r1);
    c.E2x = K * Q2 * dx2 / (r2 * r2 * r2); c.E2y = K * Q2 * yP / (r2 * r2 * r2);
    c.Ex = c.E1x + c.E2x; c.Ey = c.E1y + c.E2y;
    c.E = Math.hypot(c.Ex, c.Ey);
    c.zero = c.E < 1e-9 * (c.E1 + c.E2);
    if (c.zero) { c.Ex = 0; c.Ey = 0; c.E = 0; }
    c.th = c.zero ? 0 : Math.atan2(c.Ey, c.Ex) * 180 / Math.PI;
    c.V1 = K * Q1 / r1; c.V2 = K * Q2 / r2; c.V = c.V1 + c.V2;
    return c;
  }

  // 電荷 2 つと点 P の位置関係（座標を縮尺つきで描く）。arrows=true で電場ベクトルも描く
  function figField(p, c, arrows) {
    const W = 380, H = 250, d = JK.plot.draw(W, H);
    let xmin = Math.min(p.x1, p.x2, p.xP), xmax = Math.max(p.x1, p.x2, p.xP);
    let ymin = Math.min(0, p.yP), ymax = Math.max(0, p.yP);
    const span = Math.max(xmax - xmin, ymax - ymin);
    if (xmax - xmin < 0.5 * span) { const m = (xmax + xmin) / 2; xmin = m - 0.25 * span; xmax = m + 0.25 * span; }
    if (ymax - ymin < 0.5 * span) { const m = (ymax + ymin) / 2; ymin = m - 0.25 * span; ymax = m + 0.25 * span; }
    const sc = Math.min((W - 150) / (xmax - xmin), (H - 120) / (ymax - ymin));
    const X = (x) => W / 2 + (x - (xmin + xmax) / 2) * sc, Y = (y) => H / 2 - (y - (ymin + ymax) / 2) * sc;
    const y0 = Y(0), px = X(p.xP), py = Y(p.yP);
    d.arrow(14, y0, W - 14, y0, { cls: 'dim', w: 1 });
    d.text(W - 14, y0 + 14, 'x', { anchor: 'end', italic: true });
    // 電荷から P への距離
    [[p.x1, 'r₁'], [p.x2, 'r₂']].forEach((b) => {
      const cx = X(b[0]);
      d.line(cx, y0, px, py, { cls: 'dim', dash: true, w: 1 });
      if (Math.abs(px - cx) + Math.abs(py - y0) > 40) d.text((cx + px) / 2 + (py < y0 ? -9 : 9), (y0 + py) / 2 + (py < y0 ? 0 : -3), b[1], { italic: true });
    });
    if (arrows) {
      const A = 58 / Math.max(c.E1, c.E2, c.E, 1e-300);
      const v1 = [c.E1x * A, -c.E1y * A], v2 = [c.E2x * A, -c.E2y * A], v = [c.Ex * A, -c.Ey * A];
      d.line(px + v1[0], py + v1[1], px + v[0], py + v[1], { cls: 'dim', dash: true, w: 1 });
      d.line(px + v2[0], py + v2[1], px + v[0], py + v[1], { cls: 'dim', dash: true, w: 1 });
      if (Math.hypot(v1[0], v1[1]) > 3) d.arrow(px, py, px + v1[0], py + v1[1], { cls: 'c1', label: 'E₁' });
      if (Math.hypot(v2[0], v2[1]) > 3) d.arrow(px, py, px + v2[0], py + v2[1], { cls: 'c2', label: 'E₂' });
      if (!c.zero) d.arrow(px, py, px + v[0], py + v[1], { cls: 'c3', w: 2.6, label: 'E' });
    }
    chargeSym(d, X(p.x1), y0, p.q1 > 0, 10);
    chargeSym(d, X(p.x2), y0, p.q2 > 0, 10);
    d.dot(px, py, { r: 3.5 });
    d.text(px + (px > W / 2 ? 14 : -14), py + (py < y0 ? -8 : 16), 'P', { bold: true });
    const below = py < y0 || Math.abs(py - y0) < 1;
    [[p.x1, p.q1, 'q₁'], [p.x2, p.q2, 'q₂']].forEach((b) => {
      d.text(X(b[0]), y0 + (below ? 28 : -18), b[2] + ' = ' + sgn(b[1]) + ' μC');
      d.text(X(b[0]), y0 + (below ? 41 : -31), '(x = ' + tx(b[0]) + ')', { cls: 'dim' });
    });
    return d.svg();
  }

  function stepsField(p, c) {
    const t = (x) => nice(x);
    const dir1 = p.q1 > 0 ? '遠ざかる向き' : '近づく向き', dir2 = p.q2 > 0 ? '遠ざかる向き' : '近づく向き';
    const angle = c.zero ? null : c.th;
    const steps = [
      {
        t: '位置関係を図にして、電荷から P までの距離を求める',
        m: [R`r_{1} = \sqrt{(x_{P} - x_{1})^{2} + y_{P}^{2}} = \sqrt{` + pw(t(Math.abs(c.dx1))) + ' + ' + pw(t(Math.abs(p.yP))) + '} = ' + sig(c.r1) + un('m'),
          R`r_{2} = \sqrt{(x_{P} - x_{2})^{2} + y_{P}^{2}} = \sqrt{` + pw(t(Math.abs(c.dx2))) + ' + ' + pw(t(Math.abs(p.yP))) + '} = ' + sig(c.r2) + un('m')],
        n: R`点 P と各電荷を結ぶ線分が、$x$ 方向と $y$ 方向の長さを 2 辺とする直角三角形の斜辺になります。三平方の定理で距離を求めます。`,
        easy: R`距離は、図の直角三角形の斜辺の長さです。横の長さと縦の長さをそれぞれ 2 乗して足し、平方根をとります（三平方の定理）。`
      },
      {
        t: '電場とは何か（点電荷がつくる電場の公式）',
        m: R`E = k\,\frac{|q|}{r^{2}}`,
        n: R`**電場** $\vec{E}$ は、その点に $+1\,\mathrm{C}$ の電荷を置いたときに受ける力で、向きと大きさをもつ**ベクトル**です。点電荷がつくる電場の大きさは $E = k\dfrac{|q|}{r^{2}}$。向きは、$q>0$ なら電荷から**遠ざかる向き**、$q<0$ なら電荷に**近づく向き**です。`,
        easy: R`天気図の「風向きと風の強さ」を思い浮かべてください。電場は、空間の一つひとつの点に描かれた「電気の風」の矢印です。＋の電荷からは風が吹き出し、−の電荷には風が吸い込まれます。電荷に近いほど風は強くなります。`,
        pro: R`電場は「単位電荷あたりの力」。点 P に電荷 $q'$ を置けば、受ける力は $\vec{F} = q'\vec{E}$ です。`
      },
      {
        t: '各電荷がつくる電場の大きさ',
        m: [R`E_{1} = k\,\frac{|q_{1}|}{r_{1}^{2}} = 9.0 \times 10^{9} \times \frac{` + t(Math.abs(c.Q1)) + '}{' + pw(nice6(c.r1)) + '} = ' + sigx(c.E1) + un('N/C'),
          R`E_{2} = k\,\frac{|q_{2}|}{r_{2}^{2}} = 9.0 \times 10^{9} \times \frac{` + t(Math.abs(c.Q2)) + '}{' + pw(nice6(c.r2)) + '} = ' + sigx(c.E2) + un('N/C')],
        n: R`$q_{1}$ による電場 $\vec{E}_{1}$ は、P から見て電荷 $q_{1}$ から` + dir1 + R`、$q_{2}$ による電場 $\vec{E}_{2}$ は電荷 $q_{2}$ から` + dir2 + R`を向きます。電気量は C に直して代入します（$1\,\mu\mathrm{C} = 10^{-6}\,\mathrm{C}$）。`
      },
      {
        t: '$x$ 成分・$y$ 成分に分ける',
        m: [R`E_{1x} = ` + sigx(c.E1x) + R`,\quad E_{1y} = ` + sigx(c.E1y), R`E_{2x} = ` + sigx(c.E2x) + R`,\quad E_{2y} = ` + sigx(c.E2y)],
        n: R`$\vec{E}_{1}$ の向きは「電荷 → P」の向き（$q_{1}<0$ なら逆向き）なので、$x$ 成分は $\pm E_{1}\dfrac{x_{P} - x_{1}}{r_{1}}$、$y$ 成分は $\pm E_{1}\dfrac{y_{P}}{r_{1}}$ です（$q>0$ のとき $+$）。$\vec{E}_{2}$ も同様です。単位はすべて $\mathrm{N/C}$。`,
        easy: R`斜めの矢印は、「右（左）にいくつ」「上（下）にいくつ」の 2 つの数に分けると足し算ができます。図の三角形の辺の比（$x$ 方向の長さ ÷ 距離、$y$ 方向の長さ ÷ 距離）を掛けて分けます。`,
        lv: 2
      },
      {
        t: '電場のベクトル和（成分ごとに足す）',
        m: [R`E_{x} = E_{1x} + E_{2x} = ` + sig(c.Ex) + un('N/C'), R`E_{y} = E_{1y} + E_{2y} = ` + sig(c.Ey) + un('N/C'),
          c.zero ? R`E = 0\quad\text{（打ち消し合う）}` : R`E = \sqrt{E_{x}^{2} + E_{y}^{2}} = ` + sig(c.E) + un('N/C'),
          c.zero ? R`\text{向きなし}` : R`\tan\theta = \frac{E_{y}}{E_{x}} \;\Rightarrow\; \theta = ` + sig(angle) + R`\degree\ (x\text{ 軸の正の向きから反時計回り})`],
        n: R`電場は向きをもつので、**ベクトルとして**足します。2 つの矢印を 2 辺とする平行四辺形の対角線が合成電場です（図の点線）。成分ごとに足すと確実です。`,
        easy: R`電場は矢印（ベクトル）なので、「大きさだけ」を足してはいけません。右向きに $3$、左向きに $2$ なら合わせて右向きに $1$ になるように、向きを考えて足します。`,
        pro: R`対称な配置では成分の一方が打ち消し合います。電気量の大きさが等しい 2 つの電荷の中点では、同符号なら電場は $0$、異符号なら 1 つの電荷がつくる電場の 2 倍で、電荷どうしを結ぶ向きになります。`
      },
      {
        t: '電位とは何か（点電荷がつくる電位の公式）',
        m: R`V = k\,\frac{q}{r}`,
        n: R`**電位** $V$ は、その点に $+1\,\mathrm{C}$ の電荷があるときの電気的な位置エネルギー（無限遠を $0$ としたもの）で、向きのない**スカラー**です。点電荷がつくる電位は $V = k\dfrac{q}{r}$ で、$q$ の**符号をつけたまま**代入します。`,
        easy: R`電位は「電気的な高さ」です。＋の電荷は高い山、−の電荷は深い谷をつくります。高さに向きはありません。山の高さと谷の深さは、そのまま足し算・引き算できます。`,
        pro: R`電場はベクトル和、電位はスカラー和（符号つき）。この違いが一番の取り違えポイントです。`
      },
      {
        t: '電位の和（スカラー和）',
        m: [R`V_{1} = k\,\frac{q_{1}}{r_{1}} = ` + sigx(c.V1) + un('V'), R`V_{2} = k\,\frac{q_{2}}{r_{2}} = ` + sigx(c.V2) + un('V'), R`V = V_{1} + V_{2} = ` + sig(c.V) + un('V')],
        n: R`電位は向きがないので、符号に注意しながらそのまま足します。電場とちがい、成分に分ける必要はありません。単位は $\mathrm{V}$（ボルト）$=\mathrm{J/C}$ です。`,
        easy: R`山の高さ（正）と谷の深さ（負）をそのまま足すだけです。例えば $+5$ と $-5$ なら合計 $0$ ＝ 平地になります。`
      }
    ];
    return steps;
  }

  JK.registerSim({
    id: 'em-field-potential',
    field: '電磁気',
    unit: 'p-estat',
    title: '点電荷がつくる電場と電位',
    desc: '$x$ 軸上の 2 つの点電荷と点 P の位置から、P での電場（ベクトル和・向き）と電位（スカラー和）を求めます。電気量は μC、位置は m で入力します。',
    form: [R`E = k\,\frac{|q|}{r^{2}}`, R`V = k\,\frac{q}{r}`, R`\vec{E} = \vec{E}_{1} + \vec{E}_{2},\quad V = V_{1} + V_{2}`],
    inputs: [
      { key: 'q1', label: '電荷 $q_{1}$', unit: 'μC', type: 'num', def: '4.0', min: -1000000, max: 1000000 },
      { key: 'x1', label: '$q_{1}$ の位置 $x_{1}$', unit: 'm', type: 'num', def: '-0.30', min: -100000, max: 100000 },
      { key: 'q2', label: '電荷 $q_{2}$', unit: 'μC', type: 'num', def: '-4.0', min: -1000000, max: 1000000 },
      { key: 'x2', label: '$q_{2}$ の位置 $x_{2}$', unit: 'm', type: 'num', def: '0.30', min: -100000, max: 100000 },
      { key: 'xP', label: '点 P の $x$ 座標', unit: 'm', type: 'num', def: '0', min: -100000, max: 100000 },
      { key: 'yP', label: '点 P の $y$ 座標', unit: 'm', type: 'num', def: '0.40', min: -100000, max: 100000, hint: '$x$ 軸上の点なら 0 を入力します' }
    ],
    examples: [
      { label: '同符号の中点', v: { q1: '3.0', x1: '0', q2: '3.0', x2: '0.40', xP: '0.20', yP: '0' } },
      { label: '異符号の中点', v: { q1: '4.0', x1: '0', q2: '-2.0', x2: '0.40', xP: '0.20', yP: '0' } },
      { label: '直線上の外側', v: { q1: '4.0', x1: '0', q2: '-1.0', x2: '0.10', xP: '0.30', yP: '0' } }
    ],
    intro: {
      easy: R`電荷のまわりの空間には、「そこに電荷を置くと力を受ける」という性質があり、これを**電場**といいます。電場は向きと大きさをもつ矢印（ベクトル）で、電荷が複数あるときは**矢印を向きまで考えて足し合わせ**ます。一方、同じ場所の**電位**（電気的な高さ）は向きのない数なので、**符号をつけたまま足し算**します。`,
      normal: R`$E = k|q|/r^{2}$（ベクトル和）、$V = kq/r$（符号つきスカラー和）。電場は成分に分けて足し、電位は単純に足します。`,
      pro: R`対称性から打ち消し合う成分を先に見抜く。電場の合成は成分分解、電位は足すだけ。電気量の大きさが等しい 2 つの電荷では、同符号の中点は $E=0$（$V\neq 0$）、異符号の中点は $V=0$（$E\neq 0$）という対比が頻出です。`
    },
    compute(v) {
      const c = solveField(v.q1, v.x1, v.q2, v.x2, v.xP, v.yP);
      const res = [
        { label: 'q₁ による電場の大きさ E₁', tex: sig(c.E1) + un('N/C') },
        { label: 'q₂ による電場の大きさ E₂', tex: sig(c.E2) + un('N/C') },
        { label: '合成電場の大きさ E', tex: c.zero ? R`0\,\mathrm{N/C}` : sig(c.E) + un('N/C') },
        { label: '合成電場の x 成分 Eₓ', tex: sig(c.Ex) + un('N/C') },
        { label: '合成電場の y 成分 E_y', tex: sig(c.Ey) + un('N/C') },
        { label: '合成電場の向き（x 軸正方向から）', tex: c.zero ? R`\text{なし（打ち消し合う）}` : sig(c.th) + R`\degree` },
        { label: '合成電位 V', tex: sig(c.V) + un('V') }
      ];
      return { result: res, steps: stepsField(v, c), fig: figField(v, c, true) };
    },
    exercise(rng, level) {
      let p, parts, sol;
      if (level === 'basic') {
        // 一直線上の 2 つの電荷の中点
        let a, b, sb, dd;
        for (let k = 0; k < 60; k++) {
          a = rng.pick([2.0, 3.0, 4.0, 6.0]); b = rng.pick([1.0, 2.0, 3.0, 4.0]); sb = rng.pick([1, -1]); dd = rng.pick([0.20, 0.40, 0.60]);
          if (a !== b && ok3(K * (a + b) * 1e-6 / (dd / 2) / (dd / 2)) && ok3(K * (a - b) * 1e-6 / (dd / 2) / (dd / 2))) break;
        }
        p = { q1: a, x1: 0, q2: sb * b, x2: dd, xP: dd / 2, yP: 0 };
        const c = solveField(p.q1, p.x1, p.q2, p.x2, p.xP, p.yP);
        parts = [
          numPart('(1)', R`点 P での電場の大きさ $E$`, c.E, 'N/C'),
          numPart('(2)', R`点 P での電位 $V$（符号に注意）`, c.V, 'V')
        ];
        return {
          title: '2 つの電荷の中点の電場と電位',
          body: R`真空中の $x$ 軸上に、点電荷 $q_{1} = ${sgn(p.q1)}\,\mu\mathrm{C}$ を原点 O に、点電荷 $q_{2} = ${sgn(p.q2)}\,\mu\mathrm{C}$ を $x = ${sf(dd)}\,\mathrm{m}$ の位置に固定した。線分の中点 P について、次の問いに答えよ。クーロンの法則の比例定数を $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ とし、電位は無限遠を基準とする。`,
          fig: figField(p, c, false),
          parts: parts,
          solution: stepsField(p, c)
        };
      }
      if (level === 'mid') {
        // 直線上、2 つの電荷の外側の点
        let a, b, sa, sb, dd, ss, c;
        for (let k = 0; k < 80; k++) {
          a = rng.pick([1.0, 2.0, 3.0, 4.0]); b = rng.pick([1.0, 2.0, 3.0, 4.0]); sa = rng.pick([1, -1]); sb = rng.pick([1, -1]);
          dd = rng.pick([0.10, 0.20, 0.30]); ss = rng.pick([0.10, 0.20, 0.30]);
          p = { q1: sa * a, x1: 0, q2: sb * b, x2: dd, xP: dd + ss, yP: 0 };
          c = solveField(p.q1, p.x1, p.q2, p.x2, p.xP, p.yP);
          if (!c.zero && Math.abs(c.V) > 1e-3 * (Math.abs(c.V1) + Math.abs(c.V2)) && Math.abs(c.Ex) > 0.05 * (c.E1 + c.E2)) break;
        }
        parts = [
          numPart('(1)', R`点 P での電場の $x$ 成分 $E_{x}$（$x$ 軸の正の向きを正とする）`, c.Ex, 'N/C'),
          numPart('(2)', R`点 P での電位 $V$`, c.V, 'V')
        ];
        return {
          title: '直線上の点の電場と電位',
          body: R`真空中の $x$ 軸上に、点電荷 $q_{1} = ${sgn(p.q1)}\,\mu\mathrm{C}$ を原点 O に、点電荷 $q_{2} = ${sgn(p.q2)}\,\mu\mathrm{C}$ を $x = ${sf(dd)}\,\mathrm{m}$ の位置に固定した。$x = ${sf(dd + ss)}\,\mathrm{m}$ の点 P について、次の問いに答えよ。クーロンの法則の比例定数を $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ とし、電位は無限遠を基準とする。`,
          fig: figField(p, c, false),
          parts: parts,
          solution: stepsField(p, c)
        };
      }
      // adv: 3-4-5 の位置にある点
      let a, b, sa, sb, s0, c;
      for (let k = 0; k < 80; k++) {
        a = rng.pick([1.0, 2.0, 3.0, 4.0, 5.0]); b = rng.pick([1.0, 2.0, 3.0, 4.0, 5.0]); sa = rng.pick([1, -1]); sb = rng.pick([1, -1]);
        s0 = rng.pick([0.10, 0.20]);
        if (a !== b) break;
      }
      p = { q1: sa * a, x1: -3 * s0, q2: sb * b, x2: 3 * s0, xP: 0, yP: 4 * s0 };
      c = solveField(p.q1, p.x1, p.q2, p.x2, p.xP, p.yP);
      parts = [
        numPart('(1)', R`点 P での電場の $x$ 成分 $E_{x}$`, c.Ex, 'N/C'),
        numPart('(2)', R`点 P での電場の $y$ 成分 $E_{y}$`, c.Ey, 'N/C'),
        numPart('(3)', R`点 P での電位 $V$`, c.V, 'V')
      ];
      return {
        title: '斜めの位置にある点の電場と電位',
        body: R`真空中に $x$ 軸をとり、点電荷 $q_{1} = ${sgn(p.q1)}\,\mu\mathrm{C}$ を $(-${sf(3 * s0)}\,\mathrm{m},\ 0)$、点電荷 $q_{2} = ${sgn(p.q2)}\,\mu\mathrm{C}$ を $(${sf(3 * s0)}\,\mathrm{m},\ 0)$ に固定した。点 P $(0,\ ${sf(4 * s0)}\,\mathrm{m})$ について、次の問いに答えよ。クーロンの法則の比例定数を $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ とし、電位は無限遠を基準とする。$x$ 軸の正の向き、$y$ 軸の正の向きを正とする。`,
        fig: figField(p, c, false),
        parts: parts,
        solution: stepsField(p, c)
      };
    }
  });

  /* =====================================================================
     3. 平行板コンデンサー
     ===================================================================== */

  function solveCap(S, dd, er, V) {   // S[cm²] d[mm]
    const Sm = S * 1e-4, dm = dd * 1e-3;
    const C = er * EPS0 * Sm / dm, Q = C * V;
    return { Sm: Sm, dm: dm, C: C, Q: Q, E: V / dm, U: 0.5 * C * V * V };
  }

  function figCap(S, dd, er, V, extra) {
    extra = extra || {};
    const d = JK.plot.draw(380, 235);
    const xa = 140, xb = 285, yT = 80, yB = 156, th = 7, xbat = 52;
    if (er > 1) d.rect(xa, yT + th, xb - xa, yB - yT - th, { cls: 'c1', fill: 'f1', w: 0.8 });
    d.rect(xa - 8, yT, xb - xa + 16, th, { cls: 'fg', fill: 'f3' });
    d.rect(xa - 8, yB, xb - xa + 16, th, { cls: 'fg', fill: 'f1' });
    for (let i = 0; i < 6; i++) {
      const x = xa + 12 + i * ((xb - xa - 24) / 5);
      d.arrow(x, yT + th + 3, x, yB - 2, { cls: 'c3', w: 1.4 });
    }
    d.path('M ' + (xb + 6) + ' ' + (yT + th) + ' C ' + (xb + 38) + ' ' + (yT + th + 14) + ' ' + (xb + 38) + ' ' + (yB - 14) + ' ' + (xb + 6) + ' ' + yB, { cls: 'dim' });
    d.path('M ' + (xa - 6) + ' ' + (yT + th) + ' C ' + (xa - 38) + ' ' + (yT + th + 14) + ' ' + (xa - 38) + ' ' + (yB - 14) + ' ' + (xa - 6) + ' ' + yB, { cls: 'dim' });
    d.text(xa - 14, yT - 5, '+', { bold: true }); d.text(xa - 14, yB + th + 14, '−', { bold: true });
    d.wire([[xa - 8, yT + th / 2], [xbat, yT + th / 2], [xbat, 100]]);
    d.battery(xbat, 100, xbat, 134);
    d.wire([[xbat, 134], [xbat, yB + th / 2], [xa - 8, yB + th / 2]]);
    d.text(xbat + 14, 120, 'V = ' + tx(V) + ' V', { anchor: 'start' });
    dimLine(d, xb + 52, yT + th, xb + 52, yB);
    d.text(xb + 58, (yT + yB) / 2 + 8, 'd = ' + tx(dd) + ' mm', { anchor: 'start' });
    d.text((xa + xb) / 2, yB + th + 26, '極板の面積 S = ' + tx(S) + ' cm²');
    d.text((xa + xb) / 2, yT - 22, '+Q'.concat(extra.Q ? ' = +' + extra.Q : ''), { bold: true });
    d.text((xa + xb) / 2, yB + th + 44, '−Q'.concat(extra.Q ? ' = −' + extra.Q : ''), { bold: true });
    if (er > 1) d.text((xa + xb) / 2 + 24, (yT + yB) / 2 + 8, '誘電体  εr = ' + tx(er), { anchor: 'middle' });
    return d.svg();
  }

  function stepsCap(p, s) {
    const S = nice(p.S), dd = nice(p.d), er = nice(p.er), V = nice(p.V);
    // C を、与えた値だけで書いた式。Q と U の数値の行も、丸めた C ではなくこの式から一度に計算して見せる
    const cNum = er + R` \times 8.85 \times 10^{-12} \times \frac{` + nice(s.Sm) + '}{' + nice(s.dm) + '}';
    const steps = [
      {
        t: '極板・電気力線・電気量の関係を図で確かめる',
        n: R`コンデンサーの 2 枚の極板に電池をつなぐと、一方に $+Q$、もう一方に $-Q$ の電気がたまります。極板の間には、$+$ から $-$ に向かって**一様な電場**（電気力線が平行で等間隔）ができます。`,
        easy: R`コンデンサーは「電気をためる容器」です。水槽にたとえると、電池が水位（電圧 $V$）を決め、水槽の底面積にあたるものが電気容量 $C$、たまる水の量が電気量 $Q$ です。底面積が広い水槽ほど、同じ水位でもたくさんの水がたまります。`,
        pro: R`$Q$、$C$、$V$、$E$、$U$ の 5 量を、「電池をつないだまま（$V$ 一定）」「電池を切り離す（$Q$ 一定）」のどちらかで整理するのが基本です。`
      },
      {
        t: '面積と間隔を SI 単位（m², m）に直す',
        m: [R`S = ` + S + R`\,\mathrm{cm^{2}} = ` + nice(s.Sm) + R`\,\mathrm{m^{2}}`, R`d = ` + dd + R`\,\mathrm{mm} = ` + nice(s.dm) + un('m')],
        n: R`$1\,\mathrm{cm^{2}} = 10^{-4}\,\mathrm{m^{2}}$、$1\,\mathrm{mm} = 10^{-3}\,\mathrm{m}$ です。真空の誘電率は $\varepsilon_{0} = 8.85 \times 10^{-12}\,\mathrm{F/m}$ を使います。`,
        easy: R`$1\,\mathrm{cm}$ は $0.01\,\mathrm{m}$ なので、面積は $0.01 \times 0.01 = 10^{-4}$ 倍になります。$1\,\mathrm{mm}$ は $0.001\,\mathrm{m}$ です。`,
        lv: 2
      },
      {
        t: '電気容量 $C$',
        m: [R`C = \varepsilon_{r}\varepsilon_{0}\,\frac{S}{d}`, R`C = ` + cNum + ' = ' + si(s.C, 'F')],
        n: R`電気容量は、極板の面積 $S$ に比例し、間隔 $d$ に反比例します。極板間を誘電体で満たすと、比誘電率 $\varepsilon_{r}$ 倍になります（真空・空気は $\varepsilon_{r} \approx 1$）。`,
        easy: R`電気容量 $C$ は「電圧 $1\,\mathrm{V}$ あたり、どれだけ電気をためられるか」を表す量です。極板が広いほど、また極板どうしが近いほど、たくさんためられます。間にガラスなどの絶縁体（誘電体）を入れると、さらに $\varepsilon_{r}$ 倍ためられます。`,
        pro: R`$C \propto \dfrac{\varepsilon_{r}S}{d}$ の比例関係だけで、「間隔を 2 倍」「誘電体を入れる」などの変化が暗算で分かります。`
      },
      {
        t: '電気量 $Q$',
        m: [R`Q = CV = \varepsilon_{r}\varepsilon_{0}\,\frac{S}{d}\,V`, R`Q = ` + cNum + R` \times ` + V + ' = ' + si(s.Q, 'C')],
        n: R`極板にたまる電気量は、電気容量と電圧の積です（$Q = CV$）。一方の極板が $+Q$、他方が $-Q$ です。$C$ は丸めた値ではなく、$C = \varepsilon_{r}\varepsilon_{0}\dfrac{S}{d}$ の式をそのまま入れて計算します（丸めた $C$ を使うと、最後の桁が 1 ずれることがあるためです）。`,
        easy: R`水槽の水の量は「底面積 × 水位」と同じ形で決まります。$C$（底面積）が大きいほど、$V$（水位）が高いほど、たまる電気 $Q$ は増えます。`
      },
      {
        t: '極板間の電場 $E$',
        m: [R`E = \frac{V}{d}`, R`E = \frac{` + V + '}{' + nice(s.dm) + R`} = ` + sig(s.E) + un('V/m')],
        n: R`極板間は一様な電場で、強さは電圧を間隔で割った値です。単位は $\mathrm{V/m} = \mathrm{N/C}$ です。`,
        easy: R`電圧 $V$ は「高さの差」、間隔 $d$ は「坂の長さ」と考えると、$\dfrac{V}{d}$ は「坂の傾き」にあたります。極板が近いほど、坂が急になって電場が強くなります。`,
        pro: R`$E = \dfrac{V}{d} = \dfrac{Q}{\varepsilon_{r}\varepsilon_{0}S}$。電池を切り離して間隔だけを変えても、$Q$ が一定なら $E$ は変わりません。`
      },
      {
        t: '静電エネルギー $U$',
        m: [R`U = \frac{1}{2}CV^{2} = \frac{1}{2}QV = \frac{Q^{2}}{2C}`, R`U = \frac{1}{2}CV^{2} = \frac{1}{2} \times ` + cNum + R` \times ` + pw(V) + ' = ' + si(s.U, 'J')],
        n: R`コンデンサーにたまっているエネルギー（電気をためるのに必要だった仕事）です。3 通りの形を、わかっている量に合わせて使い分けます。ここでも、丸めていない $C$ の式をそのまま入れて計算します。`,
        easy: R`水槽に水をためるには、水をくみ上げる仕事が必要です。コンデンサーでも、電気をためるのに電池が仕事をしていて、そのエネルギーがたまっています。ためた電気を使うと、フラッシュのように一気にエネルギーを取り出せます。`,
        pro: R`$V$ 一定なら $U = \frac{1}{2}CV^{2}$、$Q$ 一定なら $U = \frac{Q^{2}}{2C}$ を使うと、変化のあとの比べ方が一目で分かります。`
      }
    ];
    return steps;
  }

  JK.registerSim({
    id: 'em-capacitor',
    field: '電磁気',
    unit: 'p-estat',
    title: '平行板コンデンサー',
    desc: '極板面積 $S$・間隔 $d$・比誘電率 $\\varepsilon_{r}$・電圧 $V$ から、電気容量 $C$・電気量 $Q$・極板間の電場 $E$・静電エネルギー $U$ を求めます。',
    form: [R`C = \varepsilon_{r}\varepsilon_{0}\frac{S}{d}`, R`Q = CV,\quad E = \frac{V}{d}`, R`U = \frac{1}{2}CV^{2}`],
    inputs: [
      { key: 'S', label: '極板の面積 $S$', unit: 'cm²', type: 'num', def: '100', min: 0.01, max: 1000000 },
      { key: 'd', label: '極板の間隔 $d$', unit: 'mm', type: 'num', def: '1.0', min: 0.001, max: 100000 },
      { key: 'er', label: '比誘電率 $\\varepsilon_{r}$', type: 'num', def: '1.0', min: 1, max: 100000, hint: '真空・空気は 1。ガラスは約 5〜10' },
      { key: 'V', label: '電圧 $V$', unit: 'V', type: 'num', def: '100', min: 0.001, max: 10000000 }
    ],
    examples: [
      { label: '空気コンデンサー', v: { S: '100', d: '1.0', er: '1', V: '100' } },
      { label: '誘電体（εr=5）', v: { S: '200', d: '0.50', er: '5', V: '12' } },
      { label: '間隔が広い', v: { S: '50', d: '2.0', er: '1', V: '300' } }
    ],
    intro: {
      easy: R`コンデンサーは、2 枚の金属板を向かい合わせにして電気をためる部品です。ためられる電気の量は、**板が広いほど・板の間が狭いほど多く**なります。電池につなぐと、板の一方に $+Q$、他方に $-Q$ がたまり、板の間には一様な電場ができます。ためた電気にはエネルギーがあり、$U = \frac{1}{2}CV^{2}$ で表されます。`,
      normal: R`$C = \varepsilon_{r}\varepsilon_{0}S/d$、$Q = CV$、$E = V/d$、$U = \frac{1}{2}CV^{2}$。面積は m²、間隔は m に直して代入します。`,
      pro: R`変化の問題は「電池につないだまま（$V$ 一定）」か「切り離した（$Q$ 一定）」かで場合分け。$C \propto \varepsilon_{r}S/d$ の比例関係から、$Q$・$E$・$U$ の増減を比で追います。`
    },
    compute(v) {
      const s = solveCap(v.S, v.d, v.er, v.V);
      if (!isFinite(s.C) || s.C <= 0) throw new JK.CalcError('この入力では電気容量を計算できません。');
      return {
        result: [
          { label: '電気容量 C', tex: si(s.C, 'F') },
          { label: '電気量 Q', tex: si(s.Q, 'C') },
          { label: '極板間の電場 E', tex: sig(s.E) + un('V/m') },
          { label: '静電エネルギー U', tex: si(s.U, 'J') }
        ],
        steps: stepsCap(v, s),
        fig: figCap(v.S, v.d, v.er, v.V, { Q: tx3(s.Q * 1e9) + ' nC' })
      };
    },
    exercise(rng, level) {
      const S = rng.pick([50, 100, 200, 400]), dd = rng.pick([0.50, 1.0, 2.0, 4.0]);
      const V = rng.pick([10, 12, 20, 50, 100, 200]);
      if (level === 'basic') {
        const p = { S: S, d: dd, er: 1, V: V };
        const s = solveCap(S, dd, 1, V);
        return {
          title: '空気コンデンサーの容量と電気量',
          body: R`面積 $S = ${sf(S)}\,\mathrm{cm^{2}}$ の 2 枚の金属板を、空気中で間隔 $d = ${sf(dd)}\,\mathrm{mm}$ で平行に向かい合わせたコンデンサーに、電圧 $V = ${sf(V)}\,\mathrm{V}$ の電池をつないだ。真空の誘電率を $\varepsilon_{0} = 8.85 \times 10^{-12}\,\mathrm{F/m}$ とし、空気の比誘電率は $1$ とする。次の問いに答えよ。`,
          fig: figCap(S, dd, 1, V, {}),
          parts: [
            numPart('(1)', R`コンデンサーの電気容量 $C$`, s.C, 'F'),
            numPart('(2)', R`極板にたまる電気量 $Q$`, s.Q, 'C')
          ],
          solution: stepsCap(p, s)
        };
      }
      const er = rng.pick([2.0, 3.0, 4.0, 5.0]);
      if (level === 'mid') {
        const p = { S: S, d: dd, er: er, V: V };
        const s = solveCap(S, dd, er, V);
        return {
          title: '誘電体を入れたコンデンサー',
          body: R`面積 $S = ${sf(S)}\,\mathrm{cm^{2}}$ の 2 枚の金属板を間隔 $d = ${sf(dd)}\,\mathrm{mm}$ で平行に向かい合わせ、極板間を比誘電率 $\varepsilon_{r} = ${sf(er)}$ の誘電体で満たしたコンデンサーに、電圧 $V = ${sf(V)}\,\mathrm{V}$ の電池をつないだ。真空の誘電率を $\varepsilon_{0} = 8.85 \times 10^{-12}\,\mathrm{F/m}$ とする。次の問いに答えよ。`,
          fig: figCap(S, dd, er, V, {}),
          parts: [
            numPart('(1)', R`コンデンサーの電気容量 $C$`, s.C, 'F'),
            numPart('(2)', R`極板間の電場の強さ $E$`, s.E, 'V/m'),
            numPart('(3)', R`コンデンサーにたくわえられた静電エネルギー $U$`, s.U, 'J')
          ],
          solution: stepsCap(p, s)
        };
      }
      // adv: 電池をつないだまま / 切り離して、間隔を 2 倍に（または誘電体を入れる）
      const connected = rng.bool();
      const change = rng.pick(['gap', 'diel']);
      const e2 = rng.pick([2.0, 3.0, 5.0]);
      const p = { S: S, d: dd, er: 1, V: V };
      const s = solveCap(S, dd, 1, V);
      const Cn = change === 'gap' ? s.C / 2 : s.C * e2;
      const Qn = connected ? Cn * V : s.Q;
      const Vn = connected ? V : s.Q / Cn;
      const Un = 0.5 * Cn * Vn * Vn;
      const chText = change === 'gap' ? '極板の間隔を $' + sf(2 * dd) + R`\,\mathrm{mm}$（もとの 2 倍）に広げた` : '極板の間を比誘電率 $' + sf(e2) + '$ の誘電体で満たした';
      const parts = [numPart('(1)', R`操作の前の電気容量 $C$`, s.C, 'F')];
      if (connected) {
        parts.push(numPart('(2)', R`操作のあとの極板の電気量 $Q'$`, Qn, 'C'));
      } else {
        parts.push(numPart('(2)', R`操作のあとの極板間の電圧 $V'$`, Vn, 'V'));
      }
      parts.push(numPart('(3)', R`操作のあとの静電エネルギー $U'$`, Un, 'J'));
      const sol = stepsCap(p, s).slice(0, 3);
      // 操作のあとの C'・V' を、与えた値だけで書いた式（途中で丸めた値を次の式に入れない）
      const Sm = nice(s.Sm), dm = nice(s.dm), Vs = nice(V), E2 = nice(e2);
      const cOld = R`8.85 \times 10^{-12} \times \frac{` + Sm + '}{' + dm + '}';
      const cNew = change === 'gap' ? R`8.85 \times 10^{-12} \times \frac{` + Sm + R`}{2 \times ` + dm + '}' : E2 + R` \times ` + cOld;
      const vNew = connected ? Vs : (change === 'gap' ? R`2 \times ` + Vs : R`\frac{` + Vs + '}{' + E2 + '}');
      sol.push({
        t: connected ? '電池をつないだまま変化させる（$V$ が一定）' : '電池を切り離してから変化させる（$Q$ が一定）',
        m: [change === 'gap' ? R`C' = \frac{C}{2} = \varepsilon_{0}\frac{S}{2d} = ` + cNew + ' = ' + si(Cn, 'F') : R`C' = ` + E2 + R`C = ` + E2 + R` \times \varepsilon_{0}\frac{S}{d} = ` + cNew + ' = ' + si(Cn, 'F')].concat(connected ? [
          R`V' = V = ` + Vs + un('V'),
          R`Q' = C'V = ` + cNew + R` \times ` + Vs + ' = ' + si(Qn, 'C')
        ] : [
          R`Q' = Q = CV = \varepsilon_{0}\frac{S}{d}V = ` + cOld + R` \times ` + Vs + ' = ' + si(s.Q, 'C'),
          change === 'gap' ? R`V' = \frac{Q'}{C'} = \frac{CV}{C/2} = 2V = ` + vNew + ' = ' + sig(Vn) + un('V')
            : R`V' = \frac{Q'}{C'} = \frac{CV}{` + E2 + R`C} = \frac{V}{` + E2 + '} = ' + vNew + ' = ' + sig(Vn) + un('V')
        ]),
        n: connected ? R`電池につながったままなので、極板間の電圧は電池の電圧 $V$ のまま変わりません。電気量は $Q' = C'V$ のように、$C$ の変化に応じて増減します（電池から電気が出入りします）。` : R`電池を切り離すと、極板の電気は逃げ場がないので $Q$ が一定になります。$C$ が変わると、電圧は $V' = Q/C'$ に変化します。`,
        easy: connected ? R`電池につながっている間は、電池が「水位（電圧）」を一定に保ち続けます。水槽の底面積（$C$）が変わると、その分だけ水の量（$Q$）が出入りします。` : R`電池を外すと、水槽の水（$Q$）は出入りできません。底面積（$C$）が変わると、水位（$V$）のほうが変わります。`,
        pro: connected ? R`$V$ 一定 → $Q \propto C$、$U \propto C$、$E = V/d$ は $d$ に反比例。` : R`$Q$ 一定 → $V \propto 1/C$、$U = Q^{2}/2C \propto 1/C$、$E = Q/\varepsilon S$ は間隔によらず一定（誘電体を入れると $1/\varepsilon_{r}$ 倍）。`
      });
      sol.push({
        t: '静電エネルギーを求める',
        m: [R`U' = \frac{1}{2}C'V'^{2}`, R`U' = \frac{1}{2} \times ` + cNew + R` \times ` + pw(vNew) + ' = ' + si(Un, 'J')],
        n: R`操作の前の $U = ` + si(s.U, 'J') + R`$ と比べると、$U'$ は` + (Un > s.U ? '増え' : '減り') + R`ました。` + (connected ? '' : (change === 'gap' ? '間隔を広げるために外力がした仕事が、エネルギーの増加分になっています。' : '')),
        easy: R`静電エネルギーは、そのときの $C$・$V$・$Q$ の 3 つのうち分かっているものを使って求めます。$\frac{1}{2}C'V'^{2}$ が使いやすい形です。`
      });
      return {
        title: connected ? '電池をつないだままの変化' : '電池を切り離したあとの変化',
        body: R`面積 $S = ${sf(S)}\,\mathrm{cm^{2}}$ の 2 枚の金属板を、空気中で間隔 $d = ${sf(dd)}\,\mathrm{mm}$ で平行に向かい合わせたコンデンサーを、電圧 $V = ${sf(V)}\,\mathrm{V}$ の電池につないで十分に充電した。真空の誘電率を $\varepsilon_{0} = 8.85 \times 10^{-12}\,\mathrm{F/m}$ とし、空気の比誘電率は $1$ とする。${connected ? '電池につないだまま' : '電池を切り離した後'}、` + chText + R`。次の問いに答えよ。`,
        fig: figCap(S, dd, 1, V, {}),
        parts: parts,
        solution: sol
      };
    }
  });

  /* =====================================================================
     4. コンデンサーの接続
     ===================================================================== */

  function solveCC(conn, C1, C2, V) {          // C [μF], V [V] → Q [μC], U [μJ]
    if (conn === 'series') {
      const C = C1 * C2 / (C1 + C2), Q = C * V;
      return { C: C, Q: Q, Q1: Q, Q2: Q, V1: Q / C1, V2: Q / C2, U1: 0.5 * Q * Q / C1, U2: 0.5 * Q * Q / C2, U: 0.5 * C * V * V };
    }
    const C = C1 + C2;
    return { C: C, Q: C * V, Q1: C1 * V, Q2: C2 * V, V1: V, V2: V, U1: 0.5 * C1 * V * V, U2: 0.5 * C2 * V * V, U: 0.5 * C * V * V };
  }

  function figCC(conn, C1, C2, V, s) {
    const d = JK.plot.draw(380, 200);
    const yT = 45, yB = 150;
    const tag = (x, y, lines, anchor) => lines.forEach((t, i) => d.text(x, y + i * 14, t, { anchor: anchor || 'middle' }));
    if (conn === 'series') {
      const xL = 75, xR = 335;
      d.battery(xL, 72, xL, 122);
      d.wire([[xL, 72], [xL, yT], [120, yT]]);
      d.capacitor(120, yT, 200, yT);
      d.capacitor(200, yT, 280, yT);
      d.wire([[280, yT], [xR, yT], [xR, yB], [xL, yB], [xL, 122]]);
      d.arrow(86, yT, 114, yT, { cls: 'c3' });
      tag(160, yT - 19, ['C₁ = ' + tx(C1) + ' μF']);
      tag(240, yT - 19, ['C₂ = ' + tx(C2) + ' μF']);
      tag(160, yT + 28, ['Q = ' + tx3(s.Q) + ' μC', 'V₁ = ' + tx3(s.V1) + ' V']);
      tag(240, yT + 28, ['Q = ' + tx3(s.Q) + ' μC', 'V₂ = ' + tx3(s.V2) + ' V']);
      d.text(xL + 14, 100, 'V = ' + tx(V) + ' V', { anchor: 'start' });
      d.text(190, 185, '直列: 各コンデンサーの電気量 Q は等しい', { cls: 'dim' });
    } else {
      const xL = 62, x1 = 165, x2 = 275;
      d.battery(xL, 72, xL, 122);
      d.wire([[xL, 72], [xL, yT], [x2, yT]]);
      d.wire([[xL, 122], [xL, yB], [x2, yB]]);
      [[x1, C1, s.Q1, 1], [x2, C2, s.Q2, 2]].forEach((b) => {
        d.wire([[b[0], yT], [b[0], 70]]);
        d.capacitor(b[0], 70, b[0], 125);
        d.wire([[b[0], 125], [b[0], yB]]);
        const sb = b[3] === 1 ? '₁' : '₂';
        d.text(b[0] + 14, 90, 'C' + sb + ' = ' + tx(b[1]) + ' μF', { anchor: 'start' });
        d.text(b[0] + 14, 105, 'Q' + sb + ' = ' + tx3(b[2]) + ' μC', { anchor: 'start' });
        d.text(b[0] + 14, 120, 'V' + sb + ' = ' + tx3(V) + ' V', { anchor: 'start' });
      });
      d.dot(x1, yT); d.dot(x1, yB);
      d.arrow(72, yT, 100, yT, { cls: 'c3' });
      d.text(xL + 14, 100, 'V = ' + tx(V) + ' V', { anchor: 'start' });
      d.text(190, 185, '並列: 各コンデンサーの電圧 V は等しい', { cls: 'dim' });
    }
    return d.svg();
  }

  function stepsCC(conn, C1, C2, V, s) {
    const c1 = nice(C1), c2 = nice(C2), vv = nice(V);
    // 合成容量 C を、与えた値だけで書いた式。Q や U の数値の行は、丸めた C ではなくこの式から一度に計算して見せる
    const cAll = conn === 'series' ? R`\frac{` + c1 + R` \times ` + c2 + '}{' + c1 + ' + ' + c2 + '}' : '(' + c1 + ' + ' + c2 + ')';
    const steps = [];
    if (conn === 'series') {
      steps.push({
        t: '直列接続だと見抜く',
        n: R`電池から出た導線が $C_{1}$ → $C_{2}$ と一本道でつながっているので直列です。**どのコンデンサーにも同じ電気量 $Q$ がたまり**、電圧は $V = V_{1} + V_{2}$ と分かれます。`,
        easy: R`コンデンサーが一列につながっていて、2 つの間の板は他のどこにもつながっていません。電池が最初の板から $-Q$ を押し出すと、その分が順に伝わるので、どの板にも同じ大きさの電気 $\pm Q$ がたまります。`,
        pro: R`直列は「$Q$ が共通」、並列は「$V$ が共通」。抵抗の合成とは式の形が逆になる点に注意します。`
      });
      steps.push({
        t: '合成容量',
        m: [R`\frac{1}{C} = \frac{1}{C_{1}} + \frac{1}{C_{2}} \;\Rightarrow\; C = \frac{C_{1}C_{2}}{C_{1} + C_{2}}`, R`C = \frac{` + c1 + R` \times ` + c2 + '}{' + c1 + ' + ' + c2 + '} = ' + sig(s.C) + un(uF)],
        n: R`直列の合成容量は、逆数の和（和分の積）で求めます。合成容量はどのコンデンサーの容量よりも小さくなります。`,
        easy: R`直列につなぐと、板の間隔が実質的に広がったのと同じことになり、ためにくくなります。だから合成容量は小さくなります。（抵抗では直列が足し算でしたが、コンデンサーは並列が足し算です）`,
        pro: R`同じ容量 $C_{0}$ を 2 個直列にすると $C_{0}/2$、$n$ 個なら $C_{0}/n$。`
      });
      steps.push({
        t: '電気量と各コンデンサーの電圧',
        m: [R`Q = CV = \frac{C_{1}C_{2}}{C_{1} + C_{2}}V`, R`Q = ` + cAll + R` \times ` + vv + ' = ' + sig(s.Q) + un(uC),
          R`V_{1} = \frac{Q}{C_{1}} = \frac{C_{2}}{C_{1} + C_{2}}V = \frac{` + c2 + '}{' + c1 + ' + ' + c2 + R`} \times ` + vv + ' = ' + sig(s.V1) + un('V'),
          R`V_{2} = \frac{Q}{C_{2}} = \frac{C_{1}}{C_{1} + C_{2}}V = \frac{` + c1 + '}{' + c1 + ' + ' + c2 + R`} \times ` + vv + ' = ' + sig(s.V2) + un('V'),
          R`V_{1} + V_{2} = V = ` + vv + un('V')],
        n: R`$\mu\mathrm{F} \times \mathrm{V} = \mu\mathrm{C}$ なので、$\mu$ のまま計算できます。$C$ は丸めずに、$C_{1}$・$C_{2}$ の式のまま入れます。$V_{1} = \dfrac{Q}{C_{1}}$ に $Q = CV$ を入れて整理すると $V_{1} = \dfrac{C_{2}}{C_{1} + C_{2}}V$ となり、電圧は容量の逆比に分かれます。合計は電池の電圧 $V$ に一致します。`,
        easy: R`直列では、容量の小さいコンデンサーほど大きな電圧がかかります（小さな容器ほど、同じ量を入れると水位が高くなるのと同じです）。`,
        lv: 1
      });
    } else {
      steps.push({
        t: '並列接続だと見抜く',
        n: R`電池の両端に $C_{1}$ と $C_{2}$ が別々の道で直接つながっているので並列です。**どちらにも同じ電圧 $V$** がかかり、電気量は $Q = Q_{1} + Q_{2}$ と分かれてたまります。`,
        easy: R`水槽が 2 つ並んで、同じ水位（電圧）の水につながっているイメージです。それぞれの水槽に、底面積に応じた量の水（電気）がたまります。`,
        pro: R`並列は「$V$ が共通」。各コンデンサーの電気量は $Q_{k} = C_{k}V$ とすぐ求まります。`
      });
      steps.push({
        t: '合成容量',
        m: [R`C = C_{1} + C_{2}`, R`C = ` + c1 + ' + ' + c2 + ' = ' + sig(s.C) + un(uF)],
        n: R`並列の合成容量は、各容量の和です。極板の面積が合計で増えたのと同じことになります。`,
        easy: R`水槽を並べて使うと、全体の底面積が足し算で増えます。だから容量は足し算です。（抵抗では並列は逆数の和でしたが、コンデンサーは逆になります）`,
        pro: R`並列は面積を足す、直列は間隔を足す、と極板のモデルで覚えると、抵抗とは逆になる理由が分かります。`
      });
      steps.push({
        t: '各コンデンサーの電気量',
        m: [R`Q_{1} = C_{1}V = ` + c1 + R` \times ` + vv + ' = ' + sig(s.Q1) + un(uC), R`Q_{2} = C_{2}V = ` + c2 + R` \times ` + vv + ' = ' + sig(s.Q2) + un(uC), R`Q = Q_{1} + Q_{2} = CV = ` + cAll + R` \times ` + vv + ' = ' + sig(s.Q) + un(uC)],
        n: R`$\mu\mathrm{F} \times \mathrm{V} = \mu\mathrm{C}$ です。容量の大きいコンデンサーほど多くの電気がたまります。`,
        easy: R`同じ水位なら、底面積の大きな水槽ほどたくさん水が入ります。電気も同じで、容量の大きいコンデンサーほど多くたまります。`
      });
    }
    steps.push({
      t: '静電エネルギー',
      m: [R`U = \frac{1}{2}CV^{2} = \frac{1}{2} \times ` + cAll + R` \times ` + pw(vv) + ' = ' + sig(s.U) + un(uJ), R`U_{1} = ` + sigx(s.U1) + un(uJ) + R`,\quad U_{2} = ` + sigx(s.U2) + un(uJ)],
      n: R`全体のエネルギーは、各コンデンサーのエネルギーの和 $U_{1} + U_{2}$ に等しくなります（$\mu\mathrm{F} \times \mathrm{V}^{2} = \mu\mathrm{J}$）。`,
      easy: R`電池がした仕事は、すべて各コンデンサーにエネルギーとしてたまります。足し合わせると全体の値に一致します。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'em-capacitor-combine',
    field: '電磁気',
    unit: 'p-estat',
    title: 'コンデンサーの接続（直列・並列）',
    desc: '2 つのコンデンサーを直列または並列につないだときの合成容量と、各コンデンサーの電気量・電圧・静電エネルギーを求めます。容量は μF で入力します。',
    form: [R`C = C_{1} + C_{2}\ \text{（並列）}`, R`\frac{1}{C} = \frac{1}{C_{1}} + \frac{1}{C_{2}}\ \text{（直列）}`, R`Q = CV`],
    inputs: [
      { key: 'conn', label: '接続のしかた', type: 'select', def: 'series', options: [['series', '直列（C₁ — C₂）'], ['parallel', '並列（C₁ ∥ C₂）']] },
      { key: 'C1', label: '電気容量 $C_{1}$', unit: 'μF', type: 'num', def: '3.0', min: 0.0001, max: 1000000 },
      { key: 'C2', label: '電気容量 $C_{2}$', unit: 'μF', type: 'num', def: '6.0', min: 0.0001, max: 1000000 },
      { key: 'V', label: '電池の電圧 $V$', unit: 'V', type: 'num', def: '12', min: 0.001, max: 1000000 }
    ],
    examples: [
      { label: '直列 3μF と 6μF', v: { conn: 'series', C1: '3', C2: '6', V: '12' } },
      { label: '並列 2μF と 4μF', v: { conn: 'parallel', C1: '2', C2: '4', V: '10' } },
      { label: '同じ容量の直列', v: { conn: 'series', C1: '10', C2: '10', V: '100' } }
    ],
    intro: {
      easy: R`コンデンサーを 2 つつなぐ方法にも、直列と並列があります。**並列**は電池の両端に別々につなぐ方法で、板の面積が増えるので**容量は足し算**。**直列**は一列につなぐ方法で、板の間隔が広がるので**容量は小さくなり、逆数の和**で求めます。抵抗の合成とは足し算になる側が逆になる点に注意しましょう。`,
      normal: R`並列は $C = C_{1} + C_{2}$（電圧共通）、直列は $\frac{1}{C} = \frac{1}{C_{1}} + \frac{1}{C_{2}}$（電気量共通）。合成してから $Q = CV$、各電圧・電気量に割り振ります。`,
      pro: R`直列は $Q$ 共通で電圧が容量の逆比、並列は $V$ 共通で電気量が容量の比。直列の電圧分担と、あとで出てくる電荷の再配分（スイッチの切りかえ）が頻出です。`
    },
    compute(v) {
      const s = solveCC(v.conn, v.C1, v.C2, v.V);
      const sub = (k) => (k === 1 ? '₁' : '₂');
      return {
        result: [
          { label: '合成容量 C', tex: sig(s.C) + un(uF) },
          { label: '全体の電気量 Q', tex: sig(s.Q) + un(uC) },
          { label: 'C₁ の電気量・電圧', tex: 'Q_{1} = ' + sig(s.Q1) + un(uC) + R`,\ V_{1} = ` + sig(s.V1) + un('V') },
          { label: 'C₂ の電気量・電圧', tex: 'Q_{2} = ' + sig(s.Q2) + un(uC) + R`,\ V_{2} = ` + sig(s.V2) + un('V') },
          { label: '全体の静電エネルギー U', tex: sig(s.U) + un(uJ) }
        ],
        steps: stepsCC(v.conn, v.C1, v.C2, v.V, s),
        fig: figCC(v.conn, v.C1, v.C2, v.V, s)
      };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // 充電したコンデンサーを、充電していないコンデンサーに並列につなぐ（電荷の再配分）
        let C1, C2, V0;
        for (let k = 0; k < 60; k++) {
          C1 = rng.pick([2.0, 3.0, 4.0, 6.0, 8.0]); C2 = rng.pick([1.0, 2.0, 3.0, 4.0, 6.0]);
          V0 = rng.pick([6.0, 10.0, 12.0, 20.0, 30.0]);
          if (ok3(C1 * V0 / (C1 + C2)) && ok3(C1 * C2 / (C1 + C2))) break;
        }
        const Q0 = C1 * V0, Vf = Q0 / (C1 + C2), Q2 = C2 * Vf, Q1f = C1 * Vf;
        const Ui = 0.5 * C1 * V0 * V0, Uf = 0.5 * (C1 + C2) * Vf * Vf, dU = Ui - Uf;
        const d = JK.plot.draw(380, 190);
        d.battery(60, 60, 60, 105);
        d.wire([[60, 60], [60, 35], [135, 35]]);
        d.wire([[60, 105], [60, 150], [135, 150]]);
        d.line(135, 35, 150, 35, { cls: 'fg' });
        d.line(150, 35, 168, 27, { cls: 'fg' });
        d.wire([[170, 35], [225, 35]]);
        d.wire([[135, 35], [135, 55]]);
        d.capacitor(135, 55, 135, 130);
        d.wire([[135, 130], [135, 150]]);
        d.wire([[225, 35], [225, 55]]);
        d.capacitor(225, 55, 225, 130);
        d.wire([[225, 130], [225, 150]]);
        d.wire([[135, 150], [225, 150]]);
        d.dot(135, 35); d.dot(225, 35); d.dot(170, 35, { r: 2.6 });
        d.text(150, 20, 'スイッチ S');
        d.text(147, 96, 'C₁', { anchor: 'end' }); d.text(237, 96, 'C₂', { anchor: 'start' });
        d.text(50, 86, 'V₀', { anchor: 'end' });
        d.text(190, 178, 'S を電池側にして C₁ を充電 → S を C₂ 側に切りかえる', { cls: 'dim' });
        const fig = d.svg();
        return {
          title: '充電したコンデンサーをつなぎかえる',
          body: R`図のように、電気容量 $C_{1} = ${sf(C1)}\,\mu\mathrm{F}$ のコンデンサーを電圧 $V_{0} = ${sf(V0)}\,\mathrm{V}$ の電池で充電した（スイッチ S は電池側）。次に S を電池から切り離して、電気がたまっていない電気容量 $C_{2} = ${sf(C2)}\,\mu\mathrm{F}$ のコンデンサーにつなぎかえた（図の $C_{1}$ と $C_{2}$ が並列になる）。十分に時間がたったあとについて、次の問いに答えよ。`,
          fig: fig,
          parts: [
            numPart('(1)', R`2 つのコンデンサーにかかる電圧 $V$`, Vf, 'V'),
            numPart('(2)', R`$C_{2}$ にたまった電気量 $Q_{2}$`, Q2, 'μC'),
            numPart('(3)', R`つなぎかえる前後で、静電エネルギーが減少した量 $U_{前} - U_{後}$`, dU, 'μJ')
          ],
          solution: [
            { t: '最初の電気量を求める', m: [R`Q_{0} = C_{1}V_{0} = ` + sf(C1) + R` \times ` + sf(V0) + ' = ' + sig(Q0) + un(uC)], n: R`$C_{1}$ に電池がつながっていたとき、$C_{1}$ の電気量は $Q_{0} = C_{1}V_{0}$ です。電池を切り離したあとは、この電気量が逃げ場を失います。`, easy: R`電池を切り離すと、$C_{1}$ にたまった電気は外に出られません。これから 2 つのコンデンサーの間で電気を分け合うだけで、**合計の電気量は変わりません**（電荷保存）。` },
            { t: '電荷保存と電圧の等しさから式を立てる', m: [R`Q_{1}' + Q_{2}' = Q_{0}\quad(\text{電荷保存})`, R`\frac{Q_{1}'}{C_{1}} = \frac{Q_{2}'}{C_{2}} = V\quad(\text{並列で電圧が等しい})`, R`V = \frac{Q_{0}}{C_{1} + C_{2}} = \frac{` + sig(Q0) + '}{' + nice(C1 + C2) + '} = ' + sig(Vf) + un('V')], n: R`並列になったので 2 つの電圧は等しく、電気量の合計は $Q_{0}$ のままです。合成容量 $C_{1} + C_{2}$ に電気量 $Q_{0}$ がたまったと考えても同じ結果です。`, easy: R`2 つの水槽をつないで水位がそろうまで水が移動するイメージです。合計の水の量は同じで、水位がそろった状態が答えです。`, pro: R`「電池を切り離す → $Q$ 保存」「並列 → $V$ 共通」の 2 式で連立するのが定石です。` },
            { t: '各コンデンサーの電気量', m: [R`Q_{2} = C_{2}V = ` + sf(C2) + R` \times ` + sig(Vf) + ' = ' + sig(Q2) + un(uC), R`Q_{1}' = C_{1}V = ` + sf(C1) + R` \times ` + sig(Vf) + ' = ' + sig(Q1f) + un(uC)], n: R`$Q_{1}' + Q_{2} = ` + sig(Q1f + Q2) + R`\,\mu\mathrm{C}$ が $Q_{0}$ に一致することを確かめます。`, easy: R`電圧がそろったので、それぞれの電気量は「容量 × 電圧」で求まります。2 つを足すと、最初の $Q_{0}$ にもどります。` },
            { t: '静電エネルギーの変化', m: [R`U_{前} = \frac{1}{2}C_{1}V_{0}^{2} = \frac{1}{2} \times ` + sf(C1) + R` \times ` + pw(sf(V0)) + ' = ' + sigx(Ui) + un(uJ), R`U_{後} = \frac{1}{2}(C_{1} + C_{2})V^{2} = \frac{1}{2} \times (` + sf(C1) + ' + ' + sf(C2) + R`) \times ` + pw(sig(Vf)) + ' = ' + sigx(Uf) + un(uJ), R`U_{前} - U_{後} = ` + sigx(Ui) + ' - ' + sigx(Uf) + ' = ' + sig(dU) + un(uJ)], n: R`エネルギーは減ります。減った分は、導線の抵抗で生じるジュール熱や、スイッチの火花（電磁波）として失われます。`, easy: R`水槽をつないで水位をそろえるとき、水が勢いよく流れてあちこちで波立ち、エネルギーの一部が熱として逃げます。電気でも同じで、エネルギーの一部が熱や光になって失われます。`, pro: R`電荷は保存するがエネルギーは保存しない、というのがこの問題の核心です。` }
          ]
        };
      }
      // basic / mid
      const conn = level === 'basic' ? rng.pick(['series', 'parallel']) : rng.pick(['series', 'parallel']);
      let C1, C2, V;
      for (let k = 0; k < 80; k++) {
        C1 = rng.pick([2.0, 3.0, 4.0, 6.0, 12.0]); C2 = rng.pick([2.0, 3.0, 4.0, 6.0, 12.0]); V = rng.pick([6.0, 12.0, 24.0, 30.0, 60.0, 100.0]);
        const s0 = solveCC(conn, C1, C2, V);
        if (ok3(s0.C) && ok3(s0.Q) && ok3(s0.V1) && ok3(s0.V2) && ok3(s0.Q1) && ok3(s0.Q2) && (conn === 'parallel' || C1 !== C2)) break;
      }
      const s = solveCC(conn, C1, C2, V);
      const parts = [numPart('(1)', R`合成容量 $C$`, s.C, 'μF'), numPart('(2)', R`電池から流れ込んだ全体の電気量 $Q$`, s.Q, 'μC')];
      if (level === 'mid') {
        if (conn === 'series') parts.push(numPart('(3)', R`$C_{1}$ にかかる電圧 $V_{1}$`, s.V1, 'V'));
        else parts.push(numPart('(3)', R`$C_{2}$ にたまる電気量 $Q_{2}$`, s.Q2, 'μC'));
      }
      return {
        title: conn === 'series' ? 'コンデンサーの直列接続' : 'コンデンサーの並列接続',
        body: R`電気容量 $C_{1} = ${sf(C1)}\,\mu\mathrm{F}$ と $C_{2} = ${sf(C2)}\,\mu\mathrm{F}$ の 2 つのコンデンサーを図のように${conn === 'series' ? '直列' : '並列'}につなぎ、電圧 $V = ${sf(V)}\,\mathrm{V}$ の電池に接続した。次の問いに答えよ。`,
        fig: figCC(conn, C1, C2, V, s),
        parts: parts,
        solution: stepsCC(conn, C1, C2, V, s)
      };
    }
  });

  /* =====================================================================
     5. 一様な電場中の荷電粒子
     ===================================================================== */

  const PARTICLES = {
    electron: { name: '電子', q: -QE, m: ME },
    proton: { name: '陽子', q: QE, m: MP },
    alpha: { name: 'α粒子', q: 2 * QE, m: MA }
  };

  function figUniform(o) {
    // o: {q, motion:'rest'|'perp', plate, frac, E, texts:{...}}
    const d = JK.plot.draw(380, 240);
    const xa = 80, xb = 300, yT = 62, yB = 192, ym = (yT + yB) / 2, th = 7;
    d.rect(xa - 12, yT - th, xb - xa + 24, th, { cls: 'fg', fill: 'f3' });
    d.rect(xa - 12, yB, xb - xa + 24, th, { cls: 'fg', fill: 'f1' });
    d.text(xa - 24, yT - 1, '+', { bold: true }); d.text(xa - 24, yB + 9, '−', { bold: true });
    for (let i = 0; i < 5; i++) d.arrow(xa + 24 + i * 38, yT + 4, xa + 24 + i * 38, yB - 4, { cls: 'dim', w: 1 });
    d.text(xb + 18, ym - 4, 'E', { italic: true, bold: true });
    d.arrow(xb + 18, ym + 2, xb + 18, ym + 30, { cls: 'dim', w: 1.4 });
    const pos = o.q > 0, sg = pos ? 1 : -1;
    if (o.motion === 'rest') {
      const xc = (xa + xb) / 2, y0 = pos ? yT + 10 : yB - 10, y1 = pos ? yB - 14 : yT + 14;
      d.arrow(xc, y0, xc, y1, { cls: 'c2', w: 2.4, label: 'v' });
      chargeSym(d, xc, y0, pos, 8);
      d.arrow(xc - 40, ym - sg * 14, xc - 40, ym + sg * 22, { cls: 'c3', label: 'F', lpos: -1 });
      d.text(xc + 62, ym + 4, '静止から加速', { cls: 'dim' });
    } else {
      const A = sg * o.frac * (ym - yT - 12), L = xb - xa;
      d.arrow(18, ym, xa - 4, ym, { cls: 'c1', label: 'v₀' });
      d.line(xa - 4, ym, xa, ym, { cls: 'c2' });
      d.path('M ' + xa + ' ' + ym + ' Q ' + (xa + L / 2) + ' ' + ym + ' ' + xb + ' ' + (ym + A), { cls: 'c2', w: 2.4 });
      const ux = L, uy = 2 * A, nn = Math.hypot(ux, uy);
      d.arrow(xb, ym + A, xb + 46 * ux / nn, ym + A + 46 * uy / nn, { cls: 'c2', label: 'v' });
      d.line(xa, ym, xb + 4, ym, { cls: 'dim', dash: true, w: 1 });
      if (Math.abs(A) > 6) { dimLine(d, xb + 8, ym, xb + 8, ym + A); d.text(xb + 14, ym + A / 2 + 4, 'y', { anchor: 'start', italic: true }); }
      const xm = xa + L / 2, ymid = ym + A / 4;
      d.arrow(xm, ymid, xm, ymid + sg * 30, { cls: 'c3', label: 'F', lpos: -1 });
      chargeSym(d, xa + 14, ym + A * 0.0036, pos, 7);
      d.text((xa + xb) / 2, yB + th + 22, '極板の長さ L = ' + o.Ltxt, { cls: 'dim' });
    }
    return d.svg();
  }

  function particleOf(kind, qc, mc) {
    if (kind === 'custom') return { name: '荷電粒子', q: qc, m: mc };
    return PARTICLES[kind] || PARTICLES.electron;
  }

  function solveUni(pt, E, motion, s, v0, L, plate, gap) {
    const q = Math.abs(pt.q), m = pt.m;
    const F = q * E, a = F / m;
    const r = { F: F, a: a, E: E };
    if (motion === 'rest') {
      r.v = Math.sqrt(2 * a * s); r.t = Math.sqrt(2 * s / a); r.Kk = F * s; r.s = s;
    } else {
      r.t = L / v0; r.y = 0.5 * a * r.t * r.t; r.vy = a * r.t; r.v = Math.hypot(v0, r.vy);
      r.th = Math.atan2(r.vy, v0) * 180 / Math.PI; r.Kk = 0.5 * m * (r.v * r.v - v0 * v0);
    }
    return r;
  }

  // 加速度 a = |q|E/m を、与えた値だけで書いた式。丸めた F や E を次の式に入れない。
  // E は、直接入力ならその値、極板間の電圧と間隔から求めるなら V/d
  function accTex(pt, p) {
    const q = nice(Math.abs(pt.q));
    return p.plate ? R`\frac{` + q + R` \times ` + nice(p.Vp) + '}{' + nice(pt.m) + R` \times ` + nice(p.d) + '}'
      : R`\frac{` + q + R` \times ` + nice(p.E) + '}{' + nice(pt.m) + '}';
  }

  function stepsUni(pt, p, r) {
    const sign = pt.q > 0;
    const qTex = nice(Math.abs(pt.q)), acc = accTex(pt, p);
    const steps = [
      {
        t: '電場の向きと、電荷が受ける力の向き',
        n: R`極板間には、＋の極板から−の極板に向かう一様な電場 $E$ があります。電荷 $q$ が電場から受ける力は $\vec{F} = q\vec{E}$ なので、` + (sign ? '**正電荷**は電場と同じ向き（−の極板の方）' : '**負電荷**は電場と逆向き（＋の極板の方）') + R`に力を受けます。`,
        easy: R`電場は「電気の坂」のようなものです。＋の電荷は坂をくだる向き（電場と同じ向き）に、−の電荷は坂をのぼる向き（電場と逆向き）に押されます。電荷は ＋ の板に引かれ、− の板に反発される、と考えると向きが分かります。`,
        pro: R`重力 $mg$ は電気力 $|q|E$ に比べて桁違いに小さいので、特に断りがなければ無視します（電子で $E = 10^{3}\,\mathrm{N/C}$ なら、$\dfrac{mg}{eE} \sim 6 \times 10^{-14}$ 程度）。`
      }
    ];
    if (p.plate) {
      steps.push({
        t: '極板間の電場の強さ',
        m: [R`E = \frac{V}{d}`, R`E = \frac{` + nice(p.Vp) + '}{' + nice(p.d) + '} = ' + sig(r.E) + un('V/m')],
        n: R`極板の間は一様な電場で、強さは電圧を間隔で割った値です。単位は $\mathrm{V/m} = \mathrm{N/C}$ です。`,
        easy: R`電圧 $V$ は「電気の高さの差」、間隔 $d$ は「坂の長さ」と考えると、$\dfrac{V}{d}$ は「坂の傾き」にあたります。傾きが急なほど（極板が近いほど）、電荷は強く押されます。`
      });
    }
    steps.push({
      t: '力と加速度を求める（運動方程式）',
      m: [R`F = |q|E = ` + qTex + R` \times ` + (p.plate ? R`\frac{` + nice(p.Vp) + '}{' + nice(p.d) + '}' : nice(p.E)) + ' = ' + sig(r.F) + un('N'),
        R`ma = |q|E \;\Rightarrow\; a = \frac{|q|E}{m} = ` + acc + ' = ' + sig(r.a) + un('m/s^{2}')],
      n: R`電場中の荷電粒子には、電気力 $|q|E$ だけがはたらく（重力は無視）ので、運動方程式 $ma = |q|E$ から加速度が決まります。電場が一様なので、加速度も一定です（等加速度運動）。`,
      easy: R`ボールを手で一定の力で押し続けると、一定の加速度で速くなります。それと同じで、一様な電場の中の電荷は、一定の力を受け続けるので、一定の加速度で運動します。力が同じでも、質量が小さいほど加速度は大きくなります（電子は陽子より約 1800 倍軽いので、加速度が桁違いに大きい）。`,
      pro: R`$\dfrac{|q|}{m}$（比電荷）が同じ粒子は、同じ運動をします。`
    });
    if (p.motion === 'rest') {
      steps.push({
        t: '極板の間を加速して進む（等加速度運動・エネルギー）',
        m: [R`v^{2} - 0^{2} = 2as \;\Rightarrow\; v = \sqrt{2as} = \sqrt{2 \times ` + acc + R` \times ` + nice(r.s) + '} = ' + sig(r.v) + un('m/s'),
          R`\text{別解: } |q|Es = \frac{1}{2}mv^{2} \;\Rightarrow\; v = \sqrt{\frac{2|q|Es}{m}}`],
        n: R`静止した状態から距離 $s$ を進むときの速さは、等加速度運動の式 $v^{2} = 2as$ で求まります。` + (p.plate ? R`ここでは極板の間隔 $d$ だけ進むので、$s = d$ です。` : '') + R`電場がする仕事 $|q|Es$（電圧 $V$ なら $|q|V$）が運動エネルギー $\frac{1}{2}mv^{2}$ に変わる、とエネルギーで考えても同じです。`,
        easy: R`坂道でボールを転がして速くなるのと同じで、電場の坂をくだる間に電荷は速くなります。「電場がした仕事＝運動エネルギーの増加」と考えれば、途中の加速度を求めなくても速さが出せます。`,
        pro: R`極板間の電圧が $V$ のとき $|q|V = \frac{1}{2}mv^{2}$。電子なら $v = \sqrt{2eV/m}$ で、加速電圧だけで速さが決まります（$d$ や $E$ は不要）。`
      });
      steps.push({
        t: 'かかる時間と運動エネルギー',
        m: [R`t = \sqrt{\frac{2s}{a}} = ` + sig(r.t) + un('s'), R`K = \frac{1}{2}mv^{2} = |q|Es = ` + sig(r.Kk) + un('J') + R` = ` + sig(r.Kk / QE) + un('eV')],
        n: R`$1\,\mathrm{eV} = 1.6 \times 10^{-19}\,\mathrm{J}$ は、電子が $1\,\mathrm{V}$ の電圧で加速されて得る運動エネルギーです。`,
        easy: R`$\mathrm{eV}$（電子ボルト）は、原子の世界で使うエネルギーの単位です。「$1\,\mathrm{V}$ の電圧で加速された電子 1 個が持つエネルギー」が $1\,\mathrm{eV}$ で、数字の上では電圧 $\times$ 電気量（電子なら 1 個分）に一致します。`,
        lv: 2
      });
    } else {
      steps.push({
        t: '電場に垂直な方向は等速、電場方向は等加速度運動',
        n: R`初速 $v_{0}$ で電場に垂直に入射した粒子は、電場に垂直な向きには力を受けないので**等速直線運動**、電場の向きには一定の力を受けるので**等加速度運動**をします（水平投射と同じ形の運動です）。`,
        easy: R`ボールを水平に投げると、横には一定の速さで進みながら、下には重力で落ちていきます。電場中でも同じで、重力のかわりに電気力が一定の向きにはたらきます。2 つの向きの運動を**別々に**考えるのがコツです。`,
        pro: R`水平投射の $g$ を $a = |q|E/m$ に置き換えるだけ。軌道は放物線です。`
      });
      steps.push({
        t: '極板を通過する時間と偏向',
        m: [R`t = \frac{L}{v_{0}} = \frac{` + nice(p.L) + '}{' + nice(p.v0) + '} = ' + sig(r.t) + un('s'),
          R`y = \frac{1}{2}at^{2} = \frac{1}{2} \times ` + acc + R` \times \left(\frac{` + nice(p.L) + '}{' + nice(p.v0) + R`}\right)^{2} = ` + sig(r.y) + un('m')],
        n: R`極板の長さ $L$ を、水平方向の速さ $v_{0}$ で通過する時間が $t$ です。その間に電場の向きに進んだ距離が偏向 $y = \frac{1}{2}at^{2}$ です。`,
        easy: R`横方向の速さは変わらないので、板の長さ ÷ 速さ ＝ 通過時間です。その時間のあいだに、縦方向に $\frac{1}{2}at^{2}$ だけ動きます（落下の公式と同じ）。`,
        pro: R`$y = \dfrac{|q|EL^{2}}{2mv_{0}^{2}}$。加速電圧 $V_{1}$ で加速した粒子なら $v_{0}^{2} = 2|q|V_{1}/m$ を代入して、$y = \dfrac{EL^{2}}{4V_{1}}$ と、電荷や質量によらない形になります。`
      });
      steps.push({
        t: '極板を出るときの速さと向き',
        m: [R`v_{y} = at = ` + sig(r.vy) + un('m/s'), R`v = \sqrt{v_{0}^{2} + v_{y}^{2}} = ` + sig(r.v) + un('m/s'), R`\tan\theta = \frac{v_{y}}{v_{0}} = ` + sig(r.vy / p.v0) + R`\;\Rightarrow\; \theta = ` + sig(r.th) + R`\degree`],
        n: R`出口での速度は、水平成分 $v_{0}$ と、電場方向の成分 $v_{y} = at$ の合成です。曲がった角度 $\theta$ は $\tan\theta = v_{y}/v_{0}$ で求まります。`,
        easy: R`出口では「横向きの速さ $v_{0}$」と「縦向きの速さ $v_{y}$」の 2 つがあり、斜めの速さは三平方の定理で求めます。曲がった角度は、直角三角形の「縦 ÷ 横」から決まります。`,
        lv: 2
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-uniform-field',
    field: '電磁気',
    unit: 'p-estat',
    title: '一様な電場中の荷電粒子（加速・偏向）',
    desc: '一様な電場の中で、荷電粒子が静止状態から加速されるとき、または電場に垂直に入射して曲げられるときの加速度・速さ・偏向を求めます。電場は直接入力するか、極板間の電圧と間隔から求めます。',
    form: [R`E = \frac{V}{d},\quad F = |q|E,\quad a = \frac{|q|E}{m}`, R`v^{2} = 2as,\quad y = \frac{1}{2}at^{2}`],
    inputs: [
      { key: 'kind', label: '荷電粒子', type: 'select', def: 'electron', options: [['electron', '電子（q = −e, m = 9.1×10⁻³¹ kg）'], ['proton', '陽子（q = +e, m = 1.67×10⁻²⁷ kg）'], ['alpha', 'α粒子（q = +2e, m = 6.64×10⁻²⁷ kg）'], ['custom', '任意（q と m を入力）']] },
      { key: 'q', label: '電気量 $q$', unit: 'C', type: 'num', def: '1.6e-19', min: -1000, max: 1000, hint: '負電荷は負の値。1.6e-19 のように入力できます', show: (raw) => raw.kind === 'custom' },
      { key: 'm', label: '質量 $m$', unit: 'kg', type: 'num', def: '9.1e-31', min: 1e-35, max: 1000, show: (raw) => raw.kind === 'custom' },
      { key: 'emode', label: '電場の与え方', type: 'select', def: 'plate', options: [['E', '電場の強さ E を直接入力'], ['plate', '極板間の電圧 V と間隔 d から求める']] },
      { key: 'E', label: '電場の強さ $E$', unit: 'N/C', type: 'num', def: '1.0e3', min: 0.001, max: 1e12, show: (raw) => raw.emode === 'E' },
      { key: 'Vp', label: '極板間の電圧 $V$', unit: 'V', type: 'num', def: '100', min: 0.001, max: 1e9, show: (raw) => raw.emode === 'plate' },
      { key: 'd', label: '極板の間隔 $d$', unit: 'm', type: 'num', def: '0.020', min: 0.00001, max: 1000, show: (raw) => raw.emode === 'plate' },
      { key: 'motion', label: '粒子の運動', type: 'select', def: 'rest', options: [['rest', '静止状態から加速（電場に沿って進む）'], ['perp', '電場に垂直に入射（偏向）']] },
      { key: 's', label: '加速する距離 $s$', unit: 'm', type: 'num', def: '0.020', min: 0.00001, max: 100000, show: (raw) => raw.motion === 'rest' && raw.emode === 'E' },
      { key: 'v0', label: '入射の速さ $v_{0}$', unit: 'm/s', type: 'num', def: '2.0e7', min: 1, max: 1e8, show: (raw) => raw.motion === 'perp' },
      { key: 'L', label: '極板の長さ $L$', unit: 'm', type: 'num', def: '0.050', min: 0.00001, max: 1000, show: (raw) => raw.motion === 'perp' }
    ],
    examples: [
      { label: '電子の加速（100 V）', v: { kind: 'electron', emode: 'plate', Vp: '100', d: '0.020', motion: 'rest' } },
      { label: '電子の偏向', v: { kind: 'electron', emode: 'plate', Vp: '40', d: '0.040', motion: 'perp', v0: '2.0e7', L: '0.10' } },
      { label: '陽子を電場 E で加速', v: { kind: 'proton', emode: 'E', E: '1.0e5', motion: 'rest', s: '0.10' } }
    ],
    intro: {
      easy: R`電場の中に電荷を置くと、**電場と同じ向き（正電荷）か、逆向き（負電荷）に、一定の大きさの力 $|q|E$** を受けます。力が一定なので、粒子は一定の加速度で運動します。静止状態からなら**まっすぐ加速**、電場に垂直に入れたら、水平に投げたボールのように**放物線を描いて曲がります**。`,
      normal: R`$a = |q|E/m$。静止状態から距離 $s$ 進めば $v = \sqrt{2as}$（$|q|V = \frac{1}{2}mv^{2}$）。垂直入射では、電場に垂直な向きは等速（$t = L/v_{0}$）、電場の向きは等加速度（$y = \frac{1}{2}at^{2}$）です。`,
      pro: R`加速電圧 $V_{1}$ → 偏向板（電圧 $V_{2}$・間隔 $d$・長さ $L$）の組み合わせでは、偏向 $y = \dfrac{V_{2}L^{2}}{4dV_{1}}$、$\tan\theta = \dfrac{V_{2}L}{2dV_{1}}$ と、電荷と質量が消えます。`
    },
    compute(v) {
      const pt = particleOf(v.kind, v.q, v.m);
      if (!(pt.m > 0)) throw new JK.CalcError('質量は正の値にしてください。');
      if (!(Math.abs(pt.q) > 0)) throw new JK.CalcError('電気量は 0 以外にしてください。');
      const plate = v.emode === 'plate';
      const E = plate ? v.Vp / v.d : v.E;
      const s = plate ? v.d : v.s;
      const r = solveUni(pt, E, v.motion, s, v.v0, v.L, plate, v.d);
      if (!isFinite(r.a) || !isFinite(r.v)) throw new JK.CalcError('値が大きすぎて計算できません。');
      if (r.v >= C0) throw new JK.CalcError('速さが光速（3.0×10⁸ m/s）に達してしまいます。この計算は光速より十分に遅い範囲（相対性理論が不要な範囲）でのみ成り立ちます。電圧や距離を小さくしてください。');
      if (v.motion === 'perp' && plate && r.y > v.d / 2) throw new JK.CalcError('粒子は極板に衝突します（偏向 y = ' + r.y.toPrecision(3) + ' m が、極板間隔の半分 d/2 = ' + (v.d / 2).toPrecision(3) + ' m を超えるため）。電場を弱める・初速を大きくする・極板を短くするなどして調べてください。');
      const p = { motion: v.motion, L: v.L, v0: v.v0, plate: plate, Vp: v.Vp, d: v.d, E: E };
      const res = [
        { label: '電気力の大きさ F', tex: sig(r.F) + un('N') },
        { label: '加速度の大きさ a', tex: sig(r.a) + un('m/s^{2}') },
        { label: '力の向き', tex: pt.q > 0 ? R`\text{電場と同じ向き（正電荷）}` : R`\text{電場と逆向き（負電荷）}` }
      ];
      if (v.motion === 'rest') {
        res.push({ label: '進んだあとの速さ v', tex: sig(r.v) + un('m/s') });
        res.push({ label: '運動エネルギー K', tex: sig(r.Kk) + un('J') + R`\ (=` + sig(r.Kk / QE) + un('eV') + ')' });
        res.push({ label: 'かかった時間 t', tex: sig(r.t) + un('s') });
      } else {
        res.push({ label: '極板を通過する時間 t', tex: sig(r.t) + un('s') });
        res.push({ label: '偏向 y', tex: sig(r.y) + un('m') });
        res.push({ label: '出口での速さ v', tex: sig(r.v) + un('m/s') });
        res.push({ label: '曲がった角度 θ', tex: sig(r.th) + R`\degree` });
      }
      if (r.v > 0.1 * C0) res.push({ label: '注意', tex: R`\text{光速の 1/10 超: 近似は粗い}` });
      const frac = (v.motion === 'perp') ? (plate ? Math.min(0.85, r.y / (v.d / 2)) : 0.55) : 0;
      return { result: res, steps: stepsUni(pt, p, r), fig: figUniform({ q: pt.q, motion: v.motion, frac: Math.max(0.12, frac), Ltxt: tx(v.L || 0) + ' m' }) };
    },
    exercise(rng, level) {
      const eName = (pt) => pt.name;
      if (level === 'basic') {
        const pt = rng.pick([PARTICLES.electron, PARTICLES.electron, PARTICLES.proton]);
        const V = pt === PARTICLES.electron ? rng.pick([50, 100, 200, 500]) : rng.pick([100, 200, 500, 1000]);
        const dd = rng.pick([0.010, 0.020, 0.040, 0.050]);
        const E = V / dd;
        const r = solveUni(pt, E, 'rest', dd, 0, 0, true, dd);
        const p = { motion: 'rest', plate: true, Vp: V, d: dd };
        const mDef = pt === PARTICLES.electron ? R`電子の質量を $m = 9.1 \times 10^{-31}\,\mathrm{kg}$` : R`陽子の質量を $m = 1.67 \times 10^{-27}\,\mathrm{kg}$`;
        return {
          title: pt === PARTICLES.electron ? '電子を電場で加速する' : '陽子を電場で加速する',
          body: R`間隔 $d = ${sf(dd)}\,\mathrm{m}$ の平行な 2 枚の極板に、電圧 $V = ${sf(V)}\,\mathrm{V}$ を加えて一様な電場をつくった。${pt.name}を${pt === PARTICLES.electron ? '負' : '正'}の極板の表面から静かに放したところ、${pt.name}は電場から力を受けて他方の極板まで加速された。電気素量を $e = 1.6 \times 10^{-19}\,\mathrm{C}$、${mDef} とし、重力は無視する。次の問いに答えよ。`,
          fig: figUniform({ q: pt.q, motion: 'rest', frac: 0, Ltxt: '' }),
          parts: [
            numPart('(1)', R`${pt.name}の加速度の大きさ $a$`, r.a, 'm/s²'),
            numPart('(2)', R`他方の極板に達したときの${pt.name}の速さ $v$`, r.v, 'm/s')
          ],
          solution: stepsUni(pt, p, r).concat([{
            t: '電圧から速さを直接求める（別解）',
            m: [R`eV = \frac{1}{2}mv^{2} \;\Rightarrow\; v = \sqrt{\frac{2eV}{m}} = \sqrt{\frac{2 \times 1.6 \times 10^{-19} \times ` + nice(V) + '}{' + nice(pt.m) + '}} = ' + sig(r.v) + un('m/s')],
            n: R`電場がした仕事 $|q|V$ が運動エネルギーになる、と考えれば、極板の間隔 $d$ を使わずに速さが求まります。`,
            easy: R`「電圧 $V$ で加速する」ときは、$|q|V = \frac{1}{2}mv^{2}$ の形で一発で速さが出ます。`,
            lv: 2
          }])
        };
      }
      if (level === 'mid') {
        // 電子が極板間を通過して偏向する
        let v0, E, L, r, dd;
        for (let k = 0; k < 120; k++) {
          v0 = rng.pick([1.0e7, 1.5e7, 2.0e7, 2.5e7, 3.0e7]); E = rng.pick([1.0e3, 2.0e3, 3.0e3, 4.0e3, 5.0e3, 6.0e3]);
          L = rng.pick([0.040, 0.050, 0.060, 0.080, 0.10, 0.12]); dd = rng.pick([0.040, 0.050, 0.060]);
          r = solveUni(PARTICLES.electron, E, 'perp', 0, v0, L, true, dd);
          if (r.y < 0.4 * dd / 2) break;
        }
        const pt = PARTICLES.electron;
        const p = { motion: 'perp', L: L, v0: v0, plate: false, E: E };
        return {
          title: '電場に垂直に入射した電子の偏向',
          body: R`間隔 $d = ${sf(dd)}\,\mathrm{m}$、長さ $L = ${sf(L)}\,\mathrm{m}$ の平行な 2 枚の極板の間に、一様な電場（強さ $E = ${sf(E)}\,\mathrm{N/C}$）がある。電子が、極板の中央を、電場に垂直な向きに速さ $v_{0} = ${sf(v0)}\,\mathrm{m/s}$ で入射した。電子は極板に衝突せずに通過したとする。電気素量を $e = 1.6 \times 10^{-19}\,\mathrm{C}$、電子の質量を $m = 9.1 \times 10^{-31}\,\mathrm{kg}$ とし、重力は無視する。次の問いに答えよ。`,
          fig: figUniform({ q: pt.q, motion: 'perp', frac: 0.4, Ltxt: sf(L) + ' m' }),
          parts: [
            numPart('(1)', R`電子の加速度の大きさ $a$`, r.a, 'm/s²'),
            numPart('(2)', R`電子が極板の間を通過するのにかかる時間 $t$`, r.t, 's'),
            numPart('(3)', R`極板を出るときの、入射方向からの電場方向のずれ $y$`, r.y, 'm')
          ],
          solution: stepsUni(pt, p, r)
        };
      }
      // adv: 加速 → 偏向（ブラウン管）
      let V1, V2, L, dd, v0, y, tanth;
      for (let k = 0; k < 120; k++) {
        V1 = rng.pick([100, 200, 250, 400, 500, 800, 1000]); V2 = rng.pick([10, 20, 25, 40, 50]); L = rng.pick([0.050, 0.080, 0.10, 0.12]); dd = rng.pick([0.020, 0.025, 0.040, 0.050]);
        y = V2 * L * L / (4 * dd * V1);
        if (y < 0.4 * dd / 2 && y > 5e-5 && ok3(y) && ok3(V2 * L / (2 * dd * V1))) break;
      }
      tanth = V2 * L / (2 * dd * V1);
      v0 = Math.sqrt(2 * QE * V1 / ME);
      const th = Math.atan(tanth) * 180 / Math.PI;
      const a2 = QE * V2 / (dd * ME), t2 = L / v0;
      const sol = [
        {
          t: '加速電圧で入射速度 $v_{0}$ を求める',
          m: [R`eV_{1} = \frac{1}{2}mv_{0}^{2} \;\Rightarrow\; v_{0} = \sqrt{\frac{2eV_{1}}{m}}`, R`v_{0} = \sqrt{\frac{2 \times 1.6 \times 10^{-19} \times ` + nice(V1) + R`}{9.1 \times 10^{-31}}} = ` + sig(v0) + un('m/s')],
          n: R`電子は電圧 $V_{1}$ の間で加速され、電場がした仕事 $eV_{1}$ が運動エネルギー $\frac{1}{2}mv_{0}^{2}$ になります（静止状態から出発）。`,
          easy: R`ブラウン管やオシロスコープでは、電子をまず高い電圧で加速してから、偏向板で曲げます。加速の段階は「仕事 ＝ 運動エネルギー」で一気に速さが出せます。`,
          pro: R`この $v_{0}^{2} = 2eV_{1}/m$ を後で代入すると、$e/m$ が約分されて消えます。`
        },
        {
          t: '偏向板の中の運動（水平投射と同じ）',
          m: [R`a = \frac{eE}{m} = \frac{eV_{2}}{md} = ` + sig(a2) + un('m/s^{2}'), R`t = \frac{L}{v_{0}} = ` + sig(t2) + un('s'), R`y = \frac{1}{2}at^{2} = ` + sig(y) + un('m')],
          n: R`偏向板の電場は $E = V_{2}/d$。電場に垂直な向きは等速（$t = L/v_{0}$）、電場の向きは等加速度運動です。`,
          easy: R`水平に投げたボールが落ちていくときと同じ考え方で、「通過時間」と「その間に電場の向きに動いた距離」を求めます。`
        },
        {
          t: '文字式で整理すると（検算）',
          m: [R`y = \frac{1}{2}\cdot\frac{eV_{2}}{md}\cdot\frac{L^{2}}{v_{0}^{2}} = \frac{V_{2}L^{2}}{4dV_{1}} = \frac{` + nice(V2) + R` \times ` + nice(L) + R`^{2}}{4 \times ` + nice(dd) + R` \times ` + nice(V1) + '} = ' + sig(y) + un('m')],
          n: R`$v_{0}^{2} = 2eV_{1}/m$ を代入すると、電子の電荷 $e$ や質量 $m$ が消え、電圧と寸法だけで偏向が決まります。`,
          pro: R`$y = \dfrac{V_{2}L^{2}}{4dV_{1}}$、$\tan\theta = \dfrac{V_{2}L}{2dV_{1}}$ は覚えておくと検算に便利です。`
        },
        {
          t: '出口での向き',
          m: [R`v_{y} = at = ` + sig(a2 * t2) + un('m/s'), R`\tan\theta = \frac{v_{y}}{v_{0}} = \frac{V_{2}L}{2dV_{1}} = ` + sig(tanth)],
          n: R`出口での速度の電場方向の成分 $v_{y} = at$ と入射方向の成分 $v_{0}$ から、曲がる角の $\tan\theta$ が求まります（$\theta = ` + sig(th) + R`\degree$）。`,
          easy: R`出口で斜めになった速度を「横向きの速さ」と「縦向きの速さ」に分けると、直角三角形ができ、曲がる角度の $\tan$ は「縦 ÷ 横」で求まります。`
        }
      ];
      return {
        title: '電子の加速と偏向（ブラウン管のモデル）',
        body: R`静止していた電子を、電圧 $V_{1} = ${sf(V1)}\,\mathrm{V}$ で加速した。この電子が、間隔 $d = ${sf(dd)}\,\mathrm{m}$、長さ $L = ${sf(L)}\,\mathrm{m}$ の平行な 2 枚の偏向板（電圧 $V_{2} = ${sf(V2)}\,\mathrm{V}$）の中央に、板に平行に入射した。電子は偏向板に衝突せずに通過したとする。電気素量を $e = 1.6 \times 10^{-19}\,\mathrm{C}$、電子の質量を $m = 9.1 \times 10^{-31}\,\mathrm{kg}$ とし、重力は無視する。次の問いに答えよ。`,
        fig: figUniform({ q: -QE, motion: 'perp', frac: 0.4, Ltxt: sf(L) + ' m' }),
        parts: [
          numPart('(1)', R`偏向板に入射する直前の電子の速さ $v_{0}$`, v0, 'm/s'),
          numPart('(2)', R`偏向板を出るときの、板に垂直な向きへのずれ $y$`, y, 'm'),
          numPart('(3)', R`偏向板を出るときの速度の向きが、入射方向となす角を $\theta$ としたときの $\tan\theta$`, tanth, '')
        ],
        solution: sol
      };
    }
  });
})();
