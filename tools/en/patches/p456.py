import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# can make it harder to concentrate and increase the risk → 集中しにくくし、…危険を高めることがある（不定詞のあとの and + 目的語つきの動詞は述語の並列）
rep("""        if (!cuts.length && !isP(T[x - 1], ',') && T.slice(v0 + 1, x).some((y, q) => isW(y, 'to') && T[v0 + 2 + q] && T[v0 + 2 + q].k === 'w' && !!vc(T[v0 + 2 + q], ['base']))) return null;   // can choose to stay or leave（to 不定詞の中の並列）""",
    """        if (!cuts.length && !isP(T[x - 1], ',') && T.slice(v0 + 1, x).some((y, q) => isW(y, 'to') && T[v0 + 2 + q] && T[v0 + 2 + q].k === 'w' && !!vc(T[v0 + 2 + q], ['base'])) && !(T[x + 2] && T[x + 2].k === 'w' && (DET[T[x + 2].w] !== undefined || /^(?:it|them|him|her|us|me)$/.test(T[x + 2].w)) && isW(T[v0 + 1], 'it'))) return null;   // can choose to stay or leave（to 不定詞の中の並列）/ can make it harder to concentrate and increase the risk は述語の並列""")

rep("""    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')""",
    """    ja = ja.replace(/([^、。]{1,20}?)に(夜|一晩)を(必要とする|とる)/, '1晩に$1を$3').replace(/寝る時間の前に|就寝時間の前に/g, '寝る前に');   // need seven to nine hours of sleep a night → 1晩に7〜9時間の睡眠を必要とする / before bedtime → 寝る前に
    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
