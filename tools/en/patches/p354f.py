import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""    const s = en.jp.senses(r.c.e.ja)[0];
    if (s && !s.tr) return true;                       // living など自動詞""",
    """    // Living in the countryside is relaxing / This place is relaxing（人でない主語 + PART_ADJ で節が終わる → 形容詞）
    if (PART_ADJ[t.w] && (r.end >= lim || T[r.end].k === 'p') && r.idx > 0 && !T.slice(0, r.idx).some((x) => x.k === 'w' && ((PRON[x.w] && PRON[x.w].sub && x.w !== 'it' && x.w !== 'this' && x.w !== 'that') || (!!nounC(x) && isPerson(nounC(x)))))) return false;
    const s = en.jp.senses(r.c.e.ja)[0];
    if (s && !s.tr) return true;                       // living など自動詞""")
rep("""    ja = ja.replace(/(彼ら|彼|彼女|私たち)が\1の/g, '$1が自分の')""",
    """    ja = ja.replace(/(彼ら|彼|彼女|私たち)が\1の/g, '$1が')""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
