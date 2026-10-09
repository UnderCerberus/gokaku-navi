import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# caused flooding in many areas / the risk of flooding in the streets → 洪水（-ing 形そのものが名詞の見出しで、後ろが場所の前置詞なら名詞）
rep("""    if ((!nx || nx.k === 'p') && j > 0 && T[j - 1].k === 'w' && /^(?:keep|keeps|kept|keeping|stop|stops|stopped|start|starts|started|continue|continues|continued|finish|finishes|finished|quit|quits|enjoy|enjoys|enjoyed|practice|practiced|avoid|avoided|go|goes|went|gone|began|begin|begins)$/.test(T[j - 1].w)) return true;   // to keep learning → 学び続ける""",
    """    if ((!nx || nx.k === 'p') && j > 0 && T[j - 1].k === 'w' && /^(?:keep|keeps|kept|keeping|stop|stops|stopped|start|starts|started|continue|continues|continued|finish|finishes|finished|quit|quits|enjoy|enjoys|enjoyed|practice|practiced|avoid|avoided|go|goes|went|gone|began|begin|begins)$/.test(T[j - 1].w)) return true;   // to keep learning → 学び続ける
    { const cNo = cand(t, '名', ['base']); if (cNo && cNo.e && cNo.e.w === t.w && nx && nx.k === 'w' && /^(?:in|at|across|throughout|along|near|around|during)$/.test(nx.w) && j > 0 && T[j - 1].k === 'w' && (/^(?:of|cause|causes|caused|causing|prevent|prevents|prevented|reduce|reduces|reduced|see|saw|seen|cause|from|by|against|with|and)$/.test(T[j - 1].w) || DET[T[j - 1].w] !== undefined)) return false; }   // caused flooding in many areas → 洪水""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
