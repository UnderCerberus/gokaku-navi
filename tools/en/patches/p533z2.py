import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Her last class is on the 28th, so we could show the video … → 見せられる（現在の文 + , so の後ろの could は可能性。「見せられた」にしない）
rep("""|| modalStart ? null : sentence(rs, b, o);   // and then circles back to repeat the pattern（circles は動詞）""",
    """|| modalStart ? null : sentence(rs, b, w === 'so' && !left.past && !left.perfect ? Object.assign({}, o, { mainPresent: true }) : o);   // and then circles back to repeat the pattern（circles は動詞）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
