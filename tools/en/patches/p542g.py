import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the father had to ask me to repeat → 父親は / the mother told me → 母親は（the / a + father / mother は話し手の父母ではない。「父」「母」にしない）
rep("""    if (node && !node.pron && node.end >= 1 && isW(T[node.end - 1], 'strengths') && /力$/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace(/力$/, '長所') });""",
    """    if (node && !node.pron && node.end >= 1 && isW(T[node.end - 1], 'strengths') && /力$/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace(/力$/, '長所') });
    if (node && !node.pron && node.end >= 2 && /^(?:mother|father|mothers|fathers)$/.test(T[node.end - 1].w || '') && /(?:母|父)(?:たち)?$/.test(node.ja || '') && (/^(?:the|a|an|this|that|these|those)$/.test(T[node.end - 2].w || '') || (node.end >= 3 && /^(?:the|a|an|this|that|these|those)$/.test(T[node.end - 3].w || '') && !!adjC(T[node.end - 2]))) && !/^(?:my|our|your)$/.test(T[node.end - 2].w || '')) node = Object.assign({}, node, { ja: node.ja.replace(/母(たち)?$/, '母親$1').replace(/父(たち)?$/, '父親$1') });""")

# ask me to repeat several things → いくつかのことを繰り返す（言う・説明する・学ぶ などの目的語の things は「こと」。「いくつかの物」にしない）
rep("""    let core = P(sense.core), sp = 'SV';""",
    """    if (objs.length && /^(?:thing|things)$/.test(objs[objs.length - 1].head || '') && /.物$/.test(objs[objs.length - 1].ja || '') && /^(?:repeat|say|explain|tell|learn|teach|do|try|ask|forget|discuss|mention|hear|think|write|share|notice|understand|know|experience|enjoy|realize|realise)$/.test(L)) objs[objs.length - 1] = Object.assign({}, objs[objs.length - 1], { ja: objs[objs.length - 1].ja.replace(/物$/, 'こと') });
    let core = P(sense.core), sp = 'SV';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
