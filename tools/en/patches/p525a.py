import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# If it were not for ~ は既存の仮定法の読み（水がなければ、何も生きられないだろう）に任せる（p524c の notfor を外す）
rep("""      else if (seq(a, ['if', 'it', 'were', 'not', 'for']) || seq(a, ['if', 'it', 'was', 'not', 'for'])) { kF = a + 5; kindF = 'notfor'; }
""", "")
rep("""          if (objF) objF = (kindF === 'notfor' ? 'もし' : '') + objF + ({ cons: 'を考えると、', judge: 'から判断すると、', comes: 'となると、', notfor: 'がなければ、' })[kindF];""",
    """          if (objF) objF = objF + ({ cons: 'を考えると、', judge: 'から判断すると、', comes: 'となると、' })[kindF];""")
rep("""        const mnF = objF ? sentence(cF + 1, b, Object.assign({}, o, kindF === 'notfor' ? { subjunctive: true } : {})) : null;""",
    """        const mnF = objF ? sentence(cF + 1, b, o) : null;""")

# I take the train to work every day（乗り物 + to + 冠詞のない work / school … は「行きの」にしない → 電車で通勤している）
rep("""          if (nBk && !nBk.pron && !nBk.an && !nBk.time) { node = Object.assign({}, node, { ja: nBk.ja + (kBk === j + 2 ? 'へ戻る' : '行きの') + node.ja, end: nBk.end }); continue; }""",
    """          if (nBk && !nBk.pron && !nBk.an && !nBk.time && (kBk === j + 2 || DET[T[kBk].w] !== undefined || T[kBk].cap)) { node = Object.assign({}, node, { ja: nBk.ja + (kBk === j + 2 ? 'へ戻る' : '行きの') + node.ja, end: nBk.end }); continue; }""")

# from a ship to a train to a truck（from / to の目的語の乗り物 + to は経路の並び。「行きの」にしない）
rep("""        const kBk = isW(t, 'back') && isW(T[j + 1], 'to') ? j + 2 : (vehBk && isW(t, 'to') ? j + 1 : -1);""",
    """        let q0Bk = j - 1;
        while (q0Bk > 0 && T[q0Bk - 1].k === 'w' && (DET[T[q0Bk - 1].w] !== undefined || (!!adjC(T[q0Bk - 1]) && !vc(T[q0Bk - 1], ['base', 'past', '3sg'])) || (!!nounC(T[q0Bk - 1]) && !PREP[T[q0Bk - 1].w] && !vc(T[q0Bk - 1], ['base', 'past', '3sg', 'ing'])))) q0Bk--;
        const routeBk = q0Bk > 0 && /^(?:from|to)$/.test(T[q0Bk - 1].w || '');
        const kBk = isW(t, 'back') && isW(T[j + 1], 'to') ? j + 2 : (vehBk && isW(t, 'to') && !routeBk ? j + 1 : -1);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
