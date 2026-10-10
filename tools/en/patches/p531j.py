import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# make our cities more pleasant places to live / more comfortable shoes → より楽しい場所・より快適な靴（more + -er をとらない長い形容詞 + 名詞は比較級。より多くの にしない）
rep("""    if (isDet) {
      detW = t.w; det = DET[t.w]; j = i + 1;""",
    """    if (isDet) {
      detW = t.w; det = DET[t.w]; j = i + 1;
      if (t.w === 'more' && i + 2 < lim && T[i + 1].k === 'w' && !!adjC(T[i + 1]) && !cand(T[i + 1], '名', ['base', 'pl']) && !vc(T[i + 1], ['pp', 'past']) && !/(?:ed|y)$/.test(T[i + 1].w) && (T[i + 1].w.length >= 7 || /(?:ful|ous|ive|ble|ant|ent|ic)$/.test(T[i + 1].w)) &&
        T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !T.slice(i + 2, lim).some((x) => isW(x, 'than'))) det = 'より';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
