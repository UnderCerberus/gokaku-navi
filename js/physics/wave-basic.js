/* 物理・波動 — 波の性質（unit: p-wave）
   wave-fundamental: v = fλ と正弦波（t = 0 と時間 t 後の波形）
   wave-string: 弦の固有振動（両端固定・腹と節）
   wave-pipe: 気柱の共鳴（閉管・開管・開口端補正）
   wave-refraction: 屈折の法則・臨界角・全反射 */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const PI = Math.PI;
  const C = 3.00e8;                                   // 真空中の光速 [m/s]

  // 有効数字 3 桁の四捨五入（467.5 のようにちょうど半端な値は 468 に切り上げる）。
  // 答え（P3）と解説・図の表示（sig, pl）は必ずこの 1 つの丸めを通す。toPrecision や toFixed は 2 進数の誤差で
  // 半端な値を 2 通りに割ってしまい、答えと解説の数値が 1 ずれる
  function rd3(x) {
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return x;
    const a = Math.abs(Number(x.toPrecision(12)));
    const e = Math.floor(Math.log10(a)) - 2;
    const m = Math.round(Number((a / Math.pow(10, e)).toPrecision(12)));
    return (x < 0 ? -1 : 1) * Number(m + 'e' + e);
  }
  const sig = (x) => U.sig(rd3(x), 3);
  // 問題文に与えた値（入力値）の TeX 表示。10 桁までは正確に書く（小数 3 桁に丸めて、0.0025 を 0.003 と書いたりしない）。
  // 10^-3 未満・10^5 以上は 2.5 \times 10^{-4} の形。途中の値には使わない（SV と dig を使う）
  function nf(x) {
    if (typeof x !== 'number' || !isFinite(x)) return '0';
    const ax = Math.abs(x);
    if (ax === 0) return '0';
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = Number((x / Math.pow(10, e)).toPrecision(10));
      if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(10)); e += 1; }
      let ms = String(m);
      if (ms.indexOf('.') < 0) ms += '.0';
      return ms + R` \times 10^{` + e + '}';
    }
    return String(Number(x.toPrecision(10)));
  }
  const P3 = rd3;
  // 途中の値を d 桁（有効数字）で書く。3 桁は従来の sig と同じ。4 桁以上は普通の小数で書き、末尾の 0 は除く（1245、12450、622.5）。
  // 10^5 以上や 10^-3 未満は 1.5 \times 10^{5} の形
  function SD(x, d) {
    if (d <= 3 || typeof x !== 'number' || !isFinite(x)) return sig(x);
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
  // 結果 x の表示。3 桁に丸めると変わる値は、ちょうどの値を添える（562.5 \approx 563）
  const eqTail = (x) => (isExact(x) && !same(rd3(x), x) ? ' = ' + SD(x, 6) + R` \approx ` + sig(x) : ' = ' + sig(x));
  // 結果 x の表示。項 xs がどれもちょうど書ける値なら、ちょうどの値も添える。丸めた項を使うときは、表示した項の計算結果が
  // 3 桁で x と一致するので、3 桁の結果だけを書く
  const tailOf = (x, xs) => (xs.every(isExact) ? eqTail(x) : ' = ' + sig(x));
  // 与えられた値から求めた値（途中の値として次の式で使う）を、ちょうどの値で書く（3 桁で書ける値は従来の 3 桁の形）
  const GS = (x) => (same(rd3(x), x) ? sig(x) : nf(x));
  const rad = (deg) => deg * PI / 180;
  const MS = R`\,\mathrm{m/s}`, MM = R`\,\mathrm{m}`, SEC = R`\,\mathrm{s}`, HZ = R`\,\mathrm{Hz}`, NN = R`\,\mathrm{N}`;
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const nice = (x, d) => Math.abs(x * Math.pow(10, d) - Math.round(x * Math.pow(10, d))) < 1e-7;

  // 図の文字用: 有効数字 3 桁の平文
  function pl(x) {
    if (!isFinite(x)) return '';
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = rd3(x / Math.pow(10, e));
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return m + '×10' + String(e).replace(/-/g, '⁻').replace(/\d/g, (c) => SUP[c]);
    }
    return String(rd3(x));
  }

  /* =====================================================================
     v = fλ と正弦波
     ===================================================================== */
  function solveWave(given, v, f, lam, A, t) {
    const r = { given: given, A: A, t: t };
    if (given === 'fl') { r.f = f; r.lam = lam; r.v = f * lam; }
    else if (given === 'vf') { r.v = v; r.f = f; r.lam = v / f; }
    else { r.v = v; r.lam = lam; r.f = v / lam; }
    r.T = 1 / r.f;
    r.shift = r.v * t;
    r.vm = 2 * PI * r.f * A;                            // 媒質の振動の最大の速さ
    return r;
  }

  // 波形: t = 0（実線）と、時間 t 後（破線）。opts.problem: 求める量の数値を描かない
  function waveGraph(r, o) {
    o = o || {};
    const A = r.A, lam = r.lam, k = 2 * PI / lam;
    const f0 = (x) => A * Math.sin(k * x);
    const sh = o.shift != null ? o.shift : r.shift;
    const f1 = (x) => A * Math.sin(k * (x - sh));
    const g = {
      w: 340, h: 220, x: [0, 2.3 * lam], y: [-1.9 * A, 1.9 * A],
      axis: ['x [m]', 'y [m]'],
      curves: [{ f: f0, cls: 'c1' }],
      segs: [], hlines: [], labels: [], points: []
    };
    if (o.second) g.curves.push({ f: f1, cls: 'c2', dash: true });
    if (!o.problem) {
      g.hlines.push({ y: A, label: 'A = ' + pl(A) + ' m', dash: true }, { y: -A, label: '', dash: true });
      g.segs.push({ x1: lam / 4, y1: 1.45 * A, x2: 5 * lam / 4, y2: 1.45 * A, cls: 'c3', arrow: true, label: '' });
      g.segs.push({ x1: 5 * lam / 4, y1: 1.45 * A, x2: lam / 4, y2: 1.45 * A, cls: 'c3', arrow: true, label: '' });
      g.labels.push({ x: 3 * lam / 4, y: 1.62 * A, text: 'λ = ' + pl(lam) + ' m', anchor: 'middle', cls: 'c3' });
      if (o.second && sh > 1e-9 && sh <= 1.8 * lam) {
        g.segs.push({ x1: lam / 4, y1: -1.45 * A, x2: lam / 4 + sh, y2: -1.45 * A, cls: 'c4', arrow: true, label: '' });
        g.labels.push({ x: lam / 4 + sh / 2, y: -1.7 * A, text: 'vt = ' + pl(sh) + ' m', anchor: 'middle', cls: 'c4' });
      }
    }
    return JK.plot.graph(g);
  }

  function waveSteps(r) {
    const steps = [];
    steps.push({
      t: '波の要素を整理する',
      n: R`波を表す量は、**波長 $\lambda$**（山から次の山までの長さ）、**振幅 $A$**（山の高さ）、**周期 $T$**（媒質の 1 点が 1 回振動する時間）、**振動数 $f$**（1 秒あたりの振動の回数、$f = \frac{1}{T}$）、**波の速さ $v$** です。`,
      easy: R`ロープの端を持って上下に揺らすと、波がロープを伝わっていきます。波には、1 つの山の長さ（**波長** $\lambda$）、山の高さ（**振幅** $A$）、1 回揺らすのにかかる時間（**周期** $T$）、1 秒に何回揺らすか（**振動数** $f$）、波が進む速さ（**速さ** $v$）があります。振動数と周期は $f = \frac{1}{T}$ の関係で、たとえば 1 秒に 5 回揺らす（$f = 5\,\mathrm{Hz}$）なら、1 回あたり $0.2$ 秒（$T = 0.2\,\mathrm{s}$）です。`,
      pro: R`$f = \frac{1}{T}$。「媒質の振動（$f$, $T$, $A$）」と「波の進行（$v$, $\lambda$）」は別物として区別する。`
    });
    steps.push({
      t: R`波の基本式 $v = f\lambda$`,
      m: [R`v = \frac{\lambda}{T} = f\lambda`],
      n: R`媒質の 1 点が 1 回振動する（周期 $T$）あいだに、波は 1 波長 $\lambda$ だけ進みます。したがって速さは $v = \frac{\lambda}{T}$、$f = \frac{1}{T}$ を使うと $v = f\lambda$ です。`,
      easy: R`1 回揺らしている間（周期 $T$ のあいだ）に、波は山 1 つ分（波長 $\lambda$）だけ前へ進みます。ですから、「進んだ距離 ÷ かかった時間」で速さを求めると $v = \frac{\lambda}{T}$ になります。$\frac{1}{T}$ は振動数 $f$ なので、$v = f\lambda$ とも書けます。これは、1 秒間に $f$ 個の山が生まれて、それぞれ長さ $\lambda$ だけ進む、と考えても同じ式になります。`,
      pro: R`$v = f\lambda$ は波の最重要公式。$v$ は媒質（と条件）で決まり、$f$ は波源で決まるので、媒質が変わると $v$ と $\lambda$ だけが変わる。`
    });
    const calc = r.given === 'fl'
      ? [R`v = f\lambda = ` + nf(r.f) + R` \times ` + nf(r.lam) + eqTail(r.v) + MS]
      : (r.given === 'vf'
        ? [R`\lambda = \frac{v}{f} = \frac{` + nf(r.v) + '}{' + nf(r.f) + '}' + eqTail(r.lam) + MM]
        : [R`f = \frac{v}{\lambda} = \frac{` + nf(r.v) + '}{' + nf(r.lam) + '}' + eqTail(r.f) + HZ]);
    // 周期 T = 1/f。f が途中の値（v と λ から求めた）のときは、表示した f で計算し直して結果と合う桁数で書く
    const fT = r.given === 'vl' ? SV(r.f, dig([r.f], (f) => 1 / f)) : nf(r.f);
    steps.push({
      t: '与えられた量から、残りを求める',
      m: calc.concat([R`T = \frac{1}{f} = \frac{1}{` + fT + '}' + tailOf(r.T, [r.given === 'vl' ? r.f : 0]) + SEC]),
      n: R`$v = f\lambda$ を、求めたい量について解きます。周期は $T = \frac{1}{f}$ です。`,
      easy: R`$v = f\lambda$ の 3 つの量のうち 2 つが分かっていれば、残りの 1 つが決まります。式を、求めたい量が左辺に来るように変形して（$\lambda = v/f$ や $f = v/\lambda$）、数値を入れます。単位に注意して（$\mathrm{m/s} = \mathrm{Hz} \times \mathrm{m}$）、最後に周期 $T = 1/f$ も求めておきましょう。`
    });
    steps.push({
      t: '時間 $t$ のあとの波形',
      m: [R`y = A\sin\frac{2\pi}{\lambda}(x - vt) = A\sin 2\pi\left(\frac{x}{\lambda} - \frac{t}{T}\right)`,
        R`vt = ` + SV(r.v, dig([r.v], (v) => v * r.t)) + R` \times ` + nf(r.t) + ' = ' + sig(r.shift) + MM + R`\quad \left(= ` + nf(P3(r.shift / r.lam)) + R`\lambda\right)`],
      n: R`波は形を変えずに +$x$ 向きに進むので、時間 $t$ 後の波形は、$t = 0$ の波形を $x$ 軸方向に $vt$ だけ平行移動したものです（図の破線）。ずれが波長の整数倍なら、もとと同じ波形に重なります。`,
      easy: R`波が進むとは、「波の形がそのまま横にずれていく」ことです。$t$ 秒たてば、波は $vt$ だけ進むので、はじめの波形（実線）を右へ $vt$ だけずらしたものが、そのときの波形（破線）です。ずれの大きさがちょうど波長の整数倍なら、もとの波形に完全に重なります。`,
      lv: 2
    });
    steps.push({
      t: '媒質の振動と波の進行は別のもの',
      m: [R`v_{\text{媒質,max}} = 2\pi f A = 2\pi \times ` + (r.given === 'vl' ? SV(r.f, dig([r.f], (f) => 2 * PI * f * r.A)) : nf(r.f)) + R` \times ` + nf(r.A) + ' = ' + sig(r.vm) + MS],
      n: R`波が進む速さ $v$ と、媒質の 1 点が振動する速さは別です。媒質の各点は、その場で上下に単振動するだけで、波とともに運ばれていくわけではありません。媒質の振動の最大の速さは $2\pi fA$（単振動の最大の速さ $A\omega$）です。`,
      easy: R`ロープの波では、ロープ自体は上下に揺れているだけで、横へは移動しません。横へ進んでいるのは「山や谷の形」だけです。ロープの 1 点が上下に動く速さ（最大 $2\pi fA$）と、波の山が横に進む速さ $v$ は、まったく別の量です。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'wave-fundamental',
    field: '波動',
    unit: 'p-wave',
    title: '波の基本式 v = fλ と正弦波（波形の移動）',
    desc: R`波の速さ $v$・振動数 $f$・波長 $\lambda$ のうち 2 つから残りを求め、周期 $T$・波形が時間 $t$ のあいだに進む距離・媒質の最大の速さを計算します。$t = 0$ の波形と時間 $t$ 後の波形を図に重ねて描きます。`,
    form: [R`v = f\lambda = \frac{\lambda}{T}`, R`f = \frac{1}{T}`, R`y = A\sin\frac{2\pi}{\lambda}(x - vt)`],
    inputs: [
      { key: 'given', label: '与える量', type: 'select', def: 'fl', options: [['fl', '振動数 f と波長 λ（→ 速さ v）'], ['vf', '速さ v と振動数 f（→ 波長 λ）'], ['vl', '速さ v と波長 λ（→ 振動数 f）']] },
      { key: 'v', label: '波の速さ v', unit: 'm/s', type: 'num', def: '12', min: 0.001, max: 1e9, show: (raw) => raw.given !== 'fl' },
      { key: 'f', label: '振動数 f', unit: 'Hz', type: 'num', def: '4.0', min: 0.001, max: 1e9, show: (raw) => raw.given !== 'vl' },
      { key: 'lam', label: '波長 λ', unit: 'm', type: 'num', def: '3.0', min: 0.0001, max: 1e9, show: (raw) => raw.given !== 'vf' },
      { key: 'A', label: '振幅 A', unit: 'm', type: 'num', def: '0.20', min: 0.0001, max: 1000 },
      { key: 't', label: '経過時間 t', unit: 's', type: 'num', def: '0.10', min: 0, max: 100000, hint: '波形が t 秒後にどれだけ進むかを図に描きます' }
    ],
    examples: [
      { label: '振動数と波長から速さ', v: { given: 'fl', v: '12', f: '4.0', lam: '3.0', A: '0.20', t: '0.10' } },
      { label: '速さと振動数から波長', v: { given: 'vf', v: '340', f: '85', lam: '3.0', A: '0.10', t: '0.0050' } },
      { label: '速さと波長から振動数', v: { given: 'vl', v: '6.0', f: '4.0', lam: '2.0', A: '0.50', t: '0.25' } }
    ],
    intro: {
      easy: R`波には、1 つの山の長さ（**波長** $\lambda$）、1 秒に振動する回数（**振動数** $f$）、波が進む速さ（**速さ** $v$）があります。波の基本式は $v = f\lambda$ です。「1 秒間に $f$ 個の山が出て、それぞれ $\lambda$ の長さがある」と考えると、1 秒間に波が進む距離は $f \times \lambda$ になるからです。この式を使えば、3 つの量のうち 2 つが分かれば、残りの 1 つが求められます。波は形を変えずに進むので、時間 $t$ 後の波形は、はじめの波形を $vt$ だけ平行移動すれば描けます。`,
      normal: R`$v = f\lambda = \frac{\lambda}{T}$、$T = \frac{1}{f}$。時間 $t$ 後の波形は $y = A\sin\frac{2\pi}{\lambda}(x - vt)$（+$x$ 向きに進む波）。媒質の振動の最大の速さは $2\pi fA$。`,
      pro: R`波の速さは媒質で決まり、振動数は波源で決まる。波形グラフ（$y$–$x$）から $\lambda$、振動のグラフ（$y$–$t$）から $T$ が読める。区別を意識する。`
    },
    compute(v) {
      const r = solveWave(v.given, v.v, v.f, v.lam, v.A, v.t);
      return {
        result: [
          { label: '波の速さ v', tex: sig(r.v) + MS },
          { label: '振動数 f', tex: sig(r.f) + HZ },
          { label: '周期 T', tex: sig(r.T) + SEC },
          { label: '波長 λ', tex: sig(r.lam) + MM },
          { label: '時間 t に波形が進む距離 vt', tex: sig(r.shift) + MM },
          { label: '媒質の振動の最大の速さ 2πfA', tex: sig(r.vm) + MS }
        ],
        steps: waveSteps(r),
        fig: waveGraph(r, { second: true })
      };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      if (level === 'basic') {
        const f = rng.pick([2.0, 4.0, 5.0, 10.0, 20.0, 50.0, 100.0]);
        const lam = rng.pick([0.50, 1.0, 2.0, 3.0, 4.0]);
        const r = solveWave('fl', 0, f, lam, 0.1, 0);
        const d = JK.plot.draw(360, 120);
        d.line(24, 70, 336, 70, { cls: 'dim', dash: true, w: 1 });
        const pts = [];
        for (let i = 0; i <= 200; i++) pts.push([24 + 312 * i / 200, 70 - 30 * Math.sin(2 * PI * 2 * i / 200)]);
        d.poly(pts, { cls: 'c1', close: false, w: 2 });
        d.arrow(24 + 78, 24, 24 + 78 + 156, 24, { cls: 'c3', w: 1.6 });
        d.arrow(24 + 78 + 156, 24, 24 + 78, 24, { cls: 'c3', w: 1.6 });
        d.text(24 + 156, 18, 'λ = ' + pl(lam) + ' m', { cls: 'c3', size: 12 });
        d.arrow(300, 100, 346, 100, { cls: 'c4', label: 'v', w: 2 });
        d.text(100, 108, 'f = ' + pl(f) + ' Hz', { size: 12 });
        return {
          title: '波の速さと周期',
          body: R`ロープを伝わる正弦波があり、波長は $` + lam.toFixed(2) + R`\,\mathrm{m}$、振動数は $` + f.toFixed(1) + R`\,\mathrm{Hz}$ である。次の問いに答えよ。`,
          fig: d.svg(),
          parts: [
            { label: '(1)', q: R`波の速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
            { label: '(2)', q: R`ロープの 1 点が 1 回振動するのにかかる時間（周期）$T$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 's' }
          ],
          solution: waveSteps(solveWave('fl', 0, f, lam, 0.1, 0.1)).slice(0, 3)
        };
      }
      if (level === 'mid') {
        const lam = rng.pick([2.0, 4.0, 6.0, 8.0]);
        const A = rng.pick([0.10, 0.20, 0.50]);
        const v = rng.pick([2.0, 3.0, 4.0, 6.0, 8.0, 12.0]);
        const r = solveWave('vl', v, 0, lam, A, 0);
        const sol = waveSteps(solveWave('vl', v, 0, lam, A, 0.1)).slice(0, 3);
        // (1) の波長は図から読み取る値なので、読み取るステップを、基本式を使うステップの前に入れる
        sol.splice(2, 0, {
          t: R`(1) 図から波長 $\lambda$ を読み取る`,
          m: [R`\lambda = ` + nf(lam) + MM],
          n: R`波形の山から次の山まで（谷から次の谷までも同じ）の長さが 1 波長です。図の横軸の目盛りを読むと、隣り合う山の間隔は $` + nf(lam) + R`\,\mathrm{m}$ なので、$\lambda = ` + nf(lam) + R`\,\mathrm{m}$ です。この値と、問題文の速さ $v = ` + nf(v) + R`\,\mathrm{m/s}$ から、振動数 $f$ と周期 $T$ を求めます。`,
          easy: R`波の形を見ると、同じ形がくり返されています。くり返しの 1 回ぶんの長さ（山から次の山まで）が波長 $\lambda$ です。図の横軸の数字（目盛り）を見て、山と山の間がどれだけあるかを読み取ります。`
        });
        return {
          title: '波形のグラフから波長と振動数を求める',
          body: R`+$x$ 向きに速さ $` + v.toFixed(1) + R`\,\mathrm{m/s}$ で進む正弦波がある。図は、ある時刻の波形（変位 $y$ と位置 $x$ の関係）を表している。図から読み取って、次の問いに答えよ。`,
          fig: waveGraph(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`この波の波長 $\lambda$`, type: 'num', answer: P3(lam), rel: tol.rel, unit: 'm' },
            { label: '(2)', q: R`この波の振動数 $f$`, type: 'num', answer: P3(r.f), rel: tol.rel, unit: 'Hz' },
            { label: '(3)', q: R`この波の周期 $T$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 's' }
          ],
          solution: sol
        };
      }
      // adv: 2 つの波形（t = 0 と Δt 後）から速さの最小値・媒質の最大の速さ
      const lam = rng.pick([2.0, 4.0, 6.0, 8.0]);
      const A = rng.pick([0.10, 0.20, 0.50]);
      const dt = rng.pick([0.25, 0.50, 1.0]);
      const sh = lam / 4;
      const vmin = sh / dt;
      const r = solveWave('vl', vmin, 0, lam, A, dt);
      const vm = 2 * 3.14 * r.f * A;
      const sol = [
        waveSteps(r)[0],
        {
          t: R`(1) 図から波長 $\lambda$・山の移動距離 $d$・振幅 $A$ を読み取る`,
          m: [R`\lambda = ` + nf(lam) + MM, R`d = ` + nf(sh) + MM, R`A = ` + nf(A) + MM],
          n: R`図の横軸の目盛りから、実線の隣り合う山の間隔（1 波長）は $\lambda = ` + nf(lam) + R`\,\mathrm{m}$ と読み取れます。実線の山から、それに最も近い破線の山までの距離が、山の移動距離 $d = ` + nf(sh) + R`\,\mathrm{m}$ です（$\lambda$ の $\dfrac{1}{4}$）。縦軸の目盛りから、山の高さ（振幅）は $A = ` + nf(A) + R`\,\mathrm{m}$ です。`,
          easy: R`グラフに書かれた数字（目盛り）を使って、波の大きさを測ります。山から次の山までの長さが波長 $\lambda$、山の高さが振幅 $A$ です。実線の山が、破線では右へどれだけずれているかが、山の移動距離 $d$ です。`
        },
        {
          t: R`(2) 波の進んだ距離から速さの最小値を求める`,
          m: [R`v = \frac{\text{進んだ距離}}{\text{時間}} = \frac{d + n\lambda}{\Delta t}\quad (n = 0, 1, 2, \cdots)`,
            R`v_{\min} = \frac{d}{\Delta t} = \frac{` + nf(sh) + '}{' + nf(dt) + '} = ' + sig(vmin) + MS],
          n: R`実線（$t = 0$）の山が、破線（$\Delta t$ 後）の山の位置まで進んだとします。図の山の移動距離は $d = ` + nf(sh) + R`\,\mathrm{m}$ ですが、波は同じ形がくり返されるので、実際には $d + n\lambda$（$n = 0, 1, 2, \cdots$）だけ進んでいる可能性もあります。速さの**最小値**は、$n = 0$ の場合です。`,
          easy: R`波は同じ形がくり返しているので、実線と破線の見た目が同じでも、実は「$\lambda$ の整数倍分だけ余計に進んでいた」かもしれません。ですから速さは 1 通りに決まらず、$\frac{d + n\lambda}{\Delta t}$（$n = 0, 1, 2, \cdots$）のいずれかになります。もっともゆっくり進んだ場合（$n = 0$）の速さが、最小値です。`
        },
        {
          t: R`(3) 振動数と、媒質の振動の最大の速さ`,
          m: [R`f = \frac{v_{\min}}{\lambda} = \frac{` + sig(vmin) + '}{' + nf(lam) + '} = ' + sig(r.f) + HZ,
            R`v_{\text{媒質,max}} = 2\pi fA = 2 \times 3.14 \times ` + sig(r.f) + R` \times ` + nf(A) + ' = ' + sig(vm) + MS],
          n: R`$v = f\lambda$ から振動数を出します。媒質の各点は単振動するので、最大の速さは $A\omega = 2\pi fA$ です（波の速さ $v$ とは別の量です）。`,
          easy: R`振動数は $f = v/\lambda$ で出します。次に、ロープの 1 点が上下に動く速さの最大値は、単振動の最大の速さ $A\omega$（$\omega = 2\pi f$）です。図から振幅 $A$ を読み取って計算します。`
        }
      ];
      return {
        title: '2 つの波形から波の速さを考える',
        body: R`+$x$ 向きに進む正弦波がある。図の実線は時刻 $t = 0$ の波形、破線は $\Delta t = ` + dt.toFixed(2) + R`\,\mathrm{s}$ 後の波形を表す。波の速さは分からないが、この間に波が進んだ距離は、図で山が移動した距離に、波長の整数倍を加えたものである可能性がある。円周率を $\pi = 3.14$ として、図から読み取って次の問いに答えよ。`,
        fig: waveGraph(r, { second: true, problem: true, shift: sh }),
        parts: [
          { label: '(1)', q: R`この波の波長 $\lambda$`, type: 'num', answer: P3(lam), rel: tol.rel, unit: 'm' },
          { label: '(2)', q: R`波の速さとして考えられる最小の値 $v_{\min}$`, type: 'num', answer: P3(vmin), rel: tol.rel, unit: 'm/s' },
          { label: '(3)', q: R`$v = v_{\min}$ のとき、媒質の各点が振動する最大の速さ`, type: 'num', answer: P3(vm), rel: tol.rel, unit: 'm/s' }
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     弦の固有振動
     ===================================================================== */
  function solveString(src, L, S, rhoG, vIn, n) {
    const r = { src: src, L: L, n: n };
    if (src === 'tension') { r.S = S; r.rhoG = rhoG; r.rho = rhoG / 1000; r.v = Math.sqrt(S / r.rho); }
    else { r.v = vIn; }
    r.f1 = r.v / (2 * L);
    r.lam = 2 * L / n;
    r.fn = n * r.f1;
    return r;
  }

  function figString(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, 236);
    const x0 = 40, x1 = 320, y0 = 90, amp = 46, n = r.n, Lp = x1 - x0;
    d.line(x0, y0 - 34, x0, y0 + 34, { cls: 'fg', w: 3 });
    d.line(x1, y0 - 34, x1, y0 + 34, { cls: 'fg', w: 3 });
    d.line(x0, y0, x1, y0, { cls: 'dim', w: 1 });
    const up = [], dn = [];
    for (let i = 0; i <= 240; i++) {
      const u = i / 240, y = amp * Math.sin(n * PI * u);
      up.push([x0 + Lp * u, y0 - y]); dn.push([x0 + Lp * u, y0 + y]);
    }
    d.poly(up, { cls: 'c1', close: false, w: 2.2 });
    d.poly(dn, { cls: 'c1', close: false, dash: true, w: 1.4 });
    for (let k = 0; k <= n; k++) d.dot(x0 + Lp * k / n, y0, { cls: 'c3', r: 4 });
    if (n <= 6) {
      for (let k = 0; k < n; k++) d.text(x0 + Lp * (k + 0.5) / n, y0 - amp - 8, '腹', { cls: 'c2', size: 11 });
      for (let k = 0; k <= n; k++) d.text(x0 + Lp * k / n, y0 + 20, '節', { cls: 'c3', size: 11 });
    }
    d.arrow(x0, y0 + 62, x0 + Lp / n, y0 + 62, { cls: 'c4', w: 1.5 });
    d.arrow(x0 + Lp / n, y0 + 62, x0, y0 + 62, { cls: 'c4', w: 1.5 });
    d.text(x0 + Lp / (2 * n), y0 + 80, 'λ/2', { cls: 'c4', size: 12, italic: true });
    d.arrow(x0, y0 + 98, x1, y0 + 98, { cls: 'dim', w: 1.3 });
    d.arrow(x1, y0 + 98, x0, y0 + 98, { cls: 'dim', w: 1.3 });
    d.text((x0 + x1) / 2, y0 + 116, 'L = ' + pl(r.L) + ' m', { size: 12 });
    d.text(180, 18, n === 1 ? '基本振動（腹 1 個・節 2 個）' : n + ' 倍振動（腹 ' + n + ' 個・節 ' + (n + 1) + ' 個）', { cls: 'dim', size: 12 });
    if (!prob) d.text(180, 224, 'v = ' + pl(r.v) + ' m/s　λ = 2L/n = ' + pl(r.lam) + ' m　f = ' + pl(r.fn) + ' Hz', { size: 12 });
    return d.svg();
  }

  function stringSteps(r) {
    const n = r.n;
    const steps = [];
    steps.push({
      t: '弦の振動と定常波',
      n: R`両端を固定した弦をはじくと、弦を伝わる波が両端で反射し、行き来する 2 つの波が重なって、**定常波**（その場で振動するだけで進まない波）ができます。固定端は動けないので**節**になり、節と節の間の最も大きく振動する場所が**腹**です。`,
      easy: R`ギターの弦のように、両端を固定した弦をはじくと、弦は「腹」のところで大きく、「節」のところでは全く振動しない、という振動をします。端は固定されているので、必ず節です。このように、進行せずにその場で振動するだけの波を**定常波**といいます。弦の長さに合う波長の波だけが、強く振動できます。`,
      pro: R`両端固定 → 両端が節。腹の数 $= n$、節の数 $= n + 1$（端を含む）。`
    });
    if (r.src === 'tension') {
      steps.push({
        t: '弦を伝わる波の速さ',
        m: [R`v = \sqrt{\frac{S}{\rho}}`,
          R`\rho = ` + nf(r.rhoG) + R`\,\mathrm{g/m} = ` + nf(r.rho) + R`\,\mathrm{kg/m}`,
          R`v = \sqrt{\frac{` + nf(r.S) + '}{' + nf(r.rho) + '}}' + eqTail(r.v) + MS],
        n: R`弦を伝わる横波の速さは、張力 $S$ が大きいほど速く、線密度 $\rho$（単位長さあたりの質量）が大きいほど遅くなり、$v = \sqrt{\frac{S}{\rho}}$ です。線密度は $\rho = ` + nf(r.rho) + R`\,\mathrm{kg/m}$（単位を g/m から kg/m に直しました）。`,
        easy: R`弦をピンと強く張る（張力 $S$ が大きい）ほど、波は速く伝わります。また、弦が軽い（線密度 $\rho$ が小さい）ほど、波は速く伝わります。この関係を表す式が $v = \sqrt{S/\rho}$ です。$\rho$ は「1 m あたりの質量」なので、g/m で与えられたときは、kg/m に直してから代入しましょう（1 g = 0.001 kg）。`,
        pro: R`$v \propto \sqrt{S}$、$v \propto \frac{1}{\sqrt{\rho}}$。張力 4 倍で速さ 2 倍。単位は kg/m に直す。`
      });
    }
    steps.push({
      t: '定常波の条件（波長）',
      m: [R`L = n \times \frac{\lambda_{n}}{2} \;\Rightarrow\; \lambda_{n} = \frac{2L}{n}`,
        R`\lambda_{` + n + R`} = \frac{2 \times ` + nf(r.L) + '}{' + n + '}' + eqTail(r.lam) + MM],
      n: R`両端が節になるには、弦の長さ $L$ の中に、**半波長 $\frac{\lambda}{2}$ がちょうど整数個**入る必要があります。$n = 1$ が基本振動（腹 1 個）、$n = 2, 3, \cdots$ が 2 倍振動、3 倍振動、$\cdots$ です。腹の数が $n$ 個です。`,
      easy: R`節から次の節までの長さが、半波長（$\frac{\lambda}{2}$）です。両端が節なので、弦の長さ $L$ は、半波長の整数倍でなければなりません。1 個分なら $L = \frac{\lambda}{2}$（基本振動、腹が 1 つ）、2 個分なら $L = \lambda$（2 倍振動、腹が 2 つ）、$\cdots$ と続きます。式にすると $L = n \times \frac{\lambda}{2}$、つまり $\lambda = \frac{2L}{n}$ です。`
    });
    // v は、張力と線密度から求めたとき途中の値。f₁ も途中の値（n 倍するので、合う桁数で書く）
    const vS = r.src === 'tension' ? SV(r.v, dig([r.v], (v) => v / (2 * r.L))) : nf(r.v);
    const f1S = SV(r.f1, dig([r.f1], (f) => n * f));
    steps.push({
      t: '振動数',
      m: [R`f_{n} = \frac{v}{\lambda_{n}} = \frac{nv}{2L} = nf_{1}`,
        R`f_{1} = \frac{v}{2L} = \frac{` + vS + '}{2 \\times ' + nf(r.L) + '}' + tailOf(r.f1, [r.src === 'tension' ? r.v : 0]) + HZ + (n > 1 ? R`,\qquad f_{` + n + R`} = ` + n + R` \times ` + f1S + tailOf(r.fn, [r.f1]) + HZ : '')],
      n: R`波の基本式 $v = f\lambda$ から $f_{n} = \frac{v}{\lambda_{n}} = \frac{nv}{2L}$ です。$n$ 倍振動の振動数は、基本振動数 $f_{1}$ の $n$ 倍になります。`,
      easy: R`波の基本式 $v = f\lambda$ を使います。波の速さ $v$ は弦で決まっていて、波長 $\lambda_{n} = 2L/n$ なので、振動数は $f = v/\lambda_{n}$ です。基本振動数 $f_{1} = v/(2L)$ のちょうど $n$ 倍が、$n$ 倍振動の振動数です。弦が短いほど、また速さが大きいほど、高い音になります。`,
      pro: R`$f_{n} = n\frac{v}{2L}$、$v = \sqrt{S/\rho}$ より $f \propto \frac{1}{L}\sqrt{S}$。弦楽器は、指で押さえて $L$ を変え、ペグで $S$ を変えて音を調節する。`
    });
    steps.push({
      t: '節と腹の位置',
      m: [R`x_{\text{節}} = \frac{kL}{n}\ \ (k = 0, 1, \cdots, n),\qquad x_{\text{腹}} = \frac{(2k+1)L}{2n}\ \ (k = 0, 1, \cdots, n-1)`],
      n: R`左端からの距離で、節は $\frac{L}{n}$ ごとに（$\frac{\lambda}{2}$ の間隔で）並び、腹はその中間にあります。図の黄色い点が節、「腹」と書いた位置が腹です。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'wave-string',
    field: '波動',
    unit: 'p-wave',
    title: '弦の固有振動（腹と節・基本振動数）',
    desc: R`両端を固定した弦の定常波（固有振動）です。弦の長さ $L$ と波の速さ $v$（または張力 $S$・線密度 $\rho$）から、$n$ 倍振動の波長・振動数を求め、腹と節の位置を図に描きます。`,
    form: [R`v = \sqrt{\frac{S}{\rho}}`, R`\lambda_{n} = \frac{2L}{n}`, R`f_{n} = \frac{v}{\lambda_{n}} = \frac{nv}{2L} = nf_{1}`],
    inputs: [
      { key: 'src', label: '波の速さの与え方', type: 'select', def: 'tension', options: [['tension', '張力 S と線密度 ρ から求める'], ['direct', '速さ v を直接与える']] },
      { key: 'L', label: '弦の長さ L', unit: 'm', type: 'num', def: '0.60', min: 0.001, max: 1000 },
      { key: 'S', label: '張力 S', unit: 'N', type: 'num', def: '40', min: 0.001, max: 1000000, show: (raw) => raw.src !== 'direct' },
      { key: 'rho', label: '線密度 ρ', unit: 'g/m', type: 'num', def: '4.0', min: 0.0001, max: 1000000, hint: '1 m あたりの質量（g/m）', show: (raw) => raw.src !== 'direct' },
      { key: 'v', label: '波の速さ v', unit: 'm/s', type: 'num', def: '100', min: 0.001, max: 1000000, show: (raw) => raw.src === 'direct' },
      { key: 'n', label: '何倍振動か n', type: 'int', def: '3', min: 1, max: 12, hint: 'n = 1 が基本振動' }
    ],
    examples: [
      { label: '張力と線密度から（3 倍振動）', v: { src: 'tension', L: '0.60', S: '40', rho: '4.0', v: '100', n: '3' } },
      { label: '速さを直接与える（基本振動）', v: { src: 'direct', L: '0.50', S: '40', rho: '4.0', v: '200', n: '1' } },
      { label: '5 倍振動', v: { src: 'tension', L: '1.0', S: '100', rho: '2.5', v: '100', n: '5' } }
    ],
    intro: {
      easy: R`ギターの弦を指ではじくと、弦は決まった高さの音を出します。両端が固定されているので、両端は必ず**節**（まったく振動しない点）になります。そのため、弦の長さにちょうど合った波長の波だけが、**定常波**として強く振動できます。もっとも波長が長い（腹が 1 つの）振動を**基本振動**、腹が 2 つ、3 つ、$\cdots$ の振動を 2 倍振動、3 倍振動、$\cdots$ といいます。条件は「弦の長さ $L$ が、半波長 $\frac{\lambda}{2}$ の整数倍」です。`,
      normal: R`$L = n\frac{\lambda_{n}}{2}$ より $\lambda_{n} = \frac{2L}{n}$、$f_{n} = \frac{v}{\lambda_{n}} = \frac{nv}{2L}$。$v = \sqrt{S/\rho}$。腹は $n$ 個、節は $n+1$ 個。`,
      pro: R`$f_{1} = \frac{1}{2L}\sqrt{\frac{S}{\rho}}$。長さ $\frac{1}{2}$ で振動数 2 倍、張力 4 倍で 2 倍、線密度 4 倍で $\frac{1}{2}$ 倍。固有振動数は基本振動数の整数倍（倍振動）。`
    },
    compute(v) {
      const r = solveString(v.src, v.L, v.S, v.rho, v.v, v.n);
      const res = [
        { label: '弦を伝わる波の速さ v', tex: sig(r.v) + MS },
        { label: '基本振動数 f₁', tex: sig(r.f1) + HZ },
        { label: v.n + ' 倍振動の波長 λ', tex: sig(r.lam) + MM },
        { label: v.n + ' 倍振動の振動数 f', tex: sig(r.fn) + HZ },
        { label: '腹の数 / 節の数（両端を含む）', tex: v.n + R`\ /\ ` + (v.n + 1) }
      ];
      return { result: res, steps: stringSteps(r), fig: figString(r) };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      if (level === 'basic') {
        let L, v;
        for (let i = 0; i < 200; i++) {
          L = rng.pick([0.50, 0.60, 0.80, 1.0, 1.2]);
          v = rng.pick([100, 120, 150, 200, 240, 300, 360, 400, 480]);
          if (nice(v / (2 * L), 1)) break;
        }
        const r = solveString('direct', L, 0, 0, v, 1);
        const r3 = solveString('direct', L, 0, 0, v, 3);
        // 設問の順（(1) 基本振動の波長 → (2) 基本振動数 → (3) 3 倍振動の振動数）に合わせて、基本振動（n = 1）で波長と振動数を求め、
        // 3 倍振動の振動数は、基本振動数の 3 倍として、そのあとに入れる
        const sol = stringSteps(r);
        const f1S = SV(r.f1, dig([r.f1], (f) => 3 * f));
        sol.splice(3, 0, {
          t: R`(3) 3 倍振動の振動数 $f_{3}$`,
          m: [R`f_{3} = 3f_{1} = 3 \times ` + f1S + tailOf(r3.fn, [r.f1]) + HZ],
          n: R`$n$ 倍振動の振動数は、基本振動数 $f_{1}$ の $n$ 倍です。3 倍振動（腹が 3 個）の振動数は $f_{3} = 3f_{1}$ です。`,
          easy: R`基本振動の 3 倍の振動数で振動するのが 3 倍振動です。弦に腹が 3 個できます。基本振動数 $f_{1}$ が分かっていれば、3 倍するだけで求まります。`
        });
        return {
          title: '弦の基本振動と 3 倍振動',
          body: R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の弦の両端を固定して弾いたところ、弦を伝わる波の速さは $` + v.toFixed(0) + R`\,\mathrm{m/s}$ であった。次の問いに答えよ。`,
          fig: figString({ L: L, n: 1, v: v, lam: 2 * L, fn: r.f1 }, { problem: true }),
          parts: [
            { label: '(1)', q: R`基本振動の波長 $\lambda_{1}$`, type: 'num', answer: P3(2 * L), rel: tol.rel, unit: 'm' },
            { label: '(2)', q: R`基本振動の振動数 $f_{1}$`, type: 'num', answer: P3(r.f1), rel: tol.rel, unit: 'Hz' },
            { label: '(3)', q: R`3 倍振動の振動数 $f_{3}$`, type: 'num', answer: P3(r3.fn), rel: tol.rel, unit: 'Hz' }
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        const pr = rng.pick([[4.0, 100], [5.0, 80], [2.5, 200], [4.0, 150], [10.0, 50], [2.5, 120]]);
        const rhoG = pr[0], v = pr[1];
        const S = rhoG / 1000 * v * v;
        const L = rng.pick([0.50, 0.60, 0.80, 1.0]);
        const r = solveString('tension', L, S, rhoG, 0, 2);
        return {
          title: '張力と線密度から求める弦の振動',
          body: R`線密度 $` + rhoG.toFixed(1) + R`\,\mathrm{g/m}$ の弦を、張力 $` + S.toFixed(1) + R`\,\mathrm{N}$ で張り、両端を固定した。弦の長さは $` + L.toFixed(2) + R`\,\mathrm{m}$ である。次の問いに答えよ。`,
          fig: figString(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`弦を伝わる波の速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
            { label: '(2)', q: R`基本振動の振動数 $f_{1}$`, type: 'num', answer: P3(r.f1), rel: tol.rel, unit: 'Hz' },
            { label: '(3)', q: R`2 倍振動の振動数 $f_{2}$`, type: 'num', answer: P3(r.fn), rel: tol.rel, unit: 'Hz' }
          ],
          solution: stringSteps(r)
        };
      }
      // adv: 弦の振動する部分の長さを変えて目的の基本振動数にする
      const pr = rng.pick([[4.0, 100], [5.0, 80], [2.5, 200], [4.0, 150], [10.0, 50]]);
      const rhoG = pr[0], v = pr[1];
      const S = rhoG / 1000 * v * v;
      const L = rng.pick([0.50, 0.60, 0.80, 1.0]);
      const Lp = rng.pick([0.20, 0.25, 0.30, 0.40]);
      const fp = v / (2 * Lp);
      const r = solveString('tension', L, S, rhoG, 0, 3);
      const sol = stringSteps(r).slice(0, 5).concat([{
        t: R`(3) 振動する部分の長さを変える`,
        m: [R`f_{1}' = \frac{v}{2L'} \;\Rightarrow\; L' = \frac{v}{2f_{1}'}`,
          R`L' = \frac{` + nf(v) + '}{2 \\times ' + nf(fp) + '}' + eqTail(Lp) + MM],
        n: R`弦の張力と線密度を変えなければ、波の速さ $v$ は同じです。弦の一部を指で押さえると、振動する部分の長さ $L'$ が短くなり、基本振動数が $f_{1}' = \frac{v}{2L'}$ に高くなります。これを $L'$ について解きます。`,
        easy: R`ギターは、弦を指で押さえて、振動する部分の長さを短くすると、高い音が出ます。弦の張力や太さは変わらないので、波の速さ $v$ はそのままです。基本振動数の式 $f_{1}' = \frac{v}{2L'}$ を、$L'$ について解けば、欲しい音に必要な長さが分かります。`,
        lv: 1
      }]);
      return {
        title: '弦の長さを変えて音の高さを変える',
        body: R`線密度 $` + rhoG.toFixed(1) + R`\,\mathrm{g/m}$ の弦を、張力 $` + S.toFixed(1) + R`\,\mathrm{N}$ で張り、両端を固定した。弦の長さは $` + L.toFixed(2) + R`\,\mathrm{m}$ である。次に、張力を変えずに弦の端の一部を指で押さえて、振動する部分の長さを短くし、基本振動数を $` + fp.toFixed(1) + R`\,\mathrm{Hz}$ にした。次の問いに答えよ。`,
        fig: figString(r, { problem: true }),
        parts: [
          { label: '(1)', q: R`弦を伝わる波の速さ $v$`, type: 'num', answer: P3(v), rel: tol.rel, unit: 'm/s' },
          { label: '(2)', q: R`はじめの弦（長さ $` + L.toFixed(2) + R`\,\mathrm{m}$）の 3 倍振動の振動数 $f_{3}$`, type: 'num', answer: P3(r.fn), rel: tol.rel, unit: 'Hz' },
          { label: '(3)', q: R`指で押さえたときに振動する部分の長さ $L'$`, type: 'num', answer: P3(Lp), rel: tol.rel, unit: 'm' }
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     気柱の共鳴
     ===================================================================== */
  // Vfix: 音速が問題で直接与えられるとき（演習用）
  function solvePipe(kind, L, tC, n, delta, Vfix) {
    const r = { kind: kind, L: L, tC: tC, n: n, delta: delta, Vfix: Vfix };
    r.V = Vfix != null ? Vfix : 331.5 + 0.6 * tC;
    r.closed = kind === 'closed';
    r.Leff = L + (r.closed ? 1 : 2) * delta;
    r.lamOf = (m) => (r.closed ? 4 * r.Leff / (2 * m - 1) : 2 * r.Leff / m);
    r.fOf = (m) => r.V / r.lamOf(m);
    r.lam = r.lamOf(n); r.f = r.fOf(n); r.f1 = r.fOf(1);
    return r;
  }

  function figPipe(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, 222);
    const y0 = 86, hh = 30, amp = 22;
    const s = 262 / r.Leff, dpx = r.delta * s;
    let xt0, xt1, xw0;
    if (r.closed) { xt0 = 48; xt1 = xt0 + r.L * s; xw0 = xt0; }
    else { xw0 = 48; xt0 = xw0 + dpx; xt1 = xt0 + r.L * s; }
    const xw1 = xw0 + r.Leff * s, Wd = xw1 - xw0;
    d.line(xt0, y0 - hh, xt1, y0 - hh, { cls: 'fg', w: 2 });
    d.line(xt0, y0 + hh, xt1, y0 + hh, { cls: 'fg', w: 2 });
    if (r.closed) { d.line(xt0, y0 - hh, xt0, y0 + hh, { cls: 'fg', w: 4 }); }
    d.line(xw0, y0, xw1, y0, { cls: 'dim', w: 1 });
    const n = r.n, up = [], dn = [];
    for (let i = 0; i <= 260; i++) {
      const u = i / 260;
      const y = r.closed ? amp * Math.sin((2 * n - 1) * PI * u / 2) : amp * Math.cos(n * PI * u);
      up.push([xw0 + Wd * u, y0 - y]); dn.push([xw0 + Wd * u, y0 + y]);
    }
    d.poly(up, { cls: 'c1', close: false, w: 2.2 });
    d.poly(dn, { cls: 'c1', close: false, dash: true, w: 1.4 });
    // 節・腹の印
    const nodes = [], anti = [];
    if (r.closed) { for (let j = 0; j < n; j++) { nodes.push(2 * j / (2 * n - 1)); anti.push((2 * j + 1) / (2 * n - 1)); } }
    else { for (let j = 0; j < n; j++) nodes.push((2 * j + 1) / (2 * n)); for (let j = 0; j <= n; j++) anti.push(j / n); }
    nodes.forEach((u) => d.dot(xw0 + Wd * u, y0, { cls: 'c3', r: 3.5 }));
    if (n <= 4) {
      anti.forEach((u) => d.text(xw0 + Wd * u, y0 - amp - 38 + 12, '腹', { cls: 'c2', size: 11 }));
      nodes.forEach((u) => d.text(xw0 + Wd * u, y0 + hh + 14, '節', { cls: 'c3', size: 11 }));
    }
    // 開口端補正 Δ
    if (r.delta > 0) {
      const xo = r.closed ? [xt1] : [xt0, xt1];
      if (!r.closed) {
        d.arrow(xw0, y0 + hh + 34, xt0, y0 + hh + 34, { cls: 'c4', w: 1.3 });
        d.text(xw0 + dpx / 2 - 2, y0 + hh + 48, 'Δ', { cls: 'c4', size: 11, italic: true });
      }
      d.arrow(xt1, y0 + hh + 34, xw1, y0 + hh + 34, { cls: 'c4', w: 1.3 });
      d.text((xt1 + xw1) / 2 + 2, y0 + hh + 48, 'Δ', { cls: 'c4', size: 11, italic: true });
      void xo;
    }
    // 長さ L
    d.arrow(xt0, y0 + hh + 66, xt1, y0 + hh + 66, { cls: 'dim', w: 1.3 });
    d.arrow(xt1, y0 + hh + 66, xt0, y0 + hh + 66, { cls: 'dim', w: 1.3 });
    d.text((xt0 + xt1) / 2, y0 + hh + 82, 'L = ' + pl(r.L) + ' m', { size: 12 });
    d.text(180, 16, (r.closed ? '閉管（左が閉じた端）' : '開管（両端が開いている）') + (r.closed ? '：(2n − 1) 倍振動 n = ' + n : '：' + n + ' 倍振動'), { cls: 'dim', size: 12 });
    if (!prob) d.text(180, 214, 'V = ' + pl(r.V) + ' m/s　λ = ' + pl(r.lam) + ' m　f = ' + pl(r.f) + ' Hz', { size: 12 });
    return d.svg();
  }

  // 共鳴管の実験（水面の位置 L₁, L₂）
  function figResonance(L1, L2, f, o) {
    o = o || {};
    const d = JK.plot.draw(360, 262);
    const x0 = 150, w = 36, top = 40, bot = 238;
    const sc = 170 / L2;                                    // px / m
    d.rect(x0, top, w, bot - top, { cls: 'fg', fill: 'f1' });
    d.rect(x0 + 1.5, top + L2 * sc + 4, w - 3, bot - top - L2 * sc - 4 + 0.001, { cls: 'fg', fill: 'f2' });
    d.circle(x0 + w / 2, top - 14, 9, { cls: 'fg', fill: 'f3' });
    d.text(x0 + w + 14, top - 10, 'おんさ（振動数 ' + pl(f) + ' Hz）', { size: 12, anchor: 'start' });
    [[L1, 'L₁'], [L2, 'L₂']].forEach((p) => {
      const y = top + p[0] * sc;
      d.line(x0 - 8, y, x0 + w + 8, y, { cls: 'c3', dash: true, w: 1.4 });
      d.arrow(x0 - 20, top, x0 - 20, y, { cls: 'c4', w: 1.3 });
      d.arrow(x0 - 20, y, x0 - 20, top, { cls: 'c4', w: 1.3 });
      d.text(x0 - 26, (top + y) / 2 + 4, p[1] + ' = ' + pl(p[0]) + ' m', { cls: 'c4', size: 12, anchor: 'end' });
    });
    d.text(x0 + w + 14, top + L1 * sc + 4, '1 回目に共鳴（水面）', { cls: 'c3', size: 11, anchor: 'start' });
    d.text(x0 + w + 14, top + L2 * sc + 4, '2 回目に共鳴（水面）', { cls: 'c3', size: 11, anchor: 'start' });
    return d.svg();
  }

  function pipeSteps(r, opt) {
    const n = r.n, cl = r.closed;
    const list = [1, 2, 3, 4].map((m) => sig(r.fOf(m))).join(R`,\ `);
    const Ve = GS(r.V), Le = GS(r.Leff);       // 音速（問題文の値、または 331.5 + 0.6t のちょうどの値）と実効長（L + Δ、L + 2Δ のちょうどの値）
    const steps = [];
    steps.push(r.Vfix != null ? {
      t: '音速',
      m: [R`V = ` + nf(r.V) + MS],
      n: R`この問題では、空気中の音の速さが $V = ` + nf(r.V) + R`\,\mathrm{m/s}$ と与えられています。`,
      easy: R`音は空気の振動が伝わる波です。問題文に書かれている音の速さ $V$ を、そのまま使います。`,
      lv: 2
    } : {
      t: '音速',
      m: [R`V = 331.5 + 0.6t = 331.5 + 0.6 \times ` + nf(r.tC) + ' = ' + Ve + MS],
      n: R`空気中を伝わる音の速さは、気温 $t\,[\degree\mathrm{C}]$ のとき、およそ $V = 331.5 + 0.6t\,\mathrm{[m/s]}$ です（温度が $1\,\degree\mathrm{C}$ 上がると約 $0.6\,\mathrm{m/s}$ 速くなります）。`,
      easy: R`音は空気の振動が伝わる波です。空気が暖かいほど、分子の動きが活発で、音は速く伝わります。0 ℃ で約 $331.5\,\mathrm{m/s}$、1 ℃ 上がるごとに約 $0.6\,\mathrm{m/s}$ ずつ速くなります。気温 15 ℃ のときは、約 $340\,\mathrm{m/s}$ です。`,
      lv: 2
    });
    // 開口端補正（実効長 L_eff）。補正があるときは条件の式に使う値なので、条件の前に入れて lv 1 にする
    steps.push({
      t: '開口端補正',
      m: [cl ? R`L_{\text{eff}} = L + \Delta = ` + nf(r.L) + ' + ' + nf(r.delta) + eqTail(r.Leff) + MM : R`L_{\text{eff}} = L + 2\Delta = ` + nf(r.L) + R` + 2 \times ` + nf(r.delta) + eqTail(r.Leff) + MM],
      n: R`実際には、腹の位置は開口端より少し外側にずれます。このずれを**開口端補正** $\Delta$ といいます。腹は管の外 $\Delta$ のところにできるので、計算に使う長さ（実効長）は、開口端 1 か所につき $\Delta$ だけ長くなります。` + (r.delta === 0 ? R`この計算では $\Delta = 0$（補正なし）としています。` : ''),
      easy: R`開いた端では、音の波は管の外へ少しはみ出して広がります。そのため、本当の「腹」の位置は、管の口よりも少し外側になります。このずれを開口端補正といい、管の太さ（半径の約 0.6 倍）くらいです。計算では、管の長さに、口のぶんだけ足した「実効長」を使います。`,
      lv: r.delta === 0 ? 2 : 1
    });
    steps.push({
      t: '気柱の定常波の条件',
      m: cl
        ? [R`L_{\text{eff}} = (2n - 1)\frac{\lambda}{4} \;\Rightarrow\; \lambda = \frac{4L_{\text{eff}}}{2n - 1}`,
          R`\lambda = \frac{4 \times ` + Le + '}{' + (2 * n - 1) + '}' + eqTail(r.lam) + MM]
        : [R`L_{\text{eff}} = n\frac{\lambda}{2} \;\Rightarrow\; \lambda = \frac{2L_{\text{eff}}}{n}`,
          R`\lambda = \frac{2 \times ` + Le + '}{' + n + '}' + eqTail(r.lam) + MM],
      n: cl
        ? R`管の中の空気が共鳴するのは、気柱に定常波ができるときです。**閉じた端は空気が動けないので節**、**開いた端は空気が自由に動けるので腹**になります。節から腹までは $\frac{\lambda}{4}$ なので、管の長さ（実効長 $L_{\text{eff}}$）は $\frac{\lambda}{4}$ の**奇数倍**になります。`
        : R`**両方の開いた端が腹**になるので、管の長さ（実効長 $L_{\text{eff}}$）は、腹から腹までの $\frac{\lambda}{2}$ の**整数倍**になります。`,
      easy: cl
        ? R`笛やパイプのように、片方が閉じている管（閉管）では、閉じた端の空気は壁にぶつかって動けないので、そこが「節」になります。開いた端では空気が自由に動けるので、そこが「腹」です。「節から隣の腹まで」の長さは波長の $\frac{1}{4}$ です。ですから、管の長さは、$\frac{\lambda}{4}$ の 1 個分（基本振動）、3 個分、5 個分、$\cdots$（奇数個）のいずれかになります。`
        : R`両端が開いている管（開管）では、両方の開いた端が「腹」になります。腹から腹までの長さは、波長の $\frac{1}{2}$ です。ですから、管の長さは、$\frac{\lambda}{2}$ の 1 個分（基本振動）、2 個分、3 個分、$\cdots$ になります。`,
      pro: cl ? R`閉管: 閉端 = 節、開口端 = 腹。$L = \frac{\lambda}{4},\ \frac{3\lambda}{4},\ \frac{5\lambda}{4},\ \cdots$（奇数倍音のみ）。` : R`開管: 両端が腹。$L = \frac{\lambda}{2},\ \lambda,\ \frac{3\lambda}{2},\ \cdots$（整数倍音すべて）。`
    });
    // λ は途中の値（表示した λ で V を割って、結果と合う桁数で書く）
    const lamS = SV(r.lam, dig([r.lam], (l) => r.V / l));
    steps.push({
      t: '共鳴の振動数',
      m: [R`f = \frac{V}{\lambda} = \frac{` + Ve + '}{' + lamS + '}' + tailOf(r.f, [r.lam]) + HZ,
        cl ? R`f_{n} = (2n - 1)\frac{V}{4L_{\text{eff}}},\qquad f_{1} = \frac{V}{4L_{\text{eff}}}` : R`f_{n} = n\frac{V}{2L_{\text{eff}}},\qquad f_{1} = \frac{V}{2L_{\text{eff}}}`,
        R`f_{1} = \frac{` + Ve + '}{' + (cl ? '4' : '2') + R` \times ` + Le + '}' + eqTail(r.f1) + HZ],
      n: R`波の基本式 $V = f\lambda$ から $f = \frac{V}{\lambda}$ です。` + (cl ? R`閉管の共鳴振動数は、基本振動数 $f_{1}$ の 1 倍、3 倍、5 倍、$\cdots$（**奇数倍**）です。` : R`開管の共鳴振動数は、基本振動数 $f_{1}$ の 1 倍、2 倍、3 倍、$\cdots$（**整数倍**）です。`) + (opt && opt.noList ? '' : R`最初の 4 つの共鳴振動数は $` + list + R`\,\mathrm{Hz}$ です。`),   // opt.noList: 演習で 3 倍振動などの振動数を問うとき、答えを先に書かない
      easy: R`音の高さ（振動数）は、波の基本式 $V = f\lambda$ から $f = V/\lambda$ で求めます。管の長さが決まると、共鳴できる波長がとびとびに決まるので、共鳴する音の高さもとびとびになります。` + (cl ? R`閉管では、基本の音の 3 倍、5 倍、$\cdots$ の高さの音が共鳴します（偶数倍の音は出ません）。` : R`開管では、基本の音の 2 倍、3 倍、$\cdots$ の高さの音も共鳴します。`),
      pro: cl ? R`同じ長さなら、閉管の基本振動数は開管の $\frac{1}{2}$（$\frac{V}{4L}$ と $\frac{V}{2L}$）。` : R`同じ長さなら、開管の基本振動数は閉管の 2 倍。開管は $1, 2, 3, \cdots$ 倍、閉管は $1, 3, 5, \cdots$ 倍。`
    });
    return steps;
  }

  JK.registerSim({
    id: 'wave-pipe',
    field: '波動',
    unit: 'p-wave',
    title: '気柱の共鳴（閉管・開管・開口端補正）',
    desc: R`閉管（一端が閉じた管）と開管（両端が開いた管）の気柱が共鳴するときの波長・振動数を求めます。音速は気温から $V = 331.5 + 0.6t$ で求め、開口端補正 $\Delta$ も入れられます。腹と節の位置を図に描きます。`,
    form: [R`V = 331.5 + 0.6t`, R`\text{閉管: } f_{n} = (2n-1)\frac{V}{4L}`, R`\text{開管: } f_{n} = n\frac{V}{2L}`, R`L_{\text{eff}} = L + \Delta\ (\text{閉管}),\ \ L + 2\Delta\ (\text{開管})`],
    inputs: [
      { key: 'kind', label: '管の種類', type: 'select', def: 'closed', options: [['closed', '閉管（一端が閉じている）'], ['open', '開管（両端が開いている）']] },
      { key: 'L', label: '管の長さ L', unit: 'm', type: 'num', def: '0.50', min: 0.001, max: 1000 },
      { key: 'tC', label: '気温 t', unit: '℃', type: 'num', def: '15', min: -60, max: 100, hint: '音速 V = 331.5 + 0.6t' },
      { key: 'n', label: '何番目の共鳴か n', type: 'int', def: '1', min: 1, max: 8, hint: '閉管は (2n−1) 倍振動、開管は n 倍振動' },
      { key: 'delta', label: '開口端補正 Δ（1 か所あたり）', unit: 'm', type: 'num', def: '0', min: 0, max: 10, hint: '0 で補正なし' }
    ],
    examples: [
      { label: '閉管の基本振動', v: { kind: 'closed', L: '0.50', tC: '15', n: '1', delta: '0' } },
      { label: '閉管の 3 倍振動（n = 2）', v: { kind: 'closed', L: '0.50', tC: '15', n: '2', delta: '0' } },
      { label: '開管の 2 倍振動', v: { kind: 'open', L: '0.85', tC: '15', n: '2', delta: '0' } },
      { label: '開口端補正あり', v: { kind: 'closed', L: '0.16', tC: '15', n: '1', delta: '0.010' } }
    ],
    intro: {
      easy: R`笛やパイプオルガンのような管の中の空気は、特定の高さの音でとくに強く振動（**共鳴**）します。管の中の空気には**定常波**ができていて、**閉じた端は節**（空気が動けない）、**開いた端は腹**（空気が自由に動ける）になります。節から腹までは波長の $\frac{1}{4}$ なので、閉管の長さは $\frac{\lambda}{4}$ の奇数倍、両端が開いた管（開管）の長さは $\frac{\lambda}{2}$ の整数倍になります。この条件から波長が決まり、$f = \frac{V}{\lambda}$ で振動数が求まります。`,
      normal: R`閉管: $L = (2n-1)\frac{\lambda}{4}$、$f_{n} = (2n-1)\frac{V}{4L}$。開管: $L = n\frac{\lambda}{2}$、$f_{n} = n\frac{V}{2L}$。開口端補正は $L \to L + \Delta$（閉管）、$L + 2\Delta$（開管）。`,
      pro: R`閉管は奇数倍音のみ、開管は整数倍音すべて。同じ長さなら開管の基本振動数は閉管の 2 倍。共鳴管の実験では、隣り合う 2 回の共鳴の水面の差が $\frac{\lambda}{2}$（開口端補正によらない）。`
    },
    compute(v) {
      const r = solvePipe(v.kind, v.L, v.tC, v.n, v.delta);
      const first = [1, 2, 3, 4].map((m) => sig(r.fOf(m))).join(R`,\ `) + HZ;
      return {
        result: [
          { label: '音速 V', tex: sig(r.V) + MS },
          { label: '実効長 L_eff', tex: sig(r.Leff) + MM },
          { label: '共鳴の波長 λ', tex: sig(r.lam) + MM },
          { label: '共鳴の振動数 f', tex: sig(r.f) + HZ },
          { label: '基本振動数 f₁', tex: sig(r.f1) + HZ },
          { label: '共鳴する振動数（低い方から 4 つ）', tex: first }
        ],
        steps: pipeSteps(r),
        fig: figPipe(r)
      };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      const body0 = (cl) => (cl ? '一端が閉じた' : '両端が開いた');
      if (level === 'basic') {
        const cl = rng.bool(0.5);
        const L = rng.pick([0.17, 0.25, 0.34, 0.50, 0.85, 1.0]);
        const r = solvePipe(cl ? 'closed' : 'open', L, 0, 1, 0, 340);
        return {
          title: cl ? '閉管の基本振動' : '開管の基本振動',
          body: body0(cl) + R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の管の中の空気を共鳴させる。管の太さは十分に細く、開口端補正は無視できる。音の速さを $340\,\mathrm{m/s}$ として、次の問いに答えよ。`,
          fig: figPipe(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`基本振動（もっとも低い音の共鳴）の波長 $\lambda_{1}$`, type: 'num', answer: P3(r.lam), rel: tol.rel, unit: 'm' },
            { label: '(2)', q: R`基本振動の振動数 $f_{1}$`, type: 'num', answer: P3(r.f1), rel: tol.rel, unit: 'Hz' }
          ],
          solution: pipeSteps(r)
        };
      }
      if (level === 'mid') {
        // 音速は 340 m/s と 330 m/s（よく使われる 2 つ）。管の長さは、基本振動数 V/(4L)・3 倍振動 3V/(4L)・同じ長さの開管の基本振動数 V/(2L) が
        // どれも有効数字 3 桁で正確に書け（解説の表示と答えがずれない）、基本振動数が 2 つの音速で重ならないものだけ
        const V = rng.pick([340, 330]);
        const L = rng.pick(V === 340
          ? [0.085, 0.10, 0.17, 0.25, 0.34, 0.50, 0.68, 0.85, 1.0]
          : [0.11, 0.15, 0.25, 0.30, 0.50, 0.55, 0.75, 1.1]);
        const Ls = L.toFixed(L < 0.1 ? 3 : 2);
        const rc1 = solvePipe('closed', L, 0, 1, 0, V);       // 閉管の基本振動（n = 1）
        const rc = solvePipe('closed', L, 0, 2, 0, V), ro = solvePipe('open', L, 0, 1, 0, V);
        // 設問の順（(1) 基本振動数 → (2) 3 倍振動 → (3) 開管）に合わせて、基本振動（n = 1）で波長と振動数を求め、
        // 3 倍振動の振動数をそのあとに、開管の基本振動数を最後に入れる
        const sol = pipeSteps(rc1, { noList: true });
        sol.push({
          t: R`(2) 基本振動のつぎに共鳴する 3 倍振動の振動数 $f_{3}$`,
          m: [R`\lambda_{3} = \frac{4L}{3} = \frac{4 \times ` + nf(L) + R`}{3}` + eqTail(rc.lam) + MM,
            R`f_{3} = \frac{V}{\lambda_{3}} = 3f_{1} = 3 \times ` + GS(rc1.f1) + eqTail(rc.f) + HZ],
          n: R`閉管の共鳴は、基本振動（$\frac{\lambda}{4}$ が 1 個）のつぎに、$\frac{\lambda}{4}$ が 3 個入る 3 倍振動になります。このとき $L = \frac{3\lambda_{3}}{4}$ なので波長は $\lambda_{3} = \frac{4L}{3}$、振動数は基本振動数の 3 倍の $f_{3} = \frac{V}{\lambda_{3}} = 3f_{1}$ です。`,
          easy: R`閉管で基本の音のつぎに共鳴するのは、管の中に $\frac{\lambda}{4}$ が 3 個入る音です。波長は基本の音の $\frac{1}{3}$ になるので、振動数は基本の音の 3 倍の高さになります（偶数倍の音は出ません）。`
        });
        sol.push({
          t: R`(3) 同じ長さの開管の基本振動数`,
          m: [R`\lambda_{1}' = 2L = 2 \times ` + nf(L) + eqTail(ro.lam) + MM,
            R`f_{1}' = \frac{V}{\lambda_{1}'} = \frac{` + nf(V) + '}{' + GS(ro.lam) + '}' + eqTail(ro.f1) + HZ + R`\quad (= 2f_{1})`],
          n: R`開管は両方の開いた端が腹になるので、基本振動（腹が両端の 2 つだけ）では、管の長さが半波長にあたり、$L = \frac{\lambda_{1}'}{2}$ です。同じ長さの閉管の基本振動数 $f_{1} = \frac{V}{4L}$ の 2 倍になります。`,
          easy: R`開管は、両端がどちらも「腹」です。腹から次の腹までは半波長なので、いちばん低い音（基本振動）では $L = \frac{\lambda}{2}$、つまり $\lambda = 2L$ です。閉管の基本振動の波長 $4L$ の半分なので、振動数は 2 倍の高さになります。`
        });
        return {
          title: '閉管の共鳴と、同じ長さの開管',
          body: R`一端が閉じた長さ $` + Ls + R`\,\mathrm{m}$ の管（閉管）の中の空気を共鳴させる。開口端補正は無視できる。音の速さを $` + V.toFixed(0) + R`\,\mathrm{m/s}$ として、次の問いに答えよ。`,
          fig: figPipe(rc, { problem: true }),
          parts: [
            { label: '(1)', q: R`閉管の基本振動数 $f_{1}$`, type: 'num', answer: P3(rc.f1), rel: tol.rel, unit: 'Hz' },
            { label: '(2)', q: R`閉管で、基本振動のつぎに共鳴する音（3 倍振動）の振動数 $f_{3}$`, type: 'num', answer: P3(rc.f), rel: tol.rel, unit: 'Hz' },
            { label: '(3)', q: R`同じ長さの開管の基本振動数 $f_{1}'$`, type: 'num', answer: P3(ro.f1), rel: tol.rel, unit: 'Hz' }
          ],
          solution: sol
        };
      }
      // adv: 共鳴管の実験（L1, L2 から λ, V, Δ）。数値は 3 桁の小数で書ける値に選ぶ
      const f = rng.pick([340, 425, 500, 680, 850, 1000]);
      const lam = 340 / f;
      const Dl = rng.pick([0.005, 0.008, 0.010, 0.012]);
      const L1 = Math.round((lam / 4 - Dl) * 1000) / 1000, L2 = Math.round((3 * lam / 4 - Dl) * 1000) / 1000;
      const sol = [
        {
          t: R`共鳴管の実験（閉管）の考え方`,
          n: R`水面が管の底（閉じた端）になる閉管です。管の口の近くに腹ができ、水面の位置が節になります。管の口から水面までの距離を $L$、開口端補正を $\Delta$ とすると、1 回目の共鳴は $L_{1} + \Delta = \frac{\lambda}{4}$、2 回目の共鳴は $L_{2} + \Delta = \frac{3\lambda}{4}$ です。`,
          easy: R`管に水を入れて、水面の位置を変えながら、管の口の上でおんさを鳴らします。水面が、おんさの音とちょうど合う位置にくると、管の中の空気が共鳴して、音が大きくなります。水面は閉じた端（節）、管の口付近は開いた端（腹）で、1 回目の共鳴では、水面から腹まで $\frac{\lambda}{4}$、2 回目の共鳴では $\frac{3\lambda}{4}$ です。ただし、本当の腹は口より少し外（開口端補正 $\Delta$）にあります。`,
          pro: R`$L_{1} + \Delta = \frac{\lambda}{4}$、$L_{2} + \Delta = \frac{3\lambda}{4}$。2 式の差から $\Delta$ が消えて $\lambda = 2(L_{2} - L_{1})$。`
        },
        {
          t: R`波長と音速`,
          m: [R`L_{2} - L_{1} = \frac{\lambda}{2} \;\Rightarrow\; \lambda = 2(L_{2} - L_{1}) = 2 \times (` + nf(L2) + ' - ' + nf(L1) + ') = ' + sig(lam) + MM,
            R`V = f\lambda = ` + nf(f) + R` \times ` + sig(lam) + ' = ' + sig(f * lam) + MS],
          n: R`2 式の差をとると、開口端補正 $\Delta$ が消えて、$L_{2} - L_{1} = \frac{\lambda}{2}$ となります。隣り合う 2 回の共鳴の水面の差が、半波長です。音の速さは $V = f\lambda$ です。`,
          easy: R`1 回目と 2 回目の共鳴の水面の位置の差は、ちょうど半波長 $\frac{\lambda}{2}$ です（節から次の節まで）。この差は、口のずれ（開口端補正）の影響を受けないので、波長を正確に求められます。波長が分かれば、音の速さは $V = f\lambda$ です。`
        },
        {
          t: R`開口端補正`,
          m: [R`\Delta = \frac{\lambda}{4} - L_{1} = \frac{` + sig(lam) + R`}{4} - ` + nf(L1) + ' = ' + sig(Dl) + MM],
          n: R`1 回目の共鳴の式 $L_{1} + \Delta = \frac{\lambda}{4}$ を $\Delta$ について解きます。もし補正がなければ、$L_{1} = \frac{\lambda}{4}$ となるはずですが、実際の $L_{1}$ はそれより $\Delta$ だけ短くなっています。`,
          easy: R`補正がなければ、1 回目の共鳴は「水面から口まで $\frac{\lambda}{4}$」のはずです。ところが、測った $L_{1}$ はそれより少し短いので、足りない分が開口端補正 $\Delta$ です。`
        }
      ];
      return {
        title: '共鳴管の実験',
        body: R`ガラスの管を鉛直に立て、水を入れて水面の高さを調節できるようにした。管の上端の口のすぐ上で、振動数 $` + f.toFixed(0) + R`\,\mathrm{Hz}$ のおんさを鳴らしながら、水面を管の口から下げていくと、口から水面までの距離が $L_{1} = ` + L1.toFixed(3) + R`\,\mathrm{m}$ のときに最初の共鳴が、$L_{2} = ` + L2.toFixed(3) + R`\,\mathrm{m}$ のときに 2 回目の共鳴が起こった。次の問いに答えよ。`,
        fig: figResonance(L1, L2, f),
        parts: [
          { label: '(1)', q: R`おんさの音の波長 $\lambda$`, type: 'num', answer: P3(lam), rel: tol.rel, unit: 'm' },
          { label: '(2)', q: R`空気中の音の速さ $V$`, type: 'num', answer: P3(f * lam), rel: tol.rel, unit: 'm/s' },
          { label: '(3)', q: R`開口端補正 $\Delta$`, type: 'num', answer: P3(Dl), rel: 0.02, unit: 'm' }
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     屈折の法則・臨界角
     ===================================================================== */
  function solveRefr(n1, n2, th1Deg, lam0nm) {
    const r = { n1: n1, n2: n2, th1Deg: th1Deg, th1: rad(th1Deg), lam0: lam0nm };
    r.s1 = Math.sin(r.th1);
    r.s2 = n1 * r.s1 / n2;
    r.tir = r.s2 > 1 + 1e-12;
    if (!r.tir) { r.th2 = Math.asin(Math.min(1, r.s2)); r.th2Deg = r.th2 * 180 / PI; }
    r.hasCrit = n1 > n2;
    if (r.hasCrit) { r.sc = n2 / n1; r.thc = Math.asin(r.sc); r.thcDeg = r.thc * 180 / PI; }
    r.v1 = C / n1; r.v2 = C / n2;
    r.l1 = lam0nm / n1; r.l2 = lam0nm / n2;
    r.f = C / (lam0nm * 1e-9);
    return r;
  }

  function figRefr(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, 270);
    const cx = 180, cy = 132, Rr = 108;
    d.rect(14, cy, 332, 124, { cls: 'dim', fill: 'f1', w: 0.5 });
    d.line(14, cy, 346, cy, { cls: 'fg', w: 1.8 });
    d.line(cx, cy - 112, cx, cy + 118, { cls: 'dim', dash: true, w: 1.2 });
    const t1 = r.th1;
    d.arrow(cx - Rr * Math.sin(t1), cy - Rr * Math.cos(t1), cx, cy, { cls: 'c1', w: 2.2 });
    if (!prob) {
      if (r.tir) {
        d.arrow(cx, cy, cx + Rr * Math.sin(t1), cy - Rr * Math.cos(t1), { cls: 'c1', w: 2.2 });
        d.text(cx + 66, cy + 26, '全反射', { cls: 'c3', size: 14, bold: true });
      } else {
        d.arrow(cx, cy, cx + Rr * Math.sin(r.th2), cy + Rr * Math.cos(r.th2), { cls: 'c2', w: 2.2 });
        d.arrow(cx, cy, cx + 0.75 * Rr * Math.sin(t1), cy - 0.75 * Rr * Math.cos(t1), { cls: 'dim', w: 1.4 });
        d.angle(cx, cy, 44, -90, -90 + r.th2Deg, 'θ₂', { cls: 'c3' });
      }
    }
    d.angle(cx, cy, 44, 90, 90 + r.th1Deg, 'θ₁', { cls: 'c3' });
    d.text(20, 24, '媒質 1（屈折率 n₁ = ' + pl(r.n1) + '）', { cls: 'dim', size: 12, anchor: 'start' });
    d.text(20, 246, '媒質 2（屈折率 n₂ = ' + pl(r.n2) + '）', { cls: 'dim', size: 12, anchor: 'start' });
    d.text(cx + 4, cy - 100, '法線', { cls: 'dim', size: 11, anchor: 'start' });
    if (!prob) {
      d.text(180, 262, r.tir ? '入射角 ' + pl(r.th1Deg) + '° ≧ 臨界角 ' + pl(r.thcDeg) + '°' : 'θ₁ = ' + pl(r.th1Deg) + '°　θ₂ = ' + pl(r.th2Deg) + '°', { size: 12 });
    } else {
      d.text(180, 262, '入射角 θ₁ = ' + pl(r.th1Deg) + '°', { size: 12 });
    }
    return d.svg();
  }

  // 水中の光源（adv 用）
  function figWater(n, h, o) {
    const d = JK.plot.draw(360, 262);
    const sy = 64, by = 232, cx = 180;
    const hp = by - sy - 22;
    const tc = Math.asin(1 / n), Rp = Math.min(150, hp * Math.tan(tc));
    d.rect(14, sy, 332, by - sy, { cls: 'dim', fill: 'f1', w: 0.5 });
    d.line(14, sy, 346, sy, { cls: 'fg', w: 1.8 });
    d.text(20, sy - 8, '空気（屈折率 1.00）', { cls: 'dim', size: 11, anchor: 'start' });
    d.text(20, sy + 16, '液体（屈折率 n = ' + pl(n) + '）', { cls: 'dim', size: 11, anchor: 'start' });
    d.circle(cx, by - 22, 5, { cls: 'fg', fill: 'f3' });
    d.text(cx + 12, by - 18, '光源 S', { size: 12, anchor: 'start' });
    d.line(cx, by - 22, cx, sy, { cls: 'dim', dash: true, w: 1.2 });
    d.arrow(cx, by - 22, cx - Rp, sy, { cls: 'c1', w: 1.8 });
    d.arrow(cx, by - 22, cx + Rp, sy, { cls: 'c1', w: 1.8 });
    d.line(cx - Rp, sy, cx + Rp, sy, { cls: 'c3', w: 4 });
    d.arrow(cx, sy - 16, cx + Rp, sy - 16, { cls: 'c3', w: 1.5 });
    d.arrow(cx, sy - 16, cx - Rp, sy - 16, { cls: 'c3', w: 1.5 });
    d.text(cx + Rp / 2, sy - 22, 'r', { cls: 'c3', size: 13, italic: true });
    d.arrow(cx + 24, sy + 6, cx + 24, by - 22, { cls: 'c4', w: 1.3 });
    d.arrow(cx + 24, by - 22, cx + 24, sy + 6, { cls: 'c4', w: 1.3 });
    d.text(cx + 30, (sy + by) / 2 - 8, 'h = ' + pl(h) + ' m', { cls: 'c4', size: 12, anchor: 'start' });
    d.angle(cx, by - 22, 34, 90 - tc * 180 / PI, 90, 'θc', { cls: 'c3' });
    d.text(180, 258, '液面の光が空気中へ出ていく範囲（半径 r の円）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  const CTEX = R`3.00 \times 10^{8}`;         // 真空中の光速（問題文でも compute でも同じ値）

  // 屈折の解説。演習は、設問の順・向きに合わせて、必要なステップだけを組み替えて使う（exercise を参照）
  function refrSteps(r) {
    const steps = [];
    steps.push({
      t: '屈折とは',
      n: R`波が 2 つの媒質の境界面を通るとき、媒質によって波の速さが変わるため、進む向きが曲がります。これが**屈折**です。このとき、**振動数 $f$ は変わりません**（変わるのは速さ $v$ と波長 $\lambda$ です）。光では、媒質の**屈折率** $n$ が大きいほど光は遅く進み、$v = \frac{c}{n}$、$\lambda = \frac{\lambda_{0}}{n}$（$c = 3.00 \times 10^{8}\,\mathrm{m/s}$ は真空中の光速、$\lambda_{0}$ は真空中の波長）です。`,
      easy: R`光や音などの波は、水やガラスなどの別の物質に入ると、進む速さが変わります。そのとき、境界面にななめに入ると、進む向きが曲がります（水の中の棒が曲がって見えるのは、この屈折のためです）。光の速さは、真空中が一番速く（約 $3.0 \times 10^{8}\,\mathrm{m/s}$）、物質中では $\frac{1}{n}$ 倍になります。この $n$ が**屈折率**で、大きいほど光が遅く、屈折が大きくなります。なお、波の振動数は、境界面を通っても変わりません。`,
      pro: R`屈折で不変なのは振動数 $f$。$v = f\lambda$ より、$v$ と $\lambda$ は同じ割合 $\frac{1}{n}$ で変わる。`
    });
    steps.push({
      t: '屈折の法則',
      m: [R`\frac{\sin\theta_{1}}{\sin\theta_{2}} = \frac{v_{1}}{v_{2}} = \frac{\lambda_{1}}{\lambda_{2}} = \frac{n_{2}}{n_{1}}\quad \Leftrightarrow\quad n_{1}\sin\theta_{1} = n_{2}\sin\theta_{2}`],
      n: R`入射角 $\theta_{1}$ と屈折角 $\theta_{2}$ は、どちらも境界面の**法線**（境界面に垂直な線）から測った角です。屈折の法則は、$n_{1}\sin\theta_{1} = n_{2}\sin\theta_{2}$ で、屈折率が大きい媒質の中では、光は法線に近づくように曲がります。`,
      easy: R`光の進む向きは、境界面に立てた「法線」からの角度で測ります。屈折率の小さい媒質（たとえば空気）から大きい媒質（たとえばガラス）に入ると、光は遅くなり、法線の方へ曲がります。逆に、屈折率の大きい方から小さい方へ出るときは、法線から遠ざかるように曲がります。式にすると、「屈折率 × $\sin$（角度）」が両側で等しくなります。`,
      pro: R`$n_{1}\sin\theta_{1} = n_{2}\sin\theta_{2}$。角度は法線から測る。$n$ が大きい側で角が小さい。`
    });
    if (r.tir) {
      steps.push({
        t: '屈折角を求める → 全反射',
        m: [R`\sin\theta_{2} = \frac{n_{1}}{n_{2}}\sin\theta_{1} = \frac{` + nf(r.n1) + '}{' + nf(r.n2) + R`} \times ` + SV(r.s1, dig([r.s1], (s) => r.n1 / r.n2 * s)) + ' = ' + sig(r.s2) + R` > 1`],
        n: R`$\sin\theta_{2} > 1$ となるので、屈折する光は存在しません。入射した光は、すべて境界面で反射します（**全反射**）。`,
        easy: R`$\sin$ の値は 1 をこえることがありません。計算した $\sin\theta_{2}$ が 1 より大きくなるのは、「屈折して出ていく光がない」ということです。このとき、光は境界面でぜんぶ反射されて、もとの媒質にもどります。これが全反射です。`
      });
    } else {
      steps.push({
        t: '屈折角を求める',
        m: [R`\sin\theta_{2} = \frac{n_{1}}{n_{2}}\sin\theta_{1} = \frac{` + nf(r.n1) + '}{' + nf(r.n2) + R`} \times \sin ` + nf(r.th1Deg) + R`\degree = ` + sig(r.s2),
          R`\theta_{2} = ` + sig(r.th2Deg) + R`\degree`],
        n: R`屈折の法則を $\sin\theta_{2}$ について解きます。` + (r.n1 < r.n2 ? R`屈折率の大きい媒質に入るので、屈折角は入射角より小さくなります（法線に近づく）。` : (r.n1 > r.n2 ? R`屈折率の小さい媒質に出るので、屈折角は入射角より大きくなります（法線から遠ざかる）。` : R`屈折率が等しいので、光は曲がらずにまっすぐ進みます。`)),
        easy: R`法則の式を変形して、$\sin\theta_{2} = \frac{n_{1}}{n_{2}} \times \sin\theta_{1}$ とします。数値を入れて $\sin\theta_{2}$ を求めたあと、電卓の逆関数（$\sin^{-1}$）で角度に直します。`
      });
    }
    steps.push({
      t: '速さ・波長・振動数',
      m: [R`v_{1} = \frac{c}{n_{1}} = \frac{` + CTEX + '}{' + nf(r.n1) + '}' + eqTail(r.v1) + MS,
        R`v_{2} = \frac{c}{n_{2}} = \frac{` + CTEX + '}{' + nf(r.n2) + '}' + eqTail(r.v2) + MS,
        R`\lambda_{1} = \frac{\lambda_{0}}{n_{1}} = \frac{` + nf(r.lam0) + '}{' + nf(r.n1) + '}' + eqTail(r.l1) + R`\,\mathrm{nm}`,
        R`\lambda_{2} = \frac{\lambda_{0}}{n_{2}} = \frac{` + nf(r.lam0) + '}{' + nf(r.n2) + '}' + eqTail(r.l2) + R`\,\mathrm{nm}`,
        R`f = \frac{c}{\lambda_{0}} = \frac{` + CTEX + '}{' + nf(r.lam0) + R` \times 10^{-9}}` + eqTail(r.f) + HZ,
        R`f = \frac{v_{1}}{\lambda_{1}} = \frac{v_{2}}{\lambda_{2}}\ \ (\text{どの媒質でも同じ})`],
      n: R`屈折率 $n$ の媒質中で、光の速さは $\frac{c}{n}$、波長は $\frac{\lambda_{0}}{n}$ です。振動数は媒質によらず一定で、$f = \frac{v}{\lambda}$ はどの媒質でも同じ値になります。`,
      easy: R`屈折率 $n$ の物質の中では、光の速さも波長も、真空中の $\frac{1}{n}$ 倍になります。一方、振動数は変わりません（$v = f\lambda$ の $v$ と $\lambda$ が同じ割合で小さくなるので、$f$ は変わらない）。たとえば、$n = 1.5$ のガラス中では、光の速さは真空中の $\frac{2}{3}$ 倍です。`,
      lv: 2
    });
    if (r.hasCrit) {
      steps.push({
        t: '臨界角と全反射',
        m: [R`\sin\theta_{c} = \frac{n_{2}}{n_{1}} = \frac{` + nf(r.n2) + '}{' + nf(r.n1) + '} = ' + sig(r.sc) + R`\ \Rightarrow\ \theta_{c} = ` + sig(r.thcDeg) + R`\degree`],
        n: R`屈折率の大きい媒質から小さい媒質へ向かう光は、入射角を大きくすると、屈折角が $90\degree$ になる（境界面に沿って進む）ところがあります。このときの入射角が**臨界角** $\theta_{c}$ で、$\sin\theta_{c} = \frac{n_{2}}{n_{1}}$ です。入射角が $\theta_{c}$ 以上になると、**全反射**（屈折光がなく、すべて反射）になります。` + (r.tir ? R`この問題では $\theta_{1} = ` + nf(r.th1Deg) + R`\degree \ge \theta_{c}$ なので、全反射します。` : R`この問題では $\theta_{1} = ` + nf(r.th1Deg) + R`\degree < \theta_{c}$ なので、全反射は起こらず、屈折します。`),
        easy: R`ガラスから空気へ光が出るとき、入射角を大きくしていくと、屈折角がどんどん大きくなって、ついに $90\degree$（境界面すれすれ）になります。このときの入射角が臨界角です。それより入射角が大きいと、光はもう外へ出られず、境界面ですべて反射されます（全反射）。光ファイバーの中を光が進むのは、この全反射を利用しています。臨界角は、$\sin\theta_{c} = n_{2}/n_{1}$ で求めます。`,
        pro: R`全反射の条件: 屈折率が大きい側から入射し、入射角 $\ge \theta_{c}$（$\sin\theta_{c} = \frac{n_{2}}{n_{1}}$）。例: 水 ($n = 1.33$) → 空気で $\sin\theta_{c} \approx 0.75$、$\theta_{c} \approx 49\degree$。`
      });
    } else {
      steps.push({
        t: '全反射は起こるか',
        n: R`全反射は、屈折率の**大きい**媒質から**小さい**媒質へ向かうときだけ起こります。この問題では $n_{1} \le n_{2}$ なので、どんな入射角でも全反射は起こりません（臨界角はありません）。`,
        easy: R`全反射が起こるのは、光が「屈折率の大きい物質（ガラスや水）から、小さい物質（空気）へ」出ようとするときだけです。この設定では、逆（小さい方から大きい方へ入る）なので、全反射は起こりません。`,
        lv: 2
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'wave-refraction',
    field: '波動',
    unit: 'p-wave',
    title: '屈折の法則・臨界角・全反射',
    desc: R`屈折率 $n_{1}$ の媒質から $n_{2}$ の媒質へ、入射角 $\theta_{1}$ で入る光の屈折角を求めます。各媒質中の速さ・波長、臨界角と全反射の判定も示し、光線の様子を図に描きます。`,
    form: [R`n_{1}\sin\theta_{1} = n_{2}\sin\theta_{2}`, R`\frac{\sin\theta_{1}}{\sin\theta_{2}} = \frac{v_{1}}{v_{2}} = \frac{\lambda_{1}}{\lambda_{2}} = \frac{n_{2}}{n_{1}}`, R`\sin\theta_{c} = \frac{n_{2}}{n_{1}}\quad (n_{1} > n_{2})`],
    inputs: [
      { key: 'n1', label: '入射側の屈折率 n₁', type: 'num', def: '1.00', min: 1, max: 5 },
      { key: 'n2', label: '屈折側の屈折率 n₂', type: 'num', def: '1.50', min: 1, max: 5 },
      { key: 'th1', label: '入射角 θ₁', unit: '°', type: 'num', def: '30', min: 0, max: 89.9, hint: '法線（境界面に垂直な線）から測った角' },
      { key: 'lam0', label: '真空中の波長 λ₀', unit: 'nm', type: 'num', def: '600', min: 1, max: 100000, hint: '光の色に対応（赤は約 700、緑は約 550、紫は約 400）' }
    ],
    examples: [
      { label: '空気 → ガラス（30°）', v: { n1: '1.00', n2: '1.50', th1: '30', lam0: '600' } },
      { label: 'ガラス → 空気（30°）', v: { n1: '1.50', n2: '1.00', th1: '30', lam0: '600' } },
      { label: 'ガラス → 空気（全反射）', v: { n1: '1.50', n2: '1.00', th1: '45', lam0: '600' } },
      { label: '空気 → 水（45°）', v: { n1: '1.00', n2: '1.33', th1: '45', lam0: '550' } }
    ],
    intro: {
      easy: R`光が空気から水やガラスに斜めに入ると、進む向きが曲がります（**屈折**）。これは、物質の中では光の進む速さが変わるためです。向きは、境界面に立てた**法線**からの角度で測り、**屈折の法則** $n_{1}\sin\theta_{1} = n_{2}\sin\theta_{2}$ で計算できます。$n$ は**屈折率**で、大きいほど光が遅く進みます。逆に、屈折率の大きい物質から小さい物質へ出るときは、入射角が大きすぎると光は外に出られずに全部はね返されます（**全反射**）。その境目の角度が**臨界角**です。`,
      normal: R`$n_{1}\sin\theta_{1} = n_{2}\sin\theta_{2}$、$v = \frac{c}{n}$、$\lambda = \frac{\lambda_{0}}{n}$（$f$ は不変）。$n_{1} > n_{2}$ のとき臨界角 $\sin\theta_{c} = \frac{n_{2}}{n_{1}}$、$\theta_{1} \ge \theta_{c}$ で全反射。`,
      pro: R`屈折で不変なのは振動数。$\sin$ の比 = 速さの比 = 波長の比 = 屈折率の逆比。全反射の臨界角の計算 → 水中の光源が水面に作る明るい円の半径 $r = \frac{h}{\sqrt{n^{2} - 1}}$ のような応用が定番。`
    },
    compute(v) {
      const r = solveRefr(v.n1, v.n2, v.th1, v.lam0);
      const res = [
        { label: '屈折角 θ₂', tex: r.tir ? R`\text{なし（全反射）}` : sig(r.th2Deg) + R`\degree` },
        { label: '臨界角 θc', tex: r.hasCrit ? sig(r.thcDeg) + R`\degree` : R`\text{なし（} n_{1} \le n_{2} \text{）}` },
        { label: '媒質 1 中の速さ v₁', tex: sig(r.v1) + MS },
        { label: '媒質 2 中の速さ v₂', tex: sig(r.v2) + MS },
        { label: '媒質 1 中の波長 λ₁', tex: sig(r.l1) + R`\,\mathrm{nm}` },
        { label: '媒質 2 中の波長 λ₂', tex: sig(r.l2) + R`\,\mathrm{nm}` },
        { label: '振動数 f（両媒質で同じ）', tex: sig(r.f) + HZ }
      ];
      return { result: res, steps: refrSteps(r), fig: figRefr(r) };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      const ex = (v) => { const e = Number(v.toPrecision(3)); return e; };
      if (level === 'basic') {
        const n2 = rng.pick([1.33, 1.50, 1.60, 1.80]);
        const th = rng.pick([30, 45, 60]);
        const r = solveRefr(1.0, n2, th, 600);
        const sinTxt = th === 30 ? 0.5 : (th === 45 ? 0.707 : 0.866);        // 問題文に書いた sin の値（答えも解説もこの値で計算する）
        const s2 = sinTxt / n2;
        const g = refrSteps(r);
        // 設問の順（(1) sin θ₂ → (2) 物質中の光の速さ）に合わせる。真空中の波長は問題文にないので、波長・振動数の行は入れない
        const sol = [g[0], g[1], {
          t: R`(1) 屈折角 $\theta_{2}$ について $\sin\theta_{2}$ を求める`,
          m: [R`\sin\theta_{2} = \frac{n_{1}}{n_{2}}\sin\theta_{1} = \frac{1.00}{` + n2.toFixed(2) + R`} \times ` + sinTxt.toFixed(3) + eqTail(s2)],
          n: R`屈折の法則 $n_{1}\sin\theta_{1} = n_{2}\sin\theta_{2}$ を $\sin\theta_{2}$ について解きます。空気（$n_{1} = 1.00$）から屈折率の大きい物質に入るので、屈折角は入射角より小さくなります（法線に近づく）。問題文で与えられた $\sin ` + th + R`\degree = ` + sinTxt.toFixed(3) + R`$ を使います。`,
          easy: R`法則の式を変形して、$\sin\theta_{2} = \frac{n_{1}}{n_{2}} \times \sin\theta_{1}$ とします。空気の屈折率は $1.00$、物質の屈折率は $` + n2.toFixed(2) + R`$、$\sin\theta_{1}$ は問題文の値を入れるだけです。`
        }, {
          t: R`(2) 物質中での光の速さ $v$`,
          m: [R`v = \frac{c}{n_{2}} = \frac{` + CTEX + '}{' + n2.toFixed(2) + '}' + eqTail(C / n2) + MS],
          n: R`屈折率 $n$ の物質の中では、光の速さは真空中の $\frac{1}{n}$ 倍の $v = \frac{c}{n}$ になります（振動数は変わらず、波長が $\frac{1}{n}$ 倍になります）。`,
          easy: R`物質の中に入ると、光は真空中より遅くなります。屈折率 $n$ は「真空中の速さの何分の 1 になるか」を表す数で、$v = \frac{c}{n}$ です。たとえば $n = 1.5$ なら、速さは真空中の $\frac{2}{3}$ 倍です。`
        }, g[4]];
        return {
          title: '空気から物質へ入る光',
          body: R`空気（屈折率 $1.00$）中から、屈折率 $` + n2.toFixed(2) + R`$ の透明な物質の平らな表面に、単色光が入射角 $` + th + R`\degree$ で入射した。真空中の光の速さを $c = 3.00 \times 10^{8}\,\mathrm{m/s}$、$\sin ` + th + R`\degree = ` + (th === 30 ? '0.500' : (th === 45 ? '0.707' : '0.866')) + R`$ として、次の問いに答えよ。`,
          fig: figRefr(Object.assign({}, r, { tir: false }), { problem: true }),
          parts: [
            { label: '(1)', q: R`屈折角 $\theta_{2}$ について、$\sin\theta_{2}$ の値`, type: 'num', answer: P3(s2), rel: tol.rel },
            { label: '(2)', q: R`この物質中での光の速さ $v$`, type: 'num', answer: P3(C / n2), rel: tol.rel, unit: 'm/s', hint: R`$2.5 \times 10^{8}$ は 2.5e8 と入力できます` }
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        // ガラスの屈折率・入射角・真空中の波長を乱数で選ぶ
        let n1, th, sin, lam0;
        for (let i = 0; i < 100; i++) {
          n1 = rng.pick([1.45, 1.50, 1.52, 1.60, 1.70, 1.80, 1.90, 2.00]);
          th = rng.pick([30, 45, 60]);
          lam0 = rng.pick([450, 500, 550, 600, 650, 700]);                 // 真空中の波長 [nm]
          sin = { 30: 0.5, 45: 0.7071, 60: 0.8660 }[th];
          if (Math.abs(sin - 1 / n1) >= 0.03) break;          // 臨界角ちょうどの紛らわしい設定は避ける
        }
        const r = solveRefr(n1, 1.0, th, lam0);
        const sc = 1 / n1;
        const tir = sin >= sc;
        const lam1 = lam0 * 1e-9 / n1;                        // ガラス中の波長 [m]（答え）
        const lam0txt = (lam0 / 100).toFixed(2);              // 真空中の波長を ×10⁻⁷ m で書いた仮数（450 nm → 4.50）
        const sinTxt = th === 30 ? 0.5 : (th === 45 ? 0.707 : 0.866);        // 問題文に書いた sin の値
        const n1t = n1.toFixed(2);
        const g = refrSteps(r);
        // 設問の順（(1) 臨界角 → (2) 全反射の判定 → (3) ガラス中の波長）に合わせる
        const sol = [g[0], g[1], {
          t: R`(1) 臨界角 $\theta_{c}$ について $\sin\theta_{c}$ を求める`,
          m: [R`n_{1}\sin\theta_{c} = n_{2}\sin 90\degree \;\Rightarrow\; \sin\theta_{c} = \frac{n_{2}}{n_{1}}`,
            R`\sin\theta_{c} = \frac{1.00}{` + n1t + '}' + eqTail(sc)],
          n: R`屈折率の大きいガラス（$n_{1} = ` + n1t + R`$）から空気（$n_{2} = 1.00$）へ向かう光は、入射角を大きくすると、屈折角が $90\degree$ になる（境界面に沿って進む）ところがあります。この入射角が**臨界角** $\theta_{c}$ です。屈折の法則で $\theta_{2} = 90\degree$（$\sin 90\degree = 1$）とおくと、$\sin\theta_{c} = \dfrac{n_{2}}{n_{1}}$ になります。`,
          easy: R`ガラスから空気へ光が出るとき、入射角を大きくしていくと、屈折角がどんどん大きくなって、ついに $90\degree$（境界面すれすれ）になります。このときの入射角が臨界角です。屈折の法則 $n_{1}\sin\theta_{1} = n_{2}\sin\theta_{2}$ に、$\theta_{2} = 90\degree$ を入れると $\sin\theta_{c} = \dfrac{n_{2}}{n_{1}}$ が出ます。`
        }, {
          t: R`(2) 全反射するかどうかを調べる`,
          m: [R`\sin\theta_{1} = ` + sinTxt.toFixed(3) + R`,\qquad \sin\theta_{c} = ` + sig(sc) + R`\ (\theta_{c} = ` + sig(r.thcDeg) + R`\degree)`,
            tir ? R`\sin\theta_{1} > \sin\theta_{c} \;\Rightarrow\; \theta_{1} = ` + th + R`\degree > \theta_{c}\ \ (\text{全反射})` : R`\sin\theta_{1} < \sin\theta_{c} \;\Rightarrow\; \theta_{1} = ` + th + R`\degree < \theta_{c}\ \ (\text{屈折})`],
          n: tir
            ? R`入射角 $\theta_{1} = ` + th + R`\degree$ は臨界角 $\theta_{c}$ より大きい（$\sin\theta_{1}$ が $\sin\theta_{c}$ より大きい）ので、屈折する光はなく、**全反射**します。光は空気中へは出ていきません。`
            : R`入射角 $\theta_{1} = ` + th + R`\degree$ は臨界角 $\theta_{c}$ より小さい（$\sin\theta_{1}$ が $\sin\theta_{c}$ より小さい）ので、全反射は起こらず、**屈折**して空気中へ出ていきます。`,
          easy: R`入射角が臨界角より大きいと、光は外へ出られず、境界面ですべて反射されます（全反射）。入射角が臨界角より小さければ、ふつうに屈折して出ていきます。$\sin$ の値は角が大きいほど大きいので、$\sin\theta_{1}$ と $\sin\theta_{c}$ を比べれば、角の大小が分かります。`
        }, {
          t: R`(3) ガラス中の波長 $\lambda_{1}$`,
          m: [R`\lambda_{1} = \frac{\lambda_{0}}{n_{1}} = \frac{` + lam0txt + R` \times 10^{-7}}{` + n1t + '}' + eqTail(lam1) + MM],
          n: R`光が屈折率 $n$ の媒質に入ると、振動数は変わらず、速さと波長が $\frac{1}{n}$ 倍になります。真空中の波長 $\lambda_{0} = ` + lam0txt + R` \times 10^{-7}\,\mathrm{m}$ の光が、屈折率 $n_{1} = ` + n1t + R`$ のガラスの中に入ると、波長は $\lambda_{1} = \dfrac{\lambda_{0}}{n_{1}}$ になります。`,
          easy: R`光の波は、物質の中に入っても、1 秒間に振動する回数（振動数）は変わりません。ところが速さが $\frac{1}{n}$ 倍に遅くなるので、波の山と山の間隔（波長）も $\frac{1}{n}$ 倍に縮みます。`
        }];
        return {
          title: 'ガラスから空気へ出る光の臨界角',
          body: R`屈折率 $` + n1.toFixed(2) + R`$ のガラスの中から、ガラスと空気（屈折率 $1.00$）の平らな境界面に向けて、真空中での波長が $` + lam0txt + R` \times 10^{-7}\,\mathrm{m}$ の単色光が、入射角 $` + th + R`\degree$ で入射した。$\sin ` + th + R`\degree = ` + (th === 30 ? '0.500' : (th === 45 ? '0.707' : '0.866')) + R`$ とする。次の問いに答えよ。`,
          fig: figRefr(Object.assign({}, r, { tir: tir }), { problem: true }),
          parts: [
            { label: '(1)', q: R`ガラスから空気へ光が出るときの臨界角 $\theta_{c}$ について、$\sin\theta_{c}$ の値`, type: 'num', answer: P3(sc), rel: tol.rel },
            { label: '(2)', q: R`この入射角で、光はどうなるか`, type: 'choice', choices: ['全反射して、空気中へは出ていかない', '屈折して、空気中へ出ていく'], answer: tir ? 0 : 1 },
            { label: '(3)', q: R`ガラスの中での、この光の波長 $\lambda_{1}$`, type: 'num', answer: P3(lam1), rel: tol.rel, unit: 'm', hint: R`$5.5 \times 10^{-7}$ は 5.5e-7 と入力できます` }
          ],
          solution: sol
        };
      }
      // adv: 水中の光源から水面に出ていく光の範囲
      const n = rng.pick([1.25, 1.33, 1.50, 1.67, 2.00]);
      const h = rng.pick([1.0, 2.0, 3.0, 4.0]);
      const sc = 1 / n, tc = Math.asin(sc);
      const rr = h * Math.tan(tc);
      const area = 3.14 * rr * rr;
      const rSolve = solveRefr(n, 1.0, 10, 600);
      const sol = [
        refrSteps(rSolve)[0],
        {
          t: R`光が液面から出ていける条件（臨界角）`,
          m: [R`\sin\theta_{c} = \frac{1}{n} = \frac{1}{` + n.toFixed(2) + '}' + eqTail(sc), R`\theta_{c} = ` + sig(tc * 180 / PI) + R`\degree`],
          n: R`光源から出て液面に入射する光のうち、入射角が臨界角 $\theta_{c}$ より小さいものだけが、屈折して空気中へ出ていきます。$\theta_{c}$ 以上の入射角の光は、液面で全反射して、液体中にもどります。液体（屈折率 $n$）から空気（屈折率 $1$）への臨界角は $\sin\theta_{c} = \frac{1}{n}$ です。`,
          easy: R`液体中の光源から出る光は、液面にいろいろな角度で当たります。液面に垂直に近い光（入射角が小さい光）は、空気中へ出ていけますが、斜めに寝ている光（入射角が大きい光）は、全反射して外へは出られません。出られるかどうかの境目の入射角が臨界角で、$\sin\theta_{c} = \frac{1}{n}$ です（空気の屈折率は 1）。`
        },
        {
          t: R`光が出ていく円の半径`,
          m: [R`\tan\theta_{c} = \frac{\sin\theta_{c}}{\cos\theta_{c}} = \frac{1/n}{\sqrt{1 - 1/n^{2}}} = \frac{1}{\sqrt{n^{2} - 1}}`,
            R`r = h\tan\theta_{c} = \frac{h}{\sqrt{n^{2} - 1}} = \frac{` + h.toFixed(1) + R`}{\sqrt{` + n.toFixed(2) + R`^{2} - 1}}` + eqTail(rr) + MM,
            R`S = \pi r^{2} = 3.14 \times ` + SV(rr, dig([rr], (x) => 3.14 * x * x)) + R`^{2}` + tailOf(area, [rr]) + R`\,\mathrm{m^{2}}`],
          n: R`光源の真上の点から、半径 $r$ の円の端までの距離は、$r = h\tan\theta_{c}$（直角三角形で、高さ $h$、角 $\theta_{c}$）です。この円の外では、臨界角をこえる光しか届かないので、全反射して空気中に出られません。つまり、液面の上から見ると、光源のまわりに半径 $r$ の円形の明るい部分が見えます。`,
          easy: R`光源から液面に向かう、臨界角の向きの光線を考えると、光源・液面の真上の点・液面でその光線が当たる点、の 3 点で直角三角形ができます。縦が $h$（光源の深さ）、角が $\theta_{c}$ なので、横の長さ（円の半径）は $r = h\tan\theta_{c}$ です。$\tan\theta_{c}$ は、$\sin\theta_{c} = 1/n$ から $\cos\theta_{c} = \sqrt{1 - 1/n^{2}}$ を求めて、$\frac{\sin\theta_{c}}{\cos\theta_{c}}$ で計算します。`,
          pro: R`$r = \frac{h}{\sqrt{n^{2} - 1}}$。水（$n = 1.33$）なら $r \approx 1.14h$。`
        }
      ];
      return {
        title: '液体中の光源と、液面から出ていく光の範囲',
        body: R`液面から深さ $` + h.toFixed(1) + R`\,\mathrm{m}$ の透明な液体中に、点光源 S がある。この液体の屈折率を $` + n.toFixed(2) + R`$、空気の屈折率を $1.00$ とする。液面は平らで、液面から見ると、光源のまわりに円形の明るい部分が見えた。円周率を $\pi = 3.14$ として、次の問いに答えよ。`,
        fig: figWater(n, h),
        parts: [
          { label: '(1)', q: R`液体中から空気へ出る光の臨界角 $\theta_{c}$ について、$\sin\theta_{c}$ の値`, type: 'num', answer: P3(sc), rel: tol.rel },
          { label: '(2)', q: R`明るく見える円の半径 $r$`, type: 'num', answer: P3(rr), rel: tol.rel, unit: 'm' },
          { label: '(3)', q: R`その円の面積 $S$`, type: 'num', answer: P3(area), rel: tol.rel, unit: 'm²' }
        ],
        solution: sol
      };
    }
  });
})();
