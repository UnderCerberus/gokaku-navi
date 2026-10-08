import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I'm glad you like it → あなたがそれを気に入ってうれしい（that の省略 + 原形の動詞）
rep("""&& T.slice(i + 1, lim).some((x) => x.k === 'w' && (!!vc(x, ['3sg', 'past']) || !!MODAL[x.w] || !!BE[x.w] || !!DO[x.w] || !!HAVE[x.w]))) {
      const thatTok = Object.assign({}, T[i + 1], { w: 'that', raw: 'that', cap: false, first: false });""",
    """&& (T.slice(i + 1, lim).some((x) => x.k === 'w' && (!!vc(x, ['3sg', 'past']) || !!MODAL[x.w] || !!BE[x.w] || !!DO[x.w] || !!HAVE[x.w])) || (/^(?:i|you|we|they)$/.test(T[i + 1].w) && T[i + 2] && T[i + 2].k === 'w' && !!vc(T[i + 2], ['base'])))) {
      const thatTok = Object.assign({}, T[i + 1], { w: 'that', raw: 'that', cap: false, first: false });""")

# We enjoyed singing songs → 歌を歌うことを楽しんだ（enjoy などの後の 〜ing + 名詞 は動名詞 + 目的語）
rep("""        (T[j].k === 'w' && !!vc(T[j], ['ing']) && !ingVerb(j, lim) && j + 1 < lim && T[j + 1].k === 'w' && !!nounC(T[j + 1]) && !PREP[T[j + 1].w]) ||   // rising sea levels / falling snow""",
    """        (T[j].k === 'w' && !!vc(T[j], ['ing']) && !ingVerb(j, lim) && j + 1 < lim && T[j + 1].k === 'w' && !!nounC(T[j + 1]) && !PREP[T[j + 1].w] && !(j > 0 && T[j - 1].k === 'w' && /^(?:enjoy|enjoys|enjoyed|enjoying|finish|finished|finishes|stop|stopped|stops|keep|kept|keeps|start|started|starts|begin|began|begins|practice|practiced|practices|avoid|avoided|mind|quit|quitted|like|likes|liked|love|loves|loved|hate|hates|hated|try|tried|consider|considered|imagine|miss|missed)$/.test(T[j - 1].w))) ||   // rising sea levels / falling snow（We enjoyed singing songs の singing は動名詞）""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/あなたがそれを好きで(うれしい|よかった)/g, '気に入ってもらえて$1');   // I'm glad you like it → 気に入ってもらえてうれしい
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
