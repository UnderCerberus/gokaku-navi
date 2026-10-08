import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""    challenging: 'やりがいのある', rewarding: 'やりがいのある', misleading: '誤解を招く', overwhelming: '圧倒的な', refreshing: 'さわやかな' });""",
    """    challenging: 'やりがいのある', rewarding: 'やりがいのある', misleading: '誤解を招く', overwhelming: '圧倒的な', refreshing: 'さわやかな',
    relaxing: 'くつろげる', calming: '心が落ち着く', soothing: '心が安らぐ', exhausting: 'とても疲れる', thrilling: 'わくわくする', inspiring: '刺激的な', touching: '感動的な', terrifying: '恐ろしい', pleasing: '心地よい', disgusting: 'むかつく', irritating: 'いらいらさせる', depressing: '気がめいる', entertaining: '楽しい' });""")
rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'develop' && /(?:^| )(?:imagination|skill|skills|ability|abilities|talent|talents|creativity|confidence|strength|muscles|personality|character|sense|potential)$/.test(oh)) sense = { particle: 'を', core: '伸ばす', tr: true };   // develop their imagination → 想像力を伸ばす
      else if (L === 'develop' && /(?:^| )(?:habit|habits)$/.test(oh)) sense = { particle: 'を', core: '身につける', tr: true };""")
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(彼ら|彼|彼女|私たち)が\1の/g, '$1が自分の').replace(/(子ども|子どもたち|赤ちゃん|息子|娘|弟|妹|孫)に読(む|んだ|んで|ま|み)/g, (m0, a0, b0) => a0 + 'に本を読み聞かせ' + ({ 'む': 'る', 'んだ': 'た', 'んで': 'て', 'ま': 'な', 'み': '' })[b0]);   // read to their children → 子どもたちに本を読み聞かせる
    ja = ja.replace(/^([^、。]+?)(?:という)?ことは本当だが、/, (m0, a0) => '確かに' + a0.replace(/^([^、。]{1,14}?)が/, '$1は').replace(/である$/, 'だ') + 'が、');   // It is true that smartphones are useful, but … → 確かにスマートフォンは役に立つが、""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
