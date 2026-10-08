import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I have another test tomorrow → 明日また試験がある（another / each などの限定詞 + 名詞は使役の「人 + 原形」にしない）
rep("""    if (L === 'have' && ob.pron && /^(?:this|that|these|those)$/.test(ob.pron) && j === i + 1 && tj && tj.k === 'w' && !!nounC(tj) && !PRON[tj.w] && (j + 1 >= lim || T[j + 1].k === 'p' || (T[j + 1].k === 'w' && (!!PREP[T[j + 1].w] || /^(?:now|yet|already)$/.test(T[j + 1].w))))) return fail(m);""",
    """    if (L === 'have' && ob.pron && /^(?:this|that|these|those)$/.test(ob.pron) && j === i + 1 && tj && tj.k === 'w' && !!nounC(tj) && !PRON[tj.w] && (j + 1 >= lim || T[j + 1].k === 'p' || (T[j + 1].k === 'w' && (!!PREP[T[j + 1].w] || /^(?:now|yet|already)$/.test(T[j + 1].w))))) return fail(m);
    if (L === 'have' && j === i + 1 && T[i] && /^(?:another|each|either|neither|some|any|one|both)$/.test(T[i].w || '') && tj && tj.k === 'w' && !!nounC(tj) && !PRON[tj.w] && !isPerson(nounC(tj))) return fail(m);   // I have another test tomorrow → また試験がある""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(試験|テスト)のために勉強する(ために|の|こと)/g, '$1勉強をする$2').replace(/^私は知っているが、/, '分かっているけど、');   // I stayed up late to study for the test → 試験勉強をするために / I know, but … → 分かっているけど、
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
