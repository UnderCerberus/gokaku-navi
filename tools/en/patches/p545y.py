import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# run the lights day and night / run the machines day and night（名詞の複合語の途中で「day and night」などの時の決まり文句が始まれば、そこで切る）
rep("""      if (t.k !== 'w' || (cnt > 0 && NO_COMPOUND[t.w])) break;
      if (cnt > 0 && DIRW[t.w] && /^(?:kilometers?|kilometres?|miles?|meters?|metres?|feet|foot|steps?|blocks?|yards?)$/.test(head || '')) break;   // ten kilometers north""",
    """      if (t.k !== 'w' || (cnt > 0 && NO_COMPOUND[t.w])) break;
      if (cnt > 0 && j + 2 < lim && isW(T[j + 1], 'and') && TIMEPH[T.slice(j, j + 3).map((x) => x.w || '').join(' ')]) break;
      if (cnt > 0 && DIRW[t.w] && /^(?:kilometers?|kilometres?|miles?|meters?|metres?|feet|foot|steps?|blocks?|yards?)$/.test(head || '')) break;   // ten kilometers north""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
