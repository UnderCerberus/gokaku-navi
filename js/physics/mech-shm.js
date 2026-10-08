/* 物理・力学 — 単振動（unit: p-shm）
   mech-spring-shm: ばね振り子（周期・最大の速さ・x–t グラフ。水平 / 鉛直）
   mech-pendulum: 単振り子（周期・最下点の速さ・θ–t グラフ） */
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
  // 表示の数値どうしの計算が結果と合わなくなる。桁の長い値（計算した途中の値など）は従来どおり小数 3 桁
  const nf = (x) => {
    if (typeof x !== 'number' || !isFinite(x)) return U.fmt(x, 3);
    const s = String(Number(x.toPrecision(10)));
    if (s.replace(/^-/, '').replace(/e[+-]?\d+$/, '').replace('.', '').replace(/^0+/, '').length > 6) return U.fmt(x, 3);
    const m = /^(-?[\d.]+)e([+-]?\d+)$/.exec(s);
    return m ? m[1] + R` \times 10^{` + Number(m[2]) + '}' : s;
  };
  // 有効数字 3 桁にしたとき、ちょうど四捨五入の境目（0.4325 など）になる値か
  const isTie3 = (x) => x !== 0 && /^\d\.\d\d50*e/.test(Math.abs(x).toExponential(11));
  // 数値代入の式の結果。境目の値は、丸める前の値も書く（0.4325 ≒ 0.433）。表示の値どうしの計算が、結果と最後の桁で 1 ずれて見えるのを防ぐ
  const exact4 = (x) => String(Number(x.toPrecision(4)));
  const sigTie = (x) => (isTie3(x) ? exact4(x) + R` \fallingdotseq ` + sig(x) : sig(x));
  const rad = (deg) => deg * PI / 180;
  const MS = R`\,\mathrm{m/s}`, MS2 = R`\,\mathrm{m/s^{2}}`, MM = R`\,\mathrm{m}`, NN = R`\,\mathrm{N}`, SEC = R`\,\mathrm{s}`, JJ = R`\,\mathrm{J}`, RADS = R`\,\mathrm{rad/s}`;
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
     ばね振り子
     ===================================================================== */
  // pi: 問題文で与える円周率（演習用。省略すると円周率そのもの）
  function solveSpring(dir, m, k, start, A0, v0, t, pi) {
    const r = { dir: dir, m: m, k: k, start: start, t: t, pi3: pi || null };
    r.w = Math.sqrt(k / m); r.T = 2 * (pi || PI) / r.w; r.f = 1 / r.T;
    if (start === 'rest') { r.A = A0; r.vmax = r.A * r.w; r.v0 = 0; }
    else { r.A = v0 / r.w; r.vmax = v0; r.v0 = v0; }
    r.amax = r.A * r.w * r.w;
    r.E = 0.5 * k * r.A * r.A;
    r.d = m * G / k;
    const ph = r.w * t;
    if (start === 'rest') { r.x = r.A * Math.cos(ph); r.v = -r.A * r.w * Math.sin(ph); }
    else { r.x = r.A * Math.sin(ph); r.v = r.A * r.w * Math.cos(ph); }
    r.a = -r.w * r.w * r.x;
    return r;
  }

  function springSchem(r, o) {
    o = o || {};
    const vert = r.dir === 'v';
    const H = vert ? 212 : 158;
    const d = JK.plot.draw(360, H);
    const bw = 46, bh = 34, disp = 56;
    if (!vert) {
      const fy = 112, xe = 150;
      d.hatch(24, fy - 76, 24, fy);
      d.hatch(24, fy, 344, fy);
      d.line(xe, 22, xe, fy + 2, { cls: 'dim', dash: true, w: 1 });
      d.text(xe, 16, 'つり合いの位置（x = 0）', { cls: 'dim', size: 10.5 });
      const xs = r.start === 'rest' ? xe + disp : xe;
      d.spring(24, fy - 18, xs, fy - 18, { n: 7, amp: 7, cls: 'fg' });
      d.rect(xs, fy - bh, bw, bh, { cls: 'fg', fill: 'f1', rx: 3 });
      d.text(xs + bw / 2, fy - 12, 'm', { size: 13, italic: true });
      d.rect(xe - disp, fy - bh, bw, bh, { cls: 'dim', dash: true, rx: 3 });
      if (r.start === 'rest') {
        d.arrow(xe, fy - bh - 10, xe + disp, fy - bh - 10, { cls: 'c3', w: 1.6 });
        d.arrow(xe + disp, fy - bh - 10, xe, fy - bh - 10, { cls: 'c3', w: 1.6 });
        d.text(xe + disp / 2, fy - bh - 16, 'A', { cls: 'c3', size: 12, italic: true });
      } else {
        d.arrow(xs + bw + 4, fy - bh / 2, xs + bw + 50, fy - bh / 2, { cls: 'c1', label: 'v₀', w: 2.2 });
        d.rect(xe + disp, fy - bh, bw, bh, { cls: 'dim', dash: true, rx: 3 });
      }
      d.text(xe + disp + bw / 2, fy + 19, '+A', { cls: 'dim', size: 11 });
      d.text(xe - disp + bw / 2, fy + 19, '−A', { cls: 'dim', size: 11 });
      d.text(180, 152, 'なめらかな水平面　k = ' + pl(r.k) + ' N/m　m = ' + pl(r.m) + ' kg', { cls: 'dim', size: 11 });
    } else {
      const cy0 = 14, xs = 150;
      const dEq = 74, dNat = 36;                                // 自然長・つり合いの位置の図上の長さ
      const yEq = cy0 + dEq + bh / 2 + 20, yNat = yEq - 28;
      d.hatch(xs - 56, cy0, xs + 56, cy0, { side: -1 });
      d.line(xs + bw / 2 + 18, yNat, 236, yNat, { cls: 'dim', dash: true, w: 1 });
      d.text(356, yNat + 4, '自然長の位置', { cls: 'dim', size: 10.5, anchor: 'end' });
      d.line(xs + bw / 2 + 18, yEq, 236, yEq, { cls: 'dim', dash: true, w: 1 });
      d.text(356, yEq + 4, 'つり合いの位置（x = 0）', { cls: 'dim', size: 10.5, anchor: 'end' });
      const yb = r.start === 'rest' ? yEq + 40 : yEq;           // 物体の中心の位置
      d.spring(xs, cy0, xs, yb - bh / 2, { n: 8, amp: 8, cls: 'fg' });
      d.rect(xs - bw / 2, yb - bh / 2, bw, bh, { cls: 'fg', fill: 'f1', rx: 3 });
      d.text(xs, yb + 5, 'm', { size: 13, italic: true });
      d.rect(xs - bw / 2, yEq - 40 - bh / 2, bw, bh, { cls: 'dim', dash: true, rx: 3 });
      if (r.start === 'rest') {
        d.arrow(xs + bw / 2 + 10, yEq, xs + bw / 2 + 10, yEq + 40, { cls: 'c3', w: 1.6 });
        d.arrow(xs + bw / 2 + 10, yEq + 40, xs + bw / 2 + 10, yEq, { cls: 'c3', w: 1.6 });
        d.text(xs + bw / 2 + 20, yEq + 24, 'A', { cls: 'c3', size: 12, italic: true, anchor: 'start' });
      } else {
        d.arrow(xs - bw / 2 - 14, yEq - 6, xs - bw / 2 - 14, yEq + 34, { cls: 'c1', label: 'v₀', lpos: -1, w: 2.2 });
        d.rect(xs - bw / 2, yEq + 40 - bh / 2, bw, bh, { cls: 'dim', dash: true, rx: 3 });
      }
      d.arrow(xs - bw / 2 - 40, yNat, xs - bw / 2 - 40, yEq, { cls: 'c4', w: 1.4 });
      d.arrow(xs - bw / 2 - 40, yEq, xs - bw / 2 - 40, yNat, { cls: 'c4', w: 1.4 });
      d.text(xs - bw / 2 - 46, (yNat + yEq) / 2 + 4, 'd = mg/k', { cls: 'c4', size: 11, anchor: 'end' });
      d.text(180, 204, '鉛直につるす　k = ' + pl(r.k) + ' N/m　m = ' + pl(r.m) + ' kg', { cls: 'dim', size: 11 });
    }
    return { svg: d.svg(), h: H };
  }

  function xtGraph(r, o) {
    o = o || {};
    const A = r.A;
    const ph = r.start === 'rest' ? (t) => r.A * Math.cos(r.w * t) : (t) => r.A * Math.sin(r.w * t);
    const g = {
      w: 340, h: 176, x: [0, r.T * 2.08], y: [-1.45 * A, 1.45 * A],
      axis: ['t [s]', 'x [m]'],
      curves: [{ f: ph, cls: 'c1', domain: [0, r.T * 2.08] }],
      hlines: [{ y: A, label: 'A = ' + pl(A) + ' m', dash: true }, { y: -A, label: '−A', dash: true }],
      vlines: [{ x: r.T, label: 'T = ' + pl(r.T) + ' s', dash: true }, { x: 2 * r.T, label: '', dash: true }],
      points: [], labels: []
    };
    if (r.t > 0 && r.t <= r.T * 2.08) g.points.push({ x: r.t, y: ph(r.t), label: 't = ' + pl(r.t) + ' s', cls: 'c3', pos: ph(r.t) >= 0 ? 'tr' : 'br' });
    return JK.plot.graph(g);
  }

  function springFig(r) {
    const s = springSchem(r);
    return stack([{ svg: s.svg, h: s.h }, { svg: xtGraph(r), h: 176 }], 360);
  }

  // 2π（円周率を問題文で与えた値にするときは、その値を掛ける形）と、その逆数
  const twoPi = (r) => (r.pi3 ? R`2 \times ` + r.pi3 + R` \times ` : R`2\pi`);
  const oneOver2Pi = (r) => (r.pi3 ? R`\frac{1}{2 \times ` + r.pi3 + '}' : R`\frac{1}{2\pi}`);
  const piNote = (r) => (r.pi3 ? R`円周率は、問題文で与えられた $\pi = ` + r.pi3 + R`$ を使います。` : '');
  // √(k/m)、√(m/k)（数値は問題で与えられた値をそのまま入れる）
  const sqrtKM = (r) => R`\sqrt{\frac{` + nf(r.k) + '}{' + nf(r.m) + '}}';
  const sqrtMK = (r) => R`\sqrt{\frac{` + nf(r.m) + '}{' + nf(r.k) + '}}';

  const stSprEOM = (r) => {
    const vert = r.dir === 'v';
    return {
      t: '復元力と運動方程式（単振動になる理由）',
      m: vert
        ? [R`ma = mg - k(d + x) = -kx\quad (\because kd = mg)`, R`a = -\frac{k}{m}x`]
        : [R`F = -kx`, R`ma = -kx \;\Rightarrow\; a = -\frac{k}{m}x`],
      n: (vert
        ? R`つり合いの位置を原点、下向きを正として、そこからの変位を $x$ とします。つり合いの位置では $mg = kd$（$d$: 自然長からの伸び）です。変位 $x$ のとき、弾性力は $k(d+x)$（上向き）、重力は $mg$（下向き）なので、重力の分が打ち消されて、合力は $-kx$ だけが残ります。`
        : R`自然長の位置（つり合いの位置）を原点にして、ばねののびを $x$ とします。ばねの弾性力は、のびに比例し、向きは変位と逆向きなので $F = -kx$ です。`) +
        R`変位に比例して逆向きにはたらく力（**復元力**）による運動を**単振動**といい、加速度は $a = -\omega^{2}x$ の形になります。`,
      easy: R`ばねにつないだ物体を引いて放すと、ばねは物体を「もとの位置にもどそう」と引きます。引き伸ばした分（$x$）が大きいほど、引きもどす力は強く、$F = -kx$（マイナスは向きが逆であることを表します）です。この力で運動方程式 $ma = F$ を立てると $a = -\frac{k}{m}x$ となり、加速度が「位置に比例して、向きが逆」になります。この形の運動が**単振動**で、往復をくり返します。` +
        (vert ? R`鉛直につるした場合、重力もはたらきますが、つり合いの位置を基準にすると、重力の影響が消えて、水平の場合と同じ式になります。` : ''),
      pro: R`$a = -\omega^{2}x$ の形になれば単振動。$\omega^{2}$ が係数として読み取れる（$\omega^{2} = k/m$）。` + (vert ? R`鉛直ばねは「つり合いの位置を原点にとる」と重力が消える。` : '')
    };
  };

  // 角振動数と周期。o.noF: 振動数 f を省く（演習）。数値は、問題で与えられた k, m をそのまま代入する
  const stSprOmegaT = (r, o) => {
    const vert = r.dir === 'v';
    const lines = [
      R`a = -\omega^{2}x \;\Rightarrow\; \omega = \sqrt{\frac{k}{m}} = ` + sqrtKM(r) + ' = ' + sigTie(r.w) + RADS,
      R`T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{m}{k}} = ` + twoPi(r) + sqrtMK(r) + ' = ' + sigTie(r.T) + SEC
    ];
    if (!(o && o.noF)) lines.push(R`f = \frac{1}{T} = \frac{1}{2\pi}\sqrt{\frac{k}{m}} = ` + oneOver2Pi(r) + sqrtKM(r) + ' = ' + sigTie(r.f) + R`\,\mathrm{Hz}`);
    return {
      t: '角振動数と周期',
      m: lines,
      n: R`運動方程式 $ma = -kx$ を $a = -\omega^{2}x$ と見比べて、$\omega^{2} = \frac{k}{m}$ です。周期は $T = \frac{2\pi}{\omega}$ で、**振幅によりません**（等時性）。質量が大きいほど（重いほど）、ばねが硬いほど（$k$ が大きいほど）、周期は短く（速く）なります。` + (vert ? R`周期は重力加速度 $g$ にもよりません。` : '') + piNote(r),
      easy: R`単振動は、等速円運動を真横から見たときの、影の動きと同じです。円運動の「角速度」にあたるのが**角振動数** $\omega$ で、1 往復（周期 $T$）で位相が $2\pi$ 進むので $T = \frac{2\pi}{\omega}$ です。運動方程式から $a = -\frac{k}{m}x$ と分かるので、$\omega^{2} = \frac{k}{m}$ と読み取れます。つまり、ばね定数 $k$ と質量 $m$ だけで、往復の速さが決まります。大きく振れても小さく振れても、1 往復の時間は同じです。`,
      pro: R`$T = 2\pi\sqrt{m/k}$（$m$ が 4 倍で $T$ は 2 倍）。振幅・重力加速度に依らない。`
    };
  };

  // 時刻 t での位置・速度（計算機のみ）
  const stSprXV = (r) => ({
    t: '振幅と、時刻 $t$ での位置・速度',
    m: r.start === 'rest'
      ? [R`x = A\cos\omega t,\qquad v = -A\omega\sin\omega t`,
        R`t = ` + nf(r.t) + R`\,\mathrm{s}:\ x = ` + sigTie(r.x) + MM + R`,\ \ v = ` + sigTie(r.v) + MS + R`,\ \ a = -\omega^{2}x = ` + sigTie(r.a) + MS2]
      : [R`x = A\sin\omega t,\qquad v = A\omega\cos\omega t`,
        R`A = \frac{v_{0}}{\omega} = v_{0}\sqrt{\frac{m}{k}} = ` + nf(r.v0) + R` \times ` + sqrtMK(r) + ' = ' + sigTie(r.A) + MM,
        R`t = ` + nf(r.t) + R`\,\mathrm{s}:\ x = ` + sigTie(r.x) + MM + R`,\ \ v = ` + sigTie(r.v) + MS + R`,\ \ a = -\omega^{2}x = ` + sigTie(r.a) + MS2],
    n: (r.start === 'rest'
      ? R`$t = 0$ で端（$x = A$）にあって、静止している（$v = 0$）ので、$x = A\cos\omega t$ と表せます。振幅 $A$ は、放した位置の、つり合いの位置からの距離です。`
      : R`$t = 0$ でつり合いの位置（$x = 0$）を、速さ $v_{0}$ で通過しているので、$x = A\sin\omega t$ と表せ、最大の速さ $v_{0} = A\omega$ から振幅 $A = \frac{v_{0}}{\omega}$ が決まります。`) +
      R`（向きは、正の向きを正とした符号つきの値です。）`,
    easy: R`単振動の位置は、$\cos$ や $\sin$ の波の形になります。「端で放した」（そこで止まっている）なら、最初が一番大きい $\cos$ の形、「真ん中を通過する」なら、最初が 0 の $\sin$ の形です。$\omega t$ の部分は、円運動の「回った角度」にあたります。いまの時刻 $t$ を代入すれば、そのときの位置・速度・加速度が出ます。`,
    lv: 2
  });

  // 最大の速さ（と最大の加速度）。o.ex: 演習（最大の加速度を省く）。数値は問題で与えられた値（A, k, m）をそのまま代入する
  const stSprVmax = (r, o) => {
    const ex = !!(o && o.ex), rest = r.start === 'rest';
    const lines = [rest
      ? R`v_{\max} = A\omega = A\sqrt{\frac{k}{m}} = ` + nf(r.A) + R` \times ` + sqrtKM(r) + ' = ' + sigTie(r.vmax) + MS + R`\quad (x = 0\ \text{のとき})`
      : R`v_{\max} = v_{0} = ` + nf(r.v0) + MS + R`\quad (x = 0\ \text{のとき})`];
    if (!ex) {
      lines.push(rest
        ? R`a_{\max} = A\omega^{2} = A\,\frac{k}{m} = ` + nf(r.A) + R` \times \frac{` + nf(r.k) + '}{' + nf(r.m) + '} = ' + sigTie(r.amax) + MS2 + R`\quad (x = \pm A\ \text{のとき})`
        : R`a_{\max} = A\omega^{2} = v_{0}\omega = v_{0}\sqrt{\frac{k}{m}} = ` + nf(r.v0) + R` \times ` + sqrtKM(r) + ' = ' + sigTie(r.amax) + MS2 + R`\quad (x = \pm A\ \text{のとき})`);
    }
    return {
      t: ex ? '最大の速さ' : '最大の速さ・最大の加速度',
      m: lines,
      n: ex
        ? R`振幅 $A = ` + nf(r.A) + R`\,\mathrm{m}$ は、放した位置の、つり合いの位置からの距離です。速さが最大になるのは、つり合いの位置（$x = 0$）を通るときで、$v_{\max} = A\omega$ です（両端では速さは 0）。`
        : R`速さが最大になるのは、つり合いの位置（$x = 0$）を通るときで、$v_{\max} = A\omega$。加速度の大きさが最大になるのは、両端（$x = \pm A$）で、$a_{\max} = A\omega^{2} = \frac{kA}{m}$ です（このとき速さは 0）。`,
      easy: R`振り子を想像してください。真ん中を通るときが一番速く、両端では一瞬止まります。ところが、力（= 加速度）は逆で、両端で一番大きく（ばねが一番のびている、または縮んでいる）、真ん中では 0 です。ですから、速さが最大のときは加速度 0、加速度が最大のときは速さ 0 になります。`,
      pro: R`$v_{\max} = A\omega$、$a_{\max} = A\omega^{2}$。「中心で速さ最大・加速度 0、端で速さ 0・加速度最大」。`
    };
  };

  // エネルギー保存での確認（lv 2）
  const stSprEnergy = (r) => {
    const vert = r.dir === 'v', rest = r.start === 'rest';
    return {
      t: 'エネルギー保存での確認',
      m: rest
        ? [R`\frac{1}{2}kA^{2} = \frac{1}{2}mv_{\max}^{2} \;\Rightarrow\; v_{\max} = \sqrt{\frac{kA^{2}}{m}} = A\sqrt{\frac{k}{m}}`,
          R`v_{\max} = \sqrt{\frac{` + nf(r.k) + R` \times ` + nf(r.A) + R`^{2}}{` + nf(r.m) + R`}} = ` + sigTie(r.vmax) + MS,
          R`E = \frac{1}{2}kA^{2} = \frac{1}{2} \times ` + nf(r.k) + R` \times ` + nf(r.A) + R`^{2} = ` + sigTie(r.E) + JJ]
        : [R`\frac{1}{2}kA^{2} = \frac{1}{2}mv_{\max}^{2} \;\Rightarrow\; v_{\max} = A\sqrt{\frac{k}{m}}`,
          R`E = \frac{1}{2}mv_{\max}^{2} = \frac{1}{2} \times ` + nf(r.m) + R` \times ` + nf(r.v0) + R`^{2} = ` + sigTie(r.E) + JJ],
      n: R`端では速さ 0 で、ばねの弾性エネルギー $\frac{1}{2}kA^{2}$ だけ、中心では $x = 0$ で運動エネルギー $\frac{1}{2}mv_{\max}^{2}$ だけです。力学的エネルギーが保存されるので、両者は等しく、$v_{\max} = A\sqrt{k/m} = A\omega$ となって、上の結果と一致します。` + (vert ? R`（鉛直の場合は、つり合いの位置を基準にして、弾性エネルギーと重力の位置エネルギーの和を $\frac{1}{2}kx^{2}$ の形にまとめられます。）` : ''),
      easy: R`エネルギーの面から確かめます。端では物体が止まっていて、ばねに $\frac{1}{2}kA^{2}$ のエネルギーがたくわえられています。真ん中では、ばねは自然長（またはつり合い）で、そのエネルギーがすべて運動エネルギーに変わっています。この 2 つを等しいとおくと、先ほどと同じ最大の速さが出ます。`,
      lv: 2
    };
  };

  // つり合いの位置（鉛直）。lv: 計算機では 2、演習では 1（d を問うので）
  const stSprBalance = (r, lv) => ({
    t: 'つり合いの位置（鉛直の場合）',
    m: [R`kd = mg \;\Rightarrow\; d = \frac{mg}{k} = \frac{` + nf(r.m) + R` \times 9.8}{` + nf(r.k) + '} = ' + sigTie(r.d) + MM],
    n: R`ばねをつるしておもりを静かにつり下げると、自然長から $d = \frac{mg}{k}$ だけのびた位置でつり合います。この位置が単振動の中心で、おもりはここを中心に、上下に振幅 $A$ で振動します。自然長からの最大ののびは $d + A$、最小は $d - A$ です。`,
    easy: R`おもりを手で支えながら、静かにぶら下げていくと、ばねののびが $d$ のところで、重力 $mg$ と弾性力 $kd$ がつり合って止まります。この場所が振動の中心です。ここからさらに $A$ だけ下に引いて放すと、中心を挟んで上下に往復運動をします。`,
    lv: lv
  });

  // x = A/2 のときの速さ（演習）。sq3: 問題文で与える √3 の値
  const stSprHalf = (r, sq3, vh) => ({
    t: R`$x = \frac{A}{2}$ のときの速さ`,
    m: [R`v = \omega\sqrt{A^{2} - x^{2}},\qquad x = \frac{A}{2}`,
      R`v = \omega\sqrt{A^{2} - \frac{A^{2}}{4}} = \frac{\sqrt{3}}{2}A\omega = \frac{\sqrt{3}}{2}A\sqrt{\frac{k}{m}}`,
      R`v = \frac{` + sq3 + R`}{2} \times ` + nf(r.A) + R` \times ` + sqrtKM(r) + ' = ' + sigTie(vh) + MS],
    n: R`問題の「ばねののびが $` + nf(r.A / 2) + R`\,\mathrm{m}$」は、振幅 $A = ` + nf(r.A) + R`\,\mathrm{m}$ のちょうど半分（$x = \frac{A}{2}$）にあたります。エネルギー保存 $\frac{1}{2}kA^{2} = \frac{1}{2}mv^{2} + \frac{1}{2}kx^{2}$ から $v^{2} = \frac{k}{m}(A^{2} - x^{2}) = \omega^{2}(A^{2} - x^{2})$ です。$x = \frac{A}{2}$ のとき、$v = \frac{\sqrt{3}}{2}A\omega = \frac{\sqrt{3}}{2}v_{\max}$ となり、最大の速さの約 0.87 倍です。問題文で与えられた $\sqrt{3} = ` + sq3 + R`$ を使います。`,
    easy: R`端と真ん中の間の位置では、エネルギーの一部がばね（$\frac{1}{2}kx^{2}$）に残り、残りが運動エネルギーになっています。この関係から、位置 $x$ での速さが $v = \omega\sqrt{A^{2} - x^{2}}$ と分かります。$x = 0$ なら最大の速さ $A\omega$、$x = \pm A$ なら 0 になる式です。`
  });

  function springSteps(r) {
    const steps = [stSprEOM(r), stSprOmegaT(r), stSprXV(r), stSprVmax(r), stSprEnergy(r)];
    if (r.dir === 'v') steps.push(stSprBalance(r, 2));
    return steps;
  }

  JK.registerSim({
    id: 'mech-spring-shm',
    field: '力学',
    unit: 'p-shm',
    title: 'ばね振り子（周期・最大の速さ・x–t グラフ）',
    desc: R`ばね定数 $k$ のばねにつないだ質量 $m$ の物体の単振動（水平 / 鉛直）です。角振動数・周期・最大の速さ・最大の加速度・力学的エネルギーと、時刻 $t$ での位置・速度を求め、x–t グラフに描きます。`,
    form: [R`ma = -kx \;\Rightarrow\; a = -\omega^{2}x,\quad \omega = \sqrt{\frac{k}{m}}`, R`T = 2\pi\sqrt{\frac{m}{k}}`, R`v_{\max} = A\omega,\quad a_{\max} = A\omega^{2},\quad E = \frac{1}{2}kA^{2}`],
    inputs: [
      { key: 'dir', label: 'ばねの向き', type: 'select', def: 'h', options: [['h', '水平（なめらかな床）'], ['v', '鉛直（おもりをつるす）']] },
      { key: 'm', label: 'おもりの質量 m', unit: 'kg', type: 'num', def: '0.50', min: 0.001, max: 1000 },
      { key: 'k', label: 'ばね定数 k', unit: 'N/m', type: 'num', def: '50', min: 0.01, max: 1000000 },
      { key: 'start', label: 'はじめの与え方', type: 'select', def: 'rest', options: [['rest', '振幅 A だけ引いて静かに放す'], ['speed', 'つり合いの位置を速さ v₀ で通過させる']] },
      { key: 'A', label: '振幅 A', unit: 'm', type: 'num', def: '0.10', min: 0.0001, max: 100, show: (raw) => raw.start !== 'speed' },
      { key: 'v0', label: 'つり合いの位置での速さ v₀', unit: 'm/s', type: 'num', def: '1.0', min: 0.0001, max: 1000, show: (raw) => raw.start === 'speed' },
      { key: 't', label: '調べる時刻 t', unit: 's', type: 'num', def: '0.20', min: 0, max: 100000, hint: '放した（通過した）時刻を t = 0 とします' }
    ],
    examples: [
      { label: '水平ばね（端で放す）', v: { dir: 'h', m: '0.50', k: '50', start: 'rest', A: '0.10', v0: '1.0', t: '0.20' } },
      { label: '中心を通過する（v₀ 指定）', v: { dir: 'h', m: '2.0', k: '200', start: 'speed', A: '0.10', v0: '1.5', t: '0.30' } },
      { label: '鉛直につるしたばね', v: { dir: 'v', m: '0.20', k: '20', start: 'rest', A: '0.05', v0: '1.0', t: '0.10' } }
    ],
    intro: {
      easy: R`ばねにつないだ物体を引いて放すと、行ったり来たりの往復運動をします。これを**単振動**といいます。ばねは、伸びた（縮んだ）分に比例して、もとにもどそうとする力（**復元力** $F = -kx$）をはたらかせます。この力で運動方程式を立てると、加速度が「位置に比例して逆向き」$a = -\frac{k}{m}x$ になり、その係数から**角振動数** $\omega = \sqrt{\frac{k}{m}}$ と**周期** $T = 2\pi\sqrt{\frac{m}{k}}$ が分かります。周期は、振れの大きさ（振幅）によりません。真ん中で一番速く、両端では速さが 0 になります。`,
      normal: R`$a = -\omega^{2}x$（$\omega = \sqrt{k/m}$）、$T = 2\pi\sqrt{m/k}$、$v_{\max} = A\omega$（$x = 0$）、$a_{\max} = A\omega^{2}$（$x = \pm A$）、$E = \frac{1}{2}kA^{2}$。`,
      pro: R`単振動は「$a = -\omega^{2}x$ と書ける運動」。ばね振り子の $\omega$ は運動方程式の係数から読み取る。鉛直ばねは、つり合いの位置を原点にすれば水平と同じ式（周期も同じ）。任意の位置の速さは $v = \omega\sqrt{A^{2} - x^{2}}$。`
    },
    compute(v) {
      const r = solveSpring(v.dir, v.m, v.k, v.start, v.A, v.v0, v.t);
      const res = [
        { label: '角振動数 ω', tex: sig(r.w) + RADS },
        { label: '周期 T', tex: sig(r.T) + SEC },
        { label: '振動数 f', tex: sig(r.f) + R`\,\mathrm{Hz}` },
        { label: '振幅 A', tex: sig(r.A) + MM },
        { label: '最大の速さ v_max', tex: sig(r.vmax) + MS },
        { label: '最大の加速度の大きさ a_max', tex: sig(r.amax) + MS2 },
        { label: '力学的エネルギー E = ½kA²', tex: sig(r.E) + JJ },
        { label: '時刻 t での位置 x', tex: sig(r.x) + MM },
        { label: '時刻 t での速度 v', tex: sig(r.v) + MS }
      ];
      if (r.dir === 'v') res.push({ label: 'つり合いの位置での、自然長からののび d = mg/k', tex: sig(r.d) + MM });
      return { result: res, steps: springSteps(r), fig: springFig(r) };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$、円周率を $\pi = 3.14$ とする。`;
      const tol = { rel: 0.02 };
      const PI3 = 3.14;                                            // 問題文で与える円周率。答えも解説も、この値で計算する
      const m = rng.pick([0.50, 1.0, 2.0, 4.0]);
      const k = rng.pick([50, 100, 200, 400, 800]);
      const A = rng.pick([0.05, 0.10, 0.20]);
      if (level === 'basic') {
        const r = solveSpring('h', m, k, 'rest', A, 0, 0, PI3);
        return {
          title: 'ばね振り子の周期と最大の速さ',
          body: R`なめらかな水平面上で、ばね定数 $` + k.toFixed(0) + R`\,\mathrm{N/m}$ の軽いばねの一端を壁に固定し、他端に質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ の物体をつけた。ばねを自然長から $` + A.toFixed(2) + R`\,\mathrm{m}$ のばして、静かに放したところ、物体は単振動をした。円周率を $\pi = 3.14$ として、次の問いに答えよ。`,
          fig: springSchem(r).svg,
          parts: [
            { label: '(1)', q: R`単振動の周期 $T$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 's' },
            { label: '(2)', q: R`物体の最大の速さ $v_{\max}$`, type: 'num', answer: P3(r.vmax), rel: tol.rel, unit: 'm/s' }
          ],
          solution: [stSprEOM(r), stSprOmegaT(r, { noF: true }), stSprVmax(r, { ex: true }), stSprEnergy(r)]
        };
      }
      if (level === 'mid') {
        const r = solveSpring('h', m, k, 'rest', A, 0, 0, PI3);
        const SQ3 = 1.73;                                          // 問題文で与える √3
        const vh = SQ3 / 2 * A * r.w;                              // x = A/2 のとき v = (√3/2) Aω
        return {
          title: 'ばね振り子の周期・最大の速さ・途中の速さ',
          body: R`なめらかな水平面上で、ばね定数 $` + k.toFixed(0) + R`\,\mathrm{N/m}$ の軽いばねの一端を壁に固定し、他端に質量 $` + m.toFixed(2) + R`\,\mathrm{kg}$ の物体をつけた。ばねを自然長から $` + A.toFixed(2) + R`\,\mathrm{m}$ 引きのばして、静かに放したところ、物体は単振動をした。` + R`円周率を $\pi = 3.14$ とし、$\sqrt{3} = 1.73$ として、次の問いに答えよ。`,
          fig: springSchem(r).svg,
          parts: [
            { label: '(1)', q: R`単振動の周期 $T$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 's' },
            { label: '(2)', q: R`物体の最大の速さ $v_{\max}$`, type: 'num', answer: P3(r.vmax), rel: tol.rel, unit: 'm/s' },
            { label: '(3)', q: R`ばねののびが $` + (A / 2).toFixed(3) + R`\,\mathrm{m}$ のときの物体の速さ $v$`, type: 'num', answer: P3(vh), rel: tol.rel, unit: 'm/s' }
          ],
          solution: [stSprEOM(r), stSprOmegaT(r, { noF: true }), stSprVmax(r, { ex: true }), stSprEnergy(r), stSprHalf(r, SQ3, vh)]
        };
      }
      // adv: 鉛直ばね
      const mv = rng.pick([0.20, 0.50, 1.0]);
      const kv = rng.pick([20, 50, 100, 200]);
      const Av = rng.pick([0.03, 0.05, 0.10]);
      const r = solveSpring('v', mv, kv, 'rest', Av, 0, 0, PI3);
      return {
        title: '鉛直につるしたばねの単振動',
        body: R`天井からつるした、ばね定数 $` + kv.toFixed(0) + R`\,\mathrm{N/m}$ の軽いばねの下端に、質量 $` + mv.toFixed(2) + R`\,\mathrm{kg}$ のおもりをつけ、静かに手をはなして、つり合いの位置で静止させた。つぎに、おもりをつり合いの位置から $` + Av.toFixed(2) + R`\,\mathrm{m}$ だけ下に引いて、静かに放したところ、おもりは鉛直方向に単振動をした。` + gtxt + R`次の問いに答えよ。`,
        fig: springSchem(r).svg,
        parts: [
          { label: '(1)', q: R`つり合いの位置での、ばねの自然長からののび $d$`, type: 'num', answer: P3(r.d), rel: tol.rel, unit: 'm' },
          { label: '(2)', q: R`単振動の周期 $T$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 's' },
          { label: '(3)', q: R`おもりの最大の速さ $v_{\max}$`, type: 'num', answer: P3(r.vmax), rel: tol.rel, unit: 'm/s' }
        ],
        solution: [stSprBalance(r, 1), stSprEOM(r), stSprOmegaT(r, { noF: true }), stSprVmax(r, { ex: true }), stSprEnergy(r)]
      };
    }
  });

  /* =====================================================================
     単振り子
     ===================================================================== */
  function agm(a, b) {
    for (let i = 0; i < 40; i++) { const an = (a + b) / 2, bn = Math.sqrt(a * b); a = an; b = bn; }
    return a;
  }
  // pi: 問題文で与える円周率（演習用。省略すると円周率そのもの）
  function solvePend(L, th0Deg, g, pi) {
    const th0 = rad(th0Deg);
    const r = { L: L, th0Deg: th0Deg, th0: th0, g: g, pi3: pi || null };
    r.w = Math.sqrt(g / L); r.T = 2 * (pi || PI) / r.w; r.f = 1 / r.T;
    r.A = L * th0;                                      // 弧の長さでの振幅
    r.vApprox = r.A * r.w;
    r.vExact = Math.sqrt(2 * g * L * (1 - Math.cos(th0)));
    r.Texact = r.T / agm(1, Math.cos(th0 / 2));
    return r;
  }

  function pendSchem(r, o) {
    o = o || {};
    const H = 224;
    const d = JK.plot.draw(360, H);
    const px = 180, py = 38, Ls = 126;
    const th = r.th0, thd = r.th0Deg;
    const lx = px - Ls * Math.sin(th), ly = py + Ls * Math.cos(th);
    const rx = px + Ls * Math.sin(th);
    d.hatch(px - 70, py - 18, px + 70, py - 18, { side: -1 });
    d.line(px, py - 18, px, py, { cls: 'fg', w: 1.6 });
    d.dot(px, py, { cls: 'fg', r: 3 });
    d.line(px, py, px, py + Ls + 20, { cls: 'dim', dash: true, w: 1 });
    d.arc(px, py, Ls, -90 - thd, -90 + thd, { cls: 'dim', dash: true, w: 1.2 });
    d.line(px, py, lx, ly, { cls: 'fg', w: 1.6 });
    d.circle(lx, ly, 9, { cls: 'fg', fill: 'f1' });
    d.line(px, py, rx, ly, { cls: 'dim', dash: true, w: 1 });
    d.circle(rx, ly, 9, { cls: 'dim', dash: true });
    d.circle(px, py + Ls, 9, { cls: 'dim', dash: true });
    d.angle(px, py, 54, -90 - thd, -90, 'θ₀', { cls: 'c3' });
    d.text(px + 10, py + Ls / 2, 'L', { cls: 'dim', italic: true, size: 12 });
    d.arrow(px + 14, py + Ls + 24, px + 60, py + Ls + 24, { cls: 'c1', label: 'v_max', w: 2 });
    d.text(180, 216, 'L = ' + (o.hideL ? '?' : pl(r.L) + ' m') + '　θ₀ = ' + pl(thd) + '°　g = ' + pl(r.g) + ' m/s²', { size: 12 });
    return { svg: d.svg(), h: H };
  }

  function thetaGraph(r) {
    const f = (t) => r.th0Deg * Math.cos(r.w * t);
    return JK.plot.graph({
      w: 340, h: 170, x: [0, r.T * 2.08], y: [-1.45 * r.th0Deg, 1.45 * r.th0Deg],
      axis: ['t [s]', 'θ [°]'],
      curves: [{ f: f, cls: 'c1', domain: [0, r.T * 2.08] }],
      hlines: [{ y: r.th0Deg, label: 'θ₀ = ' + pl(r.th0Deg) + '°', dash: true }, { y: -r.th0Deg, label: '', dash: true }],
      vlines: [{ x: r.T, label: 'T = ' + pl(r.T) + ' s', dash: true }, { x: 2 * r.T, label: '', dash: true }]
    });
  }

  function pendFig(r) {
    const s = pendSchem(r);
    return stack([{ svg: s.svg, h: s.h }, { svg: thetaGraph(r), h: 170 }], 360);
  }

  const gTex = (r) => (Math.abs(r.g - G) < 1e-12 ? '9.8' : nf(r.g));
  const sqrtGL = (r) => R`\sqrt{\frac{` + gTex(r) + '}{' + nf(r.L) + '}}';
  const sqrtLG = (r) => R`\sqrt{\frac{` + nf(r.L) + '}{' + gTex(r) + '}}';

  const stPendEOM = (r) => ({
    t: '復元力（接線方向の運動方程式）',
    m: [R`ma_{t} = -mg\sin\theta \approx -mg\theta`, R`x = L\theta \;\Rightarrow\; ma_{t} = -\frac{mg}{L}x \;\Rightarrow\; a_{t} = -\frac{g}{L}x`],
    n: R`おもりにはたらく力は、重力 $mg$ と糸の張力です。張力は運動の向き（円弧の接線方向）に垂直なので、運動を決めるのは重力の接線方向の成分 $-mg\sin\theta$ です。角 $\theta$ が小さい（およそ $10\degree$ 以下）ときは $\sin\theta \approx \theta$ とみなせて、弧に沿った変位 $x = L\theta$ に比例する復元力になります。すなわち**単振動**になります。`,
    easy: R`振り子のおもりを横に引いて放すと、重力で真下にもどろうとします。このとき、運動の向きにはたらく力は、重力の「糸に垂直な成分」$mg\sin\theta$ だけです（糸の方向の成分は、糸の張力とつり合います）。振れ角 $\theta$ が小さいと、$\sin\theta$ は $\theta$ とほぼ同じ値（ラジアンで）になるので、力は「位置に比例して、向きが逆」になり、ばね振り子と同じ**単振動**になります。`,
    pro: R`単振り子が単振動とみなせるのは $\sin\theta \approx \theta$ が成り立つ小さい振れ角のとき。運動方程式の係数から $\omega^{2} = g/L$ と読める。`
  });

  // 角振動数。数値は、問題で与えられた L, g をそのまま代入する
  const stPendOmega = (r) => ({
    t: R`角振動数 $\omega$`,
    m: [R`a_{t} = -\omega^{2}x \;\Rightarrow\; \omega = \sqrt{\frac{g}{L}} = ` + sqrtGL(r) + ' = ' + sigTie(r.w) + RADS],
    n: R`$a_{t} = -\frac{g}{L}x$ を $a = -\omega^{2}x$ と見比べて、$\omega^{2} = \frac{g}{L}$ です。`,
    easy: R`単振動は、円運動を真横から見たときの動きと同じで、円運動の「角速度」にあたる量が**角振動数** $\omega$ です。運動の式 $a_{t} = -\frac{g}{L}x$ を、単振動の形 $a = -\omega^{2}x$ と見比べると、$\omega^{2} = \frac{g}{L}$ と読み取れます。`
  });

  // 周期と振動数。o.noF: 振動数 f を省く / o.Tsym: 周期の記号（既定 T）。数値は、問題で与えられた L, g をそのまま代入する
  const stPendT = (r, o) => {
    o = o || {};
    const Ts = o.Tsym || 'T';
    const lines = [Ts + R` = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{L}{g}} = ` + twoPi(r) + sqrtLG(r) + ' = ' + sigTie(r.T) + SEC];
    if (!o.noF) lines.push(R`f = \frac{1}{` + Ts + R`} = \frac{1}{2\pi}\sqrt{\frac{g}{L}} = ` + oneOver2Pi(r) + sqrtGL(r) + ' = ' + sigTie(r.f) + R`\,\mathrm{Hz}`);
    return {
      t: o.noF ? '周期' : '周期と振動数',
      m: lines,
      n: R`周期は $T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{L}{g}}$ となり、**おもりの質量にも、振幅にもよりません**。糸が長いほど周期は長く（ゆっくり）なります。` + (o.noF ? '' : R`振動数 $f$ は、1 秒間に往復する回数で、周期の逆数 $f = \frac{1}{T}$ です。`) + piNote(r),
      easy: R`式の両辺に質量 $m$ が入っていて、約分されて消えます。だから、重いおもりでも軽いおもりでも、周期は変わりません。大きく振っても小さく振っても（小さい角度の範囲なら）、同じ周期で往復します。決めるのは、糸の長さ $L$ と重力加速度 $g$ だけです。糸が長いほどゆっくり揺れます（ブランコが高いほどゆっくり揺れるのと同じです）。`,
      pro: R`$T = 2\pi\sqrt{L/g}$。$L$ が 4 倍で $T$ は 2 倍。周期 2 秒の「秒振り子」は $L \approx 1\,\mathrm{m}$。`
    };
  };

  // 最下点での速さ（計算機のみ）。数値は、与えられた L, θ₀, g をそのまま代入する
  const stPendVmax = (r) => ({
    t: '最下点での速さ',
    m: [R`v_{\max} = A\omega = L\theta_{0}\,\omega = L\theta_{0}\sqrt{\frac{g}{L}} = ` + nf(r.L) + R` \times \left(` + nf(r.th0Deg) + R` \times \frac{\pi}{180}\right) \times ` + sqrtGL(r) + ' = ' + sigTie(r.vApprox) + MS,
      R`\left(\text{エネルギー保存では } v = \sqrt{2gL(1 - \cos\theta_{0})} = ` + sigTie(r.vExact) + MS + R`\right)`],
    n: R`単振動の振幅は弧の長さ $A = L\theta_{0}$（$\theta_{0}$ はラジアン。$` + nf(r.th0Deg) + R`\degree = ` + nf(r.th0Deg) + R` \times \frac{\pi}{180}$）で、最下点（つり合いの位置）で速さが最大 $v_{\max} = A\omega$ になります。力学的エネルギー保存則から求めた値とほぼ一致します（角が小さいほど正確）。`,
    easy: R`おもりが一番速いのは、真下（最下点）を通るときです。単振動の公式 $v_{\max} = A\omega$ に、振幅 $A = L\theta_{0}$（弧の長さ）を入れます。ここで、角度は度ではなくラジアン（$180\degree = \pi$）で計算します。もう 1 つの方法として、高さの差を使ったエネルギー保存でも求められ、振れ角が小さければ 2 つの値はほぼ一致します。`,
    lv: 2
  });

  const stPendApprox = (r) => ({
    t: '小さい角の近似の確かめ（参考）',
    m: [R`\frac{T_{\text{厳密}}}{T} = ` + U.fmt(r.Texact / r.T, 4) + R`\quad (T_{\text{厳密}} = ` + sigTie(r.Texact) + SEC + R`)`],
    n: R`$\sin\theta \approx \theta$ の近似をしないで運動方程式を解くと、周期は少し長くなります。振れ角 $\theta_{0} = ` + nf(r.th0Deg) + R`\degree$ では、近似の周期との差は約 $` + nf(P3((r.Texact / r.T - 1) * 100)) + R`\,\%$ です。振れ角が大きくなるほど、差は広がります。`,
    lv: 3
  });

  function pendSteps(r) {
    return [stPendEOM(r), stPendOmega(r), stPendT(r), stPendVmax(r), stPendApprox(r)];
  }

  JK.registerSim({
    id: 'mech-pendulum',
    field: '力学',
    unit: 'p-shm',
    title: '単振り子（周期・最下点の速さ・θ–t グラフ）',
    desc: R`長さ $L$ の糸の先のおもりの、小さい振れ角での単振動です。周期 $T = 2\pi\sqrt{L/g}$（質量・振幅によらない）と最下点の速さを求め、θ–t グラフを描きます。重力加速度 $g$ を変えて、月面やエレベーター内（見かけの重力）を扱うこともできます。`,
    form: [R`ma_{t} = -mg\sin\theta \approx -\frac{mg}{L}x\quad (x = L\theta)`, R`\omega = \sqrt{\frac{g}{L}},\qquad T = 2\pi\sqrt{\frac{L}{g}}`, R`v_{\max} = L\theta_{0}\,\omega`],
    inputs: [
      { key: 'L', label: '糸の長さ L', unit: 'm', type: 'num', def: '1.0', min: 0.01, max: 1000 },
      { key: 'th0', label: '振れ角の最大値 θ₀', unit: '°', type: 'num', def: '5', min: 0.1, max: 30, hint: '単振動とみなせる小さい角（10° 以下が目安）' },
      { key: 'g', label: '重力加速度 g', unit: 'm/s²', type: 'num', def: '9.8', min: 0.1, max: 30, hint: '月面なら 1.6、エレベーター上昇中は見かけの g′ = g + a' }
    ],
    examples: [
      { label: '地上の 1.0 m の振り子', v: { L: '1.0', th0: '5', g: '9.8' } },
      { label: '長さ 0.25 m（周期 約 1 秒）', v: { L: '0.25', th0: '8', g: '9.8' } },
      { label: '月面（g = 1.6）', v: { L: '1.0', th0: '5', g: '1.6' } }
    ],
    intro: {
      easy: R`糸の先におもりをつけた**振り子**は、振れ角が小さいとき、ばね振り子と同じ**単振動**をします。おもりを引きもどす力は、重力の「運動の向きの成分」で、これが変位に比例すると見なせます。計算すると、周期は $T = 2\pi\sqrt{\frac{L}{g}}$ になります。ここで大切なのは、**おもりの質量にも、振れの大きさにもよらない**ことです（糸の長さ $L$ と重力加速度 $g$ だけで決まります）。糸が長いほどゆっくり、$g$ が小さい場所（月面など）ではゆっくり揺れます。`,
      normal: R`$ma_{t} = -mg\sin\theta \approx -\frac{mg}{L}x$ より $\omega = \sqrt{g/L}$、$T = 2\pi\sqrt{L/g}$。最下点の速さは $v_{\max} = L\theta_{0}\omega$（エネルギー保存で $\sqrt{2gL(1-\cos\theta_{0})}$）。`,
      pro: R`$T \propto \sqrt{L/g}$（$L$ 4 倍で 2 倍、$g$ が $\frac{1}{4}$ で 2 倍）。加速度 $a$ で上昇するエレベーター内では見かけの重力加速度が $g' = g + a$（下降なら $g - a$）。自由落下中は $g' = 0$ で振動しない。`
    },
    compute(v) {
      const r = solvePend(v.L, v.th0, v.g);
      return {
        result: [
          { label: '周期 T', tex: sig(r.T) + SEC },
          { label: '振動数 f', tex: sig(r.f) + R`\,\mathrm{Hz}` },
          { label: '角振動数 ω', tex: sig(r.w) + RADS },
          { label: '最下点の速さ v_max', tex: sig(r.vExact) + MS },
          { label: '周期の厳密値（参考）', tex: sig(r.Texact) + SEC }
        ],
        steps: pendSteps(r),
        fig: pendFig(r)
      };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$、円周率を $\pi = 3.14$ とする。`;
      const tol = { rel: 0.02 };
      const PI3 = 3.14;                                            // 問題文で与える円周率。答えも解説も、この値で計算する
      if (level === 'basic') {
        const L = rng.pick([0.20, 0.25, 0.30, 0.36, 0.40, 0.50, 0.60, 0.64, 0.80, 1.0, 1.2, 1.44, 1.5, 2.0, 2.25, 2.5, 3.0, 4.0]);
        const r = solvePend(L, 5, G, PI3);
        return {
          title: '単振り子の周期と振動数',
          body: R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の軽い糸の一端を固定し、他端におもりをつけて、小さな振れ角で振らせた。` + gtxt + R`次の問いに答えよ。`,
          fig: pendSchem(r).svg,
          parts: [
            { label: '(1)', q: R`振り子の周期 $T$`, type: 'num', answer: P3(r.T), rel: tol.rel, unit: 's' },
            { label: '(2)', q: R`振り子の振動数 $f$`, type: 'num', answer: P3(r.f), rel: tol.rel, unit: 'Hz' }
          ],
          solution: [stPendEOM(r), stPendOmega(r), stPendT(r)]
        };
      }
      if (level === 'mid') {
        // 周期は 0.1 秒の位まで測った値（1.0〜4.0 秒 → 糸の長さ 0.25〜4 m）。糸を何倍にするかは 4 倍か 9 倍（9 倍にして長くなりすぎないときだけ）
        const T = rng.pick([1.0, 1.2, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.5, 2.6, 2.8, 3.0, 3.2, 3.5, 4.0]);
        const L = G * T * T / (4 * PI3 * PI3);
        const kk = rng.pick(L * 9 <= 12 ? [4, 9] : [4]), sk = Math.sqrt(kk);
        const r = solvePend(L, 5, G, PI3);
        const sol = [
          stPendEOM(r),
          // 与えられた周期から糸の長さを求める式（答え (1)）
          {
            t: '周期の式から糸の長さ $L$ を求める',
            m: [R`T = 2\pi\sqrt{\frac{L}{g}} \;\Rightarrow\; L = \frac{gT^{2}}{4\pi^{2}}`,
              R`L = \frac{9.8 \times ` + nf(T) + R`^{2}}{4 \times 3.14^{2}} = ` + sigTie(L) + MM],
            n: R`単振り子の周期は $T = 2\pi\sqrt{\frac{L}{g}}$ です。この式の両辺を 2 乗して $L$ について解くと $L = \frac{gT^{2}}{4\pi^{2}}$ となります。$g = 9.8\,\mathrm{m/s^{2}}$、$\pi = 3.14$、$T = ` + nf(T) + R`\,\mathrm{s}$ を代入して、糸の長さが求まります。`,
            easy: R`周期は、糸の長さ $L$ と重力加速度 $g$ で決まります（$T = 2\pi\sqrt{L/g}$）。この問題では周期 $T$ のほうが分かっているので、式を $L$ を求める形に直します。ルートをはずすために両辺を 2 乗すると $T^{2} = 4\pi^{2}\frac{L}{g}$、これを $L$ について解いて $L = \frac{gT^{2}}{4\pi^{2}}$ です。あとは数値を入れるだけです。`
          },
          // 振動数（答え (2)）
          {
            t: R`振動数 $f$ を求める`,
            m: [R`f = \frac{1}{T} = \frac{1}{` + nf(T) + '} = ' + sigTie(1 / T) + R`\,\mathrm{Hz}`],
            n: R`振動数 $f$ は、1 秒間に何回往復するかを表す量で、周期 $T$ の逆数です。`,
            easy: R`周期が $` + nf(T) + R`\,\mathrm{s}$（1 往復に ` + nf(T) + R` 秒かかる）なら、1 秒間には $\frac{1}{` + nf(T) + R`}$ 往復します。これが振動数 $f$ で、単位は $\mathrm{Hz}$（ヘルツ）です。`
          },
          // 糸を k 倍にしたときの周期（答え (3)）
          {
            t: '糸の長さを ' + kk + ' 倍にしたときの周期',
            m: [R`T' = 2\pi\sqrt{\frac{` + kk + R`L}{g}} = ` + sk + R` \times 2\pi\sqrt{\frac{L}{g}} = ` + sk + R`T = ` + sk + R` \times ` + nf(T) + ' = ' + sigTie(sk * T) + SEC],
            n: R`周期は $\sqrt{L}$ に比例するので、$L$ を ` + kk + R` 倍にすると $\sqrt{` + kk + R`} = ` + sk + R`$ 倍になります。`,
            easy: R`周期の式 $T = 2\pi\sqrt{L/g}$ の $L$ を $` + kk + R`L$ に入れかえると、ルートの中から $` + kk + R`$ が $` + sk + R`$ になって出てくるので、周期は ` + sk + R` 倍になります。長さが ` + kk + R` 倍でも周期は ` + kk + R` 倍にならないことに注意しましょう。`
          }
        ];
        return {
          title: '周期から糸の長さを求める',
          body: R`長さの分からない軽い糸の先におもりをつけた単振り子が、小さな振れ角で、周期 $` + T.toFixed(1) + R`\,\mathrm{s}$ で振れている。` + gtxt + R`次の問いに答えよ。`,
          fig: pendSchem(r, { hideL: true }).svg,
          parts: [
            { label: '(1)', q: R`振り子の糸の長さ $L$`, type: 'num', answer: P3(L), rel: tol.rel, unit: 'm' },
            { label: '(2)', q: R`振り子の振動数 $f$`, type: 'num', answer: P3(1 / T), rel: tol.rel, unit: 'Hz' },
            { label: '(3)', q: R`糸の長さを ` + kk + R` 倍にしたときの周期 $T'$`, type: 'num', answer: P3(sk * T), rel: tol.rel, unit: 's' }
          ],
          solution: sol
        };
      }
      // adv: 見かけの重力（エレベーター）と月面
      const L = rng.pick([0.25, 0.40, 0.50, 0.80, 1.0, 1.2, 1.5, 2.0, 2.5]);
      const a = rng.pick([1.0, 2.0, 3.0, 4.0, 5.0]);
      const gm = 1.6;
      const r0 = solvePend(L, 5, G, PI3);
      const r1 = solvePend(L, 5, G + a, PI3);
      const Lm = L * gm / G;
      const gUp = sig(G + a);                                      // 見かけの重力加速度 g' = g + a（3 けたで書き切れる値）
      const sol = [
        stPendEOM(r0),
        stPendOmega(r0),
        stPendT(r0, { noF: true, Tsym: 'T_{0}' }),
        {
          t: '上向きに加速するエレベーター内での周期',
          m: [R`g' = g + a = 9.8 + ` + nf(a) + ' = ' + gUp + MS2,
            R`T_{1} = 2\pi\sqrt{\frac{L}{g'}} = ` + twoPi(r1) + R`\sqrt{\frac{` + nf(L) + '}{' + gUp + '}} = ' + sigTie(r1.T) + SEC],
          n: R`エレベーターが上向きに加速度 $a = ` + nf(a) + R`\,\mathrm{m/s^{2}}$ で動くと、エレベーターの中では、おもりに重力 $mg$ に加えて、下向きの慣性力 $ma$ もはたらきます。つまり、**見かけの重力加速度が $g' = g + a$ に大きくなった**のと同じです。周期の式の $g$ を $g'$ に置きかえれば、周期が求まります（周期は短くなります）。`,
          easy: R`上向きに加速するエレベーターに乗ると、体が床に強く押しつけられて重く感じます。振り子のおもりも、同じように「重くなった」ように感じて、より強く下に引かれるのです。これは、重力加速度が $g$ から $g + a$ に大きくなったのと同じことです。周期の式の $g$ を $g + a$ に変えれば、振り子の周期が求まります。重力が強くなるので、振り子は速く揺れて、周期は短くなります。`,
          pro: R`加速するエレベーター内の振り子は、$g$ を見かけの重力加速度 $g' = g \pm a$（上向き加速なら $+$、下向きなら $-$）に置きかえるだけ。`
        },
        {
          t: '月面で同じ周期にするための糸の長さ',
          m: [R`2\pi\sqrt{\frac{L'}{g_{\text{月}}}} = 2\pi\sqrt{\frac{L}{g}} \;\Rightarrow\; L' = L\,\frac{g_{\text{月}}}{g}`,
            R`L' = ` + nf(L) + R` \times \frac{1.6}{9.8} = ` + sigTie(Lm) + MM],
          n: R`周期が等しいということは $\frac{L'}{g_{\text{月}}} = \frac{L}{g}$ です。月面では重力加速度が小さいので、同じ周期にするには、糸を短くする必要があります。`,
          easy: R`月面では重力が小さい（約 $\frac{1}{6}$）ので、同じ長さの振り子はゆっくり揺れます。そこで、地上と同じ周期で揺らすには、糸を短くして調節します。周期が等しい条件は、周期の式の ルートの中の $\frac{L}{g}$ が地上と月面で等しいことです。`
        }
      ];
      return {
        title: 'エレベーター内・月面での振り子',
        body: R`長さ $` + L.toFixed(2) + R`\,\mathrm{m}$ の軽い糸の先におもりをつけた単振り子を、小さな振れ角で振らせる。` + gtxt + R`月面での重力加速度の大きさは $1.6\,\mathrm{m/s^{2}}$ とする。次の問いに答えよ。`,
        fig: pendSchem(r0).svg,
        parts: [
          { label: '(1)', q: R`地上で静止した状態での、この振り子の周期 $T_{0}$`, type: 'num', answer: P3(r0.T), rel: tol.rel, unit: 's' },
          { label: '(2)', q: R`この振り子を、鉛直上向きに加速度 $` + a.toFixed(1) + R`\,\mathrm{m/s^{2}}$ で上昇しているエレベーターの中で振らせたときの周期 $T_{1}$`, type: 'num', answer: P3(r1.T), rel: tol.rel, unit: 's' },
          { label: '(3)', q: R`月面で、地上と同じ周期 $T_{0}$ で振れる単振り子の糸の長さ $L'$`, type: 'num', answer: P3(Lm), rel: tol.rel, unit: 'm' }
        ],
        solution: sol
      };
    }
  });
})();
