/* 数III・C — 極限
   数列の極限（分数式） / 等比数列・無限等比級数 / 関数の極限（分数式） / 三角関数の極限 / 自然対数の底 e
   構成は ia-quad.js に準拠（intro → result → steps(easy/pro/lv) → fig）。
   未習者（高1・高2）向けに、各計算機の冒頭に lv:3 の「そもそも〜とは」ステップと数値表を置く。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, P = JK.poly, U = JK.util;

  /* ================= 共通ヘルパー ================= */

  function fin(x) { return typeof x === 'number' && isFinite(x); }
  const SUPS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(s) { return String(s).split('').map((c) => SUPS[c] || c).join(''); }

  // 図（SVG 文字）用の数値表記
  function plain(x, d) {
    if (typeof x !== 'number' || isNaN(x)) return '—';
    if (!isFinite(x)) return x > 0 ? '∞' : '-∞';
    d = d == null ? 4 : d;
    const ax = Math.abs(x);
    if (ax !== 0 && (ax >= 1e7 || ax < Math.pow(10, -d))) {
      let e = Math.floor(Math.log10(ax)), m = x / Math.pow(10, e);
      if (Math.abs(Number(m.toFixed(2))) >= 10) { m /= 10; e += 1; }
      return m.toFixed(2) + '×10' + sup(e);
    }
    let s = x.toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }
  // TeX 用の近似値（有効数字 sig 桁程度）
  function num(x, sig) {
    if (!fin(x)) return U.fmt(x);
    sig = sig || 7;
    const ax = Math.abs(x);
    if (ax === 0) return '0';
    if (ax >= 1e7 || ax < 1e-4) return U.sig(x, sig - 1);
    return U.fmt(x, Math.min(10, Math.max(0, sig - 1 - Math.floor(Math.log10(ax)))));
  }
  // 分子 / 分母（分母が定数なら多項式として）
  function ratioTex(p, q) {
    if (P.deg(q) === 0) return P.tex(P.scale(p, q[0].inv()));
    return R`\frac{` + P.tex(p) + '}{' + P.tex(q) + '}';
  }
  function rpow(r) { return r.isInt() && r.sign() >= 0 ? r.tex() + '^{n}' : R`\left(` + r.tex() + R`\right)^{n}`; }
  // 有理数を図の文字に（分母が小さければ分数、そうでなければ小数）
  function plainQ(q) { return q.d === 1 ? String(q.n) : (q.d <= 999 && Math.abs(q.n) < 1e6 ? q.n + '/' + q.d : plain(q.val(), 5)); }

  // 表（SVG）。rows[0] が見出し行、各行の先頭が行ラベル。セルに配列を渡すと複数行
  function tw(s) { let w = 0; for (const ch of String(s)) w += /[ -~]/.test(ch) ? 6.8 : 12; return w; }
  function tableSvg(rows, opt) {
    opt = opt || {};
    const lh = 15;
    const lines = (c) => (Array.isArray(c) ? c : [c == null ? '' : String(c)]);
    const nc = rows.reduce((m, r) => Math.max(m, r.length), 0);
    const colW = [];
    for (let j = 0; j < nc; j++) {
      let w = opt.minW || 34;
      rows.forEach((r) => lines(r[j]).forEach((t) => { w = Math.max(w, tw(t) + 14); }));
      colW.push(Math.ceil(w));
    }
    const rowH = rows.map((r) => Math.max.apply(null, r.map((c) => lines(c).length)) * lh + 10);
    const capH = opt.caption ? 20 : 0;
    const W = colW.reduce((s, w) => s + w, 0) + 2;
    const tot = rowH.reduce((s, h) => s + h, 0);
    const d = JK.plot.draw(Math.max(W, opt.caption ? tw(opt.caption) + 12 : 0), tot + capH + 2);
    if (opt.caption) d.text(W / 2, 14, opt.caption, { size: 11, cls: 'dim' });
    const top = 1 + capH;
    d.rect(1, top, W - 2, rowH[0], { cls: 'dim', fill: 'f0', w: 0.6 });
    d.rect(1, top, W - 2, tot, { cls: 'dim', w: 1 });
    let y = top;
    rows.forEach((r, i) => {
      if (i > 0) d.line(1, y, W - 1, y, { cls: 'dim', w: 0.8 });
      let x = 1;
      for (let j = 0; j < nc; j++) {
        const ls = lines(r[j]);
        const cy = y + rowH[i] / 2 - (ls.length - 1) * lh / 2 + 4;
        ls.forEach((t, k) => { if (t !== '') d.text(x + colW[j] / 2, cy + k * lh, t, { size: 12, bold: i === 0 || j === 0 }); });
        x += colW[j];
      }
      y += rowH[i];
    });
    let x = 1;
    for (let j = 0; j < nc - 1; j++) {
      x += colW[j];
      if (j === 0 || opt.grid !== false) d.line(x, top, x, top + tot, { cls: 'dim', w: j === 0 ? 1.2 : 0.5 });
    }
    return d.svg();
  }

  // グラフの y 範囲: samples は外れ値を除いて使い、must は必ず含める
  function rangeY(samples, must) {
    const ys = samples.filter(fin).slice().sort((p, q) => p - q);
    const mm = (must || []).filter(fin);
    if (!ys.length && !mm.length) return [-1, 1];
    let lo, hi;
    if (ys.length) {
      lo = ys[0]; hi = ys[ys.length - 1];
      const tl = ys[Math.floor(0.05 * (ys.length - 1))], th = ys[Math.ceil(0.95 * (ys.length - 1))];
      if (th > tl && hi - lo > 5 * (th - tl)) { lo = tl - 0.5 * (th - tl); hi = th + 0.5 * (th - tl); }
    } else { lo = mm[0]; hi = mm[0]; }
    mm.forEach((y) => { lo = Math.min(lo, y); hi = Math.max(hi, y); });
    if (!(hi - lo > 1e-9)) { lo -= 1; hi += 1; }
    let span = hi - lo;
    if (lo > 0 && lo < 0.4 * span) lo = 0;
    if (hi < 0 && -hi < 0.4 * span) hi = 0;
    span = hi - lo;
    return [lo - 0.12 * span, hi + 0.12 * span];
  }
  function sample(f, x0, x1, n) {
    const out = [];
    n = n || 200;
    for (let k = 0; k <= n; k++) {
      let y;
      try { y = f(x0 + (x1 - x0) * k / n); } catch (e) { y = NaN; }
      if (fin(y)) out.push(y);
    }
    return out;
  }
  function clipSeg(s, x0, x1, y0, y1) {
    if (![s.x1, s.y1, s.x2, s.y2].every(fin)) return null;
    let t0 = 0, t1 = 1;
    const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
    const pq = [[-dx, s.x1 - x0], [dx, x1 - s.x1], [-dy, s.y1 - y0], [dy, y1 - s.y1]];
    for (let i = 0; i < 4; i++) {
      const p = pq[i][0], q = pq[i][1];
      if (p === 0) { if (q < 0) return null; continue; }
      const r = q / p;
      if (p < 0) { if (r > t1) return null; if (r > t0) t0 = r; } else { if (r < t0) return null; if (r < t1) t1 = r; }
    }
    return Object.assign({}, s, { x1: s.x1 + t0 * dx, y1: s.y1 + t0 * dy, x2: s.x1 + t1 * dx, y2: s.y1 + t1 * dy });
  }
  // JK.plot.graph の安全版（範囲外の点・非有限値を除く）
  function graph(o) {
    let x0 = o.x[0], x1 = o.x[1];
    if (!(fin(x0) && fin(x1) && x1 > x0)) { x0 = -5; x1 = 5; }
    o.x = [x0, x1];
    if (!o.y || !(fin(o.y[0]) && fin(o.y[1]) && o.y[1] > o.y[0])) {
      let s = [];
      (o.curves || []).forEach((c) => {
        const d0 = Math.max(x0, c.domain ? c.domain[0] : x0), d1 = Math.min(x1, c.domain ? c.domain[1] : x1);
        if (d1 > d0) s = s.concat(sample(c.f, d0, d1));
      });
      o.y = rangeY(s, o.mustY || []);
    }
    delete o.mustY;
    const y0 = o.y[0], y1 = o.y[1];
    const inX = (x) => fin(x) && x >= x0 - 1e-9 && x <= x1 + 1e-9, inY = (y) => fin(y) && y >= y0 && y <= y1;
    o.points = (o.points || []).filter((p) => inX(p.x) && inY(p.y));
    o.labels = (o.labels || []).filter((l) => inX(l.x) && inY(l.y));
    o.vlines = (o.vlines || []).filter((l) => inX(l.x));
    o.hlines = (o.hlines || []).filter((l) => inY(l.y));
    o.segs = (o.segs || []).map((s) => clipSeg(s, x0, x1, y0, y1)).filter(Boolean);
    const big = (y1 - y0) * 3;
    o.fills = (o.fills || []).filter((f) => fin(f.from) && fin(f.to)).map((f) => {
      const safe = (h) => (x) => { let y; try { y = h(x); } catch (e) { y = 0; } return fin(y) ? Math.max(y0 - big, Math.min(y1 + big, y)) : 0; };
      return Object.assign({}, f, { f: safe(f.f), g: f.g ? safe(f.g) : null });
    });
    return JK.plot.graph(o);
  }

  // c·v^e（e は整数。負なら分母へ）を { neg, body } に
  function mono(c, e, v) {
    const a = c.abs();
    let body;
    if (e === 0) body = a.tex();
    else if (e > 0) body = (a.eq(1) ? '' : a.tex()) + vpow(v, e);
    else body = R`\frac{` + a.n + '}{' + (a.d === 1 ? '' : a.d) + vpow(v, -e) + '}';
    return { neg: c.sign() < 0, body: body };
  }
  function vpow(v, k) { return k === 0 ? '1' : (k === 1 ? v : v + '^{' + k + '}'); }
  function sumTex(items) {
    if (!items.length) return '0';
    return items.map((t, i) => (i === 0 ? (t.neg ? '-' : '') : (t.neg ? ' - ' : ' + ')) + t.body).join('');
  }
  // 多項式の各項を v^k で割った式
  function dividedTex(p, k, v) {
    const items = [];
    for (let i = p.length - 1; i >= 0; i--) if (!p[i].isZero()) items.push(mono(p[i], i - k, v));
    return sumTex(items);
  }
  function termCount(p) { return p.filter((c) => !c.isZero()).length; }
  // 多項式に x = a を代入した式（途中式用）
  function substTex(p, a) {
    const base = (a.sign() < 0 || !a.isInt()) ? R`\left(` + a.tex() + R`\right)` : a.tex();
    const items = [];
    for (let k = p.length - 1; k >= 0; k--) {
      const c = p[k];
      if (c.isZero()) continue;
      let body;
      if (k === 0) body = c.abs().tex();
      else {
        const pw = k === 1 ? base : base + '^{' + k + '}';
        body = c.abs().eq(1) ? pw : c.abs().tex() + R` \cdot ` + pw;
      }
      items.push({ neg: c.sign() < 0, body: body });
    }
    return sumTex(items);
  }
  // x - a の TeX
  function xMinus(a) { return a.isZero() ? 'x' : (a.sign() > 0 ? 'x - ' + a.tex() : 'x + ' + a.neg().tex()); }
  // (x - a)^k · poly を因数分解の形で
  function factTex(k, a, poly) {
    const lin = a.isZero() ? vpow('x', k) : (k === 1 ? R`\left(` + xMinus(a) + R`\right)` : R`\left(` + xMinus(a) + R`\right)^{` + k + '}');
    if (k === 0) return P.tex(poly);
    const n = termCount(poly);
    if (P.deg(poly) === 0) {
      const c = poly[0];
      if (c.eq(1) && k === 1) return xMinus(a);
      return (c.eq(1) ? '' : (c.eq(-1) ? '-' : c.tex())) + lin;
    }
    if (n === 1) return P.tex(poly) + lin;
    return lin + R`\left(` + P.tex(poly) + R`\right)`;
  }
  function paren(q) { return q.sign() < 0 ? R`\left(` + q.tex() + R`\right)` : q.tex(); }
  // a x の TeX と、関数の引数としての書き方
  function axTex(a) { return P.tex([Q(0), a]); }
  function argOf(t) { return t.charAt(0) === '-' ? R`\left(` + t + R`\right)` : ' ' + t; }

  /* ================= 1. 数列の極限（分数式） ================= */

  JK.registerCalc({
    id: 'iiic-lim-seq',
    course: 'IIIC',
    unit: 'm-limit',
    group: '極限',
    title: '数列の極限（分数式）',
    desc: R`分子・分母が $n$ の多項式である数列 $a_{n} = \dfrac{p(n)}{q(n)}$ の $n \to \infty$ での極限を、分母の最高次の項で割る方法で求めます。大きな $n$ での数値表と点列のグラフも表示します。`,
    form: R`\lim_{n \to \infty} \frac{p(n)}{q(n)}`,
    inputs: [
      { key: 'p', label: '分子 $p(n)$', type: 'poly', var: 'n', def: '3n^2 + 2n - 1', hint: '例: 3n^2 + 2n - 1、(2n+1)(n-1)' },
      { key: 'q', label: '分母 $q(n)$', type: 'poly', var: 'n', def: 'n^2 + 5' }
    ],
    examples: [
      { label: '分母の次数が大きい', v: { p: '2n + 1', q: 'n^2 - 3' } },
      { label: '分子の次数が大きい', v: { p: '-n^3 + n', q: '2n^2 + 1' } },
      { label: '積の形', v: { p: '(2n+1)(n-1)', q: '3n^2' } }
    ],
    intro: {
      easy: R`数列 $a_{1},\ a_{2},\ a_{3},\ \ldots$ で、番号 $n$ をどんどん大きくしたとき $a_{n}$ がどんな値に近づくかを調べるのが**数列の極限**です。分数の形の数列では、$n$ が大きくなると分子も分母も大きくなるので「どちらがどれだけ速く大きくなるか」の勝負になります。勝負を決めるのは、それぞれの多項式の**いちばん次数の高い項（最高次の項）**です。グラフの点列が、ある高さの横線にだんだん近づいていく様子もあわせて見てください。`,
      normal: R`分母の最高次の項で分子・分母を割り、$\lim_{n \to \infty} \frac{1}{n^{k}} = 0$ を使って極限を求めます。`,
      pro: R`次数の比較で結論は即答できますが、答案では割る過程を明示します。$\frac{\infty}{\infty}$ 型は「最高次でくくる」、根号を含む $\infty - \infty$ 型は「有理化してから最高次でくくる」が定石です。`
    },
    compute(v) {
      const p = v.p, q = v.q;
      if (P.isZero(q)) throw new JK.CalcError('分母 q(n) が 0 になっています。0 でない多項式を入力してください');
      const dp = P.deg(p), dq = P.deg(q);
      if (dp > 8 || dq > 8) throw new JK.CalcError('次数は 8 以下で入力してください');
      const pz = P.isZero(p);
      const pT = P.tex(p, 'n'), qT = P.tex(q, 'n');
      const an = (n) => { const d = P.eval(q, n); return d === 0 ? NaN : P.eval(p, n) / d; };
      const lq = q[dq], lp = pz ? Q(0) : p[dp];
      let kind, limTex, limVal;
      let limTxt = '0';
      if (pz || dp < dq) { kind = 'zero'; limTex = '0'; limVal = 0; }
      else if (dp === dq) { const L = lp.div(lq); kind = 'ratio'; limTex = L.tex(); limVal = L.val(); limTxt = plainQ(L); }
      else if (lp.div(lq).sign() > 0) { kind = 'pinf'; limTex = R`\infty`; limVal = Infinity; }
      else { kind = 'minf'; limTex = R`-\infty`; limVal = -Infinity; }
      const conv = kind === 'zero' || kind === 'ratio';

      const NS = [10, 100, 1000, 10000];
      const trend = {
        zero: R`$0$ に近づいていく`,
        ratio: R`$` + limTex + R`$ に近づいていく`,
        pinf: 'どんどん大きくなっていく',
        minf: '負の向きに絶対値がどんどん大きくなっていく'
      }[kind];
      const steps = [{
        t: R`そもそも「数列の極限」とは — 大きな $n$ で確かめる`,
        m: NS.map((n) => { const y = an(n); return R`a_{` + n + '}' + (fin(y) ? (Number.isInteger(y) ? ' = ' + y : R` \fallingdotseq ` + num(y)) : R`\ \text{は分母が 0 で定義されない}`); }),
        n: R`$n$ を $1,\ 2,\ 3,\ \ldots$ と限りなく大きくしたとき、$a_{n}$ がある値 $\alpha$ に限りなく近づくなら「$a_{n}$ は $\alpha$ に**収束**する」といい、$\lim_{n \to \infty} a_{n} = \alpha$ と書きます。そうでないときは**発散**するといいます。まず $n = 10,\ 100,\ 1000,\ 10000$ を代入して様子を見ます。`,
        easy: R`$\infty$（無限大）は数ではなく「限りなく大きくなっていく」という状態を表す記号です。表を見ると、$a_{n}$ は ` + trend + R`ことが読み取れます。これを式の変形で確かめます。`,
        fig: tableSvg([['n'].concat(NS.map(String)), ['aₙ'].concat(NS.map((n) => plain(an(n), 5)))], { caption: 'aₙ = p(n) / q(n) の値' }),
        lv: 3
      }];

      if (dq === 0) {
        steps.push({
          t: '分母は定数',
          m: R`a_{n} = \frac{` + pT + '}{' + qT + '} = ' + P.tex(P.scale(p, lq.inv()), 'n'),
          n: R`分母 $q(n) = ` + qT + R`$ は $n$ を含まない定数なので、$a_{n}$ は $n$ の多項式（または定数）です。`,
          easy: R`多項式は、$n$ を大きくすると最高次の項に引っぱられて限りなく大きく（または負の向きに大きく）なります。定数なら、ずっと同じ値のままです。`
        });
      } else {
        const ld = mono(lq, dq, 'n');
        const leadT = (ld.neg ? '-' : '') + ld.body;
        const big = lq.val() * Math.pow(1000, dq), rest = P.eval(q, 1000) - big;
        steps.push({
          t: R`分母の最高次の項 $` + vpow('n', dq) + R`$ で分子・分母を割る`,
          m: [
            R`a_{n} = \frac{` + pT + '}{' + qT + '}',
            R`= \frac{\left(` + pT + R`\right) \div ` + vpow('n', dq) + R`}{\left(` + qT + R`\right) \div ` + vpow('n', dq) + '}',
            R`= \frac{` + dividedTex(p, dq, 'n') + '}{' + dividedTex(q, dq, 'n') + '}'
          ],
          n: R`分母の最高次の項は $` + leadT + R`$ です。分数の分子と分母を同じ $` + vpow('n', dq) + R`$ で割っても値は変わりません。割ると、分母は「定数 $` + lq.tex() + R`$ と、0 に近づく項の和」の形になります。`,
          easy: termCount(q) === 1
            ? R`分母は $` + qT + R`$ の 1 項だけなので、割るとちょうど定数 $` + lq.tex() + R`$ になります。分子の各項は $` + vpow('n', dq) + R`$ で割ると、$n$ の指数が ` + dq + R` ずつ下がります。`
            : R`$n$ が大きいとき、多項式の値はほぼ最高次の項だけで決まります。たとえば $n = 1000$ のとき、分母の最高次の項 $` + leadT + R`$ の値は $` + num(big) + R`$ で、残りの項の合計は $` + num(rest) + R`$ にすぎません。最高次の項で割るのは、この「主役」を取り出す操作です。`,
          pro: R`分母の最高次で割るのが定石です。分子の次数の方が高いときは、分子の最高次でくくって「$n^{k} \times (\text{定数に近づく式})$」と見ても同じ結論になります。`
        });
        let limLine, nn;
        if (kind === 'zero') {
          limLine = R`\lim_{n \to \infty} a_{n} = \frac{0}{` + lq.tex() + '} = 0';
          nn = R`分子の項はすべて分母に $n$ が残るので 0 に近づき、分母は $` + lq.tex() + R`$ に近づきます。`;
        } else if (kind === 'ratio') {
          const fr = R`\frac{` + lp.tex() + '}{' + lq.tex() + '}';
          limLine = R`\lim_{n \to \infty} a_{n} = ` + fr + (fr === limTex ? '' : ' = ' + limTex);
          nn = R`分子は最高次の係数 $` + lp.tex() + R`$ に、分母は $` + lq.tex() + R`$ に近づきます。`;
        } else {
          const lead = mono(lp, dp - dq, 'n');
          limLine = R`\text{分子} \to ` + (lp.sign() > 0 ? R`\infty` : R`-\infty`) + R`,\quad \text{分母} \to ` + lq.tex();
          nn = R`分子には $n$ の正の累乗の項 $` + (lead.neg ? '-' : '') + lead.body + R`$ が残るので、分子の絶対値は限りなく大きくなります。分母は $` + lq.tex() + R`$ に近づきます。`;
        }
        steps.push({
          t: R`$n \to \infty$ で 0 に近づく項を消す`,
          m: [R`\lim_{n \to \infty} \frac{1}{n^{k}} = 0 \quad (k = 1,\ 2,\ 3,\ \ldots)`, limLine],
          n: nn,
          easy: R`$\frac{1}{n}$ は $n = 10$ で $0.1$、$n = 100$ で $0.01$、$n = 1000$ で $0.001$ と、0 に限りなく近づきます。分母に $n$ が残っている項（$\frac{5}{n^{2}}$ など）はすべて 0 に近づくので、最後に残るのは $n$ を含まない項（と、分子に残った $n$ の累乗の項）だけです。`
        });
      }
      const concl = {
        zero: pz ? R`分子が常に 0 なので、$a_{n} = 0$ です。` : R`分母の次数（` + dq + R`）の方が分子の次数（` + dp + R`）より大きいので、$a_{n}$ は 0 に収束します。`,
        ratio: R`分子と分母の次数が等しいので、極限は最高次の係数の比 $\frac{` + lp.tex() + '}{' + lq.tex() + R`}$ です。`,
        pinf: R`分子の次数の方が大きいので発散します。最高次の係数の比 $\frac{` + lp.tex() + '}{' + lq.tex() + R`}$ が正なので、正の無限大に発散します。`,
        minf: R`分子の次数の方が大きいので発散します。最高次の係数の比 $\frac{` + lp.tex() + '}{' + lq.tex() + R`}$ が負なので、負の無限大に発散します。`
      }[kind];
      steps.push({
        t: '結論',
        m: R`\lim_{n \to \infty} \frac{` + pT + '}{' + qT + '} = ' + limTex,
        n: concl,
        easy: conv
          ? R`点列のグラフで、点が高さ $` + limTex + R`$ の横線に近づいていく様子が「収束」です。`
          : R`分子だけが限りなく大きくなり、分母は一定の値に近づくので、全体の絶対値も限りなく大きくなります。グラフの点は上（または下）へどこまでも離れていきます。`,
        pro: R`次数で即判定: （分子の次数）$<$（分母の次数）なら 0、等しいなら最高次の係数の比、（分子の次数）$>$（分母の次数）なら $\pm\infty$ に発散。`
      });

      let lastN = 10000;
      while (!fin(an(lastN))) lastN++;
      const N = 24, pts = [], tail = [];
      for (let n = 1; n <= N; n++) {
        const y = an(n);
        if (!fin(y)) continue;
        pts.push({ x: n, y: y, cls: 'c1' });
        if (n >= 2) tail.push(y);
      }
      return {
        result: [
          { label: '極限', tex: R`\lim_{n \to \infty} a_{n} = ` + limTex },
          { label: '判定', tex: conv ? R`\text{収束する}` : (kind === 'pinf' ? R`\text{正の無限大に発散}` : R`\text{負の無限大に発散}`) },
          { label: 'n = ' + lastN + ' での値', tex: R`a_{` + lastN + R`} \fallingdotseq ` + num(an(lastN)) }
        ],
        steps: steps,
        fig: graph({
          x: [0, N + 1], y: rangeY(tail, conv ? [limVal] : []), axis: ['n', 'aₙ'],
          curves: [{ f: (x) => P.eval(p, x) / P.eval(q, x), cls: 'dim', dash: true, domain: [1, N] }],
          hlines: conv ? [{ y: limVal, cls: 'c3', label: '極限 ' + limTxt }] : [],
          points: pts
        })
      };
    }
  });

  /* ================= 2. 等比数列・無限等比級数 ================= */

  function recurring(a, r) {
    for (let k = 1; k <= 6; k++) {
      const p10 = Math.pow(10, k);
      if (r.eq(Q(1, p10))) {
        const m = a.mul(p10);
        if (m.isInt() && m.n > 0 && m.n < p10) return { k: k, m: m.n, digits: String(m.n).padStart(k, '0') };
      }
    }
    return null;
  }

  JK.registerCalc({
    id: 'iiic-lim-geom',
    course: 'IIIC',
    unit: 'm-limit',
    group: '極限',
    title: '等比数列の極限・無限等比級数',
    desc: R`初項 $a$、公比 $r$ の等比数列について、$r^{n}$ の極限（公比による場合分け）と、無限等比級数 $a + ar + ar^{2} + \cdots$ の収束・発散と和を求めます。循環小数を分数に直す計算にも使えます。`,
    form: [R`\lim_{n \to \infty} r^{n}`, R`\sum_{n=1}^{\infty} ar^{n-1} = \frac{a}{1-r} \quad (-1 < r < 1)`],
    inputs: [
      { key: 'a', label: '初項 $a$', type: 'q', def: '1' },
      { key: 'r', label: '公比 $r$', type: 'q', def: '1/2' }
    ],
    examples: [
      { label: '循環小数 0.333…', v: { a: '3/10', r: '1/10' } },
      { label: '循環小数 0.1212…', v: { a: '12/100', r: '1/100' } },
      { label: '負の公比', v: { a: '2', r: '-1/2' } },
      { label: '発散する例', v: { a: '1', r: '2' } }
    ],
    intro: {
      easy: R`**等比数列**は、最初の数（初項 $a$）に同じ数（公比 $r$）を次々に掛けてできる数の列です。たとえば $a = 1,\ r = \frac{1}{2}$ なら $1,\ \frac{1}{2},\ \frac{1}{4},\ \frac{1}{8},\ \ldots$ です。これを**限りなく足し続けた**ものを**無限等比級数**といいます。無限個を足しても、足す数がどんどん小さくなれば合計はある値に落ち着くことがあります。長さ 2 の道のりを「残りの半分ずつ」進むと、どれだけ進んでも 2 には届かないけれど限りなく 2 に近づく — これが $1 + \frac{1}{2} + \frac{1}{4} + \cdots = 2$ のイメージです。`,
      normal: R`$r^{n}$ の極限は $|r| < 1$ で 0。無限等比級数は「$a = 0$ または $|r| < 1$」のとき収束し、和は $\frac{a}{1-r}$ です。`,
      pro: R`無限等比級数の収束条件「$a = 0$ または $-1 < r < 1$」は、公比に文字を含む問題で頻出。$a = 0$ の場合を落とさないこと。`
    },
    compute(v) {
      const a = v.a, r = v.r;
      const rc = r.abs().cmp(1) < 0 ? 'zero' : (r.eq(1) ? 'one' : (r.cmp(1) > 0 ? 'inf' : 'osc'));
      const azero = a.isZero();
      const conv = azero || rc === 'zero';
      const S = conv ? (azero ? Q(0) : a.div(Q(1).sub(r))) : null;
      const av = a.val(), rv = r.val();
      const an = (n) => av * Math.pow(rv, n - 1);
      const Sn = (n) => (r.eq(1) ? n * av : av * (1 - Math.pow(rv, n)) / (1 - rv));
      // 最初の数項（厳密値。大きすぎるときは近似値）
      let termsT;
      try {
        const ts = [];
        let t = a;
        for (let n = 1; n <= 4; n++) { ts.push(t.tex()); t = t.mul(r); }
        termsT = ts.join(R`,\ `);
      } catch (e) {
        if (!(e instanceof JK.CalcError)) throw e;
        termsT = [1, 2, 3, 4].map((n) => num(an(n), 4)).join(R`,\ `);
      }
      const NS = [1, 2, 3, 4, 5, 10, 20];
      const steps = [{
        t: 'そもそも等比数列・無限等比級数とは — 部分和の表',
        m: [R`a_{n} = ar^{n-1}:\quad ` + termsT + R`,\ \ldots`, R`S_{n} = a_{1} + a_{2} + \cdots + a_{n}`],
        n: R`初項 $a = ` + a.tex() + R`$ に公比 $r = ` + r.tex() + R`$ を次々に掛けた数列です。すべての項を限りなく足した $a + ar + ar^{2} + \cdots$ を**無限等比級数**といいます。「無限に足す」は直接はできないので、$n$ 項までの和（**部分和**）$S_{n}$ を求めて、$n \to \infty$ での極限を考えます。`,
        easy: R`表の $S_{n}$ の行を見てください。` + (conv ? R`$n$ を大きくすると $S_{n}$ はある値に落ち着いていきます。` : R`$n$ を大きくしても $S_{n}$ は一つの値に落ち着きません。`) + R`これを $r^{n}$ の極限を使って確かめます。`,
        fig: tableSvg([['n', 'aₙ', 'Sₙ']].concat(NS.map((n) => [String(n), plain(an(n), 7), plain(Sn(n), 7)])), { caption: '項 aₙ と部分和 Sₙ' }),
        lv: 3
      }];
      const caseText = { zero: R`$-1 < r < 1$`, one: R`$r = 1$`, inf: R`$r > 1$`, osc: R`$r \le -1$` }[rc];
      const rnTex = { zero: '0', one: '1', inf: R`\infty`, osc: R`\text{振動する（極限はない）}` }[rc];
      steps.push({
        t: R`$r^{n}$ の極限（公比で場合分け）`,
        m: [
          R`\lim_{n \to \infty} r^{n} = \begin{cases} 0 & (-1 < r < 1) \\ 1 & (r = 1) \\ \infty & (r > 1) \\ \text{振動する（極限はない）} & (r \le -1) \end{cases}`,
          R`r = ` + r.tex() + R` \;\Rightarrow\; \lim_{n \to \infty} ` + rpow(r) + ' = ' + rnTex
        ],
        n: R`公比 $r = ` + r.tex() + R`$ は ` + caseText + R` の場合です。`,
        easy: R`絶対値が 1 より小さい数は、掛けるたびに絶対値が小さくなります（$\left(\frac{1}{2}\right)^{n}$ は $\frac{1}{2},\ \frac{1}{4},\ \frac{1}{8},\ \ldots$ と半分ずつ）。絶対値が 1 より大きいと、掛けるたびに大きくなります。$r$ が負だと符号が $+,\ -,\ +,\ -$ と交互に変わるので、$r \le -1$ では一つの値に近づきません。`
      });
      if (!r.eq(1)) {
        const C = a.div(Q(1).sub(r));
        steps.push({
          t: R`部分和 $S_{n}$ の公式に代入`,
          m: [
            R`S_{n} = \frac{a(1 - r^{n})}{1 - r}`,
            R`= \frac{` + paren(a) + R`\left\{1 - ` + rpow(r) + R`\right\}}{1 - ` + paren(r) + '}',
            R`= ` + (C.eq(1) ? '' : (C.eq(-1) ? '-' : C.tex())) + R`\left\{1 - ` + rpow(r) + R`\right\}`
          ],
          n: R`$r \ne 1$ のときの等比数列の和の公式です（数学Bで学びます）。`,
          easy: R`$S_{n} = a + ar + \cdots + ar^{n-1}$ と、それに $r$ を掛けた $rS_{n} = ar + ar^{2} + \cdots + ar^{n}$ を並べて引くと、真ん中の項がすべて打ち消し合い $(1 - r)S_{n} = a - ar^{n}$ だけが残ります。これを $1 - r$ で割ったのが公式です。`,
          lv: 2
        });
      } else {
        steps.push({
          t: R`部分和 $S_{n}$（公比 1）`,
          m: R`S_{n} = a + a + \cdots + a = na = ` + (a.eq(1) ? '' : (a.eq(-1) ? '-' : a.tex())) + 'n',
          n: R`公比が 1 なので、同じ数 $a = ` + a.tex() + R`$ を $n$ 回足すことになります。`,
          easy: R`同じ数をくり返し足すだけなので、和は $n$ 倍です。`,
          lv: 2
        });
      }
      let st;
      if (azero) {
        st = {
          t: '収束・発散の判定と和',
          m: R`0 + 0 + 0 + \cdots = 0`,
          n: R`初項が 0 なので、すべての項が 0 です。公比によらず級数は 0 に収束します。`,
          easy: R`0 を何回足しても 0 です。`
        };
      } else if (rc === 'zero') {
        st = {
          t: '収束・発散の判定と和',
          m: [
            R`\lim_{n \to \infty} S_{n} = \frac{a}{1 - r}\left(1 - \lim_{n \to \infty} r^{n}\right) = \frac{a}{1 - r}`,
            R`= \frac{` + a.tex() + R`}{1 - ` + paren(r) + R`} = ` + S.tex()
          ],
          n: R`$|r| < 1$ なので $r^{n} \to 0$。よって無限等比級数は**収束**し、和は $\frac{a}{1 - r} = ` + S.tex() + R`$ です。`,
          easy: R`$S_{n}$ と和 $` + S.tex() + R`$ との差は $\frac{a}{1-r} \cdot r^{n}$ で、$n$ が 1 増えるたびに $r$ 倍（絶対値が縮む）になります。「残りの距離」が毎回縮み続けるので、部分和は和に限りなく近づきます。`,
          pro: R`無限等比級数 $\sum_{n=1}^{\infty} ar^{n-1}$ は「$a = 0$ または $-1 < r < 1$」のとき収束し、$a \ne 0$ なら和は $\frac{a}{1-r}$。`
        };
      } else {
        const why = {
          one: R`$S_{n} = ` + a.tex() + R`n$ は $n$ に比例して限りなく大きく（$a < 0$ なら負の向きに大きく）なります。`,
          inf: R`$r^{n} \to \infty$ なので $S_{n}$ の絶対値は限りなく大きくなります。`,
          osc: r.eq(-1) ? R`$S_{n}$ は $` + a.tex() + R`,\ 0,\ ` + a.tex() + R`,\ 0,\ \ldots$ と交互に変わり、一つの値に近づきません（振動）。` : R`$r^{n}$ は符号を変えながら絶対値が大きくなるので、$S_{n}$ は振動しながら発散します。`
        }[rc];
        st = {
          t: '収束・発散の判定',
          m: R`r = ` + r.tex() + R` \;\Rightarrow\; \text{無限等比級数は発散する}`,
          n: why + R`よってこの無限等比級数は**発散**し、和はありません。`,
          easy: R`足す数が小さくならない（むしろ大きくなる、あるいは大きさが変わらない）ので、合計は一つの値に落ち着きません。`,
          pro: R`収束条件 $-1 < r < 1$ を満たしていません（$a \ne 0$）。`
        };
      }
      steps.push(st);
      const rec = recurring(a, r);
      if (rec) {
        const p10 = Math.pow(10, rec.k), D = rec.digits;
        const dotted = rec.k === 1 ? R`\dot{` + D + '}' : R`\dot{` + D.charAt(0) + '}' + D.slice(1, -1) + R`\dot{` + D.charAt(D.length - 1) + '}';
        const piece = (j) => '0.' + '0'.repeat(rec.k * j) + D;
        steps.push({
          t: '循環小数を分数で表す',
          m: [
            R`0.` + dotted + ' = ' + piece(0) + ' + ' + piece(1) + ' + ' + piece(2) + R` + \cdots`,
            R`= \frac{` + rec.m + '}{' + p10 + R`} + \frac{` + rec.m + '}{' + p10 + R`} \cdot \frac{1}{` + p10 + R`} + \cdots`,
            R`= \frac{` + a.tex() + R`}{1 - \frac{1}{` + p10 + R`}} = \frac{` + rec.m + '}{' + (p10 - 1) + '}' + (Q(rec.m, p10 - 1).d !== p10 - 1 ? ' = ' + S.tex() : '')
          ],
          n: R`くり返す部分 $` + D + R`$ を初項、$\frac{1}{` + p10 + R`}$ を公比とする無限等比級数として計算できます。`,
          easy: R`循環小数 $0.` + dotted + R`$ は、くり返しのかたまりを ` + rec.k + R` 桁ずつずらして足したものです。公比 $\frac{1}{` + p10 + R`}$ は 1 より小さいので、この級数は収束します。`,
          pro: R`$0.\dot{a}\dot{b} = \frac{ab}{99}$ のように「くり返し部分 ÷ 9 を桁数だけ並べた数」で即答できます。`
        });
      }

      const N = conv ? 20 : 12, pts = [], segs = [];
      for (let n = 1; n <= N; n++) {
        pts.push({ x: n, y: Sn(n), cls: 'c1' });
        if (n < N) segs.push({ x1: n, y1: Sn(n), x2: n + 1, y2: Sn(n + 1), cls: 'dim', dash: true });
      }
      return {
        result: [
          { label: 'rⁿ の極限', tex: rc === 'osc' ? rpow(r) + R`\text{ は振動（極限なし）}` : R`\lim_{n \to \infty} ` + rpow(r) + ' = ' + rnTex },
          { label: '無限等比級数', tex: conv ? R`\text{収束する}` : R`\text{発散する}` },
          { label: '和', tex: conv ? 'S = ' + S.tex() + (S.isInt() ? '' : R` \fallingdotseq ` + num(S.val())) : R`\text{なし（発散）}` }
        ],
        steps: steps,
        fig: graph({
          x: [0, N + 1], y: rangeY(pts.slice(2).map((p) => p.y), conv ? [S.val(), Sn(1)] : [Sn(1)]), axis: ['n', 'Sₙ'],
          points: pts, segs: segs,
          hlines: conv ? [{ y: S.val(), cls: 'c3', label: '和 ' + plainQ(S) }] : []
        })
      };
    }
  });

  /* ================= 3. 関数の極限（分数式） ================= */

  function fnLimAt(p, q, a) {
    const pT = P.tex(p), qT = P.tex(q), fT = R`\frac{` + pT + '}{' + qT + '}';
    const f = (x) => { const d = P.eval(q, x); return d === 0 ? NaN : P.eval(p, x) / d; };
    const av = a.val();
    const lin = [a.neg(), Q(1)];
    const pa = P.eval(p, a), qa = P.eval(q, a);
    const steps = [];
    const hs = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1];
    steps.push({
      t: R`そもそも「関数の極限」とは — $x$ を $` + a.tex() + R`$ に近づけてみる`,
      m: [R`f(x) = ` + fT, R`f(` + num(av - 0.001) + R`) \fallingdotseq ` + num(f(av - 0.001)) + R`,\quad f(` + num(av + 0.001) + R`) \fallingdotseq ` + num(f(av + 0.001))],
      n: R`$x$ を $a$ に限りなく近づけたとき（$x \ne a$ のまま）、$f(x)$ がある値 $L$ に限りなく近づくなら $\lim_{x \to a} f(x) = L$ と書きます。左右両側から近づけて表で確かめます。`,
      easy: R`ポイントは「$x = a$ ちょうどの値」ではなく「$a$ のすぐ近くでの様子」を見ることです。$x = a$ では分母が 0 になって計算できなくても、近くの値が一定の値に近づけば極限は存在します。`,
      fig: tableSvg([['x'].concat(hs.map((h) => plain(av + h, 6))), ['f(x)'].concat(hs.map((h) => plain(f(av + h), 5)))], { caption: 'x を ' + plainQ(a) + ' に左右から近づけたときの f(x)' }),
      lv: 3
    });
    const subLine = (name, poly, val) => name + '(' + a.tex() + ') = ' + (P.deg(poly) <= 0 ? val.tex() : substTex(poly, a) + ' = ' + val.tex());
    const sub = {
      t: R`$x = ` + a.tex() + R`$ を代入してみる`,
      m: [subLine('p', p, pa), subLine('q', q, qa)]
    };
    steps.push(sub);
    let L = null, kind, p1 = p, q1 = q, k = 0, sR = 0, sL = 0;
    if (P.isZero(p)) {
      kind = 'cont';
      L = Q(0);
      sub.n = R`分子が常に 0 なので、$f(x) = 0$（分母が 0 になる点を除く）。極限は 0 です。`;
      sub.easy = R`0 を 0 でない数で割ると 0 です。`;
    } else if (!qa.isZero()) {
      kind = 'cont';
      L = pa.div(qa);
      sub.n = R`分母が 0 にならないので、そのまま代入した値 $\frac{` + pa.tex() + '}{' + qa.tex() + '} = ' + L.tex() + R`$ が極限です。`;
      sub.easy = R`グラフがつながっている（**連続**な）ところでは、近づく先は代入した値と一致します。`;
    } else {
      if (pa.isZero()) {
        kind = 'zz';
        sub.n = R`$\frac{0}{0}$ の形（**不定形**）になりました。このままでは値が決まりません。`;
        sub.easy = R`「0 に近い数 ÷ 0 に近い数」は、近づく速さの比によって何にでもなり得ます（$0.001 \div 0.002 = 0.5$、$0.001 \div 0.000001 = 1000$）。だから式を変形して、0 になる原因を取り除きます。`;
        while (P.eval(p1, a).isZero() && P.eval(q1, a).isZero()) {
          p1 = P.divmod(p1, lin).q; q1 = P.divmod(q1, lin).q; k++;
        }
        const fl = (name, T, poly1) => { const ft = factTex(k, a, poly1); return name + '(x) = ' + T + (ft === T ? '' : ' = ' + ft); };
        steps.push({
          t: R`因数 $` + xMinus(a) + R`$ をくくり出す`,
          m: [fl('p', pT, p1), fl('q', qT, q1)],
          n: R`$p(` + a.tex() + R`) = 0,\ q(` + a.tex() + R`) = 0$ なので、因数定理により分子も分母も $` + xMinus(a) + R`$ で割り切れます（組立除法・筆算で割ります）。`,
          easy: R`**因数定理**: 多項式 $p(x)$ に $x = a$ を代入して 0 になるなら、$p(x)$ は $(x - a)$ を因数にもちます。分子と分母の両方が 0 になったのは、この共通の因数が原因です。`,
          pro: R`$\frac{0}{0}$ 型の分数式は「共通因数で約分」。無理式なら「有理化」、三角関数なら $\frac{\sin\theta}{\theta}$ への帰着が定石です。`
        });
        steps.push({
          t: '約分する',
          m: R`f(x) = \frac{` + factTex(k, a, p1) + '}{' + factTex(k, a, q1) + '} = ' + ratioTex(p1, q1) + R` \quad (x \ne ` + a.tex() + ')',
          n: R`$x \ne ` + a.tex() + R`$ では $` + xMinus(a) + R` \ne 0$ なので約分できます。`,
          easy: R`$x$ は $` + a.tex() + R`$ に近づくだけで、$` + a.tex() + R`$ そのものにはなりません。だから $` + xMinus(a) + R` \ne 0$ で、約分してかまいません。グラフでいうと、$x = ` + a.tex() + R`$ の 1 点だけ**穴があいた**曲線で、約分した式はその穴を埋めた曲線です。`
        });
      } else {
        kind = 'pole';
        sub.n = R`分母だけが 0 に近づき、分子は 0 でない値 $` + pa.tex() + R`$ に近づきます。`;
        sub.easy = R`「0 でない数 ÷ 0 に近い数」は絶対値がどんどん大きくなります（$1 \div 0.001 = 1000$、$1 \div 0.000001 = 1000000$）。符号は左右で変わることがあるので、両側を別々に調べます。`;
      }
      const p1a = P.eval(p1, a), q1a = P.eval(q1, a);
      if (!q1a.isZero()) {
        L = p1a.div(q1a);
        const rt = ratioTex(p1, q1);
        const rs = P.deg(q1) === 0 ? substTex(P.scale(p1, q1[0].inv()), a) : R`\frac{` + substTex(p1, a) + '}{' + substTex(q1, a) + '}';
        steps.push({
          t: '改めて代入する',
          m: R`\lim_{x \to ` + a.tex() + R`} f(x) = \lim_{x \to ` + a.tex() + R`} ` + (termCount(P.deg(q1) === 0 ? p1 : [Q(1)]) > 1 ? R`\left(` + rt + R`\right)` : rt) + ' = ' + rs + (rs === L.tex() ? '' : ' = ' + L.tex()),
          n: R`約分した式は $x = ` + a.tex() + R`$ で分母が 0 にならないので、代入した値が極限です。`,
          easy: R`穴の位置の高さを、穴を埋めた式で計算しているのと同じです。`
        });
      } else {
        if (kind === 'zz') kind = 'pole';
        let m = 0, q2 = q1;
        while (P.eval(q2, a).isZero()) { q2 = P.divmod(q2, lin).q; m++; }
        const c = p1a.div(P.eval(q2, a));
        sR = c.sign(); sL = m % 2 === 0 ? sR : -sR;
        const ap = a.isZero() ? '+0' : a.tex() + ' + 0', am = a.isZero() ? '-0' : a.tex() + ' - 0';
        const inf = (s) => (s > 0 ? R`\infty` : R`-\infty`);
        steps.push({
          t: '右側・左側からの極限',
          m: [
            R`f(x) = \frac{` + P.tex(p1) + '}{' + factTex(m, a, q2) + '}',
            R`\lim_{x \to ` + ap + '} f(x) = ' + inf(sR) + R`,\qquad \lim_{x \to ` + am + '} f(x) = ' + inf(sL)
          ],
          n: R`$x \to ` + ap + R`$ は「$x$ を $` + a.tex() + R`$ より大きい側から近づける」、$x \to ` + am + R`$ は「小さい側から近づける」という意味です。分母の $` + (a.isZero() ? 'x' : R`\left(` + xMinus(a) + R`\right)`) + (m > 1 ? '^{' + m + '}' : '') + R`$ の符号と、残りの部分の符号 $\left(\frac{` + p1a.tex() + '}{' + P.eval(q2, a).tex() + R`}\right)$ から決まります。`,
          easy: R`$x$ が $` + a.tex() + R`$ より少しだけ大きいとき $` + xMinus(a) + R`$ は小さな正の数、少しだけ小さいとき小さな負の数です。` + (m % 2 === 0 ? R`今回は偶数乗なので、どちらの側でも正になります。` : R`今回は奇数乗なので、左右で符号が逆になります。`),
          pro: R`分母が 0 に近づき分子が 0 でない値に近づくときは、必ず左右の極限を調べる。グラフでは $x = ` + a.tex() + R`$ が**漸近線**になります。`
        });
      }
    }
    let limTex, verdict;
    if (L) { limTex = L.tex(); verdict = kind === 'zz' ? R`\text{0/0 型（約分）}` : R`\text{代入で求まる（連続）}`; }
    else if (sR === sL) { limTex = sR > 0 ? R`\infty` : R`-\infty`; verdict = R`\text{発散（左右とも同じ向き）}`; }
    else { limTex = R`\text{存在しない}`; verdict = R`\text{発散（左右で向きが異なる）}`; }
    steps.push({
      t: '結論',
      m: L || sR === sL ? R`\lim_{x \to ` + a.tex() + '} ' + fT + ' = ' + limTex : R`\lim_{x \to ` + a.tex() + '} ' + fT + R` \text{ は存在しない}`,
      n: L ? R`極限値は $` + L.tex() + R`$ です。` : (sR === sL ? R`左右どちらから近づけても同じ向きに発散するので、$\lim_{x \to ` + a.tex() + '} f(x) = ' + limTex + R`$ と書きます。` : R`右側と左側の極限が一致しないので、極限は存在しません。`),
      easy: L && kind === 'zz' ? R`グラフの穴の位置 $\left(` + a.tex() + R`,\ ` + L.tex() + R`\right)$ が、近づく先です。` : R`グラフの形と、表の値の変化を見比べてみましょう。`
    });
    // 図
    const R0 = 3, xs = [av - R0, av + R0];
    const pts = [];
    [-1, -0.5, -0.25, 0.25, 0.5, 1].forEach((h) => { const y = f(av + h); if (fin(y)) pts.push({ x: av + h, y: y, cls: 'c2' }); });
    if (L) pts.push({ x: av, y: L.val(), cls: 'c3', label: (kind === 'zz' ? '穴 (' : '(') + plainQ(a) + ', ' + plainQ(L) + ')', pos: 'tr' });
    const fig = graph({
      x: xs, mustY: L ? [L.val()] : [],
      curves: [{ f: f, cls: 'c1' }],
      points: pts,
      vlines: L ? [{ x: av, label: 'x=' + plainQ(a) }] : [{ x: av, cls: 'c3', label: '漸近線 x=' + plainQ(a) }]
    });
    return {
      result: [
        { label: '極限', tex: R`\lim_{x \to ` + a.tex() + '} f(x) = ' + limTex },
        { label: '型', tex: verdict },
        { label: x0Label(a), tex: R`p(` + a.tex() + ') = ' + pa.tex() + R`,\ q(` + a.tex() + ') = ' + qa.tex() }
      ],
      steps: steps,
      fig: fig
    };
  }
  function x0Label(a) { return 'x = ' + a.toString() + ' を代入した値'; }

  function fnLimInf(p, q, neg) {
    const pT = P.tex(p), qT = P.tex(q), fT = R`\frac{` + pT + '}{' + qT + '}';
    const f = (x) => { const d = P.eval(q, x); return d === 0 ? NaN : P.eval(p, x) / d; };
    const dp = P.deg(p), dq = P.deg(q), pz = P.isZero(p);
    const lq = q[dq], lp = pz ? Q(0) : p[dp];
    const to = neg ? R`-\infty` : R`\infty`;
    let L = null, sgn = 0;
    if (pz || dp < dq) L = Q(0);
    else if (dp === dq) L = lp.div(lq);
    else sgn = lp.div(lq).sign() * (neg && (dp - dq) % 2 === 1 ? -1 : 1);
    const limTex = L ? L.tex() : (sgn > 0 ? R`\infty` : R`-\infty`);
    const XS = neg ? [-10, -100, -1000, -10000] : [10, 100, 1000, 10000];
    const steps = [{
      t: R`そもそも $x \to ` + to + R`$ の極限とは — 表で確かめる`,
      m: XS.slice(1).map((x) => R`f(` + x + R`) \fallingdotseq ` + num(f(x))),
      n: R`$x$ を` + (neg ? '負の向きに' : '') + R`限りなく大きくしたとき（$x \to ` + to + R`$）、$f(x)$ が近づく値を調べます。`,
      easy: neg
        ? R`$x \to -\infty$ では $x$ は「絶対値の大きい負の数」です。$x^{2}$ のような偶数乗は正、$x^{3}$ のような奇数乗は負の大きな数になる点に注意します。`
        : R`$x$ に $10,\ 100,\ 1000,\ \ldots$ と大きな数を入れていくと、$f(x)$ の値の変化の傾向が見えてきます。`,
      fig: tableSvg([['x'].concat(XS.map(String)), ['f(x)'].concat(XS.map((x) => plain(f(x), 5)))], { caption: 'x を ' + (neg ? '-∞' : '∞') + ' に近づけたときの f(x)' }),
      lv: 3
    }];
    if (dq === 0) {
      steps.push({
        t: '分母は定数',
        m: R`f(x) = ` + fT + ' = ' + P.tex(P.scale(p, lq.inv())),
        n: R`分母が定数なので、$f(x)$ は多項式です。多項式の $x \to ` + to + R`$ での様子は最高次の項で決まります。`,
        easy: R`最高次の項の係数の符号と、次数が偶数か奇数かで、どちらの向きに大きくなるかが決まります。`
      });
    } else {
      steps.push({
        t: R`分母の最高次の項 $` + vpow('x', dq) + R`$ で分子・分母を割る`,
        m: R`f(x) = ` + fT + R` = \frac{` + dividedTex(p, dq, 'x') + '}{' + dividedTex(q, dq, 'x') + '}',
        n: R`分子・分母を同じ $` + vpow('x', dq) + R`$ で割っても値は変わりません。$x \to ` + to + R`$ では $\frac{1}{x^{k}} \to 0$ です。`,
        easy: R`$\frac{1}{x}$ は $x = 1000$ なら $0.001$、$x = -1000$ なら $-0.001$。どちらの向きでも 0 に近づきます。`,
        pro: R`$x \to -\infty$ で根号を含む場合は $x = -t$ とおいて $t \to \infty$ に直すと符号ミスを防げます。`
      });
    }
    steps.push({
      t: '結論',
      m: R`\lim_{x \to ` + to + '} ' + fT + ' = ' + limTex,
      n: L ? (pz || dp < dq ? R`分母の次数の方が大きいので 0 に収束します。` : R`次数が等しいので、最高次の係数の比 $\frac{` + lp.tex() + '}{' + lq.tex() + R`}$ が極限です。`) + R`グラフでは $y = ` + L.tex() + R`$ が**漸近線**（限りなく近づく直線）になります。`
        : R`分子の次数の方が大きいので発散します。符号は最高次の係数の比` + (neg && (dp - dq) % 2 === 1 ? R`と、$x^{` + (dp - dq) + R`}$（奇数乗）が $x \to -\infty$ で負になることから決まります。` : R`で決まります。`),
      easy: L ? R`グラフの右端（または左端）が、高さ $` + L.tex() + R`$ の横線に寄りそっていく様子を見てください。` : R`残った $x$ の累乗の項が、限りなく大きくなる原因です。`,
      pro: R`$x \to \pm\infty$ の分数式の極限は、最高次の項どうしの比 $\frac{` + (pz ? '0' : (mono(lp, dp, 'x').neg ? '-' : '') + mono(lp, dp, 'x').body) + '}{' + (mono(lq, dq, 'x').neg ? '-' : '') + mono(lq, dq, 'x').body + R`}$ の極限と同じです。`
    });
    const xr = neg ? [-30, 0] : [0, 30];
    return {
      result: [
        { label: '極限', tex: R`\lim_{x \to ` + to + '} f(x) = ' + limTex },
        { label: '判定', tex: L ? R`\text{収束する}` : R`\text{発散する}` },
        { label: 'x = ' + XS[3] + ' での値', tex: R`f(` + XS[3] + R`) \fallingdotseq ` + num(f(XS[3])) }
      ],
      steps: steps,
      fig: graph({
        x: xr, mustY: L ? [L.val()] : [],
        curves: [{ f: f, cls: 'c1' }],
        hlines: L ? [{ y: L.val(), cls: 'c3', label: '漸近線 y=' + plainQ(L) }] : []
      })
    };
  }

  JK.registerCalc({
    id: 'iiic-lim-fn',
    course: 'IIIC',
    unit: 'm-limit',
    group: '極限',
    title: '関数の極限（分数式）',
    desc: R`分子・分母が多項式の関数 $f(x) = \dfrac{p(x)}{q(x)}$ について、$x \to a$ または $x \to \pm\infty$ での極限を求めます。$\frac{0}{0}$ 型は因数 $(x - a)$ で約分する過程を、分母だけが 0 になる場合は左右の極限を示します。`,
    form: [R`\lim_{x \to a} \frac{p(x)}{q(x)}`, R`\lim_{x \to \pm\infty} \frac{p(x)}{q(x)}`],
    inputs: [
      { key: 'p', label: '分子 $p(x)$', type: 'poly', def: 'x^2 - 4' },
      { key: 'q', label: '分母 $q(x)$', type: 'poly', def: 'x - 2' },
      { key: 'to', label: '近づけ方', type: 'select', def: 'a', options: [['a', 'x → a（ある値に近づける）'], ['inf', 'x → ∞'], ['minf', 'x → −∞']] },
      { key: 'a', label: '$a$ の値', type: 'q', def: '2', show: (raw) => raw.to !== 'inf' && raw.to !== 'minf' }
    ],
    examples: [
      { label: '3次式の約分', v: { p: 'x^3 - 1', q: 'x^2 - 1', to: 'a', a: '1' } },
      { label: '分母だけ 0', v: { p: 'x + 1', q: 'x^2 - 2x + 1', to: 'a', a: '1' } },
      { label: '左右で異なる', v: { p: '1', q: 'x - 1', to: 'a', a: '1' } },
      { label: 'x → ∞', v: { p: '2x^2 - x', q: 'x^2 + 3', to: 'inf' } },
      { label: 'x → −∞', v: { p: 'x^3', q: 'x^2 + 1', to: 'minf' } }
    ],
    intro: {
      easy: R`**関数の極限**は「$x$ をある値に限りなく近づけたとき、$f(x)$ がどんな値に近づくか」を調べることです。大事なのは、$x$ はその値に**近づくだけで、ぴったりにはならない**こと。たとえば $\frac{x^{2} - 4}{x - 2}$ は $x = 2$ を代入すると $\frac{0}{0}$ で計算できませんが、$x = 1.999$ や $2.001$ を入れると値は 4 のすぐ近くです。グラフでいえば「$x = 2$ の 1 点だけ穴があいた直線」で、その穴の高さ 4 が極限値になります。`,
      normal: R`まず代入。分母が 0 でなければそれが答え。$\frac{0}{0}$ なら共通因数 $(x - a)$ で約分、分母だけ 0 なら左右の極限を調べます。$x \to \pm\infty$ は分母の最高次で割ります。`,
      pro: R`「極限値が存在するように定数を決めよ」型では、分母 $\to 0$ なら分子 $\to 0$ が**必要条件**。そこから定数を絞り、約分して極限値を求める流れが頻出です。`
    },
    compute(v) {
      const p = v.p, q = v.q;
      if (P.isZero(q)) throw new JK.CalcError('分母 q(x) が 0 になっています。0 でない多項式を入力してください');
      if (P.deg(p) > 8 || P.deg(q) > 8) throw new JK.CalcError('次数は 8 以下で入力してください');
      if (v.to === 'inf' || v.to === 'minf') return fnLimInf(p, q, v.to === 'minf');
      return fnLimAt(p, q, v.a || Q(0));
    }
  });

  /* ================= 4. 三角関数の極限 ================= */

  function squeezeFig() {
    const d = JK.plot.draw(330, 236);
    const ox = 46, oy = 206, r = 160, deg = 38, th = deg * Math.PI / 180;
    const ax = ox + r, ay = oy;
    const px = ox + r * Math.cos(th), py = oy - r * Math.sin(th);
    const tx = ax, ty = oy - r * Math.tan(th);
    d.line(ox - 16, oy, ox + r + 40, oy, { cls: 'dim', w: 1 });
    d.line(ox, oy + 10, ox, oy - r - 12, { cls: 'dim', w: 1 });
    d.arc(ox, oy, r, 0, 90, { cls: 'dim', w: 1 });
    d.poly([[ox, oy], [ax, ay], [tx, ty]], { cls: 'c3', fill: 'f3', w: 1.2 });
    d.path('M' + ox + ' ' + oy + ' L' + ax + ' ' + ay + ' A' + r + ' ' + r + ' 0 0 0 ' + px.toFixed(2) + ' ' + py.toFixed(2) + ' Z', { cls: 'c2', fill: 'f2', w: 1.2 });
    d.poly([[ox, oy], [ax, ay], [px, py]], { cls: 'c1', fill: 'f1', w: 1.5 });
    d.line(px, py, px, oy, { cls: 'dim', dash: true, w: 1 });
    d.angle(ox, oy, 30, 0, deg, 'θ', { cls: 'c3' });
    d.text(ox - 9, oy + 15, 'O');
    d.text(ax + 3, oy + 15, 'A');
    d.text(px - 9, py - 6, 'P');
    d.text(tx + 8, ty + 4, 'T', { anchor: 'start' });
    d.text(ox + r * 0.62, oy + 15, '1');
    d.text(px + 4, oy - 22, 'sin θ', { anchor: 'start', size: 11 });
    d.text(ax + 6, (ty + oy) / 2, 'tan θ', { anchor: 'start', size: 11 });
    d.text(165, 16, '△OAP ≦ 扇形 OAP ≦ △OAT', { size: 12 });
    return d.svg();
  }

  JK.registerCalc({
    id: 'iiic-lim-trig',
    course: 'IIIC',
    unit: 'm-limit',
    group: '極限',
    title: '三角関数の極限',
    desc: R`$\lim_{x \to 0} \dfrac{\sin ax}{bx}$、$\lim_{x \to 0} \dfrac{\tan ax}{bx}$、$\lim_{x \to 0} \dfrac{1 - \cos ax}{x^{2}}$ を、基本の極限 $\lim_{\theta \to 0} \dfrac{\sin\theta}{\theta} = 1$ に帰着させて求めます。単位円の図で「なぜ 1 になるか」も説明します。`,
    form: R`\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1`,
    inputs: [
      { key: 'type', label: '関数の形', type: 'select', def: 'sin', options: [['sin', 'sin(ax) / (bx)'], ['tan', 'tan(ax) / (bx)'], ['cos', '(1 − cos(ax)) / x²']] },
      { key: 'a', label: '$a$', type: 'q', def: '3' },
      { key: 'b', label: '$b$', type: 'q', def: '2', show: (raw) => raw.type !== 'cos' }
    ],
    examples: [
      { label: 'sin x / x', v: { type: 'sin', a: '1', b: '1' } },
      { label: 'tan 型', v: { type: 'tan', a: '2', b: '5' } },
      { label: '1 − cos 型', v: { type: 'cos', a: '2' } },
      { label: '分数係数', v: { type: 'sin', a: '1/2', b: '3' } }
    ],
    intro: {
      easy: R`角度を**弧度法（ラジアン）**で測ると、小さい角 $\theta$ では $\sin\theta$ と $\theta$ がほとんど同じ値になります（$\sin 0.01 = 0.0099998\ldots$）。だから $\frac{\sin\theta}{\theta}$ は $\theta \to 0$ で 1 に近づきます。この「基本の極限」を道具にして、$\sin 3x$ のような式も「中身と分母をそろえる」変形で計算します。図形的には、単位円の扇形の面積を 2 つの三角形ではさむことで、1 になる理由が分かります。`,
      normal: R`$\sin$ の中身と同じ式を分母に作り、$\frac{\sin\theta}{\theta} \to 1$ を使います。$\tan$ は $\frac{\sin}{\cos}$ に、$1 - \cos$ は $1 + \cos$ を掛けて $\sin^{2}$ に直します。`,
      pro: R`$1 - \cos\theta = 2\sin^{2}\frac{\theta}{2}$（半角の公式）を使うと 1 行で処理できます。微分の定義 $(\sin x)' = \cos x$ の証明でもこの極限を使います。`
    },
    compute(v) {
      const type = v.type, a = v.a;
      if (a.isZero()) throw new JK.CalcError('a は 0 以外の値を入力してください（a = 0 だと分子が常に 0 になります）');
      let b = Q(1);
      if (type !== 'cos') {
        b = v.b || Q(1);
        if (b.isZero()) throw new JK.CalcError('b は 0 以外の値を入力してください（分母が 0 になります）');
      }
      const av = a.val(), bv = b.val();
      const aT = axTex(a), bT = axTex(b);
      let f, L, fT;
      if (type === 'sin') { f = (x) => Math.sin(av * x) / (bv * x); L = a.div(b); fT = R`\frac{\sin` + argOf(aT) + '}{' + bT + '}'; }
      else if (type === 'tan') { f = (x) => Math.tan(av * x) / (bv * x); L = a.div(b); fT = R`\frac{\tan` + argOf(aT) + '}{' + bT + '}'; }
      else { f = (x) => (1 - Math.cos(av * x)) / (x * x); L = a.mul(a).div(2); fT = R`\frac{1 - \cos` + argOf(aT) + R`}{x^{2}}`; }
      const XS = [0.5, 0.1, 0.01, 0.001];
      const steps = [{
        t: R`そもそも何が起こるか — $x$ を 0 に近づけてみる`,
        m: [R`f(x) = ` + fT, R`f(0.01) \fallingdotseq ` + num(f(0.01)) + R`,\quad f(0.001) \fallingdotseq ` + num(f(0.001))],
        n: R`$x = 0$ を代入すると $\frac{0}{0}$ になり、そのままでは値が決まりません。$x$ を 0 に近づけると、値は $` + L.tex() + R`$` + (L.isInt() ? '' : R`（$\fallingdotseq ` + num(L.val()) + R`$）`) + R` に近づいていきます。$f(-x) = f(x)$ なので、負の側から近づけても同じです。`,
        easy: R`角の単位は弧度法（ラジアン）です（$\pi = 180\degree$、$1$ ラジアン $\fallingdotseq 57.3\degree$）。弧度法で測ると、小さい角 $\theta$ では $\sin\theta \fallingdotseq \theta$ となります。これがこの極限のカギです。`,
        fig: tableSvg([['x'].concat(XS.map(String)), ['f(x)'].concat(XS.map((x) => plain(f(x), 6)))], { caption: 'f(x) = ' + (type === 'cos' ? '(1 − cos ax)/x²' : (type === 'tan' ? 'tan(ax)/(bx)' : 'sin(ax)/(bx)')) + ' の値' }),
        lv: 3
      }, {
        t: R`基本の極限 $\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$（なぜ 1 か）`,
        m: [
          R`\frac{1}{2}\sin\theta < \frac{1}{2}\theta < \frac{1}{2}\tan\theta \quad \left(0 < \theta < \frac{\pi}{2}\right)`,
          R`\cos\theta < \frac{\sin\theta}{\theta} < 1`,
          R`\lim_{\theta \to +0} \cos\theta = 1 \;\Rightarrow\; \lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1`
        ],
        n: R`半径 1 の円で、三角形 OAP・扇形 OAP・三角形 OAT の面積を比べます。各辺を $\frac{1}{2}\sin\theta\ (> 0)$ で割って逆数をとると 2 行目になり、はさみうちの原理で 1 に決まります（$\theta < 0$ のときも $\frac{\sin\theta}{\theta}$ は偶関数なので同じ）。`,
        easy: R`図の 3 つの図形は、小さい順に「三角形 OAP（面積 $\frac{1}{2}\sin\theta$）」「扇形 OAP（面積 $\frac{1}{2} \cdot 1^{2} \cdot \theta$）」「三角形 OAT（面積 $\frac{1}{2}\tan\theta$）」です。$\theta$ を 0 に近づけると 3 つはほとんど同じ形になり、$\frac{\sin\theta}{\theta}$ は下の $\cos\theta$（→ 1）と上の 1 にはさまれて、1 に決まります。これを**はさみうちの原理**といいます。`,
        fig: squeezeFig(),
        lv: 2
      }];
      if (type === 'sin' && a.eq(b)) {
        steps.push({
          t: R`基本の極限の形そのもの`,
          m: [fT + R` = \frac{\sin\theta}{\theta} \quad \left(\theta = ` + aT + R`\right)`],
          n: R`$\sin$ の中身と分母がすでに同じ $` + aT + R`$ です。$x \to 0$ のとき $\theta = ` + aT + R` \to 0$ です。`,
          easy: R`$\sin$ の中身と分母が**同じ式**なので、変形しなくても基本の極限がそのまま使えます。`,
          pro: R`「$\sin$ の中身 = 分母」なら即 1。`
        });
        steps.push({
          t: '極限を計算する',
          m: R`\lim_{x \to 0} ` + fT + R` = \lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1`,
          n: R`極限値は 1 です。`
        });
      } else if (type === 'sin') {
        steps.push({
          t: R`$\frac{\sin\theta}{\theta}$ の形を作る`,
          m: [R`\frac{\sin` + argOf(aT) + '}{' + bT + R`} = \frac{\sin` + argOf(aT) + '}{' + aT + R`} \cdot \frac{` + aT + '}{' + bT + R`} = \frac{\sin` + argOf(aT) + '}{' + aT + R`} \cdot ` + a.div(b).tex()],
          n: R`$\theta = ` + aT + R`$ とおくと、$x \to 0$ のとき $\theta \to 0$ です。分母にも同じ $` + aT + R`$ を作り、足りない分 $\frac{` + aT + '}{' + bT + R`}$ を掛けて調整します。`,
          easy: R`$\sin$ の中身と分母が**同じ式**になっていれば基本の極限が使えます。$\frac{` + aT + '}{' + bT + R`}$ は $x$ が約分されて定数 $` + a.div(b).tex() + R`$ になります。`,
          pro: R`「$\sin$ の中身 = 分母」にそろえるのが鉄則。$\lim \frac{\sin ax}{bx} = \frac{a}{b}$ は結果として覚えてよい。`
        });
        steps.push({
          t: '極限を計算する',
          m: R`\lim_{x \to 0} ` + fT + R` = 1 \cdot ` + paren(a.div(b)) + ' = ' + L.tex(),
          n: R`$\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$ を使いました。`
        });
      } else if (type === 'tan') {
        steps.push({
          t: R`$\tan = \frac{\sin}{\cos}$ に直して形を作る`,
          m: [
            R`\frac{\tan` + argOf(aT) + '}{' + bT + R`} = \frac{\sin` + argOf(aT) + R`}{\cos` + argOf(aT) + R` \cdot ` + bT + '}',
            R`= \frac{\sin` + argOf(aT) + '}{' + aT + R`} \cdot \frac{1}{\cos` + argOf(aT) + R`} \cdot ` + a.div(b).tex()
          ],
          n: R`$\tan\theta = \frac{\sin\theta}{\cos\theta}$ を使い、$\sin$ の部分を基本の極限の形にします。`,
          easy: R`$\cos 0 = 1$ なので、$x \to 0$ で $\frac{1}{\cos` + argOf(aT) + R`}$ は 1 に近づきます。残りは $\sin$ の場合と同じです。`,
          pro: R`$\lim_{\theta \to 0} \frac{\tan\theta}{\theta} = 1$ も基本の極限として使ってよい形です。`
        });
        steps.push({
          t: '極限を計算する',
          m: R`\lim_{x \to 0} ` + fT + R` = 1 \cdot \frac{1}{1} \cdot ` + paren(a.div(b)) + ' = ' + L.tex(),
          n: R`$\frac{\sin\theta}{\theta} \to 1,\ \cos` + argOf(aT) + R` \to 1$ を使いました。`
        });
      } else {
        steps.push({
          t: R`$1 + \cos$ を掛けて $\sin^{2}$ を作る`,
          m: [
            R`\frac{1 - \cos` + argOf(aT) + R`}{x^{2}} = \frac{(1 - \cos` + argOf(aT) + R`)(1 + \cos` + argOf(aT) + R`)}{x^{2}(1 + \cos` + argOf(aT) + ')}',
            R`= \frac{\sin^{2}` + argOf(aT) + R`}{x^{2}(1 + \cos` + argOf(aT) + ')}',
            R`= \left(\frac{\sin` + argOf(aT) + '}{' + aT + R`}\right)^{2} \cdot \frac{` + a.mul(a).tex() + R`}{1 + \cos` + argOf(aT) + '}'
          ],
          n: R`分子と分母に $1 + \cos` + argOf(aT) + R`$ を掛けると、$(1 - \cos\theta)(1 + \cos\theta) = 1 - \cos^{2}\theta = \sin^{2}\theta$ が使えます。`,
          easy: R`$(A - B)(A + B) = A^{2} - B^{2}$（和と差の積）と $\sin^{2}\theta + \cos^{2}\theta = 1$ の組み合わせです。分母の $x^{2}$ を $(` + aT + R`)^{2}$ にそろえるために $` + a.mul(a).tex() + R`$ を掛けて調整しています。`,
          pro: R`半角の公式 $1 - \cos\theta = 2\sin^{2}\frac{\theta}{2}$ を使えば $\frac{1 - \cos ax}{x^{2}} = 2\left(\frac{\sin\frac{ax}{2}}{x}\right)^{2} \to \frac{a^{2}}{2}$ と一気に計算できます。`
        });
        steps.push({
          t: '極限を計算する',
          m: R`\lim_{x \to 0} ` + fT + R` = 1^{2} \cdot \frac{` + a.mul(a).tex() + R`}{1 + 1} = ` + L.tex(),
          n: R`$\frac{\sin\theta}{\theta} \to 1$ と $\cos` + argOf(aT) + R` \to 1$ を使いました。`
        });
      }
      const Rg = type === 'tan' ? Math.min(6, 1.45 / Math.abs(av)) : Math.min(6, Math.max(0.6, 3.5 / Math.abs(av)));
      return {
        result: [
          { label: '極限値', tex: R`\lim_{x \to 0} ` + fT + ' = ' + L.tex() },
          { label: '近似値', tex: L.isInt() ? L.tex() : R`\fallingdotseq ` + num(L.val()) },
          { label: '使った基本の極限', tex: R`\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1` }
        ],
        steps: steps,
        fig: graph({
          x: [-Rg, Rg], mustY: [L.val(), 0],
          curves: [{ f: (x) => (x === 0 ? NaN : f(x)), cls: 'c1' }],
          hlines: [{ y: L.val(), cls: 'c3', label: 'y=' + plainQ(L) }],
          points: [{ x: 0, y: L.val(), cls: 'c3', label: '穴 (0, ' + plainQ(L) + ')', pos: 'tr' }]
        })
      };
    }
  });

  /* ================= 5. 自然対数の底 e ================= */

  function expTex(t) { return t.eq(1) ? 'e' : 'e^{' + t.tex() + '}'; }

  JK.registerCalc({
    id: 'iiic-lim-e',
    course: 'IIIC',
    unit: 'm-limit',
    group: '極限',
    title: '自然対数の底 e と関連する極限',
    desc: R`$e = \lim_{n \to \infty}\left(1 + \dfrac{1}{n}\right)^{n}$ の数値表、$\lim_{n \to \infty}\left(1 + \dfrac{a}{n}\right)^{bn} = e^{ab}$、$\lim_{x \to 0}\dfrac{e^{ax} - 1}{x} = a$、$\lim_{x \to 0}\dfrac{\log(1 + ax)}{x} = a$ を計算します。`,
    form: R`e = \lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^{n} = 2.71828\ldots`,
    inputs: [
      { key: 'type', label: '計算する極限', type: 'select', def: 'def', options: [['def', '(1 + 1/n)ⁿ → e（e の定義）'], ['pow', '(1 + a/n)^(bn) → e^(ab)'], ['exp', '(e^(ax) − 1) / x → a'], ['log', 'log(1 + ax) / x → a']] },
      { key: 'a', label: '$a$', type: 'q', def: '2', show: (raw) => raw.type === 'pow' || raw.type === 'exp' || raw.type === 'log' },
      { key: 'b', label: '$b$', type: 'q', def: '3', show: (raw) => raw.type === 'pow' }
    ],
    examples: [
      { label: '(1 + 2/n)^(3n)', v: { type: 'pow', a: '2', b: '3' } },
      { label: '(1 − 1/n)ⁿ', v: { type: 'pow', a: '-1', b: '1' } },
      { label: '(e^(3x) − 1)/x', v: { type: 'exp', a: '3' } },
      { label: 'log(1 + 2x)/x', v: { type: 'log', a: '2' } }
    ],
    intro: {
      easy: R`$e = 2.71828\ldots$ は円周率 $\pi$ と並ぶ大切な定数です。お金の利息でたとえると、元金 1 を年利 100% で預けたとき、1 年後は 2 です。半年ごとに 50% ずつ利息を元金に組み入れる（複利）と $\left(1 + \frac{1}{2}\right)^{2} = 2.25$、毎月なら $\left(1 + \frac{1}{12}\right)^{12} \fallingdotseq 2.613$ と増えます。回数 $n$ を限りなく増やしても無限には増えず、ある値に落ち着きます。それが $e$ です。$e$ を底にすると $(e^{x})' = e^{x}$ のように微分の公式がいちばん簡単になるので、数IIIでは $\log x$ は $e$ を底とする対数（自然対数）を表します。`,
      normal: R`$e$ の定義 $\lim_{n \to \infty}\left(1 + \frac{1}{n}\right)^{n} = e$（$\lim_{h \to 0}(1 + h)^{\frac{1}{h}} = e$）の形に変形して計算します。`,
      pro: R`$\left(1 + \frac{a}{n}\right)^{n} \to e^{a}$、$\frac{e^{x} - 1}{x} \to 1$、$\frac{\log(1 + x)}{x} \to 1$ の 3 つは $e$ の定義から導ける基本の極限。どの形に帰着したかを答案に明示します。`
    },
    compute(v) {
      const type = v.type;
      const E = Math.E;
      if (type === 'def' || (type !== 'pow' && type !== 'exp' && type !== 'log')) {
        const NS = [1, 2, 10, 100, 1000, 10000, 100000, 1000000];
        const g = (n) => Math.exp(n * Math.log1p(1 / n));
        return {
          result: [
            { label: 'e の値', tex: R`e = 2.718281828\ldots` },
            { label: 'n = 1000 のとき', tex: R`\left(1 + \frac{1}{1000}\right)^{1000} \fallingdotseq ` + num(g(1000)) },
            { label: 'n = 1000000 のとき', tex: R`\left(1 + \frac{1}{1000000}\right)^{1000000} \fallingdotseq ` + num(g(1e6)) }
          ],
          steps: [
            {
              t: R`そもそも $e$ とは — $\left(1 + \frac{1}{n}\right)^{n}$ の数値表`,
              m: [R`n = 1:\ \left(1 + \frac{1}{1}\right)^{1} = 2`, R`n = 2:\ \left(1 + \frac{1}{2}\right)^{2} = 2.25`, R`n = 10:\ \left(1 + \frac{1}{10}\right)^{10} \fallingdotseq ` + num(g(10)), R`n = 1000:\ \left(1 + \frac{1}{1000}\right)^{1000} \fallingdotseq ` + num(g(1000))],
              n: R`$n$ を大きくすると $\left(1 + \frac{1}{n}\right)^{n}$ は少しずつ増えますが、限りなく大きくなるのではなく $2.71828\ldots$ という値に近づきます。この極限値を $e$（ネイピア数）と定めます。`,
              easy: R`利息のたとえでは、$n$ は「1 年に利息を組み入れる回数」です。回数を増やすほど得をしますが、増え方はだんだん小さくなり、上限 $e$ に近づきます。`,
              fig: tableSvg([['n', '(1 + 1/n)ⁿ']].concat(NS.map((n) => [String(n), plain(g(n), 7)])), { caption: '(1 + 1/n)ⁿ の値' }),
              lv: 3
            },
            {
              t: R`$e$ の定義`,
              m: R`e = \lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^{n} = 2.718281828\ldots`,
              n: R`$e$ は無理数で、小数はくり返さずに無限に続きます。`,
              easy: R`中の $1 + \frac{1}{n}$ は 1 に近づき、指数の $n$ は大きくなります。「1 に近づくから大きくならない力」と「何回も掛けるから大きくなる力」がつり合って、ちょうど $e$ に落ち着くのです。`
            },
            {
              t: '同じ意味の書きかえ',
              m: [R`h = \frac{1}{n} \text{ とおくと } n \to \infty \Leftrightarrow h \to +0`, R`e = \lim_{h \to 0} (1 + h)^{\frac{1}{h}} = \lim_{x \to \pm\infty} \left(1 + \frac{1}{x}\right)^{x}`],
              n: R`$h$ は負の側から 0 に近づけても、$x$ は $-\infty$ に近づけても、同じ $e$ になります。`,
              easy: R`「$n$ を大きくする」と「$h = \frac{1}{n}$ を 0 に近づける」は同じことの言いかえです。問題に合わせて使いやすい形を選びます。`,
              lv: 2
            },
            {
              t: R`$e$ が特別な理由`,
              m: [R`\lim_{h \to 0} \frac{e^{h} - 1}{h} = 1`, R`\left(e^{x}\right)' = e^{x},\qquad \left(\log x\right)' = \frac{1}{x}`],
              n: R`$e$ を底にすると、指数関数・対数関数の微分の公式がいちばん簡単になります。`,
              easy: R`$y = e^{x}$ のグラフの $x = 0$ での接線の傾きはちょうど 1 です。$e$ は「そうなるように選ばれた数」ともいえます。`,
              pro: R`$\left(1 + \frac{1}{n}\right)^{n} < e < \left(1 + \frac{1}{n}\right)^{n+1}$ や、二項定理で $\left(1 + \frac{1}{n}\right)^{n} < 3$ を示す問題も頻出です。`
            }
          ],
          fig: graph({
            x: [0, 31], y: [1.8, 2.9], axis: ['n', ''],
            points: Array.from({ length: 30 }, (_, i) => ({ x: i + 1, y: g(i + 1), cls: 'c1' })),
            hlines: [{ y: E, cls: 'c3', label: 'e = 2.71828…' }]
          })
        };
      }
      const a = v.a || Q(1);
      if (a.isZero()) throw new JK.CalcError('a は 0 以外の値を入力してください（a = 0 だと e が現れない自明な極限になります）');
      const av = a.val();
      if (type === 'pow') {
        const b = v.b || Q(1);
        if (b.isZero()) throw new JK.CalcError('b は 0 以外の値を入力してください（b = 0 だと指数が 0 で常に 1 になります）');
        const bv = b.val(), ab = a.mul(b);
        if (Math.abs(ab.val()) > 200) throw new JK.CalcError('ab の絶対値が大きすぎます（200 以下にしてください）');
        const g = (n) => Math.exp(bv * n * Math.log1p(av / n));
        const NS = [10, 100, 1000, 10000, 100000, 1000000].filter((n) => 1 + av / n > 0);
        const bnT = P.tex([Q(0), b], 'n'), an1 = mono(a, -1, 'n');
        const aOverN = (an1.neg ? '-' : '') + an1.body;
        const fT = R`\left(1 ` + (an1.neg ? '- ' : '+ ') + an1.body + R`\right)^{` + bnT + '}';
        const tT = P.tex([Q(0), a.inv()], 'n');
        const L = ab.val();
        return {
          result: [
            { label: '極限値', tex: R`\lim_{n \to \infty} ` + fT + ' = ' + expTex(ab) },
            { label: '近似値', tex: expTex(ab) + R` \fallingdotseq ` + num(Math.exp(L)) },
            { label: 'n = 1000 のとき', tex: R`\fallingdotseq ` + num(g(1000)) }
          ],
          steps: [
            {
              t: R`そもそも何に近づくか — 大きな $n$ で確かめる`,
              m: NS.slice(1, 4).map((n) => {
                const aN = a.div(n);
                const fr = a.isInt() ? R`\frac{` + Math.abs(a.n) + '}{' + n + '}' : aN.abs().tex();
                return 'n = ' + n + R`:\quad \left(1 ` + (aN.sign() < 0 ? '- ' : '+ ') + fr + R`\right)^{` + b.mul(n).tex() + R`} \fallingdotseq ` + num(g(n));
              }),
              n: R`中の $1 + \frac{a}{n}$ は 1 に近づき、指数 $bn$ は限りなく大きくなります。「1 に近い数を何回も掛ける」と、ある値に落ち着きます。`,
              easy: R`表の値が $e^{` + ab.tex() + R`} \fallingdotseq ` + num(Math.exp(L)) + R`$ に近づいていく様子を見てください。これを $e$ の定義の形に変形して確かめます。`,
              fig: tableSvg([['n', '値']].concat(NS.map((n) => [String(n), plain(g(n), 6)])), { caption: '(1 + a/n)^(bn) の値（a = ' + plainQ(a) + ', b = ' + plainQ(b) + '）' }),
              lv: 3
            },
            {
              t: R`$e$ の定義の形に変形する`,
              m: [
                R`t = ` + tT + R` \text{ とおくと } ` + aOverN + R` = \frac{1}{t},\quad ` + bnT + ' = ' + P.tex([Q(0), ab], 't'),
                fT + R` = \left\{\left(1 + \frac{1}{t}\right)^{t}\right\}^{` + ab.tex() + '}'
              ],
              n: R`中身を $1 + \frac{1}{t}$ の形にするために $t = \frac{n}{a}$ とおき、指数法則 $X^{pq} = (X^{p})^{q}$ で $t$ 乗をくくり出します。`,
              easy: R`目標は $e$ の定義 $\left(1 + \frac{1}{t}\right)^{t}$ の形を作ること。中身が $\frac{1}{t}$ になるように文字を置きかえ、指数も $t$ のかたまりでくくり直しています。`,
              pro: R`$\left(1 + \frac{a}{n}\right)^{bn} \to e^{ab}$ は結果として覚えてよい形です（$\left(1 - \frac{1}{n}\right)^{n} \to \frac{1}{e}$ など）。`
            },
            {
              t: '極限を計算する',
              m: [R`n \to \infty \text{ のとき } t \to ` + (av > 0 ? R`\infty` : R`-\infty`), R`\lim_{n \to \infty} ` + fT + ' = ' + expTex(ab) + (ab.sign() < 0 ? R` = \frac{1}{` + expTex(ab.neg()) + '}' : '') + R` \fallingdotseq ` + num(Math.exp(L))],
              n: R`$\lim_{t \to \pm\infty} \left(1 + \frac{1}{t}\right)^{t} = e$ を使いました。` + (av < 0 ? R`$a < 0$ なので $t \to -\infty$ ですが、この場合も極限は $e$ です。` : ''),
              easy: R`中かっこの中身が $e$ に近づくので、全体は $e$ の $` + ab.tex() + R`$ 乗に近づきます。`
            }
          ],
          fig: graph({
            x: [Math.max(1, 2 * Math.abs(av)), 60], mustY: [Math.exp(L)], axis: ['n', ''],
            curves: [{ f: (x) => g(x), cls: 'c1' }],
            hlines: [{ y: Math.exp(L), cls: 'c3', label: 'e^(' + plainQ(ab) + ') ≈ ' + plain(Math.exp(L), 4) }]
          })
        };
      }
      // exp / log
      const isExp = type === 'exp';
      const aT = axTex(a);
      const f = isExp ? (x) => Math.expm1(av * x) / x : (x) => Math.log1p(av * x) / x;
      const fT = isExp ? R`\frac{e^{` + aT + R`} - 1}{x}` : R`\frac{\log(1 + ` + aT + ')}{x}';
      const XS = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1].filter((x) => isExp || 1 + av * x > 0);
      const R0 = Math.min(3, 0.9 / Math.abs(av));
      const steps = [
        {
          t: R`そもそも何に近づくか — $x$ を 0 に近づけてみる`,
          m: [R`f(0.001) \fallingdotseq ` + num(f(0.001)), R`f(-0.001) \fallingdotseq ` + num(f(-0.001))],
          n: R`$x = 0$ を代入すると $\frac{0}{0}$ になります。$x$ を 0 に近づけると、値は $` + a.tex() + R`$ に近づいていきます。`,
          easy: R`表の左右どちらから近づけても、同じ値に近づいていることを確かめましょう。`,
          fig: tableSvg([['x'].concat(XS.map(String)), ['f(x)'].concat(XS.map((x) => plain(f(x), 5)))], { caption: 'f(x) = ' + (isExp ? '(e^(ax) − 1)/x' : 'log(1 + ax)/x') + '（a = ' + plainQ(a) + '）の値' }),
          lv: 3
        },
        isExp ? {
          t: R`基本の極限 $\lim_{h \to 0} \frac{e^{h} - 1}{h} = 1$`,
          m: [R`t = e^{h} - 1 \text{ とおくと } h = \log(1 + t),\ \ h \to 0 \Leftrightarrow t \to 0`, R`\frac{e^{h} - 1}{h} = \frac{t}{\log(1 + t)} = \frac{1}{\log(1 + t)^{\frac{1}{t}}} \to \frac{1}{\log e} = 1`],
          n: R`$e$ の定義 $\lim_{t \to 0}(1 + t)^{\frac{1}{t}} = e$ に帰着させました。`,
          easy: R`$\frac{e^{h} - 1}{h} = \frac{e^{h} - e^{0}}{h - 0}$ は、$y = e^{x}$ のグラフ上の 2 点 $(0,\ 1)$ と $(h,\ e^{h})$ を結ぶ直線の傾きです。$h \to 0$ でこれは $x = 0$ での**接線の傾き**になります。$e$ はちょうどこの傾きが 1 になる数です（図: $y = e^{x}$ と接線 $y = x + 1$）。`,
          fig: graph({ x: [-2, 1.6], y: [-1, 4.5], curves: [{ f: Math.exp, cls: 'c1' }, { f: (x) => x + 1, cls: 'c3', dash: true }], points: [{ x: 0, y: 1, cls: 'c3', label: '(0, 1) 傾き 1', pos: 'tl' }], labels: [{ x: 0.75, y: 3.6, text: 'y = eˣ', cls: 'c1' }] }),
          lv: 2
        } : {
          t: R`基本の極限 $\lim_{h \to 0} \frac{\log(1 + h)}{h} = 1$`,
          m: R`\frac{\log(1 + h)}{h} = \frac{1}{h}\log(1 + h) = \log(1 + h)^{\frac{1}{h}} \to \log e = 1`,
          n: R`対数の性質 $k\log X = \log X^{k}$ で指数に上げ、$e$ の定義 $\lim_{h \to 0}(1 + h)^{\frac{1}{h}} = e$ を使いました。`,
          easy: R`$\frac{\log(1 + h)}{h}$ は $y = \log x$ のグラフの点 $(1,\ 0)$ での接線の傾き（ちょうど 1）を表しています。`,
          lv: 2
        },
        {
          t: '形をそろえる',
          m: [fT + ' = ' + paren(a) + R` \cdot ` + (isExp ? R`\frac{e^{` + aT + R`} - 1}{` + aT + '}' : R`\frac{\log(1 + ` + aT + ')}{' + aT + '}'), R`h = ` + aT + R` \text{ とおくと } x \to 0 \Rightarrow h \to 0`],
          n: R`分母を、指数（または $\log$ の中身）と同じ $` + aT + R`$ にそろえ、足りない $` + a.tex() + R`$ を前に掛けます。`,
          easy: R`三角関数の極限と同じ発想です。「中身と分母を同じ式にする」と基本の極限が使えます。`,
          pro: isExp ? R`$\frac{e^{ax} - 1}{x} \to a$ は $f(x) = e^{ax}$ の $x = 0$ での微分係数 $f'(0) = a$ とみることもできます。` : R`$\frac{\log(1 + ax)}{x} \to a$ は $f(x) = \log(1 + ax)$ の $f'(0) = a$ とみることもできます。`
        },
        {
          t: '極限を計算する',
          m: R`\lim_{x \to 0} ` + fT + ' = ' + paren(a) + R` \cdot 1 = ` + a.tex(),
          n: R`極限値は $` + a.tex() + R`$ です。`,
          easy: R`グラフの $x = 0$ の位置に穴があき、その高さが $` + a.tex() + R`$ です。`
        }
      ];
      return {
        result: [
          { label: '極限値', tex: R`\lim_{x \to 0} ` + fT + ' = ' + a.tex() },
          { label: '近似値', tex: a.isInt() ? a.tex() : R`\fallingdotseq ` + num(av) },
          { label: '使った基本の極限', tex: isExp ? R`\lim_{h \to 0} \frac{e^{h} - 1}{h} = 1` : R`\lim_{h \to 0} \frac{\log(1 + h)}{h} = 1` }
        ],
        steps: steps,
        fig: graph({
          x: [-R0, R0], mustY: [av, 0],
          curves: [{ f: (x) => (x === 0 ? NaN : f(x)), cls: 'c1' }],
          hlines: [{ y: av, cls: 'c3', label: 'y=' + plainQ(a) }],
          points: [{ x: 0, y: av, cls: 'c3', label: '穴 (0, ' + plainQ(a) + ')', pos: 'tr' }]
        })
      };
    }
  });
})();
