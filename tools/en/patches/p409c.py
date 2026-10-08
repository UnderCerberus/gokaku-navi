import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# for more than an hour → 1時間以上（more / less than + a / an + 単位 を one に）
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA').replace(/\\b(more|less|More|Less) than (?:a|an) (hour|day|week|month|year|minute|second|decade|century|mile|kilometer|meter)\\b/g, '$1 than one $2')""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/学校(に|まで)([^、。]{0,10}?)通勤/g, '学校$1$2通学');   // I commute to school by bus → 学校にバスで通学する
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
