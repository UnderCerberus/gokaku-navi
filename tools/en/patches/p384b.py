import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# hot countries like Ghana → ガーナのような暑い国（複数の名詞 + like + 例）
rep("""      if (node.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them)$/.test(node.pron) && t.k === 'w' && PREP[t.w] && t.w !== 'of') break;   // I want to tell you about my favorite place""",
    """      if (node.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them)$/.test(node.pron) && t.k === 'w' && PREP[t.w] && t.w !== 'of') break;   // I want to tell you about my favorite place
      if (isW(t, 'like') && !node.pron && node.pl && j + 1 < lim && T[j + 1].k === 'w' && (T[j + 1].cap || !!nounC(T[j + 1])) && !BE[T[j + 1].w]) {
        const mLk2 = mark();
        const nLk2 = np(j + 1, lim, { noRel: true });
        if (nLk2 && (nLk2.proper || nLk2.pl || nLk2.coord) && !(nLk2.end < lim && T[nLk2.end].k === 'w' && (!!vc(T[nLk2.end], ['base', '3sg', 'past']) && !nounC(T[nLk2.end])))) { node = Object.assign({}, node, { ja: nLk2.ja + 'のような' + node.ja, end: nLk2.end }); continue; }   // hot countries like Ghana → ガーナのような暑い国
        fail(mLk2);
      }""")

rep("""    ja = ja.replace(/(木|つる)で(成長|育)(する|つ)(?=。|$)/, '$1になる');""",
    """    ja = ja.replace(/(木|つる)で(成長|育)(する|つ)(?=。|$)/, '$1になる').replace(/世界中で(工場|国|人々|学校|都市|店|大学|博物館|空港)(に|へ|で|から)/g, '世界中の$1$2').replace(/(カカオ豆|豆|原料|牛乳|ミルク|植物|葉|小麦|米|大豆)から来る(?=。|$)/, '$1から作られる');   // factories around the world → 世界中の工場に / It comes from cacao beans → カカオ豆から作られる""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
