import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# only a limited number of crops → 限られた数の作物だけ（数量の句の表に a limited number of を足す。「作物の限られた数」にしない）
rep("""['a small number of ~', '少数の〜'], ['huge numbers of ~', '膨大な数の〜']].forEach((x) => {""",
    """['a small number of ~', '少数の〜'], ['huge numbers of ~', '膨大な数の〜'], ['a limited number of ~', '限られた数の〜'], ['a certain number of ~', '一定の数の〜']].forEach((x) => {""")

# open throughout the year → 1年中 / worked day and night → 昼も夜も（時の決まり文句の表）
rep("""'all year round': '一年中'""",
    """'all year round': '一年中', 'throughout the year': '1年中', 'day and night': '昼も夜も', 'night and day': '昼も夜も'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
