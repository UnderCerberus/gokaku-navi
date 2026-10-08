import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'how long are you staying': 'どのくらい滞在する予定ですか', 'how long will you stay': 'どのくらい滞在する予定ですか', 'how long are you going to stay': 'どのくらい滞在する予定ですか', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/(休暇|旅行)の上のここにいる/, '$1でここに来ている').replace(/(ホテル|レストラン|便|飛行機|電車|旅館)は十分に予約され(た|ている)/, (m0, a0, b0) => a0 + 'は予約でいっぱい' + (b0 === 'た' ? 'だった' : 'だ')).replace(/戻ってそこに行く/g, 'またそこに行く');   // I'm here on vacation / The hotel was fully booked / go back there
    if (tokens.some((x, q) => x.w === 'will' && tokens[q + 1] && tokens[q + 1].w === 'be' && tokens[q + 2] && /ing$/.test(tokens[q + 2].w || '') && tokens[q + 2].w !== 'going') && /^(?:i|we)$/.test((tokens[0] || {}).w || '')) ja = ja.replace(/([一-龠ァ-ヶー]+)しているだろう(?=。|$)/, '$1する予定だ');   // I'll be staying for two weeks → 2週間滞在する予定だ
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
