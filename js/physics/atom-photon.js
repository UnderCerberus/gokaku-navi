/* 物理・原子 — 光の粒子性: 光子のエネルギー / 光電効果 / 物質波と X 線の最短波長
   構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  // 有効数字 3 桁の丸め。ちょうど半分（9.945 → 9.95）は、倍精度の誤差で 9.94 になることがあるので、わずかに増して必ず切り上げる
  const UP = 1 + 1e-12;
  const sig = (x) => U.sig(x * UP, 3);
  const un = (s) => R`\,\mathrm{` + s + '}';
  // 答え（numPart）も sig と同じ丸め方で 3 桁にする。解説の最終行の値と、丸めの境目でも 1 桁もずれない
  const ans = (x) => {
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return x;
    const y = x * UP;
    let e = Math.floor(Math.log10(Math.abs(y))), m = Number((y / Math.pow(10, e)).toFixed(2));
    if (Math.abs(m) >= 10) { m /= 10; e += 1; }
    return Number(m + 'e' + e);
  };
  const H = 6.63e-34;      // プランク定数 [J·s]
  const C = 3.00e8;        // 光速 [m/s]
  const QE = 1.60e-19;     // 電気素量 [C]（1 eV = 1.60×10⁻¹⁹ J）
  const ME = 9.11e-31;     // 電子の質量 [kg]
  const MP = 1.67e-27;     // 陽子の質量 [kg]
  const MN = 1.67e-27;     // 中性子の質量 [kg]
  const CONST_TXT = R`プランク定数を $h = 6.63 \times 10^{-34}\,\mathrm{J \cdot s}$、真空中の光速を $c = 3.00 \times 10^{8}\,\mathrm{m/s}$、電気素量を $e = 1.60 \times 10^{-19}\,\mathrm{C}$（$1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}$）とする。`;

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
  // 2 乗の表示。指数表記（2.5 \times 10^{-3}）の値は括弧でくくる
  const pw2 = (s) => (s.indexOf('times') < 0 ? s + '^{2}' : R`\left(` + s + R`\right)^{2}`);
  // 前進計算（生徒が途中の値を d 桁に丸めながら順に電卓で計算した値）の表示。
  // fv: d 桁の値、tv: 答え（丸める前の値）。d > 3 で 3 桁と違うときは「d 桁の値 ≒ 3 桁の値」と書く
  function fres(fv, tv, d) {
    return d > 3 && U.roundSig(fv, d) !== ans(tv) ? nice(fv, d) + R` \fallingdotseq ` + sig(tv) : sig(tv);
  }
  // fwd(d) が返す値の 3 桁表示が、答え want と全部合う最小の桁数 d（3〜7）
  function digitsOf(fwd, want) {
    for (let d = 3; d < 8; d++) {
      const F = fwd(d);
      if (Object.keys(want).every((k) => ans(F[k]) === ans(want[k]))) return d;
    }
    return 8;
  }
  const rd = (x, d) => U.roundSig(x, d);
  // 問題文に書く定数の文（使う定数だけ）。keys: 'h' 'c' 'e'
  const CONST_PARTS = {
    h: R`プランク定数を $h = 6.63 \times 10^{-34}\,\mathrm{J \cdot s}$`,
    c: R`真空中の光速を $c = 3.00 \times 10^{8}\,\mathrm{m/s}$`,
    e: R`電気素量を $e = 1.60 \times 10^{-19}\,\mathrm{C}$（$1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}$）`
  };
  const consts = (keys) => keys.map((k) => CONST_PARTS[k]).join('、') + (keys[keys.length - 1] === 'e' ? 'とする。' : ' とする。');
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
  // 電磁波の種類（波長 nm から）
  function bandOf(lamNm) {
    if (lamNm < 0.01) return 'γ線';
    if (lamNm < 10) return 'X線';
    if (lamNm < 400) return '紫外線';
    if (lamNm < 760) {
      const col = lamNm < 435 ? '紫' : (lamNm < 490 ? '青' : (lamNm < 560 ? '緑' : (lamNm < 590 ? '黄' : (lamNm < 620 ? '橙' : '赤'))));
      return '可視光（' + col + '）';
    }
    if (lamNm < 1e6) return '赤外線';
    if (lamNm < 1e9) return 'マイクロ波';
    return '電波';
  }

  /* =====================================================================
     1. 光子のエネルギーと運動量
     ===================================================================== */

  // 対数目盛の電磁波スペクトルと、波長の位置
  function figSpectrum(lamM, p) {
    const d = JK.plot.draw(380, 190);
    const x0 = 20, x1 = 360, lo = -12, hi = 1;
    const X = (lg) => x0 + (lg - lo) / (hi - lo) * (x1 - x0);
    const bands = [['γ線', -12, -11, 'f4'], ['X線', -11, -8, 'f2'], ['紫外線', -8, -6.398, 'f1'], ['可視光', -6.398, -6.119, 'f3'], ['赤外線', -6.119, -3, 'f4'], ['マイクロ波', -3, 0, 'f2'], ['電波', 0, 1, 'f1']];
    bands.forEach((b, i) => {
      d.rect(X(b[1]), 78, X(b[2]) - X(b[1]), 26, { cls: 'fg', fill: b[3], w: 1 });
      d.text((X(b[1]) + X(b[2])) / 2, 120 + (i % 2) * 15, b[0], { size: 11 });
    });
    [[-12, '1 pm'], [-9, '1 nm'], [-6, '1 μm'], [-3, '1 mm'], [0, '1 m']].forEach((t) => {
      d.line(X(t[0]), 104, X(t[0]), 110, { cls: 'dim', w: 1 });
      d.text(X(t[0]), 160, t[1], { size: 10, cls: 'dim' });
      d.line(X(t[0]), 110, X(t[0]), 150, { cls: 'dim', w: 0.6, dash: true });
    });
    const lg = Math.max(lo + 0.05, Math.min(hi - 0.05, Math.log10(lamM)));
    const xm = X(lg);
    d.poly([[xm - 6, 56], [xm + 6, 56], [xm, 76]], { cls: 'c3', fill: 'f3' });
    const tcx = Math.max(70, Math.min(310, xm));
    d.text(tcx, 40, 'λ = ' + (lamM * 1e9 >= 1e4 || lamM * 1e9 < 0.01 ? tx3(lamM) + ' m' : tx3(lamM * 1e9) + ' nm') + '（' + bandOf(lamM * 1e9) + '）', { size: 11 });
    if (lamM < 1e-12 || lamM > 10) d.text(tcx, 28, '※ 図の範囲（1 pm 〜 10 m）の外', { size: 10, cls: 'dim' });
    d.text(190, 182, '波長が短いほど、光子 1 個のエネルギー E = hc/λ は大きい', { cls: 'dim', size: 11 });
    return d.svg();
  }

  // 波長を nm から m に直す段（演習用）
  function lamStep(lam) {
    return {
      t: '波長を m に直す',
      m: [R`\lambda = ` + nice(lam) + R`\,\mathrm{nm} = ` + nice(lam) + R` \times 10^{-9} = ` + nice(lam * 1e-9) + un('m')],
      n: R`$1\,\mathrm{nm} = 10^{-9}\,\mathrm{m}$ なので、$\mathrm{nm}$ の値に $10^{-9}$ を掛けて $\mathrm{m}$ に直します。`,
      easy: R`$\mathrm{nm}$（ナノメートル）は $10^{-9}\,\mathrm{m}$ の長さの単位です。公式に入れるときは、$\mathrm{m}$ に直しておきます。`
    };
  }
  // 光子の計算の前進計算（生徒が途中の値を d 桁に丸めながら順に電卓で計算した値）。
  // a: { given: 'lam' | 'nu' | 'E', lam [m], nu [Hz], E [J], P [mW] }（与える量に合わせて、求める向きを変える）
  function fwdPh(a, d) {
    const r = (x) => rd(x, d);
    let lam, nu, E;
    if (a.given === 'nu') { nu = a.nu; lam = r(C / nu); E = r(H * nu); }
    else if (a.given === 'E') { E = r(a.E); nu = r(E / H); lam = r(C / nu); }
    else { lam = a.lam; nu = r(C / lam); E = r(H * C / lam); }
    return { lam: lam, nu: nu, E: E, EeV: E / QE, p: H / lam, N: a.P * 1e-3 / E };
  }
  // 解説に出す途中の値の桁数（a.want: 解説に答えとして出す量だけを合わせる。省略すると全部）
  function digitsPh(a, s) {
    const want = { lam: s.lam, nu: s.nu, E: s.E, EeV: s.EeV, p: s.p, N: s.N };
    if (a.want) Object.keys(want).forEach((k) => { if (a.want.indexOf(k) < 0) delete want[k]; });
    return digitsOf((d) => fwdPh(a, d), want);
  }

  function stepsPhoton(a, s) {
    const lamNm = s.lam * 1e9;
    const D = digitsPh(a, s), F = fwdPh(a, D), cv = (x) => nice(x, D);
    const lamS = a.given === 'lam' ? nice(a.lam) : cv(F.lam);          // 続く式で使う波長 [m]
    const steps = [];
    steps.push({
      t: '光は「粒子」でもある（光子）',
      n: R`光は波の性質（干渉・回折）のほかに、**エネルギーのかたまり（光子）**としての性質ももっています。振動数 $\nu$ の光の光子 1 個のエネルギーは $E = h\nu$ です。$h$ は**プランク定数**（$6.63 \times 10^{-34}\,\mathrm{J \cdot s}$）です。`,
      easy: R`光は、「波」としてだけでなく、「小さな玉（光子）」の流れとしても考えられます。光の色（振動数）によって、玉 1 個がもつエネルギーが決まっていて、**振動数が大きい光（青や紫外線）ほど 1 個のエネルギーが大きく、小さい光（赤や赤外線）ほど小さい**です。光を強くする（明るくする）のは、玉の数を増やすことです。`,
      pro: R`光子 1 個のエネルギーは振動数だけで決まり、光の強さには関係しません。強さは「光子の数」で決まります。`
    });
    steps.push({
      t: '波長と振動数の関係',
      m: a.given === 'nu'
        ? [R`c = \nu\lambda \;\Rightarrow\; \lambda = \frac{c}{\nu}`, R`\lambda = \frac{3.00 \times 10^{8}}{` + nice(a.nu) + '} = ' + fres(F.lam, s.lam, D) + un('m') + R` = ` + sig(lamNm) + un('nm')]
        : (a.given === 'E'
          ? [R`E = ` + nice(a.Ee) + R`\,\mathrm{eV} = ` + nice(a.Ee) + R` \times 1.60 \times 10^{-19} = ` + cv(F.E) + un('J'), R`E = h\nu \;\Rightarrow\; \nu = \frac{E}{h} = \frac{` + cv(F.E) + R`}{6.63 \times 10^{-34}} = ` + fres(F.nu, s.nu, D) + un('Hz'), R`c = \nu\lambda \;\Rightarrow\; \lambda = \frac{c}{\nu} = \frac{3.00 \times 10^{8}}{` + cv(F.nu) + '} = ' + fres(F.lam, s.lam, D) + un('m') + R` = ` + sig(lamNm) + un('nm')]
          : [R`c = \nu\lambda \;\Rightarrow\; \nu = \frac{c}{\lambda}`, R`\lambda = ` + nice(a.lamNm) + R`\,\mathrm{nm} = ` + nice(a.lamNm) + R` \times 10^{-9} = ` + nice(a.lam) + un('m'), R`\nu = \frac{3.00 \times 10^{8}}{` + nice(a.lam) + '} = ' + sig(s.nu) + un('Hz')]),
      n: a.given === 'nu'
        ? R`光（電磁波）は、真空中ではどんな色でも速さ $c = 3.00 \times 10^{8}\,\mathrm{m/s}$ で進み、速さ ＝ 振動数 × 波長 の関係 $c = \nu\lambda$ が成り立ちます。振動数から波長を求めます。`
        : (a.given === 'E'
          ? R`光子のエネルギー $E$ は $\mathrm{eV}$ で与えられているので、まず $\mathrm{J}$ に直します（$1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}$ を掛けます）。$E = h\nu$ から振動数 $\nu$ を求め、$c = \nu\lambda$ から波長 $\lambda$ を求めます。`
          : R`光（電磁波）は、真空中ではどんな色でも速さ $c = 3.00 \times 10^{8}\,\mathrm{m/s}$ で進み、速さ ＝ 振動数 × 波長 の関係 $c = \nu\lambda$ が成り立ちます。波長 $\lambda$ は $\mathrm{m}$ に直します（$1\,\mathrm{nm} = 10^{-9}\,\mathrm{m}$）。`),
      easy: R`波の速さは「振動数 × 波長」です。光の速さはいつも同じなので、波長が短いほど、1 秒間に通りすぎる波の数（振動数）は多くなります。`,
      lv: 2
    });
    steps.push({
      t: '光子 1 個のエネルギー',
      m: a.given === 'nu'
        ? [R`E = h\nu`, R`E = 6.63 \times 10^{-34} \times ` + nice(a.nu) + ' = ' + fres(F.E, s.E, D) + un('J')]
        : (a.given === 'E'
          ? [R`E = h\nu = \frac{hc}{\lambda}`, R`E = ` + cv(F.E) + un('J') + R`\quad\text{（上で求めた値）}`]
          : [R`E = h\nu = \frac{hc}{\lambda}`, R`E = \frac{6.63 \times 10^{-34} \times 3.00 \times 10^{8}}{` + nice(a.lam) + '} = ' + fres(F.E, s.E, D) + un('J')]),
      n: R`光子 1 個のエネルギーは $E = h\nu = \dfrac{hc}{\lambda}$ です。波長が短いほど大きくなります。`,
      easy: R`光子 1 個のエネルギーは、「プランク定数 × 振動数」です。波長で表すと $E = \dfrac{hc}{\lambda}$（$hc$ は定数）なので、**波長が 2 倍になるとエネルギーは半分**です。`,
      pro: R`$hc = 1.99 \times 10^{-25}\,\mathrm{J \cdot m}$ と覚えておくと、波長を入れるだけで $E$ が出ます。`
    });
    steps.push({
      t: 'J と eV の変換',
      m: [R`1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}`, R`E = \frac{` + cv(F.E) + R`}{1.60 \times 10^{-19}} = ` + sig(s.EeV) + un('eV')],
      n: R`原子・光子のエネルギーは小さいので、$\mathrm{eV}$（電子ボルト）という単位を使います。$1\,\mathrm{eV}$ は、電子が $1\,\mathrm{V}$ の電圧で加速されて得るエネルギーです。$\mathrm{J}$ を $\mathrm{eV}$ に直すときは $1.60 \times 10^{-19}$ で割ります。`,
      easy: R`1 J は原子の世界ではとても大きなエネルギーなので、原子サイズ用の単位 $\mathrm{eV}$ を使います。$1\,\mathrm{eV} = 0.000000000000000000160\,\mathrm{J}$ という小さなエネルギーです。$\mathrm{J}$ から $\mathrm{eV}$ には、$1.60 \times 10^{-19}$ で割って直します。`,
      pro: R`$E[\mathrm{eV}] \fallingdotseq \dfrac{1240}{\lambda[\mathrm{nm}]}$ は暗算に便利です（今回: $\dfrac{1240}{` + nice(lamNm) + R`} = ` + sig(1240 / lamNm) + R`\,\mathrm{eV}$）。概算なので、問題で与えられた定数で計算した値とは、最後の桁が合わないことがあります。`
    });
    steps.push({
      t: '光子の運動量',
      m: [R`p = \frac{h}{\lambda} = \frac{E}{c}`, R`p = \frac{6.63 \times 10^{-34}}{` + lamS + '} = ' + sig(s.p) + un(R`kg \cdot m/s`)],
      n: R`光子には質量がありませんが、運動量 $p = \dfrac{h}{\lambda}$ をもちます。物体に光を当てると、この運動量を受け渡すので、光は物体を押す力（光圧）をおよぼします。`,
      easy: R`光は、質量がなくても「押す力」をもちます。宇宙船が太陽の光を帆で受けて進む「ソーラーセイル」はこの力を利用しています。1 個の光子の運動量は、波長が短いほど大きくなります。`,
      lv: 2
    });
    steps.push({
      t: '毎秒に出る光子の数',
      m: [R`P = N \times E \;\Rightarrow\; N = \frac{P}{E}`, R`P = ` + nice(a.P) + R`\,\mathrm{mW} = ` + nice(a.P) + R` \times 10^{-3}\,\mathrm{W}`, R`N = \frac{` + nice(a.P) + R` \times 10^{-3}}{` + cv(F.E) + '} = ' + sig(s.N) + un('s^{-1}')],
      n: R`光の出力（毎秒のエネルギー）$P$ は、毎秒の光子の数 $N$ と光子 1 個のエネルギー $E$ の積です。出力は $\mathrm{mW}$ で与えられているので、$10^{-3}$ を掛けて $\mathrm{W}$ に直します。`,
      easy: R`光源から 1 秒間に出る光のエネルギーが $P$、光子 1 個のエネルギーが $E$ なので、割り算すれば 1 秒間に出ている光子の個数が分かります。身近な光でも、光子の数は想像できないほど多い（$10^{15}$ 個/秒など）ことが分かります。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'atom-photon-energy',
    field: '原子',
    unit: 'p-photon',
    title: '光子のエネルギーと運動量',
    desc: '光の波長・振動数・エネルギーのどれか 1 つから、光子 1 個のエネルギー $E = h\\nu = \\dfrac{hc}{\\lambda}$（J と eV）、運動量 $p = \\dfrac{h}{\\lambda}$、電磁波の種類、毎秒の光子数を求めます。',
    form: [R`c = \nu\lambda`, R`E = h\nu = \frac{hc}{\lambda}`, R`p = \frac{h}{\lambda} = \frac{E}{c}`, R`P = NE`],
    inputs: [
      { key: 'given', label: '与える量', type: 'select', def: 'lam', options: [['lam', '波長 λ'], ['nu', '振動数 ν'], ['E', '光子のエネルギー E（eV）']] },
      { key: 'lam', label: '波長 $\\lambda$', unit: 'nm', type: 'num', def: '500', min: 0.001, max: 1000000000, show: (raw) => raw.given === 'lam' || raw.given == null },
      { key: 'nu', label: '振動数 $\\nu$', unit: '×10¹⁴ Hz', type: 'num', def: '6.0', min: 0.0000001, max: 10000000, hint: '6.0 と入力すると $6.0 \\times 10^{14}\\,\\mathrm{Hz}$', show: (raw) => raw.given === 'nu' },
      { key: 'Ee', label: '光子のエネルギー $E$', unit: 'eV', type: 'num', def: '2.5', min: 0.000001, max: 1000000000, show: (raw) => raw.given === 'E' },
      { key: 'P', label: '光源の出力 $P$', unit: 'mW', type: 'num', def: '1.0', min: 0, max: 1000000000, hint: '毎秒の光子数を求めるときに使います（レーザーポインターは約 1 mW）' }
    ],
    examples: [
      { label: '緑色の光（500 nm）', v: { given: 'lam', lam: '500', P: '1.0' } },
      { label: '紫外線（波長 200 nm）', v: { given: 'lam', lam: '200', P: '10' } },
      { label: '振動数で与える（4.0×10¹⁴ Hz）', v: { given: 'nu', nu: '4.0', P: '1.0' } },
      { label: 'X 線（エネルギー 10 keV）', v: { given: 'E', Ee: '10000', P: '100' } }
    ],
    intro: {
      easy: R`光は波であると同時に、**エネルギーのかたまり（光子）の流れ**でもあります。光子 1 個のエネルギーは、光の振動数だけで決まり、$E = h\nu$（$h$ はプランク定数）です。波長が短い光（紫外線・X 線）の光子は大きなエネルギーをもち、波長が長い光（赤外線・電波）の光子は小さなエネルギーしかもちません。光が明るい（強い）というのは、光子の数が多いということです。`,
      normal: R`$c = \nu\lambda$、$E = h\nu = \dfrac{hc}{\lambda}$、運動量 $p = \dfrac{h}{\lambda} = \dfrac{E}{c}$。出力 $P$ の光源から毎秒出る光子の数は $N = \dfrac{P}{E}$。$1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}$。`,
      pro: R`$E[\mathrm{eV}] \fallingdotseq \dfrac{1240}{\lambda[\mathrm{nm}]}$ で一発。光子の数・運動量は「$P = NE$」「完全に吸収する面に及ぼす力は $F = \dfrac{P}{c}$（反射なら 2 倍）」と結びつけて出題されます。`
    },
    compute(v) {
      const given = v.given === 'nu' ? 'nu' : (v.given === 'E' ? 'E' : 'lam');
      let lam, nu, E;
      if (given === 'nu') { nu = v.nu * 1e14; lam = C / nu; E = H * nu; }
      else if (given === 'E') { E = v.Ee * QE; nu = E / H; lam = C / nu; }
      else { lam = v.lam * 1e-9; nu = C / lam; E = H * C / lam; }
      const s = { lam: lam, nu: nu, E: E, EeV: E / QE, p: H / lam, N: v.P * 1e-3 / E };
      if (![lam, nu, E, s.p, s.N].every(isFinite) || !(lam > 0)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
      const p = { given: given, lam: lam, lamNm: v.lam, nu: nu, E: E, Ee: v.Ee, P: v.P };
      return {
        result: [
          { label: '波長 λ', tex: sig(lam * 1e9) + un('nm') + (lam >= 1e-3 || lam < 1e-12 ? R`\ \ (= ` + sig(lam) + R`\,\mathrm{m})` : '') },
          { label: '振動数 ν', tex: sig(nu) + un('Hz') },
          { label: '光子 1 個のエネルギー E', tex: sig(E) + un('J') + R`\ \ (= ` + sig(s.EeV) + R`\,\mathrm{eV})` },
          { label: '光子の運動量 p', tex: sig(s.p) + un(R`kg \cdot m/s`) },
          { label: '電磁波の種類', tex: R`\text{` + bandOf(lam * 1e9) + R`}` },
          { label: '毎秒の光子数 N（出力 ' + v.P + ' mW のとき）', tex: sig(s.N) + un('s^{-1}') }
        ],
        steps: stepsPhoton(p, s),
        fig: figSpectrum(lam, p)
      };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // レーザー光: 光子のエネルギー・毎秒の光子数・完全吸収面が受ける力
        let lam, P;
        for (let k = 0; k < 200; k++) {
          lam = rng.pick([400, 500, 600, 660, 800, 1000]); P = rng.pick([1.0, 2.0, 5.0, 10, 20, 50]);
          if (ok3(P * 1e-3)) break;
        }
        const E = H * C / (lam * 1e-9), N = P * 1e-3 / E, F = P * 1e-3 / C;
        const s = { lam: lam * 1e-9, nu: C / (lam * 1e-9), E: E, EeV: E / QE, p: H / (lam * 1e-9), N: N };
        const a = { given: 'lam', lam: lam * 1e-9, lamNm: lam, P: P, want: ['E', 'N'] };
        const st = stepsPhoton(a, s);
        const sol = [lamStep(lam), st[2], st[4], Object.assign({}, st[5], { lv: 1, t: '毎秒に当たる光子の数' })];       // p（st[4]）は問われていないので lv 2 のまま
        sol.push({
          t: '光が完全に吸収されるときに板が受ける力',
          m: [R`F = Np = \frac{P}{E} \times \frac{E}{c} = \frac{P}{c} = \frac{` + nice(P) + R` \times 10^{-3}}{3.00 \times 10^{8}} = ` + sig(F) + un('N')],
          n: R`1 個の光子が吸収されると、運動量 $p$ が板に渡されます。1 秒間に $N$ 個の光子が吸収されるので、板が受ける力（1 秒間あたりの運動量の変化）は $F = Np$ です。$N = \dfrac{P}{E}$、$p = \dfrac{E}{c}$ を使うと $F = \dfrac{P}{c}$ と、波長によらない形になります。`,
          easy: R`力は「1 秒間に受けとる運動量の合計」です。光子が 1 個あたり運動量 $p$ をもち、1 秒間に $N$ 個吸収されるので、受けとる運動量は $Np$ です。計算すると、波長に関係なく「出力 ÷ 光速」で求まることが分かります。光が板を押す力はとても小さいですが、確かに存在します。`,
          pro: R`完全反射なら運動量の変化が 2 倍になるので $F = \dfrac{2P}{c}$。`
        });
        return {
          title: 'レーザー光の光子と光が及ぼす力',
          body: R`波長 $` + sf(lam) + R`\,\mathrm{nm}$、出力 $` + sf(P) + R`\,\mathrm{mW}$ のレーザー光を、光をすべて吸収する黒い板に垂直に当てた。` + consts(['h', 'c']) + R`次の問いに答えよ。`,
          fig: figSpectrum(lam * 1e-9, { P: P }),
          parts: [
            numPart('(1)', R`光子 1 個のエネルギー $E$`, E, 'J'),
            numPart('(2)', R`1 秒間に板に当たる光子の数 $N$`, N, '個/s'),
            numPart('(3)', R`光が板におよぼす力の大きさ $F$`, F, 'N')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        let lam, P;
        for (let k = 0; k < 200; k++) {
          lam = rng.pick([300, 400, 450, 500, 600, 650, 700]); P = rng.pick([1.0, 2.0, 5.0, 10]);
          if (ok3(P * 1e-3)) break;
        }
        const E = H * C / (lam * 1e-9), N = P * 1e-3 / E, pp = H / (lam * 1e-9);
        const s = { lam: lam * 1e-9, nu: C / (lam * 1e-9), E: E, EeV: E / QE, p: pp, N: N };
        const a = { given: 'lam', lam: lam * 1e-9, lamNm: lam, P: P, want: ['E', 'p', 'N'] };
        const st = stepsPhoton(a, s);
        return {
          title: 'レーザーポインターの光子',
          body: R`波長 $` + sf(lam) + R`\,\mathrm{nm}$、出力 $` + sf(P) + R`\,\mathrm{mW}$ の光を出すレーザーポインターがある。` + consts(['h', 'c']) + R`次の問いに答えよ。`,
          fig: figSpectrum(lam * 1e-9, { P: P }),
          parts: [
            numPart('(1)', R`光子 1 個のエネルギー $E$`, E, 'J'),
            numPart('(2)', R`光子 1 個の運動量の大きさ $p$`, pp, 'kg·m/s'),
            numPart('(3)', R`このレーザーポインターから 1 秒間に出る光子の数 $N$`, N, '個/s')
          ],
          solution: [st[0], lamStep(lam), st[2], Object.assign({}, st[4], { lv: 1 }), Object.assign({}, st[5], { lv: 1 })]
        };
      }
      // basic: 波長から振動数・エネルギー（J と eV）。波長は紫外線〜可視光（200〜750 nm）
      const lam = rng.pick([200, 220, 250, 280, 300, 320, 350, 380, 400, 420, 450, 480, 500, 520, 550, 580, 600, 620, 650, 680, 700, 750]);
      const nu = C / (lam * 1e-9), E = H * nu;
      const s = { lam: lam * 1e-9, nu: nu, E: E, EeV: E / QE, p: H / (lam * 1e-9), N: 0 };
      const a = { given: 'lam', lam: lam * 1e-9, lamNm: lam, P: 1, want: ['nu', 'E', 'EeV'] };
      const st = stepsPhoton(a, s);
      return {
        title: '光子のエネルギー',
        body: R`波長 $` + sf(lam) + R`\,\mathrm{nm}$ の光について、` + CONST_TXT + R`次の問いに答えよ。`,
        fig: figSpectrum(lam * 1e-9, { P: 1 }),
        parts: [
          numPart('(1)', R`この光の振動数 $\nu$`, nu, 'Hz'),
          numPart('(2)', R`光子 1 個のエネルギー $E$`, E, 'J'),
          numPart('(3)', R`光子 1 個のエネルギーを $\mathrm{eV}$ で表した値`, E / QE, 'eV')
        ],
        solution: [st[0], Object.assign({}, st[1], { lv: 1 }), st[2], st[3]]
      };
    }
  });

  /* =====================================================================
     2. 光電効果
     ===================================================================== */

  const METALS = {
    Cs: ['セシウム Cs', 1.9], K: ['カリウム K', 2.2], Na: ['ナトリウム Na', 2.3], Ca: ['カルシウム Ca', 2.9],
    Zn: ['亜鉛 Zn', 4.3], Cu: ['銅 Cu', 4.7], Pt: ['白金 Pt', 5.6]
  };

  function solvePE(W, lamNm) {
    const E = H * C / (lamNm * 1e-9) / QE;              // 光子のエネルギー [eV]
    const nu = C / (lamNm * 1e-9);
    const nu0 = W * QE / H, lam0 = H * C / (W * QE);
    const happens = E >= W - 1e-12;
    const K = happens ? E - W : 0;
    return { E: E, nu: nu, W: W, nu0: nu0, lam0: lam0, happens: happens, K: K, KJ: K * QE, V0: K, vmax: Math.sqrt(2 * K * QE / ME) };
  }

  // 光電効果の前進計算（生徒が途中の値を d 桁に丸めながら順に電卓で計算した値）。p: { W [eV], lam [nm] }
  function fwdPE(p, d) {
    const r = (x) => rd(x, d);
    const EJ = r(H * C / (p.lam * 1e-9)), EeV = r(EJ / QE), K = r(EeV - p.W), nu0 = r(p.W * QE / H);
    return { EJ: EJ, EeV: EeV, K: K, KJ: K * QE, nu0: nu0, lam0: C / nu0 * 1e9 };
  }
  // 解説に出す途中の値の桁数（p.want: 解説に答えとして出す量だけを合わせる。省略すると全部）
  function digitsPE(p, s) {
    const want = { EJ: s.E * QE, EeV: s.E, nu0: s.nu0, lam0: s.lam0 * 1e9 };
    if (s.happens) { want.K = s.K; want.KJ = s.KJ; }
    if (p.want) Object.keys(want).forEach((k) => { if (p.want.indexOf(k) < 0) delete want[k]; });
    return digitsOf((d) => fwdPE(p, d), want);
  }

  // K–ν グラフ（直線の傾きが h、ν 軸との交点が限界振動数、K 軸との交点が −W）
  function graphKnu(s) {
    const slope = H / QE * 1e14;                         // eV / (10¹⁴ Hz)
    const nu0 = s.nu0 / 1e14, nuL = s.nu / 1e14;
    const xmax = Math.max(nuL * 1.2, nu0 * 1.6, 3);
    const f = (x) => slope * (x - nu0);
    const ymax = Math.max(f(xmax), (s.K) * 1.3, 0.6);
    return JK.plot.graph({
      w: 340, h: 230, x: [0, xmax], y: [-s.W * 1.25, ymax * 1.08],
      curves: [{ f: f, cls: 'c1', domain: [nu0, xmax] }, { f: f, cls: 'dim', dash: true, domain: [0, nu0] }],
      points: [{ x: nu0, y: 0, label: 'ν₀', cls: 'c2', pos: 'br' }, { x: nuL, y: s.happens ? s.K : 0, label: s.happens ? '今の光' : '今の光（光電子なし）', cls: 'c3', pos: s.happens ? 'tl' : 'tr' }],
      vlines: [{ x: nuL, cls: 'c3' }], hlines: [{ y: -s.W, label: '−W' }],
      labels: [{ x: xmax, y: ymax * 0.1, text: 'ν [×10¹⁴ Hz]', cls: 'dim', anchor: 'end' }],
      axis: ['', 'K [eV]']
    });
  }

  // 光電管の模式図
  function figTube(lamNm, metalName, s) {
    const d = JK.plot.draw(380, 220);
    d.rect(120, 52, 150, 96, { cls: 'dim', dash: true, rx: 20, w: 1.4 });
    d.line(140, 70, 140, 130, { cls: 'c3', w: 6 });
    d.line(250, 72, 250, 128, { cls: 'c1', w: 6 });
    d.text(140, 164, '金属板', { size: 11 });
    d.text(250, 164, '陽極', { size: 11 });
    d.arrow(30, 56, 132, 84, { cls: 'c3', w: 2.2 });
    d.arrow(30, 80, 132, 100, { cls: 'c3', w: 2.2 });
    d.text(60, 46, '光 hν（λ = ' + tx(lamNm) + ' nm）', { size: 11, anchor: 'start' });
    if (s.happens) {
      [88, 100, 112].forEach((y) => { d.circle(168, y, 3.4, { cls: 'c1', fill: 'f1' }); d.arrow(176, y, 218, y, { cls: 'c1', w: 1.4 }); });
      d.text(196, 130, '光電子 e⁻', { size: 11 });
    } else {
      d.text(196, 104, '光電子は出ない', { size: 11, cls: 'dim' });
    }
    d.wire([[250, 130], [250, 190], [190, 190]]);
    d.meter(172, 190, 11, 'A');
    d.wire([[161, 190], [140, 190], [140, 130]]);
    d.text(190, 212, '金属: ' + metalName + '（W = ' + tx(s.W) + ' eV）', { size: 11 });
    return d.svg();
  }

  function stepsPE(p, s) {
    const lam = nice(p.lam);
    const D = digitsPE(p, s), F = fwdPE(p, D), cv = (x) => nice(x, D);
    const steps = [];
    steps.push({
      t: '光電効果と光子説',
      n: R`金属に光を当てると、金属から電子（光電子）が飛び出す現象を**光電効果**といいます。光を**光子**の流れと考えると、1 個の光子が 1 個の電子にエネルギー $h\nu$ をすべて与えます。電子が金属の外へ出るには、金属が電子を引きとめる力に打ち勝つエネルギー $W$（**仕事関数**）が最低限必要です。`,
      easy: R`金属の中の電子は、金属にしっかり引きとめられていて、外に出るには一定のエネルギー $W$（仕事関数）が必要です。光は小さな玉（光子）の流れで、1 個の玉が 1 個の電子にぶつかって、$h\nu$ のエネルギーを渡します。その $h\nu$ が $W$ より大きければ電子は飛び出せ、**足りなければ、玉がどれだけたくさん当たっても電子は飛び出せません**（光を明るくしても起こりません）。`,
      pro: R`光電効果は「$h\nu \ge W$ のときだけ起こる」「光の強さを増すと光電子の数（光電流）が増えるが、最大運動エネルギーは変わらない」ことが重要で、これが波動説では説明できない点です。`
    });
    steps.push({
      t: '光子のエネルギーを求める',
      m: [R`E = h\nu = \frac{hc}{\lambda} = \frac{6.63 \times 10^{-34} \times 3.00 \times 10^{8}}{` + lam + R` \times 10^{-9}} = ` + (p.want ? nice(F.EJ, D) : fres(F.EJ, s.E * QE, D)) + un('J'), R`E = \frac{` + cv(F.EJ) + R`}{1.60 \times 10^{-19}} = ` + fres(F.EeV, s.E, D) + un('eV')],
      n: R`入射光（波長 $` + lam + R`\,\mathrm{nm}$）の光子 1 個のエネルギーを求め、$\mathrm{eV}$ に直します。`,
      easy: R`光子 1 個のエネルギーは「$h \times$ 振動数」、波長で表すと $\dfrac{hc}{\lambda}$ です。電子 1 個のエネルギーを測る単位 $\mathrm{eV}$ に直しておくと、金属の $W$ と比べやすくなります。`,
      pro: R`$E[\mathrm{eV}] \fallingdotseq \dfrac{1240}{\lambda[\mathrm{nm}]}$（$\dfrac{1240}{` + lam + R`} = ` + sig(1240 / p.lam) + R`\,\mathrm{eV}$）で暗算できます。概算なので、問題で与えられた定数で計算した値とは、最後の桁が合わないことがあります。`
    });
    steps.push({
      t: '光電効果が起こるか調べる',
      m: [R`h\nu = ` + sig(s.E) + R`\,\mathrm{eV}\ ` + (s.happens ? R`\ge` : R`<`) + R`\ W = ` + nice(s.W) + un('eV')],
      n: s.happens ? R`$h\nu \ge W$ なので、**光電効果が起こります**。` : R`$h\nu < W$ なので、**光電効果は起こりません**。光子 1 個が電子に渡せるエネルギーが、電子を金属から引きはがすのに必要なエネルギー $W$ に足りないからです。光を強くして光子の数を増やしても、起こりません。`,
      easy: s.happens ? R`光子のエネルギー（入場料を払う力）が、金属が電子を引きとめるエネルギー $W$（入場料）より大きいので、電子は外に飛び出せます。` : R`光子のエネルギーが、電子を引きはがすのに必要な $W$ より小さいので、電子は飛び出せません。小さな玉を何百個ぶつけても、1 個ずつのエネルギーが足りないと、電子には届きません（別々の光子が力を合わせることはできません）。`
    });
    if (s.happens) {
      steps.push({
        t: '光電子の最大運動エネルギー',
        m: [R`K_{\max} = h\nu - W = ` + cv(F.EeV) + ' - ' + nice(s.W) + ' = ' + fres(F.K, s.K, D) + un('eV'), R`K_{\max} = ` + cv(F.K) + R` \times 1.60 \times 10^{-19} = ` + sig(s.KJ) + un('J')],
        n: R`光子のエネルギー $h\nu$ のうち $W$ が電子を金属の外に出すのに使われ、残りが光電子の運動エネルギーになります。これは金属の表面近くから出る電子の値で、**最大**運動エネルギーです。内部から出る電子は、途中でエネルギーを失うので、これより小さくなります。`,
        easy: R`光子から受け取ったエネルギー $h\nu$ から、外に出るための費用 $W$ を引いた残りが、電子の運動エネルギーです。「もらったお金 － 必要経費 ＝ 手元に残るお金」と同じです。`,
        pro: R`$K_{\max} = h\nu - W$。単位は eV のまま計算すると、阻止電圧の値（V）とそのまま一致します。`
      });
      steps.push({
        t: '阻止電圧',
        m: [R`eV_{0} = K_{\max} \;\Rightarrow\; V_{0} = \frac{K_{\max}}{e} = ` + sig(s.V0) + un('V')],
        n: R`陽極に逆向きの電圧をかけていくと、光電子は減速されて、光電流が流れなくなります。光電流がちょうど $0$ になる電圧を**阻止電圧** $V_{0}$ といい、最大運動エネルギーの電子が陽極に届かなくなる条件 $eV_{0} = K_{\max}$ から求まります。`,
        easy: R`光電子をブレーキ（逆向きの電圧）で止めてみます。いちばん勢いのある電子も止められる最小の電圧が阻止電圧で、「電子のエネルギー（eV 単位）」と「電圧（V 単位）」の数値がそのまま一致します。`,
        lv: 2
      });
    }
    steps.push({
      t: '限界振動数と限界波長',
      m: [R`h\nu_{0} = W \;\Rightarrow\; \nu_{0} = \frac{W}{h} = \frac{` + nice(s.W) + R` \times 1.60 \times 10^{-19}}{6.63 \times 10^{-34}} = ` + fres(F.nu0, s.nu0, D) + un('Hz'), R`\lambda_{0} = \frac{c}{\nu_{0}} = \frac{3.00 \times 10^{8}}{` + cv(F.nu0) + '} = ' + sig(s.lam0) + un('m') + R` = ` + sig(s.lam0 * 1e9) + un('nm')],
      n: R`光電効果が起こる**最小の振動数**を**限界振動数** $\nu_{0}$（$h\nu_{0} = W$）といいます。これより振動数が小さい（波長が長い）光では、どんなに強い光でも光電効果は起こりません。限界波長 $\lambda_{0} = \dfrac{c}{\nu_{0}}$ より短い波長の光なら起こります。`,
      easy: R`ちょうど電子が飛び出せるぎりぎりのエネルギー $h\nu_{0} = W$ になる振動数が $\nu_{0}$ です。これより低い振動数（赤っぽい光）では起こらず、これより高い振動数（青っぽい光や紫外線）なら起こります。`,
      pro: R`$\nu_{0} = \dfrac{W}{h}$、$\lambda_{0} = \dfrac{hc}{W} \fallingdotseq \dfrac{1240}{W[\mathrm{eV}]}\,\mathrm{nm}$（今回: $` + sig(1240 / s.W) + R`\,\mathrm{nm}$）。概算なので、問題で与えられた定数で計算した値とは、最後の桁が合わないことがあります。`
    });
    steps.push({
      t: '光の強さを変えたら',
      n: s.happens ? R`光を強くする（明るくする）と、**光子の数が増える**ので、飛び出す光電子の数が増えて光電流が大きくなります。しかし、光子 1 個のエネルギーは変わらないので、**最大運動エネルギー・阻止電圧は変わりません**。これらを大きくするには、振動数の大きな光に変える必要があります。` : R`今の光では光電効果が起こらないので、**光を強くして光子の数を増やしても、光電子は出ません**（光子 1 個のエネルギーが $W$ に足りないため）。光電効果を起こすには、振動数の大きな光（波長の短い光）に変える必要があります。光電効果が起こる場合には、光を強くすると光電子の数（光電流）が増え、最大運動エネルギーは変わりません。`,
      easy: s.happens ? R`光を明るくするのは、光の玉の「数」を増やすことで、玉 1 個のエネルギーは変わりません。だから電子が飛び出す「数」は増えますが、飛び出す勢い（運動エネルギー）は同じです。勢いを大きくしたいときは、玉 1 個のエネルギーが大きい、振動数の高い光（青や紫外線）に変えます。` : R`光を明るくするのは、光の玉の「数」を増やすことで、玉 1 個のエネルギーは変わりません。今の光は玉 1 個のエネルギーが足りないので、いくら数を増やしても電子は飛び出しません。電子を飛び出させたいときは、玉 1 個のエネルギーが大きい、振動数の高い光（青や紫外線）に変えます。`,
      lv: 2
    });
    steps.push({
      t: R`$K$–$\nu$ グラフの見方`,
      m: [R`K_{\max} = h\nu - W = h(\nu - \nu_{0})`],
      n: R`$K_{\max}$ を縦軸、$\nu$ を横軸にとると、グラフは直線になります。**傾きはプランク定数** $h$、**横軸との交点が限界振動数** $\nu_{0}$、**縦軸との交点が** $-W$（延長線）です。金属が変わると直線は平行移動し、傾きは変わりません。`,
      easy: R`直線のグラフ $y = ax + b$ と見くらべます。$K = h\nu - W$ なので、傾き $a$ が $h$、縦軸との交点 $b$ が $-W$ です。傾き $h$ はどの金属でも同じ値（定数）なので、金属によって直線の位置だけが左右にずれます。`,
      fig: graphKnu(s),
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'atom-photoelectric',
    field: '原子',
    unit: 'p-photon',
    title: '光電効果（限界振動数・阻止電圧・K–ν グラフ）',
    desc: '金属の種類（仕事関数 $W$）と入射光の波長から、光電効果が起こるかどうかを判定し、光電子の最大運動エネルギー $K_{\\max} = h\\nu - W$・阻止電圧・限界振動数を求めます。起こらない場合もその理由を表示します。',
    form: [R`E = h\nu = \frac{hc}{\lambda}`, R`K_{\max} = h\nu - W`, R`eV_{0} = K_{\max},\quad h\nu_{0} = W`],
    inputs: [
      { key: 'metal', label: '金属', type: 'select', def: 'Na', options: [['Cs', 'セシウム Cs（W = 1.9 eV）'], ['K', 'カリウム K（W = 2.2 eV）'], ['Na', 'ナトリウム Na（W = 2.3 eV）'], ['Ca', 'カルシウム Ca（W = 2.9 eV）'], ['Zn', '亜鉛 Zn（W = 4.3 eV）'], ['Cu', '銅 Cu（W = 4.7 eV）'], ['Pt', '白金 Pt（W = 5.6 eV）'], ['custom', '仕事関数を自分で入力']] },
      { key: 'W', label: '仕事関数 $W$', unit: 'eV', type: 'num', def: '2.3', min: 0.1, max: 20, show: (raw) => raw.metal === 'custom' },
      { key: 'lam', label: '入射光の波長 $\\lambda$', unit: 'nm', type: 'num', def: '400', min: 1, max: 100000 }
    ],
    examples: [
      { label: 'ナトリウムに 400 nm（起こる）', v: { metal: 'Na', lam: '400' } },
      { label: 'ナトリウムに 600 nm（起こらない）', v: { metal: 'Na', lam: '600' } },
      { label: '亜鉛に紫外線 250 nm', v: { metal: 'Zn', lam: '250' } },
      { label: '亜鉛に可視光 450 nm（起こらない）', v: { metal: 'Zn', lam: '450' } }
    ],
    intro: {
      easy: R`金属に光を当てると、電子が飛び出すことがあります（**光電効果**）。光は小さな玉（**光子**）の流れで、1 個の光子が 1 個の電子にエネルギー $h\nu$ を渡します。電子が金属から出るには、最低でも**仕事関数** $W$ のエネルギーが必要です。光子のエネルギー $h\nu$ が $W$ より大きいときだけ光電効果が起こり、**どんなに強い光でも、$h\nu < W$ なら起こりません**。光の強さは電子の「数」を、光の振動数は電子の「勢い」を決めます。`,
      normal: R`$h\nu \ge W$ のとき起こり、光電子の最大運動エネルギーは $K_{\max} = h\nu - W$。阻止電圧 $V_{0}$ は $eV_{0} = K_{\max}$、限界振動数 $\nu_{0} = \dfrac{W}{h}$。光を強くしても $K_{\max}$ は変わらず、光電流が増えます。`,
      pro: R`$K$–$\nu$ グラフ（直線）の傾き $= h$、$\nu$ 切片 $= \nu_{0}$、$K$ 切片 $= -W$ が頻出。2 つの振動数での阻止電圧から $h$ や $W$ を求める問題（ミリカンの実験）や、単位を $\mathrm{eV}$ にそろえる処理を押さえます。`
    },
    compute(v) {
      const W = v.metal === 'custom' ? v.W : (METALS[v.metal] || METALS.Na)[1];
      const name = v.metal === 'custom' ? '仕事関数 ' + nice(W) + ' eV の金属' : (METALS[v.metal] || METALS.Na)[0];
      const s = solvePE(W, v.lam);
      if (![s.E, s.nu0, s.lam0, s.K].every(isFinite)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
      const p = { lam: v.lam, W: W, name: name };
      const res = [
        { label: '光子 1 個のエネルギー hν', tex: sig(s.E) + un('eV') + R`\ \ (= ` + sig(s.E * QE) + R`\,\mathrm{J})` },
        { label: '仕事関数 W', tex: nice(W) + un('eV') },
        { label: '光電効果は起こるか', tex: s.happens ? R`\text{起こる（}h\nu \ge W\text{）}` : R`\text{起こらない（}h\nu < W\text{）}` }
      ];
      if (s.happens) {
        res.push({ label: '光電子の最大運動エネルギー K_max', tex: sig(s.K) + un('eV') + R`\ \ (= ` + sig(s.KJ) + R`\,\mathrm{J})` });
        res.push({ label: '阻止電圧 V₀', tex: sig(s.V0) + un('V') });
        res.push({ label: '最大の速さ v_max', tex: sig(s.vmax) + un('m/s') });
      }
      res.push({ label: '限界振動数 ν₀ と限界波長 λ₀', tex: R`\nu_{0} = ` + sig(s.nu0) + R`\,\mathrm{Hz},\ \ \lambda_{0} = ` + sig(s.lam0 * 1e9) + R`\,\mathrm{nm}` });
      return { result: res, steps: stepsPE(p, s), fig: stack2(figTube(v.lam, name, s), graphKnu(s)) };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // 2 つの振動数での阻止電圧から h と W を求める
        let key, W, nu1, nu2, V1, V2;
        for (let k = 0; k < 300; k++) {
          key = rng.pick(['Cs', 'K', 'Na', 'Ca']); W = METALS[key][1];
          nu1 = rng.pick([6.0, 7.0, 8.0]); nu2 = nu1 + rng.pick([1.0, 2.0, 3.0]);
          V1 = Math.round((H * nu1 * 1e14 / QE - W) * 100) / 100; V2 = Math.round((H * nu2 * 1e14 / QE - W) * 100) / 100;
          if (V1 > 0.1 && V2 > V1 + 0.5) break;
        }
        const hh = QE * (V2 - V1) / ((nu2 - nu1) * 1e14);
        const Wev = hh * nu1 * 1e14 / QE - V1;
        const nu0 = Wev * QE / hh;
        // h → W → ν₀ と順に使う途中の値は、生徒が d 桁に丸めながら計算した値で書く（表示どおりに計算し直すと、答えの表示と合う桁数）
        const dV = V2 - V1, dNu = (nu2 - nu1) * 1e14;
        const fwd = (d) => { const r = (x) => rd(x, d), h1 = r(QE * dV / dNu), W1 = r(h1 * nu1 * 1e14 / QE - V1); return { h: h1, W: W1, nu0: W1 * QE / h1 }; };
        const D = digitsOf(fwd, { h: hh, W: Wev, nu0: nu0 });
        const Fw = fwd(D);
        const sol = [
          {
            t: '阻止電圧と振動数の関係式を立てる',
            m: [R`eV_{0} = h\nu - W`, R`eV_{1} = h\nu_{1} - W,\qquad eV_{2} = h\nu_{2} - W`],
            n: R`阻止電圧 $V_{0}$ は、光電子の最大運動エネルギー $K_{\max} = h\nu - W$ と $eV_{0} = K_{\max}$ で結びつきます。2 つの振動数 $\nu_{1}$、$\nu_{2}$ での阻止電圧 $V_{1}$、$V_{2}$ から、2 つの式ができます。`,
            easy: R`光電子を止めるのに必要な電圧 $V_{0}$ は、光子のエネルギー $h\nu$ から $W$ を引いた分に比例します。振動数を 2 通りに変えて測った 2 つのデータから、2 本の式をつくります。未知の量は $h$ と $W$ の 2 つなので、2 本の式で解けます。`
          },
          {
            t: '2 式の差から $h$ を求める',
            m: [R`e(V_{2} - V_{1}) = h(\nu_{2} - \nu_{1}) \;\Rightarrow\; h = \frac{e(V_{2} - V_{1})}{\nu_{2} - \nu_{1}}`, R`h = \frac{1.60 \times 10^{-19} \times (` + nice(V2) + ' - ' + nice(V1) + R`)}{(` + nice(nu2) + ' - ' + nice(nu1) + R`) \times 10^{14}} = ` + fres(Fw.h, hh, D) + un(R`J \cdot s`)],
            n: R`2 つの式を引き算すると $W$ が消えて、$h$ が求まります。グラフ（$V_{0}$–$\nu$）では直線の**傾きが $\dfrac{h}{e}$** にあたります。`,
            easy: R`2 つの式を引き算すると、分からない $W$ が消えて、$h$ だけが残ります。グラフにして直線の傾きを読むのと同じ計算です。`,
            pro: R`$h = e \times (\text{傾き}) = e\dfrac{\Delta V_{0}}{\Delta\nu}$。傾きの単位は $\mathrm{V \cdot s}$ です。`
          },
          {
            t: '$W$ を求める',
            m: [R`W = h\nu_{1} - eV_{1} \;\Rightarrow\; W = \frac{h\nu_{1}}{e} - V_{1}`, R`W = \frac{` + nice(Fw.h, D) + R` \times ` + nice(nu1) + R` \times 10^{14}}{1.60 \times 10^{-19}} - ` + nice(V1) + ' = ' + fres(Fw.W, Wev, D) + un('eV')],
            n: R`求めた $h$ をどちらかの式に代入して $W$ を求めます。両辺を $e$ で割ると、$\mathrm{J}$ で表した式が $\mathrm{eV}$ の式になります（$eV_{1}$ を $e$ で割ると $V_{1}$ の数値になります）。`,
            easy: R`$h$ が分かったので、1 本目の式に代入すれば $W$ が求まります。$h\nu_{1}$ から $eV_{1}$ を引くだけです。`
          },
          {
            t: '限界振動数',
            m: [R`h\nu_{0} = W \;\Rightarrow\; \nu_{0} = \frac{W}{h} = \frac{` + nice(Fw.W, D) + R` \times 1.60 \times 10^{-19}}{` + nice(Fw.h, D) + '} = ' + sig(nu0) + un('Hz')],
            n: R`$V_{0} = 0$ となる振動数が限界振動数 $\nu_{0}$ です（グラフの横軸との交点）。$h\nu_{0} = W$ から求まります。`,
            easy: R`電子が飛び出せるぎりぎりの光は、光子のエネルギーが $W$ にちょうど等しい光です。そのときの振動数が限界振動数です。`
          }
        ];
        return {
          title: '阻止電圧から h と仕事関数を求める',
          body: R`ある金属に、振動数 $\nu_{1} = ` + sf(nu1) + R` \times 10^{14}\,\mathrm{Hz}$ の光と $\nu_{2} = ` + sf(nu2) + R` \times 10^{14}\,\mathrm{Hz}$ の光を当てて、光電流が流れなくなる阻止電圧を測ったところ、それぞれ $V_{1} = ` + sf(V1) + R`\,\mathrm{V}$、$V_{2} = ` + sf(V2) + R`\,\mathrm{V}$ であった。電気素量を $e = 1.60 \times 10^{-19}\,\mathrm{C}$（$1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}$）として、次の問いに答えよ。`,
          fig: graphV0(nu1, V1, nu2, V2),
          parts: [
            numPart('(1)', R`プランク定数 $h$（この実験の値から求めよ）`, hh, 'J·s'),
            numPart('(2)', R`この金属の仕事関数 $W$`, Wev, 'eV'),
            numPart('(3)', R`この金属の限界振動数 $\nu_{0}$`, nu0, 'Hz')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        // 限界振動数・限界波長・K
        let key, W, lam, s;
        for (let k = 0; k < 200; k++) {
          key = rng.pick(['Cs', 'K', 'Na', 'Ca', 'Zn']); W = METALS[key][1];
          lam = rng.pick([200, 250, 280, 300, 350, 400, 450]);
          s = solvePE(W, lam);
          if (s.happens && s.K > 0.2) break;
        }
        const name = METALS[key][0];
        const p = { lam: lam, W: W, name: name, want: ['EJ', 'EeV', 'K', 'nu0', 'lam0'] };
        const st = stepsPE(p, s), by = (t) => st.filter((x) => x.t === t)[0];
        return {
          title: '限界振動数と最大運動エネルギー',
          body: name + R`（仕事関数 $` + sf(W) + R`\,\mathrm{eV}$）の板に、波長 $` + sf(lam) + R`\,\mathrm{nm}$ の光を当てたところ、光電子が飛び出した。` + CONST_TXT + R`次の問いに答えよ。`,
          fig: figTube(lam, name, s),
          parts: [
            numPart('(1)', R`この金属の限界振動数 $\nu_{0}$`, s.nu0, 'Hz'),
            numPart('(2)', R`この金属の限界波長 $\lambda_{0}$`, s.lam0 * 1e9, 'nm'),
            numPart('(3)', R`飛び出す光電子の最大運動エネルギー $K_{\max}$（$\mathrm{eV}$ で）`, s.K, 'eV')
          ],
          // 設問の順（ν₀・λ₀ → K）。K の段の J への換算（問われていない）は書かない
          solution: [by('限界振動数と限界波長'), by('光子のエネルギーを求める'), Object.assign({}, by('光電子の最大運動エネルギー'), { m: [by('光電子の最大運動エネルギー').m[0]] })]
        };
      }
      // basic: 光電効果の判定と K・阻止電圧
      let key, W, lam, s;
      for (let k = 0; k < 200; k++) {
        key = rng.pick(['Cs', 'K', 'Na', 'Ca']); W = METALS[key][1];
        lam = rng.pick([250, 300, 350, 400]);
        s = solvePE(W, lam);
        if (s.happens && s.K > 0.2) break;
      }
      const name = METALS[key][0];
      const p = { lam: lam, W: W, name: name, want: ['EJ', 'EeV', 'K'] };
      const st = stepsPE(p, s), by = (t) => st.filter((x) => x.t === t)[0];
      return {
        title: '光電効果の最大運動エネルギーと阻止電圧',
        body: name + R`（仕事関数 $` + sf(W) + R`\,\mathrm{eV}$）の板に、波長 $` + sf(lam) + R`\,\mathrm{nm}$ の光を当てたところ、光電子が飛び出した。` + CONST_TXT + R`次の問いに答えよ。`,
        fig: figTube(lam, name, s),
        parts: [
          numPart('(1)', R`入射光の光子 1 個のエネルギー（$\mathrm{eV}$ で）`, s.E, 'eV'),
          numPart('(2)', R`飛び出す光電子の最大運動エネルギー $K_{\max}$（$\mathrm{eV}$ で）`, s.K, 'eV'),
          numPart('(3)', R`光電流を $0$ にするために必要な阻止電圧 $V_{0}$`, s.V0, 'V')
        ],
        // K の段の J への換算（問われていない）は書かない。(3) の阻止電圧を出す段は lv 1 にする
        solution: [by('光子のエネルギーを求める'), Object.assign({}, by('光電子の最大運動エネルギー'), { m: [by('光電子の最大運動エネルギー').m[0]] }), Object.assign({}, by('阻止電圧'), { lv: 1 })]
      };
    }
  });

  // 2 つの SVG を縦に並べる（光電管 + グラフ）
  function stack2(a, b) {
    const ma = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(a), mb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(b);
    const wa = Number(ma[1]), ha = Number(ma[2]), wb = Number(mb[1]), hb = Number(mb[2]), w = Math.max(wa, wb);
    const inner = (s) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return '<svg class="jk-plot jk-draw" viewBox="0 0 ' + w + ' ' + (ha + hb) + '" width="' + w + '" height="' + (ha + hb) + '" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<g transform="translate(' + ((w - wa) / 2) + ',0)">' + inner(a) + '</g><g transform="translate(' + ((w - wb) / 2) + ',' + ha + ')">' + inner(b) + '</g></svg>';
  }

  // 阻止電圧と振動数の測定点（演習用）。2 点を通る直線の図ではなく測定点だけを示す
  function graphV0(nu1, V1, nu2, V2) {
    return JK.plot.graph({
      w: 340, h: 220, x: [0, nu2 * 1.25], y: [0, V2 * 1.3],
      points: [{ x: nu1, y: V1, label: '(' + nu1 + ', ' + V1 + ')', cls: 'c3', pos: 'br' }, { x: nu2, y: V2, label: '(' + nu2 + ', ' + V2 + ')', cls: 'c3', pos: 'tl' }],
      axis: ['ν [×10¹⁴ Hz]', 'V₀ [V]']
    });
  }

  /* =====================================================================
     3. 物質波（ド・ブロイ波）と X 線の最短波長
     ===================================================================== */

  const BEAMS = { electron: ['電子', ME], proton: ['陽子', MP], neutron: ['中性子', MN] };

  function solveDB(p) {
    const m = p.m;
    let vel = p.v;
    if (p.mode === 'V') vel = Math.sqrt(2 * QE * p.V / m);
    const pm = m * vel;
    return { vel: vel, p: pm, lam: H / pm, K: 0.5 * m * vel * vel };
  }

  // 物質波の前進計算（生徒が途中の値を d 桁に丸めながら順に電卓で計算した値）。p は solveDB と同じ入力
  function fwdDB(p, d) {
    const r = (x) => rd(x, d);
    const vel = p.mode === 'V' ? r(Math.sqrt(2 * QE * p.V / p.m)) : p.v;
    const pm = r(p.m * vel);
    return { vel: vel, p: pm, lam: H / pm };
  }
  // 解説に出す途中の値の桁数（p.want: 解説に答えとして出す量だけを合わせる。省略すると全部）
  function digitsDB(p, s) {
    const want = { vel: s.vel, p: s.p, lam: s.lam };
    if (p.want) Object.keys(want).forEach((k) => { if (p.want.indexOf(k) < 0) delete want[k]; });
    return digitsOf((d) => fwdDB(p, d), want);
  }

  // 長さの対数目盛（物質波の波長を、原子や身長と比べる）
  function figScale(lam) {
    const d = JK.plot.draw(380, 170);
    const x0 = 24, x1 = 356, lo = -36, hi = 2;
    const X = (lg) => x0 + (lg - lo) / (hi - lo) * (x1 - x0);
    d.line(x0, 100, x1, 100, { cls: 'fg', w: 2 });
    [[-15, '原子核'], [-10, '原子'], [-6, '細菌'], [-3, 'ちり'], [0, '身長']].forEach((t, i) => {
      d.line(X(t[0]), 94, X(t[0]), 106, { cls: 'dim', w: 1.4 });
      d.text(X(t[0]), 122 + (i % 2) * 14, t[1], { size: 10, cls: 'dim' });
    });
    [-35, -30, -25, -20, -15, -10, -5, 0].forEach((g) => d.text(X(g), 92, '10' + String(g).split('').map((c) => SUPS[c] || c).join(''), { size: 9, cls: 'dim' }));
    const lg = Math.log10(lam), cl = Math.max(lo + 0.5, Math.min(hi - 0.3, lg));
    d.poly([[X(cl) - 6, 56], [X(cl) + 6, 56], [X(cl), 78]], { cls: 'c3', fill: 'f3' });
    d.text(Math.max(80, Math.min(300, X(cl))), 44, 'λ = ' + tx3(lam) + ' m' + (lg < lo + 0.5 ? '（図の範囲の外）' : ''), { size: 11 });
    d.text(190, 164, '対数目盛（m）。λ が原子の大きさ程度なら波の性質が見える', { cls: 'dim', size: 10 });
    return d.svg();
  }

  // 連続 X 線の強さ（最短波長のところで切れる）
  function graphXray(lamMin) {
    const u = lamMin >= 1e-10 ? { k: 1e9, n: 'nm' } : { k: 1e12, n: 'pm' };
    const lm = lamMin * u.k;
    return JK.plot.graph({
      w: 340, h: 210, x: [0, lm * 8.2], y: [0, 1.3],
      curves: [{ f: (x) => { const r = x / lm; return 4 * (r - 1) / (r * r); }, cls: 'c1', domain: [lm, lm * 8] }],
      vlines: [{ x: lm, label: 'λ_min', cls: 'c3' }],
      axis: ['λ [' + u.n + ']', '強さ']
    });
  }

  function stepsDB(p, s) {
    const steps = [];
    const D = p.mode === 'xray' ? 3 : digitsDB(p, s), F = p.mode === 'xray' ? null : fwdDB(p, D), cv = (x) => nice(x, D);
    if (p.mode === 'xray') {
      const Vx = nice(p.Vx * 1e3);
      steps.push({
        t: 'X 線の発生と連続 X 線',
        n: R`高電圧 $V$ で加速した電子を金属の板（ターゲット）にぶつけると、X 線が出ます。電子が急に止められるときにエネルギーの一部が光子として放出されるので、いろいろな波長の連続した X 線が出ます。その中で、電子の運動エネルギー $eV$ のすべてが 1 個の光子になった場合が、**最もエネルギーが大きく、波長が最も短い**光子です。`,
        easy: R`電子は、電圧 $V$ で加速されて、運動エネルギー $eV$ をもっています。この電子が金属に衝突して止まるとき、エネルギーを光（X 線）に変えます。エネルギーを全部光にした場合の光子がいちばんエネルギーが大きく、波長がいちばん短い光子で、それより短い波長の X 線は出ません。`,
        pro: R`連続 X 線の最短波長 $\lambda_{\min} = \dfrac{hc}{eV}$ は、ターゲットの金属の種類によらず、加速電圧だけで決まります（光電効果の逆の過程）。`
      });
      steps.push({
        t: '最短波長',
        m: [R`eV = h\nu_{\max} = \frac{hc}{\lambda_{\min}} \;\Rightarrow\; \lambda_{\min} = \frac{hc}{eV}`, R`\lambda_{\min} = \frac{6.63 \times 10^{-34} \times 3.00 \times 10^{8}}{1.60 \times 10^{-19} \times ` + Vx + '} = ' + sig(s.lam) + un('m') + R` = ` + sig(s.lam * 1e9) + un('nm')],
        n: R`電子のエネルギー $eV$ がすべて 1 個の光子のエネルギー $\dfrac{hc}{\lambda_{\min}}$ になったとして、最短波長を求めます。電圧は $\mathrm{V}$ に直します（$` + nice(p.Vx) + R`\,\mathrm{kV} = ` + Vx + R`\,\mathrm{V}$）。`,
        easy: R`電子のエネルギー（電気量 × 電圧）が、そのまま光子のエネルギー $\dfrac{hc}{\lambda}$ になったとして、波長について解きます。電圧が高いほど短い波長（より透過力の強い X 線）が出ます。`,
        pro: R`$\lambda_{\min}[\mathrm{nm}] \fallingdotseq \dfrac{1.24}{V[\mathrm{kV}]}$（今回: $\dfrac{1.24}{` + nice(p.Vx) + R`} = ` + sig(1.24 / p.Vx) + R`\,\mathrm{nm}$）。概算なので、問題で与えられた定数で計算した値とは、最後の桁が合わないことがあります。`
      });
      steps.push({
        t: '光子の最大エネルギーと最大振動数',
        m: [R`E_{\max} = eV = 1.60 \times 10^{-19} \times ` + Vx + ' = ' + sig(s.K) + un('J') + R` = ` + sig(s.K / QE / 1e3) + un('keV'), R`\nu_{\max} = \frac{eV}{h} = \frac{` + nice(s.K) + R`}{6.63 \times 10^{-34}} = ` + sig(s.K / H) + un('Hz')],
        n: R`X 線光子の最大のエネルギーは、電子の運動エネルギー $eV$ に等しく、$\mathrm{eV}$ で表すと数値が加速電圧の値（$\mathrm{V}$）と一致します。`,
        easy: R`$1\,\mathrm{V}$ で加速された電子のエネルギーが $1\,\mathrm{eV}$、$30\,\mathrm{kV}$ で加速された電子のエネルギーは $30\,\mathrm{keV}$ です。そのエネルギーが全部 1 個の光子になれば、光子の最大エネルギーも $30\,\mathrm{keV}$ です。`,
        lv: 2
      });
      steps.push({
        t: '電圧を変えると',
        n: R`$\lambda_{\min} = \dfrac{hc}{eV}$ なので、**加速電圧を 2 倍にすると最短波長は半分**になります（電圧に反比例）。電圧を高くするほど、波長の短い（エネルギーの大きい）X 線が出ます。`,
        easy: R`電圧を上げると、電子がもつエネルギーが増えるので、より大きなエネルギーの光子（波長の短い X 線）が出せます。式の中で電圧 $V$ が分母にあるので、電圧が 2 倍になれば最短波長は $\dfrac{1}{2}$ になります。`,
        lv: 2
      });
      steps.push({
        t: '連続 X 線のグラフ',
        n: R`波長を横軸に、X 線の強さを縦軸にとると、$\lambda_{\min}$ よりも短い波長では X 線が出ず、$\lambda_{\min}$ から立ち上がってゆるやかに減っていく曲線になります（ターゲットの金属に固有の波長の鋭い線 = **特性 X 線**が重なって見えることもあります）。`,
        easy: R`グラフを見ると、ある波長（$\lambda_{\min}$）より短い波長では X 線がまったく出ていません。電子がもっているエネルギー以上のエネルギーの光子は出せないためです。`,
        fig: graphXray(s.lam),
        lv: 3
      });
      return steps;
    }
    const nm = BEAMS[p.kind] ? BEAMS[p.kind][0] : '粒子';
    steps.push({
      t: '物質波（ド・ブロイ波）',
      n: R`光が粒子の性質をもつのと同じように、電子や陽子などの粒子も**波の性質**をもちます。運動量 $p = mv$ の粒子の波長（**ド・ブロイ波長**）は $\lambda = \dfrac{h}{p} = \dfrac{h}{mv}$ です。この波を**物質波**といいます。`,
      easy: R`光は「波」でもあり「粒子」でもありました。それなら、電子のような粒子も「波」の性質をもつだろう、と考えたのがド・ブロイです。実際に、結晶に電子の流れを当てると、X 線のときと同じように、干渉のしま模様ができます。粒子の運動量が大きい（重くて速い）ほど、波長は短くなります。`,
      pro: R`光子 $p = \dfrac{h}{\lambda}$ と同じ関係式 $\lambda = \dfrac{h}{p}$ が、粒子にも成り立つ。波長が原子間隔（$10^{-10}\,\mathrm{m}$）程度のとき、結晶による回折が観測できます。`
    });
    if (p.mode === 'V') {
      steps.push({
        t: '電圧で加速された粒子の速さ',
        m: [R`eV = \frac{1}{2}mv^{2} \;\Rightarrow\; v = \sqrt{\frac{2eV}{m}}`, R`v = \sqrt{\frac{2 \times 1.60 \times 10^{-19} \times ` + nice(p.V) + '}{' + nice(p.m) + '}} = ' + fres(F.vel, s.vel, D) + un('m/s')],
        n: R`静止していた粒子（電気量 $e$）が電圧 $V$ で加速されると、電場がした仕事 $eV$ が運動エネルギー $\dfrac{1}{2}mv^{2}$ になります。`,
        easy: R`電圧 $V$ の坂を下ると、電気量 $e$ の粒子は $eV$ のエネルギーを得て、それが運動エネルギーになります。そこから速さを逆算します。`
      });
    }
    steps.push({
      t: '運動量',
      m: [R`p = mv = ` + nice(p.m) + R` \times ` + cv(F.vel) + ' = ' + fres(F.p, s.p, D) + un(R`kg \cdot m/s`)],
      n: R`質量と速さを掛けて運動量を求めます。`,
      easy: R`運動量は「質量 × 速さ」です。重くて速いほど大きくなります。`,
      lv: 2
    });
    steps.push({
      t: 'ド・ブロイ波長',
      m: [R`\lambda = \frac{h}{p} = \frac{6.63 \times 10^{-34}}{` + cv(F.p) + '} = ' + sig(s.lam) + un('m') + R` = ` + sig(s.lam * 1e9) + un('nm')],
      n: R`運動量が分かれば、プランク定数を割るだけで波長が求まります。`,
      easy: R`波長は「プランク定数 $h$ ÷ 運動量 $p$」です。$h$ はとても小さな数なので、ふつうの大きさの物体では、波長は小さすぎて波の性質が見えません（野球のボールで約 $10^{-34}\,\mathrm{m}$）。電子のような軽い粒子だと、波長が原子の大きさ程度になり、波の性質が観測できます。`,
      pro: p.kind === 'electron' && p.mode === 'V' ? R`電子を $V\,[\mathrm{V}]$ で加速したときの波長は $\lambda[\mathrm{nm}] \fallingdotseq \dfrac{1.23}{\sqrt{V}}$ と覚えられます（今回: $\dfrac{1.23}{\sqrt{` + nice(p.V) + R`}} = ` + sig(1.23 / Math.sqrt(p.V)) + R`\,\mathrm{nm}$）。概算なので、問題で与えられた定数で計算した値とは、最後の桁が合わないことがあります。` : R`$\lambda = \dfrac{h}{\sqrt{2meV}}$（加速電圧 $V$ の場合）の形も使えるようにします。`
    });
    steps.push({
      t: '他の粒子との比較',
      n: R`同じ速さなら、質量が大きい粒子ほど運動量が大きく、波長は短くなります（電子 $\to$ 陽子で約 $\dfrac{1}{1800}$）。野球のボール（$m = 0.15\,\mathrm{kg}$、$v = 30\,\mathrm{m/s}$）の波長は $\lambda = \dfrac{6.63 \times 10^{-34}}{0.15 \times 30} \fallingdotseq 1.5 \times 10^{-34}\,\mathrm{m}$ で、波の性質はまったく観測できません。`,
      easy: R`波長が短すぎると、波の性質（干渉や回折）は目に見えません。人間が見るような大きな物体では波長が小さすぎて、粒子としてしか観測できません。原子サイズの小さな粒子（電子など）だけが、波の性質をはっきり示します。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'atom-debroglie',
    field: '原子',
    unit: 'p-photon',
    title: '物質波（ド・ブロイ波長）と X 線の最短波長',
    desc: '電子・陽子・中性子などの粒子の物質波の波長 $\\lambda = \\dfrac{h}{mv}$（速さを与える場合と、電圧で加速する場合）、および X 線管の加速電圧から連続 X 線の最短波長 $\\lambda_{\\min} = \\dfrac{hc}{eV}$ を求めます。',
    form: [R`\lambda = \frac{h}{p} = \frac{h}{mv}`, R`eV = \frac{1}{2}mv^{2} \;\Rightarrow\; \lambda = \frac{h}{\sqrt{2meV}}`, R`\lambda_{\min} = \frac{hc}{eV}`],
    inputs: [
      { key: 'mode', label: '調べる場面', type: 'select', def: 'V', options: [['V', '電圧 V で加速した粒子の波長'], ['v', '速さ v の粒子の波長'], ['xray', 'X 線管の連続 X 線の最短波長']] },
      { key: 'kind', label: '粒子', type: 'select', def: 'electron', options: [['electron', '電子（m = 9.11×10⁻³¹ kg）'], ['proton', '陽子（m = 1.67×10⁻²⁷ kg）'], ['neutron', '中性子（m = 1.67×10⁻²⁷ kg）'], ['custom', '質量を入力（野球のボールなど）']], show: (raw) => raw.mode !== 'xray' },
      { key: 'mk', label: '質量 $m$', unit: 'kg', type: 'num', def: '0.15', min: 1e-33, max: 100000, show: (raw) => raw.mode !== 'xray' && raw.kind === 'custom' },
      { key: 'V', label: '加速電圧 $V$', unit: 'V', type: 'num', def: '100', min: 0.001, max: 100000, hint: '電荷 e の粒子（電子・陽子）を静止状態から加速します', show: (raw) => raw.mode === 'V' },
      { key: 'v', label: '粒子の速さ $v$', unit: 'm/s', type: 'num', def: '1.0e6', min: 0.000001, max: 30000000, show: (raw) => raw.mode === 'v' },
      { key: 'Vx', label: 'X 線管の加速電圧 $V$', unit: 'kV', type: 'num', def: '30', min: 0.01, max: 10000, show: (raw) => raw.mode === 'xray' }
    ],
    examples: [
      { label: '電子を 100 V で加速', v: { mode: 'V', kind: 'electron', V: '100' } },
      { label: '電子（速さ 1.0×10⁶ m/s）', v: { mode: 'v', kind: 'electron', v: '1.0e6' } },
      { label: '野球のボール（150 g・30 m/s）', v: { mode: 'v', kind: 'custom', mk: '0.15', v: '30' } },
      { label: 'X 線管（30 kV）', v: { mode: 'xray', Vx: '30' } }
    ],
    intro: {
      easy: R`光は波でもあり粒子でもありました。じつは、**電子や陽子などの粒子も波の性質をもっています**（**物質波**）。運動量 $p$ の粒子の波長は $\lambda = \dfrac{h}{p}$ で、重くて速いほど波長は短くなります。電子は軽いので、波長が原子の大きさ程度になり、結晶に当てると干渉のしま模様ができます（電子線回折）。また、高電圧で加速した電子を金属にぶつけると X 線が出ますが、出てくる X 線の波長には、電圧で決まる**下限（最短波長）**があります。`,
      normal: R`$\lambda = \dfrac{h}{mv}$。電圧 $V$ で加速された電子は $\dfrac{1}{2}mv^{2} = eV$ より $\lambda = \dfrac{h}{\sqrt{2meV}}$。X 線管では電子のエネルギー $eV$ が 1 個の光子の最大エネルギーとなり、最短波長は $\lambda_{\min} = \dfrac{hc}{eV}$。`,
      pro: R`電子の波長 $\lambda \fallingdotseq \dfrac{1.23}{\sqrt{V}}\,\mathrm{nm}$（$V$ は加速電圧の数値）、X 線の最短波長 $\lambda_{\min} \fallingdotseq \dfrac{1.24}{V[\mathrm{kV}]}\,\mathrm{nm}$ を暗算に使います。ブラッグ条件 $2d\sin\theta = n\lambda$ と結びつけた問題が頻出です。`
    },
    compute(v) {
      if (v.mode === 'xray') {
        const lam = H * C / (QE * v.Vx * 1e3), Em = QE * v.Vx * 1e3;
        if (![lam, Em].every(isFinite)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
        const s = { lam: lam, K: Em, vel: 0, p: 0 };
        const p = { mode: 'xray', Vx: v.Vx };
        return {
          result: [
            { label: '最短波長 λ_min', tex: sig(lam) + un('m') + R`\ \ (= ` + sig(lam * 1e9) + R`\,\mathrm{nm})` },
            { label: '光子の最大エネルギー E_max = eV', tex: sig(Em) + un('J') + R`\ \ (= ` + sig(v.Vx) + R`\,\mathrm{keV})` },
            { label: '最大振動数 ν_max', tex: sig(Em / H) + un('Hz') },
            { label: '電圧を 2 倍にしたときの最短波長', tex: sig(lam / 2) + un('m') }
          ],
          steps: stepsDB(p, s),
          fig: graphXray(lam)
        };
      }
      const kind = v.kind || 'electron';
      if (kind === 'neutron' && v.mode === 'V') throw new JK.CalcError('中性子は電気を帯びていないので、電圧では加速できません。速さを直接入力するか、電子・陽子を選んでください。');
      const m = kind === 'custom' ? v.mk : (BEAMS[kind] || BEAMS.electron)[1];
      const p = { mode: v.mode === 'v' ? 'v' : 'V', kind: kind, m: m, V: v.V, v: v.v };
      const s = solveDB(p);
      if (![s.vel, s.p, s.lam, s.K].every(isFinite) || !(s.p > 0)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
      if (s.vel > 0.1 * C) throw new JK.CalcError('速さが光速の 1/10（3.0×10⁷ m/s）を超えます。この計算は相対性理論が不要な範囲でのみ成り立つので、電圧や速さを小さくしてください。');
      const res = [];
      if (p.mode === 'V') res.push({ label: '加速後の速さ v', tex: sig(s.vel) + un('m/s') });
      res.push({ label: '運動量 p = mv', tex: sig(s.p) + un(R`kg \cdot m/s`) });
      res.push({ label: 'ド・ブロイ波長 λ', tex: sig(s.lam) + un('m') + R`\ \ (= ` + sig(s.lam * 1e9) + R`\,\mathrm{nm})` });
      res.push({ label: '運動エネルギー K', tex: sig(s.K) + un('J') + R`\ \ (= ` + sig(s.K / QE) + R`\,\mathrm{eV})` });
      res.push({ label: '波長 ÷ 原子の大きさ（10⁻¹⁰ m）', tex: sig(s.lam / 1e-10) });
      return { result: res, steps: stepsDB(p, s), fig: figScale(s.lam) };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // 電子線回折: 加速電圧 → 波長 → ブラッグ角
        let V, d;
        for (let k = 0; k < 200; k++) {
          V = rng.pick([50, 100, 150, 200]); d = rng.pick([0.20, 0.25, 0.30, 0.35]);
          const lamk = H / Math.sqrt(2 * ME * QE * V) * 1e9;
          if (lamk / (2 * d) < 0.9 && lamk / (2 * d) > 0.15) break;
        }
        const p = { mode: 'V', kind: 'electron', m: ME, V: V };
        const s = solveDB(p);
        const lamnm = s.lam * 1e9, sn = lamnm / (2 * d), th = Math.asin(sn) * 180 / Math.PI;
        // 途中の値（v → p → λ → sinθ）は、生徒が d 桁に丸めながら順に計算した値で書く（表示どおりに計算し直すと、答えの表示と合う桁数）
        const fw = (dg) => {
          const r = (x) => rd(x, dg), vel = r(Math.sqrt(2 * QE * V / ME)), pm = r(ME * vel), lm = r(H / pm), ln = lm * 1e9, sd = r(ln / (2 * d));
          return { vel: vel, p: pm, lamnm: ln, th: Math.asin(sd) * 180 / Math.PI, lm: lm, sn: sd };
        };
        const D = digitsOf(fw, { vel: s.vel, p: s.p, lamnm: lamnm, th: th }), Fa = fw(D);
        const st = stepsDB(p, s), by = (t) => st.filter((x) => x.t === t)[0], stv = by('電圧で加速された粒子の速さ'), stl = by('ド・ブロイ波長');
        const sol = [
          Object.assign({}, stv, { m: [stv.m[0], R`v = \sqrt{\frac{2 \times 1.60 \times 10^{-19} \times ` + nice(V) + R`}{9.11 \times 10^{-31}}} = ` + fres(Fa.vel, s.vel, D) + un('m/s')] }),
          Object.assign({}, stl, { m: [R`p = mv = 9.11 \times 10^{-31} \times ` + nice(Fa.vel, D) + ' = ' + nice(Fa.p, D) + un(R`kg \cdot m/s`), R`\lambda = \frac{h}{p} = \frac{6.63 \times 10^{-34}}{` + nice(Fa.p, D) + '} = ' + nice(Fa.lm, D) + un('m') + R` = ` + fres(Fa.lamnm, lamnm, D) + un('nm')], n: R`運動量 $p = mv$ を求めてから、$\lambda = \dfrac{h}{p}$ で波長を求めます。` })
        ];
        sol.push({
          t: '結晶による回折（ブラッグの条件）',
          m: [R`2d\sin\theta = n\lambda\ \ (n = 1) \;\Rightarrow\; \sin\theta = \frac{\lambda}{2d} = \frac{` + nice(Fa.lamnm, D) + R`}{2 \times ` + nice(d) + '} = ' + nice(Fa.sn, D), R`\theta = \sin^{-1}(` + nice(Fa.sn, D) + R`) = ` + sig(th) + R`\degree`],
          n: R`結晶の原子面（間隔 $d$）で反射した電子の波が、強めあう条件は、経路差 $2d\sin\theta$ が波長の整数倍になること（ブラッグの条件）です。最も小さい角（1 次、$n = 1$）は $\sin\theta = \dfrac{\lambda}{2d}$ から求まります。`,
          easy: R`原子が規則正しく並んだ結晶に、波（X 線や電子の波）を当てると、並んだ面ごとに反射した波が重なりあいます。上の面と下の面で反射した波の道のりの差（経路差）が $2d\sin\theta$ で、これが波長 1 個分のとき、波がそろって強めあいます。この角度のときだけ強い反射が見られます。`,
          pro: R`$2d\sin\theta = n\lambda$。角度が与えられていれば $\lambda$、$\lambda$ が与えられていれば角度が求まります。$\theta$ は面とビームのなす角（面に垂直な方向からではない）であることに注意します。`
        });
        return {
          title: '電子線回折（物質波とブラッグの条件）',
          body: R`静止していた電子を電圧 $` + sf(V) + R`\,\mathrm{V}$ で加速し、原子面の間隔が $d = ` + sf(d) + R`\,\mathrm{nm}$ の結晶に当てて回折させる。電子の質量を $m = 9.11 \times 10^{-31}\,\mathrm{kg}$、` + consts(['h', 'e']) + R`次の問いに答えよ。ただし、1 次の強めあい（$n = 1$）が起こる、面とビームのなす角を $\theta$ とする。`,
          fig: figBragg(d, V),
          parts: [
            numPart('(1)', R`加速された電子の速さ $v$`, s.vel, 'm/s'),
            numPart('(2)', R`電子の物質波の波長 $\lambda$`, lamnm, 'nm'),
            numPart('(3)', R`1 次の強めあいが起こる角 $\theta$`, th, '°')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        // 電子を電圧で加速: v, p, λ
        const V = rng.pick([10, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 900]);   // 最大 900 V でも v ≒ 0.06c（非相対論でよい）
        const p = { mode: 'V', kind: 'electron', m: ME, V: V, want: ['vel', 'p', 'lam'] };
        const s = solveDB(p);
        const st = stepsDB(p, s), by = (t) => st.filter((x) => x.t === t)[0];
        return {
          title: '電圧で加速した電子の物質波',
          body: R`静止していた電子を、電圧 $` + sf(V) + R`\,\mathrm{V}$ で加速した。電子の質量を $m = 9.11 \times 10^{-31}\,\mathrm{kg}$、` + consts(['h', 'e']) + R`次の問いに答えよ。`,
          fig: figScale(s.lam),
          parts: [
            numPart('(1)', R`加速後の電子の速さ $v$`, s.vel, 'm/s'),
            numPart('(2)', R`電子の運動量の大きさ $p$`, s.p, 'kg·m/s'),
            numPart('(3)', R`電子の物質波の波長 $\lambda$`, s.lam * 1e9, 'nm')
          ],
          solution: [by('物質波（ド・ブロイ波）'), by('電圧で加速された粒子の速さ'), Object.assign({}, by('運動量'), { lv: 1 }), by('ド・ブロイ波長')]
        };
      }
      // basic: 速さから波長（電子・陽子・中性子。速さは非相対論の範囲）
      const kind = rng.pick(['electron', 'proton', 'neutron']);
      const vel = rng.pick({
        electron: [1.0e6, 1.5e6, 2.0e6, 2.5e6, 3.0e6, 4.0e6, 5.0e6, 6.0e6, 8.0e6, 1.0e7],
        proton: [1.0e4, 2.0e4, 3.0e4, 5.0e4, 8.0e4, 1.0e5, 2.0e5, 5.0e5, 1.0e6],
        neutron: [1.0e3, 2.0e3, 3.0e3, 4.0e3, 5.0e3]       // 熱中性子の速さ（約 2×10³ m/s）の前後
      }[kind]);
      const p = { mode: 'v', kind: kind, m: BEAMS[kind][1], v: vel, want: ['p', 'lam'] };
      const s = solveDB(p);
      const st = stepsDB(p, s), by = (t) => st.filter((x) => x.t === t)[0];
      return {
        title: BEAMS[kind][0] + 'の物質波',
        body: R`速さ $` + sf(vel) + R`\,\mathrm{m/s}$ で運動する` + BEAMS[kind][0] + R`（質量 $` + nice(BEAMS[kind][1]) + R`\,\mathrm{kg}$）について、` + consts(['h']) + R`次の問いに答えよ。`,
        fig: figScale(s.lam),
        parts: [
          numPart('(1)', R`運動量の大きさ $p$`, s.p, 'kg·m/s'),
          numPart('(2)', R`物質波の波長 $\lambda$`, s.lam, 'm')
        ],
        solution: [by('物質波（ド・ブロイ波）'), Object.assign({}, by('運動量'), { lv: 1 }), by('ド・ブロイ波長')]
      };
    }
  });

  // 結晶による回折の図（演習用）
  function figBragg(d, V) {
    const g = JK.plot.draw(380, 210);
    const th = 32 * Math.PI / 180, L = 84, y1 = 76, y2 = 122, y3 = 168, xa = 170;
    [y1, y2, y3].forEach((y) => {
      g.line(40, y, 320, y, { cls: 'fg', w: 1.2 });
      for (let x = 60; x <= 300; x += 40) g.dot(x, y, { cls: 'c3', r: 3.2 });
    });
    g.arrow(xa - L * Math.cos(th), y1 - L * Math.sin(th), xa, y1, { cls: 'c1', w: 2.2 });
    g.text(xa - L * Math.cos(th) + 8, y1 - L * Math.sin(th) - 8, '電子線', { size: 11, anchor: 'start' });
    g.arrow(xa, y1, xa + L * Math.cos(th), y1 - L * Math.sin(th), { cls: 'c2', w: 2.2 });
    g.angle(xa, y1, 40, 180 - 32, 180, 'θ', { cls: 'c3' });
    g.line(336, y1, 336, y2, { cls: 'dim', w: 1 });
    dimLine(g, 336, y1 + 1, 336, y2 - 1);
    g.text(344, (y1 + y2) / 2 + 4, 'd', { italic: true, anchor: 'start' });
    g.text(190, 198, '原子面の間隔 d = ' + tx(d) + ' nm ／ 電子の加速電圧 ' + tx(V) + ' V', { size: 11 });
    return g.svg();
  }
  // 両端に矢じりのある寸法線
  function dimLine(d, x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    d.arrow(mx, my, x1, y1, { cls: 'dim', w: 1.2 });
    d.arrow(mx, my, x2, y2, { cls: 'dim', w: 1.2 });
  }
})();
