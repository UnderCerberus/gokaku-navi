import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) We are sorry for any inconvenience this may cause（決まり文句）
rep("""'we apologize for any inconvenience this may cause': 'ご不便をおかけして申し訳ありません', """,
    """'we apologize for any inconvenience this may cause': 'ご不便をおかけして申し訳ありません', 'we are sorry for any inconvenience this may cause': 'ご不便をおかけして申し訳ありません', 'we are sorry for any inconvenience': 'ご不便をおかけして申し訳ありません', 'i am sorry for any inconvenience this may cause': 'ご不便をおかけして申し訳ありません', """)

# 2) almost / nearly as well as a native speaker → 母語話者とほとんど同じくらい上手に
rep("""      const ja0 = isW(t, 'just') && isW(T[j + 1], 'as') ? j + 1 : j;""",
    """      const ja0 = (isW(t, 'just') || isW(t, 'almost') || isW(t, 'nearly')) && isW(T[j + 1], 'as') ? j + 1 : j;""")
rep("""        const a0 = wellAs ? { ja: '上手に' } : advC(T[ja0 + 1]), pre0 = ja0 > j ? 'ちょうど' : '';""",
    """        const a0 = wellAs ? { ja: '上手に' } : advC(T[ja0 + 1]), pre0 = ja0 > j ? (isW(t, 'just') ? 'ちょうど' : 'ほとんど') : '';""")

# 3) how to deal with failure → 失敗の扱い方（熟語の目的語が述語の中にあるときも を → の）
rep("""        (inf.pred.cls === 'suru' ? (inf.pred.s === 'する' ? 'やり方' : inf.pred.s.slice(0, -2) + 'の仕方') : (verbal(inf.pred) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain()) ? inf.pred.form('stem') + '方' : inf.pred.plain() + '方法'));""",
    """        (inf.pred.cls === 'suru' ? (inf.pred.s === 'する' ? 'やり方' : inf.pred.s.slice(0, -2).replace(/を([^を]*)$/, 'の$1') + 'の仕方') : (verbal(inf.pred) && !/(?:でいる|ている|である|になる)$/.test(inf.pred.plain()) ? inf.pred.form('stem').replace(/を([^を]*)$/, 'の$1') + '方' : inf.pred.plain() + '方法'));   // how to deal with failure → 失敗の扱い方""")

# 4) would rather spend money on travel than on cars（than + 前置詞句 → 車よりもむしろ旅行に）
rep("""      for (let y = x + 3; y < b - 1; y++) { if (isW(T[y], 'than') && T[y + 1].k === 'w' && vc(T[y + 1], ['base'])) { th = y; break; } }""",
    """      for (let y = x + 3; y < b - 1; y++) { if (isW(T[y], 'than') && T[y + 1].k === 'w' && vc(T[y + 1], ['base'])) { th = y; break; } }
      if (th < 0) {
        const thP = T.findIndex((q, y) => y > x + 3 && y < b - 1 && isW(q, 'than') && T[y + 1].k === 'w' && !!PREP[T[y + 1].w]);
        if (thP > 0) {
          const v1P = vpNonfin(x + 2, thP, 'base', { subj: sjR });
          const pp2 = v1P && v1P.end === thP ? parsePP(thP + 1, b, {}) : null;
          if (pp2 && pp2.end === b) { name('would-rather'); const stRp = newSt({}); return wrap({ out: () => sjR.ja + 'は' + pp2.ja.replace(/(?:に|で|には|では)$/, '') + 'よりもむしろ' + v1P.parts.join('') + INFV.want(v1P.pred, stRp).plain(), sp: 'SVO', subj: sjR }); }   // would rather spend money on travel than on cars → 車よりもむしろ旅行にお金を使いたい
        }
      }""")

# 5) at any time / at the last minute（時の決まり文句。at any time は 第 1・7 群で再発）
rep("""'without thinking': '何も考えずに', """,
    """'without thinking': '何も考えずに', 'at any time': 'いつでも', 'at the last minute': '直前に', """)

# 6) during the first few months → 最初の数か月の間に
rep("""    // a couple of days → 2、3日 / a couple of books → 2、3冊の本 / a couple of friends → 2、3人の友達""",
    """    // the first few months → 最初の数か月（the first few + 期間の名詞）
    if (seq(i, ['the', 'first', 'few']) && i + 3 < lim && T[i + 3].k === 'w') {
      const cFf = cand(T[i + 3], '名', ['pl']);
      if (cFf && DURUNIT[cFf.lemma] && UNIT[cFf.lemma]) return { ja: '最初の数' + UNIT[cFf.lemma], end: i + 4, head: cFf.lemma, dur: true, pl: true };
    }
    // a couple of days → 2、3日 / a couple of books → 2、3冊の本 / a couple of friends → 2、3人の友達""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
