import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# … recall the first and last items better than those in the middle → 真ん中の品目（those は than の前のいちばん近い複数名詞を受ける）
rep("""      let pn3 = priorNoun(i);
      if (isW(T[i + 1], 'of') || !pn3)""",
    """      const nearPl = t.w === 'those' ? (() => { for (let x = i - 2; x > 0; x--) { if (T[x].k !== 'w' || PRON[T[x].w]) continue; if (isW(T[x], 'than')) continue; const cPl = cand(T[x], '名', ['pl']); if (cPl && cPl.e && !vc(T[x], ['3sg']) && !(T[x + 1] && T[x + 1].k === 'w' && nounC(T[x + 1]) && !PREP[T[x + 1].w] && x + 1 < i - 1)) return en.jp.first(cPl.e.ja); if (T[x].k === 'w' && (SUB[T[x].w] || isW(T[x], 'when'))) break; } return ''; })() : '';
      let pn3 = nearPl || priorNoun(i);
      if (isW(T[i + 1], 'of') || !pn3)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
