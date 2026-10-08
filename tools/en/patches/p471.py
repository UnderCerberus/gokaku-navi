import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'across the country': '全国で', 'across the world': '世界中で', 'across the nation': '全国で', 'all over the country': '全国で', """)

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/([0-9０-９]+)年でその最も(高い|低い)水準/g, '過去$1年で最も$2水準').replace(/その最も(高い|低い)水準/g, '最も$1水準').replace(/水準に増え/g, '水準に上昇し').replace(/私的な寄付者/g, '個人の寄付者');   // has risen to its highest level in ten years → 過去10年で最も高い水準に上昇した / private donors → 個人の寄付者
    if (tokens.some((x) => x.w === 'unemployment') && tokens.some((x) => /^(?:level|rate|risen|rose|fell|fallen|high|highest|low|lowest)$/.test(x.w || ''))) ja = ja.replace(/失業は/g, '失業率は');   // Unemployment has risen → 失業率は上昇した
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
