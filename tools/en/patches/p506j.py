import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# We bought a cake for us → 自分のために（主語と同じ人の「〜のために」は省かず 自分の にする。これまでは「ために」だけが残った）
rep("""      cl.parts = cl.parts.map((x) => x.split(ps).join(rp));""",
    """      cl.parts = cl.parts.map((x) => x.split(ps + 'ため').join('\\u0003').split(ps).join(rp).split('\\u0003').join('自分のため'));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
