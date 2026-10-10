import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Depending on the weather, we will go out / depending on the purpose of each lesson → 天気によって・目的に応じて（depending on は 2 語の前置詞）
rep("""'far from', 'away from', 'as for', 'as to', 'owing to', 'contrary to'];""",
    """'far from', 'away from', 'as for', 'as to', 'owing to', 'contrary to', 'depending on'];""")
rep("""    'because of': ['のために', 'other'], 'according to': ['によれば', 'other'],""",
    """    'because of': ['のために', 'other'], 'according to': ['によれば', 'other'], 'depending on': ['によって', 'other', 'に応じた'],""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
