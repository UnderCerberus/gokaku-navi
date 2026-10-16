import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I found a book worth reading → 読む価値のある本 / looking for things worth photographing → 撮影する価値のあるもの
# （名詞 + worth のあとの -ing は、名詞にもなる reading でも句末なら動名詞として読む。「本にの価値がある読書」にしない）
rep("""      if (isW(t, 'worth') && j + 1 < lim && !node.pron && ingVerb(j + 1, lim)) {""",
    """      if (isW(t, 'worth') && j + 1 < lim && !node.pron && (ingVerb(j + 1, lim) || (T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && (j + 2 >= lim || T[j + 2].k === 'p' || !!PREP[T[j + 2].w] || /^(?:and|or|but)$/.test(T[j + 2].w))))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
