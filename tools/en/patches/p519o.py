import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) it truly understands what it produces → それが何を生み出すか（疑問詞節の主語が主節と同じ it なら省く）
rep("""        const PJW = { i: '私', we: '私たち', he: '彼', she: '彼女', they: '彼ら' };
        const subjTokW = T.slice(iw + 1, wc.end).find((x) => x.k === 'w' && PRON[x.w] && PRON[x.w].sub);""",
    """        const PJW = { i: '私', we: '私たち', he: '彼', she: '彼女', they: '彼ら', it: 'それ' };
        const subjTokW = T.slice(iw + 1, wc.end).find((x) => x.k === 'w' && PRON[x.w] && PRON[x.w].sub);""")

# 2) confirms what they already believe → すでに信じていることを裏付ける（confirm / record などの what は関係詞）
rep("""    if (WHV[L] && (WH[T[iw].w] || T[iw].w === 'whether' || T[iw].w === 'if') && !(T[iw].w === 'when' &&""",
    """    if (WHV[L] && (WH[T[iw].w] || T[iw].w === 'whether' || T[iw].w === 'if') && !(T[iw].w === 'what' && /^(?:confirm|verify|record|report|reflect|support|ignore|accept|reject|repeat|copy|share)$/.test(L)) && !(T[iw].w === 'when' &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
