import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# A number of communities are working hard to bring … → 一生懸命に取り組んでいる（人の集団の主語・目的の「〜ために」では work を「機能する」にしない）
rep("""    if (sj && !anim && vg.lemma === 'work' && p.plain() === '働く' && (st.other.some((x) => /(?:どこでも|どこかに|で|に)$/.test(x)) || st.manner.some((x) => /どこでも/.test(x)))) p = P('機能する', 'suru');""",
    """    if (sj && !anim && vg.lemma === 'work' && p.plain() === '働く' && !ORG[sj.head || ''] && !/(?:^| )(?:communities|groups|teams|families|governments|companies|organizations|organisations|schools|nations|countries|cities|towns|villages|unions|clubs|charities|businesses|agencies|departments)$/.test(sj.head || '') && (st.other.some((x) => /(?:どこでも|どこかに|で|に)$/.test(x) && !/(?:ために|ように)$/.test(x)) || st.manner.some((x) => /どこでも/.test(x)))) p = P('機能する', 'suru');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
