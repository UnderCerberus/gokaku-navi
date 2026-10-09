import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Many people buy more than they need → 多くの人々が必要以上に買う（more / less than + 主語 + need / want は量の副詞。彼らより多く必要を にしない）
rep("""      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && isW(T[j0 + 1], 'one')""",
    """      if (t.k === 'w' && /^(?:more|less)$/.test(t.w) && j0 === j && objs.length === 0 && !vg.passive && isW(T[j0 + 1], 'than') && j0 + 2 < lim) {
        let kMt = -1, jaMt = '';
        if (isW(T[j0 + 2], 'necessary')) { kMt = j0 + 3; jaMt = t.w === 'more' ? '必要以上に' : '必要より少なく'; }
        else if (T[j0 + 2].k === 'w' && PRON[T[j0 + 2].w] && PRON[T[j0 + 2].w].sub && T[j0 + 3] && /^(?:need|needs|needed|want|wants|wanted|require|requires|required)$/.test(T[j0 + 3].w || '')) { kMt = j0 + 4; jaMt = /^(?:want|wants|wanted)$/.test(T[j0 + 3].w) ? (t.w === 'more' ? '欲しい以上に' : '欲しいより少なく') : (t.w === 'more' ? '必要以上に' : '必要より少なく'); if (isW(T[kMt], 'to') && T[kMt + 1] && T[kMt + 1].k === 'w' && !!vc(T[kMt + 1], ['base'])) kMt += 2; }
        if (kMt > 0 && kMt <= lim && (kMt === lim || T[kMt].k === 'p' || (T[kMt].k === 'w' && (!!PREP[T[kMt].w] || /^(?:and|but|so|because|when|if|every|each|today|now)$/.test(T[kMt].w))))) { st.manner.push(jaMt); j = kMt; continue; }
      }
      if (t.k === 'w' && t.w === 'only' && j0 === j && objs.length === 0 && !vg.passive && !vg.neg && isW(T[j0 + 1], 'one')""")

# in the back of their refrigerators → 冷蔵庫の奥に / in the back of the classroom → 教室の後ろに（back of + 入れ物・部屋 は 背中 ではない）
rep("""      if (isW(t, 'of') && node.head === 'rest' && !node.pron && j + 1 < lim) {""",
    """      if (isW(t, 'of') && node.head === 'back' && !node.pron && /背中/.test(node.ja || '') && j + 1 < lim) {
        const mBk2 = mark();
        const nBk2 = np(j + 1, lim, { noRel: true, noCoord: true });
        const deepBk = !!nBk2 && /(?:^| )(?:refrigerator|refrigerators|fridge|fridges|drawer|drawers|closet|closets|cupboard|cupboards|cabinet|cabinets|shelf|shelves|cave|caves|mouth|throat|mind|minds|freezer|freezers|bag|bags|box|boxes|garden|forest|shop|store)$/.test(nBk2.head || '');
        const rearBk = !!nBk2 && /(?:^| )(?:classroom|classrooms|room|rooms|bus|buses|car|cars|hall|line|queue|house|houses|building|buildings|church|theater|theatre|train|plane|truck|class|stage)$/.test(nBk2.head || '');
        if (deepBk || rearBk) { node = Object.assign({}, node, { ja: nBk2.ja + (deepBk ? 'の奥' : 'の後ろ'), end: nBk2.end, head: deepBk ? 'back-deep' : 'back-rear' }); continue; }
        fail(mBk2);
      }
      if (isW(t, 'of') && node.head === 'rest' && !node.pron && j + 1 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
