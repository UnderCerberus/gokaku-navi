import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# read as many books as you can → できるだけ多くの本（できるだけの本 にしない）
rep("""            return { ja: NEEDV[T[vS].w] + 'だけの' + inner.ja, end: vS + 1, head: inner.head, an: inner.an, pl: inner.pl, asNeed: true };""",
    """            if (/^(?:can|could)$/.test(T[vS].w)) return { ja: 'できるだけ' + (isW(T[k0 + 1], 'many') ? '多くの' : 'たくさんの') + inner.ja, end: vS + 1, head: inner.head, an: inner.an, pl: inner.pl, asNeed: true };   // as many books as you can → できるだけ多くの本
            return { ja: NEEDV[T[vS].w] + 'だけの' + inner.ja, end: vS + 1, head: inner.head, an: inner.an, pl: inner.pl, asNeed: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
