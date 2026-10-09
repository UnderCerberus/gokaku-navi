import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# as much free time as … / as many good friends as …（as many / much + 形容詞 + 名詞 も目的語）
rep("""!(t.w === 'as' && T[j + 1] && /^(?:many|much)$/.test(T[j + 1].w || '') && T[j + 2] && (!!nounC(T[j + 2]) || (isW(T[j + 2], 'as')""",
    """!(t.w === 'as' && T[j + 1] && /^(?:many|much)$/.test(T[j + 1].w || '') && T[j + 2] && (!!nounC(T[j + 2]) || (!!adjC(T[j + 2]) && T[j + 3] && T[j + 3].k === 'w' && !!nounC(T[j + 3])) || (isW(T[j + 2], 'as')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
