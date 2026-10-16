import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# looking at the world through the same eyes → 同じ目で世界を見る / through a telescope → 望遠鏡を通して（見る道具の through は「通って」にしない）
rep("""    if (mGn) return R(mGn[1] + '世代にわたって', 'dur', mGn[1] + '世代にわたる');""",
    """    if (mGn) return R(mGn[1] + '世代にわたって', 'dur', mGn[1] + '世代にわたる');
    if (key === 'through' && obj.head && !obj.pron && /^(?:eye|eyes)$/.test(obj.head)) return R(n + 'で', 'other', n + 'での');
    if (key === 'through' && obj.head && !obj.pron && /^(?:lens|lenses|glasses|telescope|telescopes|microscope|microscopes|binoculars|camera|cameras|viewfinder)$/.test(obj.head)) return R(n + 'を通して', 'other', n + 'を通しての');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
