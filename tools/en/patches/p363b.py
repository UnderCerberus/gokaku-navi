import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# on New Year's Eve / on Christmas Eve → 大みそかに・クリスマスイブに（祝日は時の名詞）
rep("""    'week day today tomorrow yesterday tonight moment future past century age time');""",
    """    'week day today tomorrow yesterday tonight moment future past century age time newyearsday newyearseve christmas birthday holiday eve');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
