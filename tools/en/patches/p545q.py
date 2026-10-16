import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# To my disappointment, … → がっかりしたことに、（To my surprise と同じく文頭の決まり文句。「私ががっかりしたことに」にしない）
rep("""'to my surprise': '驚いたことに'""",
    """'to my surprise': '驚いたことに', 'to my disappointment': 'がっかりしたことに', 'to my great disappointment': 'とてもがっかりしたことに', 'to my horror': 'ぞっとしたことに', 'to my embarrassment': '恥ずかしいことに', 'to my regret': '残念なことに'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
