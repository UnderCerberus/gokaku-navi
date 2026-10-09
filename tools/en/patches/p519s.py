import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# researchers who studied thousands of children → 何千人もの子どもを調査した / developed larger vocabularies → より豊富な語彙を身につけた
rep("""    'make|money fortune|を|稼ぐ',""",
    """    'make|money fortune|を|稼ぐ', 'study|children child people students patients animals birds bees insects cells volunteers participants twins adults infants babies|を|調査する', 'develop|vocabulary vocabularies skill skills habit habits ability abilities|を|身につける',""")
rep("""    'leading|cause causes|主な',""",
    """    'leading|cause causes|主な',
    'large|vocabulary vocabularies|豊富な',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
