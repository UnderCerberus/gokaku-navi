import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# memory fades very quickly at first and then more slowly over time → 記憶は最初はとても速く、それから時間とともにもっとゆっくりと薄れる
# （副詞の並列で「and then」か、どちらかが 2 つ以上の副詞句なら、前後をまとまりのまま「、それから」でつなぐ。「最初はそのとき…」にしない）
rep("""    if (isW(t, 'and') && j + 1 < lim && T[j + 1].k === 'w' && (st.manner.length || st.time.length) && !PREP[T[j + 1].w] && !(isW(T[j + 1], 'then') && T[j + 2] && T[j + 2].k === 'w' && !!vc(T[j + 2], ['ing', 'base', 'past', '3sg'])) && (isW(T[j + 1], 'more') || isW(T[j + 1], 'less') || (advC(T[j + 1]) && !nounC(T[j + 1]) && !vc(T[j + 1], ['base', '3sg', 'past']) && DET[T[j + 1].w] === undefined))) {
      const mA = mark();""",
    """    if (isW(t, 'and') && j + 1 < lim && T[j + 1].k === 'w' && (st.manner.length || st.time.length) && !PREP[T[j + 1].w] && !(isW(T[j + 1], 'then') && T[j + 2] && T[j + 2].k === 'w' && !!vc(T[j + 2], ['ing', 'base', 'past', '3sg'])) && (isW(T[j + 1], 'more') || isW(T[j + 1], 'less') || (advC(T[j + 1]) && !nounC(T[j + 1]) && !vc(T[j + 1], ['base', '3sg', 'past']) && DET[T[j + 1].w] === undefined))) {
      const kAt = isW(T[j + 1], 'then') ? j + 2 : j + 1;
      if (vg && kAt < lim) {
        const mAt = mark();
        const st2 = newSt(vg);
        const e2 = tail(kAt, lim, st2, o, vg);
        const n1 = st.time.length + st.other.length + st.manner.length, n2 = st2.time.length + st2.other.length + st2.manner.length;
        if (e2 === lim && n2 && !st2.neg && (kAt > j + 1 || n1 >= 2 || n2 >= 2)) {
          const g1 = st.time.concat(st.other, st.manner).join('');
          const g2 = st2.time.concat(st2.other, st2.manner).join('');
          st.time = []; st.other = []; st.manner = [g1 + '、' + (kAt > j + 1 ? 'それから' : '') + g2];
          return lim;
        }
        fail(mAt);
      }
      const mA = mark();""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
