import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The temple, built in 1600, is famous. → 1600年に建てられた寺は有名だ（主語の直後に挿入された過去分詞句は、習慣の動詞以外は過去形で前から修飾）
rep(r"""? vq.parts.join('') + vq.pred.plain() + '\u0002' : vq.parts.join('') + vq.pred.form('te'); }""",
    r"""? vq.parts.join('') + (vq.vg && HABIT[vq.vg.lemma] ? vq.pred.plain() : vq.pred.form('past')) + '\u0002' : vq.parts.join('') + vq.pred.form('te'); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
