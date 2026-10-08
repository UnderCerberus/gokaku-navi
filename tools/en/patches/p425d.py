import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""|special|annual|charity|sports|music|school|online|big|fun|start|starts|started|begin|begins|began|end|ends|ended|finish|finishes|charge|organize|organizes|organized|prepare|prepared)$/.test(x.w || ''))) ja = ja.replace(/出来事/g, 'イベント');""",
    """|special|annual|charity|sports|music|school|online|big|fun|start|starts|started|begin|begins|began|end|ends|ended|finish|finishes|charge|organize|organizes|organized|prepare|prepared|reading|free|sign|register|library|museum|admission|volunteer|volunteers|summer|winter|local|community|club)$/.test(x.w || ''))) ja = ja.replace(/出来事/g, 'イベント').replace(/(読書|音楽|スポーツ|チャリティー|地域|学校)のイベント/g, '$1イベント').replace(/(イベント|入場|チケット|コンサート|レッスン|参加)は自由(だ|です|で)/g, '$1は無料$2');   // Summer Reading Event → 夏の読書イベント / The event is free → イベントは無料だ""")

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    ja = ja.replace(/シティ(図書館|博物館|美術館|動物園|病院|公園|プール|体育館|ホール)/g, '市立$1');   // the City Library → 市立図書館""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
