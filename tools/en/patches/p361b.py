import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""(AI|ロボット|機械|人工知能|コンピューター|自動化)が([^、。]{0,10}?)仕事を取(る|った|って|ら|り)/g, (m0, a0, b0, c0) => a0 + 'が' + b0 + '仕事を奪'""",
    """(AI|ロボット|機械|人工知能|コンピューター|自動化)(が|は)([^、。]{0,10}?)仕事を取(る|った|って|ら|り)/g, (m0, a0, p0, b0, c0) => a0 + p0 + b0.replace(/^自分の/, '人間の') + '仕事を奪'""")
rep("""    ja = ja.replace(/電池は少なくなっている/, '電池が切れかけている')""",
    """    if (tokens.some((x) => /^(?:log|login|password|passwords|sign|signed|create|created|delete|deleted|email|online|user|username|app|website|instagram|twitter|facebook|youtube|tiktok|hacked)$/.test(x.w || '')) && tokens.some((x) => /^(?:account|accounts)$/.test(x.w || ''))) ja = ja.replace(/説明/g, 'アカウント');   // Log in to your account → アカウントにログインする
    ja = ja.replace(/電池は少なくなっている/, '電池が切れかけている')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
