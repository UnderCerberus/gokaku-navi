import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) She can't even walk → 歩くことさえできない（否定でも さえ は動詞のあとに）
rep("""    const evenCan = modal0 === 'can' && !neg && st.manner.indexOf('さえ') >= 0 && verbal(p);
    if (evenCan) { st.manner = st.manner.filter((x) => x !== 'さえ'); p = P(p.plain() + 'ことさえできる', 'v1'); }""",
    """    const evenCan = /^(?:can|could)$/.test(modal0 || '') && st.manner.indexOf('さえ') >= 0 && verbal(p) && (modal0 === 'can' || neg);
    if (evenCan) { st.manner = st.manner.filter((x) => x !== 'さえ'); p = neg ? P(p.plain() + 'ことさえでき' + (modal0 === 'could' || past ? 'なかった' : 'ない'), 'fix') : P(p.plain() + 'ことさえできる', 'v1'); if (neg) { neg = false; past = false; } }   // can't even walk → 歩くことさえできない""")

# 2) let alone run（主節に can があれば動詞として読む）
rep("""        const nLa = isW(T[kLa + 3], 'to') || (T[kLa + 3] && T[kLa + 3].k === 'w' && !!vc(T[kLa + 3], ['base']) && !nounC(T[kLa + 3])) ? null : np(kLa + 3, b, { noRel: true });""",
    """        const nLa = isW(T[kLa + 3], 'to') || (T[kLa + 3] && T[kLa + 3].k === 'w' && !!vc(T[kLa + 3], ['base']) && (!nounC(T[kLa + 3]) || T.slice(0, kLa).some((x) => x.k === 'w' && /^(?:can|could|cannot)$/.test(x.w)) && !T.slice(0, kLa).some((x) => x.k === 'w' && /^(?:afford|have|has|had|buy|own)$/.test(x.w)))) ? null : np(kLa + 3, b, { noRel: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
