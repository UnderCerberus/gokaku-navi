import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Storms, lack of food, and tall buildings that reflect the sky all take their toll（並列の主語のあとの all / both → みな。関係詞節の目的語にしない）
rep("""      if (s - 1 > a && T[s - 1].k === 'w' && /^(?:all|both|each)$/.test(T[s - 1].w) && (/^(?:we|you|they)$/.test(T[s - 2].w) || (T[s - 2].k === 'w' && (!!cand(T[s - 2], '名', ['pl']) || /^(?:people|children|parents)$/.test(T[s - 2].w)) && !PRON[T[s - 2].w] && T[s] && T[s].k === 'w' && (!!vc(T[s], ['base', 'past']) || !!MODAL[T[s].w] || /^(?:are|were|have|do|did)$/.test(T[s].w))))) { fq = T[s - 1].w; s--; }""",
    """      if (s - 1 > a && T[s - 1].k === 'w' && /^(?:all|both|each)$/.test(T[s - 1].w) && (/^(?:we|you|they)$/.test(T[s - 2].w) || (((T[s - 2].k === 'w' && (!!cand(T[s - 2], '名', ['pl']) || /^(?:people|children|parents)$/.test(T[s - 2].w)) && !PRON[T[s - 2].w]) || (T[s - 1].w !== 'each' && T.slice(a, s - 1).some((x) => isW(x, 'and')))) && T[s] && T[s].k === 'w' && (!!vc(T[s], ['base', 'past']) || !!MODAL[T[s].w] || /^(?:are|were|have|do|did)$/.test(T[s].w))))) { fq = T[s - 1].w; s--; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
