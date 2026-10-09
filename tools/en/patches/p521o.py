import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It is hard to start / the harder it becomes to start / It is time to begin → 始める（主語のない不定詞は人の動作。始まる にしない）
rep("""    if (/^(?:begin|start)$/.test(vg.lemma) && /^始まる$/.test(p.plain()) && anim && !vg.passive) { p = P('始める', 'v1');""",
    """    if (/^(?:begin|start)$/.test(vg.lemma) && /^始まる$/.test(p.plain()) && vg.nonfin && !sj && !vg.passive && T.some((x) => isW(x, 'it') || isW(x, 'time'))) p = P('始める', 'v1');   // It is hard to start → 始めるのは難しい
    if (/^(?:begin|start)$/.test(vg.lemma) && /^始まる$/.test(p.plain()) && anim && !vg.passive) { p = P('始める', 'v1');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
