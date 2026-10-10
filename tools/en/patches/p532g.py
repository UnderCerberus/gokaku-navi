import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the quality of their work usually suffers → 質が落ちる（物の主語 + suffer（目的語・from なし）→ 悪くなる。苦しむ にしない）
rep("""    if (vg.lemma === 'commute' && /^通勤する$/.test(p.plain())""",
    """    if (vg.lemma === 'suffer' && !vg.passive && !o.hasObj && sj && !anim && !sj.pron && /(?:^| )(?:quality|qualities|grade|grades|score|scores|performance|result|results|health|business|businesses|economy|economies|work|sleep|studies|relationship|relationships|sales|reputation|crops|harvest|environment|safety|education|learning|productivity|concentration)$/.test(sj.head || '') && /^苦しむ$/.test(p.plain()) && !T.some((x, q) => q > vg.idx && isW(x, 'from'))) p = P(/(?:^| )(?:quality|qualities|grade|grades|score|scores|performance|result|results)$/.test(sj.head || '') ? '落ちる' : '悪くなる', /(?:^| )(?:quality|qualities|grade|grades|score|scores|performance|result|results)$/.test(sj.head || '') ? 'v1' : 'v5');
    if (vg.lemma === 'commute' && /^通勤する$/.test(p.plain())""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
