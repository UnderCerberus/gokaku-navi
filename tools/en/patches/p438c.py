import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Mrs. Sato wanted …, but Mr. Sato wanted … → 佐藤夫人は…、佐藤さんは…（同じ文に Mr. と Mrs. があるとき）
rep("""        ja += (NAME_JA[T[j + 1].w] || EN_SURNAME_KANA[T[j + 1].w] || T[j + 1].s || T[j + 1].w) + TITLE[t.w];""",
    """        ja += (NAME_JA[T[j + 1].w] || EN_SURNAME_KANA[T[j + 1].w] || T[j + 1].s || T[j + 1].w) + (t.w === 'mrs' && T.some((x, q) => x.w === 'mr' && T[q + 1] && T[q + 1].w === T[j + 1].w) ? '夫人' : TITLE[t.w]);""")

rep("""    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""",
    """    ja = ja.replace(/(湖|川|海|池|木|火|窓|暖炉)のそばに([^、。]{1,10}?)を(楽しん|して|食べ|した|する|読ん)/g, '$1のそばで$2を$3');   // enjoying a barbecue by the lake → 湖のそばでバーベキューを楽しんでいた
    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
