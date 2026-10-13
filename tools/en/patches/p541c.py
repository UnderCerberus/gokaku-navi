import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the small things we do every day → 私たちが毎日する小さなこと / the things she said → 彼女が言ったこと（関係詞節が do / say / learn … の things は「こと」。「小さい物」にしない）
rep("""        : (node.head === 'way' && /道$/.test(node.ja) && !/^(?:to|home|back|out|up|down|in)$/.test(t.w) ? node.ja.replace(/道$/, '方法') : node.ja))));""",
    """        : (/^(?:thing|things)$/.test(node.head || '') && /物$/.test(node.ja || '') && T.slice(node.end, Math.min(lim, node.end + 5)).some((x, q) => /^(?:do|did|does|done|say|said|says|learn|learned|learnt|hear|heard|think|thought|know|knew|teach|taught|tell|told|try|tried|experience|experienced|enjoy|enjoyed)$/.test(x.w || '') && !(/^(?:do|did|does)$/.test(x.w) && T[node.end + q + 1] && T[node.end + q + 1].k === 'w' && (/^(?:not|n't)$/.test(T[node.end + q + 1].w) || (!!vc(T[node.end + q + 1], ['base']) && !nounC(T[node.end + q + 1]))))) ? node.ja.replace(/物$/, 'こと')
        : (node.head === 'way' && /道$/.test(node.ja) && !/^(?:to|home|back|out|up|down|in)$/.test(t.w) ? node.ja.replace(/道$/, '方法') : node.ja)))));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
