import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# This means that it reaches stores while it is still fresh and that less fuel is burned along the way
# → つまり、それはまだ新鮮なうちに店に着き、途中で燃やされる燃料もより少ないということだ（This means that A and that B は that 節の並列）
rep("""      const mMn = mark();
      const cMn = sentence(a + 3, b, { sub: true });""",
    """      const mMn = mark();
      const kAt = T.findIndex((x, q) => q > a + 4 && q < b - 2 && isW(x, 'and') && isW(T[q + 1], 'that'));
      if (kAt > 0) {
        const c1At = sentence(a + 3, isP(T[kAt - 1], ',') ? kAt - 1 : kAt, { sub: true });
        const c2At = c1At ? sentence(kAt + 2, b, { sub: true }) : null;
        if (c1At && c2At) { name('that-clause'); const pastAt = T[a + 1].w === 'meant'; return wrap({ out: () => 'つまり、' + c1At.out({ part: 'が', form: 'te' }).replace(/だろう$/, 'し') + '、' + c2At.out({ part: 'が' }) + (pastAt ? 'ということだった' : 'ということだ'), sp: 'SVO' }); }
        fail(mMn);
      }
      const cMn = sentence(a + 3, b, { sub: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
