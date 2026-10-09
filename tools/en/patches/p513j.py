import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# as serious a threat as … → 深刻な（共起の表 ADJN を as … as の名詞句にも使う）
rep("""        if (cAa) { pick(i + 1, aAa.e); name('as-as'); return { ja: cAa.ja + 'と同じくらい' + en.jp.adj(aAa.e.ja).attr + nAa.ja, end: cAa.end, head: nAa.head, an: nAa.an }; }""",
    """        const hAa = ADJN[aAa.lemma] && nAa.head ? ADJN[aAa.lemma].find((y) => y.re.test(nAa.head)) : null;
        if (cAa) { pick(i + 1, aAa.e); name('as-as'); return { ja: cAa.ja + 'と同じくらい' + (hAa ? hAa.ja : en.jp.adj(aAa.e.ja).attr) + nAa.ja, end: cAa.end, head: nAa.head, an: nAa.an }; }""")

# The village can only be reached by a narrow road → 狭い道でしか行けない
rep("""    if (vg.passive && L === 'read' && !objs.length && isW(T[j], 'to')""",
    """    if (vg.passive && L === 'reach' && !objs.length && (vg.advs || []).some((x) => x.w === 'only') && isW(T[j], 'by') && j + 1 < lim) {
      const mRo = mark();
      const nRo = np(j + 1, lim, { noRel: true });
      if (nRo && nRo.end === lim) { name('passive'); vg.advs = vg.advs.filter((x) => x.w !== 'only'); return done(Object.assign({}, vg, { passive: false, modal: '' }), P(nRo.ja + 'でしか行けない', 'i'), st, lim, 'SV', o, [], { noStative: true }); }
      fail(mRo);
    }
    if (vg.passive && L === 'read' && !objs.length && isW(T[j], 'to')""")

# learn (valuable) lessons → 教訓（複数形と関係詞つきも）
rep("""      if (oh === 'lesson' && /^(?:teach|learn|draw|offer|provide|hold|contain|carry)$/.test(L) && /授業$/.test(objs[0].ja)) objs[0] = Object.assign({}, objs[0], { ja: objs[0].ja.replace(/授業$/, '教訓') });""",
    """      if (/^lessons?$/.test(oh) && /^(?:teach|learn|draw|offer|provide|hold|contain|carry)$/.test(L) && /授業$/.test(objs[0].ja) && (oh === 'lesson' || L !== 'teach')) objs[0] = Object.assign({}, objs[0], { ja: objs[0].ja.replace(/授業$/, '教訓') });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
