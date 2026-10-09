import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the amount of sleep people need → 人々が必要とする睡眠の量（物質名詞 + people + 動詞 は接触節。睡眠の人々の必要 にしない）
rep("""      if (cnt > 0 && head === 'way') break;                               // the way S V（way のあとは節）""",
    """      if (cnt > 0 && head === 'way') break;                               // the way S V（way のあとは節）
      if (cnt > 0 && /^(?:people|children|students|teenagers|adults|humans)$/.test(t.w) && (UNCOUNT[(T[j - 1] || {}).w] || /^(?:sleep|exercise|attention|support|care|effort|protein|data|stress)$/.test((T[j - 1] || {}).w || '')) && j + 1 < lim && T[j + 1].k === 'w' && !!vc(T[j + 1], ['base']) && !vc(T[j + 1], ['3sg'])) break;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
