import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I had fried rice for lunch → 昼食にチャーハンを食べた（had + 料理名の複合語は完了形にしない）
rep("""      const v = verbAfter(j, lim, ['pp'], vg);
      if (v) { vg.perfect = true; return setMain(v); }
      j = sv.j; vg.neg = sv.n; vg.advs.length = sv.a;""",
    """      const foodPp = j < lim && T[j].k === 'w' && /^(?:fried|boiled|scrambled|grilled|baked|smoked|frozen|canned|dried|whipped|mashed|sliced)$/.test(T[j].w) && !!multiAt(j, lim);
      const v = foodPp ? null : verbAfter(j, lim, ['pp'], vg);
      if (v) { vg.perfect = true; return setMain(v); }
      j = sv.j; vg.neg = sv.n; vg.advs.length = sv.a;""")

# I love freshly baked bread（限定詞なしの 副詞 + 過去分詞 + 名詞）
rep("""        (T[j].k === 'w' && /^(?:growing|rising|increasing|declining|decreasing|falling)$/.test(T[j].w) && j + 1 < lim && T[j + 1].k === 'w' &&""",
    """        (T[j].k === 'w' && /^(?:freshly|newly|recently|carefully|specially|beautifully|well|badly|poorly)$/.test(T[j].w) && j + 2 < lim && T[j + 1].k === 'w' && !!vc(T[j + 1], ['pp']) && !vc(T[j + 1], ['base']) && T[j + 2].k === 'w' && !!nounC(T[j + 2]) && !PREP[T[j + 2].w]) ||
        (T[j].k === 'w' && /^(?:growing|rising|increasing|declining|decreasing|falling)$/.test(T[j].w) && j + 1 < lim && T[j + 1].k === 'w' &&""")

# carefully planned → 入念に計画された
rep("""        const aAp = t.w === 'well' ? 'よく' :""",
    """        const aAp = t.w === 'carefully' && /^(?:plan|prepare|design|organize|organise|craft|build|make)$/.test(pAp.lemma) ? '入念に' : t.w === 'well' ? 'よく' :""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
