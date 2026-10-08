/* 物理・力学 — 運動方程式: 斜面上をすべる物体
   ※ シミュレーターモジュールの実装見本。他のシミュレーターもこの構成
     （intro → compute: result/steps/fig → exercise: 乱数で問題・図・設問・解説を生成）に揃える。 */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const G = 9.8;

  const sig = (x) => U.sig(x, 3);
  // 与えられた値の表示: 入力した値をそのまま（有効数字 10 桁まで。末尾の 0 は省く）。丸めて見せると、表示の数値どうしの計算が結果と合わなくなる
  const nf = (x) => {
    if (typeof x !== 'number' || !isFinite(x)) return U.fmt(x);
    const s = String(Number(x.toPrecision(10))), m = /^(-?[\d.]+)e([+-]?\d+)$/.exec(s);
    return m ? m[1] + R` \times 10^{` + Number(m[2]) + '}' : s;
  };
  const P3 = (x) => U.roundSig(x, 3);
  const MS = R`\,\mathrm{m/s}`, MS2 = R`\,\mathrm{m/s^{2}}`, NN = R`\,\mathrm{N}`, SEC = R`\,\mathrm{s}`;

  // 途中の値の表示。x を有効数字 n 桁で書く（ちょうどの値は末尾の 0 を省く）
  const showN = (x, n) => {
    if (x === 0 || !isFinite(x)) return U.fmt(x);
    const r = U.roundSig(x, n), e = Math.floor(Math.log10(Math.abs(r)));
    if (e >= 7 || e < -3) return U.sig(r, n);
    let s = r.toFixed(Math.max(0, n - 1 - e));
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  };
  // 有効数字 3 桁に丸める位置のちょうど真ん中（36.55 のような半端な値）か。四捨五入と偶数丸めで結果が割れ得るので、途中の値を代入した式では避ける
  const onTie = (y) => {
    if (typeof y !== 'number' || !isFinite(y) || y === 0) return false;
    const ulp = Math.pow(10, Math.floor(Math.log10(Math.abs(y))) - 2);
    return Math.abs(Math.abs(y - P3(y)) - ulp / 2) <= 1e-6 * ulp;
  };
  // 途中の値 vals を、あとの式 f（表示した値を代入して計算する関数。複数の結果は配列で返す）の結果が、丸める前の値から計算した target
  // （数値または配列）と有効数字 3 桁で一致する最小の桁数で書く。生徒が表示の数値どうしを電卓で計算しても、表示の結果と最後の桁まで合う
  // （計算結果が丸めの境目ちょうどになる桁数は採らない）
  const fit = (vals, f, target) => {
    const want = [].concat(target).map(P3);
    for (let n = 3; n <= 12; n++) {
      const got = [].concat(f.apply(null, vals.map((x) => U.roundSig(x, n))));
      if (got.every((g, i) => P3(g) === want[i] && !onTie(g))) return vals.map((x) => showN(x, n));
    }
    return vals.map((x) => showN(x, 12));
  };
  // 途中の値を 3 桁より多い桁（s）で式に入れたときの断り書き（3 桁と同じなら書かない）。sym: 記号、unit: 単位（TeX）
  const carry = (sym, s, x, unit) => (s === showN(x, 3) ? '' : R`式に入れる $` + sym + R`$ は、有効数字を増やして書いた値 $` + s + unit + R`$ です。`);

  // 斜面・物体・力の矢印を描く
  function figure(deg, mu, opt) {
    opt = opt || {};
    const d = JK.plot.draw(360, 230);
    const th = deg * Math.PI / 180;
    const x0 = 40, y0 = 195, base = 270;
    const top = Math.min(165, base * Math.tan(th));          // 斜面の高さ（描画上の上限あり）
    const bx = top / Math.tan(th);                           // 斜面の水平長さ
    const xr = x0 + bx;                                      // 斜面の下端は左、上端は右
    d.hatch(x0 - 20, y0, x0 + base + 30, y0);
    d.poly([[x0, y0], [xr, y0], [xr, y0 - top]], { cls: 'fg', fill: 'f0' });
    d.angle(x0, y0, 34, 0, deg, opt.angLabel || 'θ=' + U.fmt(deg) + '°', { cls: 'c3' });
    // 物体（斜面の中ほど）
    const t = 0.55, cx = x0 + bx * t, cy = y0 - top * t;
    const ux = Math.cos(th), uy = -Math.sin(th);             // 斜面に沿って上向き
    const nx = -Math.sin(th), ny = -Math.cos(th);            // 斜面に垂直で外向き
    const bw = 42, bh = 26;
    const mx = cx + nx * bh / 2, my = cy + ny * bh / 2;      // 物体の中心
    d.rect(mx - bw / 2, my - bh / 2, bw, bh, { cls: 'fg', fill: 'f1', rot: deg, ox: mx, oy: my, rx: 3 });
    d.arrow(mx, my, mx, my + 62, { cls: 'c2', label: 'mg' });
    d.arrow(mx, my, mx + nx * 52, my + ny * 52, { cls: 'c1', label: 'N' });
    if (mu > 0) d.arrow(mx, my, mx + ux * 44, my + uy * 44, { cls: 'c3', label: "f = μ'N", lpos: -1 });
    d.arrow(cx - ux * 40 + nx * 44, cy - uy * 40 + ny * 44, cx - ux * 86 + nx * 44, cy - uy * 86 + ny * 44, { cls: 'c4', label: 'a', w: 1.6 });
    if (opt.caption) d.text(180, 18, opt.caption, { size: 12 });
    return d.svg();
  }

  // tr: 三角比の値 { s: sinθ, c: cosθ }。演習では、問題文で指定した値（√3 = 1.73 など）で計算するので、その値を渡す。省略すると θ から求める
  function solve(m, deg, mu, L, tr) {
    const th = deg * Math.PI / 180;
    const s = tr ? tr.s : Math.sin(th), c = tr ? tr.c : Math.cos(th);
    const N = m * G * c;
    const fr = mu * N;
    const a = G * (s - mu * c);
    return { N: N, f: fr, a: a, v: a > 0 ? Math.sqrt(2 * a * L) : NaN, t: a > 0 ? Math.sqrt(2 * L / a) : NaN, th: th, s: s, c: c };
  }

  function trigTex(deg) {
    const e = U.exactTrig(deg);
    return e ? { s: e.sin, c: e.cos } : { s: U.fmt(Math.sin(deg * Math.PI / 180)), c: U.fmt(Math.cos(deg * Math.PI / 180)) };
  }

  // 演習で使う斜面の角のうち、問題文で「√3 = 1.73」「√2 = 1.41」としてよいとする角の三角比（答えも解説もこの値で計算する）
  const NAMED = {
    30: { s: 0.5, c: 0.865, sS: '0.5', cS: '0.865', root: { 3: '1.73' } },
    45: { s: 0.705, c: 0.705, sS: '0.705', cS: '0.705', root: { 2: '1.41' } },
    60: { s: 0.865, c: 0.5, sS: '0.865', cS: '0.5', root: { 3: '1.73' } }
  };

  // 斜面の角の sin, cos の値を示す行（TeX）。15° 刻みの角は厳密値も書く。root: 問題文が指定した根号の値（演習のみ）
  function trigLine(deg, sS, cS, root, unnamed) {
    const e = unnamed ? null : U.exactTrig(deg);
    const piece = (name, tex, val) => {
      if (!tex) return name + ' = ' + val;
      let s = name + ' = ' + tex;
      if (root && /\\sqrt\{\d\}/.test(tex)) s += ' = ' + tex.replace(/\\sqrt\{(\d)\}/g, (all, k) => root[k]);
      return s + ' = ' + val;
    };
    const ang = unnamed ? R`\theta` : U.fmt(deg) + R`\degree`;
    if (e && e.sin === e.cos && sS === cS) {
      const tex = e.sin;
      let s = R`\sin ` + ang + R` = \cos ` + ang + ' = ' + tex;
      if (root && /\\sqrt\{\d\}/.test(tex)) s += ' = ' + tex.replace(/\\sqrt\{(\d)\}/g, (all, k) => root[k]);
      return s + ' = ' + sS;
    }
    return piece(R`\sin ` + ang, e && e.sin, sS) + R`,\qquad ` + piece(R`\cos ` + ang, e && e.cos, cS);
  }

  // 解説に出す三角比（値の文字列と、その値を示す行）。spec は演習で問題文が指定した値。
  // 省略した計算機では、θ から求めた値を、その値で計算し直した結果（N, f, a, v, t）が丸める前の結果と 3 桁で一致する桁数で書く
  function trigFor(m, deg, mu, L, r, spec) {
    let sS, cS;
    if (spec) { sS = spec.sS; cS = spec.cS; } else {
      let n = 3;
      for (; n <= 12; n++) {
        const q = solve(m, deg, mu, L, { s: U.roundSig(r.s, n), c: U.roundSig(r.c, n) });
        if (['N', 'f', 'a', 'v', 't'].every((k) => (isNaN(r[k]) && isNaN(q[k])) || P3(q[k]) === P3(r[k]))) break;
      }
      sS = showN(r.s, Math.min(n, 12)); cS = showN(r.c, Math.min(n, 12));
    }
    return { sS: sS, cS: cS, line: trigLine(deg, sS, cS, spec && spec.root, spec && spec.unnamed) };
  }

  // o.trig: trigFor の結果 / o.given: 演習で、問題の値と記号を結びつける文 / o.askN: 演習で垂直抗力 N を問うとき true（N を求める段を lv 1 にする）
  function buildSteps(m, deg, mu, L, r, o) {
    o = o || {};
    const smooth = mu === 0;
    const sv = o.trig.sS, cv = o.trig.cS;
    // 加速度 a の式に与えられた値を代入した形（途中の値を使わず、与えられた値から直接計算する）
    const aExpr = smooth ? R`9.8 \times ` + sv : R`9.8 \times (` + sv + ' - ' + nf(mu) + R` \times ` + cv + ')';
    const steps = [
      {
        t: '力を図示して、斜面方向と垂直方向に分ける',
        m: [o.trig.line],
        n: (o.given || '') + R`物体にはたらく力は、重力 $mg$（鉛直下向き）、垂直抗力 $N$（斜面に垂直）` + (smooth ? '' : R`、動摩擦力 $f$（運動と逆向き = 斜面に沿って上向き）`) + R`です。重力を**斜面に平行な成分 $mg\sin\theta$** と**斜面に垂直な成分 $mg\cos\theta$** に分けます。斜面の角の $\sin\theta$, $\cos\theta$ の値は上の式のとおりです。`,
        easy: R`斜面の問題は、座標の軸を「斜面に沿った向き」と「斜面に垂直な向き」に取るのがコツです。物体は斜面にめり込みも浮き上がりもしないので、垂直な向きの力はつり合い、動きは斜面に沿った向きだけで起こります。`,
        pro: R`$\theta \to 0$（水平）で斜面方向の成分が 0、$\theta \to 90\degree$ で $mg$ になるのは $\sin\theta$ の方、と極端な場合で成分を確認できます。`
      },
      {
        t: '斜面に垂直な方向: 力のつり合い',
        m: [R`N = mg\cos\theta`, R`N = ` + nf(m) + R` \times 9.8 \times ` + cv + ' = ' + sig(r.N) + NN],
        n: R`垂直方向には動かないので、垂直抗力は重力の垂直成分と等しくなります。`,
        lv: o.askN ? 1 : 2
      }
    ];
    if (!smooth) {
      steps.push({
        t: '動摩擦力',
        m: [R`f = \mu' N = \mu' mg\cos\theta`, R`f = ` + nf(mu) + R` \times ` + nf(m) + R` \times 9.8 \times ` + cv + ' = ' + sig(r.f) + NN],
        n: R`すべっている物体には、運動を妨げる向きに動摩擦力 $\mu' N$ がはたらきます。`,
        easy: R`摩擦力は「面を押す力（垂直抗力）」に比例します。重い物ほど、また面に強く押し付けるほど動かしにくいのと同じです。`,
        lv: 2
      });
    }
    steps.push({
      t: '斜面方向: 運動方程式を立てる',
      m: smooth
        ? [R`ma = mg\sin\theta`, R`a = g\sin\theta = ` + aExpr + ' = ' + sig(r.a) + MS2]
        : [R`ma = mg\sin\theta - \mu' mg\cos\theta`, R`a = g(\sin\theta - \mu'\cos\theta) = ` + aExpr + ' = ' + sig(r.a) + MS2],
      n: R`すべり下りる向きを正として $ma = (\text{正の向きの力}) - (\text{逆向きの力})$。両辺の $m$ が消えるので、加速度は質量によりません。`,
      easy: R`運動方程式 $ma = F$ は「物体の加速度 $a$ は、受けている力の合計 $F$ に比例し、質量 $m$ に反比例する」という法則です。まず力の合計を求め、それを $m$ で割れば加速度が出ます。`,
      pro: R`$a = g(\sin\theta - \mu'\cos\theta)$ は結果として覚えてよい形。$\tan\theta \le \mu'$ ならすべり下りません。`
    });
    steps.push({
      t: '距離 L をすべったときの速さと時間',
      m: [R`v^{2} - 0^{2} = 2aL \;\Rightarrow\; v = \sqrt{2aL}`,
        R`v = \sqrt{2 \times ` + aExpr + R` \times ` + nf(L) + '} = ' + sig(r.v) + MS,
        R`L = \frac{1}{2}at^{2} \;\Rightarrow\; t = \sqrt{\frac{2L}{a}}`,
        R`t = \sqrt{\frac{2 \times ` + nf(L) + '}{' + aExpr + R`}} = ` + sig(r.t) + SEC],
      n: R`加速度が一定なので、等加速度直線運動の公式（初速度 0）が使えます。$a$ には、上で求めた式（与えられた値を代入したもの）をそのまま入れています。`,
      easy: R`加速度が一定の運動では、$v^{2} - v_{0}^{2} = 2ax$（時間を含まない式）と $x = v_{0}t + \frac{1}{2}at^{2}$ が使えます。ここでは静かに放すので $v_{0} = 0$ です。`
    });
    return steps;
  }

  /* =====================================================================
     adv（難関）の出題: mid の「あらい斜面をすべり下りる」より一段難しい 2 題材
       push: 水平な力 F で物体を斜面に押しつけながらすべり上がらせる（垂直抗力が F の成分で増える。一定の速さで上げる F₀）
       pull: 斜面上の物体 A と、滑車を通してつるした物体 B（A の加速度・張力・糸が切れたあとの減速）
     ===================================================================== */
  const MM = R`\,\mathrm{m}`;
  const ASIN6 = Math.asin(0.6) * 180 / Math.PI, ASIN8 = Math.asin(0.8) * 180 / Math.PI;

  // 斜面の角 ag の扱い。30°・45°・60° は sin, cos の厳密値を書き、「√3 = 1.73」「√2 = 1.41」の値で計算する。
  // 3:4:5 の直角三角形で決まる角（ag.s, ag.c = sinθ, cosθ の値）は、角を θ と書いて sinθ, cosθ の値を示す
  function angleOf(ag) {
    const deg = ag.deg, named = ag.s == null;
    const tr = named ? trigTex(deg) : { s: ag.s, c: ag.c };
    const spec = named ? NAMED[deg] : { s: Number(ag.s), c: Number(ag.c), sS: ag.s, cS: ag.c, unnamed: true };
    return {
      deg: deg, named: named, spec: spec, angLabel: named ? null : 'θ',
      angTxt: named ? R` $` + deg + R`\degree$ の角` : R`角 $\theta$ `,
      trigTxt: named
        ? R`$\sin ` + deg + R`\degree = ` + tr.s + R`,\ \cos ` + deg + R`\degree = ` + tr.c + R`$、` + (deg === 45 ? R`$\sqrt{2} = 1.41$` : R`$\sqrt{3} = 1.73$`) + R` として、`
        : R`$\sin\theta = ` + tr.s + R`,\ \cos\theta = ` + tr.c + R`$ として、`
    };
  }

  // 地面・斜面・角の弧を描き、斜面上の位置 t（下端 0 〜 上端 1）の幾何を返す。斜面の下端は左、上端は右
  function inclineBase(d, deg, o) {
    const th = deg * Math.PI / 180;
    const x0 = o.x0, y0 = o.y0;
    const top = Math.min(o.maxTop, o.base * Math.tan(th));    // 斜面の高さ（描画上の上限あり）
    const bx = top / Math.tan(th);                            // 斜面の水平長さ
    const xr = x0 + bx;
    d.hatch(x0 - o.padL, y0, xr + o.padR, y0);
    d.poly([[x0, y0], [xr, y0], [xr, y0 - top]], { cls: 'fg', fill: 'f0' });
    // 角の弧と記号（記号は弧と斜面の線に重ならないよう、弧の外側に置く）
    d.arc(x0, y0, 30, 0, deg, { cls: 'c3' });
    d.text(x0 + 52 * Math.cos(th * 0.42), y0 - 52 * Math.sin(th * 0.42) + 4, o.angLabel || U.fmt(deg) + '°', { cls: 'c3', size: 12, italic: true });
    return {
      th: th, x0: x0, y0: y0, top: top, bx: bx, xr: xr, cx: x0 + bx * o.t, cy: y0 - top * o.t,
      ux: Math.cos(th), uy: -Math.sin(th),                    // 斜面に沿って上向き
      nx: -Math.sin(th), ny: -Math.cos(th)                    // 斜面に垂直で外向き
    };
  }
  const BW = 42, BH = 26;                                     // 斜面上の物体の大きさ
  function blockOnSlope(d, g, deg, fill, label) {
    const mx = g.cx + g.nx * BH / 2, my = g.cy + g.ny * BH / 2;
    d.rect(mx - BW / 2, my - BH / 2, BW, BH, { cls: 'fg', fill: fill || 'f1', rx: 3, rot: deg, ox: mx, oy: my });
    if (label) d.text(mx, my + 5, label, { size: 14, bold: true });
    return { mx: mx, my: my };
  }

  // 題材 push の図: 物体に、重力・垂直抗力・動摩擦力（下向き）と、斜面に向かう水平な力 F がはたらく
  function figPush(deg, o) {
    o = o || {};
    const d = JK.plot.draw(360, 230);
    const g = inclineBase(d, deg, { x0: 70, y0: 200, base: 230, maxTop: 150, t: 0.6, padL: 50, padR: 20, angLabel: o.angLabel });
    const b = blockOnSlope(d, g, deg);
    const mx = b.mx, my = b.my;
    d.arrow(mx, my, mx, my + 48, { cls: 'c2', label: 'mg' });
    d.arrow(mx, my, mx + g.nx * 56, my + g.ny * 56, { cls: 'c1', label: 'N' });
    d.arrow(mx, my, mx - g.ux * 42, my - g.uy * 42, { cls: 'c3', label: 'f', lpos: -1 });
    // 水平な力 F: 物体の左の面に向かって、斜面に押しつける向き
    const tx = mx - Math.min(BW / 2 / Math.cos(g.th), BH / 2 / Math.sin(g.th)) - 1;
    d.arrow(tx - 58, my, tx, my, { cls: 'fg', w: 2.6 });
    d.text(tx - 29, my - 9, 'F', { size: 13 });
    // 加速度の向き（斜面に沿って上向き）
    d.arrow(g.cx + g.ux * 30 + g.nx * 42, g.cy + g.uy * 30 + g.ny * 42, g.cx + g.ux * 78 + g.nx * 42, g.cy + g.uy * 78 + g.ny * 42, { cls: 'c4', label: 'a', w: 1.6 });
    if (o.caption) d.text(180, 222, o.caption, { size: 12 });
    return d.svg();
  }

  // 題材 push: spec = { s, c }（問題文で指定した sinθ, cosθ の値）。m: 質量、mu: 動摩擦係数、F: 水平な力
  function solvePush(m, spec, mu, F) {
    const s = spec.s, c = spec.c, W = m * G;
    const N = W * c + F * s;                                  // 斜面に垂直な方向のつり合い
    const f = mu * N;
    const a = (F * c - W * s - f) / m;                        // 斜面に平行な方向の運動方程式（上向きが正）
    const F0 = W * (s + mu * c) / (c - mu * s);               // a = 0 となる力
    return { m: m, mu: mu, F: F, s: s, c: c, W: W, N: N, f: f, a: a, F0: F0 };
  }
  // 加速度が 1.5〜6.0 m/s² になる、5 N きざみの力 F（100 N 以下）
  function pushForces(m, spec, mu) {
    const out = [];
    for (let F = 5; F <= 100; F += 5) {
      const a = solvePush(m, spec, mu, F).a;
      if (a >= 1.5 && a <= 6.0) out.push(F);
    }
    return out;
  }

  // 題材 push の解説。o.trig: trigFor の結果 / o.given: 問題の値と記号を結びつける文 / o.M, o.MU, o.FS: 与えられた値の表示
  function pushSteps(r, o) {
    const sv = o.trig.sS, cv = o.trig.cS, M = o.M, MU = o.MU, FS = o.FS;
    // 動摩擦力 f と加速度 a に代入する N（丸めた値を代入して結果が 1 つずれる、を防ぐため、必要なら桁を増やす）
    const Ns = fit([r.N], (n) => [r.mu * n, (r.F * r.c - r.W * r.s - r.mu * n) / r.m], [r.f, r.a])[0];
    return [
      {
        t: R`力を図に描き、水平な力 $F$ を斜面方向と垂直方向に分ける`,
        m: [R`\text{斜面に平行な成分: } F\cos\theta\ (\text{斜面に沿って上向き})`, R`\text{斜面に垂直な成分: } F\sin\theta\ (\text{斜面に押しつける向き})`, o.trig.line],
        n: (o.given || '') + R`物体にはたらく力は、重力 $mg$（鉛直下向き）、垂直抗力 $N$（斜面に垂直）、水平な力 $F$、動摩擦力 $f$（上向きにすべっているので、運動と逆向き = 斜面に沿って下向き）の 4 つです。重力は、斜面に平行な成分 $mg\sin\theta$ と、斜面に垂直な成分 $mg\cos\theta$ に分けます。水平な力 $F$ も同じように、斜面に平行な成分 $F\cos\theta$ と、斜面に垂直な成分 $F\sin\theta$ に分けます。斜面の角の $\sin\theta$, $\cos\theta$ の値は上の式のとおりです。`,
        easy: R`斜面の問題では、力を「斜面に沿った向き」と「斜面に垂直な向き」に分けて考えます。重力だけでなく、この問題の水平な力 $F$ も、斜面に対して斜めなので、この 2 つの向きの成分に分けます。水平な力は斜面に向かって押す力なので、斜面に沿った成分 $F\cos\theta$ は物体を斜面の上へ押し上げ、斜面に垂直な成分 $F\sin\theta$ は物体を斜面に押しつけます。押しつける力が増えるぶん、垂直抗力も動摩擦力も大きくなります。`,
        pro: R`斜面に平行な成分は、重力では $\sin\theta$ を、水平な力では $\cos\theta$ をかけます。図で角 $\theta$ の位置を確かめて、$\sin$ と $\cos$ を取り違えないようにします。`
      },
      {
        t: R`(1) 斜面に垂直な方向: 力のつり合い`,
        m: [R`N = mg\cos\theta + F\sin\theta`, R`N = ` + M + R` \times 9.8 \times ` + cv + ' + ' + FS + R` \times ` + sv + ' = ' + sig(r.N) + NN],
        n: R`斜面に垂直な方向には動かないので、力がつり合います。斜面に向かう力は、重力の垂直成分 $mg\cos\theta$ と、水平な力の垂直成分 $F\sin\theta$ の 2 つです。斜面から離れる向きの力は、垂直抗力 $N$ だけです。水平な力で斜面に押しつけているぶん、$N$ は $mg\cos\theta$ より大きくなります。`,
        easy: R`物体は斜面にめり込むことも浮き上がることもないので、斜面に垂直な向きの力はつり合っています。斜面に向かって物体を押す力は、重力の垂直成分 $mg\cos\theta$ と水平な力の垂直成分 $F\sin\theta$ の合計です。斜面は、これと同じ大きさの力で物体を押し返します。この押し返す力が垂直抗力 $N$ です。`,
        pro: R`水平な力が斜面に向かう向きなら、$N$ は増えます。$N = mg\cos\theta$ のままにしないよう注意します（摩擦力の計算も狂います）。`
      },
      {
        t: '動摩擦力',
        m: [R`f = \mu' N`, R`f = ` + MU + R` \times ` + Ns + ' = ' + sig(r.f) + NN],
        n: R`物体は斜面を上向きにすべっているので、動摩擦力 $f$ は斜面に沿って下向きにはたらきます。大きさは $f = \mu' N$ で、$N$ には (1) で求めた値を使います（$mg\cos\theta$ ではありません）。` + carry('N', Ns, r.N, NN),
        easy: R`すべっている物体には、動きを止めようとする向きに動摩擦力がはたらきます。その大きさは、面を押しつける力（垂直抗力 $N$）に比例し、比例定数が動摩擦係数 $\mu'$ です。この問題では、水平な力でも斜面に押しつけているので、$N$ が $mg\cos\theta$ より大きくなり、摩擦力も大きくなります。`,
        lv: 2
      },
      {
        t: R`(2) 斜面に平行な方向: 運動方程式`,
        m: [R`ma = F\cos\theta - mg\sin\theta - \mu' N`,
          R`a = \frac{F\cos\theta - mg\sin\theta - \mu' N}{m} = \frac{` + FS + R` \times ` + cv + ' - ' + M + R` \times 9.8 \times ` + sv + ' - ' + MU + R` \times ` + Ns + '}{' + M + '} = ' + sig(r.a) + MS2],
        n: R`物体は斜面に沿って上向きに加速するので、上向きを正として $ma = (\text{上向きの力}) - (\text{下向きの力})$ を立てます。上向きの力は水平な力の成分 $F\cos\theta$、下向きの力は重力の成分 $mg\sin\theta$ と動摩擦力 $\mu' N$ です。` + carry('N', Ns, r.N, NN),
        easy: R`運動方程式 $ma = F$ は「質量 × 加速度 = 力の合計」という法則です。斜面に沿った向きの力を、上向きを正として足し合わせます。上向きにはたらく力は $F\cos\theta$、下向きにはたらく力は重力の成分 $mg\sin\theta$ と動摩擦力 $\mu' N$ です。力の合計を質量 $m$ で割れば、加速度 $a$ が出ます。`,
        pro: R`摩擦力には (1) の $N$ を使います（$\mu' mg\cos\theta$ ではありません）。$a$ が正になることで、すべり上がるという前提も確かめられます。`
      },
      {
        t: R`(3) 一定の速さですべり上がる力 $F_{0}$`,
        m: [R`a = 0 \;\Rightarrow\; F_{0}\cos\theta = mg\sin\theta + \mu'(mg\cos\theta + F_{0}\sin\theta)`,
          R`F_{0}(\cos\theta - \mu'\sin\theta) = mg(\sin\theta + \mu'\cos\theta)`,
          R`F_{0} = \frac{mg(\sin\theta + \mu'\cos\theta)}{\cos\theta - \mu'\sin\theta} = \frac{` + M + R` \times 9.8 \times (` + sv + ' + ' + MU + R` \times ` + cv + ')}{' + cv + ' - ' + MU + R` \times ` + sv + '} = ' + sig(r.F0) + NN],
        n: R`一定の速さですべり上がるとき、加速度は $0$ なので、斜面に平行な方向の力がつり合います。このとき垂直抗力は $N = mg\cos\theta + F_{0}\sin\theta$ となり、(1) の値とは違います。$F_{0}$ を含む式を $F_{0}$ について解きます。`,
        easy: R`「一定の速さ」は、速さが変わらない、つまり加速度が $0$ ということです。加速度が $0$ なら、斜面に平行な方向の力は完全につり合っています（$ma = 0$）。気をつけたいのは、力の大きさを変えると、斜面に押しつける力が変わり、垂直抗力 $N$ も動摩擦力 $\mu' N$ も変わることです。そこで、(1) の値を使わずに、$N = mg\cos\theta + F_{0}\sin\theta$ を式に入れて、$F_{0}$ を求めます。`,
        pro: R`$F_{0} = mg\tan(\theta + \varphi)$（$\tan\varphi = \mu'$）の形にまとまります。$\theta + \varphi$ が $90\degree$ に近づくと、どれだけ押しても上がらなくなります。`
      }
    ];
  }

  function exercisePush(rng) {
    const ang = angleOf(rng.pick([{ deg: 30 }, { deg: 45 }, { deg: ASIN6, s: '0.60', c: '0.80' }, { deg: ASIN8, s: '0.80', c: '0.60' }]));
    const spec = ang.spec;
    let m, mu, F;
    for (let k = 0; k < 40 && F == null; k++) {
      m = rng.pick([1.0, 2.0, 3.0, 4.0, 5.0]);
      mu = rng.pick([0.10, 0.20, 0.25, 0.30]);
      const fs = pushForces(m, spec, mu);
      if (fs.length) F = rng.pick(fs);
    }
    if (F == null) { m = 2.0; mu = 0.20; F = pushForces(m, spec, mu)[0]; }
    const r = solvePush(m, spec, mu, F);
    const M = m.toFixed(1), MU = mu.toFixed(2), FS = String(F);
    return {
      title: '水平な力で斜面を押し上げる物体',
      body: R`水平面と` + ang.angTxt + R`をなすあらい斜面（動摩擦係数 $\mu' = ` + MU + R`$）の上に、質量 $` + M + R`\,\mathrm{kg}$ の物体を置き、水平な向きに大きさ $F = ` + FS +
        R`\,\mathrm{N}$ の一定の力を加えて、物体を斜面に向かって押したところ、物体は斜面に沿って上向きにすべり上がった。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、` + ang.trigTxt + R`次の問いに、有効数字 3 桁で答えよ。`,
      fig: figPush(ang.deg, { angLabel: ang.angLabel, caption: 'm = ' + M + ' kg　F = ' + FS + ' N　μ′ = ' + MU }),
      parts: [
        { label: '(1)', q: R`斜面が物体におよぼす垂直抗力の大きさ $N$`, type: 'num', answer: P3(r.N), rel: 0.02, unit: 'N' },
        { label: '(2)', q: R`物体の加速度の大きさ $a$`, type: 'num', answer: P3(r.a), rel: 0.02, unit: 'm/s²' },
        { label: '(3)', q: R`水平な力の大きさを $F_{0}$ に変えると、物体は斜面に沿って一定の速さですべり上がった。$F_{0}$ の値`, type: 'num', answer: P3(r.F0), rel: 0.02, unit: 'N' }
      ],
      solution: pushSteps(r, {
        trig: trigFor(m, ang.deg, mu, 0, null, spec), M: M, MU: MU, FS: FS,
        given: R`この問題では、質量を $m = ` + M + R`\,\mathrm{kg}$、動摩擦係数を $\mu' = ` + MU + R`$、水平な力の大きさを $F = ` + FS + R`\,\mathrm{N}$ とします。`
      })
    };
  }

  // 題材 pull の図: あらい斜面上の物体 A と、斜面の上端の滑車を通してつるした物体 B
  function figPull(deg, o) {
    o = o || {};
    const d = JK.plot.draw(360, 230);
    const g = inclineBase(d, deg, { x0: 24, y0: 196, base: 215, maxTop: 140, t: 0.45, padL: 10, padR: 12, angLabel: o.angLabel });
    const b = blockOnSlope(d, g, deg, 'f1', 'A');
    const rp = 11, off = BH / 2;                              // 滑車の半径、糸の斜面からの高さ
    // 滑車は斜面の上端から斜面にそって少し先に取りつけ、A につながる糸が斜面に平行になるようにする。B は斜面の鉛直な面から離してつるす
    const sh = Math.ceil((15 + 2 * Math.sin(g.th)) / Math.cos(g.th));
    const vy = g.y0 - g.top;
    const px0 = g.xr + g.nx * (off - rp) + g.ux * sh, py0 = vy + g.ny * (off - rp) + g.uy * sh;
    d.line(g.xr, vy, px0, py0, { cls: 'fg', w: 1.6 });
    d.circle(px0, py0, rp, { cls: 'fg', fill: 'f0' });
    d.dot(px0, py0, { cls: 'fg', r: 2.5 });
    // 糸: A の上側の面 → 滑車の斜面側の接点 → 滑車の上を回る → 鉛直に B へ
    d.line(b.mx + g.ux * BW / 2, b.my + g.uy * BW / 2, px0 + g.nx * rp, py0 + g.ny * rp, { cls: 'fg', w: 1.6 });
    d.arc(px0, py0, rp, 90 + deg, 0, { cls: 'fg', w: 1.6 });
    const xs = px0 + rp, yB = py0 + 72, bw = 40, bh = 36;
    d.line(xs, py0, xs, yB, { cls: 'fg', w: 1.6 });
    d.rect(xs - bw / 2, yB, bw, bh, { cls: 'fg', fill: 'f2', rx: 3 });
    d.text(xs, yB + bh / 2 + 5, 'B', { size: 14, bold: true });
    // 動く向き（A は斜面に沿って上向き、B は下向き。加速度の大きさは同じ）
    d.arrow(g.cx + g.ux * 26 + g.nx * 40, g.cy + g.uy * 26 + g.ny * 40, g.cx + g.ux * 74 + g.nx * 40, g.cy + g.uy * 74 + g.ny * 40, { cls: 'c4', label: 'a', w: 1.6 });
    d.arrow(xs + 34, yB + 4, xs + 34, yB + 36, { cls: 'c4', label: 'a', w: 1.6 });
    if (o.caption) d.text(180, 222, o.caption, { size: 12 });
    return d.svg();
  }

  // 題材 pull: 質量 m1 の物体 A が斜面上、質量 m2 の物体 B がつるされている。B が h 下がった（A が斜面を h 上がった）ところで糸が切れる
  function solvePull(m1, m2, spec, mu, h) {
    const s = spec.s, c = spec.c;
    const k = s + mu * c;                                     // A が斜面を上るとき、下向きにはたらく力（重力の成分 + 動摩擦力）÷ m₁g
    const a = G * (m2 - m1 * k) / (m1 + m2);
    const T = m2 * (G - a);
    const f = mu * m1 * G * c;
    const v = Math.sqrt(2 * a * h);                           // 糸が切れるときの速さ
    const a2 = G * k;                                         // 糸が切れたあとの A の減速の大きさ
    const d = v * v / (2 * a2);                               // 糸が切れてから止まるまでに A が進む距離
    return { m1: m1, m2: m2, mu: mu, h: h, s: s, c: c, k: k, a: a, T: T, f: f, v: v, a2: a2, d: d };
  }

  // 題材 pull の解説。o.trig: trigFor の結果 / o.given: 問題の値と記号を結びつける文 / o.M1, o.M2, o.MU, o.HS: 与えられた値の表示
  function pullSteps(r, o) {
    const sv = o.trig.sS, cv = o.trig.cS, M1 = o.M1, M2 = o.M2, MU = o.MU, HS = o.HS;
    // T と v に代入する a、d に代入する v（丸めた値を代入して結果が 1 つずれる、を防ぐため、必要なら桁を増やす）
    const aS = fit([r.a], (a) => [r.m2 * (G - a), Math.sqrt(2 * a * r.h)], [r.T, r.v])[0];
    const vS = fit([r.v], (v) => v * v / (2 * r.a2), r.d)[0];
    const kS = sv + ' + ' + MU + R` \times ` + cv;            // sinθ + μ'cosθ に値を入れた形
    return [
      {
        t: '力を図に描き、物体ごとに向きを決める',
        m: [o.trig.line],
        n: (o.given || '') + R`物体 A には、重力 $m_{1}g$（鉛直下向き）、垂直抗力 $N$（斜面に垂直）、糸の張力 $T$（斜面に沿って上向き）、動摩擦力 $f$（上向きにすべっているので、運動と逆向き = 斜面に沿って下向き）がはたらきます。物体 B には、重力 $m_{2}g$（下向き）と糸の張力 $T$（上向き）がはたらきます。糸は軽くて伸びず、滑車はなめらかなので、A と B の加速度の大きさ $a$ は等しく、張力の大きさ $T$ は糸のどこでも同じです。A が斜面を上る向きと B が下がる向きを、それぞれ正の向きにとります。A の重力は、斜面に平行な成分 $m_{1}g\sin\theta$ と、斜面に垂直な成分 $m_{1}g\cos\theta$ に分けます。斜面の角の $\sin\theta$, $\cos\theta$ の値は上の式のとおりです。`,
        easy: R`糸でつながった 2 つの物体は、糸が伸びないので、いっしょに同じペースで動きます。A が斜面を 1 m 上れば、B もちょうど 1 m 下がるので、2 つの加速度の大きさは同じです。また、軽い糸となめらかな滑車では、糸が引く力の大きさ（張力 $T$）が糸のどこでも同じになります。物体ごとに力を見つけて、動く向きを正の向きにそろえておくと、符号で迷いません。A の重力は、斜面に平行な成分と垂直な成分に分けて考えます。`,
        pro: R`正の向きを「動く向き」にそろえる（A は斜面上向き、B は下向き）と、連立するときに符号で迷いません。`
      },
      {
        t: 'A にはたらく垂直抗力と動摩擦力',
        m: [R`N = m_{1}g\cos\theta,\quad f = \mu' N = \mu' m_{1}g\cos\theta`, R`f = ` + MU + R` \times ` + M1 + R` \times 9.8 \times ` + cv + ' = ' + sig(r.f) + NN],
        n: R`A は斜面に垂直な方向には動かないので、垂直抗力は重力の垂直成分と等しく $N = m_{1}g\cos\theta$ です。動摩擦力は $f = \mu' N$ で、A が斜面を上向きにすべるので、斜面に沿って下向きにはたらきます。`,
        easy: R`A が斜面にめり込んだり浮き上がったりしないので、斜面に垂直な向きの力はつり合います。摩擦力は、面を押す力（垂直抗力）に比例して、その $\mu'$ 倍になります。`,
        lv: 2
      },
      {
        t: R`(1) 物体ごとに運動方程式を立てて、加速度 $a$ を求める`,
        m: [R`\text{A（斜面上向きが正）: } m_{1}a = T - m_{1}g\sin\theta - \mu' m_{1}g\cos\theta`,
          R`\text{B（下向きが正）: } m_{2}a = m_{2}g - T`,
          R`(m_{1}+m_{2})a = m_{2}g - m_{1}g(\sin\theta + \mu'\cos\theta)`,
          R`a = \frac{m_{2} - m_{1}(\sin\theta + \mu'\cos\theta)}{m_{1}+m_{2}}g = \frac{` + M2 + ' - ' + M1 + R` \times (` + kS + ')}{' + M1 + ' + ' + M2 + R`} \times 9.8 = ` + sig(r.a) + MS2],
        n: R`運動方程式 $ma = (\text{合力})$ を、動く向きを正として A と B それぞれに立てます。A の合力は、上向きの張力 $T$ から、下向きの重力の成分 $m_{1}g\sin\theta$ と動摩擦力 $\mu' m_{1}g\cos\theta$ を引いたものです。B の合力は、下向きの重力 $m_{2}g$ から上向きの張力 $T$ を引いたものです。2 つの式を足すと $T$ が消えて、$a$ が求まります。`,
        easy: R`物体ごとに「質量 × 加速度 = 力の合計」を立てます。A は、糸に斜面の上へ引かれ、重力の斜面成分と摩擦力に斜面の下へ引かれます。B は、重力に下へ、糸に上へ引かれます。2 つの式を足し算すると、$+T$ と $-T$ が打ち消し合って $a$ だけの式になります。B の重さ $m_{2}g$ が A と B の両方を動かす力になっていて、そのうち $m_{1}g(\sin\theta + \mu'\cos\theta)$ は A を斜面の下へ引き戻すブレーキとして使われる、と考えると分かりやすいです。`,
        pro: R`A と B を 1 つの物体とみなすと、動かす力は $m_{2}g$、ブレーキは $m_{1}g(\sin\theta + \mu'\cos\theta)$ です。その差を全質量 $m_{1}+m_{2}$ で割れば、$a$ が最初から出ます。`
      },
      {
        t: R`(2) 糸の張力 $T$`,
        m: [R`T = m_{2}(g - a) = ` + M2 + R` \times (9.8 - ` + aS + ') = ' + sig(r.T) + NN,
          R`T = \frac{m_{1}m_{2}(1 + \sin\theta + \mu'\cos\theta)}{m_{1}+m_{2}}g = \frac{` + M1 + R` \times ` + M2 + R` \times (1 + ` + kS + ')}{' + M1 + ' + ' + M2 + R`} \times 9.8 = ` + sig(r.T) + NN],
        n: R`B の式 $m_{2}a = m_{2}g - T$ を $T$ について解いて、求めた $a$ を代入します。` + carry('a', aS, r.a, MS2) + R`2 行目は、$a$ の式を代入して整理した形で、与えられた値から直接計算しています。A の式から出しても同じ値になります（検算）。$T$ は $m_{2}g$ より小さくなります（B が下へ加速しているため）。`,
        easy: R`B の式を「$T = \cdots$」の形に直して、先に求めた $a$ を入れます。B は下に加速しているので、重さ $m_{2}g$ に糸の力 $T$ が負けています。つまり $T < m_{2}g$ になります。`,
        pro: R`$T < m_{2}g$（B は加速して下がる）と $T > m_{1}g(\sin\theta + \mu'\cos\theta)$（A は加速して上がる）の両方を満たしているかで、答えの妥当性を確かめます。`
      },
      {
        t: R`(3) 糸が切れたあと、A が止まるまでの距離 $d$`,
        m: [R`v = \sqrt{2ah} = \sqrt{2 \times ` + aS + R` \times ` + HS + '} = ' + sig(r.v) + MS,
          R`m_{1}a_{2} = m_{1}g\sin\theta + \mu' m_{1}g\cos\theta \;\Rightarrow\; a_{2} = g(\sin\theta + \mu'\cos\theta)`,
          R`0 - v^{2} = -2a_{2}d \;\Rightarrow\; d = \frac{v^{2}}{2a_{2}} = \frac{v^{2}}{2g(\sin\theta + \mu'\cos\theta)}`,
          R`d = \frac{` + vS + R`^{2}}{2 \times 9.8 \times (` + kS + ')} = ' + sig(r.d) + MM],
        n: R`B が $h = ` + HS + R`\,\mathrm{m}$ 下がる間に、糸の長さは変わらないので、A も斜面に沿って $h$ だけ上がります。静止の状態から加速度 $a$ が一定で動いたので、糸が切れる瞬間の速さは $v^{2} = 2ah$ から求まります。糸が切れると張力がなくなり、A には重力の成分 $m_{1}g\sin\theta$ と動摩擦力 $\mu' m_{1}g\cos\theta$ が、どちらも斜面の下向きにはたらきます。A は上向きに進みながら減速し、その加速度の大きさは $a_{2}$ です。止まるまでの距離 $d$ は、$0 - v^{2} = -2a_{2}d$ から求まります。` + carry('a', aS, r.a, MS2) + carry('v', vS, r.v, MS),
        easy: R`糸が切れるまでは、静止の状態から一定の加速度 $a$ で距離 $h$ 進む運動なので、切れる瞬間の速さは $v = \sqrt{2ah}$ です。糸が切れたあとは、A を引き上げる力がなくなります。重力の斜面成分と摩擦力は、どちらも A を下向きに引くので、A は上向きに進みながら一定の割合で遅くなって止まります。この減速も、運動方程式で加速度 $a_{2}$ を求めてから、$v^{2} - v_{0}^{2} = 2ax$ の公式に入れて考えます。`,
        pro: R`$d = \frac{ah}{g(\sin\theta + \mu'\cos\theta)}$ とまとまります。$v$ を経由しなくても、$a$ と $h$ だけから出せます。`
      }
    ];
  }

  function exercisePull(rng) {
    const ang = angleOf(rng.pick([{ deg: 30 }, { deg: 45 }, { deg: 60 }, { deg: ASIN6, s: '0.60', c: '0.80' }, { deg: ASIN8, s: '0.80', c: '0.60' }]));
    const spec = ang.spec;
    let m1, m2, mu;
    for (let k = 0; k < 40 && m2 == null; k++) {
      m1 = rng.pick([1.0, 2.0, 3.0]);
      mu = rng.pick([0.10, 0.20, 0.25, 0.30]);
      // B が下がる（A がすべり上がる）組のうち、加速度が 1.5〜6.5 m/s² になる B の質量
      const cs = [2.0, 3.0, 4.0, 5.0, 6.0].filter((x) => { const a = solvePull(m1, x, spec, mu, 1).a; return a >= 1.5 && a <= 6.5; });
      if (cs.length) m2 = rng.pick(cs);
    }
    if (m2 == null) { m1 = 2.0; mu = 0.20; m2 = 4.0; }
    const h = rng.pick([1.0, 1.5, 2.0, 2.5]);
    const r = solvePull(m1, m2, spec, mu, h);
    const M1 = m1.toFixed(1), M2 = m2.toFixed(1), MU = mu.toFixed(2), HS = h.toFixed(1);
    return {
      title: '斜面上の物体とつるした物体',
      body: R`水平面と` + ang.angTxt + R`をなすあらい斜面（動摩擦係数 $\mu' = ` + MU + R`$）の上に質量 $` + M1 + R`\,\mathrm{kg}$ の物体 A を置き、A に軽くて伸びない糸をつないで、斜面の上端にある軽くてなめらかな滑車にかけ、糸の他端に質量 $` + M2 +
        R`\,\mathrm{kg}$ の物体 B をつるした。A と B を静かにはなすと、B は下がり、A は斜面に沿って上向きにすべり上がった。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、` + ang.trigTxt + R`次の問いに、有効数字 3 桁で答えよ。`,
      fig: figPull(ang.deg, { angLabel: ang.angLabel, caption: 'A: ' + M1 + ' kg　B: ' + M2 + ' kg　μ′ = ' + MU }),
      parts: [
        { label: '(1)', q: R`A, B の加速度の大きさ $a$`, type: 'num', answer: P3(r.a), rel: 0.02, unit: 'm/s²' },
        { label: '(2)', q: R`糸の張力の大きさ $T$`, type: 'num', answer: P3(r.T), rel: 0.02, unit: 'N' },
        { label: '(3)', q: R`B が $` + HS + R`\,\mathrm{m}$ 下がった瞬間に糸が切れた。糸が切れてから、A が斜面に沿って上向きに進んで止まるまでの距離 $d$（A は滑車に達しないものとする）`, type: 'num', answer: P3(r.d), rel: 0.02, unit: 'm' }
      ],
      solution: pullSteps(r, {
        trig: trigFor(m1, ang.deg, mu, 0, null, spec), M1: M1, M2: M2, MU: MU, HS: HS,
        given: R`この問題では、A の質量を $m_{1} = ` + M1 + R`\,\mathrm{kg}$、B の質量を $m_{2} = ` + M2 + R`\,\mathrm{kg}$、動摩擦係数を $\mu' = ` + MU + R`$、B が下がる距離を $h = ` + HS + R`\,\mathrm{m}$ とします。`
      })
    };
  }

  // adv: 2 つの題材のどちらか
  function exerciseAdv(rng) {
    return rng.bool(0.5) ? exercisePush(rng) : exercisePull(rng);
  }

  JK.registerSim({
    id: 'mech-incline',
    field: '力学',
    unit: 'p-eom',
    title: '斜面上をすべる物体の運動方程式',
    desc: '傾き θ の斜面を物体がすべり下りるときの垂直抗力・摩擦力・加速度と、距離 L をすべった後の速さ・時間を求めます。',
    form: [R`N = mg\cos\theta`, R`ma = mg\sin\theta - \mu' N`, R`v^{2} = 2aL`],
    inputs: [
      { key: 'm', label: '質量 $m$', unit: 'kg', type: 'num', def: '2.0', min: 0.01, max: 1000 },
      { key: 'deg', label: '斜面の角度 $\\theta$', unit: '°', type: 'num', def: '30', min: 1, max: 89 },
      { key: 'mu', label: "動摩擦係数 $\\mu'$", type: 'num', def: '0.20', min: 0, max: 5, hint: '0 でなめらかな斜面' },
      { key: 'L', label: 'すべる距離 $L$', unit: 'm', type: 'num', def: '1.0', min: 0.01, max: 1000 }
    ],
    examples: [
      { label: 'なめらかな斜面', v: { m: '2.0', deg: '30', mu: '0', L: '2.5' } },
      { label: '45° のあらい斜面', v: { m: '1.0', deg: '45', mu: '0.50', L: '1.0' } }
    ],
    intro: {
      easy: R`斜面に置いた物体は、重力に引かれてすべり下ります。ただし重力がそのまま全部「すべらせる力」になるわけではありません。重力のうち**斜面に沿った分**（$mg\sin\theta$）だけが物体を加速させ、**斜面を押す分**（$mg\cos\theta$）は斜面からの垂直抗力と打ち消し合います。あらい斜面では、さらに摩擦力がブレーキとしてはたらきます。`,
      normal: R`斜面方向と垂直方向に力を分解し、垂直方向はつり合い・斜面方向は運動方程式を立てます。`,
      pro: R`$a = g(\sin\theta - \mu'\cos\theta)$。質量によらないこと、$\tan\theta = \mu'$ が「すべり出すかどうか」の境目であることを押さえます。`
    },
    compute(v) {
      const r = solve(v.m, v.deg, v.mu, v.L);
      if (!(r.a > 0)) {
        throw new JK.CalcError('この条件では物体はすべり下りません（tanθ ≤ μ′ のため摩擦力が重力の斜面成分以上になります）。角度を大きくするか μ′ を小さくしてください。');
      }
      return {
        result: [
          { label: '垂直抗力 N', tex: sig(r.N) + NN },
          { label: '動摩擦力 f', tex: sig(r.f) + NN },
          { label: '加速度 a', tex: sig(r.a) + MS2 },
          { label: 'L すべった後の速さ v', tex: sig(r.v) + MS },
          { label: 'かかる時間 t', tex: sig(r.t) + SEC }
        ],
        steps: buildSteps(v.m, v.deg, v.mu, v.L, r, { trig: trigFor(v.m, v.deg, v.mu, v.L, r) }),
        fig: figure(v.deg, v.mu, { caption: 'm = ' + U.fmt(v.m) + ' kg' })
      };
    },
    exercise(rng, level) {
      // 難関（adv）は mid と別の、一段難しい 2 題材（水平な力で押し上げる / 斜面上の物体とつるした物体）。basic・mid は下の出題
      if (level === 'adv') return exerciseAdv(rng);
      // 斜面の角: 30°・45°・60°（角の大きさと sin, cos の厳密値を書く）のほか、3:4:5 の直角三角形で決まる角（sinθ, cosθ の値を書く）
      const ag = rng.pick([{ deg: 30 }, { deg: 45 }, { deg: 60 }, { deg: Math.asin(0.6) * 180 / Math.PI, s: '0.60', c: '0.80' }, { deg: Math.asin(0.8) * 180 / Math.PI, s: '0.80', c: '0.60' }]);
      const deg = ag.deg;
      const named = ag.s == null;
      const m = rng.pick([1.0, 2.0, 4.0, 5.0]);
      const tr = named ? trigTex(deg) : { s: ag.s, c: ag.c };
      // 三角比の値: 問題文で「√3 = 1.73」「√2 = 1.41」としてよいとするので、答えも解説もその値で計算する（厳密値で計算すると、生徒の計算と 3 桁目がずれる）
      const spec = named ? NAMED[deg] : { s: Number(ag.s), c: Number(ag.c), sS: ag.s, cS: ag.c, unnamed: true };
      const tanv = spec.s / spec.c;
      // 基礎: なめらかな斜面 / 中堅・難関: あらい斜面（必ずすべり下りる μ' を選ぶ）
      const mu = level === 'basic' ? 0 : rng.pick([0.10, 0.20, 0.25, 0.30].filter((x) => x < tanv * 0.8));
      const L = rng.pick([1.0, 1.5, 2.0, 2.5, 3.0, 4.0]);
      const r = solve(m, deg, mu, L, spec);
      const parts = [];
      if (mu > 0) parts.push({ label: '(1)', q: R`垂直抗力の大きさ $N$`, type: 'num', answer: P3(r.N), rel: 0.02, unit: 'N' });
      parts.push({ label: '(' + (parts.length + 1) + ')', q: R`物体の加速度の大きさ $a$`, type: 'num', answer: P3(r.a), rel: 0.02, unit: 'm/s²' });
      parts.push({ label: '(' + (parts.length + 1) + ')', q: R`斜面に沿って $` + L.toFixed(1) + R`\,\mathrm{m}$ すべり下りたときの速さ $v$`, type: 'num', answer: P3(r.v), rel: 0.02, unit: 'm/s' });
      // 問題文の数値は有効数字が分かる形（1.0 kg, 0.20 など）で書く
      const trigTxt = named
        ? R`$\sin ` + deg + R`\degree = ` + tr.s + R`,\ \cos ` + deg + R`\degree = ` + tr.c + R`$、` + (deg === 45 ? R`$\sqrt{2} = 1.41$` : R`$\sqrt{3} = 1.73$`) + R` として、`
        : R`$\sin\theta = ` + tr.s + R`,\ \cos\theta = ` + tr.c + R`$ として、`;
      const given = R`この問題では、質量を $m = ` + m.toFixed(1) + R`\,\mathrm{kg}$` + (mu > 0 ? R`、動摩擦係数を $\mu' = ` + mu.toFixed(2) + '$' : '') + R`、斜面に沿ってすべる距離を $L = ` + L.toFixed(1) + R`\,\mathrm{m}$ とします。`;
      return {
        title: mu > 0 ? 'あらい斜面をすべる物体' : 'なめらかな斜面をすべる物体',
        body: R`水平面と` + (named ? R` $` + deg + R`\degree$ の角` : R`角 $\theta$ `) + R`をなす` + (mu > 0 ? R`あらい斜面（動摩擦係数 $\mu' = ` + mu.toFixed(2) + R`$）` : 'なめらかな斜面') +
          R`の上に、質量 $` + m.toFixed(1) + R`\,\mathrm{kg}$ の物体を静かに置いたところ、物体は斜面に沿ってすべり下りた。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とし、` + trigTxt +
          R`次の量を有効数字 3 桁で求めよ。`,
        fig: figure(deg, mu, { caption: 'm = ' + U.fmt(m) + ' kg', angLabel: named ? null : 'θ' }),
        parts: parts,
        solution: buildSteps(m, deg, mu, L, r, { trig: trigFor(m, deg, mu, L, r, spec), given: given, askN: mu > 0 })
      };
    }
  });
})();
