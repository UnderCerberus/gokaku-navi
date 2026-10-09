import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# as many studies have shown / As the data shows → 多くの研究が示したように（研究・データなどが主語の show は「示す」）
rep("""    if (vg.lemma === 'show' && vg.passive && /^見せる$/.test(p.plain())) p = P('示す', 'v5');""",
    """    if (vg.lemma === 'show' && vg.passive && /^見せる$/.test(p.plain())) p = P('示す', 'v5');
    if (vg.lemma === 'show' && !vg.passive && sj && !anim && /^見せる$/.test(p.plain()) && /(?:^| )(?:study|studies|research|survey|surveys|data|evidence|experiment|experiments|report|reports|result|results|graph|graphs|chart|charts|table|tables|figure|figures|history|experience|analysis|statistics|record|records|test|tests|poll|polls|map|maps)$/.test(sj.head || '')) p = P('示す', 'v5');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
