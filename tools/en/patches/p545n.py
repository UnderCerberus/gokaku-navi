import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He visited only a few times → 数回しか訪れなかった / We met only twice → 2回しか会わなかった（only + 回数は目的語ではなく頻度。「いくつかの時間しか」にしない）
rep("""      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && j0 + 1 < lim && T[j0 + 1].k === 'w' && (DET[T[j0 + 1].w] !== undefined || (nounC(T[j0 + 1]) && !PREP[T[j0 + 1].w])) && !PRON[T[j0 + 1].w] && T[j0 + 1].k !== 'num') {""",
    """      if (t.k === 'w' && t.w === 'only' && j0 === j && !vg.neg && j0 + 1 < lim) {
        const NUMO = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', several: '数', few: '数' };
        let kO = j0 + 1, nO = '';
        if (isW(T[kO], 'once') || isW(T[kO], 'twice')) { nO = T[kO].w === 'once' ? '1' : '2'; kO++; }
        else {
          if (isW(T[kO], 'a') && isW(T[kO + 1], 'few')) { nO = '数'; kO += 2; } else if (T[kO] && (NUMO[T[kO].w] || /^[0-9]+$/.test(T[kO].s || ''))) { nO = NUMO[T[kO].w] || T[kO].s; kO++; }
          if (nO && isW(T[kO], 'times')) kO++; else nO = '';
        }
        const UNO = { day: '1日に', week: '週に', month: '月に', year: '年に', hour: '1時間に', minute: '1分間に' };
        const uO = nO && T[kO] && /^(?:a|an|per)$/.test(T[kO].w || '') && T[kO + 1] ? UNO[T[kO + 1].w] : undefined;
        if (uO) { st.other.push(uO + nO + '回しか'); st.neg = true; j = kO + 2; continue; }
        if (nO && (kO >= lim || T[kO].k === 'p' || (T[kO].k === 'w' && (!!PREP[T[kO].w] || /^(?:every|each|this|last|next|in)$/.test(T[kO].w))))) { st.other.push(nO + '回しか'); st.neg = true; j = kO; continue; }
      }
      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && j0 + 1 < lim && T[j0 + 1].k === 'w' && (DET[T[j0 + 1].w] !== undefined || (nounC(T[j0 + 1]) && !PREP[T[j0 + 1].w])) && !PRON[T[j0 + 1].w] && T[j0 + 1].k !== 'num') {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
