import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# something that you truly enjoy → あなたが本当に楽しむこと / something you can use → 使えるもの（関係詞節のつく something は 何か にしない）
rep("""    const headJa = node.pron === 'those' ? (thoseHd || '人々') : (node.pron === 'anyone' || node.pron === 'anybody' ? '人は誰でも'""",
    """    const headJa = node.pron === 'those' ? (thoseHd || '人々') : (node.pron === 'something' && node.ja === '何か' && /^(?:that|which|i|you|he|she|we|they)$/.test(t.w || '') ? (T.slice(Math.max(0, node.end - 3), node.end).some((x) => /^(?:say|said|says|do|did|does|done|tell|told|learn|learned|hear|heard|mention|mentioned)$/.test(x.w || '')) || T.slice(node.end, lim).some((x) => /^(?:say|said|says|do|did|does|done|tell|told|learn|learned|think|thought|know|knew|hear|heard|mention|mentioned|try|tried|plan|planned|hope|hoped|enjoy|enjoyed|enjoys|like|liked|likes|love|loved|loves|regret|regretted|remember|remembered|forget|forgot)$/.test(x.w || '')) ? 'こと' : 'もの') : (node.pron === 'anyone' || node.pron === 'anybody' ? '人は誰でも'""")

rep("""? node.ja.replace(/道$/, '方法') : node.ja)));   // the way companies think → 方法""",
    """? node.ja.replace(/道$/, '方法') : node.ja))));   // the way companies think → 方法""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
