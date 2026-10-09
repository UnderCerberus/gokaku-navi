import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Children who are read to by their parents → 親に本を読んでもらう子ども（前置詞が残る受け身 read to）
rep("""    if (vg.passive && L === 'do' && !objs.length && o.subj && !st.agent && /^(?:more|something|much|this|that|it|everything|anything|nothing)$/.test(o.subj.pron || '')) {""",
    """    if (vg.passive && L === 'read' && !objs.length && isW(T[j], 'to') && (j + 1 >= lim || T[j + 1].k === 'p' || (T[j + 1].k === 'w' && (PREP[T[j + 1].w] || /^(?:every|often|regularly)$/.test(T[j + 1].w))))) {
      name('passive');
      const eRt = tail(j + 1, lim, st, o, vg);
      if (st.agent) st.agent = st.agent.replace(/(?:によって|から)$/, 'に');
      return done(Object.assign({}, vg, { passive: false }), P('本を読んでもらう', 'v5'), st, eRt, 'SV', o, [], { noStative: true });
    }
    if (vg.passive && L === 'do' && !objs.length && o.subj && !st.agent && /^(?:more|something|much|this|that|it|everything|anything|nothing)$/.test(o.subj.pron || '')) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
