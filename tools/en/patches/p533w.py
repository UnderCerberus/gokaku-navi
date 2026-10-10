import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Good point, so let's ask everyone … → いい指摘だね。それなら…（会話の文頭の応答 + コンマ）
rep("""    'weather permitting': '天気がよければ', 'so to speak': 'いわば', 'in turn': '今度は'""",
    """    'weather permitting': '天気がよければ', 'so to speak': 'いわば', 'in turn': '今度は', 'good point': 'いい指摘だね。', 'good idea': 'いい考えだね。', 'great idea': 'すばらしい考えだね。'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
