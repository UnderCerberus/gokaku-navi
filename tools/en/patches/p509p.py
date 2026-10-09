import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# leave them with little time for other activities → 彼らには他の活動の時間がほとんど残らない / leave A with B → AにBを残す
rep("""    // The rumor turned out to be false → うわさは誤りだと分かった（turn out to be + 形容詞）
    if (L === 'turn' && !vg.passive && seq(i, ['out', 'to', 'be']) && i + 3 < lim) {""",
    """    if (L === 'leave' && i + 2 < lim) {
      const mLw = mark();
      const oLw = np(i, lim, { noRel: true, noCoord: true });
      if (oLw && isW(T[oLw.end], 'with') && oLw.end + 1 < lim) {
        const qLw = T[oLw.end + 1].w;
        const bLw = np(oLw.end + (/^(?:little|no|few)$/.test(qLw) ? 2 : 1), lim, {});
        if (bLw) {
          const eLw = tail(bLw.end, lim, st, o, vg);
          if (eLw === lim) {
            name('idiom');
            const negLw = /^(?:little|no|few)$/.test(qLw);
            const objLw = oLw.ja.replace(/^それら$/, '彼ら');
            return done(vg, P(negLw ? objLw + 'には' + bLw.ja + 'が' + (qLw === 'no' ? '残らない' : 'ほとんど残らない') : objLw + 'に' + bLw.ja + 'を残す', negLw ? 'i' : 'v5'), st, lim, 'SVO', o, [], { noStative: true });
          }
        }
      }
      fail(mLw);
    }
    // The rumor turned out to be false → うわさは誤りだと分かった（turn out to be + 形容詞）
    if (L === 'turn' && !vg.passive && seq(i, ['out', 'to', 'be']) && i + 3 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
