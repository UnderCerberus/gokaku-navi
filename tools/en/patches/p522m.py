import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# has been cited thousands of times → 何千回も引用された / I have told you hundreds of times → 何百回も（何千時間も にしない）
rep("""    'next door': '隣に', 'right now': '今すぐ', 'no longer': 'もはや',""",
    """    'next door': '隣に', 'right now': '今すぐ', 'no longer': 'もはや',
    'thousands of times': '何千回も', 'hundreds of times': '何百回も', 'dozens of times': '何十回も', 'millions of times': '何百万回も', 'countless times': '数えきれないほど', 'numerous times': '何度も',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
