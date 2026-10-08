import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'in recent months': 'ここ数か月で', 'in recent weeks': 'ここ数週間で', 'in recent days': 'ここ数日で', """)

rep(""".replace(/何(千|百|万)もの(訪問者|観光客|人々|人|学生|生徒|ファン|客|見物人|参加者|ボランティア)/g, '何$1人もの$2');""",
    """.replace(/何(千|百|万)もの(訪問者|観光客|人々|人|学生|生徒|ファン|客|見物人|参加者|ボランティア|労働者|従業員|社員|兵士|難民|住民)/g, '何$1人もの$2');""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/(計画|プロジェクト|考え|事業)は([^、。]*?)捨てられた/g, '$1は$2断念された').replace(/注目すべき能力/g, '驚くべき能力').replace(/繁栄している(観光|産業|経済)/g, '盛んな$1').replace(/観光業の産業/g, '観光産業');   // The plan was abandoned → 計画は断念された / a thriving tourism industry → 盛んな観光産業
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
