import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Max had been at the shelter for almost two years because most visitors preferred younger dogs → 保護施設に（文に動物の語がある shelter は「保護施設」。「避難所」にしない）
rep("""    if (nom.head === 'order' && /順序$/.test(ja) && !isW(T[nom.end], 'of')""",
    """    if (nom.head === 'shelter' && /避難所$/.test(ja) && T.some((x) => x.k === 'w' && /^(?:dog|dogs|cat|cats|puppy|puppies|kitten|kittens|pet|pets|animal|animals|cage|cages|adopt|adopted|adopting|adoption|stray|strays|volunteer|volunteers|volunteering)$/.test(x.w))) ja = ja.replace(/避難所$/, '保護施設');
    if (nom.head === 'order' && /順序$/.test(ja) && !isW(T[nom.end], 'of')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
