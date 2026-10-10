import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the direction their species flies（単複同形の species / sheep / fish … は、複数の限定詞がなければ 3 単現の動詞とも一致する）
rep("""    const plural = pluralSubj(sj);
    return c.form === '3sg' ? !plural : plural;""",
    """    if (/^(?:species|series|sheep|deer|fish|aircraft|offspring|means)$/.test(sj.head || '') && !sj.coord && !/^(?:many|several|few|these|those|both|various|numerous|two|three)$/.test(sj.det || '')) return true;
    const plural = pluralSubj(sj);
    return c.form === '3sg' ? !plural : plural;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
