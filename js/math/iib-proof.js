/* 数II・B — 式と証明: 二項定理 / 整式の割り算 / 相加平均・相乗平均 / 恒等式の係数決定
   構成は ia-quad.js に準拠（intro → result → steps(easy / pro / lv) → fig）。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;

  /* ---------- 共通ヘルパ ---------- */

  // 底 q の k 乗（負数・分数は括弧で包む）
  function pw(q, k) {
    const base = (q.isInt() && q.sign() >= 0) ? q.tex() : R`\left(` + q.tex() + R`\right)`;
    return base + '^{' + k + '}';
  }
  // 括弧で包む（分数・根号を含むときは大きい括弧）
  function par(t) { return /\\frac|\\sqrt/.test(t) ? R`\left(` + t + R`\right)` : '(' + t + ')'; }
  // 単項式 c·x^e（昇べき配列）
  function mono(c, e) { const a = []; for (let i = 0; i < e; i++) a.push(Q(0)); a.push(c); return a; }
  const ptex = (p) => P.tex(p, 'x');
  // x^e（e = 0 なら空、1 なら x）
  function xp(e) { return e === 0 ? '' : (e === 1 ? 'x' : 'x^{' + e + '}'); }
  // 一次結合 Σ c·s の TeX（係数 0 は省略、±1 は符号だけ）
  function lc(terms) {
    let out = '';
    terms.forEach((t) => {
      const c = t[0], s = t[1];
      if (c.isZero()) return;
      const neg = c.sign() < 0, ab = c.abs();
      const body = s === '' ? ab.tex() : (ab.eq(1) ? '' : ab.tex()) + s;
      out += out === '' ? (neg ? '-' : '') + body : (neg ? ' - ' : ' + ') + body;
    });
    return out === '' ? '0' : out;
  }
  // 数の列を符号つきで連結（例: 16 - 32 + 24）
  function sumTex(list) {
    let out = '';
    list.forEach((q, i) => { out += i === 0 ? q.tex() : ' ' + U.signed(q); });
    return out;
  }
  // 根号を含むときだけ近似値を付ける
  function withApprox(tex, val, d) {
    return /\\sqrt/.test(tex) ? tex + R` \approx ` + U.fmt(val, d == null ? 4 : d) : tex;
  }
  // x - α の TeX
  function shiftTex(al) {
    if (al.isZero()) return 'x';
    return al.sign() > 0 ? 'x - ' + al.tex() : 'x + ' + al.neg().tex();
  }
  const MINUS = '−';

  /* ---------- 図: パスカルの三角形 ---------- */
  function pascalFig(n) {
    const rowH = 21, top = 22;
    const W = 360, H = top + rowH * (n + 1) + 8;
    const dx = Math.min(30, 300 / (n + 1));
    const d = JK.plot.draw(W, H);
    d.text(W / 2, 13, 'パスカルの三角形（' + n + ' 段目 = 展開式の係数）', { size: 11, cls: 'dim' });
    for (let i = 0; i <= n; i++) {
      const y = top + rowH * i + 14;
      if (i === n) d.rect(W / 2 - dx * (n / 2) - 16, y - 14, dx * n + 32, 20, { cls: 'c3', fill: 'f3', rx: 8 });
      d.text(8, y, String(i), { size: 10, cls: 'dim', anchor: 'start' });
      for (let j = 0; j <= i; j++) d.text(W / 2 + (j - i / 2) * dx, y, String(U.nCr(i, j)), { size: 12 });
    }
    return d.svg();
  }

  /* ---------- 図: 整式の割り算の筆算 ---------- */
  const SUP = ['', '', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  function cellTxt(c, e, first) {
    const ab = c.abs();
    const body = e === 0 ? ab.toString() : (ab.eq(1) ? '' : ab.toString()) + 'x' + (e === 1 ? '' : (SUP[e] || '^' + e));
    return (c.sign() < 0 ? MINUS : (first ? '' : '+')) + body;
  }
  function polyText(p) {
    let out = '';
    for (let e = p.length - 1; e >= 0; e--) {
      const c = p[e];
      if (c.isZero()) continue;
      const ab = c.abs();
      const body = e === 0 ? ab.toString() : (ab.eq(1) ? '' : ab.toString()) + 'x' + (e === 1 ? '' : (SUP[e] || '^' + e));
      out += out === '' ? (c.sign() < 0 ? MINUS : '') + body : (c.sign() < 0 ? ' ' + MINUS + ' ' : ' + ') + body;
    }
    return out || '0';
  }
  // 各行の項（列 = 次数）を取り出す
  function rowCells(p) {
    const cells = [];
    let first = true;
    for (let e = p.length - 1; e >= 0; e--) {
      if (p[e].isZero()) continue;
      cells.push({ e: e, t: cellTxt(p[e], e, first) });
      first = false;
    }
    return cells;
  }
  function divFig(A, B, stages, qp, rem) {
    const dA = P.deg(A), dB = P.deg(B);
    if (!stages.length || dA > 6) return null;
    const rows = [];
    rows.push({ kind: 'q', cells: rowCells(qp).map((c) => ({ e: c.e + dB, t: c.t })) });
    rows.push({ kind: 'a', cells: rowCells(A) });
    stages.forEach((s, i) => {
      const rc = rowCells(s.after);
      if (!rc.length) rc.push({ e: 0, t: '0' });                 // 割り切れたときの余り 0
      rows.push({ kind: 'p', cells: rowCells(s.prod), last: i === stages.length - 1 });
      rows.push({ kind: 'r', cells: rc, last: i === stages.length - 1 });
    });
    let maxLen = 3;
    rows.forEach((r) => r.cells.forEach((c) => { maxLen = Math.max(maxLen, c.t.length); }));
    const cw = Math.max(38, Math.min(66, maxLen * 7.4 + 10));
    const divTxt = polyText(B);
    const divW = Math.max(52, divTxt.length * 7.2 + 20);
    const W = Math.round(divW + (dA + 1) * cw + 16);
    if (W > 440) return null;
    const yQ = 24, yD = 54, rowGap = 50;
    const H = yD + 26 + (stages.length - 1) * rowGap + 26 + 16;
    const d = JK.plot.draw(W, H);
    const cx = (e) => divW + (dA - e + 0.5) * cw;
    // 商・最後の余りの強調
    const qc = rows[0].cells;
    if (qc.length) {
      const xl = cx(qc[0].e), xr = cx(qc[qc.length - 1].e);
      d.rect(xl - cw / 2 + 2, yQ - 16, xr - xl + cw - 4, 21, { cls: 'c1', fill: 'f1', rx: 6 });
    }
    const lastR = rows[rows.length - 1];
    const yLast = yD + 24 + (stages.length - 1) * rowGap + 26;
    if (lastR.cells.length) {
      const xl = cx(lastR.cells[0].e), xr = cx(lastR.cells[lastR.cells.length - 1].e);
      d.rect(xl - cw / 2 + 2, yLast - 16, xr - xl + cw - 4, 21, { cls: 'c3', fill: 'f3', rx: 6 });
    }
    // かっこ
    d.line(divW - 6, yD - 17, W - 8, yD - 17, { cls: 'fg', w: 1.4 });
    d.line(divW - 6, yD - 17, divW - 6, yD + 6, { cls: 'fg', w: 1.4 });
    d.text(divW - 14, yD, divTxt, { anchor: 'end', size: 12 });
    d.text(6, yQ, '商', { anchor: 'start', size: 11, cls: 'dim' });
    d.text(6, yLast, '余り', { anchor: 'start', size: 11, cls: 'dim' });
    rows[0].cells.forEach((c) => d.text(cx(c.e), yQ, c.t, { size: 12.5, bold: true }));
    rows[1].cells.forEach((c) => d.text(cx(c.e), yD, c.t, { size: 12.5 }));
    stages.forEach((s, i) => {
      const yP = yD + 24 + i * rowGap, yR = yP + 26;
      rows[2 + 2 * i].cells.forEach((c) => d.text(cx(c.e), yP, c.t, { size: 12.5 }));
      const pc = rows[2 + 2 * i].cells;
      if (pc.length) d.line(cx(pc[0].e) - cw / 2 + 3, yP + 6, W - 10, yP + 6, { cls: 'dim', w: 1 });
      rows[3 + 2 * i].cells.forEach((c) => d.text(cx(c.e), yR, c.t, { size: 12.5, bold: i === stages.length - 1 }));
    });
    return d.svg();
  }

  /* ================= 二項定理 ================= */

  JK.registerCalc({
    id: 'iib-binomial',
    course: 'IIB',
    unit: 'm-proof',
    group: '式と証明',
    title: '二項定理（展開と係数）',
    desc: R`$(ax+b)^{n}$ を二項定理で展開します。一般項 $\C{n}{r}(ax)^{n-r}b^{r}$ を $r$ ごとに計算し、指定した次数の項の係数も求めます。`,
    form: R`(ax+b)^{n} = \sum_{r=0}^{n} \C{n}{r}\,(ax)^{n-r}\,b^{r}`,
    inputs: [
      { key: 'a', label: R`$a$`, type: 'q', def: '2' },
      { key: 'b', label: R`$b$`, type: 'q', def: '-1' },
      { key: 'n', label: R`$n$`, type: 'int', def: '4', min: 1, max: 10, hint: R`$n$ は 1〜10 の整数` },
      { key: 'k', label: R`求めたい項 $x^{k}$ の $k$`, type: 'int', def: '2', min: 0, max: 10, hint: R`$x^{k}$ の係数を結果に出します（0〜10）` }
    ],
    examples: [
      { label: '(2x−1)⁴', v: { a: '2', b: '-1', n: '4', k: '2' } },
      { label: '分数係数', v: { a: '1/2', b: '3', n: '5', k: '3' } },
      { label: '(x+2)⁶', v: { a: '1', b: '2', n: '6', k: '4' } },
      { label: 'x² の係数（n=8）', v: { a: '-1', b: '1', n: '8', k: '2' } }
    ],
    intro: {
      easy: R`$(x+1)^{2} = x^{2}+2x+1$ や $(x+1)^{3} = x^{3}+3x^{2}+3x+1$ のように、式を何乗かした形を展開するのは、乗数が大きいと大変です。**二項定理**は、$(A+B)^{n}$ の展開結果をいっぺんに書き下す公式です。
各項の係数は**パスカルの三角形**に並ぶ数（$1,\ 2,\ 1$ や $1,\ 3,\ 3,\ 1$ など）で、一般に $\C{n}{r}$（$n$ 個の中から $r$ 個を選ぶ組合せの数）と書きます。これは「$n$ 個の括弧 $(A+B)$ から $A$ か $B$ のどちらかを 1 つずつ選んで掛ける」とき、$B$ を $r$ 個選ぶ選び方が $\C{n}{r}$ 通りあることから来ています。`,
      normal: R`一般項 $T_{r+1} = \C{n}{r}A^{n-r}B^{r}$ に $A = ax,\ B = b$ を代入し、$r = 0,\ 1,\ \cdots,\ n$ を順に計算して足します。特定の項の係数だけなら、一般項の $x$ の指数から $r$ を決めます。`,
      pro: R`$x^{k}$ の係数だけを問う問題が定番です。全部展開せず、一般項の $x$ の指数 $= k$ から $r$ を決めて 1 項だけ計算します。係数の総和は $x=1$、交代和は $x=-1$ を代入。`
    },
    compute(v) {
      const a = v.a, b = v.b, n = v.n, k = v.k;
      if (a.isZero() || b.isZero()) throw new JK.CalcError('a と b はどちらも 0 以外を入力してください（0 だと項が 1 つしか残らず、展開する意味がなくなります）');
      const cf = [];                                    // cf[p] = x^p の係数
      for (let i = 0; i <= n; i++) cf.push(Q(0));
      const rowsT = [];
      for (let r = 0; r <= n; r++) {
        const bin = U.nCr(n, r), e = n - r;
        const c = Q(bin).mul(a.pow(e)).mul(b.pow(r));
        cf[e] = c;
        rowsT.push(
          R`T_{` + (r + 1) + R`} = \C{` + n + '}{' + r + R`}\,` + par(P.tex([Q(0), a], 'x')) + '^{' + e + R`}\,` + pw(b, r) +
          ' = ' + bin + R` \cdot ` + pw(a, e) + R` \cdot ` + pw(b, r) + (e === 0 ? '' : R`\,` + xp(e)) +
          ' = ' + ptex(mono(c, e))
        );
      }
      const expn = P.of(cf), expTex = ptex(expn);
      const lin = P.tex([b, a], 'x');
      const total = a.add(b).pow(n);
      const pasc = [];
      for (let i = 0; i <= n; i++) {
        const nums = [];
        for (let j = 0; j <= i; j++) nums.push(U.nCr(i, j));
        pasc.push(R`\text{` + i + R` 段目：}\ ` + nums.join(R`\quad `) + (i === n ? R`\quad \text{← この段を使う}` : ''));
      }
      const coefK = k <= n ? cf[k] : Q(0);

      const steps = [
        {
          t: '二項定理の公式を確認する',
          m: [
            R`(A+B)^{n} = \C{n}{0}A^{n} + \C{n}{1}A^{n-1}B + \C{n}{2}A^{n-2}B^{2} + \cdots + \C{n}{n}B^{n}`,
            R`\text{一般項 } T_{r+1} = \C{n}{r}A^{n-r}B^{r} \quad (r = 0,\ 1,\ \cdots,\ n)`
          ],
          n: R`この問題では $A = ` + P.tex([Q(0), a], 'x') + R`,\ B = ` + b.tex() + R`,\ n = ` + n + R`$ として公式に代入します。`,
          easy: R`$(A+B)^{n}$ は「$(A+B)$ を $n$ 個かけ合わせたもの」です。展開するとき、$n$ 個の括弧からそれぞれ $A$ か $B$ のどちらかを選んで掛けます。たとえば $(A+B)^{3}$ なら、$AAA$（1 通り）、$AAB$ の仲間（$B$ を 1 個選ぶ 3 通り）、$ABB$ の仲間（3 通り）、$BBB$（1 通り）で、$A^{3} + 3A^{2}B + 3AB^{2} + B^{3}$ になります。この「何通りあるか」が係数で、$B$ を $r$ 個選ぶ選び方が $\C{n}{r}$ 通りです。`,
          pro: R`一般項 $T_{r+1}$ を立てて、欲しい項の $r$ を決めるのが基本の動きです。係数を問われたら全部展開しないのが時短です。`
        },
        {
          t: R`$\C{n}{r}$ の値（パスカルの三角形）`,
          m: pasc,
          n: R`$\C{n}{r} = \dfrac{n!}{r!\,(n-r)!}$ は「$n$ 個から $r$ 個を選ぶ組合せの数」です。パスカルの三角形では、両端が 1 で、中の数は左上と右上の和になっています。上から $` + n + R`$ 段目（いちばん上を 0 段目）が $\C{` + n + R`}{0},\ \C{` + n + R`}{1},\ \cdots$ です。`,
          easy: R`パスカルの三角形は、両端が 1 で、中の数が「左上の数と右上の数の和」になっている三角形です。上から $n$ 段目（いちばん上を 0 段目）に並ぶ数が、$(A+B)^{n}$ を展開したときの各項の係数 $\C{n}{0},\ \C{n}{1},\ \cdots,\ \C{n}{n}$ にちょうど一致します。たとえば 2 段目の $1,\ 2,\ 1$ は $(A+B)^{2} = A^{2}+2AB+B^{2}$、3 段目の $1,\ 3,\ 3,\ 1$ は $(A+B)^{3} = A^{3}+3A^{2}B+3AB^{2}+B^{3}$ の係数です。`,
          lv: 2
        },
        {
          t: R`一般項を $r = 0,\ 1,\ \cdots,\ ` + n + R`$ について計算する`,
          m: rowsT,
          n: R`$\C{n}{r}\,(ax)^{n-r}\,b^{r}$ に $a = ` + a.tex() + R`,\ b = ` + b.tex() + R`$ を入れて、$r$ ごとに係数を計算します。負の数の累乗は、指数が奇数なら負、偶数なら正です。`,
          easy: R`1 行目の「$=$」の右側で、組合せの数・$a$ の累乗・$b$ の累乗を別々に書き出してから掛けています。$(ax)^{n-r}$ は $a^{n-r}x^{n-r}$ と分けて考えると、係数は $a^{n-r}$、文字の部分は $x^{n-r}$ です。`
        },
        {
          t: '各項を足して展開式にする',
          m: R`(` + lin + R`)^{` + n + '} = ' + expTex,
          n: R`$x$ の次数が高い順（降べき）に並べました。$r$ が増えるごとに $x$ の次数は 1 ずつ下がります。`,
          pro: R`展開後の係数が 1 つでも分かれば、その項の検算に使えます。次の検算で全体を確認します。`
        }
      ];
      if (k <= n) {
        steps.push({
          t: R`$x^{` + k + R`}$ の項の係数`,
          m: [
            R`x \text{ の指数 } n - r = ` + k + R` \;\Rightarrow\; r = ` + n + ' - ' + k + ' = ' + (n - k),
            R`\C{` + n + '}{' + (n - k) + R`}\,` + pw(a, k) + R`\,` + pw(b, n - k) + ' = ' + U.nCr(n, n - k) + R` \cdot ` + U.paren(a.pow(k)) + R` \cdot ` + U.paren(b.pow(n - k)) + ' = ' + coefK.tex()
          ],
          n: R`$x$ の指数が $` + k + R`$ になるのは $n - r = ` + k + R`$、つまり $r = ` + (n - k) + R`$ のときです。この 1 項だけ計算すれば、展開しなくても係数が分かります。`,
          easy: R`$(ax)^{n-r}$ の中の $x$ は $n-r$ 個かけ合わされているので、$x^{` + k + R`}$ の項を探すには「$n - r = ` + k + R`$ になる $r$」を探せばよい、ということです。`,
          pro: R`$x^{k}$ の係数は $\C{n}{n-k}a^{k}b^{n-k}$。定数項（$k=0$）は $b^{n}$、最高次（$k=n$）の係数は $a^{n}$ です。`
        });
      } else {
        steps.push({
          t: R`$x^{` + k + R`}$ の項の係数`,
          m: R`x^{` + k + R`} \text{ の項は存在しない（最高次は } x^{` + n + R`}\text{）} \;\Rightarrow\; \text{係数は } 0`,
          n: R`$(ax+b)^{` + n + R`}$ は $` + n + R`$ 次式なので、$` + k + R`$ 次の項は現れません。`,
          easy: R`$` + n + R`$ 次式を展開しても、$` + n + R`$ より高い次数の項は出てきません。だから係数は 0 です。`
        });
      }
      steps.push({
        t: R`検算: $x = 1$ を代入して係数の和を調べる`,
        m: [
          R`(a+b)^{n} = (` + a.add(b).tex() + R`)^{` + n + '} = ' + total.tex(),
          R`\text{係数の和} = ` + sumTex(cf.slice().reverse()) + ' = ' + total.tex()
        ],
        n: R`展開式に $x = 1$ を代入した値は係数の総和で、元の式に $x=1$ を代入した $(a+b)^{n}$ と一致するはずです。` + (cf.reduce((s, c) => s.add(c), Q(0)).eq(total) ? '一致しました。' : ''),
        easy: R`「展開した式」と「展開する前の式」は同じ式なので、$x$ に同じ数（ここでは 1）を入れれば同じ値になります。これで計算ミスを見つけられます。`,
        lv: 2
      });

      return {
        result: [
          { label: '展開式', tex: R`(` + lin + R`)^{` + n + '} = ' + expTex },
          { label: 'x^' + k + ' の係数', tex: coefK.tex() },
          { label: '係数の総和（x = 1）', tex: total.tex() }
        ],
        steps: steps,
        fig: pascalFig(n)
      };
    }
  });

  /* ================= 整式の割り算 ================= */

  JK.registerCalc({
    id: 'iib-polydiv',
    course: 'IIB',
    unit: 'm-proof',
    group: '式と証明',
    title: '整式の割り算（商と余り）',
    desc: R`整式 $A$ を整式 $B$ で割った商 $Q$ と余り $R$ を、筆算の手順どおり 1 段ずつ求め、$A = BQ + R$ で検算します。`,
    form: R`A = BQ + R \quad (\text{ただし } R \text{ の次数} < B \text{ の次数})`,
    inputs: [
      { key: 'A', label: R`割られる式 $A$`, type: 'poly', def: '2x^3 - x^2 + 3x - 5', hint: R`例: $2x^3 - x^2 + 3x - 5$、$(x-1)(x+2)^2$ も可` },
      { key: 'B', label: R`割る式 $B$`, type: 'poly', def: 'x^2 - x + 1', hint: R`0 以外の整式（定数でも可）` }
    ],
    examples: [
      { label: '2次式で割る', v: { A: '2x^3 - x^2 + 3x - 5', B: 'x^2 - x + 1' } },
      { label: '割り切れる', v: { A: 'x^3 - 6x^2 + 11x - 6', B: 'x - 1' } },
      { label: '分数の商', v: { A: 'x^4 + 3x + 2', B: '2x^2 - x + 1' } },
      { label: '次数が足りない', v: { A: 'x + 5', B: 'x^2 + 1' } }
    ],
    intro: {
      easy: R`整数の割り算 $17 \div 5 = 3$ 余り $2$（$17 = 5 \times 3 + 2$）と同じ考え方で、式（整式）も割り算ができます。「割られる式 $A$ ＝ 割る式 $B$ × 商 $Q$ ＋ 余り $R$」の形で表せて、余り $R$ の次数は $B$ の次数より小さくなります（整数で「余りは割る数より小さい」のと同じです）。
筆算では、いちばん次数の高い項どうしを割って商の項を決め、それを割る式全体にかけて引く、という操作で最高次の項を 1 つずつ消していきます。`,
      normal: R`最高次の項どうしを割って商の項を決め、$B$ にかけた式を引く、を繰り返します。余りの次数が $B$ の次数より小さくなったら終了です。最後に $A = BQ + R$ で検算します。`,
      pro: R`$B$ が $x-a$ の形なら組立除法が速く、余りは $A(a)$（剰余の定理）。割り算の結果は「$A = BQ + R$」の恒等式としてそのまま使えます。`
    },
    compute(v) {
      const A = v.A, B = v.B;
      if (P.isZero(B)) throw new JK.CalcError('割る式 B は 0 以外にしてください（0 では割れません）');
      const dA = P.deg(A), dB = P.deg(B);
      let rem = A.slice(), qp = [Q(0)];
      const stages = [];
      while (P.deg(rem) >= dB && !P.isZero(rem)) {
        const dr = P.deg(rem), c = rem[dr].div(B[dB]), e = dr - dB;
        const m = P.of(mono(c, e)), prod = P.mul(m, B), after = P.sub(rem, prod);
        stages.push({ c: c, e: e, m: m, prod: prod, before: rem, after: after, dr: dr });
        qp = P.add(qp, m);
        rem = after;
        if (stages.length > 20) break;
      }
      const Qp = qp, Rm = rem;
      const BQ = P.mul(B, Qp), BQR = P.add(BQ, Rm);
      const Bp = par(ptex(B));
      const plusR = P.isZero(Rm) ? '' : (Rm.length === 1 ? ' ' + U.signed(Rm[0]) : ' + ' + par(ptex(Rm)));

      const steps = [
        {
          t: R`割り算の式 $A = BQ + R$ の意味`,
          m: R`A = BQ + R \quad (R \text{ の次数} < B \text{ の次数})`,
          n: R`$A = ` + ptex(A) + R`$、$B = ` + ptex(B) + R`$。` + (dA < dB ? R`$A$ の次数が $B$ の次数より小さいので、これ以上割れません。商は $0$、余りは $A$ そのものです。` : R`$A$ の最高次の項から順に消して、商 $Q$ と余り $R$ を求めます。`),
          easy: R`整数なら $17 = 5 \times 3 + 2$ のように「割られる数 ＝ 割る数 × 商 ＋ 余り」と書けます。整式でも同じで、余りの次数が「割る式の次数」より小さくなるまで割ります。たとえば $B$ が 2 次式なら、余りは 1 次式か定数です。`,
          pro: R`この等式は $x$ についての恒等式です。後で値を代入して検算に使えます。`
        },
        {
          t: R`降べきの順に並べる`,
          m: [R`A = ` + ptex(A), R`B = ` + ptex(B)],
          n: R`次数の高い項から順に並べます。抜けている次数の項は「係数 0」として扱います（例: $x^{3} + 1$ は $x^{3} + 0x^{2} + 0x + 1$）。`,
          easy: R`筆算では同じ次数の項を縦にそろえるので、まず高い次数から順に並べておきます。$x^{2}$ の項が無ければ $0x^{2}$ があると考えて、位置をそろえます。`,
          lv: 2
        }
      ];
      stages.forEach((s, i) => {
        const lead = ptex(mono(s.before[s.dr], s.dr)), leadB = ptex(mono(B[dB], dB));
        steps.push({
          t: '第 ' + (i + 1) + ' 段: 最高次の項を消す',
          m: [
            R`\frac{` + lead + '}{' + leadB + '} = ' + ptex(s.m),
            ptex(s.m) + R` \times ` + Bp + ' = ' + ptex(s.prod),
            R`(` + ptex(s.before) + R`) - (` + ptex(s.prod) + ') = ' + ptex(s.after)
          ],
          n: R`いまの式の最高次の項 $` + lead + R`$ を $B$ の最高次の項 $` + leadB + R`$ で割ると、商の項は $` + ptex(s.m) + R`$。これを $B$ 全体にかけた式を引くと、最高次の項が消えて次数が下がります。` +
            (P.deg(s.after) < dB ? R`次数が $B$ より小さくなったので、ここで終了です。` : ''),
          easy: i === 0
            ? R`いちばん次数の高い項どうしを割ります（整数の筆算で、上の位から「いくつ立つか」を決めるのと同じです）。立てた商の項に割る式 $B$ をまるごと掛け、いまの式から引くと、最高次の項がちょうど消えます。この「割る→掛ける→引く」を繰り返します。`
            : (P.deg(s.after) < dB
              ? R`引いた結果の次数が割る式より低くなったので、もう割れません。残った式が余りです（整数で、余りが割る数より小さくなったら終わりなのと同じです）。`
              : R`前の段の引き算でできた式について、また「最高次の項どうしを割る→$B$ に掛ける→引く」を行います。`),
          lv: 2
        });
      });
      steps.push({
        t: '商と余り',
        m: [R`Q = ` + ptex(Qp), R`R = ` + ptex(Rm)],
        n: stages.length ? R`各段で立てた商の項を足したものが商 $Q$、最後に残った式が余り $R$ です。` + (P.isZero(Rm) ? R`余りが $0$ なので、$A$ は $B$ で割り切れます（$B$ は $A$ の因数）。` : '') : R`割り算を行う前に終わるので、商は $0$、余りは $A$ です。`,
        pro: P.isZero(Rm) ? R`余りが 0 なら $A = BQ$ と因数分解できます。` : R`余りの次数が $B$ の次数より小さいことを必ず確認します。`
      });
      steps.push({
        t: R`検算: $A = BQ + R$`,
        m: [
          R`BQ = ` + Bp + par(ptex(Qp)) + ' = ' + ptex(BQ),
          R`BQ + R = ` + ptex(BQ) + plusR + ' = ' + ptex(BQR)
        ],
        n: R`$BQ + R$ を展開して整理すると $A$ に一致するか確かめます。` + (P.add(BQR, P.neg(A)).every((c) => c.isZero()) ? '一致しました。' : ''),
        easy: R`整数なら「$5 \times 3 + 2 = 17$」で確かめるのと同じです。商と余りが正しければ、掛けて足すと元の式 $A$ に戻ります。`,
        lv: 2
      });

      return {
        result: [
          { label: '商 Q', tex: ptex(Qp) },
          { label: '余り R', tex: ptex(Rm) },
          { label: '割り算の式', tex: par(ptex(A)) + ' = ' + Bp + par(ptex(Qp)) + plusR }
        ],
        steps: steps,
        fig: divFig(A, B, stages, Qp, Rm)
      };
    }
  });

  /* ================= 相加平均・相乗平均 ================= */

  JK.registerCalc({
    id: 'iib-amgm',
    course: 'IIB',
    unit: 'm-proof',
    group: '式と証明',
    title: '相加平均・相乗平均（最小値）',
    desc: R`$ax + \dfrac{b}{x}$ の最小値（$x > 0$）または最大値（$x < 0$）を、相加平均と相乗平均の関係で求め、等号が成り立つ $x$ も調べます。`,
    form: R`ax + \frac{b}{x} \ge 2\sqrt{ax \cdot \frac{b}{x}} = 2\sqrt{ab} \quad (a > 0,\ b > 0,\ x > 0)`,
    inputs: [
      { key: 'a', label: R`$a$`, type: 'q', def: '1', hint: R`$a > 0$（$x + \frac{k}{x}$ なら $a = 1$）` },
      { key: 'b', label: R`$b$`, type: 'q', def: '4', hint: R`$b > 0$（$x + \frac{k}{x}$ なら $b = k$）` },
      { key: 'dom', label: 'x の範囲', type: 'select', def: 'pos', options: [['pos', 'x > 0（最小値）'], ['neg', 'x < 0（最大値）']] }
    ],
    examples: [
      { label: 'x + 4/x', v: { a: '1', b: '4', dom: 'pos' } },
      { label: '2x + 3/x', v: { a: '2', b: '3', dom: 'pos' } },
      { label: 'x < 0 のとき', v: { a: '1', b: '9', dom: 'neg' } },
      { label: '分数係数', v: { a: '1/2', b: '8', dom: 'pos' } }
    ],
    intro: {
      easy: R`「たて $A$、よこ $B$ の長方形」を考えます。面積 $AB$ を一定にしたまま形を変えると、周の長さ（$2(A+B)$）がいちばん短くなるのは正方形、つまり $A = B$ のときです。これを式で表したのが**相加平均・相乗平均の不等式**で、$A,\ B$ が正の数のとき $\dfrac{A+B}{2} \ge \sqrt{AB}$ が成り立ちます（左が相加平均、右が相乗平均）。
$ax + \dfrac{b}{x}$ は、$x$ が大きいと $ax$ が大きく、$x$ が 0 に近いと $\dfrac{b}{x}$ が大きくなるので、「ちょうど中間のどこか」で最小になります。この不等式を使うと、微分をしなくても最小値が求められます。`,
      normal: R`$A = ax,\ B = \dfrac{b}{x}$ とおくと積 $AB = ab$ が一定になります。$ax + \dfrac{b}{x} \ge 2\sqrt{ab}$、等号は $ax = \dfrac{b}{x}$ のとき。実際に等号が成り立つ $x$ があるかを必ず確認します。`,
      pro: R`「積が定数になる形に変形する」のが使いどころ。等号成立条件の確認を忘れないこと。$x<0$ なら $x = -t$ とおいて $t>0$ に直します。`
    },
    compute(v) {
      const a = v.a, b = v.b, neg = v.dom === 'neg';
      if (a.sign() <= 0 || b.sign() <= 0) throw new JK.CalcError('a, b はどちらも正の数にしてください（相加・相乗平均の不等式は正の数どうしに使うため）');
      const ab = a.mul(b);
      const m2 = U.sqrtTex(ab.mul(4)), m2v = 2 * Math.sqrt(ab.val());
      const x0t = U.sqrtTex(b.div(a)), x0v = Math.sqrt(b.val() / a.val());
      const fTex = (a.eq(1) ? '' : a.tex()) + R`x + \frac{` + b.tex() + '}{x}';
      const sgn = neg ? '-' : '';
      const valTex = sgn + m2;
      const kind = neg ? '最大値' : '最小値';

      const steps = [
        {
          t: '相加平均・相乗平均の不等式',
          m: [R`\frac{A+B}{2} \ge \sqrt{AB} \quad (A > 0,\ B > 0)`, R`\text{等号が成り立つのは } A = B \text{ のとき}`],
          n: R`2 つの正の数の「平均（相加平均）」は、それらの積の平方根（相乗平均）以上です。両辺を 2 倍した $A + B \ge 2\sqrt{AB}$ の形でよく使います。`,
          easy: R`数で確かめます。$A = 1,\ B = 9$ なら、相加平均は $\dfrac{1+9}{2} = 5$、相乗平均は $\sqrt{1 \times 9} = 3$ で、$5 \ge 3$ です。$A = B = 4$ のように等しいときだけ、$\dfrac{4+4}{2} = 4 = \sqrt{16}$ と両者が一致します。使えるのは $A,\ B$ が**正**のときだけです（負の数では成り立たないことがあります）。`,
          pro: R`和が最小になる条件が「等しいとき」。$A+B$ の最小値は積 $AB$ が一定のとき、$A+B$ の最大値は和が一定のとき $AB$ の最大値に使えます。`
        },
        {
          t: R`なぜ成り立つか（$A + B - 2\sqrt{AB} \ge 0$）`,
          m: R`A + B - 2\sqrt{AB} = \left(\sqrt{A} - \sqrt{B}\right)^{2} \ge 0`,
          n: R`$\sqrt{A},\ \sqrt{B}$ を使って平方の形にできます。2 乗は 0 以上なので不等式が成り立ち、等号は $\sqrt{A} = \sqrt{B}$、つまり $A = B$ のときです。`,
          easy: R`$(p - q)^{2} = p^{2} - 2pq + q^{2}$ という展開公式で、$p = \sqrt{A},\ q = \sqrt{B}$ とすると $A - 2\sqrt{AB} + B$ になります。「2 乗は必ず 0 以上」という性質から不等式が出てきます。`,
          lv: 3
        }
      ];
      if (neg) {
        steps.push({
          t: R`$x < 0$ なので $t = -x > 0$ とおく`,
          m: [R`t = -x \;(> 0)`, R`ax + \frac{b}{x} = -\left(at + \frac{b}{t}\right)`],
          n: R`$x$ が負のままでは相加・相乗平均が使えないので、$t = -x$ と置いて正の数に直します。$a x = -at$、$\dfrac{b}{x} = -\dfrac{b}{t}$ なので全体が $-$ でくくれます。`,
          easy: R`相加・相乗平均は正の数にしか使えません。$x$ が負のときは、$-1$ を掛けて正の数 $t = -x$ にしてから考えます。最後に $-1$ を掛け戻すので、不等号の向きが逆になり、「最小」が「最大」に変わります。`
        });
      }
      const AB = neg ? R`at,\ \frac{b}{t}` : R`ax,\ \frac{b}{x}`;
      steps.push({
        t: '2 つの項の積が一定になることを確認',
        m: neg ? R`at \cdot \frac{b}{t} = ab = ` + ab.tex() : R`ax \cdot \frac{b}{x} = ab = ` + ab.tex(),
        n: R`$` + AB + R`$ はどちらも正で、積から $` + (neg ? 't' : 'x') + R`$ が消えて定数 $ab = ` + ab.tex() + R`$ になります。このとき相乗平均は $x$ によらない定数 $\sqrt{ab}$ になるので、不等式から最小値が決まります。`,
        easy: R`相加・相乗平均が威力を発揮するのは「積が一定」のときです。$ax$ と $\dfrac{b}{x}$ を掛けると、$x$ と $\dfrac{1}{x}$ が打ち消し合って $ab$ だけが残ります。このおかげで「相乗平均の値 $\sqrt{ab}$ が $x$ によらず一定」になります。`
      });
      steps.push({
        t: '不等式を適用する',
        m: neg
          ? [
            R`at + \frac{b}{t} \ge 2\sqrt{at \cdot \frac{b}{t}} = 2\sqrt{ab} = ` + withApprox(m2, m2v),
            R`ax + \frac{b}{x} = -\left(at + \frac{b}{t}\right) \le -2\sqrt{ab} = ` + withApprox('-' + m2, -m2v)
          ]
          : [R`ax + \frac{b}{x} \ge 2\sqrt{ax \cdot \frac{b}{x}} = 2\sqrt{ab} = 2\sqrt{` + ab.tex() + '} = ' + withApprox(m2, m2v)],
        n: R`$2\sqrt{ab}$ に $a = ` + a.tex() + R`,\ b = ` + b.tex() + R`$ を代入します。$\sqrt{` + ab.mul(4).tex() + R`}$ を簡単にして ` + (neg ? R`$-` : R`$`) + m2 + R`$。`,
        pro: R`値は $2\sqrt{ab}$ と覚えておけば、代入するだけで最小値が出ます。`
      });
      steps.push({
        t: '等号が成り立つ $x$ を求める',
        m: neg
          ? [R`at = \frac{b}{t} \;\Rightarrow\; t^{2} = \frac{b}{a} = ` + b.div(a).tex() + R` \;\Rightarrow\; t = ` + x0t, R`x = -t = -` + withApprox(x0t, x0v)]
          : [R`ax = \frac{b}{x} \;\Rightarrow\; x^{2} = \frac{b}{a} = ` + b.div(a).tex(), R`x > 0 \text{ より } x = ` + withApprox(x0t, x0v)],
        n: R`等号は 2 つの項が等しいときに成り立ちます。この $x$ が条件（` + (neg ? R`$x<0$` : R`$x>0$`) + R`）を満たすので、` + kind + R`は実際にとります。`,
        easy: R`不等式の等号は「2 つが等しいとき」でした。$ax = \dfrac{b}{x}$ の両辺に $x$ を掛けると $ax^{2} = b$、すなわち $x^{2} = \dfrac{b}{a}$。$x$ の範囲に合うほうの解を選びます。`
      });
      steps.push({
        t: kind + 'と結論',
        m: [kind + R` = ` + withApprox(valTex, neg ? -m2v : m2v) + R`\quad (x = ` + (neg ? '-' : '') + x0t + ')'],
        n: R`$x = ` + (neg ? '-' : '') + x0t + R`$ のとき ` + kind + R`となります。等号が成り立つ $x$ が範囲内に存在することを確認したので、不等式の「$\ge$」の下限は実際にとる値（` + kind + R`）です。`,
        pro: R`解答では「等号成立は $ax = \dfrac{b}{x}$ すなわち $x = \sqrt{b/a}$ のとき」と明記します。`
      });

      const fig = (() => {
        const sx = neg ? -1 : 1;
        const lo = neg ? -2.8 * x0v : 0, hi = neg ? 0 : 2.8 * x0v;
        const ytop = 2.2 * m2v;
        const f = (x) => a.val() * x + b.val() / x;
        return JK.plot.graph({
          w: 340, h: 250,
          x: [lo, hi], y: neg ? [-ytop, 0] : [0, ytop],
          curves: [
            { f: f, cls: 'c1' },
            { f: (x) => a.val() * x, cls: 'c2', dash: true },
            { f: (x) => b.val() / x, cls: 'c4', dash: true }
          ],
          hlines: [{ y: sx * m2v, dash: true, label: 'y=' + U.fmt(sx * m2v) }],
          vlines: [{ x: sx * x0v, dash: true, label: 'x=' + U.fmt(sx * x0v) }],
          points: [{ x: sx * x0v, y: sx * m2v, label: '(' + U.fmt(sx * x0v) + ', ' + U.fmt(sx * m2v) + ')', cls: 'c3', pos: neg ? 'bl' : 'tr' }],
          labels: [
            { x: sx * x0v * 2.2, y: sx * a.val() * x0v * 2.2 * 0.92, text: 'y=ax', cls: 'c2', anchor: neg ? 'end' : 'start' },
            { x: sx * x0v * 0.5, y: sx * b.val() / (x0v * 0.5) * 0.7, text: 'y=b/x', cls: 'c4', anchor: neg ? 'end' : 'start' }
          ]
        });
      })();

      return {
        result: [
          { label: kind, tex: withApprox(valTex, neg ? -m2v : m2v) },
          { label: '等号成立の x', tex: (neg ? '-' : '') + withApprox(x0t, x0v) },
          { label: '不等式', tex: neg ? fTex + R` \le ` + withApprox('-' + m2, -m2v) : fTex + R` \ge ` + withApprox(m2, m2v) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 恒等式の係数決定 ================= */

  JK.registerCalc({
    id: 'iib-identity',
    course: 'IIB',
    unit: 'm-proof',
    group: '式と証明',
    title: '恒等式の係数決定（係数比較法・数値代入法）',
    desc: R`$ax^{2}+bx+c = p(x-\alpha)^{2} + q(x-\alpha) + r$ が $x$ についての恒等式となるように $p,\ q,\ r$ を求めます。係数比較法と数値代入法の両方で解きます。`,
    form: R`ax^{2}+bx+c = p(x-\alpha)^{2} + q(x-\alpha) + r`,
    inputs: [
      { key: 'a', label: R`$a$`, type: 'q', def: '3' },
      { key: 'b', label: R`$b$`, type: 'q', def: '-2' },
      { key: 'c', label: R`$c$`, type: 'q', def: '7' },
      { key: 'al', label: R`$\alpha$`, type: 'q', def: '2' }
    ],
    examples: [
      { label: 'α = 2', v: { a: '3', b: '-2', c: '7', al: '2' } },
      { label: 'α = −1', v: { a: '2', b: '5', c: '1', al: '-1' } },
      { label: '分数の α', v: { a: '4', b: '-6', c: '1', al: '1/2' } }
    ],
    intro: {
      easy: R`「$x$ にどんな値を入れても成り立つ等式」を**恒等式**といいます。たとえば $(x+1)^{2} = x^{2}+2x+1$ は、$x = 3$ でも $x = -5$ でも左右が一致する恒等式です。一方、$x + 1 = 3$ は $x = 2$ のときだけ成り立つ「方程式」です。
恒等式では、両辺を展開して整理したとき、**同じ次数の項の係数がそれぞれ等しく**なります（係数比較法）。また、$x$ に好きな数を代入しても成り立つので、うまい値を代入して係数を決める方法（数値代入法）もあります。`,
      normal: R`係数比較法は右辺を展開して $x^{2},\ x,\ 1$ の係数を比べ、数値代入法は $x = \alpha,\ \alpha \pm 1$ を代入して連立方程式を作ります。どちらでも同じ $p,\ q,\ r$ が出ます。`,
      pro: R`$x-\alpha$ で連続して割る（組立除法を 2 回）と、余りが $r$、次に $q$ と順に出ます。係数比較は「必要条件」、数値代入は「必要条件のみ」なので、最後に恒等式になることを確かめるのが厳密な手順です。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c, al = v.al;
      const f = (x) => a.mul(x).mul(x).add(b.mul(x)).add(c);
      const p = a, q = b.add(al.mul(a).mul(2)), r = c.sub(al.mul(al).mul(p)).add(al.mul(q));
      const cXp = al.mul(-2), cCp = al.mul(al), cCq = al.neg();     // 展開したときの係数
      const lhs = P.tex([c, b, a], 'x');
      const sh = shiftTex(al);
      const Sp = f(al.add(1)), Sm = f(al.sub(1));
      const rhsTex = lc([[p, R`(` + sh + R`)^{2}`], [q, R`(` + sh + R`)`], [r, '']]);
      const subst = (x) => U.paren(a) + R` \cdot ` + pw(x, 2) + ' + ' + U.paren(b) + R` \cdot ` + U.paren(x) + ' + ' + U.paren(c);
      const chk = P.add(P.add(P.scale(P.mul([al.neg(), Q(1)], [al.neg(), Q(1)]), p), P.scale([al.neg(), Q(1)], q)), [r]);

      const steps = [
        {
          t: '恒等式の考え方',
          m: [R`ax^{2}+bx+c = p(x-\alpha)^{2} + q(x-\alpha) + r \quad (x \text{ についての恒等式})`],
          n: R`「どんな $x$ でも成り立つ」ように $p,\ q,\ r$ を決めます。右辺を $x$ の降べきに展開して左辺と**係数を比べる**（係数比較法）か、$x$ に具体的な値を**代入して式を作る**（数値代入法）かで求められます。`,
          easy: R`左辺は「ふつうの 2 次式」、右辺は「$x - \alpha$ を単位にして並べた 2 次式」で、同じ式を 2 通りの形で書いたものです。グラフでいうと、同じ放物線を「原点からの距離 $x$」で表すか、「$x = \alpha$ からの距離 $x - \alpha$」で表すか、の違いです。形が違うだけで同じ式なので、両辺の係数や値がぴったり対応するはずです。`
        },
        {
          t: '【係数比較法】右辺を展開して整理する',
          m: [
            R`p(x-\alpha)^{2} + q(x-\alpha) + r = px^{2} - 2\alpha px + \alpha^{2}p + qx - \alpha q + r`,
            R`= p x^{2} + (` + lc([[Q(1), 'q'], [cXp, 'p']]) + R`)x + (` + lc([[cCp, 'p'], [cCq, 'q'], [Q(1), 'r']]) + ')'
          ],
          n: R`$\alpha = ` + al.tex() + R`$ を入れました。$x^{2},\ x,\ $定数項ごとにまとめます。`,
          easy: R`$(x-\alpha)^{2} = x^{2} - 2\alpha x + \alpha^{2}$ を使って括弧を外し、$x^{2}$ の項、$x$ の項、定数項に分けて整理します。`
        },
        {
          t: '両辺の係数を比べる',
          m: R`\begin{cases} p = ` + a.tex() + R` \\ ` + lc([[Q(1), 'q'], [cXp, 'p']]) + ' = ' + b.tex() + R` \\ ` + lc([[cCp, 'p'], [cCq, 'q'], [Q(1), 'r']]) + ' = ' + c.tex() + R` \end{cases}`,
          n: R`左辺 $` + lhs + R`$ の $x^{2},\ x,\ $定数項の係数と、右辺の同じ次数の項の係数を等しいとおきます。`,
          easy: R`恒等式なので、$x^{2}$ の係数どうし、$x$ の係数どうし、定数項どうしが等しくなります。これで $p,\ q,\ r$ についての連立方程式ができます。`
        },
        {
          t: R`$p,\ q,\ r$ を順に求める`,
          m: [
            R`p = ` + p.tex(),
            R`q = b + 2\alpha p = ` + b.tex() + R` + 2 \cdot ` + U.paren(al) + R` \cdot ` + U.paren(p) + ' = ' + q.tex(),
            R`r = c - \alpha^{2}p + \alpha q = ` + c.tex() + R` - ` + U.paren(cCp) + R` \cdot ` + U.paren(p) + R` + ` + U.paren(al) + R` \cdot ` + U.paren(q) + ' = ' + r.tex()
          ],
          n: R`上の式から $p$ がすぐに決まり、$p$ を 2 番目に入れて $q$、$p,\ q$ を 3 番目に入れて $r$ が決まります。`,
          easy: R`1 番目の式は $p$ だけなので、そのまま $p$ が分かります。分かった $p$ を 2 番目の式に入れると $q$ だけが残り、$p$ と $q$ を 3 番目に入れると $r$ だけが残ります。上から順に 1 つずつ決まっていきます。`,
          lv: 2
        },
        {
          t: R`【数値代入法】$x = \alpha,\ \alpha \pm 1$ を代入する`,
          m: [
            R`x = \alpha:\quad ` + subst(al) + ' = ' + f(al).tex() + R` \;\Rightarrow\; r = ` + f(al).tex(),
            R`x = \alpha + 1:\quad ` + subst(al.add(1)) + ' = ' + Sp.tex() + R` \;\Rightarrow\; p + q + r = ` + Sp.tex(),
            R`x = \alpha - 1:\quad ` + subst(al.sub(1)) + ' = ' + Sm.tex() + R` \;\Rightarrow\; p - q + r = ` + Sm.tex()
          ],
          n: R`右辺に $x = \alpha$ を入れると $(x-\alpha)$ の項が消えて $r$ だけが残ります。$x = \alpha \pm 1$ では $(x - \alpha) = \pm 1$ になって計算が楽です。`,
          easy: R`$x$ に入れる数は自由です。$x = \alpha$ を入れると $x - \alpha = 0$ になって右辺は $r$ だけになり、すぐ $r$ が決まります。$x = \alpha + 1$ なら $x - \alpha = 1$、$x = \alpha - 1$ なら $x - \alpha = -1$ で、$p + q + r$ と $p - q + r$ という簡単な形になります。`
        },
        {
          t: R`連立方程式を解いて $p,\ q$ を求める`,
          m: [
            R`(p + q + r) + (p - q + r) = ` + Sp.add(Sm).tex() + R` \;\Rightarrow\; 2p + 2r = ` + Sp.add(Sm).tex() + R` \;\Rightarrow\; p = ` + Sp.add(Sm).div(2).tex() + ' - ' + U.paren(f(al)) + ' = ' + p.tex(),
            R`(p + q + r) - (p - q + r) = ` + Sp.sub(Sm).tex() + R` \;\Rightarrow\; 2q = ` + Sp.sub(Sm).tex() + R` \;\Rightarrow\; q = ` + q.tex()
          ],
          n: R`2 式を足すと $q$ が消えて $p$ が、引くと $p,\ r$ が消えて $q$ が求まります。係数比較法の結果 $p = ` + p.tex() + R`,\ q = ` + q.tex() + R`,\ r = ` + r.tex() + R`$ と一致します。`,
          pro: R`数値代入法は「代入した値で成り立つ」ことしか保証しないので、厳密には最後に恒等式になることの確認（次の検算）が必要です。`,
          lv: 2
        },
        {
          t: '検算: 右辺を展開して左辺と比べる',
          m: [
            rhsTex + ' = ' + ptex(chk),
            R`= ` + lhs + R`\quad \text{（左辺と一致）}`
          ],
          n: R`求めた $p = ` + p.tex() + R`,\ q = ` + q.tex() + R`,\ r = ` + r.tex() + R`$ を右辺に戻して展開すると、左辺と一致します。`,
          easy: R`答えを式に戻して展開し、左辺にぴったり戻れば正解です。`,
          lv: 2
        }
      ];

      const fig = (() => {
        const av = a.val(), bv = b.val(), cv = c.val(), alv = al.val(), qv = q.val(), rv = r.val();
        const h = Math.max(2.5, Math.abs(alv) * 0.3 + 2.5);
        return JK.plot.graph({
          w: 340, h: 240,
          x: [alv - h - 0.5, alv + h + 0.5],
          curves: [
            { f: (x) => av * x * x + bv * x + cv, cls: 'c1' },
            { f: (x) => qv * (x - alv) + rv, cls: 'c3', dash: true }
          ],
          vlines: [{ x: alv, label: 'x=' + al.toString() }],
          points: [{ x: alv, y: rv, label: '(α, r)=(' + al.toString() + ', ' + r.toString() + ')', cls: 'c3', pos: 'tr' }]
        });
      })();

      return {
        result: [
          { label: 'p', tex: p.tex() },
          { label: 'q', tex: q.tex() },
          { label: 'r', tex: r.tex() },
          { label: '恒等式', tex: lhs + ' = ' + rhsTex }
        ],
        steps: steps,
        fig: fig
      };
    }
  });
})();
