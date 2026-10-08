import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep(""".replace(/(?:その|今)?月の終わりまでに/g, '今月中に')""",
    """.replace(/([0-9０-９]+月)の終わりまでに/g, '$1末までに').replace(/(?<![0-9０-９])(?:その|今)?月の終わりまでに/g, '今月中に')""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'you did a great job': 'よくやったね', 'you did a good job': 'よくできたね', 'you did a wonderful job': 'すばらしい出来だったね', """)

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'pull' && /(?:^| )(?:weed|weeds|grass|tooth|teeth|nail|nails|carrot|carrots|radish|radishes)$/.test(oh) && !T.slice(i, lim).some((x) => /^(?:out|up|off)$/.test(x.w || '') && false)) sense = { particle: 'を', core: '抜く', tr: true };   // pulled weeds → 雑草を抜いた""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x) => /^(?:has|have|had|owns|own|owned)$/.test(x.w || ''))) ja = ja.replace(/([^、。はがをにで]{1,8})で((?:小さい|小さな|大きい|大きな|古い|新しい|すてきな)?(?:農場|家|店|別荘|レストラン|会社|工場|畑|土地|アパート))を持っ/, '$1に$2を持っ');   // has a small farm in Nagano → 長野に小さな農場を持っている
    ja = ja.replace(/自分の誇りに思/g, '自分を誇りに思');   // felt proud of herself → 自分を誇りに思った
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
