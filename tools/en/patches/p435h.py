import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Luckily, は従来どおり 運よく、
rep("""interestingly: '興味深いことに', luckily: '幸運にも', sadly: '悲しいことに',""",
    """interestingly: '興味深いことに', luckily: '運よく', sadly: '悲しいことに',""")

rep("""    ja = ja.replace(/(ユネスコ|国連|政府|世界保健機関)に(.{1,30}?)として(?:認識|認め)られている/, '$1によって$2として認められている').replace(/として認識されている/g, 'として認められている');""",
    """    ja = ja.replace(/として認識されている/g, 'として認められている').replace(/(ユネスコ|国連|政府|世界保健機関)に(.{1,30}?)として認められている/, '$1によって$2として認められている');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
