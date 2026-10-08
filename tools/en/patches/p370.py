import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# many people come to ski → スキーをしに来る（目的の不定詞にできる動作の動詞を増やす）
rep("""        if (vg.lemma === 'come' && it.shape === 'do' && v3.vg && !v3.neg && /^(?:see|visit|meet|help|pick|play|eat|talk|ask|watch|buy|borrow|bring|take|check|fetch|thank|say|swim|fish|shop|pray)$/.test(v3.vg.lemma)""",
    """        if (vg.lemma === 'come' && it.shape === 'do' && v3.vg && !v3.neg && /^(?:see|visit|meet|help|pick|play|eat|talk|ask|watch|buy|borrow|bring|take|check|fetch|thank|say|swim|fish|shop|pray|ski|skate|surf|climb|hike|camp|dance|sing|listen|enjoy|relax|rest|sightsee|study|learn|work|stay|live|join|pick)$/.test(v3.vg.lemma)""")
rep("""        if ((L === 'come' || L === 'go') && !inf.neg && inf.vg && /^(?:see|visit|meet|help|pick|play|eat|talk|ask|watch|buy|borrow|bring|take|check|fetch|thank|say|swim|fish|shop|pray|study|learn)$/.test(inf.vg.lemma)""",
    """        if ((L === 'come' || L === 'go') && !inf.neg && inf.vg && /^(?:see|visit|meet|help|pick|play|eat|talk|ask|watch|buy|borrow|bring|take|check|fetch|thank|say|swim|fish|shop|pray|study|learn|ski|skate|surf|climb|hike|camp|dance|sing|listen|enjoy|relax|rest|sightsee|work|stay|live|join)$/.test(inf.vg.lemma)""")

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');   // In winter, many people come to ski → 冬には、""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
