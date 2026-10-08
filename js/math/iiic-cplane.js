/* 数C — 複素数平面
   極形式 / 極形式の積・商 / ド・モアブルの定理 / n 乗根 / 点のまわりの回転・拡大 / 図形への応用 / 方程式の表す図形
   構成は ia-quad.js に準拠（intro → result → steps(easy/pro/lv) → fig）。
   未習者（高1・高2）向けに、各計算機の冒頭に lv:3 の「そもそも〜とは」ステップを置く。
   実部・虚部は厳密値 V（有理数・根号・π の 1 次結合。iiic-diff.js と同じ方式）で扱い、15° の倍数の角は厳密値、それ以外は近似値で示す。 */
(function () {
  'use strict';
  const R = String.raw;
  const Q = JK.Q, U = JK.util;

  /* ================= 表示の共通ヘルパー ================= */

  function fin(x) { return typeof x === 'number' && isFinite(x); }
  const SUPS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(s) { return String(s).split('').map((c) => SUPS[c] || c).join(''); }
  const SUBS = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '-': '₋' };
  function subS(s) { return String(s).split('').map((c) => SUBS[c] || c).join(''); }
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
    if (ax < 1e-12) return '0';
    if (ax >= 1e7 || ax < 1e-4) return U.sig(x, sig - 1);
    return U.fmt(x, Math.min(10, Math.max(0, sig - 1 - Math.floor(Math.log10(ax)))));
  }
  function sumTex(items) {
    items = items.filter(Boolean);
    if (!items.length) return '0';
    return items.map((t, i) => (i === 0 ? (t.neg ? '-' : '') : (t.neg ? ' - ' : ' + ')) + t.body).join('');
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
  V.num = (x) => new V(null, fin(x) && Math.abs(x) < 1e-13 ? 0 : x);
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
    // a + b√r の形なら有理化
    if (a.exact() && a.t.length === 2 && !a.t[0].s.length && !a.t[1].s.length && a.t.every((t) => t.pk === 0 && t.ep.isZero() && t.eq.isZero())) {
      const conj = new V([a.t[0], T(a.t[1].c.neg(), a.t[1].r)]);
      const d = a.mul(conj);
      if (d.isQ() && !d.isZero()) return conj.mul(V.q(d.q().inv()));
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
    if (q.isZero()) return '0';
    if (q.eq(1)) return R`\pi`;
    if (q.eq(-1)) return R`-\pi`;
    const a = q.abs(), sg = q.sign() < 0 ? '-' : '';
    if (a.d === 1) return sg + a.n + R`\pi`;
    return sg + R`\frac{` + (a.n === 1 ? '' : a.n) + R`\pi}{` + a.d + '}';
  }
  function piQTxt(q) {
    if (q.isZero()) return '0';
    if (q.eq(1)) return 'π';
    if (q.eq(-1)) return '-π';
    const a = q.abs(), sg = q.sign() < 0 ? '-' : '';
    return sg + (a.n === 1 ? '' : a.n) + 'π' + (a.d === 1 ? '' : '/' + a.d);
  }
  function eTex(p) { return p.eq(1) ? 'e' : 'e^{' + p.tex() + '}'; }
  function tbody(t, tex) {
    const c = t.c.abs(), numF = [], denF = [];
    if (t.r !== 1) numF.push(tex ? R`\sqrt{` + t.r + '}' : '√' + t.r);
    if (t.pk > 0) numF.push(tex ? (t.pk === 1 ? R`\pi` : R`\pi^{` + t.pk + '}') : 'π' + (t.pk === 1 ? '' : sup(t.pk)));
    if (t.pk < 0) denF.push(tex ? (t.pk === -1 ? R`\pi` : R`\pi^{` + (-t.pk) + '}') : 'π' + (t.pk === -1 ? '' : sup(-t.pk)));
    if (!t.ep.isZero()) numF.push(tex ? eTex(t.ep) : 'e^(' + t.ep.toString() + ')');
    const cnt = {}, order = [];
    t.s.forEach((k) => { if (!cnt[k]) { cnt[k] = 0; order.push(k); } cnt[k]++; });
    order.forEach((k) => {
      const s = tex ? k : SYMTXT[k];
      numF.push(cnt[k] === 1 ? s : (tex ? R`\left(` + s + R`\right)^{` + cnt[k] + '}' : '(' + s + ')' + sup(cnt[k])));
    });
    if (!numF.length && !denF.length) return tex ? c.tex() : (c.d === 1 ? String(c.n) : c.n + '/' + c.d);
    const nParts = (c.n === 1 && numF.length ? [] : [String(c.n)]).concat(numF);
    const dParts = (c.d === 1 ? [] : [String(c.d)]).concat(denF);
    const joinT = (arr) => (tex ? arr.reduce((s, x, i) => s + (i > 0 ? (/^[0-9]/.test(x) ? R` \cdot ` : ' ') : '') + x, '') : arr.join(''));
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
    return ordered(this.t).map((t, i) => { const ng = t.c.sign() < 0; return (i === 0 ? (ng ? '-' : '') : (ng ? '-' : '+')) + tbody(t, false); }).join('');
  };
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
  V.pow = (x, k) => {
    x = V.of(x);
    k = k instanceof Q ? k : Q(k);
    if (k.isZero()) return V.q(1);
    if (x.isZero() && x.exact()) {
      if (k.sign() > 0) return V.q(0);
      throw new JK.CalcError('0 で割ることはできません');
    }
    if (k.isInt() && Math.abs(k.n) <= 24) {
      let r = V.q(1);
      for (let i = 0; i < Math.abs(k.n); i++) r = r.mul(x);
      return k.n < 0 ? r.inv() : r;
    }
    if (x.single() && !x.t[0].s.length && x.t[0].c.sign() > 0) {
      const t = x.t[0];
      if (plainT(t) && k.d === 2 && Math.abs(k.n) <= 24) {
        let r = V.q(1);
        const s = V.sqrt(t.c);
        for (let i = 0; i < Math.abs(k.n); i++) r = r.mul(s);
        return k.n < 0 ? r.inv() : r;
      }
      if (plainT(t) && k.d <= 24 && Math.abs(k.n) <= 60) {
        const rn = Math.round(Math.pow(t.c.n, 1 / k.d)), rd = Math.round(Math.pow(t.c.d, 1 / k.d));
        if (Math.pow(rn, k.d) === t.c.n && Math.pow(rd, k.d) === t.c.d) return guard(() => V.q(Q(rn, rd).pow(k.n)), () => Math.pow(t.c.val(), k.val()));
        // a^(m/2d) = (√a)^(m/d) の形も試す（例: 4^(1/4) = √2）
        if (k.d % 2 === 0) {
          const h = k.d / 2, sn = Math.round(Math.pow(t.c.n, 1 / h)), sd = Math.round(Math.pow(t.c.d, 1 / h));
          if (Math.pow(sn, h) === t.c.n && Math.pow(sd, h) === t.c.d) return V.pow(V.sqrt(Q(sn, sd)), Q(k.n));
        }
      }
      if (plainT(t)) {
        const base = t.c.isInt() ? t.c.tex() : R`\left(` + t.c.tex() + R`\right)`;
        const kk = k.n === 1 ? R`\sqrt[` + k.d + ']{' + t.c.tex() + '}' : null;
        return V.sym(kk || base + '^{' + k.tex() + '}', Math.pow(t.c.val(), k.val()), (t.c.isInt() ? t.c.toString() : '(' + t.c.toString() + ')') + '^(' + k.toString() + ')');
      }
    }
    const xv = x.val();
    if (xv < 0 && !k.isInt()) return V.num(NaN);
    return V.num(Math.pow(xv, k.val()));
  };
  // 入力された数（3/4, √3, π/6 など）を厳密値に
  function exactOf(x) {
    if (!fin(x)) return V.num(x);
    const q = Q.from(x);
    if (q && q.d <= 10000 && Math.abs(q.val() - x) <= 1e-12 * Math.max(1, Math.abs(x))) return V.q(q);
    const q2 = Q.from(x * x);
    if (q2 && q2.d <= 1000 && q2.n <= 1e6 && Math.abs(q2.val() - x * x) <= 1e-10 * Math.max(1, x * x)) {
      const r = V.sqrt(q2);
      if (r.exact()) return x < 0 ? r.neg() : r;
    }
    const qp = Q.from(x / Math.PI);
    if (qp && qp.d <= 24 && Math.abs(qp.val() * Math.PI - x) <= 1e-10 * Math.max(1, Math.abs(x))) return V.pi(qp);
    return V.num(x);
  }
  function pv(v) {
    if (!v.exact()) return v.ax < 0 ? R`\left(` + num(v.ax) + R`\right)` : num(v.ax);
    if (v.isZero()) return '0';
    return (v.single() && v.t[0].c.sign() > 0) ? v.tex() : R`\left(` + v.tex() + R`\right)`;
  }
  function approxTail(v) { return v.isQ() || !v.exact() ? '' : R` \fallingdotseq ` + num(v.val()); }
  // v^2 の表示（整数・小数以外は括弧）
  function sq2(v) { const s = v.tex(); return (/^[0-9.]+$/.test(s) ? s : R`\left(` + s + R`\right)`) + '^{2}'; }

  /* ================= 複素数（実部・虚部が V） ================= */

  function Cx(re, im) { return { re: V.of(re), im: V.of(im) }; }
  const cadd = (a, b) => Cx(a.re.add(b.re), a.im.add(b.im));
  const csub = (a, b) => Cx(a.re.sub(b.re), a.im.sub(b.im));
  const cmul = (a, b) => Cx(a.re.mul(b.re).sub(a.im.mul(b.im)), a.re.mul(b.im).add(a.im.mul(b.re)));
  const cscale = (a, k) => Cx(a.re.mul(k), a.im.mul(k));
  const cabs2 = (a) => a.re.mul(a.re).add(a.im.mul(a.im));
  function czero(a) { return a.re.isZero() && a.im.isZero(); }
  function cdiv(a, b) {
    const d = cabs2(b);
    if (d.isZero()) throw new JK.CalcError('0 で割ることはできません');
    const n = cmul(a, Cx(b.re, b.im.neg()));
    return Cx(n.re.div(d), n.im.div(d));
  }
  function cabs(a) { const d = cabs2(a); return d.isQ() ? V.sqrt(d.q()) : V.num(Math.sqrt(d.val())); }
  function cx(a) { return a.re.val(); }
  function cy(a) { return a.im.val(); }
  function ctex(z) {
    const reT = z.re.isZero() ? '' : z.re.tex();
    let imT = '', neg = false;
    if (!z.im.isZero()) {
      neg = z.im.sign() < 0;
      const ab = neg ? z.im.neg() : z.im, s = ab.tex();
      imT = s === '1' ? 'i' : ((ab.exact() && !ab.single()) ? R`\left(` + s + R`\right)i` : s + 'i');
    }
    if (!reT && !imT) return '0';
    if (!imT) return reT;
    if (!reT) return (neg ? '-' : '') + imT;
    return reT + (neg ? ' - ' : ' + ') + imT;
  }
  function ctxt(z) {
    const re = z.re.isZero() ? '' : z.re.txt();
    if (z.im.isZero()) return re || '0';
    const neg = z.im.sign() < 0, ab = neg ? z.im.neg() : z.im, s = ab.txt();
    const imT = (s === '1' ? '' : (ab.exact() && !ab.single() ? '(' + s + ')' : s)) + 'i';
    return re ? re + (neg ? '−' : '+') + imT : (neg ? '−' : '') + imT;
  }
  function cparen(z) { const s = ctex(z); return /[+-]/.test(s.replace(/^-/, '')) || s.charAt(0) === '-' ? R`\left(` + s + R`\right)` : s; }

  /* ================= 角 ================= */

  // th = { q: Q（π の何倍か）| null, rad }
  function normTh(th) {
    if (th.q) { let q = th.q.sub(Q(2).mul(Math.floor(th.q.val() / 2))); if (q.cmp(2) >= 0) q = q.sub(2); if (q.sign() < 0) q = q.add(2); return { q: q, rad: q.val() * Math.PI }; }
    let r = th.rad % (2 * Math.PI); if (r < 0) r += 2 * Math.PI;
    return { q: null, rad: r };
  }
  function thDegIn(deg) {
    const q = Q.from(deg);
    if (q && q.d <= 1000 && Math.abs(q.val() - deg) <= 1e-12 * Math.max(1, Math.abs(deg))) return { q: q.div(180), rad: deg * Math.PI / 180 };
    return { q: null, rad: deg * Math.PI / 180 };
  }
  function argOf(z) {
    let rad = Math.atan2(cy(z), cx(z));
    if (rad < 0) rad += 2 * Math.PI;
    const k = rad / Math.PI * 12, kr = Math.round(k);
    if (Math.abs(k - kr) < 1e-9 && z.re.exact() && z.im.exact()) return { q: Q(kr % 24, 12), rad: (kr % 24) * Math.PI / 12 };
    return { q: null, rad: rad };
  }
  function thAdd(a, b, sg) { return (a.q && b.q) ? { q: sg < 0 ? a.q.sub(b.q) : a.q.add(b.q), rad: a.rad + sg * b.rad } : { q: null, rad: a.rad + sg * b.rad }; }
  function thMul(a, n) { return a.q ? { q: a.q.mul(n), rad: a.rad * n } : { q: null, rad: a.rad * n }; }
  function thTex(th) { return th.q ? piQTex(th.q) : num(th.rad); }
  function thTxt(th) { return th.q ? piQTxt(th.q) : plain(th.rad, 3); }
  function thDeg(th) { return (th.q ? th.q.mul(180).tex() : num(th.rad * 180 / Math.PI, 6)) + R`\degree`; }
  function thArg(th) { const s = thTex(th); return s.charAt(0) === '-' ? R`\left(` + s + R`\right)` : ' ' + s; }
  function cosTh(th) { if (th.q) { const v = sinPi(th.q.add(Q(1, 2))); if (v) return v; } return V.num(Math.cos(th.rad)); }
  function sinTh(th) { if (th.q) { const v = sinPi(th.q); if (v) return v; } return V.num(Math.sin(th.rad)); }
  function special(th) { return !!(th.q && sinPi(th.q)); }
  function rT(r) { const s = r.tex(); return s === '1' ? '' : (r.exact() && !r.single() ? R`\left(` + s + R`\right)` : s); }
  function polarTex(r, th) { return rT(r) + R`\left(\cos` + thArg(th) + R` + i\sin` + thArg(th) + R`\right)`; }
  function fromPolar(r, th) { return Cx(r.mul(cosTh(th)), r.mul(sinTh(th))); }
  function polarOf(z) {
    if (czero(z)) throw new JK.CalcError('0 は偏角が定まらないので、極形式で表せません');
    const r2 = cabs2(z), r = cabs(z), th = argOf(z);
    return { r: r, r2: r2, th: th };
  }

  /* ================= 複素数平面の図 ================= */

  function cfig(o) {
    const xs = [0], ys = [0];
    (o.pts || []).forEach((p) => { xs.push(p.x); ys.push(p.y); });
    (o.segs || []).forEach((s) => { xs.push(s.x1, s.x2); ys.push(s.y1, s.y2); });
    (o.circles || []).forEach((c) => { xs.push(c.cx - c.r, c.cx + c.r); ys.push(c.cy - c.r, c.cy + c.r); });
    (o.extra || []).forEach((p) => { xs.push(p[0]); ys.push(p[1]); });
    const fx = xs.filter(fin), fy = ys.filter(fin);
    let x0 = Math.min.apply(null, fx), x1 = Math.max.apply(null, fx), y0 = Math.min.apply(null, fy), y1 = Math.max.apply(null, fy);
    const span = Math.max(x1 - x0, y1 - y0, 1e-6), pad = 0.16 * span + 0.3;
    x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
    const param = (o.circles || []).map((c) => ({ x: (t) => c.cx + c.r * Math.cos(t), y: (t) => c.cy + c.r * Math.sin(t), t: [0, 2 * Math.PI], cls: c.cls || 'dim', dash: c.dash !== false }))
      .concat((o.arcs || []).filter((a) => fin(a.a0) && fin(a.a1) && fin(a.r)).map((a) => ({ x: (t) => a.cx + a.r * Math.cos(t), y: (t) => a.cy + a.r * Math.sin(t), t: [a.a0, a.a1], cls: a.cls || 'c3' })));
    const inR = (p) => fin(p.x) && fin(p.y) && p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1;
    return JK.plot.graph({
      w: 340, h: 300, x: [x0, x1], y: [y0, y1], equal: true, axis: ['実軸', '虚軸'],
      param: param,
      curves: o.curves || [],
      vlines: (o.vlines || []).filter((l) => fin(l.x)),
      points: (o.pts || []).filter(inR),
      segs: (o.segs || []).map((s) => clipSeg(s, x0, x1, y0, y1)).filter(Boolean)
    });
  }
  function arrowO(z, cls, label) { return { x1: 0, y1: 0, x2: cx(z), y2: cy(z), cls: cls || 'c1', arrow: true, label: label }; }
  const PLANE_STEP = {
    t: 'そもそも複素数平面とは — 複素数を点で表す',
    m: [R`z = a + bi \;\Leftrightarrow\; \text{点 } (a,\ b)`, R`|z| = \sqrt{a^{2} + b^{2}},\qquad z = r(\cos\theta + i\sin\theta)`],
    n: R`横軸に実部、縦軸に虚部をとると、複素数 $a + bi$ は平面上の点 $(a,\ b)$ で表せます。この平面を**複素数平面**といい、横軸を**実軸**、縦軸を**虚軸**とよびます。原点からの距離 $|z|$ を**絶対値**、実軸の正の向きから測った回転角 $\theta$ を**偏角**といいます。`,
    easy: R`実数は数直線（1 本の線）の上の点で表せました。複素数 $a + bi$ は「実部 $a$」と「虚部 $b$」の 2 つの数の組なので、座標平面の点 $(a,\ b)$ に対応させます。すると「原点からの距離」と「向き（角度）」で複素数を表すこともでき、これが**極形式**です。掛け算や累乗は、この「距離と角度」で考えると見通しがよくなります。`,
    lv: 3
  };

  /* ================= 1. 極形式 ================= */

  JK.registerCalc({
    id: 'iiic-polar',
    course: 'IIIC',
    unit: 'm-cplane',
    group: '複素数平面',
    title: '極形式（絶対値と偏角）',
    desc: R`複素数 $z = a + bi$ の絶対値 $r = |z|$ と偏角 $\theta$（$0 \le \theta < 2\pi$）を求め、極形式 $z = r(\cos\theta + i\sin\theta)$ で表します。偏角が $15\degree$ の倍数のときは厳密値で示します。`,
    form: [R`r = |z| = \sqrt{a^{2} + b^{2}}`, R`z = r(\cos\theta + i\sin\theta),\quad \cos\theta = \frac{a}{r},\ \sin\theta = \frac{b}{r}`],
    inputs: [
      { key: 'a', label: '実部 $a$', type: 'num', def: '1', hint: '√3、1/2、-√2 なども入力できます' },
      { key: 'b', label: '虚部 $b$', type: 'num', def: '√3' }
    ],
    examples: [
      { label: '1 + i', v: { a: '1', b: '1' } },
      { label: '−√3 + i', v: { a: '-√3', b: '1' } },
      { label: '−2i', v: { a: '0', b: '-2' } },
      { label: '3 + 4i（特殊角でない）', v: { a: '3', b: '4' } }
    ],
    intro: {
      easy: R`複素数 $a + bi$ を、平面上の点 $(a,\ b)$ として表したものが**複素数平面**です。点の位置は「原点からの距離 $r$」と「実軸の正の向きから反時計回りに測った角 $\theta$」でも表せます。$r$ を**絶対値**、$\theta$ を**偏角**といい、$z = r(\cos\theta + i\sin\theta)$ と書いた形を**極形式**といいます。三角比で学んだ「単位円上の点は $(\cos\theta,\ \sin\theta)$」を $r$ 倍に拡大したものと考えると分かりやすくなります。`,
      normal: R`$r = \sqrt{a^{2} + b^{2}}$、$\cos\theta = \frac{a}{r}$、$\sin\theta = \frac{b}{r}$ から偏角を決めます。`,
      pro: R`偏角は $2\pi$ の整数倍を除いて定まります。$\cos\theta$ と $\sin\theta$ の両方の符号で象限を確認し、$\tan\theta$ だけで決めないこと。`
    },
    compute(v) {
      if (Math.abs(v.a) > 1e6 || Math.abs(v.b) > 1e6) throw new JK.CalcError('実部・虚部は絶対値 10⁶ 以下で入力してください');
      const z = Cx(exactOf(v.a), exactOf(v.b));
      const pz = polarOf(z), r = pz.r, th = pz.th;
      const cs = z.re.div(r), sn = z.im.div(r), sp = special(th);
      const steps = [
        PLANE_STEP,
        {
          t: R`絶対値 $r = |z|$`,
          m: [R`r = |z| = \sqrt{a^{2} + b^{2}}`, R`= \sqrt{` + sq2(z.re) + ' + ' + sq2(z.im) + R`} = \sqrt{` + pz.r2.tex() + '}' + (pz.r2.isQ() && r.isQ() ? ' = ' + r.tex() : (r.exact() ? ' = ' + r.tex() : R` \fallingdotseq ` + num(r.val())))],
          n: R`原点 O と点 $(` + z.re.tex() + R`,\ ` + z.im.tex() + R`)$ の距離です。`,
          easy: R`実部 $|a|$ と虚部 $|b|$ を 2 辺とする直角三角形の斜辺の長さなので、三平方の定理 $r^{2} = a^{2} + b^{2}$ で求めます。`
        },
        {
          t: R`偏角 $\theta$`,
          m: [R`\cos\theta = \frac{a}{r} = ` + cs.tex(), R`\sin\theta = \frac{b}{r} = ` + sn.tex(), R`\theta = ` + thTex(th) + R`\quad (` + thDeg(th) + ')'],
          n: sp ? R`$0 \le \theta < 2\pi$ の範囲で、$\cos\theta$ と $\sin\theta$ がともにこの値になる角は $\theta = ` + thTex(th) + R`$ です。` : R`特別な角ではないので、近似値で表します（$\tan\theta = \frac{b}{a}$ と象限から決まります）。`,
          easy: R`偏角は「実軸の正の向きから反時計回りに何度回った向きか」です。半径 1 の円（単位円）で $x$ 座標が $\cos\theta$、$y$ 座標が $\sin\theta$ になる角を探すのと同じです。$\cos\theta$ と $\sin\theta$ の符号から、点がどの象限にあるかも確かめましょう。`
        },
        {
          t: '極形式で表す',
          m: R`z = ` + polarTex(r, th),
          n: R`絶対値 $r = ` + r.tex() + R`$、偏角 $\theta = ` + thTex(th) + R`$ を $z = r(\cos\theta + i\sin\theta)$ に入れます。`,
          easy: R`「原点から距離 $` + r.tex() + R`$、向き $` + thDeg(th) + R`$」という表し方です。`,
          pro: R`偏角は $\arg z = ` + thTex(th) + R` + 2n\pi$（$n$ は整数）。範囲指定（$0 \le \theta < 2\pi$ か $-\pi < \theta \le \pi$ か）に注意します。`
        },
        {
          t: '確かめ',
          m: [R`r\cos\theta = ` + r.mul(cosTh(th)).tex() + R`,\qquad r\sin\theta = ` + r.mul(sinTh(th)).tex()],
          n: R`実部・虚部に戻ることを確かめました。`,
          lv: 2
        }
      ];
      const R0 = r.val(), t0 = th.rad;
      return {
        result: [
          { label: '絶対値 |z|', tex: R`|z| = ` + r.tex() + approxTail(r) },
          { label: '偏角 arg z', tex: R`\theta = ` + thTex(th) + R`\ (` + thDeg(th) + ')' },
          { label: '極形式', tex: 'z = ' + polarTex(r, th) }
        ],
        steps: steps,
        fig: cfig({
          pts: [{ x: cx(z), y: cy(z), label: 'z = ' + ctxt(z), cls: 'c3', pos: cy(z) >= 0 ? 'tr' : 'br' }],
          segs: [arrowO(z, 'c1'), { x1: cx(z), y1: 0, x2: cx(z), y2: cy(z), cls: 'dim', dash: true }, { x1: 0, y1: cy(z), x2: cx(z), y2: cy(z), cls: 'dim', dash: true }],
          arcs: [{ cx: 0, cy: 0, r: 0.3 * R0, a0: 0, a1: t0, cls: 'c3' }],
          circles: [{ cx: 0, cy: 0, r: R0, cls: 'dim' }]
        })
      };
    }
  });

  /* ================= 2. 極形式の積・商 ================= */

  JK.registerCalc({
    id: 'iiic-mul-div',
    course: 'IIIC',
    unit: 'm-cplane',
    group: '複素数平面',
    title: '極形式の積・商（回転と拡大）',
    desc: R`$z_{1} = r_{1}(\cos\theta_{1} + i\sin\theta_{1})$、$z_{2} = r_{2}(\cos\theta_{2} + i\sin\theta_{2})$ の積と商を、「絶対値は掛ける（割る）・偏角は足す（引く）」で求めます。偏角は度で入力します。`,
    form: [R`z_{1}z_{2} = r_{1}r_{2}\left\{\cos(\theta_{1} + \theta_{2}) + i\sin(\theta_{1} + \theta_{2})\right\}`, R`\frac{z_{1}}{z_{2}} = \frac{r_{1}}{r_{2}}\left\{\cos(\theta_{1} - \theta_{2}) + i\sin(\theta_{1} - \theta_{2})\right\}`],
    inputs: [
      { key: 'op', label: '計算', type: 'select', def: 'mul', options: [['mul', '積 z₁z₂'], ['div', '商 z₁ / z₂']] },
      { key: 'r1', label: '$z_{1}$ の絶対値 $r_{1}$', type: 'num', def: '2' },
      { key: 't1', label: R`$z_{1}$ の偏角 $\theta_{1}$（度）`, type: 'num', def: '30' },
      { key: 'r2', label: '$z_{2}$ の絶対値 $r_{2}$', type: 'num', def: '√2', hint: '√2 なども入力できます' },
      { key: 't2', label: R`$z_{2}$ の偏角 $\theta_{2}$（度）`, type: 'num', def: '45' }
    ],
    examples: [
      { label: 'i を掛ける（90° 回転）', v: { op: 'mul', r1: '3', t1: '30', r2: '1', t2: '90' } },
      { label: '商', v: { op: 'div', r1: '4', t1: '150', r2: '2', t2: '60' } },
      { label: '120° + 120°', v: { op: 'mul', r1: '2', t1: '120', r2: '2', t2: '120' } },
      { label: '特殊角でない', v: { op: 'mul', r1: '1.5', t1: '20', r2: '2', t2: '50' } }
    ],
    intro: {
      easy: R`複素数どうしの掛け算は、複素数平面で見ると「**拡大**と**回転**」になります。たとえば $i$ を掛けると、点は原点のまわりに $90\degree$ 回ります（$1 \to i \to -1 \to -i \to 1$）。一般に、絶対値 $r_{2}$・偏角 $\theta_{2}$ の数を掛けると、「$r_{2}$ 倍に拡大して $\theta_{2}$ だけ回転」します。だから極形式で書いておけば、**絶対値は掛け算、偏角は足し算**で計算できます。割り算はその逆で、絶対値は割り算、偏角は引き算です。`,
      normal: R`絶対値は $|z_{1}z_{2}| = |z_{1}||z_{2}|$、偏角は $\arg z_{1}z_{2} = \arg z_{1} + \arg z_{2}$。商は $\left|\frac{z_{1}}{z_{2}}\right| = \frac{|z_{1}|}{|z_{2}|}$、$\arg\frac{z_{1}}{z_{2}} = \arg z_{1} - \arg z_{2}$ です。`,
      pro: R`「$\alpha$ に $\cos\theta + i\sin\theta$ を掛ける ＝ 原点のまわりに $\theta$ 回転」は、図形問題（正三角形の頂点、回転移動）で頻出です。`
    },
    compute(v) {
      const isMul = v.op !== 'div';
      if (!(v.r1 > 0) || !(v.r2 > 0)) throw new JK.CalcError('絶対値 r₁, r₂ は正の数で入力してください');
      if (v.r1 > 1e6 || v.r2 > 1e6 || Math.abs(v.t1) > 3600 || Math.abs(v.t2) > 3600) throw new JK.CalcError('絶対値は 10⁶ 以下、偏角は -3600°〜3600° の範囲で入力してください');
      const r1 = exactOf(v.r1), r2 = exactOf(v.r2), th1 = thDegIn(v.t1), th2 = thDegIn(v.t2);
      const r = isMul ? r1.mul(r2) : r1.div(r2);
      const raw = thAdd(th1, th2, isMul ? 1 : -1), th = normTh(raw);
      const z1 = fromPolar(r1, th1), z2 = fromPolar(r2, th2), w = fromPolar(r, th);
      const sp = special(th);
      const opT = isMul ? R`z_{1}z_{2}` : R`\frac{z_{1}}{z_{2}}`;
      const steps = [
        {
          t: '掛け算は「回転」と「拡大」',
          m: [R`i = \cos\frac{\pi}{2} + i\sin\frac{\pi}{2}`, R`1 \;\to\; i \;\to\; i^{2} = -1 \;\to\; i^{3} = -i \;\to\; i^{4} = 1`],
          n: R`$i$ を掛けるたびに、点は原点のまわりに $90\degree$ ずつ回ります。$i$ は絶対値 1・偏角 $\frac{\pi}{2}$ の数だからです。`,
          easy: R`絶対値 $r$・偏角 $\theta$ の数を掛けると、「原点からの距離が $r$ 倍」になり「向きが $\theta$ だけ回る」。だから極形式どうしの掛け算は、**絶対値を掛けて、偏角を足す**だけで済みます。割り算はその逆で、**絶対値を割って、偏角を引きます**。`,
          lv: 3
        },
        {
          t: '加法定理で確かめる',
          m: isMul
            ? [R`(\cos\alpha + i\sin\alpha)(\cos\beta + i\sin\beta)`, R`= (\cos\alpha\cos\beta - \sin\alpha\sin\beta) + i(\sin\alpha\cos\beta + \cos\alpha\sin\beta)`, R`= \cos(\alpha + \beta) + i\sin(\alpha + \beta)`]
            : [R`\frac{1}{\cos\beta + i\sin\beta} = \frac{\cos\beta - i\sin\beta}{\cos^{2}\beta + \sin^{2}\beta} = \cos(-\beta) + i\sin(-\beta)`, R`\frac{\cos\alpha + i\sin\alpha}{\cos\beta + i\sin\beta} = \cos(\alpha - \beta) + i\sin(\alpha - \beta)`],
          n: isMul ? R`展開して $i^{2} = -1$ を使い、三角関数の加法定理でまとめると、偏角が足し算になることが分かります。` : R`分母の共役複素数を掛けて分母を実数にすると、偏角が引き算になることが分かります。`,
          easy: R`展開した式の実部・虚部が、ちょうど $\cos$ と $\sin$ の加法定理の形になっているのがポイントです。`,
          lv: 2
        },
        {
          t: isMul ? '絶対値を掛ける' : '絶対値を割る',
          m: R`r = ` + (isMul ? R`r_{1}r_{2} = ` + pv(r1) + R` \times ` + pv(r2) : R`\frac{r_{1}}{r_{2}} = \frac{` + r1.tex() + '}{' + r2.tex() + '}') + ' = ' + r.tex() + approxTail(r),
          n: isMul ? R`拡大率どうしは掛け算になります。` : R`拡大率は割り算になります。`,
          easy: isMul ? R`「$r_{1}$ 倍してから $r_{2}$ 倍」すると、全体で $r_{1}r_{2}$ 倍です。` : R`$z_{2}$ を掛けると $r_{2}$ 倍されるので、割ると $\frac{1}{r_{2}}$ 倍です。`
        },
        {
          t: isMul ? '偏角を足す' : '偏角を引く',
          m: [R`\theta = \theta_{1} ` + (isMul ? '+' : '-') + R` \theta_{2} = ` + thTex(th1) + (isMul ? ' + ' : ' - ') + (thTex(th2).charAt(0) === '-' ? R`\left(` + thTex(th2) + R`\right)` : thTex(th2)) + ' = ' + thTex(raw)].concat(raw.q && th.q && raw.q.eq(th.q) ? [] : [R`\theta = ` + thTex(th) + R`\quad (0 \le \theta < 2\pi \text{ に直す})`]),
          n: R`度でいうと $` + thDeg(th) + R`$ です。`,
          easy: isMul ? R`「$\theta_{1}$ 回転してから $\theta_{2}$ 回転」すると、全体で $\theta_{1} + \theta_{2}$ の回転です。$2\pi$（$360\degree$）回ると元の向きに戻るので、$2\pi$ の倍数を引いて整理します。` : R`割り算は掛け算の逆なので、回転も逆向き（引き算）になります。`
        },
        {
          t: '結果（極形式）',
          m: opT + ' = ' + polarTex(r, th),
          n: R`絶対値 $` + r.tex() + R`$、偏角 $` + thTex(th) + R`$ の複素数です。`,
          pro: R`「$z$ に $\cos\theta + i\sin\theta$ を掛ける」は原点のまわりの $\theta$ 回転、「$r$ を掛ける」は $r$ 倍の拡大。点 $\alpha$ のまわりの回転は $\alpha + (\cos\theta + i\sin\theta)(z - \alpha)$ です。`
        },
        {
          t: R`$a + bi$ の形に直す`,
          m: [opT + ' = ' + rT(r) + R`\left(` + cosTh(th).tex() + (sinTh(th).sign() < 0 ? ' - ' + (sinTh(th).neg().tex() === '1' ? '' : (sinTh(th).neg().single() ? sinTh(th).neg().tex() : R`\left(` + sinTh(th).neg().tex() + R`\right)`)) : ' + ' + (sinTh(th).tex() === '1' ? '' : (sinTh(th).single() || !sinTh(th).exact() ? sinTh(th).tex() : R`\left(` + sinTh(th).tex() + R`\right)`))) + R`i\right)`, '= ' + ctex(w)],
          n: sp ? R`$\cos` + thArg(th) + R`,\ \sin` + thArg(th) + R`$ の値を代入して展開しました。` : R`偏角が $15\degree$ の倍数ではないので、近似値で表しました。`,
          lv: 2
        }
      ];
      return {
        result: [
          { label: '極形式', tex: opT + ' = ' + polarTex(r, th) },
          { label: 'a + bi の形', tex: opT + ' = ' + ctex(w) },
          { label: '絶対値・偏角', tex: R`r = ` + r.tex() + R`,\ \ \theta = ` + thTex(th) + R`\ (` + thDeg(th) + ')' }
        ],
        steps: steps,
        fig: cfig({
          pts: [{ x: cx(z1), y: cy(z1), label: 'z₁', cls: 'c1' }, { x: cx(z2), y: cy(z2), label: 'z₂', cls: 'c4' }, { x: cx(w), y: cy(w), label: isMul ? 'z₁z₂' : 'z₁/z₂', cls: 'c3' }],
          segs: [arrowO(z1, 'c1'), arrowO(z2, 'c4'), arrowO(w, 'c3')],
          arcs: [{ cx: 0, cy: 0, r: 0.25 * r1.val(), a0: 0, a1: th1.rad, cls: 'c1' }, { cx: 0, cy: 0, r: 0.35 * Math.max(r.val(), 0.2), a0: 0, a1: th.rad, cls: 'c3' }]
        })
      };
    }
  });

  /* ================= 3. ド・モアブルの定理 ================= */

  JK.registerCalc({
    id: 'iiic-demoivre',
    course: 'IIIC',
    unit: 'm-cplane',
    group: '複素数平面',
    title: 'ド・モアブルの定理（zⁿ）',
    desc: R`$z = a + bi$ を極形式に直し、ド・モアブルの定理 $(\cos\theta + i\sin\theta)^{n} = \cos n\theta + i\sin n\theta$ で $z^{n}$（$n$ は $-12$〜$12$ の整数）を計算します。点 $z,\ z^{2},\ \ldots$ の並び方も図示します。`,
    form: R`z^{n} = r^{n}(\cos n\theta + i\sin n\theta)`,
    inputs: [
      { key: 'a', label: '実部 $a$', type: 'num', def: '1', hint: '√3 なども入力できます' },
      { key: 'b', label: '虚部 $b$', type: 'num', def: '1' },
      { key: 'n', label: '指数 $n$', type: 'int', def: '6', min: -12, max: 12 }
    ],
    examples: [
      { label: '(1 + √3 i)⁶', v: { a: '1', b: '√3', n: '6' } },
      { label: 'iⁿ（n = 4）', v: { a: '0', b: '1', n: '4' } },
      { label: '負の指数 (√3 − i)⁻³', v: { a: '√3', b: '-1', n: '-3' } },
      { label: '特殊角でない (1 + 2i)⁵', v: { a: '1', b: '2', n: '5' } }
    ],
    intro: {
      easy: R`$z$ を何回も掛ける $z^{n}$ を、展開して計算するのは大変です。極形式で考えると、$z$ を 1 回掛けるごとに「絶対値が $r$ 倍・偏角が $\theta$ だけ回転」するので、$n$ 回掛けると「絶対値 $r^{n}$・偏角 $n\theta$」になります。これが**ド・モアブルの定理**で、点 $z,\ z^{2},\ z^{3},\ \ldots$ は原点のまわりを一定の角度ずつ回りながら並びます（$r = 1$ なら円周上、$r > 1$ なら外側へ広がる渦巻き）。`,
      normal: R`$z = r(\cos\theta + i\sin\theta)$ のとき $z^{n} = r^{n}(\cos n\theta + i\sin n\theta)$。$n$ が負の整数でも成り立ちます。`,
      pro: R`$z^{n} = 1$ となる最小の $n$、$z^{n}$ が実数・純虚数となる条件などは、偏角 $n\theta$ が $\pi$ や $\frac{\pi}{2}$ の整数倍になる条件として処理します。`
    },
    compute(v) {
      const n = v.n;
      if (Math.abs(v.a) > 100 || Math.abs(v.b) > 100) throw new JK.CalcError('実部・虚部は -100〜100 の範囲で入力してください');
      const z = Cx(exactOf(v.a), exactOf(v.b));
      const pz = polarOf(z), r = pz.r, th = pz.th;
      const rn = V.pow(r, Q(n));
      const rawN = thMul(th, n), thn = normTh(rawN);
      const w = fromPolar(rn, thn);
      if (!fin(rn.val())) throw new JK.CalcError('値が大きすぎて計算できません');
      const steps = [
        Object.assign({}, PLANE_STEP, { t: 'そもそもド・モアブルの定理とは — 掛けるたびに同じ角だけ回る', m: [R`(\cos\theta + i\sin\theta)^{n} = \cos n\theta + i\sin n\theta`], easy: R`極形式の掛け算では「偏角は足し算」でした。同じ $z$ を $n$ 回掛ければ、偏角 $\theta$ を $n$ 回足すので $n\theta$、絶対値は $r$ を $n$ 回掛けるので $r^{n}$ です。$n$ が負のときは「逆向きに回して縮める」と考えます（$z^{-1} = \frac{1}{z}$ は偏角が $-\theta$）。` }),
        {
          t: '極形式に直す',
          m: [R`r = |z| = \sqrt{` + sq2(z.re) + ' + ' + sq2(z.im) + '} = ' + r.tex(), R`\theta = ` + thTex(th) + R`\quad (` + thDeg(th) + ')', R`z = ` + polarTex(r, th)],
          n: R`絶対値と偏角を求めて極形式にします。`,
          easy: R`絶対値は原点からの距離（三平方の定理）、偏角は実軸の正の向きから測った角です。`
        },
        {
          t: 'ド・モアブルの定理を使う',
          m: [R`z^{` + n + R`} = ` + (r.tex() === '1' ? '' : pv(r) + '^{' + n + '}') + R`\left\{\cos\left(` + n + R` \times ` + thTex(th) + R`\right) + i\sin\left(` + n + R` \times ` + thTex(th) + R`\right)\right\}`, R`= ` + polarTex(rn, rawN)],
          n: R`絶対値は $r^{n} = ` + rn.tex() + R`$、偏角は $n\theta = ` + thTex(rawN) + R`$ です。`,
          easy: R`$z$ を ` + Math.abs(n) + R` 回掛ける（$n < 0$ なら割る）計算が、絶対値の累乗と偏角の掛け算だけで済みます。`,
          pro: R`$r^{n}$ と $n\theta$ を別々に計算し、$n\theta$ は $2\pi$ の倍数を引いて $0 \le n\theta < 2\pi$ に直してから値を求めると、ミスが減ります。`
        },
        {
          t: '偏角を整理して値を求める',
          m: [R`n\theta = ` + thTex(rawN) + (rawN.q && thn.q && rawN.q.eq(thn.q) ? '' : R` \;\to\; ` + thTex(thn) + R`\ (2\pi \text{ の倍数を除く})`), R`z^{` + n + R`} = ` + polarTex(rn, thn), '= ' + ctex(w)],
          n: special(thn) ? R`$\cos$ と $\sin$ の値を代入して $a + bi$ の形にしました。` : R`偏角が $15\degree$ の倍数でないので、近似値で表しました。`,
          easy: R`$2\pi$（$360\degree$）回ると元の向きに戻るので、偏角から $2\pi$ の倍数を引いても同じ点を表します。`
        },
        {
          t: '点の並び方',
          n: R`図は $k = 0,\ 1,\ \ldots,\ ` + n + R`$ について点 $z^{k}$ を順に結んだものです。` + (Math.abs(r.val() - 1) < 1e-12 ? R`$|z| = 1$ なので、すべての点は単位円の上にあり、角 $` + thTex(th) + R`$ ずつ回っています。` : (r.val() > 1 ? R`$|z| > 1$ なので、回りながら原点から遠ざかる渦巻きになります。` : R`$|z| < 1$ なので、回りながら原点に近づく渦巻きになります。`)),
          easy: R`掛けるたびに「同じ角だけ回る」「同じ倍率で伸び縮みする」ことを、点の動きで確かめてください。`,
          lv: 2
        }
      ];
      // 図: z^k の点列
      const pts = [], segs = [], N = Math.abs(n), sg = n < 0 ? -1 : 1;
      let prev = null;
      for (let k = 0; k <= N; k++) {
        const rk = Math.pow(r.val(), sg * k), tk = th.rad * sg * k;
        const p = { x: rk * Math.cos(tk), y: rk * Math.sin(tk) };
        if (!fin(p.x) || !fin(p.y)) continue;
        pts.push({ x: p.x, y: p.y, label: k === 0 ? '1' : (k === N || k === 1 ? 'z' + sup(sg * k) : ''), cls: k === N ? 'c3' : 'c1', pos: 'tr' });
        if (prev) segs.push({ x1: prev.x, y1: prev.y, x2: p.x, y2: p.y, cls: 'c2', dash: true });
        prev = p;
      }
      return {
        result: [
          { label: '極形式', tex: R`z^{` + n + R`} = ` + polarTex(rn, thn) },
          { label: 'a + bi の形', tex: R`z^{` + n + R`} = ` + ctex(w) },
          { label: '絶対値・偏角', tex: R`|z^{` + n + R`}| = ` + rn.tex() + R`,\ \ \arg z^{` + n + R`} = ` + thTex(thn) }
        ],
        steps: steps,
        fig: cfig({ pts: pts, segs: segs, circles: [{ cx: 0, cy: 0, r: 1, cls: 'dim' }] })
      };
    }
  });

  /* ================= 4. n 乗根 ================= */

  JK.registerCalc({
    id: 'iiic-roots',
    course: 'IIIC',
    unit: 'm-cplane',
    group: '複素数平面',
    title: 'n 乗根（zⁿ = α の解）',
    desc: R`方程式 $z^{n} = \alpha$（$n = 2$〜$12$）の解を、極形式とド・モアブルの定理で求めます。解は原点を中心とする円に内接する正 $n$ 角形の頂点に並びます。`,
    form: [R`z = r(\cos\theta + i\sin\theta),\quad \alpha = R(\cos\phi + i\sin\phi)`, R`r^{n} = R,\quad n\theta = \phi + 2k\pi\ \ (k = 0,\ 1,\ \ldots,\ n-1)`],
    inputs: [
      { key: 'a', label: R`$\alpha$ の実部`, type: 'num', def: '0', hint: '√3 なども入力できます' },
      { key: 'b', label: R`$\alpha$ の虚部`, type: 'num', def: '8' },
      { key: 'n', label: '$n$', type: 'int', def: '3', min: 2, max: 12 }
    ],
    examples: [
      { label: '1 の 3 乗根', v: { a: '1', b: '0', n: '3' } },
      { label: 'z⁴ = −16', v: { a: '-16', b: '0', n: '4' } },
      { label: '1 の 6 乗根', v: { a: '1', b: '0', n: '6' } },
      { label: 'z² = −1 + √3 i', v: { a: '-1', b: '√3', n: '2' } },
      { label: 'z⁵ = 1 + i', v: { a: '1', b: '1', n: '5' } }
    ],
    intro: {
      easy: R`「$n$ 回掛けると $\alpha$ になる数」を $\alpha$ の **$n$ 乗根**といいます。実数の範囲では $x^{3} = 1$ の解は $1$ だけですが、複素数の範囲では解がちょうど $n$ 個あります。極形式で考えると、$z^{n}$ は「絶対値 $r^{n}$・偏角 $n\theta$」なので、$r^{n} = |\alpha|$、$n\theta = \arg\alpha$（$+ 2\pi$ の倍数）を解けばよく、解は円周上に等間隔（正 $n$ 角形の頂点）に並びます。`,
      normal: R`$z^{n} = \alpha$ は、$r = \sqrt[n]{|\alpha|}$、$\theta = \frac{\arg\alpha + 2k\pi}{n}$（$k = 0,\ 1,\ \ldots,\ n-1$）。$2k\pi$ を付け忘れると解が 1 個しか出ません。`,
      pro: R`1 の $n$ 乗根 $\omega$ について $1 + \omega + \omega^{2} + \cdots + \omega^{n-1} = 0$（$\omega \ne 1$）や $\omega^{n} = 1$ を使った式の値の問題が頻出です。`
    },
    compute(v) {
      const n = v.n;
      if (Math.abs(v.a) > 1e6 || Math.abs(v.b) > 1e6) throw new JK.CalcError('α の実部・虚部は絶対値 10⁶ 以下で入力してください');
      const al = Cx(exactOf(v.a), exactOf(v.b));
      if (czero(al)) throw new JK.CalcError('α = 0 のときの解は z = 0 だけです（0 以外の α を入力してください）');
      const pa = polarOf(al), Rr = pa.r, Th = pa.th;
      const rr = pa.r2.isQ() ? V.pow(V.q(pa.r2.q()), Q(1, 2 * n)) : V.num(Math.pow(pa.r2.val(), 1 / (2 * n)));
      const roots = [];
      for (let k = 0; k < n; k++) {
        const th = Th.q ? { q: Th.q.add(Q(2 * k)).div(n), rad: (Th.rad + 2 * k * Math.PI) / n } : { q: null, rad: (Th.rad + 2 * k * Math.PI) / n };
        roots.push({ k: k, th: th, z: fromPolar(rr, th) });
      }
      const thFormula = R`\theta = \frac{` + thTex(Th) + R` + 2k\pi}{` + n + '}';
      const rootLine = (rt) => R`z_{` + rt.k + '} = ' + polarTex(rr, rt.th) + ' = ' + ctex(rt.z);
      const steps = [
        Object.assign({}, PLANE_STEP, { t: 'そもそも n 乗根とは — 解は円周上に等間隔に並ぶ', m: [R`z^{n} = \alpha\ \text{の解は複素数の範囲でちょうど } n \text{ 個}`], easy: R`$z$ を $n$ 回掛けると「絶対値は $n$ 乗・偏角は $n$ 倍」になります。偏角を $n$ 倍して $\arg\alpha$ と同じ向きになる角は、$360\degree$ の回り方の違いで $n$ 個あり、それらは $\frac{360\degree}{n}$ ずつずれて円周上に並びます。` }),
        {
          t: R`$\alpha$ を極形式で表す`,
          m: [R`|\alpha| = ` + Rr.tex() + R`,\qquad \arg\alpha = ` + thTex(Th), R`\alpha = ` + polarTex(Rr, Th)],
          n: R`$\alpha = ` + ctex(al) + R`$ の絶対値と偏角を求めます。`,
          easy: R`複素数平面で、$\alpha$ が原点からどれだけ離れ、どの向きにあるかを調べる作業です。`
        },
        {
          t: R`$z = r(\cos\theta + i\sin\theta)$ とおいて比べる`,
          m: [R`z^{` + n + R`} = r^{` + n + R`}(\cos ` + n + R`\theta + i\sin ` + n + R`\theta)`, R`r^{` + n + '} = ' + Rr.tex() + R`,\qquad ` + n + R`\theta = ` + thTex(Th) + R` + 2k\pi`],
          n: R`ド・モアブルの定理で $z^{n}$ を計算し、絶対値どうし・偏角どうしを比べます。偏角は $2\pi$ の整数倍の違いを許すので $+ 2k\pi$ を付けます。`,
          easy: R`「$+ 2k\pi$」が大切です。偏角が $2\pi$ 違っても同じ向きなので、$n\theta$ は $\arg\alpha$ そのものだけでなく、$2\pi,\ 4\pi,\ \ldots$ を足したものでもよいのです。これを $n$ で割ると、違う角 $\theta$ が $n$ 個出てきます。`
        },
        {
          t: R`$r$ と $\theta$ を求める`,
          m: [R`r = \sqrt[` + n + ']{' + Rr.tex() + '} = ' + rr.tex() + approxTail(rr), thFormula + R`\quad (k = 0,\ 1,\ \ldots,\ ` + (n - 1) + ')'],
          n: R`$k = 0$〜$` + (n - 1) + R`$ で異なる $n$ 個の角が得られます（$k = ` + n + R`$ 以降は同じ点のくり返し）。`,
          pro: R`解の偏角は $\frac{2\pi}{n}$ ずつ増えるので、1 つ解が分かれば残りは「$\cos\frac{2\pi}{n} + i\sin\frac{2\pi}{n}$ を次々に掛けたもの」です。`
        },
        {
          t: '解を並べる',
          m: roots.map(rootLine),
          n: roots.every((rt) => special(rt.th) && rr.exact()) ? R`すべての解を厳密値で表しました。` : R`偏角が $15\degree$ の倍数でない解は、近似値で表しています。`
        },
        {
          t: '図形的な意味',
          n: R`解は原点を中心とする半径 $` + rr.tex() + R`$ の円周上に、角 $\frac{2\pi}{` + n + R`}$ ずつ等間隔に並び、正 ` + n + R` 角形の頂点になります。`,
          easy: R`図の正多角形の頂点が、$z^{` + n + R`} = \alpha$ の ` + n + ' 個の解です。どの頂点を ' + n + R` 乗しても、同じ $\alpha$ に行き着きます。`,
          lv: 2
        }
      ];
      const rv = rr.val();
      const pts = roots.map((rt) => ({ x: cx(rt.z), y: cy(rt.z), label: 'z' + subS(rt.k), cls: 'c3', pos: cy(rt.z) >= 0 ? 'tr' : 'br' }));
      const segs = roots.map((rt, i) => { const nx = roots[(i + 1) % n].z; return { x1: cx(rt.z), y1: cy(rt.z), x2: cx(nx), y2: cy(nx), cls: 'c2' }; });
      const res = [
        { label: '半径', tex: R`r = ` + rr.tex() + approxTail(rr) },
        { label: '偏角', tex: thFormula + R`\ \ (k = 0,\ \ldots,\ ` + (n - 1) + ')' }
      ];
      roots.slice(0, 3).forEach((rt) => res.push({ label: 'z' + subS(rt.k), tex: R`z_{` + rt.k + '} = ' + ctex(rt.z) }));
      return {
        result: res,
        steps: steps,
        fig: cfig({ pts: pts, segs: segs, circles: [{ cx: 0, cy: 0, r: rv, cls: 'dim' }] })
      };
    }
  });

  /* ================= 5. 点 α のまわりの回転・拡大 ================= */

  JK.registerCalc({
    id: 'iiic-rotate',
    course: 'IIIC',
    unit: 'm-cplane',
    group: '複素数平面',
    title: '点のまわりの回転・拡大',
    desc: R`点 $z$ を点 $\alpha$ のまわりに角 $\theta$ だけ回転し、$\alpha$ からの距離を $k$ 倍した点 $w = \alpha + k(\cos\theta + i\sin\theta)(z - \alpha)$ を求めます。`,
    form: R`w - \alpha = k(\cos\theta + i\sin\theta)(z - \alpha)`,
    inputs: [
      { key: 'zx', label: '$z$ の実部', type: 'num', def: '3' },
      { key: 'zy', label: '$z$ の虚部', type: 'num', def: '1' },
      { key: 'ax', label: R`中心 $\alpha$ の実部`, type: 'num', def: '1' },
      { key: 'ay', label: R`中心 $\alpha$ の虚部`, type: 'num', def: '1' },
      { key: 'deg', label: R`回転角 $\theta$（度）`, type: 'num', def: '90', hint: '反時計回りが正' },
      { key: 'k', label: '拡大率 $k$', type: 'num', def: '1', hint: '回転だけなら 1' }
    ],
    examples: [
      { label: '正三角形の頂点（60°）', v: { zx: '2', zy: '0', ax: '0', ay: '0', deg: '60', k: '1' } },
      { label: '回転＋拡大（45°, √2 倍）', v: { zx: '4', zy: '2', ax: '1', ay: '-1', deg: '45', k: '√2' } },
      { label: '点対称（180°）', v: { zx: '2', zy: '3', ax: '1', ay: '1', deg: '180', k: '1' } },
      { label: '時計回り（−30°）', v: { zx: '√3', zy: '1', ax: '0', ay: '0', deg: '-30', k: '2' } }
    ],
    intro: {
      easy: R`原点のまわりの回転は「$\cos\theta + i\sin\theta$ を掛ける」ことでした。中心が原点でない点 $\alpha$ のときは、(1) 全体を平行移動して $\alpha$ を原点に重ねる（$z - \alpha$）、(2) 原点のまわりに回転・拡大する（掛け算）、(3) 平行移動して元に戻す（$+ \alpha$）、の 3 段階で考えます。`,
      normal: R`$w = \alpha + k(\cos\theta + i\sin\theta)(z - \alpha)$。$\alpha$ を中心に $\theta$ 回転して $k$ 倍に拡大した点です。`,
      pro: R`$\frac{w - \alpha}{z - \alpha} = k(\cos\theta + i\sin\theta)$ の形で「$\triangle$ の形（角と辺の比）」を表すのが図形問題の定石です。正三角形なら $\frac{\gamma - \alpha}{\beta - \alpha} = \cos(\pm\frac{\pi}{3}) + i\sin(\pm\frac{\pi}{3})$。`
    },
    compute(v) {
      ['zx', 'zy', 'ax', 'ay'].forEach((key) => { if (Math.abs(v[key]) > 1e4) throw new JK.CalcError('座標は -10000〜10000 の範囲で入力してください'); });
      if (!(v.k > 0) || v.k > 1e4) throw new JK.CalcError('拡大率 k は正の数（10000 以下）で入力してください');
      if (Math.abs(v.deg) > 3600) throw new JK.CalcError('回転角は -3600°〜3600° の範囲で入力してください');
      const z = Cx(exactOf(v.zx), exactOf(v.zy)), al = Cx(exactOf(v.ax), exactOf(v.ay));
      const k = exactOf(v.k), th = thDegIn(v.deg);
      const d = csub(z, al), c = fromPolar(k, th), cd = cmul(c, d), w = cadd(al, cd);
      const kT = rT(k);
      const steps = [
        {
          t: '回転の考え方 — いったん原点に移して回す',
          m: [R`\text{原点中心の回転:}\ z \;\to\; (\cos\theta + i\sin\theta)z`, R`\text{点 } \alpha \text{ 中心:}\ w = \alpha + (\cos\theta + i\sin\theta)(z - \alpha)`],
          n: R`$\cos\theta + i\sin\theta$ を掛けると原点のまわりに $\theta$ 回転します。中心が $\alpha$ のときは、$\alpha$ を原点に移してから回し、最後に戻します。`,
          easy: R`コンパスの針（回転の中心）を $\alpha$ に刺して、点 $z$ を回すイメージです。掛け算で回せるのは「原点のまわり」だけなので、まず全体をずらして針の位置を原点に合わせ（$z - \alpha$）、回したあとで元の位置にずらし戻します（$+\alpha$）。`,
          lv: 3
        },
        {
          t: R`平行移動して $\alpha$ を原点へ: $z - \alpha$`,
          m: R`z - \alpha = ` + cparen(z) + ' - ' + cparen(al) + ' = ' + ctex(d),
          n: R`点 $z$ を、$\alpha$ を原点とみた位置に直します。`,
          easy: R`$z - \alpha$ は「$\alpha$ から見た $z$ の位置」（$\alpha$ から $z$ へ向かう矢印）を表します。`
        },
        {
          t: '回転・拡大を表す数',
          m: R`c = ` + (kT ? kT : '') + R`\left(\cos` + thArg(th) + R` + i\sin` + thArg(th) + R`\right) = ` + ctex(c),
          n: R`回転角 $` + thDeg(th) + R`$、拡大率 $` + k.tex() + R`$ を表す複素数です。`,
          easy: R`この数を掛けると、原点からの距離が $` + k.tex() + R`$ 倍になり、向きが $` + thDeg(th) + R`$ 回ります。`
        },
        {
          t: R`掛け算: $c(z - \alpha)$`,
          m: R`c(z - \alpha) = ` + cparen(c) + cparen(d) + ' = ' + ctex(cd),
          n: R`展開して $i^{2} = -1$ を使います。`,
          lv: 1
        },
        {
          t: R`元に戻す: $w = \alpha + c(z - \alpha)$`,
          m: R`w = ` + cparen(al) + ' + ' + cparen(cd) + ' = ' + ctex(w),
          n: R`$\alpha$ を足して、平行移動を元に戻します。`,
          easy: R`ずらしておいた分を戻すと、$\alpha$ を中心に回した点 $w$ が得られます。`,
          pro: R`逆に 3 点 $\alpha,\ z,\ w$ が与えられたら、$\frac{w - \alpha}{z - \alpha}$ を計算して極形式にすれば、回転角と拡大率が読み取れます。`
        },
        {
          t: '確かめ',
          m: [R`|w - \alpha| = ` + cabs(cd).tex() + R`,\qquad k|z - \alpha| = ` + k.mul(cabs(d)).tex()],
          n: R`$\alpha$ からの距離が $k$ 倍になっています。`,
          lv: 2
        }
      ];
      const t0 = Math.atan2(cy(d), cx(d)), t1 = t0 + th.rad, rr = 0.3 * Math.max(Math.sqrt(cx(d) * cx(d) + cy(d) * cy(d)), 0.3);
      return {
        result: [
          { label: '回転後の点 w', tex: 'w = ' + ctex(w) },
          { label: '回転・拡大を表す数', tex: R`k(\cos\theta + i\sin\theta) = ` + ctex(c) },
          { label: 'α からの距離', tex: R`|w - \alpha| = ` + cabs(cd).tex() + approxTail(cabs(cd)) }
        ],
        steps: steps,
        fig: cfig({
          pts: [{ x: cx(al), y: cy(al), label: 'α', cls: 'fg', pos: 'bl' }, { x: cx(z), y: cy(z), label: 'z', cls: 'c1' }, { x: cx(w), y: cy(w), label: 'w', cls: 'c3' }],
          segs: [{ x1: cx(al), y1: cy(al), x2: cx(z), y2: cy(z), cls: 'c1', arrow: true }, { x1: cx(al), y1: cy(al), x2: cx(w), y2: cy(w), cls: 'c3', arrow: true }],
          arcs: [{ cx: cx(al), cy: cy(al), r: rr, a0: Math.min(t0, t1), a1: Math.max(t0, t1), cls: 'c2' }]
        })
      };
    }
  });

  /* ================= 6. 図形への応用 ================= */

  JK.registerCalc({
    id: 'iiic-cplane-geometry',
    course: 'IIIC',
    unit: 'm-cplane',
    group: '複素数平面',
    title: '距離・内分点・なす角・共線/垂直',
    desc: R`3 点 $A(\alpha),\ B(\beta),\ C(\gamma)$ について、2 点間の距離 $|\beta - \alpha|$、線分 $AB$ の内分点、重心、$\angle BAC$ と $\frac{\gamma - \alpha}{\beta - \alpha}$ による 3 点が一直線上・垂直の判定を行います。`,
    form: [R`AB = |\beta - \alpha|,\qquad \frac{n\alpha + m\beta}{m + n}`, R`\angle BAC = \arg\frac{\gamma - \alpha}{\beta - \alpha}`],
    inputs: [
      { key: 'a1', label: R`$\alpha$ の実部`, type: 'num', def: '1' },
      { key: 'b1', label: R`$\alpha$ の虚部`, type: 'num', def: '1' },
      { key: 'a2', label: R`$\beta$ の実部`, type: 'num', def: '4' },
      { key: 'b2', label: R`$\beta$ の虚部`, type: 'num', def: '2' },
      { key: 'a3', label: R`$\gamma$ の実部`, type: 'num', def: '0' },
      { key: 'b3', label: R`$\gamma$ の虚部`, type: 'num', def: '4' },
      { key: 'm', label: '内分の比 $m$', type: 'num', def: '2', hint: 'AB を m : n に内分' },
      { key: 'n', label: '内分の比 $n$', type: 'num', def: '1' }
    ],
    examples: [
      { label: '正三角形（60°）', v: { a1: '0', b1: '0', a2: '2', b2: '0', a3: '1', b3: '√3', m: '1', n: '1' } },
      { label: '一直線上', v: { a1: '1', b1: '1', a2: '3', b2: '2', a3: '5', b3: '3', m: '1', n: '2' } },
      { label: '一般の三角形', v: { a1: '-1', b1: '0', a2: '3', b2: '1', a3: '1', b3: '4', m: '3', n: '1' } }
    ],
    intro: {
      easy: R`複素数平面では、点を複素数で表すと「引き算」がベクトル（矢印）の役目をします。$\beta - \alpha$ は点 $A$ から点 $B$ へ向かう矢印で、その長さ $|\beta - \alpha|$ が $AB$ の距離です。さらに、2 本の矢印の割り算 $\frac{\gamma - \alpha}{\beta - \alpha}$ の偏角は、矢印 $AB$ から矢印 $AC$ までの回転角 $\angle BAC$ を表します。割り算の結果が実数なら 3 点は一直線上、純虚数なら $AB \perp AC$ です。`,
      normal: R`$\frac{\gamma - \alpha}{\beta - \alpha}$ が実数 $\Leftrightarrow$ $A,\ B,\ C$ は一直線上、純虚数 $\Leftrightarrow$ $AB \perp AC$。`,
      pro: R`$\frac{\gamma - \alpha}{\beta - \alpha}$ を極形式にすると、偏角が角、絶対値が辺の比 $\frac{AC}{AB}$ を表します。三角形の形状決定（直角二等辺・正三角形）に直結します。`
    },
    compute(v) {
      ['a1', 'b1', 'a2', 'b2', 'a3', 'b3'].forEach((key) => { if (Math.abs(v[key]) > 1e4) throw new JK.CalcError('座標は -10000〜10000 の範囲で入力してください'); });
      if (!(v.m > 0) || !(v.n > 0) || v.m > 1e4 || v.n > 1e4) throw new JK.CalcError('内分の比 m, n は正の数で入力してください');
      const A = Cx(exactOf(v.a1), exactOf(v.b1)), B = Cx(exactOf(v.a2), exactOf(v.b2)), C = Cx(exactOf(v.a3), exactOf(v.b3));
      const m = exactOf(v.m), n = exactOf(v.n);
      const BA = csub(B, A), CA = csub(C, A);
      if (czero(BA)) throw new JK.CalcError('点 A と点 B が同じ点です。異なる点を入力してください');
      if (czero(CA)) throw new JK.CalcError('点 A と点 C が同じ点です。異なる点を入力してください');
      const dAB = cabs(BA);
      const mn = m.add(n);
      const Pt = Cx(n.mul(A.re).add(m.mul(B.re)).div(mn), n.mul(A.im).add(m.mul(B.im)).div(mn));
      const G = Cx(A.re.add(B.re).add(C.re).div(V.q(3)), A.im.add(B.im).add(C.im).div(V.q(3)));
      const wq = cdiv(CA, BA);
      const isReal = wq.im.isZero(), isImag = wq.re.isZero();
      let ang = Math.atan2(cy(wq), cx(wq));
      const k12 = ang / Math.PI * 12, kr = Math.round(k12);
      const angTh = (Math.abs(k12 - kr) < 1e-9 && wq.re.exact() && wq.im.exact()) ? { q: Q(kr, 12), rad: kr * Math.PI / 12 } : { q: null, rad: ang };
      const angAbs = angTh.q ? { q: angTh.q.abs(), rad: Math.abs(angTh.rad) } : { q: null, rad: Math.abs(ang) };
      const judge = isReal ? (cx(wq) > 0 ? '3 点 A, B, C は一直線上（B と C は A から見て同じ側）' : '3 点 A, B, C は一直線上（A は B と C の間）') : (isImag ? 'AB ⊥ AC（∠BAC が直角）' : '一直線上でも垂直でもない');
      const steps = [
        {
          t: '複素数と図形の対応 — 引き算は矢印',
          m: [R`\text{矢印 } A \to B \;:\; \beta - \alpha,\qquad AB = |\beta - \alpha|`, R`\frac{\gamma - \alpha}{\beta - \alpha} = \frac{|\gamma - \alpha|}{|\beta - \alpha|}(\cos\theta + i\sin\theta),\quad \theta = \angle BAC`],
          n: R`$\beta - \alpha$ は点 $A$ から点 $B$ への矢印（ベクトル）を表します。2 本の矢印の商の偏角は、矢印どうしのなす角（回転角）です。`,
          easy: R`点の座標の引き算が「矢印」になるのは、ベクトルの成分の引き算と同じです。割り算 $\frac{\gamma - \alpha}{\beta - \alpha}$ は「矢印 $AB$ を何倍に伸ばし、何度回すと矢印 $AC$ に重なるか」を表す数で、その偏角が $\angle BAC$ です。`,
          lv: 3
        },
        {
          t: '2 点間の距離 AB',
          m: [R`\beta - \alpha = ` + cparen(B) + ' - ' + cparen(A) + ' = ' + ctex(BA), R`AB = |\beta - \alpha| = \sqrt{` + sq2(BA.re) + ' + ' + sq2(BA.im) + '} = ' + dAB.tex() + approxTail(dAB)],
          n: R`絶対値は実部・虚部の 2 乗の和の平方根です。`,
          easy: R`座標平面の 2 点間の距離の公式 $\sqrt{(x_{2} - x_{1})^{2} + (y_{2} - y_{1})^{2}}$ と同じ計算です。`
        },
        {
          t: R`線分 $AB$ を $m : n$ に内分する点 P`,
          m: [R`p = \frac{n\alpha + m\beta}{m + n} = \frac{` + pv(n) + cparen(A) + ' + ' + pv(m) + cparen(B) + '}{' + mn.tex() + '}', '= ' + ctex(Pt)],
          n: R`$m = ` + m.tex() + R`,\ n = ` + n.tex() + R`$ を代入します。`,
          easy: R`内分点の公式は、ベクトルや座標と同じ形です。「遠い方の点に近い方の比を掛ける」（$\alpha$ には $n$、$\beta$ には $m$）と覚えます。`
        },
        {
          t: R`重心 G`,
          m: R`g = \frac{\alpha + \beta + \gamma}{3} = ` + ctex(G),
          n: R`3 点の平均です。`,
          lv: 2
        },
        {
          t: R`$\angle BAC$ を求める`,
          m: [R`\frac{\gamma - \alpha}{\beta - \alpha} = \frac{` + ctex(CA) + '}{' + ctex(BA) + '} = ' + ctex(wq), R`\arg\frac{\gamma - \alpha}{\beta - \alpha} = ` + thTex(angTh) + R`\quad (` + thDeg(angTh) + ')', R`\angle BAC = ` + thTex(angAbs) + R`\quad (` + thDeg(angAbs) + ')'],
          n: R`分母の共役複素数を分子・分母に掛けて計算しました。偏角が正なら $AB$ から $AC$ へ反時計回り、負なら時計回りです。`,
          easy: R`割り算の答えの「向き（偏角）」が、矢印 $AB$ から矢印 $AC$ まで回る角度です。角の大きさだけを考えるときは絶対値をとります。`
        },
        {
          t: '一直線上・垂直の判定',
          m: R`\frac{\gamma - \alpha}{\beta - \alpha} = ` + ctex(wq) + (isReal ? R`\ \text{（実数）}` : (isImag ? R`\ \text{（純虚数）}` : '')),
          n: '判定: **' + judge + '**。' + R`商が実数なら偏角は $0$ か $\pi$ なので 3 点は一直線上、純虚数なら偏角は $\pm\frac{\pi}{2}$ なので垂直です。`,
          easy: R`実数を掛けても矢印の向きは変わらない（または真逆になる）だけなので一直線上、純虚数（$i$ の実数倍）を掛けると $90\degree$ 回るので垂直、と考えると覚えやすいです。`,
          pro: R`「$A,\ B,\ C$ が一直線上 $\Leftrightarrow \frac{\gamma - \alpha}{\beta - \alpha}$ が実数 $\Leftrightarrow \frac{\gamma - \alpha}{\beta - \alpha} = \overline{\left(\frac{\gamma - \alpha}{\beta - \alpha}\right)}$」と共役で条件式を作るのが入試の定石です。`
        }
      ];
      return {
        result: [
          { label: '距離 AB', tex: 'AB = ' + dAB.tex() + approxTail(dAB) },
          { label: '内分点 P', tex: 'p = ' + ctex(Pt) },
          { label: '重心 G', tex: 'g = ' + ctex(G) },
          { label: '∠BAC', tex: R`\angle BAC = ` + thTex(angAbs) + R`\ (` + thDeg(angAbs) + ')' },
          { label: '判定', tex: R`\text{` + judge + '}' }
        ],
        steps: steps,
        fig: cfig({
          pts: [{ x: cx(A), y: cy(A), label: 'A', cls: 'fg', pos: 'bl' }, { x: cx(B), y: cy(B), label: 'B', cls: 'c1' }, { x: cx(C), y: cy(C), label: 'C', cls: 'c4' }, { x: cx(Pt), y: cy(Pt), label: 'P', cls: 'c3', pos: 'br' }, { x: cx(G), y: cy(G), label: 'G', cls: 'c2', pos: 'br' }],
          segs: [{ x1: cx(A), y1: cy(A), x2: cx(B), y2: cy(B), cls: 'c1', arrow: true }, { x1: cx(A), y1: cy(A), x2: cx(C), y2: cy(C), cls: 'c4', arrow: true }, { x1: cx(B), y1: cy(B), x2: cx(C), y2: cy(C), cls: 'dim', dash: true }],
          arcs: [(() => { const t0 = Math.atan2(cy(BA), cx(BA)), t1 = t0 + angTh.rad; return { cx: cx(A), cy: cy(A), r: 0.25 * Math.min(dAB.val(), cabs(CA).val()), a0: Math.min(t0, t1), a1: Math.max(t0, t1), cls: 'c3' }; })()]
        })
      };
    }
  });

  /* ================= 7. 方程式の表す図形 ================= */

  function xyPoly(terms) {   // [{c: Q, v: TeX}]（v = '' は定数項）
    return sumTex(terms.filter((t) => !t.c.isZero()).map((t) => ({ neg: t.c.sign() < 0, body: (t.c.abs().eq(1) && t.v ? '' : t.c.abs().tex()) + t.v })));
  }
  function sqT(v, p) { return p.isZero() ? v + '^{2}' : R`\left(` + v + (p.sign() > 0 ? ' - ' + p.tex() : ' + ' + p.neg().tex()) + R`\right)^{2}`; }
  function qc(a, b) { return Cx(V.q(a), V.q(b)); }

  JK.registerCalc({
    id: 'iiic-locus',
    course: 'IIIC',
    unit: 'm-cplane',
    group: '複素数平面',
    title: '方程式の表す図形（円・垂直二等分線・アポロニウスの円）',
    desc: R`$|z - \alpha| = r$（円）、$|z - \alpha| = |z - \beta|$（垂直二等分線）、$|z - \alpha| = k|z - \beta|$（アポロニウスの円）を満たす点 $z$ 全体の図形を、$z = x + yi$ とおいて式を整理し求めます。`,
    form: [R`|z - \alpha| = r`, R`|z - \alpha| = |z - \beta|`, R`|z - \alpha| = k|z - \beta|\ \ (k > 0,\ k \ne 1)`],
    inputs: [
      { key: 'type', label: '方程式', type: 'select', def: 'apollonius', options: [['circle', '|z − α| = r（円）'], ['bisector', '|z − α| = |z − β|（垂直二等分線）'], ['apollonius', '|z − α| = k|z − β|（アポロニウスの円）']] },
      { key: 'a1', label: R`$\alpha$ の実部`, type: 'q', def: '0' },
      { key: 'b1', label: R`$\alpha$ の虚部`, type: 'q', def: '0' },
      { key: 'a2', label: R`$\beta$ の実部`, type: 'q', def: '3', show: (r) => r.type !== 'circle' },
      { key: 'b2', label: R`$\beta$ の虚部`, type: 'q', def: '0', show: (r) => r.type !== 'circle' },
      { key: 'r', label: '半径 $r$', type: 'num', def: '2', show: (r) => r.type === 'circle' },
      { key: 'k', label: '比 $k$', type: 'q', def: '2', show: (r) => r.type === 'apollonius' }
    ],
    examples: [
      { label: '円 |z − (1 − 2i)| = 3', v: { type: 'circle', a1: '1', b1: '-2', r: '3' } },
      { label: '垂直二等分線', v: { type: 'bisector', a1: '0', b1: '0', a2: '2', b2: '4' } },
      { label: 'アポロニウス k = 3', v: { type: 'apollonius', a1: '-1', b1: '0', a2: '1', b2: '0', k: '3' } },
      { label: 'アポロニウス k = 1/2', v: { type: 'apollonius', a1: '0', b1: '1', a2: '0', b2: '-2', k: '1/2' } }
    ],
    intro: {
      easy: R`$|z - \alpha|$ は「点 $z$ と点 $\alpha$ の距離」を表します。だから $|z - \alpha| = r$ は「$\alpha$ からの距離が $r$ の点の集まり」＝円、$|z - \alpha| = |z - \beta|$ は「$\alpha$ と $\beta$ から等しい距離にある点の集まり」＝線分 $\alpha\beta$ の垂直二等分線です。$|z - \alpha| = k|z - \beta|$（距離の比が $k : 1$）は、$k \ne 1$ のとき円になり、**アポロニウスの円**とよばれます。式で確かめるには $z = x + yi$ とおいて、両辺を 2 乗して整理します。`,
      normal: R`$z = x + yi$ とおき、$|w|^{2} = (\text{実部})^{2} + (\text{虚部})^{2}$ で両辺を 2 乗して、$x,\ y$ の方程式に直します。`,
      pro: R`$|z - \alpha|^{2} = (z - \alpha)\overline{(z - \alpha)}$ を使えば $x,\ y$ に分けずに $|z - c|^{2} = \rho^{2}$ の形へ変形できます。アポロニウスの円は、線分 $\alpha\beta$ を $k : 1$ に内分・外分する 2 点を直径の両端とする円です。`
    },
    compute(v) {
      const a1 = v.a1, b1 = v.b1, al = qc(a1, b1);
      [a1, b1].forEach((q) => { if (Math.abs(q.val()) > 1e4) throw new JK.CalcError('座標は -10000〜10000 の範囲で入力してください'); });
      const dist = R`|z - \alpha| = \sqrt{(x - a)^{2} + (y - b)^{2}}`;
      const step0 = {
        t: R`$|z - \alpha|$ は 2 点間の距離`,
        m: [R`z = x + yi,\ \alpha = a + bi \;\Rightarrow\; z - \alpha = (x - a) + (y - b)i`, dist],
        n: R`複素数の差の絶対値は、複素数平面上の 2 点間の距離です。`,
        easy: R`点 $z$ が動くとき、条件「距離が〜」を満たす点をすべて集めると図形ができます。どんな図形になるかを、$z = x + yi$ とおいて $x,\ y$ の式に直して調べます（座標平面の「軌跡」と同じ考え方です）。`,
        lv: 3
      };
      if (v.type === 'circle') {
        const r = v.r;
        if (!(r > 0) || r > 1e4) throw new JK.CalcError('半径 r は正の数（10000 以下）で入力してください');
        const rv = exactOf(r), r2 = rv.mul(rv);
        const eq = sqT('x', a1) + ' + ' + sqT('y', b1) + ' = ' + r2.tex();
        return {
          result: [
            { label: '図形', tex: R`\text{中心 } ` + ctex(al) + R`,\ \text{半径 } ` + rv.tex() + R`\ \text{の円}` },
            { label: 'x, y の方程式', tex: eq }
          ],
          steps: [step0,
            {
              t: R`$z = x + yi$ とおいて式に直す`,
              m: [R`|z - (` + ctex(al) + R`)| = ` + rv.tex(), R`\sqrt{` + sqT('x', a1) + ' + ' + sqT('y', b1) + '} = ' + rv.tex(), eq],
              n: R`両辺は 0 以上なので、2 乗しても同値です。`,
              easy: R`根号を外すために両辺を 2 乗しました。円の方程式 $(x - a)^{2} + (y - b)^{2} = r^{2}$ の形になっています。`
            },
            {
              t: '図形を読み取る',
              m: R`\text{中心 } (` + a1.tex() + R`,\ ` + b1.tex() + R`),\quad \text{半径 } ` + rv.tex(),
              n: R`点 $\alpha = ` + ctex(al) + R`$ からの距離が $` + rv.tex() + R`$ の点全体なので、$\alpha$ を中心とする半径 $` + rv.tex() + R`$ の円です。`,
              easy: R`コンパスの針を $\alpha$ に刺し、半径 $` + rv.tex() + R`$ で描いた円そのものです。`,
              pro: R`$|z - \alpha| \le r$ なら円の内部と周、$|z - \alpha| > r$ なら外部を表します。`
            }],
          fig: cfig({ pts: [{ x: a1.val(), y: b1.val(), label: 'α', cls: 'c3' }], circles: [{ cx: a1.val(), cy: b1.val(), r: rv.val(), cls: 'c1', dash: false }] })
        };
      }
      const a2 = v.a2, b2 = v.b2, be = qc(a2, b2);
      [a2, b2].forEach((q) => { if (Math.abs(q.val()) > 1e4) throw new JK.CalcError('座標は -10000〜10000 の範囲で入力してください'); });
      if (a1.eq(a2) && b1.eq(b2)) throw new JK.CalcError('α と β が同じ点です。異なる点を入力してください');
      let k = v.type === 'apollonius' ? v.k : Q(1);
      if (k.sign() <= 0) throw new JK.CalcError('比 k は正の数で入力してください');
      if (k.val() > 1000) throw new JK.CalcError('比 k は 1000 以下で入力してください');
      const k2 = k.mul(k);
      const n1 = a1.mul(a1).add(b1.mul(b1)), n2 = a2.mul(a2).add(b2.mul(b2));
      const sq = R`|z - \alpha|^{2} = ` + sqT('x', a1) + ' + ' + sqT('y', b1);
      if (k.eq(1)) {
        // 2(a2 - a1)x + 2(b2 - b1)y = n2 - n1
        const A = a2.sub(a1).mul(2), B = b2.sub(b1).mul(2), Cc = n2.sub(n1);
        const lineT = xyPoly([{ c: A, v: 'x' }, { c: B, v: 'y' }]) + ' = ' + Cc.tex();
        const slopeT = B.isZero() ? R`x = ` + Cc.div(A).tex() : R`y = ` + xyPoly([{ c: A.neg().div(B), v: 'x' }, { c: Cc.div(B), v: '' }]);
        const mid = qc(a1.add(a2).div(2), b1.add(b2).div(2));
        const fig = cfig({
          pts: [{ x: a1.val(), y: b1.val(), label: 'α', cls: 'c3' }, { x: a2.val(), y: b2.val(), label: 'β', cls: 'c3' }, { x: cx(mid), y: cy(mid), label: '中点', cls: 'c2', pos: 'br' }],
          segs: [{ x1: a1.val(), y1: b1.val(), x2: a2.val(), y2: b2.val(), cls: 'dim', dash: true }],
          curves: B.isZero() ? [] : [{ f: (x) => (Cc.val() - A.val() * x) / B.val(), cls: 'c1' }],
          vlines: B.isZero() ? [{ x: Cc.div(A).val(), cls: 'c1', dash: false }] : []
        });
        return {
          result: [
            { label: '図形', tex: R`\text{2 点 } ` + ctex(al) + R`,\ ` + ctex(be) + R`\ \text{を結ぶ線分の垂直二等分線}` },
            { label: '直線の式', tex: slopeT }
          ],
          steps: [step0,
            {
              t: R`$z = x + yi$ とおいて両辺を 2 乗する`,
              m: [sq, R`|z - \beta|^{2} = ` + sqT('x', a2) + ' + ' + sqT('y', b2), sqT('x', a1) + ' + ' + sqT('y', b1) + ' = ' + sqT('x', a2) + ' + ' + sqT('y', b2)],
              n: R`距離はどちらも 0 以上なので、2 乗しても同値です。`,
              easy: R`根号のついた距離の式を、2 乗して扱いやすくします。`
            },
            {
              t: '展開して整理する',
              m: [lineT, slopeT],
              n: R`両辺の $x^{2},\ y^{2}$ は打ち消し合い、1 次式（直線）が残ります。`,
              easy: R`2 乗の項が消えて 1 次式になるのが、「等距離の点の集まり＝直線」になる理由です。`
            },
            {
              t: '図形を読み取る',
              m: R`\text{中点 } \frac{\alpha + \beta}{2} = ` + ctex(mid),
              n: R`2 点 $\alpha,\ \beta$ から等距離にある点全体は、線分 $\alpha\beta$ の**垂直二等分線**です（中点を通り、$\alpha\beta$ に垂直）。`,
              easy: R`2 つの点から同じ距離にある点は、2 点のちょうど真ん中を、2 点を結ぶ線に垂直に通る直線の上に並びます。`,
              pro: R`アポロニウスの円で $k = 1$ の場合にあたります。`
            }],
          fig: fig
        };
      }
      // アポロニウスの円
      const d = Q(1).sub(k2);
      const cxq = a1.sub(k2.mul(a2)).div(d), cyq = b1.sub(k2.mul(b2)).div(d), Dq = n1.sub(k2.mul(n2)).div(d);
      const rho2 = cxq.mul(cxq).add(cyq.mul(cyq)).sub(Dq);
      const rho = V.sqrt(rho2);
      const ctr = qc(cxq, cyq);
      const expd = xyPoly([{ c: d, v: 'x^{2}' }, { c: d, v: 'y^{2}' }, { c: a1.sub(k2.mul(a2)).mul(-2), v: 'x' }, { c: b1.sub(k2.mul(b2)).mul(-2), v: 'y' }, { c: n1.sub(k2.mul(n2)), v: '' }]) + ' = 0';
      const divd = xyPoly([{ c: Q(1), v: 'x^{2}' }, { c: Q(1), v: 'y^{2}' }, { c: cxq.mul(-2), v: 'x' }, { c: cyq.mul(-2), v: 'y' }, { c: Dq, v: '' }]) + ' = 0';
      const eq = sqT('x', cxq) + ' + ' + sqT('y', cyq) + ' = ' + rho2.tex();
      const Pin = qc(a1.add(k.mul(a2)).div(k.add(1)), b1.add(k.mul(b2)).div(k.add(1)));
      const Pout = qc(a1.sub(k.mul(a2)).div(Q(1).sub(k)), b1.sub(k.mul(b2)).div(Q(1).sub(k)));
      return {
        result: [
          { label: '図形', tex: R`\text{中心 } ` + ctex(ctr) + R`,\ \text{半径 } ` + rho.tex() + R`\ \text{の円}` },
          { label: 'x, y の方程式', tex: eq },
          { label: '直径の両端', tex: R`\text{内分点 } ` + ctex(Pin) + R`,\ \text{外分点 } ` + ctex(Pout) }
        ],
        steps: [step0,
          {
            t: R`$z = x + yi$ とおいて両辺を 2 乗する`,
            m: [R`|z - \alpha|^{2} = ` + k2.tex() + R`|z - \beta|^{2}`, sqT('x', a1) + ' + ' + sqT('y', b1) + ' = ' + k2.tex() + R`\left\{` + sqT('x', a2) + ' + ' + sqT('y', b2) + R`\right\}`],
            n: R`$k = ` + k.tex() + R`$ なので、2 乗すると右辺は $k^{2} = ` + k2.tex() + R`$ 倍になります。`,
            easy: R`距離の比が $` + k.tex() + R` : 1$ という条件です。根号を外すために両辺を 2 乗します。`
          },
          {
            t: '展開して整理する',
            m: [expd, divd],
            n: R`$x^{2}$ と $y^{2}$ の係数がどちらも $1 - k^{2} = ` + d.tex() + R`$ で等しいので、両辺を $` + d.tex() + R`$ で割ると円の方程式の形になります。`,
            easy: R`$k \ne 1$ なので 2 乗の項が消えずに残り、$x^{2}$ と $y^{2}$ の係数がそろうので円になります（$k = 1$ なら直線）。`,
            lv: 2
          },
          {
            t: '平方完成して中心と半径を読む',
            m: [eq, R`\text{中心 } (` + cxq.tex() + R`,\ ` + cyq.tex() + R`),\quad \text{半径 } ` + rho.tex() + approxTail(rho)],
            n: R`$x,\ y$ それぞれについて平方完成しました。`,
            easy: R`$x^{2} - 2px = (x - p)^{2} - p^{2}$ のように、2 次関数の平方完成と同じ変形をします。`,
            pro: R`中心は $\frac{\alpha - k^{2}\beta}{1 - k^{2}}$、半径は $\frac{k|\alpha - \beta|}{|1 - k^{2}|}$ と公式化もできます。`
          },
          {
            t: '直径の両端（内分点・外分点）',
            m: [R`\text{内分点 } \frac{\alpha + k\beta}{1 + k} = ` + ctex(Pin), R`\text{外分点 } \frac{\alpha - k\beta}{1 - k} = ` + ctex(Pout)],
            n: R`線分 $\alpha\beta$ を $k : 1$ に内分・外分する点は、どちらも距離の比が $k : 1$ なので円周上にあり、この 2 点が直径の両端になります。`,
            easy: R`図で、2 つの点（内分点・外分点）を直径とする円になっていることを確かめてください。`,
            lv: 2
          }],
        fig: cfig({
          pts: [{ x: a1.val(), y: b1.val(), label: 'α', cls: 'c3' }, { x: a2.val(), y: b2.val(), label: 'β', cls: 'c3' }, { x: cx(ctr), y: cy(ctr), label: '中心', cls: 'c1', pos: 'br' }, { x: cx(Pin), y: cy(Pin), label: '内分点', cls: 'c2', pos: 'bl' }, { x: cx(Pout), y: cy(Pout), label: '外分点', cls: 'c2', pos: 'tl' }],
          segs: [{ x1: cx(Pin), y1: cy(Pin), x2: cx(Pout), y2: cy(Pout), cls: 'dim', dash: true }],
          circles: [{ cx: cxq.val(), cy: cyq.val(), r: rho.val(), cls: 'c1', dash: false }]
        })
      };
    }
  });
})();
