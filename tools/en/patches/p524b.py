import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# how little time we had → どれほどわずかな時間しか持っていなかったか（how + little / few + 名詞）
rep("""        if (nx.w === 'many' && isW(T[i + 2], 'times')) return { end: i + 3, type: 'adv', ja: '何回', be: '何回' };   // How many times have you been there? → 何回""",
    """        if (nx.w === 'many' && isW(T[i + 2], 'times')) return { end: i + 3, type: 'adv', ja: '何回', be: '何回' };   // How many times have you been there? → 何回
        if ((nx.w === 'little' || nx.w === 'few') && i + 3 < lim && T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !PREP[T[i + 2].w]) {
          const mLf = mark();
          const nLf = np1(i + 2, lim, { noRel: true, noPost: true, noCoord: true });
          if (nLf && !nLf.pron) return { end: nLf.end, type: 'np', node: { ja: 'どれほどわずかな' + nLf.ja, an: nLf.an, wh: true, whHead: nLf.head } };   // how little time we had
          fail(mLf);
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
