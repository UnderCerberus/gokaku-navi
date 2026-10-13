import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the view was the most beautiful one she had seen in Japan → 彼女が日本で見た最も美しいものだった / She is the tallest one in the class
# （be + the + 最上級 + one + 後置修飾は名詞句の補語。形容詞の補語として読んで one 以下を残さない）
rep("""        if (!(k2 + 1 < lim && nounC(T[k2 + 1]) && !PREP[T[k2 + 1].w]) && !(k2 + 2 < lim && T[k2 + 1].k === 'w' && /^(?:i|you|we|he|she|they)$/.test(T[k2 + 1].w))) { sup = true; k = k2; }""",
    """        if (!(k2 + 1 < lim && nounC(T[k2 + 1]) && !PREP[T[k2 + 1].w]) && !(k2 + 2 < lim && T[k2 + 1].k === 'w' && /^(?:i|you|we|he|she|they)$/.test(T[k2 + 1].w)) && !(k2 + 2 < lim && /^(?:one|ones)$/.test(T[k2 + 1].w || ''))) { sup = true; k = k2; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
