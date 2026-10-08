/* 数I・A — 2次関数: 平方完成・頂点・軸 / 定義域つきの最大・最小
   ※ 計算機モジュールの実装見本。他の計算機もこの構成（intro → result → steps(easy/pro/lv) → fig）に揃える。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util;

  // x - p の TeX（p の符号で - / + を切り替える）
  function shift(p) {
    if (p.isZero()) return 'x';
    return p.sign() > 0 ? 'x - ' + p.tex() : 'x + ' + p.neg().tex();
  }
  function sq(p) { return p.isZero() ? 'x^{2}' : R`\left(` + shift(p) + R`\right)^{2}`; }
  function coef(a) { return a.eq(1) ? '' : (a.eq(-1) ? '-' : a.tex()); }
  function vertexForm(a, p, q) {
    return coef(a) + sq(p) + (q.isZero() ? '' : ' ' + U.signed(q));
  }
  function quadTex(a, b, c) { return JK.poly.tex([c, b, a]); }
  function f(a, b, c, x) { return a.mul(x).mul(x).add(b.mul(x)).add(c); }

  // 平方完成の途中式（両方の計算機で共用）
  function completeSteps(a, b, c) {
    const k = b.div(a);                       // x の係数（くくった後）
    const m = k.div(2);                       // その半分
    const p = m.neg();                        // 頂点の x 座標
    const q = c.sub(a.mul(m).mul(m));         // 頂点の y 座標
    const steps = [];
    if (!a.eq(1)) {
      steps.push({
        t: R`$x^{2}$ の係数でくくる`,
        m: R`y = ` + quadTex(a, b, c) + ' = ' + coef(a) + R`\left(x^{2} ` + (k.isZero() ? '' : U.signed(k) + 'x') + R`\right)` + (c.isZero() ? '' : ' ' + U.signed(c)),
        n: R`$x^{2}$ と $x$ の項だけを $` + a.tex() + R`$ でくくります。定数項 $` + c.tex() + R`$ は括弧の外に残します。`,
        easy: R`「くくる」とは共通の数を前に出すことです。$x$ の係数は $` + b.tex() + R` \div ` + U.paren(a) + ' = ' + k.tex() + R`$ になります。`
      });
    }
    if (!k.isZero()) {
      steps.push({
        t: R`$x$ の係数の半分の 2 乗を「足して引く」`,
        m: R`x^{2} ` + U.signed(k) + 'x = ' + sq(p) + ' - ' + R`\left(` + m.abs().tex() + R`\right)^{2} = ` + sq(p) + ' - ' + m.mul(m).tex(),
        n: R`$x$ の係数 $` + k.tex() + R`$ の半分は $` + m.tex() + R`$。$\left(x ` + U.signed(m) + R`\right)^{2}$ を展開すると余分に $` + m.mul(m).tex() + R`$ が出るので、その分を引きます。`,
        easy: R`$(x+m)^{2} = x^{2} + 2mx + m^{2}$ という展開公式を逆向きに使っています。$x^{2} + 2mx$ の形を見たら「$(x+m)^{2}$ から $m^{2}$ を引いたもの」と読み替える、これが平方完成の正体です。`,
        pro: R`暗算では「$x$ の係数の半分」を括弧の中に、「その 2 乗 × $a$」を外で引く、と 1 行で処理します。`
      });
      steps.push({
        t: R`括弧を外して定数をまとめる`,
        m: R`\begin{aligned} y &= ` + coef(a) + R`\left\{` + sq(p) + ' - ' + m.mul(m).tex() + R`\right\}` + (c.isZero() ? '' : ' ' + U.signed(c)) +
          R` \\ &= ` + coef(a) + sq(p) + ' ' + U.signed(a.mul(m).mul(m).neg()) + (c.isZero() ? '' : ' ' + U.signed(c)) +
          R` \\ &= ` + vertexForm(a, p, q) + R` \end{aligned}`,
        n: R`引いた $` + m.mul(m).tex() + R`$ にも $` + a.tex() + R`$ が掛かることに注意します（$` + a.tex() + R` \times ` + U.paren(m.mul(m).neg()) + ' = ' + a.mul(m).mul(m).neg().tex() + R`$）。`,
        lv: 2
      });
    } else {
      steps.push({
        t: R`すでに平方完成された形`,
        m: 'y = ' + vertexForm(a, p, q),
        n: R`$x$ の 1 次の項がないので、そのまま $a(x-p)^{2}+q$ の形（$p = 0$）です。`
      });
    }
    return { steps: steps, p: p, q: q };
  }

  function parabola(a, b, c, p, q, extra) {
    const pv = p.val(), av = a.val(), bv = b.val(), cv = c.val();
    const half = Math.max(3, extra ? Math.max(Math.abs(extra[0] - pv), Math.abs(extra[1] - pv)) + 1 : 3);
    const fn = (x) => av * x * x + bv * x + cv;
    const o = {
      x: [pv - half, pv + half],
      curves: [{ f: fn, cls: 'c1', dash: !!extra }],
      vlines: [{ x: pv, label: '軸 x=' + p.toString() }],
      points: [{ x: pv, y: q.val(), label: '頂点(' + p.toString() + ', ' + q.toString() + ')', cls: 'c3', pos: av > 0 ? 'br' : 'tr' }]
    };
    if (extra) {
      o.curves.push({ f: fn, cls: 'c2', domain: [extra[0], extra[1]] });
      o.points.push({ x: extra[0], y: fn(extra[0]), cls: 'c2', label: 'x=' + U.fmt(extra[0]), pos: 'tl' });
      o.points.push({ x: extra[1], y: fn(extra[1]), cls: 'c2', label: 'x=' + U.fmt(extra[1]), pos: 'tr' });
    }
    return JK.plot.graph(o);
  }

  const INTRO = {
    easy: R`2次関数 $y = ax^{2}+bx+c$ のグラフは**放物線**（ボールを投げたときの軌道の形）です。放物線には「いちばん低い（または高い）点」があり、これを**頂点**、頂点を通る縦線を**軸**といいます。
式を $y = a(x-p)^{2}+q$ の形に直す変形が**平方完成**で、この形にすると頂点が $(p,\ q)$ だとひと目で分かります。$(x-p)^{2}$ は 0 以上なので、$a>0$ なら $x=p$ のとき最小、$a<0$ なら最大になるからです。`,
    normal: R`$y = a(x-p)^{2}+q$ に変形すれば、頂点 $(p,\ q)$・軸 $x=p$ が読み取れます。$a>0$ で下に凸（最小値 $q$）、$a<0$ で上に凸（最大値 $q$）。`,
    pro: R`頂点は $\left(-\frac{b}{2a},\ -\frac{b^{2}-4ac}{4a}\right)$。最大・最小は「軸と定義域の位置関係」で場合分けするのが定石です。`
  };

  JK.registerCalc({
    id: 'ia-quad-vertex',
    course: 'IA',
    unit: 'm-quad',
    group: '2次関数',
    title: '平方完成・頂点・軸',
    desc: '2次関数を平方完成して、頂点・軸・最大値/最小値を求めます。係数は整数・分数・小数で入力できます。',
    form: R`y = ax^{2} + bx + c \;\to\; y = a(x-p)^{2} + q`,
    inputs: [
      { key: 'a', label: '$a$', type: 'q', def: '1' },
      { key: 'b', label: '$b$', type: 'q', def: '-4' },
      { key: 'c', label: '$c$', type: 'q', def: '1' }
    ],
    examples: [
      { label: '上に凸', v: { a: '-2', b: '8', c: '-3' } },
      { label: '分数係数', v: { a: '1/2', b: '3', c: '-1' } },
      { label: '奇数の b', v: { a: '1', b: '5', c: '2' } }
    ],
    intro: INTRO,
    compute(v) {
      const a = v.a, b = v.b, c = v.c;
      if (a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（a = 0 だと 2次関数になりません）');
      const cs = completeSteps(a, b, c), p = cs.p, q = cs.q, up = a.sign() < 0;
      const steps = cs.steps.concat([
        {
          t: '頂点と軸を読み取る',
          m: [R`\text{頂点 } \left(` + p.tex() + R`,\ ` + q.tex() + R`\right)`, R`\text{軸 } x = ` + p.tex()],
          n: R`$y = a(x-p)^{2}+q$ の $p = ` + p.tex() + R`,\ q = ` + q.tex() + R`$ です。括弧の中が $x ` + (p.sign() >= 0 ? '-' : '+') + R`$ の形なので、$p$ の符号を取り違えないようにします。`,
          easy: R`$(x-p)^{2}$ がいちばん小さい値 0 になるのは $x = p$ のとき。そのとき $y = q$ なので、グラフの折り返し点が $(p,\ q)$ になります。`
        },
        {
          t: up ? '最大値' : '最小値',
          m: (up ? R`\text{最大値 } ` : R`\text{最小値 } `) + q.tex() + R`\quad (x = ` + p.tex() + ')',
          n: R`$a = ` + a.tex() + (up ? R` < 0$ なのでグラフは上に凸。頂点で最大となり、最小値はありません。` : R` > 0$ なのでグラフは下に凸。頂点で最小となり、最大値はありません。`),
          pro: R`定義域に制限があるときは「定義域つきの最大・最小」で、軸が定義域の内側か外側かを確認します。`
        }
      ]);
      return {
        result: [
          { label: '平方完成', tex: 'y = ' + vertexForm(a, p, q) },
          { label: '頂点', tex: R`\left(` + p.tex() + R`,\ ` + q.tex() + R`\right)` },
          { label: '軸', tex: 'x = ' + p.tex() },
          { label: up ? '最大値' : '最小値', tex: q.tex() }
        ],
        steps: steps,
        fig: parabola(a, b, c, p, q, null)
      };
    }
  });

  JK.registerCalc({
    id: 'ia-quad-minmax',
    course: 'IA',
    unit: 'm-quad',
    group: '2次関数',
    title: '定義域つきの最大・最小',
    desc: '定義域 $s \\le x \\le t$ における 2次関数の最大値・最小値を、軸と定義域の位置関係から求めます。',
    form: R`y = ax^{2} + bx + c \quad (s \le x \le t)`,
    inputs: [
      { key: 'a', label: '$a$', type: 'q', def: '1' },
      { key: 'b', label: '$b$', type: 'q', def: '-4' },
      { key: 'c', label: '$c$', type: 'q', def: '1' },
      { key: 's', label: '定義域の左端 $s$', type: 'q', def: '0' },
      { key: 't', label: '定義域の右端 $t$', type: 'q', def: '3' }
    ],
    examples: [
      { label: '軸が定義域の外', v: { a: '1', b: '-4', c: '1', s: '3', t: '5' } },
      { label: '上に凸', v: { a: '-1', b: '2', c: '3', s: '-1', t: '2' } }
    ],
    intro: {
      easy: R`定義域（$x$ の動ける範囲）が決まっていると、グラフの一部分だけを見ることになります。放物線は軸を境に左右対称で、下に凸なら「軸に近いほど低く、軸から遠いほど高い」形です。そこで **軸が範囲の中にあるか・外にあるか** を調べ、候補（頂点・左端・右端）の $y$ の値を比べます。`,
      normal: R`候補は「頂点（軸が定義域内のとき）」「左端」「右端」の 3 つ。それぞれの $y$ を計算して比較します。`,
      pro: R`文字定数を含む問題では、軸と定義域の位置関係（左外・内・右外、さらに中央との大小）で場合分けします。`
    },
    compute(v) {
      const a = v.a, b = v.b, c = v.c, s = v.s, t = v.t;
      if (a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（a = 0 だと 2次関数になりません）');
      if (s.cmp(t) >= 0) throw new JK.CalcError('定義域は s < t となるように入力してください');
      const cs = completeSteps(a, b, c), p = cs.p, q = cs.q, down = a.sign() > 0;
      const inside = p.cmp(s) >= 0 && p.cmp(t) <= 0;
      const fs = f(a, b, c, s), ft = f(a, b, c, t);
      const cand = [{ x: s, y: fs, name: '左端' }, { x: t, y: ft, name: '右端' }];
      if (inside) cand.push({ x: p, y: q, name: '頂点' });
      let mx = cand[0], mn = cand[0];
      cand.forEach((k) => { if (k.y.cmp(mx.y) > 0) mx = k; if (k.y.cmp(mn.y) < 0) mn = k; });
      const at = (y) => cand.filter((k) => k.y.eq(y)).map((k) => k.x.tex()).filter((x, i, arr) => arr.indexOf(x) === i).join(',\\ ');
      const pos = inside ? '定義域の内側' : (p.cmp(s) < 0 ? '定義域の左側（外）' : '定義域の右側（外）');
      const steps = [
        { t: '平方完成して軸を求める', m: 'y = ' + vertexForm(a, p, q), n: R`軸は $x = ` + p.tex() + R`$、頂点は $\left(` + p.tex() + R`,\ ` + q.tex() + R`\right)$ です。` }
      ].concat(cs.steps.map((st) => Object.assign({}, st, { lv: 3 }))).concat([
        {
          t: '軸と定義域の位置関係を調べる',
          m: R`s = ` + s.tex() + R`,\quad \text{軸 } x = ` + p.tex() + R`,\quad t = ` + t.tex(),
          n: R`軸は**` + pos + R`**にあります。` + (inside ? R`頂点も最大・最小の候補に入ります。` : R`定義域の中でグラフは単調（増え続けるか減り続けるか）なので、候補は両端だけです。`),
          easy: R`軸が範囲の外にあるときは、範囲の中でグラフは一方向に上がる（または下がる）だけ。だから端の値を比べれば十分です。`
        },
        {
          t: '候補の y 座標を計算する',
          m: [
            R`f(` + s.tex() + ') = ' + a.tex() + R` \cdot ` + U.paren(s) + R`^{2} ` + U.signed(b) + R` \cdot ` + U.paren(s) + ' ' + U.signed(c) + ' = ' + fs.tex(),
            R`f(` + t.tex() + ') = ' + a.tex() + R` \cdot ` + U.paren(t) + R`^{2} ` + U.signed(b) + R` \cdot ` + U.paren(t) + ' ' + U.signed(c) + ' = ' + ft.tex()
          ].concat(inside ? [R`f(` + p.tex() + ') = ' + q.tex() + R`\quad (\text{頂点})`] : []),
          n: '左端・右端' + (inside ? '・頂点' : '') + ' の値を比べます。'
        },
        {
          t: '最大値・最小値',
          m: [R`\text{最大値 } ` + mx.y.tex() + R`\quad (x = ` + at(mx.y) + ')', R`\text{最小値 } ` + mn.y.tex() + R`\quad (x = ` + at(mn.y) + ')'],
          n: (down ? '下に凸なので、軸に最も近い点で最小・軸から最も遠い端で最大になります。' : '上に凸なので、軸に最も近い点で最大・軸から最も遠い端で最小になります。'),
          pro: R`軸から遠い端は「定義域の中央 $\frac{s+t}{2}$ と軸の大小」で判定できます。`
        }
      ]);
      return {
        result: [
          { label: '最大値', tex: mx.y.tex() + R`\ \ (x = ` + at(mx.y) + ')' },
          { label: '最小値', tex: mn.y.tex() + R`\ \ (x = ` + at(mn.y) + ')' },
          { label: '軸', tex: 'x = ' + p.tex() }
        ],
        steps: steps,
        fig: parabola(a, b, c, p, q, [s.val(), t.val()])
      };
    }
  });
})();
