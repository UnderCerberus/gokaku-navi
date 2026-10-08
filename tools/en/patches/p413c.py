import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""!/^(?:need|have|know|understand|feel|seem|become|get|grow|forget|remember|lose|die|fail|find|realize|see|hear|like|love|miss)$/.test(vg.lemma) && !/(?:必要がある|ことになる|遅れる|遅刻する|早く着く)$/.test(p.plain()) ? p.aux('intend') : p.aux('will');""",
    """(!/^(?:need|have|know|understand|feel|seem|become|get|grow|forget|remember|lose|die|fail|find|realize|see|hear|like|love|miss)$/.test(vg.lemma) || /(?:見送る|見舞う|案内する)$/.test(p.plain())) && !/(?:必要がある|ことになる|遅れる|遅刻する|早く着く)$/.test(p.plain()) ? p.aux('intend') : p.aux('will');   // I'll see you off → 見送るつもりだ""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(風邪|かぜ)にかか(る|った|って|り|ら)/g, (m0, a0, a1) => '風邪をひ' + ({ 'る': 'く', 'った': 'いた', 'って': 'いて', 'り': 'き', 'ら': 'か' })[a1]);   // came down with a cold → 風邪をひいた
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
