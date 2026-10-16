import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the fisherman's family and hers had helped each other → 漁師の家族と彼女の家族は助け合っていた
# （p544y で名詞を補った所有代名詞は、補った名詞と同じく人の名詞として扱う。「お互い役に立っていた」にしない）
rep("""items[q] = Object.assign({}, x, { ja: x.ja.replace(/もの$/, en.jp.first(hdPs.e.ja)) }); });""",
    """items[q] = Object.assign({}, x, { ja: x.ja.replace(/もの$/, en.jp.first(hdPs.e.ja)), an: !!first.an, pron: undefined, head: first.head }); });""")

# The two families → 2つの家族（助数詞の表にある人の名詞は表の助数詞を使う）
rep("""    if (c && isPerson(c)) return n + '人の';
    if (c && COUNTER[c.lemma]) return n + COUNTER[c.lemma] + 'の';""",
    """    if (c && isPerson(c) && !COUNTER[c.lemma]) return n + '人の';
    if (c && COUNTER[c.lemma]) return n + COUNTER[c.lemma] + 'の';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
