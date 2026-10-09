import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The last thing I wanted was to make my parents worry → 私が最も望まなかったことは…（the last thing S want(ed) = いちばんしたくないこと。最後のこと にしない）
rep("""    // the first few months → 最初の数か月（the first few + 期間の名詞）""",
    """    if (seq(i, ['the', 'last', 'thing']) && i + 4 < lim && T[i + 3].k === 'w') {
      let kLt = i + 3;
      if (isW(T[kLt], 'that')) kLt++;
      let vLt = -1;
      for (let x = kLt + 1; x < Math.min(lim, kLt + 5); x++) if (/^(?:want|wants|wanted|need|needs|needed|expect|expects|expected|would)$/.test(T[x].w || '')) { vLt = x; break; }
      if (vLt > kLt) {
        const mLt = mark();
        const sjLt = subject(kLt, vLt);
        const vEnd = isW(T[vLt], 'would') && isW(T[vLt + 1], 'want') ? vLt + 2 : vLt + 1;
        if (sjLt && sjLt.end === vLt && vEnd <= lim && (vEnd === lim || T[vEnd].k !== 'w' || BE[T[vEnd].w] || isW(T[vEnd], 'to') || MODAL[T[vEnd].w])) {
          const lemLt = /^(?:need|needs|needed)$/.test(T[vLt].w) ? 'need' : (/^(?:expect|expects|expected)$/.test(T[vLt].w) ? 'expect' : 'want');
          const pastLt = /^(?:wanted|needed|expected)$/.test(T[vLt].w);
          const vjLt = { want: '望ま', need: '必要とし', expect: '予想し' }[lemLt] + (pastLt ? 'なかった' : 'ない');
          return { ja: (sjLt.pron === 'i' ? '私' : sjLt.ja) + 'が最も' + vjLt + 'こと', end: vEnd, head: 'thing' };   // the last thing I wanted → 私が最も望まなかったこと
        }
        fail(mLt);
      }
    }
    // the first few months → 最初の数か月（the first few + 期間の名詞）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
