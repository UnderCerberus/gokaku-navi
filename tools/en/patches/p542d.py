import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I remembered my teacher's advice to relax → くつろぐようにという先生の助言を思い出した
# （advice / order / request / instruction + to 不定詞は名詞の内容「〜するようにという」。「くつろぐために先生の助言を覚えていた」にしない）
rep("""    'motivation willingness determination freedom capacity urge temptation incentive ambition eagerness reluctance refusal intention obligation responsibility duty strength patience confidence motive');""",
    """    'motivation willingness determination freedom capacity urge temptation incentive ambition eagerness reluctance refusal intention obligation responsibility duty strength patience confidence motive ' +
    'advice order orders request requests instruction instructions suggestion suggestions warning warnings reminder invitation invitations');""")

rep("""        const beki = gap2.used && !/^(?:effort|attempt|decision|plan|desire|wish|promise|ability|chance|opportunity|way|tendency|courage|need|power|permission|reason|right|time|place|places|money|room|space|seat|seats|house|home|food|""",
    """        if (/^(?:advice|order|orders|request|requests|instruction|instructions|suggestion|suggestions|warning|warnings|reminder|invitation|invitations)$/.test(node.head || '') && !gap2.used) return Object.assign({}, node, { ja: s.replace(/こと$/, '') + 'ようにという' + node.ja, end: inf.end });
        const beki = gap2.used && !/^(?:effort|attempt|decision|plan|desire|wish|promise|ability|chance|opportunity|way|tendency|courage|need|power|permission|reason|right|time|place|places|money|room|space|seat|seats|house|home|food|""")

rep("""      const noGap2 = /^(?:motivation|""",
    """      const noGap2 = /^(?:advice|order|orders|request|requests|instruction|instructions|suggestion|suggestions|warning|warnings|reminder|invitation|invitations|motivation|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
