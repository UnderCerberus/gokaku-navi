import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I hope I can be as patient with others as he was with me（as + 形容詞 + 前置詞句 + as … の後ろの as は比較。従属節の as にしない）
rep("""      if (T[j].w === 'as' && (isW(T[j - 2], 'as') || isW(T[j - 1], 'such')""",
    """      if (T[j].w === 'as' && T.slice(Math.max(a, j - 7), j - 2).some((x, q) => { const bq = Math.max(a, j - 7) + q; return isW(x, 'as') && !!T[bq + 1] && T[bq + 1].k === 'w' && !!adjC(T[bq + 1]) && !!T[bq + 2] && T[bq + 2].k === 'w' && !!PREP[T[bq + 2].w] && !isW(T[bq + 2], 'as'); })) continue;   // as patient with others as he was
      if (T[j].w === 'as' && (isW(T[j - 2], 'as') || isW(T[j - 1], 'such')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
