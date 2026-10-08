/* GOKAKU NAVI — 共通ユーティリティ
   JK.util（汎用）/ JK.Q（有理数）/ JK.poly（多項式）/ JK.expr（数式の構文解析と評価）/ JK.check（自動採点） */
(function (g) {
  'use strict';
  var JK = g.JK;
  var CalcError = JK.CalcError;
  var U = JK.util = {};

  /* ================= 汎用 ================= */

  U.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  U.gcd = function (a, b) {
    a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
    while (b) { var t = a % b; a = b; b = t; }
    return a;
  };
  U.lcm = function (a, b) {
    if (!a || !b) return 0;
    return Math.abs(a / U.gcd(a, b) * b);
  };
  U.fact = function (n) {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    var r = 1;
    for (var i = 2; i <= n; i++) r *= i;
    return r;
  };
  U.nPr = function (n, r) {
    if (r < 0 || r > n) return 0;
    var x = 1;
    for (var i = 0; i < r; i++) x *= (n - i);
    return x;
  };
  U.nCr = function (n, r) {
    if (r < 0 || r > n) return 0;
    r = Math.min(r, n - r);
    var x = 1;
    for (var i = 1; i <= r; i++) x = x * (n - r + i) / i;
    return Math.round(x);
  };
  U.primeFactors = function (n) {
    n = Math.abs(Math.round(n));
    var out = [];
    if (n < 2) return out;
    for (var p = 2; p * p <= n; p++) {
      if (n % p === 0) {
        var e = 0;
        while (n % p === 0) { n /= p; e++; }
        out.push([p, e]);
      }
    }
    if (n > 1) out.push([n, 1]);
    return out;
  };
  // 非負整数 n について √n = out·√in
  U.sqrtSimplify = function (n) {
    n = Math.round(n);
    var out = 1, inn = n;
    if (n <= 0) return { out: n === 0 ? 0 : 1, in: n === 0 ? 1 : n };
    for (var p = 2; p * p <= inn; p++) {
      while (inn % (p * p) === 0) { out *= p; inn /= p * p; }
    }
    return { out: out, in: inn };
  };
  // 整数 or Q の平方根を TeX で（負なら虚数単位 i を付ける）
  U.sqrtTex = function (x) {
    var q = Q.of(x);
    if (!q) return '\\sqrt{' + U.fmt(x) + '}';
    var neg = q.sign() < 0;
    if (neg) q = q.neg();
    // √(n/d) = √(n·d) / d
    var s = U.sqrtSimplify(q.n * q.d);
    var coef = new Q(s.out, q.d);
    var body;
    if (s.in === 1) {
      body = coef.tex();
      if (neg) body = (coef.eq(1) ? '' : body + '\\,') + 'i';
      return body;
    }
    var rad = '\\sqrt{' + s.in + '}';
    if (coef.d === 1) body = (coef.n === 1 ? '' : coef.n) + rad;
    else body = '\\frac{' + (coef.n === 1 ? '' : coef.n) + rad + '}{' + coef.d + '}';
    if (neg) body += '\\,i';
    return body;
  };

  U.round = function (x, d) {
    var k = Math.pow(10, d || 0);
    return Math.round(x * k) / k;
  };

  // 表示用（TeX としても可）: 整数はそのまま、小数は d 桁で末尾 0 を除去
  U.fmt = function (x, d) {
    if (x && typeof x.tex === 'function') return x.tex();
    if (typeof x !== 'number') return String(x);
    if (isNaN(x)) return '\\text{未定義}';
    if (!isFinite(x)) return x > 0 ? '\\infty' : '-\\infty';
    d = d == null ? 4 : d;
    var r = Math.round(x);
    if (Math.abs(x - r) < 1e-9 && Math.abs(x) < 1e15) return String(r === 0 ? 0 : r);
    var ax = Math.abs(x);
    if (ax >= 1e7 || ax < 1e-4) return U.sig(x, Math.max(3, d));
    var s = x.toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (s === '-0') s = '0';
    return s;
  };

  // 有効数字 n 桁に四捨五入した数値（n は 11 まで）。15.75 のようにちょうど半端な値は 15.8 に切り上げる。
  // 2 進数の誤差で 15.749999… になっていても同じ結果になるよう、12 桁にそろえた十進表記から丸める。
  // 設問の答えと解説の表示（U.sig）はどちらもこの丸めを通すので、丸めの境目で 15.7 と 15.8 に割れない
  U.roundSig = function (x, n) {
    n = n || 3;
    if (typeof x !== 'number' || !isFinite(x) || x === 0) return x;
    var m = /^(\d)\.(\d+)e([+-]\d+)$/.exec(Math.abs(x).toExponential(11));
    var digits = m[1] + m[2], head = Number(digits.slice(0, n));
    if (digits.charAt(n) >= '5') head += 1;
    return (x < 0 ? -1 : 1) * Number(head + 'e' + (Number(m[3]) - n + 1));
  };

  // 有効数字 n 桁の TeX
  U.sig = function (x, n) {
    n = n || 3;
    if (typeof x !== 'number' || isNaN(x)) return '\\text{未定義}';
    if (x === 0) return '0';
    if (!isFinite(x)) return x > 0 ? '\\infty' : '-\\infty';
    var r = U.roundSig(x, n);
    var p = /^(-?\d(?:\.\d+)?)e([+-]\d+)$/.exec(r.toExponential(n - 1));
    var e = Number(p[2]);
    if (e >= -2 && e <= n - 1) return r.toFixed(Math.max(0, n - 1 - e));
    return p[1] + ' \\times 10^{' + e + '}';
  };

  // 連結用の符号付き項: '+ 3' / '- 2'
  U.signed = function (x) {
    if (x instanceof Q) return (x.sign() < 0 ? '- ' + x.neg().tex() : '+ ' + x.tex());
    if (typeof x === 'number') return (x < 0 ? '- ' + U.fmt(-x) : '+ ' + U.fmt(x));
    var s = String(x).trim();
    return s.charAt(0) === '-' ? '- ' + s.slice(1).trim() : '+ ' + s;
  };
  // 代入表示用: 負なら括弧
  U.paren = function (x) {
    if (x instanceof Q) return x.sign() < 0 ? '\\left(' + x.tex() + '\\right)' : x.tex();
    if (typeof x === 'number') return x < 0 ? '(' + U.fmt(x) + ')' : U.fmt(x);
    var s = String(x).trim();
    return s.charAt(0) === '-' ? '\\left(' + s + '\\right)' : s;
  };

  // 15° 刻みの三角比の厳密値（TeX）
  var TRIG = {
    0: ['0', '1', '0'],
    15: ['\\frac{\\sqrt{6}-\\sqrt{2}}{4}', '\\frac{\\sqrt{6}+\\sqrt{2}}{4}', '2-\\sqrt{3}'],
    30: ['\\frac{1}{2}', '\\frac{\\sqrt{3}}{2}', '\\frac{\\sqrt{3}}{3}'],
    45: ['\\frac{\\sqrt{2}}{2}', '\\frac{\\sqrt{2}}{2}', '1'],
    60: ['\\frac{\\sqrt{3}}{2}', '\\frac{1}{2}', '\\sqrt{3}'],
    75: ['\\frac{\\sqrt{6}+\\sqrt{2}}{4}', '\\frac{\\sqrt{6}-\\sqrt{2}}{4}', '2+\\sqrt{3}'],
    90: ['1', '0', null]
  };
  function negTex(t) {
    if (t === null) return null;
    if (t === '0') return '0';
    if (t === '2-\\sqrt{3}') return '\\sqrt{3}-2';
    if (t === '2+\\sqrt{3}') return '-2-\\sqrt{3}';
    return '-' + t;
  }
  U.exactTrig = function (deg) {
    if (typeof deg !== 'number' || !isFinite(deg)) return null;
    var d = ((deg % 360) + 360) % 360;
    if (Math.abs(d / 15 - Math.round(d / 15)) > 1e-9) return null;
    d = Math.round(d / 15) * 15;
    if (d === 360) d = 0;
    var ref, ss, cs;            // 参照角と符号
    if (d <= 90) { ref = d; ss = 1; cs = 1; }
    else if (d <= 180) { ref = 180 - d; ss = 1; cs = -1; }
    else if (d <= 270) { ref = d - 180; ss = -1; cs = -1; }
    else { ref = 360 - d; ss = -1; cs = 1; }
    var t = TRIG[ref];
    return {
      sin: ss > 0 ? t[0] : negTex(t[0]),
      cos: cs > 0 ? t[1] : negTex(t[1]),
      tan: t[2] === null ? null : (ss * cs > 0 ? t[2] : negTex(t[2]))
    };
  };

  // シード付き乱数（mulberry32）
  U.rng = function (seed) {
    var a = (seed == null ? (Date.now() & 0x7fffffff) : seed) >>> 0;
    function next() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      next: next,
      int: function (lo, hi) { return lo + Math.floor(next() * (hi - lo + 1)); },
      float: function (lo, hi) { return lo + next() * (hi - lo); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      bool: function (p) { return next() < (p == null ? 0.5 : p); },
      shuffle: function (arr) {
        var a2 = arr.slice();
        for (var i = a2.length - 1; i > 0; i--) {
          var j = Math.floor(next() * (i + 1));
          var tmp = a2[i]; a2[i] = a2[j]; a2[j] = tmp;
        }
        return a2;
      }
    };
  };

  // DOM 生成: h('div', {class:'card', onclick: fn, html: '<b>..</b>'}, [child, 'text'])
  U.h = function (tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.keys(v).forEach(function (s) { el.style[s] = v[s]; });
        else if (k === 'dataset') Object.keys(v).forEach(function (d) { el.dataset[d] = v[d]; });
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      });
    }
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null || c === false) return;
        el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
      });
    }
    return el;
  };

  /* ================= 有理数 Q ================= */

  var LIMIT = 9e15;

  function Q(n, d) {
    if (!(this instanceof Q)) return new Q(n, d);
    if (d === undefined) d = 1;
    if (n instanceof Q || d instanceof Q || !Number.isInteger(n) || !Number.isInteger(d)) {
      var a = Q.of(n), b = Q.of(d);
      if (!a || !b) throw new CalcError('数値が正しくありません');
      if (b.n === 0) throw new CalcError('0 で割ることはできません');
      n = a.n * b.d; d = a.d * b.n;
    }
    if (d === 0) throw new CalcError('0 で割ることはできません');
    if (d < 0) { n = -n; d = -d; }
    var gg = U.gcd(n, d) || 1;
    n = n / gg; d = d / gg;
    if (Math.abs(n) > LIMIT || d > LIMIT) throw new CalcError('数値が大きすぎて厳密に計算できません');
    this.n = n === 0 ? 0 : n;
    this.d = d;
  }

  function cfrac(x, maxDen) {
    var sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    var h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x;
    for (var i = 0; i < 40; i++) {
      var a = Math.floor(b);
      var h2 = a * h1 + h0, k2 = a * k1 + k0;
      if (k2 > maxDen) break;
      h0 = h1; h1 = h2; k0 = k1; k1 = k2;
      if (Math.abs(x - h1 / k1) <= 1e-12 * Math.max(1, x)) return new Q(sign * h1, k1);
      var frac = b - a;
      if (frac < 1e-13) break;
      b = 1 / frac;
    }
    return null;
  }

  // 数値・文字列・Q → Q（失敗時 null）
  Q.from = function (x) {
    if (x instanceof Q) return x;
    if (typeof x === 'number') {
      if (!isFinite(x)) return null;
      if (Number.isInteger(x)) return Math.abs(x) > LIMIT ? null : new Q(x, 1);
      var s = String(x);
      var m = /^-?\d+\.(\d+)$/.exec(s);
      if (m && m[1].length <= 12) {
        var den = Math.pow(10, m[1].length);
        var num = Math.round(x * den);
        if (Math.abs(num) <= LIMIT) return new Q(num, den);
      }
      return cfrac(x, 1e6);
    }
    if (typeof x === 'string') {
      var t = normalizeExpr(x).trim();
      if (t === '') return null;
      var mm;
      if (/^[+-]?\d+$/.test(t)) return Q.from(parseInt(t, 10));
      mm = /^([+-]?\d+)\s*\/\s*(\d+)$/.exec(t);
      if (mm) {
        var dd = parseInt(mm[2], 10);
        if (dd === 0) return null;
        return new Q(parseInt(mm[1], 10), dd);
      }
      mm = /^([+-]?)(\d*)\.(\d+)$/.exec(t);
      if (mm && mm[3].length <= 12) {
        var den2 = Math.pow(10, mm[3].length);
        var num2 = parseInt((mm[2] || '0') + mm[3], 10);
        if (num2 <= LIMIT) return new Q(mm[1] === '-' ? -num2 : num2, den2);
      }
      var v = U.parseNum(t);
      if (!isFinite(v)) return null;
      return Q.from(v);
    }
    return null;
  };
  // Q.from と同じ（内部用の別名）
  Q.of = Q.from;

  Q.prototype.add = function (o) { o = Q.of(o); return new Q(this.n * o.d + o.n * this.d, this.d * o.d); };
  Q.prototype.sub = function (o) { o = Q.of(o); return new Q(this.n * o.d - o.n * this.d, this.d * o.d); };
  Q.prototype.mul = function (o) { o = Q.of(o); return new Q(this.n * o.n, this.d * o.d); };
  Q.prototype.div = function (o) {
    o = Q.of(o);
    if (o.n === 0) throw new CalcError('0 で割ることはできません');
    return new Q(this.n * o.d, this.d * o.n);
  };
  Q.prototype.neg = function () { return new Q(-this.n, this.d); };
  Q.prototype.abs = function () { return new Q(Math.abs(this.n), this.d); };
  Q.prototype.inv = function () {
    if (this.n === 0) throw new CalcError('0 の逆数は定義されません');
    return new Q(this.d, this.n);
  };
  Q.prototype.pow = function (k) {
    if (!Number.isInteger(k)) throw new CalcError('指数は整数にしてください');
    if (k < 0) return this.inv().pow(-k);
    var r = new Q(1, 1);
    for (var i = 0; i < k; i++) r = r.mul(this);
    return r;
  };
  Q.prototype.eq = function (o) { o = Q.of(o); return !!o && this.n === o.n && this.d === o.d; };
  Q.prototype.cmp = function (o) {
    o = Q.of(o);
    var l = this.n * o.d, r = o.n * this.d;
    return l < r ? -1 : (l > r ? 1 : 0);
  };
  Q.prototype.sign = function () { return this.n > 0 ? 1 : (this.n < 0 ? -1 : 0); };
  Q.prototype.isInt = function () { return this.d === 1; };
  Q.prototype.isZero = function () { return this.n === 0; };
  Q.prototype.val = function () { return this.n / this.d; };
  Q.prototype.tex = function () {
    if (this.d === 1) return String(this.n);
    return (this.n < 0 ? '-' : '') + '\\frac{' + Math.abs(this.n) + '}{' + this.d + '}';
  };
  Q.prototype.toString = function () { return this.d === 1 ? String(this.n) : this.n + '/' + this.d; };
  JK.Q = Q;

  /* ================= 数式の構文解析・評価 ================= */

  var FUNCS = {
    sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    log: Math.log, ln: Math.log, log10: function (x) { return Math.log(x) / Math.LN10; },
    exp: Math.exp, abs: Math.abs
  };
  var FUNC_NAMES = Object.keys(FUNCS).sort(function (a, b) { return b.length - a.length; });

  function normalizeExpr(s) {
    s = String(s == null ? '' : s);
    s = s.replace(/[²³⁴⁵⁶⁷⁸⁹]/g, function (c) { return '^' + ('²³⁴⁵⁶⁷⁸⁹'.indexOf(c) + 2); });
    if (s.normalize) s = s.normalize('NFKC');
    s = s.replace(/[−‐‑‒–—―ー]/g, '-')
      .replace(/[×✕✖]/g, '*').replace(/÷/g, '/').replace(/[·・∙⋅]/g, '*')
      .replace(/[，、]/g, ',');
    return s;
  }

  function tokenize(s, vars) {
    var toks = [], i = 0, n = s.length, m;
    var varSet = {};
    (vars || []).forEach(function (v) { varSet[v] = true; });
    while (i < n) {
      var c = s.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(s.slice(i));
        if (!m) throw new CalcError('数値の書き方が正しくありません');
        var numStr = (m[2] && varSet.e) ? m[1] : m[0];
        toks.push({ t: 'num', v: parseFloat(numStr) });
        i += numStr.length;
        continue;
      }
      if (/[a-zA-Z]/.test(c)) {
        var rest = s.slice(i), matched = null;
        for (var k = 0; k < FUNC_NAMES.length; k++) {
          var fnm = FUNC_NAMES[k];
          if (rest.lastIndexOf(fnm, 0) === 0) {
            var allVars = fnm.split('').every(function (ch) { return varSet[ch]; });
            if (allVars && rest.charAt(fnm.length) !== '(') continue;
            matched = fnm;
            break;
          }
        }
        if (matched) { toks.push({ t: 'fn', v: matched }); i += matched.length; continue; }
        if (rest.lastIndexOf('pi', 0) === 0 && !(varSet.p && varSet.i)) {
          toks.push({ t: 'num', v: Math.PI }); i += 2; continue;
        }
        toks.push({ t: 'id', v: c }); i++; continue;
      }
      if (c === 'π') { toks.push({ t: 'num', v: Math.PI }); i++; continue; }
      if (c === '√') { toks.push({ t: 'fn', v: 'sqrt', prefix: true }); i++; continue; }
      if ('+-*/^()|!,'.indexOf(c) >= 0) { toks.push({ t: c }); i++; continue; }
      if (/[α-ωΑ-Ω]/.test(c)) { toks.push({ t: 'id', v: c }); i++; continue; }
      throw new CalcError('使えない文字があります: ' + c);
    }
    return toks;
  }

  function parseExpr(str, vars) {
    var toks = tokenize(normalizeExpr(str), vars), p = 0;
    if (!toks.length) throw new CalcError('式が空です');
    function peek() { return toks[p]; }
    function eat(t) { if (toks[p] && toks[p].t === t) { p++; return true; } return false; }
    function startsPrimary(tk) { return !!tk && (tk.t === 'num' || tk.t === 'id' || tk.t === 'fn' || tk.t === '('); }
    function expr() {
      var l = term();
      while (peek() && (peek().t === '+' || peek().t === '-')) {
        var op = toks[p++].t;
        l = { k: op, a: l, b: term() };
      }
      return l;
    }
    function term() {
      var l = unary();
      for (;;) {
        var tk = peek();
        if (!tk) break;
        if (tk.t === '*' || tk.t === '/') { p++; l = { k: tk.t, a: l, b: unary() }; }
        else if (startsPrimary(tk)) { l = { k: '*', a: l, b: power() }; }   // 省略された掛け算
        else break;
      }
      return l;
    }
    function unary() {
      if (eat('-')) return { k: 'neg', a: unary() };
      if (eat('+')) return unary();
      return power();
    }
    function power() {
      var base = postfix();
      if (eat('^')) return { k: '^', a: base, b: unaryPow() };
      return base;
    }
    function unaryPow() {
      if (eat('-')) return { k: 'neg', a: unaryPow() };
      if (eat('+')) return unaryPow();
      return power();
    }
    function postfix() {
      var x = primary();
      while (eat('!')) x = { k: 'fact', a: x };
      return x;
    }
    function primary() {
      var tk = peek();
      if (!tk) throw new CalcError('式が途中で終わっています');
      if (tk.t === 'num') { p++; return { k: 'num', v: tk.v }; }
      if (tk.t === 'id') { p++; return { k: 'var', v: tk.v }; }
      if (tk.t === '(') {
        p++;
        var e = expr();
        if (!eat(')')) throw new CalcError('かっこ ) が足りません');
        return e;
      }
      if (tk.t === '|') {
        p++;
        var e2 = expr();
        if (!eat('|')) throw new CalcError('絶対値の | が閉じていません');
        return { k: 'fn', f: 'abs', a: e2 };
      }
      if (tk.t === 'fn') {
        p++;
        var arg;
        if (peek() && peek().t === '(') {
          p++;
          arg = expr();
          if (!eat(')')) throw new CalcError('かっこ ) が足りません');
        } else if (tk.prefix) {
          arg = primary();                       // √2x は (√2)·x
        } else {
          arg = power();                         // sin 2x は sin(2x)
          while (peek() && (peek().t === 'num' || peek().t === 'id' || peek().t === '(')) {
            arg = { k: '*', a: arg, b: power() };
          }
        }
        return { k: 'fn', f: tk.v, a: arg };
      }
      throw new CalcError('式の書き方が正しくありません');
    }
    var ast = expr();
    if (p < toks.length) throw new CalcError('式の書き方が正しくありません');
    return ast;
  }

  function evalAst(n, env) {
    switch (n.k) {
      case 'num': return n.v;
      case 'var':
        if (env && Object.prototype.hasOwnProperty.call(env, n.v)) return env[n.v];
        if (n.v === 'e') return Math.E;
        throw new CalcError('未定義の文字があります: ' + n.v);
      case '+': return evalAst(n.a, env) + evalAst(n.b, env);
      case '-': return evalAst(n.a, env) - evalAst(n.b, env);
      case '*': return evalAst(n.a, env) * evalAst(n.b, env);
      case '/': return evalAst(n.a, env) / evalAst(n.b, env);
      case '^': return Math.pow(evalAst(n.a, env), evalAst(n.b, env));
      case 'neg': return -evalAst(n.a, env);
      case 'fact': {
        var f = evalAst(n.a, env);
        if (f < 0 || f > 170 || Math.abs(f - Math.round(f)) > 1e-9) return NaN;
        return U.fact(Math.round(f));
      }
      case 'fn': return FUNCS[n.f](evalAst(n.a, env));
    }
    return NaN;
  }

  JK.expr = {
    normalize: normalizeExpr,
    parse: parseExpr,
    eval: evalAst,
    // 文字列を評価して Number（失敗時 NaN）
    value: function (str, env) {
      try { return evalAst(parseExpr(str, env ? Object.keys(env) : []), env || {}); }
      catch (e) { return NaN; }
    },
    // 2 つの式が（数値的に）等しいか。構文エラーは false
    equal: function (a, b, vars) {
      vars = vars && vars.length ? vars : [];
      var A, B;
      try { A = parseExpr(a, vars); B = parseExpr(b, vars); }
      catch (e) { return false; }
      var r = U.rng(20261002), okCount = 0;
      for (var t = 0; t < 16; t++) {
        var env = {};
        for (var i = 0; i < vars.length; i++) {
          env[vars[i]] = t < 8 ? r.float(0.6, 2.4) : r.float(-2.4, 2.4);
        }
        var x, y;
        try { x = evalAst(A, env); y = evalAst(B, env); }
        catch (e2) { return false; }
        var fx = isFinite(x), fy = isFinite(y);
        if (!fx && !fy) continue;
        if (fx !== fy) return false;
        if (Math.abs(x - y) > 1e-6 * Math.max(1, Math.abs(x), Math.abs(y))) return false;
        okCount++;
        if (!vars.length) break;
      }
      return okCount >= (vars.length ? 3 : 1);
    }
  };

  U.parseNum = function (str) {
    if (typeof str === 'number') return str;
    if (str == null || String(str).trim() === '') return NaN;
    return JK.expr.value(str, null);
  };

  /* ================= 多項式（係数 Q の配列・添字 = 次数） ================= */

  var P = JK.poly = {};
  function trim(p) {
    var a = p.slice();
    while (a.length > 1 && a[a.length - 1].isZero()) a.pop();
    if (!a.length) a.push(new Q(0));
    return a;
  }
  P.of = function (arr) { return trim(arr.map(function (c) { var q = Q.of(c); if (!q) throw new CalcError('係数が正しくありません'); return q; })); };
  P.isZero = function (p) { p = trim(p); return p.length === 1 && p[0].isZero(); };
  P.deg = function (p) { p = trim(p); return (p.length === 1 && p[0].isZero()) ? -1 : p.length - 1; };
  P.add = function (a, b) {
    var n = Math.max(a.length, b.length), r = [];
    for (var i = 0; i < n; i++) r.push((a[i] || new Q(0)).add(b[i] || new Q(0)));
    return trim(r);
  };
  P.scale = function (a, k) { k = Q.of(k); return trim(a.map(function (c) { return c.mul(k); })); };
  P.neg = function (a) { return P.scale(a, -1); };
  P.sub = function (a, b) { return P.add(a, P.neg(b)); };
  P.mul = function (a, b) {
    var r = [], i, j;
    for (i = 0; i < a.length + b.length - 1; i++) r.push(new Q(0));
    for (i = 0; i < a.length; i++) for (j = 0; j < b.length; j++) r[i + j] = r[i + j].add(a[i].mul(b[j]));
    return trim(r);
  };
  P.deriv = function (a) {
    var r = [];
    for (var i = 1; i < a.length; i++) r.push(a[i].mul(i));
    return trim(r.length ? r : [new Q(0)]);
  };
  P.integ = function (a) {
    var r = [new Q(0)];
    for (var i = 0; i < a.length; i++) r.push(a[i].div(i + 1));
    return trim(r);
  };
  P.eval = function (a, x) {
    var i;
    if (x instanceof Q) {
      var r = new Q(0);
      for (i = a.length - 1; i >= 0; i--) r = r.mul(x).add(a[i]);
      return r;
    }
    var s = 0;
    for (i = a.length - 1; i >= 0; i--) s = s * x + a[i].val();
    return s;
  };
  P.fn = function (a) { return function (x) { return P.eval(a, x); }; };
  P.divmod = function (a, d) {
    a = trim(a); d = trim(d);
    if (P.isZero(d)) throw new CalcError('0 で割ることはできません');
    var q = [], r = a.slice(), dd = d.length - 1, lead = d[dd];
    for (var i = 0; i <= Math.max(0, a.length - d.length); i++) q.push(new Q(0));
    while (r.length - 1 >= dd && !(r.length === 1 && r[0].isZero())) {
      var k = r.length - 1 - dd;
      var c = r[r.length - 1].div(lead);
      q[k] = c;
      for (var j = 0; j <= dd; j++) r[k + j] = r[k + j].sub(c.mul(d[j]));
      r.pop();
      if (!r.length) r.push(new Q(0));
      r = trim(r);
      if (r.length - 1 < dd) break;
    }
    return { q: trim(q), r: trim(r) };
  };
  P.tex = function (p, v) {
    v = v || 'x';
    p = trim(p);
    var out = '';
    for (var k = p.length - 1; k >= 0; k--) {
      var c = p[k];
      if (c.isZero()) continue;
      var neg = c.sign() < 0, ab = c.abs();
      var coef = (ab.eq(1) && k > 0) ? '' : ab.tex();
      var vp = k === 0 ? '' : (k === 1 ? v : v + '^{' + k + '}');
      if (out === '') out = (neg ? '-' : '') + coef + vp;
      else out += (neg ? ' - ' : ' + ') + coef + vp;
    }
    return out === '' ? '0' : out;
  };
  P.rationalRoots = function (p) {
    p = trim(p);
    var roots = [];
    if (P.deg(p) < 1) return roots;
    var a = p.slice();
    // x = 0 が解なら括り出す
    var zero = false;
    while (a.length > 1 && a[0].isZero()) { a.shift(); zero = true; }
    if (zero) roots.push(new Q(0));
    if (a.length < 2) return roots;
    // 整数係数化
    var L = 1;
    a.forEach(function (c) { L = U.lcm(L, c.d); });
    var ints = a.map(function (c) { return c.n * (L / c.d); });
    var a0 = Math.abs(ints[0]), an = Math.abs(ints[ints.length - 1]);
    function divisors(n) {
      var ds = [];
      for (var i = 1; i * i <= n; i++) if (n % i === 0) { ds.push(i); if (i * i !== n) ds.push(n / i); }
      return ds;
    }
    if (a0 > 1e9 || an > 1e9) return roots;
    var ps = divisors(a0), qs = divisors(an), seen = {};
    for (var i = 0; i < ps.length; i++) for (var j = 0; j < qs.length; j++) {
      [1, -1].forEach(function (sg) {
        var cand = new Q(sg * ps[i], qs[j]);
        var key = cand.toString();
        if (seen[key]) return;
        seen[key] = true;
        if (P.eval(a, cand).isZero()) roots.push(cand);
      });
    }
    roots.sort(function (x, y) { return x.cmp(y); });
    return roots;
  };
  function polyFromAst(n, v) {
    switch (n.k) {
      case 'num': {
        var q = Q.from(n.v);
        if (!q) throw new CalcError('多項式の係数は整数・分数・小数で入力してください');
        return [q];
      }
      case 'var':
        if (n.v !== v) throw new CalcError('変数は ' + v + ' だけを使ってください（' + n.v + ' は使えません）');
        return [new Q(0), new Q(1)];
      case '+': return P.add(polyFromAst(n.a, v), polyFromAst(n.b, v));
      case '-': return P.sub(polyFromAst(n.a, v), polyFromAst(n.b, v));
      case '*': return P.mul(polyFromAst(n.a, v), polyFromAst(n.b, v));
      case 'neg': return P.neg(polyFromAst(n.a, v));
      case '/': {
        var den = polyFromAst(n.b, v);
        if (P.deg(den) !== 0) throw new CalcError(P.isZero(den) ? '0 で割ることはできません' : '多項式では変数で割ることはできません');
        return P.scale(polyFromAst(n.a, v), den[0].inv());
      }
      case '^': {
        var ex = polyFromAst(n.b, v);
        if (P.deg(ex) > 0 || !ex[0].isInt() || ex[0].n < 0 || ex[0].n > 30) throw new CalcError('指数は 0〜30 の整数にしてください');
        var base = polyFromAst(n.a, v), r = [new Q(1)];
        for (var i = 0; i < ex[0].n; i++) r = P.mul(r, base);
        return r;
      }
      default:
        throw new CalcError('多項式として解釈できません（関数や階乗は使えません）');
    }
  }
  P.parse = function (str, v) {
    v = v || 'x';
    return trim(polyFromAst(parseExpr(str, [v]), v));
  };

  /* ================= 自動採点 ================= */

  var C = JK.check = {};
  C.normText = function (s, caseSensitive) {
    s = String(s == null ? '' : s);
    if (s.normalize) s = s.normalize('NFKC');
    s = s.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.。]$/, '').trim();
    return caseSensitive ? s : s.toLowerCase();
  };
  C.normOrder = function (s) {
    return C.normText(s).replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
  };
  // 設問 1 つを採点。input: num/expr/text は文字列、choice は添字、multi は添字配列、order は語の配列
  // 戻り値 { ok: bool, blank: bool（未入力）, invalid: bool（解釈不能） }
  C.part = function (part, input) {
    var res = { ok: false, blank: false, invalid: false };
    switch (part.type) {
      case 'num': {
        if (input == null || String(input).trim() === '') { res.blank = true; return res; }
        var x = U.parseNum(input);
        if (!isFinite(x)) { res.invalid = true; return res; }
        var a = part.answer, mag = Math.abs(a), allowed;
        // 丸め誤差ぶんの余裕は答えの大きさに比例させる（1e-19 J のような小さい答えで、0 や別の値まで正解にしない）
        if (part.tol == null && part.rel == null) allowed = 5e-4 * mag + (mag ? Math.min(1e-6, 1e-3 * mag) : 1e-6);
        else allowed = Math.max(part.tol || 0, (part.rel || 0) * mag) + (mag ? Math.min(1e-12, 1e-9 * mag) : 1e-12);
        res.ok = Math.abs(x - a) <= allowed;
        return res;
      }
      case 'expr': {
        if (input == null || String(input).trim() === '') { res.blank = true; return res; }
        var vars = part.vars || ['x'];
        try { parseExpr(input, vars); } catch (e) { res.invalid = true; return res; }
        res.ok = JK.expr.equal(input, part.answer, vars);
        return res;
      }
      case 'choice':
        if (input == null || input === '' || input < 0) { res.blank = true; return res; }
        res.ok = Number(input) === part.answer;
        return res;
      case 'multi': {
        var sel = (input || []).map(Number).sort(function (p1, p2) { return p1 - p2; });
        if (!sel.length) { res.blank = true; return res; }
        var ans = part.answer.slice().sort(function (p1, p2) { return p1 - p2; });
        res.ok = sel.length === ans.length && sel.every(function (v, i) { return v === ans[i]; });
        return res;
      }
      case 'text': {
        if (input == null || String(input).trim() === '') { res.blank = true; return res; }
        var cs = part.ci === false;
        var got = C.normText(input, cs);
        var answers = Array.isArray(part.answer) ? part.answer : [part.answer];
        res.ok = answers.some(function (t) { return C.normText(t, cs) === got; });
        return res;
      }
      case 'order': {
        var words = input || [];
        if (!words.length) { res.blank = true; return res; }
        res.ok = C.normOrder(words.join(' ')) === C.normOrder(part.answer);
        return res;
      }
    }
    res.invalid = true;
    return res;
  };
  // 入力例（hint）の文から「そのまま入力できる式・語」を取り出す
  C.hintExamples = function (hint) {
    var s = String(hint == null ? '' : hint);
    // 数式（$…$）で書かれた例は入力の形に直す: \frac{a}{b} → (a)/(b)、\sqrt{a} → sqrt(a) など
    s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)').replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)')
      .replace(/\\pi(?![a-zA-Z])/g, 'π').replace(/\\times(?![a-zA-Z])/g, '×').replace(/\\cdot(?![a-zA-Z])/g, '*')
      .replace(/\^\{([^{}]*)\}/g, '^($1)').replace(/\\[,;! ]/g, ' ').replace(/\$/g, ' ');
    var out = [], seen = {}, re = /[0-9A-Za-z+\-−*\/^().√πθ×·' ]+/g, m;
    function add(c) {
      if (c && !seen[c]) { seen[c] = true; out.push(c); }
    }
    while ((m = re.exec(s))) {
      var run = m[0].replace(/^[\s)*\/^·×.]+/, '').replace(/[\s(+\-−*\/^·×.]+$/, '');
      if (!run) continue;
      // 「小数第 3 位」「2 桁」「1 語」のような数は入力例ではない
      if (/^\d+$/.test(run)) {
        var before = s.slice(0, m.index).replace(/\s+$/, ''), after = s.slice(m.index + m[0].length).replace(/^\s+/, '');
        if (/第$/.test(before) || /^(桁|位|語|文字|個|通り|番|回|倍|つ|択|乗|次|行|列|点|種)/.test(after)) continue;
      }
      add(run);
      if (/\s/.test(run)) run.split(/\s+/).forEach(add);
    }
    return out;
  };
  // 入力例がそのまま正解になっている（答えが見えてしまう）もの。なければ空配列
  C.hintLeak = function (part) {
    if (!part || !part.hint || ['num', 'expr', 'text'].indexOf(part.type) < 0) return [];
    var leaks = C.hintExamples(part.hint).filter(function (c) {
      try { return C.part(part, c).ok; } catch (e) { return false; }
    });
    if (part.type === 'text') {
      // 日本語などの語句は、入力例の文に正解が含まれているかで判定する
      var cs = part.ci === false, text = C.normText(part.hint, cs);
      (Array.isArray(part.answer) ? part.answer : [part.answer]).forEach(function (a) {
        var t = C.normText(a, cs);
        if (t.length >= 2 && /[^\x20-\x7e]/.test(t) && text.indexOf(t) >= 0 && leaks.indexOf(a) < 0) leaks.push(a);
      });
    }
    return leaks;
  };
  // 画面に出す入力例。答えが見えてしまうものは出さない
  C.hintFor = function (part) {
    return part && part.hint && !C.hintLeak(part).length ? part.hint : '';
  };
  // 文・数式の中の数値を取り出す（3.68 \times 10^{4} も 1 つの数として読む）。絶対値で返す
  C.numbersIn = function (text) {
    var out = [], s = String(text == null ? '' : text).replace(/\\,/g, '').replace(/\{,\}/g, '');
    var re = /(-?\d+(?:\.\d+)?)(?:\s*(?:\\times|×)\s*10\^\{?\s*(-?\d+)\s*\}?)?/g, m;
    while ((m = re.exec(s))) {
      var v = Number(m[1]);
      if (m[2] !== undefined) v *= Math.pow(10, Number(m[2]));
      if (isFinite(v)) out.push(Math.abs(v));
    }
    return out;
  };
  // 乱数演習の点検: 数値の答えが、解説に出てくる数値と「近いのに一致しない」設問の番号を返す。
  // 途中の値を丸めて計算した解説と、丸めずに計算した答えが、丸めの境目で 36.7 と 36.8 のようにずれる場合を見つける
  C.roundGap = function (ex) {
    var text = [], gaps = [];
    ((ex && ex.solution) || []).forEach(function (st) { text.push([].concat(st.m || [], st.n || '', st.easy || '', st.pro || '').join(' ')); });
    ((ex && ex.parts) || []).forEach(function (p) { if (p.explain) text.push(p.explain); });
    var nums = C.numbersIn(text.join(' '));
    ((ex && ex.parts) || []).forEach(function (p, i) {
      if (p.type !== 'num' || !p.answer) return;
      var a = Math.abs(p.answer), exact = false, near = false;
      for (var k = 0; k < nums.length; k++) {
        var d = Math.abs(nums[k] - a);
        if (d <= 5e-4 * a) { exact = true; break; }
        if (d <= 0.012 * a) near = true;
      }
      if (!exact && near) gaps.push(i);
    });
    return gaps;
  };
  // 文・数式の中の「式の形の値」（\frac{3}{4}、2\sqrt{3}、\frac{\pi}{6}、8\pi - 16 など）を数値にして返す。絶対値
  C.exactValuesIn = function (text) {
    var s = String(text == null ? '' : text).replace(/\\[dt]frac/g, '\\frac').replace(/\\left|\\right/g, '').replace(/\\[,;!: ]/g, ' ');
    for (var k = 0; k < 6; k++) {      // 内側の {} から順に、入力の書き方に直す
      var t = s.replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)').replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))').replace(/\^\{([^{}]*)\}/g, '^($1)');
      if (t === s) break;
      s = t;
    }
    s = s.replace(/\\pi(?![a-zA-Z])/g, 'π').replace(/\\times(?![a-zA-Z])/g, '*').replace(/\\cdot(?![a-zA-Z])/g, '*').replace(/\\log(?![a-zA-Z])/g, 'log');
    var out = [], re = /[0-9a-z+\-−*\/^().√π ]+/g, m;
    while ((m = re.exec(s))) {
      var run = m[0].trim();
      if (!/\d/.test(run) || !/[\/√π^+\-−*]|sqrt|log/.test(run)) continue;      // 素の数は numbersIn が拾う
      var v = NaN;
      try { v = U.parseNum(run); } catch (e) { v = NaN; }
      if (isFinite(v) && v !== 0) out.push(Math.abs(v));
    }
    return out;
  };
  // 文の中に、数値 a と同じ値があるか。素の数は有効数字の並びで比べる（10 の何乗かは問わない。4.43×10⁻¹¹ F と 44.3 pF を
  // 同じ値とみる）。分数・根号などの式の形の値は、値そのもので比べる
  C.hasValue = function (text, a) {
    var nums = C.numbersIn(text), m = mantissa(a), i;
    for (i = 0; i < nums.length; i++) {
      if (!nums[i]) continue;
      var c = mantissa(nums[i]);
      if (Math.abs(c - m) <= 6e-4 * m || Math.abs(c * 10 - m) <= 6e-4 * m || Math.abs(c - m * 10) <= 6e-3 * m) return true;
    }
    var ex = C.exactValuesIn(text), abs = Math.abs(a);
    for (i = 0; i < ex.length; i++) if (Math.abs(ex[i] - abs) <= 6e-4 * abs) return true;
    return false;
  };
  function mantissa(v) { v = Math.abs(v); return v / Math.pow(10, Math.floor(Math.log10(v))); }
  // 解説の点検: 数値の答えが、解説（全ステップ + 設問の explain）のどこにも出てこない設問の番号を返す。
  // 解説がその設問に触れていない（別の量しか求めていない）場合を見つける
  C.uncovered = function (ex) {
    var text = [], out = [];
    ((ex && ex.solution) || []).forEach(function (st) { text.push([].concat(st.m || [], st.n || '', st.easy || '', st.pro || '').join(' ')); });
    ((ex && ex.parts) || []).forEach(function (p) { if (p.explain) text.push(p.explain); });
    text = text.join(' ');
    ((ex && ex.parts) || []).forEach(function (p, i) {
      if (p.type === 'num' && p.answer && !C.hasValue(text, p.answer)) out.push(i);
    });
    return out;
  };
  // 正解の表示用（リッチテキスト）
  C.answerText = function (part) {
    switch (part.type) {
      case 'num':
        return '$' + (part.show != null ? part.show : U.fmt(part.answer, 6)) +
          (part.unit ? '\\,\\text{' + part.unit + '}' : '') + '$';
      case 'expr':
        return part.show != null ? '$' + part.show + '$' : part.answer;
      case 'choice': {
        var c = part.choices[part.answer];
        return '選択肢 ' + (part.answer + 1) + (typeof c === 'string' ? '： ' + c : (c && c.t ? '： ' + c.t : ''));
      }
      case 'multi':
        return '選択肢 ' + part.answer.map(function (i) { return i + 1; }).join('・');
      case 'text':
        return Array.isArray(part.answer) ? part.answer.join(' / ') : String(part.answer);
      case 'order':
        return String(part.answer);
    }
    return '';
  };
})(typeof window !== 'undefined' ? window : globalThis);
