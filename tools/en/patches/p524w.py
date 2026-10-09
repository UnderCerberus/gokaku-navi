import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They treated her well → 彼女を大切に扱った（treat + well は「上手に」ではない）
rep("""    'badly|need want|どうしても', 'widely|use believe accept know|広く',
  ], 'a');""",
    """    'badly|need want|どうしても', 'widely|use believe accept know|広く',
    'well|treat|大切に',
  ], 'a');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
