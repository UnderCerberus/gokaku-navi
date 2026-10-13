import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Halfway through the speech, I forgot one sentence → スピーチの途中で、…（文頭の halfway + 前置詞句も文頭の前置詞句として読む）
rep("""      if (k < 0 && T[a].k === 'w' && (PREP[T[a].w] || mprepAt(a) || seq(a, ['rather', 'than']) || seq(a, ['all', 'through'])) && T[a].w !== 'to') {""",
    """      if (k < 0 && T[a].k === 'w' && (PREP[T[a].w] || mprepAt(a) || seq(a, ['rather', 'than']) || seq(a, ['all', 'through']) || (T[a].w === 'halfway' && /^(?:to|up|down|through|across|along|into|around)$/.test((T[a + 1] || {}).w || ''))) && T[a].w !== 'to') {""")

# Halfway through the movie, he fell asleep → 映画の途中で、（through の halfway は時の句。文頭で「途中では、」にしない）
rep("""        return { ja: wHw + (o.stative && /^(?:live|settle|be)$/.test(o.lemma || '') ? 'に' : 'で'), adn: wHw + 'の', kind: 'place', end: pHw.end, prep: 'halfway', obj: pHw.obj };""",
    """        return { ja: wHw + (o.stative && /^(?:live|settle|be)$/.test(o.lemma || '') ? 'に' : 'で'), adn: wHw + 'の', kind: T[i + 1].w === 'through' ? 'time' : 'place', end: pHw.end, prep: 'halfway', obj: pHw.obj };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
