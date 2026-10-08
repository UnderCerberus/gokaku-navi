/* 数I・A — 場合の数・確率: 順列・組合せ / 反復試行 / 条件付き確率 / 期待値
   ※ 階乗や確率は厳密に計算する（BigInt の整数・有理数。桁あふれ・丸め誤差なし）。 */
(function () {
  'use strict';
  const R = String.raw;
  const U = JK.util;
  const CE = (msg) => new JK.CalcError(msg);

  /* ================= 厳密な有理数・整数（BigInt） ================= */

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
  const fEq = (a, b) => a.n === b.n && a.d === b.d;
  const fPow = (a, e) => fr(a.n ** BigInt(e), a.d ** BigInt(e));
  const fVal = (a) => Number(a.n) / Number(a.d);
  const fSum = (arr) => arr.reduce(fAdd, fr(0));
  const fromQ = (q) => fr(q.n, q.d);
  const ZERO = fr(0), ONE = fr(1);

  const bfact = (n) => { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; };
  const bperm = (n, r) => { let x = 1n; for (let i = 0; i < r; i++) x *= BigInt(n - i); return x; };
  function bcomb(n, r) {
    r = Math.min(r, n - r);
    let c = 1n;
    for (let i = 1; i <= r; i++) c = c * BigInt(n - r + i) / BigInt(i);
    return c;
  }
  const bprod = (arr) => arr.reduce((x, y) => x * y, 1n);

  /* ================= 表示 ================= */

  // 整数: 10 桁以上は 3 桁ごとに細い空白
  function bt(b) {
    let s = (b < 0n ? -b : b).toString();
    if (s.length >= 10) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, R`\,`);
    return (b < 0n ? '-' : '') + s;
  }
  // 有限小数で表せるなら小数の文字列、できなければ null
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
  // 分数（整数ならそのまま）
  function tex(f) {
    if (f.d === 1n) return bt(f.n);
    return (f.n < 0n ? '-' : '') + R`\frac{` + bt(f.n < 0n ? -f.n : f.n) + '}{' + bt(f.d) + '}';
  }
  const paren = (f) => (f.n < 0n ? R`\left(` + tex(f) + R`\right)` : tex(f));
  // 分数 + 近似値
  const texA = (f, k) => (f.d === 1n ? tex(f) : tex(f) + R` \fallingdotseq ` + U.fmt(fVal(f), k || 4));
  // 素のテキスト（図・表・メッセージ用）
  function plain(f) {
    const s = f.d === 1n ? f.n.toString() : f.n + '/' + f.d;
    return s.length > 11 ? '≒' + U.fmt(fVal(f), 3) : s;
  }
  // √f の厳密な TeX（f ≥ 0）。大きいときは null
  function radTex(f) {
    if (f.n * f.d > 10000000000000n) return null;
    return U.sqrtTex(JK.Q(Number(f.n), Number(f.d)));
  }
  const isSurd = (t) => t !== null && t.indexOf('\\sqrt') >= 0;

  const numJoin = (a) => a.join(R` \times `);
  // 因数の積の書き方（6 個を超えるときは途中を ⋯ で省略）
  const shownProd = (fs) => (fs.length === 0 ? '1' : (fs.length > 6 ? numJoin(fs.slice(0, 3)) + R` \times \cdots \times ` + fs[fs.length - 1] : numJoin(fs)));
  // 「prefix = a × b × c」と、左から順に掛けた途中経過（1 の因数は計算から省く）の行
  function prodLines(prefix, fs, suffix) {
    const value = bprod(fs);
    if (fs.length <= 1) return [prefix + ' = ' + bt(value)];
    const lines = [prefix + ' = ' + shownProd(fs) + (suffix || '')];
    const act = fs.filter((x) => x > 1n);
    if (act.length >= 2 && act.length <= 6) {
      let cur = act.slice();
      const parts = [];
      while (cur.length > 1) { cur = [cur[0] * cur[1]].concat(cur.slice(2)); parts.push(cur.map(bt).join(R` \times `)); }
      lines.push('= ' + parts.join(' = '));
    } else {
      lines.push('= ' + bt(value));
    }
    return lines;
  }
  // 降順の積 n(n-1)…(n-r+1) の因数（BigInt）
  const descFactors = (n, r) => { const a = []; for (let i = 0; i < r; i++) a.push(BigInt(n - i)); return a; };

  /* ================= 図（SVG） ================= */

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
  const circled = (i) => (i < 20 ? String.fromCharCode(0x2460 + i) : String(i + 1));

  // 表: head / rows / foot（すべて文字列）
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

  // 「□ × □ × □」の枠（各場所の選び方の数）
  function slotsFig(vals, caption) {
    const k = vals.length;
    const bw = Math.max(28, Math.min(46, Math.floor(300 / k) - 16)), gap = 18;
    const W = Math.max(240, k * bw + (k - 1) * gap + 30), H = 100;
    const d = JK.plot.draw(W, H);
    let x = (W - (k * bw + (k - 1) * gap)) / 2;
    for (let i = 0; i < k; i++) {
      d.text(x + bw / 2, 20, circled(i) + ' 番目', { size: 10, cls: 'dim' });
      d.rect(x, 28, bw, 38, { cls: 'c1', fill: 'f1', rx: 4, w: 1.6 });
      d.text(x + bw / 2, 52, vals[i], { size: 14, bold: true });
      if (i < k - 1) d.text(x + bw + gap / 2, 52, '×', { size: 15 });
      x += bw + gap;
    }
    d.text(W / 2, 90, caption, { size: 11, cls: 'dim' });
    return d.svg();
  }
  // n 個の枠のうち r 個を選ぶ
  function pickFig(n, r) {
    const cell = Math.min(26, Math.floor(320 / n)), W = Math.max(240, n * cell + 30), H = 92;
    const d = JK.plot.draw(W, H);
    const x0 = (W - n * cell) / 2;
    const chosen = {};
    for (let i = 0; i < r; i++) chosen[Math.floor((i + 0.5) * n / r)] = true;
    for (let i = 0; i < n; i++) {
      const on = !!chosen[i];
      d.rect(x0 + i * cell + 1, 26, cell - 2, cell + 6, { cls: on ? 'c3' : 'dim', fill: on ? 'f3' : null, rx: 3, w: on ? 1.8 : 1 });
      d.text(x0 + i * cell + cell / 2, 26 + cell / 2 + 8, String(i + 1), { size: cell < 20 ? 9 : 11, cls: on ? 'fg' : 'dim' });
    }
    d.text(W / 2, 16, n + ' 個のうち、色のついた ' + r + ' 個を選ぶ（例）', { size: 11 });
    d.text(W / 2, 80, '選ぶ順序は区別しない（どの ' + r + ' 個か、だけが大事）', { size: 11, cls: 'dim' });
    return d.svg();
  }
  // 円順列: 1 人を固定し、残りを並べる
  function circleFig(n) {
    const W = 260, H = 190, cx = 130, cy = 98, rad = 62;
    const d = JK.plot.draw(W, H);
    d.circle(cx, cy, rad, { cls: 'dim', dash: true, w: 1 });
    for (let i = 0; i < n; i++) {
      const a = (90 - 360 * i / n) * Math.PI / 180, px = cx + rad * Math.cos(a), py = cy - rad * Math.sin(a);
      d.circle(px, py, 12, { cls: i === 0 ? 'c3' : 'c1', fill: i === 0 ? 'f3' : 'f1', w: 1.6 });
      d.text(px, py + 4, String.fromCharCode(65 + i), { size: 12, bold: true });
    }
    d.text(cx, cy - 4, '1 人（A）を固定', { size: 11 });
    d.text(cx, cy + 12, '残り ' + (n - 1) + ' 人を並べる', { size: 11 });
    d.text(cx, 184, '回すと重なる並べ方は同じ', { size: 11, cls: 'dim' });
    return d.svg();
  }
  // 重複組合せ: ○ を r 個、仕切り | を n-1 本
  function barsFig(n, r) {
    const T = n + r - 1, step = Math.min(20, Math.floor(330 / T)), W = Math.max(240, T * step + 30), H = 84;
    const d = JK.plot.draw(W, H);
    const x0 = (W - T * step) / 2 + step / 2;
    const groups = [];
    for (let i = 0; i < n; i++) groups.push(Math.floor(r / n) + (i < r % n ? 1 : 0));
    let pos = 0;
    groups.forEach((g, gi) => {
      for (let b = 0; b < g; b++) { d.circle(x0 + pos * step, 38, Math.min(7, step / 2 - 1.5), { cls: 'c3', fill: 'f3', w: 1.6 }); pos++; }
      if (gi < n - 1) { d.line(x0 + pos * step, 24, x0 + pos * step, 52, { cls: 'c1', w: 2.4 }); pos++; }
    });
    d.text(W / 2, 14, '○ を ' + r + ' 個、仕切り | を ' + (n - 1) + ' 本、一列に並べる（例）', { size: 11 });
    d.text(W / 2, 74, '全部で ' + T + ' 個の位置のうち ○ の位置を ' + r + ' か所選ぶ', { size: 11, cls: 'dim' });
    return d.svg();
  }
  // 同じものを含む順列: 文字のかたまり
  function tokensFig(groups) {
    const total = groups.reduce((s, g) => s + g, 0), cell = Math.min(30, Math.floor(330 / total));
    const W = Math.max(240, total * cell + 30), H = 84;
    const d = JK.plot.draw(W, H);
    const fills = ['f1', 'f2', 'f3', 'f4'], strokes = ['c1', 'c2', 'c3', 'c4'];
    let x = (W - total * cell) / 2;
    groups.forEach((g, gi) => {
      for (let k = 0; k < g; k++) {
        d.rect(x + 1, 24, cell - 2, cell, { cls: strokes[gi % 4], fill: fills[gi % 4], rx: 4, w: 1.6 });
        d.text(x + cell / 2, 24 + cell / 2 + 4.5, String.fromCharCode(65 + gi), { size: 13, bold: true });
        x += cell;
      }
    });
    d.text(W / 2, 14, groups.map((g, i) => String.fromCharCode(65 + i) + ' が ' + g + ' 個').join('、'), { size: 11 });
    d.text(W / 2, 76, '同じ文字どうしを入れかえても、並び方は変わらない', { size: 11, cls: 'dim' });
    return d.svg();
  }

  /* ================= 組合せの計算過程（約分つき） ================= */

  // nums: 分子の因数（降順）, dens: 分母の因数 → 分母ごとの約分の記録
  function cancelRows(nums, dens) {
    const N = nums.slice(), D = dens.slice(), rows = [];
    for (let j = 0; j < D.length; j++) {
      const d0 = D[j];
      if (d0 === 1) continue;
      const notes = [];
      let d = d0;
      for (let i = 0; i < N.length && d > 1; i++) {
        const g = U.gcd(N[i], d);
        if (g > 1) { notes.push({ num: N[i], g: g, to: N[i] / g }); N[i] /= g; d /= g; }
      }
      D[j] = d;
      rows.push({ d0: d0, notes: notes, N: N.slice(), D: D.slice(j + 1).filter((x) => x > 1) });
    }
    return { rows: rows, N: N };
  }
  // 1 の因数を除く（全部 1 なら [1]）
  const noOnes = (a) => { const b = a.filter((x) => x > 1); return b.length ? b : [1]; };
  // TeX: 分子の積 / 分母の積（分母が残っていなければ積だけ）
  function fracOf(Ns, Ds) {
    const nn = numJoin(noOnes(Ns)), dd = Ds.filter((x) => x > 1);
    return dd.length ? R`\frac{` + nn + '}{' + numJoin(dd) + '}' : nn;
  }

  // C(n, r) を求める過程のステップ（n ≥ r ≥ 0）
  function combSteps(n, r) {
    const steps = [];
    const rr = Math.min(r, n - r);
    const symm = rr !== r;
    const Cn = R`\C{${n}}{${r}}`;
    if (symm) {
      steps.push({
        t: R`$r$ を小さくする（組合せの性質）`,
        m: [R`\C{n}{r} = \C{n}{n-r}`, Cn + R` = \C{${n}}{${n}-${r}} = \C{${n}}{${rr}}`],
        n: R`$${r}$ 個を選ぶことは、選ばない $${n - r}$ 個を決めることと同じなので $\C{n}{r}=\C{n}{n-r}$ です。小さい方の $${rr}$ で計算すると、掛け算の項数が減って楽になります。`,
        easy: R`たとえば ${n} 人から ${r} 人を選ぶ方法の数は、「選ばれない ${n - r} 人」を選ぶ方法の数と同じです（選ばれた人を決めれば、残りの人も自動的に決まるため）。計算が短くなるほうの数を使います。`,
        lv: 2
      });
    }
    if (rr === 0) {
      steps.push({
        t: '値を求める',
        m: [R`\C{${n}}{0} = 1`],
        n: R`$0$ 個を選ぶ（何も選ばない）方法は $1$ 通りです（$\C{n}{0}=1$、同様に $\C{n}{n}=1$）。`,
        easy: R`「何も選ばない」という選び方は 1 通りだけです。同じ理由で「全部選ぶ」も 1 通りです。`
      });
      return { steps: steps, value: 1n, expr: '1' };
    }
    const nums = []; for (let i = 0; i < rr; i++) nums.push(n - i);
    const dens = []; for (let i = rr; i >= 1; i--) dens.push(i);
    const { rows, N } = cancelRows(nums, dens);
    const value = bcomb(n, r);
    const top = numJoin(nums), bot = numJoin(dens);
    const small = rr <= 8;
    steps.push({
      t: '分子と分母に書き出す',
      m: [
        R`\C{${n}}{${rr}} = \frac{\P{${n}}{${rr}}}{${rr}!} = \frac{${small ? top : numJoin(nums.slice(0, 3)) + R` \times \cdots \times ` + nums[nums.length - 1]}}{${small ? bot : numJoin(dens.slice(0, 3)) + R` \times \cdots \times 1`}}`
      ],
      n: R`分子は $${n}$ から 1 つずつ減らして $${rr}$ 個の積、分母は $${rr}! = ${bt(bfact(rr))}$（$${rr}$ から 1 までの積）です。`,
      easy: R`$\C{n}{r}$ は「順列 $\P{n}{r}$ を、並べ替えの数 $r!$ でわったもの」です。たとえば A, B, C から 2 人を選ぶとき、順列なら AB と BA は別ですが、選ぶだけなら同じ組なので、並べ替えの数 $2!=2$ でわります。`
    });
    if (rows.length) {
      const lines = [R`\C{${n}}{${rr}} = ` + (small ? fracOf(nums, dens.filter((x) => x > 1)) : R`\frac{\cdots}{\cdots}`)];
      if (small) rows.forEach((row) => lines.push(R`= ` + fracOf(row.N, row.D)));
      steps.push({
        t: '約分する',
        m: small ? lines : [R`\text{分母の数を、分子の数と順に約分する}`],
        n: rows.map((row) => R`分母の $${row.d0}$ を、` + row.notes.map((o) => R`分子の $${o.num}$ と $${o.g}$ で約分（$${o.num}\div ${o.g}=${o.to}$）`).join('、')).join('。') + '。',
        easy: R`分数の約分と同じで、分子と分母に共通の約数があれば、同じ数でわって小さくします。先に約分すると、大きな数をかけずに済みます。`,
        lv: 2
      });
    }
    steps.push({
      t: '値を求める',
      m: [R`\C{${n}}{${r}} = ` + (symm ? R`\C{${n}}{${rr}} = ` : '') + (rows.length ? numJoin(noOnes(N)) + ' = ' : '') + bt(value)],
      n: R`$\C{${n}}{${r}} = ${bt(value)}$（通り）です。`,
      pro: R`約分しながら計算するのがコツ。$\C{n}{2}=\frac{n(n-1)}{2}$、$\C{n}{3}=\frac{n(n-1)(n-2)}{6}$ は暗算で出せるようにしておきます。`
    });
    return { steps: steps, value: value, expr: fracOf(nums, dens.filter((x) => x > 1)) };
  }

  /* ================= ia-count: 順列・組合せ ================= */

  const COUNT_MODES = [
    ['comb', '組合せ nCr'], ['perm', '順列 nPr'], ['fact', '階乗 n!'], ['cperm', '円順列'],
    ['rperm', '重複順列 n^r'], ['rcomb', '重複組合せ nHr'], ['same', '同じものを含む順列']
  ];

  JK.registerCalc({
    id: 'ia-count',
    course: 'IA',
    unit: 'm-prob',
    group: '場合の数・確率',
    title: '順列・組合せ',
    desc: R`階乗・順列・組合せ・円順列・重複順列・重複組合せ・同じものを含む順列の総数を、定義式 → 約分の過程 → 値の順に求めます。`,
    form: [R`\P{n}{r} = \frac{n!}{(n-r)!}`, R`\C{n}{r} = \frac{n!}{r!\,(n-r)!}`, R`\H{n}{r} = \C{n+r-1}{r}`],
    inputs: [
      { key: 'mode', label: '求めるもの', type: 'select', def: 'comb', options: COUNT_MODES },
      { key: 'n', label: R`$n$`, type: 'int', def: '10', min: 0, max: 30, show: (raw) => raw.mode !== 'same', hint: R`0〜30` },
      { key: 'r', label: R`$r$`, type: 'int', def: '3', min: 0, max: 30, show: (raw) => ['perm', 'comb', 'rperm', 'rcomb'].indexOf(raw.mode) >= 0, hint: R`順列・組合せは $r \le n$` },
      { key: 'groups', label: '同じものの個数（カンマ区切り）', type: 'list', def: '3, 2, 1', show: (raw) => raw.mode === 'same', hint: 'たとえば AAABBC なら 3, 2, 1（合計 30 個まで）' }
    ],
    examples: [
      { label: '10 人から 3 人選ぶ', v: { mode: 'comb', n: '10', r: '3' } },
      { label: '5 人から 3 人を並べる', v: { mode: 'perm', n: '5', r: '3' } },
      { label: '円卓に 6 人', v: { mode: 'cperm', n: '6' } },
      { label: '3 種類から 4 個（重複あり）', v: { mode: 'rcomb', n: '3', r: '4' } },
      { label: 'AAABBC の並べ方', v: { mode: 'same', groups: '3, 2, 1' } },
      { label: '8!', v: { mode: 'fact', n: '8' } }
    ],
    intro: {
      easy: R`「何通りあるか」を数える問題では、**順序を区別するかどうか**と**同じものを何度も選べるかどうか**が分かれ目です。
・**順列** $\P{n}{r}$ … $n$ 個から $r$ 個を選んで**並べる**（順序を区別する）。例: 5 人から 1 位・2 位・3 位を決める。
・**組合せ** $\C{n}{r}$ … $n$ 個から $r$ 個を**選ぶだけ**（順序は区別しない）。例: 5 人から代表 3 人を選ぶ。
・**円順列** … 円形に並べる（回して重なるものは同じ）。
・**重複順列** $n^{r}$ … 同じものを何度使ってもよい並べ方。
・**重複組合せ** $\H{n}{r}$ … 同じものを何度選んでもよい選び方。
・**同じものを含む順列** … 同じ文字を含む並べ方。
計算機は、式 → 約分の過程 → 答えを順に示します。`,
      normal: R`$\P{n}{r}=n(n-1)\cdots(n-r+1)$、$\C{n}{r}=\dfrac{\P{n}{r}}{r!}$、円順列は $(n-1)!$、重複順列は $n^{r}$、重複組合せは $\H{n}{r}=\C{n+r-1}{r}$、同じものを含む順列は $\dfrac{n!}{p!\,q!\,r!}$。`,
      pro: R`組合せは $\C{n}{r}=\C{n}{n-r}$ で小さい方に直してから約分しながら計算。重複組合せは「○と仕切り」の並べ方、円順列は 1 つを固定して $(n-1)!$、が定石です。`
    },
    compute(v) {
      const mode = v.mode;
      const n = v.n, r = v.r;
      const steps = [];
      let result, fig = null;

      if (mode === 'fact') {
        const value = bfact(n);
        const fs = []; for (let i = n; i >= 1; i--) fs.push(BigInt(i));
        steps.push({
          t: '階乗の意味',
          m: [R`n! = n \times (n-1) \times (n-2) \times \cdots \times 2 \times 1`, R`0! = 1`],
          n: R`$n!$（$n$ の階乗）は、$n$ から $1$ までの整数をすべてかけた数です。$0!=1$ と決めます。`,
          easy: R`$n!$ は「$n$ 人を 1 列に並べる並べ方の総数」です。先頭は $n$ 通り、2 番目は残りの $n-1$ 通り、…と選べるので、$n \times (n-1) \times \cdots \times 1$ になります。`,
          pro: R`階乗は急に大きくなります（$10!=3628800$）。約分できる形のまま、分子・分母の階乗を見比べて計算するのが基本です。`
        });
        steps.push({
          t: R`$${n}!$ の計算`,
          m: prodLines(R`${n}!`, fs),
          n: n <= 1 ? R`$0!$ と $1!$ はどちらも $1$ です。` : R`$${n}$ から順にかけていきます（最後の $\times 1$ は省けます）。`,
          easy: R`大きな数を一度にかけると間違えやすいので、左から順に 2 つずつかけて確かめます。`
        });
        steps.push({
          t: '階乗と順列の関係',
          m: [R`n! = \P{n}{n}`],
          n: R`$n$ 個のものをすべて 1 列に並べる並べ方（$n$ 個から $n$ 個を選んで並べる順列）が $n!$ 通りです。`,
          lv: 2
        });
        if (n >= 1 && n <= 8) fig = slotsFig(fs.map(String), n + ' 人を 1 列に並べる: 各場所の選び方を順にかける');
        result = [
          { label: '階乗の値', tex: R`${n}! = ${bt(value)}` },
          { label: '計算式', tex: shownProd(fs) }
        ];
      } else if (mode === 'perm') {
        if (r > n) throw CE('順列では r は n 以下にしてください（' + n + ' 個から ' + r + ' 個は並べられません）');
        const value = bperm(n, r), fs = descFactors(n, r);
        steps.push({
          t: '順列の意味と公式',
          m: [R`\P{n}{r} = n(n-1)(n-2)\cdots(n-r+1) = \frac{n!}{(n-r)!}`],
          n: R`異なる $n$ 個から $r$ 個を選んで**1 列に並べる**並べ方の総数が $\P{n}{r}$ です。$n$ から 1 つずつ減らして $r$ 個の積をとります。`,
          easy: R`たとえば A, B, C, D, E の 5 人から 3 人を選んで「1 位・2 位・3 位」を決める方法の数です。1 位は 5 通り、2 位は残り 4 通り、3 位は残り 3 通り選べるので、$5\times 4\times 3$ になります（**積の法則**）。順序を区別するのが順列です。`,
          pro: R`「並べる」「順位をつける」「役を割り当てる」は順列、「選ぶだけ」は組合せ。`
        });
        if (r === 0) {
          steps.push({ t: '値を求める', m: [R`\P{${n}}{0} = 1`], n: R`$0$ 個を並べる方法は $1$ 通り（何も並べない）です。` });
        } else {
          steps.push({
            t: R`$${n}$ から $${r}$ 個、掛けていく`,
            m: prodLines(R`\P{${n}}{${r}}`, fs, R`\quad (${r}\text{ 個の積})`),
            n: R`先頭が $${n}$ 通り、次が $${n - 1}$ 通り、…と、$${r}$ 個ぶんの選び方をかけます。`,
            easy: R`「何番目の場所に誰を置くか」を順に考えます。1 つ目の場所には ${n} 通り、2 つ目の場所には（1 人使ったので）${n - 1} 通り、…と選べる数が 1 つずつ減っていきます。`
          });
          const topPart = r <= 4 ? numJoin(fs) : numJoin(fs.slice(0, 2)) + R` \times \cdots \times ` + fs[fs.length - 1];
          steps.push({
            t: '階乗の式で確かめる',
            m: [R`\P{${n}}{${r}} = \frac{${n}!}{${n - r}!} = \frac{${topPart} \times ${n - r}!}{${n - r}!} = ${topPart} = ${bt(value)}`],
            n: R`$\dfrac{n!}{(n-r)!}$ は、分子の $n!$ のうち $(n-r)!$ の部分が分母と約分されて、先頭の $r$ 個の積だけが残ります。`,
            easy: R`$${n}!=${n}\times ${n - 1}\times\cdots\times 1$ のうち、後ろの $${n - r}!$ の部分は分母の $${n - r}!$ とまったく同じなので約分されます。残るのが先頭の $${r}$ 個の積です。`,
            lv: 2
          });
        }
        if (r >= 1 && r <= 8) fig = slotsFig(fs.map(String), n + ' 個から ' + r + ' 個を順に選んで並べる');
        result = [
          { label: '順列の総数', tex: R`\P{${n}}{${r}} = ${bt(value)}` },
          { label: '計算式', tex: shownProd(fs) }
        ];
      } else if (mode === 'comb') {
        if (r > n) throw CE('組合せでは r は n 以下にしてください（' + n + ' 個から ' + r + ' 個は選べません）');
        const cs = combSteps(n, r);
        const head = {
          t: '組合せの意味と公式',
          m: [R`\C{n}{r} = \frac{\P{n}{r}}{r!} = \frac{n!}{r!\,(n-r)!}`],
          n: R`異なる $n$ 個から $r$ 個を**選ぶだけ**（順序は区別しない）方法の総数が $\C{n}{r}$ です。順列 $\P{n}{r}$ を、並べ替えの数 $r!$ でわったものです。`,
          easy: R`「5 人から代表 3 人を選ぶ」のように、選ばれた**メンバーの組**だけが問題で、並べる順序は関係しない数え方です。同じ 3 人を並べ替えた $3!=6$ 通りは、1 つの組として数えるので、順列を $3!$ でわります。`,
          pro: R`$\C{n}{r}$ は「選ぶ」、$\P{n}{r}$ は「選んで並べる」。$\P{n}{r}=\C{n}{r}\times r!$ の関係も使います。`
        };
        steps.push(head);
        cs.steps.forEach((s) => steps.push(s));
        if (n >= 1 && n <= 14) fig = pickFig(n, r);
        result = [
          { label: '組合せの総数', tex: R`\C{${n}}{${r}} = ${bt(cs.value)}` },
          { label: '計算式', tex: cs.expr }
        ];
      } else if (mode === 'cperm') {
        if (n < 1) throw CE('円順列では n は 1 以上にしてください');
        const value = bfact(n - 1), fs = []; for (let i = n - 1; i >= 1; i--) fs.push(BigInt(i));
        steps.push({
          t: '円順列の考え方',
          m: [R`\text{円順列} = (n-1)!`],
          n: R`円形に並べるとき、全体を回転させて重なる並べ方は同じと考えます。そこで**特定の 1 つを固定**し、残りの $n-1$ 個を 1 列に並べる数と考えます。`,
          easy: R`円卓に座る場合、全員が 1 つずつ席をずれて座っても「座っている順番」は変わりません。そこで、まず **A さんの席を 1 か所に決めて固定**してしまいます。すると、残りの ${n - 1} 人が座る方法は、ふつうの 1 列の並べ方（$(${n}-1)!$ 通り）と同じになります。`,
          pro: R`円順列では、「向きを区別しない（数珠・ネックレス）」ときはさらに $2$ でわる（$n\ge 3$）。`
        });
        steps.push({
          t: '別の見方: 並べ方を回転ごとにまとめる',
          m: [R`\frac{n!}{n} = \frac{${bt(bfact(n))}}{${n}} = ${bt(value)}`],
          n: R`1 列に並べる $n!$ 通りのうち、回転すると同じになるものが $n$ 通りずつあるので、$n!$ を $n$ でわっても同じ値になります。`,
          lv: 2
        });
        steps.push({
          t: R`$(${n}-1)!$ の計算`,
          m: prodLines(R`(${n}-1)! = ${n - 1}!`, fs),
          n: R`$${n - 1}$ から順にかけていきます。`
        });
        if (n <= 12) fig = circleFig(n);
        result = [
          { label: '円順列の総数', tex: R`(${n}-1)! = ${bt(value)}` },
          { label: '全体の並べ方 ÷ n', tex: R`\frac{${n}!}{${n}} = ${bt(value)}` }
        ];
      } else if (mode === 'rperm') {
        if (n < 1 || r < 1) throw CE('重複順列では n, r は 1 以上にしてください');
        const value = BigInt(n) ** BigInt(r), fs = []; for (let i = 0; i < r; i++) fs.push(BigInt(n));
        steps.push({
          t: '重複順列の考え方',
          m: [R`n \times n \times \cdots \times n = n^{r}\quad (n\ \text{を}\ r\ \text{個かける})`],
          n: R`$n$ 種類のものから、**同じものを何度使ってもよい**として $r$ 個を 1 列に並べる方法です。どの場所も $n$ 通りの選び方があるので、$n$ を $r$ 回かけます。`,
          easy: R`たとえば「あ・い・う」の 3 文字を、何回使ってもよいとして 4 文字の暗号をつくる場合です。1 文字目は 3 通り、2 文字目も 3 通り（使い終わっても減らない）、3・4 文字目も 3 通り。だから $3\times 3\times 3\times 3=3^{4}$ 通りです。`,
          pro: R`「各場所に何通りの選び方があるか」を数えるのが基本。「$n^{r}$」か「$r^{n}$」かは、選ぶ側（選択肢の数）が底になることで判断します。`
        });
        steps.push({
          t: R`$${n}^{${r}}$ の計算`,
          m: prodLines(R`${n}^{${r}}`, fs),
          n: R`$${n}$ を $${r}$ 回かけます。`,
          easy: R`累乗は同じ数を何回かけるかを表します。$${n}^{${r}}$ は「$${n}$ を $${r}$ 回かけたもの」です。左から順にかけて確かめます。`
        });
        if (r <= 8) fig = slotsFig(fs.map(String), '各場所に ' + n + ' 通りずつ（同じものを何度使ってもよい）');
        result = [
          { label: '重複順列の総数', tex: R`${n}^{${r}} = ${bt(value)}` },
          { label: '計算式', tex: shownProd(fs) }
        ];
      } else if (mode === 'rcomb') {
        if (n < 1 || r < 1) throw CE('重複組合せでは n, r は 1 以上にしてください');
        const N2 = n + r - 1;
        steps.push({
          t: '重複組合せの考え方',
          m: [R`\H{n}{r} = \C{n+r-1}{r}`, R`\H{${n}}{${r}} = \C{${n}+${r}-1}{${r}} = \C{${N2}}{${r}}`],
          n: R`$n$ 種類のものから、**同じものを何度選んでもよい**として $r$ 個を選ぶ方法の数が $\H{n}{r}$ です。「○ を $r$ 個と、仕切り $|$ を $n-1$ 本」の並べ方に置きかえると、$\C{n+r-1}{r}$ になります。`,
          easy: R`たとえば、${n} 種類のお菓子から ${r} 個を選ぶ（同じ種類を何個選んでもよい、順序は関係なし）場合を考えます。お菓子の種類の間に**仕切り**を ${n - 1} 本立てて、選んだ個数ぶんの ○ を各種類のところに置くと、「○○｜○｜○○」のような列になります。選び方 1 つが「○ ${r} 個と仕切り ${n - 1} 本の並び」1 つに対応するので、全部で ${N2} 個の場所から ○ の場所 ${r} か所を選ぶ $\C{${N2}}{${r}}$ 通りです。`,
          pro: R`「同じものを何個でも選べる」「整数解の個数（$x_{1}+\cdots+x_{n}=r$ の非負整数解）」は重複組合せ。$x+y+z=10$（$x,y,z\ge 0$）の解は $\H{3}{10}=\C{12}{10}$ 個。`
        });
        const cs = combSteps(N2, r);
        cs.steps.forEach((s) => steps.push(s));
        if (N2 <= 24) fig = barsFig(n, r);
        result = [
          { label: '重複組合せの総数', tex: R`\H{${n}}{${r}} = \C{${N2}}{${r}} = ${bt(cs.value)}` },
          { label: '計算式', tex: cs.expr }
        ];
      } else {   // same
        const gs = v.groups;
        if (gs.some((g) => !Number.isInteger(g) || g < 1)) throw CE('同じものの個数は 1 以上の整数で入力してください');
        const total = gs.reduce((s, g) => s + g, 0);
        if (total > 30) throw CE('合計は 30 個以内にしてください（現在 ' + total + ' 個）');
        if (gs.length > 8) throw CE('グループは 8 種類以内にしてください');
        const letters = gs.map((g, i) => String.fromCharCode(65 + i));
        const denTex = gs.map((g) => g + '!').join(R`\,`);
        const value = bfact(total) / bprod(gs.map(bfact));
        // 別の求め方: 場所の選び方（組合せ）の積
        const combParts = []; let rest = total;
        gs.forEach((g) => { combParts.push({ n: rest, r: g, v: bcomb(rest, g) }); rest -= g; });
        steps.push({
          t: '同じものを含む順列の公式',
          m: [R`\frac{n!}{p!\,q!\,r!\cdots}\quad (n = p + q + r + \cdots)`, R`n = ${gs.join(' + ')} = ${total}`],
          n: R`全部で $n$ 個のうち、同じものが $p$ 個、$q$ 個、$r$ 個、…あるとき、並べ方は $\dfrac{n!}{p!\,q!\,r!\cdots}$ 通りです。`,
          easy: R`同じ文字を含む並べ方を考えます。たとえば A が ${gs[0]} 個ある場合、もし A に「番号」をつけて区別すれば ${total}! 通りの並べ方があります。しかし実際は A どうしは区別できないので、A の ${gs[0]} 個を入れかえた ${gs[0]}! 通りは同じ並びです。そこで ${total}! を ${gs[0]}! でわります。他の文字も同じようにわります。`,
          pro: R`「同じものを含む順列」は、場所を選ぶ組合せの積 $\C{n}{p}\times\C{n-p}{q}\times\cdots$ としても求まる（別解）。`
        });
        steps.push({
          t: '代入する',
          m: [R`\frac{${total}!}{${denTex}}`],
          n: R`$n=${total}$、同じものの個数は $${gs.join(',\\ ')}$ です。`
        });
        const fa = bfact(total), fb = gs.map((g) => bfact(g));
        if (total <= 12) {
          steps.push({
            t: '階乗の値を計算して割る',
            m: [
              R`\frac{${total}!}{${denTex}} = \frac{${bt(fa)}}{${fb.map(bt).join(R` \times `)}} = \frac{${bt(fa)}}{${bt(bprod(fb))}} = ${bt(value)}`
            ],
            n: R`分子は $${total}! = ${bt(fa)}$、分母は各階乗の積 $${bt(bprod(fb))}$ です。`,
            easy: R`階乗の値を書き出して、分子 ÷ 分母を計算します。大きな数どうしの割り算なので、約分しながら計算すると楽です。`
          });
        }
        steps.push({
          t: '別の求め方（場所の選び方の積）',
          m: [
            R`${combParts.map((c) => R`\C{${c.n}}{${c.r}}`).join(R` \times `)} = ${combParts.map((c) => bt(c.v)).join(R` \times `)} = ${bt(value)}`
          ],
          n: R`まず ${gs[0]} 個の「${letters[0]}」を入れる場所を選び、残りの場所から次の文字の場所を選び、…と順に決めて掛けても、同じ値になります。`,
          easy: R`並べる場所が ${total} か所あるとして、「${letters[0]} を入れる場所」を ${gs[0]} か所選ぶ方法が $\C{${total}}{${gs[0]}}$ 通り。残りの場所から次の文字の場所を選ぶ…と続けて、積をとります。`,
          lv: total <= 12 ? 2 : 1
        });
        if (total <= 12) fig = tokensFig(gs);
        result = [
          { label: '並べ方の総数', tex: R`\frac{${total}!}{${denTex}} = ${bt(value)}` },
          { label: '別解（組合せの積）', tex: combParts.map((c) => R`\C{${c.n}}{${c.r}}`).join(R` \times `) + ' = ' + bt(value) }
        ];
      }

      const out = { result: result, steps: steps };
      if (fig) out.fig = fig;
      return out;
    }
  });

  /* ================= ia-binom-prob: 反復試行の確率 ================= */

  function barChartSvg(probs, k) {
    // probs: Number[]（j = 0..n）。j = k を強調、j > k を「k 回以上」の色で
    const n = probs.length - 1, W = 360, H = 220, L = 44, Rt = 346, T = 34, B = 176;
    const pmax = Math.max.apply(null, probs);
    const step = niceStep(pmax * 1.1, 4);
    const ymax = Math.max(step, Math.ceil(pmax * 1.1 / step - 1e-9) * step);
    const Y = (p) => B - (p / ymax) * (B - T);
    const d = JK.plot.draw(W, H);
    for (let i = 0; i * step <= ymax + 1e-9; i++) {
      const yy = Y(i * step);
      d.line(L, yy, Rt, yy, { cls: 'dim', w: 0.5, dash: i > 0 });
      d.text(L - 5, yy + 4, U.fmt(i * step, 4), { size: 10, cls: 'dim', anchor: 'end' });
    }
    const slot = (Rt - L) / (n + 1), bw = Math.min(26, slot * 0.72);
    probs.forEach((p, j) => {
      const x = L + slot * j + (slot - bw) / 2, h = B - Y(p);
      const cls = j === k ? 'c3' : (j > k ? 'c1' : 'dim'), fill = j === k ? 'f3' : (j > k ? 'f1' : 'f0');
      if (h > 0.2) d.rect(x, Y(p), bw, h, { cls: cls, fill: fill, w: 1.3 });
      const every = n <= 12 ? 1 : (n <= 24 ? 2 : 5);
      if (j % every === 0) d.text(x + bw / 2, B + 14, String(j), { size: 11, cls: j === k ? 'fg' : 'dim', bold: j === k });
      if (j === k) d.text(x + bw / 2, Y(p) - 5, U.fmt(p, 3), { size: 11, bold: true });
    });
    d.line(L, B, Rt, B, { cls: 'fg', w: 1.2 });
    d.line(L, T - 6, L, B, { cls: 'fg', w: 1.2 });
    d.text((L + Rt) / 2, B + 31, '成功の回数 j', { size: 11, cls: 'dim' });
    d.text(L, 14, '確率 P(X = j)', { size: 11, anchor: 'start', cls: 'dim' });
    const t1 = 'ちょうど ' + k + ' 回', t2 = k + ' 回以上';
    const w1 = textW(t1) * 0.9 + 20, w2 = textW(t2) * 0.9 + 20;
    const x2 = Rt - w2, x1 = x2 - w1 - 6;
    d.rect(x1, 8, 12, 9, { cls: 'c3', fill: 'f3', w: 1.2 });
    d.text(x1 + 16, 16, t1, { size: 10.5, anchor: 'start' });
    d.rect(x2, 8, 12, 9, { cls: 'c1', fill: 'f1', w: 1.2 });
    d.text(x2 + 16, 16, t2, { size: 10.5, anchor: 'start' });
    return d.svg();
  }

  JK.registerCalc({
    id: 'ia-binom-prob',
    course: 'IA',
    unit: 'm-prob',
    group: '場合の数・確率',
    title: '反復試行の確率',
    desc: R`1 回の試行で事象が起こる確率が $p$ のとき、$n$ 回くり返してちょうど $k$ 回起こる確率と「$k$ 回以上」起こる確率を、分数で求めます。`,
    form: [R`P(X=k) = \C{n}{k}\,p^{k}(1-p)^{n-k}`],
    inputs: [
      { key: 'n', label: R`試行の回数 $n$`, type: 'int', def: '5', min: 1, max: 20 },
      { key: 'k', label: R`起こる回数 $k$`, type: 'int', def: '2', min: 0, max: 20, hint: R`$0 \le k \le n$` },
      { key: 'p', label: R`1 回で起こる確率 $p$`, type: 'q', def: '1/6', min: 0, max: 1, hint: '分数（1/6）や小数（0.3）で入力。分母は 100 以下' }
    ],
    examples: [
      { label: 'さいころで 1 の目が 2 回', v: { n: '5', k: '2', p: '1/6' } },
      { label: 'コインで表が 3 回', v: { n: '6', k: '3', p: '1/2' } },
      { label: '成功率 0.7 で 4 回以上', v: { n: '5', k: '4', p: '7/10' } },
      { label: '5 本中 3 本以上（p = 1/3）', v: { n: '5', k: '3', p: '1/3' } }
    ],
    intro: {
      easy: R`コインを何回も投げる、さいころを何回も振る、のように、**同じ条件の試行を、前の結果に影響されずにくり返す**ことを**反復試行**といいます。
たとえば「表の出る確率が $p$ のコインを $n$ 回投げて、ちょうど $k$ 回表が出る確率」は、次の 2 つの数のかけ算です。
① 表が出る回を **どの $k$ 回にするか** … $\C{n}{k}$ 通り
② ある決まった並び（例: 表表裏裏裏）が起こる確率 … $p^{k}(1-p)^{n-k}$
この計算機は、各部分を分数で計算して、「$k$ 回以上」の確率や少なくとも 1 回起こる確率も求めます。`,
      normal: R`$P(X=k)=\C{n}{k}p^{k}(1-p)^{n-k}$。「$k$ 回以上」は $k, k+1, \dots, n$ 回の確率の和（余事象で $1-P(X\le k-1)$ の方が短いこともある）。`,
      pro: R`「少なくとも 1 回」は余事象 $1-(1-p)^{n}$。「$k$ 回以上」は項数の少ない側（直接の和か余事象）で計算するのが定石です。`
    },
    compute(v) {
      const n = v.n, k = v.k;
      if (k > n) throw CE('k は n 以下にしてください（' + n + ' 回中 ' + k + ' 回はありえません）');
      if (v.p.d > 100) throw CE('p の分母は 100 以下にしてください');
      const p = fromQ(v.p), q = fSub(ONE, p);
      const a = p.n, b = p.d, qa = q.n, qb = q.d;          // p = a/b, 1 - p = qa/qb（どちらも既約）
      const Cnk = bcomb(n, k);
      const pk = fPow(p, k), qk = fPow(q, n - k);
      const Pk = fMul(fMul(fr(Cnk), pk), qk);
      // 分母 D = 共通分母 L の n 乗: p = P1/L, 1-p = Q1/L（L = 分母の最小公倍数）
      const L = b * qb / bgcd(b, qb);
      const P1 = a * (L / b), Q1 = qa * (L / qb);
      const LN = L ** BigInt(n);
      const term = (j) => bcomb(n, j) * P1 ** BigInt(j) * Q1 ** BigInt(n - j);   // 分子（分母は L^n）
      const terms = []; for (let j = 0; j <= n; j++) terms.push(term(j));
      const sumTerms = (lo, hi) => { let s = 0n; for (let j = lo; j <= hi; j++) s += terms[j]; return s; };
      const Pge = fr(sumTerms(k, n), LN), Ple = fr(sumTerms(0, k - 1), LN);
      const P1c = fSub(ONE, fPow(q, n));                        // 少なくとも 1 回
      const probs = terms.map((t) => Number(t) / Number(LN));
      const pT = tex(p), qT = tex(q);
      const pPow = (f, e) => (e === 0 ? '1' : (f.d === 1n ? bt(f.n) + (e > 1 ? '^{' + e + '}' : '') : R`\left(${tex(f)}\right)` + (e > 1 ? '^{' + e + '}' : '')));
      const powVal = (f, e) => (e === 0 ? '1' : tex(fPow(f, e)));
      const steps = [];

      steps.push({
        t: '反復試行の確率の公式',
        m: [R`P(X=k) = \C{n}{k}\,p^{k}(1-p)^{n-k}`, R`n=${n},\quad k=${k},\quad p=${pT},\quad 1-p=${qT}`],
        n: R`1 回で起こる確率が $p$ の試行を $n$ 回くり返すとき、ちょうど $k$ 回起こる確率は、「起こる回の選び方 $\C{n}{k}$ 通り」×「起こる $k$ 回の確率 $p^{k}$」×「起こらない $n-k$ 回の確率 $(1-p)^{n-k}$」です。`,
        easy: R`コインを 3 回投げて、表がちょうど 2 回出る場合を考えます。
・表表裏、表裏表、裏表表 の **3 通り**（3 回のうちどの 2 回を表にするか、$\C{3}{2}=3$）。
・どの並びでも確率は同じで、$p\times p\times(1-p)$ です。
だから確率は $3\times p^{2}(1-p)$ です。これを一般の $n,\,k$ にしたものが公式です。`,
        pro: R`この確率分布を**二項分布** $B(n,\,p)$ といいます（数 B で学びます）。`
      });

      steps.push({
        t: '3 つの部分を別々に計算する',
        m: [
          R`\C{${n}}{${k}} = ${bt(Cnk)}`,
          R`p^{${k}} = ${pPow(p, k)} = ${powVal(p, k)}`,
          R`(1-p)^{${n - k}} = ${pPow(q, n - k)} = ${powVal(q, n - k)}`
        ],
        n: R`① 回数の選び方 ② $p^{${k}}$ ③ $(1-p)^{${n - k}}$ をそれぞれ計算します。分数のべき乗は、分子・分母をそれぞれ累乗します。`,
        easy: R`$\left(\dfrac{a}{b}\right)^{k}=\dfrac{a^{k}}{b^{k}}$ です。分子も分母もそれぞれ $k$ 乗します。$0$ 乗は $1$ です（たとえば $p^{0}=1$）。`
      });

      const cs = combSteps(n, k);
      steps.push({
        t: R`$\C{${n}}{${k}}$ の計算過程`,
        m: [R`\C{${n}}{${k}} = ` + cs.expr + ' = ' + bt(Cnk)],
        n: R`組合せの数 $\C{${n}}{${k}}$ は、分子・分母に書き出して約分すると求まります。`,
        easy: R`$\C{n}{k}$ は「$n$ 個のうち $k$ 個を選ぶ方法の数」で、$\dfrac{n(n-1)\cdots(n-k+1)}{k(k-1)\cdots 1}$ で計算します（分子・分母とも $k$ 個の積）。`,
        lv: 2
      });

      const numerFactors = [Cnk, pk.n, qk.n].map(bt), denFactors = [pk.d, qk.d].map(bt);
      const rawNum = Cnk * pk.n * qk.n, rawDen = pk.d * qk.d;
      steps.push({
        t: 'かけ合わせて約分する',
        m: [
          R`P(X=${k}) = ${bt(Cnk)} \times ${powVal(p, k)} \times ${powVal(q, n - k)}`,
          R`= \frac{${numerFactors.join(R` \times `)}}{${denFactors.join(R` \times `)}} = \frac{${bt(rawNum)}}{${bt(rawDen)}}`,
          R`= ${texA(Pk)}`
        ],
        n: bgcd(rawNum, rawDen) > 1n
          ? R`分子と分母の最大公約数 $${bt(bgcd(rawNum, rawDen))}$ で約分します。`
          : R`これ以上約分できません（既約分数です）。`,
        easy: R`分数どうしのかけ算は、分子どうし・分母どうしをかけます。最後に、分子と分母に共通の約数があれば約分して、いちばん簡単な分数にします。`
      });

      steps.push({
        t: R`各回数の確率（$j=${k}$ から $${n}$ まで）`,
        m: terms.map((t, j) => ({ j: j, t: t })).filter((o) => o.j >= k).map((o) => R`P(X=${o.j}) = \C{${n}}{${o.j}}\,p^{${o.j}}(1-p)^{${n - o.j}} = \frac{${bt(o.t)}}{${bt(LN)}}`),
        n: R`分母をそろえる（共通の分母 $${bt(LN)}$）ために、分子だけを書き出しています。`,
        lv: 2
      });

      const ks = [], sumLine = [];
      for (let j = k; j <= n; j++) { ks.push(j); sumLine.push(bt(terms[j])); }
      const sumShown = sumLine.length <= 8 ? sumLine.join(' + ') : sumLine.slice(0, 3).join(' + ') + R` + \cdots + ` + sumLine[sumLine.length - 1];
      steps.push({
        t: R`「$${k}$ 回以上」の確率`,
        m: [
          R`P(X \ge ${k}) = ` + (n - k + 1 <= 6 ? ks.map((j) => R`P(X=${j})`).join(' + ') : R`P(X=${k}) + P(X=${k + 1}) + \cdots + P(X=${n})`),
          R`= \frac{${sumShown}}{${bt(LN)}} = \frac{${bt(sumTerms(k, n))}}{${bt(LN)}}`,
          R`= ${texA(Pge)}`
        ],
        n: R`「$${k}$ 回以上」は、$${k}$ 回、$${k + 1}$ 回、…、$${n}$ 回のどれかが起こることなので、それぞれの確率を**足し合わせ**ます（これらの事象は同時に起こらない＝排反）。`,
        easy: R`「$${k}$ 回以上」とは「ちょうど $${k}$ 回、またはちょうど $${k + 1}$ 回、…、またはちょうど $${n}$ 回」のことです。どれか 1 つが起これば条件を満たし、同時には起こらないので、確率を**足し算**します。`,
        pro: k >= 1 && k < n - k + 1
          ? R`今回は項数の少ない**余事象**の方が楽です: $P(X\ge ${k}) = 1 - P(X \le ${k - 1})$。`
          : R`「少なくとも」「以上」は、余事象 $1-P(\cdots)$ の方が項数が少なくなることも多い。`
      });

      if (k >= 1) {
        const lowTerms = []; for (let j = 0; j <= k - 1; j++) lowTerms.push(bt(terms[j]));
        const lowShown = lowTerms.length <= 8 ? lowTerms.join(' + ') : lowTerms.slice(0, 3).join(' + ') + R` + \cdots + ` + lowTerms[lowTerms.length - 1];
        steps.push({
          t: '余事象で確かめる',
          m: [
            R`P(X \ge ${k}) = 1 - P(X \le ${k - 1}) = 1 - \frac{${lowShown}}{${bt(LN)}}`,
            R`= 1 - \frac{${bt(sumTerms(0, k - 1))}}{${bt(LN)}} = ${tex(fSub(ONE, Ple))}`
          ],
          n: fEq(fSub(ONE, Ple), Pge) ? R`直接足した結果 $${tex(Pge)}$ と一致しました。` : R`直接足した結果と一致しません。`,
          easy: R`「$${k}$ 回以上」の反対（余事象）は「$${k - 1}$ 回以下」です。全体の確率 $1$ から、$${k - 1}$ 回以下の確率を引いても求められます。足す項の数が少ない方を選ぶと楽になります。`,
          lv: 2
        });
      }

      steps.push({
        t: '少なくとも 1 回起こる確率',
        m: [R`P(X \ge 1) = 1 - P(X=0) = 1 - (1-p)^{${n}}`, R`= 1 - ${pPow(q, n)} = 1 - ${powVal(q, n)} = ${tex(P1c)}`],
        n: R`「少なくとも 1 回」の余事象は「1 回も起こらない」ので、$1-(1-p)^{n}$ で求められます。`,
        easy: R`「少なくとも 1 回」を直接数えると $1$ 回、$2$ 回、…と項がたくさん必要です。反対の「1 回も起こらない」はたった 1 つ、$(1-p)^{n}$ だけです。これを全体の $1$ から引きます。`,
        lv: 2
      });

      return {
        result: [
          { label: 'ちょうど ' + k + ' 回', tex: R`P(X=${k}) = ${texA(Pk)}` },
          { label: k + ' 回以上', tex: R`P(X \ge ${k}) = ${texA(Pge)}` },
          { label: '少なくとも 1 回', tex: R`P(X \ge 1) = ${texA(P1c)}` }
        ],
        steps: steps,
        fig: barChartSvg(probs, k)
      };
    }
  });

  /* ================= ia-cond-prob: 条件付き確率 ================= */

  function vennSvg(pa, pb, pab, rest) {
    const W = 340, H = 200, d = JK.plot.draw(W, H);
    d.rect(8, 8, 324, 184, { cls: 'dim', w: 1.2 });
    d.text(16, 24, '全体 U（確率 1）', { size: 11, anchor: 'start', cls: 'dim' });
    d.circle(130, 108, 62, { cls: 'c1', fill: 'f1', w: 1.8 });
    d.circle(212, 108, 62, { cls: 'c3', fill: 'f3', w: 1.8 });
    d.text(96, 56, 'A', { size: 14, bold: true });
    d.text(246, 56, 'B', { size: 14, bold: true });
    d.text(98, 108, 'A のみ', { size: 11 });
    d.text(98, 124, plain(fSub(pa, pab)), { size: 12, bold: true });
    d.text(171, 100, 'A∩B', { size: 11 });
    d.text(171, 116, plain(pab), { size: 12, bold: true });
    d.text(246, 108, 'B のみ', { size: 11 });
    d.text(246, 124, plain(fSub(pb, pab)), { size: 12, bold: true });
    d.text(300, 178, '外 ' + plain(rest), { size: 11, cls: 'dim', anchor: 'end' });
    return d.svg();
  }

  // 最小公倍数
  function lcmAll(arr) { return arr.reduce((l, x) => l * x / bgcd(l, x), 1n); }

  JK.registerCalc({
    id: 'ia-cond-prob',
    course: 'IA',
    unit: 'm-prob',
    group: '場合の数・確率',
    title: '条件付き確率・独立',
    desc: R`$P(A),\ P(B),\ P(A\cap B)$ から、条件付き確率 $P(B|A),\ P(A|B)$、和事象の確率 $P(A\cup B)$、独立かどうかを求めます。`,
    form: [R`P_{A}(B) = \frac{P(A\cap B)}{P(A)}`, R`P(A\cup B) = P(A)+P(B)-P(A\cap B)`],
    inputs: [
      { key: 'pa', label: R`$P(A)$`, type: 'q', def: '3/5', min: 0, max: 1 },
      { key: 'pb', label: R`$P(B)$`, type: 'q', def: '1/2', min: 0, max: 1 },
      { key: 'pab', label: R`$P(A\cap B)$`, type: 'q', def: '1/5', min: 0, max: 1, hint: R`$A$ と $B$ が同時に起こる確率。$P(A)$, $P(B)$ より大きくできません` }
    ],
    examples: [
      { label: '従属な例', v: { pa: '3/5', pb: '1/2', pab: '1/5' } },
      { label: '独立な例（さいころ）', v: { pa: '1/2', pb: '1/3', pab: '1/6' } },
      { label: '排反な例', v: { pa: '1/4', pb: '1/3', pab: '0' } },
      { label: 'A ⊂ B の例', v: { pa: '1/6', pb: '1/2', pab: '1/6' } }
    ],
    intro: {
      easy: R`**条件付き確率**とは、「ある事象 $A$ が起こったと分かっているとき、事象 $B$ が起こる確率」です。記号では $P_{A}(B)$（または $P(B|A)$）と書きます。
たとえば、さいころを 1 回投げて「偶数の目が出た」と分かっているとき、それが 6 である確率は？ 偶数は 2, 4, 6 の 3 通りのうち 6 は 1 通りなので、$\dfrac{1}{3}$ です。これは $\dfrac{P(A\cap B)}{P(A)}=\dfrac{1/6}{1/2}$ と同じ計算です。
また、$A$ が起こるかどうかが $B$ の確率に影響しないとき、$A$ と $B$ は**独立**であるといいます。`,
      normal: R`$P_{A}(B)=\dfrac{P(A\cap B)}{P(A)}$、乗法定理 $P(A\cap B)=P(A)P_{A}(B)$、加法定理 $P(A\cup B)=P(A)+P(B)-P(A\cap B)$。独立 $\Leftrightarrow P(A\cap B)=P(A)P(B)$。`,
      pro: R`独立と排反は別の概念。$P(A),P(B)>0$ で排反なら $P(A\cap B)=0\ne P(A)P(B)$ なので、**独立ではない**。条件付き確率は「全体を $A$ に縮小して見た割合」と考えると速い。`
    },
    compute(v) {
      const pa = fromQ(v.pa), pb = fromQ(v.pb), pab = fromQ(v.pab);
      [pa, pb, pab].forEach((x) => { if (x.d > 1000000n) throw CE('分母が大きすぎます。分母は 100 万以下にしてください'); });
      if (fCmp(pab, pa) > 0 || fCmp(pab, pb) > 0) throw CE('P(A∩B) は P(A) と P(B) のどちらよりも大きくできません（A∩B は A にも B にも含まれるため）');
      const pu = fSub(fAdd(pa, pb), pab);
      if (fCmp(pu, ONE) > 0) throw CE('P(A∪B) = P(A) + P(B) − P(A∩B) が 1 をこえます。入力を見直してください（P(A∩B) が小さすぎます）');
      if (pa.n === 0n || pb.n === 0n) throw CE('P(A) と P(B) はどちらも 0 より大きい値にしてください（条件付き確率は、条件となる事象の確率が 0 でないときだけ定義されます）');
      const pba = fDiv(pab, pa), pab2 = fDiv(pab, pb);
      const prod = fMul(pa, pb), indep = fEq(prod, pab), rest = fSub(ONE, pu);
      // 分子 ÷ 分母 の計算の行（どちらも整数なら 1 行）
      const condChain = (num, den, val) => (num.d === 1n && den.d === 1n
        ? [R`= \frac{${tex(num)}}{${tex(den)}} = ${tex(val)}`]
        : [R`= \frac{${tex(num)}}{${tex(den)}} = ${tex(num)} \div ${paren(den)}`, R`= ${tex(num)} \times ${tex(fDiv(ONE, den))} = ${tex(val)}`]);
      const L = lcmAll([pa.d, pb.d, pab.d]);
      const toL = (f) => bt(f.n * (L / f.d));
      const steps = [];

      steps.push({
        t: '条件付き確率の定義',
        m: [R`P_{A}(B) = P(B|A) = \frac{P(A\cap B)}{P(A)}`, R`P_{B}(A) = P(A|B) = \frac{P(A\cap B)}{P(B)}`],
        n: R`$A$ が起こったときに $B$ が起こる確率 $P_{A}(B)$ は、「$A$ と $B$ が同時に起こる確率」を「$A$ が起こる確率」でわったものです。条件となる事象の確率が分母にきます。`,
        easy: R`たとえばクラスの生徒のうち、$A$ =「部活に入っている」、$B$ =「眼鏡をかけている」とします。「**部活に入っている人の中で**、眼鏡の人の割合」が $P_{A}(B)$ です。全体ではなく「$A$ の人だけ」を新しい全体とみなして、そのうちの $B$ の割合を考えるので、$A$ と $B$ の両方の人の割合 $P(A\cap B)$ を $A$ の割合 $P(A)$ でわります。`,
        pro: R`$P_{A}(B)$ と $P_{B}(A)$ は一般に等しくない（分母が違う）。条件にする側を取り違えないこと。`
      });

      steps.push({
        t: R`$P_{A}(B)$ を求める`,
        m: [R`P_{A}(B) = \frac{P(A\cap B)}{P(A)}`].concat(condChain(pab, pa, pba)),
        n: R`分数でわるときは、わる数の**逆数をかけ**ます。`,
        easy: R`分数のわり算は「わる数の逆数をかける」で計算します（$\dfrac{b}{a}\div\dfrac{d}{c}=\dfrac{b}{a}\times\dfrac{c}{d}$）。最後に約分します。`
      });

      steps.push({
        t: R`$P_{B}(A)$ を求める`,
        m: [R`P_{B}(A) = \frac{P(A\cap B)}{P(B)}`].concat(condChain(pab, pb, pab2)),
        n: R`こんどは $B$ が条件なので、$P(B)$ でわります。`
      });

      steps.push({
        t: '和事象の確率（加法定理）',
        m: [
          R`P(A\cup B) = P(A) + P(B) - P(A\cap B)`,
          R`= ${tex(pa)} + ${tex(pb)} - ${tex(pab)}`,
          L === 1n
            ? R`= ${tex(pu)}`
            : R`= \frac{${toL(pa)}}{${bt(L)}} + \frac{${toL(pb)}}{${bt(L)}} - \frac{${toL(pab)}}{${bt(L)}} = ${(() => { const un = R`\frac{${bt(pa.n * (L / pa.d) + pb.n * (L / pb.d) - pab.n * (L / pab.d))}}{${bt(L)}}`; return un + (un === tex(pu) ? '' : ' = ' + tex(pu)); })()}`
        ],
        n: R`$A$ と $B$ の少なくとも一方が起こる確率です。$P(A)+P(B)$ では $A\cap B$ を 2 回数えてしまうので、$P(A\cap B)$ を 1 回引きます。分数の足し引きは通分して計算します（共通の分母 $${bt(L)}$）。`,
        easy: R`ベン図で、$A$ の円と $B$ の円の面積を足すと、重なった部分（$A\cap B$）が 2 回数えられます。だから重なりの面積を 1 回引きます。分母が違う分数の足し引きは、**通分**（分母をそろえること）してから行います。`,
        pro: R`$P(A\cup B)=1-P(\overline{A}\cap\overline{B})$ も有用（ド・モルガンの法則）。`
      });

      steps.push({
        t: '乗法定理で確かめる',
        m: [R`P(A\cap B) = P(A)\,P_{A}(B) = ${tex(pa)} \times ${tex(pba)} = ${tex(fMul(pa, pba))}`],
        n: R`求めた $P_{A}(B)$ をもとにもどすと $P(A\cap B)=${tex(pab)}$ になり、入力と一致します。`,
        easy: R`条件付き確率の式を変形すると $P(A\cap B)=P(A)\times P_{A}(B)$（**乗法定理**）です。「$A$ が起こり、さらにその中で $B$ も起こる」確率は、$A$ の確率 × 条件付きの確率、という意味です。`,
        lv: 2
      });

      steps.push({
        t: '独立かどうかを調べる',
        m: [
          R`P(A)\,P(B) = ${tex(pa)} \times ${tex(pb)} = ${tex(prod)}`,
          R`P(A\cap B) = ${tex(pab)}`,
          indep ? R`P(A\cap B) = P(A)\,P(B) \;\Rightarrow\; \text{独立}` : R`P(A\cap B) \ne P(A)\,P(B) \;\Rightarrow\; \text{独立ではない（従属）}`
        ],
        n: indep
          ? R`$P(A\cap B)=P(A)P(B)$ が成り立つので、$A$ と $B$ は**独立**です。このとき $P_{A}(B)=P(B)$（$=${tex(pb)}$）となり、$A$ が起こったかどうかは $B$ の確率に影響しません。`
          : R`$P(A\cap B)=P(A)P(B)$ が成り立たないので、$A$ と $B$ は独立ではありません。` + (pab.n === 0n ? R`（$P(A\cap B)=0$ なので $A$ と $B$ は**排反**です。排反は独立とは別の概念で、確率が 0 でない排反な事象は独立ではありません。）` : R`実際、$P_{A}(B)=${tex(pba)}$ は $P(B)=${tex(pb)}$ と異なります。`),
        easy: R`**独立**とは、「$A$ が起こったかどうか」が「$B$ が起こりやすさ」に影響しないことです（例: 2 つのさいころを別々に振る）。式では $P(A\cap B)=P(A)\times P(B)$ が成り立つことです。成り立たなければ、$A$ と $B$ は何らかの関係があります（**従属**）。`,
        pro: R`独立の判定は「$P(A\cap B)=P(A)P(B)$」か「$P_{A}(B)=P(B)$」。排反（同時に起こらない）とは区別すること。`
      });

      return {
        result: [
          { label: '条件付き確率 P(B|A)', tex: R`P_{A}(B) = ${texA(pba)}` },
          { label: '条件付き確率 P(A|B)', tex: R`P_{B}(A) = ${texA(pab2)}` },
          { label: '和事象の確率 P(A∪B)', tex: R`P(A\cup B) = ${texA(pu)}` },
          { label: '独立かどうか', tex: indep ? R`\text{独立}` : R`\text{独立ではない（従属）}` }
        ],
        steps: steps,
        fig: vennSvg(pa, pb, pab, rest)
      };
    }
  });

  /* ================= ia-expect: 期待値 ================= */

  function parseFrList(s, label) {
    const toks = JK.expr.normalize(String(s)).split(/[\s,;]+/).filter((t) => t !== '');
    if (!toks.length) throw CE(label + 'を入力してください（カンマ区切り）');
    return toks.map((t) => {
      const q = JK.Q.from(t);
      if (!q) throw CE(label + 'に、数として読めない値があります: ' + t);
      if (q.d > 100000) throw CE(label + 'の分母は 10 万以下にしてください: ' + t);
      return fromQ(q);
    });
  }

  function distFig(xs, ps, mean) {
    // 値の位置に確率の棒を立て、期待値の位置に三角（つり合う点）を置く
    const W = 360, H = 200, L = 30, Rr = 336, B = 140, T = 30;
    const lo = Math.min(fVal(xs[0]), fVal(mean)), hi = Math.max(fVal(xs[xs.length - 1]), fVal(mean));
    const span = hi - lo || 1, a = lo - span * 0.12, b = hi + span * 0.12;
    const X = (x) => L + (x - a) / (b - a) * (Rr - L);
    const pmax = Math.max.apply(null, ps.map(fVal));
    const d = JK.plot.draw(W, H);
    d.line(L - 8, B, Rr + 8, B, { cls: 'fg', w: 1.4 });
    const step = niceStep(b - a, 6);
    for (let i = Math.ceil(a / step); i * step <= b + 1e-9; i++) {
      d.line(X(i * step), B, X(i * step), B + 4, { cls: 'dim', w: 1 });
      d.text(X(i * step), B + 16, U.fmt(i * step, 4), { size: 10, cls: 'dim' });
    }
    const bw = Math.max(6, Math.min(24, (Rr - L) / (xs.length * 2.6)));
    xs.forEach((x, i) => {
      const h = (fVal(ps[i]) / pmax) * (B - T - 18);
      d.rect(X(fVal(x)) - bw / 2, B - h, bw, h, { cls: 'c1', fill: 'f1', w: 1.5 });
      d.text(X(fVal(x)), B - h - 5, plain(ps[i]), { size: 10.5 });
    });
    const mx = X(fVal(mean));
    d.poly([[mx, B + 2], [mx - 8, B + 17], [mx + 8, B + 17]], { cls: 'c3', fill: 'f3', w: 1.6 });
    d.text(mx, B + 33, 'E(X) = ' + plain(mean), { size: 11, bold: true });
    d.text(L, 16, '各値の確率（棒の上の数）と期待値（▲ = つり合う点）', { size: 11, anchor: 'start', cls: 'dim' });
    d.text((L + Rr) / 2, H - 4, 'X の値', { size: 10.5, cls: 'dim' });
    return d.svg();
  }

  JK.registerCalc({
    id: 'ia-expect',
    course: 'IA',
    unit: 'm-prob',
    group: '場合の数・確率',
    title: '期待値・分散',
    desc: R`確率変数 $X$ のとりうる値と確率から、確率の和が 1 であることを確かめ、期待値・分散・標準偏差を求めます。確率は分数（1/6）や小数で入力できます。`,
    form: [R`E(X) = \sum_{i} x_{i}p_{i}`, R`V(X) = E(X^{2}) - \{E(X)\}^{2}`],
    inputs: [
      { key: 'xs', label: R`$X$のとりうる値（カンマ区切り）`, type: 'text', def: '0, 100, 500', hint: '2〜12 個。同じ値は重複させません' },
      { key: 'ps', label: R`それぞれの確率（カンマ区切り）`, type: 'text', def: '1/2, 3/10, 1/5', hint: '分数 1/6・小数 0.25 のどちらも可。値と同じ個数で、合計が 1 になること' }
    ],
    examples: [
      { label: 'くじの賞金', v: { xs: '0, 100, 500', ps: '1/2, 3/10, 1/5' } },
      { label: 'さいころの目', v: { xs: '1, 2, 3, 4, 5, 6', ps: '1/6, 1/6, 1/6, 1/6, 1/6, 1/6' } },
      { label: '2 枚のコインの表の数', v: { xs: '0, 1, 2', ps: '1/4, 1/2, 1/4' } },
      { label: '当たり 1000 円のくじ', v: { xs: '1000, 100, 0', ps: '1/100, 9/100, 9/10' } }
    ],
    intro: {
      easy: R`**期待値**とは、同じことを何度もくり返したときに「**平均していくらになるか**」を表す値です。たとえば、くじを何回も引くとき、1 回あたり平均して何円もらえるか、という値です。
求め方は「**(値) × (その値になる確率)** をすべて足す」です。たとえば 100 円が当たる確率が $\dfrac{1}{4}$、はずれ（0 円）の確率が $\dfrac{3}{4}$ なら、$100\times\dfrac14+0\times\dfrac34=25$ 円が期待値です。
また、確率をすべて足すと必ず $1$（100 %）になることを、最初に確かめます。**分散**は、値が期待値のまわりにどれくらい散らばっているかを表す数です。`,
      normal: R`確率分布表をつくり、$\sum p_{i}=1$ を確認 → $E(X)=\sum x_{i}p_{i}$ → $V(X)=E(X^{2})-\{E(X)\}^{2}$ → $\sigma(X)=\sqrt{V(X)}$。`,
      pro: R`期待値は線形: $E(aX+b)=aE(X)+b$、$V(aX+b)=a^{2}V(X)$。ゲームの損得は期待値で比べます（期待値が参加料を上回れば得）。分散は数 B の「確率分布と統計的な推測」の内容です。`
    },
    compute(v) {
      const xr = parseFrList(v.xs, '値'), pr = parseFrList(v.ps, '確率');
      if (xr.length !== pr.length) throw CE('値の個数と確率の個数をそろえてください（値 ' + xr.length + ' 個、確率 ' + pr.length + ' 個）');
      if (xr.length < 2) throw CE('値は 2 個以上入力してください');
      if (xr.length > 12) throw CE('値は 12 個以内にしてください');
      const idx = xr.map((x, i) => i).sort((i, j) => fCmp(xr[i], xr[j]));
      const xs = idx.map((i) => xr[i]), ps = idx.map((i) => pr[i]);
      for (let i = 1; i < xs.length; i++) if (fEq(xs[i], xs[i - 1])) throw CE('同じ値が重複しています（' + plain(xs[i]) + '）。同じ値の確率は足して、1 つにまとめてください');
      ps.forEach((p) => { if (p.n < 0n) throw CE('確率に負の数があります（' + plain(p) + '）'); if (fCmp(p, ONE) > 0) throw CE('確率は 1 以下にしてください（' + plain(p) + '）'); });
      const total = fSum(ps);
      if (!fEq(total, ONE)) throw CE('確率の和が 1 になっていません（現在 ' + plain(total) + '）。確率を見直してください');
      const n = xs.length;
      const prods = xs.map((x, i) => fMul(x, ps[i]));
      const mean = fSum(prods);
      const sqs = xs.map((x, i) => fMul(fMul(x, x), ps[i]));
      const E2 = fSum(sqs), vr = fSub(E2, fMul(mean, mean));
      const devSq = xs.map((x, i) => fMul(fMul(fSub(x, mean), fSub(x, mean)), ps[i]));
      const vr2 = fSum(devSq);
      const sdT = radTex(vr), sdVal = Math.sqrt(fVal(vr));
      const L = lcmAll(ps.map((p) => p.d));
      const sumShow = (arr, maxT) => (arr.length <= (maxT || 8) ? arr.map((x, i) => (i ? ' + ' : '') + paren(x)).join('') : arr.slice(0, (maxT || 8) - 2).map((x, i) => (i ? ' + ' : '') + paren(x)).join('') + R` + \cdots + ` + paren(arr[arr.length - 1]));
      const sdShow = sdT === null ? U.fmt(sdVal, 4) : (isSurd(sdT) ? sdT + R` \fallingdotseq ` + U.fmt(sdVal, 4) : sdT);

      const steps = [];

      steps.push({
        t: '確率分布の表をつくる',
        m: [R`X:\ ${xs.map(tex).join(R`,\ `)}`, R`P:\ ${ps.map(tex).join(R`,\ `)}`],
        n: R`$X$ がとる値と、それぞれの確率を表にします。$x_{i}$ は値、$p_{i}$ はその値になる確率です。`,
        easy: R`**確率分布表**は、「どの値が、どれくらいの確率で出るか」を並べた表です。たとえばくじなら「賞金 0 円・100 円・500 円」と「それぞれの確率」を並べます。`,
        fig: tableSvg(['X'].concat(xs.map(plain), ['計']), [['P'].concat(ps.map(plain), ['1'])], null)
      });

      steps.push({
        t: '確率の和が 1 になることを確かめる',
        m: [
          R`p_{1} + p_{2} + \cdots + p_{n} = ${sumShow(ps)}`,
          ...(L > 1n && n <= 8
            ? [
              R`= ${ps.map((p, i) => (i ? ' + ' : '') + R`\frac{${bt(p.n * (L / p.d))}}{${bt(L)}}`).join('')}`,
              R`= \frac{${ps.map((p) => bt(p.n * (L / p.d))).join(' + ')}}{${bt(L)}} = \frac{${bt(L)}}{${bt(L)}} = ${tex(total)}`
            ]
            : [R`= ${tex(total)}`])
        ],
        n: R`確率の和は必ず $1$ です。$1$ になれば入力が正しいと分かります（分母が違う分数は**通分**して足します${L > 1n ? R`。共通の分母は $${bt(L)}$` : ''}）。`,
        easy: R`起こりうることをすべて数え上げれば、確率の合計はちょうど $1$（100 %）になります。もし $1$ にならなければ、確率の入力ミスか、場合の漏れがあります。`,
        lv: 2
      });

      steps.push({
        t: R`期待値 $E(X)$`,
        m: [
          R`E(X) = x_{1}p_{1} + x_{2}p_{2} + \cdots + x_{n}p_{n}`,
          R`= ${(n <= 6 ? xs.map((x, i) => (i ? ' + ' : '') + paren(x) + R` \times ` + paren(ps[i])).join('') : xs.slice(0, 3).map((x, i) => (i ? ' + ' : '') + paren(x) + R` \times ` + paren(ps[i])).join('') + R` + \cdots + ` + paren(xs[n - 1]) + R` \times ` + paren(ps[n - 1]))}`,
          R`= ${sumShow(prods)}`,
          R`= ${tex(mean)}`
        ],
        n: R`各値 $x_{i}$ と確率 $p_{i}$ をかけて、すべて足します。「値 × 確率」の合計が期待値です。`,
        easy: R`期待値は、**確率で重みをつけた平均**です。値の大きいものが起こりやすければ期待値は大きく、起こりにくければ小さくなります。くじなら、「1 回引くと平均していくらもらえるか」にあたります。たとえば値 ${plain(xs[n - 1])} が確率 ${plain(ps[n - 1])} で起こるなら、その分の寄与は ${plain(xs[n - 1])} × ${plain(ps[n - 1])} = ${plain(prods[n - 1])} です。`,
        pro: R`期待値は分布の「つり合う点（重心）」。図の ▲ の位置で左右がつり合います。`
      });

      steps.push({
        t: R`$E(X^{2})$ を求める`,
        m: [
          R`E(X^{2}) = x_{1}^{2}p_{1} + x_{2}^{2}p_{2} + \cdots + x_{n}^{2}p_{n}`,
          R`= ${sumShow(sqs)}`,
          R`= ${tex(E2)}`
        ],
        n: R`分散を求めるために、値を **2 乗した** ものの期待値を先に計算します。`,
        easy: R`期待値の計算で、値 $x_{i}$ のかわりに $x_{i}^{2}$ を使うだけです。確率 $p_{i}$ はそのままかけます。`,
        lv: 2
      });

      steps.push({
        t: R`分散 $V(X)$`,
        m: [
          R`V(X) = E(X^{2}) - \left\{E(X)\right\}^{2}`,
          R`= ${tex(E2)} - \left(${tex(mean)}\right)^{2} = ${tex(E2)} - ${tex(fMul(mean, mean))}`,
          R`= ${tex(vr)}`
        ],
        n: R`分散は「2 乗の期待値 − 期待値の 2 乗」で求まります。`,
        easy: R`**分散**は、値が期待値からどれくらい離れているか（散らばり）を表す数です。くじなら「当たり外れの幅の大きさ」で、分散が大きいほど、当たると大きいが外れも多い、というハイリスク・ハイリターンの傾向です。`,
        pro: R`定義どおり $V(X)=\sum (x_{i}-m)^{2}p_{i}$ ($m=E(X)$) でも求まる（検算に使える）。`
      });

      steps.push({
        t: '分散の定義どおりに確かめる',
        m: [
          R`V(X) = \sum (x_{i}-m)^{2}\,p_{i}\quad (m = E(X) = ${tex(mean)})`,
          R`= ${sumShow(devSq)} = ${tex(vr2)}`
        ],
        n: fEq(vr, vr2) ? R`$E(X^{2})-\{E(X)\}^{2}$ で求めた値 $${tex(vr)}$ と一致しました。` : R`一致しません。入力を確認してください。`,
        easy: R`分散には「各値と期待値との差を 2 乗して、確率をかけて足す」という定義どおりの計算方法もあります。2 通りで同じ値になれば、計算が合っています。`,
        lv: 2
      });

      steps.push({
        t: R`標準偏差 $\sigma(X)$`,
        m: [R`\sigma(X) = \sqrt{V(X)} = \sqrt{${tex(vr)}}`, R`= ${sdShow}`],
        n: R`標準偏差は分散の正の平方根です。値と同じ単位で散らばりを表します。`,
        easy: R`分散は 2 乗しているため単位も 2 乗になっています。平方根をとると元の単位にもどり、「期待値のまわり、どれくらいの幅で散らばっているか」が分かります。`
      });

      return {
        result: [
          { label: '確率の和', tex: R`${sumShow(ps, 6)} = ${tex(total)}` },
          { label: '期待値 E(X)', tex: R`E(X) = ${texA(mean)}` },
          { label: '分散 V(X)', tex: R`V(X) = ${texA(vr)}` },
          { label: '標準偏差 σ(X)', tex: R`\sigma(X) = ${sdShow}` }
        ],
        steps: steps,
        fig: distFig(xs, ps, mean)
      };
    }
  });
})();
