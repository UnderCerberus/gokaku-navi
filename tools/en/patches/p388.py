import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'that sounds nice': 'それはいいね', 'sounds nice': 'いいね', 'that sounds like fun': '楽しそうだね', 'that sounds interesting': 'おもしろそうだね', """)

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/何をするべきか決め/g, '何をするか決め').replace(/((?:北海道|東京|大阪|京都|沖縄|福岡|名古屋|アメリカ|カナダ|オーストラリア|イギリス|中国|韓国|フランス|ドイツ|田舎|[ァ-ヶー]{2,8}))で(祖父母|祖母|祖父|おじ|おば|いとこ|友達|両親|家族|姉|兄|妹|弟)を訪ね/g, '$1の$2を訪ね');   // decided what to do → 何をするか決めた / visit my grandparents in Hokkaido → 北海道の祖父母を訪ねる
    if (tokens[0] && tokens[0].w === 'how' && tokens[1] && tokens[1].w === 'long' && tokens[2] && tokens[2].w === 'will' && tokens[3] && tokens[3].w === 'you') ja = ja.replace(/^(?:あなたは)?どのくらい長く/, 'どのくらい').replace(/でしょうか(?=。|$)/, '予定ですか');   // How long will you stay there? → どのくらいそこに滞在する予定ですか
    if (tokens.some((x, q) => x.w === 'this' && tokens[q + 1] && tokens[q + 1].w === 'is' && tokens[q + 2] && tokens[q + 2].cap) && tokens.some((x) => /^(?:hello|hi|speaking|phone|call|calling)$/.test(x.w || ''))) ja = ja.replace(/これは([^、。]+?)だ(?=。|$)/, 'こちらは$1です');   // Hello, this is Mike → こんにちは、こちらはマイクです
    ja = ja.replace(/私は(彼女|彼|彼ら)に話すつもりだ(?=。|$)/, '$1に伝えておく');   // Sure, I'll tell her → 彼女に伝えておく
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
