import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# run the last leg of the class relay → クラスのリレーの最後の区間を走る
# （リレー・競走の leg は「区間」、旅の leg は「行程」。class + relay / team / trip などの class は「クラス」）
rep("""    if (nom.head === 'class' && !nom.pl && !nom.preJa && /^(?:my|our|your|their|his|her)$/.test(detW) && /授業$/.test(ja)) ja = ja.replace(/授業$/, 'クラス');""",
    """    if (/^legs?$/.test(nom.head || '') && /脚$/.test(ja) && T.some((x) => x.k === 'w' && /^(?:relay|relays|race|races|journey|journeys|trip|trips|tour|tours|voyage|flight)$/.test(x.w))) ja = ja.replace(/脚$/, T.some((x) => x.k === 'w' && /^(?:relay|relays|race|races)$/.test(x.w)) ? '区間' : '行程');
    if (/授業の(?:リレー|チーム|旅行|写真|代表|委員|パーティー|担任|全員|みんな|仲間|メンバー|選手|劇|合唱|文集)/.test(ja)) ja = ja.replace(/授業の(?=リレー|チーム|旅行|写真|代表|委員|パーティー|担任|全員|みんな|仲間|メンバー|選手|劇|合唱|文集)/, 'クラスの');
    if (nom.head === 'class' && !nom.pl && !nom.preJa && /^(?:my|our|your|their|his|her)$/.test(detW) && /授業$/.test(ja)) ja = ja.replace(/授業$/, 'クラス');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
