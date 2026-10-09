import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She got used to the noise and crowds of the city → 都市の騒音と人混み（左の述語が過去なら、and の後ろの名詞にもなる 3 単現 crowds は述語にしない）
rep("""        if (!rv) rv = left.subj && !thatLeft && !(T[rs] && T[rs].k === 'w' && !!nounC(T[rs]) && !!vc(T[rs], ['3sg']) && !agree(left.subj, rs)) ? predOnly(""",
    """        if (!rv) rv = left.subj && !thatLeft && !(T[rs] && T[rs].k === 'w' && !!nounC(T[rs]) && !!vc(T[rs], ['3sg']) && (!agree(left.subj, rs) || (left.past && !left.perfect && !vc(T[rs], ['past'])))) ? predOnly(""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
