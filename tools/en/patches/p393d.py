import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'improve' && /(?:^| )(?:skill|skills|ability|abilities|english|japanese|level|technique|techniques|performance|grades)$/.test(oh)) sense = { particle: 'を', core: '向上させる', tr: true };   // improve communication skills → コミュニケーション能力を向上させる""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x) => /^(?:games|game)$/.test(x.w || '')) && tokens.some((x) => /^(?:video|computer|online|board|card|mobile|smartphone|teach|learn|learning|educational|puzzle|children|kids|play|playing|played|plays|fun)$/.test(x.w || '')) && !tokens.some((x) => /^(?:team|teams|match|won|lost|win|lose|score|scored|soccer|baseball|tennis|basketball|stadium|tournament|watched|watch)$/.test(x.w || ''))) ja = ja.replace(/試合/g, 'ゲーム');   // some games can help children learn → ゲーム
    ja = ja.replace(/十分なお金を持って(いた|いる)/g, 'お金が十分たまって$1').replace(/(彼|彼女|私|彼ら)自身を誇りに思/g, '自分を誇りに思');   // he finally had enough money → ついにお金が十分たまっていた / He was proud of himself → 自分を誇りに思った
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
