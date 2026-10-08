import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) Many foods, such as rice, wheat, and corn, were …（コンマで挟んだ such as の中の列挙のコンマで閉じない）
rep("""      if (isP(t, ',') && !o.noApp && seq(j + 1, ['such', 'as']) && j + 3 < lim && !node.pron) {
        let e2 = -1;
        for (let x = j + 3; x < lim; x++) { if (isP(T[x], ',')) { e2 = x; break; } }""",
    """      if (isP(t, ',') && !o.noApp && seq(j + 1, ['such', 'as']) && j + 3 < lim && !node.pron) {
        let e2 = -1;
        for (let x = j + 3; x < lim; x++) {
          if (!isP(T[x], ',')) continue;
          // rice, wheat, and corn: 列挙のコンマ（次が and / or、または 名詞 1〜2 語のあとに , / and が続く）は飛ばす
          const nx1 = T[x + 1], nx2 = T[x + 2], nx3 = T[x + 3];
          if (nx1 && nx1.k === 'w' && /^(?:and|or)$/.test(nx1.w)) continue;
          if (nx1 && nx1.k === 'w' && !!nounC(nx1) && !vc(nx1, ['3sg', 'past']) && ((nx2 && (isP(nx2, ',') || /^(?:and|or)$/.test(nx2.w || ''))) || (nx2 && nx2.k === 'w' && !!nounC(nx2) && nx3 && (isP(nx3, ',') || /^(?:and|or)$/.test(nx3.w || ''))))) continue;
          e2 = x; break;
        }""")

# 2) The foods were originally wild plants（be + -ly の副詞 + 形容詞 + 名詞 / 複数名詞の補語）
rep("""      (/ly$/.test(T[j].w) && !ADV[T[j].w] && advC(T[j]) && !adjC(T[j]) && T[j + 1].k === 'w' && (DET[T[j + 1].w] !== undefined || /^(?:why|how|because)$/.test(T[j + 1].w))))) {     // is simply a tool / is simply how …""",
    """      (/ly$/.test(T[j].w) && !ADV[T[j].w] && advC(T[j]) && !adjC(T[j]) && T[j + 1].k === 'w' && (DET[T[j + 1].w] !== undefined || /^(?:why|how|because)$/.test(T[j + 1].w) || (!!adjC(T[j + 1]) && T[j + 2] && T[j + 2].k === 'w' && !!nounC(T[j + 2]) && !!cand(T[j + 2], '名', ['pl']) && !PREP[T[j + 2].w]) || (!!cand(T[j + 1], '名', ['pl']) && !adjC(T[j + 1]) && !vc(T[j + 1], ['3sg', 'past', 'pp', 'ing'])))))) {     // is simply a tool / is simply how … / were originally wild plants""")

# 3) it can be developed through practice（be + developed + through / by … は受け身。developed countries の形容詞ではない）
rep("""    if (isAdjHead(T[r.idx])) return false;             // tired / interested / surprised は形容詞として扱う""",
    """    if (T[r.idx].w === 'developed' && (r.end >= lim || T[r.end].k === 'p' || /^(?:through|by|over|with|into|from|during|after|in|at)$/.test(T[r.end].w || ''))) return true;   // can be developed through practice → 練習を通して伸ばせる
    if (isAdjHead(T[r.idx])) return false;             // tired / interested / surprised は形容詞として扱う""")

# 4) something people are born with / something everyone needs（something の後の名詞が主語の接触節）
rep("""    if (!node.pron && !node.proper && DEPTH < 4 && j + 1 < e && T[j].k === 'w' && (/^(?:the|my|your|his|her|our|their|its|most|many|some|these|those|people)$/.test(w) || !!cand(T[j], '名', ['pl']))) {""",
    """    if ((!node.pron || /^(?:something|anything|everything|nothing)$/.test(node.pron)) && !node.proper && DEPTH < 4 && j + 1 < e && T[j].k === 'w' && (/^(?:the|my|your|his|her|our|their|its|most|many|some|these|those|people|everyone|everybody|someone|somebody|nobody|anyone)$/.test(w) || !!cand(T[j], '名', ['pl']))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
