import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He even cried → 彼は泣きさえした / Children may even feel sad → 悲しくさえあるかもしれない（目的語・前置詞句のない述語の even は述語につける。「彼はさえ泣いた」にしない）
rep("""    let f = finish(vg, core, st, Object.assign({}, o, { hasObj: (objStrs || []).some(Boolean) }));""",
    """    if (st.manner.indexOf('さえ') >= 0 && !/^(?:can|could)$/.test(vg.modal || '') && !T.some((x, q) => isW(x, 'even') && q > 0 && q >= vg.idx - 3 && q <= vg.idx + 1 && T[q - 1].k === 'w' && /^(?:and|or|but)$/.test(T[q - 1].w)) && !(objStrs || []).some(Boolean) && !st.other.length && !st.time.length && !st.freq.length && !(st.pre || []).length && !st.never && !st.just && !st.once && st.manner.length === 1) {
      const evP = verbal(core) ? P(core.form('stem') + 'さえする', 'suru') : (core.cls === 'i' ? P(core.form('adv') + 'さえある', 'aru') : (core.cls === 'da' ? P(core.form('bare') + 'でさえある', 'aru') : null));
      if (evP) { st.manner = []; core = evP; }
    }
    let f = finish(vg, core, st, Object.assign({}, o, { hasObj: (objStrs || []).some(Boolean) }));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
