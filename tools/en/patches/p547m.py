import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# our teacher said that she trusted me to stay calm under pressure → 私がプレッシャーの中でも落ち着いていられると信じていた
# （trust + 人 + to do は「人が〜すると信じる」。「〜しているために私を信頼する」にしない）
rep("""    expect: ['が', sfx('ことを期待する', 'suru')],""",
    """    expect: ['が', sfx('ことを期待する', 'suru')], trust: ['が', sfx('と信じる', 'v1')],""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
