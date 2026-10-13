import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# my hands were shaking as I waited for my turn → 順番を待っていたとき、手は震えていた（目的語つきの「〜を待つ・〜を歩く」も時の as。「待ったので」にしない）
rep("""(sc.prog || /^(?:歩く|走る|運転する""",
    """(sc.prog || /(?:^|[をにでと])(?:歩く|走る|運転する""")

# which can then be used for more difficult tasks → その後より難しい仕事に使える / We will then discuss the results → その後結果を話し合う
# （助動詞のすぐあとの then は「その後」。「そのとき」にしない）
rep("""      const a = (!PREP[t.w] || ADV[t.w]) && !BE[t.w] && !HAVE[t.w] ? advC(t) : null;""",
    """      const a = t.w === 'then' && k > 0 && T[k - 1].k === 'w' && !!MODAL[T[k - 1].w] ? { ja: 'その後', kind: 't', e: null } : ((!PREP[t.w] || ADV[t.w]) && !BE[t.w] && !HAVE[t.w] ? advC(t) : null);""")

# can then be used（法助動詞と be の間の then も「その後」）
rep("""        while (k < lim && T[k].k === 'w' && T[k].w !== 'be' && !PREP[T[k].w] && advC(T[k]) && !vc(T[k], ['base'])) { advs.push({ a: advC(T[k]), w: T[k].w }); k++; }""",
    """        while (k < lim && T[k].k === 'w' && T[k].w !== 'be' && !PREP[T[k].w] && advC(T[k]) && !vc(T[k], ['base'])) { advs.push({ a: T[k].w === 'then' && k === j ? { ja: 'その後', kind: 't', e: null } : advC(T[k]), w: T[k].w }); k++; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
