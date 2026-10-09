import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# end up in a small town abroad → 外国の小さい町に（場所・経験の名詞 + abroad は名詞にかける）
rep("""  function postMod(node, lim, o) {
    if (o.noPost) return node;
    for (let guard = 0; guard < 4; guard++) {
      const j = node.end, t = T[j];
      if (j >= lim || !t) break;""",
    """  function postMod(node, lim, o) {
    if (o.noPost) return node;
    for (let guard = 0; guard < 4; guard++) {
      const j = node.end, t = T[j];
      if (j >= lim || !t) break;
      if (isW(t, 'abroad') && node.head && !node.pron && /^(?:town|towns|city|cities|village|villages|country|countries|university|universities|school|schools|job|jobs|company|companies|year|life|experience|experiences|trip|trips|friend|friends|family|relatives|student|students)$/.test(node.head) && (j + 1 >= lim || T[j + 1].k === 'p' || (T[j + 1].k === 'w' && (PREP[T[j + 1].w] || /^(?:and|but|or|is|was|are|were)$/.test(T[j + 1].w))))) { node = Object.assign({}, node, { ja: '外国の' + node.ja.replace(/^(?:1つの|ある)/, ''), end: j + 1 }); continue; }   // a small town abroad → 外国の小さい町""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
