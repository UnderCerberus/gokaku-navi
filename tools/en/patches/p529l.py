import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# buying only what they will actually eat → 彼らが実際に食べるものだけ（what 節の will は「だろう」を付けない。食べる なら もの）
rep("""    if (cl && gap.used) { name('relative-what'); return { ja: cl.out({ part: 'が', form: 'attr' }) + (cl.pred && /(?:買う|ほしい|欲しい|食べる|飲む|読む|書く|作る|料理する|持っている|持つ|必要とする|得る|手に入れる|もらう|持ってくる|着る|売る|見つける|運ぶ|注文する|集める|選ぶ|料理する|残す|盗む|拾う)$/.test(cl.pred.plain()) && !cl.neg ? 'もの' : 'こと'), end: lim, clause: true }; }""",
    """    if (cl && gap.used) { name('relative-what'); const willW = cl.modal === 'will'; const outW = cl.out({ part: 'が', form: 'attr' }); const pW = cl.pred ? cl.pred.plain().replace(willW ? /だろう$/ : /$^/, '') : ''; return { ja: (willW ? outW.replace(/だろう$/, '') : outW) + (cl.pred && /(?:買う|ほしい|欲しい|食べる|飲む|読む|書く|作る|料理する|持っている|持つ|必要とする|得る|手に入れる|もらう|持ってくる|着る|売る|見つける|運ぶ|注文する|集める|選ぶ|料理する|残す|盗む|拾う)$/.test(pW) && !cl.neg ? 'もの' : 'こと'), end: lim, clause: true }; }""")

# 従属節・what 節の主語の they は、直前の複数名詞（their meals など）ではなく文頭の主語の名詞を受ける（Individuals … what they will eat → 彼ら）
rep("""    if (T[i].w === 'they' && i > 1 && T[i - 1].k === 'w' && /^(?:and|but|so|because|when|if|although|though|while|since|as|until|after|before)$/.test(T[i - 1].w)) {""",
    """    if (T[i].w === 'they' && i > 1 && T[i - 1].k === 'w' && (/^(?:and|but|so|because|when|if|although|though|while|since|as|until|after|before)$/.test(T[i - 1].w) || (/^(?:what|whatever)$/.test(T[i - 1].w) && !(T[0] && T[0].k === 'w' && PREP[T[0].w])))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
