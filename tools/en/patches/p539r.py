import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the older language comes to be seen as old-fashioned → 旧式だとみなされるようになる（come to + 受け身の不定詞は「〜ようになる」。「みなされに来る」にしない）
rep("""      if (inf && !inf.neg && vg && /^(?:go|come)$/.test(vg.lemma) && isW(t, 'to') && !vg.passive && inf.vg && verbal(inf.pred) && !inf.past && /^(?:see|visit|""",
    """      if (inf && !inf.neg && vg && /^(?:go|come)$/.test(vg.lemma) && isW(t, 'to') && !vg.passive && inf.vg && !inf.vg.passive && !isW(T[j + 1], 'be') && verbal(inf.pred) && !inf.past && /^(?:see|visit|""")

rep("""        if ((L === 'come' || L === 'go') && !inf.neg && inf.vg && /^(?:see|visit|meet|help|""",
    """        if ((L === 'come' || L === 'go') && !inf.neg && inf.vg && !inf.vg.passive && !isW(T[ti + 1], 'be') && /^(?:see|visit|meet|help|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
