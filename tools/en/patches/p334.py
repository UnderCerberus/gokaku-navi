import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'what is the date today': '今日は何月何日ですか', "what is today 's date": '今日は何月何日ですか', 'what is the date': '何月何日ですか', 'what day is it today': '今日は何曜日ですか', 'what day is today': '今日は何曜日ですか', 'what day is it': '何曜日ですか', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/どこに(夏休み中に|冬休み中に|春休み中に|週末に|休みの間に|先週末に|昨日|去年)/, '$1どこに').replace(/どのように(ここに|そこに|学校に|駅に|家に|ここまで)?(来|行|帰)/, (m0, a0, b0) => 'どうやって' + (a0 || '') + b0);   // Where did you go during the summer vacation? → 夏休み中にどこに行きましたか / How did you come here? → どうやってここに来ましたか
    if (q && tokens.some((x) => x.w === 'or')) {
      ja = ja.replace(/^(これ|それ|あれ)は([^、。]+?)か([^、。]+?)ですか(?=。|$)/, '$1は$2ですか、それとも$3ですか');   // Is this your pen or Mike's? → これはあなたのペンですか、それともマイクのものですか
      if (tokens[0] && /^(?:do|does)$/.test(tokens[0].w) && tokens.some((x) => /^(?:like|want|prefer)$/.test(x.w || ''))) ja = ja.replace(/^(?:あなたは)?([^、。か]{1,10})か([^、。が]{1,10})が(好き|ほしい)ですか(?=。|$)/, '$1と$2ではどちらが$3ですか');   // Do you like cats or dogs? → ネコと犬ではどちらが好きですか
    }
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
