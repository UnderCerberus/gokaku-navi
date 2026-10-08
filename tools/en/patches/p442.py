import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# look through the documents → 書類に目を通す（紛らわしい熟語でも、目的語が文書類なら使う）
rep("""    'go over ~': /^(?:agenda|plan|plans|details|report|reports|notes|homework|answers|answer|schedule|document|documents|rules|contract|lesson|lessons|mistakes|figures|list)$/,""",
    """    'go over ~': /^(?:agenda|plan|plans|details|report|reports|notes|homework|answers|answer|schedule|document|documents|rules|contract|lesson|lessons|mistakes|figures|list)$/,
    'look through ~': /^(?:document|documents|paper|papers|file|files|report|reports|magazine|magazines|book|books|notes|newspaper|newspapers|album|albums|photos|pictures|list|catalog|catalogue|menu|letters|mail|emails|data|textbook|textbooks|notebook|notebooks|drawer|drawers|bag|pockets)$/,""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'please hold the line': 'そのままお待ちください', 'hold the line please': 'そのままお待ちください', 'hold the line': 'そのままお待ちください', """)

rep("""    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""",
    """    ja = ja.replace(/(?:物|物事|すべて|それ)は外に機能する/g, (m0) => m0.replace(/^物は/, '物事は').replace(/外に機能する/, 'うまくいく')).replace(/外に機能した/g, 'うまくいった').replace(/外に機能する/g, 'うまくいく').replace(/^私は(.+?)だろうと確信している(。?)$/, 'きっと$1だろう$2').replace(/速く(消|片付|処理|対応)/g, 'すばやく$1');   // Things will work out → 物事はうまくいくだろう / I'm sure he will come → きっと彼が来るだろう
    if (tokens.some((x) => /^(?:pass|passes|passed)$/.test(x.w || '')) && tokens.some((x) => /^(?:you|he|she|i|we|they|everyone)$/.test(x.w || '')) && !tokens.some((x) => /^(?:by|through|away|the|a|an|me|him|her|it|them|us)$/.test(x.w || ''))) ja = ja.replace(/通り過ぎる/g, '合格する').replace(/通り過ぎた/g, '合格した');   // I'm sure that you will pass → きっとあなたは合格するだろう
    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
