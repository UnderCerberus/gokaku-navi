import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The region could lose half of its species → 失うかもしれない（無生物の主語の could + lose などを「〜ことがあった」にするのは、文に過去の動詞があるときだけ）
rep("""/^(?:lose|fail|die|break|sink|crash|drown|fall|miss|burn|disappear)$/.test(vg.lemma) && (st.manner.some((x) => /^(?:簡単に|すぐに|容易に)$/.test(x)) || (sj && !anim)) && !o.subjunctive && !o.wish) {""",
    """/^(?:lose|fail|die|break|sink|crash|drown|fall|miss|burn|disappear)$/.test(vg.lemma) && (st.manner.some((x) => /^(?:簡単に|すぐに|容易に)$/.test(x)) || (sj && !anim && T.some((x, q) => q !== vg.idx && x.k === 'w' && !MODAL[x.w] && !!vc(x, ['past']) && !vc(x, ['base', '3sg'])))) && !o.subjunctive && !o.wish) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
