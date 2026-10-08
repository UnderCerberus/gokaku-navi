/* GOKAKU NAVI — 成蹊大学 理工学部 数学 2023〜2025 年度 準拠の類題
   各年度の大問構成（大問数・形式・小問数）と、出題分野・難易度だけを過去問に合わせ、
   題材・関数・図形・数値・設定・問題文・解説はすべて書き下ろしたもの（過去問の文面・数値・設定は含まない）。
   原文との距離は問題ごとに点検済み（docs/seikei-analysis-math.md の末尾を参照）。
   第1問（小問集合）は小問ごとに別カード（id 末尾 a/b/c）、第2〜4問は大問ごとに 1 カード。
   解説の図は各ステップの fig に直接書く。 */
(function () {
  'use strict';
  const R = String.raw;
  const S2 = Math.SQRT2, S3 = Math.sqrt(3), S5 = Math.sqrt(5), S6 = Math.sqrt(6), S7 = Math.sqrt(7);
  const PI = Math.PI, E = Math.E;
  const G = JK.plot.graph;
  const src = function (year, no) {
    return { univ: '成蹊大学', faculty: '理工学部', year: year, no: no, kind: '類題' };
  };

  /* ================================================================
   *  問題
   * ================================================================ */
  JK.registerProblems([

    /* ================= 2023 年度 ================= */

    /* ---------- 2023 第1問[1] ベクトル ---------- */
    {
      id: 'sk-m-2023-1a',
      subject: 'math',
      level: 'mid',
      unit: 'm-vec',
      title: 'ベクトルの内積となす角',
      source: src(2023, '第1問[1]'),
      time: 5,
      body: R`次の文中の空欄 $\boxed{ア}$・$\boxed{イ}$ に当てはまる数値を求めよ。

平面上のベクトル $\vec{a},\ \vec{b}$ が $\left|\vec{a}\right| = 4,\ \left|\vec{b}\right| = 6$ を満たし、さらに $\left|\vec{a} + 2\vec{b}\right| = 4\sqrt{7}$ であるとする。内積 $\vec{a}\cdot\vec{b}$ の値は $\boxed{ア}$ であり、$\vec{a}$ と $\vec{b}$ のなす角 $\theta\ (0 \le \theta \le \pi)$ は $\theta = \boxed{イ}$ である。`,
      fig: null,
      parts: [
        { label: 'ア', q: R`内積 $\vec{a}\cdot\vec{b}$ の値`, type: 'num', answer: -12 },
        { label: 'イ', q: R`なす角 $\theta$（ラジアン）`, type: 'num', answer: 2 * PI / 3, show: R`\frac{2}{3}\pi`, hint: 'π は π または pi と入力（例: 5π/6）' }
      ],
      solution: [
        {
          t: '大きさの条件を 2 乗して内積を作る',
          m: R`\left|\vec{a} + 2\vec{b}\right|^{2} = \left|\vec{a}\right|^{2} + 4\,\vec{a}\cdot\vec{b} + 4\left|\vec{b}\right|^{2}`,
          n: R`大きさ（長さ）のままでは計算が進まないので、両辺を 2 乗して内積 $\vec{a}\cdot\vec{b}$ が現れる形に展開します。`,
          easy: R`ベクトルの「大きさ」は矢印の長さです。$\left|\vec{p}\right|^{2} = \vec{p}\cdot\vec{p}$（自分自身との内積）が成り立つので、2 乗すると文字式の $(a + 2b)^{2} = a^{2} + 4ab + 4b^{2}$ と同じ要領で展開できます。真ん中の項が内積 $\vec{a}\cdot\vec{b}$ になるのがポイントです。`
        },
        {
          t: '与えられた値を代入する',
          m: [R`(4\sqrt{7})^{2} = 4^{2} + 4\,\vec{a}\cdot\vec{b} + 4 \cdot 6^{2}`, R`112 = 16 + 4\,\vec{a}\cdot\vec{b} + 144`],
          lv: 2
        },
        {
          t: '内積を求める',
          m: R`4\,\vec{a}\cdot\vec{b} = 112 - 160 = -48 \quad\therefore\quad \vec{a}\cdot\vec{b} = -12`,
          n: R`よって ア = $-12$ です。内積が負なので、なす角は鈍角（$90\degree$ より大きい角）だとわかります。`
        },
        {
          t: 'なす角を求める',
          m: [R`\cos\theta = \frac{\vec{a}\cdot\vec{b}}{\left|\vec{a}\right|\left|\vec{b}\right|} = \frac{-12}{4 \cdot 6} = -\frac{1}{2}`, R`0 \le \theta \le \pi \;\Rightarrow\; \theta = \frac{2}{3}\pi`],
          n: R`よって イ = $\frac{2}{3}\pi$（$120\degree$）です。`,
          easy: R`内積の定義 $\vec{a}\cdot\vec{b} = \left|\vec{a}\right|\left|\vec{b}\right|\cos\theta$ を $\cos\theta$ について解いた式です。$\cos\theta$ は「2 本の矢印がどれだけ同じ向きを向いているか」を表す量で、$1$ なら同じ向き、$0$ なら直角、$-1$ なら逆向きです。$\cos\theta = -\frac{1}{2}$ になる角は、単位円で $x$ 座標が $-\frac{1}{2}$ の点を探すと $120\degree$ です。`,
          pro: R`「大きさ 2 つ＋合成ベクトルの大きさ」が与えられたら、まず 2 乗して内積を出すのが定石です。角を聞かれたら $\cos\theta$ の値から特殊角を読み取り、$0 \le \theta \le \pi$ の範囲で 1 つに決まることを確認します。`
        }
      ],
      tags: ['小問集合', '空所補充', '内積', 'なす角']
    },

    /* ---------- 2023 第1問[2] 複素数平面 ---------- */
    {
      id: 'sk-m-2023-1b',
      subject: 'math',
      level: 'mid',
      unit: 'm-cplane',
      title: '2 点から等距離の直線と原点',
      source: src(2023, '第1問[2]'),
      time: 6,
      body: R`次の文中の空欄 $\boxed{ウ}$・$\boxed{エ}$ に当てはまる数値または複素数を求めよ。ただし $i$ は虚数単位とする。

複素数平面上の 2 点 $\mathrm{A}(-1 - 3i)$、$\mathrm{B}(5 + 5i)$ から等しい距離にある点 $z$ の全体は、1 本の直線 ℓ になる。原点 O と直線 ℓ の距離は $\boxed{ウ}$ であり、ℓ 上の点のうち原点に最も近いものを表す複素数は $\boxed{エ}$ である。`,
      fig: null,
      parts: [
        { label: 'ウ', q: R`原点 O と直線 ℓ の距離`, type: 'num', answer: 2 },
        { label: 'エ（実部）', q: R`エ を $p + qi$（$p,\ q$ は実数）と表したときの $p$ の値`, type: 'num', answer: 6 / 5, show: R`\frac{6}{5}`, hint: '分数は 3/4 のように入力' },
        { label: 'エ（虚部）', q: R`同じく $q$ の値`, type: 'num', answer: 8 / 5, show: R`\frac{8}{5}` }
      ],
      solution: [
        {
          t: '等距離の条件を式にする',
          m: [R`z = x + yi\ \text{とおくと}\quad \left|z - (-1 - 3i)\right| = \left|z - (5 + 5i)\right|`, R`(x + 1)^{2} + (y + 3)^{2} = (x - 5)^{2} + (y - 5)^{2}`],
          n: R`$\left|z - \alpha\right|$ は複素数平面上の 2 点 $z,\ \alpha$ の距離です。距離が等しいことは 2 乗しても同じなので、$\left|z\right|^{2} = x^{2} + y^{2}$ を使って座標の式に直しました。`,
          easy: R`**複素数平面**は、横軸に実部・縦軸に虚部をとった平面です。複素数 $x + yi$ は点 $(x,\ y)$ に対応し、$\left|z - \alpha\right|$ は点 $z$ と点 $\alpha$ の間の距離を表します。「2 点 A, B から等しい距離にある点」は、線分 AB の垂直二等分線の上の点です。`,
          lv: 2
        },
        {
          t: '展開して直線の方程式にする',
          m: [R`x^{2} + 2x + 1 + y^{2} + 6y + 9 = x^{2} - 10x + 25 + y^{2} - 10y + 25`, R`12x + 16y = 40 \;\Rightarrow\; 3x + 4y = 10`],
          n: R`$x^{2},\ y^{2}$ が両辺で消えるので、$x,\ y$ の 1 次式（直線）になります。これが ℓ です。`
        },
        {
          t: '点と直線の距離',
          m: [R`d = \frac{\left|ax_{0} + by_{0} + c\right|}{\sqrt{a^{2} + b^{2}}}`, R`d = \frac{\left|3 \cdot 0 + 4 \cdot 0 - 10\right|}{\sqrt{3^{2} + 4^{2}}} = \frac{10}{5} = 2`],
          n: R`ℓ を $3x + 4y - 10 = 0$ とみて、原点 $(0,\ 0)$ との距離を求めました。よって ウ = $2$ です。`,
          easy: R`点 $(x_{0},\ y_{0})$ から直線 $ax + by + c = 0$ までの最短距離（垂線の長さ）を求める公式です。原点なら $x_{0} = y_{0} = 0$ なので、分子は $\left|c\right|$ だけになります。`
        },
        {
          t: '原点に最も近い点は垂線の足',
          m: [R`\text{垂線の足を}\ \mathrm{H}\ \text{とすると、}\ \overrightarrow{\mathrm{OH}}\ \text{は法線ベクトル}\ (3,\ 4)\ \text{と平行}`, R`\mathrm{H}(3k,\ 4k)\ \text{が}\ \ell\ \text{上にある}:\quad 3 \cdot 3k + 4 \cdot 4k = 10 \;\Rightarrow\; k = \frac{2}{5}`, R`\mathrm{H}\left(\frac{6}{5},\ \frac{8}{5}\right) \;\Rightarrow\; \text{エ} = \frac{6}{5} + \frac{8}{5}i`],
          n: R`直線 $ax + by + c = 0$ の法線ベクトルは $(a,\ b)$ です。原点から ℓ に下ろした垂線の足 H が、ℓ 上で原点に最も近い点になります。`,
          easy: R`直線の上を動く点と原点との距離が最短になるのは、原点から直線に垂線を下ろしたときの足の位置です（斜めに進むより、まっすぐ進んだ方が近いのと同じ）。垂線の向きは直線の向きと直角なので、$3x + 4y = 10$ なら $(3,\ 4)$ の向きです。`,
          pro: R`垂線の足 H の座標は、$3x + 4y = 10$ と $\overrightarrow{\mathrm{OH}} = k(3,\ 4)$ の連立で一気に出ます。一般に $ax + by = c$ なら $k = \frac{c}{a^{2} + b^{2}}$ です。`
        },
        {
          t: '検算',
          m: [R`\left|\mathrm{H}\right| = \sqrt{\frac{36}{25} + \frac{64}{25}} = 2`, R`\mathrm{AH}^{2} = \left(\frac{11}{5}\right)^{2} + \left(\frac{23}{5}\right)^{2} = 26,\qquad \mathrm{BH}^{2} = \left(\frac{19}{5}\right)^{2} + \left(\frac{17}{5}\right)^{2} = 26`],
          n: R`$\left|\mathrm{H}\right|$ は ウ の距離と一致し、H は A, B から等距離（$\mathrm{AH} = \mathrm{BH}$）になっています。`,
          lv: 2,
          fig: G({
            w: 340, h: 300, x: [-3, 7.5], y: [-4, 6], equal: true, axis: ['実軸', '虚軸'],
            curves: [{ f: (x) => (10 - 3 * x) / 4, cls: 'c1' }],
            segs: [
              { x1: -1, y1: -3, x2: 5, y2: 5, cls: 'dim', dash: true },
              { x1: 0, y1: 0, x2: 1.2, y2: 1.6, cls: 'c3' }
            ],
            points: [
              { x: -1, y: -3, label: 'A', pos: 'br', cls: 'c2' },
              { x: 5, y: 5, label: 'B', pos: 'tl', cls: 'c2' },
              { x: 1.2, y: 1.6, label: 'H', pos: 'tr', cls: 'c3' },
              { x: 2, y: 1, label: 'M', pos: 'br', cls: 'dim' }
            ],
            labels: [{ x: 5.6, y: -1.4, text: 'ℓ', cls: 'c1' }]
          })
        }
      ],
      prereq: ['m-complex', 'm-coord'],
      tags: ['小問集合', '空所補充', '複素数平面', '垂直二等分線', '点と直線の距離']
    },

    /* ---------- 2023 第1問[3] 2次曲線 ---------- */
    {
      id: 'sk-m-2023-1c',
      subject: 'math',
      level: 'mid',
      unit: 'm-conic',
      title: '放物線の接線と双曲線',
      source: src(2023, '第1問[3]'),
      time: 7,
      body: R`次の文中の空欄 $\boxed{オ}$・$\boxed{カ}$ に当てはまる式または数値を求めよ。

座標平面上の放物線 $y^{2} = 12x$ に、その上の点 $\left(1,\ 2\sqrt{3}\right)$ で接する直線 ℓ を引く。ℓ は $y = \boxed{オ}$ と表される。正の定数 $a$ について、ℓ が双曲線 $\dfrac{x^{2}}{a^{2}} - y^{2} = 1$ にも接するならば、$a = \boxed{カ}$ である。`,
      fig: null,
      parts: [
        { label: 'オ', q: R`$y = \boxed{オ}$ の右辺（$x$ の式）`, type: 'expr', answer: 'sqrt(3)*x+sqrt(3)', vars: ['x'], show: R`\sqrt{3}\,x + \sqrt{3}`, hint: '例: 2√5x - 1/2 のように入力' },
        { label: 'カ', q: R`$a$ の値`, type: 'num', answer: 2 * S3 / 3, show: R`\frac{2\sqrt{3}}{3}` }
      ],
      solution: [
        {
          t: '放物線の接線の公式',
          m: [R`y_{1}\,y = 6\,(x + x_{1})`, R`2\sqrt{3}\,y = 6\,(x + 1)`],
          n: R`放物線 $y^{2} = 4px$ 上の点 $(x_{1},\ y_{1})$ における接線は $y_{1}y = 2p\,(x + x_{1})$ です。ここでは $4p = 12$ より $p = 3$、点は $(x_{1},\ y_{1}) = (1,\ 2\sqrt{3})$ です。`,
          easy: R`**放物線**は、ボールを投げたときの軌道のような形の曲線です。接線の公式は「$y^{2}$ を $y_{1}y$ に、$x$ を $\frac{x + x_{1}}{2}$ に置きかえる」と覚えられます（円の接線 $x_{1}x + y_{1}y = r^{2}$ と同じ発想です）。$y^{2} = 12x$ なら $y_{1}y = 12 \cdot \frac{x + x_{1}}{2} = 6(x + x_{1})$ です。`
        },
        {
          t: 'y について解く',
          m: R`y = \frac{6}{2\sqrt{3}}(x + 1) = \sqrt{3}\,x + \sqrt{3}`,
          n: R`$\frac{6}{2\sqrt{3}} = \frac{3}{\sqrt{3}} = \sqrt{3}$ です。よって オ = $\sqrt{3}\,x + \sqrt{3}$ です。`
        },
        {
          t: '双曲線と連立する',
          m: [R`\frac{x^{2}}{a^{2}} - \left(\sqrt{3}\,x + \sqrt{3}\right)^{2} = 1`, R`\left(\frac{1}{a^{2}} - 3\right)x^{2} - 6x - 4 = 0`],
          n: R`直線と曲線が接する $\iff$ 連立して得られる $x$ の 2 次方程式が重解をもつ（判別式 $D = 0$）、を使います。$\left(\sqrt{3}\,x + \sqrt{3}\right)^{2} = 3(x + 1)^{2} = 3x^{2} + 6x + 3$ を展開しました。`,
          easy: R`直線と曲線の共有点は、2 つの式を同時に満たす点です。共有点が「2 つ → 1 つ（接する）→ 0 個」と変わる境目が接する場合で、2 次方程式でいえば重解（判別式 $= 0$）にあたります。`,
          lv: 2
        },
        {
          t: '判別式 = 0 から a を求める',
          m: [R`\frac{D}{4} = (-3)^{2} - \left(\frac{1}{a^{2}} - 3\right)(-4) = 9 + 4\left(\frac{1}{a^{2}} - 3\right) = 0`, R`\frac{1}{a^{2}} = 3 - \frac{9}{4} = \frac{3}{4} \;\Rightarrow\; a^{2} = \frac{4}{3} \;\Rightarrow\; a = \frac{2}{\sqrt{3}} = \frac{2\sqrt{3}}{3}`],
          n: R`このとき $x^{2}$ の係数は $\frac{3}{4} - 3 = -\frac{9}{4} \ne 0$ なので、確かに 2 次方程式で、重解 $x = -\frac{4}{3}$ をもちます。$a > 0$ より カ = $\frac{2\sqrt{3}}{3}$ です。`
        },
        {
          t: '別解：接する条件の公式',
          m: [R`y = mx + n\ \text{が}\ \frac{x^{2}}{A} - \frac{y^{2}}{B} = 1\ \text{に接する} \iff n^{2} = Am^{2} - B`, R`(\sqrt{3})^{2} = a^{2} \cdot (\sqrt{3})^{2} - 1 \;\Rightarrow\; a^{2} = \frac{4}{3}`],
          n: R`上の判別式の計算を文字のまま行うと、この公式が得られます（楕円なら $n^{2} = Am^{2} + B$ と符号が変わります）。`,
          pro: R`$n^{2} = Am^{2} \pm B$ は一度自分で導いておくと、2 次曲線の接線の小問で大きな時短になります。双曲線では、$n^{2} = Am^{2} - B$ が正になる必要があるので、傾きが漸近線より急でない直線は接線になれないこともこの式から確認できます。`,
          fig: G({
            w: 340, h: 300, x: [-4, 6.5], y: [-5, 6], equal: true,
            param: [
              { x: (t) => (t * t) / 12, y: (t) => t, t: [-7, 7], cls: 'c1' },
              { x: (t) => (2 * S3 / 3) * Math.cosh(t), y: (t) => Math.sinh(t), t: [-2.2, 2.2], cls: 'c2' },
              { x: (t) => -(2 * S3 / 3) * Math.cosh(t), y: (t) => Math.sinh(t), t: [-1.6, 1.6], cls: 'c2' }
            ],
            curves: [{ f: (x) => S3 * x + S3, cls: 'c3' }],
            points: [
              { x: 1, y: 2 * S3, label: '(1, 2√3)', pos: 'tr', cls: 'c1' },
              { x: -4 / 3, y: -S3 / 3, label: '接点', pos: 'bl', cls: 'c2' }
            ],
            labels: [{ x: 2.5, y: 4.9, text: 'ℓ', cls: 'c3' }]
          })
        }
      ],
      tags: ['小問集合', '空所補充', '放物線', '双曲線', '接線', '判別式']
    },

    /* ---------- 2023 第2問 高次不等式と命題 ---------- */
    {
      id: 'sk-m-2023-2',
      subject: 'math',
      level: 'mid',
      unit: 'm-complex',
      title: '3次式の因数分解と命題の真偽',
      source: src(2023, '第2問'),
      time: 20,
      body: R`$a$ を実数の定数とし、2 つの整式
$$f(x) = x^{3} - 2(a-1)x^{2} + (a^{2} - 4a)x + 2a^{2},\qquad g(x) = ax - 4$$
を考える。$x$ は実数全体を動くものとして、次の問いに答えよ。

(1) 不等式 $g(x) \ge 0$ を解け。
(2) $f(x)$ を因数分解し、不等式 $f(x) > 0$ を解け。
(3) 「$f(x) \ge 0$ ならば $g(x) < 0$」が真となるような $a$ の範囲を求めよ。
(4) 「$f(x) \le 0$ ならば $g(x) \le 0$」が真となるような $a$ の範囲を求めよ。`,
      fig: null,
      parts: [
        {
          label: '(1)', q: R`$g(x) \ge 0$ の解として正しいものを選べ。`, type: 'choice',
          choices: [
            R`$a > 0$ のとき $x \le \frac{4}{a}$、$a = 0$ のとき すべての実数、$a < 0$ のとき $x \ge \frac{4}{a}$`,
            R`$a > 0$ のとき $x \ge \frac{4}{a}$、$a = 0$ のとき 解なし、$a < 0$ のとき $x \le \frac{4}{a}$`,
            R`$a > 0$ のとき $x \ge \frac{4}{a}$、$a = 0$ のとき 解なし、$a < 0$ のとき $x \ge \frac{4}{a}$`,
            R`$a > 0$ のとき $x \ge \frac{4}{a}$、$a = 0$ のとき すべての実数、$a < 0$ のとき $x \ge \frac{4}{a}$`
          ],
          answer: 1
        },
        { label: '(2)因数分解', q: R`$f(x)$ を実数の範囲で因数分解せよ（$x$ と $a$ の式で入力）。`, type: 'expr', answer: '(x+2)(x-a)^2', vars: ['x', 'a'], show: R`(x+2)(x-a)^{2}`, hint: '例: (x-1)(x+a)^2' },
        {
          label: '(2)不等式', q: R`$f(x) > 0$ の解として正しいものを選べ。`, type: 'choice',
          choices: [
            R`$a$ の値によらず $x > -2$`,
            R`$a > -2$ のとき $x > -2$ または $x = a$、$a \le -2$ のとき $x > -2$`,
            R`$a > -2$ のとき $x > -2$ かつ $x \ne a$、$a \le -2$ のとき $x > -2$`,
            R`$a \ne -2$ のとき $x < -2$ かつ $x \ne a$、$a = -2$ のとき $x < -2$`
          ],
          answer: 2
        },
        {
          label: '(3)', q: R`(3) の条件として正しいものを選べ。`, type: 'choice',
          choices: [R`$-2 \le a \le 0$`, R`$-2 < a < 0$`, R`$a \le 0$`, R`$-2 < a \le 0$`, R`$-2 \le a < 0$`],
          answer: 3
        },
        {
          label: '(4)', q: R`(4) の条件として正しいものを選べ。`, type: 'choice',
          choices: [R`$0 < a < 2$`, R`$0 \le a \le 2$`, R`$0 < a \le 2$`, R`$-2 \le a \le 2$`, R`$0 \le a < 2$`],
          answer: 1
        }
      ],
      solution: [
        {
          t: '(1) 1 次不等式は a の符号で場合分け',
          m: R`g(x) \ge 0 \iff ax \ge 4`,
          n: R`$x$ の係数 $a$ で割るとき、$a$ の符号で不等号の向きが変わります。
・$a > 0$ のとき $x \ge \frac{4}{a}$
・$a = 0$ のとき $0 \ge 4$ は成り立たないので **解なし**
・$a < 0$ のとき 不等号が逆向きになって $x \le \frac{4}{a}$`,
          easy: R`不等式の両辺を負の数で割ると不等号の向きが逆になります（例: $-2x \ge 6 \Rightarrow x \le -3$）。$a$ は文字なので正か負か $0$ かわからず、3 通りに分けて考えます。$a = 0$ のときは $x$ が消えて「$0 \ge 4$」という成り立たない式になるので、解はありません。`
        },
        {
          t: '(2) 因数定理で f(x) を因数分解',
          m: [R`f(-2) = -8 - 8(a-1) - 2(a^{2} - 4a) + 2a^{2} = 0`, R`f(x) = (x + 2)(x^{2} - 2ax + a^{2}) = (x + 2)(x - a)^{2}`],
          n: R`$f(-2) = 0$ なので $f(x)$ は $x + 2$ を因数にもちます。$f(x)$ を $x + 2$ で割ると、商は $x^{2} - 2ax + a^{2} = (x - a)^{2}$ です。`,
          easy: R`**因数定理**: 整式 $f(x)$ で $f(c) = 0$ となる $c$ が見つかれば、$f(x)$ は $(x - c)$ で割り切れます。文字 $a$ が入っていても、定数項 $2a^{2}$ の「約数」にあたる $\pm 1,\ \pm 2,\ \pm a$ などを順に代入して探します。ここでは $x = -2$ を代入すると $a$ の項がすべて消えます。`
        },
        {
          t: '展開して確かめる',
          m: [R`(x + 2)(x^{2} - 2ax + a^{2})`, R`= x^{3} - 2ax^{2} + a^{2}x + 2x^{2} - 4ax + 2a^{2}`, R`= x^{3} - 2(a - 1)x^{2} + (a^{2} - 4a)x + 2a^{2}`],
          lv: 3
        },
        {
          t: '(2) f(x) > 0 を解く',
          m: R`f(x) = (x + 2)(x - a)^{2} > 0 \iff x + 2 > 0\ \text{かつ}\ x \ne a`,
          n: R`$(x - a)^{2} \ge 0$ で、等号は $x = a$ のときだけです。$f(x) > 0$ となるには $(x - a)^{2} > 0$（$x \ne a$）かつ $x + 2 > 0$ が必要十分です。
・$a > -2$ のとき、$x = a$ は $x > -2$ の範囲に入っているので除いて **$x > -2$ かつ $x \ne a$**
・$a \le -2$ のとき、$x = a$ は $x > -2$ の範囲の外なので **$x > -2$**`,
          easy: R`2 乗した数は $0$ 以上で、$0$ になるのはかっこの中が $0$ のときだけです。だから $f(x) > 0$ は「$(x + 2)$ が正」で決まり、ただし $(x - a)^{2} = 0$ になる $x = a$ だけは $f(x) = 0$ となって「$> 0$」を満たさないので除きます。`,
          fig: G({
            w: 340, h: 240, x: [-3.6, 2.8], y: [-4, 16],
            curves: [{ f: (x) => (x + 2) * (x - 1) * (x - 1), cls: 'c1' }],
            points: [
              { x: -2, y: 0, label: 'x = −2', pos: 'bl', cls: 'c3' },
              { x: 1, y: 0, label: 'x = a（接点）', pos: 'br', cls: 'c4' }
            ],
            labels: [{ x: 2.0, y: 9.5, text: 'y = f(x)', cls: 'c1' }]
          })
        },
        {
          t: '(3) 命題の真偽は集合の包含で考える',
          m: R`P = \{x \mid f(x) \ge 0\} = \{x \mid x \ge -2\} \cup \{a\},\qquad Q = \{x \mid g(x) < 0\}`,
          n: R`「$p$ ならば $q$」が真 $\iff$ $P \subset Q$ です。$(x + 2)(x - a)^{2} \ge 0$ は「$x \ge -2$」か「$(x - a)^{2} = 0$ すなわち $x = a$」のときに成り立つので、$P$ は **半直線 $x \ge -2$ に孤立した点 $a$ を加えたもの** です（$a \ge -2$ なら $a$ はすでに半直線の中にあります）。
・$a > 0$ のとき、$x$ が十分大きいと $g(x) = ax - 4 > 0$ となり $P$ の元が $Q$ に入らないので偽。
・$a = 0$ のとき、$g(x) = -4 < 0$ はつねに成り立ち $Q$ は実数全体なので真。`,
          easy: R`「$p$ ならば $q$」が真とは、「$p$ を満たす $x$ はすべて $q$ も満たす」ということです。満たす $x$ の集まり（集合）でいえば、$p$ の集合が $q$ の集合にすっぽり含まれること。1 つでもはみ出す $x$（反例）があれば偽です。$f(x) \ge 0$ には「等号が成り立つ $x$」も含まれる点に注意しましょう。`
        },
        {
          t: '(3) a < 0 のとき',
          m: [R`Q = \{x \mid ax - 4 < 0\} = \left\{x \mid x > \frac{4}{a}\right\}\quad (a < 0)`, R`P \subset Q \iff -2 \in Q \iff g(-2) = -2a - 4 < 0 \iff a > -2`],
          n: R`負の $a$ で割るので、$Q$ は $x > \frac{4}{a}$ と不等号が逆向きになります。$P$ の半直線 $x \ge -2$ が $Q$ に含まれるには、左端 $x = -2$ が $Q$ に入ればよく（$Q$ は右に無限に延びているため）、$g(-2) < 0$ すなわち $a > -2$ が条件です。このとき孤立点 $a$ は $-2 < a < 0$ の範囲にあり、半直線の中に入っているので追加の条件はありません。$a = -2$ のときは $g(-2) = 0$ となって $Q$ に入らず偽です。よって $a < 0$ では $-2 < a < 0$。
$a = 0$ の場合（真）と合わせて、**(3) の答えは $-2 < a \le 0$** です。`,
          pro: R`端点を含むかどうかは、端点 $x = -2$ を実際に $g(x) < 0$ に代入して確かめるのが確実です。$a = -2$ のとき $g(-2) = (-2)(-2) - 4 = 0$ で「$< 0$」を満たさないので、$a = -2$ は外します。`
        },
        {
          t: '(4) f(x) ≦ 0 となる x の集合',
          m: R`P' = \{x \mid f(x) \le 0\} = \{x \mid x \le -2\} \cup \{a\},\qquad Q' = \{x \mid ax \le 4\}`,
          n: R`$(x + 2)(x - a)^{2} \le 0$ は「$x \le -2$」か「$x = a$」のときに成り立ちます。ここでも **孤立点 $x = a$** を忘れないことが大切です。
・$a < 0$ のとき $Q' = \left\{x \mid x \ge \frac{4}{a}\right\}$ なので、$x$ が十分小さい $P'$ の元が入らず偽。
・$a = 0$ のとき $g(x) = -4 \le 0$ はつねに成り立ち、真。
・$a > 0$ のとき $Q' = \left\{x \mid x \le \frac{4}{a}\right\}$。半直線 $x \le -2$ は $\frac{4}{a} > 0$ より必ず含まれます。孤立点 $a$ が入る条件は $a \le \frac{4}{a}$、すなわち $a^{2} \le 4$ で $0 < a \le 2$。
あわせて **(4) の答えは $0 \le a \le 2$** です。`,
          pro: R`3 次関数のグラフで見ると、重解 $x = a$ はグラフが $x$ 軸に接する点です。$f(x) \le 0$ の解には「$x \le -2$ の部分」の他に、接点 1 点が加わります。符号の表から解を読むときは、重解の点が不等号に等号を含むときだけ解に加わる、と覚えておきましょう。`
        }
      ],
      prereq: ['m-expr', 'm-quad'],
      tags: ['記述', '因数定理', '重解', '高次不等式', '命題と集合', '場合分け']
    },

    /* ---------- 2023 第3問 定積分で表された数列 ---------- */
    {
      id: 'sk-m-2023-3',
      subject: 'math',
      level: 'mid',
      unit: 'm-integ3',
      title: 'tan のべきの定積分と極限',
      source: src(2023, '第3問'),
      time: 18,
      body: R`$n = 0,\ 1,\ 2,\ \cdots$ に対して
$$a_{n} = \int_{0}^{\pi/4} \tan^{n} x\,dx$$
と定める。ただし $\log$ は自然対数を表す。次の問いに答えよ。

(1) $a_{0}$ と $a_{1}$ の値を求めよ。
(2) $a_{n} + a_{n+2}$ を $n$ の式で表せ。また、$a_{4}$ の値を求めよ。
(3) 極限 $\displaystyle\lim_{n \to \infty} a_{n}$ を求めよ。
(4) 極限 $\displaystyle\lim_{n \to \infty} n\,a_{n}$ を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)a0', q: R`$a_{0}$ の値`, type: 'num', answer: PI / 4, show: R`\frac{\pi}{4}`, hint: 'π は π または pi と入力（例: 3π/8）' },
        { label: '(1)a1', q: R`$a_{1}$ の値`, type: 'num', answer: Math.log(2) / 2, show: R`\frac{1}{2}\log 2`, hint: '対数は log(2) のように入力（例: 3log(3)）' },
        { label: '(2)和', q: R`$a_{n} + a_{n+2} = \boxed{\ \ }$ の空欄（$n$ の式で答えよ）`, type: 'expr', answer: '1/(n+1)', vars: ['n'], show: R`\frac{1}{n + 1}`, hint: '例: 2/(n+3) のように入力' },
        { label: '(2)a4 の値', q: R`$a_{4}$ の値`, type: 'num', answer: PI / 4 - 2 / 3, show: R`\frac{\pi}{4} - \frac{2}{3}`, hint: 'π を使って入力（例: π/3-1/2）' },
        { label: '(3)', q: R`$\displaystyle\lim_{n \to \infty} a_{n}$ の値`, type: 'num', answer: 0 },
        { label: '(4)', q: R`$\displaystyle\lim_{n \to \infty} n\,a_{n}$ の値`, type: 'num', answer: 1 / 2, show: R`\frac{1}{2}` }
      ],
      solution: [
        {
          t: '(1) a₀ と a₁',
          m: [R`a_{0} = \int_{0}^{\pi/4} 1\,dx = \frac{\pi}{4}`, R`a_{1} = \int_{0}^{\pi/4} \frac{\sin x}{\cos x}\,dx = \left[-\log\left|\cos x\right|\right]_{0}^{\pi/4} = -\log\frac{\sqrt{2}}{2} = \frac{1}{2}\log 2`],
          n: R`$\tan^{0} x = 1$ なので $a_{0}$ は長さ $\frac{\pi}{4}$ の区間の積分です。$a_{1}$ は、$(\cos x)' = -\sin x$ から $\int \frac{\sin x}{\cos x}\,dx = -\log\left|\cos x\right|$ となることを使いました。$-\log\frac{\sqrt{2}}{2} = \log\frac{2}{\sqrt{2}} = \log\sqrt{2} = \frac{1}{2}\log 2$ です。`,
          easy: R`$\tan x = \frac{\sin x}{\cos x}$ です。分母の $\cos x$ を微分すると $-\sin x$ で、分子と（符号をのぞいて）同じ形になっているので、「$\frac{(\text{分母})'}{\text{分母}}$ の積分は $\log|\text{分母}|$」という形が使えます。`
        },
        {
          t: '(2) tanⁿx + tanⁿ⁺²x をまとめる',
          m: [R`\tan^{n} x + \tan^{n+2} x = \tan^{n} x\,(1 + \tan^{2} x) = \tan^{n} x\cdot\frac{1}{\cos^{2} x}`, R`a_{n} + a_{n+2} = \int_{0}^{\pi/4} \tan^{n} x\,(\tan x)'\,dx = \left[\frac{\tan^{n+1} x}{n+1}\right]_{0}^{\pi/4} = \frac{1}{n+1}`],
          n: R`$1 + \tan^{2} x = \frac{1}{\cos^{2} x}$ と、$(\tan x)' = \frac{1}{\cos^{2} x}$ を組み合わせるのがポイントです。$t = \tan x$ とおく置換積分で、$x: 0 \to \frac{\pi}{4}$ のとき $t: 0 \to 1$ とすると $\int_{0}^{1} t^{n}\,dt = \frac{1}{n+1}$ です。よって空欄は $\frac{1}{n+1}$ です。`,
          easy: R`$a_{n}$ と $a_{n+2}$ を足すと、$\tan^{n} x$ と $\tan^{n+2} x$ から共通部分 $\tan^{n} x$ をくくり出せて、$1 + \tan^{2} x$ が現れます。これは $\frac{1}{\cos^{2} x}$ に等しく、しかも $\tan x$ の導関数そのものです。「ある関数のべき × その関数の導関数」の形になるので、簡単に積分できます。`
        },
        {
          t: 'a₂, a₄ を順に求める',
          m: [R`n = 0:\quad a_{0} + a_{2} = 1 \;\Rightarrow\; a_{2} = 1 - \frac{\pi}{4}`, R`n = 2:\quad a_{2} + a_{4} = \frac{1}{3} \;\Rightarrow\; a_{4} = \frac{1}{3} - \left(1 - \frac{\pi}{4}\right) = \frac{\pi}{4} - \frac{2}{3}`],
          n: R`よって $a_{4} = \frac{\pi}{4} - \frac{2}{3}\ (\fallingdotseq 0.119)$ です。$0 \le \tan x \le 1$ の範囲で 4 乗するので、$a_{0} = 0.785$ よりずっと小さくなっていることとも合っています。`,
          lv: 2
        },
        {
          t: '(3) a_n を上から押さえる',
          m: [R`0 \le \tan x\ \ \left(0 \le x \le \frac{\pi}{4}\right)\ \text{より}\quad a_{n} \ge 0,\quad a_{n+2} \ge 0`, R`a_{n} = \frac{1}{n+1} - a_{n+2} \le \frac{1}{n+1}\quad\Rightarrow\quad 0 \le a_{n} \le \frac{1}{n+1}`],
          n: R`$\frac{1}{n+1} \to 0\ (n \to \infty)$ なので、はさみうちの原理により $\displaystyle\lim_{n \to \infty} a_{n} = 0$ です。`,
          easy: R`$a_{n}$ は $y = \tan^{n} x$ のグラフと $x$ 軸の間の面積です。この区間では $0 \le \tan x \le 1$ なので、$n$ 乗するほど値が小さくなり、面積はどんどん $0$ に近づきます。**はさみうちの原理**は「$A_{n} \le B_{n} \le C_{n}$ で、$A_{n}$ と $C_{n}$ が同じ値に近づくなら、$B_{n}$ もその値に近づく」というものです。`,
          fig: G({
            w: 340, h: 230, x: [-0.05, 0.9], y: [-0.08, 1.12],
            curves: [
              { f: (x) => Math.tan(x), cls: 'c1', domain: [0, PI / 4] },
              { f: (x) => Math.pow(Math.tan(x), 2), cls: 'c2', domain: [0, PI / 4] },
              { f: (x) => Math.pow(Math.tan(x), 6), cls: 'c3', domain: [0, PI / 4] }
            ],
            vlines: [{ x: PI / 4, label: 'x = π/4' }],
            labels: [
              { x: 0.28, y: 0.52, text: 'n = 1', cls: 'c1' },
              { x: 0.52, y: 0.4, text: 'n = 2', cls: 'c2' },
              { x: 0.62, y: 0.1, text: 'n = 6', cls: 'c3' }
            ]
          })
        },
        {
          t: '(4) 数列の大小関係で a_n を両側から押さえる',
          m: [R`0 \le \tan x \le 1 \;\Rightarrow\; \tan^{n+2} x \le \tan^{n+1} x \le \tan^{n} x \;\Rightarrow\; a_{n+2} \le a_{n+1} \le a_{n}`, R`\frac{1}{n+1} = a_{n} + a_{n+2} \le 2a_{n} \;\Rightarrow\; a_{n} \ge \frac{1}{2(n+1)}`, R`\frac{1}{n-1} = a_{n-2} + a_{n} \ge 2a_{n} \;\Rightarrow\; a_{n} \le \frac{1}{2(n-1)}\quad (n \ge 2)`],
          n: R`$\{a_{n}\}$ が減少数列であることを使って、$a_{n} + a_{n+2}$ を $2a_{n}$ や $2a_{n+2}$ でおさえます。2 本目の式は、(2) の式の $n$ を $n - 2$ に置きかえた $a_{n-2} + a_{n} = \frac{1}{n-1}$ に $a_{n-2} \ge a_{n}$ を使ったものです。`,
          easy: R`$a_{n}$ はだんだん小さくなる数列（減少数列）です。だから「$a_{n}$ と $a_{n+2}$ の和」は、$a_{n}$ の 2 倍より小さく、$a_{n+2}$ の 2 倍より大きくなります。この大小関係を使うと、和がわかっている $a_{n}$ を、$\frac{1}{2(n+1)}$ と $\frac{1}{2(n-1)}$ ではさめます。`
        },
        {
          t: '(4) 極限を求める',
          m: [R`\frac{1}{2(n+1)} \le a_{n} \le \frac{1}{2(n-1)} \;\Rightarrow\; \frac{n}{2(n+1)} \le n\,a_{n} \le \frac{n}{2(n-1)}`, R`\lim_{n \to \infty}\frac{n}{2(n+1)} = \lim_{n \to \infty}\frac{n}{2(n-1)} = \frac{1}{2}\;\Rightarrow\; \lim_{n \to \infty} n\,a_{n} = \frac{1}{2}`],
          n: R`各辺に $n$ を掛けて、はさみうちの原理を使います。よって $\displaystyle\lim_{n \to \infty} n\,a_{n} = \frac{1}{2}$ です。`,
          pro: R`$a_{n} + a_{n+2} = \frac{1}{n+1}$ で $a_{n} \fallingdotseq a_{n+2}$ とみれば、$2a_{n} \fallingdotseq \frac{1}{n}$ から答えの $\frac{1}{2}$ が予想できます。「漸化式（和の形）＋ 単調性」で、数列の $0$ へ近づく速さを両側からはさむのは、定積分で定義された数列の頻出パターンです。`
        }
      ],
      prereq: ['m-limit', 'm-trig2'],
      tags: ['記述', '置換積分', '漸化式', '単調な数列', 'はさみうちの原理', '極限', '数III']
    },

    /* ---------- 2023 第4問 無理関数の最大と円 ---------- */
    {
      id: 'sk-m-2023-4',
      subject: 'math',
      level: 'mid',
      unit: 'm-diff3',
      title: '無理関数の最大値と円との共有点',
      source: src(2023, '第4問'),
      time: 15,
      body: R`座標平面上の曲線 $C : y = x\sqrt{4 - x^{2}}\ \ (0 \le x \le 2)$ について、次の問いに答えよ。ただし O は原点とする。

(1) $C$ 上の点のうち、$y$ 座標が最大となる点を P とする。P の座標を求めよ。
(2) $C$ と円 $x^{2} + y^{2} = 4$ の共有点のうち、$x$ 軸上にないものを Q とする。Q の座標を求めよ。
(3) 3 点 O, P, Q を頂点とする三角形の面積を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)x座標', q: R`P の $x$ 座標`, type: 'num', answer: S2, show: R`\sqrt{2}`, hint: '根号は 2√3 または 2*sqrt(3) のように入力' },
        { label: '(1)y座標', q: R`P の $y$ 座標`, type: 'num', answer: 2 },
        { label: '(2)x座標', q: R`Q の $x$ 座標`, type: 'num', answer: 1 },
        { label: '(2)y座標', q: R`Q の $y$ 座標`, type: 'num', answer: S3, show: R`\sqrt{3}` },
        { label: '(3)', q: R`$\triangle\mathrm{OPQ}$ の面積`, type: 'num', answer: (S6 - 2) / 2, show: R`\frac{\sqrt{6} - 2}{2}`, hint: '根号は √6 または sqrt(6) と入力' }
      ],
      solution: [
        {
          t: '(1) 導関数を求める',
          m: R`f(x) = x\sqrt{4 - x^{2}}\ \Rightarrow\ f'(x) = \sqrt{4 - x^{2}} + x\cdot\frac{-x}{\sqrt{4 - x^{2}}} = \frac{4 - 2x^{2}}{\sqrt{4 - x^{2}}}`,
          n: R`積の微分 $(uv)' = u'v + uv'$ と、合成関数の微分 $\left(\sqrt{4 - x^{2}}\right)' = \frac{-2x}{2\sqrt{4 - x^{2}}} = \frac{-x}{\sqrt{4 - x^{2}}}$ を使い、通分しました。`,
          easy: R`$\sqrt{4 - x^{2}}$ は「$4 - x^{2}$ という中身」を「$\sqrt{\ \ }$ という外側」で包んだ形です。このような関数は、外側を微分して（$\sqrt{u}$ なら $\frac{1}{2\sqrt{u}}$）、中身の微分（ここでは $-2x$）を掛けます（合成関数の微分）。`
        },
        {
          t: '増減を調べて P を求める',
          m: [R`f'(x) = 0 \iff x^{2} = 2 \iff x = \sqrt{2}`, R`f(\sqrt{2}) = \sqrt{2}\cdot\sqrt{2} = 2`],
          n: R`分母は $0 < x < 2$ で正なので、$f'(x)$ の符号は $4 - 2x^{2}$ と同じです。$0 \le x < \sqrt{2}$ で増加、$\sqrt{2} < x \le 2$ で減少なので、$x = \sqrt{2}$ で最大値 $2$ をとります。よって P の座標は $(\sqrt{2},\ 2)$ です。`,
          pro: R`$f(x) \ge 0$ なので、$\{f(x)\}^{2} = 4x^{2} - x^{4}$ の最大を考えても同じ $x$ で最大になります。$x^{2} = u$ とおけば $-u^{2} + 4u$ の平方完成で $u = 2$ とすぐ出ます（根号つきの関数の最大・最小の時短です）。`
        },
        {
          t: '(2) 円の式に y² を代入する',
          m: [R`y^{2} = x^{2}(4 - x^{2})\ \text{を}\ x^{2} + y^{2} = 4\ \text{に代入}`, R`x^{2} + 4x^{2} - x^{4} = 4 \;\Rightarrow\; x^{4} - 5x^{2} + 4 = 0`, R`(x^{2} - 1)(x^{2} - 4) = 0 \;\Rightarrow\; x = 1,\ 2\quad (0 < x \le 2)`],
          n: R`$C$ 上の点は $y = x\sqrt{4 - x^{2}}$ を満たすので、$y^{2} = x^{2}(4 - x^{2})$ です。$x = 2$ のとき $y = 0$ で $x$ 軸上の点なので除き、$x = 1$ のとき $y = 1\cdot\sqrt{3} = \sqrt{3}$ です。よって Q の座標は $(1,\ \sqrt{3})$ です。`,
          easy: R`円 $x^{2} + y^{2} = 4$ は、原点を中心とする半径 $2$ の円です。曲線 $C$ と円の共有点は、2 つの式を同時に満たす点なので、連立方程式を解きます。ルートのついた $y$ をそのまま扱うと大変なので、$y^{2}$ を作って代入するのがコツです（$y \ge 0$ の範囲なので、$y$ は $y^{2}$ から 1 つに決まります）。`
        },
        {
          t: '(3) 三角形の面積',
          m: [R`\triangle\mathrm{OPQ} = \frac{1}{2}\left|x_{\mathrm{P}}\,y_{\mathrm{Q}} - x_{\mathrm{Q}}\,y_{\mathrm{P}}\right|`, R`= \frac{1}{2}\left|\sqrt{2}\cdot\sqrt{3} - 1\cdot 2\right| = \frac{\sqrt{6} - 2}{2}`],
          n: R`$\sqrt{6} \fallingdotseq 2.449 > 2$ なので、絶対値の中は正です。面積は $\frac{\sqrt{6} - 2}{2} \fallingdotseq 0.225$ です。`,
          easy: R`原点 O と 2 点 $(x_{1},\ y_{1})$、$(x_{2},\ y_{2})$ を頂点とする三角形の面積は $\frac{1}{2}\left|x_{1}y_{2} - x_{2}y_{1}\right|$ で求められます（ベクトルの面積公式を成分で書いたもの）。`,
          pro: R`点 Q は、半径 $2$ の円の上で $x$ 軸から $60\degree$ の位置の点（原点と結ぶ直線の傾きが $\sqrt{3}$）です。原点を頂点とする三角形の面積は、成分の「たすきがけ」の差で一気に出せます。`,
          fig: G({
            w: 340, h: 280, x: [-0.3, 2.6], y: [-0.3, 2.4], equal: true,
            curves: [{ f: (x) => x * Math.sqrt(Math.max(0, 4 - x * x)), cls: 'c1', domain: [0, 2] }],
            param: [{ x: (t) => 2 * Math.cos(t), y: (t) => 2 * Math.sin(t), t: [0, PI / 2], cls: 'dim', dash: true }],
            segs: [
              { x1: 0, y1: 0, x2: S2, y2: 2, cls: 'c2' },
              { x1: 0, y1: 0, x2: 1, y2: S3, cls: 'c2' },
              { x1: 1, y1: S3, x2: S2, y2: 2, cls: 'c2' }
            ],
            points: [
              { x: S2, y: 2, label: 'P(√2, 2)', pos: 'tr', cls: 'c3' },
              { x: 1, y: S3, label: 'Q(1, √3)', pos: 'tl', cls: 'c4' }
            ],
            labels: [{ x: 2.05, y: 0.35, text: 'C', cls: 'c1' }, { x: 1.55, y: 1.75, text: '円', cls: 'dim' }]
          })
        }
      ],
      prereq: ['m-coord', 'm-quad'],
      tags: ['記述', '無理関数の微分', '最大値', '円との共有点', '三角形の面積']
    },

    /* ================= 2024 年度 ================= */

    /* ---------- 2024 第1問[1] 解の配置 ---------- */
    {
      id: 'sk-m-2024-1a',
      subject: 'math',
      level: 'mid',
      unit: 'm-quad',
      title: '2次方程式の解と 1 の大小',
      source: src(2024, '第1問[1]'),
      time: 6,
      body: R`次の文中の空欄 $\boxed{ア}$・$\boxed{イ}$ に当てはまる $a$ の値の範囲を求めよ。

実数 $a$ を係数にもつ $x$ の 2 次方程式 $x^{2} - 2ax + 2a^{2} - 3 = 0$ について、2 つの解がともに 1 より大きくなるような $a$ の値の範囲は $\boxed{ア}$ であり、2 つの解の間に 1 があるような $a$ の値の範囲は $\boxed{イ}$ である。`,
      fig: null,
      parts: [
        { label: 'ア（下限）', q: R`ア は $p < a < q$ の形になる。$p$ の値`, type: 'num', answer: (1 + S5) / 2, show: R`\frac{1 + \sqrt{5}}{2}`, hint: '根号は 2√3 または 2*sqrt(3) のように入力' },
        { label: 'ア（上限）', q: R`同じく $q$ の値`, type: 'num', answer: S3, show: R`\sqrt{3}` },
        { label: 'イ（下限）', q: R`イ は $r < a < s$ の形になる。$r$ の値`, type: 'num', answer: (1 - S5) / 2, show: R`\frac{1 - \sqrt{5}}{2}` },
        { label: 'イ（上限）', q: R`同じく $s$ の値`, type: 'num', answer: (1 + S5) / 2, show: R`\frac{1 + \sqrt{5}}{2}` }
      ],
      solution: [
        {
          t: '「判別式・軸・f(1) の符号」で考える',
          m: R`f(x) = x^{2} - 2ax + 2a^{2} - 3 = (x - a)^{2} + a^{2} - 3`,
          n: R`$y = f(x)$ のグラフ（下に凸の放物線）を使います。2 つの解がどちらも 1 より大きいのは、次の 3 つがすべて成り立つときです。
・$x$ 軸と異なる 2 点で交わる（判別式 $D > 0$）
・軸 $x = a$ が $1$ より右にある
・$x = 1$ でグラフが $x$ 軸より上にある（$f(1) > 0$）`,
          easy: R`方程式 $f(x) = 0$ の解は、放物線 $y = f(x)$ と $x$ 軸の交点の $x$ 座標です。「2 つの交点がどちらも $x = 1$ より右にある」ためには、(1) そもそも 2 点で交わる、(2) 放物線の山（谷）の中心がずっと右にある、(3) $x = 1$ の位置では放物線がまだ $x$ 軸の上にある、が必要です。絵を描いて 3 つの条件を確かめましょう。`
        },
        {
          t: '3 つの条件を計算する',
          m: [R`\frac{D}{4} = a^{2} - (2a^{2} - 3) = 3 - a^{2} > 0 \iff -\sqrt{3} < a < \sqrt{3}`, R`\text{軸}:\ a > 1`, R`f(1) = 2a^{2} - 2a - 2 = 2(a^{2} - a - 1) > 0 \iff a < \frac{1 - \sqrt{5}}{2},\ \frac{1 + \sqrt{5}}{2} < a`],
          n: R`$f(1) = 1 - 2a + 2a^{2} - 3$ です。$a^{2} - a - 1 = 0$ の解は $a = \frac{1 \pm \sqrt{5}}{2}$ です。`
        },
        {
          t: 'ア：共通部分',
          n: R`$a > 1$ より、$f(1) > 0$ の「$a < \frac{1 - \sqrt{5}}{2}$」の側は使えません。$\frac{1 + \sqrt{5}}{2} \fallingdotseq 1.62$、$\sqrt{3} \fallingdotseq 1.73$ なので、3 つの条件の共通部分は $\frac{1 + \sqrt{5}}{2} < a < \sqrt{3}$ です。`,
          easy: R`数直線に 3 つの範囲を書き込み、全部が重なる部分を読み取ります。$-1.73 < a < 1.73$、$a > 1$、「$a < -0.62$ または $a > 1.62$」の 3 つが重なるのは $1.62 < a < 1.73$ だけです。`,
          lv: 2
        },
        {
          t: 'イ：f(1) < 0',
          m: R`f(1) = 2(a^{2} - a - 1) < 0 \iff \frac{1 - \sqrt{5}}{2} < a < \frac{1 + \sqrt{5}}{2}`,
          n: R`$x^{2}$ の係数が正の 2 次関数で $f(1) < 0$ なら、グラフは $x = 1$ で $x$ 軸の下にあるので、$x$ 軸と必ず異なる 2 点で交わり、その間に $1$ をはさみます。つまり判別式のチェックは不要で、1 より大きい解と小さい解が 1 つずつあることになります。よって $\frac{1 - \sqrt{5}}{2} < a < \frac{1 + \sqrt{5}}{2}$ です。`,
          pro: R`$x^{2}$ の係数が正の 2 次式では「$1$ をはさんで解が 1 つずつ $\iff f(1) < 0$」の 1 本で済みます。「ともに $1$ より大きい」は ① $D > 0$ ② 軸 $> 1$ ③ $f(1) > 0$ の 3 点セットを、図を描いて機械的に確認します。`,
          fig: G({
            w: 340, h: 240, x: [-2, 4.6], y: [-4, 6],
            curves: [
              { f: (x) => x * x - 3.4 * x + 2.78, cls: 'c1' },
              { f: (x) => x * x - x - 2.5, cls: 'c2' }
            ],
            vlines: [{ x: 1, label: 'x = 1', dash: true }],
            labels: [
              { x: 3.2, y: 4.4, text: 'a = 1.7（ア）', cls: 'c1' },
              { x: -1.9, y: 4.6, text: 'a = 0.5（イ）', cls: 'c2' }
            ]
          })
        }
      ],
      tags: ['小問集合', '空所補充', '解の配置', '判別式']
    },

    /* ---------- 2024 第1問[2] 三角関数 ---------- */
    {
      id: 'sk-m-2024-1b',
      subject: 'math',
      level: 'mid',
      unit: 'm-trig2',
      title: '三角関数の最大・最小',
      source: src(2024, '第1問[2]'),
      time: 6,
      body: R`次の文中の空欄 $\boxed{ウ}$・$\boxed{エ}$ に当てはまる数値を求めよ。

$0 \le x \le \dfrac{\pi}{2}$ における関数 $f(x) = 2\cos^{2} x - 2\sqrt{3}\sin x\cos x$ の最小値を与える $x$ の値は $\boxed{ウ}$、最大値は $\boxed{エ}$ である。`,
      fig: null,
      parts: [
        { label: 'ウ', q: R`最小値をとる $x$ の値`, type: 'num', answer: PI / 3, show: R`\frac{\pi}{3}`, hint: 'π は π または pi と入力（例: 2π/5）' },
        { label: 'エ', q: R`$f(x)$ の最大値`, type: 'num', answer: 2 }
      ],
      solution: [
        {
          t: '2 倍角の公式で次数を下げる',
          m: [R`2\cos^{2} x = 1 + \cos 2x,\qquad 2\sin x\cos x = \sin 2x`, R`f(x) = 1 + \cos 2x - \sqrt{3}\sin 2x`],
          easy: R`$\cos^{2} x$ や $\sin x\cos x$ のような「2 次」の式は、2 倍角の公式で $\cos 2x,\ \sin 2x$ の「1 次」の式に直せます。こうすると次の合成が使えるようになります。`
        },
        {
          t: '三角関数の合成',
          m: [R`\cos 2x - \sqrt{3}\sin 2x = 2\left(\frac{1}{2}\cos 2x - \frac{\sqrt{3}}{2}\sin 2x\right) = 2\cos\left(2x + \frac{\pi}{3}\right)`, R`f(x) = 2\cos\left(2x + \frac{\pi}{3}\right) + 1`],
          easy: R`**合成**は、$\cos$ と $\sin$ の和を 1 つの三角関数にまとめる変形です。係数 $1$ と $-\sqrt{3}$ から、$\sqrt{1 + 3} = 2$ をくくり出すと、かっこの中が $\frac{1}{2} = \cos\frac{\pi}{3}$、$\frac{\sqrt{3}}{2} = \sin\frac{\pi}{3}$ になります。あとは加法定理 $\cos(A + B) = \cos A\cos B - \sin A\sin B$ を逆向きに使います。`
        },
        {
          t: '合成の確認（加法定理で展開）',
          m: R`2\cos\left(2x + \frac{\pi}{3}\right) = 2\left(\cos 2x\cos\frac{\pi}{3} - \sin 2x\sin\frac{\pi}{3}\right) = \cos 2x - \sqrt{3}\sin 2x`,
          n: R`$\cos\frac{\pi}{3} = \frac{1}{2},\ \sin\frac{\pi}{3} = \frac{\sqrt{3}}{2}$ を代入すると、確かに元の式に戻ります。`,
          lv: 3
        },
        {
          t: '角の範囲を求める',
          m: R`0 \le x \le \frac{\pi}{2} \;\Rightarrow\; \frac{\pi}{3} \le 2x + \frac{\pi}{3} \le \frac{4}{3}\pi`,
          n: R`$\theta = 2x + \frac{\pi}{3}$ とおくと、この範囲で $\cos\theta$ は $\theta = \frac{\pi}{3}$ の $\frac{1}{2}$ から $\theta = \pi$ の $-1$ まで減り、その後 $\theta = \frac{4}{3}\pi$ の $-\frac{1}{2}$ まで増えます。`
        },
        {
          t: '最大値と最小値',
          m: [R`\theta = \pi\ \left(x = \frac{\pi}{3}\right)\ \text{のとき最小値}\ 2 \cdot (-1) + 1 = -1`, R`\theta = \frac{\pi}{3}\ (x = 0)\ \text{のとき最大値}\ 2 \cdot \frac{1}{2} + 1 = 2`],
          n: R`よって ウ = $\frac{\pi}{3}$、エ = $2$ です。最大値は区間の左端 $x = 0$ でとることに注意します（右端 $\theta = \frac{4}{3}\pi$ では $\cos\theta = -\frac{1}{2}$ で、左端の $\frac{1}{2}$ より小さくなります）。`,
          pro: R`合成した後は「角の範囲 → 単位円で $\cos$ の範囲」を必ず確認します。角の区間が $\pi$ をまたぐと最小は途中で決まりますが、最大は両端の比較になる典型パターンです。`,
          fig: G({
            w: 340, h: 220, x: [-0.15, 1.85], y: [-1.6, 2.6],
            curves: [{ f: (x) => 2 * Math.cos(x) * Math.cos(x) - 2 * S3 * Math.sin(x) * Math.cos(x), cls: 'c1', domain: [0, PI / 2] }],
            vlines: [{ x: PI / 2, label: 'x = π/2' }],
            points: [
              { x: 0, y: 2, label: '最大 (0, 2)', pos: 'tr', cls: 'c3' },
              { x: PI / 3, y: -1, label: '最小 (π/3, −1)', pos: 'tr', cls: 'c4' }
            ]
          })
        }
      ],
      tags: ['小問集合', '空所補充', '2倍角', '合成', '最大最小']
    },

    /* ---------- 2024 第1問[3] 二項定理と整式の余り ---------- */
    {
      id: 'sk-m-2024-1c',
      subject: 'math',
      level: 'mid',
      unit: 'm-proof',
      title: '二項定理と整式の余り',
      source: src(2024, '第1問[3]'),
      time: 6,
      body: R`次の文中の空欄 $\boxed{オ}$・$\boxed{カ}$ に当てはまる数値または式を求めよ。

展開式 $(2x - 3)^{6}$ における $x^{4}$ の項の係数は $\boxed{オ}$ である。また、整式 $x^{15}$ を $(x + 1)^{2}$ で割ると、余りは $\boxed{カ}$ となる。`,
      fig: null,
      parts: [
        { label: 'オ', q: R`$x^{4}$ の項の係数`, type: 'num', answer: 2160 },
        { label: 'カ', q: R`$x^{15}$ を $(x + 1)^{2}$ で割った余り（$x$ の式）`, type: 'expr', answer: '15x+14', vars: ['x'], show: R`15x + 14`, hint: '例: 3x-2 のように入力' }
      ],
      solution: [
        {
          t: '二項定理の一般項',
          m: [R`(2x - 3)^{6} = \sum_{r=0}^{6} \C{6}{r}\,(2x)^{r}(-3)^{6-r}`, R`r = 4:\quad \C{6}{4}\,(2x)^{4}(-3)^{2} = 15 \cdot 16 \cdot 9\,x^{4} = 2160\,x^{4}`],
          n: R`よって オ = $2160$ です。`,
          easy: R`**二項定理**: $(a + b)^{n}$ を展開すると、$a^{r}b^{n-r}$ の項の係数は「$n$ 個のかっこから $a$ を $r$ 個選ぶ選び方の数」$\C{n}{r}$ になります。ここでは $a = 2x,\ b = -3$ なので、$2^{4}$ と $(-3)^{2}$ も係数に含めて掛けるのを忘れないようにします。$\C{6}{4} = \C{6}{2} = 15$ です。`
        },
        {
          t: 'x = (x + 1) − 1 とみて展開する',
          m: R`x^{15} = \left\{(x + 1) - 1\right\}^{15} = \sum_{r=0}^{15} \C{15}{r}\,(x + 1)^{r}(-1)^{15-r}`,
          n: R`割る式が $(x + 1)^{2}$ なので、$x + 1$ のべきで展開します。$x$ を $(x + 1) - 1$ と書き直すのがポイントです。`
        },
        {
          t: '(x + 1)² の倍数になる項を除く',
          n: R`$r \ge 2$ の項は $(x + 1)^{2}$ を因数にもつので、割り算の商の側に入ります。余りに残るのは $r = 0,\ 1$ の 2 項です。`,
          easy: R`整数の割り算で「$100$ を $7$ で割る」ときに $7$ の倍数を取り除いて余りを見るのと同じ考え方です。ここでは $(x + 1)^{2}$ で割り切れる項（$r \ge 2$）をすべて取り除きます。`,
          lv: 2
        },
        {
          t: '残りの 2 項を計算する',
          m: [R`r = 0:\quad (-1)^{15} = -1`, R`r = 1:\quad \C{15}{1}\,(x + 1)(-1)^{14} = 15(x + 1)`, R`\text{余り} = -1 + 15(x + 1) = 15x + 14`],
          n: R`割る式が 2 次式なので、余りは 1 次以下の整式になり、$15x + 14$ はその条件を満たしています。よって カ = $15x + 14$ です。`,
          pro: R`$x^{n}$ を $(x - a)^{2}$ で割った余りは $n a^{n-1}(x - a) + a^{n}$ と一般に書けます（二項定理で $r = 0,\ 1$ の 2 項を拾うか、微分を使うかのどちらでも出せます）。整数の累乗の余り（$a^{n}$ を $p^{2}$ で割るなど）にも同じ発想が使えます。`
        },
        {
          t: '検算：x = −1 での値と微分',
          m: [R`x^{15} = (x + 1)^{2}Q(x) + 15x + 14`, R`x = -1:\ (-1)^{15} = -1 = -15 + 14`, R`\text{両辺を微分して}\ x = -1:\ 15(-1)^{14} = 15`],
          n: R`$(x + 1)^{2}Q(x)$ は $x = -1$ で値も微分係数も $0$ になるので、余りの値 $-1$ と傾き $15$ が $x^{15}$ のそれと一致していることが確かめられます。`,
          lv: 2
        }
      ],
      prereq: ['m-expr'],
      tags: ['小問集合', '空所補充', '二項定理', '整式の余り']
    },

    /* ---------- 2024 第2問 指数関数の微積分 ---------- */
    {
      id: 'sk-m-2024-2',
      subject: 'math',
      level: 'mid',
      unit: 'm-integ3',
      title: '指数×多項式の極値・面積・体積',
      source: src(2024, '第2問'),
      time: 20,
      body: R`関数
$$f(x) = x e^{-x}$$
について、次の問いに答えよ。ただし $e$ は自然対数の底である。

(1) $f(x)$ の増減を調べ、極値を求めよ。
(2) 方程式 $f(x) = \dfrac{1}{3}$ の異なる実数解の個数を求めよ。
(3) $x$ 軸、直線 $x = 1$、曲線 $y = f(x)$ の 3 つで囲まれた図形を $D$ とし、その面積を $S$ とする。$S$ を求めよ。
(4) $D$ を $x$ 軸のまわりに回転してできる立体の体積 $V$ を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)ア', q: R`$f(x)$ は $x = \boxed{ア}$ で極大値をとる（極小値はない）。ア の値`, type: 'num', answer: 1 },
        { label: '(1)イ', q: R`その極大値`, type: 'num', answer: 1 / E, show: R`\frac{1}{e}`, hint: '自然対数の底を含む値は 2/e や e^2 のように入力' },
        { label: '(2)', q: R`異なる実数解の個数`, type: 'num', answer: 2 },
        { label: '(3)', q: R`面積 $S$`, type: 'num', answer: 1 - 2 / E, show: R`1 - \frac{2}{e}`, hint: '例: 3/e+1 のように入力' },
        { label: '(4)', q: R`体積 $V$`, type: 'num', answer: PI * (1 - 5 / (E * E)) / 4, show: R`\frac{\pi}{4}\left(1 - \frac{5}{e^{2}}\right)`, hint: 'π と e を使って入力（例: π(1 - 2/e^2)）' }
      ],
      solution: [
        {
          t: '(1) 導関数を求めて増減を調べる',
          m: R`f'(x) = e^{-x} + x\cdot\left(-e^{-x}\right) = (1 - x)\,e^{-x}`,
          n: R`$e^{-x} > 0$ なので $f'(x)$ の符号は $1 - x$ と同じです。$x < 1$ で $f'(x) > 0$（増加）、$x > 1$ で $f'(x) < 0$（減少）。よって $x = 1$ で極大値 $f(1) = \frac{1}{e}$ をとり、極小値はありません。`,
          easy: R`積の微分 $(uv)' = u'v + uv'$ と、$(e^{-x})' = -e^{-x}$ を使います。$e^{-x}$ は常に正の値なので、$f'(x)$ が正か負かは $(1 - x)$ だけで決まります。`
        },
        {
          t: '(2) グラフの形を調べる',
          m: [R`x \to -\infty:\ f(x) \to -\infty,\qquad x \to \infty:\ f(x) \to 0\ \left(\lim_{x \to \infty}\frac{x}{e^{x}} = 0\right)`, R`f(0) = 0,\qquad f(1) = \frac{1}{e} \fallingdotseq 0.368 > \frac{1}{3}`],
          n: R`$e < 3$ より $\frac{1}{e} > \frac{1}{3}$ です。増減表とあわせると次のようになります。
・$x \le 0$ では $f(x) \le 0 < \frac{1}{3}$ なので解なし。
・$0 < x \le 1$ では $f(x)$ は $0$ から $\frac{1}{e}$ まで増加するので、$\frac{1}{3}$ になる点がちょうど 1 つ。
・$x \ge 1$ では $f(x)$ は $\frac{1}{e}$ から $0$ に近づきながら減少するので、$\frac{1}{3}$ になる点がちょうど 1 つ。
よって実数解は **2 個** です。`,
          easy: R`方程式 $f(x) = \frac{1}{3}$ の解は、グラフ $y = f(x)$ と水平な直線 $y = \frac{1}{3}$ の交点の $x$ 座標です。グラフは山の形（$x = 1$ で頂上 $\frac{1}{e} \fallingdotseq 0.37$）なので、直線が山の頂上より低い位置（$\frac{1}{3} \fallingdotseq 0.33$）を通っていれば、山の左側と右側で 1 回ずつ、計 2 回交わります。頂上より低いかどうかは $e < 3$ から判断できます。`,
          fig: G({
            w: 340, h: 230, x: [-0.5, 5], y: [-0.2, 0.5],
            curves: [{ f: (x) => x * Math.exp(-x), cls: 'c1', domain: [-0.5, 5] }],
            hlines: [{ y: 1 / 3, dash: true }],
            points: [{ x: 1, y: 1 / E, label: '極大 (1, 1/e)', pos: 'tr', cls: 'c3' }],
            labels: [{ x: 3.4, y: 0.36, text: 'y = 1/3', cls: 'dim' }, { x: 3.0, y: 0.19, text: 'y = f(x)', cls: 'c1' }]
          })
        },
        {
          t: '(3) 面積は部分積分で求める',
          m: [R`S = \int_{0}^{1} x e^{-x}\,dx = \left[-x e^{-x}\right]_{0}^{1} + \int_{0}^{1} e^{-x}\,dx`, R`= -\frac{1}{e} + \left[-e^{-x}\right]_{0}^{1} = -\frac{1}{e} + \left(1 - \frac{1}{e}\right) = 1 - \frac{2}{e}`],
          n: R`$0 \le x \le 1$ で $f(x) \ge 0$ なので、$D$ は $x = 0$ から $x = 1$ までの部分です。$x$ を微分して $1$ にし、$e^{-x}$ を積分して $-e^{-x}$ にする部分積分を使いました。よって $S = 1 - \frac{2}{e}\ (\fallingdotseq 0.264)$ です。`,
          easy: R`**部分積分**は積の微分 $(uv)' = u'v + uv'$ を逆に使う方法で、$\int u'v\,dx = uv - \int uv'\,dx$ です。$x$ は微分すると $1$ になって簡単になり、$e^{-x}$ は積分しても形が変わらないので、$x$ を「微分する側」、$e^{-x}$ を「積分する側」に選びます。`,
          fig: G({
            w: 340, h: 220, x: [-0.3, 3.2], y: [-0.1, 0.5],
            curves: [{ f: (x) => x * Math.exp(-x), cls: 'c1', domain: [0, 3.2] }],
            fills: [{ f: (x) => x * Math.exp(-x), from: 0, to: 1, cls: 'f1' }],
            vlines: [{ x: 1, label: 'x = 1' }],
            labels: [{ x: 0.35, y: 0.1, text: 'D', cls: 'c1' }]
          })
        },
        {
          t: '(4) 回転体の体積の式',
          m: R`V = \pi\int_{0}^{1} \{f(x)\}^{2}\,dx = \pi\int_{0}^{1} x^{2}e^{-2x}\,dx`,
          easy: R`$x$ 軸のまわりに回転させた立体を $x$ 軸に垂直な平面で切ると、切り口は半径 $f(x)$ の円（面積 $\pi\{f(x)\}^{2}$）です。この面積を $x$ について積分すると体積になります。`,
          lv: 2
        },
        {
          t: '部分積分を 2 回行う',
          m: [R`\int x^{2}e^{-2x}\,dx = -\frac{x^{2}}{2}e^{-2x} + \int x e^{-2x}\,dx`, R`\int x e^{-2x}\,dx = -\frac{x}{2}e^{-2x} + \int \frac{1}{2}e^{-2x}\,dx = -\frac{x}{2}e^{-2x} - \frac{1}{4}e^{-2x}`, R`\therefore\quad \int x^{2}e^{-2x}\,dx = -e^{-2x}\left(\frac{x^{2}}{2} + \frac{x}{2} + \frac{1}{4}\right) + C`],
          n: R`$e^{-2x}$ の積分は $-\frac{1}{2}e^{-2x}$ です。$x^{2}$ を微分すると $2x$、さらに微分して $2$ と次数が下がるので、2 回の部分積分で終わります。`,
          easy: R`$x^{2}$ のままでは積分できないので、部分積分で $x^{2}$ を微分して $2x$ にします。それでもまだ $x$ が残るので、もう一度部分積分して $x$ を $1$ にします。「次数が下がるまで部分積分を繰り返す」のが $x^{n}e^{ax}$ の積分の定石です。`
        },
        {
          t: '値を代入する',
          m: R`V = \pi\left[-e^{-2x}\left(\frac{x^{2}}{2} + \frac{x}{2} + \frac{1}{4}\right)\right]_{0}^{1} = \pi\left(-\frac{5}{4e^{2}} + \frac{1}{4}\right) = \frac{\pi}{4}\left(1 - \frac{5}{e^{2}}\right)`,
          n: R`$x = 1$ では $\frac{1}{2} + \frac{1}{2} + \frac{1}{4} = \frac{5}{4}$、$x = 0$ では $\frac{1}{4}$ です。よって $V = \frac{\pi}{4}\left(1 - \frac{5}{e^{2}}\right)$（$\fallingdotseq 0.254$）です。`,
          pro: R`$x^{n}e^{ax}$ の不定積分は「$e^{ax}\times$（$n$ 次の整式）」の形になるので、$\left\{e^{-2x}(px^{2} + qx + r)\right\}' = x^{2}e^{-2x}$ となるように係数 $p, q, r$ を比べて決める方法（係数比較）も速くて検算しやすいです。`
        }
      ],
      prereq: ['m-diff3', 'm-explog'],
      tags: ['記述', '極値', '方程式の解の個数', '部分積分', '回転体', '数III']
    },

    /* ---------- 2024 第3問 整式の割り算と虚数 ---------- */
    {
      id: 'sk-m-2024-3',
      subject: 'math',
      level: 'mid',
      unit: 'm-complex',
      title: '高次式の余りと虚数解の利用',
      source: src(2024, '第3問'),
      time: 15,
      body: R`整式 $P(x) = x^{100} + 2x^{50} + 3$ について、次の問いに答えよ。

(1) $x^{6} - 1$ を $x^{2} - x + 1$ で割ったときの商と余りを求めよ。
(2) 虚数 $\alpha$ が $\alpha^{2} - \alpha + 1 = 0$ を満たすとき、$\alpha^{3}$ と $\alpha^{6}$ の値を求めよ。
(3) $P(x)$ を $x^{2} - x + 1$ で割ったときの余りを求めよ。`,
      fig: null,
      parts: [
        { label: '(1)商', q: R`商（$x$ の式）`, type: 'expr', answer: 'x^4+x^3-x-1', vars: ['x'], show: R`x^{4} + x^{3} - x - 1`, hint: '例: x^3-2x+5 のように入力' },
        { label: '(1)余り', q: R`余り`, type: 'num', answer: 0 },
        { label: '(2)α の 3 乗', q: R`$\alpha^{3}$ の値`, type: 'num', answer: -1 },
        { label: '(2)α の 6 乗', q: R`$\alpha^{6}$ の値`, type: 'num', answer: 1 },
        { label: '(3)', q: R`余り（$x$ の式）`, type: 'expr', answer: 'x+1', vars: ['x'], show: R`x + 1`, hint: '例: 2x-5 のように入力' }
      ],
      solution: [
        {
          t: '(1) 割り算を実行する',
          m: [R`x^{6} - 1 = x^{4}(x^{2} - x + 1) + (x^{5} - x^{4} - 1)`, R`x^{5} - x^{4} - 1 = x^{3}(x^{2} - x + 1) + (-x^{3} - 1)`, R`-x^{3} - 1 = -x(x^{2} - x + 1) + (-x^{2} + x - 1)`, R`-x^{2} + x - 1 = -1\cdot(x^{2} - x + 1)`],
          n: R`商は $x^{4} + x^{3} - x - 1$、余りは $0$ です。割り切れるので $x^{6} - 1 = (x^{2} - x + 1)(x^{4} + x^{3} - x - 1)$ と書けます。`,
          easy: R`整式の割り算は数の筆算と同じ手順です。最高次の項どうしを割って商の 1 項目を立て、それに割る式を掛けて引く、という操作を、余りの次数が割る式の次数 $2$ より小さくなるまで繰り返します。`
        },
        {
          t: '因数分解でも確かめられる',
          m: R`x^{6} - 1 = (x^{3} - 1)(x^{3} + 1) = (x - 1)(x^{2} + x + 1)(x + 1)(x^{2} - x + 1)`,
          n: R`$x^{3} + 1 = (x + 1)(x^{2} - x + 1)$ を使うと、$x^{2} - x + 1$ を因数にもつことがすぐにわかります。商は $(x - 1)(x + 1)(x^{2} + x + 1) = x^{4} + x^{3} - x - 1$ で、(1) と一致します。`,
          lv: 3
        },
        {
          t: '(2) α の性質を使う',
          m: [R`\alpha^{2} = \alpha - 1`, R`\alpha^{3} = \alpha\cdot\alpha^{2} = \alpha^{2} - \alpha = (\alpha - 1) - \alpha = -1`, R`\alpha^{6} = (\alpha^{3})^{2} = (-1)^{2} = 1`],
          n: R`よって $\alpha^{3} = -1$、$\alpha^{6} = 1$ です。(1) の等式に $x = \alpha$ を代入しても、$\alpha^{6} - 1 = 0\cdot(\cdots) = 0$ から $\alpha^{6} = 1$ がわかります。`,
          easy: R`$\alpha$ は方程式 $x^{2} - x + 1 = 0$ の解なので、$\alpha^{2} - \alpha + 1 = 0$ が成り立ちます。これを $\alpha^{2} = \alpha - 1$ と変形すると、2 乗を 1 次式に置きかえられるので、$\alpha^{3},\ \alpha^{4},\ \cdots$ を次々に簡単にできます。`
        },
        {
          t: '(3) 割り算の等式に α を代入する',
          m: [R`P(x) = (x^{2} - x + 1)\,Q(x) + ax + b\qquad (a,\ b\ \text{は実数})`, R`P(\alpha) = a\alpha + b`],
          n: R`割る式が 2 次式なので、余りは 1 次以下の整式 $ax + b$ とおけます。$x = \alpha$ を代入すると $\alpha^{2} - \alpha + 1 = 0$ より、右辺の第 1 項が消えます。`,
          easy: R`余りを $ax + b$ とおいて、割る式が $0$ になる値 $x = \alpha$ を代入する、というのが「余りを求める」ときの定石です。$\alpha$ は $x^{2} - x + 1 = 0$ の解なので、$Q(x)$ がどんな式でも $(\alpha^{2} - \alpha + 1)Q(\alpha) = 0$ になります。`
        },
        {
          t: 'P(α) を α の 1 次式にする',
          m: [R`\alpha^{100} = (\alpha^{6})^{16}\,\alpha^{4} = \alpha^{4} = \alpha\cdot\alpha^{3} = -\alpha`, R`\alpha^{50} = (\alpha^{6})^{8}\,\alpha^{2} = \alpha^{2} = \alpha - 1`, R`P(\alpha) = -\alpha + 2(\alpha - 1) + 3 = \alpha + 1`],
          n: R`$100 = 6 \times 16 + 4$、$50 = 6 \times 8 + 2$ に着目して、$\alpha^{6} = 1$ で次数を下げました。`,
          lv: 2
        },
        {
          t: '虚数の係数を比べる',
          m: [R`a\alpha + b = \alpha + 1 \;\Rightarrow\; (a - 1)\alpha = 1 - b`, R`a = 1,\quad b = 1`],
          n: R`もし $a - 1 \ne 0$ なら $\alpha = \frac{1 - b}{a - 1}$ となり、右辺は実数なので $\alpha$ が虚数であることに反します。よって $a - 1 = 0$ で、そのとき $1 - b = 0$ です。したがって余りは $x + 1$ です。`,
          easy: R`**虚数**とは $p + qi$（$q \ne 0$）の形の数、つまり実数でない数のことです。「（実数）$\times\,\alpha\,=$（実数）」の形の等式で $\alpha$ が実数でないなら、$\alpha$ の係数が $0$ でなければ矛盾してしまう、という論法は複素数の問題でよく使います。`,
          pro: R`別解: (1) より $x^{6} \equiv 1$（$x^{2} - x + 1$ を法とする）、さらに $x^{3} + 1 = (x + 1)(x^{2} - x + 1)$ から $x^{3} \equiv -1$。$P(x) \equiv x^{4} + 2x^{2} + 3 \equiv -x + 2(x - 1) + 3 = x + 1$（$x^{2} \equiv x - 1$）と、虚数を使わずに次数を下げていく方法もあります。`
        }
      ],
      prereq: ['m-proof', 'm-expr'],
      tags: ['記述', '整式の割り算', '虚数', '1の6乗根', '係数比較']
    },

    /* ---------- 2024 第4問 平行四辺形内の交点とベクトル ---------- */
    {
      id: 'sk-m-2024-4',
      subject: 'math',
      level: 'mid',
      unit: 'm-vec',
      title: '平行四辺形内の 2 線分の交点と面積',
      source: src(2024, '第4問'),
      time: 15,
      body: R`平行四辺形 ABCD の辺 BC を $2:1$ に内分する点を E、辺 CD を $1:2$ に内分する点を F とし、線分 AE と線分 BF の交点を P とする。平行四辺形 ABCD の面積を $S$ として、次の問いに答えよ。

(1) $\mathrm{AP}:\mathrm{PE}$ と $\mathrm{BP}:\mathrm{PF}$ を、それぞれ最も簡単な整数の比で表せ。
(2) $\overrightarrow{\mathrm{AP}}$ を $\overrightarrow{\mathrm{AB}}$ と $\overrightarrow{\mathrm{AD}}$ の 1 次結合の形で表せ。
(3) $\triangle\mathrm{ABP}$ と $\triangle\mathrm{APD}$ の面積は、それぞれ $S$ の何倍か。`,
      fig: null,
      parts: [
        { label: '(1)AP', q: R`$\mathrm{AP}:\mathrm{PE} = \boxed{\ \ } : \boxed{\ \ }$ の 1 つ目の空欄`, type: 'num', answer: 9 },
        { label: '(1)PE', q: R`同じく 2 つ目の空欄`, type: 'num', answer: 2 },
        { label: '(1)BP', q: R`$\mathrm{BP}:\mathrm{PF} = \boxed{\ \ } : \boxed{\ \ }$ の 1 つ目の空欄`, type: 'num', answer: 6 },
        { label: '(1)PF', q: R`同じく 2 つ目の空欄`, type: 'num', answer: 5 },
        { label: '(2)AB の係数', q: R`$\overrightarrow{\mathrm{AP}} = s\,\overrightarrow{\mathrm{AB}} + t\,\overrightarrow{\mathrm{AD}}$ の $s$`, type: 'num', answer: 9 / 11, show: R`\frac{9}{11}`, hint: '分数は 3/4 のように入力' },
        { label: '(2)AD の係数', q: R`同じく $t$`, type: 'num', answer: 6 / 11, show: R`\frac{6}{11}` },
        { label: '(3)△ABP', q: R`$\triangle\mathrm{ABP}$ の面積は $S$ の何倍か`, type: 'num', answer: 3 / 11, show: R`\frac{3}{11}` },
        { label: '(3)△APD', q: R`$\triangle\mathrm{APD}$ の面積は $S$ の何倍か`, type: 'num', answer: 9 / 22, show: R`\frac{9}{22}` }
      ],
      solution: [
        {
          t: 'E, F の位置ベクトルを AB, AD で表す',
          m: [R`\overrightarrow{\mathrm{AB}} = \vec{b},\quad \overrightarrow{\mathrm{AD}} = \vec{d}\ \text{とおく}\quad (\overrightarrow{\mathrm{BC}} = \vec{d},\ \overrightarrow{\mathrm{DC}} = \vec{b})`, R`\overrightarrow{\mathrm{AE}} = \overrightarrow{\mathrm{AB}} + \frac{2}{3}\overrightarrow{\mathrm{BC}} = \vec{b} + \frac{2}{3}\vec{d}`, R`\overrightarrow{\mathrm{AF}} = \overrightarrow{\mathrm{AD}} + \frac{2}{3}\overrightarrow{\mathrm{DC}} = \frac{2}{3}\vec{b} + \vec{d}`],
          n: R`平行四辺形なので $\overrightarrow{\mathrm{BC}} = \overrightarrow{\mathrm{AD}}$、$\overrightarrow{\mathrm{DC}} = \overrightarrow{\mathrm{AB}}$ です。E は BC を $2:1$ に内分するので B から $\frac{2}{3}$ 進んだ点、F は CD を $1:2$ に内分するので、D から C へ向かって $\frac{2}{3}$ 進んだ点（C から $\frac{1}{3}$ 戻った点）です。`,
          easy: R`**平行四辺形**では、向かい合う辺は平行で長さが等しいので、$\overrightarrow{\mathrm{BC}} = \overrightarrow{\mathrm{AD}}$、$\overrightarrow{\mathrm{DC}} = \overrightarrow{\mathrm{AB}}$ です。A を始点にそろえて、すべてのベクトルを $\vec{b} = \overrightarrow{\mathrm{AB}}$ と $\vec{d} = \overrightarrow{\mathrm{AD}}$ で表すのが方針です。内分点は「その辺を（分子の数）/（分子と分母の和）だけ進んだ位置」と読めます。`
        },
        {
          t: 'P を 2 通りに表して比べる',
          m: [R`\text{P は AE 上}:\quad \overrightarrow{\mathrm{AP}} = k\,\overrightarrow{\mathrm{AE}} = k\vec{b} + \frac{2k}{3}\vec{d}`, R`\text{P は BF 上}:\quad \overrightarrow{\mathrm{AP}} = \vec{b} + l\left(\overrightarrow{\mathrm{AF}} - \vec{b}\right) = \left(1 - \frac{l}{3}\right)\vec{b} + l\,\vec{d}`, R`k = 1 - \frac{l}{3},\quad \frac{2k}{3} = l`],
          n: R`$\vec{b},\ \vec{d}$ は 0 でなく平行でもない（1 次独立）ので、同じ点を表す 2 つの式の係数が一致します。2 式目から $k = \frac{3l}{2}$、これを 1 式目に代入すると $\frac{3l}{2} = 1 - \frac{l}{3}$ となり、$l = \frac{6}{11}$、$k = \frac{9}{11}$ です。`,
          easy: R`P は「線分 AE の上の点」でもあり「線分 BF の上の点」でもあります。同じ点を 2 通りの式で書いて、$\vec{b}$ の係数どうし、$\vec{d}$ の係数どうしを比べると、$k,\ l$ についての連立方程式ができます。ベクトルが平行でなければ、「係数を比べてよい」ことが保証されます。`
        },
        {
          t: '(1) 比を読み取る',
          m: [R`\overrightarrow{\mathrm{AP}} = \frac{9}{11}\overrightarrow{\mathrm{AE}} \;\Rightarrow\; \mathrm{AP}:\mathrm{PE} = 9:2`, R`\overrightarrow{\mathrm{BP}} = \frac{6}{11}\overrightarrow{\mathrm{BF}} \;\Rightarrow\; \mathrm{BP}:\mathrm{PF} = 6:5`],
          n: R`$\overrightarrow{\mathrm{AP}} = k\overrightarrow{\mathrm{AE}}$ なら $\mathrm{AP}:\mathrm{PE} = k:(1 - k)$ です。よって (1) の答えは $\mathrm{AP}:\mathrm{PE} = 9:2$、$\mathrm{BP}:\mathrm{PF} = 6:5$ です。`,
          pro: R`補助線でも確かめられます。直線 BF と直線 AD の交点を G とすると、$\triangle\mathrm{FCB} \sim \triangle\mathrm{FDG}$（相似比 $1:2$）から $\mathrm{DG} = 2\,\mathrm{AD}$、したがって $\mathrm{AG} = 3\,\mathrm{AD}$ です。$\mathrm{AG} \parallel \mathrm{EB}$ なので $\triangle\mathrm{PAG} \sim \triangle\mathrm{PEB}$ で、$\mathrm{AP}:\mathrm{PE} = \mathrm{AG}:\mathrm{EB} = 3:\frac{2}{3} = 9:2$ となります。ベクトルの係数比較は、補助線を引かずに機械的に解けるのが利点です。`,
          fig: (function () {
            const d = JK.plot.draw(340, 240);
            const A = [30, 210], B = [240, 210], D = [90, 45], C = [300, 45];
            const E = [B[0] + (C[0] - B[0]) * 2 / 3, B[1] + (C[1] - B[1]) * 2 / 3];
            const F = [C[0] + (D[0] - C[0]) / 3, C[1] + (D[1] - C[1]) / 3];
            const Pp = [A[0] + (E[0] - A[0]) * 9 / 11, A[1] + (E[1] - A[1]) * 9 / 11];
            d.poly([A, B, C, D], { cls: 'fg', fill: 'f0' });
            d.line(A[0], A[1], E[0], E[1], { cls: 'c1', w: 1.8 });
            d.line(B[0], B[1], F[0], F[1], { cls: 'c2', w: 1.8 });
            d.dot(Pp[0], Pp[1], { cls: 'c3' });
            d.dot(E[0], E[1], { cls: 'c1' });
            d.dot(F[0], F[1], { cls: 'c2' });
            d.text(A[0] - 10, A[1] + 15, 'A');
            d.text(B[0] + 10, B[1] + 15, 'B');
            d.text(C[0] + 10, C[1] - 6, 'C');
            d.text(D[0] - 10, D[1] - 6, 'D');
            d.text(E[0] + 14, E[1] + 3, 'E', { cls: 'c1' });
            d.text(F[0] + 2, F[1] - 9, 'F', { cls: 'c2' });
            d.text(Pp[0] - 10, Pp[1] + 15, 'P', { cls: 'c3' });
            d.text(285, 160, '2 : 1', { cls: 'dim', size: 11 });
            d.text(265, 36, '1 : 2', { cls: 'dim', size: 11 });
            d.text(170, 232, 'AP : PE = 9 : 2,   BP : PF = 6 : 5', { cls: 'dim', size: 11 });
            return d.svg();
          })()
        },
        {
          t: '(2) AP を AB, AD で表す',
          m: R`\overrightarrow{\mathrm{AP}} = \frac{9}{11}\left(\vec{b} + \frac{2}{3}\vec{d}\right) = \frac{9}{11}\vec{b} + \frac{6}{11}\vec{d}`,
          n: R`$k = \frac{9}{11}$ を $\overrightarrow{\mathrm{AP}} = k\vec{b} + \frac{2k}{3}\vec{d}$ に代入しました。よって $\overrightarrow{\mathrm{AP}} = \frac{9}{11}\overrightarrow{\mathrm{AB}} + \frac{6}{11}\overrightarrow{\mathrm{AD}}$ です。BF 上の式 $\left(1 - \frac{l}{3}\right)\vec{b} + l\vec{d}$ に $l = \frac{6}{11}$ を代入しても $\frac{9}{11}\vec{b} + \frac{6}{11}\vec{d}$ となり、一致します。`
        },
        {
          t: '(3) 係数と面積の対応',
          m: [R`\overrightarrow{\mathrm{AP}} = s\overrightarrow{\mathrm{AB}} + t\overrightarrow{\mathrm{AD}} \;\Rightarrow\; \triangle\mathrm{ABP} = t\cdot\triangle\mathrm{ABD} = \frac{t}{2}S,\quad \triangle\mathrm{APD} = s\cdot\triangle\mathrm{ABD} = \frac{s}{2}S`, R`\triangle\mathrm{ABP} = \frac{1}{2}\cdot\frac{6}{11}S = \frac{3}{11}S,\qquad \triangle\mathrm{APD} = \frac{1}{2}\cdot\frac{9}{11}S = \frac{9}{22}S`],
          n: R`P から直線 AB までの距離は、D から直線 AB までの距離の $t$ 倍です（$\overrightarrow{\mathrm{AP}}$ のうち AB に平行な成分は高さに関係しないため）。底辺 AB が共通なので $\triangle\mathrm{ABP} = t \cdot \triangle\mathrm{ABD}$、同様に底辺 AD が共通な $\triangle\mathrm{APD} = s \cdot \triangle\mathrm{ABD}$ です。対角線 BD は平行四辺形を 2 等分するので $\triangle\mathrm{ABD} = \frac{S}{2}$ です。よって (3) の答えは $\triangle\mathrm{ABP} = \frac{3}{11}S$、$\triangle\mathrm{APD} = \frac{9}{22}S$ です。`,
          easy: R`底辺が同じ三角形の面積は、高さに比例します。$\overrightarrow{\mathrm{AP}} = s\overrightarrow{\mathrm{AB}} + t\overrightarrow{\mathrm{AD}}$ は「AB に平行な方向に $s$、AD に平行な方向に $t$ だけ進んだ点」と読めるので、AB から P までの高さは AB から D までの高さの $t$ 倍、AD から P までの高さは AD から B までの高さの $s$ 倍になります。`,
          lv: 2
        },
        {
          t: '検算：成分で確かめる',
          m: [R`\mathrm{A}(0,\ 0),\ \mathrm{B}(1,\ 0),\ \mathrm{D}(0,\ 1)\ \text{とすると}\ S = 1,\ \mathrm{C}(1,\ 1),\ \mathrm{E}\left(1,\ \frac{2}{3}\right),\ \mathrm{F}\left(\frac{2}{3},\ 1\right)`, R`\mathrm{P}\left(\frac{9}{11},\ \frac{6}{11}\right):\quad \triangle\mathrm{ABP} = \frac{1}{2}\cdot 1\cdot\frac{6}{11} = \frac{3}{11},\qquad \triangle\mathrm{APD} = \frac{1}{2}\cdot 1\cdot\frac{9}{11} = \frac{9}{22}`],
          n: R`ベクトルの結果は、座標を置いて確かめられます。P の座標が直線 AE（$y = \frac{2}{3}x$）と直線 BF（$y = 3(1 - x)$）の両方の上にあること（$\frac{6}{11} = \frac{2}{3}\cdot\frac{9}{11},\ \frac{6}{11} = 3\cdot\frac{2}{11}$）も確認できます。`,
          lv: 3
        }
      ],
      prereq: ['m-geo'],
      tags: ['記述', '内分点', '位置ベクトル', '平行四辺形', '係数比較', '面積']
    },

    /* ================= 2025 年度 ================= */

    /* ---------- 2025 第1問[1] 整数 ---------- */
    {
      id: 'sk-m-2025-1a',
      subject: 'math',
      level: 'mid',
      unit: 'm-int',
      title: '倍数を除いた自然数の個数と和',
      source: src(2025, '第1問[1]'),
      time: 6,
      body: R`次の文中の空欄 $\boxed{ア}$・$\boxed{イ}$ に当てはまる数値を求めよ。

$1$ から $300$ までの自然数のうち、$4$ の倍数でも $6$ の倍数でもない数の個数は $\boxed{ア}$ で、それらをすべて足すと $\boxed{イ}$ になる。`,
      fig: null,
      parts: [
        { label: 'ア', q: R`個数`, type: 'num', answer: 200 },
        { label: 'イ', q: R`それらの総和`, type: 'num', answer: 30000 }
      ],
      solution: [
        {
          t: '4 でも 6 でも割り切れない = 4 の倍数でも 6 の倍数でもない',
          m: R`\text{全体}\ 300\ \text{個}\ -\ (4\ \text{の倍数または}\ 6\ \text{の倍数})`,
          n: R`「4 の倍数または 6 の倍数」の個数を数えて、全体から引く方針で進めます。`,
          easy: R`「$4$ でも $6$ でも割り切れない」とは、「$4$ の倍数でもなく、$6$ の倍数でもない」ということです。引き算で数えやすいように、除きたい数（$4$ の倍数と $6$ の倍数）の個数を先に求めて、全体の $300$ 個から引きます。`
        },
        {
          t: '倍数の個数を数える（包除原理）',
          m: [R`4\ \text{の倍数}: \frac{300}{4} = 75,\quad 6\ \text{の倍数}: \frac{300}{6} = 50,\quad 12\ \text{の倍数}: \frac{300}{12} = 25`, R`300 - (75 + 50 - 25) = 200`],
          n: R`4 と 6 の両方で割り切れる数は、最小公倍数 $12$ の倍数です。4 の倍数と 6 の倍数を足すと $12$ の倍数を 2 回数えてしまうので、1 回分引きます。よって ア = $200$ です。`,
          easy: R`4 の倍数 $(4,\ 8,\ 12,\ \cdots)$ と 6 の倍数 $(6,\ 12,\ 18,\ \cdots)$ には、$12,\ 24,\ \cdots$ のように両方に入る数があります。これを 2 回数えないために 1 回分引く（ベン図で考えるとわかりやすい）のが**包除原理**です。`
        },
        {
          t: '和は「全体の和 − 倍数の和」で求める',
          m: [R`\text{全体}: \frac{300\cdot 301}{2} = 45150`, R`4\ \text{の倍数の和}: 4\cdot\frac{75\cdot 76}{2} = 11400,\quad 6\ \text{の倍数の和}: 6\cdot\frac{50\cdot 51}{2} = 7650`, R`12\ \text{の倍数の和}: 12\cdot\frac{25\cdot 26}{2} = 3900`, R`45150 - (11400 + 7650 - 3900) = 45150 - 15150 = 30000`],
          n: R`$m$ の倍数の和は $m(1 + 2 + \cdots + k) = m\cdot\frac{k(k+1)}{2}$ です。個数のときと同じ包除原理で「$4$ の倍数の和 $+$ $6$ の倍数の和 $-$ $12$ の倍数の和」を全体の和から引くと、イ = $30000$ です。`,
          easy: R`$4$ の倍数 $4,\ 8,\ \cdots,\ 300$ の和は、$4 \times (1 + 2 + \cdots + 75)$ と書けるので、$1$ から $75$ までの和の公式 $\frac{75 \times 76}{2}$ を使えば求められます。個数のときと同じく、$12$ の倍数の和は 2 回足しているので 1 回分引きます。`,
          pro: R`上限 $300$ が割る数（$4$ と $6$）の公倍数なので、条件を満たす数は $k$ と $300 - k$ で対になります。このとき総和は「個数 $\times \frac{300}{2}$」と一瞬で出せます（下の検算）。上限が公倍数でないときは使えないので、倍数の和の引き算が基本です。`
        },
        {
          t: '検算：k と 300 − k のペアで考える',
          m: R`k\ \text{が条件を満たす} \iff 300 - k\ \text{も条件を満たす},\qquad \text{和} = \frac{200}{2}\times 300 = 30000`,
          n: R`$300$ は $4$ でも $6$ でも割り切れるので、$k$ が $4$ や $6$ で割り切れることと、$300 - k$ が割り切れることは同じです。条件を満たす 200 個は、和が $300$ になる 100 組のペア（$k = 150$ は $6$ の倍数なので $k = 300 - k$ となることはありません）に分けられ、総和は $100 \times 300 = 30000$ と一致します。`,
          lv: 2
        }
      ],
      prereq: ['m-prob'],
      tags: ['小問集合', '空所補充', '倍数', '包除原理', '等差数列の和']
    },

    /* ---------- 2025 第1問[2] 複素数の式の値 ---------- */
    {
      id: 'sk-m-2025-1b',
      subject: 'math',
      level: 'mid',
      unit: 'm-complex',
      title: '2次方程式の虚数解の累乗和',
      source: src(2025, '第1問[2]'),
      time: 6,
      body: R`次の文中の空欄 $\boxed{ウ}$・$\boxed{エ}$ に当てはまる実数を求めよ。

2 次方程式 $x^{2} - 4x + 7 = 0$ の 2 つの解を $\alpha,\ \beta$ とする。このとき $\alpha^{4} + \beta^{4} = \boxed{ウ}$、$\alpha^{6} + \beta^{6} = \boxed{エ}$ である。`,
      fig: null,
      parts: [
        { label: 'ウ', q: R`$\alpha^{4} + \beta^{4}$ の値`, type: 'num', answer: -94 },
        { label: 'エ', q: R`$\alpha^{6} + \beta^{6}$ の値`, type: 'num', answer: -286 }
      ],
      solution: [
        {
          t: '解と係数の関係',
          m: R`\alpha + \beta = 4,\qquad \alpha\beta = 7`,
          n: R`2 次方程式 $x^{2} + px + q = 0$ の 2 解の和は $-p$、積は $q$ です。ここでは $p = -4,\ q = 7$ です。解そのものは $2 \pm \sqrt{3}\,i$ という虚数ですが、求める値は和と積だけで計算できます。`,
          easy: R`**解と係数の関係**: 2 次方程式の 2 つの解 $\alpha,\ \beta$ について、和 $\alpha + \beta$ と積 $\alpha\beta$ は、方程式の係数から（解を求めなくても）わかります。$\alpha,\ \beta$ を入れかえても変わらない式（**対称式**）は、和と積だけで表せます。`
        },
        {
          t: 'まず α² + β² を求める',
          m: R`\alpha^{2} + \beta^{2} = (\alpha + \beta)^{2} - 2\alpha\beta = 16 - 14 = 2`,
          n: R`$(\alpha + \beta)^{2} = \alpha^{2} + 2\alpha\beta + \beta^{2}$ を変形した式です。`
        },
        {
          t: 'α⁴ + β⁴（ウ）',
          m: R`\alpha^{4} + \beta^{4} = (\alpha^{2} + \beta^{2})^{2} - 2(\alpha\beta)^{2} = 2^{2} - 2\cdot 49 = -94`,
          n: R`$\alpha^{2},\ \beta^{2}$ に同じ変形を使いました。よって ウ = $-94$ です。`,
          easy: R`「2 乗の和」を作る変形 $a^{2} + b^{2} = (a + b)^{2} - 2ab$ を、$a = \alpha^{2},\ b = \beta^{2}$ に使います。$ab = \alpha^{2}\beta^{2} = (\alpha\beta)^{2} = 49$ です。`
        },
        {
          t: 'α⁶ + β⁶（エ）',
          m: [R`a^{3} + b^{3} = (a + b)^{3} - 3ab(a + b)\ \text{に}\ a = \alpha^{2},\ b = \beta^{2}\ \text{を代入}`, R`\alpha^{6} + \beta^{6} = 2^{3} - 3\cdot 49\cdot 2 = 8 - 294 = -286`],
          n: R`よって エ = $-286$ です。別解として、$\alpha^{3} + \beta^{3} = 4^{3} - 3\cdot 7\cdot 4 = -20$ を先に求めて、$\alpha^{6} + \beta^{6} = (\alpha^{3} + \beta^{3})^{2} - 2(\alpha\beta)^{3} = 400 - 686 = -286$ としても同じです。`,
          pro: R`$\alpha^{n} + \beta^{n}$ は、$p_{n} = (\alpha + \beta)p_{n-1} - \alpha\beta\,p_{n-2}$（ここでは $p_{n} = 4p_{n-1} - 7p_{n-2}$）という漸化式で順に求めることもできます。$p_{0} = 2,\ p_{1} = 4,\ p_{2} = 2,\ p_{3} = -20,\ p_{4} = -94,\ p_{5} = -236,\ p_{6} = -286$ です。`
        },
        {
          t: '検算：解を実際に求めて計算する',
          m: [R`x^{2} - 4x + 7 = 0 \;\Rightarrow\; x = 2 \pm \sqrt{3}\,i`, R`(2 + \sqrt{3}\,i)^{2} = 1 + 4\sqrt{3}\,i,\quad (2 + \sqrt{3}\,i)^{4} = -47 + 8\sqrt{3}\,i,\quad (2 + \sqrt{3}\,i)^{6} = -143 - 180\sqrt{3}\,i`, R`\alpha^{4} + \beta^{4} = 2\cdot(-47) = -94,\qquad \alpha^{6} + \beta^{6} = 2\cdot(-143) = -286`],
          n: R`$\alpha,\ \beta$ は互いに共役な複素数なので、和は実部の 2 倍になり、虚部は打ち消し合います。`,
          lv: 3
        }
      ],
      prereq: ['m-expr'],
      tags: ['小問集合', '空所補充', '解と係数の関係', '対称式', '複素数']
    },

    /* ---------- 2025 第1問[3] 極形式 ---------- */
    {
      id: 'sk-m-2025-1c',
      subject: 'math',
      level: 'mid',
      unit: 'm-cplane',
      title: '複素数の商の絶対値と偏角',
      source: src(2025, '第1問[3]'),
      time: 5,
      body: R`次の文中の空欄 $\boxed{オ}$・$\boxed{カ}$ に当てはまる数値を求めよ。ただし $i$ は虚数単位とし、偏角は $0$ 以上 $2\pi$ 未満で答えること。

複素数 $\alpha = 3 - \sqrt{3}\,i$ を複素数 $\beta = -1 + \sqrt{3}\,i$ で割った商 $\dfrac{\alpha}{\beta}$ の絶対値は $\boxed{オ}$ であり、偏角は $\boxed{カ}$ である。`,
      fig: null,
      parts: [
        { label: 'オ', q: R`$\left|\dfrac{\alpha}{\beta}\right|$ の値`, type: 'num', answer: S3, show: R`\sqrt{3}` },
        { label: 'カ', q: R`偏角 $\theta$（$0 \le \theta < 2\pi$）`, type: 'num', answer: 7 * PI / 6, show: R`\frac{7}{6}\pi`, hint: 'π を使って入力（例: 5π/6）' }
      ],
      solution: [
        {
          t: 'α を極形式で表す',
          m: [R`\left|\alpha\right| = \sqrt{3^{2} + (-\sqrt{3})^{2}} = 2\sqrt{3}`, R`\alpha = 2\sqrt{3}\left(\frac{\sqrt{3}}{2} - \frac{1}{2}i\right) = 2\sqrt{3}\left\{\cos\left(-\frac{\pi}{6}\right) + i\sin\left(-\frac{\pi}{6}\right)\right\}`],
          easy: R`**極形式**は、複素数を「原点からの距離（絶対値）$r$」と「実軸の正の向きから測った角（偏角）$\theta$」で $r(\cos\theta + i\sin\theta)$ と表す方法です。$\alpha$ は点 $(3,\ -\sqrt{3})$ なので、距離 $2\sqrt{3}$、角は時計回りに $30\degree$ です。`
        },
        {
          t: 'β を極形式で表す',
          m: [R`\left|\beta\right| = \sqrt{(-1)^{2} + (\sqrt{3})^{2}} = 2`, R`\beta = 2\left(-\frac{1}{2} + \frac{\sqrt{3}}{2}i\right) = 2\left(\cos\frac{2}{3}\pi + i\sin\frac{2}{3}\pi\right)`]
        },
        {
          t: '商は「絶対値は割り、偏角は引く」',
          m: [R`\left|\frac{\alpha}{\beta}\right| = \frac{2\sqrt{3}}{2} = \sqrt{3}`, R`\arg\frac{\alpha}{\beta} = -\frac{\pi}{6} - \frac{2}{3}\pi = -\frac{5}{6}\pi \;\Rightarrow\; -\frac{5}{6}\pi + 2\pi = \frac{7}{6}\pi`],
          n: R`$-\frac{5}{6}\pi$ は $0 \le \theta < 2\pi$ の範囲に入っていないので、$2\pi$ を足して範囲に戻します。よって オ = $\sqrt{3}$、カ = $\frac{7}{6}\pi$ です。`,
          easy: R`極形式どうしを割ると、「長さは割り算、角は引き算」になります。複素数の割り算は「縮小しながら逆向きに回転する」操作だとイメージできます。偏角が負になったときは、$360\degree$（$2\pi$）を足して $0 \le \theta < 2\pi$ に直します。`,
          pro: R`偏角の範囲指定（$0 \le \theta < 2\pi$）に注意。引き算の結果が負になったら、最後に $2\pi$ を足して範囲に戻す必要がないか必ず確認します。`,
          fig: G({
            w: 340, h: 230, x: [-3.2, 4], y: [-2.6, 2.4], equal: true, axis: ['実軸', '虚軸'],
            segs: [
              { x1: 0, y1: 0, x2: 3, y2: -S3, cls: 'c1', arrow: true, label: 'α' },
              { x1: 0, y1: 0, x2: -1, y2: S3, cls: 'c2', arrow: true, label: 'β' },
              { x1: 0, y1: 0, x2: -1.5, y2: -S3 / 2, cls: 'c3', arrow: true, label: 'α/β' }
            ]
          })
        },
        {
          t: '直接計算で検算',
          m: [R`\frac{\alpha}{\beta} = \frac{(3 - \sqrt{3}\,i)(-1 - \sqrt{3}\,i)}{(-1 + \sqrt{3}\,i)(-1 - \sqrt{3}\,i)} = \frac{-6 - 2\sqrt{3}\,i}{4} = -\frac{3}{2} - \frac{\sqrt{3}}{2}i`, R`\left|\frac{\alpha}{\beta}\right|^{2} = \frac{9}{4} + \frac{3}{4} = 3`],
          n: R`実部・虚部ともに負なので第 3 象限の点で、偏角が $\pi$ と $\frac{3}{2}\pi$ の間にあることとも合っています。$\tan\theta = \frac{\sqrt{3}/2}{3/2} = \frac{1}{\sqrt{3}}$ から、$\pi$ より $\frac{\pi}{6}$ 進んだ $\frac{7}{6}\pi$ です。`,
          lv: 2
        }
      ],
      tags: ['小問集合', '空所補充', '極形式', '偏角']
    },

    /* ---------- 2025 第2問 対数を含む関数の微積分 ---------- */
    {
      id: 'sk-m-2025-2',
      subject: 'math',
      level: 'mid',
      unit: 'm-integ3',
      title: '対数を含む関数の極値と面積',
      source: src(2025, '第2問'),
      time: 22,
      body: R`$x > 0$ で定義された 2 つの関数
$$f(x) = x\log x,\qquad g(x) = (\log x)^{2}$$
について、次の問いに答えよ。ただし $\log$ は自然対数を表し、$e$ は自然対数の底である。

(1) $f(x)$ が極値をとる $x$ の値と、そのときの $f(x)$ の値を求めよ。
(2) $\displaystyle\int f(x)\,dx$ を計算せよ（積分定数は省略してよい）。
(3) $\displaystyle\int g(x)\,dx$ を計算せよ（積分定数は省略してよい）。
(4) 2 曲線 $y = f(x)$、$y = g(x)$ と直線 $x = e$ に囲まれた図形の面積 $S$ を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)ア', q: R`$f(x)$ は $x = \boxed{ア}$ で極小値をとる（極大値はない）。ア の値`, type: 'num', answer: 1 / E, show: R`\frac{1}{e}`, hint: '自然対数の底を含む値は 2/e や e^2 のように入力' },
        { label: '(1)イ', q: R`その極小値`, type: 'num', answer: -1 / E, show: R`-\frac{1}{e}` },
        { label: '(2)', q: R`$\displaystyle\int f(x)\,dx$ の、積分定数 $C$ を除いた部分（$x$ の式）`, type: 'expr', answer: 'x^2/2*log(x)-x^2/4', vars: ['x'], show: R`\frac{x^{2}}{2}\log x - \frac{x^{2}}{4}`, hint: 'log x は log(x) と入力（例: x log(x) - x）' },
        { label: '(3)', q: R`$\displaystyle\int g(x)\,dx$ の、積分定数 $C$ を除いた部分（$x$ の式）`, type: 'expr', answer: 'x*(log(x))^2-2*x*log(x)+2*x', vars: ['x'], show: R`x(\log x)^{2} - 2x\log x + 2x`, hint: '(log x)^2 は (log(x))^2 と入力' },
        {
          label: '(4)', q: R`面積 $S$`, type: 'num',
          answer: E * E / 4 - E + 9 / 4,
          show: R`\frac{e^{2}}{4} - e + \frac{9}{4}`,
          hint: '式のまま入力するか、小数第 3 位まで（例: 1.234）'
        }
      ],
      solution: [
        {
          t: '(1) 導関数の符号を調べて極値を求める',
          m: [R`f'(x) = \log x + x\cdot\frac{1}{x} = \log x + 1`, R`f'(x) = 0 \iff x = \frac{1}{e},\qquad f\left(\frac{1}{e}\right) = \frac{1}{e}\cdot(-1) = -\frac{1}{e}`],
          n: R`$0 < x < \frac{1}{e}$ では $f'(x) < 0$（減少）、$x > \frac{1}{e}$ では $f'(x) > 0$（増加）です。減少から増加に変わるので、$x = \frac{1}{e}$ で極小値 $-\frac{1}{e}$ をとり、極大値はありません。`,
          easy: R`積の微分 $(uv)' = u'v + uv'$ と $(\log x)' = \frac{1}{x}$ を使います。$x \cdot \frac{1}{x} = 1$ となって、導関数が $\log x + 1$ とすっきりします。$\log x + 1 = 0$ は $\log x = -1$、つまり $x = e^{-1} = \frac{1}{e}$ のときです。`
        },
        {
          t: '(2) 部分積分',
          m: R`\int x\log x\,dx = \frac{x^{2}}{2}\log x - \int \frac{x^{2}}{2}\cdot\frac{1}{x}\,dx = \frac{x^{2}}{2}\log x - \frac{x^{2}}{4} + C`,
          n: R`$x$ の方を積分して $\frac{x^{2}}{2}$、$\log x$ の方を微分して $\frac{1}{x}$ にする部分積分です。積分の中の $\frac{x^{2}}{2} \cdot \frac{1}{x} = \frac{x}{2}$ はそのまま積分できます。`,
          easy: R`**部分積分**は積の微分 $(uv)' = u'v + uv'$ を逆に使う方法で、$\int u'v\,dx = uv - \int uv'\,dx$ です。$\log x$ は微分すると $\frac{1}{x}$ とやさしくなるので「微分する側」に選び、$x$ を「積分する側」にします。`
        },
        {
          t: '(3) 部分積分を 2 回行う',
          m: [R`\int (\log x)^{2}\,dx = x(\log x)^{2} - \int x\cdot 2\log x\cdot\frac{1}{x}\,dx = x(\log x)^{2} - 2\int \log x\,dx`, R`\int \log x\,dx = x\log x - \int x\cdot\frac{1}{x}\,dx = x\log x - x`, R`\therefore\quad \int g(x)\,dx = x(\log x)^{2} - 2x\log x + 2x + C`],
          n: R`$(\log x)^{2} = 1 \cdot (\log x)^{2}$ とみて、$1$ を積分して $x$、$(\log x)^{2}$ を微分して $\frac{2\log x}{x}$ にします。$\log x$ の 2 乗が 1 乗に下がるので、もう一度部分積分すれば終わりです。`,
          easy: R`$(\log x)^{2}$ は、そのままでは積分の公式が使えません。そこで「$1$ を掛けてある」と考えて部分積分します。1 回目で $(\log x)^{2}$ が $\log x$ に、2 回目で $\log x$ が定数になって、積分できる形になります。「回数を決めて繰り返す」のがコツです。`
        },
        {
          t: '検算：微分して g(x) に戻るか',
          m: [R`\left\{x(\log x)^{2} - 2x\log x + 2x\right\}' = (\log x)^{2} + 2\log x - 2\log x - 2 + 2 = (\log x)^{2}`],
          n: R`$\left\{x(\log x)^{2}\right\}' = (\log x)^{2} + 2\log x$、$\left\{2x\log x\right\}' = 2\log x + 2$ を使いました。確かに $g(x)$ に戻ります。`,
          lv: 3
        },
        {
          t: '(4) 交点と上下関係',
          m: [R`f(x) - g(x) = x\log x - (\log x)^{2} = \log x\,(x - \log x)`, R`x - \log x > 0\ \ (x > 0)\ \text{より}\quad f(x) = g(x) \iff \log x = 0 \iff x = 1`],
          n: R`$\log x \le x - 1 < x$ なので $x - \log x$ は常に正です。したがって 2 曲線の共有点は $x = 1$（点 $(1,\ 0)$）だけで、$1 < x \le e$ では $\log x > 0$ より $f(x) > g(x)$ です。囲まれた部分は $x = 1$ から $x = e$ までです。`,
          easy: R`2 つの関数の差を $\log x\,(x - \log x)$ と因数分解すると、符号が簡単にわかります。$x - \log x$ は（グラフを描くと）常に正なので、差の符号は $\log x$ だけで決まります。$x > 1$ なら $\log x > 0$ で $f(x)$ が上、という具合です。`,
          fig: G({
            w: 340, h: 250, x: [0, 3.3], y: [-0.8, 3.0],
            curves: [
              { f: (x) => x * Math.log(x), cls: 'c1', domain: [0.05, 3.2] },
              { f: (x) => Math.pow(Math.log(x), 2), cls: 'c2', domain: [0.2, 3.2] }
            ],
            fills: [{ f: (x) => x * Math.log(x), g: (x) => Math.pow(Math.log(x), 2), from: 1, to: E, cls: 'f1' }],
            vlines: [{ x: E, label: 'x = e' }],
            points: [
              { x: 1 / E, y: -1 / E, label: '極小', pos: 'br', cls: 'c3' },
              { x: 1, y: 0, label: '(1, 0)', pos: 'tl', cls: 'c4' }
            ],
            labels: [{ x: 2.2, y: 2.45, text: 'y = f(x)', cls: 'c1' }, { x: 0.45, y: 2.1, text: 'y = g(x)', cls: 'c2' }]
          })
        },
        {
          t: '面積の式と値',
          m: [R`S = \int_{1}^{e} \{f(x) - g(x)\}\,dx = \left[\frac{x^{2}}{2}\log x - \frac{x^{2}}{4} - x(\log x)^{2} + 2x\log x - 2x\right]_{1}^{e}`, R`x = e:\ \frac{e^{2}}{2} - \frac{e^{2}}{4} - e + 2e - 2e = \frac{e^{2}}{4} - e,\qquad x = 1:\ -\frac{1}{4} - 2 = -\frac{9}{4}`, R`S = \left(\frac{e^{2}}{4} - e\right) - \left(-\frac{9}{4}\right) = \frac{e^{2}}{4} - e + \frac{9}{4}`],
          n: R`(2) と (3) の結果を組み合わせた原始関数に $x = e$ と $x = 1$ を代入します。$\log e = 1,\ \log 1 = 0$ を使います。数値にすると $S \fallingdotseq 1.38$ です。`,
          pro: R`$x^{n}(\log x)^{m}$ の積分は、「$\log x$ の次数が 1 つずつ下がる」部分積分の繰り返しで、$m$ 回で終わります。$\log$ が入る問題では代入値が $1$ と $e$ のとき $\log 1 = 0,\ \log e = 1$ で項がほとんど消えるので、あらかじめ原始関数を整理しておくと計算が楽です。`
        }
      ],
      prereq: ['m-diff3', 'm-explog'],
      tags: ['記述', '極値', '部分積分', '2曲線間の面積', '数III']
    },

    /* ---------- 2025 第3問 ベクトルと領域 ---------- */
    {
      id: 'sk-m-2025-3',
      subject: 'math',
      level: 'mid',
      unit: 'm-vec',
      title: '係数の条件が表す領域の面積',
      source: src(2025, '第3問'),
      time: 18,
      body: R`$\triangle\mathrm{OAB}$ は $\mathrm{OA} = 4,\ \mathrm{OB} = 3,\ \angle\mathrm{AOB} = 60\degree$ を満たしている。$\vec{a} = \overrightarrow{\mathrm{OA}},\ \vec{b} = \overrightarrow{\mathrm{OB}}$ とおく。実数 $s,\ t$ が
$$s \ge 0,\qquad t \ge 0,\qquad 1 \le 2s + t \le 2$$
を満たしながら動くとき、点 P を $\overrightarrow{\mathrm{OP}} = s\vec{a} + t\vec{b}$ で定め、P の動く範囲を $D$ とする。次の問いに答えよ。

(1) 内積 $\vec{a}\cdot\vec{b}$ の値を求めよ。
(2) $2s + t = 1$ を満たす P が描く線分の長さと、$2s + t = 2$ を満たす P が描く線分の長さをそれぞれ求めよ。
(3) $D$ の面積は $\triangle\mathrm{OAB}$ の面積の何倍か。
(4) $D$ の面積を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`$\vec{a}\cdot\vec{b}$ の値`, type: 'num', answer: 6 },
        { label: '(2)長さ 1', q: R`$2s + t = 1$ のときの線分の長さ`, type: 'num', answer: S7, show: R`\sqrt{7}`, hint: '根号は 3√2 または 3*sqrt(2) のように入力' },
        { label: '(2)長さ 2', q: R`$2s + t = 2$ のときの線分の長さ`, type: 'num', answer: 2 * S7, show: R`2\sqrt{7}` },
        { label: '(3)', q: R`$D$ の面積は $\triangle\mathrm{OAB}$ の面積の何倍か`, type: 'num', answer: 3 / 2, show: R`\frac{3}{2}` },
        { label: '(4)', q: R`$D$ の面積`, type: 'num', answer: 9 * S3 / 2, show: R`\frac{9\sqrt{3}}{2}` }
      ],
      solution: [
        {
          t: '(1) 内積',
          m: R`\vec{a}\cdot\vec{b} = \left|\vec{a}\right|\left|\vec{b}\right|\cos 60\degree = 4\cdot 3\cdot\frac{1}{2} = 6`,
          n: R`内積の定義 $\vec{a}\cdot\vec{b} = \left|\vec{a}\right|\left|\vec{b}\right|\cos\theta$ に $\theta = 60\degree$ を代入しました。`
        },
        {
          t: '係数の条件を「和が一定」の形に直す',
          m: [R`2s + t = k\ (1 \le k \le 2),\qquad \overrightarrow{\mathrm{OP}} = (2s)\cdot\frac{\vec{a}}{2} + t\vec{b}`, R`\text{OA の中点を M とすると}\quad \overrightarrow{\mathrm{OP}} = (2s)\,\overrightarrow{\mathrm{OM}} + t\,\overrightarrow{\mathrm{OB}},\qquad 2s + t = k`],
          n: R`$s \ge 0,\ t \ge 0$ なので、$2s$ と $t$ はどちらも 0 以上です。係数の和が $1$ のときは、P は M と B を結ぶ線分上にあります。和が $k$ のときは、その線分を原点を中心に $k$ 倍に拡大した線分上にあります。`,
          easy: R`たとえば $\overrightarrow{\mathrm{OP}} = u\overrightarrow{\mathrm{OX}} + v\overrightarrow{\mathrm{OY}}$（$u + v = 1,\ u \ge 0,\ v \ge 0$）は、線分 XY 上の点です（$u,\ v$ を「X と Y におくおもりの重さ」と考えると、つり合いの位置が XY 上になります）。係数の和が $k$ のときは、その点を原点から見て $k$ 倍の位置に動かしたものになります。`
        },
        {
          t: '(2) 2s + t = 1 のとき',
          m: [R`\text{P は M と B を結ぶ線分 MB 上}\ \ (\text{M は OA の中点})`, R`\overrightarrow{\mathrm{MB}} = \vec{b} - \frac{1}{2}\vec{a},\qquad \left|\overrightarrow{\mathrm{MB}}\right|^{2} = \left|\vec{b}\right|^{2} - \vec{a}\cdot\vec{b} + \frac{1}{4}\left|\vec{a}\right|^{2} = 9 - 6 + 4 = 7`],
          n: R`$s = \frac{1}{2},\ t = 0$ のとき P = M、$s = 0,\ t = 1$ のとき P = B です。線分 MB の長さは $\sqrt{7}$ です。`
        },
        {
          t: '(2) 2s + t = 2 のとき',
          m: [R`\overrightarrow{\mathrm{OP}} = s\vec{a} + \frac{t}{2}\cdot 2\vec{b},\qquad s + \frac{t}{2} = 1`, R`\text{P は A と}\ \mathrm{C}\ (\overrightarrow{\mathrm{OC}} = 2\vec{b})\ \text{を結ぶ線分 AC 上}`, R`\left|\overrightarrow{\mathrm{AC}}\right|^{2} = \left|2\vec{b} - \vec{a}\right|^{2} = 4\cdot 9 - 4\cdot 6 + 16 = 28`],
          n: R`$s = 1,\ t = 0$ のとき P = A、$s = 0,\ t = 2$ のとき P = C です。線分 AC の長さは $2\sqrt{7}$（MB の 2 倍）です。MB と AC が平行で、AC が MB の 2 倍の長さになっているのは、$2s + t = 2$ の線分が $2s + t = 1$ の線分の原点を中心とする 2 倍の拡大になっているからです。`,
          fig: (function () {
            const d = JK.plot.draw(340, 305);
            const X = (x) => 38 + 52 * x, Y = (y) => 268 - 52 * y;
            const Ap = [4, 0], Bp = [1.5, 1.5 * S3], Mp = [2, 0], Cp = [3, 3 * S3];
            const px = (p) => [X(p[0]), Y(p[1])];
            const o = px([0, 0]), a = px(Ap), b = px(Bp), m = px(Mp), c = px(Cp);
            d.poly([m, a, c, b], { cls: 'c1', fill: 'f1' });
            d.line(o[0], o[1], a[0], a[1], { cls: 'fg', w: 1.6 });
            d.line(o[0], o[1], c[0], c[1], { cls: 'fg', w: 1.6 });
            d.line(m[0], m[1], b[0], b[1], { cls: 'c3', w: 2 });
            d.line(a[0], a[1], c[0], c[1], { cls: 'c2', w: 2 });
            [o, a, b, m, c].forEach((p) => d.dot(p[0], p[1], { cls: 'fg' }));
            d.text(o[0] - 10, o[1] + 14, 'O');
            d.text(a[0] + 10, a[1] + 14, 'A');
            d.text(b[0] - 12, b[1] + 3, 'B');
            d.text(m[0], m[1] + 16, 'M');
            d.text(c[0] + 2, c[1] - 9, 'C');
            d.text(176, 172, 'D', { cls: 'c1', size: 15, bold: true });
            d.text(m[0] - 88, m[1] + 32, '2s + t = 1', { cls: 'c3', size: 11, anchor: 'start' });
            d.text((a[0] + c[0]) / 2 + 12, (a[1] + c[1]) / 2, '2s + t = 2', { cls: 'c2', size: 11, anchor: 'start' });
            return d.svg();
          })()
        },
        {
          t: '(3) D は台形で、面積は三角形の面積比で求まる',
          m: [R`D = \triangle\mathrm{OAC}\ \text{から}\ \triangle\mathrm{OMB}\ \text{を除いた部分}`, R`\triangle\mathrm{OAC} = \frac{\mathrm{OC}}{\mathrm{OB}}\triangle\mathrm{OAB} = 2\triangle\mathrm{OAB},\qquad \triangle\mathrm{OMB} = \frac{\mathrm{OM}}{\mathrm{OA}}\triangle\mathrm{OAB} = \frac{1}{2}\triangle\mathrm{OAB}`, R`D = \left(2 - \frac{1}{2}\right)\triangle\mathrm{OAB} = \frac{3}{2}\triangle\mathrm{OAB}`],
          n: R`$2s + t$ が $1$ から $2$ まで変わる間に、線分は MB から AC まで平行に動いていきます。$D$ は線分 MB と AC にはさまれた台形 MACB です。同じ角をはさむ三角形の面積比は、その角をはさむ 2 辺の長さの比の積になります。よって (3) の答えは $\frac{3}{2}$ 倍です。`,
          easy: R`角 O を共通にもつ三角形 OAC と OAB は、底辺を OA とみると高さが $2$ 倍（C は B の $2$ 倍遠い）なので、面積も $2$ 倍です。同じように $\triangle\mathrm{OMB}$ は底辺 OM が OA の半分なので面積も半分です。大きい三角形から小さい三角形を引くと、台形の面積が出ます。`
        },
        {
          t: '(4) 面積を計算する',
          m: [R`\triangle\mathrm{OAB} = \frac{1}{2}\cdot 4\cdot 3\cdot\sin 60\degree = 3\sqrt{3}`, R`D = \frac{3}{2}\cdot 3\sqrt{3} = \frac{9\sqrt{3}}{2}`],
          n: R`三角形の面積の公式 $\frac{1}{2}bc\sin A$ を使いました。よって $D$ の面積は $\frac{9\sqrt{3}}{2}\ (\fallingdotseq 7.79)$ です。`,
          pro: R`「$\overrightarrow{\mathrm{OP}} = s\vec{a} + t\vec{b}$ で、$s,\ t$ の 1 次不等式が条件」という問題は、$(s,\ t)$ 平面での領域の面積に「$\vec{a},\ \vec{b}$ がつくる平行四辺形の面積 $\left|\vec{a}\right|\left|\vec{b}\right|\sin\theta$」を掛けて求めることもできます。ここでは $(s,\ t)$ 平面の領域の面積は $\frac{3}{4}$、平行四辺形の面積は $6\sqrt{3}$ で、$\frac{3}{4} \times 6\sqrt{3} = \frac{9\sqrt{3}}{2}$ と一致します。`
        }
      ],
      prereq: ['m-trig1', 'm-coord'],
      tags: ['記述', 'ベクトルと領域', '内分と外分', '内積', '三角形の面積']
    },

    /* ---------- 2025 第4問 指数曲線の下の図形と回転体・極限 ---------- */
    {
      id: 'sk-m-2025-4',
      subject: 'math',
      level: 'mid',
      unit: 'm-integ3',
      title: '曲線下の図形の二等分と回転体・極限',
      source: src(2025, '第4問'),
      time: 22,
      body: R`$0 < t \le 1$ とする。座標平面上で、不等式
$$0 \le x \le t,\qquad 0 \le y \le e^{x}$$
が表す図形を $D$ とする。点 $\mathrm{B}(0,\ 1)$ を通る直線 ℓ が $D$ の面積を 2 等分し、ℓ が直線 $x = t$ と交わる点を P とする。また、点 $\mathrm{Q}(t,\ 0)$、原点を O とする。次の問いに答えよ。

(1) P の $y$ 座標 $p$ を $t$ の式で表せ。
(2) 四角形 OQPB を $x$ 軸のまわりに回転してできる立体の体積を $V$ とする。$V$ を $t$ の式で表せ。
(3) $D$ を $x$ 軸のまわりに回転してできる立体の体積を $W$ とする。$W$ を $t$ の式で表せ。
(4) $t$ を限りなく $0$ に近づけるときの $\dfrac{V}{W}$ の極限値を求めよ。`,
      fig: null,
      parts: [
        { label: '(1)', q: R`P の $y$ 座標 $p$（$t$ の式）`, type: 'expr', answer: '(e^t-1)/t-1', vars: ['t'], show: R`\frac{e^{t} - 1}{t} - 1`, hint: 'e^t は e^t と入力（例: (e^t+2)/t）' },
        { label: '(2)', q: R`$V$（$t$ の式）`, type: 'expr', answer: 'pi*t/3*(((e^t-1)/t)^2-(e^t-1)/t+1)', vars: ['t'], show: R`\frac{\pi}{3}\left\{\frac{(e^{t} - 1)^{2}}{t} - (e^{t} - 1) + t\right\}`, hint: 'π は π または pi と入力' },
        { label: '(3)', q: R`$W$（$t$ の式）`, type: 'expr', answer: 'pi*(e^(2*t)-1)/2', vars: ['t'], show: R`\frac{\pi}{2}\left(e^{2t} - 1\right)` },
        { label: '(4)', q: R`極限値`, type: 'num', answer: 1 / 3, show: R`\frac{1}{3}` }
      ],
      solution: [
        {
          t: 'D の面積と、ℓ の下側の図形',
          m: R`(D\ \text{の面積}) = \int_{0}^{t} e^{x}\,dx = e^{t} - 1`,
          n: R`$D$ は、$x$ 軸・$y$ 軸・直線 $x = t$・曲線 $y = e^{x}$ で囲まれた図形です。ℓ は B から右へ進んで $x = t$ 上の点 P に着きます。ℓ の下側にできる四角形 OQPB は、平行な 2 辺 OB（長さ $1$）と QP（長さ $p$）をもつ台形です。`,
          easy: R`曲線 $y = e^{x}$ は $x = 0$ のとき $y = 1$ で、右へ行くほど上がっていきます。$D$ はその曲線の下側の帯のような図形です。B $(0,\ 1)$ から斜めに引いた直線 ℓ が、この帯を面積の等しい上下 2 つの部分に分けます。`
        },
        {
          t: '(1) 台形の面積が D の半分',
          m: [R`\text{四角形 OQPB の面積} = \frac{(1 + p)\,t}{2} = \frac{1}{2}\left(e^{t} - 1\right)`, R`p = \frac{e^{t} - 1}{t} - 1`],
          n: R`台形の面積は「（上底 + 下底）× 高さ ÷ 2」で、上底 $1$、下底 $p$、高さ $t$ です。$0 < t \le 1$ のとき $0 < p < 1$ なので、ℓ は右下がりの直線で、$x \ge 0$ では曲線 $y = e^{x}$ の下側を通ります（よって ℓ が $D$ を 2 つに分けます）。`,
          easy: R`台形の面積の公式 $\frac{(\text{上底} + \text{下底}) \times \text{高さ}}{2}$ に、上底 $1$、下底 $p$（P の高さ）、高さ $t$（横の長さ）を入れます。これが $D$ の面積 $e^{t} - 1$ のちょうど半分になる、という式を $p$ について解きます。`,
          fig: G({
            w: 340, h: 250, x: [-0.25, 1.4], y: [-0.25, 3.0],
            curves: [{ f: (x) => Math.exp(x), cls: 'c1', domain: [0, 1] }],
            fills: [
              { f: (x) => Math.exp(x), g: (x) => 1 + (E - 3) * x, from: 0, to: 1, cls: 'f1' },
              { f: (x) => 1 + (E - 3) * x, from: 0, to: 1, cls: 'f3' }
            ],
            segs: [{ x1: 0, y1: 1, x2: 1, y2: E - 2, cls: 'c2' }],
            vlines: [{ x: 1, label: 'x = t（t = 1 の例）' }],
            points: [
              { x: 0, y: 1, label: 'B', pos: 'tl', cls: 'c2' },
              { x: 1, y: E - 2, label: 'P', pos: 'br', cls: 'c2' }
            ],
            labels: [{ x: 0.12, y: 2.5, text: 'y = e^x', cls: 'c1' }]
          })
        },
        {
          t: '(2) 四角形 OQPB の回転体は円すい台',
          m: [R`V = \pi\int_{0}^{t}\left(1 - \frac{1 - p}{t}x\right)^{2}dx = \frac{\pi t}{3}\left(1 + p + p^{2}\right)`, R`q = \frac{e^{t} - 1}{t}\ \text{とおくと}\ p = q - 1,\quad 1 + p + p^{2} = q^{2} - q + 1`, R`V = \frac{\pi t}{3}\left(q^{2} - q + 1\right) = \frac{\pi}{3}\left\{\frac{(e^{t} - 1)^{2}}{t} - (e^{t} - 1) + t\right\}`],
          n: R`直線 ℓ の式は $y = 1 - \frac{1 - p}{t}x$ です。$x$ 軸に垂直な平面で切ると、切り口は半径 $1 - \frac{1 - p}{t}x$ の円です。積分は $u = 1 - \frac{1 - p}{t}x$ と置換すると $\frac{t}{1 - p}\int_{p}^{1}u^{2}du = \frac{t(1 - p^{3})}{3(1 - p)}$ となり、$\frac{t}{3}(1 + p + p^{2})$ が出ます。最後に $t q = e^{t} - 1$ を使って整理しました。`,
          easy: R`直線 ℓ（B から P までの線分）を $x$ 軸のまわりに回すと、左端の半径が $1$、右端の半径が $p$、高さ（長さ）が $t$ の「円すい台」（円すいの上を水平に切り落とした形）ができます。円すい台の体積は $\frac{\pi t}{3}(r_{1}^{2} + r_{1}r_{2} + r_{2}^{2})$ で、$r_{1} = 1,\ r_{2} = p$ を入れると上の式になります。`,
          lv: 2
        },
        {
          t: '(3) D の回転体',
          m: R`W = \pi\int_{0}^{t}\left(e^{x}\right)^{2}dx = \pi\int_{0}^{t}e^{2x}\,dx = \pi\left[\frac{1}{2}e^{2x}\right]_{0}^{t} = \frac{\pi}{2}\left(e^{2t} - 1\right)`,
          n: R`切り口は半径 $e^{x}$ の円（面積 $\pi e^{2x}$）です。$e^{2x}$ の積分は $\frac{1}{2}e^{2x}$ です。`
        },
        {
          t: '(4) V ÷ W を、極限の取れる形に直す',
          m: [R`\frac{V}{W} = \frac{\frac{\pi t}{3}(1 + p + p^{2})}{\frac{\pi}{2}(e^{2t} - 1)} = \frac{2}{3}\cdot\frac{t}{e^{2t} - 1}\cdot(1 + p + p^{2})`, R`t \to +0:\quad p = \frac{e^{t} - 1}{t} - 1 \to 0,\qquad \frac{e^{2t} - 1}{t} = 2\cdot\frac{e^{2t} - 1}{2t} \to 2`, R`\lim_{t \to +0}\frac{V}{W} = \frac{2}{3}\cdot\frac{1}{2}\cdot 1 = \frac{1}{3}`],
          n: R`極限の公式 $\displaystyle\lim_{h \to 0}\frac{e^{h} - 1}{h} = 1$ を、$h = t$ と $h = 2t$ の 2 回使いました。$V$ も $W$ も $0$ に近づくので、そのまま比をとるのではなく、「$0$ に近づくもの同士」を $\frac{e^{h} - 1}{h}$ の形にそろえるのがコツです。`,
          easy: R`$t$ が $0$ に近づくと、$D$ はごく細い帯になり、$V$ も $W$ も $0$ に近づきます。「$0$ に近づくもの同士の比」は、$\frac{e^{h} - 1}{h} \to 1$（$h$ が小さいとき $e^{h} \fallingdotseq 1 + h$）が使える形に変形して求めます。`,
          pro: R`目で見ても納得できる答えです。細い帯では、円すい台は（半径 $1$ の）円すいに、$W$ は円柱に近づき、円すいと円柱の体積比は $\frac{1}{3}$ です。数値で確かめると、$t = 0.1$ で $\frac{V}{W} \fallingdotseq 0.317$、$t = 0.01$ で $\fallingdotseq 0.332$ と $\frac{1}{3}$ に近づきます。`
        }
      ],
      prereq: ['m-limit', 'm-explog'],
      tags: ['記述', '指数関数', '面積の二等分', '回転体', '極限', '数III']
    }
  ]);
})();
