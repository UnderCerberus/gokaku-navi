/* 数I・A — 数と式: 式の展開 / 因数分解 / 平方根と分母の有理化 / 1次不等式・絶対値
   構成は ia-quad.js に揃える（intro → result → steps(easy/pro/lv) → fig）。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util, P = JK.poly;

  /* ================= 共通ヘルパー ================= */

  const pt = (p) => P.tex(p, 'x');                         // 降べきの TeX
  const polyEq = (a, b) => P.sub(a, b).every((c) => c.isZero());
  function terms(p) {                                      // 0 でない項を高次 → 低次の順に [{c, k}]
    const out = [];
    for (let k = p.length - 1; k >= 0; k--) if (!p[k].isZero()) out.push({ c: p[k], k: k });
    return out;
  }
  const isMono = (p) => terms(p).length === 1;
  function mono(c, k) {                                    // 係数 c・次数 k の 1 項
    const a = [];
    for (let i = 0; i < k; i++) a.push(Q(0));
    a.push(c);
    return P.tex(a, 'x');
  }
  const coefTimes = (c, k) => (c.eq(1) && k === 0 ? '' : mono(c, k));
  function sumTex(list) {                                  // 並べた順のまま足し合わせた TeX（同類項はまとめない）
    let out = '';
    list.forEach((t) => {
      if (t.c.isZero()) return;
      const body = mono(t.c.abs(), t.k);
      out += out === '' ? (t.c.sign() < 0 ? '-' : '') + body : (t.c.sign() < 0 ? ' - ' : ' + ') + body;
    });
    return out === '' ? '0' : out;
  }
  function fac(p, e) {                                     // 因数としての表示（必要ならかっこ）
    const t = terms(p);
    const plain = t.length === 1 && (e || 1) === 1 && t[0].c.sign() > 0;
    return (plain ? pt(p) : '(' + pt(p) + ')') + (e > 1 ? '^{' + e + '}' : '');
  }
  function chain(lhs, rhs) {                               // lhs = r1 = r2 …（同じ式の連続は省く）
    const r = rhs.filter((s, i) => i === 0 || s !== rhs[i - 1]);
    if (r.length === 1) return lhs + ' = ' + r[0];
    return R`\begin{aligned} ` + lhs + ' &= ' + r[0] + r.slice(1).map((s) => R` \\ &= ` + s).join('') + R` \end{aligned}`;
  }
  function wrap(t) {                                       // 累乗・積の中で使う単項式（必要ならかっこ）
    const simple = (t.k === 0 && t.c.isInt() && t.c.sign() >= 0) || (t.k === 1 && t.c.eq(1));
    return simple ? mono(t.c, t.k) : '(' + mono(t.c, t.k) + ')';
  }
  const mulT = (a, b) => ({ c: a.c.mul(b.c), k: a.k + b.k });
  const powT = (a, n) => ({ c: a.c.pow(n), k: a.k * n });

  /* ================= 入力の読み取り（かっこごとの因数に分ける） ================= */

  function splitTerms(s) {                                 // かっこの外の + - で項に分ける
    const out = [];
    let depth = 0, cur = '';
    for (let i = 0; i < s.length; i++) {
      const ch = s.charAt(i);
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (depth === 0 && (ch === '+' || ch === '-') && cur !== '' && !/[\^*/(]$/.test(cur) && !/^[+-]+$/.test(cur)) {
        out.push(cur);
        cur = ch;
        continue;
      }
      cur += ch;
    }
    if (cur !== '') out.push(cur);
    return out;
  }
  function matchClose(s, i) {                              // s[i] が '(' のとき、対応する ')' の位置
    let d = 0;
    for (let j = i; j < s.length; j++) {
      if (s.charAt(j) === '(') d++;
      else if (s.charAt(j) === ')') { d--; if (d === 0) return j; }
    }
    return s.length - 1;
  }
  function splitFactors(body) {                            // 1 つの項を因数（かっこ・単項式）に分ける
    const out = [];
    let i = 0;
    while (i < body.length) {
      const ch = body.charAt(i);
      if (ch === '*') { i++; continue; }
      if (ch === '(') {
        let end = matchClose(body, i) + 1;
        const m = /^\^\d+/.exec(body.slice(end));
        if (m) end += m[0].length;
        out.push(body.slice(i, end));
        i = end;
        continue;
      }
      let j = i;
      while (j < body.length && body.charAt(j) !== '(' && body.charAt(j) !== '*') j++;
      if (body.charAt(j - 1) === '^' && body.charAt(j) === '(') j = matchClose(body, j) + 1;
      out.push(body.slice(i, j));
      i = j;
    }
    return out;
  }
  function parseFactor(piece) {
    if (piece.charAt(0) === '/') piece = '1' + piece;
    let m = /^\((.*)\)\^(\d+)$/.exec(piece);
    if (m) {
      const e = Number(m[2]);
      return e === 0 ? { base: [Q(1)], e: 1 } : { base: P.parse(m[1], 'x'), e: e };
    }
    m = /^\((.*)\)$/.exec(piece);
    return { base: P.parse(m ? m[1] : piece, 'x'), e: 1 };
  }
  function readExpr(text) {
    const src = JK.expr.normalize(String(text == null ? '' : text)).replace(/\s+/g, '');
    if (src === '') throw new JK.CalcError('式を入力してください（例: (2x+3)(x-5)）');
    const whole = P.parse(src, 'x');
    const list = splitTerms(src).map((ts) => {
      let sign = 1, body = ts;
      while (body.length && (body.charAt(0) === '+' || body.charAt(0) === '-')) {
        if (body.charAt(0) === '-') sign = -sign;
        body = body.slice(1);
      }
      const facs = splitFactors(body).map(parseFactor);
      let deg = 0;
      facs.forEach((f) => {
        if (f.e > 8) throw new JK.CalcError('かっこの指数は 8 以下にしてください');
        deg += f.e * Math.max(0, P.deg(f.base));
      });
      if (deg > 12) throw new JK.CalcError('展開後の次数が 12 を超える式は扱えません');
      return { sign: sign, facs: facs };
    });
    return { whole: whole, list: list, src: src };
  }

  /* ================= 展開のエンジン ================= */

  const LAW_EASY = R`展開とは、かっこを外して「項を足し算だけで並べた式」に直すことです。かっこの中身を、もう一方のかっこの**中身すべて**に順にかけるのが**分配法則**です。たとえば $(a+b)(c+d)$ は、縦 $a+b$・横 $c+d$ の長方形の面積と考えると、4 つの小さな長方形 $ac,\ ad,\ bc,\ bd$ の面積の合計になります。`;

  function areaFig() {                                     // (a+b)(c+d) の面積図
    const d = JK.plot.draw(330, 190);
    const x0 = 70, y0 = 40, w1 = 110, w2 = 80, h1 = 60, h2 = 50;
    d.rect(x0, y0, w1, h1, { cls: 'c1', fill: 'f1' });
    d.rect(x0 + w1, y0, w2, h1, { cls: 'c2', fill: 'f2' });
    d.rect(x0, y0 + h1, w1, h2, { cls: 'c3', fill: 'f3' });
    d.rect(x0 + w1, y0 + h1, w2, h2, { cls: 'c4', fill: 'f4' });
    d.text(x0 + w1 / 2, y0 - 10, 'c');
    d.text(x0 + w1 + w2 / 2, y0 - 10, 'd');
    d.text(x0 - 14, y0 + h1 / 2 + 4, 'a');
    d.text(x0 - 14, y0 + h1 + h2 / 2 + 4, 'b');
    d.text(x0 + w1 / 2, y0 + h1 / 2 + 4, 'ac');
    d.text(x0 + w1 + w2 / 2, y0 + h1 / 2 + 4, 'ad');
    d.text(x0 + w1 / 2, y0 + h1 + h2 / 2 + 4, 'bc');
    d.text(x0 + w1 + w2 / 2, y0 + h1 + h2 / 2 + 4, 'bd');
    d.text(x0 + (w1 + w2) / 2, y0 + h1 + h2 + 24, '(a+b)(c+d) = ac + ad + bc + bd');
    return d.svg();
  }

  // 2 つの多項式 A, B の積。公式に当てはまれば公式名つきで、そうでなければ分配法則で展開する
  function multiply(A, B) {
    const tA = terms(A), tB = terms(B);
    const res = P.mul(A, B);
    const fB = fac(B, 1);
    const lhs = fac(A, 1) + (fB.charAt(0) === '(' ? '' : R` \cdot `) + fB;
    const same = (u, v) => u.k === v.k && u.c.eq(v.c);
    const opp = (u, v) => u.k === v.k && u.c.eq(v.c.neg());
    let step = null, formula = null;

    if (tA.length === 2 && tB.length === 2) {
      if (polyEq(A, B)) {
        const a = tA[0], b = { c: tA[1].c.abs(), k: tA[1].k }, minus = tA[1].c.sign() < 0, s = minus ? '-' : '+';
        formula = R`(a ` + s + R` b)^{2} = a^{2} ` + s + R` 2ab + b^{2}`;
        step = {
          t: '乗法公式 $(a ' + s + ' b)^{2}$ で展開する',
          m: [formula, chain(lhs, [wrap(a) + '^{2} ' + s + R` 2 \cdot ` + wrap(a) + R` \cdot ` + wrap(b) + ' + ' + wrap(b) + '^{2}', pt(res)])],
          n: R`$a = ` + mono(a.c, a.k) + '$、$b = ' + mono(b.c, b.k) + R`$ とみて公式に当てはめます。中央の項 $2ab$ を書き忘れないように注意します。`,
          easy: R`$(a+b)^{2}$ は「$(a+b)$ を 2 回かけたもの」です。$(a+b)(a+b)$ を分配法則で展開すると $a^{2} + ab + ba + b^{2}$ となり、$ab$ と $ba$ が合わさって $2ab$ になります。だから $a^{2}+b^{2}$ だけでは足りません。`,
          pro: R`暗算では「2 乗 ＋ 2 倍して積 ＋ 2 乗」と唱えながら、符号は $b$ の符号で決めます。`
        };
      } else if ((same(tA[0], tB[0]) && opp(tA[1], tB[1])) || (same(tA[1], tB[1]) && opp(tA[0], tB[0]))) {
        const first = same(tA[0], tB[0]);
        const a = first ? tA[0] : tA[1], o = first ? tA[1] : tA[0], b = { c: o.c.abs(), k: o.k };
        formula = R`(a + b)(a - b) = a^{2} - b^{2}`;
        step = {
          t: '乗法公式 $(a+b)(a-b)$ で展開する',
          m: [formula, chain(lhs, [wrap(a) + '^{2} - ' + wrap(b) + '^{2}', pt(res)])],
          n: R`2 つのかっこで $a$ が同じ符号、$b$ が逆の符号になっています。$a = ` + mono(a.c, a.k) + '$、$b = ' + mono(b.c, b.k) + R`$ とみて公式に当てはめると、中央の項が打ち消し合います。`,
          easy: R`$(a+b)(a-b)$ を分配法則で展開すると $a^{2} - ab + ba - b^{2}$ となり、$-ab$ と $+ba$ が打ち消し合って $a^{2} - b^{2}$ だけが残ります。「和と差の積は 2 乗の差」と覚えます。`,
          pro: R`$(x+3)(x-3)$ のように符号違いのペアを見つけたら即座に $x^{2}-9$。因数分解の「平方の差」とセットで使います。`
        };
      }
    }
    if (!step && tA.length === 2 && tB.length === 2 && P.deg(A) === 1 && P.deg(B) === 1 && tA[1].k === 0 && tB[1].k === 0) {
      const p = tA[0].c, q = tA[1].c, r = tB[0].c, s = tB[1].c;
      if (p.eq(1) && r.eq(1)) {
        formula = R`(x + a)(x + b) = x^{2} + (a + b)x + ab`;
        step = {
          t: '乗法公式 $(x+a)(x+b)$ で展開する',
          m: [formula, chain(lhs, ['x^{2} + (' + q.tex() + ' + ' + U.paren(s) + ')x + ' + U.paren(q) + R` \cdot ` + U.paren(s), pt(res)])],
          n: R`$x$ の係数が 1 の 1 次式どうしの積です。$a = ` + q.tex() + '$、$b = ' + s.tex() + R`$ とみて、$x$ の係数は和 $a+b$、定数項は積 $ab$ になります。`,
          easy: R`$(x+a)(x+b)$ を分配法則で展開すると $x^{2} + bx + ax + ab$。$x$ の項が 2 つできるので $(a+b)x$ にまとめます。「足して $x$ の係数、かけて定数項」と覚えると、あとで学ぶ因数分解（たすき掛け）の逆の操作になります。`,
          pro: R`定数 $a, b$ が整数なら、和と積を暗算してそのまま $x^{2}+(a+b)x+ab$ と書き下せます。`
        };
      } else {
        formula = R`(px + q)(rx + s) = prx^{2} + (ps + qr)x + qs`;
        step = {
          t: '乗法公式 $(px+q)(rx+s)$ で展開する',
          m: [formula, chain(lhs, ['(' + p.tex() + R` \cdot ` + U.paren(r) + ')x^{2} + (' + p.tex() + R` \cdot ` + U.paren(s) + ' + ' + U.paren(q) + R` \cdot ` + U.paren(r) + ')x + ' + U.paren(q) + R` \cdot ` + U.paren(s), pt(res)])],
          n: R`$p=` + p.tex() + ',\\ q=' + q.tex() + ',\\ r=' + r.tex() + ',\\ s=' + s.tex() + R`$ を公式に代入します。$x$ の係数は「たすき掛け」の 2 つの積 $ps$ と $qr$ の和です。`,
          easy: R`4 つの項 $px\cdot rx,\ px\cdot s,\ q\cdot rx,\ q\cdot s$ のうち、$x$ が 1 つだけの 2 つ（$ps\,x$ と $qr\,x$）が同類項なので 1 つにまとめます。`,
          pro: R`$x$ の係数は「外側どうし ＋ 内側どうし」と覚えると速く展開できます。`
        };
      }
    }
    if (!step) {
      let rhs;
      const cross = [];
      tA.forEach((a) => tB.forEach((b) => cross.push(mulT(a, b))));
      if (tA.length === 1 || tB.length === 1) rhs = [sumTex(cross), pt(res)];
      else {
        const Bt = '(' + pt(B) + ')';
        const first = tA.map((t, i) => (i ? (t.c.sign() < 0 ? ' - ' : ' + ') : (t.c.sign() < 0 ? '-' : '')) + coefTimes(t.c.abs(), t.k) + Bt).join('');
        rhs = [first, sumTex(cross), pt(res)];
      }
      const simple = tA.length === 1 || tB.length === 1;
      step = {
        t: simple ? '単項式をかける（分配法則）' : 'かっこを外す（分配法則）',
        m: chain(lhs, rhs),
        n: simple
          ? R`単項式を、かっこの中の**すべての項**にかけます。符号（とくにマイナス）と指数のたし算 $x^{a}\cdot x^{b}=x^{a+b}$ に気をつけます。`
          : R`左のかっこの項を 1 つずつ、右のかっこ全体にかけます。そのあと、かっこの中身を 1 項ずつ展開し、同類項（$x$ の次数が同じ項）をまとめます。`,
        easy: simple
          ? R`たとえば $3x(x-2)$ なら、$3x$ を $x$ と $-2$ の両方にかけて $3x\cdot x + 3x\cdot(-2)$ とします。「かける数を、かっこの中の全員に配る」のが分配法則です。`
          : LAW_EASY,
        pro: R`項数が多いときは、$x$ の次数ごとに「かけて $x^{k}$ になる組」を拾って係数を足すと、中間式を書かずに済みます。`
      };
    }
    return { step: step, res: res, formula: formula };
  }

  // (底)^e の展開。2 項の 2 乗・3 乗は公式、それ以外は順に掛けていく
  function powerExpand(base, e, steps, formulas) {
    const t = terms(base);
    if (t.length === 2 && e === 3) {
      const a = t[0], b = { c: t[1].c.abs(), k: t[1].k }, minus = t[1].c.sign() < 0, s = minus ? '-' : '+';
      const res = P.mul(P.mul(base, base), base);
      const parts = [
        powT(a, 3),
        { c: a.c.pow(2).mul(b.c).mul(3).mul(minus ? -1 : 1), k: 2 * a.k + b.k },
        { c: a.c.mul(b.c.pow(2)).mul(3), k: a.k + 2 * b.k },
        { c: b.c.pow(3).mul(minus ? -1 : 1), k: 3 * b.k }
      ];
      const formula = R`(a ` + s + R` b)^{3} = a^{3} ` + s + R` 3a^{2}b + 3ab^{2} ` + s + ' b^{3}';
      formulas.push(formula);
      steps.push({
        t: '乗法公式 $(a ' + s + ' b)^{3}$ で展開する',
        m: [formula, chain(fac(base, 3), [wrap(a) + '^{3} ' + s + R` 3 \cdot ` + wrap(a) + '^{2} \\cdot ' + wrap(b) + R` + 3 \cdot ` + wrap(a) + R` \cdot ` + wrap(b) + '^{2} ' + s + ' ' + wrap(b) + '^{3}', sumTex(parts), pt(res)])],
        n: R`$a = ` + mono(a.c, a.k) + '$、$b = ' + mono(b.c, b.k) + R`$ を公式に代入します。係数 $1,\ 3,\ 3,\ 1$ と、$b$ が引かれるときは符号が $+,\ -,\ +,\ -$ と交互になることを確認します。`,
        easy: R`$(a+b)^{3}$ は $(a+b)(a+b)(a+b)$、つまり 3 回かけたものです。展開すると $a$ と $b$ の組み合わせで $a^{3},\ a^{2}b,\ ab^{2},\ b^{3}$ の 4 種類の項ができ、$a^{2}b$ と $ab^{2}$ はそれぞれ 3 通りずつの選び方があるので係数が 3 になります。`,
        pro: R`係数 $1,\ 3,\ 3,\ 1$ はパスカルの三角形の 3 段目。$(a-b)^{3}$ は符号が交互になるだけです。`
      });
      return res;
    }
    let acc = base;
    for (let i = 2; i <= e; i++) {
      const m = multiply(acc, base);
      if (m.formula) formulas.push(m.formula);
      const st = Object.assign({}, m.step);
      if (e > 2) st.t = i + ' 乗まで: ' + st.t;
      steps.push(st);
      acc = m.res;
    }
    return acc;
  }

  function evalTex(p, a) {                                 // p(a) の代入式（x に a を入れた形）
    const par = (a.isInt() && a.sign() >= 0) ? a.tex() : R`\left(` + a.tex() + R`\right)`;
    let out = '';
    terms(p).forEach((t) => {
      const ac = t.c.abs();
      const cs = (ac.eq(1) && t.k > 0) ? '' : ac.tex();
      const xs = t.k === 0 ? '' : par + (t.k > 1 ? '^{' + t.k + '}' : '');
      const body = cs !== '' && xs !== '' ? cs + R` \cdot ` + xs : cs + xs;
      out += out === '' ? (t.c.sign() < 0 ? '-' : '') + body : (t.c.sign() < 0 ? ' - ' : ' + ') + body;
    });
    return out === '' ? '0' : out;
  }
  function ppow(base, e) {
    let r = [Q(1)];
    for (let i = 0; i < e; i++) r = P.mul(r, base);
    return r;
  }
  function termTex(tm, first) {                            // 項の表示（符号つき）
    let body = '';
    tm.facs.forEach((f, i) => {
      const s = fac(f.base, f.e);
      body += (i > 0 && s.charAt(0) !== '(' ? R` \cdot ` : '') + s;
    });
    if (first) return (tm.sign < 0 ? '-' : '') + body;
    return (tm.sign < 0 ? ' - ' : ' + ') + body;
  }
  const exprTex = (ex) => ex.list.map((tm, i) => termTex(tm, i === 0)).join('');

  // 1 つの項（因数の積）を展開して多項式にする。途中のステップは steps に積む
  function expandTerm(tm, steps, formulas) {
    const polys = tm.facs.filter((f) => !isMono(f.base));
    let M = [Q(1)];
    tm.facs.filter((f) => isMono(f.base)).forEach((f) => { M = P.mul(M, ppow(f.base, f.e)); });
    if (!polys.length) return P.scale(M, tm.sign);
    const list = polys.map((f) => (f.e > 1 ? powerExpand(f.base, f.e, steps, formulas) : f.base));
    let acc = list[0];
    for (let i = 1; i < list.length; i++) {
      const m = multiply(acc, list[i]);
      if (m.formula) formulas.push(m.formula);
      steps.push(m.step);
      acc = m.res;
    }
    if (!(M.length === 1 && M[0].eq(1))) {
      const m = multiply(M, acc);
      steps.push(m.step);
      acc = m.res;
    }
    if (tm.sign < 0) {
      const neg = P.neg(acc);
      steps.push({
        t: 'かっこの前のマイナスをかける',
        m: chain('-' + fac(acc, 1), [pt(neg)]),
        n: R`かっこの前の $-$ は $-1$ をかけることなので、かっこの中の**すべての項**の符号が変わります。`,
        easy: R`$-(a+b)$ は $(-1)\times(a+b)$ のこと。$-1$ を分配すると $-a-b$ になります。符号の変え忘れが最も多いミスです。`,
        pro: R`引き算のかっこは「外す前に中身を先に展開」してから符号を反転させると、符号ミスが減ります。`
      });
      return neg;
    }
    return acc;
  }

  function lhsAt(ex, a) {                                  // 展開前の式に x = a を代入した TeX と値
    let out = '', val = Q(0);
    ex.list.forEach((tm, i) => {
      let v = Q(1);
      const parts = tm.facs.map((f) => {
        const fv = P.eval(f.base, a);
        v = v.mul(fv.pow(f.e));
        return f.e > 1 ? R`\left(` + fv.tex() + R`\right)^{` + f.e + '}' : U.paren(fv);
      });
      const body = parts.join(R` \times `);
      out += i === 0 ? (tm.sign < 0 ? '-' : '') + body : (tm.sign < 0 ? ' - ' : ' + ') + body;
      val = val.add(v.mul(tm.sign));
    });
    return { tex: out, val: val };
  }

  JK.registerCalc({
    id: 'ia-expand',
    course: 'IA',
    unit: 'm-expr',
    group: '数と式',
    title: '式の展開',
    desc: 'かっこのついた式を、分配法則や乗法公式を使って展開し、同類項をまとめて降べきの順に整理します。',
    form: R`(a+b)(c+d) = ac + ad + bc + bd`,
    inputs: [
      { key: 'text', label: '展開する式', type: 'text', def: '(2x+3)(x-5)', hint: '文字は x のみ。かっこの積・累乗 ^ ・足し引きが使えます（例: (x+2)^3, (x-1)(x+1)(x^2+1), (x+1)^2-(x-2)(x+3)）' }
    ],
    examples: [
      { label: '2 つのかっこ', v: { text: '(2x+3)(x-5)' } },
      { label: '3 乗の公式', v: { text: '(x+2)^3' } },
      { label: '3 つの積', v: { text: '(x-1)(x+1)(x^2+1)' } },
      { label: '和と差', v: { text: '(x+1)^2-(x-2)(x+3)' } },
      { label: '単項式をかける', v: { text: '3x(x-2)(x+4)' } }
    ],
    intro: {
      easy: R`**展開**とは、かっこのついた式を、かっこのない「項を足し算でつなげた式」に直すことです。かっこの中身を、もう一方のかっこの中身**すべて**に順にかける——これが**分配法則**で、展開の基本はこの 1 つだけです。
かけ算を終えると $x$ の次数が同じ項（**同類項**）がいくつか出てくるので、それらの係数を足して 1 つにまとめます。最後に、次数の高い順（**降べき**の順）に並べれば完成です。`,
      normal: R`分配法則で 1 項ずつかけて同類項をまとめる。$(a\pm b)^{2}$、$(a+b)(a-b)$、$(x+a)(x+b)$、$(a\pm b)^{3}$ の乗法公式に当てはまるときは公式で一気に展開します。`,
      pro: R`乗法公式は「公式の形を見抜く」ことが最大の時短です。$(x+a)(x+b)$ は「和と積」、$(px+q)(rx+s)$ は「たすき掛けの逆」で暗算でき、因数分解の検算にも使えます。`
    },
    compute(v) {
      const ex = readExpr(v.text);
      const steps = [], formulas = [];
      const nTerms = ex.list.length;
      steps.push({
        t: '式を因数（かっこや単項式）に分けて読む',
        m: exprTex(ex),
        n: R`かっこ 1 つ分を 1 つの「かたまり（**因数**）」として読みます。` + (nTerms > 1 ? R`足し算・引き算でつながった項は、1 つずつ展開してから最後に足し合わせます。` : R`左から順に、かっこどうしを展開していきます。`),
        easy: R`**因数**とは「かけ算の部品」のことです。$(2x+3)(x-5)$ なら、部品は $(2x+3)$ と $(x-5)$ の 2 つ。展開はこの部品どうしのかけ算を、かっこのない形に直す作業です。`
      });
      steps.push({
        t: '分配法則とは（面積で考える）',
        m: R`(a+b)(c+d) = ac + ad + bc + bd`,
        n: R`左のかっこの各項を、右のかっこの各項に 1 回ずつかけて足します。2 項 × 2 項なら 4 つの積ができます。`,
        easy: LAW_EASY,
        fig: areaFig(),
        lv: 3
      });
      const per = [];
      ex.list.forEach((tm, i) => {
        const sub = [];
        const res = expandTerm(tm, sub, formulas);
        if (nTerms > 1 && sub.length) steps.push({ t: (i + 1) + ' つ目の項を展開する', m: termTex(tm, true), n: R`この項だけを先に展開します。` });
        sub.forEach((s) => steps.push(s));
        per.push(res);
      });
      const total = per.reduce((acc, p) => P.add(acc, p), [Q(0)]);
      if (!polyEq(total, ex.whole)) throw new JK.CalcError('展開の途中で不整合が生じました。式の書き方（かっこの対応・文字は x のみ）を確認してください');
      if (nTerms > 1) {
        const all = [];
        per.forEach((p) => terms(p).forEach((t) => all.push(t)));
        steps.push({
          t: 'すべての項を足し合わせ、同類項をまとめる',
          m: chain(exprTex(ex), [sumTex(all), pt(total)]),
          n: R`展開した結果を並べ、$x$ の次数が同じ項（同類項）の係数を足します。打ち消し合って 0 になる項は消えます。`,
          easy: R`同類項とは、文字の部分が同じ項のこと。たとえば $3x$ と $-x$ は同類項で、$3x + (-x) = 2x$ とまとめられますが、$x^{2}$ と $x$ はまとめられません。`
        });
      }
      steps.push({
        t: '降べきの順に整理して答え',
        m: chain(exprTex(ex), [pt(total)]),
        n: R`次数の高い項から順に並べます。同類項が残っていないことを確認します。`,
        easy: R`**降べき**の順とは $x^{3},\ x^{2},\ x,\ \text{定数}$ のように、次数が大きい項から小さい項へ並べること。答えはいつもこの形で書きます。`
      });
      const chk = lhsAt(ex, Q(2));
      steps.push({
        t: '検算: $x = 2$ を代入して比べる',
        m: [
          R`\text{展開前: } ` + chk.tex + ' = ' + chk.val.tex(),
          R`\text{展開後: } ` + evalTex(total, Q(2)) + ' = ' + P.eval(total, Q(2)).tex()
        ],
        n: R`展開前の式と展開後の式に同じ値を代入して、結果が一致することを確かめます。一致しなければどこかで計算ミスをしています。`,
        pro: R`$x = 1$ を代入すると「展開後の係数の総和」が求まるので、係数の足し算ミスを最短で検算できます。`,
        lv: 2
      });
      const deg = P.deg(total);
      const out = [{ label: '展開結果', tex: pt(total) }];
      if (deg >= 1) out.push({ label: '次数', tex: deg + R`\ \text{次式}` });
      out.push({ label: '項の数', tex: String(terms(total).length) });
      if (formulas.length) out.push({ label: '使った公式', tex: formulas[0] });
      return { result: out, steps: steps };
    }
  });

  /* ================= 因数分解 ================= */

  const isSq = (n) => Number.isInteger(n) && n >= 0 && Math.pow(Math.round(Math.sqrt(n)), 2) === n;
  const isqrt = (n) => Math.round(Math.sqrt(n));
  const sqv = (al, v) => (al === 1 ? v + '^{2}' : '(' + al + v + ')^{2}');

  // 有理数係数の多項式 → 共通の数 c（符号込み）と、整数係数・互いに素・最高次係数が正の多項式 q（p = c·q）
  function primitive(p) {
    let L = 1, g = 0;
    p.forEach((c) => { L = U.lcm(L, c.d); });
    const ints = p.map((c) => c.n * (L / c.d));
    ints.forEach((n) => { g = U.gcd(g, n); });
    const sg = ints[ints.length - 1] < 0 ? -1 : 1;
    return { c: Q(sg * g, L), q: ints.map((n) => Q(n / g * sg)) };
  }
  function commonTex(c, k) {                               // 共通因数 c·x^k の TeX（なければ空文字）
    const cs = c.eq(1) ? '' : (c.eq(-1) ? '-' : c.tex());
    return cs + (k > 0 ? 'x' + (k > 1 ? '^{' + k + '}' : '') : '');
  }
  function divisors(n) {
    const out = [];
    for (let i = 1; i * i <= n; i++) if (n % i === 0) { out.push(i); if (i * i !== n) out.push(n / i); }
    return out.sort((a, b) => a - b);
  }
  // 有理数解の候補 ±(定数項の約数)/(最高次係数の約数)。絶対値の小さい順・同じなら正が先
  function candidates(q) {
    const a0 = Math.abs(q[0].n), an = Math.abs(q[q.length - 1].n), seen = {}, out = [];
    divisors(a0).forEach((u) => divisors(an).forEach((w) => [1, -1].forEach((sg) => {
      const c = Q(sg * u, w), key = c.toString();
      if (!seen[key]) { seen[key] = true; out.push(c); }
    })));
    return out.sort((x, y) => x.abs().cmp(y.abs()) || y.cmp(x));
  }
  function linFactor(root) {                               // 解 u/w の 1 次因数 (w·x − u)
    return P.of([root.n * -1, root.d]);
  }

  // 2 次式 q（整数・原始・最高次係数が正・定数項 ≠ 0）の因数分解。変数名は v。
  // 分解できれば 2 つの 1 次式、できなければ [q] を返す
  function quadratic(q, steps, v) {
    const a = q[2].n, b = q[1].n, c = q[0].n, f = P.tex(q, v), D = b * b - 4 * a * c;
    const lin = (p, s) => P.of([s, p]);
    const pv = (p) => P.tex(p, v);
    if (b === 0) {
      if (c < 0 && isSq(a) && isSq(-c)) {
        const al = isqrt(a), ga = isqrt(-c);
        steps.push({
          t: '平方の差の因数分解',
          m: [R`A^{2} - B^{2} = (A + B)(A - B)`, chain(f, [sqv(al, v) + ' - ' + ga + '^{2}', '(' + pv(lin(al, ga)) + ')(' + pv(lin(al, -ga)) + ')'])],
          n: R`$` + f + R`$ は 2 乗 − 2 乗の形です。$A = ` + (al === 1 ? '' : al) + v + R`$、$B = ` + ga + R`$ として公式を使います。`,
          easy: R`「2 乗 − 2 乗」の形は、和と差の積に分かれます。逆向きに確かめると、$(A+B)(A-B)$ を展開したとき真ん中の項が打ち消し合って $A^{2}-B^{2}$ だけが残るからです。`,
          pro: R`平方数（1, 4, 9, 16, 25, …）が見えたら、まず平方の差を疑います。$x^{4}-1$ のように、次数が大きくても同じ形になります。`
        });
        return [lin(al, ga), lin(al, -ga)];
      }
      steps.push({
        t: 'これ以上分解できるか調べる',
        m: f,
        n: c > 0
          ? R`$` + f + R`$ は 2 乗の和（正の数どうしの足し算）なので、実数の範囲でも因数分解できません。`
          : R`$` + f + R`$ は「2 乗 − 2 乗」の形ですが、$` + a + R`$ と $` + (-c) + R`$ の少なくとも一方が平方数ではないので、有理数（整数・分数）の範囲では分解できません。`,
        easy: R`因数分解は「整数や分数を使った因数の積」に直す作業です。$x^{2}-2$ のように、分けるのに $\sqrt{2}$ のような無理数が必要な式は、この範囲ではこれ以上分解できません。`
      });
      return [q];
    }
    const dExp = R`D = b^{2} - 4ac = ` + U.paren(Q(b)) + R`^{2} - 4 \cdot ` + U.paren(Q(a)) + R` \cdot ` + U.paren(Q(c)) + ' = ' + D;
    if (D < 0 || !isSq(D)) {
      steps.push({
        t: '因数分解できるか調べる（判別式）',
        m: [R`D = b^{2} - 4ac`, dExp],
        n: D < 0
          ? R`$D<0$ なので $` + f + R` = 0$ は実数解をもたず、実数の範囲でこれ以上分解できません。`
          : R`$D = ` + D + R`$ は平方数ではない（$\sqrt{D}$ が無理数）ので、整数係数の因数には分けられません。有理数の範囲ではこれ以上分解できません。`,
        easy: R`2 次式 $ax^{2}+bx+c$ が整数の範囲で因数分解できるかどうかは、**判別式** $D = b^{2}-4ac$ が平方数（$0, 1, 4, 9, 16, \cdots$）になるかどうかで決まります。平方数でないときは、掛けて $ac$・足して $b$ になる整数の組が見つかりません。`,
        pro: R`たすき掛けを試す前に $D$ を計算すると、「分解できない」と早く判断できます。`
      });
      return [q];
    }
    if (D === 0) {
      const al = isqrt(a), ga = isqrt(c), s = b > 0 ? '+' : '-';
      steps.push({
        t: '完全平方式の因数分解',
        m: [R`A^{2} ` + s + R` 2AB + B^{2} = (A ` + s + R` B)^{2}`, chain(f, [sqv(al, v) + ' ' + s + R` 2 \cdot ` + (al === 1 ? '' : al) + v + R` \cdot ` + ga + ' + ' + ga + '^{2}', '(' + pv(lin(al, b > 0 ? ga : -ga)) + ')^{2}'])],
        n: R`最初と最後の項が 2 乗の形（$A = ` + (al === 1 ? '' : al) + v + R`$、$B = ` + ga + R`$）で、真ん中の項が $` + s + R`2AB$ になっているので、$(A ` + s + R` B)^{2}$ にまとまります。`,
        easy: R`$(A+B)^{2}$ を展開すると $A^{2}+2AB+B^{2}$ でした。この**逆**です。「最初と最後が 2 乗、真ん中がそれぞれの 2 倍の積」という形を見つけたら、$(A\pm B)^{2}$ に戻せます。`,
        pro: R`$D = 0$（重解）のときは必ず完全平方式になります。判別式で確認すると見落としません。`
      });
      return [lin(al, b > 0 ? ga : -ga), lin(al, b > 0 ? ga : -ga)];
    }
    // D が正の平方数: たすき掛け（掛けて ac・足して b になる 2 数 m, n を探す）
    const ac = a * c, tries = [];
    let found = null;
    for (let d = 1; d * d <= Math.abs(ac) && !found; d++) {
      if (Math.abs(ac) % d !== 0) continue;
      const e = Math.abs(ac) / d;
      const pairs = ac > 0 ? [[Math.sign(b) * d, Math.sign(b) * e]] : (d === e ? [[d, -e]] : [[d, -e], [-d, e]]);
      for (let k = 0; k < pairs.length && !found; k++) {
        const pr = pairs[k], sum = pr[0] + pr[1];
        tries.push({ m: pr[0], n: pr[1], sum: sum });
        if (sum === b) found = pr;
      }
    }
    const shown = tries.length > 8 ? tries.slice(0, 5).concat([null], tries.slice(-2)) : tries;
    const trialLines = shown.map((t) => (t === null ? R`\cdots`
      : U.paren(Q(t.m)) + R` \times ` + U.paren(Q(t.n)) + ' = ' + ac + R`,\quad ` + U.paren(Q(t.m)) + ' + ' + U.paren(Q(t.n)) + ' = ' + t.sum + (t.sum === b ? R`\quad \text{← } b = ` + b + R` \text{ と一致}` : R` \ne ` + b)));
    steps.push({
      t: 'たすき掛け: 掛けて $ac$、足して $b$ になる 2 数を探す',
      m: [R`ac = ` + U.paren(Q(a)) + R` \times ` + U.paren(Q(c)) + ' = ' + ac + R`,\quad b = ` + b].concat(trialLines),
      n: R`積が $ac = ` + ac + R`$ になる 2 数の組を順に調べ、和が $b = ` + b + R`$ になるものを探します。` + (ac < 0 ? R`積が負なので、2 数は異符号です。` : R`積が正で和が` + (b > 0 ? '正' : '負') + R`なので、2 数はともに` + (b > 0 ? '正' : '負') + R`の数です。`),
      easy: R`展開の逆をたどります。たとえば $(x+2)(x+3) = x^{2} + 5x + 6$ では、$5 = 2 + 3$（和）、$6 = 2 \times 3$（積）でした。そこで因数分解のときは「かけて定数項、たして $x$ の係数」になる 2 数を探します。$x^{2}$ の係数が 1 でないときは「かけて $ac$、たして $b$」です。`,
      pro: R`$|ac|$ の約数の組を小さい順に試し、符号は先に決めてしまうと速く見つかります。見つからなければ $D$ が平方数かどうかを疑います。`
    });
    if (!found) {
      steps.push({ t: 'これ以上分解できるか調べる', m: f, n: R`整数の組が見つからないため、有理数の範囲ではこれ以上分解できません。` });
      return [q];
    }
    const mm = found[0], nn = found[1];
    const p = U.gcd(a, mm), r = a / p, t = mm / p, s2 = nn * p / a;
    const B1in = pv(P.of([t, r])), B1 = '(' + B1in + ')';
    const lead = (n) => (n === 1 ? '' : (n === -1 ? '-' : n)) + v;               // 先頭の項 n·v
    const sgnLin = (n) => (n < 0 ? ' - ' : ' + ') + (Math.abs(n) === 1 ? '' : Math.abs(n)) + v;
    const sgnNum = (n) => (n < 0 ? ' - ' : ' + ') + Math.abs(n);
    const second = (s2 < 0 ? ' - ' : ' + ') + (Math.abs(s2) === 1 ? '' : Math.abs(s2)) + B1;
    steps.push({
      t: R`$` + v + R`$ の項を 2 つに分けて、共通のかっこでくくる`,
      m: chain(f, [
        (a === 1 ? '' : a) + v + '^{2}' + sgnLin(mm) + sgnLin(nn) + sgnNum(c),
        '(' + (a === 1 ? '' : a) + v + '^{2}' + sgnLin(mm) + ') + (' + lead(nn) + sgnNum(c) + ')',
        (p === 1 ? '' : p) + v + B1 + second,
        '(' + pv(lin(p, s2)) + ')' + B1
      ]),
      n: R`$` + lead(b) + ' = ' + lead(mm) + sgnLin(nn) + R`$ と分けて、前の 2 項・後ろの 2 項からそれぞれ共通因数をくくり出すと、同じかっこ $` + B1in + R`$ が現れます。それをもう一度くくり出します。`,
      easy: R`同じかっこが 2 回出てくることがポイントです。「$A(\ ) + B(\ )$」の形になれば、かっこ $(\ )$ を 1 つの文字のように見て $(A+B)(\ )$ とくくれます。`,
      lv: 2
    });
    steps.push({
      t: 'たすき掛けで確かめる',
      m: [chain(f, ['(' + pv(lin(p, s2)) + ')(' + pv(lin(r, t)) + ')']), R`p t + s r = ` + p + R` \cdot ` + U.paren(Q(t)) + ' + ' + U.paren(Q(s2)) + R` \cdot ` + r + ' = ' + (p * t + s2 * r) + R` = b`],
      n: R`$(p` + v + R`+s)(r` + v + R`+t)$ として $p=` + p + R`,\ s=` + s2 + R`,\ r=` + r + R`,\ t=` + t + R`$ です。たすき掛けの図で斜めにかけた 2 つの積の和 $pt+sr$ が、元の 1 次の項の係数 $b = ` + b + R`$ と一致することを確認します。`,
      easy: R`$(px+s)(rx+t)$ を展開したときの $x$ の係数は $pt + sr$。2 つのかっこの「外側どうし」ではなく「斜め（たすき）」にかけて足すので、たすき掛けと呼びます。`,
      pro: R`答えが出たら、必ず暗算で展開して $x$ の係数が合っているか確認します（入試の計算ミス対策）。`
    });
    return [lin(p, s2), lin(r, t)];
  }

  // 4 次式を (a1x²+px+c1)(a2x²+rx+c2) の形（整数係数）に分ける。なければ null
  function pairSearch(q) {
    const a = q[4].n, c = q[0].n, B3 = q[3].n, B2 = q[2].n, B1 = q[1].n;
    const bound = Math.min(300, 2 * q.reduce((s, x) => s + Math.abs(x.n), 0) + 2);
    const cd = divisors(Math.abs(c));
    for (const a1 of divisors(a)) {
      const a2 = a / a1;
      if (a1 > a2) continue;
      for (const cc of cd) {
        for (const c1 of [cc, -cc]) {
          const c2 = c / c1;
          for (let p = -bound; p <= bound; p++) {
            const rn = B3 - a2 * p;
            if (rn % a1 !== 0) continue;
            const r = rn / a1;
            if (a1 * c2 + a2 * c1 + p * r === B2 && p * c2 + r * c1 === B1) return [P.of([c1, p, a1]), P.of([c2, r, a2])];
          }
        }
      }
    }
    return null;
  }
  function trialLines(f, list, root) {                     // f(α) の代入計算の行（長いときは省略）
    const shown = list.length > 7 ? list.slice(0, 5).concat([null], root ? [root] : list.slice(-1)) : list;
    return shown.map((cc) => (cc === null ? R`\cdots`
      : R`f(` + cc.tex() + ') = ' + evalTex(f, cc) + ' = ' + P.eval(f, cc).tex() + (root && cc.eq(root) ? R`\quad \text{← } 0 \text{ になった}` : R` \ne 0`)));
  }
  function synthLines(f, a) {                              // 組立除法の計算（a は整数の解）
    const co = [];
    for (let k = f.length - 1; k >= 0; k--) co.push(f[k]);
    const b = [co[0]];
    const lines = [R`\text{係数（降べき）: } ` + co.map((c) => c.tex()).join(R`,\ `), R`\text{最高次の係数 } ` + co[0].tex() + R` \text{ をそのまま下ろす}`];
    for (let i = 1; i < co.length; i++) {
      const val = co[i].add(a.mul(b[i - 1]));
      lines.push(co[i].tex() + ' + ' + U.paren(a) + R` \cdot ` + U.paren(b[i - 1]) + ' = ' + val.tex() + (i === co.length - 1 ? R`\quad \text{（余り）}` : ''));
      b.push(val);
    }
    return lines;
  }

  // 次数 2 以上の原始整数多項式 q0（定数項 ≠ 0）を、有理数の範囲で既約な因数に分ける
  function factorAll(q0, steps) {
    const out = [], queue = [q0];
    let theorem = false;
    for (let guard = 0; queue.length && guard < 16; guard++) {
      const f = queue.shift(), d = P.deg(f), fx = pt(f);
      if (d <= 1) { out.push(f); continue; }
      if (d === 2) { quadratic(f, steps, 'x').forEach((g) => out.push(g)); continue; }
      // 4 次で奇数次の項がない形 → x² = X とおく
      if (d === 4 && f[1].isZero() && f[3].isZero()) {
        const G = P.of([f[0], f[2], f[4]]), Dd = f[2].n * f[2].n - 4 * f[4].n * f[0].n;
        if (Dd >= 0 && isSq(Dd)) {
          const sub = [], gx = quadratic(G, sub, 'X');
          if (gx.length === 2) {
            steps.push({
              t: R`$x^{2} = X$ とおいて、$X$ の 2 次式として因数分解する`,
              m: [R`X = x^{2}`, chain(fx, [P.tex(G, 'X')])],
              n: R`$x$ の奇数次の項がない（$x^{4},\ x^{2},\ $ 定数項だけ）ので、$x^{2}$ を 1 つの文字 $X$ とみなすと 2 次式になります。`,
              easy: R`$x^{4} = (x^{2})^{2}$ なので、$x^{2}$ を $X$ という 1 文字に置き換えると $X^{2}$ の 2 次式として見えます。2 次式の因数分解ができれば、最後に $X$ を $x^{2}$ に戻すだけです。`,
              pro: R`この形は「複 2 次式」と呼ばれ、入試頻出です。置き換えのあと、平方の差で $x$ のレベルまで分解できることが多いです。`
            });
            sub.forEach((s) => steps.push(s));
            const hs = gx.map((g) => P.of([g[0], 0, g[1]]));
            steps.push({
              t: R`$X$ を $x^{2}$ に戻す`,
              m: chain(fx, [hs.map((h) => '(' + pt(h) + ')').join('')]),
              n: R`$X$ にもとの $x^{2}$ を代入します。さらに分解できるかっこがないか、それぞれ確認します。`
            });
            hs.forEach((h) => queue.push(h));
            continue;
          }
        }
      }
      const roots = P.rationalRoots(f), cand = candidates(f);
      if (roots.length) {
        const idx = cand.findIndex((cc) => roots.some((rr) => rr.eq(cc))), root = cand[idx];
        steps.push({
          t: R`因数定理: $f(\alpha) = 0$ となる $\alpha$ を探す`,
          m: [R`f(x) = ` + fx].concat(trialLines(f, cand.slice(0, idx + 1), root)),
          n: R`$f(\alpha) = 0$ ならば $f(x)$ は $(x - \alpha)$ で割り切れます（**因数定理**）。$\alpha$ の候補は「$\pm$（定数項 $` + f[0].tex() + R`$ の約数）÷（最高次の係数 $` + f[d].tex() + R`$ の約数）」で、絶対値の小さい順に代入します。`,
          easy: theorem
            ? R`前と同じ要領で、$f(\alpha) = 0$ になる $\alpha$ を探します。`
            : R`3 次以上の式には、たすき掛けのような型がありません。そこで「$x$ にある数 $\alpha$ を入れたら式が 0 になる」場合を探します。$f(\alpha)=0$ なら、$f(x)$ には $(x-\alpha)$ というかけ算の部品が入っています（**因数定理**）。部品が 1 つ見つかれば、割り算で残りが求まります。`,
          pro: R`まず $x = \pm 1$（係数の総和・交代和が 0）、次に $\pm 2$ を試すのが定石。最高次の係数が 1 でないときは分数の候補も忘れずに。`
        });
        theorem = true;
        const lf = linFactor(root), quo = P.divmod(f, lf).q;
        steps.push({
          t: R`$` + pt(lf) + R`$ で割って、残りの因数を求める`,
          m: chain(fx, ['(' + pt(lf) + ')(' + pt(quo) + ')']),
          n: R`$f(x)$ を $` + pt(lf) + R`$ で割った商が $` + pt(quo) + R`$ で、余りは 0 です。これで $f(x)$ が 1 次因数と ` + (P.deg(quo) + R` 次式の積に分かれました。`)
        });
        if (root.isInt()) {
          steps.push({
            t: '割り算の計算（組立除法）',
            m: synthLines(f, root).concat([R`\text{商 } ` + pt(quo)]),
            n: R`係数だけで割り算します。最高次の係数を下ろし、「$\alpha$ をかけて次の係数に足す」を繰り返します。最後の値が余りで、0 になることが $f(\alpha)=0$ の確認になります。`,
            lv: 3
          });
        }
        out.push(lf);
        queue.push(quo);
        continue;
      }
      if (d === 4) {
        const pr = pairSearch(f);
        if (pr) {
          steps.push({
            t: '2 次式 2 つの積に分けられるか調べる（係数比較）',
            m: [R`f(x) = ` + fx, R`f(x) = (` + pt(pr[0]) + ')(' + pt(pr[1]) + ')'],
            n: R`有理数の解がないので 1 次式は取り出せません。そこで $(a_{1}x^{2}+px+c_{1})(a_{2}x^{2}+rx+c_{2})$ とおき、展開した各項の係数が元の式と一致するような整数 $p,\ r,\ c_{1},\ c_{2}$ を探すと、上のように分けられます。`,
            easy: R`1 次の因数がなくても、2 次式 2 つの積に分かれることがあります。それぞれの係数を文字でおき、展開して元の式と「各項の係数が等しい」という条件から決めます。`,
            pro: R`$x^{4}+x^{2}+1 = (x^{2}+1)^{2}-x^{2}$ のように、平方の差 $A^{2}-B^{2}$ をつくる変形が定石です。係数比較より速いことが多いです。`
          });
          out.push(pr[0], pr[1]);
          continue;
        }
      }
      steps.push({
        t: '有理数の範囲でこれ以上分解できるか調べる',
        m: [R`f(x) = ` + fx].concat(trialLines(f, cand.slice(0, 7), null), cand.length > 7 ? [R`\cdots`] : []),
        n: R`$f(x)$ が有理数の範囲で分解できるなら、` + (d === 3 ? R`必ず 1 次の因数（有理数解）をもちます。` : R`1 次の因数か 2 次式 2 つの積に分かれます。`) + R`候補をすべて調べても 0 にならず、` + (d === 4 ? R`2 次式の積にも分けられない` : R`有理数解がない`) + R`ので、**有理数の範囲ではこれ以上分解できません**。`,
        easy: R`ここで言う「分解できない」は、整数や分数だけを使う範囲での話です。$\sqrt{2}$ のような無理数まで使えば分けられることもありますが、高校数学の因数分解では通常、整数係数で考えます。`
      });
      out.push(f);
    }
    queue.forEach((g) => out.push(g));
    return out;
  }

  function facsTex(c, groups) {                            // c と因数（{p, e}）の積の TeX
    const pre = c.eq(1) ? '' : (c.eq(-1) ? '-' : c.tex());
    if (c.eq(1) && groups.length === 1 && groups[0].e === 1) return pt(groups[0].p);
    let s = pre;
    groups.forEach((g) => {
      const isX = P.deg(g.p) === 1 && g.p[0].isZero() && g.p[1].eq(1);
      s += (isX ? 'x' : '(' + pt(g.p) + ')') + (g.e > 1 ? '^{' + g.e + '}' : '');
    });
    return s === '' ? '1' : s;
  }

  JK.registerCalc({
    id: 'ia-factor',
    course: 'IA',
    unit: 'm-expr',
    group: '数と式',
    title: '因数分解',
    desc: '多項式（1〜4 次）を、共通因数・公式・たすき掛け・因数定理を使って因数分解します。有理数の範囲でこれ以上分解できない因数も判定します。',
    form: R`ax^{2}+bx+c \;\to\; (px+q)(rx+s)`,
    inputs: [
      { key: 'f', label: '因数分解する式', type: 'poly', def: 'x^2+5x+6', hint: '1〜4 次の式。係数は整数・分数・小数が使えます（例: 6x^2+7x-3, x^3-6x^2+11x-6, x^4-5x^2+4）' }
    ],
    examples: [
      { label: 'たすき掛け', v: { f: '6x^2+7x-3' } },
      { label: '平方の差', v: { f: '4x^2-9' } },
      { label: '共通因数＋完全平方', v: { f: '3x^2+12x+12' } },
      { label: '3 次式（因数定理）', v: { f: 'x^3-6x^2+11x-6' } },
      { label: '複 2 次式', v: { f: 'x^4-5x^2+4' } },
      { label: '2 次式の積', v: { f: 'x^4+x^2+1' } },
      { label: '分解できない', v: { f: 'x^2+x+1' } }
    ],
    intro: {
      easy: R`**因数分解**とは、展開の逆の操作です。たとえば $(x+2)(x+3)$ を展開すると $x^{2}+5x+6$ になりますが、その逆に $x^{2}+5x+6$ を $(x+2)(x+3)$ という「かけ算の形」に直すことです。かけ算の部品を**因数**といいます。
手順は次の順に試します。①全部の項に共通な数・文字を前に出す（共通因数）　②公式に当てはまるか見る（平方の差・完全平方）　③たすき掛け（2 次式）　④3 次以上は因数定理で 1 次の因数を見つけて割る。「有理数の範囲」とは、整数や分数だけを使って分けるという意味です。`,
      normal: R`共通因数 → 公式（$A^{2}-B^{2}$、$A^{2}\pm 2AB+B^{2}$）→ たすき掛け → 因数定理、の順で試します。展開して元に戻ることで検算します。`,
      pro: R`2 次式は判別式 $D$ が平方数かどうかで「整数の範囲で分解できるか」を即判定。3 次以上は $x = \pm 1, \pm 2$ の代入を最初に。複 2 次式は $x^{2}=X$ の置き換え、または $A^{2}-B^{2}$ への変形が定石です。`
    },
    compute(v) {
      const f = v.f, deg = P.deg(f);
      if (deg < 1) throw new JK.CalcError('1 次以上の式を入力してください（定数は因数分解の対象外です）');
      if (deg > 4) throw new JK.CalcError('4 次までの式を入力してください（入力は ' + deg + ' 次式です）');
      let xk = 0;
      while (f[xk].isZero()) xk++;
      const prim = primitive(f.slice(xk)), c = prim.c, q = prim.q;
      const steps = [], hasCommon = !(c.eq(1) && xk === 0), qd = P.deg(q);
      const com = commonTex(c, xk);
      if (hasCommon) {
        const parts = [];
        if (!c.abs().eq(1)) parts.push((c.isInt() ? '係数の最大公約数 $' : '係数を整数にそろえる数 $') + c.abs().tex() + '$');
        if (c.sign() < 0) parts.push('最高次の係数が負なので $-1$');
        if (xk > 0) parts.push('すべての項に含まれる $' + (xk > 1 ? 'x^{' + xk + '}' : 'x') + '$');
        steps.push({
          t: '共通因数をくくり出す',
          m: qd === 0 ? pt(f) : chain(pt(f), [com + '(' + pt(q) + ')']),
          n: R`すべての項に共通なものを、かっこの外にくくり出します（` + parts.join('、') + R`）。` + (c.sign() < 0 ? R`かっこの中の最高次の係数が正になるように、$-1$ もくくります。` : '') + (qd === 0 ? R`この式は 1 つの項だけなので、これ以上は分解できません。` : ''),
          easy: R`共通因数とは、すべての項に入っている共通の数や文字のことです。$ab + ac = a(b+c)$ という分配法則を**逆向き**に使います。たとえば $6x^{2}+9x$ は、どちらの項にも $3x$ が入っているので $3x(2x+3)$ とくくれます。`,
          pro: R`くくり出しは因数分解の第一歩。これを忘れると、あとの公式やたすき掛けが使えなくなります。`
        });
      } else {
        steps.push({
          t: '共通因数がないか調べる',
          n: R`すべての項に共通な数・文字を探します。係数の最大公約数は 1 で、$x$ もくくれない（定数項がある）ので、共通因数はありません。このまま次へ進みます。`,
          easy: R`共通因数とは、すべての項に入っている共通の数や文字のことです。たとえば $6x^{2}+9x$ なら $3x$ が共通なので、まず $3x(2x+3)$ とくくります。この式には、そのようなものがありません。`
        });
      }
      steps.push({
        t: '因数分解とは（展開の逆）',
        m: [R`(x+2)(x+3) \;\to\; x^{2}+5x+6 \quad (\text{展開})`, R`x^{2}+5x+6 \;\to\; (x+2)(x+3) \quad (\text{因数分解})`],
        n: R`展開した結果を、かけ算の形に戻すのが因数分解です。展開の公式を逆にたどることで見つけます。`,
        easy: R`展開と因数分解は行きと帰りの関係です。「$(x+2)(x+3)$ を展開 → $x^{2}+5x+6$」の矢印を逆向きにたどる、と考えると、因数分解の公式やたすき掛けは展開公式の使い方を逆にしただけだと分かります。`,
        lv: 3
      });
      let facs;
      if (qd >= 2) facs = factorAll(q, steps);
      else facs = qd === 1 ? [q] : [];
      const xs = [], others = [];
      facs.forEach((g) => { const ex = others.find((h) => polyEq(h.p, g)); if (ex) ex.e++; else others.push({ p: g, e: 1 }); });
      const rootOf = (g) => g[0].neg().div(g[1]);
      others.sort((A, B) => (P.deg(A.p) - P.deg(B.p)) || (P.deg(A.p) === 1 ? rootOf(A.p).cmp(rootOf(B.p)) : A.p[0].cmp(B.p[0])));
      if (xk > 0) xs.push({ p: P.of([0, 1]), e: xk });
      const groups = xs.concat(others);
      const finalTex = facsTex(c, groups);
      // 検算: 展開して元の式に戻るか
      let prod = [c];
      groups.forEach((g) => { prod = P.mul(prod, ppow(g.p, g.e)); });
      if (!polyEq(prod, f)) throw new JK.CalcError('因数分解の検算に失敗しました。式の書き方を確認してください');
      const irr = others.filter((g) => P.deg(g.p) >= 2);
      const same = finalTex === pt(f);                     // すでにこれ以上分解できない形
      const whole = same && deg >= 2 && !hasCommon;
      const lin = groups.filter((g) => P.deg(g.p) === 1);
      const notes = irr.map((g) => {
        const gd = P.deg(g.p), tx = '$' + pt(g.p) + '$';
        if (gd === 2) {
          const D = g.p[1].n * g.p[1].n - 4 * g.p[2].n * g.p[0].n;
          return tx + ' は有理数の範囲でこれ以上分解できません（$D = ' + D + '$' + (D < 0 ? '、実数の範囲でも分解できません' : '、平方数ではありません') + '）。';
        }
        return tx + ' は有理数の解をもたないため、有理数の範囲でこれ以上分解できません。';
      });
      steps.push({
        t: same ? '結論: これ以上分解できない' : '因数分解の結果',
        m: same ? pt(f) : chain(pt(f), [finalTex]),
        n: same
          ? (whole ? notes.join('') : R`この式は、すでにこれ以上分解できない形（単項式または 1 次式）です。`)
          : R`これ以上分解できない形まで進めた結果です。` + (others.some((g) => g.e > 1) || xk > 1 ? R`同じ因数は累乗にまとめて書きます。` : '') + notes.join(''),
        easy: R`因数分解の答えは、「これ以上分けられない部品」だけのかけ算です。かっこの中の式がもう一度分解できないか、最後に必ず確認します。`,
        pro: R`答えは「共通の数 → 文字 → かっこ」の順に書き、同じかっこは累乗にまとめます。`
      });
      if (!same) {
        const L = [];
        others.forEach((g) => { for (let i = 0; i < g.e; i++) L.push(g.p); });
        if (xk > 0) L.push(ppow(P.of([0, 1]), xk));
        if (!c.eq(1)) L.push([c]);
        const lines = [];
        let acc = L[0];
        for (let i = 1; i < L.length; i++) {
          const mm = multiply(acc, L[i]).step.m;
          lines.push(Array.isArray(mm) ? mm[mm.length - 1] : mm);
          acc = P.mul(acc, L[i]);
        }
        if (lines.length) {
          steps.push({
            t: '展開して元の式に戻ることを確認する',
            m: lines.concat([R`\text{元の式 } ` + pt(f) + R` \text{ と一致}`]),
            n: R`因数分解した式を展開し直して、元の式と一致することを確かめます。これが因数分解の検算です。`,
            easy: R`因数分解は展開の逆なので、答えを展開すれば必ず元の式に戻ります。戻らなければ、どこかで符号や数をまちがえています。`,
            pro: R`試験では「$x$ の係数」と「定数項」だけを暗算で展開して確かめるのが最短の検算です。`,
            lv: 2
          });
        }
      }
      const out = [];
      if (same) {
        out.push({ label: '結果', tex: whole ? R`\text{有理数の範囲でこれ以上分解できない}` : R`\text{これ以上分解できない}` });
        out.push({ label: '式', tex: pt(f) });
      } else {
        out.push({ label: '因数分解', tex: finalTex });
        if (hasCommon && qd >= 1) out.push({ label: '共通因数', tex: com });
        const rts = lin.map((g) => rootOf(g.p)).sort((x, y) => x.cmp(y));
        const rtex = rts.filter((r, i) => i === 0 || !r.eq(rts[i - 1])).map((r) => r.tex());
        if (rtex.length) out.push({ label: 'f(x)=0 の有理数解', tex: 'x = ' + rtex.join(R`,\ `) });
        if (irr.length) out.push({ label: 'これ以上分解できない因数', tex: irr.map((g) => '(' + pt(g.p) + ')').join('') });
      }
      return { result: out, steps: steps };
    }
  });

  /* ================= 平方根の計算と分母の有理化 ================= */

  const rootTex = (k, m) => (k === 1 ? '' : k) + R`\sqrt{` + m + '}';
  function numTex(u, v, m) {                               // u + v√m（u, v は整数）
    if (v === 0) return String(u);
    const term = rootTex(Math.abs(v), m);
    if (u === 0) return (v < 0 ? '-' : '') + term;
    return u + (v < 0 ? ' - ' : ' + ') + term;
  }
  function fracSurd(u, v, m, w) {                          // (u + v√m) / w を約分した TeX（w > 0）
    let g = U.gcd(Math.abs(u), U.gcd(Math.abs(v), w));
    if (g === 0) g = 1;
    u /= g; v /= g; w /= g;
    if (u === 0 && v !== 0) {
      const body = rootTex(Math.abs(v), m);
      return (v < 0 ? '-' : '') + (w === 1 ? body : R`\frac{` + body + '}{' + w + '}');
    }
    return w === 1 ? numTex(u, v, m) : R`\frac{` + numTex(u, v, m) + '}{' + w + '}';
  }
  const parOf = (n) => (n < 0 ? R`\left(` + n + R`\right)` : String(n));

  function simplifyCalc(n) {
    const pf = U.primeFactors(n), s = U.sqrtSimplify(n), out = s.out, inn = s.in;
    const fTex = pf.length ? pf.map((t) => (t[1] === 1 ? t[0] : t[0] + '^{' + t[1] + '}')).join(R` \times `) : '1';
    const items = [];
    pf.forEach((t) => { for (let i = 0; i < t[1]; i++) items.push(t[0]); });
    const outParts = pf.filter((t) => t[1] >= 2).map((t) => (Math.floor(t[1] / 2) === 1 ? t[0] : t[0] + '^{' + Math.floor(t[1] / 2) + '}'));
    const restParts = pf.filter((t) => t[1] % 2 === 1).map((t) => t[0]);
    const final = inn === 1 ? String(out) : rootTex(out, inn);
    const lines = [R`\sqrt{` + n + '}'];
    if (items.length && items.length <= 14) lines.push(R`\sqrt{` + items.join(R` \times `) + '}');
    else if (items.length) lines.push(R`\sqrt{` + fTex + '}');
    if (out > 1) lines.push(outParts.join(R` \times `) + (restParts.length ? R` \times \sqrt{` + restParts.join(R` \times `) + '}' : ''));
    lines.push(final);
    const k = Math.floor(Math.sqrt(n));
    const steps = [
      {
        t: '根号の中を素因数分解する',
        m: n === 1 ? R`\sqrt{1} = 1` : n + ' = ' + fTex,
        n: n === 1 ? R`$1$ の平方根は $1$ です。` : R`根号の中の数 $` + n + R`$ を、素数だけのかけ算に分けます。同じ素数が 2 個ずつ組になっているところが、根号の外に出せる部分です。`,
        easy: R`**素因数分解**とは、整数を素数（$2, 3, 5, 7, \cdots$ のように 1 と自分自身でしか割れない数）のかけ算だけで表すことです。$\sqrt{\ }$（**根号**）は「2 乗するとその数になる正の数」を表すので、$\sqrt{9} = 3$（$3^{2}=9$）のように、同じ数が 2 つ並んでいれば外に出せます。`
      },
      {
        t: '根号の性質',
        m: [R`\sqrt{a^{2}} = a \quad (a > 0)`, R`\sqrt{ab} = \sqrt{a}\sqrt{b} \quad (a \ge 0,\ b \ge 0)`],
        n: R`この 2 つの性質を使って、2 乗になっている部分を根号の外へ出します。`,
        easy: R`$\sqrt{ab} = \sqrt{a}\sqrt{b}$ は「かけ算の根号は、別々の根号に分けてよい」という意味です。たとえば $\sqrt{36}=\sqrt{4 \times 9} = \sqrt{4}\times\sqrt{9} = 2 \times 3 = 6$ と確かめられます。`,
        lv: 3
      },
      {
        t: out > 1 ? '同じ数のペアを根号の外へ出す' : '外に出せる数があるか調べる',
        m: lines.length > 1 ? chain(lines[0], lines.slice(1)) : lines[0],
        n: out > 1
          ? R`同じ素数が 2 個そろった組から 1 個を、根号の外へ出します（$\sqrt{p \times p} = p$）。外に出した数はかけ算で結びます。` + (inn === 1 ? R`すべてペアになったので、根号が消えて整数になります。` : R`ペアにならなかった素数は、根号の中に残します。`)
          : R`どの素数も 2 個そろっていない（2 乗の因数がない）ので、これ以上簡単になりません。`,
        easy: R`たとえば $\sqrt{2 \times 2 \times 3}$ は、$2 \times 2$ の組が根号の外に 2 として出て、$3$ だけが中に残るので $2\sqrt{3}$ です。靴下を 2 枚ずつ組にして外に出し、組にならなかった 1 枚が残る、というイメージです。`,
        pro: R`$\sqrt{n}$ は「$n$ を割り切る最大の平方数」を探すのが近道です。$4, 9, 16, 25, 36, 49, 64, 81, 100$ で順に割れるか試すと、素因数分解せずに外に出せます。`
      },
      {
        t: '2 乗して確かめる・大きさの見当',
        m: (inn === 1
          ? [R`` + out + '^{2} = ' + out * out]
          : [R`\left(` + rootTex(out, inn) + R`\right)^{2} = ` + out + R`^{2} \times ` + inn + ' = ' + n]
        ).concat([k * k === n ? R`\sqrt{` + n + '} = ' + k : k + R` < \sqrt{` + n + R`} < ` + (k + 1) + R`\quad (\text{近似値 } ` + U.fmt(Math.sqrt(n), 4) + ')']),
        n: R`簡単にした形を 2 乗して、根号の中の数にもどるか確認します。また、平方数にはさんで大きさを見当づけると、ミスに気づきやすくなります。`,
        lv: 2
      }
    ];
    const res = [{ label: '簡単にした形', tex: R`\sqrt{` + n + '} = ' + final }];
    if (inn !== 1) res.push({ label: '近似値', tex: R`\approx ` + U.fmt(Math.sqrt(n), 4) });
    if (n > 1) res.push({ label: '素因数分解', tex: n + ' = ' + fTex });
    return { result: res, steps: steps };
  }

  const RAT_EASY = R`**有理化**とは、分母から根号（$\sqrt{\ }$）をなくすことです。$\frac{1}{\sqrt{2}}$ のように分母が無理数だと大きさがつかみにくく、足し算・引き算もやりにくいので、分母を整数にそろえて表すのが決まりです。分数は「分母と分子に同じ数をかけても値が変わらない」（$\frac{2}{3} = \frac{2 \times 5}{3 \times 5}$）ので、その性質を使います。`;

  function rat1Calc(p, q) {
    if (p === 0) throw new JK.CalcError('p は 0 以外を入力してください（0 を割っても 0 です）');
    const s = U.sqrtSimplify(q), k = s.out, m = s.in;
    const approx = p / Math.sqrt(q);
    const steps = [{
      t: '分母に根号があるときは有理化する',
      m: R`\frac{` + p + R`}{\sqrt{` + q + R`}}`,
      n: R`分母に根号が残らないように、分母と分子に同じ数をかけて、分母を整数にします。`,
      easy: RAT_EASY
    }];
    if (k > 1) {
      steps.push({
        t: '分母の根号を先に簡単にする',
        m: chain(R`\sqrt{` + q + '}', [R`\sqrt{` + k + R`^{2} \times ` + m + '}', m === 1 ? String(k) : rootTex(k, m)]),
        n: R`$\sqrt{` + q + R`}$ は $` + k + R`^{2}$ の因数をもつので、先に外へ出します。`,
        easy: R`$\sqrt{` + q + R`}$ のように根号の中に 2 乗の因数があるときは、まず簡単にしてから有理化します。そのほうが数が小さくなります。`,
        lv: 2
      });
    }
    let res;
    if (m === 1) {
      const val = Q(p, k);
      steps.push({
        t: '根号が消えて、ふつうの分数になる',
        m: chain(R`\frac{` + p + R`}{\sqrt{` + q + R`}}`, [R`\frac{` + p + '}{' + k + '}', val.tex()]),
        n: R`$\sqrt{` + q + R`} = ` + k + R`$ という整数なので、有理化する必要はありません。分数を約分して整えます。`,
        easy: R`$` + q + R`$ は $` + k + R`$ の 2 乗（平方数）なので、$\sqrt{` + q + R`}$ はもともと整数です。この場合は、ふつうの分数の約分をするだけです。`
      });
      res = [{ label: '有理化した形', tex: val.tex() }, { label: '近似値', tex: R`\approx ` + U.fmt(approx, 4) }];
    } else {
      const den = k * m, g = U.gcd(Math.abs(p), den), u = p / g, w = den / g;
      const base = k === 1 ? R`\sqrt{` + m + '}' : k + R`\sqrt{` + m + '}';
      steps.push({
        t: R`分母と分子に $\sqrt{` + m + R`}$ をかける`,
        m: chain(R`\frac{` + p + '}{' + base + '}', [
          R`\frac{` + p + R` \times \sqrt{` + m + R`}}{` + base + R` \times \sqrt{` + m + '}}',
          R`\frac{` + p + R`\sqrt{` + m + R`}}{` + (k === 1 ? '' : k + R` \times `) + m + '}',
          R`\frac{` + p + R`\sqrt{` + m + R`}}{` + den + '}'
        ]),
        n: R`$\sqrt{` + m + R`} \times \sqrt{` + m + R`} = ` + m + R`$ となるので、分母の根号が消えます。分子にも同じ $\sqrt{` + m + R`}$ をかけるのを忘れないようにします。`,
        easy: R`$\sqrt{` + m + R`}$ を 2 回かけると $` + m + R`$ になる（$\sqrt{a}\times\sqrt{a}=a$）ことを使います。分母分子に $\sqrt{` + m + R`}$ をかけるのは、実質的に $\frac{\sqrt{` + m + R`}}{\sqrt{` + m + R`}} = 1$ をかけているだけなので、値は変わりません。`,
        pro: R`$\frac{p}{\sqrt{m}} = \frac{p\sqrt{m}}{m}$ は暗算で書けるようにしておきます（分子に $\sqrt{m}$ を足し、分母は $m$）。`
      });
      steps.push({
        t: '約分して整える',
        m: g > 1 ? chain(R`\frac{` + p + R`\sqrt{` + m + R`}}{` + den + '}', [fracSurd(0, p, m, den)]) : fracSurd(0, p, m, den),
        n: g > 1 ? R`分子の係数 $` + Math.abs(p) + R`$ と分母 $` + den + R`$ を、最大公約数 $` + g + R`$ で約分します。` : R`これ以上約分できません。`,
        easy: R`分数の分母と分子を同じ数で割って、できるだけ小さい数にするのが約分です。根号の外にある数だけが約分できる点に注意します（根号の中の数は約分できません）。`
      });
      res = [{ label: '有理化した形', tex: fracSurd(0, p, m, den) }, { label: '近似値', tex: R`\approx ` + U.fmt(approx, 4) }];
    }
    const finalVal = m === 1 ? p / k : p * Math.sqrt(m) / (k * m);
    steps.push({
      t: '近似値で確かめる',
      m: [R`\frac{` + p + R`}{\sqrt{` + q + R`}} \approx ` + U.fmt(approx, 4), R`\text{有理化した形} \approx ` + U.fmt(finalVal, 4)],
      n: R`元の式と有理化した式の近似値が一致することを確認します（$\sqrt{2} \approx 1.4142,\ \sqrt{3} \approx 1.7321,\ \sqrt{5} \approx 2.2361$）。`,
      lv: 2
    });
    return { result: res, steps: steps };
  }

  function rat2Calc(p, a, b, c) {
    if (p === 0) throw new JK.CalcError('p は 0 以外を入力してください（0 を割っても 0 です）');
    if (b === 0) throw new JK.CalcError('b は 0 以外を入力してください（b = 0 だと分母に根号がありません）');
    const s = U.sqrtSimplify(c), k = s.out, m = s.in, b2 = b * k;
    const approx = p / (a + b * Math.sqrt(c));
    const dTex = R`\left(` + numTex(a, b2, m) + R`\right)`;
    const steps = [{
      t: R`分母が $a + b\sqrt{c}$ の形のときは、共役をかけて有理化する`,
      m: R`\frac{` + p + '}{' + numTex(a, b, c) + '}',
      n: R`分母が「整数 ＋ 根号」の形のときは、分母の**共役**（根号の前の符号だけを逆にした式）を分母と分子にかけます。`,
      easy: RAT_EASY + R`分母が足し算・引き算のときは、$\sqrt{\ }$ を 1 つかけただけでは根号が消えません。そこで「符号違いのペア」をかけると、$(A+B)(A-B)=A^{2}-B^{2}$ で 2 乗になり、根号が消えます。`
    }];
    if (k > 1) {
      steps.push({
        t: '分母の根号を先に簡単にする',
        m: chain(R`\sqrt{` + c + '}', [R`\sqrt{` + k + R`^{2} \times ` + m + '}', m === 1 ? String(k) : rootTex(k, m)]),
        n: R`$` + b + R`\sqrt{` + c + R`} = ` + b2 + (m === 1 ? '' : R`\sqrt{` + m + '}') + R`$ と直してから進めます。`,
        lv: 2
      });
    }
    if (m === 1) {
      const dn = a + b2;
      if (dn === 0) throw new JK.CalcError('分母が 0 になるため計算できません（a + b√c が 0 になっています）');
      const val = Q(p, dn);
      steps.push({
        t: '分母は整数になる',
        m: chain(R`\frac{` + p + '}{' + numTex(a, b, c) + '}', [R`\frac{` + p + '}{' + a + ' ' + U.signed(Q(b2)) + '}', R`\frac{` + p + '}{' + dn + '}', val.tex()]),
        n: R`$\sqrt{` + c + R`} = ` + k + R`$ は整数なので、分母はもともと整数です。有理化は不要で、分数を整えるだけです。`,
        easy: R`$` + c + R`$ は平方数なので、$\sqrt{` + c + R`}$ は整数 $` + k + R`$ です。分母の根号は最初からなかったことになり、ふつうの分数の計算になります。`
      });
      return { result: [{ label: '有理化した形', tex: val.tex() }, { label: '近似値', tex: R`\approx ` + U.fmt(approx, 4) }], steps: steps };
    }
    const N = a * a - b2 * b2 * m;
    const u0 = p * a, v0 = -p * b2;
    let uu = u0, vv = v0, w0 = N;
    if (w0 < 0) { uu = -uu; vv = -vv; w0 = -w0; }
    const cj = R`\left(` + numTex(a, -b2, m) + R`\right)`;
    steps.push({
      t: '分母の共役を作る',
      m: numTex(a, b2, m) + R` \;\to\; ` + numTex(a, -b2, m),
      n: R`分母 $` + numTex(a, b2, m) + R`$ の根号の前の符号を逆にした $` + numTex(a, -b2, m) + R`$ が共役です。`,
      easy: R`**共役**とは「足し算を引き算に（引き算を足し算に）変えた相棒」のことです。たとえば $1+\sqrt{3}$ の共役は $1-\sqrt{3}$。この 2 つをかけると $1^{2}-(\sqrt{3})^{2} = 1 - 3 = -2$ のように、根号のない整数になります。`
    });
    steps.push({
      t: '分母と分子に共役をかける',
      m: chain(R`\frac{` + p + '}{' + numTex(a, b2, m) + '}', [R`\frac{` + p + R` \times ` + cj + '}{' + dTex + cj + '}']),
      n: R`分母と分子に同じ共役をかけるので、全体の値は変わりません（$\frac{\text{共役}}{\text{共役}} = 1$ をかけたことと同じ）。`,
      easy: R`分数の分母と分子に同じ数をかけても値は変わりません。ここでは「共役」という、分母をうまく整数にしてくれる数をかけます。`
    });
    steps.push({
      t: '分母を計算する（和と差の積の公式）',
      m: [R`(A+B)(A-B) = A^{2} - B^{2}`, chain(dTex + cj, [parOf(a) + R`^{2} - \left(` + rootTex(Math.abs(b2), m) + R`\right)^{2}`, parOf(a) + R`^{2} - ` + Math.abs(b2) + R`^{2} \times ` + m, String(N)])],
      n: R`$A = ` + a + R`$、$B = ` + rootTex(Math.abs(b2), m) + R`$ とみて公式を使います。$(\sqrt{m})^{2} = m$ なので、分母が整数 $` + N + R`$ になりました。`,
      easy: R`$(A+B)(A-B)$ を展開すると、真ん中の項が打ち消し合って $A^{2}-B^{2}$ だけが残ります。$B$ が根号のとき、$B^{2}$ は根号が外れて整数になるので、分母から根号が消えます。`,
      pro: R`分母は「$a^{2}-b^{2}c$」と暗算できます。これが 0 にならないこと（$c$ が平方数でないこと）が有理化できる条件です。`
    });
    steps.push({
      t: '分子を展開して、約分する',
      m: chain(R`\frac{` + p + R` \times ` + cj + '}{' + N + '}', [R`\frac{` + numTex(u0, v0, m) + '}{' + N + '}'].concat(N < 0 || U.gcd(Math.abs(uu), U.gcd(Math.abs(vv), w0)) > 1 ? [fracSurd(uu, vv, m, w0)] : [])),
      n: R`分子は $p$ を共役の各項にかけて展開します。` + (N < 0 ? R`分母が負なので、分母と分子に $-1$ をかけて分母を正にします。` : '') + R`そのうえで、分子の各項と分母に共通な約数があれば約分します。`,
      easy: R`分子の 2 つの項（整数の項と根号の項）と分母のすべてを割り切れる数があれば、全部をその数で割って約分します。一部だけを約分してはいけません。`
    });
    const finalVal = (uu + vv * Math.sqrt(m)) / w0;
    steps.push({
      t: '近似値で確かめる',
      m: [R`\frac{` + p + '}{' + numTex(a, b, c) + R`} \approx ` + U.fmt(approx, 4), R`\text{有理化した形} \approx ` + U.fmt(finalVal, 4)],
      n: R`元の式と有理化した式の近似値が一致することを確認します。`,
      lv: 2
    });
    return {
      result: [
        { label: '有理化した形', tex: fracSurd(uu, vv, m, w0) },
        { label: '近似値', tex: R`\approx ` + U.fmt(approx, 4) },
        { label: '共役との積（分母）', tex: String(N) }
      ],
      steps: steps
    };
  }

  JK.registerCalc({
    id: 'ia-sqrt',
    course: 'IA',
    unit: 'm-expr',
    group: '数と式',
    title: '平方根の計算と分母の有理化',
    desc: R`$\sqrt{n}$ を簡単にする、分母に根号がある分数を有理化する（$\frac{p}{\sqrt{q}}$ 型と $\frac{p}{a+b\sqrt{c}}$ 型）の途中式を示します。`,
    form: R`\sqrt{a^{2}b} = a\sqrt{b}, \qquad \frac{p}{\sqrt{q}} = \frac{p\sqrt{q}}{q}, \qquad \frac{p}{a+b\sqrt{c}} = \frac{p(a-b\sqrt{c})}{a^{2}-b^{2}c}`,
    inputs: [
      { key: 'mode', label: '計算の種類', type: 'select', def: 'simplify', options: [['simplify', '√n を簡単にする'], ['rat1', 'p/√q の分母の有理化'], ['rat2', 'p/(a+b√c) の分母の有理化']] },
      { key: 'n', label: '根号の中の数 $n$', type: 'int', def: '180', min: 1, max: 100000000, show: (raw) => raw.mode === 'simplify' },
      { key: 'p', label: '分子 $p$', type: 'int', def: '3', min: -1000, max: 1000, show: (raw) => raw.mode !== 'simplify' },
      { key: 'q', label: '根号の中の数 $q$', type: 'int', def: '12', min: 1, max: 1000000, show: (raw) => raw.mode === 'rat1' },
      { key: 'a', label: '$a$', type: 'int', def: '1', min: -1000, max: 1000, show: (raw) => raw.mode === 'rat2' },
      { key: 'b', label: '$b$', type: 'int', def: '1', min: -1000, max: 1000, show: (raw) => raw.mode === 'rat2' },
      { key: 'c', label: '根号の中の数 $c$', type: 'int', def: '3', min: 0, max: 1000000, show: (raw) => raw.mode === 'rat2' }
    ],
    examples: [
      { label: '√180 を簡単に', v: { mode: 'simplify', n: '180' } },
      { label: '√72 を簡単に', v: { mode: 'simplify', n: '72' } },
      { label: '3/√12', v: { mode: 'rat1', p: '3', q: '12' } },
      { label: '2/√5', v: { mode: 'rat1', p: '2', q: '5' } },
      { label: '1/(1+√3)', v: { mode: 'rat2', p: '1', a: '1', b: '1', c: '3' } },
      { label: '6/(3-2√2)', v: { mode: 'rat2', p: '6', a: '3', b: '-2', c: '2' } }
    ],
    intro: {
      easy: R`**平方根**とは、2 乗するとその数になる数のことで、記号 $\sqrt{\ }$（**根号**）で表します。$\sqrt{9}=3$、$\sqrt{2}=1.41421\cdots$ のように、きれいな整数にならない根号もたくさんあります。
計算のきまりは 2 つです。①根号の中に「同じ数のペア」があれば外に出して簡単にする（$\sqrt{12}=2\sqrt{3}$）。②分母に根号があるときは、分母と分子に同じ数をかけて、分母から根号を消す（**有理化**）。この計算機は、どちらも 1 行ずつ途中式を示します。`,
      normal: R`$\sqrt{a^{2}b}=a\sqrt{b}$（$a>0$）で根号を簡単にし、分母の有理化は $\frac{p}{\sqrt{q}}=\frac{p\sqrt{q}}{q}$、$\frac{p}{a+b\sqrt{c}}=\frac{p(a-b\sqrt{c})}{a^{2}-b^{2}c}$ を使います。`,
      pro: R`有理化は「分母に根号が残る形は答えにしない」が入試のルール。共役をかけたとき分母は $a^{2}-b^{2}c$、これは常に整数なので、符号と約分の確認だけで済みます。`
    },
    compute(v) {
      if (v.mode === 'rat1') return rat1Calc(v.p, v.q);
      if (v.mode === 'rat2') return rat2Calc(v.p, v.a, v.b, v.c);
      return simplifyCalc(v.n);
    }
  });

  /*@@END@@*/
})();
