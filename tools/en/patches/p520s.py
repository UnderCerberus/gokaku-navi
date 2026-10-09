import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# relies largely on tourism, which brings in visitors from all over the country → 全国から訪問者を呼び込む観光業に頼っている
#（産業・施設・催しの名詞 + , which + 人を呼ぶ・雇う・生む動詞 は直前の名詞を受ける。文全体の「そのことが」にしない）
rep("""        if (first && !evalW && xv === x + 2 && T[xv].k === 'w' && !!vc(T[xv], ['base']) && !vc(T[xv], ['3sg', 'past']) && T[x - 1] && T[x - 1].k === 'w' && !!cand(T[x - 1], '名', ['pl'])) return null;""",
    """        if (first && !evalW && xv === x + 2 && T[xv].k === 'w' && !!vc(T[xv], ['base']) && !vc(T[xv], ['3sg', 'past']) && T[x - 1] && T[x - 1].k === 'w' && !!cand(T[x - 1], '名', ['pl'])) return null;
        if (first && !evalW && xv === x + 2 && T[x - 1] && T[x - 1].k === 'w' && /^(?:tourism|industry|agriculture|farming|fishing|trade|business|company|factory|festival|event|museum|park|zoo|university|school|hospital|airport|port|program|programme|project|service|website|app|platform|show|team|club|organization|market|mall|stadium|resort|attraction|plant|mine)$/.test(T[x - 1].w) && T[xv].k === 'w' && /^(?:brings?|brought|attracts?|attracted|draws?|drew|employs?|employed|provides?|provided|offers?|offered|produces?|produced|creates?|created|hires?|hired|supports?|supported|generates?|generated)$/.test(T[xv].w)) return null;   // tourism, which brings in visitors → 訪問者を呼び込む観光業""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
