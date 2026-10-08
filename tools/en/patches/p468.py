import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""          (isW(T[j + 1], 'the') && T.slice(j + 2, lim).some((x, q) => isW(x, 'and') && T[j + 3 + q] && /^(?:my|his|her|their|our|your)$/.test(T[j + 3 + q].w || '')));   // the smell of the ocean and his kind smile → 海のにおいと彼の優しい笑顔""",
    """          (isW(T[j + 1], 'the') && T.slice(j + 2, lim).some((x, q) => isW(x, 'and') && T[j + 3 + q] && /^(?:my|his|her|their|our|your)$/.test(T[j + 3 + q].w || ''))) ||   // the smell of the ocean and his kind smile → 海のにおいと彼の優しい笑顔
          (!!node.det && /^(?:my|his|her|its|their|our|your)$/.test(node.det) && T.slice(j + 1, lim).some((x, q) => isW(x, 'and') && T[j + 2 + q] && T[j + 2 + q].w === node.det));   // its use of fresh ingredients and its beautiful presentation → 新鮮な食材の使用と美しい盛り付け""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    if (tokens.some((x) => /^(?:food|meal|meals|dish|dishes|washoku|cuisine|cooking|chef|restaurant)$/.test(x.w || ''))) ja = ja.replace(/(美しい|きれいな)?発表/g, (m0, a0) => (a0 || '') + '盛り付け');   // its beautiful presentation → 美しい盛り付け
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
