import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# he himself insists that … → 彼自身は（主語の直後の強調の再帰代名詞。後ろが述語のときだけ）
rep("""  function postMod(node, lim, o) {
    if (o.noPost) return node;
    for (let guard = 0; guard < 4; guard++) {
      const j = node.end, t = T[j];
      if (j >= lim || !t) break;
""",
    """  function postMod(node, lim, o) {
    if (o.noPost && !(node.pron && /^(?:i|you|he|she|we|they|it)$/.test(node.pron))) return node;
    for (let guard = 0; guard < 4; guard++) {
      const j = node.end, t = T[j];
      if (j >= lim || !t) break;
      if (t.k === 'w' && /^(?:himself|herself|themselves|itself|myself|ourselves|yourself|yourselves)$/.test(t.w) && T[j + 1] && T[j + 1].k === 'w' && (!!MODAL[T[j + 1].w] || !!BE[T[j + 1].w] || !!HAVE[T[j + 1].w] || !!DO[T[j + 1].w] || (!!vc(T[j + 1], ['3sg', 'past', 'base']) && !nounC(T[j + 1])) || (!!ADV[T[j + 1].w] && /^(?:also|never|always|often|still|really|clearly)$/.test(T[j + 1].w))) &&
        ((node.pron && ({ he: 'himself', she: 'herself', they: 'themselves', it: 'itself', i: 'myself', we: 'ourselves', you: 'yourself' })[node.pron] === t.w) || (!node.pron && node.head && ((node.pl && t.w === 'themselves') || (!node.pl && /^(?:itself|himself|herself)$/.test(t.w)))))) {
        node = Object.assign({}, node, { ja: (node.ja || '') + '自身', end: j + 1, selfEmph: true });   // he himself → 彼自身 / the idea itself → その考え自体
        if (!node.pron && t.w === 'itself') node.ja = node.ja.replace(/自身$/, '自体');
        continue;
      }
      if (o.noPost) break;
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
