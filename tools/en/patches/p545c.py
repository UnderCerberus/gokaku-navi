import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# studying something many times in one night → 一晩で何度も / read the whole book in a single night（in + one / a single + night は期間。「ある夜に」にしない）
rep("""        if (obj.year || time) return R(n + 'に', 'time', n + 'の');
        if (obj.head && /^(?:life|lives)$/.test(obj.head) && !obj.pron && !T.some((x) => isW(x, 'there'))) return R(n + 'で', 'other', n + 'の');""",
    """        if (time && obj.end >= 2 && isW(T[obj.end - 1], 'night') && (/^(?:one|single)$/.test(T[obj.end - 2].w || '') || (isW(T[obj.end - 2], 'a') && isW(T[obj.end - 3], 'in')))) return R('一晩で', 'time', '一晩の');
        if (obj.year || time) return R(n + 'に', 'time', n + 'の');
        if (obj.head && /^(?:life|lives)$/.test(obj.head) && !obj.pron && !T.some((x) => isW(x, 'there'))) return R(n + 'で', 'other', n + 'の');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
