import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# earned a degree in economics / a university degree → 学位（程度・度 でなく）
rep("""      // good memories / memories of my school days → 思い出（the brain organizes memories は記憶）""",
    """      if (c.lemma === 'degree' && c.e && w === '程度' && (T.some((x) => x.k === 'w' && /^(?:earn|earns|earned|earning|receive|receives|received|hold|holds|held|bachelor|bachelor's|master's|doctoral|graduate|university|college|academic)$/.test(x.w)) || (j > 0 && /^(?:medical|law|university|college|graduate|master's|bachelor's|doctoral|engineering|science)$/.test(T[j - 1].w || '')) || (isW(T[j + 1], 'in') && T[j + 2] && T[j + 2].k === 'w' && /^(?:economics|law|medicine|engineering|science|history|education|physics|chemistry|biology|mathematics|literature|psychology|business|art|music|nursing|computer)$/.test(T[j + 2].w)))) w = '学位';   // earned a degree in economics → 経済学の学位
      // good memories / memories of my school days → 思い出（the brain organizes memories は記憶）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
