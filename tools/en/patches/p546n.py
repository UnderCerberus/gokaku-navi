import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# only a limited number of crops, mostly leafy greens and herbs, can be grown … → 限られた数の作物（主に葉物野菜とハーブ）だけが…
# （名詞のあとの「, mostly / mainly / especially + 名詞句 ,」は中身を示す同格の挿入。かっこで名詞に添える）
rep("""      // 言い換えの同格: electronic books, or e-books, …（コンマで閉じるときだけ。閉じないなら or の並列）""",
    """      if (isP(t, ',') && !o.noApp && T[j + 1] && /^(?:mostly|mainly|chiefly|largely|primarily|especially|particularly|usually)$/.test(T[j + 1].w || '') && j + 3 < lim && !node.pron) {
        let e4 = -1;
        for (let x = j + 3; x < lim; x++) { if (isP(T[x], ',')) { e4 = x; break; } }
        if (e4 > 0 && e4 + 1 <= lim && T[e4 + 1] && T[e4 + 1].k === 'w' && (!!MODAL[T[e4 + 1].w] || !!BE[T[e4 + 1].w] || !!HAVE[T[e4 + 1].w] || !!DO[T[e4 + 1].w] || (!!vc(T[e4 + 1], ['3sg', 'past', 'base']) && !nounC(T[e4 + 1])))) {
          const mMs = mark();
          const nMs = np(j + 2, e4, { noRel: true });
          const advMs = ({ mostly: '主に', mainly: '主に', chiefly: '主に', largely: '主に', primarily: '主に', especially: '特に', particularly: '特に', usually: 'たいてい' })[T[j + 1].w];
          if (nMs && nMs.end === e4 && !nMs.pron) { node = Object.assign({}, node, { ja: node.ja + '（' + advMs + nMs.ja + '）', end: e4 + 1 }); continue; }
          fail(mMs);
        }
      }
      // 言い換えの同格: electronic books, or e-books, …（コンマで閉じるときだけ。閉じないなら or の並列）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
