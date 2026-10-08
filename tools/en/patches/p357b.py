import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/([^、。]{1,16}?)に恥ずかしい思いをさせられ(た|る|て)/g, (m0, a0, b0) => a0 + 'を恥ずかしく思' + ({ 'た': 'った', 'る': 'う', 'て': 'って' })[b0]);   // He was embarrassed by his mistake → 自分の間違いを恥ずかしく思った""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
