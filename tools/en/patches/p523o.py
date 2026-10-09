import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the more serious your illness may become → 病気はますます深刻になる（物の主語の serious は 深刻。真剣 にしない）
rep("""      let pr = h2.less ? (h2.become ? P(h2.adj.adv.replace(/に$/, '') + 'でなくなる', 'v5') : negAdj(h2.adj.pred)) : (h2.become ? becomeV(h2.adj) : h2.adj.pred);""",
    """      const adjX = h2.adj && /^真剣な?$/.test(h2.adj.raw || '') && sj2 && !sj2.an && !(sj2.pron && /^(?:i|you|he|she|we|they)$/.test(sj2.pron)) ? en.jp.adj('深刻な') : h2.adj;   // your illness may become more serious → 深刻
      let pr = h2.less ? (h2.become ? P(adjX.adv.replace(/に$/, '') + 'でなくなる', 'v5') : negAdj(adjX.pred)) : (h2.become ? becomeV(adjX) : adjX.pred);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
