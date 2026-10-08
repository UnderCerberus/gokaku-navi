import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'ahead of schedule': '予定より早く', 'behind schedule': '予定より遅れて', 'on schedule': '予定どおりに', 'ahead of time': '前もって', """)

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    ja = ja.replace(/((?:正しい|適切な)?(?:語|言葉|単語|答え|数字))で空欄に記入/g, '空欄に$1を記入');   // fill in the blanks with the correct words → 空欄に正しい語を記入""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
