import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) , with babies needing … → 述語が形容詞（必要だ）でも分ける。カンマの位置も 2 語目のあとから
rep("""      const kWi = T.findIndex((x, q) => q > 3 && q < b - 3 && isP(x, ',') && isW(T[q + 1], 'with'));""",
    """      const kWi = T.findIndex((x, q) => q > 1 && q < b - 3 && isP(x, ',') && isW(T[q + 1], 'with'));""")
rep("""        if (vWi && vWi.end === b && verbal(vWi.pred)) {""",
    """        if (vWi && vWi.end === b && vWi.pred) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
