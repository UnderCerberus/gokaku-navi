import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …, having been flooded when the dam was built → ダムが建設されたとき水浸しになって、もはや存在しない / He left the room, having finished his work → 仕事を終えて、部屋を出た
#（完了分詞 having + 過去分詞は前に済んだ動作「〜して」。ながら にしない。後ろの時・理由の節も分詞の中で読む）
rep("""    // 付帯状況の分詞（smiling / reading a book）
    if (ingVerb(j, lim)) {""",
    """    if (isW(t, 'having') && j + 1 < lim && T[j + 1].k === 'w' && (isW(T[j + 1], 'been') || !!vc(T[j + 1], ['pp']))) {
      const mHv = mark();
      let kS = -1, sS = null;
      for (let x = j + 2; x < lim - 1; x++) { const s2 = subAt(x, lim); if (s2 && /^(?:when|after|before|because|while|since|as|until)$/.test(s2.key) && !isP(T[x - 1], ',')) { kS = x; sS = s2; break; } }
      let gHv = kS > 0 ? vpNonfin(j, kS, 'ing', {}) : null;
      let scHv = gHv && gHv.end === kS ? sentence(kS + sS.len, lim, { sub: true }) : null;
      if (!(gHv && scHv)) { fail(mHv); kS = -1; scHv = null; gHv = vpNonfin(j, lim, 'ing', {}); }
      if (gHv && gHv.pred && !gHv.neg) {
        name('participle-const');
        const preHv = scHv ? subStr(sS.key, scHv, {}, null).replace(/、$/, '') : '';
        const teHv = !verbal(gHv.pred) && /だ$/.test(gHv.pred.s) && T.slice(j, gHv.end).some((x) => isW(x, 'been')) ? gHv.pred.s.replace(/だ$/, 'になって') : gHv.pred.form('te');   // having been flooded → 水浸しになって
        (st.pre = st.pre || []).push(preHv + gHv.parts.join('') + teHv + '、');
        return kS > 0 ? lim : gHv.end;
      }
      fail(mHv);
    }
    // 付帯状況の分詞（smiling / reading a book）
    if (ingVerb(j, lim)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
# done() の先頭に st.pre（もはや などより前）
rep("""    const parts = [];
    // was laughed at by his classmates → 同級生に笑われた（作品・発見の受け身だけ によって）""",
    """    const parts = [];
    (st.pre || []).forEach((x) => parts.push(x));   // 完了分詞の句など、頻度の副詞（もはや）より前に置くもの
    // was laughed at by his classmates → 同級生に笑われた（作品・発見の受け身だけ によって）""")
# , having … の分詞句の中の when などで文を分けない
rep("""      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）""",
    """      if (/^(?:because|why|how)$/.test(T[j].w) && T[j - 1].k === 'w' && BE[T[j - 1].w]) continue;      // This may be because … は be の補語（parseBe で読む）
      if (/^(?:when|after|before|because|while|since|as|until)$/.test(s2.key) && !isP(T[j - 1], ',') && T.slice(a + 1, j).some((x, q) => isW(x, 'having') && isP(T[a + q], ',') && !T.slice(a + q + 2, j).some((y) => isP(y, ',')))) continue;   // …, having been flooded when the dam was built（分詞句の中の when）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
