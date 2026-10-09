import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# we realize how much it meant to us → それが私たちにとってどれほど大切だったか（mean much to ~ = 〜にとって大切だ。意味した にしない）
rep("""    // how hard it is to learn a foreign language → 外国語を学ぶのがどれほど難しいか（形式主語の it）
""",
    """    if (t.w === 'how' && isW(T[j + 1], 'much') && j + 4 < lim) {
      let kMn = -1;
      for (let x = j + 2; x < lim - 2; x++) if (/^(?:mean|means|meant)$/.test(T[x].w || '') && isW(T[x + 1], 'to')) { kMn = x; break; }
      let bMn = kMn;
      while (bMn > j + 2 && T[bMn - 1].k === 'w' && (HAVE[T[bMn - 1].w] || MODAL[T[bMn - 1].w] || /^(?:really|truly|still|always)$/.test(T[bMn - 1].w))) bMn--;
      if (kMn > 0 && bMn > j + 2) {
        const mMn = mark();
        const sjMn = subject(j + 2, bMn);
        const oMn = sjMn && sjMn.end === bMn ? np(kMn + 2, lim, {}) : null;
        if (oMn && oMn.end === lim) {
          name('indirect-q');
          const pastMn = (T[kMn].w === 'meant' || T.slice(bMn, kMn).some((x) => /^(?:had|would)$/.test(x.w || ''))) && !WH_MAINPAST;   // I realized how much it meant → どれほど大切か（主節が過去なら現在で訳す）
          const futMn = T.slice(bMn, kMn).some((x) => /^(?:will)$/.test(x.w || ''));
          return { str: sjMn.ja + 'が' + oMn.ja + 'にとってどれほど大切' + (pastMn ? 'だった' : (futMn ? 'になる' : '')) + 'か', end: lim };
        }
        fail(mMn);
      }
    }
    // how hard it is to learn a foreign language → 外国語を学ぶのがどれほど難しいか（形式主語の it）
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
