import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# When should we give them to her? → それらを彼女に（give / send / hand / show + them + to 人: them は渡す物）
rep("""    const needAn = isW(T[i], 'their') && !!T[i + 1] && PERSON_POSS.test(T[i + 1].w || '');   // far from their families → 人の名詞を探す""",
    """    if (T[i].w === 'them' && i > 0 && T[i - 1].k === 'w' && /^(?:give|gives|gave|given|giving|send|sends|sent|sending|hand|hands|handed|show|shows|showed|shown|lend|lends|lent|bring|brings|brought|mail|mails|mailed|pass|passes|passed|return|returns|returned)$/.test(T[i - 1].w) && isW(T[i + 1], 'to') && T[i + 2] && T[i + 2].k === 'w' && (!!(PRON[T[i + 2].w] && PRON[T[i + 2].w].an) || /^(?:my|your|his|her|our|their|the|a|an)$/.test(T[i + 2].w))) return 'inan';
    const needAn = isW(T[i], 'their') && !!T[i + 1] && PERSON_POSS.test(T[i + 1].w || '');   // far from their families → 人の名詞を探す""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
