import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …, and each time I feel the same mix of sadness and joy → 毎回、私は…を感じる / Each time, I feel sad → 毎回（節のない each time は副詞「毎回」。「毎時間」「それぞれの時」にしない）
rep("""    'all week': '1週間ずっと', 'all year': '1年中',""",
    """    'each time': '毎回', 'every single time': '毎回', 'all week': '1週間ずっと', 'all year': '1年中',""")

# 文頭の each time / every time が従属節として読めなければ、副詞（毎回）として先へ進む
rep("""      if (!PREP[T[a].w] && !isW(T[a], 'whether')) return fail(m);""",
    """      if (!PREP[T[a].w] && !isW(T[a], 'whether') && !/^(?:each time|every time)$/.test(sb.key)) return fail(m);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
