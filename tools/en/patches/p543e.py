import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Even animals that are not usually thought of as intelligent, like fish and bees, may have … → 魚やミツバチのような、…動物さえ
# （コンマで挟んだ , like A and B , は名詞にかける例示。such as と同じ）
rep("""      // Many species, including elephants and dolphins, display … → ゾウやイルカを含む多くの種（コンマで挟んだ including）""",
    """      if (isP(t, ',') && !o.noApp && isW(T[j + 1], 'like') && j + 3 < lim && !node.pron) {
        let e4 = -1;
        for (let x = j + 3; x < lim; x++) { if (isP(T[x], ',')) { e4 = x; break; } }
        if (e4 > 0 && e4 < lim) {
          const mLk = mark();
          const nLk = np(j + 2, e4, { noRel: true });
          if (nLk && nLk.end === e4) { node = Object.assign({}, node, { ja: (nLk.itemsJa ? nLk.itemsJa.join('や') : nLk.ja) + 'のような' + (node.rel ? '、' : '') + node.ja, end: e4 + 1 }); continue; }
          fail(mLk);
        }
      }
      // Many species, including elephants and dolphins, display … → ゾウやイルカを含む多くの種（コンマで挟んだ including）""")

# 関係詞節の後ろのコンマ + like … も関係詞節に入れない（先行詞にかける）
rep("""    if (seq(j, ['such', 'as']) && j > 0 && isP(T[j - 1], ',') && o && ((o.gap && o.gap.rel) || (o.sub && o.subj && o.subj.wh))) return -1;""",
    """    if ((seq(j, ['such', 'as']) || isW(T[j], 'like')) && j > 0 && isP(T[j - 1], ',') && o && ((o.gap && o.gap.rel) || (o.sub && o.subj && o.subj.wh))) return -1;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
