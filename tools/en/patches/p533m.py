import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# birds stop to rest and feed / The birds feed in the morning → えさを食べる（目的語のない feed。食べ物を与える にしない）
rep("""    if (vg.lemma === 'suffer' && !vg.passive && !o.hasObj && sj && !anim""",
    """    if (vg.lemma === 'feed' && !vg.passive && !o.hasObj && /^食べ物を与える$/.test(p.plain())) p = P('えさを食べる', 'v1');
    if (vg.lemma === 'suffer' && !vg.passive && !o.hasObj && sj && !anim""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
