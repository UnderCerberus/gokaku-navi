import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# More needs to be done / Much remains to be done（数量の語のあとの needs / remains + to は動詞の始まり）
rep("""(BE[t.w] || MODAL[t.w] || HAVE[t.w] || DO[t.w] || (/^(?:too|so|very|as)$/.test((T[p - 2] || {}).w || '') && !!vc(t, ['3sg', 'past'])));""",
    """(BE[t.w] || MODAL[t.w] || HAVE[t.w] || DO[t.w] || (/^(?:needs|needed|remains|remained|seems|seemed)$/.test(t.w) && isW(T[p + 1], 'to')) || (/^(?:too|so|very|as)$/.test((T[p - 2] || {}).w || '') && !!vc(t, ['3sg', 'past'])));""")

# Something needs to be done → 何かをする必要がある（need + to be done: 主語 + を + する必要がある）
rep("""    if (vg.passive && L === 'do' && !objs.length && o.subj && !st.agent && /^(?:more|something|much|this|that|it|everything|anything)$/.test(o.subj.pron || '')) {""",
    """    if (vg.passive && L === 'do' && !objs.length && o.subj && !st.agent && /^(?:more|something|much|this|that|it|everything|anything)$/.test(o.subj.pron || '') && !vg.nonfin) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
