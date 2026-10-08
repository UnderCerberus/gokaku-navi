/* GOKAKU NAVI — SVG 生成（文字列を返す。DOM 不要）
   JK.plot.graph(opts): 関数グラフ / JK.plot.draw(w, h): 自由図形（物理の図・回路・幾何） */
(function (g) {
  'use strict';
  var JK = g.JK;
  var esc = JK.util.esc;
  var uid = 0;

  function n2(x) { return String(Math.round(x * 100) / 100); }
  function sCls(c) { return 's-' + (c || 'fg'); }
  function tCls(c) { return 't-' + (c || 'fg'); }
  function fsCls(c) { return 'fs-' + (c || 'fg'); }
  function fillAttr(f) { return f ? ' class="fl-' + f + '"' : ' fill="none"'; }

  function niceStep(span, n) {
    var raw = span / (n || 6);
    if (!(raw > 0) || !isFinite(raw)) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(raw)));
    var m = raw / p;
    var s = m < 1.5 ? 1 : (m < 3.5 ? 2 : (m < 7.5 ? 5 : 10));
    return s * p;
  }
  function tickLabel(v, step) {
    var d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
    var s = v.toFixed(Math.min(6, d));
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }
  function arrowHead(x1, y1, x2, y2, size, cls) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / L, uy = dy / L, s = size || 7, w = s * 0.42;
    var bx = x2 - ux * s, by = y2 - uy * s;
    return '<polygon class="' + fsCls(cls) + '" points="' + n2(x2) + ',' + n2(y2) + ' ' +
      n2(bx - uy * w) + ',' + n2(by + ux * w) + ' ' + n2(bx + uy * w) + ',' + n2(by - ux * w) + '"/>';
  }

  /* ================= 関数グラフ ================= */

  function graph(o) {
    o = o || {};
    var W = o.w || 340, H = o.h || 240;
    var mL = 30, mR = 18, mT = 16, mB = 24;
    var pw = W - mL - mR, ph = H - mT - mB;
    var xmin = o.x ? o.x[0] : -5, xmax = o.x ? o.x[1] : 5;
    if (!(xmax > xmin)) xmax = xmin + 1;
    var ymin, ymax, i;

    if (o.y && o.y[1] > o.y[0]) { ymin = o.y[0]; ymax = o.y[1]; }
    else {
      var ys = [];
      (o.curves || []).forEach(function (c) {
        var d0 = Math.max(xmin, c.domain ? c.domain[0] : xmin), d1 = Math.min(xmax, c.domain ? c.domain[1] : xmax);
        for (var k = 0; k <= 80; k++) {
          var y = c.f(d0 + (d1 - d0) * k / 80);
          if (isFinite(y)) ys.push(y);
        }
      });
      (o.param || []).forEach(function (c) {
        for (var k = 0; k <= 80; k++) {
          var y = c.y(c.t[0] + (c.t[1] - c.t[0]) * k / 80);
          if (isFinite(y)) ys.push(y);
        }
      });
      (o.fills || []).forEach(function (f) {
        for (var k = 0; k <= 20; k++) {
          var x = f.from + (f.to - f.from) * k / 20;
          var y1 = f.f(x), y2 = f.g ? f.g(x) : 0;
          if (isFinite(y1)) ys.push(y1);
          if (isFinite(y2)) ys.push(y2);
        }
      });
      (o.points || []).forEach(function (p) { ys.push(p.y); });
      (o.hlines || []).forEach(function (l) { ys.push(l.y); });
      (o.segs || []).forEach(function (s) { ys.push(s.y1, s.y2); });
      if (!ys.length) { ymin = -5; ymax = 5; }
      else {
        ys.sort(function (a, b) { return a - b; });
        var lo = ys[Math.floor(0.03 * (ys.length - 1))], hi = ys[Math.ceil(0.97 * (ys.length - 1))];
        ymin = ys[0]; ymax = ys[ys.length - 1];
        if (hi > lo && (ymax - ymin) > 8 * (hi - lo)) { ymin = lo - 0.3 * (hi - lo); ymax = hi + 0.3 * (hi - lo); }
        if (ymin === ymax) { ymin -= 1; ymax += 1; }
        var span = ymax - ymin;
        if (ymin > 0 && ymin < 0.5 * span) ymin = 0;
        if (ymax < 0 && -ymax < 0.5 * span) ymax = 0;
        span = ymax - ymin;
        ymin -= span * 0.1; ymax += span * 0.1;
      }
    }
    if (o.equal) {
      var sx = (xmax - xmin) / pw, sy = (ymax - ymin) / ph;
      if (sx > sy) { var cy = (ymin + ymax) / 2, hy = sx * ph / 2; ymin = cy - hy; ymax = cy + hy; }
      else { var cx = (xmin + xmax) / 2, hx = sy * pw / 2; xmin = cx - hx; xmax = cx + hx; }
    }
    var xr = xmax - xmin, yr = ymax - ymin;
    function X(x) { return mL + (x - xmin) / xr * pw; }
    function Y(y) { return mT + (ymax - y) / yr * ph; }

    var id = 'jkc' + (++uid);
    var svg = '<svg class="jk-plot" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H +
      '" xmlns="http://www.w3.org/2000/svg" role="img">';
    svg += '<defs><clipPath id="' + id + '"><rect x="' + mL + '" y="' + mT + '" width="' + pw + '" height="' + ph + '"/></clipPath></defs>';

    var stepX = niceStep(xr, 7), stepY = niceStep(yr, 6);
    if (o.equal) stepX = stepY = Math.max(stepX, stepY);
    var ax0 = (ymin <= 0 && ymax >= 0) ? Y(0) : mT + ph;       // x 軸の画面 y
    var ay0 = (xmin <= 0 && xmax >= 0) ? X(0) : mL;            // y 軸の画面 x
    var t, v;

    if (o.grid !== false) {
      for (t = Math.ceil(xmin / stepX); t * stepX <= xmax + 1e-9; t++) {
        v = t * stepX;
        svg += '<line class="g-grid" x1="' + n2(X(v)) + '" y1="' + mT + '" x2="' + n2(X(v)) + '" y2="' + (mT + ph) + '"/>';
      }
      for (t = Math.ceil(ymin / stepY); t * stepY <= ymax + 1e-9; t++) {
        v = t * stepY;
        svg += '<line class="g-grid" x1="' + mL + '" y1="' + n2(Y(v)) + '" x2="' + (mL + pw) + '" y2="' + n2(Y(v)) + '"/>';
      }
    }
    // 軸
    svg += '<line class="g-axis" x1="' + (mL - 4) + '" y1="' + n2(ax0) + '" x2="' + (mL + pw + 8) + '" y2="' + n2(ax0) + '"/>';
    svg += arrowHead(mL, ax0, mL + pw + 12, ax0, 6, 'dim');
    svg += '<line class="g-axis" x1="' + n2(ay0) + '" y1="' + (mT + ph + 4) + '" x2="' + n2(ay0) + '" y2="' + (mT - 6) + '"/>';
    svg += arrowHead(ay0, mT + ph, ay0, mT - 10, 6, 'dim');
    var axn = o.axis || ['x', 'y'];
    if (axn[0]) svg += '<text class="g-axn" x="' + (mL + pw + 10) + '" y="' + n2(ax0 + 13) + '" text-anchor="end">' + esc(axn[0]) + '</text>';
    if (axn[1]) svg += '<text class="g-axn" x="' + n2(ay0 + 6) + '" y="' + (mT - 4) + '">' + esc(axn[1]) + '</text>';
    // 目盛り
    if (o.ticks !== false) {
      for (t = Math.ceil(xmin / stepX); t * stepX <= xmax + 1e-9; t++) {
        v = t * stepX;
        if (Math.abs(v) < stepX * 1e-6) continue;
        if (X(v) > mL + pw - 6) continue;
        svg += '<line class="g-axis" x1="' + n2(X(v)) + '" y1="' + n2(ax0 - 2.5) + '" x2="' + n2(X(v)) + '" y2="' + n2(ax0 + 2.5) + '"/>';
        svg += '<text class="g-tick" x="' + n2(X(v)) + '" y="' + n2(Math.min(ax0 + 12, H - 3)) + '" text-anchor="middle">' + tickLabel(v, stepX) + '</text>';
      }
      for (t = Math.ceil(ymin / stepY); t * stepY <= ymax + 1e-9; t++) {
        v = t * stepY;
        if (Math.abs(v) < stepY * 1e-6) continue;
        if (Y(v) < mT + 6) continue;
        svg += '<line class="g-axis" x1="' + n2(ay0 - 2.5) + '" y1="' + n2(Y(v)) + '" x2="' + n2(ay0 + 2.5) + '" y2="' + n2(Y(v)) + '"/>';
        svg += '<text class="g-tick" x="' + n2(Math.max(ay0 - 5, 11)) + '" y="' + n2(Y(v) + 3) + '" text-anchor="end">' + tickLabel(v, stepY) + '</text>';
      }
      if (xmin <= 0 && xmax >= 0 && ymin <= 0 && ymax >= 0) {
        svg += '<text class="g-tick" x="' + n2(ay0 - 5) + '" y="' + n2(ax0 + 12) + '" text-anchor="end">O</text>';
      }
    }

    var clip = ' clip-path="url(#' + id + ')"';
    // 塗りつぶし
    (o.fills || []).forEach(function (f) {
      var N = 60, d = '', k, x;
      for (k = 0; k <= N; k++) {
        x = f.from + (f.to - f.from) * k / N;
        d += (k ? ' L' : 'M') + n2(X(x)) + ' ' + n2(Y(f.f(x)));
      }
      for (k = N; k >= 0; k--) {
        x = f.from + (f.to - f.from) * k / N;
        d += ' L' + n2(X(x)) + ' ' + n2(Y(f.g ? f.g(x) : 0));
      }
      svg += '<path class="fl-' + (f.cls || 'f1') + '" d="' + d + ' Z" stroke="none"' + clip + '/>';
    });

    function pathFrom(pts) {
      // pts: [[x,y]|null,...]（null で線を切る）
      var d = '', pen = false, lo = ymin - yr * 4, hi = ymax + yr * 4, prev = null;
      for (var k = 0; k < pts.length; k++) {
        var p = pts[k];
        if (!p || !isFinite(p[0]) || !isFinite(p[1])) { pen = false; prev = null; continue; }
        var yy = p[1];
        // 漸近線をまたぐ飛びは線を切る
        if (prev !== null && ((prev > ymax + yr && yy < ymin - yr) || (prev < ymin - yr && yy > ymax + yr))) pen = false;
        prev = yy;
        yy = Math.max(lo, Math.min(hi, yy));
        d += (pen ? ' L' : ' M') + n2(X(p[0])) + ' ' + n2(Y(yy));
        pen = true;
      }
      return d.trim();
    }
    (o.curves || []).forEach(function (c) {
      var d0 = Math.max(xmin, c.domain ? c.domain[0] : xmin), d1 = Math.min(xmax, c.domain ? c.domain[1] : xmax);
      if (!(d1 > d0)) return;
      var N = 240, pts = [];
      for (var k = 0; k <= N; k++) {
        var x = d0 + (d1 - d0) * k / N, y;
        try { y = c.f(x); } catch (e) { y = NaN; }
        pts.push(isFinite(y) ? [x, y] : null);
      }
      svg += '<path class="g-curve ' + sCls(c.cls || 'c1') + '" fill="none" d="' + pathFrom(pts) + '"' +
        (c.dash ? ' stroke-dasharray="5 4"' : '') + clip + '/>';
    });
    (o.param || []).forEach(function (c) {
      var N = 240, pts = [];
      for (var k = 0; k <= N; k++) {
        var tt = c.t[0] + (c.t[1] - c.t[0]) * k / N, x, y;
        try { x = c.x(tt); y = c.y(tt); } catch (e) { x = NaN; y = NaN; }
        pts.push(isFinite(x) && isFinite(y) ? [x, y] : null);
      }
      svg += '<path class="g-curve ' + sCls(c.cls || 'c1') + '" fill="none" d="' + pathFrom(pts) + '"' +
        (c.dash ? ' stroke-dasharray="5 4"' : '') + clip + '/>';
    });
    (o.vlines || []).forEach(function (l) {
      svg += '<line class="g-guide ' + sCls(l.cls || 'dim') + '" x1="' + n2(X(l.x)) + '" y1="' + mT + '" x2="' + n2(X(l.x)) + '" y2="' + (mT + ph) + '"' +
        (l.dash === false ? '' : ' stroke-dasharray="4 3"') + clip + '/>';
      if (l.label) svg += '<text class="g-lab ' + tCls(l.cls || 'dim') + '" x="' + n2(X(l.x) + 4) + '" y="' + (mT + 10) + '">' + esc(l.label) + '</text>';
    });
    (o.hlines || []).forEach(function (l) {
      svg += '<line class="g-guide ' + sCls(l.cls || 'dim') + '" x1="' + mL + '" y1="' + n2(Y(l.y)) + '" x2="' + (mL + pw) + '" y2="' + n2(Y(l.y)) + '"' +
        (l.dash === false ? '' : ' stroke-dasharray="4 3"') + clip + '/>';
      if (l.label) svg += '<text class="g-lab ' + tCls(l.cls || 'dim') + '" x="' + (mL + pw - 2) + '" y="' + n2(Y(l.y) - 4) + '" text-anchor="end">' + esc(l.label) + '</text>';
    });
    (o.segs || []).forEach(function (s) {
      var x1 = X(s.x1), y1 = Y(s.y1), x2 = X(s.x2), y2 = Y(s.y2);
      svg += '<line class="g-seg ' + sCls(s.cls || 'c2') + '" x1="' + n2(x1) + '" y1="' + n2(y1) + '" x2="' + n2(x2) + '" y2="' + n2(y2) + '"' +
        (s.dash ? ' stroke-dasharray="4 3"' : '') + '/>';
      if (s.arrow) svg += arrowHead(x1, y1, x2, y2, 8, s.cls || 'c2');
      if (s.label) {
        var mx = s.arrow ? x2 : (x1 + x2) / 2, my = s.arrow ? y2 : (y1 + y2) / 2;
        svg += '<text class="g-lab ' + tCls(s.cls || 'c2') + '" x="' + n2(mx + 6) + '" y="' + n2(my - 6) + '">' + esc(s.label) + '</text>';
      }
    });
    (o.points || []).forEach(function (p) {
      var px = X(p.x), py = Y(p.y), pos = p.pos || 'tr';
      svg += '<circle class="g-pt ' + fsCls(p.cls || 'c3') + '" cx="' + n2(px) + '" cy="' + n2(py) + '" r="3.2"/>';
      if (p.label) {
        var dx = pos.charAt(1) === 'l' ? -6 : 6, dy = pos.charAt(0) === 'b' ? 14 : -7;
        svg += '<text class="g-lab ' + tCls(p.cls || 'c3') + '" x="' + n2(px + dx) + '" y="' + n2(py + dy) + '" text-anchor="' +
          (dx < 0 ? 'end' : 'start') + '">' + esc(p.label) + '</text>';
      }
    });
    (o.labels || []).forEach(function (l) {
      svg += '<text class="g-lab ' + tCls(l.cls || 'fg') + '" x="' + n2(X(l.x)) + '" y="' + n2(Y(l.y)) + '" text-anchor="' + (l.anchor || 'start') + '">' + esc(l.text) + '</text>';
    });
    return svg + '</svg>';
  }

  /* ================= 自由図形 ================= */

  function Draw(w, h) {
    this.w = w || 360;
    this.h = h || 220;
    this.el = [];
  }
  function lineAttrs(o, defCls) {
    o = o || {};
    return ' class="' + sCls(o.cls || defCls || 'fg') + '" stroke-width="' + (o.w || 1.5) + '"' +
      (o.dash ? ' stroke-dasharray="' + (o.dash === true ? '5 4' : o.dash) + '"' : '');
  }
  Draw.prototype.line = function (x1, y1, x2, y2, o) {
    this.el.push('<line x1="' + n2(x1) + '" y1="' + n2(y1) + '" x2="' + n2(x2) + '" y2="' + n2(y2) + '"' + lineAttrs(o) + ' stroke-linecap="round"/>');
    return this;
  };
  Draw.prototype.arrow = function (x1, y1, x2, y2, o) {
    o = o || {};
    var cls = o.cls || 'c1', dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var hs = Math.min(9, Math.max(5, L * 0.35));
    // 矢じりの付け根まで線を引く
    var ex = x2 - dx / L * hs * 0.8, ey = y2 - dy / L * hs * 0.8;
    this.el.push('<line x1="' + n2(x1) + '" y1="' + n2(y1) + '" x2="' + n2(ex) + '" y2="' + n2(ey) + '" class="' + sCls(cls) + '" stroke-width="' + (o.w || 2) + '"' +
      (o.dash ? ' stroke-dasharray="5 4"' : '') + '/>');
    this.el.push(arrowHead(x1, y1, x2, y2, hs, cls));
    if (o.label) {
      // ラベルは先端の少し先・進行方向の左側
      var ux = dx / L, uy = dy / L, side = o.lpos === -1 ? -1 : 1;
      var lx = x2 + ux * 6 + uy * 9 * side, ly = y2 + uy * 6 - ux * 9 * side + 4;
      this.el.push('<text class="d-lab ' + tCls(cls) + '" x="' + n2(lx) + '" y="' + n2(ly) + '" text-anchor="middle">' + esc(o.label) + '</text>');
    }
    return this;
  };
  Draw.prototype.rect = function (x, y, w, h, o) {
    o = o || {};
    this.el.push('<rect x="' + n2(x) + '" y="' + n2(y) + '" width="' + n2(w) + '" height="' + n2(h) + '"' +
      (o.rx ? ' rx="' + o.rx + '"' : '') +
      ' class="' + sCls(o.cls || 'fg') + (o.fill ? ' fl-' + o.fill : '') + '"' + (o.fill ? '' : ' fill="none"') +
      ' stroke-width="' + (o.w || 1.5) + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') +
      (o.rot ? ' transform="rotate(' + n2(-o.rot) + ' ' + n2(o.ox == null ? x + w / 2 : o.ox) + ' ' + n2(o.oy == null ? y + h / 2 : o.oy) + ')"' : '') + '/>');
    return this;
  };
  Draw.prototype.circle = function (cx, cy, r, o) {
    o = o || {};
    this.el.push('<circle cx="' + n2(cx) + '" cy="' + n2(cy) + '" r="' + n2(r) + '" class="' + sCls(o.cls || 'fg') + (o.fill ? ' fl-' + o.fill : '') + '"' +
      (o.fill ? '' : ' fill="none"') + ' stroke-width="' + (o.w || 1.5) + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + '/>');
    return this;
  };
  Draw.prototype.poly = function (pts, o) {
    o = o || {};
    var s = pts.map(function (p) { return n2(p[0]) + ',' + n2(p[1]); }).join(' ');
    this.el.push('<' + (o.close === false ? 'polyline' : 'polygon') + ' points="' + s + '" class="' + sCls(o.cls || 'fg') + (o.fill ? ' fl-' + o.fill : '') + '"' +
      (o.fill ? '' : ' fill="none"') + ' stroke-width="' + (o.w || 1.5) + '" stroke-linejoin="round"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + '/>');
    return this;
  };
  Draw.prototype.path = function (d, o) {
    o = o || {};
    this.el.push('<path d="' + esc(d) + '" class="' + sCls(o.cls || 'fg') + (o.fill ? ' fl-' + o.fill : '') + '"' +
      (o.fill ? '' : ' fill="none"') + ' stroke-width="' + (o.w || 1.5) + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + '/>');
    return this;
  };
  Draw.prototype.text = function (x, y, str, o) {
    o = o || {};
    this.el.push('<text class="d-lab ' + tCls(o.cls || 'fg') + '" x="' + n2(x) + '" y="' + n2(y) + '" font-size="' + (o.size || 12) + '" text-anchor="' + (o.anchor || 'middle') + '"' +
      (o.italic ? ' font-style="italic"' : '') + (o.bold ? ' font-weight="700"' : '') + '>' + esc(str) + '</text>');
    return this;
  };
  // 角度は度。x 軸正方向から反時計回り（画面上で）
  function polar(cx, cy, r, deg) {
    var a = deg * Math.PI / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  }
  Draw.prototype.arc = function (cx, cy, r, a0, a1, o) {
    var p0 = polar(cx, cy, r, a0), p1 = polar(cx, cy, r, a1);
    var large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 0 : 1;
    this.el.push('<path d="M' + n2(p0[0]) + ' ' + n2(p0[1]) + ' A' + n2(r) + ' ' + n2(r) + ' 0 ' + large + ' ' + sweep + ' ' + n2(p1[0]) + ' ' + n2(p1[1]) + '" fill="none"' +
      lineAttrs(o, 'c3') + '/>');
    return this;
  };
  Draw.prototype.angle = function (cx, cy, r, a0, a1, label, o) {
    o = o || {};
    this.arc(cx, cy, r, a0, a1, o);
    if (label) {
      var m = polar(cx, cy, r + 11, (a0 + a1) / 2);
      this.el.push('<text class="d-lab ' + tCls(o.cls || 'c3') + '" x="' + n2(m[0]) + '" y="' + n2(m[1] + 4) + '" text-anchor="middle" font-style="italic">' + esc(label) + '</text>');
    }
    return this;
  };
  Draw.prototype.hatch = function (x1, y1, x2, y2, o) {
    o = o || {};
    var side = o.side === -1 ? -1 : 1;
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / L, uy = dy / L, nx = -uy * side, ny = ux * side;
    this.el.push('<line x1="' + n2(x1) + '" y1="' + n2(y1) + '" x2="' + n2(x2) + '" y2="' + n2(y2) + '" class="' + sCls(o.cls || 'fg') + '" stroke-width="1.6"/>');
    var d = '';
    for (var s = 4; s < L; s += 8) {
      var bx = x1 + ux * s, by = y1 + uy * s;
      d += 'M' + n2(bx) + ' ' + n2(by) + ' L' + n2(bx + (nx - ux) * 6) + ' ' + n2(by + (ny - uy) * 6) + ' ';
    }
    this.el.push('<path d="' + d.trim() + '" class="s-dim" stroke-width="1" fill="none"/>');
    return this;
  };
  Draw.prototype.spring = function (x1, y1, x2, y2, o) {
    o = o || {};
    var n = o.n || 8, amp = o.amp || 6;
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var lead = Math.min(10, L * 0.12), body = L - 2 * lead;
    var d = 'M' + n2(x1) + ' ' + n2(y1) + ' L' + n2(x1 + ux * lead) + ' ' + n2(y1 + uy * lead);
    for (var k = 0; k < n * 2; k++) {
      var t = lead + body * (k + 0.5) / (n * 2), sgn = k % 2 === 0 ? 1 : -1;
      d += ' L' + n2(x1 + ux * t + nx * amp * sgn) + ' ' + n2(y1 + uy * t + ny * amp * sgn);
    }
    d += ' L' + n2(x2 - ux * lead) + ' ' + n2(y2 - uy * lead) + ' L' + n2(x2) + ' ' + n2(y2);
    this.el.push('<path d="' + d + '" fill="none" class="' + sCls(o.cls || 'fg') + '" stroke-width="1.4" stroke-linejoin="round"/>');
    return this;
  };
  // 線分上に部品を置く共通処理。draw(ux,uy,nx,ny,mx,my) が部品の SVG を返す
  function component(self, x1, y1, x2, y2, half, o, drawFn) {
    o = o || {};
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    half = Math.min(half, L / 2);
    self.el.push('<line x1="' + n2(x1) + '" y1="' + n2(y1) + '" x2="' + n2(mx - ux * half) + '" y2="' + n2(my - uy * half) + '" class="s-fg" stroke-width="1.5"/>');
    self.el.push('<line x1="' + n2(mx + ux * half) + '" y1="' + n2(my + uy * half) + '" x2="' + n2(x2) + '" y2="' + n2(y2) + '" class="s-fg" stroke-width="1.5"/>');
    self.el.push(drawFn(ux, uy, nx, ny, mx, my, half));
    if (o.label) {
      var side = o.lpos === -1 ? -1 : 1, dist = o.ldist || 17;
      // 既定では画面の上側（または左側）にラベル
      var lx = mx + nx * dist * side, ly = my + ny * dist * side;
      if (side === 1 && (ny > 0.01 || (Math.abs(ny) <= 0.01 && nx > 0))) { lx = mx - nx * dist; ly = my - ny * dist; }
      self.el.push('<text class="d-lab t-fg" x="' + n2(lx) + '" y="' + n2(ly + 4) + '" text-anchor="middle">' + esc(o.label) + '</text>');
    }
    return self;
  }
  Draw.prototype.resistor = function (x1, y1, x2, y2, o) {
    return component(this, x1, y1, x2, y2, 15, o, function (ux, uy, nx, ny, mx, my, half) {
      var hw = 6, p = [
        [mx - ux * half + nx * hw, my - uy * half + ny * hw], [mx + ux * half + nx * hw, my + uy * half + ny * hw],
        [mx + ux * half - nx * hw, my + uy * half - ny * hw], [mx - ux * half - nx * hw, my - uy * half - ny * hw]
      ];
      return '<polygon points="' + p.map(function (q) { return n2(q[0]) + ',' + n2(q[1]); }).join(' ') + '" class="s-fg fl-f0" stroke-width="1.5"/>';
    });
  };
  Draw.prototype.battery = function (x1, y1, x2, y2, o) {
    return component(this, x1, y1, x2, y2, 3.5, o, function (ux, uy, nx, ny, mx, my, half) {
      var ax = mx - ux * half, ay = my - uy * half, bx = mx + ux * half, by = my + uy * half;
      // (x1,y1) 側が長い線 = ＋極
      return '<line x1="' + n2(ax + nx * 11) + '" y1="' + n2(ay + ny * 11) + '" x2="' + n2(ax - nx * 11) + '" y2="' + n2(ay - ny * 11) + '" class="s-fg" stroke-width="1.5"/>' +
        '<line x1="' + n2(bx + nx * 5.5) + '" y1="' + n2(by + ny * 5.5) + '" x2="' + n2(bx - nx * 5.5) + '" y2="' + n2(by - ny * 5.5) + '" class="s-fg" stroke-width="3.2"/>';
    });
  };
  Draw.prototype.capacitor = function (x1, y1, x2, y2, o) {
    return component(this, x1, y1, x2, y2, 3.5, o, function (ux, uy, nx, ny, mx, my, half) {
      var ax = mx - ux * half, ay = my - uy * half, bx = mx + ux * half, by = my + uy * half;
      return '<line x1="' + n2(ax + nx * 10) + '" y1="' + n2(ay + ny * 10) + '" x2="' + n2(ax - nx * 10) + '" y2="' + n2(ay - ny * 10) + '" class="s-fg" stroke-width="2"/>' +
        '<line x1="' + n2(bx + nx * 10) + '" y1="' + n2(by + ny * 10) + '" x2="' + n2(bx - nx * 10) + '" y2="' + n2(by - ny * 10) + '" class="s-fg" stroke-width="2"/>';
    });
  };
  Draw.prototype.coil = function (x1, y1, x2, y2, o) {
    o = o || {};
    var n = o.n || 5;
    return component(this, x1, y1, x2, y2, n * 5, o, function (ux, uy, nx, ny, mx, my, half) {
      var d = 'M' + n2(mx - ux * half) + ' ' + n2(my - uy * half), r = half / n;
      for (var k = 0; k < n; k++) {
        var ex = mx - ux * half + ux * r * 2 * (k + 1), ey = my - uy * half + uy * r * 2 * (k + 1);
        d += ' A' + n2(r) + ' ' + n2(r) + ' 0 0 1 ' + n2(ex) + ' ' + n2(ey);
      }
      return '<path d="' + d + '" fill="none" class="s-fg" stroke-width="1.5"/>';
    });
  };
  Draw.prototype.acsource = function (cx, cy, r, o) {
    o = o || {};
    r = r || 12;
    this.el.push('<circle cx="' + n2(cx) + '" cy="' + n2(cy) + '" r="' + n2(r) + '" class="s-fg fl-f0" stroke-width="1.5"/>');
    this.el.push('<path d="M' + n2(cx - r * 0.6) + ' ' + n2(cy) + ' q' + n2(r * 0.3) + ' ' + n2(-r * 0.7) + ' ' + n2(r * 0.6) + ' 0 q' + n2(r * 0.3) + ' ' + n2(r * 0.7) + ' ' + n2(r * 0.6) + ' 0" fill="none" class="s-fg" stroke-width="1.3"/>');
    if (o.label && o.label !== '~') this.el.push('<text class="d-lab t-fg" x="' + n2(cx) + '" y="' + n2(cy - r - 5) + '" text-anchor="middle">' + esc(o.label) + '</text>');
    return this;
  };
  Draw.prototype.meter = function (cx, cy, r, ch) {
    r = r || 11;
    this.el.push('<circle cx="' + n2(cx) + '" cy="' + n2(cy) + '" r="' + n2(r) + '" class="s-fg fl-f0" stroke-width="1.5"/>');
    this.el.push('<text class="d-lab t-fg" x="' + n2(cx) + '" y="' + n2(cy + 4) + '" text-anchor="middle" font-weight="700">' + esc(ch || 'A') + '</text>');
    return this;
  };
  Draw.prototype.wire = function (pts, o) {
    o = o || {};
    var s = pts.map(function (p) { return n2(p[0]) + ',' + n2(p[1]); }).join(' ');
    this.el.push('<polyline points="' + s + '" fill="none" class="' + sCls(o.cls || 'fg') + '" stroke-width="' + (o.w || 1.5) + '" stroke-linejoin="round"/>');
    return this;
  };
  Draw.prototype.dot = function (x, y, o) {
    o = o || {};
    this.el.push('<circle cx="' + n2(x) + '" cy="' + n2(y) + '" r="' + (o.r || 3) + '" class="' + fsCls(o.cls || 'fg') + '"/>');
    return this;
  };
  Draw.prototype.group = function (svg) { this.el.push(String(svg)); return this; };
  Draw.prototype.svg = function () {
    return '<svg class="jk-plot jk-draw" viewBox="0 0 ' + this.w + ' ' + this.h + '" width="' + this.w + '" height="' + this.h +
      '" xmlns="http://www.w3.org/2000/svg" role="img">' + this.el.join('') + '</svg>';
  };

  JK.plot = {
    graph: graph,
    draw: function (w, h) { return new Draw(w, h); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
