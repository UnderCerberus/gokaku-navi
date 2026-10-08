/* 数I・A — データの分析: 1 変量データ / 2 変量データ / 変量の変換
   ※ 平均・分散などは厳密な有理数で計算する（個数・桁数が増えても丸め誤差が出ないよう BigInt で保持）。 */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const CE = (msg) => new JK.CalcError(msg);

  /* ================= 厳密な有理数（BigInt） ================= */

  function bgcd(a, b) {
    if (a < 0n) a = -a;
    if (b < 0n) b = -b;
    while (b) { const t = a % b; a = b; b = t; }
    return a;
  }
  function fr(n, d) {
    n = BigInt(n);
    d = d === undefined ? 1n : BigInt(d);
    if (d === 0n) throw CE('0 で割ることはできません');
    if (d < 0n) { n = -n; d = -d; }
    const g = bgcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  }
  const fAdd = (a, b) => fr(a.n * b.d + b.n * a.d, a.d * b.d);
  const fSub = (a, b) => fr(a.n * b.d - b.n * a.d, a.d * b.d);
  const fMul = (a, b) => fr(a.n * b.n, a.d * b.d);
  const fDiv = (a, b) => fr(a.n * b.d, a.d * b.n);
  const fCmp = (a, b) => { const l = a.n * b.d, r = b.n * a.d; return l < r ? -1 : (l > r ? 1 : 0); };
  const fNeg = (a) => ({ n: -a.n, d: a.d });
  const fSign = (a) => (a.n > 0n ? 1 : (a.n < 0n ? -1 : 0));
  const fVal = (a) => Number(a.n) / Number(a.d);
  const fSum = (arr) => arr.reduce(fAdd, fr(0));
  const ZERO = fr(0);

  // 有限小数で表せるなら小数の文字列（小数 maxPlaces 桁まで）、そうでなければ null
  function dec(f, maxPlaces) {
    let d = f.d, e2 = 0, e5 = 0;
    while (d % 2n === 0n) { d /= 2n; e2++; }
    while (d % 5n === 0n) { d /= 5n; e5++; }
    if (d !== 1n) return null;
    const k = Math.max(e2, e5);
    if (k > maxPlaces) return null;
    const neg = f.n < 0n;
    let s = ((neg ? -f.n : f.n) * 10n ** BigInt(k) / f.d).toString();
    if (k > 0) {
      while (s.length <= k) s = '0' + s;
      s = s.slice(0, s.length - k) + '.' + s.slice(s.length - k);
    }
    return (neg ? '-' : '') + s;
  }
  // 厳密値の TeX（有限小数ならそのまま小数、そうでなければ分数）
  function tex(f) {
    const s = dec(f, 8);
    if (s !== null) return s;
    return (f.n < 0n ? '-' : '') + R`\frac{` + (f.n < 0n ? -f.n : f.n) + '}{' + f.d + '}';
  }
  const paren = (f) => (f.n < 0n ? R`\left(` + tex(f) + R`\right)` : tex(f));
  // 累乗の底に使う（負の数・分数はかっこで囲む）
  const pw = (f) => (f.n < 0n || dec(f, 8) === null ? R`\left(` + tex(f) + R`\right)` : tex(f));
  const approx = (f, k) => U.fmt(fVal(f), k);
  // 厳密値 + （有限小数でないときだけ）近似値
  const texA = (f) => (dec(f, 8) !== null ? tex(f) : tex(f) + R` \fallingdotseq ` + approx(f, 4));
  // a ÷ n（a が割り切れない分数のときは ÷ の形で書く）
  const quot = (a, n) => (dec(a, 8) !== null ? R`\frac{${tex(a)}}{${n}}` : tex(a) + R` \div ${n}`);
  // 「a ÷ n = 値」を 1 式で（途中の分数と答えが同じなら重ねて書かない）
  function divTo(a, n, value) {
    const q = quot(a, n), v = texA(value);
    return q === tex(value) ? v : q + ' = ' + v;
  }
  // 図・表の中に書く素のテキスト
  function plain(f) {
    let s = dec(f, 4);
    if (s === null) {
      s = (f.n < 0n ? '-' : '') + (f.n < 0n ? -f.n : f.n) + '/' + f.d;
      if (s.length > 9) s = '≒' + approx(f, 3);
    }
    return s.replace(/-/g, '−');
  }
  // √f の厳密な TeX（f ≥ 0）。大きすぎて簡単にできないときは null
  function radTex(f) {
    if (f.n * f.d > 10000000000000n) return null;
    return U.sqrtTex(JK.Q(Number(f.n), Number(f.d)));
  }
  const isSurd = (t) => t !== null && t.indexOf('\\sqrt') >= 0;
  // √f（f = N/D 既約）を簡単にする過程（TeX の行）。簡単にする必要がなければ null
  function surdLines(f, finalTex) {
    const N0 = f.n, D0 = f.d;
    const tail = (mid) => (mid === finalTex ? '' : R` = ${finalTex}`);
    if (D0 === 1n) {
      const sp = U.sqrtSimplify(Number(N0));
      if (sp.out === 1) return null;
      return [R`\sqrt{${N0}} = \sqrt{${sp.out}^{2} \times ${sp.in}} = ${sp.out}\sqrt{${sp.in}}`];
    }
    const dsq = BigInt(Math.round(Math.sqrt(Number(D0))));
    if (dsq * dsq === D0) {                         // 分母が平方数: そのままルートを外せる
      const sp = U.sqrtSimplify(Number(N0));
      const lines = [R`\sqrt{\frac{${N0}}{${D0}}} = \frac{\sqrt{${N0}}}{\sqrt{${D0}}} = \frac{\sqrt{${N0}}}{${dsq}}`];
      if (sp.out > 1) {
        const mid = R`\frac{${sp.out}\sqrt{${sp.in}}}{${dsq}}`;
        lines.push(R`= \frac{\sqrt{${sp.out}^{2} \times ${sp.in}}}{${dsq}} = ${mid}` + tail(mid));
      }
      return lines;
    }
    const ND = N0 * D0, sp2 = U.sqrtSimplify(Number(ND));   // 一般: 分子・分母に √D をかけて有理化
    const lines2 = [R`\sqrt{\frac{${N0}}{${D0}}} = \frac{\sqrt{${N0} \times ${D0}}}{${D0}} = \frac{\sqrt{${ND}}}{${D0}}`];
    if (sp2.out > 1) {
      const mid2 = R`\frac{${sp2.out}\sqrt{${sp2.in}}}{${D0}}`;
      lines2.push(R`= \frac{\sqrt{${sp2.out}^{2} \times ${sp2.in}}}{${D0}} = ${mid2}` + tail(mid2));
    }
    return lines2;
  }

  // 入力値（Number）→ 有理数
  function toFr(v, label) {
    const q = JK.Q.from(v);
    if (!q || q.d > 1000) throw CE(label + 'は、小数第 3 位まで（または分母 1000 以下の分数）で入力してください');
    if (Math.abs(q.val()) > 1000000) throw CE(label + 'の絶対値は 1000000 以下にしてください');
    return fr(q.n, q.d);
  }

  /* ================= TeX 組み立て ================= */

  // a + b + c（長いときは途中を ⋯ で省略）
  function sumTex(arr, maxTerms) {
    maxTerms = maxTerms || 10;
    const t = (x, i) => (i === 0 ? tex(x) : ' + ' + paren(x));
    if (arr.length <= maxTerms) return arr.map(t).join('');
    return arr.slice(0, maxTerms - 2).map(t).join('') + R` + \cdots + ` + paren(arr[arr.length - 1]);
  }
  // 数の並び（1 行 per 個ずつ、行を分ける）
  function chunkLines(prefix, items, per) {
    per = per || 10;
    const out = [];
    for (let i = 0; i < items.length; i += per) {
      out.push((i === 0 ? prefix : R`\quad `) + items.slice(i, i + per).join(R`,\ `) + (i + per < items.length ? ',' : ''));
    }
    return out;
  }

  /* ================= 図・表（SVG） ================= */

  function textW(s) {
    let w = 0;
    for (const ch of String(s)) w += ch.charCodeAt(0) > 0x2E7F ? 12 : 7;
    return w;
  }
  function niceStep(span, n) {
    const raw = span / n;
    if (!(raw > 0) || !isFinite(raw)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const m = raw / p;
    return (m < 1.5 ? 1 : (m < 3.5 ? 2 : (m < 7.5 ? 5 : 10))) * p;
  }
  const fmtN = (x) => U.fmt(x, 4).replace(/-/g, '−');

  // 表: head（見出し行）/ rows / foot（合計行・任意）。すべて文字列
  function tableSvg(head, rows, foot) {
    const all = [head].concat(rows, foot ? [foot] : []);
    const nc = head.length, rh = 22, pad = 9;
    const cw = [];
    for (let j = 0; j < nc; j++) cw.push(Math.max.apply(null, all.map((r) => textW(r[j]))) + pad * 2);
    const W = cw.reduce((s, x) => s + x, 0) + 2, H = rh * all.length + 2;
    const d = JK.plot.draw(Math.ceil(W), H);
    d.rect(1, 1, W - 2, rh, { cls: 'dim', fill: 'f1', w: 1 });
    d.rect(1, 1, W - 2, H - 2, { cls: 'dim', w: 1 });
    let y = 1;
    for (let i = 0; i < all.length; i++) {
      if (i > 0) d.line(1, y, W - 1, y, { cls: 'dim', w: (i === 1 || (foot && i === all.length - 1)) ? 1.4 : 0.6 });
      let x = 1;
      for (let j = 0; j < nc; j++) {
        d.text(x + cw[j] / 2, y + rh / 2 + 4, all[i][j], { size: 12, bold: i === 0 || !!(foot && i === all.length - 1) });
        x += cw[j];
      }
      y += rh;
    }
    let x = 1;
    for (let j = 0; j < nc - 1; j++) { x += cw[j]; d.line(x, 1, x, H - 1, { cls: 'dim', w: 0.6 }); }
    return d.svg();
  }

  // 箱ひげ図（st: 最小・Q1・中央値・Q3・最大・平均 の Number）
  function boxplotSvg(st) {
    const W = 360, L = 24, Rr = 336;
    let lo = st.min, hi = st.max;
    const pad = hi > lo ? (hi - lo) * 0.08 : 1;
    lo -= pad; hi += pad;
    const X = (x) => L + (x - lo) / (hi - lo) * (Rr - L);
    const items = [
      { x: X(st.min), t: '最小値 ' + fmtN(st.min) },
      { x: X(st.q1), t: 'Q₁ ' + fmtN(st.q1) },
      { x: X(st.med), t: '中央値 ' + fmtN(st.med) },
      { x: X(st.q3), t: 'Q₃ ' + fmtN(st.q3) },
      { x: X(st.max), t: '最大値 ' + fmtN(st.max) }
    ];
    const rows = [];
    items.forEach((it) => {
      it.w = textW(it.t) * 0.92 + 8;
      let r = 0;
      for (;; r++) {
        const row = rows[r] || (rows[r] = []);
        if (row.every((o) => Math.abs(o.x - it.x) >= (o.w + it.w) / 2)) { row.push(it); break; }
      }
      it.row = r;
    });
    const nr = rows.length, top = 10 + nr * 15, bh = 34, ym = top + bh / 2;
    const axisY = top + bh + 26, H = axisY + 24;
    const d = JK.plot.draw(W, H);
    // 軸と目盛り
    d.line(L - 6, axisY, Rr + 6, axisY, { cls: 'dim', w: 1.2 });
    const step = niceStep(hi - lo, 6);
    for (let i = Math.ceil(lo / step); i * step <= hi + 1e-9; i++) {
      const xx = X(i * step);
      d.line(xx, axisY, xx, axisY + 4, { cls: 'dim', w: 1 });
      d.text(xx, axisY + 16, fmtN(i * step), { cls: 'dim', size: 10 });
    }
    // ひげ・箱・中央値
    d.line(X(st.min), ym, X(st.q1), ym, { cls: 'fg', w: 1.8 });
    d.line(X(st.q3), ym, X(st.max), ym, { cls: 'fg', w: 1.8 });
    d.line(X(st.min), ym - 9, X(st.min), ym + 9, { cls: 'fg', w: 1.8 });
    d.line(X(st.max), ym - 9, X(st.max), ym + 9, { cls: 'fg', w: 1.8 });
    d.rect(X(st.q1), top, Math.max(0.5, X(st.q3) - X(st.q1)), bh, { cls: 'c1', fill: 'f1', w: 1.8 });
    d.line(X(st.med), top, X(st.med), top + bh, { cls: 'c3', w: 2.8 });
    // 平均
    d.dot(X(st.mean), ym, { cls: 'c2', r: 3.6 });
    d.text(X(st.mean), top + bh + 14, '● 平均 ' + fmtN(st.mean), { size: 11 });
    // 値のラベル
    items.forEach((it) => d.text(it.x, top - 8 - it.row * 15, it.t, { size: 11 }));
    return d.svg();
  }

  /* ================= ia-data-1: 1 変量データ ================= */

  // 並べ替え済み配列の中央値
  function medianOf(a) {
    const m = a.length;
    if (m % 2) return a[(m - 1) / 2];
    return fDiv(fAdd(a[m / 2 - 1], a[m / 2]), fr(2));
  }
  // 半分のデータから四分位数を求める式（1 行）と値
  function halfLine(sym, half, name) {
    const h = half.length, val = medianOf(half);
    if (h % 2) return R`${sym} = ${tex(val)}\quad (\text{${name}の ${(h + 1) / 2} 番目})`;
    return R`${sym} = \frac{${tex(half[h / 2 - 1])} + ${tex(half[h / 2])}}{2} = ${tex(val)}`;
  }

  const INTRO1 = {
    easy: R`たくさんの数値（**データ**）を、少しの数や 1 枚の図で説明するのが「データの分析」です。たとえば 10 人のテストの点数なら、次の 2 種類の数で全体の様子がつかめます。
・**代表値**（データの“中心”）… 平均値・中央値・最頻値
・**散らばりの大きさ**… 範囲・四分位範囲・分散・標準偏差
この計算機は、入力したデータについてこれらをすべて途中式つきで計算し、データを 5 つの数で表す**箱ひげ図**も描きます。`,
    normal: R`平均値・中央値・最頻値・範囲・四分位数・分散・標準偏差を求めます。四分位数は「中央値で上下に分け、それぞれの中央値」、分散は「偏差の 2 乗の平均」です。`,
    pro: R`分散は $s^{2}=\overline{x^{2}}-(\bar{x})^{2}$ が速い。共通テストでは箱ひげ図の読み取り（四分位範囲・外れ値）と、変量の変換 $y=ax+b$ による平均・分散の変化がよく出ます。`
  };

  JK.registerCalc({
    id: 'ia-data-1',
    course: 'IA',
    unit: 'm-data',
    group: 'データの分析',
    title: '1 変量データ（平均・四分位・分散）',
    desc: R`1 つの変量のデータについて、平均値・中央値・最頻値・範囲・四分位数・分散・標準偏差を求め、箱ひげ図を描きます。`,
    form: [R`\bar{x} = \frac{x_{1}+\cdots+x_{n}}{n}`, R`s^{2} = \frac{1}{n}\sum_{i=1}^{n}(x_{i}-\bar{x})^{2} = \overline{x^{2}} - (\bar{x})^{2}`],
    inputs: [
      { key: 'x', label: 'データ（カンマ区切り）', type: 'list', def: '4, 7, 5, 9, 6, 8, 5, 10, 7, 5', hint: '2〜30 個。小数・分数も入力できます（例 4, 7.5, 9）' }
    ],
    examples: [
      { label: '奇数個（平均が割り切れない）', v: { x: '3, 8, 6, 10, 5, 7, 9' } },
      { label: '最頻値が 2 つ', v: { x: '2, 3, 3, 5, 6, 6, 8, 9' } },
      { label: '外れ値あり', v: { x: '12, 15, 14, 13, 16, 15, 14, 45' } }
    ],
    intro: INTRO1,
    compute(v) {
      const raw = v.x;
      if (raw.length < 2) throw CE('データは 2 個以上入力してください');
      if (raw.length > 30) throw CE('データは 30 個以内で入力してください');
      const orig = raw.map((x) => toFr(x, 'データ'));
      const n = orig.length, N = fr(n), isOdd = n % 2 === 1;
      const s = orig.slice().sort(fCmp);
      const sum = fSum(s), mean = fDiv(sum, N);
      const med = medianOf(s);
      const mn = s[0], mx = s[n - 1], range = fSub(mx, mn);
      // 度数・最頻値
      const groups = [];
      s.forEach((x) => {
        const last = groups[groups.length - 1];
        if (last && fCmp(last.v, x) === 0) last.c++; else groups.push({ v: x, c: 1 });
      });
      const maxC = Math.max.apply(null, groups.map((g) => g.c));
      const modes = maxC >= 2 ? groups.filter((g) => g.c === maxC) : [];
      // 四分位数
      const lower = s.slice(0, Math.floor(n / 2)), upper = s.slice(Math.ceil(n / 2));
      const q1 = medianOf(lower), q3 = medianOf(upper), iqr = fSub(q3, q1);
      const q1v = fVal(q1), q3v = fVal(q3);
      // 外れ値の基準
      const fence = fMul(iqr, fr(3, 2));
      const lowF = fSub(q1, fence), highF = fAdd(q3, fence);
      const outliers = iqr.n === 0n ? [] : s.filter((x) => fCmp(x, lowF) <= 0 || fCmp(x, highF) >= 0);
      // 偏差・分散
      const devs = s.map((x) => fSub(x, mean)), sq = devs.map((d) => fMul(d, d));
      const sumDev = fSum(devs), S2 = fSum(sq), variance = fDiv(S2, N);
      const sdTex = radTex(variance), sdVal = Math.sqrt(fVal(variance));
      // 検算: 2 乗の平均 - 平均の 2 乗
      const xsq = s.map((x) => fMul(x, x)), msq = fDiv(fSum(xsq), N), var2 = fSub(msq, fMul(mean, mean));

      const steps = [];

      steps.push({
        t: 'データを小さい順に並べる',
        m: chunkLines(R`\text{もとのデータ}\quad `, orig.map(tex)).concat(chunkLines(R`\text{小さい順}\quad `, s.map(tex))),
        n: R`データの個数（大きさ）は $n = ${n}$ です。$x_{k}$ は小さい方から $k$ 番目の値を表します。`,
        easy: R`**データ**とは、調べて集めた数値の集まりです（たとえば ${n} 人のテストの点数）。中央値や四分位数は「並べたときの位置」で決まるので、まず小さい順に並べ替えます。`
      });

      steps.push({
        t: R`平均値 $\bar{x}$`,
        m: [
          R`\bar{x} = \frac{x_{1} + x_{2} + \cdots + x_{n}}{n}`,
          R`= \frac{${sumTex(s)}}{${n}}`,
          R`= ${divTo(sum, n, mean)}`
        ],
        n: R`平均値は「データの合計 ÷ データの個数」です。`,
        easy: R`**平均値**は、全部をたして個数でわった値です。「もしみんなが同じ値だったら、その値はいくつか」というイメージで、データのつり合う点（重心）にあたります。`,
        pro: R`数が大きいときは**仮平均**を使います。適当な値 $a$ を決めて $x-a$ の平均を求め、$a$ に足すと $\bar{x}=a+\overline{x-a}$ で暗算しやすくなります。`
      });

      steps.push({
        t: R`中央値（第 2 四分位数 $Q_{2}$）`,
        m: isOdd
          ? [R`n = ${n}\ \text{（奇数）}\ \Rightarrow\ Q_{2} = x_{${(n + 1) / 2}}`, R`Q_{2} = ${tex(med)}`]
          : [R`n = ${n}\ \text{（偶数）}\ \Rightarrow\ Q_{2} = \frac{x_{${n / 2}} + x_{${n / 2 + 1}}}{2}`, R`= \frac{${tex(s[n / 2 - 1])} + ${tex(s[n / 2])}}{2} = ${tex(med)}`],
        n: isOdd
          ? R`個数が奇数のときは、小さい方から $${(n + 1) / 2}$ 番目の値がちょうど真ん中にきます。`
          : R`個数が偶数のときは、真ん中の 2 つ（$${n / 2}$ 番目と $${n / 2 + 1}$ 番目）の平均が中央値です。`,
        easy: R`**中央値**は、小さい順に並べたときの真ん中の値です。平均値と違って、極端に大きい（小さい）値があっても影響を受けにくいのが特徴です。個数が偶数のときは真ん中が 2 つあるので、その平均をとります。`,
        pro: R`中央値は外れ値に強い。平均値と中央値のずれが大きいときは、分布が偏っているか外れ値がある、と読めます。`
      });

      steps.push({
        t: '度数を数える',
        m: chunkLines('', groups.map((g) => tex(g.v) + R`\ \text{が}\ ${g.c}\ \text{個}`), 5),
        n: '同じ値がいくつあるか（度数）を数えます。',
        lv: 2
      });

      steps.push({
        t: '最頻値',
        m: modes.length
          ? [R`\text{最頻値}\ =\ ${modes.map((g) => tex(g.v)).join(R`,\ `)}\quad (\text{${maxC} 個})`]
          : [R`\text{最頻値なし（どの値も 1 個ずつ）}`],
        n: modes.length
          ? R`度数がいちばん大きい値が最頻値です。` + (modes.length > 1 ? R`度数が同じで並ぶ値が複数あるときは、そのすべてが最頻値です。` : '')
          : R`すべての値が 1 個ずつなので、最頻値はありません。`,
        easy: R`**最頻値**は、データの中でいちばん多く出てくる値です（人気投票の 1 位のようなもの）。並んで 1 位の値が複数あるときは、そのすべてが最頻値です。`
      });

      steps.push({
        t: '範囲',
        m: [R`\text{範囲} = \text{最大値} - \text{最小値}`, R`= ${tex(mx)} - ${paren(mn)} = ${tex(range)}`],
        n: R`範囲（レンジ）は、データがどれだけの幅にわたっているかを表します。`,
        easy: R`**範囲**は「いちばん大きい値 − いちばん小さい値」で、データの幅です。2 つの値しか使わないので、極端な値の影響を強く受けます。`
      });

      steps.push({
        t: 'データを下半分・上半分に分ける',
        m: [
          ...chunkLines(R`\text{下半分}\quad `, lower.map(tex)),
          ...chunkLines(R`\text{上半分}\quad `, upper.map(tex))
        ],
        n: isOdd
          ? R`個数が奇数なので、真ん中の値（中央値 $${tex(med)}$）を**除いて**、前半と後半に分けます。`
          : R`個数が偶数なので、ちょうど半分ずつ（前半 ${n / 2} 個・後半 ${n / 2} 個）に分けます。`,
        lv: 2
      });

      steps.push({
        t: '四分位数と四分位範囲',
        m: [
          R`Q_{2} = ${tex(med)}`,
          halfLine('Q_{1}', lower, '下半分'),
          halfLine('Q_{3}', upper, '上半分'),
          R`\text{四分位範囲} = Q_{3} - Q_{1} = ${tex(q3)} - ${paren(q1)} = ${tex(iqr)}`
        ],
        n: R`下半分の中央値が第 1 四分位数 $Q_{1}$、上半分の中央値が第 3 四分位数 $Q_{3}$ です。四分位範囲は $Q_{3}-Q_{1}$ です。`,
        easy: R`**四分位数**は、小さい順に並べたデータを 4 等分する 3 つの境目です。
・$Q_{1}$（第 1 四分位数）… 下から 4 分の 1 のところ
・$Q_{2}$（第 2 四分位数）… 真ん中 = 中央値
・$Q_{3}$（第 3 四分位数）… 下から 4 分の 3 のところ
「中央値で上下に分けて、それぞれの中央値をとる」と覚えます。**四分位範囲** $Q_{3}-Q_{1}$ は、真ん中あたりの約半分のデータが入る幅で、極端な値の影響を受けにくい散らばりの目安です。`,
        pro: R`個数が奇数のとき、中央値そのものは上下どちらの半分にも**入れません**（教科書の定義）。箱ひげ図の箱の長さが四分位範囲です。`
      });

      steps.push({
        t: '外れ値の目安',
        m: iqr.n === 0n
          ? [R`Q_{3} - Q_{1} = 0`]
          : [
            R`Q_{1} - 1.5 \times (Q_{3}-Q_{1}) = ${tex(q1)} - 1.5 \times ${tex(iqr)} = ${tex(lowF)}`,
            R`Q_{3} + 1.5 \times (Q_{3}-Q_{1}) = ${tex(q3)} + 1.5 \times ${tex(iqr)} = ${tex(highF)}`
          ],
        n: iqr.n === 0n
          ? R`四分位範囲が $0$ なので、この基準では外れ値を判定できません。`
          : R`$${tex(lowF)}$ 以下、または $${tex(highF)}$ 以上の値が外れ値と見なされます。` +
            (outliers.length ? R`このデータでは $${outliers.map(tex).join(R`,\ `)}$ が外れ値です。` : R`このデータには外れ値はありません。`) +
            R`（外れ値の基準は 1 つではなく、ここではよく使われる「$1.5\times$ 四分位範囲」の基準で調べています。）`,
        easy: R`**外れ値**とは、他のデータから極端にはなれた値のことです。入力ミスや特別な事情で出た値のことが多く、平均値や分散を大きく動かしてしまうので、先に見つけておきます。`,
        pro: R`外れ値の基準は問題文で与えられるのがふつうです。与えられたら必ずその基準に従います。`,
        lv: 2
      });

      steps.push({
        t: '偏差の表をつくる',
        m: [
          R`\text{偏差} = x_{i} - \bar{x}\quad (\bar{x} = ${tex(mean)})`,
          R`\sum_{i=1}^{n}(x_{i}-\bar{x}) = ${n <= 8 ? sumTex(devs) + ' = ' : ''}${tex(sumDev)}`
        ],
        n: R`各データと平均値の差を**偏差**といいます。偏差をすべて足すと必ず $0$ になる（プラスとマイナスが打ち消し合う）ので、合計欄で検算できます。`,
        easy: R`**偏差**は「データ − 平均値」です。平均より大きいデータは正、小さいデータは負になります。偏差をそのまま平均すると正負が消し合って $0$ になってしまうので、散らばりを測るには**2 乗**してから平均します。`,
        fig: tableSvg(['番号', 'x', '偏差', '偏差²'], s.map((x, i) => [String(i + 1), plain(x), plain(devs[i]), plain(sq[i])]), ['計', plain(sum), plain(sumDev), plain(S2)]),
        lv: 2
      });

      steps.push({
        t: R`分散 $s^{2}$`,
        m: [
          R`s^{2} = \frac{(x_{1}-\bar{x})^{2} + (x_{2}-\bar{x})^{2} + \cdots + (x_{n}-\bar{x})^{2}}{n}`,
          ...(n <= 8 ? [R`= \frac{${devs.map((d, i) => (i ? ' + ' : '') + pw(d) + '^{2}').join('')}}{${n}}`] : []),
          R`= \frac{${sumTex(sq)}}{${n}}`,
          R`= ${divTo(S2, n, variance)}`
        ],
        n: R`分散は「**偏差の 2 乗の平均**」です。`,
        easy: R`**分散**は、データの散らばりの大きさを表す数です。各データが平均から離れているほど大きくなります。「偏差を 2 乗して（マイナスを消して）、平均する」と覚えます。`,
        pro: R`偏差の表をつくらなくても $s^{2}=\overline{x^{2}}-(\bar{x})^{2}$（2 乗の平均 − 平均の 2 乗）で求まります。次の検算の式がそのまま近道です。`
      });

      steps.push({
        t: R`標準偏差 $s$`,
        m: [
          R`s = \sqrt{s^{2}} = \sqrt{${tex(variance)}}`,
          sdTex === null
            ? R`\fallingdotseq ${U.fmt(sdVal, 4)}`
            : (isSurd(sdTex) ? R`= ${sdTex} \fallingdotseq ${U.fmt(sdVal, 4)}` : R`= ${sdTex}`)
        ],
        n: R`標準偏差は分散の正の平方根です。`,
        easy: R`分散は偏差を 2 乗しているので、単位も 2 乗（点数なら「点²」）になっています。平方根をとって元の単位（点）にもどした散らばりが**標準偏差**です。データの大半は「平均 ± 標準偏差」のあたりに集まります。`,
        pro: R`変量の変換 $y=ax+b$ では $s_{y}=|a|\,s_{x}$（$b$ は影響しない）。標準偏差の計算は最後に平方根を忘れないこと。`
      });

      // ルートを簡単にする（分母の有理化と 2 乗の因数の外出し）
      const sLines = isSurd(sdTex) ? surdLines(variance, sdTex) : null;
      if (sLines) {
        const D0 = variance.d, dsq = BigInt(Math.round(Math.sqrt(Number(D0))));
        steps.push({
          t: 'ルートを簡単にする',
          m: sLines,
          n: D0 === 1n
            ? R`ルートの中から 2 乗になっている因数を外に出します。`
            : (dsq * dsq === D0
              ? R`分母 $${D0}$ は平方数（$${dsq}^{2}$）なので、分母のルートはそのまま外れます。分子のルートは、2 乗になっている因数を外に出します。`
              : R`分母のルートをなくすため、分子・分母に $\sqrt{${D0}}$ をかけ（有理化し）、ルートの中から 2 乗の因数を外に出します。`),
          easy: R`$\sqrt{a^{2}b}=a\sqrt{b}$（2 乗になっている数はルートの外に出せる）という計算です。たとえば $\sqrt{12}=\sqrt{2^{2}\times 3}=2\sqrt{3}$。分母にルートが残るときは、分母と分子に同じルートをかけて分母を整数にします（**有理化**）。`,
          lv: 3
        });
      }

      steps.push({
        t: '検算（2 乗の平均 − 平均の 2 乗）',
        m: [
          R`\overline{x^{2}} = \frac{x_{1}^{2} + \cdots + x_{n}^{2}}{n} = \frac{${sumTex(xsq)}}{${n}} = ${divTo(fSum(xsq), n, msq)}`,
          R`s^{2} = \overline{x^{2}} - \left(\bar{x}\right)^{2} = ${tex(msq)} - \left(${tex(mean)}\right)^{2} = ${tex(msq)} - ${tex(fMul(mean, mean))} = ${tex(var2)}`
        ],
        n: fCmp(var2, variance) === 0
          ? R`偏差の表から求めた分散 $${tex(variance)}$ と一致しました。`
          : R`偏差の表から求めた分散と一致しません。入力を確認してください。`,
        easy: R`分散には、偏差を使わない別の計算方法があります。「2 乗の平均」から「平均の 2 乗」を引くだけです。2 通りの方法で同じ答えになれば、計算ミスがないと確かめられます。`,
        lv: 2
      });

      return {
        result: [
          { label: '平均値', tex: R`\bar{x} = ${texA(mean)}` },
          { label: '中央値・最頻値', tex: R`Q_{2} = ${tex(med)},\ \ \text{最頻値} = ${modes.length ? modes.map((g) => tex(g.v)).join(R`,\ `) : R`\text{なし}`}` },
          { label: '四分位数・範囲', tex: R`Q_{1} = ${tex(q1)},\ \ Q_{3} = ${tex(q3)},\ \ \text{四分位範囲} = ${tex(iqr)},\ \ \text{範囲} = ${tex(range)}` },
          { label: '分散', tex: R`s^{2} = ${texA(variance)}` },
          { label: '標準偏差', tex: R`s = ` + (sdTex === null ? U.fmt(sdVal, 4) : (isSurd(sdTex) ? sdTex + R` \fallingdotseq ` + U.fmt(sdVal, 4) : sdTex)) }
        ],
        steps: steps,
        fig: boxplotSvg({ min: fVal(mn), q1: q1v, med: fVal(med), q3: q3v, max: fVal(mx), mean: fVal(mean) })
      };
    }
  });

  /* ================= ia-data-2: 2 変量データ ================= */

  const INTRO2 = {
    easy: R`1 人（1 個）につき 2 つの値を調べたデータを**2 変量データ**といいます。たとえば「数学の点数 $x$ と英語の点数 $y$」の組です。点 $(x,\ y)$ を並べた図を**散布図**といいます。
$x$ が大きいほど $y$ も大きい傾向があれば**正の相関**、$x$ が大きいほど $y$ が小さい傾向があれば**負の相関**、はっきりした傾向がなければ**相関がない**といいます。その傾向の強さを $-1$ から $1$ までの 1 つの数で表したものが**相関係数** $r$ です。`,
    normal: R`平均 → 偏差の積 → 共分散 $s_{xy}$ → 標準偏差 $s_{x},\,s_{y}$ → 相関係数 $r=\dfrac{s_{xy}}{s_{x}s_{y}}$ の順に求めます。$-1\le r\le 1$ で、$|r|$ が 1 に近いほど直線的な関係が強い。`,
    pro: R`$r=\dfrac{\sum (x-\bar{x})(y-\bar{y})}{\sqrt{\sum (x-\bar{x})^{2}\sum (y-\bar{y})^{2}}}$ なら $n$ で割る手間が省けます。相関は「因果関係」ではないことにも注意（共通テスト頻出）。`
  };

  function judge(r2, rVal, sign) {
    const a = Math.abs(rVal);
    if (r2.n === r2.d) return sign > 0 ? '完全な正の相関（すべての点が右上がりの直線上）' : '完全な負の相関（すべての点が右下がりの直線上）';
    const k = sign > 0 ? '正' : '負';
    if (a >= 0.7) return '強い' + k + 'の相関がある';
    if (a >= 0.4) return 'やや強い' + k + 'の相関がある';
    if (a >= 0.2) return '弱い' + k + 'の相関がある';
    return 'ほとんど相関がない';
  }

  JK.registerCalc({
    id: 'ia-data-2',
    course: 'IA',
    unit: 'm-data',
    group: 'データの分析',
    title: '2 変量データ（共分散・相関係数）',
    desc: R`2 つの変量 $x,\ y$ のデータから、共分散・標準偏差・相関係数を求め、散布図を描いて相関の強さを判定します。`,
    form: [R`s_{xy} = \frac{1}{n}\sum_{i=1}^{n}(x_{i}-\bar{x})(y_{i}-\bar{y})`, R`r = \frac{s_{xy}}{s_{x}\,s_{y}}`],
    inputs: [
      { key: 'x', label: R`$x$ のデータ`, type: 'list', def: '2, 4, 5, 7, 7', hint: 'カンマ区切り。x と y は同じ個数にします（2〜30 組）' },
      { key: 'y', label: R`$y$ のデータ`, type: 'list', def: '3, 5, 4, 8, 10', hint: R`$x$ の $i$ 番目に対応する $y$ の値を、同じ順序で入力します` }
    ],
    examples: [
      { label: '強い正の相関', v: { x: '2, 4, 5, 7, 7', y: '3, 5, 4, 8, 10' } },
      { label: '負の相関', v: { x: '1, 2, 3, 4, 5', y: '9, 7, 6, 4, 2' } },
      { label: 'ほぼ無相関', v: { x: '1, 2, 3, 4, 5, 6', y: '4, 2, 5, 3, 6, 3' } },
      { label: '完全な正の相関', v: { x: '1, 2, 3', y: '2, 4, 6' } }
    ],
    intro: INTRO2,
    compute(v) {
      const rx = v.x, ry = v.y;
      if (rx.length !== ry.length) throw CE('x と y のデータの個数が違います（x: ' + rx.length + ' 個, y: ' + ry.length + ' 個）。同じ個数にそろえてください');
      if (rx.length < 2) throw CE('データは 2 組以上入力してください');
      if (rx.length > 30) throw CE('データは 30 組以内で入力してください');
      const xs = rx.map((x) => toFr(x, 'x のデータ')), ys = ry.map((y) => toFr(y, 'y のデータ'));
      const n = xs.length, N = fr(n);
      const mx = fDiv(fSum(xs), N), my = fDiv(fSum(ys), N);
      const dx = xs.map((x) => fSub(x, mx)), dy = ys.map((y) => fSub(y, my));
      const pr = dx.map((d, i) => fMul(d, dy[i])), dx2 = dx.map((d) => fMul(d, d)), dy2 = dy.map((d) => fMul(d, d));
      const Sxy = fSum(pr), Sxx = fSum(dx2), Syy = fSum(dy2);
      if (Sxx.n === 0n) throw CE('x の値がすべて同じなので、相関係数は求められません（x の分散が 0 です）');
      if (Syy.n === 0n) throw CE('y の値がすべて同じなので、相関係数は求められません（y の分散が 0 です）');
      const cov = fDiv(Sxy, N), vx = fDiv(Sxx, N), vy = fDiv(Syy, N);
      const sdxT = radTex(vx), sdyT = radTex(vy);
      const sdx = Math.sqrt(fVal(vx)), sdy = Math.sqrt(fVal(vy));
      const sign = fSign(Sxy);
      const r2 = fDiv(fMul(Sxy, Sxy), fMul(Sxx, Syy));          // r の 2 乗（厳密）
      const rVal = sign * Math.sqrt(fVal(r2));
      const r2T = radTex(r2);
      const rExact = sign === 0 ? '0' : (r2T === null ? null : (sign < 0 ? '-' : '') + r2T);
      const rShow = rExact === null ? U.fmt(rVal, 4) : (isSurd(rExact) ? rExact + R` \fallingdotseq ` + U.fmt(rVal, 4) : rExact);
      const verdict = judge(r2, rVal, sign);
      const sdShow = (t, val) => (t === null ? U.fmt(val, 4) : (isSurd(t) ? t + R` \fallingdotseq ` + U.fmt(val, 4) : t));
      // 検算: xy の平均 - 平均の積
      const mxy = fDiv(fSum(xs.map((x, i) => fMul(x, ys[i]))), N), cov2 = fSub(mxy, fMul(mx, my));

      const steps = [];

      steps.push({
        t: R`平均 $\bar{x},\ \bar{y}$`,
        m: [
          R`\bar{x} = \frac{x_{1}+\cdots+x_{n}}{n} = \frac{${sumTex(xs)}}{${n}} = ${divTo(fSum(xs), n, mx)}`,
          R`\bar{y} = \frac{y_{1}+\cdots+y_{n}}{n} = \frac{${sumTex(ys)}}{${n}} = ${divTo(fSum(ys), n, my)}`
        ],
        n: R`$x$ と $y$ のそれぞれについて平均値を求めます。データは $n = ${n}$ 組です。`,
        easy: R`**2 変量データ**は「1 人につき 2 つの値」の組（たとえば数学と英語の点数）です。まず $x$ と $y$ をそれぞれ別々に、合計 ÷ 個数で平均します。散布図で言えば、点の集まりの真ん中（**平均点** $(\bar{x},\ \bar{y})$）を探す作業です。`
      });

      steps.push({
        t: '偏差と偏差の積の表をつくる',
        m: [
          R`\text{偏差}:\quad x_{i}-\bar{x},\quad y_{i}-\bar{y}`,
          R`\text{偏差の積}:\quad (x_{i}-\bar{x})(y_{i}-\bar{y})`
        ],
        n: R`各データの平均からのずれ（偏差）と、$x$ と $y$ の偏差の**積**を表にまとめます。偏差の積の合計が共分散のもとになります。`,
        easy: R`散布図に平均点を中心とした縦線・横線を引くと、平面が 4 つの区画に分かれます。右上と左下の区画にある点では、偏差の積が**正**（$x,\,y$ がともに平均より大きい、またはともに小さい）。左上と右下の区画では**負**になります。正の相関のデータは右上・左下に点が多いので、積の合計が正になります。`,
        fig: tableSvg(
          ['x', 'y', 'x偏差', 'y偏差', '偏差積', 'x偏差²', 'y偏差²'],
          xs.map((x, i) => [plain(x), plain(ys[i]), plain(dx[i]), plain(dy[i]), plain(pr[i]), plain(dx2[i]), plain(dy2[i])]),
          ['計', '', plain(fSum(dx)), plain(fSum(dy)), plain(Sxy), plain(Sxx), plain(Syy)]
        ),
        lv: 2
      });

      steps.push({
        t: R`共分散 $s_{xy}$`,
        m: [
          R`s_{xy} = \frac{1}{n}\sum_{i=1}^{n}(x_{i}-\bar{x})(y_{i}-\bar{y})`,
          R`= \frac{${sumTex(pr)}}{${n}}`,
          R`= ${divTo(Sxy, n, cov)}`
        ],
        n: R`共分散は「**偏差の積の平均**」です。正なら正の相関、負なら負の相関の向きを表します。`,
        easy: R`**共分散**は、$x$ と $y$ が「一緒に動く度合い」を表す数です。$x$ が平均より大きいとき $y$ も平均より大きい傾向があれば、偏差の積が正のものが多くなり、共分散は正になります。反対向きに動くなら負になります。`,
        pro: R`共分散は $s_{xy}=\overline{xy}-\bar{x}\,\bar{y}$ でも求まる（分散の公式と同じ形）。`
      });

      steps.push({
        t: R`標準偏差 $s_{x},\ s_{y}$`,
        m: [
          R`s_{x}^{2} = \frac{\sum (x_{i}-\bar{x})^{2}}{n} = ${divTo(Sxx, n, vx)}`,
          R`s_{x} = \sqrt{${tex(vx)}} = ${sdShow(sdxT, sdx)}`,
          R`s_{y}^{2} = \frac{\sum (y_{i}-\bar{y})^{2}}{n} = ${divTo(Syy, n, vy)}`,
          R`s_{y} = \sqrt{${tex(vy)}} = ${sdShow(sdyT, sdy)}`
        ],
        n: R`分散は偏差の 2 乗の平均、標準偏差はその平方根です（1 変量のときと同じ）。`,
        easy: R`$x$ と $y$ のそれぞれの散らばりの大きさです。相関係数では、共分散を「$x$ の散らばり × $y$ の散らばり」でわって、単位や目盛りの大きさに左右されない数にします。`
      });

      steps.push({
        t: R`相関係数 $r$`,
        m: [
          R`r = \frac{s_{xy}}{s_{x}\,s_{y}}`,
          R`= \frac{${tex(cov)}}{\sqrt{${tex(vx)}} \times \sqrt{${tex(vy)}}} = \frac{${tex(cov)}}{\sqrt{${tex(fMul(vx, vy))}}}`,
          R`r = ${rShow}`
        ],
        n: R`$\sqrt{${tex(vx)}}\times\sqrt{${tex(vy)}}=\sqrt{${tex(fMul(vx, vy))}}$ とまとめて計算しています。相関係数は必ず $-1 \le r \le 1$ になります。`,
        easy: R`**相関係数** $r$ は、散布図の点が直線にどれくらい近く並んでいるかを $-1$ から $1$ で表した数です。
・$r$ が $1$ に近い … 右上がりの直線に近い（強い正の相関）
・$r$ が $-1$ に近い … 右下がりの直線に近い（強い負の相関）
・$r$ が $0$ に近い … 直線的な関係がない（相関がない）`,
        pro: R`$r=\dfrac{\sum (x_{i}-\bar{x})(y_{i}-\bar{y})}{\sqrt{\sum (x_{i}-\bar{x})^{2}\,\sum (y_{i}-\bar{y})^{2}}}=\dfrac{${tex(Sxy)}}{\sqrt{${tex(Sxx)}\times ${tex(Syy)}}}$。$n$ で割る手間が省けて、計算の見通しがよくなります。`
      });

      // 偏差の和がすべて整数のとき: r の値を整数の計算だけで簡単にする過程
      if (sign !== 0 && rExact !== null && isSurd(rExact) && Sxy.d === 1n && Sxx.d === 1n && Syy.d === 1n && Sxx.n * Syy.n <= 10000000000000n) {
        const P = Sxx.n * Syy.n, sp = U.sqrtSimplify(Number(P)), sg = sign < 0 ? '-' : '', aS = sign < 0 ? -Sxy.n : Sxy.n;
        const lines = [R`r = \frac{S_{xy}}{\sqrt{S_{xx}\,S_{yy}}} = ${sg}\frac{${aS}}{\sqrt{${Sxx.n} \times ${Syy.n}}} = ${sg}\frac{${aS}}{\sqrt{${P}}}`];
        if (sp.out > 1) lines.push(R`= ${sg}\frac{${aS}}{\sqrt{${sp.out}^{2} \times ${sp.in}}} = ${sg}\frac{${aS}}{${sp.out}\sqrt{${sp.in}}}`);
        lines.push(R`= ${sg}\frac{${aS}\sqrt{${sp.in}}}{${sp.out} \times ${sp.in}} = ${rExact}`);
        steps.push({
          t: R`相関係数の値を簡単にする`,
          m: lines,
          n: R`$S_{xy},\,S_{xx},\,S_{yy}$ は偏差の積・2 乗の**合計**（$S_{xy}=\sum (x_{i}-\bar{x})(y_{i}-\bar{y})$ など）です。$s_{xy},\,s_{x}^{2},\,s_{y}^{2}$ は、これらを $n$ でわったものなので、$r$ の式の分子と分母の $n$ が約分されます。ルートの中から 2 乗の因数を外に出し、分母を有理化します。`,
          easy: R`分母にルートが残ったままだと値の大きさがつかみにくいので、分母と分子に同じルートをかけて分母を整数にします（**有理化**）。たとえば $\dfrac{1}{\sqrt{2}}=\dfrac{\sqrt{2}}{2}$ です。`,
          lv: 3
        });
      }

      steps.push({
        t: '相関の強さを判定する',
        m: [R`r \fallingdotseq ${U.fmt(rVal, 3)}\ \Rightarrow\ \text{${verdict}}`],
        n: R`目安は $|r|$ が $0.7$ 以上で強い、$0.4$ 以上でやや強い、$0.2$ 以上で弱い、それ未満でほとんど相関なし、です。`,
        easy: R`相関の強さは $|r|$（$r$ の大きさ）で、向きは $r$ の符号で決まります。ただし「相関がある」ことは「原因と結果の関係がある」こととは別です（たとえばアイスの売上と水難事故の件数は、どちらも気温の影響で同時に増えます）。`,
        pro: R`相関係数は直線的な関係しか測れません。外れ値 1 つで大きく変わることもあります。`
      });

      steps.push({
        t: '検算（共分散の別の式）',
        m: [
          R`\overline{xy} = \frac{${sumTex(xs.map((x, i) => fMul(x, ys[i])))}}{${n}} = ${divTo(fSum(xs.map((x, i) => fMul(x, ys[i]))), n, mxy)}`,
          R`s_{xy} = \overline{xy} - \bar{x}\,\bar{y} = ${tex(mxy)} - ${paren(mx)} \times ${paren(my)} = ${tex(cov2)}`
        ],
        n: fCmp(cov2, cov) === 0 ? R`偏差の積の平均から求めた共分散 $${tex(cov)}$ と一致しました。` : R`偏差の積の平均と一致しません。入力を確認してください。`,
        easy: R`共分散にも「$xy$ の平均 − $x$ の平均 × $y$ の平均」という別の計算方法があります。2 通りで同じ答えになれば安心です。`,
        lv: 2
      });

      const xv = xs.map(fVal), yv = ys.map(fVal);
      const bx = Math.min.apply(null, xv), tx = Math.max.apply(null, xv), by = Math.min.apply(null, yv), ty = Math.max.apply(null, yv);
      const px = (tx - bx) * 0.15 || 1, py = (ty - by) * 0.15 || 1;
      const fig = JK.plot.graph({
        w: 340, h: 260,
        x: [bx - px, tx + px], y: [by - py, ty + py],
        points: xv.map((x, i) => ({ x: x, y: yv[i], cls: 'c1' })).concat([{ x: fVal(mx), y: fVal(my), cls: 'c3', label: '平均点', pos: 'tr' }]),
        vlines: [{ x: fVal(mx) }], hlines: [{ y: fVal(my) }],
        axis: ['x', 'y']
      });

      return {
        result: [
          { label: '平均', tex: R`\bar{x} = ${texA(mx)},\ \ \bar{y} = ${texA(my)}` },
          { label: '共分散', tex: R`s_{xy} = ${texA(cov)}` },
          { label: 'x の標準偏差', tex: R`s_{x} = ${sdShow(sdxT, sdx)}` },
          { label: 'y の標準偏差', tex: R`s_{y} = ${sdShow(sdyT, sdy)}` },
          { label: '相関係数（' + verdict + '）', tex: R`r = ${rShow}` }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= ia-data-transform: 変量の変換 ================= */

  function bandsSvg(mX, sX, mY, sY) {
    // 同じ数直線上に、x の「平均 ± 標準偏差」と y の「平均 ± 標準偏差」を並べる
    const W = 360, H = 150, L = 24, Rr = 336;
    let lo = Math.min(mX - 1.6 * sX, mY - 1.6 * sY), hi = Math.max(mX + 1.6 * sX, mY + 1.6 * sY);
    if (!(hi - lo > 1e-9)) { lo = Math.min(mX, mY) - 1; hi = Math.max(mX, mY) + 1; }
    const X = (x) => L + (x - lo) / (hi - lo) * (Rr - L);
    const d = JK.plot.draw(W, H);
    const axisY = 112;
    d.line(L - 6, axisY, Rr + 6, axisY, { cls: 'dim', w: 1.2 });
    const step = niceStep(hi - lo, 6);
    for (let i = Math.ceil(lo / step); i * step <= hi + 1e-9; i++) {
      const xx = X(i * step);
      d.line(xx, axisY, xx, axisY + 4, { cls: 'dim', w: 1 });
      d.text(xx, axisY + 16, fmtN(i * step), { cls: 'dim', size: 10 });
    }
    const row = (m, s, y, cls, fill, name) => {
      d.line(X(m - s), y, X(m + s), y, { cls: cls, w: 5 });
      d.line(X(m - s), y - 8, X(m - s), y + 8, { cls: cls, w: 1.6 });
      d.line(X(m + s), y - 8, X(m + s), y + 8, { cls: cls, w: 1.6 });
      d.dot(X(m), y, { cls: 'fg', r: 4 });
      d.line(X(m), y + 8, X(m), axisY, { cls: 'dim', w: 0.8, dash: true });
      d.text(X(m), y - 12, name + ' 平均 ' + fmtN(m) + '（± ' + fmtN(s) + '）', { size: 11 });
    };
    row(mX, sX, 34, 'c1', 'f1', 'x');
    row(mY, sY, 80, 'c3', 'f3', 'y');
    return d.svg();
  }

  JK.registerCalc({
    id: 'ia-data-transform',
    course: 'IA',
    unit: 'm-data',
    group: 'データの分析',
    title: '変量の変換（y = ax + b）',
    desc: R`変量 $x$ を $y=ax+b$ に変換したとき、平均・分散・標準偏差がどう変わるかを求めます。`,
    form: [R`\bar{y} = a\bar{x} + b`, R`s_{y}^{2} = a^{2}s_{x}^{2}`, R`s_{y} = |a|\,s_{x}`],
    inputs: [
      { key: 'mean', label: R`$x$ の平均 $\bar{x}$`, type: 'q', def: '60', min: -1000000, max: 1000000 },
      { key: 'given', label: 'ばらつきの与え方', type: 'select', def: 'var', options: [['var', R`分散 $s_{x}^{2}$ を入力`], ['sd', R`標準偏差 $s_{x}$ を入力`]] },
      { key: 'spread', label: R`$s_{x}^{2}$（または $s_{x}$）の値`, type: 'q', def: '25', min: 0, max: 1000000, hint: '上で選んだ方（分散か標準偏差）の値を入力します' },
      { key: 'a', label: R`$a$`, type: 'q', def: '2', min: -1000, max: 1000 },
      { key: 'b', label: R`$b$`, type: 'q', def: '-5', min: -1000000, max: 1000000 }
    ],
    examples: [
      { label: '偏差値に変換', v: { mean: '60', given: 'sd', spread: '8', a: '5/4', b: '-25' } },
      { label: '摂氏 → 華氏', v: { mean: '20', given: 'var', spread: '25', a: '9/5', b: '32' } },
      { label: 'ずらすだけ（a = 1）', v: { mean: '50', given: 'sd', spread: '12', a: '1', b: '10' } },
      { label: '符号を反転（a = -1）', v: { mean: '5', given: 'var', spread: '4', a: '-1', b: '0' } }
    ],
    intro: {
      easy: R`データのすべての値を「**$a$ 倍して $b$ を足す**」と変換すること（$y=ax+b$）を**変量の変換**といいます。たとえば気温を摂氏から華氏に直す（$y=1.8x+32$）、テストの点数を偏差値に直す、などです。
このとき、データの**真ん中（平均）**は同じように動き、**散らばりの大きさ**は「$a$ 倍する部分」だけが効いて「$b$ を足す部分」は無関係になります。全員の点数に 10 点足しても、点数の“開き”は変わらないからです。`,
      normal: R`$\bar{y}=a\bar{x}+b$、$s_{y}^{2}=a^{2}s_{x}^{2}$、$s_{y}=|a|s_{x}$。分散は $a$ の **2 乗**倍、標準偏差は $|a|$ 倍で、$b$ は平均だけに影響します。`,
      pro: R`偏差値 $T=\dfrac{10(x-\bar{x})}{s_{x}}+50$ は $a=\dfrac{10}{s_{x}},\ b=50-\dfrac{10\bar{x}}{s_{x}}$ の変換で、平均 $50$・標準偏差 $10$ になる。`
    },
    compute(v) {
      const mean = fromQ(v.mean), a = fromQ(v.a), b = fromQ(v.b);
      const sp = fromQ(v.spread);
      if (fSign(sp) < 0) throw CE((v.given === 'sd' ? '標準偏差' : '分散') + 'は 0 以上で入力してください');
      const isSd = v.given === 'sd';
      const vx = isSd ? fMul(sp, sp) : sp;
      const sxT = isSd ? tex(sp) : (radTex(vx) || R`\sqrt{${tex(vx)}}`);
      const sxVal = Math.sqrt(fVal(vx));
      const my = fAdd(fMul(a, mean), b);
      const a2 = fMul(a, a), vy = fMul(a2, vx);
      const absA = fSign(a) < 0 ? fNeg(a) : a;
      const syT = radTex(vy), syVal = Math.sqrt(fVal(vy));
      const aStr = paren(a);

      const steps = [];
      steps.push({
        t: '変換の式を確認する',
        m: [R`y = ax + b\quad (a = ${tex(a)},\ b = ${tex(b)})`, R`\bar{x} = ${tex(mean)},\quad s_{x}^{2} = ${tex(vx)}` + (isSd ? R`\quad (s_{x} = ${tex(sp)})` : '')],
        n: R`$x$ のすべての値を $a$ 倍して $b$ を足したものが $y$ です。もとの $x$ の平均・分散から、$y$ の平均・分散を求めます。`,
        easy: R`たとえば全員の点数を **2 倍して 5 点引く**なら $a=2,\ b=-5$ です。データを 1 つ 1 つ変換し直さなくても、**平均と分散の値だけ**から、変換後の平均・分散・標準偏差を計算できます。` +
          (isSd ? R`（ここでは標準偏差が与えられたので、2 乗して分散 $s_{x}^{2}$ にもどして使います。）` : '')
      });

      steps.push({
        t: R`平均 $\bar{y}$`,
        m: [R`\bar{y} = a\bar{x} + b`, R`= ${aStr} \times ${paren(mean)} + ${paren(b)}`, R`= ${tex(fMul(a, mean))} ${U.signed(v.b)} = ${tex(my)}`],
        n: R`平均は、各データと同じ変換 $a\bar{x}+b$ をしたものになります。`,
        easy: R`全員を同じように 2 倍して 5 を引けば、平均も同じように 2 倍して 5 を引いた値になります。「真ん中」は変換といっしょに動くのです。`,
        pro: R`平均値の線形性。$E(aX+b)=aE(X)+b$ と同じ形。`
      });

      steps.push({
        t: '平均の変換が成り立つ理由',
        m: [R`\bar{y} = \frac{(ax_{1}+b)+\cdots+(ax_{n}+b)}{n} = \frac{a(x_{1}+\cdots+x_{n}) + nb}{n} = a\bar{x} + b`],
        n: R`$y$ の合計を計算して $n$ でわると、$\bar{y}=a\bar{x}+b$ になります。`,
        lv: 3
      });

      steps.push({
        t: R`分散 $s_{y}^{2}$`,
        m: [R`s_{y}^{2} = a^{2}\,s_{x}^{2}`, R`= ${pw(a)}^{2} \times ${tex(vx)} = ${tex(a2)} \times ${tex(vx)} = ${tex(vy)}`],
        n: R`分散には $a$ が **2 乗**で効きます。$b$ は分散に影響しません（式に現れません）。`,
        easy: R`全員に 5 を足しても、みんな同じだけ動くので**お互いの開きは変わりません**（$b$ は無関係）。一方、全員を 2 倍すると開きも 2 倍になります。分散は「開きの 2 乗」の平均なので、$2^{2}=4$ 倍になります。`,
        pro: R`$a$ の符号は分散に関係しない（$a^{2}$）。$a=-1$（符号反転）では分散は不変。`
      });

      steps.push({
        t: '分散の変換が成り立つ理由',
        m: [
          R`y_{i}-\bar{y} = (ax_{i}+b)-(a\bar{x}+b) = a(x_{i}-\bar{x})`,
          R`s_{y}^{2} = \frac{\sum \left\{a(x_{i}-\bar{x})\right\}^{2}}{n} = a^{2}\cdot\frac{\sum (x_{i}-\bar{x})^{2}}{n} = a^{2}s_{x}^{2}`
        ],
        n: R`$b$ は偏差を計算するときに引き算で消えてしまい、偏差だけが $a$ 倍になります。`,
        lv: 3
      });

      steps.push({
        t: R`標準偏差 $s_{y}$`,
        m: [
          R`s_{y} = |a|\,s_{x} = ${tex(absA)} \times ${sxT}`,
          R`= ${syT === null ? U.fmt(syVal, 4) : syT}` + (isSurd(syT) ? R` \fallingdotseq ${U.fmt(syVal, 4)}` : '')
        ],
        n: R`標準偏差は分散の平方根なので、$\sqrt{a^{2}s_{x}^{2}}=|a|\,s_{x}$（**絶対値**をつけて $|a|$ 倍）です。`,
        easy: R`標準偏差は「元のデータと同じ単位の開き」なので、データを $a$ 倍すれば同じ $|a|$ 倍になります。$a$ が負（符号を反転）でも、開きの大きさは負にならないので**絶対値**をつけます。`,
        pro: R`$s_{y}=\sqrt{s_{y}^{2}}=\sqrt{${tex(vy)}}$ と直接求めてもよい（検算）。`
      });

      steps.push({
        t: '偏差値への応用',
        m: [R`T = \frac{10(x-\bar{x})}{s_{x}} + 50 \;\Longrightarrow\; a = \frac{10}{s_{x}},\quad b = 50 - \frac{10\bar{x}}{s_{x}}`, R`\bar{T} = 50,\quad s_{T} = |a|\,s_{x} = \frac{10}{s_{x}} \times s_{x} = 10`],
        n: R`偏差値は、平均が $50$・標準偏差が $10$ になるように $x$ を $y=ax+b$ の形に変換したものです。`,
        easy: R`**偏差値**は、テストの平均点が 50 になり、標準偏差が 10 になるように点数をそろえ直した値です。難しいテストと易しいテストでも、偏差値なら同じ土俵で比べられます。`,
        lv: 2
      });

      return {
        result: [
          { label: '変換後の式', tex: R`y = ${JK.poly.tex([v.b, v.a], 'x')}` },
          { label: 'y の平均', tex: R`\bar{y} = ${tex(my)}` },
          { label: 'y の分散', tex: R`s_{y}^{2} = ${tex(vy)}` },
          { label: 'y の標準偏差', tex: R`s_{y} = ${syT === null ? U.fmt(syVal, 4) : syT}` + (isSurd(syT) ? R` \fallingdotseq ${U.fmt(syVal, 4)}` : '') }
        ],
        steps: steps,
        fig: bandsSvg(fVal(mean), sxVal, fVal(my), syVal)
      };
    }
  });

  function fromQ(q) { return fr(q.n, q.d); }
})();
