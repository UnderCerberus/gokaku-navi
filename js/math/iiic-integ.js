/* 数III — 積分法
   基本関数の定積分 / 置換積分 / 部分積分 / 分数関数の積分 / 面積と回転体の体積 / 区分求積法
   構成は ia-quad.js に準拠（intro → result → steps(easy/pro/lv) → fig）。
   未習者（高1・高2）向けに、各計算機の冒頭に lv:3 の「そもそも〜とは」ステップを置く。
   e・π・√・log を含む値は iiic-diff.js と同じ方式の厳密値 V（c·√r·π^k·e^(p+qπ)·記号 の和）で表し、表せない場合は近似値に切り替える。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, P = JK.poly, U = JK.util;

  /* ================= 表示の共通ヘルパー ================= */

  function fin(x) { return typeof x === 'number' && isFinite(x); }
  const SUPS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(s) { return String(s).split('').map((c) => SUPS[c] || c).join(''); }
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
  function num(x, sig) {
    if (!fin(x)) return U.fmt(x);
    sig = sig || 7;
    const ax = Math.abs(x);
    if (ax === 0) return '0';
    if (ax >= 1e7 || ax < 1e-4) return U.sig(x, sig - 1);
    return U.fmt(x, Math.min(10, Math.max(0, sig - 1 - Math.floor(Math.log10(ax)))));
  }
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
  function vpow(v, k) { return k === 0 ? '1' : (k === 1 ? v : v + '^{' + k + '}'); }
  function mono(c, e, v) {
    const a = c.abs();
    let body;
    if (e === 0) body = a.tex();
    else if (e > 0) body = (a.eq(1) ? '' : a.tex()) + vpow(v, e);
    else body = R`\frac{` + a.n + '}{' + (a.d === 1 ? '' : a.d) + vpow(v, -e) + '}';
    return { neg: c.sign() < 0, body: body };
  }
  function sumTex(items) {
    items = items.filter(Boolean);
    if (!items.length) return '0';
    return items.map((t, i) => (i === 0 ? (t.neg ? '-' : '') : (t.neg ? ' - ' : ' + ')) + t.body).join('');
  }
  function termCount(p) { return p.filter((c) => !c.isZero()).length; }
  function polyItems(p) {
    const out = [];
    for (let k = p.length - 1; k >= 0; k--) if (!p[k].isZero()) out.push(mono(p[k], k, 'x'));
    return out;
  }
  function xMinus(a) { return a.isZero() ? 'x' : (a.sign() > 0 ? 'x - ' + a.tex() : 'x + ' + a.neg().tex()); }

  /* ================= 厳密値 V（iiic-diff.js と同じ方式） ================= */

  const SYM = {}, SYMTXT = {};
  function sym(tex, val, txt) { SYM[tex] = val; SYMTXT[tex] = txt || tex; return tex; }
  function T(c, r, pk, ep, eq, s) { return { c: c, r: r || 1, pk: pk || 0, ep: ep || Q(0), eq: eq || Q(0), s: s || [] }; }
  function plainT(t) { return t.r === 1 && t.pk === 0 && t.ep.isZero() && t.eq.isZero() && !t.s.length; }
  function tkey(t) { return t.r + '|' + t.pk + '|' + t.ep.toString() + '|' + t.eq.toString() + '|' + t.s.join(';'); }
  function tval(t) {
    let v = t.c.val() * Math.sqrt(t.r) * Math.pow(Math.PI, t.pk) * Math.exp(t.ep.val() + t.eq.val() * Math.PI);
    t.s.forEach((k) => { v *= SYM[k]; });
    return v;
  }
  function norm(list) {
    const out = [], idx = {};
    list.forEach((t) => {
      const k = tkey(t);
      if (Object.prototype.hasOwnProperty.call(idx, k)) { const o = out[idx[k]]; out[idx[k]] = T(o.c.add(t.c), o.r, o.pk, o.ep, o.eq, o.s); }
      else { idx[k] = out.length; out.push(t); }
    });
    return out.filter((t) => !t.c.isZero());
  }
  function V(t, ax) { this.t = t || []; this.ax = ax == null ? null : ax; }
  function guard(fx, fn) {
    try { const r = fx(); return (r.ax === null && r.t.length > 8) ? V.num(fn()) : r; }
    catch (e) { if (e instanceof JK.CalcError) return V.num(fn()); throw e; }
  }
  V.num = (x) => new V(null, x);
  V.q = (q) => { q = q instanceof Q ? q : Q(q); return new V(q.isZero() ? [] : [T(q)]); };
  V.of = (x) => (x instanceof V ? x : (x instanceof Q ? V.q(x) : (Number.isInteger(x) && Math.abs(x) < 1e15 ? V.q(Q(x)) : V.num(x))));
  V.pi = (q) => { q = q instanceof Q ? q : Q(q); return new V(q.isZero() ? [] : [T(q, 1, 1)]); };
  V.e = (p, q) => new V([T(Q(1), 1, 0, p instanceof Q ? p : Q(p), q == null ? Q(0) : (q instanceof Q ? q : Q(q)))]);
  V.sym = (tex, val, txt) => new V([T(Q(1), 1, 0, Q(0), Q(0), [sym(tex, val, txt)])]);
  V.sqrt = (q) => {
    q = q instanceof Q ? q : Q(q);
    if (q.sign() < 0) return V.num(NaN);
    if (q.isZero()) return V.q(0);
    if (q.n * q.d > 1e12) return V.num(Math.sqrt(q.val()));
    const s = U.sqrtSimplify(q.n * q.d);
    return new V([T(Q(s.out, q.d), s.in)]);
  };
  const VP = V.prototype;
  VP.exact = function () { return this.ax === null; };
  VP.val = function () { return this.ax !== null ? this.ax : this.t.reduce((s, t) => s + tval(t), 0); };
  VP.add = function (o) {
    o = V.of(o);
    const a = this;
    if (!a.exact() || !o.exact()) return V.num(a.val() + o.val());
    return guard(() => new V(norm(a.t.concat(o.t))), () => a.val() + o.val());
  };
  VP.neg = function () { return this.exact() ? new V(this.t.map((t) => T(t.c.neg(), t.r, t.pk, t.ep, t.eq, t.s))) : V.num(-this.ax); };
  VP.sub = function (o) { return this.add(V.of(o).neg()); };
  VP.mul = function (o) {
    o = V.of(o);
    const a = this;
    if (!a.exact() || !o.exact()) return V.num(a.val() * o.val());
    return guard(() => {
      const out = [];
      a.t.forEach((x) => o.t.forEach((y) => {
        const rr = x.r * y.r;
        if (rr > 1e12) throw new JK.CalcError('big');
        const s = U.sqrtSimplify(rr);
        out.push(T(x.c.mul(y.c).mul(s.out), s.in, x.pk + y.pk, x.ep.add(y.ep), x.eq.add(y.eq), x.s.concat(y.s).sort()));
      }));
      return new V(norm(out));
    }, () => a.val() * o.val());
  };
  VP.isZero = function () { return this.exact() ? this.t.length === 0 : Math.abs(this.ax) < 1e-12; };
  VP.isQ = function () { return this.exact() && (this.t.length === 0 || (this.t.length === 1 && plainT(this.t[0]))); };
  VP.q = function () { return this.t.length ? this.t[0].c : Q(0); };
  VP.single = function () { return this.exact() && this.t.length === 1; };
  VP.sign = function () { if (this.isZero()) return 0; return this.val() > 0 ? 1 : -1; };
  VP.inv = function () {
    if (this.isZero()) throw new JK.CalcError('0 で割ることはできません');
    const a = this;
    if (a.single() && !a.t[0].s.length) {
      const t = a.t[0];
      return guard(() => new V([T(t.c.mul(t.r).inv(), t.r, -t.pk, t.ep.neg(), t.eq.neg())]), () => 1 / a.val());
    }
    return V.num(1 / a.val());
  };
  VP.div = function (o) { return this.mul(V.of(o).inv()); };
  function ordered(ts) {
    if (ts.length > 1 && ts[0].c.sign() < 0) {
      const i = ts.findIndex((t) => t.c.sign() > 0);
      if (i > 0) return [ts[i]].concat(ts.slice(0, i), ts.slice(i + 1));
    }
    return ts;
  }
  function piQTex(q) {
    if (q.eq(1)) return R`\pi`;
    if (q.eq(-1)) return R`-\pi`;
    const a = q.abs(), sg = q.sign() < 0 ? '-' : '';
    if (a.d === 1) return sg + a.n + R`\pi`;
    return sg + R`\frac{` + (a.n === 1 ? '' : a.n) + R`\pi}{` + a.d + '}';
  }
  function piQTxt(q) {
    if (q.eq(1)) return 'π';
    if (q.eq(-1)) return '-π';
    const a = q.abs(), sg = q.sign() < 0 ? '-' : '';
    return sg + (a.n === 1 ? '' : a.n) + 'π' + (a.d === 1 ? '' : '/' + a.d);
  }
  function eTex(p, q) {
    if (q.isZero()) {
      if (p.eq(1)) return 'e';
      if (p.eq(Q(1, 2))) return R`\sqrt{e}`;
      return 'e^{' + p.tex() + '}';
    }
    if (p.isZero()) return 'e^{' + piQTex(q) + '}';
    return 'e^{' + p.tex() + (q.sign() < 0 ? ' - ' + piQTex(q.neg()) : ' + ' + piQTex(q)) + '}';
  }
  function eTxt(p, q) {
    if (q.isZero()) {
      if (p.eq(1)) return 'e';
      if (p.eq(Q(1, 2))) return '√e';
      if (p.isInt()) return 'e' + sup(p.n);
      return 'e^(' + p.toString() + ')';
    }
    if (p.isZero()) return 'e^(' + piQTxt(q) + ')';
    return 'e^(' + p.toString() + (q.sign() < 0 ? '' : '+') + piQTxt(q) + ')';
  }
  function tbody(t, tex) {
    const c = t.c.abs(), numF = [], denF = [];
    if (t.r !== 1) numF.push(tex ? R`\sqrt{` + t.r + '}' : '√' + t.r);
    if (t.pk > 0) numF.push(tex ? (t.pk === 1 ? R`\pi` : R`\pi^{` + t.pk + '}') : 'π' + (t.pk === 1 ? '' : sup(t.pk)));
    if (t.pk < 0) denF.push(tex ? (t.pk === -1 ? R`\pi` : R`\pi^{` + (-t.pk) + '}') : 'π' + (t.pk === -1 ? '' : sup(-t.pk)));
    if (!t.ep.isZero() || !t.eq.isZero()) {
      if (t.eq.isZero() && t.ep.sign() < 0) denF.push(tex ? eTex(t.ep.neg(), Q(0)) : eTxt(t.ep.neg(), Q(0)));
      else numF.push(tex ? eTex(t.ep, t.eq) : eTxt(t.ep, t.eq));
    }
    const cnt = {}, order = [];
    t.s.forEach((k) => { if (!cnt[k]) { cnt[k] = 0; order.push(k); } cnt[k]++; });
    order.forEach((k) => {
      const s = tex ? k : SYMTXT[k];
      numF.push(cnt[k] === 1 ? s : (tex ? R`\left(` + s + R`\right)^{` + cnt[k] + '}' : '(' + s + ')' + sup(cnt[k])));
    });
    if (!numF.length && !denF.length) return tex ? c.tex() : (c.d === 1 ? String(c.n) : c.n + '/' + c.d);
    const nParts = (c.n === 1 && numF.length ? [] : [String(c.n)]).concat(numF);
    const dParts = (c.d === 1 ? [] : [String(c.d)]).concat(denF);
    const joinT = (arr) => (tex ? arr.reduce((s, x, i) => s + (i > 0 ? (/^[0-9]/.test(x) ? R` \cdot ` : ' ') : '') + x, '') : arr.reduce((s, x, i) => s + (i > 0 && /^[a-z]/.test(x) ? ' ' : '') + x, ''));
    const ns = joinT(nParts), ds = joinT(dParts);
    if (!ds) return ns;
    if (tex) return R`\frac{` + ns + '}{' + ds + '}';
    const wrap = (s, n) => (n > 1 ? '(' + s + ')' : s);
    return wrap(ns, nParts.length) + '/' + wrap(ds, dParts.length);
  }
  VP.tex = function () {
    if (!this.exact()) return num(this.ax);
    if (!this.t.length) return '0';
    return ordered(this.t).map((t, i) => { const ng = t.c.sign() < 0; return (i === 0 ? (ng ? '-' : '') : (ng ? ' - ' : ' + ')) + tbody(t, true); }).join('');
  };
  VP.txt = function () {
    if (!this.exact()) return plain(this.ax, 3);
    if (!this.t.length) return '0';
    return ordered(this.t).map((t, i) => { const ng = t.c.sign() < 0; return (i === 0 ? (ng ? '-' : '') : (ng ? ' - ' : ' + ')) + tbody(t, false); }).join('');
  };
  // 関数の引数としての TeX
  function argTex(x) {
    const s = x.tex();
    return (x.single() && x.sign() > 0) ? ' ' + s : R`\left(` + s + R`\right)`;
  }
  function piMult(x) {
    if (x.isZero()) return Q(0);
    if (!x.single()) return null;
    const t = x.t[0];
    return (t.r === 1 && t.pk === 1 && t.ep.isZero() && t.eq.isZero() && !t.s.length) ? t.c : null;
  }
  function sinTab(k) {
    switch (k) {
      case 0: return V.q(0);
      case 1: return V.sqrt(Q(6)).sub(V.sqrt(Q(2))).mul(V.q(Q(1, 4)));
      case 2: return V.q(Q(1, 2));
      case 3: return V.sqrt(Q(1, 2));
      case 4: return V.sqrt(Q(3, 4));
      case 5: return V.sqrt(Q(6)).add(V.sqrt(Q(2))).mul(V.q(Q(1, 4)));
      default: return V.q(1);
    }
  }
  function sinPi(q) {
    const k12 = q.mul(12);
    if (!k12.isInt()) return null;
    let k = ((k12.n % 24) + 24) % 24, sg = 1;
    if (k >= 12) { k -= 12; sg = -1; }
    if (k > 6) k = 12 - k;
    const v = sinTab(k);
    return sg < 0 ? v.neg() : v;
  }
  function tanPi(q) {
    const k12 = q.mul(12);
    if (!k12.isInt()) return null;
    let k = ((k12.n % 12) + 12) % 12, sg = 1;
    if (k > 6) { k = 12 - k; sg = -1; }
    let v;
    switch (k) {
      case 0: v = V.q(0); break;
      case 1: v = V.q(2).sub(V.sqrt(Q(3))); break;
      case 2: v = V.sqrt(Q(1, 3)); break;
      case 3: v = V.q(1); break;
      case 4: v = V.sqrt(Q(3)); break;
      case 5: v = V.q(2).add(V.sqrt(Q(3))); break;
      default: return 'undef';
    }
    return sg < 0 ? v.neg() : v;
  }
  function trigSym(name, x) {
    const v = name === 'sin' ? Math.sin(x.val()) : (name === 'cos' ? Math.cos(x.val()) : Math.tan(x.val()));
    return V.sym('\\' + name + argTex(x), v, name + ' ' + x.txt());
  }
  V.sin = (x) => {
    x = V.of(x);
    if (x.isZero()) return V.q(0);
    if (x.exact() && x.sign() < 0) return V.sin(x.neg()).neg();
    const q = piMult(x);
    if (q) { const v = sinPi(q); return v || trigSym('sin', x); }
    if (x.isQ()) return trigSym('sin', x);
    return V.num(Math.sin(x.val()));
  };
  V.cos = (x) => {
    x = V.of(x);
    if (x.isZero()) return V.q(1);
    if (x.exact() && x.sign() < 0) return V.cos(x.neg());
    const q = piMult(x);
    if (q) { const v = sinPi(q.add(Q(1, 2))); return v || trigSym('cos', x); }
    if (x.isQ()) return trigSym('cos', x);
    return V.num(Math.cos(x.val()));
  };
  V.tan = (x) => {
    x = V.of(x);
    if (x.isZero()) return V.q(0);
    if (x.exact() && x.sign() < 0) return V.tan(x.neg()).neg();
    const q = piMult(x);
    if (q) {
      const v = tanPi(q);
      if (v === 'undef') throw new JK.CalcError('tan が定義されない点（cos = 0 となる点）です');
      return v || trigSym('tan', x);
    }
    if (x.isQ()) return trigSym('tan', x);
    return V.num(Math.tan(x.val()));
  };
  V.exp = (x) => {
    x = V.of(x);
    if (x.isZero()) return V.q(1);
    if (x.exact()) {
      let p = Q(0), q = Q(0), ok = true;
      x.t.forEach((t) => {
        if (plainT(t)) p = p.add(t.c);
        else if (piMult(new V([t]))) q = q.add(t.c);
        else ok = false;
      });
      if (ok) return V.e(p, q);
    }
    return V.num(Math.exp(x.val()));
  };
  V.logQ = (q) => {
    if (q.sign() <= 0) throw new JK.CalcError('log の真数は正でなければなりません');
    if (q.eq(1)) return V.q(0);
    if (q.n > 1e12 || q.d > 1e12) return V.sym(R`\log ` + q.tex(), Math.log(q.val()), 'log ' + q.toString());
    const out = [];
    const add = (n, sg) => U.primeFactors(n).forEach((pe) => out.push(T(Q(sg * pe[1]), 1, 0, Q(0), Q(0), [sym(R`\log ` + pe[0], Math.log(pe[0]), 'log ' + pe[0])])));
    add(q.n, 1); add(q.d, -1);
    return new V(norm(out));
  };
  V.ln = (x) => {
    x = V.of(x);
    if (!(x.val() > 0)) throw new JK.CalcError('log の真数は正でなければなりません');
    if (x.single() && !x.t[0].s.length) {
      const t = x.t[0];
      let v = V.logQ(t.c);
      if (t.r !== 1) v = v.add(V.logQ(Q(t.r)).mul(V.q(Q(1, 2))));
      if (t.pk) v = v.add(V.sym(R`\log\pi`, Math.log(Math.PI), 'log π').mul(V.q(t.pk)));
      return v.add(V.q(t.ep)).add(V.pi(t.eq));
    }
    return V.num(Math.log(x.val()));
  };
  V.pow = (x, k) => {
    x = V.of(x);
    k = k instanceof Q ? k : Q(k);
    if (k.isZero()) return V.q(1);
    if (x.isZero() && x.exact()) {
      if (k.sign() > 0) return V.q(0);
      throw new JK.CalcError('0 で割ることはできません');
    }
    if (k.isInt() && Math.abs(k.n) <= 12) {
      let r = V.q(1);
      for (let i = 0; i < Math.abs(k.n); i++) r = r.mul(x);
      return k.n < 0 ? r.inv() : r;
    }
    if (x.single() && !x.t[0].s.length && x.t[0].c.sign() > 0) {
      const t = x.t[0];
      if (t.c.eq(1) && t.r === 1 && t.pk === 0) return V.e(t.ep.mul(k), t.eq.mul(k));
      if (plainT(t) && k.d === 2 && Math.abs(k.n) <= 12) {
        let r = V.q(1);
        const s = V.sqrt(t.c);
        for (let i = 0; i < Math.abs(k.n); i++) r = r.mul(s);
        return k.n < 0 ? r.inv() : r;
      }
      if (plainT(t) && k.d <= 12 && Math.abs(k.n) <= 60) {
        // 完全累乗なら有理数のまま（8^(4/3) = 16 など）
        const rn = Math.round(Math.pow(t.c.n, 1 / k.d)), rd = Math.round(Math.pow(t.c.d, 1 / k.d));
        if (Math.pow(rn, k.d) === t.c.n && Math.pow(rd, k.d) === t.c.d) return guard(() => V.q(Q(rn, rd).pow(k.n)), () => Math.pow(t.c.val(), k.val()));
      }
      if (plainT(t)) {
        const base = t.c.isInt() ? t.c.tex() : R`\left(` + t.c.tex() + R`\right)`;
        return V.sym(base + '^{' + k.tex() + '}', Math.pow(t.c.val(), k.val()), (t.c.isInt() ? t.c.toString() : '(' + t.c.toString() + ')') + '^(' + k.toString() + ')');
      }
    }
    const xv = x.val();
    if (xv < 0 && !k.isInt()) return V.num(NaN);
    return V.num(Math.pow(xv, k.val()));
  };
  // 入力された数（π/6, e, 3/4, √2 など）を厳密値に
  function exactOf(x) {
    if (!fin(x)) return V.num(x);
    const q = Q.from(x);
    if (q && q.d <= 10000 && Math.abs(q.val() - x) <= 1e-12 * Math.max(1, Math.abs(x))) return V.q(q);
    const qp = Q.from(x / Math.PI);
    if (qp && qp.d <= 24 && Math.abs(qp.val() * Math.PI - x) <= 1e-10 * Math.max(1, Math.abs(x))) return V.pi(qp);
    if (x > 0) {
      const qe = Q.from(Math.log(x));
      if (qe && qe.d <= 6 && Math.abs(qe.n) <= 60 && Math.abs(Math.exp(qe.val()) - x) <= 1e-10 * x) return V.e(qe, Q(0));
    }
    const q2 = Q.from(x * x);
    if (q2 && q2.d <= 1000 && q2.n <= 1e6 && Math.abs(q2.val() - x * x) <= 1e-10 * Math.max(1, x * x)) {
      const r = V.sqrt(q2);
      if (r.exact()) return x < 0 ? r.neg() : r;
    }
    return V.num(x);
  }
  function pevalV(p, x) {
    x = V.of(x);
    if (x.isQ()) { const xq = x.q(); return guard(() => V.q(P.eval(p, xq)), () => P.eval(p, x.val())); }
    let r = V.q(0);
    for (let i = p.length - 1; i >= 0; i--) r = r.mul(x).add(V.q(p[i]));
    return r;
  }
  // 「= 厳密値 ≒ 近似値」
  function approxTail(v) { return v.isQ() || !v.exact() ? '' : R` \fallingdotseq ` + num(v.val()); }
  function eqv(v) { return v.exact() ? ' = ' + v.tex() + approxTail(v) : R` \fallingdotseq ` + num(v.ax); }
  // 代入表示用（負・多項なら括弧）
  function pv(v) {
    if (!v.exact()) return v.ax < 0 ? R`\left(` + num(v.ax) + R`\right)` : num(v.ax);
    if (v.isZero()) return '0';
    return (v.single() && v.t[0].c.sign() > 0) ? v.tex() : R`\left(` + v.tex() + R`\right)`;
  }

  /* ================= 積分用の小道具 ================= */

  function cf(q) { return q.eq(1) ? '' : (q.eq(-1) ? '-' : q.tex()); }
  function kxT(k) { return P.tex([Q(0), k]); }
  function fnArg(t) { return t.charAt(0) === '-' ? R`\left(` + t + R`\right)` : ' ' + t; }
  function vabs(x) { return x.sign() < 0 ? x.neg() : x; }
  function powBase(X) { const s = X.tex(); return (/^[0-9]+$/.test(s) || s === R`\pi` || s === 'e') ? s : R`\left(` + s + R`\right)`; }
  function powT(v, e) { if (e.isZero()) return '1'; return e.eq(1) ? v : v + '^{' + e.tex() + '}'; }
  // {g}^n（g は TeX。1 文字なら括弧なし）
  function powG(gT, n) {
    if (n.isZero()) return '1';
    if (n.sign() < 0) return R`\frac{1}{` + powG(gT, n.neg()) + '}';
    if (n.eq(1)) return gT;
    if (n.eq(Q(1, 2))) return R`\sqrt{` + gT + '}';
    const base = /^[a-z]$/.test(gT) ? gT : R`\left(` + gT + R`\right)`;
    return base + '^{' + n.tex() + '}';
  }
  // 代入表示用の X^m
  function powX(X, m) {
    if (m.sign() < 0) return R`\frac{1}{` + powX(X, m.neg()) + '}';
    if (m.eq(1)) return pv(X);
    if (m.eq(Q(1, 2))) return R`\sqrt{` + X.tex() + '}';
    return powBase(X) + '^{' + m.tex() + '}';
  }
  // 係数 c と因子の TeX から項 {neg, body}（sub=true は代入表示用で「・」でつなぐ）
  function itemT(c, factors, sub) {
    const a = c.abs();
    let body;
    if (sub) body = (a.eq(1) && factors.length ? [] : [a.tex()]).concat(factors).join(R` \cdot `);
    else body = (a.eq(1) && factors.length ? '' : a.tex()) + factors.join('');
    return { neg: c.sign() < 0, body: body };
  }
  // 掛け算の因子としての多項式（1 → 空、-1 → '-'、多項 → 括弧）
  function polyFactor(p) {
    if (P.deg(p) === 0) return cf(p[0]);
    return termCount(p) > 1 ? R`\left(` + P.tex(p) + R`\right)` : P.tex(p);
  }
  function needParen(s) { return /^-| [+-] /.test(s); }
  function minusT(s) { return needParen(s) ? R` - \left(` + s + R`\right)` : ' - ' + s; }
  function parenL(s) { return s.charAt(0) === '-' ? R`\left(` + s + R`\right)` : s; }
  function logAbsT(X) { return X.sign() > 0 ? R`\log` + argTex(X) : R`\log\left|` + X.tex() + R`\right|`; }
  // 「= F(b) − F(a)」と「= 結果」（同じ式になるときは 1 行に）
  function tailLines(fbT, faT, I) {
    const l = fbT + minusT(faT);
    return l === I.tex() ? ['= ' + l + approxTail(I)] : ['= ' + l, '= ' + I.tex() + approxTail(I)];
  }
  function intTex(A, B, fT, v) { return R`\int_{` + A.tex() + '}^{' + B.tex() + '} ' + fT + R`\,d` + (v || 'x'); }
  function bracket(FT, A, B) { return R`\left[ ` + FT + R` \right]_{` + A.tex() + '}^{' + B.tex() + '}'; }
  function midSum(f, a, b, n) { const h = (b - a) / n; let s = 0; for (let k = 0; k < n; k++) s += f(a + (k + 0.5) * h); return s * h; }
  function simpson(f, a, b, n) {
    const h = (b - a) / n;
    let s = f(a) + f(b);
    for (let k = 1; k < n; k++) s += (k % 2 ? 4 : 2) * f(a + k * h);
    return s * h / 3;
  }
  function checkRange(a, b, lim) {
    if (!(a < b)) throw new JK.CalcError('下端 < 上端 となるように入力してください（上端 < 下端 のときは、入れかえて −1 倍します）');
    lim = lim || 1000;
    if (Math.abs(a) > lim || Math.abs(b) > lim) throw new JK.CalcError('区間の端は -' + lim + '〜' + lim + ' の範囲で入力してください');
  }
  function checkVal(I) { if (!fin(I.val())) throw new JK.CalcError('値が大きすぎて計算できません。区間や係数を小さくしてください'); }
  // 被積分関数のグラフと、区間 [a, b] の塗り（正: f1 / 負: f2）
  function areaFig(f, a, b, la, lb, extra) {
    const span = b - a;
    return graph(Object.assign({
      x: [a - 0.15 * span, b + 0.15 * span],
      curves: [{ f: f, cls: 'c1' }],
      fills: [{ f: (x) => Math.max(0, f(x)), from: a, to: b, cls: 'f1' }, { f: (x) => Math.min(0, f(x)), from: a, to: b, cls: 'f2' }],
      vlines: [{ x: a, label: la }, { x: b, label: lb }],
      mustY: [0]
    }, extra || {}));
  }
  function signNote(f, a, b) {
    const ys = sample(f, a, b, 400);
    return { pos: ys.some((y) => y > 1e-12), neg: ys.some((y) => y < -1e-12) };
  }
  const STEP0 = {
    m: [R`\int_{a}^{b} f(x)\,dx = \lim_{n \to \infty} \sum_{k=1}^{n} f(x_{k})\,\Delta x`, R`F'(x) = f(x) \;\Rightarrow\; \int_{a}^{b} f(x)\,dx = F(b) - F(a)`],
    n: R`区間 $a \le x \le b$ を $n$ 等分し、幅 $\Delta x$・高さ $f(x_{k})$ の細い長方形の面積を足し合わせ、分け方を限りなく細かくした極限が**定積分**です。実際の計算では、微分すると $f(x)$ になる関数 $F(x)$（**原始関数**）を見つけて $F(b) - F(a)$ を計算します。`
  };

  /* ================= 1. 基本関数の定積分 ================= */

  function powAlt(p) {
    if (p.isInt() && p.n < 0) return R`\frac{1}{` + powT('x', p.neg()) + '}';
    if (p.eq(Q(1, 2))) return R`\sqrt{x}`;
    if (p.eq(Q(-1, 2))) return R`\frac{1}{\sqrt{x}}`;
    if (p.eq(Q(3, 2))) return R`x\sqrt{x}`;
    if (p.eq(Q(1, 3))) return R`\sqrt[3]{x}`;
    return null;
  }

  function basicDef(v) {
    switch (v.fn) {
      case 'exp': {
        const k = v.k;
        if (k.isZero()) throw new JK.CalcError('k は 0 以外を入力してください（k = 0 だと定数 1 の積分になります）');
        const E = 'e^{' + kxT(k) + '}', c = k.inv();
        return {
          fT: E, FT: cf(c) + E, f: (x) => Math.exp(k.val() * x),
          FV: (X) => V.exp(V.q(k).mul(X)).mul(V.q(c)),
          sub: (X) => sumTex([itemT(c, ['e^{' + V.q(k).mul(X).tex() + '}'], true)]),
          rule: [R`\int e^{kx}\,dx = \frac{1}{k}e^{kx} + C`, R`\int ` + E + R`\,dx = ` + cf(c) + E + ' + C'],
          check: k.eq(1) ? [R`\left(e^{x}\right)' = e^{x}`] : [R`\left(` + cf(c) + E + R`\right)' = ` + c.tex() + R` \cdot ` + U.paren(k) + E + ' = ' + E],
          ruleN: R`公式で $k = ` + k.tex() + R`$ とします。`,
          easy: R`$e^{x}$（$e = 2.718\ldots$）は**微分しても形が変わらない**特別な関数です。$e^{kx}$ を微分すると、かたまり $kx$ の微分 $k$ が前に出て $ke^{kx}$ になります（合成関数の微分）。積分ではその $k$ を打ち消すために $\frac{1}{k}$ を掛けます。`,
          pro: R`$\int a^{x}\,dx = \frac{a^{x}}{\log a} + C$（$a > 0,\ a \ne 1$）もセットで覚えておきましょう。`,
          dom: (a, b) => { if (Math.abs(k.val() * a) > 80 || Math.abs(k.val() * b) > 80) throw new JK.CalcError('kx の値が大きすぎます（区間全体で |kx| ≤ 80 となるように入力してください）'); }
        };
      }
      case 'sin': case 'cos': {
        const k = v.k, isSin = v.fn === 'sin';
        if (k.isZero()) throw new JK.CalcError('k は 0 以外を入力してください');
        const kx = kxT(k), SN = R`\sin` + fnArg(kx), CS = R`\cos` + fnArg(kx);
        const c = isSin ? k.inv().neg() : k.inv();
        const FT = cf(c) + (isSin ? CS : SN);
        return {
          fT: isSin ? SN : CS, FT: FT, f: isSin ? (x) => Math.sin(k.val() * x) : (x) => Math.cos(k.val() * x),
          FV: (X) => (isSin ? V.cos(V.q(k).mul(X)) : V.sin(V.q(k).mul(X))).mul(V.q(c)),
          sub: (X) => sumTex([itemT(c, [(isSin ? R`\cos` : R`\sin`) + argTex(V.q(k).mul(X))], true)]),
          rule: isSin
            ? [R`\int \sin kx\,dx = -\frac{1}{k}\cos kx + C`, R`\int ` + SN + R`\,dx = ` + FT + ' + C']
            : [R`\int \cos kx\,dx = \frac{1}{k}\sin kx + C`, R`\int ` + CS + R`\,dx = ` + FT + ' + C'],
          check: isSin
            ? [R`\left(` + FT + R`\right)' = ` + c.tex() + R` \cdot \left(` + cf(k.neg()) + SN + R`\right) = ` + SN]
            : [R`\left(` + FT + R`\right)' = ` + c.tex() + R` \cdot ` + (k.sign() < 0 ? R`\left(` + cf(k) + CS + R`\right)` : cf(k) + CS) + ' = ' + CS],
          ruleN: R`公式で $k = ` + k.tex() + R`$ とします。`,
          easy: isSin
            ? R`$\cos x$ を微分すると $-\sin x$ でした。だから $\sin x$ の原始関数は $-\cos x$ で、**マイナスが付きます**。さらに $\cos kx$ を微分すると $k$ が前に出るので、積分では $\frac{1}{k}$ を掛けて打ち消します。`
            : R`$\sin x$ を微分すると $\cos x$ なので、$\cos x$ の原始関数は $\sin x$ です。$\sin kx$ を微分すると $k$ が前に出るので、積分では $\frac{1}{k}$ を掛けて打ち消します。`,
          pro: isSin
            ? R`$\int_{0}^{\pi}\sin x\,dx = 2$ は検算用に覚えておくと便利です。符号ミス（$-\cos$）が最頻出のミスです。`
            : R`$\int_{0}^{\frac{\pi}{2}}\cos x\,dx = 1$、$\int_{0}^{2\pi}\cos x\,dx = 0$（1 周期分は打ち消し合う）は検算に使えます。`,
          dom: () => {}
        };
      }
      case 'inv': {
        const c = v.c, den = P.tex([c, Q(1)]);
        return {
          fT: R`\frac{1}{` + den + '}', FT: R`\log|` + den + '|', f: (x) => 1 / (x + c.val()),
          FV: (X) => V.ln(vabs(X.add(V.q(c)))),
          sub: (X) => R`\log\left|` + X.tex() + (c.isZero() ? '' : ' ' + U.signed(c)) + R`\right|`,
          rule: [R`\int \frac{1}{x+c}\,dx = \log|x+c| + C`, R`\int \frac{1}{` + den + R`}\,dx = \log|` + den + '| + C'],
          check: [R`\left(\log|` + den + R`|\right)' = \frac{1}{` + den + '}'],
          ruleN: R`公式で $c = ` + c.tex() + R`$ とします。`,
          easy: R`$\log x$ を微分すると $\frac{1}{x}$ でした（$\log$ は $e$ を底とする自然対数）。$\log|x+c|$ を微分しても、かたまり $x + c$ の微分が 1 なので $\frac{1}{x+c}$ のままです。絶対値を付けておくと、$x + c < 0$ の範囲でもこの公式が使えます。`,
          pro: R`分母の微分が分子になっている形 $\int \frac{f'(x)}{f(x)}\,dx = \log|f(x)| + C$ の特別な場合です。`,
          dom: (a, b) => { if ((a + c.val()) * (b + c.val()) <= 0) throw new JK.CalcError('x + c = 0 となる点（x = ' + c.neg().toString() + '）が区間に含まれています。分母が 0 になる点をまたがない区間にしてください'); }
        };
      }
      case 'sec2':
        return {
          fT: R`\frac{1}{\cos^{2} x}`, FT: R`\tan x`, f: (x) => 1 / (Math.cos(x) * Math.cos(x)),
          FV: (X) => V.tan(X),
          sub: (X) => R`\tan` + argTex(X),
          rule: [R`\int \frac{1}{\cos^{2} x}\,dx = \tan x + C`],
          check: [R`\left(\tan x\right)' = \left(\frac{\sin x}{\cos x}\right)' = \frac{\cos x \cdot \cos x - \sin x \cdot (-\sin x)}{\cos^{2} x} = \frac{1}{\cos^{2} x}`],
          ruleN: R`$\tan x$ の導関数を逆向きに使います。`,
          easy: R`$\tan x = \frac{\sin x}{\cos x}$ を商の微分法で微分すると $\frac{\cos^{2} x + \sin^{2} x}{\cos^{2} x} = \frac{1}{\cos^{2} x}$ になります（$\sin^{2} x + \cos^{2} x = 1$）。逆向きに読めば、$\frac{1}{\cos^{2} x}$ の原始関数は $\tan x$ です。`,
          pro: R`$\tan^{2} x = \frac{1}{\cos^{2} x} - 1$ と変形すれば $\int \tan^{2} x\,dx = \tan x - x + C$ も求められます。`,
          dom: (a, b) => {
            const lo = Math.ceil((a - Math.PI / 2) / Math.PI - 1e-9), hi = Math.floor((b - Math.PI / 2) / Math.PI + 1e-9);
            if (lo <= hi) throw new JK.CalcError('cos x = 0 となる点（x = π/2 + nπ）が区間に含まれています。そこでは 1/cos²x が定義されません');
          }
        };
      default: {
        const p = v.p;
        if (Math.abs(p.val()) > 20) throw new JK.CalcError('指数 p は -20〜20 の範囲で入力してください');
        if (p.eq(-1)) {
          return {
            fT: R`\frac{1}{x}`, FT: R`\log|x|`, f: (x) => 1 / x,
            FV: (X) => V.ln(vabs(X)),
            sub: (X) => logAbsT(X),
            rule: [R`\int \frac{1}{x}\,dx = \log|x| + C`],
            check: [R`\left(\log|x|\right)' = \frac{1}{x}`],
            ruleN: R`$p = -1$ は「指数を 1 上げて割る」公式の例外です。`,
            easy: R`$p = -1$ のときは「指数を 1 上げて割る」と $\frac{x^{0}}{0}$ になって使えません。代わりに、$\log|x|$ を微分すると $\frac{1}{x}$ になることを使います（$\log$ は $e$ を底とする自然対数。絶対値は $x < 0$ の範囲でも使えるようにするためのものです）。`,
            pro: R`$\int \frac{f'(x)}{f(x)}\,dx = \log|f(x)| + C$ の最も基本的な形です。`,
            dom: (a, b) => { if (a <= 0 && b >= 0) throw new JK.CalcError('x = 0 で 1/x が定義されません。区間に 0 を含めないでください'); }
          };
        }
        const m = p.add(1), c = m.inv(), alt = powAlt(p);
        const fT = powT('x', p), FT = cf(c) + powT('x', m);
        return {
          fT: fT, FT: FT, f: (x) => Math.pow(x, p.val()),
          FV: (X) => V.pow(X, m).mul(V.q(c)),
          sub: (X) => sumTex([itemT(c, [m.eq(1) ? pv(X) : powBase(X) + '^{' + m.tex() + '}'], true)]),
          rule: [R`\int x^{p}\,dx = \frac{1}{p+1}x^{p+1} + C \quad (p \ne -1)`, R`\int ` + fT + R`\,dx = ` + FT + ' + C'],
          check: p.isZero() ? [R`\left(x\right)' = 1`] : [R`\left(` + FT + R`\right)' = ` + c.tex() + R` \cdot ` + U.paren(m) + powT('x', p) + ' = ' + fT],
          ruleN: R`公式で $p = ` + p.tex() + R`$、$p + 1 = ` + m.tex() + R`$ とします。` + (alt ? R`（$` + fT + ' = ' + alt + R`$）` : ''),
          easy: R`$x^{n}$ を微分すると $nx^{n-1}$（指数が前に出て、指数が 1 下がる）でした。積分はその逆の操作なので「**指数を 1 上げて、新しい指数で割る**」になります。指数が分数や負の数でも同じ公式が使えます。`,
          pro: R`$\int (ax+b)^{p}\,dx = \frac{1}{a(p+1)}(ax+b)^{p+1} + C$ のように、1 次式のかたまりにもそのまま使えます（置換積分の計算機を参照）。`,
          dom: (a, b) => {
            if (!p.isInt() && a < 0) throw new JK.CalcError('p が整数でないとき x^p は x ≥ 0 の範囲で考えます。a ≥ 0 にしてください');
            if (p.sign() < 0 && a <= 0 && b >= 0) throw new JK.CalcError('p < 0 のとき x = 0 で x^p が定義されません。区間に 0 を含めないでください');
          }
        };
      }
    }
  }

  JK.registerCalc({
    id: 'iiic-int-basic',
    course: 'IIIC',
    unit: 'm-integ3',
    group: '積分法',
    title: '基本関数の定積分',
    desc: R`$x^{p}$・$e^{kx}$・$\sin kx$・$\cos kx$・$\frac{1}{x+c}$・$\frac{1}{\cos^{2} x}$ の定積分を、原始関数を使って求めます。区間の端に $\pi$ や $e$（例: π/3, e, 2e）を入力すると厳密値で表示します。`,
    form: R`\int_{a}^{b} f(x)\,dx = \left[ F(x) \right]_{a}^{b} = F(b) - F(a)`,
    inputs: [
      { key: 'fn', label: '関数 $f(x)$', type: 'select', def: 'pow', options: [['pow', 'xᵖ（累乗）'], ['exp', 'e^(kx)（指数関数）'], ['sin', 'sin kx'], ['cos', 'cos kx'], ['inv', '1/(x+c)'], ['sec2', '1/cos²x']] },
      { key: 'p', label: '指数 $p$', type: 'q', def: '2', show: (r) => r.fn === 'pow' },
      { key: 'k', label: '係数 $k$', type: 'q', def: '1', show: (r) => r.fn === 'exp' || r.fn === 'sin' || r.fn === 'cos' },
      { key: 'c', label: '定数 $c$', type: 'q', def: '1', show: (r) => r.fn === 'inv' },
      { key: 'a', label: '下端 $a$', type: 'num', def: '0', hint: 'π/6、e、1/2 なども入力できます' },
      { key: 'b', label: '上端 $b$', type: 'num', def: '1' }
    ],
    examples: [
      { label: 'sin x（0〜π）', v: { fn: 'sin', k: '1', a: '0', b: 'π' } },
      { label: 'e^(2x)', v: { fn: 'exp', k: '2', a: '0', b: '1' } },
      { label: '1/x（1〜e）', v: { fn: 'pow', p: '-1', a: '1', b: 'e' } },
      { label: '√x', v: { fn: 'pow', p: '1/2', a: '0', b: '4' } },
      { label: '1/cos²x', v: { fn: 'sec2', a: '0', b: 'π/4' } }
    ],
    intro: {
      easy: R`**積分**は微分の逆の操作です。微分が「各点での変化の速さ（グラフの傾き）」を求める操作なのに対し、積分は「細かい変化を積み上げて全体の量を求める」操作です。区間 $a \le x \le b$ での**定積分** $\int_{a}^{b} f(x)\,dx$ は、グラフと $x$ 軸の間の面積（$x$ 軸より下の部分は負として数える）を表します。計算では「微分すると $f(x)$ になる関数」＝**原始関数** $F(x)$ を見つけて、$F(b) - F(a)$ を求めます。`,
      normal: R`原始関数 $F(x)$ を求め、$\int_{a}^{b} f(x)\,dx = F(b) - F(a)$ で計算します。数IIIでは $x^{p}$（$p$ は実数）・$e^{x}$・三角関数・$\frac{1}{x}$ の原始関数を使います。`,
      pro: R`公式は「微分して元に戻るか」で確認できます。$\int \frac{1}{x}\,dx = \log|x| + C$ の絶対値、$\int \sin x\,dx = -\cos x + C$ の符号が頻出のミスです。`
    },
    compute(v) {
      const a = v.a, b = v.b;
      checkRange(a, b);
      const d = basicDef(v);
      d.dom(a, b);
      const A = exactOf(a), B = exactOf(b);
      const FA = d.FV(A), FB = d.FV(B), I = FB.sub(FA);
      checkVal(I);
      const it = intTex(A, B, d.fT);
      const mid = midSum(d.f, a, b, 2000);
      const sg = signNote(d.f, a, b);
      const steps = [
        Object.assign({
          t: 'そもそも定積分とは — 細い長方形の面積を足し合わせる',
          easy: R`微分が「変化の速さを求める操作」なら、積分は「変化を積み上げる操作」で、2 つは互いに逆の関係です（速さを積み上げると進んだ距離になる、と同じ考え方）。実際に区間を 2000 等分した細い長方形の面積の和を計算すると $` + num(mid) + R`$ で、このあと原始関数で求める値とほぼ一致します。`,
          lv: 3
        }, STEP0),
        { t: '原始関数を求める', m: d.rule, n: d.ruleN + R`積分定数 $C$ は「定数を微分すると 0 になる」ので付けます。`, easy: d.easy, pro: d.pro },
        { t: '微分して確かめる', m: d.check, n: R`原始関数を微分して $f(x) = ` + d.fT + R`$ に戻れば、正しく求められています。`, lv: 2 },
        {
          t: '上端・下端を代入する',
          m: [it + ' = ' + bracket(d.FT, A, B), '= ' + d.sub(B) + minusT(d.sub(A)), '= ' + FB.tex() + minusT(FA.tex())],
          n: R`$\left[ F(x) \right]_{a}^{b}$ は $F(b) - F(a)$ を表す記号です。積分定数 $C$ は引き算で消えるので、定積分では書きません。`,
          easy: R`上端 $` + B.tex() + R`$ を代入した値から、下端 $` + A.tex() + R`$ を代入した値を引きます。引く方にはかっこを付けると、符号のミスを防げます。`
        },
        {
          t: '結果',
          m: it + eqv(I),
          n: I.exact() ? (I.isQ() ? '厳密値が求まりました。' : R`厳密値と、その近似値です。`) : R`厳密値で表せない部分があるので近似値で示します。`,
          pro: R`数値の検算: 区間を 2000 等分した中点の和は $` + num(mid) + R`$ で、結果と一致しています。`
        },
        {
          t: '定積分と面積の関係',
          n: sg.pos && sg.neg
            ? R`この区間では $f(x)$ が正の部分と負の部分の両方があるので、定積分は「$x$ 軸より上の面積 − 下の面積」になります。面積そのものを求めるには、符号が変わる点で区間を分けます（面積・回転体の体積の計算機を参照）。`
            : (sg.neg ? R`この区間では $f(x) \le 0$ なので、定積分は面積の $-1$ 倍（負の値）になります。` : R`この区間では $f(x) \ge 0$ なので、定積分の値はグラフと $x$ 軸の間の面積そのものです。`),
          easy: R`定積分は $x$ 軸より上の部分を $+$、下の部分を $-$ として足した「符号つきの面積」です。図の青い部分が $+$、紫の部分が $-$ にあたります。`,
          lv: 2
        }
      ];
      return {
        result: [
          { label: '被積分関数', tex: 'f(x) = ' + d.fT },
          { label: '原始関数', tex: 'F(x) = ' + d.FT + ' + C' },
          { label: '定積分', tex: it + eqv(I) }
        ],
        steps: steps,
        fig: areaFig(d.f, a, b, 'a=' + A.txt(), 'b=' + B.txt())
      };
    }
  });

  /* ================= 2. 置換積分 ================= */

  function corrTable(xs, xt, us, ut, uName) {
    return tableSvg([['x', xs, '→', xt], [uName || 'u', us, '→', ut]], { caption: '積分区間の対応' });
  }

  function subLin(v, s, t, S, T) {
    const a = v.a, b = v.b;
    if (a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（a = 0 だと定数になり置換の意味がありません）');
    const lin = [b, a], linT = P.tex(lin), multi = termCount(lin) > 1;
    const linP = multi ? R`\left(` + linT + R`\right)` : linT;
    const fL = (x) => a.val() * x + b.val();
    const u0 = fL(s), u1 = fL(t), umin = Math.min(u0, u1), umax = Math.max(u0, u1);
    let kind = v.outer, n = null;
    if (kind === 'pow') {
      n = v.n;
      if (n.isZero()) throw new JK.CalcError('n = 0 だと被積分関数が 1 になります。n は 0 以外を入力してください');
      if (Math.abs(n.val()) > 12) throw new JK.CalcError('n は -12〜12 の範囲で入力してください');
      if (n.eq(-1)) kind = 'inv';
      else {
        if (!n.isInt() && umin < 0) throw new JK.CalcError('n が整数でないとき uⁿ は u ≥ 0 で考えます。区間全体で ax + b ≥ 0 となるようにしてください');
        if (n.sign() < 0 && umin <= 0 && umax >= 0) throw new JK.CalcError('n < 0 のとき ax + b = 0 となる点で定義されません。その点を区間に含めないでください');
      }
    }
    if (kind === 'inv' && umin <= 0 && umax >= 0) throw new JK.CalcError('ax + b = 0 となる点が区間に含まれています。そこでは 1/(ax+b) が定義されません');
    if (kind === 'exp' && Math.max(Math.abs(u0), Math.abs(u1)) > 80) throw new JK.CalcError('ax + b の値が大きすぎます（区間全体で |ax + b| ≤ 80 となるように）');
    const ai = a.inv();
    let fx, fu, Fu, FV, Fsub, fnum, indef, rule;
    switch (kind) {
      case 'exp':
        fx = 'e^{' + linT + '}'; fu = 'e^{u}'; Fu = 'e^{u}';
        FV = (X) => V.exp(X); Fsub = (X) => 'e^{' + X.tex() + '}'; fnum = (x) => Math.exp(fL(x));
        indef = cf(ai) + fx; rule = R`\int e^{u}\,du = e^{u} + C`;
        break;
      case 'sin':
        fx = R`\sin` + (multi ? linP : fnArg(linT)); fu = R`\sin u`; Fu = R`-\cos u`;
        FV = (X) => V.cos(X).neg(); Fsub = (X) => R`-\cos` + argTex(X); fnum = (x) => Math.sin(fL(x));
        indef = cf(ai.neg()) + R`\cos` + (multi ? linP : fnArg(linT)); rule = R`\int \sin u\,du = -\cos u + C`;
        break;
      case 'cos':
        fx = R`\cos` + (multi ? linP : fnArg(linT)); fu = R`\cos u`; Fu = R`\sin u`;
        FV = (X) => V.sin(X); Fsub = (X) => R`\sin` + argTex(X); fnum = (x) => Math.cos(fL(x));
        indef = cf(ai) + R`\sin` + (multi ? linP : fnArg(linT)); rule = R`\int \cos u\,du = \sin u + C`;
        break;
      case 'inv':
        fx = R`\frac{1}{` + linT + '}'; fu = R`\frac{1}{u}`; Fu = R`\log|u|`;
        FV = (X) => V.ln(vabs(X)); Fsub = (X) => logAbsT(X); fnum = (x) => 1 / fL(x);
        indef = cf(ai) + R`\log|` + linT + '|'; rule = R`\int \frac{1}{u}\,du = \log|u| + C`;
        break;
      default: {
        const m = n.add(1), c = m.inv();
        fx = powG(linT, n); fu = powG('u', n); Fu = cf(c) + powG('u', m);
        FV = (X) => V.pow(X, m).mul(V.q(c)); Fsub = (X) => sumTex([itemT(c, [powX(X, m)], true)]);
        fnum = (x) => Math.pow(fL(x), n.val());
        indef = cf(c.mul(ai)) + powG(linT, m); rule = R`\int u^{n}\,du = \frac{1}{n+1}u^{n+1} + C \quad (n \ne -1)`;
      }
    }
    const US = V.q(a).mul(S).add(V.q(b)), UT = V.q(a).mul(T).add(V.q(b));
    const F1 = FV(UT), F0 = FV(US), I = F1.sub(F0).mul(V.q(ai));
    checkVal(I);
    const it = intTex(S, T, fx), co = a.eq(1) ? '' : cf(ai);
    const wrapB = (s) => (a.eq(1) ? s : R`\left\{ ` + s + R` \right\}`);
    const steps = [
      {
        t: '置換積分の考え方 — かたまりを 1 文字に置きかえる',
        m: [R`\left\{ F(ax+b) \right\}' = a\,f(ax+b)`, R`\int f(ax+b)\,dx = \frac{1}{a}F(ax+b) + C`],
        n: R`合成関数の微分では、かたまり $ax+b$ の微分 $a$ が前に出ました。積分ではそれを打ち消すように $\frac{1}{a}$ が付きます。この計算を「$u = ax + b$ とおく」という手順で確かめていきます。`,
        easy: R`$` + fx + R`$ を展開したり公式を探したりする代わりに、かたまり $` + linT + R`$ に $u$ という名前を付けて、$u$ の簡単な関数 $` + fu + R`$ の積分に直します。ただし $x$ と $u$ では「目盛りの幅」が違うので、$dx$ と $du$ の関係（何倍か）と、積分区間の付け替えが必要です。`,
        lv: 3
      },
      {
        t: R`$u = ` + linT + R`$ とおく`,
        m: [R`u = ` + linT, R`\frac{du}{dx} = ` + a.tex(), R`dx = ` + (a.eq(1) ? 'du' : cf(ai) + R`\,du`)],
        n: R`$u$ を $x$ で微分すると $` + a.tex() + R`$ です。` + (a.eq(1) ? R`$dx = du$ なので、目盛りの幅は変わりません。` : R`$x$ が少し増えると、$u$ はその $` + a.tex() + R`$ 倍だけ増えます。`),
        easy: R`$\frac{du}{dx}$ は「$u$ を $x$ で微分したもの」です。両辺に $dx$ を掛けた形 $du = ` + cf(a) + R`\,dx$ は、分数のように扱ってよいという記号の約束だと考えてください。`
      },
      {
        t: '積分区間を u に付け替える',
        m: [R`x = ` + S.tex() + R`\ \text{のとき}\ u = ` + US.tex(), R`x = ` + T.tex() + R`\ \text{のとき}\ u = ` + UT.tex()],
        n: R`$u = ` + linT + R`$ に区間の端を代入します。` + (a.sign() < 0 ? R`$a < 0$ なので $u$ の区間は逆向き（上端 < 下端）になりますが、そのまま計算して構いません。` : ''),
        easy: R`$x$ の区間のまま $u$ の式を積分すると間違いになります。表のように「$x$ が ` + S.txt() + ' から ' + T.txt() + R` まで動くとき、$u$ は ` + US.txt() + ' から ' + UT.txt() + R` まで動く」と読みかえます。`,
        fig: corrTable(S.txt(), T.txt(), US.txt(), UT.txt())
      },
      {
        t: 'u の積分に書き換える',
        m: [it + R` = \int_{` + US.tex() + '}^{' + UT.tex() + '} ' + fu + (a.eq(1) ? '' : R` \cdot ` + U.paren(ai)) + R`\,du`].concat(a.eq(1) ? [] : [R`= ` + co + R`\int_{` + US.tex() + '}^{' + UT.tex() + '} ' + fu + R`\,du`]),
        n: R`$` + fx + R`$ を $` + fu + R`$ に、$dx$ を $` + (a.eq(1) ? 'du' : cf(ai) + R`\,du`) + R`$ に、区間を $u$ の区間に置きかえます。`
      },
      {
        t: '積分して代入する',
        m: [R`= ` + co + R`\left[ ` + Fu + R` \right]_{` + US.tex() + '}^{' + UT.tex() + '}', '= ' + co + wrapB(Fsub(UT) + minusT(Fsub(US))), '= ' + co + wrapB(F1.tex() + minusT(F0.tex())), '= ' + I.tex() + approxTail(I)],
        n: R`公式 $` + rule + R`$ を使います。`,
        easy: R`$u$ の世界の区間のまま代入するので、$x$ の式に戻す必要はありません。`,
        pro: R`$\int f(ax+b)\,dx = \frac{1}{a}F(ax+b) + C$ を覚えておけば、置換を書かずに 1 行で計算できます。`
      },
      {
        t: 'x の式に戻した不定積分',
        m: R`\int ` + fx + R`\,dx = ` + indef + ' + C',
        n: R`$F(u)$ の $u$ を $` + linT + R`$ に戻して $\frac{1}{a}$ 倍した形です。微分すると元の関数に戻ることを確かめてみましょう。`,
        lv: 2
      }
    ];
    return {
      result: [
        { label: '置換', tex: R`u = ` + linT + R`,\ \ dx = ` + (a.eq(1) ? 'du' : cf(ai) + R`\,du`) },
        { label: '不定積分', tex: R`\int ` + fx + R`\,dx = ` + indef + ' + C' },
        { label: '定積分', tex: it + eqv(I) }
      ],
      steps: steps,
      fig: areaFig(fnum, s, t, 'x=' + S.txt(), 'x=' + T.txt())
    };
  }

  function subG(v, s, t, S, T) {
    const g = v.g, n = v.n, dg = P.deg(g);
    if (dg < 1) throw new JK.CalcError('g(x) は 1 次以上の多項式を入力してください');
    if (dg > 6) throw new JK.CalcError('g(x) は 6 次以下で入力してください');
    if (n.isZero()) throw new JK.CalcError('n は 0 以外を入力してください');
    if (Math.abs(n.val()) > 12) throw new JK.CalcError('n は -12〜12 の範囲で入力してください');
    const gp = P.deriv(g), gT = P.tex(g), gpT = P.tex(gp), multi = termCount(g) > 1, gf = P.fn(g);
    const gs = sample(gf, s, t, 2000).concat([gf(s), gf(t)]);
    const gmin = Math.min.apply(null, gs), gmax = Math.max.apply(null, gs);
    const zeroIn = (gmin <= 1e-12 && gmax >= -1e-12) || P.rationalRoots(g).some((r) => r.val() >= s && r.val() <= t);
    if (n.sign() < 0 && zeroIn) throw new JK.CalcError('区間内に g(x) = 0 となる点があり、そこで被積分関数が定義されません');
    if (!n.isInt() && gmin < -1e-12) throw new JK.CalcError('n が整数でないとき、区間全体で g(x) ≥ 0 となるようにしてください');
    if (Math.max(Math.abs(gmin), Math.abs(gmax)) > 1e6) throw new JK.CalcError('g(x) の値が大きすぎます。区間を小さくしてください');
    const isLog = n.eq(-1), m = n.add(1), c = isLog ? null : m.inv();
    const gpF = polyFactor(gp);
    const fx = n.sign() > 0 ? gpF + (n.eq(1) ? (multi ? R`\left(` + gT + R`\right)` : gT) : powG(gT, n)) : R`\frac{` + gpT + '}{' + powG(gT, n.neg()) + '}';
    const fu = powG('u', n);
    const Fu = isLog ? R`\log|u|` : cf(c) + powG('u', m);
    const FV = isLog ? (X) => V.ln(vabs(X)) : (X) => V.pow(X, m).mul(V.q(c));
    const Fsub = isLog ? (X) => logAbsT(X) : (X) => sumTex([itemT(c, [powX(X, m)], true)]);
    const indef = isLog ? R`\log|` + gT + '|' : cf(c) + powG(gT, m);
    const fnum = (x) => P.eval(gp, x) * Math.pow(gf(x), n.val());
    const US = pevalV(g, S), UT = pevalV(g, T);
    const F1 = FV(UT), F0 = FV(US), I = F1.sub(F0);
    checkVal(I);
    const it = intTex(S, T, fx);
    const steps = [
      {
        t: '置換積分の考え方 — 合成関数の微分を逆にたどる',
        m: [R`\left\{ F(g(x)) \right\}' = f(g(x))\,g'(x)`, R`\int f(g(x))\,g'(x)\,dx = \int f(u)\,du \quad (u = g(x))`],
        n: R`合成関数の微分（チェーンルール）を逆向きに読むと、「かたまり $g(x)$ の関数」に「$g'(x)$」が掛かった形は、$u = g(x)$ とおくと $u$ だけの積分になります。`,
        easy: R`被積分関数をよく見ると、かたまり $` + gT + R`$ と、その微分 $` + gpT + R`$ が両方入っています。この「かたまりと、その微分のセット」が置換の合図です。かたまりを $u$ とおくと、おまけの $` + gpT + R`\,dx$ がちょうど $du$ になって、全体が $u$ だけの簡単な式になります。`,
        lv: 3
      },
      {
        t: R`$u = g(x)$ とおく`,
        m: [R`u = ` + gT, R`\frac{du}{dx} = ` + gpT, R`du = ` + (termCount(gp) > 1 ? R`\left(` + gpT + R`\right)` : (gpT === '1' ? '' : gpT)) + R`\,dx`],
        n: R`被積分関数には $g'(x) = ` + gpT + R`$ がちょうど掛かっているので、$` + gpT + R`\,dx$ をまとめて $du$ に置きかえられます。`,
        easy: R`$du = g'(x)\,dx$ は「$x$ が少し増えたとき、$u$ はその $g'(x)$ 倍だけ増える」という関係を表す記号の約束です。分数のように両辺に $dx$ を掛けた形だと考えて構いません。`
      },
      {
        t: '積分区間を u に付け替える',
        m: [R`x = ` + S.tex() + R`\ \text{のとき}\ u = ` + US.tex(), R`x = ` + T.tex() + R`\ \text{のとき}\ u = ` + UT.tex()],
        n: R`$u = ` + gT + R`$ に区間の端を代入します。`,
        easy: R`$x$ が ` + S.txt() + ' から ' + T.txt() + R` まで動くとき、$u$ は ` + US.txt() + ' から ' + UT.txt() + R` まで動きます。$u$ の式を積分するときは、この $u$ の区間を使います。`,
        fig: corrTable(S.txt(), T.txt(), US.txt(), UT.txt())
      },
      {
        t: 'u の積分に書き換える',
        m: it + R` = \int_{` + US.tex() + '}^{' + UT.tex() + '} ' + fu + R`\,du`,
        n: R`$\{g(x)\}^{n}$ を $` + fu + R`$ に、$g'(x)\,dx$ を $du$ に、区間を $u$ の区間に置きかえます。`,
        easy: R`複雑に見えた式が、$u$ の簡単な関数 $` + fu + R`$ の積分になりました。`
      },
      {
        t: '積分して代入する',
        m: [R`= \left[ ` + Fu + R` \right]_{` + US.tex() + '}^{' + UT.tex() + '}', '= ' + Fsub(UT) + minusT(Fsub(US))].concat(tailLines(F1.tex(), F0.tex(), I)),
        n: isLog ? R`$\int \frac{1}{u}\,du = \log|u| + C$ を使います。` : R`$\int u^{n}\,du = \frac{1}{n+1}u^{n+1} + C$ で $n = ` + n.tex() + R`$ とします。`,
        pro: isLog ? R`$\int \frac{g'(x)}{g(x)}\,dx = \log|g(x)| + C$ は置換を書かずに使えるようにしておきましょう。` : R`定積分の置換では $x$ に戻さず、$u$ の区間のまま計算するのが速くて安全です。`
      },
      {
        t: 'x の式に戻した不定積分',
        m: R`\int ` + fx + R`\,dx = ` + indef + ' + C',
        n: R`$u$ を $` + gT + R`$ に戻した形です。微分すると、合成関数の微分で $g'(x) = ` + gpT + R`$ が出てきて元の関数に戻ります。`,
        lv: 2
      }
    ];
    return {
      result: [
        { label: '置換', tex: R`u = ` + gT + R`,\ \ du = ` + (termCount(gp) > 1 ? R`\left(` + gpT + R`\right)` : (gpT === '1' ? '' : gpT)) + R`\,dx` },
        { label: '不定積分', tex: R`\int ` + fx + R`\,dx = ` + indef + ' + C' },
        { label: '定積分', tex: it + eqv(I) }
      ],
      steps: steps,
      fig: areaFig(fnum, s, t, 'x=' + S.txt(), 'x=' + T.txt())
    };
  }

  JK.registerCalc({
    id: 'iiic-int-sub',
    course: 'IIIC',
    unit: 'm-integ3',
    group: '積分法',
    title: '置換積分',
    desc: R`$\int f(ax+b)\,dx$ 型と $\int g'(x)\{g(x)\}^{n}\,dx$ 型の定積分を、$u$ への置きかえ → $du$ と $dx$ の関係 → 積分区間の対応表 → $u$ で積分、の順に計算します。`,
    form: [R`u = g(x),\quad du = g'(x)\,dx`, R`\int_{a}^{b} f(g(x))\,g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du`],
    inputs: [
      { key: 'type', label: '型', type: 'select', def: 'lin', options: [['lin', '∫ f(ax+b) dx（1 次式のかたまり）'], ['gpow', "∫ g'(x){g(x)}ⁿ dx"]] },
      { key: 'outer', label: '外側の関数 $f(u)$', type: 'select', def: 'pow', options: [['pow', 'uⁿ（累乗）'], ['exp', 'eᵘ'], ['sin', 'sin u'], ['cos', 'cos u'], ['inv', '1/u']], show: (r) => r.type !== 'gpow' },
      { key: 'a', label: '$a$（$u = ax + b$）', type: 'q', def: '2', show: (r) => r.type !== 'gpow' },
      { key: 'b', label: '$b$', type: 'q', def: '1', show: (r) => r.type !== 'gpow' },
      { key: 'g', label: '$g(x)$', type: 'poly', def: 'x^2 + 1', show: (r) => r.type === 'gpow' },
      { key: 'n', label: '指数 $n$', type: 'q', def: '3', show: (r) => r.type === 'gpow' || r.outer === 'pow', hint: '1/2 で √、-1 で log になります' },
      { key: 's', label: '下端', type: 'num', def: '0', hint: 'π/4 なども入力できます' },
      { key: 't', label: '上端', type: 'num', def: '1' }
    ],
    examples: [
      { label: 'e^(3x−1)', v: { type: 'lin', outer: 'exp', a: '3', b: '-1', s: '0', t: '1' } },
      { label: 'sin(2x+π)…cos 2x', v: { type: 'lin', outer: 'cos', a: '2', b: '0', s: '0', t: 'π/4' } },
      { label: "2x(x²+1)³", v: { type: 'gpow', g: 'x^2 + 1', n: '3', s: '0', t: '1' } },
      { label: '2x/(x²+1)', v: { type: 'gpow', g: 'x^2 + 1', n: '-1', s: '0', t: '1' } },
      { label: '3x²√(x³+1)', v: { type: 'gpow', g: 'x^3 + 1', n: '1/2', s: '0', t: '2' } }
    ],
    intro: {
      easy: R`**置換積分**は、式の中の「かたまり」を新しい文字 $u$ に置きかえて、簡単な積分に直す方法です。たとえば $(2x+1)^{3}$ を展開せずに $u = 2x + 1$ とおけば、$u^{3}$ の積分になります。ただし $x$ と $u$ では目盛りの幅が違うので、$dx$ を $du$ で表し直すこと（$du = 2\,dx$）と、積分区間を $u$ の値に付け替えることを忘れないようにします。`,
      normal: R`$u = g(x)$ とおくと $du = g'(x)\,dx$。$\int_{a}^{b} f(g(x))\,g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du$ です。`,
      pro: R`$\int f(ax+b)\,dx = \frac{1}{a}F(ax+b) + C$、$\int g'(x)\{g(x)\}^{n}\,dx = \frac{\{g(x)\}^{n+1}}{n+1} + C$、$\int \frac{g'(x)}{g(x)}\,dx = \log|g(x)| + C$ は、置換を書かずに一気に計算できるようにしておきましょう。`
    },
    compute(v) {
      const s = v.s, t = v.t;
      checkRange(s, t);
      const S = exactOf(s), T = exactOf(t);
      return v.type === 'gpow' ? subG(v, s, t, S, T) : subLin(v, s, t, S, T);
    }
  });

  /* ================= 3. 部分積分 ================= */

  function partsDef(type, k, n) {
    const LOGX = R`\log x`;
    switch (type) {
      case 'xsin': case 'xcos': {
        if (k.isZero()) throw new JK.CalcError('k は 0 以外を入力してください');
        const isSin = type === 'xsin', kx = kxT(k), c1 = k.inv(), c2 = k.mul(k).inv();
        const SN = R`\sin` + fnArg(kx), CS = R`\cos` + fnArg(kx);
        const sn = (X) => (X ? R`\sin` + argTex(V.q(k).mul(X)) : SN), cs = (X) => (X ? R`\cos` + argTex(V.q(k).mul(X)) : CS);
        const g = isSin ? cf(c1.neg()) + CS : cf(c1) + SN;
        return {
          fT: 'x' + (isSin ? SN : CS), f: isSin ? (x) => x * Math.sin(k.val() * x) : (x) => x * Math.cos(k.val() * x),
          fF: 'x', fpF: '1', gpF: isSin ? SN : CS, gF: g,
          reason: R`$x$ は微分すると 1 になって消えます。三角関数は積分しても三角関数のままで複雑になりません。`,
          apply: [
            R`\int x` + (isSin ? SN : CS) + R`\,dx = x \cdot ` + parenL(g) + R` - \int 1 \cdot ` + parenL(g) + R`\,dx`,
            '= ' + sumTex(isSin
              ? [itemT(c1.neg(), ['x', CS]), { neg: c1.sign() < 0, body: (c1.abs().eq(1) ? '' : c1.abs().tex()) + R`\int ` + CS + R`\,dx` }]
              : [itemT(c1, ['x', SN]), { neg: c1.sign() > 0, body: (c1.abs().eq(1) ? '' : c1.abs().tex()) + R`\int ` + SN + R`\,dx` }])
          ],
          FT: (X) => {
            const sub = !!X, x = X ? pv(X) : 'x';
            return sumTex(isSin ? [itemT(c1.neg(), [x, cs(X)], sub), itemT(c2, [sn(X)], sub)] : [itemT(c1, [x, sn(X)], sub), itemT(c2, [cs(X)], sub)]);
          },
          FV: (X) => {
            const kX = V.q(k).mul(X);
            return isSin ? X.mul(V.cos(kX)).mul(V.q(c1.neg())).add(V.sin(kX).mul(V.q(c2))) : X.mul(V.sin(kX)).mul(V.q(c1)).add(V.cos(kX).mul(V.q(c2)));
          },
          check: isSin
            ? [R`F'(x) = ` + sumTex([itemT(c1.neg(), [CS]), itemT(Q(1), ['x', SN]), itemT(c1, [CS])]), '= x' + SN]
            : [R`F'(x) = ` + sumTex([itemT(c1, [SN]), itemT(Q(1), ['x', CS]), itemT(c1.neg(), [SN])]), '= x' + CS],
          dom: () => {}
        };
      }
      case 'log':
        return {
          fT: LOGX, f: (x) => Math.log(x),
          fF: LOGX, fpF: R`\frac{1}{x}`, gpF: '1', gF: 'x',
          reason: R`$\log x$ の原始関数は覚えていないので、微分できる側（$f$）にします。相手がいないときは $1$ を掛けて $\log x = (\log x) \cdot 1$ と見ます。`,
          apply: [R`\int \log x\,dx = \int (\log x) \cdot 1\,dx = (\log x) \cdot x - \int \frac{1}{x} \cdot x\,dx`, R`= x\log x - \int 1\,dx`],
          FT: (X) => (X ? sumTex([itemT(Q(1), [pv(X), R`\log` + argTex(X)], true), itemT(Q(-1), [pv(X)], true)]) : R`x\log x - x`),
          FV: (X) => X.mul(V.ln(X)).sub(X),
          check: [R`F'(x) = 1 \cdot \log x + x \cdot \frac{1}{x} - 1`, R`= \log x`],
          dom: (a) => { if (a <= 0) throw new JK.CalcError('log x は x > 0 で定義されます。下端 a > 0 にしてください'); }
        };
      case 'xnlog': {
        const m = Q(n + 1), c1 = m.inv(), c2 = m.mul(m).inv();
        const xn = powT('x', Q(n)), xm = powT('x', m);
        const xmX = (X) => (X ? powX(X, m) : xm);
        return {
          fT: xn + LOGX, f: (x) => Math.pow(x, n) * Math.log(x),
          fF: LOGX, fpF: R`\frac{1}{x}`, gpF: xn, gF: cf(c1) + xm,
          reason: R`$\log x$ の原始関数は覚えていないので $f$ にします。$x^{` + n + R`}$ は積分しても $x$ の累乗のままです。`,
          apply: [
            R`\int ` + xn + R`\log x\,dx = (\log x) \cdot ` + cf(c1) + xm + R` - \int \frac{1}{x} \cdot ` + cf(c1) + xm + R`\,dx`,
            '= ' + cf(c1) + xm + R`\log x - ` + cf(c1) + R`\int ` + xn + R`\,dx`
          ],
          FT: (X) => sumTex([itemT(c1, [xmX(X), X ? R`\log` + argTex(X) : LOGX], !!X), itemT(c2.neg(), [xmX(X)], !!X)]),
          FV: (X) => V.pow(X, m).mul(V.ln(X).mul(V.q(c1)).sub(V.q(c2))),
          check: [R`F'(x) = ` + sumTex([itemT(Q(1), [xn, LOGX]), itemT(c1, [xn]), itemT(c1.neg(), [xn])]), '= ' + xn + LOGX],
          dom: (a) => { if (a <= 0) throw new JK.CalcError('log x は x > 0 で定義されます。下端 a > 0 にしてください'); }
        };
      }
      case 'x2exp':
        return {
          fT: R`x^{2}e^{x}`, f: (x) => x * x * Math.exp(x),
          fF: R`x^{2}`, fpF: '2x', gpF: 'e^{x}', gF: 'e^{x}',
          reason: R`$x^{2}$ は微分するたびに次数が下がり、2 回微分すると定数になります。$e^{x}$ は何回積分しても $e^{x}$ のままです。`,
          apply: [R`\int x^{2}e^{x}\,dx = x^{2} \cdot e^{x} - \int 2x \cdot e^{x}\,dx`, R`= x^{2}e^{x} - 2\int xe^{x}\,dx`],
          extra: {
            t: 'もう一度、部分積分する',
            m: [R`\int xe^{x}\,dx = x \cdot e^{x} - \int 1 \cdot e^{x}\,dx = xe^{x} - e^{x} + C`, R`\int x^{2}e^{x}\,dx = x^{2}e^{x} - 2\left(xe^{x} - e^{x}\right) + C`, R`= \left(x^{2} - 2x + 2\right)e^{x} + C`],
            n: R`残った $\int xe^{x}\,dx$ も積の形なので、$f = x,\ g' = e^{x}$ として部分積分をもう一度使います。`,
            easy: R`1 回目で $x^{2}$ が $2x$ に、2 回目で $x$ が $1$ になり、最後は $\int e^{x}\,dx$ という基本の積分だけが残ります。`
          },
          FT: (X) => (X ? sumTex([itemT(Q(1), [powX(X, Q(2)), 'e^{' + X.tex() + '}'], true), itemT(Q(-2), [pv(X), 'e^{' + X.tex() + '}'], true), itemT(Q(2), ['e^{' + X.tex() + '}'], true)]) : R`x^{2}e^{x} - 2xe^{x} + 2e^{x}`),
          FV: (X) => V.exp(X).mul(X.mul(X).sub(X.mul(V.q(2))).add(V.q(2))),
          check: [R`F'(x) = (2x - 2)e^{x} + \left(x^{2} - 2x + 2\right)e^{x}`, R`= x^{2}e^{x}`],
          dom: (a, b) => { if (Math.abs(a) > 60 || Math.abs(b) > 60) throw new JK.CalcError('区間の端は -60〜60 の範囲で入力してください（e^x が大きくなりすぎます）'); }
        };
      default: {
        if (k.isZero()) throw new JK.CalcError('k は 0 以外を入力してください');
        const kx = kxT(k), c1 = k.inv(), c2 = k.mul(k).inv(), E = 'e^{' + kx + '}';
        const eX = (X) => (X ? 'e^{' + V.q(k).mul(X).tex() + '}' : E);
        return {
          fT: 'x' + E, f: (x) => x * Math.exp(k.val() * x),
          fF: 'x', fpF: '1', gpF: E, gF: cf(c1) + E,
          reason: R`$x$ は微分すると 1 になって消えます。$e^{kx}$ は積分しても $e^{kx}$ の定数倍のままです。`,
          apply: [
            R`\int x` + E + R`\,dx = x \cdot ` + parenL(cf(c1) + E) + R` - \int 1 \cdot ` + parenL(cf(c1) + E) + R`\,dx`,
            '= ' + sumTex([itemT(c1, ['x', E]), { neg: c1.sign() > 0, body: (c1.abs().eq(1) ? '' : c1.abs().tex()) + R`\int ` + E + R`\,dx` }])
          ],
          FT: (X) => sumTex([itemT(c1, [X ? pv(X) : 'x', eX(X)], !!X), itemT(c2.neg(), [eX(X)], !!X)]),
          FV: (X) => V.exp(V.q(k).mul(X)).mul(X.mul(V.q(c1)).sub(V.q(c2))),
          check: [R`F'(x) = ` + sumTex([itemT(c1, [E]), itemT(Q(1), ['x', E]), itemT(c1.neg(), [E])]), '= x' + E],
          dom: (a, b) => { if (Math.abs(k.val() * a) > 60 || Math.abs(k.val() * b) > 60) throw new JK.CalcError('kx の値が大きすぎます（区間全体で |kx| ≤ 60 となるように）'); }
        };
      }
    }
  }

  JK.registerCalc({
    id: 'iiic-int-parts',
    course: 'IIIC',
    unit: 'm-integ3',
    group: '積分法',
    title: '部分積分',
    desc: R`$xe^{kx}$・$x\sin kx$・$x\cos kx$・$\log x$・$x^{n}\log x$・$x^{2}e^{x}$ の積分を、部分積分の公式で求めます。$f$ と $g'$ の選び方と理由、微分による確認、定積分まで示します。`,
    form: R`\int f(x)\,g'(x)\,dx = f(x)\,g(x) - \int f'(x)\,g(x)\,dx`,
    inputs: [
      { key: 'type', label: '被積分関数', type: 'select', def: 'xexp', options: [['xexp', 'x·e^(kx)'], ['xsin', 'x·sin kx'], ['xcos', 'x·cos kx'], ['log', 'log x'], ['xnlog', 'xⁿ·log x'], ['x2exp', 'x²·eˣ（2 回の部分積分）']] },
      { key: 'k', label: '係数 $k$', type: 'q', def: '1', show: (r) => r.type === 'xexp' || r.type === 'xsin' || r.type === 'xcos' },
      { key: 'n', label: '指数 $n$', type: 'int', def: '1', min: 1, max: 6, show: (r) => r.type === 'xnlog' },
      { key: 'a', label: '下端 $a$', type: 'num', def: '0', hint: 'π、π/2、e なども入力できます' },
      { key: 'b', label: '上端 $b$', type: 'num', def: '1' }
    ],
    examples: [
      { label: 'x sin x（0〜π）', v: { type: 'xsin', k: '1', a: '0', b: 'π' } },
      { label: 'log x（1〜e）', v: { type: 'log', a: '1', b: 'e' } },
      { label: 'x log x（1〜e）', v: { type: 'xnlog', n: '1', a: '1', b: 'e' } },
      { label: 'x²eˣ', v: { type: 'x2exp', a: '0', b: '1' } },
      { label: 'x cos 2x', v: { type: 'xcos', k: '2', a: '0', b: 'π/4' } }
    ],
    intro: {
      easy: R`$xe^{x}$ や $x\sin x$ のような**積の形**の関数は、そのままでは原始関数が分かりません。**部分積分**は、積の微分の公式 $(fg)' = f'g + fg'$ を逆に使って、「片方を微分・もう片方を積分」した、より簡単な積分に取りかえる方法です。$x$ は微分すると 1 になって消えるので、$x$ を微分する側に選ぶのがコツです。`,
      normal: R`$\int f(x)g'(x)\,dx = f(x)g(x) - \int f'(x)g(x)\,dx$。微分して簡単になる方を $f$、積分しやすい方を $g'$ に選びます。`,
      pro: R`$\int e^{x}\sin x\,dx$ のように 2 回の部分積分で元の積分が再び現れる型は、$I$ とおいて方程式として解きます。定積分は $\int_{a}^{b} fg'\,dx = \left[ fg \right]_{a}^{b} - \int_{a}^{b} f'g\,dx$ と区間つきで処理すると速い。`
    },
    compute(v) {
      const a = v.a, b = v.b;
      checkRange(a, b);
      const d = partsDef(v.type, v.k, v.n);
      d.dom(a, b);
      const A = exactOf(a), B = exactOf(b);
      const FA = d.FV(A), FB = d.FV(B), I = FB.sub(FA);
      checkVal(I);
      const F0 = d.FT(null), it = intTex(A, B, d.fT);
      const steps = [
        {
          t: '部分積分の公式はどこから来るか',
          m: [R`\left\{ f(x)g(x) \right\}' = f'(x)g(x) + f(x)g'(x)`, R`\int f(x)g'(x)\,dx = f(x)g(x) - \int f'(x)g(x)\,dx`],
          n: R`積の微分の公式の両辺を積分すると $f(x)g(x) = \int f'(x)g(x)\,dx + \int f(x)g'(x)\,dx$。移項すると部分積分の公式になります。`,
          easy: R`「積の積分」は直接できないことが多いので、片方を微分・もう片方を積分した組 $f'g$ に取りかえる作戦です。取りかえた後の積分 $\int f'g\,dx$ が元より簡単になるように、$f$ と $g'$ を選ぶのがポイントです。`,
          lv: 3
        },
        {
          t: R`$f$ と $g'$ を選ぶ`,
          m: [R`f(x) = ` + d.fF + R`,\quad g'(x) = ` + d.gpF, R`f'(x) = ` + d.fpF + R`,\quad g(x) = ` + d.gF],
          n: d.reason,
          easy: R`選び方の目安は「**微分すると簡単になる方を $f$**、**積分しても複雑にならない方を $g'$**」。$g$ は $g'$ の原始関数（積分定数は付けなくてよい）です。`,
          pro: R`$f$ にする優先順位は「$\log$ → 多項式 → 三角関数・指数関数」。$\log$ は積分の公式を使わずに済むよう必ず $f$ 側にします。`
        },
        {
          t: '公式に当てはめる',
          m: d.apply,
          n: R`$f \cdot g$ から、$f' \cdot g$ の積分を引きます。残った積分は基本的な積分になっています。`,
          easy: R`公式の形「$f$ と $g$ の積」−「$f'$ と $g$ の積の積分」に、上で決めた 4 つの式をそのまま入れるだけです。`
        }
      ];
      if (d.extra) steps.push(d.extra);
      steps.push(
        { t: '原始関数', m: R`\int ` + d.fT + R`\,dx = ` + F0 + ' + C', n: R`残りの積分を計算して整理しました（$C$ は積分定数）。` },
        { t: '微分して確かめる', m: d.check, n: R`$F(x) = ` + F0 + R`$ を積の微分法で微分すると、元の関数に戻ります。`, lv: 2 },
        {
          t: '定積分を計算する',
          m: [it + ' = ' + bracket(F0, A, B), '= ' + d.FT(B) + minusT(d.FT(A))].concat(tailLines(FB.tex(), FA.tex(), I)),
          n: R`原始関数に上端 $` + B.tex() + R`$ と下端 $` + A.tex() + R`$ を代入して引きます。`,
          easy: R`代入するときは、$x$ をすべて同じ値に置きかえます。$e^{0} = 1$、$\log 1 = 0$、$\log e = 1$、$\sin 0 = 0$、$\cos 0 = 1$ などを使って整理します。`,
          pro: R`定積分のまま $\left[ fg \right]_{a}^{b} - \int_{a}^{b} f'g\,dx$ と計算すると、代入が 2 回に分かれて計算量が減ることがあります。`
        }
      );
      return {
        result: [
          { label: 'f と g′', tex: R`f = ` + d.fF + R`,\ \ g' = ` + d.gpF },
          { label: '不定積分', tex: R`\int ` + d.fT + R`\,dx = ` + F0 + ' + C' },
          { label: '定積分', tex: it + eqv(I) }
        ],
        steps: steps,
        fig: areaFig(d.f, a, b, 'a=' + A.txt(), 'b=' + B.txt())
      };
    }
  });

  /* ================= 4. 分数関数の積分 ================= */

  // c / (x − r)^k の {neg, body}
  function fracTerm(c, r, k) {
    const a = c.abs(), xr = xMinus(r);
    const den1 = r.isZero() ? (k === 1 ? 'x' : 'x^{2}') : (k === 1 ? xr : R`\left(` + xr + R`\right)^{2}`);
    let body;
    if (a.d === 1) body = R`\frac{` + a.n + '}{' + den1 + '}';
    else body = R`\frac{` + a.n + '}{' + a.d + (r.isZero() || k === 2 ? den1 : R`\left(` + xr + R`\right)`) + '}';
    return { neg: c.sign() < 0, body: body };
  }
  function intItem(tm) {
    if (tm.k === 1) return itemT(tm.c, [R`\log|` + xMinus(tm.r) + '|']);
    return fracTerm(tm.c.neg(), tm.r, 1);
  }
  function termV(tm, X) {
    const d = X.sub(V.q(tm.r));
    return tm.k === 1 ? V.ln(vabs(d)).mul(V.q(tm.c)) : d.inv().mul(V.q(tm.c.neg()));
  }
  function decomp(N, D) {
    const dD = P.deg(D);
    if (P.isZero(N)) throw new JK.CalcError('分子が 0 です（被積分関数が 0 になります）');
    if (dD < 1) throw new JK.CalcError('分母 D(x) は 1 次以上にしてください（定数なら多項式の積分です）');
    if (dD > 2) throw new JK.CalcError('分母 D(x) は 1 次式か 2 次式で入力してください');
    if (P.deg(N) > 6) throw new JK.CalcError('分子 N(x) は 6 次以下で入力してください');
    const dm = P.divmod(N, D), lead = D[dD], terms = [];
    let roots, kind;
    if (dD === 1) {
      const r = D[0].neg().div(D[1]);
      roots = [r]; kind = 'lin';
      if (!P.isZero(dm.r)) terms.push({ k: 1, c: dm.r[0].div(lead), r: r });
    } else {
      roots = P.rationalRoots(D);
      if (!roots.length) {
        const disc = D[1].mul(D[1]).sub(D[2].mul(D[0]).mul(4));
        if (disc.sign() < 0) throw new JK.CalcError('分母 D(x) が実数の範囲で 1 次式の積に分解できません（この型は x = tan θ の置換が必要で、この計算機の対象外です）');
        throw new JK.CalcError('分母 D(x) の因数分解に無理数が必要です。有理数の範囲で 1 次式の積に分解できる分母を入力してください');
      }
      const Rm = dm.r;
      if (roots.length === 1) {
        kind = 'double';
        const r = roots[0], r1 = Rm.length > 1 ? Rm[1] : Q(0), Rr = P.eval(Rm, r);
        if (!r1.isZero()) terms.push({ k: 1, c: r1.div(lead), r: r });
        if (!Rr.isZero()) terms.push({ k: 2, c: Rr.div(lead), r: r });
      } else {
        kind = 'two';
        const al = roots[0], be = roots[1];
        const A = P.eval(Rm, al).div(lead.mul(al.sub(be))), B = P.eval(Rm, be).div(lead.mul(be.sub(al)));
        if (!A.isZero()) terms.push({ k: 1, c: A, r: al });
        if (!B.isZero()) terms.push({ k: 1, c: B, r: be });
      }
    }
    return { Qt: dm.q, Rm: dm.r, terms: terms, roots: roots, kind: kind, lead: lead };
  }
  function factTex(lead, roots, kind) {
    const pre = lead.eq(1) ? '' : (lead.eq(-1) ? '-' : lead.tex());
    const f1 = (r) => (r.isZero() ? 'x' : R`\left(` + xMinus(r) + R`\right)`);
    if (kind === 'lin') return pre + f1(roots[0]);
    if (kind === 'double') return pre + (roots[0].isZero() ? 'x^{2}' : R`\left(` + xMinus(roots[0]) + R`\right)^{2}`);
    const fs = roots.slice().sort((p, q) => (p.isZero() ? -1 : (q.isZero() ? 1 : 0)));
    return pre + fs.map(f1).join('');
  }

  JK.registerCalc({
    id: 'iiic-int-frac',
    course: 'IIIC',
    unit: 'm-integ3',
    group: '積分法',
    title: '分数関数の積分',
    desc: R`$\int \frac{px+q}{(x-a)(x-b)}\,dx$ を部分分数分解で、$\int \frac{N(x)}{D(x)}\,dx$（分子の次数が高い）を割り算してから積分します。分母が 0 になる点を含まない区間なら定積分も求めます。`,
    form: [R`\frac{px+q}{(x-a)(x-b)} = \frac{A}{x-a} + \frac{B}{x-b}`, R`\int \frac{1}{x-a}\,dx = \log|x-a| + C`],
    inputs: [
      { key: 'mode', label: '型', type: 'select', def: 'pf', options: [['pf', '(px+q)/((x−a)(x−b))：部分分数分解'], ['div', 'N(x)/D(x)：割り算してから積分']] },
      { key: 'p', label: '$p$', type: 'q', def: '3', show: (r) => r.mode !== 'div' },
      { key: 'q', label: '$q$', type: 'q', def: '1', show: (r) => r.mode !== 'div' },
      { key: 'a', label: '$a$', type: 'q', def: '1', show: (r) => r.mode !== 'div' },
      { key: 'b', label: '$b$', type: 'q', def: '-1', show: (r) => r.mode !== 'div' },
      { key: 'N', label: '分子 $N(x)$', type: 'poly', def: 'x^2 + 3x + 1', show: (r) => r.mode === 'div' },
      { key: 'D', label: '分母 $D(x)$', type: 'poly', def: 'x + 1', show: (r) => r.mode === 'div', hint: '1 次式、または 1 次式の積に分解できる 2 次式（例: x^2 - 1）' },
      { key: 's', label: '定積分の下端', type: 'num', def: '2' },
      { key: 't', label: '定積分の上端', type: 'num', def: '3' }
    ],
    examples: [
      { label: '1/(x(x+1))', v: { mode: 'pf', p: '0', q: '1', a: '0', b: '-1', s: '1', t: '2' } },
      { label: '重解 (x+2)/(x−1)²', v: { mode: 'pf', p: '1', q: '2', a: '1', b: '1', s: '2', t: '3' } },
      { label: '割り算 (x²+3x+1)/(x+1)', v: { mode: 'div', N: 'x^2 + 3x + 1', D: 'x + 1', s: '0', t: '1' } },
      { label: '割り算＋分解 x³/(x²−1)', v: { mode: 'div', N: 'x^3', D: 'x^2 - 1', s: '2', t: '3' } }
    ],
    intro: {
      easy: R`分数の形の関数は、そのままでは積分できないことが多いので、**積分しやすい形に分けてから**積分します。(1) 分子の次数が分母の次数以上なら、まず**割り算**して「多項式 + 分子の次数が低い分数」に直します（帯分数 $\frac{7}{3} = 2 + \frac{1}{3}$ と同じ考え方）。(2) 分母が 1 次式の積なら、**部分分数分解**（通分の逆）で $\frac{A}{x-a} + \frac{B}{x-b}$ の形に分けます。あとは $\int \frac{1}{x-a}\,dx = \log|x-a| + C$ を使えば積分できます。`,
      normal: R`$\frac{px+q}{(x-a)(x-b)} = \frac{A}{x-a} + \frac{B}{x-b}$ の $A,\ B$ は、分母を払った恒等式 $px + q = A(x-b) + B(x-a)$ に $x = a,\ b$ を代入すると求められます。`,
      pro: R`$\frac{1}{(x-a)(x-b)} = \frac{1}{a-b}\left(\frac{1}{x-a} - \frac{1}{x-b}\right)$ は暗記しておくと速い。分母に重解があるときは $\frac{A}{x-a} + \frac{B}{(x-a)^{2}}$ とおきます。`
    },
    compute(v) {
      const s = v.s, t = v.t;
      checkRange(s, t);
      let N, D, denT;
      if (v.mode === 'div') { N = v.N; D = v.D; denT = P.tex(D); }
      else {
        N = [v.q, v.p];
        D = P.mul([v.a.neg(), Q(1)], [v.b.neg(), Q(1)]);
        denT = v.a.eq(v.b) ? (v.a.isZero() ? 'x^{2}' : R`\left(` + xMinus(v.a) + R`\right)^{2}`) : factTex(Q(1), [v.a, v.b], 'two');
      }
      const dc = decomp(N, D), Qt = dc.Qt, Rm = dc.Rm, terms = dc.terms;
      const NT = P.tex(N), fT = R`\frac{` + NT + '}{' + denT + '}';
      const fnum = (x) => P.eval(N, x) / P.eval(D, x);
      const decT = sumTex(polyItems(Qt).concat(terms.map((tm) => fracTerm(tm.c, tm.r, tm.k))));
      const Fp = P.integ(Qt);
      const FT = sumTex(polyItems(Fp).concat(terms.map(intItem)));
      const steps = [];
      if (v.mode === 'div') {
        steps.push({
          t: 'なぜ割り算から始めるのか — 帯分数と同じ考え方',
          m: [R`\frac{7}{3} = 2 + \frac{1}{3}`, R`\frac{N(x)}{D(x)} = (\text{商}) + \frac{(\text{余り})}{D(x)}`],
          n: R`分子の次数が分母の次数以上のときは、まず割り算して「多項式」と「分子の次数が分母より低い分数」に分けます。多項式の部分はそのまま積分できます。`,
          easy: R`仮分数 $\frac{7}{3}$ を帯分数 $2 + \frac{1}{3}$ に直すのと同じです。$7 = 3 \times 2 + 1$ という割り算から、整数部分 2 と、分子が分母より小さい分数 $\frac{1}{3}$ が出てきます。式でも同じように、$N(x) = D(x) \times (\text{商}) + (\text{余り})$ と割り算します。`,
          lv: 3
        });
        if (P.deg(N) >= P.deg(D)) {
          steps.push({
            t: '割り算する',
            m: [NT + ' = ' + (termCount(D) > 1 ? R`\left(` + P.tex(D) + R`\right)` : P.tex(D)) + (termCount(Qt) > 1 ? R`\left(` + P.tex(Qt) + R`\right)` : (P.deg(Qt) === 0 ? R` \cdot ` + U.paren(Qt[0]) : R` \cdot ` + P.tex(Qt))) +
              (P.isZero(Rm) ? '' : (termCount(Rm) === 1 ? (Rm[P.deg(Rm)].sign() < 0 ? ' - ' + P.tex(P.neg(Rm)) : ' + ' + P.tex(Rm)) : R` + \left(` + P.tex(Rm) + R`\right)`)),
              fT + ' = ' + P.tex(Qt) + (P.isZero(Rm) ? '' : R` + \frac{` + P.tex(Rm) + '}{' + denT + '}')],
            n: R`商は $` + P.tex(Qt) + R`$、余りは $` + P.tex(Rm) + R`$ です。` + (P.isZero(Rm) ? R`割り切れたので、被積分関数は多項式です。` : ''),
            easy: R`筆算の割り算と同じ手順で、最高次の項から順に商を立てていきます。最後に「分母 × 商 + 余り」が分子に一致することを確かめると安心です。`
          });
        } else {
          steps.push({ t: '割り算は不要', m: fT, n: R`分子の次数（` + P.deg(N) + R`）が分母の次数（` + P.deg(D) + R`）より低いので、そのまま分数の部分を扱います。`, easy: R`帯分数でいえば、すでに $\frac{1}{3}$ のような「真分数」になっている状態です。` });
        }
        if (!P.isZero(Rm)) {
          const RmT = P.tex(Rm), fac = factTex(dc.lead, dc.roots, dc.kind);
          if (dc.kind === 'lin') {
            steps.push({
              t: '余りの分数を 1/(x − r) の形にする',
              m: R`\frac{` + RmT + '}{' + denT + '} = ' + sumTex(terms.map((tm) => fracTerm(tm.c, tm.r, 1))),
              n: R`分母 $` + denT + R`$ の $x$ の係数でくくって、$\frac{c}{x - r}$ の形にそろえます。`
            });
          } else if (dc.kind === 'two') {
            const al = dc.roots[0], be = dc.roots[1];
            const A = P.eval(Rm, al).div(dc.lead.mul(al.sub(be))), B = P.eval(Rm, be).div(dc.lead.mul(be.sub(al)));
            steps.push({
              t: '分母を因数分解して部分分数に分ける',
              m: [R`\frac{` + RmT + '}{' + denT + '} = ' + R`\frac{` + RmT + '}{' + fac + R`} = \frac{A}{` + xMinus(al) + R`} + \frac{B}{` + xMinus(be) + '}',
                RmT + ' = ' + (dc.lead.eq(1) ? '' : U.paren(dc.lead) + R`\left\{ `) + R`A\left(` + xMinus(be) + R`\right) + B\left(` + xMinus(al) + R`\right)` + (dc.lead.eq(1) ? '' : R` \right\}`),
                R`x = ` + al.tex() + R`\ \text{を代入}:\ A = ` + A.tex() + R`,\qquad x = ` + be.tex() + R`\ \text{を代入}:\ B = ` + B.tex()],
              n: R`分母を払った式は恒等式なので、都合のよい $x$（分母が 0 になる値）を代入すると、片方の文字が消えて求まります。`,
              easy: R`$x = ` + al.tex() + R`$ を代入すると $B$ の項が $0$ になり、$A$ だけの式になります。同様に $x = ` + be.tex() + R`$ で $B$ が求まります。`
            });
          } else {
            const r = dc.roots[0];
            steps.push({
              t: '分母が重解をもつ場合の分け方',
              m: [R`\frac{` + RmT + '}{' + denT + '} = ' + R`\frac{` + RmT + '}{' + fac + '}', '= ' + sumTex(terms.map((tm) => fracTerm(tm.c, tm.r, tm.k)))],
              n: R`分子を $(x - r)$ の式で書き直し（$` + xMinus(r) + R`$ のかたまりで表し）、$\frac{A}{x-r} + \frac{B}{(x-r)^{2}}$ の形にします。`
            });
          }
        }
      } else {
        const p = v.p, q = v.q, a = v.a, b = v.b;
        steps.push({
          t: '部分分数分解とは — 通分の逆',
          m: [R`\frac{1}{x-1} - \frac{1}{x+1} = \frac{(x+1) - (x-1)}{(x-1)(x+1)} = \frac{2}{(x-1)(x+1)}`],
          n: R`分母が 1 次式の分数どうしを通分すると、分母が「1 次式の積」の分数になります。部分分数分解はこの逆向きの操作です。`,
          easy: R`$\frac{2}{(x-1)(x+1)}$ のままでは積分の公式が使えませんが、$\frac{1}{x-1} - \frac{1}{x+1}$ に分ければ、それぞれ $\log$ で積分できます。どう分ければよいかを、未知の数 $A,\ B$ をおいて求めます。`,
          lv: 3
        });
        if (!a.eq(b)) {
          const A = P.eval(N, a).div(a.sub(b)), B = P.eval(N, b).div(b.sub(a));
          steps.push({
            t: '分解の形をおく',
            m: [fT + R` = \frac{A}{` + xMinus(a) + R`} + \frac{B}{` + xMinus(b) + '}', NT + R` = A\left(` + xMinus(b) + R`\right) + B\left(` + xMinus(a) + R`\right)`],
            n: R`両辺に $(x-a)(x-b)$ を掛けて分母を払うと、すべての $x$ で成り立つ式（**恒等式**）になります。`,
            easy: R`右辺を通分すると分子は $A(x-b) + B(x-a)$ になります。これが左辺の分子 $` + NT + R`$ と同じ式になるように $A,\ B$ を決めます。`
          });
          steps.push({
            t: 'A, B を求める',
            m: [R`x = ` + a.tex() + R`\ \text{を代入}:\ ` + P.eval(N, a).tex() + R` = A \cdot ` + U.paren(a.sub(b)) + R` \;\Rightarrow\; A = ` + A.tex(), R`x = ` + b.tex() + R`\ \text{を代入}:\ ` + P.eval(N, b).tex() + R` = B \cdot ` + U.paren(b.sub(a)) + R` \;\Rightarrow\; B = ` + B.tex()],
            n: R`恒等式なので、どんな $x$ を代入しても成り立ちます。$x = a$ を代入すると $B$ の項が消えて $A$ が、$x = b$ を代入すると $A$ の項が消えて $B$ が求まります。`,
            easy: R`係数を比べる方法（$x$ の係数と定数項を比べて連立方程式を解く）でも同じ答えになりますが、代入する方が速く計算できます。`
          });
          steps.push({
            t: '検算（通分して戻す）',
            m: [R`A\left(` + xMinus(b) + R`\right) + B\left(` + xMinus(a) + R`\right) = ` + P.tex(P.add(P.scale([b.neg(), Q(1)], A), P.scale([a.neg(), Q(1)], B)))],
            n: R`展開すると分子 $` + NT + R`$ に一致するので、分解は正しいことが分かります。`,
            lv: 2
          });
        } else {
          const c0 = P.eval(N, a);
          steps.push({
            t: '分子を (x − a) の式で表す',
            m: [NT + ' = ' + (p.isZero() ? '' : (p.eq(1) ? '' : (p.eq(-1) ? '-' : p.tex())) + R`\left(` + xMinus(a) + R`\right)`) + (c0.isZero() ? '' : (p.isZero() ? c0.tex() : ' ' + U.signed(c0))), fT + ' = ' + decT],
            n: R`分母が $(x-a)^{2}$ のときは $\frac{A}{x-a} + \frac{B}{(x-a)^{2}}$ と分けます。分子を $p(x-a) + (pa + q)$ と書き直すと、$A = p = ` + p.tex() + R`$、$B = pa + q = ` + c0.tex() + R`$ です。`,
            easy: R`$\frac{p(x-a)}{(x-a)^{2}} = \frac{p}{x-a}$ と約分できるので、分子を「$(x-a)$ の倍数」と「定数」に分けておくのがコツです。`
          });
        }
      }
      // 積分
      const hasLog = terms.some((tm) => tm.k === 1), hasPow2 = terms.some((tm) => tm.k === 2);
      steps.push({
        t: '項ごとに積分する',
        m: [R`\int ` + fT + R`\,dx = \int \left(` + decT + R`\right)dx`, '= ' + FT + ' + C'],
        n: (hasLog ? R`$\int \frac{1}{x-r}\,dx = \log|x-r| + C$` : '') + (hasLog && hasPow2 ? '、' : '') + (hasPow2 ? R`$\int \frac{1}{(x-r)^{2}}\,dx = -\frac{1}{x-r} + C$` : '') + (hasLog || hasPow2 ? R` を使います。` : R`多項式を項ごとに積分します。`) + (P.isZero(Qt) ? '' : R`多項式の部分は項ごとに積分します。`),
        easy: R`$\log|x-r|$ を微分すると $\frac{1}{x-r}$ になります（絶対値は $x - r < 0$ のところでも使えるようにするため）。分子に係数があるときは、その係数を $\log$ の前に掛けるだけです。`,
        pro: R`分母の微分が分子に出てくる形 $\int \frac{f'(x)}{f(x)}\,dx = \log|f(x)| + C$ に気づけば、分解せずに済む場合もあります。`
      });
      const poles = dc.roots, Sv = exactOf(s), Tv = exactOf(t);
      const bad = poles.filter((r) => r.val() >= s - 1e-12 && r.val() <= t + 1e-12);
      let defT = null, I = null;
      if (!bad.length) {
        const Fx = (X) => terms.reduce((acc, tm) => acc.add(termV(tm, X)), pevalV(Fp, X));
        const FB = Fx(Tv), FA = Fx(Sv);
        I = FB.sub(FA);
        checkVal(I);
        defT = intTex(Sv, Tv, fT) + eqv(I);
        steps.push({
          t: '定積分を計算する',
          m: [intTex(Sv, Tv, fT) + ' = ' + bracket(FT, Sv, Tv), R`F(` + Tv.tex() + ') = ' + FB.tex(), R`F(` + Sv.tex() + ') = ' + FA.tex(), '= ' + FB.tex() + minusT(FA.tex()) + ' = ' + I.tex() + approxTail(I)],
          n: R`区間 $` + Sv.tex() + R` \le x \le ` + Tv.tex() + R`$ には分母が 0 になる点がないので、原始関数 $F(x)$ に代入して計算できます。`,
          easy: R`$\log$ の部分は、$\log a - \log b = \log\frac{a}{b}$、$\log 1 = 0$ などの性質で整理します。`
        });
      } else {
        steps.push({
          t: '定積分について',
          n: R`区間 $` + Sv.tex() + R` \le x \le ` + Tv.tex() + R`$ に分母が 0 になる点 $x = ` + bad.map((r) => r.tex()).join(R`,\ `) + R`$ が含まれるため、この区間の定積分は計算できません（グラフがそこで途切れ、値が限りなく大きくなります）。分母が 0 になる点を含まない区間を入力してください。`,
          easy: R`グラフの縦の点線（漸近線）をまたぐ区間では、面積が無限に大きくなってしまい、定積分が定義されません。`
        });
      }
      const xs = [s, t].concat(poles.map((r) => r.val()));
      const lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs), span = Math.max(1, hi - lo);
      // 区間内の値が見えるように、y の範囲は積分区間での |f| の最大値を基準にする
      const ysIn = bad.length ? [] : sample(fnum, s, t, 200).map(Math.abs);
      const mIn = ysIn.length ? Math.max(0.5, Math.max.apply(null, ysIn)) : 0;
      const fig = graph({
        x: [lo - 0.25 * span, hi + 0.25 * span],
        y: mIn ? [-3 * mIn, 3 * mIn] : null,
        curves: [{ f: fnum, cls: 'c1' }],
        vlines: poles.map((r) => ({ x: r.val(), label: 'x=' + r.toString(), cls: 'c3' })),
        fills: bad.length ? [] : [{ f: (x) => Math.max(0, fnum(x)), from: s, to: t, cls: 'f1' }, { f: (x) => Math.min(0, fnum(x)), from: s, to: t, cls: 'f2' }],
        mustY: [0]
      });
      return {
        result: [
          { label: '分解', tex: fT + ' = ' + decT },
          { label: '不定積分', tex: R`\int ` + fT + R`\,dx = ` + FT + ' + C' },
          { label: '定積分', tex: defT || R`\text{区間内で分母が 0 になるため定義されない}` }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 5. 面積・回転体の体積 ================= */

  const HALF = Q(1, 2), QUARTER = Q(1, 4);
  const AREA_FN = {
    sin: {
      T: R`\sin x`, f: Math.sin, FT: R`-\cos x`, F: (X) => V.cos(X).neg(),
      f2T: R`\sin^{2} x = \frac{1 - \cos 2x}{2}`, GT: R`\frac{x}{2} - \frac{\sin 2x}{4}`,
      G: (X) => X.mul(V.q(HALF)).sub(V.sin(X.mul(V.q(2))).mul(V.q(QUARTER)))
    },
    cos: {
      T: R`\cos x`, f: Math.cos, FT: R`\sin x`, F: (X) => V.sin(X),
      f2T: R`\cos^{2} x = \frac{1 + \cos 2x}{2}`, GT: R`\frac{x}{2} + \frac{\sin 2x}{4}`,
      G: (X) => X.mul(V.q(HALF)).add(V.sin(X.mul(V.q(2))).mul(V.q(QUARTER)))
    },
    exp: {
      T: 'e^{x}', f: Math.exp, FT: 'e^{x}', F: (X) => V.exp(X),
      f2T: R`\left(e^{x}\right)^{2} = e^{2x}`, GT: R`\frac{1}{2}e^{2x}`,
      G: (X) => V.exp(X.mul(V.q(2))).mul(V.q(HALF))
    },
    sqrt: {
      T: R`\sqrt{x}`, f: Math.sqrt, FT: R`\frac{2}{3}x\sqrt{x}`, F: (X) => V.pow(X, Q(3, 2)).mul(V.q(Q(2, 3))),
      f2T: R`\left(\sqrt{x}\right)^{2} = x`, GT: R`\frac{x^{2}}{2}`,
      G: (X) => X.mul(X).mul(V.q(HALF))
    },
    inv: {
      T: R`\frac{1}{x}`, f: (x) => 1 / x, FT: R`\log|x|`, F: (X) => V.ln(vabs(X)),
      f2T: R`\left(\frac{1}{x}\right)^{2} = \frac{1}{x^{2}}`, GT: R`-\frac{1}{x}`,
      G: (X) => X.inv().neg()
    }
  };
  function polyArea(p) {
    const Fp = P.integ(p), f2 = P.mul(p, p), Gp = P.integ(f2), T0 = P.tex(p);
    return {
      T: T0, f: P.fn(p), FT: P.tex(Fp), F: (X) => pevalV(Fp, X),
      f2T: (termCount(p) > 1 || P.deg(p) > 1 || !/^[a-z]$/.test(T0) ? R`\left(` + T0 + R`\right)^{2}` : T0 + '^{2}') + ' = ' + P.tex(f2), GT: P.tex(Gp),
      G: (X) => pevalV(Gp, X)
    };
  }
  function polyRootsIn(p, a, b) {
    const out = [];
    const rr = P.rationalRoots(p).filter((r) => r.val() > a + 1e-12 && r.val() < b - 1e-12);
    rr.forEach((r) => out.push({ v: V.q(r), x: r.val() }));
    const f = P.fn(p), NN = 3000;
    let x0 = a, y0 = f(a);
    for (let i = 1; i <= NN; i++) {
      const x1 = a + (b - a) * i / NN, y1 = f(x1);
      if (y0 * y1 < 0 && !rr.some((r) => r.val() >= x0 - 1e-12 && r.val() <= x1 + 1e-12)) {
        let lo = x0, hi = x1, flo = y0;
        for (let it = 0; it < 80; it++) { const md = (lo + hi) / 2, fm = f(md); if (flo * fm <= 0) hi = md; else { lo = md; flo = fm; } }
        out.push({ v: V.num((lo + hi) / 2), x: (lo + hi) / 2 });
      }
      x0 = x1; y0 = y1;
    }
    return out.sort((p1, p2) => p1.x - p2.x);
  }
  function trigRootsIn(off, a, b) {   // x = off·π + nπ
    const out = [];
    const n0 = Math.ceil((a - off * Math.PI) / Math.PI - 1e-12), n1 = Math.floor((b - off * Math.PI) / Math.PI + 1e-12);
    for (let n = n0; n <= n1 && out.length < 60; n++) {
      const x = (n + off) * Math.PI;
      if (x > a + 1e-9 && x < b - 1e-9) out.push({ v: V.pi(Q(n).add(Q.from(off))), x: x });
    }
    return out;
  }
  function discFig() {
    const d = JK.plot.draw(340, 200);
    d.arrow(14, 110, 330, 110, { cls: 'dim', w: 1.2 });
    d.text(326, 126, 'x', { cls: 'dim', italic: true });
    d.path('M30 78 C 90 30, 200 34, 300 58', { cls: 'c1', w: 2 });
    d.path('M30 142 C 90 190, 200 186, 300 162', { cls: 'c1', w: 1.4, dash: true });
    d.path('M168 41 A 12 69 0 1 0 168 179 A 12 69 0 1 0 168 41', { cls: 'c2', fill: 'f2' });
    d.path('M182 41 A 12 69 0 1 0 182 179 A 12 69 0 1 0 182 41', { cls: 'c2', fill: 'f2' });
    d.line(168, 41, 182, 41, { cls: 'c2', w: 1.2 });
    d.line(168, 179, 182, 179, { cls: 'c2', w: 1.2 });
    d.line(175, 110, 175, 42, { cls: 'c3', w: 1.6 });
    d.text(240, 92, '半径 |f(x)|', { cls: 'c3', size: 11 });
    d.text(175, 196, '厚さ Δx', { cls: 'c2', size: 11 });
    d.text(70, 26, 'y = f(x)', { cls: 'c1', size: 11 });
    d.text(250, 186, '円板 ≒ π{f(x)}²Δx', { cls: 'fg', size: 11 });
    return d.svg();
  }

  JK.registerCalc({
    id: 'iiic-int-area',
    course: 'IIIC',
    unit: 'm-integ3',
    group: '積分法',
    title: '面積・回転体の体積',
    desc: R`曲線 $y = f(x)$ と $x$ 軸、直線 $x = a,\ x = b$ で囲まれた部分の面積 $\int_{a}^{b} |f(x)|\,dx$ と、それを $x$ 軸のまわりに 1 回転した立体の体積 $\pi\int_{a}^{b} \{f(x)\}^{2}\,dx$ を求めます。シンプソン法による数値計算とも照合します。`,
    form: [R`S = \int_{a}^{b} |f(x)|\,dx`, R`V = \pi\int_{a}^{b} \{f(x)\}^{2}\,dx`],
    inputs: [
      { key: 'fn', label: '関数 $f(x)$', type: 'select', def: 'poly', options: [['poly', '多項式（下で入力）'], ['sin', 'sin x'], ['cos', 'cos x'], ['exp', 'eˣ'], ['sqrt', '√x'], ['inv', '1/x']] },
      { key: 'f', label: '$f(x)$', type: 'poly', def: 'x^2 - 2x', show: (r) => r.fn === 'poly' },
      { key: 'a', label: '下端 $a$', type: 'num', def: '0', hint: 'π、π/2 なども入力できます' },
      { key: 'b', label: '上端 $b$', type: 'num', def: '3' }
    ],
    examples: [
      { label: 'sin x（0〜π）', v: { fn: 'sin', a: '0', b: 'π' } },
      { label: '√x（0〜4）', v: { fn: 'sqrt', a: '0', b: '4' } },
      { label: '4 − x²', v: { fn: 'poly', f: '4 - x^2', a: '-2', b: '2' } },
      { label: 'cos x（0〜π）', v: { fn: 'cos', a: '0', b: 'π' } },
      { label: 'eˣ（0〜1）', v: { fn: 'exp', a: '0', b: '1' } }
    ],
    intro: {
      easy: R`定積分 $\int_{a}^{b} f(x)\,dx$ は、グラフが $x$ 軸より上の部分を正、下の部分を負として数えた「符号つきの面積」です。本当の**面積**を求めるときは、$x$ 軸より下の部分を $-1$ 倍して足します（$\int_{a}^{b} |f(x)|\,dx$）。また、その部分を $x$ 軸のまわりに 1 回転させてできる立体（ろくろで作るつぼのような形）の**体積**は、薄い円板を積み重ねたものと考えて $V = \pi\int_{a}^{b} \{f(x)\}^{2}\,dx$ で求められます。`,
      normal: R`面積は $f(x) = 0$ となる点で区間を分け、符号に応じて $\pm$ を付けて足します。回転体の体積は、断面の円の面積 $\pi\{f(x)\}^{2}$ を積分します。`,
      pro: R`体積は $\{f(x)\}^{2}$ を積分するので、$x$ 軸の上下は関係ありません。2 曲線の間を回転するときは「外側の円 − 内側の円」$\pi\int(f^{2} - g^{2})\,dx$ で、$\pi\int(f - g)^{2}\,dx$ としないこと。`
    },
    compute(v) {
      const a = v.a, b = v.b;
      checkRange(a, b, 100);
      let d, roots;
      switch (v.fn) {
        case 'poly':
          if (P.isZero(v.f)) throw new JK.CalcError('f(x) = 0 です。0 でない多項式を入力してください');
          if (P.deg(v.f) > 6) throw new JK.CalcError('f(x) は 6 次以下で入力してください');
          d = polyArea(v.f); roots = polyRootsIn(v.f, a, b); break;
        case 'sin': d = AREA_FN.sin; roots = trigRootsIn(0, a, b); break;
        case 'cos': d = AREA_FN.cos; roots = trigRootsIn(0.5, a, b); break;
        case 'exp':
          if (Math.abs(a) > 30 || Math.abs(b) > 30) throw new JK.CalcError('eˣ のときは区間の端を -30〜30 の範囲にしてください');
          d = AREA_FN.exp; roots = []; break;
        case 'sqrt':
          if (a < 0) throw new JK.CalcError('√x は x ≥ 0 で定義されます。a ≥ 0 にしてください');
          d = AREA_FN.sqrt; roots = []; break;
        default:
          if (a <= 0 && b >= 0) throw new JK.CalcError('1/x は x = 0 で定義されません。区間に 0 を含めないでください');
          d = AREA_FN.inv; roots = [];
      }
      if (roots.length > 40) throw new JK.CalcError('区間内で符号が変わる点が多すぎます。区間を短くしてください');
      const A = exactOf(a), B = exactOf(b);
      const pts = [{ v: A, x: a }].concat(roots, [{ v: B, x: b }]);
      const pieces = [];
      for (let i = 0; i + 1 < pts.length; i++) {
        const L = pts[i], Rt = pts[i + 1];
        const sg = d.f((L.x + Rt.x) / 2) >= 0 ? 1 : -1;
        const Iv = d.F(Rt.v).sub(d.F(L.v));
        pieces.push({ L: L, R: Rt, sg: sg, I: Iv });
      }
      const S = pieces.reduce((acc, pc) => acc.add(pc.sg > 0 ? pc.I : pc.I.neg()), V.q(0));
      const Isigned = d.F(B).sub(d.F(A));
      const Gv = d.G(B).sub(d.G(A)), Vol = V.pi(1).mul(Gv);
      checkVal(S); checkVal(Vol);
      const fT = d.T, fTi = (v.fn === 'poly' && termCount(v.f) > 1) ? R`\left(` + fT + R`\right)` : fT;
      // シンプソン法
      const Ssim = pieces.reduce((acc, pc) => acc + Math.abs(simpson(d.f, pc.L.x, pc.R.x, 10)), 0);
      const Vsim = Math.PI * simpson((x) => d.f(x) * d.f(x), a, b, 20);
      const rootTxt = roots.map((r) => r.v.tex());
      const signRow = ['f(x)'], xRow = ['x'];
      pts.forEach((pt, i) => {
        xRow.push(pt.v.txt());
        signRow.push(i === 0 || i === pts.length - 1 ? plain(d.f(pt.x), 3) : '0');
        if (i + 1 < pts.length) { xRow.push('…'); signRow.push(pieces[i].sg > 0 ? '＋' : '－'); }
      });
      const pieceLine = (pc) => R`\int_{` + pc.L.v.tex() + '}^{' + pc.R.v.tex() + '} ' + fTi + R`\,dx = ` + bracket(d.FT, pc.L.v, pc.R.v) + ' = ' + pc.I.tex();
      const absT = (pc) => (pc.sg > 0 ? pc.I.tex() : (pc.I.neg().single() || !pc.I.exact() ? pc.I.neg().tex() : R`\left(` + pc.I.neg().tex() + R`\right)`));
      const steps = [
        {
          t: '定積分と面積の関係',
          m: [R`\int_{a}^{b} f(x)\,dx = (\text{上の面積}) - (\text{下の面積})`, R`S = \int_{a}^{b} |f(x)|\,dx`],
          n: R`定積分は $x$ 軸より上を正、下を負として数えた「符号つきの面積」です。面積を求めるには、$f(x) < 0$ の部分を $-1$ 倍してから足します。`,
          easy: R`たとえば $x$ 軸の上に面積 3、下に面積 3 の部分があると、定積分は $3 - 3 = 0$ になってしまいます。本当の面積 $6$ を求めるには、符号が変わる点で区間を分けて、下側の部分は符号を反転させて足します。`,
          lv: 3
        },
        {
          t: R`$f(x) = 0$ となる点で区間を分ける`,
          m: roots.length ? [fT + R` = 0\ \text{の解のうち区間内にあるもの}:\ x = ` + rootTxt.join(R`,\ `)] : [R`\text{区間内で } ` + fT + R` = 0 \text{ となる点はない}`],
          n: roots.length ? R`これらの点で区間を分け、それぞれの区間で $f(x)$ の符号を調べます（表）。` : R`区間全体で $f(x)$ の符号は一定` + (pieces[0].sg > 0 ? R`（正）` : R`（負）`) + R`です。`,
          easy: R`グラフが $x$ 軸と交わる点が、面積の「上側」と「下側」の境目です。表の ＋ の区間はそのまま、－ の区間は $-1$ 倍して足します。`,
          fig: tableSvg([xRow, signRow], { caption: 'f(x) の符号', minW: 26 })
        },
        {
          t: '各区間の定積分',
          m: pieces.map(pieceLine),
          n: R`原始関数は $F(x) = ` + d.FT + R`$ です。` + (pieces.some((pc) => pc.sg < 0) ? R`負の区間の定積分は負の値になっています。` : ''),
          lv: pieces.length > 1 ? 1 : 2
        },
        {
          t: '面積 S',
          m: [R`S = ` + pieces.map((pc) => (pc.sg > 0 ? '' : '-') + R`\int_{` + pc.L.v.tex() + '}^{' + pc.R.v.tex() + R`} f(x)\,dx`).join(' + ').replace(/\+ -/g, '- '), '= ' + pieces.map(absT).join(' + '), '= ' + S.tex() + approxTail(S)],
          n: R`$f(x) < 0$ の区間には $-$ を付けて足します。` + (pieces.length > 1 ? R`ちなみに符号つきの定積分 $\int_{a}^{b} f(x)\,dx$ は $` + Isigned.tex() + R`$ で、面積とは異なります。` : ''),
          easy: R`面積はいつも 0 以上の値になります。各区間の面積を絶対値にして足していると考えてください。`,
          pro: R`放物線と $x$ 軸で囲まれた部分なら $\int_{\alpha}^{\beta} a(x-\alpha)(x-\beta)\,dx = -\frac{a}{6}(\beta - \alpha)^{3}$ で検算できます。`
        },
        {
          t: '回転体の体積 — 薄い円板を積み重ねる',
          m: [R`(\text{円板の体積}) \fallingdotseq \pi\{f(x)\}^{2}\,\Delta x`, R`V = \pi\int_{a}^{b} \{f(x)\}^{2}\,dx`],
          n: R`$x$ 軸に垂直な平面で立体を切ると、切り口は半径 $|f(x)|$ の円です。厚さ $\Delta x$ の円板の体積 $\pi\{f(x)\}^{2}\Delta x$ を足し合わせた極限が体積になります。`,
          easy: R`ろくろで回して作るつぼを、薄い輪切りにした様子を想像してください。1 枚 1 枚は「半径 $|f(x)|$、厚さ $\Delta x$ の円板」（円柱）で、体積は（円の面積）×（厚さ）です。これを全部足すのが積分です。`,
          fig: discFig(),
          lv: 3
        },
        {
          t: R`$\{f(x)\}^{2}$ を計算する`,
          m: d.f2T,
          n: v.fn === 'sin' || v.fn === 'cos' ? R`三角関数の 2 乗は、半角の公式（2 倍角の公式の変形）で 1 次の形に直してから積分します。` : R`2 乗した式を積分しやすい形に整理します。`,
          easy: v.fn === 'sin' || v.fn === 'cos' ? R`$\cos 2x = 1 - 2\sin^{2} x = 2\cos^{2} x - 1$ を変形すると、2 乗が消えた形になります。$\sin^{2} x$ のままでは積分の公式が使えないためです。` : R`体積では 2 乗するので、$f(x)$ が負の部分も正の値として足されます。`
        },
        {
          t: '体積 V',
          m: [R`V = \pi\int_{` + A.tex() + '}^{' + B.tex() + R`} ` + (v.fn === 'poly' ? R`\left(` + P.tex(P.mul(v.f, v.f)) + R`\right)` : '\\{' + fT + '\\}^{2}') + R`\,dx`, R`= \pi` + bracket(d.GT, A, B), R`= \pi\left\{ ` + d.G(B).tex() + minusT(d.G(A).tex()) + R` \right\}`, '= ' + Vol.tex() + approxTail(Vol)],
          n: R`原始関数 $` + d.GT + R`$ に上端・下端を代入して、最後に $\pi$ を掛けます。`,
          pro: R`$y$ 軸のまわりの回転体は $V = \pi\int x^{2}\,dy$（$x$ を $y$ で表す）、またはバウムクーヘン型 $V = 2\pi\int_{a}^{b} x|f(x)|\,dx$ で求めます。`
        },
        {
          t: 'シンプソン法で数値的に確かめる',
          m: [R`\int_{a}^{b} g(x)\,dx \fallingdotseq \frac{h}{3}\left\{ g(x_{0}) + 4g(x_{1}) + 2g(x_{2}) + \cdots + 4g(x_{n-1}) + g(x_{n}) \right\}`, R`S \fallingdotseq ` + num(Ssim) + R`\quad (\text{厳密値 } ` + num(S.val()) + ')', R`V \fallingdotseq ` + num(Vsim) + R`\quad (\text{厳密値 } ` + num(Vol.val()) + ')'],
          n: R`区間を偶数個（面積は各区間 10 等分、体積は 20 等分）に分け、隣り合う 3 点を通る放物線で曲線を近似して足し合わせる数値積分です。積分で求めた値とほぼ一致します。`,
          easy: R`長方形で近似する区分求積法より、放物線の切れはしでつなぐシンプソン法の方がずっと精度がよく、少ない分割でも正確な値に近づきます。`,
          lv: 3
        }
      ];
      // 図
      const span = b - a, f = d.f;
      const mx = Math.max.apply(null, sample((x) => Math.abs(f(x)), a, b, 300).concat([0.5]));
      const lim = Math.min(mx, 1e6) * 1.15;
      const discs = [0.25, 0.5, 0.75].map((r) => a + r * span).filter((x0) => fin(f(x0)) && Math.abs(f(x0)) > 0.02 * lim).map((x0) => {
        const rr = Math.abs(f(x0)), rx = 0.02 * span;
        return { x: (t) => x0 + rx * Math.cos(t), y: (t) => rr * Math.sin(t), t: [0, 2 * Math.PI], cls: 'c2' };
      });
      const fig = graph({
        x: [a - 0.12 * span, b + 0.12 * span], y: [-lim, lim],
        curves: [{ f: f, cls: 'c1' }, { f: (x) => -f(x), cls: 'dim', dash: true, domain: [a, b] }],
        fills: [{ f: (x) => Math.max(0, f(x)), from: a, to: b, cls: 'f1' }, { f: (x) => Math.min(0, f(x)), from: a, to: b, cls: 'f2' }],
        param: discs,
        vlines: [{ x: a, label: 'a=' + A.txt() }, { x: b, label: 'b=' + B.txt() }]
      });
      return {
        result: [
          { label: '面積 S', tex: R`S` + eqv(S) },
          { label: '回転体の体積 V', tex: R`V` + eqv(Vol) },
          { label: '定積分（符号つき）', tex: R`\int_{` + A.tex() + '}^{' + B.tex() + '} ' + fTi + R`\,dx` + eqv(Isigned) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });

  /* ================= 6. 区分求積法 ================= */

  const KB_FN = {
    sqrt: { T: R`\sqrt{x}`, f: Math.sqrt, FT: R`\frac{2}{3}x\sqrt{x}`, F: (X) => V.pow(X, Q(3, 2)).mul(V.q(Q(2, 3))) },
    exp: { T: 'e^{x}', f: Math.exp, FT: 'e^{x}', F: (X) => V.exp(X) },
    sin: { T: R`\sin x`, f: Math.sin, FT: R`-\cos x`, F: (X) => V.cos(X).neg() },
    inv1: { T: R`\frac{1}{1+x}`, f: (x) => 1 / (1 + x), FT: R`\log|1+x|`, F: (X) => V.ln(vabs(X.add(V.q(1)))) },
    inv: { T: R`\frac{1}{x}`, f: (x) => 1 / x, FT: R`\log|x|`, F: (X) => V.ln(vabs(X)) }
  };
  // Σ_{k=1}^{n} k^j（j = 0..m）を n の多項式で
  function faulhaber(mMax) {
    const F = [[Q(0), Q(1)]];
    for (let m = 1; m <= mMax; m++) {
      let pw = [Q(1)];
      for (let i = 0; i < m + 1; i++) pw = P.mul(pw, [Q(1), Q(1)]);
      let acc = P.sub(pw, [Q(1)]);
      for (let j = 0; j < m; j++) acc = P.sub(acc, P.scale(F[j], Q(U.nCr(m + 1, j))));
      F.push(P.scale(acc, Q(1, m + 1)));
    }
    return F;
  }
  // 多項式 f の S_n を 1/n の多項式（係数 e_s）で
  function polySn(p, a, b, left) {
    const deg = P.deg(p), L = b.sub(a), Fh = faulhaber(Math.max(1, deg));
    // f(a + y) = Σ d_j y^j
    let dcoef = [Q(0)];
    for (let i = p.length - 1; i >= 0; i--) dcoef = P.add(P.mul(dcoef, [a, Q(1)]), [p[i]]);
    const e = [];
    for (let s2 = 0; s2 <= deg + 1; s2++) e.push(Q(0));
    for (let j = 0; j <= deg; j++) {
      const dj = dcoef[j] || Q(0);
      if (dj.isZero()) continue;
      let G = Fh[j].slice();
      if (left && j >= 1) { const nj = []; for (let i = 0; i < j; i++) nj.push(Q(0)); nj.push(Q(1)); G = P.sub(G, nj); }
      const fac = dj.mul(L.pow(j + 1));
      for (let i = 0; i < G.length; i++) {
        const s2 = j + 1 - i;
        if (s2 >= 0 && s2 < e.length && !G[i].isZero()) e[s2] = e[s2].add(fac.mul(G[i]));
      }
    }
    return e;
  }
  const SUBN = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  function subN(n) { return String(n).split('').map((c) => SUBN[c] || c).join(''); }

  JK.registerCalc({
    id: 'iiic-int-kubun',
    course: 'IIIC',
    unit: 'm-integ3',
    group: '積分法',
    title: '区分求積法',
    desc: R`区間を $n$ 等分した長方形の面積の和 $S_{n}$ を $n = 4,\ 10,\ 100,\ 1000$ で計算し、$n \to \infty$ の極限が定積分に一致することを確かめます。多項式なら $S_{n}$ を $n$ の式で表して極限を求めます。`,
    form: [R`S_{n} = \frac{b-a}{n}\sum_{k=1}^{n} f\left(a + \frac{k(b-a)}{n}\right)`, R`\lim_{n \to \infty} S_{n} = \int_{a}^{b} f(x)\,dx`],
    inputs: [
      { key: 'fn', label: '関数 $f(x)$', type: 'select', def: 'poly', options: [['poly', '多項式（下で入力）'], ['sqrt', '√x'], ['exp', 'eˣ'], ['sin', 'sin x'], ['inv1', '1/(1+x)'], ['inv', '1/x']] },
      { key: 'f', label: '$f(x)$', type: 'poly', def: 'x^2', show: (r) => r.fn === 'poly' },
      { key: 'a', label: '区間の左端 $a$', type: 'num', def: '0' },
      { key: 'b', label: '区間の右端 $b$', type: 'num', def: '1' },
      { key: 'side', label: '長方形の高さ', type: 'select', def: 'right', options: [['right', '右端の値（k = 1, …, n）'], ['left', '左端の値（k = 0, …, n−1）']] },
      { key: 'm', label: '図の分割数 $n$', type: 'int', def: '4', min: 1, max: 40 }
    ],
    examples: [
      { label: 'x³', v: { fn: 'poly', f: 'x^3', a: '0', b: '1', side: 'right', m: '5' } },
      { label: '1/(1+x) → log 2', v: { fn: 'inv1', a: '0', b: '1', side: 'right', m: '6' } },
      { label: '√x（左端）', v: { fn: 'sqrt', a: '0', b: '1', side: 'left', m: '8' } },
      { label: 'sin x（0〜π）', v: { fn: 'sin', a: '0', b: 'π', side: 'right', m: '6' } }
    ],
    intro: {
      easy: R`曲線で囲まれた部分の面積は、長方形や三角形の公式ではそのまま求められません。そこで区間を $n$ 等分して**細い長方形**で近似し、長方形の面積の和を計算します。$n$ を大きくするほど、長方形のはみ出しや不足は小さくなり、$n \to \infty$ の極限で正確な面積（定積分）に一致します。これが**区分求積法**で、定積分の定義そのものです。`,
      normal: R`$\lim_{n \to \infty} \frac{1}{n}\sum_{k=1}^{n} f\left(\frac{k}{n}\right) = \int_{0}^{1} f(x)\,dx$。一般に $\lim_{n \to \infty} \frac{b-a}{n}\sum_{k=1}^{n} f\left(a + \frac{k(b-a)}{n}\right) = \int_{a}^{b} f(x)\,dx$ です。`,
      pro: R`和の極限は、$\frac{1}{n}$ をくくり出して和の中身を $\frac{k}{n}$ の関数にそろえるのが定石。$\sum_{k=1}^{n} \frac{1}{n+k} = \frac{1}{n}\sum_{k=1}^{n} \frac{1}{1 + \frac{k}{n}} \to \int_{0}^{1} \frac{1}{1+x}\,dx = \log 2$ が典型例です。`
    },
    compute(v) {
      const a = v.a, b = v.b, left = v.side === 'left', M = v.m;
      checkRange(a, b, 100);
      let d;
      if (v.fn === 'poly') {
        if (P.isZero(v.f)) throw new JK.CalcError('f(x) = 0 です。0 でない多項式を入力してください');
        if (P.deg(v.f) > 6) throw new JK.CalcError('f(x) は 6 次以下で入力してください');
        const Fp = P.integ(v.f);
        d = { T: P.tex(v.f), f: P.fn(v.f), FT: P.tex(Fp), F: (X) => pevalV(Fp, X) };
      } else {
        d = KB_FN[v.fn] || KB_FN.sqrt;
        if (v.fn === 'sqrt' && a < 0) throw new JK.CalcError('√x は x ≥ 0 で定義されます。a ≥ 0 にしてください');
        if (v.fn === 'exp' && (Math.abs(a) > 30 || Math.abs(b) > 30)) throw new JK.CalcError('eˣ のときは区間の端を -30〜30 の範囲にしてください');
        if (v.fn === 'inv1' && a <= -1 && b >= -1) throw new JK.CalcError('x = -1 で 1/(1+x) が定義されません。区間に -1 を含めないでください');
        if (v.fn === 'inv' && a <= 0 && b >= 0) throw new JK.CalcError('x = 0 で 1/x が定義されません。区間に 0 を含めないでください');
      }
      const f = d.f, A = exactOf(a), B = exactOf(b);
      const Sn = (n) => { const h = (b - a) / n; let s = 0; for (let k = left ? 0 : 1; k <= (left ? n - 1 : n); k++) s += f(a + k * h); return s * h; };
      const I = d.F(B).sub(d.F(A));
      checkVal(I);
      const Iv = I.val();
      const NS = [4, 10, 100, 1000];
      const k0 = left ? 0 : 1, k1 = left ? 'n-1' : 'n';
      const LT = B.sub(A), unit01 = A.isZero() && B.isQ() && B.q().eq(1);
      const dxT = unit01 ? R`\frac{1}{n}` : R`\frac{` + LT.tex() + '}{n}';
      const LTk = (LT.isQ() && LT.q().eq(1) ? '' : (LT.single() ? LT.tex() + ' ' : R`\left(` + LT.tex() + R`\right)`)) + 'k';
      const xkT = unit01 ? R`\frac{k}{n}` : (A.isZero() ? R`\frac{` + LTk + '}{n}' : A.tex() + R` + \frac{` + LTk + '}{n}');
      const SnT = R`S_{n} = ` + dxT + R`\sum_{k=` + k0 + '}^{' + k1 + R`} f\left(` + xkT + R`\right)`;
      // 図の n = M の内訳
      const hM = (b - a) / M, ks = [];
      for (let k = left ? 0 : 1; k <= (left ? M - 1 : M); k++) ks.push(k);
      const vals = ks.map((k) => f(a + k * hM));
      const SM = Sn(M);
      const vItem = (y) => ({ neg: y < 0, body: num(Math.abs(y), 5) });
      const listT = vals.length <= 6 ? sumTex(vals.map(vItem)) : sumTex(vals.slice(0, 3).map(vItem).concat([{ neg: false, body: R`\cdots` }, vItem(vals[vals.length - 1])]));
      const steps = [
        {
          t: '区分求積法とは — 細い長方形で面積を近似する',
          m: [R`(\text{面積}) \fallingdotseq (\text{長方形の面積の和}) = S_{n}`, R`\lim_{n \to \infty} S_{n} = \int_{a}^{b} f(x)\,dx`],
          n: R`区間 $` + A.tex() + R` \le x \le ` + B.tex() + R`$ を $n$ 等分し、各小区間の` + (left ? '左端' : '右端') + R`での $f(x)$ の値を高さとする長方形を並べます。その面積の和 $S_{n}$ は、$n \to \infty$ で定積分に近づきます。`,
          easy: R`図の長方形を見てください。長方形の上の辺は曲線から少しはみ出したり、足りなかったりします。$n$ を 2 倍、10 倍と増やすと長方形は細くなり、このずれはどんどん小さくなります。限りなく細かくした行き着く先が、正確な面積（定積分）です。`,
          lv: 3
        },
        {
          t: '長方形の幅と高さ',
          m: [R`\Delta x = \frac{b-a}{n} = ` + dxT, R`x_{k} = a + k\Delta x = ` + xkT],
          n: R`幅はどれも $\Delta x$、$k$ 番目の長方形の高さは $f(x_{k})$ です（$k = ` + k0 + R`,\ \ldots,\ ` + k1 + R`$）。`,
          easy: R`$k$ は「左から何番目の分点か」を表す番号です。$x_{0} = a$ から始めて、$\Delta x$ ずつ右へ進んだ点が $x_{1},\ x_{2},\ \ldots$ です。`
        },
        {
          t: R`長方形の面積の和 $S_{n}$`,
          m: [R`S_{n} = \sum_{k=` + k0 + '}^{' + k1 + R`} f(x_{k})\,\Delta x`, SnT],
          n: R`和の記号 $\sum$ は、$k$ を ` + k0 + R` から ` + (left ? 'n − 1' : 'n') + R` まで変えて足し合わせることを表します。`,
          easy: R`（長方形 1 個の面積）＝（高さ $f(x_{k})$）×（幅 $\Delta x$）。これを $n$ 個分足したものが $S_{n}$ です。`
        },
        {
          t: R`図の場合（$n = ` + M + R`$）`,
          m: [R`\Delta x = ` + num(hM, 5), R`S_{` + M + R`} = ` + num(hM, 5) + R` \times \left(` + listT + R`\right)`, R`\fallingdotseq ` + num(SM)],
          n: R`$n = ` + M + R`$ のときの長方形の高さを順に足して幅を掛けました。`,
          lv: 2
        }
      ];
      if (v.fn === 'poly' && A.isQ() && B.isQ() && P.deg(v.f) <= 6) {
        const e = polySn(v.f, A.q(), B.q(), left);
        const items = [];
        e.forEach((c, s2) => { if (!c.isZero()) items.push(mono(c, -s2, 'n')); });
        steps.push({
          t: R`$S_{n}$ を $n$ の式で表す`,
          m: [R`S_{n} = ` + sumTex(items), R`\lim_{n \to \infty} S_{n} = ` + e[0].tex()],
          n: R`和の公式 $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$、$\sum_{k=1}^{n} k^{2} = \frac{n(n+1)(2n+1)}{6}$、$\sum_{k=1}^{n} k^{3} = \left\{\frac{n(n+1)}{2}\right\}^{2}$ などを使って整理すると、$S_{n}$ は $\frac{1}{n}$ の多項式になります。$\frac{1}{n} \to 0$ なので、定数項だけが残ります。`,
          easy: R`$\frac{1}{n}$ や $\frac{1}{n^{2}}$ の項は、$n$ を大きくすると 0 に近づく「誤差」の部分です。残る定数項が、求める面積です。`,
          lv: 2
        });
      }
      steps.push(
        {
          t: R`$n$ を大きくしていく`,
          m: NS.map((n) => R`S_{` + n + R`} \fallingdotseq ` + num(Sn(n))),
          n: R`$n$ を大きくすると、$S_{n}$ は $` + num(Iv) + R`$ に近づいていきます（表）。`,
          easy: R`表の「誤差」の列を見ると、$n$ を 10 倍にするごとに誤差がおよそ $\frac{1}{10}$ になっています。`,
          fig: tableSvg([['n', 'Sₙ', '誤差 Sₙ − 定積分']].concat(NS.map((n) => [String(n), plain(Sn(n), 6), plain(Sn(n) - Iv, 6)])), { caption: '長方形の面積の和 Sₙ' })
        },
        {
          t: '極限は定積分',
          m: [R`\lim_{n \to \infty} S_{n} = \int_{` + A.tex() + '}^{' + B.tex() + '} ' + (v.fn === 'poly' && termCount(v.f) > 1 ? R`\left(` + d.T + R`\right)` : d.T) + R`\,dx`, '= ' + bracket(d.FT, A, B), '= ' + I.tex() + approxTail(I)],
          n: R`区分求積法の極限は定積分そのものなので、原始関数 $` + d.FT + R`$ を使って正確な値が求められます。`,
          pro: R`入試では逆向きに、和の極限 $\lim_{n \to \infty} \frac{1}{n}\sum_{k=1}^{n} f\left(\frac{k}{n}\right)$ を見たら $\int_{0}^{1} f(x)\,dx$ に直して計算します。`
        }
      );
      // 図: 長方形
      const fills = [], segs = [];
      for (let i = 0; i < M; i++) {
        const xl = a + i * hM, xr = xl + hM, y = f(left ? xl : xr);
        if (!fin(y)) continue;
        fills.push({ f: () => y, from: xl, to: xr, cls: y >= 0 ? 'f2' : 'f3' });
        segs.push({ x1: xl, y1: 0, x2: xl, y2: y, cls: 'c2' }, { x1: xl, y1: y, x2: xr, y2: y, cls: 'c2' }, { x1: xr, y1: y, x2: xr, y2: 0, cls: 'c2' });
      }
      const span = b - a;
      const fig = graph({
        x: [a - 0.1 * span, b + 0.1 * span],
        curves: [{ f: f, cls: 'c1' }],
        fills: fills, segs: segs, mustY: [0]
      });
      return {
        result: [
          { label: '極限（定積分）', tex: R`\lim_{n \to \infty} S_{n}` + eqv(I) },
          { label: 'n = 10 の和 S' + subN(10), tex: R`\fallingdotseq ` + num(Sn(10)) },
          { label: 'n = 100 の和 S' + subN(100), tex: R`\fallingdotseq ` + num(Sn(100)) },
          { label: '図の n = ' + M + ' の和', tex: R`S_{` + M + R`} \fallingdotseq ` + num(SM) }
        ],
        steps: steps,
        fig: fig
      };
    }
  });
})();
