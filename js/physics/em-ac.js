/* 物理・電磁気 — 交流: 実効値と電力 / コイル・コンデンサーのリアクタンス / RLC 直列回路 / 変圧器と送電
   構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const sig = (x) => U.sig(x, 3);
  const un = (s) => R`\,\mathrm{` + s + '}';
  const ans = (x) => U.roundSig(x, 3);
  const OHM = R`\,\Omega`;
  const TWO_PI = 2 * Math.PI;
  const MU = R`\mu `;     // 単位の接頭辞 μ（\mathrm の中では立体になる）

  // 入力値・途中の値の表示用: 有効数字 d 桁（既定 6 桁）まで、末尾の 0 は除去、極端に大小の値は指数表記
  function nice(x, d) {
    d = d || 6;
    if (!isFinite(x) || x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12);
    if (e >= -3 && e <= 6 && e < d) return String(U.roundSig(x, d));      // 整数部が d 桁以上のときは指数表記（13260 と書くと 1 の位まで正しい値に見える）
    let m = U.roundSig(x / Math.pow(10, e), d), ee = e;
    if (Math.abs(m) >= 10) { m /= 10; ee += 1; }
    return m + R` \times 10^{` + ee + '}';
  }
  // 2 乗の表示。指数表記（2.5 \times 10^{-3}）の値は括弧でくくる（くくらないと $10^{-3}$ に 2 乗がついたように見える）
  const pw2 = (s) => (s.indexOf('times') < 0 ? s + '^{2}' : R`\left(` + s + R`\right)^{2}`);
  // 途中の値を、続く式に代入して見せるときの有効数字の桁数。
  // vals（途中の値）を d 桁に丸めて f で計算し直した結果が、結果 res の表示（有効数字 nd 桁、既定は 3 桁）と一致する最小の d（3〜7）を返す。
  // f・res は数値でも数値の配列でもよい。keep = true なら、丸めた値の 3 桁表示が元の値の 3 桁表示と同じになること
  // （66.348 を 66.35 と書くと 66.4 に見えてしまう、など）も条件にする
  function dg(vals, f, res, keep, nd) {
    nd = nd || 3;
    const rnd = (x) => U.roundSig(x, nd);
    const want = [].concat(res).map(rnd);
    for (let d = 3; d < 8; d++) {
      const r = vals.map((x) => U.roundSig(x, d));
      if ([].concat(f.apply(null, r)).some((g, i) => rnd(g) !== want[i])) continue;
      if (keep && vals.some((x, i) => ans(r[i]) !== ans(x))) continue;
      return d;
    }
    return 8;
  }
  // 結果の表示。続く式に d 桁（d > 3）で渡す値は「d 桁の値 ≒ 3 桁の値」と書き、そうでなければ有効数字 3 桁
  function res3(x, d) {
    return d > 3 && U.roundSig(x, d) !== ans(x) ? nice(x, d) + R` \fallingdotseq ` + sig(x) : sig(x);
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
  const tx = (x) => toPlain(sf(x));      // 図ラベル用プレーンテキスト（有効数字 2〜3 桁）
  const tx3 = (x) => toPlain(sig(x));    // 同（有効数字 3 桁）
  // 問題文に書く数値は有効数字 3 桁以内で正確に表せること（丸めると解答値とずれるため）
  const ok3 = (x) => Math.abs(Number(x.toPrecision(3)) - x) <= 1e-9 * Math.abs(x);
  function numPart(label, q, x, unit, o) {
    const a = ans(x), p = { label: label, q: q, type: 'num', answer: a, rel: 0.02, unit: unit }, ax = Math.abs(a);
    if (ax !== 0 && (ax < 1e-3 || ax >= 1e5)) { p.show = sig(a); p.hint = '例: 4.7e-12 や 4.7*10^-12 の形で入力'; }
    return Object.assign(p, o || {});
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
  // 時間軸の単位（周期 T[s] に応じて s / ms / μs / ns）
  function tScale(T) {
    if (T >= 1) return { k: 1, u: 's' };
    if (T >= 1e-3) return { k: 1e3, u: 'ms' };
    if (T >= 1e-6) return { k: 1e6, u: 'μs' };
    return { k: 1e9, u: 'ns' };
  }
  // 周波数を日本語の単位つき TeX に（Hz / kHz / MHz）
  function freqTex(f) {
    if (f >= 1e6) return sig(f / 1e6) + un('MHz');
    if (f >= 1e3) return sig(f / 1e3) + un('kHz');
    return sig(f) + un('Hz');
  }
  // 点（x, y）を中心に ±θ の位相差で並ぶ回路図の部品配置
  // items: 'R' | 'L' | 'C' の配列。電源 + 直列接続（横一列）の回路図
  function figSeries(items, info) {
    const d = JK.plot.draw(380, 160);
    const yT = 44, yB = 124, xL = 60, xR = 330, ym = (yT + yB) / 2;
    d.acsource(xL, ym, 15);
    d.wire([[xL, ym - 15], [xL, yT], [100, yT]]);
    const n = items.length, span = 230 / n;
    let x = 100;
    const names = { R: '抵抗 R', L: 'コイル L', C: 'コンデンサー C' };
    items.forEach((it, i) => {
      const x2 = x + span;
      const c = (x + x2) / 2;
      if (it === 'R') d.resistor(x + 10, yT, x2 - 10, yT, {});
      else if (it === 'L') d.coil(x + 10, yT, x2 - 10, yT, { n: 4 });
      else d.capacitor(x + 10, yT, x2 - 10, yT, {});
      d.wire([[x, yT], [x + 10, yT]]);
      d.wire([[x2 - 10, yT], [x2, yT]]);
      d.text(c, yT - 22, names[it], { size: 11 });
      x = x2;
    });
    d.wire([[x, yT], [xR, yT], [xR, yB], [xL, yB], [xL, ym + 15]]);
    d.text(xL, yB + 24, info || '', { size: 11 });
    return d.svg();
  }
  // 電源に L と C が並列につながった回路
  function figParallelLC(p) {
    const d = JK.plot.draw(380, 190);
    const yT = 36, yB = 150, xL = 60, ym = (yT + yB) / 2;
    d.acsource(xL, ym, 15);
    d.wire([[xL, ym - 15], [xL, yT], [260, yT]]);
    d.wire([[xL, ym + 15], [xL, yB], [260, yB]]);
    d.wire([[170, yT], [170, 62]]);
    d.coil(170, 62, 170, 126, { n: 4 });
    d.wire([[170, 126], [170, yB]]);
    d.wire([[260, yT], [260, 70]]);
    d.capacitor(260, 70, 260, 118, {});
    d.wire([[260, 118], [260, yB]]);
    d.dot(170, yT); d.dot(260, yT); d.dot(170, yB); d.dot(260, yB);
    d.text(150, ym + 4, 'L', { anchor: 'end', italic: true });
    d.text(242, ym + 4, 'C', { anchor: 'end', italic: true });
    d.text(190, 176, '電源: 実効値 ' + tx(p.Ve) + ' V・' + tx(p.f) + ' Hz ／ L = ' + tx(p.L) + ' H ／ C = ' + tx(p.C * 1e6) + ' μF', { size: 11 });
    return d.svg();
  }

  /* =====================================================================
     1. 交流の実効値と電力（抵抗に加わる交流）
     ===================================================================== */

  function solveBasic(p) {
    const V0 = p.given === 'eff' ? Math.SQRT2 * p.Ve : p.V0;
    const Ve = V0 / Math.SQRT2;
    const I0 = V0 / p.R, Ie = Ve / p.R;
    const w = TWO_PI * p.f, T = 1 / p.f;
    const ph = w * p.tm;
    return { V0: V0, Ve: Ve, I0: I0, Ie: Ie, P: Ve * Ie, Pmax: V0 * I0, w: w, T: T, vt: V0 * Math.sin(ph), it: I0 * Math.sin(ph), pt: V0 * I0 * Math.sin(ph) * Math.sin(ph) };
  }

  function graphAC(p, s) {
    const ts = tScale(s.T), T = s.T * ts.k, w = TWO_PI / T;
    const x1 = 2 * T * 1.04, tp = (p.tm * ts.k) % (2 * T);
    const g1 = JK.plot.graph({
      w: 340, h: 180, x: [0, x1], y: [-s.V0 * 1.3, s.V0 * 1.3],
      curves: [{ f: (t) => s.V0 * Math.sin(w * t), cls: 'c1' }],
      hlines: [{ y: s.V0, label: 'V₀' }, { y: -s.V0 }, { y: s.Ve, label: 'Vₑ', cls: 'c3' }],
      points: [{ x: tp, y: s.V0 * Math.sin(w * tp), label: 'v', cls: 'c3', pos: 'tr' }],
      labels: [{ x: x1, y: s.V0 * 0.16, text: 't [' + ts.u + ']', cls: 'dim', anchor: 'end' }],
      axis: ['', 'v [V]']
    });
    const g2 = JK.plot.graph({
      w: 340, h: 150, x: [0, x1], y: [0, s.Pmax * 1.3],
      curves: [{ f: (t) => s.Pmax * Math.pow(Math.sin(w * t), 2), cls: 'c2' }],
      hlines: [{ y: s.P, label: '平均', cls: 'c3' }],
      labels: [{ x: x1, y: s.Pmax * 0.1, text: 't [' + ts.u + ']', cls: 'dim', anchor: 'end' }],
      axis: ['', 'p [W]']
    });
    return stack([g1, g2], 340);
  }

  // 数値を代入する式は、入力した値（given が eff なら Ve、peak なら V0）だけから書く（丸めた途中の値を次の式に代入しない）
  function stepsBasic(p, s) {
    const eff = p.given === 'eff';
    const V0 = sig(s.V0), Rr = nice(p.R), f = nice(p.f);
    const V0in = nice(p.V0), Vein = nice(p.Ve);
    const steps = [];
    steps.push({
      t: '交流電圧の表し方（最大値・周波数・周期）',
      m: [R`v = V_{0}\sin\omega t,\qquad \omega = 2\pi f,\qquad T = \frac{1}{f}`, R`\omega = 2\pi \times ` + f + ' = ' + sig(s.w) + un('rad/s') + R`,\qquad T = \frac{1}{` + f + '} = ' + sig(s.T) + un('s')],
      n: R`交流の電圧は、時間とともに $+V_{0}$ と $-V_{0}$ のあいだを正弦波（サイン波）で変化します。$V_{0}$ を**最大値**、1 秒間にくり返す回数 $f$ を**周波数**（$\mathrm{Hz}$）、1 回にかかる時間 $T$ を**周期**といいます。$\omega = 2\pi f$ を角周波数といいます。`,
      easy: R`コンセントの電気は、電流の向きが 1 秒間に何十回も入れかわっています（東日本は $50\,\mathrm{Hz}$、西日本は $60\,\mathrm{Hz}$）。電圧は、$+$ の最大値まで上がって、$0$ にもどり、$-$ の最大値まで下がって、また $0$ にもどる、という波をくり返します。この波 1 回ぶんにかかる時間が周期 $T$、1 秒間の回数が周波数 $f$ で、$f = \dfrac{1}{T}$ の関係があります。`,
      pro: R`$\omega = 2\pi f$ は、1 周期で位相が $2\pi$ 進むことから来ています。$\omega t$ を「位相」といい、$t = \dfrac{T}{4}$ なら $\dfrac{\pi}{2}$ です。`
    });
    steps.push({
      t: '実効値',
      m: [R`V_{e} = \frac{V_{0}}{\sqrt{2}},\qquad I_{e} = \frac{I_{0}}{\sqrt{2}}`, eff ? R`V_{0} = \sqrt{2}\,V_{e} = \sqrt{2} \times ` + Vein + ' = ' + sig(s.V0) + un('V') : R`V_{e} = \frac{V_{0}}{\sqrt{2}} = \frac{` + V0in + R`}{\sqrt{2}} = ` + sig(s.Ve) + un('V')],
      n: R`交流は大きさがつねに変化するので、同じ抵抗で同じ熱を出す**直流の値に換算**したものを使います。これを**実効値**といい、最大値の $\dfrac{1}{\sqrt{2}}$ 倍です。ふつう「$100\,\mathrm{V}$ の交流」というときは実効値です。`,
      easy: R`交流の電圧は絶えず変化しているので、「だいたいどれくらいの電圧か」を 1 つの数で表したくなります。そこで「この交流と同じ熱を出す直流は何 V か」で決めた値が実効値です。最大値の約 $0.71$ 倍（$1/\sqrt{2}$）になります。家庭の $100\,\mathrm{V}$ は実効値で、最大値はその $\sqrt{2}$ 倍、約 $141\,\mathrm{V}$ まで上がっています。`,
      pro: R`最大値から実効値への変換は $\dfrac{1}{\sqrt{2}}$ 倍、実効値から最大値への変換は $\sqrt{2}$ 倍。電流計・電圧計の目盛りや、問題文の「$\bigcirc\bigcirc\,\mathrm{V}$ の交流」は、断りがなければ実効値です。`
    });
    steps.push({
      t: '抵抗を流れる電流',
      m: eff
        ? [R`I_{e} = \frac{V_{e}}{R} = \frac{` + Vein + '}{' + Rr + '} = ' + sig(s.Ie) + un('A'), R`I_{0} = \frac{V_{0}}{R} = \frac{\sqrt{2}\,V_{e}}{R} = \frac{\sqrt{2} \times ` + Vein + '}{' + Rr + '} = ' + sig(s.I0) + un('A')]
        : [R`I_{e} = \frac{V_{e}}{R} = \frac{V_{0}}{\sqrt{2}\,R} = \frac{` + V0in + R`}{\sqrt{2} \times ` + Rr + '} = ' + sig(s.Ie) + un('A'), R`I_{0} = \frac{V_{0}}{R} = \frac{` + V0in + '}{' + Rr + '} = ' + sig(s.I0) + un('A')],
      n: R`抵抗だけの回路では、電流は電圧と**同じ位相**で変化します（電圧が最大のとき電流も最大）。オームの法則は、瞬間値・最大値・実効値のどれでも同じ形で成り立ちます。`,
      easy: R`抵抗には「電圧が大きいほど電流も大きい」というオームの法則がいつも成り立つので、電圧が最大の瞬間に電流も最大、電圧が $0$ の瞬間に電流も $0$ です。実効値どうし、最大値どうしで割り算すれば電流が求まります。`
    });
    steps.push({
      t: '平均の消費電力',
      m: eff
        ? [R`\overline{P} = V_{e}I_{e} = \frac{V_{e}^{2}}{R} = I_{e}^{2}R`, R`\overline{P} = \frac{V_{e}^{2}}{R} = \frac{` + Vein + R`^{2}}{` + Rr + '} = ' + sig(s.P) + un('W')]
        : [R`\overline{P} = V_{e}I_{e} = \frac{V_{0}I_{0}}{2} = \frac{V_{0}^{2}}{2R}`, R`\overline{P} = \frac{V_{0}^{2}}{2R} = \frac{` + V0in + R`^{2}}{2 \times ` + Rr + '} = ' + sig(s.P) + un('W')],
      n: R`抵抗で消費される電力の平均は、実効値どうしを掛けた $V_{e}I_{e}$ です。直流の電力の公式 $P = VI = \dfrac{V^{2}}{R} = I^{2}R$ に、そのまま実効値を入れればよいことになります。`,
      easy: R`実効値は「同じ熱を出す直流に換算した値」なので、電力も直流の公式 $P = VI$ にそのまま実効値を入れれば、時間平均の消費電力になります。グラフの $p$ は 0 から最大値 $V_{0}I_{0}$ のあいだで波打っていて、その平均が $\overline{P}$ です。`,
      pro: R`$\overline{P} = V_{e}I_{e} = \dfrac{1}{2}V_{0}I_{0}$。最大の瞬間電力 $V_{0}I_{0}$ の半分が平均です。`
    });
    steps.push({
      t: '時刻 $t$ の瞬間の値',
      m: [R`v = V_{0}\sin\omega t = ` + V0 + R`\sin(` + sig(s.w) + R` \times ` + nice(p.tm) + ') = ' + sig(s.vt) + un('V'), R`i = I_{0}\sin\omega t = ` + sig(s.it) + un('A') + R`,\qquad p = vi = ` + sig(s.pt) + un('W')],
      n: R`瞬間の値は $v = V_{0}\sin\omega t$ に時刻を入れて求めます（$\sin$ の中は**ラジアン**）。$p = vi$ は $\sin^{2}\omega t$ に比例するので、つねに $0$ 以上です。`,
      easy: R`ある時刻の電圧を知りたいときは、波の式 $v = V_{0}\sin\omega t$ に時刻 $t$ を代入します。$\omega t$ は「波のどの位置にいるか」を表す角度（ラジアン）で、電卓で $\sin$ を使うときは角度の単位をラジアンにします。`,
      lv: 2
    });
    steps.push({
      t: R`なぜ実効値は $\dfrac{1}{\sqrt{2}}$ 倍になるのか`,
      m: [R`p = vi = \frac{V_{0}^{2}}{R}\sin^{2}\omega t = \frac{V_{0}^{2}}{2R}\left(1 - \cos 2\omega t\right)`, R`\overline{P} = \frac{V_{0}^{2}}{2R} = \frac{V_{e}^{2}}{R} \;\Rightarrow\; V_{e} = \frac{V_{0}}{\sqrt{2}}`],
      n: R`瞬間電力 $p$ の時間平均を考えます。$\cos 2\omega t$ の平均は $0$ なので、$\overline{P} = \dfrac{V_{0}^{2}}{2R}$ です。これを直流の公式 $\dfrac{V^{2}}{R}$ と見くらべると、$V_{e}^{2} = \dfrac{V_{0}^{2}}{2}$ となり、実効値が出てきます。`,
      easy: R`$\sin^{2}$ のグラフは $0$ と $1$ のあいだを波打ち、平均するとちょうど $\dfrac{1}{2}$ になります。電力の平均が最大値の半分なので、電力が電圧の 2 乗に比例していることから、電圧では $\sqrt{\dfrac{1}{2}} = \dfrac{1}{\sqrt{2}}$ 倍が実効値になります。`,
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'em-ac-basic',
    field: '電磁気',
    unit: 'p-ac',
    title: '交流の実効値と消費電力',
    desc: '抵抗に加わる交流電圧 $v = V_{0}\\sin\\omega t$ の最大値・実効値・周波数・周期、電流、平均の消費電力を求め、$v$–$t$ グラフと $p$–$t$ グラフで確かめます。',
    form: [R`v = V_{0}\sin\omega t,\quad \omega = 2\pi f,\quad T = \frac{1}{f}`, R`V_{e} = \frac{V_{0}}{\sqrt{2}},\quad I_{e} = \frac{V_{e}}{R}`, R`\overline{P} = V_{e}I_{e} = \frac{V_{e}^{2}}{R}`],
    inputs: [
      { key: 'given', label: '与える電圧', type: 'select', def: 'eff', options: [['peak', '最大値 V₀ で与える'], ['eff', '実効値 Vₑ で与える']] },
      { key: 'V0', label: '電圧の最大値 $V_{0}$', unit: 'V', type: 'num', def: '141', min: 0.001, max: 1000000, show: (raw) => raw.given !== 'eff' },
      { key: 'Ve', label: '電圧の実効値 $V_{e}$', unit: 'V', type: 'num', def: '100', min: 0.001, max: 1000000, show: (raw) => raw.given === 'eff' },
      { key: 'f', label: '周波数 $f$', unit: 'Hz', type: 'num', def: '50', min: 0.01, max: 1000000 },
      { key: 'R', label: '抵抗 $R$', unit: 'Ω', type: 'num', def: '50', min: 0.01, max: 1000000 },
      { key: 'tm', label: '瞬間の値を調べる時刻 $t$', unit: 's', type: 'num', def: '0.0025', min: 0, max: 1000, hint: '周期の 1/8（位相 45°）なら 0.0025 s（50 Hz のとき）' }
    ],
    examples: [
      { label: '家庭用の交流（実効値 100 V・50 Hz）', v: { given: 'eff', Ve: '100', f: '50', R: '50', tm: '0.0025' } },
      { label: '最大値 200 V・60 Hz', v: { given: 'peak', V0: '200', f: '60', R: '100', tm: '0.002' } },
      { label: '高い周波数（1 kHz）', v: { given: 'peak', V0: '10', f: '1000', R: '20', tm: '0.000125' } }
    ],
    intro: {
      easy: R`コンセントの電気は、電圧が**プラスとマイナスを交互にくり返す「交流」**です。電圧は $v = V_{0}\sin\omega t$ という波の形で変化し、1 秒間にくり返す回数が周波数 $f$ です。交流は大きさがたえず変わるので、「同じ熱を出す直流の値」に換算した**実効値**（最大値の $\dfrac{1}{\sqrt{2}}$ 倍）で大きさを表します。実効値を使えば、直流と同じ形（$P = VI$ など）の公式で電力が計算できます。`,
      normal: R`$V_{e} = \dfrac{V_{0}}{\sqrt{2}}$、抵抗の電流 $I_{e} = \dfrac{V_{e}}{R}$（電圧と同位相）、平均電力 $\overline{P} = V_{e}I_{e} = \dfrac{V_{e}^{2}}{R}$。瞬間電力は $0$ 以上で、平均は最大値 $V_{0}I_{0}$ の半分です。`,
      pro: R`交流の問題文の電圧・電流は、断りがなければ実効値です。最大値に直すときは $\sqrt{2}$ 倍、熱量は実効値で $Q = \overline{P}\,t$。瞬間値が問われたら $\omega t$ をラジアンで計算します。`
    },
    compute(v) {
      const given = v.given === 'eff' ? 'eff' : 'peak';
      const p = { given: given, V0: v.V0, Ve: v.Ve, f: v.f, R: v.R, tm: v.tm };
      const s = solveBasic(p);
      if (![s.V0, s.Ve, s.I0, s.Ie, s.P, s.w, s.vt].every(isFinite)) throw new JK.CalcError('値が大きすぎて計算できません。');
      return {
        result: [
          { label: '電圧の最大値 V₀', tex: sig(s.V0) + un('V') },
          { label: '電圧の実効値 Vₑ', tex: sig(s.Ve) + un('V') },
          { label: '電流の実効値 Iₑ（最大値 I₀）', tex: sig(s.Ie) + un('A') + R`\ \ (I_{0} = ` + sig(s.I0) + R`\,\mathrm{A})` },
          { label: '平均の消費電力 P', tex: sig(s.P) + un('W') + R`\ \ (\text{最大の瞬間電力 } ` + sig(s.Pmax) + R`\,\mathrm{W})` },
          { label: '角周波数 ω と周期 T', tex: R`\omega = ` + sig(s.w) + un('rad/s') + R`,\ \ T = ` + sig(s.T) + un('s') },
          { label: '時刻 t の瞬間の電圧 v', tex: sig(s.vt) + un('V') + R`\ \ (i = ` + sig(s.it) + R`\,\mathrm{A})` }
        ],
        steps: stepsBasic(p, s),
        fig: graphAC(p, s)
      };
    },
    exercise(rng, level) {
      const sq = R`$\sqrt{2} = 1.41$ とする。`;
      if (level === 'adv') {
        let Ve, Rr, mn;
        for (let k = 0; k < 100; k++) {
          Ve = rng.pick([100, 200, 50]); Rr = rng.pick([20, 25, 40, 50, 100]); mn = rng.pick([1, 2, 5, 10]);
          if (ok3(Ve * Ve / Rr)) break;
        }
        // 3 つの答えはどれも √2 の近似値を使わずに求まる（$(\sqrt{2})^{2} = 2$）ので、問題文に √2 の値は書かない
        const P = Ve * Ve / Rr, Pm = 2 * P, Q = P * mn * 60, Ie = Ve / Rr;
        const p = { given: 'eff', Ve: Ve, f: 50, R: Rr, tm: 0 };
        const s = solveBasic(p);
        const st = stepsBasic(p, s);
        const sol = [
          {
            t: '最大の瞬間電力',
            m: [R`p_{max} = V_{0}I_{0} = \frac{V_{0}^{2}}{R}`, R`V_{0} = \sqrt{2}\,V_{e} \;\Rightarrow\; p_{max} = \frac{(\sqrt{2}\,V_{e})^{2}}{R} = \frac{2V_{e}^{2}}{R} = \frac{2 \times ` + nice(Ve) + R`^{2}}{` + nice(Rr) + '} = ' + sig(Pm) + un('W')],
            n: R`瞬間の電力 $p = vi = \dfrac{v^{2}}{R}$ が最大になるのは、電圧が最大値 $V_{0}$ のときです。最大値は実効値の $\sqrt{2}$ 倍なので、最大の瞬間電力は $\dfrac{V_{0}^{2}}{R} = \dfrac{2V_{e}^{2}}{R}$ となり、$\sqrt{2}$ の近似値を使わずに求まります。`,
            easy: R`電圧が最大の瞬間は、実効値のときの $\sqrt{2}$ 倍の電圧がかかっています。電力は電圧の 2 乗に比例するので、$(\sqrt{2})^{2} = 2$ 倍です。電力のグラフは $0$ と最大値のあいだを波打ち、その平均がちょうど最大値の半分です。`
          },
          Object.assign({}, st[3], {
            m: [R`I_{e} = \frac{V_{e}}{R} = \frac{` + nice(Ve) + '}{' + nice(Rr) + '} = ' + sig(Ie) + un('A'), R`\overline{P} = V_{e}I_{e} = ` + nice(Ve) + R` \times ` + nice(Ie) + ' = ' + sig(P) + un('W')],
            n: R`抵抗で消費される電力の平均は、実効値どうしを掛けた $V_{e}I_{e}$ です。直流の電力の公式 $P = VI$ に、そのまま実効値を入れればよいことになります。(1) の最大の瞬間電力 $p_{max}$ のちょうど半分になっています。`
          }),
          {
            t: '発生する熱量',
            m: [R`Q = \overline{P}\,t = ` + nice(P) + R` \times (` + nice(mn) + R` \times 60) = ` + sig(Q) + un('J')],
            n: R`熱量は平均の消費電力に時間を掛けます。時間は秒に直します（$` + nice(mn) + R`$ 分 $= ` + nice(mn * 60) + R`\,\mathrm{s}$）。`,
            easy: R`電気ストーブや電熱器が出す熱は、ふだんの電力に使った時間を掛けたものです。「分」は「秒」に直してから使います（$1$ 分 $= 60$ 秒）。`
          }
        ];
        return {
          title: '交流電源につないだ電熱器',
          body: R`実効値 $` + sf(Ve) + R`\,\mathrm{V}$ の交流電源に、抵抗値 $` + sf(Rr) + R`\,\mathrm{\Omega}$ の電熱器をつないだ。電熱器の抵抗値は温度によらず一定とする。次の問いに答えよ。`,
          fig: figSeries(['R'], '実効値 ' + tx(Ve) + ' V'),
          parts: [
            numPart('(1)', R`電熱器で消費される電力の最大値（瞬間電力の最大値）$p_{max}$`, Pm, 'W'),
            numPart('(2)', R`電熱器で消費される電力の平均 $\overline{P}$`, P, 'W'),
            numPart('(3)', R`この電熱器を $` + mn + R`$ 分間使ったときに発生する熱量 $Q$`, Q, 'J')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        // 実効値 [V]（家庭用 100 V・200 V、海外の 120 V・220 V・240 V、低電圧の 50 V）× 周波数 [Hz]（東日本 50・西日本 60）。
        // 瞬間値を問う時刻は、周期の 1/12（位相 30°、sin = 1/2）か 1/6（位相 60°、sin = √3/2）
        const Ve = rng.pick([50, 100, 120, 200, 220, 240]), f = rng.pick([50, 60]), Rr = rng.pick([20, 40, 50, 100]);
        const k = rng.pick([12, 6]);
        // 問題文で指定した √2 = 1.41、√3 = 1.73、π = 3.14 で、答えも解説も計算する
        const S2 = 1.41, S3 = 1.73, PI = 3.14;
        const ph = k === 12
          ? { rad: R`\frac{\pi}{6}`, deg: 30, sin: R`\frac{1}{2}`, num: R`\frac{1}{2}`, val: 0.5, easy: R`$\sin 30\degree = \dfrac{1}{2}$ を使えば、最大値の半分の電圧だと分かります。` }
          : { rad: R`\frac{\pi}{3}`, deg: 60, sin: R`\frac{\sqrt{3}}{2}`, num: R`\frac{1.73}{2}`, val: S3 / 2, easy: R`$\sin 60\degree = \dfrac{\sqrt{3}}{2}$（$\sqrt{3} = 1.73$ とすると約 $0.87$）を使えば、最大値の約 $0.87$ 倍の電圧だと分かります。` };
        const V0 = S2 * Ve, w = 2 * PI * f, vq = V0 * ph.val;
        const p = { given: 'eff', Ve: Ve, f: f, R: Rr, tm: 1 / (k * f) };
        const s = solveBasic(p);
        const st = stepsBasic(p, s);
        // 設問の順（V0 → ω → v）に、問題文の値だけから式を書く。V0 = 1.41 × Ve は 4 桁以内でちょうど表せるので、次の式にもそのまま使う
        const sol = [
          Object.assign({}, st[1], {
            t: '実効値から最大値を求める',
            m: [R`V_{e} = \frac{V_{0}}{\sqrt{2}} \;\Rightarrow\; V_{0} = \sqrt{2}\,V_{e}`, R`V_{0} = \sqrt{2}\,V_{e} = 1.41 \times ` + nice(Ve) + ' = ' + res3(V0, 4) + un('V')]
          }),
          Object.assign({}, st[0], {
            t: '角周波数と周期',
            m: [R`v = V_{0}\sin\omega t,\qquad \omega = 2\pi f,\qquad T = \frac{1}{f}`, R`\omega = 2\pi f = 2 \times 3.14 \times ` + nice(f) + ' = ' + res3(w, 4) + un('rad/s') + R`,\qquad T = \frac{1}{` + nice(f) + '} = ' + sig(1 / f) + un('s')]
          }),
          {
            t: '周期の ' + k + ' 分の 1 が経過した瞬間の電圧',
            m: [R`\omega t = 2\pi f \times \frac{T}{` + k + R`} = \frac{2\pi}{` + k + R`} = ` + ph.rad, R`v = V_{0}\sin ` + ph.rad + ' = ' + nice(V0) + R` \times ` + ph.sin + (ph.num !== ph.sin ? ' = ' + nice(V0) + R` \times ` + ph.num : '') + ' = ' + sig(vq) + un('V')],
            n: R`1 周期 $T$ が位相 $2\pi$ に対応するので、$\dfrac{T}{` + k + R`}$ では位相が $\dfrac{2\pi}{` + k + R`} = ` + ph.rad + R`$（$` + ph.deg + R`\degree$）です。電圧が $0$ から上がり始めた瞬間から数えるので、$v = V_{0}\sin ` + ph.rad + R`$ です。`,
            easy: R`1 周期は、波が 1 回りして元にもどるぶんの時間で、角度でいうと $360\degree$（$2\pi$）です。その $\dfrac{1}{` + k + R`}$ の時間では $` + ph.deg + R`\degree$ だけ進んでいるので、` + ph.easy
          }
        ];
        return {
          title: '交流電圧の最大値・角周波数・瞬間値',
          body: R`抵抗値 $` + sf(Rr) + R`\,\mathrm{\Omega}$ の抵抗に、実効値 $` + sf(Ve) + R`\,\mathrm{V}$、周波数 $` + sf(f) + R`\,\mathrm{Hz}$ の交流電圧 $v = V_{0}\sin\omega t$ を加えた。` + (k === 12 ? R`$\sqrt{2} = 1.41$、$\pi = 3.14$ とする。` : R`$\sqrt{2} = 1.41$、$\sqrt{3} = 1.73$、$\pi = 3.14$ とする。`) + R`次の問いに答えよ。`,
          fig: figSeries(['R'], '実効値 ' + tx(Ve) + ' V・' + tx(f) + ' Hz'),
          parts: [
            numPart('(1)', R`電圧の最大値 $V_{0}$`, V0, 'V'),
            numPart('(2)', R`角周波数 $\omega$`, w, 'rad/s'),
            numPart('(3)', R`電圧が $0$ から上がり始めてから、周期の $\dfrac{1}{` + k + R`}$ の時間が経過した瞬間の電圧 $v$`, vq, 'V')
          ],
          solution: sol
        };
      }
      // basic: 最大値から実効値・電流・電力
      let V0, Rr;
      for (let k = 0; k < 100; k++) {
        V0 = rng.pick([20, 50, 100, 200]); Rr = rng.pick([10, 20, 25, 50, 100]);
        if (ok3(V0 * V0 / (2 * Rr))) break;
      }
      // 問題文で指定した √2 = 1.41 で (1)(2) を計算する。(3) は $\sqrt{2} \times \sqrt{2} = 2$ なので近似値を使わずに V₀²/(2R) で求まる
      const S2 = 1.41;
      const Ve = V0 / S2, Ie = V0 / (S2 * Rr), I0 = V0 / Rr, P = V0 * V0 / (2 * Rr);
      const p = { given: 'peak', V0: V0, f: 50, R: Rr, tm: 0 };
      const s = solveBasic(p);
      const st = stepsBasic(p, s);
      const sol = [
        Object.assign({}, st[1], {
          m: [R`V_{e} = \frac{V_{0}}{\sqrt{2}},\qquad I_{e} = \frac{I_{0}}{\sqrt{2}}`, R`V_{e} = \frac{V_{0}}{\sqrt{2}} = \frac{` + nice(V0) + '}{1.41} = ' + sig(Ve) + un('V')],
          n: st[1].n + R`ここでは問題文のとおり $\sqrt{2} = 1.41$ として計算します。`
        }),
        Object.assign({}, st[2], {
          m: [R`I_{e} = \frac{V_{e}}{R} = \frac{V_{0}}{\sqrt{2}\,R} = \frac{` + nice(V0) + R`}{1.41 \times ` + nice(Rr) + '} = ' + sig(Ie) + un('A'), R`I_{0} = \frac{V_{0}}{R} = \frac{` + nice(V0) + '}{' + nice(Rr) + '} = ' + sig(I0) + un('A')]
        }),
        Object.assign({}, st[3], {
          m: [R`\overline{P} = V_{e}I_{e} = \frac{V_{0}}{\sqrt{2}} \cdot \frac{I_{0}}{\sqrt{2}} = \frac{V_{0}I_{0}}{2}`, R`\overline{P} = \frac{V_{0}I_{0}}{2} = \frac{` + nice(V0) + R` \times ` + nice(I0) + '}{2} = ' + sig(P) + un('W')],
          n: st[3].n + R`最大値で書くと $V_{e}I_{e} = \dfrac{V_{0}I_{0}}{2}$ で、$\sqrt{2} \times \sqrt{2} = 2$ なので、$1.41$ を使わずに計算できます。`,
          pro: st[3].pro + R`(1)(2) の近似値の積 $V_{e}I_{e}$ で求めると、$\sqrt{2} \fallingdotseq 1.41$ の誤差が 2 回かかるので、少しずれます。`
        })
      ];
      return {
        title: '交流の実効値と平均の電力',
        body: R`抵抗値 $` + sf(Rr) + R`\,\mathrm{\Omega}$ の抵抗に、最大値 $` + sf(V0) + R`\,\mathrm{V}$ の交流電圧を加えた。${sq}次の問いに答えよ。`,
        fig: figSeries(['R'], '最大値 ' + tx(V0) + ' V'),
        parts: [
          numPart('(1)', R`電圧の実効値 $V_{e}$`, Ve, 'V'),
          numPart('(2)', R`電流の実効値 $I_{e}$`, Ie, 'A'),
          numPart('(3)', R`抵抗で消費される平均の電力 $\overline{P}$`, P, 'W')
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     2. コイル・コンデンサーのリアクタンスと位相
     ===================================================================== */

  // pi: 問題文で円周率の値を指定したとき（演習用）の値。省略すると円周率そのもの
  function solveReact(p, pi) {
    const w = 2 * (pi || Math.PI) * p.f;
    const X = p.elem === 'L' ? w * p.L : 1 / (w * p.C);
    const Ie = p.Ve / X;
    return { w: w, X: X, Ie: Ie, I0: Math.SQRT2 * Ie, V0: Math.SQRT2 * p.Ve, X2: p.elem === 'L' ? 2 * X : X / 2 };
  }

  // 電圧と電流の波形（それぞれ最大値で割った相対値）。コイル: 電流が 90° 遅れる / コンデンサー: 電流が 90° 進む
  function graphPhase(p, s) {
    const T = 1 / p.f, ts = tScale(T), Tk = T * ts.k, w = TWO_PI / Tk;
    const sh = p.elem === 'L' ? -Math.PI / 2 : Math.PI / 2;
    return JK.plot.graph({
      w: 340, h: 190, x: [0, 2 * Tk * 1.04], y: [-1.6, 1.6],
      curves: [{ f: (t) => Math.sin(w * t), cls: 'c1' }, { f: (t) => Math.sin(w * t + sh), cls: 'c3' }],
      hlines: [{ y: 1 }, { y: -1 }],
      labels: [{ x: 0.3 * Tk, y: 1.4, text: '電圧 v（青）', cls: 'c1' }, { x: 1.1 * Tk, y: 1.4, text: '電流 i（橙）', cls: 'c3' }, { x: 2 * Tk * 1.04, y: 0.2, text: 't [' + ts.u + ']', cls: 'dim', anchor: 'end' }],
      axis: ['', '相対値']
    });
  }

  function graphXf(p, s) {
    const fmax = Math.max(p.f * 2.2, 1e-9);
    const g = p.elem === 'L' ? (f) => TWO_PI * f * p.L : (f) => 1 / (TWO_PI * f * p.C);
    return JK.plot.graph({
      w: 320, h: 210, x: [0, fmax], y: [0, p.elem === 'L' ? g(fmax) * 1.1 : s.X * 3.2],
      curves: [{ f: g, cls: 'c1', domain: [fmax / 1000, fmax] }],
      points: [{ x: p.f, y: s.X, label: 'いまの f', cls: 'c3', pos: 'tr' }],
      vlines: [{ x: p.f }], hlines: [{ y: s.X }],
      axis: ['f [Hz]', p.elem === 'L' ? 'X_L [Ω]' : 'X_C [Ω]']
    });
  }

  // opt.pi: 問題文で円周率の値を指定したときの値（3.14 など）。省略すると π のまま計算する
  // 数値を代入する式は、入力した値と、表示した途中の値（表示した値で計算し直して結果の表示と合う桁数）だけで書く
  function stepsReact(p, s, opt) {
    opt = opt || {};
    const isL = p.elem === 'L';
    const f = nice(p.f), Ve = nice(p.Ve);
    const twoPi = opt.pi ? R`2 \times ` + opt.pi : R`2\pi`;
    const Cs = p.Cu != null ? nice(p.Cu) + R` \times 10^{-6}` : nice(p.C);
    const dIe = opt.dIe || 3;       // I_e を続く式に渡すときの桁数（なければ 3 桁）
    const dX = dg([s.X], (x) => p.Ve / x, s.Ie, true, dIe);
    const dw = dg([s.w], isL ? (w) => w * p.L : (w) => 1 / (w * p.C), s.X, true, dX);
    const steps = [];
    steps.push({
      t: 'リアクタンスとは',
      n: isL ? R`コイルは電流の変化を妨げる性質をもつので、交流の電流の流れも妨げます。この妨げの大きさを**誘導リアクタンス** $X_{L}$（単位 $\Omega$）といい、実効値の間に $V_{e} = X_{L}I_{e}$ の関係があります。` : R`コンデンサーは、電荷をためたり放出したりしながら交流の電流を流します。このとき電流の流れにくさを**容量リアクタンス** $X_{C}$（単位 $\Omega$）といい、実効値の間に $V_{e} = X_{C}I_{e}$ の関係があります。`,
      easy: isL ? R`コイルは「電流が変わるのをいやがる」部品でした。交流の電流は絶えず向きも大きさも変わり続けているので、コイルはずっといやがり続けて、電流を通しにくくします。その通しにくさを抵抗のように $\Omega$ で表したものが誘導リアクタンスです。抵抗と違い、熱は出しません。` : R`コンデンサーは、直流ではたまってしまうと電流が止まりますが、交流では電圧の向きが変わるたびに電気が出入りするので、電流が流れ続けます。この流れにくさを、抵抗のように $\Omega$ で表したものが容量リアクタンスです。抵抗と違い、熱は出しません。`,
      pro: R`リアクタンスは、抵抗の代わりにオームの法則 $V_{e} = XI_{e}$ に使える「実効値どうしの比」です。位相のずれがあるので、電圧・電流の瞬間値どうしでは比になりません。`
    });
    steps.push({
      t: 'リアクタンスを求める',
      m: isL
        ? [R`\omega = 2\pi f = ` + twoPi + R` \times ` + f + ' = ' + res3(s.w, dw) + un('rad/s'), R`X_{L} = \omega L = ` + nice(s.w, dw) + R` \times ` + nice(p.L) + ' = ' + res3(s.X, dX) + OHM]
        : [R`\omega = 2\pi f = ` + twoPi + R` \times ` + f + ' = ' + res3(s.w, dw) + un('rad/s'), R`X_{C} = \frac{1}{\omega C} = \frac{1}{` + nice(s.w, dw) + R` \times ` + Cs + R`} = ` + res3(s.X, dX) + OHM],
      n: isL ? R`$X_{L} = \omega L = 2\pi fL$ です。周波数 $f$ が高いほど、$L$ が大きいほど、電流は流れにくくなります。` : R`$X_{C} = \dfrac{1}{\omega C} = \dfrac{1}{2\pi fC}$ です。周波数 $f$ が高いほど、$C$ が大きいほど、電流は流れやすくなります（$X_{C}$ は小さくなる）。電気容量は $\mathrm{F}$ に直して使います（$1\,\mu\mathrm{F} = 10^{-6}\,\mathrm{F}$）。`,
      easy: isL ? R`コイルは、交流の変化が速いほど（周波数が高いほど）強くいやがるので、$X_{L}$ は周波数に**比例**して大きくなります。コイルが大きい（$L$ が大きい）ほどいやがり方も強くなります。` : R`コンデンサーは、交流の向きがひんぱんに変わるほど（周波数が高いほど）、電気がたまりきる前に向きが変わるので電流が流れやすくなります。だから $X_{C}$ は周波数に**反比例**して小さくなります。容量 $C$ が大きいほどたくさん電気が出入りできるので、やはり流れやすくなります。`,
      pro: isL ? R`$X_{L} \propto f$（周波数に比例）、直流（$f = 0$）では $X_{L} = 0$ でただの導線。` : R`$X_{C} \propto \dfrac{1}{f}$（周波数に反比例）、直流（$f = 0$）では $X_{C} \to \infty$ で電流は流れません。`
    });
    steps.push({
      t: '電流の実効値と最大値',
      m: [R`I_{e} = \frac{V_{e}}{` + (isL ? 'X_{L}' : 'X_{C}') + R`} = \frac{` + Ve + '}{' + nice(s.X, dX) + '} = ' + res3(s.Ie, dIe) + un('A'), R`I_{0} = \sqrt{2}\,I_{e} = ` + sig(s.I0) + un('A')],
      n: R`リアクタンスを抵抗のように使って、実効値どうしでオームの法則を用います。最大値は実効値の $\sqrt{2}$ 倍です。`,
      easy: R`リアクタンスは「交流に対する抵抗」のようなものなので、「電圧 ÷ リアクタンス ＝ 電流」で電流の実効値が求まります。`
    });
    steps.push({
      t: '電圧と電流の位相',
      n: isL ? R`コイルでは、電流は電圧より位相が $\dfrac{\pi}{2}$（$90\degree$、$\dfrac{1}{4}$ 周期）**遅れ**ます。電圧が最大になってから $\dfrac{1}{4}$ 周期あとに、電流が最大になります。` : R`コンデンサーでは、電流は電圧より位相が $\dfrac{\pi}{2}$（$90\degree$、$\dfrac{1}{4}$ 周期）**進み**ます。電流が最大になってから $\dfrac{1}{4}$ 周期あとに、電圧が最大になります。`,
      easy: isL ? R`コイルは電流が急に変わるのをいやがるので、電圧がかかっても、電流はすぐには増えません。電圧が先に最大になり、電流はそれを追いかけるように $\dfrac{1}{4}$ 周期おくれて最大になります。グラフでは、橙色の電流が青色の電圧より右（あと）にずれています。` : R`コンデンサーは、電流が流れこんで電気がたまったあとに、電圧が上がります。だから電流が先に最大になり、電圧は $\dfrac{1}{4}$ 周期おくれて最大になります。グラフでは、橙色の電流が青色の電圧より左（さき）にずれています。`,
      pro: isL ? R`コイル：電流が遅れる。コンデンサー：電流が進む。「電圧を基準に、コイルは遅れる」と覚えます。` : R`コイル：電流が遅れる。コンデンサー：電流が進む。「電圧を基準に、コンデンサーは進む」と覚えます。`
    });
    steps.push({
      t: '消費電力は $0$',
      m: [R`\overline{P} = V_{e}I_{e}\cos\frac{\pi}{2} = 0`],
      n: R`電圧と電流の位相が $\dfrac{\pi}{2}$ ずれているので、瞬間電力 $p = vi$ は正と負を交互にくり返し、平均すると $0$ になります。電源から受け取ったエネルギーを、${isL ? '磁場' : '電場'}のかたちで蓄え、次の $\dfrac{1}{4}$ 周期で電源に返しているだけです。`,
      easy: R`抵抗は電気を熱にして使ってしまいますが、コイルやコンデンサーは、電気のエネルギーを一時的にためて、あとで電源に返すだけです。電気をためる向きの $\dfrac{1}{4}$ 周期と、返す向きの $\dfrac{1}{4}$ 周期がくり返されるので、平均すると電力を消費していません。`,
      lv: 2
    });
    steps.push({
      t: '周波数との関係',
      m: [R`f \to 2f:\ ` + (isL ? R`X_{L} \to 2X_{L} = ` : R`X_{C} \to \frac{1}{2}X_{C} = `) + sig(s.X2) + OHM + R`,\ \ I_{e} \to ` + sig(p.Ve / s.X2) + un('A')],
      n: isL ? R`周波数を 2 倍にすると $X_{L}$ は 2 倍、電流は $\dfrac{1}{2}$ 倍になります。` : R`周波数を 2 倍にすると $X_{C}$ は $\dfrac{1}{2}$ 倍、電流は 2 倍になります。`,
      easy: isL ? R`グラフは右上がりの直線です。周波数が高いほどコイルは電流を通しにくくなります。` : R`グラフは右下がりの曲線（反比例）です。周波数が高いほどコンデンサーは電流を通しやすくなります。`,
      fig: graphXf(p, s),
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'em-reactance',
    field: '電磁気',
    unit: 'p-ac',
    title: 'コイル・コンデンサーのリアクタンスと位相',
    desc: '交流電源につないだコイル（誘導リアクタンス $X_{L} = \\omega L$）またはコンデンサー（容量リアクタンス $X_{C} = \\dfrac{1}{\\omega C}$）を流れる電流と、電圧との位相のずれを求め、波形で確かめます。',
    form: [R`X_{L} = \omega L = 2\pi fL`, R`X_{C} = \frac{1}{\omega C} = \frac{1}{2\pi fC}`, R`I_{e} = \frac{V_{e}}{X}`],
    inputs: [
      { key: 'elem', label: '交流電源につなぐ部品', type: 'select', def: 'L', options: [['L', 'コイル（自己インダクタンス L）'], ['C', 'コンデンサー（電気容量 C）']] },
      { key: 'L', label: '自己インダクタンス $L$', unit: 'H', type: 'num', def: '0.10', min: 0.000001, max: 1000, show: (raw) => raw.elem !== 'C' },
      { key: 'C', label: '電気容量 $C$', unit: 'μF', type: 'num', def: '50', min: 0.0001, max: 1000000, show: (raw) => raw.elem === 'C' },
      { key: 'f', label: '周波数 $f$', unit: 'Hz', type: 'num', def: '50', min: 0.01, max: 1000000 },
      { key: 'Ve', label: '電源電圧の実効値 $V_{e}$', unit: 'V', type: 'num', def: '100', min: 0.001, max: 1000000 }
    ],
    examples: [
      { label: 'コイル 0.10 H（50 Hz）', v: { elem: 'L', L: '0.10', f: '50', Ve: '100' } },
      { label: 'コンデンサー 50 μF（50 Hz）', v: { elem: 'C', C: '50', f: '50', Ve: '100' } },
      { label: 'コンデンサー 10 μF（1 kHz）', v: { elem: 'C', C: '10', f: '1000', Ve: '20' } }
    ],
    intro: {
      easy: R`コイルとコンデンサーは、抵抗のように交流の電流を**流しにくくする**はたらきがあります。その大きさを**リアクタンス**といい、単位は抵抗と同じ $\Omega$ です。コイルは周波数が高いほど流しにくく、コンデンサーは周波数が高いほど流しやすくなります。また、抵抗と違って電気を熱に変えず、電圧と電流のタイミング（**位相**）が $\dfrac{1}{4}$ 周期ずれるのが特徴です。`,
      normal: R`$X_{L} = \omega L$、$X_{C} = \dfrac{1}{\omega C}$（$\omega = 2\pi f$）、$I_{e} = \dfrac{V_{e}}{X}$。位相は、コイルで電流が $\dfrac{\pi}{2}$ 遅れ、コンデンサーで電流が $\dfrac{\pi}{2}$ 進みます。平均の消費電力は $0$ です。`,
      pro: R`$X_{L} \propto f$、$X_{C} \propto \dfrac{1}{f}$ の周波数依存が頻出です。「コイル → 遅れ、コンデンサー → 進み」と「$P = 0$」を押さえます。$C$ の単位 $\mu\mathrm{F}$ の直し忘れに注意します。`
    },
    compute(v) {
      const elem = v.elem === 'C' ? 'C' : 'L';
      const p = { elem: elem, L: v.L, C: v.C == null ? NaN : v.C * 1e-6, Cu: v.C, f: v.f, Ve: v.Ve };
      const s = solveReact(p);
      if (![s.X, s.Ie, s.w].every((x) => isFinite(x) && x > 0)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
      const isL = elem === 'L';
      return {
        result: [
          { label: isL ? '誘導リアクタンス X_L' : '容量リアクタンス X_C', tex: sig(s.X) + OHM },
          { label: '電流の実効値 Iₑ', tex: sig(s.Ie) + un('A') },
          { label: '電流の最大値 I₀', tex: sig(s.I0) + un('A') },
          { label: '位相', tex: isL ? R`\text{電流は電圧より } \frac{\pi}{2}\text{ 遅れる}` : R`\text{電流は電圧より } \frac{\pi}{2}\text{ 進む}` },
          { label: '平均の消費電力 P', tex: R`0` + un('W') },
          { label: '周波数を 2 倍にしたときの電流の実効値', tex: sig(p.Ve / s.X2) + un('A') }
        ],
        steps: stepsReact(p, s),
        fig: stack([figSeries([elem], '実効値 ' + tx(v.Ve) + ' V・' + tx(v.f) + ' Hz'), graphPhase(p, s)], 380)
      };
    },
    exercise(rng, level) {
      const pi = R`円周率を $\pi = 3.14$ とする。`;
      if (level === 'adv') {
        // コイルとコンデンサーの並列: 電流は逆位相
        // 問題文で指定した円周率 π = 3.14 で、答えも解説も計算する
        const PI = 3.14;
        let L, C, f, Ve, XL, XC;
        for (let k = 0; k < 300; k++) {
          L = rng.pick([0.10, 0.20, 0.30, 0.50, 1.0]); C = rng.pick([20, 25, 40, 50, 100]); f = rng.pick([50, 60]); Ve = rng.pick([50, 100, 200]);
          XL = 2 * PI * f * L; XC = 1 / (2 * PI * f * C * 1e-6);
          if (Math.abs(1 / XL - 1 / XC) > 0.15 * Math.max(1 / XL, 1 / XC)) break;
        }
        const IL = Ve / XL, IC = Ve / XC, It = Math.abs(IC - IL);
        const p = { Ve: Ve, f: f, L: L, C: C * 1e-6 };
        // 表示する途中の値（I_L・I_C は引き算に、X_L・X_C は割り算に使う）。表示した値で計算し直して、結果の表示と合う桁数にする
        const dI = dg([IL, IC], (a, b) => Math.abs(b - a), It, true);
        const dXL = dg([XL], (x) => Ve / x, IL, true, dI), dXC = dg([XC], (x) => Ve / x, IC, true, dI);
        const sol = [
          {
            t: 'コイルを流れる電流',
            m: [R`X_{L} = 2\pi fL = 2 \times 3.14 \times ` + nice(f) + R` \times ` + nice(L) + ' = ' + res3(XL, dXL) + OHM, R`I_{L} = \frac{V_{e}}{X_{L}} = \frac{` + nice(Ve) + '}{' + nice(XL, dXL) + '} = ' + res3(IL, dI) + un('A')],
            n: R`並列なので、コイルにもコンデンサーにも電源電圧 $V_{e}$ がそのままかかります。コイルのリアクタンス $X_{L} = 2\pi fL$ で、電流の実効値を求めます。`,
            easy: R`並列につないだ部品には、どれにも同じ電圧がかかります。コイルには「電圧 ÷ 誘導リアクタンス」の電流が流れます。`
          },
          {
            t: 'コンデンサーを流れる電流',
            m: [R`X_{C} = \frac{1}{2\pi fC} = \frac{1}{2 \times 3.14 \times ` + nice(f) + R` \times ` + nice(C) + R` \times 10^{-6}} = ` + res3(XC, dXC) + OHM, R`I_{C} = \frac{V_{e}}{X_{C}} = \frac{` + nice(Ve) + '}{' + nice(XC, dXC) + '} = ' + res3(IC, dI) + un('A')],
            n: R`電気容量 $C = ` + nice(C) + R`\,\mu\mathrm{F} = ` + nice(C) + R` \times 10^{-6}\,\mathrm{F}$ に直して、容量リアクタンスと電流を求めます。`,
            easy: R`コンデンサーには「電圧 ÷ 容量リアクタンス」の電流が流れます。$\mu\mathrm{F}$ は $10^{-6}\,\mathrm{F}$ に直して使います。`
          },
          {
            t: '電流の位相を考えて、全体の電流を求める',
            m: [R`I = |I_{C} - I_{L}| = ` + (IC > IL ? R`I_{C} - I_{L} = ` + nice(IC, dI) + ' - ' + nice(IL, dI) : R`I_{L} - I_{C} = ` + nice(IL, dI) + ' - ' + nice(IC, dI)) + ' = ' + sig(It) + un('A')],
            n: R`コイルを流れる電流は電圧より $\dfrac{\pi}{2}$ 遅れ、コンデンサーを流れる電流は電圧より $\dfrac{\pi}{2}$ 進みます。2 つの電流の位相は $\pi$ ずれて**逆向き**なので、電源から流れ出す電流は、大きさの差になります（${IC > IL ? 'コンデンサー' : 'コイル'}の電流の方が大きい）。`,
            easy: R`コイルの電流は「電圧より $\dfrac{1}{4}$ 周期おくれる」、コンデンサーの電流は「電圧より $\dfrac{1}{4}$ 周期すすむ」ので、2 つの電流は、ちょうど半周期ずれて、逆向きになっています。同時に反対向きに流れるので、足し算ではなく**引き算**になります（大きい方から小さい方を引きます）。`,
            pro: R`並列 LC では電流が打ち消しあい、$I = |I_{C} - I_{L}|$。$X_{L} = X_{C}$ のときは $I = 0$（並列共振）になります。`
          }
        ];
        return {
          title: 'コイルとコンデンサーを並列につないだ交流回路',
          body: R`図のように、自己インダクタンス $` + sf(L) + R`\,\mathrm{H}$ のコイルと電気容量 $` + sf(C) + R`\,\mu\mathrm{F}$ のコンデンサーを並列につなぎ、実効値 $` + sf(Ve) + R`\,\mathrm{V}$、周波数 $` + sf(f) + R`\,\mathrm{Hz}$ の交流電源に接続した。コイルの抵抗は無視できる。${pi}次の問いに答えよ。`,
          fig: figParallelLC(p),
          parts: [
            numPart('(1)', R`コイルを流れる電流の実効値 $I_{L}$`, IL, 'A'),
            numPart('(2)', R`コンデンサーを流れる電流の実効値 $I_{C}$`, IC, 'A'),
            numPart('(3)', R`電源から流れ出る電流の実効値 $I$`, It, 'A')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        const C = rng.pick([10, 20, 25, 40, 50, 100]), f = rng.pick([50, 60, 100]), Ve = rng.pick([50, 100, 200]);
        // 問題文で指定した円周率 π = 3.14 で、答えも解説も計算する
        const PI = 3.14;
        const p = { elem: 'C', C: C * 1e-6, Cu: C, f: f, Ve: Ve };
        const s = solveReact(p, PI);
        const I2 = Ve / s.X2;
        const dI = dg([s.Ie], (x) => 2 * x, I2, true);       // I_e を 2 倍して I_e' にするので、その表示で合う桁数
        const st = stepsReact(p, s, { pi: PI, dIe: dI });
        const sol = [st[0], st[1], Object.assign({}, st[2], { t: '電流の実効値', m: [st[2].m[0]], n: R`リアクタンスを抵抗のように使って、実効値どうしでオームの法則 $V_{e} = X_{C}I_{e}$ を用います。` })];
        sol.push({
          t: '周波数を 2 倍にしたとき',
          m: [R`X_{C}' = \frac{1}{2\pi(2f)C} = \frac{X_{C}}{2} = \frac{1}{2 \times 3.14 \times ` + nice(2 * f) + R` \times ` + nice(C) + R` \times 10^{-6}} = ` + sig(s.X2) + OHM, R`I_{e}' = \frac{V_{e}}{X_{C}'} = 2I_{e} = 2 \times ` + nice(s.Ie, dI) + ' = ' + sig(I2) + un('A')],
          n: R`容量リアクタンスは周波数に反比例するので、周波数を 2 倍にすると $\dfrac{1}{2}$ 倍になり、電流の実効値は 2 倍になります。`,
          easy: R`コンデンサーは周波数が高いほど電流を通しやすくなります。$X_{C} = \dfrac{1}{2\pi fC}$ の $f$ が 2 倍になれば、分母が 2 倍になって $X_{C}$ は半分、電流は 2 倍です。計算せずに比で考えられます。`
        });
        return {
          title: 'コンデンサーを流れる交流',
          body: R`電気容量 $` + sf(C) + R`\,\mu\mathrm{F}$ のコンデンサーに、実効値 $` + sf(Ve) + R`\,\mathrm{V}$、周波数 $` + sf(f) + R`\,\mathrm{Hz}$ の交流電圧を加えた。${pi}次の問いに答えよ。`,
          fig: figSeries(['C'], '実効値 ' + tx(Ve) + ' V・' + tx(f) + ' Hz'),
          parts: [
            numPart('(1)', R`コンデンサーの容量リアクタンス $X_{C}$`, s.X, 'Ω'),
            numPart('(2)', R`流れる電流の実効値 $I_{e}$`, s.Ie, 'A'),
            numPart('(3)', R`周波数だけを 2 倍にしたときの、電流の実効値 $I_{e}'$`, I2, 'A')
          ],
          solution: sol
        };
      }
      const L = rng.pick([0.10, 0.20, 0.30, 0.50, 1.0]), f = rng.pick([50, 60, 100]), Ve = rng.pick([50, 100, 200]);
      const PI = 3.14;      // 問題文で指定した円周率で、答えも解説も計算する
      const p = { elem: 'L', L: L, f: f, Ve: Ve };
      const s = solveReact(p, PI);
      const st = stepsReact(p, s, { pi: PI });
      return {
        title: 'コイルを流れる交流',
        body: R`自己インダクタンス $` + sf(L) + R`\,\mathrm{H}$ のコイルに、実効値 $` + sf(Ve) + R`\,\mathrm{V}$、周波数 $` + sf(f) + R`\,\mathrm{Hz}$ の交流電圧を加えた。コイルの抵抗は無視できる。${pi}次の問いに答えよ。`,
        fig: figSeries(['L'], '実効値 ' + tx(Ve) + ' V・' + tx(f) + ' Hz'),
        parts: [
          numPart('(1)', R`コイルの誘導リアクタンス $X_{L}$`, s.X, 'Ω'),
          numPart('(2)', R`流れる電流の実効値 $I_{e}$`, s.Ie, 'A')
        ],
        solution: [st[0], st[1], Object.assign({}, st[2], { t: '電流の実効値', m: [st[2].m[0]], n: R`リアクタンスを抵抗のように使って、実効値どうしでオームの法則 $V_{e} = X_{L}I_{e}$ を用います。` }), Object.assign({}, st[3], { lv: 2 })]
      };
    }
  });

  /* =====================================================================
     3. RLC 直列回路（インピーダンス・位相・共振）
     ===================================================================== */

  // pi: 問題文で円周率の値を指定したとき（演習用）の値。省略すると円周率そのもの
  function solveRLC(p, pi) {
    const tp = 2 * (pi || Math.PI);
    const w = tp * p.f;
    const XL = w * p.L, XC = 1 / (w * p.C), X = XL - XC;
    const Z = Math.hypot(p.R, X), Ie = p.Ve / Z;
    const phi = Math.atan2(X, p.R);
    return {
      w: w, XL: XL, XC: XC, X: X, Z: Z, Ie: Ie, phi: phi, phiDeg: phi * 180 / Math.PI,
      VR: Ie * p.R, VL: Ie * XL, VC: Ie * XC, P: Ie * Ie * p.R, cos: p.R / Z,
      f0: 1 / (tp * Math.sqrt(p.L * p.C)), Imax: p.Ve / p.R
    };
  }
  // 生徒が途中の値を d 桁に丸めながら順に電卓で計算したときの値（pi: 問題文で指定した円周率）。
  // 解説に書く途中の値はこの値を使う（どの行も、直前の行の表示どおりに計算すると、その行の表示になる）
  function fwdRLC(p, d, pi) {
    const r = (x) => U.roundSig(x, d);
    const w = r(2 * (pi || Math.PI) * p.f);
    const XL = r(w * p.L), XC = r(1 / (w * p.C)), Z = r(Math.hypot(p.R, XL - XC)), Ie = r(p.Ve / Z), cs = r(p.R / Z);
    return { w: w, XL: XL, XC: XC, Z: Z, Ie: Ie, cs: cs, VR: Ie * p.R, VL: Ie * XL, VC: Ie * XC, P: Ie * Ie * p.R, P2: p.Ve * Ie * cs, tan: (XL - XC) / p.R };
  }
  // fwdRLC の結果の 3 桁表示が、答え s（solveRLC）と全部合う最小の桁数 d（3〜7）
  function digitsRLC(p, s, pi) {
    const want = { w: s.w, XL: s.XL, XC: s.XC, Z: s.Z, Ie: s.Ie, cs: s.cos, VR: s.VR, VL: s.VL, VC: s.VC, P: s.P, P2: s.P, tan: Math.tan(s.phi) };
    const same = (a, b) => (Math.abs(a) < 1e-9 && Math.abs(b) < 1e-9) || ans(a) === ans(b);     // 共振のとき tan φ は 0
    for (let d = 3; d < 8; d++) {
      const F = fwdRLC(p, d, pi);
      if (Object.keys(want).every((k) => same(F[k], want[k]))) return d;
    }
    return 8;
  }
  // 前進計算の値 fv を表示する。d > 3 で 3 桁と違うときは「d 桁の値 ≒ 3 桁の値（答え tv）」
  function fres(fv, tv, d) {
    return d > 3 && U.roundSig(fv, d) !== ans(tv) ? nice(fv, d) + R` \fallingdotseq ` + sig(tv) : sig(tv);
  }

  // フェーザ図（電流 I を基準にして、各素子の電圧を矢印で表す）
  function figPhasor(p, s, hide) {
    const d = JK.plot.draw(380, 250);
    const ox = 80, oy = 132;
    const vmax = Math.max(s.VR, s.VL, s.VC, p.Ve) || 1;
    const k = 92 / vmax;
    d.arrow(ox - 16, oy, ox + 196, oy, { cls: 'dim', w: 1.2 });
    d.text(ox + 198, oy + 16, 'I（基準）', { anchor: 'end', cls: 'dim', size: 11 });
    const yR = oy - k * (s.VL - s.VC);
    d.arrow(ox, oy, ox + k * s.VR, oy, { cls: 'c3', w: 2.6, label: 'V_R', lpos: -1 });
    d.arrow(ox, oy, ox, oy - k * s.VL, { cls: 'c1', w: 2.6, label: 'V_L' });
    d.arrow(ox, oy, ox, oy + k * s.VC, { cls: 'c2', w: 2.6, label: 'V_C' });
    if (Math.abs(s.VL - s.VC) > 1e-9 * vmax) {
      d.line(ox + k * s.VR, oy, ox + k * s.VR, yR, { cls: 'dim', dash: true, w: 1 });
      d.line(ox, yR, ox + k * s.VR, yR, { cls: 'dim', dash: true, w: 1 });
    }
    d.arrow(ox, oy, ox + k * s.VR, yR, { cls: 'c4', w: 3, label: 'V（電源）' });
    if (Math.abs(s.phiDeg) > 0.5) d.angle(ox, oy, 38, 0, s.phiDeg, 'φ', { cls: 'c3' });
    d.text(14, 18, 'フェーザ図（電流を基準にした各電圧）', { anchor: 'start', size: 11 });
    if (!hide) {
      const lines = ['V_R = ' + tx3(s.VR) + ' V', 'V_L = ' + tx3(s.VL) + ' V', 'V_C = ' + tx3(s.VC) + ' V', 'V = ' + tx(p.Ve) + ' V', 'φ = ' + tx3(s.phiDeg) + '°'];
      lines.forEach((t, i) => d.text(290, 150 + i * 17, t, { anchor: 'start', size: 11 }));
    }
    d.text(190, 238, s.X > 0 ? 'X_L > X_C: 電圧が電流より φ 進む（誘導性）' : (s.X < 0 ? 'X_L < X_C: 電圧が電流より |φ| 遅れる（容量性）' : 'X_L = X_C: 共振（φ = 0）'), { cls: 'dim', size: 11 });
    return d.svg();
  }

  function graphRes(p, s) {
    const fmax = Math.max(s.f0 * 2.2, p.f * 1.3);
    return JK.plot.graph({
      w: 340, h: 210, x: [0, fmax], y: [0, s.Imax * 1.18],
      curves: [{ f: (f) => p.Ve / Math.hypot(p.R, TWO_PI * f * p.L - 1 / (TWO_PI * f * p.C)), cls: 'c1', domain: [fmax / 1000, fmax] }],
      points: [{ x: p.f, y: s.Ie, label: 'いまの f', cls: 'c3', pos: 'tr' }],
      vlines: [{ x: s.f0, label: 'f₀' }], hlines: [{ y: s.Imax, label: 'Vₑ/R' }],
      axis: ['f [Hz]', 'Iₑ [A]']
    });
  }

  // opt.pi: 問題文で円周率の値を指定したときの値（3.14 など）。省略すると π のまま計算する
  // 途中の値は、生徒が d 桁に丸めながら順に計算した値（fwdRLC）で書く。どの行も、直前の行の表示どおりに計算すると、その行の表示になる
  function stepsRLC(p, s, opt) {
    opt = opt || {};
    const Rr = nice(p.R), f = nice(p.f), Ve = nice(p.Ve);
    const twoPi = opt.pi ? R`2 \times ` + opt.pi : R`2\pi`;
    const Cs = p.Cu != null ? nice(p.Cu) + R` \times 10^{-6}` : nice(p.C);
    const D = digitsRLC(p, s, opt.pi), F = fwdRLC(p, D, opt.pi);
    const cv = (x) => nice(x, D);
    const steps = [];
    steps.push({
      t: '回路の構成とリアクタンス',
      m: [R`\omega = 2\pi f = ` + twoPi + R` \times ` + f + ' = ' + fres(F.w, s.w, D) + un('rad/s'), R`X_{L} = \omega L = ` + cv(F.w) + R` \times ` + nice(p.L) + ' = ' + fres(F.XL, s.XL, D) + OHM, R`X_{C} = \frac{1}{\omega C} = \frac{1}{` + cv(F.w) + R` \times ` + Cs + R`} = ` + fres(F.XC, s.XC, D) + OHM],
      n: R`直列回路では、抵抗・コイル・コンデンサーに**同じ電流** $I$ が流れます。まず角周波数 $\omega$ から、コイルのリアクタンス $X_{L} = \omega L$ とコンデンサーのリアクタンス $X_{C} = \dfrac{1}{\omega C}$ を求めます（$C$ は $\mathrm{F}$ に直します）。`,
      easy: R`3 つの部品（抵抗・コイル・コンデンサー）が 1 本の道に並んでいるので、電流はどこでも同じです。それぞれの「流しにくさ」を求めます。抵抗は $R$、コイルは $X_{L}$、コンデンサーは $X_{C}$ です。`,
      fig: figSeries(['R', 'L', 'C'], '実効値 ' + tx(p.Ve) + ' V・' + tx(p.f) + ' Hz')
    });
    steps.push({
      t: 'インピーダンス（回路全体の流しにくさ）',
      m: [R`Z = \sqrt{R^{2} + (X_{L} - X_{C})^{2}}`, R`Z = \sqrt{` + Rr + R`^{2} + (` + cv(F.XL) + ' - ' + cv(F.XC) + R`)^{2}} = ` + fres(F.Z, s.Z, D) + OHM],
      n: R`抵抗・コイル・コンデンサーの電圧は**位相がそろっていない**ので、$R + X_{L} + X_{C}$ のような単純な足し算はできません。$X_{L}$ と $X_{C}$ は逆向きに打ち消しあい、$R$ とは直角の関係にあるので、**三平方の定理**のように合成します。これを**インピーダンス** $Z$ といいます。`,
      easy: R`抵抗の電圧は電流と同じタイミング、コイルの電圧は電流より $\dfrac{1}{4}$ 周期さき、コンデンサーの電圧は電流より $\dfrac{1}{4}$ 周期おくれています。タイミングがずれているので、そのまま足せません。横に $R$、縦に $X_{L} - X_{C}$（コイルとコンデンサーは逆向きなので引き算）をとった直角三角形の斜辺が、全体の流しにくさ $Z$ です。`,
      pro: R`$X = X_{L} - X_{C}$ とおくと $Z = \sqrt{R^{2} + X^{2}}$。$X_{L} = X_{C}$ のとき $Z = R$ で最小になります。`
    });
    steps.push({
      t: '電流の実効値',
      m: [R`I_{e} = \frac{V_{e}}{Z} = \frac{` + Ve + '}{' + cv(F.Z) + '} = ' + fres(F.Ie, s.Ie, D) + un('A')],
      n: R`インピーダンスを抵抗の代わりにして、実効値どうしでオームの法則を使います。`,
      easy: R`全体の流しにくさ $Z$ が分かったので、「電圧 ÷ 流しにくさ ＝ 電流」で電流の実効値が求まります。`,
      pro: R`各部分の電圧は $V_{R} = RI_{e}$、$V_{L} = X_{L}I_{e}$、$V_{C} = X_{C}I_{e}$。フェーザ図で $V_{e}^{2} = V_{R}^{2} + (V_{L} - V_{C})^{2}$ を確かめると検算になります。`
    });
    steps.push({
      t: '各部分の電圧とフェーザ図',
      m: [R`V_{R} = RI_{e} = ` + Rr + R` \times ` + cv(F.Ie) + ' = ' + sig(s.VR) + un('V'), R`V_{L} = X_{L}I_{e} = ` + cv(F.XL) + R` \times ` + cv(F.Ie) + ' = ' + sig(s.VL) + un('V'), R`V_{C} = X_{C}I_{e} = ` + cv(F.XC) + R` \times ` + cv(F.Ie) + ' = ' + sig(s.VC) + un('V'), R`V_{e} = \sqrt{V_{R}^{2} + (V_{L} - V_{C})^{2}} = ` + sig(Math.hypot(s.VR, s.VL - s.VC)) + un('V')],
      n: R`各部分の電圧は「電流 × 流しにくさ」です。電流を基準（右向き）として電圧を矢印（フェーザ）で描くと、$V_{R}$ は同じ向き、$V_{L}$ は $90\degree$ 進んだ向き（上）、$V_{C}$ は $90\degree$ 遅れた向き（下）です。それらの合成が電源電圧 $V_{e}$ になります。部分の電圧の和は、電源電圧より大きくなることがあります。`,
      easy: R`電流を横向きの基準の矢印とします。抵抗の電圧はそれと同じ向き、コイルの電圧は上向き、コンデンサーの電圧は下向きの矢印で表します。矢印を足し合わせた（ベクトルの和）が電源の電圧で、上向きと下向きは打ち消しあいます。このため、$V_{L}$ や $V_{C}$ が電源電圧より大きくなることもあります。`,
      lv: 2
    });
    steps.push({
      t: '位相差と力率',
      m: [R`\tan\varphi = \frac{X_{L} - X_{C}}{R} = \frac{` + cv(F.XL) + ' - ' + cv(F.XC) + '}{' + Rr + '} = ' + sig(Math.tan(s.phi)) + R`\ \Rightarrow\ \varphi = ` + sig(s.phiDeg) + R`\degree`, R`\cos\varphi = \frac{R}{Z} = \frac{` + Rr + '}{' + cv(F.Z) + '} = ' + fres(F.cs, s.cos, D)],
      n: s.X > 0 ? R`$X_{L} > X_{C}$ なので回路はコイルのような性質（**誘導性**）をもち、電圧は電流より位相が $\varphi$ **進み**ます（電流が遅れます）。$\cos\varphi = \dfrac{R}{Z}$ を**力率**といいます。` : (s.X < 0 ? R`$X_{L} < X_{C}$ なので回路はコンデンサーのような性質（**容量性**）をもち、電圧は電流より位相が $|\varphi|$ **遅れ**ます（電流が進みます）。$\cos\varphi = \dfrac{R}{Z}$ を**力率**といいます。` : R`$X_{L} = X_{C}$ なので位相差は $0$（電圧と電流は同位相）です。$\cos\varphi = 1$ です。`),
      easy: R`直角三角形の「横 $R$、縦 $X_{L} - X_{C}$」で、斜辺が $Z$ でした。電圧と電流の位相のずれ $\varphi$ は、この三角形の底角にあたり、$\tan\varphi = \dfrac{縦}{横}$ で求まります。$\cos\varphi = \dfrac{横}{斜辺} = \dfrac{R}{Z}$ は、電流と電圧の「そろい具合」（力率）です。`,
      pro: R`$\varphi > 0$：コイル的（電流が遅れる）、$\varphi < 0$：コンデンサー的（電流が進む）。$\cos\varphi = \dfrac{R}{Z}$ は力率で、$\overline{P} = V_{e}I_{e}\cos\varphi$ に現れます。`
    });
    steps.push({
      t: '平均の消費電力',
      m: [R`\overline{P} = I_{e}^{2}R = ` + pw2(cv(F.Ie)) + R` \times ` + Rr + ' = ' + sig(s.P) + un('W'), R`\overline{P} = V_{e}I_{e}\cos\varphi = ` + Ve + R` \times ` + cv(F.Ie) + R` \times ` + cv(F.cs) + ' = ' + sig(s.P) + un('W')],
      n: R`電力を消費するのは抵抗だけで、コイルとコンデンサーは平均では電力を消費しません。したがって $\overline{P} = I_{e}^{2}R$。電源の側から見れば、$V_{e}I_{e}\cos\varphi$ と同じです。`,
      easy: R`熱になって電気を使ってしまうのは抵抗だけです。コイルとコンデンサーは、電気をためたり返したりするだけなので、平均すると電力を使いません。だから、抵抗に流れる電流の実効値を使って「$I^{2}R$」で計算すれば消費電力になります。`,
      lv: 2
    });
    steps.push({
      t: '共振',
      m: [R`X_{L} = X_{C} \;\Rightarrow\; \omega_{0}L = \frac{1}{\omega_{0}C} \;\Rightarrow\; f_{0} = \frac{1}{2\pi\sqrt{LC}} = ` + freqTex(s.f0), R`Z = R,\quad I_{\max} = \frac{V_{e}}{R} = ` + sig(s.Imax) + un('A') + R`,\quad \varphi = 0`],
      n: R`$X_{L} = X_{C}$ となる周波数 $f_{0}$ で、コイルとコンデンサーの電圧が打ち消しあい、$Z = R$ で最小、電流 $I_{e} = \dfrac{V_{e}}{R}$ が最大になります。これを**共振**といいます。ラジオの選局（同調回路）に利用されています。`,
      easy: R`コイルは周波数が高いほど流しにくく、コンデンサーは周波数が高いほど流しやすい、という逆の性質をもっています。そのため、2 つの流しにくさがちょうど等しくなる周波数 $f_{0}$ があります。そのとき、コイルとコンデンサーの効果が打ち消しあって、抵抗だけの回路と同じになり、電流が最大になります。ブランコを自分のゆれの周期にあわせて押すと大きくゆれるのと似た現象です。`,
      fig: graphRes(p, s),
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'em-rlc',
    field: '電磁気',
    unit: 'p-ac',
    title: 'RLC 直列回路（インピーダンス・位相差・共振）',
    desc: '抵抗・コイル・コンデンサーの直列回路について、リアクタンス・インピーダンス $Z = \\sqrt{R^{2} + (X_{L} - X_{C})^{2}}$・電流・位相差・消費電力・共振周波数を求め、フェーザ図と共振曲線で確かめます。',
    form: [R`Z = \sqrt{R^{2} + (X_{L} - X_{C})^{2}},\quad I_{e} = \frac{V_{e}}{Z}`, R`\tan\varphi = \frac{X_{L} - X_{C}}{R},\quad \overline{P} = I_{e}^{2}R = V_{e}I_{e}\cos\varphi`, R`f_{0} = \frac{1}{2\pi\sqrt{LC}}`],
    inputs: [
      { key: 'R', label: '抵抗 $R$', unit: 'Ω', type: 'num', def: '40', min: 0.01, max: 1000000 },
      { key: 'L', label: '自己インダクタンス $L$', unit: 'H', type: 'num', def: '0.30', min: 0.000001, max: 1000 },
      { key: 'C', label: '電気容量 $C$', unit: 'μF', type: 'num', def: '50', min: 0.0001, max: 1000000 },
      { key: 'f', label: '周波数 $f$', unit: 'Hz', type: 'num', def: '50', min: 0.01, max: 1000000 },
      { key: 'Ve', label: '電源電圧の実効値 $V_{e}$', unit: 'V', type: 'num', def: '100', min: 0.001, max: 1000000 }
    ],
    examples: [
      { label: 'コイル的な回路（X_L > X_C）', v: { R: '40', L: '0.30', C: '50', f: '50', Ve: '100' } },
      { label: 'コンデンサー的な回路（X_L < X_C）', v: { R: '30', L: '0.10', C: '50', f: '50', Ve: '100' } },
      { label: '共振（f = f₀ に近い）', v: { R: '10', L: '0.10', C: '10', f: '159', Ve: '50' } }
    ],
    intro: {
      easy: R`抵抗・コイル・コンデンサーを 1 本の道に並べた回路（**RLC 直列回路**）では、3 つの部品を同じ電流が流れますが、それぞれの電圧が最大になるタイミングは**ずれています**。そのため、流しにくさは単純な足し算ではなく、直角三角形の斜辺のように $Z = \sqrt{R^{2} + (X_{L} - X_{C})^{2}}$ と合成します。コイルとコンデンサーの効果は逆向きなので、ちょうど打ち消しあう周波数 $f_{0}$（**共振**）で、電流が最大になります。`,
      normal: R`$Z = \sqrt{R^{2} + (X_{L} - X_{C})^{2}}$、$I_{e} = \dfrac{V_{e}}{Z}$、$\tan\varphi = \dfrac{X_{L} - X_{C}}{R}$（$\varphi > 0$ で電流が遅れる）、$\overline{P} = I_{e}^{2}R = V_{e}I_{e}\cos\varphi$。共振周波数 $f_{0} = \dfrac{1}{2\pi\sqrt{LC}}$ で $Z = R$、$I_{e}$ は最大です。`,
      pro: R`電流を基準にしたフェーザ図（$V_{R}$ 同相、$V_{L}$ は $+90\degree$、$V_{C}$ は $-90\degree$）で考えます。共振時は $V_{L} = V_{C}$ で、それぞれが電源電圧 $V_{e}$ より大きくなり得ます（$\dfrac{X_{L}}{R}$ 倍）。単位は $C$ の $\mu\mathrm{F} \to \mathrm{F}$ に注意します。`
    },
    compute(v) {
      const p = { R: v.R, L: v.L, C: v.C * 1e-6, Cu: v.C, f: v.f, Ve: v.Ve };
      const s = solveRLC(p);
      if (![s.XL, s.XC, s.Z, s.Ie, s.phiDeg, s.f0].every(isFinite)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
      const kind = Math.abs(s.X) < 1e-9 * s.Z ? '共振（位相差 0）' : (s.X > 0 ? 'コイル的（電流が遅れる）' : 'コンデンサー的（電流が進む）');
      return {
        result: [
          { label: 'コイル・コンデンサーのリアクタンス', tex: R`X_{L} = ` + sig(s.XL) + R`\,\Omega,\ \ X_{C} = ` + sig(s.XC) + OHM },
          { label: 'インピーダンス Z', tex: sig(s.Z) + OHM },
          { label: '電流の実効値 Iₑ', tex: sig(s.Ie) + un('A') },
          { label: '電圧と電流の位相差 φ（電圧が進む向きを正）', tex: sig(s.phiDeg) + R`\degree\ \ (\text{` + kind + R`})` },
          { label: '各部分の電圧', tex: R`V_{R} = ` + sig(s.VR) + R`,\ V_{L} = ` + sig(s.VL) + R`,\ V_{C} = ` + sig(s.VC) + un('V') },
          { label: '平均の消費電力 P（力率 cosφ）', tex: sig(s.P) + un('W') + R`\ \ (\cos\varphi = ` + sig(s.cos) + R`)` },
          { label: '共振周波数 f₀', tex: freqTex(s.f0) + R`\ \ (\text{共振時の電流 } ` + sig(s.Imax) + R`\,\mathrm{A})` }
        ],
        steps: stepsRLC(p, s),
        fig: figPhasor(p, s, false)
      };
    },
    exercise(rng, level) {
      const pi = R`円周率を $\pi = 3.14$ とする。`;
      if (level === 'adv') {
        // 共振: LC = 1/ω0²
        const combos = [[0.10, 10], [0.20, 5.0], [0.50, 2.0], [0.25, 4.0], [0.40, 2.5], [1.0, 1.0]];   // LC = 1e-6 → ω0 = 1000 rad/s
        const cmb = rng.pick(combos);
        const L = cmb[0], C = cmb[1], Rr = rng.pick([10, 20, 25, 50]), Ve = rng.pick([20, 50, 100]);
        // 問題文で指定した円周率 π = 3.14 で、答えも解説も計算する（ω₀ = 1000 rad/s なので、周波数 f₀ = 1000 / (2 × 3.14)）
        const PI = 3.14;
        const p = { R: Rr, L: L, C: C * 1e-6, f: 1000 / (2 * PI), Ve: Ve };
        const s = solveRLC(p, PI);
        const Q = s.VC;
        const sol = [
          {
            t: '共振周波数',
            m: [R`X_{L} = X_{C} \;\Rightarrow\; \omega_{0}L = \frac{1}{\omega_{0}C} \;\Rightarrow\; \omega_{0} = \frac{1}{\sqrt{LC}} = \frac{1}{\sqrt{` + nice(L) + R` \times ` + nice(C) + R` \times 10^{-6}}} = ` + sig(1000) + un('rad/s'), R`f_{0} = \frac{\omega_{0}}{2\pi} = \frac{1000}{2 \times 3.14} = ` + res3(s.f0, 4) + un('Hz')],
            n: R`電流が最大になる（共振）のは、コイルのリアクタンスとコンデンサーのリアクタンスが等しくなるときです。$\omega_{0}L = \dfrac{1}{\omega_{0}C}$ を解いて $\omega_{0} = \dfrac{1}{\sqrt{LC}}$、$f_{0} = \dfrac{\omega_{0}}{2\pi}$ です。$C$ は $\mathrm{F}$ に直します（$` + nice(C) + R`\,\mu\mathrm{F} = ` + nice(C) + R` \times 10^{-6}\,\mathrm{F}$）。`,
            easy: R`コイルの流しにくさ $\omega L$ は周波数とともに大きくなり、コンデンサーの流しにくさ $\dfrac{1}{\omega C}$ は小さくなります。この 2 つがちょうど等しくなる周波数で、打ち消しあって電流が最大になります。それが共振周波数です。`,
            pro: R`$LC$ の積が $10^{-6}$ なら $\omega_{0} = 10^{3}\,\mathrm{rad/s}$ と暗算できます。$f_{0} = \dfrac{\omega_{0}}{2\pi}$ を忘れずに。`
          },
          {
            t: '共振のときの電流',
            m: [R`X_{L} = X_{C} \;\Rightarrow\; Z = R,\qquad I_{\max} = \frac{V_{e}}{R} = \frac{` + nice(Ve) + '}{' + nice(Rr) + '} = ' + sig(s.Imax) + un('A')],
            n: R`共振のときコイルとコンデンサーの電圧が打ち消しあい、インピーダンスは抵抗だけの $Z = R$ になります。電流の実効値は $I_{e} = \dfrac{V_{e}}{R}$ で、最大です。`,
            easy: R`コイルとコンデンサーの効果が打ち消しあうと、回路には抵抗しか残らないのと同じです。だから電流は「電圧 ÷ 抵抗」で最大になります。`
          },
          {
            t: '共振のときのコンデンサーの電圧',
            m: [R`X_{C} = \frac{1}{\omega_{0}C} = \frac{1}{1000 \times ` + nice(C) + R` \times 10^{-6}} = ` + sig(s.XC) + OHM, R`V_{C} = X_{C}I_{\max} = ` + nice(s.XC) + R` \times ` + nice(s.Imax) + ' = ' + sig(Q) + un('V')],
            n: R`コンデンサーの両端の電圧は「流れる電流 × 容量リアクタンス」です。共振では $V_{L} = V_{C}$ で、どちらも電源電圧 $` + nice(Ve) + R`\,\mathrm{V}$ より大きくなっています（$\dfrac{X_{C}}{R}$ 倍）。`,
            easy: R`電流が最大になるので、コンデンサーにかかる電圧（電流 × $X_{C}$）も大きくなります。コイルの電圧もまったく同じ大きさで、向きが反対のため、足し合わせると電源電圧に影響しません。電源電圧より大きな電圧がコンデンサーにかかるのは、意外に思えるかもしれませんが、このとおりに計算できます。`,
            pro: R`共振時は $V_{L} = V_{C} = \dfrac{X_{C}}{R}V_{e}$（電圧拡大率）。これが共振回路の「鋭さ」を表します。`
          }
        ];
        return {
          title: 'RLC 直列回路の共振',
          body: R`抵抗値 $` + sf(Rr) + R`\,\mathrm{\Omega}$ の抵抗、自己インダクタンス $` + sf(L) + R`\,\mathrm{H}$ のコイル、電気容量 $` + sf(C) + R`\,\mu\mathrm{F}$ のコンデンサーを直列につなぎ、実効値 $` + sf(Ve) + R`\,\mathrm{V}$ で周波数を変えられる交流電源に接続した。電源の周波数を変えていくと、ある周波数 $f_{0}$ で電流が最大になった。${pi}次の問いに答えよ。`,
          fig: figSeries(['R', 'L', 'C'], '実効値 ' + tx(Ve) + ' V（周波数可変）'),
          parts: [
            numPart('(1)', R`電流が最大になる周波数 $f_{0}$`, s.f0, 'Hz'),
            numPart('(2)', R`そのときの電流の実効値 $I_{\max}$`, s.Imax, 'A'),
            numPart('(3)', R`そのときのコンデンサーの両端の電圧の実効値 $V_{C}$`, Q, 'V')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        const PI = 3.14;      // 問題文で指定した円周率で、答えも解説も計算する
        let L, C, f, Rr, Ve, s, p;
        for (let k = 0; k < 300; k++) {
          L = rng.pick([0.10, 0.20, 0.30, 0.50]); C = rng.pick([25, 40, 50, 100]); f = rng.pick([50, 60]); Rr = rng.pick([20, 30, 40, 50, 100]); Ve = rng.pick([50, 100, 200]);
          p = { R: Rr, L: L, C: C * 1e-6, Cu: C, f: f, Ve: Ve };
          s = solveRLC(p, PI);
          if (Math.abs(s.X) > 0.3 * s.Z) break;
        }
        const st = stepsRLC(p, s, { pi: PI });
        return {
          title: 'RLC 直列回路の電流と電圧',
          body: R`抵抗値 $` + sf(Rr) + R`\,\mathrm{\Omega}$ の抵抗、自己インダクタンス $` + sf(L) + R`\,\mathrm{H}$ のコイル、電気容量 $` + sf(C) + R`\,\mu\mathrm{F}$ のコンデンサーを直列につなぎ、実効値 $` + sf(Ve) + R`\,\mathrm{V}$、周波数 $` + sf(f) + R`\,\mathrm{Hz}$ の交流電源に接続した。${pi}次の問いに答えよ。`,
          fig: figSeries(['R', 'L', 'C'], '実効値 ' + tx(Ve) + ' V・' + tx(f) + ' Hz'),
          parts: [
            numPart('(1)', R`回路全体のインピーダンス $Z$`, s.Z, 'Ω'),
            numPart('(2)', R`回路を流れる電流の実効値 $I_{e}$`, s.Ie, 'A'),
            numPart('(3)', R`コンデンサーの両端の電圧の実効値 $V_{C}$`, s.VC, 'V')
          ],
          solution: [st[0], st[1], st[2], Object.assign({}, st[3], { lv: 1 })]       // (3) の V_C を出す電圧の段は lv 1 にする
        };
      }
      // basic: リアクタンスを直接与える
      const trip = rng.pick([[30, 40], [40, 30], [60, 80], [80, 60], [50, 120], [120, 50], [90, 120]]);
      const Rr = trip[0], X = trip[1];
      const XC2 = rng.pick([20, 40, 60, 80]);
      let XL2 = rng.bool() ? XC2 + X : XC2 - X;
      if (XL2 <= 0) XL2 = XC2 + X;
      const Ve = rng.pick([50, 100, 200]);
      const Z = Math.hypot(Rr, XL2 - XC2), Ie = Ve / Z, P = Ie * Ie * Rr;
      const sol = [
        {
          t: 'インピーダンス',
          m: [R`Z = \sqrt{R^{2} + (X_{L} - X_{C})^{2}} = \sqrt{` + nice(Rr) + R`^{2} + (` + nice(XL2) + ' - ' + nice(XC2) + R`)^{2}} = ` + sig(Z) + OHM],
          n: R`直列回路のインピーダンスは、$R$ と $X_{L} - X_{C}$ を 2 辺とする直角三角形の斜辺です。`,
          easy: R`抵抗の電圧、コイルの電圧、コンデンサーの電圧は、最大になるタイミングがずれているので、そのまま足せません。「横 $R$・縦 $X_{L} - X_{C}$」の直角三角形の斜辺が、回路全体の流しにくさ $Z$ です。`,
          pro: R`$(R, X)$ が $3 : 4 : 5$ などの組になっていることが多いので、暗算できます。`
        },
        {
          t: '電流の実効値',
          m: [R`I_{e} = \frac{V_{e}}{Z} = \frac{` + nice(Ve) + '}{' + nice(Z) + '} = ' + sig(Ie) + un('A')],
          n: R`インピーダンス $Z$ を抵抗のように使って、実効値どうしでオームの法則を用います。`,
          easy: R`全体の流しにくさ $Z$ が分かれば、「電圧 ÷ 流しにくさ ＝ 電流」で電流が求まります。`
        },
        {
          t: '平均の消費電力',
          m: [R`\overline{P} = I_{e}^{2}R = \left(\frac{V_{e}}{Z}\right)^{2}R = \left(\frac{` + nice(Ve) + '}{' + nice(Z) + R`}\right)^{2} \times ` + nice(Rr) + ' = ' + sig(P) + un('W')],
          n: R`平均の電力を消費するのは抵抗だけです。コイルとコンデンサーは電気をためて返すだけで、平均の消費電力は $0$ です。だから、回路全体の消費電力は、抵抗の $I_{e}^{2}R$ に等しくなります。`,
          easy: R`熱になって電気を使うのは抵抗だけです。コイルとコンデンサーは電気をためたり返したりするだけなので、電力を使いません。だから、抵抗に流れる電流を使って「$I^{2}R$」で計算します。`
        }
      ];
      return {
        title: 'RLC 直列回路のインピーダンス',
        body: R`抵抗値 $R = ` + sf(Rr) + R`\,\mathrm{\Omega}$ の抵抗、リアクタンス $X_{L} = ` + sf(XL2) + R`\,\mathrm{\Omega}$ のコイル、リアクタンス $X_{C} = ` + sf(XC2) + R`\,\mathrm{\Omega}$ のコンデンサーを直列につなぎ、実効値 $` + sf(Ve) + R`\,\mathrm{V}$ の交流電源に接続した。次の問いに答えよ。`,
        fig: figSeries(['R', 'L', 'C'], '実効値 ' + tx(Ve) + ' V'),
        parts: [
          numPart('(1)', R`回路全体のインピーダンス $Z$`, Z, 'Ω'),
          numPart('(2)', R`回路を流れる電流の実効値 $I_{e}$`, Ie, 'A'),
          numPart('(3)', R`抵抗で消費される平均の電力 $\overline{P}$`, P, 'W')
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     4. 変圧器と送電
     ===================================================================== */

  function solveTrans(p) {
    if (p.mode === 'line') {
      const I = p.P / p.Vt;             // [kW]/[kV] = [A]
      const loss = I * I * p.rl;        // [W]
      const Pw = p.P * 1e3;
      return { I: I, loss: loss, Pw: Pw, frac: loss / Pw, drop: I * p.rl, I10: I / 10, loss10: loss / 100, deliv: Pw - loss };
    }
    const V2 = p.V1 * p.N2 / p.N1, I2 = V2 / p.Rl, P2 = V2 * I2, P1 = P2 / (p.eta / 100), I1 = P1 / p.V1;
    return { V2: V2, I2: I2, P2: P2, P1: P1, I1: I1, ratio: p.N2 / p.N1 };
  }

  // 鉄心に巻いた 2 つのコイル。s = null なら 2 次側の値を書かない
  function figTrans(p, s) {
    const d = JK.plot.draw(380, 220);
    d.rect(150, 44, 80, 108, { cls: 'fg', w: 2 });
    d.rect(170, 64, 40, 68, { cls: 'fg', w: 1.2 });
    d.rect(158, 52, 64, 92, { cls: 'c4', dash: true, w: 1.2 });
    d.arrow(190, 52, 204, 52, { cls: 'c4', w: 1.4 });
    d.text(190, 40, '磁束', { size: 10, cls: 'c4' });
    d.acsource(44, 98, 14);
    d.wire([[44, 84], [44, 56], [138, 56]]);
    d.coil(138, 56, 138, 140, { n: 5 });
    d.wire([[138, 140], [44, 140], [44, 112]]);
    d.wire([[242, 56], [326, 56]]);
    d.coil(242, 56, 242, 140, { n: 5 });
    d.wire([[242, 140], [326, 140]]);
    d.resistor(326, 56, 326, 140, {});
    d.text(116, 100, 'N₁', { anchor: 'end', italic: true });
    d.text(264, 100, 'N₂', { anchor: 'start', italic: true });
    d.arrow(66, 48, 100, 48, { cls: 'c3', w: 1.8, label: 'I₁' });
    d.arrow(270, 48, 304, 48, { cls: 'c3', w: 1.8, label: 'I₂' });
    d.text(44, 164, 'V₁ = ' + tx(p.V1) + ' V', { size: 11 });
    d.text(190, 164, 'N₁ = ' + p.N1 + ' 回 ／ N₂ = ' + p.N2 + ' 回', { size: 11 });
    d.text(326, 164, 'R = ' + tx(p.Rl) + ' Ω', { size: 11 });
    if (s) d.text(190, 188, 'V₂ = V₁N₂/N₁ = ' + tx3(s.V2) + ' V ／ I₂ = ' + tx3(s.I2) + ' A ／ I₁ = ' + tx3(s.I1) + ' A', { cls: 'dim', size: 11 });
    d.text(190, 208, '（1 次側 = 電源側、2 次側 = 負荷側）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 送電のブロック図: 発電所 → 昇圧 → 送電線 → 降圧 → 家庭
  function figLine(p, s) {
    const d = JK.plot.draw(380, 200);
    const box = (x, w, t) => { d.rect(x, 52, w, 54, { cls: 'fg', fill: 'f1', rx: 4 }); t.split('\n').forEach((ln, i, a) => d.text(x + w / 2, 79 + (i - (a.length - 1) / 2) * 15, ln, { size: 11 })); };
    box(14, 62, '発電所\nP');
    box(96, 56, '昇圧\n変圧器');
    box(228, 56, '降圧\n変圧器');
    box(306, 62, '家庭・\n工場');
    d.wire([[76, 79], [96, 79]]);
    d.wire([[152, 62], [228, 62]]);
    d.wire([[152, 96], [228, 96]]);
    d.wire([[284, 79], [306, 79]]);
    d.resistor(176, 62, 204, 62, {});
    d.resistor(176, 96, 204, 96, {});
    d.text(190, 44, '送電線（抵抗 r）', { size: 11 });
    d.arrow(150, 118, 206, 118, { cls: 'c3', w: 2, label: 'I' });
    d.text(190, 140, '送電電圧 V', { size: 11 });
    d.text(190, 166, 'P = ' + tx(p.P) + ' kW ／ V = ' + tx(p.Vt) + ' kV ／ r = ' + tx(p.rl) + ' Ω', { size: 11 });
    if (s) d.text(190, 188, '電流 I = P/V = ' + tx3(s.I) + ' A ／ 損失 I²r = ' + tx3(s.loss) + ' W', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 生徒が途中の値を d 桁に丸めながら順に電卓で計算したときの値
  function fwdTrans(p, d) {
    const r = (x) => U.roundSig(x, d);
    if (p.mode === 'line') {
      const I = r(p.P / p.Vt), loss = r(I * I * p.rl);
      return { I: I, loss: loss, drop: r(I * p.rl), frac: loss / (p.P * 1e3) * 100 };
    }
    const V2 = r(p.V1 * p.N2 / p.N1), I2 = r(V2 / p.Rl), P2 = r(V2 * I2), P1 = r(P2 / (p.eta / 100)), I1 = r(P1 / p.V1);
    return { V2: V2, I2: I2, P2: P2, P1: P1, I1: I1 };
  }
  // fwdTrans の結果の 3 桁表示が、答え s（solveTrans）と全部合う最小の桁数 d（3〜7）
  function digitsTrans(p, s) {
    const want = p.mode === 'line' ? { I: s.I, loss: s.loss, drop: s.drop, frac: s.frac * 100 } : { V2: s.V2, I2: s.I2, P2: s.P2, P1: s.P1, I1: s.I1 };
    for (let d = 3; d < 8; d++) {
      const F = fwdTrans(p, d);
      if (Object.keys(want).every((k) => ans(F[k]) === ans(want[k]))) return d;
    }
    return 8;
  }

  // opt.exact: 値がどれも有効数字 3 桁以内でちょうど表せるとき（演習）は、途中の値も丸めずにそのまま書く
  function stepsTrans(p, s, opt) {
    opt = opt || {};
    const D = opt.exact ? 7 : digitsTrans(p, s), F = opt.exact ? s : fwdTrans(p, D);
    const cv = (x) => nice(x, D);
    const rs = (fv, tv) => (opt.exact ? nice(tv, 7) : fres(fv, tv, D));
    const steps = [];
    if (p.mode === 'line') {
      const P = nice(p.P), Vt = nice(p.Vt), rl = nice(p.rl);
      steps.push({
        t: '送電線を流れる電流',
        m: [R`P = VI \;\Rightarrow\; I = \frac{P}{V} = \frac{` + P + R` \times 10^{3}}{` + Vt + R` \times 10^{3}} = ` + rs(F.I, s.I) + un('A')],
        n: R`送る電力 $P$ は、送電電圧 $V$ と送電線を流れる電流 $I$ の積です。$\mathrm{kW}$・$\mathrm{kV}$ は $10^{3}$ 倍して $\mathrm{W}$・$\mathrm{V}$ に直します。`,
        easy: R`同じ量の電気を送るとき、電圧を高くすれば電流は小さくてすみます（電圧 × 電流 ＝ 電力 が同じなら、一方が大きいほど他方は小さい）。たとえば電圧を 10 倍にすれば、電流は $\dfrac{1}{10}$ です。`,
        pro: R`$\mathrm{kW}$ と $\mathrm{kV}$ のまま割れば、答えは $\mathrm{A}$ になります（$\mathrm{kW} \div \mathrm{kV} = \mathrm{A}$）。`
      });
      steps.push({
        t: '送電線で失われる電力（ジュール熱）',
        m: [R`P_{loss} = I^{2}r = ` + pw2(cv(F.I)) + R` \times ` + rl + ' = ' + rs(F.loss, s.loss) + un('W'), R`\Delta V = Ir = ` + cv(F.I) + R` \times ` + rl + ' = ' + (opt.exact ? nice(s.drop, 7) : sig(s.drop)) + un('V')],
        n: R`送電線にも抵抗 $r$ があるので、電流が流れるとジュール熱 $I^{2}r$ が発生して失われます。このとき、送電線の両端では電圧が $\Delta V = Ir$ だけ下がります（電圧降下）。`,
        easy: R`電線にも抵抗があるので、電気を送るあいだに、熱になって捨てられる電力があります。これが送電損失です。電流が大きいほど、電流の「2 乗」に比例して損失が増えます。`,
        pro: R`損失は $I^{2}r$（電流の 2 乗）。送電線の抵抗 $r$ は往復の合計であることに注意します。`
      });
      steps.push({
        t: '送った電力に対する損失の割合',
        m: [R`\frac{P_{loss}}{P} = \frac{` + cv(F.loss) + '}{' + nice(s.Pw, 3) + R`} = ` + sig(s.frac * 100) + R`\,\%`],
        n: R`損失の割合は $\dfrac{I^{2}r}{P}$ です。送り出した電力のうち、家庭に届く電力は $P - P_{loss} = ` + sig(s.deliv) + R`\,\mathrm{W}$ です。`,
        easy: R`送り出した電力のうち、どれくらいが途中で熱になって失われるかを、割合（％）で表します。小さいほど効率よく電気を届けられています。`,
        pro: R`損失 $\propto \dfrac{1}{V^{2}}$ を比で押さえると、電圧の倍率だけで損失の倍率が出せます（電圧を $n$ 倍にすれば損失は $\dfrac{1}{n^{2}}$）。`
      });
      steps.push({
        t: '送電電圧を 10 倍にすると',
        m: [R`I' = \frac{I}{10} = ` + sig(s.I10) + un('A'), R`P_{loss}' = I'^{2}r = \frac{P_{loss}}{10^{2}} = ` + sig(s.loss10) + un('W')],
        n: R`電圧を 10 倍にすると、電流は $\dfrac{1}{10}$ になり、損失は電流の 2 乗に比例するので $\dfrac{1}{100}$ になります。損失は電圧の 2 乗に反比例します。送電に高電圧（$\mathrm{kV}$ ～ $500\,\mathrm{kV}$）を使うのはこのためです。`,
        easy: R`電圧を 10 倍にすると、同じ電力を送るのに電流は 10 分の 1 ですみます。損失は電流の 2 乗に比例するので、$\dfrac{1}{10} \times \dfrac{1}{10} = \dfrac{1}{100}$ に減ります。発電所から家庭までの電気が高い電圧で送られているのは、この損失を減らすためです。`,
        lv: 2
      });
    } else {
      const V1 = nice(p.V1), N1 = nice(p.N1), N2 = nice(p.N2), Rl = nice(p.Rl);
      steps.push({
        t: '変圧器のしくみ',
        n: R`鉄心に 2 つのコイルを巻いた装置が**変圧器**です。1 次コイルに交流電圧をかけると、鉄心の中の磁束が時間変化し、2 次コイルに電磁誘導で起電力が生じます。2 つのコイルを貫く磁束の変化は同じなので、起電力は**巻数に比例**します。`,
        easy: R`1 次コイルに交流を流すと、鉄心の中の磁束が絶えず変化します。磁束が変化すると、2 次コイルに電圧が生まれます（ファラデーの電磁誘導の法則）。このとき、1 回巻きあたりに生まれる電圧はどちらも同じなので、巻数が多い方が大きな電圧になります。直流では磁束が変化しないので、変圧器は使えません。`,
        pro: R`変圧器は交流専用です。理想的な変圧器（損失なし）では、「電圧は巻数に比例」「電流は巻数に反比例」「電力は等しい」の 3 つが成り立ちます。`
      });
      steps.push({
        t: '2 次側の電圧',
        m: [R`\frac{V_{2}}{V_{1}} = \frac{N_{2}}{N_{1}} \;\Rightarrow\; V_{2} = V_{1}\frac{N_{2}}{N_{1}}`, R`V_{2} = ` + V1 + R` \times \frac{` + N2 + '}{' + N1 + '} = ' + rs(F.V2, s.V2) + un('V')],
        n: R`電圧の比は巻数の比に等しくなります。$N_{2} > N_{1}$ なら昇圧（$V_{2} > V_{1}$）、$N_{2} < N_{1}$ なら降圧です。`,
        easy: R`巻数の多い側に、大きな電圧が生まれます。巻数の比が $N_{2} : N_{1} = ` + N2 + ' : ' + N1 + R`$ なら、電圧の比も同じです。`,
        pro: R`$V_{1} : V_{2} = N_{1} : N_{2}$。比の問題として暗算できるようにしておきます。`
      });
      steps.push({
        t: '2 次側の電流と電力',
        m: [R`I_{2} = \frac{V_{2}}{R} = \frac{` + cv(F.V2) + '}{' + Rl + '} = ' + rs(F.I2, s.I2) + un('A'), R`P_{2} = V_{2}I_{2} = ` + cv(F.V2) + R` \times ` + cv(F.I2) + ' = ' + rs(F.P2, s.P2) + un('W')],
        n: R`2 次側は、電圧 $V_{2}$ の電源に抵抗 $R$ をつないだ回路とみなします。オームの法則で電流を求め、電力は $V_{2}I_{2}$ です。`,
        easy: R`2 次コイルは、電圧 $V_{2}$ の電池のようなものです。そこに抵抗 $R$ をつないでいるので、「電圧 ÷ 抵抗 ＝ 電流」、「電圧 × 電流 ＝ 電力」で計算します。`
      });
      steps.push({
        t: '1 次側の電流（エネルギー保存）',
        m: p.eta >= 100 ? [R`V_{1}I_{1} = V_{2}I_{2} \;\Rightarrow\; I_{1} = \frac{V_{2}I_{2}}{V_{1}} = \frac{P_{2}}{V_{1}} = \frac{` + cv(F.P2) + '}{' + V1 + '} = ' + rs(F.I1, s.I1) + un('A'), R`\frac{I_{1}}{I_{2}} = \frac{N_{2}}{N_{1}} = ` + sig(s.ratio)] : [R`P_{2} = η P_{1} \;\Rightarrow\; P_{1} = \frac{P_{2}}{η} = \frac{` + cv(F.P2) + '}{' + nice(p.eta / 100) + '} = ' + rs(F.P1, s.P1) + un('W'), R`I_{1} = \frac{P_{1}}{V_{1}} = \frac{` + cv(F.P1) + '}{' + V1 + '} = ' + rs(F.I1, s.I1) + un('A')],
        n: p.eta >= 100 ? R`理想的な変圧器では電力のロスがないので、1 次側が受け取る電力 $V_{1}I_{1}$ と 2 次側が出す電力 $V_{2}I_{2}$ は等しくなります。電流の比は、巻数の**逆比**（$I_{1} : I_{2} = N_{2} : N_{1}$）です。` : R`変圧器では一部が熱として失われます。効率 $η = ` + nice(p.eta) + R`\,\%$ のとき、2 次側の電力は、1 次側が受け取る電力の $η$ 倍です。`,
        easy: R`変圧器は電気のエネルギーを「受け渡し」しているだけで、エネルギーは増えません。受け取った電力が $V_{1}I_{1}$、渡す電力が $V_{2}I_{2}$ で、これが等しい（損失がない場合）ので、電圧が大きくなる側では、そのぶん電流が小さくなります。`,
        pro: R`電圧は巻数比に比例、電流は巻数比に反比例。効率が与えられたら $η = \dfrac{P_{2}}{P_{1}}$ でつなぎます。`
      });
      steps.push({
        t: 'なぜ電流の比が逆になるのか',
        m: [R`V_{1}I_{1} = V_{2}I_{2},\ \ \frac{V_{2}}{V_{1}} = \frac{N_{2}}{N_{1}} \;\Rightarrow\; \frac{I_{1}}{I_{2}} = \frac{V_{2}}{V_{1}} = \frac{N_{2}}{N_{1}}`],
        n: R`電圧の比が $\dfrac{N_{2}}{N_{1}}$ なのに、電力が等しい（$V_{1}I_{1} = V_{2}I_{2}$）ので、電流の比は逆の $\dfrac{I_{1}}{I_{2}} = \dfrac{V_{2}}{V_{1}} = \dfrac{N_{2}}{N_{1}}$ になります。電圧が高くなる側は、電流が小さくなります。`,
        easy: R`変圧器の中を通る「電力＝電圧×電流」は変わりません。電圧を 10 倍に上げたら、電流は $\dfrac{1}{10}$ にしないと電力のつじつまが合いません。送電で高電圧が使われる理由とつながります。`,
        lv: 3
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-transformer',
    field: '電磁気',
    unit: 'p-ac',
    title: '変圧器と送電',
    desc: '変圧器の巻数比から 2 次側の電圧・電流・電力と 1 次側の電流を求めます（効率の入力も可能）。また、高電圧で送電すると送電線の損失が小さくなることを、電流・損失・損失の割合で確かめます。',
    form: [R`\frac{V_{2}}{V_{1}} = \frac{N_{2}}{N_{1}},\quad V_{1}I_{1} = V_{2}I_{2}`, R`P = VI,\quad P_{loss} = I^{2}r`],
    inputs: [
      { key: 'mode', label: '調べる場面', type: 'select', def: 'ideal', options: [['ideal', '変圧器（巻数比・電圧・電流）'], ['line', '送電（電流と送電損失）']] },
      { key: 'V1', label: '1 次側の電圧 $V_{1}$', unit: 'V', type: 'num', def: '100', min: 0.001, max: 1000000, show: (raw) => raw.mode !== 'line' },
      { key: 'N1', label: '1 次コイルの巻数 $N_{1}$', unit: '回', type: 'int', def: '200', min: 1, max: 1000000, show: (raw) => raw.mode !== 'line' },
      { key: 'N2', label: '2 次コイルの巻数 $N_{2}$', unit: '回', type: 'int', def: '1000', min: 1, max: 1000000, show: (raw) => raw.mode !== 'line' },
      { key: 'Rl', label: '2 次側につないだ抵抗 $R$', unit: 'Ω', type: 'num', def: '50', min: 0.001, max: 1000000, show: (raw) => raw.mode !== 'line' },
      { key: 'eta', label: '変圧器の効率 $η$', unit: '%', type: 'num', def: '100', min: 1, max: 100, hint: '損失がない理想的な変圧器は 100', show: (raw) => raw.mode !== 'line' },
      { key: 'P', label: '送る電力 $P$', unit: 'kW', type: 'num', def: '100', min: 0.001, max: 10000000, show: (raw) => raw.mode === 'line' },
      { key: 'Vt', label: '送電電圧 $V$', unit: 'kV', type: 'num', def: '2.0', min: 0.001, max: 1000, show: (raw) => raw.mode === 'line' },
      { key: 'rl', label: '送電線の抵抗（往復の合計）$r$', unit: 'Ω', type: 'num', def: '5.0', min: 0.001, max: 100000, show: (raw) => raw.mode === 'line' }
    ],
    examples: [
      { label: '昇圧（100 V → 500 V）', v: { mode: 'ideal', V1: '100', N1: '200', N2: '1000', Rl: '50', eta: '100' } },
      { label: '降圧（効率 95 %）', v: { mode: 'ideal', V1: '6000', N1: '3000', N2: '100', Rl: '2.0', eta: '95' } },
      { label: '送電（100 kW を 2.0 kV で）', v: { mode: 'line', P: '100', Vt: '2.0', rl: '5.0' } },
      { label: '送電（同じ電力を 20 kV で）', v: { mode: 'line', P: '100', Vt: '20', rl: '5.0' } }
    ],
    intro: {
      easy: R`**変圧器**は、鉄心に 2 つのコイルを巻いて、交流の電圧を上げたり下げたりする装置です。1 次コイルでつくった磁束の変化が 2 次コイルに電圧を生むので、**電圧は巻数に比例**します。エネルギーは増えないので、電圧が上がる側では電流が小さくなります。この性質を使い、発電所から家庭までは、電圧を上げて（電流を小さくして）送電することで、電線で熱になって失われる電力を小さくしています。`,
      normal: R`$\dfrac{V_{2}}{V_{1}} = \dfrac{N_{2}}{N_{1}}$、理想的な変圧器では $V_{1}I_{1} = V_{2}I_{2}$（$\dfrac{I_{1}}{I_{2}} = \dfrac{N_{2}}{N_{1}}$）。送電では $I = \dfrac{P}{V}$、損失 $I^{2}r$ は電圧の 2 乗に反比例します。`,
      pro: R`電圧は巻数比に比例、電流は巻数比に反比例。効率 $η$ が与えられたら $P_{2} = η P_{1}$。送電の問題では、送電線の抵抗は往復の合計であること、損失の割合 $= \dfrac{I^{2}r}{P}$、電圧を $n$ 倍にすれば損失は $\dfrac{1}{n^{2}}$ になることを押さえます。`
    },
    compute(v) {
      if (v.mode === 'line') {
        const p = { mode: 'line', P: v.P, Vt: v.Vt, rl: v.rl };
        const s = solveTrans(p);
        if (![s.I, s.loss, s.frac].every(isFinite)) throw new JK.CalcError('値が大きすぎて計算できません。');
        if (s.loss >= s.Pw) throw new JK.CalcError('送電線で失われる電力が、送る電力以上になってしまいます（損失 ' + s.loss.toPrecision(3) + ' W）。送電電圧を高くするか、送電線の抵抗を小さくしてください。');
        return {
          result: [
            { label: '送電線を流れる電流 I', tex: sig(s.I) + un('A') },
            { label: '送電線の電圧降下 ΔV = Ir', tex: sig(s.drop) + un('V') },
            { label: '送電線での損失 P_loss = I²r', tex: sig(s.loss) + un('W') },
            { label: '損失の割合 P_loss / P', tex: sig(s.frac * 100) + R`\,\%` },
            { label: '送電電圧を 10 倍にしたときの損失', tex: sig(s.loss10) + un('W') }
          ],
          steps: stepsTrans(p, s),
          fig: figLine(p, s)
        };
      }
      const p = { mode: 'ideal', V1: v.V1, N1: v.N1, N2: v.N2, Rl: v.Rl, eta: v.eta };
      const s = solveTrans(p);
      if (![s.V2, s.I2, s.P2, s.P1, s.I1].every(isFinite)) throw new JK.CalcError('値が大きすぎて計算できません。');
      return {
        result: [
          { label: '2 次側の電圧 V₂', tex: sig(s.V2) + un('V') + R`\ \ (` + (s.ratio > 1 ? R`\text{昇圧}` : (s.ratio < 1 ? R`\text{降圧}` : R`\text{同じ}`)) + R`)` },
          { label: '2 次側の電流 I₂', tex: sig(s.I2) + un('A') },
          { label: '2 次側の電力 P₂', tex: sig(s.P2) + un('W') },
          { label: '1 次側の電流 I₁', tex: sig(s.I1) + un('A') },
          { label: '1 次側が受け取る電力 P₁', tex: sig(s.P1) + un('W') + (v.eta < 100 ? R`\ \ (\text{損失 } ` + sig(s.P1 - s.P2) + R`\,\mathrm{W})` : '') }
        ],
        steps: stepsTrans(p, s),
        fig: figTrans(p, s)
      };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        let P, Vt, rl, s;
        for (let k = 0; k < 300; k++) {
          P = rng.pick([50, 100, 200, 500]); Vt = rng.pick([2.0, 4.0, 5.0, 10, 20, 25]); rl = rng.pick([2.0, 4.0, 5.0, 10]);
          s = solveTrans({ mode: 'line', P: P, Vt: Vt, rl: rl });
          if (ok3(s.I) && s.frac > 0.002 && s.frac < 0.15 && ok3(s.loss)) break;
        }
        const p = { mode: 'line', P: P, Vt: Vt, rl: rl };
        return {
          title: '高電圧送電と送電損失',
          body: R`発電所から、電力 $` + sf(P) + R`\,\mathrm{kW}$ を、電圧 $` + sf(Vt) + R`\,\mathrm{kV}$ に昇圧して送電する。送電線の抵抗は（往復あわせて）$` + sf(rl) + R`\,\mathrm{\Omega}$ である。送電線以外での損失は無視できるものとして、次の問いに答えよ。`,
          fig: figLine(p, null),
          parts: [
            numPart('(1)', R`送電線を流れる電流 $I$`, s.I, 'A'),
            numPart('(2)', R`送電線で 1 秒間に失われる電力（損失）$P_{loss}$`, s.loss, 'W'),
            numPart('(3)', R`送る電力に対する損失の割合`, s.frac * 100, '%')
          ],
          solution: stepsTrans(p, s, { exact: true }).slice(0, 3)
        };
      }
      // basic / mid: 理想的な変圧器
      let V1, N1, N2, Rl, s, p;
      for (let k = 0; k < 300; k++) {
        V1 = rng.pick([6, 20, 100, 200]); N1 = rng.pick([100, 200, 400, 500, 1000]); N2 = rng.pick([50, 100, 200, 500, 1000, 2000, 4000]); Rl = rng.pick([5, 10, 20, 50, 100]);
        p = { mode: 'ideal', V1: V1, N1: N1, N2: N2, Rl: Rl, eta: 100 };
        s = solveTrans(p);
        if (N1 !== N2 && ok3(s.V2) && ok3(s.I2) && ok3(s.I1)) break;
      }
      const parts = [numPart('(1)', R`2 次コイルに生じる電圧 $V_{2}$`, s.V2, 'V')];
      if (level === 'basic') {
        parts.push(numPart('(2)', R`2 次側の抵抗を流れる電流 $I_{2}$`, s.I2, 'A'));
      } else {
        parts.push(numPart('(2)', R`2 次側の抵抗を流れる電流 $I_{2}$`, s.I2, 'A'));
        parts.push(numPart('(3)', R`1 次コイルを流れる電流 $I_{1}$`, s.I1, 'A'));
      }
      return {
        title: s.ratio > 1 ? '昇圧変圧器' : '降圧変圧器',
        body: R`1 次コイルの巻数 $` + N1 + R`$、2 次コイルの巻数 $` + N2 + R`$ の変圧器がある。1 次コイルに実効値 $` + sf(V1) + R`\,\mathrm{V}$ の交流電圧を加え、2 次コイルに抵抗値 $` + sf(Rl) + R`\,\mathrm{\Omega}$ の抵抗をつないだ。変圧器は理想的で、エネルギーの損失はないものとして、次の問いに答えよ。`,
        fig: figTrans(p, null),
        parts: parts,
        solution: stepsTrans(p, s, { exact: true }).slice(0, level === 'basic' ? 3 : 4)
      };
    }
  });
})();
