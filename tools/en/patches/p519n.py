import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# cannot afford private lessons / a bicycle / medical treatment → 受ける・買う余裕がない
rep("""    'afford|car cars house houses home homes luxury luxuries ticket tickets computer computers phone phones clothes|を|買う余裕がある',""",
    """    'afford|car cars house houses home homes luxury luxuries ticket tickets computer computers phone phones clothes bicycle bicycles bike bikes|を|買う余裕がある', 'afford|lesson lessons education treatment surgery tuition|を|受ける余裕がある',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
