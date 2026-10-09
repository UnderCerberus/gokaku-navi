import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the poor family living next door → 隣に住んでいる貧しい家族（家庭の生計 にしない。living next door は分詞の後置修飾）
rep("""      if (cnt > 0 && vc(t, ['ing']) && j + 1 < lim && T[j + 1].k === 'w' && DET[T[j + 1].w] !== undefined && !PRON[T[j + 1].w]) break;""",
    """      if (cnt > 0 && vc(t, ['ing']) && j + 1 < lim && T[j + 1].k === 'w' && DET[T[j + 1].w] !== undefined && !PRON[T[j + 1].w]) break;
      if (cnt > 0 && vc(t, ['ing']) && (seq(j + 1, ['next', 'door']) || seq(j + 1, ['nearby']) || seq(j + 1, ['abroad']) || seq(j + 1, ['upstairs']) || seq(j + 1, ['downstairs']))) break;   // the family living next door""")
rep("""      (PREP[T[j + 1].w] || DET[T[j + 1].w] !== undefined || (PRON[T[j + 1].w] && !PRON[T[j + 1].w].sub) || PLACE_ADV[T[j + 1].w] || /^(?:alone|together|apart|independently)$/.test(T[j + 1].w));""",
    """      (PREP[T[j + 1].w] || DET[T[j + 1].w] !== undefined || (PRON[T[j + 1].w] && !PRON[T[j + 1].w].sub) || PLACE_ADV[T[j + 1].w] || /^(?:alone|together|apart|independently|nearby|abroad|upstairs|downstairs)$/.test(T[j + 1].w) || seq(j + 1, ['next', 'door']));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
