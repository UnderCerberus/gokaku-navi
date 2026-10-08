/* GOKAKU NAVI — 計算機モードのシェル
   数学: 途中式つき計算シミュレーター / 物理: 公式シミュレーター / 英語: 和訳ツール（JK.en.mount） */
(function () {
  'use strict';
  var store = JK.store, U = JK.util, esc = U.esc, rich = JK.rich;
  var COURSES = [['IA', '数I・A'], ['IIB', '数II・B'], ['IIIC', '数III・C']];
  var FIELDS = ['力学', '熱力学', '波動', '電磁気', '原子'];
  var root = null, subject = 'math', debounce = null;
  var rawStore = {};            // 計算機ごとの入力値（ページを開いている間だけ保持）
  var lastLog = {};

  function sel() {
    var c = store.s.ui.calc;
    return c[subject] || (c[subject] = {});
  }
  function defs() { return subject === 'math' ? JK.calcs : JK.sims; }
  function tabOf(d) { return subject === 'math' ? d.course : d.field; }
  function depthOf(def) {
    if (store.s.ui.depth) return store.s.ui.depth;
    var u = JK.units[def.unit];
    return JK.steps.depthFor(u ? u.grade : 2, Number(store.s.profile.grade));
  }

  function render() {
    if (!root) return;
    if (subject === 'english') {
      if (JK.en && typeof JK.en.mount === 'function') JK.en.mount(root);
      else root.innerHTML = '<div class="note">和訳ツールのデータが読み込まれていません。</div>';
      return;
    }
    var all = defs();
    if (!all.length) { root.innerHTML = '<div class="note">計算機のデータが読み込まれていません。</div>'; return; }
    var s = sel();
    var tabs = (subject === 'math' ? COURSES : FIELDS.map(function (f) { return [f, f]; }))
      .filter(function (t) { return all.some(function (d) { return tabOf(d) === t[0]; }); });
    if (!tabs.some(function (t) { return t[0] === s.tab; })) s.tab = tabs[0][0];
    var list = all.filter(function (d) { return tabOf(d) === s.tab; });
    if (!list.some(function (d) { return d.id === s.id; })) s.id = list[0].id;
    var def = JK.calcById[s.id] || JK.simById[s.id];

    var h = '<div class="calc"><div class="side"><div class="seg">' +
      tabs.map(function (t) { return '<button data-tab="' + esc(t[0]) + '"' + (t[0] === s.tab ? ' class="on"' : '') + '>' + esc(t[1]) + '</button>'; }).join('') + '</div>';
    var lastG = null;
    list.forEach(function (d) {
      var gname = subject === 'math' ? d.group : (JK.units[d.unit] ? JK.units[d.unit].name : '');
      if (gname !== lastG) { h += '<div class="side-g">' + esc(gname) + '</div>'; lastG = gname; }
      h += '<button class="side-i' + (d.id === s.id ? ' on' : '') + '" data-id="' + esc(d.id) + '">' + esc(d.title) + '</button>';
    });
    h += '</div><div class="calc-main" id="cMain"></div></div>';
    root.innerHTML = h;
    root.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { s.tab = b.getAttribute('data-tab'); s.id = ''; store.save(); render(); });
    });
    root.querySelectorAll('[data-id]').forEach(function (b) {
      b.addEventListener('click', function () { s.id = b.getAttribute('data-id'); store.save(); render(); });
    });
    renderMain(def);
  }

  function renderMain(def) {
    var main = root.querySelector('#cMain'), unit = JK.units[def.unit];
    var raw = rawStore[def.id] || (rawStore[def.id] = JK.inputs.defaults(def.inputs));
    var forms = def.form == null ? [] : (Array.isArray(def.form) ? def.form : [def.form]);
    var h = '<div class="row"><h3>' + esc(def.title) + '</h3>' + (unit ? '<span class="badge">' + esc(unit.name) + '</span>' : '') + '</div>' +
      (def.desc ? '<div class="small" style="color:var(--fg-2)">' + rich(def.desc) + '</div>' : '');
    if (forms.length) h += '<div class="form-tex">' + forms.map(function (f) { return JK.tex.render(f, true); }).join('') + '</div>';
    h += '<div class="in-grid">';
    def.inputs.forEach(function (inp) {
      var wide = inp.type === 'text' || inp.type === 'poly' || inp.type === 'list';
      h += '<div class="in-f' + (wide ? ' wide' : '') + '" data-f="' + esc(inp.key) + '"><label>' + rich(inp.label) + (inp.unit ? '<span class="u">[' + esc(inp.unit) + ']</span>' : '') + '</label>';
      if (inp.type === 'select') {
        h += '<select class="sel" data-k="' + esc(inp.key) + '">' + inp.options.map(function (o) {
          return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(raw[inp.key]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
        }).join('') + '</select>';
      } else {
        h += '<input class="inp mono" data-k="' + esc(inp.key) + '" value="' + esc(raw[inp.key]) + '" autocomplete="off" autocapitalize="off" spellcheck="false">';
      }
      if (inp.hint) h += '<div class="hint">' + rich(inp.hint) + '</div>';
      h += '</div>';
    });
    h += '</div>';
    if (def.examples && def.examples.length) {
      h += '<div class="filters"><span class="lbl">入力例</span>' + def.examples.map(function (ex, i) {
        return '<button class="chip" data-ex="' + i + '">' + esc(ex.label) + '</button>';
      }).join('') + '</div>';
    }
    var depth = depthOf(def), auto = !store.s.ui.depth;
    h += '<div class="actions" style="margin-top:6px"><button class="btn primary" id="cRun">計算する</button>' +
      '<div class="seg" id="cDepth"><button data-d=""' + (auto ? ' class="on"' : '') + '>自動</button>' +
      JK.steps.DEPTHS.map(function (d) { return '<button data-d="' + d + '"' + (!auto && d === depth ? ' class="on"' : '') + '>' + JK.steps.DEPTH_LABEL[d] + '</button>'; }).join('') + '</div>' +
      '<span class="dim small">解説の詳しさ' + (auto ? '（高' + esc(store.s.profile.grade) + ' → ' + JK.steps.DEPTH_LABEL[depth] + '）' : '') + '</span>' +
      (subject === 'physics' ? '<span class="grow"></span><button class="btn" id="cEx">この単元のランダム演習を解く</button>' : '') + '</div>' +
      '<div id="cOut"></div>';
    main.innerHTML = h;

    function readRaw() {
      main.querySelectorAll('[data-k]').forEach(function (el) { raw[el.getAttribute('data-k')] = el.value; });
    }
    function visibility(values) {
      def.inputs.forEach(function (inp) {
        var f = main.querySelector('[data-f="' + inp.key + '"]');
        if (f) f.classList.toggle('hidden', !JK.inputs.visible(inp, raw, values));
      });
    }
    function run(explicit) {
      readRaw();
      var out = main.querySelector('#cOut');
      var parsed = JK.inputs.parse(def.inputs, raw);
      visibility(parsed.values);
      if (parsed.error) { out.innerHTML = '<div class="note warn" style="margin-top:10px">⚠ ' + esc(parsed.error) + '</div>'; return; }
      var d = depthOf(def), res;
      try {
        res = def.compute(parsed.values, { grade: Number(store.s.profile.grade), depth: d });
      } catch (e) {
        out.innerHTML = '<div class="note warn" style="margin-top:10px">⚠ ' + esc(e instanceof JK.CalcError ? e.message : 'この入力では計算できませんでした（' + (e && e.message ? e.message : e) + '）') + '</div>';
        return;
      }
      var o = '<div class="results">' + (res.result || []).map(function (r) {
        return '<div class="res"><span>' + esc(r.label) + '</span>' + JK.tex.render(r.tex, false) + '</div>';
      }).join('') + '</div>';
      var intro = def.intro && (def.intro[d] || (d === 'easy' ? def.intro.easy : null));
      if (intro) o += '<div class="intro"><b class="tag">' + (d === 'easy' ? 'はじめての人へ' : (d === 'pro' ? '入試での使いどころ' : 'ポイント')) + '</b>' + rich(intro) + '</div>';
      o += '<div class="out-grid"><div><div class="sol-head"><h4>途中式と解説</h4></div>' + JK.steps.render(res.steps, d) + '</div>' +
        (res.fig ? '<div class="figbox">' + res.fig + '</div>' : '') + '</div>';
      out.innerHTML = o;
      if (explicit) {
        var now = Date.now();
        if (!lastLog[def.id] || now - lastLog[def.id] > 30000) {
          lastLog[def.id] = now;
          store.s.calcLog.push({ id: def.id, ts: now });
          if (store.s.calcLog.length > 2000) store.s.calcLog.splice(0, store.s.calcLog.length - 2000);
          store.save();
          store.emit('calc');
        }
      }
    }
    main.querySelectorAll('[data-k]').forEach(function (el) {
      el.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () { run(false); }, 350);
      });
      el.addEventListener('change', function () { run(false); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(true); });
    });
    main.querySelector('#cRun').addEventListener('click', function () { run(true); });
    main.querySelectorAll('[data-ex]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ex = def.examples[Number(b.getAttribute('data-ex'))];
        Object.keys(ex.v).forEach(function (k) {
          raw[k] = String(ex.v[k]);
          var el = main.querySelector('[data-k="' + k + '"]');
          if (el) el.value = raw[k];
        });
        run(true);
      });
    });
    main.querySelectorAll('#cDepth button').forEach(function (b) {
      b.addEventListener('click', function () { store.s.ui.depth = b.getAttribute('data-d'); store.save(); renderMain(def); });
    });
    var ex = main.querySelector('#cEx');
    if (ex) ex.addEventListener('click', function () { JK.app.openSim(def.id); });
    run(false);
  }

  JK.calcui = {
    mount: function (el, subj) { root = el; subject = subj; render(); },
    unmount: function () { clearTimeout(debounce); root = null; },
    refresh: function () { if (root) render(); }
  };
})();
