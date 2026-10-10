import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# compare their results with those of researchers → 研究者の結果と（比較の those of は直前の複数名詞。限定詞・所有格のあとの results は名詞）
rep("""const cPl = cand(T[x], '名', ['pl']); if (cPl && cPl.e && !vc(T[x], ['3sg']) && !(T[x + 1] && T[x + 1].k === 'w' && nounC(T[x + 1]) && !PREP[T[x + 1].w] && x + 1 < i - 1)) return en.jp.first(cPl.e.ja);""",
    """const cPl = cand(T[x], '名', ['pl']); if (cPl && cPl.e && (!vc(T[x], ['3sg']) || (x > 0 && (T[x - 1].k === 'pos' || DET[T[x - 1].w] !== undefined))) && !(T[x + 1] && T[x + 1].k === 'w' && nounC(T[x + 1]) && !PREP[T[x + 1].w] && x + 1 < i - 1)) return en.jp.first(cPl.e.ja);""")

# books that criticized those in power → 権力を持つ人々を批判した本（in power → 権力を持つ）
rep("""      case 'in':
        if (few) return R(n + 'で', 'other', n + 'での');""",
    """      case 'in':
        if (few) return R(n + 'で', 'other', n + 'での');
        if (obj.head === 'power' && !obj.det && !obj.pron && n === '力') return R('権力を握って', 'other', '権力を持つ');   // those in power → 権力を持つ人々""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
