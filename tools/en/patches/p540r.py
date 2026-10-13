import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# entering the contest again next year → 来年またコンテストに出場する（コンテスト・大会・レースの enter は「出場する」。「コンテストに入る」にしない）
rep("""      else if (L === 'enter' && /^(?:password|passwords|name|names|address|addresses|code|codes|data|number|numbers|information|text|pin|email|id)$/.test(oh))""",
    """      else if (L === 'enter' && !vg.passive && /(?:^| )(?:contest|contests|competition|competitions|race|races|tournament|tournaments|championship|championships|marathon|marathons|match|olympics|games|election|elections)$/.test(oh)) sense = { particle: 'に', core: oh === 'election' || oh === 'elections' ? '立候補する' : '出場する', tr: true };
      else if (L === 'enter' && /^(?:password|passwords|name|names|address|addresses|code|codes|data|number|numbers|information|text|pin|email|id)$/.test(oh))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
