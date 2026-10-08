import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', """, """'for half an hour': '30分間', 'once in a blue moon': 'ごくまれに', """)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'it is up in the air': 'まだ決まっていない', 'that is up in the air': 'それはまだ決まっていない', 'it is a piece of cake': '朝飯前だ', 'it was a piece of cake': '朝飯前だった', 'piece of cake': '朝飯前だ', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    if (tokens.some((x, q) => x.w === 'piece' && tokens[q + 1] && tokens[q + 1].w === 'of' && tokens[q + 2] && tokens[q + 2].w === 'cake') && tokens.some((x) => /^(?:is|was|be|are|were)$/.test(x.w || ''))) ja = ja.replace(/は(?:1つの|1切れの)?ケーキ(?:を1切れ)?(だ|だった)(?=。|$)/, 'はとても簡単$1');   // The test was a piece of cake → 試験はとても簡単だった
    ja = ja.replace(/私に腕と脚を犠牲にした/, '大金がかかった').replace(/は自分の(父|母|両親|祖父|祖母)の目のりんごだ/, 'は$1にとって目に入れても痛くない存在だ');   // This car cost me an arm and a leg → 大金がかかった / the apple of her father's eye
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
