/* 物理・力学 — 等加速度直線運動（unit: p-kin）
   mech-uniform-accel: 初速度 v₀・加速度 a・時間 t → 速度・変位・止まるまでの時間と距離（v–t / x–t グラフつき） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;

  const sig = (x) => U.sig(x, 3);                 // 有効数字 3 桁（TeX）
  const nf = (x) => { if (typeof x !== 'number' || !isFinite(x) || Math.abs(x) < 1e-12) return '0'; const ax = Math.abs(x); if (ax >= 1e15 || ax < 1e-6) { let e = Math.floor(Math.log10(ax)); let m = Number((x / Math.pow(10, e)).toPrecision(10)); if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(10)); e += 1; } let ms = String(m); if (ms.indexOf('.') < 0) ms += '.0'; return '(' + ms + R` \times 10^{` + e + '})'; } return String(Number(x.toPrecision(10))); };   // 入力値の表示（TeX）。与えた値をそのまま（有効数字 10 桁まで）書く。3 桁に丸めると、入力が 4 桁以上のとき式が合わなくなる。10^-6 未満・10^15 以上だけ指数の形（累乗するときのため括弧つき）
  const pn = (x) => (x < 0 ? '(' + nf(x) + ')' : nf(x));   // 代入表示（負の数は括弧つき）
  const P3 = (x) => U.roundSig(x, 3);     // 解答値
  const zero = (x) => (Math.abs(x) < 1e-12 ? 0 : x);
  const MS = R`\,\mathrm{m/s}`, MS2 = R`\,\mathrm{m/s^{2}}`, SEC = R`\,\mathrm{s}`, MM = R`\,\mathrm{m}`;

  // 途中の値の表示。x を、有効数字 n 桁に丸めた値と同じになる最小の桁数（3 桁以上）で書く
  const dig = (x, n) => {
    let k = 3;
    while (k < n && U.roundSig(x, k) !== U.roundSig(x, n)) k++;
    return U.sig(x, k);
  };
  // 途中の値 vals を、次の式 f（表示した値で計算する）の結果が target の有効数字 3 桁と一致する最小の桁数で書く。
  // 生徒が表示の数値どうしを電卓で計算しても、表示の結果と最後の桁まで合う（丸めた 2.47 を代入して 24.2 が 24.3 になる、を防ぐ）
  const fit = (vals, f, target) => {
    const want = U.roundSig(target, 3);
    for (let n = 3; n <= 12; n++) {
      if (U.roundSig(f.apply(null, vals.map((x) => U.roundSig(x, n))), 3) === want) return vals.map((x) => dig(x, n));
    }
    return vals.map((x) => dig(x, 12));
  };
  const pr = (s) => (s.charAt(0) === '-' || s.indexOf(R`\times`) >= 0 ? '(' + s + ')' : s);   // 負の数・指数表記は括弧をつけて代入する

  /* ---------- 計算 ---------- */
  function solve(v0, a, t) {
    const r = { v0: v0, a: a, t: t };
    r.v = zero(v0 + a * t);
    r.x = zero(v0 * t + 0.5 * a * t * t);
    r.decel = a !== 0 && v0 * a < 0;                 // 初速度と加速度が逆向き = 減速
    if (r.decel) {
      r.ts = -v0 / a;                                // 速度が 0 になる時刻
      r.xs = -v0 * v0 / (2 * a);                     // そのときの位置（最も遠い点）
      r.turn = t > r.ts;                             // 折り返したか
      r.dist = r.turn ? Math.abs(r.xs) + Math.abs(r.x - r.xs) : Math.abs(r.x);
    }
    return r;
  }

  /* ---------- 図 ---------- */
  // 図を縦に積む（各グラフ SVG を入れ子の <svg> として 1 枚にまとめる）
  function stack(parts, w) {
    let H = 0;
    parts.forEach((p) => { H += p.h; });
    const d = JK.plot.draw(w, H);
    let y = 0;
    parts.forEach((p) => {
      d.group(p.svg.replace(/^<svg[^>]*>/, '<svg x="0" y="' + y + '" width="' + w + '" height="' + p.h + '" viewBox="0 0 ' + w + ' ' + p.h + '" style="overflow:visible">'));
      y += p.h;
    });
    return d.svg();
  }

  function vtGraph(v0, a, t, w, h) {
    const f = (s) => v0 + a * s;
    const ve = f(t);
    const lo = Math.min(0, v0, ve), hi = Math.max(0, v0, ve);
    const pad = (hi - lo || 1) * 0.18;
    const o = {
      w: w, h: h, x: [0, t * 1.12], y: [lo < 0 ? lo - pad : 0, hi + pad],
      axis: ['t [s]', 'v [m/s]'],
      fills: [{ f: f, g: () => 0, from: 0, to: t, cls: 'f1' }],
      curves: [{ f: f, cls: 'c1', domain: [0, t] }],
      vlines: [{ x: t, label: 't = ' + U.fmt(t, 2) }],
      points: [{ x: t, y: ve, label: 'v = ' + U.fmt(ve, 2), cls: 'c3', pos: a >= 0 ? 'tl' : 'bl' }],
      labels: []
    };
    // 「面積 = 変位」の注記: 符号が変わるときは最初の三角形の中に置く
    const lx = (v0 * ve < 0) ? t * (v0 / (v0 - ve)) * 0.4 : t * 0.5;
    o.labels.push({ x: lx, y: f(lx) / 2, text: '面積 = 変位 x', cls: 'fg', anchor: 'middle' });
    if (v0 !== 0) o.points.push({ x: 0, y: v0, label: 'v₀ = ' + U.fmt(v0, 2), cls: 'c3', pos: a >= 0 ? 'br' : 'tr' });
    return JK.plot.graph(o);
  }

  function xtGraph(v0, a, t, w, h, r) {
    const f = (s) => v0 * s + 0.5 * a * s * s;
    let lo = 0, hi = 0;
    for (let k = 0; k <= 80; k++) { const y = f(t * k / 80); lo = Math.min(lo, y); hi = Math.max(hi, y); }
    const pad = (hi - lo || 1) * 0.18;
    const xe = f(t);
    const o = {
      w: w, h: h, x: [0, t * 1.12], y: [lo < 0 ? lo - pad : 0, hi + pad],
      axis: ['t [s]', 'x [m]'],
      curves: [{ f: f, cls: 'c4', domain: [0, t] }],
      points: [{ x: t, y: xe, label: 'x = ' + U.fmt(xe, 2), cls: 'c3', pos: (v0 + a * t) >= 0 ? 'tl' : 'bl' }]
    };
    if (r && r.decel && r.turn) {
      o.points.push({ x: r.ts, y: r.xs, label: '折り返し t = ' + U.fmt(r.ts, 2), cls: 'c2', pos: r.xs >= 0 ? 'tr' : 'br' });
      o.vlines = [{ x: r.ts }];
    }
    return JK.plot.graph(o);
  }

  function figure(v0, a, t, r) {
    return stack([{ svg: vtGraph(v0, a, t, 360, 205), h: 205 }, { svg: xtGraph(v0, a, t, 360, 205, r), h: 205 }], 360);
  }

  // 問題用の状況図（正の向き・初速度・加速度）
  function scene(v0, a, cap) {
    const d = JK.plot.draw(360, 132);
    const gy = 98, cx = 120, bw = 54, bh = 30;
    d.hatch(14, gy, 346, gy);
    d.rect(cx - bw / 2, gy - bh, bw, bh, { cls: 'fg', fill: 'f1', rx: 3 });
    d.line(cx, gy + 3, cx, gy + 17, { cls: 'dim' });
    d.text(cx, gy + 30, 'O（原点）', { cls: 'dim', size: 11 });
    if (v0 !== 0) d.arrow(cx, gy - bh / 2, cx + (v0 > 0 ? 1 : -1) * 76, gy - bh / 2, { cls: 'c1', label: 'v₀' });
    else d.text(cx, gy - bh / 2 + 4, '静止', { size: 11 });
    if (a !== 0) d.arrow(cx, gy - bh - 14, cx + (a > 0 ? 1 : -1) * 52, gy - bh - 14, { cls: 'c4', label: 'a', w: 1.8 });
    d.arrow(196, 122, 256, 122, { cls: 'dim', w: 1.4 });
    d.text(266, 126, 'x（正の向き）', { cls: 'dim', size: 11, anchor: 'start' });
    if (cap) d.text(180, 14, cap, { size: 12 });
    return d.svg();
  }

  /* ---------- 解説ステップ ---------- */
  // o.time === false: 時間 t を書かない（その演習で t を設問ごとに別々に使うとき）
  function stSituation(r, o) {
    const kind = r.a === 0 ? R`加速度が 0 なので、物体は**等速直線運動**（速さが変わらない運動）をします。`
      : (r.decel ? R`初速度と加速度の符号が逆なので、物体は**減速**します。` : R`初速度と加速度が同じ向き（または初速度 0）なので、速さは増え続けます。`);
    const tm = o && o.time === false ? '' : R`、時間 $t = ` + nf(r.t) + SEC + R`$`;
    return {
      t: '状況を整理して、正の向きを決める',
      n: R`一直線上の運動では、まず**正の向き**（ここでは右向き）を決め、速度・加速度・変位の向きを符号（+ / −）で表します。初速度 $v_{0} = ` + nf(r.v0) + MS + R`$、加速度 $a = ` + nf(r.a) + MS2 + R`$` + tm + R` です。` + kind,
      easy: R`加速度とは「1 秒あたりに速度がどれだけ変わるか」のことです。たとえば $a = 3\,\mathrm{m/s^{2}}$ なら、1 秒ごとに速さが $3\,\mathrm{m/s}$ ずつ増えていきます（$a$ がマイナスなら、1 秒ごとにその分だけ遅くなります）。向きは「右向きを +、左向きを −」のように符号で区別します。`
    };
  }

  function stVelocity(r) {
    return {
      t: '速度の式（加速度の定義）',
      m: [R`v = v_{0} + at`, R`v = ` + nf(r.v0) + ' + ' + pn(r.a) + R` \times ` + nf(r.t) + ' = ' + sig(r.v) + MS],
      n: R`加速度 $a$ は「1 秒あたりの速度の変化」なので、$t$ 秒間では速度が $at$ だけ変わります。初速度にこれを足したものが $t$ 秒後の速度 $v$ です。`,
      easy: R`たとえば最初の速度が $` + nf(r.v0) + R`\,\mathrm{m/s}$ で、1 秒ごとに $` + nf(r.a) + R`\,\mathrm{m/s}$ ずつ変わるとします。1 秒後は $` + nf(r.v0 + r.a) + R`$、2 秒後は $` + nf(r.v0 + 2 * r.a) + R`$、… と変わっていくので、$t$ 秒後は「最初の速度 + $a \times t$」です。これが $v = v_{0} + at$ です。`,
      pro: R`符号つきで代入するだけ。$v$ が負なら、物体は負の向きに動いています（折り返したことの証拠）。`
    };
  }

  function stDisplacement(r) {
    return {
      t: '変位の式',
      m: [R`x = v_{0}t + \frac{1}{2}at^{2}`,
        R`x = ` + nf(r.v0) + R` \times ` + nf(r.t) + R` + \frac{1}{2} \times ` + pn(r.a) + R` \times ` + nf(r.t) + R`^{2} = ` + sig(r.x) + MM],
      n: R`変位 $x$ は、「初速度のまま進んだ分 $v_{0}t$」に「加速（減速）による上乗せ分 $\frac{1}{2}at^{2}$」を足したものです。`,
      easy: R`もし速度が変わらなければ、進む距離は「速さ × 時間」$= v_{0}t$ です。しかし実際には速度が少しずつ変わるので、その分の補正が必要です。その補正が $\frac{1}{2}at^{2}$（加速するなら足す、減速するなら引く）です。時間が 2 倍になると補正は 4 倍になる、という点に注意しましょう。`,
      pro: R`$x$ は「変位」（始点からの位置の変化）で、折り返す運動では進んだ道のりと一致しません。`
    };
  }

  function stArea(r) {
    const xa = zero((r.v0 + r.v) / 2 * r.t);
    const vs = fit([r.v], (v) => (r.v0 + v) / 2 * r.t, xa)[0];
    return {
      t: 'v–t グラフの面積で確かめる',
      m: [R`x = \frac{v_{0} + v}{2}\,t`,
        R`x = \frac{` + nf(r.v0) + ' + ' + pr(vs) + R`}{2} \times ` + nf(r.t) + ' = ' + sig(xa) + MM],
      n: R`v–t グラフ（図の上）で、グラフと時間軸ではさまれた部分の面積が変位 $x$ です。等加速度運動では $v$ は直線的に変わるので、この面積は台形で、$\frac{(\text{上底}) + (\text{下底})}{2} \times (\text{高さ})$ で求められます。` + (r.turn ? R`（途中で $v$ の符号が変わるので、時間軸の下側の面積は負の変位として引きます。）` : ''),
      easy: R`「速さ × 時間 = 進んだ距離」を、速さが一定でない場合に広げた考え方です。グラフの面積を「細い短冊に分けて足し合わせる」と、各短冊が「その瞬間の速さ × ごく短い時間」になり、全部足すと進んだ距離になります。平均の速度 $\frac{v_{0}+v}{2}$ に時間をかけた、と読むこともできます。`,
      lv: 2
    };
  }

  function stNoTime(r) {
    const lhs = zero(r.v * r.v - r.v0 * r.v0), rhs = zero(2 * r.a * r.x);
    const vs = fit([r.v], (v) => v * v - r.v0 * r.v0, lhs)[0], xs = fit([r.x], (x) => 2 * r.a * x, rhs)[0];
    return {
      t: '時間を含まない式で確かめる',
      m: [R`v^{2} - v_{0}^{2} = 2ax`,
        R`\text{左辺} = ` + pr(vs) + R`^{2} - ` + pn(r.v0) + R`^{2} = ` + sig(lhs),
        R`\text{右辺} = 2 \times ` + pn(r.a) + R` \times ` + pr(xs) + ' = ' + sig(rhs)],
      n: R`上の 2 つの式から $t$ を消すと得られる式です。時間が分からない（または求めなくてよい）問題で使えます。左辺と右辺が一致するので、計算に誤りがないと確認できます。`,
      easy: R`3 つ目の公式 $v^{2} - v_{0}^{2} = 2ax$ は、時間 $t$ が出てこないのが特徴です。「速さの 2 乗の増え方は、加速度 × 進んだ距離 × 2 で決まる」と読めます。問題文に時間が出てこないときは、この式が使えないか考えましょう。`,
      lv: 2
    };
  }

  function stStop(r, brief) {
    const tail = brief ? '' : (r.turn ? R`この物体は $t = ` + nf(r.t) + R`\,\mathrm{s}$ までに止まって**折り返す**ので、以降は逆向きに動きます。` : R`この物体は $t = ` + nf(r.t) + R`\,\mathrm{s}$ の時点ではまだ止まっていません。`);
    return {
      t: '止まるまでの時間と距離',
      m: [R`0 = v_{0} + at_{s} \;\Rightarrow\; t_{s} = -\frac{v_{0}}{a} = -\frac{` + nf(r.v0) + '}{' + pn(r.a) + '} = ' + sig(r.ts) + SEC,
        R`0 - v_{0}^{2} = 2ax_{s} \;\Rightarrow\; x_{s} = -\frac{v_{0}^{2}}{2a} = -\frac{` + pn(r.v0) + R`^{2}}{2 \times ` + pn(r.a) + '} = ' + sig(r.xs) + MM],
      n: R`速度が 0 になる瞬間が「止まる」瞬間です。$v = 0$ を速度の式と時間を含まない式に入れて、$t_{s}$ と $x_{s}$ を求めます。` + tail,
      easy: R`ブレーキをかけた車は、速さがだんだん減って 0 になった瞬間に止まります。「速さが 0 になる」を式にすると $v = 0$。この条件を公式に入れれば、止まるまでの時間と距離が出ます。なお加速度が一定のまま続くと、止まった後は逆向きに動き出します（現実の車は止まったままですが、物理の式ではそうなります）。`,
      pro: R`止まるまでの距離は $\frac{v_{0}^{2}}{2|a|}$ と覚える。初速度が 2 倍になると制動距離は 4 倍。`
    };
  }

  function stPath(r) {
    const a = Math.abs(r.xs), b = Math.abs(r.x - r.xs);
    const ab = fit([a, b], (p, q) => p + q, r.dist);
    const xx = fit([r.xs, r.x], (p, q) => Math.abs(q - p), b);
    return {
      t: '折り返しを含む道のり',
      m: [R`s = |x_{s}| + |x - x_{s}|`,
        R`|x - x_{s}| = |` + xx[1] + ' - ' + pr(xx[0]) + R`| = ` + sig(b) + MM,
        R`s = ` + ab[0] + ' + ' + ab[1] + ' = ' + sig(r.dist) + MM],
      n: R`変位 $x$ は「始点から見た今の位置」、道のり $s$ は「実際に動いた長さの合計」です。折り返す運動では両者が異なります。折り返し点までの距離 $|x_{s}|$ と、折り返してからの距離 $|x - x_{s}|$ を足します。`,
      easy: R`たとえば家から 10 m 先まで行って 4 m 戻ると、家からの位置（変位）は 6 m、歩いた長さ（道のり）は 14 m です。物理の「変位」は向きを含む位置の変化、「道のり」は動いた長さの合計で、折り返しがあるとこの 2 つは違う値になります。`,
      lv: 2
    };
  }

  function buildSteps(v0, a, t) {
    const r = solve(v0, a, t);
    const steps = [stSituation(r), stVelocity(r), stDisplacement(r), stArea(r), stNoTime(r)];
    if (r.decel) steps.push(stStop(r));
    if (r.decel && r.turn) steps.push(stPath(r));
    return { steps: steps, r: r };
  }

  /* ---------- 入力 ---------- */
  JK.registerSim({
    id: 'mech-uniform-accel',
    field: '力学',
    unit: 'p-kin',
    title: '等加速度直線運動',
    desc: '初速度 $v_{0}$・加速度 $a$・時間 $t$ から、速度・変位（進んだ位置）を求め、$v^{2}-v_{0}^{2}=2ax$ で確かめます。減速のときは止まるまでの時間と距離も示します。v–t グラフ（面積 = 変位）と x–t グラフつき。',
    form: [R`v = v_{0} + at`, R`x = v_{0}t + \frac{1}{2}at^{2}`, R`v^{2} - v_{0}^{2} = 2ax`],
    inputs: [
      { key: 'v0', label: R`初速度 $v_{0}$`, unit: 'm/s', type: 'num', def: '2.0', min: -1000, max: 1000, hint: '右向きを正とします（左向きなら負の値）' },
      { key: 'a', label: R`加速度 $a$`, unit: 'm/s²', type: 'num', def: '3.0', min: -1000, max: 1000, hint: '負の値で左向きの加速度（初速度と逆向きなら減速）' },
      { key: 't', label: R`時間 $t$`, unit: 's', type: 'num', def: '4.0', min: 0.001, max: 1000 }
    ],
    examples: [
      { label: '加速する自動車', v: { v0: '2.0', a: '3.0', t: '4.0' } },
      { label: 'ブレーキ（止まる前）', v: { v0: '20', a: '-4.0', t: '3.0' } },
      { label: '減速して折り返す', v: { v0: '12', a: '-3.0', t: '6.0' } }
    ],
    intro: {
      easy: R`一直線上を動く物体の速さが、**一定のペースで**増えたり減ったりする運動が「等加速度直線運動」です。アクセルを踏み続ける車や、ブレーキをかけ続ける車、ボールを真上に投げたときの動きもこの仲間です。使う公式は 3 つだけ。「**今の速さ**」を知りたいなら $v = v_{0} + at$、「**進んだ距離**」なら $x = v_{0}t + \frac{1}{2}at^{2}$、時間が分からないときは $v^{2} - v_{0}^{2} = 2ax$ です。下の図の v–t グラフで、傾きが加速度、面積が進んだ距離になっていることを確かめましょう。`,
      normal: R`3 つの公式 $v = v_{0} + at$、$x = v_{0}t + \frac{1}{2}at^{2}$、$v^{2} - v_{0}^{2} = 2ax$ を、与えられた量と求めたい量に合わせて使い分けます。v–t グラフの傾きが加速度、面積が変位です。`,
      pro: R`時間が出てこない問題は $v^{2} - v_{0}^{2} = 2ax$。折り返す運動では「変位」と「道のり」を区別する（v–t グラフで、時間軸の下側の面積も足して道のりにする）。`
    },
    compute(v) {
      const b = buildSteps(v.v0, v.a, v.t);
      const r = b.r;
      const res = [
        { label: '速度 v', tex: sig(r.v) + MS },
        { label: '変位 x', tex: sig(r.x) + MM }
      ];
      if (r.decel) {
        res.push({ label: '止まるまでの時間', tex: sig(r.ts) + SEC });
        res.push({ label: '止まるまでの距離', tex: sig(r.xs) + MM });
        if (r.turn) res.push({ label: '道のり s', tex: sig(r.dist) + MM });
      }
      return { result: res, steps: b.steps, fig: figure(v.v0, v.a, v.t, r) };
    },

    /* ---------- 演習 ---------- */
    exercise(rng, level) {
      if (level === 'basic') {
        const v0 = rng.pick([0, 2.0, 4.0, 5.0]);
        const a = rng.pick([1.0, 2.0, 3.0, 4.0]);
        const t = rng.pick([2.0, 3.0, 4.0, 5.0]);
        const r = solve(v0, a, t);
        const start = v0 === 0 ? '静止した状態' : R`速さ $` + v0.toFixed(1) + MS + R`$ で走っている状態`;
        return {
          title: '加速する自動車',
          body: R`まっすぐな道路で、自動車が` + start + R`から、一定の加速度 $` + a.toFixed(1) + MS2 + R`$ で加速を始めた。進む向きを正の向きとして、加速を始めてから $` + t.toFixed(1) + SEC + R`$ 後について次の問いに答えよ。`,
          fig: scene(v0, a, '加速する自動車'),
          parts: [
            { label: '(1)', q: R`自動車の速さ $v$`, type: 'num', answer: P3(r.v), rel: 0.02, unit: 'm/s' },
            { label: '(2)', q: R`加速を始めてから進んだ距離 $x$`, type: 'num', answer: P3(r.x), rel: 0.02, unit: 'm' }
          ],
          solution: [stSituation(r), stVelocity(r), stDisplacement(r), stNoTime(r)]
        };
      }
      if (level === 'mid') {
        const a = -rng.pick([2.0, 2.5, 4.0, 5.0]);
        const v0 = rng.pick([10, 15, 20, 25]);
        const r0 = solve(v0, a, 1);
        const tau = rng.pick([1.0, 2.0, 3.0].filter((x) => x < r0.ts - 0.4));
        const t1 = tau == null ? 1.0 : tau;
        const r = solve(v0, a, t1);
        return {
          title: 'ブレーキをかけた自動車',
          body: R`直線道路を速さ $` + v0.toFixed(1) + MS + R`$ で走っていた自動車が、ブレーキをかけて、大きさ $` + (-a).toFixed(1) + MS2 + R`$ の一定の加速度で減速し、やがて停止した。進む向きを正の向きとする（したがって加速度は負の値になる）。次の問いに答えよ。`,
          fig: scene(v0, a, 'ブレーキをかけた自動車'),
          parts: [
            { label: '(1)', q: R`ブレーキをかけてから停止するまでの時間`, type: 'num', answer: P3(r0.ts), rel: 0.02, unit: 's' },
            { label: '(2)', q: R`ブレーキをかけてから停止するまでに進んだ距離`, type: 'num', answer: P3(r0.xs), rel: 0.02, unit: 'm' },
            { label: '(3)', q: R`ブレーキをかけてから $` + t1.toFixed(1) + SEC + R`$ 後の自動車の速さ`, type: 'num', answer: P3(r.v), rel: 0.02, unit: 'm/s' }
          ],
          solution: [
            Object.assign(stSituation(r0, { time: false }), { fig: vtGraph(v0, a, r0.ts, 340, 190) }),
            stStop(r0, true),
            stVelocity(r)
          ]
        };
      }
      // adv: 折り返す運動（最も遠い位置・もとの位置にもどる時間・道のり）
      const a = -rng.pick([2.0, 3.0, 4.0]);
      const ts = rng.pick([3.0, 4.0, 5.0]);
      const v0 = -a * ts;
      const T = ts + rng.pick([1.0, 2.0]);
      const rS = solve(v0, a, ts);
      const rT = solve(v0, a, T);
      const stopSt = stStop(rT, true);                // 設問 (1) の記号 x_max と、解説の x_s（止まった位置）を結びつける
      stopSt.n += R`この問題では、止まった位置 $x_{s}$ が、最も右へ進んだ位置 $x_{\mathrm{max}}$ です。`;
      return {
        title: '折り返す運動',
        body: R`なめらかな水平面上の直線上を、原点 O から右向きに速さ $` + v0.toFixed(1) + MS + R`$ で出発した物体が、左向きの一定の加速度 $` + (-a).toFixed(1) + MS2 + R`$ を受けながら運動する。右向きを正とし、出発した時刻を $t = 0$ として、次の問いに答えよ。`,
        fig: scene(v0, a, '右へ出発し、左向きの加速度を受ける'),
        parts: [
          { label: '(1)', q: R`原点から最も右へ進んだ位置 $x_{\mathrm{max}}$`, type: 'num', answer: P3(rS.xs), rel: 0.02, unit: 'm' },
          { label: '(2)', q: R`物体が再び原点にもどってくる時刻`, type: 'num', answer: P3(2 * ts), rel: 0.02, unit: 's' },
          { label: '(3)', q: R`出発から $` + T.toFixed(1) + SEC + R`$ 後までに物体が動いた道のり $s$`, type: 'num', answer: P3(rT.dist), rel: 0.02, unit: 'm' }
        ],
        solution: [
          Object.assign(stSituation(rT, { time: false }), { fig: vtGraph(v0, a, T, 340, 190) }),
          stopSt,
          {
            t: '原点にもどる時刻',
            m: [R`x = v_{0}t + \frac{1}{2}at^{2} = 0 \;\Rightarrow\; t\left(v_{0} + \frac{1}{2}at\right) = 0 \;\Rightarrow\; t = -\frac{2v_{0}}{a}`,
              R`t = -\frac{2 \times ` + nf(v0) + '}{' + pn(a) + '} = ' + sig(2 * ts) + SEC],
            n: R`変位の式で $x = 0$ とおきます。$t = 0$ は出発の瞬間なので、もう一方の解が答えです。最も遠い点まで $t_{s}$ かかったので、その 2 倍（行きと帰りは対称）とも確かめられます。`,
            easy: R`原点にもどる = 位置 $x$ が 0 になる、ということです。$x = 0$ を式に入れて $t$ について解きます。「行きと帰りは同じ時間」という対称性から、止まるまでの時間の 2 倍になるはずだ、と見当をつけて検算できます。`
          },
          // (3): 出発から T 後の位置 x を求め、折り返し点までの距離と合わせて道のりにする（答えを出すステップなので lv 1）
          Object.assign(stDisplacement(rT), { t: R`出発から $` + T.toFixed(1) + R`\,\mathrm{s}$ 後の位置（変位）` }),
          Object.assign(stPath(rT), { lv: 1 })
        ]
      };
    }
  });
})();
