import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# studying the night before a test → 試験の前の晩に勉強すること（the night / day / week + before / after + 名詞句 は時の副詞。目的語にしない）
rep("""      if (t.k === 'w' && /^(?:more|less)$/.test(t.w) && j0 === j && objs.length === 0 && !vg.passive && isW(T[j0 + 1], 'than') && j0 + 2 < lim) {""",
    """      if (isW(t, 'the') && T[j0 + 1] && /^(?:night|day|morning|evening|week|month|year|weekend)$/.test(T[j0 + 1].w || '') && T[j0 + 2] && /^(?:before|after)$/.test(T[j0 + 2].w || '') && j0 + 3 < lim && T[j0 + 3].k === 'w' && (DET[T[j0 + 3].w] !== undefined || !!nounC(T[j0 + 3]) || T[j0 + 3].cap)) {
        const mNb = mark();
        const nNb = np(j0 + 3, lim, { noRel: true, noCoord: true });
        if (nNb && !nNb.pron) { const UNb = { night: '晩', day: '日', morning: '朝', evening: '夕方', week: '週', month: '月', year: '年', weekend: '週末' }; st.time.push(nNb.ja + 'の' + (T[j0 + 2].w === 'before' ? '前の' : '後の') + UNb[T[j0 + 1].w] + 'に'); j = nNb.end; continue; }
        fail(mNb);
      }
      if (t.k === 'w' && /^(?:more|less)$/.test(t.w) && j0 === j && objs.length === 0 && !vg.passive && isW(T[j0 + 1], 'than') && j0 + 2 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
