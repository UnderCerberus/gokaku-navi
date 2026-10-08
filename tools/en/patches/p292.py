import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 前置詞が後ろに残る不定詞（friends to play with / a house to live in / nothing to write with）
rep("""    // 不定詞の形容詞的用法（something to drink / time to study）
    if (w === 'to' && j + 1 < e && vc(T[j + 1], ['base']) &&""",
    """    // 前置詞が後ろに残る不定詞: friends to play with → 一緒に遊ぶ友達 / a house to live in → 住む家 / nothing to write with → 書くもの
    if (w === 'to' && j + 2 < e && vc(T[j + 1], ['base']) && !node.time && !node.dur && !node.clause) {
      let pS = -1;
      for (let x = j + 2; x < e && x < j + 9; x++) {
        if (T[x].k === 'w' && /^(?:with|in|on|to|about|for|at|from|into|under)$/.test(T[x].w) && (x + 1 >= e || T[x + 1].k === 'p' || /^(?:and|but|or|because|when|if|so|than)$/.test(T[x + 1].w || ''))) { pS = x; break; }
        if (T[x].k === 'p' || (T[x].k === 'w' && /^(?:and|but|or|because|when|if|that|which|who)$/.test(T[x].w))) break;
      }
      if (pS > j + 1) {
        const mPs = mark();
        const infPs = vpNonfin(j + 1, pS, 'base', {});
        if (infPs && infPs.end === pS && verbal(infPs.pred)) {
          const prepPs = T[pS].w;
          const anPs = !!node.an || !!(node.pron && /one|body/.test(node.pron));
          const sPs = (prepPs === 'with' && anPs ? '一緒に' : '') + vpJoin(infPs, 'dict') + (prepPs === 'with' && !anPs && !node.pron ? 'ための' : '');
          name('inf-adj');
          if (node.pron) return Object.assign({}, node, { ja: node.ja + sPs + (/one|body/.test(node.pron) ? '人' : (prepPs === 'about' ? 'こと' : 'もの')), end: pS + 1, bare: false, infS: sPs, infMono: prepPs !== 'about' });
          return Object.assign({}, node, { ja: sPs + node.ja, end: pS + 1 });
        }
        fail(mPs);
      }
    }
    // 不定詞の形容詞的用法（something to drink / time to study）
    if (w === 'to' && j + 1 < e && vc(T[j + 1], ['base']) &&""")

# time to play → 遊ぶ時間（time / chance などは不定詞の目的語にならない → まず目的語の穴なしで読む）
rep("""      const gap2 = { type: 'np', rel: true, used: false, ante: node.head };
      const inf = vpNonfin(j + 1, e, 'base', { gap: gap2 });""",
    """      const gap2 = { type: 'np', rel: true, used: false, ante: node.head };
      const noGap2 = /^(?:time|chance|opportunity|reason|right|courage|energy|ability|effort|attempt|decision|plan|desire|wish|promise|tendency|power|permission)$/.test(node.head || '') && !node.pron;
      const inf0 = noGap2 ? vpNonfin(j + 1, e, 'base', {}) : null;
      if (noGap2 && !(inf0 && verbal(inf0.pred))) fail(m);
      const inf = inf0 && verbal(inf0.pred) ? inf0 : vpNonfin(j + 1, e, 'base', { gap: gap2 });""")

rep("""      return done(vg, P('ある', 'aru'), st, j, 'SVO', o, [objs[0].infS + 'ことが何も'], { noStative: true });""",
    """      return done(vg, P('ある', 'aru'), st, j, 'SVO', o, [objs[0].infS + (objs[0].infMono ? 'ものが何も' : 'ことが何も')], { noStative: true });""")
rep("""      return mkClause(null, done(vg, P('何もない', 'i'), st, end, 'SV', o, [n.infS + 'ことは'], { noStative: true }), '');""",
    """      return mkClause(null, done(vg, P('何もない', 'i'), st, end, 'SV', o, [n.infS + (n.infMono ? 'ものは' : 'ことは')], { noStative: true }), '');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
