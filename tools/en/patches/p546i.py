import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a conversation with someone I miss → 私が会いたい誰か（関係詞の穴が miss の目的語で、先行詞が人なら「会いたい」。「逃す」にしない）
rep("""      else if (L === 'take' && /^(?:medicine|medicines|pill|pills|tablet|tablets|vitamin|vitamins|drug|drugs)$/.test(gaA)) sense = { particle: 'を', core: '飲む', tr: true };""",
    """      else if (L === 'take' && /^(?:medicine|medicines|pill|pills|tablet|tablets|vitamin|vitamins|drug|drugs)$/.test(gaA)) sense = { particle: 'を', core: '飲む', tr: true };
      else if (L === 'miss' && (/^(?:someone|somebody|person|people|friend|friends|family|mother|father|parents|grandmother|grandfather|grandparents|teacher|teachers|classmate|classmates|man|woman|girl|boy|one|ones)$/.test(gaA) || /^(?:someone|somebody|the one|those)$/.test(o.gap.antePron || ''))) sense = { particle: 'に', core: '会いたいと思う', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
