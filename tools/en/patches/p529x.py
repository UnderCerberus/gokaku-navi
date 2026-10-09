import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# is lost or thrown away → 失われたり捨てられたりしている（両側が「〜ている」の現在の受け身なら、たり の中では ている を外して最後に している）
rep("""        const pastO = o.past === undefined ? !!right.past : o.past;
        return left.out(Object.assign(lo, { form: 'tari' })) + right.out(Object.assign({}, ro, { form: 'tari' })) + (pastO ? 'した' : 'する');""",
    """        const pastO = o.past === undefined ? !!right.past : o.past;
        const ltO = left.out(Object.assign(lo, { form: 'tari' })), rtO = right.out(Object.assign({}, ro, { form: 'tari' }));
        if (!pastO && /ていたり$/.test(ltO) && /ていたり$/.test(rtO) && left.passive && right.passive) return ltO.replace(/ていたり$/, 'たり') + rtO.replace(/ていたり$/, 'たり') + 'している';
        return ltO + rtO + (pastO ? 'した' : 'する');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
