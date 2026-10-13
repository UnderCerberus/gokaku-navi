import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Start with something small → 小さいものから始めなさい（命令文の begin / start with は人が主語。「始まりなさい」にしない）
rep("""    if (/^(?:begin|start)$/.test(vg.lemma) && /.から始まる$/.test(p.plain()) && anim && !vg.passive) p = P(p.plain().replace(/始まる$/, '始める'), 'v1');""",
    """    if (/^(?:begin|start)$/.test(vg.lemma) && /.から始まる$/.test(p.plain()) && (anim || (vg.imp && !sj)) && !vg.passive) p = P(p.plain().replace(/始まる$/, '始める'), 'v1');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
