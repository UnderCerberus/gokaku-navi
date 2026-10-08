import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# training programs（辞書の複合名詞 training program）は動名詞 + 目的語にしない
rep("""  function gerundNP0(j, lim) {
    const t = T[j];
    if (!t || !ingVerb(j, lim)) return null;
""", """  function gerundNP0(j, lim) {
    const t = T[j];
    if (!t || !ingVerb(j, lim)) return null;
    { const mwG = multiAt(j, lim); if (mwG && mwG.len >= 2 && T[j + 1] && T[j + 1].k === 'w' && !!nounC(T[j + 1]) && !(j + mwG.len < lim && T[j + mwG.len].k === 'w' && !!nounC(T[j + mwG.len]) && !PREP[T[j + mwG.len].w])) return null; }   // offer training programs → 研修プログラムを提供する
""")

# free people to focus on … → enable（人々が…に集中することを可能にする）
rep(r"""      .replace(/\bin the same way (?:that|as) """,
    r"""      .replace(/\b(free|frees|freed)\s+((?:up\s+)?(?:(?:the|our|their|many|more|some|local)\s+)?(?:people|workers|employees|staff|teachers|doctors|nurses|students|parents|humans|farmers|scientists|them|us|him|her|me|you))\s+to\s+(?=[a-z])/g, (m0, v0, o0) => ({ free: 'enable', frees: 'enables', freed: 'enabled' })[v0] + ' ' + o0.replace(/^up\s+/, '') + ' to ')   // this shift will free people to focus on … → 人々が…に集中することを可能にする
      .replace(/\bin the same way (?:that|as) """)

rep("""    ja = ja.replace(/働き方や生き方/g, '働き方や暮らし方')""",
    """    ja = ja.replace(/より多くの([^、。をがはにでの]{1,8}?(?:的な|可能な|やすい|にくい))/g, 'より$1');   // more creative activities → より創造的な活動
    if (tokens.some((x) => /^(?:concern|concerns)$/.test(x.w || '')) && tokens.some((x) => /^(?:address|addressed|addressing|express|expressed|expresses|raise|raised|raises|voice|voiced|growing|share|shared|serious|safety)$/.test(x.w || ''))) ja = ja.replace(/関心/g, '懸念');   // To address these concerns → これらの懸念に対処するために
    ja = ja.replace(/働き方や生き方/g, '働き方や暮らし方')""")

# 第 477 組の translate1 の free 規則は tokenizer の書き換え（enable）に置き換える
start = s.index("    // This shift will free people to focus on creative work. → この変化は人々が創造的な仕事に集中できるようにするだろう（free O to do）")
end = s.index("    // She went to the store only to find it closed.")
s = s[:start] + s[end:]

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
