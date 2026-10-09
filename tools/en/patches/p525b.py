import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# spent all her savings → 自分の貯金（所有格 + savings は「貯金」。the savings grew larger の「節約」はそのまま）
rep("""  function postMod(node, lim, o) {
    if (o.noPost && !(node.pron && /^(?:i|you|he|she|we|they|it)$/.test(node.pron))) return node;""",
    """  function postMod(node, lim, o) {
    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 1], 'savings') && /^(?:my|your|his|her|its|our|their|life)$/.test(T[node.end - 2].w || '') && /節約/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace('節約', '貯金') });
    if (o.noPost && !(node.pron && /^(?:i|you|he|she|we|they|it)$/.test(node.pron))) return node;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
