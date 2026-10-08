import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'leave' && /(?:^| )(?:message|messages|note|notes|voicemail|comment|comments|tip|tips|review|reviews)$/.test(oh)) sense = { particle: 'を', core: '残す', tr: true };""",
    """      else if (L === 'leave' && /(?:^| )(?:message|messages|note|notes|voicemail|comment|comments|tip|tips|review|reviews)$/.test(oh)) sense = { particle: 'を', core: '残す', tr: true };
      else if (L === 'leave' && /(?:^| )(?:trash|garbage|litter|rubbish|waste|cans|bottles|cigarette|butts)$/.test(oh) && !vg.passive) sense = { particle: 'を', core: '残す', tr: true };   // never leave trash on the mountain → 山にごみを残してはいけない""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x) => x.w === 'prepared') && tokens.some((x) => /^(?:i|you|we|they|he|she|everyone|people|students)$/.test(x.w || ''))) ja = ja.replace(/([^、。]{1,10}?)のために準備されていますか/, '$1の準備はできていますか').replace(/([^、。]{1,10}?)のために準備されなかった/, '$1に備えていなかった').replace(/([^、。]{1,10}?)のために準備された/, '$1に備えていた').replace(/([^、。]{1,10}?)のために準備されている/, '$1に備えている').replace(/準備されていなかったら/, '準備ができていなければ').replace(/準備されていますか/, '準備ができていますか').replace(/準備されていない/, '準備ができていない').replace(/準備されている/, '準備ができている');   // Are you prepared for the test? → 試験の準備はできていますか / if you are not prepared → 準備ができていなければ
    ja = ja.replace(/どこに行っているか/g, 'どこに行くのか').replace(/つもりであるか/g, 'つもりなのか').replace(/(のか|るか|たか)と(いつ|どこ|何|誰|なぜ|どう)/g, '$1、$2').replace(/余分の/g, '余分な').replace(/(山|公園|浜辺|海岸|道|川|森|キャンプ場)でごみを残/g, '$1にごみを残').replace(/(ハイキング|キャンプ|釣り|買い物|散歩|料理|読書|旅行|スキー|スケート|サイクリング|ジョギング)をすることを楽しむ/g, '$1を楽しむ');   // tell someone where you are going and when you plan to return → どこに行くのか、いつ戻るつもりなのか / extra water → 余分な水
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
