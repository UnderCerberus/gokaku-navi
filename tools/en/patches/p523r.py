import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 内蔵長文の既存の置換（something + 関係詞節 → こと・もの のあとも同じ訳にする）
rep(""".replace(/^それぞれの場合では機械は仕事をよくやって、人は時間を得るが、練習だけゆっくりと維持できる何かが消える/,""",
    """.replace(/^それぞれの場合では機械は仕事をよくやって、人は時間を得るが、練習だけゆっくりと維持できる(?:何か|もの|こと)が消える/,""")
rep("""      if (/再び創造する努力では、読者は辞書が彼らに与えられない何かを学ぶかもしれない。?$/.test(left.ja))""",
    """      if (/再び創造する努力では、読者は辞書が彼らに与えられない(?:何か|こと|もの)を学ぶかもしれない。?$/.test(left.ja))""")

rep(""".replace(/^私が([^、。]+?)たい何かがある/, '$1たいことがある')""",
    """.replace(/^私が([^、。]+?)たい(?:何か|こと|もの)がある/, '$1たいことがある')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
