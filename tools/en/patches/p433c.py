import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'by half': '半分に', """)

rep("""    ja = ja.replace(/私的な生活/g, '私生活')""",
    """    ja = ja.replace(/記録の(利益|売上|高さ|気温|数|人数|量|収益)/g, '過去最高の$1').replace(/大きく([^、。]{1,10}?)に頼る(?=。|$)/g, '$1に大きく依存している').replace(/大きく([^、。]{1,10}?)に頼っている/g, '$1に大きく依存している').replace(/(.+?)は(.+?)に飲まれるべきではない/, '$1は$2が飲んではいけない');   // reported record profits → 過去最高の利益 / depends heavily on tourism → 観光業に大きく依存している
    ja = ja.replace(/私的な生活/g, '私生活')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
