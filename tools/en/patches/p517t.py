import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# she offered her seat / I found her bag → 自分の席・彼女のかばん（her + 限定詞のない単数の可算名詞は所有格。I gave her flowers は二重目的語のまま）
rep("""!(T[j + 1] && T[j + 1].k === 'w' && (adjC(T[j + 1]) || DET[T[j + 1].w] !== undefined)) && n.end - j === 2) { fail(m1); n = { ja: '彼女', end: j + 1, an: true, pron: 'her' }; }""",
    """!(T[j + 1] && T[j + 1].k === 'w' && (adjC(T[j + 1]) || DET[T[j + 1].w] !== undefined)) && n.end - j === 2 && !(T[j + 1] && T[j + 1].k === 'w' && !!cand(T[j + 1], '名', ['base']) && !cand(T[j + 1], '名', ['pl']) && !UNCOUNT[T[j + 1].w] && !/^(?:lunch|dinner|breakfast|coffee|tea|money|advice|information|homework|help|time|luck|permission|news|music|food|water|milk|cake|bread|candy|chocolate|love|support|attention|directions|a|some)$/.test(T[j + 1].w))) { fail(m1); n = { ja: '彼女', end: j + 1, an: true, pron: 'her' }; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
