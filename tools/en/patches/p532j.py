import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it is easier to keep going / We kept going until midnight → やり続ける（行き先のない keep going。kept going to the gym は 行き続ける のまま）
rep("""        if (GERV[L]) {
          const fullG = GERV[L](p1, st);""",
    """        if (L === 'keep' && isW(T[i], 'going') && g.end === i + 1 && !g.parts.length && !(g.end < lim && T[g.end].k === 'w' && /^(?:to|into|back|home|out|up|down|there|abroad|away|on|in|around|through|across|along|toward|towards)$/.test(T[g.end].w))) return done(vg, P('やり続ける', 'v1'), st, g.end, 'SV', o, [], { noStative: true });
        if (GERV[L]) {
          const fullG = GERV[L](p1, st);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
