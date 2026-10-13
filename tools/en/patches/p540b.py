import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I did not win a prize, but several people came up to me → 何人かの人々は私のところにやって来た
# （文頭の「私は」と同じ人の「私の」を省く置換は、別の主語の節（、…は）をまたがない・「私のところ」は省かない）
rep("""replace(/^私は([^。]{0,24}?)私の(?=[^、。]{1,8}(?:について|を|に|が|で|と))/, '私は$1')""",
    """replace(/^私は((?:(?!、(?!私の)[^、。]{1,12}は)[^。]){0,24}?)私の(?!ところ)(?=[^、。]{1,8}(?:について|を|に|が|で|と))/, '私は$1')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
