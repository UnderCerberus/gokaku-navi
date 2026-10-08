/* 物理・熱力学 — 熱量と比熱 / 熱量の保存（混合）/ 状態変化（融解・蒸発）
   ※ 構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const S3 = (x) => U.sig(x, 3);
  const P = (x) => U.paren(x);
  const p3 = (x) => U.roundSig(x, 3);
  const r2 = (x) => Math.round(x * 100) / 100;

  const CW = 4.2;      // 水の比熱 [J/(g·K)]
  const CICE = 2.1;    // 氷の比熱 [J/(g·K)]
  const LF = 334;      // 氷の融解熱 [J/g]
  const LV = 2260;     // 水の蒸発熱 [J/g]
  const MATS = { water: ['水', 4.2], iron: ['鉄', 0.45], cu: ['銅', 0.38], al: ['アルミニウム', 0.90] };
  const MAT_OPTIONS = [['water', '水（4.2）'], ['iron', '鉄（0.45）'], ['cu', '銅（0.38）'], ['al', 'アルミニウム（0.90）'], ['custom', '任意（比熱を入力）']];

  // 入力値・途中の値の TeX 表示（大きい/小さい数は ×10^n）
  function T(x) {
    if (typeof x !== 'number' || !isFinite(x)) return '0';
    const ax = Math.abs(x);
    if (ax !== 0 && (ax >= 1e5 || ax < 1e-3)) {
      let e = Math.floor(Math.log10(ax));
      let m = U.roundSig(x / Math.pow(10, e), 3);
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      let ms = String(m);
      if (ms.indexOf('.') < 0) ms += '.0';
      return ms + R` \times 10^{` + e + '}';
    }
    return U.fmt(x, 4);
  }
  // 丸めずに書く（途中の値を次の式に代入して見せるとき、表示どおりに計算し直せるように）。有効数字 10 桁でそろえて、末尾の 0 を除く
  function E(x) {
    if (typeof x !== 'number' || !isFinite(x)) return '0';
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e9 || ax < 1e-6) return T(x);
    return String(Number(x.toPrecision(10)));
  }
  // 有効数字 3 桁にしたとき、ちょうど四捨五入の境目（21950 など）になる値か
  const isTie3 = (x) => x !== 0 && /^\d\.\d\d50*e/.test(Math.abs(x).toExponential(11));
  // 結果の表示。境目の値は、丸める前の値も書く（21950 ≒ 2.20 × 10^4）。表示の値どうしの計算が、結果と 1 ずれて見えるのを防ぐ
  const S3t = (x) => (isTie3(x) ? E(x) + R` \fallingdotseq ` + S3(x) : S3(x));
  // 図中の文字用（TeX ではなく Unicode の上付き）
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(n) { return String(n).split('').map((c) => SUP[c] || c).join(''); }
  function tx(x) {
    if (typeof x !== 'number' || !isFinite(x)) return '0';
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = U.roundSig(x / Math.pow(10, e), 3);
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return String(m) + '×10' + sup(e);
    }
    return String(U.roundSig(x, 3));
  }
  function must() {
    for (let i = 0; i < arguments.length; i++) {
      if (!Number.isFinite(arguments[i])) throw new JK.CalcError('この入力では計算できません。値を見直してください。');
    }
  }

  /* ---------- 図の部品 ---------- */

  // 温度計。frac は水銀柱の高さの割合（0〜1）
  function thermometer(d, x, yT, yB, frac) {
    const f = Math.max(0.05, Math.min(0.97, frac));
    const h = yB - yT, fy = yB - h * f;
    d.rect(x - 4, yT, 8, h, { cls: 'fg', rx: 4 });
    d.group('<rect x="' + r2(x - 2.2) + '" y="' + r2(fy) + '" width="4.4" height="' + r2(yB - fy + 4) + '" class="fs-c3" stroke="none"/>');
    d.circle(x, yB + 7, 7.5, { cls: 'c3', fill: 'f3' });
  }
  // 水入りのビーカー / 金属のかたまり
  function body(d, mat, name, cx, yb) {
    const w = 60;
    if (mat === 'water') {
      const h = 66, x0 = cx - w / 2, x1 = cx + w / 2, yt = yb - h;
      d.group('<rect x="' + r2(x0 + 1.5) + '" y="' + r2(yt + h * 0.3) + '" width="' + r2(w - 3) + '" height="' + r2(h * 0.7 - 1) + '" class="fl-f1" stroke="none"/>');
      d.path('M' + r2(x0) + ' ' + r2(yt) + ' L' + r2(x0 + 3) + ' ' + r2(yb) + ' L' + r2(x1 - 3) + ' ' + r2(yb) + ' L' + r2(x1) + ' ' + r2(yt), { cls: 'fg' });
      d.text(cx, yb - 18, name);
    } else {
      const h = 54;
      const fill = mat === 'iron' ? 'f0' : (mat === 'cu' ? 'f3' : (mat === 'al' ? 'f4' : 'f2'));
      d.rect(cx - w / 2, yb - h, w, h, { cls: 'fg', fill: fill, rx: 3 });
      d.text(cx, yb - h / 2 + 4, name);
    }
  }

  /* ================= 1. 熱量と比熱 ================= */

  // opt: { q: 熱量の表示（文字列 or 行の配列）, t2: あとの温度の表示, cap: 下の説明 } — 演習では未知の値を '?' にして渡す
  function capacityFigure(o, r, opt) {
    opt = opt || {};
    const d = JK.plot.draw(360, 234);
    const lo = Math.min(o.t1, o.t2), span = Math.max(Math.abs(o.t2 - o.t1), 1e-9);
    const frac = (t) => (t - (lo - span * 0.5)) / (span * 2);
    const yb = 172;
    d.hatch(12, yb + 1, 348, yb + 1);
    body(d, o.mat, o.name, 52, yb);
    body(d, o.mat, o.name, 308, yb);
    thermometer(d, 100, 62, 152, frac(o.t1));
    thermometer(d, 258, 62, 152, frac(o.t2));
    d.text(76, 28, 'はじめ');
    d.text(283, 28, 'あと');
    d.text(76, 200, 't₁ = ' + tx(o.t1) + ' ℃');
    d.text(283, 200, opt.t2 || ('t₂ = ' + tx(o.t2) + ' ℃'));
    d.arrow(124, 124, 236, 124, { cls: r.heating ? 'c3' : 'c1', w: 2.4 });
    d.text(180, 108, r.heating ? '熱を吸収（温度が上がる）' : '熱を放出（温度が下がる）');
    const q = opt.q || ('Q = ' + (r.Q >= 0 ? '+' : '−') + tx(Math.abs(r.Q)) + ' J');
    (Array.isArray(q) ? q : [q]).forEach((line, i) => d.text(180, 148 + i * 15, line));
    d.text(180, 224, opt.cap || (o.name + '  m = ' + tx(o.m) + ' g,  c = ' + tx(o.c) + ' J/(g·K)'), { size: 11 });
    return d.svg();
  }

  function capacityCalc(o) {
    const dT = o.t2 - o.t1;
    const C = o.m * o.c;
    const Q = C * dT;
    return { dT: dT, C: C, Q: Q, heating: dT > 0 };
  }

  function capacitySteps(o, r) {
    const heating = r.heating;
    return [
      {
        t: '図で状況をつかむ',
        n: R`質量 $m = ` + T(o.m) + R`\,\mathrm{g}$ の` + o.name + R`の温度が、はじめの $t_{1} = ` + T(o.t1) + R`\degree\mathrm{C}$ から、あとの $t_{2} = ` + T(o.t2) + R`\degree\mathrm{C}$ に` +
          (heating ? '**上がり**ます。温度が上がったのは、外から熱を**吸収**したからです。' : '**下がり**ます。温度が下がったのは、外へ熱を**放出**したからです。') +
          R`この熱の量 $Q$（熱量）を求めます。`,
        easy: R`**熱量**とは、物体に出入りする熱のエネルギーの量のことで、単位はジュール（記号 $\mathrm{J}$）です。冷たい水をコンロにかけると、水は炎から熱をもらって温度が上がります。「温度が上がった = 熱をもらった」「温度が下がった = 熱を出した」と読み取ります。`
      },
      {
        t: R`温度変化 $\Delta T$ を求める`,
        m: [R`\Delta T = t_{2} - t_{1}`, R`\Delta T = ` + T(o.t2) + ' - ' + P(o.t1) + ' = ' + T(r.dT) + R`\,\mathrm{K}`],
        n: R`温度の「差」は、セ氏（$\degree\mathrm{C}$）で測っても絶対温度（$\mathrm{K}$）で測っても同じ数値になります。`,
        easy: R`たとえば $20\degree\mathrm{C}$ から $50\degree\mathrm{C}$ になったなら、$30$ 上がったので温度変化は $30\,\mathrm{K}$ です（$\mathrm{K}$ はケルビン。温度の「差」を表すときは $\degree\mathrm{C}$ と同じ大きさ）。`
      },
      {
        t: R`熱量の式 $Q = mc\Delta T$ に代入する`,
        m: [R`Q = mc\Delta T`, R`Q = ` + T(o.m) + R` \times ` + T(o.c) + R` \times ` + P(r.dT) + ' = ' + S3t(r.Q) + R`\,\mathrm{J}`],
        n: R`比熱 $c$ の物質 $m$ の温度を $\Delta T$ だけ変えるのに必要な熱量は $Q = mc\Delta T$ です。` +
          (heating ? '' : R`$\Delta T < 0$ なので $Q$ は負になります。これは熱を**放出**したことを表し、放出した熱量の大きさは $|Q|$ です。`),
        easy: R`比熱 $c$ は「$1\,\mathrm{g}$ の温度を $1\,\mathrm{K}$ 上げるのに必要な熱量」でした。$m\,\mathrm{g}$ なら $m$ 倍、温度を $\Delta T$ だけ変えるなら $\Delta T$ 倍の熱が必要なので、$Q = m \times c \times \Delta T$ と掛け算になります。重い物ほど、温度を大きく変えるほど、たくさんの熱が必要です。`,
        pro: R`符号つきで計算すると、吸収は $Q>0$・放出は $Q<0$ とそのまま読めます。熱量保存の問題では「失った熱 $= -Q$」と書くより、符号つきの $\sum Q = 0$ で立式するとミスが減ります。`
      },
      {
        t: R`熱容量 $C = mc$ を求める`,
        m: [R`C = mc`, R`C = ` + T(o.m) + R` \times ` + T(o.c) + ' = ' + S3t(r.C) + R`\,\mathrm{J/K}`],
        n: R`熱容量 $C$ は「物体**全体**の温度を $1\,\mathrm{K}$ 上げるのに必要な熱量」で、$Q = C\Delta T$ と書けます。比熱 $c$ は物質ごとの値（$1\,\mathrm{g}$ あたり）、熱容量 $C$ は物体まるごとの値です。`,
        easy: R`同じ水でも、大きな鍋は小さなコップより温まりにくいですよね。比熱は「水という物質」の性質、熱容量は「この鍋の水」という物体の性質です。`,
        pro: R`混合の問題では、各物体を熱容量 $C$ にまとめておくと $Q = C\Delta T$ だけで立式でき、式が短くなります。`
      },
      {
        t: '検算: 熱容量から求める',
        m: [R`Q = C\Delta T = ` + E(r.C) + R` \times ` + P(r.dT) + ' = ' + S3t(r.Q) + R`\,\mathrm{J}`],
        n: R`$Q = mc\Delta T$ と同じ値になりました。`,
        lv: 2
      },
      {
        t: '補足: 比熱の単位とカロリー',
        n: R`水 $1\,\mathrm{g}$ を $1\,\mathrm{K}$ 上げる熱量を、昔は $1\,\mathrm{cal}$（カロリー）と定めていました。$1\,\mathrm{cal}$ は約 $4.2\,\mathrm{J}$ にあたるので、水の比熱は約 $4.2\,\mathrm{J/(g\cdot K)}$ です。`,
        easy: R`食品に書いてある「カロリー」（$\mathrm{kcal}$）も同じ単位です。$1\,\mathrm{kcal}$ は $1000\,\mathrm{cal}$ で、約 $4200\,\mathrm{J}$ にあたります。`,
        lv: 3
      }
    ];
  }

  function capacityOf(v) {
    let name, c;
    if (v.mat === 'custom') { name = '物体'; c = v.c; }
    else { name = MATS[v.mat][0]; c = MATS[v.mat][1]; }
    return { mat: v.mat, name: name, c: c, m: v.m, t1: v.t1, t2: v.t2 };
  }

  JK.registerSim({
    id: 'thermo-heat-capacity',
    field: '熱力学',
    unit: 'p-heat',
    title: '熱量と比熱・熱容量',
    desc: R`質量・比熱・温度変化から、物体が吸収（放出）した熱量 $Q = mc\Delta T$ と熱容量 $C = mc$ を求めます。`,
    form: [R`Q = mc\Delta T`, R`C = mc`, R`Q = C\Delta T`],
    inputs: [
      { key: 'mat', label: '物質', type: 'select', def: 'water', options: MAT_OPTIONS },
      { key: 'c', label: R`比熱 $c$`, unit: 'J/(g·K)', type: 'num', def: '1.0', min: 0.01, max: 10, show: (raw) => raw.mat === 'custom' },
      { key: 'm', label: '質量 $m$', unit: 'g', type: 'num', def: '200', min: 0.1, max: 100000 },
      { key: 't1', label: R`はじめの温度 $t_{1}$`, unit: '℃', type: 'num', def: '20', min: -50, max: 600 },
      { key: 't2', label: R`あとの温度 $t_{2}$`, unit: '℃', type: 'num', def: '50', min: -50, max: 600, hint: '温度が下がる場合は t₂ を t₁ より小さくします（Q は負 = 放出）' }
    ],
    examples: [
      { label: '水 200 g を温める', v: { mat: 'water', m: '200', t1: '20', t2: '50' } },
      { label: '鉄球が冷える', v: { mat: 'iron', m: '500', t1: '100', t2: '30' } },
      { label: '比熱を自分で入力', v: { mat: 'custom', c: '1.5', m: '100', t1: '10', t2: '40' } }
    ],
    intro: {
      easy: R`物体に熱を加えると温度が上がります。ところが、同じ熱を加えても**水はなかなか温まらず、鉄はすぐ熱くなる**というように、温まりやすさは物質ごとに違います。この「温まりにくさ」を表す数が**比熱**（$1\,\mathrm{g}$ の温度を $1\,\mathrm{K}$ 上げるのに必要な熱量）です。必要な熱量は $Q = mc\Delta T$（質量 × 比熱 × 温度変化）で計算できます。物体全体の「温まりにくさ」は**熱容量** $C = mc$ で表します。`,
      normal: R`熱量 $Q = mc\Delta T = C\Delta T$。比熱 $c$ は物質の性質、熱容量 $C$ は物体の性質（質量を含む）です。`,
      pro: R`熱の問題は「何が何 $\mathrm{K}$ 変化したか」を整理して $Q = C\Delta T$ をそろえるのが基本。水の比熱 $4.2\,\mathrm{J/(g\cdot K)}$ は必ず覚えておきます。`
    },
    compute(v) {
      const o = capacityOf(v);
      if (o.mat === 'water' && (o.t1 < 0 || o.t1 > 100 || o.t2 < 0 || o.t2 > 100)) {
        throw new JK.CalcError('水が液体なのは 0〜100 ℃ の間だけです。それ以外では氷や水蒸気に変わり、この式だけでは扱えません（「状態変化」のシミュレーターを使ってください）。');
      }
      if (o.t1 === o.t2) throw new JK.CalcError('はじめの温度とあとの温度が同じです（温度変化 0 なので熱量も 0）。違う値を入力してください。');
      const r = capacityCalc(o);
      must(r.Q, r.C, r.dT);
      return {
        result: [
          { label: '熱量 Q（吸収 +、放出 −）', tex: S3(r.Q) + R`\,\mathrm{J}` },
          { label: '熱容量 C', tex: S3(r.C) + R`\,\mathrm{J/K}` },
          { label: '温度変化 ΔT', tex: S3(r.dT) + R`\,\mathrm{K}` }
        ],
        steps: capacitySteps(o, r),
        fig: capacityFigure(o, r)
      };
    },
    exercise(rng, level) {
      const key = rng.pick(['water', 'iron', 'cu', 'al']);
      const name = MATS[key][0], c = MATS[key][1];
      const cTex = c.toFixed(c === 4.2 ? 1 : 2);
      const m = rng.pick([100, 200, 250, 500]);
      const t1 = rng.pick([10, 15, 20, 25]);
      if (level === 'basic') {
        const dT = rng.pick([10, 20, 30, 40, 50]);
        const o = { mat: key, name: name, c: c, m: m, t1: t1, t2: t1 + dT };
        const r = capacityCalc(o);
        return {
          title: name + 'を温めるのに必要な熱量',
          body: R`質量 $` + m + R`\,\mathrm{g}$ の` + name + R`を $` + t1 + R`\degree\mathrm{C}$ から $` + (t1 + dT) + R`\degree\mathrm{C}$ まで温めた。` + name + R`の比熱を $` + cTex + R`\,\mathrm{J/(g\cdot K)}$ とし、熱は外へ逃げないものとして、次の量を有効数字 3 桁で求めよ。`,
          fig: capacityFigure(o, r, { q: 'Q = ?' }),
          parts: [
            { label: '(1)', q: R`加えた熱量 $Q$`, type: 'num', answer: p3(r.Q), rel: 0.02, unit: 'J' },
            { label: '(2)', q: R`この` + name + R`全体の熱容量 $C$`, type: 'num', answer: p3(r.C), rel: 0.02, unit: 'J/K' }
          ],
          solution: capacitySteps(o, r)
        };
      }
      // 中堅・難関: ヒーターで加熱
      if (level === 'mid') {
        let Pw = 50, tau = 60;
        for (let k = 0; k < 80; k++) {
          const Pc = rng.pick([20, 30, 40, 50, 60, 100]);
          const tc = rng.pick([60, 90, 120, 150, 180, 300]);
          const dTc = Pc * tc / (m * c);
          if (dTc >= 5 && dTc <= 60 && (key !== 'water' || t1 + dTc <= 95)) { Pw = Pc; tau = tc; break; }
        }
        const Qh = Pw * tau;
        const dTx = Qh / (m * c);
        const o = { mat: key, name: name, c: c, m: m, t1: t1, t2: t1 + dTx };
        const solution = [
          {
            t: 'ヒーターが出した熱量',
            m: [R`Q = P\tau`, R`Q = ` + Pw + R` \times ` + tau + ' = ' + S3(Qh) + R`\,\mathrm{J}`],
            n: R`電力 $P$ は「$1$ 秒あたりに出す熱量」です。$\tau$ 秒間加熱したので $Q = P\tau$。熱はすべて物体に吸収されるので、物体が受け取る熱量もこの $Q$ です。`,
            easy: R`$\mathrm{W}$（ワット）は「$1$ 秒間に何 $\mathrm{J}$ の熱（エネルギー）を出すか」を表します。$` + Pw + R`\,\mathrm{W}$ なら $1$ 秒で $` + Pw + R`\,\mathrm{J}$、$` + tau + R`$ 秒なら $` + Pw + R` \times ` + tau + R`\,\mathrm{J}$ です。`
          },
          {
            t: R`熱量の式から温度上昇 $\Delta T$ を求める`,
            m: [R`Q = mc\Delta T \;\Rightarrow\; \Delta T = \frac{Q}{mc} = \frac{P\tau}{mc}`, R`\Delta T = \frac{` + Pw + R` \times ` + tau + '}{' + T(m) + R` \times ` + T(c) + '} = ' + S3t(dTx) + R`\,\mathrm{K}`],
            n: R`$Q = mc\Delta T$ を $\Delta T$ について解きます。$Q = P\tau$ なので、数値は $P$、$\tau$、$m$、$c$ を直接代入します。`,
            easy: R`「$1\,\mathrm{K}$ 上げるのに $mc$ だけ熱が要る」ので、加えた熱 $Q$ が $mc$ の何個分かを数えれば温度上昇が分かります。割り算で求めます。`
          },
          {
            t: R`加熱後の温度 $t_{2}$`,
            m: [R`t_{2} = t_{1} + \Delta T = t_{1} + \frac{P\tau}{mc}`, R`t_{2} = ` + T(t1) + R` + \frac{` + Pw + R` \times ` + tau + '}{' + T(m) + R` \times ` + T(c) + '} = ' + S3t(t1 + dTx) + R`\degree\mathrm{C}`],
            n: R`はじめの温度 $t_{1}$ に温度上昇 $\Delta T$ を足します。`,
            pro: R`温度上昇 $\Delta T = \dfrac{P\tau}{mc}$ を一気に書いて、数値は最後に代入すると計算ミスが減ります。`
          }
        ];
        return {
          title: name + 'をヒーターで加熱する',
          body: R`質量 $` + m + R`\,\mathrm{g}$ の` + name + R`を $` + t1 + R`\degree\mathrm{C}$ から、電力 $` + Pw + R`\,\mathrm{W}$ のヒーターで $` + tau + R`$ 秒間加熱した。ヒーターが出した熱はすべて` + name + R`に吸収されたものとし、` + name + R`の比熱を $` + cTex + R`\,\mathrm{J/(g\cdot K)}$ として、次の量を有効数字 3 桁で求めよ。`,
          fig: capacityFigure(o, capacityCalc(o), { q: ['ヒーター ' + Pw + ' W × ' + tau + ' s'], t2: 't₂ = ?' }),
          parts: [
            { label: '(1)', q: R`加えた熱量 $Q$`, type: 'num', answer: p3(Qh), rel: 0.02, unit: 'J' },
            { label: '(2)', q: R`温度の上昇 $\Delta T$`, type: 'num', answer: p3(dTx), rel: 0.02, unit: 'K' },
            { label: '(3)', q: R`加熱後の温度 $t_{2}$`, type: 'num', answer: p3(t1 + dTx), rel: 0.02, unit: '℃' }
          ],
          solution: solution
        };
      }
      // adv: 熱の一部が逃げる・比熱が未知
      const mk = rng.pick(['iron', 'cu', 'al']);
      const cc = MATS[mk][1], nm = MATS[mk][0];
      const dT0 = rng.pick([20, 30, 40, 50, 60]);
      let found = null;
      for (let k = 0; k < 200 && !found; k++) {
        const Pc = rng.pick([20, 25, 30, 40, 50, 60, 75, 80, 100]);
        const ec = rng.pick([0.80, 0.90, 0.75, 0.50, 0.60]);
        const tt = m * cc * dT0 / (ec * Pc);
        if (Math.abs(tt - Math.round(tt)) < 1e-9 && tt >= 30 && tt <= 900) found = { P: Pc, eta: ec, tau: Math.round(tt) };
      }
      if (!found) found = { P: 50, eta: 0.80, tau: Math.max(30, Math.round(m * cc * dT0 / 40)) };
      const Qa = found.eta * found.P * found.tau;
      const Cx = Qa / dT0;
      const cx = Cx / m;
      const o2 = { mat: 'custom', name: nm, c: cx, m: m, t1: t1, t2: t1 + dT0 };
      const r2c = capacityCalc(o2);
      const kTex = found.eta.toFixed(2), kNum = R`\frac{` + kTex + R` \times ` + found.P + R` \times ` + found.tau + '}';
      const solution = [
        {
          t: 'ヒーターが出した熱量と、物体に入った熱量',
          m: [R`Q_{\text{ヒーター}} = P\tau = ` + found.P + R` \times ` + found.tau + ' = ' + E(found.P * found.tau) + R`\,\mathrm{J}`,
            R`Q = kP\tau = ` + kTex + R` \times ` + found.P + R` \times ` + found.tau + ' = ' + S3t(Qa) + R`\,\mathrm{J}`],
          n: R`電力を $P$、加熱時間を $\tau$ とすると、ヒーターが出した熱量は $P\tau$ です。そのうち割合 $k$（$` + Math.round(found.eta * 100) + R`\% = ` + kTex + R`$）だけが物体に吸収されます（残りは空気などへ逃げた熱）。物体の温度変化に使われる熱量は $Q = kP\tau$ です。`,
          easy: R`ヒーターの熱が全部は物体に届かない、ということです。たとえばストーブの熱の一部が部屋の空気や壁に逃げるのと同じ。「届いた分だけ」が温度を上げます。`
        },
        {
          t: R`熱容量 $C$ を求める`,
          m: [R`Q = C\Delta T \;\Rightarrow\; C = \frac{Q}{\Delta T} = \frac{kP\tau}{\Delta T}`, R`C = ` + kNum + '{' + dT0 + '} = ' + S3t(Cx) + R`\,\mathrm{J/K}`],
          n: R`$Q = C\Delta T$（$C$ は熱容量、$\Delta T = ` + dT0 + R`\,\mathrm{K}$ は温度の上昇）を使います。$1\,\mathrm{K}$ あたりの熱量が熱容量です。数値は、問題文で与えられた値を直接代入します。`,
          easy: R`「$1\,\mathrm{K}$ 上げるのに何 $\mathrm{J}$ 必要か」が熱容量。$` + dT0 + R`\,\mathrm{K}$ 上げるのに $` + E(Qa) + R`\,\mathrm{J}$ かかったので、割り算で $1\,\mathrm{K}$ あたりが出ます。`
        },
        {
          t: R`比熱 $c$ を求める`,
          m: [R`C = mc \;\Rightarrow\; c = \frac{C}{m} = \frac{kP\tau}{m\Delta T}`, R`c = ` + kNum + '{' + m + R` \times ` + dT0 + '} = ' + S3t(cx) + R`\,\mathrm{J/(g\cdot K)}`],
          n: R`熱容量 $C = mc$ なので、質量で割れば比熱になります。値から物質（` + nm + R`）が推定できます。`,
          pro: R`$c = \dfrac{kP\tau}{m\Delta T}$ とまとめて立式し、最後に数値を入れる形が最短です。`
        }
      ];
      return {
        title: '比熱が未知の物体を加熱する',
        body: R`質量 $` + m + R`\,\mathrm{g}$ の金属のかたまりを $` + t1 + R`\degree\mathrm{C}$ から、電力 $` + found.P + R`\,\mathrm{W}$ のヒーターで $` + found.tau + R`$ 秒間加熱したところ、温度が $` + dT0 + R`\,\mathrm{K}$ 上がった。ヒーターが出した熱のうち、金属に吸収されたのは $` + Math.round(found.eta * 100) + R`\%$ だけで、残りは外へ逃げた。次の量を有効数字 3 桁で求めよ。`,
        fig: capacityFigure(Object.assign({}, o2, { name: '金属' }), r2c, { q: ['ヒーター ' + found.P + ' W × ' + found.tau + ' s', '（吸収されたのは ' + Math.round(found.eta * 100) + '%）'], cap: '金属  m = ' + tx(m) + ' g,  c = ?' }),
        parts: [
          { label: '(1)', q: R`金属が吸収した熱量 $Q$`, type: 'num', answer: p3(Qa), rel: 0.02, unit: 'J' },
          { label: '(2)', q: R`金属のかたまりの熱容量 $C$`, type: 'num', answer: p3(Cx), rel: 0.02, unit: 'J/K' },
          { label: '(3)', q: R`金属の比熱 $c$`, type: 'num', answer: p3(cx), rel: 0.02, unit: 'J/(g·K)' }
        ],
        solution: solution
      };
    }
  });

  /* ================= 2. 熱量の保存（混合） ================= */

  function mixingCalc(o) {
    const K1 = o.m1 * o.c1;
    const K2 = o.m2 * CW + o.C;
    const t = (K1 * o.t1 + K2 * o.t2) / (K1 + K2);
    return { K1: K1, K2: K2, t: t, Qlost: K1 * (o.t1 - t), Qgain: K2 * (t - o.t2) };
  }

  // opt.t: 熱平衡の温度ラベルの上書き（演習では 't = ?'）
  function mixingFigure(o, r, opt) {
    opt = opt || {};
    const span = o.t1 - o.t2;
    const ymin = o.t2 - span * 0.2, ymax = o.t1 + span * 0.2;
    const kk = 0.9;
    const f1 = (x) => r.t + (o.t1 - r.t) * Math.exp(-kk * x);
    const f2 = (x) => r.t + (o.t2 - r.t) * Math.exp(-kk * x);
    return JK.plot.graph({
      w: 360, h: 250, x: [0, 5], y: [ymin, ymax], grid: false, ticks: false, axis: ['時間', '温度'],
      curves: [{ f: f1, cls: 'c3' }, { f: f2, cls: 'c1' }],
      hlines: [{ y: o.t1, cls: 'c3' }, { y: o.t2, cls: 'c1' }, { y: r.t, cls: 'c4' }],
      points: [{ x: 0, y: o.t1, cls: 'c3' }, { x: 0, y: o.t2, cls: 'c1' }],
      labels: [
        { x: 2.9, y: o.t1 + span * 0.05, text: o.name1 + ' t₁ = ' + tx(o.t1) + ' ℃', cls: 'c3' },
        { x: 2.9, y: o.t2 - span * 0.1, text: '水 t₂ = ' + tx(o.t2) + ' ℃', cls: 'c1' },
        { x: 0.15, y: r.t + span * 0.04, text: opt.t || ('熱平衡 t = ' + tx(p3(r.t)) + ' ℃'), cls: 'c4' },
        { x: 0.75, y: f1(0.75) + span * 0.07, text: '熱を失う', cls: 'c3' },
        { x: 0.45, y: o.t2 - span * 0.1, text: '熱をもらう', cls: 'c1' }
      ]
    });
  }

  // 熱平衡の温度 t を、このあとの式（失った熱量・得た熱量）に代入して見せるときの値。
  // 有効数字 3 桁の t のまま、表示どおりに計算して結果が合うならそれを使う。合わなければ、合うところまで桁を増やす
  // （表示の t で計算した値が、丸める前の値と同じ 3 桁になり、かつ、丸めの境目ちょうどにならないこと）
  function tForHeat(o, r) {
    const d0 = Math.abs(r.t) < 10 ? 2 : 1;                 // 有効数字 3 桁の小数位
    for (let d = isTie3(r.t) ? d0 + 1 : d0; d <= d0 + 6; d++) {
      const tv = U.round(r.t, d);
      const vL = r.K1 * (o.t1 - tv), vG = r.K2 * (tv - o.t2);
      if (p3(vL) === p3(r.Qlost) && p3(vG) === p3(r.Qgain) && isTie3(vL) === isTie3(r.Qlost) && isTie3(vG) === isTie3(r.Qgain)) return { v: tv, extra: d > d0 };
    }
    return { v: r.t, extra: true };
  }

  // opt.ask: 'lost'（失った熱量を問う演習）/ 'gain'（得た熱量を問う演習）/ なし（計算機）。問われた熱量は lv 1 のステップで求める
  function mixingSteps(o, r, opt) {
    const ask = opt && opt.ask;
    const hasC = o.C > 0;
    const k2 = hasC ? R`m_{2}c_{2} + C` : R`m_{2}c_{2}`;
    const lowName = hasC ? '水と容器' : '水';
    const tu = tForHeat(o, r);
    const tNum = R`\frac{` + E(r.K1) + R` \times ` + T(o.t1) + ' + ' + E(r.K2) + R` \times ` + T(o.t2) + '}{' + E(r.K1) + ' + ' + E(r.K2) + '}';
    const tAns = tu.extra ? E(tu.v) + R` \fallingdotseq ` + S3(r.t) : S3(r.t);
    const qLost = R`Q_{\text{失}} = ` + E(r.K1) + R` \times (` + T(o.t1) + ' - ' + E(tu.v) + ') = ' + S3t(r.Qlost) + R`\,\mathrm{J}`;
    const qGain = R`Q_{\text{得}} = ` + E(r.K2) + R` \times (` + E(tu.v) + ' - ' + P(o.t2) + ') = ' + S3t(r.Qgain) + R`\,\mathrm{J}`;
    const tHow = tu.extra ? R`ここから先の計算では、丸める前の値に近い $t = ` + E(tu.v) + R`\degree\mathrm{C}$ を使います（$` + S3(r.t) + R`$ に丸めた値を使うと、最後の桁がずれることがあるためです）。` : '';
    const stLost = {
      t: '失った熱量を求める',
      m: [R`Q_{\text{失}} = m_{1}c_{1}(t_{1} - t)`, qLost],
      n: R`求めた $t$ を使って、高温の物体が失った熱量を「熱容量 × 温度の下がった幅 $(t_{1} - t)$」で計算します。` + tHow,
      easy: R`熱いものは温度が $t_{1}$ から $t$ まで下がりました。下がった幅 $(t_{1} - t)$ に、$1\,\mathrm{K}$ あたりの熱量（熱容量）を掛ければ、失った熱の量になります。`
    };
    const stGain = {
      t: '得た熱量を求める',
      m: [R`Q_{\text{得}} = (` + k2 + R`)(t - t_{2})`, qGain],
      n: R`求めた $t$ を使って、低温の` + lowName + R`が得た熱量を「熱容量 × 温度の上がった幅 $(t - t_{2})$」で計算します。` + tHow,
      easy: R`冷たい` + lowName + R`は温度が $t_{2}$ から $t$ まで上がりました。上がった幅 $(t - t_{2})$ に、$1\,\mathrm{K}$ あたりの熱量（熱容量）を掛ければ、もらった熱の量になります。`
    };
    const steps = [
      {
        t: '図で状況をつかむ',
        n: R`温度 $t_{1} = ` + T(o.t1) + R`\degree\mathrm{C}$ の` + o.name1 + R`（$m_{1} = ` + T(o.m1) + R`\,\mathrm{g}$）を、` + (hasC ? '容器に入った ' : '') + R`$t_{2} = ` + T(o.t2) + R`\degree\mathrm{C}$ の水（$m_{2} = ` + T(o.m2) + R`\,\mathrm{g}$）に入れました。` +
          '十分に時間がたつと全体が同じ温度 $t$（**熱平衡**）になります。熱は高温の物体から低温の物体へ移り、外には逃げないとします。',
        easy: R`熱いお風呂に水を足してぬるくする、温かい紅茶に氷を入れて冷ます、といった場面です。熱いものは熱を失って冷え、冷たいものは熱をもらって温まり、やがて同じ温度になります。**熱は消えたり増えたりしない**ので、「熱いものが失った熱 = 冷たいものがもらった熱」が成り立ちます。これが**熱量の保存**です。`
      },
      {
        t: '各物体の熱容量をまとめる',
        m: [R`m_{1}c_{1} = ` + T(o.m1) + R` \times ` + T(o.c1) + ' = ' + E(r.K1) + R`\,\mathrm{J/K}`,
          hasC ? R`m_{2}c_{2} + C = ` + T(o.m2) + R` \times 4.2 + ` + T(o.C) + ' = ' + E(r.K2) + R`\,\mathrm{J/K}` : R`m_{2}c_{2} = ` + T(o.m2) + R` \times 4.2 = ` + E(r.K2) + R`\,\mathrm{J/K}`],
        n: R`水の比熱は $c_{2} = 4.2\,\mathrm{J/(g\cdot K)}$。` + (hasC ? '容器も水と同じ温度になるので、容器の熱容量 $C$ を水の熱容量 $m_{2}c_{2}$ に足して「低温側」とまとめます。' : '') + R`熱容量 $mc$ は「$1\,\mathrm{K}$ 変えるのに必要な熱量」です。`,
        easy: R`熱容量は「温度を $1\,\mathrm{K}$ 上げ下げするのに必要な熱の量」で、大きいほど温度が変わりにくい物体です。水は比熱が大きいので、同じ質量の金属よりずっと温度が変わりにくくなります。`
      },
      {
        t: '熱量の保存を立式する（高温側が失った熱 = 低温側が得た熱）',
        m: [R`Q_{\text{失}} = Q_{\text{得}}`, R`m_{1}c_{1}(t_{1} - t) = (` + k2 + R`)(t - t_{2})`],
        n: R`熱平衡の温度を $t$ とおきます。高温の物体は $t_{1} \to t$ へ $(t_{1} - t)$ だけ温度が下がり、低温の` + lowName + R`は $t_{2} \to t$ へ $(t - t_{2})$ だけ上がります。どちらも $Q = (\text{熱容量}) \times (\text{温度変化の大きさ})$ です。`,
        easy: R`温度が変わった幅は、高温側が $(t_{1} - t)$、低温側が $(t - t_{2})$ です。熱量は「熱容量 × 温度変化」なので、両方の熱量を式に書いて $=$ で結びます。`
      },
      {
        t: R`$t$ について解く（文字式）`,
        m: R`\begin{aligned} m_{1}c_{1}t_{1} - m_{1}c_{1}t &= (` + k2 + R`)t - (` + k2 + R`)t_{2} \\ m_{1}c_{1}t_{1} + (` + k2 + R`)t_{2} &= (m_{1}c_{1} + ` + k2 + R`)\,t \\ t &= \frac{m_{1}c_{1}t_{1} + (` + k2 + R`)t_{2}}{m_{1}c_{1} + ` + k2 + R`} \end{aligned}`,
        n: R`$t$ を含む項を一方にまとめます。結果は「熱容量を重みにした温度の加重平均」です。`,
        pro: R`$t = t_{2} + (t_{1} - t_{2})\dfrac{K_{1}}{K_{1} + K_{2}}$（$K$ は熱容量）と書くと、暗算で検算できます。熱容量が大きい方の温度に近づきます。`,
        lv: 2
      },
      {
        t: '数値を代入して熱平衡の温度を求める',
        m: [R`t = \frac{m_{1}c_{1}t_{1} + (` + k2 + R`)t_{2}}{m_{1}c_{1} + ` + k2 + R`}`,
          R`t = ` + tNum + ' = ' + tAns + R`\degree\mathrm{C}`],
        n: R`熱容量 $m_{1}c_{1}$ と $` + k2 + R`$ には、前のステップで求めた値を入れます。$t_{2} < t < t_{1}$（低温側の温度と高温側の温度のあいだ）になっているので、答えとして妥当です。`,
        easy: R`答えは必ず「冷たい方の温度」と「熱い方の温度」のあいだに入ります。外れていたらどこかの計算が間違っています。`,
        pro: R`熱容量の大きい水の側に平衡温度が近づくのが定石。結果が $t_{2}$ と $t_{1}$ のどちら寄りかで、まず大小の見当をつけます。`
      }
    ];
    if (ask === 'lost') {
      steps.push(stLost, Object.assign({}, stGain, { t: '検算: 得た熱量と比べる', n: R`低温の` + lowName + R`が得た熱量も、失った熱量と（有効数字の範囲で）等しくなることを確かめます。`, lv: 2 }));
    } else if (ask === 'gain') {
      steps.push(stGain, Object.assign({}, stLost, { t: '検算: 失った熱量と比べる', n: R`高温の物体が失った熱量も、得た熱量と（有効数字の範囲で）等しくなることを確かめます。`, lv: 2 }));
    } else {
      steps.push({
        t: '検算: 失った熱量と得た熱量を比べる',
        m: [qLost, qGain],
        n: R`2 つの熱量が（有効数字の範囲で）等しいことを確かめます。` + tHow,
        lv: 2
      });
    }
    steps.push({
      t: '補足: 水の比熱が大きい理由と日常の例',
      n: R`水の比熱（$4.2\,\mathrm{J/(g\cdot K)}$）は金属の約 $5$〜$10$ 倍と大きい物質です。**温まりにくく冷めにくい**ので、海辺は昼夜の気温差が小さく、湯たんぽや冷却水にも水が使われます。`,
      easy: R`同じ $100\,\mathrm{g}$ なら、水を $1\,\mathrm{K}$ 温めるには鉄の約 $9$ 倍の熱が要ります（$4.2 \div 0.45$）。熱いフライパンに水を入れるとフライパンの温度がすぐ下がるのは、水がたくさんの熱を受け取れるからです。`,
      lv: 3
    });
    return steps;
  }

  function mixingOf(v) {
    let name, c;
    if (v.mat1 === 'custom') { name = '物体'; c = v.c1; }
    else { name = MATS[v.mat1][0]; c = MATS[v.mat1][1]; }
    return { name1: name, c1: c, m1: v.m1, t1: v.t1, m2: v.m2, t2: v.t2, C: v.C || 0 };
  }

  JK.registerSim({
    id: 'thermo-mixing',
    field: '熱力学',
    unit: 'p-heat',
    title: '熱量の保存（物体と水を混ぜる）',
    desc: '高温の物体を低温の水に入れたときの熱平衡の温度を、「失った熱量 = 得た熱量」から求めます。容器の熱容量も考えられます。',
    form: [R`m_{1}c_{1}(t_{1} - t) = (m_{2}c_{2} + C)(t - t_{2})`, R`t = \frac{m_{1}c_{1}t_{1} + (m_{2}c_{2} + C)t_{2}}{m_{1}c_{1} + m_{2}c_{2} + C}`],
    inputs: [
      { key: 'mat1', label: '高温の物体の物質', type: 'select', def: 'iron', options: MAT_OPTIONS.filter((o) => o[0] !== 'water') },
      { key: 'c1', label: R`比熱 $c_{1}$`, unit: 'J/(g·K)', type: 'num', def: '0.50', min: 0.01, max: 10, show: (raw) => raw.mat1 === 'custom' },
      { key: 'm1', label: R`物体の質量 $m_{1}$`, unit: 'g', type: 'num', def: '200', min: 0.1, max: 100000 },
      { key: 't1', label: R`物体の温度 $t_{1}$`, unit: '℃', type: 'num', def: '100', min: -50, max: 1000 },
      { key: 'm2', label: R`水の質量 $m_{2}$`, unit: 'g', type: 'num', def: '300', min: 0.1, max: 100000 },
      { key: 't2', label: R`水の温度 $t_{2}$`, unit: '℃', type: 'num', def: '20', min: 0, max: 100 },
      { key: 'C', label: R`容器の熱容量 $C$`, unit: 'J/K', type: 'num', def: '0', min: 0, max: 100000, hint: '容器の熱を考えないときは 0（容器も水と同じ温度になる）' }
    ],
    examples: [
      { label: '熱した鉄球を水へ', v: { mat1: 'iron', m1: '200', t1: '100', m2: '300', t2: '20', C: '0' } },
      { label: '容器の熱容量あり', v: { mat1: 'cu', m1: '150', t1: '98', m2: '200', t2: '18', C: '40' } },
      { label: '比熱を自分で入力', v: { mat1: 'custom', c1: '0.80', m1: '100', t1: '90', m2: '250', t2: '15', C: '20' } }
    ],
    intro: {
      easy: R`熱いお湯と冷たい水を混ぜるとぬるくなります。このとき**熱いほうが失った熱と、冷たいほうがもらった熱は等しい**（熱は消えたり増えたりしない）。これが「熱量の保存」で、熱の問題はほぼすべてこの $1$ 本の式で解けます。熱は「熱容量 × 温度変化」で数えます。`,
      normal: R`高温側が失った熱量 $=$ 低温側が得た熱量。熱平衡の温度 $t$ を未知数にして、$Q = C\Delta T$ を両側に立てます。容器があれば水に足します。`,
      pro: R`平衡温度は「熱容量を重みにした加重平均」$t = \dfrac{\sum C_{i}t_{i}}{\sum C_{i}}$。各物体の熱容量を先にまとめておくと立式が速くなります。`
    },
    compute(v) {
      const o = mixingOf(v);
      if (!(o.t1 > o.t2)) throw new JK.CalcError('物体の温度 t₁ を水の温度 t₂ より高くしてください（高温の物体から低温の水へ熱が移る場合を扱います）。');
      const r = mixingCalc(o);
      must(r.t, r.K1, r.K2);
      if (r.t > 100) throw new JK.CalcError('熱平衡の温度が 100 ℃ を超えるため水が沸騰してしまい、この式では扱えません（物体の温度や質量を小さくしてください）。');
      return {
        result: [
          { label: '熱平衡の温度 t', tex: S3(r.t) + R`\degree\mathrm{C}` },
          { label: '物体が失った熱量', tex: S3(r.Qlost) + R`\,\mathrm{J}` },
          { label: '水と容器が得た熱量', tex: S3(r.Qgain) + R`\,\mathrm{J}` }
        ],
        steps: mixingSteps(o, r),
        fig: mixingFigure(o, r)
      };
    },
    exercise(rng, level) {
      const key = rng.pick(['iron', 'cu', 'al']);
      const name = MATS[key][0], c1 = MATS[key][1];
      const cTex = c1.toFixed(2);
      const m1 = rng.pick([100, 150, 200, 250, 300]);
      const m2 = rng.pick([100, 200, 250, 300, 400]);
      const t2 = rng.pick([10, 15, 18, 20, 25]);
      const t1 = rng.pick([80, 90, 95, 100]);
      if (level === 'basic') {
        const o = { name1: name, c1: c1, m1: m1, t1: t1, m2: m2, t2: t2, C: 0 };
        const r = mixingCalc(o);
        return {
          title: '熱した' + name + 'を水に入れる',
          body: R`質量 $` + m1 + R`\,\mathrm{g}$ の` + name + R`の球を $` + t1 + R`\degree\mathrm{C}$ に熱し、$` + t2 + R`\degree\mathrm{C}$ の水 $` + m2 + R`\,\mathrm{g}$ の中に入れて、十分に時間がたった。` + name + R`の比熱を $` + cTex + R`\,\mathrm{J/(g\cdot K)}$、水の比熱を $4.2\,\mathrm{J/(g\cdot K)}$ とする。容器や外部との熱の出入りは無視できるものとして、次の量を有効数字 3 桁で求めよ。`,
          fig: mixingFigure(o, r, { t: '熱平衡 t = ?' }),
          parts: [
            { label: '(1)', q: R`全体が熱平衡に達したときの温度 $t$`, type: 'num', answer: p3(r.t), rel: 0.02, unit: '℃' },
            { label: '(2)', q: name + R`の球が失った熱量 $Q_{\text{失}}$`, type: 'num', answer: p3(r.Qlost), rel: 0.02, unit: 'J' }
          ],
          solution: mixingSteps(o, r, { ask: 'lost' })
        };
      }
      if (level === 'mid') {
        const C = rng.pick([20, 40, 60, 80]);
        const o = { name1: name, c1: c1, m1: m1, t1: t1, m2: m2, t2: t2, C: C };
        const r = mixingCalc(o);
        return {
          title: '熱容量のある容器での混合',
          body: R`熱容量 $` + C + R`\,\mathrm{J/K}$ の容器に $` + t2 + R`\degree\mathrm{C}$ の水 $` + m2 + R`\,\mathrm{g}$ が入っている。ここへ $` + t1 + R`\degree\mathrm{C}$ に熱した質量 $` + m1 + R`\,\mathrm{g}$ の` + name + R`の球を入れてしばらくすると、全体が一様な温度になった。` + name + R`の比熱を $` + cTex + R`\,\mathrm{J/(g\cdot K)}$、水の比熱を $4.2\,\mathrm{J/(g\cdot K)}$ とし、容器の外との熱の出入りは無視できるものとして、次の量を有効数字 3 桁で求めよ。`,
          fig: mixingFigure(o, r, { t: '熱平衡 t = ?' }),
          parts: [
            { label: '(1)', q: R`水と容器を合わせた熱容量`, type: 'num', answer: p3(r.K2), rel: 0.02, unit: 'J/K' },
            { label: '(2)', q: R`全体の温度 $t$`, type: 'num', answer: p3(r.t), rel: 0.02, unit: '℃' },
            { label: '(3)', q: R`水と容器が得た熱量 $Q_{\text{得}}$`, type: 'num', answer: p3(r.Qgain), rel: 0.02, unit: 'J' }
          ],
          solution: mixingSteps(o, r, { ask: 'gain' })
        };
      }
      // adv: 平衡温度から比熱を逆算
      const C = rng.pick([20, 40, 60]);
      const o0 = { name1: name, c1: c1, m1: m1, t1: t1, m2: m2, t2: t2, C: C };
      const r0 = mixingCalc(o0);
      const tObs = Number(r0.t.toFixed(1));
      const K2 = m2 * CW + C;
      const Qg = K2 * (tObs - t2);
      const cx = Qg / (m1 * (t1 - tObs));
      const o = { name1: '金属', c1: cx, m1: m1, t1: t1, m2: m2, t2: t2, C: C };
      const r = Object.assign(mixingCalc(o), { t: tObs, Qlost: Qg, Qgain: Qg });
      const solution = [
        {
          t: '図で状況をつかむ',
          n: R`未知の金属（質量 $m_{1} = ` + m1 + R`\,\mathrm{g}$、はじめの温度 $t_{1} = ` + t1 + R`\degree\mathrm{C}$、比熱 $c_{1}$）を、熱容量 $C = ` + C + R`\,\mathrm{J/K}$ の容器に入った $t_{2} = ` + t2 + R`\degree\mathrm{C}$ の水（$m_{2} = ` + m2 + R`\,\mathrm{g}$）に入れると、金属が熱を失い、水と容器が熱をもらって、温度が $t = ` + tObs.toFixed(1) + R`\degree\mathrm{C}$ でそろいました。`,
          easy: R`熱いものが失った熱と、冷たいものがもらった熱は等しい（熱量の保存）。今回は「冷たい側がもらった熱」が温度の変化から計算できるので、それを使って金属の比熱を逆算します。`
        },
        {
          t: '水と容器が得た熱量（熱容量 × 温度変化）',
          m: [R`Q_{\text{得}} = (m_{2}c_{2} + C)(t - t_{2})`, R`Q_{\text{得}} = (` + m2 + R` \times 4.2 + ` + C + R`) \times (` + tObs.toFixed(1) + ' - ' + t2 + ') = ' + S3t(Qg) + R`\,\mathrm{J}`],
          n: R`水と容器は同じ温度変化 $(t - t_{2})$ をしたので、熱容量をまとめて掛けます。`,
          easy: R`水の熱容量は $m_{2}c_{2}$、容器は $C$。両方とも同じ温度だけ上がったので、足してから温度変化を掛ければ、もらった熱が求まります。`
        },
        {
          t: '熱量の保存から金属の比熱を求める',
          m: [R`m_{1}c_{1}(t_{1} - t) = Q_{\text{得}} \;\Rightarrow\; c_{1} = \frac{Q_{\text{得}}}{m_{1}(t_{1} - t)} = \frac{(m_{2}c_{2} + C)(t - t_{2})}{m_{1}(t_{1} - t)}`,
            R`c_{1} = \frac{(` + m2 + R` \times 4.2 + ` + C + R`) \times (` + tObs.toFixed(1) + ' - ' + t2 + ')}{' + m1 + R` \times (` + t1 + ' - ' + tObs.toFixed(1) + ')} = ' + S3t(cx) + R`\,\mathrm{J/(g\cdot K)}`],
          n: R`金属が失った熱量は $m_{1}c_{1}(t_{1} - t)$ で、水と容器が得た熱量に等しい。これを $c_{1}$ について解きます。数値は、問題文で与えられた値を直接代入します。`,
          pro: R`$c_{1}$ を逆算する問題は、まず「得た熱量」を数値で出してから割り算するだけ。連立方程式は不要です。`
        }
      ];
      return {
        title: '混合から金属の比熱を求める',
        body: R`熱容量 $` + C + R`\,\mathrm{J/K}$ の容器に $` + t2 + R`\degree\mathrm{C}$ の水 $` + m2 + R`\,\mathrm{g}$ が入っている。ここへ $` + t1 + R`\degree\mathrm{C}$ に熱した質量 $` + m1 + R`\,\mathrm{g}$ の未知の金属を入れると、全体の温度は $` + tObs.toFixed(1) + R`\degree\mathrm{C}$ になった。水の比熱を $4.2\,\mathrm{J/(g\cdot K)}$ とし、外との熱の出入りは無視できるものとして、次の量を有効数字 3 桁で求めよ。`,
        fig: mixingFigure(o, r),
        parts: [
          { label: '(1)', q: R`水と容器が得た熱量 $Q_{\text{得}}$`, type: 'num', answer: p3(Qg), rel: 0.02, unit: 'J' },
          { label: '(2)', q: R`金属の比熱 $c_{1}$`, type: 'num', answer: p3(cx), rel: 0.02, unit: 'J/(g·K)' }
        ],
        solution: solution
      };
    }
  });

  /* ================= 3. 状態変化（融解・蒸発） ================= */

  function latentCalc(o) {
    const Q1 = o.t0 < 0 ? o.m * CICE * (0 - o.t0) : 0;
    const Q2 = o.m * LF;
    const tEnd = o.steam ? 100 : o.t1;
    const Q3 = o.m * CW * tEnd;
    const Q4 = o.steam ? o.m * LV : 0;
    return { Q1: Q1, Q2: Q2, Q3: Q3, Q4: Q4, tEnd: tEnd, Q: Q1 + Q2 + Q3 + Q4 };
  }

  // opt.ask: 演習用（目盛りの数値を出さず、熱量の答えが読み取れないようにする）
  function latentFigure(o, r, opt) {
    opt = opt || {};
    const k = 1000;
    const x0 = 0, x1 = r.Q1 / k, x2 = (r.Q1 + r.Q2) / k, x3 = (r.Q1 + r.Q2 + r.Q3) / k, x4 = r.Q / k;
    const top = r.tEnd;
    const ymin = Math.min(o.t0, 0) - 12, ymax = Math.max(top, 0) + 22;
    const curves = [];
    if (x1 > x0) curves.push({ f: (x) => o.t0 + (0 - o.t0) * (x - x0) / (x1 - x0), cls: 'c1', domain: [x0, x1] });
    curves.push({ f: () => 0, cls: 'c3', domain: [x1, x2] });
    if (x3 > x2) curves.push({ f: (x) => top * (x - x2) / (x3 - x2), cls: 'c4', domain: [x2, x3] });
    if (o.steam) curves.push({ f: () => 100, cls: 'c2', domain: [x3, x4] });
    const xr = x4 * 1.08;
    const lab = [
      { x: x1 + xr * 0.03, y: o.t0 * 0.45, text: x1 > x0 ? '氷' : '', cls: 'c1', anchor: 'start' },
      { x: (x1 + x2) / 2, y: 7, text: '融解（氷 + 水）', cls: 'c3', anchor: 'middle' },
      { x: (x2 + x3) / 2 - xr * 0.02, y: top * 0.5 - 4, text: x3 > x2 ? '水' : '', cls: 'c4', anchor: 'end' }
    ];
    if (o.steam) lab.push({ x: (x3 + x4) / 2, y: 106, text: '沸騰（水 + 水蒸気）', cls: 'c2', anchor: 'middle' });
    const pts = [{ x: 0, y: o.t0, cls: 'c1', label: tx(o.t0) + '℃', pos: o.t0 < -5 ? 'br' : 'tr' }];
    pts.push({ x: x4, y: top, cls: o.steam ? 'c2' : 'c4', label: tx(top) + '℃', pos: 'bl' });
    const g = {
      w: 360, h: 250, x: [0, xr], y: [ymin, ymax], grid: true, axis: [opt.ask ? 'Q' : 'Q[kJ]', 't[℃]'],
      curves: curves, points: pts, labels: lab.filter((l) => l.text)
    };
    if (opt.ask) {
      g.ticks = false;
      g.grid = false;
      g.hlines = [{ y: 0, cls: 'dim' }];
      if (o.t0 < 0) g.labels.push({ x: xr * 0.01, y: -ymax * 0.1 - 2, text: '0℃', cls: 'dim', anchor: 'start' });
    }
    return JK.plot.graph(g);
  }

  function latentSteps(o, r) {
    const steam = o.steam;
    const steps = [
      {
        t: '図で状況をつかむ（加熱グラフ）',
        n: R`$` + T(o.t0) + R`\degree\mathrm{C}$ の氷 $` + T(o.m) + R`\,\mathrm{g}$ に熱を加え続け、` + (steam ? R`$100\degree\mathrm{C}$ の水蒸気` : R`$` + T(o.t1) + R`\degree\mathrm{C}$ の水`) +
          R`にします。温度が変わる区間では $Q = mc\Delta T$、状態が変わる区間（温度は一定）では $Q = mL$（$L$: 融解熱・蒸発熱）を使い、区間ごとの熱量を足し合わせます。` +
          (r.Q1 > 0 ? '' : R`氷はすでに $0\degree\mathrm{C}$ なので、氷を温める区間（①）は不要です。`) + (r.Q3 > 0 ? '' : R`水の最終温度も $0\degree\mathrm{C}$ なので、水を温める区間（③）は不要です。`),
        easy: R`氷を熱すると、まず温度が上がり、$0\degree\mathrm{C}$ に着くと**融け始め**ます。融けている間は温度が上がらず、加えた熱は「氷を水に変えること」に使われます。全部が水になるとまた温度が上がり、` + (steam ? R`$100\degree\mathrm{C}$ で**沸騰**して、水が水蒸気に変わる間はやはり温度が一定です。` : R`目標の温度まで上がります。`) +
          R`グラフが「斜め」の区間と「水平」の区間に分かれるのはそのためです。`
      }
    ];
    if (r.Q1 > 0) {
      steps.push({
        t: R`① 氷を $0\degree\mathrm{C}$ まで温める`,
        m: [R`Q_{1} = m c_{\text{氷}} (0 - t_{0})`, R`Q_{1} = ` + T(o.m) + R` \times 2.1 \times \{0 - ` + P(o.t0) + R`\} = ` + S3t(r.Q1) + R`\,\mathrm{J}`],
        n: R`氷の比熱 $c_{\text{氷}} = 2.1\,\mathrm{J/(g\cdot K)}$ を使い、はじめの温度 $t_{0} = ` + T(o.t0) + R`\degree\mathrm{C}$ から $0\degree\mathrm{C}$ まで $` + T(-o.t0) + R`\,\mathrm{K}$ 上げます。`,
        easy: R`まだ氷のままで温度だけが上がる区間なので、ふつうの熱量の式 $Q = mc\Delta T$ をそのまま使います。氷の比熱は水の約半分（$2.1$）です。`
      });
    }
    steps.push({
      t: R`② 氷を水に変える（融解）`,
      m: [R`Q_{2} = mL_{\text{融}}`, R`Q_{2} = ` + T(o.m) + R` \times 334 = ` + S3t(r.Q2) + R`\,\mathrm{J}`],
      n: R`融解熱 $L_{\text{融}} = 334\,\mathrm{J/g}$ は「$0\degree\mathrm{C}$ の氷 $1\,\mathrm{g}$ を $0\degree\mathrm{C}$ の水に変えるのに必要な熱量」です。この間、温度は $0\degree\mathrm{C}$ のまま変わりません。`,
      easy: R`氷がとけている間は、加えた熱が「氷の粒のつながりをほどく」ことに使われて、温度は上がりません。$1\,\mathrm{g}$ あたりの必要な熱を**融解熱**といいます。温度が変わらないので、$\Delta T$ は使わず、質量 × 融解熱だけで計算します。`,
      pro: R`状態変化中は温度が一定。$Q = mL$ に温度変化は入りません。入試では「氷が全部融けたか、一部だけか」の判定が頻出です（先に $Q_{1}, Q_{2}$ を求めて比べる）。`
    });
    if (r.Q3 > 0) {
      steps.push({
        t: R`③ 水を温める（$0\degree\mathrm{C} \to ` + T(r.tEnd) + R`\degree\mathrm{C}$）`,
        m: [R`Q_{3} = m c_{\text{水}} (t_{1} - 0)`, R`Q_{3} = ` + T(o.m) + R` \times 4.2 \times ` + T(r.tEnd) + ' = ' + S3t(r.Q3) + R`\,\mathrm{J}`],
        n: R`融けた水の比熱 $c_{\text{水}} = 4.2\,\mathrm{J/(g\cdot K)}$ を使って、$0\degree\mathrm{C}$ から $t_{1} = ` + T(r.tEnd) + R`\degree\mathrm{C}$ まで温めます。`,
        easy: R`全部が水になったので、再び「温度が上がる区間」です。$Q = mc\Delta T$ を使います。`
      });
    }
    if (steam) {
      steps.push({
        t: R`④ 水を水蒸気に変える（蒸発）`,
        m: [R`Q_{4} = mL_{\text{蒸}}`, R`Q_{4} = ` + T(o.m) + R` \times 2260 = ` + S3t(r.Q4) + R`\,\mathrm{J}`],
        n: R`蒸発熱 $L_{\text{蒸}} = 2260\,\mathrm{J/g}$ は「$100\degree\mathrm{C}$ の水 $1\,\mathrm{g}$ を $100\degree\mathrm{C}$ の水蒸気に変えるのに必要な熱量」です。`,
        easy: R`水が水蒸気（気体）になるときは、水の粒がバラバラに飛び出すので、融解のときよりずっと大きな熱が要ります。$1\,\mathrm{g}$ あたり $2260\,\mathrm{J}$ は、融解熱 $334\,\mathrm{J}$ の約 $7$ 倍です。`
      });
    }
    const terms = [], nums = [];
    if (r.Q1 > 0) { terms.push('Q_{1}'); nums.push(E(r.Q1)); }
    terms.push('Q_{2}'); nums.push(E(r.Q2));
    if (r.Q3 > 0) { terms.push('Q_{3}'); nums.push(E(r.Q3)); }
    if (steam) { terms.push('Q_{4}'); nums.push(E(r.Q4)); }
    steps.push({
      t: '各区間の熱量を足し合わせる',
      m: ['Q = ' + terms.join(' + '), 'Q = ' + nums.join(' + ') + ' = ' + S3t(r.Q) + R`\,\mathrm{J}`, R`Q = ` + S3(r.Q / 1000) + R`\,\mathrm{kJ}`],
      n: R`グラフの横軸（加えた熱量）の終点が、求める全体の熱量 $Q$ です。` + ([r.Q1, r.Q2, r.Q3, r.Q4].some((q) => q && Math.abs(p3(q) - q) > 1e-9 * Math.abs(q)) ? R`各区間の熱量は、有効数字 3 桁に丸める前の値を足しています。` : ''),
      easy: R`ここまでの区間ごとの熱量をすべて足せば、はじめの氷から目標の状態にするまでに必要な熱量になります。`
    });
    steps.push({
      t: '各段階が全体に占める割合（グラフの見方）',
      m: [R`\frac{Q_{2}}{Q} = \frac{` + E(r.Q2) + '}{' + E(r.Q) + '} = ' + U.fmt(r.Q2 / r.Q * 100, 1) + R`\,\%`],
      n: R`融解に使われた熱の割合です。融けている間は温度が $0\degree\mathrm{C}$ のまま上がらないのに、全体の約 $` + U.fmt(r.Q2 / r.Q * 100, 0) + R`\,\%$ もの熱が必要です。` +
        (steam ? R`蒸発の熱量 $Q_{4}$ は、水を $0\degree\mathrm{C}$ から $100\degree\mathrm{C}$ まで温める熱量 $Q_{3}$ の約 $` + U.fmt(r.Q4 / r.Q3, 1) + R`$ 倍にもなります（全体の約 $` + U.fmt(r.Q4 / r.Q * 100, 0) + R`\,\%$）。` : ''),
      lv: 2
    });
    steps.push({
      t: '補足: 融解熱のイメージ',
      n: R`融解熱 $334\,\mathrm{J/g}$ は、同じ $1\,\mathrm{g}$ の水を約 $80\,\mathrm{K}$（$334 \div 4.2$）温められる熱に相当します。氷水が冷たいままなのは、加わった熱が温度上昇ではなく融解に使われるからです。`,
      easy: R`冷たい飲み物に氷を入れると、氷が熱をうばいながら融けるので、氷が残っているあいだは $0\degree\mathrm{C}$ のまま冷たさが続きます。`,
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'thermo-latent',
    field: '熱力学',
    unit: 'p-heat',
    title: '状態変化（氷 → 水 → 水蒸気）に必要な熱量',
    desc: '氷を加熱して水や水蒸気にするまでに必要な熱量を、融解熱・蒸発熱を含めて区間ごとに求めます。加熱グラフ（温度と熱量の関係）も描きます。',
    form: [R`Q = mc\Delta T`, R`Q = mL`],
    inputs: [
      { key: 'm', label: '質量 $m$', unit: 'g', type: 'num', def: '100', min: 0.1, max: 100000 },
      { key: 't0', label: R`氷のはじめの温度 $t_{0}$`, unit: '℃', type: 'num', def: '-20', min: -100, max: 0, hint: '負の値で入力（$0$ ℃ の氷なら 0）' },
      { key: 'goal', label: '最終の状態', type: 'select', def: 'water', options: [['water', 't₁ ℃ の水'], ['steam', '100 ℃ の水蒸気']] },
      { key: 't1', label: R`水の最終温度 $t_{1}$`, unit: '℃', type: 'num', def: '60', min: 0, max: 100, show: (raw) => raw.goal !== 'steam' }
    ],
    examples: [
      { label: '−20 ℃ の氷を 60 ℃ の水へ', v: { m: '100', t0: '-20', goal: 'water', t1: '60' } },
      { label: '氷を水蒸気にする', v: { m: '50', t0: '-10', goal: 'steam' } },
      { label: '0 ℃ の氷をとかすだけ', v: { m: '200', t0: '0', goal: 'water', t1: '0' } }
    ],
    intro: {
      easy: R`氷を温めると、温度が上がる→$0\degree\mathrm{C}$ で融ける→水になってまた温度が上がる→$100\degree\mathrm{C}$ で水蒸気になる、という順に変わります。**温度が変わる間**は $Q = mc\Delta T$、**状態が変わる間（温度は一定）**は $Q = mL$（$L$ は融解熱・蒸発熱）で熱を数えて、全部足します。`,
      normal: R`加熱曲線を「温度変化の区間」と「状態変化の区間（水平）」に分け、各区間の熱量を足します。氷 $2.1$・水 $4.2\,\mathrm{J/(g\cdot K)}$、融解熱 $334$・蒸発熱 $2260\,\mathrm{J/g}$。`,
      pro: R`区間ごとの熱量を先に求めて「どこまで進むか」を判定するのが定石（氷が全部融けるか、水が沸騰するか）。融解熱は水の $80\,\mathrm{K}$ 分、蒸発熱は約 $540\,\mathrm{K}$ 分の熱量に相当します。`
    },
    compute(v) {
      const steam = v.goal === 'steam';
      const o = { m: v.m, t0: v.t0, steam: steam, t1: steam ? 100 : v.t1 };
      if (!steam && (v.t1 < 0 || v.t1 > 100)) throw new JK.CalcError('水の最終温度 t₁ は 0〜100 ℃ の間にしてください。');
      const r = latentCalc(o);
      must(r.Q);
      const res = [{ label: '必要な熱量 Q', tex: S3(r.Q) + R`\,\mathrm{J}\ (= ` + S3(r.Q / 1000) + R`\,\mathrm{kJ})` }];
      if (r.Q1 > 0) res.push({ label: '① 氷の昇温 Q₁', tex: S3(r.Q1) + R`\,\mathrm{J}` });
      res.push({ label: '② 融解 Q₂', tex: S3(r.Q2) + R`\,\mathrm{J}` });
      if (r.Q3 > 0) res.push({ label: '③ 水の昇温 Q₃', tex: S3(r.Q3) + R`\,\mathrm{J}` });
      if (steam) res.push({ label: '④ 蒸発 Q₄', tex: S3(r.Q4) + R`\,\mathrm{J}` });
      return { result: res, steps: latentSteps(o, r), fig: latentFigure(o, r) };
    },
    exercise(rng, level) {
      const m = rng.pick([20, 50, 100, 200]);
      const t0 = level === 'basic' ? 0 : rng.pick([-10, -20, -30]);
      const consts = (level === 'basic' ? '' : R`氷の比熱 $2.1\,\mathrm{J/(g\cdot K)}$、`) + R`水の比熱 $4.2\,\mathrm{J/(g\cdot K)}$、氷の融解熱 $334\,\mathrm{J/g}$` + (level === 'adv' ? R`、水の蒸発熱 $2260\,\mathrm{J/g}$` : '') + ' とする。';
      if (level === 'basic') {
        const t1 = rng.pick([20, 30, 40, 50, 60, 80]);
        const o = { m: m, t0: 0, steam: false, t1: t1 };
        const r = latentCalc(o);
        return {
          title: '氷をとかして温める',
          body: R`$0\degree\mathrm{C}$ の氷 $` + m + R`\,\mathrm{g}$ に熱を加えて、すべて $` + t1 + R`\degree\mathrm{C}$ の水にした。` + consts + R`熱は外へ逃げないものとして、次の量を有効数字 3 桁で求めよ。`,
          fig: latentFigure(o, r, { ask: true }),
          parts: [
            { label: '(1)', q: R`氷を $0\degree\mathrm{C}$ の水にするのに必要な熱量`, type: 'num', answer: p3(r.Q2), rel: 0.02, unit: 'J' },
            { label: '(2)', q: R`氷を $` + t1 + R`\degree\mathrm{C}$ の水にするまでに必要な全熱量 $Q$`, type: 'num', answer: p3(r.Q), rel: 0.02, unit: 'J' }
          ],
          solution: latentSteps(o, r)
        };
      }
      if (level === 'mid') {
        const t1 = rng.pick([20, 40, 50, 60, 70, 80]);
        const o = { m: m, t0: t0, steam: false, t1: t1 };
        const r = latentCalc(o);
        return {
          title: '氷から水までの加熱',
          body: R`$` + t0 + R`\degree\mathrm{C}$ の氷 $` + m + R`\,\mathrm{g}$ に熱を加え続け、すべて $` + t1 + R`\degree\mathrm{C}$ の水にした。` + consts + R`熱は外へ逃げないものとして、次の量を有効数字 3 桁で求めよ。`,
          fig: latentFigure(o, r, { ask: true }),
          parts: [
            { label: '(1)', q: R`氷を $0\degree\mathrm{C}$ まで温めるのに必要な熱量`, type: 'num', answer: p3(r.Q1), rel: 0.02, unit: 'J' },
            { label: '(2)', q: R`$0\degree\mathrm{C}$ の氷をすべてとかすのに必要な熱量`, type: 'num', answer: p3(r.Q2), rel: 0.02, unit: 'J' },
            { label: '(3)', q: R`全体に必要な熱量 $Q$`, type: 'num', answer: p3(r.Q), rel: 0.02, unit: 'J' }
          ],
          solution: latentSteps(o, r)
        };
      }
      const Pw = rng.pick([100, 200, 250, 500]);
      const o = { m: m, t0: t0, steam: true, t1: 100 };
      const r = latentCalc(o);
      const tMelt = r.Q2 / Pw, tAll = r.Q / Pw;
      const solution = latentSteps(o, r).concat([
        {
          t: R`加熱時間（電力 $P = ` + Pw + R`\,\mathrm{W}$）`,
          m: [R`\tau = \frac{Q}{P}`, R`\tau_{\text{全}} = \frac{` + E(r.Q) + '}{' + Pw + '} = ' + S3t(tAll) + R`\,\mathrm{s}`, R`\tau_{\text{融解}} = \frac{Q_{2}}{P} = \frac{` + E(r.Q2) + '}{' + Pw + '} = ' + S3t(tMelt) + R`\,\mathrm{s}`],
          n: R`電力 $P$ は $1$ 秒あたりの熱量なので、加熱時間 $\tau$ は熱量を電力で割れば求まります。全体の時間 $\tau_{\text{全}}$ には全熱量 $Q$ を、融解中（温度が $0\degree\mathrm{C}$ のまま変わらない間）の時間 $\tau_{\text{融解}}$ には融解の熱量 $Q_{2}$ を使います。`,
          easy: R`$100\,\mathrm{W}$ のヒーターは $1$ 秒に $100\,\mathrm{J}$ を出します。必要な熱量をその値で割れば秒数になります。`
        }
      ]);
      return {
        title: '氷を水蒸気にするまでの加熱',
        body: R`$` + t0 + R`\degree\mathrm{C}$ の氷 $` + m + R`\,\mathrm{g}$ を、電力 $` + Pw + R`\,\mathrm{W}$ のヒーターで一定の割合で加熱し、すべて $100\degree\mathrm{C}$ の水蒸気にした。ヒーターの熱はすべて吸収されるものとし、` + consts + R`次の量を有効数字 3 桁で求めよ。`,
        fig: latentFigure(o, r, { ask: true }),
        parts: [
          { label: '(1)', q: R`氷を $100\degree\mathrm{C}$ の水蒸気にするのに必要な全熱量 $Q$`, type: 'num', answer: p3(r.Q), rel: 0.02, unit: 'J' },
          { label: '(2)', q: R`加熱を始めてから、すべて水蒸気になるまでの時間 $\tau_{\text{全}}$`, type: 'num', answer: p3(tAll), rel: 0.02, unit: 's' },
          { label: '(3)', q: R`氷が融けている間（温度が $0\degree\mathrm{C}$ で一定の間）の時間 $\tau_{\text{融解}}$`, type: 'num', answer: p3(tMelt), rel: 0.02, unit: 's' }
        ],
        solution: solution
      };
    }
  });
})();
