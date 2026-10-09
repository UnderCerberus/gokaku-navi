import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …, but only a small portion of it is fresh water → 右の主語（そのごく一部だけ）は代名詞そのものでないので省かない
rep("""    const pR = right.subj && right.subj.pron;
    const pron2 = !pron && left.subj""",
    """    const pR = right.subj && right.subj.pron && /^(?:それ|それら|彼ら|彼|彼女|彼女ら)$/.test(right.subj.ja || '') ? right.subj.pron : null;
    const pron2 = !pron && left.subj""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
