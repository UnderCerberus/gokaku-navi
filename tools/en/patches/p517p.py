import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# only a small portion of it is fresh water → そのごく一部だけが淡水だ（だけ の主語は が）
rep("""(sj.bare ? '' : (cl.also ? (cl.niSubj ? 'にも' : 'も') : (sj.wh ? 'が' :""",
    """(sj.bare ? '' : (cl.also ? (cl.niSubj ? 'にも' : 'も') : (sj.wh || (!o.part && /だけ$/.test(sj.ja) && !cl.neg) ? 'が' :""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
