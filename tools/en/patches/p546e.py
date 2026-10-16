import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# have exactly the same temperature → まったく同じ温度だ（p545v で「まったく・ほとんど」が前に付いた「同じ〜」も、have + 同じ〜 の規則で読む）
rep("""    if (L === 'have' && objs.length === 1 && !vg.passive && /^同じ/.test(""",
    """    if (L === 'have' && objs.length === 1 && !vg.passive && /^(?:まったく|ほとんど|だいたい)?同じ/.test(""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
