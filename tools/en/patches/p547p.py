import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# my foot slipped and I fell to the ground → 地面に倒れた（人が主語の fall + to the ground / floor は「倒れる」。「地面に落ちた」にしない）
rep("""    // sit（物の主語）→ ある・止まっている""",
    """    if (vg.lemma === 'fall' && anim && !(sj && /^(?:it|they)$/.test(sj.pron || '')) && /^落ちる$/.test(p.plain()) && st.other.some((x) => /^(?:地面|床|地べた|道路|芝生)に$/.test(x))) p = P('倒れる', 'v1');
    // sit（物の主語）→ ある・止まっている""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
