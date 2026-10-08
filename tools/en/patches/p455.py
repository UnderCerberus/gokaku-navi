import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# master's degree → 修士号（所有格の ' を含む決まった名詞）
rep(""".replace(/\\b[Tt]eachers' (?:room|office|lounge)\\b/g, 'staffroom')""",
    """.replace(/\\b[Tt]eachers' (?:room|office|lounge)\\b/g, 'staffroom').replace(/\\b([Mm])aster's degree\\b/g, '$1astersdegree').replace(/\\b([Bb])achelor's degree\\b/g, '$1achelorsdegree').replace(/\\b([Dd])octor's degree\\b/g, '$1octorsdegree')""")

rep("""    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')""",
    """    ja = ja.replace(/([0-9０-９]+)歳であるまで/g, '$1歳になるまで').replace(/学校を始めない/g, '学校に通い始めない').replace(/多くの他の国で(生徒|学生|人々|子ども)/g, 'ほかの多くの国の$1').replace(/^(.+?)は(.+?)より少ない([^、。]{1,6})がある(。?)$/, '$1は$2より$3が少ない$4').replace(/^(.+?)は(.+?)より多くの([^、。]{1,6})がある(。?)$/, '$1は$2より$3が多い$4').replace(/(?:よく|しばしば)?世界の一番いいものの間で位置づけられ/g, 'しばしば世界最高水準に位置づけられ');   // children do not start school until they are seven → 7歳になるまで学校に通い始めない / have less homework than … → …より宿題が少ない
    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
