import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# write just the first paragraph → 最初の段落だけを書く（just + 限定詞つきの目的語 → だけ。ちょうど にしない）
rep("""      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && j0 + 1 < lim && T[j0 + 1].k === 'w' && (DET[T[j0 + 1].w] !== undefined || (nounC(T[j0 + 1]) && !PREP[T[j0 + 1].w])) && !PRON[T[j0 + 1].w] && T[j0 + 1].k !== 'num') {""",
    """      if (t.k === 'w' && t.w === 'just' && j0 === j && objs.length === 0 && !vg.passive && j0 + 2 < lim && T[j0 + 1].k === 'w' && /^(?:the|a|an|one|this|that|these|those|my|your|his|her|our|their|its)$/.test(T[j0 + 1].w) && !(isW(T[j0 + 1], 'a') && /^(?:little|few|bit|lot)$/.test(T[j0 + 2].w || ''))) {
        const mJs = mark();
        const nJs = np(j0 + 1, lim, {});
        if (nJs && !nJs.num && !nJs.time && !nJs.pron) { objs.push(Object.assign({}, nJs, { ja: nJs.ja + 'だけ' })); j = nJs.end; continue; }
        fail(mJs);
      }
      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && j0 + 1 < lim && T[j0 + 1].k === 'w' && (DET[T[j0 + 1].w] !== undefined || (nounC(T[j0 + 1]) && !PREP[T[j0 + 1].w])) && !PRON[T[j0 + 1].w] && T[j0 + 1].k !== 'num') {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
