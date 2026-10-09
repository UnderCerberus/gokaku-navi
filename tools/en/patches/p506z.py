import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Some people spend too much time looking at their screens → 自分の画面を見るのに…人もいる（人の主語の their は 自分の）
rep("""      if (pS) return s + cl.parts.join('') + (pastV ? pS.form('past') : pS.plain()) + sj.ja.replace(/^(?:何人かの|一部の|いくつかの)/, '')""",
    """      const selfS = (x) => (sj.an && T.some((y) => isW(y, 'their')) ? x.replace(/彼らの/g, '自分の') : x);
      if (pS) return s + selfS(cl.parts.join('') + (pastV ? pS.form('past') : pS.plain())) + sj.ja.replace(/^(?:何人かの|一部の|いくつかの)/, '')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
