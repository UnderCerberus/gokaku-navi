import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# were lost or destroyed（or の並列でも左の be + 過去分詞を右の過去分詞に及ぼす → 失われたり破壊されたりした）
rep("""        if (left.passive && isCC && (w === 'and' || (w === 'but' && !/^(?:survived|died|arrived|left|returned""",
    """        const leftPassLike = left.passive || (je - 1 > a && T[je - 1].k === 'w' && !!vc(T[je - 1], ['pp']) && T.slice(a, je - 1).some((x) => x.k === 'w' && /^(?:is|are|was|were)$/.test(x.w)) && T[rs].k === 'w' && !!vc(T[rs], ['pp']) && !vc(T[rs], ['base']) && en.jp.senses((vc(T[rs], ['pp']).e || {}).ja || '').some((x) => x.tr) && !/^(?:survived|died|arrived|left|returned|recovered|escaped|fell|went|came|stayed|lived|disappeared|appeared|happened|occurred|grew|rose|remained|succeeded|failed|moved|changed|worked|tried|ran|walked|slept|smiled|laughed|cried|agreed|continued|started|began|ended|stopped|became|got)$/.test(T[rs].w));   // were damaged or destroyed by the storm（damaged は 被害を受ける に訳しても、右は受け身）
        if (leftPassLike && isCC && (w === 'and' || (w === 'or' && (rs + 1 >= b || T[rs + 1].k === 'p' || isW(T[rs + 1], 'by'))) || (w === 'but' && !/^(?:survived|died|arrived|left|returned""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
