import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The paintings by Monet / spending by consumers / a study by researchers → モネの絵画・消費者による支出・研究者たちによる研究（名詞のあとの by 句）
rep("""        if (pp && pp.kind !== 'agent') {
          // a few taps on a screen（画面の上の蛇口 → タップ: 前置詞句の名詞で語義を選ぶ）""",
    """        if (pp && pp.kind === 'agent' && pp.prep === 'by' && pp.obj && !node.pron && node.head && !node.time && !pp.obj.time &&
          /^(?:painting|paintings|novel|novels|book|books|song|songs|work|works|poem|poems|music|film|films|movie|movies|play|plays|opera|operas|symphony|symphonies|sculpture|sculptures|photo|photos|photograph|photographs|picture|pictures|story|stories|article|articles|essay|essays|speech|speeches|letter|letters|study|studies|survey|surveys|report|reports|research|analysis|spending|investment|investments|use|consumption|attack|attacks|decision|decisions|discovery|discoveries|invention|inventions|proposal|proposals|donation|donations|purchase|purchases|statement|statements|comment|comments|visit|visits|performance|performances|treatment|support|effort|efforts|action|actions)$/.test(node.head)) {
          const worksBy = /^(?:painting|paintings|novel|novels|book|books|song|songs|work|works|poem|poems|music|film|films|movie|movies|play|plays|opera|operas|symphony|symphonies|sculpture|sculptures|photo|photos|photograph|photographs|picture|pictures|story|stories|essay|essays)$/.test(node.head);
          node = Object.assign({}, node, { ja: pp.obj.ja + (worksBy ? 'の' : 'による') + node.ja, end: pp.end }); continue;
        }
        if (pp && pp.kind !== 'agent') {
          // a few taps on a screen（画面の上の蛇口 → タップ: 前置詞句の名詞で語義を選ぶ）""")

# in an attempt to slow inflation → インフレを抑えようとして / slow + 抽象名詞 → 抑える / fall into a recession → 景気後退に陥る
rep("""      else if (L === 'address' && /(?:^| )(?:concern|concerns""",
    """      else if (L === 'slow' && /(?:^| )(?:inflation|growth|spread|progress|pace|rate|rates|decline|process|aging|ageing|development|change|warming|loss|deforestation)$/.test(oh)) sense = { particle: 'を', core: '抑える', tr: true };   // slow inflation → インフレを抑える
      else if (L === 'address' && /(?:^| )(?:concern|concerns""")

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'over a period of time': '一定期間にわたって', 'over a long period of time': '長期間にわたって', """)

rep("""    ja = ja.replace(/、そのことが(それら|それ|彼ら|彼女|彼)を([^、。]+?)(く|に)した/g, '、そのため$1は$2$3なった');""",
    """    ja = ja.replace(/、そのことが(それら|それ|彼ら|彼女|彼)を([^、。]+?)(く|に)した/g, '、そのため$1は$2$3なった');
    if (tokens.some((x) => /^(?:inflation|deflation|interest|borrowing|lending|recession|monetary|central)$/.test(x.w || ''))) ja = ja.replace(/価格の一般的な水準/g, '物価水準').replace(/価格(が|は)(上が|下が|上昇|下落)/g, '物価$1$2').replace(/(より高い|より低い|高い|低い)?割合/g, (m0, a0) => (a0 ? a0.replace(/^より/, '') + '金利' : '金利')).replace(/借りること/g, '借り入れ').replace(/不況の中に落ち/g, '景気後退に陥').replace(/事業/g, '企業');   // Higher rates make borrowing more expensive → 高い金利は借り入れをより高くする / fall into a recession → 景気後退に陥る""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
