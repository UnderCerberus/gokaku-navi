import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Even small changes, such as closing windows at night, may help … → 夜に窓を閉めることのような小さい変化さえ（such as + 動名詞: 目的語を返し、連体形を「〜ことのような」にする。「のようなの」にしない）
rep("""        if (idi) useIdiom(idi.it);
        return { ja: ja, adn: adnOf(ja), end: g.end, kind: 'other', prep: key || idi.toks.join(' '), obj: null };""",
    """        if (idi) useIdiom(idi.it);
        if (key === 'such as') return { ja: ja, adn: dict + 'ことのような', end: g.end, kind: 'other', prep: key, obj: { ja: dict + 'こと', end: g.end, gerund: true } };
        return { ja: ja, adn: adnOf(ja), end: g.end, kind: 'other', prep: key || idi.toks.join(' '), obj: null };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
