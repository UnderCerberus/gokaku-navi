import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# he managed to travel around Europe → ヨーロッパ中を何とか旅行した / walked around the city → 都市中を歩いた（移動の動詞 + around + 地域 → 〜中を。周りで にしない）
rep("""      case 'around': case 'about':
""",
    """      case 'around': case 'about':
        if (key === 'around' && !obj.pron && !obj.num && (/^(?:europe|asia|africa|america|japan|china|korea|india|australia|canada|france|italy|spain|germany|britain|england|scotland|ireland|mexico|brazil|russia|egypt|thailand|vietnam|tokyo|kyoto|osaka|hokkaido|okinawa|kyushu|london|paris|rome|new york|hawaii|california)$/.test(obj.head || '') || /^(?:world|country|countries|city|cities|town|towns|region|regions|island|islands|continent|globe|area|village|campus|park|neighborhood|neighbourhood|museum|museums|school|town)$/.test(obj.head || '')) && T.some((x) => x.k === 'w' && /^(?:travel|travels|traveled|travelled|traveling|travelling|walk|walks|walked|walking|tour|tours|toured|touring|wander|wanders|wandered|wandering|cycle|cycled|cycling|hike|hiked|hiking|sail|sailed|sailing|journey|journeyed|backpack|backpacked)$/.test(x.w))) return R(n + '中を', 'other', n + '中の');
""")
# for an entire summer → ひと夏の間ずっと / for a whole day → 丸一日（全体の夏のために にしない）
rep("""    'next door': '隣に', 'right now': '今すぐ', 'no longer': 'もはや',""",
    """    'next door': '隣に', 'right now': '今すぐ', 'no longer': 'もはや',
    'for an entire summer': 'ひと夏の間ずっと', 'for a whole summer': 'ひと夏の間ずっと', 'for an entire winter': 'ひと冬の間ずっと', 'for a whole winter': 'ひと冬の間ずっと',
    'for an entire day': '丸一日', 'for a whole day': '丸一日', 'for an entire week': '丸一週間', 'for a whole week': '丸一週間', 'for an entire month': '丸一か月', 'for a whole month': '丸一か月',
    'for an entire year': '丸一年', 'for a whole year': '丸一年', 'for an entire night': '一晩中', 'for a whole night': '一晩中', 'an entire day': '丸一日', 'a whole day': '丸一日',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
