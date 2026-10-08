import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'how are you doing': '元気にしていますか', 'write back soon': '返事を待っています', 'please write back soon': '返事を待っています', 'write soon': 'また手紙をください', """)

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x) => /^(?:make|makes|made|making)$/.test(x.w || '')) && tokens.some((x) => x.w === 'into')) ja = ja.replace(/を([^、。]{1,14}?)に作(る|った|って|り)/, (m0, a0, b0) => 'を' + a0 + 'に' + ({ 'る': 'する', 'った': 'した', 'って': 'して', 'り': 'し' })[b0]);   // make the clay into the shape → 粘土を形にする
    ja = ja.replace(/、今私は/g, '、今では私は');   // …, and now I can make … → 今では私は…作れる
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
