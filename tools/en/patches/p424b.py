import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a new policy to reduce pollution → 汚染を減らすための新しい政策
rep("""    'tendency courage place money thing homework work');""",
    """    'tendency courage place money thing homework work policy policies measure measures law laws program programs campaign campaigns project projects strategy strategies system systems method methods step steps rule rules');""")
rep("""      const noGap2 = /^(?:time|chance|opportunity|reason|right|courage|energy|ability|effort|attempt|decision|plan|desire|wish|promise|tendency|power|permission)$/.test(node.head || '') && !node.pron;""",
    """      const noGap2 = /^(?:time|chance|opportunity|reason|right|courage|energy|ability|effort|attempt|decision|plan|desire|wish|promise|tendency|power|permission|policy|policies|measure|measures|law|laws|program|programs|campaign|campaigns|project|projects|strategy|strategies|system|systems|method|methods|step|steps|rule|rules)$/.test(node.head || '') && !node.pron;""")
rep("""        const beki = gap2.used && !/^(?:effort|attempt|decision|plan|desire|wish""",
    """        if (/^(?:policy|policies|measure|measures|law|laws|program|programs|campaign|campaigns|project|projects|strategy|strategies|system|systems|method|methods|step|steps|rule|rules)$/.test(node.head || '') && !gap2.used) return Object.assign({}, node, { ja: s + 'ための' + node.ja, end: inf.end });   // a new policy to reduce pollution → 汚染を減らすための新しい政策
        const beki = gap2.used && !/^(?:effort|attempt|decision|plan|desire|wish""")

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'test' && /(?:^| )(?:theory|theories|hypothesis|hypotheses|idea|ideas|assumption|assumptions|claim|claims|model|models|prediction|predictions)$/.test(oh)) sense = { particle: 'を', core: '検証する', tr: true };   // to test his theory → 理論を検証する
      else if (L === 'attract' && /(?:^| )(?:visitors|visitor|tourists|tourist|people|crowds|crowd|customers|fans|students|guests|spectators|attention)$/.test(oh) && !vg.passive) sense = { particle: 'を', core: /attention$/.test(oh) ? '集める' : '集める', tr: true };   // The festival attracts thousands of visitors → 何千人もの訪問者を集める""")

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    ja = ja.replace(/古代の(エジプト|ローマ|ギリシャ|中国|日本|インド|マヤ)/g, '古代$1').replace(/([^、。]{1,10}?)から(人工物|遺物|工芸品|美術品|化石)を展示/g, '$1の$2を展示').replace(/(銀行|会社|店|ホテル|病院|学校|レストラン|工場|図書館|博物館)で(仕事|職)に応募/g, '$1の$2に応募').replace(/あなたの健康に(良い|悪い)/g, '健康に$1');   // artifacts from ancient Egypt → 古代エジプトの遺物 / applied for a job at a bank → 銀行の仕事に応募した""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
