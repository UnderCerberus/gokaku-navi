import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He told the students they could go home → 学生たちに帰宅してよいと言った
# （「主語 + can / could」だけの接触節は、助動詞のあとに動詞の原形が続けば省略節ではない。「できる学生たち」にしない）
rep("""    if (/^(?:i|you|he|she|we|they|it)$/.test(w) && j + 1 < e && T[j + 1] && /^(?:can|could)$/.test(T[j + 1].w || '') && ends.indexOf(j + 2) >= 0) { e = j + 2; return fin('できる', 'relative'); }""",
    """    if (/^(?:i|you|he|she|we|they|it)$/.test(w) && j + 1 < e && T[j + 1] && /^(?:can|could)$/.test(T[j + 1].w || '') && ends.indexOf(j + 2) >= 0 && !(T[j + 2] && T[j + 2].k === 'w' && (!!vc(T[j + 2], ['base']) || isW(T[j + 2], 'be') || isW(T[j + 2], 'not') || isW(T[j + 2], 'never')))) { e = j + 2; return fin('できる', 'relative'); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
