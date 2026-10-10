import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# useful for recording experiments or taking photos of what is written on the board → 実験を記録したり…写真を撮ったりするために（前置詞 + 動名詞 or / and 動名詞）
rep("""      const g = vpNonfin(jg, lim, 'ing', { stop: true });
      if (g) {
        name('gerund');
        if (preG) g.parts = [preG].concat(g.parts);
        const dict = vpJoin(g, 'dict');""",
    """      let g = vpNonfin(jg, lim, 'ing', { stop: true });
      let g2c = null;
      if (g && g.end + 1 < lim && T[g.end].k === 'w' && /^(?:or|and)$/.test(T[g.end].w) && ingVerb(g.end + 1, lim)) {
        const mGc = mark();
        g2c = vpNonfin(g.end + 1, lim, 'ing', { stop: true });
        if (!g2c) fail(mGc);
      }
      if (g) {
        name('gerund');
        if (preG) g.parts = [preG].concat(g.parts);
        const dict = g2c ? vpJoin(g, 'past') + 'り、' + vpJoin(g2c, 'past') + 'りする' : vpJoin(g, 'dict');
        if (g2c) g = Object.assign({}, g, { end: g2c.end, pred: P(vpJoin(g2c, 'past') + 'りする', 'suru'), parts: [vpJoin(g, 'past') + 'り、'] });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
