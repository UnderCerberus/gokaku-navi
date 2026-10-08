import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        if (obj.num && !obj.year && !obj.clock && !obj.time && (obj.unit || obj.num.pct || (obj.head && MUNIT[obj.head]))) return R(n + 'だけ', 'other');   // rose by 10 percent / wrong by ten kilometers → 〜だけ""",
    """        if (obj.num && !obj.year && !obj.clock && !obj.time && (obj.unit || obj.num.pct || (obj.head && MUNIT[obj.head]))) return R(n, 'other', n + 'の');   // rose by 10 percent → 10%上がった（だけ にすると「〜しか」に聞こえる）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
