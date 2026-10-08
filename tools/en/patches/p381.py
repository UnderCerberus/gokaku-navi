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
      else if (L === 'burn' && /(?:^| )(?:hand|hands|finger|fingers|arm|arms|leg|legs|face|tongue|mouth|skin|foot|feet|back)$/.test(oh)) sense = { particle: 'を', core: 'やけどする', tr: true };   // he burned his left hand badly → 左手をひどくやけどした""")

rep("""  const PN = dic({ 'oda nobunaga': '織田信長',""",
    """  const PN = dic({ 'anne frank': 'アンネ・フランク', 'helen keller': 'ヘレン・ケラー', 'mother teresa': 'マザー・テレサ', 'albert einstein': 'アルベルト・アインシュタイン', 'martin luther king': 'マーティン・ルーサー・キング', 'thomas edison': 'トーマス・エジソン', 'marie curie': 'マリー・キュリー', 'isaac newton': 'アイザック・ニュートン', 'leonardo da vinci': 'レオナルド・ダ・ヴィンチ', 'oda nobunaga': '織田信長',""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/^これのために、/, 'このため、').replace(/(日記|ノート|手紙|メモ帳|ブログ|作文)で書/g, '$1に書').replace(/人々に世界中で/g, '世界中の人々に');   // Because of this → このため / wrote … in a diary → 日記に書いた / read by people all over the world → 世界中の人々に読まれている
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
