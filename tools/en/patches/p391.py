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
      else if (L === 'play' && /(?:^| )(?:song|songs|tune|tunes|piece|pieces|melody|melodies)$/.test(oh)) sense = { particle: 'を', core: '演奏する', tr: true };   // Now I can play three songs → 3曲演奏できる""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x, q) => x.w === 'at' && tokens[q + 1] && tokens[q + 1].w === 'first') && tokens.some((x) => /^(?:hurt|cut|put|hit|set|read|cost)$/.test(x.w || ''))) ja = ja.replace(/痛い(?=。|$)/, '痛かった');   // At first, my fingers hurt a lot → 最初は、指がとても痛かった
    if (tokens.some((x) => x.w === 'play') && tokens.some((x, q) => x.w === 'one' && tokens[q + 1] && tokens[q + 1].w === 'of' && tokens[q + 2] && tokens[q + 2].w === 'them')) ja = ja.replace(/彼らの1人をする/, 'そのうちの1曲を演奏する');   // play one of them → そのうちの1曲を演奏する
    if (tokens.some((x) => /^(?:go|goes|going|went)$/.test(x.w || '')) && tokens.some((x) => /^(?:bring|brings)$/.test(x.w || ''))) ja = ja.replace(/持ってこられる/g, '持って行ける').replace(/持ってくる(?=。|$|べき)/g, '持って行く');   // bring our own bags when we go shopping → 自分の袋を持って行ける
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
