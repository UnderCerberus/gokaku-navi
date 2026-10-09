import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# sold it for a large sum of money → 大金で売った（複合名詞 sum of money / 大金・金額 も値段）
rep("""        if ((/^(?:money|price|yen|dollar|dollars|euro|euros|pound|pounds|sum)$/.test(obj.head || '') || /(?:円|ドル|ユーロ|ポンド)$/.test(n)) && T.some(""",
    """        if ((/(?:^| )(?:money|price|yen|dollar|dollars|euro|euros|pound|pounds|sum|sums)$/.test(obj.head || '') || /(?:円|ドル|ユーロ|ポンド|大金|金額)$/.test(n)) && T.some(""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
