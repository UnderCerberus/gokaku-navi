import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# start with something so small that it seems almost too easy → ほとんど簡単すぎるように思えるほど小さいもの
# （something / anything / someone + so + 形容詞 + that 節も「〜ほど…なもの・人」。名詞のときと同じ）
rep("""      if (isW(t, 'so') && !node.pron && j + 3 < lim && adjC(T[j + 1]) && isW(T[j + 2], 'that')) {
        const ms0 = mark(), a7 = adjC(T[j + 1]);
        const c7 = sentence(j + 3, lim, { sub: true });
        if (c7) { pick(j + 1, a7.e); name('so-that'); node = Object.assign({}, node, { ja: c7.out({ part: 'が', form: 'attr' }) + 'ほど' + en.jp.adj(a7.e.ja).attr + node.ja, end: lim }); continue; }""",
    """      if (isW(t, 'so') && (!node.pron || /^(?:something|anything|someone|anyone|somebody|anybody)$/.test(node.pron)) && j + 3 < lim && adjC(T[j + 1]) && isW(T[j + 2], 'that')) {
        const ms0 = mark(), a7 = adjC(T[j + 1]);
        const c7 = sentence(j + 3, lim, { sub: true });
        const hd7 = node.pron ? (/one|body/.test(node.pron) ? '人' : 'もの') : node.ja;
        if (c7) { pick(j + 1, a7.e); name('so-that'); node = Object.assign({}, node, { ja: c7.out({ part: 'が', form: 'attr' }) + 'ほど' + en.jp.adj(a7.e.ja).attr + hd7, end: lim, bare: false }); continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
