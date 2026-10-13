import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# When a community moves to a city → 地域社会が都市に移り住むと（人の集団の主語 + move to は「移り住む」。「動く」にしない）
rep("""    if (vg.lemma === 'move' && p.plain() === '動く' && anim && st.other.some((x) => /(?:都市|町|家|国|村""",
    """    if (vg.lemma === 'move' && p.plain() === '動く' && !vg.passive && !o.hasObj && sj && !sj.pron && /(?:^| )(?:community|communities|tribe|tribes|population|populations|villagers|residents|immigrants|settlers|farmers|group|groups|family|families)$/.test(sj.head || '') && st.other.some((x) => /に$/.test(x) && !/(?:ために|ように)$/.test(x))) p = P('移り住む', 'v5');
    if (vg.lemma === 'move' && p.plain() === '動く' && anim && st.other.some((x) => /(?:都市|町|家|国|村""")

# speaking the dominant language brings better jobs and higher status → より良い仕事と高い地位をもたらす（仕事・地位・お金などの bring は「もたらす」）
rep("""      else if (L === 'bring' && !vg.passive && /(?:^| )(?:problem|problems|benefit|benefits|change|changes|happiness|""",
    """      else if (L === 'bring' && !vg.passive && /(?:^| )(?:job|jobs|status|income|revenue|money|employment|fame|recognition|respect|prestige|power|attention|profit|profits|wages|salary|salaries|problem|problems|benefit|benefits|change|changes|happiness|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
