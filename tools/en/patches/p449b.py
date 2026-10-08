import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        if (nSm && endSm > 0) { name('idiom'); return fin(P(nSm.ja.replace(/のかばん$/, 'の') + 'と' + degSm + '同じだ', 'da'), tail(endSm, lim, st, o, vg), 'SVC', []); }""",
    """        if (nSm && endSm > 0) { name('idiom'); return fin(P((/^(?:mine|yours|his|hers|ours|theirs)$/.test(T[kSm + 3].w || '') ? nSm.ja.replace(/の[^の]+$/, 'の') : nSm.ja) + 'と' + degSm + '同じだ', 'da'), tail(endSm, lim, st, o, vg), 'SVC', []); }""")

rep("""    ja = ja.replace(/見るのにわくわくする/g, '見ていてわくわくする');""",
    """    ja = ja.replace(/見るのにわくわくする/g, '見ていてわくわくする').replace(/規則的な(バスケットボール|サッカー|野球|テニス|試合|授業|価格|サイズ|料金|コーヒー|ルール)/g, '通常の$1');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
