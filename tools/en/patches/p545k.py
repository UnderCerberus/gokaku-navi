import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the technology will become cheaper as it improves → 科学技術は、進歩するにつれてより安くなる（後ろの as 節の主語が代名詞なら、主節の主語を先に出す。「それが良くなるにつれて、科学技術が」にしない）
rep("""|long before|long after|even before|as soon as)$/.test(key) && (sc.subj.pron === 'they'""",
    """|long before|long after|even before|as soon as|as)$/.test(key) && (sc.subj.pron === 'they'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
