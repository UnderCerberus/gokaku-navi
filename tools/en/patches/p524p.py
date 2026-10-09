import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The village is by no means easy to reach → 村は決して着きやすくない（be / 助動詞の直後の by no means は not と同じく否定 + 決して）
rep("""    const eatNot = () => { while (j < lim && isW(T[j], 'not')) { vg.neg = true; j++; } };""",
    """    const eatNot = () => { while (j < lim && (isW(T[j], 'not') || (seq(j, ['by', 'no', 'means']) && j + 3 < lim))) { if (isW(T[j], 'by')) { vg.advs.push({ a: { ja: '決して', kind: 'f', e: null }, w: 'by no means' }); j += 3; } else j++; vg.neg = true; } };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
