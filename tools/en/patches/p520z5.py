import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The town, which used to depend on fishing → 漁業に頼っていた（産業の名詞の depend on は 頼っている。によって決まる にしない）
rep("""/^(?:bee|bees|animal|animals|insect|insects|water|oil|gas|food|tourism|trade|imports|exports|rain|sun|help|others|parents|farmers|technology|computers|machines|cars|electricity|coal|forests|rivers|fish|time|signal|signals|satellites|gps|pollination|internet)$/.test(obj.head || '')""",
    """/^(?:bee|bees|animal|animals|insect|insects|water|oil|gas|food|tourism|trade|imports|exports|rain|sun|help|others|parents|farmers|technology|computers|machines|cars|electricity|coal|forests|rivers|fish|time|signal|signals|satellites|gps|pollination|internet|fishing|agriculture|farming|mining|forestry|industry|manufacturing|tourists|aid|donations|volunteers)$/.test(obj.head || '')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
