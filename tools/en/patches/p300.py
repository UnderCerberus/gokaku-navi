import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Open your mouth wide → 口を大きく開けなさい
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\b([Oo]pen|opens|opened|opening) (your|my|his|her|their|the|our) (mouth|eyes|door|window|windows|arms|box) wide\\b/g, '$1 $2 $3 wideadv').replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""")
rep("""    const SURF = { wwtwo: 'World War II',""", """    const SURF = { wideadv: 'wide', wwtwo: 'World War II',""")
rep("""overthere: ['あそこに', 'p'],""", """overthere: ['あそこに', 'p'], wideadv: ['大きく', 'm'],""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'my nose is stuffy': '鼻が詰まっている', 'i have a stuffy nose': '鼻が詰まっている', 'i have a runny nose': '鼻水が出る', 'i feel sick to my stomach': '吐き気がする', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    if (tokens.some((x) => x.w === 'rest') && tokens.some((x) => /^(?:get|gets|got|getting)$/.test(x.w || ''))) ja = ja.replace(/(?:いくらかの|少しの)?休憩をとる/, '少し休む');   // You should get some rest → 少し休むべきだ
    if (tokens.some((x) => /^(?:shot|shots)$/.test(x.w || '')) && tokens.some((x) => /^(?:hospital|doctor|clinic|flu|nurse|vaccine|vaccines|arm|dentist)$/.test(x.w || ''))) ja = ja.replace(/発砲/g, '注射').replace(/病院に注射を受け/, '病院で注射を受け');   // I got a shot at the hospital → 病院で注射を受けた
    ja = ja.replace(/悪い(せき|風邪|頭痛|腹痛|歯痛|熱|けが)/g, 'ひどい$1').replace(/(せき|鼻水)がある/g, '$1が出る').replace(/から離れて落ち/g, 'から落ち').replace(/(頭痛|腹痛|風邪|せき|熱)のために薬を持っていますか/, '$1に効く薬はありますか').replace(/熱の中で(気を失|倒れ)/, '暑さで$1');   // I have a bad cough → ひどいせきが出る / I fell off my bike → 自転車から落ちた
    ja = ja.replace(/背中を傷つけ/g, '腰を痛め').replace(/(ひざ|膝|脚|足|腕|肩|手首|足首|首|腰)を傷つけ/g, '$1を痛め').replace(/壊された(脚|足|腕|骨|指|手首|足首)/g, '骨折した$1').replace(/^(彼|彼女|私)は骨折した(脚|足|腕)で入院している/, '$1は$2を骨折して入院している');   // I hurt my back → 腰を痛めた / He's in the hospital with a broken leg → 脚を骨折して入院している
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
