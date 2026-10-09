import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# we will hold the festival outdoors as planned → 予定どおり / As usual, he was late → いつものように / It worked as expected → 予想どおり
rep("""    'next door': '隣に', 'right now': '今すぐ', 'no longer': 'もはや',""",
    """    'next door': '隣に', 'right now': '今すぐ', 'no longer': 'もはや',
    'as usual': 'いつものように', 'as always': 'いつものように', 'as planned': '予定どおり', 'as scheduled': '予定どおり', 'as expected': '予想どおり', 'as promised': '約束どおり', 'as predicted': '予測どおり', 'as agreed': '取り決めどおり', 'as requested': '求められたとおり', 'as instructed': '指示どおり',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
