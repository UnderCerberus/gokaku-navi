import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# within a few seconds of meeting them → 彼らに会ってから数秒以内に / within an hour of arrival → 到着から1時間以内に
rep("""    // ask questions rather than simply memorize facts → ただ事実を暗記するのではなく（rather than + 原形の動詞句）""",
    """    if (key === 'within' && !idi && j + 3 < lim) {
      const mWi = mark();
      const dWi = np(j, lim, { noRel: true, noPost: true, noCoord: true });
      if (dWi && (dWi.dur || /(?:秒|分|時間|日|週間|か月|年)$/.test(dWi.ja || '')) && isW(T[dWi.end], 'of') && dWi.end + 1 < lim) {
        const gWi = T[dWi.end + 1].k === 'w' && !!vc(T[dWi.end + 1], ['ing']) && DET[T[dWi.end + 1].w] === undefined ? vpNonfin(dWi.end + 1, lim, 'ing', {}) : null;
        if (gWi && verbal(gWi.pred)) return { ja: vpJoin(gWi, 'te') + 'から' + dWi.ja + '以内に', kind: 'time', end: gWi.end, prep: 'within' };
        const nWi = np(dWi.end + 1, lim, { noRel: true });
        if (nWi && !nWi.an && !nWi.pron) return { ja: nWi.ja + 'から' + dWi.ja + '以内に', kind: 'time', end: nWi.end, prep: 'within' };
      }
      fail(mWi);
    }
    // ask questions rather than simply memorize facts → ただ事実を暗記するのではなく（rather than + 原形の動詞句）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
