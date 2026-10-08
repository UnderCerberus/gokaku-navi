/* 物理・熱力学 — 熱力学第一法則と状態変化（定積・定圧・等温・断熱）/ 熱サイクルと熱効率
   ※ 構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise）
   符号の約束: Q = ΔU + W。Q は気体が吸収した熱量（放出は負）、W は気体が外にした仕事（された仕事は負）。 */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  // 有効数字 3 桁の四捨五入（622.5 のようにちょうど半端な値は 623 に切り上げる）。
  // 答え（p3）と解説・図の表示（S3, T, tx）は必ずこの 1 つの丸めを通す。toPrecision や toFixed は 2 進数の誤差で
  // 622.5 を 623 と 622 に割ってしまい、答えと解説の数値が 1 ずれる
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

  const RG = 8.3;         // 気体定数 [J/(mol·K)]
  const GAM = 5 / 3;      // 単原子分子理想気体の比熱比 Cp/Cv

  // 問題文に与えた値（入力値）の TeX 表示。10 桁までは正確に書く（大きい/小さい数は ×10^n）。途中の値には使わない（SD と dig を使う）
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
  // 結果 x の表示。項 xs がどれもちょうど書ける値なら、ちょうどの値も添える（1867.5 + 1245 = 3112.5 ≒ 3.11 × 10^3）。
  // 丸めた項を使うときは、表示した項の計算結果が 3 桁で x と一致するので、3 桁の結果だけを書く
  const tailOf = (x, xs) => (xs.every(isExact) ? eqTail(x) : ' = ' + S3(x));
  // 和 a + b の項の表示（b が負なら括弧つき）
  function sumTerms(a, b) {
    const d = dig([a, b], (x, y) => x + y, 1e-9 * Math.max(Math.abs(a), Math.abs(b)));
    return SV(a, d) + ' + ' + P(SV(b, d));
  }
  const sumTex = (a, b) => sumTerms(a, b) + tailOf(a + b, [a, b]);
  // 差 a − b の式と結果
  function diffTex(a, b) {
    const d = dig([a, b], (x, y) => x - y, 1e-9 * Math.max(Math.abs(a), Math.abs(b)));
    return SV(a, d) + ' - ' + P(SV(b, d)) + tailOf(a - b, [a, b]);
  }
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
  const sg = (x) => (x > 0 ? '+' : (x < 0 ? '−' : ''));
  const fj = (x) => (Math.abs(x) < 1e-9 ? '0 J' : sg(x) + tx(Math.abs(x)) + ' J');
  function must() {
    for (let i = 0; i < arguments.length; i++) {
      if (!Number.isFinite(arguments[i])) throw new JK.CalcError('この入力では計算できません。値を見直してください。');
    }
  }
  const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  const SUBN = { '1': '₁', '2': '₂', '3': '₃', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D' };

  // 別の SVG（JK.plot.graph の戻り値）を、親の図の (x, y) に入れ子で置く
  function nest(svg, x, y) {
    return svg.replace(/^<svg class="jk-plot"/, '<svg x="' + x + '" y="' + y + '"');
  }

  /* ---------- P–V 図 ---------- */

  // spec: { states: [{V[L], P[Pa], name, pos}], segs: [{kind:'V'|'P'|'T'|'A', a, b, cls, nofill}], fill: {…}, labels: [{V, P, text, cls, anchor}] }
  // opt: { ask: 目盛りと答えの数値を出さない, h, guides }
  function pvFigure(spec, opt) {
    opt = opt || {};
    const st = spec.states;
    const pmax = Math.max.apply(null, st.map((s) => s.P)), vmax = Math.max.apply(null, st.map((s) => s.V));
    const pk = Math.max(0, Math.floor(Math.log10(pmax))), pf = Math.pow(10, pk);
    const xr = vmax * 1.32, yr = pmax / pf * 1.32;
    const g = {
      w: 360, h: opt.h || 250, x: [0, xr], y: [0, yr], axis: ['V[L]', pk === 0 ? 'P[Pa]' : 'P[×10' + sup(pk) + 'Pa]'],
      curves: [], segs: [], fills: [], points: [], labels: []
    };
    // 等温線（破線）。経路そのものが等温線なら重ねて描かない
    const own = spec.segs.filter((s) => s.kind === 'T').map((s) => st[s.a].P * st[s.a].V);
    const cs = st.map((s) => s.P * s.V);
    const seen = [];
    let rank = 0;
    cs.map((c, i) => [c, i]).sort((a, b) => b[0] - a[0]).forEach((oc) => {
      const c = oc[0];
      if (seen.some((q) => near(q, c)) || own.some((q) => near(q, c))) return;
      seen.push(c);
      const lo = Math.max(xr * 0.015, c / pf / yr);
      g.curves.push({ f: (x) => c / x / pf, cls: 'dim', dash: true, domain: [lo, xr] });
      const yl = yr * (0.93 - 0.11 * rank);
      const nm = st.filter((q) => near(q.P * q.V, c)).map((q) => 'T' + SUBN[q.name]).join('=');
      g.labels.push({ x: c / pf / yl + xr * 0.02, y: yl, text: nm, cls: 'dim', anchor: 'start' });
      rank++;
    });
    if (seen.length) g.labels.push({ x: xr * 0.985, y: yr * 0.9, text: '破線: 等温線', cls: 'dim', anchor: 'end' });
    // 経路
    spec.segs.forEach((sgm) => {
      const a = st[sgm.a], b = st[sgm.b], cls = sgm.cls || 'c2';
      const lo = Math.min(a.V, b.V), hi = Math.max(a.V, b.V);
      let fn = null;
      if (sgm.kind === 'P') fn = () => a.P;
      else if (sgm.kind === 'T') fn = (V) => a.P * a.V / V;
      else if (sgm.kind === 'A') fn = (V) => a.P * Math.pow(a.V / V, GAM);
      let atT;
      if (sgm.kind === 'V') {
        g.segs.push({ x1: a.V, y1: a.P / pf, x2: b.V, y2: b.P / pf, cls: cls });
        atT = (t) => [a.V, (a.P + (b.P - a.P) * t) / pf];
      } else if (sgm.kind === 'P') {
        g.segs.push({ x1: a.V, y1: a.P / pf, x2: b.V, y2: b.P / pf, cls: cls });
        atT = (t) => [a.V + (b.V - a.V) * t, a.P / pf];
      } else {
        g.curves.push({ f: (V) => fn(V) / pf, cls: cls, domain: [lo, hi] });
        atT = (t) => { const V = a.V + (b.V - a.V) * t; return [V, fn(V) / pf]; };
      }
      if (sgm.kind !== 'V' && !sgm.nofill) g.fills.push({ f: (V) => fn(V) / pf, from: lo, to: hi, cls: b.V >= a.V ? 'f1' : 'f3' });
      const p0 = atT(0.46), p1 = atT(0.56);
      g.segs.push({ x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], cls: cls, arrow: true });
    });
    if (spec.fill) g.fills.push({ f: () => spec.fill.Phi / pf, g: () => spec.fill.Plo / pf, from: spec.fill.Vlo, to: spec.fill.Vhi, cls: 'f1' });
    // 状態の点と、目盛りへの補助線
    st.forEach((s) => {
      g.points.push({ x: s.V, y: s.P / pf, label: SUBN[s.name] === s.name ? s.name : s.name, cls: 'c3', pos: s.pos || 'tr' });
      if (!opt.ask && opt.guides !== false) {
        g.segs.push({ x1: s.V, y1: 0, x2: s.V, y2: s.P / pf, cls: 'dim', dash: true });
        g.segs.push({ x1: 0, y1: s.P / pf, x2: s.V, y2: s.P / pf, cls: 'dim', dash: true });
      }
    });
    (spec.labels || []).forEach((l) => g.labels.push({ x: l.V, y: l.P / pf, text: l.text, cls: l.cls || 'fg', anchor: l.anchor || 'middle' }));
    if (opt.ask) { g.ticks = false; g.grid = false; }
    return JK.plot.graph(g);
  }

  // 上段の「エネルギーの出入り」の図: Q → [気体 ΔU] → W
  function flowStrip(d, y0, Q, W, dU) {
    d.rect(122, y0 + 6, 116, 54, { cls: 'fg', fill: 'f1', rx: 6 });
    d.text(180, y0 + 28, '気体');
    d.text(180, y0 + 47, 'ΔU = ' + fj(dU));
    const zero = (x) => Math.abs(x) < 1e-9;
    const yA = y0 + 33;
    if (!zero(Q)) d.arrow(Q > 0 ? 8 : 118, yA, Q > 0 ? 118 : 8, yA, { cls: Q > 0 ? 'c3' : 'c1', w: 2.6 });
    d.text(62, y0 + 20, 'Q = ' + fj(Q), { anchor: 'middle' });
    d.text(62, y0 + 56, zero(Q) ? '熱の出入りなし' : (Q > 0 ? '熱を吸収' : '熱を放出'), { cls: 'dim' });
    if (!zero(W)) d.arrow(W > 0 ? 242 : 352, yA, W > 0 ? 352 : 242, yA, { cls: W > 0 ? 'c2' : 'c4', w: 2.6 });
    d.text(298, y0 + 20, 'W = ' + fj(W), { anchor: 'middle' });
    d.text(298, y0 + 56, zero(W) ? '仕事なし' : (W > 0 ? '気体が仕事をする' : '気体が仕事をされる'), { cls: 'dim' });
  }

  /* ================= 1. 熱力学第一法則と状態変化 ================= */

  const PROC = {
    V: { name: '定積変化', d: R`体積を一定に保ったまま（**定積変化**）温度を $T_{2}$ に` },
    P: { name: '定圧変化', d: R`圧力を一定に保ったまま（**定圧変化**）体積を $V_{2}$ に` },
    T: { name: '等温変化', d: R`温度を一定に保ったまま（**等温変化**）体積を $V_{2}$ に` },
    A: { name: '断熱変化', d: R`熱の出入りがないように（**断熱変化**）体積を $V_{2}$ に` }
  };

  // o: { proc, n, T1, V1(L), V2(L)|T2 }  戻り値は SI（P: Pa, V: m^3）と J
  function firstCalc(o) {
    const n = o.n;
    const V1 = o.V1 / 1000;
    const P1 = n * RG * o.T1 / V1;
    let V2, T2, P2;
    if (o.proc === 'V') { V2 = V1; T2 = o.T2; P2 = P1 * T2 / o.T1; }
    else if (o.proc === 'P') { V2 = o.V2 / 1000; P2 = P1; T2 = o.T1 * V2 / V1; }
    else if (o.proc === 'T') { V2 = o.V2 / 1000; T2 = o.T1; P2 = P1 * V1 / V2; }
    else { V2 = o.V2 / 1000; T2 = o.T1 * Math.pow(V1 / V2, GAM - 1); P2 = P1 * Math.pow(V1 / V2, GAM); }
    const dU = o.proc === 'T' ? 0 : 1.5 * n * RG * (T2 - o.T1);
    let W;
    if (o.proc === 'V') W = 0;
    else if (o.proc === 'P') W = P1 * (V2 - V1);
    else if (o.proc === 'T') W = n * RG * o.T1 * Math.log(V2 / V1);
    else W = -dU;
    const Q = o.proc === 'A' ? 0 : dU + W;
    return { n: n, V1: V1, V2: V2, P1: P1, P2: P2, T1: o.T1, T2: T2, dU: dU, W: W, Q: Q, V1L: o.V1, V2L: V2 * 1000 };
  }

  function firstFigure(o, r, opt) {
    opt = opt || {};
    const states = [{ V: r.V1L, P: r.P1, name: '1', pos: 'tl' }, { V: r.V2L, P: r.P2, name: '2', pos: 'tr' }];
    const spec = { states: states, segs: [{ kind: o.proc, a: 0, b: 1 }], labels: [] };
    if (!opt.ask) {
      if (o.proc === 'V') spec.labels.push({ V: r.V1L, P: (r.P1 + r.P2) / 2, text: 'W = 0（面積なし）', cls: 'fg', anchor: 'start' });
      else {
        const lowP = Math.min(r.P1, r.P2);
        spec.labels.push({ V: (r.V1L + r.V2L) / 2, P: lowP * 0.4, text: 'W = ' + fj(r.W) + '（面積）', cls: 'fg', anchor: 'middle' });
      }
    }
    const graph = pvFigure(spec, { ask: !!opt.ask, h: 252 });
    if (opt.ask) return graph;
    const d = JK.plot.draw(360, 66 + 252);
    flowStrip(d, 0, r.Q, r.W, r.dU);
    d.group(nest(graph, 0, 66));
    return d.svg();
  }

  // 途中の温度（K）などの普通の小数表示。ちょうど表せる値はそのまま、そうでなければ d 桁（1200、833.3）
  function TD(x, d) { return String(Number(U.roundSig(x, isExact(x) ? 6 : d))); }

  // o.hideState: 演習で P₁・V₁ を問題文に書いていないとき、解説でも P₁・V₁ を使わない
  // o.ex: 演習で問題文に与えた体積の倍率など（{ f: 倍率, comp: 圧縮か, lnv: ln f の値, rt: f^(2/3) の値 }）。
  //       V₁・V₂ は問題文にないので、解説はこの倍率と値だけで書く
  function firstSteps(o, r) {
    const pr = o.proc, n = o.n, ex = o.ex || null;
    const dT = r.T2 - r.T1;
    const showP = !o.hideState;
    // 変化のしかた（1 つめのステップの文）。演習では、問題文に書いた量（温度・体積の倍率）で言う
    let how = PROC[pr].d;
    if (o.hideState) {
      if (pr === 'V') how = R`体積を一定に保ったまま（**定積変化**）温度を $T_{2} = ` + T(r.T2) + R`\,\mathrm{K}$ に`;
      else if (pr === 'P') how = R`圧力を一定に保ったまま（**定圧変化**）温度を $T_{2} = ` + T(r.T2) + R`\,\mathrm{K}$ に`;
      else if (pr === 'T' && ex) how = R`温度を一定に保ったまま（**等温変化**）体積を $` + ex.f + R`$ 倍に`;
      else if (pr === 'A' && ex) how = R`熱の出入りがないように（**断熱変化**）体積を $` + (ex.comp ? R`\dfrac{1}{` + ex.f + R`}` : ex.f) + R`$ 倍に`;
    }
    const steps = [
      {
        t: '図で状況をつかむ',
        n: R`物質量 $n = ` + T(n) + R`\,\mathrm{mol}$ の単原子分子理想気体を、状態 1（$T_{1} = ` + T(r.T1) + R`\,\mathrm{K}$）から、` + how + R`変化させて状態 2 にします。この間に気体が吸収した熱量 $Q$、内部エネルギーの変化 $\Delta U$、気体が外にした仕事 $W$ を求めます。図の上段は 3 つのエネルギーの出入り、下段は P–V 図（縦軸 $P$・横軸 $V$）で、**経路の下の面積が気体のした仕事 $W$** になります。`,
        easy: R`気体のエネルギーの出入りは、お金の出入りにたとえられます。**内部エネルギー** $U$ は気体がもっている「貯金」（飛び回る分子の運動エネルギーの合計）、**熱** $Q$ は外からもらった「収入」、**仕事** $W$ は気体がピストンを押し出して外へ使った「支出」です。貯金の増え方は 収入 − 支出 なので $\Delta U = Q - W$、つまり $Q = \Delta U + W$。これが**熱力学第一法則**です。`
      }
    ];
    if (showP) {
      steps.push({
        t: R`状態 1 の圧力 $P_{1}$ を状態方程式から求める`,
        m: [R`P_{1} = \frac{nRT_{1}}{V_{1}}`, R`V_{1} = ` + T(r.V1L) + R`\,\mathrm{L} = ` + T(r.V1) + R`\,\mathrm{m^{3}}`,
          R`P_{1} = \frac{` + T(n) + R` \times 8.3 \times ` + T(r.T1) + '}{' + T(r.V1) + '} = ' + S3(r.P1) + R`\,\mathrm{Pa}`],
        n: R`理想気体の状態方程式 $PV = nRT$（$R = 8.3\,\mathrm{J/(mol\cdot K)}$）を使います。体積は $\mathrm{L}$ を $\mathrm{m^{3}}$ に直して（$1\,\mathrm{L} = 10^{-3}\,\mathrm{m^{3}}$）代入します。`,
        easy: R`気体の圧力・体積・温度・量は、$PV = nRT$ という式で結びついています（気体の状態方程式）。ここでは体積 $V$ と温度 $T$ と量 $n$ が分かっているので、圧力 $P$ が計算できます。`,
        lv: 2
      });
    }
    // 終わりの状態。P₁ を使うとき（計算機）は、P₁ を表示したまま代入すると最後の桁が合わないので、合う桁数で書く
    let endM, endN, endEasy;
    if (pr === 'V') {
      endM = [R`V_{2} = V_{1}`];
      if (showP) {
        const dP = dig([r.P1], (p) => p * r.T2 / r.T1);
        endM.push(R`\frac{P_{2}}{T_{2}} = \frac{P_{1}}{T_{1}} \;\Rightarrow\; P_{2} = P_{1} \times \frac{T_{2}}{T_{1}} = ` + SV(r.P1, dP) + R` \times \frac{` + T(r.T2) + '}{' + T(r.T1) + '} = ' + S3(r.P2) + R`\,\mathrm{Pa}`);
      } else {
        endM.push(R`T_{2} = ` + T(r.T2) + R`\,\mathrm{K}`);
      }
      endN = R`体積が変わらないので、圧力と絶対温度が比例します（$\dfrac{P}{T} = \text{一定}$）。`;
      endEasy = R`体積を固定した容器を温めると、中の気体は膨らめない代わりに圧力が上がります。圧力は絶対温度に比例して増えます。`;
    } else if (pr === 'P') {
      endM = [R`P_{2} = P_{1}`];
      if (showP) {
        endM.push(R`\frac{V_{2}}{T_{2}} = \frac{V_{1}}{T_{1}} \;\Rightarrow\; T_{2} = T_{1} \times \frac{V_{2}}{V_{1}} = ` + T(r.T1) + R` \times \frac{` + T(r.V2L) + '}{' + T(r.V1L) + '} = ' + S3(r.T2) + R`\,\mathrm{K}`);
      } else {
        endM.push(R`\frac{V_{2}}{V_{1}} = \frac{T_{2}}{T_{1}} = \frac{` + T(r.T2) + '}{' + T(r.T1) + '} = ' + S3(r.T2 / r.T1));
      }
      endN = R`圧力が変わらないので、体積と絶対温度が比例します（シャルルの法則 $\dfrac{V}{T} = \text{一定}$）。`;
      endEasy = R`圧力を一定にして気体を温めると、気体は膨らみます。体積が $2$ 倍になるなら、絶対温度も $2$ 倍です。`;
    } else if (pr === 'T') {
      endM = [R`T_{2} = T_{1}`];
      if (showP) {
        const dP = dig([r.P1], (p) => p * r.V1L / r.V2L);
        endM.push(R`P_{1}V_{1} = P_{2}V_{2} \;\Rightarrow\; P_{2} = P_{1} \times \frac{V_{1}}{V_{2}} = ` + SV(r.P1, dP) + R` \times \frac{` + T(r.V1L) + '}{' + T(r.V2L) + '} = ' + S3(r.P2) + R`\,\mathrm{Pa}`);
      } else if (ex) {
        endM.push(R`P_{1}V_{1} = P_{2}V_{2} \;\Rightarrow\; P_{2} = P_{1} \times \frac{V_{1}}{V_{2}} = P_{1} \times \frac{1}{` + ex.f + '}');
      }
      endN = R`温度が変わらないので、$PV = \text{一定}$（ボイルの法則）です。` + (!showP && ex ? R`体積が $` + ex.f + R`$ 倍になるので、圧力は $\dfrac{1}{` + ex.f + R`}$ 倍になります。` : '');
      endEasy = R`温度を保ったまま体積を $2$ 倍に広げると、圧力は半分になります（空気入れで押し縮めると圧力が上がるのと逆）。`;
    } else {
      endM = [R`T_{2} = T_{1}\left(\frac{V_{1}}{V_{2}}\right)^{\gamma - 1} = T_{1}\left(\frac{V_{1}}{V_{2}}\right)^{\frac{2}{3}}`];
      if (showP) {
        endM = [R`T_{2} = T_{1}\left(\frac{V_{1}}{V_{2}}\right)^{\gamma - 1} = ` + T(r.T1) + R`\left(\frac{` + T(r.V1L) + '}{' + T(r.V2L) + R`}\right)^{\frac{2}{3}} = ` + S3(r.T2) + R`\,\mathrm{K}`];
        const dP = dig([r.P1], (p) => p * Math.pow(r.V1L / r.V2L, GAM));
        endM.push(R`P_{2} = P_{1}\left(\frac{V_{1}}{V_{2}}\right)^{\gamma} = ` + SV(r.P1, dP) + R`\left(\frac{` + T(r.V1L) + '}{' + T(r.V2L) + R`}\right)^{\frac{5}{3}} = ` + S3(r.P2) + R`\,\mathrm{Pa}`);
      } else if (ex) {
        endM.push(ex.comp
          ? R`T_{2} = ` + T(r.T1) + R` \times ` + ex.f + R`^{\frac{2}{3}} = ` + T(r.T1) + R` \times ` + ex.rt + ' = ' + S3(r.T2) + R`\,\mathrm{K}`
          : R`T_{2} = ` + T(r.T1) + R` \times \left(\frac{1}{` + ex.f + R`}\right)^{\frac{2}{3}} = ` + T(r.T1) + R` \times \frac{1}{` + ex.rt + '} = ' + S3(r.T2) + R`\,\mathrm{K}`);
      }
      endN = R`断熱変化では $PV^{\gamma} = \text{一定}$、$TV^{\gamma - 1} = \text{一定}$ が成り立ちます。単原子分子理想気体の比熱比は $\gamma = \dfrac{5}{3}$ です。` + (!showP && ex ? R`問題文のとおり $` + ex.f + R`^{\frac{2}{3}} = ` + ex.rt + R`$ なので、体積比 $\dfrac{V_{1}}{V_{2}} = ` + (ex.comp ? ex.f : R`\dfrac{1}{` + ex.f + R`}`) + R`$ から $T_{2}$ が求まります。` : '');
      endEasy = R`**断熱**は「熱の出入りがない」変化で、ふつう急に変化させたときに起こります。自転車の空気入れを急に押すと筒が熱くなるのは、圧縮した気体の温度が上がるからです（逆に膨張させると冷えます）。この変化では、温度と体積の間に $T \times V^{\frac{2}{3}} = \text{一定}$ という関係があります。`;
    }
    steps.push({
      t: '終わりの状態（状態 2）を求める',
      m: endM,
      n: endN,
      easy: endEasy,
      pro: pr === 'A' ? R`$\gamma = \dfrac{5}{3}$ のとき $TV^{\frac{2}{3}} = \text{一定}$。体積が $8$ 倍なら温度は $8^{-\frac{2}{3}} = \dfrac{1}{4}$ 倍、圧力は $8^{-\frac{5}{3}} = \dfrac{1}{32}$ 倍、というように立方根が取りやすい比が使われます。` : R`$P$、$V$、$T$ のうち何が一定かを最初に確認して、比で計算します。`
    });
    // ΔU（T₂ が途中の値のときは、表示した T₂ で計算し直して結果と合う桁数で書く）
    const dTu = pr === 'T' ? 3 : dig([r.T2], (t2) => 1.5 * n * RG * (t2 - r.T1));
    steps.push({
      t: R`内部エネルギーの変化 $\Delta U$`,
      m: [R`\Delta U = \frac{3}{2}nR\Delta T = \frac{3}{2}nR(T_{2} - T_{1})`,
        R`\Delta U = \frac{3}{2} \times ` + T(n) + R` \times 8.3 \times (` + TD(r.T2, dTu) + ' - ' + T(r.T1) + ') = ' + (pr === 'T' ? '0' : S3(r.dU)) + R`\,\mathrm{J}`],
      n: R`単原子分子理想気体の内部エネルギーは $U = \dfrac{3}{2}nRT$ で、**温度だけで決まります**。したがって $\Delta U$ は、どんな経路でも**始めと終わりの温度の差**だけで決まります。` + (pr === 'T' ? R`等温変化では $\Delta T = 0$ なので $\Delta U = 0$ です。` : (r.dU > 0 ? R`温度が上がったので $\Delta U > 0$（内部エネルギーが増加）です。` : R`温度が下がったので $\Delta U < 0$（内部エネルギーが減少）です。`)),
      easy: R`内部エネルギーは「分子が飛び回る運動エネルギーの合計」でした。温度が高いほど分子の動きは激しいので、**温度が上がれば内部エネルギーは増え、下がれば減り、温度が同じなら変わりません**。体積や圧力がどう変わったかは関係ありません。`,
      pro: R`$\Delta U = \dfrac{3}{2}nR\Delta T = \dfrac{3}{2}(P_{2}V_{2} - P_{1}V_{1})$。$P$ と $V$ だけで書き直せば、$n$ や $T$ を経由せずに計算できます。`
    });
    // W
    let wM, wN, wEasy;
    if (pr === 'V') {
      wM = [R`W = P\Delta V = 0 \quad (\Delta V = 0)`];
      wN = R`体積が変わらないので、気体は外に仕事をしません。P–V 図では経路が縦線になり、面積は $0$ です。`;
      wEasy = R`仕事は「力 × 動いた距離」です。ピストンが動かなければ距離が $0$ なので、仕事も $0$ です。`;
    } else if (pr === 'P') {
      const dTw = dig([r.T2], (t2) => n * RG * (t2 - r.T1));
      wM = [R`W = P\Delta V = nR\Delta T`, R`W = ` + T(n) + R` \times 8.3 \times (` + TD(r.T2, dTw) + ' - ' + T(r.T1) + ') = ' + S3(r.W) + R`\,\mathrm{J}`];
      wN = R`圧力が一定なので $W = P\Delta V$（P–V 図の長方形の面積）です。$PV = nRT$ より $P\Delta V = nR\Delta T$ と書き直せます。` + (r.W >= 0 ? R`膨張したので $W > 0$（気体が外に仕事をした）です。` : R`圧縮されたので $W < 0$（気体が外から仕事をされた）です。`);
      wEasy = R`ピストンを押し出す力は「圧力 × 面積 $S$」、動いた距離を $\Delta x$ とすると、仕事は $P S \Delta x$。$S\Delta x$ は増えた体積 $\Delta V$ なので、仕事は $W = P\Delta V$ です。圧力が一定なら、P–V 図で縦が $P$・横が $\Delta V$ の長方形の面積になります。`;
    } else if (pr === 'T') {
      if (ex) {
        // 演習: V₁・V₂ は問題文にないので、体積の倍率と、問題文が与えた ln の値で計算する
        wM = [R`W = nRT\ln\frac{V_{2}}{V_{1}} = nRT\ln ` + ex.f,
          R`W = ` + T(n) + R` \times 8.3 \times ` + T(r.T1) + R` \times \ln ` + ex.f + ' = ' + T(n) + R` \times 8.3 \times ` + T(r.T1) + R` \times ` + ex.lnv + ' = ' + S3(r.W) + R`\,\mathrm{J}`];
      } else {
        wM = [R`W = nRT\ln\frac{V_{2}}{V_{1}}`, R`W = ` + T(n) + R` \times 8.3 \times ` + T(r.T1) + R` \times \ln\frac{` + T(r.V2L) + '}{' + T(r.V1L) + '} = ' + S3(r.W) + R`\,\mathrm{J}`];
      }
      wN = R`等温変化では圧力が $P = \dfrac{nRT}{V}$ と変化するので、仕事は P–V 図の曲線の下の面積（積分 $W = \displaystyle\int P\,dV$ の値）で、$W = nRT\ln\dfrac{V_{2}}{V_{1}}$ になります。` + (ex ? R`体積の比は $\dfrac{V_{2}}{V_{1}} = ` + ex.f + R`$ で、$\ln ` + ex.f + ' = ' + ex.lnv + R`$ は問題文で与えられています。` : '') + (r.W >= 0 ? R`膨張なので $W > 0$ です。` : R`圧縮なので $W < 0$ です。`);
      wEasy = R`圧力が変わっていくので、$W = P\Delta V$ をそのまま使えません。そのかわり、P–V 図の曲線の下の面積が仕事になる、という見方は同じです。入試ではこの面積を「$\ln$ の値を問題文が与える」形で出すことが多いです。`;
      wM = wM.slice();
    } else {
      wM = [R`W = -\Delta U \quad (Q = 0)`, R`W = -(` + S3(r.dU) + R`) = ` + S3(r.W) + R`\,\mathrm{J}`];
      wN = R`断熱変化では $Q = 0$ なので、第一法則 $Q = \Delta U + W$ から $W = -\Delta U$ です。` + (r.W >= 0 ? R`膨張して気体が仕事をした分だけ、内部エネルギーが減っています。` : R`圧縮されて仕事をされた分だけ、内部エネルギーが増えています。`);
      wEasy = R`熱の出入りがないので、気体が仕事をした分（支出）は、そのまま内部エネルギー（貯金）の減少でまかなわれます。膨張すると冷える、圧縮すると熱くなるのはこのためです。`;
    }
    steps.push({
      t: R`気体がした仕事 $W$`,
      m: wM,
      n: wN,
      easy: wEasy,
      pro: pr === 'A' ? R`断熱では $W = -\Delta U = \dfrac{3}{2}(P_{1}V_{1} - P_{2}V_{2})$。積分を使わずに求められるのが最短です。` : (pr === 'T' ? R`等温の仕事は $nRT\ln\dfrac{V_{2}}{V_{1}}$。体積が $e$ 倍や $2$ 倍など、$\ln$ の値が既知の比で出題されます。` : R`$W$ は P–V 図の経路の下の面積。迷ったら図を描いて面積で考えます。`)
    });
    // Q
    steps.push({
      t: R`熱力学第一法則 $Q = \Delta U + W$ で吸収した熱量 $Q$ を求める`,
      m: [R`Q = \Delta U + W`, R`Q = ` + sumTex(pr === 'T' ? 0 : r.dU, r.W) + R`\,\mathrm{J}`],
      n: R`**符号の約束**: $Q$ は気体が**吸収した**熱量（放出なら負）、$W$ は気体が外に**した**仕事（外から仕事をされたなら負）、$\Delta U$ は内部エネルギーの**増加**（減少なら負）です。` +
        (pr === 'A' ? R`断熱変化なので $Q = 0$ となり、$\Delta U + W = 0$ が確かめられます。` : (r.Q >= 0 ? R`$Q > 0$ なので、気体は熱を吸収しました。` : R`$Q < 0$ なので、気体は熱を放出しました。`)),
      easy: R`財布の収支と同じです。「収入（吸収した熱）$= $ 貯金の増加（$\Delta U$）$+$ 支出（気体がした仕事 $W$）」。外へ仕事をするほど、同じ熱量でも気体の温度は上がりにくくなります。逆に、外から仕事をされる（押し縮められる）と、$W$ は負になるので、熱を加えなくても内部エネルギーが増えます。`,
      pro: R`4 つの変化の特徴を最初に押さえる: 定積は $W = 0$（$Q = \Delta U$）、定圧は $W = P\Delta V$（$Q = \Delta U + P\Delta V$）、等温は $\Delta U = 0$（$Q = W$）、断熱は $Q = 0$（$W = -\Delta U$）。`
    });
    // 検算
    let chk;
    const dTc = dig([dT], (x) => n * 1.5 * RG * x);
    const dTp = dig([dT], (x) => n * 2.5 * RG * x);
    if (pr === 'V') chk = R`定積変化では、定積モル比熱 $C_{V} = \dfrac{3}{2}R$ を使って $Q = nC_{V}\Delta T = ` + T(n) + R` \times \dfrac{3}{2} \times 8.3 \times ` + TD(dT, dTc) + ' = ' + S3(r.Q) + R`\,\mathrm{J}$ と求めても同じです。`;
    else if (pr === 'P') chk = R`定圧変化では、定圧モル比熱 $C_{P} = \dfrac{5}{2}R$ を使って $Q = nC_{P}\Delta T = ` + T(n) + R` \times \dfrac{5}{2} \times 8.3 \times ` + TD(dT, dTp) + ' = ' + S3(r.Q) + R`\,\mathrm{J}$ と求めても同じです（$C_{P} - C_{V} = R$ の関係、マイヤーの関係）。`;
    else if (pr === 'T') chk = R`等温変化では $\Delta U = 0$ なので、$Q = W$ です。吸収した熱はすべて、気体が外にした仕事に使われています。`;
    else if (!showP) chk = R`$PV = nRT$ より $W = \dfrac{3}{2}(P_{1}V_{1} - P_{2}V_{2}) = \dfrac{3}{2}nR(T_{1} - T_{2})$ とも書けて、$-\Delta U$ と同じ $W = ` + S3(r.W) + R`\,\mathrm{J}$ になります。`;
    else chk = R`$W = \dfrac{P_{1}V_{1} - P_{2}V_{2}}{\gamma - 1} = \dfrac{3}{2}(P_{1}V_{1} - P_{2}V_{2})$ を使っても、$W = ` + S3(r.W) + R`\,\mathrm{J}$ になります。`;
    steps.push({
      t: '検算・別の見方',
      n: chk,
      lv: 2
    });
    steps.push({
      t: '補足: P–V 図の面積がなぜ仕事になるのか',
      n: R`体積が微小量 $\Delta V$ だけ変わる間、圧力 $P$ はほぼ一定とみなせるので、仕事は $P\Delta V$（細い長方形の面積）です。これを経路に沿ってすべて足し合わせたものが、曲線の下の面積になります。膨張（$V$ が増える向き）なら面積は正の仕事、圧縮なら負の仕事です。`,
      easy: R`グラフを細い縦の短冊に切って考えます。1 本の短冊は「縦（圧力 $P$）× 横（体積の増え $\Delta V$）」で、これがそのまま「その間にした仕事 $P\Delta V$」です。短冊を全部集めたものが、グラフの下の面積です。`,
      lv: 3
    });
    return steps;
  }

  JK.registerSim({
    id: 'thermo-first-law',
    field: '熱力学',
    unit: 'p-thermo1',
    title: '熱力学第一法則と気体の状態変化',
    desc: R`単原子分子理想気体の定積・定圧・等温・断熱変化について、内部エネルギーの変化 $\Delta U$、気体がした仕事 $W$、吸収した熱量 $Q$（$Q = \Delta U + W$）を求め、P–V 図に仕事（面積）を描きます。`,
    form: [R`Q = \Delta U + W`, R`\Delta U = \frac{3}{2}nR\Delta T`, R`W = P\Delta V,\quad PV^{\gamma} = \text{一定}\ \left(\gamma = \frac{5}{3}\right)`],
    inputs: [
      { key: 'proc', label: '変化の種類', type: 'select', def: 'P', options: [['V', '定積変化（体積一定）'], ['P', '定圧変化（圧力一定）'], ['T', '等温変化（温度一定）'], ['A', '断熱変化（熱の出入りなし）']] },
      { key: 'n', label: R`物質量 $n$`, unit: 'mol', type: 'num', def: '1.0', min: 0.001, max: 10000 },
      { key: 'T1', label: R`はじめの絶対温度 $T_{1}$`, unit: 'K', type: 'num', def: '300', min: 1, max: 5000 },
      { key: 'V1', label: R`はじめの体積 $V_{1}$`, unit: 'L', type: 'num', def: '24.9', min: 0.001, max: 1000000 },
      { key: 'V2', label: R`終わりの体積 $V_{2}$`, unit: 'L', type: 'num', def: '49.8', min: 0.001, max: 1000000, show: (raw) => raw.proc !== 'V' },
      { key: 'T2', label: R`終わりの絶対温度 $T_{2}$`, unit: 'K', type: 'num', def: '450', min: 1, max: 5000, show: (raw) => raw.proc === 'V' }
    ],
    examples: [
      { label: '定圧膨張（体積 2 倍）', v: { proc: 'P', n: '1.0', T1: '300', V1: '24.9', V2: '49.8' } },
      { label: '定積加熱', v: { proc: 'V', n: '2.0', T1: '300', V1: '10', T2: '450' } },
      { label: '等温膨張', v: { proc: 'T', n: '1.0', T1: '300', V1: '10', V2: '20' } },
      { label: '断熱圧縮（体積 1/8）', v: { proc: 'A', n: '1.0', T1: '300', V1: '80', V2: '10' } }
    ],
    intro: {
      easy: R`気体に熱を加えると、(1) 気体の温度が上がる（**内部エネルギーが増える**）か、(2) 気体が膨らんでピストンを押す（**外へ仕事をする**）か、のどちらか（またはその両方）に使われます。この関係が**熱力学第一法則** $Q = \Delta U + W$ です。変化の仕方（体積一定・圧力一定・温度一定・熱の出入りなし）によって $\Delta U$ と $W$ の求め方が決まるので、P–V 図をかいて整理します。`,
      normal: R`$Q = \Delta U + W$（$Q$: 吸収した熱、$\Delta U = \dfrac{3}{2}nR\Delta T$、$W$: 気体がした仕事 = P–V 図の面積）。定積は $W = 0$、定圧は $W = P\Delta V$、等温は $\Delta U = 0$、断熱は $Q = 0$。`,
      pro: R`$\Delta U$ は始点と終点の温度だけで決まる（経路によらない）が、$W$ と $Q$ は経路で決まる。各変化の特徴（$W = 0$ / $W = P\Delta V$ / $\Delta U = 0$ / $Q = 0$）を最初に確認し、P–V 図の面積で符号まで確かめる。`
    },
    compute(v) {
      const o = Object.assign({}, v);
      if (v.proc !== 'V' && near(v.V1, v.V2)) throw new JK.CalcError('終わりの体積 V₂ がはじめの体積 V₁ と同じです（変化がありません）。違う値を入力してください。');
      if (v.proc === 'V' && near(v.T1, v.T2)) throw new JK.CalcError('終わりの温度 T₂ がはじめの温度 T₁ と同じです（変化がありません）。違う値を入力してください。');
      const r = firstCalc(o);
      must(r.P1, r.P2, r.T2, r.dU, r.W, r.Q);
      if (!(r.T2 > 0)) throw new JK.CalcError('終わりの絶対温度が 0 K 以下になります。入力を見直してください。');
      return {
        result: [
          { label: '内部エネルギーの変化 ΔU', tex: (r.dU === 0 ? '0' : S3(r.dU)) + R`\,\mathrm{J}` },
          { label: '気体がした仕事 W', tex: (r.W === 0 ? '0' : S3(r.W)) + R`\,\mathrm{J}` },
          { label: '吸収した熱量 Q（放出は負）', tex: (r.Q === 0 ? '0' : S3(r.Q)) + R`\,\mathrm{J}` },
          { label: '終わりの状態 T₂', tex: S3(r.T2) + R`\,\mathrm{K}` },
          { label: '終わりの状態 P₂', tex: S3(r.P2) + R`\,\mathrm{Pa}` }
        ],
        steps: firstSteps(o, r),
        fig: firstFigure(o, r)
      };
    },
    exercise(rng, level) {
      // 基礎は物質量・温度の変化の候補を増やす（答えは n × ΔT だけで決まり、同じ積の組は同じ答えになるため）
      const n = rng.pick(level === 'basic' ? [0.50, 1.0, 1.5, 2.0, 3.0] : [0.50, 1.0, 2.0]);
      const T1 = rng.pick([300, 400, 200, 250, 500]);
      const nTex = n.toFixed(2);
      const consts = R`気体定数を $R = 8.3\,\mathrm{J/(mol\cdot K)}$ とし、気体は単原子分子の理想気体とする。有効数字 3 桁で答えよ。`;
      const P1 = rng.pick([1.0e5, 2.0e5, 3.0e5]);
      const V1L = n * RG * T1 / P1 * 1000;           // 図用（問題文には書かない）
      const mkO = (proc, extra) => Object.assign({ proc: proc, n: n, T1: T1, V1: V1L, hideState: true }, extra);
      if (level === 'basic') {
        const dT = rng.pick([100, 200, 150, 50, 250]);
        if (rng.bool(0.5)) {
          const o = mkO('V', { T2: T1 + dT });
          const r = firstCalc(o);
          return {
            title: '体積を一定にして加熱する',
            body: R`ピストンを固定した容器の中に、物質量 $` + nTex + R`\,\mathrm{mol}$ の理想気体が入っている。この気体を、体積を一定に保ったまま、$` + T1 + R`\,\mathrm{K}$ から $` + (T1 + dT) + R`\,\mathrm{K}$ まで加熱した。` + consts,
            fig: firstFigure(o, r, { ask: true }),
            parts: [
              { label: '(1)', q: R`気体が外にした仕事 $W$`, type: 'num', answer: 0, rel: 0.02, unit: 'J' },
              { label: '(2)', q: R`内部エネルギーの変化 $\Delta U$`, type: 'num', answer: p3(r.dU), rel: 0.02, unit: 'J' },
              { label: '(3)', q: R`気体が吸収した熱量 $Q$`, type: 'num', answer: p3(r.Q), rel: 0.02, unit: 'J' }
            ],
            solution: firstSteps(o, r)
          };
        }
        const o = mkO('P', { V2: V1L * (T1 + dT) / T1 });
        const r = firstCalc(o);
        return {
          title: '圧力を一定にして加熱する',
          body: R`なめらかに動くピストンのついた容器に、物質量 $` + nTex + R`\,\mathrm{mol}$ の理想気体が入っている。この気体を、圧力を一定に保ったまま、$` + T1 + R`\,\mathrm{K}$ から $` + (T1 + dT) + R`\,\mathrm{K}$ まで加熱し、ゆっくりと膨張させた。` + consts,
          fig: firstFigure(o, r, { ask: true }),
          parts: [
            { label: '(1)', q: R`内部エネルギーの変化 $\Delta U$`, type: 'num', answer: p3(r.dU), rel: 0.02, unit: 'J' },
            { label: '(2)', q: R`気体が外にした仕事 $W$`, type: 'num', answer: p3(r.W), rel: 0.02, unit: 'J' },
            { label: '(3)', q: R`気体が吸収した熱量 $Q$`, type: 'num', answer: p3(r.Q), rel: 0.02, unit: 'J' }
          ],
          solution: firstSteps(o, r)
        };
      }
      if (level === 'mid') {
        if (rng.bool(0.5)) {
          const f = rng.pick([2, 3, 4]);
          const lnv = { 2: 0.693, 3: 1.10, 4: 1.39 }[f];
          const o = mkO('T', { V2: V1L * f, ex: { f: f, lnv: lnv } });
          const r = firstCalc(o);
          // 問題文の ln の値で答えを出す（有効数字 3 桁）
          const Wp = n * RG * T1 * lnv;
          const rr = Object.assign({}, r, { W: Wp, Q: Wp });
          return {
            title: '温度を一定にして膨張させる',
            body: R`物質量 $` + nTex + R`\,\mathrm{mol}$ の理想気体を、温度 $` + T1 + R`\,\mathrm{K}$ に保ったまま、体積が $` + f + R`$ 倍になるまでゆっくり膨張させた。` + consts + R`必要なら $\ln ` + f + ' = ' + lnv + R`$ を用いよ。`,
            fig: firstFigure(o, rr, { ask: true }),
            parts: [
              { label: '(1)', q: R`内部エネルギーの変化 $\Delta U$`, type: 'num', answer: 0, rel: 0.02, unit: 'J' },
              { label: '(2)', q: R`気体が外にした仕事 $W$`, type: 'num', answer: p3(Wp), rel: 0.02, unit: 'J' },
              { label: '(3)', q: R`気体が吸収した熱量 $Q$`, type: 'num', answer: p3(Wp), rel: 0.02, unit: 'J' }
            ],
            solution: firstSteps(o, rr)
          };
        }
        const f = rng.pick([8, 27]);
        const comp = rng.bool(0.5);
        const rt = f === 8 ? 4 : 9;       // 8^(2/3), 27^(2/3)
        const o = mkO('A', { V2: comp ? V1L / f : V1L * f, ex: { f: f, comp: comp, rt: rt } });
        const r = firstCalc(o);
        return {
          title: comp ? '気体を断熱圧縮する' : '気体を断熱膨張させる',
          body: R`物質量 $` + nTex + R`\,\mathrm{mol}$ の理想気体が温度 $` + T1 + R`\,\mathrm{K}$ にある。この気体を、外との熱の出入りがないように、体積が $` + (comp ? R`\dfrac{1}{` + f + R`}` : f) + R`$ 倍になるまでゆっくり` + (comp ? '圧縮' : '膨張') + R`させた。単原子分子の理想気体の比熱比は $\gamma = \dfrac{5}{3}$ で、$` + f + R`^{\frac{2}{3}} = ` + rt + R`$ である。` + consts,
          fig: firstFigure(o, r, { ask: true }),
          parts: [
            { label: '(1)', q: R`変化後の絶対温度 $T_{2}$`, type: 'num', answer: p3(r.T2), rel: 0.02, unit: 'K' },
            { label: '(2)', q: R`内部エネルギーの変化 $\Delta U$`, type: 'num', answer: p3(r.dU), rel: 0.02, unit: 'J' },
            { label: '(3)', q: R`気体が外にした仕事 $W$（外から仕事をされたなら負）`, type: 'num', answer: p3(r.W), rel: 0.02, unit: 'J' }
          ],
          solution: firstSteps(o, r)
        };
      }
      // adv: 経路が 2 段階（定積 → 定圧）で、ΔU は経路によらないことを使う
      const kP = rng.pick([2, 3]);
      const mV = rng.pick([2, 3]);
      const TB = T1 * kP, TC = TB * mV;
      const dUt = 1.5 * n * RG * (TC - T1);
      const WBC = n * RG * (TC - TB);
      const Qt = dUt + WBC;
      const dUab = 1.5 * n * RG * (TB - T1), dUbc = 1.5 * n * RG * (TC - TB), QBC = dUbc + WBC;
      const VA = V1L, PA = P1;
      const states = [{ V: VA, P: PA, name: 'A', pos: 'br' }, { V: VA, P: PA * kP, name: 'B', pos: 'tl' }, { V: VA * mV, P: PA * kP, name: 'C', pos: 'tr' }];
      const graph = pvFigure({ states: states, segs: [{ kind: 'V', a: 0, b: 1, cls: 'c3' }, { kind: 'P', a: 1, b: 2, cls: 'c3', nofill: true }] }, { ask: true, h: 252 });
      const solution = [
        {
          t: '図で状況をつかむ（2 段階の経路）',
          n: R`状態 A → B は体積一定（定積変化）で圧力が $` + kP + R`$ 倍、B → C は圧力一定（定圧変化）で体積が $` + mV + R`$ 倍になる経路です。A → C 全体の $\Delta U$、$W$、$Q$ を求めます。`,
          easy: R`P–V 図で、まず真上に進み（体積を変えずに圧力だけを上げる）、次に真横に進む（圧力を保ったまま体積を広げる）経路です。エネルギーの出入りは、**内部エネルギーは始めと終わりだけで決まる**、**仕事は経路の下の面積で決まる**、という違いに注意して整理します。`
        },
        {
          t: '各状態の絶対温度',
          m: [R`T_{\mathrm{B}} = T_{\mathrm{A}} \times \frac{P_{\mathrm{B}}}{P_{\mathrm{A}}} = ` + T1 + R` \times ` + kP + ' = ' + TB + R`\,\mathrm{K}`, R`T_{\mathrm{C}} = T_{\mathrm{B}} \times \frac{V_{\mathrm{C}}}{V_{\mathrm{B}}} = ` + TB + R` \times ` + mV + ' = ' + TC + R`\,\mathrm{K}`],
          n: R`A → B は体積一定なので $\dfrac{P}{T}$ が一定、B → C は圧力一定なので $\dfrac{V}{T}$ が一定です。`,
          easy: R`体積が一定のときは圧力と絶対温度が、圧力が一定のときは体積と絶対温度が、それぞれ同じ倍率で変わります。`
        },
        {
          t: R`内部エネルギーの変化 $\Delta U$（A → C 全体）`,
          m: [R`\Delta U = \frac{3}{2}nR(T_{\mathrm{C}} - T_{\mathrm{A}}) = \frac{3}{2} \times ` + T(n) + R` \times 8.3 \times (` + TC + ' - ' + T1 + ') = ' + S3(dUt) + R`\,\mathrm{J}`],
          n: R`$\Delta U$ は始めの温度 $T_{\mathrm{A}}$ と終わりの温度 $T_{\mathrm{C}}$ だけで決まります（途中の B を通っても通らなくても同じ）。`,
          pro: R`$\Delta U = \dfrac{3}{2}(P_{\mathrm{C}}V_{\mathrm{C}} - P_{\mathrm{A}}V_{\mathrm{A}})$ なので、P–V 図の 2 点の $PV$ だけで求まります。`
        },
        {
          t: R`気体がした仕事 $W$（A → B は $0$、B → C は $P\Delta V$）`,
          m: [R`W = W_{\mathrm{AB}} + W_{\mathrm{BC}} = 0 + P_{\mathrm{B}}(V_{\mathrm{C}} - V_{\mathrm{B}}) = nR(T_{\mathrm{C}} - T_{\mathrm{B}})`, R`W = ` + T(n) + R` \times 8.3 \times (` + TC + ' - ' + TB + ') = ' + S3(WBC) + R`\,\mathrm{J}`],
          n: R`A → B では体積が変わらないので仕事は $0$。B → C は圧力 $P_{\mathrm{B}}$ が一定で、P–V 図の長方形の面積が仕事です。`,
          easy: R`仕事をするのは、体積が変わる B → C のときだけです。ピストンを押し出す力（圧力 × 面積）が一定なので、$P\Delta V$ をそのまま計算できます。`
        },
        {
          t: R`熱力学第一法則から $Q$ を求める`,
          m: [R`Q = \Delta U + W = ` + sumTex(dUt, WBC) + R`\,\mathrm{J}`],
          n: R`A → C 全体で気体が吸収した熱量です。経路が違えば $W$ が変わるので、$Q$ も変わります。`,
          pro: R`過程ごとに足しても同じ: $Q_{\mathrm{AB}} = \Delta U_{\mathrm{AB}} = ` + S3(dUab) + R`\,\mathrm{J}$、$Q_{\mathrm{BC}} = \Delta U_{\mathrm{BC}} + W_{\mathrm{BC}} = ` + S3(QBC) + R`\,\mathrm{J}$。合計が $Q$ に一致します。`
        },
        {
          t: '検算: 過程ごとに分けて確認する',
          m: [R`Q_{\mathrm{AB}} = \frac{3}{2}nR(T_{\mathrm{B}} - T_{\mathrm{A}}) = \frac{3}{2} \times ` + T(n) + R` \times 8.3 \times (` + TB + ' - ' + T1 + ') = ' + S3(dUab) + R`\,\mathrm{J}`,
            R`Q_{\mathrm{BC}} = \frac{5}{2}nR(T_{\mathrm{C}} - T_{\mathrm{B}}) = \frac{5}{2} \times ` + T(n) + R` \times 8.3 \times (` + TC + ' - ' + TB + ') = ' + S3(QBC) + R`\,\mathrm{J}`,
            R`Q_{\mathrm{AB}} + Q_{\mathrm{BC}} = ` + sumTex(dUab, QBC) + R`\,\mathrm{J}`],
          n: R`定積では $Q = nC_{V}\Delta T$（$C_{V} = \dfrac{3}{2}R$）、定圧では $Q = nC_{P}\Delta T$（$C_{P} = \dfrac{5}{2}R$）を使って別々に求めても、足すと $Q$ と一致します。`,
          lv: 2
        }
      ];
      return {
        title: '定積変化のあと定圧変化をする経路',
        body: R`物質量 $` + nTex + R`\,\mathrm{mol}$ の単原子分子理想気体が、状態 A（絶対温度 $` + T1 + R`\,\mathrm{K}$）から、まず体積を一定に保って圧力を $` + kP + R`$ 倍にし（状態 B）、次に圧力を一定に保って体積を $` + mV + R`$ 倍にした（状態 C）。` + consts,
        fig: graph,
        parts: [
          { label: '(1)', q: R`状態 C の絶対温度 $T_{\mathrm{C}}$`, type: 'num', answer: p3(TC), rel: 0.02, unit: 'K' },
          { label: '(2)', q: R`A → C の間の内部エネルギーの変化 $\Delta U$`, type: 'num', answer: p3(dUt), rel: 0.02, unit: 'J' },
          { label: '(3)', q: R`A → C の間に気体が外にした仕事 $W$`, type: 'num', answer: p3(WBC), rel: 0.02, unit: 'J' },
          { label: '(4)', q: R`A → C の間に気体が吸収した熱量 $Q$`, type: 'num', answer: p3(Qt), rel: 0.02, unit: 'J' }
        ],
        solution: solution
      };
    }
  });

  /* ================= 2. 熱サイクルと熱効率 ================= */

  // 定積加熱(A→B) → 定圧膨張(B→C) → 定積冷却(C→D) → 定圧圧縮(D→A)。V は L、P は Pa、仕事・熱は J
  function cycleCalc(o) {
    const V1 = o.V1 / 1000, V2 = o.V2 / 1000;
    const dUab = 1.5 * V1 * (o.P2 - o.P1);
    const dUbc = 1.5 * o.P2 * (V2 - V1);
    const dUcd = 1.5 * V2 * (o.P1 - o.P2);
    const dUda = 1.5 * o.P1 * (V1 - V2);
    const Wbc = o.P2 * (V2 - V1), Wda = o.P1 * (V1 - V2);
    const Qab = dUab, Qbc = dUbc + Wbc, Qcd = dUcd, Qda = dUda + Wda;
    const Wnet = Wbc + Wda;
    const Qin = Qab + Qbc, Qout = -(Qcd + Qda);
    const nR = o.n * RG;
    return {
      V1: V1, V2: V2, dUab: dUab, dUbc: dUbc, dUcd: dUcd, dUda: dUda, Wbc: Wbc, Wda: Wda, Qab: Qab, Qbc: Qbc, Qcd: Qcd, Qda: Qda,
      Wnet: Wnet, Qin: Qin, Qout: Qout, e: Wnet / Qin,
      TA: o.P1 * V1 / nR, TB: o.P2 * V1 / nR, TC: o.P2 * V2 / nR, TD: o.P1 * V2 / nR
    };
  }

  function cycleFigure(o, r, opt) {
    opt = opt || {};
    const st = [
      { V: o.V1, P: o.P1, name: 'A', pos: 'bl' }, { V: o.V1, P: o.P2, name: 'B', pos: 'tl' },
      { V: o.V2, P: o.P2, name: 'C', pos: 'tr' }, { V: o.V2, P: o.P1, name: 'D', pos: 'br' }
    ];
    const spec = {
      states: st,
      segs: [{ kind: 'V', a: 0, b: 1, cls: 'c3' }, { kind: 'P', a: 1, b: 2, cls: 'c3', nofill: true }, { kind: 'V', a: 2, b: 3, cls: 'c1' }, { kind: 'P', a: 3, b: 0, cls: 'c1', nofill: true }],
      fill: { Vlo: o.V1, Vhi: o.V2, Plo: o.P1, Phi: o.P2 },
      labels: []
    };
    const vm = (o.V1 + o.V2) / 2, pm = (o.P1 + o.P2) / 2;
    const wide = (o.V2 - o.V1) / o.V2 > 0.35;
    const dP = (o.P2 - o.P1);
    spec.labels.push({ V: vm, P: pm, text: opt.ask ? 'W（面積）' : 'W = ' + fj(r.Wnet), cls: 'fg', anchor: 'middle' });
    spec.labels.push({ V: vm, P: o.P2 + dP * 0.14, text: 'Q 吸収' + (opt.ask ? '' : ' ' + fj(r.Qbc)), cls: 'fg', anchor: 'middle' });
    spec.labels.push({ V: vm, P: o.P1 - dP * 0.24, text: 'Q 放出' + (opt.ask ? '' : ' ' + fj(r.Qda)), cls: 'fg', anchor: 'middle' });
    if (wide) {
      spec.labels.push({ V: o.V1 + (o.V2 - o.V1) * 0.04, P: pm + dP * 0.16, text: 'Q 吸収', cls: 'fg', anchor: 'start' });
      spec.labels.push({ V: o.V2 - (o.V2 - o.V1) * 0.04, P: pm - dP * 0.16, text: 'Q 放出', cls: 'fg', anchor: 'end' });
    }
    return pvFigure(spec, { ask: !!opt.ask, h: 270, guides: true });
  }

  // opt.tc: 最高温度 T_C を問う演習（温度のステップも lv 1 にする）。opt.power: 毎秒のサイクル数を問う演習（仕事率のステップを足す）
  function cycleSteps(o, r, opt) {
    opt = opt || {};
    const V1 = T(r.V1), V2 = T(r.V2);                 // 体積（m³）。L → m³ は 10^-3 を掛けるだけなので、そのままの値で書く
    const dVs = '(' + V2 + ' - ' + V1 + ')';
    const de = dig([r.Wnet, r.Qin], (w, q) => w / q);   // 熱効率の式に代入する W・Q_in の桁数
    const ddu = dig([r.dUab, r.dUbc, r.dUcd, r.dUda], (a, b, c, d) => a + b + c + d, 1e-9 * Math.max(Math.abs(r.dUab), Math.abs(r.dUbc), Math.abs(r.dUcd), Math.abs(r.dUda)));
    const steps = [
      {
        t: '図で状況をつかむ（P–V 図の長方形）',
        n: R`気体は A → B → C → D → A と**時計回り**に変化し、もとの状態にもどります（1 サイクル）。A → B は体積一定（定積加熱）、B → C は圧力一定（定圧膨張）、C → D は体積一定（定積冷却）、D → A は圧力一定（定圧圧縮）です。熱を吸収する過程（A → B、B → C）と、放出する過程（C → D、D → A）を区別して整理します。`,
        easy: R`エンジンのしくみを表した図です。燃料から**熱をもらい**（吸収）、ピストンを動かして**仕事をし**、使い終わった熱を**外へ捨てて**（放出）、もとの状態にもどる、という繰り返しです。囲まれた長方形の面積が、1 サイクルで気体が外にする正味の仕事になります。`
      },
      {
        t: '各状態の絶対温度（状態方程式 $PV = nRT$）',
        m: [R`T_{\mathrm{A}} = \frac{P_{1}V_{1}}{nR} = \frac{` + T(o.P1) + R` \times ` + V1 + '}{' + T(o.n) + R` \times 8.3} = ` + S3(r.TA) + R`\,\mathrm{K}`,
          R`T_{\mathrm{B}} = \frac{P_{2}V_{1}}{nR} = \frac{` + T(o.P2) + R` \times ` + V1 + '}{' + T(o.n) + R` \times 8.3} = ` + S3(r.TB) + R`\,\mathrm{K}`,
          R`T_{\mathrm{C}} = \frac{P_{2}V_{2}}{nR} = \frac{` + T(o.P2) + R` \times ` + V2 + '}{' + T(o.n) + R` \times 8.3} = ` + S3(r.TC) + R`\,\mathrm{K}`,
          R`T_{\mathrm{D}} = \frac{P_{1}V_{2}}{nR} = \frac{` + T(o.P1) + R` \times ` + V2 + '}{' + T(o.n) + R` \times 8.3} = ` + S3(r.TD) + R`\,\mathrm{K}`],
        n: R`体積は $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^{3}}$ で換算して、$n = ` + T(o.n) + R`\,\mathrm{mol}$、$R = 8.3\,\mathrm{J/(mol\cdot K)}$ を使います。最高温度は C、最低温度は A です。`,
        easy: R`長方形の 4 つの角（A、B、C、D）それぞれで、$P$ と $V$ から温度が決まります。右上（C）ほど $PV$ が大きいので温度が高く、左下（A）ほど低くなります。`,
        lv: opt.tc ? 1 : 2
      },
      {
        t: R`A → B（定積加熱）: $W = 0$、$Q = \Delta U$`,
        m: [R`W_{\mathrm{AB}} = 0`, R`\Delta U_{\mathrm{AB}} = \frac{3}{2}V_{1}(P_{2} - P_{1}) = \frac{3}{2} \times ` + V1 + R` \times (` + T(o.P2) + ' - ' + T(o.P1) + ') = ' + S3(r.dUab) + R`\,\mathrm{J}`,
          R`Q_{\mathrm{AB}} = \Delta U_{\mathrm{AB}} = ` + S3(r.Qab) + R`\,\mathrm{J}\quad (\text{吸収})`],
        n: R`体積が変わらないので仕事は $0$。内部エネルギーの変化は $\Delta U = \dfrac{3}{2}nR\Delta T = \dfrac{3}{2}\Delta(PV)$ で、体積が $V_{1}$ のまま圧力だけが変わるので $\dfrac{3}{2}V_{1}\Delta P$ と書けます。第一法則より $Q = \Delta U$（正なので熱を吸収）です。`,
        easy: R`体積を変えずに温度を上げる（圧力が上がる）過程です。ピストンが動かないので仕事はなく、吸収した熱はすべて気体の温度上昇（内部エネルギーの増加）に使われます。`
      },
      {
        t: R`B → C（定圧膨張）: $W = P\Delta V$、$Q = \Delta U + W$`,
        m: [R`W_{\mathrm{BC}} = P_{2}(V_{2} - V_{1}) = ` + T(o.P2) + R` \times ` + dVs + ' = ' + S3(r.Wbc) + R`\,\mathrm{J}`,
          R`\Delta U_{\mathrm{BC}} = \frac{3}{2}P_{2}(V_{2} - V_{1}) = \frac{3}{2} \times ` + T(o.P2) + R` \times ` + dVs + ' = ' + S3(r.dUbc) + R`\,\mathrm{J}`,
          R`Q_{\mathrm{BC}} = \Delta U_{\mathrm{BC}} + W_{\mathrm{BC}} = \frac{5}{2}P_{2}(V_{2} - V_{1}) = \frac{5}{2} \times ` + T(o.P2) + R` \times ` + dVs + ' = ' + S3(r.Qbc) + R`\,\mathrm{J}\quad (\text{吸収})`],
        n: R`圧力 $P_{2}$ のまま体積が増えるので、気体は外に仕事 $P_{2}\Delta V$ をします。この過程では温度も上がるので、$\Delta U > 0$ です。$Q = \Delta U + W = \dfrac{3}{2}P\Delta V + P\Delta V = \dfrac{5}{2}P\Delta V$ となります。`,
        easy: R`圧力を保って気体を膨らませる過程です。吸収した熱の一部は温度を上げるため（$\Delta U$）に、残りはピストンを押し出す仕事（$W$）に使われます。`
      },
      {
        t: R`C → D（定積冷却）: $W = 0$、$Q = \Delta U < 0$`,
        m: [R`W_{\mathrm{CD}} = 0`, R`\Delta U_{\mathrm{CD}} = \frac{3}{2}V_{2}(P_{1} - P_{2}) = \frac{3}{2} \times ` + V2 + R` \times (` + T(o.P1) + ' - ' + T(o.P2) + ') = ' + S3(r.dUcd) + R`\,\mathrm{J}`, R`Q_{\mathrm{CD}} = \Delta U_{\mathrm{CD}} = ` + S3(r.Qcd) + R`\,\mathrm{J}\quad (\text{放出})`],
        n: R`体積一定で圧力が下がる（温度が下がる）ので、気体は熱を**放出**します。$Q < 0$ は放出を表します。`,
        easy: R`ピストンを固定したまま冷やす過程です。仕事はなく、内部エネルギーが減った分だけ、熱が外へ逃げていきます（$Q$ がマイナス）。`
      },
      {
        t: R`D → A（定圧圧縮）: $W < 0$、$Q < 0$`,
        m: [R`W_{\mathrm{DA}} = P_{1}(V_{1} - V_{2}) = ` + T(o.P1) + R` \times (` + V1 + ' - ' + V2 + ') = ' + S3(r.Wda) + R`\,\mathrm{J}`,
          R`\Delta U_{\mathrm{DA}} = \frac{3}{2}P_{1}(V_{1} - V_{2}) = \frac{3}{2} \times ` + T(o.P1) + R` \times (` + V1 + ' - ' + V2 + ') = ' + S3(r.dUda) + R`\,\mathrm{J}`,
          R`Q_{\mathrm{DA}} = \Delta U_{\mathrm{DA}} + W_{\mathrm{DA}} = \frac{5}{2}P_{1}(V_{1} - V_{2}) = \frac{5}{2} \times ` + T(o.P1) + R` \times (` + V1 + ' - ' + V2 + ') = ' + S3(r.Qda) + R`\,\mathrm{J}\quad (\text{放出})`],
        n: R`圧力 $P_{1}$ のまま体積が減る（圧縮される）ので、気体は外から仕事をされ、$W < 0$ です。温度も下がるので、$\Delta U < 0$ です。`,
        easy: R`圧力を保ったまま縮める過程で、気体は外から押されて仕事をされます（$W$ がマイナス）。このとき気体は熱も外へ放出します。`
      },
      {
        t: '1 サイクルで気体がする正味の仕事 $W$',
        m: [R`W = W_{\mathrm{BC}} + W_{\mathrm{DA}} = (P_{2} - P_{1})(V_{2} - V_{1})`, R`W = (` + T(o.P2) + ' - ' + T(o.P1) + R`) \times ` + dVs + ' = ' + S3(r.Wnet) + R`\,\mathrm{J}`],
        n: R`1 サイクルで気体がする正味の仕事は、P–V 図の経路が囲む長方形の面積 $(P_{2} - P_{1})(V_{2} - V_{1})$ に等しくなります（時計回りなので正）。膨張で気体がした仕事 $W_{\mathrm{BC}}$ から、圧縮でされた仕事 $|W_{\mathrm{DA}}|$ を引いたものです。`,
        easy: R`行きは高い圧力でピストンを押し出して大きな仕事をし、帰りは低い圧力で押し戻されるので、差し引きで仕事が残ります。その残りがグラフの長方形の面積です。`
      },
      {
        t: '吸収した熱量・放出した熱量と熱効率',
        m: [R`Q_{\mathrm{in}} = Q_{\mathrm{AB}} + Q_{\mathrm{BC}} = ` + sumTex(r.Qab, r.Qbc) + R`\,\mathrm{J}`,
          R`Q_{\mathrm{out}} = -(Q_{\mathrm{CD}} + Q_{\mathrm{DA}}) = -(` + sumTerms(r.Qcd, r.Qda) + ')' + tailOf(r.Qout, [r.Qcd, r.Qda]) + R`\,\mathrm{J}`,
          R`e = \frac{W}{Q_{\mathrm{in}}} = \frac{` + SV(r.Wnet, de) + '}{' + SV(r.Qin, de) + '} = ' + S3(r.e) + R`\ (= ` + U.fmt(rd3(r.e) * 100, 1) + R`\,\%)`],
        n: R`熱効率 $e$ は「吸収した熱量のうち、何割が仕事に変わったか」を表します。$e = \dfrac{W}{Q_{\mathrm{in}}}$ で、吸収した熱 $Q_{\mathrm{in}}$ は $Q > 0$ の過程（A → B、B → C）の合計です。放出した熱量 $Q_{\mathrm{out}}$ は、$Q < 0$ の過程（C → D、D → A）の合計の符号を変えた正の値です。1 サイクルでは $\Delta U = 0$ なので $Q_{\mathrm{in}} - Q_{\mathrm{out}} = W$ が成り立ち、$e = 1 - \dfrac{Q_{\mathrm{out}}}{Q_{\mathrm{in}}}$ とも書けます。`,
        easy: R`「もらった熱のうち、何%を仕事に変えられたか」が熱効率です。たとえば $e = 0.20$ なら、もらった熱の $20\%$ が仕事になり、残りの $80\%$ は捨てる熱になります。`,
        pro: R`$Q_{\mathrm{in}}$ に入れるのは $Q > 0$ の過程だけ（定圧膨張の $Q_{\mathrm{BC}} = \dfrac{5}{2}P\Delta V$ を忘れない）。分母を $Q_{\mathrm{AB}}$ だけにするミスが頻出です。`
      },
      {
        t: '検算: 1 サイクルでエネルギーは保存する',
        m: [R`\Delta U_{\text{全}} = ` + SV(r.dUab, ddu) + ' + ' + SV(r.dUbc, ddu) + ' + ' + P(SV(r.dUcd, ddu)) + ' + ' + P(SV(r.dUda, ddu)) + R` = 0`,
          R`Q_{\mathrm{in}} - Q_{\mathrm{out}} = ` + diffTex(r.Qin, r.Qout) + R`\,\mathrm{J} = W`],
        n: R`もとの状態にもどるので、内部エネルギーの変化の合計は $0$ です。したがって、吸収した熱と放出した熱の差が、そのまま外にした仕事になっています。`,
        lv: 2
      },
      {
        t: '補足: なぜ熱効率は 100% にならないのか',
        n: R`熱機関は、高温の熱源から熱 $Q_{\mathrm{in}}$ をもらい、その一部を仕事に変えますが、必ず低温の熱源へ熱 $Q_{\mathrm{out}}$ を捨てる必要があります（熱力学第二法則）。このため $e < 1$ で、$e = 1 - \dfrac{Q_{\mathrm{out}}}{Q_{\mathrm{in}}}$ となります。`,
        easy: R`車のエンジンも火力発電所も、燃料のもつ熱をすべて仕事（動力や電気）に変えることはできず、一部はマフラーや冷却水から熱として外に捨てています。`,
        lv: 3
      }
    ];
    if (opt.power) {
      // 毎秒 opt.power サイクルのときの仕事率（検算のステップの前に入れる）
      const dw = dig([r.Wnet], (w) => w * opt.power);
      steps.splice(8, 0, {
        t: R`(4) 1 秒あたりの仕事（仕事率）`,
        m: [R`\text{仕事率} = W \times ` + opt.power + R`\ (\text{サイクル/秒})`,
          R`\text{仕事率} = ` + SV(r.Wnet, dw) + R` \times ` + opt.power + tailOf(r.Wnet * opt.power, [r.Wnet]) + R`\,\mathrm{W}`],
        n: R`1 サイクルで気体が外にする正味の仕事は $W$ です。毎秒 $` + opt.power + R`$ サイクルの割合で運転すると、1 秒あたりの仕事は $W$ の $` + opt.power + R`$ 倍になります。1 秒あたりの仕事を**仕事率**といい、$1\,\mathrm{J/s} = 1\,\mathrm{W}$ です。`,
        easy: R`エンジンは同じ動きをくり返すので、1 回（1 サイクル）で $W$ の仕事をするなら、1 秒に $` + opt.power + R`$ 回くり返すと、1 秒で $` + opt.power + R` \times W$ の仕事をします。「1 秒あたりの仕事」を**仕事率**といい、単位は $\mathrm{W}$（ワット）です。`
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'thermo-cycle',
    field: '熱力学',
    unit: 'p-thermo1',
    title: '熱サイクルと熱効率（長方形サイクル）',
    desc: R`定積 → 定圧 → 定積 → 定圧 の長方形サイクルについて、各過程の $Q$・$W$、1 サイクルの正味の仕事（囲む面積）と熱効率 $e = \dfrac{W}{Q_{\mathrm{in}}}$ を求めます。`,
    form: [R`Q = \Delta U + W`, R`W = (P_{2} - P_{1})(V_{2} - V_{1})`, R`e = \frac{W}{Q_{\mathrm{in}}}`],
    inputs: [
      { key: 'n', label: R`物質量 $n$`, unit: 'mol', type: 'num', def: '0.10', min: 0.0001, max: 10000, hint: '温度の計算にだけ使います（$W$・$Q$・$e$ には影響しません）' },
      { key: 'P1', label: R`低い方の圧力 $P_{1}$`, unit: 'Pa', type: 'num', def: '1.0e5', min: 1, max: 1e9, hint: '1.0e5 または 1.0×10^5 と入力できます' },
      { key: 'P2', label: R`高い方の圧力 $P_{2}$`, unit: 'Pa', type: 'num', def: '2.0e5', min: 1, max: 1e9 },
      { key: 'V1', label: R`小さい方の体積 $V_{1}$`, unit: 'L', type: 'num', def: '2.0', min: 0.001, max: 1000000 },
      { key: 'V2', label: R`大きい方の体積 $V_{2}$`, unit: 'L', type: 'num', def: '4.0', min: 0.001, max: 1000000 }
    ],
    examples: [
      { label: '標準的な長方形', v: { n: '0.10', P1: '1.0e5', P2: '2.0e5', V1: '2.0', V2: '4.0' } },
      { label: '圧力 3 倍・体積 2 倍', v: { n: '0.10', P1: '1.0e5', P2: '3.0e5', V1: '1.0', V2: '2.0' } },
      { label: '縦に長い長方形', v: { n: '0.50', P1: '1.0e5', P2: '5.0e5', V1: '5.0', V2: '6.0' } }
    ],
    intro: {
      easy: R`エンジンは、熱をもらって仕事をし、残りの熱を捨てて、またもとの状態にもどる、という繰り返しで動きます。この 1 回の繰り返しを**サイクル**といい、P–V 図では閉じた経路になります。ここでは、体積一定の変化と圧力一定の変化を 2 回ずつ組み合わせた**長方形のサイクル**を扱います。もらった熱 $Q_{\mathrm{in}}$ のうち、何割が仕事 $W$ に変わったかを表す数が**熱効率** $e = \dfrac{W}{Q_{\mathrm{in}}}$ です。`,
      normal: R`定積 $Q = \dfrac{3}{2}V\Delta P$、定圧 $Q = \dfrac{5}{2}P\Delta V$ で各過程の $Q$ を出し、$W$ は長方形の面積 $(P_{2} - P_{1})(V_{2} - V_{1})$、$e = \dfrac{W}{Q_{\mathrm{in}}}$（$Q_{\mathrm{in}}$ は吸熱する 2 過程の合計）。`,
      pro: R`$Q_{\mathrm{in}} = \dfrac{3}{2}V_{1}\Delta P + \dfrac{5}{2}P_{2}\Delta V$ と文字式で作っておくと、$P_{2}/P_{1}$ と $V_{2}/V_{1}$ の比だけで $e$ が決まる。1 サイクルで $\Delta U = 0$ なので $W = Q_{\mathrm{in}} - Q_{\mathrm{out}}$。`
    },
    compute(v) {
      if (!(v.P2 > v.P1)) throw new JK.CalcError('高い方の圧力 P₂ を、低い方の圧力 P₁ より大きくしてください。');
      if (!(v.V2 > v.V1)) throw new JK.CalcError('大きい方の体積 V₂ を、小さい方の体積 V₁ より大きくしてください。');
      const o = Object.assign({}, v);
      const r = cycleCalc(o);
      must(r.Wnet, r.Qin, r.e, r.TA, r.TC);
      return {
        result: [
          { label: '1 サイクルの正味の仕事 W', tex: S3(r.Wnet) + R`\,\mathrm{J}` },
          { label: '吸収した熱量 Q_in', tex: S3(r.Qin) + R`\,\mathrm{J}` },
          { label: '放出した熱量 Q_out', tex: S3(r.Qout) + R`\,\mathrm{J}` },
          { label: '熱効率 e', tex: S3(r.e) + R`\ (= ` + U.fmt(r.e * 100, 1) + R`\,\%)` },
          { label: '最高温度 T_C（C 点）', tex: S3(r.TC) + R`\,\mathrm{K}` }
        ],
        steps: cycleSteps(o, r),
        fig: cycleFigure(o, r)
      };
    },
    exercise(rng, level) {
      const P1 = rng.pick([1.0e5, 2.0e5, 0.50e5]);
      const kP = rng.pick([2, 3, 4]);
      const V1 = rng.pick([1.0, 2.0, 3.0, 4.0]);
      const kV = rng.pick([2, 3, 1.5]);
      const P2 = P1 * kP, V2 = V1 * kV;
      const n = rng.pick((() => { const ok = [0.020, 0.025, 0.030, 0.040, 0.050, 0.060, 0.080, 0.10, 0.12, 0.15, 0.20, 0.25, 0.30, 0.40, 0.50].filter((x) => P1 * V1 * 1e-3 / (x * RG) >= 200 && P2 * V2 * 1e-3 / (x * RG) <= 3000); return ok.length ? ok : [0.10, 0.20, 0.050]; })());   // 物質量は、気体の温度が現実的な範囲（最低の A が 200 K 以上、最高の C が 3000 K 以下）に収まる値から選ぶ
      const o = { n: n, P1: P1, P2: P2, V1: V1, V2: V2 };
      const r = cycleCalc(o);
      const pT = (x) => '$' + T(x) + R`\,\mathrm{Pa}$`;
      const nTex = (n < 0.1 ? n.toFixed(3) : n.toFixed(2));
      const body = R`物質量 $` + nTex + R`\,\mathrm{mol}$ の単原子分子理想気体を、図のように A（圧力 ` + pT(P1) + R`、体積 $` + V1.toFixed(1) + R`\,\mathrm{L}$）→ B（体積一定で圧力 ` + pT(P2) + R` まで加熱）→ C（圧力一定で体積 $` + V2.toFixed(1) + R`\,\mathrm{L}$ まで膨張）→ D（体積一定で圧力 ` + pT(P1) + R` まで冷却）→ A（圧力一定で圧縮）と変化させる熱機関がある。気体定数を $R = 8.3\,\mathrm{J/(mol\cdot K)}$ として、次の量を有効数字 3 桁で求めよ。`;
      if (level === 'basic') {
        return {
          title: '長方形サイクルの仕事と熱',
          body: body,
          fig: cycleFigure(o, r, { ask: true }),
          parts: [
            { label: '(1)', q: R`1 サイクルで気体が外にした正味の仕事 $W$`, type: 'num', answer: p3(r.Wnet), rel: 0.02, unit: 'J' },
            { label: '(2)', q: R`A → B で気体が吸収した熱量 $Q_{\mathrm{AB}}$`, type: 'num', answer: p3(r.Qab), rel: 0.02, unit: 'J' }
          ],
          solution: cycleSteps(o, r)
        };
      }
      if (level === 'mid') {
        return {
          title: '長方形サイクルの熱効率',
          body: body,
          fig: cycleFigure(o, r, { ask: true }),
          parts: [
            { label: '(1)', q: R`B → C で気体が吸収した熱量 $Q_{\mathrm{BC}}$`, type: 'num', answer: p3(r.Qbc), rel: 0.02, unit: 'J' },
            { label: '(2)', q: R`1 サイクルで気体が吸収した熱量 $Q_{\mathrm{in}}$`, type: 'num', answer: p3(r.Qin), rel: 0.02, unit: 'J' },
            { label: '(3)', q: R`この熱機関の熱効率 $e$（小数で）`, type: 'num', answer: p3(r.e), rel: 0.02 }
          ],
          solution: cycleSteps(o, r)
        };
      }
      return {
        title: '熱サイクルの最高温度と放熱量',
        body: body,
        fig: cycleFigure(o, r, { ask: true }),
        parts: [
          { label: '(1)', q: R`サイクル中の最高温度（C 点）の絶対温度 $T_{\mathrm{C}}$`, type: 'num', answer: p3(r.TC), rel: 0.02, unit: 'K' },
          { label: '(2)', q: R`1 サイクルで気体が外へ放出した熱量 $Q_{\mathrm{out}}$`, type: 'num', answer: p3(r.Qout), rel: 0.02, unit: 'J' },
          { label: '(3)', q: R`熱効率 $e$（小数で）`, type: 'num', answer: p3(r.e), rel: 0.02 },
          { label: '(4)', q: R`この熱機関が毎秒 $5$ サイクルの割合で運転するとき、1 秒あたりに気体が外にする仕事（仕事率）`, type: 'num', answer: p3(r.Wnet * 5), rel: 0.02, unit: 'W' }
        ],
        solution: cycleSteps(o, r, { tc: true, power: 5 })
      };
    }
  });
})();
