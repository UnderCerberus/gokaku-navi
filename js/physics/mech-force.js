/* 物理・力学 — 力のつり合い（unit: p-force0）
   mech-balance-strings: 2 本の糸でつるした物体の張力 / mech-balance-incline: 斜面上で静止する物体（垂直抗力・静止摩擦力・摩擦角） */
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
  // 与えられた値の表示: 有効数字 6 桁までの値（入力した値・その簡単な組合せ）はそのまま書く。0.0025 を 0.003 に丸めて見せると、
  // 表示の数値どうしの計算が結果と合わなくなる。桁の長い値（角度から求めた途中の値など）は従来どおり小数 3 桁
  const nf = (x) => {
    if (typeof x !== 'number' || !isFinite(x)) return U.fmt(x, 3);
    const s = String(Number(x.toPrecision(10)));
    if (s.replace(/^-/, '').replace(/e[+-]?\d+$/, '').replace('.', '').replace(/^0+/, '').length > 6) return U.fmt(x, 3);
    const m = /^(-?[\d.]+)e([+-]?\d+)$/.exec(s);
    return m ? m[1] + R` \times 10^{` + Number(m[2]) + '}' : s;
  };
  const nf4 = (x) => String(Number(x.toPrecision(5)));         // 三角比（問題文で与える 3 けたの値はそのまま、角度から求める値は有効数字 5 桁まで）
  const exact = (x) => String(Number(x.toPrecision(10)));      // 丸めずに書く（式の因数に使う重力 mg など。表示どおりに計算し直せるように）
  // 有効数字 3 桁にしたとき、ちょうど四捨五入の境目（0.4325 など）になる値か
  const isTie3 = (x) => x !== 0 && /^\d\.\d\d50*e/.test(Math.abs(x).toExponential(11));
  // 数値代入の式の結果。境目の値は、丸める前の値も書く（0.4325 ≒ 0.433）。表示の値どうしの計算が、結果と最後の桁で 1 ずれて見えるのを防ぐ
  const exact4 = (x) => String(Number(x.toPrecision(4)));
  const sigTie = (x) => (isTie3(x) ? exact4(x) + R` \fallingdotseq ` + sig(x) : sig(x));
  const rad = (deg) => deg * PI / 180;
  const NN = R`\,\mathrm{N}`;

  /* =====================================================================
     2 本の糸でつるした物体
     ===================================================================== */
  // ap: 問題文で与える三角比 {s1, c1, s2, c2, s12}（演習用。省略すると角度から計算する）
  function solveStrings(m, a1, a2, ap) {
    const r = { m: m, a1: a1, a2: a2, t1: rad(a1), t2: rad(a2) };
    r.W = m * G;
    r.c1 = Math.cos(r.t1); r.s1 = Math.sin(r.t1);
    r.c2 = Math.cos(r.t2); r.s2 = Math.sin(r.t2);
    r.s12 = Math.sin(r.t1 + r.t2);
    if (ap) { r.s1 = ap.s1; r.c1 = ap.c1; r.s2 = ap.s2; r.c2 = ap.c2; r.s12 = ap.s12; }
    r.T1 = r.W * r.c2 / r.s12;
    r.T2 = r.W * r.c1 / r.s12;
    return r;
  }

  // 天井・2 本の糸・おもり・（任意で）力の矢印
  function stringsFig(r, o) {
    o = o || {};
    const H = o.forces ? 270 : 196;
    const d = JK.plot.draw(360, H);
    const yc = 30;
    const k1 = Math.tan(r.t1), k2 = Math.tan(r.t2);
    const hc = Math.min(100, 140 * k1, 140 * k2);                    // 天井から結び目までの高さ（描画用）
    const hx1 = hc / k1, hx2 = hc / k2;
    const left = 180 - (hx1 + hx2) / 2;
    const cx = left + hx1, cy = yc + hc;
    const ax = left, bx = cx + hx2;
    d.hatch(14, yc, 346, yc, { side: -1 });
    d.line(ax, yc, cx, cy, { cls: 'dim', w: 1.5 });
    d.line(bx, yc, cx, cy, { cls: 'dim', w: 1.5 });
    const bw = 70, bh = 32;
    d.rect(cx - bw / 2, cy, bw, bh, { cls: 'fg', fill: 'f1', rx: 3 });
    d.text(cx, cy + bh / 2 + 4, 'm = ' + U.fmt(r.m, 3) + ' kg', { size: 11 });
    d.dot(cx, cy, { cls: 'fg', r: 3 });
    // 糸と天井のなす角。2 本の糸が離れているときは弧のそばに数値つきで、近いときは記号だけにして下の凡例に数値を書く
    const pl = (px, py, rr, a) => [px + rr * Math.cos(rad(a)), py - rr * Math.sin(rad(a))];
    const wide = (hx1 + hx2) > 150;
    const aTxt = 'θ₁ = ' + U.fmt(r.a1, 3) + '°　θ₂ = ' + U.fmt(r.a2, 3) + '°';
    d.arc(ax, yc, 30, -r.a1, 0, { cls: 'c3' });
    d.arc(bx, yc, 30, 180, 180 + r.a2, { cls: 'c3' });
    const rl = wide ? 64 : 46;
    // 角が小さいときは、ラベルが糸と重ならないよう糸の下側に置く
    const l1 = pl(ax, yc, rl, r.a1 < 25 ? -(r.a1 + 14) : -r.a1 / 2), l2 = pl(bx, yc, rl, r.a2 < 25 ? 180 + r.a2 + 14 : 180 + r.a2 / 2);
    d.text(l1[0], l1[1] + 4, wide ? 'θ₁ = ' + U.fmt(r.a1, 3) + '°' : 'θ₁', { cls: 'c3', size: 11 });
    d.text(l2[0], l2[1] + 4, wide ? 'θ₂ = ' + U.fmt(r.a2, 3) + '°' : 'θ₂', { cls: 'c3', size: 11 });
    if (o.forces) {
      const Fmax = Math.max(r.T1, r.T2, r.W);
      const len = (F) => Math.max(28, 70 * F / Fmax);
      d.arrow(cx, cy, cx - len(r.T1) * r.c1, cy - len(r.T1) * r.s1, { cls: 'c1', label: 'T₁', w: 2.2 });
      d.arrow(cx, cy, cx + len(r.T2) * r.c2, cy - len(r.T2) * r.s2, { cls: 'c2', label: 'T₂', lpos: -1, w: 2.2 });
      d.arrow(cx, cy + bh / 2, cx, cy + bh / 2 + len(r.W), { cls: 'c3', label: 'mg', w: 2.2 });
      if (!wide) d.text(180, H - 26, aTxt, { cls: 'dim', size: 11 });
      d.text(180, H - 8, 'T₁ = ' + sigPlain(r.T1) + ' N　T₂ = ' + sigPlain(r.T2) + ' N　mg = ' + sigPlain(r.W) + ' N', { cls: 'dim', size: 11 });
    } else if (!wide) d.text(180, H - 10, aTxt, { cls: 'dim', size: 11 });
    return d.svg();
  }
  // 図の文字用: 有効数字 3 桁の平文（指数表記にしない）
  function sigPlain(x) {
    const s = sig(x);
    return /times/.test(s) ? String(P3(x)) : s;
  }

  const stStringsForces = (r) => ({
    t: '物体にはたらく力を図に描き、つり合いの式を考える',
    n: R`物体の質量を $m$、糸 1, 2 が天井となす角を $\theta_{1}, \theta_{2}$ とします。物体にはたらく力は、**重力 $mg$**（下向き）、**糸 1 の張力 $T_{1}$**、**糸 2 の張力 $T_{2}$** の 3 つです（図）。物体は静止しているので、3 つの力の合力は 0 です（**力のつり合い**）。斜めの力 $T_{1}, T_{2}$ は、水平方向と鉛直方向に分けて考えます。`,
    easy: R`物体が止まっているのは、「引っ張り合いが完全に引き分けになっている」からです。力は向きがバラバラだと扱いにくいので、「真横」と「真上・真下」の 2 方向に分けて、それぞれの方向で「引き分け」の式を作ります。`,
    pro: R`静止 = 合力 0。3 力のつり合いは、水平・鉛直の 2 式に分けるか、力の三角形（ラミの定理）で解きます。`
  });

  const stStringsDecomp = (r) => ({
    t: '斜めの力を水平・鉛直の成分に分ける',
    m: [R`T_{1}:\ \ \text{水平 } T_{1}\cos\theta_{1},\ \ \text{鉛直 } T_{1}\sin\theta_{1}`,
      R`T_{2}:\ \ \text{水平 } T_{2}\cos\theta_{2},\ \ \text{鉛直 } T_{2}\sin\theta_{2}`],
    n: R`糸が天井（水平な線）となす角が $\theta$ のとき、張力 $T$ の水平成分は $T\cos\theta$、鉛直成分は $T\sin\theta$ です（斜辺が $T$、天井とのなす角が $\theta$ の直角三角形で考えます）。`,
    easy: R`斜めに引く力を、「真横に引く力」と「真上に引く力」の 2 つに置き換えます。直角三角形の斜辺が $T$、角が $\theta$ なら、横の辺は $T\cos\theta$、縦の辺は $T\sin\theta$ です。$\theta = 30\degree$ なら $\cos\theta \approx 0.87$、$\sin\theta = 0.5$ ですから、糸が寝ているほど（$\theta$ が小さいほど）横に引く成分が大きくなります。`,
    lv: 3
  });

  const stStringsHoriz = (r) => ({
    t: '水平方向のつり合い',
    m: [R`T_{1}\cos\theta_{1} = T_{2}\cos\theta_{2}`,
      R`T_{1} \times ` + nf4(r.c1) + R` = T_{2} \times ` + nf4(r.c2)],
    n: R`左へ引く力 $T_{1}\cos\theta_{1}$ と右へ引く力 $T_{2}\cos\theta_{2}$ が等しければ、水平方向に動きません。`,
    easy: R`物体が左右どちらにも動かないのは、左に引く力と右に引く力が同じ大きさだからです。糸 1 が左を引く力は $T_{1}\cos\theta_{1}$、糸 2 が右を引く力は $T_{2}\cos\theta_{2}$ なので、この 2 つを等しいとおきます。`
  });

  const stStringsVert = (r) => ({
    t: '鉛直方向のつり合い',
    m: [R`T_{1}\sin\theta_{1} + T_{2}\sin\theta_{2} = mg`,
      R`T_{1} \times ` + nf4(r.s1) + R` + T_{2} \times ` + nf4(r.s2) + R` = ` + nf(r.m) + R` \times 9.8 = ` + sigTie(r.W) + NN],
    n: R`上向きの力（2 本の糸が引く力の鉛直成分の和）と、下向きの重力 $mg$ が等しいとき、上下に動きません。`,
    easy: R`物体が落ちないのは、2 本の糸が「真上に引く力」の合計が、重さ $mg$ とちょうど等しいからです。糸 1 が真上に引く力は $T_{1}\sin\theta_{1}$、糸 2 は $T_{2}\sin\theta_{2}$ です。`
  });

  // o.given: 演習（三角比は問題文の値。θ₁ + θ₂ の正弦がどの値かも書く）
  const stStringsSolve = (r, o) => ({
    t: '連立方程式を解いて $T_{1}, T_{2}$ を求める',
    m: [R`T_{1} = \frac{mg\cos\theta_{2}}{\sin(\theta_{1}+\theta_{2})},\qquad T_{2} = \frac{mg\cos\theta_{1}}{\sin(\theta_{1}+\theta_{2})}`].concat(
      o && o.given ? [R`\theta_{1} + \theta_{2} = ` + (r.a1 + r.a2) + R`\degree \;\Rightarrow\; \sin(\theta_{1}+\theta_{2}) = ` +
        (r.a1 + r.a2 === 90 ? R`\sin 90\degree = ` + nf4(r.s12) : (r.a1 + r.a2 > 90 ? R`\sin ` + (r.a1 + r.a2) + R`\degree = \sin ` + (180 - r.a1 - r.a2) + R`\degree = ` + nf4(r.s12) : R`\sin ` + (r.a1 + r.a2) + R`\degree = ` + nf4(r.s12)))] : [],
      [R`T_{1} = \frac{` + exact(r.W) + R` \times ` + nf4(r.c2) + '}{' + nf4(r.s12) + '} = ' + sigTie(r.T1) + NN,
        R`T_{2} = \frac{` + exact(r.W) + R` \times ` + nf4(r.c1) + '}{' + nf4(r.s12) + '} = ' + sigTie(r.T2) + NN]),
    n: R`水平の式から $T_{2} = T_{1}\frac{\cos\theta_{1}}{\cos\theta_{2}}$。これを鉛直の式に代入すると $T_{1}\left(\sin\theta_{1} + \cos\theta_{1}\tan\theta_{2}\right) = mg$。加法定理 $\sin\theta_{1}\cos\theta_{2} + \cos\theta_{1}\sin\theta_{2} = \sin(\theta_{1}+\theta_{2})$ を使うと上の式になります。`,
    easy: R`2 つの式を連立して、未知数 $T_{1}, T_{2}$ を求めます。まず水平の式を $T_{2} = \cdots$ の形に直して、鉛直の式に入れると $T_{1}$ だけの式になり、そこから $T_{1}$、続いて $T_{2}$ が求まります。数値は電卓で計算して構いません（$\cos, \sin$ の値は図の角度から出します）。`,
    pro: R`両方の糸が同じ角 $\theta$ なら $T_{1} = T_{2} = \frac{mg}{2\sin\theta}$。糸が寝る（$\theta$ が小さい）ほど張力は急に大きくなる。`
  });

  const stStringsCheck = (r) => ({
    t: '検算（鉛直方向の確認）',
    m: [R`T_{1}\sin\theta_{1} + T_{2}\sin\theta_{2} = mg`, R`\text{左辺} = ` + sigTie(r.T1 * r.s1 + r.T2 * r.s2) + NN + R`,\quad \text{右辺} = ` + sigTie(r.W) + NN],
    n: R`求めた $T_{1}, T_{2}$ を鉛直方向の式に戻すと、重力 $mg = ` + sigTie(r.W) + R`\,\mathrm{N}$ に一致します。`,
    lv: 2
  });

  function stringsSteps(r) {
    return [stStringsForces(r), stStringsDecomp(r), stStringsHoriz(r), stStringsVert(r), stStringsSolve(r), stStringsCheck(r)];
  }

  JK.registerSim({
    id: 'mech-balance-strings',
    field: '力学',
    unit: 'p-force0',
    title: '2 本の糸でつるした物体',
    desc: R`質量 $m$ の物体を、天井から 2 本の糸でつるします。糸が天井となす角 $\theta_{1}, \theta_{2}$ から、水平・鉛直のつり合いの連立方程式を解いて、各糸の張力を求めます。`,
    form: [R`T_{1}\cos\theta_{1} = T_{2}\cos\theta_{2}`, R`T_{1}\sin\theta_{1} + T_{2}\sin\theta_{2} = mg`],
    inputs: [
      { key: 'm', label: R`質量 $m$`, unit: 'kg', type: 'num', def: '2.0', min: 0.01, max: 1000 },
      { key: 'th1', label: R`糸 1（左）が天井となす角 $\theta_{1}$`, unit: '°', type: 'num', def: '30', min: 5, max: 85 },
      { key: 'th2', label: R`糸 2（右）が天井となす角 $\theta_{2}$`, unit: '°', type: 'num', def: '60', min: 5, max: 85 }
    ],
    examples: [
      { label: '左右対称（45° と 45°）', v: { m: '2.0', th1: '45', th2: '45' } },
      { label: '30° と 60°（糸が直角）', v: { m: '2.0', th1: '30', th2: '60' } },
      { label: '糸が寝ている（15° と 20°）', v: { m: '1.0', th1: '15', th2: '20' } }
    ],
    intro: {
      easy: R`物体が止まっているときは、物体にはたらく力が「引き分け」（合力が 0）になっています。2 本の糸でつるした物体では、**横方向の引き分け**と**縦方向の引き分け**の 2 つの式ができます。斜めの糸の力は、「真横の力」と「真上の力」に分けて考えるのがコツです。この 2 つの式から、2 本の糸それぞれの張力が求まります。`,
      normal: R`水平方向 $T_{1}\cos\theta_{1} = T_{2}\cos\theta_{2}$、鉛直方向 $T_{1}\sin\theta_{1} + T_{2}\sin\theta_{2} = mg$ の連立方程式を解きます。`,
      pro: R`$T_{1} = \frac{mg\cos\theta_{2}}{\sin(\theta_{1}+\theta_{2})}$、$T_{2} = \frac{mg\cos\theta_{1}}{\sin(\theta_{1}+\theta_{2})}$（ラミの定理と同じ結果）。対称なら $T = \frac{mg}{2\sin\theta}$。`
    },
    compute(v) {
      const r = solveStrings(v.m, v.th1, v.th2);
      return {
        result: [
          { label: '糸 1 の張力 T₁', tex: sig(r.T1) + NN },
          { label: '糸 2 の張力 T₂', tex: sig(r.T2) + NN },
          { label: '重力 mg', tex: sig(r.W) + NN }
        ],
        steps: stringsSteps(r),
        fig: stringsFig(r, { forces: true })
      };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      // 問題文で与える三角比（3 けた）。答えも解説も、この値で計算する
      const S3 = { 30: 0.500, 37: 0.600, 45: 0.707, 53: 0.800, 60: 0.866 };
      const C3 = { 30: 0.866, 37: 0.800, 45: 0.707, 53: 0.600, 60: 0.500 };
      const S12 = { 75: 0.966, 90: 1, 105: 0.966 };                    // sin(θ₁ + θ₂)（105° は sin 75° と同じ）
      const tr3 = (a1, a2) => ({ s1: S3[a1], c1: C3[a1], s2: S3[a2], c2: C3[a2], s12: S12[a1 + a2] });
      if (level === 'basic') {
        const a = rng.pick([30, 45, 60]);
        const m = rng.pick([1.0, 2.0, 3.0, 4.0, 5.0, 6.0]);
        const r = solveStrings(m, a, a);
        const tr = U.exactTrig(a);
        return {
          title: '左右対称につるした物体',
          body: R`質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を、同じ長さの 2 本の軽い糸で天井からつるしたところ、物体は静止した。糸は天井となす角がそれぞれ $` + a + R`\degree$ であった。` + gtxt + R`$\sin ` + a + R`\degree = ` + tr.sin + R`$ として、糸 1 本あたりの張力の大きさ $T$ を求めよ。`,
          fig: stringsFig(r, { forces: false }),
          parts: [{ label: '(1)', q: R`糸 1 本あたりの張力の大きさ $T$`, type: 'num', answer: P3(r.T1), rel: 0.02, unit: 'N' }],
          solution: [
            stStringsForces(r),
            {
              t: R`鉛直方向のつり合い（左右対称なので $T_{1} = T_{2} = T$、$\theta_{1} = \theta_{2} = \theta$）`,
              m: [R`2T\sin\theta = mg`, R`T = \frac{mg}{2\sin\theta}`,
                R`T = \frac{` + nf(m) + R` \times 9.8}{2 \times ` + tr.sin + '} = ' + sigTie(r.T1) + NN],
              n: R`左右対称なので水平方向のつり合いは自動的に成り立ちます。鉛直方向は、2 本の糸が真上に引く力 $T\sin\theta$ の合計が重力 $mg$ に等しいという式だけで $T$ が求まります。`,
              easy: R`2 本の糸が同じ張力 $T$ で引いているので、真上に引く力は 1 本あたり $T\sin\theta$、2 本分で $2T\sin\theta$。これが重さ $mg$ を支えています。`
            },
            {
              t: '値の確認',
              n: R`糸が寝る（$\theta$ が小さい）ほど $\sin\theta$ が小さくなり、張力は大きくなります。$\theta = 30\degree$ なら $T = mg$ と重さに等しく、それより小さい角では $T$ は重さより大きくなります。`,
              lv: 2
            }
          ]
        };
      }
      if (level === 'mid') {
        // 2 本の糸が直交する組（30°-60° と 37°-53°。θ₁ + θ₂ = 90° で sin(θ₁ + θ₂) = 1）
        const pr = rng.pick([[30, 60], [60, 30], [37, 53], [53, 37]]);
        const a1 = pr[0], a2 = pr[1];
        const m = rng.pick([0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0]);
        const r = solveStrings(m, a1, a2, tr3(a1, a2));
        // 直交しているので sin θ₁ = cos θ₂、cos θ₁ = sin θ₂
        const note = R`$\sin ` + a1 + R`\degree = \cos ` + a2 + R`\degree = ` + S3[a1].toFixed(3) + R`$、$\cos ` + a1 + R`\degree = \sin ` + a2 + R`\degree = ` + C3[a1].toFixed(3) + R`$`;
        return {
          title: '角度の異なる 2 本の糸',
          body: R`質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を、2 本の軽い糸 1, 2 で天井からつるしたところ、物体は静止した。糸 1 が天井となす角は $` + a1 + R`\degree$、糸 2 が天井となす角は $` + a2 + R`\degree$ であった。` + gtxt + note + R` として、次の問いに答えよ。`,
          fig: stringsFig(r, { forces: false }),
          parts: [
            { label: '(1)', q: R`糸 1 の張力の大きさ $T_{1}$`, type: 'num', answer: P3(r.T1), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`糸 2 の張力の大きさ $T_{2}$`, type: 'num', answer: P3(r.T2), rel: 0.02, unit: 'N' }
          ],
          solution: [stStringsForces(r), stStringsDecomp(r), stStringsHoriz(r), stStringsVert(r), stStringsSolve(r, { given: true })]
        };
      }
      // adv: 角度の異なる糸 + 糸が耐えられる張力の上限
      const pr = rng.pick([[30, 45], [45, 30], [45, 60], [60, 45]]);
      const m = rng.pick([2.0, 3.0, 4.0, 5.0]);
      const r = solveStrings(m, pr[0], pr[1], tr3(pr[0], pr[1]));
      const kmax = Math.max(r.T1, r.T2) / r.W;                 // 重さに対する最大張力の比
      const Tmax = Math.ceil(Math.max(r.T1, r.T2) * 1.25 / 10) * 10 + rng.pick([0, 10]);   // 今の物体はつるせる（切れない）値にする
      const mMax = Tmax / (G * kmax);
      const strong = r.T1 >= r.T2 ? 1 : 2;
      return {
        title: '糸が耐えられる最大の質量',
        body: R`質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を、2 本の軽い糸 1, 2 で天井からつるしたところ、物体は静止した。糸 1 が天井となす角は $` + pr[0] + R`\degree$、糸 2 が天井となす角は $` + pr[1] + R`\degree$ であった。` + gtxt + R`$\sin 75\degree = 0.966$、$\cos 30\degree = 0.866$、$\cos 45\degree = \sin 45\degree = 0.707$、$\cos 60\degree = 0.500$、$\sin 30\degree = 0.500$、$\sin 60\degree = 0.866$ を使ってよい。次の問いに答えよ。`,
        fig: stringsFig(r, { forces: false }),
        parts: [
          { label: '(1)', q: R`糸 1 の張力の大きさ $T_{1}$`, type: 'num', answer: P3(r.T1), rel: 0.02, unit: 'N' },
          { label: '(2)', q: R`糸 2 の張力の大きさ $T_{2}$`, type: 'num', answer: P3(r.T2), rel: 0.02, unit: 'N' },
          { label: '(3)', q: R`どちらの糸も、張力が $` + Tmax.toFixed(0) + R`\,\mathrm{N}$ をこえると切れる。この 2 本の糸でつるすことのできる物体の質量の最大値 $m_{\max}$`, type: 'num', answer: P3(mMax), rel: 0.02, unit: 'kg' }
        ],
        solution: [
          stStringsForces(r), stStringsDecomp(r), stStringsHoriz(r), stStringsVert(r), stStringsSolve(r, { given: true }),
          {
            t: '切れる限界の質量',
            m: [R`T_{1} = \frac{mg\cos\theta_{2}}{\sin(\theta_{1}+\theta_{2})},\quad T_{2} = \frac{mg\cos\theta_{1}}{\sin(\theta_{1}+\theta_{2})} \quad (\text{どちらも } m \text{ に比例する})`,
              R`\cos\theta_{2} = ` + nf4(r.c2) + (r.c2 > r.c1 ? ' > ' : ' < ') + R`\cos\theta_{1} = ` + nf4(r.c1) + R` \;\Rightarrow\; T_{` + strong + R`} \text{ の方が大きい}`,
              R`T_{` + strong + R`} \le T_{\max} \;\Rightarrow\; m \le \frac{T_{\max}\sin(\theta_{1}+\theta_{2})}{g\cos\theta_{` + (3 - strong) + R`}}`,
              R`m_{\max} = \frac{` + Tmax + R` \times ` + nf4(r.s12) + R`}{9.8 \times ` + nf(strong === 1 ? r.c2 : r.c1) + '} = ' + sigTie(mMax) + R`\,\mathrm{kg}`],
            n: R`切れる限界の張力を $T_{\max} = ` + Tmax + R`\,\mathrm{N}$ とします。張力は質量に比例して大きくなるので、張力が大きい方の糸（糸 ` + strong + R`）が先に切れる限界に達します。その糸の張力が $T_{\max}$ になるときの質量が最大値です。` + R`数値は、問題文で与えられた値を直接代入します。`,
            easy: R`質量を大きくしていくと、2 本の糸の張力はどちらも質量に比例して大きくなります。強く引かれている（張力が大きい）方の糸が先に限界の $` + Tmax + R`\,\mathrm{N}$ に達するので、その糸で最大の質量が決まります。`
          }
        ]
      };
    }
  });

  /* =====================================================================
     斜面上で静止する物体
     ===================================================================== */
  // ap: 問題文で与える三角比 {s, c, t}（演習用。t は省略すると s / c。ap 自体を省略すると角度から計算する）
  function solveInc(m, deg, mu, ap) {
    const r = { m: m, deg: deg, mu: mu, th: rad(deg), given: !!ap };
    r.W = m * G;
    r.s = Math.sin(r.th); r.c = Math.cos(r.th); r.tan = Math.tan(r.th);
    if (ap) { r.s = ap.s; r.c = ap.c; r.tan = ap.t != null ? ap.t : ap.s / ap.c; }
    r.N = r.W * r.c;
    r.par = r.W * r.s;                                    // 重力の斜面方向成分
    r.fmax = mu * r.N;                                    // 最大静止摩擦力
    r.rest = r.tan <= mu + 1e-9;                          // すべり出さない条件 tanθ ≤ μ
    r.limit = Math.abs(r.tan - mu) < 1e-9;
    r.lam = Math.atan(mu) * 180 / PI;                     // 摩擦角
    return r;
  }

  // 斜面・物体・力（重力・垂直抗力・摩擦力 と、重力の成分）
  function inclineFig(r, o) {
    o = o || {};
    const d = JK.plot.draw(360, 246);
    const deg = r.deg, th = r.th;
    const x0 = 34, y0 = 214, base = 262;
    const top = Math.min(150, base * Math.tan(th));
    const bxl = top / Math.tan(th);
    const xr = x0 + bxl;
    d.hatch(x0 - 18, y0, x0 + base + 40, y0);
    d.poly([[x0, y0], [xr, y0], [xr, y0 - top]], { cls: 'fg', fill: 'f0' });
    if (deg > 3) {
      d.arc(x0, y0, 34, 0, deg, { cls: 'c3' });
      d.text(x0 + 52 * Math.cos(th / 2), y0 - 52 * Math.sin(th / 2) + 4, 'θ', { cls: 'c3', italic: true });
    }
    const t = 0.56, cx = x0 + bxl * t, cy = y0 - top * t;
    const ux = Math.cos(th), uy = -Math.sin(th);          // 斜面に沿って上向き
    const nx = -Math.sin(th), ny = -Math.cos(th);         // 斜面に垂直で外向き
    const bw = 44, bh = 28;
    const mx = cx + nx * bh / 2, my = cy + ny * bh / 2;   // 物体の中心
    d.rect(mx - bw / 2, my - bh / 2, bw, bh, { cls: 'fg', fill: 'f1', rot: deg, ox: mx, oy: my, rx: 3 });
    d.dot(mx, my, { cls: 'fg', r: 2 });
    if (o.forces !== false) {
      const k = 66 / r.W;                                  // px / N
      const L = (F) => Math.max(18, F * k);
      // 重力の成分（破線）: 斜面に平行（下向き）と、斜面に垂直（斜面を押す向き）
      const Lp = L(r.par), Ln = L(r.N);
      if (deg >= 12) {                                     // ゆるい斜面では mg と mg cosθ がほぼ重なるので省く
        d.arrow(mx, my, mx - ux * Lp, my - uy * Lp, { cls: 'dim', dash: true, w: 1.3 });
        d.text(mx - ux * Lp - 5, my - uy * Lp - 6, 'mg sinθ', { cls: 'dim', size: 11, anchor: 'end' });
        d.arrow(mx, my, mx - nx * Ln, my - ny * Ln, { cls: 'dim', dash: true, w: 1.3 });
        d.text(mx - nx * Ln + 6, my - ny * Ln + 12, 'mg cosθ', { cls: 'dim', size: 11, anchor: 'start' });
      }
      // 実際の力
      d.arrow(mx, my, mx, my + L(r.W), { cls: 'c2', label: 'mg', w: 2.2 });
      d.arrow(mx, my, mx + nx * L(r.N), my + ny * L(r.N), { cls: 'c1', label: 'N', w: 2.2 });
      const fval = r.rest ? r.par : r.fmax;
      if (fval > 1e-9) d.arrow(mx, my, mx + ux * L(fval), my + uy * L(fval), { cls: 'c3', label: r.rest ? 'f' : 'μN', lpos: -1, w: 2.2 });
    }
    if (o.F) d.arrow(mx, my, mx + ux * 62, my + uy * 62, { cls: 'c4', label: 'F', lpos: -1, w: 2.4 });
    d.text(190, 16, 'm = ' + U.fmt(r.m, 3) + ' kg　θ = ' + U.fmt(deg, 3) + '°' + (o.mu ? '　静止摩擦係数 μ = ' + U.fmt(r.mu, 3) : ''), { size: 12 });
    if (o.verdict) d.text(250, 232, o.verdict, { cls: r.rest ? 'c4' : 'c3', size: 12, bold: true });
    return d.svg();
  }

  // o.F: 斜面に沿って上向きの力 F を加える演習（力は 4 つ。静止摩擦力の向きは F の大きさで変わる）
  const stIncForces = (r, o) => ({
    t: '物体にはたらく力を図に描く',
    n: R`物体の質量を $m$、斜面の傾きを $\theta$、物体と斜面の間の静止摩擦係数を $\mu$ とします。` + (o && o.F
      ? R`物体にはたらく力は、**重力 $mg$**（鉛直下向き）、**垂直抗力 $N$**（斜面に垂直で外向き）、**静止摩擦力 $f$**、斜面に沿って上向きに加える**力 $F$** の 4 つです。静止摩擦力 $f$ の向きは、物体がすべろうとする向きと逆向きで、$F$ が小さいときは上向き、大きいときは下向きになります。物体が静止しているなら、4 つの力はつり合っています。`
      : R`物体にはたらく力は、**重力 $mg$**（鉛直下向き）、**垂直抗力 $N$**（斜面に垂直で外向き）、**静止摩擦力 $f$**（すべり落ちようとするのを止める向き = 斜面に沿って上向き）の 3 つです。物体が静止しているなら、3 つの力はつり合っています。`),
    easy: R`斜面に置いた物体は、重力で下へ引かれています。でも止まっているのは、斜面が物体を「押し返す力」（垂直抗力）と、「ずり落ちないように引き止める力」（静止摩擦力）がはたらいているからです。まず、どの向きにどんな力がはたらくかを図に描きましょう。`
  });

  const stIncDecomp = (r) => ({
    t: '重力を「斜面に平行」と「斜面に垂直」に分ける',
    m: [R`\text{斜面に平行（斜面下向き）: } mg\sin\theta = ` + nf(r.m) + R` \times 9.8 \times ` + nf4(r.s) + ' = ' + sigTie(r.par) + NN,
      R`\text{斜面に垂直（斜面を押す向き）: } mg\cos\theta = ` + nf(r.m) + R` \times 9.8 \times ` + nf4(r.c) + ' = ' + sigTie(r.N) + NN],
    n: R`斜面の傾き $\theta$ は、重力 $mg$ と「斜面に垂直な向き」のなす角にも等しくなります（図の破線の矢印）。このため、重力の斜面に平行な成分は $mg\sin\theta$、斜面に垂直な成分は $mg\cos\theta$ です。`,
    easy: R`重力は真下に向かっていますが、斜面の上では「斜面に沿ってずり落とそうとする分」と「斜面に押し付ける分」の 2 つに分けると考えやすくなります。斜面がなだらか（$\theta$ が小さい）なら、ずり落とそうとする分 $mg\sin\theta$ は小さく、押し付ける分 $mg\cos\theta$ は大きくなります。急な斜面ではその逆です。`,
    pro: R`$\theta \to 0$ で平行成分 $\to 0$、$\theta \to 90\degree$ で垂直成分 $\to 0$、と極端な場合で $\sin, \cos$ の取り違えを防ぐ。`
  });

  const stIncNormal = (r) => ({
    t: '斜面に垂直な方向のつり合い',
    m: [R`N = mg\cos\theta`, R`N = ` + nf(r.m) + R` \times 9.8 \times ` + nf4(r.c) + ' = ' + sigTie(r.N) + NN],
    n: R`斜面に垂直な方向には動かないので、垂直抗力 $N$ は重力の垂直成分 $mg\cos\theta$ と等しくなります。`,
    easy: R`物体は斜面にめり込みも浮き上がりもしません。つまり、斜面を押し付ける力（$mg\cos\theta$）と、斜面が押し返す力（垂直抗力 $N$）はつり合っています。`
  });

  const stIncFriction = (r) => ({
    t: '斜面に平行な方向のつり合い（静止摩擦力）',
    m: [R`f = mg\sin\theta`, R`f = ` + nf(r.m) + R` \times 9.8 \times ` + nf4(r.s) + ' = ' + sigTie(r.par) + NN],
    n: R`斜面に平行な方向でもつり合っているので、静止摩擦力 $f$ は重力の斜面成分 $mg\sin\theta$ と等しくなります。`,
    easy: R`物体がずり落ちないのは、斜面に沿って下へ引く力 $mg\sin\theta$ を、静止摩擦力 $f$ が同じ大きさで押さえているからです。引く力が大きくなれば、摩擦力もそれに合わせて大きくなります（ただし上限があります）。`,
    pro: R`静止摩擦力は「つり合いの式から決まる」量。$\mu N$ を代入してはいけない（$\mu N$ は上限値）。`
  });

  // 最大静止摩擦力 f₀ = μN。数値は、与えられた値（μ, m, cosθ）をそのまま入れる
  const stIncMax = (r) => ({
    t: R`最大静止摩擦力 $f_{0} = \mu N$`,
    m: [R`f_{0} = \mu N = \mu mg\cos\theta`,
      R`f_{0} = ` + nf(r.mu) + R` \times ` + nf(r.m) + R` \times 9.8 \times ` + nf4(r.c) + ' = ' + sigTie(r.fmax) + NN],
    n: R`静止摩擦力には上限があり、その上限が**最大静止摩擦力** $f_{0} = \mu N$ です。$N = mg\cos\theta$ なので、$f_{0} = \mu mg\cos\theta$ に数値を入れて求めます。`,
    easy: R`静止摩擦力は「必要なだけ」出せますが、出せる大きさには限界があります。その限界の大きさが最大静止摩擦力で、「摩擦係数 $\mu$ × 垂直抗力 $N$」で計算します。`
  });

  // すべり出すかどうかの判定。最大静止摩擦力 f₀ は stIncMax で求めた値と、重力の斜面成分 mg sinθ を比べる
  const stIncJudge = (r) => ({
    t: 'すべり出さない条件を確かめる',
    m: [R`f \le f_{0} = \mu N \;\Rightarrow\; mg\sin\theta \le \mu mg\cos\theta \;\Rightarrow\; \tan\theta \le \mu`,
      (r.given ? R`\tan\theta = \frac{\sin\theta}{\cos\theta} = \frac{` + nf4(r.s) + '}{' + nf4(r.c) + '} = ' : R`\tan\theta = `) + nf4(r.tan) + (r.limit ? ' = ' : (r.rest ? R` \le ` : R` > `)) + R`\mu = ` + nf(r.mu),
      R`mg\sin\theta = ` + sigTie(r.par) + NN + (r.limit ? ' = ' : (r.rest ? R` \le ` : R` > `)) + R`f_{0} = ` + sigTie(r.fmax) + NN],
    n: R`静止摩擦力には上限（最大静止摩擦力 $f_{0} = \mu N$）があります。斜面方向の力のつり合いで必要な摩擦力 $mg\sin\theta$ が、この上限以下なら静止し続け、上限を超えるとすべり出します。` + (r.rest ? (r.limit ? R`ちょうど限界の角度です（これ以上傾けるとすべり出します）。` : R`この条件では上限以下なので、物体は**すべり出さずに静止**します。`) : R`この条件では上限を超えるので、物体は**すべり出します**（摩擦力が重力の斜面成分に負けます）。`),
    easy: R`静止摩擦力は「必要なだけ出せる」のですが、出せる大きさには限界（最大静止摩擦力 $f_{0} = \mu N$）があります。斜面の角度を大きくしていくと、ずり落とそうとする力 $mg\sin\theta$ は増え、限界を超えたところですべり出します。式で整理すると、限界は $\tan\theta = \mu$ という簡単な形になります（両辺の $mg$ が約分されるので、質量にはよりません）。`,
    pro: R`すべらない条件は $\tan\theta \le \mu$（質量に無関係）。$\mu$ が分かれば限界角が、角度が分かれば必要な $\mu$ が出る。`
  });

  const stIncAngle = (r) => ({
    t: '摩擦角（すべり出す直前の角度）',
    m: [R`\tan\lambda = \mu = ` + nf(r.mu) + R` \;\Rightarrow\; \lambda = ` + sigTie(r.lam) + R`\degree`],
    n: R`$\tan\theta = \mu$ となる角 $\lambda$ を**摩擦角**といいます。斜面の傾きが $\lambda$ 以下なら物体は静止でき、$\lambda$ を超えるとすべり出します。`,
    easy: R`「どのくらい傾けるとすべり出すか」を表す角度が摩擦角です。ざらざらした面（$\mu$ が大きい）ほど、大きく傾けないとすべり出しません。この斜面では、約 $` + sig(r.lam) + R`\degree$ を超えると物体はすべり出します。`,
    lv: 2
  });

  function incSteps(r) {
    const s = [stIncForces(r), stIncDecomp(r), stIncNormal(r)];
    if (r.rest) s.push(stIncFriction(r));
    s.push(stIncMax(r), stIncJudge(r), stIncAngle(r));
    return s;
  }

  JK.registerSim({
    id: 'mech-balance-incline',
    field: '力学',
    unit: 'p-force0',
    title: '斜面上で静止する物体',
    desc: R`傾き $\theta$ の斜面に置いた物体について、垂直抗力・静止摩擦力を求め、すべり出さない条件 $\tan\theta \le \mu$ を判定します。すべり出す直前の角度（摩擦角）も示します。`,
    form: [R`N = mg\cos\theta`, R`f = mg\sin\theta`, R`f \le \mu N \;\Leftrightarrow\; \tan\theta \le \mu`],
    inputs: [
      { key: 'm', label: R`質量 $m$`, unit: 'kg', type: 'num', def: '5.0', min: 0.01, max: 1000 },
      { key: 'deg', label: R`斜面の角度 $\theta$`, unit: '°', type: 'num', def: '30', min: 1, max: 89 },
      { key: 'mu', label: R`静止摩擦係数 $\mu$`, type: 'num', def: '0.70', min: 0, max: 10, hint: '0 でなめらかな斜面（必ずすべり出す）' }
    ],
    examples: [
      { label: 'すべらず静止する', v: { m: '5.0', deg: '30', mu: '0.70' } },
      { label: 'すべり出す', v: { m: '5.0', deg: '40', mu: '0.50' } },
      { label: 'ちょうど限界（45°, μ=1）', v: { m: '2.0', deg: '45', mu: '1.0' } }
    ],
    intro: {
      easy: R`斜面に置いた物体が止まっているとき、物体にはたらく 3 つの力（重力・垂直抗力・静止摩擦力）はつり合っています。重力を「斜面に沿った成分」と「斜面に垂直な成分」に分けると、垂直な成分は垂直抗力と、斜面に沿った成分は摩擦力とつり合います。ただし摩擦力には上限があるので、斜面を傾けすぎると、物体はすべり出します。その境目が $\tan\theta = \mu$ です。`,
      normal: R`垂直方向: $N = mg\cos\theta$。斜面方向: $f = mg\sin\theta$。静止の条件は $f \le \mu N$、すなわち $\tan\theta \le \mu$。`,
      pro: R`静止摩擦力は「つり合いから決まる」値で、$\mu N$ はその上限。すべり出す直前の角（摩擦角）は $\tan\lambda = \mu$。質量には依らない。`
    },
    compute(v) {
      const r = solveInc(v.m, v.deg, v.mu);
      const res = [
        { label: '垂直抗力 N', tex: sig(r.N) + NN }
      ];
      if (r.rest) res.push({ label: '静止摩擦力 f', tex: sig(r.par) + NN });
      else res.push({ label: '斜面方向の重力成分 mg sinθ', tex: sig(r.par) + NN });
      res.push({ label: '最大静止摩擦力 μN', tex: sig(r.fmax) + NN });
      res.push({ label: '判定', tex: r.rest ? R`\text{すべらない（静止）}` : R`\text{すべり出す}` });
      res.push({ label: '摩擦角 λ（tanλ = μ）', tex: sig(r.lam) + R`\degree` });
      return {
        result: res,
        steps: incSteps(r),
        fig: inclineFig(r, { mu: true, verdict: r.rest ? (r.limit ? '限界ちょうど（静止）' : '静止する') : 'すべり出す' })
      };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      // 問題文で与える三角比（3 けた）。答えも解説も、この値で計算する
      const TR3 = { 30: { s: 0.500, c: 0.866, t: 0.577 }, 37: { s: 0.600, c: 0.800, t: 0.750 }, 45: { s: 0.707, c: 0.707, t: 1 }, 60: { s: 0.866, c: 0.500, t: 1.73 } };
      const trigNote = (deg) => R`$\sin ` + deg + R`\degree = ` + TR3[deg].s.toFixed(3) + R`$、$\cos ` + deg + R`\degree = ` + TR3[deg].c.toFixed(3) + R`$`;
      if (level === 'basic') {
        const deg = rng.pick([30, 37]);
        const mu = deg === 30 ? rng.pick([0.60, 0.70, 0.80]) : rng.pick([0.80, 0.90, 1.00]);
        const m = rng.pick([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0]);
        const r = solveInc(m, deg, mu, TR3[deg]);
        return {
          title: '斜面上で静止する物体',
          body: R`水平面と $` + deg + R`\degree$ の角をなすあらい斜面の上に、質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を置いたところ、物体は静止した。静止摩擦係数を $` + mu.toFixed(2) + R`$ とする。` + gtxt + trigNote(deg) + R` として、次の問いに答えよ。`,
          fig: inclineFig(r, { forces: false, mu: true }),
          parts: [
            { label: '(1)', q: R`斜面が物体におよぼす垂直抗力の大きさ $N$`, type: 'num', answer: P3(r.N), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`物体にはたらく静止摩擦力の大きさ $f$`, type: 'num', answer: P3(r.par), rel: 0.02, unit: 'N' }
          ],
          solution: [stIncForces(r), stIncDecomp(r), stIncNormal(r), stIncFriction(r)]
        };
      }
      if (level === 'mid') {
        const deg = rng.pick([30, 37]);
        const tn = TR3[deg].t;
        const slide = rng.bool(0.5);
        const mu = slide
          ? rng.pick([0.30, 0.40, 0.50].filter((x) => x < tn - 0.04))
          : (deg === 30 ? rng.pick([0.60, 0.70]) : rng.pick([0.80, 0.90]));
        const m = rng.pick([2.0, 4.0, 5.0]);
        const r = solveInc(m, deg, mu, TR3[deg]);
        return {
          title: 'すべり出すかどうかの判定',
          body: R`水平面と $` + deg + R`\degree$ の角をなすあらい斜面の上に、質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を静かに置いた。物体と斜面の間の静止摩擦係数を $` + mu.toFixed(2) + R`$ とする。` + gtxt + trigNote(deg) + R` として、次の問いに答えよ。`,
          fig: inclineFig(r, { forces: false, mu: true }),
          parts: [
            { label: '(1)', q: R`斜面が物体におよぼす垂直抗力の大きさ $N$`, type: 'num', answer: P3(r.N), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`最大静止摩擦力の大きさ $f_{0} = \mu N$`, type: 'num', answer: P3(r.fmax), rel: 0.02, unit: 'N' },
            { label: '(3)', q: R`重力の斜面に平行な成分 $mg\sin\theta$ と $f_{0}$ を比べて、物体の運動を判断せよ。`, type: 'choice', choices: ['すべり出さず、静止したままである', 'すべり出す'], answer: r.rest ? 0 : 1 }
          ],
          solution: [stIncForces(r), stIncDecomp(r), stIncNormal(r), stIncMax(r), stIncJudge(r)]
        };
      }
      // adv: 斜面に沿って力を加え、静止し続ける範囲 / すべり出す限界から μ を求める
      if (rng.bool(0.5)) {
        const mu = rng.pick([0.15, 0.20, 0.25]);
        const m = rng.pick([2.0, 3.0, 4.0, 5.0]);
        const r = solveInc(m, 30, mu, TR3[30]);
        const Fmin = r.W * (r.s - mu * r.c), Fmax = r.W * (r.s + mu * r.c);
        return {
          title: '斜面に沿って引き上げる力の範囲',
          body: R`水平面と $30\degree$ の角をなすあらい斜面の上に、質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を置き、斜面に平行な向きに上向きの力 $F$ を加える。物体と斜面の間の静止摩擦係数を $` + mu.toFixed(2) + R`$ とし、` + gtxt + R`$\sin 30\degree = 0.500$、$\cos 30\degree = 0.866$ として、次の問いに答えよ。`,
          fig: inclineFig(r, { forces: false, mu: true, F: true }),
          parts: [
            { label: '(1)', q: R`斜面が物体におよぼす垂直抗力の大きさ $N$`, type: 'num', answer: P3(r.N), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`物体が斜面を下向きにすべり落ちないために必要な、力 $F$ の最小値 $F_{\min}$`, type: 'num', answer: P3(Fmin), rel: 0.02, unit: 'N' },
            { label: '(3)', q: R`物体が斜面を上向きにすべり上がらないための、力 $F$ の最大値 $F_{\max}$`, type: 'num', answer: P3(Fmax), rel: 0.02, unit: 'N' }
          ],
          solution: [
            stIncForces(r, { F: true }), stIncDecomp(r), stIncNormal(r),
            {
              t: '$F$ が最小のとき（すべり落ちる寸前）',
              m: [R`F_{\min} + \mu N = mg\sin\theta`, R`F_{\min} = mg\sin\theta - \mu mg\cos\theta = mg(\sin\theta - \mu\cos\theta)`,
                R`F_{\min} = ` + nf(m) + R` \times 9.8 \times (` + nf4(r.s) + ' - ' + nf(mu) + R` \times ` + nf4(r.c) + ') = ' + sigTie(Fmin) + NN],
              n: R`$F$ が小さいと物体は下へすべり落ちようとし、摩擦力は上向きにはたらきます。ぎりぎり止まっている状態では、摩擦力は最大静止摩擦力 $\mu N$ に達しています。斜面に平行な方向のつり合いは、上向き（$F + \mu N$）= 下向き（$mg\sin\theta$）です。`,
              easy: R`力 $F$ が弱いと、物体は下へずり落ちようとします。このとき摩擦力は「上向き」に、出せる限界いっぱい（$\mu N$）まで頑張って支えます。それでも足りない分を $F$ が補う、と考えます。`
            },
            {
              t: '$F$ が最大のとき（すべり上がる寸前）',
              m: [R`F_{\max} = mg\sin\theta + \mu N = mg(\sin\theta + \mu\cos\theta)`,
                R`F_{\max} = ` + nf(m) + R` \times 9.8 \times (` + nf4(r.s) + ' + ' + nf(mu) + R` \times ` + nf4(r.c) + ') = ' + sigTie(Fmax) + NN],
              n: R`$F$ が大きいと物体は上へすべり上がろうとし、摩擦力は今度は下向きにはたらきます。ぎりぎり止まっている状態では、斜面に平行な方向のつり合いは、上向き（$F$）= 下向き（$mg\sin\theta + \mu N$）です。`,
              easy: R`今度は $F$ が強すぎて、物体は上へすべろうとします。摩擦力は逆向き（下向き）になり、これも限界の $\mu N$ まで頑張ります。つまり $F$ は、「重力の斜面成分 + 最大摩擦力」を超えない範囲なら、物体は静止し続けます。`
            }
          ]
        };
      }
      const deg0 = rng.pick([30, 45, 60]);
      const m = rng.pick([2.0, 3.0, 5.0]);
      const mu0 = TR3[deg0].t;
      const r = solveInc(m, deg0, mu0, TR3[deg0]);
      return {
        title: 'すべり出す角度から摩擦係数を求める',
        body: R`あらい板の上に質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を置き、板の傾きをゆっくり大きくしていったところ、水平面との角が $` + deg0 + R`\degree$ になったとき、物体がちょうどすべり出した。` + gtxt + trigNote(deg0) + R`、$\tan ` + deg0 + R`\degree = ` + TR3[deg0].t + R`$ として、次の問いに答えよ。`,
        fig: inclineFig(r, { forces: false }),
        parts: [
          { label: '(1)', q: R`物体と板の間の静止摩擦係数 $\mu$`, type: 'num', answer: P3(mu0), rel: 0.02 },
          { label: '(2)', q: R`すべり出す直前の、物体にはたらく静止摩擦力の大きさ $f$`, type: 'num', answer: P3(r.par), rel: 0.02, unit: 'N' },
          { label: '(3)', q: R`すべり出す直前の、板が物体におよぼす垂直抗力の大きさ $N$`, type: 'num', answer: P3(r.N), rel: 0.02, unit: 'N' }
        ],
        solution: [
          {
            t: 'すべり出す直前 = 静止摩擦力が最大',
            m: [R`f = \mu N,\quad f = mg\sin\theta,\quad N = mg\cos\theta`, R`\mu = \frac{f}{N} = \frac{mg\sin\theta}{mg\cos\theta} = \tan\theta`,
              R`\mu = \tan ` + deg0 + R`\degree = ` + sigTie(mu0)],
            n: R`物体の質量を $m$、板の傾き（水平面との角）を $\theta$、静止摩擦係数を $\mu$、静止摩擦力を $f$、垂直抗力を $N$ とします。すべり出す直前は、静止摩擦力が上限 $\mu N$ に達しています。斜面方向と垂直方向のつり合いの式を、$f = \mu N$ に代入すると、$mg$ が約分されて $\mu = \tan\theta$ が得られます（質量には依りません）。`,
            easy: R`板を傾けていくと、ずり落とそうとする力が少しずつ大きくなり、摩擦力もそれを支えるために大きくなります。支えきれなくなる限界（最大静止摩擦力）に達した瞬間が、すべり出す直前です。その瞬間の角度が分かれば、$\tan$（角度）で $\mu$ が分かります。`,
            pro: R`すべり出す直前の角 $\theta_{0}$ から $\mu = \tan\theta_{0}$。実験で静止摩擦係数を測る定番の方法。`
          },
          Object.assign(stIncFriction(r), { pro: R`すべり出す直前は $f = \mu N$（最大）。$f$ は $mg\sin\theta$ からも $\mu N$ からも出せるので、一方で求めて、もう一方で検算する。` }),
          stIncNormal(r),
          {
            t: R`検算: $f = \mu N$ になっているか`,
            m: [R`\mu N = \mu mg\cos\theta = ` + nf(mu0) + R` \times ` + nf(m) + R` \times 9.8 \times ` + nf4(r.c) + ' = ' + sigTie(mu0 * r.N) + NN],
            n: R`すべり出す直前は $f = \mu N$ が成り立つはずなので、$\mu N$ を計算して $f = ` + sigTie(r.par) + R`\,\mathrm{N}$ と比べます。ほぼ一致します（与えられた $\tan\theta$ は 3 けたの値なので、最後の桁が少しずれることがあります）。`,
            lv: 2
          }
        ]
      };
    }
  });
})();
