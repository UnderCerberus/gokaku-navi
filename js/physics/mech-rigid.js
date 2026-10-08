/* 物理・力学 — 剛体のつり合い（unit: p-rigid）
   mech-moment: 2 点で支えた棒（力のつり合い + 力のモーメントのつり合い）
   mech-ladder: 壁に立てかけた棒・はしご（壁はなめらか・床はあらい） */
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
  // 与えられた値の表示: 有効数字 6 桁までの値（入力した値・その簡単な組合せ）はそのまま書く。1.2345 を 1.234 に丸めて見せると、
  // 表示の数値どうしの計算が結果と合わなくなる。桁の長い値（角度から求めた途中の値など）は従来どおり小数 3 桁
  const nf = (x) => {
    if (typeof x !== 'number' || !isFinite(x)) return U.fmt(x, 3);
    const s = String(Number(x.toPrecision(10)));
    if (s.replace(/^-/, '').replace(/e[+-]?\d+$/, '').replace('.', '').replace(/^0+/, '').length > 6) return U.fmt(x, 3);
    const m = /^(-?[\d.]+)e([+-]?\d+)$/.exec(s);
    return m ? m[1] + R` \times 10^{` + Number(m[2]) + '}' : s;
  };
  const nf4 = (x) => String(Number(x.toPrecision(5)));         // 三角比（問題文で与える 3 けたの値はそのまま、角度から求める値は有効数字 5 桁まで）
  const exact = (x) => String(Number(x.toPrecision(10)));      // 丸めずに書く（式の因数に使う重力 Mg など。表示どおりに計算し直せるように）
  const pn = (x) => U.paren(x);
  // 有効数字 3 桁にしたとき、ちょうど四捨五入の境目（36.75 など）になる値か
  const isTie3 = (x) => x !== 0 && /^\d\.\d\d50*e/.test(Math.abs(x).toExponential(11));
  // 境目の値は、丸める前の値も書く（36.75 ≒ 36.8）。引き算の式で、丸めた値どうしの差が答えとずれて見えるのを防ぐ
  const exact4 = (x) => String(Number(x.toPrecision(4)));
  const sigTie = (x) => (isTie3(x) ? exact4(x) + R` \fallingdotseq ` + sig(x) : sig(x));
  // 引き算の相手（先に求めた抗力 x）として書く値。結果 target を有効数字 3 桁で書く小数位まで書く（41.0 でなく 41.04。
  // 丸めた値を引くと、結果の最後の桁がずれるため）。x 自身の 3 桁で足りて、x が境目の値のときは 1 桁多く書く
  // minuend: 引かれる数（全体の重さ (M + m)g）。小数位が x の 3 桁より細かいときは、その小数位まで書く
  const decimalsOf = (x) => { const s = String(Number(x.toPrecision(10))), i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
  const subArg = (x, target, minuend) => {
    if (!x || !target) return sig(x);
    const ex = Math.floor(Math.log10(Math.abs(x))), et = Math.floor(Math.log10(Math.abs(target)));
    const dx = Math.max(0, 2 - ex), dt = Math.max(0, 2 - et) + (isTie3(target) ? 1 : 0);
    let d = Math.max(dx, dt, minuend == null ? 0 : decimalsOf(minuend));
    if (d === dx && isTie3(x)) d += 1;
    return d === dx ? sig(x) : U.sig(x, ex + d + 1);
  };
  // 引き算に、有効数字 3 桁より多く書いた値を使ったときの断り書き
  const subNote = (x, target, minuend) => (subArg(x, target, minuend) !== sig(x) ? R`引き算には、有効数字 3 桁に丸める前に近い $` + subArg(x, target, minuend) + R`$ を使います（丸めた値を引くと、最後の桁がずれることがあるためです）。` : '');
  const rad = (deg) => deg * PI / 180;
  const zero = (x) => (Math.abs(x) < 1e-9 ? 0 : x);
  const NN = R`\,\mathrm{N}`, MM = R`\,\mathrm{m}`, KG = R`\,\mathrm{kg}`;

  // 添字つきの文字（N_A など）を図に置く
  function subText(d, x, y, base, sub, o) {
    o = o || {};
    d.group('<text class="d-lab ' + (o.cls ? 't-' + o.cls : 't-fg') + '" x="' + Math.round(x * 100) / 100 + '" y="' + Math.round(y * 100) / 100 +
      '" text-anchor="' + (o.anchor || 'middle') + '">' + U.esc(base) + '<tspan dy="3" font-size="8.5">' + U.esc(sub) + '</tspan></text>');
  }

  /* =====================================================================
     棒のつり合い（力のモーメント）
     ===================================================================== */
  function solveMoment(L, M, xA, xB, m, x) {
    const r = { L: L, M: M, xA: xA, xB: xB, m: m, x: x };
    r.Wr = M * G;                                          // 棒の重力
    r.Ww = m * G;                                          // おもりの重力
    r.NB = (r.Wr * (L / 2 - xA) + r.Ww * (x - xA)) / (xB - xA);
    r.NA = r.Wr + r.Ww - r.NB;
    r.NA = zero(r.NA); r.NB = zero(r.NB);
    return r;
  }

  function momentFig(r, o) {
    o = o || {};
    const d = JK.plot.draw(360, 252);
    const x0 = 30, x1 = 330, s = (x1 - x0) / r.L;
    const X = (xm) => x0 + xm * s;
    const yr = 104;
    // 支点（三角形 + 台）
    [r.xA, r.xB].forEach((xm) => {
      const px = X(xm);
      d.poly([[px, yr + 6], [px - 9, yr + 24], [px + 9, yr + 24]], { cls: 'fg', fill: 'f0' });
      d.hatch(px - 14, yr + 24, px + 14, yr + 24);
    });
    d.rect(x0, yr - 6, x1 - x0, 12, { cls: 'fg', fill: 'f1', rx: 2 });
    // おもり（糸でつるす）
    const px = X(r.x);
    d.line(px, yr + 6, px, yr + 40, { cls: 'dim', w: 1.2 });
    d.rect(px - 10, yr + 40, 20, 17, { cls: 'fg', fill: 'f3', rx: 2 });
    d.dot(X(r.L / 2), yr, { cls: 'fg', r: 2.2 });
    if (o.forces) {
      const Fmax = Math.max(r.NA, r.NB, r.Wr, r.Ww, 1e-9);
      const len = (F) => (F < 1e-9 ? 0 : Math.max(14, 50 * F / Fmax));
      [[r.xA, r.NA, 'A'], [r.xB, r.NB, 'B']].forEach((a) => {
        const l = len(a[1]);
        if (l > 0) {
          d.arrow(X(a[0]), yr - 6, X(a[0]), yr - 6 - l, { cls: 'c1', w: 2.4 });
          subText(d, X(a[0]), yr - 6 - l - 7, 'N', a[2]);
        }
      });
      const lM = len(r.Wr), lm = len(r.Ww);
      d.arrow(X(r.L / 2), yr + 6, X(r.L / 2), yr + 6 + lM, { cls: 'c2', label: 'Mg', w: 2.2 });
      d.arrow(px, yr + 57, px, yr + 57 + lm, { cls: 'c3', label: 'mg', w: 2.2 });
      d.text(180, 14, 'N' + '(A) = ' + plain(r.NA) + ' N　N(B) = ' + plain(r.NB) + ' N', { cls: 'dim', size: 11 });
    }
    // 位置の目盛り（左端からの距離）
    const ry = 190;
    d.line(x0, ry, x1, ry, { cls: 'dim', w: 1.2 });
    const items = [[0, '0'], [r.L, nf(r.L)], [r.xA, 'A ' + nf(r.xA)], [r.xB, 'B ' + nf(r.xB)], [r.x, 'おもり ' + nf(r.x)]].sort((a, b) => a[0] - b[0]);
    let lastPx = [-1e9, -1e9];
    items.forEach((it) => {
      const p = X(it[0]);
      d.line(p, ry - 4, p, ry + 4, { cls: 'dim', w: 1.2 });
      let row = 0;
      if (p - lastPx[0] < 62) row = 1;
      if (row === 1 && p - lastPx[1] < 62) row = 0;
      lastPx[row] = p;
      d.text(p, ry + 18 + row * 15, it[1], { cls: 'dim', size: 11 });
    });
    d.text(x1 + 8, ry + 4, 'm', { cls: 'dim', size: 10, anchor: 'start' });
    return d.svg();
  }
  function plain(x) {
    const s = sig(x);
    return /times/.test(s) ? String(P3(x)) : s;
  }

  const stMomForces = (r) => ({
    t: '棒にはたらく力を図に描く',
    n: R`棒の長さを $L$、質量を $M$、おもりの質量を $m$、左端から支点 A, B・おもりまでの距離を $x_{A}, x_{B}, x$ とします。棒にはたらく力は、**棒の重力 $Mg$**（一様な棒なので中央の 1 点に作用）、**おもりが糸で引く力 $mg$**（つるした位置に作用）、**支点 A, B からの抗力 $N_{A}, N_{B}$**（上向き）の 4 つです。棒は水平に静止しているので、「動かない」ことと「回らない」ことの 2 つの条件が成り立ちます。`,
    easy: R`棒が止まっているのは、「上下に動かない」（力のつり合い）ことと、「くるくる回らない」（力のモーメントのつり合い）ことの 2 つが同時に成り立っているからです。シーソーを思い浮かべてください。右に重い人が乗れば右が下がり、左に乗れば左が下がります。棒の重さは、**真ん中に集まっている**とみなして図に描きます（一様な棒の重心は中央です）。`,
    pro: R`未知数は $N_{A}, N_{B}$ の 2 つ。力のつり合い 1 式 + モーメントのつり合い 1 式で解ける。`
  });

  const stMomForce = (r) => ({
    t: '力のつり合い（上下方向）',
    m: [R`N_{A} + N_{B} = Mg + mg`,
      R`N_{A} + N_{B} = (` + nf(r.M) + ' + ' + nf(r.m) + R`) \times 9.8 = ` + sigTie(r.Wr + r.Ww) + NN],
    n: R`上向きの力（2 つの支点の抗力）の合計が、下向きの力（棒とおもりの重力）の合計に等しくなります。`,
    easy: R`棒全体を支えているのは 2 つの支点です。2 つの支点が上に押す力の合計は、棒とおもりの重さの合計と同じになります。ただし、重さが 2 つの支点にどう分かれるかは、この式だけでは決まりません。そこで次の「回らない条件」を使います。`
  });

  // pivot: 'A'（支点 A のまわりで N_B を先に求める）/ 'B'（支点 B のまわりで N_A を先に求める）。設問で先に問われる方の抗力が先に出るように選ぶ
  const stMomMoment = (r, pivot) => (pivot === 'B' ? {
    t: '力のモーメントのつり合い（支点 B のまわり）',
    m: [R`N_{A}(x_{B} - x_{A}) = Mg\left(x_{B} - \frac{L}{2}\right) + mg\,(x_{B} - x)`,
      R`N_{A} \times ` + nf(r.xB - r.xA) + ' = ' + exact(r.Wr) + R` \times ` + nf(r.xB - r.L / 2) + ' + ' + exact(r.Ww) + R` \times ` + pn(zero(r.xB - r.x))],
    n: R`**力のモーメント** = 力 × 腕の長さ（回転軸から力の作用線までの距離）。支点 B を回転軸にすると、$N_{B}$ は軸を通るのでモーメントが 0 になり、式から消えます。B のまわりに「棒を時計回りに回す効果」は $N_{A}$ だけ（B より左で上向きに押す）、「反時計回りに回す効果」は $Mg$ と $mg$ です（どちらも B より左で下向きに引く）。この 2 つが等しければ棒は回りません。`,
    easy: R`シーソーで、支点から遠いほど小さな力でも大きく回せますね。この「回す効果」を**力のモーメント**といい、「力 × 支点からの距離」で表します。棒が回らないのは、右回りの効果と左回りの効果がちょうど等しいとき。回転軸（支点）はどこに取ってもよいので、**知らない力がはたらく点**（ここでは B）を選ぶと、その力のモーメントが 0 になって計算が楽になります。`,
    pro: R`回転軸は「未知の力が複数通る点」に取る。距離は「軸から力の作用線までの垂直距離」（今回は水平方向の距離）。先に求めたい抗力が通らない側の支点を軸にする。`
  } : {
    t: '力のモーメントのつり合い（支点 A のまわり）',
    m: [R`N_{B}(x_{B} - x_{A}) = Mg\left(\frac{L}{2} - x_{A}\right) + mg\,(x - x_{A})`,
      R`N_{B} \times ` + nf(r.xB - r.xA) + ' = ' + exact(r.Wr) + R` \times ` + nf(r.L / 2 - r.xA) + ' + ' + exact(r.Ww) + R` \times ` + pn(zero(r.x - r.xA))],
    n: R`**力のモーメント** = 力 × 腕の長さ（回転軸から力の作用線までの距離）。支点 A を回転軸にすると、$N_{A}$ は軸を通るのでモーメントが 0 になり、式から消えます。A のまわりに「棒を反時計回りに回す効果」は $N_{B}$ だけ、「時計回りに回す効果」は $Mg$ と $mg$ です。この 2 つが等しければ棒は回りません。` + (r.x < r.xA ? R`おもりが A より左にあるときは $mg$ の効果が逆向き（反時計回り）になるので、式の $(x - x_{A})$ は負の値になります。` : ''),
    easy: R`シーソーで、支点から遠いほど小さな力でも大きく回せますね。この「回す効果」を**力のモーメント**といい、「力 × 支点からの距離」で表します。棒が回らないのは、右回りの効果と左回りの効果がちょうど等しいとき。回転軸（支点）はどこに取ってもよいので、**知らない力がはたらく点**（ここでは A）を選ぶと、その力のモーメントが 0 になって計算が楽になります。`,
    pro: R`回転軸は「未知の力が複数通る点」に取る。距離は「軸から力の作用線までの垂直距離」（今回は水平方向の距離）。`
  });

  const stMomSolve = (r, pivot) => (pivot === 'B' ? {
    t: '$N_{A}$ と $N_{B}$ を求める',
    m: [R`N_{A} = \frac{Mg\left(x_{B} - \frac{L}{2}\right) + mg\,(x_{B} - x)}{x_{B} - x_{A}}`,
      R`N_{A} = \frac{` + exact(r.Wr) + R` \times ` + nf(r.xB - r.L / 2) + ' + ' + exact(r.Ww) + R` \times ` + pn(zero(r.xB - r.x)) + '}{' + nf(r.xB - r.xA) + '} = ' + sigTie(r.NA) + NN,
      R`N_{B} = (M + m)g - N_{A} = ` + exact(r.Wr + r.Ww) + ' - ' + subArg(r.NA, r.NB, r.Wr + r.Ww) + ' = ' + sigTie(r.NB) + NN],
    n: R`モーメントの式から $N_{A}$ を求め、力のつり合いの式に代入して $N_{B}$ を求めます。` + subNote(r.NA, r.NB, r.Wr + r.Ww),
    easy: R`まず「回らない条件」の式を $N_{A}$ について解きます（右辺の数を、$x_{B} - x_{A}$ で割るだけです）。次に、「上下の力のつり合い」から、全体の重さ $(M+m)g$ から $N_{A}$ を引けば $N_{B}$ が出ます。`
  } : {
    t: '$N_{B}$ と $N_{A}$ を求める',
    m: [R`N_{B} = \frac{Mg\left(\frac{L}{2} - x_{A}\right) + mg\,(x - x_{A})}{x_{B} - x_{A}}`,
      R`N_{B} = \frac{` + exact(r.Wr) + R` \times ` + nf(r.L / 2 - r.xA) + ' + ' + exact(r.Ww) + R` \times ` + pn(zero(r.x - r.xA)) + '}{' + nf(r.xB - r.xA) + '} = ' + sigTie(r.NB) + NN,
      R`N_{A} = (M + m)g - N_{B} = ` + exact(r.Wr + r.Ww) + ' - ' + subArg(r.NB, r.NA, r.Wr + r.Ww) + ' = ' + sigTie(r.NA) + NN],
    n: R`モーメントの式から $N_{B}$ を求め、力のつり合いの式に代入して $N_{A}$ を求めます。` + subNote(r.NB, r.NA, r.Wr + r.Ww),
    easy: R`まず「回らない条件」の式を $N_{B}$ について解きます（右辺の数を、$x_{B} - x_{A}$ で割るだけです）。次に、「上下の力のつり合い」から、全体の重さ $(M+m)g$ から $N_{B}$ を引けば $N_{A}$ が出ます。`
  });

  // 検算: pivot で解いた別の支点のまわりのモーメントで確かめる
  const stMomCheck = (r, pivot) => (pivot === 'B' ? {
    t: '検算（支点 A のまわりのモーメント）',
    m: [R`N_{B}(x_{B} - x_{A}) = Mg\left(\frac{L}{2} - x_{A}\right) + mg\,(x - x_{A})`,
      R`\text{左辺} = ` + sigTie(zero(r.NB * (r.xB - r.xA))) + R`,\quad \text{右辺} = ` + sigTie(zero(r.Wr * (r.L / 2 - r.xA) + r.Ww * (r.x - r.xA)))],
    n: R`回転軸を A に取り直しても、左辺と右辺が一致します。軸の取り方によらず、つり合いが成り立っていることの確認です。`,
    lv: 2
  } : {
    t: '検算（支点 B のまわりのモーメント）',
    m: [R`N_{A}(x_{B} - x_{A}) = Mg\left(x_{B} - \frac{L}{2}\right) + mg\,(x_{B} - x)`,
      R`\text{左辺} = ` + sigTie(zero(r.NA * (r.xB - r.xA))) + R`,\quad \text{右辺} = ` + sigTie(zero(r.Wr * (r.xB - r.L / 2) + r.Ww * (r.xB - r.x)))],
    n: R`回転軸を B に取り直しても、左辺と右辺が一致します。軸の取り方によらず、つり合いが成り立っていることの確認です。`,
    lv: 2
  });

  function momentSteps(r) {
    return [stMomForces(r), stMomForce(r), stMomMoment(r, 'A'), stMomSolve(r, 'A'), stMomCheck(r, 'A')];
  }

  JK.registerSim({

    id: 'mech-moment',
    field: '力学',
    unit: 'p-rigid',
    title: '棒のつり合い（力のモーメント）',
    desc: R`長さ $L$・質量 $M$ の一様な棒を 2 つの支点 A, B で支え、位置 $x$ に質量 $m$ のおもりをつるします。力のつり合いと、支点のまわりの力のモーメントのつり合いから、各支点の抗力を求めます。`,
    form: [R`N_{A} + N_{B} = (M + m)g`, R`N_{B}(x_{B} - x_{A}) = Mg\left(\frac{L}{2} - x_{A}\right) + mg\,(x - x_{A})`],
    inputs: [
      { key: 'L', label: R`棒の長さ $L$`, unit: 'm', type: 'num', def: '4.0', min: 0.1, max: 100 },
      { key: 'M', label: R`棒の質量 $M$`, unit: 'kg', type: 'num', def: '2.0', min: 0.01, max: 1000 },
      { key: 'xA', label: R`支点 A の位置 $x_{A}$`, unit: 'm', type: 'num', def: '0.5', min: 0, max: 100, hint: '棒の左端からの距離' },
      { key: 'xB', label: R`支点 B の位置 $x_{B}$`, unit: 'm', type: 'num', def: '3.5', min: 0, max: 100, hint: '棒の左端からの距離（A より右）' },
      { key: 'm', label: R`おもりの質量 $m$`, unit: 'kg', type: 'num', def: '3.0', min: 0, max: 1000 },
      { key: 'x', label: R`おもりの位置 $x$`, unit: 'm', type: 'num', def: '1.0', min: 0, max: 100, hint: '棒の左端からの距離' }
    ],
    examples: [
      { label: '両端で支える', v: { L: '4.0', M: '2.0', xA: '0', xB: '4.0', m: '2.0', x: '1.0' } },
      { label: '支点が内側にある', v: { L: '4.0', M: '2.0', xA: '0.5', xB: '3.5', m: '3.0', x: '1.0' } },
      { label: '支点の外側におもり', v: { L: '6.0', M: '6.0', xA: '1.5', xB: '4.5', m: '3.0', x: '0' } }
    ],
    intro: {
      easy: R`長い棒の両端（または 2 か所）を支えて、真ん中あたりに重い物をぶら下げると、物をぶら下げた側の支点により大きな力がかかります。この「どちらの支点がどれだけ支えているか」を決めるのが**力のモーメント**です。力のモーメントは「力 × 回転軸からの距離」で、棒が回らない（水平のまま静止する）ためには、時計回りの効果と反時計回りの効果がつり合っている必要があります。力のつり合いの式と、このモーメントの式の 2 本で、2 つの支点の力が求まります。`,
      normal: R`力のつり合い $N_{A} + N_{B} = (M+m)g$ と、支点 A のまわりのモーメントのつり合い（$N_{A}$ は腕が 0 で式に現れない）を連立します。`,
      pro: R`軸は未知の力が通る点に取る。棒の重力は中点に作用。浮き上がる限界は「その支点の抗力が 0」で判定する。`
    },
    compute(v) {
      const { L, M, xA, xB, m, x } = v;
      if (!(xA < xB)) throw new JK.CalcError('支点 A は支点 B より左（xA < xB）に置いてください。');
      if (xB > L) throw new JK.CalcError('支点 B の位置 xB は、棒の長さ L 以下にしてください（棒の上に支点が必要です）。');
      if (x > L) throw new JK.CalcError('おもりの位置 x は、棒の長さ L 以下にしてください。');
      const r = solveMoment(L, M, xA, xB, m, x);
      if (r.NA < 0) throw new JK.CalcError('このままでは支点 A が棒を引き下げる力（負の抗力）が必要になり、棒は A から浮き上がって傾きます。おもりを A から遠ざけるか、質量を小さくしてください。');
      if (r.NB < 0) throw new JK.CalcError('このままでは支点 B が棒を引き下げる力（負の抗力）が必要になり、棒は B から浮き上がって傾きます。おもりを B から遠ざけるか、質量を小さくしてください。');
      return {
        result: [
          { label: '支点 A の抗力 N_A', tex: sig(r.NA) + NN },
          { label: '支点 B の抗力 N_B', tex: sig(r.NB) + NN },
          { label: '重力の合計 (M + m)g', tex: sig(r.Wr + r.Ww) + NN }
        ],
        steps: momentSteps(r),
        fig: momentFig(r, { forces: true })
      };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      if (level === 'basic') {
        const L = rng.pick([2.0, 4.0, 6.0]);
        const M = rng.pick([2.0, 4.0, 6.0]);
        const m = rng.pick([1.0, 2.0, 3.0]);
        const x = rng.pick([0.25, 0.75]) * L;
        const r = solveMoment(L, M, 0, L, m, x);
        return {
          title: '両端で支えた棒',
          body: R`長さ $` + L.toFixed(1) + MM + R`$、質量 $` + M.toFixed(1) + KG + R`$ の一様な棒を水平にし、両端 A, B を支えた。左端 A から $` + x.toFixed(2) + MM + R`$ の位置に、質量 $` + m.toFixed(1) + KG + R`$ のおもりを軽い糸でつるして、棒を静止させた。` + gtxt + R`次の問いに答えよ。`,
          fig: momentFig(r, { forces: false }),
          parts: [
            { label: '(1)', q: R`支点 B が棒をおし上げる力の大きさ $N_{B}$`, type: 'num', answer: P3(r.NB), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`支点 A が棒をおし上げる力の大きさ $N_{A}$`, type: 'num', answer: P3(r.NA), rel: 0.02, unit: 'N' }
          ],
          solution: [stMomForces(r), stMomForce(r), stMomMoment(r, 'A'), stMomSolve(r, 'A')]
        };
      }
      // mid / adv: 支点を内側に置く。mid はおもりが支点の間、adv はおもりが支点の外側
      for (let tries = 0; tries < 300; tries++) {
        const L = rng.pick([4.0, 5.0, 6.0]);
        const M = rng.pick([2.0, 4.0, 6.0]);
        const inset = rng.pick([0.5, 1.0]);
        const xA = inset, xB = L - inset;
        if (level === 'mid') {
          const m = rng.pick([1.0, 2.0, 3.0, 4.0]);
          const x = rng.pick([xA + 0.5, xA + 1.0, L / 2 + 0.5, xB - 0.5, xB - 1.0]);
          if (!(x > xA && x < xB)) continue;
          const r = solveMoment(L, M, xA, xB, m, x);
          if (r.NA < 0 || r.NB < 0) continue;
          return {
            title: '支点が内側にある棒',
            body: R`長さ $` + L.toFixed(1) + MM + R`$、質量 $` + M.toFixed(1) + KG + R`$ の一様な棒を水平にして、左端から $` + xA.toFixed(1) + MM + R`$ の点 A と、右端から $` + inset.toFixed(1) + MM + R`$ の点 B の 2 か所で支えた。左端から $` + x.toFixed(1) + MM + R`$ の位置に、質量 $` + m.toFixed(1) + KG + R`$ のおもりをつるして、棒を静止させた。` + gtxt + R`次の問いに答えよ。`,
            fig: momentFig(r, { forces: false }),
            parts: [
              { label: '(1)', q: R`支点 A が棒をおし上げる力の大きさ $N_{A}$`, type: 'num', answer: P3(r.NA), rel: 0.02, unit: 'N' },
              { label: '(2)', q: R`支点 B が棒をおし上げる力の大きさ $N_{B}$`, type: 'num', answer: P3(r.NB), rel: 0.02, unit: 'N' }
            ],
            solution: [stMomForces(r), stMomForce(r), stMomMoment(r, 'B'), stMomSolve(r, 'B'), stMomCheck(r, 'B')]
          };
        }
        // adv: おもりを A の外側（左端付近）につるす。棒が B から浮き上がる限界の質量も求める
        const x = rng.pick([0, inset / 2]);
        const m = rng.pick([1.0, 2.0, 3.0]);
        const mMax = M * (L / 2 - xA) / (xA - x);
        if (!(mMax > 1.3 * m)) continue;
        const r = solveMoment(L, M, xA, xB, m, x);
        if (r.NA < 0 || r.NB < 0) continue;
        return {
          title: '支点の外側におもりをつるした棒',
          body: R`長さ $` + L.toFixed(1) + MM + R`$、質量 $` + M.toFixed(1) + KG + R`$ の一様な棒を水平にして、左端から $` + xA.toFixed(1) + MM + R`$ の点 A と、右端から $` + inset.toFixed(1) + MM + R`$ の点 B の 2 か所で支えた。棒の左端から $` + x.toFixed(2) + MM + R`$ の位置（点 A より外側）に、質量 $` + m.toFixed(1) + KG + R`$ のおもりをつるして、棒を静止させた。` + gtxt + R`次の問いに答えよ。`,
          fig: momentFig(r, { forces: false }),
          parts: [
            { label: '(1)', q: R`支点 A が棒をおし上げる力の大きさ $N_{A}$`, type: 'num', answer: P3(r.NA), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`支点 B が棒をおし上げる力の大きさ $N_{B}$`, type: 'num', answer: P3(r.NB), rel: 0.02, unit: 'N' },
            { label: '(3)', q: R`おもりの質量をふやしていくと、棒は B から浮き上がる。同じ位置につるすことのできるおもりの質量の最大値 $m_{\max}$`, type: 'num', answer: P3(mMax), rel: 0.02, unit: 'kg' }
          ],
          solution: [
            stMomForces(r), stMomForce(r), stMomMoment(r, 'B'), stMomSolve(r, 'B'),
            {
              t: '棒が B から浮き上がる限界',
              m: [R`N_{B} = 0 \;\Rightarrow\; 0 = Mg\left(\frac{L}{2} - x_{A}\right) - m_{\max}g\,(x_{A} - x)`,
                R`m_{\max} = \frac{M\left(\frac{L}{2} - x_{A}\right)}{x_{A} - x} = \frac{` + nf(M) + R` \times ` + nf(L / 2 - xA) + '}{' + nf(xA - x) + '} = ' + sigTie(mMax) + KG],
              n: R`おもりが重くなると、棒は A を支点にして左側へ傾き、B が棒から離れます。離れる限界では B の抗力 $N_{B} = 0$ です。このとき A のまわりのモーメントのつり合いは、「棒の重力が棒を右へ回す効果」=「おもりが棒を左へ回す効果」になります。`,
              easy: R`おもりを重くしていくと、A より外側にぶら下げたおもりに引っ張られて、棒が A を軸にしてシーソーのように左に傾きはじめます。B が棒を支えられなくなる（B の力が 0 になる）ぎりぎりのときの重さが、つるせる最大の質量です。このとき、A のまわりでは「棒の重さ × 腕」と「おもりの重さ × 腕」だけがつり合っています。`
            }
          ]
        };
      }
      throw new Error('exercise generation failed');
    }
  });

  /* =====================================================================
     壁に立てかけた棒（はしご）
     ===================================================================== */
  // tanv: 問題文で与える tanθ の値（演習用。省略すると角度から計算する）
  function solveLadder(L, M, deg, mu, person, tanv) {
    const r = { L: L, M: M, deg: deg, mu: mu, th: rad(deg), person: person || null, tanGiven: !!tanv };
    r.s = Math.sin(r.th); r.c = Math.cos(r.th); r.tan = tanv || Math.tan(r.th);
    if (tanv) { r.c = 1 / Math.sqrt(1 + tanv * tanv); r.s = tanv * r.c; }      // 与えた tanθ に合わせた sinθ, cosθ（解説の式に出る値）
    const mp = person ? person.m : 0, sp = person ? person.s : 0;
    r.W = M * G;
    r.Wp = mp * G;
    r.N = r.W + r.Wp;                                      // 床の垂直抗力
    // A（下端）のまわり: Nw·L·sinθ = Mg·(L/2)cosθ + mg·s·cosθ  →  Nw = (Mg·L/2 + mg·s) / (L·tanθ)
    r.Nw = (r.W * (L / 2) + r.Wp * sp) / (L * r.tan);
    r.f = r.Nw;                                            // 水平方向のつり合い
    r.muMin = r.f / r.N;
    r.rest = mu >= r.muMin - 1e-12;
    return r;
  }

  function ladderFig(r, o) {
    o = o || {};
    const d = JK.plot.draw(360, 240);
    const fy = 208, wx = 300, th = r.th;
    const Lpx = Math.min(165 / Math.sin(th), 245 / Math.cos(th), 200);
    const ax = wx - Lpx * Math.cos(th), ay = fy;
    const bx = wx, by = fy - Lpx * Math.sin(th);
    d.hatch(14, fy, 346, fy);
    d.hatch(wx, 24, wx, fy, { side: -1 });
    d.line(ax, ay, bx, by, { cls: 'fg', w: 5 });
    d.dot(ax, ay, { cls: 'fg', r: 3 });
    d.dot(bx, by, { cls: 'fg', r: 3 });
    const gx = (ax + bx) / 2, gy = (ay + by) / 2;
    d.arc(ax, ay, 34, 0, r.deg, { cls: 'c3' });
    d.text(ax + 52 * Math.cos(th / 2), ay - 52 * Math.sin(th / 2) + 4, 'θ', { cls: 'c3', italic: true });
    d.text(wx + 24, 38, 'なめらか', { cls: 'dim', size: 10 });
    d.text(70, 230, 'あらい床', { cls: 'dim', size: 10 });
    // 人（おもり）
    let px = 0, py = 0;
    if (o.person) {
      const fr = o.person.s / r.L;
      px = ax + (bx - ax) * fr; py = ay + (by - ay) * fr;
      d.circle(px - 9 * Math.sin(th), py - 9 * Math.cos(th), 6, { cls: 'fg', fill: 'f3' });
    }
    if (o.forces) {
      const k = 56 / r.N;
      const len = (F) => Math.min(112, Math.max(16, F * k));
      d.arrow(gx, gy, gx, gy + len(r.W), { cls: 'c2', label: 'Mg', w: 2.2 });
      if (o.person) d.arrow(px, py, px, py + len(r.Wp), { cls: 'c3', label: 'mg', w: 2.2 });
      d.arrow(ax, ay, ax, ay - len(r.N), { cls: 'c1', label: 'N', w: 2.2 });
      d.arrow(ax, ay - 6, ax + len(r.f), ay - 6, { cls: 'c3', label: 'f', lpos: -1, w: 2.2 });
      d.arrow(bx, by, bx - len(r.Nw), by, { cls: 'c4', w: 2.2 });
      subText(d, bx - len(r.Nw) - 14, by - 6, 'N', 'w');
    } else if (o.person) {
      d.text(px + 24, py + 4, 'm', { size: 11, italic: true, anchor: 'start' });
    }
    d.text(150, 16, 'L = ' + U.fmt(r.L, 3) + ' m　M = ' + U.fmt(r.M, 3) + ' kg　θ = ' + U.fmt(r.deg, 3) + '°', { size: 12 });
    return d.svg();
  }

  const stLadForces = (r) => ({
    t: 'はしご（棒）にはたらく力を図に描く',
    n: R`はしごを一様な棒とみなして、長さを $L$、質量を $M$、床となす角を $\theta$` + (r.person ? R`、人の質量を $m$、はしごの下端から人までの距離を $s$` : '') + R` とします。はしごにはたらく力は、**重力 $Mg$**（重心＝中点に作用）、**壁からの抗力 $N_{w}$**（壁がなめらかなので、壁に垂直な水平方向だけ）、**床からの垂直抗力 $N$**（上向き）、**床からの静止摩擦力 $f$**（床があらいので、はしごが床をすべって倒れようとするのを止める向き = 壁に向かう水平な向き）の 4 つです。` + (r.person ? R`はしごの上の人の重力 $mg$ も下向きにはたらきます。` : ''),
    easy: R`はしごを壁に立てかけると、はしごは「床をすべって倒れよう」とします。それを止めているのが、床の摩擦力です。壁は「なめらか」なので、壁は垂直に押し返すだけ（上下にこする力はありません）。床は「あらい」ので、上に押す力（垂直抗力）と、横に止める力（摩擦力）の両方がはたらきます。力の向きを図にきちんと描くことが最初の一歩です。`,
    pro: R`壁がなめらか = 壁の抗力は壁に垂直。床の抗力は垂直抗力と摩擦力の 2 成分。未知数 $N, f, N_{w}$ の 3 つに対して、鉛直・水平・モーメントの 3 式。`
  });

  const stLadBalance = (r) => ({
    t: '力のつり合い（鉛直方向・水平方向）',
    m: [R`\text{鉛直: } N = Mg` + (r.person ? R` + mg` : '') + R` = ` + sigTie(r.N) + NN,
      R`\text{水平: } f = N_{w}`],
    n: R`鉛直方向は、上向きの $N$ と下向きの重力がつり合います（壁の抗力は水平なので入りません）。水平方向は、壁に向かう摩擦力 $f$ と、壁から離れる向きの抗力 $N_{w}$ がつり合います。`,
    easy: R`はしごが上下に動かないのは、床が上に押す力 $N$ が、はしごの重さ` + (r.person ? R`と人の重さ` : '') + R`の合計と等しいからです。左右に動かないのは、床の摩擦力 $f$（壁の向きに押す）と壁の抗力 $N_{w}$（壁から離れる向きに押す）が等しいからです。`
  });

  // 下端 A のまわりのモーメント。問題文で tanθ を与えた演習（r.tanGiven）は、両辺を cosθ で割って、与えられた tanθ だけで数値を入れる
  const stLadMoment = (r) => {
    const sym = r.person
      ? R`N_{w} \cdot L\sin\theta = Mg \cdot \frac{L}{2}\cos\theta + mg \cdot s\cos\theta`
      : R`N_{w} \cdot L\sin\theta = Mg \cdot \frac{L}{2}\cos\theta`;
    let lines;
    if (r.tanGiven) {
      lines = r.person
        ? [sym, R`\Rightarrow\; N_{w}\,L\tan\theta = Mg\,\frac{L}{2} + mg\,s`,
          R`N_{w} \times ` + nf(r.L) + R` \times ` + nf4(r.tan) + ' = ' + exact(r.W) + R` \times ` + nf(r.L / 2) + ' + ' + exact(r.Wp) + R` \times ` + nf(r.person.s)]
        : [sym, R`\Rightarrow\; N_{w}\,L\tan\theta = Mg\,\frac{L}{2}`,
          R`N_{w} \times ` + nf(r.L) + R` \times ` + nf4(r.tan) + ' = ' + exact(r.W) + R` \times ` + nf(r.L / 2)];
    } else {
      lines = r.person
        ? [sym, R`N_{w} \times ` + nf(r.L) + R` \times ` + nf4(r.s) + ' = ' + exact(r.W) + R` \times ` + nf(r.L / 2) + R` \times ` + nf4(r.c) + ' + ' + exact(r.Wp) + R` \times ` + nf(r.person.s) + R` \times ` + nf4(r.c)]
        : [sym, R`N_{w} \times ` + nf(r.L) + R` \times ` + nf4(r.s) + ' = ' + exact(r.W) + R` \times ` + nf(r.L / 2) + R` \times ` + nf4(r.c)];
    }
    return {
      t: '下端 A のまわりの力のモーメントのつり合い',
      m: lines,
      n: R`回転軸を下端 A に取ります。$N$ と $f$ は A に作用するので腕の長さが 0 で、式に現れません。回す効果は、$N_{w}$（腕 = A から B までの高さ $L\sin\theta$）と、重力（腕 = A から作用点までの水平距離）です。重力は棒の中点（水平距離 $\frac{L}{2}\cos\theta$）に` + (r.person ? R`、人の重力は A から距離 $s$ の位置（水平距離 $s\cos\theta$）に` : '') + R`作用します。` +
        (r.tanGiven ? R`$\tan\theta$ の値が与えられているので、両辺を $\cos\theta$ で割って $\frac{\sin\theta}{\cos\theta} = \tan\theta$ の形にしてから、数値を入れます。` : ''),
      easy: R`はしごが回って倒れないのは、「重さがはしごを倒そうとする回転」と「壁がはしごを押し返す回転」がつり合っているからです。床のあたり（A）を回転軸にすると、床からの力 $N, f$ は軸の位置にはたらくので、回す効果が 0 になって計算から消えます。腕の長さは、「軸から力の作用線までの垂直な距離」です。壁の力は水平なので腕は A から壁の接点までの**高さ** $L\sin\theta$、重力は鉛直なので腕は A から重心までの**水平距離** $\frac{L}{2}\cos\theta$ です。`,
      pro: R`軸は床の接点 A。$N, f$ を消去でき、$N_{w}$ が 1 式で出る。腕の長さは「高さ」と「水平距離」の使い分けに注意。`
    };
  };

  // 壁の抗力 N_w と摩擦力 f。数値は、問題で与えられた値（L, M, m, s, tanθ）をそのまま入れる
  const stLadSolve = (r) => ({
    t: '壁の抗力・摩擦力を求める',
    m: r.person
      ? [R`N_{w} = \frac{g\left(\frac{ML}{2} + ms\right)}{L\tan\theta}`,
        R`N_{w} = \frac{9.8 \times \left(` + nf(r.M) + R` \times ` + nf(r.L) + R` / 2 + ` + nf(r.person.m) + R` \times ` + nf(r.person.s) + R`\right)}{` + nf(r.L) + R` \times ` + nf4(r.tan) + '} = ' + sigTie(r.Nw) + NN,
        R`f = N_{w} = ` + sigTie(r.f) + NN]
      : [R`N_{w} = \frac{Mg\cos\theta}{2\sin\theta} = \frac{Mg}{2\tan\theta} = \frac{` + exact(r.W) + R`}{2 \times ` + nf4(r.tan) + '} = ' + sigTie(r.Nw) + NN, R`f = N_{w} = ` + sigTie(r.f) + NN],
    n: R`モーメントの式の両辺を $L\sin\theta$ で割って $N_{w}$ を求めます。` + (r.person ? '' : R`棒の長さ $L$ は約分で消えるので、はしごの長さには依りません。`) + R`水平方向のつり合いから、摩擦力 $f$ は $N_{w}$ と等しくなります。`,
    easy: R`モーメントの式を $N_{w}$ について解くと、壁の抗力が求まります。そして水平方向のつり合いから、床の摩擦力 $f$ も同じ大きさです。はしごが寝ている（$\theta$ が小さい）ほど $\tan\theta$ が小さくなり、壁の抗力も摩擦力も大きくなります。つまり、寝かせると床をすべりやすくなる、ということです。`
  });

  // すべらない最小の静止摩擦係数。f / N は、与えられた値だけで書く（人が乗るときは g が約分されて消える）
  const stLadMu = (r, given) => ({
    t: 'すべらないための静止摩擦係数',
    m: [R`f \le \mu N \;\Rightarrow\; \mu \ge \frac{f}{N}`,
      (r.person
        ? R`\mu_{\min} = \frac{f}{N} = \frac{\frac{ML}{2} + ms}{(M + m)L\tan\theta} = \frac{` + nf(r.M) + R` \times ` + nf(r.L) + R` / 2 + ` + nf(r.person.m) + R` \times ` + nf(r.person.s) + '}{(' + nf(r.M) + ' + ' + nf(r.person.m) + R`) \times ` + nf(r.L) + R` \times ` + nf4(r.tan) + '} = '
        : R`\mu_{\min} = \frac{f}{N} = \frac{1}{2\tan\theta} = \frac{1}{2 \times ` + nf4(r.tan) + '} = ') + sigTie(r.muMin)].concat(given ? [R`\mu = ` + nf(r.mu) + (r.rest ? R` \ge ` : R` < `) + sig(r.muMin) + R`\;\Rightarrow\; \text{` + (r.rest ? 'すべらない' : 'すべり落ちる') + R`}`] : []),
    n: R`床の摩擦力 $f$ は、最大静止摩擦力 $\mu N$ をこえられません。$f \le \mu N$ から、静止摩擦係数の最小値 $\mu_{\min}$ が求まります。` + (r.person ? R`$f = N_{w}$ と $N = (M + m)g$ を使うと、$g$ が約分されて消えます。` : '') + (given ? (r.rest ? R`与えられた $\mu$ は最小値以上なので、はしごは**すべりません**。` : R`与えられた $\mu$ は最小値より小さいので、はしごは**すべり落ちます**（上で求めた $N_{w}, f$ は、つり合いが保たれると仮定した値です）。`) : ''),
    easy: R`床の摩擦力には上限（最大静止摩擦力 $\mu N$）があります。はしごが倒れない（すべらない）ためには、必要な摩擦力 $f$ がその上限以下でなければなりません。$f \le \mu N$ を $\mu$ について整理すると、「床がこのくらいざらざらしていないとすべる」という最低ラインが出ます。`,
    pro: R`地面にすべらない条件: $\tan\theta \ge \frac{1}{2\mu}$（人が乗ると $\mu_{\min}$ は大きくなる）。`
  });

  function ladderSteps(r, given) {
    return [stLadForces(r), stLadBalance(r), stLadMoment(r), stLadSolve(r), stLadMu(r, given)];
  }

  JK.registerSim({

    id: 'mech-ladder',
    field: '力学',
    unit: 'p-rigid',
    title: '壁に立てかけた棒（はしご）',
    desc: R`なめらかな壁にもたせかけた、長さ $L$・質量 $M$ の一様な棒（はしご）が、あらい床の上で静止しています。壁からの抗力・床からの垂直抗力・静止摩擦力と、すべらないために必要な静止摩擦係数 $\mu \ge \frac{1}{2\tan\theta}$ を求めます。`,
    form: [R`N = Mg,\quad f = N_{w}`, R`N_{w}\,L\sin\theta = Mg\,\frac{L}{2}\cos\theta`, R`\mu \ge \frac{f}{N} = \frac{1}{2\tan\theta}`],
    inputs: [
      { key: 'L', label: R`棒の長さ $L$`, unit: 'm', type: 'num', def: '4.0', min: 0.1, max: 100 },
      { key: 'M', label: R`棒の質量 $M$`, unit: 'kg', type: 'num', def: '10', min: 0.01, max: 10000 },
      { key: 'deg', label: R`床となす角 $\theta$`, unit: '°', type: 'num', def: '60', min: 5, max: 89 },
      { key: 'mu', label: R`床との静止摩擦係数 $\mu$`, type: 'num', def: '0.40', min: 0, max: 10, hint: 'すべらないかどうかの判定に使います（壁はなめらか）' }
    ],
    examples: [
      { label: '60°（すべらない）', v: { L: '4.0', M: '10', deg: '60', mu: '0.40' } },
      { label: '45°（μ = 0.4 ではすべる）', v: { L: '5.0', M: '12', deg: '45', mu: '0.40' } },
      { label: '寝かせた（30°）', v: { L: '3.0', M: '8.0', deg: '30', mu: '1.0' } }
    ],
    intro: {
      easy: R`壁に立てかけたはしごは、ほうっておくと床をすべって倒れてしまいます。倒れないのは、**床の摩擦力**がはしごの下端を押さえてくれているからです。この問題の面白いところは、**回転を考える**ことです。はしごの下端のまわりで「回す効果」（力のモーメント）がつり合うと考えると、壁の力が一発で求まります。壁がなめらかなので、壁は垂直にしか押さない、という点がポイントです。`,
      normal: R`鉛直: $N = Mg$、水平: $f = N_{w}$、下端 A のまわりのモーメント: $N_{w}L\sin\theta = Mg\frac{L}{2}\cos\theta$。すべらない条件は $f \le \mu N$。`,
      pro: R`$N_{w} = f = \frac{Mg}{2\tan\theta}$、$\mu_{\min} = \frac{1}{2\tan\theta}$（長さと質量に依らない）。人が乗ると $f$ も $N$ も増え、$\mu_{\min}$ は上昇する。`
    },
    compute(v) {
      const r = solveLadder(v.L, v.M, v.deg, v.mu);
      return {
        result: [
          { label: '壁からの抗力 N_w', tex: sig(r.Nw) + NN },
          { label: '床からの垂直抗力 N', tex: sig(r.N) + NN },
          { label: '床の静止摩擦力 f（つり合いに必要な値）', tex: sig(r.f) + NN },
          { label: 'すべらない最小の静止摩擦係数 μ', tex: sig(r.muMin) },
          { label: '判定', tex: r.rest ? R`\text{すべらない}` : R`\text{すべり落ちる}` }
        ],
        steps: ladderSteps(r, true),
        fig: ladderFig(r, { forces: true })
      };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`;
      // 問題文で与える tanθ の値（答えも解説も、この値で計算する）
      const TAN3 = { 30: 0.577, 45: 1, 53: 1.33, 60: 1.73 };
      const tanNote = (deg) => R`$\tan ` + deg + R`\degree = ` + TAN3[deg] + R`$`;
      if (level === 'basic') {
        const deg = rng.pick([30, 45, 60]);
        const M = rng.pick([10, 15, 20, 25, 30, 40]);              // Mg が 3 けたで書き切れる質量（12 kg だと 117.6 N になる）
        const L = rng.pick([3.0, 4.0, 5.0]);
        const r = solveLadder(L, M, deg, 1, null, TAN3[deg]);
        const trig = tanNote(deg);
        return {
          title: '壁に立てかけたはしご',
          body: R`なめらかな鉛直の壁に、長さ $` + L.toFixed(1) + MM + R`$、質量 $` + M.toFixed(0) + KG + R`$ の一様なはしごを、あらい水平な床との角が $` + deg + R`\degree$ になるように立てかけたところ、はしごは静止した。` + gtxt + trig + R` として、次の問いに答えよ。`,
          fig: ladderFig(r, { forces: false }),
          parts: [
            { label: '(1)', q: R`床がはしごにおよぼす垂直抗力の大きさ $N$`, type: 'num', answer: P3(r.N), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`壁がはしごにおよぼす抗力の大きさ $N_{w}$`, type: 'num', answer: P3(r.Nw), rel: 0.02, unit: 'N' }
          ],
          solution: [stLadForces(r), stLadBalance(r), stLadMoment(r), stLadSolve(r)]
        };
      }
      if (level === 'mid') {
        const deg = rng.pick([45, 60, 53]);
        const M = rng.pick([10, 15, 20, 25, 30, 40]);
        const L = rng.pick([3.0, 4.0, 5.0]);
        const r = solveLadder(L, M, deg, 1, null, TAN3[deg]);
        const trig = tanNote(deg);
        return {
          title: 'はしごがすべらない条件',
          body: R`なめらかな鉛直の壁に、長さ $` + L.toFixed(1) + MM + R`$、質量 $` + M.toFixed(0) + KG + R`$ の一様なはしごを、あらい水平な床との角が $` + deg + R`\degree$ になるように立てかけたところ、はしごは静止した。` + gtxt + trig + R` として、次の問いに答えよ。`,
          fig: ladderFig(r, { forces: false }),
          parts: [
            { label: '(1)', q: R`壁がはしごにおよぼす抗力の大きさ $N_{w}$`, type: 'num', answer: P3(r.Nw), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`床がはしごにおよぼす静止摩擦力の大きさ $f$`, type: 'num', answer: P3(r.f), rel: 0.02, unit: 'N' },
            { label: '(3)', q: R`はしごがすべり落ちないために必要な、床とはしごの間の静止摩擦係数の最小値 $\mu_{\min}$`, type: 'num', answer: P3(r.muMin), rel: 0.02 }
          ],
          solution: ladderSteps(r, false)
        };
      }
      // adv: 人がはしごの途中まで上る
      for (let tries = 0; tries < 400; tries++) {
        const deg = rng.pick([45, 60]);
        const M = rng.pick([10, 15, 20]);
        const L = rng.pick([4.0, 5.0, 6.0]);
        const mp = rng.pick([50, 60, 70, 80]);
        const s = Math.round(rng.pick([0.3, 0.4, 0.5, 0.6, 0.7]) * L * 10) / 10;
        const mu = rng.pick([0.40, 0.45, 0.50, 0.55, 0.60]);
        const tanv = TAN3[deg];
        // s_max: μ N = f が成り立つ人の位置
        const sMax = (mu * (M + mp) * L * tanv - M * L / 2) / mp;
        if (!(sMax > 0.3 * L && sMax < 0.95 * L)) continue;
        if (!(s < sMax)) continue;                                 // 問題文は「静止した」なので、この位置ではすべらない（μ ≧ μ_min）出題だけにする
        const r = solveLadder(L, M, deg, mu, { m: mp, s: s }, tanv);
        const trig = tanNote(deg);
        return {
          title: '人がはしごを上る',
          body: R`なめらかな鉛直の壁に、長さ $` + L.toFixed(1) + MM + R`$、質量 $` + M.toFixed(0) + KG + R`$ の一様なはしごを、あらい水平な床との角が $` + deg + R`\degree$ になるように立てかけた。質量 $` + mp.toFixed(0) + KG + R`$ の人が、はしごの下端からはしごに沿って $` + s.toFixed(1) + MM + R`$ の位置まで上り、静止した。床とはしごの間の静止摩擦係数を $` + mu.toFixed(2) + R`$ とする。` + gtxt + trig + R` として、次の問いに答えよ。`,
          fig: ladderFig(r, { forces: false, person: { s: s } }),
          parts: [
            { label: '(1)', q: R`壁がはしごにおよぼす抗力の大きさ $N_{w}$`, type: 'num', answer: P3(r.Nw), rel: 0.02, unit: 'N' },
            { label: '(2)', q: R`はしごがすべり落ちないために必要な静止摩擦係数の最小値 $\mu_{\min}$（人がこの位置にいるとき）`, type: 'num', answer: P3(r.muMin), rel: 0.02 },
            { label: '(3)', q: R`はしごがすべり落ちることなく、人が下端からはしごに沿って上れる距離の最大値 $s_{\max}$`, type: 'num', answer: P3(sMax), rel: 0.02, unit: 'm' }
          ],
          solution: [
            stLadForces(r), stLadBalance(r), stLadMoment(r), stLadSolve(r),
            Object.assign(stLadMu(r, true), { t: 'すべらない最小の静止摩擦係数（人の位置が $s$ のとき）' }),
            {
              t: '人が上れる距離の最大値',
              m: [R`f = N_{w} = \frac{g\left(\frac{ML}{2} + ms\right)}{L\tan\theta} \le \mu N = \mu(M + m)g`,
                R`s \le \frac{\mu(M + m)L\tan\theta - \frac{ML}{2}}{m}`,
                R`s_{\max} = \frac{` + nf(mu) + R` \times ` + nf(M + mp) + R` \times ` + nf(L) + R` \times ` + nf(tanv) + ' - ' + nf(M * L / 2) + '}{' + nf(mp) + '} = ' + sigTie(sMax) + MM],
              n: R`人が高いところへ上るほど、人の重力のモーメントが増えて、必要な摩擦力 $f$ が大きくなります。$f$ が最大静止摩擦力 $\mu N$ に達する位置が限界で、それより上へ行くとはしごはすべり落ちます。`,
              easy: R`人が上へ行くほど、はしごを倒そうとする効果が大きくなり、床の摩擦力もそれに合わせて大きくなります。でも摩擦力には上限（$\mu N$）があります。必要な摩擦力がちょうど上限になる位置までが、すべらずに上れる限界です。`
            }
          ]
        };
      }
      throw new Error('exercise generation failed');
    }
  });
})();
