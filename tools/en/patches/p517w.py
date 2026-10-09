import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# found some customs difficult to understand → 一部の習慣を理解するのが難しいと感じた（some を落とすと「習慣全般」になる）
rep("""          if (infF && gF.used) { name('tough'); return done(vg, P(vpJoin(infF, 'dict') + 'のが' + f2.pred.s + 'と感じる', 'v1'),""",
    """          if (infF && gF.used) { name('tough'); return done(vg, P((ob.det === 'some' && !/^(?:一部の|いくつかの)/.test(vpJoin(infF, 'dict')) ? '一部の' : '') + vpJoin(infF, 'dict') + 'のが' + f2.pred.s + 'と感じる', 'v1'),""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
