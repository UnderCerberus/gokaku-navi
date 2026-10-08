/* 物理・力学 — 運動量と力積（unit: p-momentum）
   mech-collision: 一直線上の 2 物体の衝突（運動量保存則・はね返り係数・失われたエネルギー）
   mech-impulse: 力積と運動量の関係（F–t グラフの面積 = 力積） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;

  const sig = (x) => U.sig(x, 3);
  const nf = (x) => { if (typeof x !== 'number' || !isFinite(x) || Math.abs(x) < 1e-12) return '0'; const ax = Math.abs(x); if (ax >= 1e15 || ax < 1e-6) { let e = Math.floor(Math.log10(ax)); let m = Number((x / Math.pow(10, e)).toPrecision(10)); if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(10)); e += 1; } let ms = String(m); if (ms.indexOf('.') < 0) ms += '.0'; return '(' + ms + R` \times 10^{` + e + '})'; } return String(Number(x.toPrecision(10))); };   // 入力値の表示（TeX）。与えた値をそのまま（有効数字 10 桁まで）書く。3 桁に丸めると、入力が 4 桁以上のとき式が合わなくなる。10^-6 未満・10^15 以上だけ指数の形（累乗するときのため括弧つき）
  const pn = (x) => (x < 0 ? '(' + nf(x) + ')' : nf(x));
  const P3 = (x) => U.roundSig(x, 3);
  const MS = R`\,\mathrm{m/s}`, NN = R`\,\mathrm{N}`, SEC = R`\,\mathrm{s}`, JJ = R`\,\mathrm{J}`;
  const KGMS = R`\,\mathrm{kg \cdot m/s}`, NS = R`\,\mathrm{N \cdot s}`;
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const nice = (x, d) => Math.abs(x * Math.pow(10, d) - Math.round(x * Math.pow(10, d))) < 1e-7;

  // 途中の値の表示。x を、有効数字 n 桁に丸めた値と同じになる最小の桁数（3 桁以上）で書く
  const dig = (x, n) => {
    let k = 3;
    while (k < n && U.roundSig(x, k) !== U.roundSig(x, n)) k++;
    return U.sig(x, k);
  };
  // 途中の値 vals を、次の式 f（表示した値で計算する）の結果が target の有効数字 3 桁と一致する最小の桁数で書く。
  // 生徒が表示の数値どうしを電卓で計算しても、表示の結果と最後の桁まで合う（丸めた 18.8 を代入して 12.5 が 12.6 になる、を防ぐ）
  const fit = (vals, f, target) => {
    const want = U.roundSig(target, 3);
    for (let n = 3; n <= 12; n++) {
      if (U.roundSig(f.apply(null, vals.map((x) => U.roundSig(x, n))), 3) === want) return vals.map((x) => dig(x, n));
    }
    return vals.map((x) => dig(x, 12));
  };
  const pr = (s) => (s.charAt(0) === '-' || s.indexOf(R`\times`) >= 0 ? '(' + s + ')' : s);   // 負の数・指数表記は括弧をつけて代入する

  // 図の文字用: 有効数字 3 桁の平文
  function pl(x) {
    if (!isFinite(x)) return '';
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 1e5 || ax < 1e-3) {
      let e = Math.floor(Math.log10(ax));
      let m = U.roundSig(x / Math.pow(10, e), 3);
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return m + '×10' + String(e).replace(/-/g, '⁻').replace(/\d/g, (c) => SUP[c]);
    }
    return String(U.roundSig(x, 3));
  }

  // 各グラフ SVG を入れ子の <svg> として 1 枚にまとめる
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

  /* =====================================================================
     衝突（一直線上）
     ===================================================================== */
  function solveCol(m1, v1, m2, v2, e) {
    const r = { m1: m1, v1: v1, m2: m2, v2: v2, e: e, M: m1 + m2 };
    r.P = m1 * v1 + m2 * v2;
    r.dv = v1 - v2;                                   // 衝突前の近づく速さ
    r.u1 = (r.P - m2 * e * r.dv) / r.M;
    r.u2 = (r.P + m1 * e * r.dv) / r.M;
    r.K0 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
    r.K1 = 0.5 * m1 * r.u1 * r.u1 + 0.5 * m2 * r.u2 * r.u2;
    r.dK = r.K0 - r.K1;
    r.J = m2 * (r.u2 - v2);                           // B が受けた力積（右向き正）
    r.mur = m1 * m2 / r.M;                            // 換算質量
    r.kind = e === 1 ? 'el' : (e === 0 ? 'pl' : 'in');
    return r;
  }

  const kindTex = (r) => (r.kind === 'el' ? R`\text{弾性衝突}` : (r.kind === 'pl' ? R`\text{完全非弾性衝突（一体になる）}` : R`\text{非弾性衝突}`));

  // 衝突前（と後）の様子。problem=true のときは衝突前だけ（求める量は描かない）
  function figCol(r, o) {
    o = o || {};
    const prob = !!o.problem;
    const d = JK.plot.draw(360, prob ? 150 : 300);
    const vs = [r.v1, r.v2].concat(prob ? [] : [r.u1, r.u2]);
    const vmax = Math.max(1e-9, Math.max.apply(null, vs.map(Math.abs)));
    const ks = 62 / vmax;
    const wA = 30 + 34 * Math.sqrt(r.m1 / r.M), wB = 30 + 34 * Math.sqrt(r.m2 / r.M);
    const bh = 34;
    const velArrow = (cx, y, v, cls, lab) => {
      if (Math.abs(ks * v) < 4) return;
      d.arrow(cx, y, cx + ks * v, y, { cls: cls, label: lab, lpos: v < 0 ? -1 : 1, w: 2.2 });
    };
    const panel = (y0, title, xA, xB, vA, vB, labA, labB, line) => {
      const fy = y0 + 94, top = fy - bh;
      d.text(10, y0 + 14, title, { cls: 'dim', size: 11, anchor: 'start' });
      d.hatch(14, fy, 346, fy);
      d.rect(xA, top, wA, bh, { cls: 'fg', fill: 'f1', rx: 3 });
      d.rect(xB, top, wB, bh, { cls: 'fg', fill: 'f2', rx: 3 });
      d.text(xA + wA / 2, top + 22, 'A', { size: 14, bold: true });
      d.text(xB + wB / 2, top + 22, 'B', { size: 14, bold: true });
      velArrow(xA + wA / 2, top - 16, vA, 'c1', labA);
      velArrow(xB + wB / 2, top - 16, vB, 'c2', labB);
      d.text(180, fy + 20, line, { size: 12 });
    };
    const xA0 = 44, xB0 = xA0 + wA + 84;
    panel(0, '衝突前（右向きが正）', xA0, xB0, r.v1, r.v2, 'v₁', 'v₂', 'v₁ = ' + pl(r.v1) + ' m/s　v₂ = ' + pl(r.v2) + ' m/s');
    d.text(180, 138, 'A: m₁ = ' + pl(r.m1) + ' kg　B: m₂ = ' + pl(r.m2) + ' kg' + (prob ? '' : '　e = ' + pl(r.e)), { cls: 'dim', size: 11 });
    if (!prob) {
      const xm = 188;
      panel(150, '衝突後', xm - wA, xm, r.u1, r.u2, 'v₁′', 'v₂′', 'v₁′ = ' + pl(r.u1) + ' m/s　v₂′ = ' + pl(r.u2) + ' m/s');
    }
    return d.svg();
  }

  // 運動エネルギーの前後と、失われた分 ΔK（数値の代入も書く）。
  // o.n / o.easy: 説明文（省略時は衝突の種類に合わせる）、o.plastic: 一体になるとき（衝突後の K を (m₁+m₂)v² / 2 で書く）、o.lv: 粒度
  function stEnergy(r, o) {
    o = o || {};
    const dk = fit([r.K0, r.K1], (p, q) => p - q, r.dK);
    const kBefore = R`K_{\text{前}} = \frac{1}{2}m_{1}v_{1}^{2} + \frac{1}{2}m_{2}v_{2}^{2} = \frac{1}{2} \times ` + nf(r.m1) + R` \times ` + pn(r.v1) + R`^{2} + \frac{1}{2} \times ` + nf(r.m2) + R` \times ` + pn(r.v2) + '^{2} = ' + sig(r.K0) + JJ;
    let kAfter;
    if (o.plastic) {
      const v = fit([r.u1], (x) => 0.5 * r.M * x * x, r.K1)[0];
      kAfter = R`K_{\text{後}} = \frac{1}{2}(m_{1} + m_{2})v^{2} = \frac{1}{2} \times ` + nf(r.M) + R` \times ` + pr(v) + '^{2} = ' + sig(r.K1) + JJ;
    } else {
      const k1 = fit([r.u1, r.u2], (a, b) => 0.5 * r.m1 * a * a + 0.5 * r.m2 * b * b, r.K1);
      kAfter = R`K_{\text{後}} = \frac{1}{2}m_{1}v_{1}'^{2} + \frac{1}{2}m_{2}v_{2}'^{2} = \frac{1}{2} \times ` + nf(r.m1) + R` \times ` + pr(k1[0]) + R`^{2} + \frac{1}{2} \times ` + nf(r.m2) + R` \times ` + pr(k1[1]) + '^{2} = ' + sig(r.K1) + JJ;
    }
    const st = {
      t: '失われた力学的エネルギー',
      m: [kBefore, kAfter, R`\Delta K = K_{\text{前}} - K_{\text{後}} = ` + dk[0] + ' - ' + dk[1] + ' = ' + sig(r.dK) + JJ],
      n: o.n || ((r.kind === 'el' ? R`$e = 1$（弾性衝突）なので、力学的エネルギーは失われません（$\Delta K = 0$）。` :
        (r.kind === 'pl' ? R`$e = 0$（完全非弾性衝突）では、衝突後に一体になり、失われるエネルギーが最大になります。` : R`$0 < e < 1$（非弾性衝突）では、力学的エネルギーが熱や音などに変わって減ります。`)) +
        R`運動量は保存されても、運動エネルギーは保存されるとは限りません。`),
      easy: o.easy || R`衝突の前後で、運動エネルギー $\frac{1}{2}mv^{2}$ の合計を比べます。はね返り係数 $e = 1$ のときだけ運動エネルギーも変わりません。それ以外のときは、衝突で物体が変形したり、音や熱が出たりして、運動エネルギーの一部が失われます。`,
      pro: R`$\Delta K = \frac{1}{2}\cdot\frac{m_{1}m_{2}}{m_{1}+m_{2}}(1 - e^{2})(v_{1}-v_{2})^{2}$（換算質量 $\frac{m_{1}m_{2}}{m_{1}+m_{2}} = ` + nf(P3(r.mur)) + R`\,\mathrm{kg}$）。$e$ が小さいほど、近づく速さが大きいほど損失が大きい。`
    };
    if (o.lv) st.lv = o.lv;
    return st;
  }

  // o.energyLv: 失われたエネルギーのステップの粒度（設問で聞かれないときは 2）
  function colSteps(r, o) {
    o = o || {};
    const steps = [];
    const e = r.e;
    steps.push({
      t: '状況の整理（向きと未知数）',
      n: R`右向きを正とします。質量 $m_{1}` + R` = ` + nf(r.m1) + R`\,\mathrm{kg}$ の物体 A が速度 $v_{1} = ` + nf(r.v1) + R`\,\mathrm{m/s}$、質量 $m_{2} = ` + nf(r.m2) + R`\,\mathrm{kg}$ の物体 B が` +
        (r.v2 === 0 ? R`静止していて（$v_{2} = 0$）` : R`速度 $v_{2} = ` + nf(r.v2) + R`\,\mathrm{m/s}$ で進み`) + R`、衝突した後の速度をそれぞれ $v_{1}'$、$v_{2}'$ とします（図）。未知数が 2 つなので、**運動量保存則**と**はね返り係数の式**の 2 本の式を立てます。`,
      easy: R`**運動量**は「質量 × 速度」で、動いている物体の「勢い」を表す量です。物体どうしがぶつかる間、おたがいに押し合う力（内力）は大きさが等しく向きが逆なので、2 つの物体の運動量の合計は、衝突の前後で変わりません。ただ、これだけでは衝突後の 2 つの速度は決まらないので、「どれだけはね返るか」を表す**はね返り係数 $e$** の式をもう 1 本使います。`,
      pro: R`衝突は「運動量保存 + $e$ の式」の連立が基本。向き（符号）を最初に決めて、速度は符号つきで代入する。`
    });
    steps.push({
      t: '運動量保存則',
      m: [R`m_{1}v_{1} + m_{2}v_{2} = m_{1}v_{1}' + m_{2}v_{2}'`,
        nf(r.m1) + R` \times ` + pn(r.v1) + ' + ' + nf(r.m2) + R` \times ` + pn(r.v2) + ' = ' + sig(r.P) + KGMS,
        nf(r.m1) + R`\,v_{1}' + ` + nf(r.m2) + R`\,v_{2}' = ` + sig(r.P) + R`\qquad \cdots ①`],
      n: R`衝突のあいだ、外から水平方向の力がはたらかない（または衝突の力が非常に大きく短時間で、外力の影響が無視できる）ので、衝突前後で運動量の和が保存されます。左辺は衝突前の運動量の和 $P = ` + sig(r.P) + R`\,\mathrm{kg \cdot m/s}$ です。`,
      easy: R`衝突前の運動量の合計を計算します（左向きの速度は負の数で入れます）。衝突後の運動量の合計もこれと同じになるので、「$m_{1}v_{1}' + m_{2}v_{2}'$ = 衝突前の合計」という式（①）ができます。`
    });
    steps.push({
      t: 'はね返り係数の式',
      m: [R`e = -\frac{v_{1}' - v_{2}'}{v_{1} - v_{2}} \;\Rightarrow\; v_{1}' - v_{2}' = -e\,(v_{1} - v_{2})`,
        R`v_{1}' - v_{2}' = -` + nf(e) + R` \times (` + nf(r.v1) + ' - ' + pn(r.v2) + ') = ' + sig(-e * r.dv) + MS + R`\qquad \cdots ②`],
      n: R`はね返り係数 $e$ は、「衝突前に近づく速さ $v_{1}-v_{2}$」に対する「衝突後に遠ざかる速さ $v_{2}'-v_{1}'$」の比です。$e = 1$ なら同じ速さではね返り（弾性衝突）、$e = 0$ ならはね返らず一体になります（完全非弾性衝突）。`,
      easy: R`ボールを床に落とすとはね返りますが、元の速さよりは遅くなります。「近づく速さ」と「遠ざかる速さ」の比がはね返り係数 $e$ です（$0 \le e \le 1$）。$e = 1$ は完全にはね返る場合、$e = 0$ は粘土のようにくっつく場合です。式には、衝突前の速度の差 $v_{1} - v_{2}$ と、衝突後の速度の差 $v_{1}' - v_{2}'$ を入れます（向きが逆転するのでマイナスがつきます）。`
    });
    steps.push({
      t: '連立して衝突後の速度を求める',
      m: [R`v_{1}' = \frac{m_{1}v_{1} + m_{2}v_{2} - m_{2}e(v_{1}-v_{2})}{m_{1}+m_{2}},\qquad v_{2}' = \frac{m_{1}v_{1} + m_{2}v_{2} + m_{1}e(v_{1}-v_{2})}{m_{1}+m_{2}}`,
        R`v_{1}' = \frac{` + fit([r.P], (P) => (P - r.m2 * e * r.dv) / r.M, r.u1)[0] + ' - ' + nf(r.m2) + R` \times ` + nf(e) + R` \times ` + nf(r.dv) + '}{' + nf(r.M) + '} = ' + sig(r.u1) + MS,
        R`v_{2}' = \frac{` + fit([r.P], (P) => (P + r.m1 * e * r.dv) / r.M, r.u2)[0] + ' + ' + nf(r.m1) + R` \times ` + nf(e) + R` \times ` + nf(r.dv) + '}{' + nf(r.M) + '} = ' + sig(r.u2) + MS],
      n: R`②から $v_{1}' = v_{2}' - e(v_{1}-v_{2})$ とし、①に代入すると $(m_{1}+m_{2})v_{2}' = P + m_{1}e(v_{1}-v_{2})$ となって $v_{2}'$ が求まります。$v_{1}'$ は②からすぐに出ます。符号が正なら右向き、負なら左向きに動きます。`,
      easy: R`①と②は、$v_{1}'$ と $v_{2}'$ の 2 つの文字を含む連立方程式です。②を「$v_{1}' = v_{2}' - \cdots$」の形にして①に代入すると、文字が $v_{2}'$ 1 つだけになって解けます。計算結果の符号に注意しましょう（マイナスなら左向き = はね返っています）。`,
      pro: R`$e = 1$（弾性衝突）なら $v_{1}' = \frac{(m_{1}-m_{2})v_{1}+2m_{2}v_{2}}{m_{1}+m_{2}}$。質量が等しければ速度が入れかわる。$e = 0$ なら $v_{1}' = v_{2}' = \frac{P}{m_{1}+m_{2}}$（一体）。`
    });
    const chk = fit([r.u1, r.u2], (a, b) => r.m1 * a + r.m2 * b, r.P);
    const ee = (() => { const s = fit([r.u1 - r.u2], (d) => -d / r.dv, r.e)[0]; return Math.abs(-Number(s) / r.dv - r.e) <= 1e-9 * Math.abs(r.e) ? s : nf(r.u1 - r.u2); })();   // e は入力どおりに書くので、分子が 3 桁の近似で合わないとき（e が 4 桁以上）は分子もちょうどの値で書く
    steps.push({
      t: '検算',
      m: [R`m_{1}v_{1}' + m_{2}v_{2}' = ` + nf(r.m1) + R` \times ` + pr(chk[0]) + ' + ' + nf(r.m2) + R` \times ` + pr(chk[1]) + ' = ' + sig(r.P) + KGMS,
        R`-\frac{v_{1}' - v_{2}'}{v_{1} - v_{2}} = -\frac{` + ee + '}{' + nf(r.dv) + '} = ' + nf(r.e)],
      n: R`求めた速度を運動量保存の式とはね返り係数の式に戻して、衝突前の値（$P$ と $e$）に一致することを確かめます。`,
      lv: 2
    });
    steps.push(stEnergy(r, { lv: o.energyLv }));
    const jd = fit([r.u2], (b) => r.m2 * (b - r.v2), r.J)[0];
    steps.push({
      t: 'B が受けた力積（参考）',
      m: [R`I = m_{2}v_{2}' - m_{2}v_{2} = ` + nf(r.m2) + R` \times (` + jd + ' - ' + pn(r.v2) + ') = ' + sig(r.J) + NS],
      n: R`B の運動量の変化が、B が受けた力積です（A は同じ大きさで逆向きの力積を受けます）。運動量の変化 = 力積の関係は、次の「力積と運動量」のシミュレーターで詳しく扱います。`,
      lv: 2
    });
    return steps;
  }

  // 衝突して一体になる（完全非弾性衝突）。「衝突後の速度が共通」と運動量保存則で解く（はね返り係数の式は使わない）
  function colStepsPlastic(r) {
    const stB = r.v2 === 0 ? R`静止している（$v_{2} = 0$）` : R`速度 $v_{2} = ` + nf(r.v2) + R`\,\mathrm{m/s}$ で進んでいる`;
    return [
      {
        t: '状況の整理（一体になる）',
        n: R`右向きを正とします。質量 $m_{1} = ` + nf(r.m1) + R`\,\mathrm{kg}$ の物体 A が速度 $v_{1} = ` + nf(r.v1) + R`\,\mathrm{m/s}$ で進み、質量 $m_{2} = ` + nf(r.m2) + R`\,\mathrm{kg}$ の物体 B が` + stB + R`ところに衝突して、A と B は**一体**になりました。一体になった後の速度を $v$ とします（A も B も同じ速度 $v$ で動きます）。`,
        easy: R`「一体になる」とは、衝突のあと A と B がくっついて、1 つの物体のようにいっしょに動くことです。くっついているので、A の速度も B の速度も同じ値になります。この共通の速度を $v$ とおきます。`,
        pro: R`一体になる衝突は完全非弾性衝突（$e = 0$）。衝突後の速度が共通なので、運動量保存の式だけで速度が求まる（はね返り係数の式は不要）。`
      },
      {
        t: '運動量保存則（一体になったあとの速度）',
        m: [R`m_{1}v_{1} + m_{2}v_{2} = (m_{1} + m_{2})v`,
          R`v = \frac{m_{1}v_{1} + m_{2}v_{2}}{m_{1} + m_{2}} = \frac{` + nf(r.m1) + R` \times ` + pn(r.v1) + ' + ' + nf(r.m2) + R` \times ` + pn(r.v2) + '}{' + nf(r.m1) + ' + ' + nf(r.m2) + '} = ' + sig(r.u1) + MS],
        n: R`衝突のあいだ、外から水平方向の力がはたらかない（または衝突の力が非常に大きく短時間で、外力の影響が無視できる）ので、衝突前後で運動量の和が保存されます。衝突後は、質量 $m_{1} + m_{2}$ の 1 つの物体が速度 $v$ で動くので、運動量の和は $(m_{1} + m_{2})v$ です。`,
        easy: R`衝突前の運動量の合計は「A の運動量 + B の運動量」です（B が静止していれば、B の分は 0）。衝突後は 2 つが 1 つの物体になり、質量は $m_{1} + m_{2}$、速度は $v$ なので、運動量は $(m_{1} + m_{2})v$ です。この 2 つが等しいことから $v$ が求まります。`,
        pro: R`B が静止なら $v = \frac{m_{1}v_{1}}{m_{1} + m_{2}}$。質量の和が 2 倍になれば速度は半分、と見積もれる。`
      },
      stEnergy(r, { plastic: true })
    ];
  }

  // 衝突の文（B が A と同じ向きに進んでいれば「追いついて」、静止なら A が B に、向かい合って進むなら「A と B が」）
  const hitJa = (v2) => (v2 > 0 ? R`A が B に追いついて正面衝突` : (v2 === 0 ? R`A が B に正面衝突` : R`A と B が正面衝突`));

  const sgnJa = (v) => (v > 0 ? R`右向きに速さ $` + v.toFixed(1) + R`\,\mathrm{m/s}$ で` : (v < 0 ? R`左向きに速さ $` + (-v).toFixed(1) + R`\,\mathrm{m/s}$ で` : ''));

  JK.registerSim({
    id: 'mech-collision',
    field: '力学',
    unit: 'p-momentum',
    title: '一直線上の衝突（運動量保存とはね返り係数）',
    desc: R`なめらかな水平面上の一直線上で、物体 A（左）が物体 B（右）に衝突します。運動量保存則とはね返り係数の式から、衝突後の速度・失われる力学的エネルギー・B が受けた力積を求め、衝突前後の様子を図で比べます。`,
    form: [R`m_{1}v_{1} + m_{2}v_{2} = m_{1}v_{1}' + m_{2}v_{2}'`, R`e = -\frac{v_{1}' - v_{2}'}{v_{1} - v_{2}}`, R`\Delta K = K_{\text{前}} - K_{\text{後}}`],
    inputs: [
      { key: 'm1', label: 'A（左）の質量 m₁', unit: 'kg', type: 'num', def: '2.0', min: 0.01, max: 1000 },
      { key: 'v1', label: 'A の衝突前の速度 v₁', unit: 'm/s', type: 'num', def: '6.0', min: -1000, max: 1000, hint: '右向きが正。左向きは負の数で入力' },
      { key: 'm2', label: 'B（右）の質量 m₂', unit: 'kg', type: 'num', def: '4.0', min: 0.01, max: 1000 },
      { key: 'v2', label: 'B の衝突前の速度 v₂', unit: 'm/s', type: 'num', def: '0', min: -1000, max: 1000, hint: '静止なら 0。A に追いつかれる向き（v₁ > v₂）で入力' },
      { key: 'e', label: 'はね返り係数 e', type: 'num', def: '0.50', min: 0, max: 1, hint: '1 で弾性衝突、0 で一体になる（完全非弾性衝突）' }
    ],
    examples: [
      { label: '弾性衝突（e = 1）', v: { m1: '2.0', v1: '6.0', m2: '4.0', v2: '0', e: '1' } },
      { label: '完全非弾性衝突（e = 0）', v: { m1: '3.0', v1: '4.0', m2: '1.0', v2: '0', e: '0' } },
      { label: '非弾性衝突（e = 0.5）', v: { m1: '2.0', v1: '5.0', m2: '3.0', v2: '-1.0', e: '0.50' } },
      { label: '質量が等しい弾性衝突', v: { m1: '1.0', v1: '4.0', m2: '1.0', v2: '0', e: '1' } }
    ],
    intro: {
      easy: R`物体どうしがぶつかる「衝突」では、ぶつかる前後で、2 つの物体の**運動量（質量 × 速度）の合計が変わりません**。これを運動量保存則といいます。ただし、衝突後の 2 つの速度を決めるには式がもう 1 本必要で、それが「どのくらいはね返るか」を表す**はね返り係数 $e$** の式です。$e = 1$ なら完全にはね返り（弾性衝突）、$e = 0$ なら一体になり（完全非弾性衝突）、その間なら一部のエネルギーが失われます。向き（左右）は符号で区別します。`,
      normal: R`①運動量保存 $m_{1}v_{1} + m_{2}v_{2} = m_{1}v_{1}' + m_{2}v_{2}'$、②$e = -\frac{v_{1}' - v_{2}'}{v_{1} - v_{2}}$ を連立して $v_{1}', v_{2}'$ を求めます。`,
      pro: R`$v_{1}' = \frac{P - m_{2}e(v_{1}-v_{2})}{m_{1}+m_{2}}$、$v_{2}' = \frac{P + m_{1}e(v_{1}-v_{2})}{m_{1}+m_{2}}$。損失 $\Delta K = \frac{1}{2}\frac{m_{1}m_{2}}{m_{1}+m_{2}}(1-e^{2})(v_{1}-v_{2})^{2}$。$e$ が不明な問題は、衝突後の速度から $e = \frac{v_{2}'-v_{1}'}{v_{1}-v_{2}}$ で逆算する。`
    },
    compute(v) {
      if (!(v.v1 > v.v2)) {
        throw new JK.CalcError('衝突が起こりません。A（左）の速度 v₁ が B（右）の速度 v₂ より大きく（A が B に追いつく状態に）なるように入力してください。');
      }
      const r = solveCol(v.m1, v.v1, v.m2, v.v2, v.e);
      return {
        result: [
          { label: '衝突後の A の速度 v₁′', tex: sig(r.u1) + MS },
          { label: '衝突後の B の速度 v₂′', tex: sig(r.u2) + MS },
          { label: '運動量の和 P（衝突前後で同じ）', tex: sig(r.P) + KGMS },
          { label: '失われた力学的エネルギー ΔK', tex: sig(r.dK) + JJ },
          { label: 'B が受けた力積 I', tex: sig(r.J) + NS },
          { label: '衝突の種類', tex: kindTex(r) }
        ],
        steps: colSteps(r),
        fig: figCol(r)
      };
    },

    exercise(rng, level) {
      const cands = [];
      const lists = (es, m1s, m2s, v1s, v2s, test) => {
        es.forEach((e) => m1s.forEach((m1) => m2s.forEach((m2) => v1s.forEach((v1) => v2s.forEach((v2) => {
          if (!(v1 > v2) || (level === 'basic' && m1 === m2)) return;
          const r = solveCol(m1, v1, m2, v2, e);
          if (test(r)) cands.push(r);
        })))));
      };
      if (level === 'basic') {
        lists([0, 1], [1.0, 2.0, 3.0, 4.0, 5.0], [1.0, 2.0, 3.0, 4.0, 5.0, 6.0], [2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0], [0],
          (r) => nice(r.u1, 1) && nice(r.u2, 1) && Math.abs(r.u1) >= 0.2 && nice(r.dK, 1));
      } else if (level === 'mid') {
        lists([0.5, 0.6, 0.8, 0.4], [1.0, 2.0, 3.0, 4.0], [1.0, 2.0, 3.0, 4.0, 5.0], [3.0, 4.0, 5.0, 6.0, 8.0], [0, 1.0, 2.0, -1.0, -2.0, -3.0],
          (r) => nice(r.u1, 2) && nice(r.u2, 2) && Math.abs(r.u1) >= 0.1 && Math.abs(r.u2) >= 0.1 && r.dK > 0.5);
      } else {
        lists([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8], [1.0, 2.0, 3.0, 4.0, 5.0], [1.0, 2.0, 3.0, 4.0, 5.0, 6.0], [4.0, 5.0, 6.0, 8.0, 10.0], [0, 1.0, 2.0, -1.0, -2.0, -4.0],
          (r) => nice(r.u2, 1) && nice(r.u1, 2) && Math.abs(r.u1) >= 0.1 && r.dK > 1);
      }
      const r = rng.pick(cands);
      const surf = R`なめらかな水平面上の一直線上で、`;
      const tail = R`右向きを正として、次の問いに答えよ。`;
      const tol = { rel: 0.02, tol: 0.005 };
      if (level === 'basic') {
        const fig = figCol(r, { problem: true });
        if (r.kind === 'pl') {
          return {
            title: '衝突して一体になる物体',
            body: surf + R`質量 $` + r.m1.toFixed(1) + R`\,\mathrm{kg}$ の物体 A が右向きに速さ $` + r.v1.toFixed(1) + R`\,\mathrm{m/s}$ で進み、静止している質量 $` + r.m2.toFixed(1) + R`\,\mathrm{kg}$ の物体 B に衝突して、A と B は一体となって運動した。` + tail,
            fig: fig,
            parts: [
              { label: '(1)', q: R`衝突後の A と B の速度 $v$（右向きを正）`, type: 'num', answer: P3(r.u1), rel: tol.rel, tol: tol.tol, unit: 'm/s' },
              { label: '(2)', q: R`衝突で失われた力学的エネルギー $\Delta K$`, type: 'num', answer: P3(r.dK), rel: 0.02, unit: 'J' }
            ],
            solution: colStepsPlastic(r)
          };
        }
        return {
          title: '弾性衝突する 2 物体',
          body: surf + R`質量 $` + r.m1.toFixed(1) + R`\,\mathrm{kg}$ の物体 A が右向きに速さ $` + r.v1.toFixed(1) + R`\,\mathrm{m/s}$ で進み、静止している質量 $` + r.m2.toFixed(1) + R`\,\mathrm{kg}$ の物体 B に正面衝突した。この衝突は弾性衝突（はね返り係数 $e = 1$）であった。` + tail,
          fig: fig,
          parts: [
            { label: '(1)', q: R`衝突後の A の速度 $v_{1}'$`, type: 'num', answer: P3(r.u1), rel: tol.rel, tol: tol.tol, unit: 'm/s' },
            { label: '(2)', q: R`衝突後の B の速度 $v_{2}'$`, type: 'num', answer: P3(r.u2), rel: tol.rel, tol: tol.tol, unit: 'm/s' }
          ],
          solution: colSteps(r, { energyLv: 2 })
        };
      }
      if (level === 'mid') {
        return {
          title: '非弾性衝突する 2 物体',
          body: surf + R`質量 $` + r.m1.toFixed(1) + R`\,\mathrm{kg}$ の物体 A が` + sgnJa(r.v1) + R`進み、質量 $` + r.m2.toFixed(1) + R`\,\mathrm{kg}$ の物体 B が` + (r.v2 === 0 ? R`静止して` : sgnJa(r.v2) + R`進んで`) + R`いた。` + hitJa(r.v2) + R`した。A と B の間のはね返り係数は $` + r.e.toFixed(2) + R`$ である。` + tail,
          fig: figCol(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`衝突後の A の速度 $v_{1}'$`, type: 'num', answer: P3(r.u1), rel: tol.rel, tol: tol.tol, unit: 'm/s' },
            { label: '(2)', q: R`衝突後の B の速度 $v_{2}'$`, type: 'num', answer: P3(r.u2), rel: tol.rel, tol: tol.tol, unit: 'm/s' },
            { label: '(3)', q: R`衝突で失われた力学的エネルギー $\Delta K$`, type: 'num', answer: P3(r.dK), rel: 0.02, unit: 'J' }
          ],
          solution: colSteps(r)
        };
      }
      // adv: 衝突後の B の速度から e を逆算
      const solution = [
        {
          t: '状況の整理（向きと未知数）',
          n: R`右向きを正とします。A（質量 $m_{1} = ` + nf(r.m1) + R`\,\mathrm{kg}$）の衝突前の速度は $v_{1} = ` + nf(r.v1) + R`\,\mathrm{m/s}$、B（質量 $m_{2} = ` + nf(r.m2) + R`\,\mathrm{kg}$）の衝突前の速度は $v_{2} = ` + nf(r.v2) + R`\,\mathrm{m/s}$、衝突後の B の速度は $v_{2}' = ` + nf(r.u2) + R`\,\mathrm{m/s}$ と与えられています。はね返り係数 $e$ は未知ですが、運動量保存則だけで $v_{1}'$ が求まり、そのあとで $e$ が逆算できます。`,
          easy: R`この問題では、「衝突後の B の速度」が分かっているので、先に運動量保存則から A の速度を求めてしまいます。そのあと、「近づく速さ」と「遠ざかる速さ」の比（はね返り係数 $e$）を計算します。順番が普段と逆になるだけで、使う式は同じです。`,
          pro: R`$e$ が未知のときは「運動量保存で $v_{1}'$ → 定義式で $e$」の順。$0 \le e \le 1$ に入っているか確認する。`
        },
        {
          t: R`運動量保存則から $v_{1}'$ を求める`,
          m: [R`m_{1}v_{1} + m_{2}v_{2} = m_{1}v_{1}' + m_{2}v_{2}'`,
            R`v_{1}' = \frac{m_{1}v_{1} + m_{2}v_{2} - m_{2}v_{2}'}{m_{1}}`,
            R`v_{1}' = \frac{` + nf(r.m1) + R` \times ` + pn(r.v1) + ' + ' + nf(r.m2) + R` \times ` + pn(r.v2) + ' - ' + nf(r.m2) + R` \times ` + pn(r.u2) + '}{' + nf(r.m1) + '} = ' + sig(r.u1) + MS],
          n: R`衝突前の運動量の和 $P = m_{1}v_{1} + m_{2}v_{2} = ` + sig(r.P) + R`\,\mathrm{kg \cdot m/s}$ が、衝突後の $m_{1}v_{1}' + m_{2}v_{2}'$ に等しいことから $v_{1}'$ を求めます。`,
          easy: R`衝突後の運動量の合計は、衝突前の合計 $P$ に等しいはずです。B の分 $m_{2}v_{2}'$ を引いた残りが A の運動量 $m_{1}v_{1}'$ なので、それを $m_{1}$ で割れば $v_{1}'$ です。`
        },
        {
          t: 'はね返り係数を求める',
          m: [R`e = -\frac{v_{1}' - v_{2}'}{v_{1} - v_{2}}`,
            R`e = -\frac{` + fit([r.u1], (a) => -(a - r.u2) / r.dv, r.e)[0] + ' - ' + pn(r.u2) + '}{' + nf(r.v1) + ' - ' + pn(r.v2) + '} = ' + nf(r.e)],
          n: R`はね返り係数の定義（衝突後に遠ざかる速さ ÷ 衝突前に近づく速さ）に代入します。$0 \le e \le 1$ の範囲に入っているので、妥当な値です。`,
          easy: R`「近づく速さ」は衝突前の速度の差 $v_{1}-v_{2}$、「遠ざかる速さ」は衝突後の速度の差 $v_{2}'-v_{1}'$ です。その比が $e$ なので、符号に気をつけて数値を入れます。`
        },
        stEnergy(r, {
          n: R`衝突の前後で運動エネルギーの和を比べます。$e < 1$ なので、差 $\Delta K$ は正（エネルギーが失われた）です。`,
          easy: R`衝突の前の運動エネルギーの合計 $\frac{1}{2}mv^{2}$ から、衝突の後の合計を引いた分が、熱や音などに変わって失われたエネルギーです。`
        })
      ];
      return {
        title: 'はね返り係数が未知の衝突',
        body: surf + R`質量 $` + r.m1.toFixed(1) + R`\,\mathrm{kg}$ の物体 A が` + sgnJa(r.v1) + R`進み、質量 $` + r.m2.toFixed(1) + R`\,\mathrm{kg}$ の物体 B が` + (r.v2 === 0 ? R`静止して` : sgnJa(r.v2) + R`進んで`) + R`いた。` + hitJa(r.v2) + R`したところ、衝突後の B の速度は $` + r.u2.toFixed(1) + R`\,\mathrm{m/s}$（右向き）になった。` + tail,
        fig: figCol(r, { problem: true }),
        parts: [
          { label: '(1)', q: R`衝突後の A の速度 $v_{1}'$`, type: 'num', answer: P3(r.u1), rel: tol.rel, tol: tol.tol, unit: 'm/s' },
          { label: '(2)', q: R`A と B の間のはね返り係数 $e$`, type: 'num', answer: P3(r.e), rel: 0.02, tol: 0.005 },
          { label: '(3)', q: R`衝突で失われた力学的エネルギー $\Delta K$`, type: 'num', answer: P3(r.dK), rel: 0.02, unit: 'J' }
        ],
        solution: solution
      };
    }
  });

  /* =====================================================================
     力積と運動量（F–t グラフ）
     ===================================================================== */
  function solveImp(shape, m, v0, F, T, tr) {
    const r = { shape: shape, m: m, v0: v0, F: F, T: T, tr: tr };
    r.I = shape === 'rect' ? F * T : (shape === 'tri' ? F * T / 2 : F * (T - tr));
    r.dv = r.I / m;
    r.v = v0 + r.dv;
    r.Fm = r.I / T;                                   // 平均の力
    r.K0 = 0.5 * m * v0 * v0; r.K1 = 0.5 * m * r.v * r.v; r.dK = r.K1 - r.K0;
    return r;
  }

  // F(t) と、時刻 t までの力積 I(t)（解析式）
  function forceFn(r) {
    const F = r.F, T = r.T, tr = r.tr;
    if (r.shape === 'rect') return (t) => (t >= 0 && t <= T ? F : 0);
    if (r.shape === 'tri') return (t) => (t >= 0 && t <= T ? F * (1 - Math.abs(2 * t / T - 1)) : 0);
    return (t) => (t >= 0 && t <= T ? F * Math.min(1, t / tr, (T - t) / tr) : 0);
  }
  function impulseFn(r) {
    const F = r.F, T = r.T, tr = r.tr, I = r.I;
    if (r.shape === 'rect') return (t) => F * Math.max(0, Math.min(t, T));
    if (r.shape === 'tri') {
      return (t) => {
        if (t <= 0) return 0;
        if (t >= T) return I;
        return t <= T / 2 ? F * t * t / T : I - F * (T - t) * (T - t) / T;
      };
    }
    return (t) => {
      if (t <= 0) return 0;
      if (t >= T) return I;
      if (t <= tr) return F * t * t / (2 * tr);
      if (t <= T - tr) return F * tr / 2 + F * (t - tr);
      return I - F * (T - t) * (T - t) / (2 * tr);
    };
  }

  function ftGraph(r, o) {
    o = o || {};
    const f = forceFn(r);
    const hi = Math.max(0, r.F) * 1.3 || 0, lo = Math.min(0, r.F) * 1.3 || 0;
    const pad = (hi - lo) * 0.1;
    const g = {
      w: 340, h: 176, x: [0, r.T * 1.28], y: [r.F > 0 ? -pad : lo, r.F > 0 ? hi : pad],
      axis: ['t [s]', 'F [N]'],
      curves: [{ f: f, cls: 'c1', domain: [0, r.T] }],
      fills: [{ f: f, g: () => 0, from: 0, to: r.T, cls: 'f1' }],
      hlines: [{ y: r.F, label: 'F = ' + pl(r.F) + ' N', dash: true }],
      vlines: [{ x: r.T, label: 'Δt = ' + pl(r.T) + ' s', dash: true }],
      segs: [], labels: []
    };
    if (r.shape === 'rect') {
      g.segs.push({ x1: 0, y1: 0, x2: 0, y2: r.F, cls: 'c1' }, { x1: r.T, y1: r.F, x2: r.T, y2: 0, cls: 'c1' });
    } else if (r.shape === 'trap') {
      g.vlines.push({ x: r.tr, label: '', dash: true }, { x: r.T - r.tr, label: '', dash: true });
      g.points = [{ x: r.tr, y: r.F, label: '(' + pl(r.tr) + ', ' + pl(r.F) + ')', cls: 'c3', pos: 'tl' }, { x: r.T - r.tr, y: r.F, label: '(' + pl(r.T - r.tr) + ', ' + pl(r.F) + ')', cls: 'c3', pos: 'tr' }];
    }
    if (!o.problem) {
      g.labels.push({ x: r.T / 2, y: r.F * (r.shape === 'rect' ? 0.45 : 0.3), text: 'I = 面積 = ' + pl(r.I) + ' N·s', anchor: 'middle', cls: 'fg' });
    }
    return JK.plot.graph(g);
  }

  function vtGraph(r) {
    const I = impulseFn(r);
    const vf = (t) => r.v0 + I(t) / r.m;
    const lo0 = Math.min(0, r.v0, r.v), hi0 = Math.max(0, r.v0, r.v);
    const pad = (hi0 - lo0 || 1) * 0.2;
    const g = {
      w: 340, h: 176, x: [0, r.T * 1.28], y: [lo0 < 0 ? lo0 - pad : -pad * 0.4, hi0 + pad],
      axis: ['t [s]', 'v [m/s]'],
      curves: [{ f: vf, cls: 'c2', domain: [0, r.T * 1.28] }],
      vlines: [{ x: r.T, label: 'Δt', dash: true }],
      points: [{ x: r.T, y: r.v, label: 'v = ' + pl(r.v) + ' m/s', cls: 'c3', pos: r.v >= r.v0 ? 'br' : 'tr' }],
      labels: []
    };
    if (r.v0 !== 0) g.points.push({ x: 0, y: r.v0, label: 'v₀ = ' + pl(r.v0), cls: 'c3', pos: r.v0 >= r.v ? 'tr' : 'br' });
    return JK.plot.graph(g);
  }

  function figImp(r, o) {
    o = o || {};
    if (o.problem) return ftGraph(r, o);
    return stack([{ svg: ftGraph(r, o), h: 176 }, { svg: vtGraph(r), h: 176 }], 360);
  }

  const shapeJa = (r) => (r.shape === 'rect' ? '長方形' : (r.shape === 'tri' ? '三角形' : '台形'));

  // o.avgLv: 平均の力のステップの粒度（設問で聞かれないときは 2）
  function impSteps(r, o) {
    o = o || {};
    const steps = [];
    steps.push({
      t: '力積と運動量の関係',
      m: [R`\vec{I} = \vec{F}\,\Delta t\ \ (\text{力が一定のとき}),\qquad m\vec{v} - m\vec{v_{0}} = \vec{I}`],
      n: R`力 $F$ が時間 $\Delta t$ のあいだはたらいたときの**力積**は $I = F\Delta t$ です。力が変化するときは、F–t グラフと時間軸ではさまれた**面積**が力積になります。物体の**運動量の変化は、受けた力積に等しい**（$mv - mv_{0} = I$）。向きは符号で表し、ここでは正の向きを正とします。`,
      easy: R`ボールをバットで打つとき、「強い力を長く加える」ほど、ボールの速度は大きく変わります。この「力 × 時間」が**力積**です。力が時間とともに変わるときは、グラフ（縦軸 $F$、横軸 $t$）の**面積**が力積になります（長方形なら縦 × 横 = $F \times \Delta t$ です）。そして、物体の「質量 × 速度」（運動量）は、受けた力積の分だけ変化します。`,
      pro: R`$I = \int F\,dt$ = F–t グラフの面積。運動量の変化 $\Delta p = I$（ベクトル。符号に注意）。`
    });
    const area = r.shape === 'rect'
      ? [R`I = F\,\Delta t = ` + nf(r.F) + R` \times ` + nf(r.T) + ' = ' + sig(r.I) + NS]
      : (r.shape === 'tri'
        ? [R`I = \frac{1}{2} \times \Delta t \times F = \frac{1}{2} \times ` + nf(r.T) + R` \times ` + nf(r.F) + ' = ' + sig(r.I) + NS]
        : [R`I = \frac{1}{2}\{\Delta t + (\Delta t - 2t_{1})\}F = F(\Delta t - t_{1})`,
          R`I = ` + nf(r.F) + R` \times (` + nf(r.T) + ' - ' + nf(r.tr) + ') = ' + sig(r.I) + NS]);
    steps.push({
      t: 'F–t グラフの面積から力積を求める',
      m: area,
      n: R`グラフの形は` + shapeJa(r) + R`です。` + (r.shape === 'rect' ? R`面積は「縦 × 横」です。` : (r.shape === 'tri' ? R`面積は「底辺 × 高さ ÷ 2」です。` : R`面積は「（上底 + 下底）× 高さ ÷ 2」です（下底 $\Delta t$、上底 $\Delta t - 2t_{1}$、高さ $F$。$t_{1}$ は力が増えて一定になるまでの時間で、図では上底の左端の時刻です）。`)),
      easy: R`力積 = グラフの面積です。` + (r.shape === 'rect' ? R`力が一定なので、グラフは長方形になり、面積は「力 × 時間」です。` : (r.shape === 'tri' ? R`力が 0 から最大値まで増えてまた 0 に戻るので、グラフは三角形です。底辺が時間 $\Delta t$、高さが最大の力 $F$ なので、面積は $\frac{1}{2} \times \Delta t \times F$ です。` : R`力が増えて、一定になって、また減るので、グラフは台形です。面積は「（上底 + 下底）× 高さ ÷ 2」で求めます。`)) + R`力の単位 N と時間の単位 s をかけたものが、力積の単位 $\mathrm{N \cdot s}$ です。`
    });
    steps.push({
      t: '運動量の変化から力を受けた後の速度を求める',
      m: [R`mv = mv_{0} + I \;\Rightarrow\; v = v_{0} + \frac{I}{m}`,
        R`v = ` + nf(r.v0) + R` + \frac{` + fit([r.I], (I) => r.v0 + I / r.m, r.v)[0] + '}{' + nf(r.m) + '} = ' + sig(r.v) + MS],
      n: R`運動量の変化 $mv - mv_{0}$ が力積 $I$ に等しいので、これを $v$ について解きます。$v_{0}$ や $I$ が負（左向き）のときは、符号をつけて代入します。`,
      easy: R`物体の運動量（質量 × 速度）は、最初は $mv_{0}$ でした。力積 $I$ をもらうと、その分だけ増えて $mv_{0} + I$ になります。これが力を受けた後の運動量 $mv$ です。両辺を質量 $m$ で割れば、速度 $v$ が出ます。力の向きと最初の速度の向きが逆なら、速度は小さくなったり、向きが逆になったりします。`
    });
    steps.push({
      t: '平均の力',
      m: [R`\bar{F} = \frac{I}{\Delta t} = \frac{` + fit([r.I], (I) => I / r.T, r.Fm)[0] + '}{' + nf(r.T) + '} = ' + sig(r.Fm) + NN],
      n: R`力積を力がはたらいた時間で割ると、その間の**平均の力**が求まります（グラフでは、同じ面積をもつ長方形の高さ）。`,
      easy: R`力が変化していても、「同じ力積を与える一定の力」に置きかえたものが平均の力です。力積（面積）を時間（横の長さ）で割れば、長方形に直したときの高さになります。`,
      pro: R`三角形なら平均は最大値の $\frac{1}{2}$。衝突のように短時間に大きな力がはたらく問題では、力積から平均の力を出すのが定石。`,
      lv: o.avgLv || 1
    });
    steps.push({
      t: '運動エネルギーの変化（参考）',
      m: [R`\Delta K = \frac{1}{2}mv^{2} - \frac{1}{2}mv_{0}^{2} = ` + fit([r.K1, r.K0], (a, b) => a - b, r.dK).join(' - ') + ' = ' + sig(r.dK) + JJ],
      n: R`力積は速度の変化を、仕事は運動エネルギーの変化を決めます。この力が物体にした仕事は、$\Delta K$ に等しくなります。`,
      lv: 2
    });
    steps.push({
      t: '向き（符号）の注意',
      n: (r.v0 !== 0 && r.v0 * r.v < 0)
        ? R`この問題では、はじめの速度 $v_{0} = ` + nf(r.v0) + R`\,\mathrm{m/s}$ と力の向きが逆なので、物体は一度止まってから逆向きに動き出し、最後の速度は $v = ` + sig(r.v) + R`\,\mathrm{m/s}$（向きが反転）になります。速さと速度（符号つき）を区別しましょう。`
        : R`運動量・力積はどちらもベクトルです。正の向きを決めて、逆向きのものは負の数で計算します。最後の速度の符号が、動く向きを表します。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'mech-impulse',
    field: '力学',
    unit: 'p-momentum',
    title: '力積と運動量（F–t グラフ）',
    desc: R`物体に力がはたらいたときの F–t グラフ（長方形・三角形・台形）から、力積 $I$（グラフの面積）・力を受けた後の速度・平均の力を求めます。F–t グラフと v–t グラフを並べて表示します。`,
    form: [R`I = \int F\,dt\ (= F\text{–}t\ \text{グラフの面積})`, R`mv - mv_{0} = I`, R`\bar{F} = \frac{I}{\Delta t}`],
    inputs: [
      { key: 'shape', label: '力の時間変化（F–t グラフの形）', type: 'select', def: 'rect', options: [['rect', '一定の力（長方形）'], ['tri', '三角形（0 → 最大 → 0）'], ['trap', '台形（立ち上がり → 一定 → 立ち下がり）']] },
      { key: 'm', label: '物体の質量 m', unit: 'kg', type: 'num', def: '2.0', min: 0.001, max: 10000 },
      { key: 'v0', label: '力を受ける前の速度 v₀', unit: 'm/s', type: 'num', def: '0', min: -1000, max: 1000, hint: '力の向きを正とします。逆向きなら負の数' },
      { key: 'F', label: '力の最大値（一定の力の大きさ）F', unit: 'N', type: 'num', def: '10', min: -100000, max: 100000, hint: '正の向きの力は正、逆向きの力は負の数' },
      { key: 'T', label: '力がはたらいた時間 Δt', unit: 's', type: 'num', def: '3.0', min: 0.0001, max: 10000 },
      { key: 'tr', label: '台形の立ち上がり（立ち下がり）時間 t₁', unit: 's', type: 'num', def: '1.0', min: 0, max: 5000, show: (raw) => raw.shape === 'trap', hint: '2t₁ ≤ Δt（t₁ = 0 なら長方形）' }
    ],
    examples: [
      { label: '一定の力で加速', v: { shape: 'rect', m: '2.0', v0: '0', F: '10', T: '3.0', tr: '1.0' } },
      { label: '三角形の力（バットの打球）', v: { shape: 'tri', m: '0.15', v0: '-30', F: '2000', T: '0.0100', tr: '1.0' } },
      { label: '台形の力', v: { shape: 'trap', m: '4.0', v0: '2.0', F: '12', T: '5.0', tr: '1.0' } },
      { label: '逆向きの力でブレーキ', v: { shape: 'rect', m: '2.0', v0: '8.0', F: '-6.0', T: '2.0', tr: '1.0' } }
    ],
    intro: {
      easy: R`ボールをバットで打つとき、「強い力を長い時間加える」ほど、ボールの速度は大きく変わります。この「**力 × 時間**」を**力積**といい、F–t グラフ（縦軸が力、横軸が時間）の**面積**として求められます。そして、物体の運動量（質量 × 速度）は、受けた力積の分だけ変化します。力の大きさが時間とともに変わる場合も、グラフの面積さえ求めれば同じように扱えます。`,
      normal: R`$mv - mv_{0} = I$（運動量の変化 = 力積）。$I$ は F–t グラフの面積（長方形 $F\Delta t$、三角形 $\frac{1}{2}F\Delta t$、台形 $F(\Delta t - t_{1})$）。平均の力は $\bar{F} = I/\Delta t$。`,
      pro: R`衝突・打撃の問題では、力の細かい時間変化は分からなくても、力積 $= m\Delta v$ から平均の力が出せる。向きを決めて符号つきで計算し、「速さ」と「速度」を混同しない。`
    },
    compute(v) {
      if (v.F === 0) throw new JK.CalcError('力 F は 0 以外にしてください（力がはたらかないと速度が変わりません）。');
      let tr = v.tr;
      if (v.shape === 'trap') {
        if (!(tr > 0)) throw new JK.CalcError('台形の立ち上がり時間 t₁ は 0 より大きくしてください（0 なら「一定の力（長方形）」を選びます）。');
        if (2 * tr > v.T + 1e-12) throw new JK.CalcError('台形になりません。立ち上がり・立ち下がりの時間の合計 2t₁ が、力がはたらいた時間 Δt 以下になるようにしてください。');
      } else tr = 0;
      const r = solveImp(v.shape, v.m, v.v0, v.F, v.T, tr);
      return {
        result: [
          { label: '力積 I（F–t グラフの面積）', tex: sig(r.I) + NS },
          { label: '力を受けた後の速度 v', tex: sig(r.v) + MS },
          { label: '速度の変化 Δv', tex: sig(r.dv) + MS },
          { label: '平均の力 F̄', tex: sig(r.Fm) + NN },
          { label: '運動エネルギーの変化 ΔK', tex: sig(r.dK) + JJ }
        ],
        steps: impSteps(r),
        fig: figImp(r)
      };
    },

    exercise(rng, level) {
      const cands = [];
      const tol = { rel: 0.02, tol: 0.02 };
      if (level === 'basic') {
        [1.0, 2.0, 4.0, 5.0].forEach((m) => [5, 10, 12, 15, 20, 30].forEach((F) => [2.0, 3.0, 4.0, 5.0].forEach((T) => {
          const r = solveImp('rect', m, 0, F, T, 0);
          if (nice(r.v, 1)) cands.push(r);
        })));
        const r = rng.pick(cands);
        return {
          title: '一定の力を受ける物体',
          body: R`なめらかな水平面上に静止していた質量 $` + r.m.toFixed(1) + R`\,\mathrm{kg}$ の物体に、水平方向に一定の大きさ $` + r.F.toFixed(0) + R`\,\mathrm{N}$ の力を $` + r.T.toFixed(1) + R`\,\mathrm{s}$ 間加え続けた。次の問いに答えよ。`,
          fig: figImp(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`この間に物体が受けた力積の大きさ $I$`, type: 'num', answer: P3(r.I), rel: 0.02, unit: 'N·s' },
            { label: '(2)', q: R`力を加え終えた直後の物体の速さ $v$`, type: 'num', answer: P3(r.v), rel: 0.02, unit: 'm/s' }
          ],
          solution: impSteps(r, { avgLv: 2 })
        };
      }
      if (level === 'mid') {
        ['tri', 'trap'].forEach((shape) => [1.0, 2.0, 4.0, 5.0].forEach((m) => [0, 1.0, 2.0, 3.0, 4.0].forEach((v0) => [4, 6, 8, 10, 12, 20].forEach((F) => [2.0, 3.0, 4.0, 5.0, 6.0].forEach((T) => {
          const tr = shape === 'trap' ? (T >= 4 ? 1.0 : 0.5) : 0;
          const r = solveImp(shape, m, v0, F, T, tr);
          if (nice(r.v, 1) && nice(r.I, 1) && r.I > 0) cands.push(r);
        })))));
        const r = rng.pick(cands);
        return {
          title: 'F–t グラフから力積と速度を求める',
          body: R`なめらかな水平面上で、質量 $` + r.m.toFixed(1) + R`\,\mathrm{kg}$ の物体が` + (r.v0 === 0 ? R`静止している。` : R`右向きに速さ $` + r.v0.toFixed(1) + R`\,\mathrm{m/s}$ で進んでいる。`) + R`この物体に水平右向きの力を加えたところ、力の大きさ $F$ は時間 $t$ とともに図のように変化した。次の問いに答えよ。`,
          fig: figImp(r, { problem: true }),
          parts: [
            { label: '(1)', q: R`この間に物体が受けた力積 $I$`, type: 'num', answer: P3(r.I), rel: 0.02, unit: 'N·s' },
            { label: '(2)', q: R`力がはたらき終えた直後の物体の速さ $v$`, type: 'num', answer: P3(r.v), rel: 0.02, unit: 'm/s' },
            { label: '(3)', q: R`この間に物体が受けた平均の力の大きさ $\bar{F}$`, type: 'num', answer: P3(r.Fm), rel: 0.02, unit: 'N' }
          ],
          solution: impSteps(r)
        };
      }
      // adv: 向かってくるボールをバットで打ち返す（三角形の力）
      [0.10, 0.15, 0.20, 0.25, 0.40, 0.50].forEach((m) => [-10, -15, -20, -25, -30, -40].forEach((v0) => [1000, 1200, 1500, 1600, 1800, 2000, 2400, 2500, 3000, 4000].forEach((F) => [0.0040, 0.0050, 0.0060, 0.0080, 0.010, 0.012, 0.015, 0.020].forEach((T) => {
        const r = solveImp('tri', m, v0, F, T, 0);
        if (nice(r.v, 1) && nice(r.I, 2) && r.v > 0.3 * Math.abs(v0) && r.v < 60) cands.push(r);
      }))));
      const r = rng.pick(cands);
      return {
        title: 'バットで打ち返されるボール',
        body: R`質量 $` + r.m.toFixed(2) + R`\,\mathrm{kg}$ のボールが、バットに向かって左向きに速さ $` + (-r.v0).toFixed(1) + R`\,\mathrm{m/s}$ で飛んできた。バットはボールに右向きの力を加え、力の大きさ $F$ は時間 $t$ とともに図のように（三角形で）変化して、$` + r.T.toFixed(4) + R`\,\mathrm{s}$ 後にボールはバットを離れた。右向きを正として、次の問いに答えよ。`,
        fig: figImp(r, { problem: true }),
        parts: [
          { label: '(1)', q: R`バットがボールに加えた力積の大きさ $I$`, type: 'num', answer: P3(r.I), rel: 0.02, unit: 'N·s' },
          { label: '(2)', q: R`バットを離れた直後のボールの速度 $v$（右向きを正）`, type: 'num', answer: P3(r.v), rel: tol.rel, tol: tol.tol, unit: 'm/s' },
          { label: '(3)', q: R`バットがボールに加えた平均の力の大きさ $\bar{F}$`, type: 'num', answer: P3(r.Fm), rel: 0.02, unit: 'N' }
        ],
        solution: impSteps(r)
      };
    }
  });
})();
