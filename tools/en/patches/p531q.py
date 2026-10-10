import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# an umbrella left on a bench → ベンチに置き忘れられた傘 / the food left on the plate → 皿に残された食べ物（名詞 + left + 場所の前置詞句。去られた にしない）
rep("""    if (form && !node.pron && !o.noPart) {
      const v = vpNonfin(j, e, form, { subj: node });""",
    """    if (isW(t, 'left') && !node.pron && !o.noPart && j + 2 < e && T[j + 1].k === 'w' && /^(?:on|in|at|under|near|by|inside|outside|behind|beside)$/.test(T[j + 1].w)) {
      const mLf = mark();
      const ppLf = parsePP(j + 1, e, { noRel: true });
      if (ppLf && ppLf.obj && !ppLf.obj.time && !ppLf.obj.dur) {
        name('participle-mod');
        const belLf = /^(?:umbrella|umbrellas|bag|bags|key|keys|phone|phones|smartphone|wallet|wallets|purse|book|books|notebook|glasses|hat|coat|jacket|camera|ticket|passport|lunch|textbook|pencil case|suitcase|backpack|card|cards)$/.test(node.head || '');
        return Object.assign({}, node, { ja: ppLf.ja.replace(/で$/, 'に') + (belLf ? '置き忘れられた' : '残された') + node.ja, end: ppLf.end });
      }
      fail(mLf);
    }
    if (form && !node.pron && !o.noPart) {
      const v = vpNonfin(j, e, form, { subj: node });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
