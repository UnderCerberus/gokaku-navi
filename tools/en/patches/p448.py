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
      else if (L === 'improve' && /(?:^| )(?:mood|moods|feeling|feelings|spirits)$/.test(oh)) sense = { particle: 'を', core: '良くする', tr: true };   // improve our mood → 気分を良くする""")

rep("""    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい')""",
    """    ja = ja.replace(/自然で(?=[^、。]{0,6}(?:過ご|遊|歩|散歩|暮ら|生き))/g, '自然の中で').replace(/^(?:自分の)?(患者|生徒|子ども)(たち)?が(.+?)ように(さえ)?勧める(医者|人|親|先生|専門家)もいる/, (m0, a0, b0, c0, d0, e0) => a0 + (b0 || '') + 'に' + c0 + 'ように勧める' + e0 + (d0 ? 'さえいる' : 'もいる'));   // spending time in nature → 自然の中で時間を過ごす / Some doctors even recommend that their patients walk … → 患者に…ように勧める医者さえいる
    if (tokens.some((x, q) => x.w === 'known' && tokens[q + 1] && tokens[q + 1].w === 'as')) ja = ja.replace(/この練習/g, 'この習慣');   // This practice, known as forest bathing → 森林浴として知られるこの習慣
    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
