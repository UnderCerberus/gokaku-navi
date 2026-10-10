import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# turned / walked in the direction … → 〜方向に（in + direction は「に」）
rep("""      case 'in':
        if (few) return R(n + 'で', 'other', n + 'での');""",
    """      case 'in':
        if (few) return R(n + 'で', 'other', n + 'での');
        if (obj.head && /^(?:direction|directions)$/.test(obj.head) && !obj.pron && !obj.wh) return R(n + 'へ', 'place', n + 'への');   // turned in the direction their species flies → 方向へ""")

# turned in the direction … → 方向を向いた（turn + in the direction / toward → 向く。回る にしない）
rep("""    if (vg.lemma === 'suffer' && !vg.passive && !o.hasObj && sj && !anim""",
    """    if (vg.lemma === 'turn' && !vg.passive && !o.hasObj && /^回る$/.test(p.plain()) && T.some((x, q) => q > vg.idx && (isW(x, 'toward') || isW(x, 'towards') || (isW(x, 'direction') && isW(T[q - 1], 'the') && isW(T[q - 2], 'in'))))) p = P('向く', 'v5');
    if (vg.lemma === 'suffer' && !vg.passive && !o.hasObj && sj && !anim""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
