import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Children who … are more confident than those whose parents … → 親が…子ども（比較の than those who / whose は文頭の複数名詞）
rep("""    if (/^(?:who|that)$/.test(T[j].w || '') && T[j + 1] && /^(?:do|does|did)$/.test(T[j + 1].w || '') && isW(T[j + 2], 'not') && (j + 3 >= lim || T[j + 3].k === 'p')) { name('relative'); return Object.assign({}, node, { ja: 'そうでない' + (node.pron === 'those' || /^それら$/.test(node.ja) ? '人々' : node.ja), end: j + 3, rel: true, an: true }); }""",
    """    const thoseHd = node.pron === 'those' && typeof node.end === 'number' && node.end >= 2 && isW(T[node.end - 2], 'than') ? (() => {
      for (let x = node.end - 3; x > 0; x--) {   // than の前の「複数名詞 + who」（比べる相手）。those や that 節の切れ目で止める
        if (T[x].k !== 'w') continue;
        if (isW(T[x], 'those')) return null;
        if (isW(T[x], 'that') && T[x - 1].k === 'w' && !!vc(T[x - 1], ['base', '3sg', 'past']) && !nounC(T[x - 1])) return null;
        if (!/^(?:who|that)$/.test(T[x].w)) continue;
        const cH = T[x - 1].k === 'w' && !PRON[T[x - 1].w] ? cand(T[x - 1], '名', ['pl']) : null;
        if (cH && cH.e && !cand(T[x - 1], '名', ['base']) && (isPerson(cH) || PERSONS[cH.lemma] || ANIMAL_N.test(T[x - 1].w)) && !/^(?:people|persons)$/.test(T[x - 1].w)) return en.jp.first(cH.e.ja);
        return null;
      }
      return null;
    })() : null;   // Children who … than those whose parents … → 子ども
    if (/^(?:who|that)$/.test(T[j].w || '') && T[j + 1] && /^(?:do|does|did)$/.test(T[j + 1].w || '') && isW(T[j + 2], 'not') && (j + 3 >= lim || T[j + 3].k === 'p')) { name('relative'); return Object.assign({}, node, { ja: 'そうでない' + (thoseHd || (node.pron === 'those' || /^それら$/.test(node.ja) ? '人々' : node.ja)), end: j + 3, rel: true, an: true }); }""")
rep("""    const headJa = node.pron === 'those' ? '人々' : (node.pron === 'anyone'""",
    """    const headJa = node.pron === 'those' ? (thoseHd || '人々') : (node.pron === 'anyone'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
