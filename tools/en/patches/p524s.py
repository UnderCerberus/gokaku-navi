import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# What would you spend it on? → それを何に費やすでしょうか（spend / waste + 文末の on の空所は「に」。何で にしない）
rep("""        const r0 = ppJa(key, o.gap.node, o);
        return { ja: r0.ja, adn: r0.adn, end: j, kind: r0.kind, prep: key, obj: o.gap.node };""",
    """        if (key === 'on' && /^(?:spend|waste)$/.test(o.lemma || '')) return { ja: o.gap.node.ja + 'に', adn: o.gap.node.ja + 'への', end: j, kind: 'other', prep: key, obj: o.gap.node };
        const r0 = ppJa(key, o.gap.node, o);
        return { ja: r0.ja, adn: r0.adn, end: j, kind: r0.kind, prep: key, obj: o.gap.node };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
