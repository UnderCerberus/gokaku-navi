/* 物理・熱力学 — ボイル・シャルルの法則 / 理想気体の状態方程式 / 気体分子運動論
   ※ 構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  // 有効数字 3 桁の四捨五入（4.425 のようにちょうど半端な値は 4.43 に切り上げる）。
  // 答え（p3）と解説・図の表示（S3, T, tx）は必ずこの 1 つの丸めを通す。toPrecision や toFixed は 2 進数の誤差で
  // 半端な値を 2 通りに割ってしまい、答えと解説の数値が 1 ずれる
  function rd3(x) {
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return x;
    const a = Math.abs(Number(x.toPrecision(12)));
    const e = Math.floor(Math.log10(a)) - 2;
    const m = Math.round(Number((a / Math.pow(10, e)).toPrecision(12)));
    return (x < 0 ? -1 : 1) * Number(m + 'e' + e);
  }
  const S3 = (x) => U.sig(rd3(x), 3);
  const P = (x) => U.paren(x);
  const p3 = rd3;
  const r2 = (x) => Math.round(x * 100) / 100;

  const RG = 8.3;        // 気体定数 [J/(mol·K)]
  const KB = 1.38e-23;   // ボルツマン定数 [J/K]
  const GASES = {
    He: ['ヘリウム He', 4.0, 1], Ne: ['ネオン Ne', 20, 1], Ar: ['アルゴン Ar', 40, 1],
    H2: ['水素 H₂', 2.0, 2], N2: ['窒素 N₂', 28, 2], O2: ['酸素 O₂', 32, 2]
  };

  // 問題文に与えた値（入力値）の TeX 表示。10 桁までは正確に書く（大きい/小さい数は ×10^n）。途中の値には使わない（SV と dig を使う）
  function T(x) {
    if (typeof x !== 'number' || !isFinite(x)) return '0';
    const ax = Math.abs(x);
    if (ax === 0) return '0';
    if (ax >= 1e4 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = Number((x / Math.pow(10, e)).toPrecision(10));
      if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(10)); e += 1; }
      let ms = String(m);
      if (ms.indexOf('.') < 0) ms += '.0';
      return ms + R` \times 10^{` + e + '}';
    }
    return String(Number(x.toPrecision(10)));
  }
  // 途中の値を d 桁（有効数字）で書く。3 桁は従来の S3 と同じ。4 桁以上は普通の小数で書き、末尾の 0 は除く（1245、12450、622.5）。
  // 10^5 以上や 10^-3 未満は 1.5 \times 10^{5} の形
  function SD(x, d) {
    if (d <= 3 || typeof x !== 'number' || !isFinite(x)) return S3(x);
    const v = U.roundSig(x, d);
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a < 1e5 && a >= 1e-3) return String(Number(v));
    const m = /^(-?\d)(?:\.(\d+))?e([+-]?\d+)$/.exec(v.toExponential(d - 1));
    const frac = (m[2] || '').replace(/0+$/, '') || '0';
    return m[1] + '.' + frac + R` \times 10^{` + Number(m[3]) + '}';
  }
  // 途中の値 xs を式 f に代入して見せるときの、表示する有効数字の桁数。ちょうど表せる値（有効数字 6 桁以内。225、1245、622.5）は
  // そのまま書く。そうでない値は 3 桁から増やし、表示した値で計算し直した結果が、厳密な値の 3 桁表示（答えと解説の結果）と
  // 一致する最小の桁数にする（丸めた値を代入して、最後の桁が合わなくなるのを防ぐ）
  const same = (a, b) => a === b || Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b));
  const isExact = (x) => x === 0 || same(U.roundSig(x, 6), x);
  // zeroTol: 和・差の結果が 0 になる式のとき、0 とみなす絶対誤差（項の大きさ × 1e-9）
  function dig(xs, f, zeroTol) {
    const eq = (a, b) => a === b || Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b)) || (zeroTol !== undefined && Math.abs(a) <= zeroTol && Math.abs(b) <= zeroTol);
    const want = rd3(f.apply(null, xs));
    for (let d = 3; d <= 9; d++) {
      if (eq(rd3(f.apply(null, xs.map((x) => (isExact(x) ? x : U.roundSig(x, d))))), want)) return d;
    }
    return 9;
  }
  const SV = (x, d) => (isExact(x) ? SD(x, 6) : SD(x, d));
  // 結果 x の表示。3 桁に丸めると変わる値は、ちょうどの値を添える（3112.5 \approx 3.11 \times 10^{3}）
  const eqTail = (x) => (isExact(x) && !same(rd3(x), x) ? ' = ' + SD(x, 6) + R` \approx ` + S3(x) : ' = ' + S3(x));
  // 結果 x の表示。項 xs がどれもちょうど書ける値なら、ちょうどの値も添える。丸めた項を使うときは、表示した項の計算結果が
  // 3 桁で x と一致するので、3 桁の結果だけを書く
  const tailOf = (x, xs) => (xs.every(isExact) ? eqTail(x) : ' = ' + S3(x));
  // 途中の温度（K）などの普通の小数表示。ちょうど表せる値はそのまま、そうでなければ d 桁（1200、833.3）
  function TD(x, d) { return String(Number(U.roundSig(x, isExact(x) ? 6 : d))); }
  // 与えられた値から単位を換えただけの値（V[m³]、T[K]、M[kg/mol]）は、ちょうどの値で書く（3 桁で書ける値は従来どおり 3 桁の形）
  const GS = (x) => (same(rd3(x), x) ? S3(x) : T(x));
  // 図中の文字用（TeX ではなく Unicode の上付き）
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(n) { return String(n).split('').map((c) => SUP[c] || c).join(''); }
  function tx(x) {
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e4 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = rd3(x / Math.pow(10, e));
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      let ms = String(m);
      if (ms.indexOf('.') < 0) ms += '.0';
      return ms + '×10' + sup(e);
    }
    return String(rd3(x));
  }
  function must() {
    for (let i = 0; i < arguments.length; i++) {
      if (!Number.isFinite(arguments[i])) throw new JK.CalcError('この入力では計算できません。値を見直してください。');
    }
  }
  const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-300);

  /* ---------- 図の部品 ---------- */

  // 別の SVG（JK.plot.graph の戻り値）を、親の図の (x, y) に入れ子で置く
  function nest(svg, x, y) {
    return svg.replace(/^<svg class="jk-plot"/, '<svg x="' + x + '" y="' + y + '"');
  }

  const SUBN = { '1': '₁', '2': '₂', '3': '₃' };

  // 分子の位置（0〜1 の疑似乱数テーブル。図が毎回同じになるよう固定）
  const DOTS = [[0.15, 0.2], [0.55, 0.12], [0.82, 0.3], [0.3, 0.5], [0.68, 0.55], [0.12, 0.8], [0.45, 0.82], [0.88, 0.85],
    [0.25, 0.32], [0.72, 0.18], [0.5, 0.4], [0.35, 0.7], [0.92, 0.55], [0.08, 0.5], [0.6, 0.9], [0.78, 0.7],
    [0.2, 0.9], [0.4, 0.25], [0.95, 0.12], [0.62, 0.32], [0.05, 0.12], [0.52, 0.65], [0.85, 0.45], [0.3, 0.95]];

  // ピストンつき容器。hGas: 気体部分の高さ(px)、arrow: 圧力の矢印の長さ、nDots: 分子の数
  function cylinder(d, x, yb, w, hGas, arrow, nDots, label) {
    const Hc = 100, yTop = yb - Hc;
    d.line(x, yTop, x, yb, { cls: 'fg', w: 2 });
    d.line(x, yb, x + w, yb, { cls: 'fg', w: 2 });
    d.line(x + w, yb, x + w, yTop, { cls: 'fg', w: 2 });
    const yp = yb - hGas;
    d.group('<rect x="' + r2(x + 1) + '" y="' + r2(yp) + '" width="' + r2(w - 2) + '" height="' + r2(hGas - 1) + '" class="fl-f1" stroke="none"/>');
    d.rect(x + 2, yp - 8, w - 4, 8, { cls: 'fg', fill: 'f0' });
    for (let i = 0; i < nDots; i++) {
      const q = DOTS[i % DOTS.length];
      d.dot(x + 8 + q[0] * (w - 16), yp + 7 + q[1] * Math.max(4, hGas - 14), { cls: 'c1', r: 2.4 });
    }
    d.arrow(x + w / 2, yp - 10 - arrow, x + w / 2, yp - 10, { cls: 'c3', w: 2.4 });
    if (label) d.text(x + w / 2 + 14, yp - 10 - arrow + 6, label, { anchor: 'start' });
  }

  // P–V 図。states: [{V[L], P[Pa], name}]。ask なら目盛りを出さない（演習で答えが読み取れないように）
  function pvGraph(states, opt) {
    opt = opt || {};
    const pmax = Math.max.apply(null, states.map((s) => s.P)), vmax = Math.max.apply(null, states.map((s) => s.V));
    const pk = Math.max(0, Math.floor(Math.log10(pmax))), pf = Math.pow(10, pk);
    const xr = vmax * 1.32, yr = pmax / pf * 1.32;
    const curves = [], segs = [], pts = [], labels = [];
    const seen = [];
    const cs = states.map((s) => s.P * s.V);
    // 等温線（破線）の名前は、曲線が上の方を通る位置に短く書く（点のラベルと重なりにくい）
    const order = cs.map((c, i) => [c, i]).sort((a, b) => b[0] - a[0]);
    let rank = 0;
    order.forEach((oc) => {
      const c = oc[0];
      if (seen.some((q) => near(q, c))) return;
      seen.push(c);
      const lo = Math.max(xr * 0.015, c / pf / yr);
      curves.push({ f: (x) => c / x / pf, cls: 'dim', dash: true, domain: [lo, xr] });
      const yl = yr * (0.93 - 0.11 * rank);
      const nm = states.filter((q) => near(q.P * q.V, c)).map((q) => 'T' + SUBN[q.name]).join('=');
      labels.push({ x: c / pf / yl + xr * 0.02, y: yl, text: nm, cls: 'dim', anchor: 'start' });
      rank++;
    });
    labels.push({ x: xr * 0.985, y: yr * 0.9, text: '破線: 等温線', cls: 'dim', anchor: 'end' });
    states.forEach((s, i) => {
      pts.push({ x: s.V, y: s.P / pf, label: s.name, cls: 'c3', pos: 'tr' });
      if (!opt.ask) {
        segs.push({ x1: s.V, y1: 0, x2: s.V, y2: s.P / pf, cls: 'dim', dash: true });
        segs.push({ x1: 0, y1: s.P / pf, x2: s.V, y2: s.P / pf, cls: 'dim', dash: true });
      }
    });
    const g = {
      w: 360, h: opt.h || 236, x: [0, xr], y: [0, yr], axis: ['V[L]', pk === 0 ? 'P[Pa]' : 'P[×10' + sup(pk) + 'Pa]'],
      curves: curves, segs: segs, points: pts, labels: labels
    };
    if (opt.ask) { g.ticks = false; g.grid = false; }
    return JK.plot.graph(g);
  }

  /* ================= 1. ボイル・シャルルの法則 ================= */

  function bcCalc(v) {
    const T1 = v.t1 + 273;
    let P2 = v.P2, V2 = v.V2, T2 = v.t2 == null ? NaN : v.t2 + 273;
    if (v.find === 'P2') P2 = v.P1 * v.V1 * T2 / (T1 * V2);
    else if (v.find === 'V2') V2 = v.P1 * v.V1 * T2 / (T1 * P2);
    else T2 = P2 * V2 * T1 / (v.P1 * v.V1);
    return { T1: T1, T2: T2, P2: P2, V2: V2, t2: T2 - 273, k1: v.P1 * v.V1 / T1, k2: P2 * V2 / T2 };
  }

  // opt.unknown: 演習で答えとして隠す量（'P2' | 'V2' | 'T2'）。演習では目盛りを出さない
  function bcFigure(v, r, opt) {
    opt = opt || {};
    const unk = opt.unknown;
    const d = JK.plot.draw(360, 462);
    const Vmax = Math.max(v.V1, r.V2), Pmax = Math.max(v.P1, r.P2);
    const hOf = (V) => 96 * Math.max(0.2, Math.min(1, V / (Vmax * 1.02)));
    const aOf = (Pr) => 14 + 20 * (Pr / Pmax);
    const yb = 156, w = 100, xs = [34, 226];
    const idx = opt.idx || ['1', '2'];
    const s1 = SUBN[idx[0]], s2 = SUBN[idx[1]];
    d.text(xs[0] + w / 2, 14, '状態 ' + idx[0], { bold: true });
    d.text(xs[1] + w / 2, 14, '状態 ' + idx[1], { bold: true });
    cylinder(d, xs[0], yb, w, hOf(v.V1), aOf(v.P1), 7, 'P' + s1);
    cylinder(d, xs[1], yb, w, hOf(r.V2), aOf(r.P2), 7, 'P' + s2);
    d.arrow(150, 108, 212, 108, { cls: 'dim', w: 2 });
    const lines = (n, Pv, Vv, Tv, tv, hide) => [
      'P' + n + ' = ' + (hide === 'P2' ? '?' : tx(Pv) + ' Pa'),
      'V' + n + ' = ' + (hide === 'V2' ? '?' : tx(Vv) + ' L'),
      'T' + n + ' = ' + (hide === 'T2' ? '?' : tx(Tv) + ' K（' + tx(tv) + ' ℃）')
    ];
    lines(s1, v.P1, v.V1, r.T1, v.t1, null).forEach((s, i) => d.text(xs[0] + w / 2, yb + 18 + i * 15, s));
    lines(s2, r.P2, r.V2, r.T2, r.t2, unk).forEach((s, i) => d.text(xs[1] + w / 2, yb + 18 + i * 15, s));
    const states = [{ V: v.V1, P: v.P1, name: idx[0] }, { V: r.V2, P: r.P2, name: idx[1] }];
    d.group(nest(pvGraph(states, { ask: !!unk, h: 236 }), 0, 222));
    return d.svg();
  }

  function bcSteps(o, r) {
    const find = o.find;
    const sameT = near(r.T1, r.T2), sameP = near(o.P1, r.P2), sameV = near(o.V1, r.V2);
    let kind = '';
    if (sameT && !sameP) kind = R`この変化は温度が一定（等温変化）なので $T_{1} = T_{2}$、式は $P_{1}V_{1} = P_{2}V_{2}$（**ボイルの法則**）になります。`;
    else if (sameP && !sameT) kind = R`この変化は圧力が一定（定圧変化）なので $P_{1} = P_{2}$、式は $\dfrac{V_{1}}{T_{1}} = \dfrac{V_{2}}{T_{2}}$（**シャルルの法則**）になります。`;
    else if (sameV && !sameT) kind = R`この変化は体積が一定（定積変化）なので $V_{1} = V_{2}$、式は $\dfrac{P_{1}}{T_{1}} = \dfrac{P_{2}}{T_{2}}$（圧力は絶対温度に比例）になります。`;
    const unitP = R`\,\mathrm{Pa}`, unitV = R`\,\mathrm{L}`, unitT = R`\,\mathrm{K}`;
    // 求める量の文字式と代入式
    let sym, num, ans, note;
    if (find === 'P2') {
      sym = R`P_{2} = P_{1} \times \frac{V_{1}}{V_{2}} \times \frac{T_{2}}{T_{1}}`;
      num = R`P_{2} = ` + T(o.P1) + R` \times \frac{` + T(o.V1) + '}{' + T(r.V2) + R`} \times \frac{` + T(r.T2) + '}{' + T(r.T1) + '} = ' + S3(r.P2) + unitP;
      note = R`体積が小さくなる（$V_{1}/V_{2}$ が $1$ より大きい）と圧力は大きくなり、絶対温度が高くなる（$T_{2}/T_{1}$ が $1$ より大きい）と圧力はさらに大きくなります。`;
    } else if (find === 'V2') {
      sym = R`V_{2} = V_{1} \times \frac{P_{1}}{P_{2}} \times \frac{T_{2}}{T_{1}}`;
      num = R`V_{2} = ` + T(o.V1) + R` \times \frac{` + T(o.P1) + '}{' + T(r.P2) + R`} \times \frac{` + T(r.T2) + '}{' + T(r.T1) + '} = ' + S3(r.V2) + unitV;
      note = R`圧力が大きくなると体積は小さくなり（反比例）、絶対温度が高くなると体積は大きくなります（比例）。`;
    } else {
      sym = R`T_{2} = T_{1} \times \frac{P_{2}}{P_{1}} \times \frac{V_{2}}{V_{1}}`;
      num = R`T_{2} = ` + T(r.T1) + R` \times \frac{` + T(r.P2) + '}{' + T(o.P1) + R`} \times \frac{` + T(r.V2) + '}{' + T(o.V1) + '} = ' + S3(r.T2) + unitT;
      note = R`圧力が大きく・体積が大きくなるほど、絶対温度は高くなります（$PV$ に比例）。`;
    }
    const steps = [
      {
        t: '図で状況をつかむ',
        n: R`ピストンつきの容器に入った一定量の気体が、状態 1（$P_{1},\ V_{1},\ T_{1}$）から状態 2（$P_{2},\ V_{2},\ T_{2}$）に変わります。気体は漏れないので、気体の量（粒の数）は変わりません。`,
        easy: R`自転車の空気入れを思い浮かべてください。ピストンを押して体積を小さくすると、中の空気は強く押し返してきます（**圧力が大きくなる**）。また、ポンプが熱くなる（**温度が高くなる**）と、中の空気は膨らもうとします。このように、**圧力**（$P$）・**体積**（$V$）・**温度**（$T$）の 3 つは連動して変わります。この 3 つの関係を表したものが、これから使う法則です。`
      },
      {
        t: R`セ氏温度を絶対温度に直す（$T = t + 273$）`,
        m: [R`T_{1} = t_{1} + 273 = ` + T(o.t1) + ' + 273 = ' + T(r.T1) + unitT]
          .concat(find === 'T2' ? [] : [R`T_{2} = t_{2} + 273 = ` + T(o.t2) + ' + 273 = ' + T(r.T2) + unitT]),
        n: R`気体の法則は、必ず**絶対温度**（単位 $\mathrm{K}$、ケルビン）で計算します。$0\degree\mathrm{C}$ は約 $273\,\mathrm{K}$ なので、セ氏温度 $t$ に $273$ を足します。` + (find === 'T2' ? R`求めたあと、セ氏温度に戻します。` : ''),
        easy: R`セ氏温度（$\degree\mathrm{C}$）は「水が凍る温度を $0$ にした」便宜上の目盛りで、$0\degree\mathrm{C}$ は「温度がない」という意味ではありません。気体は冷やすほど体積が小さくなり、約 $-273\degree\mathrm{C}$ で体積が $0$ になる計算です。そこで「これ以上冷やせない最低の温度」を $0$ とした**絶対温度** $T$ を使います。目盛りの幅は $\degree\mathrm{C}$ と同じなので、$273$ を足すだけで変換できます。`,
        pro: R`$T = t + 273$（厳密には $273.15$）。入試では $273$ を使うのが普通。温度は最初に K へ直す癖をつける（$t$ のまま代入するのが最大のミス）。`
      },
      {
        t: 'ボイル・シャルルの法則を立てる',
        m: [R`\frac{PV}{T} = \text{一定}`, R`\frac{P_{1}V_{1}}{T_{1}} = \frac{P_{2}V_{2}}{T_{2}}`],
        n: R`一定量の気体では、$\dfrac{PV}{T}$ が変化の前後で変わりません（**ボイル・シャルルの法則**）。` + kind,
        easy: R`2 つの実験結果を 1 つにまとめた法則です。(1) **ボイルの法則**: 温度を一定にして体積を $\dfrac{1}{2}$ に押し縮めると、圧力は $2$ 倍になる（$PV$ が一定）。(2) **シャルルの法則**: 圧力を一定にして絶対温度を $2$ 倍にすると、体積も $2$ 倍になる（$\dfrac{V}{T}$ が一定）。この両方をあわせたものが $\dfrac{PV}{T} = \text{一定}$ です。`
      },
      {
        t: '求める量について解いて代入する',
        m: [sym, num],
        n: R`$\dfrac{P_{1}V_{1}}{T_{1}} = \dfrac{P_{2}V_{2}}{T_{2}}$ を変形すると、変化の前後の**比**（圧力比・体積比・温度比）の積になります。` + note +
          R`なお、圧力どうし・体積どうしの比をとるので、単位は $\mathrm{L}$ のままで構いません（$\mathrm{m^{3}}$ に直す必要はありません）。温度だけは必ず $\mathrm{K}$ です。`,
        easy: R`変化の前後で $\dfrac{PV}{T}$ が同じなので、「求めたい量」だけを左に残して、残りを右に集めます。たとえば体積が半分、絶対温度が $\dfrac{4}{3}$ 倍になるなら、圧力は $2 \times \dfrac{4}{3}$ 倍になる、というように「何倍になるか」を順にかけていくと考えやすくなります。`,
        pro: R`比の形（$P_{2} = P_{1}\times\dfrac{V_{1}}{V_{2}}\times\dfrac{T_{2}}{T_{1}}$）で書くと、単位換算が不要で暗算もしやすい。`
      }
    ];
    if (find === 'T2') {
      // T₂ は途中の値（絶対温度を表示したまま 273 を引くと最後の桁が合わないことがあるので、合う桁数で書く）
      const dt = dig([r.T2], (T2) => T2 - 273);
      steps.push({
        t: 'セ氏温度に戻す',
        m: [R`t_{2} = T_{2} - 273 = ` + TD(r.T2, dt) + ' - 273' + tailOf(r.t2, [r.T2]) + R`\degree\mathrm{C}`],
        n: R`問題で「温度は何 $\degree\mathrm{C}$ か」と聞かれたら、最後に $273$ を引いて戻します。`
      });
    }
    // 検算: P₂・V₂・T₂ のうち、求めた量は途中の値なので、合う桁数で書く
    const dk = find === 'P2' ? dig([r.P2], (p) => p * r.V2 / r.T2)
      : (find === 'V2' ? dig([r.V2], (v) => r.P2 * v / r.T2) : dig([r.T2], (t) => r.P2 * r.V2 / t));
    steps.push({
      t: '検算: 変化の前後で PV/T を比べる',
      m: [R`\frac{P_{1}V_{1}}{T_{1}} = \frac{` + T(o.P1) + R` \times ` + T(o.V1) + '}{' + T(r.T1) + '} = ' + S3(r.k1),
        R`\frac{P_{2}V_{2}}{T_{2}} = \frac{` + (find === 'P2' ? SV(r.P2, dk) : T(r.P2)) + R` \times ` + (find === 'V2' ? SV(r.V2, dk) : T(r.V2)) + '}{' + (find === 'T2' ? TD(r.T2, dk) : T(r.T2)) + '} = ' + S3(r.k2)],
      n: R`2 つが（有効数字の範囲で）一致すれば、計算は合っています。`,
      lv: 2
    });
    steps.push({
      t: '補足: なぜ「絶対温度」でないといけないのか',
      n: R`$\dfrac{V}{T} = \text{一定}$ という比例関係が成り立つのは、$T$ が絶対温度のときだけです。セ氏温度 $t$ では $V$ は $t$ に比例せず（$t = 0$ で $V = 0$ にならない）、「何倍」という扱いができません。$0\,\mathrm{K}$（$= -273\degree\mathrm{C}$）が気体の体積が $0$ になる極限の温度で、これを基準にして初めて「温度が $2$ 倍なら体積も $2$ 倍」と言えます。`,
      easy: R`たとえば $27\degree\mathrm{C}$ を $54\degree\mathrm{C}$ にしても、気体の体積は $2$ 倍にはなりません。$27\degree\mathrm{C} = 300\,\mathrm{K}$ なので、体積が $2$ 倍になるのは $600\,\mathrm{K}$（$327\degree\mathrm{C}$）まで熱したときです。`,
      lv: 3
    });
    return steps;
  }

  const KINDS = { P2: '圧力 P₂', V2: '体積 V₂', T2: '温度 t₂' };

  JK.registerSim({
    id: 'thermo-boyle-charles',
    field: '熱力学',
    unit: 'p-gas',
    title: 'ボイル・シャルルの法則',
    desc: R`一定量の気体の状態 1（$P_{1},\ V_{1},\ T_{1}$）と状態 2 のうち 2 つの量を与え、残り 1 つを $\dfrac{P_{1}V_{1}}{T_{1}} = \dfrac{P_{2}V_{2}}{T_{2}}$ から求めます。温度は ℃ で入力し、絶対温度への換算も表示します。`,
    form: [R`\frac{PV}{T} = \text{一定}`, R`\frac{P_{1}V_{1}}{T_{1}} = \frac{P_{2}V_{2}}{T_{2}}`, R`T = t + 273`],
    inputs: [
      { key: 'find', label: '求める量', type: 'select', def: 'P2', options: [['P2', '圧力 P₂'], ['V2', '体積 V₂'], ['T2', '温度 t₂（℃）']] },
      { key: 'P1', label: R`状態 1 の圧力 $P_{1}$`, unit: 'Pa', type: 'num', def: '1.0e5', min: 1, max: 1e9, hint: '1.0e5 または 1.0×10^5 と入力できます' },
      { key: 'V1', label: R`状態 1 の体積 $V_{1}$`, unit: 'L', type: 'num', def: '4.0', min: 0.001, max: 1e6 },
      { key: 't1', label: R`状態 1 の温度 $t_{1}$`, unit: '℃', type: 'num', def: '27', min: -272, max: 5000 },
      { key: 'P2', label: R`状態 2 の圧力 $P_{2}$`, unit: 'Pa', type: 'num', def: '2.0e5', min: 1, max: 1e9, show: (raw) => raw.find !== 'P2' },
      { key: 'V2', label: R`状態 2 の体積 $V_{2}$`, unit: 'L', type: 'num', def: '2.0', min: 0.001, max: 1e6, show: (raw) => raw.find !== 'V2' },
      { key: 't2', label: R`状態 2 の温度 $t_{2}$`, unit: '℃', type: 'num', def: '127', min: -272, max: 5000, show: (raw) => raw.find !== 'T2' }
    ],
    examples: [
      { label: '加熱しながら圧縮（P₂ を求める）', v: { find: 'P2', P1: '1.0e5', V1: '4.0', t1: '27', V2: '2.0', t2: '127' } },
      { label: '等温変化（ボイルの法則）', v: { find: 'V2', P1: '1.0e5', V1: '6.0', t1: '20', P2: '3.0e5', t2: '20' } },
      { label: '定圧変化で温度を求める', v: { find: 'T2', P1: '1.0e5', V1: '3.0', t1: '27', P2: '1.0e5', V2: '4.5' } }
    ],
    intro: {
      easy: R`気体は、**押し縮めると圧力が上がり**、**温めると膨らもうとします**。圧力 $P$・体積 $V$・温度 $T$ のあいだには「$\dfrac{PV}{T}$ はいつも同じ値」という関係があり、これを**ボイル・シャルルの法則**といいます。3 つのうち 2 つが分かれば、残りの 1 つが計算できます。ただし温度は **絶対温度**（$\mathrm{K}$、$t\,[\degree\mathrm{C}] + 273$）で使うのが約束です。`,
      normal: R`$\dfrac{P_{1}V_{1}}{T_{1}} = \dfrac{P_{2}V_{2}}{T_{2}}$。温度は $T = t + 273$ で絶対温度に直す。$T$ 一定ならボイル、$P$ 一定ならシャルル、$V$ 一定なら $\dfrac{P}{T}$ 一定。`,
      pro: R`変化の前後の比で $P_{2} = P_{1}\dfrac{V_{1}}{V_{2}}\dfrac{T_{2}}{T_{1}}$ と書けば単位換算は不要。入試では $PV$ 図で「何が一定の変化か」を最初に確認する。`
    },
    compute(v) {
      const o = Object.assign({}, v);
      const r = bcCalc(o);
      must(r.P2, r.V2, r.T2);
      if (!(r.T2 > 0)) throw new JK.CalcError('絶対温度が 0 K 以下になります。入力を見直してください。');
      const res = [];
      if (v.find === 'P2') res.push({ label: '圧力 P₂', tex: S3(r.P2) + R`\,\mathrm{Pa}` });
      else if (v.find === 'V2') res.push({ label: '体積 V₂', tex: S3(r.V2) + R`\,\mathrm{L}` });
      else res.push({ label: '温度 t₂', tex: S3(r.t2) + R`\degree\mathrm{C}\ (T_{2} = ` + S3(r.T2) + R`\,\mathrm{K})` });
      res.push({ label: '状態 1 の絶対温度 T₁', tex: S3(r.T1) + R`\,\mathrm{K}` });
      if (v.find !== 'T2') res.push({ label: '状態 2 の絶対温度 T₂', tex: S3(r.T2) + R`\,\mathrm{K}` });
      const sameT = near(r.T1, r.T2), sameP = near(v.P1, r.P2), sameV = near(v.V1, r.V2);
      res.push({
        label: '変化の種類',
        tex: sameT && !sameP ? R`\text{等温変化（ボイルの法則）}` : (sameP && !sameT ? R`\text{定圧変化（シャルルの法則）}` : (sameV && !sameT ? R`\text{定積変化（}P \propto T\text{）}` : R`\text{一般の変化（ボイル・シャルル）}`))
      });
      return { result: res, steps: bcSteps(o, r), fig: bcFigure(o, r) };
    },
    exercise(rng, level) {
      const P1 = rng.pick([1.0e5, 2.0e5, 1.5e5, 3.0e5]);
      const V1 = rng.pick([2.0, 3.0, 4.0, 6.0, 8.0, 12.0]);
      const t1 = rng.pick([27, 7, 47, 17, 37, 57]);
      const T1 = t1 + 273;
      const pT = (x) => '$' + T(x) + R`\,\mathrm{Pa}$`;
      const fmtL = (x) => x.toFixed(1);
      // 小数 1 桁に収まる倍率だけを使って、体積をきりのよい値にする
      const pickV = (base, factors) => {
        const ok = factors.filter((f) => Math.abs(base * f * 10 - Math.round(base * f * 10)) < 1e-9);
        return base * rng.pick(ok.length ? ok : [2]);
      };
      if (level === 'basic') {
        // ボイルの法則（等温）か、シャルルの法則（定圧）
        if (rng.bool(0.5)) {
          const V2 = pickV(V1, [0.5, 2, 0.25, 1.5, 3, 4]);
          const o = { find: 'P2', P1: P1, V1: V1, t1: t1, V2: V2, t2: t1 };
          const r = bcCalc(o);
          const P3 = P1 * rng.pick([2, 4, 0.5]);
          const r3 = bcCalc({ find: 'V2', P1: P1, V1: V1, t1: t1, P2: P3, t2: t1 });
          // (2) の答え（圧力を P₃ にしたときの体積）を、解説にも同じ値で書く（検算の前に入れる）
          const sol = bcSteps(o, r);
          sol.splice(4, 0, {
            t: R`(2) 圧力を $P_{3} = ` + T(P3) + R`\,\mathrm{Pa}$ にしたときの体積 $V_{3}$（同じ式で $V$ を求める）`,
            m: [R`V_{3} = V_{1} \times \frac{P_{1}}{P_{3}} \times \frac{T_{3}}{T_{1}} = ` + T(V1) + R` \times \frac{` + T(P1) + '}{' + T(P3) + R`} \times 1 = ` + S3(r3.V2) + R`\,\mathrm{L}`],
            n: R`温度は一定（$T_{3} = T_{1}$）なので温度の比は $1$ で、$P_{1}V_{1} = P_{3}V_{3}$（ボイルの法則）から $V_{3} = V_{1} \times \dfrac{P_{1}}{P_{3}}$ です。圧力が何倍になったかを見て、体積はその逆数倍になります。`
          });
          return {
            title: '温度一定で体積を変える',
            body: R`ピストンつきの容器に気体が閉じこめてあり、圧力は ` + pT(P1) + R`、体積は $` + fmtL(V1) + R`\,\mathrm{L}$、温度は $` + t1 + R`\degree\mathrm{C}$ である。温度を一定に保ったまま、次の問いに答えよ（有効数字 3 桁）。`,
            fig: bcFigure(o, r, { unknown: 'P2' }),
            parts: [
              { label: '(1)', q: R`体積を $` + fmtL(V2) + R`\,\mathrm{L}$ にしたときの圧力`, type: 'num', answer: p3(r.P2), rel: 0.02, unit: 'Pa', show: S3(r.P2) },
              { label: '(2)', q: R`圧力を ` + pT(P3) + R` にしたときの体積`, type: 'num', answer: p3(r3.V2), rel: 0.02, unit: 'L' }
            ],
            solution: sol
          };
        }
        const t2 = T1 * rng.pick([1.5, 2, 0.5]) - 273;
        const o = { find: 'V2', P1: P1, V1: V1, t1: t1, P2: P1, t2: t2 };
        const r = bcCalc(o);
        const V3 = pickV(V1, [1.5, 2, 0.5, 0.25, 3]);
        const r3 = bcCalc({ find: 'T2', P1: P1, V1: V1, t1: t1, P2: P1, V2: V3 });
        // (2) の答え（体積を V₃ にするときの温度）を、解説にも同じ値で書く（検算の前に入れる）
        const sol = bcSteps(o, r);
        const d3 = dig([r3.T2], (T3) => T3 - 273);       // T₃ は途中の値。273 を引いて結果と合う桁数で書く
        sol.splice(4, 0, {
          t: R`(2) 体積を $V_{3} = ` + fmtL(V3) + R`\,\mathrm{L}$ にするときの温度 $T_{3}$（同じ式で $T$ を求める）`,
          m: [R`T_{3} = T_{1} \times \frac{V_{3}}{V_{1}} = ` + T(r3.T1) + R` \times \frac{` + T(V3) + '}{' + T(V1) + '} = ' + S3(r3.T2) + R`\,\mathrm{K}`,
            R`t_{3} = T_{3} - 273 = ` + TD(r3.T2, d3) + ' - 273' + tailOf(r3.t2, [r3.T2]) + R`\degree\mathrm{C}`],
          n: R`圧力は一定（$P_{3} = P_{1}$）なので、シャルルの法則 $\dfrac{V_{1}}{T_{1}} = \dfrac{V_{3}}{T_{3}}$ から $T_{3} = T_{1} \times \dfrac{V_{3}}{V_{1}}$ です。「温度は何 $\degree\mathrm{C}$ か」と聞かれたので、最後に $273$ を引いてセ氏温度に戻します。`
        });
        return {
          title: '圧力一定で温度を変える',
          body: R`ピストンが自由に動く容器に気体が入っており、圧力は常に ` + pT(P1) + R` で一定である。はじめ体積は $` + fmtL(V1) + R`\,\mathrm{L}$、温度は $` + t1 + R`\degree\mathrm{C}$ であった。次の問いに答えよ（有効数字 3 桁）。`,
          fig: bcFigure(o, r, { unknown: 'V2' }),
          parts: [
            { label: '(1)', q: R`温度を $` + t2 + R`\degree\mathrm{C}$ にしたときの体積`, type: 'num', answer: p3(r.V2), rel: 0.02, unit: 'L' },
            { label: '(2)', q: R`体積を $` + fmtL(V3) + R`\,\mathrm{L}$ にするには、温度を何 $\degree\mathrm{C}$ にすればよいか`, type: 'num', answer: p3(r3.t2), rel: 0.02, unit: '℃', tol: 0.6 }
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        const find = rng.pick(['P2', 'V2', 'T2']);
        const t2 = rng.pick([127, 77, 227, 57, -23, 87]);
        const fP = rng.pick([2, 0.5, 3, 1.5]);
        const o = { find: find, P1: P1, V1: V1, t1: t1 };
        if (find === 'P2') { o.V2 = pickV(V1, [0.5, 2, 0.25, 1.5, 3]); o.t2 = t2; }
        if (find === 'V2') { o.P2 = P1 * fP; o.t2 = t2; }
        if (find === 'T2') { o.P2 = P1 * fP; o.V2 = pickV(V1, [0.5, 2, 0.25, 1.5, 3]); for (let i = 0; i < 100 && !(T1 * (o.P2 / P1) * (o.V2 / V1) >= 200 && T1 * (o.P2 / P1) * (o.V2 / V1) <= 1500); i++) { o.P2 = P1 * rng.pick([2, 0.5, 3, 1.5]); o.V2 = pickV(V1, [0.5, 2, 0.25, 1.5, 3]); } }   // 状態 2 の温度が現実的な範囲（200〜1500 K）に収まる組だけ
        const r = bcCalc(o);
        if (find === 'T2') o.t2 = r.t2;
        const given2 = find === 'P2' ? R`体積 $` + fmtL(o.V2) + R`\,\mathrm{L}$、温度 $` + t2 + R`\degree\mathrm{C}$`
          : (find === 'V2' ? R`圧力 ` + pT(o.P2) + R`、温度 $` + t2 + R`\degree\mathrm{C}$` : R`圧力 ` + pT(o.P2) + R`、体積 $` + fmtL(o.V2) + R`\,\mathrm{L}$`);
        const parts = [
          { label: '(1)', q: R`はじめの状態の絶対温度 $T_{1}$`, type: 'num', answer: T1, rel: 0.02, unit: 'K' }
        ];
        if (find === 'P2') parts.push({ label: '(2)', q: R`状態 2 の圧力 $P_{2}$`, type: 'num', answer: p3(r.P2), rel: 0.02, unit: 'Pa', show: S3(r.P2) });
        if (find === 'V2') parts.push({ label: '(2)', q: R`状態 2 の体積 $V_{2}$`, type: 'num', answer: p3(r.V2), rel: 0.02, unit: 'L' });
        if (find === 'T2') {
          parts.push({ label: '(2)', q: R`状態 2 の絶対温度 $T_{2}$`, type: 'num', answer: p3(r.T2), rel: 0.02, unit: 'K' });
          parts.push({ label: '(3)', q: R`状態 2 のセ氏温度 $t_{2}$`, type: 'num', answer: p3(r.t2), rel: 0.02, unit: '℃', tol: 0.6 });
        }
        return {
          title: '圧力・体積・温度がすべて変わる',
          body: R`一定量の気体が、圧力 ` + pT(P1) + R`、体積 $` + fmtL(V1) + R`\,\mathrm{L}$、温度 $` + t1 + R`\degree\mathrm{C}$ の状態 1 から、` + given2 + R` の状態 2 に変化した。次の問いに答えよ（有効数字 3 桁）。`,
          fig: bcFigure(o, r, { unknown: find }),
          parts: parts,
          solution: bcSteps(o, r)
        };
      }
      // adv: 2 段階の変化（状態 1 → 定圧膨張 → 状態 2 → 体積固定で冷却 → 状態 3）
      const fV = rng.pick([2, 1.5, 3]);
      const V2 = V1 * fV;
      const T2 = T1 * fV;
      const T3 = rng.pick([T1, T1 / 2, T1 * 0.75].filter((x) => Number.isInteger(x)));
      const P3 = P1 * T3 / T2;
      const rAC = { T1: T1, T2: T3, P2: P3, V2: V2, t2: T3 - 273, k1: P1 * V1 / T1, k2: P3 * V2 / T3 };
      const dk3 = dig([P3], (p) => p * V2 / T3);        // P₃ は途中の値。PV/T の式に代入して結果と合う桁数で書く
      const oAC = { find: 'P2', P1: P1, V1: V1, t1: t1, V2: V2, t2: T3 - 273 };
      const solution = [
        {
          t: '図で状況をつかむ（2 段階の変化）',
          n: R`状態 1（$P_{1},\ V_{1},\ T_{1}$）→ 圧力一定で体積 $` + fmtL(V2) + R`\,\mathrm{L}$ まで膨張（状態 2）→ ピストンを固定して（体積一定）温度を $` + T3 + R`\,\mathrm{K}$ まで下げる（状態 3）。それぞれの変化にボイル・シャルルの法則を使います。`,
          easy: R`変化を「1 つずつ」に分けるのがコツです。最初の変化では圧力が変わらず、次の変化では体積が変わりません。それぞれの変化で「何が一定か」を確かめてから式を立てます。`
        },
        {
          t: R`状態 1 → 2（定圧変化）: 状態 2 の絶対温度`,
          m: [R`T_{1} = ` + t1 + ' + 273 = ' + T1 + R`\,\mathrm{K}`, R`\frac{V_{1}}{T_{1}} = \frac{V_{2}}{T_{2}} \;\Rightarrow\; T_{2} = T_{1} \times \frac{V_{2}}{V_{1}} = ` + T1 + R` \times \frac{` + fmtL(V2) + '}{' + fmtL(V1) + '} = ' + S3(T2) + R`\,\mathrm{K}`],
          n: R`圧力が一定なので、シャルルの法則 $\dfrac{V}{T} = \text{一定}$ を使います。体積が $` + U.fmt(fV) + R`$ 倍になったので、絶対温度も $` + U.fmt(fV) + R`$ 倍です。`,
          easy: R`圧力が変わらないときは、体積と絶対温度が同じ倍率で変わります。体積が $` + U.fmt(fV) + R`$ 倍になったなら、絶対温度（$\mathrm{K}$）も $` + U.fmt(fV) + R`$ 倍です。`
        },
        {
          t: R`状態 2 → 3（定積変化）: 状態 3 の圧力`,
          m: [R`\frac{P_{2}}{T_{2}} = \frac{P_{3}}{T_{3}} \;\Rightarrow\; P_{3} = P_{2} \times \frac{T_{3}}{T_{2}}`,
            R`P_{3} = ` + T(P1) + R` \times \frac{` + S3(T3) + '}{' + S3(T2) + '} = ' + S3(P3) + R`\,\mathrm{Pa}`],
          n: R`体積が一定なので $\dfrac{P}{T} = \text{一定}$。状態 2 の圧力は状態 1 と同じ $P_{1} = ` + T(P1) + R`\,\mathrm{Pa}$ です（定圧変化のあとなので）。`,
          easy: R`体積を固定したまま冷やすと、圧力は絶対温度に比例して下がります。温度（$\mathrm{K}$）が $\dfrac{` + S3(T3) + '}{' + S3(T2) + R`}$ 倍になるので、圧力もその倍率になります。`,
          pro: R`状態 1 → 3 を一気に $\dfrac{P_{1}V_{1}}{T_{1}} = \dfrac{P_{3}V_{2}}{T_{3}}$ と書いても同じ結果になります（途中の状態 2 は経由するだけ）。`
        },
        {
          t: '検算: 状態 1 と状態 3 で PV/T を比べる',
          m: [R`\frac{P_{1}V_{1}}{T_{1}} = \frac{` + T(P1) + R` \times ` + fmtL(V1) + '}{' + T1 + '} = ' + S3(rAC.k1),
            R`\frac{P_{3}V_{3}}{T_{3}} = \frac{` + SV(P3, dk3) + R` \times ` + fmtL(V2) + '}{' + T3 + '} = ' + S3(rAC.k2)],
          n: R`ボイル・シャルルの法則は、途中の変化を経由しても、はじめと終わりだけで成り立ちます（状態 3 の体積 $V_{3}$ は状態 2 と同じ $` + fmtL(V2) + R`\,\mathrm{L}$）。`,
          lv: 2
        }
      ];
      return {
        title: '定圧変化のあと体積を固定して冷やす',
        body: R`ピストンつきの容器に閉じこめた気体が、状態 1（圧力 ` + pT(P1) + R`、体積 $` + fmtL(V1) + R`\,\mathrm{L}$、温度 $` + t1 + R`\degree\mathrm{C}$）にある。まず圧力を一定に保って体積を $` + fmtL(V2) + R`\,\mathrm{L}$ まで膨張させ（状態 2）、次にピストンを固定して体積を変えずに温度を $` + T3 + R`\,\mathrm{K}$ まで下げた（状態 3）。次の問いに答えよ（有効数字 3 桁）。`,
        fig: bcFigure(oAC, rAC, { unknown: 'P2', idx: ['1', '3'] }),
        parts: [
          { label: '(1)', q: R`状態 2 の絶対温度 $T_{2}$`, type: 'num', answer: p3(T2), rel: 0.02, unit: 'K' },
          { label: '(2)', q: R`状態 3 の圧力 $P_{3}$`, type: 'num', answer: p3(P3), rel: 0.02, unit: 'Pa', show: S3(P3) }
        ],
        solution: solution
      };
    }
  });

  /* ================= 2. 理想気体の状態方程式 ================= */

  function seCalc(v) {
    // v: { find, P[Pa], V[L], n[mol], t[℃] } 求める量以外が入っている
    const T = v.find === 'T' ? NaN : v.t + 273;
    let P_ = v.P, Vm = v.V / 1000, n = v.n, T_ = T;
    if (v.find === 'P') P_ = n * RG * T_ / Vm;
    else if (v.find === 'V') Vm = n * RG * T_ / P_;
    else if (v.find === 'n') n = P_ * Vm / (RG * T_);
    else T_ = P_ * Vm / (n * RG);
    return { P: P_, Vm: Vm, VL: Vm * 1000, n: n, T: T_, t: T_ - 273 };
  }

  // 状態方程式の図: 容器（体積）・分子（物質量）・圧力の矢印・温度計
  function seFigure(r, opt) {
    opt = opt || {};
    const unk = opt.unknown;
    const d = JK.plot.draw(360, 214);
    const frac = Math.max(0.2, Math.min(0.95, 0.5 + 0.18 * Math.log10(r.VL / 25)));
    const arrow = Math.max(12, Math.min(34, 22 + 9 * Math.log10(r.P / 1e5)));
    const nd = Math.max(3, Math.min(24, Math.round(6 + 6 * Math.log10(r.n))));
    const yb = 144, w = 120, x = 20;
    cylinder(d, x, yb, w, 96 * frac, arrow, nd, 'P');
    // 温度計
    const tf = Math.max(0.08, Math.min(0.95, 0.1 + 0.85 * Math.log10(1 + r.T / 100) / Math.log10(61)));
    const yt = 50, yB = 134, xT = 168;
    d.rect(xT - 4, yt, 8, yB - yt, { cls: 'fg', rx: 4 });
    const fy = yB - (yB - yt) * tf;
    d.group('<rect x="' + r2(xT - 2.2) + '" y="' + r2(fy) + '" width="4.4" height="' + r2(yB - fy + 4) + '" class="fs-c3" stroke="none"/>');
    d.circle(xT, yB + 7, 7.5, { cls: 'c3', fill: 'f3' });
    d.text(xT, yt - 8, 'T');
    // 数値
    const L = [['気体の状態', null]];
    L.push(['P = ' + (unk === 'P' ? '?' : tx(r.P) + ' Pa'), 0]);
    L.push(['V = ' + (unk === 'V' ? '?' : tx(r.VL) + ' L'), 0]);
    if (unk !== 'V') L.push(['  = ' + tx(r.Vm) + ' m³', 1]);
    L.push(['n = ' + (unk === 'n' ? '?' : tx(r.n) + ' mol'), 0]);
    L.push(['T = ' + (unk === 'T' ? '?' : tx(r.T) + ' K'), 0]);
    if (unk !== 'T') L.push(['  = ' + tx(r.t) + ' ℃', 1]);
    L.forEach((l, i) => d.text(196, 44 + i * 17, l[0], { anchor: 'start', bold: l[1] === null, cls: l[1] === 1 ? 'dim' : 'fg' }));
    d.text(x + w / 2, yb + 24, '分子の数 ∝ n、容器の大きさ ∝ V', { size: 11 });
    d.text(x + w / 2, yb + 40, '（模式図・縮尺は目安）', { size: 11, cls: 'dim' });
    return d.svg();
  }

  function seSteps(v, r) {
    const find = v.find;
    const steps = [
      {
        t: '図で状況をつかむ',
        n: R`気体の状態は、**圧力**（$P$）・**体積**（$V$）・**物質量**（$n$）・**絶対温度**（$T$）の 4 つの量で決まります。このうち 3 つが分かれば、残りの 1 つは**理想気体の状態方程式**で決まります。`,
        easy: R`**圧力**は、気体の粒が容器の壁を押す力（壁の $1\,\mathrm{m^{2}}$ あたり）で、単位は $\mathrm{Pa}$（パスカル）です。**物質量** $n$ は粒の数をまとめて数える単位で、粒 $6.02 \times 10^{23}$ 個を $1\,\mathrm{mol}$ とします（鉛筆を「ダース」で数えるのと同じ発想）。**絶対温度**は、粒が動き回る激しさを表す温度です。`
      }
    ];
    const conv = [];
    if (find !== 'V') conv.push(R`V = ` + T(v.V) + R`\,\mathrm{L} = ` + T(v.V) + R` \times 10^{-3}\,\mathrm{m^{3}} = ` + GS(r.Vm) + R`\,\mathrm{m^{3}}`);
    if (find !== 'T') conv.push(R`T = t + 273 = ` + T(v.t) + ' + 273 = ' + T(r.T) + R`\,\mathrm{K}`);
    steps.push({
      t: '単位をそろえる（L → m³、℃ → K）',
      m: conv.length ? conv : [R`1\,\mathrm{L} = 10^{-3}\,\mathrm{m^{3}},\quad T = t + 273`],
      n: R`気体定数 $R = 8.3\,\mathrm{J/(mol\cdot K)}$ は SI 単位（$\mathrm{Pa}$、$\mathrm{m^{3}}$、$\mathrm{mol}$、$\mathrm{K}$）で使います。体積は $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^{3}}$、温度は $T = t + 273$ で換算します。` + (find === 'P' || find === 'V' || find === 'n' || find === 'T' ? '' : ''),
      easy: R`$1\,\mathrm{L}$ は、1 辺 $10\,\mathrm{cm}$ の立方体の体積（$1000\,\mathrm{cm^{3}}$）です。$1\,\mathrm{m} = 100\,\mathrm{cm}$ なので $1\,\mathrm{m^{3}} = 100^{3} = 10^{6}\,\mathrm{cm^{3}}$、つまり $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^{3}}$ です。温度は、セ氏温度に $273$ を足すと絶対温度になります。`,
      pro: R`$\mathrm{L}$ と $\mathrm{Pa}$ の組は $\mathrm{Pa \cdot L} = 10^{-3}\,\mathrm{J}$。$PV$ を J で出すなら体積は必ず $\mathrm{m^{3}}$ に直しておく。`
    });
    steps.push({
      t: '理想気体の状態方程式を立てる',
      m: [R`PV = nRT`],
      n: R`理想気体では $PV = nRT$ が成り立ちます（$R = 8.3\,\mathrm{J/(mol\cdot K)}$ は気体の種類によらない共通の値で、**気体定数**といいます）。`,
      easy: R`先ほどのボイル・シャルルの法則は「$\dfrac{PV}{T}$ が一定」でした。その「一定の値」が、気体の量 $n$ が $1\,\mathrm{mol}$ のとき $R$、$n\,\mathrm{mol}$ のとき $nR$ になる、というのが状態方程式 $\dfrac{PV}{T} = nR$ です。`
    });
    let sym, num, concl;
    if (find === 'P') {
      sym = R`P = \frac{nRT}{V}`;
      num = R`P = \frac{` + T(v.n) + R` \times 8.3 \times ` + T(r.T) + '}{' + GS(r.Vm) + '} = ' + S3(r.P) + R`\,\mathrm{Pa}`;
    } else if (find === 'V') {
      sym = R`V = \frac{nRT}{P}`;
      num = R`V = \frac{` + T(v.n) + R` \times 8.3 \times ` + T(r.T) + '}{' + T(v.P) + '} = ' + S3(r.Vm) + R`\,\mathrm{m^{3}}`;
      concl = R`V = ` + S3(r.Vm) + R`\,\mathrm{m^{3}} = ` + S3(r.VL) + R`\,\mathrm{L}`;
    } else if (find === 'n') {
      sym = R`n = \frac{PV}{RT}`;
      num = R`n = \frac{` + T(v.P) + R` \times ` + GS(r.Vm) + R`}{8.3 \times ` + T(r.T) + '} = ' + S3(r.n) + R`\,\mathrm{mol}`;
    } else {
      sym = R`T = \frac{PV}{nR}`;
      num = R`T = \frac{` + T(v.P) + R` \times ` + GS(r.Vm) + '}{' + T(v.n) + R` \times 8.3} = ` + S3(r.T) + R`\,\mathrm{K}`;
      // T は途中の値（絶対温度を表示したまま 273 を引くと最後の桁が合わないことがあるので、合う桁数で書く）
      concl = R`t = T - 273 = ` + TD(r.T, dig([r.T], (T_) => T_ - 273)) + ' - 273' + tailOf(r.t, [r.T]) + R`\degree\mathrm{C}`;
    }
    steps.push({
      t: '求める量について解いて、数値を代入する',
      m: [sym, num],
      n: R`$PV = nRT$ を、求める量について解きます。数値を代入するときは、単位がすべて SI であることを確かめます。`,
      easy: R`状態方程式は「$P$ と $V$ を掛けたもの」と「$n$、$R$、$T$ を掛けたもの」が等しいという式です。求めたい文字を左に 1 つだけ残して、残りを右に移すように式を変形します。`,
      pro: R`$P$ を求めるなら $\dfrac{nRT}{V}$、$V$ を求めるなら $\dfrac{nRT}{P}$。文字式を先に書いてから数値を入れると、約分や桁のミスが減ります。`
    });
    if (concl) {
      steps.push({
        t: find === 'T' ? 'セ氏温度に戻す' : '単位を L に戻す',
        m: [concl],
        n: find === 'T' ? R`問題で $\degree\mathrm{C}$ が求められているときは、最後に $273$ を引きます。` : R`$1\,\mathrm{m^{3}} = 10^{3}\,\mathrm{L}$ なので、$10^{3}$ を掛けて $\mathrm{L}$ に戻します。`
      });
    }
    // 検算: 求めた量は途中の値なので、PV と nRT の式に代入して結果と合う桁数で書く（それ以外は問題文の値）
    const pvP = find === 'P' ? SV(r.P, dig([r.P], (p) => p * r.Vm)) : T(r.P);
    const pvV = find === 'V' ? SV(r.Vm, dig([r.Vm], (vm) => r.P * vm)) : GS(r.Vm);
    const rtN = find === 'n' ? SV(r.n, dig([r.n], (n_) => n_ * RG * r.T)) : T(r.n);
    const rtT = find === 'T' ? TD(r.T, dig([r.T], (T_) => r.n * RG * T_)) : T(r.T);
    steps.push({
      t: '検算: 両辺を別々に計算して比べる',
      m: [R`PV = ` + pvP + R` \times ` + pvV + ' = ' + S3(r.P * r.Vm) + R`\,\mathrm{J}`, R`nRT = ` + rtN + R` \times 8.3 \times ` + rtT + ' = ' + S3(r.n * RG * r.T) + R`\,\mathrm{J}`],
      n: R`左辺 $PV$ と右辺 $nRT$ が等しくなっています（どちらも「エネルギー」の単位 $\mathrm{J}$ になります）。`,
      lv: 2
    });
    steps.push({
      t: '補足: 1 mol の気体の体積の目安',
      m: [R`V = \frac{1 \times 8.3 \times 273}{1.013 \times 10^{5}} = 2.24 \times 10^{-2}\,\mathrm{m^{3}} = 22.4\,\mathrm{L}`],
      n: R`$0\degree\mathrm{C}$（$273\,\mathrm{K}$）・$1$ 気圧（$1.013 \times 10^{5}\,\mathrm{Pa}$）で $1\,\mathrm{mol}$ の気体の体積は約 $22.4\,\mathrm{L}$ です（標準状態）。答えが極端にずれていたら、単位換算（$\mathrm{L}$ と $\mathrm{m^{3}}$）の間違いを疑います。`,
      easy: R`$1\,\mathrm{mol}$ の気体は、$0\degree\mathrm{C}$・$1$ 気圧でおよそ $22.4\,\mathrm{L}$（一辺 $28\,\mathrm{cm}$ ほどの箱の大きさ）。この感覚があれば、計算結果が「ありえる大きさか」をすぐ確かめられます。`,
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'thermo-state-eq',
    field: '熱力学',
    unit: 'p-gas',
    title: '理想気体の状態方程式',
    desc: R`理想気体の状態方程式 $PV = nRT$（$R = 8.3\,\mathrm{J/(mol\cdot K)}$）で、圧力・体積・物質量・温度のうち 1 つを求めます。L → m³、℃ → K の単位換算も明示します。`,
    form: [R`PV = nRT`, R`R = 8.3\,\mathrm{J/(mol\cdot K)}`, R`1\,\mathrm{L} = 10^{-3}\,\mathrm{m^{3}},\quad T = t + 273`],
    inputs: [
      { key: 'find', label: '求める量', type: 'select', def: 'V', options: [['P', '圧力 P'], ['V', '体積 V'], ['n', '物質量 n'], ['T', '温度 t（℃）']] },
      { key: 'P', label: R`圧力 $P$`, unit: 'Pa', type: 'num', def: '1.0e5', min: 1, max: 1e10, hint: '1.0e5 または 1.0×10^5 と入力できます', show: (raw) => raw.find !== 'P' },
      { key: 'V', label: R`体積 $V$`, unit: 'L', type: 'num', def: '24.9', min: 0.0001, max: 1e7, show: (raw) => raw.find !== 'V' },
      { key: 'n', label: R`物質量 $n$`, unit: 'mol', type: 'num', def: '1.0', min: 0.0001, max: 1e6, show: (raw) => raw.find !== 'n' },
      { key: 't', label: R`温度 $t$`, unit: '℃', type: 'num', def: '27', min: -272, max: 10000, show: (raw) => raw.find !== 'T' }
    ],
    examples: [
      { label: '1 mol・27 ℃・1 気圧 → 体積', v: { find: 'V', P: '1.0e5', n: '1.0', t: '27' } },
      { label: '密閉容器の圧力', v: { find: 'P', V: '10', n: '0.50', t: '127' } },
      { label: '物質量を求める', v: { find: 'n', P: '2.0e5', V: '5.0', t: '27' } },
      { label: '温度を求める（℃）', v: { find: 'T', P: '1.0e5', V: '12.45', n: '0.50' } }
    ],
    intro: {
      easy: R`気体の状態は、**圧力**（$P$）・**体積**（$V$）・**物質量**（$n$、粒の数のまとめ方で単位は $\mathrm{mol}$）・**絶対温度**（$T$）の 4 つで決まり、その関係が $PV = nRT$ です。$R = 8.3\,\mathrm{J/(mol\cdot K)}$ はどんな気体でも同じ定数。3 つが分かれば残りの 1 つが出せます。ただし、体積は $\mathrm{m^{3}}$、温度は $\mathrm{K}$ に直してから代入するのがルールです。`,
      normal: R`$PV = nRT$。$P\,[\mathrm{Pa}]$、$V\,[\mathrm{m^{3}}]$、$n\,[\mathrm{mol}]$、$T\,[\mathrm{K}]$ をそろえて代入する。$1\,\mathrm{L} = 10^{-3}\,\mathrm{m^{3}}$、$T = t + 273$。`,
      pro: R`単位換算（$\mathrm{L} \to \mathrm{m^{3}}$、$\degree\mathrm{C} \to \mathrm{K}$）が最大の失点源。標準状態 $1\,\mathrm{mol} = 22.4\,\mathrm{L}$ を答えの目安にして桁をチェックする。`
    },
    compute(v) {
      const o = Object.assign({}, v);
      const r = seCalc(o);
      must(r.P, r.Vm, r.n, r.T);
      if (!(r.T > 0)) throw new JK.CalcError('絶対温度が 0 K 以下になります。入力を見直してください。');
      const res = [];
      if (v.find === 'P') res.push({ label: '圧力 P', tex: S3(r.P) + R`\,\mathrm{Pa}` });
      if (v.find === 'V') res.push({ label: '体積 V', tex: S3(r.VL) + R`\,\mathrm{L}\ (= ` + S3(r.Vm) + R`\,\mathrm{m^{3}})` });
      if (v.find === 'n') res.push({ label: '物質量 n', tex: S3(r.n) + R`\,\mathrm{mol}` });
      if (v.find === 'T') res.push({ label: '温度 t', tex: S3(r.t) + R`\degree\mathrm{C}\ (T = ` + S3(r.T) + R`\,\mathrm{K})` });
      res.push({ label: 'PV（= nRT）', tex: S3(r.P * r.Vm) + R`\,\mathrm{J}` });
      return { result: res, steps: seSteps(o, r), fig: seFigure(r) };
    },
    exercise(rng, level) {
      const pT = (x) => '$' + T(x) + R`\,\mathrm{Pa}$`;
      const n = rng.pick([0.50, 1.0, 2.0, 0.20, 0.10]);
      const t = rng.pick([27, 7, 47, 127, 0, 57]);
      const P0 = rng.pick([1.0e5, 2.0e5, 3.0e5, 0.50e5, 1.5e5]);
      const nTex = n.toFixed(2);
      const common = R`気体定数を $R = 8.3\,\mathrm{J/(mol\cdot K)}$ とし、気体は理想気体として扱う。有効数字 3 桁で答えよ。`;
      if (level === 'basic') {
        const o = { find: 'V', P: P0, n: n, t: t };
        const r = seCalc(o);
        return {
          title: '気体の体積を求める',
          body: R`なめらかに動くピストンつきの容器に、物質量 $` + nTex + R`\,\mathrm{mol}$ の理想気体が入っている。圧力が ` + pT(P0) + R`、温度が $` + t + R`\degree\mathrm{C}$ のとき、気体の体積は何 $\mathrm{L}$ か。` + common,
          fig: seFigure(r, { unknown: 'V' }),
          parts: [
            { label: '(1)', q: R`気体の絶対温度 $T$`, type: 'num', answer: t + 273, rel: 0.02, unit: 'K' },
            { label: '(2)', q: R`気体の体積 $V$`, type: 'num', answer: p3(r.VL), rel: 0.02, unit: 'L' }
          ],
          solution: seSteps(o, r)
        };
      }
      if (level === 'mid') {
        const V = rng.pick([5.0, 10.0, 20.0, 8.3, 16.6]);
        if (rng.bool(0.5)) {
          const o = { find: 'P', V: V, n: n, t: t };
          const r = seCalc(o);
          return {
            title: '容器内の気体の圧力',
            body: R`体積 $` + V.toFixed(1) + R`\,\mathrm{L}$ の密閉容器に、物質量 $` + nTex + R`\,\mathrm{mol}$ の理想気体が入っており、温度は $` + t + R`\degree\mathrm{C}$ である。` + common,
            fig: seFigure(r, { unknown: 'P' }),
            parts: [
              { label: '(1)', q: R`容器の体積 $V$ を $\mathrm{m^{3}}$ で表すと`, type: 'num', answer: V / 1000, rel: 0.02, unit: 'm³', show: S3(V / 1000) },
              { label: '(2)', q: R`気体の圧力 $P$`, type: 'num', answer: p3(r.P), rel: 0.02, unit: 'Pa', show: S3(r.P) }
            ],
            solution: seSteps(o, r)
          };
        }
        const o = { find: 'n', P: P0, V: V, t: t };
        const r = seCalc(o);
        // (2) の答え（分子の数 N = nN_A）を、解説にも同じ値で書く（検算の前に入れる）
        const sol = seSteps(o, r);
        const dN = dig([r.n], (n_) => n_ * 6.0e23);     // n は途中の値。アボガドロ定数を掛けて結果と合う桁数で書く
        sol.splice(4, 0, {
          t: R`(2) 分子の数（物質量 $\times$ アボガドロ定数）`,
          m: [R`N = nN_{\mathrm{A}} = ` + SV(r.n, dN) + R` \times 6.0 \times 10^{23} = ` + S3(r.n * 6.0e23) + R`\,\text{個}`],
          n: R`物質量 $n\,\mathrm{mol}$ の気体には、$1\,\mathrm{mol}$ あたり $N_{\mathrm{A}} = 6.0 \times 10^{23}$ 個（アボガドロ定数）の分子が含まれているので、分子の数は $N = nN_{\mathrm{A}}$ です。`
        });
        return {
          title: '気体の物質量を求める',
          body: R`体積 $` + V.toFixed(1) + R`\,\mathrm{L}$ の容器に理想気体が入っており、圧力は ` + pT(P0) + R`、温度は $` + t + R`\degree\mathrm{C}$ である。` + common,
          fig: seFigure(r, { unknown: 'n' }),
          parts: [
            { label: '(1)', q: R`気体の物質量 $n$`, type: 'num', answer: p3(r.n), rel: 0.02, unit: 'mol' },
            { label: '(2)', q: R`気体の分子の数（アボガドロ定数 $6.0 \times 10^{23}\,\mathrm{/mol}$）`, type: 'num', answer: p3(r.n * 6.0e23), rel: 0.02, unit: '個', show: S3(r.n * 6.0e23) }
          ],
          solution: sol
        };
      }
      // adv: 温度を求める＋2 状態の比較（温度が 250〜520 K に収まる組み合わせから選ぶ）
      const combos = [];
      [1.0e5, 2.0e5, 3.0e5, 1.5e5, 0.5e5].forEach((pp) => [4.0, 5.0, 8.3, 10.0, 16.6, 20.0, 24.9, 25.0, 40.0].forEach((vv) => [0.10, 0.20, 0.50, 1.0, 2.0, 3.0].forEach((nn) => {
        const Tt = pp * vv / 1000 / (nn * RG);
        if (Tt >= 250 && Tt <= 520) combos.push([pp, vv, nn]);
      })));
      const cb = rng.pick(combos);
      const P0a = cb[0], V = cb[1], na = cb[2];
      const o = { find: 'T', P: P0a, V: V, n: na };
      const r = seCalc(o);
      const P2 = P0a * rng.pick([2, 1.5, 0.5]);
      const o2 = { find: 'V', P: P2, n: na, t: r.t };
      const r2c = seCalc(o2);
      return {
        title: '気体の温度と圧力変化',
        body: R`物質量 $` + na.toFixed(2) + R`\,\mathrm{mol}$ の理想気体が、体積 $` + V.toFixed(1) + R`\,\mathrm{L}$ の容器に入っており、圧力は ` + pT(P0a) + R` である。` + common + R`ただし、セ氏温度は $T - 273$ で求める。`,
        fig: seFigure(r, { unknown: 'T' }),
        parts: [
          { label: '(1)', q: R`気体の絶対温度 $T$`, type: 'num', answer: p3(r.T), rel: 0.02, unit: 'K' },
          { label: '(2)', q: R`気体のセ氏温度 $t$`, type: 'num', answer: p3(r.t), rel: 0.02, unit: '℃', tol: 0.6 },
          { label: '(3)', q: R`温度をそのままにして、圧力を ` + pT(P2) + R` に変えたときの体積`, type: 'num', answer: p3(r2c.VL), rel: 0.02, unit: 'L' }
        ],
        solution: seSteps(o, r).concat([
          {
            t: '(3) 温度が一定なので、ボイルの法則も使える',
            m: [R`P_{0}V_{0} = P_{2}V_{2} \;\Rightarrow\; V_{2} = V_{0}\times\frac{P_{0}}{P_{2}}`, R`V_{2} = ` + V.toFixed(1) + R` \times \frac{` + T(P0a) + '}{' + T(P2) + '} = ' + S3(r2c.VL) + R`\,\mathrm{L}`],
            n: R`温度 $T$ と物質量 $n$ が変わらないので、$PV = nRT$ の右辺は一定です。したがって $PV$ が一定で、圧力が何倍になったかを見れば体積は逆の倍率になります（状態方程式から求めた値 $` + S3(r2c.VL) + R`\,\mathrm{L}$ と一致）。`,
            easy: R`右辺 $nRT$ が変わらないので、$P$ を $2$ 倍にすれば $V$ は $\dfrac{1}{2}$ 倍、$P$ を $\dfrac{1}{2}$ 倍にすれば $V$ は $2$ 倍になります。`
          }
        ])
      };
    }
  });

  /* ================= 3. 気体分子運動論 ================= */

  function kinCalc(v) {
    const T_ = v.tu === 'K' ? v.Tk : v.Tc + 273;
    let name, Mg, atoms;
    if (v.gas === 'custom') { name = '気体'; Mg = v.M; atoms = v.atoms === '2' ? 2 : 1; }
    else { name = GASES[v.gas][0]; Mg = GASES[v.gas][1]; atoms = GASES[v.gas][2]; }
    const M = Mg / 1000;
    return {
      name: name, Mg: Mg, M: M, atoms: atoms, T: T_, t: T_ - 273, n: v.n,
      U: 1.5 * v.n * RG * T_, Ek: 1.5 * KB * T_, vrms: Math.sqrt(3 * RG * T_ / M)
    };
  }

  // マクスウェルの速さ分布: g(x) ∝ x^2 exp(-3x^2/2)（x = v / v_rms）
  const gMax = (function () { const xm = Math.sqrt(2 / 3); return xm * xm * Math.exp(-1.5 * xm * xm); })();
  const gDist = (x) => (x * x * Math.exp(-1.5 * x * x)) / gMax;
  const ARROWS = [[0.3, 0.25, 0.9, 40], [0.75, 0.2, 1.3, 200], [0.5, 0.55, 0.7, 110], [0.2, 0.7, 1.15, 320], [0.85, 0.65, 1.0, 270],
    [0.4, 0.85, 0.55, 20], [0.62, 0.4, 1.4, 150], [0.12, 0.4, 0.8, 80]];

  function kinFigure(r, opt) {
    opt = opt || {};
    const d = JK.plot.draw(360, 436);
    // 上: 容器の中の分子（矢印の長さが速さ）
    const bx = 20, by = 24, bw = 200, bh = 120;
    d.rect(bx, by, bw, bh, { cls: 'fg', fill: 'f0', rx: 4 });
    const base = Math.max(9, Math.min(24, 30 * r.vrms / 1400));
    ARROWS.forEach((a) => {
      const px = bx + 14 + a[0] * (bw - 28), py = by + 14 + a[1] * (bh - 28);
      const len = base * a[2], ang = a[3] * Math.PI / 180;
      d.dot(px, py, { cls: 'c1', r: 3.2 });
      d.arrow(px, py, px + len * Math.cos(ang), py - len * Math.sin(ang), { cls: 'c3', w: 1.6 });
    });
    d.text(bx + bw / 2, by - 8, '容器の中の分子（矢印の長さ = 速さ）', { size: 11 });
    d.text(bx + bw / 2, by + bh + 16, r.name + '  T = ' + tx(r.T) + ' K', { size: 12 });
    // 右: 結果
    d.text(236, 44, '分子 1 個の平均', { anchor: 'start', cls: 'dim' });
    d.text(236, 60, '運動エネルギー', { anchor: 'start', cls: 'dim' });
    d.text(236, 78, opt.ask ? '(3/2)kT = ?' : '(3/2)kT', { anchor: 'start' });
    if (!opt.ask) d.text(236, 94, '= ' + tx(r.Ek) + ' J', { anchor: 'start' });
    d.text(236, 118, '2乗平均速度', { anchor: 'start', cls: 'dim' });
    d.text(236, 134, 'v_rms = ' + (opt.ask ? '?' : tx(r.vrms) + ' m/s'), { anchor: 'start' });
    d.text(236, 156, 'M = ' + tx(r.Mg) + ' g/mol', { anchor: 'start', cls: 'dim' });
    // 下: 速さの分布
    const vmax = 3 * r.vrms;
    const g = {
      w: 360, h: 236, x: [0, vmax], y: [0, 1.25], axis: ['v', '分子の割合（相対）'],
      curves: [{ f: (v) => gDist(v / r.vrms), cls: 'c1' }],
      fills: [{ f: (v) => gDist(v / r.vrms), from: 0, to: vmax, cls: 'f1' }],
      vlines: [{ x: r.vrms, label: 'v_rms', cls: 'c3', dash: true }]
    };
    if (opt.ask) { g.ticks = false; g.grid = false; }
    d.text(180, 192, '分子の速さの分布（横軸: 速さ v [m/s]）', { size: 11, cls: 'dim' });
    d.group(nest(JK.plot.graph(g), 0, 198));
    return d.svg();
  }

  // opt.unit21: 演習で「10⁻²¹ J を単位として」答えさせるとき、その単位での値（答えと同じ数）を解説の最後に書く
  // opt.noU: 演習で物質量を与えていないとき、内部エネルギーのステップを省く
  function kinSteps(v, r, opt) {
    opt = opt || {};
    const labU = r.atoms === 1 ? '内部エネルギー $U$' : '分子の並進運動エネルギーの総和';
    const steps = [
      {
        t: '図で状況をつかむ',
        n: r.name + R`（モル質量 $M = ` + T(r.Mg) + R`\,\mathrm{g/mol}$）が温度 $T$ で容器に入っています。気体の分子は、容器の中を**ばらばらの速さ・向き**で飛び回っています。温度が高いほど分子は速く動き、**その平均のエネルギーは絶対温度に比例**します。`,
        easy: R`空気は、目に見えない小さな粒（分子）が、新幹線よりずっと速い（秒速数百メートル）スピードで飛び回っているものです。粒どうしや壁にぶつかっては向きを変えます。**温度とは、この粒の動きの激しさの目安**で、熱いほど粒は速く動きます。図の矢印が長いほど速い分子です。`
      },
      {
        t: R`絶対温度 $T$ を求める`,
        m: v.tu === 'K' ? [R`T = ` + T(r.T) + R`\,\mathrm{K}`] : [R`T = t + 273 = ` + T(v.Tc) + ' + 273 = ' + T(r.T) + R`\,\mathrm{K}`],
        n: R`気体の分子運動の式は、必ず**絶対温度**（$\mathrm{K}$）で計算します。`,
        easy: R`セ氏温度に $273$ を足すと絶対温度になります。たとえば室温の $27\degree\mathrm{C}$ は $300\,\mathrm{K}$ です。`
      },
      {
        t: '分子 1 個の平均運動エネルギー',
        m: [R`\overline{E} = \frac{1}{2}m\overline{v^{2}} = \frac{3}{2}kT`, R`\overline{E} = \frac{3}{2} \times 1.38 \times 10^{-23} \times ` + T(r.T) + ' = ' + S3(r.Ek) + R`\,\mathrm{J}`]
          .concat(opt.unit21 ? [R`10^{-21}\,\mathrm{J}\ \text{を単位として答えると}\quad \overline{E} = ` + S3(r.Ek / 1e-21)] : []),
        n: R`単原子分子理想気体の分子 $1$ 個あたりの運動エネルギーの平均は $\dfrac{3}{2}kT$ です（$k = 1.38 \times 10^{-23}\,\mathrm{J/K}$ は**ボルツマン定数**）。これは気体の種類によらず、**温度だけで決まります**。`,
        easy: R`同じ温度なら、重い分子も軽い分子も「平均の運動エネルギー」は同じです。重い分子はゆっくり、軽い分子は速く動いて、エネルギーの平均がそろう、というイメージです。$k$ は「分子 $1$ 個あたり」の定数、$R$ は「$1\,\mathrm{mol}$ あたり」の定数で、$R = N_{\mathrm{A}}k$ の関係があります。`,
        pro: R`$\dfrac{3}{2}kT$ の「$\dfrac{3}{2}$」は、運動の自由度 $3$（$x, y, z$ 方向）× $\dfrac{1}{2}kT$（エネルギー等分配則）から来ます。`
      },
      {
        t: R`` + (r.atoms === 1 ? '内部エネルギー $U$（分子の数 $\\times$ 平均エネルギー）' : '分子の並進運動エネルギーの総和'),
        m: [R`U = N \times \frac{3}{2}kT = \frac{3}{2}nRT \quad (N = nN_{\mathrm{A}},\ R = N_{\mathrm{A}}k)`, R`U = \frac{3}{2} \times ` + T(v.n) + R` \times 8.3 \times ` + T(r.T) + ' = ' + S3(r.U) + R`\,\mathrm{J}`],
        n: R`分子の総数 $N = nN_{\mathrm{A}}$（$N_{\mathrm{A}}$: アボガドロ定数）に平均エネルギーを掛けると、$n\,\mathrm{mol}$ の気体のエネルギーは $\dfrac{3}{2}nRT$ です。` +
          (r.atoms === 1 ? R`単原子分子の理想気体では、これが**内部エネルギー** $U$ です。` : R`ただし二原子分子（` + r.name + R`）の内部エネルギーは、回転の運動も加わって $\dfrac{5}{2}nRT$ です。ここで求めた $\dfrac{3}{2}nRT$ は並進運動の分だけです。`),
        easy: R`「分子 $1$ 個のエネルギー」に「分子の個数」を掛ければ、気体全体がもっているエネルギーになります。$1\,\mathrm{mol}$ は $6.02 \times 10^{23}$ 個の粒なので、$\dfrac{3}{2}kT$ を $n \times 6.02 \times 10^{23}$ 倍すると $\dfrac{3}{2}nRT$ になります。気体のもつこのエネルギーが**内部エネルギー**です。`
      },
      {
        t: R`2 乗平均速度 $v_{\mathrm{rms}}$（モル質量を kg/mol に直す）`,
        m: [R`M = ` + T(r.Mg) + R`\,\mathrm{g/mol} = ` + GS(r.M) + R`\,\mathrm{kg/mol}`,
          R`\frac{1}{2}mv_{\mathrm{rms}}^{2} = \frac{3}{2}kT \;\Rightarrow\; v_{\mathrm{rms}} = \sqrt{\frac{3kT}{m}} = \sqrt{\frac{3RT}{M}}`,
          R`v_{\mathrm{rms}} = \sqrt{\frac{3 \times 8.3 \times ` + T(r.T) + '}{' + GS(r.M) + '}} = ' + S3(r.vrms) + R`\,\mathrm{m/s}`],
        n: R`分子の速さには「ばらつき」があるので、**速さの 2 乗の平均**の平方根 $v_{\mathrm{rms}} = \sqrt{\overline{v^{2}}}$（2 乗平均速度）で代表させます。$\dfrac{1}{2}mv_{\mathrm{rms}}^{2} = \dfrac{3}{2}kT$ から求められ、分子 $1$ 個の質量 $m$ と $k$ は、$M = N_{\mathrm{A}}m$ と $R = N_{\mathrm{A}}k$ を使って $M$ と $R$ に置き換えられます（$M$ は **kg/mol**）。`,
        easy: R`分子の速さは 1 個ずつ違うので、ふつうの平均ではなく「速さを 2 乗して平均してから、平方根をとる」方法で代表の速さを決めます（エネルギーが速さの 2 乗に比例するため）。計算では、モル質量 $M$ を $\mathrm{g/mol}$ から $\mathrm{kg/mol}$ に直す（$1000$ で割る）のを忘れないようにしましょう。`,
        pro: R`$v_{\mathrm{rms}} \propto \sqrt{T/M}$。温度が $4$ 倍で速さ $2$ 倍、モル質量が $4$ 倍で速さ $\dfrac{1}{2}$ 倍。比で出す問題が多い。`
      },
      {
        t: '速さの目安と、分子の種類による違い',
        n: R`同じ温度では $v_{\mathrm{rms}} \propto \dfrac{1}{\sqrt{M}}$ なので、軽い分子ほど速く動きます。` + (r.Mg >= 4 ? R`たとえば同じ温度で、水素分子（$M = 2.0$）はこの気体の約 $` + U.fmt(Math.sqrt(r.Mg / 2.0), 2) + R`$ 倍の速さです。` : R`重い分子は、それより遅くなります。`) +
          R`常温の空気の分子の速さは音の速さ（約 $340\,\mathrm{m/s}$）と同程度で、音は分子の運動が伝わるものとも言えます。`,
        easy: R`同じ温度の気体では、軽い分子ほど速く、重い分子ほどゆっくり飛び回ります。風船のヘリウムが抜けやすいのは、軽くて速い分子が小さな穴から出ていくからです。`,
        lv: 2
      },
      {
        t: '補足: 分子の速さの分布（図の下のグラフ）',
        n: R`図の下のグラフは、分子の速さの分布（**マクスウェル分布**）の概形です。最も多くの分子の速さ（最頻値）は $v_{\mathrm{rms}}$ より少し小さく、速い分子も少数ながら存在します。高校物理では $v_{\mathrm{rms}}$ で代表させて計算します。`,
        easy: R`クラス全員の足の速さが同じではないように、分子の速さもばらばらです。いちばん多いのは「ほどほどの速さ」で、とても速い分子や遅い分子は少数です。それらをまとめて代表するのが $v_{\mathrm{rms}}$ です。`,
        lv: 3
      }
    ];
    // 演習で物質量 n を問題文に書いていないとき（内部エネルギーを問わないとき）は、n = 1 mol を仮定した内部エネルギーのステップを入れない
    if (opt.noU) steps.splice(3, 1);
    return steps;
  }

  JK.registerSim({
    id: 'thermo-kinetic',
    field: '熱力学',
    unit: 'p-gas',
    title: '気体分子運動論（内部エネルギーと分子の速さ）',
    desc: R`温度 $T$ とモル質量 $M$ から、分子 $1$ 個の平均運動エネルギー $\dfrac{3}{2}kT$、内部エネルギー $U = \dfrac{3}{2}nRT$、2 乗平均速度 $\sqrt{\dfrac{3RT}{M}}$ を求めます。`,
    form: [R`\overline{E} = \frac{3}{2}kT`, R`U = \frac{3}{2}nRT`, R`v_{\mathrm{rms}} = \sqrt{\frac{3RT}{M}}`],
    inputs: [
      { key: 'gas', label: '気体', type: 'select', def: 'N2', options: [['He', 'ヘリウム He（4.0）'], ['Ne', 'ネオン Ne（20）'], ['Ar', 'アルゴン Ar（40）'], ['H2', '水素 H₂（2.0）'], ['N2', '窒素 N₂（28）'], ['O2', '酸素 O₂（32）'], ['custom', '任意（モル質量を入力）']] },
      { key: 'M', label: R`モル質量 $M$`, unit: 'g/mol', type: 'num', def: '28', min: 0.5, max: 500, show: (raw) => raw.gas === 'custom' },
      { key: 'atoms', label: '分子の種類（任意の気体のとき）', type: 'select', def: '1', options: [['1', '単原子分子'], ['2', '二原子分子']], show: (raw) => raw.gas === 'custom' },
      { key: 'tu', label: '温度の入力方法', type: 'select', def: 'C', options: [['C', 'セ氏温度 t（℃）'], ['K', '絶対温度 T（K）']] },
      { key: 'Tc', label: R`セ氏温度 $t$`, unit: '℃', type: 'num', def: '27', min: -272, max: 5000, show: (raw) => raw.tu !== 'K' },
      { key: 'Tk', label: R`絶対温度 $T$`, unit: 'K', type: 'num', def: '300', min: 1, max: 6000, show: (raw) => raw.tu === 'K' },
      { key: 'n', label: R`物質量 $n$`, unit: 'mol', type: 'num', def: '1.0', min: 0.0001, max: 1e6 }
    ],
    examples: [
      { label: '27 ℃ の窒素 1 mol', v: { gas: 'N2', tu: 'C', Tc: '27', n: '1.0' } },
      { label: '300 K のヘリウム', v: { gas: 'He', tu: 'K', Tk: '300', n: '2.0' } },
      { label: '127 ℃ のアルゴン', v: { gas: 'Ar', tu: 'C', Tc: '127', n: '0.50' } }
    ],
    intro: {
      easy: R`気体は、目に見えない小さな**分子**が、ものすごい速さで飛び回っているものです。**温度が高いほど分子は速く動き**、分子 $1$ 個の運動エネルギーの平均は絶対温度に比例して $\dfrac{3}{2}kT$ になります。全部の分子のエネルギーを足したものが**内部エネルギー** $U = \dfrac{3}{2}nRT$、分子の「代表の速さ」が $v_{\mathrm{rms}} = \sqrt{\dfrac{3RT}{M}}$ です。`,
      normal: R`単原子分子理想気体: 平均運動エネルギー $\dfrac{3}{2}kT$、内部エネルギー $U = \dfrac{3}{2}nRT$、2 乗平均速度 $\sqrt{\dfrac{3RT}{M}}$（$M$ は kg/mol）。`,
      pro: R`$U$ は温度だけで決まる（体積によらない）。$v_{\mathrm{rms}} \propto \sqrt{T/M}$ の比例関係を使えば、ほとんどの問題が比の計算で終わる。`
    },
    compute(v) {
      const r = kinCalc(v);
      must(r.U, r.Ek, r.vrms, r.T);
      if (!(r.T > 0)) throw new JK.CalcError('絶対温度が 0 K 以下になります。入力を見直してください。');
      return {
        result: [
          { label: '分子 1 個の平均運動エネルギー (3/2)kT', tex: S3(r.Ek) + R`\,\mathrm{J}` },
          { label: r.atoms === 1 ? '内部エネルギー U = (3/2)nRT' : '並進運動エネルギーの総和 (3/2)nRT', tex: S3(r.U) + R`\,\mathrm{J}` },
          { label: '2 乗平均速度 v_rms', tex: S3(r.vrms) + R`\,\mathrm{m/s}` },
          { label: '絶対温度 T', tex: S3(r.T) + R`\,\mathrm{K}` }
        ],
        steps: kinSteps(v, r),
        fig: kinFigure(r)
      };
    },
    exercise(rng, level) {
      const gk = rng.pick(['He', 'Ne', 'Ar', 'N2', 'O2']);
      const g = GASES[gk];
      const t = rng.pick([27, 7, 127, 87, 0, 47]);
      const mk = (key, tC, n) => { const v = { gas: key, tu: 'C', Tc: tC, n: n }; return { v: v, r: kinCalc(v) }; };
      const kdata = R`ボルツマン定数 $k = 1.38 \times 10^{-23}\,\mathrm{J/K}$、気体定数 $R = 8.3\,\mathrm{J/(mol\cdot K)}$ とする。有効数字 3 桁で答えよ。`;
      if (level === 'basic') {
        const { v, r } = mk(gk, t, 1.0);
        return {
          title: '気体分子の平均運動エネルギーと速さ',
          body: g[0].replace(/ .*$/, '') + R`（モル質量 $` + g[1].toFixed(1) + R`\,\mathrm{g/mol}$）の気体が $` + t + R`\degree\mathrm{C}$ にある。` + kdata,
          fig: kinFigure(r, { ask: true }),
          parts: [
            { label: '(1)', q: R`気体の絶対温度 $T$`, type: 'num', answer: t + 273, rel: 0.02, unit: 'K' },
            { label: '(2)', q: R`分子 $1$ 個あたりの運動エネルギーの平均値（$10^{-21}\,\mathrm{J}$ を単位として）`, type: 'num', answer: p3(r.Ek / 1e-21), rel: 0.02, unit: '×10⁻²¹ J' },
            { label: '(3)', q: R`分子の 2 乗平均速度 $v_{\mathrm{rms}}$`, type: 'num', answer: p3(r.vrms), rel: 0.02, unit: 'm/s' }
          ],
          solution: kinSteps(v, r, { unit21: true, noU: true })
        };
      }
      if (level === 'mid') {
        const key = rng.pick(['He', 'Ne', 'Ar']);
        const n = rng.pick([0.50, 1.0, 2.0, 3.0]);
        const { v, r } = mk(key, t, n);
        const gg = GASES[key];
        // (3) の答え（絶対温度を 4 倍にしたときの内部エネルギー）を、解説にも同じ値で書く（2 乗平均速度の説明のあとに入れる）
        const sol = kinSteps(v, r);
        sol.splice(5, 0, {
          t: R`(3) 絶対温度を $4$ 倍にしたときの内部エネルギー`,
          m: [R`U = \frac{3}{2}nRT \propto T \;\Rightarrow\; U' = 4U`,
            R`U' = \frac{3}{2} \times ` + T(n) + R` \times 8.3 \times (4 \times ` + T(r.T) + ') = ' + S3(r.U * 4) + R`\,\mathrm{J}`],
          n: R`内部エネルギー $U = \dfrac{3}{2}nRT$ は絶対温度 $T$ に比例するので、$T$ が $4$ 倍になれば $U$ も $4$ 倍になります。$4U$ としても、$4$ 倍した温度を式に入れても同じ値です。`
        });
        return {
          title: '単原子分子理想気体の内部エネルギー',
          body: R`物質量 $` + n.toFixed(2) + R`\,\mathrm{mol}$ の` + gg[0].replace(/ .*$/, '') + R`（単原子分子、モル質量 $` + gg[1].toFixed(1) + R`\,\mathrm{g/mol}$）の理想気体が、温度 $` + t + R`\degree\mathrm{C}$ にある。` + kdata,
          fig: kinFigure(r, { ask: true }),
          parts: [
            { label: '(1)', q: R`気体の内部エネルギー $U$`, type: 'num', answer: p3(r.U), rel: 0.02, unit: 'J', show: S3(r.U) },
            { label: '(2)', q: R`分子の 2 乗平均速度 $v_{\mathrm{rms}}$`, type: 'num', answer: p3(r.vrms), rel: 0.02, unit: 'm/s' },
            { label: '(3)', q: R`温度を $4$ 倍の絶対温度にしたとき、内部エネルギーは何 $\mathrm{J}$ になるか`, type: 'num', answer: p3(r.U * 4), rel: 0.02, unit: 'J', show: S3(r.U * 4) }
          ],
          solution: sol
        };
      }
      // adv: 2 種類の気体の比較 / 速さから温度を逆算
      const pair = rng.pick([['He', 'N2'], ['He', 'Ar'], ['H2', 'O2'], ['Ne', 'Ar']]);
      const A = mk(pair[0], t, 1.0), B = mk(pair[1], t, 1.0);
      const vt = rng.pick([400, 500, 600, 700]);
      const key3 = rng.pick(['N2', 'O2', 'Ar']);
      const M3 = GASES[key3][1] / 1000;
      const T3 = M3 * vt * vt / (3 * RG);
      const C3 = mk(key3, t, 1.0);
      const solution = kinSteps(A.v, A.r, { noU: true }).slice(0, 5).concat([
        {
          t: R`(2) もう一方の気体の $v_{\mathrm{rms}}$ と、速さの比`,
          m: [R`v_{\mathrm{rms},\,B} = \sqrt{\frac{3 \times 8.3 \times ` + T(B.r.T) + '}{' + S3(B.r.M) + '}} = ' + S3(B.r.vrms) + R`\,\mathrm{m/s}`,
            R`\frac{v_{A}}{v_{B}} = \sqrt{\frac{M_{B}}{M_{A}}} = \sqrt{\frac{` + T(GASES[pair[1]][1]) + '}{' + T(GASES[pair[0]][1]) + '}} = ' + S3(A.r.vrms / B.r.vrms)],
          n: R`同じ温度では $v_{\mathrm{rms}} \propto \dfrac{1}{\sqrt{M}}$ なので、速さの比はモル質量の比の平方根の**逆数**になります。軽い方が速いことを確かめます。`,
          easy: R`同じ温度では、軽い分子ほど速く動きます。比の計算では、$R$、$T$ や「$3$」が共通なので打ち消し合い、モル質量だけが効きます。`
        },
        {
          t: R`(3) $v_{\mathrm{rms}} = ` + vt + R`\,\mathrm{m/s}$ になる温度`,
          m: [R`v_{\mathrm{rms}} = \sqrt{\frac{3RT}{M}} \;\Rightarrow\; T = \frac{Mv_{\mathrm{rms}}^{2}}{3R}`, R`T = \frac{` + S3(M3) + R` \times ` + vt + R`^{2}}{3 \times 8.3} = ` + S3(T3) + R`\,\mathrm{K}`],
          n: R`両辺を 2 乗して $T$ について解きます。モル質量は $\mathrm{kg/mol}$ に直して代入します。`,
          pro: R`逆算では 2 乗してから解く。$T \propto M v^{2}$ の形を使うと、他の条件との比較もすぐできる。`
        }
      ]);
      return {
        title: '2 種類の気体の分子の速さ',
        body: R`同じ温度 $` + t + R`\degree\mathrm{C}$ にある` + GASES[pair[0]][0].replace(/ .*$/, '') + R`（モル質量 $` + T(GASES[pair[0]][1]) + R`\,\mathrm{g/mol}$）と` + GASES[pair[1]][0].replace(/ .*$/, '') + R`（モル質量 $` + T(GASES[pair[1]][1]) + R`\,\mathrm{g/mol}$）の分子について考える。` + kdata,
        fig: kinFigure(A.r, { ask: true }),
        parts: [
          { label: '(1)', q: GASES[pair[0]][0].replace(/ .*$/, '') + R`の分子の 2 乗平均速度`, type: 'num', answer: p3(A.r.vrms), rel: 0.02, unit: 'm/s' },
          { label: '(2)', q: R`両者の 2 乗平均速度の比 $\dfrac{v_{\text{前者}}}{v_{\text{後者}}}$`, type: 'num', answer: p3(A.r.vrms / B.r.vrms), rel: 0.02 },
          { label: '(3)', q: GASES[key3][0].replace(/ .*$/, '') + R`（モル質量 $` + T(GASES[key3][1]) + R`\,\mathrm{g/mol}$）の 2 乗平均速度が $` + vt + R`\,\mathrm{m/s}$ になる絶対温度`, type: 'num', answer: p3(T3), rel: 0.02, unit: 'K' }
        ],
        solution: solution
      };
    }
  });
})();
