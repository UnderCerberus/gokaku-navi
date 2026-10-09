import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# they missed seeing their friends every day → 毎日友達に会えなくて寂しく思った（miss + 動名詞は 逃す ではなく「〜できなくて寂しい」）
rep("""    go: (p) => (verbal(p) ? P(p.form('stem') + 'に行く', 'v5') : p), postpone: sfx('のを延期する', 'suru'), delay: sfx('のを延期する', 'suru')
  });""",
    """    go: (p) => (verbal(p) ? P(p.form('stem') + 'に行く', 'v5') : p), postpone: sfx('のを延期する', 'suru'), delay: sfx('のを延期する', 'suru'),
    miss: (p) => (verbal(p) ? P(p.aux('can').aux('neg').plain().replace(/ない$/, 'なくて') + '寂しく思う', 'v5') : p)
  });""")
# p530h で足した sense の miss 規則は使われない（動名詞の目的語は vpFrame の GERV で読む）ので外す
rep("""      else if (L === 'miss' && objs.length === 1 && objs[0].gerund && /こと$/.test(objs[0].ja || '') && !vg.passive) sense = { particle: 'ができなくて', core: '寂しく思う', tr: true };
""", "")

# Those who had slept remembered far more words（目的語の位置の far / much / many + more + 名詞 は副詞で取らず名詞句で読む → はるかに多くの語）
rep("""&& !(t.w === 'far' && (isW(T[j0 + 1], 'from') || (isW(T[j0 + 1], 'away') && isW(T[j0 + 2], 'from')))) &&""",
    """&& !(t.w === 'far' && (isW(T[j0 + 1], 'from') || (isW(T[j0 + 1], 'away') && isW(T[j0 + 2], 'from')))) && !(/^(?:far|much|many)$/.test(t.w) && isW(T[j0 + 1], 'more') && T[j0 + 2] && T[j0 + 2].k === 'w' && !!nounC(T[j0 + 2]) && !PREP[T[j0 + 2].w] && vg.lemma !== 'spend') &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
