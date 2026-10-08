/* GOKAKU NAVI — 物理 問題バンク（難関大レベル）
   物理の単元 p-kin 〜 p-atom の 21 単元を 1 問ずつ。入試やや難（複数単元の融合・文字式の導出・場合分け、4〜5 設問）。
   すべて書き下ろしのオリジナル問題（既存の入試問題・参考書の文面は含まない）。 */
(function () {
  'use strict';
  const R = String.raw;
  const PI = Math.PI;
  const G = JK.plot.graph;
  const D = function (w, h) { return JK.plot.draw(w, h); };
  // 矢印 + 手動配置のラベル（ラベルが矢印に重ならないよう位置を明示する）
  function arr(d, x1, y1, x2, y2, label, cls, lx, ly, anchor) {
    d.arrow(x1, y1, x2, y2, { cls: cls });
    if (label) d.text(lx, ly, label, { cls: cls, anchor: anchor || 'start', italic: true });
  }

  /* ================================================================
   *  各ブロック = 図の定義（関数宣言）+ JK.registerProblems の呼び出し
   * ================================================================ */

  /* ---------- 等加速度運動 ---------- */
  // 運転曲線の模式図: 実線 = D が大きい場合（台形）、破線 = D が小さい場合（三角形）
  function figKin() {
    const a = 2, b = 3, V = 6, tOff = 7;
    const tUp = V / a, tEnd = tOff + V / b;
    const f1 = function (t) { return t <= tUp ? a * t : (t <= tOff ? V : V - b * (t - tOff)); };
    const tp = 2, vp = a * tp, tEnd2 = tp + vp / b;
    const f2 = function (t) { return t <= tp ? a * t : vp - b * (t - tp); };
    return G({
      w: 350, h: 232, x: [0, 10], y: [0, 8], axis: ['t', 'v'], ticks: false, grid: false,
      curves: [
        { f: f2, cls: 'c3', dash: true, domain: [0, tEnd2] },
        { f: f1, cls: 'c1', domain: [0, tEnd] }
      ],
      hlines: [{ y: V, label: '制限速度 V', dash: true }],
      labels: [
        { x: 0.25, y: 4.7, text: '傾き a', cls: 'c1' },
        { x: 8.15, y: 3.0, text: '傾き −b', cls: 'c1' },
        { x: 3.4, y: 4.2, text: '実線: D が大きい場合', cls: 'c1' },
        { x: 3.6, y: 1.5, text: '破線: D が小さい場合', cls: 'c3' }
      ]
    });
  }

  /* ---------- 落体の運動 ---------- */
  // 斜面上の点 O から斜面に対して角 β の向きに投げ出した小球（図は β = 40° の例）
  function figSlope() {
    const d = D(360, 240);
    const al = PI / 6, be = 40 * PI / 180, v0 = 14.7, g = 9.8;
    const Ox = 34, Oy = 208, s = 13.5, ca = Math.cos(al), sa = Math.sin(al);
    const P = function (x, y) { return [Ox + (x * ca - y * sa) * s, Oy - (x * sa + y * ca) * s]; };
    const T = 2 * v0 * Math.sin(be) / (g * ca);
    const top = P(21, 0);
    d.poly([[Ox, Oy], top, [top[0], Oy]], { cls: 'fg', fill: 'f0' });
    let path = '';
    for (let k = 0; k <= 60; k++) {
      const t = T * k / 60;
      const p = P(v0 * Math.cos(be) * t - 0.5 * g * sa * t * t, v0 * Math.sin(be) * t - 0.5 * g * ca * t * t);
      path += (k ? ' L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    }
    d.path(path, { cls: 'c1', dash: true });
    const xP = v0 * Math.cos(be) * T - 0.5 * g * sa * T * T;
    const pp = P(xP, 0);
    d.dot(Ox, Oy, { cls: 'fg', r: 3 });
    d.dot(pp[0], pp[1], { cls: 'c2', r: 3.5 });
    d.text(Ox - 4, Oy + 16, 'O', { size: 13, italic: true });
    d.text(pp[0] + 4, pp[1] + 18, 'P', { size: 13, italic: true, cls: 'c2' });
    // 初速度と角
    const tx = Ox + 64 * Math.cos(al + be), ty = Oy - 64 * Math.sin(al + be);
    d.arrow(Ox, Oy, tx, ty, { cls: 'c3' });
    d.text(tx + 9, ty + 2, 'v₀', { cls: 'c3', anchor: 'start', italic: true, size: 13 });
    d.angle(Ox, Oy, 40, 30, 30 + 40, 'β', { cls: 'c3' });
    d.angle(Ox, Oy, 78, 0, 30, 'α', { cls: 'c2' });
    // 座標軸（斜面に沿って x、斜面に垂直で y）
    const ax = 200, ay = 84;
    d.arrow(ax, ay, ax + 44 * ca, ay - 44 * sa, { cls: 'dim' });
    d.text(ax + 44 * ca + 6, ay - 44 * sa + 4, 'x', { cls: 'dim', anchor: 'start', italic: true });
    d.arrow(ax, ay, ax - 44 * sa, ay - 44 * ca, { cls: 'dim' });
    d.text(ax - 44 * sa - 4, ay - 44 * ca - 4, 'y', { cls: 'dim', anchor: 'end', italic: true });
    d.text(352, 24, '初速度 v₀ = 14.7 m/s', { anchor: 'end', size: 12 });
    d.text(352, 42, '斜面の傾き α = 30°', { anchor: 'end', size: 12 });
    return d.svg();
  }

  JK.registerProblems([

    /* ---------- 等加速度運動 ---------- */
    {
      id: 'p-adv-kin-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-kin',
      title: '駅間の最短時間と運転曲線',
      source: { univ: 'オリジナル' },
      time: 18,
      body: R`ある電車が、まっすぐな線路上の 2 つの駅の間を、停止した状態から出発して、次の駅で停止するまで走る。電車は、加速するときは一定の加速度 $a=0.80\,\mathrm{m/s^{2}}$ で、減速するときは一定の大きさ $b=1.2\,\mathrm{m/s^{2}}$ の加速度で運動する。また、速さは制限速度 $V=24\,\mathrm{m/s}$ をこえてはならない。駅間の距離を $D$ とし、電車は駅間を**できるだけ短い時間**で走るものとする（出発したらすぐに最大の加速度 $a$ で加速し、ちょうど次の駅で止まるように加速度の大きさ $b$ で減速する。速さが $V$ に達したときは、その速さでしばらく走ってから減速する）。図は、運転中の速さ $v$ と時刻 $t$ の関係を、$D$ が大きい場合（実線）と小さい場合（破線）について、模式的に示したものである。`,
      fig: figKin(),
      parts: [
        {
          label: '(1)',
          q: R`$D$ が小さく、速さが $V$ に達しない場合、運転中の最大の速さ $v_{\mathrm{m}}$ を $a,\ b,\ D$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\sqrt{2aD}$`,
            R`$\sqrt{\dfrac{abD}{a+b}}$`,
            R`$\sqrt{\dfrac{2abD}{a+b}}$`,
            R`$\sqrt{\dfrac{2(a+b)D}{ab}}$`,
            R`$\sqrt{(a+b)D}$`
          ],
          answer: 2
        },
        { label: '(2)', q: R`速さが $V$ に達するためには、$D$ はいくら以上でなければならないか。その最小の値 $D_{\mathrm{c}}$ を求めよ。`, type: 'num', answer: 600, rel: 0.02, unit: 'm' },
        { label: '(3)', q: R`$D=150\,\mathrm{m}$ のとき、出発してから次の駅に着くまでの時間を求めよ。`, type: 'num', answer: 25, rel: 0.02, unit: 's' },
        {
          label: '(4)',
          q: R`$D\ge D_{\mathrm{c}}$ のとき、駅間の所要時間 $T$ を $D,\ V,\ a,\ b$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{D}{V}$`,
            R`$\dfrac{D}{V}+\dfrac{V(a+b)}{2ab}$`,
            R`$\dfrac{D}{V}+\dfrac{V}{a}+\dfrac{V}{b}$`,
            R`$\dfrac{D}{V}+\dfrac{V}{2a}$`,
            R`$\dfrac{D}{V}-\dfrac{V(a+b)}{2ab}$`
          ],
          answer: 1
        },
        { label: '(5)', q: R`$D\ge D_{\mathrm{c}}$ の駅間で、平均の速さ（$D$ を所要時間で割った値）が $V$ の $0.80$ 倍となるのは、$D$ が何 $\mathrm{m}$ のときか。`, type: 'num', answer: 2400, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: '運転曲線を $v$-$t$ グラフで考える',
          n: R`$v$-$t$ グラフでは、**傾きが加速度**、**グラフと $t$ 軸ではさまれた面積が進んだ距離**を表します。最短時間で走るには、出発直後から加速度 $a$ で加速し、ちょうど止まるように加速度の大きさ $b$ で減速します。速さが $V$ に達する場合は、その間に速さ $V$ の等速区間が入り、グラフは台形になります。$V$ に達しない場合は三角形です。`,
          easy: R`電車を「できるだけ早く着かせる」には、出発したらアクセルを全開（加速度 $a$）にし、止まる直前までブレーキを我慢して、最後に全力（加速度の大きさ $b$）でブレーキをかけるのが最短です。ただし速さの上限 $V$ があるので、$V$ に着いたらそこで速さを保ちます。この様子を $v$-$t$ グラフにかくと、坂を上って、平らな道を走って、坂を下りる「台形」になります。距離が短いと、$V$ に着く前にブレーキを始めるので「三角形」になります。`,
          lv: 1
        },
        {
          t: '加速・減速で進む距離',
          m: R`x_{1} = \frac{v^{2}}{2a}\ (\text{加速}),\qquad x_{2} = \frac{v^{2}}{2b}\ (\text{減速})`,
          n: R`速さ $0$ から $v$ まで加速するとき $v^{2}-0=2a\,x_{1}$、速さ $v$ から $0$ まで減速するとき $0-v^{2}=-2b\,x_{2}$ が成り立ちます（等加速度運動の式 $v^{2}-v_{0}^{2}=2ax$）。`,
          easy: R`「時間を使わずに距離だけ出したい」ときは、$v^{2}-v_{0}^{2}=2ax$ が便利です。加速のときは $v_{0}=0$、減速のときは最後の速さが $0$ なので、どちらも $x=\dfrac{v^{2}}{2a}$ や $\dfrac{v^{2}}{2b}$ の形になります。`,
          pro: R`距離の式は $v^{2}=2ax$ をそのまま使う。三角形・台形の面積で求めても同じ。`,
          lv: 1
        },
        {
          t: '$V$ に達しない場合（(1)(3)）',
          m: [R`D = \frac{v_{\mathrm{m}}^{2}}{2a} + \frac{v_{\mathrm{m}}^{2}}{2b} = \frac{(a+b)\,v_{\mathrm{m}}^{2}}{2ab}`,
              R`v_{\mathrm{m}} = \sqrt{\frac{2abD}{a+b}}`],
          n: R`$D$ は、加速で進む距離と減速で進む距離の和です。これを $v_{\mathrm{m}}$ について解きます。$D=150\,\mathrm{m}$ のとき、$v_{\mathrm{m}}=\sqrt{\dfrac{2\times 0.80\times 1.2\times 150}{0.80+1.2}}=\sqrt{144}=12\,\mathrm{m/s}$ で、$V=24\,\mathrm{m/s}$ より小さいので、この場合に当てはまります。`,
          lv: 1
        },
        {
          t: R`所要時間（$D=150\,\mathrm{m}$）`,
          m: R`T = \frac{v_{\mathrm{m}}}{a} + \frac{v_{\mathrm{m}}}{b} = \frac{12}{0.80} + \frac{12}{1.2} = 15 + 10 = 25\,\mathrm{s}`,
          n: R`加速に $\dfrac{v_{\mathrm{m}}}{a}=15\,\mathrm{s}$、減速に $\dfrac{v_{\mathrm{m}}}{b}=10\,\mathrm{s}$ かかります。`,
          lv: 2
        },
        {
          t: '$V$ に達するための最小の距離（(2)）',
          m: R`D_{\mathrm{c}} = \frac{V^{2}}{2a} + \frac{V^{2}}{2b} = \frac{(a+b)V^{2}}{2ab} = \frac{576}{1.6} + \frac{576}{2.4} = 360 + 240 = 600\,\mathrm{m}`,
          n: R`$v_{\mathrm{m}}=V$ となる境目が $D_{\mathrm{c}}$ です。加速だけで $360\,\mathrm{m}$、減速だけで $240\,\mathrm{m}$ 進むので、合計 $600\,\mathrm{m}$ より長い駅間であれば等速区間ができます。`,
          lv: 1
        },
        {
          t: R`$D\ge D_{\mathrm{c}}$ の所要時間（(4)）`,
          m: [R`t_{\text{加速}} = \frac{V}{a},\quad t_{\text{減速}} = \frac{V}{b},\quad t_{\text{等速}} = \frac{D - \dfrac{V^{2}}{2a} - \dfrac{V^{2}}{2b}}{V}`,
              R`T = \frac{V}{a} + \frac{V}{b} + \frac{D}{V} - \frac{V}{2a} - \frac{V}{2b} = \frac{D}{V} + \frac{V(a+b)}{2ab}`],
          n: R`等速区間の距離は、$D$ から加速・減速で進む距離を引いたものです。これを速さ $V$ で割れば等速区間の時間になります。整理すると、$\dfrac{D}{V}$（ずっと速さ $V$ で走ったときの時間）に、加速・減速で余分にかかる時間 $\dfrac{V(a+b)}{2ab}$ を加えた形になります。`,
          easy: R`台形の面積が距離 $D$ です。「上底 × 高さ」ではなく「（上底 + 下底）÷ 2 × 高さ」で考えると、$D=V\times\left(T-\dfrac{V}{2a}-\dfrac{V}{2b}\right)$ となり、そこから同じ式が出てきます。式の意味は「全部 $V$ で走ったと考えた時間 $\dfrac{D}{V}$ に、加速とブレーキで遅れた時間を足す」です。`,
          pro: R`$\dfrac{V(a+b)}{2ab}=\dfrac{V}{2a}+\dfrac{V}{2b}$ は、加減速による「遅れ」。台形の面積公式 $D=\dfrac{(T+t_{\text{等速}})V}{2}$ からも出せる。`,
          lv: 1
        },
        {
          t: '平均の速さの条件（(5)）',
          m: [R`\frac{D}{T} = 0.80\,V \;\Longrightarrow\; T = \frac{D}{0.80\,V} = 1.25\,\frac{D}{V}`,
              R`\frac{D}{V} + \frac{V(a+b)}{2ab} = 1.25\,\frac{D}{V} \;\Longrightarrow\; D = 4\times\frac{(a+b)V^{2}}{2ab} = 4D_{\mathrm{c}} = 2400\,\mathrm{m}`],
          n: R`$\dfrac{V(a+b)}{2ab}=\dfrac{24\times 2.0}{1.92}=25\,\mathrm{s}$ なので、$T=\dfrac{2400}{24}+25=125\,\mathrm{s}$、平均の速さは $\dfrac{2400}{125}=19.2=0.80\times 24\,\mathrm{m/s}$ となり確かめられます。`,
          lv: 1
        },
        {
          t: '場合分けのまとめと境目での確認',
          m: R`T = \begin{cases} \sqrt{\dfrac{2(a+b)D}{ab}} & (D < D_{\mathrm{c}}) \\[2mm] \dfrac{D}{V} + \dfrac{V(a+b)}{2ab} & (D \ge D_{\mathrm{c}}) \end{cases}`,
          n: R`$D<D_{\mathrm{c}}$ では $T=\dfrac{v_{\mathrm{m}}}{a}+\dfrac{v_{\mathrm{m}}}{b}=v_{\mathrm{m}}\,\dfrac{a+b}{ab}$ に $v_{\mathrm{m}}$ を代入して得られます。境目 $D=D_{\mathrm{c}}=600\,\mathrm{m}$ では、上の式は $\sqrt{\dfrac{2\times 2.0\times 600}{0.96}}=50\,\mathrm{s}$、下の式は $\dfrac{600}{24}+25=50\,\mathrm{s}$ で一致します。$D$ が $D_{\mathrm{c}}$ をまたいでも所要時間はなめらかにつながります。`,
          lv: 2
        }
      ],
      prereq: ['p-kin', 'p-math0'],
      tags: ['v-tグラフ', '場合分け', '最短時間']
    },

    /* ---------- 落体の運動 ---------- */
    {
      id: 'p-adv-fall-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-fall',
      title: '斜面への斜方投射',
      source: { univ: 'オリジナル' },
      time: 20,
      body: R`傾き $\alpha=30\degree$ の一様な斜面上の点 O から、斜面を含む鉛直面内で、斜面の上向きの方向と角 $\beta$ をなす向きに、小球を初速度 $v_{0}=14.7\,\mathrm{m/s}$ で投げ出した（図は $\beta=40\degree$ の例）。小球は斜面上の点 P に落ちた。空気の抵抗は無視でき、重力加速度の大きさを $g=9.8\,\mathrm{m/s^{2}}$、$\sqrt{3}=1.73$ とする。以下では、斜面に沿って上向きを $x$ 軸の正の向き、斜面に垂直で斜面から離れる向きを $y$ 軸の正の向きとして、運動を $x$ 方向と $y$ 方向に分けて考える。`,
      fig: figSlope(),
      parts: [
        {
          label: '(1)',
          q: R`投げ出してから P に落ちるまでの時間 $T$ を $v_{0},\ g,\ \alpha,\ \beta$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{2v_{0}\sin\beta}{g}$`,
            R`$\dfrac{2v_{0}\sin(\alpha+\beta)}{g}$`,
            R`$\dfrac{2v_{0}\sin\beta}{g\cos\alpha}$`,
            R`$\dfrac{v_{0}\sin\beta}{g\cos\alpha}$`,
            R`$\dfrac{2v_{0}\cos\beta}{g\sin\alpha}$`,
            R`$\dfrac{2v_{0}\sin\beta}{g\sin\alpha}$`
          ],
          answer: 2
        },
        { label: '(2)', q: R`小球を斜面に垂直（$\beta=90\degree$）に投げ出したとき、落下するまでの時間は何 $\mathrm{s}$ か。`, type: 'num', answer: 3.46, rel: 0.02, unit: 's', show: R`2\sqrt{3}` },
        { label: '(3)', q: R`(2) のとき、P は O から斜面に沿って下向きに何 $\mathrm{m}$ の位置にあるか。`, type: 'num', answer: 29.4, rel: 0.02, unit: 'm' },
        {
          label: '(4)',
          q: R`一般の $\beta$ について、P の $x$ 座標 $x_{\mathrm{P}}$（O から斜面に沿って上向きを正とする）を $v_{0},\ g,\ \alpha,\ \beta$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{2v_{0}^{2}\sin\beta\cos\beta}{g\cos\alpha}$`,
            R`$\dfrac{2v_{0}^{2}\sin\beta\sin(\alpha+\beta)}{g\cos^{2}\alpha}$`,
            R`$\dfrac{2v_{0}^{2}\sin\beta\cos(\alpha+\beta)}{g\cos\alpha}$`,
            R`$\dfrac{2v_{0}^{2}\sin\beta\cos(\alpha+\beta)}{g\cos^{2}\alpha}$`,
            R`$\dfrac{2v_{0}^{2}\sin\beta\cos(\beta-\alpha)}{g\cos^{2}\alpha}$`
          ],
          answer: 3
        },
        { label: '(5)', q: R`$\beta$ を $0\degree$ から $90\degree$ の範囲で変えるとき、P が O から斜面に沿って上向きに最も遠くなる場合の距離 $x_{\mathrm{P}}$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 14.7, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: '座標軸を斜面に合わせ、重力を 2 方向に分ける',
          m: R`a_{x} = -g\sin\alpha,\qquad a_{y} = -g\cos\alpha`,
          n: R`重力 $mg$ を、斜面に沿った成分 $mg\sin\alpha$（下向き）と、斜面に垂直な成分 $mg\cos\alpha$（斜面に向かう向き）に分けます。小球にはたらく力は重力だけなので、$x$ 方向・$y$ 方向とも一定の加速度の運動（等加速度運動）です。`,
          easy: R`斜面の上の物体を考えるときと同じ考え方です。重力（鉛直下向き）を「斜面に沿う向き」と「斜面に垂直な向き」の 2 つに分けると、小球の運動は 2 つの方向それぞれが、一定の加速度の運動になります。斜面に垂直な方向では、加速度が斜面に向かって $g\cos\alpha$ なので、投げ上げ → 落下をする「鉛直投げ上げ」と同じ形になります。`,
          lv: 1
        },
        {
          t: '初速度を成分に分ける',
          m: R`v_{0x} = v_{0}\cos\beta,\qquad v_{0y} = v_{0}\sin\beta`,
          n: R`初速度の向きは、斜面（$x$ 軸）から角 $\beta$ ですから、$x$ 成分が $v_{0}\cos\beta$、$y$ 成分が $v_{0}\sin\beta$ です。`,
          lv: 2
        },
        {
          t: '位置を時刻の式で表す',
          m: [R`x = v_{0}\cos\beta\;t - \frac{1}{2}g\sin\alpha\;t^{2}`,
              R`y = v_{0}\sin\beta\;t - \frac{1}{2}g\cos\alpha\;t^{2}`],
          n: R`$t=0$ で O（原点）、$x$ 方向・$y$ 方向それぞれに等加速度運動の式 $s=v_{0}t+\dfrac{1}{2}at^{2}$ を使います。`,
          lv: 1
        },
        {
          t: '落ちるまでの時間（(1)(2)）',
          m: [R`y = 0 \;\Longrightarrow\; t\left(v_{0}\sin\beta - \frac{1}{2}g\cos\alpha\;t\right) = 0`,
              R`T = \frac{2v_{0}\sin\beta}{g\cos\alpha}`,
              R`\beta=90\degree:\quad T = \frac{2\times 14.7}{9.8\times\dfrac{\sqrt{3}}{2}} = \frac{6}{\sqrt{3}} = 2\sqrt{3} \approx 3.46\,\mathrm{s}`],
          n: R`P は斜面上の点、つまり $y=0$ の点です。$t=0$ は投げ出した瞬間なので、もう一つの解が $T$ です。$y$ 方向の運動だけで決まる時間であることに注意しましょう（$x$ 方向の速さは関係しません）。`,
          easy: R`斜面に垂直な方向だけを見ると、斜面から離れて、また斜面に戻ってくるまでの時間です。上がって降りる時間は「上向きの初速度 ÷ 加速度の大きさ」の 2 倍なので、$2\times\dfrac{v_{0}\sin\beta}{g\cos\alpha}$ となります。`,
          pro: R`$y$ 方向の加速度が $g\cos\alpha$ であることがすべて。水平面に投げる場合の $\dfrac{2v_{0}\sin\theta}{g}$ と見比べておく。`,
          lv: 1
        },
        {
          t: 'P の位置（(3)(4)）',
          m: [R`\begin{aligned} x_{\mathrm{P}} &= v_{0}\cos\beta\;T - \frac{1}{2}g\sin\alpha\;T^{2} \\ &= \frac{2v_{0}^{2}\sin\beta}{g\cos^{2}\alpha}\left(\cos\beta\cos\alpha - \sin\beta\sin\alpha\right) = \frac{2v_{0}^{2}\sin\beta\cos(\alpha+\beta)}{g\cos^{2}\alpha} \end{aligned}`,
              R`\beta = 90\degree:\quad x_{\mathrm{P}} = -\frac{1}{2}\times 9.8\times\frac{1}{2}\times(2\sqrt{3})^{2} = -29.4\,\mathrm{m}`],
          n: R`$x_{\mathrm{P}}$ に $T$ を代入し、$\dfrac{2v_{0}^{2}\sin\beta}{g\cos^{2}\alpha}$ でくくると、加法定理 $\cos(\alpha+\beta)=\cos\alpha\cos\beta-\sin\alpha\sin\beta$ が使えます。$\beta=90\degree$ では $v_{0}\cos\beta=0$ なので、$x$ 方向は初速度 $0$ で加速度 $-g\sin\alpha$（斜面の下向き）の運動になり、$x_{\mathrm{P}}=-29.4\,\mathrm{m}$、つまり O から斜面の下向きに $29.4\,\mathrm{m}$ の点に落ちます。`,
          easy: R`斜面に垂直に投げると、$x$ 方向（斜面に沿う方向）の初速度は $0$ です。その間にも重力の斜面方向の成分 $g\sin\alpha$ が小球を斜面の下向きに引っ張り続けるので、小球は O より下に落ちます。`,
          lv: 1
        },
        {
          t: '最も遠くへ落とす角（(5)）',
          m: [R`2\sin\beta\cos(\alpha+\beta) = \sin(2\beta+\alpha) - \sin\alpha`,
              R`x_{\mathrm{P}} = \frac{v_{0}^{2}\left\{\sin(2\beta+\alpha)-\sin\alpha\right\}}{g\cos^{2}\alpha}`,
              R`2\beta+\alpha = 90\degree\;\Rightarrow\;\beta=30\degree,\qquad x_{\max} = \frac{v_{0}^{2}(1-\sin\alpha)}{g\cos^{2}\alpha} = \frac{v_{0}^{2}}{g(1+\sin\alpha)}`],
          n: R`積を和に直す公式 $2\sin A\cos B=\sin(A+B)+\sin(A-B)$ を使うと、$\beta$ を含む部分が $\sin(2\beta+\alpha)$ だけになります。$\sin(2\beta+\alpha)=1$ となるとき最大で、$\alpha=30\degree$ なら $\beta=30\degree$（初速度の向きが、斜面の向きと鉛直上向きのちょうど真ん中）です。最後の変形には $\cos^{2}\alpha=(1-\sin\alpha)(1+\sin\alpha)$ を使いました。数値は $x_{\max}=\dfrac{14.7^{2}}{9.8\times 1.5}=14.7\,\mathrm{m}$ です。`,
          pro: R`「斜面上の最大到達距離は $\dfrac{v_{0}^{2}}{g(1+\sin\alpha)}$」。斜面が水平なら $\dfrac{v_{0}^{2}}{g}$ に一致する。三角関数の積和公式で、角度のところだけを残すのが定石。`,
          lv: 1
        }
      ],
      prereq: ['p-fall', 'p-kin', 'p-force0'],
      tags: ['斜方投射', '斜面', '三角関数の合成']
    }

  ]);

  /* ---------- 剛体 ---------- */
  // 段差の角 P に接する円柱（外力 F は水平、図は F の向きを水平にした場合）
  function figStepCyl() {
    const d = D(360, 240);
    const s = 180, r = 0.50 * s, h = 0.20 * s;
    const fy = 204, px = 214, py = fy - h;
    const cx = px - 0.40 * s, cy = fy - r;
    d.hatch(14, fy, px, fy);
    d.poly([[px, fy], [px, py], [346, py], [346, fy]], { cls: 'fg', fill: 'f0' });
    d.hatch(px, fy, 346, fy);
    d.circle(cx, cy, r, { cls: 'fg', fill: 'f1' });
    d.line(px, py, cx, cy, { cls: 'dim', dash: true, w: 1 });
    d.text((px + cx) / 2 + 6, (py + cy) / 2 + 12, 'r', { size: 13, italic: true, anchor: 'start' });
    d.dot(cx, cy, { cls: 'fg', r: 3 });
    d.dot(px, py, { cls: 'c2', r: 3.5 });
    d.text(cx - 12, cy - 8, 'C', { size: 13, italic: true });
    d.text(px + 8, py - 8, 'P', { size: 13, italic: true, anchor: 'start' });
    arr(d, cx, cy, cx + 62, cy, 'F', 'c3', cx + 70, cy - 7);
    arr(d, cx, cy, cx, cy + 62, 'mg', 'c4', cx + 7, cy + 66);
    d.line(300, py, 300, fy, { cls: 'dim', w: 1 });
    d.line(295, py, 305, py, { cls: 'dim', w: 1 });
    d.line(295, fy, 305, fy, { cls: 'dim', w: 1 });
    d.text(293, (py + fy) / 2 + 4, 'h = 0.20 m', { anchor: 'end' });
    d.text(352, 24, '半径 r = 0.50 m', { anchor: 'end' });
    d.text(352, 42, '質量 m = 20 kg', { anchor: 'end' });
    return d.svg();
  }

  /* ---------- 運動方程式 ---------- */
  // 定滑車の一方に A、他方に動滑車 P（B と C をつるす）
  function figMovPulley() {
    const d = D(360, 246);
    const cx = 120, cy = 54, rr = 34;
    const xl = cx - rr, xr = cx + rr;
    const px = xr, py = 120, pr = 20;
    const xB = px - pr, xC = px + pr;
    d.hatch(40, 12, 220, 12, { side: -1 });
    d.line(cx, 12, cx, cy, { cls: 'fg', w: 1.5 });
    d.circle(cx, cy, rr, { cls: 'fg', fill: 'f0' });
    d.dot(cx, cy, { cls: 'fg', r: 2.5 });
    d.text(xr + 10, 34, '定滑車', { anchor: 'start' });
    // A
    d.line(xl, cy, xl, 172, { cls: 'fg', w: 1.4 });
    d.rect(xl - 22, 172, 44, 40, { cls: 'c1', fill: 'f1', rx: 3 });
    d.text(xl, 197, 'A', { size: 14, italic: true });
    d.text(xl, 228, 'M', { italic: true });
    // 動滑車 P
    d.line(px, cy, px, py, { cls: 'fg', w: 1.4 });
    d.circle(px, py, pr, { cls: 'fg', fill: 'f0' });
    d.dot(px, py, { cls: 'fg', r: 2.5 });
    d.text(px + pr + 30, py + 4, '動滑車 P（質量 0）', { anchor: 'start' });
    // B, C
    d.line(xB, py, xB, 176, { cls: 'fg', w: 1.4 });
    d.rect(xB - 13, 176, 26, 28, { cls: 'c2', fill: 'f2', rx: 3 });
    d.text(xB, 195, 'B', { size: 14, italic: true });
    d.text(xB, 220, 'm₁', { italic: true });
    d.line(xC, py, xC, 184, { cls: 'fg', w: 1.4 });
    d.rect(xC - 17, 184, 34, 40, { cls: 'c3', fill: 'f3', rx: 3 });
    d.text(xC, 208, 'C', { size: 14, italic: true });
    d.text(xC, 240, 'm₂', { italic: true });
    // 正の向き
    d.arrow(330, 156, 330, 206, { cls: 'dim' });
    d.text(330, 148, '正の向き', { anchor: 'middle', cls: 'dim' });
    return d.svg();
  }

  JK.registerProblems([

    /* ---------- 剛体 ---------- */
    {
      id: 'p-adv-rigid-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-rigid',
      title: '段差を乗り越える円柱',
      source: { univ: 'オリジナル' },
      time: 20,
      body: R`水平な床の上に、半径 $r=0.50\,\mathrm{m}$、質量 $m=20\,\mathrm{kg}$ の一様な円柱が置かれている。円柱は、高さ $h=0.20\,\mathrm{m}$ の段差の角 P に接している（図）。この円柱の中心 C に外力 $F$ を加えて、$F$ を $0$ から少しずつ大きくし、円柱を段差の上に引き上げたい。円柱は角 P ですべらず、円柱の中心軸は紙面に垂直である。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figStepCyl(),
      parts: [
        {
          label: '(1)',
          q: R`外力 $F$ を水平向き（図の向き）にはたらかせたとき、円柱が床から離れる瞬間の $F$ を $m,\ g,\ r,\ h$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$mg\,\dfrac{\sqrt{2rh-h^{2}}}{r-h}$`,
            R`$mg\,\dfrac{r-h}{\sqrt{2rh-h^{2}}}$`,
            R`$mg\,\dfrac{h}{r-h}$`,
            R`$mg\,\dfrac{\sqrt{2rh-h^{2}}}{r}$`,
            R`$mg\,\dfrac{\sqrt{2rh-h^{2}}}{h}$`
          ],
          answer: 0
        },
        { label: '(2)', q: R`(1) の $F$ の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 261, rel: 0.02, unit: 'N' },
        { label: '(3)', q: R`円柱が床から離れる瞬間に、円柱が角 P から受ける力の大きさは何 $\mathrm{N}$ か。`, type: 'num', answer: 327, rel: 0.02, unit: 'N' },
        { label: '(4)', q: R`$F$ の向きを自由に選べるとき、円柱を床から離すために必要な $F$ の最小値は何 $\mathrm{N}$ か。`, type: 'num', answer: 157, rel: 0.02, unit: 'N' },
        { label: '(5)', q: R`(4) のとき、$F$ の向きは、水平から段差の側へ向かって上向きに何度傾いているか。`, type: 'num', answer: 53, rel: 0.02, unit: '度', hint: R`整数で答える` }
      ],
      solution: [
        {
          t: '床から離れる瞬間の力を整理する',
          n: R`$F$ が小さいうちは、円柱は床と角 P の両方で支えられています。$F$ を大きくしていくと床から受ける垂直抗力が小さくなり、$0$ になった瞬間が「離れる瞬間」です。この瞬間、円柱が受ける力は、中心 C にはたらく外力 $F$、重力 $mg$（C にはたらく）、角 P から受ける力 $\vec{R}$ の 3 つだけです。`,
          easy: R`床から離れる瞬間は、床が円柱を押す力がちょうど $0$ になります。このとき円柱は、角 P という「1 点」だけで支えられて、その点を中心にくるりと回りはじめようとしています。そこで、考える力を「外力 $F$」「重力 $mg$」「角 P からの力」の 3 つだけに絞ります。`,
          lv: 1
        },
        {
          t: '3 力のつり合いから、P からの力の向きと長さの関係',
          m: [R`\overline{\mathrm{PC}} = r,\qquad \text{C の P からの水平距離}\ \sqrt{r^{2}-(r-h)^{2}} = \sqrt{2rh-h^{2}} = 0.40\,\mathrm{m}`,
              R`\text{C の P からの鉛直距離}\ r-h = 0.30\,\mathrm{m}`],
          n: R`$F$ と $mg$ は、どちらも C を通る力です。大きさのある物体にはたらく 3 つの力がつり合うとき、3 つの力の作用線は 1 点で交わります。したがって $\vec{R}$ の作用線も C を通り、$\vec{R}$ は PC の向き（円柱の半径の向き）です。C は P から水平に $0.40\,\mathrm{m}$、鉛直上方に $r-h=0.30\,\mathrm{m}$ にあり、3 辺の比が $3:4:5$ の直角三角形（斜辺が $r=0.50\,\mathrm{m}$）になっています。`,
          easy: R`3 つの力でつり合っている物体では、3 本の力の矢印をのばした直線が必ず 1 点で交わります。$F$ と $mg$ は C で交わるので、残りの力（角 P からの力）の直線も C を通ります。つまり、角 P からの力は、P から C に向かう向きです。`,
          lv: 1
        },
        {
          t: 'P のまわりの力のモーメントのつり合い（(1)(2)）',
          m: [R`F\times(r-h) = mg\times\sqrt{2rh-h^{2}}`,
              R`F = mg\,\frac{\sqrt{2rh-h^{2}}}{r-h} = 20\times 9.8\times\frac{0.40}{0.30} \approx 261\,\mathrm{N}`],
          n: R`$\vec{R}$ の作用線は P を通るので、P のまわりのモーメントはありません。そこで P を回転軸にとります。$F$ は水平なので、P からその作用線までの距離（腕の長さ）は C の鉛直距離 $r-h$、$mg$ は鉛直なので腕の長さは C の水平距離 $\sqrt{2rh-h^{2}}$ です。$F$ は円柱を段差の側へ（時計回りに）、$mg$ は反対向きに回そうとして、2 つがつり合います。`,
          easy: R`**力のモーメント**は「力 × 腕の長さ」です。腕の長さは、軸から力の矢印をのばした直線までの**垂直な距離**です。軸を P にとると、角 P からの力のモーメントが $0$ になるので、$F$ と $mg$ のモーメントだけを書けばよくなります。`,
          pro: R`軸は「未知の力が通る点」に取る。ここでは P。腕の長さは、力の作用線までの垂直距離（水平な $F$ なら鉛直距離）。`,
          lv: 1
        },
        {
          t: '角 P から受ける力の大きさ（(3)）',
          m: R`R = \sqrt{F^{2}+(mg)^{2}} = mg\sqrt{\left(\frac{4}{3}\right)^{2}+1} = \frac{5}{3}\,mg \approx 327\,\mathrm{N}`,
          n: R`3 力がつり合うので、$\vec{R}$ は $F$ と $mg$ の合力を打ち消します。$F=\dfrac{4}{3}mg$ なので、$R=\dfrac{5}{3}mg$ です（$mg=196\,\mathrm{N}$）。向きも確かめると、$\vec{R}$ は水平成分 $F$、鉛直成分 $mg$ で、その比は $\dfrac{mg}{F}=\dfrac{3}{4}=\dfrac{r-h}{\sqrt{2rh-h^{2}}}$ となり、PC の向きと一致します。`,
          lv: 2
        },
        {
          t: '力の向きを自由に選ぶ（(4)）',
          m: [R`F\times d = mg\times\sqrt{2rh-h^{2}}\qquad (d\ \text{は P から}\ F\ \text{の作用線までの距離})`,
              R`d \le \overline{\mathrm{PC}} = r\ \Longrightarrow\ F \ge \frac{mg\sqrt{2rh-h^{2}}}{r},\qquad F_{\min} = 20\times 9.8\times\frac{0.40}{0.50} = 156.8\,\mathrm{N}`],
          n: R`P のまわりのモーメントのつり合いは、一般の向きでも「$F\times$（P から $F$ の作用線までの距離 $d$）$=mg\times 0.40\,\mathrm{m}$」です。$F$ の作用線は C を通るので、$d$ は $\overline{\mathrm{PC}}=r$ より大きくなれません。$d$ が最大の $r$ になる向き（$F$ が PC に垂直）のとき、$F$ は最小になります。`,
          easy: R`同じ「回す効果」を出すなら、腕を長くとったほうが小さい力で済みます（ドアの取っ手を、ちょうつがいから遠いところで押すのと同じです）。軸 P から力のはたらく点 C までの長さは $r$ なので、P と C を結ぶ線に**垂直な向き**に力を加えれば、腕がいちばん長く（$d=r$）なります。`,
          pro: R`「最小の力は、軸と作用点を結ぶ線に垂直」は定石。水平な力 $\dfrac{4}{3}mg=261\,\mathrm{N}$ に対して、向きを選べば $0.8\,mg=157\,\mathrm{N}$ で済む。`,
          lv: 1
        },
        {
          t: '最小の力の向き（(5)）',
          m: [R`\tan\varphi = \frac{r-h}{\sqrt{2rh-h^{2}}} = \frac{0.30}{0.40} = \frac{3}{4}\quad(\varphi\approx 37\degree)`,
              R`\text{F の水平からの角} = 90\degree - \varphi \approx 53\degree`],
          n: R`PC は水平から角 $\varphi$（$\tan\varphi=\dfrac{3}{4}$）だけ傾いています。$F$ は PC に垂直なので、水平から測った角は $90\degree-\varphi\approx 53\degree$、つまり「段差の側へ向かって斜め上」へ引くことになります。そのとき角 P からの力は、$\vec{R}=-(\vec{F}+m\vec{g})$ の大きさ $mg\times\dfrac{3}{5}=117.6\,\mathrm{N}$ で、向きは PC に沿います。`,
          lv: 1
        },
        {
          t: '極限での確認',
          n: R`(1) の式で、$h\to 0$（段差がほとんどない）とすると $\sqrt{2rh-h^{2}}\to 0$ なので $F\to 0$、$h\to r$（段差が半径と同じ高さ）とすると $r-h\to 0$ なので $F\to\infty$ です。$h\ge r$ の段差は、水平な力では越えられないことを表しており、物理的にも自然です。`,
          lv: 3
        }
      ],
      prereq: ['p-rigid', 'p-force0'],
      tags: ['力のモーメント', '3力のつり合い', '最小の力']
    },

    /* ---------- 運動方程式 ---------- */
    {
      id: 'p-adv-eom-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-eom',
      title: '動滑車をふくむ 3 物体の運動',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`図のように、天井に固定した定滑車に軽い糸をかけ、糸の一端に質量 $M$ の物体 A をつけ、他端には質量の無視できる動滑車 P をつるす。動滑車 P には別の軽い糸をかけ、その両端に質量 $m_{1}$ の物体 B と質量 $m_{2}$ の物体 C をつける（$m_{1}<m_{2}$）。滑車はなめらかに回り、糸は伸び縮みせず、質量は無視できる。重力加速度の大きさを $g$ とする。手を放すと、A, B, C は鉛直方向に運動をはじめた。以下では、**鉛直下向きを正**として加速度や張力を考える。A, B, C の加速度を $a_{\mathrm{A}},\ a_{\mathrm{B}},\ a_{\mathrm{C}}$、P の加速度を $a_{\mathrm{P}}$ とする。`,
      fig: figMovPulley(),
      parts: [
        {
          label: '(1)',
          q: R`A をつなぐ糸の張力 $T$ を、$m_{1},\ m_{2},\ g,\ a_{\mathrm{P}}$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$(m_{1}+m_{2})(g-a_{\mathrm{P}})$`,
            R`$\dfrac{4m_{1}m_{2}}{m_{1}+m_{2}}\,(g+a_{\mathrm{P}})$`,
            R`$\dfrac{m_{1}m_{2}}{m_{1}+m_{2}}\,(g-a_{\mathrm{P}})$`,
            R`$\dfrac{2m_{1}m_{2}}{m_{1}+m_{2}}\,(g-a_{\mathrm{P}})$`,
            R`$\dfrac{4m_{1}m_{2}}{m_{1}+m_{2}}\,(g-a_{\mathrm{P}})$`
          ],
          answer: 4
        },
        {
          label: '(2)',
          q: R`A の加速度 $a_{\mathrm{A}}$ を $M,\ m_{1},\ m_{2},\ g$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{M-(m_{1}+m_{2})}{M+(m_{1}+m_{2})}\,g$`,
            R`$\dfrac{4m_{1}m_{2}-M(m_{1}+m_{2})}{M(m_{1}+m_{2})+4m_{1}m_{2}}\,g$`,
            R`$\dfrac{M(m_{1}+m_{2})-2m_{1}m_{2}}{M(m_{1}+m_{2})+2m_{1}m_{2}}\,g$`,
            R`$\dfrac{M(m_{1}+m_{2})-4m_{1}m_{2}}{M(m_{1}+m_{2})+4m_{1}m_{2}}\,g$`,
            R`$\dfrac{M(m_{1}+m_{2})-4m_{1}m_{2}}{M(m_{1}+m_{2})}\,g$`
          ],
          answer: 3
        },
        { label: '(3)', q: R`$M=4.0\,\mathrm{kg},\ m_{1}=2.0\,\mathrm{kg},\ m_{2}=6.0\,\mathrm{kg}$ のとき、A の加速度（**鉛直上向きを正**とする）は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 1.96, rel: 0.02, unit: 'm/s²' },
        { label: '(4)', q: R`(3) のとき、C の加速度（鉛直下向きを正とする）は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 5.88, rel: 0.02, unit: 'm/s²' },
        { label: '(5)', q: R`$m_{1}=2.0\,\mathrm{kg},\ m_{2}=6.0\,\mathrm{kg}$ のまま、A の質量 $M$ をいくらにすると、手を放した後も A は静止し続けるか。`, type: 'num', answer: 6, rel: 0.02, unit: 'kg' }
      ],
      solution: [
        {
          t: '張力の関係と、加速度の関係',
          m: [R`T = 2T'\qquad(\text{質量 0 の P:}\ T - 2T' = 0)`,
              R`a_{\mathrm{P}} = -a_{\mathrm{A}},\qquad a_{\mathrm{B}} = a_{\mathrm{P}} + b,\quad a_{\mathrm{C}} = a_{\mathrm{P}} - b`],
          n: R`A につながる糸の張力を $T$、B と C をつなぐ糸の張力を $T'$ とします。軽い糸は全体で同じ張力なので、P には上向きに $T$、下向きに $2T'$（糸が 2 本分）がはたらき、P の質量は $0$ なので $T=2T'$ です。糸の長さは変わらないので、A が下向きに $a_{\mathrm{A}}$ で動けば P は上向きに同じ大きさで動きます（$a_{\mathrm{P}}=-a_{\mathrm{A}}$）。さらに B と C は、P に対して逆向きに同じ大きさ $b$ だけ加速度をもちます。`,
          easy: R`動滑車は「糸でぶら下がっている質量のない滑車」です。質量が $0$ なので、滑車にはたらく力の合計は常に $0$ です。上向きに糸 1 本分の力 $T$、下向きに糸 2 本分の力 $2T'$ が引っ張るので $T=2T'$ となります。また、ひとつの糸でつながっている定滑車の両側では、片方が下がると、もう片方は同じ長さだけ上がります。`,
          lv: 1
        },
        {
          t: '運動方程式を立てる',
          m: [R`\text{A:}\quad M a_{\mathrm{A}} = Mg - T`,
              R`\text{B:}\quad m_{1}a_{\mathrm{B}} = m_{1}g - T',\qquad \text{C:}\quad m_{2}a_{\mathrm{C}} = m_{2}g - T'`],
          n: R`下向きを正にして、それぞれの物体の運動方程式を書きます。未知数は $a_{\mathrm{A}},\ b,\ T,\ T'$ の 4 つ、式は A, B, C の 3 つと $T=2T'$ の 4 つです。`,
          lv: 2
        },
        {
          t: 'B, C から P の側の張力を求める（(1)）',
          m: [R`T' = m_{1}(g-a_{\mathrm{B}}) = m_{2}(g-a_{\mathrm{C}}),\quad a_{\mathrm{B}}=a_{\mathrm{P}}+b,\ a_{\mathrm{C}}=a_{\mathrm{P}}-b`,
              R`b = \frac{(m_{1}-m_{2})(g-a_{\mathrm{P}})}{m_{1}+m_{2}},\qquad T' = \frac{2m_{1}m_{2}}{m_{1}+m_{2}}(g-a_{\mathrm{P}})`,
              R`T = 2T' = \frac{4m_{1}m_{2}}{m_{1}+m_{2}}(g-a_{\mathrm{P}})`],
          n: R`B, C の式から $b$ を消すために、2 つの式の $T'$ を等しいとおきます。$m_{1}(g-a_{\mathrm{P}}-b)=m_{2}(g-a_{\mathrm{P}}+b)$ から $b$ を求め、$T'$ に代入します。結果は、$T$ が「質量 $\dfrac{4m_{1}m_{2}}{m_{1}+m_{2}}$ の 1 つの物体が、加速度 $a_{\mathrm{P}}$（下向き）で動くときの張力」と同じ形になっています。`,
          pro: R`動滑車で B, C をつるした側は、**等価質量** $M_{\mathrm{e}}=\dfrac{4m_{1}m_{2}}{m_{1}+m_{2}}$ の 1 つの物体と同じ。$m_{1}=m_{2}=m$ なら $M_{\mathrm{e}}=2m$（B と C が一体の $2m$）で、直感とも合う。`,
          lv: 1
        },
        {
          t: 'A の加速度（(2)(3)）',
          m: [R`Ma_{\mathrm{A}} = Mg - M_{\mathrm{e}}\,(g + a_{\mathrm{A}})\quad(a_{\mathrm{P}}=-a_{\mathrm{A}})`,
              R`a_{\mathrm{A}} = \frac{M-M_{\mathrm{e}}}{M+M_{\mathrm{e}}}\,g = \frac{M(m_{1}+m_{2})-4m_{1}m_{2}}{M(m_{1}+m_{2})+4m_{1}m_{2}}\,g`,
              R`M_{\mathrm{e}}=\frac{4\times 2.0\times 6.0}{8.0}=6.0\,\mathrm{kg}:\quad a_{\mathrm{A}} = \frac{4.0-6.0}{4.0+6.0}\times 9.8 = -1.96\,\mathrm{m/s^{2}}`],
          n: R`$T=M_{\mathrm{e}}(g-a_{\mathrm{P}})$ と $a_{\mathrm{P}}=-a_{\mathrm{A}}$ を A の運動方程式に代入して、$a_{\mathrm{A}}$ について解きます。下向きを正としているので $a_{\mathrm{A}}=-1.96\,\mathrm{m/s^{2}}$ は**上向きに $1.96\,\mathrm{m/s^{2}}$** の加速度です（$M<M_{\mathrm{e}}$ なので A は上がります）。`,
          easy: R`A の質量 $M=4.0\,\mathrm{kg}$ と、反対側の B・C 全体（等価質量 $6.0\,\mathrm{kg}$）の「重さくらべ」です。反対側のほうが重い（$6.0>4.0$）ので、A は引き上げられます。加速度は「（重い側 − 軽い側）÷（合計）× $g$」の形になります。`,
          lv: 1
        },
        {
          t: 'B, C の加速度（(4)）',
          m: [R`T = M(g - a_{\mathrm{A}}) = 4.0\times(9.8+1.96) = 47.04\,\mathrm{N},\qquad T' = \frac{T}{2} = 23.52\,\mathrm{N}`,
              R`a_{\mathrm{C}} = g - \frac{T'}{m_{2}} = 9.8 - \frac{23.52}{6.0} = 5.88\,\mathrm{m/s^{2}}`,
              R`a_{\mathrm{B}} = g - \frac{T'}{m_{1}} = 9.8 - \frac{23.52}{2.0} = -1.96\,\mathrm{m/s^{2}}`],
          n: R`A の運動方程式から $T$、$T=2T'$ から $T'$ が求まります。C の運動方程式から $a_{\mathrm{C}}=5.88\,\mathrm{m/s^{2}}$（下向き）、B は $-1.96\,\mathrm{m/s^{2}}$（上向きに $1.96\,\mathrm{m/s^{2}}$）です。確認として $a_{\mathrm{P}}=+1.96$ なので $b=a_{\mathrm{B}}-a_{\mathrm{P}}=-3.92$、$a_{\mathrm{C}}=a_{\mathrm{P}}-b=5.88$ となり、$(a_{\mathrm{B}}+a_{\mathrm{C}})/2=a_{\mathrm{P}}$ も成り立っています。`,
          lv: 1
        },
        {
          t: 'A が静止し続ける条件（(5)）',
          m: R`a_{\mathrm{A}} = 0 \;\Longleftrightarrow\; M = M_{\mathrm{e}} = \frac{4m_{1}m_{2}}{m_{1}+m_{2}} = 6.0\,\mathrm{kg}`,
          n: R`$a_{\mathrm{A}}=0$ なら $a_{\mathrm{P}}=0$ で、P は動きません。ただし B と C は P に対して動きます（$b\neq 0$）。このとき $T=M_{\mathrm{e}}g=Mg$ なので、$M=M_{\mathrm{e}}$ です。A の質量が B と C の質量の和 $8.0\,\mathrm{kg}$ ではなく、$6.0\,\mathrm{kg}$ でつり合うところが、この問題のポイントです。`,
          pro: R`「B と C の質量の和でつり合う」と考えがち。B, C が動いているため、張力は $(m_{1}+m_{2})g$ より小さい（$\dfrac{4m_{1}m_{2}}{m_{1}+m_{2}}g\le(m_{1}+m_{2})g$）。`,
          lv: 1
        }
      ],
      prereq: ['p-eom', 'p-force0', 'p-kin'],
      tags: ['動滑車', '運動方程式', '糸の拘束条件']
    }

  ]);

  /* ---------- 運動量と力積 ---------- */
  // なめらかな水平面上の台（右側が 1/4 円弧）と小球
  function figArcPlatform() {
    const d = D(360, 232);
    const fy = 198, x0 = 22, xa = 190, rp = 92, ty = fy - 42;
    d.hatch(8, fy, 352, fy);
    d.path('M' + x0 + ' ' + fy + ' L' + x0 + ' ' + ty + ' L' + xa + ' ' + ty +
      ' A' + rp + ' ' + rp + ' 0 0 0 ' + (xa + rp) + ' ' + (ty - rp) + ' L' + (xa + rp) + ' ' + fy + ' Z', { cls: 'fg', fill: 'f0' });
    const bx = 84, br = 11;
    d.circle(bx, ty - br, br, { cls: 'c1', fill: 'f1' });
    arr(d, bx + 16, ty - br, bx + 62, ty - br, 'v₀', 'c3', bx + 68, ty - br - 6);
    d.text(bx, ty - 2 * br - 10, 'm = 1.0 kg', { size: 12 });
    d.text(112, fy - 10, 'M = 3.0 kg', { size: 12 });
    const cx = xa, cy = ty - rp;
    d.line(cx, cy, cx + rp * Math.cos(PI / 4), cy + rp * Math.sin(PI / 4), { cls: 'dim', dash: true, w: 1 });
    d.dot(cx, cy, { cls: 'dim', r: 2.5 });
    d.text(cx + 20, cy + 36, 'R = 0.80 m', { anchor: 'end', size: 12 });
    d.text(14, 24, '右向きを正', { anchor: 'start', size: 12, cls: 'dim' });
    return d.svg();
  }

  /* ---------- 仕事と力学的エネルギー ---------- */
  // 壁につながれたばねと物体（初めにばねを縮めた状態）
  function figSpringFriction() {
    const d = D(360, 214);
    const fy = 168, wx = 26, s = 200, xO = 196, bw = 50, bh = 36;
    const x0 = 0.19 * s;
    d.hatch(8, fy, 352, fy);
    d.hatch(wx, 86, wx, fy, { side: 1 });
    d.rect(xO, fy - bh, bw, bh, { cls: 'dim', dash: true, w: 1.2 });
    d.rect(xO - x0, fy - bh, bw, bh, { cls: 'c1', fill: 'f1', rx: 2 });
    d.text(xO - x0 + bw / 2, fy - bh / 2 + 5, 'm', { size: 13, italic: true });
    d.spring(wx, fy - bh / 2, xO - x0, fy - bh / 2, { n: 7, amp: 8 });
    d.line(xO, 122, xO, fy + 10, { cls: 'dim', dash: true, w: 1 });
    d.text(xO, fy + 26, 'O（自然の長さの位置）', { size: 12 });
    d.line(xO - x0, 122, xO, 122, { cls: 'c3', w: 1.4 });
    d.line(xO - x0, 117, xO - x0, 127, { cls: 'c3', w: 1.4 });
    d.line(xO, 117, xO, 127, { cls: 'c3', w: 1.4 });
    d.text(xO - x0 / 2, 112, 'x₀ = 0.19 m', { size: 12 });
    d.arrow(xO + 28, fy + 38, xO + 84, fy + 38, { cls: 'dim' });
    d.text(xO + 92, fy + 42, 'x', { italic: true, anchor: 'start', size: 13 });
    d.text(352, 24, 'm = 0.50 kg、k = 49 N/m', { anchor: 'end' });
    d.text(352, 42, '静止摩擦係数 μ = 0.40', { anchor: 'end' });
    d.text(352, 60, '動摩擦係数 μ′ = 0.20', { anchor: 'end' });
    return d.svg();
  }

  JK.registerProblems([

    /* ---------- 運動量と力積 ---------- */
    {
      id: 'p-adv-momentum-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-momentum',
      title: '曲面台の上の小球と運動量保存',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`なめらかな水平面上に、質量 $M=3.0\,\mathrm{kg}$ の台が置かれている。台の上面は、左側が水平で、右側は半径 $R=0.80\,\mathrm{m}$ の鉛直な $\dfrac{1}{4}$ 円弧であり、水平な面と円弧はなめらかにつながっている（図）。台は水平面上を自由にすべることができる。静止している台の水平な上面を、質量 $m=1.0\,\mathrm{kg}$ の小球が右向きに速さ $v_{0}$ で進み、円弧をのぼりはじめた。台と小球の間の摩擦、空気の抵抗は無視でき、重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。速度は右向きを正とし、速さや速度はすべて水平面（地面）に対するものとする。`,
      fig: figArcPlatform(),
      parts: [
        { label: '(1)', q: R`$v_{0}=4.0\,\mathrm{m/s}$ とする。小球が円弧上でもっとも高い位置に達した瞬間（このとき小球は台に対して静止している）の、台の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 1, rel: 0.02, unit: 'm/s' },
        {
          label: '(2)',
          q: R`小球が円弧の上端まではのぼらない場合について、(1) の瞬間の小球の高さ $h$（水平な上面から測る）を $m,\ M,\ v_{0},\ g$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{Mv_{0}^{2}}{2g(M+m)}$`,
            R`$\dfrac{mv_{0}^{2}}{2g(M+m)}$`,
            R`$\dfrac{(M+m)v_{0}^{2}}{2gM}$`,
            R`$\dfrac{v_{0}^{2}}{2g}$`,
            R`$\dfrac{Mv_{0}^{2}}{g(M+m)}$`
          ],
          answer: 0
        },
        { label: '(3)', q: R`$v_{0}=4.0\,\mathrm{m/s}$ のとき、$h$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.612, rel: 0.02, unit: 'm' },
        { label: '(4)', q: R`$v_{0}=4.0\,\mathrm{m/s}$ のとき、小球は円弧を下って再び水平な上面にもどり、台の左端から離れていった。その後の小球の速度（右向きが正）は何 $\mathrm{m/s}$ か。`, type: 'num', answer: -2, rel: 0.02, unit: 'm/s' },
        { label: '(5)', q: R`$v_{0}=6.0\,\mathrm{m/s}$ にすると、小球は円弧の上端から、台に対して鉛直上向きに飛び出した。小球は円弧の上端から、さらに何 $\mathrm{m}$ の高さまで上がるか。`, type: 'num', answer: 0.578, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: '使える保存則を確かめる',
          m: [R`m v_{0} = m v + M V\quad(\text{水平方向の運動量保存})`,
              R`\frac{1}{2}m v_{0}^{2} = \frac{1}{2}m v^{2} + \frac{1}{2}M V^{2} + m g y\quad(\text{力学的エネルギー保存})`],
          n: R`小球と台を 1 つの系と考えると、水平方向には外力がはたらきません（小球と台の間の力は内力）。だから水平方向の**運動量の和**は一定です。また、摩擦がなく、水平面もなめらかなので、系全体の**力学的エネルギー**も一定です。ただし、台は動くので、小球だけのエネルギーは保存しません（小球は台に仕事をします）。式の中の $v$, $V$ は小球・台の速度、$y$ は小球の高さです。`,
          easy: R`台がすべって動くので、「小球だけ」の力学的エネルギーは保存しません。小球は台を押して、台に運動エネルギーをわたしているからです。そこで「小球と台の両方」をまとめて 1 つの系とみなし、その系の運動量とエネルギーを考えます。系の外から水平な力がはたらかないので、水平な運動量の和は変わりません。`,
          lv: 1
        },
        {
          t: 'もっとも高い位置では、小球と台の速度が等しい（(1)）',
          m: R`m v_{0} = (m+M)\,V \;\Longrightarrow\; V = \frac{m v_{0}}{m+M} = \frac{1.0\times 4.0}{1.0+3.0} = 1.0\,\mathrm{m/s}`,
          n: R`小球がもっとも高い位置に達した瞬間は、小球が台に対して動いていない（高さが変わらない）瞬間です。このとき小球と台は同じ速度 $V$ で動いています。`,
          easy: R`小球が円弧の上で「いちばん高いところ」に来た瞬間は、小球が上り終えて、これから下りはじめる、ちょうど切り替わりの瞬間です。台から見ると小球は止まっているので、地面から見れば、小球と台は同じ速度で動いています。`,
          lv: 1
        },
        {
          t: 'もっとも高い位置の高さ（(2)(3)）',
          m: [R`\frac{1}{2}m v_{0}^{2} = \frac{1}{2}(m+M)V^{2} + m g h`,
              R`h = \frac{1}{g}\left\{\frac{v_{0}^{2}}{2} - \frac{(m+M)V^{2}}{2m}\right\} = \frac{M v_{0}^{2}}{2g(M+m)} = \frac{3.0\times 4.0^{2}}{2\times 9.8\times 4.0} \approx 0.612\,\mathrm{m}`],
          n: R`$V=\dfrac{m v_{0}}{m+M}$ を代入して整理します。台が動かない（$M\to\infty$）とすると $h\to\dfrac{v_{0}^{2}}{2g}$（ふつうの斜面と同じ）になり、$M$ が有限だと運動エネルギーの一部が台に残るので $h$ が小さくなります。$h=0.612\,\mathrm{m}<R=0.80\,\mathrm{m}$ なので、確かに円弧の上端までは達しません。`,
          pro: R`この瞬間は完全非弾性衝突（反発係数 $0$）と同じ。失われる運動エネルギーが、位置エネルギー $mgh$ になる。極限 $M\to\infty$ で $h\to\dfrac{v_{0}^{2}}{2g}$ になることで、式を確認できる。`,
          lv: 1
        },
        {
          t: '円弧を下ってもどった後（(4)）',
          m: [R`m v_{0} = m v_{1} + M V_{1},\qquad \frac{1}{2}m v_{0}^{2} = \frac{1}{2}m v_{1}^{2} + \frac{1}{2}M V_{1}^{2}`,
              R`v_{1} = \frac{m-M}{m+M}\,v_{0} = \frac{1.0-3.0}{4.0}\times 4.0 = -2.0\,\mathrm{m/s},\qquad V_{1} = \frac{2m}{m+M}\,v_{0} = 2.0\,\mathrm{m/s}`],
          n: R`小球が円弧をのぼってもどってくると、小球と台の高さの変化はもとにもどります。したがって運動量保存と力学的エネルギー保存の式は、**弾性衝突**（反発係数 $1$）と同じ形です。この 2 式を連立して解きます（$v_{1}=v_{0},\ V_{1}=0$ は最初の状態に当たるので除きます）。小球の速度は負（左向き）で、台は右向きに $2.0\,\mathrm{m/s}$ で進みます。小球は台より遅い左向きなので、台の左端から離れていきます。`,
          lv: 1
        },
        {
          t: '円弧の上端から飛び出す場合（(5)）',
          m: [R`V = \frac{m v_{0}}{m+M} = \frac{1.0\times 6.0}{4.0} = 1.5\,\mathrm{m/s}`,
              R`\frac{1}{2}m v_{0}^{2} = \frac{1}{2}(m+M)V^{2} + \frac{1}{2}m u^{2} + m g R`,
              R`u^{2} = v_{0}^{2} - \frac{(m+M)V^{2}}{m} - 2gR = 36 - 9.0 - 15.68 = 11.32,\qquad \frac{u^{2}}{2g} = \frac{11.32}{19.6} \approx 0.578\,\mathrm{m}`],
          n: R`円弧の上端では、台に対する小球の速度が鉛直上向き（円弧の接線の向き）です。したがって、小球の水平方向の速度は台の速度 $V$ と等しく、運動量保存から $V=\dfrac{m v_{0}}{m+M}$ です。上端での小球の鉛直方向の速さを $u$ としてエネルギー保存の式を立てます。小球が上端を離れた後は、水平方向には力がはたらかないので、小球も台も水平な速度 $V$ を保ちます。そのため小球は台の上端の真上で上がって下がり、同じ点にもどって円弧に入りなおします。上がる高さは鉛直投げ上げの式 $\dfrac{u^{2}}{2g}$ です。`,
          easy: R`上端は円弧の一番上で、ここの面は鉛直です。小球は面にそって上に向かって飛び出すので、「台から見た」小球の動きは真上です。つまり、横向きの速さは台と同じになります。小球が空中にいる間は、小球にも台にも横向きの力がはたらかないので、2 つは同じ横向きの速さで進み続け、小球は台の同じ場所に落ちてきます。`,
          lv: 1
        },
        {
          t: '飛び出す条件の確認',
          m: R`h \ge R \;\Longleftrightarrow\; v_{0} \ge \sqrt{\frac{2gR(M+m)}{M}} = \sqrt{\frac{2\times 9.8\times 0.80\times 4.0}{3.0}} \approx 4.6\,\mathrm{m/s}`,
          n: R`円弧の上端の高さ $R$ を越える条件は、$h$ の式（円弧が十分に高いとした場合の最高点の高さ）が $R$ 以上になることです。$v_{0}=4.0\,\mathrm{m/s}$ はこれより小さいので、上端に達しません（(3) の結果とも合います）。$v_{0}=6.0\,\mathrm{m/s}$ はこれより大きいので、上端から飛び出します。`,
          lv: 2
        }
      ],
      prereq: ['p-momentum', 'p-energy', 'p-eom'],
      tags: ['運動量保存', 'エネルギー保存', '曲面台']
    },

    /* ---------- 仕事と力学的エネルギー ---------- */
    {
      id: 'p-adv-energy-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-energy',
      title: 'ばねにつながれた物体の減衰運動',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`水平な床の上に、質量 $m=0.50\,\mathrm{kg}$ の物体を置き、一端を壁に固定した、ばね定数 $k=49\,\mathrm{N/m}$ の軽いばねにつなぐ（図）。物体と床の間の静止摩擦係数は $\mu=0.40$、動摩擦係数は $\mu'=0.20$ である。ばねが自然の長さのときの物体の位置を原点 O とし、ばねが伸びる向き（壁から遠ざかる向き）を $x$ 軸の正の向きとする。物体を O から $x_{0}=0.19\,\mathrm{m}$ だけ壁の側へ押し縮めて静かに放すと、物体は運動をはじめた。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: figSpringFriction(),
      parts: [
        {
          label: '(1)',
          q: R`一般に、物体を縮めた長さ $x_{0}$ から放したとき、物体がはじめて止まる位置（O から正の側の距離）$x_{1}$ を $x_{0},\ k,\ m,\ \mu',\ g$ で表した式として正しいものを選べ。ただし、物体はこの位置まで到達するものとする。`,
          type: 'choice',
          choices: [
            R`$x_{0}-\dfrac{\mu' mg}{k}$`,
            R`$x_{0}-\dfrac{2\mu' mg}{k}$`,
            R`$x_{0}-\dfrac{4\mu' mg}{k}$`,
            R`$x_{0}\,(1-\mu')$`,
            R`$x_{0}-\dfrac{2\mu' mg}{kx_{0}}$`
          ],
          answer: 1
        },
        { label: '(2)', q: R`$x_{1}$ は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.15, rel: 0.02, unit: 'm' },
        { label: '(3)', q: R`放した後、物体がはじめて O を通りすぎるまでの間で、物体の速さが最大になったときの速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 1.68, rel: 0.02, unit: 'm/s' },
        { label: '(4)', q: R`物体は何回か往復したのち、最終的に静止した。静止した位置は、O から何 $\mathrm{m}$ 離れているか。`, type: 'num', answer: 0.03, rel: 0.02, unit: 'm' },
        { label: '(5)', q: R`放してから静止するまでに、物体が動いた道のりの合計は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.88, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: '運動の様子を整理する',
          n: R`物体が動いている間は、動摩擦力 $\mu' mg=0.98\,\mathrm{N}$ が、運動の向きと逆向きにはたらきます。ばねが縮んでいるときの弾性力は、はじめ $kx_{0}=49\times 0.19=9.31\,\mathrm{N}$ で、動摩擦力よりずっと大きいので、物体は動き出します。以後、折り返す（速さが $0$ になる）たびに、「ばねの力 $k|x|$ が最大摩擦力 $\mu mg=1.96\,\mathrm{N}$ 以下か」を調べて、動き続けるか止まるかを判断します。`,
          easy: R`床がざらざらなので、物体が動くと、動いている向きと逆向きに一定の大きさの摩擦力（動摩擦力）がはたらきます。そのため、ばねだけのときのように同じ位置まで往復を繰り返さず、行くたびに少しずつ短くなっていきます。物体が止まる瞬間には、ばねの力が摩擦力に勝てば再び動き、負ければそのまま止まります。この「止まる瞬間の判断」が大切です。`,
          lv: 1
        },
        {
          t: 'はじめて止まる位置（(1)(2)）',
          m: [R`\frac{1}{2}k x_{0}^{2} - \frac{1}{2}k x_{1}^{2} = \mu' mg\,(x_{0}+x_{1})`,
              R`\frac{1}{2}k(x_{0}-x_{1})(x_{0}+x_{1}) = \mu' mg\,(x_{0}+x_{1}) \;\Longrightarrow\; x_{1} = x_{0}-\frac{2\mu' mg}{k}`,
              R`x_{1} = 0.19 - \frac{2\times 0.20\times 0.50\times 9.8}{49} = 0.19 - 0.04 = 0.15\,\mathrm{m}`],
          n: R`物体が動いた距離は $x_{0}+x_{1}$ です。ばねの弾性エネルギーの減少が、動摩擦力のした仕事（熱になる）に等しいとおきます。両辺に共通因数 $x_{0}+x_{1}$ があるので、約分すると $x_{1}$ が求まります。1 回折り返すごとに、振れ幅が $\dfrac{2\mu' mg}{k}=0.04\,\mathrm{m}$ ずつ減ります。`,
          pro: R`「1 往復ごとではなく、**半往復ごとに** $\dfrac{2\mu' mg}{k}$ ずつ振れ幅が減る」は定石。振動の中心が、動く向きによって $\mp\dfrac{\mu' mg}{k}$ ずれると考える（それぞれの半往復が単振動）。`,
          lv: 1
        },
        {
          t: '速さが最大になる位置と速さ（(3)）',
          m: [R`kx + \mu' mg = 0 \;\Longrightarrow\; x = -\frac{\mu' mg}{k} = -0.020\,\mathrm{m}`,
              R`\frac{1}{2}m v^{2} = \frac{1}{2}k(0.19^{2}-0.020^{2}) - \mu' mg\,(0.19-0.020)`,
              R`\frac{1}{2}\times 0.50\times v^{2} = 0.8747 - 0.1666 = 0.7081\;\Longrightarrow\; v \approx 1.68\,\mathrm{m/s}`],
          n: R`速さが最大になるのは、合力が $0$ になる位置です。右向きを正とすると、ばねの力は $-kx$（縮んだ位置 $x<0$ では右向き）、動摩擦力は左向きに $\mu' mg$ なので、合力 $-kx-\mu' mg=0$ から $x=-\dfrac{\mu' mg}{k}$、つまり O の手前 $0.020\,\mathrm{m}$ の位置です。そこまでに物体が動いた距離は $0.19-0.020=0.17\,\mathrm{m}$ なので、動摩擦力の仕事は $-\mu' mg\times 0.17$ です。`,
          easy: R`物体は、はじめはばねに押されて速くなりますが、ばねが伸びるにつれてばねの力は弱くなります。ばねの力が摩擦力と同じ大きさになった位置で、加速が止まって、それ以後は減速に変わります。つまり速さが最大なのは、O（自然の長さの位置）ではなく、その少し手前です。`,
          lv: 1
        },
        {
          t: '折り返しごとの振れ幅と、止まる位置（(4)）',
          m: [R`x_{n} = x_{0} - n\times\frac{2\mu' mg}{k} = 0.19 - 0.04\,n\quad (n=0,1,2,\cdots)`,
              R`x_{1}=0.15,\ x_{2}=0.11,\ x_{3}=0.07,\ x_{4}=0.03\ (\mathrm{m})`,
              R`k x_{n} \le \mu mg=1.96\,\mathrm{N} \;\Longleftrightarrow\; x_{n}\le 0.04\,\mathrm{m}`],
          n: R`折り返し点 $x_{n}$（O からの距離）は 0.04 m ずつ減ります。折り返したとき、ばねの力が最大摩擦力以下なら物体は止まったままです。$x_{1}=0.15,\ x_{2}=0.11,\ x_{3}=0.07\,\mathrm{m}$ のときは、ばねの力 $kx_{n}$ がそれぞれ $7.35,\ 5.39,\ 3.43\,\mathrm{N}$ で最大摩擦力 $1.96\,\mathrm{N}$ より大きいので再び動き出します。$x_{4}=0.03\,\mathrm{m}$ では $kx_{4}=1.47\,\mathrm{N}<1.96\,\mathrm{N}$ なので、このまま静止します。静止する位置は、O から壁の側へ $0.03\,\mathrm{m}$ の点です（4 回目の折り返し点）。`,
          easy: R`止まった瞬間にもう動き出さないのは、ばねの力が、静止摩擦力の最大値より小さいときです。「動く間は動摩擦力 $\mu' mg$、止まったあとは静止摩擦力（最大 $\mu mg$）」と使い分けるのがポイントです。ここでは $\mu$ のほうが大きいので、ばねの力が $1.96\,\mathrm{N}$（動摩擦力 $0.98\,\mathrm{N}$ の 2 倍）以下なら止まったままです。`,
          pro: R`静止の判定は **静止摩擦係数 $\mu$ で行い、エネルギーの計算は動摩擦係数 $\mu'$ で行う**。ここで $\mu'$ と $\mu$ を取りちがえるミスが多い。`,
          lv: 1
        },
        {
          t: '道のりの合計（(5)）',
          m: [R`\frac{1}{2}k x_{0}^{2} - \frac{1}{2}k x_{4}^{2} = \mu' mg\,s`,
              R`s = \frac{\dfrac{1}{2}\times 49\times(0.19^{2}-0.03^{2})}{0.20\times 0.50\times 9.8} = \frac{0.8624}{0.98} = 0.88\,\mathrm{m}`],
          n: R`はじめと終わりの弾性エネルギーの差が、すべて動摩擦力の仕事（道のり $s$ にわたる）になったと考えます。各半往復の距離 $0.34,\ 0.26,\ 0.18,\ 0.10\,\mathrm{m}$ を足した $0.88\,\mathrm{m}$ とも一致します。`,
          pro: R`摩擦力の仕事は「摩擦力 × **道のり**」。変位ではなく、往復したぶんも全部足す。`,
          lv: 1
        }
      ],
      prereq: ['p-energy', 'p-eom', 'p-force0'],
      tags: ['ばね', '動摩擦力', 'エネルギー保存', '静止の判定']
    }

  ]);

  /* ---------- 円運動 ---------- */
  // 回転円盤を真上から見た図（O から A, B が同じ側に並ぶ）
  function figTurntable() {
    const d = D(360, 262);
    const cx = 160, cy = 142, s = 180, rd = 112;
    const rA = 0.20 * s, rB = 0.50 * s;
    const pol = function (r, deg) { return [cx + r * Math.cos(deg * PI / 180), cy - r * Math.sin(deg * PI / 180)]; };
    d.circle(cx, cy, rd, { cls: 'fg', fill: 'f0' });
    d.dot(cx, cy, { cls: 'fg', r: 3 });
    d.text(cx - 9, cy - 8, 'O', { italic: true, size: 13 });
    d.line(cx + rA + 12, cy, cx + rB - 10, cy, { cls: 'c3', w: 2 });
    d.rect(cx + rA - 12, cy - 12, 24, 24, { cls: 'c1', fill: 'f1', rx: 2 });
    d.rect(cx + rB - 10, cy - 10, 20, 20, { cls: 'c2', fill: 'f2', rx: 2 });
    d.text(cx + rA, cy + 5, 'A', { italic: true, size: 13 });
    d.text(cx + rB, cy + 5, 'B', { italic: true, size: 13 });
    d.text(cx + (rA + rB) / 2 + 2, cy - 12, '糸', { size: 12 });
    // 寸法線
    const y1 = cy + 36, y2 = cy + 70;
    d.line(cx, y1, cx + rB, y1, { cls: 'dim', w: 1 });
    d.line(cx, y1 - 5, cx, y1 + 5, { cls: 'dim', w: 1 });
    d.line(cx + rB, y1 - 5, cx + rB, y1 + 5, { cls: 'dim', w: 1 });
    d.text(cx + rB / 2, y1 + 18, 'OB = 0.50 m', { size: 12 });
    d.line(cx, y2, cx + rA, y2, { cls: 'dim', w: 1 });
    d.line(cx, y2 - 5, cx, y2 + 5, { cls: 'dim', w: 1 });
    d.line(cx + rA, y2 - 5, cx + rA, y2 + 5, { cls: 'dim', w: 1 });
    d.text(cx - 8, y2 + 4, 'OA = 0.20 m', { size: 12, anchor: 'end' });
    // 回転の向き（反時計まわり）
    d.arc(cx, cy, 126, 20, 90, { cls: 'c3', w: 2 });
    const q1 = pol(126, 84), q2 = pol(126, 98);
    d.arrow(q1[0], q1[1], q2[0], q2[1], { cls: 'c3' });
    d.text(cx - 22, cy - 126 + 6, 'ω', { italic: true, size: 14 });
    d.text(352, 24, 'A: 0.30 kg、B: 0.20 kg', { anchor: 'end' });
    d.text(352, 42, '静止摩擦係数 μ = 0.40', { anchor: 'end' });
    return d.svg();
  }

  /* ---------- 単振動 ---------- */
  // 鉛直ばねの上の台と小物体（つり合いの位置・自然の長さの位置・放す位置）
  function figVertSpring() {
    const d = D(360, 258);
    const fy = 240, sx = 96, yEq = 124, dN = 40, dA = 62;
    const yNat = yEq - dN, yLow = yEq + dA;
    d.hatch(30, fy, 170, fy);
    d.spring(sx, fy, sx, yEq + 12, { n: 8, amp: 9 });
    d.rect(sx - 34, yEq, 68, 12, { cls: 'fg', fill: 'f0' });
    d.rect(sx - 14, yEq - 26, 28, 26, { cls: 'c1', fill: 'f1', rx: 2 });
    d.text(sx, yEq - 8, 'm', { italic: true, size: 13 });
    d.text(sx + 44, yEq + 10, 'M', { italic: true, size: 13, anchor: 'start' });
    d.line(30, yNat, 232, yNat, { cls: 'dim', dash: true, w: 1 });
    d.line(30, yEq, 232, yEq, { cls: 'c3', dash: true, w: 1 });
    d.line(30, yLow, 232, yLow, { cls: 'dim', dash: true, w: 1 });
    d.text(240, yNat + 4, 'ばねが自然の長さ', { anchor: 'start' });
    d.text(240, yEq + 4, 'つり合いの位置 O', { anchor: 'start' });
    d.text(240, yLow + 4, '放す位置（最下点）', { anchor: 'start' });
    // 寸法 d, A
    const xd = 206;
    d.line(xd, yNat, xd, yEq, { cls: 'c3', w: 1.2 });
    d.line(xd - 4, yNat, xd + 4, yNat, { cls: 'c3', w: 1.2 });
    d.line(xd - 4, yEq, xd + 4, yEq, { cls: 'c3', w: 1.2 });
    d.text(xd - 8, (yNat + yEq) / 2 + 4, 'd', { italic: true, size: 13, anchor: 'end' });
    d.line(xd, yEq, xd, yLow, { cls: 'c3', w: 1.2 });
    d.line(xd - 4, yLow, xd + 4, yLow, { cls: 'c3', w: 1.2 });
    d.text(xd - 8, (yEq + yLow) / 2 + 4, 'A', { italic: true, size: 13, anchor: 'end' });
    d.arrow(346, 124, 346, 70, { cls: 'dim' });
    d.text(346, 62, 'z', { anchor: 'middle', italic: true, size: 13 });
    d.text(352, 24, 'k = 100 N/m', { anchor: 'end' });
    d.text(352, 42, 'M = 0.60 kg、m = 0.40 kg', { anchor: 'end' });
    return d.svg();
  }

  JK.registerProblems([

    /* ---------- 円運動 ---------- */
    {
      id: 'p-adv-circular-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-circular',
      title: '回転円盤上の 2 物体と糸',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`水平な円盤が、中心 O を通る鉛直な軸のまわりに回転できる。円盤の上の、O を通る直線上の同じ側に、質量 $m_{\mathrm{A}}=0.30\,\mathrm{kg}$ の物体 A と質量 $m_{\mathrm{B}}=0.20\,\mathrm{kg}$ の物体 B を、O からの距離がそれぞれ $r_{\mathrm{A}}=0.20\,\mathrm{m}$、$r_{\mathrm{B}}=0.50\,\mathrm{m}$ の位置に置き、長さ $0.30\,\mathrm{m}$ の軽い糸で A と B をつないだ（図は円盤を真上から見たもの）。糸は初め、ちょうど張った状態（張力は $0$）である。物体と円盤の間の静止摩擦係数は、A, B ともに $\mu=0.40$ である。円盤の角速度 $\omega$ を $0$ からゆっくり大きくしていく。重力加速度の大きさを $9.8\,\mathrm{m/s^{2}}$ とする。物体は円盤と一緒に等速円運動をしている間、円盤に対して静止しているものとする。`,
      fig: figTurntable(),
      parts: [
        { label: '(1)', q: R`もし糸がなかったとすると、先に円盤に対してすべり出すのは外側の B である。B がすべり出す角速度 $\omega_{1}$ は何 $\mathrm{rad/s}$ か。`, type: 'num', answer: 2.8, rel: 0.02, unit: 'rad/s' },
        { label: '(2)', q: R`$\omega$ が $\omega_{1}$ をこえると、糸がぴんと張って張力 $T$ が生じる。このとき B は、静止摩擦力が最大値の状態を保ったまま、A, B とも円盤に対して静止し続ける。$\omega=3.2\,\mathrm{rad/s}$ のとき、$T$ は何 $\mathrm{N}$ か。`, type: 'num', answer: 0.24, rel: 0.02, unit: 'N' },
        {
          label: '(3)',
          q: R`$\omega$ をさらに大きくすると、A, B は円盤に対して外向きにすべりだす。このときの角速度 $\omega_{2}$ を $\mu,\ g,\ m_{\mathrm{A}},\ m_{\mathrm{B}},\ r_{\mathrm{A}},\ r_{\mathrm{B}}$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\sqrt{\dfrac{\mu g}{r_{\mathrm{B}}}}$`,
            R`$\sqrt{\dfrac{\mu g\,(m_{\mathrm{A}}+m_{\mathrm{B}})}{m_{\mathrm{A}}r_{\mathrm{A}}+m_{\mathrm{B}}r_{\mathrm{B}}}}$`,
            R`$\sqrt{\dfrac{\mu g\,(m_{\mathrm{A}}+m_{\mathrm{B}})}{m_{\mathrm{A}}r_{\mathrm{B}}+m_{\mathrm{B}}r_{\mathrm{A}}}}$`,
            R`$\sqrt{\dfrac{2\mu g}{r_{\mathrm{A}}+r_{\mathrm{B}}}}$`,
            R`$\sqrt{\dfrac{\mu g}{r_{\mathrm{A}}}}$`
          ],
          answer: 1
        },
        { label: '(4)', q: R`$\omega_{2}$ は何 $\mathrm{rad/s}$ か。`, type: 'num', answer: 3.5, rel: 0.02, unit: 'rad/s' },
        {
          label: '(5)',
          q: R`A の質量 $m_{\mathrm{A}}$ だけを $0.30\,\mathrm{kg}$ から大きくしていくと、$\omega_{1}$ と $\omega_{2}$ はどうなるか。正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\omega_{1}$ も $\omega_{2}$ も変わらない`,
            R`$\omega_{1}$ は変わらず、$\omega_{2}$ は大きくなる`,
            R`$\omega_{1}$ は変わらず、$\omega_{2}$ は小さくなる`,
            R`$\omega_{1}$ も $\omega_{2}$ も大きくなる`,
            R`$\omega_{1}$ は大きくなり、$\omega_{2}$ は変わらない`
          ],
          answer: 1
        }
      ],
      solution: [
        {
          t: '円運動の向心力を、摩擦力と張力で分ける',
          m: R`m\,r\,\omega^{2} = (\text{円盤の中心向きの力の合計})`,
          n: R`円盤の上で円運動をしている物体は、中心 O に向かう向心力 $mr\omega^{2}$ を必要とします。その力を、円盤からの**静止摩擦力**と**糸の張力**が分担します。静止摩擦力の大きさには上限（最大摩擦力 $\mu mg$）があるので、$\omega$ が大きくなると、必要な向心力を摩擦力だけでは出せなくなります。`,
          easy: R`物体が円を描いて回るには、円の中心へ向かう力（向心力）が必要です。円盤の上の物体の場合、その力は、円盤が物体を引きとめる静止摩擦力です。回転が速くなるほど必要な力は大きくなり（$mr\omega^{2}$）、また中心から遠いほど大きくなりますが、摩擦力には上限があります。上限を超えるとすべり出します。`,
          lv: 1
        },
        {
          t: '糸がない場合に B がすべり出す角速度（(1)）',
          m: R`m_{\mathrm{B}}\,r_{\mathrm{B}}\,\omega_{1}^{2} = \mu m_{\mathrm{B}}g \;\Longrightarrow\; \omega_{1} = \sqrt{\frac{\mu g}{r_{\mathrm{B}}}} = \sqrt{\frac{0.40\times 9.8}{0.50}} = 2.8\,\mathrm{rad/s}`,
          n: R`質量 $m_{\mathrm{B}}$ が両辺で約分でき、すべり出す角速度は質量によりません。A は中心に近いので、すべり出すのは $\sqrt{\dfrac{\mu g}{r_{\mathrm{A}}}}\approx 4.4\,\mathrm{rad/s}$ とずっと大きい角速度です。したがって、糸がなければ B が先にすべり出します。`,
          lv: 1
        },
        {
          t: R`$\omega_{1}$ をこえたときの糸の張力（(2)）`,
          m: [R`\text{B:}\quad m_{\mathrm{B}}\,r_{\mathrm{B}}\,\omega^{2} = \mu m_{\mathrm{B}}g + T`,
              R`T = m_{\mathrm{B}}\left(r_{\mathrm{B}}\omega^{2} - \mu g\right) = 0.20\times\left(0.50\times 3.2^{2} - 0.40\times 9.8\right) = 0.24\,\mathrm{N}`],
          n: R`B は外へすべり出そうとして、糸を引きます。糸は B を内向きに引くので、B の向心力は「最大摩擦力 $\mu m_{\mathrm{B}}g$ + 張力 $T$」です。この式から $T$ が求まります（$\omega=3.2$ のとき $\omega^{2}=10.24$）。`,
          easy: R`B を内側に引っぱる力は、摩擦力（これ以上は出せない最大値 $\mu m_{\mathrm{B}}g$）と、糸の張力 $T$ の 2 つです。回転が速くなって、摩擦力だけでは足りなくなった分を、糸が代わりに引いてくれます。$T$ は「足りない分」にあたり、$m_{\mathrm{B}}r_{\mathrm{B}}\omega^{2}-\mu m_{\mathrm{B}}g$ です。`,
          lv: 1
        },
        {
          t: 'A にはたらく力と、A がもつ余裕',
          m: R`\text{A:}\quad m_{\mathrm{A}}\,r_{\mathrm{A}}\,\omega^{2} = f_{\mathrm{A}} - T \;\Longrightarrow\; f_{\mathrm{A}} = m_{\mathrm{A}}r_{\mathrm{A}}\omega^{2} + T`,
          n: R`糸は A を**外向き**（B の側）に引くので、A の向心力は「A が受ける静止摩擦力 $f_{\mathrm{A}}$ − 張力 $T$」です。つまり、$T$ が大きいほど、A は大きな摩擦力 $f_{\mathrm{A}}$ を必要とします。$\omega=3.2\,\mathrm{rad/s}$ では $f_{\mathrm{A}}=0.30\times 0.20\times 10.24+0.24\approx 0.85\,\mathrm{N}$ で、最大摩擦力 $\mu m_{\mathrm{A}}g=1.18\,\mathrm{N}$ より小さいので、A はすべりません。`,
          lv: 2
        },
        {
          t: '2 物体がともにすべり出す角速度（(3)(4)）',
          m: [R`f_{\mathrm{A}} = \mu m_{\mathrm{A}}g \;\Longrightarrow\; m_{\mathrm{A}}r_{\mathrm{A}}\omega_{2}^{2} + m_{\mathrm{B}}\left(r_{\mathrm{B}}\omega_{2}^{2}-\mu g\right) = \mu m_{\mathrm{A}}g`,
              R`\omega_{2} = \sqrt{\frac{\mu g\,(m_{\mathrm{A}}+m_{\mathrm{B}})}{m_{\mathrm{A}}r_{\mathrm{A}}+m_{\mathrm{B}}r_{\mathrm{B}}}} = \sqrt{\frac{0.40\times 9.8\times 0.50}{0.060+0.100}} = \sqrt{12.25} = 3.5\,\mathrm{rad/s}`],
          n: R`A の摩擦力 $f_{\mathrm{A}}$ も最大値に達したところで、A, B はともに外へすべり出します。$T=m_{\mathrm{B}}(r_{\mathrm{B}}\omega^{2}-\mu g)$ を $f_{\mathrm{A}}$ の式に代入して整理しました。$\omega=\omega_{2}$ では $T=0.20\times(0.50\times 12.25-3.92)\approx 0.44\,\mathrm{N}$、$f_{\mathrm{A}}=0.30\times 0.20\times 12.25+0.44\approx 1.18\,\mathrm{N}=\mu m_{\mathrm{A}}g$ となって、確かに成り立っています。`,
          pro: R`$\omega_{2}^{2}=\dfrac{\mu g}{r_{\mathrm{G}}}$、ただし $r_{\mathrm{G}}=\dfrac{m_{\mathrm{A}}r_{\mathrm{A}}+m_{\mathrm{B}}r_{\mathrm{B}}}{m_{\mathrm{A}}+m_{\mathrm{B}}}$ は 2 物体の**重心の半径**。糸でつないだ 2 物体を 1 つの物体（質量 $m_{\mathrm{A}}+m_{\mathrm{B}}$、半径 $r_{\mathrm{G}}$）として、$(m_{\mathrm{A}}+m_{\mathrm{B}})r_{\mathrm{G}}\omega^{2}=\mu(m_{\mathrm{A}}+m_{\mathrm{B}})g$ と立てても同じ。`,
          lv: 1
        },
        {
          t: '質量を変えたときの変化（(5)）',
          n: R`$\omega_{1}=\sqrt{\dfrac{\mu g}{r_{\mathrm{B}}}}$ は質量を含まないので、$m_{\mathrm{A}}$ を変えても変わりません。$\omega_{2}$ は重心の半径 $r_{\mathrm{G}}$ で決まり、$m_{\mathrm{A}}$ を大きくすると重心は A の側（中心側）に近づき、$r_{\mathrm{G}}$ は小さくなる（$0.50\,\mathrm{m}$ から $0.20\,\mathrm{m}$ に近づく）ので、$\omega_{2}=\sqrt{\dfrac{\mu g}{r_{\mathrm{G}}}}$ は大きくなります。`,
          lv: 2
        }
      ],
      prereq: ['p-circular', 'p-eom', 'p-force0'],
      tags: ['円運動', '静止摩擦力', '糸の張力', '場合分け']
    },

    /* ---------- 単振動 ---------- */
    {
      id: 'p-adv-shm-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-shm',
      title: '台の上の物体の単振動と離脱',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`図のように、軽いばねの下端を床に固定し、上端に質量 $M=0.60\,\mathrm{kg}$ の台をつけ、台の上に質量 $m=0.40\,\mathrm{kg}$ の小物体をのせて、鉛直方向に振動させる。ばね定数は $k=100\,\mathrm{N/m}$、重力加速度の大きさは $9.8\,\mathrm{m/s^{2}}$ とする。台と小物体は接している間は同じ運動をする。台と小物体がつり合っているときの台の位置を原点 O とし、鉛直上向きを正とする座標 $z$ を考える。ばねの縮みは、つり合いの位置で $d$ である。空気の抵抗は無視できる。`,
      fig: figVertSpring(),
      parts: [
        { label: '(1)', q: R`台と小物体が離れずに振動するとき、振動の周期は何 $\mathrm{s}$ か。`, type: 'num', answer: 0.628, rel: 0.02, unit: 's', show: R`\frac{\pi}{5}` },
        {
          label: '(2)',
          q: R`台と小物体が離れずに振動しているとき、座標が $z$ の位置で、小物体が台から受ける垂直抗力の大きさ $N$ を $m,\ M,\ k,\ g,\ z$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$m\left(g+\dfrac{kz}{M+m}\right)$`,
            R`$m\left(g-\dfrac{kz}{m}\right)$`,
            R`$m\left(g-\dfrac{kz}{M+m}\right)$`,
            R`$mg-kz$`,
            R`$(M+m)\left(g-\dfrac{kz}{M+m}\right)$`
          ],
          answer: 2
        },
        { label: '(3)', q: R`台と小物体が離れずに振動できる、振幅の最大値は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.098, rel: 0.02, unit: 'm' },
        { label: '(4)', q: R`台を、つり合いの位置から $0.15\,\mathrm{m}$ だけ押し下げて静かに放した。小物体が台から離れる瞬間の、小物体の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 1.14, rel: 0.02, unit: 'm/s' },
        { label: '(5)', q: R`(4) で台から離れた小物体は、離れた点から何 $\mathrm{m}$ の高さまで上がるか。`, type: 'num', answer: 0.066, rel: 0.02, unit: 'm' }
      ],
      solution: [
        {
          t: '台と小物体を一体として見る（(1)）',
          m: [R`kd = (M+m)g \;\Longrightarrow\; d = \frac{(M+m)g}{k} = \frac{1.0\times 9.8}{100} = 0.098\,\mathrm{m}`,
              R`(M+m)\,a = -kz \;\Longrightarrow\; \omega = \sqrt{\frac{k}{M+m}} = 10\,\mathrm{rad/s},\qquad T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{M+m}{k}} \approx 0.628\,\mathrm{s}`],
          n: R`台と小物体が一体で動いている間は、質量 $M+m$ の 1 つの物体が、ばねにつながれて振動しているのと同じです。つり合いの位置からの変位 $z$ でのばねの力は、重力 $(M+m)g$ とあわせて、復元力 $-kz$ になるので、単振動です（重力があっても、つり合いの位置を原点にとれば周期は変わりません）。`,
          easy: R`ばねの先に重さがつながっているときは、重力があっても、「つり合いの位置」を中心にして単振動します。そして、周期は $2\pi\sqrt{\dfrac{\text{質量}}{\text{ばね定数}}}$ です。ここでは台と小物体が一緒に動くので、質量は $M+m=1.0\,\mathrm{kg}$ を使います。`,
          lv: 1
        },
        {
          t: '小物体の運動方程式から垂直抗力を求める（(2)）',
          m: [R`m\,a = N - mg,\qquad a = -\omega^{2}z = -\frac{k}{M+m}\,z`,
              R`N = m(g+a) = m\left(g - \frac{kz}{M+m}\right)`],
          n: R`小物体には、上向きの垂直抗力 $N$ と下向きの重力 $mg$ がはたらきます。小物体の加速度 $a$ は、台と同じ単振動の加速度 $-\omega^{2}z$ です。この式から、$z$ が大きい（高い）ほど $N$ は小さくなることがわかります。`,
          pro: R`$z=0$ で $N=mg$（つり合い）、$z>0$（上側）で $N<mg$。上端で最小になるので、「離れるとしたら振動の最高点付近」と見当がつく。`,
          lv: 1
        },
        {
          t: '離れない条件（(3)）',
          m: R`N \ge 0\ (\text{最高点 } z=A) \;\Longrightarrow\; A \le \frac{(M+m)g}{k} = d = 0.098\,\mathrm{m}`,
          n: R`$N$ は振動の最高点 $z=A$ でもっとも小さくなります。離れない条件は、そこでも $N\ge 0$ です。$N=0$ となる位置は $z=\dfrac{(M+m)g}{k}=d$ で、これは**ばねが自然の長さのとき**の位置です（つり合いの位置から $d$ だけ上）。したがって、振幅が $d$ 以下であれば、台と小物体は離れずに振動します。`,
          easy: R`小物体が台から離れるのは、台が小物体を押す力 $N$ がちょうど $0$ になる瞬間です。このとき小物体は、重力だけを受けて動いています。つまり加速度が $g$（下向き）です。台と小物体は同じ加速度で動くので、台も加速度 $g$ のとき、つまり、ばねの力が $0$（自然の長さ）のときです。`,
          lv: 1
        },
        {
          t: R`振幅 $0.15\,\mathrm{m}$ のとき離れる瞬間の速さ（(4)）`,
          m: [R`z=d:\quad v = \omega\sqrt{A^{2}-d^{2}} = 10\times\sqrt{0.15^{2}-0.098^{2}} \approx 1.14\,\mathrm{m/s}`,
              R`\left(\text{確認:}\ \frac{1}{2}k(A+d)^{2} = \frac{1}{2}(M+m)v^{2} + (M+m)g(A+d)\right)`],
          n: R`$A=0.15\,\mathrm{m}>d$ なので、小物体は $z=d$（ばねが自然の長さ）で台から離れます。単振動の速さの式 $v=\omega\sqrt{A^{2}-z^{2}}$ に $z=d$ を代入しました。力学的エネルギー保存（最下点でばねの縮みは $A+d=0.248\,\mathrm{m}$、自然の長さの位置までに上がる高さも $A+d$）で求めても $v^{2}=\dfrac{k(A+d)^{2}}{M+m}-2g(A+d)=1.29$ となり、一致します。`,
          lv: 1
        },
        {
          t: '離れた後の運動（(5)）',
          m: R`h = \frac{v^{2}}{2g} = \frac{1.29}{2\times 9.8} \approx 0.066\,\mathrm{m}`,
          n: R`離れた後の小物体は、重力だけを受けて鉛直上向きに速さ $v$ で投げ上げられたのと同じ運動をします。台は、ばねが伸びて下向きに引かれるので、小物体より大きな下向きの加速度で動き、2 つは離れていきます。したがって、小物体の最高点は離れた点から $\dfrac{v^{2}}{2g}\approx 0.066\,\mathrm{m}$ 上です。`,
          lv: 1
        }
      ],
      prereq: ['p-shm', 'p-circular', 'p-eom'],
      tags: ['単振動', '離脱条件', '垂直抗力']
    }

  ]);

  /* ---------- 熱量と比熱 ---------- */
  // 電熱線を沈めた熱量計（水 + 容器）
  function figHeaterCalorimeter() {
    const d = D(360, 244);
    d.poly([[110, 124], [250, 124], [250, 196], [110, 196]], { cls: 'c1', fill: 'f1', w: 1 });
    d.path('M108 88 L108 198 L252 198 L252 88', { cls: 'fg', fill: null, w: 2.2 });
    d.battery(140, 52, 220, 52, { label: '14 V' });
    d.wire([[140, 52], [140, 170]]);
    d.wire([[220, 52], [220, 170]]);
    d.resistor(140, 170, 220, 170, { label: '1.4 Ω', lpos: -1 });
    d.text(125, 148, '水', { size: 12 });
    d.text(180, 222, '金属容器（熱容量 C）', { size: 12 });
    d.text(352, 24, '通電時間 100 s', { anchor: 'end' });
    d.text(352, 42, '水の比熱 4.2 J/(g·K)', { anchor: 'end' });
    return d.svg();
  }

  /* ---------- ボイル・シャルルの法則 ---------- */
  // コックでつながれた 2 つの容器
  function figTwoVessels() {
    const d = D(360, 214);
    d.rect(14, 56, 120, 112, { cls: 'c1', fill: 'f1', rx: 4, w: 2 });
    d.rect(216, 36, 130, 152, { cls: 'c2', fill: 'f2', rx: 4, w: 2 });
    d.line(134, 112, 216, 112, { cls: 'fg', w: 2 });
    d.circle(175, 112, 9, { cls: 'fg', fill: 'f0' });
    d.line(168, 119, 182, 105, { cls: 'fg', w: 2 });
    d.text(175, 94, 'コック', { size: 12 });
    d.text(74, 78, 'A', { size: 15, italic: true });
    d.text(74, 104, 'V = 3.0 L', { size: 12 });
    d.text(74, 124, 'T = 300 K', { size: 12 });
    d.text(74, 144, 'p = 1.5×10⁵ Pa', { size: 12 });
    d.text(281, 58, 'B', { size: 15, italic: true });
    d.text(281, 98, 'V = 6.0 L', { size: 12 });
    d.text(281, 118, 'T = 400 K', { size: 12 });
    d.text(281, 138, 'p = 0.50×10⁵ Pa', { size: 12 });
    d.text(180, 204, 'コックを開く前（A, B は同じ種類の理想気体）', { size: 12, cls: 'dim' });
    return d.svg();
  }

  /* ---------- 熱力学第一法則 ---------- */
  // p-V 図: A →（定積）B →（等温）C →（定圧）A
  function figCycle() {
    return G({
      w: 340, h: 250, x: [0, 2.7], y: [0, 2.6], axis: ['V', 'p'], ticks: false, grid: false,
      curves: [{ f: function (v) { return 2 / v; }, domain: [1, 2], cls: 'c2' }],
      segs: [
        { x1: 1, y1: 1, x2: 1, y2: 1.96, cls: 'c1', arrow: true },
        { x1: 1.82, y1: 2 / 1.82, x2: 2, y2: 1, cls: 'c2', arrow: true },
        { x1: 2, y1: 1, x2: 1.04, y2: 1, cls: 'c3', arrow: true }
      ],
      points: [
        { x: 1, y: 1, label: 'A', cls: 'c1', pos: 'bl' },
        { x: 1, y: 2, label: 'B', cls: 'c1', pos: 'tl' },
        { x: 2, y: 1, label: 'C', cls: 'c1', pos: 'br' }
      ],
      hlines: [{ y: 1, label: 'p₀' }, { y: 2, label: '2p₀' }],
      vlines: [{ x: 1, label: 'V₀' }, { x: 2, label: '2V₀' }],
      labels: [
        { x: 1.5, y: 2.3, text: 'B → C: 等温', cls: 'c2' },
        { x: 0.12, y: 1.5, text: '定積', cls: 'c1' },
        { x: 1.25, y: 0.72, text: '定圧', cls: 'c3' }
      ]
    });
  }

  JK.registerProblems([

    /* ---------- 熱量と比熱 ---------- */
    {
      id: 'p-adv-heat-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-heat',
      title: '電熱線による加熱と熱量計',
      source: { univ: 'オリジナル' },
      time: 20,
      body: R`熱容量 $C$ の金属容器に水を入れ、容器の中に抵抗値 $1.4\,\Omega$ の電熱線を沈めて、電圧 $14\,\mathrm{V}$ の直流電源につないだ（図）。電流を流した $100\,\mathrm{s}$ の間に電熱線で発生した熱の一部は空気中に逃げ、残りの割合 $\varepsilon$ が、水と容器の温度上昇に使われる（$\varepsilon$ は一定で、水の量や温度によらないものとする）。水の比熱を $c=4.2\,\mathrm{J/(g\cdot K)}$ とし、電熱線の抵抗値は温度によらず一定とする。水と容器は常に同じ温度であり、はじめの温度は室温に等しい。次の 2 つの実験を行った。
実験 1: 水 $m_{1}=100\,\mathrm{g}$ を入れて $100\,\mathrm{s}$ 通電すると、水温が $\theta_{1}=20.0\,\mathrm{K}$ 上がった。
実験 2: 水 $m_{2}=200\,\mathrm{g}$ を入れて $100\,\mathrm{s}$ 通電すると、水温が $\theta_{2}=12.0\,\mathrm{K}$ 上がった。`,
      fig: figHeaterCalorimeter(),
      parts: [
        { label: '(1)', q: R`$100\,\mathrm{s}$ の間に電熱線で発生する熱量は何 $\mathrm{J}$ か。`, type: 'num', answer: 14000, rel: 0.02, unit: 'J', hint: R`例: 1.5e4` },
        {
          label: '(2)',
          q: R`容器の熱容量 $C$ を $m_{1},\ m_{2},\ \theta_{1},\ \theta_{2},\ c$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{c\,(m_{2}\theta_{2}-m_{1}\theta_{1})}{\theta_{1}-\theta_{2}}$`,
            R`$\dfrac{c\,(m_{2}\theta_{2}-m_{1}\theta_{1})}{\theta_{2}-\theta_{1}}$`,
            R`$\dfrac{c\,(m_{2}\theta_{1}-m_{1}\theta_{2})}{\theta_{1}-\theta_{2}}$`,
            R`$c\,\dfrac{m_{2}\theta_{2}+m_{1}\theta_{1}}{\theta_{1}+\theta_{2}}$`,
            R`$\dfrac{c\,(m_{2}-m_{1})\,\theta_{2}}{\theta_{1}-\theta_{2}}$`
          ],
          answer: 0
        },
        { label: '(3)', q: R`$C$ は何 $\mathrm{J/K}$ か。`, type: 'num', answer: 210, rel: 0.02, unit: 'J/K' },
        { label: '(4)', q: R`$\varepsilon$ はいくらか。`, type: 'num', answer: 0.9, rel: 0.02 },
        { label: '(5)', q: R`水 $300\,\mathrm{g}$ を入れて、水温を $30\,\mathrm{K}$ 上げるには、何 $\mathrm{s}$ 通電する必要があるか。`, type: 'num', answer: 350, rel: 0.02, unit: 's' }
      ],
      solution: [
        {
          t: '電熱線で発生する熱量（(1)）',
          m: [R`P = \frac{V^{2}}{R} = \frac{14^{2}}{1.4} = 140\,\mathrm{W}`,
              R`Q = Pt = 140\times 100 = 1.4\times 10^{4}\,\mathrm{J}`],
          n: R`電熱線で消費される電力は、$P=IV=\dfrac{V^{2}}{R}$ です。電力は「1 秒あたりに発生するジュール熱 [J/s]」なので、時間 $t$ をかけると熱量になります。`,
          easy: R`電熱線にかかる電圧が $V$、抵抗が $R$ のとき、流れる電流は $I=\dfrac{V}{R}$ です（オームの法則）。電力は「電流 × 電圧」なので $P=IV=\dfrac{V^{2}}{R}$ となり、$1$ 秒あたり $140\,\mathrm{J}$ の熱が発生します。$100$ 秒間では $140\times 100=14000\,\mathrm{J}$ です。`,
          lv: 1
        },
        {
          t: '熱のやりとりの式',
          m: R`\varepsilon\,Q = (m\,c + C)\,\theta`,
          n: R`水に入った熱量は $mc\theta$、容器に入った熱量は $C\theta$ です。水と容器は同じ温度だけ上がるので、$\theta$ は共通です。この合計が、熱の利用割合 $\varepsilon$ をかけた $\varepsilon Q$ に等しくなります。`,
          easy: R`**熱容量 $C$** は「その物体の温度を $1\,\mathrm{K}$ 上げるのに必要な熱量」で、単位は $\mathrm{J/K}$ です。水の熱容量は「比熱 $c$ × 質量 $m$」と表せます。容器と水を合わせた熱容量は $mc+C$ で、これに温度上昇 $\theta$ をかけたものが、受けとった熱量です。`,
          lv: 1
        },
        {
          t: '2 つの実験から $C$ を求める（(2)(3)）',
          m: [R`\varepsilon Q = (m_{1}c + C)\,\theta_{1} = (m_{2}c + C)\,\theta_{2}`,
              R`C\,(\theta_{1}-\theta_{2}) = c\,(m_{2}\theta_{2} - m_{1}\theta_{1})`,
              R`C = \frac{c\,(m_{2}\theta_{2}-m_{1}\theta_{1})}{\theta_{1}-\theta_{2}} = \frac{4.2\times(200\times 12.0-100\times 20.0)}{20.0-12.0} = 210\,\mathrm{J/K}`],
          n: R`2 つの実験で、通電時間や電熱線は同じなので、$\varepsilon Q$ は同じ値です。そこで 2 つの式を等しいとおいて、$\varepsilon Q$ を消去します。未知数が $C$ と $\varepsilon$ の 2 つなので、条件を変えた実験が 2 回必要です。`,
          pro: R`「同じ熱量で、水の量を変えると温度上昇が変わる」ことを使って、容器の熱容量を消去するのが定番。比をとらず、連立方程式の形で扱うと、符号を間違えにくい。`,
          lv: 1
        },
        {
          t: '熱の利用割合（(4)）',
          m: R`\varepsilon = \frac{(m_{1}c+C)\,\theta_{1}}{Q} = \frac{(420+210)\times 20.0}{14000} = \frac{12600}{14000} = 0.90`,
          n: R`$m_{1}c=100\times 4.2=420\,\mathrm{J/K}$ です。確認として実験 2 の式に代入すると、$(200\times 4.2+210)\times 12.0=1050\times 12.0=12600\,\mathrm{J}$ となり、実験 1 の $\varepsilon Q=12600\,\mathrm{J}$ と一致します。つまり、発生した熱の 90% が水と容器に伝わり、10% は空気に逃げました。`,
          lv: 1
        },
        {
          t: R`水 $300\,\mathrm{g}$ を $30\,\mathrm{K}$ 上げる時間（(5)）`,
          m: [R`\varepsilon P\,t = (m c + C)\,\theta`,
              R`t = \frac{(300\times 4.2+210)\times 30}{0.90\times 140} = \frac{44100}{126} = 350\,\mathrm{s}`],
          n: R`通電時間を $t$ とすると、発生する熱量は $Pt$、そのうち使われるのは $\varepsilon Pt$ です。これを、水と容器が必要とする熱量 $(mc+C)\theta$ に等しいとおきます。$\varepsilon$ と $C$ は水の量によらず一定なので、実験 1, 2 で求めた値をそのまま使えます。`,
          lv: 1
        }
      ],
      prereq: ['p-heat', 'p-circuit', 'p-ohm0'],
      tags: ['熱容量', 'ジュール熱', '熱量計', '連立方程式']
    },

    /* ---------- ボイル・シャルルの法則 ---------- */
    {
      id: 'p-adv-gas-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-gas',
      title: 'コックでつないだ 2 容器の気体',
      source: { univ: 'オリジナル' },
      time: 20,
      body: R`図のように、体積 $V_{\mathrm{A}}=3.0\,\mathrm{L}$ の容器 A と、体積 $V_{\mathrm{B}}=6.0\,\mathrm{L}$ の容器 B が、コックのついた細い管でつながれている。コックは初め閉じられていて、A には温度 $T_{\mathrm{A}}=300\,\mathrm{K}$、圧力 $p_{\mathrm{A}}=1.5\times 10^{5}\,\mathrm{Pa}$ の理想気体が、B には同じ種類の理想気体が温度 $T_{\mathrm{B}}=400\,\mathrm{K}$、圧力 $p_{\mathrm{B}}=0.50\times 10^{5}\,\mathrm{Pa}$ で入っている。コックを開いた後も、A, B の温度はそれぞれ $T_{\mathrm{A}},\ T_{\mathrm{B}}$ に保たれる。管の体積は無視でき、気体定数を $R=8.31\,\mathrm{J/(mol\cdot K)}$、$1\,\mathrm{L}=1.0\times 10^{-3}\,\mathrm{m^{3}}$ とする。`,
      fig: figTwoVessels(),
      parts: [
        { label: '(1)', q: R`コックを開く前に、A に入っている気体の物質量は何 $\mathrm{mol}$ か。`, type: 'num', answer: 0.1805, rel: 0.02, unit: 'mol' },
        {
          label: '(2)',
          q: R`コックを開いて十分に時間がたったとき、A, B の気体の圧力は等しくなる。その圧力 $p$ を、$p_{\mathrm{A}},\ p_{\mathrm{B}},\ V_{\mathrm{A}},\ V_{\mathrm{B}},\ T_{\mathrm{A}},\ T_{\mathrm{B}}$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{p_{\mathrm{A}}+p_{\mathrm{B}}}{2}$`,
            R`$\dfrac{p_{\mathrm{A}}V_{\mathrm{A}}+p_{\mathrm{B}}V_{\mathrm{B}}}{V_{\mathrm{A}}+V_{\mathrm{B}}}$`,
            R`$\dfrac{p_{\mathrm{A}}V_{\mathrm{A}}T_{\mathrm{A}}+p_{\mathrm{B}}V_{\mathrm{B}}T_{\mathrm{B}}}{V_{\mathrm{A}}T_{\mathrm{A}}+V_{\mathrm{B}}T_{\mathrm{B}}}$`,
            R`$\dfrac{p_{\mathrm{A}}V_{\mathrm{A}}/T_{\mathrm{A}}+p_{\mathrm{B}}V_{\mathrm{B}}/T_{\mathrm{B}}}{V_{\mathrm{A}}/T_{\mathrm{A}}+V_{\mathrm{B}}/T_{\mathrm{B}}}$`,
            R`$\dfrac{p_{\mathrm{A}}T_{\mathrm{B}}+p_{\mathrm{B}}T_{\mathrm{A}}}{T_{\mathrm{A}}+T_{\mathrm{B}}}$`
          ],
          answer: 3
        },
        { label: '(3)', q: R`$p$ は何 $\mathrm{Pa}$ か。`, type: 'num', answer: 90000, rel: 0.02, unit: 'Pa', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(4)', q: R`コックを開いた後、A から B へ移動した気体の物質量は何 $\mathrm{mol}$ か。`, type: 'num', answer: 0.0722, rel: 0.02, unit: 'mol' },
        { label: '(5)', q: R`コックを開いたまま、B の温度だけを $500\,\mathrm{K}$ に上げて、十分に時間がたった。A の温度は $300\,\mathrm{K}$ のままである。このときの圧力は何 $\mathrm{Pa}$ か。`, type: 'num', answer: 102273, rel: 0.02, unit: 'Pa', hint: R`例: 1.0e5` }
      ],
      solution: [
        {
          t: '状態方程式で物質量を表す（(1)）',
          m: R`pV = nRT \;\Longrightarrow\; n_{\mathrm{A}} = \frac{p_{\mathrm{A}}V_{\mathrm{A}}}{RT_{\mathrm{A}}} = \frac{1.5\times 10^{5}\times 3.0\times 10^{-3}}{8.31\times 300} = \frac{450}{2493} \approx 0.181\,\mathrm{mol}`,
          n: R`体積は $\mathrm{L}$ から $\mathrm{m^{3}}$ に直します（$3.0\,\mathrm{L}=3.0\times 10^{-3}\,\mathrm{m^{3}}$）。B の物質量は $n_{\mathrm{B}}=\dfrac{0.50\times 10^{5}\times 6.0\times 10^{-3}}{8.31\times 400}\approx 0.0903\,\mathrm{mol}$ です。`,
          easy: R`気体の状態方程式 $pV=nRT$ は、「圧力 × 体積」が「物質量 × 気体定数 × 絶対温度」に等しいという関係です。圧力・体積・温度がわかれば、気体の量（物質量）が求まります。圧力は $\mathrm{Pa}$、体積は $\mathrm{m^{3}}$、温度は $\mathrm{K}$ で入れます。`,
          lv: 1
        },
        {
          t: 'コックを開いた後の条件',
          m: [R`n_{\mathrm{A}}' = \frac{pV_{\mathrm{A}}}{RT_{\mathrm{A}}},\qquad n_{\mathrm{B}}' = \frac{pV_{\mathrm{B}}}{RT_{\mathrm{B}}}`,
              R`n_{\mathrm{A}}' + n_{\mathrm{B}}' = n_{\mathrm{A}} + n_{\mathrm{B}}`],
          n: R`コックを開くと、気体は圧力の高いほうから低いほうへ流れ、十分に時間がたつと A, B の圧力は共通の値 $p$ になります。気体は外へ逃げないので、A, B 合計の物質量は変わりません。温度は A, B で異なるまま保たれるので、$T_{\mathrm{A}}$ と $T_{\mathrm{B}}$ のままで、それぞれの状態方程式を立てます。`,
          lv: 1
        },
        {
          t: '圧力 $p$（(2)(3)）',
          m: [R`\frac{p}{R}\left(\frac{V_{\mathrm{A}}}{T_{\mathrm{A}}}+\frac{V_{\mathrm{B}}}{T_{\mathrm{B}}}\right) = \frac{1}{R}\left(\frac{p_{\mathrm{A}}V_{\mathrm{A}}}{T_{\mathrm{A}}}+\frac{p_{\mathrm{B}}V_{\mathrm{B}}}{T_{\mathrm{B}}}\right)`,
              R`p = \frac{p_{\mathrm{A}}V_{\mathrm{A}}/T_{\mathrm{A}}+p_{\mathrm{B}}V_{\mathrm{B}}/T_{\mathrm{B}}}{V_{\mathrm{A}}/T_{\mathrm{A}}+V_{\mathrm{B}}/T_{\mathrm{B}}} = \frac{1.5\times 10^{5}\times 0.010+0.50\times 10^{5}\times 0.015}{0.010+0.015} = 0.90\times 10^{5}\,\mathrm{Pa}`],
          n: R`$\dfrac{V_{\mathrm{A}}}{T_{\mathrm{A}}}=\dfrac{3.0}{300}=0.010$、$\dfrac{V_{\mathrm{B}}}{T_{\mathrm{B}}}=\dfrac{6.0}{400}=0.015$（単位は $\mathrm{L/K}$）です。式の形は、$p_{\mathrm{A}}$ と $p_{\mathrm{B}}$ の**重みつき平均**で、重みは $\dfrac{V}{T}$ です。体積が大きく、温度が低い容器ほど、たくさんの気体が入ることができるからです。`,
          easy: R`同じ圧力のとき、容器に入る気体の量は $\dfrac{V}{T}$ に比例します（$n=\dfrac{p}{R}\cdot\dfrac{V}{T}$ より）。コックを開くと、A, B の気体が混ざって共通の圧力 $p$ になります。「全部の気体の量」は変わらないので、「圧力 × $\dfrac{V}{T}$」を A と B で足した値が、はじめと終わりで等しくなります。`,
          pro: R`重みつき平均の形に気づくと速い。$T_{\mathrm{A}}=T_{\mathrm{B}}$ なら $\dfrac{p_{\mathrm{A}}V_{\mathrm{A}}+p_{\mathrm{B}}V_{\mathrm{B}}}{V_{\mathrm{A}}+V_{\mathrm{B}}}$（ボイルの法則）、$V_{\mathrm{A}}/T_{\mathrm{A}}=V_{\mathrm{B}}/T_{\mathrm{B}}$ なら単純平均、と両方の極限が出る。`,
          lv: 1
        },
        {
          t: '移動した物質量（(4)）',
          m: R`n_{\mathrm{A}}-n_{\mathrm{A}}' = \frac{(p_{\mathrm{A}}-p)\,V_{\mathrm{A}}}{RT_{\mathrm{A}}} = \frac{(1.5-0.90)\times 10^{5}\times 3.0\times 10^{-3}}{8.31\times 300} = \frac{180}{2493} \approx 0.0722\,\mathrm{mol}`,
          n: R`A の気体は、はじめ $0.181\,\mathrm{mol}$ でしたが、コックを開いた後は圧力が $0.90\times 10^{5}\,\mathrm{Pa}$ になるので $\dfrac{0.90\times 10^{5}\times 3.0\times 10^{-3}}{8.31\times 300}\approx 0.108\,\mathrm{mol}$ になります。その差が B へ移動した量です。B は $0.0903+0.0722\approx 0.1625\,\mathrm{mol}$ に増えており、確かに $\dfrac{pV_{\mathrm{B}}}{RT_{\mathrm{B}}}=\dfrac{0.90\times 10^{5}\times 6.0\times 10^{-3}}{8.31\times 400}\approx 0.1625\,\mathrm{mol}$ と一致します。`,
          lv: 2
        },
        {
          t: 'B の温度を上げた場合（(5)）',
          m: R`p' = \frac{p_{\mathrm{A}}V_{\mathrm{A}}/T_{\mathrm{A}}+p_{\mathrm{B}}V_{\mathrm{B}}/T_{\mathrm{B}}}{V_{\mathrm{A}}/T_{\mathrm{A}}+V_{\mathrm{B}}/T_{\mathrm{B}}'} = \frac{1500+750}{0.010+0.012} \approx 1.02\times 10^{5}\,\mathrm{Pa}`,
          n: R`全部の物質量は変わらず、$T_{\mathrm{B}}'=500\,\mathrm{K}$ なので、B 側の重みが $\dfrac{6.0}{500}=0.012$ に変わります。分子は、はじめの物質量の合計に当たる $p_{\mathrm{A}}V_{\mathrm{A}}/T_{\mathrm{A}}+p_{\mathrm{B}}V_{\mathrm{B}}/T_{\mathrm{B}}=1.5\times 10^{5}\times 0.010+0.50\times 10^{5}\times 0.015=2250\ (\mathrm{Pa\cdot L/K})$ のままです。B を温めると、気体が膨張して圧力が上がり、A のほうへ気体が押し出されて、圧力は $0.90\times 10^{5}$ より大きくなります。`,
          lv: 1
        }
      ],
      prereq: ['p-gas', 'p-math0'],
      tags: ['状態方程式', '物質量保存', '重みつき平均']
    },

    /* ---------- 熱力学第一法則 ---------- */
    {
      id: 'p-adv-thermo1-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-thermo1',
      title: '等温変化をふくむ熱サイクル',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`単原子分子の理想気体 $n$ [mol] を、なめらかに動くピストンのついたシリンダーに入れ、状態 A → B → C → A とゆっくり変化させる。状態 A の圧力は $p_{0}$、体積は $V_{0}$、温度は $T_{0}$ である。A → B は体積を一定にして加熱し、圧力を $2p_{0}$ にする変化、B → C は温度を一定にして体積を $2V_{0}$ まで膨張させる変化、C → A は圧力を一定にして体積を $V_{0}$ まで圧縮する変化である（図は $p$-$V$ 図）。気体定数を $R$ とし、内部エネルギーは $U=\dfrac{3}{2}nRT$ で表される。必要なら $\ln 2=0.693$ を用いよ。数値を求める設問では、$p_{0}=1.0\times 10^{5}\,\mathrm{Pa}$、$V_{0}=2.0\times 10^{-3}\,\mathrm{m^{3}}$ とする。`,
      fig: figCycle(),
      parts: [
        {
          label: '(1)',
          q: R`B → C の変化で、気体が吸収する熱量 $Q_{\mathrm{BC}}$ を $p_{0},\ V_{0}$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$p_{0}V_{0}\ln 2$`,
            R`$2p_{0}V_{0}$`,
            R`$\dfrac{3}{2}p_{0}V_{0}$`,
            R`$4p_{0}V_{0}\ln 2$`,
            R`$2p_{0}V_{0}\ln 2$`
          ],
          answer: 4
        },
        { label: '(2)', q: R`1 サイクルの間に、気体が外部にした正味の仕事は何 $\mathrm{J}$ か。`, type: 'num', answer: 77.2, rel: 0.02, unit: 'J' },
        { label: '(3)', q: R`1 サイクルの間に、気体が吸収する熱量の合計は何 $\mathrm{J}$ か。`, type: 'num', answer: 577, rel: 0.02, unit: 'J' },
        { label: '(4)', q: R`このサイクルの熱効率はいくらか。`, type: 'num', answer: 0.134, rel: 0.02 },
        { label: '(5)', q: R`このサイクルの最高温度と最低温度の間ではたらく、理想的な熱機関（カルノーサイクル）の熱効率はいくらか。`, type: 'num', answer: 0.5, rel: 0.02 }
      ],
      solution: [
        {
          t: '3 つの状態の温度',
          m: R`pV = nRT:\quad T_{\mathrm{A}}=T_{0},\qquad T_{\mathrm{B}}=\frac{2p_{0}V_{0}}{nR}=2T_{0},\qquad T_{\mathrm{C}}=\frac{p_{0}\cdot 2V_{0}}{nR}=2T_{0}`,
          n: R`A の温度は $T_{0}=\dfrac{p_{0}V_{0}}{nR}$ です。B は圧力が $2$ 倍なので温度も $2$ 倍。C は体積が $2$ 倍なので温度が $2$ 倍で、B と C は同じ温度（$B\to C$ が等温変化）になっています。`,
          lv: 1
        },
        {
          t: 'A → B（定積変化）',
          m: [R`W_{\mathrm{AB}} = 0`,
              R`Q_{\mathrm{AB}} = \Delta U_{\mathrm{AB}} = \frac{3}{2}nR\,(2T_{0}-T_{0}) = \frac{3}{2}p_{0}V_{0}`],
          n: R`体積が変わらないので、気体は仕事をしません。熱力学第一法則 $Q=\Delta U+W$ から、吸収した熱量はすべて内部エネルギーの増加になります。`,
          easy: R`熱力学第一法則は「気体がもらった熱 $Q$ ＝ 内部エネルギーの増加 $\Delta U$ ＋ 気体が外へした仕事 $W$」です。体積が変わらないとき、気体は押し広げる動きをしないので、$W=0$ です。もらった熱は、全部、気体の温度を上げる（$\Delta U$ になる）のに使われます。`,
          lv: 1
        },
        {
          t: 'B → C（等温変化）（(1)）',
          m: [R`\Delta U_{\mathrm{BC}} = 0`,
              R`Q_{\mathrm{BC}} = W_{\mathrm{BC}} = nR(2T_{0})\ln\frac{2V_{0}}{V_{0}} = 2p_{0}V_{0}\ln 2 \approx 1.386\,p_{0}V_{0}`],
          n: R`温度が変わらないので内部エネルギーは変化せず、吸収した熱量はすべて、気体が外にする仕事になります。等温変化の仕事は $W=nRT\ln\dfrac{V_{\text{後}}}{V_{\text{前}}}$ で、$nR\cdot 2T_{0}=2p_{0}V_{0}$ です。（$p$-$V$ 図で曲線 $p=\dfrac{2p_{0}V_{0}}{V}$ の下の面積です。）`,
          pro: R`等温変化の仕事は $nRT\ln\dfrac{V_{2}}{V_{1}}$（面積の積分）。ここでは $nRT=pV$ を使って $p_{0}V_{0}$ の形に直す。`,
          lv: 1
        },
        {
          t: 'C → A（定圧変化）',
          m: [R`W_{\mathrm{CA}} = p_{0}\,(V_{0}-2V_{0}) = -p_{0}V_{0}`,
              R`\Delta U_{\mathrm{CA}} = \frac{3}{2}nR\,(T_{0}-2T_{0}) = -\frac{3}{2}p_{0}V_{0}`,
              R`Q_{\mathrm{CA}} = \Delta U_{\mathrm{CA}} + W_{\mathrm{CA}} = -\frac{5}{2}p_{0}V_{0}`],
          n: R`圧縮されるので、気体がした仕事は負（外から仕事をされている）です。$Q_{\mathrm{CA}}<0$ は、気体が熱を $\dfrac{5}{2}p_{0}V_{0}$ だけ**放出**することを表します。`,
          lv: 1
        },
        {
          t: '正味の仕事と吸収する熱量（(2)(3)）',
          m: [R`W = W_{\mathrm{AB}}+W_{\mathrm{BC}}+W_{\mathrm{CA}} = (2\ln 2-1)\,p_{0}V_{0} = (1.386-1)\times 200 \approx 77.2\,\mathrm{J}`,
              R`Q_{\mathrm{in}} = Q_{\mathrm{AB}}+Q_{\mathrm{BC}} = \left(\frac{3}{2}+2\ln 2\right)p_{0}V_{0} = 2.886\times 200 \approx 577\,\mathrm{J}`],
          n: R`$p_{0}V_{0}=1.0\times 10^{5}\times 2.0\times 10^{-3}=200\,\mathrm{J}$ です。熱を吸収するのは A → B と B → C の 2 つの過程で、C → A では放熱します。1 サイクルでは内部エネルギーはもとにもどるので、$Q_{\mathrm{in}}-|Q_{\mathrm{out}}|=W$ が成り立ちます。確認すると、$2.886-2.5=0.386=2\ln 2-1$ です。`,
          easy: R`1 サイクルして元の状態にもどると、内部エネルギーはもとの値にもどるので、「もらった熱の合計 ＝ した仕事の合計」です。もらった熱は $\dfrac{3}{2}p_{0}V_{0}+1.386\,p_{0}V_{0}$、捨てた熱は $2.5\,p_{0}V_{0}$ なので、差し引きの $0.386\,p_{0}V_{0}$ が、1 サイクルの仕事になります。`,
          lv: 1
        },
        {
          t: '熱効率とカルノー効率（(4)(5)）',
          m: [R`e = \frac{W}{Q_{\mathrm{in}}} = \frac{2\ln 2-1}{\dfrac{3}{2}+2\ln 2} = \frac{0.386}{2.886} \approx 0.134`,
              R`e_{\text{Carnot}} = 1-\frac{T_{\text{低}}}{T_{\text{高}}} = 1-\frac{T_{0}}{2T_{0}} = 0.50`],
          n: R`熱効率は「吸収した熱のうち、仕事に変わった割合」です。このサイクルの効率 $13\%$ は、同じ最高温度・最低温度のカルノーサイクルの効率 $50\%$ よりずっと小さくなります。これは、熱の出入りが最高温度・最低温度でだけ行われているわけではないからです（A → B では $T_{0}$ から $2T_{0}$ にかけて、C → A では $2T_{0}$ から $T_{0}$ にかけて、温度を変えながら熱の出入りがあります）。`,
          pro: R`どんな熱機関でも、$e\le 1-\dfrac{T_{\text{低}}}{T_{\text{高}}}$。サイクル中の最高温度・最低温度でカルノー効率を見積もると、答えのチェックになる。`,
          lv: 1
        }
      ],
      prereq: ['p-thermo1', 'p-gas', 'p-energy'],
      tags: ['熱力学第一法則', '熱サイクル', '等温変化', '熱効率']
    }

  ]);

  /* ---------- 波の性質 ---------- */
  // 固定端 x = L で反射してできる定常波（ある瞬間の波形と、振幅の包絡線）
  function figStanding() {
    const L = 3.1, lam = 1.2, A = 2.0;
    const env = function (x) { return 2 * A * Math.abs(Math.sin(2 * PI * (L - x) / lam)); };
    return G({
      w: 350, h: 240, x: [0, 3.6], y: [-5, 5], axis: ['x [m]', 'y [cm]'],
      curves: [
        { f: env, cls: 'dim', dash: true, domain: [0, L] },
        { f: function (x) { return -env(x); }, cls: 'dim', dash: true, domain: [0, L] },
        { f: function (x) { return 2 * A * Math.sin(2 * PI * (L - x) / lam); }, cls: 'c1', domain: [0, L] }
      ],
      vlines: [{ x: L, label: '固定端', dash: false, cls: 'fg' }],
      points: [
        { x: L - lam / 4, y: 2 * A, label: '腹', cls: 'c3', pos: 'tl' },
        { x: L - lam / 2, y: 0, label: '節', cls: 'c4', pos: 'tl' }
      ],
      labels: [{ x: 0.1, y: -4.5, text: '実線: ある瞬間の定常波　破線: 振幅の範囲', cls: 'c1' }]
    });
  }

  /* ---------- ドップラー効果 ---------- */
  // 探触子・血管・赤血球（赤血球から探触子へ向かう向きと血流の向きがなす角が θ）
  function figDopplerBlood() {
    const d = D(360, 244);
    const Px = 62, Py = 196, Cx = 236, Cy = 120;
    const th = 60;
    const phiE = Math.atan2(-(Py - Cy), Px - Cx) * 180 / PI;       // 赤血球 → 探触子 の向き（数学の角度）
    const phiF = phiE - th;                                         // 血流の向き
    const fs = [Math.cos(phiF * PI / 180), -Math.sin(phiF * PI / 180)];   // 画面座標の単位ベクトル
    const ns = [-fs[1], fs[0]];
    [-1, 1].forEach(function (sg) {
      d.line(Cx - 130 * fs[0] + sg * 40 * ns[0], Cy - 130 * fs[1] + sg * 40 * ns[1],
        Cx + 130 * fs[0] + sg * 40 * ns[0], Cy + 130 * fs[1] + sg * 40 * ns[1], { cls: 'fg', w: 2 });
    });
    d.line(Px, Py, Cx, Cy, { cls: 'c1', dash: true, w: 1.5 });
    d.rect(Px - 30, Py - 12, 36, 26, { cls: 'fg', fill: 'f1', rx: 3 });
    d.text(Px - 12, Py + 32, '探触子', { size: 12 });
    d.circle(Cx, Cy, 9, { cls: 'c2', fill: 'f2' });
    d.text(Cx + 16, Cy + 26, '赤血球', { size: 12, anchor: 'start' });
    d.arrow(Cx, Cy, Cx + 58 * fs[0], Cy + 58 * fs[1], { cls: 'c3' });
    d.text(Cx + 58 * fs[0] - 12, Cy + 58 * fs[1] - 2, 'u', { cls: 'c3', italic: true, size: 13 });
    d.angle(Cx, Cy, 36, phiF, phiE, 'θ', { cls: 'c3' });
    d.text(352, 24, 'f₀ = 5.0×10⁶ Hz', { anchor: 'end' });
    d.text(352, 42, 'V = 1.5×10³ m/s', { anchor: 'end' });
    d.text(352, 60, 'θ = 60°', { anchor: 'end' });
    return d.svg();
  }

  /* ---------- 光の干渉 ---------- */
  // ニュートンリングの装置（断面）と、真上から見た同心円状の縞
  function figNewton() {
    const d = D(360, 240);
    const cx = 168, topY = 98, plateY = 190;
    d.rect(24, plateY, 288, 22, { cls: 'fg', fill: 'f0' });
    d.hatch(24, plateY + 22, 312, plateY + 22);
    d.path('M' + (cx - 90) + ' ' + topY + ' L' + (cx + 90) + ' ' + topY + ' L' + (cx + 90) + ' ' + (plateY - 14) +
      ' A296 296 0 0 1 ' + (cx - 90) + ' ' + (plateY - 14) + ' Z', { cls: 'c1', fill: 'f1' });
    d.text(cx, 134, '平凸レンズ  n₁ = 1.50', { size: 12 });
    d.text(cx, 154, '曲率半径 R = 0.60 m', { size: 12 });
    d.text(cx - 14, plateY + 16, 'ガラス板  n₂ = 1.70', { size: 12, anchor: 'end' });
    [-60, 0, 60].forEach(function (dx) { d.arrow(cx + dx, 30, cx + dx, 88, { cls: 'c3', w: 1.6 }); });
    d.text(cx, 20, '単色光（波長 λ = 6.0×10⁻⁷ m）', { size: 12 });
    d.dot(cx, plateY, { cls: 'fg', r: 3 });
    d.line(cx, plateY + 3, cx + 14, plateY + 30, { cls: 'dim', w: 1 });
    d.text(cx + 20, plateY + 40, 'O（接点）', { italic: false, size: 12, anchor: 'start' });
    // 真上から見た縞
    const px = 318, py = 70;
    [34, 27, 21, 15, 9].forEach(function (rr, i) {
      d.circle(px, py, rr, { cls: i % 2 === 0 ? 'c1' : 'dim', fill: i % 2 === 0 ? 'f1' : null, w: 1 });
    });
    d.text(px, py + 52, '真上から', { size: 11, cls: 'dim' });
    d.text(px, py + 66, '見た縞', { size: 11, cls: 'dim' });
    return d.svg();
  }

  /* ---------- 静電気（電場と電位） ---------- */
  // 2 つの正の点電荷（+4Q, +Q）の間の電位 V(x)（単位は kQ/d）
  function figPotential() {
    const V = function (x) { return 4 / x + 1 / (1 - x); };
    return G({
      w: 350, h: 240, x: [-0.12, 1.12], y: [0, 26], axis: ['x/d', 'V [kQ/d]'], ticks: false, grid: false,
      curves: [{ f: V, cls: 'c1', domain: [0.12, 0.93] }],
      vlines: [{ x: 0, label: '+4Q', dash: false, cls: 'fg' }, { x: 1, label: '+Q', dash: false, cls: 'fg' }],
      hlines: [{ y: 9, dash: true }],
      points: [{ x: 2 / 3, y: 9, label: 'x₀ = 2d/3', cls: 'c3', pos: 'br' }],
      labels: [{ x: 0.3, y: 22, text: '電位 V(x)', cls: 'c1' }]
    });
  }

  JK.registerProblems([

    /* ---------- 波の性質 ---------- */
    {
      id: 'p-adv-wave-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-wave',
      title: '固定端で反射する波と定常波',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`$x$ 軸にそって張られた十分に長い弦の、$x\le L$ の部分を、正弦波が $x$ 軸の正の向きに進んでいる。$x=L$ は弦の固定端であり、波はここで反射する。入射波の、位置 $x$、時刻 $t$ における弦の変位は $y_{1}=A\sin 2\pi\left(\dfrac{t}{T}-\dfrac{x}{\lambda}\right)$ と表され、$A=2.0\,\mathrm{cm}$、$T=0.40\,\mathrm{s}$、$\lambda=1.2\,\mathrm{m}$、$L=3.1\,\mathrm{m}$ である。反射による振幅の減衰はなく、入射波と反射波が重なって、定常波ができる。`,
      fig: figStanding(),
      parts: [
        { label: '(1)', q: R`入射波の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 3, rel: 0.02, unit: 'm/s' },
        {
          label: '(2)',
          q: R`反射波の変位 $y_{2}$ を $A,\ T,\ \lambda,\ L,\ x,\ t$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$A\sin\left[2\pi\left(\dfrac{t}{T}+\dfrac{x}{\lambda}\right)\right]$`,
            R`$A\sin\left[2\pi\left(\dfrac{t}{T}+\dfrac{x-2L}{\lambda}\right)\right]$`,
            R`$-A\sin\left[2\pi\left(\dfrac{t}{T}+\dfrac{x-L}{\lambda}\right)\right]$`,
            R`$-A\sin\left[2\pi\left(\dfrac{t}{T}+\dfrac{x-2L}{\lambda}\right)\right]$`,
            R`$-A\sin\left[2\pi\left(\dfrac{t}{T}-\dfrac{x-2L}{\lambda}\right)\right]$`,
            R`$-A\sin\left[2\pi\left(\dfrac{t}{T}+\dfrac{x+2L}{\lambda}\right)\right]$`
          ],
          answer: 3
        },
        {
          label: '(3)',
          q: R`入射波と反射波が重なってできる定常波の、位置 $x$ での振幅 $a(x)$（$a\ge 0$）を $A,\ \lambda,\ L,\ x$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$2A\left|\sin\left(\dfrac{2\pi x}{\lambda}\right)\right|$`,
            R`$2A\left|\cos\left(\dfrac{2\pi x}{\lambda}\right)\right|$`,
            R`$2A\left|\cos\left(\dfrac{2\pi(L-x)}{\lambda}\right)\right|$`,
            R`$2A\left|\sin\left(\dfrac{2\pi(L-x)}{\lambda}\right)\right|$`,
            R`$2A$`
          ],
          answer: 3
        },
        { label: '(4)', q: R`$0\le x<L$ の範囲にある、定常波の節の数はいくつか。（固定端 $x=L$ は数えない。）`, type: 'num', answer: 5, rel: 0.02, hint: R`整数で答える` },
        { label: '(5)', q: R`定常波の腹の位置にある弦の各点は、単振動をする。その速さの最大値は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 0.628, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        {
          t: '波の速さ（(1)）',
          m: R`v = f\lambda = \frac{\lambda}{T} = \frac{1.2}{0.40} = 3.0\,\mathrm{m/s}`,
          n: R`振動数は $f=\dfrac{1}{T}$ なので、波の基本式 $v=f\lambda$ から $v=\dfrac{\lambda}{T}$ です。`,
          lv: 1
        },
        {
          t: '固定端での反射のしくみ',
          n: R`固定端では弦が動けないので、その点では入射波と反射波の変位が常に打ち消しあい、$y_{1}+y_{2}=0$ になります。つまり、反射波は「壁の位置で、入射波と**符号が逆の変位**になる波」です（位相が $\pi$ ずれる）。また、反射波は $x$ 軸の負の向き（$x$ が小さい向き）に進みます。`,
          easy: R`ひもの端を壁にしっかり固定して波を送ると、波は壁にぶつかって、山は谷に、谷は山に反転して戻ってきます。これが「固定端反射」で、波の位相が半波長ぶん（$\pi$）ずれます。壁の位置では、行きと帰りの波が必ず打ち消しあって、ひもが動きません。`,
          lv: 1
        },
        {
          t: '反射波の式（(2)）',
          m: [R`y_{2}(x,t) = -\,y_{1}\!\left(L,\ t-\frac{L-x}{v}\right)`,
              R`y_{2} = -A\sin 2\pi\left\{\frac{1}{T}\left(t-\frac{L-x}{v}\right)-\frac{L}{\lambda}\right\} = -A\sin 2\pi\left(\frac{t}{T}+\frac{x-2L}{\lambda}\right)`],
          n: R`位置 $x$、時刻 $t$ の反射波は、壁 $x=L$ を、時間 $\dfrac{L-x}{v}$ だけ前に出発した波です。壁で入射波の変位の符号が逆になるので、$y_{1}(L,\,t')$ の符号を変えたものを $t'=t-\dfrac{L-x}{v}$ で使います。計算では $\dfrac{1}{vT}=\dfrac{1}{\lambda}$ を使いました。時間が進むと位相が $+\dfrac{2\pi t}{T}$ で増え、位置が大きくなると位相も増える形（$t/T + x/\lambda$）は、波が $x$ の負の向きに進むことを表しています。`,
          pro: R`確認は 2 つ。（i）$x=L$ で $y_{1}+y_{2}=0$ になること。（ii）$\dfrac{t}{T}$ と $\dfrac{x}{\lambda}$ の符号が同じ（$+$）で、負の向きに進む波になっていること。`,
          lv: 1
        },
        {
          t: '合成波と振幅（(3)）',
          m: [R`y = y_{1}+y_{2} = 2A\sin\!\left\{\frac{2\pi(L-x)}{\lambda}\right\}\cos\!\left\{2\pi\left(\frac{t}{T}-\frac{L}{\lambda}\right)\right\}`,
              R`a(x) = 2A\left|\sin\frac{2\pi(L-x)}{\lambda}\right|`],
          n: R`$\sin\alpha-\sin\beta=2\cos\dfrac{\alpha+\beta}{2}\sin\dfrac{\alpha-\beta}{2}$ を使って 2 つの波をたします。位置だけの関数 $\sin\dfrac{2\pi(L-x)}{\lambda}$ と、時間だけの関数 $\cos 2\pi\left(\dfrac{t}{T}-\dfrac{L}{\lambda}\right)$ の積になるので、進行しない波（定常波）です。$x=L$ では $\sin 0=0$ で、固定端が節になっています。`,
          easy: R`定常波では、位置によって決まる「振れ幅（振幅）」が $2A\left|\sin\dfrac{2\pi(L-x)}{\lambda}\right|$ で、各点がその振れ幅で上下に振動するだけです。壁（$x=L$）からの距離 $L-x$ が $0$ のとき振幅は $0$（節）、$\dfrac{\lambda}{4}$ のとき最大（腹）です。`,
          lv: 1
        },
        {
          t: '節の位置と数（(4)）',
          m: [R`\frac{2\pi(L-x)}{\lambda} = n\pi \;\Longrightarrow\; x = L-\frac{n\lambda}{2} = 3.1-0.60\,n`,
              R`x = 2.5,\ 1.9,\ 1.3,\ 0.7,\ 0.1\ \mathrm{m}\quad(n=1,2,3,4,5)`],
          n: R`節は、$\sin\dfrac{2\pi(L-x)}{\lambda}=0$ となる位置で、固定端から半波長 $\dfrac{\lambda}{2}=0.60\,\mathrm{m}$ ごとに並びます。$n=6$ では $x=-0.5\,\mathrm{m}$ で範囲の外です。$0\le x<L$ にある節は $n=1,\ 2,\ 3,\ 4,\ 5$ の **5 個**です。（腹は、節と節の真ん中で、$x=2.8,\ 2.2,\ 1.6,\ 1.0,\ 0.4\,\mathrm{m}$ です。）`,
          lv: 1
        },
        {
          t: '腹の振動の最大の速さ（(5)）',
          m: R`v_{\max} = (2A)\,\omega = 2A\cdot\frac{2\pi}{T} = 2\times 0.020\times\frac{2\pi}{0.40} \approx 0.628\,\mathrm{m/s}`,
          n: R`腹では、振幅が $2A=4.0\,\mathrm{cm}$ の単振動（周期 $T=0.40\,\mathrm{s}$）をします。単振動の速さの最大値は $A'\omega$（$A'$ は振幅）です。波の進む速さ $3.0\,\mathrm{m/s}$ とは別の量であることに注意しましょう。`,
          easy: R`「波が進む速さ」と「弦の各点が上下に動く速さ」は別のものです。弦の 1 点は、ただ上下に単振動をしていて、振幅が $A'$、角振動数が $\omega=\dfrac{2\pi}{T}$ なら、中心を通るときの速さが最大で、その値は $A'\omega$ です。`,
          lv: 1
        }
      ],
      prereq: ['p-wave', 'p-math0'],
      tags: ['固定端反射', '定常波', '波の式', '位相']
    },

    /* ---------- ドップラー効果 ---------- */
    {
      id: 'p-adv-doppler-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-doppler',
      title: '超音波ドップラー血流計',
      source: { univ: 'オリジナル' },
      time: 20,
      body: R`静止した探触子（超音波の送受信器）から、振動数 $f_{0}=5.0\times 10^{6}\,\mathrm{Hz}$ の超音波を、血管の中を流れる血液にむけて発射し、赤血球で反射されてもどってきた超音波を、同じ探触子で受信する。赤血球は、血管にそって一定の速さ $u$ で運動している。赤血球から探触子へ向かう向きと、赤血球の速度の向きがなす角を $\theta=60\degree$ とする（図）。組織の中の超音波の速さを $V=1.5\times 10^{3}\,\mathrm{m/s}$ とする。探触子と組織は静止している。赤血球は、超音波を受けとる「動く観測者」であり、それを反射して再び出す「動く音源」でもあると考える。`,
      fig: figDopplerBlood(),
      parts: [
        {
          label: '(1)',
          q: R`赤血球が受けとる超音波の振動数 $f_{1}$ を $f_{0},\ V,\ u,\ \theta$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{V}{V+u\cos\theta}\,f_{0}$`,
            R`$\dfrac{V+u\cos\theta}{V}\,f_{0}$`,
            R`$\dfrac{V-u\cos\theta}{V}\,f_{0}$`,
            R`$\dfrac{V+u}{V}\,f_{0}$`,
            R`$\dfrac{V}{V-u\cos\theta}\,f_{0}$`
          ],
          answer: 1
        },
        {
          label: '(2)',
          q: R`探触子が受信する反射波の振動数 $f_{2}$ を $f_{0},\ V,\ u,\ \theta$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{V+u\cos\theta}{V-u\cos\theta}\,f_{0}$`,
            R`$\dfrac{V}{V-u\cos\theta}\,f_{0}$`,
            R`$\left(\dfrac{V+u\cos\theta}{V}\right)^{2}f_{0}$`,
            R`$\dfrac{V+u\cos\theta}{V}\,f_{0}$`,
            R`$\dfrac{V-u\cos\theta}{V+u\cos\theta}\,f_{0}$`
          ],
          answer: 0
        },
        { label: '(3)', q: R`$u=0.30\,\mathrm{m/s}$ のとき、反射波の振動数と送信した超音波の振動数の差 $f_{2}-f_{0}$ は何 $\mathrm{Hz}$ か。`, type: 'num', answer: 1000, rel: 0.02, unit: 'Hz', hint: R`例: 1.5e3` },
        { label: '(4)', q: R`ある血流を測定したところ、$f_{2}-f_{0}=2.4\times 10^{3}\,\mathrm{Hz}$ であった。赤血球の速さ $u$ は何 $\mathrm{m/s}$ か。`, type: 'num', answer: 0.72, rel: 0.02, unit: 'm/s' },
        { label: '(5)', q: R`$u=0.30\,\mathrm{m/s}$ の同じ血流を、超音波の向きと赤血球の速度の向きがそろう（$\theta=0\degree$）ように測定すると、$f_{2}-f_{0}$ は何 $\mathrm{Hz}$ になるか。`, type: 'num', answer: 2000, rel: 0.02, unit: 'Hz', hint: R`例: 1.5e3` }
      ],
      solution: [
        {
          t: 'ドップラー効果の考え方（2 段階）',
          n: R`この装置では、ドップラー効果が 2 回起こります。（i）静止した音源（探触子）から出た超音波を、動く赤血球が受けとる（動く観測者）。（ii）赤血球が、受けとった振動数 $f_{1}$ の超音波を、音源として探触子に向けて出す（動く音源、観測者の探触子は静止）。動きがななめでも、音の進む向き（探触子と赤血球を結ぶ直線）への**速度の成分** $u\cos\theta$ だけが、振動数の変化に関係します。`,
          easy: R`救急車のサイレンが近づくと高く、遠ざかると低く聞こえる現象がドップラー効果です。音源と観測者の「近づく・遠ざかる速さ」だけが効くので、動きがななめのときは、音の進む向きにそった成分（ここでは $u\cos\theta$）だけを使います。赤血球は、受けとるときは「動く観測者」、反射して出すときは「動く音源」になるので、2 回続けて計算します。`,
          lv: 1
        },
        {
          t: '赤血球が受けとる振動数（(1)）',
          m: R`f_{1} = \frac{V+u\cos\theta}{V}\,f_{0}`,
          n: R`観測者（赤血球）が音源（探触子）に近づく向きに速さ $u\cos\theta$ で動いているので、1 秒間に受けとる波の数が増えます。ドップラー効果の式 $f'=\dfrac{V-v_{\mathrm{o}}}{V-v_{\mathrm{s}}}f$ で、音源は静止（$v_{\mathrm{s}}=0$）、観測者は音源に近づくので波の進む向きと逆向きに動いて $v_{\mathrm{o}}=-u\cos\theta$ です。`,
          pro: R`「観測者が近づく」→ 分子が $V+v_{\mathrm{o}}$。式の符号は、「近づく → 振動数が増える」で必ず確認。`,
          lv: 1
        },
        {
          t: '探触子が受信する振動数（(2)）',
          m: R`f_{2} = \frac{V}{V-u\cos\theta}\,f_{1} = \frac{V+u\cos\theta}{V-u\cos\theta}\,f_{0}`,
          n: R`今度は、赤血球が振動数 $f_{1}$ の音源として、探触子に近づきながら音を出します。音源が近づくので、波長が縮み、観測者（探触子）の聞く振動数は $\dfrac{V}{V-u\cos\theta}$ 倍になります。(1) の結果とかけあわせます。`,
          lv: 1
        },
        {
          t: '振動数の差（(3)）',
          m: [R`f_{2}-f_{0} = \frac{2u\cos\theta}{V-u\cos\theta}\,f_{0}`,
              R`= \frac{2\times 0.30\times 0.50}{1500-0.15}\times 5.0\times 10^{6} \approx 1.0\times 10^{3}\,\mathrm{Hz}`],
          n: R`$u\cos\theta=0.15\,\mathrm{m/s}$ で、$V=1500\,\mathrm{m/s}$ に比べて十分小さいので、分母の $u\cos\theta$ を無視した近似式 $f_{2}-f_{0}\approx\dfrac{2u\cos\theta}{V}f_{0}$ を使っても、結果は変わりません（$\dfrac{2\times 0.15}{1500}\times 5.0\times 10^{6}=1.0\times 10^{3}\,\mathrm{Hz}$）。$5.0\times 10^{6}\,\mathrm{Hz}$ の中の $1.0\times 10^{3}\,\mathrm{Hz}$（0.02%）という、小さな差を検出します。`,
          lv: 1
        },
        {
          t: '測定値から速さを求める（(4)）',
          m: R`\Delta f = \frac{2u\cos\theta}{V-u\cos\theta}f_{0} \;\Longrightarrow\; u\cos\theta = \frac{V\,\Delta f}{2f_{0}+\Delta f} \approx \frac{1.5\times 10^{3}\times 2.4\times 10^{3}}{1.0\times 10^{7}} = 0.36,\quad u = \frac{0.36}{0.50} = 0.72\,\mathrm{m/s}`,
          n: R`$\Delta f=f_{2}-f_{0}$ とおいて、$u\cos\theta$ について解きます（分母の $\Delta f$ は $2f_{0}$ に比べてごく小さいので、無視しても同じ結果です）。さらに $\cos 60\degree=0.50$ で割って $u$ を求めます。向きの補正（$\cos\theta$）を忘れると、$u=0.36\,\mathrm{m/s}$ としてしまうので注意しましょう。`,
          lv: 1
        },
        {
          t: '向きによる違い（(5)）',
          m: R`\theta=0\degree:\quad f_{2}-f_{0} = \frac{2u}{V-u}f_{0} \approx \frac{2\times 0.30}{1500}\times 5.0\times 10^{6} = 2.0\times 10^{3}\,\mathrm{Hz}`,
          n: R`$\cos 0\degree=1$ なので、速度成分が $u$ そのものになり、差は $\theta=60\degree$ の場合の $\dfrac{1}{\cos 60\degree}=2$ 倍です。$\theta=90\degree$（超音波の向きと速度が垂直）では $\cos\theta=0$ となり、$f_{2}-f_{0}=0$ で、血流を検出できません。そのため、探触子は、血管にななめに当てて使います。`,
          lv: 2
        }
      ],
      prereq: ['p-doppler', 'p-wave'],
      tags: ['ドップラー効果', '動く観測者と動く音源', '速度成分']
    },

    /* ---------- 光の干渉 ---------- */
    {
      id: 'p-adv-interf-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-interf',
      title: 'ニュートンリングと液体',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`平らなガラス板（屈折率 $n_{2}=1.70$）の上に、曲率半径 $R=0.60\,\mathrm{m}$ の平凸レンズ（屈折率 $n_{1}=1.50$）を凸面を下にして置き、真上から波長 $\lambda=6.0\times 10^{-7}\,\mathrm{m}$ の単色光を垂直に当てて、上から反射光を観察すると、中心 O を中心とする同心円状の明暗の縞（ニュートンリング）が見えた（図）。はじめ、レンズと板の間のすきまは空気（屈折率 $1.00$）である。O から距離 $r$ の位置でのすきまの厚さ $d$ は、$r$ が $R$ に比べて十分に小さいとして、$d=\dfrac{r^{2}}{2R}$ と表してよい。また、光が屈折率の小さい媒質から大きい媒質との境界で反射されるときは位相が $\pi$ ずれ、大きい媒質から小さい媒質との境界で反射されるときは位相が変わらない。`,
      fig: figNewton(),
      parts: [
        {
          label: '(1)',
          q: R`すきまが空気のとき、O の暗い点を $0$ 番目として、中心から数えて $m$ 番目の暗い輪の半径 $r_{m}$ を $m,\ \lambda,\ R$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\sqrt{\dfrac{m\lambda R}{2}}$`,
            R`$\sqrt{2m\lambda R}$`,
            R`$\sqrt{\left(m-\dfrac{1}{2}\right)\lambda R}$`,
            R`$\sqrt{m\lambda R}$`,
            R`$\sqrt{\left(m+\dfrac{1}{2}\right)\lambda R}$`
          ],
          answer: 3
        },
        { label: '(2)', q: R`すきまが空気のとき、$4$ 番目の暗い輪の半径は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.0012, rel: 0.02, unit: 'm', hint: R`例: 1.5e-3` },
        {
          label: '(3)',
          q: R`すきまを、屈折率 $n=1.60$ の液体で満たした。このとき、中心 O の明暗とその理由として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`暗い。レンズの下面での反射は位相が変わらず、板の上面での反射は位相が $\pi$ ずれるから。`,
            R`明るい。レンズの下面での反射も、板の上面での反射も、位相が $\pi$ ずれるから。`,
            R`明るい。どちらの反射も位相が変わらないから。`,
            R`暗い。どちらの反射も位相が $\pi$ ずれるから。`,
            R`空気のときと変わらず、暗い。屈折率が変わっても位相のずれ方は同じだから。`
          ],
          answer: 1
        },
        { label: '(4)', q: R`(3) のとき、中心から数えて $1$ 番目の暗い輪の半径は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.000335, rel: 0.02, unit: 'm', hint: R`例: 3.0e-4` },
        { label: '(5)', q: R`(3) のとき、O の明るい点を $0$ 番目として、中心から数えて $2$ 番目の明るい輪の半径は何 $\mathrm{m}$ か。`, type: 'num', answer: 0.000671, rel: 0.02, unit: 'm', hint: R`例: 6.0e-4` }
      ],
      solution: [
        {
          t: 'すきまの厚さと、反射光の経路差',
          m: [R`d = R - \sqrt{R^{2}-r^{2}} \approx \frac{r^{2}}{2R}`,
              R`\text{経路差（往復）} = 2nd,\qquad \text{位相差}\ \delta = \frac{2\pi\cdot 2nd}{\lambda} + (\text{反射による位相のずれ})`],
          n: R`O から $r$ の位置では、レンズの下面で反射する光と、板の上面で反射する光があり、前者に対して後者は、すきまを往復する分（$2d$）だけ余計に進みます。屈折率 $n$ の媒質中では、光の波長が $\dfrac{\lambda}{n}$ になるので、位相でいうと、光路差は $2nd$ として数えます。このほかに、反射で位相が $\pi$ ずれる場合があるかどうかを調べます。`,
          easy: R`光が 2 つの面で反射して、再び出会うと、強めあったり弱めあったりします。後で反射した光は、すきま（厚さ $d$）を往復する $2d$ 分だけ遠回りします。さらに、「反射のしかたによって、波の山と谷がひっくり返る（位相が $\pi$ ずれる）」ことがあるので、これも考えに入れます。`,
          lv: 1
        },
        {
          t: 'すきまが空気のときの暗い輪の条件（(1)(2)）',
          m: [R`\text{上面（レンズ下面）:}\ 1.50\to 1.00\ (\text{ずれなし}),\qquad \text{下面（板上面）:}\ 1.00\to 1.70\ (\pi\ \text{ずれる})`,
              R`\text{暗い輪:}\ 2d = m\lambda \;\Longrightarrow\; \frac{r_{m}^{2}}{R} = m\lambda \;\Longrightarrow\; r_{m} = \sqrt{m\lambda R}`],
          n: R`屈折率が大きい側（レンズ）から小さい側（空気）への反射では位相は変わらず、小さい側（空気）から大きい側（板）への反射では $\pi$ ずれます。結局、2 つの反射光の位相差は、光路差 $2d$ と反射による $\pi$ の和になり、$2d=m\lambda$（$m=0,1,2,\cdots$）で打ち消しあって暗くなります。$m=0$ が中心の暗い点です。$m=4$ では $r_{4}=\sqrt{4\times 6.0\times 10^{-7}\times 0.60}=1.2\times 10^{-3}\,\mathrm{m}$ です。`,
          pro: R`ニュートンリング（空気）の暗環は $r_{m}=\sqrt{m\lambda R}$、明環は $r_{m}=\sqrt{\left(m-\tfrac{1}{2}\right)\lambda R}$（$m=1,2,\cdots$）と覚えておく。中心が暗いのは、「一方の反射でだけ $\pi$ ずれる」から。`,
          lv: 1
        },
        {
          t: '液体（$n=1.60$）で満たしたときの位相のずれ（(3)）',
          m: [R`\text{上面（レンズ下面）:}\ 1.50\to 1.60\ (\pi\ \text{ずれる}),\qquad \text{下面（板上面）:}\ 1.60\to 1.70\ (\pi\ \text{ずれる})`,
              R`\text{反射による位相のずれの差} = \pi - \pi = 0`],
          n: R`液体の屈折率 $1.60$ は、レンズ（$1.50$）と板（$1.70$）の中間です。レンズの下面でも板の上面でも、「屈折率が小さい側から大きい側」への反射になるので、どちらも位相が $\pi$ ずれ、おたがいに打ち消しあって、位相のずれの**差は $0$** になります。そのため O（$d=0$）では 2 つの反射光が強めあい、**明るく**なります。`,
          easy: R`空気のときは、2 つの反射のうち片方だけ $\pi$ ずれていたので、O（すきま $0$）では打ち消しあって暗くなりました。液体を入れると、どちらの反射でも $\pi$ ずれるので、ずれがそろって（差が $0$）、O では光が強めあって明るくなります。「どの反射で $\pi$ ずれるか」を境界ごとに調べるのが大切です。`,
          lv: 1
        },
        {
          t: '液体のときの暗い輪・明るい輪（(4)(5)）',
          m: [R`\text{明るい輪:}\ 2nd = m\lambda \;\Longrightarrow\; r_{m} = \sqrt{\frac{m\lambda R}{n}}\quad(m=0,1,2,\cdots)`,
              R`\text{暗い輪:}\ 2nd = \left(m-\frac{1}{2}\right)\lambda \;\Longrightarrow\; r_{m} = \sqrt{\frac{\left(m-\frac{1}{2}\right)\lambda R}{n}}\quad(m=1,2,\cdots)`,
              R`r_{1}^{\text{(暗)}} = \sqrt{\frac{0.5\times 6.0\times 10^{-7}\times 0.60}{1.60}} \approx 3.35\times 10^{-4}\,\mathrm{m},\qquad r_{2}^{\text{(明)}} = \sqrt{\frac{2\times 6.0\times 10^{-7}\times 0.60}{1.60}} \approx 6.71\times 10^{-4}\,\mathrm{m}`],
          n: R`光路差が $2nd$ で、位相のずれの差は $0$ なので、$2nd$ が波長の整数倍のとき強めあい、半波長の奇数倍のとき弱めあいます。$d=\dfrac{r^{2}}{2R}$ を代入すると $2nd=\dfrac{nr^{2}}{R}$ です。空気のときの輪の半径に比べ、同じ $m$ でも半径は $\dfrac{1}{\sqrt{n}}$ 倍になります。`,
          lv: 1
        },
        {
          t: '場合分けのまとめ（液体の屈折率と中心の明暗）',
          n: R`中心 O の明暗は、液体の屈折率 $n$ が、レンズ（$1.50$）と板（$1.70$）の間にあるかどうかで決まります。$1.50<n<1.70$ のとき、2 つの反射の位相のずれ方が同じになり、O は明るくなります。$n<1.50$（空気もこの場合）、または $n>1.70$ のときは、片方の反射だけが $\pi$ ずれて、O は暗くなります。`,
          pro: R`境界ごとに「屈折率が小さい → 大きい」かを書き出す。位相のずれが「同じ個数」なら差は $0$、「1 つだけ」なら差は $\pi$。`,
          lv: 2
        }
      ],
      prereq: ['p-interf', 'p-wave'],
      tags: ['ニュートンリング', '薄膜干渉', '位相のずれ', '場合分け']
    },

    /* ---------- 静電気（電場と電位） ---------- */
    {
      id: 'p-adv-estat-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-estat',
      title: '2 つの点電荷の間の電位と小振動',
      source: { univ: 'オリジナル' },
      time: 24,
      body: R`真空中で、$x$ 軸上の原点に点電荷 $+4Q$ を、$x=d$ の位置に点電荷 $+Q$ を固定する（$Q>0$）。クーロンの法則の比例定数を $k$ とする。$0<x<d$ の範囲の $x$ 軸上の点について、電場（$x$ 軸の正の向きを正とする）と電位（無限遠を基準とする）を考える。図は、電位 $V(x)$ の概形である。数値を求める設問では、$k=9.0\times 10^{9}\,\mathrm{N\cdot m^{2}/C^{2}}$、$Q=1.0\times 10^{-8}\,\mathrm{C}$、$d=0.30\,\mathrm{m}$ とする。`,
      fig: figPotential(),
      parts: [
        {
          label: '(1)',
          q: R`電場が $0$ になる点の位置 $x_{0}$ を $d$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{d}{2}$`,
            R`$\dfrac{d}{3}$`,
            R`$\dfrac{4d}{5}$`,
            R`$\dfrac{d}{5}$`,
            R`$\dfrac{2d}{3}$`
          ],
          answer: 4
        },
        { label: '(2)', q: R`$x_{0}$ の点の電位は何 $\mathrm{V}$ か。`, type: 'num', answer: 2700, rel: 0.02, unit: 'V', hint: R`例: 1.5e3` },
        {
          label: '(3)',
          q: R`質量 $m$、電荷 $+q$（$q>0$）の小さな荷電粒子を、$x$ 軸にそってだけ動けるようにして $x_{0}$ の近くに置く。粒子が $x_{0}$ から $x$ 軸の正の向きに小さな距離 $s$ だけ変位した位置で受ける力は、$-Ks$ と近似できる。$K$ を $k,\ Q,\ q,\ d$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{27kQq}{d^{3}}$`,
            R`$\dfrac{54kQq}{d^{3}}$`,
            R`$\dfrac{81kQq}{d^{3}}$`,
            R`$\dfrac{9kQq}{d^{3}}$`,
            R`$\dfrac{81kQq}{d^{2}}$`
          ],
          answer: 2
        },
        { label: '(4)', q: R`$m=2.7\times 10^{-6}\,\mathrm{kg}$、$q=1.0\times 10^{-9}\,\mathrm{C}$ のとき、(3) の粒子が $x_{0}$ のまわりで小さく振動する周期は何 $\mathrm{s}$ か。`, type: 'num', answer: 0.628, rel: 0.02, unit: 's', show: R`\frac{\pi}{5}` },
        { label: '(5)', q: R`(4) の粒子を $x=\dfrac{d}{2}$ の点で静かに放した。この粒子が $x_{0}$ を通過するときの速さは何 $\mathrm{m/s}$ か。（この振動は小さい振動とは見なせない。）`, type: 'num', answer: 0.471, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        {
          t: '電場が $0$ になる点（(1)）',
          m: [R`E(x) = kQ\left(\frac{4}{x^{2}} - \frac{1}{(d-x)^{2}}\right) = 0`,
              R`\frac{4}{x^{2}} = \frac{1}{(d-x)^{2}} \;\Longrightarrow\; 2(d-x) = x \;\Longrightarrow\; x_{0} = \frac{2d}{3}`],
          n: R`$0<x<d$ では、$+4Q$ による電場は $x$ の正の向き（原点から遠ざかる向き）、$+Q$ による電場は負の向き（$x=d$ から遠ざかる向き）で、逆向きなので打ち消しあう点があります。電場の大きさがひとしい条件から、$\dfrac{2}{x}=\dfrac{1}{d-x}$ となります。電荷が大きい $+4Q$ から遠く、小さい $+Q$ に近い側に電場 $0$ の点があります。`,
          easy: R`同じ符号の電荷の間では、2 つの電荷が、それぞれ反対向きに電場をつくるので、どこかで打ち消しあって $0$ になります。電荷が大きい $4Q$ のほうが電場が強いので、そこから離れた位置、つまり小さな $Q$ に近いところで釣り合います。電場の強さは、電荷に比例し、距離の $2$ 乗に反比例するので、$\dfrac{4Q}{x^{2}}=\dfrac{Q}{(d-x)^{2}}$ から、$x:(d-x)=2:1$ と求まります。`,
          lv: 1
        },
        {
          t: '電位（(2)）',
          m: [R`V(x) = kQ\left(\frac{4}{x}+\frac{1}{d-x}\right)`,
              R`V(x_{0}) = kQ\left(\frac{4}{\frac{2}{3}d}+\frac{1}{\frac{1}{3}d}\right) = \frac{9kQ}{d} = \frac{9\times 9.0\times 10^{9}\times 1.0\times 10^{-8}}{0.30} = 2.7\times 10^{3}\,\mathrm{V}`],
          n: R`電位は、各電荷がつくる電位 $\dfrac{kq}{r}$ の和です（スカラー量なので、向きは関係なくそのまま足します）。電位 $V(x)$ のグラフは、両端の電荷に近づくと大きくなる谷の形で、電場が $0$ の点 $x_{0}$ が、谷の底（極小）にあたります（$E=-\dfrac{dV}{dx}$）。`,
          lv: 1
        },
        {
          t: '$x_{0}$ のまわりの力（(3)）',
          m: [R`F(x_{0}+s) = qE(x_{0}+s) \approx q\,E'(x_{0})\,s`,
              R`E'(x) = -kQ\left(\frac{8}{x^{3}}+\frac{2}{(d-x)^{3}}\right),\qquad E'(x_{0}) = -kQ\left(\frac{27}{d^{3}}+\frac{54}{d^{3}}\right) = -\frac{81kQ}{d^{3}}`,
              R`K = \frac{81kQq}{d^{3}}`],
          n: R`$E(x_{0})=0$ なので、$x_{0}$ から小さく動いた位置での電場は、$E(x)$ を $x_{0}$ のまわりで 1 次の項まで展開した $E'(x_{0})\,s$ で近似できます。この $E'(x_{0})$ は、$E(x)$ の式を $x$ で微分して求めます（$\dfrac{d}{dx}\dfrac{4}{x^{2}}=-\dfrac{8}{x^{3}}$、$\dfrac{d}{dx}\left(-\dfrac{1}{(d-x)^{2}}\right)=-\dfrac{2}{(d-x)^{3}}$）。$x_{0}=\dfrac{2d}{3}$、$d-x_{0}=\dfrac{d}{3}$ を代入すると上のようになります。力が変位に比例して、向きが逆（$-Ks$）なので、単振動です。`,
          easy: R`微分を使わない方法もあります。$x_{0}+s$ のとき、$\dfrac{1}{(x_{0}+s)^{2}}\approx\dfrac{1}{x_{0}^{2}}\left(1-\dfrac{2s}{x_{0}}\right)$、$\dfrac{1}{(d-x_{0}-s)^{2}}\approx\dfrac{1}{(d-x_{0})^{2}}\left(1+\dfrac{2s}{d-x_{0}}\right)$（$s$ が十分に小さいときの近似、$(1+\varepsilon)^{n}\approx 1+n\varepsilon$）を使うと、$E(x_{0}+s)\approx -kQ\left(\dfrac{8}{x_{0}^{3}}+\dfrac{2}{(d-x_{0})^{3}}\right)s$ が出てきます。`,
          pro: R`$s$ が $d$ に比べてごく小さいとき $(1+\varepsilon)^{n}\approx 1+n\varepsilon$。「力 = −（定数）× 変位」の形になれば、周期は $T=2\pi\sqrt{\dfrac{m}{K}}$。`,
          lv: 1
        },
        {
          t: '小さな振動の周期（(4)）',
          m: [R`K = \frac{81\times 9.0\times 10^{9}\times 1.0\times 10^{-8}\times 1.0\times 10^{-9}}{0.30^{3}} = 2.7\times 10^{-4}\,\mathrm{N/m}`,
              R`T = 2\pi\sqrt{\frac{m}{K}} = 2\pi\sqrt{\frac{2.7\times 10^{-6}}{2.7\times 10^{-4}}} = 2\pi\times 0.10 \approx 0.628\,\mathrm{s}`],
          n: R`ばねにつないだおもりの振動の式 $T=2\pi\sqrt{\dfrac{m}{k_{\text{ばね}}}}$ の $k_{\text{ばね}}$ を $K$ に置きかえます。電気力が、ばねのような復元力のはたらきをしています。`,
          lv: 1
        },
        {
          t: 'エネルギー保存で速さを求める（(5)）',
          m: [R`V\!\left(\frac{d}{2}\right) = kQ\left(\frac{4}{0.15}+\frac{1}{0.15}\right) = 3.0\times 10^{3}\,\mathrm{V},\qquad V(x_{0}) = 2.7\times 10^{3}\,\mathrm{V}`,
              R`\frac{1}{2}m v^{2} = q\left\{V\!\left(\frac{d}{2}\right)-V(x_{0})\right\} = 1.0\times 10^{-9}\times 300 = 3.0\times 10^{-7}\,\mathrm{J}`,
              R`v = \sqrt{\frac{2\times 3.0\times 10^{-7}}{2.7\times 10^{-6}}} \approx 0.471\,\mathrm{m/s}`],
          n: R`静電気力は保存力なので、電位エネルギー $qV$ と運動エネルギーの和が保存します。放した点の振幅は $x_{0}-\dfrac{d}{2}=0.050\,\mathrm{m}$ で、$x_{0}=0.20\,\mathrm{m}$ に比べて小さくありません。(4) の小さな振動の近似で最大の速さを $\omega\times 0.050=0.50\,\mathrm{m/s}$ と求めると、実際の $0.471\,\mathrm{m/s}$ より約 6% 大きくなります（放した点の側では、谷の底のまわりよりも谷が少し浅く広がっていて、放物線の近似より得られる運動エネルギーが小さいため）。`,
          lv: 1
        }
      ],
      prereq: ['p-estat', 'p-energy', 'p-shm'],
      tags: ['電場', '電位', '小振動', 'エネルギー保存']
    }

  ]);

  /* ---------- 直流回路 ---------- */
  // 内部抵抗 r をもつ電池と可変抵抗 R
  function figBatteryR() {
    const d = D(360, 216);
    d.rect(38, 46, 134, 126, { cls: 'dim', dash: true, w: 1.2 });
    d.battery(70, 96, 70, 150, { label: 'E', lpos: -1 });
    d.wire([[70, 96], [70, 74], [94, 74]]);
    d.resistor(94, 74, 152, 74, { label: 'r' });
    d.wire([[152, 74], [280, 74], [280, 86]]);
    d.resistor(280, 86, 280, 150, { label: 'R' });
    d.wire([[280, 150], [280, 168], [70, 168], [70, 150]]);
    d.arrow(262, 146, 300, 92, { cls: 'c3', w: 1.6 });
    d.text(105, 36, '電池', { cls: 'dim' });
    d.text(280, 190, '可変抵抗 R', { size: 12 });
    d.text(352, 24, 'E = 12 V、r = 2.0 Ω', { anchor: 'end' });
    return d.svg();
  }

  /* ---------- 電流と磁場 ---------- */
  // 斜面上の導体棒（電流は紙面の手前から奥へ、磁場は鉛直上向き）
  function figRodSlope() {
    const d = D(360, 232);
    const th = Math.atan(3 / 4), ct = Math.cos(th), st = Math.sin(th);
    const ox = 28, oy = 204, len = 225;
    const tx = ox + len * ct, ty = oy - len * st;
    d.poly([[ox, oy], [tx, ty], [tx, oy]], { cls: 'fg', fill: 'f0' });
    d.angle(ox, oy, 56, 0, th * 180 / PI, 'θ', { cls: 'c3' });
    // 棒（断面は円。電流は奥向き ×）
    const s0 = 130, rr = 12;
    const bx = ox + s0 * ct - rr * st, by = oy - s0 * st - rr * ct;
    d.circle(bx, by, rr, { cls: 'c1', fill: 'f1', w: 1.8 });
    d.line(bx - 6, by - 6, bx + 6, by + 6, { cls: 'fg', w: 1.5 });
    d.line(bx - 6, by + 6, bx + 6, by - 6, { cls: 'fg', w: 1.5 });
    // 力
    arr(d, bx, by, bx + 62, by, 'F', 'c3', bx + 70, by - 4);
    arr(d, bx, by, bx, by + 56, 'mg', 'c4', bx + 6, by + 62);
    arr(d, bx, by, bx - 52 * st, by - 52 * ct, 'N', 'c1', bx - 52 * st - 6, by - 52 * ct - 6, 'end');
    arr(d, bx, by, bx + 48 * ct, by - 48 * st, 'f', 'c2', bx + 48 * ct + 8, by - 48 * st - 4);
    // 磁場（鉛直上向き）
    [40, 62].forEach(function (x) { d.arrow(x, 150 - (x - 40) * 0.6, x, 88 - (x - 40) * 0.6, { cls: 'dim', w: 1.6 }); });
    d.text(40, 40, 'B（鉛直上向き）', { size: 12, anchor: 'start' });
    d.text(352, 24, 'm = 0.10 kg、ℓ = 0.50 m', { anchor: 'end' });
    d.text(352, 42, 'B = 0.40 T、μ = 0.50', { anchor: 'end' });
    d.text(352, 60, 'tan θ = 3/4', { anchor: 'end' });
    d.text(352, 96, '電流 I は奥向き（×）', { anchor: 'end' });
    return d.svg();
  }

  /* ---------- 電磁誘導 ---------- */
  // 水平面内のレール（上から見た図）、コンデンサー、導体棒、鉛直上向きの磁場（⊙）
  function figRailCapacitor() {
    const d = D(360, 216);
    d.line(56, 70, 336, 70, { cls: 'fg', w: 2.2 });
    d.line(56, 156, 336, 156, { cls: 'fg', w: 2.2 });
    d.capacitor(56, 70, 56, 156, { label: 'C' });
    [[104, 96], [104, 130], [160, 96], [160, 130], [252, 96], [252, 130], [304, 96], [304, 130]].forEach(function (p) {
      d.circle(p[0], p[1], 6, { cls: 'dim', w: 1.2 });
      d.dot(p[0], p[1], { cls: 'dim', r: 1.6 });
    });
    d.line(210, 62, 210, 164, { cls: 'c3', w: 5 });
    arr(d, 216, 113, 276, 113, 'F', 'c1', 282, 109);
    d.text(210, 182, '導体棒（質量 m）', { size: 12 });
    d.line(348, 70, 348, 156, { cls: 'dim', w: 1 });
    d.line(343, 70, 353, 70, { cls: 'dim', w: 1 });
    d.line(343, 156, 353, 156, { cls: 'dim', w: 1 });
    d.text(342, 117, 'ℓ', { cls: 'dim', italic: true, size: 13, anchor: 'end' });
    d.text(180, 206, '⊙ は鉛直上向き（紙面から手前）の磁束密度 B', { size: 12, cls: 'dim' });
    d.text(352, 24, 'ℓ = 1.0 m、B = 0.50 T', { anchor: 'end' });
    d.text(352, 42, 'm = 0.10 kg、C = 0.40 F', { anchor: 'end' });
    return d.svg();
  }

  JK.registerProblems([

    /* ---------- 直流回路 ---------- */
    {
      id: 'p-adv-circuit-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-circuit',
      title: '電池の内部抵抗と消費電力',
      source: { univ: 'オリジナル' },
      time: 20,
      body: R`起電力 $E=12\,\mathrm{V}$、内部抵抗 $r=2.0\,\Omega$ の電池に、抵抗値を変えられる可変抵抗 $R$ をつなぐ（図）。導線の抵抗や、測定器の影響は無視できる。可変抵抗で消費される電力を $P$ とする。`,
      fig: figBatteryR(),
      parts: [
        {
          label: '(1)',
          q: R`$P$ を $E,\ r,\ R$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{E^{2}R}{(R+r)^{2}}$`,
            R`$\dfrac{E^{2}R}{R+r}$`,
            R`$\dfrac{E^{2}}{R+r}$`,
            R`$\dfrac{E^{2}r}{(R+r)^{2}}$`,
            R`$\dfrac{E^{2}R}{R^{2}+r^{2}}$`
          ],
          answer: 0
        },
        { label: '(2)', q: R`$R=6.0\,\Omega$ のとき、$P$ は何 $\mathrm{W}$ か。`, type: 'num', answer: 13.5, rel: 0.02, unit: 'W' },
        { label: '(3)', q: R`$R$ を変化させるとき、$P$ の最大値は何 $\mathrm{W}$ か。`, type: 'num', answer: 18, rel: 0.02, unit: 'W' },
        { label: '(4)', q: R`$R=8.0\,\Omega$ のときと同じ大きさの電力が消費されるような、$R$ の別の値は何 $\Omega$ か。`, type: 'num', answer: 0.5, rel: 0.02, unit: 'Ω' },
        { label: '(5)', q: R`同じ電池をもう 1 個用意し、2 個を**並列**につないで、$R=1.0\,\Omega$ の抵抗につないだ。このとき $R$ で消費される電力は何 $\mathrm{W}$ か。`, type: 'num', answer: 36, rel: 0.02, unit: 'W' }
      ],
      solution: [
        {
          t: '電池の内部抵抗をふくむ回路の電流',
          m: R`I = \frac{E}{R+r}`,
          n: R`内部抵抗 $r$ をもつ電池は、「起電力 $E$ の理想的な電池と、抵抗 $r$ の抵抗が直列につながったもの」とみなせます（図の破線の中）。回路全体の抵抗は $R+r$ なので、オームの法則から電流は上の式になります。可変抵抗の両端の電圧（電池の端子電圧）は $V=E-rI=RI$ です。`,
          easy: R`電池も、少しだけ抵抗をもっています。この抵抗が内部抵抗 $r$ です。電流 $I$ が流れると、電池の内部で電圧が $rI$ だけ下がるので、外の抵抗 $R$ にかかる電圧は $E-rI$ になります。回路全体を、抵抗 $r$ と $R$ の直列と考えて、電流を求めます。`,
          lv: 1
        },
        {
          t: '$R$ で消費される電力（(1)）',
          m: R`P = I^{2}R = \frac{E^{2}R}{(R+r)^{2}}`,
          n: R`$R$ の消費電力は「電流の 2 乗 × 抵抗」です。内部抵抗 $r$ でも電力 $I^{2}r$ が消費され、電池がする仕事 $EI$ は、$EI=I^{2}R+I^{2}r$ のように分かれます。`,
          lv: 1
        },
        {
          t: R`$R=6.0\,\Omega$ のとき（(2)）`,
          m: [R`I = \frac{12}{6.0+2.0} = 1.5\,\mathrm{A}`,
              R`P = I^{2}R = 1.5^{2}\times 6.0 = 13.5\,\mathrm{W}`],
          n: R`端子電圧は $V=RI=9.0\,\mathrm{V}$ で、$P=IV=13.5\,\mathrm{W}$ とも一致します。`,
          lv: 1
        },
        {
          t: '消費電力の最大値（(3)）',
          m: [R`P = \frac{E^{2}R}{(R+r)^{2}} = \frac{E^{2}}{R+\dfrac{r^{2}}{R}+2r}`,
              R`R+\frac{r^{2}}{R} \ge 2\sqrt{R\cdot\frac{r^{2}}{R}} = 2r \;\Longrightarrow\; P \le \frac{E^{2}}{4r} = \frac{144}{8.0} = 18\,\mathrm{W}\quad(R=r=2.0\,\Omega\ \text{のとき等号})`],
          n: R`分母を $R+\dfrac{r^{2}}{R}+2r$ と変形して、相加平均と相乗平均の関係 $a+b\ge 2\sqrt{ab}$ を使います。等号は $R=\dfrac{r^{2}}{R}$、つまり $R=r$ のときです。外の抵抗が内部抵抗と同じ大きさのとき、取り出せる電力が最大になります（このとき電池がする仕事の半分が $R$ で使われ、残り半分が内部抵抗で熱になります）。`,
          pro: R`最大電力 $\dfrac{E^{2}}{4r}$（$R=r$）は暗記してよい定石。微分して $\dfrac{dP}{dR}=0$ を解いても同じ結果になる。`,
          lv: 1
        },
        {
          t: '同じ電力になる 2 つの抵抗値（(4)）',
          m: [R`P(R) = \frac{E^{2}}{R+\dfrac{r^{2}}{R}+2r}\ \text{は}\ R\to\frac{r^{2}}{R}\ \text{で変わらない}`,
              R`R_{1}R_{2} = r^{2} \;\Longrightarrow\; R_{2} = \frac{r^{2}}{R_{1}} = \frac{2.0^{2}}{8.0} = 0.50\,\Omega`],
          n: R`(3) の変形から、$R$ と $\dfrac{r^{2}}{R}$ を入れかえても $P$ は変わらないことがわかります。つまり、同じ電力になる 2 つの抵抗値の積は $r^{2}$ です。確認すると、$P(8.0)=\dfrac{144\times 8.0}{10^{2}}=11.52\,\mathrm{W}$、$P(0.50)=\dfrac{144\times 0.50}{2.5^{2}}=11.52\,\mathrm{W}$ で一致します。`,
          lv: 1
        },
        {
          t: '電池 2 個を並列につないだとき（(5)）',
          m: [R`\text{並列:}\quad E_{\mathrm{p}} = E,\quad r_{\mathrm{p}} = \frac{r}{2} = 1.0\,\Omega`,
              R`I = \frac{E}{R+\dfrac{r}{2}} = \frac{12}{1.0+1.0} = 6.0\,\mathrm{A},\qquad P = I^{2}R = 36\,\mathrm{W}`],
          n: R`同じ電池を並列につなぐと、起電力は $E$ のまま、内部抵抗は並列合成で半分の $\dfrac{r}{2}$ になります。比べるために直列の場合も計算すると、$E_{\mathrm{s}}=2E$、$r_{\mathrm{s}}=2r$ なので、$I=\dfrac{24}{1.0+4.0}=4.8\,\mathrm{A}$、$P=4.8^{2}\times 1.0\approx 23\,\mathrm{W}$ となり、この場合は並列のほうが大きな電力になります。`,
          lv: 1
        },
        {
          t: '直列と並列、どちらが有利か（場合分け）',
          m: R`P_{\text{直列}} = \frac{4E^{2}R}{(R+2r)^{2}},\qquad P_{\text{並列}} = \frac{E^{2}R}{\left(R+\dfrac{r}{2}\right)^{2}} = \frac{4E^{2}R}{(2R+r)^{2}}`,
          n: R`2 つを比べると、$(2R+r)^{2}<(R+2r)^{2}$ すなわち $R<r$ のとき並列のほうが大きく、$R>r$ のとき直列のほうが大きく、$R=r$ のとき等しくなります。外の抵抗が内部抵抗より小さいときは並列、大きいときは直列が有利です。`,
          pro: R`「$R$ が小さい → 電流を多く流したい → 並列（内部抵抗を下げる）」「$R$ が大きい → 電圧を高くしたい → 直列」と覚える。`,
          lv: 2
        }
      ],
      prereq: ['p-circuit', 'p-ohm0'],
      tags: ['内部抵抗', '消費電力', '相加相乗平均', '場合分け']
    },

    /* ---------- 電流と磁場 ---------- */
    {
      id: 'p-adv-mag-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-mag',
      title: '磁場中の導体棒のつり合い',
      source: { univ: 'オリジナル' },
      time: 24,
      body: R`傾き $\theta$ のあらい斜面の上に、質量 $m=0.10\,\mathrm{kg}$、長さ $\ell=0.50\,\mathrm{m}$ の一様な導体棒を、斜面の水平な辺に平行になるように置く（図は斜面を、棒に垂直な方向から見たもので、棒は紙面に垂直である）。棒と斜面の間の静止摩擦係数を $\mu=0.50$ とし、$\tan\theta=\dfrac{3}{4}$（$\sin\theta=0.60,\ \cos\theta=0.80$）とする。鉛直上向きの一様な磁場（磁束密度 $B=0.40\,\mathrm{T}$）をかけ、棒に紙面の手前から奥へ向かって電流 $I$ を流す。このとき棒は、磁場から水平で斜面に向かう向きの力 $F=I\ell B$ を受ける。重力加速度の大きさを $g=9.8\,\mathrm{m/s^{2}}$ とし、棒は斜面上で静止している（すべらない）ものとして、力のつり合いを考える。`,
      fig: figRodSlope(),
      parts: [
        {
          label: '(1)',
          q: R`斜面が棒におよぼす垂直抗力 $N$ を $m,\ g,\ F,\ \theta$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$mg\cos\theta - F\sin\theta$`,
            R`$mg\cos\theta + F\cos\theta$`,
            R`$mg\cos\theta + F\sin\theta$`,
            R`$mg\sin\theta + F\cos\theta$`,
            R`$mg\cos\theta$`
          ],
          answer: 2
        },
        {
          label: '(2)',
          q: R`棒が斜面を下向きにすべり落ちないために必要な $F$ の最小値 $F_{\min}$ を $m,\ g,\ \theta,\ \mu$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$mg\,\dfrac{\sin\theta+\mu\cos\theta}{\cos\theta-\mu\sin\theta}$`,
            R`$mg\,\dfrac{\sin\theta-\mu\cos\theta}{\cos\theta-\mu\sin\theta}$`,
            R`$mg\,\dfrac{\sin\theta+\mu\cos\theta}{\cos\theta+\mu\sin\theta}$`,
            R`$mg\,\dfrac{\sin\theta-\mu\cos\theta}{\cos\theta+\mu\sin\theta}$`,
            R`$mg\,(\sin\theta-\mu\cos\theta)$`
          ],
          answer: 3
        },
        { label: '(3)', q: R`棒が斜面を下向きにすべり落ちないために必要な電流 $I$ の最小値は何 $\mathrm{A}$ か。`, type: 'num', answer: 0.891, rel: 0.02, unit: 'A' },
        { label: '(4)', q: R`棒が斜面を上向きにすべり上がらないための電流 $I$ の最大値は何 $\mathrm{A}$ か。`, type: 'num', answer: 9.8, rel: 0.02, unit: 'A' },
        {
          label: '(5)',
          q: R`摩擦の大きい斜面で、静止摩擦係数が $\mu=1.5$ のとき、電流 $I$ の大きさと棒の運動について、正しいものを選べ。（他の条件は同じとする。）`,
          type: 'choice',
          choices: [
            R`どんな大きさの電流でも、棒は斜面上で静止し続ける。`,
            R`電流が $0$ のとき、棒は斜面をすべり落ちる。`,
            R`$0\le I\le 9.8\,\mathrm{A}$ のときだけ静止し、それ以外ではすべる。`,
            R`電流がある大きさ以上になると、棒は斜面を上向きにすべり出す。`,
            R`電流が小さいほど安定で、大きくなると斜面を下向きにすべり出す。`
          ],
          answer: 0
        }
      ],
      solution: [
        {
          t: '棒にはたらく力',
          n: R`棒にはたらく力は、重力 $mg$（鉛直下向き）、斜面からの垂直抗力 $N$、静止摩擦力 $f$（斜面に沿う向き）、磁場から受ける力 $F=I\ell B$ です。電流は紙面の手前から奥へ、磁場は鉛直上向きなので、フレミングの左手の法則から、力 $F$ は**水平右向き**（斜面が高くなっている側、つまり斜面に向かう向き）にはたらきます。斜面に平行な成分は $F\cos\theta$（斜面上向き）、垂直な成分は $F\sin\theta$（斜面に押しつける向き）です。`,
          easy: R`左手の法則では、「中指（電流）・人さし指（磁場）・親指（力）」を互いに垂直にします。電流の向き（奥向き）に中指、磁場の向き（上向き）に人さし指を向けると、親指は右を向きます。この右向きの水平な力 $F$ を、斜面に沿った方向と、斜面に垂直な方向の 2 つに分けて考えます。`,
          lv: 1
        },
        {
          t: '斜面に垂直な方向のつり合い（(1)）',
          m: R`N = mg\cos\theta + F\sin\theta`,
          n: R`斜面に垂直な成分で、斜面から離れる向きの力は $N$ だけです。斜面に向かう向きの力は、重力の成分 $mg\cos\theta$ と、力 $F$ の成分 $F\sin\theta$ の 2 つです。$F$ は棒を斜面に押しつけるので、垂直抗力が増えます。`,
          lv: 1
        },
        {
          t: '下向きにすべり落ちる寸前（(2)(3)）',
          m: [R`F\cos\theta + \mu N = mg\sin\theta`,
              R`F\cos\theta + \mu\left(mg\cos\theta + F\sin\theta\right) = mg\sin\theta`,
              R`F_{\min} = mg\,\frac{\sin\theta-\mu\cos\theta}{\cos\theta+\mu\sin\theta} = 0.98\times\frac{0.60-0.40}{0.80+0.30} \approx 0.1782\,\mathrm{N}`,
              R`I_{\min} = \frac{F_{\min}}{\ell B} = \frac{0.1782}{0.50\times 0.40} \approx 0.891\,\mathrm{A}`],
          n: R`すべり落ちる寸前は、摩擦力が斜面の上向きに最大値 $\mu N$ をとります。斜面に沿う方向のつり合いは、「上向きの力（$F\cos\theta+\mu N$）＝下向きの力（$mg\sin\theta$）」です。$N$ に (1) を代入して $F$ について解きます。`,
          easy: R`電流が小さい（$F$ が小さい）と、棒は重力で斜面をすべり落ちようとします。それを、斜面上向きの摩擦力と、磁場から受ける力の斜面上向きの成分で支えます。すべり落ちる「ぎりぎり」のときは、摩擦力が最大値 $\mu N$ になります。ここで、$N$ も $F$ によって変わることに注意しましょう。`,
          pro: R`$\tan\varphi=\mu$ と置くと、$F_{\min}=mg\tan(\theta-\varphi)$。$\tan\theta=\dfrac{3}{4}$、$\tan\varphi=\dfrac{1}{2}$ なら $\tan(\theta-\varphi)=\dfrac{2}{11}$ で、$F_{\min}=0.98\times\dfrac{2}{11}\approx 0.178\,\mathrm{N}$（摩擦角 $\varphi$ の考え方）。`,
          lv: 1
        },
        {
          t: '上向きにすべり上がる寸前（(4)）',
          m: [R`F\cos\theta = mg\sin\theta + \mu\left(mg\cos\theta + F\sin\theta\right)`,
              R`F_{\max} = mg\,\frac{\sin\theta+\mu\cos\theta}{\cos\theta-\mu\sin\theta} = 0.98\times\frac{0.60+0.40}{0.80-0.30} = 1.96\,\mathrm{N}`,
              R`I_{\max} = \frac{1.96}{0.50\times 0.40} = 9.8\,\mathrm{A}`],
          n: R`今度は、電流が大きすぎて、棒が斜面を上にすべり上がろうとします。このとき摩擦力は斜面の**下向き**に最大値 $\mu N$ をとります。「上向きの力 $F\cos\theta$ ＝ 下向きの力 $mg\sin\theta+\mu N$」から $F_{\max}$ が求まります。以上から、棒が静止できる電流の範囲は $0.891\,\mathrm{A}\le I\le 9.8\,\mathrm{A}$ です。`,
          pro: R`$F_{\max}=mg\tan(\theta+\varphi)$。$\tan(\theta+\varphi)=\dfrac{3/4+1/2}{1-3/8}=2$ なので $F_{\max}=2mg=1.96\,\mathrm{N}$。`,
          lv: 1
        },
        {
          t: R`$\mu$ が大きいときの場合分け（(5)）`,
          m: [R`\mu \ge \tan\theta\ (=0.75) \;\Longrightarrow\; F_{\min}\le 0\quad(\text{電流なしでも静止})`,
              R`\mu \ge \frac{1}{\tan\theta}\ \left(=\frac{4}{3}\right) \;\Longrightarrow\; \cos\theta-\mu\sin\theta \le 0\quad(F_{\max}\ \text{は存在しない})`],
          n: R`$\mu=1.5$ は $\mu\ge\tan\theta=0.75$ なので、$F_{\min}$ の分子が負になり、電流が $0$ でも棒は静止します。また、$\mu=1.5\ge\dfrac{4}{3}$ なので、$F_{\max}$ の式の分母 $\cos\theta-\mu\sin\theta=0.80-0.90<0$ となります。これは、$F$ をいくら大きくしても、$F$ が棒を斜面に押しつける力が増え、静止摩擦力の上限もそれ以上に増えるため、棒が上向きにすべり出すことはない、という意味です（自己ロックの状態）。結局、どんな電流でも静止し続けます。`,
          lv: 1
        }
      ],
      prereq: ['p-mag', 'p-force0', 'p-eom'],
      tags: ['電流が磁場から受ける力', '静止摩擦力', '斜面', '場合分け']
    },

    /* ---------- 電磁誘導 ---------- */
    {
      id: 'p-adv-induction-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-induction',
      title: 'コンデンサーをつないだレール上の棒',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`水平面内に、間隔 $\ell=1.0\,\mathrm{m}$ の 2 本の平行な導体レールを置き、一端に電気容量 $C=0.40\,\mathrm{F}$ のコンデンサー（はじめの電気量は $0$）をつなぐ。レールの上に質量 $m=0.10\,\mathrm{kg}$ の導体棒をレールに垂直に置き、鉛直上向きに磁束密度 $B=0.50\,\mathrm{T}$ の一様な磁場をかける（図は上から見た図）。レール・導体棒・導線の電気抵抗と、回路の自己インダクタンスは無視でき、棒はレールの上をなめらかにすべる。時刻 $t=0$ に静止していた棒に、レールに平行な一定の力 $F=0.40\,\mathrm{N}$ を加え続けると、棒は動きはじめた。棒の速さを $v$、加速度を $a$ とする。`,
      fig: figRailCapacitor(),
      parts: [
        {
          label: '(1)',
          q: R`速さ $v$ のとき、コンデンサーにたまっている電気量 $q$ を $C,\ B,\ \ell,\ v$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{Bv\ell}{C}$`,
            R`$\dfrac{CBv}{\ell}$`,
            R`$CBv\ell$`,
            R`$CB^{2}v\ell$`,
            R`$CBv\ell^{2}$`
          ],
          answer: 2
        },
        {
          label: '(2)',
          q: R`棒の加速度 $a$（一定になる）を $F,\ m,\ C,\ B,\ \ell$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{F}{m}$`,
            R`$\dfrac{F}{m+CB\ell}$`,
            R`$\dfrac{F+CB^{2}\ell^{2}}{m}$`,
            R`$\dfrac{F}{m-CB^{2}\ell^{2}}$`,
            R`$\dfrac{F}{m+CB^{2}\ell^{2}}$`
          ],
          answer: 4
        },
        { label: '(3)', q: R`$a$ は何 $\mathrm{m/s^{2}}$ か。`, type: 'num', answer: 2, rel: 0.02, unit: 'm/s²' },
        { label: '(4)', q: R`$t=3.0\,\mathrm{s}$ のとき、コンデンサーに蓄えられている静電エネルギーは何 $\mathrm{J}$ か。`, type: 'num', answer: 1.8, rel: 0.02, unit: 'J' },
        {
          label: '(5)',
          q: R`$t=3.0\,\mathrm{s}$ に、棒を引く力 $F$ を急に $0$ にした。その後の棒の運動について、正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`速さが減少し、やがて静止する。`,
            R`コンデンサーが放電して、棒の速さはさらに増加する。`,
            R`コンデンサーの電流が逆向きに流れて、棒は逆向きに動き出す。`,
            R`速さは減少しつづけ、$6.0\,\mathrm{m/s}$ より遅い一定の速さになる。`,
            R`一定の速さ $6.0\,\mathrm{m/s}$ で等速直線運動を続ける。`
          ],
          answer: 4
        }
      ],
      solution: [
        {
          t: '誘導起電力とコンデンサーの電気量（(1)）',
          m: [R`V = vB\ell`,
              R`q = CV = CBv\ell`],
          n: R`棒が速さ $v$ で磁場を横切ると、棒に誘導起電力 $V=vB\ell$ が生じます。回路に抵抗がないので、コンデンサーの極板間の電圧は常にこの起電力に等しくなり、電気量は $q=CV$ です。`,
          easy: R`磁場の中を導体の棒が動くと、棒の両端に電圧（誘導起電力）が生じます。大きさは、「磁束密度 $B$ × 棒の長さ $\ell$ × 速さ $v$」です。コンデンサーは、この電圧で充電されるので、電気量は、容量 $C$ × 電圧 $V$ です。抵抗がないので、棒の速さが変わるとすぐに、コンデンサーの電気量もそれに追いつきます。`,
          lv: 1
        },
        {
          t: '電流と棒が受ける力',
          m: [R`I = \frac{\Delta q}{\Delta t} = CB\ell\,\frac{\Delta v}{\Delta t} = CB\ell\,a`,
              R`f = IB\ell = CB^{2}\ell^{2}\,a\quad(\text{運動を妨げる向き})`],
          n: R`コンデンサーの電気量は棒の速さに比例して増えるので、電流は $I=\dfrac{\Delta q}{\Delta t}=CB\ell a$ です。この電流が磁場から受ける力は大きさ $IB\ell$ で、レンツの法則から、棒の運動を妨げる向き（$F$ と逆向き）になります。`,
          lv: 1
        },
        {
          t: '運動方程式（(2)(3)）',
          m: [R`ma = F - CB^{2}\ell^{2}\,a`,
              R`a = \frac{F}{m+CB^{2}\ell^{2}} = \frac{0.40}{0.10+0.40\times 0.50^{2}\times 1.0^{2}} = \frac{0.40}{0.20} = 2.0\,\mathrm{m/s^{2}}`],
          n: R`棒にはたらく力は、$F$ と、電流が磁場から受ける力 $CB^{2}\ell^{2}a$ です。右辺の $a$ に比例する項を左辺に移すと、$(m+CB^{2}\ell^{2})a=F$ となります。つまり、コンデンサーをつなぐと、棒の質量が $CB^{2}\ell^{2}$ だけ増えたように振る舞い、加速度は時間によらず一定（等加速度運動）になります。`,
          easy: R`コンデンサーがつながっていると、棒が加速するほど電流（棒を押し返す力）が増えます。その力は加速度に比例するので、「加速度に比例する力」は、質量が増えたことと同じ効果になります。これを「見かけの質量」の増加と考えて、$m+CB^{2}\ell^{2}$ の物体に力 $F$ がはたらいていると考えれば、$a=\dfrac{F}{m+CB^{2}\ell^{2}}$ と覚えやすくなります。`,
          pro: R`$CB^{2}\ell^{2}$ は質量の単位（kg）をもつ量。ここでは $0.10\,\mathrm{kg}$ で、ちょうど $m$ と同じ。単位の確認（次元）で式の誤りに気づける。`,
          lv: 1
        },
        {
          t: 'コンデンサーのエネルギー（(4)）',
          m: [R`v = at = 2.0\times 3.0 = 6.0\,\mathrm{m/s},\qquad q = CBv\ell = 0.40\times 0.50\times 6.0\times 1.0 = 1.2\,\mathrm{C}`,
              R`U = \frac{q^{2}}{2C} = \frac{1.2^{2}}{2\times 0.40} = 1.8\,\mathrm{J}`],
          n: R`確認として、エネルギーの収支を見ます。外力がした仕事は $F\times\dfrac{1}{2}at^{2}=0.40\times 9.0=3.6\,\mathrm{J}$ で、棒の運動エネルギー $\dfrac{1}{2}mv^{2}=1.8\,\mathrm{J}$ と、コンデンサーの静電エネルギー $U=1.8\,\mathrm{J}$ の和になっています。この問題では、$CB^{2}\ell^{2}=m$ なので、2 つが等しく半分ずつになります。抵抗がないので、熱は発生しません。`,
          pro: R`エネルギーの比は $\dfrac{U}{K}=\dfrac{\frac{1}{2}CB^{2}\ell^{2}v^{2}}{\frac{1}{2}mv^{2}}=\dfrac{CB^{2}\ell^{2}}{m}$（常に一定）。`,
          lv: 1
        },
        {
          t: '力を取り去った後の運動（(5)）',
          n: R`$t=3.0\,\mathrm{s}$ に力を $0$ にした直後、棒の速さは $6.0\,\mathrm{m/s}$ で、コンデンサーの電圧は $B\ell v=3.0\,\mathrm{V}$ です。この電圧は、棒の誘導起電力 $B\ell v$ とちょうど等しいので、回路を流れる電流は $0$ になり、棒に力ははたらきません。棒の速さが変わらないかぎり、起電力もコンデンサーの電圧も変わらず、電流は $0$ のままです。回路に抵抗がなくエネルギーの損失もないので、棒は**一定の速さ $6.0\,\mathrm{m/s}$ で等速直線運動を続けます**。`,
          easy: R`コンデンサーは、棒の起電力と同じ電圧まで充電されています。棒が一定の速さで動き続ければ、起電力は変わらず、コンデンサーの電圧もそのままなので、2 つの電圧がつり合って電流が流れません。電流が流れないので、棒には力がはたらかず、棒は、慣性の法則にしたがって、同じ速さで動き続けます。`,
          lv: 1
        }
      ],
      prereq: ['p-induction', 'p-mag', 'p-estat', 'p-eom'],
      tags: ['誘導起電力', 'コンデンサー', '見かけの質量', '等加速度運動']
    }

  ]);

  /* ---------- 交流 ---------- */
  // RLC 直列回路（実効値 100 V の交流電源）
  function figRLC() {
    const d = D(360, 204);
    const sx = 92, sy = 104;
    d.acsource(sx, sy, 20);
    d.wire([[sx, sy - 20], [sx, 46], [132, 46]]);
    d.resistor(132, 46, 196, 46, { label: 'R' });
    d.coil(196, 46, 268, 46, { label: 'L' });
    d.capacitor(268, 46, 330, 46, { label: 'C' });
    d.wire([[330, 46], [346, 46], [346, 162], [sx, 162], [sx, sy + 20]]);
    d.text(sx - 28, sy + 2, '100 V', { anchor: 'end' });
    d.text(sx - 28, sy + 20, '（実効値）', { anchor: 'end', size: 11, cls: 'dim' });
    d.text(220, 112, '角周波数 ω を変えられる', { size: 12, cls: 'dim' });
    d.text(220, 190, 'R = 60 Ω、L = 0.10 H、C = 10 μF', { size: 12 });
    return d.svg();
  }

  /* ---------- 光の粒子性 ---------- */
  // 光電管と外部回路
  function figPhotocell() {
    const d = D(360, 236);
    const cx = 200, cy = 82, rr = 50;
    d.circle(cx, cy, rr, { cls: 'fg', fill: 'f0' });
    d.line(cx - 30, cy - 34, cx - 30, cy + 34, { cls: 'c1', w: 5 });
    d.line(cx + 32, cy - 24, cx + 32, cy + 24, { cls: 'c2', w: 5 });
    d.text(cx - 42, cy - 40, 'K', { size: 14, italic: true });
    d.text(cx + 42, cy - 30, 'P', { size: 14, italic: true, anchor: 'start' });
    [0, 1, 2].forEach(function (k) { d.arrow(26, 22 + 26 * k, cx - 38, cy - 22 + 22 * k, { cls: 'c3', w: 1.6 }); });
    d.text(30, 14, '光（波長 λ₁ = 3.0×10⁻⁷ m）', { anchor: 'start', size: 12 });
    // 外部回路
    d.wire([[cx - 30, cy + 34], [cx - 30, 138]]);
    d.meter(cx - 30, 152, 12, 'A');
    d.wire([[cx - 30, 164], [cx - 30, 198], [cx - 6, 198]]);
    d.battery(cx - 6, 198, cx + 32, 198);
    d.wire([[cx + 32, 198], [cx + 32, cy + 24]]);
    d.arrow(cx - 4, 214, cx + 30, 188, { cls: 'c4', w: 1.5 });
    d.text(cx + 52, 198, '可変電圧 V', { size: 12, anchor: 'start' });
    d.text(352, 24, 'W = 2.0 eV', { anchor: 'end' });
    d.text(352, 42, 'P₁ = 1.0 mW', { anchor: 'end' });
    d.text(352, 60, '飽和電流 1.2 μA', { anchor: 'end' });
    return d.svg();
  }
  // 選択肢用: 光電流 I と電圧 V の関係（破線: 元の光、実線: 新しい光）。阻止電圧 V0、飽和電流 Is
  function figIV(V0n, Isn) {
    const cur = function (V0, Is) { return function (V) { return V <= -V0 ? 0 : Math.min(Is, Is * (V + V0) / 6); }; };
    return G({
      w: 230, h: 168, x: [-8, 6], y: [0, 1.5], axis: ['V', 'I'],
      curves: [
        { f: cur(2.125, 1.2), cls: 'dim', dash: true },
        { f: cur(V0n, Isn), cls: 'c1' }
      ]
    });
  }

  /* ---------- 原子構造 ---------- */
  // 水素原子と He⁺ のエネルギー準位（縦軸は対数的に配置。等間隔ではない）
  function figLevels() {
    const d = D(360, 268);
    const Ey = function (E) { return 250 - 128 * (Math.log(54.4) - Math.log(-E)) / Math.LN10; };
    const hx0 = 86, hx1 = 150, gx0 = 196, gx1 = 258;
    const H = [[1, -13.6, '−13.6'], [2, -3.40, '−3.40'], [3, -1.51, '−1.51']];
    const He = [[1, -54.4, '−54.4'], [2, -13.6, '−13.6'], [3, -6.04, '−6.04'], [4, -3.40, '−3.40'], [5, -2.18, '−2.18'], [6, -1.51, '−1.51']];
    d.text((hx0 + hx1) / 2, 18, '水素原子', { size: 12 });
    d.text((gx0 + gx1) / 2, 18, 'He⁺', { size: 12 });
    H.forEach(function (p) {
      d.line(hx0, Ey(p[1]), hx1, Ey(p[1]), { cls: 'c1', w: 2 });
      d.text(hx0 - 6, Ey(p[1]) + 4, 'n=' + p[0] + '  ' + p[2], { anchor: 'end', size: 11 });
    });
    He.forEach(function (p) {
      d.line(gx0, Ey(p[1]), gx1, Ey(p[1]), { cls: 'c2', w: 2 });
      d.text(gx1 + 6, Ey(p[1]) + 4, 'n=' + p[0] + '  ' + p[2], { anchor: 'start', size: 11 });
    });
    [[-13.6], [-3.40], [-1.51]].forEach(function (p) {
      d.line(hx1, Ey(p[0]), gx0, Ey(p[0]), { cls: 'dim', dash: true, w: 1 });
    });
    d.arrow(hx0 + 32, Ey(-1.51) + 2, hx0 + 32, Ey(-3.40) - 2, { cls: 'c3' });
    d.arrow(gx0 + 32, Ey(-1.51) + 2, gx0 + 32, Ey(-3.40) - 2, { cls: 'c3' });
    d.arrow(gx0 + 14, Ey(-13.6) + 2, gx0 + 14, Ey(-54.4) - 2, { cls: 'c4' });
    d.text(14, 222, '縦軸: エネルギー [eV]', { anchor: 'start', size: 11, cls: 'dim' });
    d.text(14, 240, '（目盛りの間隔は等間隔でない）', { anchor: 'start', size: 11, cls: 'dim' });
    return d.svg();
  }

  JK.registerProblems([

    /* ---------- 交流 ---------- */
    {
      id: 'p-adv-ac-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-ac',
      title: 'RLC 直列回路と共振',
      source: { univ: 'オリジナル' },
      time: 24,
      body: R`抵抗値 $R=60\,\Omega$ の抵抗、自己インダクタンス $L=0.10\,\mathrm{H}$ のコイル、電気容量 $C=10\,\mu\mathrm{F}$ のコンデンサーを直列につなぎ、実効値 $V_{\mathrm{e}}=100\,\mathrm{V}$ で、角周波数 $\omega$ を変えられる交流電源につないだ（図）。コイルの抵抗や電源の内部抵抗は無視できる。`,
      fig: figRLC(),
      parts: [
        {
          label: '(1)',
          q: R`この回路のインピーダンス $Z$ を $R,\ L,\ C,\ \omega$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\sqrt{R^{2}+\left(\omega L-\dfrac{1}{\omega C}\right)^{2}}$`,
            R`$R+\omega L+\dfrac{1}{\omega C}$`,
            R`$\sqrt{R^{2}+\left(\omega L+\dfrac{1}{\omega C}\right)^{2}}$`,
            R`$\sqrt{R^{2}+\omega^{2}L^{2}+\omega^{2}C^{2}}$`,
            R`$\sqrt{R^{2}+\left(\omega L-\omega C\right)^{2}}$`
          ],
          answer: 0
        },
        { label: '(2)', q: R`電流が最大になる（共振する）ときの角周波数 $\omega_{0}$ は何 $\mathrm{rad/s}$ か。`, type: 'num', answer: 1000, rel: 0.02, unit: 'rad/s', hint: R`例: 1.5e3` },
        { label: '(3)', q: R`$\omega=800\,\mathrm{rad/s}$ のとき、抵抗で消費される平均の電力は何 $\mathrm{W}$ か。`, type: 'num', answer: 107, rel: 0.02, unit: 'W' },
        { label: '(4)', q: R`(3) のとき、電流の位相は、電源電圧の位相に比べて何度進んでいるか（遅れているときは負の値で答えよ）。`, type: 'num', answer: 36.9, rel: 0.02, unit: '度' },
        { label: '(5)', q: R`抵抗で消費される平均の電力が、共振のときの電力の半分になる角周波数は 2 つある。そのうち大きいほうは何 $\mathrm{rad/s}$ か。`, type: 'num', answer: 1344, rel: 0.02, unit: 'rad/s', hint: R`例: 1.5e3` }
      ],
      solution: [
        {
          t: '抵抗・コイル・コンデンサーの交流での性質',
          m: R`X_{L} = \omega L,\qquad X_{C} = \frac{1}{\omega C}\qquad(\text{リアクタンス})`,
          n: R`交流電源につないだとき、抵抗では電圧と電流の位相が同じです。コイルでは電流が電圧より $\dfrac{\pi}{2}$ **遅れ**、コンデンサーでは電流が電圧より $\dfrac{\pi}{2}$ **進み**ます。電圧の最大値と電流の最大値の比（実効値の比も同じ）は、コイルでは $\omega L$、コンデンサーでは $\dfrac{1}{\omega C}$ で、これらを**リアクタンス**といいます。`,
          easy: R`コイルは、電流が変化するのをいやがるので、「角周波数 $\omega$ が大きいほど電流が流れにくい」はたらきをします（$\omega L$）。コンデンサーは、直流は流さず、交流の角周波数が大きいほど電流が流れやすくなります（$\dfrac{1}{\omega C}$）。コイルとコンデンサーでは、電流の位相が逆向きにずれるので、2 つのはたらきは、おたがいに打ち消しあいます。`,
          lv: 1
        },
        {
          t: 'インピーダンス（(1)）',
          m: [R`Z = \sqrt{R^{2}+\left(\omega L-\frac{1}{\omega C}\right)^{2}}`,
              R`V_{\mathrm{e}} = I_{\mathrm{e}}Z`],
          n: R`直列回路では、どの素子にも同じ電流が流れます。位相が同じ抵抗の電圧と、位相が $\dfrac{\pi}{2}$ 進んでいる「コイルの電圧 − コンデンサーの電圧」を、直角三角形の 2 辺として合成します。したがって、$R$ と、$\left(\omega L-\dfrac{1}{\omega C}\right)$ の 2 乗の和の平方根が、回路全体の電圧と電流の比 $Z$ になります。`,
          pro: R`$Z$ は「$R$ と $(X_{L}-X_{C})$ の三平方の定理」。コイルとコンデンサーの電圧は逆位相なので、足すのではなく**引く**。`,
          lv: 1
        },
        {
          t: '共振の角周波数（(2)）',
          m: [R`\omega L = \frac{1}{\omega C} \;\Longrightarrow\; \omega_{0} = \frac{1}{\sqrt{LC}} = \frac{1}{\sqrt{0.10\times 1.0\times 10^{-5}}} = 1.0\times 10^{3}\,\mathrm{rad/s}`],
          n: R`$X_{L}=X_{C}$ のとき $Z=R$ で最小になり、電流の実効値 $I_{\mathrm{e}}=\dfrac{V_{\mathrm{e}}}{R}$ が最大になります（共振）。このとき、電流と電源電圧は同位相になります。`,
          lv: 1
        },
        {
          t: R`$\omega=800\,\mathrm{rad/s}$ のときの消費電力（(3)）`,
          m: [R`X_{L} = 800\times 0.10 = 80\,\Omega,\qquad X_{C} = \frac{1}{800\times 1.0\times 10^{-5}} = 125\,\Omega`,
              R`Z = \sqrt{60^{2}+(80-125)^{2}} = \sqrt{5625} = 75\,\Omega,\qquad I_{\mathrm{e}} = \frac{100}{75} = \frac{4}{3}\,\mathrm{A}`,
              R`P = I_{\mathrm{e}}^{2}R = \left(\frac{4}{3}\right)^{2}\times 60 \approx 107\,\mathrm{W}`],
          n: R`電力を消費するのは抵抗だけで、コイルとコンデンサーは電力を消費しません（エネルギーを一時的にためて返すだけ）。平均の電力は、実効値を使って $P=I_{\mathrm{e}}^{2}R$ です。共振のとき（$\omega=\omega_{0}$）は $I_{\mathrm{e}}=\dfrac{100}{60}\approx 1.67\,\mathrm{A}$、$P_{\max}=\dfrac{V_{\mathrm{e}}^{2}}{R}\approx 167\,\mathrm{W}$ で、$\omega=800$ の電力はそれより小さくなります。`,
          lv: 1
        },
        {
          t: '電流の位相（(4)）',
          m: R`\tan\varphi = \frac{X_{C}-X_{L}}{R} = \frac{125-80}{60} = \frac{3}{4} \;\Longrightarrow\; \varphi \approx 37\degree\ (\text{電流が進む})`,
          n: R`コンデンサーのリアクタンスのほうが大きい（$X_{C}>X_{L}$、「容量性」）ので、回路全体としてコンデンサーの性質が強く出て、電流が電圧より進みます。$\omega>\omega_{0}$ ならコイルの性質が強く出て、電流は遅れます。$\omega=\omega_{0}$ では位相差は $0$ です。`,
          easy: R`コイルとコンデンサーの「勝ち負け」で決まります。$\omega$ が小さい（$\omega<\omega_{0}$）ときはコンデンサーのほうが強く（$X_{C}>X_{L}$）、電流が電圧より進みます。逆に $\omega$ が大きいとコイルのほうが強く、電流が遅れます。ちょうど等しい共振のときは、位相のずれがありません。`,
          lv: 1
        },
        {
          t: '電力が半分になる角周波数（(5)）',
          m: [R`P = \frac{V_{\mathrm{e}}^{2}R}{Z^{2}} = \frac{P_{\max}}{2} \;\Longleftrightarrow\; Z^{2} = 2R^{2} \;\Longleftrightarrow\; \left|\omega L-\frac{1}{\omega C}\right| = R`],
          n: R`$P\propto\dfrac{1}{Z^{2}}$ なので、電力が半分になるのは $Z^{2}=2R^{2}$、すなわち $(X_{L}-X_{C})^{2}=R^{2}$ のときです。大きいほうの $\omega$（$X_{L}>X_{C}$）では $\omega L-\dfrac{1}{\omega C}=R$ から、$LC\omega^{2}-RC\omega-1=0$ となります。$LC=1.0\times 10^{-6}$、$RC=6.0\times 10^{-4}$ を代入して $\omega=\dfrac{RC+\sqrt{(RC)^{2}+4LC}}{2LC}=\dfrac{6.0\times 10^{-4}+2.09\times 10^{-3}}{2.0\times 10^{-6}}\approx 1.34\times 10^{3}\,\mathrm{rad/s}$ です。`,
          pro: R`小さいほう（$\omega L-\dfrac{1}{\omega C}=-R$）は $\omega\approx 744\,\mathrm{rad/s}$。2 つの差は $\dfrac{R}{L}=600\,\mathrm{rad/s}$ で、共振の「鋭さ」を表します（$R$ が小さいほど鋭い）。`,
          lv: 1
        }
      ],
      prereq: ['p-ac', 'p-induction', 'p-circuit'],
      tags: ['RLC 直列', '共振', '位相', '消費電力']
    },

    /* ---------- 光の粒子性 ---------- */
    {
      id: 'p-adv-photon-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-photon',
      title: '光電管の光子数と電流-電圧曲線',
      source: { univ: 'オリジナル' },
      time: 22,
      body: R`光電管の陰極 K に、波長 $\lambda_{1}=3.0\times 10^{-7}\,\mathrm{m}$ の単色光を当てると、光電子が飛び出して陽極 P に向かう（図）。陰極 K の金属の仕事関数は $W=2.0\,\mathrm{eV}$ である。当てている光の強さ（光が運ぶエネルギーの、単位時間あたりの量。仕事率）は $P_{1}=1.0\,\mathrm{mW}$ で、K と P の間の電圧 $V$（P が K に対して高電位のとき正）を変えながら光電流 $I$ を測定したところ、$V$ を十分に大きくすると、$I$ は一定値 $I_{\mathrm{s}}=1.2\,\mu\mathrm{A}$（飽和電流）に達した。プランク定数を $h=6.6\times 10^{-34}\,\mathrm{J\cdot s}$、光速を $c=3.0\times 10^{8}\,\mathrm{m/s}$、電気素量を $e=1.6\times 10^{-19}\,\mathrm{C}$、$1\,\mathrm{eV}=1.6\times 10^{-19}\,\mathrm{J}$ とする。`,
      fig: figPhotocell(),
      parts: [
        { label: '(1)', q: R`光電流が $0$ になる電圧（阻止電圧）の大きさ $V_{0}$ は何 $\mathrm{V}$ か。`, type: 'num', answer: 2.125, rel: 0.02, unit: 'V' },
        {
          label: '(2)',
          q: R`単位時間あたりに陰極 K に当たる光子の数 $N$ を $P_{1},\ \lambda_{1},\ h,\ c$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{P_{1}hc}{\lambda_{1}}$`,
            R`$\dfrac{P_{1}h}{\lambda_{1}c}$`,
            R`$\dfrac{P_{1}\lambda_{1}}{hc}$`,
            R`$\dfrac{P_{1}}{hc\lambda_{1}}$`,
            R`$\dfrac{hc}{P_{1}\lambda_{1}}$`
          ],
          answer: 2
        },
        { label: '(3)', q: R`K に当たった光子のうち、光電子を飛び出させた光子の割合は何 $\%$ か。ただし、飽和電流は、飛び出した光電子がすべて P に達したときの電流である。`, type: 'num', answer: 0.495, rel: 0.02, unit: '%' },
        {
          label: '(4)',
          q: R`光の強さ $P_{1}$ は変えずに、光の波長を $\dfrac{\lambda_{1}}{2}$（振動数を $2$ 倍）にした。光子 1 個が光電子を飛び出させる割合は変わらないものとする。このときの $I$ と $V$ の関係を表すグラフとして最も適当なものを選べ（各図の破線は、波長 $\lambda_{1}$ のときのグラフ）。`,
          type: 'choice',
          choices: [
            { t: 'ア', fig: figIV(6.25, 1.2) },
            { t: 'イ', fig: figIV(2.125, 0.6) },
            { t: 'ウ', fig: figIV(6.25, 0.6) },
            { t: 'エ', fig: figIV(4.25, 0.6) }
          ],
          answer: 2
        },
        { label: '(5)', q: R`(4) のときの阻止電圧の大きさは何 $\mathrm{V}$ か。`, type: 'num', answer: 6.25, rel: 0.02, unit: 'V' }
      ],
      solution: [
        {
          t: '光電流と電圧のグラフが表すもの',
          n: R`光電流 $I$ と電圧 $V$ のグラフでは、$V$ を十分に大きくしたときの一定値（**飽和電流** $I_{\mathrm{s}}$）が、1 秒間に K から飛び出して P に届いた光電子の**個数**（電子 1 個の電気量 $e$ をかけたもの）を表し、電流が $0$ になる電圧（**阻止電圧** $V_{0}$）が、飛び出した光電子の運動エネルギーの**最大値**を表します（$eV_{0}=K_{\max}$）。つまり、$I_{\mathrm{s}}$ は光子の「数」、$V_{0}$ は光子 1 個の「エネルギー」を調べる手がかりです。`,
          easy: R`光電管のグラフは 2 つのことを教えてくれます。1 つ目は、グラフが横ばいになる高さ（飽和電流）で、1 秒間に光電子が何個、飛び出したかを表します。2 つ目は、電流が $0$ になる電圧（阻止電圧）で、これは、いちばん勢いのよい光電子の運動エネルギーで決まります。向かい風（逆向きの電圧）で、いちばん勢いのよい電子まで止めるのに、ちょうどよい強さが $V_{0}$ です。`,
          lv: 1
        },
        {
          t: '光子 1 個のエネルギーと阻止電圧（(1)）',
          m: [R`\varepsilon_{1} = \frac{hc}{\lambda_{1}} = \frac{6.6\times 10^{-34}\times 3.0\times 10^{8}}{3.0\times 10^{-7}} = 6.6\times 10^{-19}\,\mathrm{J} = 4.125\,\mathrm{eV}`,
              R`K_{\max} = \varepsilon_{1} - W = 4.125-2.0 = 2.125\,\mathrm{eV},\qquad eV_{0} = K_{\max}\;\Rightarrow\; V_{0} = 2.125\,\mathrm{V}`],
          n: R`光電効果では、光子 1 個のエネルギー $h\nu=\dfrac{hc}{\lambda}$ が、電子を金属から取り出す仕事（仕事関数 $W$）と、飛び出した電子の運動エネルギーに使われます。もっとも速い光電子の運動エネルギー $K_{\max}$ が、阻止電圧で止められる限界なので、$eV_{0}=K_{\max}$ です。`,
          easy: R`光は、「光子」というエネルギーの粒の集まりと考えます。光子 1 個のエネルギーは $\dfrac{hc}{\lambda}$（波長が短いほど大きい）です。金属から電子を 1 個取り出すのに必要なエネルギーが仕事関数 $W$ で、残りが電子の運動エネルギーになります。向かい風の電圧（阻止電圧）で電子をちょうど止められるときの電圧が $V_{0}$ で、$eV_{0}$ が電子の運動エネルギーに等しくなります。`,
          lv: 1
        },
        {
          t: '1 秒間に当たる光子の数（(2)）',
          m: R`N = \frac{P_{1}}{h c/\lambda_{1}} = \frac{P_{1}\lambda_{1}}{hc} = \frac{1.0\times 10^{-3}\times 3.0\times 10^{-7}}{6.6\times 10^{-34}\times 3.0\times 10^{8}} \approx 1.515\times 10^{15}\,\text{個/s}`,
          n: R`光の強さ $P_{1}$ は、1 秒間に運ぶ光のエネルギーです。これを光子 1 個のエネルギー $\dfrac{hc}{\lambda_{1}}$ で割れば、1 秒間の光子の数になります。次元で確かめると、$\dfrac{[\mathrm{J/s}]\,[\mathrm{m}]}{[\mathrm{J\cdot s}]\,[\mathrm{m/s}]}=[1/\mathrm{s}]$ となり、「1 秒あたりの個数」になっています。`,
          pro: R`「光の強さ $P$ が同じなら、波長が長いほど光子の数が多い」。$N\propto\lambda$。`,
          lv: 1
        },
        {
          t: '光電子になった割合（(3)）',
          m: [R`n_{\mathrm{e}} = \frac{I_{\mathrm{s}}}{e} = \frac{1.2\times 10^{-6}}{1.6\times 10^{-19}} = 7.5\times 10^{12}\,\text{個/s}`,
              R`\frac{n_{\mathrm{e}}}{N} = \frac{7.5\times 10^{12}}{1.515\times 10^{15}} \approx 4.95\times 10^{-3} = 0.495\,\%`],
          n: R`飽和電流 $I_{\mathrm{s}}$ は、1 秒間に K から P に達した電子の電気量なので、電子の個数は $\dfrac{I_{\mathrm{s}}}{e}$ です。光子 200 個に約 1 個の割合で光電子が出ていることになります。`,
          lv: 1
        },
        {
          t: '振動数を 2 倍にした場合（(4)(5)）',
          m: [R`h\nu' = 2\times 4.125 = 8.25\,\mathrm{eV},\qquad eV_{0}' = 8.25-2.0 = 6.25\,\mathrm{eV}\;\Rightarrow\; V_{0}' = 6.25\,\mathrm{V}`,
              R`N' = \frac{P_{1}}{2\varepsilon_{1}} = \frac{N}{2}\;\Rightarrow\; I_{\mathrm{s}}' = \frac{I_{\mathrm{s}}}{2} = 0.6\,\mu\mathrm{A}`],
          n: R`光子 1 個のエネルギーが 2 倍になるので、阻止電圧は大きくなります（ただし 2 倍ではなく、$h\nu$ が 2 倍で、そこから仕事関数を引くので、$2.125\,\mathrm{V}\to 6.25\,\mathrm{V}$ です）。一方、光の強さ（仕事率）が同じなので、光子の数は半分になり、光電子の数も半分、つまり飽和電流は半分の $0.6\,\mu\mathrm{A}$ になります。したがって、グラフは「左へ移動し、飽和電流が小さくなる」図 **ウ** です。`,
          easy: R`光の強さを同じにしたまま、振動数を 2 倍にすると、1 個の光子が運ぶエネルギーが 2 倍になるので、光子の個数は半分になります。光電子の個数も半分になり、飽和電流が半分になります。一方、光電子 1 個のエネルギー（阻止電圧に対応）は、光子 1 個のエネルギーが増えたぶん大きくなります。「光の強さ（個数）」と「光の振動数（1 個のエネルギー）」を区別するのが大切です。`,
          pro: R`「飽和電流は光子の**数**で決まり、阻止電圧は光子 1 個のエネルギー（振動数）で決まる」。強さを変えず振動数だけ変えると、数も変わることに注意。`,
          lv: 1
        }
      ],
      prereq: ['p-photon', 'p-wave', 'p-energy'],
      tags: ['光電効果', '光子数', '阻止電圧', '光電流のグラフ']
    },

    /* ---------- 原子構造 ---------- */
    {
      id: 'p-adv-atom-01',
      subject: 'physics',
      level: 'adv',
      unit: 'p-atom',
      title: 'ボーア模型と水素類似イオン',
      source: { univ: 'オリジナル' },
      time: 24,
      body: R`原子番号 $Z$ の原子核（電荷 $+Ze$）のまわりを、電子 1 個（質量 $m$、電荷 $-e$）が円運動している「水素類似イオン」を、ボーアの模型で考える。電子の円軌道の半径を $r$、速さを $v$ とし、量子条件 $mvr=n\dfrac{h}{2\pi}$（$n=1,2,3,\cdots$）が成り立つものとする。クーロンの法則の比例定数は $\dfrac{1}{4\pi\varepsilon_{0}}$ である。数値を求める設問では、プランク定数 $h=6.63\times 10^{-34}\,\mathrm{J\cdot s}$、電気素量 $e=1.60\times 10^{-19}\,\mathrm{C}$、電子の質量 $m=9.11\times 10^{-31}\,\mathrm{kg}$、真空の誘電率 $\varepsilon_{0}=8.85\times 10^{-12}\,\mathrm{F/m}$、光速 $c=3.00\times 10^{8}\,\mathrm{m/s}$、$1\,\mathrm{eV}=1.60\times 10^{-19}\,\mathrm{J}$ を用い、水素原子（$Z=1$）のエネルギー準位は $E_{n}=-\dfrac{13.6}{n^{2}}\,\mathrm{eV}$ としてよい。`,
      fig: figLevels(),
      parts: [
        {
          label: '(1)',
          q: R`量子数 $n$ の軌道の半径 $r_{n}$ を $\varepsilon_{0},\ h,\ n,\ Z,\ m,\ e$ で表した式として正しいものを選べ。`,
          type: 'choice',
          choices: [
            R`$\dfrac{\varepsilon_{0}h^{2}n^{2}Z}{\pi m e^{2}}$`,
            R`$\dfrac{\varepsilon_{0}h^{2}n}{\pi Z m e^{2}}$`,
            R`$\dfrac{\varepsilon_{0}h^{2}n^{2}}{2\pi Z m e^{2}}$`,
            R`$\dfrac{4\pi\varepsilon_{0}h^{2}n^{2}}{Z m e^{2}}$`,
            R`$\dfrac{\varepsilon_{0}h^{2}n^{2}}{\pi Z m e^{2}}$`
          ],
          answer: 4
        },
        { label: '(2)', q: R`水素原子（$Z=1$）の基底状態（$n=1$）で、電子の速さは何 $\mathrm{m/s}$ か。`, type: 'num', answer: 2180000, rel: 0.02, unit: 'm/s', hint: R`例: 2.0e6` },
        { label: '(3)', q: R`$\mathrm{He^{+}}$（$Z=2$）が $n=2$ の状態から $n=1$ の状態に移るときに放出する光の波長は何 $\mathrm{m}$ か。`, type: 'num', answer: 3.05e-8, rel: 0.02, unit: 'm', hint: R`例: 1.5×10^3 は 1.5e3、2.0×10^-4 は 2.0e-4 と入力` },
        { label: '(4)', q: R`$\mathrm{He^{+}}$ が、$n=a$ の状態から $n=b$ の状態に移るときに放出する光の波長が、水素原子が $n=3$ から $n=2$ に移るときに放出する光の波長と等しい（$a>b$ は整数）。$a$ は何か。`, type: 'num', answer: 6, rel: 0.02, hint: R`整数で答える` },
        { label: '(5)', q: R`静止している水素原子（質量 $1.67\times 10^{-27}\,\mathrm{kg}$）が、$n=2$ から $n=1$ に移って光子を 1 個放出した。光子が運動量をもっていることから、水素原子は反跳する。反跳した水素原子の速さは何 $\mathrm{m/s}$ か。（エネルギーのうち、反跳に使われる分は無視してよい。）`, type: 'num', answer: 3.26, rel: 0.02, unit: 'm/s' }
      ],
      solution: [
        {
          t: '円運動の式と量子条件',
          m: [R`m\frac{v^{2}}{r} = \frac{1}{4\pi\varepsilon_{0}}\cdot\frac{Ze\cdot e}{r^{2}}\qquad(\text{クーロン力が向心力})`,
              R`mvr = n\frac{h}{2\pi}\qquad(\text{量子条件})`],
          n: R`電子は、原子核が及ぼすクーロン力（引力）を向心力として円運動をします。この力学の式と、量子条件の 2 つの式から、$r$ と $v$ が決まります。量子条件は、電子の波（物質波）が軌道を 1 周するとき、ちょうど整数個の波長 $n\lambda=2\pi r$（$\lambda=\dfrac{h}{mv}$）が入る条件と同じです。`,
          easy: R`電子は原子核の周りを円を描いて回っています。円運動には中心に向かう力（向心力）が必要で、ここではそれが原子核と電子の間の電気的な引力（クーロン力）です。もう 1 つ、ボーアは「電子の軌道は、$mvr=n\dfrac{h}{2\pi}$ を満たすものだけが許される」と考えました。この 2 つの式から、軌道の半径と速さが決まります。`,
          lv: 1
        },
        {
          t: '軌道半径と速さ（(1)(2)）',
          m: [R`v = \frac{nh}{2\pi m r}\;\Longrightarrow\; m r\left(\frac{nh}{2\pi m r}\right)^{2} = \frac{Ze^{2}}{4\pi\varepsilon_{0}}`,
              R`r_{n} = \frac{\varepsilon_{0}h^{2}n^{2}}{\pi Z m e^{2}},\qquad v_{n} = \frac{nh}{2\pi m r_{n}} = \frac{Ze^{2}}{2\varepsilon_{0}hn}`,
              R`v_{1} = \frac{(1.60\times 10^{-19})^{2}}{2\times 8.85\times 10^{-12}\times 6.63\times 10^{-34}} \approx 2.18\times 10^{6}\,\mathrm{m/s}`],
          n: R`量子条件から $v$ を求めて、向心力の式（$mv^{2}r=\dfrac{Ze^{2}}{4\pi\varepsilon_{0}}$ の形）に代入すると $r$ が決まります。$n=1,\ Z=1$ のとき $r_{1}\approx 5.3\times 10^{-11}\,\mathrm{m}$（ボーア半径）です。半径は $n^{2}$ に比例し $Z$ に反比例、速さは $n$ に反比例し $Z$ に比例します。$v_{1}\approx 2.2\times 10^{6}\,\mathrm{m/s}$ は、光速の約 $\dfrac{1}{137}$ です。`,
          pro: R`$r_{n}\propto\dfrac{n^{2}}{Z}$、$v_{n}\propto\dfrac{Z}{n}$、$E_{n}\propto-\dfrac{Z^{2}}{n^{2}}$ の 3 つを、一度は導いておく。$\mathrm{He^{+}}$ は水素の $Z$ を $2$ にするだけ。`,
          lv: 1
        },
        {
          t: R`エネルギー準位（$\mathrm{He^{+}}$ との関係）`,
          m: R`E_{n} = \frac{1}{2}mv^{2} - \frac{Ze^{2}}{4\pi\varepsilon_{0}r} = -\frac{Ze^{2}}{8\pi\varepsilon_{0}r_{n}} = -\frac{mZ^{2}e^{4}}{8\varepsilon_{0}^{2}h^{2}n^{2}} = -\frac{13.6\,Z^{2}}{n^{2}}\,\mathrm{eV}`,
          n: R`運動エネルギーは $\dfrac{1}{2}mv^{2}=\dfrac{Ze^{2}}{8\pi\varepsilon_{0}r}$ なので、全エネルギーは位置エネルギーの絶対値の半分で負の値になります。$Z$ が $2$ の $\mathrm{He^{+}}$ では、水素の準位を **4 倍**した値になり、$E_{n}=-\dfrac{54.4}{n^{2}}\,\mathrm{eV}$ です（図）。`,
          lv: 2
        },
        {
          t: R`$\mathrm{He^{+}}$ の $n=2\to 1$ の光（(3)）`,
          m: [R`\Delta E = E_{2}-E_{1} = 54.4\left(1-\frac{1}{4}\right) = 40.8\,\mathrm{eV} = 6.53\times 10^{-18}\,\mathrm{J}`,
              R`\lambda = \frac{hc}{\Delta E} = \frac{6.63\times 10^{-34}\times 3.00\times 10^{8}}{6.53\times 10^{-18}} \approx 3.05\times 10^{-8}\,\mathrm{m}`],
          n: R`原子が高いエネルギー準位から低い準位に移るとき、そのエネルギー差が光子 1 個のエネルギー $\dfrac{hc}{\lambda}$ として放出されます。波長は $30.5\,\mathrm{nm}$ で、紫外線（極端紫外線）の領域です。`,
          lv: 1
        },
        {
          t: R`水素原子と同じ波長になる $\mathrm{He^{+}}$ の遷移（(4)）`,
          m: [R`54.4\left(\frac{1}{b^{2}}-\frac{1}{a^{2}}\right) = 13.6\left(\frac{1}{2^{2}}-\frac{1}{3^{2}}\right)\;\Longrightarrow\;\frac{1}{b^{2}}-\frac{1}{a^{2}} = \frac{1}{4}\left(\frac{1}{2^{2}}-\frac{1}{3^{2}}\right) = \frac{1}{4^{2}}-\frac{1}{6^{2}}`,
              R`b=4,\ a=6`],
          n: R`$\mathrm{He^{+}}$ の準位は $E_{n}^{(\mathrm{He^{+}})}=-\dfrac{54.4}{n^{2}}=-\dfrac{13.6}{(n/2)^{2}}$ なので、$n$ が偶数のとき、水素の準位 $E_{n/2}^{(\mathrm{H})}$ とエネルギーが一致します（図の点線）。そこで、水素の $n=3\to 2$ に対応して、$\mathrm{He^{+}}$ の $n=6\to 4$ の遷移が、同じ波長になります。整数の範囲でほかの組はありません（$b=2,3,5$ などでは $a$ が整数にならない）。`,
          easy: R`$\mathrm{He^{+}}$ の準位は、水素の準位の $4$ 倍の深さ（$Z^{2}=4$）です。「$n$ を $2$ 倍にして、エネルギーの差を $4$ 倍にする」と、ちょうど水素と同じになります。つまり、$\mathrm{He^{+}}$ の $n=2,4,6,\cdots$ の準位は、水素の $n=1,2,3,\cdots$ と同じエネルギーなので、水素の $3\to 2$ は、$\mathrm{He^{+}}$ の $6\to 4$ と同じ光です。`,
          lv: 1
        },
        {
          t: '光子の運動量と反跳（(5)）',
          m: [R`E = 13.6\left(1-\frac{1}{4}\right) = 10.2\,\mathrm{eV} = 1.63\times 10^{-18}\,\mathrm{J},\qquad p_{\text{光子}} = \frac{E}{c} = 5.44\times 10^{-27}\,\mathrm{kg\cdot m/s}`,
              R`Mv = p_{\text{光子}} \;\Longrightarrow\; v = \frac{5.44\times 10^{-27}}{1.67\times 10^{-27}} \approx 3.26\,\mathrm{m/s}`],
          n: R`光子はエネルギー $E$ のほかに、運動量 $\dfrac{E}{c}=\dfrac{h}{\lambda}$ をもちます。放出の前の原子は静止していて、運動量は $0$ なので、運動量保存則から、原子の運動量は光子の運動量と大きさが同じで逆向きです。反跳の運動エネルギー $\dfrac{1}{2}Mv^{2}\approx 9\times 10^{-27}\,\mathrm{J}$ は、光子のエネルギー $1.6\times 10^{-18}\,\mathrm{J}$ の約 $10^{-8}$ 倍とごく小さく、無視できます（原子の質量が電子に比べてはるかに大きいためです）。`,
          pro: R`光子の運動量は $p=\dfrac{h}{\lambda}=\dfrac{E}{c}$。これで、反跳（光子の放出・吸収時の原子の速度変化）が評価できる。レーザー冷却は、この反跳を利用している。`,
          lv: 1
        }
      ],
      prereq: ['p-atom', 'p-photon', 'p-circular'],
      tags: ['ボーア模型', 'エネルギー準位', '水素類似イオン', '光子の運動量']
    }

  ]);
})();
