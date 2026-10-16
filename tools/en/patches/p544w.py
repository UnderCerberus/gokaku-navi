import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I arrived an hour before the train left / She came two days after I left（p544v: 節の動詞が名詞にもなる left でも、限定詞の直後でなければ動詞として数える）
rep("""        T.slice(kD + 3, b).some((x) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || !!HAVE[x.w] || !!DO[x.w] || (!!vc(x, ['past', '3sg']) && !nounC(x)))) &&""",
    """        T.slice(kD + 3, b).some((x, q) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || !!HAVE[x.w] || !!DO[x.w] || (!!vc(x, ['past', '3sg']) && !(T[kD + 2 + q] && T[kD + 2 + q].k === 'w' && DET[T[kD + 2 + q].w] !== undefined && !PRON[T[kD + 2 + q].w])))) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
