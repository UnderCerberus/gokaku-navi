import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# whether you enjoy the work you do every day → あなたが毎日する仕事を楽しむかどうか（関係詞節の主語 you が節の主語と同じなら省く）
rep("""    const PJS = subj && subj.pron ? ({ he: '彼', she: '彼女', they: '彼ら' })[subj.pron] : null;
""",
    """    const PJS = subj && subj.pron ? ({ he: '彼', she: '彼女', they: '彼ら' })[subj.pron] : null;
    if (subj && subj.pron === 'you') cl.parts = cl.parts.map((x) => (/^あなたが[^、。]*?(?:た|だ|る|ている|ていた|でいる|でいた|ない)[^、。をにがでへのとは]{1,10}(?:を|に|で|から|へ|の)$/.test(x) ? x.slice(4) : x));   // you enjoy the work you do → 毎日する仕事を
""")
# how much you earn → いくら稼ぐか（いくら・いくつ に を をつけない）
rep("""          return { end: i + 2, type: 'np', node: { ja: nx.w === 'many' ? 'いくつ' : (knowMuch ? 'どれほど多くのこと' : 'いくら'), wh: true } };""",
    """          return { end: i + 2, type: 'np', node: { ja: nx.w === 'many' ? 'いくつ' : (knowMuch ? 'どれほど多くのこと' : 'いくら'), wh: true, bare: !knowMuch } };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
