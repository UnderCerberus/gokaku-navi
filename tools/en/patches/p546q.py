import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# run the last leg of the relay → リレーの最後の区間を走る / ran the rest of the way → 残りを走った（走る道のりの名詞を目的語にとる run は「走る」。「経営する」にしない）
rep("""      else if (L === 'run' && (/^(?:meter|meters|kilometer|kilometers|mile|miles|marathon|marathons|race|races|lap|laps|distance|course|km|m)$/.test(oh)""",
    """      else if (L === 'run' && (/^(?:meter|meters|kilometer|kilometers|mile|miles|marathon|marathons|race|races|lap|laps|distance|course|km|m|leg|legs|relay|relays|way|rest|stretch|track|route|length|sprint|sprints|half)$/.test(oh)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
