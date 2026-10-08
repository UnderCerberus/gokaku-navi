import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Spending by consumers fell（名詞にもなる -ing + by / on / of は名詞として読む → 消費者による支出）
rep("""    if (ingVerb(a, s)) {       // 動名詞""",
    """    if (ingVerb(a, s) && !(!!cand(T[a], '名', ['base']) && T[a + 1] && T[a + 1].k === 'w' && /^(?:by|of)$/.test(T[a + 1].w))) {       // 動名詞""")

# reduce spending by consumers（動名詞をとらない動詞のあとの、名詞にもなる -ing は名詞）
rep("""    const mwIng = ingVerb(i, lim) ? multiAt(i, lim) : null;   // offer training programs（辞書の複合名詞）は動名詞にしない""",
    """    const mwIng0 = ingVerb(i, lim) ? multiAt(i, lim) : null;   // offer training programs（辞書の複合名詞）は動名詞にしない
    const nounIng = !GERV[L] && ingVerb(i, lim) && !!cand(T[i], '名', ['base']) && T[i + 1] && T[i + 1].k === 'w' && /^(?:by|of|on)$/.test(T[i + 1].w);   // reduce spending by consumers → 消費者による支出を減らす
    const mwIng = mwIng0;""")

rep("""    if ((ingVerb(i, lim) || (isW(T[i], 'not') && i + 1 < lim && ingVerb(i + 1, lim) && GERV[L])) && (GERV[L] || en.jp.senses(vg.e ? vg.e.ja : '').some((s) => s.tr)) && !(mwIng""",
    """    if ((ingVerb(i, lim) || (isW(T[i], 'not') && i + 1 < lim && ingVerb(i + 1, lim) && GERV[L])) && (GERV[L] || en.jp.senses(vg.e ? vg.e.ja : '').some((s) => s.tr)) && !nounIng && !(mwIng""")

# in an attempt to / in an effort to → in order to（〜するために）
rep(r"""      .replace(/\bthan ever before\b/g, 'than ever')""",
    r"""      .replace(/\bthan ever before\b/g, 'than ever')
      .replace(/\b([Ii])n an? (?:attempt|effort|bid) to\b/g, '$1n order to')   // in an attempt to slow inflation → インフレを抑えるために""")

rep("""  const NAME_JA = dic({ neil: 'ニール', """,
    """  const NAME_JA = dic({ harvard: 'ハーバード大学', stanford: 'スタンフォード大学', yale: 'イェール大学', princeton: 'プリンストン大学', neil: 'ニール', """)

rep("""    ja = ja.replace(/、そのことが(それら|それ|彼ら|彼女|彼)を([^、。]+?)(く|に)した/g, '、そのため$1は$2$3なった');""",
    """    ja = ja.replace(/、そのことが(それら|それ|彼ら|彼女|彼)を([^、。]+?)(く|に)した/g, '、そのため$1は$2$3なった');
    ja = ja.replace(/([^、。をがは]{1,12})への(研究者|科学者|学生|教授|医師|医者|専門家|職員|労働者|教師|先生)/g, '$1の$2').replace(/の中に落ち/g, 'に落ち');   // researchers at Harvard → ハーバード大学の研究者 / fell into the river → 川に落ちた""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
