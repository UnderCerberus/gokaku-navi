import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# so that it would not open → 開かないように（目的の so that の would / will は「だろう」にしない）
rep("""      case 'so that': return S('attr', false) + 'ように、';""",
    """      case 'so that': return S('attr', false).replace(/だろう$/, '') + 'ように、';""")

# while it was cooking / The soup was cooking on the stove → 調理されている（物の主語 + 目的語のない cook）
rep("""    if (vg.lemma === 'suffer' && !vg.passive && !o.hasObj && sj && !anim""",
    """    if (vg.lemma === 'cook' && !vg.passive && !o.hasObj && sj && !anim && (!sj.pron || sj.pron === 'it' || sj.pron === 'they') && /^料理する$/.test(p.plain()) && (sj.pron || /(?:^| )(?:soup|rice|meat|fish|egg|eggs|food|dumpling|dumplings|vegetables|potatoes|pasta|noodles|beans|stew|sauce|chicken|beef|pork|curry|bread|cake|pizza|water)$/.test(sj.head || ''))) p = P('調理される', 'v1');
    if (vg.lemma === 'suffer' && !vg.passive && !o.hasObj && sj && !anim""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
