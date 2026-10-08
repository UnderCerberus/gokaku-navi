import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# page ten → page 10
rep(""".replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv')""",
    """.replace(/\\b([Pp]ages?) (one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty)\\b/g, (m0, p0, n0) => p0 + ' ' + ({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50 })[n0]).replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv')""")

# Two and three make five → 2と3を足すと5になる
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // Two and three make five → 2と3を足すと5になる / Ten minus four equals six → 10から4を引くと6になる
    {
      const numAt = (k) => (T[k] && (T[k].k === 'num' || NUMW[T[k].w] !== undefined) ? (T[k].k === 'num' ? Number(T[k].w) : NUMW[T[k].w]) : null);
      const aN = numAt(0), bN = numAt(2), cN = numAt(4);
      if (b === 5 && aN !== null && bN !== null && cN !== null && T[1].k === 'w' && T[3].k === 'w' && /^(?:make|makes|equal|equals|is|are)$/.test(T[3].w)) {
        const opN = ({ and: '足すと', plus: '足すと', minus: '引くと', times: '掛けると' })[T[1].w];
        if (opN) return { ok: true, ja: aN + (T[1].w === 'minus' ? 'から' : 'と') + bN + 'を' + opN + cN + 'になる。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    if (tokens.some((x, q) => /^(?:get|bring)$/.test(x.w || '') && tokens[q + 1] && /^(?:me|us)$/.test(tokens[q + 1].w || ''))) ja = ja.replace(/を得て(くれますか|くれませんか|いただけませんか|ください)/, 'を持ってきて$1');   // Can you get me some water? → 水を持ってきてくれますか
    ja = ja.replace(/([0-9０-９]+)ページに([^、。]{1,10}?)で回って/, '$2の$1ページを開いて');   // Please turn to page 32 in your textbook → 教科書の32ページを開いてください
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
