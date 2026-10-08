/* 物理・電磁気 — 直流回路: オームの法則 / 合成抵抗 / 電池の内部抵抗 / キルヒホッフの法則
   構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  // 有効数字 3 桁の四捨五入（20.25 のようにちょうど半端な値は 20.3 に切り上げる）。
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
  const OHM = R`\,\Omega`;
  // 途中の値を次の式に代入して見せるときの、有効数字の桁数。途中の値を n 桁に丸めて表示どおりに計算しても、
  // 表示する結果（有効数字 3 桁）と一致する最小の n（3〜10）を返す（見つからなければ 11）。3 桁の値で計算すると最後の桁がずれるときだけ桁が増える。
  // vals: 途中の値の配列、checks: [表示どおりの計算（丸めた vals を受ける関数）, 表示する結果] の組（複数なら全部が合う n）
  function nd(vals) {
    const checks = Array.prototype.slice.call(arguments, 1);
    for (let n = 3; n <= 10; n++) {
      const rv = vals.map((v) => U.roundSig(v, n));
      if (checks.every((c) => {
        const a = c[0].apply(null, rv), b = c[1];
        return b === 0 ? Math.abs(a) < 1e-9 * Math.max.apply(null, vals.map(Math.abs).concat([1e-300])) : rd3(a) === rd3(b);
      })) return n;
    }
    return 11;
  }
  const sn = (x, n) => U.sig(x, n);        // 有効数字 n 桁の TeX（途中の値の代入表示用）
  // 途中の値を 4 桁以上で書いたときの一言（n: 桁数、names: 途中の値の記号の TeX の配列）
  const more = (n, names) => (n > 3 ? R`途中の値 ` + names.map((s) => '$' + s + '$').join('、') + R` は、最後の桁が合うように有効数字 ` + n + R` 桁で書いています。` : '');
  // 同じステップに注記が複数あるとき 1 つの文にまとめる。引数は [桁数, 記号の配列] の組（桁数が 3 のものは書かない）
  function moreAll() {
    const by = {};
    Array.prototype.slice.call(arguments).forEach((p) => {
      if (p[0] > 3) { by[p[0]] = by[p[0]] || []; p[1].forEach((s) => { if (by[p[0]].indexOf(s) < 0) by[p[0]].push(s); }); }
    });
    const ks = Object.keys(by).map(Number).sort((x, y) => x - y);
    if (ks.length < 2) return ks.length ? more(ks[0], by[ks[0]]) : '';
    return R`途中の値 ` + ks.map((k) => by[k].map((s) => '$' + s + '$').join('、') + R` は有効数字 ` + k + ' 桁').join('、') + R` で書いています（最後の桁が合うようにするため）。`;
  }

  // 入力値の表示用: 与えた値をそのまま（2 進数の誤差だけ 10 桁で除く）、末尾の 0 は除去、極端に大小の値は指数表記。
  // 5 桁以上の入力を 4 桁に丸めて見せると、式を表示どおりに計算したときに結果と合わなくなる。和・差など計算で作った値もこれを通す
  function nice(x) {
    if (!isFinite(x) || x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12);
    if (e >= -3 && e <= 6) return String(Number(x.toPrecision(10)));
    let m = Number((x / Math.pow(10, e)).toPrecision(10)), ee = e;
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
  // 図ラベル用（プレーンテキスト）: 6 → 6.0 / 0.5 → 0.50 / 12 → 12
  function tx(x) { return sf(x).replace(R` \times 10^{`, '×10^').replace('}', ''); }
  // 問題文に書く数値は有効数字 3 桁以内で正確に表せること（丸めると解答値とずれるため）
  function ok3(x) { return Math.abs(Number(x.toPrecision(3)) - x) <= 1e-9 * Math.abs(x); }
  // 負の数だけ括弧で包む（代入表示用。TeX 文字列を受ける）
  function par(s) { return s.charAt(0) === '-' ? R`\left(` + s + R`\right)` : s; }
  // 2 乗の表示用: 負の数や指数表記（a \times 10^{n}）の値は括弧で包んでから 2 乗する
  function sq(s) { return (s.charAt(0) === '-' || s.indexOf(R`\times`) >= 0) ? R`\left(` + s + R`\right)^{2}` : s + '^{2}'; }
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

  /* =====================================================================
     1. オームの法則の基本
     ===================================================================== */

  function solveOhm(find, V, I, Rv) {
    if (find === 'I') I = V / Rv;
    else if (find === 'V') V = Rv * I;
    else Rv = V / I;
    return { V: V, I: I, R: Rv, P: V * I };
  }

  // 電池 1 個 + 抵抗 1 個の回路。tV/tI/tR は図に書くラベル（未知の量は「?」を渡す）
  function figOhm(tV, tI, tR) {
    const d = JK.plot.draw(360, 190);
    const xL = 90, xR = 270, yT = 40, yB = 150;
    d.battery(xL, 70, xL, 120);
    d.wire([[xL, 70], [xL, yT], [xR, yT], [xR, 65]]);
    d.resistor(xR, 65, xR, 125);
    d.wire([[xR, 125], [xR, yB], [xL, yB], [xL, 120]]);
    d.arrow(150, yT, 190, yT, { cls: 'c3' });
    d.arrow(190, yB, 150, yB, { cls: 'c3' });
    d.text(170, yT - 8, 'I');
    d.text(170, yB + 18, 'I');
    d.text(xL - 9, 64, '+', { anchor: 'middle', bold: true });
    d.text(xL - 9, 138, '−', { anchor: 'middle', bold: true });
    d.text(xL + 14, 100, tV, { anchor: 'start' });
    d.text(205, 101, tI, { anchor: 'start' });
    d.text(xR + 14, 99, tR, { anchor: 'start' });
    d.text(180, 183, '電流は電池の＋極 → 抵抗 → −極の向き', { cls: 'dim' });
    return d.svg();
  }

  function graphVI(Rv, I, V) {
    const Imax = I * 1.7;
    return JK.plot.graph({
      w: 300, h: 210, x: [0, Imax], y: [0, Rv * Imax],
      curves: [{ f: (x) => Rv * x, cls: 'c1' }],
      points: [{ x: I, y: V, label: '(I, V)', cls: 'c3', pos: 'br' }],
      vlines: [{ x: I, dash: true }], hlines: [{ y: V, dash: true }],
      axis: ['I [A]', 'V [V]']
    });
  }

  function stepsOhm(p, r, opt) {
    opt = opt || {};
    const find = p.find;
    const V = nice(r.V), I = nice(r.I), Rv = nice(r.R);
    const ask = find === 'I' ? R`**電流** $I$ です（$V$ と $R$ は分かっています）。` : (find === 'V' ? R`**電圧** $V$ です（$I$ と $R$ は分かっています）。` : R`**抵抗** $R$ です（$V$ と $I$ は分かっています）。`);
    let ohmM;
    if (find === 'I') ohmM = [R`V = RI \;\Rightarrow\; I = \frac{V}{R}`, R`I = \frac{` + V + '}{' + Rv + '} = ' + sig(r.I) + un('A')];
    else if (find === 'V') ohmM = [R`V = RI`, R`V = ` + Rv + R` \times ` + I + ' = ' + sig(r.V) + un('V')];
    else ohmM = [R`V = RI \;\Rightarrow\; R = \frac{V}{I}`, R`R = \frac{` + V + '}{' + I + '} = ' + sig(r.R) + OHM];
    // 消費電力 P = VI の代入: 求めた量（電流・電圧）は途中の値なので、表示どおりに計算して P と合う桁数で書く
    let nP = 3, Vp = V, Ip = I;
    if (find === 'I') { nP = nd([r.I], [(i) => r.V * i, r.P]); Ip = sn(r.I, nP); }
    else if (find === 'V') { nP = nd([r.V], [(v) => v * r.I, r.P]); Vp = sn(r.V, nP); }
    const steps = [
      {
        t: '回路図にして、わかっている量・求める量を整理する',
        n: R`電池（電圧 $V$）に抵抗 $R$ をつないだ回路で、電流 $I$ は電池の＋極から出て、抵抗を通って−極へ戻ります。求めるのは` + ask,
        easy: R`電気の回路は**水路**にたとえると分かりやすくなります。**電池はポンプ**（水を高いところへ押し上げる）、**電圧**（$V$）は**水の高さの差**（水を押し流す力）、**電流**（$I$）は**1 秒間に流れる水の量**、**抵抗**（$R$）は**水路の細さ**（流れにくさ）です。高低差が大きいほど水は勢いよく流れ、水路が細いほど流れる量は少なくなります。`,
        pro: R`最初に既知・未知の量を図に書き込み、使う式（オームの法則・電力の式）を決めてから計算に入ります。`
      },
      {
        t: 'オームの法則で' + (find === 'I' ? '電流' : (find === 'V' ? '電圧' : '抵抗')) + 'を求める',
        m: ohmM,
        n: R`抵抗に流れる電流 $I$ は、かかる電圧 $V$ に比例します（**オームの法則** $V = RI$）。比例定数が抵抗 $R$ で、単位は $\mathrm{\Omega}$（オーム）$=\mathrm{V/A}$ です。`,
        easy: R`水路の細さ（$R$）が同じなら、水の高低差（$V$）を 2 倍にすると流れる水の量（$I$）も 2 倍になります。これが「電流は電圧に比例する」という意味です。反対に、同じ高低差でも水路が 2 倍細く（$R$ が 2 倍）なれば、流れる水の量は半分です。`,
        pro: R`$I$ が mA で与えられたら、まず A に直してから代入します（$1\,\mathrm{mA} = 10^{-3}\,\mathrm{A}$）。`
      },
      {
        t: '$V$–$I$ グラフで「比例」を確かめる',
        n: R`$V = RI$ は原点を通る直線で、傾きが抵抗 $R$ です。今の条件は直線上の点 $(I,\ V)$ にあたります。`,
        easy: R`傾きが急なほど「同じ電流を流すのに高い電圧が要る」＝流れにくい抵抗です。傾きが緩やかなら少しの電圧でどんどん電流が流れます。`,
        fig: graphVI(r.R, r.I, r.V),
        lv: 3
      },
      {
        t: '消費電力を求める',
        m: [R`P = VI`, R`P = ` + Vp + R` \times ` + Ip + ' = ' + sig(r.P) + un('W')],
        n: R`電力は「1 秒間に電気が行う仕事（使うエネルギー）」で、$P = VI$（単位 $\mathrm{W} = \mathrm{V \cdot A}$）です。オームの法則を使えば $P = I^{2}R = \dfrac{V^{2}}{R}$ とも書けます。` + more(nP, [find === 'I' ? 'I' : 'V']),
        easy: R`水路でいえば、1 秒間に流れる水の量（$I$）にその水が落ちる高さ（$V$）を掛けたものが「水がする仕事」です。電気では、抵抗が 1 秒間に受け取るエネルギーがこの電力にあたります。`,
        pro: R`与えられた量で使い分けます。$I$ と $R$ が既知なら $I^{2}R$、$V$ と $R$ が既知なら $V^{2}/R$ と、1 回で出せる式を選びます。`
      }
    ];
    if (opt.heat !== false) {
      // 時間が分で与えられた演習は、秒への換算も式に見せる。
      // V と I が与えられているときは Q = VIt を問題の値から直接計算する。そうでないときは、求めた P（途中の値）を
      // 表示どおりに計算して Q と合う桁数で書く
      const tm = p.tmin != null ? R`(` + sf(p.tmin) + R` \times 60)` : nice(p.t);
      const nQ = find === 'R' ? 3 : nd([r.P], [(x) => x * p.t, r.P * p.t]);
      steps.push({
        t: R`$t$ 秒間に発生するジュール熱`,
        m: [R`Q = Pt = VIt`, (find === 'R' ? R`Q = ` + V + R` \times ` + I + R` \times ` + tm : R`Q = ` + sn(r.P, nQ) + R` \times ` + tm) + ' = ' + sig(r.P * p.t) + un('J')],
        n: R`抵抗では電気エネルギーが熱に変わります（**ジュールの法則**）。$t$ 秒間に発生する熱量は $Q = Pt$ です。` + (p.tmin != null ? R`時間は秒に直します（$` + sf(p.tmin) + R`$ 分 $= ` + nice(p.t) + R`\,\mathrm{s}$）。` : '') + more(nQ, ['P']),
        easy: R`電熱器やヘアドライヤーが熱くなるのは、抵抗で電気のエネルギーが熱に変わるからです。使う電力が大きいほど、使う時間が長いほど、たくさんの熱が出ます。$1\,\mathrm{W}$ で 1 秒間使うと $1\,\mathrm{J}$ の熱です。`,
        pro: R`熱量・仕事・エネルギーの単位はすべて $\mathrm{J}$。時間は必ず秒に直します（分 $\times 60$、時間 $\times 3600$）。`
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-ohm-basic',
    field: '電磁気',
    unit: 'p-ohm0',
    title: 'オームの法則・電力・ジュール熱',
    desc: '電圧 $V$・電流 $I$・抵抗 $R$ のうち 2 つから残りの 1 つを求め、消費電力 $P = VI$ と $t$ 秒間のジュール熱もあわせて計算します。',
    form: [R`V = RI`, R`P = VI = I^{2}R = \frac{V^{2}}{R}`, R`Q = Pt`],
    inputs: [
      { key: 'find', label: '求める量', type: 'select', def: 'I', options: [['I', '電流 I を求める（V と R が分かっている）'], ['V', '電圧 V を求める（I と R が分かっている）'], ['R', '抵抗 R を求める（V と I が分かっている）']] },
      { key: 'V', label: '電圧 $V$', unit: 'V', type: 'num', def: '6.0', min: 0.001, max: 100000, show: (raw) => raw.find !== 'V' },
      { key: 'I', label: '電流 $I$', unit: 'A', type: 'num', def: '1.5', min: 0.0001, max: 1000, show: (raw) => raw.find !== 'I' },
      { key: 'R', label: '抵抗 $R$', unit: 'Ω', type: 'num', def: '4.0', min: 0.001, max: 1000000, show: (raw) => raw.find !== 'R' },
      { key: 't', label: '電流を流す時間 $t$', unit: 's', type: 'num', def: '60', min: 0, max: 1000000, hint: '分で与えられたら秒に直して入力します（5 分 → 300）' }
    ],
    examples: [
      { label: '電圧を求める', v: { find: 'V', I: '0.50', R: '20', t: '10' } },
      { label: '抵抗を求める', v: { find: 'R', V: '100', I: '2.5', t: '30' } },
      { label: '電熱器（5 分間）', v: { find: 'I', V: '100', R: '25', t: '300' } }
    ],
    intro: {
      easy: R`電気の流れは水の流れに似ています。電池が水を高いところへ持ち上げるポンプ、電流が 1 秒間に流れる水の量、抵抗が水路の細さです。**電圧が大きいほど、抵抗が小さいほど、電流はたくさん流れます**。この関係を式にしたのが**オームの法則** $V = RI$ です。電流が抵抗を通るときには熱も出ます。その大きさが電力 $P = VI$ とジュール熱 $Q = Pt$ です。`,
      normal: R`$V = RI$ から 2 つの量が分かれば残りが求まります。$P = VI = I^{2}R = V^{2}/R$、$Q = Pt$ も同時に確認します。`,
      pro: R`電力の式は与えられた量に合わせて 3 通りから選びます。$Q = Pt$ の $t$ は秒に直すこと、電熱器の「定格」では $R = V^{2}/P$ が一定とみなせることが入試の定石です。`
    },
    compute(v) {
      const r = solveOhm(v.find, v.V, v.I, v.R);
      if (!(r.V > 0) || !(r.I > 0) || !(r.R > 0) || !isFinite(r.P)) throw new JK.CalcError('電圧・電流・抵抗はすべて正の値にしてください。');
      const t = v.t;
      return {
        result: [
          { label: v.find === 'I' ? '電流 I' : (v.find === 'V' ? '電圧 V' : '抵抗 R'), tex: v.find === 'I' ? sig(r.I) + un('A') : (v.find === 'V' ? sig(r.V) + un('V') : sig(r.R) + OHM) },
          { label: '消費電力 P', tex: sig(r.P) + un('W') },
          { label: t + ' 秒間のジュール熱 Q', tex: sig(r.P * t) + un('J') }
        ],
        steps: stepsOhm(v, r),
        fig: figOhm('V = ' + tx(r.V) + ' V', 'I = ' + tx(r.I) + ' A', 'R = ' + tx(r.R) + ' Ω')
      };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // 定格（電熱器）を別の電圧で使う
        const V0 = 100, P0 = rng.pick([200, 400, 500, 1000]);
        const V1 = rng.pick([50, 60, 80, 90]);
        const Rv = V0 * V0 / P0, I1 = V1 / Rv, P1 = V1 * V1 / Rv;
        const tm = rng.pick([2, 5, 10]);
        const Q = P1 * tm * 60;
        const fig = figOhm('V = ' + V1 + ' V', 'I = ?', 'R = ?');
        return {
          title: '電熱器を定格と違う電圧で使う',
          body: R`「$100\,\mathrm{V}$・$${P0}\,\mathrm{W}$」と表示された電熱器（抵抗値は温度によらず一定とする）がある。この電熱器を $${V1}\,\mathrm{V}$ の電源につないで使う。次の量を有効数字 3 桁で求めよ。`,
          fig: fig,
          parts: [
            numPart('(1)', R`電熱器の抵抗値 $R$`, Rv, 'Ω'),
            numPart('(2)', R`$${V1}\,\mathrm{V}$ の電源につないだときの消費電力 $P$`, P1, 'W'),
            numPart('(3)', R`$${V1}\,\mathrm{V}$ の電源につないで $${tm}$ 分間使ったときに発生する熱量 $Q$`, Q, 'J')
          ],
          solution: [
            { t: '表示（定格）から抵抗値を求める', m: [R`P = \frac{V^{2}}{R} \;\Rightarrow\; R = \frac{V^{2}}{P}`, R`R = \frac{100^{2}}{` + P0 + '} = ' + sig(Rv) + OHM], n: R`「$100\,\mathrm{V}$・$${P0}\,\mathrm{W}$」は、$100\,\mathrm{V}$ をかけたときに $${P0}\,\mathrm{W}$ を消費するという意味です。この情報から抵抗値が決まります。`, easy: R`電化製品の「定格」は、その製品の「ふつうの使い方」を表す数字です。ここから、中の抵抗（水路の細さ）が何 $\mathrm{\Omega}$ なのかを逆算します。` },
            { t: 'オームの法則で電流を求める', m: [R`I = \frac{V}{R} = \frac{` + V1 + '}{' + sig(Rv) + '} = ' + sig(I1) + un('A')], n: R`抵抗値は電圧によらず一定なので、新しい電圧 $${V1}\,\mathrm{V}$ をそのまま使います。`, easy: R`水路の細さは変わらないので、押し流す力（電圧）が小さくなった分だけ、流れる水（電流）も少なくなります。` },
            { t: '消費電力とジュール熱', m: [R`P = VI = ` + V1 + R` \times ` + sig(I1) + ' = ' + sig(P1) + un('W'), R`Q = Pt = ` + sig(P1) + R` \times (` + tm + R` \times 60) = ` + sig(Q) + un('J')], n: R`時間は秒に直します（$${tm}$ 分 $= ${tm * 60}\,\mathrm{s}$）。`, pro: R`$P = V^{2}/R$ を使うと、電力は電圧の 2 乗に比例します。$${V1}\,\mathrm{V}$ では定格の $\left(\frac{${V1}}{100}\right)^{2}$ 倍の電力です。` }
          ]
        };
      }
      // basic / mid
      let Rv, I, V;
      for (let k = 0; k < 40; k++) {
        Rv = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50]);
        I = rng.pick([0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0]);
        V = Rv * I;
        if (Number.isInteger(V) && V <= 200) break;
      }
      if (level === 'basic') {
        const r = solveOhm('I', V, 0, Rv);
        const p = { find: 'I', V: V, R: Rv, t: 0 };
        return {
          title: '電池と抵抗の回路',
          body: R`抵抗値 $${sf(Rv)}\,\mathrm{\Omega}$ の抵抗に、電圧 $${sf(V)}\,\mathrm{V}$ の電池をつないだ。次の量を求めよ。`,
          fig: figOhm('V = ' + tx(V) + ' V', 'I = ?', 'R = ' + tx(Rv) + ' Ω'),
          parts: [
            numPart('(1)', R`抵抗に流れる電流 $I$`, r.I, 'A'),
            numPart('(2)', R`抵抗で消費される電力 $P$`, r.P, 'W')
          ],
          solution: stepsOhm(p, r, { heat: false })
        };
      }
      // mid: V, I から R・P・熱量
      const tm = rng.pick([2.0, 5.0, 10.0]);
      const r = solveOhm('R', V, I, 0);
      const p = { find: 'R', V: V, I: I, t: tm * 60, tmin: tm };
      return {
        title: '抵抗値と発熱量',
        body: R`ある抵抗に電圧 $${sf(V)}\,\mathrm{V}$ をかけたところ、電流 $${sf(I)}\,\mathrm{A}$ が流れた。この電流を $${sf(tm)}$ 分間流し続けたとして、次の量を求めよ。`,
        fig: figOhm('V = ' + tx(V) + ' V', 'I = ' + tx(I) + ' A', 'R = ?'),
        parts: [
          numPart('(1)', R`抵抗の抵抗値 $R$`, r.R, 'Ω'),
          numPart('(2)', R`抵抗で消費される電力 $P$`, r.P, 'W'),
          numPart('(3)', R`$${sf(tm)}$ 分間に抵抗で発生するジュール熱 $Q$`, r.P * tm * 60, 'J')
        ],
        solution: stepsOhm(p, r)
      };
    }
  });

  /* =====================================================================
     2. 合成抵抗
     ===================================================================== */

  function solveComb(conn, R1, R2, R3, V) {
    let r;
    if (conn === 'series') {
      const Rt = R1 + R2, I = V / Rt;
      r = { Rt: Rt, I: I, I1: I, I2: I, V1: R1 * I, V2: R2 * I };
    } else if (conn === 'parallel') {
      const Rt = R1 * R2 / (R1 + R2), I1 = V / R1, I2 = V / R2;
      r = { Rt: Rt, I: I1 + I2, I1: I1, I2: I2, V1: V, V2: V };
    } else {
      const R23 = R2 * R3 / (R2 + R3), Rt = R1 + R23, I = V / Rt, V1 = R1 * I, V23 = R23 * I;
      r = { Rt: Rt, R23: R23, I: I, I1: I, V1: V1, V23: V23, I2: V23 / R2, I3: V23 / R3, V2: V23, V3: V23 };
    }
    r.P1 = r.V1 * r.I1; r.P2 = r.V2 * r.I2; r.P3 = conn === 'mixed' ? r.V3 * r.I3 : 0;
    r.P = V * r.I;
    return r;
  }

  // r が null（演習の図）のときは、計算結果の電流・電圧の値は書かず記号だけを書く（図が設問の答えを教えてしまわないように）
  function figComb(conn, R1, R2, R3, V, r) {
    const d = JK.plot.draw(380, 190);
    const rr = r || {};
    const val = (sym, x, unit) => sym + (r ? ' = ' + tx(x) + ' ' + unit : '');
    const yT = 40, yB = 150;
    const sub = { 1: '₁', 2: '₂', 3: '₃' };
    if (conn === 'series') {
      const xL = 80, xR = 335;
      d.battery(xL, 70, xL, 120);
      d.wire([[xL, 70], [xL, yT], [125, yT]]);
      d.resistor(125, yT, 205, yT);
      d.resistor(205, yT, 285, yT);
      d.wire([[285, yT], [xR, yT], [xR, yB], [xL, yB], [xL, 120]]);
      d.arrow(90, yT, 118, yT, { cls: 'c3' });
      d.arrow(215, yB, 175, yB, { cls: 'c3' });
      d.text(104, yT - 8, 'I');
      d.text(195, yB + 18, 'I');
      d.text(165, yT - 13, 'R₁ = ' + tx(R1) + ' Ω');
      d.text(245, yT - 13, 'R₂ = ' + tx(R2) + ' Ω');
      d.text(165, yT + 30, val('V₁', rr.V1, 'V'));
      d.text(245, yT + 30, val('V₂', rr.V2, 'V'));
      d.text(xL + 16, 100, 'V = ' + tx(V) + ' V', { anchor: 'start' });
      d.text(205, 101, val('I', rr.I, 'A'));
      d.text(190, 180, '直列: どの抵抗にも同じ電流 I が流れる', { cls: 'dim' });
    } else if (conn === 'parallel') {
      const xL = 70, x1 = 170, x2 = 275;
      d.battery(xL, 70, xL, 120);
      d.wire([[xL, 70], [xL, yT], [x2, yT]]);
      d.wire([[xL, 120], [xL, yB], [x2, yB]]);
      [[x1, R1, rr.I1, 1], [x2, R2, rr.I2, 2]].forEach((b) => {
        d.wire([[b[0], yT], [b[0], 60]]);
        d.resistor(b[0], 60, b[0], 120);
        d.wire([[b[0], 120], [b[0], yB]]);
        d.arrow(b[0], 46, b[0], 68, { cls: 'c3' });
        d.text(b[0] + 12, 86, 'R' + sub[b[3]] + ' = ' + tx(b[1]) + ' Ω', { anchor: 'start' });
        d.text(b[0] + 12, 101, val('I' + sub[b[3]], b[2], 'A'), { anchor: 'start' });
      });
      d.dot(x1, yT); d.dot(x1, yB);
      d.arrow(86, yT, 114, yT, { cls: 'c3' });
      d.text(100, yT - 8, 'I');
      d.text(xL + 16, 100, 'V = ' + tx(V) + ' V', { anchor: 'start' });
      d.text(190, 180, '並列: どの抵抗にも同じ電圧 V がかかる', { cls: 'dim' });
    } else {
      const xL = 55, xa = 225, xb = 310;
      d.battery(xL, 70, xL, 120);
      d.wire([[xL, 70], [xL, yT], [95, yT]]);
      d.resistor(95, yT, 165, yT);
      d.wire([[165, yT], [xb, yT]]);
      d.wire([[xL, 120], [xL, yB], [xb, yB]]);
      [[xa, R2, rr.I2, 2], [xb, R3, rr.I3, 3]].forEach((b) => {
        d.wire([[b[0], yT], [b[0], 60]]);
        d.resistor(b[0], 60, b[0], 120);
        d.wire([[b[0], 120], [b[0], yB]]);
        d.arrow(b[0], 46, b[0], 68, { cls: 'c3' });
        d.text(b[0] + 12, 86, 'R' + sub[b[3]] + ' = ' + tx(b[1]) + ' Ω', { anchor: 'start' });
        d.text(b[0] + 12, 101, val('I' + sub[b[3]], b[2], 'A'), { anchor: 'start' });
      });
      d.dot(xa, yT); d.dot(xa, yB);
      d.arrow(62, yT, 90, yT, { cls: 'c3' });
      d.text(76, yT - 8, 'I');
      d.text(130, yT - 13, 'R₁ = ' + tx(R1) + ' Ω');
      d.text(130, yT + 28, val('V₁', rr.V1, 'V'));
      d.text(xL + 16, 98, 'V = ' + tx(V) + ' V', { anchor: 'start' });
      d.text(xL + 16, 113, val('I', rr.I, 'A'), { anchor: 'start' });
      d.text(190, 180, 'R₂ と R₃ は並列、それが R₁ と直列', { cls: 'dim' });
    }
    return d.svg();
  }

  function stepsComb(conn, R1, R2, R3, V, r, opt) {
    opt = opt || {};
    const v1 = nice(R1), v2 = nice(R2), v3 = nice(R3), vv = nice(V);
    const steps = [];
    if (conn === 'series') {
      steps.push({
        t: '直列接続だと見抜く',
        n: R`電池から出た電流が $R_{1}$ → $R_{2}$ と**一本道**で流れるので、2 つの抵抗は直列です。電流はどこでも同じ $I$、電圧は $V = V_{1} + V_{2}$ と分かれます。`,
        easy: R`水路が途中で分かれず 1 本につながっている状態です。水はどこでも同じ量だけ流れます（途中で消えたり増えたりしません）。その代わり、高低差（電圧）は 2 つの細い部分で分け合います。`,
        pro: R`直列は「電流が共通」、並列は「電圧が共通」。回路を見たら最初にどちらが共通かを判定します。`
      });
      steps.push({
        t: '合成抵抗',
        m: [R`R = R_{1} + R_{2}`, R`R = ` + v1 + ' + ' + v2 + ' = ' + sig(r.Rt) + OHM],
        n: R`直列の合成抵抗は、各抵抗の和です。`,
        easy: R`細い水路を続けてつなぐと、水路が長くなってますます流れにくくなります。だから抵抗は足し算で増えていきます。`
      });
      // I = V/R の R は求めた合成抵抗（途中の値）。表示どおりに計算して I と合う桁数で書く
      const nI = nd([r.Rt], [(x) => V / x, r.I]);
      steps.push({
        t: '全体の電流（オームの法則）',
        m: [R`I = \frac{V}{R} = \frac{` + vv + '}{' + sn(r.Rt, nI) + '} = ' + sig(r.I) + un('A')],
        n: R`回路全体を 1 つの抵抗 $R$ とみなして、オームの法則を使います。この電流が $R_{1}$、$R_{2}$ どちらにも流れます。` + more(nI, ['R'])
      });
      const nV = nd([r.I], [(i) => R1 * i, r.V1], [(i) => R2 * i, r.V2]);
      const nVs = nd([r.V1, r.V2], [(a, b) => a + b, r.V1 + r.V2]);
      steps.push({
        t: '各抵抗の電圧',
        m: [R`V_{1} = R_{1}I = ` + v1 + R` \times ` + sn(r.I, nV) + ' = ' + sig(r.V1) + un('V'), R`V_{2} = R_{2}I = ` + v2 + R` \times ` + sn(r.I, nV) + ' = ' + sig(r.V2) + un('V'),
          R`V_{1} + V_{2} = ` + sn(r.V1, nVs) + ' + ' + sn(r.V2, nVs) + ' = ' + sig(r.V1 + r.V2) + un('V')],
        n: R`電圧の合計 $V_{1} + V_{2}$ が電源電圧 $V$ に一致することを確かめます。` + moreAll([nV, ['I']], [nVs, ['V_{1}', 'V_{2}']]),
        easy: R`電流 $I$ が抵抗 $R_{1}$、$R_{2}$ を通るたびに、「抵抗 × 電流」だけ電圧が下がります。下がった電圧の合計は、電池が上げた電圧 $V$ に一致します。`,
        pro: R`直列では電圧は抵抗の比に分かれます（$V_{1} : V_{2} = R_{1} : R_{2}$）。`
      });
      const nW = nd([r.V1, r.V2, r.I], [(a, b, i) => a * i, r.P1], [(a, b, i) => b * i, r.P2]);
      const nPs = nd([r.P1, r.P2], [(a, b) => a + b, r.P1 + r.P2]);
      steps.push({
        t: '各抵抗の電力',
        m: [R`P_{1} = V_{1}I = ` + sn(r.V1, nW) + R` \times ` + sn(r.I, nW) + ' = ' + sig(r.P1) + un('W'), R`P_{2} = V_{2}I = ` + sn(r.V2, nW) + R` \times ` + sn(r.I, nW) + ' = ' + sig(r.P2) + un('W'),
          R`P_{1} + P_{2} = ` + sn(r.P1, nPs) + ' + ' + sn(r.P2, nPs) + ' = ' + sig(r.P1 + r.P2) + un('W')],
        n: R`電力の合計 $P_{1} + P_{2}$ は、電源が出す電力 $VI$ に等しくなります。` + moreAll([nW, ['V_{1}', 'V_{2}', 'I']], [nPs, ['P_{1}', 'P_{2}']]),
        pro: R`直列では電力も抵抗の比に分かれます（$P_{1} : P_{2} = R_{1} : R_{2}$）。`,
        lv: 2
      });
    } else if (conn === 'parallel') {
      steps.push({
        t: '並列接続だと見抜く',
        n: R`電池の両端から、$R_{1}$ と $R_{2}$ の 2 本の道に分かれて電流が流れるので並列です。どちらの抵抗にも**同じ電圧**（$V$）がかかり、電流は $I = I_{1} + I_{2}$ と分かれます。`,
        easy: R`水路が 2 本に分かれて、また合流する形です。どちらの水路も上と下の高低差は同じ（＝電圧が共通）。水は通りやすい水路（抵抗の小さい方）にたくさん流れます。`,
        pro: R`並列は「電圧が共通」。各枝の電流は $I_{k} = V/R_{k}$ とすぐ求まります。`
      });
      steps.push({
        t: '合成抵抗',
        m: [R`\frac{1}{R} = \frac{1}{R_{1}} + \frac{1}{R_{2}} \;\Rightarrow\; R = \frac{R_{1}R_{2}}{R_{1} + R_{2}}`, R`R = \frac{` + v1 + R` \times ` + v2 + '}{' + v1 + ' + ' + v2 + '} = ' + sig(r.Rt) + OHM],
        n: R`並列の合成抵抗は逆数の和（「和分の積」）で求めます。合成抵抗はどの抵抗よりも小さくなります。`,
        easy: R`通り道が 2 本に増えるので、全体としては流れやすく（抵抗が小さく）なります。だから合成抵抗は元のどの抵抗より小さくなります。`,
        pro: R`同じ抵抗 $R_{0}$ を 2 個並列にすると $R_{0}/2$。2 個の和分の積は暗算の定番です。`
      });
      // I = I₁ + I₂ の I₁, I₂ と、I = V/R の R は求めた値（途中の値）。表示どおりに計算して I と合う桁数で書く
      const nI = nd([r.I1, r.I2], [(a, b) => a + b, r.I]);
      const nR = nd([r.Rt], [(x) => V / x, r.I]);
      steps.push({
        t: '各抵抗の電流と全体の電流',
        m: [R`I_{1} = \frac{V}{R_{1}} = \frac{` + vv + '}{' + v1 + '} = ' + sig(r.I1) + un('A'), R`I_{2} = \frac{V}{R_{2}} = \frac{` + vv + '}{' + v2 + '} = ' + sig(r.I2) + un('A'),
          R`I = I_{1} + I_{2} = ` + sn(r.I1, nI) + ' + ' + sn(r.I2, nI) + ' = ' + sig(r.I) + un('A'),
          R`I = \frac{V}{R} = \frac{` + vv + '}{' + sn(r.Rt, nR) + '} = ' + sig(r.I) + un('A')],
        n: R`どちらの抵抗にも電圧 $V = ` + vv + R`\,\mathrm{V}$ がかかるので、オームの法則を別々に使います。全体の電流は、枝の電流の和 $I_{1} + I_{2}$ としても、合成抵抗を使った $I = V/R$ としても求まり、同じ値になります。` + moreAll([nI, ['I_{1}', 'I_{2}']], [nR, ['R']])
      });
      // 各抵抗の電力は、電圧 V と抵抗の値（問題の値）から直接 P = V²/R で求める。合計の足し算だけ、求めた P を表示どおりに足して合う桁数で書く
      const nS = nd([r.P1, r.P2], [(a, b) => a + b, r.P1 + r.P2]);
      steps.push({
        t: '消費電力',
        m: [R`P_{1} = VI_{1} = \frac{V^{2}}{R_{1}} = \frac{` + sq(vv) + '}{' + v1 + '} = ' + sig(r.P1) + un('W'), R`P_{2} = VI_{2} = \frac{V^{2}}{R_{2}} = \frac{` + sq(vv) + '}{' + v2 + '} = ' + sig(r.P2) + un('W'),
          R`P = P_{1} + P_{2} = ` + sn(r.P1, nS) + ' + ' + sn(r.P2, nS) + ' = ' + sig(r.P1 + r.P2) + un('W')],
        n: R`消費電力の合計は、電源が出す電力 $VI$ に等しくなります。どちらの抵抗にも電圧 $V$ がかかるので、$I_{k} = V/R_{k}$ を入れた $P_{k} = V^{2}/R_{k}$ が使いやすい式です。` + more(nS, ['P_{1}', 'P_{2}']),
        pro: R`並列では電流も電力も抵抗の逆比に分かれます（$I_{1} : I_{2} = P_{1} : P_{2} = R_{2} : R_{1}$）。`,
        lv: 2
      });
    } else {
      steps.push({
        t: '回路の構造を読み取る',
        n: R`$R_{2}$ と $R_{3}$ は電流が 2 本に分かれて流れるので**並列**です。その並列部分をひとまとめにして $R_{1}$ と直列につながっています（$R_{1} + (R_{2} /\!/ R_{3})$）。`,
        easy: R`複雑な回路は「部分ごとにまとめる」のがコツです。まず並列になっている $R_{2}$、$R_{3}$ を 1 つの抵抗とみなし、それを $R_{1}$ と一本道でつなぎます。`,
        pro: R`内側の並列から順に合成し、外側の直列を足す。逆の順で電流・電圧を分配していくのが定石です。`
      });
      steps.push({
        t: '$R_{2}$ と $R_{3}$ の並列部分を合成',
        m: [R`R_{23} = \frac{R_{2}R_{3}}{R_{2} + R_{3}} = \frac{` + v2 + R` \times ` + v3 + '}{' + v2 + ' + ' + v3 + '} = ' + sig(r.R23) + OHM],
        n: R`並列部分の合成抵抗 $R_{23}$ を求めます（和分の積）。`,
        easy: R`通り道が 2 本あるので、この部分は $R_{2}$ や $R_{3}$ より流れやすくなります。`
      });
      // R = R₁ + R₂₃ の足し算と I = V/R の割り算は、途中の値（R₂₃、R）を表示どおりに計算して結果と合う桁数で書く
      const nR = nd([r.R23], [(x) => R1 + x, r.Rt]);
      const nI = nd([r.Rt], [(x) => V / x, r.I]);
      steps.push({
        t: '全体の合成抵抗と全電流',
        m: [R`R = R_{1} + R_{23} = ` + v1 + ' + ' + sn(r.R23, nR) + ' = ' + sig(r.Rt) + OHM, R`I = \frac{V}{R} = \frac{` + vv + '}{' + sn(r.Rt, nI) + '} = ' + sig(r.I) + un('A')],
        n: R`直列部分は足し算です。電源から流れ出す電流 $I$ は、すべて $R_{1}$ を通ります。` + moreAll([nR, ['R_{23}']], [nI, ['R']])
      });
      const nV1 = nd([r.I], [(i) => R1 * i, r.V1]);
      const nV23 = nd([r.V1], [(x) => V - x, r.V23]);
      steps.push({
        t: '電圧を割り振る',
        m: [R`V_{1} = R_{1}I = ` + v1 + R` \times ` + sn(r.I, nV1) + ' = ' + sig(r.V1) + un('V'), R`V_{23} = V - V_{1} = ` + vv + ' - ' + sn(r.V1, nV23) + ' = ' + sig(r.V23) + un('V')],
        n: R`$R_{1}$ にかかる電圧 $V_{1}$ を引いた残りが、並列部分（$R_{2}$、$R_{3}$ の両端）の電圧 $V_{23}$ です（$V_{23} = R_{23}I$ としても同じ値になります）。` + moreAll([nV1, ['I']], [nV23, ['V_{1}']]),
        easy: R`高低差（電圧）のうち、まず $R_{1}$ の部分で一部を使い、残りを並列部分で使います。`
      });
      const nB = nd([r.V23], [(x) => x / R2, r.I2], [(x) => x / R3, r.I3]);
      const nC = nd([r.I2, r.I3], [(a, b) => a + b, r.I2 + r.I3]);
      steps.push({
        t: '$R_{2}$ と $R_{3}$ を流れる電流',
        m: [R`I_{2} = \frac{V_{23}}{R_{2}} = \frac{` + sn(r.V23, nB) + '}{' + v2 + '} = ' + sig(r.I2) + un('A'),
          R`I_{3} = \frac{V_{23}}{R_{3}} = \frac{` + sn(r.V23, nB) + '}{' + v3 + '} = ' + sig(r.I3) + un('A'),
          R`I_{2} + I_{3} = ` + sn(r.I2, nC) + ' + ' + sn(r.I3, nC) + ' = ' + sig(r.I2 + r.I3) + un('A') + R`\;(= I)`],
        n: R`並列部分は両方に同じ電圧 $V_{23}$ がかかるので、オームの法則で各電流が出ます。$I_{2} + I_{3} = I$ で検算できます。` + moreAll([nB, ['V_{23}']], [nC, ['I_{2}', 'I_{3}']]),
        pro: R`検算の定番は「枝電流の和 = 全電流」と「電力の合計 = $VI$」です。`
      });
      // 各抵抗の電力は、その抵抗の両端の電圧（求めた量）と抵抗の値（問題の値）から P = V²/R で求める。
      // 電圧と合計の足し算は、表示どおりに計算して結果と合う桁数で書く
      const nP = nd([r.V1, r.V23], [(a) => a * a / R1, r.P1], [(a, c) => c * c / R2, r.P2], [(a, c) => c * c / R3, r.P3]);
      const nT = nd([r.P1, r.P2, r.P3], [(a, b, c) => a + b + c, r.P1 + r.P2 + r.P3]);
      steps.push({
        t: '消費電力',
        m: [R`P_{1} = V_{1}I = \frac{V_{1}^{2}}{R_{1}} = \frac{` + sq(sn(r.V1, nP)) + '}{' + v1 + '} = ' + sig(r.P1) + un('W'),
          R`P_{2} = V_{23}I_{2} = \frac{V_{23}^{2}}{R_{2}} = \frac{` + sq(sn(r.V23, nP)) + '}{' + v2 + '} = ' + sig(r.P2) + un('W'),
          R`P_{3} = V_{23}I_{3} = \frac{V_{23}^{2}}{R_{3}} = \frac{` + sq(sn(r.V23, nP)) + '}{' + v3 + '} = ' + sig(r.P3) + un('W'),
          R`P_{1} + P_{2} + P_{3} = ` + sn(r.P1, nT) + ' + ' + sn(r.P2, nT) + ' + ' + sn(r.P3, nT) + ' = ' + sig(r.P1 + r.P2 + r.P3) + R`\,\mathrm{W} = VI`],
        n: R`各抵抗の消費電力は $P_{k} = V_{k}I_{k}$ です。電圧と抵抗の値が分かっているので、$I_{k} = V_{k}/R_{k}$ を入れた $P_{k} = V_{k}^{2}/R_{k}$ で求めます。合計は電源の出す電力 $VI$ に等しくなります。` + moreAll([nP, ['V_{1}', 'V_{23}']], [nT, ['P_{1}', 'P_{2}', 'P_{3}']]),
        lv: opt.power1 ? 1 : 2
      });
    }
    if (opt.skipPower) return steps.filter((s) => s.t !== '消費電力' && s.t !== '各抵抗の電圧と電力');
    return steps;
  }

  JK.registerSim({
    id: 'em-combined',
    field: '電磁気',
    unit: 'p-circuit',
    title: '合成抵抗（直列・並列・直並列）',
    desc: '直列 2 個・並列 2 個・「$R_{1}$ と ($R_{2}$ ∥ $R_{3}$)」の直並列から、合成抵抗と各抵抗の電流・電圧・消費電力を求めます。',
    form: [R`R = R_{1} + R_{2}\ \text{（直列）}`, R`\frac{1}{R} = \frac{1}{R_{1}} + \frac{1}{R_{2}}\ \text{（並列）}`, R`I = \frac{V}{R}`],
    inputs: [
      { key: 'conn', label: '接続のしかた', type: 'select', def: 'series', options: [['series', '直列（R₁ — R₂）'], ['parallel', '並列（R₁ ∥ R₂）'], ['mixed', '直並列（R₁ — (R₂ ∥ R₃)）']] },
      { key: 'R1', label: '抵抗 $R_{1}$', unit: 'Ω', type: 'num', def: '4.0', min: 0.01, max: 100000 },
      { key: 'R2', label: '抵抗 $R_{2}$', unit: 'Ω', type: 'num', def: '12', min: 0.01, max: 100000 },
      { key: 'R3', label: '抵抗 $R_{3}$', unit: 'Ω', type: 'num', def: '6.0', min: 0.01, max: 100000, show: (raw) => raw.conn === 'mixed' },
      { key: 'V', label: '電源電圧 $V$', unit: 'V', type: 'num', def: '12', min: 0.001, max: 100000 }
    ],
    examples: [
      { label: '並列 6Ω と 3Ω', v: { conn: 'parallel', R1: '6', R2: '3', V: '12' } },
      { label: '直並列', v: { conn: 'mixed', R1: '4', R2: '6', R3: '3', V: '12' } },
      { label: '直列 20Ω と 30Ω', v: { conn: 'series', R1: '20', R2: '30', V: '100' } }
    ],
    intro: {
      easy: R`抵抗のつなぎ方には 2 通りあります。**直列**は一本道に並べる、**並列**は道を 2 本に分ける、というつなぎ方です。直列では電流が共通で抵抗は足し算、並列では電圧が共通で抵抗は逆数の和になります。複雑な回路も、直列・並列の部分に分けて、1 つずつ 1 個の抵抗にまとめていけば解けます。`,
      normal: R`直列は $R = R_{1} + R_{2}$（電流共通）、並列は $\frac{1}{R} = \frac{1}{R_{1}} + \frac{1}{R_{2}}$（電圧共通）。合成してから全電流を求め、電圧・電流を逆にたどって各抵抗に割り振ります。`,
      pro: R`内側から合成 → 全電流 → 外側から分配、の順。並列 2 個は和分の積、同じ抵抗の並列は $1/n$ 倍。検算は「電力の合計 $= VI$」。`
    },
    compute(v) {
      const R3 = v.conn === 'mixed' ? v.R3 : 0;
      const r = solveComb(v.conn, v.R1, v.R2, R3, v.V);
      const result = [{ label: '合成抵抗 R', tex: sig(r.Rt) + OHM }, { label: '全体の電流 I', tex: sig(r.I) + un('A') }];
      const rows = v.conn === 'mixed' ? [['R₁', r.I1, r.V1, r.P1, '1'], ['R₂', r.I2, r.V2, r.P2, '2'], ['R₃', r.I3, r.V3, r.P3, '3']] : [['R₁', r.I1, r.V1, r.P1, '1'], ['R₂', r.I2, r.V2, r.P2, '2']];
      rows.forEach((x) => result.push({ label: x[0] + ' の電流・電圧・電力', tex: 'I_{' + x[4] + '} = ' + sig(x[1]) + un('A') + R`,\ V_{` + x[4] + '} = ' + sig(x[2]) + un('V') + R`,\ P_{` + x[4] + '} = ' + sig(x[3]) + un('W') }));
      return { result: result, steps: stepsComb(v.conn, v.R1, v.R2, R3, v.V, r), fig: figComb(v.conn, v.R1, v.R2, R3, v.V, r) };
    },
    exercise(rng, level) {
      const parallelPairs = [[3, 6], [4, 12], [6, 12], [20, 30], [10, 40], [12, 24], [15, 30], [4, 4], [6, 6], [10, 10], [20, 20], [12, 12], [2, 2], [5, 20], [30, 60]];
      const kV = rng.pick([1, 2, 3, 4, 5]);
      if (level === 'basic') {
        const par = rng.bool();
        let R1, R2, conn;
        if (par) { const pr = rng.pick(parallelPairs); R1 = pr[0]; R2 = pr[1]; conn = 'parallel'; }
        else { R1 = rng.pick([2, 3, 4, 5, 6, 8, 10, 12]); R2 = rng.pick([4, 6, 8, 10, 12, 15, 20]); conn = 'series'; }
        const Rt = conn === 'series' ? R1 + R2 : R1 * R2 / (R1 + R2);
        let V = Rt * kV * 0.5;
        V = Number.isInteger(V) ? V : Rt * kV;
        const r = solveComb(conn, R1, R2, 0, V);
        return {
          title: conn === 'series' ? '直列接続の合成抵抗' : '並列接続の合成抵抗',
          body: R`抵抗値が $R_{1} = ${sf(R1)}\,\mathrm{\Omega}$、$R_{2} = ${sf(R2)}\,\mathrm{\Omega}$ の 2 つの抵抗を図のように${conn === 'series' ? '直列' : '並列'}につなぎ、電圧 $${sf(V)}\,\mathrm{V}$ の電池を接続した。`,
          fig: figComb(conn, R1, R2, 0, V, null),
          parts: [
            numPart('(1)', R`合成抵抗 $R$`, r.Rt, 'Ω'),
            numPart('(2)', R`電池から流れ出る電流 $I$`, r.I, 'A'),
            numPart('(3)', conn === 'series' ? R`$R_{2}$ にかかる電圧 $V_{2}$` : R`$R_{2}$ を流れる電流 $I_{2}$`, conn === 'series' ? r.V2 : r.I2, conn === 'series' ? 'V' : 'A')
          ],
          solution: stepsComb(conn, R1, R2, 0, V, r)
        };
      }
      // mid / adv: 直並列
      const pr = rng.pick(parallelPairs.filter((q) => q[0] !== q[1]));
      const R2 = pr[0], R3 = pr[1], R23 = R2 * R3 / (R2 + R3);
      const R1 = rng.pick([2, 3, 4, 5, 6, 8, 10]);
      const Rt = R1 + R23;
      const V = Number.isInteger(Rt * kV) ? Rt * kV : Rt * 2 * kV;
      const r = solveComb('mixed', R1, R2, R3, V);
      const parts = [
        numPart('(1)', R`合成抵抗 $R$`, r.Rt, 'Ω'),
        numPart('(2)', R`電池から流れ出る電流 $I$`, r.I, 'A'),
        numPart('(3)', R`$R_{2}$ を流れる電流 $I_{2}$`, r.I2, 'A')
      ];
      const sol = stepsComb('mixed', R1, R2, R3, V, r, { power1: level === 'adv' });     // adv は P₂ が設問なので、消費電力のステップを lv: 1 にする
      if (level === 'adv') {
        // R3 を取り除いた後の電力
        const r2 = solveComb('series', R1, R2, 0, V);
        parts.splice(1, 2);
        parts.push(numPart('(2)', R`$R_{2}$ で消費される電力 $P_{2}$`, r.P2, 'W'));
        parts.push(numPart('(3)', R`$R_{3}$ を回路から取り除いたとき、$R_{2}$ で消費される電力 $P_{2}'$`, r2.P2, 'W'));
        // R'（問題の値の和）は 3 桁で正確。P₂' は I' の丸めた値を使わず、V と R' から直接 R₂(V/R')² で求める
        sol.push({
          t: R`$R_{3}$ を取り除いた回路を考える`,
          m: [R`R' = R_{1} + R_{2} = ` + nice(R1) + ' + ' + nice(R2) + ' = ' + sig(R1 + R2) + OHM,
            R`I' = \frac{V}{R'} = \frac{` + nice(V) + '}{' + sig(R1 + R2) + '} = ' + sig(r2.I) + un('A'),
            R`P_{2}' = R_{2}I'^{2} = R_{2}\left(\frac{V}{R'}\right)^{2} = ` + nice(R2) + R` \times \left(\frac{` + nice(V) + '}{' + sig(R1 + R2) + R`}\right)^{2} = ` + sig(r2.P2) + un('W'),
            R`\text{（取り除く前は } P_{2} = ` + sig(r.P2) + R`\,\mathrm{W}\text{）}`],
          n: R`$R_{3}$ がなくなると $R_{2}$ だけが $R_{1}$ と直列になります。電源電圧 $V$ は変わらないので、新しい合成抵抗から電流を求め直し、$P_{2}' = R_{2}I'^{2}$ を計算します。$I'$ には $I' = V/R'$ をそのまま入れます。`,
          easy: R`通り道が 1 本減るので全体の抵抗が増え、電池から流れる電流は減ります。ただし $R_{2}$ にとっては、$R_{1}$ で使われる電圧が減るぶん、かかる電圧が増える点に注意します。`,
          pro: R`「枝を切ったとき」は、電源電圧一定のまま合成抵抗を再計算するのが基本です（電源の内部抵抗は無視）。`
        });
      }
      return {
        title: '直並列回路の電流と電圧',
        body: R`抵抗 $R_{1} = ${sf(R1)}\,\mathrm{\Omega}$、$R_{2} = ${sf(R2)}\,\mathrm{\Omega}$、$R_{3} = ${sf(R3)}\,\mathrm{\Omega}$ を図のようにつなぎ、電圧 $${sf(V)}\,\mathrm{V}$ の電池を接続した。電池の内部抵抗は無視できるものとする。`,
        fig: figComb('mixed', R1, R2, R3, V, null),
        parts: parts,
        solution: sol
      };
    }
  });

  /* =====================================================================
     3. 電池の内部抵抗
     ===================================================================== */

  function solveInt(E, r, Rv) {
    const I = E / (Rv + r), V = E - r * I;
    return { I: I, V: V, P: V * I, Pr: I * I * r, Pe: E * I, eta: Rv / (Rv + r), Is: E / r, Pmax: E * E / (4 * r) };
  }

  // s が null（演習の図）のときは、電流・端子電圧の値と V–I グラフは描かず、回路と記号だけを描く（図が設問の答えを教えてしまわないように）
  function figInt(E, r, Rv, s) {
    const d = JK.plot.draw(400, 195);
    const xb = 62, xt = 150, xm = 235, xR = 335, yT = 45, yB = 160;
    d.rect(26, 22, xt - 26 + 4, 150, { cls: 'dim', dash: true, rx: 6 });
    d.text(88, 36, '電池', { cls: 'dim' });
    d.wire([[xt, yT], [xb, yT], [xb, 62]]);
    d.battery(xb, 62, xb, 100);
    d.wire([[xb, 100], [xb, 108]]);
    d.resistor(xb, 108, xb, 150);
    d.wire([[xb, 150], [xb, yB], [xt, yB]]);
    d.dot(xt, yT); d.dot(xt, yB);
    d.text(xt + 10, yT - 7, 'P', { anchor: 'start' });
    d.text(xt + 10, yB + 15, 'Q', { anchor: 'start' });
    d.text(xb + 18, 85, 'E = ' + tx(E) + ' V', { anchor: 'start' });
    d.text(xb + 14, 133, 'r = ' + tx(r) + ' Ω', { anchor: 'start' });
    d.wire([[xt, yT], [xR, yT], [xR, 70]]);
    d.resistor(xR, 70, xR, 130);
    d.wire([[xR, 130], [xR, yB], [xt, yB]]);
    d.wire([[xm, yT], [xm, 82]]);
    d.meter(xm, 95, 11, 'V');
    d.wire([[xm, 106], [xm, yB]]);
    d.dot(xm, yT); d.dot(xm, yB);
    d.arrow(255, yT, 295, yT, { cls: 'c3' });
    d.text(275, yT - 9, s ? 'I = ' + tx(s.I) + ' A' : 'I');
    d.text(xR - 12, 103, 'R = ' + tx(Rv) + ' Ω', { anchor: 'end' });
    d.text(xm - 15, 99, s ? 'V = ' + tx(s.V) + ' V' : 'V', { anchor: 'end' });
    d.text(285, 186, '端子電圧 V = E − rI', { anchor: 'middle', cls: 'dim' });
    if (!s) return d.svg();
    const g = JK.plot.graph({
      w: 400, h: 215, x: [0, s.Is * 1.12], y: [0, E * 1.2],
      curves: [{ f: (x) => E - r * x, cls: 'c1' }],
      points: [{ x: s.I, y: s.V, label: '(I, V)', cls: 'c3', pos: 'tr' }, { x: 0, y: E, label: 'E', cls: 'c2', pos: 'tr' }, { x: s.Is, y: 0, label: 'E/r', cls: 'c2', pos: 'tr' }],
      vlines: [{ x: s.I, dash: true }], hlines: [{ y: s.V, dash: true }],
      axis: ['I [A]', 'V [V]']
    });
    return stack([d.svg(), g], 400);
  }

  function graphPR(E, r, Rv) {
    const Rmax = Math.max(4 * r, 1.5 * Rv);
    const P = (x) => E * E * x / ((x + r) * (x + r));
    return JK.plot.graph({
      w: 320, h: 210, x: [0, Rmax], y: [0, E * E / (4 * r) * 1.25],
      curves: [{ f: P, cls: 'c1' }],
      points: [{ x: r, y: E * E / (4 * r), label: 'R = r で最大', cls: 'c2', pos: 'tr' }, { x: Rv, y: P(Rv), label: '今の R', cls: 'c3', pos: 'br' }],
      axis: ['R [Ω]', 'P [W]']
    });
  }

  function stepsInt(E, r, Rv, s, opt) {
    opt = opt || {};
    const e = nice(E), rr = nice(r), RR = nice(Rv);
    // 電力の収支 EI = I²R + I²r の足し算: 外部・内部の電力（途中の値）を表示どおりに足して EI と合う桁数で書く
    const nE = nd([s.P, s.Pr], [(a, b) => a + b, s.Pe]);
    const steps = [
      {
        t: '内部抵抗をふくめた回路を図にする',
        n: R`実際の電池は、内部に小さな抵抗 $r$ をもちます。「理想の電池（起電力 $E$）」と「内部抵抗 $r$」が直列になっていると考え、そこへ外部抵抗 $R$ をつなぎます。電圧計が示す端子 P–Q 間の電圧 $V$ が**端子電圧**です。`,
        easy: R`電池を「ポンプ」にたとえると、内部抵抗は**ポンプの中の細い管**です。ポンプは水を押し上げる力（起電力 $E$）を出しますが、水がポンプの中を通るとき少し摩擦で力を失います。だから外に出てくる水の押す力（端子電圧 $V$）は、$E$ より少し小さくなります。`,
        pro: R`問題文の「内部抵抗を無視する」は $r = 0$ のこと。このとき端子電圧は常に $E$ で、電流によらず一定です。`
      },
      {
        t: '回路全体にオームの法則を使って電流を求める',
        m: [R`E = (R + r)I \;\Rightarrow\; I = \frac{E}{R + r}`, R`I = \frac{` + e + '}{' + RR + ' + ' + rr + '} = ' + sig(s.I) + un('A')],
        n: R`電流は電池の内部と外部抵抗の両方を通ります。回路全体の抵抗は $R + r$（直列）で、そこにかかる電圧が起電力 $E$ です。`,
        easy: R`電流の通り道は「内部の細い管」と「外の水路」の一本道です。だから 2 つの抵抗は足し算（直列）になり、水を押す力 $E$ をその合計で割ると、流れる水の量 $I$ が出ます。`
      },
      {
        t: '端子電圧を求める',
        m: [R`V = E - rI = E - r \times \frac{E}{R + r}`, R`V = ` + e + ' - ' + rr + R` \times \frac{` + e + '}{' + RR + ' + ' + rr + '} = ' + sig(s.V) + un('V'), R`V = RI = R \times \frac{E}{R + r} = ` + RR + R` \times \frac{` + e + '}{' + RR + ' + ' + rr + '} = ' + sig(s.R_V) + un('V') + R`\quad\text{（検算）}`],
        n: R`内部抵抗で電圧が $rI$ だけ下がる（電圧降下）ので、端子電圧は $V = E - rI$ です。電流 $I$ には $I = \dfrac{E}{R + r}$ をそのまま入れます（丸めた値を入れるより正確です）。外部抵抗にかかる電圧 $RI$ としても同じ値になります。電流を多く流すほど端子電圧は下がります。`,
        easy: R`起電力 $E$ から、ポンプ内の摩擦で失う分（$rI$）を引いたものが、外に出る水圧（端子電圧）です。たくさん水を流すほど摩擦による損失が大きくなるので、端子電圧は下がります。`,
        pro: R`$V$–$I$ グラフは切片 $E$・傾き $-r$ の右下がりの直線。入試では 2 組の $(I, V)$ の測定値から $E$ と $r$ を逆算する問題が頻出です。`
      },
      {
        t: '外部抵抗で消費される電力',
        m: [R`P = VI = I^{2}R`, R`P = \left(\frac{E}{R + r}\right)^{2} R = \left(\frac{` + e + '}{' + RR + ' + ' + rr + R`}\right)^{2} \times ` + RR + ' = ' + sig(s.P) + un('W')],
        n: R`外部抵抗 $R$ で消費される電力は $P = VI = I^{2}R$ です。ここでも $I = \dfrac{E}{R + r}$ をそのまま入れます。電池の内部でも $I^{2}r = ` + sig(s.Pr) + R`\,\mathrm{W}$ が熱として失われます。`,
        easy: R`外の抵抗（負荷）が受け取るエネルギーが $P$ です。同じ電池から出るエネルギーのうち、少しは電池の内部で熱になって失われます。`,
        pro: R`$R = r$ のとき外部抵抗の消費電力は最大になり、$P_{\max} = \dfrac{E^{2}}{4r}$（このとき電流は $\dfrac{E}{2r}$、効率は 50 %）。「負荷抵抗を変えて最大電力」は定番の出題です。`
      },
      {
        t: '電力の収支と効率',
        m: [R`EI = I^{2}R + I^{2}r`, R`EI = ` + sig(s.Pe) + R`\,\mathrm{W} = ` + sn(s.P, nE) + R`\,\mathrm{W} + ` + sn(s.Pr, nE) + un('W'), R`\text{効率 } \frac{P}{EI} = \frac{R}{R + r} = \frac{` + RR + '}{' + RR + ' + ' + rr + R`} \times 100 = ` + sig(s.eta * 100) + R`\,\%`],
        n: R`電池が出す電力 $EI$ は、外部抵抗で使われる分と、内部抵抗で失われる分に分かれます。外部抵抗が内部抵抗より大きいほど効率は良くなります。` + more(nE, ['I^{2}R', 'I^{2}r']),
        lv: 2
      },
      {
        t: R`外部抵抗 $R$ を変えたときの電力（$P$–$R$ グラフ）`,
        n: R`$P = \dfrac{E^{2}R}{(R + r)^{2}}$ は $R = r$ で最大になり、$R$ が小さすぎても大きすぎても小さくなります。`,
        easy: R`外の水路がとても太い（$R$ が小さい）と水はたくさん流れますが、水が落ちる高さ（端子電圧）がほとんど残りません。反対に細すぎると、水の高さは出ても流れる量が少なくなります。ちょうどよい太さ（$R = r$）で、いちばんエネルギーを取り出せます。`,
        fig: graphPR(E, r, Rv),
        lv: 3
      }
    ];
    if (opt.pmax) {
      // 計算機の結果に出す「R = r のときの最大電力」の導出（E と r だけで書ける）。演習では使わない（adv は別の流れで求める）
      steps.splice(5, 0, {
        t: R`最大電力（$R = r$ のとき）`,
        m: [R`P_{\max} = \frac{E^{2}}{4r} = \frac{` + sq(e) + R`}{4 \times ` + rr + '} = ' + sig(s.Pmax) + un('W')],
        n: R`外部抵抗 $R$ を変えると、$R = r$ のとき消費電力が最大になります。このとき電流は $I = \dfrac{E}{2r}$、効率は $50\,\%$ です。`,
        easy: R`外の抵抗が内部抵抗と同じ大きさのとき、電池からいちばん多くのエネルギーを取り出せます。`,
        lv: 2
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-internal',
    field: '電磁気',
    unit: 'p-circuit',
    title: '電池の内部抵抗と端子電圧',
    desc: '起電力 $E$・内部抵抗 $r$ の電池に外部抵抗 $R$ をつないだときの電流・端子電圧 $V = E - rI$・消費電力・効率を求め、$V$–$I$ グラフで確かめます。',
    form: [R`I = \frac{E}{R + r}`, R`V = E - rI`, R`P = VI = I^{2}R`],
    inputs: [
      { key: 'E', label: '起電力 $E$', unit: 'V', type: 'num', def: '12', min: 0.001, max: 100000 },
      { key: 'r', label: '内部抵抗 $r$', unit: 'Ω', type: 'num', def: '1.0', min: 0.001, max: 100000 },
      { key: 'R', label: '外部抵抗 $R$', unit: 'Ω', type: 'num', def: '5.0', min: 0.001, max: 1000000 }
    ],
    examples: [
      { label: '乾電池（E=1.5V）', v: { E: '1.5', r: '0.50', R: '2.5' } },
      { label: 'R = r（最大電力）', v: { E: '12', r: '2.0', R: '2.0' } },
      { label: '大きな負荷', v: { E: '12', r: '1.0', R: '99' } }
    ],
    intro: {
      easy: R`電池には「起電力 $E$」（水を押し上げる力）のほかに、電池自身の中にもわずかな抵抗 $r$（**内部抵抗**）があります。電流が流れるとその分だけ電圧が下がるので、外から測れる電圧（**端子電圧**）は $V = E - rI$ と $E$ より小さくなります。`,
      normal: R`回路全体に $E = (R + r)I$ を使って電流を求め、端子電圧は $V = E - rI = RI$。$V$–$I$ グラフは切片 $E$、傾き $-r$ の直線です。`,
      pro: R`$R = r$ で外部抵抗の消費電力が最大（$E^{2}/4r$）。2 つの測定値から $E$、$r$ を決める問題、効率 $R/(R+r)$ と合わせて押さえます。`
    },
    compute(v) {
      const s = solveInt(v.E, v.r, v.R);
      s.R_V = v.R * s.I;
      return {
        result: [
          { label: '電流 I', tex: sig(s.I) + un('A') },
          { label: '端子電圧 V', tex: sig(s.V) + un('V') },
          { label: '外部抵抗 R の消費電力 P', tex: sig(s.P) + un('W') },
          { label: '内部抵抗 r での損失 P_r', tex: sig(s.Pr) + un('W') },
          { label: '効率 R/(R+r)', tex: sig(s.eta * 100) + R`\,\%` },
          { label: 'R = r のときの最大電力 P_max', tex: sig(s.Pmax) + un('W') }
        ],
        steps: stepsInt(v.E, v.r, v.R, s, { pmax: true }),
        fig: figInt(v.E, v.r, v.R, s)
      };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // 2 組の (I, V) から E, r を決める
        let E, r, Ia, Ib, Va, Vb;
        for (let k = 0; k < 60; k++) {
          E = rng.pick([1.5, 3.0, 6.0, 9.0, 12.0]);
          r = rng.pick([0.50, 1.0, 2.0, 4.0]);
          Ia = rng.pick([0.50, 1.0, 1.5]); Ib = Ia + rng.pick([1.0, 1.5, 2.0]);
          Va = E - r * Ia; Vb = E - r * Ib;
          if (Vb >= 0.25 * E && ok3(Va) && ok3(Vb)) break;
        }
        if (!(Vb > 0)) { E = 6.0; r = 1.0; Ia = 0.50; Ib = 1.5; Va = 5.5; Vb = 4.5; }
        const Pm = E * E / (4 * r);
        const s0 = solveInt(E, r, r);
        const fig = JK.plot.graph({ w: 340, h: 220, x: [0, E / r * 1.1], y: [0, E * 1.15], curves: [{ f: (x) => E - r * x, cls: 'c1', dash: true }], points: [{ x: Ia, y: Va, label: 'A', cls: 'c3', pos: 'tr' }, { x: Ib, y: Vb, label: 'B', cls: 'c3', pos: 'tr' }], axis: ['I [A]', 'V [V]'] });
        const sol = [
          { t: '端子電圧の式を立てる', m: R`V = E - rI`, n: R`電池の端子電圧は電流 $I$ とともに直線的に下がり、切片が起電力 $E$、傾きの大きさが内部抵抗 $r$ です。`, easy: R`測った 2 つの点（A, B）を通る直線を引き、その直線が縦軸と交わる値が $E$、傾きの大きさが $r$ です。` },
          { t: '2 つの測定値を代入して連立する', m: [R`E - r \times ` + sf(Ia) + ' = ' + sf(Va), R`E - r \times ` + sf(Ib) + ' = ' + sf(Vb), R`r = \frac{V_{A} - V_{B}}{I_{B} - I_{A}} = \frac{` + sf(Va) + ' - ' + sf(Vb) + '}{' + sf(Ib) + ' - ' + sf(Ia) + '} = ' + sig(r) + OHM, R`E = V_{A} + rI_{A} = ` + sf(Va) + ' + ' + sig(r) + R` \times ` + sf(Ia) + ' = ' + sig(E) + un('V')], n: R`2 本の式を引き算すると $E$ が消えて $r$ が求まります。その $r$ をどちらかの式に戻して $E$ を出します。`, easy: R`2 つの式を引き算すると $E$ が消えます。残った式から先に $r$ を求めてから、$E$ を計算します。`, pro: R`グラフが与えられたら、縦軸の切片を読んで $E$、横軸の切片（短絡電流）$I_{s} = E/r$ から $r$ を求める方法もあります。` },
          { t: '最大電力', m: [R`P_{\max} = \frac{E^{2}}{4r} = \frac{` + sig(E) + R`^{2}}{4 \times ` + sig(r) + '} = ' + sig(Pm) + un('W')], n: R`外部抵抗 $R$ を変えるとき、$R = r$ で消費電力が最大になり、$P_{\max} = \dfrac{E^{2}}{4r}$ です。`, easy: R`外の抵抗が内部抵抗と同じ大きさのとき、電池からいちばん多くのエネルギーを取り出せます。そのとき電流は $\dfrac{E}{2r}$ です。` },
          { t: '最大電力のときの検算', m: [R`I = \frac{E}{R + r} = \frac{E}{2r} = \frac{` + sig(E) + R`}{2 \times ` + sig(r) + '} = ' + sig(s0.I) + un('A'), R`P = I^{2}R = \left(\frac{E}{2r}\right)^{2} r = \left(\frac{` + sig(E) + R`}{2 \times ` + sig(r) + R`}\right)^{2} \times ` + sig(r) + ' = ' + sig(s0.P) + un('W')], n: R`$R = r$ を代入して、$P = I^{2}R$ からも同じ値になることを確かめます。$I$ には $I = \dfrac{E}{2r}$ をそのまま入れます。`, lv: 2 }
        ];
        return {
          title: '内部抵抗の測定と最大電力',
          body: R`電池に可変抵抗をつないで電流 $I$ と端子電圧 $V$ を測定したところ、$I = ${sf(Ia)}\,\mathrm{A}$ のとき $V = ${sf(Va)}\,\mathrm{V}$（点 A）、$I = ${sf(Ib)}\,\mathrm{A}$ のとき $V = ${sf(Vb)}\,\mathrm{V}$（点 B）となった。電池の起電力 $E$ と内部抵抗 $r$ は一定として、次の問いに答えよ。`,
          fig: fig,
          parts: [
            numPart('(1)', R`電池の内部抵抗 $r$`, r, 'Ω'),
            numPart('(2)', R`電池の起電力 $E$`, E, 'V'),
            numPart('(3)', R`この電池に接続する外部抵抗 $R$ を変えるとき、$R$ で消費される電力の最大値 $P_{\max}$`, Pm, 'W')
          ],
          solution: sol
        };
      }
      const E = rng.pick([1.5, 3.0, 6.0, 9.0, 12.0, 24.0]);
      const r = rng.pick([0.50, 1.0, 2.0, 0.20]);
      const Rv = rng.pick([2.0, 4.0, 5.0, 8.0, 10.0, 20.0].filter((x) => x > r));
      const s = solveInt(E, r, Rv);
      s.R_V = Rv * s.I;
      const parts = [
        numPart('(1)', R`回路を流れる電流 $I$`, s.I, 'A'),
        numPart('(2)', R`電池の端子電圧 $V$`, s.V, 'V')
      ];
      if (level === 'mid') parts.push(numPart('(3)', R`外部抵抗 $R$ で消費される電力 $P$`, s.P, 'W'));
      return {
        title: '内部抵抗のある電池の回路',
        body: R`起電力 $${sf(E)}\,\mathrm{V}$、内部抵抗 $${sf(r)}\,\mathrm{\Omega}$ の電池に、$${sf(Rv)}\,\mathrm{\Omega}$ の抵抗をつないだ。次の量を有効数字 3 桁で求めよ。`,
        fig: figInt(E, r, Rv, null),
        parts: parts,
        solution: stepsInt(E, r, Rv, s)
      };
    }
  });

  /* =====================================================================
     4. キルヒホッフの法則
     ===================================================================== */

  // 左の枝（E1, R1）・中央（R3）・右の枝（E2, R2）。I1, I2 は電池が押す向き（上向き）、I3 は R3 を下向き
  function solveKir(E1, E2, R1, R2, R3) {
    const D = R1 * R2 + R1 * R3 + R2 * R3;
    // 分子 n1 = E₁(R₂+R₃) − R₃E₂、n2 = (R₁+R₃)E₂ − R₃E₁ は差なので、0 になるはずの値が 2 進数の誤差で 1e-17 などになる。
    // 引く前の値に比べて極端に小さいときは 0 にそろえる（I₂ = 0 が「5.05 × 10^{-18}」と表示されないように）
    const zero = (v, x, y) => (Math.abs(v) <= 1e-12 * (Math.abs(x) + Math.abs(y)) ? 0 : v);
    const n1 = zero(E1 * (R2 + R3) - R3 * E2, E1 * (R2 + R3), R3 * E2), n2 = zero((R1 + R3) * E2 - R3 * E1, (R1 + R3) * E2, R3 * E1);
    const I1 = n1 / D, I2 = n2 / D, I3 = I1 + I2;
    return { D: D, n1: n1, n2: n2, I1: I1, I2: I2, I3: I3, V3: R3 * I3 };
  }

  function figKir(E1, E2, R1, R2, R3, s) {
    const d = JK.plot.draw(380, 230);
    const yT = 42, yB = 192, x1 = 95, x3 = 195, x2 = 295;
    d.wire([[x1, yT], [x2, yT]]);
    d.wire([[x1, yB], [x2, yB]]);
    [[x1, E1, R1], [x2, E2, R2]].forEach((b) => {
      d.wire([[b[0], yT], [b[0], 62]]);
      d.resistor(b[0], 62, b[0], 112);
      d.wire([[b[0], 112], [b[0], 138]]);
      d.battery(b[0], 138, b[0], 172);
      d.wire([[b[0], 172], [b[0], yB]]);
    });
    d.wire([[x3, yT], [x3, 70]]);
    d.resistor(x3, 70, x3, 164);
    d.wire([[x3, 164], [x3, yB]]);
    d.dot(x3, yT); d.dot(x3, yB);
    d.text(x1 - 14, 90, 'R₁ = ' + tx(R1) + ' Ω', { anchor: 'end' });
    d.text(x1 - 14, 160, 'E₁ = ' + tx(E1) + ' V', { anchor: 'end' });
    d.text(x2 + 14, 90, 'R₂ = ' + tx(R2) + ' Ω', { anchor: 'start' });
    d.text(x2 + 14, 160, 'E₂ = ' + tx(E2) + ' V', { anchor: 'start' });
    d.text(x3 + 14, 108, 'R₃ = ' + tx(R3) + ' Ω', { anchor: 'start' });
    d.text(x3, 22, 'A', {}); d.text(x3, 214, 'B', {});
    const sg = (x) => (x < 0 ? '−' : '') + tx(Math.abs(x));
    d.arrow(x1 + 14, 150, x1 + 14, 118, { cls: 'c3' });
    d.arrow(x2 - 14, 150, x2 - 14, 118, { cls: 'c3' });
    d.arrow(x3 - 14, 66, x3 - 14, 100, { cls: 'c4' });
    d.text(x1 + 22, 138, 'I₁' + (s ? ' = ' + sg(s.I1) + ' A' : ''), { anchor: 'start' });
    d.text(x2 - 22, 140, 'I₂' + (s ? ' = ' + sg(s.I2) + ' A' : ''), { anchor: 'end' });
    d.text(x3 - 22, 86, 'I₃' + (s ? ' = ' + sg(s.I3) + ' A' : ''), { anchor: 'end' });
    return d.svg();
  }

  function stepsKir(E1, E2, R1, R2, R3, s, opt) {
    opt = opt || {};
    const e1 = nice(E1), e2 = nice(E2), r1 = nice(R1), r2 = nice(R2), r3 = nice(R3);
    const a = nice(R1 + R3), b = r3, dd = nice(R2 + R3);     // 連立方程式の係数（和は 2 進数の誤差を除いて表示する）
    const co = (c) => (c === '1' ? '' : c);                   // 係数が 1 のときは書かない（1I₂ → I₂）
    // 加減法の説明（倍率が 1 のときは「1 倍」と書かない）
    const mulTxt = (k, w) => (k === '1' ? w : w + R`を $` + k + R`$ 倍した式`);
    // I₁ = n₁/D、I₂ = n₂/D の D（途中の値）と、I₃ = I₁ + I₂ の足し算は、表示どおりに計算して結果と合う桁数で書く
    const nD = nd([s.D], [(d) => s.n1 / d, s.I1], [(d) => s.n2 / d, s.I2]);
    const nS = nd([s.I1, s.I2], [(x, y) => x + y, s.I3]);
    const steps = [
      {
        t: '回路図に電流の向きを仮定して書き込む',
        n: R`点 A には 3 本の枝（左・中央・右）がつながっています。電池が押す向きに合わせて、左の枝の電流を $I_{1}$（上向き）、右の枝を $I_{2}$（上向き）、中央の $R_{3}$ を流れる電流を $I_{3}$（下向き）と**仮定**します。向きは仮定でよく、計算結果が**負**なら実際は逆向きに流れています。`,
        easy: R`川が分かれたり合流したりする図を思い浮かべてください。まず「たぶんこっちに流れるだろう」と矢印を勝手に決めておきます。答えがマイナスになったら「実際は反対向きだった」と読み替えれば大丈夫です。`,
        pro: R`向きの仮定は、各電池が押す向きにそろえるのが基本。計算後の符号だけで実際の向きが分かります。`
      },
      {
        t: R`**キルヒホッフの第 1 法則**（電流）`,
        m: R`I_{1} + I_{2} = I_{3}`,
        n: R`点 A に流れ込む電流の和と流れ出る電流の和は等しくなります（電荷はたまったり消えたりしないため）。`,
        easy: R`分かれ道で、道に入ってくる水の量の合計と出ていく水の量の合計は同じです。途中で水がたまったり消えたりしないからです。`
      },
      {
        t: R`**キルヒホッフの第 2 法則**（電圧）`,
        m: [R`E_{1} = R_{1}I_{1} + R_{3}I_{3}\quad\text{（左のループ）}`, R`E_{2} = R_{2}I_{2} + R_{3}I_{3}\quad\text{（右のループ）}`],
        n: R`閉じた回路を 1 周すると、電池が上げた電圧（起電力）の合計と、抵抗で下がる電圧（$RI$）の合計は等しくなります。ループは電池が押す向きにたどると符号を間違えにくくなります。`,
        easy: R`山登りのたとえです。ぐるっと 1 周して元の場所に戻れば、高さは元のまま。電池で「登った」分と、抵抗で「下った」分はちょうど同じになります。`,
        pro: R`未知数が 3 つなので、第 1 法則 1 本 + 第 2 法則 2 本の合計 3 本の式を立てます。外側の大きなループ（$E_{1} - E_{2} = R_{1}I_{1} - R_{2}I_{2}$）は検算に使えます。`
      },
      {
        t: R`数値を代入して $I_{3}$ を消去する`,
        m: [R`\begin{aligned} E_{1} &= R_{1}I_{1} + R_{3}(I_{1} + I_{2}) = (R_{1} + R_{3})I_{1} + R_{3}I_{2} \\ E_{2} &= R_{2}I_{2} + R_{3}(I_{1} + I_{2}) = R_{3}I_{1} + (R_{2} + R_{3})I_{2} \end{aligned}`,
          R`\begin{aligned} (` + r1 + ' + ' + r3 + R`)I_{1} + ` + co(r3) + R`I_{2} &= ` + e1 + R` \\ ` + co(r3) + R`I_{1} + (` + r2 + ' + ' + r3 + R`)I_{2} &= ` + e2 + R` \end{aligned}`],
        n: R`第 1 法則の $I_{3} = I_{1} + I_{2}$ を第 2 法則の 2 式に代入すると、未知数が $I_{1}$、$I_{2}$ の 2 つだけになります。`,
        easy: R`未知数が多いと解きにくいので、まず「$I_{3}$ は $I_{1} + I_{2}$ に置き換えられる」ことを使って、数を 2 つに減らします。`,
        lv: 2
      },
      {
        t: R`連立方程式を解いて $I_{1}$、$I_{2}$ を求める`,
        m: [R`D = (R_{1} + R_{3})(R_{2} + R_{3}) - R_{3}^{2} = ` + a + R` \times ` + dd + ' - ' + sq(b) + ' = ' + sn(s.D, nD),
          R`I_{1} = \frac{E_{1}(R_{2} + R_{3}) - R_{3}E_{2}}{D} = \frac{` + e1 + R` \times ` + dd + ' - ' + b + R` \times ` + e2 + '}{' + sn(s.D, nD) + '} = ' + sig(s.I1) + un('A'),
          R`I_{2} = \frac{(R_{1} + R_{3})E_{2} - R_{3}E_{1}}{D} = \frac{` + a + R` \times ` + e2 + ' - ' + b + R` \times ` + e1 + '}{' + sn(s.D, nD) + '} = ' + sig(s.I2) + un('A')],
        n: R`2 式の連立方程式は、一方の式を何倍かして引き算し、片方の未知数を消して解きます（ここでは $I_{2}$ を消去して $I_{1}$ を、次に $I_{1}$ を消去して $I_{2}$ を求めた結果をまとめています）。$D$ は 2 式の係数から決まる数で、$I_{1}$、$I_{2}$ の分母になります。` + more(nD, ['D']),
        easy: R`たとえば` + mulTxt(dd, '第 1 式') + R`から` + mulTxt(b, '第 2 式') + R`を引き算すると $I_{2}$ の項が消え、$I_{1}$ だけの式になります。求めた $I_{1}$ をもとの式に代入すれば $I_{2}$ も出ます。`
      },
      {
        t: R`$I_{3}$ を求めて向きを判断する`,
        m: [R`I_{3} = I_{1} + I_{2} = ` + par(sn(s.I1, nS)) + ' + ' + par(sn(s.I2, nS)) + ' = ' + sig(s.I3) + un('A')],
        n: R`結果が正なら仮定した向き、負なら逆向きに電流が流れています。${s.I1 < 0 ? '電流 $I_{1}$ は負なので、実際は左の電池に電流が逆向きに流れ込んでいます（電池が充電される向き）。' : (s.I2 < 0 ? '電流 $I_{2}$ は負なので、実際は右の電池に電流が逆向きに流れ込んでいます（電池が充電される向き）。' : (s.I1 === 0 || s.I2 === 0 ? '電流が $0$ の枝には、電流が流れていません。' : 'すべて正なので、実際の向きも仮定どおりです。'))}` + more(nS, ['I_{1}', 'I_{2}']),
        easy: R`マイナスの答えは「間違い」ではありません。「矢印と反対向きに流れている」という意味です。`
      }
    ];
    if (opt.power || opt.vab) {
      // R₃ の電力 P₃ = R₃I₃² と電圧 V_AB = R₃I₃: 求めた I₃（途中の値）を表示どおりに計算して結果と合う桁数で書く
      const P3w = R3 * s.I3 * s.I3;
      const nQ = nd([s.I3], [(i) => R3 * i * i, P3w], [(i) => R3 * i, s.V3]);
      const i3 = sn(s.I3, nQ);
      const m3 = [];
      if (opt.power) m3.push(R`P_{3} = R_{3}I_{3}^{2} = ` + r3 + R` \times ` + sq(i3) + ' = ' + sig(P3w) + un('W'));
      if (opt.vab) m3.push(R`V_{AB} = R_{3}I_{3} = ` + r3 + R` \times ` + i3 + ' = ' + sig(s.V3) + un('V'));
      steps.push({
        t: opt.power && opt.vab ? R`$R_{3}$ で消費される電力 $P_{3}$ と、点 A・B 間の電圧 $V_{AB}$` : (opt.power ? R`$R_{3}$ で消費される電力 $P_{3}$` : R`点 A・B 間の電圧 $V_{AB}$`),
        m: m3,
        n: (opt.power ? R`$R_{3}$ を流れる電流は $I_{3}$ なので、消費電力は $P = RI^{2}$ で求まります。` : '') +
          (opt.vab ? R`点 A・B の間の電圧は $R_{3}$ の両端の電圧にあたるので、$V_{AB} = R_{3}I_{3}$ です。$I_{3}$ は A から B へ向かって流れるので、A のほうが電位が高くなります。` : '') +
          (opt.power && opt.vab ? R`$P_{3} = V_{AB}I_{3}$ とも一致します。` : '') + more(nQ, ['I_{3}']),
        easy: (opt.power ? R`抵抗で使われる電力は「抵抗 × 電流の 2 乗」です。` : '') + (opt.vab ? R`$R_{3}$ にかかる電圧は、抵抗 × 電流 で求まります。` : '')
      });
    }
    {
      // 外側のループ: 左辺 E₁ − E₂ は入力だけの式。右辺 R₁I₁ − R₂I₂ は求めた I₁、I₂（途中の値）を使うので、表示どおりに計算して合う桁数で書く。
      // 左辺が 0 になる組では右辺も 0（丸めた値で 0 にならない組は、右辺の代入式を書かない）
      const lhs = E1 - E2, rhsRaw = R1 * s.I1 - R2 * s.I2;
      const rhs = Math.abs(rhsRaw - lhs) <= 1e-9 * (Math.abs(R1 * s.I1) + Math.abs(R2 * s.I2) + Math.abs(lhs)) ? lhs : rhsRaw;
      const nL = nd([s.I1, s.I2], [(x, y) => R1 * x - R2 * y, rhs]);
      const subR = rhs !== 0 || nL < 11;
      steps.push({
        t: '外側のループで検算する',
        m: [R`E_{1} - E_{2} = R_{1}I_{1} - R_{2}I_{2}`,
          R`\text{左辺 } E_{1} - E_{2} = ` + e1 + ' - ' + e2 + ' = ' + sig(lhs),
          R`\text{右辺 } R_{1}I_{1} - R_{2}I_{2} = ` + (subR ? r1 + R` \times ` + par(sn(s.I1, nL)) + ' - ' + r2 + R` \times ` + par(sn(s.I2, nL)) + ' = ' : '') + sig(rhs)],
        n: R`外側の大きなループにキルヒホッフの第 2 法則を使って、左辺と右辺が一致することを確認します（$R_{3}$ は通らないので $I_{3}$ は登場しません）。` + more(subR ? nL : 3, ['I_{1}', 'I_{2}']),
        lv: 2
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-kirchhoff',
    field: '電磁気',
    unit: 'p-circuit',
    title: 'キルヒホッフの法則（2 ループ回路）',
    desc: '2 つの電池 $E_{1}$、$E_{2}$ と 3 つの抵抗 $R_{1}$、$R_{2}$、$R_{3}$ からなる回路で、キルヒホッフの第 1・第 2 法則から各枝の電流を連立方程式で求めます。負の値は仮定と逆向きです。',
    form: [R`I_{1} + I_{2} = I_{3}`, R`E_{1} = R_{1}I_{1} + R_{3}I_{3}`, R`E_{2} = R_{2}I_{2} + R_{3}I_{3}`],
    inputs: [
      { key: 'E1', label: '電池 $E_{1}$', unit: 'V', type: 'num', def: '10', min: 0, max: 10000 },
      { key: 'E2', label: '電池 $E_{2}$', unit: 'V', type: 'num', def: '4.5', min: 0, max: 10000 },
      { key: 'R1', label: '抵抗 $R_{1}$', unit: 'Ω', type: 'num', def: '2.0', min: 0.01, max: 100000 },
      { key: 'R2', label: '抵抗 $R_{2}$', unit: 'Ω', type: 'num', def: '3.0', min: 0.01, max: 100000 },
      { key: 'R3', label: '抵抗 $R_{3}$', unit: 'Ω', type: 'num', def: '4.0', min: 0.01, max: 100000 }
    ],
    examples: [
      { label: '電池が同じ向きで強め合う', v: { E1: '6', E2: '6', R1: '2', R2: '2', R3: '4' } },
      { label: '電流が逆向きになる例', v: { E1: '10', E2: '4.5', R1: '2', R2: '3', R3: '4' } },
      { label: '対称な回路', v: { E1: '9', E2: '9', R1: '3', R2: '3', R3: '3' } }
    ],
    intro: {
      easy: R`ループが 2 つあって、直列・並列だけではまとめられない回路は、**キルヒホッフの法則**で解きます。使う道具は 2 つだけです。①**分かれ道では、入る電流の和＝出る電流の和**。②**閉じた道を 1 周すると、電池で上がった電圧＝抵抗で下がった電圧**。この 2 つで式を立て、連立方程式として解きます。`,
      normal: R`電流の向きを仮定し、第 1 法則（電流の保存）を 1 本、第 2 法則（1 周の電圧）を 2 本立てて 3 元連立方程式を解きます。解が負なら仮定と逆向き。`,
      pro: R`未知数の数だけ式を立て、$I_{3}$ を消去して 2 元の連立にするのが定石。検算には外側のループを使います。`
    },
    compute(v) {
      const s = solveKir(v.E1, v.E2, v.R1, v.R2, v.R3);
      const sg = (x) => sig(x) + un('A') + (x < 0 ? R`\ \text{（逆向き）}` : '');
      return {
        result: [
          { label: '左の枝の電流 I₁（上向きを正）', tex: 'I_{1} = ' + sg(s.I1) },
          { label: '右の枝の電流 I₂（上向きを正）', tex: 'I_{2} = ' + sg(s.I2) },
          { label: '中央 R₃ の電流 I₃（下向きを正）', tex: 'I_{3} = ' + sg(s.I3) },
          { label: 'A–B 間の電圧 V_AB', tex: sig(s.V3) + un('V') }
        ],
        steps: stepsKir(v.E1, v.E2, v.R1, v.R2, v.R3, s, { vab: true }),
        fig: figKir(v.E1, v.E2, v.R1, v.R2, v.R3, s)
      };
    },
    exercise(rng, level) {
      // I1, I2 を先に決めて E1, E2 を逆算（きれいな解になる）
      let R1 = 2, R2 = 3, R3 = 4, I1 = 2.0, I2 = -0.50, E1 = 10, E2 = 4.5;
      for (let k = 0; k < 300; k++) {
        const a1 = rng.pick([1, 2, 3, 4, 5, 6]), a2 = rng.pick([1, 2, 3, 4, 5, 6]), a3 = rng.pick([1, 2, 3, 4, 5, 6]);
        let b1, b2;
        if (level === 'adv') { b1 = rng.pick([1.0, 1.5, 2.0, 2.5]); b2 = rng.pick([-0.50, -1.0, 0.50]); }
        else { b1 = rng.pick([0.50, 1.0, 1.5, 2.0]); b2 = rng.pick([0.50, 1.0, 1.5, 2.0]); }
        const c3 = b1 + b2, e1 = a1 * b1 + a3 * c3, e2 = a2 * b2 + a3 * c3;
        if (c3 > 0 && e1 > 0 && e2 > 0 && Number.isInteger(e1 * 2) && Number.isInteger(e2 * 2) && e1 <= 60 && e2 <= 60) {
          R1 = a1; R2 = a2; R3 = a3; I1 = b1; I2 = b2; E1 = e1; E2 = e2;
          break;
        }
      }
      const s = solveKir(E1, E2, R1, R2, R3);
      const parts = [
        numPart('(1)', R`$I_{1}$ の値（図の矢印の向きを正とする）`, s.I1, 'A', { hint: '向きが矢印と逆のときは負の値で答えます' }),
        numPart('(2)', R`$I_{2}$ の値（図の矢印の向きを正とする）`, s.I2, 'A', { hint: '向きが矢印と逆のときは負の値で答えます' })
      ];
      if (level === 'basic') parts.push(numPart('(3)', R`$R_{3}$ を流れる電流 $I_{3}$`, s.I3, 'A'));
      else parts.push(numPart('(3)', R`$R_{3}$ で消費される電力 $P_{3}$`, R3 * s.I3 * s.I3, 'W'));
      if (level === 'adv') parts.push(numPart('(4)', R`点 A と点 B の間の電圧 $V_{AB}$（$R_{3}$ の両端の電圧）`, s.V3, 'V'));
      // (3) の電力 P₃（と adv の (4) の電圧 V_AB）の答えを出すステップも、解説に入れる（I₃ を求めたあと、検算の前。stepsKir が入れる）
      const sol = stepsKir(E1, E2, R1, R2, R3, s, { power: level !== 'basic', vab: level === 'adv' });
      return {
        title: '2 つの電池をもつ回路',
        body: R`図の回路で、$E_{1} = ${sf(E1)}\,\mathrm{V}$、$E_{2} = ${sf(E2)}\,\mathrm{V}$、$R_{1} = ${sf(R1)}\,\mathrm{\Omega}$、$R_{2} = ${sf(R2)}\,\mathrm{\Omega}$、$R_{3} = ${sf(R3)}\,\mathrm{\Omega}$ である。電池の内部抵抗は無視できるものとし、図の矢印の向きに流れる電流を $I_{1}$、$I_{2}$、$I_{3}$ とする。キルヒホッフの法則を用いて、次の問いに答えよ。`,
        fig: figKir(E1, E2, R1, R2, R3, null),
        parts: parts,
        solution: sol
      };
    }
  });
})();
