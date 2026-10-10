import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They should be quiet → 静かであるべきだ（should + be + な形容詞。「静かなべきだ」にしない）
rep("""        if (!verbal(p) && p.cls === 'i' && !neg) { p = P(p.form('adv') + 'あるべきだ', 'da'); if (vg.perfect) past = true; break; }   // should be more careful → もっと注意深くあるべきだ""",
    """        if (!verbal(p) && p.cls === 'i' && !neg) { p = P(p.form('adv') + 'あるべきだ', 'da'); if (vg.perfect) past = true; break; }   // should be more careful → もっと注意深くあるべきだ
        if (!verbal(p) && p.cls === 'da' && /[^でにと]だ$/.test(p.s) && !/(?:べき|はず|よう|そう)だ$/.test(p.s)) { p = P(p.s.replace(/だ$/, neg ? 'であるべきではない' : 'であるべきだ'), 'da'); if (neg) neg = false; if (vg.perfect) past = true; break; }   // They should be quiet → 静かであるべきだ""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
