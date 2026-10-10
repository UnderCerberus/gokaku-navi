import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# around 1600 → 1600年ごろに（以前の訳と同じく「に」をつける）
rep("""        return { ja: yJ, adn: yJ + 'の', end: kYr + 1, kind: 'time', prep: t.w, obj: { ja: yJ, time: true, year: true, end: kYr + 1 } };""",
    """        return { ja: yJ + 'に', adn: yJ + 'の', end: kYr + 1, kind: 'time', prep: t.w, obj: { ja: yJ, time: true, year: true, end: kYr + 1 } };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
