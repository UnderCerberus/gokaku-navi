import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The documents were lost or destroyed → 失われたり破壊されたりした（左の be + 過去分詞を、文末の右の過去分詞にも及ぼす。破壊したり にしない）
rep("""&& T[rs].k === 'w' && vc(T[rs], ['pp']) && !HAVE[T[rs].w] && !DO[T[rs].w] && ppNext && !(rv && rv.passive)) {""",
    """&& T[rs].k === 'w' && vc(T[rs], ['pp']) && !HAVE[T[rs].w] && !DO[T[rs].w] && (ppNext || ((rs + 1 >= b || T[rs + 1].k === 'p') && !vc(T[rs], ['base']) && en.jp.senses((vc(T[rs], ['pp']).e || {}).ja || '').some((x) => x.tr))) && !(rv && rv.passive)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
