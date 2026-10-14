import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it is difficult to know exactly what an animal is feeling → 動物が何を感じているか / What do you feel? → 何を感じますか（目的語が疑問詞 what の穴の feel は「感じる」。「何と思っている」にしない）
rep("""    let sense = verbSense(vg.e, tr);
    const L = vg.lemma;""",
    """    let sense = verbSense(vg.e, tr);
    const L = vg.lemma;
    if (L === 'feel' && !vg.passive && objs.length === 1 && objs[0].wh && objs[0].pron === 'what') sense = { particle: 'を', core: '感じる', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
