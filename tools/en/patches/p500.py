import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) The challenge is how to support … / The key is what to do（疑問詞 + to 不定詞の補語をとる主語を広げる）
rep("""/^(?:question|problem|point|issue|mystery|thing|reason)$/.test(sj.head || ''))) {""",
    """/^(?:question|problem|point|issue|mystery|thing|reason|challenge|challenges|difficulty|key|task|goal|aim|purpose|secret|answer|trick|concern|worry|debate|focus|topic|lesson|decision|choice|matter|puzzle|dilemma|priority)$/.test(sj.head || ''))) {""")

# 2) Despite the fact that it rained, … / in spite of the fact that …（前置詞の目的語の the fact that は同格の that 節まで読む）
rep("""    let obj = null;
    // on what puzzled them / about what he said: what 節（〜こと）を「何 + 関係詞節」より先に試す""",
    """    let obj = null;
    if (j + 3 < lim && seq(j, ['the', 'fact', 'that'])) { const mFt = mark(); obj = np(j, lim, { noWhat: true }); if (!(obj && obj.end > j + 3)) { fail(mFt); obj = null; } }   // despite the fact that it rained → 雨が降ったという事実にもかかわらず
    // on what puzzled them / about what he said: what 節（〜こと）を「何 + 関係詞節」より先に試す""")
rep("""    if (T[j].k === 'w' && T[j].w === 'what' && !o.noWhat) obj = np(j, lim, { noRel: o.noRel, noCoord: o.noCoord, pp: !!o.ppObj });""",
    """    if (!obj && T[j].k === 'w' && T[j].w === 'what' && !o.noWhat) obj = np(j, lim, { noRel: o.noRel, noCoord: o.noCoord, pp: !!o.ppObj });""")

# 3) So far employees seem … → 今までのところ、（文頭の so far は接続詞の so にしない）
rep("""      if (t.first && /^(?:and|but|so|or|yet)$/.test(t.w) && !(t.w === 'so' && /^(?:few|little|many|much)$/.test((T[a + 1] || {}).w || '') && a + 3 < b)""",
    """      if (t.w === 'so' && isW(T[a + 1], 'far') && a + 3 < b) { lead += '今までのところ、'; a += isP(T[a + 2], ',') ? 3 : 2; continue; }
      if (t.first && /^(?:and|but|so|or|yet)$/.test(t.w) && !(t.w === 'so' && /^(?:few|little|many|much)$/.test((T[a + 1] || {}).w || '') && a + 3 < b)""")

# 4) As the climate continues to change → 変わり続けるにつれて（continue to + 変化の動詞）
rep("""|経つ|上昇する|低下する)$/.test(sc.pred.s) || (sc.pred && /(?:より|もっと|ますます).*(?:になる|くなる|ようになる)$/.test((sc.parts || []).join('') + sc.pred.s))) return S('attr', false) + 'につれて、';""",
    """|経つ|上昇する|低下する)$/.test(sc.pred.s) || (sc.pred && /^(?:変わり|増え|減り|成長し|広がり|上がり|下がり|高まり|進み|発展し|進化し|悪化し|改善し)続ける$/.test(sc.pred.s)) || (sc.pred && /(?:より|もっと|ますます).*(?:になる|くなる|ようになる)$/.test((sc.parts || []).join('') + sc.pred.s))) return S('attr', false) + 'につれて、';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
