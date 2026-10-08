/* GOKAKU NAVI — 解説ステップの描画（学年別パーソナライズ）と、計算機/シミュレーターの入力解釈
   JK.steps.render(steps, depth) / JK.steps.depthFor(unitGrade, userGrade) / JK.inputs */
(function (g) {
  'use strict';
  var JK = g.JK;
  var U = JK.util;
  var CalcError = JK.CalcError;

  var DEPTHS = ['easy', 'normal', 'pro'];
  var DEPTH_LABEL = { easy: 'やさしく', normal: '標準', pro: '簡潔' };

  function stepText(s) { return [].concat(s.m || [], s.n || '').join(' '); }
  function hasValue(text, a) { return JK.check.hasValue(text, a); }

  JK.steps = {
    DEPTHS: DEPTHS,
    DEPTH_LABEL: DEPTH_LABEL,
    // 学年 < 単元の履修学年 → 未習なので噛み砕く / 学年 > → 既習なので簡潔に
    depthFor: function (unitGrade, userGrade) {
      if (userGrade < unitGrade) return 'easy';
      if (userGrade > unitGrade) return 'pro';
      return 'normal';
    },
    // depth で表示するステップ。parts（設問の配列）を渡すと、数値の答えが表示中のステップに 1 つも出てこない設問について、
    // その値が出てくる隠れたステップも表示に加える（「簡潔」表示で、答えを出すステップごと省かれてしまわないように）
    filter: function (steps, depth, parts) {
      var max = depth === 'easy' ? 3 : (depth === 'pro' ? 1 : 2);
      var list = (steps || []).filter(function (s) { return !!s; });
      var show = list.map(function (s) { return (s.lv || 1) <= max; });
      if (parts && show.indexOf(false) >= 0) {
        var seen = list.filter(function (s, i) { return show[i]; }).map(stepText).join(' ') + ' ' +
          parts.map(function (p) { return (p && p.explain) || ''; }).join(' ');
        parts.forEach(function (p) {
          if (!p || p.type !== 'num' || !p.answer || hasValue(seen, p.answer)) return;
          // 粒度の粗いステップ（lv の小さいもの）を優先し、同じ粒度なら最初に値が出てくるステップ（その値を求めているステップ）を足す
          var best = -1;
          list.forEach(function (s, i) {
            if (show[i] || !hasValue(stepText(s), p.answer)) return;
            if (best < 0 || (s.lv || 1) < (list[best].lv || 1)) best = i;
          });
          if (best >= 0) { show[best] = true; seen += ' ' + stepText(list[best]); }
        });
      }
      return list.filter(function (s, i) { return show[i]; });
    },
    render: function (steps, depth, parts) {
      depth = depth || 'normal';
      var list = JK.steps.filter(steps, depth, parts);
      var h = '<ol class="steps steps-' + depth + '">';
      list.forEach(function (s) {
        h += '<li class="step' + ((s.lv || 1) > 1 ? ' step-detail' : '') + '">';
        if (s.t) h += '<div class="step-t">' + JK.rich(s.t) + '</div>';
        if (s.m != null) {
          var lines = Array.isArray(s.m) ? s.m : [s.m];
          h += '<div class="step-m">';
          lines.forEach(function (line) { h += JK.tex.render(line, true); });
          h += '</div>';
        }
        if (s.n) h += '<div class="step-n">' + JK.rich(s.n) + '</div>';
        if (depth === 'easy' && s.easy) h += '<div class="step-easy"><span class="step-tag">やさしく</span><div>' + JK.rich(s.easy) + '</div></div>';
        if (depth === 'pro' && s.pro) h += '<div class="step-pro"><span class="step-tag">入試 Tip</span><div>' + JK.rich(s.pro) + '</div></div>';
        if (s.fig) h += '<div class="step-fig">' + s.fig + '</div>';
        h += '</li>';
      });
      return h + '</ol>';
    }
  };

  /* ---------- 計算機・シミュレーターの入力 ---------- */

  function label(inp) { return String(inp.label || inp.key).replace(/\$/g, ''); }

  function range(inp, x) {
    if (inp.min != null && x < inp.min) throw new CalcError(label(inp) + ' は ' + inp.min + ' 以上で入力してください');
    if (inp.max != null && x > inp.max) throw new CalcError(label(inp) + ' は ' + inp.max + ' 以下で入力してください');
  }

  function parseOne(inp, raw) {
    var s = raw == null ? '' : String(raw).trim();
    switch (inp.type) {
      case 'q': {
        if (s === '') throw new CalcError(label(inp) + ' を入力してください');
        var q = JK.Q.from(s);
        if (!q) throw new CalcError(label(inp) + ' は整数・分数（例 3/4）・小数で入力してください');
        range(inp, q.val());
        return q;
      }
      case 'num': {
        if (s === '') throw new CalcError(label(inp) + ' を入力してください');
        var x = U.parseNum(s);
        if (!isFinite(x)) throw new CalcError(label(inp) + ' を数値として読み取れません');
        range(inp, x);
        return x;
      }
      case 'int': {
        if (s === '') throw new CalcError(label(inp) + ' を入力してください');
        var n = U.parseNum(s);
        if (!isFinite(n) || Math.abs(n - Math.round(n)) > 1e-9) throw new CalcError(label(inp) + ' は整数で入力してください');
        n = Math.round(n);
        range(inp, n);
        return n;
      }
      case 'select': {
        var opts = inp.options || [];
        for (var i = 0; i < opts.length; i++) if (String(opts[i][0]) === s) return String(opts[i][0]);
        return opts.length ? String(opts[0][0]) : s;
      }
      case 'list': {
        var parts = JK.expr.normalize(s).split(/[\s,;]+/).filter(function (t) { return t !== ''; });
        if (!parts.length) throw new CalcError(label(inp) + ' を入力してください（カンマ区切り）');
        return parts.map(function (t) {
          var v = U.parseNum(t);
          if (!isFinite(v)) throw new CalcError(label(inp) + ' に数値として読めない値があります: ' + t);
          return v;
        });
      }
      case 'poly':
        if (s === '') throw new CalcError(label(inp) + ' を入力してください');
        return JK.poly.parse(s, inp['var'] || 'x');
      case 'text':
      default:
        return s;
    }
  }

  JK.inputs = {
    defaults: function (inputs) {
      var raw = {};
      (inputs || []).forEach(function (inp) { raw[inp.key] = inp.def == null ? '' : String(inp.def); });
      return raw;
    },
    // raw: {key: 文字列}。戻り値 { values, error }（error は最初の入力エラーのメッセージ or null）
    parse: function (inputs, raw) {
      var values = {}, error = null;
      (inputs || []).forEach(function (inp) {
        if (error) return;
        try {
          if (typeof inp.show === 'function' && !inp.show(raw, values)) return;
          values[inp.key] = parseOne(inp, raw[inp.key]);
        } catch (e) {
          if (e instanceof CalcError) error = e.message;
          else throw e;
        }
      });
      return { values: values, error: error };
    },
    visible: function (inp, raw, values) {
      try { return typeof inp.show === 'function' ? !!inp.show(raw, values || {}) : true; }
      catch (e) { return true; }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
