/* 物理・波動 — ドップラー効果（unit: p-doppler）
   wave-doppler: 音源・観測者が動くときの振動数（符号の決め方を図と言葉で）
   wave-doppler-reflect: 動く反射板による反射音とうなり */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;

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
  // 問題文に与えた値（入力値）と、その和・差（V − v など）の TeX 表示。10 桁までは正確に書く。
  // 10^-3 未満・10^5 以上は 2.5 \times 10^{-4} の形。途中の値（割り算の結果など）には使わない（SV と dig を使う）
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
  const pn = (x) => (x < 0 ? '(' + nf(x) + ')' : nf(x));          // 負の値はかっこをつけて代入する
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
  // 結果 x の表示。3 桁に丸めると変わる値は、ちょうどの値を添える（316.5 \approx 317）
  const eqTail = (x) => (isExact(x) && !same(rd3(x), x) ? ' = ' + SD(x, 6) + R` \approx ` + sig(x) : ' = ' + sig(x));
  // 結果 x の表示。項 xs がどれもちょうど書ける値なら、ちょうどの値も添える。丸めた項を使うときは、表示した項の計算結果が
  // 3 桁で x と一致するので、3 桁の結果だけを書く
  const tailOf = (x, xs) => (xs.every(isExact) ? eqTail(x) : ' = ' + sig(x));
  const MS = R`\,\mathrm{m/s}`, MM = R`\,\mathrm{m}`, SEC = R`\,\mathrm{s}`, HZ = R`\,\mathrm{Hz}`;
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const nice = (x, d) => Math.abs(x * Math.pow(10, d) - Math.round(x * Math.pow(10, d))) < 1e-7;
  // 有効数字 3 桁でちょうど表せるか（解説に 3 桁で書く数値どうしの筆算が、丸め誤差なしで合う）
  const ok3 = (x) => Math.abs(P3(x) - x) <= 1e-9 * Math.abs(x);
  // 候補を「音速・速さ・向き」などの設定ごとにまとめ、設定を等確率で選んでから、その中の 1 つ（振動数が違う例）を選ぶ。
  // 候補の多い設定（振動数だけ違う例が並ぶもの）に偏らず、音速や速さも毎回変わる
  function pickBy(rng, cands, keyOf) {
    const groups = {}, keys = [];
    cands.forEach((c) => {
      const k = keyOf(c);
      if (!groups[k]) { groups[k] = []; keys.push(k); }
      groups[k].push(c);
    });
    return rng.pick(groups[rng.pick(keys)]);
  }

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
  const sgn = (x) => (x > 0 ? '+' + pl(x) : (x < 0 ? '−' + pl(-x) : '0'));

  /* =====================================================================
     ドップラー効果
     ===================================================================== */
  // smode / omode: 'rest' | 'toward' | 'away'。S → O を正の向きとして、速度の成分 us, uo に直す。
  function solveDop(f, V, smode, vs, omode, vo) {
    const r = { f: f, V: V, smode: smode, omode: omode };
    r.vs = smode === 'rest' ? 0 : vs;
    r.vo = omode === 'rest' ? 0 : vo;
    r.us = smode === 'toward' ? r.vs : (smode === 'away' ? -r.vs : 0);       // 音源: 観測者に近づく向きが正
    r.uo = omode === 'away' ? r.vo : (omode === 'toward' ? -r.vo : 0);       // 観測者: 音源から遠ざかる向きが正
    r.den = V - r.us;
    r.num = V - r.uo;
    r.fp = f * r.num / r.den;
    r.lamp = r.den / f;                                   // 音源と観測者の間の波長
    r.Vrel = r.num;                                       // 観測者に対する音の速さ
    r.df = r.fp - f;
    return r;
  }

  const modeSJa = { rest: '静止している', toward: '観測者に近づく向きに', away: '観測者から遠ざかる向きに' };
  const modeOJa = { rest: '静止している', toward: '音源に近づく向きに', away: '音源から遠ざかる向きに' };

  function figDop(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 218 : 262);
    const sx = 96, ox = 290, y0 = 104;
    const ratio = r.us / r.V;
    for (let k = 1; k <= 4; k++) {
      const Rk = 16 * k;
      d.circle(sx - ratio * Rk, y0, Rk, { cls: 'c1', w: 1.2 });
    }
    d.circle(sx, y0, 8, { cls: 'fg', fill: 'f3' });
    d.text(sx, y0 + 26, 'S（音源）', { size: 12 });
    d.circle(ox, y0, 8, { cls: 'fg', fill: 'f2' });
    d.text(ox, y0 + 26, 'O（観測者）', { size: 12 });
    if (r.smode !== 'rest') {
      const dir = r.smode === 'toward' ? 1 : -1;
      d.arrow(sx, y0 - 16, sx + dir * 46, y0 - 16, { cls: 'c3', label: 'v_s', lpos: dir > 0 ? 1 : -1, w: 2.2 });
    }
    if (r.omode !== 'rest') {
      const dir = r.omode === 'away' ? 1 : -1;
      d.arrow(ox, y0 - 16, ox + dir * 46, y0 - 16, { cls: 'c2', label: 'v_o', lpos: dir > 0 ? 1 : -1, w: 2.2 });
    }
    d.arrow(176, 30, 340, 30, { cls: 'c4', w: 1.8 });
    d.text(258, 18, '正の向き（音源 S → 観測者 O）', { cls: 'c4', size: 12 });
    d.text(180, 186, 'f = ' + pl(r.f) + ' Hz　V = ' + pl(r.V) + ' m/s', { size: 12 });
    d.text(180, 204, 'S: ' + modeSJa[r.smode] + (r.smode === 'rest' ? '' : ' ' + pl(r.vs) + ' m/s') + '　O: ' + modeOJa[r.omode] + (r.omode === 'rest' ? '' : ' ' + pl(r.vo) + ' m/s'), { cls: 'dim', size: 11 });
    if (!prob) {
      d.text(180, 224, 'v_s の成分 = ' + sgn(r.us) + ' m/s　v_o の成分 = ' + sgn(r.uo) + ' m/s', { cls: 'dim', size: 11 });
      d.text(180, 248, "f′ = " + pl(r.fp) + ' Hz（' + (r.fp > r.f * (1 + 1e-12) ? '高く聞こえる' : (r.fp < r.f * (1 - 1e-12) ? '低く聞こえる' : '変わらない')) + '）', { cls: 'c3', size: 13, bold: true });
    }
    return d.svg();
  }

  // opt.lvCheck: 演習で波長 λ′ を問うとき（波長を求めるステップを lv 1 にする）
  function dopSteps(r, opt) {
    opt = opt || {};
    const steps = [];
    steps.push({
      t: '符号の決め方（図の約束）',
      n: R`音源 S から観測者 O に向かう向きを**正**とします。音速 $V$ は、波が S から O へ進む向きなので、いつも正の値です。音源の速度 $v_{s}$ と観測者の速度 $v_{o}$ は、この正の向きの**成分**で表します。すなわち、**音源が O に近づく向きに動くとき $v_{s} > 0$**、遠ざかるとき $v_{s} < 0$、**観測者が S から遠ざかる向きに動くとき $v_{o} > 0$**、近づくとき $v_{o} < 0$ です。この問題では、$v_{s} = ` + sgn(r.us) + R`\,\mathrm{m/s}$、$v_{o} = ` + sgn(r.uo) + R`\,\mathrm{m/s}$ です。`,
      easy: R`救急車のサイレンは、近づいてくるときは高く、遠ざかるときは低く聞こえます。これが**ドップラー効果**です。計算で迷いやすいのが「向き（符号）」なので、先に約束を決めます。「音源 S → 観測者 O」の向き（音が進む向き）を**正**とします。音源が観測者に向かって走るなら正、逆に離れるなら負。観測者の場合は、音と同じ向き（音源から遠ざかる向き）に動くなら正、音に向かって動く（音源に近づく）なら負です。音源と観測者で、「近づく」の符号が逆になる点に注意してください。`,
      pro: R`「S → O を正」と決め、$v_{s}$, $v_{o}$ をその向きの成分（符号つき）で代入すれば、近づく・遠ざかるの場合分けが不要。`
    });
    steps.push({
      t: 'ドップラー効果の公式',
      m: [R`f' = \frac{V - v_{o}}{V - v_{s}}\,f`],
      n: R`音源が動くと、音源の前（観測者側）で**波長が $\lambda' = \frac{V - v_{s}}{f}$ に変わり**（近づくと縮む）、観測者が動くと、観測者から見た**音の速さが $V' = V - v_{o}$ に変わり**ます（近づくと速くなる）。観測される振動数は $f' = \frac{V'}{\lambda'}$ で、上の式になります。`,
      easy: R`音源が近づくと、波は「押しつぶされて」波長が短くなります（つぎの波が出る前に、音源が前に進んでいるため）。波長が短いと、1 秒間に耳に入る波の数が増えて、高く聞こえます。観測者が音源に近づくと、波に向かって進むので、波と出会う回数が増えて、これも高く聞こえます。この 2 つの効果をあわせた式が $f' = \frac{V - v_{o}}{V - v_{s}} f$ です。分母が音源の効果（波長）、分子が観測者の効果（音の見かけの速さ）です。`,
      pro: R`分母は「音源（波長）」、分子は「観測者（見かけの音速）」。近づく側の符号で、分母は小さく（$v_{s} > 0$）、分子は大きく（$v_{o} < 0$）なって $f'$ は高くなる。`
    });
    steps.push({
      t: '符号つきで代入して計算する',
      m: [R`f' = \frac{V - v_{o}}{V - v_{s}}\,f = \frac{` + nf(r.V) + ' - ' + pn(r.uo) + '}{' + nf(r.V) + ' - ' + pn(r.us) + R`} \times ` + nf(r.f),
        R`f' = \frac{` + nf(r.num) + '}{' + nf(r.den) + R`} \times ` + nf(r.f) + eqTail(r.fp) + HZ],
      n: R`$V = ` + nf(r.V) + R`\,\mathrm{m/s}$、$v_{s} = ` + sgn(r.us) + R`\,\mathrm{m/s}$、$v_{o} = ` + sgn(r.uo) + R`\,\mathrm{m/s}$ を代入します。` + (r.fp > r.f * (1 + 1e-12) ? R`$f' > f$ なので、**元の音より高く**聞こえます。` : (r.fp < r.f * (1 - 1e-12) ? R`$f' < f$ なので、**元の音より低く**聞こえます。` : R`$f' = f$ なので、音の高さは**変わりません**。`)),
      easy: R`符号に気をつけて、$V$、$v_{s}$、$v_{o}$ の値を式に入れます。マイナスの値は、かっこをつけて代入すると計算ミスを防げます。$v_{s} = 0$（音源が静止）や $v_{o} = 0$（観測者が静止）のときは、その部分は $V - 0 = V$ になって、効果がなくなります。計算した $f'$ が元の $f$ より大きければ「高く」、小さければ「低く」聞こえます。`
    });
    steps.push({
      t: opt.lvCheck ? R`(2) 音源と観測者の間での波長 $\lambda'$ と、見かけの音速` : '波長と見かけの音速で確かめる',
      m: [R`\lambda' = \frac{V - v_{s}}{f} = \frac{` + nf(r.den) + '}{' + nf(r.f) + '}' + eqTail(r.lamp) + MM,
        R`V' = V - v_{o} = ` + nf(r.V) + ' - ' + pn(r.uo) + ' = ' + nf(r.Vrel) + MS,
        R`f' = \frac{V'}{\lambda'} = \frac{` + nf(r.Vrel) + '}{' + SV(r.lamp, dig([r.lamp], (l) => r.Vrel / l)) + '}' + tailOf(r.Vrel / r.lamp, [r.lamp]) + HZ],
      n: R`音源が出す波の波長は $\frac{V}{f}$ ですが、音源が動くと、観測者側では $\lambda' = \frac{V - v_{s}}{f}$ に変わります。観測者から見た音の速さは $V' = V - v_{o}$ です。$f' = \frac{V'}{\lambda'}$ から同じ値が得られます。`,
      lv: opt.lvCheck ? 1 : 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'wave-doppler',
    field: '波動',
    unit: 'p-doppler',
    title: 'ドップラー効果（音源・観測者の運動）',
    desc: R`音源 S と観測者 O が、一直線上を動くときに観測される音の振動数 $f'$ を求めます。「近づく / 遠ざかる / 静止」を選ぶだけで、符号の約束（S → O を正）にもとづいて公式に代入し、波面の様子を図に描きます。`,
    form: [R`f' = \frac{V - v_{o}}{V - v_{s}}\,f`, R`\lambda' = \frac{V - v_{s}}{f},\qquad V' = V - v_{o}`],
    inputs: [
      { key: 'f', label: '音源の振動数 f', unit: 'Hz', type: 'num', def: '440', min: 1, max: 1000000 },
      { key: 'V', label: '音の速さ V', unit: 'm/s', type: 'num', def: '340', min: 1, max: 100000 },
      { key: 'smode', label: '音源の運動', type: 'select', def: 'toward', options: [['rest', '静止'], ['toward', '観測者に近づく向きに動く'], ['away', '観測者から遠ざかる向きに動く']] },
      { key: 'vs', label: '音源の速さ vₛ', unit: 'm/s', type: 'num', def: '20', min: 0, max: 100000, show: (raw) => raw.smode !== 'rest' },
      { key: 'omode', label: '観測者の運動', type: 'select', def: 'rest', options: [['rest', '静止'], ['toward', '音源に近づく向きに動く'], ['away', '音源から遠ざかる向きに動く']] },
      { key: 'vo', label: '観測者の速さ vₒ', unit: 'm/s', type: 'num', def: '10', min: 0, max: 100000, show: (raw) => raw.omode !== 'rest' }
    ],
    examples: [
      { label: '救急車が近づく（音源が近づく）', v: { f: '440', V: '340', smode: 'toward', vs: '20', omode: 'rest', vo: '10' } },
      { label: '救急車が遠ざかる', v: { f: '440', V: '340', smode: 'away', vs: '20', omode: 'rest', vo: '10' } },
      { label: '観測者が音源に近づく', v: { f: '680', V: '340', smode: 'rest', vs: '20', omode: 'toward', vo: '17' } },
      { label: '両方が近づき合う', v: { f: '500', V: '340', smode: 'toward', vs: '20', omode: 'toward', vo: '10' } },
      { label: '同じ向きに追いかける', v: { f: '500', V: '340', smode: 'toward', vs: '30', omode: 'away', vo: '20' } }
    ],
    intro: {
      easy: R`救急車が近づくと音が高く、遠ざかると低く聞こえます。これが**ドップラー効果**です。音源が近づくと、波がおしつぶされて**波長が短く**なり、観測者が近づくと、波と出会う回数が増えて、どちらも**高く**聞こえます。計算では、まず「音源 S → 観測者 O」の向きを**正**と決めて、$v_{s}$（音源が O に近づくなら正）と $v_{o}$（観測者が S から遠ざかるなら正）を、符号つきで $f' = \frac{V - v_{o}}{V - v_{s}} f$ に代入します。近づく・遠ざかるの場合分けを自分で考えなくても、符号が自動でそろうのがこの方法のよいところです。`,
      normal: R`$f' = \frac{V - v_{o}}{V - v_{s}} f$（$V$: 音速。S → O を正の向きとし、$v_{s}$, $v_{o}$ をその向きの成分とする）。分母が音源の効果（波長 $\lambda' = \frac{V - v_{s}}{f}$）、分子が観測者の効果（見かけの音速 $V - v_{o}$）。`,
      pro: R`「S → O を正、$v_{s}$, $v_{o}$ は符号つき」で一括処理するのが定石。音源の速さが $V$ をこえる場合（衝撃波）は式が使えない。風が吹く場合は $V$ を「$V \pm$ 風速」に置きかえる。`
    },
    compute(v) {
      const r = solveDop(v.f, v.V, v.smode, v.vs, v.omode, v.vo);
      if (!(r.den > 0)) {
        throw new JK.CalcError('音源の速さが音速以上のため、この式は使えません（音源の速さ vₛ は音速 V より小さくしてください）。');
      }
      if (!(r.num > 0)) {
        throw new JK.CalcError('観測者が音と同じ向きに音速以上で遠ざかるため、音が追いつきません。観測者の速さ vₒ を音速 V より小さくしてください。');
      }
      return {
        result: [
          { label: '観測される振動数 f′', tex: sig(r.fp) + HZ },
          { label: '振動数の変化 f′ − f', tex: sig(r.df) + HZ },
          { label: '観測者側の波長 λ′ = (V − vₛ)/f', tex: sig(r.lamp) + MM },
          { label: '観測者から見た音の速さ V′ = V − vₒ', tex: sig(r.Vrel) + MS },
          { label: '聞こえ方', tex: r.fp > r.f * (1 + 1e-12) ? R`\text{高くなる}` : (r.fp < r.f * (1 - 1e-12) ? R`\text{低くなる}` : R`\text{変わらない}`) }
        ],
        steps: dopSteps(r),
        fig: figDop(r)
      };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      const fs = [400, 440, 500, 600, 680, 800, 850, 1000];
      const dirJa = (m, who) => (who === 's' ? (m === 'toward' ? '観測者に近づきながら' : '観測者から遠ざかりながら') : (m === 'toward' ? '音源に近づきながら' : '音源から遠ざかりながら'));
      const cands = [];
      if (level === 'basic') {
        // 音速 V は 330・340・350 m/s から選び、問題文に明記する。f'（小数 1 桁）と λ'（小数 3 桁）がちょうど表せる
        // (音速, 速さ, 向き, 振動数) の組だけを候補にし、設定（音速・速さ・向き）を等確率で選んでから振動数を選ぶ
        [330, 340, 350].forEach((V) => [400, 440, 450, 500, 550, 600, 680, 700, 750, 800, 850, 900, 1000].forEach((f) => [10, 15, 17, 20, 25, 30, 34, 40, 50, 68, 85].forEach((vs) => ['toward', 'away'].forEach((sm) => {
          const r = solveDop(f, V, sm, vs, 'rest', 0);
          if (nice(r.fp, 1) && nice(r.lamp, 3)) cands.push(r);
        }))));
        const r = pickBy(rng, cands, (c) => c.V + '/' + c.vs + '/' + c.smode);
        return {
          title: '近づく（遠ざかる）音源の音',
          body: R`静止している観測者に向かって、一直線上を、音源が速さ $` + r.vs.toFixed(0) + R`\,\mathrm{m/s}$ で` + (r.smode === 'toward' ? '近づいてくる' : '遠ざかっていく') + R`。音源は振動数 $` + r.f.toFixed(0) + R`\,\mathrm{Hz}$ の音を出し続けている。音の速さを $` + nf(r.V) + R`\,\mathrm{m/s}$ として、次の問いに答えよ。`,
          fig: figDop(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`観測者に聞こえる音の振動数 $f'$`, type: 'num', answer: P3(r.fp), rel: tol.rel, unit: 'Hz' },
            { label: '(2)', q: R`観測者に届く音の波長 $\lambda'$（音源と観測者の間での波長）`, type: 'num', answer: P3(r.lamp), rel: tol.rel, unit: 'm' }
          ],
          solution: dopSteps(r, { lvCheck: true })       // (2) の波長を求めるステップを lv 1 にする
        };
      }
      if (level === 'mid') {
        fs.forEach((f) => [10, 17, 20, 30, 34].forEach((vs) => [10, 17, 20, 34].forEach((vo) => ['toward', 'away'].forEach((sm) => ['toward', 'away'].forEach((om) => {
          const r = solveDop(f, 340, sm, vs, om, vo);
          if (r.den > 0 && r.num > 0 && nice(r.fp, 1) && nice(r.lamp, 3) && Math.abs(r.fp - f) > 8) cands.push(r);
        })))));
        const r = rng.pick(cands);
        return {
          title: '音源も観測者も動くとき',
          body: R`一直線上を、音源が観測者` + (r.smode === 'toward' ? 'に近づく向き' : 'から遠ざかる向き') + R`に速さ $` + r.vs.toFixed(0) + R`\,\mathrm{m/s}$ で動き、観測者は` + (r.omode === 'toward' ? '音源に近づく向き' : '音源から遠ざかる向き') + R`に速さ $` + r.vo.toFixed(0) + R`\,\mathrm{m/s}$ で動いている。音源は振動数 $` + r.f.toFixed(0) + R`\,\mathrm{Hz}$ の音を出している。音の速さを $340\,\mathrm{m/s}$ として、次の問いに答えよ。`,
          fig: figDop(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`音源と観測者の間での、音の波長 $\lambda'$`, type: 'num', answer: P3(r.lamp), rel: tol.rel, unit: 'm' },
            { label: '(2)', q: R`観測者から見た、音の速さ $V'$`, type: 'num', answer: P3(r.Vrel), rel: tol.rel, unit: 'm/s' },
            { label: '(3)', q: R`観測者に聞こえる音の振動数 $f'$`, type: 'num', answer: P3(r.fp), rel: tol.rel, unit: 'Hz' }
          ],
          // 設問の順（(1) 波長 λ′ → (2) 見かけの音速 V′ → (3) 振動数 f′ = V′/λ′）に合わせる
          solution: (() => {
            const g = dopSteps(r);
            const hl = r.fp > r.f * (1 + 1e-12) ? R`$f' > f$ なので、**元の音より高く**聞こえます。` : (r.fp < r.f * (1 - 1e-12) ? R`$f' < f$ なので、**元の音より低く**聞こえます。` : R`$f' = f$ なので、音の高さは**変わりません**。`);
            return [g[0], g[1], {
              t: R`(1) 音源と観測者の間での音の波長 $\lambda'$`,
              m: [R`\lambda' = \frac{V - v_{s}}{f} = \frac{` + nf(r.V) + ' - ' + pn(r.us) + '}{' + nf(r.f) + '} = \\frac{' + nf(r.den) + '}{' + nf(r.f) + '}' + eqTail(r.lamp) + MM],
              n: R`$V = ` + nf(r.V) + R`\,\mathrm{m/s}$、$v_{s} = ` + sgn(r.us) + R`\,\mathrm{m/s}$ を代入します。音源が観測者に近づく向きに動くと（$v_{s} > 0$）、観測者側に出た波は縮んで波長が短くなり、遠ざかる向きに動くと（$v_{s} < 0$）、伸びて波長が長くなります。観測者側の波長は $\lambda' = \frac{V - v_{s}}{f}$ です。`,
              easy: R`音源が動くと、音の波は「押しつぶされたり」「引き伸ばされたり」します。音源が観測者に近づくときは波が縮んで波長が短く、遠ざかるときは伸びて長くなります。波長は、音が $1$ 回の振動のあいだに進む距離（音源が動いたぶんを差し引いた長さ）で、$\lambda' = \frac{V - v_{s}}{f}$ です。`
            }, {
              t: R`(2) 観測者から見た音の速さ $V'$`,
              m: [R`V' = V - v_{o} = ` + nf(r.V) + ' - ' + pn(r.uo) + eqTail(r.Vrel) + MS],
              n: R`$V = ` + nf(r.V) + R`\,\mathrm{m/s}$、$v_{o} = ` + sgn(r.uo) + R`\,\mathrm{m/s}$ を代入します。観測者が音源に近づく向きに動くと（$v_{o} < 0$）、見かけの音の速さは大きくなり、音源から遠ざかる向きに動くと（$v_{o} > 0$）、小さくなります。`,
              easy: R`観測者が動くと、音の波に出会う速さが変わります。音に向かって進めば波とすれちがう速さが増え、音と同じ向きに逃げれば減ります。この「観測者から見た音の速さ」が $V' = V - v_{o}$ です。`
            }, {
              t: R`(3) 観測者に聞こえる音の振動数 $f'$`,
              m: [R`f' = \frac{V'}{\lambda'} = \frac{` + nf(r.Vrel) + '}{' + SV(r.lamp, dig([r.lamp], (l) => r.Vrel / l)) + '}' + tailOf(r.Vrel / r.lamp, [r.lamp]) + HZ,
                R`f' = \frac{V - v_{o}}{V - v_{s}}\,f = \frac{` + nf(r.num) + '}{' + nf(r.den) + R`} \times ` + nf(r.f) + eqTail(r.fp) + HZ],
              n: R`観測される振動数は、見かけの音の速さ $V'$ を波長 $\lambda'$ で割った $f' = \frac{V'}{\lambda'}$ です。公式 $f' = \frac{V - v_{o}}{V - v_{s}}f$ に代入しても同じ値になります。` + hl,
              easy: R`1 秒間に耳に入る波の数が、聞こえる音の振動数です。波に出会う速さ $V'$ を、波 1 つぶんの長さ $\lambda'$ で割ると、1 秒間に出会う波の数 $f' = \frac{V'}{\lambda'}$ が出ます。` + hl
            }];
          })()
        };
      }
      // adv: 音源が静止した観測者の前を通り過ぎる（近づく側と遠ざかる側）。
      // 音速 V・音源の速さ vs・振動数 f の組のうち、f'・f''・f' − f'' が 3 桁でちょうど表せるものだけを候補にする
      [330, 340, 350].forEach((V) => [10, 15, 17, 20, 22, 25, 30, 34, 40].forEach((vs) => {
        for (let f = 250; f <= 1000; f += 5) {
          const ra = solveDop(f, V, 'toward', vs, 'rest', 0), rb = solveDop(f, V, 'away', vs, 'rest', 0);
          if (ra.fp < 1000 && ok3(ra.fp) && ok3(rb.fp) && ok3(ra.fp - rb.fp)) cands.push([ra, rb]);
        }
      }));
      const pr = pickBy(rng, cands, (c) => c[0].V), ra = pr[0], rb = pr[1];
      const sol = dopSteps(ra).slice(0, 3).concat([{
        t: '遠ざかるとき（通り過ぎた後）',
        m: [R`v_{s} = -` + nf(rb.vs) + R`\,\mathrm{m/s}\ \ (\text{O から遠ざかる向き}),\qquad f'' = \frac{V}{V - v_{s}}\,f = \frac{` + nf(rb.V) + '}{' + nf(rb.V) + ' - (-' + nf(rb.vs) + R`)} \times ` + nf(rb.f) + ' = ' + sig(rb.fp) + HZ,
          R`f' - f'' = ` + sig(ra.fp) + ' - ' + sig(rb.fp) + ' = ' + sig(ra.fp - rb.fp) + HZ],
        n: R`音源が通り過ぎたあとは、音源が観測者から遠ざかるので、$v_{s} = -` + nf(rb.vs) + R`\,\mathrm{m/s}$ と負の値を代入します。分母が $V - v_{s} = V + ` + nf(rb.vs) + R`$ と大きくなるので、$f'' < f$ になります。通り過ぎる前の音（$f'$）と後の音（$f''$）の差が、通り過ぎる瞬間に聞こえる音の高さの変化です。`,
        easy: R`救急車が自分の前を通り過ぎると、サイレンの音が急に低くなるのが聞こえます。通り過ぎる前は音源が「近づく」ので $v_{s}$ は正、通り過ぎた後は「遠ざかる」ので $v_{s}$ は負です。同じ式に、符号だけ変えて代入すれば、両方が求まります。観測者は静止しているので、$v_{o} = 0$ です。`,
        lv: 1
      }]);
      return {
        title: '通り過ぎる音源の音の変化',
        body: R`直線の道路ぞいに静止している観測者の前を、振動数 $` + ra.f.toFixed(0) + R`\,\mathrm{Hz}$ のサイレンを鳴らした救急車が、一定の速さ $` + ra.vs.toFixed(0) + R`\,\mathrm{m/s}$ で近づいてきて、観測者の前を通り過ぎて遠ざかっていった。道路は一直線で、音の速さは $` + nf(ra.V) + R`\,\mathrm{m/s}$ である。次の問いに答えよ。`,
        fig: figDop(ra, { problem: true }),
        parts: [
          { label: '(1)', q: R`救急車が近づいてくるときに聞こえる音の振動数 $f'$`, type: 'num', answer: P3(ra.fp), rel: tol.rel, unit: 'Hz' },
          { label: '(2)', q: R`救急車が通り過ぎて遠ざかるときに聞こえる音の振動数 $f''$`, type: 'num', answer: P3(rb.fp), rel: tol.rel, unit: 'Hz' },
          { label: '(3)', q: R`通り過ぎる前後での振動数の差 $f' - f''$`, type: 'num', answer: P3(ra.fp - rb.fp), rel: tol.rel, unit: 'Hz' }
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     動く反射板とうなり
     ===================================================================== */
  function solveReflect(f, V, u, dir) {
    const r = { f: f, V: V, u: u, dir: dir };
    // S → 壁を正。壁の速度成分: 近づく壁は -u、遠ざかる壁は +u
    r.uw = dir === 'toward' ? -u : u;
    r.f1 = f * (V - r.uw) / V;                           // 壁（観測者）が受ける振動数
    r.f2 = r.f1 * V / (V + r.uw);                        // 壁（音源）から出る音を、静止した観測者が受ける。壁→S を正とすると壁の速度成分は -uw
    r.beat = Math.abs(r.f2 - f);
    r.Tb = r.beat > 0 ? 1 / r.beat : Infinity;
    return r;
  }

  // 演習 basic・mid 用の候補: 解説に出る f₁・f₂・うなりの回数が 3 桁でちょうど表せる (音速 V, 壁の速さ u, 向き, 振動数 f)
  let reflectCache = null;
  function reflectCands() {
    if (reflectCache) return reflectCache;
    const out = [];
    [330, 340, 350].forEach((V) => {
      for (let u = 10; u <= 45; u++) {
        ['toward', 'away'].forEach((dr) => {
          for (let f = 200; f <= 900; f += 5) {
            const r = solveReflect(f, V, u, dr);
            if (r.f1 < 1000 && r.f2 < 1000 && r.beat >= 5 && r.beat <= 100 && ok3(r.f1) && ok3(r.f2) && ok3(r.beat)) out.push(r);
          }
        });
      }
    });
    reflectCache = out;
    return out;
  }

  function figReflect(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 214 : 262);
    const sx = 54, wx = 276, y0 = 90;
    d.circle(sx, y0, 9, { cls: 'fg', fill: 'f3' });
    d.text(sx, y0 + 28, 'S（音源・観測者）', { size: 11 });
    d.rect(wx, y0 - 52, 12, 104, { cls: 'fg', fill: 'f0' });
    d.hatch(wx + 12, y0 - 52, wx + 12, y0 + 52, { side: -1 });
    d.text(wx + 6, y0 - 60, '反射板', { size: 12 });
    const dir = r.dir === 'toward' ? -1 : 1;
    d.arrow(wx - 4, y0 + 66, wx - 4 + dir * 46, y0 + 66, { cls: 'c3', label: 'u', lpos: dir > 0 ? 1 : -1, w: 2.2 });
    d.arrow(sx + 14, y0 - 16, wx - 8, y0 - 16, { cls: 'c1', w: 2 });
    d.text((sx + wx) / 2, y0 - 24, prob ? 'f（音源の音）' : 'f → 壁が受ける音 f₁', { cls: 'c1', size: 11 });
    d.arrow(wx - 8, y0 + 12, sx + 14, y0 + 12, { cls: 'c2', w: 2 });
    d.text((sx + wx) / 2, y0 + 30, prob ? '反射音' : '反射音 f₂', { cls: 'c2', size: 11 });
    d.text(180, 190, 'f = ' + pl(r.f) + ' Hz　V = ' + pl(r.V) + ' m/s', { size: 12 });
    d.text(180, 208, '反射板の速さ u = ' + pl(r.u) + ' m/s（' + (r.dir === 'toward' ? '音源に近づく' : '音源から遠ざかる') + '）', { cls: 'dim', size: 11 });
    if (!prob) {
      d.text(180, 232, 'f₁ = ' + pl(r.f1) + ' Hz　f₂ = ' + pl(r.f2) + ' Hz', { size: 12 });
      d.text(180, 254, 'うなり ' + pl(r.beat) + ' 回/秒（' + pl(r.f) + ' Hz と ' + pl(r.f2) + ' Hz の差）', { cls: 'c3', size: 12, bold: true });
    }
    return d.svg();
  }

  // opt.noBeat: 演習で、うなりを問わないとき（うなりのステップを lv 2 にする）
  function reflectSteps(r, opt) {
    opt = opt || {};
    const tw = r.dir === 'toward';
    const steps = [];
    steps.push({
      t: '考え方（2 段階のドップラー効果）',
      n: R`静止した音源 S と観測者（S の位置にいる）の前方に、速さ $u = ` + nf(r.u) + R`\,\mathrm{m/s}$ で` + (tw ? R`近づく` : R`遠ざかる`) + R`反射板があります。反射音は、次の 2 段階で考えます。**(1) 反射板が「動く観測者」として、S の音（$f$）を受け取る** → 受けた振動数 $f_{1}$。**(2) 反射板が「動く音源」として、$f_{1}$ の音を出し、静止した観測者が受ける** → 振動数 $f_{2}$。直接聞こえる音（$f$）と反射音（$f_{2}$）の振動数がちがうので、**うなり**が聞こえます。`,
      easy: R`壁にぶつかってはね返る音を考えます。壁が動いていると、壁は「音を受け取る観測者」であると同時に、「音をはね返す新しい音源」にもなります。そこで、ドップラー効果を 2 回使います。1 回目は「壁が動く観測者」として、受け取る音の高さ $f_{1}$ を求めます。2 回目は、壁を「$f_{1}$ の音を出す、動く音源」と考えて、自分（静止）に届く音の高さ $f_{2}$ を求めます。もとの音 $f$ と反射音 $f_{2}$ が重なると、わずかな振動数のちがいで、「ウォンウォン」という**うなり**が聞こえます。`,
      pro: R`反射板は「動く観測者 → 動く音源」の 2 段階。求める式は、壁が近づくとき $f_{2} = \frac{V + u}{V - u}f$、遠ざかるとき $f_{2} = \frac{V - u}{V + u}f$ の形。`
    });
    steps.push({
      t: '(1) 反射板が受ける音の振動数 $f_{1}$',
      m: [R`\text{S → 壁を正。壁（観測者）の速度成分: } v_{o} = ` + (tw ? '-' : '+') + nf(r.u) + R`\,\mathrm{m/s}`,
        R`f_{1} = \frac{V - v_{o}}{V}\,f = \frac{` + nf(r.V) + (tw ? ' + ' : ' - ') + nf(r.u) + '}{' + nf(r.V) + R`} \times ` + nf(r.f) + ' = ' + sig(r.f1) + HZ],
      n: R`S → 壁の向きを正とすると、音源 S は静止（$v_{s} = 0$）で、観測者（壁）の速度成分は、` + (tw ? R`近づくので負（$-u$）` : R`遠ざかるので正（$+u$）`) + R`です。$f' = \frac{V - v_{o}}{V - v_{s}}f$ に代入して $f_{1}$ が求まります。` + (tw ? R`壁が近づくので、音を受ける回数が増え、$f_{1} > f$ です。` : R`壁が遠ざかるので、音を受ける回数が減り、$f_{1} < f$ です。`),
      easy: R`1 回目は、壁を「音を受け取る観測者」と考えます。` + (tw ? R`壁が音源に近づいてくるので、壁は音の波と出会う回数が増えます。だから、壁が受け取る音は、もとの音より高くなります（$f_{1} > f$）。` : R`壁が音源から遠ざかっていくので、壁は音の波と出会う回数が減ります。だから、壁が受け取る音は、もとの音より低くなります（$f_{1} < f$）。`)
    });
    steps.push({
      t: '(2) 反射音の振動数 $f_{2}$',
      m: [R`\text{壁 → S を正。壁（音源）の速度成分: } v_{s} = ` + (tw ? '+' : '-') + nf(r.u) + R`\,\mathrm{m/s}`,
        // f₁ は途中の値。表示した f₁ で計算し直して結果と合う桁数で書く
        R`f_{2} = \frac{V}{V - v_{s}}\,f_{1} = \frac{` + nf(r.V) + '}{' + nf(r.V) + (tw ? ' - ' : ' + ') + nf(r.u) + R`} \times ` + SV(r.f1, dig([r.f1], (f1) => f1 * r.V / (r.V + r.uw))) + tailOf(r.f2, [r.f1]) + HZ,
        R`f_{2} = \frac{V ` + (tw ? '+' : '-') + ' u}{V ' + (tw ? '-' : '+') + R` u}\,f`],
      n: R`こんどは、壁が振動数 $f_{1}$ の音を出す音源になります。向きは「壁 → S（観測者）」を正にとり直すので、壁の速度成分は、` + (tw ? R`S に近づくので正（$+u$）` : R`S から遠ざかるので負（$-u$）`) + R`です。観測者 S は静止（$v_{o} = 0$）です。$f_{2} = \frac{V}{V - v_{s}} f_{1}$ です。2 段階をまとめると $f_{2} = \frac{V` + (tw ? '+' : '-') + R`u}{V` + (tw ? '-' : '+') + R`u}f$ となります。`,
      easy: R`2 回目は、壁を「音源」とみなして、$f_{1}$ の音を出していると考えます。向きを決め直す（壁から S へ向かう向きを正にする）ことを忘れないでください。` + (tw ? R`壁は S に近づきながら音を出すので、波長が縮んで、さらに高い音（$f_{2} > f_{1}$）になります。` : R`壁は S から遠ざかりながら音を出すので、波長が伸びて、さらに低い音（$f_{2} < f_{1}$）になります。`),
      pro: R`$f_{2} = \frac{V + u}{V - u}f$（壁が近づく）、$\frac{V - u}{V + u}f$（遠ざかる）。$u$ が $V$ にくらべて十分小さければ $f_{2} - f \approx \pm\frac{2u}{V}f$。`
    });
    steps.push({
      t: 'うなりの振動数',
      m: [R`n = |f_{2} - f| = |` + SV(r.f2, dig([r.f2], (f2) => Math.abs(f2 - r.f))) + ' - ' + nf(r.f) + '|' + tailOf(r.beat, [r.f2]) + R`\,\text{回/秒}`,
        R`T_{\text{うなり}} = \frac{1}{n} = ` + (r.beat > 0 ? R`\frac{1}{` + SV(r.beat, dig([r.beat], (b) => 1 / b)) + '}' + tailOf(r.Tb, [r.beat]) + SEC : R`\text{（うなりなし）}`)],
      n: R`振動数がわずかにちがう 2 つの音（$f$ と $f_{2}$）が重なると、音が大きくなったり小さくなったりをくり返します。これが**うなり**で、1 秒あたりの回数は $n = |f_{2} - f|$ です。`,
      easy: R`振動数がほんの少しだけちがう 2 つの音を同時に鳴らすと、「ウォーン、ウォーン」と音の大きさが周期的に変わって聞こえます。これがうなりです。1 秒間に聞こえるうなりの回数は、2 つの振動数の差（引き算）に等しくなります。たとえば、$440\,\mathrm{Hz}$ と $444\,\mathrm{Hz}$ なら、1 秒間に 4 回です。`,
      pro: R`うなりの回数 $= |f_{2} - f|$（直接音と反射音の差。$f_{1}$ は壁が受ける音で、うなりには直接関係しない）。反射板の速さ $u$ が分かればうなりが、逆にうなりから $u = V\frac{f_{2} - f}{f_{2} + f}$（近づく場合）が求まる。`,
      lv: opt.noBeat ? 2 : 1
    });
    steps.push({
      t: '2 段階をまとめた式で確かめる',
      m: [R`f_{2} = \frac{V ` + (tw ? '+' : '-') + ' u}{V ' + (tw ? '-' : '+') + R` u}\,f = \frac{` + nf(r.V) + (tw ? ' + ' : ' - ') + nf(r.u) + '}{' + nf(r.V) + (tw ? ' - ' : ' + ') + nf(r.u) + R`} \times ` + nf(r.f) + ' = ' + sig(r.f2) + HZ],
      n: R`2 段階の計算をまとめた式 $f_{2} = \frac{V ` + (tw ? '+' : '-') + R` u}{V ` + (tw ? '-' : '+') + R` u}f$ に、はじめから数値を代入しても、同じ $f_{2}$ が得られます。計算の検算に使えます。`,
      lv: 2
    });
    steps.push({
      t: '近似式との比較（参考）',
      m: [R`f_{2} - f \approx ` + (tw ? '+' : '-') + R`\frac{2u}{V}f = ` + (tw ? '+' : '-') + R`\frac{2 \times ` + nf(r.u) + '}{' + nf(r.V) + R`} \times ` + nf(r.f) + ' = ' + sig((tw ? 1 : -1) * 2 * r.u / r.V * r.f) + HZ + R`\quad (\text{正確な値: } ` + sig(r.f2 - r.f) + HZ + ')'],
      n: R`反射板の速さ $u$ が音速 $V$ にくらべて十分小さいときは、$f_{2} - f \approx \pm\frac{2u}{V}f$ と近似できます（近づくなら $+$、遠ざかるなら $-$）。うなりの回数 $n \approx \frac{2uf}{V}$ から、反射板の速さの見当をつけられます。$u$ が音速に近づくほど、近似とのずれは大きくなります。`,
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'wave-doppler-reflect',
    field: '波動',
    unit: 'p-doppler',
    title: '動く反射板によるドップラー効果とうなり',
    desc: R`静止した音源・観測者の前で、反射板が近づく（遠ざかる）ときの反射音を、2 段階のドップラー効果として求めます。反射板が受ける音の振動数 $f_{1}$、反射音の振動数 $f_{2}$、直接音との間に聞こえるうなりの回数を計算します。`,
    form: [R`f_{1} = \frac{V - v_{o}}{V}f`, R`f_{2} = \frac{V}{V - v_{s}}f_{1} = \frac{V + u}{V - u}f\ (\text{壁が近づく})`, R`n = |f_{2} - f|`],
    inputs: [
      { key: 'f', label: '音源の振動数 f', unit: 'Hz', type: 'num', def: '680', min: 1, max: 1000000 },
      { key: 'V', label: '音の速さ V', unit: 'm/s', type: 'num', def: '340', min: 1, max: 100000 },
      { key: 'u', label: '反射板の速さ u', unit: 'm/s', type: 'num', def: '10', min: 0.001, max: 100000 },
      { key: 'dir', label: '反射板の動く向き', type: 'select', def: 'toward', options: [['toward', '音源に近づく'], ['away', '音源から遠ざかる']] }
    ],
    examples: [
      { label: '反射板が近づく', v: { f: '680', V: '340', u: '10', dir: 'toward' } },
      { label: '反射板が遠ざかる', v: { f: '680', V: '340', u: '10', dir: 'away' } },
      { label: 'ゆっくり近づく（うなり少）', v: { f: '440', V: '340', u: '1.0', dir: 'toward' } }
    ],
    intro: {
      easy: R`壁にぶつかってはね返ってくる音（反射音）は、壁が動いていると、もとの音とは振動数がかわります。壁は「音を受け取る観測者」であり「音をはね返す音源」でもあるので、ドップラー効果を**2 回**使います。1 回目は壁が動く観測者として受け取る音（$f_{1}$）、2 回目は壁が動く音源として出す音（$f_{2}$）を求めます。もとの音（$f$）と反射音（$f_{2}$）が同時に聞こえると、振動数の差の分だけ**うなり**が聞こえます。向きの符号は、2 回目で向きの基準を取り直す点に注意しましょう。`,
      normal: R`壁が近づくとき: $f_{1} = \frac{V + u}{V}f$、$f_{2} = \frac{V}{V - u}f_{1} = \frac{V + u}{V - u}f$。遠ざかるときは $u \to -u$。うなりは $n = |f_{2} - f|$ 回/秒。`,
      pro: R`$u$ が $V$ にくらべて十分小さいとき $f_{2} - f \approx \frac{2u}{V}f$（近づくなら正）。速度計（レーダーガン）やコウモリの超音波もこの原理。`
    },
    compute(v) {
      if (!(v.u < v.V)) throw new JK.CalcError('反射板の速さ u は音速 V より小さくしてください（音速以上では、この式は使えません）。');
      const r = solveReflect(v.f, v.V, v.u, v.dir);
      return {
        result: [
          { label: '反射板が受ける音の振動数 f₁', tex: sig(r.f1) + HZ },
          { label: '反射音の振動数 f₂', tex: sig(r.f2) + HZ },
          { label: 'うなりの回数（毎秒）', tex: sig(r.beat) + R`\,\text{回/秒}` },
          { label: 'うなりの周期', tex: sig(r.Tb) + SEC }
        ],
        steps: reflectSteps(r),
        fig: figReflect(r)
      };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      // basic・mid: 解説に出る f₁・f₂・うなりの回数が、すべて 3 桁でちょうど表せる (音速 V, 速さ u, 向き, 振動数 f) の組
      const cands = reflectCands();
      const keyOf = (r) => r.V + '/' + r.u + '/' + r.dir;
      if (level === 'basic') {
        const r = pickBy(rng, cands, keyOf);
        return {
          title: '動く壁が受ける音と反射音',
          body: R`静止した音源 S が、振動数 $` + r.f.toFixed(0) + R`\,\mathrm{Hz}$ の音を壁に向けて出している。壁は S に` + (r.dir === 'toward' ? '近づく' : '遠ざかる') + R`向きに、速さ $` + r.u.toFixed(0) + R`\,\mathrm{m/s}$ で動いている。音の速さを $` + nf(r.V) + R`\,\mathrm{m/s}$ として、次の問いに答えよ。`,
          fig: figReflect(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`壁が受け取る音の振動数 $f_{1}$`, type: 'num', answer: P3(r.f1), rel: tol.rel, unit: 'Hz' },
            { label: '(2)', q: R`壁ではね返って、S に届く反射音の振動数 $f_{2}$`, type: 'num', answer: P3(r.f2), rel: tol.rel, unit: 'Hz' }
          ],
          solution: reflectSteps(r, { noBeat: true })       // うなりは設問にないので、うなりのステップは lv 2
        };
      }
      if (level === 'mid') {
        const r = pickBy(rng, cands, keyOf);
        return {
          title: '壁による反射音のうなり',
          body: R`静止した音源 S（観測者もそこにいる）が、振動数 $` + r.f.toFixed(0) + R`\,\mathrm{Hz}$ の音を出している。S の前方で、反射板が S に` + (r.dir === 'toward' ? '近づく' : '遠ざかる') + R`向きに、一定の速さ $` + r.u.toFixed(0) + R`\,\mathrm{m/s}$ で動いている。反射板ではね返った音と、S から直接聞こえる音で、うなりが生じた。音の速さを $` + nf(r.V) + R`\,\mathrm{m/s}$ として、次の問いに答えよ。`,
          fig: figReflect(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`反射音の振動数 $f_{2}$`, type: 'num', answer: P3(r.f2), rel: tol.rel, unit: 'Hz' },
            { label: '(2)', q: R`毎秒聞こえるうなりの回数 $n$`, type: 'num', answer: P3(r.beat), rel: tol.rel, unit: '回/秒' },
            { label: '(3)', q: R`うなりの周期（うなり 1 回にかかる時間）$T_{b}$`, type: 'num', answer: P3(1 / r.beat), rel: tol.rel, unit: 's' }
          ],
          solution: reflectSteps(r)
        };
      }
      // adv: うなりの回数から反射板の速さを求める。
      // 問題文のうなりの回数 n（小数 1 桁）から u がきれいに戻るよう、n と f₂ = f + n がちょうど表せる組だけを候補にする
      const advCands = [];
      [330, 340, 350].forEach((V) => [5, 10, 15, 20, 25, 30, 35, 40].forEach((u) => {
        for (let f = 200; f <= 900; f += 5) {
          const r = solveReflect(f, V, u, 'toward');
          // f₁ は最後の答えなので 3 桁に丸めてよい（答え P3 と解説の表示 sig は同じ丸め rd3 なので、4 桁目がちょうど 5 でもずれない。下の判定は従来どおり残している）
          if (r.beat >= 1 && r.beat <= 100 && nice(r.beat, 1) && r.f2 < 1000 && ok3(r.f2) && Math.abs(Number(sig(r.f1)) - P3(r.f1)) < 1e-9) advCands.push(r);
        }
      }));
      const r = pickBy(rng, advCands, (c) => c.V + '/' + c.u);
      const sol = reflectSteps(r).slice(0, 1).concat([
        {
          t: R`うなりの回数から反射音の振動数を求める`,
          m: [R`n = f_{2} - f \;\Rightarrow\; f_{2} = f + n = ` + nf(r.f) + ' + ' + nf(r.beat) + ' = ' + sig(r.f2) + HZ],
          n: R`反射板が近づくので反射音は高くなり、$f_{2} > f$ です。うなりの回数が $n = f_{2} - f$ なので、$f_{2} = f + n$ です。`,
          easy: R`うなりの回数は、2 つの音の振動数の差でした。反射板が近づくときは、反射音の方が高い（$f_{2} > f$）ので、$f_{2} = f + n$ です。`
        },
        {
          t: R`2 段階のドップラー効果から反射板の速さを求める`,
          m: [R`f_{2} = \frac{V + u}{V - u}\,f \;\Rightarrow\; u = V\,\frac{f_{2} - f}{f_{2} + f}`,
            R`u = ` + nf(r.V) + R` \times \frac{` + nf(r.beat) + '}{' + nf(r.f2 + r.f) + '}' + eqTail(r.u) + MS,
            R`f_{1} = \frac{V + u}{V}\,f = \frac{` + nf(r.V) + ' + ' + SV(r.u, dig([r.u], (u) => (r.V + u) / r.V * r.f)) + '}{' + nf(r.V) + R`} \times ` + nf(r.f) + tailOf(r.f1, [r.u]) + HZ],
          n: R`$f_{2} = \frac{V + u}{V - u}f$ を $u$ について解きます（分母を払って整理: $f_{2}(V - u) = (V + u)f$ より $V(f_{2} - f) = u(f_{2} + f)$）。求めた $u$ を使えば、壁が受ける音の振動数 $f_{1}$ も求まります。`,
          easy: R`$f_{2} = \frac{V + u}{V - u} f$ を $u$ について解く方法です。両辺に $(V - u)$ をかけて、$u$ を含む項を左辺に集めると、$u = V \times \frac{f_{2} - f}{f_{2} + f}$ になります。求めた $u$ を、1 回目の式 $f_{1} = \frac{V + u}{V} f$ に代入すれば、壁が受ける音の振動数も出ます。`
        }
      ]);
      return {
        title: 'うなりから反射板の速さを求める',
        body: R`静止した音源 S（観測者もそこにいる）が、振動数 $` + r.f.toFixed(0) + R`\,\mathrm{Hz}$ の音を出している。S に向かって近づく反射板ではね返った音と、S から直接聞こえる音で、毎秒 $` + r.beat.toFixed(1) + R`$ 回のうなりが聞こえた。音の速さを $` + nf(r.V) + R`\,\mathrm{m/s}$ として、次の問いに答えよ。`,
        fig: figReflect(r, { problem: true }),
        parts: [
          { label: '(1)', q: R`反射音の振動数 $f_{2}$`, type: 'num', answer: P3(r.f2), rel: tol.rel, unit: 'Hz' },
          { label: '(2)', q: R`反射板の速さ $u$`, type: 'num', answer: P3(r.u), rel: tol.rel, unit: 'm/s' },
          { label: '(3)', q: R`反射板が受け取る音の振動数 $f_{1}$`, type: 'num', answer: P3(r.f1), rel: tol.rel, unit: 'Hz' }
        ],
        solution: sol
      };
    }
  });
})();
