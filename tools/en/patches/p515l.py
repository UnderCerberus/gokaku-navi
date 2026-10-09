import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# has changed so much over the past twenty years that … → so much を「とても」で先に取らず、so … that の規則に回す（that の前に前置詞句）
rep("""      if (key && TIMEPH[key] && !pastSpan && !(key === 'as well' && isW(T[j + len], 'as') && j + len + 1 < lim) && !(/^so (?:much|many|long|far)$/.test(key) && isW(T[j + len], 'that'))""",
    """      const soFar = /^so (?:much|many|long|far)$/.test(key || '') && (() => { for (let x = j + len; x < lim - 1 && x < j + len + 9; x++) { if (isP(T[x], ',')) return false; if (isW(T[x], 'that')) { const y = T[x + 1]; return y.k === 'w' && ((PRON[y.w] && PRON[y.w].sub) || DET[y.w] !== undefined || !!nounC(y)); } } return false; })();
      if (key && TIMEPH[key] && !pastSpan && !(key === 'as well' && isW(T[j + len], 'as') && j + len + 1 < lim) && !(/^so (?:much|many|long|far)$/.test(key) && (isW(T[j + len], 'that') || soFar))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
