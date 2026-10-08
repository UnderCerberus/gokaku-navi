/* GOKAKU NAVI — mini-TeX → HTML+CSS レンダラ（外部ライブラリ不使用）
   JK.tex.render(tex, display) / JK.tex.check(tex) / JK.rich(str) / JK.richCheck(str) / JK.passage */
(function (g) {
  'use strict';
  var JK = g.JK;
  var esc = JK.util.esc;

  var GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', theta: 'θ', lambda: 'λ',
    mu: 'μ', nu: 'ν', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', omega: 'ω',
    Delta: 'Δ', Omega: 'Ω', Sigma: 'Σ', Phi: 'Φ', Lambda: 'Λ', Gamma: 'Γ'
  };
  var UPRIGHT_GREEK = { Delta: 1, Omega: 1, Sigma: 1, Phi: 1, Lambda: 1, Gamma: 1 };
  // 二項演算子・関係演算子（前後に空き）
  var BIN = { times: '×', div: '÷', cdot: '·', pm: '±', mp: '∓', cup: '∪', cap: '∩' };
  var REL = {
    le: '≦', ge: '≧', ne: '≠', approx: '≈', equiv: '≡', fallingdotseq: '≒', to: '→',
    Rightarrow: '⇒', Leftrightarrow: '⇔', 'in': '∈', subset: '⊂', propto: '∝', sim: '∼',
    perp: '⊥', parallel: '∥'
  };
  var ORD = {
    infty: '∞', angle: '∠', triangle: '△', degree: '°', cdots: '⋯', ldots: '…',
    therefore: '∴', because: '∵', prime: '′', circ: '∘', ell: 'ℓ', square: '□', bigcirc: '○', times10: '×10'
  };
  // よく使われる別名（契約書の表にない書き方も受け付ける）
  var ALIAS = {
    leq: 'le', geq: 'ge', neq: 'ne', rightarrow: 'to', dots: 'ldots', tfrac: 'frac', cfrac: 'frac',
    lt: '<', gt: '>', mid: '|', operatorname: 'mathrm', textbf: 'mathbf', overrightarrow: 'vec',
    Longrightarrow: 'Rightarrow', iff: 'Leftrightarrow', Longleftrightarrow: 'Leftrightarrow', simeq: 'approx', ast: '*',
    longrightarrow: 'to', dfrac: 'frac', lvert: '|', rvert: '|', vert: '|', centerdot: 'cdot', leqq: 'le', geqq: 'ge',
    doteq: 'fallingdotseq', ngtr: 'le', nless: 'ge'
  };
  var IGNORE = { displaystyle: 1, limits: 1, nolimits: 1, textstyle: 1, bigl: 1, bigr: 1, big: 1, Big: 1 };
  var FUNCS = { sin: 1, cos: 1, tan: 1, log: 1, ln: 1, exp: 1, max: 1, min: 1, arg: 1 };
  var BIGOP = { sum: '∑', prod: '∏', lim: 'lim', int: '∫' };
  var SPACES = { ',': 'ms1', ';': 'ms2', ':': 'ms2', '!': 'msn', quad: 'ms4', qquad: 'ms8', ' ': 'ms2' };
  var DECOR = { vec: 'mvec', overline: 'mover', bar: 'mover', hat: 'mhat', dot: 'mdot', underline: 'munder', boxed: 'mbox' };

  function Parser(src) {
    this.s = src;
    this.i = 0;
    this.errors = [];
    this.upright = 0;
  }

  Parser.prototype.err = function (m) { this.errors.push(m); };

  function atom(html, kind) { return { html: html, kind: kind || 'ord' }; }

  function join(atoms) {
    var out = '';
    for (var k = 0; k < atoms.length; k++) out += atoms[k].html;
    return out;
  }

  // 直前の要素から、+ - が単項かどうかを判定
  function isUnaryContext(atoms) {
    if (!atoms.length) return true;
    var k = atoms[atoms.length - 1].kind;
    return k === 'bin' || k === 'rel' || k === 'open' || k === 'punct' || k === 'sep' || k === 'space';
  }

  Parser.prototype.readCommandName = function () {
    // this.s[this.i] は '\' の次の文字
    var s = this.s, i = this.i;
    if (i >= s.length) return '';
    var c = s.charAt(i);
    if (/[a-zA-Z]/.test(c)) {
      var j = i;
      while (j < s.length && /[a-zA-Z]/.test(s.charAt(j))) j++;
      this.i = j;
      return s.slice(i, j);
    }
    this.i = i + 1;
    return c;
  };

  Parser.prototype.skipWs = function () {
    while (this.i < this.s.length && /\s/.test(this.s.charAt(this.i))) this.i++;
  };

  // {…} か、1 トークンを引数として読む。HTML を返す
  Parser.prototype.readArg = function () {
    this.skipWs();
    var s = this.s;
    if (this.i >= s.length) { this.err('引数がありません'); return ''; }
    var c = s.charAt(this.i);
    if (c === '{') {
      this.i++;
      var atoms = this.parseUntil(function (p) { return p.s.charAt(p.i) === '}'; });
      if (s.charAt(this.i) === '}') this.i++; else this.err('} が足りません');
      return join(atoms);
    }
    if (c === '\\') {
      var list = [];
      this.i++;
      this.command(list);
      return join(list);
    }
    this.i++;
    return this.charAtom(c, []).html;
  };

  // {…} の中身を生テキストとして読む（\text 用）
  Parser.prototype.readRawGroup = function () {
    this.skipWs();
    var s = this.s;
    if (s.charAt(this.i) !== '{') { this.err('{ がありません'); return ''; }
    var depth = 1, j = this.i + 1;
    while (j < s.length && depth > 0) {
      var c = s.charAt(j);
      if (c === '{') depth++;
      else if (c === '}') depth--;
      if (depth > 0) j++;
    }
    if (depth !== 0) this.err('} が足りません');
    var raw = s.slice(this.i + 1, j);
    this.i = Math.min(s.length, j + 1);
    return raw;
  };

  Parser.prototype.charAtom = function (c, atoms) {
    if (/[0-9]/.test(c)) return atom('<span class="mn">' + c + '</span>', 'ord');
    if (/[a-zA-Z]/.test(c)) return atom(this.upright ? '<span class="mrm">' + c + '</span>' : '<i class="mi">' + c + '</i>', 'ord');
    switch (c) {
      case '+': return isUnaryContext(atoms) ? atom('<span class="mu">+</span>', 'ord') : atom('<span class="mo">+</span>', 'bin');
      case '-': return isUnaryContext(atoms) ? atom('<span class="mu">−</span>', 'ord') : atom('<span class="mo">−</span>', 'bin');
      case '=': return atom('<span class="mrel">=</span>', 'rel');
      case '<': return atom('<span class="mrel">&lt;</span>', 'rel');
      case '>': return atom('<span class="mrel">&gt;</span>', 'rel');
      case ',': return atom('<span class="mpunct">,</span>', 'punct');
      case ';': return atom('<span class="mpunct">;</span>', 'punct');
      case ':': return atom('<span class="mrel">:</span>', 'rel');
      case '(': case '[': return atom(c, 'open');
      case ')': case ']': return atom(c, 'ord');
      case '|': return atom('<span class="mbar">|</span>', 'ord');
      case "'": return atom('′', 'ord');
      case '*': return atom('<span class="mo">∗</span>', 'bin');
      case '/': return atom('<span class="mslash">/</span>', 'ord');
      case '~': return atom('<span class="ms2"></span>', 'space');
      default:
        if (/[α-ω]/.test(c)) return atom(this.upright ? '<span class="mrm">' + c + '</span>' : '<i class="mi mg">' + c + '</i>', 'ord');
        return atom(esc(c), 'ord');
    }
  };

  // 添字つき要素を組み立てる
  function withScripts(base, sup, sub) {
    if (sup == null && sub == null) return base;
    var b = base || atom('', 'ord');
    var html;
    if (b.big === 'int') {
      html = '<span class="mint"><span class="mint-sym">∫</span><span class="mint-lim"><span>' + (sup || '') +
        '</span><span>' + (sub || '') + '</span></span></span>';
      return atom(html, 'ord');
    }
    if (b.big) {
      html = '<span class="mop"><span class="mop-hi">' + (sup || '') + '</span><span class="mop-sym' +
        (b.big === 'lim' ? ' mop-lim' : '') + '">' + b.sym + '</span><span class="mop-lo">' + (sub || '') + '</span></span>';
      return atom(html, 'ord');
    }
    if (sup != null && sub != null) {
      html = b.html + '<span class="msupsub"><span>' + sup + '</span><span>' + sub + '</span></span>';
    } else if (sup != null) {
      html = b.html + '<sup class="msup">' + sup + '</sup>';
    } else {
      html = b.html + '<sub class="msub">' + sub + '</sub>';
    }
    return atom(html, b.kind === 'open' ? 'ord' : b.kind);
  }

  Parser.prototype.scripts = function (atoms) {
    // 現在位置は ^ または _
    var sup = null, sub = null, s = this.s;
    for (;;) {
      this.skipWs();
      var c = s.charAt(this.i);
      if (c === '^' && sup == null) { this.i++; sup = this.readArg(); }
      else if (c === '_' && sub == null) { this.i++; sub = this.readArg(); }
      else break;
    }
    var base = atoms.pop();
    // 連続するプライムなどはそのまま base に含まれる
    atoms.push(withScripts(base, sup, sub));
  };

  Parser.prototype.readDelim = function () {
    this.skipWs();
    var s = this.s, c = s.charAt(this.i);
    if (c === '\\') {
      this.i++;
      var name = this.readCommandName();
      if (name === '{') return '{';
      if (name === '}') return '}';
      if (name === '|') return '‖';
      this.err('\\left / \\right の区切り記号が不正: \\' + name);
      return '';
    }
    this.i++;
    if (c === '.') return '';
    if ('()[]|'.indexOf(c) >= 0) return c;
    this.err('\\left / \\right の区切り記号が不正: ' + c);
    return esc(c);
  };

  Parser.prototype.environment = function (name) {
    var self = this, s = this.s;
    var endTag = '\\end{' + name + '}';
    var rows = [[]], cell = [];
    function stop(p) {
      var c = p.s.charAt(p.i);
      if (c === '&') return true;
      if (c === '\\') {
        if (p.s.charAt(p.i + 1) === '\\') return true;
        if (p.s.lastIndexOf(endTag, p.i) === p.i) return true;
      }
      return false;
    }
    for (;;) {
      cell = this.parseUntil(stop);
      rows[rows.length - 1].push(join(cell));
      if (this.i >= s.length) { this.err('\\end{' + name + '} がありません'); break; }
      if (s.charAt(this.i) === '&') { this.i++; continue; }
      if (s.charAt(this.i + 1) === '\\') { this.i += 2; rows.push([]); continue; }
      this.i += endTag.length;
      break;
    }
    // 末尾の空行を除去
    while (rows.length > 1 && rows[rows.length - 1].every(function (c2) { return c2 === ''; })) rows.pop();
    var html = '';
    if (name === 'cases') {
      html = '<span class="mcases" style="--rows:' + rows.length + '"><span class="mcases-brace">{</span><span class="mcases-rows">';
      rows.forEach(function (r) {
        html += '<span class="mcases-row"><span class="mcases-v">' + (r[0] || '') + '</span>' +
          (r.length > 1 ? '<span class="mcases-c">' + r.slice(1).join(' ') + '</span>' : '') + '</span>';
      });
      html += '</span></span>';
    } else if (name === 'aligned') {
      html = '<span class="maligned">';
      rows.forEach(function (r) {
        html += '<span class="maligned-row"><span class="maligned-l">' + (r[0] || '') + '</span><span class="maligned-r">' +
          r.slice(1).join('') + '</span></span>';
      });
      html += '</span>';
    } else if (name === 'pmatrix') {
      html = '<span class="mlr tall" style="--rows:' + rows.length + '"><span class="mld">(</span><span class="mmatrix">';
      rows.forEach(function (r) {
        html += '<span class="mmatrix-row">';
        r.forEach(function (c3) { html += '<span class="mmatrix-c">' + c3 + '</span>'; });
        html += '</span>';
      });
      html += '</span><span class="mrd">)</span></span>';
    } else {
      self.err('未対応の環境: ' + name);
      html = '<span class="merr">' + esc(name) + '</span>';
    }
    return atom(html, 'ord');
  };

  Parser.prototype.command = function (atoms) {
    var s = this.s;
    var name = this.readCommandName();
    if (name === '') { this.err('末尾に \\ があります'); return; }
    var a, b, html;
    if (IGNORE[name]) return;
    if (ALIAS[name]) {
      name = ALIAS[name];
      if (name.length === 1 && '<>|*'.indexOf(name) >= 0) { atoms.push(this.charAtom(name, atoms)); return; }
    }

    if (name === 'frac' || name === 'dfrac') {
      a = this.readArg(); b = this.readArg();
      atoms.push(atom('<span class="mfrac"><span class="mfrac-n">' + a + '</span><span class="mfrac-d">' + b + '</span></span>', 'ord'));
      return;
    }
    if (name === 'sqrt') {
      var idx = '';
      this.skipWs();
      if (s.charAt(this.i) === '[') {
        var close = s.indexOf(']', this.i);
        if (close < 0) { this.err('\\sqrt[ ] が閉じていません'); close = this.i; }
        var sub = new Parser(s.slice(this.i + 1, close));
        idx = join(sub.parseUntil(null));
        this.errors = this.errors.concat(sub.errors);
        this.i = close + 1;
      }
      a = this.readArg();
      html = '<span class="msqrt' + (/mfrac|msqrt/.test(a) ? ' tall' : '') + '">' +
        (idx ? '<span class="msqrt-i">' + idx + '</span>' : '') +
        '<span class="msqrt-s">√</span><span class="msqrt-b">' + a + '</span></span>';
      atoms.push(atom(html, 'ord'));
      return;
    }
    if (GREEK[name]) {
      atoms.push(atom(UPRIGHT_GREEK[name] || this.upright ? '<span class="mrm">' + GREEK[name] + '</span>' : '<i class="mi mg">' + GREEK[name] + '</i>', 'ord'));
      return;
    }
    if (BIN[name]) {
      if ((name === 'pm' || name === 'mp') && isUnaryContext(atoms)) atoms.push(atom('<span class="mu">' + BIN[name] + '</span>', 'ord'));
      else atoms.push(atom('<span class="mo">' + BIN[name] + '</span>', 'bin'));
      return;
    }
    if (REL[name]) { atoms.push(atom('<span class="mrel">' + REL[name] + '</span>', 'rel')); return; }
    if (ORD[name]) { atoms.push(atom('<span class="mord">' + ORD[name] + '</span>', 'ord')); return; }
    if (FUNCS[name]) { atoms.push(atom('<span class="mf">' + name + '</span>', 'ord')); return; }
    if (BIGOP[name]) {
      var big = atom(name === 'int' ? '<span class="mint"><span class="mint-sym">∫</span></span>'
        : '<span class="mop"><span class="mop-sym' + (name === 'lim' ? ' mop-lim' : '') + '">' + BIGOP[name] + '</span></span>', 'ord');
      big.big = name; big.sym = BIGOP[name];
      atoms.push(big);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(SPACES, name)) {
      atoms.push(atom('<span class="' + SPACES[name] + '"></span>', 'space'));
      return;
    }
    if (DECOR[name]) {
      a = this.readArg();
      atoms.push(atom('<span class="' + DECOR[name] + '">' + a + '</span>', 'ord'));
      return;
    }
    if (name === 'text') {
      atoms.push(atom('<span class="mtext">' + esc(this.readRawGroup()) + '</span>', 'ord'));
      return;
    }
    if (name === 'mathrm' || name === 'mathbf') {
      this.upright++;
      a = this.readArg();
      this.upright--;
      atoms.push(atom('<span class="' + (name === 'mathbf' ? 'mbf' : 'mrmg') + '">' + a + '</span>', 'ord'));
      return;
    }
    if (name === 'C' || name === 'P' || name === 'H') {
      a = this.readArg(); b = this.readArg();
      atoms.push(atom('<span class="mcomb"><sub class="msub">' + a + '</sub><span class="mrm">' + name + '</span><sub class="msub">' + b + '</sub></span>', 'ord'));
      return;
    }
    if (name === 'left') {
      var ld = this.readDelim();
      var inner = this.parseUntil(function (p) { return p.s.lastIndexOf('\\right', p.i) === p.i; });
      var rd = '';
      if (s.lastIndexOf('\\right', this.i) === this.i) { this.i += 6; rd = this.readDelim(); }
      else this.err('\\right がありません');
      var innerHtml = join(inner);
      var tall = /mfrac|mcases|mmatrix|mop-hi|mint-lim/.test(innerHtml);
      atoms.push(atom('<span class="mlr' + (tall ? ' tall' : '') + '"><span class="mld">' + esc(ld) + '</span>' + innerHtml +
        '<span class="mrd">' + esc(rd) + '</span></span>', 'ord'));
      return;
    }
    if (name === 'right') { this.err('対応する \\left がありません'); return; }
    if (name === 'begin') {
      var env = this.readRawGroup();
      atoms.push(this.environment(env));
      return;
    }
    if (name === 'end') { this.err('対応する \\begin がありません'); this.readRawGroup(); return; }
    if (name === '{' || name === '}') { atoms.push(atom(name, name === '{' ? 'open' : 'ord')); return; }
    if (name === '|') { atoms.push(atom('‖', 'ord')); return; }
    if (name === '\\') { atoms.push(atom('<span class="mbr"></span>', 'sep')); return; }
    if (name === '$' || name === '%' || name === '&' || name === '#' || name === '_') { atoms.push(atom(esc(name), 'ord')); return; }
    this.err('未対応のコマンド: \\' + name);
    atoms.push(atom('<span class="merr">\\' + esc(name) + '</span>', 'ord'));
  };

  // stop(p) が true になるまで（または末尾まで）読む
  Parser.prototype.parseUntil = function (stop) {
    var atoms = [], s = this.s;
    while (this.i < s.length) {
      if (stop && stop(this)) break;
      var c = s.charAt(this.i);
      if (/\s/.test(c)) { this.i++; continue; }
      if (c === '{') {
        this.i++;
        var innerAtoms = this.parseUntil(function (p) { return p.s.charAt(p.i) === '}'; });
        if (s.charAt(this.i) === '}') this.i++; else this.err('} が足りません');
        atoms.push(atom(join(innerAtoms), 'ord'));
        continue;
      }
      if (c === '}') { this.err('余分な } があります'); this.i++; continue; }
      if (c === '^' || c === '_') { this.scripts(atoms); continue; }
      if (c === '\\') { this.i++; this.command(atoms); continue; }
      if (c === '&') { this.err('& は aligned / cases の中でのみ使えます'); this.i++; continue; }
      if (/[0-9]/.test(c)) {
        var j = this.i;
        while (j < s.length && /[0-9.]/.test(s.charAt(j))) j++;
        // 文末のピリオドは数に含めない
        if (s.charAt(j - 1) === '.') j--;
        atoms.push(atom('<span class="mn">' + s.slice(this.i, j) + '</span>', 'ord'));
        this.i = j;
        continue;
      }
      if (c.charCodeAt(0) > 0x2E7F || /[^\x00-\x7F]/.test(c) && !/[α-ωΑ-Ω]/.test(c)) {
        // 日本語など: 立体テキストとしてまとめる
        var k = this.i;
        while (k < s.length && /[^\x00-\x7F]/.test(s.charAt(k))) k++;
        atoms.push(atom('<span class="mtext">' + esc(s.slice(this.i, k)) + '</span>', 'ord'));
        this.i = k;
        continue;
      }
      this.i++;
      atoms.push(this.charAtom(c, atoms));
    }
    return atoms;
  };

  function renderTex(tex, display) {
    var p = new Parser(String(tex == null ? '' : tex));
    var atoms = p.parseUntil(null);
    var html = join(atoms);
    return {
      html: display ? '<div class="mx-d"><span class="mx">' + html + '</span></div>' : '<span class="mx">' + html + '</span>',
      errors: p.errors
    };
  }

  JK.tex = {
    render: function (tex, display) { return renderTex(tex, display).html; },
    check: function (tex) { return renderTex(tex, false).errors; }
  };

  /* ---------- リッチテキスト（$数式$・**太字**・__下線__・改行） ---------- */

  function richParse(str) {
    str = String(str == null ? '' : str);
    var out = '', buf = '', i = 0, n = str.length, errors = [];
    // ** と __ は数式（$…$）をまたいでも効くよう、開閉の状態を文字列全体で持つ
    var bold = false, under = false;
    function textHtml(s) {
      var h = esc(s);
      h = h.replace(/\*\*/g, function () { bold = !bold; return bold ? '<strong>' : '</strong>'; });
      h = h.replace(/__/g, function () { under = !under; return under ? '<u>' : '</u>'; });
      h = h.replace(/\r?\n[ \t]*\r?\n/g, '<span class="pbreak"></span>').replace(/\r?\n/g, '<br>');
      return h;
    }
    while (i < n) {
      var ch = str.charAt(i);
      if (ch === '\\' && str.charAt(i + 1) === '$') { buf += '$'; i += 2; continue; }
      if (ch === '$') {
        var dbl = str.charAt(i + 1) === '$';
        var start = i + (dbl ? 2 : 1), end = -1, j = start;
        while (j < n) {
          if (str.charAt(j) === '\\') { j += 2; continue; }
          if (str.charAt(j) === '$' && (!dbl || str.charAt(j + 1) === '$')) { end = j; break; }
          j++;
        }
        if (end < 0) { errors.push('$ が閉じていません'); buf += '$'; i++; continue; }
        out += textHtml(buf); buf = '';
        var r = renderTex(str.slice(start, end), dbl);
        out += r.html;
        errors = errors.concat(r.errors);
        i = end + (dbl ? 2 : 1);
        continue;
      }
      buf += ch; i++;
    }
    out += textHtml(buf);
    if (under) out += '</u>';
    if (bold) out += '</strong>';
    return { html: out, errors: errors };
  }

  JK.rich = function (str) { return richParse(str).html; };
  JK.richCheck = function (str) { return richParse(str).errors; };

  /* ---------- 英語長文（{bN:語} 空所 / {uN:語句} 下線） ---------- */

  var MARK = /\{([bu])(\d+):([^{}]*)\}/g;
  JK.passage = {
    // 印を外した英文（和訳ツールの翻訳メモリ用）
    plain: function (en) { return String(en).replace(MARK, '$3'); },
    // 文中の印一覧 [{type:'b'|'u', n, text}]
    marks: function (en) {
      var out = [], m;
      MARK.lastIndex = 0;
      while ((m = MARK.exec(String(en)))) out.push({ type: m[1], n: Number(m[2]), text: m[3] });
      return out;
    },
    // 1 文を HTML に。reveal=true で空所に正解を表示
    sentenceHtml: function (en, reveal) {
      var s = String(en), out = '', last = 0, m;
      MARK.lastIndex = 0;
      while ((m = MARK.exec(s))) {
        out += esc(s.slice(last, m.index));
        if (m[1] === 'b') {
          out += reveal
            ? '<span class="p-fill"><span class="p-no">' + m[2] + '</span>' + esc(m[3]) + '</span>'
            : '<span class="p-blank">(&nbsp;' + m[2] + '&nbsp;)</span>';
        } else {
          out += '<span class="p-u"><span class="p-no">(' + m[2] + ')</span>' + esc(m[3]) + '</span>';
        }
        last = m.index + m[0].length;
      }
      out += esc(s.slice(last));
      return out;
    },
    // 長文全体を HTML に。opts: { reveal, ja（対訳を併記）}
    html: function (p, opts) {
      opts = opts || {};
      var h = '';
      (p.paras || []).forEach(function (para, pi) {
        h += '<p class="p-para"><span class="p-pn">' + (pi + 1) + '</span>';
        para.forEach(function (st) {
          h += '<span class="p-sent">' + JK.passage.sentenceHtml(st.en, opts.reveal) + '</span> ';
        });
        h += '</p>';
        if (opts.ja) {
          h += '<p class="p-ja">';
          para.forEach(function (st) { h += esc(st.ja); });
          h += '</p>';
        }
      });
      return h;
    },
    wordCount: function (p) {
      var n = 0;
      (p.paras || []).forEach(function (para) {
        para.forEach(function (st) {
          var w = JK.passage.plain(st.en).match(/[A-Za-z0-9'’-]+/g);
          n += w ? w.length : 0;
        });
      });
      return n;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
