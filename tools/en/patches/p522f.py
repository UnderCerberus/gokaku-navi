import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The book a friend gave me is old / The language a child hears matters（接触節の主語が a / an / every + 名詞でもよい）
rep("""(/^(?:the|my|your|his|her|our|their|its|most|many|some|these|those|people|everyone|everybody|someone|somebody|nobody|anyone)$/.test(w)""",
    """(/^(?:the|a|an|every|each|my|your|his|her|our|their|its|most|many|some|these|those|people|everyone|everybody|someone|somebody|nobody|anyone)$/.test(w)""")
# The people I work with are kind → 私が一緒に働く人々（関係詞の先行詞が人で、前に出た with の目的語 → 一緒に）
rep("""        o.gap.used = true;
        if (o.gap.rel) return { ja: '', adn: '', end: j, kind: 'other', prep: key, obj: null };""",
    """        o.gap.used = true;
        if (o.gap.rel && key === 'with' && !(i > 0 && T[i - 1].k === 'w' && /^(?:talk|talks|talked|talking|speak|speaks|spoke|spoken|chat|chatted|argue|argued|fight|fought|agree|agreed|disagree|disagreed|deal|dealt|communicate|communicated|compete|competed|meet|met|consult|consulted|negotiate|negotiated|compare|compared|interact|interacted|fall|fell|fallen|in|love)$/.test(T[i - 1].w)) && /^(?:people|person|man|men|woman|women|friend|friends|colleague|colleagues|child|children|boy|boys|girl|girls|student|students|teacher|teachers|partner|partners|team|guy|guys|neighbor|neighbors|classmate|classmates|coworker|coworkers|family|families|someone|one|ones)$/.test(o.gap.ante || '')) return { ja: '一緒に', adn: '一緒の', end: j, kind: 'other', prep: key, obj: null };   // the people I work with → 私が一緒に働く人々
        if (o.gap.rel) return { ja: '', adn: '', end: j, kind: 'other', prep: key, obj: null };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
