/* 数III・C — 微分法
   積の微分 / 商の微分 / 合成関数の微分（流れ図） / いろいろな関数の増減・極値（増減表） / 接線・法線
   構成は ia-quad.js に準拠（intro → result → steps(easy/pro/lv) → fig）。
   e・π・√・log を含む値は厳密値 V（c·√r·π^k·e^(p+qπ)·記号 の和）で表し、表せない場合は近似値に切り替える。 */
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
      let w = opt.minW || 30;
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
  function graph(o) {
    let x0 = o.x[0], x1 = o.x[1];
    if (!(fin(x0) && fin(x1) && x1 > x0)) { x0 = -5; x1 = 5; }
    o.x = [x0, x1];
    if (!o.y || !(fin(o.y[0]) && fin(o.y[1]) && o.y[1] > o.y[0])) {
      let s = [];
      (o.curves || []).forEach((c) => {
        if (c.noScale) return;
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
    if (!items.length) return '0';
    return items.map((t, i) => (i === 0 ? (t.neg ? '-' : '') : (t.neg ? ' - ' : ' + ')) + t.body).join('');
  }
  function termCount(p) { return p.filter((c) => !c.isZero()).length; }
  function polyItems(p) {
    const out = [];
    for (let k = p.length - 1; k >= 0; k--) if (!p[k].isZero()) out.push(mono(p[k], k, 'x'));
    return out;
  }
  // 多項式（図の文字用）
  function polyTxt(p, v) {
    v = v || 'x';
    const parts = [];
    for (let k = p.length - 1; k >= 0; k--) {
      const c = p[k];
      if (c.isZero()) continue;
      const a = c.abs();
      let co = (a.eq(1) && k > 0) ? '' : (a.d === 1 ? String(a.n) : (k > 0 ? '(' + a.n + '/' + a.d + ')' : a.n + '/' + a.d));
      const vv = k === 0 ? '' : (k === 1 ? v : v + sup(k));
      parts.push((parts.length ? (c.sign() < 0 ? ' − ' : ' + ') : (c.sign() < 0 ? '−' : '')) + co + vv);
    }
    return parts.length ? parts.join('') : '0';
  }
  // 多項式 P と関数 G の積の TeX（{neg, body}）
  function pfItem(Pp, G) {
    const n = termCount(Pp);
    if (n === 0) return null;
    if (P.deg(Pp) === 0) {
      const c = Pp[0];
      return { neg: c.sign() < 0, body: (c.abs().eq(1) ? '' : c.abs().tex()) + G };
    }
    if (n === 1) {
      const lead = Pp[P.deg(Pp)];
      return { neg: lead.sign() < 0, body: P.tex(lead.sign() < 0 ? P.scale(Pp, -1) : Pp) + G };
    }
    return { neg: false, body: R`\left(` + P.tex(Pp) + R`\right)` + G };
  }
  function pfTex(Pp, G) { const it = pfItem(Pp, G); return it ? sumTex([it]) : '0'; }
  function wrapP(p) { return termCount(p) > 1 ? R`\left(` + P.tex(p) + R`\right)` : P.tex(p); }

  /* ================= 厳密値 V ================= */

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
    const joinT = (arr) => (tex ? arr.join(' ') : arr.reduce((s, x, i) => s + (i > 0 && /^[a-z]/.test(x) ? ' ' : '') + x, ''));
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
      if (plainT(t)) {
        const base = t.c.isInt() ? t.c.tex() : R`\left(` + t.c.tex() + R`\right)`;
        return V.sym(base + '^{' + k.tex() + '}', Math.pow(t.c.val(), k.val()), (t.c.isInt() ? t.c.toString() : '(' + t.c.toString() + ')') + '^(' + k.toString() + ')');
      }
    }
    const xv = x.val();
    if (xv < 0 && !k.isInt()) return V.num(NaN);
    return V.num(Math.pow(xv, k.val()));
  };
  // 入力された数（π/6, e, 3/4 など）を厳密値に
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
  function vfull(v) { return v.exact() ? v.tex() + approxTail(v) : R`\fallingdotseq ` + num(v.ax); }
  // 代入表示用（負・多項なら括弧）
  function pv(v) {
    if (!v.exact()) return v.ax < 0 ? R`\left(` + num(v.ax) + R`\right)` : num(v.ax);
    if (v.isZero()) return '0';
    return (v.single() && v.t[0].c.sign() > 0) ? v.tex() : R`\left(` + v.tex() + R`\right)`;
  }
  // 「- v」の連結（y - y0 など）
  function minusV(v) {
    if (v.isZero()) return '';
    if (v.single() && v.sign() < 0) return ' + ' + v.neg().tex();
    if (!v.exact()) return v.ax < 0 ? ' + ' + num(-v.ax) : ' - ' + num(v.ax);
    return v.single() ? ' - ' + v.tex() : R` - \left(` + v.tex() + R`\right)`;
  }
  function plusV(v) {
    if (v.isZero()) return '';
    const s = v.tex();
    return s.charAt(0) === '-' ? ' - ' + s.slice(1) : ' + ' + s;
  }
  // y = Ax + B
  function lineTex(A, B) {
    let s;
    if (A.isZero()) s = '';
    else if (A.exact() && A.single()) { const t = A.tex(); s = t === '1' ? 'x' : (t === '-1' ? '-x' : t + 'x'); }
    else if (!A.exact()) s = num(A.ax) + 'x';
    else s = R`\left(` + A.tex() + R`\right)x`;
    if (B.isZero()) return 'y = ' + (s || '0');
    if (!s) return 'y = ' + B.tex();
    return 'y = ' + s + plusV(B);
  }
  function dnum(f, x) { const h = 1e-5 * Math.max(1, Math.abs(x)); return (f(x + h) - f(x - h)) / (2 * h); }

  /* ================= 1. 積の微分 ================= */

  const GFN = {
    exp: { T: 'e^{x}', dT: 'e^{x}', f: Math.exp, df: Math.exp, V: (X) => V.exp(X), dV: (X) => V.exp(X), rule: R`$(e^{x})' = e^{x}$`, easy: R`$e^{x}$ は微分しても形が変わらない特別な関数です（$e = 2.718\ldots$ はそうなるように選ばれた数）。` },
    sin: { T: R`\sin x`, dT: R`\cos x`, f: Math.sin, df: Math.cos, V: (X) => V.sin(X), dV: (X) => V.cos(X), rule: R`$(\sin x)' = \cos x$`, easy: R`$y = \sin x$ のグラフの各点での接線の傾きをたどると、ちょうど $y = \cos x$ のグラフになります（$x = 0$ で傾き 1、$x = \frac{\pi}{2}$ で傾き 0）。` },
    cos: { T: R`\cos x`, dT: R`-\sin x`, f: Math.cos, df: (x) => -Math.sin(x), V: (X) => V.cos(X), dV: (X) => V.sin(X).neg(), rule: R`$(\cos x)' = -\sin x$`, easy: R`$y = \cos x$ は $x = 0$ で山の頂上（傾き 0）、そこから下り坂になるので、導関数は $-\sin x$ です。` },
    log: { T: R`\log x`, dT: R`\frac{1}{x}`, f: Math.log, df: (x) => 1 / x, V: (X) => V.ln(X), dV: (X) => V.of(X).inv(), rule: R`$(\log x)' = \frac{1}{x}$`, easy: R`$y = \log x$ は $x$ が大きいほどゆるやかに増えるグラフで、接線の傾きは $\frac{1}{x}$ です。` }
  };

  function rectFig() {
    const d = JK.plot.draw(300, 210);
    const x0 = 40, y0 = 30, W = 170, H = 120, dw = 46, dh = 32;
    d.rect(x0, y0 + dh, W, H, { cls: 'c1', fill: 'f1' });
    d.rect(x0 + W, y0 + dh, dw, H, { cls: 'c2', fill: 'f2' });
    d.rect(x0, y0, W, dh, { cls: 'c3', fill: 'f3' });
    d.rect(x0 + W, y0, dw, dh, { cls: 'dim', fill: 'f0' });
    d.text(x0 + W / 2, y0 + dh + H / 2 + 4, 'f · g', { size: 13, italic: true });
    d.text(x0 + W + dw / 2, y0 + dh + H / 2 + 4, 'Δf·g', { size: 11 });
    d.text(x0 + W / 2, y0 + dh / 2 + 4, 'f·Δg', { size: 11 });
    d.text(x0 + W + dw / 2, y0 + dh / 2 + 4, 'ΔfΔg', { size: 9 });
    d.text(x0 + W / 2, y0 + dh + H + 16, '← f →', { size: 11 });
    d.text(x0 + W + dw / 2, y0 + dh + H + 16, 'Δf', { size: 11 });
    d.text(x0 - 14, y0 + dh + H / 2 + 4, 'g', { size: 12, italic: true });
    d.text(x0 - 14, y0 + dh / 2 + 4, 'Δg', { size: 11 });
    d.text(150, 204, '面積の増え方 ≒ Δf·g + f·Δg', { size: 11 });
    return d.svg();
  }

  JK.registerCalc({
    id: 'iiic-diff-prod',
    course: 'IIIC',
    unit: 'm-diff3',
    group: '微分法',
    title: '積の微分',
    desc: R`$f(x)$（多項式）と $g(x)$（多項式・$e^{x}$・$\sin x$・$\cos x$・$\log x$）の積を、公式 $\{f(x)g(x)\}' = f'(x)g(x) + f(x)g'(x)$ で微分し、整理します。$x = a$ での微分係数と接線の図も表示します。`,
    form: R`\{f(x)g(x)\}' = f'(x)g(x) + f(x)g'(x)`,
    inputs: [
      { key: 'f', label: '$f(x)$（多項式）', type: 'poly', def: 'x^2 + 1' },
      { key: 'g', label: '$g(x)$ の種類', type: 'select', def: 'exp', options: [['exp', 'e^x'], ['sin', 'sin x'], ['cos', 'cos x'], ['log', 'log x'], ['poly', '多項式（下に入力）']] },
      { key: 'g2', label: '$g(x)$（多項式）', type: 'poly', def: 'x - 3', show: (raw) => raw.g === 'poly' },
      { key: 'a', label: '微分係数を求める点 $x = a$', type: 'num', def: '1', min: -20, max: 20, hint: 'π/6 や e などの入力もできます' }
    ],
    examples: [
      { label: '多項式 × 多項式', v: { f: '2x + 1', g: 'poly', g2: 'x^2 - 3x', a: '1' } },
      { label: 'x sin x', v: { f: 'x', g: 'sin', a: 'π/2' } },
      { label: 'x² log x', v: { f: 'x^2', g: 'log', a: 'e' } },
      { label: '(x − 1) cos x', v: { f: 'x - 1', g: 'cos', a: '0' } }
    ],
    intro: {
      easy: R`**微分**は「$x$ を少し増やしたとき、$y$ がどれだけの割合で変わるか（グラフの接線の傾き）」を表す計算です。2 つの関数の積 $f(x)g(x)$ は、縦 $g$・横 $f$ の**長方形の面積**と考えるとイメージしやすくなります。$x$ が少し増えると横が $\Delta f$、縦が $\Delta g$ だけのび、面積は「右の細長い部分 $\Delta f \cdot g$」と「上の細長い部分 $f \cdot \Delta g$」の分だけ増えます（角の小さな部分は無視できるほど小さい）。これが積の微分の公式 $(fg)' = f'g + fg'$ の正体です。`,
      normal: R`「前を微分 × 後ろそのまま + 前そのまま × 後ろを微分」。最後に共通因数（$e^{x}$ など）でくくって整理します。`,
      pro: R`$e^{x}$ を含む積は $e^{x}$ でくくると、増減を調べるときに符号が多項式部分だけで判定できます。3 つの積は $(fgh)' = f'gh + fg'h + fgh'$。`
    },
    compute(v) {
      const f = v.f, gk = GFN[v.g] ? v.g : (v.g === 'poly' ? 'poly' : 'exp');
      if (P.deg(f) > 6) throw new JK.CalcError('f(x) の次数は 6 以下にしてください');
      if (P.isZero(f)) throw new JK.CalcError('f(x) が 0 だと積も 0 になります。0 以外の多項式を入力してください');
      const fp = P.deriv(f), fT = P.tex(f), fpT = P.tex(fp);
      const a = v.a, A = exactOf(a);
      let gT, gpT, gF, gdF, gV, gdV, rule, geasy, finalT, g2 = null, g2p = null;
      const steps = [];
      if (gk === 'poly') {
        g2 = v.g2 || P.parse('x - 3');
        if (P.deg(g2) > 6) throw new JK.CalcError('g(x) の次数は 6 以下にしてください');
        g2p = P.deriv(g2);
        gT = P.tex(g2); gpT = P.tex(g2p);
        gF = P.fn(g2); gdF = P.fn(g2p);
        gV = (X) => pevalV(g2, X); gdV = (X) => pevalV(g2p, X);
        rule = R`$(x^{n})' = nx^{n-1}$`;
        geasy = R`多項式は項ごとに $(x^{n})' = nx^{n-1}$ で微分します（数IIと同じ）。`;
      } else {
        const G = GFN[gk];
        gT = G.T; gpT = G.dT; gF = G.f; gdF = G.df; gV = G.V; gdV = G.dV; rule = G.rule; geasy = G.easy;
      }
      if (gk === 'log' && !(a > 0)) throw new JK.CalcError('log x は x > 0 で定義されます。a は正の値にしてください');
      const F = (x) => P.eval(f, x) * gF(x), dF = (x) => P.eval(fp, x) * gF(x) + P.eval(f, x) * gdF(x);
      steps.push({
        t: 'そもそも積の微分とは — 長方形の面積で考える',
        m: [R`\Delta(fg) = \Delta f \cdot g + f \cdot \Delta g + \Delta f \cdot \Delta g`, R`\frac{\Delta(fg)}{\Delta x} = \frac{\Delta f}{\Delta x} g + f \frac{\Delta g}{\Delta x} + \frac{\Delta f}{\Delta x}\Delta g \;\to\; f'g + fg'`],
        n: R`$x$ が $\Delta x$ だけ増えたときの $f$ と $g$ の増加量を $\Delta f,\ \Delta g$ とすると、積 $fg$（長方形の面積）の増加量は上の 1 行目です。$\Delta x$ で割って $\Delta x \to 0$ とすると、最後の項は $\Delta g \to 0$ のため消えます。`,
        easy: R`図の長方形で、横 $f$・縦 $g$ がそれぞれ少しのびると、面積は右の帯（$\Delta f \cdot g$）と上の帯（$f \cdot \Delta g$）と、右上の小さな角（$\Delta f \cdot \Delta g$）の分だけ増えます。角は「小さい × 小さい」なので、変化の割合を考えるときには消えてしまいます。`,
        fig: rectFig(),
        lv: 3
      });
      steps.push({
        t: 'それぞれの関数を微分する',
        m: [R`f(x) = ` + fT + R`,\quad f'(x) = ` + fpT, R`g(x) = ` + gT + R`,\quad g'(x) = ` + gpT],
        n: R`多項式は $(x^{n})' = nx^{n-1}$、$g(x)$ には ` + rule + R` を使います。`,
        easy: geasy
      });
      const subst = R`\{f(x)g(x)\}' = f'(x)g(x) + f(x)g'(x)`;
      const line2 = '= ' + wrapP(fp) + (gk === 'poly' ? wrapP(g2) : (termCount(fp) > 1 || P.deg(fp) > 0 ? R` \cdot ` : '') + gT) + ' + ' + wrapP(f) + (gk === 'poly' ? wrapP(g2p) : R` \cdot ` + (gk === 'cos' ? R`\left(-\sin x\right)` : gpT));
      steps.push({
        t: '積の微分の公式に当てはめる',
        m: [subst, line2],
        n: R`$f'(x) = ` + fpT + R`$、$g'(x) = ` + gpT + R`$ を代入します。`,
        easy: R`「前を微分 × 後ろはそのまま」＋「前はそのまま × 後ろを微分」と唱えながら当てはめると間違えません。`
      });
      let dVal;
      if (gk === 'poly') {
        const t1 = P.mul(fp, g2), t2 = P.mul(f, g2p), sum = P.add(t1, t2);
        finalT = P.tex(sum);
        steps.push({
          t: '展開して整理する',
          m: [R`f'(x)g(x) = ` + wrapP(fp) + wrapP(g2) + ' = ' + P.tex(t1), R`f(x)g'(x) = ` + wrapP(f) + wrapP(g2p) + ' = ' + P.tex(t2), R`\{f(x)g(x)\}' = ` + finalT],
          n: R`2 つの積をそれぞれ展開して、同類項をまとめます。`,
          easy: R`確かめ: 先に $f(x)g(x) = ` + P.tex(P.mul(f, g2)) + R`$ と展開してから微分しても、同じ結果 $` + finalT + R`$ になります。`,
          pro: R`多項式どうしなら先に展開して微分してもよい。公式は「展開が大変な積（$(x^{2}+1)^{3}(2x-1)^{4}$ など）」で威力を発揮します。`
        });
        dVal = pevalV(sum, A);
      } else if (gk === 'exp') {
        const s = P.add(fp, f);
        finalT = pfTex(s, 'e^{x}');
        steps.push({
          t: R`$e^{x}$ でくくって整理する`,
          m: R`\{f(x)g(x)\}' = \left\{` + fpT + ' + ' + (termCount(f) > 1 ? R`\left(` + fT + R`\right)` : fT) + R`\right\}e^{x} = ` + finalT,
          n: R`2 つの項に共通の $e^{x}$ をくくり出し、多項式部分 $f'(x) + f(x)$ をまとめます。`,
          easy: R`$e^{x}$ はつねに正の数です。くくり出しておくと、「導関数の符号 = 多項式部分の符号」とすぐに分かり、増減を調べるときに便利です。`,
          pro: R`$\{f(x)e^{x}\}' = \{f'(x) + f(x)\}e^{x}$ は形ごと覚えておくと速い。`
        });
        dVal = pevalV(s, A).mul(V.exp(A));
      } else if (gk === 'sin' || gk === 'cos') {
        const it1 = pfItem(fp, gk === 'sin' ? R`\sin x` : R`\cos x`);
        const it2 = pfItem(gk === 'sin' ? f : P.scale(f, -1), gk === 'sin' ? R`\cos x` : R`\sin x`);
        finalT = sumTex([it1, it2].filter(Boolean));
        steps.push({
          t: '整理する',
          m: R`\{f(x)g(x)\}' = ` + finalT,
          n: gk === 'sin' ? R`$\sin x$ の項と $\cos x$ の項に分けて書きます。` : R`$\cos x$ の項と $\sin x$ の項に分けて書きます。$(\cos x)' = -\sin x$ の符号に注意します。`,
          easy: R`$\sin x$ と $\cos x$ は別の関数なので、これ以上はまとめられません。`,
          pro: R`$x\sin x$ や $x\cos x$ の微分は、部分積分（$\int x\sin x\,dx$ など）の検算にも使えます。`
        });
        dVal = pevalV(fp, A).mul(gk === 'sin' ? V.sin(A) : V.cos(A)).add(pevalV(f, A).mul(gk === 'sin' ? V.cos(A) : V.sin(A).neg()));
      } else {
        const dm = P.divmod(f, [Q(0), Q(1)]), h = dm.q, c0 = dm.r[0];
        const items = [pfItem(fp, R`\log x`)].concat(polyItems(h)).concat(c0.isZero() ? [] : [mono(c0, -1, 'x')]).filter(Boolean);
        finalT = sumTex(items);
        steps.push({
          t: R`$\frac{f(x)}{x}$ を整理する`,
          m: [R`\{f(x)g(x)\}' = ` + pfTex(fp, R`\log x`) + R` + \frac{` + fT + '}{x}', '= ' + finalT],
          n: R`$f(x) \cdot \frac{1}{x}$ は、分子の各項を $x$ で割って簡単にします。`,
          easy: R`$\frac{x^{2} + 1}{x} = x + \frac{1}{x}$ のように、項ごとに割り算するだけです。`,
          pro: R`$(x\log x)' = \log x + 1$、$(x^{2}\log x)' = 2x\log x + x$ はよく使う形です。`
        });
        dVal = pevalV(fp, A).mul(V.ln(A)).add(pevalV(f, A).mul(A.inv()));
      }
      const fa = pevalV(f, A), fpa = pevalV(fp, A), ga = gV(A), gpa = gdV(A);
      const nd = dnum(F, a);
      steps.push({
        t: R`$x = ` + A.tex() + R`$ での微分係数`,
        m: [R`f'(a)g(a) + f(a)g'(a) = ` + pv(fpa) + R` \cdot ` + pv(ga) + ' + ' + pv(fa) + R` \cdot ` + pv(gpa), vfull(dVal).charAt(0) === '\\' ? vfull(dVal) : '= ' + vfull(dVal)],
        n: R`$x = ` + A.tex() + R`$ を代入します（$f(a) = ` + fa.tex() + R`,\ f'(a) = ` + fpa.tex() + R`,\ g(a) = ` + ga.tex() + R`,\ g'(a) = ` + gpa.tex() + R`$）。これがグラフの $x = ` + A.tex() + R`$ における接線の傾きです。`,
        easy: R`導関数の式に $x = a$ を代入したもの（微分係数）が、その点での接線の傾きです。右の図の直線がその接線です。`
      });
      steps.push({
        t: '数値微分で確かめる',
        m: R`\frac{F(a + h) - F(a - h)}{2h} \fallingdotseq ` + num(nd) + R` \quad (h = 0.00001)`,
        n: R`$F(x) = f(x)g(x)$ について、$a$ の少し右と少し左の 2 点を結ぶ直線の傾きを計算すると、上の微分係数とほぼ一致します。`,
        easy: R`微分係数は「2 点を限りなく近づけたときの直線の傾き」です。$h$ を小さくした近似値と比べると、計算が正しいか確かめられます。`,
        lv: 3
      });
      // 図
      const av = A.val(), y0 = F(av), m = dVal.val();
      const lo = gk === 'log' ? Math.max(0.02, av - 3) : av - 3, hi = av + 3;
      return {
        result: [
          { label: "導関数 {f(x)g(x)}'", tex: R`\{f(x)g(x)\}' = ` + finalT },
          { label: 'x = a での微分係数', tex: R`x = ` + A.tex() + R`:\ ` + vfull(dVal) }
        ],
        steps: steps,
        fig: graph({
          x: [lo, hi], mustY: [y0],
          curves: [{ f: F, cls: 'c1' }, { f: (x) => m * (x - av) + y0, cls: 'c2', dash: true, noScale: true }],
          points: [{ x: av, y: y0, cls: 'c3', label: '接点 x=' + A.txt(), pos: m > 0 ? 'tl' : 'tr' }],
          labels: [{ x: lo + (hi - lo) * 0.04, y: 0, text: '', cls: 'dim' }]
        })
      };
    }
  });

  /* ================= 2. 商の微分 ================= */

  function pgcd(a, b) {
    try {
      let x = a, y = b;
      let guardN = 0;
      while (!P.isZero(y) && guardN++ < 20) { const r = P.divmod(x, y).r; x = y; y = r; }
      if (P.isZero(x)) return [Q(1)];
      return P.scale(x, x[x.length - 1].inv());
    } catch (e) {
      if (e instanceof JK.CalcError) return [Q(1)];
      throw e;
    }
  }
  function realRoots(p, x0, x1) {
    const out = [];
    P.rationalRoots(p).forEach((r) => { if (r.val() >= x0 && r.val() <= x1) out.push(r.val()); });
    const f = P.fn(p), N = 600;
    let px = x0, pf = f(x0);
    for (let k = 1; k <= N; k++) {
      const x = x0 + (x1 - x0) * k / N, fx = f(x);
      if (pf === 0 || fx === 0) { px = x; pf = fx; continue; }
      if (pf * fx < 0) {
        let a = px, b = x, fa = pf;
        for (let i = 0; i < 60; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
        const r = (a + b) / 2;
        if (!out.some((o) => Math.abs(o - r) < 1e-6)) out.push(r);
      }
      px = x; pf = fx;
    }
    return out.sort((p1, p2) => p1 - p2);
  }
  function fracTex(Nn, D) {
    if (P.deg(D) === 0) return P.tex(P.scale(Nn, D[0].inv()));
    if (P.deg(Nn) <= 0 || termCount(Nn) === 1) {
      const lead = Nn[Math.max(0, P.deg(Nn))];
      if (lead.sign() < 0) return R`-\frac{` + P.tex(P.scale(Nn, -1)) + '}{' + denTex(D) + '}';
    }
    return R`\frac{` + P.tex(Nn) + '}{' + denTex(D) + '}';
  }
  // 分母: c(x - r)^k の形なら因数分解して表示
  function denTex(D) {
    const d = P.deg(D);
    if (d >= 2) {
      const rs = P.rationalRoots(D);
      if (rs.length === 1) {
        const r = rs[0], lin = [r.neg(), Q(1)];
        let rest = D, k = 0;
        while (P.deg(rest) > 0 && P.eval(rest, r).isZero()) { rest = P.divmod(rest, lin).q; k++; }
        if (P.deg(rest) === 0) {
          const c = rest[0];
          const base = r.isZero() ? 'x' : R`\left(` + P.tex(lin) + R`\right)`;
          return (c.eq(1) ? '' : (c.eq(-1) ? '-' : c.tex())) + base + '^{' + k + '}';
        }
      }
    }
    return P.tex(D);
  }

  JK.registerCalc({
    id: 'iiic-diff-quot',
    course: 'IIIC',
    unit: 'm-diff3',
    group: '微分法',
    title: '商の微分（分数関数）',
    desc: R`分数関数 $\dfrac{f(x)}{g(x)}$（分子・分母とも多項式）を公式 $\left(\dfrac{f}{g}\right)' = \dfrac{f'g - fg'}{g^{2}}$ で微分し、分子を展開・整理します。$x = a$ での微分係数と、漸近線つきのグラフも表示します。`,
    form: R`\left\{\frac{f(x)}{g(x)}\right\}' = \frac{f'(x)g(x) - f(x)g'(x)}{\{g(x)\}^{2}}`,
    inputs: [
      { key: 'f', label: '分子 $f(x)$', type: 'poly', def: 'x^2 + 1' },
      { key: 'g', label: '分母 $g(x)$', type: 'poly', def: 'x - 1' },
      { key: 'a', label: '微分係数を求める点 $x = a$', type: 'q', def: '2' }
    ],
    examples: [
      { label: '1/x 型', v: { f: '1', g: 'x', a: '2' } },
      { label: '分母が 2 次式', v: { f: 'x', g: 'x^2 + 1', a: '0' } },
      { label: '約分できる', v: { f: 'x', g: 'x^2', a: '1' } }
    ],
    intro: {
      easy: R`分数の形の関数 $\frac{f(x)}{g(x)}$ を微分する公式です。「**分子を微分 × 分母 − 分子 × 分母を微分**」を「**分母の 2 乗**」で割ります。引き算の順番（分子の微分が先）を間違えやすいので注意しましょう。公式は $\frac{f}{g} = f \cdot \frac{1}{g}$ と見て、積の微分と「$\frac{1}{g}$ の微分 $= -\frac{g'}{g^{2}}$」から導けます。`,
      normal: R`公式に代入し、分子 $f'g - fg'$ を展開して整理します。分母は展開せず $\{g(x)\}^{2}$ のまま残すのが普通です。`,
      pro: R`分子が 1 なら $\left(\frac{1}{g}\right)' = -\frac{g'}{g^{2}}$ が速い。増減を調べるときは分母 $g^{2} > 0$ なので、分子の符号だけを見ればよい。`
    },
    compute(v) {
      const f = v.f, g = v.g, a = v.a;
      if (P.isZero(g)) throw new JK.CalcError('分母 g(x) が 0 になっています。0 でない多項式を入力してください');
      if (P.deg(f) > 5 || P.deg(g) > 5) throw new JK.CalcError('次数は 5 以下にしてください');
      const fp = P.deriv(f), gp = P.deriv(g);
      const t1 = P.mul(fp, g), t2 = P.mul(f, gp), Nn = P.sub(t1, t2), D = P.mul(g, g);
      const fT = P.tex(f), gT = P.tex(g);
      const steps = [];
      const qf = (x) => P.eval(f, x) / P.eval(g, x);
      steps.push({
        t: R`そもそも商の微分の公式はどこから来るか`,
        m: [R`\left(\frac{1}{g}\right)' = \lim_{h \to 0} \frac{1}{h}\left\{\frac{1}{g(x+h)} - \frac{1}{g(x)}\right\} = \lim_{h \to 0} \left\{-\frac{g(x+h) - g(x)}{h} \cdot \frac{1}{g(x+h)g(x)}\right\} = -\frac{g'}{g^{2}}`, R`\left(\frac{f}{g}\right)' = \left(f \cdot \frac{1}{g}\right)' = \frac{f'}{g} - \frac{fg'}{g^{2}} = \frac{f'g - fg'}{g^{2}}`],
        n: R`まず $\frac{1}{g}$ の微分を定義から求め、積の微分と組み合わせます。`,
        easy: R`微分の定義は「$h$ だけずらしたときの変化 ÷ $h$」の $h \to 0$ での極限です。通分すると分子に $g(x+h) - g(x)$ が現れ、$h$ で割ると $g'(x)$ になります。`,
        lv: 3
      });
      steps.push({
        t: '分子・分母をそれぞれ微分する',
        m: [R`f(x) = ` + fT + R`,\quad f'(x) = ` + P.tex(fp), R`g(x) = ` + gT + R`,\quad g'(x) = ` + P.tex(gp)],
        n: R`多項式は項ごとに $(x^{n})' = nx^{n-1}$ で微分します。`,
        easy: R`ここは数IIの微分と同じです。定数項は微分すると 0 になります。`
      });
      steps.push({
        t: '公式に代入する',
        m: [R`\left\{\frac{f(x)}{g(x)}\right\}' = \frac{f'(x)g(x) - f(x)g'(x)}{\{g(x)\}^{2}}`, R`= \frac{` + wrapP(fp) + wrapP(g) + ' - ' + wrapP(f) + wrapP(gp) + '}{' + R`\left(` + gT + R`\right)^{2}}`],
        n: R`分母は展開せずに $\left(` + gT + R`\right)^{2}$ のまま残します。`,
        easy: R`分子は「分子の微分 × 分母」から「分子 × 分母の微分」を引きます。順番を逆にすると符号が逆になるので注意。`
      });
      steps.push({
        t: '分子を展開して整理する',
        m: [R`f'(x)g(x) = ` + P.tex(t1), R`f(x)g'(x) = ` + P.tex(t2), R`f'(x)g(x) - f(x)g'(x) = ` + P.tex(t1) + ' - ' + (termCount(t2) > 1 ? R`\left(` + P.tex(t2) + R`\right)` : (t2[P.deg(t2)] && t2[Math.max(0, P.deg(t2))].sign() < 0 ? R`\left(` + P.tex(t2) + R`\right)` : P.tex(t2))) + ' = ' + P.tex(Nn)],
        n: R`2 つの積を展開してから引きます。`,
        easy: R`引く方の式はかっこごと引くので、かっこの中の符号がすべて変わります。`,
        lv: 2
      });
      let N1 = Nn, D1 = D, G = [Q(1)];
      if (!P.isZero(Nn)) {
        G = pgcd(Nn, D);
        if (P.deg(G) > 0) { N1 = P.divmod(Nn, G).q; D1 = P.divmod(D, G).q; }
      }
      const dT0 = P.isZero(Nn) ? '0' : R`\frac{` + P.tex(Nn) + R`}{\left(` + gT + R`\right)^{2}}`;
      const dT = P.isZero(Nn) ? '0' : (P.deg(G) > 0 ? fracTex(N1, D1) : (termCount(Nn) === 1 && Nn[Math.max(0, P.deg(Nn))].sign() < 0 ? R`-\frac{` + P.tex(P.scale(Nn, -1)) + R`}{\left(` + gT + R`\right)^{2}}` : dT0));
      if (P.deg(G) > 0) {
        steps.push({
          t: '約分する',
          m: R`\left\{\frac{f(x)}{g(x)}\right\}' = ` + dT0 + ' = ' + dT,
          n: R`分子と分母に共通な因数 $` + P.tex(G) + R`$ で約分しました。`,
          easy: R`分数の約分と同じです。分子と分母を同じ式で割っても値は変わりません。`
        });
      } else {
        steps.push({
          t: '導関数',
          m: R`\left\{\frac{f(x)}{g(x)}\right\}' = ` + dT,
          n: P.isZero(Nn) ? R`分子が 0 になりました。$\frac{f(x)}{g(x)}$ は定数関数（$g(x) \ne 0$ の範囲）なので、導関数は 0 です。` : R`これ以上約分できないので、これが答えです。`,
          easy: R`分母 $\left(` + gT + R`\right)^{2}$ は 2 乗なので 0 以上です。導関数の符号は分子 $` + P.tex(Nn) + R`$ の符号で決まります。`
        });
      }
      const ga = P.eval(g, a);
      let valTex, valV = null;
      if (ga.isZero()) {
        valTex = R`\text{定義されない}`;
        steps.push({
          t: R`$x = ` + a.tex() + R`$ での微分係数`,
          m: R`g(` + a.tex() + ') = 0',
          n: R`$x = ` + a.tex() + R`$ では分母が 0 になるので、関数も導関数も定義されません。グラフでは縦の漸近線になります。`,
          easy: R`分母が 0 になる $x$ は「定義域の外」です。別の点 $a$ を入力してみましょう。`
        });
      } else {
        const Na = P.eval(Nn, a), Da = P.eval(D, a);
        valV = Na.div(Da);
        valTex = valV.tex();
        steps.push({
          t: R`$x = ` + a.tex() + R`$ での微分係数`,
          m: [R`f'(a)g(a) - f(a)g'(a) = ` + Na.tex() + R`,\quad \{g(a)\}^{2} = ` + Da.tex(), R`\left\{\frac{f(x)}{g(x)}\right\}'_{x = ` + a.tex() + '} = ' + R`\frac{` + Na.tex() + '}{' + Da.tex() + '}' + (valV.tex() === R`\frac{` + Na.tex() + '}{' + Da.tex() + '}' ? '' : ' = ' + valV.tex())],
          n: R`整理する前の式（分子 $` + P.tex(Nn) + R`$、分母 $\{g(x)\}^{2}$）に $x = ` + a.tex() + R`$ を代入しました。`,
          easy: R`これが $x = ` + a.tex() + R`$ における接線の傾きです。図の直線と比べてみましょう。`
        });
        steps.push({
          t: '数値微分で確かめる',
          m: R`\frac{F(a + h) - F(a - h)}{2h} \fallingdotseq ` + num(dnum(qf, a.val())) + R` \quad (h = 0.00001)`,
          n: R`$F(x) = \frac{f(x)}{g(x)}$ の、$a$ の両側の 2 点を結ぶ直線の傾きです。`,
          easy: R`公式で求めた値 $` + valV.tex() + R`$（$\fallingdotseq ` + num(valV.val()) + R`$）とほぼ一致すれば正解です。`,
          lv: 3
        });
      }
      // 図: 漸近線つき
      const av = a.val();
      const x0 = av - 4, x1 = av + 4;
      const poles = P.deg(g) >= 1 ? realRoots(g, x0, x1) : [];
      const dm = P.deg(g) >= 1 ? P.divmod(f, g) : null;
      const curves = [{ f: qf, cls: 'c1' }];
      const vl = poles.map((r) => ({ x: r, cls: 'c3', label: 'x=' + plain(r, 3) }));
      let asym = null;
      if (dm && P.deg(f) <= P.deg(g) + 1) {
        const qq = dm.q;
        asym = P.isZero(qq) ? 'y=0' : 'y=' + polyTxt(qq);
        curves.push({ f: P.fn(qq), cls: 'c3', dash: true, noScale: true });
      }
      const pts = [];
      if (valV) {
        const y0 = qf(av), m = valV.val();
        curves.push({ f: (x) => m * (x - av) + y0, cls: 'c2', dash: true, noScale: true });
        pts.push({ x: av, y: y0, cls: 'c2', label: '接点', pos: 'tr' });
      }
      return {
        result: [
          { label: '導関数', tex: R`\left\{\frac{f(x)}{g(x)}\right\}' = ` + dT },
          { label: 'x = ' + a.toString() + ' での微分係数', tex: valTex + (valV && !valV.isInt() ? R` \fallingdotseq ` + num(valV.val()) : '') },
          { label: '漸近線（図の範囲）', tex: (poles.length ? poles.map((r) => 'x = ' + num(r, 4)).join(R`,\ `) : R`\text{縦の漸近線なし}`) + (asym ? R`,\ ` + (P.isZero(dm.q) ? 'y = 0' : 'y = ' + P.tex(dm.q)) : '') }
        ],
        steps: steps,
        fig: graph({
          x: [x0, x1], mustY: valV ? [qf(av)] : [],
          curves: curves, vlines: vl, points: pts
        })
      };
    }
  });

  /* ================= 3. 合成関数の微分 ================= */

  // c·B^e（e: Q）の TeX。B は底の TeX（かっこ込み）、rootB は √ の中身
  function powTerm(c, e, B, rootB) {
    const cs = c.abs(), neg = c.sign() < 0;
    const co = cs.eq(1) ? '' : cs.tex();
    let body;
    if (e.isZero()) body = cs.tex();
    else if (e.eq(1)) body = co + B;
    else if (e.isInt() && e.sign() > 0) body = co + B + '^{' + e.n + '}';
    else if (e.eq(Q(1, 2))) body = co + R`\sqrt{` + rootB + '}';
    else if (e.isInt()) body = R`\frac{` + cs.n + '}{' + (cs.d === 1 ? '' : cs.d) + B + (e.n === -1 ? '' : '^{' + (-e.n) + '}') + '}';
    else if (e.eq(Q(-1, 2))) body = R`\frac{` + cs.n + '}{' + (cs.d === 1 ? '' : cs.d) + R`\sqrt{` + rootB + '}}';
    else body = co + B + '^{' + e.tex() + '}';
    return (neg ? '-' : '') + body;
  }
  function flowFig(gTxt, fTxt, dudx, dydu, ex) {
    const d = JK.plot.draw(440, 196);
    const cy = 58;
    d.circle(24, cy, 15, { cls: 'c1', fill: 'f1' });
    d.text(24, cy + 5, 'x', { size: 15, italic: true });
    d.arrow(40, cy, 64, cy, { cls: 'dim', w: 1.6 });
    d.rect(66, cy - 24, 120, 48, { cls: 'c2', fill: 'f2', rx: 8 });
    d.text(126, cy - 6, '内側 g', { size: 11 });
    d.text(126, cy + 13, gTxt, { size: 12 });
    d.arrow(188, cy, 212, cy, { cls: 'dim', w: 1.6 });
    d.circle(228, cy, 15, { cls: 'c2', fill: 'f2' });
    d.text(228, cy + 5, 'u', { size: 15, italic: true });
    d.arrow(244, cy, 268, cy, { cls: 'dim', w: 1.6 });
    d.rect(270, cy - 24, 120, 48, { cls: 'c3', fill: 'f3', rx: 8 });
    d.text(330, cy - 6, '外側 f', { size: 11 });
    d.text(330, cy + 13, fTxt, { size: 12 });
    d.arrow(392, cy, 410, cy, { cls: 'dim', w: 1.6 });
    d.circle(424, cy, 13, { cls: 'c4', fill: 'f4' });
    d.text(424, cy + 5, 'y', { size: 15, italic: true });
    d.text(126, cy + 44, 'du/dx = ' + dudx, { size: 12 });
    d.text(330, cy + 44, 'dy/du = ' + dydu, { size: 12 });
    d.text(220, cy + 76, 'dy/dx = (dy/du) × (du/dx)', { size: 12, bold: true });
    if (ex) d.text(220, cy + 100, ex, { size: 11, cls: 'dim' });
    return d.svg();
  }

  JK.registerCalc({
    id: 'iiic-diff-chain',
    course: 'IIIC',
    unit: 'm-diff3',
    group: '微分法',
    title: '合成関数の微分',
    desc: R`$y = f(g(x))$ を $y = f(u),\ u = g(x)$ に分けて、$\dfrac{dy}{dx} = \dfrac{dy}{du} \cdot \dfrac{du}{dx}$（外側の微分 × 内側の微分）で微分します。$x \to u \to y$ の流れ図で過程を表示し、$x = a$ での値を数値微分で確かめます。`,
    form: R`\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}`,
    inputs: [
      { key: 'outer', label: '外側の関数 $y = f(u)$', type: 'select', def: 'pow', options: [['pow', 'uⁿ'], ['sqrt', '√u'], ['sin', 'sin u'], ['cos', 'cos u'], ['tan', 'tan u'], ['exp', 'eᵘ'], ['log', 'log u']] },
      { key: 'n', label: '指数 $n$', type: 'q', def: '3', show: (raw) => raw.outer === 'pow' },
      { key: 'u', label: '内側 $u = g(x)$（1次式か2次式）', type: 'poly', def: '2x + 1' },
      { key: 'a', label: '値を求める点 $x = a$', type: 'num', def: '1', min: -20, max: 20, hint: 'π/6 なども入力できます' }
    ],
    examples: [
      { label: '(x²+1)⁵', v: { outer: 'pow', n: '5', u: 'x^2 + 1', a: '1' } },
      { label: '√(2x+1)', v: { outer: 'sqrt', u: '2x + 1', a: '4' } },
      { label: 'sin 2x', v: { outer: 'sin', u: '2x', a: 'π/6' } },
      { label: 'e^(x²)', v: { outer: 'exp', u: 'x^2', a: '1' } },
      { label: 'log(x²+1)', v: { outer: 'log', u: 'x^2 + 1', a: '1' } }
    ],
    intro: {
      easy: R`$y = (2x + 1)^{3}$ のような式は、「$x$ を 2 倍して 1 を足す機械（内側）」と「3 乗する機械（外側）」をつないだ **2 段階の計算** です。$x$ が少し動くと、まず内側で $u$ が $\frac{du}{dx}$ 倍の勢いで動き、その $u$ の動きが外側で $\frac{dy}{du}$ 倍されて $y$ に伝わります。だから全体の変化の割合は **掛け算** $\frac{dy}{du} \times \frac{du}{dx}$ になります。2 つの歯車がかみ合って回るイメージです。`,
      normal: R`「外側を微分（中身はそのまま）× 中身を微分」。$\frac{dy}{du}$ を計算したら $u$ を $g(x)$ に戻すのを忘れないこと。`,
      pro: R`慣れたら $u$ を書かずに $\{(2x+1)^{3}\}' = 3(2x+1)^{2} \cdot 2$ と 1 行で。$\{\log|g(x)|\}' = \frac{g'(x)}{g(x)}$ は積分（$\int \frac{g'}{g}dx$）でも使います。`
    },
    compute(v) {
      const ok = ['pow', 'sqrt', 'sin', 'cos', 'tan', 'exp', 'log'];
      const outer = ok.indexOf(v.outer) >= 0 ? v.outer : 'pow';
      const g = v.u, dg = P.deg(g);
      if (dg < 1 || dg > 2) throw new JK.CalcError('内側の式 u は 1 次式か 2 次式を入力してください');
      const n = outer === 'pow' ? (v.n || Q(3)) : null;
      if (n && n.isZero()) throw new JK.CalcError('n は 0 以外にしてください（n = 0 だと y = 1 の定数になります）');
      if (n && Math.abs(n.val()) > 20) throw new JK.CalcError('n の絶対値は 20 以下にしてください');
      const gp = P.deriv(g), gT = P.tex(g), gpT = P.tex(gp);
      const a = v.a, A = exactOf(a);
      const u0 = pevalV(g, A), u0v = u0.val(), gpa = pevalV(gp, A);
      const one = termCount(g) === 1;
      const B = one && P.deg(g) === 1 && g[1].eq(1) ? 'x' : R`\left(` + gT + R`\right)`;
      const argG = one && g[0].isZero() && P.deg(g) === 1 ? ' ' + gT : R`\left(` + gT + R`\right)`;
      // 定義域の確認
      if (outer === 'pow' && !n.isInt() && !(u0v > 0)) throw new JK.CalcError('n が整数でないときは、x = a で u = g(a) > 0 となる a を入力してください（いまは g(a) = ' + plain(u0v, 4) + '）');
      if (outer === 'pow' && n.isInt() && n.sign() < 0 && u0.isZero()) throw new JK.CalcError('x = a で u = g(a) = 0 となり、u の負の累乗が定義されません。別の a を入力してください');
      if ((outer === 'sqrt' || outer === 'log') && !(u0v > 0)) throw new JK.CalcError((outer === 'sqrt' ? '√u の導関数は u > 0' : 'log u は u > 0') + ' で考えます。x = a で g(a) > 0 となる a を入力してください（いまは g(a) = ' + plain(u0v, 4) + '）');
      if (outer === 'tan' && Math.abs(Math.cos(u0v)) < 1e-12) throw new JK.CalcError('x = a で cos u = 0 となり、tan u が定義されません');
      let yT, yU, dyduT, dydxT, F, dF, fTxt, dyduTxt, ruleN, ruleE, dVal;
      const nv = n ? n.val() : 0, gF = P.fn(g), gpF = P.fn(gp);
      switch (outer) {
        case 'pow': {
          const n1 = n.sub(1);
          yT = n.isInt() && n.sign() > 0 ? B + '^{' + n.tex() + '}' : B + '^{' + n.tex() + '}';
          yU = 'u^{' + n.tex() + '}';
          dyduT = powTerm(n, n1, 'u', 'u');
          if (P.deg(gp) === 0) dydxT = powTerm(n.mul(gp[0]), n1, B, gT);
          else {
            const C = P.scale(gp, n);
            const cT = termCount(C) > 1 ? R`\left(` + P.tex(C) + R`\right)` : P.tex(C);
            const pw = powTerm(Q(1), n1, B, gT);
            dydxT = pw.indexOf(R`\frac{1}{`) === 0 ? R`\frac{` + P.tex(C) + '}' + pw.slice(R`\frac{1}`.length) : cT + (pw === '1' ? '' : pw);
          }
          F = (x) => Math.pow(gF(x), nv);
          dF = (x) => nv * Math.pow(gF(x), nv - 1) * gpF(x);
          fTxt = 'y = u' + (n.isInt() && n.sign() > 0 ? sup(n.n) : '^(' + n.toString() + ')');
          dyduTxt = (n.eq(1) ? '1' : n.toString() + (n1.isZero() ? '' : 'u' + (n1.isInt() && n1.sign() > 0 ? (n1.eq(1) ? '' : sup(n1.n)) : '^(' + n1.toString() + ')')));
          ruleN = R`$(u^{n})' = nu^{n-1}$ を、$u$ を 1 つの文字とみて使います。`;
          ruleE = R`$u^{` + n.tex() + R`}$ を $u$ で微分するのは、$x^{` + n.tex() + R`}$ を $x$ で微分するのと同じです。`;
          dVal = V.q(n).mul(V.pow(u0, n1)).mul(gpa);
          break;
        }
        case 'sqrt': {
          yT = R`\sqrt{` + gT + '}'; yU = R`\sqrt{u}`;
          dyduT = R`\frac{1}{2\sqrt{u}}`;
          const half = P.scale(gp, Q(1, 2));
          const intOk = half.every((c) => c.isInt());
          dydxT = intOk ? fracTexS(half, R`\sqrt{` + gT + '}') : R`\frac{` + gpT + R`}{2\sqrt{` + gT + '}}';
          F = (x) => Math.sqrt(gF(x)); dF = (x) => gpF(x) / (2 * Math.sqrt(gF(x)));
          fTxt = 'y = √u'; dyduTxt = '1/(2√u)';
          ruleN = R`$\sqrt{u} = u^{\frac{1}{2}}$ なので $(\sqrt{u})' = \frac{1}{2}u^{-\frac{1}{2}} = \frac{1}{2\sqrt{u}}$ です。`;
          ruleE = R`ルートは「$\frac{1}{2}$ 乗」と書きかえると、累乗の微分の公式がそのまま使えます。`;
          dVal = gpa.mul(V.sqrt(u0.isQ() ? u0.q() : Q(1)).inv()).mul(V.q(Q(1, 2)));
          if (!u0.isQ()) dVal = V.num(gpa.val() / (2 * Math.sqrt(u0v)));
          break;
        }
        case 'sin':
          yT = R`\sin` + argG; yU = R`\sin u`; dyduT = R`\cos u`;
          dydxT = pfTex(gp, R`\cos` + argG);
          F = (x) => Math.sin(gF(x)); dF = (x) => Math.cos(gF(x)) * gpF(x);
          fTxt = 'y = sin u'; dyduTxt = 'cos u';
          ruleN = R`$(\sin u)' = \cos u$`; ruleE = R`$\sin$ を微分すると $\cos$。中身の $u$ はそのまま残します。`;
          dVal = V.cos(u0).mul(gpa);
          break;
        case 'cos':
          yT = R`\cos` + argG; yU = R`\cos u`; dyduT = R`-\sin u`;
          dydxT = pfTex(P.scale(gp, -1), R`\sin` + argG);
          F = (x) => Math.cos(gF(x)); dF = (x) => -Math.sin(gF(x)) * gpF(x);
          fTxt = 'y = cos u'; dyduTxt = '−sin u';
          ruleN = R`$(\cos u)' = -\sin u$`; ruleE = R`$\cos$ を微分すると $-\sin$（マイナスがつく）。中身はそのままです。`;
          dVal = V.sin(u0).neg().mul(gpa);
          break;
        case 'tan':
          yT = R`\tan` + argG; yU = R`\tan u`; dyduT = R`\frac{1}{\cos^{2} u}`;
          dydxT = (P.deg(gp) === 0 && gp[0].sign() < 0 ? '-' : '') + R`\frac{` + (P.deg(gp) === 0 ? gp[0].abs().tex() : gpT) + R`}{\cos^{2}` + argG + '}';
          F = (x) => Math.tan(gF(x)); dF = (x) => gpF(x) / Math.pow(Math.cos(gF(x)), 2);
          fTxt = 'y = tan u'; dyduTxt = '1/cos²u';
          ruleN = R`$(\tan u)' = \frac{1}{\cos^{2} u}$`; ruleE = R`$\tan u = \frac{\sin u}{\cos u}$ を商の微分で微分すると $\frac{\cos^{2}u + \sin^{2}u}{\cos^{2}u} = \frac{1}{\cos^{2}u}$ になります。`;
          {
            const c = V.cos(u0);
            dVal = c.single() && !c.t[0].s.length ? gpa.mul(c.mul(c).inv()) : V.num(gpa.val() / Math.pow(Math.cos(u0v), 2));
          }
          break;
        case 'exp':
          yT = 'e^{' + gT + '}'; yU = 'e^{u}'; dyduT = 'e^{u}';
          dydxT = pfTex(gp, 'e^{' + gT + '}');
          F = (x) => Math.exp(gF(x)); dF = (x) => Math.exp(gF(x)) * gpF(x);
          fTxt = 'y = eᵘ'; dyduTxt = 'eᵘ';
          ruleN = R`$(e^{u})' = e^{u}$`; ruleE = R`$e^{u}$ は $u$ で微分しても $e^{u}$ のままです。`;
          dVal = V.exp(u0).mul(gpa);
          break;
        default:
          yT = R`\log` + argG; yU = R`\log u`; dyduT = R`\frac{1}{u}`;
          dydxT = fracTexS(gp, gT);
          F = (x) => Math.log(gF(x)); dF = (x) => gpF(x) / gF(x);
          fTxt = 'y = log u'; dyduTxt = '1/u';
          ruleN = R`$(\log u)' = \frac{1}{u}$`; ruleE = R`$\log u$ を $u$ で微分すると $\frac{1}{u}$。最後に $u = g(x)$ に戻すと $\frac{g'(x)}{g(x)}$ の形になります。`;
          dVal = gpa.mul(u0.inv());
      }
      const yv = F(A.val());
      const steps = [{
        t: 'そもそも合成関数とは — 2 段階の機械',
        m: [R`y = ` + yT, R`x = ` + A.tex() + R` \;\to\; u = g(` + A.tex() + ')' + eqv(u0) + R` \;\to\; y \fallingdotseq ` + num(yv)],
        n: R`$y = f(g(x))$ は「$x$ を内側の関数 $g$ に入れて $u$ を作り、その $u$ を外側の関数 $f$ に入れて $y$ を作る」2 段階の計算です。図の流れで、$x = ` + A.tex() + R`$ のときの値の受け渡しも確かめましょう。`,
        easy: R`変化の割合も、この流れに沿って **リレー** されます。$x$ が少し増えると $u$ は $\frac{du}{dx}$ 倍の勢いで増え、その $u$ の変化が $\frac{dy}{du}$ 倍されて $y$ に伝わります。`,
        fig: flowFig('u = ' + polyTxt(g), fTxt, polyTxt(gp), dyduTxt, 'x = ' + A.txt() + ' → u = ' + u0.txt() + ' → y ≒ ' + plain(yv, 4)),
        lv: 3
      }, {
        t: '外側と内側に分ける',
        m: [R`y = ` + yU + R`,\qquad u = ` + gT],
        n: R`かっこの中・ルートの中・$\sin$ や $e$ の肩などの「ひとかたまり」を $u$ とおきます。`,
        easy: R`$u$ とおくと、外側は $` + yU + R`$ という見慣れた形になります。`
      }, {
        t: R`外側を $u$ で微分する（中身はそのまま）`,
        m: R`\frac{dy}{du} = ` + dyduT,
        n: ruleN,
        easy: ruleE
      }, {
        t: R`内側を $x$ で微分する`,
        m: R`\frac{du}{dx} = ` + gpT,
        n: R`$u = ` + gT + R`$ を $x$ で微分します（数IIの微分）。`
      }, {
        t: '掛け合わせて u を元に戻す',
        m: [R`\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx} = ` + dyduT.replace(/u/g, '{(u)}').replace(/\{\(u\)\}/g, 'u') + R` \cdot ` + wrapP(gp), R`= ` + dydxT],
        n: R`$u$ を $` + gT + R`$ に戻して整理しました。`,
        easy: R`「外側の微分（中身はそのまま）× 中身の微分」。最後に $u$ を $x$ の式に戻すのを忘れないようにします。`,
        pro: R`$\{f(ax + b)\}' = af'(ax + b)$ は 1 次式の中身の定番。積分では逆に $\frac{1}{a}$ を掛けます。`
      }];
      const nd = dnum(F, A.val());
      steps.push({
        t: R`$x = ` + A.tex() + R`$ での微分係数`,
        m: [R`u = g(` + A.tex() + ')' + eqv(u0) + R`,\quad \frac{du}{dx} = g'(` + A.tex() + ')' + eqv(gpa), R`\frac{dy}{dx} = ` + vfull(dVal)],
        n: R`$\frac{dy}{du}$ に $u = ` + u0.tex() + R`$ を、$\frac{du}{dx}$ に $x = ` + A.tex() + R`$ を代入して掛けます。`,
        easy: R`これが $x = ` + A.tex() + R`$ における接線の傾きです。`
      });
      steps.push({
        t: '数値微分で確かめる',
        m: R`\frac{y(a + h) - y(a - h)}{2h} \fallingdotseq ` + num(nd) + R` \quad (h = 0.00001)`,
        n: R`公式で求めた値（$\fallingdotseq ` + num(dVal.val()) + R`$）と一致することを確かめます。`,
        easy: R`ずらす幅 $h$ をとても小さくして直線の傾きを計算すると、微分係数の近似値になります。`,
        lv: 3
      });
      const av = A.val(), m = dVal.val();
      return {
        result: [
          { label: '導関数 dy/dx', tex: R`\frac{dy}{dx} = ` + dydxT },
          { label: 'x = a での値', tex: R`x = ` + A.tex() + R`:\ ` + vfull(dVal) },
          { label: '数値微分', tex: R`\fallingdotseq ` + num(nd) }
        ],
        steps: steps,
        fig: graph({
          x: [av - 3, av + 3], mustY: [yv],
          curves: [{ f: F, cls: 'c1' }, { f: (x) => m * (x - av) + yv, cls: 'c2', dash: true, noScale: true }],
          points: [{ x: av, y: yv, cls: 'c3', label: '接点 x=' + A.txt(), pos: m > 0 ? 'tl' : 'tr' }]
        })
      };
    }
  });
  // 多項式 Nn / 文字列 D（D は TeX）
  function fracTexS(Nn, D) {
    if (P.deg(Nn) <= 0) {
      const c = Nn[0];
      return (c.sign() < 0 ? '-' : '') + R`\frac{` + c.abs().n + '}{' + (c.abs().d === 1 ? '' : c.abs().d) + D + '}';
    }
    if (termCount(Nn) === 1 && Nn[P.deg(Nn)].sign() < 0) return R`-\frac{` + P.tex(P.scale(Nn, -1)) + '}{' + D + '}';
    return R`\frac{` + P.tex(Nn) + '}{' + D + '}';
  }

  /* ================= 4・5. 関数の族（増減表・接線で共用） ================= */

  function kxT(k, v) { return P.tex([Q(0), k], v || 'x'); }
  function xpowT(k) { if (k.eq(1)) return 'x'; if (k.eq(Q(1, 2))) return R`\sqrt{x}`; return 'x^{' + k.tex() + '}'; }
  function cT(k) { return k.eq(1) ? '' : (k.eq(-1) ? '-' : k.tex()); }
  const TWO_PI = 2 * Math.PI;

  const FAM = {
    xe: {
      label: 'x e^(−ax)', needK: true, kdef: '1',
      kErr: (k) => (k.isZero() ? 'a は 0 以外の値を入力してください' : null),
      make(k) {
        const kv = k.val(), ex = kxT(k.neg()), E = 'e^{' + ex + '}', lin = [Q(1), k.neg()];
        const x0 = k.inv().val();
        return {
          yT: 'x' + E, f: (x) => x * Math.exp(-kv * x), df: (x) => (1 - kv * x) * Math.exp(-kv * x),
          F: (X) => V.of(X).mul(V.exp(V.of(X).mul(V.q(k.neg())))),
          dF: (X) => V.q(1).sub(V.of(X).mul(V.q(k))).mul(V.exp(V.of(X).mul(V.q(k.neg())))),
          dT: R`\left(` + P.tex(lin) + R`\right)` + E,
          dSteps: [R`y' = (x)' \cdot ` + E + R` + x \cdot \left(` + E + R`\right)'`, R`= 1 \cdot ` + E + R` + x \cdot ` + U.paren(k.neg()) + E, R`= \left(` + P.tex(lin) + R`\right)` + E],
          dRule: R`積の微分と、合成関数の微分 $\left(e^{` + ex + R`}\right)' = ` + U.paren(k.neg()) + R`e^{` + ex + R`}$ を使います。`,
          dEasy: R`$e^{` + ex + R`}$ は「$e^{u}$ の中身が $u = ` + ex + R`$」の合成関数なので、微分すると中身の微分 $` + k.neg().tex() + R`$ が前に出ます。`,
          crit: [V.q(k.inv())],
          zeroT: R`e^{` + ex + R`} > 0 \text{ より } ` + P.tex(lin) + R` = 0 \;\Rightarrow\; x = ` + k.inv().tex(),
          signT: R`$e^{` + ex + R`} > 0$ なので、$y'$ の符号は $` + P.tex(lin) + R`$ の符号と同じです。`,
          dom: [null, null], range: [x0 - 3.5 / Math.abs(kv), x0 + 3.5 / Math.abs(kv)],
          pro: R`グラフの概形には $\lim_{x \to \infty} xe^{-x} = 0$（指数関数は多項式より速く大きくなる）を使います。`
        };
      }
    },
    x2e: {
      label: 'x² e^(−ax)', needK: true, kdef: '1',
      kErr: (k) => (k.isZero() ? 'a は 0 以外の値を入力してください' : null),
      make(k) {
        const kv = k.val(), ex = kxT(k.neg()), E = 'e^{' + ex + '}', lin = [Q(2), k.neg()];
        const c2 = Q(2).div(k);
        const lo = Math.min(0, c2.val()), hi = Math.max(0, c2.val()), w = hi - lo;
        return {
          yT: 'x^{2}' + E, f: (x) => x * x * Math.exp(-kv * x), df: (x) => x * (2 - kv * x) * Math.exp(-kv * x),
          F: (X) => V.pow(X, 2).mul(V.exp(V.of(X).mul(V.q(k.neg())))),
          dF: (X) => V.of(X).mul(V.q(2).sub(V.of(X).mul(V.q(k)))).mul(V.exp(V.of(X).mul(V.q(k.neg())))),
          dT: R`x\left(` + P.tex(lin) + R`\right)` + E,
          dSteps: [R`y' = (x^{2})' \cdot ` + E + R` + x^{2} \cdot \left(` + E + R`\right)'`, R`= 2x` + E + R` + x^{2} \cdot ` + U.paren(k.neg()) + E, R`= x\left(` + P.tex(lin) + R`\right)` + E],
          dRule: R`積の微分と、合成関数の微分 $\left(e^{` + ex + R`}\right)' = ` + U.paren(k.neg()) + R`e^{` + ex + R`}$ を使います。`,
          dEasy: R`共通因数 $x e^{` + ex + R`}$ でくくると、符号を調べやすい形になります。`,
          crit: [V.q(0), V.q(c2)],
          zeroT: R`x\left(` + P.tex(lin) + R`\right) = 0 \;\Rightarrow\; x = 0,\ ` + c2.tex(),
          signT: R`$e^{` + ex + R`} > 0$ なので、$y'$ の符号は $x\left(` + P.tex(lin) + R`\right)$ の符号と同じです（2 次式の符号）。`,
          dom: [null, null], range: [lo - 0.9 * w - 1 / Math.abs(kv), hi + 0.9 * w + 1 / Math.abs(kv)],
          pro: R`$x = 0$ で極小値 0。$x^{2} \ge 0$ と $e^{` + ex + R`} > 0$ から最小値 0 と即答できます。`
        };
      }
    },
    logx: {
      label: 'log x / xᵃ', needK: true, kdef: '1',
      kErr: (k) => (k.sign() <= 0 ? 'a は正の値を入力してください' : null),
      make(k) {
        const kv = k.val(), XK = xpowT(k), k1 = k.add(1);
        const x0 = Math.exp(1 / kv);
        return {
          yT: R`\frac{\log x}{` + XK + '}', f: (x) => Math.log(x) / Math.pow(x, kv), df: (x) => (1 - kv * Math.log(x)) / Math.pow(x, kv + 1),
          F: (X) => V.ln(X).mul(V.pow(X, k.neg())),
          dF: (X) => V.q(1).sub(V.ln(X).mul(V.q(k))).mul(V.pow(X, k1.neg())),
          dT: R`\frac{1 - ` + cT(k) + R`\log x}{` + xpowT(k1) + '}',
          dSteps: [
            R`y' = \frac{(\log x)' \cdot ` + XK + R` - \log x \cdot \left(` + XK + R`\right)'}{\left(` + XK + R`\right)^{2}}`,
            R`= \frac{\frac{1}{x} \cdot ` + XK + R` - \log x \cdot ` + (k.eq(1) ? '1' : cT(k) + xpowT(k.sub(1))) + '}{' + xpowT(k.mul(2)) + '}',
            R`= \frac{1 - ` + cT(k) + R`\log x}{` + xpowT(k1) + '}'
          ],
          dRule: R`商の微分 $\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^{2}}$ と $(\log x)' = \frac{1}{x}$ を使います。`,
          dEasy: R`分子と分母に共通な $x^{` + k.sub(1).tex() + R`}$ で約分すると、分子は $1 - ` + cT(k) + R`\log x$ という簡単な形になります。`,
          crit: [V.e(k.inv(), Q(0))],
          zeroT: R`1 - ` + cT(k) + R`\log x = 0 \;\Rightarrow\; \log x = ` + k.inv().tex() + R` \;\Rightarrow\; x = ` + eTex(k.inv(), Q(0)),
          signT: R`$x > 0$ で分母 $` + xpowT(k1) + R` > 0$ なので、$y'$ の符号は $1 - ` + cT(k) + R`\log x$ の符号と同じです。$\log x$ は増加関数なので、$x < ` + eTex(k.inv(), Q(0)) + R`$ で正、$x > ` + eTex(k.inv(), Q(0)) + R`$ で負です。`,
          dom: [0, null], range: [0, Math.max(3 * x0, 4)],
          pro: R`$\lim_{x \to \infty} \frac{\log x}{x} = 0$、$\lim_{x \to +0} \frac{\log x}{x} = -\infty$。$\frac{\log x}{x}$ の最大値 $\frac{1}{e}$ は $e^{\pi}$ と $\pi^{e}$ の大小比較などで頻出です。`
        };
      }
    },
    xlog: {
      label: 'xᵃ log x', needK: true, kdef: '1',
      kErr: (k) => (k.sign() <= 0 ? 'a は正の値を入力してください' : null),
      make(k) {
        const kv = k.val(), XK = xpowT(k), km = k.sub(1);
        const x0 = Math.exp(-1 / kv);
        return {
          yT: (k.eq(1) ? 'x' : XK) + R`\log x`, f: (x) => Math.pow(x, kv) * Math.log(x), df: (x) => Math.pow(x, kv - 1) * (kv * Math.log(x) + 1),
          F: (X) => V.pow(X, k).mul(V.ln(X)),
          dF: (X) => V.pow(X, km).mul(V.q(k).mul(V.ln(X)).add(V.q(1))),
          dT: (km.isZero() ? '' : xpowT(km)) + R`\left(` + cT(k) + R`\log x + 1\right)`,
          dSteps: [
            R`y' = \left(` + XK + R`\right)' \log x + ` + XK + R` \cdot (\log x)'`,
            R`= ` + (k.eq(1) ? '' : cT(k) + (km.isZero() ? '' : xpowT(km))) + R`\log x + ` + XK + R` \cdot \frac{1}{x}`,
            R`= ` + (km.isZero() ? '' : xpowT(km)) + R`\left(` + cT(k) + R`\log x + 1\right)`
          ],
          dRule: R`積の微分と $(\log x)' = \frac{1}{x}$ を使います。`,
          dEasy: R`$` + XK + R` \cdot \frac{1}{x}$ は約分すると $` + (km.isZero() ? '1' : xpowT(km)) + R`$ です。共通因数でくくると符号が調べやすくなります。`,
          crit: [V.e(k.inv().neg(), Q(0))],
          zeroT: cT(k) + R`\log x + 1 = 0 \;\Rightarrow\; \log x = ` + k.inv().neg().tex() + R` \;\Rightarrow\; x = ` + eTex(k.inv().neg(), Q(0)),
          signT: R`$x > 0$ で $` + (km.isZero() ? '1' : xpowT(km)) + R` > 0$ なので、$y'$ の符号は $` + cT(k) + R`\log x + 1$ の符号と同じです。`,
          dom: [0, null], range: [0, Math.max(4 * x0, 2.2)],
          pro: R`$\lim_{x \to +0} x\log x = 0$（グラフは原点に向かう）は頻出の極限です。`
        };
      }
    },
    xmlog: {
      label: 'x − a log x', needK: true, kdef: '1',
      kErr: (k) => (k.sign() <= 0 ? 'a は正の値を入力してください' : null),
      make(k) {
        const kv = k.val();
        return {
          yT: 'x - ' + cT(k) + R`\log x`, f: (x) => x - kv * Math.log(x), df: (x) => 1 - kv / x,
          F: (X) => V.of(X).sub(V.q(k).mul(V.ln(X))),
          dF: (X) => V.q(1).sub(V.q(k).mul(V.of(X).inv())),
          dT: R`\frac{` + P.tex([k.neg(), Q(1)]) + '}{x}',
          dSteps: [R`y' = 1 - ` + cT(k) + R` \cdot \frac{1}{x}`, R`= \frac{` + P.tex([k.neg(), Q(1)]) + '}{x}'],
          dRule: R`$(\log x)' = \frac{1}{x}$ を使い、通分します。`,
          dEasy: R`通分して 1 つの分数にすると、分子・分母それぞれの符号から $y'$ の符号が分かります。`,
          crit: [V.q(k)],
          zeroT: P.tex([k.neg(), Q(1)]) + R` = 0 \;\Rightarrow\; x = ` + k.tex(),
          signT: R`$x > 0$ なので、$y'$ の符号は分子 $` + P.tex([k.neg(), Q(1)]) + R`$ の符号と同じです。`,
          dom: [0, null], range: [0, 3 * kv + 1.5],
          pro: R`最小値が正であることから、不等式 $x > ` + cT(k) + R`\log x$ のような証明に使えます（$a < e$ のとき）。`
        };
      }
    },
    frac: {
      label: 'x / (x² + a)', needK: true, kdef: '1',
      kErr: (k) => (k.sign() <= 0 ? 'a は正の値を入力してください' : null),
      make(k) {
        const kv = k.val(), D = P.tex([k, Q(0), Q(1)]), s = Math.sqrt(kv);
        return {
          yT: R`\frac{x}{` + D + '}', f: (x) => x / (x * x + kv), df: (x) => (kv - x * x) / Math.pow(x * x + kv, 2),
          F: (X) => V.of(X).mul(V.pow(X, 2).add(V.q(k)).inv()),
          dF: (X) => V.q(k).sub(V.pow(X, 2)).mul(V.pow(V.pow(X, 2).add(V.q(k)), 2).inv()),
          dT: R`\frac{` + P.tex([k, Q(0), Q(-1)]) + R`}{\left(` + D + R`\right)^{2}}`,
          dSteps: [R`y' = \frac{1 \cdot \left(` + D + R`\right) - x \cdot 2x}{\left(` + D + R`\right)^{2}}`, R`= \frac{` + P.tex([k, Q(0), Q(-1)]) + R`}{\left(` + D + R`\right)^{2}}`],
          dRule: R`商の微分 $\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^{2}}$ を使います。`,
          dEasy: R`分子の $x$ を微分すると 1、分母の $` + D + R`$ を微分すると $2x$ です。`,
          crit: [V.sqrt(k).neg(), V.sqrt(k)],
          zeroT: P.tex([k, Q(0), Q(-1)]) + R` = 0 \;\Rightarrow\; x = \pm ` + V.sqrt(k).tex(),
          signT: R`分母 $\left(` + D + R`\right)^{2} > 0$ なので、$y'$ の符号は分子 $` + P.tex([k, Q(0), Q(-1)]) + R`$（上に凸の放物線）の符号と同じです。`,
          dom: [null, null], range: [-4 * s, 4 * s],
          pro: R`奇関数（原点対称）なので、$x \ge 0$ だけ調べて対称に広げてもよい。$\lim_{x \to \pm\infty} y = 0$ で $x$ 軸が漸近線です。`
        };
      }
    },
    expx: {
      label: 'eˣ − ax', needK: true, kdef: '1',
      kErr: (k) => (k.sign() <= 0 ? 'a は正の値を入力してください' : null),
      make(k) {
        const kv = k.val(), x0 = Math.log(kv);
        return {
          yT: 'e^{x} - ' + cT(k) + 'x', f: (x) => Math.exp(x) - kv * x, df: (x) => Math.exp(x) - kv,
          F: (X) => V.exp(X).sub(V.q(k).mul(X)),
          dF: (X) => V.exp(X).sub(V.q(k)),
          dT: 'e^{x} - ' + k.tex(),
          dSteps: [R`y' = e^{x} - ` + k.tex()],
          dRule: R`$(e^{x})' = e^{x}$、$(ax)' = a$ を使います。`,
          dEasy: R`$e^{x}$ は微分しても $e^{x}$ のままです。`,
          crit: [V.logQ(k)],
          zeroT: R`e^{x} = ` + k.tex() + R` \;\Rightarrow\; x = \log ` + k.tex() + (k.eq(1) ? ' = 0' : ''),
          signT: R`$e^{x}$ は増加関数なので、$x < \log ` + k.tex() + R`$ で $e^{x} < ` + k.tex() + R`$（$y' < 0$）、$x > \log ` + k.tex() + R`$ で $y' > 0$ です。`,
          dom: [null, null], range: [x0 - 3, x0 + 2.5],
          pro: R`$a = 1$ のとき最小値 1 > 0 から不等式 $e^{x} > x$（さらに $e^{x} \ge x + 1$）が示せます。`
        };
      }
    },
    xpa: {
      label: 'x + a/x', needK: true, kdef: '1',
      kErr: (k) => (k.sign() <= 0 ? 'a は正の値を入力してください' : null),
      make(k) {
        const kv = k.val(), s = Math.sqrt(kv);
        return {
          yT: 'x + ' + (k.isInt() ? R`\frac{` + k.n + '}{x}' : R`\frac{` + k.n + '}{' + k.d + 'x}'), f: (x) => x + kv / x, df: (x) => 1 - kv / (x * x),
          F: (X) => V.of(X).add(V.q(k).mul(V.of(X).inv())),
          dF: (X) => V.q(1).sub(V.q(k).mul(V.pow(X, 2).inv())),
          dT: R`\frac{` + P.tex([k.neg(), Q(0), Q(1)]) + R`}{x^{2}}`,
          dSteps: [R`y' = 1 - \frac{` + k.tex() + R`}{x^{2}}`, R`= \frac{` + P.tex([k.neg(), Q(0), Q(1)]) + R`}{x^{2}}`],
          dRule: R`$\left(\frac{1}{x}\right)' = -\frac{1}{x^{2}}$ を使い、通分します。`,
          dEasy: R`$\frac{1}{x} = x^{-1}$ と見ると、$(x^{-1})' = -x^{-2} = -\frac{1}{x^{2}}$ です。`,
          crit: [V.sqrt(k).neg(), V.sqrt(k)], gaps: [V.q(0)],
          zeroT: P.tex([k.neg(), Q(0), Q(1)]) + R` = 0 \;\Rightarrow\; x = \pm ` + V.sqrt(k).tex(),
          signT: R`$x \ne 0$ で $x^{2} > 0$ なので、$y'$ の符号は分子 $` + P.tex([k.neg(), Q(0), Q(1)]) + R`$（下に凸の放物線）の符号と同じです。$x = 0$ では定義されません。`,
          dom: [null, null], range: [-4 * s, 4 * s], asym: true,
          pro: R`$x > 0$ では相加平均・相乗平均の関係 $x + \frac{a}{x} \ge 2\sqrt{a}$ でも最小値が出ます。直線 $y = x$ と $y$ 軸が漸近線です。`
        };
      }
    },
    sc: {
      label: 'sin x + cos x（0 ≤ x ≤ 2π）', needK: false,
      make() {
        return {
          yT: R`\sin x + \cos x`, f: (x) => Math.sin(x) + Math.cos(x), df: (x) => Math.cos(x) - Math.sin(x),
          F: (X) => V.sin(X).add(V.cos(X)),
          dF: (X) => V.cos(X).sub(V.sin(X)),
          dT: R`\cos x - \sin x`,
          dSteps: [R`y' = \cos x - \sin x`],
          dRule: R`$(\sin x)' = \cos x$、$(\cos x)' = -\sin x$ を使います。`,
          dEasy: R`$\sin$ と $\cos$ の微分は、符号に注意しながら入れかわるだけです。`,
          crit: [V.pi(Q(1, 4)), V.pi(Q(5, 4))],
          zeroT: R`\cos x = \sin x \;\Rightarrow\; \tan x = 1 \;\Rightarrow\; x = \frac{\pi}{4},\ \frac{5}{4}\pi \quad (0 \le x \le 2\pi)`,
          signT: R`単位円で考えると、$\cos x > \sin x$ となるのは $0 \le x < \frac{\pi}{4},\ \frac{5}{4}\pi < x \le 2\pi$ です。`,
          dom: [0, TWO_PI, true], range: [0, TWO_PI],
          pro: R`三角関数の合成 $\sin x + \cos x = \sqrt{2}\sin\left(x + \frac{\pi}{4}\right)$ を使えば、微分しなくても最大値 $\sqrt{2}$・最小値 $-\sqrt{2}$ が分かります。`
        };
      }
    },
    esin: {
      label: 'e^(−x) sin x（0 ≤ x ≤ 2π）', needK: false,
      make() {
        return {
          yT: R`e^{-x}\sin x`, f: (x) => Math.exp(-x) * Math.sin(x), df: (x) => Math.exp(-x) * (Math.cos(x) - Math.sin(x)),
          F: (X) => V.exp(V.of(X).neg()).mul(V.sin(X)),
          dF: (X) => V.exp(V.of(X).neg()).mul(V.cos(X).sub(V.sin(X))),
          dT: R`e^{-x}(\cos x - \sin x)`,
          dSteps: [R`y' = \left(e^{-x}\right)'\sin x + e^{-x}(\sin x)'`, R`= -e^{-x}\sin x + e^{-x}\cos x`, R`= e^{-x}(\cos x - \sin x)`],
          dRule: R`積の微分と $\left(e^{-x}\right)' = -e^{-x}$ を使います。`,
          dEasy: R`$e^{-x}$ は「$e^{u}$ の中身が $u = -x$」なので、微分すると $-1$ が前に出ます。`,
          crit: [V.pi(Q(1, 4)), V.pi(Q(5, 4))],
          zeroT: R`e^{-x} > 0 \text{ より } \cos x = \sin x \;\Rightarrow\; x = \frac{\pi}{4},\ \frac{5}{4}\pi`,
          signT: R`$e^{-x} > 0$ なので、$y'$ の符号は $\cos x - \sin x$ の符号と同じです。`,
          dom: [0, TWO_PI, true], range: [0, TWO_PI],
          pro: R`$x \ge 0$ 全体で考えると、極値は $x = \frac{\pi}{4} + n\pi$ で現れ、極大値は公比 $e^{-2\pi}$ の等比数列になります（無限級数の頻出テーマ）。`
        };
      }
    }
  };
  const FAM_OPTS = Object.keys(FAM).map((key) => [key, FAM[key].label]);

  // 増減表を作る
  function zouzou(F) {
    const dlo = F.dom[0], dhi = F.dom[1], closed = !!F.dom[2];
    const brk = F.crit.map((x) => ({ x: x, t: 'c' })).concat((F.gaps || []).map((x) => ({ x: x, t: 'g' })));
    brk.sort((p, q) => p.x.val() - q.x.val());
    const cols = [];
    const ival = (a, b) => {
      let m;
      if (a === null && b === null) m = 0;
      else if (a === null) m = b - 1;
      else if (b === null) m = a + 1;
      else m = (a + b) / 2;
      const s = F.df(m) > 0 ? 1 : -1;
      return { x: '…', d: s > 0 ? '+' : '−', y: s > 0 ? '↗' : '↘', s: s, kind: 'i' };
    };
    if (dlo !== null && closed) cols.push({ x: plainX(dlo), d: '', y: V.of(F.F(exactPt(dlo))).txt(), kind: 'e', xv: dlo });
    let prev = dlo;
    brk.forEach((b) => {
      cols.push(ival(prev, b.x.val()));
      if (b.t === 'c') cols.push({ x: b.x.txt(), d: '0', kind: 'c', X: b.x });
      else cols.push({ x: b.x.txt(), d: '×', y: '×', kind: 'g' });
      prev = b.x.val();
    });
    cols.push(ival(prev, dhi));
    if (dhi !== null && closed) cols.push({ x: plainX(dhi), d: '', y: V.of(F.F(exactPt(dhi))).txt(), kind: 'e', xv: dhi });
    const ext = [];
    cols.forEach((c, i) => {
      if (c.kind !== 'c') return;
      const l = cols[i - 1], r = cols[i + 1];
      const Y = F.F(c.X);
      let kind = '';
      if (l && r && l.s > 0 && r.s < 0) kind = '極大';
      else if (l && r && l.s < 0 && r.s > 0) kind = '極小';
      c.y = kind ? [kind, Y.txt()] : Y.txt();
      ext.push({ kind: kind, X: c.X, Y: Y });
    });
    const rows = [['x'].concat(cols.map((c) => c.x)), ["y'"].concat(cols.map((c) => c.d)), ['y'].concat(cols.map((c) => c.y))];
    return { cols: cols, ext: ext, svg: tableSvg(rows, { grid: false, minW: 28, caption: (F.gaps ? '× は定義されない点　' : '') + '増減表' }) };
  }
  function exactPt(x) { return Math.abs(x - TWO_PI) < 1e-12 ? V.pi(Q(2)) : exactOf(x); }
  function plainX(x) { return Math.abs(x - TWO_PI) < 1e-12 ? '2π' : plain(x, 4); }

  JK.registerCalc({
    id: 'iiic-diff-table',
    course: 'IIIC',
    unit: 'm-diff3',
    group: '微分法',
    title: 'いろいろな関数の増減・極値',
    desc: R`$xe^{-ax}$、$\dfrac{\log x}{x^{a}}$、$x - a\log x$、$\dfrac{x}{x^{2}+a}$、$\sin x + \cos x$ など 10 種類の関数について、導関数 → 符号 → 増減表 → 極値 の順に調べ、グラフを描きます。`,
    form: R`y' > 0 \Rightarrow \text{増加},\qquad y' < 0 \Rightarrow \text{減少}`,
    inputs: [
      { key: 'fn', label: '関数', type: 'select', def: 'xe', options: FAM_OPTS },
      { key: 'k', label: '係数 $a$', type: 'q', def: '1', min: -10, max: 10, show: (raw) => raw.fn !== 'sc' && raw.fn !== 'esin' }
    ],
    examples: [
      { label: 'log x / x', v: { fn: 'logx', k: '1' } },
      { label: 'x² e^(−x)', v: { fn: 'x2e', k: '1' } },
      { label: 'x / (x² + 1)', v: { fn: 'frac', k: '1' } },
      { label: 'sin x + cos x', v: { fn: 'sc' } },
      { label: 'x + 4/x', v: { fn: 'xpa', k: '4' } }
    ],
    intro: {
      easy: R`グラフの各点で接線の傾き（導関数 $y'$ の値）を調べると、**$y' > 0$ のところでは右上がり（増加）、$y' < 0$ のところでは右下がり（減少）** になっています。$y'$ が正から負に変わる点は山の頂上（**極大**）、負から正に変わる点は谷の底（**極小**）です。そこで「$y' = 0$ となる $x$ を求める → その前後で $y'$ の符号を調べる → 表（**増減表**）にまとめる」という手順で、グラフの形を調べます。数IIの 3 次関数と同じ手順ですが、数IIIでは $e^{x}$・$\log x$・三角関数を含む関数も扱います。`,
      normal: R`導関数を因数分解（または共通因数でくくる）し、「つねに正の因数」を除いて符号を決める因数を見つけるのがコツです。`,
      pro: R`増減表の端には $\lim$ の値（$x \to \pm\infty$ や $x \to +0$）を書き込むと、グラフの概形・最大最小・方程式の実数解の個数まで一気に処理できます。`
    },
    compute(v) {
      const key = FAM[v.fn] ? v.fn : 'xe', fam = FAM[key];
      let k = null;
      if (fam.needK) {
        k = v.k || Q(1);
        const er = fam.kErr(k);
        if (er) throw new JK.CalcError(er);
      }
      const F = fam.make(k);
      const tb = zouzou(F);
      const domT = F.dom[2] ? R`0 \le x \le 2\pi` : (F.dom[0] === 0 ? 'x > 0' : (F.gaps ? R`x \ne 0` : R`\text{すべての実数}`));
      // 傾きの数値表
      const r0 = F.range[0] === 0 ? 0 : F.range[0], r1 = F.range[1];
      const xs = [];
      for (let i = 1; i <= 6; i++) {
        const x = r0 + (r1 - r0) * i / 7;
        if (!(F.gaps && Math.abs(x) < 1e-9)) xs.push(x);
      }
      const steps = [{
        t: R`そもそも導関数の符号と増減の関係 — 接線の傾きを数値で見る`,
        m: [R`y' > 0 \;\Rightarrow\; \text{右上がり（増加）},\qquad y' < 0 \;\Rightarrow\; \text{右下がり（減少）}`],
        n: R`いくつかの $x$ で接線の傾き $y'$ を計算すると、表のように符号が変わる場所があります。そこが山の頂上か谷の底です。`,
        easy: R`坂道を歩くとき、上り坂（傾きが正）から下り坂（傾きが負）に変わる地点が山の頂上です。導関数 $y'$ はグラフの「坂の傾き」を表します。`,
        fig: tableSvg([['x'].concat(xs.map((x) => plain(x, 2))), ["y'"].concat(xs.map((x) => plain(F.df(x), 3))), ['増減'].concat(xs.map((x) => (F.df(x) > 0 ? '↗' : '↘')))], { caption: "いくつかの点での接線の傾き y'" }),
        lv: 3
      }, {
        t: '定義域を確認する',
        m: 'y = ' + F.yT + R`\qquad (` + domT + ')',
        n: F.dom[0] === 0 ? R`$\log x$ を含むので、真数条件から $x > 0$ で考えます。` : (F.gaps ? R`分母が 0 になる $x = 0$ を除きます。` : (F.dom[2] ? R`問題で指定された範囲 $0 \le x \le 2\pi$ で考えます。` : R`すべての実数で定義されています。`)),
        easy: R`定義域（$x$ が動ける範囲）の外では関数そのものがないので、増減表もその範囲で作ります。`,
        lv: 2
      }, {
        t: '導関数を求める',
        m: F.dSteps,
        n: F.dRule,
        easy: F.dEasy
      }, {
        t: R`$y' = 0$ となる $x$ を求める`,
        m: F.zeroT,
        n: R`極値の候補は $y' = 0$ となる点です。`,
        easy: R`$y' = 0$ は「接線が水平」になる点です。山の頂上と谷の底では、接線は水平になります。`
      }, {
        t: R`$y'$ の符号を調べる`,
        m: "y' = " + F.dT,
        n: F.signT,
        easy: R`「つねに正のもの（$e^{x}$、2 乗、$x > 0$ での $x$ など）」は符号に影響しないので無視し、残った部分の符号だけを見ます。`
      }, {
        t: '増減表をつくる',
        n: R`$y'$ の符号の行で $+$ なら ↗（増加）、$-$ なら ↘（減少）を $y$ の行に書きます。↗ から ↘ に変わる点が極大、↘ から ↗ に変わる点が極小です。`,
        easy: R`表の矢印をつなげると、グラフの大まかな形（山と谷）がそのまま見えてきます。右の図と見比べてみましょう。`,
        fig: tb.svg
      }];
      const mx = tb.ext.filter((e) => e.kind === '極大'), mn = tb.ext.filter((e) => e.kind === '極小');
      const extLine = (e) => R`\text{` + e.kind + R`値 } y = ` + vfull(e.Y) + R`\quad (x = ` + e.X.tex() + ')';
      steps.push({
        t: '極値を求める',
        m: tb.ext.filter((e) => e.kind).map((e) => 'x = ' + e.X.tex() + R`\text{ のとき } y = ` + F.yT.replace(/x/g, '{x}').replace(/\{x\}/g, 'x') + '' === '' ? '' : extLine(e)),
        n: R`増減表から、極値は次のとおりです。値は $x$ を元の式に代入して求めます。`,
        easy: R`極値は「その近くでいちばん大きい（小さい）値」です。定義域全体での最大・最小とは限らない点に注意しましょう。`,
        pro: F.pro
      });
      // 図
      const x0 = F.range[0] === 0 ? 1e-3 : F.range[0], x1 = F.range[1];
      const pts = tb.ext.filter((e) => e.kind).map((e) => ({ x: e.X.val(), y: e.Y.val(), cls: e.kind === '極大' ? 'c3' : 'c2', label: e.kind + ' (' + e.X.txt() + ', ' + e.Y.txt() + ')', pos: e.kind === '極大' ? 'tr' : 'br' }));
      tb.cols.filter((c) => c.kind === 'e').forEach((c) => { const y = F.f(c.xv); pts.push({ x: c.xv, y: y, cls: 'c4' }); });
      const curves = [{ f: F.f, cls: 'c1', domain: [x0, x1] }];
      if (F.asym) curves.push({ f: (x) => x, cls: 'dim', dash: true, noScale: true });
      return {
        result: [
          { label: "導関数 y'", tex: "y' = " + F.dT },
          { label: '極大値', tex: mx.length ? mx.map((e) => vfull(e.Y) + R`\ (x = ` + e.X.tex() + ')').join(R`,\ `) : R`\text{なし}` },
          { label: '極小値', tex: mn.length ? mn.map((e) => vfull(e.Y) + R`\ (x = ` + e.X.tex() + ')').join(R`,\ `) : R`\text{なし}` }
        ],
        steps: steps,
        fig: graph({
          x: [F.range[0], x1], mustY: tb.ext.map((e) => e.Y.val()),
          curves: curves, points: pts,
          vlines: F.gaps ? [{ x: 0, cls: 'dim' }] : []
        })
      };
    }
  });

  /* ================= 5. 接線・法線 ================= */

  const BASIC = {
    exp: { label: 'eˣ', make: () => ({ yT: 'e^{x}', f: Math.exp, df: Math.exp, F: (X) => V.exp(X), dF: (X) => V.exp(X), dT: 'e^{x}', dSteps: [R`y' = e^{x}`], dRule: R`$(e^{x})' = e^{x}$`, dEasy: R`$e^{x}$ は微分しても変わりません。`, dom: [null, null] }) },
    log: { label: 'log x', make: () => ({ yT: R`\log x`, f: Math.log, df: (x) => 1 / x, F: (X) => V.ln(X), dF: (X) => V.of(X).inv(), dT: R`\frac{1}{x}`, dSteps: [R`y' = \frac{1}{x}`], dRule: R`$(\log x)' = \frac{1}{x}$`, dEasy: R`$\log x$ は $x > 0$ で定義され、傾きは $\frac{1}{x}$ です。`, dom: [0, null] }) },
    sqrt: { label: '√x', make: () => ({ yT: R`\sqrt{x}`, f: Math.sqrt, df: (x) => 1 / (2 * Math.sqrt(x)), F: (X) => V.pow(X, Q(1, 2)), dF: (X) => V.pow(X, Q(-1, 2)).mul(V.q(Q(1, 2))), dT: R`\frac{1}{2\sqrt{x}}`, dSteps: [R`y' = \left(x^{\frac{1}{2}}\right)' = \frac{1}{2}x^{-\frac{1}{2}} = \frac{1}{2\sqrt{x}}`], dRule: R`$\sqrt{x} = x^{\frac{1}{2}}$ として累乗の微分を使います。`, dEasy: R`ルートは $\frac{1}{2}$ 乗です。$x = 0$ では接線が縦になり、微分係数は定義されません。`, dom: [0, null] }) },
    sin: { label: 'sin x', make: () => ({ yT: R`\sin x`, f: Math.sin, df: Math.cos, F: (X) => V.sin(X), dF: (X) => V.cos(X), dT: R`\cos x`, dSteps: [R`y' = \cos x`], dRule: R`$(\sin x)' = \cos x$`, dEasy: R`$\sin x$ の傾きをたどると $\cos x$ のグラフになります。`, dom: [null, null] }) },
    cos: { label: 'cos x', make: () => ({ yT: R`\cos x`, f: Math.cos, df: (x) => -Math.sin(x), F: (X) => V.cos(X), dF: (X) => V.sin(X).neg(), dT: R`-\sin x`, dSteps: [R`y' = -\sin x`], dRule: R`$(\cos x)' = -\sin x$`, dEasy: R`$\cos x$ の微分はマイナスがつきます。`, dom: [null, null] }) }
  };
  function polyFam(p) {
    const dp = P.deriv(p);
    return { yT: P.tex(p), f: P.fn(p), df: P.fn(dp), F: (X) => pevalV(p, X), dF: (X) => pevalV(dp, X), dT: P.tex(dp), dSteps: ["y' = " + P.tex(dp)], dRule: R`多項式は $(x^{n})' = nx^{n-1}$ で項ごとに微分します。`, dEasy: R`数IIと同じ多項式の微分です。`, dom: [null, null] };
  }
  const TAN_OPTS = [['poly', '多項式（下に入力）']].concat(Object.keys(BASIC).map((k) => [k, BASIC[k].label])).concat(FAM_OPTS);

  JK.registerCalc({
    id: 'iiic-tangent3',
    course: 'IIIC',
    unit: 'm-diff3',
    group: '微分法',
    title: '接線・法線の方程式',
    desc: R`曲線 $y = f(x)$ 上の点 $(t,\ f(t))$ における接線 $y - f(t) = f'(t)(x - t)$ と法線 $y - f(t) = -\dfrac{1}{f'(t)}(x - t)$ を求めます。$e^{x}$・$\log x$・三角関数などを含む曲線や多項式に対応します。`,
    form: [R`\text{接線: } y - f(t) = f'(t)(x - t)`, R`\text{法線: } y - f(t) = -\frac{1}{f'(t)}(x - t)`],
    inputs: [
      { key: 'fn', label: '曲線 $y = f(x)$', type: 'select', def: 'log', options: TAN_OPTS },
      { key: 'p', label: '$f(x)$（多項式）', type: 'poly', def: 'x^3 - 3x', show: (raw) => raw.fn === 'poly' },
      { key: 'k', label: '係数 $a$', type: 'q', def: '1', min: -10, max: 10, show: (raw) => !!FAM[raw.fn] && FAM[raw.fn].needK },
      { key: 't', label: '接点の $x$ 座標 $t$', type: 'num', def: 'e', min: -20, max: 20, hint: 'e, π/6, 1/2 などの入力もできます' }
    ],
    examples: [
      { label: 'y = eˣ（x = 1）', v: { fn: 'exp', t: '1' } },
      { label: 'y = sin x（x = π/3）', v: { fn: 'sin', t: 'π/3' } },
      { label: 'y = √x（x = 4）', v: { fn: 'sqrt', t: '4' } },
      { label: 'y = x e^(−x)（x = 2）', v: { fn: 'xe', k: '1', t: '2' } },
      { label: '多項式（x = 2）', v: { fn: 'poly', p: 'x^3 - 3x', t: '2' } }
    ],
    intro: {
      easy: R`曲線を虫めがねでどんどん拡大していくと、ある点の近くでは曲線はほとんどまっすぐな線に見えてきます。そのまっすぐな線が**接線**で、傾きは微分係数 $f'(t)$ です。**法線**は、接点を通って接線に垂直な直線です。垂直な 2 直線の傾きの積は $-1$ なので、法線の傾きは $-\frac{1}{f'(t)}$ になります。どちらも「点 $(t,\ f(t))$ を通り、傾きが分かっている直線」なので、数IIの直線の式 $y - y_{1} = m(x - x_{1})$ で求められます。`,
      normal: R`$f(t)$ と $f'(t)$ を求めて、公式に代入します。$f'(t) = 0$ のとき法線は $x = t$（$y$ 軸に平行）です。`,
      pro: R`「曲線外の点から引いた接線」は、接点を $(t,\ f(t))$ とおいて接線の式を作り、通る点を代入して $t$ の方程式を解くのが定石です。`
    },
    compute(v) {
      let F, name = TAN_OPTS.some((o) => o[0] === v.fn) ? v.fn : 'log';
      if (name === 'poly') {
        const p = v.p || P.parse('x^3 - 3x');
        if (P.deg(p) > 8) throw new JK.CalcError('次数は 8 以下にしてください');
        F = polyFam(p);
      } else if (BASIC[name]) F = BASIC[name].make();
      else {
        const fam = FAM[name];
        let k = null;
        if (fam.needK) {
          k = v.k || Q(1);
          const er = fam.kErr(k);
          if (er) throw new JK.CalcError(er);
        }
        F = fam.make(k);
      }
      const t = v.t, X = exactOf(t);
      if (F.dom[0] === 0 && !(t > 0)) throw new JK.CalcError('この関数は x > 0 で考えます。t は正の値を入力してください');
      if (F.dom[2] && (t < -1e-12 || t > TWO_PI + 1e-12)) throw new JK.CalcError('この関数は 0 ≦ x ≦ 2π で考えます。t はその範囲で入力してください');
      if (F.gaps && Math.abs(t) < 1e-12) throw new JK.CalcError('x = 0 では関数が定義されません');
      const Y = V.of(F.F(X)), M = V.of(F.dF(X));
      if (!fin(Y.val()) || !fin(M.val())) throw new JK.CalcError('この点では値が大きすぎるか、定義されません');
      const tv = X.val(), yv = Y.val(), mv = M.val();
      const B = Y.sub(M.mul(X));
      const tanT = lineTex(M, B);
      let norT, NA = null, NB = null;
      if (M.isZero()) norT = 'x = ' + X.tex();
      else { NA = M.inv().neg(); NB = Y.add(X.mul(M.inv())); norT = lineTex(NA, NB); }
      const hs = [1, 0.1, 0.01, 0.001];
      const sec = (h) => (F.f(tv + h) - F.f(tv)) / h;
      const steps = [{
        t: 'そもそも接線とは — 近くの 2 点を結ぶ直線の傾き',
        m: [R`\frac{f(t + h) - f(t)}{h} \;\to\; f'(t) \quad (h \to 0)`],
        n: R`接点と、そこから $h$ だけ離れた曲線上の点を結ぶ直線（割線）の傾きは、$h$ を 0 に近づけると接線の傾き $f'(t)$ に近づきます。表で確かめましょう。`,
        easy: R`2 点をどんどん近づけると、2 点を結ぶ直線は曲線に「接する」直線に近づいていきます。その極限が接線です。`,
        fig: tableSvg([['h'].concat(hs.map(String)), ['傾き'].concat(hs.map((h) => plain(sec(h), 5)))], { caption: '割線の傾き (f(t+h) − f(t)) / h' }),
        lv: 3
      }, {
        t: '導関数を求める',
        m: F.dSteps,
        n: F.dRule,
        easy: F.dEasy
      }, {
        t: '接点の座標と接線の傾き',
        m: [R`f(` + X.tex() + ')' + eqv(Y), R`f'(` + X.tex() + ')' + eqv(M)],
        n: R`接点は $\left(` + X.tex() + R`,\ ` + (Y.exact() ? Y.tex() : num(Y.ax)) + R`\right)$、接線の傾きは $f'(` + X.tex() + R`)$ です。`,
        easy: R`$f(t)$ は接点の高さ、$f'(t)$ は接点での傾きです。元の式と導関数の式に、それぞれ $x = t$ を代入します。`
      }, {
        t: '接線の方程式',
        m: [R`y - f(t) = f'(t)(x - t)`, 'y' + minusV(Y) + ' = ' + pv(M) + R`\left(x` + minusV(X) + R`\right)`, tanT],
        n: R`点 $(t,\ f(t))$ を通り、傾き $f'(t)$ の直線です。展開して $y = mx + n$ の形に整理しました。`,
        easy: R`数IIで学んだ「点 $(x_{1},\ y_{1})$ を通り傾き $m$ の直線 $y - y_{1} = m(x - x_{1})$」そのものです。`,
        pro: R`記述では $y - f(t) = f'(t)(x - t)$ の形を一度書いてから代入すると、部分点をもらいやすくなります。`
      }];
      if (M.isZero()) {
        steps.push({
          t: '法線の方程式',
          m: norT,
          n: R`接線の傾きが 0（$x$ 軸に平行）なので、法線は $y$ 軸に平行な直線 $x = ` + X.tex() + R`$ です。`,
          easy: R`水平な線に垂直な線は、まっすぐ縦の線です。`
        });
      } else {
        steps.push({
          t: '法線の方程式',
          m: [R`y - f(t) = -\frac{1}{f'(t)}(x - t)`, R`-\frac{1}{f'(t)} = ` + vfull(NA), norT],
          n: R`接線に垂直なので、傾きは $-\frac{1}{f'(t)}$ です。`,
          easy: R`垂直に交わる 2 直線の傾きを掛けると $-1$ になります（例: 傾き 2 と $-\frac{1}{2}$）。だから法線の傾きは「接線の傾きの逆数にマイナスをつけたもの」です。`
        });
      }
      // 図（縦横等倍で垂直に見えるように）
      const W = 3;
      const curves = [{ f: F.f, cls: 'c1' }, { f: (x) => mv * (x - tv) + yv, cls: 'c2', noScale: true }];
      if (!M.isZero()) curves.push({ f: (x) => -(x - tv) / mv + yv, cls: 'c3', dash: true, noScale: true });
      return {
        result: [
          { label: '接点', tex: R`\left(` + X.tex() + R`,\ ` + (Y.exact() ? Y.tex() : num(Y.ax)) + R`\right)` },
          { label: '接線', tex: tanT },
          { label: '法線', tex: norT }
        ],
        steps: steps,
        fig: graph({
          x: [tv - W, tv + W], y: [yv - W * 0.7, yv + W * 0.7], equal: true,
          curves: curves,
          vlines: M.isZero() ? [{ x: tv, cls: 'c3' }] : [],
          points: [{ x: tv, y: yv, cls: 'c4', label: '接点', pos: 'br' }],
          labels: [{ x: tv + W * 0.55, y: yv + mv * W * 0.55, text: '接線', cls: 'c2' }]
        })
      };
    }
  });
})();
