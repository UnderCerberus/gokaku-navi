import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Tastes differ from one person to another → 人によって異なる（differ / vary + from one X to another は熟語 differ from ~ にしない）
rep("""  function vpIdiom(vg, i, lim, st, o) {
    const list = idiomIndex().verb[vg.lemma];
    if (!list) return null;""",
    """  function vpIdiom(vg, i, lim, st, o) {
    const list = idiomIndex().verb[vg.lemma];
    if (!list) return null;
    if (/^(?:differ|vary)$/.test(vg.lemma) && seq(i, ['from', 'one']) && T.slice(i + 3, Math.min(lim, i + 7)).some((x, q) => isW(x, 'to') && isW(T[i + 4 + q], 'another'))) return null;""")

# Prices vary from one store to another → 店によって / passed from one person to another → 人から人へ
rep("""const nm1 = obj.ja.replace(/^(?:1(?:つ|人|冊|か国)の|ある)/, ''); return { ja: 'ある' + nm1 + 'から別の' + nm1 + 'へ', adn: 'ある' + nm1 + 'から別の' + nm1 + 'への', end: nB.end, kind: 'place', prep: key, obj: obj }; }""",
    """const nm1 = obj.ja.replace(/^(?:1(?:つ|人|冊|か国)の|ある)/, ''); if (T.some((x) => x.k === 'w' && /^(?:vary|varies|varied|varying|differ|differs|differed|differing)$/.test(x.w))) return { ja: nm1 + 'によって', adn: nm1 + 'による', end: nB.end, kind: 'other', prep: key, obj: obj }; const fr1 = nm1 === '人' ? '人から人へ' : 'ある' + nm1 + 'から別の' + nm1 + 'へ'; return { ja: fr1, adn: fr1 + 'の', end: nB.end, kind: 'place', prep: key, obj: obj }; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
