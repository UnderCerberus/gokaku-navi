import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# studying the night before a test is useless（the night / day / week + before / after は前置詞。接続詞として節を区切らない）
rep("""    if (t.w === 'while' && j > 0 && T[j - 1].k === 'w' && /^(?:a|little|short|long|good|great)$/.test(T[j - 1].w)) return null;   // It took a while（名詞の while）""",
    """    if (t.w === 'while' && j > 0 && T[j - 1].k === 'w' && /^(?:a|little|short|long|good|great)$/.test(T[j - 1].w)) return null;   // It took a while（名詞の while）
    if (/^(?:before|after)$/.test(t.w) && j > 1 && isW(T[j - 2], 'the') && /^(?:night|day|morning|evening|week|month|year|weekend)$/.test(T[j - 1].w || '') && !(T[j + 1] && PRON[T[j + 1].w] && PRON[T[j + 1].w].sub)) return null;   // the night before a test""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
