/* 物理・原子 — 原子の構造と原子核: 水素原子のエネルギー準位 / ボーアの原子模型 / 放射性崩壊と半減期 / 質量欠損と結合エネルギー
   構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const sig = (x) => U.sig(x, 3);
  const fm = (x) => U.fmt(x, 5);     // 質量 [u]（小数 5 桁まで、末尾の 0 は除去）
  const un = (s) => R`\,\mathrm{` + s + '}';
  // 質量欠損 Δm の表示: 小数 4 桁でちょうど表せるとき（質量が小数 4 桁の問題）は 0.0052 のように小数のまま、そうでなければ有効数字 3 桁
  const dmTex = (x) => { const t = x.toFixed(4); return x !== 0 && Math.abs(Number(t) - x) <= 1e-9 * Math.abs(x) ? t : sig(x); };
  // 質量 [u]（小数 4 桁）どうしの和・差は、丸めずにちょうどの値を答えにする（解説にもその値を表示するため）
  const exact4 = (x) => Math.round(x * 1e4) / 1e4;
  // 答えの値は、解説に表示する有効数字 3 桁（sig）と必ず同じ丸めにする（12.75 のような境目の値で、解説と答えが 1 桁ずれないように）
  const ans = (x) => {
    const m = /^(-?\d+(?:\.\d+)?)(?: \\times 10\^\{(-?\d+)\})?$/.exec(sig(x));
    return m ? Number(m[1] + 'e' + (m[2] || 0)) : Number(x.toPrecision(3));
  };
  const H = 6.63e-34;      // プランク定数 [J·s]
  const C = 3.00e8;        // 光速 [m/s]
  const QE = 1.60e-19;     // 電気素量 [C]（1 eV = 1.60×10⁻¹⁹ J）
  const ME = 9.11e-31;     // 電子の質量 [kg]
  const KC = 9.0e9;        // クーロンの法則の比例定数 [N·m²/C²]
  const E1 = 13.6;         // 水素原子の基底状態のエネルギー（の大きさ）[eV]
  const HC = H * C / QE * 1e9;   // hc [eV·nm] = 1243 eV·nm
  const MPR = 1.0073, MNE = 1.0087;   // 陽子・中性子の質量 [u]
  const UMEV = 931.5;      // 1 u の質量に相当するエネルギー [MeV]
  const CONST_H = R`プランク定数を $h = 6.63 \times 10^{-34}\,\mathrm{J \cdot s}$、真空中の光速を $c = 3.00 \times 10^{8}\,\mathrm{m/s}$、電気素量を $e = 1.60 \times 10^{-19}\,\mathrm{C}$（$1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}$）とする。`;
  const SYM = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm'];
  const sym = (z) => SYM[z - 1] || ('Z' + z);
  // 核種の TeX: {}^{A}_{Z}X
  const iso = (A, Z) => R`{}^{` + A + R`}_{` + Z + R`}\mathrm{` + sym(Z) + '}';

  // 入力値の表示用: 有効数字 7 桁まで（入力した値をそのまま見せる。そうしないと、表示した値で計算し直したときに結果がずれる）、末尾の 0 は除去、極端に大小の値は指数表記
  function nice(x) {
    if (!isFinite(x) || x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12);
    if (e >= -3 && e <= 6) return String(Number(x.toPrecision(7)));
    let m = Number((x / Math.pow(10, e)).toPrecision(7)), ee = e;
    if (Math.abs(m) >= 10) { m /= 10; ee += 1; }
    return m + R` \times 10^{` + ee + '}';
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
  const supTxt = (n) => String(n).split('').map((c) => SUPS[c] || c).join('');
  const toPlain = (t) => t.replace(/ \\times 10\^\{(-?\d+)\}/, (m, e) => '×10' + supTxt(e));
  const tx = (x) => toPlain(sf(x));      // 図ラベル用プレーンテキスト（有効数字 2〜3 桁）
  const tx3 = (x) => toPlain(sig(x));    // 同（有効数字 3 桁）
  // 問題文に書く数値は有効数字 3 桁以内で正確に表せること（丸めると解答値とずれるため）
  const ok3 = (x) => Math.abs(Number(x.toPrecision(3)) - x) <= 1e-9 * Math.abs(x);
  // 指数表記の入力例。答えに近い値だと、そのまま正解になってしまう（採点は絶対許容 1e-12 もあるので、1e-12 前後の答えに近い）ため、離れた値の例に替える
  const EXP_EX = ['4.7e-12', '3.3e-7', '6.1e8'];
  function numPart(label, q, x, unit, o) {
    const a = ans(x), p = { label: label, q: q, type: 'num', answer: a, rel: 0.02, unit: unit }, ax = Math.abs(a);
    if (ax !== 0 && (ax < 1e-3 || ax >= 1e5)) {
      p.show = sig(a);
      const hintOf = (e) => '例: ' + e + ' や ' + e.replace('e', '*10^') + ' の形で入力';
      p.hint = hintOf(EXP_EX.find((e) => !JK.check.hintLeak(Object.assign({}, p, { hint: hintOf(e) })).length) || EXP_EX[2]);
    }
    return Object.assign(p, o || {});
  }
  // 画面上で反時計回りに角 a（ラジアン）が増える極座標
  const pol = (cx, cy, r, a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  // 電磁波の種類（波長 nm から）
  function bandOf(lamNm) {
    if (lamNm < 0.01) return 'γ線';
    if (lamNm < 10) return 'X線';
    if (lamNm < 400) return '紫外線';
    if (lamNm < 760) return '可視光';
    if (lamNm < 1e6) return '赤外線';
    return '電波に近い領域';
  }

  /* ---- 途中の値の表示（ガード桁）----
     解説の式に代入する途中の値は、表示した数値どうしで計算し直しても、結果の有効数字 3 桁が厳密な値の有効数字 3 桁と一致する桁数で見せる
     （3 桁で合えば 3 桁、合わなければ 4 桁、5 桁…）。答えそのもの（ans / sig）は有効数字 3 桁のまま */
  // 有効数字 d 桁の TeX（末尾の 0 は除く）。sig と同じ表記（指数が -2〜2 のときは小数、それ以外は a \times 10^{b}）
  function gtex(x, d) {
    if (x === 0) return '0';
    const r = U.roundSig(x, d), p = /^(-?\d(?:\.\d+)?)e([+-]\d+)$/.exec(r.toExponential(d - 1)), e = Number(p[2]);
    const trim = (t) => (t.indexOf('.') < 0 ? t : t.replace(/0+$/, '').replace(/\.$/, ''));
    return e >= -2 && e <= 2 ? trim(r.toFixed(Math.max(0, d - 1 - e))) : trim(p[1]) + R` \times 10^{` + e + '}';
  }
  // 途中の値 xs（厳密な値）を d 桁（d0 桁から順に増やす）に丸め、それを使う計算 f(…丸めた値, d) の結果（配列）の有効数字 3 桁が、
  // 厳密な結果 targets の有効数字 3 桁と一致する最初の d を探す。戻り値 { d, v: 丸めた値, t: その TeX, out: f の結果 }
  function guard(f, xs, targets, d0) {
    let v, out;
    for (let d = d0 || 3; d <= 9; d++) {
      v = xs.map((x) => U.roundSig(x, d));
      out = f.apply(null, v.concat([d]));
      if (out.every((y, i) => ans(y) === ans(targets[i]))) return { d: d, v: v, t: v.map((x) => gtex(x, d)), out: out };
    }
    return { d: 9, v: v, t: v.map((x) => gtex(x, 9)), out: out };
  }
  // 途中の値（d 桁）と答えとして見せる有効数字 3 桁: 同じ値なら 1 つだけ、違えば「d 桁 ≒ 3 桁」
  const both = (x, d) => (U.roundSig(x, d) === U.roundSig(x, 3) ? sig(x) : gtex(x, d) + R` \approx ` + sig(x));
  // 途中の値（数値を並べて渡す）を有効数字 3 桁より多く見せるとき（3 桁に丸めると値が変わるものがあるとき）に添える一文
  const careful = function () { return Array.prototype.some.call(arguments, (v) => v !== U.roundSig(v, 3)) ? '途中の値は桁を多めに残して計算し、最後に有効数字 3 桁に丸めます。' : ''; };

  /* =====================================================================
     1. 水素原子のエネルギー準位と光の放出・吸収
     ===================================================================== */

  const SERIES = { 1: 'ライマン系列', 2: 'バルマー系列', 3: 'パッシェン系列', 4: 'ブラケット系列', 5: 'プント系列', 6: 'ハンフリーズ系列' };

  function solveH(n, m) {
    const En = -E1 / (n * n), Em = -E1 / (m * m);
    const dE = Math.abs(En - Em), lo = Math.min(n, m), hi = Math.max(n, m);
    const lam = HC / dE;
    return {
      En: En, Em: Em, dE: dE, lam: lam, nu: dE * QE / H, J: dE * QE, lo: lo, hi: hi, emit: n > m,
      lamR: 1e9 / (1.097e7 * (1 / (lo * lo) - 1 / (hi * hi))), Eion: E1 / (n * n)
    };
  }

  // エネルギー準位図（線形目盛）。遷移の矢印（前 → 後。吸収は上向き）と、右側にずらして並べた準位ラベル
  // o.noE: 準位ラベルに量子数だけを書く（エネルギーを問う設問で、答えが図に出ないように）／ o.arrows: 描く遷移 [[前, 後, 破線か], …]（Infinity は n = ∞）
  // ／ o.mark: 矢印がなくても強調する準位 ／ o.caption: 図の下の説明
  function figLevels(n, m, s, hide, o) {
    o = o || {};
    const d = JK.plot.draw(380, 262);
    const top = 30, bot = 226, x0 = 36, x1 = 176;
    const Y = (E) => top + (-E / E1) * (bot - top);
    const Ek = (k) => (k === Infinity ? 0 : -E1 / (k * k));
    const arrows = o.arrows || [[n, m]];
    const on = {};
    arrows.forEach((a) => { on[a[0]] = true; on[a[1]] = true; });
    (o.mark || []).forEach((k) => { on[k] = true; });
    const N = Math.max.apply(null, [6, o.arrows ? 0 : Math.max(n, m)].concat(arrows.map((a) => Math.max(isFinite(a[0]) ? a[0] : 0, isFinite(a[1]) ? a[1] : 0))));
    d.line(x0, top, x1, top, { cls: on[Infinity] ? 'c1' : 'dim', dash: true, w: 1.2 });
    const labs = [{ y: top, t: 'n = ∞　0 eV', cls: 'dim' }];
    const picks = [];
    for (let k = N; k >= 1; k--) {
      const E = Ek(k), y = Y(E), hl = !!on[k];
      d.line(x0, y, x1, y, { cls: hl ? 'c1' : 'fg', w: hl ? 2.6 : 1.5 });
      if (k <= 6 || hl) picks.push({ k: k, y: y, E: E, on: hl });
    }
    let last = top;
    picks.forEach((q) => {
      const yl = Math.max(q.y, last + 13);
      d.line(x1, q.y, x1 + 12, yl, { cls: 'dim', w: 0.8 });
      d.text(x1 + 16, yl + 4, 'n = ' + q.k + (o.noE ? '' : '　' + tx3(q.E) + ' eV'), { anchor: 'start', size: 11, cls: q.on ? 'c1' : 'fg' });
      last = yl;
    });
    d.text(x1 + 16, top + 4, labs[0].t, { anchor: 'start', size: 11, cls: 'dim' });
    // 遷移の矢印
    const xa = arrows.length === 1 ? [106] : arrows.map((a, i) => 56 + i * 100 / (arrows.length - 1));
    arrows.forEach((a, i) => {
      const y0 = Y(Ek(a[0])), y1 = Y(Ek(a[1]));
      d.arrow(xa[i], y0, xa[i], y1, { cls: y1 > y0 ? 'c2' : 'c3', w: 2.6, dash: !!a[2] });
    });
    if (!hide && arrows.length === 1) {
      // 矢印が長ければその中ほど、短ければ n = 1 と n = 2 のあいだの空いたところに書く
      const yn = Y(Ek(n)), ym = Y(Ek(m)), long = Math.abs(yn - ym) >= 70;
      const ty = long ? (yn + ym) / 2 : (Y(-E1) + Y(-E1 / 4)) / 2 - 6;
      d.text(xa[0] + 8, ty + 4, (s.lam < 1e4 ? 'λ = ' + tx3(s.lam) + ' nm' : 'λ = ' + tx3(s.lam / 1000) + ' μm'), { anchor: 'start', size: 11, cls: n > m ? 'c2' : 'c3' });
      d.text(xa[0] + 8, ty + 19, 'ΔE = ' + tx3(s.dE) + ' eV', { anchor: 'start', size: 11, cls: 'dim' });
    }
    d.text(190, 252, o.caption != null ? o.caption : (n > m ? '光子を放出（' : '光子を吸収（') + (SERIES[Math.min(n, m)] || 'n = ' + Math.min(n, m) + ' への系列') + '）', { size: 11, cls: 'dim' });
    return d.svg();
  }

  // 1/lo² − 1/hi² = a/b（既約分数）の [a, b]
  function fracLH(lo, hi) {
    const a = hi * hi - lo * lo, b = lo * lo * hi * hi, g = U.gcd(a, b);
    return [a / g, b / g];
  }
  // 振動数条件 hν = E_hi − E_lo = 13.6 Z²(1/lo² − 1/hi²) の式（数値を代入した 2 行）。入力は、問題文の 13.6 と量子数（と Z）だけ。eV の値は d 桁（途中の値）と 3 桁（答え）で見せる
  function lineDE(lo, hi, dE, d, Z) {
    const fr = fracLH(lo, hi), c = Z > 1 ? R`13.6 \times ` + Z + R`^{2}` : '13.6';
    return [R`h\nu = E_{` + hi + R`} - E_{` + lo + R`} = -\frac{` + c + '}{' + hi + R`^{2}} - \left(-\frac{` + c + '}{' + lo + R`^{2}}\right) = ` + c + R` \times \left(\frac{1}{` + lo + R`^{2}} - \frac{1}{` + hi + R`^{2}}\right)`,
      R`h\nu = ` + c + R` \times \frac{` + fr[0] + '}{' + fr[1] + '} = ' + both(dE, d) + un('eV')];
  }
  // 光子のエネルギー dE [eV] を J に直し、振動数・波長を求める計算の途中の値（dE と J）の桁数。
  // 4 桁から順に増やし、有効数字 3 桁の J・振動数・波長がすべて厳密な値と一致する最初の d。戻り値 { d, e: d 桁の dE, j: e から求めた d 桁の J }
  function chainPhoton(dE) {
    const J = dE * QE, nu = J / H, lam = HC / dE;
    let e, j;
    for (let d = 4; d <= 9; d++) {
      e = U.roundSig(dE, d); j = U.roundSig(e * QE, d);
      if (ans(e) === ans(dE) && ans(j) === ans(J) && ans(j / H) === ans(nu) && ans(H * C / j * 1e9) === ans(lam)) return { d: d, e: e, j: j };
    }
    return { d: 9, e: e, j: j };
  }
  // 波長 [nm] を、光子のエネルギー dE [eV] から求める行（定数 h, c, e をそのまま代入）。dE は d 桁（途中の値）。戻り値は TeX の文字列
  function lineLam(dE, d, lamNm) {
    return R`\lambda = \frac{hc}{h\nu} = \frac{6.63 \times 10^{-34} \times 3.00 \times 10^{8}}{` + gtex(dE, d) + R` \times 1.60 \times 10^{-19}} = ` + sig(lamNm * 1e-9) + un('m') + R` = ` + sig(lamNm) + un('nm');
  }

  function stepsH(n, m, s) {
    const steps = [];
    const ch = chainPhoton(s.dE), eG = gtex(ch.e, ch.d), jG = gtex(ch.j, ch.d);
    steps.push({
      t: '水素原子のエネルギー準位',
      m: [R`E_{n} = -\frac{13.6}{n^{2}}\ \mathrm{eV}\qquad (n = 1, 2, 3, \cdots)`],
      n: R`水素原子の電子がとれるエネルギーは、とびとびの値だけです（**エネルギーの量子化**）。$n$ を**量子数**といい、$n = 1$ が最もエネルギーの低い**基底状態**、$n \ge 2$ が**励起状態**です。負の値なのは、電子が原子核に束縛されていて、核から無限に遠く離れて静止した状態（$n = \infty$）をエネルギーの基準 $0$ としているからです。`,
      easy: R`電子のエネルギーは、階段の段のように、決まった高さのところしかとれません。いちばん下の段（$n = 1$）が $-13.6\,\mathrm{eV}$、上の段ほど $0$ に近づき、$n = \infty$ で $0$ になります。$0$ は「電子が原子から完全に離れた」状態です。マイナスなのは「原子に捕まっている」から、と考えてください。`,
      pro: R`$E_{n} = -\dfrac{13.6}{n^{2}}\,\mathrm{eV}$ は暗記します。主な値: $E_{1} = -13.6$、$E_{2} = -3.40$、$E_{3} = -1.51$、$E_{4} = -0.85\,\mathrm{eV}$。`
    });
    steps.push({
      t: '遷移の前後のエネルギー',
      m: [R`E_{` + n + R`} = -\frac{13.6}{` + n + R`^{2}} = ` + sig(s.En) + un('eV'), R`E_{` + m + R`} = -\frac{13.6}{` + m + R`^{2}} = ` + sig(s.Em) + un('eV')],
      n: R`電子が量子数 $n = ` + n + R`$ の状態から $m = ` + m + R`$ の状態へ移ります（**遷移**）。それぞれのエネルギーを求めます。`,
      easy: R`まず、移る前の段の高さと、移ったあとの段の高さを計算します。どちらも $-\dfrac{13.6}{n^{2}}$ に量子数を入れるだけです。`
    });
    steps.push({
      t: s.emit ? '放出される光子のエネルギー（振動数条件）' : '吸収される光子のエネルギー（振動数条件）',
      m: lineDE(s.lo, s.hi, s.dE, ch.d),
      n: (s.emit ? R`電子がエネルギーの高い状態から低い状態へ移るとき、エネルギーの差がちょうど 1 個の光子として放出されます。これを**ボーアの振動数条件** $h\nu = E_{n} - E_{m}$ といいます。` : R`電子がエネルギーの低い状態から高い状態へ移るには、エネルギーの差にちょうど等しい光子を**吸収**します。光子のエネルギーがこの差と一致しなければ、吸収されません。`) + R`$E_{n} = -\dfrac{13.6}{n^{2}}$ を代入して、$13.6$ をくくり出すと計算しやすくなります。`,
      easy: s.emit ? R`電子が上の段から下の段へ降りるとき、高さの差のぶんのエネルギーが余ります。その余ったぶんが光（光子）として外へ出ていきます。出る光子のエネルギーは、段の高さの差にぴったり等しくなります。` : R`電子が下の段から上の段へ上がるには、段の高さの差にぴったり等しいエネルギーが必要です。だから、光子のエネルギーが高さの差とちょうど等しい光だけが吸収されます。多すぎても少なすぎても、電子は上がりません。`,
      pro: R`$E_{n}$ が負の値であることに注意して、差は「大きい方から小さい方を引く」と絶対値の符号ミスを防げます。低い準位の量子数を $p$、高い準位の量子数を $q$ として、$13.6\left(\dfrac{1}{p^{2}} - \dfrac{1}{q^{2}}\right)$ と 1 回の計算で求められます。`
    });
    steps.push({
      t: '光の振動数と波長',
      m: [R`h\nu = ` + eG + un('eV') + R` = ` + eG + R` \times 1.60 \times 10^{-19} = ` + both(ch.j, ch.d) + un('J'),
        R`\nu = \frac{h\nu}{h} = \frac{` + jG + R`}{6.63 \times 10^{-34}} = ` + sig(s.nu) + un('Hz'),
        R`\lambda = \frac{c}{\nu} = \frac{hc}{h\nu} = \frac{6.63 \times 10^{-34} \times 3.00 \times 10^{8}}{` + jG + '} = ' + sig(s.lam * 1e-9) + un('m') + R` = ` + sig(s.lam) + un('nm')],
      n: R`光子のエネルギー $h\nu$ を $\mathrm{J}$ に直し（$1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}$）、振動数 $\nu = \dfrac{h\nu}{h}$ と波長 $\lambda = \dfrac{c}{\nu}$ を求めます。` + careful(ch.e, ch.j) + R`この光は` + bandOf(s.lam) + R`にあたります。`,
      easy: R`光子のエネルギーが分かれば、波長が決まります。エネルギーが大きいほど波長は短くなります。計算では $\mathrm{J}$ に直したエネルギーを使うことに注意しましょう。`,
      pro: R`$hc \approx 1240\,\mathrm{eV \cdot nm}$（この問題の定数からは $1243\,\mathrm{eV \cdot nm}$）を覚えておくと、$\lambda[\mathrm{nm}] \approx \dfrac{1240}{\Delta E[\mathrm{eV}]}$ と暗算できます。`
    });
    steps.push({
      t: '系列と電磁波の種類',
      n: R`同じ量子数の状態（$n = ` + s.lo + R`$）への遷移（または、そこからの遷移）による光をまとめて「**` + (SERIES[s.lo] || R`量子数 ` + s.lo + R` への系列`) + R`**」とよびます。ライマン系列（$n = 1$）は紫外線、バルマー系列（$n = 2$）は可視光（一部紫外線）、パッシェン系列（$n = 3$）は赤外線にあたります。`,
      easy: R`光を出す（吸収する）電子の「いちばん下の段」の番号で、系列に名前がついています。1 番下の段ならライマン（紫外線）、2 番ならバルマー（可視光）、3 番ならパッシェン（赤外線）です。下の段ほどエネルギーの差が大きいので、波長の短い光になります。`,
      lv: 2
    });
    const frR = fracLH(s.lo, s.hi), invR = 1.097e7 * frR[0] / frR[1], gR = guard((x) => [1e9 / x], [invR], [s.lamR], 4);
    steps.push({
      t: 'リュードベリの式で確かめる',
      m: [R`\frac{1}{\lambda} = R_{\infty}\left(\frac{1}{` + s.lo + R`^{2}} - \frac{1}{` + s.hi + R`^{2}}\right),\quad R_{\infty} = 1.097 \times 10^{7}\,\mathrm{/m}`,
        R`\frac{1}{\lambda} = 1.097 \times 10^{7} \times \frac{` + frR[0] + '}{' + frR[1] + '} = ' + gR.t[0] + R`\,\mathrm{/m}`,
        R`\lambda = \frac{1}{` + gR.t[0] + '} = ' + sig(s.lamR * 1e-9) + un('m') + R` = ` + sig(s.lamR) + un('nm')],
      n: R`水素原子のスペクトル線の波長は、リュードベリの式でも求まります（実験で得られた式です。$R_{\infty}$ をリュードベリ定数といいます）。ボーアのエネルギー準位から求めた値と、ほぼ一致します（定数の丸めのため、最後の桁が少しずれることがあります）。`,
      easy: R`バルマーは、水素の光を分けたときの波長がきれいな式で表せることを、先に見つけていました。ボーアの理論は、その式がなぜ成り立つのかを、電子の「とびとびのエネルギー」で説明したのです。`,
      lv: 3
    });
    steps.push({
      t: 'イオン化エネルギー',
      m: [R`E_{ion} = 0 - E_{` + n + R`} = \frac{13.6}{` + n + R`^{2}} = ` + sig(s.Eion) + un('eV')],
      n: R`電子を $n = ` + n + R`$ の状態から原子の外へ出す（$E = 0$ にする、電離させる）のに必要な最小のエネルギーです。基底状態（$n = 1$）では $13.6\,\mathrm{eV}$ です。`,
      easy: R`電子を原子から完全に引き離すには、$0$ の高さまで引き上げるエネルギーが必要です。段の高さが $-3.4\,\mathrm{eV}$ なら $3.4\,\mathrm{eV}$ のエネルギーを与えればよいことになります。`,
      lv: 2
    });
    return steps;
  }

  /* ---- 水素原子の演習（basic / mid）: 場面を変え、準位の組と問う量を変える ---- */
  const H_LEVELS = R`水素原子のエネルギー準位は $E_{n} = -\dfrac{13.6}{n^{2}}\,\mathrm{eV}$（$n = 1, 2, 3, \cdots$）で表される。`;
  const ASK = R`次の問いに答えよ。`;
  const SIGNED = R`（$\mathrm{eV}$ で、符号をつけて）`;
  const RYD_R = R`リュードベリ定数を $R = 1.097 \times 10^{7}\,\mathrm{/m}$`;
  const H_EMIT = [[2, 1], [3, 1], [3, 2], [4, 1], [4, 2], [4, 3], [5, 1], [5, 2], [5, 3], [5, 4], [6, 1], [6, 2]];      // 放出: [前, 後]（前 > 後）
  const H_ABS = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5]];                              // 吸収: [前, 後]（前 < 後）
  const H_STEP = [[3, 2], [4, 2], [4, 3], [5, 2], [5, 3], [5, 4]];                                                      // 2 段階の遷移 [k, j]: n = k から n = j を経て n = 1 へ
  const H_REV = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [2, 6], [3, 4], [3, 5], [3, 6]];              // 波長から遷移を調べる [低い準位, 高い準位]
  const H_RYD = [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [2, 5], [2, 6], [3, 4], [3, 5]];                              // リュードベリの式 [m, n]
  const stateOf = (k) => (k === 1 ? R`基底状態（$n = 1$）` : R`$n = ` + k + R`$ の励起状態`);
  // 波長の行の終わり: λ[m]（d 桁）と、答えとして見せる λ[nm]（有効数字 3 桁）
  const lamEnd = (lamD, d, lamNm) => (U.roundSig(lamD, 3) === lamD ? sig(lamD) + un('m') + ' = ' : gtex(lamD, d) + un('m') + R` \approx `) + sig(lamNm) + un('nm');
  const levelStep = () => stepsH(2, 1, solveH(2, 1))[0];       // 「水素原子のエネルギー準位」の公式のステップ

  const HYD_BASIC = [
    // 遷移で放出される光子: E_n, E_m, hν
    (rng) => {
      const pr = rng.pick(H_EMIT), n = pr[0], m = pr[1], s = solveH(n, m);
      return {
        title: '水素原子の遷移で放出される光子',
        body: H_LEVELS + R`電子が $n = ` + n + R`$ の状態から $n = ` + m + R`$ の状態へ移るとき、光を放出した。` + ASK,
        fig: figLevels(n, m, s, true, { noE: true }),
        parts: [
          numPart('(1)', R`$n = ` + n + R`$ の状態のエネルギー $E_{` + n + R`}$` + SIGNED, s.En, 'eV'),
          numPart('(2)', R`$n = ` + m + R`$ の状態のエネルギー $E_{` + m + R`}$` + SIGNED, s.Em, 'eV'),
          numPart('(3)', R`放出された光子のエネルギー（$\mathrm{eV}$ で）`, s.dE, 'eV')
        ],
        solution: stepsH(n, m, s).slice(0, 3)
      };
    },
    // 光子を吸収して上の準位へ: E_前, E_後, hν
    (rng) => {
      const pr = rng.pick(H_ABS), lo = pr[0], hi = pr[1], s = solveH(lo, hi);
      return {
        title: '水素原子が光子を吸収するとき',
        body: H_LEVELS + stateOf(lo) + R`の水素原子が、光子を 1 個吸収して、電子が $n = ` + hi + R`$ の状態へ移った。` + ASK,
        fig: figLevels(lo, hi, s, true, { noE: true }),
        parts: [
          numPart('(1)', R`吸収する前の $n = ` + lo + R`$ の状態のエネルギー $E_{` + lo + R`}$` + SIGNED, s.En, 'eV'),
          numPart('(2)', R`吸収した後の $n = ` + hi + R`$ の状態のエネルギー $E_{` + hi + R`}$` + SIGNED, s.Em, 'eV'),
          numPart('(3)', R`吸収された光子のエネルギー（$\mathrm{eV}$ で）`, s.dE, 'eV')
        ],
        solution: stepsH(lo, hi, s).slice(0, 3)
      };
    },
    // 電離と励起: E_k, イオン化エネルギー, 基底状態からの励起エネルギー
    (rng) => {
      const k = rng.pick([2, 3, 4, 5, 6]), s = solveH(k, 1);
      return {
        title: '水素原子の電離と励起',
        body: H_LEVELS + R`水素原子の電子が $n = ` + k + R`$ の励起状態にある。` + ASK,
        fig: figLevels(k, 1, s, true, { noE: true, arrows: [[k, Infinity], [1, k, true]], caption: '電離（n = ' + k + ' → ∞）と、基底状態からの励起（破線）' }),
        parts: [
          numPart('(1)', R`$n = ` + k + R`$ の状態のエネルギー $E_{` + k + R`}$` + SIGNED, s.En, 'eV'),
          numPart('(2)', R`この電子を原子の外へ取り去る（電離させる）のに必要な最小のエネルギー（$\mathrm{eV}$ で）`, s.Eion, 'eV'),
          numPart('(3)', R`基底状態（$n = 1$）の電子を、$n = ` + k + R`$ の状態へ励起するのに必要なエネルギー（$\mathrm{eV}$ で）`, s.dE, 'eV')
        ],
        solution: [
          levelStep(),
          {
            t: R`$n = ` + k + R`$ の状態のエネルギー`,
            m: [R`E_{` + k + R`} = -\frac{13.6}{` + k + R`^{2}} = ` + sig(s.En) + un('eV')],
            n: R`エネルギー準位の式 $E_{n} = -\dfrac{13.6}{n^{2}}$ に、$n = ` + k + R`$ を代入します。`,
            easy: R`$-\dfrac{13.6}{n^{2}}$ の $n$ のところに ` + k + R` を入れて計算するだけです。$n$ が大きい段ほど、$0$ に近い値になります。`
          },
          {
            t: '電離に必要な最小のエネルギー（イオン化エネルギー）',
            m: [R`E_{ion} = 0 - E_{` + k + R`} = \frac{13.6}{` + k + R`^{2}} = ` + sig(s.Eion) + un('eV')],
            n: R`電子を原子の外へ取り去る（電離させる）とは、電子を原子核から無限に遠く離れて静止した状態（$n = \infty$、エネルギー $0$）にすることです。そのために必要な最小のエネルギーは、$0$ から $E_{` + k + R`}$ を引いた値、つまり $E_{` + k + R`}$ の符号を変えた値です。`,
            easy: R`電子は今、$E_{` + k + R`}$ の高さの段にいます。原子の外（高さ $0$）まで引き上げるのに必要なエネルギーは、「$0$ から今の高さを引いた」値、つまり符号を変えた値です。`,
            pro: R`イオン化エネルギーは $\dfrac{13.6}{n^{2}}\,\mathrm{eV}$。基底状態では $13.6\,\mathrm{eV}$ で、上の段ほど小さくなります。`
          },
          {
            t: R`基底状態から $n = ` + k + R`$ の状態へ励起するのに必要なエネルギー`,
            m: lineDE(1, k, s.dE, 4),
            n: R`基底状態（$n = 1$）の電子を $n = ` + k + R`$ の状態へ上げるには、2 つの準位のエネルギーの差にちょうど等しいエネルギーを与えます。$E_{n} = -\dfrac{13.6}{n^{2}}$ を代入して、$13.6$ をくくり出すと計算しやすくなります。`,
            easy: R`$n = 1$ の段から $n = ` + k + R`$ の段まで上がるのに必要なのは、2 つの段の高さの差です。「上の段の高さ $-$ 下の段の高さ」で求めます。`,
            pro: R`基底状態から励起するのに必要なエネルギーは、$13.6\left(1 - \dfrac{1}{n^{2}}\right)$ です。`
          }
        ]
      };
    },
    // 2 段階の遷移: 各段階の光子のエネルギーと、その和（直接遷移と等しい）
    (rng) => {
      const pr = rng.pick(H_STEP), k = pr[0], j = pr[1], sa = solveH(k, j), sb = solveH(j, 1), sc = solveH(k, 1);
      const g = guard((a, b) => [a + b], [sa.dE, sb.dE], [sc.dE], 4);
      return {
        title: '2 段階の遷移で放出される光子',
        body: H_LEVELS + R`電子が $n = ` + k + R`$ の状態から、$n = ` + j + R`$ の状態を経て、$n = 1$ の状態へ 2 段階で移った。それぞれの遷移で、光子が 1 個ずつ放出された。` + ASK,
        fig: figLevels(k, 1, sc, true, { noE: true, arrows: [[k, j], [j, 1]], caption: '2 段階の遷移（n = ' + k + ' → ' + j + ' → 1）' }),
        parts: [
          numPart('(1)', R`$n = ` + k + R`$ から $n = ` + j + R`$ へ移るときに放出された光子のエネルギー（$\mathrm{eV}$ で）`, sa.dE, 'eV'),
          numPart('(2)', R`$n = ` + j + R`$ から $n = 1$ へ移るときに放出された光子のエネルギー（$\mathrm{eV}$ で）`, sb.dE, 'eV'),
          numPart('(3)', R`放出された 2 個の光子のエネルギーの和（$\mathrm{eV}$ で）`, sc.dE, 'eV')
        ],
        solution: [
          levelStep(),
          {
            t: R`$n = ` + k + R`$ から $n = ` + j + R`$ へ移るときの光子`,
            m: lineDE(j, k, sa.dE, g.d),
            n: R`電子がエネルギーの高い状態から低い状態へ移るとき、エネルギーの差がちょうど 1 個の光子として放出されます（**ボーアの振動数条件**）。1 回目の遷移（$n = ` + k + R`$ から $n = ` + j + R`$）の光子のエネルギーを求めます。$E_{n} = -\dfrac{13.6}{n^{2}}$ を代入して、$13.6$ をくくり出すと計算しやすくなります。`,
            easy: R`上の段（$n = ` + k + R`$）から、途中の段（$n = ` + j + R`$）へ降りるときに出る光のエネルギーを求めます。段の高さの差が、そのまま光のエネルギーです。`
          },
          {
            t: R`$n = ` + j + R`$ から $n = 1$ へ移るときの光子`,
            m: lineDE(1, j, sb.dE, g.d),
            n: R`2 回目の遷移（$n = ` + j + R`$ から $n = 1$）も同じように、準位の差から光子のエネルギーを求めます。`,
            easy: R`途中の段（$n = ` + j + R`$）から、いちばん下の段（$n = 1$）へ降りるときも、段の高さの差が、そのまま光のエネルギーです。`
          },
          {
            t: '2 個の光子のエネルギーの和',
            m: [R`h\nu_{1} + h\nu_{2} = (E_{` + k + R`} - E_{` + j + R`}) + (E_{` + j + R`} - E_{1}) = E_{` + k + R`} - E_{1}`,
              R`h\nu_{1} + h\nu_{2} = ` + g.t[0] + ' + ' + g.t[1] + ' = ' + both(g.out[0], g.d) + un('eV')],
            n: R`2 個の光子のエネルギーの和は、途中の準位のエネルギー $E_{` + j + R`}$ が打ち消しあって、$E_{` + k + R`} - E_{1}$ になります。これは、$n = ` + k + R`$ から $n = 1$ へ直接移るときに放出される光子 1 個のエネルギーと等しくなります（エネルギー保存）。`,
            easy: R`「$n = ` + k + R`$ から $n = ` + j + R`$ へ降りて、さらに $n = 1$ へ降りる」ときの高さの差を足すと、「$n = ` + k + R`$ から $n = 1$ へいっきに降りる」ときの高さの差と同じです。階段を 2 回に分けて降りても、降りた高さの合計は変わらないのと同じです。`,
            pro: R`$\Delta E_{` + k + R` \to 1} = \Delta E_{` + k + R` \to ` + j + R`} + \Delta E_{` + j + R` \to 1}$ は、検算にも使えます。`
          }
        ]
      };
    }
  ];

  const HYD_MID = [
    // 遷移で放出（吸収）される光の、エネルギー・波長・振動数。問う量は 3 通りの組から
    (rng) => {
      const emit = rng.bool(0.6), pr = emit ? rng.pick(H_EMIT) : rng.pick(H_ABS), n = pr[0], m = pr[1], s = solveH(n, m);
      const Q = {
        dE: [(emit ? R`放出された` : R`吸収された`) + R`光子のエネルギー（$\mathrm{eV}$ で）`, s.dE, 'eV'],
        J: [R`この光子のエネルギーを $\mathrm{J}$ で表した値`, s.J, 'J'],
        lam: [R`この光の波長 $\lambda$`, s.lam, 'nm'],
        nu: [R`この光の振動数 $\nu$`, s.nu, 'Hz']
      };
      return {
        title: emit ? '水素原子から出る光の波長' : '水素原子が吸収する光の波長',
        body: H_LEVELS + (emit ? R`電子が $n = ` + n + R`$ の状態から $n = ` + m + R`$ の状態へ移るとき、光を放出した。` : R`水素原子が光子を 1 個吸収して、電子が $n = ` + n + R`$ の状態から $n = ` + m + R`$ の状態へ移った。`) + CONST_H + ASK,
        fig: figLevels(n, m, s, true),
        parts: rng.pick([['dE', 'nu', 'lam'], ['dE', 'J', 'lam'], ['J', 'nu', 'lam']]).map((key, i) => numPart('(' + (i + 1) + ')', Q[key][0], Q[key][1], Q[key][2])),
        solution: stepsH(n, m, s).slice(0, 4)
      };
    },
    // 光の波長から、遷移前（吸収後）の準位の量子数を調べる
    (rng) => {
      const pr = rng.pick(H_REV), lo = pr[0], hi = pr[1], emit = rng.bool(0.5), s = solveH(lo, hi);
      const lamNm = U.roundSig(s.lam, 3), lamM = Number(lamNm + 'e-9');      // 問題文に与える波長（有効数字 3 桁）
      const hv = H * C / (lamM * QE), Elo = -E1 / (lo * lo), Ehi = Elo + hv, nF = Math.sqrt(E1 / -Ehi), nAns = Math.round(nF);
      // 表示した値（hν と E_lo を d 桁）から、E_hi（d 桁）と n を計算し直しても、厳密な値と有効数字 3 桁で一致する d
      const g = guard((h, e, d) => { const eh = U.roundSig(e + h, d); return [h, eh, Math.sqrt(E1 / -eh)]; }, [hv, Elo], [hv, Ehi, nF], 3);
      const EloT = g.t[1], hvT = g.t[0], EhiD = g.out[1];
      return {
        title: emit ? '放出した光の波長と遷移前の準位' : '吸収した光の波長と励起後の準位',
        body: H_LEVELS + (emit ? R`水素原子が光子を 1 個放出して、電子が高い準位から $n = ` + lo + R`$ の状態へ移った。放出された光の波長は $\lambda = ` + sig(lamM) + R`\,\mathrm{m}$ であった。`
          : stateOf(lo) + R`の水素原子が、波長 $\lambda = ` + sig(lamM) + R`\,\mathrm{m}$ の光子を 1 個吸収して、より高い準位へ移った。`) + CONST_H + ASK,
        fig: figLevels(lo, hi, s, true, { noE: true, arrows: [], mark: [lo], caption: emit ? '光子を放出して n = ' + lo + ' の状態へ' : 'n = ' + lo + ' の状態から光子を吸収' }),
        parts: [
          numPart('(1)', (emit ? R`放出された` : R`吸収された`) + R`光子のエネルギー（$\mathrm{eV}$ で）`, hv, 'eV'),
          numPart('(2)', (emit ? R`遷移する前の状態のエネルギー` : R`吸収した後の状態のエネルギー`) + SIGNED, Ehi, 'eV'),
          numPart('(3)', (emit ? R`遷移する前の状態の量子数 $n$` : R`吸収した後の状態の量子数 $n$`), nAns, '')
        ],
        solution: [
          levelStep(),
          {
            t: '光子のエネルギー',
            m: [R`h\nu = \frac{hc}{\lambda} = \frac{6.63 \times 10^{-34} \times 3.00 \times 10^{8}}{` + sig(lamM) + R` \times 1.60 \times 10^{-19}} = ` + both(hv, g.d) + un('eV')],
            n: R`光子 1 個のエネルギーは $h\nu = \dfrac{hc}{\lambda}$ です。$\mathrm{J}$ で求めた値を $1.60 \times 10^{-19}$ で割ると $\mathrm{eV}$ になるので、はじめから分母に $1.60 \times 10^{-19}$ を掛けて、$\mathrm{eV}$ で求めます。` + careful(g.v[0], g.v[1], g.out[1]),
            easy: R`光の波長が分かっているので、光子のエネルギーは $h\nu = \dfrac{hc}{\lambda}$ で求まります。波長が短いほど、エネルギーは大きくなります。$\mathrm{J}$ を $\mathrm{eV}$ に直すには、$1.60 \times 10^{-19}$ で割ります。`,
            pro: R`$hc \approx 1240\,\mathrm{eV \cdot nm}$ を使うと、$h\nu \approx \dfrac{1240}{\lambda[\mathrm{nm}]}$ と暗算できます。`
          },
          {
            t: emit ? '遷移する前の状態のエネルギー' : '吸収した後の状態のエネルギー',
            m: [R`E_{` + lo + R`} = -\frac{13.6}{` + lo + R`^{2}} = ` + EloT + un('eV'),
              R`E_{n} = E_{` + lo + R`} + h\nu = (` + EloT + ') + ' + hvT + ' = ' + both(EhiD, g.d) + un('eV')],
            n: emit ? R`光子を放出すると、電子のエネルギーは光子のエネルギーのぶんだけ下がります。だから、遷移する前の状態のエネルギー $E_{n}$ は、遷移した後の $E_{` + lo + R`}$ に、光子のエネルギーを足した値です。`
              : R`光子を吸収すると、電子のエネルギーは光子のエネルギーのぶんだけ上がります。だから、吸収した後の状態のエネルギー $E_{n}$ は、吸収する前の $E_{` + lo + R`}$ に、光子のエネルギーを足した値です。`,
            easy: emit ? R`電子が上の段から $n = ` + lo + R`$ の段へ降りて、その高さの差が光になりました。だから、もとの段の高さは、$n = ` + lo + R`$ の段の高さに、光のエネルギーを足した値です。`
              : R`電子が $n = ` + lo + R`$ の段から、光のエネルギーのぶんだけ上へ上がりました。だから、上がった先の段の高さは、$n = ` + lo + R`$ の段の高さに、光のエネルギーを足した値です。`
          },
          {
            t: '量子数',
            m: [R`E_{n} = -\frac{13.6}{n^{2}} \;\Rightarrow\; n = \sqrt{\frac{13.6}{|E_{n}|}} = \sqrt{\frac{13.6}{` + gtex(-EhiD, g.d) + '}} = ' + sig(nF) + R` \approx ` + nAns],
            n: R`$E_{n} = -\dfrac{13.6}{n^{2}}$ を $n$ について解きます。量子数は整数なので、求めた値に最も近い整数が答えです（波長の値を有効数字 3 桁で与えているので、ぴったりの整数にはなりません）。`,
            easy: R`段の高さが $-\dfrac{13.6}{n^{2}}$ なので、高さが分かれば、$n$ が逆算できます。$n$ は整数（$1, 2, 3, \cdots$）なので、いちばん近い整数を選びます。`,
            pro: R`$|E_{n}| = \dfrac{13.6}{n^{2}}$ より $n = \sqrt{\dfrac{13.6}{|E_{n}|}}$。「近い整数」を答えにします。`
          }
        ]
      };
    },
    // リュードベリの式: 1/λ, λ, 振動数（または光子のエネルギー）
    (rng) => {
      const pr = rng.pick(H_RYD), lo = pr[0], hi = pr[1], third = rng.pick(['nu', 'E']), fr = fracLH(lo, hi);
      const inv = 1.097e7 * fr[0] / fr[1], lamM = 1 / inv, lamNm = lamM * 1e9, nu = C / lamM, Eev = H * C / (lamM * QE), x3 = third === 'nu' ? nu : Eev;
      // 表示した値（1/λ と λ を d 桁）から、λ[nm] と振動数（光子のエネルギー）を計算し直しても、厳密な値と有効数字 3 桁で一致する d
      const g = guard((x, d) => { const l = U.roundSig(1 / x, d); return [x, l * 1e9, third === 'nu' ? C / l : H * C / (l * QE)]; }, [inv], [inv, lamNm, x3], 3);
      const lamD = U.roundSig(1 / g.v[0], g.d);
      return {
        title: 'リュードベリの式とスペクトル系列',
        body: R`水素原子から出る光の波長 $\lambda$ は、$m$ を正の整数、$n$ を $m$ より大きい整数として、リュードベリの式 $\dfrac{1}{\lambda} = R\left(\dfrac{1}{m^{2}} - \dfrac{1}{n^{2}}\right)$ で表される。` + RYD_R
          + (third === 'nu' ? R`、真空中の光速を $c = 3.00 \times 10^{8}\,\mathrm{m/s}$ とする。` : R` とする。` + CONST_H) + R`電子が $n = ` + hi + R`$ の状態から $n = ` + lo + R`$ の状態へ移るとき（` + SERIES[lo] + R`）に放出される光について、次の問いに答えよ。`,
        fig: figLevels(hi, lo, solveH(hi, lo), true, { noE: true }),
        parts: [
          numPart('(1)', R`$\dfrac{1}{\lambda}$ の値`, inv, '/m'),
          numPart('(2)', R`この光の波長 $\lambda$`, lamNm, 'nm'),
          third === 'nu' ? numPart('(3)', R`この光の振動数 $\nu$`, nu, 'Hz') : numPart('(3)', R`この光の光子のエネルギー（$\mathrm{eV}$ で）`, Eev, 'eV')
        ],
        solution: [
          {
            t: 'リュードベリの式',
            m: [R`\frac{1}{\lambda} = R\left(\frac{1}{m^{2}} - \frac{1}{n^{2}}\right),\quad R = 1.097 \times 10^{7}\,\mathrm{/m}`],
            n: R`水素原子が出す光の波長は、ボーアの理論より前に、実験から、この式で表せることが知られていました（**リュードベリの式**）。$m$ は光を出したあとの状態の量子数（$m = 1$ がライマン系列、$m = 2$ がバルマー系列、$m = 3$ がパッシェン系列）、$n$ は光を出す前の状態の量子数です。`,
            easy: R`水素の光を分けると、決まった波長の線だけが並びます。その波長がきれいな式で表せることが、先に見つかっていました。それがリュードベリの式です。電子が移った先の段の番号が $m$、移る前の段の番号が $n$ です。`,
            pro: R`波長の逆数 $\dfrac{1}{\lambda}$（波数）が、$\dfrac{1}{m^{2}} - \dfrac{1}{n^{2}}$ に比例します。$R$ の値は問題文で与えられます。`
          },
          {
            t: R`$\dfrac{1}{\lambda}$ の値`,
            m: [R`\frac{1}{\lambda} = R\left(\frac{1}{` + lo + R`^{2}} - \frac{1}{` + hi + R`^{2}}\right) = 1.097 \times 10^{7} \times \frac{` + fr[0] + '}{' + fr[1] + '} = ' + both(g.out[0], g.d) + R`\,\mathrm{/m}`],
            n: R`$m = ` + lo + R`$、$n = ` + hi + R`$ を代入します。` + careful(g.v[0], lamD),
            easy: R`式の $m$ のところに ` + lo + R`、$n$ のところに ` + hi + R` を入れて計算します。分数の引き算は、通分して計算します。`
          },
          {
            t: '波長',
            m: [R`\lambda = \frac{1}{1/\lambda} = \frac{1}{` + g.t[0] + '} = ' + lamEnd(lamD, g.d, lamNm)],
            n: R`$\dfrac{1}{\lambda}$ の逆数が波長です。` + (lamNm < 400 ? R`この光は紫外線にあたります。` : (lamNm < 760 ? R`この光は可視光にあたります。` : R`この光は赤外線にあたります。`)),
            easy: R`$\dfrac{1}{\lambda}$ が分かったので、その逆数（1 を割る）で波長が求まります。`
          },
          third === 'nu' ? {
            t: '振動数',
            m: [R`\nu = \frac{c}{\lambda} = \frac{3.00 \times 10^{8}}{` + gtex(lamD, g.d) + '} = ' + sig(nu) + un('Hz')],
            n: R`光の速さ $c$、波長 $\lambda$、振動数 $\nu$ の関係 $c = \nu\lambda$ から、$\nu = \dfrac{c}{\lambda}$ です。`,
            easy: R`光は 1 秒間に $c = 3.00 \times 10^{8}\,\mathrm{m}$ 進みます。その中に波が何個入るかが、振動数 $\nu$（1 秒間に何回振動するか）です。`
          } : {
            t: '光子のエネルギー',
            m: [R`h\nu = \frac{hc}{\lambda} = \frac{6.63 \times 10^{-34} \times 3.00 \times 10^{8}}{` + gtex(lamD, g.d) + R` \times 1.60 \times 10^{-19}} = ` + sig(Eev) + un('eV')],
            n: R`光子 1 個のエネルギーは $h\nu = \dfrac{hc}{\lambda}$ です。$\mathrm{J}$ で求めた値を $1.60 \times 10^{-19}$ で割ると $\mathrm{eV}$ になるので、分母に $1.60 \times 10^{-19}$ を掛けて、$\mathrm{eV}$ で求めます。`,
            easy: R`波長が分かれば、光子のエネルギーは $h\nu = \dfrac{hc}{\lambda}$ で求まります。波長が短いほど、エネルギーは大きくなります。`
          }
        ]
      };
    },
    // スペクトル系列の最長波長と系列限界
    (rng) => {
      const m = rng.pick([1, 2, 3]), sA = solveH(m + 1, m), Elim = E1 / (m * m), lamLim = HC / Elim;
      const lamOf = (e) => [H * C / (e * QE) * 1e9];
      const gA = guard((e) => lamOf(e), [sA.dE], [sA.lam], 4), gB = guard((e) => lamOf(e), [Elim], [lamLim], 3);
      const ups = [];
      for (let k = m + 1; k <= 6; k++) ups.push([k, m]);
      return {
        title: 'スペクトル系列の最長波長と系列限界',
        body: H_LEVELS + R`電子が $n = ` + m + R`$ の状態へ移るときに放出される光の系列（` + SERIES[m] + R`）を考える。この系列のうち、波長がもっとも短い光（**系列限界**）は、$n = \infty$（エネルギー $0$）の状態から $n = ` + m + R`$ の状態へ移るときに放出される光に対応する。` + CONST_H + ASK,
        fig: figLevels(m + 1, m, sA, true, { noE: true, arrows: ups.concat([[Infinity, m]]), caption: SERIES[m] + '（n = ' + (m + 1) + ', ' + (m + 2) + ', … → ' + m + '）' }),
        parts: [
          numPart('(1)', R`この系列で、波長がもっとも長い光の波長`, sA.lam, 'nm'),
          numPart('(2)', R`この系列で、波長がもっとも短い光（系列限界）の光子のエネルギー（$\mathrm{eV}$ で）`, Elim, 'eV'),
          numPart('(3)', R`系列限界の光の波長`, lamLim, 'nm')
        ],
        solution: [
          levelStep(),
          {
            t: '波長がもっとも長い光',
            m: lineDE(m, m + 1, sA.dE, gA.d).concat([lineLam(sA.dE, gA.d, sA.lam)]),
            n: R`光子のエネルギーが小さいほど、波長は長くなります。この系列でエネルギーがもっとも小さい遷移は、となりあう準位の間の遷移、つまり $n = ` + (m + 1) + R`$ から $n = ` + m + R`$ への遷移です。その光子のエネルギーから、$\lambda = \dfrac{hc}{h\nu}$ で波長を求めます。` + careful(gA.v[0]),
            easy: R`エネルギーが小さい光ほど、波長が長くなります。この系列で、移る前の段が $n = ` + m + R`$ のすぐ上の段（$n = ` + (m + 1) + R`$）のとき、段の高さの差がもっとも小さいので、波長がもっとも長くなります。`,
            pro: R`系列の最長波長は、「$m + 1 \to m$」の遷移です。`
          },
          {
            t: '系列限界の光子のエネルギー',
            m: [R`h\nu_{\infty} = 0 - E_{` + m + R`} = \frac{13.6}{` + m + R`^{2}} = ` + both(Elim, gB.d) + un('eV')],
            n: R`光子のエネルギーが大きいほど、波長は短くなります。この系列でエネルギーがもっとも大きい遷移は、いちばん上（$n = \infty$、エネルギー $0$）から $n = ` + m + R`$ へ移る遷移です。そのエネルギーは、$E_{` + m + R`}$ の符号を変えた値です。`,
            easy: R`いちばん高い所（$n = \infty$、高さ $0$）から $n = ` + m + R`$ の段へ降りるとき、段の高さの差がもっとも大きく、出る光のエネルギーももっとも大きくなります。この差は、$n = ` + m + R`$ の段の高さの符号を変えた値です。`
          },
          {
            t: '系列限界の波長',
            m: [lineLam(Elim, gB.d, lamLim)],
            n: R`系列限界の光子のエネルギーから、$\lambda = \dfrac{hc}{h\nu}$ で波長を求めます。これが、この系列の波長のいちばん短い側の限界です。` + careful(gB.v[0]),
            easy: R`エネルギーが分かれば、波長が決まります。この系列の光の波長は、最長波長と、この系列限界の波長のあいだに、すべておさまります。`
          }
        ]
      };
    }
  ];

  JK.registerSim({
    id: 'atom-hydrogen',
    field: '原子',
    unit: 'p-atom',
    title: '水素原子のエネルギー準位と光の放出・吸収',
    desc: '水素原子のエネルギー準位 $E_{n} = -\\dfrac{13.6}{n^{2}}\\,\\mathrm{eV}$ をもとに、量子数 $n$ から $m$ への遷移で放出・吸収される光子のエネルギー、波長、系列名を求め、準位図に遷移を描きます。',
    form: [R`E_{n} = -\frac{13.6}{n^{2}}\,\mathrm{eV}`, R`h\nu = |E_{n} - E_{m}|,\quad \lambda = \frac{c}{\nu} = \frac{hc}{h\nu}`, R`\frac{1}{\lambda} = R_{\infty}\left(\frac{1}{m^{2}} - \frac{1}{n^{2}}\right)`],
    inputs: [
      { key: 'n', label: '遷移前の量子数 $n$', type: 'int', def: '3', min: 1, max: 20, hint: '$n > m$ なら光子を放出、$n < m$ なら光子を吸収' },
      { key: 'm', label: '遷移後の量子数 $m$', type: 'int', def: '2', min: 1, max: 20 }
    ],
    examples: [
      { label: 'バルマー系列 H_α（3 → 2）', v: { n: '3', m: '2' } },
      { label: 'ライマン系列（2 → 1）', v: { n: '2', m: '1' } },
      { label: 'パッシェン系列（4 → 3）', v: { n: '4', m: '3' } },
      { label: '光を吸収する（1 → 3）', v: { n: '1', m: '3' } }
    ],
    intro: {
      easy: R`水素原子の電子は、階段の段のように、**とびとびの高さ（エネルギー）**の状態にしかなれません。いちばん下の段（基底状態 $n = 1$）が $-13.6\,\mathrm{eV}$ で、上の段ほど $0$ に近づきます。電子が上の段から下の段に降りるとき、段の高さの差のぶんだけのエネルギーを持った光（光子）が放出されます。逆に、光を吸収して、下の段から上の段へ上がることもできます。水素の光が、決まった色（波長）の線だけになるのは、このためです。`,
      normal: R`$E_{n} = -\dfrac{13.6}{n^{2}}\,\mathrm{eV}$。遷移では $h\nu = |E_{n} - E_{m}|$（ボーアの振動数条件）、波長は $\lambda = \dfrac{hc}{h\nu}$。$m = 1, 2, 3$ への遷移をそれぞれライマン・バルマー・パッシェン系列といいます。`,
      pro: R`$E_{1} = -13.6$、$E_{2} = -3.40$、$E_{3} = -1.51$、$E_{4} = -0.85\,\mathrm{eV}$ と、$\lambda[\mathrm{nm}] = \dfrac{1240}{\Delta E[\mathrm{eV}]}$ で暗算します。「$n$ から落ちるときの線の数 $= \dfrac{n(n-1)}{2}$」「電離エネルギー $= \dfrac{13.6}{n^{2}}$」も頻出です。`
    },
    compute(v) {
      if (v.n === v.m) throw new JK.CalcError('量子数 n と m が同じです（遷移が起こりません）。違う値を入力してください。');
      const s = solveH(v.n, v.m);
      return {
        result: [
          { label: '遷移前のエネルギー E_n', tex: sig(s.En) + un('eV') },
          { label: '遷移後のエネルギー E_m', tex: sig(s.Em) + un('eV') },
          { label: s.emit ? '放出される光子のエネルギー hν' : '吸収される光子のエネルギー hν', tex: sig(s.dE) + un('eV') + R`\ \ (= ` + sig(s.J) + R`\,\mathrm{J})` },
          { label: '光の波長 λ', tex: (s.lam < 1e4 ? sig(s.lam) + un('nm') : sig(s.lam / 1000) + un('\\mu m')) + R`\ \ (\text{` + bandOf(s.lam) + R`})` },
          { label: '光の振動数 ν', tex: sig(s.nu) + un('Hz') },
          { label: '系列', tex: R`\text{` + (SERIES[s.lo] || R`量子数 ` + s.lo + R` への系列`) + R`}` },
          { label: '電子を n から取り去る（電離）エネルギー', tex: sig(s.Eion) + un('eV') }
        ],
        steps: stepsH(v.n, v.m, s),
        fig: figLevels(v.n, v.m, s)
      };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // 準位 n0 のイオン化エネルギー、限界波長、スペクトル線の本数（すべての遷移 / n = mf の準位へ移る遷移だけ）
        const combos = [];
        for (let k = 2; k <= 7; k++) {
          combos.push([k, 0]);
          for (let f = 1; f <= 3 && f < k; f++) combos.push([k, f]);
        }
        const cb = rng.pick(combos), n0 = cb[0], mf = cb[1];
        const Eion = E1 / (n0 * n0), lam = HC / Eion, cnt = mf ? n0 - mf : n0 * (n0 - 1) / 2;
        const s = solveH(n0, mf || 1);
        const gE = guard((e) => [e, H * C / (e * QE) * 1e9], [Eion], [Eion, lam], 4);      // 限界波長の式に代入する E_ion（途中の値）の桁数
        const ups = [];
        for (let k = mf + 1; k <= n0; k++) ups.push(k);
        const sol = [
          {
            t: 'イオン化エネルギー',
            m: [R`E_{` + n0 + R`} = -\frac{13.6}{` + n0 + R`^{2}} = ` + sig(-Eion) + un('eV'), R`E_{ion} = 0 - E_{` + n0 + R`} = ` + both(Eion, gE.d) + un('eV')],
            n: R`電子を原子から完全に引き離す（エネルギーを $0$ にする）のに必要な最小のエネルギーが、イオン化エネルギーです。量子数 $n = ` + n0 + R`$ の状態では、$E_{` + n0 + R`}$ の符号を変えた値になります。`,
            easy: R`電子は今、$E_{` + n0 + R`}$ の高さの段にいます。原子の外（高さ $0$）まで引き上げるのに必要なエネルギーは、「$0$ から今の高さを引いた」値、つまり符号を変えた値です。`,
            pro: R`$n = ` + n0 + R`$ のイオン化エネルギーは $\dfrac{13.6}{` + n0 + R`^{2}}$。基底状態の $13.6$ の $\dfrac{1}{n^{2}}$ 倍です。`
          },
          {
            t: 'イオン化できる光の最大の波長（限界波長）',
            m: [R`\lambda_{0} = \frac{hc}{E_{ion}} = \frac{6.63 \times 10^{-34} \times 3.00 \times 10^{8}}{` + gE.t[0] + R` \times 1.60 \times 10^{-19}} = ` + sig(lam) + un('nm')],
            n: R`光子のエネルギーが $E_{ion}$ 以上でなければ電離できないので、それより長い波長の光は使えません。ちょうど $E_{ion}$ に等しい光子の波長が、電離できる最大の波長です。$E_{ion}$ は $\mathrm{J}$ に直して使います。` + careful(gE.v[0]),
            easy: R`光子のエネルギーは、波長が短いほど大きくなります。電子を引き離すのに必要なエネルギーをちょうど持つ光の波長が、境目です。それより長い波長の光（エネルギーが足りない光）では、電子は原子から離れられません。`,
            pro: R`$\lambda[\mathrm{nm}] \approx \dfrac{1240}{E[\mathrm{eV}]}$（$hc \approx 1240\,\mathrm{eV \cdot nm}$）で暗算できます。`
          },
          mf ? {
            t: R`$n = ` + mf + R`$ の準位へ移る遷移の本数（` + SERIES[mf] + R`）`,
            m: [R`n = ` + ups.join(R`,\ `) + R`\ \to\ n = ` + mf + R`\ \Rightarrow\ ` + n0 + ' - ' + mf + ' = ' + cnt + R`\ \text{本}`],
            n: R`遷移したあとの準位が $n = ` + mf + R`$ になる遷移（` + SERIES[mf] + R`）は、移る前の準位が $n = ` + ups.join(R`,\ `) + R`$ の ` + cnt + R` 通りです。$n = ` + n0 + R`$ より高い準位からの遷移は起こらないので、数えません。それぞれ違う波長の光を出します。`,
            easy: R`「$n = ` + mf + R`$ の段に降りてくる」遷移だけを数えます。降りてくる前の段は、$n = ` + mf + R`$ より上で $n = ` + n0 + R`$ 以下の段のどれかなので、` + cnt + R` 通りです。段が違えば、出る光の波長も違います。`
          } : {
            t: '出る光のスペクトル線の本数',
            m: [R`{}_{` + n0 + R`}\mathrm{C}_{2} = \frac{` + n0 + R` \times ` + (n0 - 1) + R`}{2} = ` + cnt + R`\ \text{本}`],
            n: R`$n = ` + n0 + R`$ の状態から、より低い状態へ段階的に（またはいっきに）移る道すじは、**2 つの準位の組み合わせ** $\dfrac{n(n-1)}{2}$ 通りあり、それぞれ違う波長の光を出します。`,
            easy: R``+ n0 + R` 個の段のうち、2 つの段を選ぶ組み合わせの数だけ、違う波長の線が出ます。たとえば 3 つの段（$n = 3, 2, 1$）なら、$3 \to 2$、$3 \to 1$、$2 \to 1$ の 3 本です。`
          }
        ];
        return {
          title: '水素原子のイオン化と発光',
          body: R`水素原子のエネルギー準位は $E_{n} = -\dfrac{13.6}{n^{2}}\,\mathrm{eV}$（$n = 1, 2, 3, \cdots$）で表される。水素原子の電子が $n = ` + n0 + R`$ の励起状態にあるとき、次の問いに答えよ。` + CONST_H,
          fig: figLevels(n0, mf || 1, s, true, { noE: true, arrows: [[n0, Infinity, true]], mark: mf ? [mf] : [], caption: 'n = ' + n0 + ' の励起状態（破線は電離）' }),
          parts: [
            numPart('(1)', R`この状態の電子を原子の外へ取り去る（電離させる）のに必要な最小のエネルギー（$\mathrm{eV}$ で）`, Eion, 'eV'),
            numPart('(2)', R`(1) のエネルギーを与えて電離させることができる光の、最大の波長`, lam, 'nm'),
            numPart('(3)', mf
              ? R`$n = ` + n0 + R`$ の状態から、より低い準位へ遷移するときに放出される光のスペクトル線のうち、$n = ` + mf + R`$ の準位へ移るもの（` + SERIES[mf] + R`）は、全部で何本あるか（途中の準位を経る場合も含めて、異なる遷移の数を答えよ）`
              : R`$n = ` + n0 + R`$ の状態から、より低い準位へ遷移するときに放出される光のスペクトル線は、全部で何本あるか（直接 $n = 1$ へ移る場合も、途中の準位を経る場合も含めて、異なる遷移の数を答えよ）`, cnt, '本')
          ],
          solution: sol
        };
      }
      // basic / mid: 場面（遷移・吸収・電離・2 段階の遷移・波長から準位を調べる・リュードベリの式・系列限界）を選んで出題
      return rng.pick(level === 'basic' ? HYD_BASIC : HYD_MID)(rng);
    }
  });

  /* =====================================================================
     2. ボーアの原子模型
     ===================================================================== */

  // pi: 円周率（演習では問題文どおり 3.14 を渡す。省略すると Math.PI）
  function solveBohr(n, Z, pi) {
    pi = pi || Math.PI;
    const r = n * n * H * H / (4 * pi * pi * ME * KC * Z * QE * QE);
    const v = 2 * pi * KC * Z * QE * QE / (n * H);
    const a0 = H * H / (4 * pi * pi * ME * KC * QE * QE);
    return { r: r, v: v, a0: a0, v1: 2 * pi * KC * QE * QE / H, E: -E1 * Z * Z / (n * n), lam: H / (ME * v), T: 2 * pi * r / v, pi: pi };
  }

  // 左: 軌道（半径は n² に比例）と選んだ n の電子 / 右: 選んだ n の定常波（円周 = n 波長）
  function figBohr(n, Z, s, hide) {
    const d = JK.plot.draw(380, 250);
    const cx = 100, cy = 118;
    d.dot(cx, cy, { cls: 'c3', r: 4.4 });
    [1, 2, 3].forEach((k) => {
      const on = k === n;
      d.circle(cx, cy, 14 * k * k * 0.62 + (k === 1 ? 5 : 0), { cls: on ? 'c1' : 'dim', w: on ? 2.2 : 1, dash: !on });
    });
    d.text(cx, 232, '軌道（半径は n² に比例）' + (n > 3 ? '（n = 1〜3 を表示）' : ''), { size: 11 });
    const rr = 14 * 0.62 * (Math.min(n, 3) * Math.min(n, 3)) + (Math.min(n, 3) === 1 ? 5 : 0);
    const pe = pol(cx, cy, rr, 0.9);
    d.circle(pe[0], pe[1], 4, { cls: 'c1', fill: 'f1' });
    // 右: 定常波
    const wx = 290, wy = 118, R0 = 54, A = 7;
    let path = '';
    for (let i = 0; i <= 240; i++) {
      const a = i / 240 * 2 * Math.PI, q = pol(wx, wy, R0 + A * Math.sin(n * a), a);
      path += (i ? ' L' : 'M') + q[0].toFixed(2) + ' ' + q[1].toFixed(2);
    }
    d.path(path, { cls: 'c2', w: 1.8 });
    d.circle(wx, wy, R0, { cls: 'dim', w: 0.8, dash: true });
    d.dot(wx, wy, { cls: 'c3', r: 3.6 });
    d.text(wx, 232, 'n = ' + n + ' の電子波（円周 = ' + n + ' 波長）', { size: 11 });
    d.text(wx, 30, '定常波', { size: 11, cls: 'c2' });
    d.text(cx, 30, 'ボーアの軌道', { size: 11, cls: 'c1' });
    if (!hide) d.text(190, 248, 'r = ' + tx3(s.r) + ' m ／ v = ' + tx3(s.v) + ' m/s ／ E = ' + tx3(s.E) + ' eV', { size: 10, cls: 'dim' });
    return d.svg();
  }

  function stepsBohr(n, Z, s, opt) {
    opt = opt || {};
    const steps = [];
    const zT = Z > 1 ? Z + ' \\times ' : '';
    // 円周率: 演習は問題文どおり 3.14 を代入して見せる（表示した数値どおりに計算し直せるように）。計算機は記号 π のまま
    const piNum = s.pi !== Math.PI, p2 = piNum ? '2 \\times ' + s.pi : R`2\pi`, p4 = piNum ? '4 \\times ' + s.pi + R`^{2}` : R`4\pi^{2}`;
    // 電子波の波長 λ = h/(mv)、軌道 1 周の長さ 2πr の式に代入する v と r（途中の値）。表示した値で計算し直しても、結果の有効数字 3 桁が合う桁数で見せる
    const gLam = guard((v) => [H / (ME * v)], [s.v], [s.lam], 3), gLen = guard((r) => [2 * s.pi * r], [s.r], [2 * s.pi * s.r], 3);
    steps.push({
      t: 'ボーアの 2 つの仮定',
      n: R`**量子条件**: 電子の円運動のうち、軌道 1 周の長さが電子波の波長の整数倍になる（$2\pi r \cdot mv = nh$）軌道だけが許されます。この軌道では電子は電磁波を出さず安定です。**振動数条件**: 電子が軌道を移るときだけ、エネルギーの差 $|E_{n} - E_{m}|$ に等しい光子を放出・吸収します。`,
      easy: R`原子核のまわりを回る電子は、古典物理では電磁波を出しながらエネルギーを失い、核に落ちてしまうはずです。そこでボーアは「**特別な軌道（量子条件を満たす軌道）では、電子は光を出さずに回り続けられる**」と仮定しました。その軌道は、とびとびの半径しかもてず、その順に $n = 1, 2, 3, \cdots$ と番号がつきます。`,
      pro: R`量子条件 $mvr = n\dfrac{h}{2\pi}$（角運動量の量子化）と、円運動の運動方程式（向心力 $=$ クーロン力）の 2 式から $r$ と $v$ を決めます。`
    });
    steps.push({
      t: '円運動の運動方程式（古典力学）',
      m: [R`m\frac{v^{2}}{r} = k\frac{` + (Z > 1 ? 'Z' : '') + R`e^{2}}{r^{2}} \;\Rightarrow\; mv^{2}r = k` + (Z > 1 ? 'Z' : '') + R`e^{2}`],
      n: R`電子（質量 $m$、電気量 $-e$）は、原子核（電気量 $+` + (Z > 1 ? 'Ze' : 'e') + R`$）からのクーロン力を向心力として、半径 $r$、速さ $v$ の等速円運動をします。$k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$ はクーロンの法則の比例定数です。`,
      easy: R`ひもにつないだボールを回すと、ひもの張力が向心力になりました。原子では、「ひも」にあたるのが原子核が電子を引きつけるクーロン力です。向心力 $m\dfrac{v^{2}}{r}$ と クーロン力 $k\dfrac{e^{2}}{r^{2}}$ を等しいとおきます。`,
      lv: 2
    });
    steps.push({
      t: '量子条件',
      m: [R`2\pi r \cdot mv = nh \;\Rightarrow\; mvr = \frac{nh}{2\pi}`],
      n: R`軌道 1 周の長さ $2\pi r$ が、電子波の波長 $\lambda = \dfrac{h}{mv}$ の $n$ 倍になる条件は $2\pi r = n\dfrac{h}{mv}$、すなわち $2\pi r \cdot mv = nh$ です。`,
      easy: R`電子は波でもあるので、軌道を 1 周したとき、波がぴったりつながらないと、周回するうちに波が打ち消しあって消えてしまいます。ぴったりつながる条件は、「円周が波長のちょうど整数倍」です。この条件を満たす軌道だけが許されます。`,
      lv: 2
    });
    steps.push({
      t: '軌道の半径と電子の速さ',
      m: [R`v = \frac{2\pi k` + (Z > 1 ? 'Z' : '') + R`e^{2}}{nh},\qquad r = \frac{n^{2}h^{2}}{4\pi^{2}mk` + (Z > 1 ? 'Z' : '') + R`e^{2}}`,
        R`v = \frac{` + p2 + R` \times 9.0 \times 10^{9} \times ` + zT + R`(1.60 \times 10^{-19})^{2}}{` + n + R` \times 6.63 \times 10^{-34}} = ` + sig(s.v) + un('m/s'),
        R`r = \frac{` + n + R`^{2} \times (6.63 \times 10^{-34})^{2}}{` + p4 + R` \times 9.11 \times 10^{-31} \times 9.0 \times 10^{9} \times ` + zT + R`(1.60 \times 10^{-19})^{2}} = ` + sig(s.r) + un('m')],
      n: R`2 つの式（運動方程式と量子条件）を連立すると、速さ $v$ は $n$ に**反比例**、半径 $r$ は $n^{2}$ に**比例**することが分かります。$n = 1$ の半径 $a_{0} = ` + sig(s.a0) + R`\,\mathrm{m}$ を**ボーア半径**といい、$r_{n} = \dfrac{n^{2}}{` + (Z > 1 ? 'Z' : '1') + R`}a_{0}$ です。`,
      easy: R`2 つの式を連立して、$v$ と $r$ を求めます。結果は、**外側の軌道ほど（$n$ が大きいほど）半径が大きく（$n^{2}$ に比例）、電子の速さは遅くなる（$n$ に反比例）**というものです。内側の軌道（$n = 1$）が最も小さく、半径は約 $5.3 \times 10^{-11}\,\mathrm{m}$ です。これが原子の大きさの目安です。`,
      pro: R`$r_{n} = n^{2}r_{1}$、$v_{n} = \dfrac{v_{1}}{n}$（$r_{1} = 5.3 \times 10^{-11}\,\mathrm{m}$、$v_{1} = 2.2 \times 10^{6}\,\mathrm{m/s}$）。$n$ の関係（2 乗 / 反比例）を覚えておけば、定数の計算は 1 回で済みます。`
    });
    steps.push({
      t: 'エネルギー',
      m: [R`E_{n} = \frac{1}{2}mv^{2} - k\frac{` + (Z > 1 ? 'Z' : '') + R`e^{2}}{r} = -\frac{1}{2}mv^{2} = -\frac{13.6` + (Z > 1 ? R` \times ` + Z * Z : '') + R`}{` + n + R`^{2}}\,\mathrm{eV} = ` + sig(s.E) + un('eV')],
      n: R`電子の力学的エネルギーは、運動エネルギーとクーロン力による位置エネルギー（$-k\dfrac{` + (Z > 1 ? 'Ze' : 'e') + R`^{2}}{r}$）の和です。向心力の式から $\dfrac{1}{2}mv^{2} = \dfrac{k` + (Z > 1 ? 'Z' : '') + R`e^{2}}{2r}$ なので、$E = -\dfrac{1}{2}mv^{2}$ になります。$n$ が大きいほど $0$ に近づきます。`,
      easy: R`電子のエネルギーは、動いているぶん（運動エネルギー、プラス）と、原子核に引かれているぶん（位置エネルギー、マイナス）の合計です。計算すると、合計は運動エネルギーの「マイナス」の値になり、これが水素原子のエネルギー準位 $-\dfrac{13.6}{n^{2}}\,\mathrm{eV}$ と一致します。`,
      lv: 2
    });
    steps.push({
      t: '電子波の波長と軌道の長さ',
      m: [R`\lambda = \frac{h}{mv} = \frac{6.63 \times 10^{-34}}{9.11 \times 10^{-31} \times ` + gLam.t[0] + '} = ' + sig(s.lam) + un('m'), R`2\pi r = ` + p2 + R` \times ` + gLen.t[0] + ' = ' + sig(2 * s.pi * s.r) + un('m') + R` = ` + n + R` \times \lambda`],
      n: R`軌道上の電子の波長は $\lambda = \dfrac{h}{mv}$ で、軌道 1 周の長さ $2\pi r$ はちょうどその $n$ 倍になっています。電子波が 1 周してもぴったりつながる「定常波」になるときだけ、その軌道が許されます。` + careful(gLam.v[0], gLen.v[0]),
      easy: R`図の右側のように、$n = 1$ なら波 1 個、$n = 2$ なら波 2 個、…が円周にちょうど収まっています。これが「円周 $=$ 波長の整数倍」の意味です。波の山と谷がずれると、1 周したときに打ち消しあってしまうので、その軌道は許されません。`,
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'atom-bohr',
    field: '原子',
    unit: 'p-atom',
    title: 'ボーアの原子模型（軌道半径・速さ・エネルギー）',
    desc: 'ボーアの量子条件 $2\\pi r \\cdot mv = nh$ と、クーロン力による円運動の式から、水素原子（または水素様イオン）の電子の軌道半径・速さ・エネルギーを求め、電子波の定常波で量子条件を図解します。',
    form: [R`m\frac{v^{2}}{r} = k\frac{Ze^{2}}{r^{2}},\quad 2\pi r \cdot mv = nh`, R`r_{n} = \frac{n^{2}h^{2}}{4\pi^{2}mkZe^{2}},\quad v_{n} = \frac{2\pi kZe^{2}}{nh}`, R`E_{n} = -\frac{13.6Z^{2}}{n^{2}}\,\mathrm{eV}`],
    inputs: [
      { key: 'n', label: '量子数 $n$', type: 'int', def: '2', min: 1, max: 10 },
      { key: 'Z', label: '原子核の電荷（原子番号）$Z$', type: 'int', def: '1', min: 1, max: 5, hint: '1: 水素原子、2: He⁺ イオン、3: Li²⁺ イオン（電子 1 個だけをもつ）' }
    ],
    examples: [
      { label: '水素原子の基底状態（n = 1）', v: { n: '1', Z: '1' } },
      { label: '水素原子の n = 3', v: { n: '3', Z: '1' } },
      { label: 'He⁺ イオン（Z = 2, n = 2）', v: { n: '2', Z: '2' } }
    ],
    intro: {
      easy: R`原子核のまわりを回る電子は、古典物理では光を出してエネルギーを失い、核に落ちてしまうはずです。そこでボーアは、「**電子は波でもあるので、軌道 1 周が波長の整数倍になる特別な軌道だけを、光を出さずに回り続ける**」と考えました。その軌道は、半径が $n^{2}$ に比例するとびとびの値（$n = 1, 2, 3, \cdots$）になり、エネルギーが $-\dfrac{13.6}{n^{2}}\,\mathrm{eV}$ になります。電子が軌道を移るときに、エネルギーの差を光として出し入れします。`,
      normal: R`向心力の式 $m\dfrac{v^{2}}{r} = k\dfrac{e^{2}}{r^{2}}$ と量子条件 $2\pi r \cdot mv = nh$ から $r_{n} = \dfrac{n^{2}h^{2}}{4\pi^{2}mke^{2}}$、$v_{n} = \dfrac{2\pi ke^{2}}{nh}$。$E_{n} = -\dfrac{1}{2}mv^{2} = -\dfrac{13.6}{n^{2}}\,\mathrm{eV}$。$h\nu = |E_{n} - E_{m}|$（振動数条件）。`,
      pro: R`$r_{n} \propto n^{2}$、$v_{n} \propto \dfrac{1}{n}$、$E_{n} \propto -\dfrac{1}{n^{2}}$ を比で使えるようにします。水素様イオン（電荷 $Ze$）では $r_{n} = \dfrac{n^{2}}{Z}a_{0}$、$E_{n} = -\dfrac{13.6Z^{2}}{n^{2}}\,\mathrm{eV}$。量子条件は「円周 $= n\lambda$」と書き換えて理解します。`
    },
    compute(v) {
      const s = solveBohr(v.n, v.Z);
      if (![s.r, s.v, s.E, s.lam].every(isFinite)) throw new JK.CalcError('この入力では計算できません。');
      return {
        result: [
          { label: '軌道の半径 r_n', tex: sig(s.r) + un('m') + R`\ \ (= ` + sig(s.r / s.a0) + R`\,a_{0}` + (v.Z > 1 ? R`,\ a_{0} = ` + sig(s.a0) + R`\,\mathrm{m}` : '') + R`)` },
          { label: '電子の速さ v_n', tex: sig(s.v) + un('m/s') },
          { label: 'エネルギー E_n', tex: sig(s.E) + un('eV') },
          { label: '電子波の波長 λ（円周 = n λ）', tex: sig(s.lam) + un('m') },
          { label: '電子が 1 周する時間 T', tex: sig(s.T) + un('s') }
        ],
        steps: stepsBohr(v.n, v.Z, s),
        fig: figBohr(v.n, v.Z, s, false)
      };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // 水素様イオン（He⁺: Z = 2、Li²⁺: Z = 3）: r_n = n² a0 / Z、E_n = -13.6 Z²/n²、n → m の遷移の波長
        const ION = {
          2: { name: 'ヘリウムイオン He⁺', sym: R`\mathrm{He^{+}}`, body: R`ヘリウムの原子核（電気量 $+2e$）のまわりを電子 1 個が回っているヘリウムイオン $\mathrm{He^{+}}$` },
          3: { name: 'リチウムイオン Li²⁺', sym: R`\mathrm{Li^{2+}}`, body: R`リチウムの原子核（電気量 $+3e$）のまわりを電子 1 個が回っているリチウムイオン $\mathrm{Li^{2+}}$` }
        };
        const combos = [];
        [2, 3].forEach((z) => { for (let k = 2; k <= 6; k++) for (let f = 1; f <= 2 && f < k; f++) combos.push([z, k, f]); });
        const cb = rng.pick(combos), Z = cb[0], n = cb[1], m = cb[2], ion = ION[Z];
        const r = n * n * 5.3e-11 / Z, E = -E1 * Z * Z / (n * n);
        const dE = E1 * Z * Z * (1 / (m * m) - 1 / (n * n)), lam = HC / dE;
        const s = solveBohr(n, Z);
        const gD = guard((e) => [e, H * C / (e * QE) * 1e9], [dE], [dE, lam], 4);      // 波長の式に代入する hν（途中の値）の桁数
        const sol = [
          {
            t: '軌道の半径',
            m: [R`r_{n} = \frac{n^{2}}{Z}\,a_{0} = \frac{` + n + R`^{2}}{` + Z + R`} \times 5.3 \times 10^{-11} = ` + sig(r) + un('m')],
            n: R`水素様イオン（電子 1 個）では、原子核の電荷が $Ze$ になるので、軌道半径は $r_{n} = \dfrac{n^{2}}{Z}a_{0}$ と、$Z$ に反比例します。$` + ion.sym + R`$ では $Z = ` + Z + R`$ です。`,
            easy: R`原子核の電気が $` + Z + R`$ 倍（$Z = ` + Z + R`$）になると、電子を引く力が $` + Z + R`$ 倍強くなるので、軌道は小さくなります。その結果、水素原子の同じ $n$ の軌道の半径の $\dfrac{1}{` + Z + R`}$ になります。`,
            pro: R`$r_{n} = \dfrac{n^{2}}{Z}a_{0}$、$E_{n} = -\dfrac{13.6Z^{2}}{n^{2}}$、$v_{n} = \dfrac{Zv_{1}}{n}$ の $Z$ のはたらきをセットで覚えます。`
          },
          {
            t: 'エネルギー',
            m: [R`E_{n} = -\frac{13.6Z^{2}}{n^{2}} = -\frac{13.6 \times ` + Z + R`^{2}}{` + n + R`^{2}} = ` + sig(E) + un('eV')],
            n: R`エネルギーは $Z^{2}$ に比例して低く（大きな負の値に）なります。電子をより強く原子核が引いているからです。`,
            easy: R`原子核の電荷が $` + Z + R`$ 倍になると、電子のエネルギー準位は $` + Z + R`^{2} = ` + Z * Z + R`$ 倍深くなります。水素の $-13.6\,\mathrm{eV}$ が、$` + ion.sym + R`$ の基底状態では $` + sig(-E1 * Z * Z) + R`\,\mathrm{eV}$ になります。`
          },
          {
            t: R`$n = ` + n + R`$ から $n = ` + m + R`$ へ遷移するときの光の波長`,
            m: lineDE(m, n, dE, gD.d, Z).concat([lineLam(dE, gD.d, lam)]),
            n: R`$n = ` + n + R`$ の状態から $n = ` + m + R`$ の状態へ移るとき放出される光子のエネルギーは、準位の差 $E_{` + n + R`} - E_{` + m + R`}$ です。$E_{n} = -\dfrac{13.6Z^{2}}{n^{2}}$ を代入して、$13.6Z^{2}$ をくくり出すと計算しやすくなります。波長は $\lambda = \dfrac{hc}{h\nu}$ です（$h\nu$ は $1.60 \times 10^{-19}$ を掛けて $\mathrm{J}$ に直して使います）。` + careful(gD.v[0]),
            easy: R`段（エネルギー準位）の高さの差が、そのまま放出される光子のエネルギーです。差が決まれば、$\lambda = \dfrac{hc}{\Delta E}$ から波長が求まります。$` + ion.sym + R`$ の遷移は水素より高いエネルギー差なので、波長が短く（` + bandOf(lam) + R`の領域に）なります。`,
            pro: R`$hc \approx 1240\,\mathrm{eV \cdot nm}$ を使うと、$\lambda[\mathrm{nm}] \approx \dfrac{1240}{h\nu[\mathrm{eV}]}$ と暗算できます。`
          }
        ];
        return {
          title: ion.name + ' のボーア模型',
          body: ion.body + R` を、ボーアの原子模型で考える。水素原子の基底状態の軌道半径を $a_{0} = 5.3 \times 10^{-11}\,\mathrm{m}$、エネルギーを $-13.6\,\mathrm{eV}$ として、電子が $n = ` + n + R`$ の軌道にあるとき、次の問いに答えよ。` + CONST_H,
          fig: figBohr(n, Z, s, true),
          parts: [
            numPart('(1)', R`電子の軌道半径 $r_{` + n + R`}$`, r, 'm'),
            numPart('(2)', R`電子のエネルギー $E_{` + n + R`}$（$\mathrm{eV}$ で、符号をつけて）`, E, 'eV'),
            numPart('(3)', R`この電子が $n = ` + m + R`$ の軌道に移るとき放出される光の波長`, lam, 'nm')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        // 量子条件と向心力の式から n 番目の軌道の v, r, 電子波の波長（水素原子と、電子 1 個の水素様イオン He⁺・Li²⁺）
        const combos = [];
        [1, 2, 3].forEach((z) => { for (let k = 1; k <= 6; k++) combos.push([z, k]); });
        const cb = rng.pick(combos), Z = cb[0], n = cb[1];
        const s = solveBohr(n, Z, 3.14);          // 問題文どおり π = 3.14 で計算
        const mTxt = R`質量 $m = 9.11 \times 10^{-31}\,\mathrm{kg}$、電気量 $-e$ の電子が、`;
        const sysTxt = Z === 1 ? R`水素原子で、` + mTxt + R`電気量 $+e$ の陽子のまわりを`
          : R`電子を 1 個だけもつ` + (Z === 2 ? R`ヘリウムイオン $\mathrm{He^{+}}$` : R`リチウムイオン $\mathrm{Li^{2+}}$`) + R` で、` + mTxt + R`電気量 $+` + Z + R`e$ の原子核のまわりを`;
        return {
          title: 'ボーアの量子条件から軌道を求める',
          body: sysTxt + R`半径 $r$、速さ $v$ の等速円運動をしている。ボーアの量子条件 $2\pi r \cdot mv = nh$ を満たす $n = ` + n + R`$ の軌道について、クーロンの法則の比例定数を $k = 9.0 \times 10^{9}\,\mathrm{N \cdot m^{2}/C^{2}}$、円周率を $\pi = 3.14$ として、` + CONST_H + R`次の問いに答えよ。`,
          fig: figBohr(n, Z, s, true),
          parts: [
            numPart('(1)', R`電子の速さ $v$`, s.v, 'm/s'),
            numPart('(2)', R`軌道の半径 $r$`, s.r, 'm'),
            numPart('(3)', R`この軌道上の電子の物質波の波長 $\lambda = \dfrac{h}{mv}$`, s.lam, 'm')
          ],
          solution: stepsBohr(n, Z, s).filter((st) => ['円運動の運動方程式（古典力学）', '量子条件', '軌道の半径と電子の速さ', '電子波の波長と軌道の長さ'].indexOf(st.t) >= 0)
            .map((st) => (st.t === '電子波の波長と軌道の長さ' ? Object.assign({}, st, { lv: 1 }) : st))      // λ は (3) で問うので、簡潔な表示でも残す
        };
      }
      // basic: 量子数 a の状態の値（a = 1 は基底状態）から、量子数 n の状態の値を n² 比例・n 反比例で求める
      // （a = 1, 2, 4 のとき、与える値が 3 桁以内でちょうど書ける）。(3) は E_n / 1 周の時間 T_n / 電子波の波長 λ_n のどれか
      const combos = [];
      [1, 2, 4].forEach((a0) => { for (let k = 1; k <= 6; k++) if (k !== a0) combos.push([a0, k]); });
      const ab = rng.pick(combos), a = ab[0], n = ab[1], kind = rng.pick(['E', 'T', 'L']), isE = kind === 'E';
      const ra = a * a * 5.3e-11, va = 2.2e6 / a, Ea = -E1 / (a * a);
      const s = solveBohr(n, 1);
      const rn = ra * Math.pow(n / a, 2), vn = va * a / n, En = Ea * Math.pow(a / n, 2);
      const Tn = 2 * 3.14 * rn / vn, Ln = 2 * 3.14 * rn / n;      // 1 周の時間 T = 2πr/v、電子波の波長（2πr = nλ）。π = 3.14
      // T・λ の式に代入する r_n, v_n（途中の値）。表示した値で計算し直しても、結果の有効数字 3 桁が合う桁数で見せる
      const gT = guard((r, v) => [2 * 3.14 * r / v], [rn, vn], [Tn], 3), gL = guard((r) => [2 * 3.14 * r / n], [rn], [Ln], 3);
      const na = String(a), nn = String(n);
      const ratio = R`\frac{` + nn + '}{' + na + '}', inv = R`\frac{` + na + '}{' + nn + '}';    // 式（別行立て）用
      const ratioD = R`\dfrac{` + nn + '}{' + na + '}', invD = R`\dfrac{` + na + '}{' + nn + '}';   // 文中の数式用
      const steps = [
        a === 1 ? {
          t: '$n$ との比例関係を使う',
          m: [isE ? R`r_{n} = n^{2}r_{1},\qquad v_{n} = \frac{v_{1}}{n},\qquad E_{n} = \frac{E_{1}}{n^{2}}` : R`r_{n} = n^{2}r_{1},\qquad v_{n} = \frac{v_{1}}{n}`],
          n: R`量子条件と向心力の式から、軌道半径は $n^{2}$ に比例、速さは $n$ に反比例` + (isE ? R`、エネルギーは $n^{2}$ に反比例（負の値）` : '') + R`であることが分かります。基底状態の値に、$n$ のべき乗を掛けるだけで求まります。`,
          easy: R`外側の軌道ほど、半径は $n^{2}$ 倍に大きく、電子の速さは $\dfrac{1}{n}$ 倍に遅くなり` + (isE ? R`、エネルギー（負の値）は $\dfrac{1}{n^{2}}$ 倍で $0$ に近づき` : '') + R`ます。$n = 1$ の値を基準にして、倍率を掛ければ求まります。`,
          pro: R`定数を使って 1 から計算し直す必要はありません。$r_{n} = n^{2}r_{1}$ の関係を使います。`
        } : {
          t: '$n$ との比例関係を使う',
          m: [isE ? R`r_{n} \propto n^{2},\qquad v_{n} \propto \frac{1}{n},\qquad E_{n} \propto \frac{1}{n^{2}}` : R`r_{n} \propto n^{2},\qquad v_{n} \propto \frac{1}{n}`,
            R`r_{` + nn + R`} = \left(` + ratio + R`\right)^{2}r_{` + na + R`},\qquad v_{` + nn + R`} = ` + inv + R`\,v_{` + na + '}' + (isE ? R`,\qquad E_{` + nn + R`} = \left(` + inv + R`\right)^{2}E_{` + na + '}' : '')],
          n: R`量子条件と向心力の式から、軌道半径は $n^{2}$ に比例、速さは $n$ に反比例` + (isE ? R`、エネルギーは $n^{2}$ に反比例（負の値）` : '') + R`であることが分かります。したがって、$n = ` + a + R`$ の値に、量子数の比 $` + ratioD + R`$ のべき乗を掛けるだけで、$n = ` + n + R`$ の値が求まります（基底状態の値から計算し直す必要はありません）。`,
          easy: R`外側の軌道ほど、半径は $n^{2}$ 倍に大きく、電子の速さは $\dfrac{1}{n}$ 倍に遅くなり` + (isE ? R`、エネルギー（負の値）は $\dfrac{1}{n^{2}}$ 倍で $0$ に近づき` : '') + R`ます。$n = ` + a + R`$ の値を基準にして、量子数が何倍になったか（$` + ratioD + R`$ 倍）から、倍率を掛ければ求まります。`,
          pro: R`与えられた $n = ` + a + R`$ の値からそのまま比で計算します。$\dfrac{r_{n}}{r_{` + a + R`}} = \left(` + ratioD + R`\right)^{2}$、$\dfrac{v_{n}}{v_{` + a + R`}} = ` + invD + R`$ です。`
        },
        {
          t: '各量を求める',
          m: (a === 1
            ? [R`r_{` + n + R`} = ` + n + R`^{2} \times 5.3 \times 10^{-11} = ` + sig(rn) + un('m'), R`v_{` + n + R`} = \frac{2.2 \times 10^{6}}{` + n + '} = ' + sig(vn) + un('m/s')]
            : [R`r_{` + nn + R`} = \left(` + ratio + R`\right)^{2} \times ` + sf(ra) + R` = ` + sig(rn) + un('m'), R`v_{` + nn + R`} = ` + inv + R` \times ` + sf(va) + R` = ` + sig(vn) + un('m/s')])
            .concat(isE ? [a === 1 ? R`E_{` + n + R`} = \frac{-13.6}{` + n + R`^{2}} = ` + sig(En) + un('eV')
              : R`E_{` + nn + R`} = \left(` + inv + R`\right)^{2} \times (` + sf(Ea) + R`) = ` + sig(En) + un('eV')] : []),
          n: R`$n = ` + n + R`$ を代入して、半径・速さ` + (isE ? R`・エネルギー` : '') + R`を求めます。` + (isE ? R`エネルギーは負の値で、$0$ に近づいていきます。` : ''),
          easy: R`$n = ` + n + R`$ を式に入れて計算するだけです。半径は ` + (a === 1 ? R`$` + n * n + R`$ 倍、速さは $\dfrac{1}{` + n + R`}$ 倍` : R`$\left(` + ratioD + R`\right)^{2}$ 倍、速さは $` + invD + R`$ 倍`) + (isE ? R`、エネルギーは ` + (a === 1 ? R`$\dfrac{1}{` + n * n + R`}$ 倍` : R`$\left(` + invD + R`\right)^{2}$ 倍`) : '') + R`になっています。`
        }
      ];
      const stepWave = {
        t: '量子条件の意味（電子波）',
        m: [R`2\pi r_{n} = n\lambda`],
        n: R`軌道 1 周の長さが電子波の波長の $n$ 倍になる軌道だけが許されます。右の図は $n = ` + n + R`$ の電子波が軌道 1 周にちょうど収まっているようすです。`,
        easy: R`波が 1 周してぴったりつながるときだけ、その軌道に電子がとどまれます。それが量子条件 $2\pi r = n\lambda$ です。`
      };
      let title, q3, ans3, unit3;
      if (kind === 'T') {
        title = 'ボーア模型の軌道半径・速さ・周期';
        q3 = R`電子が軌道を 1 周するのにかかる時間 $T_{` + n + R`}$`; ans3 = Tn; unit3 = 's';
        steps.push({
          t: '電子が 1 周する時間',
          m: [R`T_{` + nn + R`} = \frac{2\pi r_{` + nn + R`}}{v_{` + nn + R`}} = \frac{2 \times 3.14 \times ` + gT.t[0] + '}{' + gT.t[1] + '} = ' + sig(Tn) + un('s')],
          n: R`電子は、半径 $r_{` + n + R`}$ の円周（長さ $2\pi r_{` + n + R`}$）を、一定の速さ $v_{` + n + R`}$ で回ります。1 周にかかる時間は「道のり ÷ 速さ」で求まります。` + careful(gT.v[0], gT.v[1]),
          easy: R`円軌道 1 周の長さは $2\pi r$ です。それを速さ $v$ で割れば、1 周にかかる時間が出ます。(1)・(2) で求めた値を使います。`,
          pro: R`$T_{n} = \dfrac{2\pi r_{n}}{v_{n}} \propto \dfrac{n^{2}}{1/n} = n^{3}$ なので、周期は $n^{3}$ に比例します。`
        }, stepWave);
      } else if (kind === 'L') {
        title = 'ボーア模型の軌道半径・速さ・電子波の波長';
        q3 = R`この軌道上の電子の物質波の波長 $\lambda_{` + n + R`}$（量子条件: 軌道 1 周の長さが波長の $` + n + R`$ 倍になる）`; ans3 = Ln; unit3 = 'm';
        steps.push({
          t: '量子条件から電子波の波長を求める',
          m: [R`2\pi r_{n} = n\lambda \;\Rightarrow\; \lambda_{` + nn + R`} = \frac{2\pi r_{` + nn + R`}}{` + nn + R`} = \frac{2 \times 3.14 \times ` + gL.t[0] + '}{' + nn + '} = ' + sig(Ln) + un('m')],
          n: R`軌道 1 周の長さ $2\pi r_{n}$ が電子波の波長 $\lambda$ の $n$ 倍になる軌道だけが許されます（量子条件）。右の図は $n = ` + n + R`$ の電子波が軌道 1 周にちょうど収まっているようすです。` + careful(gL.v[0]),
          easy: R`波が 1 周してぴったりつながるときだけ、その軌道に電子がとどまれます。1 周の長さ $2\pi r$ を $n$ で割ると、波 1 個ぶんの長さ（波長）になります。`
        });
      } else {
        title = 'ボーア模型の軌道半径・速さ・エネルギー';
        q3 = R`電子のエネルギー $E_{` + n + R`}$（$\mathrm{eV}$ で、符号をつけて）`; ans3 = En; unit3 = 'eV';
        steps.push(stepWave);
      }
      return {
        title: title,
        body: R`水素原子のボーア模型で、` + (a === 1 ? R`基底状態（$n = 1$）` : R`量子数 $n = ` + a + R`$ の状態`) + R`の軌道半径は $r_{` + a + R`} = ` + sf(ra) + R`\,\mathrm{m}$、電子の速さは $v_{` + a + R`} = ` + sf(va) + R`\,\mathrm{m/s}$` + (isE ? R`、エネルギーは $E_{` + a + R`} = ` + sf(Ea) + R`\,\mathrm{eV}$` : '') + R` である。` + (isE ? '' : R`円周率を $\pi = 3.14$ とする。`) + R`量子数 $n = ` + n + R`$ の状態について、次の問いに答えよ。`,
        fig: figBohr(n, 1, s, true),
        parts: [
          numPart('(1)', R`軌道の半径 $r_{` + n + R`}$`, rn, 'm'),
          numPart('(2)', R`電子の速さ $v_{` + n + R`}$`, vn, 'm/s'),
          numPart('(3)', q3, ans3, unit3)
        ],
        solution: steps
      };
    }
  });

  /* =====================================================================
     3. 放射性崩壊（半減期・α崩壊・β崩壊）
     ===================================================================== */

  const TU = { s: '秒', min: '分', h: '時間', d: '日', y: '年' };
  const tu = (u) => R`\,\text{` + (TU[u] || u) + '}';

  // N–t グラフ（横軸は時間の単位つき。xUnit = 'T' なら t/T）
  function graphDecay(T, N0, t, unitName, hideLabels) {
    const xmax = 5 * T;
    const f = (x) => N0 * Math.pow(0.5, x / T);
    const pts = [];
    for (let k = 0; k <= 4; k++) pts.push({ x: k * T, y: N0 / Math.pow(2, k), label: hideLabels ? '' : (k === 0 ? 'N₀' : 'N₀/' + Math.pow(2, k)), cls: 'c2', pos: 'tr' });
    if (t != null && t <= xmax) pts.push({ x: t, y: f(t), label: '今', cls: 'c3', pos: 'tr' });
    return JK.plot.graph({
      w: 340, h: 220, x: [0, xmax], y: [0, N0 * 1.12],
      curves: [{ f: f, cls: 'c1' }],
      points: pts,
      vlines: [1, 2, 3, 4].map((k) => ({ x: k * T })),
      labels: [{ x: xmax, y: N0 * 0.07, text: 't [' + unitName + ']', cls: 'dim', anchor: 'end' }],
      axis: ['', 'N']
    });
  }

  // Z–A チャート（α崩壊は (Z−2, A−4)、β⁻ 崩壊は (Z+1, A)）。順序は α をすべて行ってから β
  function graphChain(A1, Z1, nA, nB) {
    const pts = [[Z1, A1]];
    let z = Z1, a = A1;
    const segs = [];
    for (let i = 0; i < nA; i++) { segs.push({ x1: z, y1: a, x2: z - 2, y2: a - 4, cls: 'c1', arrow: true }); z -= 2; a -= 4; }
    for (let i = 0; i < nB; i++) { segs.push({ x1: z, y1: a, x2: z + 1, y2: a, cls: 'c2', arrow: true }); z += 1; }
    const A2 = a, Z2 = z;
    const xlo = Math.min(Z1, Z2, Z1 - 2 * nA) - 3, xhi = Math.max(Z1, Z2) + 4, ylo = A2 - 8, yhi = A1 + 8;
    return JK.plot.graph({
      w: 340, h: 230, x: [xlo, xhi], y: [ylo, yhi],
      segs: segs,
      points: [{ x: Z1, y: A1, label: supTxt(A1) + sym(Z1), cls: 'c3', pos: 'tr' }, { x: Z2, y: A2, label: supTxt(A2) + sym(Z2), cls: 'c3', pos: 'br' }],
      labels: [{ x: xhi, y: ylo + (yhi - ylo) * 0.08, text: 'Z（原子番号）', cls: 'dim', anchor: 'end' }, { x: xlo + (xhi - xlo) * 0.04, y: yhi - (yhi - ylo) * 0.06, text: 'α崩壊: Z が 2・A が 4 減る ／ β崩壊: Z が 1 増える', cls: 'dim', anchor: 'start' }],
      axis: ['', 'A（質量数）'], grid: true
    });
  }

  function solveDecay(p) {
    if (p.mode === 'remain') {
      const k = p.t / p.T, ratio = Math.pow(0.5, k);
      return { k: k, ratio: ratio, N: p.N0 * ratio, gone: p.N0 * (1 - ratio), lam: Math.LN2 / p.T };
    }
    const ratio = p.pct / 100, k = Math.log(1 / ratio) / Math.LN2;
    return { k: k, ratio: ratio, t: k * p.T, lam: Math.LN2 / p.T, gone: 1 - ratio };
  }

  function stepsDecay(p, s) {
    const steps = [];
    if (p.mode === 'chain') {
      const a1 = p.A1, z1 = p.Z1, a2 = p.A2, z2 = p.Z2;
      steps.push({
        t: 'α崩壊とβ崩壊で原子核がどう変わるか',
        m: [R`\alpha\text{ 崩壊}:\ {}^{A}_{Z}\mathrm{X} \to {}^{A-4}_{Z-2}\mathrm{Y} + {}^{4}_{2}\mathrm{He}`, R`\beta\text{ 崩壊}:\ {}^{A}_{Z}\mathrm{X} \to {}^{A}_{Z+1}\mathrm{Y} + e^{-}`],
        n: R`**α崩壊**ではヘリウムの原子核（α粒子）が飛び出し、質量数は $4$ 減り、原子番号は $2$ 減ります。**β崩壊**では原子核の中の中性子が陽子に変わって電子（β線）が飛び出し、質量数は変わらず、原子番号が $1$ 増えます。`,
        easy: R`不安定な原子核が、粒子や電磁波を出して別の原子核に変わることを**放射性崩壊**といいます。α崩壊は「陽子 2 個と中性子 2 個のかたまり（ヘリウムの原子核）を放り出す」ので、質量数が 4、原子番号が 2 減ります。β崩壊は「中性子が 1 個、陽子に変わって電子を放り出す」ので、質量数（陽子と中性子の合計）は変わらず、陽子が 1 個増えるので原子番号が 1 増えます。`,
        pro: R`崩壊の前後では、質量数の合計と電気量の合計（原子番号の合計）が保存されます。γ崩壊では $A$、$Z$ とも変わりません。`
      });
      steps.push({
        t: '質量数からα崩壊の回数を求める',
        m: [R`A_{1} - 4n_{\alpha} = A_{2} \;\Rightarrow\; n_{\alpha} = \frac{A_{1} - A_{2}}{4} = \frac{` + a1 + ' - ' + a2 + '}{4} = ' + p.nA],
        n: R`β崩壊では質量数が変わらないので、質量数の減少はすべてα崩壊によるものです。α崩壊 1 回で質量数が $4$ 減るので、減少量を $4$ で割ればα崩壊の回数が求まります。`,
        easy: R`質量数が変わるのはα崩壊のときだけ（$1$ 回で $4$ 減る）です。だから、質量数が全部でいくつ減ったかを $4$ で割れば、α崩壊を何回したかが分かります。`
      });
      steps.push({
        t: '原子番号からβ崩壊の回数を求める',
        m: [R`Z_{1} - 2n_{\alpha} + n_{\beta} = Z_{2} \;\Rightarrow\; n_{\beta} = Z_{2} - Z_{1} + 2n_{\alpha} = ` + z2 + ' - ' + z1 + ' + 2 \\times ' + p.nA + ' = ' + p.nB],
        n: R`原子番号は、α崩壊で $2$ ずつ減り、β崩壊で $1$ ずつ増えます。α崩壊だけで減る分を差し引いても足りない（または超える）分が、β崩壊の回数です。`,
        easy: R`原子番号は、α崩壊で $2$ 減り、β崩壊で $1$ 増えます。α崩壊で減った分を計算して、実際の変化と見くらべれば、足りない分を β崩壊が増やしたことになり、その回数が分かります。`,
        pro: R`$n_{\alpha} \ge 0$、$n_{\beta} \ge 0$ の整数になることを確認します。ならないときは問題の設定を見直します（β⁺崩壊などは別の過程です）。`
      });
      steps.push({
        t: '検算',
        m: [R`A:\ ` + a1 + R` - 4 \times ` + p.nA + ' = ' + (a1 - 4 * p.nA) + R`\ (= A_{2}),\qquad Z:\ ` + z1 + R` - 2 \times ` + p.nA + R` + ` + p.nB + ' = ' + (z1 - 2 * p.nA + p.nB) + R`\ (= Z_{2})`],
        n: R`求めた回数で、質量数と原子番号が、崩壊後の値になることを確認します。この崩壊で ` + iso(a1, z1) + R` が ` + iso(a2, z2) + R` に変わります（崩壊が起こる順序は、この計算では決まりません）。`,
        easy: R`求めた α崩壊と β崩壊の回数を、質量数と原子番号の式に戻して計算し、最終的な値に一致するかを確かめます。一致すれば、答えは正しいです。`,
        lv: 2
      });
      return steps;
    }
    const tU = tu(p.tu);
    steps.push({
      t: '半減期とは',
      n: R`放射性の原子核が崩壊して、**もとの量の半分になるまでの時間**を**半減期** $T$ といいます。1 つ 1 つの原子核がいつ崩壊するかは偶然ですが、原子核がたくさんあれば、半減期ごとにきっちり半分になっていきます。半減期は、原子核の種類ごとに決まった値で、温度や圧力などで変わりません。`,
      easy: R`たくさんのコインを投げて、表が出たものを取り除く操作をくり返すと、1 回ごとにほぼ半分ずつ減っていきます。放射性の原子核の崩壊もこれに似ていて、「ある時間（半減期）がたつと、残っている原子核は半分になる」という規則に従います。次の半減期がたつと、そのまた半分（もとの $\dfrac{1}{4}$）になります。`,
      pro: R`半減期は、時刻の始まりに関係なく一定です。「いつから数えても、$T$ たてば半分」と使います。`
    });
    if (p.mode === 'remain') {
      // 次の式に代入する途中の値（t/T、N）。表示した値で計算し直しても、結果の有効数字 3 桁が合う桁数で見せる
      const gK = guard((k) => [p.N0 * Math.pow(0.5, k)], [s.k], [s.N], 3), gN = guard((N) => [p.N0 - N], [s.N], [s.gone], 3);
      steps.push({
        t: '経過時間は半減期の何回分か',
        m: [R`\frac{t}{T} = \frac{` + nice(p.t) + '}{' + nice(p.T) + '} = ' + gK.t[0]],
        n: R`経過した時間 $t$ を半減期 $T$ で割ると、半減期が何回分たったかが分かります。$T$ と $t$ の時間の単位は、そろえておきます。`,
        easy: R`「半分になる」作業を何回行ったかを数えます。経過した時間が半減期の何倍にあたるかを、割り算で求めます。`
      });
      steps.push({
        t: '残っている量',
        m: [R`N = N_{0}\left(\frac{1}{2}\right)^{t/T}`, R`N = ` + nice(p.N0) + R` \times \left(\frac{1}{2}\right)^{` + gK.t[0] + '} = ' + sig(s.N)],
        n: R`はじめの量を $N_{0}$ として、半減期がたつごとに $\dfrac{1}{2}$ 倍になるので、$t$ 後の量は $N = N_{0}\left(\dfrac{1}{2}\right)^{t/T}$ です。残りの割合は $\dfrac{N}{N_{0}} = ` + sig(s.ratio * 100) + R`\,\%$ です。`,
        easy: R`1 回の半減期で $\dfrac{1}{2}$、2 回で $\dfrac{1}{2} \times \dfrac{1}{2} = \dfrac{1}{4}$、3 回で $\dfrac{1}{8}$ ……と、「$\dfrac{1}{2}$ を回数ぶん掛ける」と残りの割合が出ます。回数が整数でないときは、電卓で $\left(\dfrac{1}{2}\right)^{\text{回数}}$ を計算します。`,
        pro: R`半減期の整数倍なら暗算で: $2$ 回 → $\dfrac{1}{4}$、$3$ 回 → $\dfrac{1}{8}$、$4$ 回 → $\dfrac{1}{16}$。`
      });
      steps.push({
        t: '崩壊した量',
        m: [R`N_{0} - N = ` + nice(p.N0) + ' - ' + gN.t[0] + ' = ' + sig(s.gone)],
        n: R`はじめの量から残った量を引いたものが、崩壊した（別の原子核に変わった）量です。`,
        easy: R`はじめにあった量から、いま残っている量を引けば、崩壊してなくなった分が出ます。`,
        lv: 2
      });
    } else {
      // 次の式に代入する途中の値（t/T、N/N₀）。表示した値で計算し直しても、結果の有効数字 3 桁が合う桁数で見せる
      const gA = guard((k) => [k * p.T], [s.k], [s.t], 3), gG = guard((r) => [1 - r], [s.ratio], [s.gone], 3);
      steps.push({
        t: '何回半分になったか',
        m: [R`\frac{N}{N_{0}} = \left(\frac{1}{2}\right)^{t/T} = ` + sig(s.ratio) + R` \;\Rightarrow\; \frac{t}{T} = \log_{2}\frac{N_{0}}{N} = ` + gA.t[0]],
        n: R`残っている割合が $\dfrac{N}{N_{0}} = ` + sig(s.ratio * 100) + R`\,\%$ のとき、「$\dfrac{1}{2}$ を何回掛けたらこの割合になるか」を考えます。割合が $\dfrac{1}{2}$、$\dfrac{1}{4}$、$\dfrac{1}{8}$ のように $\dfrac{1}{2^{n}}$ になっていれば、$n$ 回分です。`,
        easy: R`残っている割合から、半減期を何回すごしたかを逆算します。$\dfrac{1}{2}$ なら 1 回、$\dfrac{1}{4}$ なら 2 回、$\dfrac{1}{8}$ なら 3 回です。きれいな割合でないときは、電卓の $\log$ で求めます（$\log_{2}x = \dfrac{\log x}{\log 2}$）。`,
        pro: R`$\dfrac{N}{N_{0}} = \dfrac{1}{2^{n}}$ なら回数は $n$ です（$25\,\% \to 2$ 回、$12.5\,\% \to 3$ 回、$6.25\,\% \to 4$ 回）。`
      });
      steps.push({
        t: '経過した時間',
        m: [R`t = \frac{t}{T} \times T = ` + gA.t[0] + R` \times ` + nice(p.T) + ' = ' + sig(s.t) + tU],
        n: R`半減期の回数に半減期 $T = ` + nice(p.T) + R`$ を掛けると、経過した時間が求まります。放射性の炭素 $^{14}\mathrm{C}$（半減期 約 $5700$ 年）の割合から遺跡の年代を調べる「**放射性年代測定**」は、この考え方です。`,
        easy: R`半減期が何回すぎたかが分かれば、1 回ぶんの時間（半減期）を掛けるだけで、全体の経過時間が分かります。遺跡の木片などの年代を調べるときの考え方がこれです。`
      });
      steps.push({
        t: '崩壊した割合',
        m: [R`1 - \frac{N}{N_{0}} = 1 - ` + gG.t[0] + ' = ' + sig(s.gone) + ' = ' + sig(s.gone * 100) + R`\,\%`],
        n: R`はじめにあった量のうち、すでに崩壊した割合は $1 - \dfrac{N}{N_{0}}$ です。`,
        easy: R`残っていない分が崩壊した分なので、$1$（全体）から残りの割合を引けば出ます。`,
        lv: 2
      });
    }
    steps.push({
      t: '崩壊定数との関係（発展）',
      m: [R`N = N_{0}e^{-\lambda t},\qquad \lambda = \frac{\ln 2}{T} = ` + sig(s.lam) + R`\,\mathrm{/}` + tu(p.tu).replace(R`\,`, '')],
      n: R`単位時間あたりに崩壊する確率を**崩壊定数** $\lambda$ といい、$N = N_{0}e^{-\lambda t}$ と書けます。半減期とは $T = \dfrac{\ln 2}{\lambda}$ の関係にあります（高校では半減期の形 $\left(\dfrac{1}{2}\right)^{t/T}$ をおもに使います）。`,
      easy: R`半減期でなく「1 秒あたり何割崩壊するか」で表したのが崩壊定数です。どちらで表しても同じ現象で、$T = \dfrac{0.693}{\lambda}$ の関係があります。`,
      fig: graphDecay(p.T, 1, p.mode === 'remain' ? p.t : s.t, TU[p.tu], false),
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'atom-decay',
    field: '原子',
    unit: 'p-atom',
    title: '放射性崩壊（半減期・α崩壊・β崩壊）',
    desc: '半減期 $T$ から残っている量 $N = N_{0}\\left(\\dfrac{1}{2}\\right)^{t/T}$ と経過時間（年代測定）を求め、N–t グラフを描きます。また、α崩壊とβ崩壊の回数を、崩壊前後の質量数・原子番号から求めます。',
    form: [R`N = N_{0}\left(\frac{1}{2}\right)^{t/T}`, R`\alpha\text{ 崩壊}: (A, Z) \to (A - 4, Z - 2),\quad \beta\text{ 崩壊}: (A, Z) \to (A, Z + 1)`, R`n_{\alpha} = \frac{A_{1} - A_{2}}{4},\quad n_{\beta} = Z_{2} - Z_{1} + 2n_{\alpha}`],
    inputs: [
      { key: 'mode', label: '調べる内容', type: 'select', def: 'remain', options: [['remain', '残っている量（経過時間から）'], ['age', '経過時間（残っている割合から。年代測定）'], ['chain', 'α崩壊・β崩壊の回数']] },
      { key: 'tu', label: '時間の単位', type: 'select', def: 'd', options: [['s', '秒'], ['min', '分'], ['h', '時間'], ['d', '日'], ['y', '年']], show: (raw) => raw.mode !== 'chain' },
      { key: 'T', label: '半減期 $T$', unit: '（上の時間の単位）', type: 'num', def: '8.0', min: 0.000001, max: 1000000000, hint: '上で選んだ単位で入力します', show: (raw) => raw.mode !== 'chain' },
      { key: 'N0', label: 'はじめの量 $N_{0}$', unit: '（個・g など）', type: 'num', def: '80', min: 0, max: 1e30, hint: '個数・質量・放射線の強さなど（単位は自由）', show: (raw) => raw.mode === 'remain' || raw.mode == null },
      { key: 't', label: '経過時間 $t$', unit: '（上の時間の単位）', type: 'num', def: '24', min: 0, max: 1e12, show: (raw) => raw.mode === 'remain' || raw.mode == null },
      { key: 'pct', label: '残っている割合 $N/N_{0}$', unit: '%', type: 'num', def: '12.5', min: 0.0001, max: 100, show: (raw) => raw.mode === 'age' },
      { key: 'A1', label: '崩壊前の質量数 $A_{1}$', type: 'int', def: '238', min: 1, max: 300, show: (raw) => raw.mode === 'chain' },
      { key: 'Z1', label: '崩壊前の原子番号 $Z_{1}$', type: 'int', def: '92', min: 1, max: 100, show: (raw) => raw.mode === 'chain' },
      { key: 'A2', label: '崩壊後の質量数 $A_{2}$', type: 'int', def: '206', min: 1, max: 300, show: (raw) => raw.mode === 'chain' },
      { key: 'Z2', label: '崩壊後の原子番号 $Z_{2}$', type: 'int', def: '82', min: 1, max: 100, show: (raw) => raw.mode === 'chain' }
    ],
    examples: [
      { label: '半減期 8 日の物質（24 日後）', v: { mode: 'remain', tu: 'd', T: '8.0', N0: '80', t: '24' } },
      { label: '炭素 14 の年代測定（12.5 % 残存）', v: { mode: 'age', tu: 'y', T: '5700', pct: '12.5' } },
      { label: 'ウラン 238 → 鉛 206', v: { mode: 'chain', A1: '238', Z1: '92', A2: '206', Z2: '82' } },
      { label: 'トリウム 232 → 鉛 208', v: { mode: 'chain', A1: '232', Z1: '90', A2: '208', Z2: '82' } }
    ],
    intro: {
      easy: R`放射性の原子核は、粒子や電磁波を出して、別の原子核に変わっていきます（**放射性崩壊**）。1 つ 1 つがいつ崩壊するかは偶然ですが、たくさんあれば、**ある時間（半減期）がたつと半分になり、さらに同じ時間がたつとそのまた半分に……**と、規則正しく減っていきます。この性質を使うと、遺跡の木片に残った放射性の炭素の割合から、その年代を知ることができます。また、α崩壊では質量数が 4・原子番号が 2 減り、β崩壊では原子番号が 1 増えるので、崩壊の前後の原子核を比べると、それぞれ何回起こったかが分かります。`,
      normal: R`$N = N_{0}\left(\dfrac{1}{2}\right)^{t/T}$。残りの割合から回数 $n = \log_{2}\dfrac{N_{0}}{N}$、経過時間 $t = nT$。α崩壊: $(A, Z) \to (A-4, Z-2)$、β崩壊: $(A, Z) \to (A, Z+1)$。質量数の差を $4$ で割って $n_{\alpha}$、原子番号から $n_{\beta} = Z_{2} - Z_{1} + 2n_{\alpha}$。`,
      pro: R`半減期の整数倍のときは $\left(\dfrac{1}{2}\right)^{n}$ で暗算。崩壊系列の問題は「$A$ から α の回数 → $Z$ から β の回数」の順です。年代測定では「残りの割合 → 半減期の回数 → 年数」と進めます。`
    },
    compute(v) {
      const mode = v.mode === 'age' ? 'age' : (v.mode === 'chain' ? 'chain' : 'remain');
      if (mode === 'chain') {
        const dA = v.A1 - v.A2;
        if (dA < 0) throw new JK.CalcError('崩壊後の質量数 A₂ が崩壊前の A₁ より大きくなっています。α崩壊・β崩壊では質量数は減るか変わりません。');
        if (dA % 4 !== 0) throw new JK.CalcError('質量数の差 ' + dA + ' が 4 の倍数ではありません。α崩壊（質量数が 4 減る）とβ崩壊（変わらない）だけでは、この変化は起こせません。');
        const nA = dA / 4, nB = v.Z2 - v.Z1 + 2 * nA;
        if (nB < 0) throw new JK.CalcError('β崩壊の回数が負（' + nB + '）になります。この原子番号の変化は、α崩壊とβ崩壊（β⁻）だけでは起こせません。数値を見直してください。');
        const p = { mode: 'chain', A1: v.A1, Z1: v.Z1, A2: v.A2, Z2: v.Z2, nA: nA, nB: nB };
        return {
          result: [
            { label: 'α崩壊の回数', tex: String(nA) + R`\text{ 回}` },
            { label: 'β崩壊の回数', tex: String(nB) + R`\text{ 回}` },
            { label: '崩壊の前後', tex: iso(v.A1, v.Z1) + R`\ \to\ ` + iso(v.A2, v.Z2) },
            { label: '放出される粒子（α線: 4He の原子核、β線: 電子）', tex: String(nA) + R`\text{ 個の }\alpha\text{ 粒子},\ ` + String(nB) + R`\text{ 個の電子}` }
          ],
          steps: stepsDecay(p, {}),
          fig: graphChain(v.A1, v.Z1, nA, nB)
        };
      }
      const p = { mode: mode, tu: v.tu || 'd', T: v.T, N0: v.N0, t: v.t, pct: v.pct };
      const s = solveDecay(p);
      if (mode === 'remain') {
        if (![s.N, s.gone].every(isFinite)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
        return {
          result: [
            { label: '経過した半減期の回数 t/T', tex: sig(s.k) },
            { label: '残っている割合 N/N₀', tex: sig(s.ratio) + R`\ \ (` + sig(s.ratio * 100) + R`\,\%)` },
            { label: '残っている量 N', tex: sig(s.N) },
            { label: '崩壊した量 N₀ − N', tex: sig(s.gone) },
            { label: '崩壊定数 λ = ln2 / T', tex: sig(s.lam) + R`\,\mathrm{/}` + tu(p.tu).replace(R`\,`, '') }
          ],
          steps: stepsDecay(p, s),
          fig: graphDecay(p.T, p.N0 > 0 ? p.N0 : 1, p.t, TU[p.tu], false)
        };
      }
      if (![s.k, s.t].every(isFinite)) throw new JK.CalcError('値が大きすぎる、または小さすぎるため計算できません。');
      return {
        result: [
          { label: '経過した半減期の回数', tex: sig(s.k) },
          { label: '経過した時間 t', tex: sig(s.t) + tu(p.tu) },
          { label: '崩壊した割合', tex: sig(s.gone * 100) + R`\,\%` }
        ],
        steps: stepsDecay(p, s),
        fig: graphDecay(p.T, 1, s.t, TU[p.tu], false)
      };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // 放射線の強さ（崩壊の割合）から半減期、さらに先の強さ
        const kk = rng.pick([2, 3, 4]);
        const Th = rng.pick([6, 8, 12, 24]);
        const t1 = kk * Th, dt = rng.pick([1, 2, 3]) * Th, k2 = kk + dt / Th;
        const tAll = rng.pick([5, 6]) * Th;
        const A0 = rng.pick([80, 160, 320]);
        const p = { mode: 'age', tu: 'h', T: Th, pct: 100 / Math.pow(2, kk) };
        const s = solveDecay(p);
        const r2 = Math.pow(0.5, kk + dt / Th) * 100, tN = tAll;
        const sol = [
          {
            t: '半減期の回数と半減期',
            m: [R`\frac{N}{N_{0}} = \frac{1}{` + Math.pow(2, kk) + R`} = \left(\frac{1}{2}\right)^{` + kk + R`} \;\Rightarrow\; ` + kk + R`\text{ 回分}`, R`T = \frac{t_{1}}{` + kk + R`} = \frac{` + t1 + '}{' + kk + '} = ' + sig(Th) + tu('h')],
            n: R`強さが $\dfrac{1}{` + Math.pow(2, kk) + R`}$ になったので、半減期が $` + kk + R`$ 回分たったことになります。$` + t1 + R`\,\text{時間}$ が半減期の $` + kk + R`$ 倍なので、半減期はその $\dfrac{1}{` + kk + R`}$ です。`,
            easy: R`「強さが $\dfrac{1}{` + Math.pow(2, kk) + R`}$ になった」ということは、半分になることを $` + kk + R`$ 回くり返したということです。$` + kk + R`$ 回で $` + t1 + R`$ 時間かかったので、1 回ぶん（半減期）は、$` + t1 + R` \div ` + kk + R`$ です。`
          },
          {
            t: 'さらに時間がたったあとの強さ',
            m: [R`\frac{t_{1} + \Delta t}{T} = \frac{` + (t1 + dt) + '}{' + Th + '} = ' + (kk + dt / Th) + R`\ \text{回分}`, R`\frac{N}{N_{0}} = \left(\frac{1}{2}\right)^{` + (kk + dt / Th) + '} = ' + sig(Math.pow(0.5, k2)) + ' = ' + sig(r2) + R`\,\%`],
            n: R`はじめから数えて $` + (t1 + dt) + R`$ 時間後には、半減期 $` + Th + R`$ 時間の $` + (kk + dt / Th) + R`$ 回分がたちます。半減期の整数倍なので、$\left(\dfrac{1}{2}\right)^{` + (kk + dt / Th) + R`}$ が残りの割合です。`,
            easy: R`いつから数えても、半減期 1 回ぶんの時間がたてば、そのときの強さの半分になります。はじめから数えた半減期の回数を求めて、$\dfrac{1}{2}$ をその回数だけ掛けます。`
          },
          {
            t: '指定の時刻における強さ',
            m: [R`\frac{N}{N_{0}} = \left(\frac{1}{2}\right)^{` + (tN / Th) + R`} = \frac{1}{` + Math.pow(2, tN / Th) + R`} \Rightarrow\ N = ` + A0 + R` \times \frac{1}{` + Math.pow(2, tN / Th) + '} = ' + sig(A0 * Math.pow(0.5, tN / Th))],
            n: R`はじめの強さが $` + A0 + R`$ のとき、$` + tN + R`$ 時間後（半減期の $` + (tN / Th) + R`$ 回分）の強さを求めます。`,
            easy: R`半減期を $` + (tN / Th) + R`$ 回すごしたので、はじめの強さに $\left(\dfrac{1}{2}\right)^{` + (tN / Th) + R`}$ を掛けます。`
          }
        ];
        return {
          title: '放射線の強さの変化から半減期を求める',
          body: R`ある放射性同位体から出る放射線の強さは、時間とともに減少し、$` + t1 + R`$ 時間後には、はじめの強さの $\dfrac{1}{` + Math.pow(2, kk) + R`}$ になった。次の問いに答えよ。ただし、放射線の強さは、残っている放射性原子核の数に比例するものとする。`,
          fig: graphDecay(Th, 1, null, '時間', true),
          parts: [
            numPart('(1)', R`この放射性同位体の半減期 $T$（単位は時間）`, Th, '時間'),
            numPart('(2)', R`はじめから $` + (t1 + dt) + R`$ 時間後の強さは、はじめの強さの何 $\%$ か`, r2, '%'),
            numPart('(3)', R`はじめの強さが $` + A0 + R`$（任意単位）のとき、はじめから $` + tN + R`$ 時間後の強さ`, A0 * Math.pow(0.5, tN / Th), '')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        // 残っている割合（半減期 kk 回分）から経過時間を求める。題材は 炭素 14 の年代測定 / 医療・環境の放射性同位体
        // （半減期は、広く知られた代表的な値: 14C 5700 年、131I 8.0 日、137Cs 30 年、99mTc 6.0 時間）
        const SRC = [
          {
            u: 'y', Ttxt: '5700', ja: '年', title: '放射性炭素による年代測定',
            body: (T, pct) => R`生きている植物にふくまれる放射性の炭素 $^{14}\mathrm{C}$ の割合は、ほぼ一定である。植物が死ぬと新しい $^{14}\mathrm{C}$ は取り込まれなくなり、$^{14}\mathrm{C}$ は半減期 $` + T + R`$ 年で崩壊して減っていく。ある遺跡から出土した木片の $^{14}\mathrm{C}$ の割合を調べたところ、生きている植物の $` + sf(pct) + R`\,\%$ であった。次の問いに答えよ。`,
            q1: R`この木片では、半減期の何回分の時間が経過しているか`,
            q2: R`この木になっていた植物が死んでから、何年が経過したか`,
            q3: R`死んだときにあった $^{14}\mathrm{C}$ のうち、現在までに崩壊した割合（$\%$）`
          },
          {
            u: 'd', Ttxt: '8.0', ja: '日', title: 'ヨウ素 131 の半減期と経過日数',
            body: (T, pct) => R`甲状腺の検査や治療に使われる放射性のヨウ素 $^{131}\mathrm{I}$ は、半減期 $` + T + R`$ 日で崩壊して減っていく。ある日に準備した $^{131}\mathrm{I}$ の量を、準備したときの量と比べたところ、$` + sf(pct) + R`\,\%$ になっていた。次の問いに答えよ。`,
            q1: R`この $^{131}\mathrm{I}$ では、半減期の何回分の時間が経過しているか`,
            q2: R`$^{131}\mathrm{I}$ を準備してから、何日が経過したか`,
            q3: R`準備したときにあった $^{131}\mathrm{I}$ のうち、現在までに崩壊した割合（$\%$）`
          },
          {
            u: 'y', Ttxt: '30', ja: '年', title: 'セシウム 137 の半減期と経過年数',
            body: (T, pct) => R`原子力発電所の事故などで環境に放出された放射性のセシウム $^{137}\mathrm{Cs}$ は、半減期 $` + T + R`$ 年で崩壊して減っていく。ある地点の土壌にふくまれる $^{137}\mathrm{Cs}$ の量は、放出された直後の量の $` + sf(pct) + R`\,\%$ になっていた（雨などによる移動は考えないものとする）。次の問いに答えよ。`,
            q1: R`この土壌では、半減期の何回分の時間が経過しているか`,
            q2: R`$^{137}\mathrm{Cs}$ が放出されてから、何年が経過したか`,
            q3: R`放出された直後にあった $^{137}\mathrm{Cs}$ のうち、現在までに崩壊した割合（$\%$）`
          },
          {
            u: 'h', Ttxt: '6.0', ja: '時間', title: 'テクネチウム 99m の半減期と経過時間',
            body: (T, pct) => R`医療の画像診断に使われる放射性のテクネチウム $^{99\mathrm{m}}\mathrm{Tc}$ は、半減期 $` + T + R`$ 時間で崩壊して減っていく。ある時刻に調製した $^{99\mathrm{m}}\mathrm{Tc}$ の量は、調製したときの量の $` + sf(pct) + R`\,\%$ になっていた。次の問いに答えよ。`,
            q1: R`この $^{99\mathrm{m}}\mathrm{Tc}$ では、半減期の何回分の時間が経過しているか`,
            q2: R`$^{99\mathrm{m}}\mathrm{Tc}$ を調製してから、何時間が経過したか`,
            q3: R`調製したときにあった $^{99\mathrm{m}}\mathrm{Tc}$ のうち、現在までに崩壊した割合（$\%$）`
          }
        ];
        const src = rng.pick(SRC), kk = rng.pick([1, 2, 3, 4]), Th = Number(src.Ttxt);
        const pct = 100 / Math.pow(2, kk), t = kk * Th;
        const p = { mode: 'age', tu: src.u, T: Th, pct: pct };
        const s = solveDecay(p);
        return {
          title: src.title,
          body: src.body(src.Ttxt, pct),
          fig: graphDecay(Th, 1, null, src.ja, true),
          parts: [
            numPart('(1)', src.q1, kk, '回'),
            numPart('(2)', src.q2, t, src.ja),
            numPart('(3)', src.q3, 100 - pct, '%')
          ],
          solution: stepsDecay(p, s).slice(0, 4).map((st, i) => (i === 3 ? Object.assign({}, st, { lv: 1 }) : st))      // 崩壊した割合は (3) で問うので、簡潔な表示でも残す
        };
      }
      // basic: 半減期の整数倍の経過
      let T, kk, N0, tu_;
      const units = rng.pick([['日', 'd'], ['年', 'y'], ['時間', 'h']]);
      for (let i = 0; i < 100; i++) {
        T = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 20]); kk = rng.pick([1, 2, 3, 4]); N0 = rng.pick([80, 160, 320, 640, 1000, 2000]);
        if (ok3(N0 / Math.pow(2, kk))) break;
      }
      const p = { mode: 'remain', tu: units[1], T: T, N0: N0, t: kk * T };
      const s = solveDecay(p);
      return {
        title: '半減期と残りの量',
        body: R`半減期が $` + T + R`$ ` + units[0] + R`の放射性物質が、はじめ $` + sf(N0) + R`\,\mathrm{mg}$ あった。次の問いに答えよ。`,
        fig: graphDecay(T, N0, null, units[0], true),
        parts: [
          numPart('(1)', R`$` + kk * T + R`$ ` + units[0] + R`は、半減期の何回分か`, kk, '回'),
          numPart('(2)', R`$` + kk * T + R`$ ` + units[0] + R`後に残っている量`, s.N, 'mg'),
          numPart('(3)', R`$` + kk * T + R`$ ` + units[0] + R`の間に崩壊した量`, s.gone, 'mg')
        ],
        solution: stepsDecay(p, s).slice(0, 4).map((st, i) => (i === 3 ? Object.assign({}, st, { lv: 1 }) : st))      // 崩壊した量は (3) で問うので、簡潔な表示でも残す
      };
    }
  });

  /* =====================================================================
     4. 質量欠損と結合エネルギー / 核反応のエネルギー
     ===================================================================== */

  // 結合エネルギー（1 核子あたり）の概略 [A, MeV]
  const BA = [[1, 0], [2, 1.11], [3, 2.57], [4, 7.07], [6, 5.33], [7, 5.61], [9, 6.46], [12, 7.68], [14, 7.48], [16, 7.98], [20, 8.03], [24, 8.26], [28, 8.45], [32, 8.49], [40, 8.55], [56, 8.79], [62, 8.79], [80, 8.71], [100, 8.62], [120, 8.51], [140, 8.38], [160, 8.28], [180, 8.19], [200, 8.07], [208, 7.87], [220, 7.78], [238, 7.57], [250, 7.5]];
  function baCurve(a) {
    if (a <= BA[0][0]) return BA[0][1];
    for (let i = 1; i < BA.length; i++) {
      if (a <= BA[i][0]) { const x0 = BA[i - 1][0], y0 = BA[i - 1][1]; return y0 + (BA[i][1] - y0) * (a - x0) / (BA[i][0] - x0); }
    }
    return BA[BA.length - 1][1];
  }

  function solveBind(p) {
    const Nn = p.A - p.Z;
    const sum = p.Z * MPR + Nn * MNE, dm = sum - p.M, Eb = dm * UMEV;
    return { N: Nn, sum: sum, dm: dm, Eb: Eb, EbA: Eb / p.A, EbJ: Eb * 1e6 * QE, dmKg: dm * 1.66e-27 };
  }

  // 核子ばらばらの質量と原子核の質量（模式図）
  function figDeficit(p, s, hide) {
    const d = JK.plot.draw(380, 220);
    // 左: ばらばらの核子
    const nuc = Math.min(p.A, 14), nz = Math.max(0, Math.min(nuc, Math.round(nuc * p.Z / p.A)));
    for (let i = 0; i < nuc; i++) {
      const cx = 50 + (i % 5) * 20, cy = 60 + Math.floor(i / 5) * 20;
      d.circle(cx, cy, 8, { cls: i < nz ? 'c3' : 'c1', fill: i < nz ? 'f3' : 'f1' });
    }
    if (p.A > 14) d.text(100, 130, '… 全部で ' + p.A + ' 個', { size: 10, cls: 'dim' });
    d.text(100, 30, 'ばらばらの核子', { size: 11 });
    d.text(100, 148, '陽子 ' + p.Z + ' 個 + 中性子 ' + s.N + ' 個', { size: 10, cls: 'dim' });
    if (!hide) d.text(100, 164, '質量の和 = ' + fm(s.sum) + ' u', { size: 11 });
    // 右: 原子核
    d.circle(290, 84, 26, { cls: 'c2', fill: 'f2', w: 2 });
    d.text(290, 88, '原子核', { size: 11 });
    d.text(290, 30, '原子核（結合した状態）', { size: 11 });
    d.text(290, 148, '質量 M = ' + fm(p.M) + ' u', { size: 11 });
    d.arrow(160, 84, 250, 84, { cls: 'c4', w: 2.4 });
    d.text(205, 72, '結合', { size: 11, cls: 'c4' });
    d.text(205, 102, 'E_b を放出', { size: 11, cls: 'c4' });
    if (!hide) d.text(190, 190, '質量欠損 Δm = ' + fm(s.sum) + ' − ' + fm(p.M) + ' = ' + tx3(s.dm) + ' u', { size: 11 });
    d.text(190, 208, '（質量が減った分が、結合エネルギー E = Δm c² として放出される）', { size: 10, cls: 'dim' });
    return d.svg();
  }

  function graphBA(p, s) {
    const pts = [[4, '⁴He'], [56, '⁵⁶Fe'], [235, '²³⁵U']].filter((q) => Math.abs(q[0] - p.A) > 12);
    return JK.plot.graph({
      w: 340, h: 240, x: [0, 260], y: [0, 10.2],
      curves: [{ f: baCurve, cls: 'c1' }],
      points: pts.map((q) => ({ x: q[0], y: baCurve(q[0]), label: q[1], cls: 'c2', pos: q[0] > 100 ? 'tr' : 'br' })).concat([{ x: p.A, y: s.EbA, label: 'この核（' + tx3(s.EbA) + ' MeV）', cls: 'c3', pos: p.A > 150 ? 'tl' : 'br' }]),
      labels: [{ x: 250, y: 0.7, text: 'A（質量数）', cls: 'dim', anchor: 'end' }, { x: 6, y: 9.6, text: '核融合 →', cls: 'dim', anchor: 'start' }, { x: 255, y: 9.6, text: '← 核分裂', cls: 'dim', anchor: 'end' }],
      axis: ['', 'E_b/A [MeV]']
    });
  }

  // 反応前後の質量（棒グラフ）。差を強調して描く
  function figReaction(p, s, hide) {
    const d = JK.plot.draw(380, 220);
    const base = 150, hb = 90, gap = Math.max(6, Math.min(40, 6 + Math.abs(s.dm) / Math.max(p.Min, 1e-9) * 3000));
    const hA = hb, hB = s.dm >= 0 ? hb - gap : hb + gap;
    d.rect(80, base - hA, 80, hA, { cls: 'c1', fill: 'f1', w: 2 });
    d.rect(220, base - hB, 80, hB, { cls: 'c2', fill: 'f2', w: 2 });
    d.text(120, base + 18, '反応前', { size: 11 });
    d.text(260, base + 18, '反応後', { size: 11 });
    d.text(120, base - hA - 8, fm(p.Min) + ' u', { size: 11 });
    d.text(260, base - hB - 8, fm(p.Mout) + ' u', { size: 11 });
    d.line(160, base - hA, 220, base - hA, { cls: 'dim', dash: true, w: 1 });
    dimLine(d, 196, base - hA, 196, base - hB);
    d.text(204, base - (hA + hB) / 2 + 4, 'Δm', { anchor: 'start', italic: true });
    if (!hide) d.text(190, 196, 'Δm = ' + tx3(s.dm) + ' u → Q = Δm c² = ' + tx3(s.Q) + ' MeV（' + (s.Q >= 0 ? 'エネルギーを放出' : 'エネルギーを吸収') + '）', { size: 11 });
    d.text(190, 212, '※ 図は模式図（質量の差は大きく強調してある）', { size: 10, cls: 'dim' });
    return d.svg();
  }
  function dimLine(d, x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    d.arrow(mx, my, x1, y1, { cls: 'dim', w: 1.2 });
    d.arrow(mx, my, x2, y2, { cls: 'dim', w: 1.2 });
  }

  function stepsBind(mode, p, s) {
    const steps = [];
    // 次の式に代入する E_b（Q）。表示した値で計算し直しても、結果の有効数字 3 桁が合う桁数で見せる。
    // 演習は、表示した 3 桁の値から次の値を計算しているので、3 桁のまま（表示は変わらない）。計算機は、厳密な値から出すので、必要なら桁を増やす
    const gv = (g, i) => (g.d === 3 ? sig(g.v[i]) : g.t[i]);
    if (mode === 'binding') {
      const gE = guard((e) => [e / p.A, e * 1e6 * QE], [s.Eb], [s.EbA, s.EbJ], 3);
      steps.push({
        t: '核子の質量の和',
        m: [R`Z = ` + p.Z + R`,\ \ N = A - Z = ` + p.A + ' - ' + p.Z + ' = ' + s.N, R`m_{\text{和}} = Zm_{p} + Nm_{n} = ` + p.Z + R` \times 1.0073 + ` + s.N + R` \times 1.0087 = ` + fm(s.sum) + un('u')],
        n: R`原子核は、陽子 $Z$ 個と中性子 $N = A - Z$ 個（まとめて**核子**）からできています。陽子 1 個の質量は $1.0073\,\mathrm{u}$、中性子 1 個の質量は $1.0087\,\mathrm{u}$ です。$\mathrm{u}$（原子質量単位）は、原子の質量を表す単位で、$1\,\mathrm{u} = 1.66 \times 10^{-27}\,\mathrm{kg}$ です。まず、ばらばらの核子の質量を合計します。`,
        easy: R`原子核は、陽子と中性子がくっついた小さなかたまりです。まず、これらがばらばらの状態で何個あるか（陽子 $Z$ 個、中性子 $A - Z$ 個）を求め、それぞれの質量を掛けて足し合わせます。`,
        pro: R`$A = Z + N$（質量数 ＝ 陽子の数 ＋ 中性子の数）。中性子の数は $A - Z$ で求めます。`
      });
      steps.push({
        t: '質量欠損',
        m: [R`\Delta m = (Zm_{p} + Nm_{n}) - M = ` + fm(s.sum) + ' - ' + fm(p.M) + ' = ' + dmTex(s.dm) + un('u')],
        n: R`実際の原子核の質量 $M$ は、ばらばらの核子の質量の和よりも**小さく**なっています。この差を**質量欠損** $\Delta m$ といいます。`,
        easy: R`ばらばらの核子の質量の合計よりも、くっついた原子核の質量のほうが、ほんの少し軽くなっています。この「消えた質量」が質量欠損です。消えた質量は、くっつくときにエネルギーとして放出されたのです（次のステップ）。`,
        pro: R`質量欠損は $\Delta m = (\text{核子の質量の和}) - M$。引き算の向き（和 − 原子核）に注意します。`
      });
      steps.push({
        t: '結合エネルギー',
        m: [R`E_{b} = \Delta m \cdot c^{2},\qquad 1\,\mathrm{u} \;\text{は}\; 931.5\,\mathrm{MeV}\;\text{に相当}`, R`E_{b} = ` + dmTex(s.dm) + R` \times 931.5 = ` + sig(s.Eb) + un('MeV')],
        n: R`質量とエネルギーは同じものの別の表れで、質量 $\Delta m$ はエネルギー $E = \Delta m\,c^{2}$ に相当します（**アインシュタインの質量とエネルギーの等価性**）。$1\,\mathrm{u}$ の質量に相当するエネルギーは $931.5\,\mathrm{MeV}$ です。この $E_{b}$ が、原子核をばらばらにするのに必要な最小のエネルギー、つまり**結合エネルギー**です。`,
        easy: R`質量が減った分は、エネルギーに姿を変えて原子核から出ていきました（$E = mc^{2}$）。そのエネルギーが結合エネルギーです。逆に、くっついた原子核をばらばらにするには、同じ大きさのエネルギーを与える必要があります。$1\,\mathrm{u}$ あたり $931.5\,\mathrm{MeV}$ という換算の数を使うと、$\mathrm{kg}$ や $\mathrm{J}$ の計算をしなくても済みます。`,
        pro: R`$1\,\mathrm{u} = 931.5\,\mathrm{MeV}/c^{2}$ は暗記します。$\mathrm{MeV}$ のまま答えると、$\mathrm{J}$ への換算（$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$）が不要です。`
      });
      steps.push({
        t: '核子 1 個あたりの結合エネルギー',
        m: [R`\frac{E_{b}}{A} = \frac{` + gv(gE, 0) + '}{' + p.A + '} = ' + sig(s.EbA) + un('MeV')],
        n: R`結合エネルギーを質量数 $A$ で割った値は、核子 1 個あたりの結びつきの強さを表し、**大きいほど安定な原子核**です。鉄 $^{56}\mathrm{Fe}$ 付近で最大（約 $8.8\,\mathrm{MeV}$）になります。`,
        easy: R`原子核が大きくなるほど結合エネルギーの合計は大きくなりますが、核子の数も増えるので、1 個あたりに直して、原子核どうしを比べます。この値が大きい原子核ほど、核子どうしが強く結びついていて、安定です。`
      });
      steps.push({
        t: 'J に直すと',
        m: [R`E_{b} = ` + sig(s.Eb) + R`\,\mathrm{MeV} = ` + gv(gE, 0) + R` \times 10^{6} \times 1.60 \times 10^{-19} = ` + sig(s.EbJ) + un('J')],
        n: R`$1\,\mathrm{eV} = 1.60 \times 10^{-19}\,\mathrm{J}$、$1\,\mathrm{MeV} = 10^{6}\,\mathrm{eV}$ を使って $\mathrm{J}$ に直せます。`,
        easy: R`$\mathrm{MeV}$ は「100 万 $\mathrm{eV}$」です。$\mathrm{eV}$ から $\mathrm{J}$ へは $1.60 \times 10^{-19}$ を掛けます。1 個の原子核では小さな値ですが、たくさんの原子核が一度に反応すると、大きなエネルギーになります。`,
        lv: 2
      });
      steps.push({
        t: '結合エネルギーと原子核の安定性',
        n: R`1 核子あたりの結合エネルギーは、質量数が $56$ 付近で最大になります。これより軽い原子核どうしが**融合**（核融合）するか、重い原子核が**分裂**（核分裂）して $56$ 付近の原子核に近づくとき、1 核子あたりの結合エネルギーが増えるので、そのぶんのエネルギーが外へ放出されます。`,
        easy: R`グラフ（核子 1 個あたりの結合エネルギー）は、山のような形で、頂上が鉄 $^{56}\mathrm{Fe}$ 付近です。山のふもと側（軽い原子核・重い原子核）から頂上へ近づくときに、エネルギーが放出されます。太陽の核融合や、原子力発電の核分裂は、このしくみです。`,
        fig: graphBA(p, s),
        lv: 3
      });
    } else {
      // 反応前後の質量の合計。p.inTex / p.outTex（足し算の式）があるときは、その中身も示す
      const sumLine = (name, tex, v) => name + ' = ' + (tex && tex !== fm(v) ? tex + ' = ' : '') + fm(v) + un('u');
      const gQ = guard((q) => [q * 1e6 * QE], [s.Q], [s.QJ], 3);
      steps.push({
        t: '質量欠損（反応前後の質量の差）',
        m: (p.inTex ? [sumLine(R`M_{\text{前}}`, p.inTex, p.Min), sumLine(R`M_{\text{後}}`, p.outTex, p.Mout)] : [])
          .concat([R`\Delta m = M_{\text{前}} - M_{\text{後}} = ` + fm(p.Min) + ' - ' + fm(p.Mout) + ' = ' + dmTex(s.dm) + un('u')]),
        n: R`核反応の前後で、粒子の質量の合計はわずかに変化します。反応前の質量の合計から反応後の質量の合計を引いたものが質量欠損 $\Delta m$ で、**正ならエネルギーを放出、負ならエネルギーを吸収**する反応です。`,
        easy: R`原子核の反応では、反応の前と後で、粒子の質量の合計がほんの少し変わります。減った分の質量は、エネルギーに変わって外に出ます（増えた場合は、そのぶんのエネルギーを外から取り入れています）。まず、前と後の質量の合計の差を求めます。`,
        pro: R`質量の合計は、反応式の左辺・右辺の粒子すべてを足します（係数に注意）。`
      });
      steps.push({
        t: '放出（吸収）されるエネルギー',
        m: [R`Q = \Delta m \cdot c^{2} = ` + dmTex(s.dm) + R` \times 931.5 = ` + sig(s.Q) + un('MeV')],
        n: s.Q >= 0 ? R`質量が減ったので、エネルギー $Q = \Delta m\,c^{2}$ が放出されます（**発熱反応**）。$1\,\mathrm{u}$ の質量に相当するエネルギー $931.5\,\mathrm{MeV}$ を掛けます。` : R`質量が増えているので、エネルギー $|Q| = |\Delta m|\,c^{2}$ を外から吸収する必要があります（**吸熱反応**）。`,
        easy: R`減った質量 $\Delta m$ に、換算の数 $931.5\,\mathrm{MeV}$（$1\,\mathrm{u}$ あたり）を掛ければ、放出されるエネルギーが $\mathrm{MeV}$ で出ます。`
      });
      steps.push({
        t: 'J に直すと',
        m: [R`Q = ` + sig(s.Q) + R`\,\mathrm{MeV} = ` + gv(gQ, 0) + R` \times 10^{6} \times 1.60 \times 10^{-19} = ` + sig(s.QJ) + un('J')],
        n: R`$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$ です。`,
        easy: R`$\mathrm{MeV}$ から $\mathrm{J}$ へは、$1.60 \times 10^{-13}$ を掛けます。1 回の反応では小さな値ですが、たくさんの原子核が反応すると膨大なエネルギーになります。`,
        lv: 2
      });
    }
    return steps;
  }

  /* ---- 質量欠損・核反応の演習で使う質量データ ----
     実在の核種の質量を、高校の教科書・入試と同じ小数 4 桁 [u] で示す（原子の質量の測定値から。確実な値だけを使う）。
     原子核の質量 = 原子の質量 − Z × 0.00055 u（電子を含まない）。
     α崩壊・核分裂は、原子の質量どうしの差で質量欠損を求めてよい（反応の前後で電子の数が合うので、電子の質量は打ち消し合う） */
  const NUC = {                      // 結合エネルギーの演習: [Z, A, 原子核の質量, 名前, 元素記号]
    H2: [1, 2, 2.0136, '重水素', 'H'], H3: [1, 3, 3.0155, '三重水素', 'H'],
    He3: [2, 3, 3.0149, 'ヘリウム', 'He'], He4: [2, 4, 4.0015, 'ヘリウム', 'He'],
    Li6: [3, 6, 6.0135, 'リチウム', 'Li'], Li7: [3, 7, 7.0144, 'リチウム', 'Li'],
    Be9: [4, 9, 9.0100, 'ベリリウム', 'Be'], C12: [6, 12, 11.9967, '炭素', 'C'],
    N14: [7, 14, 13.9992, '窒素', 'N'], O16: [8, 16, 15.9905, '酸素', 'O'],
    Fe56: [26, 56, 55.9207, '鉄', 'Fe']
  };
  const M_H2 = NUC.H2[2], M_H3 = NUC.H3[2], M_HE3 = NUC.He3[2], M_HE4 = NUC.He4[2], M_LI7 = NUC.Li7[2], M_C12 = NUC.C12[2], M_O16 = NUC.O16[2];
  const M_HEA = 4.0026;              // ヘリウム 4 の原子の質量（α崩壊で使う）
  const ALPHA = [                    // α崩壊（親 → 娘 + α粒子）: 原子の質量
    { pn: 'ラジウム', pA: 226, ps: 'Ra', pM: 226.0254, dn: 'ラドン', dA: 222, ds: 'Rn', dM: 222.0176 },
    { pn: 'ラドン', pA: 222, ps: 'Rn', pM: 222.0176, dn: 'ポロニウム', dA: 218, ds: 'Po', dM: 218.0090 },
    { pn: 'ウラン', pA: 238, ps: 'U', pM: 238.0508, dn: 'トリウム', dA: 234, ds: 'Th', dM: 234.0436 },
    { pn: 'ウラン', pA: 235, ps: 'U', pM: 235.0439, dn: 'トリウム', dA: 231, ds: 'Th', dM: 231.0363 },
    { pn: 'トリウム', pA: 232, ps: 'Th', pM: 232.0381, dn: 'ラジウム', dA: 228, ds: 'Ra', dM: 228.0311 },
    { pn: 'ポロニウム', pA: 210, ps: 'Po', pM: 209.9829, dn: '鉛', dA: 206, ds: 'Pb', dM: 205.9745 }
  ];
  const M_U235 = 235.0439, M_BA141 = 140.9144, M_KR92 = 91.9262;      // 核分裂 ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n（原子の質量）
  const nuc = (A, s) => R`$^{` + A + R`}\mathrm{` + s + '}$';            // 問題文用の核種（$^{4}\mathrm{He}$）
  const um = (x) => R`$` + x.toFixed(4) + R`\,\mathrm{u}$`;               // 質量 [u]（小数 4 桁）
  const ATOM_NOTE = R`（原子の質量どうしの差を考えれば、電子の質量は打ち消し合う）`;
  // α崩壊の原子の質量の文
  const alphaMasses = (e) => R`原子 1 個の質量は、` + nuc(e.pA, e.ps) + R` が ` + um(e.pM) + R`、` + nuc(e.dA, e.ds) + R` が ` + um(e.dM) + R`、` + nuc(4, 'He') + R` が ` + um(M_HEA) + R` である` + ATOM_NOTE + R`。`;
  // 反応式の質量の合計。terms = [[個数, 質量 u], …]（質量は小数 4 桁なので、1e-4 u を単位とする整数で足して、浮動小数点の誤差を出さない）
  function rxnMass(inn, out) {
    const si = (ts) => ts.reduce((s, t) => s + t[0] * Math.round(t[1] * 1e4), 0);
    const tex = (ts) => ts.map((t) => (t[0] > 1 ? t[0] + R` \times ` : '') + t[1].toFixed(4)).join(' + ');
    const dm = (si(inn) - si(out)) / 1e4, Q = dm * UMEV;
    return { Min: si(inn) / 1e4, Mout: si(out) / 1e4, dm: dm, Q: Q, QJ: Q * 1e6 * QE, inTex: tex(inn), outTex: tex(out) };
  }
  const FISSION = {
    title: '核分裂反応のエネルギー', unit: 'rx',
    inn: [[1, M_U235], [1, MNE]], out: [[1, M_BA141], [1, M_KR92], [3, MNE]],
    text: R`ウラン ` + nuc(235, 'U') + R` の原子核が中性子を 1 個吸収して、バリウム ` + nuc(141, 'Ba') + R` の原子核とクリプトン ` + nuc(92, 'Kr') + R` の原子核と中性子 3 個に分裂する核分裂反応を考える。中性子 1 個の質量は ` + um(MNE) + R`、原子 1 個の質量は、` + nuc(235, 'U') + R` が ` + um(M_U235) + R`、` + nuc(141, 'Ba') + R` が ` + um(M_BA141) + R`、` + nuc(92, 'Kr') + R` が ` + um(M_KR92) + R` である` + ATOM_NOTE + R`。`
  };
  // 核反応のエネルギー（mid）: unit は「反応」か「崩壊」（回数を問う文に使う）
  const RXN = [
    {
      title: '核融合反応のエネルギー', unit: 'rx',
      inn: [[1, M_H2], [1, M_H3]], out: [[1, M_HE4], [1, MNE]],
      text: R`重水素 ` + nuc(2, 'H') + R` の原子核（質量 ` + um(M_H2) + R`）と三重水素 ` + nuc(3, 'H') + R` の原子核（質量 ` + um(M_H3) + R`）が反応して、ヘリウム ` + nuc(4, 'He') + R` の原子核（質量 ` + um(M_HE4) + R`）と中性子（質量 ` + um(MNE) + R`）ができる核融合反応を考える。`
    },
    {
      title: '重水素とヘリウム 3 の核融合反応', unit: 'rx',
      inn: [[1, M_H2], [1, M_HE3]], out: [[1, M_HE4], [1, MPR]],
      text: R`重水素 ` + nuc(2, 'H') + R` の原子核（質量 ` + um(M_H2) + R`）とヘリウム ` + nuc(3, 'He') + R` の原子核（質量 ` + um(M_HE3) + R`）が反応して、ヘリウム ` + nuc(4, 'He') + R` の原子核（質量 ` + um(M_HE4) + R`）と陽子（質量 ` + um(MPR) + R`）ができる核融合反応を考える。`
    },
    {
      title: '陽子とリチウムの核反応', unit: 'rx',
      inn: [[1, MPR], [1, M_LI7]], out: [[2, M_HE4]],
      text: R`陽子（質量 ` + um(MPR) + R`）がリチウム ` + nuc(7, 'Li') + R` の原子核（質量 ` + um(M_LI7) + R`）に衝突して、ヘリウム ` + nuc(4, 'He') + R` の原子核（質量 ` + um(M_HE4) + R`）が 2 個できる核反応を考える。`
    },
    {
      title: 'ヘリウムから炭素ができる核融合反応', unit: 'rx',
      inn: [[3, M_HE4]], out: [[1, M_C12]],
      text: R`恒星の内部では、ヘリウム ` + nuc(4, 'He') + R` の原子核（質量 ` + um(M_HE4) + R`）が 3 個融合して、炭素 ` + nuc(12, 'C') + R` の原子核（質量 ` + um(M_C12) + R`）が 1 個できる核融合反応が起こる。`
    },
    {
      title: '炭素とヘリウムの核融合反応', unit: 'rx',
      inn: [[1, M_C12], [1, M_HE4]], out: [[1, M_O16]],
      text: R`炭素 ` + nuc(12, 'C') + R` の原子核（質量 ` + um(M_C12) + R`）とヘリウム ` + nuc(4, 'He') + R` の原子核（質量 ` + um(M_HE4) + R`）が融合して、酸素 ` + nuc(16, 'O') + R` の原子核（質量 ` + um(M_O16) + R`）ができる核融合反応を考える。`
    }
  ].concat(ALPHA.map((e) => ({
    title: e.pn + ' ' + e.pA + ' のα崩壊で放出されるエネルギー', unit: 'decay',
    inn: [[1, e.pM]], out: [[1, e.dM], [1, M_HEA]],
    text: e.pn + ' ' + nuc(e.pA, e.ps) + R` の原子核がα崩壊して、` + e.dn + ' ' + nuc(e.dA, e.ds) + R` の原子核とα粒子（` + nuc(4, 'He') + R` の原子核）に変わる。` + alphaMasses(e)
  })), [FISSION]);
  // 燃料の質量から取り出せるエネルギー（adv）: 核分裂（²³⁵U）と核融合（重水素 + 同じ数の三重水素）。すべての原子核が反応を 1 回ずつ起こす
  const FUEL = [
    {
      rx: FISSION, title: '核分裂で得られるエネルギー', molar: 235, molarTex: '235', masses: [0.5, 1, 1.5, 2, 5],
      molTxt: nuc(235, 'U') + R` の $1\,\mathrm{mol}$ の質量を $235\,\mathrm{g}$`,
      useTxt: (m) => R`$` + sf(m) + R`\,\mathrm{g}$ の ` + nuc(235, 'U') + R` を用意し、そのすべての原子核が上の反応を 1 回ずつ起こすものとする。`,
      qN: (m) => R`$` + sf(m) + R`\,\mathrm{g}$ の ` + nuc(235, 'U') + R` にふくまれる原子核の数`
    },
    {
      rx: RXN[0], title: '核融合で得られるエネルギー', molar: 2.0, molarTex: '2.0', masses: [1, 2, 3, 4, 6],      // 原子核の数が有効数字 3 桁の丸めの境目（1.505 など）に落ちない質量
      molTxt: R`重水素 ` + nuc(2, 'H') + R` の $1\,\mathrm{mol}$ の質量を $2.0\,\mathrm{g}$`,
      useTxt: (m) => R`$` + sf(m) + R`\,\mathrm{g}$ の重水素と、それと同じ数の三重水素を用意し、そのすべての原子核が上の反応を 1 回ずつ起こすものとする。`,
      qN: (m) => R`$` + sf(m) + R`\,\mathrm{g}$ の重水素にふくまれる原子核の数（反応が起こる回数に等しい）`
    }
  ];

  JK.registerSim({
    id: 'atom-binding',
    field: '原子',
    unit: 'p-atom',
    title: '質量欠損と結合エネルギー（核反応のエネルギー）',
    desc: '原子核の質量から質量欠損 $\\Delta m$ と結合エネルギー $E_{b} = \\Delta m\\,c^{2}$（$1\\,\\mathrm{u} = 931.5\\,\\mathrm{MeV}$）、核子 1 個あたりの結合エネルギーを求めます。また、核反応の前後の質量の差から放出されるエネルギーも求めます。',
    form: [R`\Delta m = (Zm_{p} + Nm_{n}) - M`, R`E_{b} = \Delta m\,c^{2},\qquad 1\,\mathrm{u} \Rightarrow 931.5\,\mathrm{MeV}`, R`Q = (M_{\text{前}} - M_{\text{後}})c^{2}`],
    inputs: [
      { key: 'mode', label: '調べる内容', type: 'select', def: 'binding', options: [['binding', '原子核の結合エネルギー'], ['reaction', '核反応で放出されるエネルギー']] },
      { key: 'Z', label: '陽子の数（原子番号）$Z$', type: 'int', def: '2', min: 1, max: 118, show: (raw) => raw.mode !== 'reaction' },
      { key: 'A', label: '質量数 $A$', type: 'int', def: '4', min: 2, max: 300, show: (raw) => raw.mode !== 'reaction' },
      { key: 'M', label: '原子核の質量 $M$', unit: 'u', type: 'num', def: '4.0015', min: 1, max: 400, hint: '原子核（電子を含まない）の質量', show: (raw) => raw.mode !== 'reaction' },
      { key: 'Min', label: '反応前の質量の合計', unit: 'u', type: 'num', def: '5.0291', min: 0.001, max: 1000, show: (raw) => raw.mode === 'reaction' },
      { key: 'Mout', label: '反応後の質量の合計', unit: 'u', type: 'num', def: '5.0102', min: 0.001, max: 1000, show: (raw) => raw.mode === 'reaction' }
    ],
    examples: [
      { label: 'ヘリウム 4（He）', v: { mode: 'binding', Z: '2', A: '4', M: '4.0015' } },
      { label: '炭素 12（C）', v: { mode: 'binding', Z: '6', A: '12', M: '11.9967' } },
      { label: '重水素（H）', v: { mode: 'binding', Z: '1', A: '2', M: '2.0136' } },
      { label: '核融合 D + T → He + n', v: { mode: 'reaction', Min: '5.0291', Mout: '5.0102' } }
    ],
    intro: {
      easy: R`陽子や中性子がくっついた原子核の質量は、ばらばらの陽子・中性子の質量の合計より、**ほんの少し軽く**なっています。この「消えた質量」（**質量欠損**）は、原子核ができるときに、エネルギー $E = \Delta m\,c^{2}$ として放出されています。このエネルギーが**結合エネルギー**で、原子核をばらばらにするときに必要なエネルギーでもあります。原子核の反応（核融合や核分裂）でも、反応の前後の質量の差が、エネルギーとして放出されます。`,
      normal: R`$\Delta m = (Zm_{p} + Nm_{n}) - M$、$E_{b} = \Delta m\,c^{2}$（$1\,\mathrm{u}$ は $931.5\,\mathrm{MeV}$ に相当）。核子 1 個あたり $\dfrac{E_{b}}{A}$ が大きいほど安定です。核反応では $Q = (M_{\text{前}} - M_{\text{後}})c^{2}$（正なら放出）。`,
      pro: R`$N = A - Z$、質量欠損を $\mathrm{u}$ で出して $931.5$ を掛けるだけで $\mathrm{MeV}$ の値になります。$\dfrac{E_{b}}{A}$ は $^{56}\mathrm{Fe}$ 付近で最大（約 $8.8\,\mathrm{MeV}$）。核融合・核分裂のどちらも、$\dfrac{E_{b}}{A}$ が増える向きの反応でエネルギーが放出されます。`
    },
    compute(v) {
      if (v.mode === 'reaction') {
        const dm = v.Min - v.Mout, Q = dm * UMEV;
        if (![dm, Q].every(isFinite)) throw new JK.CalcError('値が大きすぎて計算できません。');
        const s = { dm: dm, Q: Q, QJ: Q * 1e6 * QE };
        const p = { Min: v.Min, Mout: v.Mout };
        return {
          result: [
            { label: '質量欠損 Δm（反応前 − 反応後）', tex: sig(dm) + un('u') + R`\ \ (` + sig(dm * 1.66e-27) + R`\,\mathrm{kg})` },
            { label: '放出（吸収）されるエネルギー Q', tex: sig(Q) + un('MeV') + R`\ \ (= ` + sig(s.QJ) + R`\,\mathrm{J})` },
            { label: 'この反応は', tex: dm > 0 ? R`\text{エネルギーを放出する（発熱反応）}` : (dm < 0 ? R`\text{エネルギーを吸収する（吸熱反応）}` : R`\text{エネルギーの出入りなし}`) }
          ],
          steps: stepsBind('reaction', p, s),
          fig: figReaction(p, s)
        };
      }
      if (v.Z > v.A) throw new JK.CalcError('陽子の数 Z が質量数 A より大きくなっています（Z ≤ A にしてください）。');
      const p = { Z: v.Z, A: v.A, M: v.M };
      const s = solveBind(p);
      if (!(s.dm > 0)) throw new JK.CalcError('原子核の質量 M が、ばらばらの核子の質量の和 ' + s.sum.toPrecision(5) + ' u 以上になっています。原子核の質量（電子を含まない）を、それより小さい値で入力してください。');
      if (![s.Eb, s.EbA].every(isFinite)) throw new JK.CalcError('値が大きすぎて計算できません。');
      return {
        result: [
          { label: '核子（陽子 + 中性子）の質量の和', tex: fm(s.sum) + un('u') + R`\ \ (Z = ` + p.Z + R`,\ N = ` + s.N + R`)` },
          { label: '質量欠損 Δm', tex: sig(s.dm) + un('u') + R`\ \ (` + sig(s.dmKg) + R`\,\mathrm{kg})` },
          { label: '結合エネルギー E_b', tex: sig(s.Eb) + un('MeV') + R`\ \ (= ` + sig(s.EbJ) + R`\,\mathrm{J})` },
          { label: '核子 1 個あたりの結合エネルギー E_b / A', tex: sig(s.EbA) + un('MeV') }
        ],
        steps: stepsBind('binding', p, s),
        fig: stack2(graphBA(p, s), figDeficit(p, s))
      };
    },
    exercise(rng, level) {
      const massTxt = R`陽子の質量を $1.0073\,\mathrm{u}$、中性子の質量を $1.0087\,\mathrm{u}$、$1\,\mathrm{u}$ の質量に相当するエネルギーを $931.5\,\mathrm{MeV}$`;
      if (level === 'adv') {
        if (rng.bool(0.4)) {
          // 燃料の質量から取り出せるエネルギー: 1 回の反応の Q、燃料にふくまれる原子核の数（アボガドロ定数）、すべて反応したときの合計
          const fu = rng.pick(FUEL), mg = rng.pick(fu.masses);
          const r = rxnMass(fu.rx.inn, fu.rx.out);
          const p = { Min: r.Min, Mout: r.Mout, inTex: r.inTex, outTex: r.outTex };
          // 解説に表示した値（有効数字 3 桁）から次の値を計算する（表示どおりに電卓で計算すると、答えと同じになる）
          const NA = 6.02e23, N = ans(mg / fu.molar * NA), Q3 = ans(r.Q), QJ3 = ans(Q3 * 1e6 * QE), E = N * QJ3;
          const s = { dm: r.dm, Q: Q3, QJ: QJ3 };
          const sol = stepsBind('reaction', p, s).slice(0, 2);
          sol.push({
            t: '燃料にふくまれる原子核の数',
            m: [R`N = \frac{m}{M}N_{A} = \frac{` + sf(mg) + '}{' + fu.molarTex + R`} \times 6.02 \times 10^{23} = ` + sig(N)],
            n: R`質量 $m$ を $1\,\mathrm{mol}$ の質量 $M$ で割ると物質量（$\mathrm{mol}$）が求まり、それにアボガドロ定数 $N_{A}$ を掛けると原子核の数になります。`,
            easy: R`まず、物質量（$\mathrm{mol}$）を求めます。$1\,\mathrm{mol}$ あたりの質量で、ある質量を割れば、何 $\mathrm{mol}$ あるかが分かります。$1\,\mathrm{mol}$ には $6.02 \times 10^{23}$ 個の粒子があるので、物質量にこの数を掛ければ、原子核の数になります。`
          });
          sol.push({
            t: '放出されるエネルギーの合計',
            m: [R`Q = ` + sig(Q3) + R`\,\mathrm{MeV} = ` + sig(Q3) + R` \times 1.60 \times 10^{-13} = ` + sig(QJ3) + un('J'), R`E = N \times Q = ` + sig(N) + R` \times ` + sig(QJ3) + R` = ` + sig(E) + un('J')],
            n: R`原子核の 1 個ずつが反応して $Q$ のエネルギーを放出するので、合計は反応の回数 $N$ に $Q$ を掛けたものです。$Q$ は $\mathrm{J}$ に直した値（$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$）を使います。`,
            easy: R`1 回の反応で出るエネルギーに、反応の回数を掛ければ、全部の合計になります。1 回では小さなエネルギーでも、原子核の数がとても多いので、合計は大きな値になります。`
          });
          return {
            title: fu.title,
            body: fu.rx.text + R`$1\,\mathrm{u}$ の質量に相当するエネルギーを $931.5\,\mathrm{MeV}$、$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$、` + fu.molTxt + R`、アボガドロ定数を $6.02 \times 10^{23}\,\mathrm{/mol}$ とする。` + fu.useTxt(mg) + R`次の問いに答えよ。`,
            fig: figReaction(p, s, true),
            parts: [
              numPart('(1)', R`1 回の反応で放出されるエネルギー $Q$（$\mathrm{MeV}$ で）`, s.Q, 'MeV'),
              numPart('(2)', fu.qN(mg), N, '個'),
              numPart('(3)', R`すべての原子核が反応したときに放出されるエネルギーの合計（$\mathrm{J}$ で）`, E, 'J')
            ],
            solution: sol
          };
        }
        // α崩壊（静止していた親の原子核 → 娘の原子核 + α粒子）: Q、運動量保存から運動エネルギーと速さ。(2)(3) は α粒子 / 娘の原子核のどちらか
        const e = rng.pick(ALPHA), who = rng.pick(['alpha', 'daughter']);
        const r = rxnMass([[1, e.pM]], [[1, e.dM], [1, M_HEA]]);
        const p = { Min: r.Min, Mout: r.Mout, inTex: r.inTex, outTex: r.outTex };
        const s = { dm: r.dm, Q: r.Q, QJ: r.QJ };
        const MAL = 6.64e-27, Ad = e.dA, Q = r.Q, dn = e.dn + '原子核', dsT = R`\mathrm{` + e.ds + '}';
        // 解説に表示した値（有効数字 3 桁）から次の値を計算する（表示どおりに電卓で計算すると、答えと同じになる）
        const Q3 = ans(Q), Ka = ans(Q3 * Ad / (Ad + 4)), Kd = ans(Q3 * 4 / (Ad + 4)), pct = Math.round(100 * Ad / (Ad + 4));
        const sol = stepsBind('reaction', p, s).slice(0, 2);
        const momentum = R`0 = m_{\alpha}v_{\alpha} - m_{` + dsT + R`}v_{` + dsT + R`} \;\Rightarrow\; `;
        const stay = R`崩壊前に静止していたので、崩壊後のα粒子と` + dn + R`の運動量の大きさは等しくなります（運動量保存）。運動エネルギーは $K = \dfrac{p^{2}}{2m}$ なので、質量に**反比例**して配分されます。`;
        let part2, part3;
        if (who === 'alpha') {
          const Kj = ans(Ka * 1e6 * QE), v = Math.sqrt(2 * Kj / MAL);
          sol.push({
            t: 'α粒子の運動エネルギー（運動量保存）',
            m: [momentum + R`\frac{K_{\alpha}}{K_{` + dsT + R`}} = \frac{m_{` + dsT + R`}}{m_{\alpha}} = \frac{` + Ad + R`}{4}`, R`K_{\alpha} = Q \times \frac{` + Ad + R`}{` + Ad + R` + 4} = ` + sig(Q) + R` \times \frac{` + Ad + '}{' + (Ad + 4) + R`} = ` + sig(Ka) + un('MeV')],
            n: stay + R`放出されるエネルギー $Q$ は、質量数の比（$` + Ad + R` : 4$）で分けられ、α粒子の分は $\dfrac{` + Ad + '}{' + (Ad + 4) + R`}$ です。`,
            easy: R`止まっていたものが 2 つに分かれて飛び出すとき、勢い（運動量）は同じ大きさで反対向きです。同じ勢いなら、軽い方が速く、エネルギーもたくさんもらいます。` + dn + R`はα粒子の $\dfrac{` + Ad + R`}{4}$ 倍重いので、エネルギーの大部分（約 $` + pct + R`\,\%$）は軽いα粒子がもらいます。`,
            pro: R`$K_{\alpha} = Q\dfrac{A_{` + dsT + R`}}{A_{` + dsT + R`} + A_{\alpha}}$。質量は質量数の比で近似します（問題文の指示に従います）。`
          });
          sol.push({
            t: 'α粒子の速さ',
            m: [R`K_{\alpha} = ` + sig(Ka) + R`\,\mathrm{MeV} = ` + sig(Kj) + un('J'), R`\frac{1}{2}m_{\alpha}v^{2} = K_{\alpha} \;\Rightarrow\; v = \sqrt{\frac{2K_{\alpha}}{m_{\alpha}}} = \sqrt{\frac{2 \times ` + sig(Kj) + R`}{6.64 \times 10^{-27}}} = ` + sig(v) + un('m/s')],
            n: R`運動エネルギーを $\mathrm{J}$ に直し（$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$）、$K = \dfrac{1}{2}mv^{2}$ から速さを求めます。光速の約 $` + Math.round(v / C * 100) + R`\,\%$ で、相対論を使う必要のない範囲です。`,
            easy: R`$\mathrm{MeV}$ を $\mathrm{J}$ に直してから、運動エネルギーの式 $\dfrac{1}{2}mv^{2}$ に当てはめて速さを求めます。α粒子の質量は $6.64 \times 10^{-27}\,\mathrm{kg}$ です。`
          });
          part2 = numPart('(2)', R`放出されたα粒子の運動エネルギー $K_{\alpha}$（$\mathrm{MeV}$）`, Ka, 'MeV');
          part3 = numPart('(3)', R`α粒子の速さ $v$`, v, 'm/s');
        } else {
          const md = ans(MAL * Ad / 4), Kj = ans(Kd * 1e6 * QE), v = Math.sqrt(2 * Kj / md);
          sol.push({
            t: dn + R`の運動エネルギー（運動量保存）`,
            m: [momentum + R`\frac{K_{` + dsT + R`}}{K_{\alpha}} = \frac{m_{\alpha}}{m_{` + dsT + R`}} = \frac{4}{` + Ad + R`}`, R`K_{` + dsT + R`} = Q \times \frac{4}{` + Ad + R` + 4} = ` + sig(Q) + R` \times \frac{4}{` + (Ad + 4) + R`} = ` + sig(Kd) + un('MeV')],
            n: stay + R`重い` + dn + R`の分は小さくなり、放出されるエネルギー $Q$ のうち、` + dn + R`の分は $\dfrac{4}{` + (Ad + 4) + R`}$ です。`,
            easy: R`止まっていたものが 2 つに分かれて飛び出すとき、勢い（運動量）は同じ大きさで反対向きです。同じ勢いなら、重い方はゆっくり動き、エネルギーもわずかしかもらえません。` + dn + R`はα粒子の $\dfrac{` + Ad + R`}{4}$ 倍重いので、エネルギーのうち約 $` + (100 - pct) + R`\,\%$ だけをもらいます。`,
            pro: R`$K_{` + dsT + R`} = Q - K_{\alpha}$ でも求まります。質量は質量数の比で近似します（問題文の指示に従います）。`
          });
          sol.push({
            t: dn + R`の速さ`,
            m: [R`m_{` + dsT + R`} = 6.64 \times 10^{-27} \times \frac{` + Ad + R`}{4} = ` + sig(md) + un('kg'), R`K_{` + dsT + R`} = ` + sig(Kd) + R`\,\mathrm{MeV} = ` + sig(Kj) + un('J'), R`\frac{1}{2}m_{` + dsT + R`}v_{` + dsT + R`}^{2} = K_{` + dsT + R`} \;\Rightarrow\; v_{` + dsT + R`} = \sqrt{\frac{2K_{` + dsT + R`}}{m_{` + dsT + R`}}} = \sqrt{\frac{2 \times ` + sig(Kj) + '}{' + sig(md) + R`}} = ` + sig(v) + un('m/s')],
            n: dn + R`の質量は、質量数の比（$` + Ad + R` : 4$）から、α粒子の質量の $\dfrac{` + Ad + R`}{4}$ 倍です。運動エネルギーを $\mathrm{J}$ に直し（$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$）、$K = \dfrac{1}{2}mv^{2}$ から速さを求めます。`,
            easy: R`$\mathrm{MeV}$ を $\mathrm{J}$ に直してから、運動エネルギーの式 $\dfrac{1}{2}mv^{2}$ に当てはめて速さを求めます。` + dn + R`の質量は、α粒子の質量 $6.64 \times 10^{-27}\,\mathrm{kg}$ の $\dfrac{` + Ad + R`}{4}$ 倍です。`,
            pro: R`運動量が等しいので、$v_{` + dsT + R`} = \dfrac{4}{` + Ad + R`}v_{\alpha}$ からも求まります。`
          });
          part2 = numPart('(2)', R`崩壊後の` + dn + R`の運動エネルギー $K_{` + dsT + R`}$（$\mathrm{MeV}$）`, Kd, 'MeV');
          part3 = numPart('(3)', dn + R`の速さ $v_{` + dsT + R`}$`, v, 'm/s');
        }
        return {
          title: e.pn + ' ' + e.pA + ' のα崩壊',
          body: R`静止していた` + e.pn + ' ' + nuc(e.pA, e.ps) + R` の原子核が、α崩壊して` + e.dn + ' ' + nuc(e.dA, e.ds) + R` の原子核とα粒子（` + nuc(4, 'He') + R` の原子核）に変わった。` + alphaMasses(e) + dn + R`とα粒子の質量の比は、質量数の比 $` + Ad + R` : 4$ としてよい。$1\,\mathrm{u}$ の質量に相当するエネルギーを $931.5\,\mathrm{MeV}$、α粒子の質量を $6.64 \times 10^{-27}\,\mathrm{kg}$、$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$ として、次の問いに答えよ。`,
          fig: figReaction(p, s, true),
          parts: [numPart('(1)', R`この崩壊で放出されるエネルギー $Q$（$\mathrm{MeV}$）`, Q, 'MeV'), part2, part3],
          solution: sol
        };
      }
      if (level === 'mid') {
        // 核反応・崩壊のエネルギー: 質量欠損、Q（MeV）、(3) は Q を J で表した値 / その反応が N 回起こったときの合計（J）
        const rx = rng.pick(RXN), r = rxnMass(rx.inn, rx.out), noun = rx.unit === 'decay' ? '崩壊' : '反応';
        const p = { Min: r.Min, Mout: r.Mout, inTex: r.inTex, outTex: r.outTex };
        // 解説に表示した値（有効数字 3 桁）から次の値を計算する（表示どおりに電卓で計算すると、答えと同じになる）
        const Q3 = ans(r.Q), s = { dm: r.dm, Q: Q3, QJ: Q3 * 1e6 * QE };
        const sol = stepsBind('reaction', p, s);
        sol[2] = Object.assign({}, sol[2], { lv: 1 });      // J への換算は (3) で問う（または (3) の前提）ので、簡潔な表示でも残す
        let part3;
        if (rng.bool(0.5)) {
          const N = rng.pick([1e20, 2e20, 5e20]), E = N * ans(s.QJ);      // 解説に表示した Q（J）に N を掛ける
          part3 = numPart('(3)', (rx.unit === 'decay' ? R`この崩壊が $` + sf(N) + R`$ 個の原子核で 1 回ずつ起こったとき、` : R`この反応が $` + sf(N) + R`$ 回起こったとき、`) + R`放出されるエネルギーの合計（$\mathrm{J}$ で）`, E, 'J');
          sol.push({
            t: noun + R`が何回も起こったときのエネルギー`,
            m: [R`E = N \times Q = ` + sf(N) + R` \times ` + sig(s.QJ) + un('J') + R` = ` + sig(E) + un('J')],
            n: R`1 回の` + noun + R`で $Q$ のエネルギーが放出されるので、$N$ 回では $N$ 倍のエネルギーが放出されます。$Q$ は $\mathrm{J}$ に直した値を使います。`,
            easy: R`1 回で出るエネルギーに、回数を掛けるだけです。$\mathrm{MeV}$ のままでなく、$\mathrm{J}$ に直した値を使うことに注意しましょう。`
          });
        } else {
          part3 = numPart('(3)', R`$Q$ を $\mathrm{J}$ で表した値`, s.QJ, 'J');
        }
        return {
          title: rx.title,
          body: rx.text + R`$1\,\mathrm{u}$ の質量に相当するエネルギーを $931.5\,\mathrm{MeV}$、$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$ として、次の問いに答えよ。`,
          fig: figReaction(p, s, true),
          parts: [
            numPart('(1)', noun + R`の前後での質量の減少（質量欠損）$\Delta m$`, s.dm, 'u', { answer: s.dm }),
            numPart('(2)', R`この` + noun + R`で放出されるエネルギー $Q$（$\mathrm{MeV}$）`, s.Q, 'MeV'),
            part3
          ],
          solution: sol
        };
      }
      // basic: 原子核の質量から質量欠損と結合エネルギー。(3) は E_b（MeV）/ 核子 1 個あたり E_b/A / J に換算した E_b のどれか
      const nz = NUC[rng.pick(Object.keys(NUC))], kind = rng.pick(['Eb', 'EbA', 'EbJ']);
      const p = { Z: nz[0], A: nz[1], M: nz[2] };
      const s = solveBind(p);
      // 解説に表示した値（有効数字 3 桁）から次の値を計算する（表示どおりに電卓で計算すると、答えと同じになる）
      const Eb3 = ans(s.Eb);
      s.Eb = Eb3; s.EbA = Eb3 / p.A; s.EbJ = Eb3 * 1e6 * QE;
      const st = stepsBind('binding', p, s);
      const dmPart = (label) => numPart(label, R`質量欠損 $\Delta m$`, s.dm, 'u', { answer: exact4(s.dm) });
      const ebPart = (label) => numPart(label, R`原子核の結合エネルギー $E_{b}$（$\mathrm{MeV}$ で）`, s.Eb, 'MeV');
      let title, parts, sol;
      if (kind === 'EbA') {
        title = '核子 1 個あたりの結合エネルギー';
        parts = [dmPart('(1)'), ebPart('(2)'), numPart('(3)', R`核子 1 個あたりの結合エネルギー $\dfrac{E_{b}}{A}$（$\mathrm{MeV}$ で）`, s.EbA, 'MeV')];
        sol = st.slice(0, 4);
      } else if (kind === 'EbJ') {
        title = '原子核の結合エネルギー（J への換算）';
        parts = [dmPart('(1)'), ebPart('(2)'), numPart('(3)', R`$E_{b}$ を $\mathrm{J}$ で表した値`, s.EbJ, 'J')];
        sol = st.slice(0, 3).concat([Object.assign({}, st[4], { lv: 1 })]);      // J への換算は (3) で問うので、簡潔な表示でも残す
      } else {
        title = '原子核の質量欠損と結合エネルギー';
        parts = [numPart('(1)', R`ばらばらの陽子・中性子の質量の和`, s.sum, 'u', { answer: exact4(s.sum) }), dmPart('(2)'), numPart('(3)', R`原子核の結合エネルギー $E_{b}$（$\mathrm{MeV}$）`, s.Eb, 'MeV')];
        sol = st.slice(0, 3);
      }
      return {
        title: title,
        body: nz[3] + ' ' + nuc(nz[1], nz[4]) + R` の原子核の質量は ` + um(nz[2]) + R` である（陽子 $` + nz[0] + R`$ 個、質量数 $` + nz[1] + R`$）。` + massTxt + (kind === 'EbJ' ? R`、$1\,\mathrm{MeV} = 1.60 \times 10^{-13}\,\mathrm{J}$` : '') + R` とする。次の問いに答えよ。`,
        fig: figDeficit(p, s, true),
        parts: parts,
        solution: sol
      };
    }
  });

  // 2 つの SVG を縦に並べる
  function stack2(a, b) {
    const ma = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(a), mb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(b);
    const wa = Number(ma[1]), ha = Number(ma[2]), wb = Number(mb[1]), hb = Number(mb[2]), w = Math.max(wa, wb);
    const inner = (s) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return '<svg class="jk-plot jk-draw" viewBox="0 0 ' + w + ' ' + (ha + hb) + '" width="' + w + '" height="' + (ha + hb) + '" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<g transform="translate(' + ((w - wa) / 2) + ',0)">' + inner(a) + '</g><g transform="translate(' + ((w - wb) / 2) + ',' + ha + ')">' + inner(b) + '</g></svg>';
  }
})();
