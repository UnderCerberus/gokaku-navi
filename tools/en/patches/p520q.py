import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Whether or not a new word becomes part of the language depends on …（コンマのない文頭の whether (or not) 節は主語の節として読む。「〜かどうかにかかわらず」はコンマのあるときだけ）
rep("""      for (let j = s0 + 2; j < b - 1; j++) {                                        // コンマなし
        if (!canStartClause(T[j]) || isP(T[j - 1], ',')) continue;""",
    """      for (let j = s0 + 2; j < b - 1; j++) {                                        // コンマなし
        if (/^whether/.test(sb.key)) break;
        if (!canStartClause(T[j]) || isP(T[j - 1], ',')) continue;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
