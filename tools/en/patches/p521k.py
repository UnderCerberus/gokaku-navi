import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She ate the cake she had made → 彼女は自分が作ったケーキを食べた（主語と同じ代名詞が目的語の関係詞節の主語なら「自分が」）
rep("""    // 主語と同じ人の所有格（I ... my ~ / He ... his ~）は「自分の」にするか省く
    const ps = subj && subj.pron ? POSS[subj.pron] : null;""",
    """    // 主語と同じ人の所有格（I ... my ~ / He ... his ~）は「自分の」にするか省く
    const ps = subj && subj.pron ? POSS[subj.pron] : null;
    const PJS = subj && subj.pron ? ({ i: '私', we: '私たち', he: '彼', she: '彼女', they: '彼ら' })[subj.pron] : null;
    if (PJS) cl.parts = cl.parts.map((x) => (new RegExp('^' + PJS + 'が[^、。]*?(?:た|だ|る|ている|ていた|でいる|でいた|ない)[^、。をにがでへのとは]{1,10}(?:を|に|で|から|へ)$').test(x) ? '自分が' + x.slice(PJS.length + 1) : x));   // she ate the cake she had made → 自分が作ったケーキを""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
