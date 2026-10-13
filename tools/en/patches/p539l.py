import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a language survives only as long as there are people who want to speak it → それを話したい人々がいる限りにおいてのみ、言語は生き残る（only + as long as。「ただ生き残る」にしない）
rep("""      for (let x = a + 2; x < b - 3; x++) if (isW(T[x], 'only') && T[x + 1] && /^(?:after|when|once|if)$/.test(T[x + 1].w || '')) { xOy = x; break; }
      if (xOy > 0) {
        const mOy = mark();
        const kwOy = T[xOy + 1].w;
        const scOy = sentence(xOy + 2, b, { sub: true });""",
    """      for (let x = a + 2; x < b - 3; x++) if (isW(T[x], 'only') && T[x + 1] && (/^(?:after|when|once|if)$/.test(T[x + 1].w || '') || seq(x + 1, ['as', 'long', 'as']))) { xOy = x; break; }
      if (xOy > 0) {
        const mOy = mark();
        const kwOy = seq(xOy + 1, ['as', 'long', 'as']) ? 'as long as' : T[xOy + 1].w;
        const scOy = sentence(xOy + (kwOy === 'as long as' ? 4 : 2), b, { sub: true });""")
rep("""          const leadOy = kwOy === 'if' ? scOy.out(Object.assign({ part: 'が', form: 'attr' }, sameOy ? { omit: scOy.subj.pron } : {})) + '場合に限り、' :""",
    """          const leadOy = kwOy === 'as long as' ? scOy.out(Object.assign({ part: 'が', form: 'attr' }, sameOy ? { omit: scOy.subj.pron } : {})) + '限りにおいてのみ、' : kwOy === 'if' ? scOy.out(Object.assign({ part: 'が', form: 'attr' }, sameOy ? { omit: scOy.subj.pron } : {})) + '場合に限り、' :""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
