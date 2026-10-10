import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# stop the flow of information / stop the bleeding → 流れを止める（stop + 流れ・出血 → 止める。やめる にしない）/ manage their own phone use / time → 管理する
rep("""    'take|measure measures step steps|を|講じる',""",
    """    'take|measure measures step steps|を|講じる',
    'stop|flow flows bleeding spread leak leaks fire fires car cars bus train machine engine clock|を|止める',
    'manage|use time money stress budget risk risks resources data|を|管理する',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
