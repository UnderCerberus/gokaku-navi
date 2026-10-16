import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It was as if my grandfather and I had been looking at the world … → まるで祖父と私が…世界を見ていたかのようだった
# It looks as if he is tired → まるで彼が疲れているかのように見える（it + be / look / seem / sound / feel + as if は「〜かのようだ」。「…かのように、それはあった」にしない）
rep("""    // It goes without saying that health is important → 健康が重要なのは言うまでもない
    if (seq(a, ['it', 'goes', 'without', 'saying', 'that']) && a + 5 < b) {""",
    """    if (isW(T[a], 'it') && a + 4 < b && T[a + 1].k === 'w' && /^(?:is|was|seems|seemed|looks|looked|sounds|sounded|feels|felt)$/.test(T[a + 1].w) && isW(T[a + 2], 'as') && /^(?:if|though)$/.test(T[a + 3].w || '')) {
      const mAi = mark();
      const cAi = sentence(a + 4, b, { sub: true });
      if (cAi) {
        name('idiom');
        const vAi = T[a + 1].w, pastAi = /^(?:was|seemed|looked|sounded|felt)$/.test(vAi);
        const tailAi = /^(?:is|was|seems|seemed)$/.test(vAi) ? (pastAi ? 'のようだった' : 'のようだ') : (/^(?:looks|looked)$/.test(vAi) ? (pastAi ? 'のように見えた' : 'のように見える') : (/^(?:sounds|sounded)$/.test(vAi) ? (pastAi ? 'のように聞こえた' : 'のように聞こえる') : (pastAi ? 'のように感じられた' : 'のように感じられる')));
        return wrap({ out: () => 'まるで' + cAi.out({ part: 'が', form: 'attr', past: cAi.perfect ? true : false }) + 'か' + tailAi, sp: 'SV' });
      }
      fail(mAi);
    }
    // It goes without saying that health is important → 健康が重要なのは言うまでもない
    if (seq(a, ['it', 'goes', 'without', 'saying', 'that']) && a + 5 < b) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
