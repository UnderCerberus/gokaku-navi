import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# not what you have but who you are → 何を持っているかではなく、どんな人であるか
rep("""      if (a3 && isW(T[a3.end], 'but') && a3.end + 1 < lim) {
        const b3 = np(a3.end + 1, lim, o);
        if (b3) { name('not-but'); return Object.assign({}, b3, { ja: a3.ja + 'ではなく' + b3.ja, end: b3.end, coord: true }); }
      }""",
    """      if (a3 && isW(T[a3.end], 'but') && a3.end + 1 < lim) {
        const b3 = np(a3.end + 1, lim, o);
        if (b3) { name('not-but'); return Object.assign({}, b3, { ja: a3.ja + 'ではなく' + b3.ja, end: b3.end, coord: true }); }
        if (T[a3.end + 1] && /^(?:who|where|when|why|how|whether)$/.test(T[a3.end + 1].w || '')) {
          const wB = whClause(a3.end + 1, lim);
          if (wB && wB.end === lim) { name('not-but'); return { ja: a3.ja + 'ではなく、' + wB.str.replace(/^あなたが誰か$/, 'あなたがどんな人か'), end: lim, coord: true }; }
        }
      }""")

# So great was his surprise → 驚きはとても大きかった / The more I learned, the less I understood → 理解できなくなった
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(驚き|ショック|喜び|悲しみ|痛み|損失|被害|違い|差|影響|成功|失望)は(とても|非常に|あまりに)?偉大(だった|だ)/g, (m0, a0, b0, c0) => a0 + 'は' + (b0 || '') + (c0 === 'だった' ? '大きかった' : '大きい'));   // So great was his surprise that … → 驚きはとても大きかったので
    ja = ja.replace(/ますます理解しなくなる(?=。|$)/, (m0) => (tokens.some((x) => /^(?:learned|learnt|understood|knew|read|studied|became|got)$/.test(x.w || '')) ? 'ますます分からなくなった' : 'ますます分からなくなる'));   // The more I learned, the less I understood
    if (tokens.some((x) => /^(?:matters|matter|important|counts)$/.test(x.w || ''))) ja = ja.replace(/あなたが誰か(?=だ|ということ|が|を|は|。|$)/, 'あなたがどんな人か');   // What matters is who you are → 大切なのはあなたがどんな人かだ
    if (tokens.some((x) => /^(?:success|succeed|succeeded|key|secret|result|results|thanks|through|requires|require|needs|achieve|achieved)$/.test(x.w || ''))) ja = ja.replace(/大変な仕事/g, '努力');   // Success is not luck but hard work → 成功は運ではなく努力だ""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
