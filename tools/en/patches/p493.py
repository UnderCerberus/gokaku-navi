import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'without thinking': '何も考えずに', 'without a word': 'ひと言も言わずに', 'without hesitation': 'ためらわずに', 'without a doubt': '間違いなく', """)

# develop + photo / film → 現像する
rep("""      else if (L === 'commit' && /(?:^| )(?:crime|crimes""",
    """      else if (L === 'develop' && /(?:^| )(?:photo|photos|film|films|picture|pictures|photograph|photographs)$/.test(oh)) sense = { particle: 'を', core: '現像する', tr: true };   // develop the film → フィルムを現像する
      else if (L === 'commit' && /(?:^| )(?:crime|crimes""")

rep("""    ja = ja.replace(/電話に答え/g, '電話に出')""",
    """    ja = ja.replace(/([^、。をがは]{1,12})の([^、。をがは]{1,12}?で)写真を撮/g, '$2$1の写真を撮').replace(/(写真|フィルム)が開発され/g, '$1が現像され').replace(/平和なように見え/g, '穏やかに見え').replace(/ちょうど(?:あちこち)?(それ|これ|あれ)?(を)?持ち歩/g, (m0, a0, b0) => 'ただ' + (a0 || '') + (b0 || '') + '持ち歩').replace(/まだ時々/g, '今でも時々');   // took pictures of people in the park → 公園で人々の写真を撮った / When the photo was developed → 写真が現像されたとき
    ja = ja.replace(/^さて、([0-9０-９]+)(年|か月|週間|日)後に、/, 'それから$1$2たった今、');   // Now, twenty years later, … → それから20年たった今、
    ja = ja.replace(/電話に答え/g, '電話に出')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
