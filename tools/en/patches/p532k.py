import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# forgive themselves for procrastinating / forgave him for breaking the vase → 先延ばしにしたことで自分を許す（B が動名詞なら「〜したことで」。「することのことで」にしない）
rep("""        const ja2 = it.ja.replace(/A/, '\\u0001').replace(/B/, '\\u0002').replace(a.ja ? '\\u0001' : /\\u0001(?:を|に|が|と|の)?/, a.ja).replace('\\u0002', b.ja);""",
    """        const gerPast = !!b.gerund && /こと$/.test(b.ja || '') && /Bのことで/.test(it.ja);   // forgive A for doing → 〜したことで
        const itJa = gerPast ? it.ja.replace('Bのことで', 'Bで') : it.ja;
        if (gerPast) b = Object.assign({}, b, { ja: P(b.ja.replace(/こと$/, '')).form('past') + 'こと' });
        const ja2 = itJa.replace(/A/, '\\u0001').replace(/B/, '\\u0002').replace(a.ja ? '\\u0001' : /\\u0001(?:を|に|が|と|の)?/, a.ja).replace('\\u0002', b.ja);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
