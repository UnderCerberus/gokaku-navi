import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# we have a responsibility to reduce their suffering whenever we can → できるときはいつでも / I will help you when I can → できるときに
# （主語 + can / could だけの節（動詞の省略）は「できる」）
rep("""  function clause(a, b, o) {
    o = o || {};
    if (a >= b || --BUDGET < 0) return null;
    const m = mark();""",
    """  function clause(a, b, o) {
    o = o || {};
    if (a >= b || --BUDGET < 0) return null;
    const m = mark();
    if (o.sub && b - a === 2 && T[a].k === 'w' && PRON[T[a].w] && PRON[T[a].w].sub && /^(?:can|could)$/.test((T[a + 1] || {}).w || '')) {
      const sjE = np(a, a + 1, {});
      const vgE = { modal: '', semi: '', perfect: false, prog: false, passive: false, neg: false, past: T[a + 1].w === 'could', advs: [], lemma: 'can', e: null, idx: a + 1, end: a + 2 };
      const rE = sjE ? done(vgE, P('できる', 'v1'), newSt(vgE), b, 'SV', Object.assign({}, o, { subj: sjE }), [], { noStative: true }) : null;
      if (rE) return mkClause(sjE, rE, '');
      fail(m);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
