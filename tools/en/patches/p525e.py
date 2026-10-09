import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# nobody can beat my mother → 誰も母に勝てない（破る はチーム・固有名詞・対戦相手だけ。家族・友達など一般の人は 勝つ）
rep("""      else if (L === 'beat' && !objs[0].pron && (objs[0].an || /^[ァ-ヴー]+$/.test(objs[0].ja || '') || !!PN[oh] ||""",
    """      else if (L === 'beat' && !objs[0].pron && ((objs[0].an && !/(?:^| )(?:mother|father|mom|dad|parent|parents|brother|brothers|sister|sisters|friend|friends|son|sons|daughter|daughters|wife|husband|uncle|aunt|cousin|cousins|grandmother|grandfather|classmate|classmates|teacher|teachers|man|woman|boy|girl|child|children|person|people|kid|kids)$/.test(oh)) || /^[ァ-ヴー]+$/.test(objs[0].ja || '') || !!PN[oh] ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
