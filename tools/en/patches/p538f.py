import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it is better than the bread we buy at the store → 私たちが店で買うパンより良い（than + 名詞 + 主語の代名詞 + 動詞 は接触節の関係詞節）
rep("""            if (n && n.end < lim && T[n.end].k === 'w' && /^(?:who|which|that|whose)$/.test(T[n.end].w)) { const n2 = np(e + 1, lim, {}); if (n2) n = n2; }
            if (n && n.end < lim && T[n.end].k === 'w' && /^(?:on|in|at|of|from|inside|with)$/.test(T[n.end].w)) {""",
    """            if (n && n.end < lim && T[n.end].k === 'w' && /^(?:who|which|that|whose)$/.test(T[n.end].w)) { const n2 = np(e + 1, lim, {}); if (n2) n = n2; }
            if (n && (!n.pron || /^(?:one|ones|anything|anyone|everything|everyone|something|someone)$/.test(n.pron)) && n.end + 1 < lim && T[n.end].k === 'w' && PRON[T[n.end].w] && PRON[T[n.end].w].sub && T[n.end + 1].k === 'w' && (!!vc(T[n.end + 1], ['base', '3sg', 'past']) || !!MODAL[T[n.end + 1].w])) { const mCt = mark(); const nCt = np(e + 1, lim, {}); if (nCt && nCt.end > n.end) n = nCt; else fail(mCt); }
            if (n && n.end < lim && T[n.end].k === 'w' && /^(?:on|in|at|of|from|inside|with)$/.test(T[n.end].w)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
