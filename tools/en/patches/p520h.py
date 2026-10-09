import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a team of nurses much older than himself → 自分よりずっと年上の看護師（人の名詞 + older / younger than → 年上・年下。than + 再帰代名詞 → 自分）
rep("""          if (el || nn) { pick(k2, ac.e); name('comparative'); node = Object.assign({}, node, { ja: (el || nn.ja) + 'より' + degJ + en.jp.adj(ac.e.ja).attr + node.ja, end: el ? k2 + 3 : nn.end }); continue; }""",
    """          const anN = !!node.an || /(?:^| )(?:people|persons?|men|women|children|students|nurses|doctors|workers|players|friends|colleagues|brothers|sisters|siblings|adults)$/.test(node.head || '');
          const ajN = anN && ac.lemma === 'old' ? '年上の' : (anN && ac.lemma === 'young' ? '年下の' : en.jp.adj(ac.e.ja).attr);
          const thN = !el && nn && /^(?:himself|herself|themselves|myself|ourselves|yourself|yourselves)$/.test(T[k2 + 2].w || '') && nn.end === k2 + 3 ? '自分' : (el || nn.ja);
          if (el || nn) { pick(k2, ac.e); name('comparative'); node = Object.assign({}, node, { ja: thN + 'より' + degJ + ajN + node.ja, end: el ? k2 + 3 : nn.end }); continue; }""")
# He is older than me → 私より年上だ（人の主語 + older than）
rep("""anim && a.lemma === 'old' ? (mulDeg ? '年上' : '年をとった')""",
    """anim && a.lemma === 'old' ? (mulDeg || (a.form === 'comp' && isW(T[k + 1], 'than')) ? '年上' : '年をとった')""")
# lead a team / an expedition → 率いる
rep("""    'make|money fortune|を|稼ぐ', """,
    """    'make|money fortune|を|稼ぐ', 'lead|team teams group groups army armies expedition expeditions delegation organization organizations movement movements party band orchestra nation country company companies project projects troops|を|率いる', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
