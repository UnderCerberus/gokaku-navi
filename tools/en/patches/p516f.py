import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# eat as many vegetables as possible → できるだけ多くの野菜
rep("""        if (inner && isW(T[inner.end], 'as') && inner.end + 1 < lim && !mu) {
          // as much food as we need / as many books as you like → 必要なだけの食べ物・好きなだけの本""",
    """        if (inner && isW(T[inner.end], 'as') && isW(T[inner.end + 1], 'possible') && !mu) return { ja: 'できるだけ' + (isW(T[k0 + 1], 'many') ? '多くの' : 'たくさんの') + inner.ja, end: inner.end + 2, head: inner.head, an: inner.an, pl: inner.pl };   // as many vegetables as possible
        if (inner && isW(T[inner.end], 'as') && inner.end + 1 < lim && !mu) {
          // as much food as we need / as many books as you like → 必要なだけの食べ物・好きなだけの本""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
