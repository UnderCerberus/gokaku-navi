import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# arrange the chairs / the letters were arranged → 並べる（物を並べる arrange。会議・旅行は 手配する のまま）
rep("""    'take|measure measures step steps|を|講じる',""",
    """    'take|measure measures step steps|を|講じる',
    'arrange|letter letters word words chair chairs desk desks table tables book books flower flowers furniture item items piece pieces card cards picture pictures photo photos number numbers block blocks stone stones|を|並べる',
    'cast|statue statues bell bells type metal coin coins letter letters piece pieces|を|鋳造する',""")
rep("""    if (vg.passive && !objs.length && o.subj && VOBJ[L] && /^(?:present|conduct|launch|implement|enforce|pass|perform|produce|build|raise|set|meet|address|tackle|overcome|break|pose|take|save|keep|miss|seize)$/.test(L)""",
    """    if (vg.passive && !objs.length && o.subj && VOBJ[L] && /^(?:present|conduct|launch|implement|enforce|pass|perform|produce|build|raise|set|meet|address|tackle|overcome|break|pose|take|save|keep|miss|seize|arrange|cast)$/.test(L)""")

# Each letter was cast … / the same letters could be arranged … to print → 文字（印刷・活字・つづりの文脈の letter）
rep("""    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');""",
    """    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');
    if (nom.head === 'letter' && /手紙$/.test(ja) && T.some((x) => x.k === 'w' && /^(?:print|printed|printing|prints|type|alphabet|alphabets|word|words|page|pages|spell|spelled|spelling|capital|cast|arranged|arrange|font|fonts|keyboard|uppercase|lowercase)$/.test(x.w)) && !T.some((x) => x.k === 'w' && /^(?:write|wrote|written|writes|send|sent|sends|mail|mailed|post|posted|receive|received|envelope|stamp|reply|replied|read)$/.test(x.w))) ja = ja.replace(/手紙$/, '文字');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
