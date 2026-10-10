import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Constant exposure to loud noise → 大きい騒音に絶え間なくさらされること / Long exposure to the sun → 太陽に長くさらされること / exposure to English → 英語に触れること
# （exposure + to: 前の形容詞は副詞にして「〜に…さらされること・触れること」。「騒音への絶え間ない触れること」にしない）
rep("""          if (node.head && CTX_N[node.head] && pp.obj && pp.obj.head && CTX_N[node.head][pp.obj.head] && node.c && node.c.e) ja1 = ja1.replace(en.jp.first(node.c.e.ja), CTX_N[node.head][pp.obj.head]);""",
    """          if (node.head && CTX_N[node.head] && pp.obj && pp.obj.head && CTX_N[node.head][pp.obj.head] && node.c && node.c.e) ja1 = ja1.replace(en.jp.first(node.c.e.ja), CTX_N[node.head][pp.obj.head]);
          if (node.head === 'exposure' && pp.prep === 'to' && pp.obj && pp.obj.ja && node.c && node.c.e && ja1.slice(-en.jp.first(node.c.e.ja).length) === en.jp.first(node.c.e.ja)) {
            const preE = ja1.slice(0, -en.jp.first(node.c.e.ja).length);
            const sarE = /(?:^| )(?:noise|noises|sound|sounds|sun|sunlight|light|radiation|smoke|pollution|pollutants|chemical|chemicals|heat|cold|violence|stress|danger|dangers|rain|wind|virus|viruses|disease|diseases|germs|bacteria|dust|toxins|rays|screen|screens|risk|risks|cigarette|cigarettes|alcohol|lead|mercury|pesticides)$/.test(pp.obj.head || '');
            const vE = sarE ? 'さらされること' : '触れること';
            const advE = /い$/.test(preE) && !/(?:この|その|あの|どの)$/.test(preE) ? preE.replace(/い$/, 'く') : (/な$/.test(preE) ? preE.replace(/な$/, 'に') : '');
            node = Object.assign({}, node, { ja: (advE || !preE ? '' : preE) + pp.obj.ja + 'に' + advE + vE, end: pp.end }); continue;
          }""")

# the amount of exposure to sunlight → 日光にさらされる量（既存の置換を「にさらされることの量」にも）
rep("""replace(/([^、。をがは]{1,10})への触れることの量/g, '$1に触れる量')""",
    """replace(/([^、。をがは]{1,10})(への触れる|にさらされる|に触れる)ことの量/g, (m0, a0, b0) => a0 + (b0 === 'への触れる' ? 'に触れる' : b0) + '量')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
