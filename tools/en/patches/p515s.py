import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
L = s.split('\n')

def one(prefix):
    idx = [i for i, x in enumerate(L) if x.startswith(prefix)]
    assert len(idx) == 1, (prefix, len(idx))
    return idx[0]

# She lived in Paris until the war, when she moved to London → …パリに住んでいた。それはロンドンに移り住んだときだった
# （主語が同じでも , when は非制限の判定を先に。主語が同じなら後ろの文の主語を省く）
iSF = one("      const subFirst = typeof sc.end === 'number' && typeof mn.end === 'number' && sc.end < mn.end;")
iCW = one("      const commaWhen = key === 'when' && !subFirst && !o.part && !o.form && T.some(")
iRet = one("      if (commaWhen) return mn.out(o) + '。それは' + subStr(key, sc, mn, null, true)")
assert iCW == iSF + 2 and iRet == iCW + 1, (iSF, iCW, iRet)
lSF, lCW, lRet = L[iSF], L[iCW], L[iRet]
lRet = lRet.replace("subStr(key, sc, mn, null, true)", "subStr(key, sc, mn, same ? sp : null, true)")
for i in sorted([iSF, iCW, iRet], reverse=True):
    del L[i]
iJ = one("  function joinSub(key, sc, mn) {")
iO = next(i for i in range(iJ, iJ + 12) if L[i] == "      o = o || {};")
L[iO + 1:iO + 1] = [lSF, lCW, lRet]
s = '\n'.join(L)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
