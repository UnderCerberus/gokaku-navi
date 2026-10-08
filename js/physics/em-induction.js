/* 物理・電磁気 — 電磁誘導: 磁場中を動く導体棒 / ファラデーの電磁誘導の法則 / 自己誘導とコイルのエネルギー
   構成は mech-eom.js に揃える（intro → compute: result/steps/fig → exercise） */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const sig = (x) => U.sig(x, 3);
  const un = (s) => R`\,\mathrm{` + s + '}';
  const ans = (x) => U.roundSig(x, 3);
  const OHM = R`\,\Omega`;
  const C0 = 3.0e8;   // 光速 [m/s]

  // 入力値・途中の値の表示用: 有効数字 d 桁（既定 6 桁）まで、末尾の 0 は除去、極端に大小の値は指数表記
  function nice(x, d) {
    d = d || 6;
    if (!isFinite(x) || x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12);
    if (e >= -3 && e <= 6 && e < d) return String(U.roundSig(x, d));      // 整数部が d 桁以上のときは指数表記（13260 と書くと 1 の位まで正しい値に見える）
    let m = U.roundSig(x / Math.pow(10, e), d), ee = e;
    if (Math.abs(m) >= 10) { m /= 10; ee += 1; }
    return m + R` \times 10^{` + ee + '}';
  }
  // 2 乗の表示。指数表記（2.5 \times 10^{-3}）の値は括弧でくくる（くくらないと $10^{-3}$ に 2 乗がついたように見える）
  const pw2 = (s) => (s.indexOf('times') < 0 || s.indexOf('\\left(') === 0 ? s + '^{2}' : R`\left(` + s + R`\right)^{2}`);
  // 負の値は括弧つきで（式に代入するとき）
  const pn = (x) => (x < 0 ? R`\left(` + nice(x) + R`\right)` : nice(x));
  // 前進計算（生徒が途中の値を d 桁に丸めながら順に電卓で計算した値）の表示。
  // fv: d 桁の値、tv: 答え（丸める前の値）。d > 3 で 3 桁と違うときは「d 桁の値 ≒ 3 桁の値」と書く
  function fres(fv, tv, d) {
    return d > 3 && U.roundSig(fv, d) !== ans(tv) ? nice(fv, d) + R` \fallingdotseq ` + sig(tv) : sig(tv);
  }
  // fwd(d) が返す値の 3 桁表示が、答え want と全部合う最小の桁数 d（3〜7）
  function digitsOf(fwd, want) {
    const same = (a, b) => (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12) || ans(a) === ans(b);
    for (let d = 3; d < 8; d++) {
      const F = fwd(d);
      if (Object.keys(want).every((k) => same(F[k], want[k]))) return d;
    }
    return 8;
  }
  // 問題文・図ラベル用: 有効数字 2 桁（ちょうど表せないときだけ 3 桁）。6 → 6.0
  function sf(x) {
    if (x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12);
    if (e >= 5 || e <= -3) {
      const m = x / Math.pow(10, e);
      const s1 = m.toFixed(1);
      return (Math.abs(Number(s1) - m) <= 1e-9 * Math.abs(m) ? s1 : m.toFixed(2)) + R` \times 10^{` + e + '}';
    }
    for (const n of [2, 3]) {
      const d = Math.max(0, n - 1 - e), s = x.toFixed(d);
      if (n === 3 || Math.abs(Number(s) - x) <= 1e-9 * Math.abs(x)) return s;
    }
    return String(x);
  }
  const SUPS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const toPlain = (t) => t.replace(/ \\times 10\^\{(-?\d+)\}/, (m, e) => '×10' + String(e).split('').map((c) => SUPS[c] || c).join(''));
  const tx = (x) => toPlain(sf(x));      // 図ラベル用プレーンテキスト（有効数字 2〜3 桁）
  const tx3 = (x) => toPlain(sig(x));    // 同（有効数字 3 桁）
  // 問題文に書く数値は有効数字 3 桁以内で正確に表せること（丸めると解答値とずれるため）
  const ok3 = (x) => Math.abs(Number(x.toPrecision(3)) - x) <= 1e-9 * Math.abs(x);
  function numPart(label, q, x, unit, o) {
    const a = ans(x), p = { label: label, q: q, type: 'num', answer: a, rel: 0.02, unit: unit }, ax = Math.abs(a);
    if (ax !== 0 && (ax < 1e-3 || ax >= 1e5)) { p.show = sig(a); p.hint = '例: 4.7e-12 や 4.7*10^-12 の形で入力'; }
    return Object.assign(p, o || {});
  }
  // 紙面の裏→表（⊙）か、表→裏（⊗）の記号
  function outIn(d, x, y, out, r, cls) {
    cls = cls || 'fg';
    d.circle(x, y, r, { cls: cls, fill: 'f0' });
    if (out) d.dot(x, y, { cls: cls, r: Math.max(1.5, r * 0.28) });
    else {
      const k = r * 0.62;
      d.line(x - k, y - k, x + k, y + k, { cls: cls, w: 1.3 });
      d.line(x - k, y + k, x + k, y - k, { cls: cls, w: 1.3 });
    }
  }
  // 両端に矢じりのある寸法線
  function dimLine(d, x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    d.arrow(mx, my, x1, y1, { cls: 'dim', w: 1.2 });
    d.arrow(mx, my, x2, y2, { cls: 'dim', w: 1.2 });
  }
  // 複数の SVG（JK.plot の出力）を縦に並べて 1 枚にする
  function stack(list, w) {
    let y = 0, body = '';
    list.forEach((s) => {
      const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(s);
      const sw = Number(m[1]), sh = Number(m[2]);
      body += '<g transform="translate(' + ((w - sw) / 2) + ',' + y + ')">' + s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g>';
      y += sh;
    });
    return '<svg class="jk-plot jk-draw" viewBox="0 0 ' + w + ' ' + y + '" width="' + w + '" height="' + y + '" xmlns="http://www.w3.org/2000/svg" role="img">' + body + '</svg>';
  }
  // 区分的に直線の折れ線（[[t, y], ...]）を graph の segs に変換
  function polySegs(pts, cls, dashList) {
    const out = [];
    for (let i = 0; i + 1 < pts.length; i++) {
      out.push({ x1: pts[i][0], y1: pts[i][1], x2: pts[i + 1][0], y2: pts[i + 1][1], cls: cls || 'c1', dash: !!(dashList && dashList[i]) });
    }
    return out;
  }
  // y の範囲（0 を含み、上下に余白）
  function yRange(vals) {
    let lo = Math.min.apply(null, vals.concat([0])), hi = Math.max.apply(null, vals.concat([0]));
    if (hi - lo < 1e-300) { lo = -1; hi = 1; }
    const pad = (hi - lo) * 0.22;
    return [lo < 0 ? lo - pad : 0, hi > 0 ? hi + pad : 0];
  }

  /* =====================================================================
     1. 磁場中を動く導体棒（レール上の棒）
     ===================================================================== */

  function solveRod(p) {
    const k = p.B * p.B * p.l * p.l;                   // B²l²
    if (p.mode === 'terminal') {
      const vt = p.F0 * p.R / k;
      return { vt: vt, It: p.F0 / (p.B * p.l), Vt: vt * p.B * p.l, Pt: p.F0 * vt, a0: p.F0 / p.m, tau: p.m * p.R / k, k: k };
    }
    const V = p.v * p.B * p.l, I = V / p.R, F = I * p.B * p.l;
    return { V: V, I: I, F: F, P: F * p.v, k: k };
  }
  // 生徒が途中の値を d 桁に丸めながら順に電卓で計算したときの値。解説に書く途中の値はこの値を使う
  function fwdRod(p, d) {
    const r = (x) => U.roundSig(x, d);
    if (p.mode === 'terminal') {
      const vt = r(p.F0 * p.R / (p.B * p.B * p.l * p.l)), It = r(p.F0 / (p.B * p.l));
      return { vt: vt, It: It, Pt: p.F0 * vt, Pt2: It * It * p.R };
    }
    const V = r(p.v * p.B * p.l), I = r(V / p.R), F = r(I * p.B * p.l);
    return { V: V, I: I, F: F, P: F * p.v, P2: I * I * p.R };
  }
  function digitsRod(p, s) {
    return digitsOf((d) => fwdRod(p, d), p.mode === 'terminal' ? { vt: s.vt, It: s.It, Pt: s.Pt, Pt2: s.Pt } : { V: s.V, I: s.I, F: s.F, P: s.P, P2: s.P });
  }

  // レール・抵抗・棒・磁場（紙面の裏向き）。s = null なら計算結果を図に書かない（演習用）
  function figRod(p, s) {
    const d = JK.plot.draw(380, 236);
    const yT = 56, yB = 156, xR = 326, xRes = 78, xRod = 222;
    d.wire([[xRes, yT], [xR, yT]]);
    d.wire([[xRes, yB], [xR, yB]]);
    d.resistor(xRes, yT, xRes, yB, { label: 'R' });
    [110, 150, 270, 306].forEach((x) => [74, 140].forEach((y) => outIn(d, x, y, false, 5, 'dim')));
    d.line(xRod, yT, xRod, yB, { cls: 'c3', w: 5 });
    d.arrow(xRod, yB - 10, xRod, yT + 10, { cls: 'c4', w: 2.4 });
    d.text(xRod - 10, 112, 'I', { italic: true, cls: 'c4' });
    d.arrow(xRod + 12, 94, xRod + 70, 94, { cls: 'c1', w: 2.4, label: 'v' });
    if (p.mode === 'terminal') d.arrow(xRod + 12, 120, xRod + 70, 120, { cls: 'c2', w: 2.4, label: 'F₀' });
    else d.arrow(xRod + 12, 120, xRod + 70, 120, { cls: 'c2', w: 2.4, label: 'F' });
    d.arrow(xRod - 12, 106, xRod - 66, 106, { cls: 'c3', w: 2.4, label: 'IBl', lpos: -1 });
    d.line(338, yT, 338, yB, { cls: 'dim', dash: true, w: 1 });
    dimLine(d, 338, yT + 2, 338, yB - 2);
    d.text(346, 110, 'l', { anchor: 'start', italic: true });
    d.text(14, 18, 'B = ' + tx(p.B) + ' T（紙面の裏向き ⊗）', { anchor: 'start', size: 11 });
    d.text(366, 18, 'l = ' + tx(p.l) + ' m ／ R = ' + tx(p.R) + ' Ω', { anchor: 'end', size: 11 });
    if (p.mode === 'terminal') {
      d.text(190, 186, '一定の力 F₀ = ' + tx(p.F0) + ' N で引く（質量 m = ' + tx(p.m) + ' kg）', { size: 11 });
    } else {
      d.text(190, 186, '棒を一定の速さ v = ' + tx(p.v) + ' m/s で右へ動かす', { size: 11 });
    }
    if (s && p.mode !== 'terminal') d.text(190, 206, 'V = vBl = ' + tx3(s.V) + ' V ／ I = ' + tx3(s.I) + ' A ／ F = ' + tx3(s.F) + ' N', { cls: 'dim', size: 11 });
    if (s && p.mode === 'terminal') d.text(190, 206, '終端速度 v_t = ' + tx3(s.vt) + ' m/s ／ そのときの電流 ' + tx3(s.It) + ' A', { cls: 'dim', size: 11 });
    d.text(190, 226, '誘導電流は反時計回り（棒の中は下から上へ）', { cls: 'dim', size: 11 });
    return d.svg();
  }

  function graphVt(vt, tau) {
    return JK.plot.graph({
      w: 330, h: 210, x: [0, tau * 5], y: [0, vt * 1.2],
      curves: [{ f: (t) => vt * (1 - Math.exp(-t / tau)), cls: 'c1' }],
      hlines: [{ y: vt, label: 'v_t' }],
      points: [{ x: tau, y: vt * (1 - Math.exp(-1)), label: '63 %', cls: 'c3', pos: 'br' }],
      vlines: [{ x: tau, label: 'τ' }],
      axis: ['t [s]', 'v [m/s]']
    });
  }

  function stepsRod(p, s) {
    const B = nice(p.B), l = nice(p.l), Rr = nice(p.R);
    const D = digitsRod(p, s), F = fwdRod(p, D), cv = (x) => nice(x, D);
    const steps = [];
    if (p.mode !== 'terminal') {
      const v = nice(p.v);
      steps.push({
        t: '何が起こるかを図で考える',
        n: R`磁場に垂直なレールの上で、導体棒を速さ $v$ で動かします。棒が磁場を横切って動くと、棒の両端に**誘導起電力** $V$ が生じ、棒・レール・抵抗でできた回路に**誘導電流** $I$ が流れます。電流が流れた棒は磁場から力を受けます。`,
        easy: R`自転車のライトに使う発電機は、磁石の近くでコイルを動かして電気をつくります。ここでも同じで、**磁場の中で導体を動かすと電気が生まれ**、棒が電池のはたらきをします。電気が流れれば抵抗で熱が出るので、そのぶんのエネルギーは、棒を動かす力が仕事をして補っています。`,
        pro: R`解く順序は「$V = vBl$ → $I = V/R$ → $F = IBl$ → $P = Fv = I^{2}R$」。まず棒を電池とみなして回路の問題にします。`
      });
      steps.push({
        t: '誘導起電力の大きさ',
        m: [R`V = vBl`, R`V = ` + v + R` \times ` + B + R` \times ` + l + ' = ' + fres(F.V, s.V, D) + un('V')],
        n: R`棒が距離 $v\Delta t$ 動くあいだに、棒が掃く面積は $lv\Delta t$ なので、回路を貫く磁束の変化は $\Delta\Phi = Blv\Delta t$ です。ファラデーの法則 $V = \dfrac{\Delta\Phi}{\Delta t}$ より $V = vBl$（$v$、$B$、棒の向きが互いに垂直のとき）。`,
        easy: R`棒が動くほど回路の面積が広がり、回路を貫く磁力線の本数（磁束）が増えます。「1 秒間に磁束がどれだけ増えたか」が起電力の大きさです。1 秒間に棒が掃く面積は $l \times v$、そこを貫く磁束は $B \times lv$ なので、$V = vBl$ になります。`,
        pro: R`$V = vBl$ は速さ・磁場・棒が互いに垂直のときの式です。斜めなら、垂直な成分だけを使います。`
      });
      steps.push({
        t: '回路を流れる電流',
        m: [R`I = \frac{V}{R}`, R`I = \frac{` + cv(F.V) + '}{' + Rr + '} = ' + fres(F.I, s.I, D) + un('A')],
        n: R`棒を電池（起電力 $V$）とみなし、抵抗 $R$ に対してオームの法則を使います（棒とレールの抵抗は無視）。`,
        easy: R`棒が「電圧 $V$ の電池」になって、抵抗 $R$ に電流を流している回路だと考えます。あとは「電圧 ÷ 抵抗 ＝ 電流」の計算です。`
      });
      steps.push({
        t: '電流の向き（レンツの法則）',
        n: R`棒が右へ動いて回路の面積が増えると、紙面の裏向きの磁束が増えます。レンツの法則により、**増加を妨げる向き**（手前向き）の磁場をつくる向き、つまり**反時計回り**に電流が流れます。棒の中では下から上へ向かいます。`,
        easy: R`レンツの法則は「磁束の変化を**いやがる**向きに電流が流れる」というルールです。裏向きの磁束が増えるので、その増加をいやがって手前向きの磁場をつくる向き（反時計回り）に電流が流れます。`,
        pro: R`右手の法則（フレミングの右手: 親指 = 運動、人差し指 = 磁場、中指 = 起電力・電流）でも同じ向きが得られます。`
      });
      steps.push({
        t: '棒が磁場から受ける力（運動を妨げる力）',
        m: [R`F = IBl`, R`F = ` + cv(F.I) + R` \times ` + B + R` \times ` + l + ' = ' + fres(F.F, s.F, D) + un('N')],
        n: R`電流が流れる棒は磁場から力を受けます。向きは左手の法則で**運動と逆向き**（左向き）です。棒を一定の速さで動かし続けるには、この力とつり合う外力 $F = IBl$ を右向きに加えなければなりません。`,
        easy: R`電流が流れた棒は、磁場に押し返されます。この力は動く向きと逆で、ブレーキのようにはたらきます。だから、同じ速さで動かし続けるには、同じ大きさの力で引き続ける必要があります（引く力 ＝ 磁場から受ける力）。`,
        pro: R`$F = IBl = \dfrac{B^{2}l^{2}v}{R}$ と書けます。力は速さに比例し、抵抗に反比例します。`
      });
      steps.push({
        t: '仕事率とジュール熱（エネルギーの保存）',
        m: [R`P = Fv = ` + cv(F.F) + R` \times ` + v + ' = ' + sig(s.P) + un('W'), R`P = I^{2}R = ` + pw2(cv(F.I)) + R` \times ` + Rr + ' = ' + sig(s.P) + un('W')],
        n: R`外力が棒にする仕事率 $Fv$ は、抵抗で発生するジュール熱の仕事率 $I^{2}R$ に等しくなります。外力のした仕事が、電気を経由してすべて熱になる（エネルギー保存）ことの確認です。`,
        easy: R`棒を引く力がする仕事は、いったん電気のエネルギーに変わり、最後は抵抗の熱になります。「引く力が毎秒する仕事」と「抵抗が毎秒出す熱」が一致するのは、エネルギーが保存されている証拠です。`,
        lv: 2
      });
      steps.push({
        t: 'ローレンツ力から $V = vBl$ を導く',
        m: [R`qvB = qE = q\frac{V}{l} \;\Rightarrow\; V = vBl`],
        n: R`棒が速さ $v$ で動くと、棒の中の電荷 $q$ はローレンツ力 $qvB$ を受けて棒の一方に偏ります。偏りによる電場 $E = V/l$ がつくる力 $qE$ とつり合うところで偏りは止まり、このとき棒の両端の電位差が $V = vBl$ です。`,
        easy: R`棒の中の電子は、棒といっしょに磁場の中を動くので、ローレンツ力で棒の一方の端へ押されます。端に電気が偏るほど、押し返す電気の力が大きくなり、2 つの力がつり合ったところで偏りが止まります。そのときの両端の電圧が $vBl$ です。`,
        lv: 3
      });
    } else {
      const F0 = nice(p.F0), mm = nice(p.m);
      steps.push({
        t: '終端速度とは何か',
        n: R`一定の力 $F_{0}$ で棒を引き続けると、はじめは棒が加速します。速くなるほど起電力・電流・磁場から受ける力 $IBl$（運動を妨げる向き）が大きくなり、$F_{0}$ とちょうどつり合うと加速が止まって**一定の速さ（終端速度）** $v_{t}$ になります。`,
        easy: R`雨粒が落ちるとき、速くなるほど空気の抵抗が大きくなり、重力とつり合うと一定の速さで落ちます。これと同じことが、ここでも起こります。棒が速くなるほど磁場から受けるブレーキの力が強くなり、引く力とつり合った時点で、棒はそれ以上速くなりません。`,
        pro: R`終端速度を求めるには、加速度 $0$（力のつり合い）と置きます。運動方程式 $ma = F_{0} - \dfrac{B^{2}l^{2}v}{R}$ で $a = 0$ とすればよいです。`
      });
      steps.push({
        t: '動き出した直後の加速度',
        m: [R`v = 0 \;\Rightarrow\; I = 0 \;\Rightarrow\; ma_{0} = F_{0}`, R`a_{0} = \frac{F_{0}}{m} = \frac{` + F0 + '}{' + mm + '} = ' + sig(s.a0) + un('m/s^{2}')],
        n: R`静止している棒には、起電力も電流もないので磁場の力ははたらきません。引く力だけで加速するので、運動方程式 $ma_{0} = F_{0}$ です。`,
        easy: R`動いていない棒には、ブレーキの力がまだありません。だから最初は、引く力 $F_{0}$ だけで $F = ma$ の運動をします。`,
        lv: 2
      });
      steps.push({
        t: '速さ $v$ のときの運動方程式',
        m: [R`V = vBl,\quad I = \frac{vBl}{R},\quad IBl = \frac{B^{2}l^{2}v}{R}`, R`ma = F_{0} - \frac{B^{2}l^{2}}{R}\,v`],
        n: R`速さ $v$ のとき、起電力 $vBl$ → 電流 $\dfrac{vBl}{R}$ → 磁場から受ける力 $IBl = \dfrac{B^{2}l^{2}v}{R}$（運動と逆向き）の順に求め、運動方程式に入れます。`,
        easy: R`速さが $v$ になった棒で考えます。「起電力 → 電流 → 磁場から受ける力」の順に、前に学んだ式を順番に使えば、速さ $v$ のときのブレーキの力が $\dfrac{B^{2}l^{2}v}{R}$ と出ます。この力は速さ $v$ に比例して大きくなります。`
      });
      steps.push({
        t: '終端速度を求める（加速度 = 0）',
        m: [R`F_{0} = \frac{B^{2}l^{2}}{R}\,v_{t} \;\Rightarrow\; v_{t} = \frac{F_{0}R}{B^{2}l^{2}}`, R`v_{t} = \frac{` + F0 + R` \times ` + Rr + '}{' + pw2(B) + R` \times ` + pw2(l) + R`} = ` + fres(F.vt, s.vt, D) + un('m/s')],
        n: R`加速度が $0$ になるとき、引く力 $F_{0}$ と磁場から受ける力がつり合います。この式を $v$ について解いたものが終端速度です。`,
        easy: R`「引く力 $=$ ブレーキの力」とおいて、速さを求める式に直します。$R$ が大きい（電流が流れにくい）ほど、$B$・$l$ が小さい（ブレーキが弱い）ほど、終端速度は大きくなります。`,
        pro: R`$v_{t} = \dfrac{F_{0}R}{B^{2}l^{2}}$ は結果として覚えるより、「$F_{0} = IBl$ から $I$ → $V = IR = v_{t}Bl$ から $v_{t}$」と順にたどる方が忘れません。`
      });
      steps.push({
        t: '終端状態での電流と電力',
        m: [R`I_{t} = \frac{F_{0}}{Bl} = \frac{` + F0 + '}{' + B + R` \times ` + l + '} = ' + fres(F.It, s.It, D) + un('A'), R`P = F_{0}v_{t} = ` + F0 + R` \times ` + cv(F.vt) + ' = ' + sig(s.Pt) + un('W'), R`P = I_{t}^{2}R = ` + pw2(cv(F.It)) + R` \times ` + Rr + ' = ' + sig(s.Pt) + un('W')],
        n: R`終端状態では $F_{0} = I_{t}Bl$ から電流が決まります。外力の仕事率 $F_{0}v_{t}$ は、すべてジュール熱 $I_{t}^{2}R$ になります。運動エネルギーは増えません。`,
        easy: R`一定の速さになった棒は、運動エネルギーがもう増えません。引く力のする仕事は、全部が抵抗の熱に変わっています。`,
        lv: 2
      });
      steps.push({
        t: '速さが変化するようす（$v$–$t$ グラフ）',
        m: [R`\tau = \frac{mR}{B^{2}l^{2}} = \frac{` + mm + R` \times ` + Rr + '}{' + pw2(B) + R` \times ` + pw2(l) + R`} = ` + sig(s.tau) + un('s')],
        n: R`速さは $v = v_{t}\left(1 - e^{-t/\tau}\right)$ のように、はじめは急に、あとはゆるやかに $v_{t}$ に近づきます。目安の時間 $\tau$（時定数）で $v_{t}$ の約 63 % になります。`,
        easy: R`速さのグラフは、最初は急にのぼり、だんだん勢いがなくなって、ある速さ $v_{t}$ に近づく曲線です。ブレーキが速さに比例して強くなるので、速くなるほど加速しにくくなるからです。`,
        fig: graphVt(s.vt, s.tau),
        lv: 3
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-rod',
    field: '電磁気',
    unit: 'p-induction',
    title: '磁場中を動く導体棒（誘導起電力・電流・力）',
    desc: '磁場に垂直なレール上を動く導体棒について、誘導起電力 $V = vBl$・電流・磁場から受ける力・仕事率（ジュール熱）を求めます。一定の力で引き続けたときの終端速度も扱います。',
    form: [R`V = vBl,\quad I = \frac{V}{R}`, R`F = IBl = \frac{B^{2}l^{2}v}{R}`, R`P = Fv = I^{2}R`, R`v_{t} = \frac{F_{0}R}{B^{2}l^{2}}`],
    inputs: [
      { key: 'mode', label: '棒の動かし方', type: 'select', def: 'const', options: [['const', '一定の速さ v で動かす'], ['terminal', '一定の力 F₀ で引き続ける（終端速度）']] },
      { key: 'B', label: '磁束密度 $B$', unit: 'T', type: 'num', def: '0.50', min: 0.001, max: 20 },
      { key: 'l', label: 'レールの間隔（棒の長さ）$l$', unit: 'm', type: 'num', def: '0.40', min: 0.01, max: 10 },
      { key: 'R', label: '抵抗 $R$', unit: 'Ω', type: 'num', def: '2.0', min: 0.01, max: 1000 },
      { key: 'v', label: '棒の速さ $v$', unit: 'm/s', type: 'num', def: '3.0', min: 0.001, max: 1000, show: (raw) => raw.mode !== 'terminal' },
      { key: 'F0', label: '棒を引く力 $F_{0}$', unit: 'N', type: 'num', def: '0.20', min: 0.0001, max: 1000, show: (raw) => raw.mode === 'terminal' },
      { key: 'm', label: '棒の質量 $m$', unit: 'kg', type: 'num', def: '0.10', min: 0.001, max: 100, show: (raw) => raw.mode === 'terminal' }
    ],
    examples: [
      { label: '一定の速さ（3.0 m/s）', v: { mode: 'const', B: '0.50', l: '0.40', R: '2.0', v: '3.0' } },
      { label: '強い磁場・速い棒', v: { mode: 'const', B: '1.0', l: '0.50', R: '5.0', v: '10' } },
      { label: '一定の力で引く（終端速度）', v: { mode: 'terminal', B: '0.50', l: '0.40', R: '2.0', F0: '0.20', m: '0.10' } }
    ],
    intro: {
      easy: R`磁石の磁場の中で導体を動かすと、導体の中に**電圧（誘導起電力）**が生まれます。これが発電機の原理です。レールの上を動く棒では、棒が動くほど回路の面積が広がり、回路を貫く磁力線（磁束）が増え、その増える速さに比例した電圧が生じます。電流が流れた棒は磁場から**動きを妨げる向きの力**を受けるので、同じ速さで動かし続けるには、その力とつり合う力で引き続けなければなりません。`,
      normal: R`$V = vBl$（$v$・$B$・棒が互いに垂直）、$I = V/R$、棒が受ける力 $F = IBl$（運動と逆向き）。外力の仕事率 $Fv$ は抵抗で発生するジュール熱 $I^{2}R$ に等しくなります。向きは、電流がレンツの法則（磁束の変化を妨げる向き）、力が左手の法則で決まります。`,
      pro: R`$V = vBl \to I = V/R \to F = IBl$ の流れを一息で。一定の力 $F_{0}$ で引くときは $ma = F_{0} - \dfrac{B^{2}l^{2}v}{R}$ で $a = 0$ とおいて終端速度 $v_{t} = \dfrac{F_{0}R}{B^{2}l^{2}}$ を求めます。エネルギー保存（$F_{0}v_{t} = I^{2}R$）で検算できます。`
    },
    compute(v) {
      const mode = v.mode === 'terminal' ? 'terminal' : 'const';
      const p = { mode: mode, B: v.B, l: v.l, R: v.R, v: v.v, F0: v.F0, m: v.m };
      const s = solveRod(p);
      if (mode === 'terminal') {
        if (!isFinite(s.vt) || !isFinite(s.tau) || !isFinite(s.a0)) throw new JK.CalcError('値が大きすぎて計算できません。');
        if (s.vt > 0.1 * C0) throw new JK.CalcError('終端速度が光速の 1/10 を超えます。この計算は相対性理論が不要な範囲でのみ成り立つので、引く力を小さくするか、磁場や棒の長さを大きくしてください。');
        return {
          result: [
            { label: '動き出した直後の加速度 a₀', tex: sig(s.a0) + un('m/s^{2}') },
            { label: '終端速度 v_t', tex: sig(s.vt) + un('m/s') },
            { label: '終端状態の電流 I', tex: sig(s.It) + un('A') },
            { label: '終端状態の消費電力 P（= ジュール熱）', tex: sig(s.Pt) + un('W') },
            { label: '時定数 τ（v_t の約 63 % に達する時間）', tex: sig(s.tau) + un('s') }
          ],
          steps: stepsRod(p, s),
          fig: figRod(p, s)
        };
      }
      if (!isFinite(s.V) || !isFinite(s.P)) throw new JK.CalcError('値が大きすぎて計算できません。');
      return {
        result: [
          { label: '誘導起電力 V', tex: sig(s.V) + un('V') },
          { label: '誘導電流 I', tex: sig(s.I) + un('A') },
          { label: '棒が磁場から受ける力 F（外力と等しい）', tex: sig(s.F) + un('N') },
          { label: '外力の仕事率 P（= ジュール熱）', tex: sig(s.P) + un('W') },
          { label: '電流の向き', tex: R`\text{反時計回り（棒の中は下から上）}` }
        ],
        steps: stepsRod(p, s),
        fig: figRod(p, s)
      };
    },
    exercise(rng, level) {
      const fieldTxt = (B, l, R0) => R`水平面内に、間隔 $` + sf(l) + R`\,\mathrm{m}$ の平行な 2 本の導体レールを置き、左端を抵抗値 $` + sf(R0) + R`\,\mathrm{\Omega}$ の抵抗でつないだ。レールに垂直に導体棒をのせ、鉛直下向き（図では紙面の裏向き）の磁束密度 $` + sf(B) + R`\,\mathrm{T}$ の一様な磁場をかける。レールと棒の抵抗、および摩擦は無視できる。`;
      if (level === 'adv') {
        let B, l, Rr, F0, m, vt, v1, a1;
        for (let k = 0; k < 300; k++) {
          B = rng.pick([0.20, 0.40, 0.50, 1.0]); l = rng.pick([0.20, 0.50, 1.0]); Rr = rng.pick([1.0, 2.0, 4.0, 5.0]);
          F0 = rng.pick([0.10, 0.20, 0.50, 1.0]); m = rng.pick([0.10, 0.20, 0.50]);
          vt = F0 * Rr / (B * B * l * l);
          v1 = rng.pick([1.0, 2.0, 3.0, 4.0, 5.0]);
          if (vt > 2 * v1 && vt < 60 && v1 < 0.6 * vt) break;
        }
        const p = { mode: 'terminal', B: B, l: l, R: Rr, F0: F0, m: m };
        const s = solveRod(p);
        const k2 = B * B * l * l;
        a1 = (F0 - k2 * v1 / Rr) / m;
        // 途中の値（IBl・v_t）は、生徒が d 桁に丸めながら順に計算した値で書く。表示どおりに計算し直すと、答えの表示と合う桁数にする
        const f1 = k2 * v1 / Rr;
        const D = digitsOf((d) => { const r = (x) => U.roundSig(x, d), f1d = r(f1); return { f1: f1d, a1: Math.abs((F0 - f1d) / m), vt: r(vt), P: F0 * r(vt) }; }, { f1: f1, a1: Math.abs(a1), vt: vt, P: F0 * vt });
        const f1d = U.roundSig(f1, D), vtd = U.roundSig(vt, D);
        const sol = [
          {
            t: '速さ $v_{1}$ のときの加速度',
            m: [R`V = v_{1}Bl,\ \ I = \frac{v_{1}Bl}{R},\ \ IBl = \frac{B^{2}l^{2}v_{1}}{R} = \frac{` + pw2(nice(B)) + R` \times ` + pw2(nice(l)) + R` \times ` + nice(v1) + '}{' + nice(Rr) + '} = ' + nice(f1, D) + un('N'),
              R`ma_{1} = F_{0} - IBl \;\Rightarrow\; a_{1} = \frac{` + nice(F0) + ' - ' + nice(f1, D) + '}{' + nice(m) + '} = ' + sig(a1) + un('m/s^{2}')],
            n: R`速さ $v_{1}$ のとき、起電力 → 電流 → 磁場から受ける力（運動と逆向き）の順に求め、運動方程式（右向きを正）に代入します。`,
            easy: R`棒が動いていると、ブレーキの力 $IBl$ が生まれます。引く力 $F_{0}$ からブレーキの力を引いたものが、棒を加速させる正味の力です。それを質量 $m$ で割れば加速度になります（$ma = F$）。`,
            pro: R`速さを文字のまま $ma = F_{0} - \dfrac{B^{2}l^{2}v}{R}$ と一般形にしておけば、どんな $v$ でも使い回せます。`
          },
          {
            t: '終端速度（加速度 $0$ のとき）',
            m: [R`F_{0} = \frac{B^{2}l^{2}}{R}\,v_{t} \;\Rightarrow\; v_{t} = \frac{F_{0}R}{B^{2}l^{2}} = \frac{` + nice(F0) + R` \times ` + nice(Rr) + '}{' + pw2(nice(B)) + R` \times ` + pw2(nice(l)) + R`} = ` + fres(vtd, vt, D) + un('m/s')],
            n: R`加速度が $0$ になる（引く力と磁場から受ける力がつり合う）ときの速さが終端速度です。`,
            easy: R`速くなるほどブレーキが強くなり、引く力と同じ強さになったところで棒は加速をやめます。「引く力 $=$ ブレーキの力」の式を $v$ について解きます。`
          },
          {
            t: '終端状態でのジュール熱の発生率',
            m: [R`P = F_{0}v_{t} = ` + nice(F0) + R` \times ` + nice(vtd, D) + ' = ' + sig(F0 * vt) + un('W')],
            n: R`終端状態では棒の運動エネルギーが変わらないので、外力の仕事率 $F_{0}v_{t}$ のすべてがジュール熱 $I^{2}R$ になります（$I = F_{0}/(Bl)$ を使って $I^{2}R$ を求めても同じ値です）。`,
            easy: R`一定の速さで動いている棒は、エネルギーが増えません。だから、引く力が毎秒する仕事のぜんぶが、抵抗の熱として毎秒出ていきます。`
          }
        ];
        return {
          title: '一定の力で引かれる棒の終端速度',
          body: fieldTxt(B, l, Rr) + R`質量 $` + sf(m) + R`\,\mathrm{kg}$ の棒を、静止した状態から右向きに一定の大きさ $` + sf(F0) + R`\,\mathrm{N}$ の力で引き続けたところ、棒は加速しながらやがて一定の速さに達した。次の問いに答えよ。`,
          fig: figRod(p, null),
          parts: [
            numPart('(1)', R`棒の速さが $` + sf(v1) + R`\,\mathrm{m/s}$ になったときの、棒の加速度の大きさ $a_{1}$`, Math.abs(a1), 'm/s²'),
            numPart('(2)', R`棒が最終的に達する一定の速さ $v_{t}$`, vt, 'm/s'),
            numPart('(3)', R`棒が一定の速さに達したあと、抵抗で単位時間あたりに発生するジュール熱 $P$`, F0 * vt, 'W')
          ],
          solution: sol
        };
      }
      // basic / mid: 一定の速さで動かす
      let B, l, Rr, v;
      for (let k = 0; k < 200; k++) {
        B = rng.pick([0.10, 0.20, 0.40, 0.50, 1.0]); l = rng.pick([0.10, 0.20, 0.40, 0.50, 1.0]); Rr = rng.pick([1.0, 2.0, 4.0, 5.0, 10]); v = rng.pick([1.0, 2.0, 3.0, 4.0, 5.0, 10]);
        if (ok3(v * B * l) && ok3(v * B * l / Rr)) break;
      }
      const p = { mode: 'const', B: B, l: l, R: Rr, v: v };
      const s = solveRod(p);
      const parts = [
        numPart('(1)', R`棒に生じる誘導起電力の大きさ $V$`, s.V, 'V'),
        numPart('(2)', R`抵抗を流れる電流の大きさ $I$`, s.I, 'A')
      ];
      let sol = stepsRod(p, s).slice(0, 3);
      if (level === 'mid') {
        parts.push(numPart('(3)', R`棒を一定の速さで動かし続けるために、棒に加えなければならない力の大きさ $F$`, s.F, 'N'));
        parts.push(numPart('(4)', R`その力が単位時間あたりにする仕事 $P$`, s.P, 'W'));
        // (4) の P を出す式の段（仕事率とジュール熱）は lv 1 にする
        sol = stepsRod(p, s).slice(0, 6).filter((st) => st.t.indexOf('電流の向き') < 0).map((st) => (st.t.indexOf('仕事率') === 0 ? Object.assign({}, st, { lv: 1 }) : st));
      }
      return {
        title: level === 'mid' ? '動く棒の起電力・力・仕事率' : '磁場中を動く棒の起電力と電流',
        body: fieldTxt(B, l, Rr) + R`棒を、レールに沿って右向きに一定の速さ $` + sf(v) + R`\,\mathrm{m/s}$ で動かした。次の問いに答えよ。`,
        fig: figRod(p, null),
        parts: parts,
        solution: sol
      };
    }
  });

  /* =====================================================================
     2. ファラデーの電磁誘導の法則（Φ–t グラフと V–t グラフ）
     ===================================================================== */

  // 巻数 N・面積 S[m²]・B の 3 区間変化（t1 で B0→B1、t2 は一定、t3 で B1→B2）
  function solveFar(p) {
    const P0 = p.B0 * p.S, P1 = p.B1 * p.S, P2 = p.B2 * p.S;
    const V1 = -p.N * (P1 - P0) / p.t1, V2 = 0, V3 = -p.N * (P2 - P1) / p.t3;
    return { P0: P0, P1: P1, P2: P2, V1: V1, V2: V2, V3: V3, T: p.t1 + p.t2 + p.t3 };
  }

  function graphPhi(p, s, opt) {
    opt = opt || {};
    const f = [s.P0, s.P1, s.P2].map((x) => x * 1e3);      // mWb
    const t1 = p.t1, t2 = p.t2, T = s.T;
    const pts = [[0, f[0]], [t1, f[1]], [t1 + t2, f[1]], [T, f[2]]];
    const points = pts.map((q, i) => ({ x: q[0], y: q[1], cls: 'c3', pos: i === 1 ? 'tl' : 'tr', label: opt.label ? U.fmt(q[1], 3) : '' }));
    // 重複する点（t2 = 0 のとき）を避ける
    const uniq = points.filter((q, i) => i === 0 || Math.abs(q.x - points[i - 1].x) > 1e-12 || Math.abs(q.y - points[i - 1].y) > 1e-12);
    return JK.plot.graph({
      w: 340, h: 170, x: [0, T * 1.08], y: yRange(f),
      segs: polySegs(pts, 'c1').filter((sg) => sg.x2 - sg.x1 > 1e-12),
      points: uniq,
      vlines: [{ x: t1 }].concat(t2 > 1e-12 ? [{ x: t1 + t2 }] : []),
      axis: ['t [s]', 'Φ [mWb]']
    });
  }

  function graphVf(p, s) {
    const t1 = p.t1, t2 = p.t2, T = s.T;
    const sg = [];
    sg.push({ x1: 0, y1: s.V1, x2: t1, y2: s.V1, cls: 'c2' });
    if (t2 > 1e-12) sg.push({ x1: t1, y1: 0, x2: t1 + t2, y2: 0, cls: 'c2' });
    sg.push({ x1: t1 + t2, y1: s.V3, x2: T, y2: s.V3, cls: 'c2' });
    sg.push({ x1: t1, y1: s.V1, x2: t1, y2: 0, cls: 'dim', dash: true });
    sg.push({ x1: t1 + t2, y1: 0, x2: t1 + t2, y2: s.V3, cls: 'dim', dash: true });
    return JK.plot.graph({
      w: 340, h: 170, x: [0, T * 1.08], y: yRange([s.V1, s.V3]),
      segs: sg,
      axis: ['t [s]', 'V [V]']
    });
  }

  // コイルと磁場（紙面の裏向きを正とする）
  function figCoil(p) {
    const d = JK.plot.draw(380, 190);
    const x0 = 70, y0 = 36, w = 150, h = 100;
    d.rect(x0, y0, w, h, { cls: 'c3', w: 3 });
    d.rect(x0 + 6, y0 + 6, w - 12, h - 12, { cls: 'c3', w: 1.4 });
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) outIn(d, x0 + 28 + i * 32, y0 + 22 + j * 28, false, 5, 'dim');
    d.wire([[x0 + w, y0 + 20], [x0 + w + 40, y0 + 20]]);
    d.wire([[x0 + w, y0 + h - 20], [x0 + w + 40, y0 + h - 20]]);
    d.text(x0 + w + 46, y0 + 24, 'N 回巻き', { anchor: 'start', size: 11 });
    d.text(x0 + w / 2, y0 + h + 22, '断面積 S = ' + tx(p.S * 1e4) + ' cm²（巻数 N = ' + p.N + '）', { size: 11 });
    d.text(x0 + w / 2, y0 - 12, '磁場 B（紙面の裏向きを正）', { size: 11 });
    d.text(190, 176, 'Φ = BS ／ V = −N ΔΦ/Δt（V > 0: 磁場の正の向きに右ねじ = 時計回り）', { cls: 'dim', size: 10 });
    return d.svg();
  }

  // コイルを 180° 回転させる（adv 用）
  function figFlip(p) {
    const d = JK.plot.draw(380, 200);
    const x0 = 80, y0 = 40, w = 140, h = 96;
    d.rect(x0, y0, w, h, { cls: 'c3', w: 3 });
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) outIn(d, x0 + 24 + i * 32, y0 + 20 + j * 28, false, 5, 'dim');
    d.line((x0 + x0 + w) / 2, y0 - 16, (x0 + x0 + w) / 2, y0 + h + 16, { cls: 'dim', dash: true, w: 1.2 });
    d.path('M ' + (x0 + w + 20) + ' ' + (y0 + 12) + ' Q ' + (x0 + w + 62) + ' ' + (y0 + h / 2) + ' ' + (x0 + w + 20) + ' ' + (y0 + h - 12), { cls: 'c2', w: 2.2 });
    d.arrow(x0 + w + 30, y0 + h - 20, x0 + w + 18, y0 + h - 10, { cls: 'c2', w: 2.2 });
    d.text(x0 + w + 36, y0 + h / 2 + 4, '180°', { anchor: 'start', cls: 'c2' });
    d.text(x0 + w / 2, y0 + h + 34, '回転軸（コイルの面内・磁場に垂直）', { size: 11 });
    d.text(x0 + w / 2, y0 - 22, 'B = ' + tx(p.B) + ' T（紙面の裏向き）', { size: 11 });
    d.text(190, 192, 'N = ' + p.N + ' 回、S = ' + tx(p.S * 1e4) + ' cm²、R = ' + tx(p.R) + ' Ω', { cls: 'dim', size: 11 });
    return d.svg();
  }

  function stepsFar(p, s) {
    const N = p.N, St = nice(p.S * 1e4);
    const t1 = nice(p.t1), t2 = nice(p.t2), t3 = nice(p.t3);
    const absTex = (x) => sig(Math.abs(x));
    const mw = (x) => nice(x * 1e3);
    const dirText = (dPhi) => dPhi > 0 ? '増加' : (dPhi < 0 ? '減少' : '変化なし');
    const steps = [];
    steps.push({
      t: '磁束 $\\Phi$ を求める',
      m: [R`\Phi = BS`, R`\Phi_{0} = ` + nice(p.B0) + R` \times ` + nice(p.S) + ' = ' + nice(s.P0) + un('Wb') + R` = ` + mw(s.P0) + un('mWb'), R`\Phi_{1} = ` + nice(p.B1) + R` \times ` + nice(p.S) + ' = ' + nice(s.P1) + un('Wb') + R` = ` + mw(s.P1) + un('mWb'), R`\Phi_{2} = ` + nice(p.B2) + R` \times ` + nice(p.S) + ' = ' + nice(s.P2) + un('Wb') + R` = ` + mw(s.P2) + un('mWb')],
      n: R`コイル面（面積 $S = ` + St + R`\,\mathrm{cm^{2}} = ` + nice(p.S) + R`\,\mathrm{m^{2}}$）に垂直に磁束密度 $B$ の磁場が貫くとき、磁束は $\Phi = BS$（単位 $\mathrm{Wb}$、ウェーバ）です。面積は $\mathrm{m^{2}}$ に直して使います。`,
      easy: R`磁束は「コイルの面を貫く磁力線の本数」のイメージです。磁場が強いほど（磁力線が混んでいるほど）、コイルの面が広いほど、貫く本数は多くなります。だから $\Phi = B \times S$ です。面積は $1\,\mathrm{cm^{2}} = 10^{-4}\,\mathrm{m^{2}}$ と直して計算します。`
    });
    steps.push({
      t: 'ファラデーの電磁誘導の法則',
      m: [R`V = -N\frac{\Delta\Phi}{\Delta t}`, R`|V| = N\frac{|\Delta\Phi|}{\Delta t}`],
      n: R`コイルを貫く磁束が変化すると、その**変化の速さ**に比例した誘導起電力が生じます。$N$ 回巻きなら $N$ 倍になります。マイナス符号は、起電力が磁束の変化を**妨げる向き**にはたらく（レンツの法則）ことを表します。`,
      easy: R`磁束の「変化」が大事です。磁束が大きくても、変化しなければ電圧は生まれません。急に変化させるほど大きな電圧が生まれます。$\dfrac{\Delta\Phi}{\Delta t}$ は「1 秒あたりの磁束の変化」で、$\Phi$–$t$ グラフでは**傾き**にあたります。$N$ 回巻きは電池を $N$ 個つないだのと同じなので $N$ 倍です。`,
      pro: R`$V$–$t$ グラフは、$\Phi$–$t$ グラフの傾きに $-N$ を掛けたものです。傾き一定の区間は $V$ 一定、$\Phi$ 一定の区間は $V = 0$ です。`
    });
    steps.push({
      t: '各区間の誘導起電力',
      m: [R`0 \sim ` + t1 + R`\,\mathrm{s}:\ V_{1} = -N\frac{\Phi_{1} - \Phi_{0}}{t_{1}} = -` + nice(N) + R` \times \frac{` + mw(s.P1 - s.P0) + R`\times 10^{-3}}{` + t1 + '} = ' + sig(s.V1) + un('V'),
        R`\text{磁束が一定の区間}:\ V_{2} = 0`,
        R`\text{最後の区間}:\ V_{3} = -N\frac{\Phi_{2} - \Phi_{1}}{t_{3}} = -` + nice(N) + R` \times \frac{` + mw(s.P2 - s.P1) + R`\times 10^{-3}}{` + t3 + '} = ' + sig(s.V3) + un('V')],
      n: R`区間ごとに $\dfrac{\Delta\Phi}{\Delta t}$ を求めて $-N$ を掛けます（$\Phi_{1} - \Phi_{0}$ は $` + mw(s.P1 - s.P0) + R`\,\mathrm{mWb} = ` + mw(s.P1 - s.P0) + R`\times 10^{-3}\,\mathrm{Wb}$ のように Wb に直して計算します）。大きさは $|V_{1}| = ` + absTex(s.V1) + R`\,\mathrm{V}$、$|V_{3}| = ` + absTex(s.V3) + R`\,\mathrm{V}$ です。`,
      easy: R`$\Phi$–$t$ グラフの各区間の「傾き」（縦の変化 ÷ 横の変化）を読み取り、$N$ を掛けます。傾きが 0（水平）の区間では、磁束が変わらないので電圧は 0 です。`
    });
    steps.push({
      t: 'レンツの法則で電流の向きを決める',
      n: R`区間 1 では磁束が**` + dirText(s.P1 - s.P0) + R`**、区間 3 では**` + dirText(s.P2 - s.P1) + R`**します。誘導電流は、磁束の増加を妨げる向き（増加のとき）、または減少を妨げる向き（減少のとき）の磁場をつくる向きに流れます。符号は、磁場の正の向きに右ねじの向き（時計回り）を電流の正としたときの $V$ の符号と対応します。`,
      easy: R`レンツの法則は「磁束の変化を**いやがる**」と覚えます。磁束が増えるときは、増えるのをいやがって逆向きの磁場をつくる向きに、減るときは、減るのをいやがって同じ向きの磁場をつくる向きに電流が流れます。グラフでは、磁束が増える区間の $V$ は負、減る区間の $V$ は正になります。`,
      pro: R`向きの判定は「変化 → 妨げる → 右ねじ」の順。大きさは $\left|\dfrac{\Delta\Phi}{\Delta t}\right|$ で決まり、向きはレンツの法則で決まる、と役割を分けて考えます。`
    });
    steps.push({
      t: '回路に流れる電流と電気量',
      m: [R`I_{1} = \frac{|V_{1}|}{R} = ` + sig(Math.abs(s.V1) / p.R) + un('A') + R`,\quad I_{3} = \frac{|V_{3}|}{R} = ` + sig(Math.abs(s.V3) / p.R) + un('A'),
        R`q = \frac{N|\Delta\Phi|}{R}\ \ (\text{区間 1}:\ ` + sig(N * Math.abs(s.P1 - s.P0) / p.R) + un('C') + R`)`],
      n: R`コイルにつないだ回路の抵抗が $R$ のとき、電流の大きさは $I = \dfrac{|V|}{R}$ です。電流が流れた時間 $\Delta t$ のあいだに運ばれた電気量は $q = I\Delta t = \dfrac{N|\Delta\Phi|}{R}$ で、変化にかけた時間によりません。`,
      easy: R`起電力は電池と同じなので、「電圧 ÷ 抵抗 ＝ 電流」で電流が求まります。電流 × 時間 ＝ 電気量 です。この電気量は、磁束の変化量 $\Delta\Phi$ だけで決まり、ゆっくり変えても速く変えても同じになります（速いと大きな電流が短時間、ゆっくりだと小さな電流が長時間流れます）。`,
      lv: 2
    });
    return steps;
  }

  JK.registerSim({
    id: 'em-faraday',
    field: '電磁気',
    unit: 'p-induction',
    title: 'ファラデーの電磁誘導の法則（Φ–t・V–t グラフ）',
    desc: '巻数 $N$・断面積 $S$ のコイルを貫く磁束密度が時間とともに変化するとき、磁束 $\\Phi$ と誘導起電力 $V = -N\\dfrac{\\Delta\\Phi}{\\Delta t}$ の時間変化を、$\\Phi$–$t$ グラフと $V$–$t$ グラフで求めます。',
    form: [R`\Phi = BS`, R`V = -N\frac{\Delta\Phi}{\Delta t}`, R`I = \frac{|V|}{R},\quad q = \frac{N|\Delta\Phi|}{R}`],
    inputs: [
      { key: 'N', label: '巻数 $N$', unit: '回', type: 'int', def: '100', min: 1, max: 100000 },
      { key: 'S', label: 'コイルの断面積 $S$', unit: 'cm²', type: 'num', def: '50', min: 0.1, max: 10000 },
      { key: 'R', label: '回路の抵抗 $R$', unit: 'Ω', type: 'num', def: '10', min: 0.01, max: 100000 },
      { key: 'B0', label: '最初の磁束密度 $B_{0}$', unit: 'T', type: 'num', def: '0.10', min: -10, max: 10, hint: '紙面の裏向きを正、表向きは負で入力' },
      { key: 'B1', label: '1 回目の変化後の磁束密度 $B_{1}$', unit: 'T', type: 'num', def: '0.50', min: -10, max: 10 },
      { key: 't1', label: '$B_{0} \\to B_{1}$ にかける時間 $t_{1}$', unit: 's', type: 'num', def: '2.0', min: 0.001, max: 10000 },
      { key: 't2', label: '$B_{1}$ のまま一定に保つ時間 $t_{2}$', unit: 's', type: 'num', def: '1.0', min: 0, max: 10000, hint: '0 なら一定の区間なし' },
      { key: 'B2', label: '2 回目の変化後の磁束密度 $B_{2}$', unit: 'T', type: 'num', def: '0', min: -10, max: 10 },
      { key: 't3', label: '$B_{1} \\to B_{2}$ にかける時間 $t_{3}$', unit: 's', type: 'num', def: '3.0', min: 0.001, max: 10000 }
    ],
    examples: [
      { label: '増加 → 一定 → 減少', v: { N: '100', S: '50', R: '10', B0: '0.10', B1: '0.50', t1: '2.0', t2: '1.0', B2: '0', t3: '3.0' } },
      { label: '磁場の向きが反転する', v: { N: '200', S: '20', R: '5.0', B0: '0.30', B1: '-0.30', t1: '0.50', t2: '0', B2: '-0.30', t3: '1.0' } },
      { label: 'ゆっくり増加（1 区間のみ）', v: { N: '50', S: '100', R: '2.0', B0: '0', B1: '0.20', t1: '4.0', t2: '0', B2: '0.20', t3: '1.0' } }
    ],
    intro: {
      easy: R`コイルの中を通る磁力線の本数（**磁束**）が変化すると、コイルに電圧（**誘導起電力**）が生まれます。大事なのは磁束の大きさではなく**変化の速さ**です。磁石をコイルに急に近づけるほど、大きな電圧が生まれます。磁束の時間変化を表す $\Phi$–$t$ グラフの**傾き**が、そのまま電圧の大きさを決めます。コイルの巻数が $N$ 回なら、電圧は $N$ 倍になります。`,
      normal: R`$\Phi = BS$、$V = -N\dfrac{\Delta\Phi}{\Delta t}$（大きさは $N\dfrac{|\Delta\Phi|}{\Delta t}$、向きはレンツの法則）。$V$–$t$ グラフは、$\Phi$–$t$ グラフの傾きに $-N$ を掛けた形になります。`,
      pro: R`$\Phi$–$t$ グラフの傾き → 区間ごとに $V$ が一定の階段状グラフ。電気量 $q = \dfrac{N|\Delta\Phi|}{R}$ は変化の速さによらないことも定番です（コイルを 180° 回すと $\Delta\Phi = 2BS$）。`
    },
    compute(v) {
      const p = { N: v.N, S: v.S * 1e-4, R: v.R, B0: v.B0, B1: v.B1, B2: v.B2, t1: v.t1, t2: v.t2, t3: v.t3 };
      const s = solveFar(p);
      if (![s.P0, s.P1, s.P2, s.V1, s.V3].every(isFinite)) throw new JK.CalcError('値が大きすぎて計算できません。');
      const sgn = (x) => (Math.abs(x) < 1e-12 ? 0 : x);
      const res = [
        { label: '磁束 Φ（最初 → 変化後 → 最後）', tex: R`\Phi_{0} = ` + sig(sgn(s.P0)) + R`,\ \Phi_{1} = ` + sig(sgn(s.P1)) + R`,\ \Phi_{2} = ` + sig(sgn(s.P2)) + un('Wb') },
        { label: '区間 1 の誘導起電力 V₁', tex: sig(sgn(s.V1)) + un('V') + R`\ \ (|V_{1}| = ` + sig(Math.abs(s.V1)) + R`)` },
        { label: '一定の区間の誘導起電力 V₂', tex: R`0` + un('V') },
        { label: '最後の区間の誘導起電力 V₃', tex: sig(sgn(s.V3)) + un('V') + R`\ \ (|V_{3}| = ` + sig(Math.abs(s.V3)) + R`)` },
        { label: '区間 1 を流れる電流の大きさ', tex: sig(Math.abs(s.V1) / p.R) + un('A') }
      ];
      const fig = stack([graphPhi(p, s), graphVf(p, s)], 340);
      const steps = stepsFar(p, s);
      steps[0].fig = figCoil(p);
      return { result: res, steps: steps, fig: fig };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // コイルを 180° 回転: ΔΦ = 2BS
        let N, Sc, B, dt, Rr;
        for (let k = 0; k < 200; k++) {
          N = rng.pick([50, 100, 200]); Sc = rng.pick([20, 50, 100]); B = rng.pick([0.10, 0.20, 0.50]); dt = rng.pick([0.10, 0.20, 0.50]); Rr = rng.pick([2.0, 5.0, 10, 20]);
          if (ok3(2 * B * Sc * 1e-4) && ok3(N * 2 * B * Sc * 1e-4 / dt)) break;
        }
        const S = Sc * 1e-4, dPhi = 2 * B * S, Vavg = N * dPhi / dt, Iavg = Vavg / Rr, q = N * dPhi / Rr;
        const p = { N: N, S: S, R: Rr, B: B };
        const sol = [
          {
            t: '磁束の変化量を求める',
            m: [R`\Phi_{前} = BS = ` + nice(B) + R` \times ` + nice(S) + ' = ' + sig(B * S) + un('Wb'), R`\Phi_{後} = -BS = -` + sig(B * S) + un('Wb'), R`|\Delta\Phi| = |\Phi_{後} - \Phi_{前}| = 2BS = ` + sig(dPhi) + un('Wb')],
            n: R`コイルを 180° 回転させると、磁場が貫く向きが逆になるので、磁束は $BS$ から $-BS$ に変わります。変化量の大きさは $2BS$ で、$BS$ ではありません。面積 $` + nice(Sc) + R`\,\mathrm{cm^{2}}$ は $` + nice(S) + R`\,\mathrm{m^{2}}$ に直します。`,
            easy: R`コイルをひっくり返すと、磁力線がコイルを貫く向きが表から裏（あるいは逆）に変わります。「$+BS$」から「$-BS$」への変化なので、変化量は $BS$ の **2 倍** です。ここを間違えやすいので注意しましょう。`,
            pro: R`180° 回転 → $\Delta\Phi = 2BS$、90° 回転 → $BS$（磁束が 0 になる）。回転角と $\Phi = BS\cos\theta$ から場合分けします。`
          },
          {
            t: '平均の誘導起電力と電流',
            m: [R`\bar{V} = N\frac{|\Delta\Phi|}{\Delta t} = ` + nice(N) + R` \times \frac{` + sig(dPhi) + '}{' + nice(dt) + '} = ' + sig(Vavg) + un('V'), R`\bar{I} = \frac{\bar{V}}{R} = \frac{` + sig(Vavg) + '}{' + nice(Rr) + '} = ' + sig(Iavg) + un('A')],
            n: R`回転のあいだ、磁束は一定の割合ではなく変化しますが、「平均の変化の割合」を考えて、平均の起電力 $\bar{V} = N\dfrac{|\Delta\Phi|}{\Delta t}$ を求めます。`,
            easy: R`回転のしかたによって電圧は刻々と変わりますが、「全体で $\Delta t$ 秒かけて磁束が $\Delta\Phi$ 変わった」という平均で考えます。平均の電圧を抵抗で割れば平均の電流が出ます。`
          },
          {
            t: '流れた電気量',
            m: [R`q = \bar{I}\,\Delta t = \frac{N|\Delta\Phi|}{R} = \frac{` + nice(N) + R` \times ` + sig(dPhi) + '}{' + nice(Rr) + '} = ' + sig(q) + un('C')],
            n: R`電気量は $q = \bar{I}\Delta t = \dfrac{N|\Delta\Phi|}{R}$ で、回転にかかる時間 $\Delta t$ によりません。ゆっくり回すと電流は小さく長く、速く回すと電流は大きく短く流れ、その積は同じになります。`,
            easy: R`電気量 ＝ 電流 × 時間 ですが、式を整理すると時間が約分されて消えます。つまり、流れる電気の「合計」は、磁束がどれだけ変わったか（$\Delta\Phi$）と抵抗 $R$ だけで決まります。`,
            pro: R`$q = \dfrac{N\Delta\Phi}{R}$ は定番の関係式です（衝撃検流計で磁束の変化量を測る原理）。`
          }
        ];
        return {
          title: 'コイルを 180° 回転させたときの誘導',
          body: R`巻数 $` + N + R`$、断面積 $` + sf(Sc) + R`\,\mathrm{cm^{2}}$ の長方形のコイルを、磁束密度 $` + sf(B) + R`\,\mathrm{T}$ の一様な磁場（紙面の裏向き）の中に、磁場に垂直に置く。このコイルに抵抗値 $` + sf(Rr) + R`\,\mathrm{\Omega}$ の抵抗をつなぎ、コイルの面内の軸のまわりに、時間 $` + sf(dt) + R`\,\mathrm{s}$ かけて一様に $180\degree$ 回転させた。コイル自身の抵抗は無視する。次の問いに答えよ。`,
          fig: figFlip({ N: N, S: S, R: Rr, B: B }),
          parts: [
            numPart('(1)', R`回転のあいだの平均の誘導起電力の大きさ $\bar{V}$`, Vavg, 'V'),
            numPart('(2)', R`回転のあいだに抵抗を流れた平均の電流 $\bar{I}$`, Iavg, 'A'),
            numPart('(3)', R`回転のあいだに抵抗を流れた電気量 $q$`, q, 'C')
          ],
          solution: sol
        };
      }
      if (level === 'mid') {
        // Φ–t グラフ（3 区間）から各区間の起電力を求める
        let N, P0, P1, P2, t1, t2, t3, Rr, s;
        for (let k = 0; k < 300; k++) {
          N = rng.pick([50, 100, 200]); P0 = rng.pick([0, 2, 4]); P1 = rng.pick([6, 8, 10]); P2 = rng.pick([0, 2, 4]);
          t1 = rng.pick([1.0, 2.0, 4.0]); t2 = rng.pick([1.0, 2.0]); t3 = rng.pick([1.0, 2.0, 4.0, 5.0]); Rr = rng.pick([2.0, 5.0, 10, 20]);
          s = solveFar({ N: N, S: 1e-3, B0: P0, B1: P1, B2: P2, t1: t1, t2: t2, t3: t3 });   // S = 1e-3 m² のとき B[T] × 1e-3 = Φ[Wb] → Φ[mWb] = B
          if (ok3(Math.abs(s.V1)) && ok3(Math.abs(s.V3)) && Math.abs(s.V1) !== Math.abs(s.V3)) break;
        }
        const p = { N: N, S: 1e-3, B0: P0, B1: P1, B2: P2, t1: t1, t2: t2, t3: t3, R: Rr };
        // s は Φ[Wb] = B × 1e-3（B にそのまま mWb の数値を入れた）
        const sol = stepsFar(p, s).slice(1, 3);
        sol.push({
          t: '回路に流れる電流',
          m: [R`I_{3} = \frac{|V_{3}|}{R} = \frac{` + sig(Math.abs(s.V3)) + '}{' + nice(Rr) + '} = ' + sig(Math.abs(s.V3) / Rr) + un('A')],
          n: R`最後の区間の起電力の大きさを、回路の抵抗で割ります。`,
          easy: R`起電力は電池と同じはたらきをするので、「電圧 ÷ 抵抗 ＝ 電流」で電流が求まります。`
        });
        return {
          title: 'Φ–t グラフから誘導起電力を読み取る',
          body: R`巻数 $` + N + R`$ のコイルを貫く磁束 $\Phi$ が、図のように時間 $t$ とともに変化した（$\Phi$ の単位は $\mathrm{mWb} = 10^{-3}\,\mathrm{Wb}$）。コイルには抵抗値 $` + sf(Rr) + R`\,\mathrm{\Omega}$ の抵抗がつながれている。次の問いに答えよ。`,
          fig: graphPhi(p, s, { label: true }),
          parts: [
            numPart('(1)', R`$0 \sim ` + sf(t1) + R`\,\mathrm{s}$ の間に生じる誘導起電力の大きさ`, Math.abs(s.V1), 'V'),
            numPart('(2)', R`$t = ` + sf(t1 + t2 + t3 / 2) + R`\,\mathrm{s}$ のとき（図の最後の区間）に生じる誘導起電力の大きさ`, Math.abs(s.V3), 'V'),
            numPart('(3)', R`(2) のとき抵抗を流れる電流の大きさ $I$`, Math.abs(s.V3) / Rr, 'A')
          ],
          solution: sol
        };
      }
      // basic: 磁束密度が一様に変化
      let N, Sc, B0, B1, dt, Rr;
      for (let k = 0; k < 200; k++) {
        N = rng.pick([10, 20, 50, 100, 200]); Sc = rng.pick([10, 20, 50, 100]); B0 = rng.pick([0, 0.10, 0.20]); B1 = rng.pick([0.40, 0.50, 0.60, 0.80, 1.0]); dt = rng.pick([0.10, 0.20, 0.50, 1.0, 2.0]); Rr = rng.pick([2.0, 4.0, 5.0, 10, 20]);
        const dP = (B1 - B0) * Sc * 1e-4;
        if (B1 > B0 && ok3(dP) && ok3(N * dP / dt)) break;
      }
      const S = Sc * 1e-4;
      const p = { N: N, S: S, R: Rr, B0: B0, B1: B1, B2: B1, t1: dt, t2: 0, t3: 1 };
      const s = solveFar(p);
      const dP = s.P1 - s.P0, V = Math.abs(s.V1);
      const base = stepsFar(p, s);
      const sol = [
        {
          t: '磁束の変化量を求める',
          m: [R`\Phi = BS`, R`\Phi_{0} = ` + nice(B0) + R` \times ` + nice(S) + ' = ' + sig(s.P0) + un('Wb'), R`\Phi_{1} = ` + nice(B1) + R` \times ` + nice(S) + ' = ' + sig(s.P1) + un('Wb'), R`\Delta\Phi = \Phi_{1} - \Phi_{0} = ` + sig(dP) + un('Wb')],
          n: R`面積 $S = ` + nice(Sc) + R`\,\mathrm{cm^{2}} = ` + nice(S) + R`\,\mathrm{m^{2}}$ に直し、磁束 $\Phi = BS$ を変化の前後で求めて差をとります。`,
          easy: R`磁束は「コイルを貫く磁力線の本数」のイメージで、$\Phi = B \times S$ です。面積は $1\,\mathrm{cm^{2}} = 10^{-4}\,\mathrm{m^{2}}$ と直してから使います。変化の前と後の磁束を求め、その差が「磁束の変化量」です。`
        },
        base[1],
        {
          t: '誘導起電力の大きさ',
          m: [R`|V| = N\frac{|\Delta\Phi|}{\Delta t} = ` + nice(N) + R` \times \frac{` + sig(dP) + '}{' + nice(dt) + '} = ' + sig(V) + un('V')],
          n: R`磁束の変化量 $\Delta\Phi$ を、変化にかけた時間 $\Delta t$ で割って、巻数 $N$ を掛けます。`,
          easy: R`「1 秒あたりの磁束の変化」に巻数 $N$ を掛けるだけです。時間をかけてゆっくり変化させるほど、起電力は小さくなります。`
        },
        {
          t: '回路に流れる電流',
          m: [R`I = \frac{|V|}{R} = \frac{` + sig(V) + '}{' + nice(Rr) + '} = ' + sig(V / Rr) + un('A')],
          n: R`起電力 $|V|$ を電池とみなし、抵抗 $R$ にオームの法則を使います。`,
          easy: R`コイルが電池のはたらきをするので、「電圧 ÷ 抵抗 ＝ 電流」で電流が求まります。`
        }
      ];
      return {
        title: '磁束密度の変化と誘導起電力',
        body: R`巻数 $` + N + R`$、断面積 $` + sf(Sc) + R`\,\mathrm{cm^{2}}$ のコイルを、磁場に垂直に置く。磁束密度を $` + sf(B0) + R`\,\mathrm{T}$ から $` + sf(B1) + R`\,\mathrm{T}$ まで、一定の割合で $` + sf(dt) + R`\,\mathrm{s}$ かけて増加させた。コイルには抵抗値 $` + sf(Rr) + R`\,\mathrm{\Omega}$ の抵抗がつながれている。次の問いに答えよ。`,
        fig: figCoil({ N: N, S: S }),
        parts: [
          numPart('(1)', R`コイルを貫く磁束の変化量の大きさ $|\Delta\Phi|$`, dP, 'Wb'),
          numPart('(2)', R`コイルに生じる誘導起電力の大きさ $|V|$`, V, 'V'),
          numPart('(3)', R`抵抗を流れる電流の大きさ $I$`, V / Rr, 'A')
        ],
        solution: sol
      };
    }
  });

  /* =====================================================================
     3. 自己誘導とコイルのエネルギー
     ===================================================================== */

  // 電流変化 I1 → I2（時間 dt）。誘導起電力は電流の向きを正として V = -L dI/dt
  function solveSelf(p) {
    const dI = p.I2 - p.I1;
    return { dI: dI, V: -p.L * dI / p.dt, U1: 0.5 * p.L * p.I1 * p.I1, U2: 0.5 * p.L * p.I2 * p.I2, rate: dI / p.dt };
  }

  function graphIt(p, s) {
    const dt = p.dt, x0 = -dt * 0.6, x1 = dt * 1.6;
    const ps = [[x0, p.I1], [0, p.I1], [dt, p.I2], [x1, p.I2]];
    const vs = [[x0, 0], [0, 0], [0, s.V], [dt, s.V], [dt, 0], [x1, 0]];
    const g1 = JK.plot.graph({
      w: 340, h: 160, x: [x0, x1], y: yRange([p.I1, p.I2]),
      segs: polySegs(ps, 'c1').filter((q) => Math.abs(q.x2 - q.x1) + Math.abs(q.y2 - q.y1) > 1e-12),
      vlines: [{ x: 0 }, { x: dt }],
      axis: ['t [s]', 'I [A]']
    });
    const sg = [
      { x1: x0, y1: 0, x2: 0, y2: 0, cls: 'c2' }, { x1: 0, y1: 0, x2: 0, y2: s.V, cls: 'dim', dash: true },
      { x1: 0, y1: s.V, x2: dt, y2: s.V, cls: 'c2' }, { x1: dt, y1: s.V, x2: dt, y2: 0, cls: 'dim', dash: true },
      { x1: dt, y1: 0, x2: x1, y2: 0, cls: 'c2' }
    ];
    const g2 = JK.plot.graph({ w: 340, h: 160, x: [x0, x1], y: yRange([s.V]), segs: sg, axis: ['t [s]', 'V [V]'] });
    return stack([g1, g2], 340);
  }

  function graphRL(E, Rr, L) {
    const I = E / Rr, tau = L / Rr;
    return JK.plot.graph({
      w: 330, h: 200, x: [0, tau * 5], y: [0, I * 1.2],
      curves: [{ f: (t) => I * (1 - Math.exp(-t / tau)), cls: 'c1' }],
      hlines: [{ y: I, label: 'E/R' }],
      points: [{ x: tau, y: I * (1 - Math.exp(-1)), label: '63 %', cls: 'c3', pos: 'br' }],
      vlines: [{ x: tau, label: 'τ' }],
      axis: ['t [s]', 'I [A]']
    });
  }

  // 電池・スイッチ・抵抗・コイルの直列回路（スイッチは開いた状態）
  function figRL(p) {
    const d = JK.plot.draw(380, 200);
    const yT = 50, yB = 150, xL = 62, xR = 318;
    d.battery(xL, 78, xL, 124, { label: 'E' });
    d.wire([[xL, 78], [xL, yT], [100, yT]]);
    d.line(100, yT, 140, yT - 20, { cls: 'fg', w: 1.8 });
    d.dot(100, yT, { r: 2.6 }); d.dot(150, yT, { r: 2.6 });
    d.text(122, yT - 28, 'S', { italic: true });
    d.wire([[150, yT], [165, yT]]);
    d.resistor(165, yT, 235, yT, { label: 'R' });
    d.wire([[235, yT], [xR, yT], [xR, 78]]);
    d.coil(xR, 78, xR, 124, { label: 'L', n: 4 });
    d.wire([[xR, 124], [xR, yB], [xL, yB], [xL, 124]]);
    d.text(190, 182, 'E = ' + tx(p.E) + ' V ／ R = ' + tx(p.R) + ' Ω ／ L = ' + tx(p.L) + ' H', { size: 11 });
    return d.svg();
  }

  // 電池 E・抵抗 R1・コイル L の直列回路と、L に並列な R2。スイッチ S を開くと L–R2 の閉回路が残る
  function figLR(p) {
    const d = JK.plot.draw(380, 220);
    const yT = 50, yB = 160, xL = 52, xA = 236, xC = 326;
    d.battery(xL, 84, xL, 130, { label: 'E' });
    d.wire([[xL, 84], [xL, yT], [86, yT]]);
    d.line(86, yT, 126, yT - 20, { cls: 'fg', w: 1.8 });
    d.dot(86, yT, { r: 2.6 }); d.dot(136, yT, { r: 2.6 });
    d.text(108, yT - 28, 'S', { italic: true });
    d.wire([[136, yT], [150, yT]]);
    d.resistor(150, yT, 210, yT, { label: 'R₁' });
    d.wire([[210, yT], [xC, yT]]);
    d.wire([[xA, yT], [xA, 76]]);
    d.coil(xA, 76, xA, 134, { label: 'L', n: 4 });
    d.wire([[xA, 134], [xA, yB]]);
    d.wire([[xC, yT], [xC, 78]]);
    d.resistor(xC, 78, xC, 132, { label: 'R₂' });
    d.wire([[xC, 132], [xC, yB]]);
    d.wire([[xL, 130], [xL, yB], [xC, yB]]);
    d.dot(xA, yT, { r: 2.8 }); d.dot(xA, yB, { r: 2.8 });
    d.text(190, 196, 'E = ' + tx(p.E) + ' V ／ R₁ = ' + tx(p.R1) + ' Ω ／ R₂ = ' + tx(p.R2) + ' Ω ／ L = ' + tx(p.L) + ' H', { size: 11 });
    d.text(190, 212, 'S を十分長く閉じてから、S を開く', { cls: 'dim', size: 11 });
    return d.svg();
  }

  function stepsSelf(mode, p, s) {
    const steps = [];
    if (mode === 'change') {
      const L = nice(p.L), dt = nice(p.dt);
      const inc = s.dI > 0;
      steps.push({
        t: '自己誘導とは',
        n: R`コイルを流れる電流が変化すると、コイル自身を貫く磁束が変化するので、その変化を**妨げる向き**に誘導起電力が生じます（**自己誘導**）。コイルは、電流を急に変えようとすると逆らう性質をもっています。`,
        easy: R`止まっている重い荷車を急に動かそうとしても、動いている荷車を急に止めようとしても、荷車は今の状態を保とうとして逆らいます（慣性）。コイルも同じで、電流が急に増えようとすると逆らい、急に減ろうとすると「減らすまい」と逆らいます。これが自己誘導で、電流の変化に対する「慣性」のようなものです。`,
        pro: R`コイルは電流の変化を妨げる素子で、電流そのものは急には変えられません（電流の連続性）。回路の「直後」「十分後」の問題では必ず使います。`
      });
      steps.push({
        t: '自己誘導起電力の大きさ',
        m: [R`V = -L\frac{\Delta I}{\Delta t}`, R`\Delta I = I_{2} - I_{1} = ` + pn(p.I2) + ' - ' + pn(p.I1) + ' = ' + nice(s.dI) + un('A'), R`|V| = L\frac{|\Delta I|}{\Delta t} = ` + L + R` \times \frac{` + nice(Math.abs(s.dI)) + '}{' + dt + '} = ' + sig(Math.abs(s.V)) + un('V')],
        n: R`変化前の電流を $I_{1}$、変化後の電流を $I_{2}$ とします。自己誘導起電力の大きさは、電流の変化の割合 $\left|\dfrac{\Delta I}{\Delta t}\right|$ に比例します。比例定数 $L$ を**自己インダクタンス**といい、単位は $\mathrm{H}$（ヘンリー）です。`,
        easy: R`電流を急に変えるほど（$\dfrac{\Delta I}{\Delta t}$ が大きいほど）、コイルは強く逆らい、大きな電圧が生まれます。$L$ は「そのコイルの逆らいやすさ」の大きさです。鉄心を入れたり巻数を増やしたりすると $L$ は大きくなります。`,
        pro: R`$|V| = L\left|\dfrac{\Delta I}{\Delta t}\right|$。「電流が $\Delta t$ で $\Delta I$ 変わる → $V$」は、$\Delta I$ に符号をつけず大きさだけで計算します。`
      });
      steps.push({
        t: '誘導起電力の向き（レンツの法則）',
        n: inc ? R`電流が**増加**しているので、誘導起電力は電流の増加を妨げる向き、つまり**電流と逆向き**にはたらきます。` : (s.dI < 0 ? R`電流が**減少**しているので、誘導起電力は電流の減少を妨げる向き、つまり**電流と同じ向き**にはたらきます。` : R`電流が変化しないので、誘導起電力は生じません。`),
        easy: R`コイルは「今の状態をいやがる」ので、電流が増えるときは「増えるな」と逆向きに、電流が減るときは「減るな」と同じ向きに起電力をつくります。$V = -L\dfrac{\Delta I}{\Delta t}$ のマイナス符号は、この「逆らう」という意味です。`,
        lv: 2
      });
      steps.push({
        t: 'コイルに蓄えられるエネルギー',
        m: [R`U = \frac{1}{2}LI^{2}`, R`U_{1} = \frac{1}{2} \times ` + L + R` \times ` + pw2(pn(p.I1)) + ' = ' + sig(s.U1) + un('J'), R`U_{2} = \frac{1}{2} \times ` + L + R` \times ` + pw2(pn(p.I2)) + ' = ' + sig(s.U2) + un('J')],
        n: R`電流 $I$ が流れているコイルは、磁場のかたちでエネルギー $U = \dfrac{1}{2}LI^{2}$ を蓄えています。電流を増やすと蓄えるエネルギーが増え（電源がその仕事をします）、減らすと放出されます。`,
        easy: R`運動している物体が運動エネルギー $\dfrac{1}{2}mv^{2}$ をもつように、電流が流れているコイルも、電流の 2 乗に比例したエネルギー $\dfrac{1}{2}LI^{2}$ をもちます。対応は「質量 $m$ ↔ $L$」「速さ $v$ ↔ 電流 $I$」です。`,
        pro: R`エネルギーの変化は $\Delta U = \dfrac{1}{2}L\left(I_{2}^{2} - I_{1}^{2}\right) = ` + sig(s.U2 - s.U1) + R`\,\mathrm{J}$。`
      });
      steps.push({
        t: '$I$–$t$ グラフと $V$–$t$ グラフ',
        n: R`電流は時間 $\Delta t$ のあいだに一定の割合で変化し、その間だけ一定の起電力が生じます。電流が変化していない区間では起電力は $0$ です。$V$–$t$ グラフは $I$–$t$ グラフの傾きに $-L$ を掛けた形です。`,
        easy: R`電流のグラフが斜めに変化している間だけ、コイルに電圧が生まれます。グラフが水平（電流が一定）のときは、コイルは「ただの導線」と同じで電圧は 0 です。`,
        fig: graphIt(p, s),
        lv: 3
      });
    } else {
      const E = nice(p.E), Rr = nice(p.R), L = nice(p.L);
      // 十分後の電流 I = E/R を、続くエネルギーの式に代入する値（表示した値で計算し直すと、結果の表示と合う桁数）
      const Iv = p.E / p.R, Uv = 0.5 * p.L * Iv * Iv;
      const dI = digitsOf((d) => { const Ir = U.roundSig(Iv, d); return { I: Ir, U: 0.5 * p.L * Ir * Ir }; }, { I: Iv, U: Uv });
      steps.push({
        t: 'スイッチを入れた直後（$t = 0$）',
        m: [R`I(0) = 0,\qquad V_{L}(0) = E - R \times 0 = E = ` + E + un('V'), R`\left(\frac{\Delta I}{\Delta t}\right)_{t=0} = \frac{V_{L}}{L} = \frac{E}{L} = \frac{` + E + '}{' + L + '} = ' + sig(p.E / p.L) + un('A/s')],
        n: R`コイルを流れる電流は急には変えられないので、スイッチを入れた直後の電流は $0$ です。抵抗の電圧は $R \times 0 = 0$ なので、電池の電圧 $E$ のすべてがコイルにかかります。このときの電流の増加の割合は $\dfrac{\Delta I}{\Delta t} = \dfrac{E}{L}$ です。`,
        easy: R`コイルは電流が急に変わるのをいやがるので、スイッチを入れた瞬間は電流が流れません（0 から少しずつ増えていきます）。電流が 0 なら抵抗には電圧がかからないので、電池の電圧はそっくりコイルがかぶります。この瞬間のコイルは「電流を通さない切れた導線」のようにふるまいます。`,
        pro: R`「直後」は、コイルの電流を保存する（連続）ことから始めます。直後の $I$ が分かれば、あとはキルヒホッフの法則です。`
      });
      steps.push({
        t: '十分に時間がたったあと（定常状態）',
        m: [R`\frac{\Delta I}{\Delta t} = 0 \;\Rightarrow\; V_{L} = 0`, R`I = \frac{E}{R} = \frac{` + E + '}{' + Rr + '} = ' + fres(U.roundSig(Iv, dI), Iv, dI) + un('A')],
        n: R`電流が一定になると $\dfrac{\Delta I}{\Delta t} = 0$ なので、コイルの自己誘導起電力は $0$ で、コイルはただの導線とみなせます。電池の電圧 $E$ がすべて抵抗 $R$ にかかり、オームの法則から $I = \dfrac{E}{R}$ です。`,
        easy: R`電流が一定になると、コイルは「電流が変わるのをいやがる」理由がなくなり、ただの導線と同じになります。こうなれば、電池と抵抗だけの回路と同じで、オームの法則 $I = \dfrac{V}{R}$ が使えます。`,
        pro: R`スイッチ ON：直後は「コイル = 断線（電流 0）」、十分後は「コイル = 導線（電圧 0）」。OFF ではその逆（コイルが直前の電流を保つ）です。`
      });
      steps.push({
        t: 'コイルに蓄えられたエネルギー',
        m: [R`U = \frac{1}{2}LI^{2} = \frac{1}{2} \times ` + L + R` \times ` + pw2(nice(Iv, dI)) + ' = ' + sig(Uv) + un('J')],
        n: R`十分に時間がたったときコイルを流れる電流 $I = \dfrac{E}{R}$ から、蓄えられたエネルギー $U = \dfrac{1}{2}LI^{2}$ が求まります。`,
        easy: R`電池は、電流が 0 から $\dfrac{E}{R}$ に増えていく間に、コイルに磁場のエネルギーを蓄えさせました。その大きさが $\dfrac{1}{2}LI^{2}$ です。`,
        lv: 2
      });
      steps.push({
        t: '電流の増え方（時定数）',
        m: [R`I(t) = \frac{E}{R}\left(1 - e^{-t/\tau}\right),\qquad \tau = \frac{L}{R} = \frac{` + L + '}{' + Rr + '} = ' + sig(p.L / p.R) + un('s')],
        n: R`電流は、はじめは急に、あとはゆるやかに $\dfrac{E}{R}$ に近づきます。目安の時間 $\tau = \dfrac{L}{R}$ で最終値の約 $63\,\%$ になります（高校の範囲を超える内容ですが、グラフの形として知っておくと役立ちます）。`,
        easy: R`コイルの逆らいやすさ $L$ が大きいほど、電流が増えるのに時間がかかります。抵抗 $R$ が大きいほど最終的な電流が小さいので、早く到達します。$\tau = \dfrac{L}{R}$ がその目安の時間です。`,
        fig: graphRL(p.E, p.R, p.L),
        lv: 3
      });
    }
    return steps;
  }

  JK.registerSim({
    id: 'em-self-induction',
    field: '電磁気',
    unit: 'p-induction',
    title: '自己誘導とコイルのエネルギー',
    desc: '電流の変化から自己誘導起電力 $V = -L\\dfrac{\\Delta I}{\\Delta t}$ とコイルに蓄えられるエネルギー $U = \\dfrac{1}{2}LI^{2}$ を求めます。電池・抵抗・コイルの直列回路でスイッチを入れた「直後」と「十分後」も扱います。',
    form: [R`V = -L\frac{\Delta I}{\Delta t}`, R`U = \frac{1}{2}LI^{2}`, R`I_{\infty} = \frac{E}{R},\quad \tau = \frac{L}{R}`],
    inputs: [
      { key: 'mode', label: '調べる場面', type: 'select', def: 'change', options: [['change', '電流が変化するときの起電力とエネルギー'], ['rl', '電池・抵抗・コイルの回路でスイッチを入れる']] },
      { key: 'L', label: '自己インダクタンス $L$', unit: 'H', type: 'num', def: '0.50', min: 0.0001, max: 1000 },
      { key: 'I1', label: '変化前の電流 $I_{1}$', unit: 'A', type: 'num', def: '0', min: -1000, max: 1000, show: (raw) => raw.mode !== 'rl' },
      { key: 'I2', label: '変化後の電流 $I_{2}$', unit: 'A', type: 'num', def: '2.0', min: -1000, max: 1000, show: (raw) => raw.mode !== 'rl' },
      { key: 'dt', label: '変化にかかる時間 $\\Delta t$', unit: 's', type: 'num', def: '0.10', min: 0.00001, max: 1000, show: (raw) => raw.mode !== 'rl' },
      { key: 'E', label: '電池の電圧 $E$', unit: 'V', type: 'num', def: '12', min: 0.001, max: 100000, show: (raw) => raw.mode === 'rl' },
      { key: 'Rr', label: '抵抗 $R$', unit: 'Ω', type: 'num', def: '6.0', min: 0.001, max: 1000000, show: (raw) => raw.mode === 'rl' }
    ],
    examples: [
      { label: '電流が増える', v: { mode: 'change', L: '0.50', I1: '0', I2: '2.0', dt: '0.10' } },
      { label: '電流が減る', v: { mode: 'change', L: '2.0', I1: '3.0', I2: '1.0', dt: '0.050' } },
      { label: 'スイッチを入れた直後と十分後', v: { mode: 'rl', L: '0.30', E: '12', Rr: '6.0' } }
    ],
    intro: {
      easy: R`コイルは、流れる電流が変わるのを**いやがる**性質をもっています。電流が増えようとすると「増えるな」、減ろうとすると「減るな」という向きに電圧（**自己誘導起電力**）を生み、変化が急なほど大きな電圧になります。この性質の強さを表すのが**自己インダクタンス** $L$（単位 $\mathrm{H}$）です。また、電流が流れているコイルは、磁場のかたちでエネルギー $\dfrac{1}{2}LI^{2}$ を蓄えています。`,
      normal: R`$V = -L\dfrac{\Delta I}{\Delta t}$（大きさ $L\left|\dfrac{\Delta I}{\Delta t}\right|$、向きは電流の変化を妨げる向き）。エネルギー $U = \dfrac{1}{2}LI^{2}$。スイッチ ON 直後はコイルの電流 $0$、十分後はコイルの電圧 $0$ として回路を解きます。`,
      pro: R`回路の問題では「直後：コイルの電流は直前と同じ」「十分後：$\dfrac{\Delta I}{\Delta t} = 0$ でコイルはただの導線」の 2 点だけで解けます。スイッチを切ったあと、コイルに蓄えられた $\dfrac{1}{2}LI^{2}$ が抵抗でジュール熱になるのもよく出ます。`
    },
    compute(v) {
      if (v.mode === 'rl') {
        const p = { E: v.E, R: v.Rr, L: v.L };
        const I = p.E / p.R, U = 0.5 * p.L * I * I, tau = p.L / p.R;
        if (![I, U, tau].every(isFinite)) throw new JK.CalcError('値が大きすぎて計算できません。');
        return {
          result: [
            { label: 'スイッチを入れた直後の電流 I(0)', tex: R`0` + un('A') },
            { label: '直後のコイルにかかる電圧 V_L', tex: sig(p.E) + un('V') },
            { label: '直後の電流の増加の割合 ΔI/Δt = E/L', tex: sig(p.E / p.L) + un('A/s') },
            { label: '十分後の電流 I', tex: sig(I) + un('A') },
            { label: 'コイルに蓄えられたエネルギー U', tex: sig(U) + un('J') },
            { label: '時定数 τ = L/R', tex: sig(tau) + un('s') }
          ],
          steps: stepsSelf('rl', p, null),
          fig: stack([figRL(p), graphRL(p.E, p.R, p.L)], 380)
        };
      }
      const p = { L: v.L, I1: v.I1, I2: v.I2, dt: v.dt };
      const s = solveSelf(p);
      if (![s.V, s.U1, s.U2].every(isFinite)) throw new JK.CalcError('値が大きすぎて計算できません。');
      const res = [
        { label: '電流の変化 ΔI', tex: sig(s.dI) + un('A') },
        { label: '電流の変化の割合 ΔI/Δt', tex: sig(s.rate) + un('A/s') },
        { label: '自己誘導起電力の大きさ |V|', tex: sig(Math.abs(s.V)) + un('V') },
        { label: '向き', tex: s.dI > 0 ? R`\text{電流と逆向き（増加を妨げる）}` : (s.dI < 0 ? R`\text{電流と同じ向き（減少を妨げる）}` : R`\text{起電力は生じない}`) },
        { label: '変化前のエネルギー U₁', tex: sig(s.U1) + un('J') },
        { label: '変化後のエネルギー U₂', tex: sig(s.U2) + un('J') }
      ];
      return { result: res, steps: stepsSelf('change', p, s), fig: graphIt(p, s) };
    },
    exercise(rng, level) {
      if (level === 'adv') {
        // L に並列な R2。S を開いた直後の R2 の電圧と、R2 で発生する総ジュール熱
        let E, R1, R2, L;
        for (let k = 0; k < 300; k++) {
          E = rng.pick([6.0, 12, 24]); R1 = rng.pick([2.0, 3.0, 4.0, 6.0]); R2 = rng.pick([10, 20, 30, 50]); L = rng.pick([0.10, 0.20, 0.50, 1.0]);
          if (ok3(E / R1) && ok3(E / R1 * R2) && ok3(0.5 * L * (E / R1) ** 2)) break;
        }
        const I0 = E / R1, V2 = I0 * R2, Q = 0.5 * L * I0 * I0;
        const p = { E: E, R1: R1, R2: R2, L: L };
        const sol = [
          {
            t: 'スイッチを閉じて十分に時間がたったときの電流',
            m: [R`V_{L} = 0 \;\Rightarrow\; \text{コイルは導線とみなせる}`, R`I_{0} = \frac{E}{R_{1}} = \frac{` + nice(E) + '}{' + nice(R1) + '} = ' + sig(I0) + un('A')],
            n: R`十分に時間がたつとコイルの電流は一定になり、$\dfrac{\Delta I}{\Delta t} = 0$ なので自己誘導起電力は $0$ です。コイルは導線と同じで、$R_{2}$ は導線で短絡されて電流が流れません。電池の電圧 $E$ はすべて $R_{1}$ にかかり、$I_{0} = \dfrac{E}{R_{1}}$ がコイルを流れます。`,
            easy: R`電流が落ち着くと、コイルはただの導線になります。電流は抵抗の大きな $R_{2}$ ではなく、導線と同じになったコイルのほうを通ります。だから $R_{2}$ には電流が流れず、電池と $R_{1}$ だけの回路として $I_{0} = \dfrac{E}{R_{1}}$ と求められます。`,
            pro: R`定常状態では「コイル = 導線」。コイルに並列な抵抗は短絡されます。`
          },
          {
            t: 'スイッチを開いた直後の $R_{2}$ の電圧',
            m: [R`I_{L}(\text{直後}) = I_{0} = ` + sig(I0) + un('A'), R`V_{2} = R_{2}I_{0} = ` + nice(R2) + R` \times ` + nice(I0) + ' = ' + sig(V2) + un('V')],
            n: R`コイルの電流は急には変えられないので、スイッチを開いた直後も $I_{0}$ のままです。この電流は、コイルと $R_{2}$ でできた閉回路を流れるしかありません。したがって $R_{2}$ にも $I_{0}$ が流れ、オームの法則から $V_{2} = R_{2}I_{0}$ です。` + (V2 > E ? R`この電圧は電池の電圧 $E$ より大きくなります。` : ''),
            easy: R`コイルは「流れていた電流をそのまま保とう」とします。スイッチを開くと電池からの電流は止まりますが、コイルは直前の電流 $I_{0}$ を流し続けようとし、その電流が $R_{2}$ を通ります。抵抗を電流が通れば電圧が生まれるので、$V = RI$ で計算します。`,
            pro: R`コイルの電流の連続性（直前の値を保つ）がカギです。$R_{2}$ の電圧は電池の電圧を超えることがあります（スイッチ OFF 時の火花の原因）。`
          },
          {
            t: '$R_{2}$ で発生する総ジュール熱',
            m: [R`Q = \frac{1}{2}LI_{0}^{2} = \frac{1}{2} \times ` + nice(L) + R` \times ` + pw2(nice(I0)) + ' = ' + sig(Q) + un('J')],
            n: R`スイッチを開いたあと、コイルに蓄えられていたエネルギー $\dfrac{1}{2}LI_{0}^{2}$ は、すべて $R_{2}$ のジュール熱になります（電流が $0$ になるまで流れ続け、エネルギーが保存されます）。`,
            easy: R`コイルが蓄えていた磁場のエネルギー $\dfrac{1}{2}LI^{2}$ は、電流が流れ切るまでに、少しずつ $R_{2}$ の熱として放出されます。放出される熱の合計は、はじめに蓄えていたエネルギーと等しくなります（エネルギー保存）。`
          }
        ];
        return {
          title: 'スイッチを開いた直後のコイルと抵抗',
          body: R`図のように、起電力 $E = ` + sf(E) + R`\,\mathrm{V}$ の電池、抵抗値 $R_{1} = ` + sf(R1) + R`\,\mathrm{\Omega}$ の抵抗、自己インダクタンス $L = ` + sf(L) + R`\,\mathrm{H}$ のコイル、抵抗値 $R_{2} = ` + sf(R2) + R`\,\mathrm{\Omega}$ の抵抗、スイッチ S を接続する。電池とコイルの内部抵抗は無視できる。S を閉じて十分に時間がたったあと、S を開いた。次の問いに答えよ。`,
          fig: figLR(p),
          parts: [
            numPart('(1)', R`S を閉じて十分に時間がたったとき、コイルを流れる電流 $I_{0}$`, I0, 'A'),
            numPart('(2)', R`S を開いた直後に、$R_{2}$ にかかる電圧 $V_{2}$`, V2, 'V'),
            numPart('(3)', R`S を開いたあと、$R_{2}$ で発生する熱量の合計 $Q$`, Q, 'J')
          ],
          solution: sol
        };
      }
      // basic / mid: 電流の変化とエネルギー
      let L, I1, I2, dt;
      for (let k = 0; k < 300; k++) {
        L = rng.pick([0.10, 0.20, 0.50, 1.0, 2.0]);
        if (level === 'basic') { I1 = 0; I2 = rng.pick([1.0, 2.0, 4.0, 5.0]); }
        else { I1 = rng.pick([2.0, 3.0, 4.0, 5.0, 6.0]); I2 = rng.pick([0, 1.0, 2.0]); if (I2 >= I1) continue; }
        dt = rng.pick([0.010, 0.020, 0.050, 0.10, 0.20, 0.50]);
        const V0 = L * Math.abs(I2 - I1) / dt;
        if (ok3(V0) && ok3(0.5 * L * I1 * I1) && ok3(0.5 * L * I2 * I2)) break;
      }
      const p = { L: L, I1: I1, I2: I2, dt: dt };
      const s = solveSelf(p);
      const parts = [numPart('(1)', R`コイルに生じる自己誘導起電力の大きさ $|V|$`, Math.abs(s.V), 'V')];
      let title, body;
      if (level === 'basic') {
        title = '電流の変化とコイルの起電力';
        body = R`自己インダクタンス $` + sf(L) + R`\,\mathrm{H}$ のコイルに流れる電流を、一定の割合で、$0$ から $` + sf(I2) + R`\,\mathrm{A}$ まで $` + sf(dt) + R`\,\mathrm{s}$ かけて増加させた。次の問いに答えよ。`;
        parts.push(numPart('(2)', R`電流が $` + sf(I2) + R`\,\mathrm{A}$ になったとき、コイルに蓄えられているエネルギー $U$`, s.U2, 'J'));
      } else {
        title = '電流が減少するときの起電力とエネルギー';
        body = R`自己インダクタンス $` + sf(L) + R`\,\mathrm{H}$ のコイルに $` + sf(I1) + R`\,\mathrm{A}$ の電流が流れている。この電流を、一定の割合で $` + sf(I2) + R`\,\mathrm{A}$ まで $` + sf(dt) + R`\,\mathrm{s}$ かけて減少させた。次の問いに答えよ。`;
        parts.push(numPart('(2)', R`電流を変化させる前に、コイルに蓄えられているエネルギー $U_{1}$`, s.U1, 'J'));
        parts.push(numPart('(3)', R`電流を変化させたあとの、コイルに蓄えられているエネルギー $U_{2}$`, s.U2, 'J'));
      }
      // 演習の図: I–t グラフ（V–t は答えが読めるので載せない）
      const dtp = p.dt, x0 = -dtp * 0.6, x1 = dtp * 1.6;
      const fig = JK.plot.graph({
        w: 340, h: 170, x: [x0, x1], y: yRange([I1, I2]),
        segs: polySegs([[x0, I1], [0, I1], [dtp, I2], [x1, I2]], 'c1').filter((q) => Math.abs(q.x2 - q.x1) + Math.abs(q.y2 - q.y1) > 1e-12),
        vlines: [{ x: 0 }, { x: dtp }], axis: ['t [s]', 'I [A]']
      });
      const sol = stepsSelf('change', p, s).slice(0, 4);
      if (level === 'basic') {
        // 設問の記号は U（電流が I₂ になったとき）。変化前のエネルギー U₁ は問われていないので書かない
        sol[3] = Object.assign({}, sol[3], {
          m: [R`U = \frac{1}{2}LI^{2}`, R`U = \frac{1}{2} \times ` + nice(L) + R` \times ` + pw2(nice(I2)) + ' = ' + sig(s.U2) + un('J')],
          n: R`電流が $I_{2} = ` + nice(I2) + R`\,\mathrm{A}$ になったとき、コイルは磁場のかたちでエネルギー $U = \dfrac{1}{2}LI^{2}$ を蓄えています。この $I$ に $I_{2}$ を入れて求めます。`
        });
      }
      return { title: title, body: body, fig: fig, parts: parts, solution: sol };
    }
  });
})();
