import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the team works together → チームが協力する（人の集団の主語は「作用する」にしない）
rep("""    if (sj && !anim && vg.lemma === 'work' && p.plain() === '働く' && st.manner.some((x) => /一緒に|共に/.test(x))) p = P('作用する', 'suru');""",
    """    if (sj && !anim && vg.lemma === 'work' && p.plain() === '働く' && st.manner.some((x) => /一緒に|共に/.test(x)) && /^(?:team|teams|group|groups|class|classes|family|families|staff|crew|committee|members|department|departments|community|communities|nation|nations|country|countries)$/.test(plainSubj(sj).head || '')) { p = P('協力する', 'suru'); st.manner = st.manner.filter((x) => !/^(?:一緒に|共に)$/.test(x)); }   // the team works together → チームが協力する
    else if (sj && !anim && vg.lemma === 'work' && p.plain() === '働く' && st.manner.some((x) => /一緒に|共に/.test(x))) p = P('作用する', 'suru');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
