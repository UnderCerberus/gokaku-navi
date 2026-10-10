import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# understanding why we delay / learning how plants grow（名詞にもなる -ing + 疑問詞節は、疑問詞節をとる動詞なら動名詞）
rep("""    if (t.w === 'saying' && nx && nx.k === 'w' && !PREP[nx.w]) return true;""",
    """    if (t.w === 'saying' && nx && nx.k === 'w' && !PREP[nx.w]) return true;
    if (nx && nx.k === 'w' && (!!WH[nx.w] || nx.w === 'whether') && !!WHV[(vc(t, ['ing']) || {}).lemma] && j + 2 < lim) return true;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
