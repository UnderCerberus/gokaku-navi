import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I hope this letter finds you both well → お二人ともお元気でお過ごしのことと思います（手紙の書き出しの決まり文句。「井戸を見つける」にしない。you well の形は既存）
rep("""    'i am afraid i can not': '残念ながらできません',""",
    """    'i am afraid i can not': '残念ながらできません', 'i hope this letter finds you both well': 'お二人ともお元気でお過ごしのことと存じます', 'i hope this email finds you both well': 'お二人ともお元気でお過ごしのことと存じます',
    'i hope this letter finds you all well': '皆さんお元気でお過ごしのことと存じます', 'i hope this letter finds you in good health': 'お元気でお過ごしのことと存じます',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
