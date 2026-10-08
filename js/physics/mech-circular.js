/* 物理・力学 — 円運動（unit: p-circular）
   mech-circular-uniform: 等速円運動（角速度・周期・向心加速度・向心力）
   mech-vertical-circle: 鉛直面内の円運動（最高点の速さ・張力・1 周できる条件）
   mech-conical: 円錐振り子（張力・速さ・周期） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const G = 9.8;
  const PI = Math.PI;

  // 有効数字 3 桁に四捨五入する。36.75 のように 4 桁目がちょうど 5 の値が、2 進数の誤差で 36.7 / 36.8 にぶれないよう、12 桁にそろえた十進表記から丸める
  const P3 = (x) => {
    if (!isFinite(x) || x === 0) return x;
    const m = /^(\d)\.(\d+)e([+-]\d+)$/.exec(Math.abs(x).toExponential(11));
    let h = Number(m[1] + m[2].slice(0, 2)), e = Number(m[3]);
    if (m[2].charAt(2) >= '5') h += 1;
    if (h === 1000) { h = 100; e += 1; }
    return (x < 0 ? -1 : 1) * Number(h + 'e' + (e - 2));
  };
  // 解説に書く値は、設問の答え（P3）と同じ丸めを通す
  const sig = (x) => U.sig(P3(x), 3);
  const nf = (x) => { if (typeof x !== 'number' || !isFinite(x) || Math.abs(x) < 1e-12) return '0'; const ax = Math.abs(x); if (ax >= 1e15 || ax < 1e-6) { let e = Math.floor(Math.log10(ax)); let m = Number((x / Math.pow(10, e)).toPrecision(10)); if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(10)); e += 1; } let ms = String(m); if (ms.indexOf('.') < 0) ms += '.0'; return '(' + ms + R` \times 10^{` + e + '})'; } return String(Number(x.toPrecision(10))); };   // 入力値の表示（TeX）。与えた値をそのまま（有効数字 10 桁まで）書く。3 桁に丸めると、入力が 4 桁以上のとき式が合わなくなる。10^-6 未満・10^15 以上だけ指数の形（累乗するときのため括弧つき）
  // 途中の値（v_B² など）は、割り切れる値ならそのまま書く（49.64 を 49.6 に丸めると、次の式の答えと合わなくなる）
  const nx = (x) => (Math.abs(x) < 0.01 && x !== 0 ? sig(x) : nf(x));
  const rad = (deg) => deg * PI / 180;

  // 途中の値の表示。x を、有効数字 n 桁に丸めた値と同じになる最小の桁数（3 桁以上）で書く
  const dig = (x, n) => {
    let k = 3;
    while (k < n && U.roundSig(x, k) !== U.roundSig(x, n)) k++;
    return U.sig(x, k);
  };
  // 途中の値 vals を、次の式 f（表示した値で計算する）の結果が target の有効数字 3 桁と一致する最小の桁数で書く。
  // 生徒が表示の数値どうしを電卓で計算しても、表示の結果と最後の桁まで合う（丸めた 18.8 を代入して 28.3 が 28.2 になる、を防ぐ）
  const fit = (vals, f, target) => {
    const want = P3(target);
    for (let n = 3; n <= 12; n++) {
      if (P3(f.apply(null, vals.map((x) => U.roundSig(x, n)))) === want) return vals.map((x) => dig(x, n));
    }
    return vals.map((x) => dig(x, 12));
  };
  // 割り切れる値（49.64 など）はそのまま書き、割り切れない値は、次の式 f の結果が target と合う桁数で書く
  const show = (x, f, target) => {
    const s = nx(x);
    return Math.abs(Number(s) - x) < 1e-9 * Math.max(1, Math.abs(x)) && P3(f(Number(s))) === P3(target) ? s : fit([x], f, target)[0];
  };
  const pr = (s) => (s.charAt(0) === '-' || s.indexOf(R`\times`) >= 0 ? '(' + s + ')' : s);   // 負の数・指数表記は括弧をつけて代入する
  const MS = R`\,\mathrm{m/s}`, MS2 = R`\,\mathrm{m/s^{2}}`, MM = R`\,\mathrm{m}`, NN = R`\,\mathrm{N}`, SEC = R`\,\mathrm{s}`, RADS = R`\,\mathrm{rad/s}`;
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

  // 図の文字用: 有効数字 3 桁の平文
  function pl(x) {
    if (!isFinite(x)) return '';
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = Number((x / Math.pow(10, e)).toPrecision(3));
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return m + '×10' + String(e).replace(/-/g, '⁻').replace(/\d/g, (c) => SUP[c]);
    }
    return String(P3(x));
  }

  /* =====================================================================
     等速円運動
     ===================================================================== */
  // pi: 問題文で与える円周率（演習用。省略すると円周率そのもの）
  function solveUni(m, r, mode, val, pi) {
    pi = pi || PI;
    let w;
    if (mode === 'v') w = val / r;
    else if (mode === 'T') w = 2 * pi / val;
    else if (mode === 'w') w = val;
    else w = 2 * pi * val / 60;
    const o = { m: m, r: r, mode: mode, val: val, w: w, pi: pi, piGiven: pi !== PI };
    o.v = r * w; o.T = 2 * pi / w; o.f = w / (2 * pi); o.n = o.f * 60;
    o.a = r * w * w; o.F = m * o.a;
    return o;
  }

  // 円周上の物体・速度（接線）・向心力（中心向き）
  function figUniform(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, 262);
    const cx = 160, cy = 120, Rp = 84;
    const ph = rad(38);
    const bx = cx + Rp * Math.cos(ph), by = cy - Rp * Math.sin(ph);
    if (o.disk) d.circle(cx, cy, Rp + 14, { cls: 'fg', fill: 'f0' });
    d.circle(cx, cy, Rp, { cls: 'dim', dash: true, w: 1.2 });
    d.dot(cx, cy, { cls: 'fg', r: 3 });
    d.text(cx - 12, cy + 16, 'O', { size: 12, italic: true });
    d.line(cx, cy, bx, by, { cls: 'dim', w: 1.3 });
    d.text((cx + bx) / 2 + 6, (cy + by) / 2 + 14, 'r', { cls: 'dim', italic: true, size: 12 });
    const tx = -Math.sin(ph), ty = -Math.cos(ph);
    const nx = -Math.cos(ph), ny = Math.sin(ph);
    d.circle(bx, by, 9, { cls: 'fg', fill: 'f1' });
    d.arrow(bx + 11 * tx, by + 11 * ty, bx + 66 * tx, by + 66 * ty, { cls: 'c1', label: 'v', w: 2.2 });
    d.arrow(bx + 11 * nx, by + 11 * ny, bx + 62 * nx, by + 62 * ny, { cls: 'c2', label: o.fLabel || 'a, F', w: 2.2 });
    d.arc(cx, cy, 24, 8, 66, { cls: 'c3', w: 1.6 });
    const p0 = [cx + 24 * Math.cos(rad(58)), cy - 24 * Math.sin(rad(58))], p1 = [cx + 24 * Math.cos(rad(68)), cy - 24 * Math.sin(rad(68))];
    d.arrow(p0[0], p0[1], p1[0], p1[1], { cls: 'c3', w: 1.6 });
    d.text(cx - 2, cy - 30, 'ω', { cls: 'c3', size: 13, italic: true });
    if (prob) {
      d.text(180, 250, o.caption || ('m = ' + pl(r.m) + ' kg　r = ' + pl(r.r) + ' m'), { size: 12 });
    } else {
      d.text(180, 232, 'm = ' + pl(r.m) + ' kg　r = ' + pl(r.r) + ' m　v = ' + pl(r.v) + ' m/s', { size: 12 });
      d.text(180, 250, 'ω = ' + pl(r.w) + ' rad/s　T = ' + pl(r.T) + ' s　a = ' + pl(r.a) + ' m/s²', { cls: 'dim', size: 11 });
    }
    return d.svg();
  }

  function stUniIntro() {
    return {
      t: '等速円運動とは（速さは一定、向きは変わる）',
      n: R`半径 $r$ の円周上を、一定の速さ $v$ で動く運動です。速さは変わらなくても**速度の向きが常に変わる**ので、物体には加速度があります。その加速度（**向心加速度**）は、いつも円の**中心**を向きます。加速度があるなら、運動方程式から、中心向きの力（**向心力**）がはたらいているはずです。`,
      easy: R`円を描いて動く物体は、直進しようとするのを、まわりの何かが「中心の方へ引っ張って」曲げ続けています。たとえば、ひもの先につけたボールを振り回すときは、ひもの張力が中心向きに引いています。この引く力を**向心力**、そのとき生じる加速度を**向心加速度**といいます。速さが変わらなくても、向きが変わるだけで「加速度がある」と考えるのがポイントです。`,
      pro: R`向心力は新しい種類の力ではなく、張力・摩擦力・重力などの合力のうち「中心向きの成分」の名前。`
    };
  }

  // 円周率の表示: 問題文で π = 3.14 と指定したときは 2 × 3.14、そうでなければ 2π
  const twoPi = (r) => (r.piGiven ? R`2 \times 3.14` : R`2\pi`);

  function stUniOmega(r) {
    const wLine = r.mode === 'v'
      ? [R`\omega = \frac{v}{r} = \frac{` + nf(r.val) + '}{' + nf(r.r) + '} = ' + sig(r.w) + RADS]
      : (r.mode === 'T'
        ? [R`\omega = \frac{2\pi}{T} = \frac{` + twoPi(r) + '}{' + nf(r.val) + '} = ' + sig(r.w) + RADS]
        : (r.mode === 'w'
          ? [R`\omega = ` + nf(r.val) + RADS]
          : [R`f = \frac{n}{60} = \frac{` + nf(r.val) + R`}{60} = ` + sig(r.f) + R`\,\mathrm{Hz}`,
            R`\omega = 2\pi f = ` + twoPi(r) + R` \times ` + fit([r.f], (x) => 2 * r.pi * x, r.w)[0] + ' = ' + sig(r.w) + RADS]));
    return {
      t: '角速度・周期・速さを結びつける',
      m: [R`\omega = \frac{2\pi}{T} = 2\pi f,\qquad v = r\omega = \frac{2\pi r}{T}`].concat(wLine),
      n: R`円を 1 周する時間が**周期** $T$、1 秒あたりの回転数が**回転数** $f = \frac{1}{T}$、1 秒あたりに回る角（ラジアン）が**角速度** $\omega$ です。1 周すると角は $2\pi$ ラジアン進むので $\omega = \frac{2\pi}{T}$、1 周で進む道のりは $2\pi r$ なので $v = \frac{2\pi r}{T} = r\omega$ です。`,
      easy: R`まず言葉の意味を整理します。**周期 $T$** は 1 周にかかる時間、**回転数 $f$** は 1 秒に回る回数（$f = 1/T$）です。**角速度 $\omega$** は、1 秒に回る角度をラジアン（円 1 周 = $2\pi$ ラジアン）で表したもので、$\omega = 2\pi f$ です。**速さ $v$** は、円周の長さ $2\pi r$ を周期 $T$ で割ったものなので、$v = r\omega$ と書けます。` + (r.mode === 'n' ? R`「毎分の回転数」は 60 で割ると 1 秒あたりの回転数になります。` : ''),
      pro: R`$v = r\omega$、$\omega = 2\pi/T = 2\pi f$ の 3 本で、$v, \omega, T, f$ の相互変換が一巡する。`
    };
  }

  // 速さ v = rω（と、周期 T・回転数 f）。o.vOnly: 設問で T, f を聞かないとき、v だけ
  function stUniRest(r, o) {
    o = o || {};
    const lines = [R`v = r\omega = ` + nf(r.r) + R` \times ` + fit([r.w], (x) => r.r * x, r.v)[0] + ' = ' + sig(r.v) + MS];
    if (!o.vOnly) {
      lines.push(R`T = \frac{2\pi}{\omega} = \frac{` + twoPi(r) + '}{' + fit([r.w], (x) => 2 * r.pi / x, r.T)[0] + '} = ' + sig(r.T) + SEC,
        R`f = \frac{1}{T} = \frac{1}{` + fit([r.T], (x) => 1 / x, r.f)[0] + '} = ' + sig(r.f) + R`\,\mathrm{Hz}`);
    }
    return {
      t: o.vOnly ? '速さ $v$ を求める' : '残りの量を求める',
      m: lines,
      n: o.vOnly ? R`求めた $\omega$ から、速さ $v = r\omega$ が決まります。`
        : R`求めた $\omega$ から、速さ $v = r\omega$、周期 $T = \frac{2\pi}{\omega}$、回転数 $f = \frac{1}{T}$ が決まります。`,
      easy: R`物体は 1 秒間に $\omega$ ラジアンだけ回ります。半径 $r$ の円周上では、角が 1 ラジアン進むと弧の長さが $r$ だけ進むので、1 秒間に進む道のり（= 速さ）は $v = r\omega$ です。`,
      lv: o.lv || 2
    };
  }

  // 向心加速度 a。o.vOnly: 速さ v だけを使って（角速度を出さずに）求める
  function stUniAccel(r, o) {
    o = o || {};
    const lines = [R`a = \frac{v^{2}}{r} = r\omega^{2}`,
      R`a = \frac{v^{2}}{r} = \frac{` + pr(fit([r.v], (x) => x * x / r.r, r.a)[0]) + R`^{2}}{` + nf(r.r) + '} = ' + sig(r.a) + MS2];
    if (!o.vOnly) lines.push(R`a = r\omega^{2} = ` + nf(r.r) + R` \times ` + pr(fit([r.w], (x) => r.r * x * x, r.a)[0]) + R`^{2} = ` + sig(r.a) + MS2);
    return {
      t: '向心加速度',
      m: lines,
      n: R`向心加速度の大きさは $a = \frac{v^{2}}{r} = r\omega^{2}$ で、向きは円の中心向きです。速さが大きいほど、半径が小さいほど（急なカーブほど）大きくなります。`,
      easy: R`円を曲がるときの「曲がりの強さ」が向心加速度です。同じ速さなら、小さい円（$r$ が小さい）ほど急に曲がるので、加速度は大きくなります（$a = v^{2}/r$）。また、同じ半径なら、速いほど急に向きを変えなければならないので、加速度は大きくなります（速さの 2 乗に比例）。角速度で表すと $a = r\omega^{2}$ です。`,
      pro: R`$a = v^{2}/r = r\omega^{2} = v\omega$。速さ 2 倍で $a$ は 4 倍、半径 2 倍（$v$ 一定）で $a$ は半分。`
    };
  }

  // 向心力 F。o.fromV: 向心加速度を出さずに、速さ v から F = mv²/r で求める
  function stUniForce(r, o) {
    o = o || {};
    return {
      t: '向心力',
      m: [R`F = ma = m\frac{v^{2}}{r} = mr\omega^{2}`,
        o.fromV
          ? R`F = m\frac{v^{2}}{r} = ` + nf(r.m) + R` \times \frac{` + pr(fit([r.v], (x) => r.m * x * x / r.r, r.F)[0]) + R`^{2}}{` + nf(r.r) + '} = ' + sig(r.F) + NN
          : R`F = ma = ` + nf(r.m) + R` \times ` + fit([r.a], (x) => r.m * x, r.F)[0] + ' = ' + sig(r.F) + NN],
      n: R`円運動の運動方程式（向心方向）は $ma = F$ です。この $F$（**向心力**）は、糸の張力や摩擦力など、実際にはたらく力の合力の「中心向きの成分」です。`,
      easy: R`加速度があれば、運動方程式 $ma = F$ から、力がはたらいているはずです。円運動で必要な、中心向きの力が**向心力**です。質量 $m$ と向心加速度 $a$ をかけるだけで、必要な大きさが分かります。この大きさの向心力を、糸の張力や摩擦力などがじっさいに与えていることになります。`,
      pro: R`向心力 $= m\frac{v^{2}}{r}$ は「必要な力」。ひもなら張力、回転台なら静止摩擦力がこれを供給する（供給できなくなると円運動を保てない）。`
    };
  }

  // 計算機（compute）の解説: 角速度・周期・速さ → 向心加速度 → 向心力
  function uniSteps(r) {
    return [stUniIntro(), stUniOmega(r), stUniRest(r), stUniAccel(r), stUniForce(r)];
  }

  JK.registerSim({
    id: 'mech-circular-uniform',
    field: '力学',
    unit: 'p-circular',
    title: '等速円運動（角速度・周期・向心力）',
    desc: R`半径 $r$ の円周上を一定の速さで動く質量 $m$ の物体について、速さ・周期・角速度・回転数のどれか 1 つから、残りと向心加速度 $a$・向心力 $F$ を求めます。`,
    form: [R`v = r\omega = \frac{2\pi r}{T},\quad \omega = \frac{2\pi}{T} = 2\pi f`, R`a = \frac{v^{2}}{r} = r\omega^{2}`, R`F = ma = m\frac{v^{2}}{r} = mr\omega^{2}`],
    inputs: [
      { key: 'm', label: '質量 m', unit: 'kg', type: 'num', def: '0.50', min: 0.001, max: 1000 },
      { key: 'r', label: '円の半径 r', unit: 'm', type: 'num', def: '2.0', min: 0.001, max: 10000 },
      { key: 'mode', label: '与える量', type: 'select', def: 'v', options: [['v', '速さ v'], ['T', '周期 T'], ['w', '角速度 ω'], ['n', '回転数（毎分）']] },
      { key: 'v', label: '速さ v', unit: 'm/s', type: 'num', def: '4.0', min: 0.001, max: 100000, show: (raw) => raw.mode === 'v' },
      { key: 'Tp', label: '周期 T', unit: 's', type: 'num', def: '3.0', min: 0.0001, max: 1000000, show: (raw) => raw.mode === 'T' },
      { key: 'w', label: '角速度 ω', unit: 'rad/s', type: 'num', def: '2.0', min: 0.0001, max: 100000, show: (raw) => raw.mode === 'w' },
      { key: 'n', label: '回転数 n', unit: '回/分', type: 'num', def: '60', min: 0.001, max: 1000000, show: (raw) => raw.mode === 'n' }
    ],
    examples: [
      { label: '速さを与える', v: { m: '0.50', r: '2.0', mode: 'v', v: '4.0', Tp: '3.0', w: '2.0', n: '60' } },
      { label: '周期を与える（2.0 秒で 1 周）', v: { m: '2.0', r: '1.5', mode: 'T', v: '4.0', Tp: '2.0', w: '2.0', n: '60' } },
      { label: '毎分 120 回転', v: { m: '0.10', r: '0.30', mode: 'n', v: '4.0', Tp: '3.0', w: '2.0', n: '120' } }
    ],
    intro: {
      easy: R`円を描いて動く物体は、速さが一定でも**向きが常に変わる**ので、加速度があります。この加速度は、いつも**円の中心**を向いていて、**向心加速度**といいます。大きさは $a = \frac{v^{2}}{r}$（$v$: 速さ、$r$: 半径）です。運動方程式 $ma = F$ から、中心向きの力（**向心力**）$F = m\frac{v^{2}}{r}$ が必要になります。まず、周期 $T$・角速度 $\omega$・速さ $v$ の関係（$v = r\omega$、$\omega = \frac{2\pi}{T}$）を覚えておきましょう。`,
      normal: R`$\omega = \frac{2\pi}{T}$、$v = r\omega$、$a = \frac{v^{2}}{r} = r\omega^{2}$（中心向き）、$F = ma$。`,
      pro: R`円運動の問題は「向心方向の運動方程式」$m\frac{v^{2}}{r} = (\text{中心向きの力の合力})$ を立てるのが出発点。角速度 $\omega$ で表した $mr\omega^{2}$ の形も使い分ける。`
    },
    compute(v) {
      const val = v.mode === 'v' ? v.v : (v.mode === 'T' ? v.Tp : (v.mode === 'w' ? v.w : v.n));
      const r = solveUni(v.m, v.r, v.mode, val);
      return {
        result: [
          { label: '角速度 ω', tex: sig(r.w) + RADS },
          { label: '周期 T', tex: sig(r.T) + SEC },
          { label: '回転数 f', tex: sig(r.f) + R`\,\mathrm{Hz}` },
          { label: '速さ v', tex: sig(r.v) + MS },
          { label: '向心加速度 a', tex: sig(r.a) + MS2 },
          { label: '向心力 F', tex: sig(r.F) + NN }
        ],
        steps: uniSteps(r),
        fig: figUniform(r)
      };
    },

    exercise(rng, level) {
      const tol = { rel: 0.02 };
      if (level === 'basic') {
        const m = rng.pick([0.50, 1.0, 2.0, 5.0]);
        const rr = rng.pick([0.50, 1.0, 2.0, 4.0]);
        const v = rng.pick([2.0, 3.0, 4.0, 5.0, 6.0]);
        const r = solveUni(m, rr, 'v', v);
        return {
          title: '一定の速さで円を描く物体',
          body: R`質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ の小球が、半径 $` + rr.toFixed(2) + R`\,\mathrm{m}$ の円周上を、一定の速さ $` + v.toFixed(1) + R`\,\mathrm{m/s}$ で等速円運動している。次の問いに答えよ。`,
          fig: figUniform(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`小球の向心加速度の大きさ $a$`, type: 'num', answer: P3(r.a), rel: tol.rel, unit: 'm/s²' },
            { label: '(2)', q: R`小球にはたらく向心力の大きさ $F$`, type: 'num', answer: P3(r.F), rel: tol.rel, unit: 'N' }
          ],
          // 速さ v と半径 r から a = v²/r、F = ma の順（角速度・周期は聞かれないので出さない）
          solution: [stUniIntro(), stUniAccel(r, { vOnly: true }), stUniForce(r)]
        };
      }
      if (level === 'mid') {
        const m = rng.pick([0.10, 0.20, 0.50, 2.0]);
        const rr = rng.pick([0.50, 1.0, 1.5, 2.0]);
        if (rng.bool(0.5)) {
          const T = rng.pick([0.50, 1.0, 2.0, 4.0]);
          const r = solveUni(m, rr, 'T', T, 3.14);                 // 問題文の円周率 π = 3.14 で計算する
          return {
            title: '周期から速さと向心力を求める',
            body: R`質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ の小球が、半径 $` + rr.toFixed(2) + R`\,\mathrm{m}$ の円周上を等速円運動しており、1 周するのに $` + T.toFixed(2) + R`\,\mathrm{s}$ かかる。円周率を $\pi = 3.14$ として、次の問いに答えよ。`,
            fig: figUniform(r, { problem: true }),
            parts: [
              { label: '(1)', q: R`角速度 $\omega$`, type: 'num', answer: P3(r.w), rel: tol.rel, unit: 'rad/s' },
              { label: '(2)', q: R`速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
              { label: '(3)', q: R`向心力の大きさ $F$`, type: 'num', answer: P3(r.F), rel: tol.rel, unit: 'N' }
            ],
            solution: [stUniIntro(), stUniOmega(r), stUniRest(r, { vOnly: true, lv: 1 }), stUniForce(r, { fromV: true })]
          };
        }
        const n = rng.pick([60, 120, 180, 300]);
        const r = solveUni(m, rr, 'n', n, 3.14);
        return {
          title: '回転数から速さと向心力を求める',
          body: R`質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ の小球が、半径 $` + rr.toFixed(2) + R`\,\mathrm{m}$ の円周上を等速円運動しており、毎分 $` + n.toFixed(0) + R`$ 回転している。円周率を $\pi = 3.14$ として、次の問いに答えよ。`,
          fig: figUniform(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`角速度 $\omega$`, type: 'num', answer: P3(r.w), rel: tol.rel, unit: 'rad/s' },
            { label: '(2)', q: R`速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
            { label: '(3)', q: R`向心力の大きさ $F$`, type: 'num', answer: P3(r.F), rel: tol.rel, unit: 'N' }
          ],
          solution: [stUniIntro(), stUniOmega(r), stUniRest(r, { vOnly: true, lv: 1 }), stUniForce(r, { fromV: true })]
        };
      }
      // adv: 水平な回転台の上の物体（静止摩擦力が向心力）
      const m = rng.pick([0.10, 0.20, 0.50, 1.0]);
      const rr = rng.pick([0.10, 0.20, 0.40, 0.50]);
      const mu = rng.pick([0.20, 0.30, 0.40, 0.50]);
      const Fmax = mu * m * G;
      const wc = Math.sqrt(mu * G / rr);
      const nc = wc * 60 / (2 * 3.14);                             // 問題文の円周率 π = 3.14
      const r = solveUni(m, rr, 'w', wc, 3.14);
      const sol = [stUniIntro()].concat([
        {
          t: '回転台の上の物体にはたらく向心力',
          n: R`水平な回転台の上で物体が回転台といっしょに円運動しているとき、**中心向きの力は静止摩擦力だけ**です（重力と垂直抗力は鉛直方向でつり合っています）。すなわち、向心力の正体は静止摩擦力 $f$ です。回転をはやくすると、必要な向心力 $mr\omega^{2}$ が大きくなり、静止摩擦力が**最大静止摩擦力** $\mu mg$ に達したところで、物体はすべり出します。`,
          easy: R`回転台の上の物体は、そのままだとまっすぐ飛び出そうとします。それを回転台の中心の方へ引き止めているのが、床と物体の間の**静止摩擦力**です。回転がはやくなるほど、引き止めるのに必要な力（向心力 $m r \omega^{2}$）は大きくなりますが、静止摩擦力には上限（$\mu mg$）があります。上限をこえた瞬間に、引き止められなくなって物体はすべり出します。`,
          pro: R`すべり出す条件は「必要な向心力 $mr\omega^{2}$ ＝ 最大静止摩擦力 $\mu mg$」。$m$ が消えるので限界の $\omega$ は質量によらない。`
        },
        {
          t: 'すべり出す直前の向心力と角速度',
          m: [R`f_{\max} = \mu mg = ` + nf(mu) + R` \times ` + nf(m) + R` \times 9.8 = ` + sig(Fmax) + NN,
            R`mr\omega_{c}^{2} = \mu mg \;\Rightarrow\; \omega_{c} = \sqrt{\frac{\mu g}{r}} = \sqrt{\frac{` + nf(mu) + R` \times 9.8}{` + nf(rr) + '}} = ' + sig(wc) + RADS],
          n: R`すべり出す直前は、静止摩擦力が最大値 $\mu mg$ に達していて、これが向心力 $mr\omega_{c}^{2}$ に等しくなっています。両辺の $m$ が消えて、$\omega_{c} = \sqrt{\mu g / r}$ が得られます。`,
          easy: R`すべり出す直前の様子を式にします。必要な向心力 $m r \omega_{c}^{2}$ が、静止摩擦力の上限 $\mu mg$ にちょうど等しいのです。両辺にある $m$ は消えるので、質量が違っても限界の角速度は同じです。回転台の中心に近い（$r$ が小さい）ほど、限界の角速度は大きくなります。`
        },
        {
          t: 'すべり出す直前の回転数（毎分）',
          m: [R`n_{c} = 60 \times \frac{\omega_{c}}{2\pi} = \frac{60\,\omega_{c}}{2\pi}`,
            R`n_{c} = \frac{60 \times ` + fit([wc], (x) => 60 * x / (2 * 3.14), nc)[0] + R`}{2 \times 3.14} = ` + sig(nc) + R`\,\text{回/分}`],
          n: R`角速度 $\omega_{c}$ を回転数に直します。$f = \frac{\omega}{2\pi}$ は 1 秒あたりの回転数、60 をかけると毎分の回転数です。`,
          easy: R`角速度は「1 秒に何ラジアン回るか」で、1 回転は $2\pi$ ラジアンです。だから $\omega_{c}$ を $2\pi$ で割ると 1 秒あたりの回転数、さらに 60 をかけると 1 分あたりの回転数になります。`
        }
      ]);
      return {
        title: '回転台の上ですべり出す物体',
        body: R`水平な回転台の上に、中心から $` + rr.toFixed(2) + R`\,\mathrm{m}$ の位置に質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ の小物体を置いた。回転台をゆっくりと回転させ、回転をしだいにはやくしていくと、角速度が $\omega_{c}$ になったとき、物体が回転台の上ですべり出した。物体と回転台の間の静止摩擦係数は $` + mu.toFixed(2) + R`$ である。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$、円周率を $\pi = 3.14$ として、次の問いに答えよ。`,
        fig: figUniform(r, { problem: true, disk: true, fLabel: 'f', caption: '回転台（上から見た図）: r = ' + pl(rr) + ' m　m = ' + pl(m) + ' kg　μ = ' + pl(mu) }),
        parts: [
          { label: '(1)', q: R`すべり出す直前に、物体にはたらく静止摩擦力の大きさ $f_{\max}$`, type: 'num', answer: P3(Fmax), rel: tol.rel, unit: 'N' },
          { label: '(2)', q: R`すべり出す直前の角速度 $\omega_{c}$`, type: 'num', answer: P3(wc), rel: tol.rel, unit: 'rad/s' },
          { label: '(3)', q: R`そのときの回転数（毎分の回転数）$n_{c}$`, type: 'num', answer: P3(nc), rel: tol.rel, unit: '回/分' }
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     鉛直面内の円運動
     ===================================================================== */
  function solveVert(m, L, v0) {
    const r = { m: m, L: L, v0: v0, W: m * G };
    r.TA = m * G + m * v0 * v0 / L;
    r.v0min = Math.sqrt(5 * G * L);
    r.vBmin = Math.sqrt(G * L);
    r.vBsq = v0 * v0 - 4 * G * L;
    if (v0 * v0 >= 5 * G * L - 1e-12) {
      r.mode = 'loop';
      r.vB = Math.sqrt(Math.max(0, r.vBsq));
      r.TB = m * r.vBsq / L - m * G;
      if (Math.abs(r.TB) < 1e-9) r.TB = 0;                          // 限界ちょうど（v₀² = 5gL）の丸め誤差（-1.78e-15 など）を 0 にする
    } else if (v0 * v0 > 2 * G * L) {
      r.mode = 'slack';
      r.sinA = (v0 * v0 - 2 * G * L) / (3 * G * L);
      r.alpha = Math.asin(r.sinA);
      r.vs = Math.sqrt(G * L * r.sinA);
      r.phi = PI / 2 + r.alpha;                                       // 最下点からの角（反時計回り）
      r.Hmax = L * (1 + r.sinA) + Math.pow(r.vs * Math.cos(r.alpha), 2) / (2 * G);
    } else {
      r.mode = 'swing';
      r.hm = v0 * v0 / (2 * G);
      r.phi = Math.acos(Math.max(-1, Math.min(1, 1 - r.hm / L)));
    }
    return r;
  }

  function figVert(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 268 : 308);
    const cx = 168, cy = 124, Rp = 88;
    const Pt = (phi) => [cx + Rp * Math.sin(phi), cy + Rp * Math.cos(phi)];
    const showRes = !prob;
    const mode = prob && !o.slack ? 'loop' : r.mode;
    // 軌道
    if (mode === 'loop') d.circle(cx, cy, Rp, { cls: 'dim', w: 1.2 });
    else {
      const ph = mode === 'slack' ? r.phi : r.phi;
      d.circle(cx, cy, Rp, { cls: 'dim', dash: true, w: 1 });
      if (showRes) d.arc(cx, cy, Rp, -90, -90 + ph * 180 / PI, { cls: 'fg', w: 1.6 });
    }
    d.dot(cx, cy, { cls: 'fg', r: 3 });
    const A = Pt(0);
    d.line(cx, cy, A[0], A[1], { cls: 'fg', w: 1.5 });
    d.text(cx + 10, cy + 20, 'L', { cls: 'dim', italic: true, size: 12 });
    d.circle(A[0], A[1], 9, { cls: 'fg', fill: 'f1' });
    d.text(A[0] - 18, A[1] + 16, 'A', { size: 12, bold: true });
    d.arrow(A[0] + 12, A[1], A[0] + 62, A[1], { cls: 'c1', label: 'v₀', w: 2.2 });
    const fmax = showRes ? Math.max(r.TA, mode === 'loop' ? Math.max(r.TB, 0) : 0, r.W) : 0;
    const k = showRes ? 46 / fmax : 0;
    if (showRes) {
      d.arrow(A[0], A[1] - 11, A[0], A[1] - 11 - k * r.TA, { cls: 'c2', label: 'T', lpos: -1, w: 2.2 });
      d.arrow(A[0], A[1] + 11, A[0], A[1] + 11 + k * r.W, { cls: 'c3', label: 'mg', w: 2.2 });
    }
    if (mode === 'loop') {
      const B = Pt(PI);
      d.line(cx, cy, B[0], B[1], { cls: 'fg', w: 1.5 });
      d.circle(B[0], B[1], 9, { cls: 'fg', fill: 'f2' });
      d.text(B[0] + 16, B[1] - 8, 'B', { size: 12, bold: true });
      if (showRes) {
        d.arrow(B[0] - 12, B[1], B[0] - 56, B[1], { cls: 'c1', label: 'v', lpos: -1, w: 2.2 });
        if (r.TB > 1e-9) d.arrow(B[0] - 6, B[1] + 11, B[0] - 6, B[1] + 11 + k * r.TB, { cls: 'c2', label: 'T', lpos: -1, w: 2.2 });
        d.arrow(B[0] + 6, B[1] + 11, B[0] + 6, B[1] + 11 + k * r.W, { cls: 'c3', label: 'mg', w: 2.2 });
      }
    } else if (showRes && mode === 'slack') {
      const S = Pt(r.phi);
      d.line(cx, cy, S[0], S[1], { cls: 'fg', w: 1.5 });
      d.circle(S[0], S[1], 8, { cls: 'fg', fill: 'f3' });
      d.text(S[0] + 12, S[1] - 6, 'P（糸がたるむ）', { cls: 'c3', size: 11, anchor: 'start' });
      d.angle(cx, cy, 30, 0, r.alpha * 180 / PI, 'α', { cls: 'c3' });
      d.line(cx, cy, cx + Rp + 10, cy, { cls: 'dim', dash: true, w: 1 });
      // 放物運動（糸がたるんだあと）
      const kk = Rp / r.L;
      const vx = kk * r.vs * Math.cos(r.phi), vy = -kk * r.vs * Math.sin(r.phi);
      const pts = [];
      for (let t = 0; t <= 3; t += 0.02) {
        const x = S[0] + vx * t, y = S[1] + vy * t + 0.5 * G * kk * t * t;
        if (x < 4 || x > 356 || y < 4 || y > 252) { if (t > 0.1) break; }
        pts.push([x, y]);
      }
      if (pts.length > 1) d.poly(pts, { cls: 'c3', close: false, dash: true, w: 1.4 });
    } else if (showRes && mode === 'swing') {
      const S = Pt(r.phi);
      d.line(cx, cy, S[0], S[1], { cls: 'dim', dash: true, w: 1.2 });
      d.circle(S[0], S[1], 8, { cls: 'dim', dash: true });
      d.line(S[0], S[1], 340, S[1], { cls: 'dim', dash: true, w: 1 });
      d.line(A[0] + 40, A[1] + 0.001, 340, A[1], { cls: 'dim', dash: true, w: 1 });
      d.line(334, S[1], 334, A[1], { cls: 'c3', w: 1.4 });
      d.text(330, (S[1] + A[1]) / 2 + 4, 'h', { cls: 'c3', size: 12, italic: true, anchor: 'end' });
    }
    if (showRes) {
      d.text(180, 284, 'm = ' + pl(r.m) + ' kg　L = ' + pl(r.L) + ' m　v₀ = ' + pl(r.v0) + ' m/s', { size: 12 });
      d.text(180, 302, mode === 'loop' ? '1 周できる（糸がたるまない）' : (mode === 'slack' ? '1 周できない: 途中で糸がたるむ' : '1 周できない: 水平より上へは上がらない'), { cls: mode === 'loop' ? 'c4' : 'c3', size: 12, bold: true });
    } else {
      d.text(180, 250, 'm = ' + pl(r.m) + ' kg　L = ' + pl(r.L) + ' m　最下点 A の速さ v₀ = ' + pl(r.v0) + ' m/s', { size: 12 });
    }
    return d.svg();
  }

  /* ---------- 解説ステップ（鉛直円運動）。演習は、設問の順に必要なステップだけを組み合わせる ---------- */
  function stVertSetup(r) {
    return {
      t: '状況の整理（最下点 A と最高点 B）',
      n: R`長さ $L = ` + nf(r.L) + R`\,\mathrm{m}$ の糸の先に質量 $m = ` + nf(r.m) + R`\,\mathrm{kg}$ のおもりをつけ、最下点 A で水平に速さ $v_{0} = ` + nf(r.v0) + R`\,\mathrm{m/s}$ を与えました。糸の張力 $T$ は運動の向きに垂直なので仕事をせず、**力学的エネルギーが保存**します。円運動の各点では、**中心向きの運動方程式**（向心力 = 張力と重力の中心向き成分の合力）が成り立ちます。`,
      easy: R`おもりは、糸にひかれて円を描きます。糸の張力は、おもりの動く向きと直角なので、おもりの速さを変えません。速さが変わるのは、重力の仕事のせいだけです。そこで、「速さ」は力学的エネルギー保存で、「張力」は円運動の運動方程式（中心向きの力 = 質量 × 向心加速度）で求めます。`,
      pro: R`鉛直円運動は「(1) エネルギー保存で速さ、(2) 向心方向の運動方程式で張力」の 2 本立て。`
    };
  }

  function stVertTA(r) {
    return {
      t: '最下点 A での張力',
      m: [R`m\frac{v_{0}^{2}}{L} = T_{A} - mg`, R`T_{A} = mg + m\frac{v_{0}^{2}}{L}`,
        R`T_{A} = ` + nf(r.m) + R` \times 9.8 + ` + nf(r.m) + R` \times \frac{` + nf(r.v0) + R`^{2}}{` + nf(r.L) + '} = ' + sig(r.TA) + NN],
      n: R`A では円の中心は真上です。上向き（中心向き）を正とすると、張力 $T_{A}$（上向き）と重力 $mg$（下向き）の合力が、向心力 $m\frac{v_{0}^{2}}{L}$ になります。`,
      easy: R`最下点では、糸は上向きに引き、重力は下向きに引いています。おもりは円を描いているので、真上（円の中心）向きに、向心力 $m\frac{v^{2}}{L}$ だけ余分に引かれなければなりません。つまり張力は、重さ $mg$ に向心力をたした大きさです。`,
      pro: R`最下点: $T = mg + m\frac{v^{2}}{L}$（重さより大きい）。`
    };
  }

  // 最高点 B での速さ（エネルギー保存）。o.lv: 粒度（既定 2）。1 周できる（loop）ときは、v_B も式の結果として書く
  function stVertVB(r, o) {
    const m = [R`\frac{1}{2}mv_{0}^{2} = \frac{1}{2}mv_{B}^{2} + mg(2L)`,
      R`v_{B}^{2} = v_{0}^{2} - 4gL = ` + nf(r.v0) + R`^{2} - 4 \times 9.8 \times ` + nf(r.L) + ' = ' + nx(r.vBsq) + R`\,\mathrm{m^{2}/s^{2}}`];
    if (r.mode === 'loop') m.push(R`v_{B} = \sqrt{v_{B}^{2}} = \sqrt{` + show(r.vBsq, Math.sqrt, r.vB) + '} = ' + sig(r.vB) + MS);
    return {
      t: '最高点 B での速さ（エネルギー保存）',
      m: m,
      n: R`A から B まで、高さは $2L$ だけ上がります。力学的エネルギー保存則 $\frac{1}{2}mv_{0}^{2} = \frac{1}{2}mv_{B}^{2} + mg\cdot 2L$ から $v_{B}^{2}$ が求まります。` + (r.vBsq < 0 ? R`この値が負になるので、おもりは最高点まで届きません。` : ''),
      easy: R`A から B まで上がると、高さが $2L$ だけ増えて、その分の位置エネルギー $mg \times 2L$ が増えます。増えた位置エネルギーは、運動エネルギーから出ています。つまり B では、速さが小さくなっています。もし $v_{0}^{2} - 4gL$ が負になるなら、最高点に届く前に止まってしまう（またはその前に糸がたるむ）ということです。`,
      lv: (o && o.lv) || 2
    };
  }

  // 最高点 B での張力（1 周できるとき）
  function stVertTB(r) {
    return {
      t: '最高点 B での張力',
      m: [R`m\frac{v_{B}^{2}}{L} = T_{B} + mg \;\Rightarrow\; T_{B} = m\frac{v_{B}^{2}}{L} - mg`,
        R`T_{B} = ` + nf(r.m) + R` \times \frac{` + show(r.vBsq, (x) => r.m * x / r.L - r.m * G, r.TB) + '}{' + nf(r.L) + '} - ' + nf(r.m) + R` \times 9.8 = ` + sig(r.TB) + NN],
      n: R`B では円の中心は真下なので、下向きを正とすると、張力 $T_{B}$ と重力 $mg$ が**ともに中心向き**で、$T_{B} + mg = m\frac{v_{B}^{2}}{L}$ です。これを $T_{B}$ について解きます。`,
      easy: R`最高点では、糸も重力も、どちらも真下（中心向き）を向いています。ですから「張力 + 重力 = 質量 × 向心加速度」と式を立てて、張力について解きます。`,
      pro: R`最高点: $T = m\frac{v^{2}}{L} - mg$（向心力から重さを引く）。`
    };
  }

  // 1 周できる条件（T_B ≥ 0）と、必要な最小の速さ。o.noTB: 最高点の張力の式を先に別のステップで書いたとき
  function stVertCond(r, o) {
    const m = [R`T_{B} \ge 0 \;\Leftrightarrow\; v_{B}^{2} \ge gL \;\Leftrightarrow\; v_{0}^{2} \ge 5gL`,
      R`v_{0} \ge \sqrt{5gL} = \sqrt{5 \times 9.8 \times ` + nf(r.L) + '} = ' + sig(r.v0min) + MS];
    if (!(o && o.noTB)) m.unshift(R`m\frac{v_{B}^{2}}{L} = T_{B} + mg \;\Rightarrow\; T_{B} = m\frac{v_{B}^{2}}{L} - mg`);
    return {
      t: o && o.noTB ? '1 周できる条件' : '最高点 B での張力と、1 周できる条件',
      m: m,
      n: R`B では円の中心は真下なので、下向きを正とすると、張力 $T_{B}$ と重力 $mg$ が**ともに中心向き**で、$T_{B} + mg = m\frac{v_{B}^{2}}{L}$ です。糸は押すことができないので $T_{B} \ge 0$ が必要で、$v_{B} \ge \sqrt{gL}$、すなわち A での速さが $v_{0} \ge \sqrt{5gL}$ なら、糸がたるまずに 1 周できます。`,
      easy: R`最高点では、糸も重力も、どちらも真下（中心向き）を向いています。ですから「張力 + 重力 = 質量 × 向心加速度」と式を立てます。糸は、引くことはできても押すことはできないので、張力は 0 以上です。張力がちょうど 0 になる速さ（$v_{B} = \sqrt{gL}$）が、1 周できる限界です。それより遅いと、糸がたるんでおもりは円から外れます。`,
      pro: R`1 周する条件: 最高点で $v_{B} \ge \sqrt{gL}$、すなわち最下点で $v_{0} \ge \sqrt{5gL}$。最下点と最高点の張力の差は常に $T_{A} - T_{B} = 6mg$（$v_{0}$, $L$ に無関係）。`
    };
  }

  // 1 周できると判定する（文章だけ）
  function stVertVerdict(r) {
    return {
      t: '判定: 1 周できる',
      n: R`$v_{0} = ` + nf(r.v0) + R`\,\mathrm{m/s}$ は $\sqrt{5gL} = ` + sig(r.v0min) + R`\,\mathrm{m/s}$ 以上なので、**1 周できます**。最高点の張力は $T_{B} = ` + sig(r.TB) + R`\,\mathrm{N}$ です。`
    };
  }

  // 最下点と最高点の張力の差（1 周できるとき）
  function stVertDiff(r) {
    const d = r.TA - r.TB;
    const ab = fit([r.TA, r.TB], (a, b) => a - b, d);
    return {
      t: '最下点と最高点の張力の差',
      m: [R`T_{A} - T_{B} = ` + ab[0] + ' - ' + ab[1] + ' = ' + sig(d) + NN,
        R`T_{A} - T_{B} = 6mg = 6 \times ` + nf(r.m) + R` \times 9.8 = ` + sig(6 * r.W) + NN],
      n: R`差は $` + sig(d) + R`\,\mathrm{N}$ で、重力 $mg = ` + sig(r.W) + R`\,\mathrm{N}$ のちょうど 6 倍です。この $T_{A} - T_{B} = 6mg$ は、$v_{0}$ や $L$ によらず成り立ちます。$T_{A} = mg + m\frac{v_{0}^{2}}{L}$ から $T_{B} = m\frac{v_{0}^{2} - 4gL}{L} - mg$ を引くと、$v_{0}$ や $L$ を含む項が消えて、$6mg$ だけが残るからです。`,
      easy: R`最下点では糸が「重さ + 向心力」を支え、最高点では「向心力 − 重さ」だけを糸が支えます。その差をとると、速さに関する項はエネルギー保存のおかげで打ち消し合い、重さの 6 倍だけが残ります。`,
      pro: R`$T_{A} - T_{B} = 6mg$ は $v_{0}$、$L$ によらない定石。$T_{A}$ か $T_{B}$ の計算の検算に使える。`
    };
  }

  // 水平より上へは上がらない（振り子のように往復する）
  function stVertSwing(r) {
    return {
      t: '判定: 1 周できない（水平より上へは上がらない）',
      m: [R`v_{0}^{2} \le 2gL \;\Rightarrow\; h = \frac{v_{0}^{2}}{2g} = \frac{` + nf(r.v0) + R`^{2}}{2 \times 9.8} = ` + sig(r.hm) + MM + R`\quad (\le L)`],
      n: R`$v_{0}^{2} \le 2gL$ なので、おもりは水平の高さ（$L$）までも届かず、高さ $h = \frac{v_{0}^{2}}{2g}$ で止まって、振り子のように引き返します。この間、糸はたるみません。`,
      lv: 1
    };
  }

  // 途中で糸がたるむ（2gL < v₀² < 5gL）: 判定
  function stSlackJudge(r) {
    return {
      t: '判定: 1 周できない（途中で糸がたるむ）',
      m: [R`2gL < v_{0}^{2} < 5gL`,
        R`2gL = 2 \times 9.8 \times ` + nf(r.L) + ' = ' + nf(2 * G * r.L) + R`,\qquad v_{0}^{2} = ` + nf(r.v0) + R`^{2} = ` + nf(r.v0 * r.v0) + R`,\qquad 5gL = 5 \times 9.8 \times ` + nf(r.L) + ' = ' + nf(5 * G * r.L)],
      n: R`$v_{0}^{2}$ が $2gL$ より大きく $5gL$ より小さいので（数値の単位はすべて $\mathrm{m^{2}/s^{2}}$）、おもりは水平の高さを越えますが、最高点までは届きません。途中の、水平面から角 $\alpha$ 上がった位置 P で張力が 0 になり、糸がたるんで、おもりは**斜め上へ放物運動**を始めます。`,
      easy: R`速さが足りないと、おもりは最高点に届く前に、糸が張力を失ってゆるみます。ゆるむ位置では張力が 0 なので、重力の「中心向きの成分」だけが向心力になります。この位置の条件（向心力の式）と、エネルギー保存の式をあわせて、その位置の角度 $\alpha$ と速さを求めます。そのあとおもりは、糸から解放されて、斜め上へ投げ出されたように（放物運動で）飛んでいきます。`,
      lv: 1
    };
  }

  // P で糸がたるむ条件（張力 0）→ 向心方向の式
  function stSlackCond(r) {
    return {
      t: 'P で糸がたるむ条件（張力 0）',
      m: [R`T = 0 \;\Rightarrow\; mg\sin\alpha = m\frac{v_{P}^{2}}{L} \;\Rightarrow\; v_{P}^{2} = gL\sin\alpha`],
      n: R`P は水平面から角 $\alpha$ だけ上にあるので、重力 $mg$ の中心向きの成分は $mg\sin\alpha$ です。糸がたるむ瞬間は張力 $T = 0$ なので、この成分だけが向心力になり、向心方向の式は $mg\sin\alpha = m\frac{v_{P}^{2}}{L}$ です。`,
      easy: R`糸がゆるむ位置では、糸はもう引いていません（張力 0）。おもりを円の中心の方へ曲げているのは重力だけで、重力のうち「中心を向く成分」が $mg\sin\alpha$ です。これが、円運動に必要な向心力 $m\frac{v_{P}^{2}}{L}$ に等しい、という式を立てます。`,
      pro: R`たるむ条件は「$T = 0$ の向心方向の式」。水平より上の位置では、重力の中心向きの成分は $mg\sin\alpha$。`
    };
  }

  // エネルギー保存則 → sinα
  function stSlackSin(r) {
    // 分子 v₀² − 2gL と分母 3gL: 割り切れる値はそのまま書き、割り切れない値は、結果と合う桁数で書く
    const num = r.v0 * r.v0 - 2 * G * r.L, den = 3 * G * r.L;
    const exact = (x) => Math.abs(U.roundSig(x, 6) - x) <= 1e-9 * Math.abs(x);
    const nd = exact(num) && exact(den) ? [dig(num, 6), dig(den, 6)] : fit([num, den], (a, b) => a / b, r.sinA);
    return {
      t: R`エネルギー保存則から $\sin\alpha$ を求める`,
      m: [R`\frac{1}{2}mv_{0}^{2} = \frac{1}{2}mv_{P}^{2} + mgL(1 + \sin\alpha)`,
        R`\frac{1}{2}v_{0}^{2} = \frac{1}{2}gL\sin\alpha + gL(1 + \sin\alpha) \;\Rightarrow\; \sin\alpha = \frac{v_{0}^{2} - 2gL}{3gL}`,
        R`\sin\alpha = \frac{` + nf(r.v0) + R`^{2} - 2 \times 9.8 \times ` + nf(r.L) + R`}{3 \times 9.8 \times ` + nf(r.L) + R`} = \frac{` + nd[0] + '}{' + nd[1] + '} = ' + sig(r.sinA),
        R`\alpha = ` + sig(r.alpha * 180 / PI) + R`\degree`],
      n: R`A から P までの高さは $L + L\sin\alpha = L(1 + \sin\alpha)$ です。力学的エネルギー保存則の式に、前のステップの $v_{P}^{2} = gL\sin\alpha$ を代入すると、$\sin\alpha$ だけの式になります。`,
      easy: R`A から P まで上がると、位置エネルギーが $mgL(1 + \sin\alpha)$ だけ増え、その分だけ運動エネルギーが減ります。P での速さには、前のステップで出した関係 $v_{P}^{2} = gL\sin\alpha$ を使います。すると、式の中に未知数が $\sin\alpha$ だけ残るので、解くことができます。`,
      pro: R`$\sin\alpha = \frac{v_{0}^{2} - 2gL}{3gL}$（$2gL < v_{0}^{2} < 5gL$ で $0 < \sin\alpha < 1$）は、そのまま使えるようにしておく。`
    };
  }

  // P での速さ（v_P² = gL sinα = (v₀² − 2gL)/3）
  function stSlackVP(r) {
    return {
      t: 'P での速さ $v_{P}$',
      m: [R`v_{P}^{2} = gL\sin\alpha = \frac{v_{0}^{2} - 2gL}{3}`,
        R`v_{P} = \sqrt{\frac{v_{0}^{2} - 2gL}{3}} = \sqrt{\frac{` + nf(r.v0) + R`^{2} - 2 \times 9.8 \times ` + nf(r.L) + '}{3}} = ' + sig(r.vs) + MS],
      n: R`$v_{P}^{2} = gL\sin\alpha$ に $\sin\alpha = \frac{v_{0}^{2} - 2gL}{3gL}$ を入れると、$g$ と $L$ が約分されて $v_{P}^{2} = \frac{v_{0}^{2} - 2gL}{3}$ となります。`,
      easy: R`P での速さは、「向心力の式」$v_{P}^{2} = gL\sin\alpha$ に、いま求めた $\sin\alpha$ の値を入れるだけで出ます。`
    };
  }

  // 糸がたるんだあと、おもりが達する最高点の高さ H。o.lv: 粒度（既定 2）
  function stSlackH(r, o) {
    const cosA = Math.cos(r.alpha);
    const sc = fit([r.sinA], (s) => Math.sqrt(1 - s * s), cosA)[0];
    const h = fit([r.sinA, r.vs, cosA], (s, vp, c) => r.L * (1 + s) + Math.pow(vp * c, 2) / (2 * G), r.Hmax);
    return {
      t: '糸がたるんだあと、おもりが達する最高点の高さ',
      m: [R`\cos\alpha = \sqrt{1 - \sin^{2}\alpha} = \sqrt{1 - ` + sc + R`^{2}} = ` + sig(cosA),
        R`H = L(1 + \sin\alpha) + \frac{(v_{P}\cos\alpha)^{2}}{2g} = ` + nf(r.L) + R` \times (1 + ` + h[0] + R`) + \frac{(` + h[1] + R` \times ` + h[2] + R`)^{2}}{2 \times 9.8} = ` + sig(r.Hmax) + MM],
      n: R`P を出た後、おもりの鉛直方向の初速は $v_{P}\cos\alpha$（上向き）です。P の高さ（最下点から $L(1+\sin\alpha)$）に、さらに上がる高さ $\frac{(v_{P}\cos\alpha)^{2}}{2g}$ を加えたものが、おもりの最高点の高さです。`,
      lv: (o && o.lv) || 2
    };
  }

  // 計算機（compute）の解説
  function vertSteps(r) {
    const steps = [stVertSetup(r), stVertTA(r), stVertVB(r, { lv: r.mode === 'loop' ? 1 : 2 })];
    if (r.mode === 'loop') {
      steps.push(stVertTB(r), stVertCond(r, { noTB: true }), stVertVerdict(r), stVertDiff(r));
    } else if (r.mode === 'slack') {
      steps.push(stVertCond(r), stSlackJudge(r), stSlackCond(r), stSlackSin(r), stSlackVP(r), stSlackH(r));
    } else {
      steps.push(stVertCond(r), stVertSwing(r));
    }
    return steps;
  }

  JK.registerSim({
    id: 'mech-vertical-circle',
    field: '力学',
    unit: 'p-circular',
    title: '鉛直面内の円運動（最高点・張力・1 周する条件）',
    desc: R`糸の先のおもりを、最下点で水平に速さ $v_{0}$ で動かしたときの鉛直面内の円運動です。最下点・最高点での張力、最高点の速さ、1 周できる条件 $v_{0} \ge \sqrt{5gL}$ を求めます。1 周できない場合（途中で糸がたるむ / 水平より上へ上がらない）も判定します。`,
    form: [R`\frac{1}{2}mv_{0}^{2} = \frac{1}{2}mv_{B}^{2} + mg\cdot 2L`, R`T_{A} = mg + m\frac{v_{0}^{2}}{L},\qquad T_{B} = m\frac{v_{B}^{2}}{L} - mg`, R`\text{1 周する条件: } v_{0} \ge \sqrt{5gL}`],
    inputs: [
      { key: 'm', label: 'おもりの質量 m', unit: 'kg', type: 'num', def: '0.50', min: 0.001, max: 1000 },
      { key: 'L', label: '糸の長さ L', unit: 'm', type: 'num', def: '0.80', min: 0.01, max: 100 },
      { key: 'v0', label: '最下点での速さ v₀', unit: 'm/s', type: 'num', def: '7.0', min: 0.001, max: 1000, hint: '水平に与える初速' }
    ],
    examples: [
      { label: '1 周できる（v₀ = 7.0 m/s）', v: { m: '0.50', L: '0.80', v0: '7.0' } },
      { label: '限界ちょうど（v₀ = √(5gL)）', v: { m: '0.50', L: '1.0', v0: '7.0' } },
      { label: '糸がたるむ', v: { m: '0.50', L: '0.80', v0: '4.5' } },
      { label: '水平まで届かない', v: { m: '0.50', L: '1.0', v0: '3.0' } }
    ],
    intro: {
      easy: R`ひもの先のおもりを、真下から勢いよく回すと、円を描いて 1 周します。このとき、おもりの**速さ**は、位置エネルギーの変化から（**力学的エネルギー保存**）、**ひもの張力**は、円運動の運動方程式（中心向きの力 = 質量 × 向心加速度）から求めます。大切なのは、「最高点でひもがゆるまないか」です。ひもは引くことしかできないので、最高点で張力が 0 以上、つまり最高点の速さが $\sqrt{gL}$ 以上であれば、1 周できます。`,
      normal: R`A→B のエネルギー保存で $v_{B}^{2} = v_{0}^{2} - 4gL$。向心方向の式 $T_{A} - mg = m\frac{v_{0}^{2}}{L}$、$T_{B} + mg = m\frac{v_{B}^{2}}{L}$。1 周の条件は $T_{B} \ge 0$、すなわち $v_{0} \ge \sqrt{5gL}$。`,
      pro: R`$v_{0}^{2} \ge 5gL$（1 周）、$2gL < v_{0}^{2} < 5gL$（途中でたるむ。$\sin\alpha = \frac{v_{0}^{2} - 2gL}{3gL}$）、$v_{0}^{2} \le 2gL$（水平以下で往復）の 3 つの場合分けを覚える。$T_{A} - T_{B} = 6mg$。`
    },
    compute(v) {
      const r = solveVert(v.m, v.L, v.v0);
      const res = [
        { label: '最下点 A での張力 T_A', tex: sig(r.TA) + NN },
        { label: '1 周できる最小の速さ √(5gL)', tex: sig(r.v0min) + MS }
      ];
      if (r.mode === 'loop') {
        res.unshift({ label: '最高点 B での速さ v_B', tex: sig(r.vB) + MS });
        res.splice(2, 0, { label: '最高点 B での張力 T_B', tex: sig(r.TB) + NN });
        res.push({ label: '判定', tex: R`\text{1 周できる}` });
      } else if (r.mode === 'slack') {
        res.unshift({ label: '判定', tex: R`\text{1 周できない（途中で糸がたるむ）}` });
        res.push({ label: '糸がたるむ位置（水平から上へ）α', tex: sig(r.alpha * 180 / PI) + R`\degree` });
        res.push({ label: 'そのときの速さ v_P', tex: sig(r.vs) + MS });
      } else {
        res.unshift({ label: '判定', tex: R`\text{1 周できない（水平より上へは上がらない）}` });
        res.push({ label: '上がる最大の高さ h（最下点から）', tex: sig(r.hm) + MM });
      }
      return { result: res, steps: vertSteps(r), fig: figVert(r) };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      const tol = { rel: 0.02 };
      const pickLoop = (vs) => {
        for (let i = 0; i < 300; i++) {
          const L = rng.pick([0.40, 0.50, 0.80, 1.0, 1.5]);
          const v0 = rng.pick(vs);
          const m = rng.pick([0.20, 0.50, 1.0, 2.0]);
          if (v0 * v0 >= 5 * G * L * 1.15) return [m, L, v0];
        }
        return [0.50, 0.80, 7.0];
      };
      if (level === 'basic') {
        const p = pickLoop([5.0, 6.0, 7.0, 8.0]);
        const r = solveVert(p[0], p[1], p[2]);
        return {
          title: '糸の先のおもりの円運動',
          body: R`長さ $` + p[1].toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を固定し、他端に質量 $` + p[0].toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけた。おもりを鉛直面内で円運動させるために、最下点 A で水平に速さ $` + p[2].toFixed(1) + R`\,\mathrm{m/s}$ を与えたところ、おもりは糸がたるむことなく円運動を続けた。` + gtxt + R`次の問いに答えよ。`,
          fig: figVert(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`最下点 A での糸の張力の大きさ $T_{A}$`, type: 'num', answer: P3(r.TA), rel: tol.rel, unit: 'N' },
            { label: '(2)', q: R`最高点 B でのおもりの速さ $v_{B}$`, type: 'num', answer: P3(r.vB), rel: tol.rel, unit: 'm/s' }
          ],
          solution: [stVertSetup(r), stVertTA(r), stVertVB(r, { lv: 1 })]
        };
      }
      if (level === 'mid') {
        const p = pickLoop([6.0, 7.0, 8.0, 9.0, 10.0]);
        const r = solveVert(p[0], p[1], p[2]);
        return {
          title: '鉛直円運動の最高点の張力',
          body: R`長さ $` + p[1].toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を固定し、他端に質量 $` + p[0].toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけた。最下点 A で水平に速さ $` + p[2].toFixed(1) + R`\,\mathrm{m/s}$ を与えると、おもりは鉛直面内で円運動を続けた。` + gtxt + R`次の問いに答えよ。`,
          fig: figVert(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`最高点 B でのおもりの速さ $v_{B}$`, type: 'num', answer: P3(r.vB), rel: tol.rel, unit: 'm/s' },
            { label: '(2)', q: R`最高点 B での糸の張力の大きさ $T_{B}$`, type: 'num', answer: P3(r.TB), rel: tol.rel, unit: 'N' },
            { label: '(3)', q: R`おもりが糸をたるませずに 1 周するために、最下点 A で与えるべき速さの最小値 $v_{0\min}$`, type: 'num', answer: P3(r.v0min), rel: tol.rel, unit: 'm/s' }
          ],
          solution: [stVertSetup(r), stVertVB(r, { lv: 1 }), stVertTB(r), stVertCond(r, { noTB: true })]
        };
      }
      // adv: 1 周の場合の張力差 / 糸がたるむ場合
      if (rng.bool(0.5)) {
        const p = pickLoop([6.0, 7.0, 8.0, 9.0, 10.0]);
        const r = solveVert(p[0], p[1], p[2]);
        return {
          title: '最下点と最高点の張力の差',
          body: R`長さ $` + p[1].toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を固定し、他端に質量 $` + p[0].toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけた。最下点 A で水平に速さ $` + p[2].toFixed(1) + R`\,\mathrm{m/s}$ を与えると、おもりは糸がたるむことなく鉛直面内で円運動を続けた。` + gtxt + R`次の問いに答えよ。`,
          fig: figVert(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`最高点 B での糸の張力の大きさ $T_{B}$`, type: 'num', answer: P3(r.TB), rel: tol.rel, unit: 'N' },
            { label: '(2)', q: R`最下点 A での糸の張力の大きさ $T_{A}$`, type: 'num', answer: P3(r.TA), rel: tol.rel, unit: 'N' },
            { label: '(3)', q: R`張力の差 $T_{A} - T_{B}$（重力の何倍になるかも確かめよ）`, type: 'num', answer: P3(r.TA - r.TB), rel: tol.rel, unit: 'N' }
          ],
          // 設問の順（T_B → T_A → 差）。T_B を出すのに v_B² が要るので、エネルギー保存のステップも lv 1
          solution: [stVertSetup(r), stVertVB(r, { lv: 1 }), stVertTB(r), stVertTA(r), stVertDiff(r)]
        };
      }
      let L, m, v0, r;
      for (let i = 0; i < 300; i++) {
        L = rng.pick([0.40, 0.50, 0.80, 1.0]);
        m = rng.pick([0.20, 0.50, 1.0]);
        v0 = rng.pick([3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0]);
        r = solveVert(m, L, v0);
        if (r.mode === 'slack' && r.sinA > 0.15 && r.sinA < 0.85) break;
        r = null;
      }
      if (!r) { L = 0.80; m = 0.50; v0 = 4.5; r = solveVert(m, L, v0); }
      return {
        title: '糸がたるむ位置',
        body: R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を固定し、他端に質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけた。最下点 A で水平に速さ $` + v0.toFixed(1) + R`\,\mathrm{m/s}$ を与えると、おもりは円弧にそって上がっていき、水平の高さを越えたあと、最高点に達する前に糸がたるんで、おもりは円軌道から離れた。糸がたるんだ位置を P、P と円の中心 O を結ぶ線が水平となす角を $\alpha$ とする。` + gtxt + R`次の問いに答えよ。`,
        fig: figVert(r, { problem: true, slack: true }),
        parts: [
          { label: '(1)', q: R`$\sin\alpha$`, type: 'num', answer: P3(r.sinA), rel: tol.rel },
          { label: '(2)', q: R`P でのおもりの速さ $v_{P}$`, type: 'num', answer: P3(r.vs), rel: tol.rel, unit: 'm/s' },
          { label: '(3)', q: R`糸がたるんだあと、おもりが達する最高点の、最下点 A からの高さ $H$`, type: 'num', answer: P3(r.Hmax), rel: tol.rel, unit: 'm' }
        ],
        // 設問の順（sinα → v_P → H）。最高点 B や 1 周の条件は聞かれないので出さない
        solution: [stVertSetup(r), stSlackCond(r), stSlackSin(r), stSlackVP(r), stSlackH(r, { lv: 1 })]
      };
    }
  });

  /* =====================================================================
     円錐振り子
     ===================================================================== */
  // ap: 問題文で与える近似値 {c, s, t, pi}（演習用）。省略すると、角度と円周率から計算する
  function solveCone(m, L, thDeg, ap) {
    const th = rad(thDeg);
    const r = { m: m, L: L, thDeg: thDeg, th: th, W: m * G };
    r.c = Math.cos(th); r.s = Math.sin(th); r.t = Math.tan(th);
    if (ap) { r.c = ap.c; r.s = ap.s; r.t = ap.t; r.approx = true; }
    r.Rr = L * r.s;
    r.S = m * G / r.c;
    r.F = m * G * r.t;
    r.w = Math.sqrt(G / (L * r.c));
    r.v = r.Rr * r.w;
    r.pi = ap && ap.pi ? ap.pi : PI;
    r.piGiven = !!(ap && ap.pi);
    r.T = 2 * r.pi / r.w;
    r.hd = L * r.c;
    return r;
  }

  function figCone(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 262 : 292);
    const px = 170, py = 40, Ls = 142;
    const th = r.th, thd = r.thDeg;
    const bx = px + Ls * Math.sin(th), by = py + Ls * Math.cos(th);
    const rx = Ls * Math.sin(th);
    d.hatch(px - 60, py - 16, px + 60, py - 16, { side: -1 });
    d.line(px, py - 16, px, py, { cls: 'fg', w: 1.6 });
    d.dot(px, py, { cls: 'fg', r: 3 });
    d.line(px, py, px, by + 22, { cls: 'dim', dash: true, w: 1 });
    // 円軌道（水平面内。斜めから見た楕円）
    const ry = Math.max(6, 0.2 * rx);
    d.path('M' + (px - rx) + ' ' + by + ' A' + rx + ' ' + ry + ' 0 1 0 ' + (px + rx) + ' ' + by + ' A' + rx + ' ' + ry + ' 0 1 0 ' + (px - rx) + ' ' + by, { cls: 'dim', w: 1.2 });
    d.line(px, py, bx, by, { cls: 'fg', w: 1.6 });
    d.angle(px, py, 46, -90, thd - 90, 'θ', { cls: 'c3' });
    d.line(px, by, bx, by, { cls: 'dim', dash: true, w: 1 });
    d.text((px + bx) / 2, by + 15, 'r', { cls: 'dim', italic: true, size: 12 });
    d.circle(bx, by, 10, { cls: 'fg', fill: 'f1' });
    d.text(px + 8, py + 30, 'L', { cls: 'dim', italic: true, size: 12 });
    if (!prob) {
      // 力の三角形: S（糸）, mg（重力）, 合力 F（水平・中心向き）
      const k = 56 / r.S;
      d.arrow(bx, by, bx - k * r.S * Math.sin(th), by - k * r.S * Math.cos(th), { cls: 'c1', label: 'S', lpos: -1, w: 2.2 });
      d.arrow(bx, by, bx, by + k * r.W, { cls: 'c3', label: 'mg', w: 2.2 });
      d.arrow(bx, by, bx - k * r.F, by, { cls: 'c2', label: 'F', lpos: -1, w: 2.2 });
      d.text(180, 264, 'm = ' + pl(r.m) + ' kg　L = ' + pl(r.L) + ' m　θ = ' + pl(thd) + '°', { size: 12 });
      d.text(180, 282, 'r = ' + pl(r.Rr) + ' m　S = ' + pl(r.S) + ' N　v = ' + pl(r.v) + ' m/s　T = ' + pl(r.T) + ' s', { cls: 'dim', size: 11 });
    } else {
      d.text(180, 252, o.caption || ('m = ' + pl(r.m) + ' kg　L = ' + pl(r.L) + ' m'), { size: 12 });
    }
    return d.svg();
  }

  /* ---------- 解説ステップ（円錐振り子）。演習は、設問の順・向きに合わせて必要なステップだけを組み合わせる ---------- */
  // 力と、水平面内の円運動（半径は文字式のまま。数値は求めるステップで出す）
  function stConeSetup() {
    return {
      t: '力を図に描く（水平面内の円運動）',
      n: R`おもり（質量 $m$）は、水平面内で半径 $r = L\sin\theta$ の等速円運動をしています。はたらく力は、**糸の張力 $S$**（糸の方向、支点向き）と**重力 $mg$**（下向き）の 2 つだけです。鉛直方向には動かないので力はつり合い、水平方向の合力（$S\sin\theta$）が円の中心向きの**向心力**になります。`,
      easy: R`おもりは、同じ高さのまま、水平な円を描いて回っています。上下には動かないので、「上向きの力」と「下向きの力」はつり合っています。一方、横方向には、円の中心へ向かって引かれていないと、まっすぐ飛び出してしまいます。この「中心へ向かう力」の正体は、糸の張力 $S$ の横向きの成分 $S\sin\theta$ です。`,
      pro: R`円錐振り子は「鉛直: つり合い、水平: 向心方向の運動方程式」の 2 式。半径は $r = L\sin\theta$ に注意。`
    };
  }

  // 円運動の半径 r = L sinθ（θ が分かっているとき）
  function stConeR(r) {
    return {
      t: '円運動の半径 $r$',
      m: [R`r = L\sin\theta = ` + nf(r.L) + R` \times ` + fit([r.s], (x) => r.L * x, r.Rr)[0] + ' = ' + sig(r.Rr) + MM],
      n: R`糸（長さ $L$）、水平な円の半径 $r$、鉛直な線で直角三角形ができています。角 $\theta$ の向かい側の辺が $r$ なので、$r = L\sin\theta$ です。`,
      easy: R`糸は、円錐の斜めの辺にあたります。この斜辺（長さ $L$）と、水平な円の半径 $r$、鉛直な線で、直角三角形ができています。角 $\theta$ の向かい側の辺が円の半径 $r$ なので、$r = L\sin\theta$ です。`
    };
  }

  // 鉛直方向のつり合い → 張力 S
  function stConeS(r) {
    return {
      t: '鉛直方向のつり合い → 張力',
      m: [R`S\cos\theta = mg \;\Rightarrow\; S = \frac{mg}{\cos\theta}`,
        R`S = \frac{` + nf(r.m) + R` \times 9.8}{` + fit([r.c], (x) => r.m * G / x, r.S)[0] + '} = ' + sig(r.S) + NN],
      n: R`張力 $S$ の鉛直成分 $S\cos\theta$（上向き）が重力 $mg$（下向き）とつり合います。糸が開くほど（$\theta$ が大きいほど）$\cos\theta$ が小さくなり、張力は大きくなります。`,
      easy: R`糸の力 $S$ を「真上向き」と「横向き」に分けます。真上向きの成分 $S\cos\theta$ が、おもりの重さ $mg$ を支えています。だから $S\cos\theta = mg$ で、$S = mg/\cos\theta$ です。糸が寝る（$\theta$ が大きい）ほど、真上向きの成分が小さくなるので、同じ重さを支えるのにより強く引かなければなりません。`
    };
  }

  // 向心力 F = S sinθ = mg tanθ
  function stConeF(r) {
    return {
      t: '向心力（水平方向の合力）',
      m: [R`F = S\sin\theta = \frac{mg}{\cos\theta}\sin\theta = mg\tan\theta`,
        R`F = mg\tan\theta = ` + nf(r.m) + R` \times 9.8 \times ` + fit([r.t], (x) => r.m * G * x, r.F)[0] + ' = ' + sig(r.F) + NN],
      n: R`水平方向の合力は、張力の水平成分 $S\sin\theta$ だけで、これが円の中心向きの**向心力**です。$S = \frac{mg}{\cos\theta}$ を使うと、$S\sin\theta = mg\tan\theta$ となります。`,
      easy: R`おもりを円の中心へ引いているのは、糸の力 $S$ の「横向きの成分」$S\sin\theta$ です。さっき求めた $S = mg/\cos\theta$ を入れると、$S\sin\theta = mg\tan\theta$ になります。これが向心力の大きさです。`,
      pro: R`向心力 $= mg\tan\theta$。角度が大きいほど（$\tan\theta$ が大きいほど）大きい。`
    };
  }

  // 水平方向の運動方程式 → 角速度 ω・速さ v（θ が分かっているとき）
  function stConeOmega(r) {
    const c = fit([r.c], (x) => Math.sqrt(G / (r.L * x)), r.w)[0], rv = fit([r.Rr, r.w], (a, b) => a * b, r.v);
    return {
      t: '水平方向の運動方程式（向心力）→ 角速度・速さ',
      m: [R`m r\omega^{2} = S\sin\theta = mg\tan\theta`,
        R`\omega^{2} = \frac{g\tan\theta}{L\sin\theta} = \frac{g}{L\cos\theta}`,
        R`\omega = \sqrt{\frac{9.8}{` + nf(r.L) + R` \times ` + c + R`}} = ` + sig(r.w) + RADS,
        R`v = r\omega = ` + rv[0] + R` \times ` + rv[1] + ' = ' + sig(r.v) + MS],
      n: R`向心力 $S\sin\theta = mg\tan\theta$ が $m r\omega^{2}$（$= m\frac{v^{2}}{r}$）に等しいので、$r = L\sin\theta$ を使うと、$m$ も $\sin\theta$ も消えて $\omega^{2} = \frac{g}{L\cos\theta}$ となります。速さは $v = r\omega$ です。`,
      easy: R`円運動の運動方程式は「向心力 = 質量 × 向心加速度」で、向心加速度は $r\omega^{2}$ です。向心力は $S\sin\theta$ ですが、鉛直方向の式から $S\cos\theta = mg$ なので、$S\sin\theta = mg\tan\theta$ とおけます。式の両辺の $m$ と $\sin\theta$ は約分されて消え、角速度が簡単な形 $\omega^{2} = g/(L\cos\theta)$ で求まります。`,
      pro: R`$\omega = \sqrt{g/(L\cos\theta)}$、$v = \sqrt{gr\tan\theta}$。$m$ には無関係。`
    };
  }

  // 周期 T = 2π/ω
  function stConeT(r) {
    return {
      t: '周期',
      m: [R`T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{L\cos\theta}{g}}`,
        R`T = \frac{` + twoPi(r) + '}{' + fit([r.w], (x) => 2 * r.pi / x, r.T)[0] + '} = ' + sig(r.T) + SEC],
      n: R`1 周の時間 $T = \frac{2\pi}{\omega}$ です。$L\cos\theta$ は、支点から円の面までの鉛直方向の深さ $h$ なので、$T = 2\pi\sqrt{\frac{h}{g}}$ とも書けます（深さ $h = ` + sig(r.hd) + R`\,\mathrm{m}$）。`,
      easy: R`角速度が分かれば、1 周にかかる時間（周期）は $T = 2\pi/\omega$ です。式を整理すると、周期は「支点から円の面までの深さ」だけで決まる、という面白い性質があります。糸が長くても、深さが同じなら周期は同じです。`,
      pro: R`$T = 2\pi\sqrt{h/g}$（$h = L\cos\theta$: 支点から円の面までの深さ）。糸が長くても、深さが同じなら周期は等しい。`
    };
  }

  // 検算（向心力の 2 通りの表し方）
  function stConeCheck(r) {
    const a = fit([r.Rr, r.w], (x, y) => r.m * x * y * y, r.m * r.Rr * r.w * r.w);
    return {
      t: '検算（向心力の 2 通りの表し方）',
      m: [R`m r\omega^{2} = ` + nf(r.m) + R` \times ` + a[0] + R` \times ` + a[1] + R`^{2} = ` + sig(r.m * r.Rr * r.w * r.w) + NN,
        R`mg\tan\theta = ` + nf(r.m) + R` \times 9.8 \times ` + fit([r.t], (x) => r.m * G * x, r.F)[0] + ' = ' + sig(r.F) + NN],
      n: R`向心力を「$mr\omega^{2}$」と「$mg\tan\theta$」の 2 通りで計算して、一致することを確かめます。` + (r.approx ? R`三角比には近似値を使っているので、最後の桁が 1 だけちがうことがあります。` : ''),
      lv: 2
    };
  }

  // 周期から糸の角度を求める（計算機で「周期を与える」とき）
  function stConePeriod(r, T) {
    const w = 2 * PI / T;
    return {
      t: R`周期から糸の角度 $\theta$ を求める`,
      m: [R`\omega = \frac{2\pi}{T} = \frac{2\pi}{` + nf(T) + '} = ' + sig(w) + RADS,
        R`\omega^{2} = \frac{g}{L\cos\theta} \;\Rightarrow\; \cos\theta = \frac{g}{L\omega^{2}} = \frac{9.8}{` + nf(r.L) + R` \times ` + fit([w], (x) => G / (r.L * x * x), r.c)[0] + R`^{2}} = ` + sig(r.c),
        R`\theta = ` + sig(r.thDeg) + R`\degree`],
      n: R`周期 $T$ から角速度 $\omega = \frac{2\pi}{T}$ が分かります。円錐振り子の角速度は $\omega^{2} = \frac{g}{L\cos\theta}$（導出は次のステップ）なので、これを $\cos\theta$ について解いて角度を決めます。周期が長すぎると $\cos\theta > 1$ となり、円錐振り子になりません（$T < 2\pi\sqrt{L/g}$ が必要）。`,
      easy: R`糸の角度は、まだ分かっていません。円錐振り子は、回る速さを上げるほど、おもりが外へ飛び出して、糸が大きく開きます（角度 $\theta$ が大きくなります）。逆に、ゆっくりだと糸はほぼ鉛直に垂れます。ここでは周期（1 周の時間）が分かっているので、先に角速度 $\omega = 2\pi/T$ を出して、次のステップで導く式 $\omega^{2} = g/(L\cos\theta)$ から $\cos\theta$ と $\theta$ を逆算します。`,
      lv: 2
    };
  }

  // 角速度 ω から、張力 S と cosθ を求める（演習 adv: ω が分かっていて、角度は未知）
  function stConeSC(r) {
    return {
      t: R`張力 $S$ と $\cos\theta$ を求める`,
      m: [R`S\sin\theta = mr\omega^{2} = mL\sin\theta\,\omega^{2} \;\Rightarrow\; S = mL\omega^{2}`,
        R`S\cos\theta = mg \;\Rightarrow\; \cos\theta = \frac{mg}{S} = \frac{g}{L\omega^{2}}`,
        R`\cos\theta = \frac{g}{L\omega^{2}} = \frac{9.8}{` + nf(r.L) + R` \times ` + nf(r.w) + R`^{2}} = ` + sig(r.c),
        R`S = mL\omega^{2} = ` + nf(r.m) + R` \times ` + nf(r.L) + R` \times ` + nf(r.w) + R`^{2} = ` + sig(r.S) + NN],
      n: R`角度 $\theta$ が分かっていないので、まず水平方向の式 $S\sin\theta = mr\omega^{2}$ に $r = L\sin\theta$ を入れます。両辺の $\sin\theta$ が約分されて、張力は $S = mL\omega^{2}$ と、角度を知らなくても求まります。次に、鉛直方向のつり合い $S\cos\theta = mg$ から $\cos\theta = \frac{mg}{S} = \frac{g}{L\omega^{2}}$ が得られます。`,
      easy: R`円の半径 $r$ は $L\sin\theta$ です。水平方向の式 $S\sin\theta = m r\omega^{2}$ の $r$ にこれを入れると、両側に $\sin\theta$ が出てくるので消えて、$S = mL\omega^{2}$ になります（角度が分からなくても、糸の張力が出ます）。張力が分かったので、鉛直方向のつり合い（$S\cos\theta = mg$）から $\cos\theta = mg/S$ を求めます。`,
      pro: R`角速度が与えられたら $S = mL\omega^{2}$、$\cos\theta = \frac{g}{L\omega^{2}}$。$\cos\theta < 1$ となる条件は $\omega^{2} > \frac{g}{L}$（これより遅いと円錐振り子にならない）。`
    };
  }

  // cosθ から半径 r（演習 adv）
  function stConeRC(r) {
    const sc = fit([r.c], (x) => r.L * Math.sqrt(1 - x * x), r.Rr)[0];
    return {
      t: '円運動の半径 $r$',
      m: [R`r = L\sin\theta = L\sqrt{1 - \cos^{2}\theta}`,
        R`r = ` + nf(r.L) + R` \times \sqrt{1 - ` + sc + R`^{2}} = ` + sig(r.Rr) + MM],
      n: R`$\cos\theta$ が分かったので、$\sin\theta = \sqrt{1 - \cos^{2}\theta}$ から、半径 $r = L\sin\theta$ が求まります。`,
      easy: R`$\sin^{2}\theta + \cos^{2}\theta = 1$ なので、$\cos\theta$ が分かれば $\sin\theta = \sqrt{1 - \cos^{2}\theta}$ も分かります。円の半径は、糸の長さ $L$ に $\sin\theta$ をかけたものです。`
    };
  }

  // 計算機（compute）の解説。fromPeriod: 周期を与えたとき、その周期
  function coneSteps(r, fromPeriod) {
    const steps = [];
    if (fromPeriod) steps.push(stConePeriod(r, fromPeriod));
    steps.push(stConeSetup(), stConeR(r), stConeS(r), stConeF(r), stConeOmega(r), stConeT(r), stConeCheck(r));
    return steps;
  }

  JK.registerSim({
    id: 'mech-conical',
    field: '力学',
    unit: 'p-circular',
    title: '円錐振り子（水平面内の円運動）',
    desc: R`糸の先のおもりが、水平面内で等速円運動をする「円錐振り子」です。糸の長さ $L$ と、糸が鉛直となす角 $\theta$（または周期 $T$）から、糸の張力 $S$・向心力・速さ・角速度・周期を求めます。`,
    form: [R`S\cos\theta = mg,\quad S\sin\theta = mr\omega^{2}`, R`r = L\sin\theta,\quad \omega = \sqrt{\frac{g}{L\cos\theta}}`, R`T = 2\pi\sqrt{\frac{L\cos\theta}{g}}`],
    inputs: [
      { key: 'm', label: 'おもりの質量 m', unit: 'kg', type: 'num', def: '0.50', min: 0.001, max: 1000 },
      { key: 'L', label: '糸の長さ L', unit: 'm', type: 'num', def: '1.0', min: 0.01, max: 100 },
      { key: 'given', label: '与える量', type: 'select', def: 'theta', options: [['theta', '糸が鉛直となす角 θ'], ['period', '周期 T']] },
      { key: 'th', label: '糸が鉛直となす角 θ', unit: '°', type: 'num', def: '30', min: 1, max: 89, show: (raw) => raw.given !== 'period' },
      { key: 'Tp', label: '周期 T', unit: 's', type: 'num', def: '1.8', min: 0.001, max: 1000, hint: 'T < 2π√(L/g) の範囲', show: (raw) => raw.given === 'period' }
    ],
    examples: [
      { label: '角度 30° を与える', v: { m: '0.50', L: '1.0', given: 'theta', th: '30', Tp: '1.8' } },
      { label: '角度 60° を与える', v: { m: '0.20', L: '0.50', given: 'theta', th: '60', Tp: '1.8' } },
      { label: '周期 1.8 秒を与える', v: { m: '0.50', L: '1.0', given: 'period', th: '30', Tp: '1.8' } }
    ],
    intro: {
      easy: R`糸の先におもりをつけて、水平な円を描くように回すと、糸が円錐の側面をなぞるので「円錐振り子」といいます。おもりにはたらく力は、糸の張力 $S$ と重力 $mg$ だけです。**上下には動かない**ので、鉛直方向の力はつり合い、**横方向の合力が円の中心を向く向心力**になります。糸の力 $S$ を「真上向き」と「横向き」に分けて、鉛直方向のつり合いの式と、水平方向の円運動の式を立てるのがコツです。円の半径は、糸の長さではなく $L\sin\theta$ であることに注意しましょう。`,
      normal: R`鉛直: $S\cos\theta = mg$。水平（向心方向）: $S\sin\theta = mr\omega^{2} = m\frac{v^{2}}{r}$、$r = L\sin\theta$。これらから $S = \frac{mg}{\cos\theta}$、$\omega = \sqrt{\frac{g}{L\cos\theta}}$、$T = 2\pi\sqrt{\frac{L\cos\theta}{g}}$。`,
      pro: R`向心力 $= mg\tan\theta$、$v = \sqrt{gr\tan\theta}$、周期は支点から円の面までの深さ $h = L\cos\theta$ だけで決まる（$T = 2\pi\sqrt{h/g}$）。`
    },
    compute(v) {
      let thDeg = v.th, fromPeriod = null;
      if (v.given === 'period') {
        const c = G * v.Tp * v.Tp / (4 * PI * PI * v.L);
        if (!(c < 1)) {
          throw new JK.CalcError('この周期では円錐振り子になりません（周期は T < 2π√(L/g) = ' + pl(2 * PI * Math.sqrt(v.L / G)) + ' s の範囲）。周期を短くするか、糸を長くしてください。');
        }
        if (c < 1e-3) throw new JK.CalcError('周期が短すぎて、糸がほぼ水平になってしまいます。周期を長くするか、糸を短くしてください。');
        thDeg = Math.acos(c) * 180 / PI;
        fromPeriod = v.Tp;
      }
      const r = solveCone(v.m, v.L, thDeg);
      return {
        result: [
          { label: '円運動の半径 r = L sinθ', tex: sig(r.Rr) + MM },
          { label: '糸の張力 S', tex: sig(r.S) + NN },
          { label: '向心力 F = mg tanθ', tex: sig(r.F) + NN },
          { label: '速さ v', tex: sig(r.v) + MS },
          { label: '角速度 ω', tex: sig(r.w) + RADS },
          { label: '周期 T', tex: sig(r.T) + SEC }
        ].concat(fromPeriod ? [{ label: '糸の角度 θ', tex: sig(r.thDeg) + R`\degree` }] : []),
        steps: coneSteps(r, fromPeriod),
        fig: figCone(r)
      };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      const tol = { rel: 0.02 };
      const trig = { 30: { c: 0.866, s: 0.500, t: 0.577 }, 37: { c: 0.800, s: 0.600, t: 0.750 }, 45: { c: 0.707, s: 0.707, t: 1.00 }, 60: { c: 0.500, s: 0.866, t: 1.73 } };
      if (level === 'basic' || level === 'mid') {
        const th = rng.pick([30, 37, 45, 60]);
        const m = rng.pick([0.10, 0.20, 0.30, 0.50, 1.0, 1.5, 2.0]);
        const L = rng.pick([0.50, 0.80, 1.0, 1.5, 2.0, 2.5]);
        const tg = trig[th];
        // 問題文で与える近似値（三角比・円周率）で計算する。答えも解説も、この値から出す
        const r = solveCone(m, L, th, { c: tg.c, s: tg.s, t: tg.t, pi: 3.14 });
        const note = R`$\sin ` + th + R`\degree = ` + tg.s.toFixed(3) + R`$、$\cos ` + th + R`\degree = ` + tg.c.toFixed(3) + R`$、$\tan ` + th + R`\degree = ` + tg.t.toFixed(3) + R`$ とする。`;
        const head = R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を天井に固定し、他端に質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけた。おもりを水平面内で等速円運動させたところ、糸は鉛直と $` + th + R`\degree$ の角をなした。` + gtxt + note;
        if (level === 'basic') {
          return {
            title: '円錐振り子の張力と向心力',
            body: head + R`次の問いに答えよ。`,
            fig: figCone(r, { problem: true }),
            parts: [
              { label: '(1)', q: R`糸の張力の大きさ $S$`, type: 'num', answer: P3(r.S), rel: tol.rel, unit: 'N' },
              { label: '(2)', q: R`おもりにはたらく向心力の大きさ $F$`, type: 'num', answer: P3(r.F), rel: tol.rel, unit: 'N' }
            ],
            // 設問の順（S → F）。角速度・周期は聞かれないので出さない
            solution: [stConeSetup(), stConeS(r), stConeF(r)]
          };
        }
        return {
          title: '円錐振り子の速さと周期',
          body: head + R`円周率を $\pi = 3.14$ として、次の問いに答えよ。`,
          fig: figCone(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`円運動の半径 $r$`, type: 'num', answer: P3(r.Rr), rel: tol.rel, unit: 'm' },
            { label: '(2)', q: R`おもりの速さ $v$`, type: 'num', answer: P3(r.v), rel: tol.rel, unit: 'm/s' },
            { label: '(3)', q: R`円運動の周期 $T$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 's' }
          ],
          // 設問の順（r → ω を使って v → T）。張力は聞かれないので出さない
          solution: [stConeSetup(), stConeR(r), stConeOmega(r), stConeT(r)]
        };
      }
      // adv: 角速度から角度（cosθ）を求める
      let L, w, m, cs;
      for (let i = 0; i < 300; i++) {
        L = rng.pick([0.50, 0.80, 1.0, 1.5, 2.0, 2.5]);
        w = rng.pick([4.0, 5.0, 6.0]);
        m = rng.pick([0.20, 0.50, 1.0]);
        cs = G / (w * w * L);
        if (cs > 0.3 && cs < 0.9) break;
      }
      if (!(cs > 0.3 && cs < 0.9)) { L = 1.0; w = 4.0; m = 0.50; cs = G / (w * w * L); }
      const sn = Math.sqrt(1 - cs * cs);
      const r = solveCone(m, L, Math.acos(cs) * 180 / PI);
      return {
        title: '角速度から糸の角度を求める円錐振り子',
        body: R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を天井に固定し、他端に質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけた。おもりを水平面内で等速円運動させると、角速度は $\omega = ` + w.toFixed(1) + R`\,\mathrm{rad/s}$ であった。糸が鉛直となす角を $\theta$ とする。` + gtxt + R`次の問いに答えよ。`,
        fig: figCone(r, { problem: true, caption: 'L = ' + pl(L) + ' m　m = ' + pl(m) + ' kg　ω = ' + pl(w) + ' rad/s' }),
        parts: [
          { label: '(1)', q: R`$\cos\theta$`, type: 'num', answer: P3(cs), rel: tol.rel },
          { label: '(2)', q: R`糸の張力の大きさ $S$`, type: 'num', answer: P3(m * G / cs), rel: tol.rel, unit: 'N' },
          { label: '(3)', q: R`おもりの円運動の半径 $r$`, type: 'num', answer: P3(L * sn), rel: tol.rel, unit: 'm' }
        ],
        // 角速度が既知で、角度が未知: S = mLω² と cosθ = g/(Lω²) から、半径 r = L sinθ の順
        solution: [stConeSetup(), stConeSC(r), stConeRC(r)]
      };
    }
  });
})();
