import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The ability, which psychologists have studied for decades, appears … / The book, which I bought yesterday, is …
# （主語の後ろに挟まれた非制限用法の目的格 which: 閉じるコンマの後ろが述語なら、名詞を修飾する関係詞節として読む）
rep("""        if (nonRestr && w === 'which' && !o.noSplit) return fail(m);""",
    """        const vAtNR = (k) => !!T[k] && T[k].k === 'w' && (!!MODAL[T[k].w] || !!BE[T[k].w] || !!HAVE[T[k].w] || !!DO[T[k].w] || (!!vc(T[k], ['3sg', 'past', 'base']) && !PREP[T[k].w] && DET[T[k].w] === undefined && !/^(?:and|or|but|so|then)$/.test(T[k].w)));
        const midNR = nonRestr && e < lim && isP(T[e], ',') && (vAtNR(e + 1) || (!!T[e + 1] && T[e + 1].k === 'w' && !!ADV[T[e + 1].w] && !nounC(T[e + 1]) && vAtNR(e + 2)));   // 閉じるコンマの後ろが述語
        if (nonRestr && w === 'which' && !o.noSplit && !midNR) return fail(m);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
