import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# twenty-four → 24（ハイフンつきの数詞）
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA').replace(/\\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)-(one|two|three|four|five|six|seven|eight|nine)\\b/gi, (m0, a0, b0) => String(({ twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 })[a0.toLowerCase()] + ({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 })[b0.toLowerCase()]))""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/光なしで(眠|寝)/g, '明かりがないと$1').replace(/([^、。]{1,6}?)のように形作られた/g, '$1の形をした').replace(/もう怖がっていなかった/g, 'もう怖くなかった').replace(/まだ([^、。]{1,10}?に)?([^、。]{1,10}?)を保つ(?=。|$)/, '今でも$1$2を置いている').replace(/1日に([0-9０-９]+時間)開いている/g, '1日$1開いている');   // a lamp shaped like a moon → 月の形をしたランプ / I still keep the lamp in my room → 今でも部屋にランプを置いている
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
