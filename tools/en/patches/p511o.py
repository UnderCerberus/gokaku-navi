import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# pay for the rising cost of medical care → 医療費の上昇をまかなう（pay for + 費用・教育・治療 → まかなう。「代金を払う」にしない）
rep("""        if (obj.clause && it.it && /^find out/.test(it.it.phrase)) jaT = '〜分かる';""",
    """        if (obj.clause && it.it && /^find out/.test(it.it.phrase)) jaT = '〜分かる';
        if (it.it && it.it.phrase === 'pay for ~' && /(?:^| )(?:cost|costs|expense|expenses|care|treatment|treatments|education|research|program|programs|service|services|tuition|fee|fees|pension|pensions|welfare|insurance|project|projects)$/.test(obj.head || '')) jaT = '〜をまかなう';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
