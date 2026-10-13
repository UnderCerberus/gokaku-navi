import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I no longer mind as much as I used to → もはや以前ほど気にしない（no longer は否定。「以前と同じくらい…ない」にしない）
rep("""        const cmp0 = ((vg && vg.neg) || T.slice(0, j).some((x) => x.k === 'w' && /^(?:nothing|nobody|none|no|never)$/.test(x.w))) && !pre0 ? 'ほど' : 'と同じくらい';""",
    """        const cmp0 = ((vg && vg.neg) || T.slice(0, j).some((x) => x.k === 'w' && /^(?:nothing|nobody|none|no|never|nolonger)$/.test(x.w))) && !pre0 ? 'ほど' : 'と同じくらい';""")

# I no longer read as many books as I used to → 以前ほど多くの本
rep("""          if (elA && /^(?:以前|今まで|いつも)$/.test(elA) && !mu) { const ngA = T.slice(0, i).some((x) => x.k === 'w' && /^(?:not|never|don't|""",
    """          if (elA && /^(?:以前|今まで|いつも)$/.test(elA) && !mu) { const ngA = T.slice(0, i).some((x) => x.k === 'w' && /^(?:not|never|nolonger|don't|""")

# She is no longer as young as she was → もはや以前ほど若くない / The city is not as busy as it was → 以前ほど（主語と同じものを指す代名詞 + was/were で主節が現在なら「以前」。「彼女ほど」「それほど」にしない）
rep("""            const pj = PRON[T[k2 + 1].w].ja || '';
            const ngA = vg.neg;""",
    """            const sameE = /^(?:was|were)$/.test(T[k2 + 2].w) && !vg.past && !ppE && !ppA && !!sj && (sj.pron ? samePerson(sj.pron, T[k2 + 1].w) : (sj.pl ? T[k2 + 1].w === 'they' : /^(?:it|he|she)$/.test(T[k2 + 1].w)));
            const pj = sameE ? '以前' : (PRON[T[k2 + 1].w].ja || '');
            const ngA = vg.neg || T.slice(i, k).some((x) => x.k === 'w' && /^(?:never|nolonger)$/.test(x.w));""")

# I no longer read as many books as I used to → 読まない（比較の as / than + 代名詞 + used to / did / was は主節の時制の手がかりにしない。「読まなかった」にしない）
rep("""    return T.some((x, q) => q !== i && x.k === 'w' && (/^(?:was|were|did|could|yesterday|ago)$/.test(x.w) ||""",
    """    return T.some((x, q) => q !== i && x.k === 'w' && !(q >= 2 && q > i && /^(?:as|than)$/.test(T[q - 2].w || '') && T[q - 1].k === 'w' && !!PRON[T[q - 1].w] && !!PRON[T[q - 1].w].sub && /^(?:used|did|was|were)$/.test(x.w)) && (/^(?:was|were|did|could|yesterday|ago)$/.test(x.w) ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
