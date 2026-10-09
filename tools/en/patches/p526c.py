import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# You had better leave now, or you will be caught … / You should take an umbrella, or you will get wet → 〜したほうがよい。さもないと、〜（助言・義務の節 + , or は命令文と同じ）
rep("""        if (right) return wrap(joinCoord(w, left, right));
        // Parking is limited, so please use public transportation""",
    """        const advOr = w === 'or' && je < j && T.slice(a, je).some((x, q) => x.k === 'w' && (/^(?:should|must)$/.test(x.w) || (x.w === 'better' && /^(?:had|'d)$/.test((T[a + q - 1] || {}).w || '')) || (x.w === 'to' && /^(?:have|has)$/.test((T[a + q - 1] || {}).w || '')))) && T.slice(rs, b).some((x) => x.k === 'w' && /^(?:will|would|may|might)$/.test(x.w));
        if (right) return wrap(joinCoord(w, left, right, advOr));
        // Parking is limited, so please use public transportation""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
