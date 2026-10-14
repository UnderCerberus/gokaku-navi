import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# help customers choose what they wanted → 客がほしいものを選ぶ（choose / buy / get … + what + 主語 + want / need / like は関係詞の what「〜もの」。「何をほしかったか選ぶ」にしない）
rep("""    if (WHV[L] && (WH[T[iw].w] || T[iw].w === 'whether' || T[iw].w === 'if') && !(T[iw].w === 'if' &&""",
    """    if (WHV[L] && (WH[T[iw].w] || T[iw].w === 'whether' || T[iw].w === 'if') && !(T[iw].w === 'what' && /^(?:choose|buy|get|eat|take|find|order|pick|bring|give|do|make|cook|wear|drink|read|say)$/.test(L) && T[iw + 1] && T[iw + 1].k === 'w' && PRON[T[iw + 1].w] && PRON[T[iw + 1].w].sub && /^(?:want|wanted|wants|need|needed|needs|like|liked|likes|love|loved|loves|prefer|preferred|prefers)$/.test((T[iw + 2] || {}).w || '')) && !(T[iw].w === 'if' &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
