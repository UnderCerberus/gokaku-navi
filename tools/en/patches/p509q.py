import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# leave A with little / no B → AからBを奪う（can とも合う）。He left the room with his friend は対象外（B が量の語・抽象名詞のときだけ）
rep("""        const qLw = T[oLw.end + 1].w;
        const bLw = np(oLw.end + (/^(?:little|no|few)$/.test(qLw) ? 2 : 1), lim, {});
        if (bLw) {
          const eLw = tail(bLw.end, lim, st, o, vg);
          if (eLw === lim) {
            name('idiom');
            const negLw = /^(?:little|no|few)$/.test(qLw);
            const objLw = oLw.ja.replace(/^それら$/, '彼ら');
            return done(vg, P(negLw ? objLw + 'には' + bLw.ja + 'が' + (qLw === 'no' ? '残らない' : 'ほとんど残らない') : objLw + 'に' + bLw.ja + 'を残す', negLw ? 'i' : 'v5'), st, lim, 'SVO', o, [], { noStative: true });
          }
        }""",
    """        const qLw = T[oLw.end + 1].w;
        const negLw = /^(?:little|no|few|nothing)$/.test(qLw);
        const bLw = qLw === 'nothing' ? { ja: 'すべて', end: oLw.end + 2 } : np(oLw.end + (negLw ? 2 : 1), lim, {});
        if (bLw && (negLw || /^(?:impression|impressions|feeling|feelings|sense|memory|memories|scar|scars|debt|debts|choice|choices|problem|problems|question|questions|doubt|doubts)$/.test(bLw.head || ''))) {
          const eLw = tail(bLw.end, lim, st, o, vg);
          if (eLw === lim) {
            name('idiom');
            const objLw = oLw.ja.replace(/^それら$/, '彼ら');
            return done(vg, P(negLw ? objLw + 'から' + bLw.ja + 'を奪う' : objLw + 'に' + bLw.ja + 'を残す', 'v5'), st, lim, 'SVO', o, [], { noStative: true });
          }
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
