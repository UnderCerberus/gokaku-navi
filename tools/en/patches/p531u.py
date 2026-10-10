import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# make someone's day a little better / made me a little happier → 少し良くする・少し幸せにした（a little / a bit + 形容詞の補語の手前で目的語を区切る）
rep("""      !!vc(x, ['base', 'ing', 'pp']) || !!adjC(x) || !!(ADV[x.w] && ADV[x.w][1] === 'd') || x.w === 'more' || x.w === 'less' || ((x.w === 'even' || x.w === 'still') && T[q + 1] && adjC(T[q + 1])) ||""",
    """      !!vc(x, ['base', 'ing', 'pp']) || !!adjC(x) || !!(ADV[x.w] && ADV[x.w][1] === 'd') || x.w === 'more' || x.w === 'less' || ((x.w === 'even' || x.w === 'still') && T[q + 1] && adjC(T[q + 1])) ||
      (x.w === 'a' && q > i && T[q + 1] && /^(?:little|bit)$/.test(T[q + 1].w || '') && T[q + 2] && T[q + 2].k === 'w' && ((!!adjC(T[q + 2]) && !nounC(T[q + 2])) || (isW(T[q + 2], 'bit') && !!adjC(T[q + 3])))) ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
