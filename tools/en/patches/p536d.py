import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Someone sitting next to me started talking / reading about someone else yawning → 私の隣に座っている誰か・あくびをしているほかの誰か（someone / anyone などの不定代名詞にも分詞の後置修飾をつける）
rep("""    if (form && !node.pron && !o.noPart) {""",
    """    if (form && (!node.pron || (/^(?:someone|somebody|anyone|anybody|everyone|everybody|nobody)$/.test(node.pron) && form === 'ing')) && !o.noPart) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
