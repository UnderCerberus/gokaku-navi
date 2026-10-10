import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# he apologized to the family himself → 自ら家族に謝った（節末の再帰代名詞は主語の強調。前置詞・動詞の目的語の名詞につけない。family / team に himself もつけない）
rep("""      if (t.k === 'w' && /^(?:itself|himself|herself|themselves|myself|yourself|ourselves)$/.test(t.w) && !node.pron &&
        ((t.w === 'itself' && !node.an && !node.pl) || (/^(?:himself|herself)$/.test(t.w) && node.an && !node.pl) || (t.w === 'themselves' && node.pl))) {""",
    """      if (t.k === 'w' && /^(?:itself|himself|herself|themselves|myself|yourself|ourselves)$/.test(t.w) && !node.pron &&
        !((j + 1 >= lim || T[j + 1].k === 'p') && /^(?:himself|herself|themselves)$/.test(t.w) && T.slice(0, Math.max(0, j - 1)).some((x) => x.k === 'w' && !!vc(x, ['past', '3sg', 'base']) && !nounC(x))) &&
        ((t.w === 'itself' && !node.an && !node.pl) || (/^(?:himself|herself)$/.test(t.w) && node.an && !node.pl && !ORG[node.head || '']) || (t.w === 'themselves' && node.pl))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
