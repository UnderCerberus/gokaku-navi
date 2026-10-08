import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""            name('inf-adj');
            if (thereQ && !remQ) name('there');
            return { ok: true, ja: (subjQ ? subjQ.ja + 'は' : '') + (stillQ && !lowQ ? 'まだ' : '') + sQ + (remQ ? 'べき' : '') + nQ + (lowQ ? 'は' : 'が') + prQ + '。', sp: '', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };""",
    """            name('inf-adj');
            if (thereQ && !remQ) name('there');
            if (lemQ === 'offer' && sQ === '提供する' && subjQ && !lowQ) return { ok: true, ja: subjQ.ja + 'には魅力が' + prQ + '。', sp: '', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };   // Kyoto has a lot to offer → 京都には魅力がたくさんある
            let topQ = subjQ ? subjQ.ja + 'は' : '';
            const mPl = thereQ && !remQ ? /^([^、。をがはに]{1,12})で(見る|やる|する|楽しむ|学ぶ|訪れる)$/.exec(sQ) : null;   // There is a lot to see in Kyoto → 京都には見るものがたくさんある
            if (mPl) { topQ = mPl[1] + 'には'; sQ = mPl[2]; }
            return { ok: true, ja: topQ + (stillQ && !lowQ ? 'まだ' : '') + sQ + (remQ ? 'べき' : '') + nQ + (lowQ ? 'は' : 'が') + prQ + '。', sp: '', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
