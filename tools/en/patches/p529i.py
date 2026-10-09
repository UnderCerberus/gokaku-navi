import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# are required by law to donate … → 法律で〜することが求められている（by law は副詞の決まり文句。法律 to donate を「寄付するための法律」にしない）
rep("""    [['a great deal', '大いに'], ['no matter what', '何があっても'],""",
    """    [['a great deal', '大いに'], ['no matter what', '何があっても'], ['by law', '法律で'],""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
