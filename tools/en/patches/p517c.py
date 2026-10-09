import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Whether or not the plan succeeds depends on … → 文頭の whether (or not) 節は主語にもなる（従属節として読めなくても先へ進む）
rep("""      // 節として読めなければ、前置詞（after the game / since 2010）の可能性があるので先へ進む
      if (!PREP[T[a].w]) return fail(m);""",
    """      // 節として読めなければ、前置詞（after the game / since 2010）の可能性があるので先へ進む
      if (!PREP[T[a].w] && !isW(T[a], 'whether')) return fail(m);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
