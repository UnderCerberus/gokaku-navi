import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Dogs seem to show emotions that resemble our own → 私たち自身のものに似た感情 / different from our own → 私たち自身のものとは違う
# （名詞の続かない所有格 + own は「〜自身のもの」の代名詞）
rep("""    const m = mark();
    const t = T[i];
    {
      const kMm = /^(?:a|an)$/.test(t.w) ? i + 1 : i;""",
    """    const m = mark();
    const t = T[i];
    if (/^(?:my|your|his|her|our|their)$/.test(t.w) && isW(T[i + 1], 'own') && (i + 2 >= lim || T[i + 2].k !== 'w' || (!nounC(T[i + 2]) && !adjC(T[i + 2])) || /^(?:and|or|but|because|when|if|that|which|who|as|than)$/.test(T[i + 2].w) || !!PREP[T[i + 2].w])) {
      const POWN = { my: '私', your: 'あなた', his: '彼', her: '彼女', our: '私たち', their: '彼ら' };
      return { ja: POWN[t.w] + '自身のもの', end: i + 2, pron: 'own', pl: false };
    }
    {
      const kMm = /^(?:a|an)$/.test(t.w) ? i + 1 : i;""")

# a bakery of my own → 自分のパン屋（名詞 + of + 所有格 + own は「自分の〜」）
rep("""      if (isW(t, 'of') && !node.pron && j + 1 < lim) {
        const m0 = mark();""",
    """      if (isW(t, 'of') && !node.pron && j + 2 < lim + 1 && /^(?:my|your|his|her|our|their)$/.test((T[j + 1] || {}).w || '') && isW(T[j + 2], 'own') && (j + 3 >= lim || T[j + 3].k !== 'w' || !nounC(T[j + 3]) || !!PREP[T[j + 3].w] || /^(?:where|which|that|who|when)$/.test(T[j + 3].w))) {
        node = Object.assign({}, node, { ja: '自分の' + node.ja.replace(/^(?:1つの|ある)/, ''), end: j + 3 }); continue;
      }
      if (isW(t, 'of') && !node.pron && j + 1 < lim) {
        const m0 = mark();""")

# open a bakery / open a shop → パン屋を開く（店・会社などの open は「開く」。「開ける」にしない）
rep("""      else if (L === 'enter' && !vg.passive && /(?:^| )(?:contest|contests|""",
    """      else if (L === 'open' && !vg.passive && !objs[0].num && /(?:^| )(?:shop|shops|store|stores|bakery|bakeries|restaurant|restaurants|cafe|cafes|café|business|businesses|company|companies|school|schools|hospital|hospitals|museum|museums|office|offices|clinic|clinics|hotel|hotels|bar|bars|branch|branches|factory|factories|salon|studio|bookstore|bookstores|market|markets)$/.test(oh)) sense = { particle: 'を', core: '開く', tr: true };
      else if (L === 'enter' && !vg.passive && /(?:^| )(?:contest|contests|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
