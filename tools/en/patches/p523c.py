import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Make sure it is something that you truly enjoy / Make sure it is clean → 必ず〜であるようにしてください（be の節も読む）
rep("""      if (cMs && cMs.pred && verbal(cMs.pred)) {
        name('imperative'); name('idiom');
        const omMs = cMs.subj && cMs.subj.pron === 'you' ? 'you' : null;""",
    """      if (cMs && cMs.pred && !verbal(cMs.pred) && !cMs.neg) {
        name('imperative'); name('idiom');
        const sMs2 = lead + '必ず' + cMs.out({ past: false, part: 'が' }).replace(/だろう$/, '').replace(/だ$/, 'である') + 'ようにしてください';   // make sure it is clean → 必ずそれがきれいであるようにしてください
        return { out: () => sMs2, sp: 'SV', imp: true, end: b };
      }
      if (cMs && cMs.pred && verbal(cMs.pred)) {
        name('imperative'); name('idiom');
        const omMs = cMs.subj && cMs.subj.pron === 'you' ? 'you' : null;""")
# It is something that you truly enjoy → それはあなたが本当に楽しむものだ（something / anything の強調構文にしない）
rep("""      if ((isW(T[n3.end], 'that') || isW(T[n3.end], 'who')) && n3.end + 1 < b) {
        const e0 = n3.end + 1;""",
    """      if ((isW(T[n3.end], 'that') || isW(T[n3.end], 'who')) && n3.end + 1 < b && !/^(?:something|anything|nothing|everything|someone|somebody|anyone|anybody)$/.test(n3.pron || '')) {
        const e0 = n3.end + 1;""")
# the cutting of trees → 木を切ること / the building of the pyramids → ピラミッドを建てること（the + 動作の -ing + of + 名詞）
rep("""    // the whole planet / the whole world → 惑星全体・全世界（時は じゅう）""",
    """    if (t.w === 'the' && i + 3 < lim && T[i + 1].k === 'w' && /^(?:cutting|felling|killing|hunting|catching|planting|growing|making|writing|reading|selling|buying|sharing|copying|collecting|producing|raising|protecting|destroying|clearing|building|burying|feeding|keeping|breeding)$/.test(T[i + 1].w) && !!vc(T[i + 1], ['ing']) && isW(T[i + 2], 'of')) {
      const mIg = mark();
      const nIg = np(i + 3, lim, { noRel: true, noCoord: o.noCoord });
      if (nIg) {
        const tIg = [T[i + 1]].concat(T.slice(i + 3, nIg.end));
        const vIg = withTokens(T.slice(0, i + 1).concat(tIg), () => vpNonfin(i + 1, i + 1 + tIg.length, 'ing', {}));
        if (vIg && vIg.end === i + 1 + tIg.length && vIg.parts.some((x) => /を$/.test(x))) return postMod({ ja: vpJoin(vIg, 'dict') + 'こと', end: nIg.end, gerund: true, head: 'thing' }, lim, o);   // the cutting of trees → 木を切ること
      }
      fail(mIg);
    }
    // the whole planet / the whole world → 惑星全体・全世界（時は じゅう）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
