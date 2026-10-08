import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'most of the day': '一日の大半', 'most of the time': 'たいてい', 'all day long': '一日中', """)

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(学校)は([0-9０-９]+日間)?閉まっていた/, '$1は$2休校になった').replace(/(彼|彼女)のしっぽを振/g, 'しっぽを振').replace(/(道路|道|町|家|畑|田んぼ|地下鉄|駅)は?(?:水浸しにされ|浸水させられ|氾濫させられ)(た|ていた)/g, (m0, a0, b0) => a0 + 'が冠水し' + b0);   // Our school was closed for three days → 学校は3日間休校になった / wags his tail → しっぽを振る / roads were flooded → 道路が冠水した
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
