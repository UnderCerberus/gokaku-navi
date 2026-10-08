import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""  const WEATHER = set('hot cold warm cool sunny rainy cloudy windy snowy dark fine clear late early');""",
    """  const WEATHER = set('hot cold warm cool sunny rainy cloudy windy snowy dark fine clear late early humid muggy chilly foggy stormy freezing');""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'it looks like rain': '雨が降りそうだ', 'it looks like snow': '雪が降りそうだ', 'it is pouring': '土砂降りだ', 'it is pouring outside': '外は土砂降りだ', 'it is freezing': 'ひどく寒い', 'it is freezing cold': 'ひどく寒い', 'it is freezing today': '今日はひどく寒い', 'it is freezing cold today': '今日はひどく寒い', 'it is freezing outside': '外はひどく寒い', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/^梅雨は始まった/, '梅雨に入った').replace(/^(?:私たちは|ここは)([^、。]{0,8}?)(雪|雨)がたくさんあった/, '$1は$2がたくさん降った').replace(/^は/, '').replace(/シャワーの機会/g, 'にわか雨の可能性').replace(/(雨|雪)の機会/g, '$1の可能性');   // The rainy season has started → 梅雨に入った / We had a lot of snow last winter → 去年の冬は雪がたくさん降った / a chance of showers → にわか雨の可能性
    if (tokens[0] && tokens[0].w === 'it' && tokens.some((x) => /^(?:cleared|clears|clear)$/.test(x.w || '')) && tokens.some((x) => x.w === 'up')) ja = ja.replace(/^それは/, '');   // It cleared up in the afternoon → 午後に晴れた
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
