import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I found an umbrella left on a bench → ベンチに置き忘れられた傘を見つけた（物の名詞 + left / abandoned / parked + 場所は過去分詞の修飾。that のない節「傘が出発した」にしない）
rep("""(/^(?:recognize|identify)$/.test(L) && !!cand(T[lim - 1], '名', ['pl'])) || """,
    """(/^(?:recognize|identify)$/.test(L) && !!cand(T[lim - 1], '名', ['pl'])) || (/^(?:find|see|notice|discover)$/.test(L) && !nFo.an && !/^(?:bus|buses|train|trains|plane|planes|ship|ships|boat|boats|car|cars|flight|flights|ferry|taxi)$/.test(nFo.head || '') && T.slice(i + 1, lim).some((x, q) => /^(?:left|abandoned|parked)$/.test(x.w || '') && T[i + q].k === 'w' && !!nounC(T[i + q]) && !PRON[T[i + q].w] && (i + q + 2 >= lim || T[i + q + 2].k !== 'w' || !!PREP[T[i + q + 2].w] || /^(?:behind|outside|inside|unattended|alone|there|here)$/.test(T[i + q + 2].w)))) || """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
