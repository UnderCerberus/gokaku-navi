import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# could hardly see any of the paintings → ほとんどどの絵画も見えなかった（hardly / scarcely / barely も否定として any を読む）
rep("""vgNever: !!(vg && vg.advs && vg.advs.some((x) => x.w === 'never')),""",
    """vgNever: !!(vg && vg.advs && vg.advs.some((x) => x.w === 'never')), vgHardly: !!(vg && vg.advs && vg.advs.some((x) => /^(?:hardly|scarcely)$/.test(x.w))),""")
rep("""    if (n.anyIn && (st.neg || st.vgNeg)) {""",
    """    if (n.anyIn && (st.neg || st.vgNeg || st.vgNever || st.vgHardly)) {""")

rep("""    if (n.any && (st.neg || st.vgNeg) && /^(?:誰も|何も)$/.test(n.any) && /^(?:に|と|から|で)$/.test(particle || '')) return n.any.replace(/も$/, particle + 'も');   // tell anyone → 誰にも
    if (n.any && (st.neg || st.vgNeg)) return""",
    """    if (n.any && (st.neg || st.vgNeg || st.vgHardly) && /^(?:誰も|何も)$/.test(n.any) && /^(?:に|と|から|で)$/.test(particle || '')) return n.any.replace(/も$/, particle + 'も');   // tell anyone → 誰にも
    if (n.any && (st.neg || st.vgNeg || st.vgHardly)) return""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
