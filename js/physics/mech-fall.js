/* 物理・力学 — 落体の運動（unit: p-fall）
   mech-freefall: 自由落下・鉛直投げ下ろし・鉛直投げ上げ（運動の様子 + v–t グラフ）
   mech-projectile: 水平投射・斜方投射（放物線の軌道 + 初速度の分解） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const G = 9.8;
  const PI = Math.PI;

  const sig = (x) => U.sig(x, 3);
  const nf = (x) => { if (typeof x !== 'number' || !isFinite(x) || Math.abs(x) < 1e-12) return '0'; const ax = Math.abs(x); if (ax >= 1e15 || ax < 1e-6) { let e = Math.floor(Math.log10(ax)); let m = Number((x / Math.pow(10, e)).toPrecision(10)); if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(10)); e += 1; } let ms = String(m); if (ms.indexOf('.') < 0) ms += '.0'; return '(' + ms + R` \times 10^{` + e + '})'; } return String(Number(x.toPrecision(10))); };   // 入力値の表示（TeX）。与えた値をそのまま（有効数字 10 桁まで）書く。3 桁に丸めると、入力が 4 桁以上のとき式が合わなくなる。10^-6 未満・10^15 以上だけ指数の形（累乗するときのため括弧つき）
  const P3 = (x) => U.roundSig(x, 3);
  const zero = (x) => (Math.abs(x) < 1e-12 ? 0 : x);
  const MS = R`\,\mathrm{m/s}`, MS2 = R`\,\mathrm{m/s^{2}}`, SEC = R`\,\mathrm{s}`, MM = R`\,\mathrm{m}`;
  const GTXT = R`9.8`;

  // 途中の値の表示。x を、有効数字 n 桁に丸めた値と同じになる最小の桁数（3 桁以上）で書く
  const dig = (x, n) => {
    let k = 3;
    while (k < n && U.roundSig(x, k) !== U.roundSig(x, n)) k++;
    return U.sig(x, k);
  };
  // 途中の値 vals を、次の式 f（表示した値で計算する）の結果が target の有効数字 3 桁と一致する最小の桁数で書く。
  // 生徒が表示の数値どうしを電卓で計算しても、表示の結果と最後の桁まで合う（丸めた 17.0 を代入して 33.9 が 34.0 になる、を防ぐ）
  const fit = (vals, f, target) => {
    const want = U.roundSig(target, 3);
    for (let n = 3; n <= 12; n++) {
      if (U.roundSig(f.apply(null, vals.map((x) => U.roundSig(x, n))), 3) === want) return vals.map((x) => dig(x, n));
    }
    return vals.map((x) => dig(x, 12));
  };
  const pr = (s) => (s.charAt(0) === '-' || s.indexOf(R`\times`) >= 0 ? '(' + s + ')' : s);   // 負の数・指数表記は括弧をつけて代入する
  // 解説の粒度を 1（常に表示）にしたステップ。設問の答えを出すステップは、計算機では補足の lv 2 でも、演習では lv 1 にする
  const L1 = (st) => Object.assign({}, st, { lv: 1 });

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
     自由落下・鉛直投げ下ろし・鉛直投げ上げ
     ===================================================================== */
  function solveFall(mode, v0, h) {
    const r = { mode: mode, v0: v0, h: h, up: mode === 'up' };
    const root = Math.sqrt(v0 * v0 + 2 * G * h);
    r.root = root;
    r.v = root;                                          // 着地の速さ
    if (r.up) {
      r.t1 = v0 / G;                                     // 最高点までの時間
      r.rise = v0 * v0 / (2 * G);                        // 発射点からの上昇距離
      r.H = h + r.rise;                                  // 最高点の高さ（地面から）
      r.T = (v0 + root) / G;                             // 着地までの時間
    } else {
      r.T = (-v0 + root) / G;
    }
    return r;
  }

  // 運動の様子（一定時間ごとの位置と速度の矢印）
  function strobe(r) {
    const W = 360, HH = 290;
    const d = JK.plot.draw(W, HH);
    const gy = 244, top = 50;
    const Hm = Math.max(r.up ? r.H : r.h, 1e-9);
    const s = (gy - top) / Hm;                           // px / m
    const N = 10, x0 = 78, dx = 24;
    const heightAt = (t) => (r.up ? r.h + r.v0 * t - 0.5 * G * t * t : r.h - (r.v0 * t + 0.5 * G * t * t));
    const velUp = (t) => (r.up ? r.v0 - G * t : -(r.v0 + G * t));          // 上向きを正とした速度
    d.hatch(20, gy, 340, gy);
    let vmax = 1e-9;
    for (let k = 0; k <= N; k++) vmax = Math.max(vmax, Math.abs(velUp(r.T * k / N)));
    const kv = 40 / vmax;
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const t = r.T * k / N;
      pts.push([x0 + dx * k, gy - Math.max(0, heightAt(t)) * s, velUp(t)]);
    }
    d.poly(pts.map((p) => [p[0], p[1]]), { cls: 'dim', close: false, dash: true, w: 1 });
    pts.forEach((p, k) => {
      const len = p[2] * kv;
      if (Math.abs(len) >= 3) d.arrow(p[0], p[1], p[0], p[1] - len, { cls: 'c1', w: 1.5 });
    });
    pts.forEach((p) => d.circle(p[0], p[1], 5, { cls: 'fg', fill: 'f3' }));
    // 高さの目盛り（左）
    const ys = gy - r.h * s;
    d.line(40, gy, 40, ys, { cls: 'dim', w: 1.2 });
    d.line(35, ys, 45, ys, { cls: 'dim', w: 1.2 });
    d.line(35, gy, 45, gy, { cls: 'dim', w: 1.2 });
    if (r.h > 0) {
      d.line(45, ys, x0, ys, { cls: 'dim', dash: true, w: 1 });
      d.text(30, (gy + ys) / 2 + 4, 'h', { cls: 'dim', anchor: 'end', italic: true });
    }
    if (r.up) {
      const yt = gy - r.H * s;
      d.line(45, yt, x0 + dx * 4, yt, { cls: 'c3', dash: true, w: 1 });
      d.text(50, yt - 5, '最高点 H = ' + U.fmt(r.H, 3) + ' m', { cls: 'fg', anchor: 'start', size: 11 });
    }
    d.text(x0 - 30, 14, '一定時間ごとの位置（矢印 = 速度）', { cls: 'dim', anchor: 'start', size: 11 });
    return d.svg();
  }

  function vtFall(r, w, h) {
    // 下向き正（自由落下・投げ下ろし）/ 上向き正（投げ上げ）
    const f = r.up ? (s) => r.v0 - G * s : (s) => r.v0 + G * s;
    const ve = f(r.T);
    const lo = Math.min(0, r.v0, ve), hi = Math.max(0, r.v0, ve);
    const pad = (hi - lo || 1) * 0.18;
    const o = {
      w: w, h: h, x: [0, r.T * 1.14], y: [lo < 0 ? lo - pad : 0, hi + pad],
      axis: ['t [s]', r.up ? 'v [m/s]（上向きが正）' : 'v [m/s]（下向きが正）'],
      curves: [{ f: f, cls: 'c1', domain: [0, r.T] }],
      vlines: [{ x: r.T, label: 't = ' + U.fmt(r.T, 2) }],
      points: [{ x: r.T, y: ve, label: 'v = ' + U.fmt(ve, 2), cls: 'c3', pos: r.up ? 'bl' : 'tl' }],
      labels: []
    };
    if (r.up) {
      o.fills = [
        { f: f, g: () => 0, from: 0, to: r.t1, cls: 'f1' },
        { f: f, g: () => 0, from: r.t1, to: r.T, cls: 'f3' }
      ];
      o.points.push({ x: r.t1, y: 0, label: '最高点 t = ' + U.fmt(r.t1, 2), cls: 'c2', pos: 'tr' });
      if (r.v0 > 0) o.points.push({ x: 0, y: r.v0, label: 'v₀ = ' + U.fmt(r.v0, 2), cls: 'c3', pos: 'tr' });
      o.labels.push({ x: r.t1 * 0.3, y: r.v0 * 0.28, text: '上昇', cls: 'fg', anchor: 'middle' });
      o.labels.push({ x: r.t1 + (r.T - r.t1) * 0.68, y: ve * 0.34, text: '下降', cls: 'fg', anchor: 'middle' });
    } else {
      o.fills = [{ f: f, g: () => 0, from: 0, to: r.T, cls: 'f1' }];
      if (r.v0 > 0) o.points.push({ x: 0, y: r.v0, label: 'v₀ = ' + U.fmt(r.v0, 2), cls: 'c3', pos: 'br' });
      o.labels.push({ x: r.T * 0.5, y: f(r.T * 0.5) / 2, text: '面積 = 落下距離 h', cls: 'fg', anchor: 'middle' });
    }
    return JK.plot.graph(o);
  }

  function figFall(r) {
    return stack([{ svg: strobe(r), h: 290 }, { svg: vtFall(r, 360, 205), h: 205 }], 360);
  }

  // 問題用の状況図
  function fallScene(kind, hLab, v0Lab) {
    const d = JK.plot.draw(360, 236);
    const gy = 210, topY = 56;
    d.hatch(20, gy, 340, gy);
    d.arrow(30, 62, 30, 108, { cls: 'c4', label: 'g', w: 1.8 });
    if (kind === 'two') {
      // A を静かにはなすと同時に、真下の地面から B を投げ上げる
      d.rect(56, topY, 44, gy - topY, { cls: 'fg', fill: 'f0' });
      d.text(78, (topY + gy) / 2 + 4, 'ビル', { cls: 'dim', size: 11 });
      d.line(100, topY, 226, topY, { cls: 'dim', dash: true, w: 1 });
      d.circle(226, topY, 8, { cls: 'fg', fill: 'f3' });
      d.text(226, topY - 14, 'A（静かにはなす）', { size: 11 });
      d.line(226, topY + 8, 226, gy - 8, { cls: 'dim', dash: true, w: 1 });
      d.circle(226, gy - 8, 8, { cls: 'fg', fill: 'f2' });
      d.arrow(226, gy - 20, 226, gy - 72, { cls: 'c1', label: 'v₀', w: 1.8 });
      d.text(248, gy - 4, 'B（投げ上げる）', { size: 11, anchor: 'start' });
      d.arrow(122, topY + 4, 122, gy - 4, { cls: 'dim', w: 1.2 });
      d.arrow(122, gy - 4, 122, topY + 4, { cls: 'dim', w: 1.2 });
      d.text(130, (topY + gy) / 2 + 4, hLab, { cls: 'dim', anchor: 'start', italic: true });
      return d.svg();
    }
    const bx = 168;
    let ay0 = 0, ay1 = 0;                                // v₀ の矢印（始点・終点の y）
    if (kind !== 'up0') {
      d.rect(56, topY, 70, gy - topY, { cls: 'fg', fill: 'f0' });
      d.text(91, (topY + gy) / 2 + 4, 'ビル', { cls: 'dim', size: 11 });
      d.line(126, topY, 282, topY, { cls: 'dim', dash: true, w: 1 });
      d.arrow(280, topY + 2, 280, gy - 2, { cls: 'dim', w: 1.2 });
      d.arrow(280, gy - 2, 280, topY + 2, { cls: 'dim', w: 1.2 });
      d.text(288, (topY + gy) / 2 + 4, hLab, { cls: 'dim', anchor: 'start', italic: true });
      d.circle(bx, topY, 8, { cls: 'fg', fill: 'f3' });
      if (kind === 'free') d.text(bx, topY - 14, '静かにはなす', { size: 11 });
      if (kind === 'down') { ay0 = topY + 10; ay1 = topY + 58; }
      if (kind === 'up') { ay0 = topY - 10; ay1 = topY - 48; }
    } else {
      d.circle(bx, gy - 8, 8, { cls: 'fg', fill: 'f3' });
      d.text(bx + 18, gy - 4, '地面から投げ上げる', { size: 11, anchor: 'start' });
      ay0 = gy - 20; ay1 = gy - 100;
    }
    if (ay0 !== ay1) {
      d.arrow(bx, ay0, bx, ay1, { cls: 'c1', w: 1.8 });
      d.text(bx + 10, (ay0 + ay1) / 2 + 4, v0Lab || 'v₀', { cls: 'c1', size: 11, anchor: 'start' });
    }
    return d.svg();
  }

  /* ---------- 解説ステップ（落体） ---------- */
  // o.hUnknown: 高さ h は求める量（落下時間 o.T から高さを求める演習）。h === 0 の投げ上げは「地面から投げる」と書く
  function stFallAxis(r, o) {
    o = o || {};
    const up = r.up;
    const given = o.hUnknown
      ? R`初速 $v_{0} = ` + nf(r.v0) + MS + R`$、落下にかかった時間は $t = ` + nf(o.T) + SEC + R`$ です（高さ $h$ は求める量です）。`
      : (up && r.h === 0
        ? R`初速 $v_{0} = ` + nf(r.v0) + MS + R`$、地面から投げるので、投げる高さは $h = 0$ です。`
        : R`初速 $v_{0} = ` + nf(r.v0) + MS + R`$、投げる（落とす）高さ $h = ` + nf(r.h) + MM + R`$（地面から）です。`);
    return {
      t: up ? '鉛直上向きを正として、加速度を決める' : '鉛直下向きを正として、加速度を決める',
      n: (up
        ? R`上向きを正の向きとします。空気の抵抗を無視すると、投げ上げた物体には重力だけがはたらくので、加速度は**下向きに $g = 9.8\,\mathrm{m/s^{2}}$**、つまり $a = -g$ の等加速度直線運動です。`
        : R`下向きを正の向きとします。空気の抵抗を無視すると、落下する物体には重力だけがはたらくので、加速度は**下向きに $g = 9.8\,\mathrm{m/s^{2}}$**、つまり $a = +g$ の等加速度直線運動です。`) + given,
      easy: R`空気の抵抗がなければ、重い物も軽い物も同じペースで速くなります。その「1 秒あたりに増える速さ」が**重力加速度** $g = 9.8\,\mathrm{m/s^{2}}$ です。落とした物は 1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ速くなり、真上に投げた物は 1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ遅くなります。「等加速度直線運動」の公式がそのまま使えます。`,
      pro: R`向きの決め方は自由ですが、投げ上げは「上を正」、落下は「下を正」と取ると符号が少なくて済みます。`
    };
  }

  function stFallTime(r) {
    if (r.mode === 'free') {
      return {
        t: '落下にかかる時間（自由落下）',
        m: [R`h = \frac{1}{2}gt^{2} \;\Rightarrow\; t = \sqrt{\frac{2h}{g}}`,
          R`t = \sqrt{\frac{2 \times ` + nf(r.h) + R`}{9.8}} = ` + sig(r.T) + SEC],
        n: R`初速が 0 の自由落下では、$t$ 秒間に落ちる距離は $\frac{1}{2}gt^{2}$ です。これが高さ $h$ に等しくなる時間を求めます。`,
        easy: R`静かにはなした物は、1 秒間で $\frac{1}{2} \times 9.8 \times 1^{2} = 4.9\,\mathrm{m}$、2 秒間で $19.6\,\mathrm{m}$、3 秒間で $44.1\,\mathrm{m}$ 落ちます。落ちる距離は時間の 2 乗に比例して増えていくので、高さ $h$ が分かれば、$h = \frac{1}{2}gt^{2}$ を $t$ について解いて時間が求まります。`,
        pro: R`$t = \sqrt{2h/g}$。高さが 4 倍になると時間は 2 倍。$h = 4.9\,\mathrm{m}$ なら 1 秒、と覚えておくと検算に便利。`
      };
    }
    return {
      t: '落下にかかる時間（2 次方程式を解く）',
      m: [R`h = v_{0}t + \frac{1}{2}gt^{2} \;\Rightarrow\; \frac{1}{2}gt^{2} + v_{0}t - h = 0`,
        R`t = \frac{-v_{0} + \sqrt{v_{0}^{2} + 2gh}}{g}`,
        R`t = \frac{-` + nf(r.v0) + R` + \sqrt{` + nf(r.v0) + R`^{2} + 2 \times 9.8 \times ` + nf(r.h) + R`}}{9.8} = ` + sig(r.T) + SEC],
      n: R`下向きに $h$ 進む条件 $h = v_{0}t + \frac{1}{2}gt^{2}$ を $t$ の 2 次方程式として解きます。解の公式の 2 つの解のうち、$t > 0$ の方（$+\sqrt{\ }$ の方）が答えです。`,
      easy: R`投げ下ろしは、「最初の速さ $v_{0}$ で進む分」と「重力で加速される分 $\frac{1}{2}gt^{2}$」の合計が高さ $h$ になる、と考えます。$t$ が 2 回出てくる式（2 次方程式）になるので、解の公式 $x = \frac{-b + \sqrt{b^{2} - 4ac}}{2a}$ で解きます。マイナスの時間は現実にはありえないので、プラスの方の解だけを採用します。`,
      lv: 2
    };
  }

  function stFallSpeed(r) {
    const T = fit([r.T], (t) => r.v0 + G * t, r.v)[0];
    const line = r.mode === 'free'
      ? R`v = gt = 9.8 \times ` + T + ' = ' + sig(r.v) + MS
      : R`v = v_{0} + gt = ` + nf(r.v0) + R` + 9.8 \times ` + T + ' = ' + sig(r.v) + MS;
    return {
      t: '着地の速さ',
      m: [R`v = v_{0} + gt` + (r.mode === 'free' ? R` \quad (v_{0} = 0)` : ''), line,
        R`\text{確認: } v^{2} - v_{0}^{2} = 2gh \;\Rightarrow\; v = \sqrt{v_{0}^{2} + 2gh} = \sqrt{` + nf(r.v0) + R`^{2} + 2 \times 9.8 \times ` + nf(r.h) + '} = ' + sig(r.v) + MS],
      n: R`速度の式 $v = v_{0} + gt$ に落下時間を代入します。時間を使わない式 $v^{2} - v_{0}^{2} = 2gh$ でも同じ値になるので、検算に使えます。`,
      easy: R`落ちている物の速さは、最初の速さに「1 秒あたり $9.8\,\mathrm{m/s}$ × 経過時間」を足したものです。たとえば 2 秒後なら、最初の速さより $19.6\,\mathrm{m/s}$ 速くなっています。検算の式は「速さの 2 乗の増え方 = $2 \times g \times$ 落ちた距離」という意味で、時間が分からなくても使えます。`,
      pro: R`時間を求めずに $v = \sqrt{v_{0}^{2} + 2gh}$ で直接出せる（エネルギー保存と同じ式）。`
    };
  }

  function stUpTop(r) {
    return {
      t: '最高点（速度が 0 になる瞬間）',
      m: [R`0 = v_{0} - gt_{1} \;\Rightarrow\; t_{1} = \frac{v_{0}}{g} = \frac{` + nf(r.v0) + R`}{9.8} = ` + sig(r.t1) + SEC,
        R`H = h + \frac{v_{0}^{2}}{2g} = ` + nf(r.h) + R` + \frac{` + nf(r.v0) + R`^{2}}{2 \times 9.8} = ` + sig(r.H) + MM],
      n: R`最高点では、上向きの速度がちょうど 0 になります（その後は下向きに動き出します）。$v = v_{0} - gt = 0$ から時間が、$v^{2} - v_{0}^{2} = 2(-g)y$ に $v = 0$ を入れて上昇距離 $y = \frac{v_{0}^{2}}{2g}$ が求まります。最高点の高さは地面から測るので、発射点の高さ $h$ を足します。`,
      easy: R`ボールを真上に投げると、1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ遅くなり、速さが 0 になった瞬間が一番高いところ（最高点）です。そこから先は、落とした物と同じように下向きに速くなっていきます。「速さが 0 になる」を式にした $0 = v_{0} - gt$ から、最高点に着く時間が分かります。`,
      pro: R`$t_{1} = v_{0}/g$、上昇距離 $= v_{0}^{2}/(2g)$ は即答できるように。$v_{0} = 9.8\,\mathrm{m/s}$ なら 1 秒で $4.9\,\mathrm{m}$。`
    };
  }

  function stUpLand(r) {
    return {
      t: '地面に落ちるまでの時間',
      m: r.h === 0
        ? [R`0 = v_{0}T - \frac{1}{2}gT^{2} \;\Rightarrow\; T = \frac{2v_{0}}{g}`,
          R`T = \frac{2 \times ` + nf(r.v0) + R`}{9.8} = ` + sig(r.T) + SEC]
        : [R`0 = h + v_{0}T - \frac{1}{2}gT^{2} \;\Rightarrow\; T = \frac{v_{0} + \sqrt{v_{0}^{2} + 2gh}}{g}`,
          R`T = \frac{` + nf(r.v0) + R` + \sqrt{` + nf(r.v0) + R`^{2} + 2 \times 9.8 \times ` + nf(r.h) + R`}}{9.8} = ` + sig(r.T) + SEC],
      n: R`地面に落ちる時刻を $T$ とします。地面（高さ 0）に達する条件 $h + v_{0}T - \frac{1}{2}gT^{2} = 0$ を $T$ の 2 次方程式として解き、$T > 0$ の解を選びます。` + (r.h === 0 ? R`地面から投げた場合は $T = \frac{2v_{0}}{g}$ で、最高点までの時間 $t_{1}$ のちょうど 2 倍です（上昇と下降は対称）。` : ''),
      easy: R`「地面に落ちる」は「高さが 0 になる」ということです。落ちる時刻を $T$ とすると、高さは $h + v_{0}T - \frac{1}{2}gT^{2}$ なので、これを 0 とおいた 2 次方程式を解きます。答えは 2 つ出ますが、マイナスの時間は現実にはありえないので、プラスの方を選びます。`,
      lv: 2
    };
  }

  function stUpSpeed(r) {
    const T = fit([r.T], (t) => r.v0 - G * t, -r.v)[0];
    return {
      t: '着地の速さ',
      m: [R`v = v_{0} - gT = ` + nf(r.v0) + R` - 9.8 \times ` + T + ' = ' + sig(-r.v) + MS,
        R`|v| = \sqrt{v_{0}^{2} + 2gh} = \sqrt{` + nf(r.v0) + R`^{2} + 2 \times 9.8 \times ` + nf(r.h) + '} = ' + sig(r.v) + MS],
      n: R`速度の式 $v = v_{0} - gt$ に着地時刻 $t = T$ を代入すると、負の値（下向き）になります。速さはその絶対値です。時間を使わずに $|v| = \sqrt{v_{0}^{2} + 2gh}$ としても同じです。` + (r.h === 0 ? R`地面から投げた場合、着地の速さは初速 $v_{0}$ と等しくなります。` : ''),
      easy: R`投げ上げた物が落ちてくると、速さは「同じ高さを通るときは、上りも下りも同じ」になります。つまり投げた高さにもどってきたときの速さは $v_{0}$（向きは逆）で、そこからさらに $h$ だけ落ちる分、もっと速くなって着地します。`,
      lv: 2
    };
  }

  function buildFallSteps(r) {
    if (r.up) return [stFallAxis(r), stUpTop(r), stUpLand(r), stUpSpeed(r)];
    return [stFallAxis(r), stFallTime(r), stFallSpeed(r)];
  }

  /* ---------- 入力と登録（落体） ---------- */
  JK.registerSim({
    id: 'mech-freefall',
    field: '力学',
    unit: 'p-fall',
    title: '自由落下・鉛直投げ下ろし・投げ上げ',
    desc: '高さ $h$ から物体を落とす・投げ下ろす・投げ上げるときの、落下時間・着地の速さ、（投げ上げでは）最高点の高さと到達時間を求めます。運動の様子と v–t グラフつき。空気抵抗は無視します。',
    form: [R`v = v_{0} \pm gt`, R`y = v_{0}t \pm \frac{1}{2}gt^{2}`, R`v^{2} - v_{0}^{2} = \pm 2gy`],
    inputs: [
      { key: 'mode', label: '運動の種類', type: 'select', def: 'free', options: [['free', '自由落下（静かにはなす）'], ['down', '鉛直投げ下ろし'], ['up', '鉛直投げ上げ']] },
      { key: 'v0', label: R`初速の大きさ $v_{0}$`, unit: 'm/s', type: 'num', def: '9.8', min: 0, max: 500, show: (raw) => raw.mode !== 'free', hint: '投げ下ろしは下向き、投げ上げは上向きの速さ' },
      { key: 'h', label: R`投げる（落とす）高さ $h$`, unit: 'm', type: 'num', def: '19.6', min: 0, max: 10000, hint: '地面からの高さ。投げ上げでは 0（地面から投げる）も可' }
    ],
    examples: [
      { label: 'ビルから落とす', v: { mode: 'free', v0: '0', h: '44.1' } },
      { label: '投げ下ろし', v: { mode: 'down', v0: '9.8', h: '39.2' } },
      { label: '地面から投げ上げ', v: { mode: 'up', v0: '19.6', h: '0' } },
      { label: '高さ 14.7 m から投げ上げ', v: { mode: 'up', v0: '9.8', h: '14.7' } }
    ],
    intro: {
      easy: R`物体を落としたり、投げ上げたり、投げ下ろしたりする運動は、どれも**重力だけがはたらく**運動です。空気の抵抗を無視すれば、物体の重さによらず、**速さが 1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ**変わっていきます（この 9.8 を重力加速度 $g$ と呼びます）。つまり「加速度が $g$ の等加速度直線運動」なので、前の単元（等加速度運動）の 3 つの公式がそのまま使えます。向き（上・下）の取り方だけ気をつけましょう。`,
      normal: R`落下は下向き正で $a = +g$、投げ上げは上向き正で $a = -g$ の等加速度直線運動。最高点は $v = 0$、着地は $y = 0$（地面）の条件から時間を求めます。`,
      pro: R`投げ上げは「最高点まで $t_{1} = v_{0}/g$、上昇距離 $v_{0}^{2}/2g$、上りと下りは対称」。着地の速さは $\sqrt{v_{0}^{2} + 2gh}$ で一発（エネルギー保存と同じ形）。`
    },
    compute(v) {
      const mode = v.mode;
      const v0 = mode === 'free' ? 0 : v.v0;
      const h = v.h;
      if (mode !== 'up' && !(h > 0)) throw new JK.CalcError('高さ h は 0 より大きくしてください（落下する距離がないため）。投げ上げなら h = 0（地面から投げる）も指定できます。');
      if (mode === 'up' && !(v0 > 0)) throw new JK.CalcError('投げ上げでは初速 v₀ を 0 より大きくしてください。');
      const r = solveFall(mode, v0, h);
      const res = r.up
        ? [
          { label: '最高点に達する時間', tex: sig(r.t1) + SEC },
          { label: '最高点の高さ（地面から）', tex: sig(r.H) + MM },
          { label: '地面に落ちるまでの時間', tex: sig(r.T) + SEC },
          { label: '着地の速さ', tex: sig(r.v) + MS }
        ]
        : [
          { label: '落下にかかる時間', tex: sig(r.T) + SEC },
          { label: '着地の速さ', tex: sig(r.v) + MS }
        ];
      return { result: res, steps: buildFallSteps(r), fig: figFall(r) };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、空気の抵抗は無視する。`;
      if (level === 'basic') {
        // 落下時間は 0.1 秒の位まで測った値（1.0〜5.0 秒。ビルの高さは 5〜120 m ほど）
        const T = rng.pick([1.0, 1.2, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.5, 2.6, 2.8, 3.0, 3.2, 3.4, 3.5, 3.6, 3.8, 4.0, 4.5, 5.0]);
        const h = 0.5 * G * T * T, v = G * T;
        const r = solveFall('free', 0, h);
        return {
          title: 'ビルから落とした小球',
          body: R`ビルの屋上から小球を静かにはなしたところ、$` + T.toFixed(1) + SEC + R`$ 後に地面に達した。` + gtxt + R`次の問いに答えよ。`,
          fig: fallScene('free', 'h', null),
          parts: [
            { label: '(1)', q: R`地面に達する直前の小球の速さ $v$`, type: 'num', answer: P3(v), rel: 0.02, unit: 'm/s' },
            { label: '(2)', q: R`ビルの高さ $h$`, type: 'num', answer: P3(h), rel: 0.02, unit: 'm' }
          ],
          solution: [
            stFallAxis(r, { hUnknown: true, T: T }),
            {
              t: '着地直前の速さ',
              m: [R`v = gt`, R`v = 9.8 \times ` + nf(T) + ' = ' + sig(v) + MS],
              n: R`初速 0 の自由落下では、速さは時間に比例して増えます（$v = v_{0} + gt$ で $v_{0} = 0$）。`,
              easy: R`落とした物は 1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ速くなります。$` + nf(T) + R`$ 秒たてば、$9.8 \times ` + nf(T) + R`$ の速さになっています。`
            },
            {
              t: 'ビルの高さ（落下距離）',
              m: [R`h = \frac{1}{2}gt^{2}`, R`h = \frac{1}{2} \times 9.8 \times ` + nf(T) + R`^{2} = ` + sig(h) + MM],
              n: R`自由落下で $t$ 秒間に落ちる距離は $\frac{1}{2}gt^{2}$ です。これがビルの高さです。`,
              easy: R`落ちる距離は時間の 2 乗に比例します。1 秒で $4.9\,\mathrm{m}$、2 秒で $19.6\,\mathrm{m}$ なので、$` + nf(T) + R`$ 秒なら $4.9 \times ` + nf(T) + R`^{2}$ です。`
            }
          ]
        };
      }
      if (level === 'mid') {
        if (rng.bool(0.5)) {
          // 鉛直投げ下ろし: 着地時刻がきりのよい値になる組
          const T = rng.pick([1.0, 2.0, 3.0]);
          const v0 = rng.pick([4.9, 9.8, 14.7, 19.6]);
          const h = v0 * T + 0.5 * G * T * T;
          const r = solveFall('down', v0, h);
          return {
            title: '投げ下ろした小球',
            body: R`高さ $` + h.toFixed(1) + MM + R`$ のビルの屋上から、小球を鉛直下向きに初速 $` + v0.toFixed(1) + MS + R`$ で投げ下ろした。` + gtxt + R`次の問いに答えよ。`,
            fig: fallScene('down', 'h = ' + h.toFixed(1) + ' m', 'v₀ = ' + v0.toFixed(1) + ' m/s'),
            parts: [
              { label: '(1)', q: R`小球が地面に達するまでの時間 $t$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 's' },
              { label: '(2)', q: R`地面に達する直前の小球の速さ $v$`, type: 'num', answer: P3(r.v), rel: 0.02, unit: 'm/s' }
            ],
            solution: [stFallAxis(r), L1(stFallTime(r)), stFallSpeed(r)]
          };
        }
        const k = rng.pick([1.0, 1.5, 2.0, 2.5, 3.0, 3.5]);
        const v0 = 9.8 * k;
        const r = solveFall('up', v0, 0);
        return {
          title: '真上に投げ上げた小球',
          body: R`地面から小球を鉛直上向きに初速 $` + v0.toFixed(1) + MS + R`$ で投げ上げた。` + gtxt + R`次の問いに答えよ。`,
          fig: fallScene('up0', '', 'v₀ = ' + v0.toFixed(1) + ' m/s'),
          parts: [
            { label: '(1)', q: R`最高点に達するまでの時間 $t_{1}$`, type: 'num', answer: P3(r.t1), rel: 0.02, unit: 's' },
            { label: '(2)', q: R`最高点の地面からの高さ $H$`, type: 'num', answer: P3(r.H), rel: 0.02, unit: 'm' },
            { label: '(3)', q: R`小球が地面にもどってくるまでの時間 $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 's' }
          ],
          solution: [stFallAxis(r), stUpTop(r), L1(stUpLand(r))]
        };
      }
      // adv: 高さ h から投げ上げ（着地時刻がきりのよい値）/ 2 球の出会い
      if (rng.bool(0.5)) {
        const tau = rng.pick([1.0, 1.5, 2.0]);
        const T = rng.pick([4.0, 5.0].map((x) => x + (tau > 1.2 ? 1 : 0)));
        const v0 = 9.8 * tau, h = G * T * (T / 2 - tau);
        const r = solveFall('up', v0, h);
        return {
          title: '崖の上から投げ上げた小球',
          body: R`地面からの高さ $` + h.toFixed(1) + MM + R`$ の崖の上から、小球を鉛直上向きに初速 $` + v0.toFixed(1) + MS + R`$ で投げ上げた。小球は崖の外側へ上がり、やがて地面に落ちた。` + gtxt + R`次の問いに答えよ。`,
          fig: fallScene('up', 'h = ' + h.toFixed(1) + ' m', 'v₀ = ' + v0.toFixed(1) + ' m/s'),
          parts: [
            { label: '(1)', q: R`小球が達する最高点の、地面からの高さ $H$`, type: 'num', answer: P3(r.H), rel: 0.02, unit: 'm' },
            { label: '(2)', q: R`投げてから地面に落ちるまでの時間 $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 's' },
            { label: '(3)', q: R`地面に落ちる直前の速さ $v$`, type: 'num', answer: P3(r.v), rel: 0.02, unit: 'm/s' }
          ],
          solution: [stFallAxis(r), stUpTop(r), L1(stUpLand(r)), L1(stUpSpeed(r))]
        };
      }
      let h, v0, t, y;
      for (let i = 0; i < 200; i++) {
        h = rng.pick([20, 30, 40, 50]);
        v0 = rng.pick([20, 25, 30]);
        t = h / v0;
        y = h - 0.5 * G * t * t;
        if (y > 0.1 * h && t < 2 * v0 / G - 0.3) break;
      }
      const vA = G * t, vB = v0 - G * t;
      return {
        title: '2 つの小球の出会い',
        body: R`高さ $` + h.toFixed(1) + MM + R`$ の位置から小球 A を静かに落とすと同時に、その真下の地面から小球 B を鉛直上向きに初速 $` + v0.toFixed(1) + MS + R`$ で投げ上げた。` + gtxt + R`2 つの小球は空中で出会った。次の問いに答えよ。`,
        fig: fallScene('two', 'h = ' + h.toFixed(1) + ' m', null),
        parts: [
          { label: '(1)', q: R`2 つの小球が出会うのは、投げ上げてから何秒後か`, type: 'num', answer: P3(t), rel: 0.02, unit: 's' },
          { label: '(2)', q: R`出会う位置の地面からの高さ`, type: 'num', answer: P3(y), rel: 0.02, unit: 'm' },
          { label: '(3)', q: R`出会う瞬間の小球 B の速さ`, type: 'num', answer: P3(Math.abs(vB)), rel: 0.02, unit: 'm/s' }
        ],
        solution: [
          {
            t: '2 つの小球の位置を式で表す',
            m: [R`y_{A} = h - \frac{1}{2}gt^{2}`, R`y_{B} = v_{0}t - \frac{1}{2}gt^{2}`],
            n: R`地面を原点、上向きを正として、時刻 $t$ での高さを式にします。A は初速 0 で落下、B は初速 $v_{0}$ で投げ上げです。`,
            easy: R`「出会う」とは、2 つの小球の高さが同じになること、つまり $y_{A} = y_{B}$ です。それぞれの高さを時間 $t$ の式で表すところから始めます。`
          },
          {
            t: '出会う時刻',
            m: [R`y_{A} = y_{B} \;\Rightarrow\; h - \frac{1}{2}gt^{2} = v_{0}t - \frac{1}{2}gt^{2} \;\Rightarrow\; h = v_{0}t`,
              R`t = \frac{h}{v_{0}} = \frac{` + nf(h) + '}{' + nf(v0) + '} = ' + sig(t) + SEC],
            n: R`両辺の $\frac{1}{2}gt^{2}$ が消えて、$t = \frac{h}{v_{0}}$ という簡単な式になります。重力の影響は A も B も同じなので、「B が速さ $v_{0}$ で距離 $h$ を進む時間」と考えても同じです。`,
            easy: R`A も B も、重力で同じだけ下向きにずらされます。だから 2 つの小球の「差」だけを見れば、重力は関係なく、A に向かって B が速さ $v_{0}$ で近づいていくのと同じです。距離 $h$ を速さ $v_{0}$ で進む時間 $\frac{h}{v_{0}}$ が出会うまでの時間になります。`,
            pro: R`出会いの時刻は $t = h/v_{0}$（$g$ に依らない）。落体の 2 物体問題の定石。`
          },
          {
            t: '出会う位置の高さ',
            m: [R`y = h - \frac{1}{2}gt^{2} = ` + nf(h) + R` - \frac{1}{2} \times 9.8 \times ` + fit([t], (x) => h - 0.5 * G * x * x, y)[0] + R`^{2} = ` + sig(y) + MM],
            n: R`出会う時刻を $y_{A}$（または $y_{B}$）の式に代入します。どちらに代入しても同じ値になります。`
          },
          {
            t: '出会う瞬間の B の速さ',
            m: [R`v_{B} = v_{0} - gt = ` + nf(v0) + R` - 9.8 \times ` + fit([t], (x) => v0 - G * x, vB)[0] + ' = ' + sig(vB) + MS].concat(vB < 0 ? [R`\text{速さ} = |v_{B}| = ` + sig(Math.abs(vB)) + MS] : []),
            n: R`上向きを正とした速度は $v_{B} = v_{0} - gt$ です。` + (vB >= 0 ? R`値が正なので、この時刻に B はまだ上昇中です。` : R`値が負なので、この時刻には B はすでに下降中です。速さはその絶対値 $` + sig(Math.abs(vB)) + R`\,\mathrm{m/s}$ です。`)
          }
        ]
      };
    }
  });

  /* =====================================================================
     水平投射・斜方投射
     ===================================================================== */
  // ap: 問題文で与える三角比の近似値 {c, s}（cosθ, sinθ。演習用）。省略すると、角度から計算する
  function solveProj(v0, deg, h, ap) {
    const th = deg * PI / 180;
    const r = { v0: v0, deg: deg, h: h, th: th };
    r.cs = zero(ap ? ap.c : Math.cos(th));
    r.sn = zero(ap ? ap.s : Math.sin(th));
    r.approx = !!ap;
    r.vx = zero(v0 * r.cs);
    r.vy0 = zero(v0 * r.sn);
    r.root = Math.sqrt(r.vy0 * r.vy0 + 2 * G * h);
    r.T = (r.vy0 + r.root) / G;                          // 滞空時間
    r.X = r.vx * r.T;                                    // 水平到達距離
    r.t1 = r.vy0 / G;                                    // 最高点に達する時間
    r.rise = r.vy0 * r.vy0 / (2 * G);
    r.H = h + r.rise;                                    // 最高点の高さ（地面から）
    r.x1 = r.vx * r.t1;                                  // 最高点の水平位置
    r.vyL = r.vy0 - G * r.T;                             // 着地直前の鉛直速度（下向きが負）
    r.v = Math.sqrt(r.vx * r.vx + r.vyL * r.vyL);        // 着地の速さ
    r.phi = Math.atan2(-r.vyL, r.vx) * 180 / PI;         // 着地時に水平となす角（下向き）
    return r;
  }

  // 軌道のグラフ（縦横等倍。軌道が低いときは図の高さを縮める）
  function trajGraph(r, w) {
    const pw = w - 48, phMax = 190;
    const Xe = Math.max(r.X * 1.22, 1e-9), Ye = Math.max(r.H * 1.16, 1e-9);
    const s = Math.max(Xe / pw, Ye / phMax);             // m / px
    const h = Math.round(Math.min(phMax, Math.max(92, Ye / s)) + 40);
    const f = (x) => {                                   // 軌道 y(x)
      if (r.vx <= 0) return NaN;
      const t = x / r.vx;
      return r.h + r.vy0 * t - 0.5 * G * t * t;
    };
    const o = {
      w: w, h: h, x: [0, s * pw], y: [0, s * (h - 40)], equal: true,
      axis: ['x [m]', 'y [m]'],
      points: [], vlines: [], labels: []
    };
    if (r.vx > 0) o.curves = [{ f: f, cls: 'c1', domain: [0, r.X] }];
    else o.segs = [{ x1: 0, y1: r.h, x2: 0, y2: r.H, cls: 'c1' }, { x1: 0, y1: r.H, x2: 0, y2: 0, cls: 'c1' }];
    if (r.h > 0) o.points.push({ x: 0, y: r.h, label: '発射点 h = ' + U.fmt(r.h, 2), cls: 'c3', pos: r.vy0 > 0 ? 'br' : 'tr' });
    else o.points.push({ x: 0, y: 0, cls: 'c3' });
    if (r.vy0 > 0) {
      o.points.push({ x: r.x1, y: r.H, label: '最高点 H = ' + U.fmt(r.H, 2), cls: 'c2', pos: 'tr' });
      o.vlines.push({ x: r.x1 });
    }
    o.points.push({ x: r.X, y: 0, label: 'X = ' + U.fmt(r.X, 2), cls: 'c3', pos: 'tr' });
    return { svg: JK.plot.graph(o), h: h };
  }

  // 初速度の分解図
  function decompFig(r, w, h) {
    const d = JK.plot.draw(w, h);
    const ox = 26, oy = h - 22, L = 74;
    const cs = Math.cos(r.th), sn = Math.sin(r.th);
    d.line(ox - 10, oy, ox + L + 30, oy, { cls: 'dim', w: 1 });
    d.arrow(ox, oy, ox + L * cs, oy - L * sn, { cls: 'c1', label: 'v₀', w: 2.2 });
    if (r.deg > 2) d.angle(ox, oy, 28, 0, r.deg, 'θ', { cls: 'c3' });
    if (r.deg > 2 && r.deg < 88) {
      d.line(ox + L * cs, oy - L * sn, ox + L * cs, oy, { cls: 'c3', dash: true, w: 1.4 });
      d.line(ox, oy, ox + L * cs, oy, { cls: 'c2', dash: true, w: 1.4 });
    }
    const tx = ox + L + 44;
    d.text(tx, 26, '水平方向: 等速直線運動', { cls: 'c2', anchor: 'start', size: 11 });
    d.text(tx, 44, '水平成分 vₓ = v₀cosθ = ' + U.fmt(r.vx, 2) + ' m/s', { anchor: 'start', size: 11 });
    d.text(tx, 68, '鉛直方向: 加速度 −g の運動', { cls: 'c3', anchor: 'start', size: 11 });
    d.text(tx, 86, '鉛直成分 = v₀sinθ = ' + U.fmt(r.vy0, 2) + ' m/s', { anchor: 'start', size: 11 });
    return d.svg();
  }

  function figProj(r) {
    const g = trajGraph(r, 360);
    return stack([{ svg: g.svg, h: g.h }, { svg: decompFig(r, 360, 112), h: 112 }], 360);
  }

  // 問題用の軌道図（実際の形のまま縮尺を合わせる）
  function projScene(r, labs) {
    const d = JK.plot.draw(360, 215);
    const gy = 188, cliffW = 74, lx = 14 + cliffW;
    const s = Math.min(250 / Math.max(r.X, 1e-9), 128 / Math.max(r.H, 1e-9));
    d.hatch(8, gy, 352, gy);
    const ly = gy - r.h * s;
    if (r.h > 0) {
      d.rect(14, ly, cliffW, gy - ly, { cls: 'fg', fill: 'f0' });
      if (labs && labs.h) d.text(14 + cliffW / 2, (ly + gy) / 2 + 4, labs.h, { cls: 'dim', size: 11 });
    }
    const pts = [];
    for (let k = 0; k <= 48; k++) {
      const t = r.T * k / 48;
      pts.push([lx + r.vx * t * s, gy - (r.h + r.vy0 * t - 0.5 * G * t * t) * s]);
    }
    d.poly(pts, { cls: 'c2', close: false, dash: true, w: 1.4 });
    d.circle(lx, ly, 4, { cls: 'fg', fill: 'f3' });
    const cs = Math.cos(r.th), sn = Math.sin(r.th);
    const tipx = lx + 46 * cs, tipy = ly - 46 * sn;
    d.arrow(lx, ly, tipx, tipy, { cls: 'c1', w: 2 });
    if (r.deg < 20) d.text(tipx + 8, tipy - 6, (labs && labs.v0) || 'v₀', { cls: 'c1', size: 11, anchor: 'start' });
    else d.text(tipx - 4, tipy - 8, (labs && labs.v0) || 'v₀', { cls: 'c1', size: 11, anchor: 'end' });
    if (r.deg > 1) {
      d.line(lx, ly, lx + 62, ly, { cls: 'dim', dash: true, w: 1 });
      d.angle(lx, ly, 30, 0, r.deg, 'θ', { cls: 'c3' });
    }
    d.arrow(334, 36, 334, 78, { cls: 'c4', label: 'g', w: 1.8 });
    return d.svg();
  }

  // 問題文で与える三角比の近似値（√3 = 1.73、√2 = 1.41 から決める）。答えも解説もこの値で計算する
  function trigGiven(deg) {
    const sq = deg === 45 ? 1.41 : 1.73;
    return deg === 30 ? { c: sq / 2, s: 0.5 } : (deg === 45 ? { c: sq / 2, s: sq / 2 } : { c: 0.5, s: sq / 2 });
  }
  // 三角比の値を、問題文の値から出す式（解説の「初速度を成分に分ける」の先頭に書く）
  function trigNote(deg) {
    if (deg === 30) return [R`\sin 30\degree = \frac{1}{2} = 0.5`, R`\cos 30\degree = \frac{\sqrt{3}}{2} = \frac{1.73}{2} = 0.865`];
    if (deg === 45) return [R`\sin 45\degree = \cos 45\degree = \frac{\sqrt{2}}{2} = \frac{1.41}{2} = 0.705`];
    return [R`\sin 60\degree = \frac{\sqrt{3}}{2} = \frac{1.73}{2} = 0.865`, R`\cos 60\degree = \frac{1}{2} = 0.5`];
  }

  /* ---------- 解説ステップ（投射） ---------- */
  // o.hideV0: 初速度の大きさ v₀ は求める量（着地時の向きから初速度を求める演習）なので、値を書かない
  function stProjSplit(r, o) {
    o = o || {};
    const known = o.hideV0
      ? R`初速度は水平方向（仰角 $\theta = 0\degree$）で、その大きさ $v_{0}$ は求める量です。発射点の高さは $h = ` + nf(r.h) + MM + R`$ です。`
      : R`初速度 $v_{0} = ` + nf(r.v0) + MS + R`$、仰角 $\theta = ` + nf(r.deg) + R`\degree$、発射点の高さ $h = ` + nf(r.h) + MM + R`$ です。` + (r.deg === 0 ? R`$\theta = 0\degree$ なので水平投射です。` : '');
    return {
      t: '運動を「水平方向」と「鉛直方向」に分ける',
      n: (r.deg === 0 ? R`水平に` : R`斜めに`) + R`投げた物体の運動は、**水平方向**と**鉛直方向**を別々に考えると簡単です。水平方向には力がはたらかないので**等速直線運動**、鉛直方向には重力だけがはたらくので**加速度 $-g$（上向きを正）の等加速度直線運動**（投げ上げと同じ）です。` + known,
      easy: (r.deg === 0 ? R`ボールを水平に投げても` : R`ボールを斜めに投げると`) + R`、軌道は曲がります（放物線）。でも「横方向」と「縦方向」を別々に見ると、どちらも知っている運動です。**横**は、ボールを押す力がないので同じ速さで進み続けます（等速）。**縦**は、真上に投げたボールや落としたボールと同じで、重力で 1 秒ごとに $9.8\,\mathrm{m/s}$ ずつ変わります。この 2 つを同じ時間 $t$ で結びつけて考えるのがコツです。`,
      pro: R`水平・鉛直の独立性が最大の考え方。時間 $t$ が 2 方向をつなぐ唯一の変数。`
    };
  }

  // o.note: 問題文で与えた三角比の値（√3 = 1.73 など）から cosθ・sinθ の値を出す式（TeX の配列）。先頭に書く
  function stProjComp(r, o) {
    const vx = fit([r.cs], (c) => r.v0 * c, r.vx)[0], vy = fit([r.sn], (s) => r.v0 * s, r.vy0)[0];
    return {
      t: '初速度を成分に分ける',
      m: ((o && o.note) || []).concat([R`v_{x} = v_{0}\cos\theta = ` + nf(r.v0) + R` \times ` + vx + ' = ' + sig(r.vx) + MS,
        R`v_{y0} = v_{0}\sin\theta = ` + nf(r.v0) + R` \times ` + vy + ' = ' + sig(r.vy0) + MS]),
      n: R`初速度 $v_{0}$ を水平成分 $v_{0}\cos\theta$ と鉛直成分 $v_{0}\sin\theta$ に分解します（図の下）。` + (r.deg === 0 ? R`水平投射では $\theta = 0\degree$ なので、鉛直成分は 0 です。` : ''),
      easy: R`斜めの矢印（初速度）を、「真横の矢印」と「真上の矢印」の 2 本に置き換えると考えます。直角三角形で、斜辺が $v_{0}$、斜辺と横の辺のなす角が $\theta$ なので、横の辺は $v_{0}\cos\theta$、縦の辺は $v_{0}\sin\theta$ です。$\theta = 30\degree$ なら $\cos\theta \approx 0.87$、$\sin\theta = 0.5$ です。`,
      lv: 2
    };
  }

  function stProjTime(r) {
    let m;
    if (r.vy0 === 0) {              // 水平投射: 鉛直方向は自由落下
      m = [R`h = \frac{1}{2}gT^{2} \;\Rightarrow\; T = \sqrt{\frac{2h}{g}}`,
        R`T = \sqrt{\frac{2 \times ` + nf(r.h) + R`}{9.8}} = ` + sig(r.T) + SEC];
    } else if (r.h === 0) {         // 地面から投げる
      m = [R`y = v_{y0}T - \frac{1}{2}gT^{2} = 0 \;\Rightarrow\; T = \frac{2v_{y0}}{g}`,
        R`T = \frac{2 \times ` + fit([r.vy0], (v) => 2 * v / G, r.T)[0] + R`}{9.8} = ` + sig(r.T) + SEC];
    } else {
      const v = fit([r.vy0], (x) => (x + Math.sqrt(x * x + 2 * G * r.h)) / G, r.T)[0];
      m = [R`y = h + v_{y0}t - \frac{1}{2}gt^{2} = 0 \;\Rightarrow\; T = \frac{v_{y0} + \sqrt{v_{y0}^{2} + 2gh}}{g}`,
        R`T = \frac{` + v + R` + \sqrt{` + pr(v) + R`^{2} + 2 \times 9.8 \times ` + nf(r.h) + R`}}{9.8} = ` + sig(r.T) + SEC];
    }
    return {
      t: '滞空時間（鉛直方向で考える）',
      m: m,
      n: R`地面に落ちる = 高さ $y$ が 0 になる、という条件を鉛直方向の式に入れます。2 次方程式の正の解が滞空時間 $T$ です。` + (r.h === 0 ? R`地面から投げた場合は $T = \frac{2v_{y0}}{g}$ です。` : '') + (r.vy0 === 0 ? R`水平投射では $v_{y0} = 0$ なので $T = \sqrt{\frac{2h}{g}}$（自由落下と同じ時間）です。` : ''),
      easy: R`ボールが空中にいる時間は、「縦方向の運動」だけで決まります。横方向の速さは関係ありません。高さが時間とともに $h + v_{y0}t - \frac{1}{2}gt^{2}$ と変わり、これが 0（地面）になる時刻が着地の時刻です。` + (r.vy0 === 0 ? R`水平に投げた場合は、同じ高さから静かに落とした場合と同じ時間で落ちます。` : ''),
      pro: r.vy0 === 0 ? R`水平投射の滞空時間は自由落下と同じ $\sqrt{2h/g}$（水平の速さに依らない）。`
        : (r.h === 0 ? R`地面から投げるなら $T = \frac{2v_{y0}}{g}$（上りと下りは同じ時間）。時間は鉛直成分 $v_{y0}$ だけで決まり、水平の速さには依らない。`
          : R`崖の上から投げるときは、鉛直方向の 2 次方程式の正の解が $T$。時間は鉛直成分 $v_{y0}$ だけで決まり、水平の速さには依らない。`)
    };
  }

  function stProjRange(r) {
    const d = fit([r.vx, r.T], (a, b) => a * b, r.X);
    return {
      t: '水平到達距離（水平方向で考える）',
      m: [R`X = v_{x}T`, R`X = ` + d[0] + R` \times ` + d[1] + ' = ' + sig(r.X) + MM],
      n: R`水平方向は等速直線運動なので、距離 $=$ 速さ $\times$ 時間です。時間には、鉛直方向で求めた滞空時間 $T$ を使います。`,
      easy: R`横方向は一定の速さ $v_{x}$ で進み続けるので、空中にいた時間 $T$ をかければ、着地点までの横の距離が出ます。「縦で時間を求め、横でその時間だけ進ませる」という順番です。`
    };
  }

  function stProjTop(r) {
    const a = fit([r.vy0], (v) => v / G, r.t1)[0], b = fit([r.vy0], (v) => r.h + v * v / (2 * G), r.H)[0];
    return {
      t: '最高点の高さ',
      m: [R`v_{y} = v_{y0} - gt_{1} = 0 \;\Rightarrow\; t_{1} = \frac{v_{y0}}{g} = \frac{` + a + R`}{9.8} = ` + sig(r.t1) + SEC,
        R`H = h + \frac{v_{y0}^{2}}{2g} = ` + nf(r.h) + R` + \frac{` + pr(b) + R`^{2}}{2 \times 9.8} = ` + sig(r.H) + MM],
      n: R`最高点では鉛直方向の速度が 0 になります（水平方向の速度 $v_{x}$ は残っています）。投げ上げと同じ式で、上昇距離 $\frac{v_{y0}^{2}}{2g}$ を発射点の高さに足します。` + (r.vy0 === 0 ? R`水平投射では、最高点は発射点そのものです。` : ''),
      easy: R`ボールが一番高いところでは、「上へ向かう動き」が一瞬 0 になります（横へ進む動きは続いています）。ここは縦方向だけの投げ上げと同じなので、速さが 0 になる条件から上昇する高さを求めます。`,
      lv: 2
    };
  }

  function stProjLand(r) {
    const a = fit([r.vy0, r.T], (v, t) => v - G * t, r.vyL), b = fit([r.vx, r.vyL], (x, y) => Math.sqrt(x * x + y * y), r.v);
    return {
      t: '着地の速さ',
      m: [R`v_{y} = v_{y0} - gT = ` + a[0] + R` - 9.8 \times ` + a[1] + ' = ' + sig(r.vyL) + MS,
        R`v = \sqrt{v_{x}^{2} + v_{y}^{2}} = \sqrt{` + pr(b[0]) + R`^{2} + ` + pr(b[1]) + R`^{2}} = ` + sig(r.v) + MS].concat(r.approx ? [] : [
        R`\text{確認: } \sqrt{v_{0}^{2} + 2gh} = \sqrt{` + nf(r.v0) + R`^{2} + 2 \times 9.8 \times ` + nf(r.h) + R`} = ` + sig(Math.sqrt(r.v0 * r.v0 + 2 * G * r.h)) + MS]),
      n: R`着地の瞬間の速度は、水平成分 $v_{x}$（変わらない）と鉛直成分 $v_{y}$（下向きなので負）を合成したものです。着地の速さは三平方の定理で求めます。力学的エネルギー保存から得られる $\sqrt{v_{0}^{2} + 2gh}$ と一致します。`,
      easy: R`着地の瞬間の速さは、「横向きの速さ」と「縦向き（下向き）の速さ」を直角三角形の 2 辺として、斜辺の長さを求めて出します（三平方の定理）。横向きの速さは投げたときのまま変わらず、縦向きの速さは落ちるうちにどんどん増えています。`,
      lv: 2
    };
  }

  function buildProjSteps(r) {
    const s = [stProjSplit(r), stProjComp(r), stProjTime(r), stProjRange(r)];
    if (r.vy0 > 0) s.push(stProjTop(r));
    s.push(stProjLand(r));
    return s;
  }

  JK.registerSim({
    id: 'mech-projectile',
    field: '力学',
    unit: 'p-fall',
    title: '水平投射・斜方投射',
    desc: R`初速度 $v_{0}$・仰角 $\theta$・発射点の高さ $h$ から、滞空時間・水平到達距離・最高点の高さ・着地の速さを求めます。$\theta = 0$ で水平投射。放物線の軌道と初速度の分解つき。空気抵抗は無視します。`,
    form: [R`v_{x} = v_{0}\cos\theta,\quad v_{y0} = v_{0}\sin\theta`, R`y = h + v_{y0}t - \frac{1}{2}gt^{2}`, R`X = v_{x}T`],
    inputs: [
      { key: 'v0', label: R`初速度 $v_{0}$`, unit: 'm/s', type: 'num', def: '20', min: 0.01, max: 1000 },
      { key: 'deg', label: R`仰角 $\theta$`, unit: '°', type: 'num', def: '30', min: 0, max: 90, hint: '水平から上向きに測った角。0 で水平投射' },
      { key: 'h', label: R`発射点の高さ $h$`, unit: 'm', type: 'num', def: '0', min: 0, max: 10000, hint: '地面からの高さ。0 なら地面から投げる' }
    ],
    examples: [
      { label: '地面から 45° に投げる', v: { v0: '20', deg: '45', h: '0' } },
      { label: '崖の上から 30° で投げ上げ', v: { v0: '19.6', deg: '30', h: '14.7' } },
      { label: '水平投射', v: { v0: '15', deg: '0', h: '19.6' } }
    ],
    intro: {
      easy: R`ボールを斜めに投げると、きれいな山なりの曲線（**放物線**）をえがいて飛びます。この運動のコツは、**横方向と縦方向を別々に考える**ことです。横には力がはたらかないので**同じ速さで進み続け**（等速直線運動）、縦には重力がはたらくので**投げ上げ・落下と同じ運動**（加速度 $g$ の等加速度直線運動）になります。2 つの運動は「同じ時間 $t$」でつながっています。`,
      normal: R`初速度を $v_{x} = v_{0}\cos\theta$、$v_{y0} = v_{0}\sin\theta$ に分解し、水平は等速、鉛直は加速度 $-g$ として扱います。滞空時間は鉛直方向で $y = 0$ から求め、水平到達距離は $X = v_{x}T$ です。`,
      pro: R`地面から投げる場合は $T = \frac{2v_{0}\sin\theta}{g}$、$X = \frac{v_{0}^{2}\sin 2\theta}{g}$（$45\degree$ で最大）、$H = \frac{v_{0}^{2}\sin^{2}\theta}{2g}$。水平投射の滞空時間は自由落下と同じ。着地の速さは $\sqrt{v_{0}^{2} + 2gh}$ で一発。`
    },
    compute(v) {
      if (v.deg === 0 && v.h === 0) throw new JK.CalcError('発射点の高さ h が 0 のまま水平に投げる（θ = 0）と、すぐ地面に着いてしまい運動になりません。仰角 θ か高さ h を大きくしてください。');
      const r = solveProj(v.v0, v.deg, v.h);
      const res = [
        { label: '滞空時間 T', tex: sig(r.T) + SEC },
        { label: '水平到達距離 X', tex: sig(r.X) + MM },
        { label: '最高点の高さ H（地面から）', tex: sig(r.H) + MM },
        { label: '着地の速さ v', tex: sig(r.v) + MS },
        { label: '着地時の向き（水平から下向き）', tex: sig(r.phi) + R`\degree` }
      ];
      return { result: res, steps: buildProjSteps(r), fig: figProj(r) };
    },

    exercise(rng, level) {
      const gtxt = R`重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、空気の抵抗は無視する。`;
      if (level === 'basic') {
        // 水平投射
        const T = rng.pick([1.0, 2.0, 3.0]);
        const h = 0.5 * G * T * T;
        const v0 = rng.pick([5.0, 8.0, 10.0, 12.0, 15.0, 20.0]);
        const r = solveProj(v0, 0, h);
        return {
          title: '水平投射',
          body: R`高さ $` + h.toFixed(1) + MM + R`$ の崖の上から、小球を水平方向に初速 $` + v0.toFixed(1) + MS + R`$ で投げ出した。` + gtxt + R`次の問いに答えよ。`,
          fig: projScene(r, { h: 'h = ' + h.toFixed(1) + ' m', v0: 'v₀ = ' + v0.toFixed(1) + ' m/s' }),
          parts: [
            { label: '(1)', q: R`小球が地面に達するまでの時間 $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 's' },
            { label: '(2)', q: R`崖の真下から、小球が地面に達した点までの水平距離 $X$`, type: 'num', answer: P3(r.X), rel: 0.02, unit: 'm' }
          ],
          solution: [stProjSplit(r), stProjTime(r), stProjRange(r)]
        };
      }
      if (level === 'mid') {
        // 地面からの斜方投射
        const deg = rng.pick([30, 45, 60]);
        const v0 = rng.pick([9.8, 14.7, 19.6, 24.5, 29.4, 34.3, 39.2]);
        // 問題文で与える √3 = 1.73、√2 = 1.41 から三角比の値を決める（答えも解説もこの値で計算する）
        const r = solveProj(v0, deg, 0, trigGiven(deg));
        const tr = U.exactTrig(deg);
        return {
          title: '地面からの斜方投射',
          body: R`水平な地面から、小球を水平方向に対して $` + deg + R`\degree$ の向きに、初速 $` + v0.toFixed(1) + MS + R`$ で投げ上げた。` + gtxt + R`$\sin ` + deg + R`\degree = ` + tr.sin + R`$、$\cos ` + deg + R`\degree = ` + tr.cos + R`$、` + (deg === 45 ? R`$\sqrt{2} = 1.41$` : (deg === 60 ? R`$\sqrt{3} = 1.73$` : R`$\sqrt{3} = 1.73$`)) + R` として、次の問いに答えよ。`,
          fig: projScene(r, { v0: 'v₀ = ' + v0.toFixed(1) + ' m/s' }),
          parts: [
            { label: '(1)', q: R`最高点の地面からの高さ $H$`, type: 'num', answer: P3(r.H), rel: 0.02, unit: 'm' },
            { label: '(2)', q: R`投げてから地面に落ちるまでの時間 $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 's' },
            { label: '(3)', q: R`落下点までの水平距離 $X$`, type: 'num', answer: P3(r.X), rel: 0.02, unit: 'm' }
          ],
          // 成分の式（初速度の分解）も、最高点・滞空時間・到達距離のすべての出発点なので lv 1
          solution: [stProjSplit(r), L1(stProjComp(r, { note: trigNote(deg) })), L1(stProjTop(r)), stProjTime(r), stProjRange(r)]
        };
      }
      // adv
      if (rng.bool(0.5)) {
        // 崖の上から 30° で投げ上げ（着地時刻がきりのよい値になる組）
        const pair = rng.pick([[0.5, 3.0], [0.5, 4.0], [1.0, 4.0], [1.0, 5.0], [1.5, 4.0], [1.5, 5.0], [2.0, 5.0], [2.0, 6.0]]);
        const tau = pair[0], T = pair[1];
        const v0 = 2 * G * tau;                 // 30° で v_y0 = g·tau
        const h = G * T * (T / 2 - tau);
        const r = solveProj(v0, 30, h, trigGiven(30));
        return {
          title: '崖の上からの斜方投射',
          body: R`地面からの高さ $` + h.toFixed(1) + MM + R`$ の崖の上から、小球を水平方向に対して $30\degree$ 上向きに、初速 $` + v0.toFixed(1) + MS + R`$ で投げた。` + gtxt + R`$\sin 30\degree = \frac{1}{2}$、$\cos 30\degree = \frac{\sqrt{3}}{2}$、$\sqrt{3} = 1.73$ として、次の問いに答えよ。`,
          fig: projScene(r, { h: 'h = ' + h.toFixed(1) + ' m', v0: 'v₀ = ' + v0.toFixed(1) + ' m/s' }),
          parts: [
            { label: '(1)', q: R`小球が達する最高点の、地面からの高さ $H$`, type: 'num', answer: P3(r.H), rel: 0.02, unit: 'm' },
            { label: '(2)', q: R`投げてから地面に落ちるまでの時間 $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 's' },
            { label: '(3)', q: R`崖の真下から、落下点までの水平距離 $X$`, type: 'num', answer: P3(r.X), rel: 0.02, unit: 'm' }
          ],
          solution: [stProjSplit(r), L1(stProjComp(r, { note: trigNote(30) })), L1(stProjTop(r)), stProjTime(r), stProjRange(r)]
        };
      }
      // 水平投射で、着地時の速度の向きから初速度を求める（tan は問題文の値: tan 45° = 1、tan 60° = √3 = 1.73）
      const h = rng.pick([4.9, 19.6, 44.1, 78.4]);
      const ang = rng.pick([45, 60]);
      const tn = ang === 45 ? 1 : 1.73;
      const vyL = Math.sqrt(2 * G * h);
      const v0 = vyL / tn;
      const r = solveProj(v0, 0, h);
      const trg = ang === 45 ? '1' : R`\sqrt{3}`;
      return {
        title: '着地時の向きから初速度を求める',
        body: R`高さ $` + h.toFixed(1) + MM + R`$ の崖の上から、小球を水平方向に投げた。小球は地面に達する直前に、速度の向きが水平方向と $` + ang + R`\degree$ の角をなしていた。` + gtxt + R`$\tan ` + ang + R`\degree = ` + trg + R`$` + (ang === 60 ? R`、$\sqrt{3} = 1.73$` : '') + R` として、次の問いに答えよ。`,
        fig: projScene(r, { h: 'h = ' + h.toFixed(1) + ' m' }),
        parts: [
          { label: '(1)', q: R`地面に達する直前の、速度の鉛直成分の大きさ $|v_{y}|$`, type: 'num', answer: P3(vyL), rel: 0.02, unit: 'm/s' },
          { label: '(2)', q: R`投げ出したときの初速度 $v_{0}$`, type: 'num', answer: P3(v0), rel: 0.02, unit: 'm/s' },
          { label: '(3)', q: R`崖の真下から落下点までの水平距離 $X$`, type: 'num', answer: P3(r.X), rel: 0.02, unit: 'm' }
        ],
        solution: [
          stProjSplit(r, { hideV0: true }),
          {
            t: '着地直前の鉛直成分',
            m: [R`v_{y}^{2} = 2gh \;\Rightarrow\; |v_{y}| = \sqrt{2gh} = \sqrt{2 \times 9.8 \times ` + nf(h) + '} = ' + sig(vyL) + MS],
            n: R`水平投射の鉛直方向は、初速 0 の自由落下です。高さ $h$ を落ちた後の速さは $\sqrt{2gh}$ です。`,
            easy: R`横に投げたボールも、縦方向だけを見れば「静かに落とした物」と同じです。高さ $h$ を落ちた後の下向きの速さは、落下の公式 $v^{2} = 2gh$ で求められます。`
          },
          {
            t: '速度の向きから初速度を求める',
            m: [R`\tan ` + ang + R`\degree = \frac{|v_{y}|}{v_{x}} \;\Rightarrow\; v_{0} = v_{x} = \frac{|v_{y}|}{\tan ` + ang + R`\degree}`,
              R`v_{0} = \frac{` + fit([vyL], (v) => v / tn, v0)[0] + '}{' + (ang === 45 ? '1' : '1.73') + '} = ' + sig(v0) + MS],
            n: R`着地の瞬間の速度は、水平成分 $v_{x} = v_{0}$（投げ出したときのまま）と鉛直成分 $|v_{y}|$ の合成です。水平となす角の $\tan$ は「縦の速さ ÷ 横の速さ」なので、そこから $v_{0}$ が求まります。`,
            easy: R`着地の瞬間の速度の矢印は、斜め下を向いています。その矢印を「横成分」と「縦成分」の直角三角形に分けると、$\tan$（角度）$= \frac{\text{縦}}{\text{横}}$ です。縦成分は (1) で分かっているので、角度の $\tan$ の値で割れば横成分、つまり初速度が出ます。`
          },
          stProjTime(r),
          stProjRange(r)
        ]
      };
    }
  });
})();
